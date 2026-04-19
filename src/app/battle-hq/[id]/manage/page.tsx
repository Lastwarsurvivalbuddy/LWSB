'use client';
// src/app/battle-hq/[id]/manage/page.tsx
// Battle HQ V1 — Commander Dashboard.
// Creator: all 5 tabs. Editor: 4 tabs (no Settings). Viewer: 403 → redirect.
//
// This file owns: auth gate, HQ + members fetch, affiliate-code fetch,
// tab switcher, layout.
// Each tab is a separate component in src/components/battle-hq/dashboard/.
//
// API response normalization:
//   GET /api/battle-hq/[id] returns { hq, membership: { role } }
//   GET /api/battle-hq/[id]/members returns { members: { active, removed }, counts }
//     — "editors" are inside members.active with role === 'editor'
//   GET /api/affiliate/dashboard returns { status, referral_code, ... }
//     — 404 when user has no affiliate row; any non-approved status → code is null.

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import OverviewTab from '@/components/battle-hq/dashboard/OverviewTab';
import MembersTab from '@/components/battle-hq/dashboard/MembersTab';
import BattlePlansTab from '@/components/battle-hq/dashboard/BattlePlansTab';
import StandingContentTab from '@/components/battle-hq/dashboard/StandingContentTab';
import SettingsTab from '@/components/battle-hq/dashboard/SettingsTab';

// ---------- Types ----------

type Role = 'creator' | 'editor' | 'viewer';
type TabKey = 'overview' | 'members' | 'plans' | 'standing' | 'settings';

interface BattleHq {
  id: string;
  slug: string;
  alliance_tag: string;
  server: string;
  comms_channel: string | null;
  standing_intel: string | null;
  standing_brief: string | null;
  creator_user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Member {
  user_id: string;
  role: Role;
  status: 'active' | 'revoked' | 'left';
  joined_at: string;
  status_changed_at: string;
  commander_name: string | null;
}

interface MembersResponse {
  active: Member[];  // active viewers + creator (tab filters creator out)
  editors: Member[]; // active editors only
  removed: Member[]; // revoked + left
}

// ---------- Tab config ----------

const TABS: { key: TabKey; label: string; creatorOnly: boolean }[] = [
  { key: 'overview', label: 'OVERVIEW', creatorOnly: false },
  { key: 'members', label: 'MEMBERS', creatorOnly: false },
  { key: 'plans', label: 'BATTLE PLANS', creatorOnly: false },
  { key: 'standing', label: 'STANDING', creatorOnly: false },
  { key: 'settings', label: 'SETTINGS', creatorOnly: true },
];

// ---------- Page ----------

export default function BattleHqManagePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const hqId = params?.id;

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [hq, setHq] = useState<BattleHq | null>(null);
  const [members, setMembers] = useState<MembersResponse | null>(null);
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      if (res.status === 404) {
        setError('Battle HQ not found.');
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

  const fetchMembers = useCallback(
    async (token: string): Promise<MembersResponse | null> => {
      const res = await fetch(`/api/battle-hq/${hqId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      const activeAll: Member[] = data?.members?.active ?? [];
      const removed: Member[] = data?.members?.removed ?? [];
      const editors = activeAll.filter((m) => m.role === 'editor');
      return { active: activeAll, editors, removed };
    },
    [hqId]
  );

  /**
   * Fetches the current user's approved affiliate referral code, or
   * returns null if they are not an approved affiliate.
   *
   * Contract: never throws. 404 = no affiliate row. Any status other
   * than 'approved' = null code. Network errors = null code. The
   * invite-link UX degrades gracefully to the "no code" nudge.
   */
  const fetchAffiliateCode = useCallback(
    async (token: string): Promise<string | null> => {
      try {
        const res = await fetch('/api/affiliate/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return null; // 404 = not an affiliate, treat as no code
        const data = await res.json();
        if (data?.status !== 'approved') return null;
        const code = data?.referral_code;
        return typeof code === 'string' && code.length > 0 ? code : null;
      } catch {
        return null;
      }
    },
    []
  );

  const refreshMembers = useCallback(async () => {
    if (!accessToken) return;
    const m = await fetchMembers(accessToken);
    if (m) setMembers(m);
  }, [accessToken, fetchMembers]);

  const refreshHq = useCallback(async () => {
    if (!accessToken) return;
    const result = await fetchHq(accessToken);
    if (result) setHq(result.hq);
  }, [accessToken, fetchHq]);

  // ---------- Bootstrap ----------

  useEffect(() => {
    if (!hqId) return;
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
        setError('Viewers cannot access the Commander dashboard.');
        setLoading(false);
        return;
      }

      setHq(hqResult.hq);
      setRole(hqResult.role);

      // Fetch members + affiliate code in parallel — neither blocks the other
      const [m, code] = await Promise.all([
        fetchMembers(session.access_token),
        fetchAffiliateCode(session.access_token),
      ]);

      if (cancelled) return;
      if (m) setMembers(m);
      setAffiliateCode(code);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [hqId, fetchHq, fetchMembers, fetchAffiliateCode, router]);

  // ---------- Render guards ----------

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
          Loading Command Deck…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <div className="text-xs font-mono text-red-400 tracking-widest uppercase mb-2">
            Access Denied
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

  if (!hq || !role || !accessToken) {
    return null;
  }

  const visibleTabs = TABS.filter((t) => !t.creatorOnly || role === 'creator');

  // ---------- Render ----------

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-0.5">
                Commander Dashboard
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                [{hq.alliance_tag}] · Server {hq.server}
              </h1>
              <div className="text-[11px] font-mono text-zinc-500 tracking-wider uppercase">
                Role: {role} · Slug: {hq.slug}
              </div>
            </div>
            <Link
              href="/dashboard"
              className="shrink-0 text-[11px] font-mono text-zinc-400 hover:text-white tracking-widest uppercase"
            >
              ← Dashboard
            </Link>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 overflow-x-auto -mx-1 px-1 pb-1 scrollbar-hide">
            {visibleTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`shrink-0 px-3 py-2 rounded-lg text-[11px] font-mono font-bold tracking-widest uppercase transition-colors ${
                  activeTab === t.key
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <OverviewTab hq={hq} members={members} />
        )}
        {activeTab === 'members' && (
          <MembersTab
            hq={hq}
            role={role}
            members={members}
            accessToken={accessToken}
            affiliateCode={affiliateCode}
            onMembersChanged={refreshMembers}
          />
        )}
        {activeTab === 'plans' && (
          <BattlePlansTab hq={hq} role={role} accessToken={accessToken} />
        )}
        {activeTab === 'standing' && (
          <StandingContentTab
            hq={hq}
            role={role}
            accessToken={accessToken}
            onHqChanged={refreshHq}
          />
        )}
        {activeTab === 'settings' && role === 'creator' && (
          <SettingsTab
            hq={hq}
            accessToken={accessToken}
            onHqChanged={refreshHq}
          />
        )}
      </div>
    </div>
  );
}
