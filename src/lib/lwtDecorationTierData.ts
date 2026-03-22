// src/lib/lwtDecorationTierData.ts
// Decoration Tier List & Upgrade Priority Guide
// Sources: ldshop.gg decoration tier list (Jan 2026), lastwarhandbook.com decoration guide
// Complements lwtGearData.ts (gear costs/star values)
// Updated: March 22, 2026 (session 58) — component sources, cannot-use list, stat values, acquisition added

export interface DecorationEntry {
  name: string;
  notes: string;
  canUseComponents?: boolean;
  maxStats?: string;
}

export interface DecorationTier {
  tier: string;
  statFocus: string;
  priority: string;
  decorations: DecorationEntry[];
  tierNotes?: string;
}

// -----------------------------------------------------------------------
// CORE MECHANICS
// -----------------------------------------------------------------------

export const DECORATION_CORE_MECHANICS = `
DECORATION SYSTEM — CORE MECHANICS:

HOW DECORATIONS WORK:
- Permanent passive bonuses to ALL heroes simultaneously — no activation required
- Apply in every game mode: PvP, PvE, events, world map — always active
- Stack additively with each other and with gear, research, and hero bonuses
- Account-wide — upgrading one decoration benefits every squad you field

LEVEL 3 SPECIAL BONUS (critical mechanic):
- Every UR decoration receives a special bonus at Level 3 that significantly boosts its value
- Levels 1–2: small incremental gains (~0.03 power each)
- Level 3: major jump (~0.1 power) as special bonus activates
- Levels 4–7: continue scaling with additional percentage increases
- STRATEGY: Upgrade ALL UR decorations to Level 3 BEFORE pushing any single decoration to Level 7
  A full roster of Level 3 decorations provides more total power than one maxed decoration

UPGRADE SYSTEM:
- Decorations upgrade using: duplicate copies of the same decoration OR Universal Decor Components (as substitutes)
- The fewer duplicates you have, the more components required:
  · 3 of 4 duplicates needed: ~15 components fill the gap
  · 2 of 4 duplicates: ~30 components
  · 0 duplicates: 60+ components per level
- Components CANNOT be used on restricted decorations — check before spending

DECORATIONS THAT CANNOT USE UNIVERSAL DECOR COMPONENTS (duplicates only):
- God of Judgment
- Libertas (Statue of Liberty)
- Military Monument
- Warriors Monument
- Golden Mobile Squad
- Most SSR decorations
- All SR decorations
⚠️ Always verify before spending components — wasted components cannot be recovered

UNIVERSAL DECOR COMPONENT SOURCES:
- VIP Shop: 50 components/week at 100 diamonds each
- Honor Shop: 150 components/month at 200 honor points each
- Campaign Store: 30 components/week at 200 courage medals each
- Lucky Chests: 60–300 pieces (variable)
- Decorate Your Dreams event: 300 components at 50 spins milestone · 500 components at 200 spins milestone

HOW TO OBTAIN DECORATIONS:
- Legendary Decoration Chest: Honor Shop for 50,000 Honor Points · Limited to 1/month
  Contains: Bell Tower, Eiffel Tower, Ferris Wheel, Gold Bomber, Gold Missile Vehicle, Gold Tank, Neon Sign (~14% each)
- Decorate Your Dreams event (primary source): Use Wish Coins to spin
  · Free 1 spin daily · Every 20th spin = guaranteed pre-selected decoration (pity)
  · Milestone rewards: 5 spins=1 Legendary Chest · 20 spins=1 Decoration Selection Chest · 50 spins=300 components · 200 spins=500 components
  · Wish Coins persist between events — save to guarantee 20-spin pity milestone
- Black Market: Appears during Season Celebrations (post-season phases)
  · Tower of Victory available before Season 2 · Eternal Pyramid before Season 3
- Seasonal events: Halloween (Pumpkin Panic, Jack-O'-Zombie) · Christmas (Colorful Christmas Tree) · Thanksgiving (Happy Turkey) · New Year (Win in 2025/2026)
- Roulette and event shops (season-dependent)
`;

