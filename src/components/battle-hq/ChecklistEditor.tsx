'use client';

// src/components/battle-hq/ChecklistEditor.tsx
// Battle HQ V1.1 — Pre-War Checklist editor (creator/editor only).
//
// Shown inside the Battle Plan Editor. Lets the commander:
// - Toggle default items on/off (disabled items vanish for viewers)
// - Add custom items (30 max per plan, 120 char label)
// - Edit labels inline
// - Reorder via up/down arrows
// - Delete any item (including defaults — spec: "modify however")
//
// All writes go through /api/battle-hq/[id]/plans/[planId]/checklist-items.
// The editor is self-contained; parent just mounts it and passes hqId/planId.

import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────

export interface ChecklistItem {
  id: string;
  battle_plan_id: string;
  item_key: string;
  label: string;
  is_default: boolean;
  enabled: boolean;
  sort_order: number;
  created_by_user_id: string | null;
  created_at: string;
}

interface Props {
  hqId: string;
  planId: string;
  accessToken: string;
}

const MAX_LABEL_LENGTH = 120;
const MAX_ITEMS_PER_PLAN = 30;

// ─── Component ────────────────────────────────────────────────────────────

export default function ChecklistEditor({ hqId, planId, accessToken }: Props) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add form
  const [addLabel, setAddLabel] = useState('');
  const [adding, setAdding] = useState(false);

  // Inline edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  // Per-row busy state (toggle/reorder/delete)
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  const tokenRef = useRef(accessToken);
  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  const setBusy = useCallback((id: string, busy: boolean) => {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  // ─── Load ────────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/battle-hq/${hqId}/plans/${planId}/checklist-items`,
          {
            headers: { Authorization: `Bearer ${tokenRef.current}` },
          }
        );
        if (cancelled) return;
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          setError(
            `Couldn't load checklist (${res.status})${text ? `: ${text.slice(0, 80)}` : ''}`
          );
          setLoading(false);
          return;
        }
        const json = await res.json();
        if (cancelled) return;
        setItems(Array.isArray(json?.items) ? (json.items as ChecklistItem[]) : []);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Network error.');
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hqId, planId]);

  // ─── Actions ─────────────────────────────────────────────────────────────

  const handleAdd = useCallback(async () => {
    const label = addLabel.trim();
    if (label.length === 0) return;
    if (label.length > MAX_LABEL_LENGTH) {
      setError(`Label must be ${MAX_LABEL_LENGTH} characters or fewer.`);
      return;
    }
    if (items.length >= MAX_ITEMS_PER_PLAN) {
      setError(`Maximum ${MAX_ITEMS_PER_PLAN} checklist items per plan.`);
      return;
    }

    setAdding(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/battle-hq/${hqId}/plans/${planId}/checklist-items`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenRef.current}`,
          },
          body: JSON.stringify({ label }),
        }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        setError(
          `Couldn't add (${res.status})${text ? `: ${text.slice(0, 80)}` : ''}`
        );
        return;
      }
      const json = await res.json();
      const newItem = json?.item as ChecklistItem | undefined;
      if (newItem) {
        setItems((prev) => [...prev, newItem]);
        setAddLabel('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error.');
    } finally {
      setAdding(false);
    }
  }, [addLabel, hqId, planId, items.length]);

  const handleToggleEnabled = useCallback(
    async (item: ChecklistItem) => {
      setBusy(item.id, true);
      setError(null);

      const nextEnabled = !item.enabled;
      // Optimistic
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, enabled: nextEnabled } : i))
      );

      try {
        const res = await fetch(
          `/api/battle-hq/${hqId}/plans/${planId}/checklist-items`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenRef.current}`,
            },
            body: JSON.stringify({ id: item.id, enabled: nextEnabled }),
          }
        );
        if (!res.ok) {
          // Rollback
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, enabled: item.enabled } : i
            )
          );
          const text = await res.text().catch(() => '');
          setError(
            `Couldn't update (${res.status})${text ? `: ${text.slice(0, 80)}` : ''}`
          );
        }
      } catch (err) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, enabled: item.enabled } : i
          )
        );
        setError(err instanceof Error ? err.message : 'Network error.');
      } finally {
        setBusy(item.id, false);
      }
    },
    [hqId, planId, setBusy]
  );

  const handleStartEdit = useCallback((item: ChecklistItem) => {
    setEditingId(item.id);
    setEditLabel(item.label);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditLabel('');
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingId) return;
    const label = editLabel.trim();
    if (label.length === 0) {
      setError('Label cannot be empty.');
      return;
    }
    if (label.length > MAX_LABEL_LENGTH) {
      setError(`Label must be ${MAX_LABEL_LENGTH} characters or fewer.`);
      return;
    }

    setEditSaving(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/battle-hq/${hqId}/plans/${planId}/checklist-items`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenRef.current}`,
          },
          body: JSON.stringify({ id: editingId, label }),
        }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        setError(
          `Couldn't save (${res.status})${text ? `: ${text.slice(0, 80)}` : ''}`
        );
        return;
      }
      const json = await res.json();
      const updated = json?.item as ChecklistItem | undefined;
      if (updated) {
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        setEditingId(null);
        setEditLabel('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error.');
    } finally {
      setEditSaving(false);
    }
  }, [editingId, editLabel, hqId, planId]);

  const handleReorder = useCallback(
    async (item: ChecklistItem, direction: 'up' | 'down') => {
      setBusy(item.id, true);
      setError(null);
      try {
        const res = await fetch(
          `/api/battle-hq/${hqId}/plans/${planId}/checklist-items`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenRef.current}`,
            },
            body: JSON.stringify({ id: item.id, direction }),
          }
        );
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          setError(
            `Couldn't reorder (${res.status})${text ? `: ${text.slice(0, 80)}` : ''}`
          );
          return;
        }
        const json = await res.json();
        if (Array.isArray(json?.items)) {
          setItems(json.items as ChecklistItem[]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error.');
      } finally {
        setBusy(item.id, false);
      }
    },
    [hqId, planId, setBusy]
  );

  const handleDelete = useCallback(
    async (item: ChecklistItem) => {
      if (
        !window.confirm(
          `Remove "${item.label}" from this plan's checklist?\n\nThis clears everyone's check state for this item.`
        )
      ) {
        return;
      }
      setBusy(item.id, true);
      setError(null);
      try {
        const res = await fetch(
          `/api/battle-hq/${hqId}/plans/${planId}/checklist-items?id=${encodeURIComponent(item.id)}`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${tokenRef.current}` },
          }
        );
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          setError(
            `Couldn't delete (${res.status})${text ? `: ${text.slice(0, 80)}` : ''}`
          );
          return;
        }
        const json = await res.json();
        if (Array.isArray(json?.items)) {
          setItems(json.items as ChecklistItem[]);
        } else {
          setItems((prev) => prev.filter((i) => i.id !== item.id));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error.');
      } finally {
        setBusy(item.id, false);
      }
    },
    [hqId, planId, setBusy]
  );

  // ─── Render ──────────────────────────────────────────────────────────────

  const enabledCount = items.filter((i) => i.enabled).length;
  const totalCount = items.length;
  const atLimit = totalCount >= MAX_ITEMS_PER_PLAN;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
          Pre-War Checklist
        </div>
        <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
          {enabledCount} active · {totalCount} total
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-4">
        <div className="text-[11px] font-mono text-zinc-500 tracking-wider leading-relaxed">
          What every member sees before the battle. Toggle defaults on/off,
          rename, reorder, or add alliance-specific items. Disabled items
          vanish for viewers — set this up before you publish.
        </div>

        {error && (
          <div className="bg-red-950/60 border border-red-900/60 rounded-xl px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-[11px] font-mono text-zinc-500 tracking-widest uppercase py-4 text-center">
            Loading checklist…
          </div>
        ) : items.length === 0 ? (
          <div className="text-[11px] font-mono text-zinc-500 tracking-wider py-4 text-center">
            No items yet. Add one below.
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, idx) => {
              const isEditing = editingId === item.id;
              const busy = busyIds.has(item.id);
              const isFirst = idx === 0;
              const isLast = idx === items.length - 1;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-3 transition-colors ${
                    item.enabled
                      ? 'bg-zinc-950 border-zinc-800'
                      : 'bg-zinc-950/50 border-zinc-900 opacity-60'
                  }`}
                >
                  {isEditing ? (
                    // ─── Edit mode ─────────────────────────────────────────
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        maxLength={MAX_LABEL_LENGTH}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveEdit();
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            handleCancelEdit();
                          }
                        }}
                        className="w-full bg-zinc-900 border border-amber-500/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[10px] font-mono text-zinc-600 tracking-wider">
                          {editLabel.length} / {MAX_LABEL_LENGTH}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCancelEdit}
                            disabled={editSaving}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-zinc-700 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            disabled={editSaving || editLabel.trim().length === 0}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 text-black text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {editSaving ? 'Saving…' : 'Save'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // ─── Row mode ──────────────────────────────────────────
                    <div className="flex items-center gap-3">
                      {/* Reorder arrows */}
                      <div className="flex flex-col shrink-0">
                        <button
                          onClick={() => handleReorder(item, 'up')}
                          disabled={busy || isFirst}
                          aria-label="Move up"
                          className="w-6 h-5 flex items-center justify-center text-zinc-500 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleReorder(item, 'down')}
                          disabled={busy || isLast}
                          aria-label="Move down"
                          className="w-6 h-5 flex items-center justify-center text-zinc-500 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                      </div>

                      {/* Enable toggle + label */}
                      <button
                        onClick={() => handleToggleEnabled(item)}
                        disabled={busy}
                        aria-label={item.enabled ? 'Disable item' : 'Enable item'}
                        className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          item.enabled
                            ? 'bg-green-500 border-green-500'
                            : 'border-zinc-600'
                        }`}
                      >
                        {item.enabled && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm truncate ${
                            item.enabled ? 'text-zinc-100' : 'text-zinc-500 line-through'
                          }`}
                        >
                          {item.label}
                        </div>
                        {item.is_default && (
                          <div className="text-[10px] font-mono text-zinc-600 tracking-wider uppercase">
                            Default
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEdit(item)}
                          disabled={busy}
                          className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-zinc-700 hover:text-white disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          disabled={busy}
                          className="px-2 py-1 rounded-md bg-red-950/60 text-red-400 border border-red-900/60 text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-red-900/60 disabled:opacity-50"
                        >
                          {busy ? '…' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add new item */}
        {!loading && (
          <div className="pt-2 border-t border-zinc-800">
            <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-2">
              + Add Custom Item
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={addLabel}
                onChange={(e) => setAddLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !adding && !atLimit) {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                maxLength={MAX_LABEL_LENGTH}
                placeholder="e.g. Heroes re-equipped · SP reset · Rally captain in position"
                disabled={atLimit}
                className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 disabled:opacity-50"
              />
              <button
                onClick={handleAdd}
                disabled={adding || atLimit || addLabel.trim().length === 0}
                className="px-3 py-2 rounded-lg bg-amber-500 text-black text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {adding ? 'Adding…' : 'Add'}
              </button>
            </div>
            <div className="flex items-center justify-between gap-2 mt-2">
              <div className="text-[10px] font-mono text-zinc-600 tracking-wider">
                {addLabel.length} / {MAX_LABEL_LENGTH}
              </div>
              {atLimit && (
                <div className="text-[10px] font-mono text-amber-500 tracking-wider">
                  Max {MAX_ITEMS_PER_PLAN} items reached
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}