// src/lib/battle-hq-pending.ts
// Battle HQ V1 — post-auth "pending HQ" resolver.
//
// The /cc/[slug] public invite page writes the slug to localStorage
// (key: lwsb_pending_hq) for logged-out visitors. When that user later
// completes authentication — via signin, signup confirmation, or a
// returning session — we need to:
//
//   1. Check for a pending slug
//   2. Call POST /api/battle-hq/join on their behalf
//   3. Clear the pending marker regardless of outcome
//   4. Return a redirect target (or null if no pending HQ / redirect not needed)
//
// This is called from the dashboard page bootstrap (after the existing
// lwsb_pending_tier check and before the normal dashboard render) so it
// catches EVERY path into the authenticated app.
//
// Design notes:
// - Silent on network/API failure: if the join can't complete we still clear
//   the marker and return null. User lands on the dashboard normally.
//   They can click the invite link again if they want.
// - Revoked users (403 from /join) clear the marker and route to /cc/[slug]
//   anyway so they see the "access revoked" page instead of silent confusion.
// - Already-active members (the endpoint is idempotent) flow the same as
//   new joins — redirect to /cc/[slug] for the full member view.

const PENDING_HQ_KEY = 'lwsb_pending_hq';

export interface ResolvePendingHqResult {
  /**
   * Path to redirect the user to after the pending HQ has been handled.
   * null means "no pending HQ, or nothing special to do — continue normal flow".
   */
  redirectTo: string | null;
}

/**
 * Read, consume, and act on any pending Battle HQ slug in localStorage.
 * Always clears the marker before returning (so this function is idempotent
 * across hot reloads or accidental double-invocation).
 *
 * @param accessToken Supabase session access token (Bearer).
 * @returns Redirect target if a pending HQ was found and handled, else null.
 */
export async function resolvePendingBattleHq(
  accessToken: string
): Promise<ResolvePendingHqResult> {
  // SSR guard — localStorage is browser-only.
  if (typeof window === 'undefined') {
    return { redirectTo: null };
  }

  // Read the pending slug. Absent / empty → no work to do.
  let slug: string | null = null;
  try {
    slug = window.localStorage.getItem(PENDING_HQ_KEY);
  } catch {
    // localStorage can throw in private mode / strict cookie settings.
    return { redirectTo: null };
  }

  if (!slug || slug.trim().length === 0) {
    return { redirectTo: null };
  }

  const cleanSlug = slug.trim();

  // Always clear the marker first — we do NOT want to retry this on every
  // dashboard mount if the join fails. If there's a real problem, the user
  // can click the invite link again.
  try {
    window.localStorage.removeItem(PENDING_HQ_KEY);
  } catch {
    // Non-fatal — proceed anyway.
  }

  // Call the join endpoint. The route is idempotent for already-active
  // members, so re-joining when already a member is safe.
  try {
    const res = await fetch('/api/battle-hq/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ slug: cleanSlug }),
    });

    // 403 = revoked. Still route them to /cc/[slug] so they see the
    // "access revoked" page rather than silently landing on the dashboard.
    if (res.status === 403) {
      return { redirectTo: `/cc/${encodeURIComponent(cleanSlug)}` };
    }

    // 404 = HQ doesn't exist or has been closed. Route to /cc/[slug] so
    // the invite page renders its "not found" state.
    if (res.status === 404) {
      return { redirectTo: `/cc/${encodeURIComponent(cleanSlug)}` };
    }

    // Any other non-OK: silent fall-through. User lands on dashboard normally.
    if (!res.ok) {
      return { redirectTo: null };
    }

    // Success (new join, or idempotent re-join of active member) →
    // route to /cc/[slug] for the full member view.
    return { redirectTo: `/cc/${encodeURIComponent(cleanSlug)}` };
  } catch {
    // Network error — don't trap the user. Silent fall-through.
    return { redirectTo: null };
  }
}