// -----------------------------------------------------------------------
// TIER DATA
// -----------------------------------------------------------------------

export const DECORATION_TIERS: DecorationTier[] = [
  {
    tier: 'S',
    statFocus: 'Damage Reduction',
    priority: 'Max first — upgrade to L4+ after all S+A reach L3',
    tierNotes: 'Damage Reduction is the strongest stat in competitive PvP as of Jan 2026. It scales better than flat HP and directly reduces burst damage impact.',
    decorations: [
      {
        name: 'Win in 2025',
        notes: 'High damage reduction scaling; extremely strong in PvP survivability and rallies.',
        canUseComponents: true,
      },
      {
        name: 'Win in 2026',
        notes: 'Seasonal defensive piece with excellent mitigation value in long fights.',
        canUseComponents: true,
      },
      {
        name: 'Torch Relay',
        notes: 'Consistent damage dampening; strong ROI at Level 3+.',
        canUseComponents: true,
      },
      {
        name: 'Rock the End',
        notes: 'Reliable defensive stat spread; effective in sustained engagements.',
        canUseComponents: true,
      },
      {
        name: 'Joyful Bunny',
        notes: 'Event-based (Easter) decoration with strong defensive ceiling when upgraded. Provides damage reduction + ATK.',
        canUseComponents: true,
      },
    ],
  },
  {
    tier: 'A+',
    statFocus: 'Skill Damage & March Size',
    priority: 'Upgrade to L3 alongside S-Tier in first pass',
    tierNotes: 'Offensive multipliers that significantly increase total damage output. God of Judgment is uniquely valuable — only decoration providing March Size bonus (+10 troops at L3+). Cannot use Universal Decor Components.',
    decorations: [
      {
        name: 'God of Judgment',
        notes: 'THE ONLY decoration that increases March Size (+10 troops). At L3: +55,000 HP · +1,309 ATK · +261 DEF · +10 March Size. At L7: +95,000 HP · +1,309 ATK · +261 DEF · +10 March Size. ⚠️ CANNOT use Universal Decor Components — requires duplicate copies only. High priority if owned but upgrade path is gated by duplicates from special events/packs.',
        canUseComponents: false,
        maxStats: 'L7: +95,000 HP · +1,309 ATK · +261 DEF · +10 March Size',
      },
      {
        name: 'Easter Egg-sassin',
        notes: 'Strong Skill Damage boost; ideal for ability-based hero compositions.',
        canUseComponents: true,
      },
      {
        name: 'Lovely Bears',
        notes: 'Balanced HP + Skill Damage. At L7: +215,000 HP · +2.50% Skill Damage. Best for skill-focused heroes.',
        canUseComponents: true,
        maxStats: 'L7: +215,000 HP · +2.50% Skill Damage',
      },
      {
        name: 'Fabulous Phonograph',
        notes: 'Reliable offensive scaling; boosts sustained DPS with Skill Damage + ATK.',
        canUseComponents: true,
      },
      {
        name: 'Win in 2024',
        notes: 'Stat-efficient seasonal decoration; strong at Level 3.',
        canUseComponents: true,
      },
      {
        name: 'Turkey Swashbuckler',
        notes: 'Offensive stat boost that synergizes with crit builds.',
        canUseComponents: true,
      },
      {
        name: 'Cornucopia',
        notes: 'Skill Damage + ATK. Solid damage amplification; good scaling potential. Harvest seasonal event.',
        canUseComponents: true,
      },
    ],
  },
  {
    tier: 'A',
    statFocus: 'Critical Damage',
    priority: 'Upgrade to L3 in second pass; push higher for crit-focused builds',
    tierNotes: 'Excellent for burst compositions. Crit Damage dramatically increases burst output when paired with sufficient crit rate, but depends on hero synergy — slightly less universally powerful than Damage Reduction.',
    decorations: [
      {
        name: 'Rosy Cabriolet',
        notes: 'Boosts Crit Damage; strong for burst-oriented builds.',
        canUseComponents: true,
      },
      {
        name: 'Golden Marshal',
        notes: 'Reliable crit scaling in PvP encounters. Always available (not limited to event windows).',
        canUseComponents: true,
      },
      {
        name: 'Colorful Christmas Tree',
        notes: '+3% Crit Damage + 3,000 ATK. Seasonal (Christmas). Strong offensive combination.',
        canUseComponents: true,
        maxStats: '+3% Crit Damage · +3,000 ATK',
      },
      {
        name: 'Happy Turkey',
        notes: '+3% Crit Damage + 3,000 ATK. Seasonal (Thanksgiving). Good synergy with high-crit compositions.',
        canUseComponents: true,
        maxStats: '+3% Crit Damage · +3,000 ATK',
      },
      {
        name: "Jack-o' Carriage",
        notes: 'Strong burst enhancement for offensive squads. Halloween seasonal.',
        canUseComponents: true,
      },
      {
        name: 'Cheese Manor',
        notes: '+215,000 HP + 5% Crit Damage at L7. Best choice over Lovely Bears for crit-based damage dealers. Can use Universal Decor Components.',
        canUseComponents: true,
        maxStats: 'L7: +215,000 HP · +5% Crit Damage',
      },
      {
        name: "Jack-o' Zombie",
        notes: 'Effective for crit-focused teams. Halloween seasonal.',
        canUseComponents: true,
      },
      {
        name: 'Tower of Victory',
        notes: 'Highest pure ATK decoration. At L7: +6,500 Hero ATK + 5% Crit Damage — best offensive combination available. Available from Black Market before Season 2.',
        canUseComponents: true,
        maxStats: 'L7: +6,500 ATK · +5% Crit Damage',
      },
      {
        name: 'Year of the Dragon',
        notes: 'Event decoration with competitive crit scaling.',
        canUseComponents: true,
      },
    ],
  },
  {
    tier: 'B',
    statFocus: 'General Hero Stat Boost (Attack, HP, Defense)',
    priority: 'Upgrade after S and A tiers are at L3+',
    tierNotes: 'Provides general stat boosts but lacks the multiplicative scaling of higher tiers.',
    decorations: [
      {
        name: 'Pumpkin Panic',
        notes: 'At L7: +90,000 HP · +2,142 ATK · +428 DEF · +4% Zombie Damage. Multi-stat + PvE bonus. Halloween seasonal.',
        canUseComponents: true,
        maxStats: 'L7: +90,000 HP · +2,142 ATK · +428 DEF · +4% Zombie Damage',
      },
      {
        name: "Warrior's Monument",
        notes: 'General combat stats. ⚠️ CANNOT use Universal Decor Components — duplicates only. Can be obtained as a daily reward from Adventurer Taylor (VIP store survivor) — a non-pack acquisition path for players who own Taylor.',
        canUseComponents: false,
      },
      {
        name: 'Throne of Blood',
        notes: 'Available from Season Store for 40 medals after Season 1. At L7: +55,000 HP · +1,309 ATK · +261 DEF. Decent if you need more decorations.',
        canUseComponents: true,
        maxStats: 'L7: +55,000 HP · +1,309 ATK · +261 DEF',
      },
      {
        name: 'Golden Missile Vehicle',
        notes: 'Highest single-stat ATK from vehicle decorations at +4,285 ATK at L7.',
        canUseComponents: true,
        maxStats: 'L7: +4,285 ATK',
      },
      {
        name: 'Ferris Wheel',
        notes: 'Multi-stat ATK and DEF but middle-tier values.',
        canUseComponents: true,
      },
      {
        name: 'Bell Tower',
        notes: 'At L7: +90,000 HP · +2,142 ATK. Strong HP+ATK combination.',
        canUseComponents: true,
        maxStats: 'L7: +90,000 HP · +2,142 ATK',
      },
    ],
  },
  {
    tier: 'C',
    statFocus: 'Lower Impact',
    priority: 'Lowest priority — upgrade only after everything else',
    decorations: [
      {
        name: 'Gold Bomber',
        notes: 'Defense bonuses for tank builds. Lower stat ceiling and limited competitive scaling.',
        canUseComponents: true,
      },
      {
        name: 'Gold Tank',
        notes: 'HP boost. Lower stat ceiling and limited competitive scaling.',
        canUseComponents: true,
      },
      {
        name: 'Neon Sign',
        notes: 'Multi-stat (HP, ATK, DEF) but values are low — weakest UR decoration overall. Not worth prioritizing.',
        canUseComponents: true,
      },
      {
        name: 'Golden Mobile Squad',
        notes: 'Provides utility bonuses (+3 Dispatch, +10 Supply Boxes) — not combat stats. Skip for combat power. ⚠️ CANNOT use Universal Decor Components.',
        canUseComponents: false,
      },
    ],
  },
  {
    tier: 'Economy',
    statFocus: 'Resource & Progression Speed',
    priority: 'Useful for progression but NOT combat priority — never take components away from combat decorations',
    tierNotes: 'Economy decorations accelerate base development significantly. Eternal Pyramid is the standout — 55% construction speed at L7 saves hours every single day and compounds over the entire game.',
    decorations: [
      {
        name: 'Eternal Pyramid',
        notes: 'Best progression decoration in the game. Construction speed scaling: L1=15% · L2=20% · L3=25% · L4=35% (major jump) · L5=40% · L6=47.5% · L7=55%. Upgrade before Season 3 when build times extend into days and weeks. Available from Black Market before Season 3.',
        canUseComponents: true,
        maxStats: 'L7: +55% Construction Speed (L4 is the major milestone at 35%)',
      },
      {
        name: 'Lucky Cat',
        notes: 'Resource/economy boosts.',
        canUseComponents: true,
      },
      {
        name: 'Military Monument',
        notes: 'Highest single Defense stat at +1,300 plus +2% Zombie Damage at L7. ⚠️ CANNOT use Universal Decor Components — duplicates only.',
        canUseComponents: false,
        maxStats: 'L7: +1,300 DEF · +2% Zombie Damage',
      },
      {
        name: 'Libertas',
        notes: 'Balanced tri-stat: at L7 +60,000 HP · +1,428 ATK · +285 DEF. ⚠️ CANNOT use Universal Decor Components — duplicates only.',
        canUseComponents: false,
        maxStats: 'L7: +60,000 HP · +1,428 ATK · +285 DEF',
      },
      {
        name: '"Eiffelle" Tower',
        notes: 'High HP and Defense focus: +120,000 HP · +285 DEF at L7. Great for survivability builds.',
        canUseComponents: true,
        maxStats: 'L7: +120,000 HP · +285 DEF',
      },
      {
        name: 'Neon Sign',
        notes: 'Resource/economy boosts.',
        canUseComponents: true,
      },
    ],
  },
];

