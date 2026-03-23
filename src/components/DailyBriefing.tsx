'use client';
// src/components/DailyBriefing.tsx
// Daily Briefing Card — pre-generated morning summary
// Built: March 11, 2026 (session 11)
// Fixed session 14: UTC date validation on client
// Fixed session 29: cache key aligned to duel reset (2am UTC)
// Fixed session 38: getUTCDateString uses duel-offset to match server
// Fixed session 49: refresh button made visible
// Fixed session 61: parse KEY CONTEXT section
// Fixed session 61: KEY CONTEXT removed — briefing is SITUATION + WATCH OUT only

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface BriefingSection {
  situation: string;
  watchOut: string;
}

function getDuelDateString(): string {
  const now = new Date();
  const adjusted = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const year = adjusted.getUTCFullYear();
  const month = String(adjusted.getUTCMonth() + 1).padStart(2, '0');
  const day = String(adjusted.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseBriefing(text: string): BriefingSection | null {
  try {
    const situationMatch = text.match(/\*{0,2}SITUATION\*{0,2}\s*\n([\s\S]*?)(?=\*{0,2}WATCH OUT|$)/i);
    const watchMatch = text.match(/\*{0,2}WATCH OUT\*{0,2}\s*\n([\s\S]*?)$/i);

    if (!situationMatch) return null;

    const situation = situationMatch?.[1]?.trim() ?? '';
    const watchOut = watchMatch?.[1]?.replace(/^⚠\s*/, '').trim() ?? '';

    return { situation, watchOut };
  } catch {
    return null;
  }
}

export default function DailyBriefing() {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [parsed, setParsed] = useState<BriefingSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Internal force-refresh ─────────────────────────────────────────────────
  const forceRefresh = useCallback(async (accessToken: string): Promise<boolean> => {
    try {
      const deleteRes = await fetch('/api/briefing', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!deleteRes.ok) {
        console.error('Failed to clear briefing cache:', await deleteRes.text());
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const res = await fetch('/api/briefing', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error('Briefing regen failed:', body);
        return false;
      }

      const data = await res.json();
      setBriefing(data.briefing);
      setParsed(parseBriefing(data.briefing));
      setGeneratedAt(data.generatedAt);
      setIsCached(data.cached);
      return true;
    } catch (err) {
      console.error('forceRefresh error:', err);
      return false;
    }
  }, []);

  // ── Primary fetch ──────────────────────────────────────────────────────────
  const fetchBriefing = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Not signed in');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/briefing', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to load briefing');
      }

      const data = await res.json();

      const todayDuel = getDuelDateString();
      if (data.briefingDate && data.briefingDate !== todayDuel) {
        console.warn(`Briefing date mismatch: got ${data.briefingDate}, expected ${todayDuel}. Force refreshing.`);
        const ok = await forceRefresh(session.access_token);
        if (!ok) {
          setError('Briefing is outdated and could not be refreshed. Try again in a moment.');
        }
        return;
      }

      setBriefing(data.briefing);
      setParsed(parseBriefing(data.briefing));
      setGeneratedAt(data.generatedAt);
      setIsCached(data.cached);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [forceRefresh]);

  // ── Manual refresh button handler ──────────────────────────────────────────
  const handleRefresh = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setLoading(true);
      setError(null);
      const ok = await forceRefresh(session.access_token);
      if (!ok) {
        setError('Refresh failed — try again in a moment.');
      }
    } catch {
      setError('Refresh failed — try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefing();
  }, [fetchBriefing]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const formattedTime = generatedAt
    ? new Date(generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="rounded-xl border border-yellow-500/20 bg-zinc-900/80 p-5 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-yellow-400 text-sm font-bold tracking-widest uppercase">Daily Briefing</span>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-zinc-700 rounded w-3/4" />
          <div className="h-3 bg-zinc-700 rounded w-1/2" />
          <div className="h-3 bg-zinc-700 rounded w-5/6" />
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-zinc-900/80 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-yellow-400 text-sm font-bold tracking-widest uppercase">Daily Briefing</span>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 text-xs font-semibold text-yellow-500 hover:text-yellow-300 transition-colors border border-yellow-500/40 hover:border-yellow-400 rounded px-2 py-0.5"
          >
            ↺ Refresh
          </button>
        </div>
        <p className="text-zinc-400 text-sm">{error}</p>
      </div>
    );
  }

  // ── Fallback: raw text if parse fails ─────────────────────────────────────
  if (!parsed && briefing) {
    return (
      <div className="rounded-xl border border-yellow-500/20 bg-zinc-900/80 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-yellow-400 text-sm font-bold tracking-widest uppercase">Daily Briefing</span>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 text-xs font-semibold text-yellow-500 hover:text-yellow-300 transition-colors border border-yellow-500/40 hover:border-yellow-400 rounded px-2 py-0.5"
          >
            ↺ Refresh
          </button>
        </div>
        <p className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed">{briefing}</p>
      </div>
    );
  }

  if (!parsed) return null;

  // ── Main card ──────────────────────────────────────────────────────────────
  return (
    <div className="rounded-xl border border-yellow-500/30 bg-zinc-900/90 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-yellow-500/20 bg-yellow-500/5">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">⚡ Daily Briefing</span>
          {isCached && formattedTime && (
            <span className="text-zinc-500 text-xs">· generated {formattedTime}</span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          title="Refresh briefing"
          className="flex items-center gap-1 text-xs font-semibold text-yellow-500 hover:text-yellow-300 transition-colors border border-yellow-500/40 hover:border-yellow-400 rounded px-2 py-0.5"
        >
          ↺ Refresh
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Situation */}
        {parsed.situation && (
          <div>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Situation</p>
            <p className="text-zinc-200 text-sm leading-relaxed">{parsed.situation}</p>
          </div>
        )}

        {/* Watch Out */}
        {parsed.watchOut && (
          <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-4 py-3">
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1">⚠ Watch Out</p>
            <p className="text-zinc-200 text-sm leading-relaxed">{parsed.watchOut}</p>
          </div>
        )}
      </div>
    </div>
  );
}
