// src/lib/lwtHeroData.ts
// Hero system knowledge for Buddy — priority order, skill focus, playstyle fit, promotion strategy
// Updated session 72: added Swift finisher mechanics, Sarah dual role (dev + combat), Schuyler backline
//   targeting detail, Carlie/Murphy replacement logic, EW tier list, damage type counter layer

export interface HeroEntry {
  name: string;
  rarity: 'UR' | 'SSR' | 'SR';
  type: 'combat' | 'development' | 'both';
  playstyle: ('fighter' | 'developer' | 'commander' | 'scout')[];
  hqUnlock?: number;
  priority: 'core' | 'high' | 'medium' | 'low';
  notes: string;
  skillFocus?: string;
  exclusiveWeapon?: boolean;
}

export const HEROES: HeroEntry[] = [
  // ── Combat UR Heroes ────────────────────────────────────────────
  {
    name: 'Lucius',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 20,
    priority: 'core',
    notes: 'Top-tier frontline Aircraft tank. Non-negotiable Slot 1 in any Aircraft formation. Knight\'s Spirit gives team-wide energy damage reduction — specifically hardens the squad against Kimberly/Tesla/Stetmann energy-heavy Tank squads. Silver Armor reduces damage for front-row allies. Without Lucius, Aircraft squads collapse in the opening seconds. Also flexes into Missile hybrid (Missile + Lucius) as an all-rounded defensive presence. EW becomes available S4 W1 — team-wide shields that scale with level, works on any formation type. EW is the highest-priority weapon in the game.',
    skillFocus: 'Knight\'s Spirit (team energy resistance) first → Silver Armor (front row protection) second',
    exclusiveWeapon: true,
  },
  {
    name: 'DVA',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 20,
    priority: 'core',
    notes: 'Highest burst damage in the game. Pinnacle of Aircraft offense. Steel Barrage AoE can eliminate priority targets before they fire. Non-negotiable in Aircraft squad or Aircraft hybrid. EW unlocks Vortex Overload — energy damage scales with Aircraft hero count. At EW L10 unlocks Storm Surge (attack speed spike). At EW L20 all Aircraft heroes get +7.5% stat bonus — multiplicative across her full kit. Always Slot 5 (backline burst dealer). Keep her protected.',
    skillFocus: 'Steel Barrage (tactical AoE) first → Vortex Missile (auto) second → Precision Upgrade (passive/crit) last',
    exclusiveWeapon: true,
  },
  {
    name: 'Kimberly',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 18,
    priority: 'core',
    notes: 'Highest DPS in the early game and remains dominant endgame. Exceptional AoE burst with stacking energy amplification. First Tank hero to build. Non-negotiable in any Tank squad. EW L10 adds extra rocket on tactics. EW L20 gives all Tank heroes +7.5% bonus. Energy damage type — naturally countered by Carlie/Lucius energy resistance builds. First Exclusive Weapon to push.',
    skillFocus: 'Barrage Strike (tactical) first → Energy Boost (auto) second',
    exclusiveWeapon: true,
  },
  {
    name: 'Murphy',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 18,
    priority: 'core',
    notes: 'Cornerstone tank anchor. Stand Firm (passive, 17% reduction) × Ironclad Barrier (active, 29% reduction) × EW mitigation = multiplicative damage reduction. Effective HP pool 2–3x displayed stats. Pairs with Williams for near-invulnerable frontline. At high EW levels (10+) becomes a better damage sponge than Carlie in Aircraft hybrid Slot 2, enabling the "Air + Murphy" endgame meta — the most feared PvP squad. F2P viable. 4-star minimum to unlock Super Sensing passive. EW L1 already meaningful, L10 critical for hybrid use.',
    skillFocus: 'Ironclad Barrier (active defense) first → Stand Firm (passive) second',
    exclusiveWeapon: true,
  },
  {
    name: 'Williams',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 25,
    priority: 'core',
    notes: 'Primary tank anchor. Taunt forces enemy attacks toward him. Team-wide damage reduction aura. Williams + Murphy = the defining dual-frontline of Tank meta. Williams survives sustained fire, Murphy multiplies the mitigation. EW adds team-wide status immunity at L30 and up to 75% damage reduction. Remains strong at endgame as anchor of Ultra Tank Wall formation.',
    skillFocus: 'Iron Will (defensive passive) first → Critical Charge (auto) second',
    exclusiveWeapon: true,
  },
  {
    name: 'Fiona',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 25,
    priority: 'high',
    notes: 'Core Missile AoE damage dealer. The entire Missile formation exists to protect Fiona. Devastating cluster attacks hit multiple targets simultaneously. S5 Exclusive Weapon (W1) adds anti-Aircraft radiation effects that finally make Missile squads competitive vs Aircraft. Pairs with Venom UR in S5 as a serious 5-man Missile comp. Slot 3 in Missile squad. High cross-formation investment return.',
    skillFocus: 'Double Trajectory (auto/anti-air) first → Atomic Blast (tactical AoE) second → Ballistic Boost (passive) last',
    exclusiveWeapon: true,
  },
  {
    name: 'Tesla',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 22,
    priority: 'high',
    notes: 'Strongest Missile precision attacker. Electric Grid Lockdown targets 3 BACK-ROW units — bypasses front row entirely. This makes Tesla one of the few heroes who can directly threaten enemy backline damage dealers (DVA, Kimberly) without killing the front line first. Lightning Chain applies stacking energy damage. Value "skyrockets" with EW. Unique: appears in both Tank squad (finisher role) and Missile squad (precision damage). Only hero with high-impact cross-formation value in two full squad types.',
    skillFocus: 'Electric Grid Lockdown (tactical backline nuke) first → Lightning Chain (auto) second → Electric Power Boost (passive) last',
    exclusiveWeapon: true,
  },
  {
    name: 'Morrison',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 25,
    priority: 'high',
    notes: 'Aircraft primary damage dealer and engine of the Aircraft formation. Armor Piercing Shot shreds enemy DEF, softening all targets for DVA follow-up. Full-Auto Machine Gun deals physical damage (relevant vs energy-resistant targets). Deals particularly high damage to other Aircraft squads in mirror matchups. Slot 3 in Air squad. Mid-game investment that stays relevant endgame.',
    skillFocus: 'Armor Piercing Shot (tactical DEF shred) first → Full-Auto Machine Gun (auto) second → Full Firepower (physical damage passive) last',
    exclusiveWeapon: true,
  },
  {
    name: 'Adam',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 22,
    priority: 'high',
    notes: 'Frontline Missile tank. Spike Armor damage reduction + Counter Defense retaliation. EW spreads counterattack to entire team at L10 — core mechanic of Tank + Adam hybrid formation. Allows Adam to survive against Aircraft much longer than standard tanks. Dual-squad role: Slot 1 in Missile squad AND the hybrid hero in Tank + Adam anti-Aircraft build. Scarlett + Adam pairing in Tank hybrid with Hybrid Squad card is specifically noted as nearly unstoppable vs Aircraft.',
    skillFocus: 'Spike Armor (passive damage reduction) first → Counter Defense (counterattack) second',
    exclusiveWeapon: true,
  },
  {
    name: 'Carlie',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 22,
    priority: 'high',
    notes: 'Aircraft frontline tank (Slot 2). Rapid dual-string rockets with 1-second attack interval. Energy Adaptation gives 40% energy damage reduction — hard counter to Kimberly/Tesla/Stetmann energy-heavy Tank squads. 963K HP — highest raw HP among Aircraft heroes. Inferno Blaze debuffs enemy team. The Lucius + Carlie dual frontline is what protects DVA/Morrison backline. REPLACEMENT NOTE: At high endgame with Murphy EW L10+, Murphy often replaces Carlie in Slot 2 (Air + Murphy hybrid) because Murphy\'s multiplicative mitigation outweighs the 5% type synergy loss. This requires the Hybrid Squad Tactics Card. Carlie is NOT replaced by Sarah — that is a different slot entirely.',
    skillFocus: 'Inferno Blaze (tactical team debuff) first → Energy Adaptation (energy resistance passive) second → Dual-string Rocket (auto) last',
    exclusiveWeapon: true,
  },
  {
    name: 'Schuyler',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 22,
    priority: 'high',
    notes: 'Aircraft backline threat specialist (Slot 4). CRITICAL MECHANIC: Blast Frenzy (tactical) PRIORITIZES 1 BACK-ROW UNIT for 927% energy damage + 20% stun chance for 2 seconds. This bypasses front row entirely — she can hit DVA, Kimberly, Fiona directly. The stun causes the target\'s queued tactical skill to fail and go on cooldown — a perfectly-timed Schuyler can prevent enemy DVA from firing Steel Barrage. Battle report signal: if your backline showed high damage with opponent\'s front row alive, Schuyler was likely the cause. Upgrade order in Aircraft team: DVA → Carlie → Morrison → Lucius → Schuyler. She is last investment priority in Air squad, but her PvP disruption is unique.',
    skillFocus: 'Blast Frenzy (tactical backline nuke + stun) first → Power Barrage (auto) second → Antimatter Armor (passive attack boost) last',
    exclusiveWeapon: false,
  },
  {
    name: 'McGregor',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 22,
    priority: 'medium',
    notes: 'Missile squad taunt tank (Slot 2). Unyielding Heart redirects ALL enemy attacks to McGregor — protects Fiona and Tesla completely while active. Double-edged sword: McGregor absorbs every hit, so without solid DEF gear and star level he dies instantly and the backline is immediately exposed. The correct read in a battle report is: if McGregor died early and backline spiked, the problem is McGregor\'s gear/stars, not the formation. Needs 4-star minimum and DEF-priority gear. Missile-formation-specific specialist.',
    skillFocus: 'Unyielding Heart (taunt) first → HP Boost (passive survivability) second → Forward Rush (auto) last',
    exclusiveWeapon: false,
  },
  {
    name: 'Swift',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 22,
    priority: 'medium',
    notes: 'Missile finisher (Slot 5). CRITICAL MECHANIC: Targeted Strike (auto, 408% ATK) ALWAYS targets the enemy with the LOWEST HP PERCENTAGE — automatic, cannot be overridden. He will always chase the most wounded target. This is the counter/execution mechanic. Precise Guidance stacks self-ATK buffs that NEVER CAP — infinite scaling. In short PvP fights: modest contribution (not enough time to stack). In extended PvE (World Boss): becomes the top damage dealer. Battle report insight: if Swift shows low kills, the problem is never Swift — it means Fiona/Tesla ahead of him failed to bring enemies to low HP. He has no kill opportunities without low-HP targets to finish. 30%+ base crit rate makes him a critical hit machine on wounded targets. EW adds ~10% HP/ATK/DEF per level, enables frontline deployment with enough investment. 5th investment priority in Missile team: Tesla → Adam → McGregor → Fiona → Swift.',
    skillFocus: 'Targeted Strike (auto execution) first → Weakness Targeting (crit passive) second → Precise Guidance (stacking ATK passive) last',
    exclusiveWeapon: true,
  },
  {
    name: 'Stetmann',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'developer', 'commander'],
    hqUnlock: 25,
    priority: 'medium',
    notes: 'Tank squad tempo controller (Slot 4). Disrupts enemy coordinated ultimates and burst windows. Consistent energy damage-over-time that complements Kimberly burst. Slot 4 in Tank squad. Valuable in prolonged fights. S5 Exclusive Weapon adds hybrid utility.',
    skillFocus: 'Skill 2 (energy burst) first',
    exclusiveWeapon: true,
  },
  {
    name: 'Marshall',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'developer', 'commander'],
    hqUnlock: 18,
    priority: 'medium',
    notes: 'Universal support hero. Speeds up allied attacks — Command Strategy passive boosts all allies\' attack rate. The ONLY UR support hero — works in Tank, Aircraft, or Missile formations without type penalty. SARAH vs MARSHALL: In almost all situations, Marshall is better than Sarah for support role. Marshall\'s combat buffs are stronger, he works in any formation, and he does not require sacrificing an Aircraft type slot. Sarah only wins for Aircraft type bonus preservation or PvE monster content. Battle report signal: if opponent ran Marshall in what looks like an Aircraft squad, they either lack Schuyler or specifically chose support utility over the backline threat.',
    skillFocus: 'Command Strategy (attack speed buff) first → skill 2 second',
    exclusiveWeapon: true,
  },
  {
    name: 'Venom',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 25,
    priority: 'medium',
    notes: 'S5 (Wild West) UR Promotion upgrade. Before S5 promotion: situational, underperforms vs burst dealers. After S5 UR upgrade: significantly more viable, enables 5-man Missile squad as a serious composition. Poison-based damage works well in drawn-out fights. Pairs with Fiona EW in S5 Missile squad to finally reliably burst down Aircraft squads. Plan around S5 timing.',
    skillFocus: 'Skill 1 (ATK/poison) first',
    exclusiveWeapon: false,
  },
  {
    name: 'Mason',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 18,
    priority: 'medium',
    notes: 'Best early Tank DPS. SSR→UR promotion available Season 1. Players report Mason doing 2–4x damage of other heroes in early game when built correctly. Strong with Murphy + Kimberly core. Loses relevance once core UR tanks are fully starred and geared — not a late-game anchor. Good bridge until Williams + Stetmann are fully built.',
    skillFocus: 'Skill 1 (ATK) first',
    exclusiveWeapon: false,
  },
  {
    name: 'Scarlett',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 18,
    priority: 'medium',
    notes: 'S3 SSR→UR promotion (Golden Realm). UR Scarlett gains incredible damage mitigation for the team — one of the strongest Tank heroes in S3+. Early SSR form: budget early frontline placeholder. IMPORTANT: Scarlett + Adam in Tank hybrid squad with Hybrid Squad Tactics Card is specifically noted as nearly unstoppable vs Aircraft. In UR form (S3+) she\'s a serious endgame Tank hero.',
    skillFocus: 'Skill 2 (Troop ATK/mitigation) first',
    exclusiveWeapon: false,
  },

  // ── Development UR Heroes ────────────────────────────────────────────
  {
    name: 'Violet',
    rarity: 'UR',
    type: 'development',
    playstyle: ['developer', 'scout', 'commander'],
    hqUnlock: 15,
    priority: 'core',
    notes: 'Best construction speed hero in the game. Must-have for ALL players regardless of playstyle. Construction time savings compound permanently — every hour saved is permanent. Available across all seasons. Level this early. S2 SSR→UR promotion available.',
    skillFocus: 'Skill 1 (Construction Speed) first — always',
    exclusiveWeapon: false,
  },
  {
    name: 'Sarah',
    rarity: 'UR',
    type: 'both',
    playstyle: ['developer', 'fighter', 'scout', 'commander'],
    hqUnlock: 15,
    priority: 'core',
    notes: 'DUAL ROLE HERO — development AND combat. As development hero: top research speed hero, pairs with Violet. Level right after Violet. As combat hero: Aircraft support specialist (SSR→UR promotion in Season 4). HONEST ASSESSMENT of combat role: functionally outclassed by Marshall in most situations. Marshall provides stronger combat buffs and works in any formation. Sarah\'s combat niche: (1) maintaining full 5-hero Aircraft +20% type bonus when Schuyler isn\'t built yet — she fills the 5th Aircraft slot to preserve the bonus; (2) PvE monster content where her backline ATK buffs and monster damage bonuses outperform Schuyler\'s PvP disruption; (3) S4+ UR promotion chain — gains Promotion Synergy passive that scales with number of other promoted heroes. CRITICAL CLARIFICATION: Sarah does NOT replace Carlie. They occupy different slots (Carlie = frontline tank Slot 2, Sarah = backline support Slot 4/5). The real comparison is Sarah vs. Schuyler in the Aircraft backline. Sarah beats Schuyler only in specific PvE content. UR promotion available S4 (Evernight Isle). Must reach 5-star SSR first.',
    skillFocus: 'Skill 1 (Research Speed) first for development. For combat: upgrade buff skills first (backline ATK buffs)',
    exclusiveWeapon: false,
  },
  {
    name: 'Shirley',
    rarity: 'SSR',
    type: 'development',
    playstyle: ['developer', 'scout', 'commander'],
    hqUnlock: 8, // unlocked via VIP 8
    priority: 'core',
    notes: 'Unlocked at VIP 8. Construction speed hero. Level immediately when unlocked — she is your construction lead until Violet. Also provides march capacity increase as a VIP Survivor (march capacity = more troops in squad = higher morale). Skill 1 first, always.',
    skillFocus: 'Skill 1 (Construction Speed) first',
    exclusiveWeapon: false,
  },

  // ── SSR Heroes ──────────────────────────────────────────────────────
  {
    name: 'General SSR Combat Heroes',
    rarity: 'SSR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    priority: 'medium',
    notes: 'SSR combat heroes fill march slots before UR unlocks. Promote to UR if medals allow — 100% medal refund makes this safe. Do not spend heavily on SSR skill medals if UR promotion is near.',
    skillFocus: 'Skill 1 (ATK) only until UR promotion',
    exclusiveWeapon: false,
  },
];

