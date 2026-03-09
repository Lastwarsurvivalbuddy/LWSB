'use client'

// src/components/CommanderCard.tsx
// Shareable Commander Card — modal with download, toggleable fields
// Dark tactical aesthetic — black background, gold accents
// Last updated: March 9, 2026

import { useRef, useState, useCallback, type ReactElement } from 'react'
import type { SquadPowerTier, RankBucket, KillTier } from '@/lib/profileTypes'
import {
  SQUAD_POWER_TIER_LABELS,
  RANK_BUCKET_LABELS,
  KILL_TIER_TITLES,
} from '@/lib/profileTypes'

// ─── Kill Tier Insignia (SVG) ─────────────────────────────────────────────────

function KillInsignia({ tier, size = 64 }: { tier: KillTier; size?: number }) {
  const gold = '#C9A84C'
  const goldLight = '#F0D080'
  const goldDark = '#8B6914'
  const silver = '#A8A8B0'

  const insignias: Record<KillTier, ReactElement> = {
    under_500k: (
      // Single chevron
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <polyline points="12,38 32,22 52,38" stroke={silver} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    '500k': (
      // Double chevron
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <polyline points="12,42 32,26 52,42" stroke={silver} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <polyline points="12,32 32,16 52,32" stroke={silver} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    '1m': (
      // Skull + single bar
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="26" r="13" fill={gold} opacity="0.15" stroke={gold} strokeWidth="1.5"/>
        <ellipse cx="32" cy="24" rx="9" ry="10" fill={gold} opacity="0.9"/>
        <rect x="26" y="33" width="12" height="5" rx="1" fill={gold} opacity="0.9"/>
        <circle cx="28" cy="23" r="2.5" fill="#000" opacity="0.7"/>
        <circle cx="36" cy="23" r="2.5" fill="#000" opacity="0.7"/>
        <path d="M29 29 L31 27 L33 29" fill="#000" opacity="0.5"/>
        <rect x="16" y="46" width="32" height="4" rx="2" fill={gold}/>
      </svg>
    ),
    '2m': (
      // Skull + double bar
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="24" r="13" fill={gold} opacity="0.15" stroke={gold} strokeWidth="1.5"/>
        <ellipse cx="32" cy="22" rx="9" ry="10" fill={gold} opacity="0.9"/>
        <rect x="26" y="31" width="12" height="5" rx="1" fill={gold} opacity="0.9"/>
        <circle cx="28" cy="21" r="2.5" fill="#000" opacity="0.7"/>
        <circle cx="36" cy="21" r="2.5" fill="#000" opacity="0.7"/>
        <path d="M29 27 L31 25 L33 27" fill="#000" opacity="0.5"/>
        <rect x="16" y="43" width="32" height="3.5" rx="1.5" fill={gold}/>
        <rect x="16" y="49" width="32" height="3.5" rx="1.5" fill={gold}/>
      </svg>
    ),
    '3m': (
      // Crossed swords
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <line x1="14" y1="14" x2="50" y2="50" stroke={gold} strokeWidth="4" strokeLinecap="round"/>
        <line x1="50" y1="14" x2="14" y2="50" stroke={gold} strokeWidth="4" strokeLinecap="round"/>
        <rect x="10" y="10" width="8" height="3" rx="1.5" fill={gold} transform="rotate(45 14 11.5)"/>
        <rect x="46" y="10" width="8" height="3" rx="1.5" fill={gold} transform="rotate(-45 50 11.5)"/>
        <circle cx="32" cy="32" r="4" fill={gold} opacity="0.3" stroke={gold} strokeWidth="1.5"/>
        <circle cx="32" cy="32" r="2" fill={gold}/>
      </svg>
    ),
    '5m': (
      // Eagle
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <path d="M32 8 L20 28 L8 24 L20 36 L16 52 L32 42 L48 52 L44 36 L56 24 L44 28 Z" fill={gold} opacity="0.85" stroke={gold} strokeWidth="1"/>
        <circle cx="32" cy="30" r="5" fill="#000" opacity="0.4"/>
        <circle cx="32" cy="30" r="3" fill={goldLight} opacity="0.9"/>
      </svg>
    ),
    '10m': (
      // Gold eagle
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <path d="M32 6 L18 26 L4 22 L18 36 L14 54 L32 43 L50 54 L46 36 L60 22 L46 26 Z" fill={gold} stroke={goldLight} strokeWidth="1.5"/>
        <circle cx="32" cy="28" r="6" fill={goldDark} stroke={goldLight} strokeWidth="1"/>
        <circle cx="32" cy="28" r="3" fill={goldLight}/>
        <path d="M26 44 L32 40 L38 44" fill={goldLight} opacity="0.6"/>
      </svg>
    ),
    '15m': (
      // Gold eagle + bar
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <path d="M32 5 L19 23 L5 19 L19 33 L15 50 L32 40 L49 50 L45 33 L59 19 L45 23 Z" fill={gold} stroke={goldLight} strokeWidth="1.5"/>
        <circle cx="32" cy="26" r="5" fill={goldDark} stroke={goldLight} strokeWidth="1"/>
        <circle cx="32" cy="26" r="2.5" fill={goldLight}/>
        <rect x="14" y="53" width="36" height="4" rx="2" fill={goldLight}/>
      </svg>
    ),
    '20m': (
      // Gold eagle + double bar
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <path d="M32 4 L20 21 L6 17 L20 30 L16 47 L32 38 L48 47 L44 30 L58 17 L44 21 Z" fill={gold} stroke={goldLight} strokeWidth="1.5"/>
        <circle cx="32" cy="24" r="5" fill={goldDark} stroke={goldLight} strokeWidth="1"/>
        <circle cx="32" cy="24" r="2.5" fill={goldLight}/>
        <rect x="14" y="50" width="36" height="3.5" rx="1.5" fill={goldLight}/>
        <rect x="14" y="56" width="36" height="3.5" rx="1.5" fill={goldLight}/>
      </svg>
    ),
    '25m': (
      // Gold skull + crown
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <path d="M16 20 L16 10 L22 16 L32 8 L42 16 L48 10 L48 20" stroke={goldLight} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <ellipse cx="32" cy="34" rx="12" ry="13" fill={gold} stroke={goldLight} strokeWidth="1.5"/>
        <rect x="24" y="44" width="16" height="6" rx="1" fill={gold} stroke={goldLight} strokeWidth="1"/>
        <circle cx="27" cy="32" r="3" fill="#000" opacity="0.6"/>
        <circle cx="37" cy="32" r="3" fill="#000" opacity="0.6"/>
        <path d="M28 40 L30 37 L32 39 L34 37 L36 40" fill="#000" opacity="0.4"/>
      </svg>
    ),
    '50m': (
      // Gold skull + crown + wings
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <path d="M4 34 C4 34 8 24 14 28 C14 28 16 20 20 24" stroke={goldLight} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M60 34 C60 34 56 24 50 28 C50 28 48 20 44 24" stroke={goldLight} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M18 16 L18 8 L23 13 L32 6 L41 13 L46 8 L46 16" stroke={goldLight} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <ellipse cx="32" cy="32" rx="10" ry="11" fill={gold} stroke={goldLight} strokeWidth="1.5"/>
        <rect x="25" y="41" width="14" height="5" rx="1" fill={gold} stroke={goldLight} strokeWidth="1"/>
        <circle cx="28" cy="30" r="2.5" fill="#000" opacity="0.6"/>
        <circle cx="36" cy="30" r="2.5" fill="#000" opacity="0.6"/>
      </svg>
    ),
    '100m_plus': (
      // LW Dominator — full insignia gold everything
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <polygon points="32,2 38,22 58,22 43,34 49,54 32,42 15,54 21,34 6,22 26,22" fill={gold} stroke={goldLight} strokeWidth="1.5"/>
        <path d="M10 56 L54 56" stroke={goldLight} strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M14 61 L50 61" stroke={goldLight} strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="32" cy="30" rx="7" ry="8" fill={goldDark} stroke={goldLight} strokeWidth="1"/>
        <circle cx="29" cy="29" r="2" fill="#000" opacity="0.7"/>
        <circle cx="35" cy="29" r="2" fill="#000" opacity="0.7"/>
        <path d="M28 35 L30 33 L32 35 L34 33 L36 35" fill="#000" opacity="0.5"/>
        <circle cx="32" cy="30" r="1" fill={goldLight} opacity="0.5"/>
      </svg>
    ),
  }

  return insignias[tier] ?? null
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CommanderCardProfile {
  commander_name: string
  server_number?: number
  server_day?: number
  hq_level?: number
  squad_power_tier?: SquadPowerTier
  rank_bucket?: RankBucket
  kill_tier?: KillTier
  troop_type?: string
  alliance_name?: string
  alliance_tag?: string
  season?: number
}

interface ToggleState {
  showServer: boolean
  showHQ: boolean
  showSquadPower: boolean
  showRank: boolean
  showKillTier: boolean
  showAlliance: boolean
  showTroopType: boolean
}

interface CommanderCardProps {
  profile: CommanderCardProfile
  onClose: () => void
}

// ─── Troop type icon ──────────────────────────────────────────────────────────

function troopIcon(type?: string): string {
  switch (type?.toLowerCase()) {
    case 'aircraft':         return '✈️'
    case 'tank':             return '🪖'
    case 'missile vehicle':  return '🚀'
    case 'mixed':            return '⚔️'
    default:                 return '🪖'
  }
}

// ─── The Card itself (rendered to canvas for download) ───────────────────────

function CardFace({
  profile,
  toggles,
  cardRef,
}: {
  profile: CommanderCardProfile
  toggles: ToggleState
  cardRef: React.RefObject<HTMLDivElement | null>
}) {
  const killLabel = profile.kill_tier ? KILL_TIER_TITLES[profile.kill_tier] : null
  const powerLabel = profile.squad_power_tier ? SQUAD_POWER_TIER_LABELS[profile.squad_power_tier] : null
  const rankLabel = profile.rank_bucket ? RANK_BUCKET_LABELS[profile.rank_bucket] : null

  return (
    <div
      ref={cardRef}
      style={{
        width: '400px',
        minHeight: '520px',
        background: 'linear-gradient(160deg, #0a0a0a 0%, #111108 40%, #0d0d0a 100%)',
        border: '1px solid #2a2410',
        borderRadius: '12px',
        padding: '32px 28px 24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        boxShadow: '0 0 60px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.15)',
      }}
    >
      {/* Corner decorations */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', borderTop: '2px solid #C9A84C', borderLeft: '2px solid #C9A84C', borderRadius: '12px 0 0 0', opacity: 0.6 }}/>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', borderTop: '2px solid #C9A84C', borderRight: '2px solid #C9A84C', borderRadius: '0 12px 0 0', opacity: 0.6 }}/>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '40px', borderBottom: '2px solid #C9A84C', borderLeft: '2px solid #C9A84C', borderRadius: '0 0 0 12px', opacity: 0.6 }}/>
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px', borderBottom: '2px solid #C9A84C', borderRight: '2px solid #C9A84C', borderRadius: '0 0 12px 0', opacity: 0.6 }}/>

      {/* Background hex pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: `repeating-linear-gradient(60deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)`,
        backgroundSize: '20px 20px',
      }}/>

      {/* Header — LAST WAR */}
      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        <div style={{
          fontSize: '10px', letterSpacing: '6px', color: '#C9A84C',
          textTransform: 'uppercase', opacity: 0.7, fontFamily: 'Georgia, serif',
        }}>
          LAST WAR: SURVIVAL
        </div>
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #C9A84C44)' }}/>
        <div style={{ width: '6px', height: '6px', background: '#C9A84C', transform: 'rotate(45deg)', opacity: 0.7 }}/>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #C9A84C44)' }}/>
      </div>

      {/* Kill Tier Badge — center stage */}
      {profile.kill_tier && toggles.showKillTier && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{
            width: '88px', height: '88px',
            background: 'radial-gradient(circle, #1a1500 0%, #0a0a00 70%)',
            border: '1px solid #C9A84C44',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(201,168,76,0.15)',
            marginBottom: '8px',
          }}>
            <KillInsignia tier={profile.kill_tier} size={56} />
          </div>
          <div style={{
            fontSize: '13px', letterSpacing: '3px', color: '#C9A84C',
            textTransform: 'uppercase', fontWeight: 'bold',
          }}>
            {killLabel}
          </div>
        </div>
      )}

      {/* Commander name */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          fontSize: '26px', color: '#F0D080', fontWeight: 'bold',
          letterSpacing: '1px', textShadow: '0 0 20px rgba(240,208,128,0.3)',
          fontFamily: 'Georgia, serif',
        }}>
          {profile.commander_name}
        </div>
        <div style={{ fontSize: '11px', color: '#666', letterSpacing: '2px', marginTop: '2px' }}>
          COMMANDER
        </div>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '8px', marginBottom: '16px',
      }}>
        {toggles.showServer && profile.server_number && (
          <StatBox label="Server" value={`#${profile.server_number}`} sub={profile.server_day ? `Day ${profile.server_day}` : undefined} />
        )}
        {toggles.showHQ && profile.hq_level && (
          <StatBox label="HQ Level" value={`${profile.hq_level}`} />
        )}
        {toggles.showSquadPower && powerLabel && (
          <StatBox label="Squad 1 Power" value={powerLabel} />
        )}
        {toggles.showRank && rankLabel && (
          <StatBox label="Server Rank" value={rankLabel} />
        )}
        {toggles.showTroopType && profile.troop_type && (
          <StatBox label="Troop Type" value={`${troopIcon(profile.troop_type)} ${profile.troop_type}`} />
        )}
        {toggles.showAlliance && (profile.alliance_tag || profile.alliance_name) && (
          <StatBox label="Alliance" value={profile.alliance_tag ? `[${profile.alliance_tag}]` : profile.alliance_name!} />
        )}
      </div>

      {/* Bottom divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #C9A84C33)' }}/>
        <div style={{ width: '4px', height: '4px', background: '#C9A84C', transform: 'rotate(45deg)', opacity: 0.5 }}/>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #C9A84C33)' }}/>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '1px', opacity: 0.8 }}>
          LastWarSurvivalBuddy.com
        </div>
        <div style={{ fontSize: '9px', color: '#444', marginTop: '4px', fontStyle: 'italic' }}>
          Stats are self-reported — keep your profile current for accuracy
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{
      background: 'rgba(201,168,76,0.04)',
      border: '1px solid rgba(201,168,76,0.12)',
      borderRadius: '6px',
      padding: '10px 12px',
    }}>
      <div style={{ fontSize: '9px', color: '#666', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '13px', color: '#E8D060', fontWeight: 'bold' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>{sub}</div>}
    </div>
  )
}

// ─── Main Modal Component ─────────────────────────────────────────────────────

export default function CommanderCard({ profile, onClose }: CommanderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)

  const [toggles, setToggles] = useState<ToggleState>({
    showServer:     true,
    showHQ:         true,
    showSquadPower: true,
    showRank:       true,
    showKillTier:   true,
    showAlliance:   !!(profile.alliance_tag || profile.alliance_name),
    showTroopType:  true,
  })

  const toggle = (key: keyof ToggleState) =>
    setToggles(prev => ({ ...prev, [key]: !prev[key] }))

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        background: undefined,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `commander-${profile.commander_name}-card.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(false)
    }
  }, [profile.commander_name])

  const toggleConfigs: Array<{ key: keyof ToggleState; label: string }> = [
    { key: 'showKillTier',   label: 'Kill Badge' },
    { key: 'showServer',     label: 'Server / Day' },
    { key: 'showHQ',         label: 'HQ Level' },
    { key: 'showSquadPower', label: 'Squad Power' },
    { key: 'showRank',       label: 'Server Rank' },
    { key: 'showTroopType',  label: 'Troop Type' },
    { key: 'showAlliance',   label: 'Alliance' },
  ]

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
        maxHeight: '90vh', overflowY: 'auto',
      }}>

        {/* Card preview */}
        <CardFace profile={profile} toggles={toggles} cardRef={cardRef} />

        {/* Toggle controls */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '8px',
          justifyContent: 'center', maxWidth: '400px',
        }}>
          {toggleConfigs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              style={{
                padding: '6px 12px',
                background: toggles[key] ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${toggles[key] ? '#C9A84C' : '#333'}`,
                borderRadius: '20px',
                color: toggles[key] ? '#C9A84C' : '#555',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {toggles[key] ? '✓ ' : ''}{label}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{
              padding: '12px 28px',
              background: downloading ? '#333' : 'linear-gradient(135deg, #C9A84C, #8B6914)',
              border: 'none', borderRadius: '8px',
              color: downloading ? '#666' : '#000',
              fontSize: '14px', fontWeight: 'bold',
              cursor: downloading ? 'not-allowed' : 'pointer',
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '0.5px',
            }}
          >
            {downloading ? 'Saving...' : '⬇ Download Card'}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: '1px solid #333', borderRadius: '8px',
              color: '#666', fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Close
          </button>
        </div>

        <div style={{ fontSize: '11px', color: '#444', fontFamily: 'system-ui, sans-serif' }}>
          Tap outside to close
        </div>
      </div>
    </div>
  )
}
