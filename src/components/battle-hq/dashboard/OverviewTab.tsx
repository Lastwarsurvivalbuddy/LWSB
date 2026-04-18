'use client';

// src/components/battle-hq/dashboard/OverviewTab.tsx
// Overview tab for the Commander dashboard.
//
// V1 scope:
//   ✅ Viewer count (derived from members list)
//   ✅ New viewers this week (derived from members list)
//   ⏳ Most-viewed plans (stub — needs view tracking table, Phase 3)
//   ⏳ Checklist completion rates (stub — needs aggregation query, Phase 3)

import type { ReactNode } from 'react';

// ---------- Types ----------

type Role = 'creator' | 'editor' | 'viewer';

interface Member {
  user_id: string;
  role: Role;
  status: 'active' | 'revoked' | 'left';
  joined_at: string;
  status_changed_at: string;
  commander_name: string | null;
}

interface MembersResponse {
  active: Member[];
  editors: Member[];
  removed: Member[];
}

interface BattleHq {
  id: string;
  slug: string;
  alliance_tag: string;
  server: string;
  created_at: string;
}

export interface OverviewTabProps {
  hq: BattleHq;
  members: MembersResponse | null;
}

// ---------- Helpers ----------

function countViewers(members: MembersResponse | null): number {
  if (!members) return 0;
  return members.active.filter((m) => m.role === 'viewer').length;
}

function countNewThisWeek(members: MembersResponse | null): number {
  if (!members) return 0;
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return members.active.filter((m) => {
    if (m.role !== 'viewer') return false;
    const joined = new Date(m.joined_at).getTime();
    return !Number.isNaN(joined) && joined >= sevenDaysAgo;
  }).length;
}

function countEditors(members: MembersResponse | null): number {
  if (!members) return 0;
  return members.editors.length;
}

// ---------- Card primitive ----------

interface StatCardProps {
  label: string;
  value: ReactNode;
  sublabel?: string;
  stub?: boolean;
}

function StatCard({ label, value, sublabel, stub }: StatCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-2">
        {label}
      </div>
      <div
        className={`text-3xl font-bold ${
          stub ? 'text-zinc-600' : 'text-white'
        }`}
      >
        {value}
      </div>
      {sublabel && (
        <div className="text-[11px] font-mono text-zinc-500 tracking-wider uppercase mt-2">
          {sublabel}
        </div>
      )}
    </div>
  );
}

// ---------- Main ----------

export default function OverviewTab({ hq, members }: OverviewTabProps) {
  const viewerCount = countViewers(members);
  const newThisWeek = countNewThisWeek(members);
  const editorCount = countEditors(members);

  const createdDate = new Date(hq.created_at);
  const daysOld = Math.max(
    0,
    Math.floor((Date.now() - createdDate.getTime()) / (24 * 60 * 60 * 1000))
  );

  return (
    <div className="space-y-6">
      {/* Identity strip */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-2">
          HQ Identity
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
              Alliance
            </div>
            <div className="text-white font-bold">[{hq.alliance_tag}]</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
              Server
            </div>
            <div className="text-white font-bold">{hq.server}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
              Slug
            </div>
            <div className="text-white font-mono text-xs">{hq.slug}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
              Age
            </div>
            <div className="text-white font-bold">
              {daysOld === 0 ? 'Today' : `${daysOld}d`}
            </div>
          </div>
        </div>
      </div>

      {/* Live stats */}
      <div>
        <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-2">
          Live Stats
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            label="Viewers"
            value={viewerCount}
            sublabel="Active members"
          />
          <StatCard
            label="New This Week"
            value={newThisWeek}
            sublabel="Last 7 days"
          />
          <StatCard
            label="Editors"
            value={editorCount}
            sublabel="Active"
          />
        </div>
      </div>

      {/* Phase 3 stubs */}
      <div>
        <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-2">
          Coming Soon
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatCard
            label="Most-Viewed Plans"
            value="—"
            sublabel="Plan view tracking in development"
            stub
          />
          <StatCard
            label="Checklist Completion"
            value="—"
            sublabel="Pre-war readiness metrics coming"
            stub
          />
        </div>
      </div>

      {/* Helper hint */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-xs text-zinc-400 leading-relaxed">
        <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-1.5">
          Tip
        </div>
        Share your invite link from the{' '}
        <span className="text-white font-mono">Members</span> tab to grow your
        roster. New viewers will appear here within seconds of joining.
      </div>
    </div>
  );
}