// ── Hero Priority by Player Stage ────────────────────────────────────
export const HERO_PRIORITY_BY_STAGE = {
  early: {
    label: 'Early Game (HQ 1–20, Under T10)',
    order: ['Shirley (construction)', 'Violet (construction)', 'Sarah (research)', 'Any UR combat available'],
    rule: 'Development heroes first. Always. Construction and research speed compound daily — every hour saved is permanent. Do not neglect Shirley at VIP 8.',
  },
  mid: {
    label: 'Mid Game (HQ 20–30, T10)',
    order: ['Violet (construction)', 'Sarah (research)', 'Lucius or Mason (combat)', 'DVA (Aircraft DPS)', 'Kimberly (Tank DPS)'],
    rule: 'Balance development with combat. Ghost Ops fragments accumulating — start building Aircraft heroes alongside Tank squad. Keep leveling Violet and Sarah — research trees get longer.',
  },
  late: {
    label: 'Late Game (HQ 31–35, T11)',
    order: ['Lucius (EW priority)', 'DVA (EW priority)', 'Murphy (EW for Air+Murphy hybrid)', 'Violet/Sarah (keep maxing)', 'Fiona + Venom UR (S5 Missile comp)'],
    rule: 'Exclusive Weapons change the ceiling. Lucius EW first (S4 W1). Murphy EW L10+ unlocks Air+Murphy hybrid — the most feared endgame squad. Violet and Sarah stay permanently relevant for development.',
  },
};

