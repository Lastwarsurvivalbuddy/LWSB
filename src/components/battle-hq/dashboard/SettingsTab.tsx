'use client';

// src/components/battle-hq/dashboard/SettingsTab.tsx
// Settings tab for the Commander dashboard. CREATOR ONLY.
//
// Sections:
//   1. Slug — read-only reference + Copy
//   2. Alliance identity — read-only V1 (tag + server immutable once created)
//   3. Transfer ownership — modal, requires typed-confirm of target commander name
//   4. Delete HQ — modal, requires typed-confirm of slug
//
// V1 scope note: changing alliance tag / server mid-cycle is deliberately
// deferred — it has cross-cutting implications (affiliate attribution,
// plan name references). Creators who made a typo can delete + recreate.

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

// ---------- Types ----------

interface BattleHq {
  id: string;
  slug: string;
  alliance_tag: string;
  server: string;
  creator_user_id: string;
}

export interface SettingsTabProps {
  hq: BattleHq;
  accessToken: string;
  onHqChanged: () => void | Promise<void>;
}

type Modal = 'none' | 'transfer' | 'delete';

// ---------- Main ----------

export default function SettingsTab({
  hq,
  accessToken,
  onHqChanged,
}: SettingsTabProps) {
  const router = useRouter();

  const [modal, setModal] = useState<Modal>('none');
  const [slugCopied, setSlugCopied] = useState(false);

  // Transfer state
  const [transferEmail, setTransferEmail] = useState('');
  const [transferConfirm, setTransferConfirm] = useState('');
  const [transferBusy, setTransferBusy] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);

  // Delete state
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ---------- Copy slug ----------

  const handleCopySlug = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(hq.slug);
      setSlugCopied(true);
      setTimeout(() => setSlugCopied(false), 2000);
    } catch {
      /* no-op */
    }
  }, [hq.slug]);

  // ---------- Transfer ----------

  const openTransfer = () => {
    setTransferEmail('');
    setTransferConfirm('');
    setTransferError(null);
    setModal('transfer');
  };

  const handleTransfer = useCallback(async () => {
    setTransferError(null);
    if (!transferEmail.trim()) {
      setTransferError('Enter the new owner\u2019s account email.');
      return;
    }
    if (transferConfirm !== 'TRANSFER') {
      setTransferError('Type TRANSFER to confirm.');
      return;
    }

    setTransferBusy(true);
    try {
      const res = await fetch(`/api/battle-hq/${hq.id}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ new_owner_email: transferEmail.trim() }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        setTransferError(
          `Transfer failed (${res.status})${text ? `: ${text.slice(0, 160)}` : ''}`
        );
        return;
      }
      setModal('none');
      await onHqChanged();
      // After transfer the current user is no longer creator — bounce to dashboard
      router.push('/dashboard');
    } catch (err) {
      setTransferError(
        err instanceof Error ? err.message : 'Network error — try again.'
      );
    } finally {
      setTransferBusy(false);
    }
  }, [
    transferEmail,
    transferConfirm,
    hq.id,
    accessToken,
    onHqChanged,
    router,
  ]);

  // ---------- Delete ----------

  const openDelete = () => {
    setDeleteConfirm('');
    setDeleteError(null);
    setModal('delete');
  };

  const handleDelete = useCallback(async () => {
    setDeleteError(null);
    if (deleteConfirm !== hq.slug) {
      setDeleteError(`Type the slug "${hq.slug}" exactly to confirm.`);
      return;
    }

    setDeleteBusy(true);
    try {
      const res = await fetch(`/api/battle-hq/${hq.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        setDeleteError(
          `Delete failed (${res.status})${text ? `: ${text.slice(0, 160)}` : ''}`
        );
        return;
      }
      // Soft delete — HQ stays recoverable for 30 days. Bounce to dashboard.
      router.push('/dashboard');
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Network error — try again.'
      );
    } finally {
      setDeleteBusy(false);
    }
  }, [deleteConfirm, hq.id, hq.slug, accessToken, router]);

  // ---------- Render ----------

  return (
    <div className="space-y-6">
      {/* Slug */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-2">
          Slug
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={hq.slug}
            readOnly
            onFocus={(e) => e.currentTarget.select()}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none"
          />
          <button
            onClick={handleCopySlug}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-zinc-700 transition-colors"
          >
            {slugCopied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
        <div className="text-[11px] font-mono text-zinc-500 tracking-wider mt-3 leading-relaxed">
          The slug is permanent for the lifetime of this HQ and can\u2019t be
          changed. It\u2019s the ID in your invite link.
        </div>
      </div>

      {/* Alliance identity */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-3">
          Alliance Identity
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-1">
              Alliance Tag
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-bold">
              [{hq.alliance_tag}]
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-1">
              Server
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-bold">
              {hq.server}
            </div>
          </div>
        </div>
        <div className="text-[11px] font-mono text-zinc-500 tracking-wider mt-3 leading-relaxed">
          Alliance tag and server are locked for V1. Contact the Administrator
          if you need to correct a typo.
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-4 space-y-3">
        <div className="text-[10px] font-mono text-red-400 tracking-widest uppercase mb-1">
          Danger Zone
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-bold text-white">
              Transfer Ownership
            </div>
            <div className="text-[11px] font-mono text-zinc-400 tracking-wider mt-0.5 leading-relaxed">
              Hand the HQ to another Founding-tier commander. You\u2019ll be demoted
              to editor automatically.
            </div>
          </div>
          <button
            onClick={openTransfer}
            className="shrink-0 px-3 py-2 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-zinc-700 transition-colors"
          >
            Transfer
          </button>
        </div>

        <div className="border-t border-red-900/40" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-bold text-white">Delete HQ</div>
            <div className="text-[11px] font-mono text-zinc-400 tracking-wider mt-0.5 leading-relaxed">
              Soft delete. Recoverable by you for 30 days, then permanently
              removed.
            </div>
          </div>
          <button
            onClick={openDelete}
            className="shrink-0 px-3 py-2 rounded-lg bg-red-950/60 text-red-400 border border-red-900/60 text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-red-900/60 transition-colors"
          >
            Delete HQ
          </button>
        </div>
      </div>

      {/* Transfer modal */}
      {modal === 'transfer' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
            <div className="text-[10px] font-mono text-amber-500 tracking-widest uppercase mb-2">
              Transfer Ownership
            </div>
            <h2 className="text-lg font-bold text-white mb-3">
              Hand off this Battle HQ
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              The new owner must already have a Founding-tier account and be an
              active member of this HQ. You\u2019ll become an editor after transfer.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase block mb-1">
                  New Owner Email
                </label>
                <input
                  type="email"
                  value={transferEmail}
                  onChange={(e) => setTransferEmail(e.target.value)}
                  placeholder="commander@example.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase block mb-1">
                  Type <span className="text-white">TRANSFER</span> to confirm
                </label>
                <input
                  type="text"
                  value={transferConfirm}
                  onChange={(e) => setTransferConfirm(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {transferError && (
              <div className="mt-3 text-xs text-red-400 font-mono">
                {transferError}
              </div>
            )}

            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => setModal('none')}
                disabled={transferBusy}
                className="px-3 py-2 rounded-lg text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-400 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={transferBusy}
                className="px-3 py-2 rounded-lg bg-amber-500 text-black text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {transferBusy ? 'Transferring…' : 'Confirm Transfer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {modal === 'delete' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-zinc-950 border border-red-900/60 rounded-2xl p-5">
            <div className="text-[10px] font-mono text-red-400 tracking-widest uppercase mb-2">
              Delete Battle HQ
            </div>
            <h2 className="text-lg font-bold text-white mb-3">
              This moves the HQ to Trash
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              All battle plans, members, and standing content are hidden for 30
              days. You can restore within that window. After 30 days, the HQ
              and all its data are permanently deleted.
            </p>

            <label className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase block mb-1">
              Type the slug{' '}
              <span className="text-white font-mono">{hq.slug}</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-red-500"
            />

            {deleteError && (
              <div className="mt-3 text-xs text-red-400 font-mono">
                {deleteError}
              </div>
            )}

            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => setModal('none')}
                disabled={deleteBusy}
                className="px-3 py-2 rounded-lg text-[11px] font-mono font-bold tracking-widest uppercase text-zinc-400 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteBusy}
                className="px-3 py-2 rounded-lg bg-red-950/60 text-red-400 border border-red-900/60 text-[11px] font-mono font-bold tracking-widest uppercase hover:bg-red-900/60 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteBusy ? 'Deleting…' : 'Delete HQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
