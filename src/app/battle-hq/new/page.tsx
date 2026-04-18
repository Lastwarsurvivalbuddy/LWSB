'use client';

// src/app/battle-hq/new/page.tsx
// Battle HQ V1.1 — HQ creation page. Human-resilient version.
//
// Founding-only gate. Form fields:
// - alliance_tag (required, non-empty)
// - server (required, non-empty)
// - slug (required, real-time availability check — BEST EFFORT, never blocks submit)
// - comms_channel (optional)
//
// Design principle:
// The slug-check endpoint is a courtesy. It helps the user learn "taken"
// before they hit submit. It MUST NOT gate submission. The create route is
// the definitive source of truth — if a slug is actually taken, it'll reject
// with a clear error, and we show that error inline.
//
// Rate limiting / network errors on slug-check → we show a soft "–" status
// and let the user submit anyway. The create route handles the real decision.
//
// Debounce = 600ms (up from 400) — reduces call volume without feeling slow.
// Retry-on-429 = one silent retry after 1200ms — swallows transient platform
// rate limits that users would otherwise see as mysterious errors.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// ---------- Slug validation (mirrors create/route.ts and slug-check/route.ts) ----------
const RESERVED_SLUGS = new Set<string>([
  'admin', 'api', 'guide', 'signin', 'signup', 'dashboard',
  'mission-control', 'upgrade', 'affiliate', 'contact', 'news',
  'cc', 'join', 'new', 'trash', 'settings', 'profile',
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
    case 'too_short': return 'Slug must be at least 3 characters.';
    case 'too_long': return 'Slug must be 30 characters or fewer.';
    case 'invalid_format': return 'Letters, numbers, and dashes only.';
    case 'reserved': return 'That slug is reserved. Try another.';
    case 'taken': return 'This slug is already in use. Try adding your server number or a variation.';
    default: return 'Slug is not valid.';
  }
}

// ---------- Slug availability state ----------
// Note: 'unknown' replaces the old 'error' state. Semantics: we couldn't
// verify but we're not going to block the user. Submit is allowed from this
// state — create route will be authoritative.
type SlugState =
  | { kind: 'idle' }
  | { kind: 'invalid'; reason: SlugReason }
  | { kind: 'checking' }
  | { kind: 'available' }
  | { kind: 'taken' }
  | { kind: 'unknown' };

const DEBOUNCE_MS = 600;
const RETRY_DELAY_MS = 1200;

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/signin');
        return;
      }
      if (cancelled) return;
      setAccessToken(session.access_token);

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

  // ---------- Slug availability check (debounced, retry-resilient) ----------

  /**
   * Run one slug-check attempt. Returns a SlugState result or 'retry' to
   * indicate the caller should back off and try once more. Aborted requests
   * return null — caller should ignore.
   */
  const attemptSlugCheck = useCallback(
    async (
      trimmed: string,
      signal: AbortSignal
    ): Promise<SlugState | 'retry' | null> => {
      try {
        const res = await fetch(
          `/api/battle-hq/slug-check?slug=${encodeURIComponent(trimmed)}`,
          { signal }
        );
        if (signal.aborted) return null;

        if (res.status === 429) {
          return 'retry';
        }

        if (!res.ok) {
          // Any other non-OK: fall back to unknown — lets user submit.
          return { kind: 'unknown' };
        }

        const data: { available: boolean; reason?: SlugReason } = await res.json();
        if (signal.aborted) return null;

        if (data.available) return { kind: 'available' };
        if (data.reason === 'taken') return { kind: 'taken' };
        if (data.reason) return { kind: 'invalid', reason: data.reason };
        return { kind: 'unknown' };
      } catch (err) {
        if (signal.aborted) return null;
        if ((err as Error).name === 'AbortError') return null;
        // Network error — fall back to unknown. User can still submit.
        return { kind: 'unknown' };
      }
    },
    []
  );

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

    // Debounce DB check
    setSlugState({ kind: 'checking' });

    slugDebounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      slugAbortRef.current = controller;

      // First attempt
      const first = await attemptSlugCheck(trimmed, controller.signal);
      if (controller.signal.aborted || first === null) return;

      if (first !== 'retry') {
        setSlugState(first);
        return;
      }

      // 429 — one silent retry after backoff. User should never see this.
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      if (controller.signal.aborted) return;

      const second = await attemptSlugCheck(trimmed, controller.signal);
      if (controller.signal.aborted || second === null) return;

      // If second attempt also returns 'retry', give up and let user submit.
      // Create route is the final authority — no point nagging them further.
      if (second === 'retry') {
        setSlugState({ kind: 'unknown' });
        return;
      }
      setSlugState(second);
    }, DEBOUNCE_MS);

    return () => {
      if (slugDebounceRef.current) {
        clearTimeout(slugDebounceRef.current);
        slugDebounceRef.current = null;
      }
    };
  }, [slug, attemptSlugCheck]);

  // ---------- Derived: is form submittable? ----------
  // IMPORTANT: submission is allowed when slug state is 'available' OR
  // 'unknown'. The 'unknown' state means our preflight couldn't verify, but
  // the create route will make the final call. We never trap the user just
  // because our check fritzed.
  const canSubmit = useMemo(() => {
    if (submitting) return false;
    if (!allianceTag.trim()) return false;
    if (!server.trim()) return false;
    if (!slug.trim()) return false;

    // Block only on states we KNOW are bad.
    if (slugState.kind === 'invalid') return false;
    if (slugState.kind === 'taken') return false;
    if (slugState.kind === 'checking') return false;
    if (slugState.kind === 'idle') return false;

    // 'available' and 'unknown' both proceed — let the server decide.
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
            // Slug is actually taken, or client-side validation drifted.
            // This is the create route being authoritative — sync our UI.
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

        // Success
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
              Your current server number. Can&apos;t be changed later.
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
                {slugState.kind === 'unknown' && (
                  <span className="text-[10px] font-mono text-amber-400 tracking-widest uppercase">
                    Ready
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
              {slugState.kind === 'unknown' && previewSlug && (
                <p className="text-[11px] font-mono text-zinc-500">
                  Invite link:{' '}
                  <span className="text-amber-400">
                    lastwarsurvivalbuddy.com/cc/{previewSlug}
                  </span>
                  <span className="text-zinc-600"> — we&apos;ll confirm on create.</span>
                </p>
              )}
              {slugState.kind === 'idle' && (
                <p className="text-[11px] text-zinc-500">
                  3–30 characters. Letters, numbers, and dashes only. Permanent — can&apos;t be changed.
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
