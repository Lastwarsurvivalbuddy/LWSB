'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface IntakeAnswers {
  report_type: string;
  tactics_cards: string[];
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  base64: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
}

interface AnalysisResult {
  outcome: string;
  report_type: string;
  verdict: string;
  opponent_name: string;
  opponent_power: string;
  power_differential: {
    attacker_power: string;
    defender_power: string;
    gap_pct: string;
    assessment: string;
  };
  troop_breakdown: {
    your_type_damage_pct: string;
    enemy_type_damage_pct: string;
    type_matchup: string;
    counter_explanation: string;
  };
  stat_comparison: {
    atk_status: string;
    hp_status: string;
    def_status: string;
    lethality_status: string;
    stat_gap_cause: string;
  };
  hero_performance: {
    skill_damage_assessment: string;
    ew_gap_suspected: boolean;
    notes: string;
  };
  formation: {
    your_formation_bonus: string;
    formation_issue: boolean;
    notes: string;
  };
  loss_severity: {
    killed_count: string;
    hospital_overflow_risk: boolean;
    permanent_loss_warning: boolean;
  };
  root_causes: string[];
  coaching: string[];
  rematch_verdict: string;
  rematch_reasoning: string;
  invisible_factors_note: string;
}

interface Meta {
  images_analyzed: number;
  reports_used_this_period: number;
  reports_remaining: number | string;
  display_limit: string;
  resets_on: string;
  tier: string;
}

interface HistoryReport {
  id: string;
  created_at: string;
  outcome: string;
  report_type: string;
  verdict: string;
  images_count: number;
  opponent_name: string;
  opponent_power: string;
}

interface BattleReportAnalyzerProps {
  isOpen: boolean;
  onClose: () => void;
  userTier: string;
  reportsUsedThisPeriod: number;
  reportsLimitThisPeriod: number;
  resetsOn: string;
  accessToken: string;
  onReportComplete?: () => void;
}

const REPORT_TYPE_OPTIONS = [
  'PvP — I attacked someone',
  'PvP — Someone attacked me',
  'PvP — Rally',
  'PvP — I was in a garrison',
  'PvP — Arena',
  'PvE — Zombie / Monster',
];

const TACTICS_CARDS_PVP: Record<string, string[]> = {
  'Core Cards — Attacker': [
    'Warmind – Rapid Rescue',
    'Warmind – Morale Boost',
    'Windrusher – Morale Boost',
    'Windrusher – Rapid Rescue',
  ],
  'Core Cards — Defender': [
    'Buluwark – Comprehensive Enhancement',
    'Buluwark – Morale Boost',
  ],
  'Battle Cards': [
    'Efficient Unity',
    'Damage Reduction Reversal',
    'Damage Reversal',
    'Attribute Aura',
    'Warmind – One Against Ten',
  ],
};

const TACTICS_CARDS_PVE: Record<string, string[]> = {
  'PvE Cards': ['Purgator – Monster Slayer'],
  'Battle Cards': ['Attribute Aura'],
};

const OUTCOME_COLOR: Record<string, string> = {
  Win: 'text-green-400',
  Loss: 'text-red-400',
  'Pyrrhic Win': 'text-yellow-400',
};

const OUTCOME_CHIP: Record<string, string> = {
  Win: 'bg-green-500/20 border-green-500/40 text-green-400',
  Loss: 'bg-red-500/20 border-red-500/40 text-red-400',
  'Pyrrhic Win': 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
};

const MATCHUP_COLOR: Record<string, string> = {
  Favored: 'text-green-400',
  Neutral: 'text-yellow-400',
  Countered: 'text-red-400',
  Unknown: 'text-gray-400',
};

const STAT_COLOR: Record<string, string> = {
  Advantage: 'text-green-400',
  Equal: 'text-yellow-400',
  Disadvantage: 'text-red-400',
  'Not visible': 'text-gray-500',
};

const REMATCH_COLOR: Record<string, string> = {
  'Yes — conditions met': 'text-green-400',
  'Not yet — see coaching': 'text-yellow-400',
  'No — power gap too large': 'text-red-400',
  'N/A — you won': 'text-green-400',
};

const card = {
  bg: '#0d0f14',
  surface: '#161a22',
  border: '#2a3040',
  gold: '#c9a84c',
  goldDim: '#7a6030',
  text: '#e8e6e0',
  textMuted: '#8b929f',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#f59e0b',
};

