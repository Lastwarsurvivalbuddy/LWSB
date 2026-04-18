'use client';

// src/components/battle-hq/dashboard/StandingContentTab.tsx
// Standing Content tab for the Commander dashboard.
//
// Three fields — all editable by creator + editor:
//   1. Comms channel (single line, short)     — HQ-level default, plans can override
//   2. Standing intel (multi-line)            — persistent intel across all battles
//   3. Standing brief (multi-line)            — persistent general brief
//
// Save pattern: inline, on blur. Optimistic — shows a "Saving…" pill
// next to the field while in flight, then "Saved ✓" for 2s, then idle.

import { useCallback, useEffect, useRef, useState } from 'react';

// ---------- Types ----------

type Role = 'creator' | 'editor' | 'viewer';
type FieldKey = 'comms_channel' | 'standing_intel' | 'standing_brief';
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface BattleHq {
  id: string;
  slug: string;
  alliance_tag: string;
  comms_channel: string | null;
  standing_intel: string | null;
  standing_brief: string | null;
}

export interface StandingContentTabProps {
  hq: BattleHq;
  role: Role;
  accessToken: string;
  onHqChanged: () => void | Promise<void>;
}

// ---------- Copy ----------

const FIELD_META: Record<
  FieldKey,
  { label: string; placeholder: string; help: string; multiline: boolean }
> = {
  comms_channel: {
    label: 'Comms Channel',
    placeholder: 'Alliance Chat, Discord voice, Line group, WhatsApp…',
    help: 'The default comms channel members should use during battle. Individual plans can override this.',
    multiline: false,
  },
  standing_intel: {
    label: 'Standing Intel',
    placeholder:
      'Long-term intel that applies across all battles — enemy alliance notes, known strategies, KOS lists…',
    help: 'Persistent intel. Shows on every battle plan alongside plan-specific intel.',
    multiline: true,
  },
  standing_brief: {
    label: 'Standing Brief',
    placeholder:
      'General standing orders — formations, rally discipline, heal-up policy, shield discipline…',
    help: 'General brief that applies across all battles.',
    multiline: true,
  },
};

// ---------- Main ----------

export default function StandingContentTab({
  hq,
  accessToken,
  onHqChanged,
}: StandingContentTabProps) {
  // Local draft state — initialized from hq, updated on edit, committed on blur
  const [values, setValues] = useState<Record<FieldKey, string>>({
    comms_channel: hq.comms_channel ?? '',
    standing_intel: hq.standing_intel ?? '',
    standing_brief: hq.standing_brief ?? '',
  });

  // Per-field save state + resettable "Saved ✓" timer
  const [saveStates, setSaveStates] = useState<Record<FieldKey, SaveState>>({
    comms_channel: 'idle',
    standing_intel: 'idle',
    standing_brief: 'idle',
  });
  const [savedMessages, setSavedMessages] = useState<Record<FieldKey, string>>({
    comms_channel: '',
    standing_intel: '',
    standing_brief: '',
  });
  const savedTimerRef = useRef<Record<FieldKey, number | null>>({
    comms_channel: null,
    standing_intel: null,
    standing_brief: null,
  });

  // If parent hq changes (e.g. after save refresh), sync values
  useEffect(() => {
    setValues({
      comms_channel: hq.comms_channel ?? '',
      standing_intel: hq.standing_intel ?? '',
      standing_brief: hq.standing_brief ?? '',
    });
  }, [hq.comms_channel, hq.standing_intel, hq.standing_brief]);

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = savedTimerRef.current;
    return () => {
      (Object.keys(timers) as FieldKey[]).forEach((k) => {
        const t = timers[k];
        if (t !== null) window.clearTimeout(t);
      });
    };
  }, []);

  const setSaveState = useCallback(
    (field: FieldKey, state: SaveState, message = '') => {
      setSaveStates((prev) => ({ ...prev, [field]: state }));
      setSavedMessages((prev) => ({ ...prev, [field]: message }));
    },
    []
  );

  const saveField = useCallback(
    async (field: FieldKey) => {
      const original = hq[field] ?? '';
      const current = values[field];
      if (current === original) return; // no-op

      setSaveState(field, 'saving');
      try {
        const res = await fetch(`/api/battle-hq/${hq.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          // Send null for empty strings so the DB clears rather than storing ''
          body: JSON.stringify({
            [field]: current.trim() === '' ? null : current,
          }),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          setSaveState(
            field,
            'error',
            `Save failed (${res.status})${text ? `: ${text.slice(0, 80)}` : ''}`
          );
          return;
        }
        setSaveState(field, 'saved', 'Saved ✓');
        const existing = savedTimerRef.current[field];
        if (existing !== null) window.clearTimeout(existing);
        savedTimerRef.current[field] = window.setTimeout(() => {
          setSaveState(field, 'idle');
        }, 2000);
        await onHqChanged();
      } catch (err) {
        setSaveState(
          field,
          'error',
          err instanceof Error ? err.message : 'Network error'
        );
      }
    },
    [hq, values, accessToken, onHqChanged, setSaveState]
  );

  const handleChange = (field: FieldKey, next: string) => {
    setValues((prev) => ({ ...prev, [field]: next }));
    if (saveStates[field] === 'error' || saveStates[field] === 'saved') {
      setSaveState(field, 'idle');
    }
  };

  // ---------- Render ----------

  return (
    <div className="space-y-6">
      <div className="text-[11px] font-mono text-zinc-500 tracking-wider leading-relaxed">
        Standing content applies across every battle plan in this HQ. Edit any
        field and tap outside to save.
      </div>

      {(Object.keys(FIELD_META) as FieldKey[]).map((field) => {
        const meta = FIELD_META[field];
        const state = saveStates[field];
        const message = savedMessages[field];
        return (
          <div
            key={field}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase">
                {meta.label}
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase">
                {state === 'saving' && (
                  <span className="text-zinc-500">Saving…</span>
                )}
                {state === 'saved' && (
                  <span className="text-green-400">{message}</span>
                )}
                {state === 'error' && (
                  <span className="text-red-400">{message}</span>
                )}
              </div>
            </div>

            {meta.multiline ? (
              <textarea
                value={values[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                onBlur={() => saveField(field)}
                placeholder={meta.placeholder}
                rows={6}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 resize-y leading-relaxed"
              />
            ) : (
              <input
                type="text"
                value={values[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                onBlur={() => saveField(field)}
                placeholder={meta.placeholder}
              />
            )}

            <div className="text-[11px] font-mono text-zinc-600 tracking-wider mt-2 leading-relaxed">
              {meta.help}
            </div>
          </div>
        );
      })}
    </div>
  );
}
