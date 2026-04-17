'use client';

// src/app/cc/[slug]/page.tsx
// Battle HQ V1 — Public invite page.
//
// Handles the five user states from spec §5.1:
//   A. Logged out                         → branded landing + signup/login
//   B. Logged in, not a member            → join preview
//   C. Logged in, active member           → full HQ view (Phase 1 shell)
//   D. Logged in, revoked                 → generic revoked page (privacy)
//   E. Logged in, previously left         → treated as Case B (can rejoin)
//
// On mount:
//   - Captures ?ref=[code] to lwsb_ref localStorage (30-day TTL) for affiliate attribution
//   - Captures slug to lwsb_pending_hq localStorage for post-signup redirect

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ─── Response types from /api/battle-hq/by-slug/[slug] ────────────────────
type ByslugResponse =
  | {
      state: 'preview';
      hq: { alliance_tag: string; server: string; creator_name: string };
    }
  | {
      state: 'member';
      membership: { role: 'creator' | 'editor' | 'viewer'; joined_at: string };
      hq: {
        id: string;
        alliance_tag: string;
        server: string;
        creator_name: string;
        comms_channel: string | null;
        standing_intel: string | null;
        standing_brief: string | null;
      };
    }
  | { state: 'revoked' };

type PageState =
  | { kind: 'loading' }
  | { kind: 'not_found' }
  | { kind: 'error'; message: string }
  | { kind: 'preview'; authed: boolean; data: Extract<ByslugResponse, { state: 'preview' }>['hq'] }
  | { kind: 'member'; data: Extract<ByslugResponse, { state: 'member' }> }
  | { kind: 'revoked' };

// Thirty-day TTL for affiliate reference cookie.
const REF_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export default function BattleHQInvitePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const slug = (params?.slug ?? '').toString();
  const ref = searchParams?.get('ref') ?? null;

  const [pageState, setPageState] = useState<PageState>({ kind: 'loading' });
  const [joining, setJoining] = useState(false);

  // ─── Capture ?ref and slug to localStorage on mount ──────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (ref && ref.trim().length > 0) {
      try {
        localStorage.setItem('lwsb_ref', ref.trim());
        localStorage.setItem(
          'lwsb_ref_expires_at',
          String(Date.now() + REF_TTL_MS)
        );
      } catch {
        // localStorage can fail in private mode — silent best-effort
      }
    }

    if (slug) {
      try {
        localStorage.setItem('lwsb_pending_hq', slug);
      } catch {
        // silent best-effort
      }
    }
  }, [ref, slug]);

  // ─── Fetch HQ state on mount / slug change ───────────────────────────────
  useEffect(() => {
    if (!slug) {
      setPageState({ kind: 'not_found' });
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase!.auth.getSession();

        const headers: Record<string, string> = {};
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        const res = await fetch(
          `/api/battle-hq/by-slug/${encodeURIComponent(slug)}`,
          { headers }
        );

        if (cancelled) return;

        if (res.status === 404) {
          setPageState({ kind: 'not_found' });
          return;
        }
        if (!res.ok) {
          setPageState({
            kind: 'error',
            message: 'Something went wrong. Please try again.',
          });
          return;
        }

        const data = (await res.json()) as ByslugResponse;

        if (data.state === 'revoked') {
          setPageState({ kind: 'revoked' });
          return;
        }

        if (data.state === 'member') {
          setPageState({ kind: 'member', data });
          return;
        }

        // preview state — distinguish A (logged out) from B/E (logged in)
        setPageState({
          kind: 'preview',
          authed: !!session?.access_token,
          data: data.hq,
        });
      } catch (err) {
        if (cancelled) return;
        console.error('[cc/slug] load error:', err);
        setPageState({
          kind: 'error',
          message: 'Something went wrong. Please try again.',
        });
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // ─── Join handler — Case B/E button ───────────────────────────────────────
  const handleJoin = async () => {
    if (joining) return;
    setJoining(true);
    try {
      const {
        data: { session },
      } = await supabase!.auth.getSession();

      if (!session?.access_token) {
        router.push('/signin');
        return;
      }

      const res = await fetch('/api/battle-hq/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ slug }),
      });

      if (res.status === 403) {
        // revoked mid-flow
        setPageState({ kind: 'revoked' });
        setJoining(false);
        return;
      }

      if (!res.ok) {
        setJoining(false);
        alert('Could not join Battle HQ. Please try again.');
        return;
      }

      // Success — reload to flip into Case C member view
      window.location.reload();
    } catch (err) {
      console.error('[cc/slug] join error:', err);
      setJoining(false);
      alert('Could not join Battle HQ. Please try again.');
    }
  };

  // ─── Rendering ────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#07080a] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        {pageState.kind === 'loading' && <LoadingCard />}
        {pageState.kind === 'not_found' && <NotFoundCard />}
        {pageState.kind === 'error' && <ErrorCard message={pageState.message} />}
        {pageState.kind === 'preview' && (
          <PreviewCard
            authed={pageState.authed}
            data={pageState.data}
            onJoin={handleJoin}
            joining={joining}
          />
        )}
        {pageState.kind === 'member' && <MemberCard data={pageState.data} />}
        {pageState.kind === 'revoked' && <RevokedCard />}
      </div>

      <Footer />
    </main>
  );
}