// -----------------------------------------------------------------------
// UPGRADE PATH
// -----------------------------------------------------------------------

export const DECORATION_UPGRADE_PATH = {
  step1: 'Upgrade ALL S-Tier and A-Tier (A+ and A) decorations to Level 3 first. This activates the Level 3 special bonus on each one.',
  step2: 'Push S-Tier decorations to Level 4 and beyond. Eternal Pyramid should also reach L4 before Season 3.',
  step3: 'Strengthen A-Tier crit pieces (A) and Tower of Victory to L5+.',
  step4: 'Upgrade B and C tiers last.',
  keyBreakpoint: 'Level 3 is the first major efficiency breakpoint — the special bonus activates and delivers more power than Levels 1–2 combined. Get ALL UR decorations to L3 before pushing any to L7.',
  componentStrategy: 'Components are scarce (~230/month from free sources). Focus them on S and A+ tier decorations that accept components. Never spend on decorations that cannot use them.',
};

// -----------------------------------------------------------------------
// META SUMMARY (Jan 2026)
// -----------------------------------------------------------------------

export const DECORATION_META_NOTES = [
  'Damage Reduction (S-Tier) is the dominant stat in Jan 2026 competitive meta.',
  'S-Tier scaling outperforms flat HP in PvP, rallies, and world events.',
  'God of Judgment (A+) is uniquely valuable — only decoration providing March Size bonus (+10 troops). Cannot use Universal Decor Components.',
  'Crit Damage (A-Tier) requires crit rate synergy from heroes to be effective; not universally strong.',
  'Economy decorations should never compete with combat decorations for upgrade resources.',
  'Universal Decor Components are the limiting resource — spend them on S and A+ first.',
  'Decorations are permanent and account-wide — they apply in all game modes simultaneously.',
  "Warrior's Monument (B-tier) can be obtained as a daily reward from Adventurer Taylor — a VIP store survivor. Worth noting when players ask how to acquire it without packs.",
  'Decorations that CANNOT use Universal Decor Components: God of Judgment, Libertas, Military Monument, Warriors Monument, Golden Mobile Squad. Always verify before spending.',
  'Lovely Bears vs Cheese Manor: both provide +215,000 HP at L7. Lovely Bears = +2.5% Skill Damage (skill-focused builds). Cheese Manor = +5% Crit Damage (crit-based builds). Choose based on your squad composition.',
  'Eternal Pyramid Level 4 is a major milestone (jumps to +35% construction speed) — prioritize reaching it before Season 3.',
];

