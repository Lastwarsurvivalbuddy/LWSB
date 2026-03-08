'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface ProfileForm {
  commander_name: string
  server_number: string
  server_day: string
  hq_level: string
  spend_style: string
  playstyle: string
  troop_type: string
  troop_tier: string
  server_rank: string
  hero_power: string
  total_power: string
  goals: string[]
  update_reminder_frequency: string
}

const SPEND_OPTIONS = ['F2P', 'Budget', 'Moderate', 'Investor', 'Whale', 'Mega Whale']
const PLAYSTYLE_OPTIONS = [
  { value: 'Fighter',   label: '⚔️ Fighter',   sub: 'Player vs. Player'      },
  { value: 'Developer', label: '🎯 Developer', sub: 'Player vs. Event'       },
  { value: 'Commander', label: '⚖️ Commander', sub: '50/50 Balanced'         },
  { value: 'Scout',     label: '🗺️ Scout',     sub: 'Still Figuring It Out'  },
]
const TROOP_TYPES = ['Aircraft', 'Tank', 'Missile Vehicle', 'Mixed']
const TROOP_TIERS = [
  'Below T8 / Just Starting',
  'T8',
  'T9',
  'T10 Working Towards',
  'T10 Unlocked',
  'T11',
  'T12',
]
const HQ_SHORTCUTS = [5, 10, 15, 20, 25, 30, 35]

const REMINDER_OPTIONS = [
  { value: 'daily',  label: 'Daily',  sub: 'Remind me every day'    },
  { value: 'weekly', label: 'Weekly', sub: 'Remind me every 7 days' },
  { value: 'off',    label: 'Off',    sub: 'No reminders'           },
]

const ALL_GOALS: Record<string, string[]> = {
  early: [
    'Reach T8 Troops',
    'Upgrade HQ to 20',
    'Join a Strong Alliance',
    'Complete Daily Missions',
    'Learn Arms Race Basics',
  ],
  mid: [
    'Reach T10 Troops',
    'Climb Server Rankings',
    'Maximize Arms Race Points',
    'Build Research Queue',
    'Improve Hero Power',
  ],
  late: [
    'Reach T11 Troops',
    'Hit Top 10 Server Rank',
    'Dominate Kill Event',
    'Complete Armament Research',
    'Maximize Alliance Duel Score',
    'Optimize Defense Squads',
  ],
}

function getGoalsForTier(tier: string): string[] {
  if (tier.includes('T10') || tier.includes('T9') || tier === 'T8') {
    return [...ALL_GOALS.mid, ...ALL_GOALS.early]
  }
  if (tier.includes('T11') || tier.includes('T12')) {
    return [...ALL_GOALS.late, ...ALL_GOALS.mid]
  }
  return ALL_GOALS.early
}

