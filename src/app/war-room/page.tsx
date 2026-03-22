'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DS_ROLES, DS_STAGES, type DSRole } from '@/lib/lwtDesertStormPlanData';

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface RoleAssignments {
  [roleId: string]: string;
}

type WarRoomTab = 'ds' | 'wz' | 'cs';

// ─── WARZONE DUEL DATA ───────────────────────────────────────────────────────

const WZ_TIPS = [
  'Bare your walls before entering the contaminated zone',
  'Deploy Tactical Cards & Banners before you port',
  'Bigs port in first — fold in immediately behind them',
  'Constant sending to Capitol — never stop the pressure',
  'Ash bases with a single blue hero to clear ruins fast',
  'Cannons auto-fire on the enemy Capitol — hold them at all costs',
  'Shields CANNOT be activated inside the contaminated zone',
  "Out of troops? Take up space. Scout. You're still in the fight.",
  'Keep comms short, clear, and actionable',
  'Non-stop movement — never let the enemy settle',
];

const WZ_ORDERS_PLACEHOLDER = `-10 min: Leaders drop anchor markers
-6 min: Bigs port to position
-Fold in immediately behind
-If enemy moves early: ALL IN — fill fast
Hold until cap shows 100%`;

// ─── CANYON STORM DATA ───────────────────────────────────────────────────────

const CS_TIPS = [
  'Virus Lab (#7) opens at exactly 12 min — it\'s the win condition. Push immediately, no hesitation.',
  'Power Tower (#1) is the anchor in Phase 1. Hold it until Virus Lab opens. Don\'t abandon it for side fights.',
  'Rulebringers: Judicator does 5,000 durability dmg per teleport. Enemy bases have 6,000 total — 2 hits = destroyed.',
  'Rulebringers: Save Judicator (300s CD) for the Virus Lab contest window at 12 min — max disruption, max value.',
  'Dawnbreakers: SPREAD OUT near the Judicator player. Adjacency damage only hits bases near the teleporting player.',
  'Dawnbreakers: Assign one task force to Virus Lab assault, the other to holding mid-tier structures. No duplicated effort.',
  'No casualties — all troops recover after battle. Play aggressive. Don\'t waste your Judicator window being cautious.',
  'Sample Warehouses (#4a–4d) are lowest yield (+15/s). Only hold them if uncontested — don\'t fight over them.',
  'Individual Points charge your battle skills (energy). Fight, heal, take wounds, garrison buildings — stay active.',
  'In the final minutes: holding Virus Lab beats attacking a side base. Don\'t leave the Lab to chase kills.',
  'Lower power = capture structures first. Higher power = attack enemy bases to plunder points.',
  'Voice chat is strongly recommended. Variable situations need real-time calls.',
];

const CS_ORDERS_PLACEHOLDER = `WEST: Hit #2 + 4a/4b immediately. Low power = structures. High power = bases. Push 5a at 5 min, 6a at 8 min.
MIDDLE: Hold Power Tower #1 — do NOT abandon for side fights. Push Virus Lab #7 at exactly 12 min. Everyone available commits.
EAST: Mirror of West. #3 + 4c/4d → 5b at 5 min → 6b at 8 min.
RULEBRINGERS: [Name] holds Judicator. Save it for 12 min Virus Lab contest. Do NOT blow it on side skirmishes.
DAWNBREAKERS: Spread near Judicator player — don't cluster. Team A = Virus Lab assault at 12 min. Team B = hold mid structures.
ALL: Stick to zones. Subs standby — fill vacant primary slot at 5 min.
⚠️ List any unassigned players and their roles here.`;

type CSFaction = 'rulebringers' | 'dawnbreakers' | null;
type CSTeam = 'A' | 'B';
type CSSquadRole = 'PRIMARY' | 'SUB';

interface CSSquadRow {
  role: CSSquadRole;
  name: string;
}

function makeSquad(primaries = 7, subs = 3): CSSquadRow[] {
  return [
    ...Array(primaries).fill(null).map(() => ({ role: 'PRIMARY' as CSSquadRole, name: '' })),
    ...Array(subs).fill(null).map(() => ({ role: 'SUB' as CSSquadRole, name: '' })),
  ];
}

// ─── SHARED SAVE UTILITY ─────────────────────────────────────────────────────