// ── Skill Medal Priority Rules ────────────────────────────────────────
export const HERO_SKILL_RULES = [
  'Always level Skill 1 first on development heroes (Violet, Sarah, Shirley) — construction and research speed are the most valuable stats in the game.',
  'For combat heroes: get every skill to level 20 on the full squad first, THEN max in priority order (see squad skill priority list).',
  'Exception: Do NOT rush Carlie and Lucius top-left skills to 20 before maxing other Aircraft heroes\' priority skills first.',
  'Exception: Do NOT rush Williams and Murphy top-left skills to 20 before maxing other Tank heroes\' priority skills first.',
  'Do NOT spread medals thin across many heroes — follow the squad skill priority order.',
  'SSR heroes: only invest if UR promotion is more than 60 days away. The 100% medal refund on promotion makes early investment safe, but opportunity cost matters.',
  'UR heroes with Exclusive Weapons: skills L31–40 require the EW to unlock. Do not wait for EW to start leveling — reach L30 first, then add EW when available.',
  'Swift Skill Priority for Missile team: Targeted Strike (execution auto) first → Weakness Targeting (crit passive) second → Precise Guidance (stacking ATK) last.',
  'Schuyler Skill Priority for Aircraft team: Blast Frenzy (backline nuke) first → Power Barrage (auto) second. Upgrade after all other Aircraft heroes are at level 20.',
  'Medal priority order: Violet Skill 1 > Sarah Skill 1 > Lead combat hero priority skills > Everything else.',
];