function formatPowerInput(raw: string): string {
  const num = parseFloat(raw.replace(/[^0-9.]/g, ''))
  if (isNaN(num)) return raw
  if (raw.toLowerCase().includes('m') || num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`
  }
  if (raw.toLowerCase().includes('k') || num >= 1_000) {
    return `${Math.round(num / 1_000)}K`
  }
  return raw
}

function parsePowerToNumber(val: string): number | null {
  if (!val) return null
  const clean = val.toLowerCase().replace(/,/g, '')
  if (clean.includes('m')) return Math.round(parseFloat(clean) * 1_000_000)
  if (clean.includes('k')) return Math.round(parseFloat(clean) * 1_000)
  const num = parseFloat(clean)
  return isNaN(num) ? null : num
}

// Recalculate server_start_date from current server day
function calcServerStartDate(serverDay: number): string {
  const d = new Date()
  d.setDate(d.getDate() - (serverDay - 1))
  return d.toISOString().split('T')[0]
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function ProfileEditPage() {
  const router = useRouter()
  const [form, setForm] = useState<ProfileForm>({
    commander_name: '',
    server_number: '',
    server_day: '',
    hq_level: '',
    spend_style: '',
    playstyle: '',
    troop_type: '',
    troop_tier: '',
    server_rank: '',
    hero_power: '',
    total_power: '',
    goals: [],
    update_reminder_frequency: 'weekly',
  })
  const [originalName, setOriginalName] = useState('')
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null)
  const [nameChecking, setNameChecking] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  // Name availability check
  useEffect(() => {
    if (!form.commander_name || form.commander_name === originalName) {
      setNameAvailable(null)
      return
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.commander_name)) {
      setNameAvailable(null)
      return
    }
    const timer = setTimeout(async () => {
      setNameChecking(true)
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('commander_name', form.commander_name)
        .maybeSingle()
      setNameAvailable(!data)
      setNameChecking(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [form.commander_name, originalName])

  async function loadProfile() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/signin'); return }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) throw error

      const hp = data.hero_power ? `${(data.hero_power / 1_000_000).toFixed(1)}M` : ''
      const tp = data.total_power ? `${(data.total_power / 1_000_000).toFixed(1)}M` : ''

      setForm({
        commander_name: data.commander_name || '',
        server_number:  data.server_number?.toString() || '',
        server_day:     data.server_day?.toString() || '',
        hq_level:       data.hq_level?.toString() || '',
        spend_style:    data.spend_style || '',
        playstyle:      data.playstyle || '',
        troop_type:     data.troop_type || '',
        troop_tier:     data.troop_tier || '',
        server_rank:    data.server_rank?.toString() || '',
        hero_power:     hp,
        total_power:    tp,
        goals:          data.goals || [],
        update_reminder_frequency: data.update_reminder_frequency || 'weekly',
      })
      setOriginalName(data.commander_name || '')
    } catch {
      setErrorMsg('Failed to load profile.')
    } finally {
      setLoading(false)
    }
  }

  function set(field: keyof ProfileForm, value: string | string[]) {
    setForm(prev => ({ ...prev, [field]: value }))
    setSaveStatus('idle')
  }

  function toggleGoal(goal: string) {
    setForm(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }))
    setSaveStatus('idle')
  }

  async function handleSave() {
    setErrorMsg('')

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.commander_name)) {
      setErrorMsg('Commander tag must be 3–20 characters: letters, numbers, underscores only.')
      return
    }
    if (form.commander_name !== originalName && nameAvailable === false) {
      setErrorMsg('That Commander tag is already taken.')
      return
    }

    setSaveStatus('saving')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/signin'); return }

      const serverDay = form.server_day ? parseInt(form.server_day) : null

      const updates: Record<string, unknown> = {
        commander_name:  form.commander_name,
        server_number:   form.server_number ? parseInt(form.server_number) : null,
        server_day:      serverDay,
        hq_level:        form.hq_level ? parseInt(form.hq_level) : null,
        spend_style:     form.spend_style || null,
        playstyle:       form.playstyle || null,
        troop_type:      form.troop_type || null,
        troop_tier:      form.troop_tier || null,
        server_rank:     form.server_rank ? parseInt(form.server_rank) : null,
        hero_power:      parsePowerToNumber(form.hero_power),
        total_power:     parsePowerToNumber(form.total_power),
        goals:           form.goals,
        update_reminder_frequency: form.update_reminder_frequency,
        // Recalculate server_start_date whenever server day is saved
        server_start_date: serverDay ? calcServerStartDate(serverDay) : null,
        // Stamp last_profile_update — resets the staleness banner timer
        last_profile_update: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id)

      if (error) throw error

      setOriginalName(form.commander_name)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save. Try again.')
      setSaveStatus('error')
    }
  }

  const availableGoals = getGoalsForTier(form.troop_tier)
  const nameChanged = form.commander_name !== originalName
  const nameValid = /^[a-zA-Z0-9_]{3,20}$/.test(form.commander_name)

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm font-mono">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/95 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Dashboard
          </button>
          <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase">Edit Profile</span>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`
              text-xs font-bold px-3 py-1.5 rounded-md transition-all duration-150
              ${saveStatus === 'saved'
                ? 'bg-green-700 text-green-100'
                : saveStatus === 'saving'
                ? 'bg-zinc-700 text-zinc-400 cursor-wait'
                : 'bg-amber-500 hover:bg-amber-400 text-black active:scale-95'}
            `}
          >
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8 pb-20">

        {/* Error */}
        {errorMsg && (
          <div className="bg-red-950/50 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-400">
            {errorMsg}
          </div>
        )}

        {/* ── SECTION: Identity ── */}
        <section className="space-y-4">
          <SectionHeader label="Identity" />

          {/* Commander Tag */}
          <Field label="Commander Tag" hint="3–20 chars · letters, numbers, underscores">
            <div className="relative">
              <input
                type="text"
                value={form.commander_name}
                onChange={e => set('commander_name', e.target.value)}
                maxLength={20}
                placeholder="YourTag"
                className="input-base pr-8"
              />
              {nameChanged && nameValid && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono">
                  {nameChecking
                    ? <span className="text-zinc-500">...</span>
                    : nameAvailable === true
                    ? <span className="text-green-400">✓</span>
                    : nameAvailable === false
                    ? <span className="text-red-400">✗</span>
                    : null}
                </div>
              )}
            </div>
          </Field>

          {/* Server + Day */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Server Number">
              <input
                type="number"
                value={form.server_number}
                onChange={e => set('server_number', e.target.value)}
                placeholder="e.g. 1032"
                className="input-base"
              />
            </Field>
            <Field label="Server Day" hint="Tap VIP emblem to find">
              <input
                type="number"
                value={form.server_day}
                onChange={e => set('server_day', e.target.value)}
                placeholder="e.g. 502"
                className="input-base"
              />
            </Field>
          </div>

          {/* Update reminder frequency */}
          <Field label="Profile update reminders" hint="Keeps Buddy accurate as you level up">
            <div className="grid grid-cols-3 gap-2">
              {REMINDER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => set('update_reminder_frequency', opt.value)}
                  className={`
                    text-left px-3 py-2.5 rounded-lg border transition-all
                    ${form.update_reminder_frequency === opt.value
                      ? 'border-amber-500 bg-amber-950/40'
                      : 'border-zinc-700 hover:border-zinc-500'}
                  `}
                >
                  <div className="text-sm font-semibold text-zinc-100">{opt.label}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{opt.sub}</div>
                </button>
              ))}
            </div>
          </Field>
        </section>

        {/* ── SECTION: Base ── */}
        <section className="space-y-4">
          <SectionHeader label="Base" />

          <Field label="HQ Level">
            <input
              type="number"
              value={form.hq_level}
              onChange={e => set('hq_level', e.target.value)}
              placeholder="e.g. 35"
              min={1} max={40}
              className="input-base mb-2"
            />
            <div className="flex flex-wrap gap-2">
              {HQ_SHORTCUTS.map(n => (
                <button
                  key={n}
                  onClick={() => set('hq_level', n.toString())}
                  className={`
                    text-xs px-2.5 py-1 rounded-md border font-mono transition-all
                    ${form.hq_level === n.toString()
                      ? 'bg-amber-500 border-amber-500 text-black font-bold'
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'}
                  `}
                >
                  {n}
                </button>
              ))}
            </div>
          </Field>
        </section>

        {/* ── SECTION: Playstyle ── */}
        <section className="space-y-4">
          <SectionHeader label="Playstyle" />

          <Field label="Spend Style">
            <div className="flex flex-wrap gap-2">
              {SPEND_OPTIONS.map(opt => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={form.spend_style === opt}
                  onClick={() => set('spend_style', opt)}
                />
              ))}
            </div>
          </Field>

          <Field label="Playstyle">
            <div className="grid grid-cols-2 gap-2">
              {PLAYSTYLE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => set('playstyle', opt.value)}
                  className={`
                    text-left px-3 py-2.5 rounded-lg border transition-all
                    ${form.playstyle === opt.value
                      ? 'border-amber-500 bg-amber-950/40'
                      : 'border-zinc-700 hover:border-zinc-500'}
                  `}
                >
                  <div className="text-sm font-semibold text-zinc-100">{opt.label}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{opt.sub}</div>
                </button>
              ))}
            </div>
          </Field>
        </section>

        {/* ── SECTION: Troops ── */}
        <section className="space-y-4">
          <SectionHeader label="Troops" />

          <Field label="Troop Type">
            <div className="flex flex-wrap gap-2">
              {TROOP_TYPES.map(opt => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={form.troop_type === opt}
                  onClick={() => set('troop_type', opt)}
                />
              ))}
            </div>
          </Field>

          <Field label="Troop Tier">
            <div className="flex flex-wrap gap-2">
              {TROOP_TIERS.map(opt => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={form.troop_tier === opt}
                  onClick={() => set('troop_tier', opt)}
                />
              ))}
            </div>
          </Field>
        </section>

        {/* ── SECTION: Power ── */}
        <section className="space-y-4">
          <SectionHeader label="Power Stats" />

          <Field label="Server Rank" hint="Rankings → Total Hero Power">
            <input
              type="number"
              value={form.server_rank}
              onChange={e => set('server_rank', e.target.value)}
              placeholder="e.g. 16"
              className="input-base"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Hero Power" hint="e.g. 178.5M">
              <input
                type="text"
                value={form.hero_power}
                onChange={e => set('hero_power', e.target.value)}
                onBlur={e => set('hero_power', formatPowerInput(e.target.value))}
                placeholder="e.g. 178.5M"
                className="input-base"
              />
            </Field>
            <Field label="Total Power" hint="Optional">
              <input
                type="text"
                value={form.total_power}
                onChange={e => set('total_power', e.target.value)}
                onBlur={e => set('total_power', formatPowerInput(e.target.value))}
                placeholder="e.g. 220M"
                className="input-base"
              />
            </Field>
          </div>
        </section>

        {/* ── SECTION: Goals ── */}
        <section className="space-y-4">
          <SectionHeader label="Goals" />
          <Field label="Select all that apply">
            <div className="flex flex-wrap gap-2">
              {availableGoals.map(goal => (
                <Chip
                  key={goal}
                  label={goal}
                  selected={form.goals.includes(goal)}
                  onClick={() => toggleGoal(goal)}
                />
              ))}
            </div>
          </Field>
        </section>

        {/* Save button (bottom) */}
        <div className="pt-2">
          {errorMsg && (
            <p className="text-red-400 text-sm mb-3">{errorMsg}</p>
          )}
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`
              w-full py-3 rounded-xl font-bold text-sm transition-all duration-150 active:scale-[0.98]
              ${saveStatus === 'saved'
                ? 'bg-green-700 text-green-100'
                : saveStatus === 'saving'
                ? 'bg-zinc-700 text-zinc-400 cursor-wait'
                : 'bg-amber-500 hover:bg-amber-400 text-black'}
            `}
          >
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Profile Saved' : 'Save Changes'}
          </button>
        </div>

      </main>

      <style jsx global>{`
        .input-base {
          width: 100%;
          background: #18181b;
          border: 1px solid #3f3f46;
          border-radius: 8px;
          color: #f4f4f5;
          font-size: 14px;
          padding: 10px 14px;
          outline: none;
          transition: border-color 0.15s;
          font-family: inherit;
        }
        .input-base:focus {
          border-color: #f59e0b;
        }
        .input-base::placeholder {
          color: #52525b;
        }
        .input-base[type=number]::-webkit-inner-spin-button,
        .input-base[type=number]::-webkit-outer-spin-button {
          opacity: 0.3;
        }
      `}</style>
    </div>
  )
}

// ── Sub-components ──

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-zinc-800" />
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-xs font-semibold text-zinc-300">{label}</label>
        {hint && <span className="text-[10px] text-zinc-600 font-mono">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        text-xs px-3 py-1.5 rounded-full border transition-all duration-150 font-medium
        ${selected
          ? 'bg-amber-500 border-amber-500 text-black'
          : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'}
      `}
    >
      {label}
    </button>
  )
}
