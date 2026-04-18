'use client';

// src/components/BattleHQCards.tsx
// Dashboard section: "Battle HQs I Run" + "Battle HQs I'm In".
// Fetches from GET /api/battle-hq/my, self-gates on Founding tier, and renders
// progressive disclosure:
//
//   - Non-Founding with no memberships → "Battle HQ" teaser card → /upgrade
//   - Non-Founding with memberships    → "HQs I'm In" list + soft upgrade nudge
//   - Founding with no HQs             → "Create your first Battle HQ" CTA
//   - Founding with HQs                → "HQs I Run" (+ New HQ btn) + "HQs I'm In"
//
// Copy is R4/R5-anchored because R4s/R5s are both the primary users AND the
// viral growth vector — every HQ they spin up recruits their whole alliance.
//
// Card navigation:
//   - Creator/editor rows → /battle-hq/[id]/manage  (Commander dashboard)
//   - Viewer rows        → /cc/[slug]                (public invite/plan view)
//
// This component is defensive: any fetch failure results in silent render of
// nothing. The dashboard should never break because Battle HQ data failed.

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ---------- Types ----------

type Role = 'creator' | 'editor' | 'viewer';

interface HqListItem {
  id: string;
  slug: string;
  alliance_tag: string;
  server: string;
  role: Role;
  member_count: number;
  next_plan: {
    id: string;
    name: string;
    scheduled_label: string | null;
  } | null;
}

interface MyResponse {
  i_run: HqListItem[];
  i_am_in: HqListItem[];
}

interface BattleHQCardsProps {
  subscriptionTier: string;
}

// ---------- Helpers ----------

function roleBadgeClasses(role: Role): string {
  switch (role) {
    case 'creator':
      return 'bg-amber-900/60 text-amber-300 border-amber-800';
    case 'editor':
      return 'bg-sky-900/60 text-sky-300 border-sky-800';
    case 'viewer':
      return 'bg-zinc-800 text-zinc-400 border-zinc-700';
  }
}

// ---------- Single HQ row ----------

function HqRow({
  hq,
  onClick,
}: {
  hq: HqListItem;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-zinc-900/60 border border-zinc-800 hover:border-amber-700/60 rounded-xl p-3 transition-colors group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-white truncate">
              [{hq.alliance_tag}]
            </span>
            <span className="text-[11px] font-mono text-zinc-500 tracking-wider">
              Server {hq.server}
            </span>
            <span
              className={`text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded border ${roleBadgeClasses(
                hq.role
              )}`}
            >
              {hq.role}
            </span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 truncate">
            {hq.next_plan ? (
              <>
                Next:{' '}
                <span className="text-zinc-300">{hq.next_plan.name}</span>
                {hq.next_plan.scheduled_label && (
                  <span className="text-zinc-500">
                    {' · '}
                    {hq.next_plan.scheduled_label}
                  </span>
                )}
              </>
            ) : (
              <span className="text-zinc-600">No plans scheduled</span>
            )}
          </div>
          <div className="text-[10px] font-mono text-zinc-600 tracking-wider mt-0.5">
            {hq.member_count} member{hq.member_count === 1 ? '' : 's'}
          </div>
        </div>
        <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0 mt-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </button>
  );
}

// ---------- Non-Founding upgrade teaser card ----------
// Matches the Battle Report Analyzer Pro-teaser pattern from the dashboard.

function UpgradeTeaserCard({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full group">
      <div className="bg-zinc-900/50 border border-zinc-800 hover:border-purple-700/60 rounded-2xl p-5 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-800/40 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">⚡</span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-white">Battle HQ</span>
                <span className="text-[10px] font-bold bg-purple-500/20 border border-purple-500/40 text-purple-400 px-1.5 py-0.5 rounded tracking-wider">
                  FOUNDING
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Built for R4s and R5s. Upload a screenshot of any battle area,
                annotate it with targets and routes, write the orders — then
                drop one link in alliance chat and your whole squad is on the
                same page before the siren.
              </p>
            </div>
          </div>
          <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0 mt-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-800/60">
          <p className="text-[11px] text-purple-400 font-semibold group-hover:text-purple-300 transition-colors">
            Unlock with Founding → $99 lifetime
          </p>
        </div>
      </div>
    </button>
  );
}

// ---------- Main ----------