// ── Promotion Strategy ────────────────────────────────────────────────
export const HERO_PROMOTION_NOTES = [
  'Promoting an SSR or SR hero to UR gives a 100% medal refund — all medals spent on that hero come back. Early SSR investment is never wasted.',
  'Do not promote heroes to UR just for the refund — only promote when you have the fragments and it makes roster sense.',
  'Violet and Sarah should be promoted to UR as soon as fragments allow — their development bonuses scale with rarity.',
  'Sarah UR promotion (Season 4) unlocks Promotion Synergy passive — scales in value with each additional promoted hero on your team.',
  'Scarlett UR promotion (Season 3) makes her one of the strongest Tank heroes — incredible team damage mitigation. Worth prioritizing in S3.',
  'Mason UR promotion (Season 1) is the strongest early-game bridge. 2–4x SSR peer damage when built. Loses relevance once top URs are mature.',
  'Venom UR promotion (Season 5) finally makes 5-man Missile squad a viable serious composition.',
  'Combat UR promotion priority: Lucius > Murphy/Williams > DVA > Fiona > Adam/Carlie.',
];

// ── Playstyle Hero Fit ────────────────────────────────────────────────
export const HERO_BY_PLAYSTYLE = {
  fighter: {
    label: 'Fighter (PVP)',
    core: ['Lucius', 'DVA', 'Murphy', 'Kimberly', 'Williams'],
    secondary: ['Fiona', 'Tesla', 'Adam', 'Morrison', 'Schuyler'],
    note: 'Maximize combat hero levels before development. Kill Event performance scales directly with hero power. Aircraft squad is primary PvP offense from mid-game. Tank squad becomes defense. Missile squad is the counter-pick.',
  },
  developer: {
    label: 'Developer (PVE)',
    core: ['Violet', 'Sarah', 'Shirley'],
    secondary: ['Stetmann', 'Any available combat UR for march slots'],
    note: 'Development heroes are your primary investment. Combat heroes only need enough levels to participate in events — do not sacrifice Violet/Sarah progression.',
  },
  commander: {
    label: 'Commander (50/50)',
    core: ['Violet', 'Sarah', 'Lucius', 'Kimberly'],
    secondary: ['DVA', 'Murphy', 'Adam', 'Shirley'],
    note: 'Even split — level Violet/Sarah first, then Lucius as lead combat. This is the optimal order for players who do both PVP and development.',
  },
  scout: {
    label: 'Scout (Still Figuring It Out)',
    core: ['Shirley', 'Violet', 'Sarah'],
    secondary: ['Any available UR combat hero'],
    note: 'Start with Shirley (VIP 8), then Violet, then Sarah. Development heroes give you more value per medal at this stage than any combat hero.',
  },
};