// ─── Subcomponents ─────────────────────────────────────────────────────────

function LoadingCard() {
  return (
    <div className="bg-[#0e1014] border border-[#2a3040] rounded-xl p-8 text-center">
      <p className="text-[#606878] uppercase tracking-widest text-sm">
        Loading Battle HQ...
      </p>
    </div>
  );
}

function NotFoundCard() {
  return (
    <div className="bg-[#0e1014] border border-[#2a3040] rounded-xl p-8 text-center">
      <h1 className="text-[#e8a020] font-bold text-2xl tracking-widest uppercase mb-4">
        Battle HQ Not Found
      </h1>
      <p className="text-[#606878] mb-6">
        This Battle HQ doesn&apos;t exist or has been closed.
      </p>
      <a
        href="/"
        className="inline-block bg-gradient-to-r from-[#c0281a] to-[#e8a020] text-white font-bold py-3 px-6 rounded-lg uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        Home
      </a>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="bg-[#0e1014] border border-[#2a3040] rounded-xl p-8 text-center">
      <h1 className="text-[#e8a020] font-bold text-2xl tracking-widest uppercase mb-4">
        Error
      </h1>
      <p className="text-red-400 mb-6">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="inline-block bg-gradient-to-r from-[#c0281a] to-[#e8a020] text-white font-bold py-3 px-6 rounded-lg uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        Retry
      </button>
    </div>
  );
}

// Case A (logged out) + Case B/E (logged in, not member) share this layout.
// The CTA(s) change based on `authed`.
function PreviewCard({
  authed,
  data,
  onJoin,
  joining,
}: {
  authed: boolean;
  data: Extract<ByslugResponse, { state: 'preview' }>['hq'];
  onJoin: () => void;
  joining: boolean;
}) {
  return (
    <div className="bg-[#0e1014] border border-[#2a3040] rounded-xl p-8">
      <p className="text-[#606878] uppercase tracking-widest text-xs mb-2 text-center">
        You&apos;ve been invited to
      </p>
      <h1 className="text-[#e8a020] font-bold text-3xl tracking-widest uppercase text-center mb-2">
        [{data.alliance_tag}]
      </h1>
      <p className="text-white text-center text-lg mb-1">
        Server {data.server}
      </p>
      <p className="text-[#606878] text-center text-sm mb-8">
        Battle HQ by {data.creator_name}
      </p>

      <div className="border-t border-[#2a3040] pt-6 mb-6">
        <p className="text-white text-sm text-center mb-2">
          This is your alliance&apos;s command center.
        </p>
        <p className="text-[#606878] text-sm text-center">
          War plans, intel, and battle briefs — all in one place.
        </p>
      </div>

      {authed ? (
        <button
          onClick={onJoin}
          disabled={joining}
          className="w-full bg-gradient-to-r from-[#c0281a] to-[#e8a020] text-white font-bold py-3 rounded-lg uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {joining ? 'Joining...' : 'Join Battle HQ'}
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <a
            href="/signup"
            className="w-full bg-gradient-to-r from-[#c0281a] to-[#e8a020] text-white font-bold py-3 rounded-lg uppercase tracking-widest text-center hover:opacity-90 transition-opacity"
          >
            Sign Up Free to View
          </a>
          <a
            href="/signin"
            className="w-full border border-[#2a3040] text-white font-bold py-3 rounded-lg uppercase tracking-widest text-center hover:border-[#e8a020] transition-colors"
          >
            Log In
          </a>
          <p className="text-[#606878] text-xs text-center mt-2">
            Free forever. No card required.
          </p>
        </div>
      )}
    </div>
  );
}