async function saveCardAsImage(
  element: HTMLElement,
  filename: string,
  bgColor = '#ffffff',
  fixedWidth = 600
) {
  const html2canvas = (await import('html2canvas')).default;

  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: ${fixedWidth}px;
    overflow: visible;
    font-family: system-ui, -apple-system, sans-serif;
    background: ${bgColor};
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    z-index: -1;
  `;
  document.body.appendChild(clone);
  await new Promise(resolve => setTimeout(resolve, 100));
  const captureHeight = clone.scrollHeight;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canvas = await html2canvas(clone, {
    useCORS: true,
    logging: false,
    width: fixedWidth,
    height: captureHeight,
  } as any);

  document.body.removeChild(clone);
  const url = canvas.toDataURL('image/png');

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:#0a0a0a;z-index:9999;overflow-y:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;align-items:center;padding:20px;';
    const msg = document.createElement('p');
    msg.innerText = 'Press and hold image → Save to Photos';
    msg.style.cssText = 'color:#e8a020;font-size:15px;font-family:sans-serif;margin-top:16px;margin-bottom:16px;text-align:center;flex-shrink:0;';
    const img = document.createElement('img');
    img.src = url;
    img.style.cssText = 'width:100%;border-radius:12px;display:block;';
    const btn = document.createElement('button');
    btn.innerText = '✕ Close';
    btn.style.cssText = 'margin-top:16px;margin-bottom:32px;background:#333;color:#fff;border:none;padding:10px 24px;border-radius:8px;font-size:14px;cursor:pointer;flex-shrink:0;';
    btn.onclick = () => document.body.removeChild(overlay);
    overlay.appendChild(msg);
    overlay.appendChild(img);
    overlay.appendChild(btn);
    document.body.appendChild(overlay);
  } else {
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
  }
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function WarRoomPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<WarRoomTab>('ds');

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
            <div className="text-sm font-medium text-white">War Room</div>
            <div className="text-xs text-gray-500">Battle plan generator</div>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="flex gap-2 bg-gray-900 border border-gray-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('ds')}
            className={`flex-1 py-2 text-xs rounded-lg transition-colors font-medium ${
              activeTab === 'ds'
                ? 'bg-white text-gray-950'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            🏜️ Desert Storm
          </button>
          <button
            onClick={() => setActiveTab('wz')}
            className={`flex-1 py-2 text-xs rounded-lg transition-colors font-medium ${
              activeTab === 'wz'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            ⚔️ Warzone Duel
          </button>
          <button
            onClick={() => setActiveTab('cs')}
            className={`flex-1 py-2 text-xs rounded-lg transition-colors font-medium ${
              activeTab === 'cs'
                ? 'bg-amber-500 text-gray-950'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            ⚡ Canyon Storm
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'ds' && <DesertStormTool />}
      {activeTab === 'wz' && <WarzoneDuelTool />}
      {activeTab === 'cs' && <CanyonStormTool />}

    </div>
  );
}

// ─── DESERT STORM TOOL (unchanged) ───────────────────────────────────────────

function DesertStormTool() {
  const [allianceName, setAllianceName] = useState('');
  const [taskForce, setTaskForce] = useState<'A' | 'B' | 'A & B'>('A');
  const [roles, setRoles] = useState<RoleAssignments>({});
  const [commanderNote, setCommanderNote] = useState('');
  const [planGenerated, setPlanGenerated] = useState(false);
  const [saving, setSaving] = useState(false);
  const planCardRef = useRef<HTMLDivElement>(null);

  function parseNames(raw: string): string[] {
    return raw.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
  }

  function handleGenerate() {
    setPlanGenerated(true);
    setTimeout(() => {
      planCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  async function handleSave() {
    if (!planCardRef.current || saving) return;
    setSaving(true);
    try {
      const safeName = (allianceName || 'Alliance').replace(/[^a-zA-Z0-9]/g, '-');
      await saveCardAsImage(planCardRef.current, `DS-BattlePlan-${safeName}.png`, '#ffffff', 600);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }

  const displayName = allianceName.trim() || 'My Alliance';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-sm text-gray-300 leading-relaxed">
          Assign roles for your Desert Storm battle. Generate a shareable plan card — save it and post straight to alliance chat.
        </p>
      </div>

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

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Assign roles — comma or line separated</label>
        <div className="grid grid-cols-2 gap-3">
          {DS_ROLES.map((role: DSRole) => (
            <div
              key={role.id}
              className={`bg-gray-900 border border-gray-800 rounded-xl p-3 space-y-2 ${role.fullWidth ? 'col-span-2' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: role.color }} />
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

      <button
        onClick={handleGenerate}
        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-xl transition-colors"
      >
        Generate battle plan
      </button>

      {planGenerated && (
        <div className="space-y-3">
          <div
            ref={planCardRef}
            data-capture="plan-card"
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            <div style={{ background: '#030712', padding: '16px 20px', borderRadius: '16px 16px 0 0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '15px', lineHeight: '1.3' }}>
                    {displayName}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '11px', marginTop: '3px' }}>
                    Desert Storm War Room · Task Force {taskForce}
                  </div>
                </div>
                <svg width="48" height="48" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                  <circle cx="24" cy="24" r="22" fill="none" stroke="#374151" strokeWidth="1"/>
                  <circle cx="24" cy="24" r="2.5" fill="#6B7280"/>
                  <polygon points="24,5 21.5,24 24,20 26.5,24" fill="#E24B4A"/>
                  <polygon points="24,43 21.5,24 24,28 26.5,24" fill="#4B5563"/>
                  <text x="24" y="4" textAnchor="middle" fontSize="8" fontWeight="600" fill="#E24B4A" fontFamily="system-ui">N</text>
                  <text x="24" y="47" textAnchor="middle" fontSize="8" fill="#9CA3AF" fontFamily="system-ui">S</text>
                  <text x="45" y="27" textAnchor="middle" fontSize="8" fill="#9CA3AF" fontFamily="system-ui">E</text>
                  <text x="3" y="27" textAnchor="middle" fontSize="8" fill="#9CA3AF" fontFamily="system-ui">W</text>
                </svg>
              </div>
            </div>
            <div style={{ background: '#f3f4f6', padding: '8px 20px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {DS_STAGES.map((s, i) => (
                <div key={i} style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>{s.stage}</div>
              ))}
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {DS_ROLES.map((role: DSRole) => {
                const names = parseNames(roles[role.id] ?? '');
                return (
                  <div key={role.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{
                      flexShrink: 0, fontSize: '10px', fontWeight: 600, padding: '2px 8px',
                      borderRadius: '20px', marginTop: '1px', backgroundColor: role.badgeBg,
                      color: role.color, whiteSpace: 'nowrap',
                    }}>
                      {role.label}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.5' }}>{role.stageAdvice}</div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#111827', marginTop: '2px' }}>
                        {names.length
                          ? `→ ${names.join(', ')}`
                          : <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Unassigned</span>
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {commanderNote.trim() && (
              <div style={{ margin: '0 20px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '8px 12px' }}>
                <p style={{ fontSize: '11px', color: '#92400e', fontStyle: 'italic', margin: 0 }}>📋 {commanderNote}</p>
              </div>
            )}
            <div style={{ background: '#030712', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '0 0 16px 16px' }}>
              <div>
                <div style={{ color: '#ffffff', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em' }}>LastWarSurvivalBuddy.com</div>
                <div style={{ color: '#6b7280', fontSize: '10px', marginTop: '1px' }}>AI coaching for Last War: Survival</div>
              </div>
              <div style={{ color: '#4b5563', fontSize: '10px', textAlign: 'right' }}>Desert Storm<br />Battle Plan</div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full py-3 bg-white text-gray-950 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : '⬇ Save plan as image'}
          </button>
          <button onClick={() => { setPlanGenerated(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full py-2.5 bg-transparent border border-gray-700 text-gray-400 text-sm rounded-xl hover:border-gray-500 hover:text-gray-300 transition-colors">
            Edit plan
          </button>
        </div>
      )}
    </div>
  );
}

// ─── WARZONE DUEL TOOL (unchanged) ───────────────────────────────────────────

function WarzoneDuelTool() {
  const [attacker, setAttacker] = useState('');
  const [defender, setDefender] = useState('');
  const [assignments, setAssignments] = useState({ north: '', west: '', capitol: '', east: '', south: '' });
  const [orders, setOrders] = useState('');
  const [planGenerated, setPlanGenerated] = useState(false);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  function handleGenerate() {
    setPlanGenerated(true);
    setTimeout(() => { cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  }

  async function handleSave() {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const filename = `WZ-WarPlan-${attacker || 'server'}-vs-${defender || 'server'}.png`;
      await saveCardAsImage(cardRef.current, filename, '#0a0a14', 600);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-sm text-gray-300 leading-relaxed">
          Assign alliances to each building, write your commander's orders, and generate a shareable war plan — post it to server email, Discord, or alliance chat.
        </p>
      </div>

      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-1">
          <label className="text-xs text-blue-400 font-semibold tracking-widest">ATTACKER</label>
          <input type="text" value={attacker} onChange={e => setAttacker(e.target.value)} placeholder="#1032"
            className="w-full bg-blue-950/30 border border-blue-800/50 rounded-lg px-3 py-2 text-lg font-bold text-blue-300 text-center placeholder-blue-900 focus:outline-none focus:border-blue-500 tracking-widest" />
        </div>
        <div className="text-2xl font-bold text-red-500 pb-2 flex-shrink-0" style={{ textShadow: '0 0 20px rgba(239,68,68,0.5)' }}>VS</div>
        <div className="flex-1 space-y-1">
          <label className="text-xs text-red-400 font-semibold tracking-widest text-right block">DEFENDER</label>
          <input type="text" value={defender} onChange={e => setDefender(e.target.value)} placeholder="#1000"
            className="w-full bg-red-950/30 border border-red-800/50 rounded-lg px-3 py-2 text-lg font-bold text-red-400 text-center placeholder-red-900 focus:outline-none focus:border-red-500 tracking-widest" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Battle map — assign alliances to each building</label>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-center">
            <BuildingInput id="north" label="N CANNON" icon="🔫" value={assignments.north} onChange={v => setAssignments(p => ({ ...p, north: v }))} placeholder="e.g. [DOG] — Attack" />
          </div>
          <div className="flex items-center gap-3">
            <BuildingInput id="west" label="W CANNON" icon="🔫" value={assignments.west} onChange={v => setAssignments(p => ({ ...p, west: v }))} placeholder="e.g. [PMkr] — Hold" />
            <div className="flex-shrink-0">
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="24" fill="none" stroke="#374151" strokeWidth="1"/>
                <line x1="26" y1="2" x2="26" y2="50" stroke="#374151" strokeWidth="1" strokeDasharray="3,3"/>
                <line x1="2" y1="26" x2="50" y2="26" stroke="#374151" strokeWidth="1" strokeDasharray="3,3"/>
                <circle cx="26" cy="26" r="3" fill="#1f2937"/>
                <polygon points="26,6 23.5,26 26,21 28.5,26" fill="#e63946"/>
                <polygon points="26,46 23.5,26 26,31 28.5,26" fill="#4b5563"/>
                <text x="26" y="5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#e63946" fontFamily="system-ui">N</text>
                <text x="26" y="51" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="system-ui">S</text>
                <text x="49" y="29" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="system-ui">E</text>
                <text x="3" y="29" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="system-ui">W</text>
              </svg>
            </div>
            <BuildingInput id="east" label="E CANNON" icon="🔫" value={assignments.east} onChange={v => setAssignments(p => ({ ...p, east: v }))} placeholder="e.g. [TW] — Attack" />
          </div>
          <div className="flex justify-center">
            <BuildingInput id="south" label="S CANNON" icon="🔫" value={assignments.south} onChange={v => setAssignments(p => ({ ...p, south: v }))} placeholder="e.g. [BTU] — Hold" />
          </div>
          <div className="border-t border-gray-800 pt-3">
            <BuildingInput id="capitol" label="🏛️ CAPITOL — PRIMARY OBJECTIVE" icon="" value={assignments.capitol} onChange={v => setAssignments(p => ({ ...p, capitol: v }))} placeholder="e.g. Top 3 alliances — main rally here" isCapitol />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Commander's orders</label>
        <textarea value={orders} onChange={e => setOrders(e.target.value)} placeholder={WZ_ORDERS_PLACEHOLDER} rows={6}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-none leading-relaxed" />
      </div>

      <button onClick={handleGenerate} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-xl transition-colors">
        Generate war plan
      </button>

      {planGenerated && (
        <div className="space-y-3">
          <div ref={cardRef} style={{ background: '#0a0a14', borderRadius: '16px', border: '1px solid #e63946', fontFamily: 'system-ui, -apple-system, sans-serif', overflow: 'hidden' }}>
            <div style={{ background: '#0f0f1f', padding: '16px 20px', borderBottom: '1px solid #1a1a2e' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: '#e63946', fontSize: '10px', fontWeight: 700, letterSpacing: '4px', marginBottom: '4px' }}>WARZONE DUEL WAR ROOM</div>
                  <div style={{ color: '#fff', fontSize: '18px', fontWeight: 700, letterSpacing: '2px' }}>
                    #{attacker || '????'} <span style={{ color: '#e63946' }}>VS</span> #{defender || '????'}
                  </div>
                </div>
                <svg width="44" height="44" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="24" fill="none" stroke="#374151" strokeWidth="1.5"/>
                  <line x1="26" y1="2" x2="26" y2="50" stroke="#2a2a3a" strokeWidth="1"/>
                  <line x1="2" y1="26" x2="50" y2="26" stroke="#2a2a3a" strokeWidth="1"/>
                  <polygon points="26,6 23.5,26 26,21 28.5,26" fill="#e63946"/>
                  <polygon points="26,46 23.5,26 26,31 28.5,26" fill="#4b5563"/>
                  <text x="26" y="5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#e63946" fontFamily="system-ui">N</text>
                  <text x="26" y="51" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="system-ui">S</text>
                  <text x="49" y="29" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="system-ui">E</text>
                  <text x="3" y="29" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="system-ui">W</text>
                </svg>
              </div>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: '9px', color: '#555', letterSpacing: '4px', fontWeight: 600, marginBottom: '12px' }}>BUILDING ASSIGNMENTS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { id: 'north', label: 'N CANNON', icon: '🔫', color: '#f4a261' },
                  { id: 'west',  label: 'W CANNON', icon: '🔫', color: '#f4a261' },
                  { id: 'east',  label: 'E CANNON', icon: '🔫', color: '#f4a261' },
                  { id: 'south', label: 'S CANNON', icon: '🔫', color: '#f4a261' },
                  { id: 'capitol', label: 'CAPITOL', icon: '🏛️', color: '#e63946' },
                ].map(b => (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: b.color, letterSpacing: '2px', minWidth: '72px', flexShrink: 0 }}>{b.icon} {b.label}</span>
                    <span style={{ fontSize: '12px', color: assignments[b.id as keyof typeof assignments] ? '#e0e0e0' : '#444', fontStyle: assignments[b.id as keyof typeof assignments] ? 'normal' : 'italic' }}>
                      {assignments[b.id as keyof typeof assignments] || 'Unassigned'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {orders.trim() && (
              <div style={{ margin: '0 20px 16px', background: 'rgba(230,57,70,0.06)', border: '1px solid rgba(230,57,70,0.2)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '9px', color: '#e63946', letterSpacing: '3px', fontWeight: 700, marginBottom: '8px' }}>COMMANDER'S ORDERS</div>
                <div style={{ fontSize: '12px', color: '#ccc', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{orders}</div>
              </div>
            )}
            <div style={{ margin: '0 20px 16px' }}>
              <div style={{ fontSize: '9px', color: '#555', letterSpacing: '4px', fontWeight: 600, marginBottom: '10px' }}>COMMANDER'S DOCTRINE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {WZ_TIPS.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: '3px', height: '3px', background: '#e63946', borderRadius: '50%', marginTop: '6px', flexShrink: 0 }} />
                    <div style={{ fontSize: '11px', color: '#888', lineHeight: '1.5' }}>{tip}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#060610', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1a1a2e' }}>
              <div style={{ color: '#e63946', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>LastWarSurvivalBuddy.com</div>
              <div style={{ color: '#444', fontSize: '10px', textAlign: 'right' }}>Warzone Duel<br />War Room</div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : '⬇ Save plan as image'}
          </button>
          <button onClick={() => { setPlanGenerated(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full py-2.5 bg-transparent border border-gray-700 text-gray-400 text-sm rounded-xl hover:border-gray-500 hover:text-gray-300 transition-colors">
            Edit plan
          </button>
        </div>
      )}

      {!planGenerated && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
          <div className="text-xs text-gray-500 tracking-widest font-semibold">COMMANDER'S DOCTRINE</div>
          {WZ_TIPS.map((tip, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="w-1 h-1 rounded-full bg-red-600 mt-2 flex-shrink-0" />
              <div className="text-xs text-gray-400 leading-relaxed">{tip}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CANYON STORM TOOL ────────────────────────────────────────────────────────

function CanyonStormTool() {
  const [faction, setFaction] = useState<CSFaction>(null);
  const [team, setTeam] = useState<CSTeam>('A');
  const [buildings, setBuildings] = useState<Record<string, string>>({
    b1: '', b2: '', b3: '', b4a: '', b4b: '', b4c: '', b4d: '',
    b5a: '', b5b: '', b6a: '', b6b: '', b7: '',
  });
  const [westSquad, setWestSquad] = useState<CSSquadRow[]>(makeSquad());
  const [midSquad, setMidSquad] = useState<CSSquadRow[]>(makeSquad());
  const [eastSquad, setEastSquad] = useState<CSSquadRow[]>(makeSquad());
  const [judicator, setJudicator] = useState('');
  const [seismicTower, setSeismicTower] = useState('');
  const [fieldHospital, setFieldHospital] = useState('');
  const [turret, setTurret] = useState('');
  const [orders, setOrders] = useState('');
  const [planGenerated, setPlanGenerated] = useState(false);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  function updateBuilding(key: string, val: string) {
    setBuildings(p => ({ ...p, [key]: val }));
  }

  function updateSquad(
    squad: CSSquadRow[],
    setSquad: React.Dispatch<React.SetStateAction<CSSquadRow[]>>,
    idx: number,
    field: keyof CSSquadRow,
    value: string
  ) {
    const updated = [...squad];
    if (field === 'role') {
      updated[idx] = { ...updated[idx], role: value as CSSquadRole };
    } else {
      updated[idx] = { ...updated[idx], name: value };
    }
    setSquad(updated);
  }

  function toggleRole(
    squad: CSSquadRow[],
    setSquad: React.Dispatch<React.SetStateAction<CSSquadRow[]>>,
    idx: number
  ) {
    const updated = [...squad];
    updated[idx] = { ...updated[idx], role: updated[idx].role === 'PRIMARY' ? 'SUB' : 'PRIMARY' };
    setSquad(updated);
  }

  function handleGenerate() {
    setPlanGenerated(true);
    setTimeout(() => { cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  }

  async function handleSave() {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const factionLabel = faction === 'rulebringers' ? 'RB' : faction === 'dawnbreakers' ? `DB-${team}` : 'CS';
      await saveCardAsImage(cardRef.current, `CanyonStorm-${factionLabel}.png`, '#07080e', 600);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }

  const BUILDING_MAP = [
    { key: 'b2',  label: '#2 Data Center',    pts: '+20/s', time: '' },
    { key: 'b3',  label: '#3 Data Center',    pts: '+20/s', time: '' },
    { key: 'b1',  label: '#1 Power Tower 🛡️', pts: '+40/s', time: '' },
    { key: 'b5a', label: '#5a Serum Factory', pts: '+20/s', time: '~5 min' },
    { key: 'b5b', label: '#5b Serum Factory', pts: '+20/s', time: '~5 min' },
    { key: 'b6a', label: '#6a Defense Sys',   pts: '+20/s', time: '~8 min' },
    { key: 'b6b', label: '#6b Defense Sys',   pts: '+20/s', time: '~8 min' },
    { key: 'b7',  label: '#7 Virus Lab ⭐',   pts: '+120/s', time: '~12 min' },
  ];

  const SQUAD_CONFIGS = [
    { label: 'WEST',   zone: '#2, 4a, 4b → 5a @ 5min → 6a @ 8min', squad: westSquad, setSquad: setWestSquad },
    { label: 'MIDDLE', zone: '#1 Power Tower → #7 Virus Lab @ 12min', squad: midSquad, setSquad: setMidSquad },
    { label: 'EAST',   zone: '#3, 4c, 4d → 5b @ 5min → 6b @ 8min', squad: eastSquad, setSquad: setEastSquad },
  ];

  const factionLabel = faction === 'rulebringers'
    ? '⚖️ RULEBRINGERS'
    : faction === 'dawnbreakers'
    ? `🌅 DAWNBREAKERS · TEAM ${team}`
    : 'FACTION NOT SET';

  const factionColor = faction === 'rulebringers' ? '#f5c518' : faction === 'dawnbreakers' ? '#43a8e0' : '#6b7280';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

      {/* Intro */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-sm text-gray-300 leading-relaxed">
          2 vs 1 battle. Rulebringers (1 Task Force) vs Dawnbreakers (2 Task Forces). Assign squads, set roles, write orders — generate a shareable plan card.
        </p>
      </div>

      {/* Faction */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Your faction</label>
        <div className="flex gap-2">
          <button onClick={() => setFaction('rulebringers')}
            className={`flex-1 py-3 text-sm rounded-xl border-2 transition-colors font-medium ${
              faction === 'rulebringers' ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10' : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}>
            ⚖️ Rulebringers<br />
            <span className="text-xs font-normal opacity-70">1 Task Force · Judicator</span>
          </button>
          <button onClick={() => setFaction('dawnbreakers')}
            className={`flex-1 py-3 text-sm rounded-xl border-2 transition-colors font-medium ${
              faction === 'dawnbreakers' ? 'border-blue-400 text-blue-400 bg-blue-400/10' : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}>
            🌅 Dawnbreakers<br />
            <span className="text-xs font-normal opacity-70">2 Task Forces · Numbers</span>
          </button>
        </div>
      </div>

      {/* Team selector (Dawnbreakers only) */}
      {faction === 'dawnbreakers' && (
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Task force</label>
          <div className="flex gap-2">
            {(['A', 'B'] as CSTeam[]).map(t => (
              <button key={t} onClick={() => setTeam(t)}
                className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                  team === t ? 'bg-amber-500 text-gray-950 border-amber-500 font-bold' : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}>
                Team {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Battle timeline</label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { time: '0:00', label: 'Prep\nSpawn · Safe' },
            { time: 'Stage 1', label: 'Data Centers\nWarehouses\nPower Tower' },
            { time: '~5 min', label: 'Stage 2\nDefense Sys\nSerum Factory' },
            { time: '~12 min ⭐', label: 'Stage 3\nVirus Lab\n+120/s · WIN' },
          ].map((s, i) => (
            <div key={i} className={`flex-shrink-0 bg-gray-900 border rounded-lg px-3 py-2 text-center min-w-[80px] ${i === 3 ? 'border-amber-600/50' : 'border-gray-800'}`}>
              <div className={`text-xs font-bold font-mono ${i === 3 ? 'text-amber-400' : 'text-amber-500'}`}>{s.time}</div>
              <div className="text-xs text-gray-400 mt-1 leading-tight whitespace-pre-line">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Building assignments */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Building assignments</label>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          {/* Warehouses (full width) */}
          <div>
            <div className="text-xs text-blue-400 font-bold tracking-widest mb-2">4a · 4b · 4c · 4d — SAMPLE WAREHOUSES (+15/s each)</div>
            <div className="grid grid-cols-4 gap-2">
              {['b4a','b4b','b4c','b4d'].map((k, i) => (
                <input key={k} type="text" value={buildings[k]} onChange={e => updateBuilding(k, e.target.value)}
                  placeholder={`4${['a','b','c','d'][i]}`}
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500 text-center" />
              ))}
            </div>
          </div>
          {/* Other buildings */}
          <div className="grid grid-cols-2 gap-2">
            {BUILDING_MAP.map(b => (
              <div key={b.key} className={`space-y-1 ${b.key === 'b7' ? 'col-span-2' : ''}`}>
                <div className={`text-xs font-bold tracking-wider flex items-center justify-between ${b.key === 'b7' ? 'text-amber-400' : b.key === 'b1' ? 'text-amber-500' : 'text-gray-400'}`}>
                  <span>{b.label}</span>
                  <span className="text-green-500 font-mono">{b.pts}{b.time ? ` · ${b.time}` : ''}</span>
                </div>
                <input type="text" value={buildings[b.key]} onChange={e => updateBuilding(b.key, e.target.value)}
                  placeholder="Assign squad..."
                  className={`w-full bg-gray-800 border rounded px-2 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none ${b.key === 'b7' ? 'border-amber-800/50 focus:border-amber-500' : 'border-gray-700 focus:border-gray-500'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Squad assignments */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Squad assignments — tap role badge to toggle Primary / Sub</label>
        <div className="space-y-4">
          {SQUAD_CONFIGS.map(({ label, zone, squad, setSquad }) => (
            <div key={label}>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-t-xl border border-b-0 bg-gray-900 ${
                label === 'WEST' ? 'border-blue-900/60' : label === 'MIDDLE' ? 'border-amber-900/60' : 'border-red-900/60'
              }`}>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  label === 'WEST' ? 'bg-blue-900/40 text-blue-400' : label === 'MIDDLE' ? 'bg-amber-900/40 text-amber-400' : 'bg-red-900/40 text-red-400'
                }`}>{label}</span>
                <span className="text-xs text-gray-500 font-mono">{zone}</span>
              </div>
              <div className={`border border-t-0 rounded-b-xl overflow-hidden ${
                label === 'WEST' ? 'border-blue-900/60' : label === 'MIDDLE' ? 'border-amber-900/60' : 'border-red-900/60'
              }`}>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900/80">
                      <th className="text-left text-xs text-gray-500 font-mono tracking-widest px-3 py-2 w-24">ROLE</th>
                      <th className="text-left text-xs text-gray-500 font-mono tracking-widest px-3 py-2">COMMANDER</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-950">
                    {squad.map((row, idx) => (
                      <tr key={idx} className="border-t border-gray-800/60">
                        <td className="px-2 py-1.5">
                          <button
                            onClick={() => toggleRole(squad, setSquad, idx)}
                            className={`text-xs font-mono px-2 py-1 rounded border transition-colors ${
                              row.role === 'PRIMARY'
                                ? 'bg-green-900/30 text-green-400 border-green-900/50'
                                : 'bg-yellow-900/30 text-yellow-400 border-yellow-900/50'
                            }`}
                          >
                            {row.role}
                          </button>
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={row.name}
                            onChange={e => updateSquad(squad, setSquad, idx, 'name', e.target.value)}
                            placeholder="Name..."
                            className="w-full bg-transparent border-none text-sm text-gray-200 placeholder-gray-700 focus:outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special roles */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">
          Special roles{faction ? ` — ${faction === 'rulebringers' ? 'Rulebringers' : 'Dawnbreakers'}` : ''}
        </label>
        <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
          {faction === 'rulebringers' && <>
            <SpecialRoleRow icon="⚖️" label="Judicator" desc="5,000 durability dmg per teleport. 2 hits = destroyed base (6,000 total). Chain: −30s your CD, +60s enemy CD. 1M energy · 120s · 300s CD. Save for 12 min Virus Lab." value={judicator} onChange={setJudicator} />
            <SpecialRoleRow icon="🌩️" label="Seismic Tower" desc="1000 durability dmg on land + 300 every 3s + 60 severely wounded. 500k energy · 30s · 300s CD." value={seismicTower} onChange={setSeismicTower} />
            <SpecialRoleRow icon="🏥" label="Field Hospital" desc="300 durability + 150 wounded healed every 3s to nearby allies. 500k energy · 30s · 300s CD." value={fieldHospital} onChange={setFieldHospital} />
          </>}
          {faction === 'dawnbreakers' && <>
            <SpecialRoleRow icon="🔧" label="Turret" desc="Long-range sniper 10 grid — 300 dmg + 60 severely wounded every 2s. 750k energy · 30s · 300s CD." value={turret} onChange={setTurret} />
            <SpecialRoleRow icon="🏥" label="Field Hospital" desc="300 durability + 150 wounded healed every 3s to nearby allies. 500k energy · 30s · 300s CD." value={fieldHospital} onChange={setFieldHospital} />
          </>}
          {!faction && (
            <div className="px-4 py-3 text-xs text-gray-500 italic">Select a faction above to see special role assignments.</div>
          )}
        </div>
      </div>

      {/* Commander's orders */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Commander's orders</label>
        <textarea value={orders} onChange={e => setOrders(e.target.value)} placeholder={CS_ORDERS_PLACEHOLDER} rows={7}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-none leading-relaxed" />
      </div>

      {/* Generate */}
      <button onClick={handleGenerate} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 text-sm font-bold rounded-xl transition-colors">
        Generate battle plan
      </button>

      {/* Output card */}
      {planGenerated && (
        <div className="space-y-3">
          <div ref={cardRef} style={{ background: '#07080e', borderRadius: '16px', border: '2px solid #e05a1e', fontFamily: 'system-ui, -apple-system, sans-serif', overflow: 'hidden' }}>
            {/* Card header */}
            <div style={{ background: '#0d1520', padding: '16px 20px', borderBottom: '1px solid #1e3a5f' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: '#f5a623', fontSize: '10px', fontWeight: 700, letterSpacing: '4px', marginBottom: '4px' }}>CANYON STORM WAR ROOM</div>
                  <div style={{ color: '#fff', fontSize: '18px', fontWeight: 700, letterSpacing: '2px' }}>⚡ Canyon Storm</div>
                  <div style={{ display: 'inline-block', marginTop: '6px', padding: '2px 10px', borderRadius: '4px', background: `${factionColor}22`, color: factionColor, fontSize: '10px', fontWeight: 700, letterSpacing: '2px' }}>
                    {factionLabel}
                  </div>
                </div>
                <div style={{ textAlign: 'right', color: '#6b8aad', fontSize: '10px' }}>
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Buildings */}
            <div style={{ padding: '14px 20px 0' }}>
              <div style={{ fontSize: '9px', color: '#555', letterSpacing: '4px', fontWeight: 600, marginBottom: '8px' }}>BUILDING ASSIGNMENTS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {[
                  { key: 'b1', label: '#1 Power Tower 🛡️' },
                  { key: 'b2', label: '#2 Data Center' },
                  { key: 'b3', label: '#3 Data Center' },
                  { key: 'b4a', label: '#4a Warehouse' }, { key: 'b4b', label: '#4b Warehouse' },
                  { key: 'b4c', label: '#4c Warehouse' }, { key: 'b4d', label: '#4d Warehouse' },
                  { key: 'b5a', label: '#5a Serum Factory' }, { key: 'b5b', label: '#5b Serum Factory' },
                  { key: 'b6a', label: '#6a Defense Sys' }, { key: 'b6b', label: '#6b Defense Sys' },
                  { key: 'b7', label: '#7 Virus Lab ⭐' },
                ].filter(b => buildings[b.key]).map(b => (
                  <div key={b.key} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: b.key === 'b7' ? '#f5a623' : '#6b8aad', letterSpacing: '1px', minWidth: '110px', flexShrink: 0 }}>{b.label}</span>
                    <span style={{ fontSize: '12px', color: '#d0e4f7' }}>{buildings[b.key]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Squads */}
            <div style={{ padding: '14px 20px 0' }}>
              <div style={{ fontSize: '9px', color: '#555', letterSpacing: '4px', fontWeight: 600, marginBottom: '8px' }}>SQUADS</div>
              {[
                { label: 'WEST', color: '#43a8e0', squad: westSquad },
                { label: 'MIDDLE', color: '#f5a623', squad: midSquad },
                { label: 'EAST', color: '#ef5350', squad: eastSquad },
              ].map(({ label, color, squad }) => {
                const filled = squad.filter(r => r.name.trim());
                if (!filled.length) return null;
                return (
                  <div key={label} style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color, letterSpacing: '2px', marginBottom: '4px' }}>{label}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {filled.map((r, i) => (
                        <span key={i} style={{ fontSize: '11px', color: r.role === 'SUB' ? '#ffc107' : '#d0e4f7', background: r.role === 'SUB' ? 'rgba(255,193,7,0.1)' : 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '3px' }}>
                          {r.name}{r.role === 'SUB' ? ' (s)' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Special roles */}
            {(judicator || seismicTower || fieldHospital || turret) && (
              <div style={{ padding: '14px 20px 0' }}>
                <div style={{ fontSize: '9px', color: '#555', letterSpacing: '4px', fontWeight: 600, marginBottom: '8px' }}>SPECIAL ROLES</div>
                {[
                  { label: 'Judicator', val: judicator },
                  { label: 'Seismic Tower', val: seismicTower },
                  { label: 'Field Hospital', val: fieldHospital },
                  { label: 'Turret', val: turret },
                ].filter(r => r.val).map(r => (
                  <div key={r.label} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#f5a623', letterSpacing: '1px', minWidth: '100px', flexShrink: 0 }}>{r.label}</span>
                    <span style={{ fontSize: '12px', color: '#d0e4f7' }}>{r.val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Orders */}
            {orders.trim() && (
              <div style={{ margin: '14px 20px 0', background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(224,90,30,0.25)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '9px', color: '#e05a1e', letterSpacing: '3px', fontWeight: 700, marginBottom: '8px' }}>COMMANDER'S ORDERS</div>
                <div style={{ fontSize: '11px', color: '#ccc', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{orders}</div>
              </div>
            )}

            {/* Doctrine */}
            <div style={{ padding: '14px 20px' }}>
              <div style={{ fontSize: '9px', color: '#555', letterSpacing: '4px', fontWeight: 600, marginBottom: '8px' }}>COMMANDER'S DOCTRINE</div>
              {CS_TIPS.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '3px', height: '3px', background: '#e05a1e', borderRadius: '50%', marginTop: '6px', flexShrink: 0 }} />
                  <div style={{ fontSize: '10px', color: '#888', lineHeight: '1.5' }}>{tip}</div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ background: '#060610', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1a1a2e' }}>
              <div style={{ color: '#f5a623', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>LastWarSurvivalBuddy.com</div>
              <div style={{ color: '#444', fontSize: '10px', textAlign: 'right' }}>Canyon Storm<br />War Room</div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 text-sm font-bold rounded-xl transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : '⬇ Save plan as image'}
          </button>
          <button onClick={() => { setPlanGenerated(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full py-2.5 bg-transparent border border-gray-700 text-gray-400 text-sm rounded-xl hover:border-gray-500 hover:text-gray-300 transition-colors">
            Edit plan
          </button>
        </div>
      )}

      {/* Doctrine (pre-generate) */}
      {!planGenerated && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
          <div className="text-xs text-gray-500 tracking-widest font-semibold">COMMANDER'S DOCTRINE</div>
          {CS_TIPS.map((tip, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="w-1 h-1 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <div className="text-xs text-gray-400 leading-relaxed">{tip}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// ─── SPECIAL ROLE ROW ─────────────────────────────────────────────────────────

function SpecialRoleRow({ icon, label, desc, value, onChange }: {
  icon: string; label: string; desc: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="text-xl flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-gray-300">{label}</div>
        <div className="text-xs text-gray-500 leading-tight mt-0.5">{desc}</div>
      </div>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Assign..."
        className="w-28 bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500 flex-shrink-0" />
    </div>
  );
}

// ─── BUILDING INPUT COMPONENT ─────────────────────────────────────────────────

function BuildingInput({
  id, label, icon, value, onChange, placeholder, isCapitol = false
}: {
  id: string; label: string; icon: string; value: string;
  onChange: (v: string) => void; placeholder: string; isCapitol?: boolean;
}) {
  return (
    <div className={`space-y-1 ${isCapitol ? 'w-full' : 'w-36'}`}>
      <div className={`text-xs font-bold tracking-widest ${isCapitol ? 'text-red-500' : 'text-orange-400'}`}>
        {icon} {label}
      </div>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full bg-gray-800 border rounded px-2 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500 ${
          isCapitol ? 'border-red-900/50 focus:border-red-600' : 'border-gray-700'
        }`} />
    </div>
  );
}