// -----------------------------------------------------------------------
// SUMMARY FUNCTION FOR SYSTEM PROMPT INJECTION
// -----------------------------------------------------------------------

export function getDecorationTierSummary(): string {
  const lines: string[] = [
    '## Decoration Tier List & Upgrade Priority (Jan 2026 Meta)',
    '',
    '**Core mechanic:** Decorations apply permanently to ALL heroes in ALL game modes — no activation needed.',
    '',
    '**Level 3 Special Bonus Rule:** Every UR decoration gets a major bonus at Level 3. Upgrade ALL UR decorations to L3 BEFORE pushing any single decoration to L7. Breadth first, then depth.',
    '',
    '**Decorations that CANNOT use Universal Decor Components (duplicates only):**',
    'God of Judgment · Libertas · Military Monument · Warriors Monument · Golden Mobile Squad · most SSR · all SR',
    '',
    '**Universal Decor Component Sources (~230/month free):**',
    '50/week VIP Shop · 150/month Honor Shop · 30/week Campaign Store · Events (300–500 at milestones)',
    '',
    '**Acquisition:** Legendary Decoration Chest (Honor Shop 50k pts, 1/month) · Decorate Your Dreams event (20th spin pity) · Black Market (seasonal) · Seasonal events',
    '',
  ];

  for (const tier of DECORATION_TIERS) {
    lines.push(`### ${tier.tier}-Tier — ${tier.statFocus}`);
    lines.push(`**Priority:** ${tier.priority}`);
    if (tier.tierNotes) lines.push(tier.tierNotes);
    for (const d of tier.decorations) {
      const componentNote = d.canUseComponents === false ? ' [NO COMPONENTS — duplicates only]' : '';
      const statsNote = d.maxStats ? ` | ${d.maxStats}` : '';
      lines.push(`- **${d.name}**${componentNote}${statsNote}: ${d.notes}`);
    }
    lines.push('');
  }

  lines.push('### Recommended Upgrade Path');
  lines.push(`1. ${DECORATION_UPGRADE_PATH.step1}`);
  lines.push(`2. ${DECORATION_UPGRADE_PATH.step2}`);
  lines.push(`3. ${DECORATION_UPGRADE_PATH.step3}`);
  lines.push(`4. ${DECORATION_UPGRADE_PATH.step4}`);
  lines.push(`**Key breakpoint:** ${DECORATION_UPGRADE_PATH.keyBreakpoint}`);
  lines.push(`**Component strategy:** ${DECORATION_UPGRADE_PATH.componentStrategy}`);
  lines.push('');
  lines.push('### Key Meta Notes');
  for (const note of DECORATION_META_NOTES) {
    lines.push(`- ${note}`);
  }

  return lines.join('\n');
}