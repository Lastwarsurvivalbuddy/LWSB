'use client';

// src/app/battle-hq/new/page.tsx
// Battle HQ V1 — HQ creation page (Launch Blocker #1).
//
// Founding-only gate. Form fields:
//   - alliance_tag (required, non-empty)
//   - server (required, non-empty)
//   - slug (required, real-time availability check)
//   - comms_channel (optional)
//
// Flow:
//   1. Auth check → redirect /signin if logged out
//   2. Founding-tier check → show upgrade CTA if not Founding
//   3. User fills form; slug availability debounced 400ms against /api/battle-hq/slug-check
//   4. Submit → POST /api/battle-hq/create → router.push(`/battle-hq/${id}/manage`)
//
// Client-side slug rules MUST stay in sync with spec §3.2 / create route / slug-check route:
//   - 3-30 chars, [A-Za-z0-9-] only, not in reserved blocklist, case-insensitive unique.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// ---------- Slug validation (mirrors create/route.ts and slug-check/route.ts) ----------

const RESERVED_SLUGS = new Set<string>([
  'admin',
  'api',
  'guide',
  'signin',
  'signup',
  'dashboard',
  'mission-control',
  'upgrade',
  'affiliate',
  'contact',
  'news',
  'cc',
  'join',
  'new',
  'trash',
  'settings',
  'profile',
]);

const SLUG_PATTERN = /^[A-Za-z0-9-]+$/;

type SlugReason = 'too_short' | 'too_long' | 'invalid_format' | 'reserved' | 'taken';

function validateSlugFormat(slug: string): SlugReason | null {
  if (slug.length < 3) return 'too_short';
  if (slug.length > 30) return 'too_long';
  if (!SLUG_PATTERN.test(slug)) return 'invalid_format';
  if (RESERVED_SLUGS.has(slug.toLowerCase())) return 'reserved';
  return null;
}

function slugReasonCopy(reason: SlugReason): string {
  switch (reason) {
    case 'too_short':
      return 'Slug must be at least 3 characters.';
    case 'too_long':
      return 'Slug must be 30 characters or fewer.';
    case 'invalid_format':
      return 'Letters, numbers, and dashes only.';
    case 'reserved':
      return 'That slug is reserved. Try another.';
    case 'taken':
      return 'This slug is already in use. Try adding your server number or a variation.';
    default:
      return 'Slug is not valid.';
  }
}

// ---------- Slug availability state ----------

type SlugState =
  | { kind: 'idle' }
  | { kind: 'invalid'; reason: SlugReason }
  | { kind: 'checking' }
  | { kind: 'available' }
  | { kind: 'taken' }
  | { kind: 'error' };

// ---------- Page ----------