async function compressImage(file: File): Promise<{ base64: string; mediaType: ImageFile['mediaType'] }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 1200;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      resolve({ base64: dataUrl.split(',')[1], mediaType: 'image/jpeg' });
    };
    img.src = url;
  });
}

function formatReportDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  const diffDays = diffHours / 24;
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  if (diffDays < 2) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function getReportTypeShort(reportType: string): string {
  if (reportType.toLowerCase().includes('pve') || reportType.toLowerCase().includes('zombie')) return 'PvE';
  if (reportType.toLowerCase().includes('rally')) return 'Rally';
  if (reportType.toLowerCase().includes('arena')) return 'Arena';
  if (reportType.toLowerCase().includes('garrison')) return 'Garrison';
  return 'PvP';
}

function isPvEReport(reportType: string): boolean {
  return (
    reportType.toLowerCase().includes('pve') ||
    reportType.toLowerCase().includes('zombie') ||
    reportType.toLowerCase().includes('monster')
  );
}

function getCardGroups(reportType: string): Record<string, string[]> {
  return isPvEReport(reportType) ? TACTICS_CARDS_PVE : TACTICS_CARDS_PVP;
}

function buildShareCardHTML(result: AnalysisResult, commanderName: string): string {
  const outcomeColor = result.outcome === 'Win' ? card.green : result.outcome === 'Loss' ? card.red : card.yellow;
  const matchupColor =
    result.troop_breakdown?.type_matchup === 'Favored'
      ? card.green
      : result.troop_breakdown?.type_matchup === 'Countered'
      ? card.red
      : card.yellow;
  const rematchColor = result.rematch_verdict?.startsWith('Yes')
    ? card.green
    : result.rematch_verdict?.startsWith('No')
    ? card.red
    : card.yellow;
  const rootCausesHTML = (result.root_causes ?? [])
    .slice(0, 3)
    .map(
      (c, i) =>
        `<div style="display:flex;gap:8px;margin-bottom:6px;"><span style="color:${card.gold};font-size:12px;min-width:16px;">${i + 1}.</span><span style="color:${card.text};font-size:12px;line-height:1.4;">${c}</span></div>`
    )
    .join('');
  const coachingHTML = (result.coaching ?? [])
    .slice(0, 3)
    .map(
      (c) =>
        `<div style="display:flex;gap:8px;margin-bottom:6px;"><span style="color:${card.gold};font-size:12px;min-width:12px;">→</span><span style="color:${card.text};font-size:12px;line-height:1.4;">${c}</span></div>`
    )
    .join('');
  const opponentLine =
    result.opponent_name && result.opponent_name !== 'Unknown'
      ? `vs <strong>${result.opponent_name}</strong>${result.opponent_power && result.opponent_power !== 'not visible' ? ` (${result.opponent_power})` : ''}`
      : '';
  return `<div style="width:600px;background:${card.bg};font-family:system-ui,-apple-system,sans-serif;color:${card.text};overflow:hidden;"><div style="background:${card.surface};border-bottom:2px solid ${card.gold};padding:16px 20px;display:flex;align-items:center;justify-content:space-between;"><div><div style="font-size:10px;color:${card.goldDim};letter-spacing:0.14em;text-transform:uppercase;margin-bottom:2px;">Battle Report</div><div style="font-size:18px;font-weight:800;color:${card.gold};letter-spacing:0.04em;">LAST WAR: SURVIVAL BUDDY</div></div><div style="font-size:22px;">⚔️</div></div><div style="padding:14px 20px;background:${card.surface};border-bottom:1px solid ${card.border};display:flex;align-items:flex-start;justify-content:space-between;gap:12px;"><div style="flex:1;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;"><span style="font-size:26px;font-weight:900;color:${outcomeColor};">${result.outcome?.toUpperCase()}</span><span style="font-size:10px;font-weight:700;border:1px solid ${outcomeColor}40;background:${outcomeColor}18;color:${outcomeColor};padding:2px 8px;border-radius:4px;letter-spacing:0.06em;">${getReportTypeShort(result.report_type)}</span></div><div style="font-size:13px;font-weight:700;color:${card.yellow};margin-bottom:4px;">${result.verdict}</div>${opponentLine ? `<div style="font-size:11px;color:${card.textMuted};">${opponentLine}</div>` : ''}</div><div style="text-align:right;">${commanderName ? `<div style="font-size:10px;color:${card.textMuted};">Commander</div><div style="font-size:13px;font-weight:700;color:${card.gold};">${commanderName}</div>` : ''}</div></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:${card.border};margin-top:1px;"><div style="background:${card.bg};padding:10px 14px;"><div style="font-size:9px;color:${card.textMuted};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">Troop Matchup</div><div style="font-size:14px;font-weight:800;color:${matchupColor};">${result.troop_breakdown?.type_matchup ?? 'Unknown'}</div><div style="font-size:10px;color:${card.textMuted};margin-top:2px;">${(result.troop_breakdown?.counter_explanation ?? '').slice(0, 50)}${(result.troop_breakdown?.counter_explanation ?? '').length > 50 ? '…' : ''}</div></div><div style="background:${card.bg};padding:10px 14px;"><div style="font-size:9px;color:${card.textMuted};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">Key Stats</div>${[['ATK', result.stat_comparison?.atk_status], ['HP', result.stat_comparison?.hp_status], ['DEF', result.stat_comparison?.def_status]].map(([lbl, s]) => `<div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span style="font-size:10px;color:${card.textMuted};">${lbl}</span><span style="font-size:10px;font-weight:700;color:${s === 'Advantage' ? card.green : s === 'Disadvantage' ? card.red : card.yellow};">${s ?? '—'}</span></div>`).join('')}</div><div style="background:${card.bg};padding:10px 14px;"><div style="font-size:9px;color:${card.textMuted};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">Rematch?</div><div style="font-size:13px;font-weight:800;color:${rematchColor};line-height:1.3;">${(result.rematch_verdict ?? '—').replace('Yes — ', '✓ ').replace('No — ', '✗ ').replace('Not yet — ', '⏳ ').replace('N/A — ', '')}</div></div></div><div style="padding:14px 20px;border-bottom:1px solid ${card.border};"><div style="font-size:9px;color:${card.textMuted};text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;">🔍 Root Causes</div>${rootCausesHTML || `<div style="color:${card.textMuted};font-size:12px;">See full analysis in app</div>`}</div><div style="padding:14px 20px;border-bottom:1px solid ${card.border};"><div style="font-size:9px;color:${card.textMuted};text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;">🎯 Top Fixes</div>${coachingHTML || `<div style="color:${card.textMuted};font-size:12px;">See full analysis in app</div>`}</div><div style="background:${card.surface};border-top:1px solid ${card.border};padding:10px 20px;display:flex;align-items:center;justify-content:space-between;"><div style="font-size:10px;color:${card.goldDim};font-weight:700;letter-spacing:0.08em;">LastWarSurvivalBuddy.com</div><div style="font-size:10px;color:${card.textMuted};">AI Battle Report Analysis</div></div></div>`;
}