// ── Exclusive Weapon Priority Tier ────────────────────────────────────
export const EXCLUSIVE_WEAPONS = [
  {
    hero: 'Lucius',
    season: 4,
    week: 1,
    priority: 1,
    note: 'Highest priority EW in the game. Team-wide shields scale with level. Works on any formation type (Aircraft, Tank, or Missile squad). L20 = significant team-wide value. L10 already changes survivability ceiling.',
  },
  {
    hero: 'Murphy',
    season: 2,
    week: null,
    priority: 2,
    note: 'Team-wide physical damage mitigation spreads to entire squad. Enables Air + Murphy hybrid at L10+. The reason Murphy appears in Aircraft squads. Second-highest priority — get to L20.',
  },
  {
    hero: 'DVA',
    season: null,
    week: null,
    priority: 3,
    note: 'Vortex Overload scales energy damage with Aircraft hero count. L10 = Storm Surge (attack speed spike). L20 = all Aircraft heroes +7.5%. For Aircraft-primary players, push alongside Lucius EW.',
  },
  {
    hero: 'Kimberly',
    season: null,
    week: null,
    priority: 4,
    note: 'Energy Amplification stacking. Extra rocket on tactics at L10. All Tank heroes +7.5% at L20. Turns Tank squads from defensive to offensive. First EW for Tank-primary players.',
  },
  {
    hero: 'Adam',
    season: 4,
    week: 3,
    priority: 5,
    note: 'Counterattack spreads to entire team at L10 — enables Tank + Adam hybrid anti-Aircraft formation. Core Kill Event hero. EW allows Adam to survive Aircraft much longer than standard tanks.',
  },
  {
    hero: 'Williams',
    season: 4,
    week: 6,
    priority: 6,
    note: 'Up to 75% damage reduction + team aura + status immunity at L30. Strong for Tank teams in sustained fights. Luxury pick after Kimberly/Murphy EW are solid.',
  },
  {
    hero: 'Fiona',
    season: 5,
    week: 1,
    priority: 7,
    note: 'Anti-Aircraft radiation effects. Makes Missile squad reliably burst down Aircraft. Combined with Venom UR in S5 = first time Missile is a serious primary formation.',
  },
  {
    hero: 'Swift',
    season: 2,
    week: null,
    priority: 8,
    note: '+~10% HP/ATK/DEF per EW level. Enables frontline deployment. Enhances execution crit mechanics. Push after Tesla, Adam, McGregor, Fiona EWs are established.',
  },
  {
    hero: 'Tesla',
    season: null,
    week: null,
    priority: 7,
    note: 'Value "skyrockets" with EW. Backline suppression dramatically enhanced. Don\'t fully evaluate Tesla without EW in the equation.',
  },
  {
    hero: 'Stetmann',
    season: 5,
    week: 3,
    priority: 9,
    note: 'Second S5 EW. Hybrid utility for Tank + Arms Race scoring. Build after core squad weapons are established.',
  },
  {
    hero: 'Morrison',
    season: 5,
    week: 6,
    priority: 10,
    note: 'Third S5 EW. Late-season specialist. Build after Fiona and Stetmann.',
  },
  {
    hero: 'Carlie',
    season: null,
    week: null,
    priority: 11,
    note: 'L30 summon was strong but meta moved on. Murphy EW for hybrid outclasses Carlie EW in most endgame aircraft formations. Functional but outclassed. Not a priority once Murphy EW is established.',
  },
];

