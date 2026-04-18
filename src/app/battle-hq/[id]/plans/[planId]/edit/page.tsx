'use client';

// src/app/battle-hq/[id]/plans/[planId]/edit/page.tsx
// Battle HQ V1 — Battle Plan Editor.
// Creator + editor only. Viewers bounced.
//
// Bootstrap effect depends ONLY on [hqId, planId, router]. All fetches
// inlined in the effect body. saveMetaField reads plan / token / draft
// from refs so its identity is stable.

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

  // Ref mirrors so saveMetaField stays stable
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

  // ---------- Bootstrap ----------

  useEffect(() => {
    if (!hqId || !planId) return;
    let cancelled = false;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!session) {
        router.push('/signin');
        return;
      }
      const token = session.access_token;
      setAccessToken(token);

      // --- Load HQ + membership ---
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

      // --- Load plan ---
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

      // --- Optional: load parent name for duplicate banner ---
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

  const saveMetaField = useCallback(
    async (field: MetaFieldKey) => {
      const currentPlan = planRef.current;
      const token = tokenRef.current;
      const draft = metaDraftRef.current;
      if (!currentPlan || !token) return;

      const draftValue = draft[field];
      const currentValue = currentPlan[field];

      const normalize = (v: string | null | undefined) => (v ?? '').trim();

      if (
        field !== 'war_type' &&
        normalize(draftValue as string) ===
          normalize(currentValue as string | null | undefined)
      ) {
        return;
      }
      if (field === 'war_type' && draftValue === currentValue) return;

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

  const handleWarTypeChange = (value: WarType) => {
    setMetaDraft((d) => ({ ...d, war_type: value }));
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
    if (state === 'saving') return <span className="text-zinc-500">Saving…</span>;
    if (state === 'saved') return <span className="text-green-400">{msg}</span>;
    if (state === 'error') return <span className="text-red-400">{msg}</span>;
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

          {/* Scheduled label */}
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

      {/* Action bar placeholder */}
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
