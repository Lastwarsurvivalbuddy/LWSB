'use client';

// src/app/battle-hq/[id]/plans/[planId]/view/page.tsx
// Battle HQ V1.1 — Battle Plan Viewer (read-only).
// All active members (creator/editor/viewer). Viewers get 404 on drafts
// from the API itself — we just react to the 404.
//
// Layout (per spec §5.3):
//   1. Plan header — name, war type badge, status badge, scheduled label
//   2. Comms channel
//   3. Annotated map (read-only canvas)
//   4. Orders · Brief · Intel
//   5. Pre-war checklist — dynamic per plan (V1.1), per-user state, toggle.
//      Disabled items are filtered out entirely (vanish doctrine).
//   6. Footer attribution

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AnnotationCanvas, {
  type AnnotationsJson,
} from '@/components/battle-hq/AnnotationCanvas';

// ---------- Types ----------
type Role = 'creator' | 'editor' | 'viewer';
type PlanStatus = 'draft' | 'published' | 'active' | 'archived' | 'deleted';
type WarType =
  | 'desert_storm'
  | 'warzone_duel'
  | 'canyon_storm'
  | 'svs'
  | 'alliance_mobilization'
  | 'other';

interface BattlePlan {
  id: string;
  battle_hq_id: string;
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
}

interface BattleHq {
  id: string;
  slug: string;
  alliance_tag: string;
  server: string;
  standing_intel: string | null;
  standing_brief: string | null;
  comms_channel: string | null;
}

interface ChecklistItem {
  id: string;
  battle_plan_id: string;
  item_key: string;
  label: string;
  is_default: boolean;
  enabled: boolean;
  sort_order: number;
}

// ---------- Constants ----------
const MAPS_BUCKET = 'battle-hq-maps';
const SIGNED_URL_SECONDS = 60 * 60;

const WAR_TYPE_LABEL: Record<WarType, string> = {
  desert_storm: 'Desert Storm',
  warzone_duel: 'Warzone Duel',
  canyon_storm: 'Canyon Storm',
  svs: 'SvS',
  alliance_mobilization: 'Alliance Mobilization',
  other: 'Other',
};

const STATUS_BADGE: Record<PlanStatus, string> = {
  draft: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  published: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
  active: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  archived: 'bg-zinc-900 text-zinc-500 border-zinc-800',
  deleted: 'bg-red-950/60 text-red-400 border-red-900/60',
};