// ── Damage Type Layer — Physical vs Energy ─────────────────────────────
// Beyond Tank/Aircraft/Missile counter triangle, there is a secondary layer:
// Energy heroes deal energy damage. Carlie and Lucius have energy resistance.
// This means a Lucius + Carlie frontline is specifically hardened against energy-heavy Tank squads.
export const DAMAGE_TYPE_NOTES = {
  physicalDamagers: ['Murphy', 'Mason', 'Swift', 'Morrison', 'Williams', 'Adam', 'Carlie'],
  energyDamagers: ['Kimberly', 'Tesla', 'Stetmann', 'DVA', 'Schuyler', 'Fiona'],
  energyResistant: ['Carlie (40% energy damage reduction via Energy Adaptation)', 'Lucius (team-wide energy reduction via Knight\'s Spirit)'],
  battleReportNote: 'A Lucius + Carlie Aircraft frontline running against a Kimberly + Tesla Tank squad is specifically hardened against their primary damage type. This explains why Tank squads often perform below power expectations against Aircraft: not just the 20% type counter disadvantage, but also the energy resistance layer reducing their core damage output. If your Kimberly/Tesla output felt suppressed in a battle against an Aircraft squad, this is the mechanic at play.',
};

// ── Squad Skill Priorities by Troop Type ─────────────────────────────
export interface SquadSkillPriority {
  troopType: 'aircraft' | 'tank' | 'missile';
  heroes: string[];
  fiveStarNote: string;
  skillLevelNote: string;
  prio1: string[];
  prio2: string[];
  prio3: string[];
  skipToLvl20Exception?: string;
}

