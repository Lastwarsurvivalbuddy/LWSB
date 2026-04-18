'use client';

// src/app/battle-hq/[id]/plans/[planId]/edit/page.tsx
// Battle HQ V1.1 — Battle Plan Editor. COMPLETE.
// Creator + editor only. Viewers bounced.
//
// Sections:
//   1. Duplicate banner (if parent_plan_id)
//   2. Metadata (name, war type, scheduled_label, comms_channel)
//   3. Battle map upload + AnnotationCanvas embed
//   4. Rich text (orders, brief, intel)
//   5. Pre-war checklist editor (V1.1 — add/edit/reorder/disable)
//   6. Action bar (Save Draft / Publish / Archive / Unarchive / Delete)

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AnnotationCanvas, {
  type AnnotationsJson,
} from '@/components/battle-hq/AnnotationCanvas';
import ChecklistEditor from '@/components/battle-hq/ChecklistEditor';

// ---------- Types ----------
type Role = 'creator' | 'editor' | 'viewer';
export type PlanStatus = 'draft' | 'published' | 'active' | 'archived' | 'deleted';
export type WarType =
  | 'desert_storm'
  | 'warzone_duel'
  | 'canyon_storm'
  | 'svs'
  | 'alliance_mobilization'
  | 'other';

export interface BattlePlan {
  id: string;
  battle_hq_id: string;
  created_by_user_id: string;
  name: string;
  war_type: WarType;
  status: PlanStatus;
  scheduled_at: string | null;
  scheduled_label: string | null;
  comms_channel: string | null;
  orders: string | null;
  brief: string | null;
  intel: string | null;
  map_image_url: string | null;
  map_annotations_json: AnnotationsJson | null;
  parent_plan_id: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  archived_at: string | null;
  deleted_at: string | null;
}

