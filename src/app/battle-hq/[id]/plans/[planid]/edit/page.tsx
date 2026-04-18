'use client';

// src/app/battle-hq/[id]/plans/[planId]/edit/page.tsx
// Battle HQ V1 — Battle Plan Editor.
// Creator + editor only. Viewers bounced.
//
// Layout: single scrollable page with sections:
//   1. Duplicate banner (if parent_plan_id)
//   2. Metadata (name, war type, scheduled_label, comms_channel)   ← shipped
//   3. Map + annotation canvas                                     ← placeholder
//   4. Rich text (orders, brief, intel)                            ← placeholder
//   5. Status action bar (Save Draft / Publish / Archive / Delete) ← placeholder
//
// Saves are inline — fields save on blur. Status transitions are explicit.
//
// scheduled_label note: free-text by design (per Flynn). Stored separately
// from the TIMESTAMPTZ scheduled_at column. Added via SQL migration:
//   ALTER TABLE battle_plans ADD COLUMN scheduled_label TEXT DEFAULT NULL;

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

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
  map_annotations_json: unknown | null;
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

// ---------- Constants ----------

const WAR_TYPE_OPTIONS: { value: WarType; label: string }[] = [
  { value: 'desert_storm', label: 'Desert Storm' },
  { value: 'warzone_duel', label: 'Warzone Duel' },
  { value: 'canyon_storm', label: 'Canyon Storm' },
  { value: 'svs', label: 'SvS' },
  { value: 'alliance_mobilization', label: 'Alliance Mobilization' },
  { value: 'other', label: 'Other' },
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

  // Metadata draft state (independent of `plan` — commits on blur/change)
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

  const [saveStates, setSaveStates] = useState<Record<MetaFieldKey, SaveState>>({
    name: 'idle',
    war_type: 'idle',
    scheduled_label: 'idle',
    comms_channel: 'idle',
  });
  const [saveMessages, setSaveMessages] = useState<Record<MetaFieldKey, string>>({
    name: '',
    war_type: '',
    scheduled_label: '',
    comms_channel: '',
  });
  const savedTimerRef = useRef<Record<MetaFieldKey, number | null>>({
    name: null,
    war_type: null,
    scheduled_label: null,
    comms_channel: null,
  });

  // ---------- Fetchers ----------

  const fetchHq = useCallback(
    async (token: string): Promise<{ hq: BattleHq; role: Role } | null> => {
      const res = await fetch(`/api/battle-hq/${hqId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        router.push('/signin');
        return null;
      }
      if (!res.ok) {
        setError('Failed to load Battle HQ.');
        return null;
      }
      const data = await res.json();
      const hqData = data?.hq as BattleHq | undefined;
      const roleData = data?.membership?.role as Role | undefined;
      if (!hqData || !roleData) {
        setError('Unexpected response from server.');
        return null;
      }
      return { hq: hqData, role: roleData };
    },
    [hqId, router]
  );

  const fetchPlan = useCallback(
    async (token: string): Promise<BattlePlan | null> => {
      const res = await fetch(`/api/battle-hq/${hqId}/plans/${planId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 404) {
        setError('Battle plan not found.');
        return null;
      }
      if (!res.ok) {
        setError('Failed to load battle plan.');
        return null;
      }
      const data = await res.json();
      const planData = (data?.plan ?? data) as BattlePlan | undefined;
      if (!planData?.id) {
        setError('Unexpected response from server.');
        return null;
      }
      return planData;
    },
    [hqId, planId]
  );

  const fetchParentName = useCallback(
    async (token: string, parentId: string): Promise<string | null> => {
      const res = await fetch(`/api/battle-hq/${hqId}/plans/${parentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      const p = (data?.plan ?? data) as BattlePlan | undefined;
      return p?.name ?? null;
    },
    [hqId]
  );

  // Seed metaDraft from a loaded plan
  const seedDraftFromPlan = useCallback((p: BattlePlan) => {
    setMetaDraft({
      name: p.name ?? '',
      war_type: p.war_type ?? 'other',
      scheduled_label: p.scheduled_label ?? '',
      comms_channel: p.comms_channel ?? '',
    });
  }, []);

  // ---------- Bootstrap ----------

  useEffect(() => {
    if (!hqId || !planId) return;
    let cancelled = false;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/signin');
        return;
      }
      if (cancelled) return;
      setAccessToken(session.access_token);

      const hqResult = await fetchHq(session.access_token);
      if (cancelled || !hqResult) {
        setLoading(false);
        return;
      }

      if (hqResult.role === 'viewer') {
        setError('Viewers cannot edit battle plans.');
        setLoading(false);
        return;
      }

      setHq(hqResult.hq);
      setRole(hqResult.role);

      const p = await fetchPlan(session.access_token);
      if (cancelled) return;
      if (!p) {
        setLoading(false);
        return;
      }
      setPlan(p);
      seedDraftFromPlan(p);

      if (p.parent_plan_id) {
        const pname = await fetchParentName(
          session.access_token,
          p.parent_plan_id
        );
        if (!cancelled) setParentName(pname);
      }

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [
    hqId,
    planId,
    fetchHq,
    fetchPlan,
    fetchParentName,
    seedDraftFromPlan,
    router,
  ]);

  // Cleanup savedTimers on unmount
  useEffect(() => {
    const timers = savedTimerRef.current;
    return () => {
      (Object.keys(timers) as MetaFieldKey[]).forEach((k) => {
        const t = timers[k];
        if (t !== null) window.clearTimeout(t);
      });
    };
  }, []);

  // ---------- Save helpers ----------

  const markSaveState = useCallback(
    (field: MetaFieldKey, state: SaveState, message = '') => {
      setSaveStates((prev) => ({ ...prev, [field]: state }));
      setSaveMessages((prev) => ({ ...prev, [field]: message }));
    },
    []
  );

  // Generic PATCH for a single metadata field.
  // Empty-string text fields get written as null so the DB doesn't store ''.
  const saveMetaField = useCallback(
    async (field: MetaFieldKey) => {
      if (!plan || !accessToken) return;

      const draftValue = metaDraft[field];
      const currentValue = plan[field];

      // Normalize null/empty/trim equivalence
      const normalizeForCompare = (v: string | null | undefined) =>
        (v ?? '').trim();
      if (
        field !== 'war_type' &&
        normalizeForCompare(draftValue as string) ===
          normalizeForCompare(currentValue as string | null | undefined)
      ) {
        return;
      }
      if (field === 'war_type' && draftValue === currentValue) return;

      // Name is required — fall back to "Untitled Battle Plan" on empty blur
      let toSend: string | null;
      if (field === 'name') {
        const trimmed = (draftValue as string).trim();
        toSend = trimmed === '' ? 'Untitled Battle Plan' : trimmed;
        if (trimmed === '') {
          setMetaDraft((d) => ({ ...d, name: 'Untitled Battle Plan' }));
        }
      } else if (field === 'war_type') {
        toSend = draftValue as string;
      } else {
        const trimmed = (draftValue as string).trim();
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
              Authorization: `Bearer ${accessToken}`,
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
        // Update local plan snapshot so subsequent diffs work
        setPlan((prev) =>
          prev
            ? ({
                ...prev,
                [field]: toSend,
              } as BattlePlan)
            : prev
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
    [plan, accessToken, metaDraft, hqId, planId, markSaveState]
  );

  const handleMetaChange = (field: MetaFieldKey, value: string) => {
    setMetaDraft((d) => ({ ...d, [field]: value }));
    if (saveStates[field] === 'error' || saveStates[field] === 'saved') {
      markSaveState(field, 'idle');
    }
  };

  // For selects (war_type) — change + save in one step
  const handleWarTypeChange = async (value: WarType) => {
    setMetaDraft((d) => ({ ...d, war_type: value }));
    // Use immediate next-tick so React state flushes before save reads it
    setTimeout(() => {
      saveMetaField('war_type');
    }, 0);
  };

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

  const renderSaveBadge = (field: MetaFieldKey) => {
    const state = saveStates[field];
    const msg = saveMessages[field];
    if (state === 'saving') {
      return <span className="text-zinc-500">Saving…</span>;
    }
    if (state === 'saved') {
      return <span className="text-green-400">{msg}</span>;
    }
    if (state === 'error') {
      return <span className="text-red-400">{msg}</span>;
    }
    return null;
  };

  const fieldLabel = (text: string, field: MetaFieldKey) => (
    <div className="flex items-center justify-between gap-3 mb-1.5">
      <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase">
        {text}
      </div>
      <div className="text-[10px] font-mono tracking-widest uppercase">
        {renderSaveBadge(field)}
      </div>
    </div>
  );

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
        {/* Duplicate banner */}
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

        {/* Metadata section */}
        <section className="space-y-4">
          <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
            Plan Metadata
          </div>

          {/* Name */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            {fieldLabel('Plan Name', 'name')}
            <input
              type="text"
              value={metaDraft.name}
              onChange={(e) => handleMetaChange('name', e.target.value)}
              onBlur={() => saveMetaField('name')}
              placeholder="e.g. Canyon Storm — Saturday prime"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
            />
            <div className="text-[11px] font-mono text-zinc-600 tracking-wider mt-2 leading-relaxed">
              What your alliance will see in the plan list. Required.
            </div>
          </div>

          {/* War type */}
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

          {/* Scheduled label (free-text) */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            {fieldLabel('Scheduled Time', 'scheduled_label')}
            <input
              type="text"
              value={metaDraft.scheduled_label}
              onChange={(e) =>
                handleMetaChange('scheduled_label', e.target.value)
              }
              onBlur={() => saveMetaField('scheduled_label')}
              placeholder="Saturday 20:00 server · Sunday after reset · 2026-04-20 14:00 UTC…"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
            />
            <div className="text-[11px] font-mono text-zinc-600 tracking-wider mt-2 leading-relaxed">
              Free-text. Write it however your alliance reads times — day,
              hour, timezone, or anything else.
            </div>
          </div>

          {/* Comms channel */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            {fieldLabel('Comms Channel', 'comms_channel')}
            <input
              type="text"
              value={metaDraft.comms_channel}
              onChange={(e) =>
                handleMetaChange('comms_channel', e.target.value)
              }
              onBlur={() => saveMetaField('comms_channel')}
              placeholder="Alliance Chat, Discord voice, Line group, WhatsApp…"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
            />
            <div className="text-[11px] font-mono text-zinc-600 tracking-wider mt-2 leading-relaxed">
              Overrides the HQ default comms channel for this plan only. Leave
              blank to use the HQ default.
            </div>
          </div>
        </section>

        {/* Map placeholder — File 4 */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-2">
            Battle Map
          </div>
          <p className="text-xs text-zinc-500">
            Upload battle map &rarr; annotation canvas renders inline. Coming
            next.
          </p>
        </section>

        {/* Rich text placeholder — File 3 */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-2">
            Orders · Brief · Intel
          </div>
          <p className="text-xs text-zinc-500">
            Rich text sections coming next.
          </p>
        </section>
      </div>

      {/* Action bar placeholder — File 5 */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 text-center">
          <p className="text-[11px] font-mono text-zinc-500 tracking-wider uppercase">
            Action Bar · Save Draft · Publish · Archive · Delete
          </p>
        </div>
      </div>
    </div>
  );
}