export const SQUAD_SKILL_PRIORITIES: SquadSkillPriority[] = [
  {
    troopType: 'aircraft',
    heroes: ['DVA', 'Morrison', 'Lucius', 'Carlie', 'Schuyler'],
    fiveStarNote: 'Get everyone to at least 3-star before working on 5-starring any hero.',
    skillLevelNote: 'Get every skill to level 20 ASAP — except Carlie and Lucius top-left skills. Then max skills in priority order.',
    skipToLvl20Exception: 'Top-left skills of Carlie and Lucius — bring others to 20 first.',
    prio1: [
      'Steel Barrage',
      "Knight's Spirit",
      'Silver Armor',
      'Inferno Blaze',
      'Armor-Piercing Shot',
    ],
    prio2: [
      'Vortex Missile',
      'Energy Adaption',
      'Full-Auto Machine',
      'Full Firepower',
      'Blast Frenzy',
    ],
    prio3: [
      'Armament Upgrade',
      'Lightning Triple Strike',
      'Dual-string Rocket',
      'Lightning Chain',
      'Antimatter Armor',
    ],
  },
  {
    troopType: 'tank',
    heroes: ['Kimberly', 'Stetmann', 'Williams', 'Murphy', 'Marshall'],
    fiveStarNote: '5-star Kimberly is your main focus. After that, get everyone to 4-star before working on your next 5-star units.',
    skillLevelNote: 'Get every skill to level 20 ASAP — except top-left skills of Williams and Murphy. Then max skills in priority order.',
    skipToLvl20Exception: 'Top-left skills of Williams and Murphy — bring others to 20 first.',
    prio1: [
      'Barrage Strike',
      'Lightning Rush',
      'Iron Will',
      'All-Around Armor',
      'Ironclad Barrier',
      'Command Strategy',
    ],
    prio2: [
      'Energy Boost',
      'Energy Assault',
      'Critical Charge',
      'Stand Firm',
    ],
    prio3: [
      'Orb Lightning',
      'Triad Harmony',
    ],
  },
  {
    troopType: 'missile',
    heroes: ['Tesla', 'Adam', 'McGregor', 'Fiona', 'Swift'],
    fiveStarNote: 'Investment priority order: Tesla → Adam → McGregor → Fiona → Swift. Get Tesla and Adam to functional star levels before pushing others.',
    skillLevelNote: 'Get every skill to level 20 ASAP in order, then max skills in priority order. Swift\'s Targeted Strike (auto execution) is the first to max — it fires every 1.35 seconds and is the core of his finisher role.',
    prio1: [
      'Electric Grid Lockdown (Tesla — backline nuke)',
      'Spike Armor (Adam — damage reduction)',
      'Double Trajectory (Fiona — anti-air/AoE)',
      'Targeted Strike (Swift — execution auto)',
      'Unyielding Heart (McGregor — taunt)',
    ],
    prio2: [
      'Lightning Chain (Tesla)',
      'Counter Defense (Adam)',
      'Atomic Blast (Fiona)',
      'Weakness Targeting (Swift — crit passive)',
      'HP Boost (McGregor)',
    ],
    prio3: [
      'Electric Power Boost (Tesla)',
      'MK43 Vehicle-Mounted Machine Gun (Adam auto)',
      'Ballistic Boost (Fiona)',
      'Precise Guidance (Swift — stacking ATK)',
      'Forward Rush (McGregor auto)',
    ],
  },
];

// ── Sarah Combat Position Clarification ──────────────────────────────
// This is a common point of confusion — documenting clearly for Buddy
export const SARAH_CARLIE_CLARIFICATION = {
  wrongQuestion: 'Should I replace Carlie with Sarah?',
  correctAnswer: 'Carlie and Sarah do not compete for the same slot. Carlie is a frontline tank (Slot 1–2). Sarah is a backline support (Slot 4–5). Replacing Carlie with Sarah would remove your frontline tank and put a fragile support hero in the front row — this is wrong.',
  actualComparison: 'The real comparison is Sarah vs. Schuyler in the Aircraft backline (Slot 4). Sarah beats Schuyler only in PvE monster content. Schuyler beats Sarah in all PvP content.',
  endgameAircraftReplacement: 'The hero who actually replaces Carlie in endgame is Murphy (Tank type), using the Air + Murphy hybrid formation with the Hybrid Squad Tactics Card. Murphy\'s EW multiplicative mitigation outweighs both the 5% type synergy loss and Carlie\'s raw HP advantage.',
};