export default function BattleReportAnalyzer({
  isOpen,
  onClose,
  userTier,
  reportsUsedThisPeriod,
  reportsLimitThisPeriod,
  resetsOn,
  accessToken,
  onReportComplete,
}: BattleReportAnalyzerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'analyze' | 'history'>('analyze');
  const [step, setStep] = useState<'upload' | 'intake' | 'analyzing' | 'result' | 'error'>('upload');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [intake, setIntake] = useState<IntakeAnswers>({ report_type: '', tactics_cards: [] });
  const [playerContext, setPlayerContext] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [error, setError] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [savingCard, setSavingCard] = useState(false);
  const [commanderName, setCommanderName] = useState('');
  const [history, setHistory] = useState<HistoryReport[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string>('');
  const [historyFetched, setHistoryFetched] = useState(false);

  const isFree = userTier === 'free';
  const isFounding = userTier === 'founding';
  const FOUNDING_LIMIT = 15;
  const effectiveLimit = isFounding ? FOUNDING_LIMIT : reportsLimitThisPeriod;
  const isAtLimit = reportsUsedThisPeriod >= effectiveLimit;
  const isLocked = isFree || isAtLimit;
  const intakeComplete = intake.report_type !== '';
  const headerQuotaLine = isFounding
    ? `${reportsUsedThisPeriod} of 15 used this month · Founding Member`
    : `${effectiveLimit - reportsUsedThisPeriod} of ${effectiveLimit} remaining this month`;

  useEffect(() => {
    async function loadName() {
      if (!accessToken) return;
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const userId = payload?.sub;
        if (!userId) return;
        const { data } = await supabase
          .from('commander_profile')
          .select('commander_name')
          .eq('id', userId)
          .single();
        if (data?.commander_name) setCommanderName(data.commander_name);
      } catch { /* non-critical */ }
    }
    if (isOpen) loadName();
  }, [isOpen, accessToken]);

  const fetchHistory = useCallback(async () => {
    if (historyFetched) return;
    if (!accessToken) { router.push('/signin'); return; }
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const res = await fetch('/api/battle-report', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to load history');
      const data = await res.json();
      setHistory(data.reports ?? []);
      setHistoryFetched(true);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  }, [historyFetched, accessToken, router]);

  const handleReportComplete = useCallback(() => {
    setHistoryFetched(false);
    onReportComplete?.();
  }, [onReportComplete]);

  useEffect(() => {
    if (activeTab === 'history' && !historyFetched) fetchHistory();
  }, [activeTab, historyFetched, fetchHistory]);

  const handleReportTypeSelect = (val: string) =>
    setIntake(prev => ({ ...prev, report_type: val, tactics_cards: [] }));

  const toggleCard = (c: string) =>
    setIntake(prev => {
      const already = prev.tactics_cards.includes(c);
      return {
        ...prev,
        tactics_cards: already
          ? prev.tactics_cards.filter(x => x !== c)
          : [...prev.tactics_cards, c],
      };
    });

  const addFiles = useCallback(
    async (files: File[]) => {
      const remaining = 6 - images.length;
      const valid = files
        .slice(0, remaining)
        .filter(f => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(f.type));
      const newImages: ImageFile[] = await Promise.all(
        valid.map(async (file) => {
          const preview = URL.createObjectURL(file);
          const { base64, mediaType } = await compressImage(file);
          return { id: `${Date.now()}-${Math.random()}`, file, preview, base64, mediaType };
        })
      );
      setImages(prev => [...prev, ...newImages]);
    },
    [images.length]
  );

  const removeImage = (id: string) => setImages(prev => prev.filter(img => img.id !== id));
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleAnalyze = async () => {
    if (!intakeComplete || images.length === 0) return;
    if (!accessToken) { router.push('/signin'); return; }
    setAnalyzing(true);
    setStep('analyzing');
    setError('');
    try {
      const res = await fetch('/api/battle-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          images: images.map(img => ({ base64: img.base64, mediaType: img.mediaType })),
          intake,
          playerContext: playerContext.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'upgrade_required') { router.push('/upgrade'); return; }
        throw new Error(data.error || 'Analysis failed');
      }
      setResult(data.analysis as AnalysisResult);
      setMeta(data.meta as Meta);
      setStep('result');
      handleReportComplete();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(msg);
      setStep('error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setImages([]);
    setIntake({ report_type: '', tactics_cards: [] });
    setPlayerContext('');
    setResult(null);
    setMeta(null);
    setError('');
  };

  const handleAskBuddy = () => {
    if (!result) return;
    const opponentLine =
      result.opponent_name && result.opponent_name !== 'Unknown'
        ? ` vs ${result.opponent_name}${result.opponent_power && result.opponent_power !== 'not visible' ? ` (${result.opponent_power})` : ''}`
        : '';
    const summary = `I just ran a Battle Report Analysis${opponentLine}. Verdict: ${result.verdict}. Outcome: ${result.outcome}. Root causes: ${(result.root_causes ?? []).join('; ')}. Can you give me more detail on how to fix this?`;
    sessionStorage.setItem('buddy_prefill', summary);
    router.push('/buddy');
  };

  const handleSaveCard = async () => {
    if (!result || savingCard) return;
    setSavingCard(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:600px;z-index:-1;';
      container.innerHTML = buildShareCardHTML(result, commanderName);
      document.body.appendChild(container);
      const cardEl = container.firstElementChild as HTMLElement;
      const captureHeight = cardEl.scrollHeight;
      container.style.height = `${captureHeight}px`;
      const canvas = await (
        html2canvas as unknown as (
          el: HTMLElement,
          opts: Record<string, unknown>
        ) => Promise<HTMLCanvasElement>
      )(container, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        width: 600,
        height: captureHeight,
      });
      document.body.removeChild(container);
      const opponentSlug =
        result.opponent_name && result.opponent_name !== 'Unknown'
          ? result.opponent_name.replace(/[^a-zA-Z0-9]/g, '')
          : 'Battle';
      const link = document.createElement('a');
      link.download = `BattleReport-${opponentSlug}-${result.outcome.replace(/[^a-zA-Z]/g, '')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('[SaveCard error]', err);
    } finally {
      setSavingCard(false);
    }
  };

  if (!isOpen) return null;

  if (isLocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-8 text-center">
          <div className="text-4xl mb-4">⚔️</div>
          <div className="inline-block bg-yellow-500/20 border border-yellow-500/50 rounded px-3 py-1 text-yellow-400 text-xs font-bold tracking-wider mb-4">
            {isFree ? 'PRO FEATURE' : 'MONTHLY LIMIT REACHED'}
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Battle Report Analyzer</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            {isFree
              ? 'Upload your battle report screenshots. Get an expert breakdown of exactly why you won or lost — type matchup, morale cascade, decoration gap, EW analysis, and a rematch verdict.'
              : `You've used all ${effectiveLimit} analyses this month.${resetsOn ? ` Resets ${resetsOn}.` : ''}`}
          </p>
          {isFree ? (
            <button
              onClick={() => router.push('/upgrade')}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors"
            >
              Unlock with Pro →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {resetsOn ? `Come Back ${resetsOn}` : 'Come Back Next Month'}
            </button>
          )}
          <button
            onClick={onClose}
            className="mt-3 text-gray-500 text-sm hover:text-gray-300 transition-colors block w-full"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚔️</span>
            <div>
              <h2 className="text-lg font-bold text-white">Battle Report Analyzer</h2>
              <p className="text-xs text-gray-400">{headerQuotaLine}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
        </div>

        {/* Tabs */}
        {step !== 'analyzing' && (
          <div className="flex border-b border-gray-700 px-6">
            {(['analyze', 'history'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 mr-6 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'history' && history.length > 0 && (
                  <span className="ml-2 text-xs bg-gray-700 text-gray-400 rounded-full px-1.5 py-0.5">
                    {history.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && step !== 'analyzing' && (
          <div className="p-6">
            {historyLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            )}
            {historyError && (
              <div className="text-center py-8">
                <p className="text-red-400 text-sm mb-3">{historyError}</p>
                <button
                  onClick={() => { setHistoryFetched(false); fetchHistory(); }}
                  className="text-xs text-yellow-400 hover:text-yellow-300 underline"
                >
                  Try again
                </button>
              </div>
            )}
            {!historyLoading && !historyError && history.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">⚔️</div>
                <p className="text-gray-400 text-sm">No battle reports yet.</p>
                <p className="text-gray-600 text-xs mt-1">Run your first analysis to see it here.</p>
                <button
                  onClick={() => setActiveTab('analyze')}
                  className="mt-4 text-xs text-yellow-400 hover:text-yellow-300 underline"
                >
                  Analyze a report →
                </button>
              </div>
            )}
            {!historyLoading && history.length > 0 && (
              <div className="space-y-2">
                {history.map((report) => {
                  const outcomeChip = OUTCOME_CHIP[report.outcome] ?? 'bg-gray-700 border-gray-600 text-gray-400';
                  const typeShort = getReportTypeShort(report.report_type);
                  const hasOpponent = report.opponent_name && report.opponent_name !== 'Unknown';
                  const hasPower = report.opponent_power && report.opponent_power !== 'not visible';
                  return (
                    <div key={report.id} className="bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`shrink-0 text-xs font-bold border rounded px-2 py-0.5 ${outcomeChip}`}>
                          {report.outcome}
                        </span>
                        <span className="shrink-0 text-xs font-medium bg-gray-700 text-gray-400 border border-gray-600 rounded px-2 py-0.5">
                          {typeShort}
                        </span>
                        {hasOpponent && (
                          <>
                            <span className="text-gray-500 text-xs">vs</span>
                            <span className="text-gray-200 text-xs font-medium truncate">
                              {report.opponent_name}
                              {hasPower && <span className="text-gray-500 ml-1">({report.opponent_power})</span>}
                            </span>
                          </>
                        )}
                        <span className="shrink-0 ml-auto text-gray-500 text-xs">
                          {formatReportDate(report.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed truncate">{report.verdict}</p>
                    </div>
                  );
                })}
                <p className="text-center text-gray-600 text-xs pt-2">
                  Showing last {history.length} report{history.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Analyze Tab */}
        {(activeTab === 'analyze' || step === 'analyzing') && (
          <>
            {/* Step: Upload */}
            {step === 'upload' && (
              <div className="p-6 space-y-5">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Upload screenshots from your battle report.{' '}
                  <span className="text-yellow-400 font-semibold">One screenshot per tab — crop to just that screen.</span>
                </p>
                <div
                  ref={dropRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-yellow-400 bg-yellow-400/5'
                      : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
                  }`}
                >
                  <div className="text-3xl mb-3">📸</div>
                  <p className="text-gray-300 font-medium text-sm">Drop screenshots here or tap to upload</p>
                  <p className="text-gray-500 text-xs mt-1">Up to 6 screenshots · JPG, PNG, WebP</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => { if (e.target.files) addFiles(Array.from(e.target.files)); }}
                  />
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((img, idx) => (
                      <div key={img.id} className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.preview}
                          alt={`Screenshot ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-700"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            onClick={() => removeImage(img.id)}
                            className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                    {images.length < 6 && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="h-24 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-500 hover:border-gray-500 hover:text-gray-400 transition-colors text-2xl"
                      >
                        +
                      </button>
                    )}
                  </div>
                )}
                <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl p-4 text-xs text-blue-300 leading-relaxed space-y-1.5">
                  <p className="font-semibold text-blue-200 mb-2">Which screens to upload:</p>
                  <p><span className="text-white font-semibold">Screen 1 — Outcome</span> · Win/loss, power numbers, opponent name. <span className="text-yellow-400">Required.</span></p>
                  <p><span className="text-white font-semibold">Screen 2 — Troop Breakdown</span> · Tank/Aircraft/Missile % for both sides. <span className="text-yellow-400">Required.</span> This is how Buddy identifies troop types.</p>
                  <p><span className="text-white font-semibold">Screen 3 — Hero Skills</span> · Skill damage per hero. Needed for EW gap diagnosis.</p>
                  <p><span className="text-white font-semibold">Screen 4 — Stat Comparison</span> · ATK/HP/DEF arrows. Needed for decoration and gear gap diagnosis.</p>
                  <p><span className="text-white font-semibold">Screen 5 — Gear</span> · Equipment tier comparison.</p>
                  <p><span className="text-white font-semibold">Screen 6 — Power Up</span> · Game&apos;s own letter grades.</p>
                </div>
                <button
                  onClick={() => setStep('intake')}
                  disabled={images.length === 0}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold py-3 rounded-xl transition-colors"
                >
                  {images.length === 0
                    ? 'Upload at least 1 screenshot'
                    : `Continue with ${images.length} screenshot${images.length > 1 ? 's' : ''} →`}
                </button>
              </div>
            )}

            {/* Step: Intake */}
            {step === 'intake' && (
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-gray-300 text-sm mb-1 font-medium">
                    Two quick questions <span className="text-gray-500">(10 seconds)</span>
                  </p>
                  <p className="text-gray-500 text-xs">Everything else gets read directly from your screenshots.</p>
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {/* Report type */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 font-medium">What type of report is this?</label>
                  <div className="space-y-2">
                    {REPORT_TYPE_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleReportTypeSelect(opt)}
                        className={`w-full py-2.5 px-3 rounded-xl text-sm font-medium border text-left transition-colors ${
                          intake.report_type === opt
                            ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300'
                            : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tactics cards */}
                {intake.report_type !== '' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-300 font-medium">
                        Which Tactics Cards were active in your deck?
                      </label>
                      <p className="text-xs text-gray-500 mt-0.5">
                        These are invisible in screenshots — select all that apply, or skip if none.
                      </p>
                    </div>
                    {Object.entries(getCardGroups(intake.report_type)).map(([groupName, cards]) => (
                      <div key={groupName} className="space-y-1.5">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{groupName}</p>
                        <div className="space-y-1.5">
                          {cards.map(c => {
                            const selected = intake.tactics_cards.includes(c);
                            return (
                              <button
                                key={c}
                                onClick={() => toggleCard(c)}
                                className={`w-full py-2.5 px-3 rounded-xl text-sm font-medium border text-left transition-colors flex items-center gap-2.5 ${
                                  selected
                                    ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300'
                                    : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center text-xs font-bold ${
                                    selected
                                      ? 'bg-yellow-400 border-yellow-400 text-black'
                                      : 'border-gray-600 bg-gray-900'
                                  }`}
                                >
                                  {selected ? '✓' : ''}
                                </span>
                                {c}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-gray-600 italic">
                      {intake.tactics_cards.length === 0
                        ? 'Nothing selected — Buddy will note no cards were active.'
                        : `${intake.tactics_cards.length} card${intake.tactics_cards.length > 1 ? 's' : ''} selected`}
                    </p>
                  </div>
                )}

                {/* Context box */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 font-medium">
                    Add context <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={playerContext}
                    onChange={e => setPlayerContext(e.target.value)}
                    placeholder="e.g. This was a Warzone Duel attack, I want to know if my gear loadout was right"
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-gray-500 transition-colors"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('upload')}
                    className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:border-gray-600 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={!intakeComplete}
                    className="flex-[2] bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold py-3 rounded-xl transition-colors"
                  >
                    {intakeComplete ? '⚔️ Analyze Report' : 'Select report type'}
                  </button>
                </div>
              </div>
            )}

            {/* Step: Analyzing */}
            {step === 'analyzing' && (
              <div className="p-12 text-center space-y-4">
                <div className="text-4xl animate-pulse">⚔️</div>
                <h3 className="text-white font-bold text-lg">Analyzing your battle report...</h3>
                <p className="text-gray-400 text-sm">
                  Reading {images.length} screenshot{images.length > 1 ? 's' : ''}. May take up to 60 seconds.
                </p>
                <div className="flex justify-center gap-1 mt-4">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step: Error */}
            {step === 'error' && (
              <div className="p-8 text-center space-y-4">
                <div className="text-4xl">⚠️</div>
                <h3 className="text-white font-bold text-lg">Analysis Failed</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                  {error || 'Something went wrong processing your battle report. Your quota was not charged.'}
                </p>
                <p className="text-gray-600 text-xs">
                  This is usually caused by unclear screenshots or an AI parsing issue. Try again with cropped, high-contrast screenshots.
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:border-gray-600 transition-colors"
                  >
                    Start Over
                  </button>
                  <button
                    onClick={() => { setStep('intake'); setError(''); }}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors text-sm"
                  >
                    Try Again →
                  </button>
                </div>
              </div>
            )}

            {/* Step: Result */}
            {step === 'result' && result && (
              <div className="p-6 space-y-5">
                <div className="bg-gray-800 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-black ${OUTCOME_COLOR[result.outcome] ?? 'text-white'}`}>
                      {result.outcome?.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {meta?.images_analyzed} screenshot{(meta?.images_analyzed ?? 0) > 1 ? 's' : ''} analyzed
                    </span>
                  </div>
                  <div className="text-yellow-300 font-bold text-base">{result.verdict}</div>
                  {result.opponent_name && result.opponent_name !== 'Unknown' && (
                    <div className="text-gray-400 text-xs">
                      vs <span className="text-gray-200 font-medium">{result.opponent_name}</span>
                      {result.opponent_power && result.opponent_power !== 'not visible' && (
                        <span className="text-gray-500 ml-1">({result.opponent_power})</span>
                      )}
                    </div>
                  )}
                </div>

                {result.power_differential?.attacker_power !== 'not visible' && result.power_differential && (
                  <Section title="⚡ Power Differential">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Attacker</div>
                        <div className="text-white font-bold">{result.power_differential.attacker_power}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Defender</div>
                        <div className="text-white font-bold">{result.power_differential.defender_power}</div>
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-xs text-gray-400">{result.power_differential.gap_pct} gap — </span>
                      <span className="text-xs text-gray-300">{result.power_differential.assessment}</span>
                    </div>
                  </Section>
                )}

                {result.troop_breakdown && (
                  <Section title="🪖 Troop Type Matchup">
                    <div className={`text-sm font-bold mb-1 ${MATCHUP_COLOR[result.troop_breakdown.type_matchup] ?? 'text-gray-300'}`}>
                      {result.troop_breakdown.type_matchup}
                    </div>
                    <p className="text-gray-300 text-sm">{result.troop_breakdown.counter_explanation}</p>
                    {result.troop_breakdown.your_type_damage_pct !== 'not visible' && (
                      <div className="grid grid-cols-2 gap-3 mt-3 text-center text-xs">
                        <div>
                          <div className="text-gray-500 mb-1">Your troops took</div>
                          <div className={`font-bold text-base ${parseInt(result.troop_breakdown.your_type_damage_pct) > 60 ? 'text-red-400' : 'text-green-400'}`}>
                            {result.troop_breakdown.your_type_damage_pct}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Their troops took</div>
                          <div className={`font-bold text-base ${parseInt(result.troop_breakdown.enemy_type_damage_pct) > 60 ? 'text-red-400' : 'text-green-400'}`}>
                            {result.troop_breakdown.enemy_type_damage_pct}
                          </div>
                        </div>
                      </div>
                    )}
                  </Section>
                )}

                {result.stat_comparison && (
                  <Section title="📊 Stat Comparison">
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          ['ATK', result.stat_comparison.atk_status],
                          ['HP', result.stat_comparison.hp_status],
                          ['DEF', result.stat_comparison.def_status],
                          ['Lethality', result.stat_comparison.lethality_status],
                        ] as [string, string][]
                      ).map(([label, status]) => (
                        <div key={label} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                          <span className="text-gray-400 text-xs">{label}</span>
                          <span className={`text-xs font-bold ${STAT_COLOR[status] ?? 'text-gray-400'}`}>
                            {status === 'Advantage' ? '▲' : status === 'Disadvantage' ? '▼' : status === 'Equal' ? '=' : '—'}{' '}
                            {status}
                          </span>
                        </div>
                      ))}
                    </div>
                    {result.stat_comparison.stat_gap_cause !== 'Stats favorable' &&
                      result.stat_comparison.stat_gap_cause !== 'Unknown' && (
                        <p className="text-yellow-300 text-xs mt-2 font-medium">
                          {result.stat_comparison.stat_gap_cause}
                        </p>
                      )}
                  </Section>
                )}

                {result.hero_performance && (
                  <Section title="🦸 Hero Performance">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-sm font-bold ${
                          result.hero_performance.skill_damage_assessment === 'Strong'
                            ? 'text-green-400'
                            : result.hero_performance.skill_damage_assessment === 'Moderate'
                            ? 'text-yellow-400'
                            : result.hero_performance.skill_damage_assessment === 'Weak'
                            ? 'text-red-400'
                            : 'text-gray-400'
                        }`}
                      >
                        {result.hero_performance.skill_damage_assessment}
                      </span>
                      {result.hero_performance.ew_gap_suspected && (
                        <span className="text-xs bg-orange-900/50 border border-orange-700/50 text-orange-300 px-2 py-0.5 rounded-full">
                          EW gap suspected
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm">{result.hero_performance.notes}</p>
                  </Section>
                )}

                {result.formation?.formation_issue && (
                  <Section title="🔺 Formation Issue">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-300 font-bold text-sm">{result.formation.your_formation_bonus} bonus</span>
                      <span className="text-gray-500 text-xs">(max is +20%)</span>
                    </div>
                    <p className="text-gray-300 text-sm">{result.formation.notes}</p>
                  </Section>
                )}

                {result.loss_severity?.permanent_loss_warning && (
                  <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4">
                    <div className="text-red-400 font-bold text-sm mb-1">⚠️ Permanent Loss Warning</div>
                    <p className="text-red-300 text-xs">
                      Your hospital may have been full during this fight. High kill counts indicate troops died permanently. Upgrade hospital capacity before your next engagement.
                    </p>
                  </div>
                )}

                {(result.root_causes ?? []).length > 0 && (
                  <Section title="🔍 Root Causes">
                    <ul className="space-y-2">
                      {result.root_causes.map((cause, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-300">
                          <span className="text-yellow-400 shrink-0">{i + 1}.</span> {cause}
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                {(result.coaching ?? []).length > 0 && (
                  <Section title="🎯 Coaching">
                    <ul className="space-y-3">
                      {result.coaching.map((item, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="text-yellow-400 shrink-0 mt-0.5">→</span>
                          <span className="text-gray-200">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                {result.invisible_factors_note && (
                  <div className="bg-blue-900/20 border border-blue-800/40 rounded-xl p-4 text-xs text-blue-300 leading-relaxed">
                    <span className="font-semibold">Tactics Card / EW Note: </span>
                    {result.invisible_factors_note}
                  </div>
                )}

                {result.rematch_verdict && (
                  <Section title="🔁 Rematch?">
                    <div className={`text-base font-bold mb-1 ${REMATCH_COLOR[result.rematch_verdict] ?? 'text-gray-300'}`}>
                      {result.rematch_verdict}
                    </div>
                    <p className="text-gray-300 text-sm">{result.rematch_reasoning}</p>
                  </Section>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:border-gray-600 transition-colors"
                  >
                    New
                  </button>
                  <button
                    onClick={handleSaveCard}
                    disabled={savingCard}
                    className="flex-1 py-3 rounded-xl border border-amber-600/60 bg-amber-600/10 text-amber-400 text-sm font-medium hover:bg-amber-600/20 transition-colors disabled:opacity-50"
                  >
                    {savingCard ? 'Saving…' : '📸 Save Card'}
                  </button>
                  <button
                    onClick={handleAskBuddy}
                    className="flex-[2] bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors text-sm"
                  >
                    Ask Buddy More →
                  </button>
                </div>
                <p className="text-center text-xs text-gray-600">
                  {meta
                    ? isFounding
                      ? `${meta.reports_used_this_period} of 15 used this month · Founding Member`
                      : `${meta.reports_used_this_period} of ${meta.display_limit} used this billing period`
                    : headerQuotaLine}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 space-y-3">
      <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase">{title}</h4>
      {children}
    </div>
  );
}