// Case C — full HQ view (Phase 1 shell).
function MemberCard({
  data,
}: {
  data: Extract<ByslugResponse, { state: 'member' }>;
}) {
  const { hq, membership } = data;
  const roleLabel =
    membership.role === 'creator'
      ? 'Battle HQ Commander'
      : membership.role === 'editor'
      ? 'Editor'
      : 'Viewer';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#0e1014] border border-[#2a3040] rounded-xl p-8">
        <p className="text-[#606878] uppercase tracking-widest text-xs mb-2">
          Battle HQ
        </p>
        <h1 className="text-[#e8a020] font-bold text-3xl tracking-widest uppercase mb-1">
          [{hq.alliance_tag}]
        </h1>
        <p className="text-white text-lg mb-1">Server {hq.server}</p>
        <p className="text-[#606878] text-sm">
          Led by {hq.creator_name} · You are a {roleLabel}
        </p>
      </div>

      {/* Standing brief */}
      {hq.standing_brief && (
        <div className="bg-[#0e1014] border border-[#2a3040] rounded-xl p-6">
          <h2 className="text-[#e8a020] font-bold text-sm tracking-widest uppercase mb-3">
            Standing Brief
          </h2>
          <p className="text-white whitespace-pre-wrap">{hq.standing_brief}</p>
        </div>
      )}

      {/* Standing intel */}
      {hq.standing_intel && (
        <details className="bg-[#0e1014] border border-[#2a3040] rounded-xl p-6 group">
          <summary className="cursor-pointer text-[#e8a020] font-bold text-sm tracking-widest uppercase marker:text-[#e8a020]">
            Standing Intel
          </summary>
          <p className="text-white whitespace-pre-wrap mt-3">
            {hq.standing_intel}
          </p>
        </details>
      )}

      {/* Comms channel */}
      {hq.comms_channel && (
        <div className="bg-[#0e1014] border border-[#2a3040] rounded-xl p-6">
          <h2 className="text-[#e8a020] font-bold text-sm tracking-widest uppercase mb-2">
            Comms Channel
          </h2>
          <p className="text-white">{hq.comms_channel}</p>
        </div>
      )}

      {/* Plans placeholder */}
      <div className="bg-[#0e1014] border border-dashed border-[#2a3040] rounded-xl p-8 text-center">
        <p className="text-[#606878] uppercase tracking-widest text-xs mb-2">
          Battle Plans
        </p>
        <p className="text-white text-sm">
          Individual war plans will appear here.
        </p>
        <p className="text-[#606878] text-xs mt-2">Coming in the next update.</p>
      </div>
    </div>
  );
}

// Case D — generic revoked page. No alliance info shown.
function RevokedCard() {
  return (
    <div className="bg-[#0e1014] border border-[#2a3040] rounded-xl p-8 text-center">
      <h1 className="text-[#e8a020] font-bold text-2xl tracking-widest uppercase mb-4">
        Access Revoked
      </h1>
      <p className="text-white mb-2">
        Your access to this Battle HQ has been revoked.
      </p>
      <p className="text-[#606878] text-sm mb-6">
        Contact your alliance leadership if you believe this is a mistake.
      </p>
      <a
        href="/dashboard"
        className="inline-block bg-gradient-to-r from-[#c0281a] to-[#e8a020] text-white font-bold py-3 px-6 rounded-lg uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        Return to Dashboard
      </a>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-10 text-center">
      <p className="text-[#606878] text-xs tracking-wide">
        Powered by{' '}
        <a
          href="/"
          className="text-[#e8a020] hover:underline"
        >
          LastWarSurvivalBuddy.com
        </a>{' '}
        +{' '}
        <a
          href="https://cpt-hedge.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#e8a020] hover:underline"
        >
          cpt-hedge.com
        </a>
      </p>
    </footer>
  );
}