export default function NewBattleHqPage() {
  const router = useRouter();

  // Auth / tier state
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isFounding, setIsFounding] = useState<boolean | null>(null);
  const [bootLoading, setBootLoading] = useState(true);

  // Form state
  const [allianceTag, setAllianceTag] = useState('');
  const [server, setServer] = useState('');
  const [slug, setSlug] = useState('');
  const [commsChannel, setCommsChannel] = useState('');

  // Slug availability
  const [slugState, setSlugState] = useState<SlugState>({ kind: 'idle' });
  const slugDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slugAbortRef = useRef<AbortController | null>(null);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ---------- Bootstrap: auth + founding tier check ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/signin');
        return;
      }

      if (cancelled) return;
      setAccessToken(session.access_token);

      // Check founding tier via subscriptions table.
      // The create route will 403 if non-founding; we gate client-side for better UX.
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('tier')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (cancelled) return;
      setIsFounding(sub?.tier === 'founding');
      setBootLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // ---------- Slug availability check (debounced) ----------
  useEffect(() => {
    // Cancel any pending debounce + inflight request.
    if (slugDebounceRef.current) {
      clearTimeout(slugDebounceRef.current);
      slugDebounceRef.current = null;
    }
    if (slugAbortRef.current) {
      slugAbortRef.current.abort();
      slugAbortRef.current = null;
    }

    const trimmed = slug.trim();

    // Empty → idle
    if (trimmed.length === 0) {
      setSlugState({ kind: 'idle' });
      return;
    }

    // Format validation first — no network call needed
    const formatError = validateSlugFormat(trimmed);
    if (formatError) {
      setSlugState({ kind: 'invalid', reason: formatError });
      return;
    }

// Debounce DB check by 400ms
    setSlugState({ kind: 'checking' });
    slugDebounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      slugAbortRef.current = controller;
      try {
        const res = await fetch(
          `/api/battle-hq/slug-check?slug=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        // If this request was aborted between send and response, ignore everything.
        if (controller.signal.aborted) return;
        if (!res.ok) {
          setSlugState({ kind: 'error' });
          return;
        }
        const data: { available: boolean; reason?: SlugReason } = await res.json();
        // Re-check abort after the JSON parse — parse can race too.
        if (controller.signal.aborted) return;
        if (data.available) {
          setSlugState({ kind: 'available' });
        } else if (data.reason === 'taken') {
          setSlugState({ kind: 'taken' });
        } else if (data.reason) {
          setSlugState({ kind: 'invalid', reason: data.reason });
        } else {
          setSlugState({ kind: 'error' });
        }
      } catch (err) {
        // Ignore any error if the controller was aborted — the next keystroke will
        // kick off a fresh check. Covers AbortError (DOMException) AND the TypeError
        // some browser/network combos throw when aborting mid-flight.
        if (controller.signal.aborted) return;
        if ((err as Error).name === 'AbortError') return;
        setSlugState({ kind: 'error' });
      }
    }, 400);

    return () => {
      if (slugDebounceRef.current) {
        clearTimeout(slugDebounceRef.current);
        slugDebounceRef.current = null;
      }
    };
  }, [slug]);

  // ---------- Derived: is form submittable? ----------
  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (!allianceTag.trim()) return false;
    if (!server.trim()) return false;
    if (!slug.trim()) return false;
    if (slugState.kind !== 'available') return false;
    return true;
  }, [submitting, allianceTag, server, slug, slugState]);

  // ---------- Submit ----------
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit || !accessToken) return;

      setSubmitError(null);
      setSubmitting(true);

      try {
        const res = await fetch('/api/battle-hq/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            slug: slug.trim(),
            alliance_tag: allianceTag.trim(),
            server: server.trim(),
            comms_channel: commsChannel.trim() || undefined,
          }),
        });

        // ---- Error handling per create/route.ts contract ----
        if (res.status === 429) {
          const body = await res.json().catch(() => ({}));
          setSubmitError(
            body?.message ??
              "You've created your maximum Battle HQs for this week. Contact the Administrator if you need more."
          );
          return;
        }

        if (res.status === 403) {
          setSubmitError(
            'Creating a Battle HQ requires Founding Member access. Upgrade at /upgrade to unlock.'
          );
          return;
        }

        if (res.status === 401) {
          router.push('/signin');
          return;
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          if (body?.error === 'invalid_slug' && body?.reason) {
            // Slug became taken between check and submit, or client-side validation drifted.
            setSlugState({
              kind: body.reason === 'taken' ? 'taken' : 'invalid',
              reason: body.reason,
            });
            setSubmitError(slugReasonCopy(body.reason));
            return;
          }
          if (body?.error === 'missing_field') {
            setSubmitError(`Missing required field: ${body.field ?? 'unknown'}.`);
            return;
          }
          setSubmitError('Something went wrong creating the Battle HQ. Try again.');
          return;
        }

        // ---- Success ----
        const data: { id: string; slug: string } = await res.json();
        router.push(`/battle-hq/${data.id}/manage`);
      } catch {
        setSubmitError('Network error — check your connection and try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [canSubmit, accessToken, slug, allianceTag, server, commsChannel, router]
  );

  // ---------- Render: bootstrap loading ----------
  if (bootLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
          Loading…
        </div>
      </div>
    );
  }

  // ---------- Render: non-Founding upgrade gate ----------
  if (isFounding === false) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-2">
            Founding Members Only
          </div>
          <h1 className="text-lg font-bold text-white mb-3">
            Battle HQ is a Founding Member benefit
          </h1>
          <p className="text-sm text-zinc-400 mb-6">
            Create a private command center for your alliance — with battle plans,
            annotated maps, and standing intel. Upgrade to Founding to unlock HQ creation.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/upgrade"
              className="px-4 py-2.5 rounded-lg bg-amber-500 text-black text-xs font-mono font-bold tracking-widest uppercase hover:bg-amber-400 transition-colors"
            >
              Upgrade to Founding
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono font-bold tracking-widest uppercase hover:bg-zinc-700 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Render: main form ----------
  const previewSlug = slug.trim().toLowerCase();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-0.5">
                New Battle HQ
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white">
                Spin up your alliance command center
              </h1>
            </div>
            <Link
              href="/dashboard"
              className="shrink-0 text-[11px] font-mono text-zinc-400 hover:text-white tracking-widest uppercase"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Alliance tag */}
          <div>
            <label
              htmlFor="alliance_tag"
              className="block text-[10px] font-mono text-zinc-400 tracking-widest uppercase mb-1.5"
            >
              Alliance Tag <span className="text-red-400">*</span>
            </label>
            <input
              id="alliance_tag"
              type="text"
              value={allianceTag}
              onChange={(e) => setAllianceTag(e.target.value)}
              maxLength={10}
              placeholder="e.g. WOLF"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900/80"
              autoComplete="off"
              spellCheck={false}
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Shown in the dashboard header, invite cards, and notifications.
            </p>
          </div>

          {/* Server */}
          <div>
            <label
              htmlFor="server"
              className="block text-[10px] font-mono text-zinc-400 tracking-widest uppercase mb-1.5"
            >
              Server <span className="text-red-400">*</span>
            </label>
            <input
              id="server"
              type="text"
              value={server}
              onChange={(e) => setServer(e.target.value)}
              maxLength={20}
              placeholder="e.g. 1032"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900/80"
              autoComplete="off"
              spellCheck={false}
              inputMode="numeric"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Your current server number. Can't be changed later.
            </p>
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block text-[10px] font-mono text-zinc-400 tracking-widest uppercase mb-1.5"
            >
              HQ Slug <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                maxLength={30}
                placeholder="e.g. wolf-1032"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900/80 pr-24"
                autoComplete="off"
                spellCheck={false}
              />
              {/* Inline status badge */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {slugState.kind === 'checking' && (
                  <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
                    Checking…
                  </span>
                )}
                {slugState.kind === 'available' && (
                  <span className="text-[10px] font-mono text-green-400 tracking-widest uppercase">
                    ✓ Free
                  </span>
                )}
                {slugState.kind === 'taken' && (
                  <span className="text-[10px] font-mono text-red-400 tracking-widest uppercase">
                    Taken
                  </span>
                )}
                {slugState.kind === 'invalid' && (
                  <span className="text-[10px] font-mono text-red-400 tracking-widest uppercase">
                    Invalid
                  </span>
                )}
                {slugState.kind === 'error' && (
                  <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
                    —
                  </span>
                )}
              </div>
            </div>

            {/* Slug preview + error messaging */}
            <div className="mt-1.5 min-h-[1.25rem]">
              {slugState.kind === 'available' && previewSlug && (
                <p className="text-[11px] font-mono text-zinc-500">
                  Invite link:{' '}
                  <span className="text-amber-400">
                    lastwarsurvivalbuddy.com/cc/{previewSlug}
                  </span>
                </p>
              )}
              {slugState.kind === 'invalid' && (
                <p className="text-[11px] text-red-400">
                  {slugReasonCopy(slugState.reason)}
                </p>
              )}
              {slugState.kind === 'taken' && (
                <p className="text-[11px] text-red-400">{slugReasonCopy('taken')}</p>
              )}
              {slugState.kind === 'error' && (
                <p className="text-[11px] text-zinc-500">
                  Couldn't check availability. Try again in a moment.
                </p>
              )}
              {slugState.kind === 'idle' && (
                <p className="text-[11px] text-zinc-500">
                  3–30 characters. Letters, numbers, and dashes only. Permanent — can't be changed.
                </p>
              )}
            </div>
          </div>

          {/* Comms channel (optional) */}
          <div>
            <label
              htmlFor="comms_channel"
              className="block text-[10px] font-mono text-zinc-400 tracking-widest uppercase mb-1.5"
            >
              Comms Channel <span className="text-zinc-600">(optional)</span>
            </label>
            <input
              id="comms_channel"
              type="text"
              value={commsChannel}
              onChange={(e) => setCommsChannel(e.target.value)}
              maxLength={200}
              placeholder="Discord #war-room or Line group name"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900/80"
              autoComplete="off"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Default comms shown on every plan. Individual plans can override.
            </p>
          </div>

          {/* Submit error */}
          {submitError && (
            <div className="bg-red-950/60 border border-red-900/60 rounded-xl px-4 py-3 text-xs text-red-300">
              {submitError}
            </div>
          )}

          {/* Action row */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Link
              href="/dashboard"
              className="text-[11px] font-mono text-zinc-400 hover:text-white tracking-widest uppercase"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!canSubmit}
              className="px-5 py-3 rounded-xl bg-amber-500 text-black text-xs font-mono font-bold tracking-widest uppercase hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Creating…' : 'Create Battle HQ'}
            </button>
          </div>
        </form>

        {/* Footer attribution */}
        <div className="mt-10 pt-6 border-t border-zinc-900 text-center">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
            Powered by lastwarsurvivalbuddy.com · Data from cpt-hedge.com
          </p>
        </div>
      </div>
    </div>
  );
}