export default function BattleHQCards({ subscriptionTier }: BattleHQCardsProps) {
  const router = useRouter();
  const isFounding = subscriptionTier === 'founding';

  const [data, setData] = useState<MyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // ---------- Fetch ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          if (!cancelled) {
            setLoading(false);
            setLoadError(true);
          }
          return;
        }

        const res = await fetch('/api/battle-hq/my', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (cancelled) return;

        if (!res.ok) {
          setLoadError(true);
          setLoading(false);
          return;
        }

        const body: MyResponse = await res.json();
        setData(body);
        setLoading(false);
      } catch {
        if (!cancelled) {
          setLoadError(true);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- Navigation ----------

  const openHq = useCallback(
    (hq: HqListItem) => {
      // Creator/editor → Commander dashboard.
      // Viewer → public invite/plan page via slug.
      if (hq.role === 'creator' || hq.role === 'editor') {
        router.push(`/battle-hq/${hq.id}/manage`);
      } else {
        router.push(`/cc/${hq.slug}`);
      }
    },
    [router]
  );

  const handleCreateNew = useCallback(() => {
    router.push('/battle-hq/new');
  }, [router]);

  const handleUpgrade = useCallback(() => {
    router.push('/upgrade');
  }, [router]);

  // ---------- Render guards ----------

  // Silent fail — never break the dashboard because Battle HQ fetch died.
  if (loading || loadError || !data) {
    return null;
  }

  const { i_run, i_am_in } = data;
  const hasAny = i_run.length > 0 || i_am_in.length > 0;

  // ---------- Render ----------

  return (
    <section className="pt-4">
      {/* ── NON-FOUNDING + zero HQs: upgrade teaser card ── */}
      {!isFounding && !hasAny && <UpgradeTeaserCard onClick={handleUpgrade} />}

      {/* ── FOUNDING + zero HQs: creation CTA card ── */}
      {isFounding && !hasAny && (
        <button onClick={handleCreateNew} className="w-full group">
          <div className="bg-gradient-to-br from-purple-950/40 to-zinc-900/60 border border-purple-800/50 hover:border-purple-700/70 rounded-2xl p-5 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-700/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⚡</span>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">
                      Battle HQ
                    </span>
                    <span className="text-[10px] font-bold bg-purple-500/20 border border-purple-500/40 text-purple-400 px-1.5 py-0.5 rounded tracking-wider">
                      FOUNDING
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Built for R4s and R5s. Upload a screenshot of any battle
                    area, annotate it with targets and routes, stage your
                    battle plans and standing intel — then drop the link in
                    alliance chat.
                  </p>
                </div>
              </div>
              <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors flex-shrink-0 mt-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path
                    d="M6 3l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-900/40">
              <p className="text-[11px] font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                Create your first Battle HQ →
              </p>
            </div>
          </div>
        </button>
      )}

      {/* ── HQs I Run — creators only ── */}
      {i_run.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
              Battle HQs I Run
            </p>
            {isFounding && (
              <button
                onClick={handleCreateNew}
                className="text-[10px] font-mono font-bold text-amber-600 hover:text-amber-400 tracking-widest uppercase transition-colors"
              >
                + New HQ
              </button>
            )}
          </div>
          <div className="space-y-2">
            {i_run.map((hq) => (
              <HqRow key={hq.id} hq={hq} onClick={() => openHq(hq)} />
            ))}
          </div>
        </div>
      )}

      {/* ── HQs I'm In — viewer/editor memberships ── */}
      {i_am_in.length > 0 && (
        <div className={i_run.length > 0 ? '' : 'mt-0'}>
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2 px-1">
            Battle HQs I&apos;m In
          </p>
          <div className="space-y-2">
            {i_am_in.map((hq) => (
              <HqRow key={hq.id} hq={hq} onClick={() => openHq(hq)} />
            ))}
          </div>
        </div>
      )}

      {/* ── FOUNDING with only memberships (no creations): small inline "+ New HQ" ── */}
      {isFounding && i_run.length === 0 && i_am_in.length > 0 && (
        <div className="mt-3 text-center">
          <button
            onClick={handleCreateNew}
            className="text-[11px] font-mono text-amber-600 hover:text-amber-400 tracking-wider transition-colors"
          >
            + Create your own Battle HQ →
          </button>
        </div>
      )}

      {/* ── NON-FOUNDING member of someone else's HQ: soft upgrade nudge ── */}
      {!isFounding && i_am_in.length > 0 && (
        <div className="mt-3">
          <button
            onClick={handleUpgrade}
            className="w-full text-left flex items-center justify-between gap-3 bg-purple-950/20 hover:bg-purple-950/30 border border-purple-800/40 hover:border-purple-700/60 rounded-xl px-4 py-2.5 transition-colors group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm flex-shrink-0">⚡</span>
              <p className="text-[11px] text-purple-300/80 group-hover:text-purple-300 transition-colors leading-snug">
                R4 or R5 in your alliance? Run your own Battle HQ.{' '}
                <span className="font-bold text-purple-400 group-hover:text-purple-300">
                  Upgrade to Founding →
                </span>
              </p>
            </div>
          </button>
        </div>
      )}
    </section>
  );
}
