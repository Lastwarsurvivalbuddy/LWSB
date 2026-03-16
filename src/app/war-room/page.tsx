'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DS_ROLES, DS_STAGES, type DSRole } from '@/lib/lwtDesertStormPlanData';

interface RoleAssignments {
  [roleId: string]: string;
}

export default function WarRoomPage() {
  const router = useRouter();
  const [allianceName, setAllianceName] = useState('');
  const [taskForce, setTaskForce] = useState<'A' | 'B' | 'A & B'>('A');
  const [roles, setRoles] = useState<RoleAssignments>({});
  const [commanderNote, setCommanderNote] = useState('');
  const [planGenerated, setPlanGenerated] = useState(false);
  const [saving, setSaving] = useState(false);
  const planCardRef = useRef<HTMLDivElement>(null);

  function parseNames(raw: string): string[] {
    return raw
      .split(/[,\n]+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  function handleGenerate() {
    setPlanGenerated(true);
    setTimeout(() => {
      planCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  async function handleSave() {
    if (!planCardRef.current) return;
    setSaving(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const el = planCardRef.current;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const canvas = await html2canvas(el, {
        useCORS: true,
        logging: false,
        width: el.scrollWidth,
        height: el.scrollHeight,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
        scrollX: 0,
        scrollY: -window.scrollY,
      } as any);
      const link = document.createElement('a');
      const safeName = (allianceName || 'Alliance').replace(/[^a-zA-Z0-9]/g, '-');
      link.download = `DS-BattlePlan-${safeName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }

  const displayName = allianceName.trim() || 'My Alliance';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Dashboard
          </button>
          <div className="flex-1" />
          <div className="text-right">
            <div className="text-sm font-medium text-white">Desert Storm War Room</div>
            <div className="text-xs text-gray-500">Battle plan generator</div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Intro */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            Assign roles for your Desert Storm battle. Generate a shareable plan card — screenshot it and post straight to alliance chat.
          </p>
        </div>

        {/* Alliance name */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Alliance name</label>
          <input
            type="text"
            value={allianceName}
            onChange={e => setAllianceName(e.target.value)}
            placeholder="e.g. Death Squad"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Task Force */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Task force</label>
          <div className="flex gap-2">
            {(['A', 'B', 'A & B'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTaskForce(tf)}
                className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                  taskForce === tf
                    ? 'bg-white text-gray-950 border-white font-medium'
                    : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'
                }`}
              >
                {tf === 'A & B' ? 'Both' : `Task Force ${tf}`}
              </button>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Assign roles — comma or line separated</label>
          <div className="grid grid-cols-2 gap-3">
            {DS_ROLES.map((role: DSRole) => (
              <div
                key={role.id}
                className={`bg-gray-900 border border-gray-800 rounded-xl p-3 space-y-2 ${
                  role.fullWidth ? 'col-span-2' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: role.color }}
                  />
                  <span className="text-xs font-medium text-gray-300">{role.label}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{role.hint}</p>
                <textarea
                  rows={2}
                  value={roles[role.id] ?? ''}
                  onChange={e => setRoles(prev => ({ ...prev, [role.id]: e.target.value }))}
                  placeholder={role.placeholder}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-none font-sans"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Commander note */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Commander note <span className="text-gray-600">(optional)</span></label>
          <input
            type="text"
            value={commanderNote}
            onChange={e => setCommanderNote(e.target.value)}
            placeholder="e.g. Nobody breaks hospital early. Roamers call the Silo push."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-xl transition-colors"
        >
          Generate battle plan
        </button>

        {/* ─── OUTPUT CARD ─── */}
        {planGenerated && (
          <div className="space-y-3">

            {/* Printable card — white bg for screenshot */}
            <div
              ref={planCardRef}
              className="bg-white text-gray-900 rounded-2xl border border-gray-200"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {/* Card header */}
              <div className="bg-gray-950 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-white font-semibold text-base leading-tight">
                      {displayName}
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5">
                      Desert Storm War Room · Task Force {taskForce}
                    </div>
                  </div>
                  {/* Compass */}
                  <svg width="48" height="48" viewBox="0 0 48 48" className="flex-shrink-0">
                    <circle cx="24" cy="24" r="22" fill="none" stroke="#374151" strokeWidth="1"/>
                    <circle cx="24" cy="24" r="2.5" fill="#6B7280"/>
                    {/* N needle */}
                    <polygon points="24,5 21.5,24 24,20 26.5,24" fill="#E24B4A"/>
                    {/* S needle */}
                    <polygon points="24,43 21.5,24 24,28 26.5,24" fill="#4B5563"/>
                    {/* Labels */}
                    <text x="24" y="4" textAnchor="middle" fontSize="8" fontWeight="600" fill="#E24B4A" fontFamily="system-ui">N</text>
                    <text x="24" y="47" textAnchor="middle" fontSize="8" fill="#6B7280" fontFamily="system-ui">S</text>
                    <text x="45" y="27" textAnchor="middle" fontSize="8" fill="#6B7280" fontFamily="system-ui">E</text>
                    <text x="3" y="27" textAnchor="middle" fontSize="8" fill="#6B7280" fontFamily="system-ui">W</text>
                  </svg>
                </div>
              </div>

              {/* Stage timeline strip */}
              <div className="bg-gray-100 px-5 py-2 flex gap-4 overflow-x-auto">
                {DS_STAGES.map((s, i) => (
                  <div key={i} className="flex-shrink-0 text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{s.stage}</span>
                  </div>
                ))}
              </div>

              {/* Role rows */}
              <div className="px-5 py-4 space-y-3">
                {DS_ROLES.map((role: DSRole) => {
                  const names = parseNames(roles[role.id] ?? '');
                  return (
                    <div key={role.id} className="flex gap-3 items-start">
                      <span
                        className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5"
                        style={{
                          backgroundColor: role.badgeBg.replace('0.12', '0.15'),
                          color: role.color,
                        }}
                      >
                        {role.label}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs text-gray-600 leading-snug">{role.stageAdvice}</div>
                        <div className="text-xs font-medium text-gray-900 mt-0.5">
                          {names.length
                            ? `→ ${names.join(', ')}`
                            : <span className="text-gray-400 italic">Unassigned</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Commander note */}
              {commanderNote.trim() && (
                <div className="mx-5 mb-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <p className="text-xs text-amber-800 italic">
                    📋 {commanderNote}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="bg-gray-950 px-5 py-3 flex items-center justify-between">
                <div>
                  <div className="text-white text-xs font-semibold tracking-wide">
                    LastWarSurvivalBuddy.com
                  </div>
                  <div className="text-gray-500 text-xs">AI coaching for Last War: Survival</div>
                </div>
                <div className="text-gray-600 text-xs text-right">
                  Desert Storm<br />Battle Plan
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-white text-gray-950 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : '⬇ Save plan as image'}
            </button>

            <button
              onClick={() => { setPlanGenerated(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-full py-2.5 bg-transparent border border-gray-700 text-gray-400 text-sm rounded-xl hover:border-gray-500 hover:text-gray-300 transition-colors"
            >
              Edit plan
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
