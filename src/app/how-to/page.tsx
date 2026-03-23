'use client';

import { useRouter } from 'next/navigation';

const features = [
  {
    id: 'buddy-ai',
    number: '01',
    name: 'Buddy AI',
    tagline: 'Your personal Last War strategist',
    icon: '🤖',
    color: '#4ade80',
    description:
      'Ask Buddy anything about Last War and get answers tailored to your exact profile — your HQ level, server day, troop type, spend tier, and goals. Buddy knows your game, not some random player\'s.',
    steps: [
      'Tap the Buddy AI tab from the dashboard.',
      'Use the prompt chips for quick common questions, or type your own.',
      'Ask about build order, troop counters, pack value, event strategy — anything.',
      'Buddy responds using your profile data. No generic answers.',
    ],
    tip: 'The more complete your profile, the sharper Buddy\'s advice. Keep it updated.',
    quota: 'Free: 5/day · Pro: 30/day · Elite: 100/day · Founding: Unlimited',
  },
  {
    id: 'todays-orders',
    number: '02',
    name: "Today's Orders",
    tagline: 'Your daily mission briefing',
    icon: '📋',
    color: '#facc15',
    description:
      "Today's Orders generates a prioritized checklist of the highest-leverage actions available to you right now — based on your server day, Alliance Duel day, HQ level, and playstyle.",
    steps: [
      "Find Today's Orders at the top of your dashboard — it's the first thing you see.",
      'Check off tasks as you complete them. Progress saves automatically.',
      'Actions are ranked: Critical → High → Medium. Start at the top.',
      'The list refreshes every Alliance Duel cycle.',
    ],
    tip: 'On Day 1 and Day 5, Critical actions are time-gated. Do them early.',
    quota: 'Available to all users.',
  },
  {
    id: 'watch-out',
    number: '03',
    name: 'Watch Out Strip',
    tagline: 'The one thing not to miss today',
    icon: '⚠️',
    color: '#fb923c',
    description:
      'A single, laser-focused alert displayed directly below Today\'s Orders. Every Alliance Duel day has one high-stakes mechanic that catches players off guard. Watch Out calls it out before it bites you.',
    steps: [
      'Glance at the orange strip below Today\'s Orders.',
      'Read the alert for today\'s Alliance Duel day.',
      'Act on it — these are time-sensitive or easy-to-miss.',
    ],
    tip: 'Day 4 is Ghost Ops (Thursdays only). Rewards expire if not manually claimed.',
    quota: 'Available to all users. No quota.',
  },
  {
    id: 'battle-report',
    number: '04',
    name: 'Battle Report Analyzer',
    tagline: 'Find out exactly why you won or lost',
    icon: '⚔️',
    color: '#f87171',
    description:
      'Upload your battle report screenshots. Buddy analyzes both sides — your setup and your opponent\'s — and delivers a plain-English breakdown: what happened, why, and how to win the rematch.',
    steps: [
      'Tap Battle Report from the dashboard.',
      'Upload your battle report screenshot(s). Multi-image supported.',
      'Enter basic intake info: outcome, troop type, context.',
      'Buddy analyzes the fight and returns a full verdict with rematch strategy.',
      'Save or share the report card.',
    ],
    tip: 'Include the opponent\'s profile screenshot if you have it — Buddy\'s analysis gets significantly sharper.',
    quota: 'Free: Locked · Pro: 3/day · Elite: 5/day · Founding: Unlimited',
  },
  {
    id: 'pack-scanner',
    number: '05',
    name: 'Pack Scanner',
    tagline: 'Know if a pack is worth buying before you tap',
    icon: '📦',
    color: '#818cf8',
    description:
      'Upload a screenshot of any in-game pack offer. Buddy evaluates the contents against your current needs and spend tier, then delivers a clear verdict: Buy, Skip, or Situational — with reasoning.',
    steps: [
      'Tap Pack Scanner from the dashboard.',
      'Upload a screenshot of the pack offer.',
      'Buddy identifies the contents and evaluates value for your profile.',
      'Get a verdict: Buy / Skip / Situational.',
    ],
    tip: 'Unknown packs return an honest "unrecognized" verdict — Buddy won\'t guess. Tap "Teach Buddy" to submit it.',
    quota: 'Free: Locked · Pro/Elite/Founding: Shared with Buddy AI daily quota',
  },
  {
    id: 'war-room',
    number: '06',
    name: 'War Room',
    tagline: 'Battle planning for DS, WZ, and Canyon Storm',
    icon: '🗺️',
    color: '#22d3ee',
    description:
      'Pre-battle intelligence and planning tools for Desert Storm, Warzone Duel, and Canyon Storm. Each tool gives you the key mechanics, structure priorities, and tactical callouts for your role.',
    steps: [
      'Tap War Room from the dashboard.',
      'Select your battle type: Desert Storm · Warzone Duel · Canyon Storm.',
      'Review the tactical breakdown and priority targets.',
      'Export the plan card and share it with your alliance leader.',
    ],
    tip: 'Canyon Storm: The Virus Lab opens at exactly 12 minutes. Set a timer.',
    quota: 'Free to all users. No gate, no quota. Share the card — it\'s branded.',
  },
  {
    id: 'commander-card',
    number: '07',
    name: 'Commander Card',
    tagline: 'Your shareable player identity card',
    icon: '🪪',
    color: '#a78bfa',
    description:
      'Generate a shareable Commander Card that displays your stats, squad power, rank, and troop type. Built for posting in Discord, alliance chat, or anywhere you want to flex.',
    steps: [
      'Tap Commander Card from the dashboard.',
      'Your card generates automatically from your profile.',
      'Tap Export to save as an image.',
      'Share it anywhere.',
    ],
    tip: 'Keep your profile updated — your card reflects your current stats.',
    quota: 'Available to all users.',
  },
  {
    id: 'teach-buddy',
    number: '08',
    name: 'TeachBuddy',
    tagline: 'You teach. Everyone benefits.',
    icon: '🧠',
    color: '#34d399',
    description:
      "Found something Buddy doesn't know? Submit it. Every submission goes into the moderation queue. When approved, it sharpens Buddy's knowledge for every player on the platform.",
    steps: [
      'Spot something Buddy got wrong or doesn\'t know.',
      'Tap TeachBuddy and submit the correction or new intel.',
      'Buddy Commander reviews and approves.',
      'Approved submissions improve Buddy for all users.',
    ],
    tip: 'The best intel comes from endgame players. If you\'re HQ 30+, your submissions carry.',
    quota: 'Available to all users. Submissions are unlimited.',
  },
];

