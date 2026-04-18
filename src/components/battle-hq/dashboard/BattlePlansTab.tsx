'use client';

// src/components/battle-hq/dashboard/BattlePlansTab.tsx
// Battle Plans tab for the Commander dashboard.
//
// Layout:
//   1. Header row: Create button + status filter
//   2. Plan list — one card per plan with:
//        - Name, war type badge, status badge, scheduled date
//        - Per-plan actions by status:
//            draft     → Edit, Publish, Duplicate, Delete
//            published → Edit, Duplicate, Archive, Delete
//            active    → Edit, Duplicate, Archive, Delete
//            archived  → Unarchive, Duplicate, Delete
//            deleted   → Restore
//
// Creator and editor have identical action sets on this tab (per spec §3.3).

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

// ---------- Types ----------

type Role = 'creator' | 'editor' | 'viewer';

type PlanStatus = 'draft' | 'published' | 'active' | 'archived' | 'deleted';
type StatusFilter = PlanStatus | 'all';

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
  created_at: string;
  updated_at: string;
  published_at: string | null;
  archived_at: string | null;
  deleted_at: string | null;
  parent_plan_id: string | null;
}

interface BattleHq {
  id: string;
  slug: string;
  alliance_tag: string;
}

export interface BattlePlansTabProps {
  hq: BattleHq;
  role: Role;
  accessToken: string;
}

// ---------- Copy maps ----------

const WAR_TYPE_LABEL: Record<WarType, string> = {
  desert_storm: 'Desert Storm',
  warzone_duel: 'Warzone Duel',
  canyon_storm: 'Canyon Storm',
  svs: 'SvS',
  alliance_mobilization: 'Alliance Mob.',
  other: 'Other',
};

const STATUS_BADGE: Record<PlanStatus, string> = {
  draft: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  published: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
  active: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  archived: 'bg-zinc-900 text-zinc-500 border-zinc-800',
  deleted: 'bg-red-950/60 text-red-400 border-red-900/60',
};

const FILTER_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Drafts' },
  { key: 'published', label: 'Published' },
  { key: 'active', label: 'Active' },
  { key: 'archived', label: 'Archived' },
  { key: 'deleted', label: 'Trash' },
];

// ---------- Helpers ----------

