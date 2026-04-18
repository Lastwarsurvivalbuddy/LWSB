'use client';

// src/components/battle-hq/dashboard/MembersTab.tsx
// Members tab for the Commander dashboard.
//
// Layout:
//   1. Invite link card (copy button, affiliate-aware note per Patch 01 §6.3)
//   2. Sub-tab switcher: Active · Editors · Removed
//   3. Member list for selected sub-tab, with per-row actions:
//        Active viewer → Promote (creator), Revoke (creator/editor)
//        Editor        → Demote  (creator), Revoke (creator/editor)
//        Removed       → Restore (creator/editor)

import { useCallback, useMemo, useState } from 'react';

// ---------- Types ----------

type Role = 'creator' | 'editor' | 'viewer';
type SubTab = 'active' | 'editors' | 'removed';

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
}

export interface MembersTabProps {
  hq: BattleHq;
  role: Role; // viewer is filtered out in the shell; this is creator | editor
  members: MembersResponse | null;
  accessToken: string;
  onMembersChanged: () => void | Promise<void>;
}

// ---------- Helpers ----------

function getInviteUrl(slug: string): string {
  if (typeof window === 'undefined') return `/cc/${slug}`;
  return `${window.location.origin}/cc/${slug}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function roleBadgeClass(r: Role): string {
  switch (r) {
    case 'creator':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    case 'editor':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
    case 'viewer':
      return 'bg-zinc-800 text-zinc-400 border-zinc-700';
  }
}

// ---------- Main ----------

export default function MembersTab({
  hq,
  role,
  members,
  accessToken,
  onMembersChanged,
}: MembersTabProps) {
  const [subTab, setSubTab] = useState<SubTab>('active');
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inviteUrl = useMemo(() => getInviteUrl(hq.slug), [hq.slug]);

  const setPending = useCallback((userId: string, pending: boolean) => {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (pending) next.add(userId);
      else next.delete(userId);
      return next;
    });
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setActionError('Could not copy — select the link manually and copy.');
    }
  }, [inviteUrl]);

  // Unified action runner — POST to a path and refresh on success.
  const runAction = useCallback(
    async (
      userId: string,
      path: string,
      body: Record<string, unknown> = {}
    ) => {
      setActionError(null);
      setPending(userId, true);
      try {
        const res = await fetch(path, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ user_id: userId, ...body }),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          setActionError(
            `Action failed (${res.status})${text ? `: ${text.slice(0, 120)}` : ''}`
          );
          return;
        }
        await onMembersChanged();
      } catch (err) {
        setActionError(
          err instanceof Error ? err.message : 'Network error — try again.'
        );
      } finally {
        setPending(userId, false);
      }
    },
    [accessToken, onMembersChanged, setPending]
  );

  const promote = (userId: string) =>
    runAction(userId, `/api/battle-hq/${hq.id}/promote`);
  const demote = (userId: string) =>
    runAction(userId, `/api/battle-hq/${hq.id}/demote`);
  const revoke = (userId: string) =>
    runAction(userId, `/api/battle-hq/${hq.id}/revoke`);
  const restore = (userId: string) =>
    runAction(userId, `/api/battle-hq/${hq.id}/restore-member`);

  // Current list by sub-tab
  const list: Member[] = useMemo(() => {
    if (!members) return [];
    switch (subTab) {
      case 'active':
        return members.active.filter((m) => m.role === 'viewer');
      case 'editors':
        return members.editors;
      case 'removed':
        return members.removed;
    }
  }, [members, subTab]);

  const counts = useMemo(() => {
    if (!members) return { active: 0, editors: 0, removed: 0 };
    return {
      active: members.active.filter((m) => m.role === 'viewer').length,
      editors: members.editors.length,
      removed: members.removed.length,
    };
  }, [members]);

  // ---------- Render ----------

  return (
    <div className="space-y-6">
      {/* Invite link card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-2">
          Invite Link
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inviteUrl}
            readOnly
            onFocus={(e) => e.currentTarget.select()}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-amber-500 text-black text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-amber-400 transition-colors"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
        <div className="text-[11px] font-mono text-zinc-500 tracking-wider mt-3 leading-relaxed">
          Share this with your alliance. New signups count toward your affiliate
          conversions if you have a referral code set.
        </div>
      </div>

      {/* Error surface */}
      {actionError && (
        <div className="bg-red-950/60 border border-red-900/60 rounded-xl px-4 py-2.5 text-xs text-red-300">
          {actionError}
        </div>
      )}

      {/* Sub-tab switcher */}
      <div className="flex gap-1 border-b border-zinc-800">
        {(['active', 'editors', 'removed'] as SubTab[]).map((k) => (
          <button
            key={k}
            onClick={() => setSubTab(k)}
            className={`px-3 py-2 text-[11px] font-mono font-bold tracking-widest uppercase transition-colors border-b-2 -mb-px ${
              subTab === k
                ? 'text-amber-500 border-amber-500'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            {k} ({counts[k]})
          </button>
        ))}
      </div>

      {/* Member list */}
      {list.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <div className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
            {subTab === 'active' && 'No viewers yet'}
            {subTab === 'editors' && 'No editors yet'}
            {subTab === 'removed' && 'No removed members'}
          </div>
          {subTab === 'active' && (
            <div className="text-[11px] text-zinc-600 mt-2">
              Share your invite link to recruit your alliance.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800 overflow-hidden">
          {list.map((m) => {
            const pending = pendingIds.has(m.user_id);
            const displayName = m.commander_name || 'Unnamed Commander';
            return (
              <div
                key={m.user_id}
                className="p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white truncate">
                      {displayName}
                    </span>
                    <span
                      className={`text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded border ${roleBadgeClass(
                        m.role
                      )}`}
                    >
                      {m.role}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 tracking-wider mt-0.5">
                    {subTab === 'removed'
                      ? `${m.status === 'revoked' ? 'Revoked' : 'Left'} ${formatDate(
                          m.status_changed_at
                        )}`
                      : `Joined ${formatDate(m.joined_at)}`}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {subTab === 'active' && role === 'creator' && (
                    <button
                      onClick={() => promote(m.user_id)}
                      disabled={pending}
                      className="px-2.5 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-purple-500/20 text-purple-400 border border-purple-500/40 hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pending ? '…' : 'Promote'}
                    </button>
                  )}
                  {subTab === 'active' && (
                    <button
                      onClick={() => revoke(m.user_id)}
                      disabled={pending}
                      className="px-2.5 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-red-950/60 text-red-400 border border-red-900/60 hover:bg-red-900/60 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pending ? '…' : 'Revoke'}
                    </button>
                  )}
                  {subTab === 'editors' && role === 'creator' && (
                    <button
                      onClick={() => demote(m.user_id)}
                      disabled={pending}
                      className="px-2.5 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pending ? '…' : 'Demote'}
                    </button>
                  )}
                  {subTab === 'editors' && (
                    <button
                      onClick={() => revoke(m.user_id)}
                      disabled={pending}
                      className="px-2.5 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-red-950/60 text-red-400 border border-red-900/60 hover:bg-red-900/60 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pending ? '…' : 'Revoke'}
                    </button>
                  )}
                  {subTab === 'removed' && (
                    <button
                      onClick={() => restore(m.user_id)}
                      disabled={pending}
                      className="px-2.5 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pending ? '…' : 'Restore'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