export default function HowToPage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0c10',
      color: '#e2e8f0',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      overflowX: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(74,222,128,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(74,222,128,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Header */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        borderBottom: '1px solid rgba(74,222,128,0.15)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'none',
            border: '1px solid rgba(74,222,128,0.2)',
            color: '#4ade80',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: '0.02em',
          }}
        >
          ← Dashboard
        </button>
        <div style={{
          fontSize: '11px',
          color: 'rgba(74,222,128,0.5)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>
          Field Manual
        </div>
      </div>

      {/* Hero */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '900px',
        margin: '0 auto',
        padding: '56px 24px 40px',
      }}>
        <div style={{
          display: 'inline-block',
          fontSize: '11px',
          color: '#4ade80',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: 700,
          marginBottom: '16px',
          padding: '4px 10px',
          border: '1px solid rgba(74,222,128,0.3)',
          borderRadius: '4px',
          backgroundColor: 'rgba(74,222,128,0.05)',
        }}>
          Last War: Survival Buddy
        </div>

        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 800,
          lineHeight: 1.1,
          margin: '0 0 16px',
          letterSpacing: '-0.02em',
        }}>
          How to Use<br />
          <span style={{ color: '#4ade80' }}>Survival Buddy</span>
        </h1>

        <p style={{
          fontSize: '16px',
          color: 'rgba(226,232,240,0.6)',
          maxWidth: '560px',
          lineHeight: 1.6,
          margin: 0,
        }}>
          Eight features. One goal: tell you exactly what to do, right now, for your game.
          Here's how each one works.
        </p>
      </div>

      {/* Quick nav */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '900px',
        margin: '0 auto 48px',
        padding: '0 24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        {features.map(f => (
          <a
            key={f.id}
            href={`#${f.id}`}
            style={{
              fontSize: '12px',
              color: f.color,
              padding: '5px 12px',
              borderRadius: '20px',
              border: `1px solid ${f.color}30`,
              backgroundColor: `${f.color}08`,
              textDecoration: 'none',
              letterSpacing: '0.03em',
              fontWeight: 500,
              transition: 'background-color 0.15s',
            }}
          >
            {f.icon} {f.name}
          </a>
        ))}
      </div>

      {/* Feature sections */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 24px 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}>
        {features.map((feature, i) => (
          <div
            key={feature.id}
            id={feature.id}
            style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderLeft: `3px solid ${feature.color}`,
              borderRadius: '8px',
              padding: '32px',
              marginBottom: '16px',
              scrollMarginTop: '24px',
            }}
          >
            {/* Feature header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
              <div style={{
                fontSize: '28px',
                width: '52px',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${feature.color}10`,
                border: `1px solid ${feature.color}25`,
                borderRadius: '10px',
                flexShrink: 0,
              }}>
                {feature.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '11px',
                    color: feature.color,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    opacity: 0.7,
                  }}>
                    {feature.number}
                  </span>
                  <h2 style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#f1f5f9',
                    letterSpacing: '-0.01em',
                  }}>
                    {feature.name}
                  </h2>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  color: feature.color,
                  fontWeight: 500,
                  opacity: 0.8,
                }}>
                  {feature.tagline}
                </p>
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '15px',
              lineHeight: 1.65,
              color: 'rgba(226,232,240,0.75)',
              margin: '0 0 24px',
            }}>
              {feature.description}
            </p>

            {/* Steps */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: '12px',
              }}>
                How to use it
              </div>
              <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {feature.steps.map((step, si) => (
                  <li key={si} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{
                      flexShrink: 0,
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: `${feature.color}15`,
                      border: `1px solid ${feature.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: feature.color,
                      marginTop: '1px',
                    }}>
                      {si + 1}
                    </span>
                    <span style={{ fontSize: '14px', color: 'rgba(226,232,240,0.7)', lineHeight: 1.5 }}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tip + Quota row */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{
                flex: '1 1 280px',
                backgroundColor: `${feature.color}08`,
                border: `1px solid ${feature.color}20`,
                borderRadius: '6px',
                padding: '12px 14px',
                fontSize: '13px',
                color: 'rgba(226,232,240,0.65)',
                lineHeight: 1.5,
              }}>
                <span style={{ color: feature.color, fontWeight: 600 }}>💡 Tip: </span>
                {feature.tip}
              </div>
              <div style={{
                flex: '1 1 220px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '6px',
                padding: '12px 14px',
                fontSize: '12px',
                color: 'rgba(226,232,240,0.4)',
                lineHeight: 1.6,
              }}>
                <span style={{ color: 'rgba(226,232,240,0.5)', fontWeight: 600, display: 'block', marginBottom: '2px', letterSpacing: '0.05em', fontSize: '11px', textTransform: 'uppercase' }}>Quota</span>
                {feature.quota}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 24px 80px',
        textAlign: 'center',
      }}>
        <div style={{
          backgroundColor: 'rgba(74,222,128,0.04)',
          border: '1px solid rgba(74,222,128,0.15)',
          borderRadius: '12px',
          padding: '40px 32px',
        }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>🎖️</div>
          <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#f1f5f9' }}>
            Ready to deploy?
          </h3>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: 'rgba(226,232,240,0.5)', lineHeight: 1.6 }}>
            Your profile is your mission file. The more complete it is,<br />the sharper every Buddy response becomes.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              backgroundColor: '#4ade80',
              color: '#0a0c10',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '7px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.02em',
            }}
          >
            Back to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