interface BattleHq {
  id: string;
  slug: string;
  alliance_tag: string;
  server: string;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type MetaFieldKey = 'name' | 'war_type' | 'scheduled_label' | 'comms_channel';
type RichFieldKey = 'orders' | 'brief' | 'intel';
type AnyFieldKey = MetaFieldKey | RichFieldKey;
type PlanAction = 'publish' | 'archive' | 'unarchive' | 'delete' | null;

// ---------- Constants ----------
const MAPS_BUCKET = 'battle-hq-maps';
const SIGNED_URL_SECONDS = 60 * 60;
const ANNOTATION_SAVE_DEBOUNCE_MS = 1500;
const MAP_MAX_BYTES = 10 * 1024 * 1024;
const MAP_ALLOWED_MIMES = ['image/png', 'image/jpeg', 'image/webp'];

const WAR_TYPE_OPTIONS: { value: WarType; label: string }[] = [
  { value: 'desert_storm', label: 'Desert Storm' },
  { value: 'warzone_duel', label: 'Warzone Duel' },
  { value: 'canyon_storm', label: 'Canyon Storm' },
  { value: 'svs', label: 'SvS' },
  { value: 'alliance_mobilization', label: 'Alliance Mobilization' },
  { value: 'other', label: 'Other' },
];

const RICH_FIELD_META: Record<
  RichFieldKey,
  { label: string; placeholder: string; help: string }
> = {
  orders: {
    label: 'Orders',
    placeholder:
      'What every commander needs to do — rally schedules, targets, formations, fallback plans…',
    help: 'The actionable game plan. Keep it clear and numbered if possible.',
  },
  brief: {
    label: 'Brief',
    placeholder:
      'Context for this battle — objectives, stakes, timing windows, priority assignments…',
    help: 'The why behind the orders. Context for anyone reading the plan cold.',
  },
  intel: {
    label: 'Intel',
    placeholder:
      'What we know about the enemy — top players, strategies, power levels, hero combos, timing tells…',
    help: 'Enemy-specific intel for this battle. Standing intel from your HQ appears separately on the viewer.',
  },
};

const ALL_FIELD_KEYS: AnyFieldKey[] = [
  'name',
  'war_type',
  'scheduled_label',
  'comms_channel',
  'orders',
  'brief',
  'intel',
];

// ---------- Page ----------
export default function BattlePlanEditorPage() {
  const router = useRouter();
  const params = useParams<{ id: string; planId: string }>();
  const hqId = params?.id;
  const planId = params?.planId;

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [hq, setHq] = useState<BattleHq | null>(null);
  const [plan, setPlan] = useState<BattlePlan | null>(null);
  const [parentName, setParentName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [metaDraft, setMetaDraft] = useState<{
    name: string;
    war_type: WarType;
    scheduled_label: string;
    comms_channel: string;
  }>({
    name: '',
    war_type: 'other',
    scheduled_label: '',
    comms_channel: '',
  });
  const [richDraft, setRichDraft] = useState<{
    orders: string;
    brief: string;
    intel: string;
  }>({
    orders: '',
    brief: '',
    intel: '',
  });

  const initialSaveStates = Object.fromEntries(
    ALL_FIELD_KEYS.map((k) => [k, 'idle'])
  ) as Record<AnyFieldKey, SaveState>;
  const initialSaveMessages = Object.fromEntries(
    ALL_FIELD_KEYS.map((k) => [k, ''])
  ) as Record<AnyFieldKey, string>;
  const initialSavedTimers = Object.fromEntries(
    ALL_FIELD_KEYS.map((k) => [k, null])
  ) as Record<AnyFieldKey, number | null>;

  const [saveStates, setSaveStates] =
    useState<Record<AnyFieldKey, SaveState>>(initialSaveStates);
  const [saveMessages, setSaveMessages] =
    useState<Record<AnyFieldKey, string>>(initialSaveMessages);
  const savedTimerRef = useRef<Record<AnyFieldKey, number | null>>(
    initialSavedTimers
  );

  // --- Map state ---
  const [mapSignedUrl, setMapSignedUrl] = useState<string | null>(null);
  const [mapUploading, setMapUploading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapRemoving, setMapRemoving] = useState(false);
  const mapInputRef = useRef<HTMLInputElement | null>(null);

  // --- Annotations save state ---
  const [annotationsSaveState, setAnnotationsSaveState] =
    useState<SaveState>('idle');
  const [annotationsSaveMessage, setAnnotationsSaveMessage] = useState('');
  const annotationsDebounceRef = useRef<number | null>(null);
  const annotationsSavedTimerRef = useRef<number | null>(null);
  const annotationsInFlightRef = useRef(false);
  const annotationsPendingRef = useRef<AnnotationsJson | null>(null);
  const latestAnnotationsRef = useRef<AnnotationsJson | null>(null);

  // --- Action bar state ---
  const [pendingAction, setPendingAction] = useState<PlanAction>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Ref mirrors
  const planRef = useRef<BattlePlan | null>(null);
  useEffect(() => {
    planRef.current = plan;
  }, [plan]);
  const tokenRef = useRef<string | null>(null);
  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);
  const metaDraftRef = useRef(metaDraft);
  useEffect(() => {
    metaDraftRef.current = metaDraft;
  }, [metaDraft]);
  const richDraftRef = useRef(richDraft);
  useEffect(() => {
    richDraftRef.current = richDraft;
  }, [richDraft]);

  // ---------- Bootstrap ----------
  useEffect(() => {
    if (!hqId || !planId) return;

    let cancelled = false;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!session) {
        router.push('/signin');
        return;
      }

      const token = session.access_token;
      setAccessToken(token);

      // HQ + membership
      let hqData: BattleHq | null = null;
      let roleData: Role | null = null;

      try {
        const hqRes = await fetch(`/api/battle-hq/${hqId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        if (hqRes.status === 401) {
          router.push('/signin');
          return;
        }
        if (!hqRes.ok) {
          setError('Failed to load Battle HQ.');
          setLoading(false);
          return;
        }
        const json = await hqRes.json();
        hqData = (json?.hq ?? null) as BattleHq | null;
        roleData = (json?.membership?.role ?? null) as Role | null;
      } catch {
        if (cancelled) return;
        setError('Network error loading Battle HQ.');
        setLoading(false);
        return;
      }

      if (cancelled) return;

      if (!hqData || !roleData) {
        setError('Unexpected Battle HQ response.');
        setLoading(false);
        return;
      }

      if (roleData === 'viewer') {
        setError('Viewers cannot edit battle plans.');
        setLoading(false);
        return;
      }

      setHq(hqData);
      setRole(roleData);

      // Plan
      let planData: BattlePlan | null = null;
      try {
        const planRes = await fetch(`/api/battle-hq/${hqId}/plans/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        if (planRes.status === 404) {
          setError('Battle plan not found.');
          setLoading(false);
          return;
        }
        if (!planRes.ok) {
          setError('Failed to load battle plan.');
          setLoading(false);
          return;
        }
        const json = await planRes.json();
        planData = ((json?.plan ?? json) as BattlePlan | null) ?? null;
      } catch {
        if (cancelled) return;
        setError('Network error loading battle plan.');
        setLoading(false);
        return;
      }

      if (cancelled) return;

      if (!planData?.id) {
        setError('Unexpected battle plan response.');
        setLoading(false);
        return;
      }

      setPlan(planData);
      setMetaDraft({
        name: planData.name ?? '',
        war_type: planData.war_type ?? 'other',
        scheduled_label: planData.scheduled_label ?? '',
        comms_channel: planData.comms_channel ?? '',
      });
      setRichDraft({
        orders: planData.orders ?? '',
        brief: planData.brief ?? '',
        intel: planData.intel ?? '',
      });
      latestAnnotationsRef.current = planData.map_annotations_json ?? null;

      if (planData.parent_plan_id) {
        try {
          const parentRes = await fetch(
            `/api/battle-hq/${hqId}/plans/${planData.parent_plan_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!cancelled && parentRes.ok) {
            const json = await parentRes.json();
            const parent = ((json?.plan ?? json) as BattlePlan | null) ?? null;
            if (parent?.name) setParentName(parent.name);
          }
        } catch {
          // non-fatal
        }
      }

      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [hqId, planId, router]);

  // Signed URL
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!plan?.map_image_url) {
        setMapSignedUrl(null);
        return;
      }
      try {
        const { data, error } = await supabase.storage
          .from(MAPS_BUCKET)
          .createSignedUrl(plan.map_image_url, SIGNED_URL_SECONDS);
        if (cancelled) return;
        if (error || !data?.signedUrl) {
          setMapSignedUrl(null);
          setMapError('Could not load battle map image.');
          return;
        }
        setMapSignedUrl(data.signedUrl);
        setMapError(null);
      } catch {
        if (cancelled) return;
        setMapSignedUrl(null);
        setMapError('Could not load battle map image.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [plan?.map_image_url]);

  // Cleanup timers
  useEffect(() => {
    const timers = savedTimerRef.current;
    return () => {
      (Object.keys(timers) as AnyFieldKey[]).forEach((k) => {
        const t = timers[k];
        if (t !== null) window.clearTimeout(t);
      });
      if (annotationsDebounceRef.current !== null) {
        window.clearTimeout(annotationsDebounceRef.current);
      }
      if (annotationsSavedTimerRef.current !== null) {
        window.clearTimeout(annotationsSavedTimerRef.current);
      }
    };
  }, []);

  // ---------- Save helpers: metadata + rich text ----------
  const markSaveState = useCallback(
    (field: AnyFieldKey, state: SaveState, message = '') => {
      setSaveStates((prev) => ({ ...prev, [field]: state }));
      setSaveMessages((prev) => ({ ...prev, [field]: message }));
    },
    []
  );

  const readDraftValue = (field: AnyFieldKey): string => {
    if (field === 'orders' || field === 'brief' || field === 'intel') {
      return richDraftRef.current[field] ?? '';
    }
    const v = metaDraftRef.current[field as MetaFieldKey];
    return typeof v === 'string' ? v : String(v ?? '');
  };

  const saveField = useCallback(
    async (field: AnyFieldKey) => {
      const currentPlan = planRef.current;
      const token = tokenRef.current;
      if (!currentPlan || !token) return;

      const draftValue = readDraftValue(field);
      const currentValue = currentPlan[field as keyof BattlePlan] as
        | string
        | null
        | undefined;

      const normalize = (v: string | null | undefined) => (v ?? '').trim();
      if (
        field !== 'war_type' &&
        normalize(draftValue) === normalize(currentValue)
      ) {
        return;
      }
      if (field === 'war_type' && draftValue === currentValue) return;

      let toSend: string | null;
      if (field === 'name') {
        const trimmed = draftValue.trim();
        toSend = trimmed === '' ? 'Untitled Battle Plan' : trimmed;
        if (trimmed === '') {
          setMetaDraft((d) => ({ ...d, name: 'Untitled Battle Plan' }));
        }
      } else if (field === 'war_type') {
        toSend = draftValue;
      } else {
        const trimmed = draftValue.trim();
        toSend = trimmed === '' ? null : trimmed;
      }

      markSaveState(field, 'saving');

      try {
        const res = await fetch(
          `/api/battle-hq/${hqId}/plans/${planId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ [field]: toSend }),
          }
        );
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          markSaveState(
            field,
            'error',
            `Save failed (${res.status})${text ? `: ${text.slice(0, 80)}` : ''}`
          );
          return;
        }

        setPlan((prev) =>
          prev ? ({ ...prev, [field]: toSend } as BattlePlan) : prev
        );
        markSaveState(field, 'saved', 'Saved ✓');

        const existing = savedTimerRef.current[field];
        if (existing !== null) window.clearTimeout(existing);
        savedTimerRef.current[field] = window.setTimeout(() => {
          markSaveState(field, 'idle');
        }, 2000);
      } catch (err) {
        markSaveState(
          field,
          'error',
          err instanceof Error ? err.message : 'Network error'
        );
      }
    },
    [hqId, planId, markSaveState]
  );

  const handleMetaChange = (field: MetaFieldKey, value: string) => {
    setMetaDraft((d) => ({ ...d, [field]: value }));
    if (saveStates[field] === 'error' || saveStates[field] === 'saved') {
      markSaveState(field, 'idle');
    }
  };

  const handleRichChange = (field: RichFieldKey, value: string) => {
    setRichDraft((d) => ({ ...d, [field]: value }));
    if (saveStates[field] === 'error' || saveStates[field] === 'saved') {
      markSaveState(field, 'idle');
    }
  };

  const handleWarTypeChange = (value: WarType) => {
    setMetaDraft((d) => ({ ...d, war_type: value }));
    setTimeout(() => {
      saveField('war_type');
    }, 0);
  };

  // ---------- Map upload ----------
  const openFilePicker = () => {
    if (mapInputRef.current) mapInputRef.current.click();
  };

  const uploadMap = useCallback(
    async (file: File) => {
      const token = tokenRef.current;
      if (!token) return;

      setMapError(null);

      if (!MAP_ALLOWED_MIMES.includes(file.type)) {
        setMapError('Battle maps must be PNG, JPEG, or WebP.');
        return;
      }
      if (file.size === 0) {
        setMapError('That file is empty.');
        return;
      }
      if (file.size > MAP_MAX_BYTES) {
        setMapError('Battle map must be 10 MB or smaller.');
        return;
      }

      setMapUploading(true);
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(
          `/api/battle-hq/${hqId}/plans/${planId}/upload-map`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
          }
        );
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          setMapError(
            `Upload failed (${res.status})${text ? `: ${text.slice(0, 100)}` : ''}`
          );
          return;
        }
        const json = await res.json();
        const newPath = json?.plan?.map_image_url as string | undefined;
        if (!newPath) {
          setMapError('Upload succeeded but response was unexpected.');
          return;
        }
        setPlan((prev) =>
          prev
            ? ({
                ...prev,
                map_image_url: newPath,
                map_annotations_json: null,
              } as BattlePlan)
            : prev
        );
        latestAnnotationsRef.current = null;
      } catch (err) {
        setMapError(
          err instanceof Error ? err.message : 'Network error during upload.'
        );
      } finally {
        setMapUploading(false);
      }
    },
    [hqId, planId]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMap(file);
    if (e.target) e.target.value = '';
  };

  const handleRemoveMap = useCallback(async () => {
    const token = tokenRef.current;
    if (!token) return;
    if (
      !window.confirm(
        'Remove the battle map? This clears the map image and all annotations.'
      )
    ) {
      return;
    }

    setMapRemoving(true);
    setMapError(null);
    try {
      await fetch(
        `/api/battle-hq/${hqId}/plans/${planId}/annotations`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ annotations: null }),
        }
      );

      const res = await fetch(`/api/battle-hq/${hqId}/plans/${planId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ map_image_url: null }),
      });
      if (!res.ok) {
        console.warn(
          '[map remove] PATCH map_image_url=null returned',
          res.status
        );
      }

      setPlan((prev) =>
        prev
          ? ({
              ...prev,
              map_image_url: null,
              map_annotations_json: null,
            } as BattlePlan)
          : prev
      );
      latestAnnotationsRef.current = null;
    } catch (err) {
      setMapError(
        err instanceof Error ? err.message : 'Network error removing map.'
      );
    } finally {
      setMapRemoving(false);
    }
  }, [hqId, planId]);

  // ---------- Annotations save ----------
  const flushAnnotationsSave = useCallback(
    async (annotations: AnnotationsJson): Promise<void> => {
      const token = tokenRef.current;
      if (!token) return;
      if (annotationsInFlightRef.current) {
        annotationsPendingRef.current = annotations;
        return;
      }
      annotationsInFlightRef.current = true;
      setAnnotationsSaveState('saving');
      setAnnotationsSaveMessage('');
      try {
        const res = await fetch(
          `/api/battle-hq/${hqId}/plans/${planId}/annotations`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ annotations }),
          }
        );
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          setAnnotationsSaveState('error');
          setAnnotationsSaveMessage(
            `Save failed (${res.status})${text ? `: ${text.slice(0, 80)}` : ''}`
          );
        } else {
          setPlan((prev) =>
            prev
              ? ({ ...prev, map_annotations_json: annotations } as BattlePlan)
              : prev
          );
          setAnnotationsSaveState('saved');
          setAnnotationsSaveMessage('Saved ✓');
          if (annotationsSavedTimerRef.current !== null) {
            window.clearTimeout(annotationsSavedTimerRef.current);
          }
          annotationsSavedTimerRef.current = window.setTimeout(() => {
            setAnnotationsSaveState('idle');
          }, 2000);
        }
      } catch (err) {
        setAnnotationsSaveState('error');
        setAnnotationsSaveMessage(
          err instanceof Error ? err.message : 'Network error'
        );
      } finally {
        annotationsInFlightRef.current = false;
        const pending = annotationsPendingRef.current;
        if (pending) {
          annotationsPendingRef.current = null;
          flushAnnotationsSave(pending);
        }
      }
    },
    [hqId, planId]
  );

  const handleAnnotationsChange = useCallback(
    (next: AnnotationsJson) => {
      latestAnnotationsRef.current = next;
      setAnnotationsSaveState('saving');
      setAnnotationsSaveMessage('');

      if (annotationsDebounceRef.current !== null) {
        window.clearTimeout(annotationsDebounceRef.current);
      }
      annotationsDebounceRef.current = window.setTimeout(() => {
        annotationsDebounceRef.current = null;
        flushAnnotationsSave(next);
      }, ANNOTATION_SAVE_DEBOUNCE_MS);

      const beforeUnload = () => {
        flushAnnotationsSave(next);
      };
      window.addEventListener('beforeunload', beforeUnload, { once: true });
    },
    [flushAnnotationsSave]
  );

  // Force-flush pending debounced annotations immediately
  const forceFlushAnnotations = useCallback(async () => {
    if (annotationsDebounceRef.current !== null) {
      window.clearTimeout(annotationsDebounceRef.current);
      annotationsDebounceRef.current = null;
      if (latestAnnotationsRef.current !== null) {
        await flushAnnotationsSave(latestAnnotationsRef.current);
      }
    }
    // If a save is in flight, wait briefly for it to resolve
    let waited = 0;
    while (annotationsInFlightRef.current && waited < 3000) {
      await new Promise((r) => setTimeout(r, 100));
      waited += 100;
    }
  }, [flushAnnotationsSave]);

  // ---------- Action bar ----------
  const runPlanAction = useCallback(
    async (
      action: PlanAction,
      method: 'POST' | 'DELETE',
      subpath: string | null
    ) => {
      const token = tokenRef.current;
      if (!token || !action) return;

      setActionError(null);
      setActionNotice(null);
      setPendingAction(action);

      try {
        // Flush any pending annotations before state transitions
        await forceFlushAnnotations();

        const path = subpath
          ? `/api/battle-hq/${hqId}/plans/${planId}/${subpath}`
          : `/api/battle-hq/${hqId}/plans/${planId}`;

        const res = await fetch(path, {
          method,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          setActionError(
            `Action failed (${res.status})${text ? `: ${text.slice(0, 160)}` : ''}`
          );
          return;
        }

        if (action === 'delete') {
          // Bounce to Command Deck — plan is gone from the list
          router.push(`/battle-hq/${hqId}/manage`);
          return;
        }

        // For other actions, re-fetch plan to reflect new status
        const refetch = await fetch(
          `/api/battle-hq/${hqId}/plans/${planId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (refetch.ok) {
          const json = await refetch.json();
          const refreshed =
            ((json?.plan ?? json) as BattlePlan | null) ?? null;
          if (refreshed) setPlan(refreshed);
        }

        if (action === 'publish') setActionNotice('Published ✓');
        if (action === 'archive') setActionNotice('Archived ✓');
        if (action === 'unarchive') setActionNotice('Moved back to live ✓');

        setTimeout(() => setActionNotice(null), 3000);
      } catch (err) {
        setActionError(
          err instanceof Error ? err.message : 'Network error — try again.'
        );
      } finally {
        setPendingAction(null);
      }
    },
    [hqId, planId, router, forceFlushAnnotations]
  );

  const handleSaveDraft = useCallback(async () => {
    setActionError(null);
    setActionNotice(null);
    setPendingAction('publish'); // reuse pending lock; doesn't matter which key
    try {
      await forceFlushAnnotations();
      setActionNotice('All changes saved ✓');
      setTimeout(() => setActionNotice(null), 2500);
    } finally {
      setPendingAction(null);
    }
  }, [forceFlushAnnotations]);

  const handlePublish = useCallback(() => {
    // Publish guards
    const d = metaDraftRef.current;
    const trimmedName = (d.name ?? '').trim();
    const trimmedSchedule = (d.scheduled_label ?? '').trim();

    if (!trimmedName || trimmedName === 'Untitled Battle Plan') {
      setActionError('Give the plan a real name before publishing.');
      return;
    }
    if (!trimmedSchedule) {
      setActionError(
        'Set a Scheduled Time before publishing so your alliance knows when to show up.'
      );
      return;
    }

    if (
      !window.confirm(
        'Publish this plan? It becomes visible to all members immediately.'
      )
    ) {
      return;
    }

    runPlanAction('publish', 'POST', 'publish');
  }, [runPlanAction]);

  const handleArchive = useCallback(() => {
    if (!window.confirm('Archive this plan? It hides from the active list.')) {
      return;
    }
    runPlanAction('archive', 'POST', 'archive');
  }, [runPlanAction]);

  const handleUnarchive = useCallback(() => {
    runPlanAction('unarchive', 'POST', 'unarchive');
  }, [runPlanAction]);

  const handleDelete = useCallback(() => {
    if (
      !window.confirm(
        'Delete this plan?\n\nIt moves to Trash for 30 days, then is permanently removed.'
      )
    ) {
      return;
    }
    runPlanAction('delete', 'DELETE', null);
  }, [runPlanAction]);

  // ---------- Render guards ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
          Loading Battle Plan…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <div className="text-xs font-mono text-red-400 tracking-widest uppercase mb-2">
            Error
          </div>
          <p className="text-sm text-zinc-300 mb-4">{error}</p>
          <Link
            href={hqId ? `/battle-hq/${hqId}/manage` : '/dashboard'}
            className="inline-block px-4 py-2 rounded-lg bg-amber-500 text-black text-xs font-mono font-bold tracking-widest uppercase hover:bg-amber-400"
          >
            Back to Command Deck
          </Link>
        </div>
      </div>
    );
  }

  if (!hq || !plan || !role || !accessToken) return null;

  // ---------- Render helpers ----------
  const renderSaveBadge = (field: AnyFieldKey) => {
    const state = saveStates[field];
    const msg = saveMessages[field];
    if (state === 'saving')
      return <span className="text-zinc-500">Saving…</span>;
    if (state === 'saved')
      return <span className="text-green-400">{msg}</span>;
    if (state === 'error') return <span className="text-red-400">{msg}</span>;
    return null;
  };

  const renderAnnotationsBadge = () => {
    if (annotationsSaveState === 'saving')
      return <span className="text-zinc-500">Saving…</span>;
    if (annotationsSaveState === 'saved')
      return <span className="text-green-400">{annotationsSaveMessage}</span>;
    if (annotationsSaveState === 'error')
      return <span className="text-red-400">{annotationsSaveMessage}</span>;
    return null;
  };

  const fieldLabel = (text: string, field: AnyFieldKey) => (
    <div className="flex items-center justify-between gap-3 mb-1.5">
      <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase">
        {text}
      </div>
      <div className="text-[10px] font-mono tracking-widest uppercase">
        {renderSaveBadge(field)}
      </div>
    </div>
  );

  const busy = pendingAction !== null;
  const isLive = plan.status === 'published' || plan.status === 'active';
  const isArchived = plan.status === 'archived';
  const isDraft = plan.status === 'draft';

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-0.5">
                Plan Editor
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white truncate">
                {metaDraft.name || 'Untitled Battle Plan'}
              </h1>
              <div className="text-[11px] font-mono text-zinc-500 tracking-wider uppercase">
                [{hq.alliance_tag}] · Status: {plan.status}
              </div>
            </div>
            <Link
              href={`/battle-hq/${hq.id}/manage`}
              className="shrink-0 text-[11px] font-mono text-zinc-400 hover:text-white tracking-widest uppercase"
            >
              ← Command Deck
            </Link>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-32">
        {plan.parent_plan_id && (
          <div className="bg-purple-500/10 border border-purple-500/40 rounded-2xl p-4">
            <div className="text-[10px] font-mono text-purple-400 tracking-widest uppercase mb-1">
              Duplicate
            </div>
            <p className="text-sm text-zinc-200 leading-relaxed">
              This is a copy of{' '}
              <span className="text-white font-bold">
                {parentName ?? 'another plan'}
              </span>
              . Edit freely — changes here don&rsquo;t affect the original. Set
              the new scheduled time before publishing.
            </p>
          </div>
        )}

        {/* Metadata */}
        <section className="space-y-4">
          <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
            Plan Metadata
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            {fieldLabel('Plan Name', 'name')}
            <input
              type="text"
              value={metaDraft.name}
              onChange={(e) => handleMetaChange('name', e.target.value)}
              onBlur={() => saveField('name')}
              placeholder="e.g. Canyon Storm — Saturday prime"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
            />
            <div className="text-[11px] font-mono text-zinc-600 tracking-wider mt-2 leading-relaxed">
              What your alliance will see in the plan list. Required.
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            {fieldLabel('War Type', 'war_type')}
            <select
              value={metaDraft.war_type}
              onChange={(e) => handleWarTypeChange(e.target.value as WarType)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              {WAR_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            {fieldLabel('Scheduled Time', 'scheduled_label')}
            <input
              type="text"
              value={metaDraft.scheduled_label}
              onChange={(e) =>
                handleMetaChange('scheduled_label', e.target.value)
              }
              onBlur={() => saveField('scheduled_label')}
              placeholder="Saturday 20:00 server · Sunday after reset · 2026-04-20 14:00 UTC…"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
            />
            <div className="text-[11px] font-mono text-zinc-600 tracking-wider mt-2 leading-relaxed">
              Free-text. Write it however your alliance reads times — day, hour,
              timezone, or anything else.
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            {fieldLabel('Comms Channel', 'comms_channel')}
            <input
              type="text"
              value={metaDraft.comms_channel}
              onChange={(e) =>
                handleMetaChange('comms_channel', e.target.value)
              }
              onBlur={() => saveField('comms_channel')}
              placeholder="Alliance Chat, Discord voice, Line group, WhatsApp…"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
            />
            <div className="text-[11px] font-mono text-zinc-600 tracking-wider mt-2 leading-relaxed">
              Overrides the HQ default comms channel for this plan only. Leave
              blank to use the HQ default.
            </div>
          </div>
        </section>

        {/* Battle Map + Canvas */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
              Battle Map
            </div>
            {plan.map_image_url && (
              <div className="text-[10px] font-mono tracking-widest uppercase">
                {renderAnnotationsBadge()}
              </div>
            )}
          </div>

          <input
            ref={mapInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {mapError && (
            <div className="bg-red-950/60 border border-red-900/60 rounded-xl px-4 py-2.5 text-xs text-red-300">
              {mapError}
            </div>
          )}

          {!plan.map_image_url ? (
            <div className="bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-2xl p-8 text-center">
              <div className="text-sm text-zinc-300 mb-2 font-bold">
                No battle map uploaded yet
              </div>
              <div className="text-[11px] font-mono text-zinc-500 tracking-wider mb-4 leading-relaxed">
                PNG, JPEG, or WebP · 10 MB max
              </div>
              <button
                onClick={openFilePicker}
                disabled={mapUploading}
                className="px-4 py-2 rounded-lg bg-amber-500 text-black text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {mapUploading ? 'Uploading…' : '+ Upload Map'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {mapSignedUrl ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
                  <AnnotationCanvas
                    imageUrl={mapSignedUrl}
                    initialAnnotations={
                      plan.map_annotations_json ?? null
                    }
                    readOnly={false}
                    onChange={handleAnnotationsChange}
                  />
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-xs font-mono text-zinc-500 tracking-widest uppercase">
                  Loading map…
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={openFilePicker}
                  disabled={mapUploading || mapRemoving}
                  className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mapUploading ? 'Replacing…' : 'Replace Map'}
                </button>
                <button
                  onClick={handleRemoveMap}
                  disabled={mapUploading || mapRemoving}
                  className="px-3 py-2 rounded-lg bg-red-950/60 text-red-400 border border-red-900/60 text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-red-900/60 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mapRemoving ? 'Removing…' : 'Remove Map'}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Rich text */}
        <section className="space-y-4">
          <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
            Orders · Brief · Intel
          </div>
          {(['orders', 'brief', 'intel'] as RichFieldKey[]).map((field) => {
            const meta = RICH_FIELD_META[field];
            return (
              <div
                key={field}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
              >
                {fieldLabel(meta.label, field)}
                <textarea
                  value={richDraft[field]}
                  onChange={(e) => handleRichChange(field, e.target.value)}
                  onBlur={() => saveField(field)}
                  placeholder={meta.placeholder}
                  rows={8}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 resize-y leading-relaxed"
                />
                <div className="text-[11px] font-mono text-zinc-600 tracking-wider mt-2 leading-relaxed">
                  {meta.help}
                </div>
              </div>
            );
          })}
        </section>

        {/* Pre-War Checklist editor (V1.1) */}
        <ChecklistEditor
          hqId={hq.id}
          planId={plan.id}
          accessToken={accessToken}
        />
      </div>

      {/* Action bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 space-y-2">
          {(actionError || actionNotice) && (
            <div
              className={`text-[11px] font-mono tracking-wider text-center ${
                actionError ? 'text-red-400' : 'text-green-400'
              }`}
            >
              {actionError ?? actionNotice}
            </div>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <button
              onClick={handleSaveDraft}
              disabled={busy}
              className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>

            {isDraft && (
              <button
                onClick={handlePublish}
                disabled={busy}
                className="px-3 py-2 rounded-lg bg-amber-500 text-black text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pendingAction === 'publish' ? 'Publishing…' : 'Publish'}
              </button>
            )}

            {isLive && (
              <button
                onClick={handleArchive}
                disabled={busy}
                className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pendingAction === 'archive' ? 'Archiving…' : 'Archive'}
              </button>
            )}

            {isArchived && (
              <button
                onClick={handleUnarchive}
                disabled={busy}
                className="px-3 py-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pendingAction === 'unarchive' ? 'Moving…' : 'Unarchive'}
              </button>
            )}

            <button
              onClick={handleDelete}
              disabled={busy}
              className="px-3 py-2 rounded-lg bg-red-950/60 text-red-400 border border-red-900/60 text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-red-900/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pendingAction === 'delete' ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