function formatScheduled(iso: string | null): string {
  if (!iso) return 'No date';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'No date';
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// ---------- Main ----------

export default function BattlePlansTab({
  hq,
  accessToken,
}: BattlePlansTabProps) {
  const router = useRouter();
  const [plans, setPlans] = useState<BattlePlan[] | null>(null);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);

  const setPending = useCallback((id: string, pending: boolean) => {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (pending) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  // ---------- Fetch ----------

  const fetchPlans = useCallback(async () => {
    setListError(null);
    try {
      const res = await fetch(`/api/battle-hq/${hq.id}/plans`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        setListError(`Could not load plans (${res.status}).`);
        setPlans([]);
        return;
      }
      const data = await res.json();
      setPlans((data.plans ?? []) as BattlePlan[]);
    } catch {
      setListError('Network error loading plans.');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, [hq.id, accessToken]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // ---------- Filtering ----------

  const visiblePlans = useMemo(() => {
    if (!plans) return [];
    if (filter === 'all') {
      // "All" hides deleted by default — deleted is its own Trash tab.
      return plans.filter((p) => p.status !== 'deleted');
    }
    return plans.filter((p) => p.status === filter);
  }, [plans, filter]);

  const counts = useMemo(() => {
    const c: Record<StatusFilter, number> = {
      all: 0,
      draft: 0,
      published: 0,
      active: 0,
      archived: 0,
      deleted: 0,
    };
    if (!plans) return c;
    for (const p of plans) {
      c[p.status] += 1;
      if (p.status !== 'deleted') c.all += 1;
    }
    return c;
  }, [plans]);

  // ---------- Actions ----------

  const runPlanAction = useCallback(
    async (
      planId: string,
      method: 'POST' | 'DELETE',
      subpath: string | null
    ) => {
      setActionError(null);
      setPending(planId, true);
      try {
        const path = subpath
          ? `/api/battle-hq/${hq.id}/plans/${planId}/${subpath}`
          : `/api/battle-hq/${hq.id}/plans/${planId}`;
        const res = await fetch(path, {
          method,
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          setActionError(
            `Action failed (${res.status})${text ? `: ${text.slice(0, 120)}` : ''}`
          );
          return;
        }
        await fetchPlans();
      } catch (err) {
        setActionError(
          err instanceof Error ? err.message : 'Network error — try again.'
        );
      } finally {
        setPending(planId, false);
      }
    },
    [hq.id, accessToken, fetchPlans, setPending]
  );

  const publish = (id: string) => runPlanAction(id, 'POST', 'publish');
  const archive = (id: string) => runPlanAction(id, 'POST', 'archive');
  const unarchive = (id: string) => runPlanAction(id, 'POST', 'unarchive');
  const restore = (id: string) => runPlanAction(id, 'POST', 'restore');
  const duplicate = (id: string) => runPlanAction(id, 'POST', 'duplicate');

  const softDelete = (id: string, name: string) => {
    if (
      !window.confirm(
        `Delete "${name}"?\n\nThe plan moves to Trash for 30 days, then is permanently removed.`
      )
    ) {
      return;
    }
    runPlanAction(id, 'DELETE', null);
  };

  const handleCreate = useCallback(async () => {
    setActionError(null);
    setCreating(true);
    try {
      const res = await fetch(`/api/battle-hq/${hq.id}/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: 'Untitled Battle Plan',
          war_type: 'other',
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        setActionError(
          `Could not create plan (${res.status})${text ? `: ${text.slice(0, 120)}` : ''}`
        );
        return;
      }
      const data = await res.json();
      const newId = data.plan?.id ?? data.id;
      if (newId) {
        router.push(`/battle-hq/${hq.id}/plans/${newId}/edit`);
      } else {
        await fetchPlans();
      }
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Network error — try again.'
      );
    } finally {
      setCreating(false);
    }
  }, [hq.id, accessToken, router, fetchPlans]);

  const openEdit = (planId: string) =>
    router.push(`/battle-hq/${hq.id}/plans/${planId}/edit`);
  const openView = (planId: string) =>
    router.push(`/battle-hq/${hq.id}/plans/${planId}/view`);

  // ---------- Render ----------

  if (loading && !plans) {
    return (
      <div className="text-xs font-mono text-zinc-500 tracking-widest uppercase py-8 text-center">
        Loading plans…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          onClick={handleCreate}
          disabled={creating}
          className="order-last sm:order-first px-4 py-2 rounded-lg bg-amber-500 text-black text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {creating ? 'Creating…' : '+ New Plan'}
        </button>
        <div className="flex-1 flex flex-wrap gap-1">
          {FILTER_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-2.5 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase transition-colors ${
                filter === t.key
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t.label} ({counts[t.key]})
            </button>
          ))}
        </div>
      </div>

      {/* Error surfaces */}
      {listError && (
        <div className="bg-red-950/60 border border-red-900/60 rounded-xl px-4 py-2.5 text-xs text-red-300">
          {listError}
        </div>
      )}
      {actionError && (
        <div className="bg-red-950/60 border border-red-900/60 rounded-xl px-4 py-2.5 text-xs text-red-300">
          {actionError}
        </div>
      )}

      {/* Plan list */}
      {visiblePlans.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <div className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
            {filter === 'all' && 'No plans yet'}
            {filter === 'draft' && 'No drafts'}
            {filter === 'published' && 'No published plans'}
            {filter === 'active' && 'No active plans'}
            {filter === 'archived' && 'No archived plans'}
            {filter === 'deleted' && 'Trash is empty'}
          </div>
          {filter === 'all' && (
            <div className="text-[11px] text-zinc-600 mt-2">
              Tap + New Plan to draft your first battle plan.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {visiblePlans.map((p) => {
            const pending = pendingIds.has(p.id);
            const isTrash = p.status === 'deleted';
            const isArchived = p.status === 'archived';
            const isDraft = p.status === 'draft';
            const isLive = p.status === 'published' || p.status === 'active';

            return (
              <div
                key={p.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white truncate">
                        {p.name || 'Untitled'}
                      </span>
                      <span
                        className={`text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded border ${STATUS_BADGE[p.status]}`}
                      >
                        {p.status}
                      </span>
                      <span className="text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded border border-zinc-700 text-zinc-400 bg-zinc-800">
                        {WAR_TYPE_LABEL[p.war_type]}
                      </span>
                      {p.parent_plan_id && (
                        <span className="text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded border border-purple-500/40 text-purple-400 bg-purple-500/10">
                          Copy
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500 tracking-wider mt-1">
                      {isTrash
                        ? `Deleted ${formatScheduled(p.deleted_at)}`
                        : `Scheduled: ${formatScheduled(p.scheduled_at)}`}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    {/* Trash: Restore only */}
                    {isTrash && (
                      <button
                        onClick={() => restore(p.id)}
                        disabled={pending}
                        className="px-2.5 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30 disabled:opacity-50"
                      >
                        {pending ? '…' : 'Restore'}
                      </button>
                    )}

                    {/* Draft / Published / Active / Archived → Edit */}
                    {!isTrash && (
                      <button
                        onClick={() => openEdit(p.id)}
                        className="px-2.5 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
                      >
                        Edit
                      </button>
                    )}

                    {/* Live plans: View link */}
                    {isLive && (
                      <button
                        onClick={() => openView(p.id)}
                        className="px-2.5 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
                      >
                        View
                      </button>
                    )}

                    {/* Draft: Publish */}
                    {isDraft && (
                      <button
                        onClick={() => publish(p.id)}
                        disabled={pending}
                        className="px-2.5 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50"
                      >
                        {pending ? '…' : 'Publish'}
                      </button>
                    )}

                    {/* Not trash: Duplicate */}
                    {!isTrash && (
                      <button
                        onClick={() => duplicate(p.id)}
                        disabled={pending}
                        className="px-2.5 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 disabled:opacity-50"
                      >
                        {pending ? '…' : 'Duplicate'}
                      </button>
                    )}

                    {/* Live → Archive */}
                    {isLive && (
                      <button
                        onClick={() => archive(p.id)}
                        disabled={pending}
                        className="px-2.5 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 disabled:opacity-50"
                      >
                        {pending ? '…' : 'Archive'}
                      </button>
                    )}

                    {/* Archived → Unarchive */}
                    {isArchived && (
                      <button
                        onClick={() => unarchive(p.id)}
                        disabled={pending}
                        className="px-2.5 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-sky-500/20 text-sky-400 border border-sky-500/40 hover:bg-sky-500/30 disabled:opacity-50"
                      >
                        {pending ? '…' : 'Unarchive'}
                      </button>
                    )}

                    {/* Not trash: Delete */}
                    {!isTrash && (
                      <button
                        onClick={() => softDelete(p.id, p.name || 'this plan')}
                        disabled={pending}
                        className="px-2.5 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-red-950/60 text-red-400 border border-red-900/60 hover:bg-red-900/60 disabled:opacity-50"
                      >
                        {pending ? '…' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