// ---------- Page ----------
export default function BattlePlanViewPage() {
  const router = useRouter();
  const params = useParams<{ id: string; planId: string }>();
  const hqId = params?.id;
  const planId = params?.planId;

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [hq, setHq] = useState<BattleHq | null>(null);
  const [plan, setPlan] = useState<BattlePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapSignedUrl, setMapSignedUrl] = useState<string | null>(null);

  // Checklist: dynamic per plan
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [togglingKeys, setTogglingKeys] = useState<Set<string>>(new Set());
  const [checklistError, setChecklistError] = useState<string | null>(null);

  const tokenRef = useRef<string | null>(null);
  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

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
      const uid = session.user?.id ?? null;
      setAccessToken(token);
      setUserId(uid);

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

      // Checklist items (definitions) — from API so auto-seeding of defaults
      // runs on first access. Filter to enabled-only for the viewer.
      try {
        const itemsRes = await fetch(
          `/api/battle-hq/${hqId}/plans/${planId}/checklist-items`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!cancelled && itemsRes.ok) {
          const json = await itemsRes.json();
          const allItems = Array.isArray(json?.items)
            ? (json.items as ChecklistItem[])
            : [];
          // Vanish doctrine: disabled items do not appear for viewers
          const enabledItems = allItems
            .filter((i) => i.enabled)
            .sort((a, b) => a.sort_order - b.sort_order);
          setChecklistItems(enabledItems);
        }
      } catch {
        // Non-fatal — checklist section will just render empty
      }

      // Checklist per-user state — RLS enforces user only sees their own rows
      if (uid) {
        try {
          const { data: rows } = await supabase
            .from('battle_plan_checklists')
            .select('item_key, checked_at')
            .eq('battle_plan_id', planId)
            .eq('user_id', uid);
          if (!cancelled && Array.isArray(rows)) {
            const next: Record<string, boolean> = {};
            for (const r of rows as { item_key: string; checked_at: string | null }[]) {
              next[r.item_key] = r.checked_at !== null;
            }
            setCheckedState(next);
          }
        } catch {
          // Non-fatal — UI starts all unchecked
        }
      }

      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [hqId, planId, router]);

  // Signed URL for the map
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
          return;
        }
        setMapSignedUrl(data.signedUrl);
      } catch {
        if (cancelled) return;
        setMapSignedUrl(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [plan?.map_image_url]);

  // ---------- Checklist toggle ----------
  const toggleItem = useCallback(
    async (itemKey: string) => {
      const token = tokenRef.current;
      if (!token) return;

      const prev = checkedState[itemKey] ?? false;
      const next = !prev;

      // Optimistic update
      setCheckedState((c) => ({ ...c, [itemKey]: next }));
      setTogglingKeys((s) => {
        const n = new Set(s);
        n.add(itemKey);
        return n;
      });
      setChecklistError(null);

      try {
        const res = await fetch(
          `/api/battle-hq/${hqId}/plans/${planId}/checklist`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ item_key: itemKey, checked: next }),
          }
        );

        if (!res.ok) {
          // Rollback optimistic update
          setCheckedState((c) => ({ ...c, [itemKey]: prev }));
          const text = await res.text().catch(() => '');
          setChecklistError(
            `Couldn't save (${res.status})${text ? `: ${text.slice(0, 80)}` : ''}`
          );
        }
      } catch (err) {
        setCheckedState((c) => ({ ...c, [itemKey]: prev }));
        setChecklistError(
          err instanceof Error ? err.message : 'Network error — try again.'
        );
      } finally {
        setTogglingKeys((s) => {
          const n = new Set(s);
          n.delete(itemKey);
          return n;
        });
      }
    },
    [checkedState, hqId, planId]
  );

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
            Not Available
          </div>
          <p className="text-sm text-zinc-300 mb-4">{error}</p>
          <Link
            href="/dashboard"
            className="inline-block px-4 py-2 rounded-lg bg-amber-500 text-black text-xs font-mono font-bold tracking-widest uppercase hover:bg-amber-400"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!hq || !plan || !role || !userId) return null;

  const effectiveComms =
    (plan.comms_channel && plan.comms_channel.trim()) ||
    (hq.comms_channel && hq.comms_channel.trim()) ||
    null;

  const isPrivileged = role === 'creator' || role === 'editor';
  const checkedCount = checklistItems.filter(
    (i) => checkedState[i.item_key]
  ).length;

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-0.5">
                Battle Plan
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white truncate">
                {plan.name || 'Untitled Battle Plan'}
              </h1>
              <div className="text-[11px] font-mono text-zinc-500 tracking-wider uppercase">
                [{hq.alliance_tag}] · Server {hq.server}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              {isPrivileged && (
                <Link
                  href={`/battle-hq/${hq.id}/plans/${plan.id}/edit`}
                  className="text-[11px] font-mono text-amber-500 hover:text-amber-400 tracking-widest uppercase"
                >
                  Edit →
                </Link>
              )}
              <Link
                href={`/battle-hq/${hq.id}/manage`}
                className="text-[11px] font-mono text-zinc-400 hover:text-white tracking-widest uppercase"
              >
                ← Command Deck
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Badges + scheduled time */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded border ${STATUS_BADGE[plan.status]}`}
            >
              {plan.status}
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded border border-zinc-700 text-zinc-300 bg-zinc-800">
              {WAR_TYPE_LABEL[plan.war_type]}
            </span>
            {plan.parent_plan_id && (
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded border border-purple-500/40 text-purple-400 bg-purple-500/10">
                Copy
              </span>
            )}
          </div>
          {plan.scheduled_label && (
            <div>
              <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-1">
                Scheduled Time
              </div>
              <div className="text-base text-white font-bold">
                {plan.scheduled_label}
              </div>
            </div>
          )}
        </div>

        {/* Comms Channel */}
        {effectiveComms && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-1">
              Comms Channel
            </div>
            <div className="text-sm text-white">{effectiveComms}</div>
            {plan.comms_channel &&
              hq.comms_channel &&
              plan.comms_channel !== hq.comms_channel && (
                <div className="text-[11px] font-mono text-zinc-500 tracking-wider mt-2">
                  Plan override · HQ default: {hq.comms_channel}
                </div>
              )}
          </div>
        )}

        {/* Annotated map */}
        {plan.map_image_url && (
          <div>
            <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-2">
              Battle Map
            </div>
            {mapSignedUrl ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
                <AnnotationCanvas
                  imageUrl={mapSignedUrl}
                  initialAnnotations={plan.map_annotations_json ?? null}
                  readOnly={true}
                />
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-xs font-mono text-zinc-500 tracking-widest uppercase">
                Loading map…
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {plan.orders && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-2">
              Orders
            </div>
            <div className="text-sm text-zinc-100 whitespace-pre-wrap leading-relaxed">
              {plan.orders}
            </div>
          </div>
        )}

        {/* Brief */}
        {plan.brief && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-2">
              Brief
            </div>
            <div className="text-sm text-zinc-100 whitespace-pre-wrap leading-relaxed">
              {plan.brief}
            </div>
            {hq.standing_brief && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-2">
                  Standing Brief (HQ-wide)
                </div>
                <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {hq.standing_brief}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Intel */}
        {(plan.intel || hq.standing_intel) && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-2">
              Intel
            </div>
            {plan.intel && (
              <div className="text-sm text-zinc-100 whitespace-pre-wrap leading-relaxed">
                {plan.intel}
              </div>
            )}
            {hq.standing_intel && (
              <div className={plan.intel ? 'mt-4 pt-4 border-t border-zinc-800' : ''}>
                <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-2">
                  Standing Intel (HQ-wide)
                </div>
                <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {hq.standing_intel}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pre-war checklist — dynamic items from DB, vanish disabled */}
        {checklistItems.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase">
                Pre-War Checklist
              </div>
              <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
                {checkedCount} / {checklistItems.length}
              </div>
            </div>
            <div className="text-[11px] font-mono text-zinc-500 tracking-wider mb-4 leading-relaxed">
              Your own pre-war check. Private to you — no one else sees your state.
            </div>

            {checklistError && (
              <div className="mb-3 bg-red-950/60 border border-red-900/60 rounded-xl px-3 py-2 text-xs text-red-300">
                {checklistError}
              </div>
            )}

            <div className="space-y-2">
              {checklistItems.map((item) => {
                const checked = checkedState[item.item_key] ?? false;
                const busy = togglingKeys.has(item.item_key);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.item_key)}
                    disabled={busy}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed ${
                      checked
                        ? 'bg-green-500/10 border-green-500/40 hover:bg-green-500/15'
                        : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700'
                    }`}
                  >
                    <div
                      className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                        checked
                          ? 'bg-green-500 border-green-500'
                          : 'border-zinc-600'
                      }`}
                    >
                      {checked && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#000"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        checked
                          ? 'text-green-300 line-through'
                          : 'text-zinc-200'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 pb-8 text-center">
          <div className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
            Powered by{' '}
            <span className="text-zinc-400">lastwarsurvivalbuddy.com</span> ·
            Data from{' '}
            <a
              href="https://cpt-hedge.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-amber-500"
            >
              cpt-hedge.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