// ── Summary for Buddy system prompt ──────────────────────────────────
export function getHeroDataSummary(): string {
  const coreHeroes = HEROES.filter(h => h.priority === 'core');
  const ewHeroes = EXCLUSIVE_WEAPONS;

  const squadSkillSection = SQUAD_SKILL_PRIORITIES.map(sq => {
    const type = sq.troopType.charAt(0).toUpperCase() + sq.troopType.slice(1);
    return `#### ${type} Squad (${sq.heroes.join(' → ')})
- **Investment Order:** ${sq.fiveStarNote}
- **Leveling Rule:** ${sq.skillLevelNote}${sq.skipToLvl20Exception ? `\n- **Exception:** ${sq.skipToLvl20Exception}` : ''}
- **Prio 1 (max first):** ${sq.prio1.join(', ')}
- **Prio 2:** ${sq.prio2.join(', ')}
- **Prio 3:** ${sq.prio3.join(', ')}`;
  }).join('\n\n');

  return `## Hero System

### Development Heroes — Always First
${coreHeroes
  .filter(h => h.type === 'development' || h.type === 'both')
  .map(h => `- **${h.name}** (${h.rarity}): ${h.notes} Skill focus: ${h.skillFocus}`)
  .join('\n')}

### Combat Hero Priority (Core)
${coreHeroes
  .filter(h => h.type === 'combat')
  .map(h => `- **${h.name}** (${h.rarity}): ${h.notes} Skill focus: ${h.skillFocus}`)
  .join('\n')}

### Key Hero Mechanics — Non-Obvious Facts
- **Swift (Missile finisher):** Auto attack ALWAYS targets the enemy with the lowest HP%. Automatic, cannot be overridden. He needs Tesla/Fiona to damage enemies first — no low-HP targets = no executions. Stacking ATK buff never caps; scales infinitely in long fights.
- **Schuyler (Aircraft backline):** Blast Frenzy BYPASSES front row entirely and hits 1 back-row unit directly. 20% stun chance prevents the target's queued tactical skill — can stop enemy DVA/Kimberly from firing at critical moments.
- **Tesla (Missile precision):** Electric Grid Lockdown targets 3 BACK-ROW units directly. One of very few heroes who can directly threaten protected backline without killing the front first.
- **McGregor (Missile taunt):** Taunt redirects ALL damage to McGregor. If he dies fast, the ENTIRE backline is immediately exposed. Needs DEF-priority gear and 4-star minimum to survive his own taunt.
- **Murphy in Aircraft squad:** Murphy EW L10+ enables the Air+Murphy hybrid. He replaces CARLIE (Slot 2 frontline) not Sarah. Multiplicative mitigation > Carlie raw HP at high investment.
- **Sarah combat role clarification:** Sarah does NOT replace Carlie (different slots entirely). Sarah vs. Schuyler in Slot 4 backline: Schuyler wins PvP, Sarah wins PvE monster content only. Marshall beats Sarah as support in virtually all situations.
- **Damage type counter layer:** Carlie has 40% energy damage reduction. Lucius gives team-wide energy resistance. Aircraft frontline Lucius+Carlie is specifically hardened vs Kimberly/Tesla/Stetmann energy-heavy Tank squads — explains why Tank squads often underperform against Aircraft beyond just the type counter.

### Sarah: Development vs Combat Role
${SARAH_CARLIE_CLARIFICATION.wrongQuestion}: ${SARAH_CARLIE_CLARIFICATION.correctAnswer}
Endgame Aircraft replacement for Carlie: ${SARAH_CARLIE_CLARIFICATION.endgameAircraftReplacement}

### Hero Priority by Stage
- **Early (HQ 1–20):** ${HERO_PRIORITY_BY_STAGE.early.rule}
- **Mid (HQ 20–30):** ${HERO_PRIORITY_BY_STAGE.mid.rule}
- **Late (HQ 31–35, T11):** ${HERO_PRIORITY_BY_STAGE.late.rule}

### Skill Medal Rules
${HERO_SKILL_RULES.map(r => `- ${r}`).join('\n')}

### Promotion Strategy
${HERO_PROMOTION_NOTES.map(n => `- ${n}`).join('\n')}

### Exclusive Weapons — Priority Tier List
${ewHeroes.map(ew => `- **${ew.hero}** (Priority #${ew.priority}${ew.season ? `, S${ew.season}${ew.week ? ` W${ew.week}` : ''}` : ''}): ${ew.note}`).join('\n')}

### Hero Priority by Playstyle
- **Fighter:** Core = ${HERO_BY_PLAYSTYLE.fighter.core.join(', ')}. ${HERO_BY_PLAYSTYLE.fighter.note}
- **Developer:** Core = ${HERO_BY_PLAYSTYLE.developer.core.join(', ')}. ${HERO_BY_PLAYSTYLE.developer.note}
- **Commander:** Core = ${HERO_BY_PLAYSTYLE.commander.core.join(', ')}. ${HERO_BY_PLAYSTYLE.commander.note}
- **Scout:** Core = ${HERO_BY_PLAYSTYLE.scout.core.join(', ')}. ${HERO_BY_PLAYSTYLE.scout.note}

### Squad Skill Priority by Troop Type
These are the recommended skill max orders per squad. General rule: get all skills to level 20 first, then max in priority order below.

${squadSkillSection}`;
}