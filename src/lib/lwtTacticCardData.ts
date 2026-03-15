// lwtTacticCardData.ts
// Source: cpt-hedge.com/guides/season-5-tactics-cards (Dec 24, 2025)
// Covers Season 4 (Evernight Isle) + Season 5 (Wild West) Tactics Card system

export const lwtTacticCardData = {

  overview: `
Tactics Cards are powerful enhancement tools introduced in Season 4: Evernight Isle and expanded in Season 5: Wild West.
There are two separate systems — Core Cards and Regular Tactics Cards — each using different upgrade resources,
so you can improve both simultaneously without choosing between them.
Cards can be changed at any time as long as all squads are back in base and idle.
Core Cards have an additional restriction: cards in active cooldown cannot be swapped.
`,

  cardCategories: {
    coreCards: {
      rarity: "Gold",
      slots: 2,
      maxLevel: 10,
      upgradeResource: "Profession Experience",
      persistence: "Permanent — active during both season AND off-season",
      notes: "Can be enhanced using duplicate cards. Form the foundation of your long-term strategy.",
    },
    regularCards: {
      subtypes: ["Battle Cards", "Resource Cards"],
      battleSlots: 4,
      resourceSlots: 4,
      maxLevel: 7,
      maxLevelWithUR: "7+3 (10 effective)",
      upgradeResource: "Materials from dismantling other Tactics Cards",
      persistence: "Season-specific — become INACTIVE during off-season",
      notes: "Dismantle unused cards every few days to avoid backlog and keep upgrade materials flowing.",
    },
  },

  rarityTraits: {
    UR: {
      color: "Gold",
      effect: "Tactics Card Level Up — adds +1 (or +2/+3 if very lucky) to card level, pushing past the L7 cap",
      priority: "Highest — always keep cards with UR level-up traits. The main effect scales better than random secondary buffs.",
    },
    SSR: {
      color: "Purple",
      effects: [
        "Higher PvP Attack buff when attacking or defending",
        "Higher PvP Defense buff when attacking or defending",
        "Higher HP buff when attacking or defending",
        "Damage reduction/increase when countered",
        "Profession Experience from Zombie kills (Resource Cards — watch for this)",
      ],
      priority: "High — aim for cards with at least 1 purple attribute",
    },
    regular: {
      color: "Gray",
      effects: [
        "Lower PvP Attack/Defense/HP buffs",
        "Load capacity improvement",
        "Durability damage improvement",
      ],
      priority: "Standard — useful but not the deciding factor",
    },
    tip: "Aim for cards with 3 attributes where at least one is purple (SSR). Don't stress perfecting secondary stats — it's very hard to get the exact combo you want.",
  },

  cardTypes: {
    universal: {
      icon: "Diamond (Grey)",
      nickname: "Grey / Universal",
      focus: "Standalone abilities. No synergy requirement — benefit most setups on their own.",
      recommendedUse: "Core of almost every setup. Pair freely with other types.",
    },
    battlestreak: {
      icon: "Fist (Red)",
      nickname: "Red / Battlestreak",
      focus: "Continuous fights — buffs squads not at full capacity and boosts subsequent attacks without returning to base.",
      recommendedUse: "Situational. Less universally effective than Quickstride or Garrison.",
    },
    quickstride: {
      icon: "Boots (Green)",
      nickname: "Green / Quickstride",
      focus: "Faster marches and morale boosts based on march speed.",
      recommendedUse: "Best for attacking fights where you move around frequently. Use diamonds on marching squad to amplify morale bonus.",
      note: "Morale boost does NOT apply when garrisoned/defending.",
    },
    garrison: {
      icon: "Shield (Blue)",
      nickname: "Blue / Garrison",
      focus: "Defensive fights — reduces deaths and provides Defensive Regroup skill to return squads to base immediately.",
      recommendedUse: "Best when reinforcing buildings. Multiple alliance members using Garrison together creates a nearly unstoppable defense loop.",
    },
    destruction: {
      icon: "Bomb (Orange)",
      nickname: "Orange / Destruction",
      seasons: ["Season 5 only"],
      focus: "Increasing durability damage and ruin-removal (Engineer profession only).",
      recommendedUse: "Situational. Less proven in general use — seek community input for specific scenarios.",
    },
  },

  highlightedCards: {
    hybridSquad: {
      name: "Universal — Hybrid Squad (4+1)",
      type: "Universal",
      effect: "Allows 1 hero of a different troop type while maintaining the full 20% troop-type boost as if squad were single-type.",
      priority: "Essential for mixed squad builds. Required in slot if using mixed formation.",
      mixedSquadFormations: [
        {
          combo: "Tank + Adam",
          heroes: "Scarlett (critical) + Murphy, Adam + Marshall + Kimberly",
          synergy: "Scarlett + Adam synergy is nearly unstoppable — massive bonus against Aircraft.",
        },
        {
          combo: "Air + Murphy",
          heroes: "DVA + Lucius, Murphy + Morrison + Schuyler",
          synergy: "Murphy keeps squad alive longer and provides physical damage resistance. Level 10 EW is ideal but Level 1 already makes a difference.",
        },
        {
          combo: "Missile + Lucius",
          heroes: "Lucius + Swift, Tesla + Fiona + Adam",
          synergy: "Lucius is all-rounded and provides strong stats across the board.",
        },
      ],
    },
    counterReversal: {
      name: "Universal — Counter Reversal",
      type: "Universal",
      effect: "When fighting a type that counters yours: deal increased damage AND receive reduced damage from them.",
      baseValue: "1.5% on each side at Level 1",
      priority: "High — scales well with levels. Especially strong with UR level-up trait.",
      note: "Pair with Hybrid Squad in almost every setup.",
    },
    zombieKiller: {
      name: "Universal — Zombie Killer",
      type: "Universal",
      effect: "Buff during PvE battles against monsters.",
      priority: "High early-season for first kill rewards and stronghold bosses. Dismantle later for materials — you get them back.",
      pairing: "Best paired with 'Reduce Damage Taken from Monsters' SSR attribute or UR level-up trait.",
    },
    purgatorMonsterSlayer: {
      name: "Purgator — Monster Slayer",
      type: "Core Card",
      effect: "Active skill: +250 virus resistance when activated. Strong PvE damage boost.",
      priority: "Core Card pick for PvE setups. Pair with Zombie Killer regular card for maximum PvE output.",
      use: "Pushing progress early season, First Kill rewards, stronghold bosses.",
    },
  },

  resourceCards: {
    overview: "4 SSR Resource Cards exist total. Fill all 4 Resource Card slots — simple, no decision required.",
    tip: "Watch for the SSR trait that boosts Profession Experience from Zombie kills (up to 3.90% per attribute). Switch to those cards when grinding zombies.",
  },

  battleCards: {
    season4Count: 12,
    season5Count: 15,
    note: "Season 5 adds Destruction type cards. Align card types with your Core Cards for synergy bonuses.",
  },

  recommendedSetups: {
    quickstrideAttack: {
      name: "Quickstride + Mixed Squad Setup",
      use: "Attacking. Moving between bases. Clearing defenses. Primarily offensive engagements.",
      regularCards: [
        "Universal — Hybrid Squad (4+1)",
        "Universal — Counter Reversal",
        "Quickstride — Attribute Boost",
        "Quickstride — Contaminated Land",
      ],
      coreCards: [
        "Quickstride — Morale Boost",
        "Quickstride — Quick March (if you use the active skill to push past a 50% march speed threshold)",
        "OR: Battlestreak — Morale Boost (if you prefer passive over active skill)",
      ],
      tip: "Use diamonds on your marching squad to further increase march speed and amplify the morale bonus.",
      limitation: "Morale boost does NOT apply when garrisoned. Not ideal for pure defenders.",
    },
    garrisonDefend: {
      name: "Garrison + Mixed Squad Setup",
      use: "Defending buildings. Reinforcing under siege. Covering multiple fights in succession.",
      regularCards: [
        "Universal — Hybrid Squad (4+1)",
        "Universal — Counter Reversal",
        "Garrison — Duration",
        "Garrison — Attribute Boost",
      ],
      coreCards: [
        "Garrison — Defensive Regroup (active skill — critical for this setup)",
        "Garrison — Morale Boost",
      ],
      tip: "Garrison — Duration extends the Defensive Regroup skill up to 60 minutes. Multiple alliance members running this setup creates near-unstoppable defense.",
      keyMechanic: "Defensive Regroup sends squads back to base immediately after defeat — removes the return timer and lets you reinforce at high pace.",
    },
    purgatorPvE: {
      name: "Purgator PvE — Zombie Killer Setup",
      use: "Early season PvE grind. First Kill rewards. Stronghold bosses.",
      regularCards: [
        "Universal — Hybrid Squad (4+1)",
        "Universal — Counter Reversal",
        "Universal — Zombie Killer",
        "Any card with 'Reduce Damage Taken from Monsters' SSR attribute",
      ],
      coreCards: [
        "Purgator — Monster Slayer (active skill for +250 virus resistance)",
        "Quickstride — Morale Boost",
      ],
      tip: "Upgrade Zombie Killer even if you plan to dismantle it later — you recover the materials. Prioritize if you're a frontrunner in your alliance.",
    },
  },

  generalTips: [
    "Dismantle any card you don't plan to use — check every few days to avoid backlog.",
    "Cards with UR level-up traits (+1/+2/+3 levels) are always worth keeping — the main effect scales better than secondary stats.",
    "You can freely switch setups any time all squads are idle in base.",
    "Core Cards in active cooldown cannot be swapped — plan around active skill timing.",
    "Core Cards and Regular Cards use separate upgrade resources — improve both simultaneously.",
    "For Resource Cards, fill all 4 slots with the 4 SSR options. Simple.",
    "Type synergy matters — align regular card types with Core Card types for bonus stacking.",
  ],

  applicability: {
    seasons: ["Season 4 (Evernight Isle)", "Season 5 (Wild West)"],
    note: "Regular Tactics Cards are season-specific and go inactive during off-season. Core Cards remain active always.",
    source: "cpt-hedge.com/guides/season-5-tactics-cards",
  },
};