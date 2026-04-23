// src/lib/lwtHeroData.ts
// Hero system knowledge for Buddy — priority order, skill focus, playstyle fit, promotion strategy
// Updated session 72: added Swift finisher mechanics, Sarah dual role (dev + combat), Schuyler backline
//   targeting detail, Carlie/Murphy replacement logic, EW tier list, damage type counter layer
// Updated session 153 (April 23, 2026): Full Exclusive Weapon audit. EXCLUSIVE_WEAPONS schema upgraded
//   to include L1/L10/L20/L30 skill detail + mechanic + verdict per Hedge. All 15 EWs present, correct
//   season/week assignments. Schuyler + McGregor flagged exclusiveWeapon: true (had S3 EWs that weren't
//   reflected). Marshall notes expanded to match depth of Lucius/DVA/Kimberly/Murphy. Williams notes
//   corrected (had Murphy's L30 numbers by mistake). Lucius EW timing corrected to S4 W3. Late-game
//   rule text refined to drop specific-week callouts (avoids future rot when EW schedules shift).
//   EW data is Powered by cpt-hedge.com.

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
    notes: 'Top-tier frontline Aircraft tank. Non-negotiable Slot 1 in any Aircraft formation. Knight\'s Spirit gives team-wide energy damage reduction — specifically hardens the squad against Kimberly/Tesla/Stetmann energy-heavy Tank squads. Silver Armor reduces damage for front-row allies. Without Lucius, Aircraft squads collapse in the opening seconds. Also flexes into Missile hybrid (Missile + Lucius) as an all-rounded defensive presence. EW becomes available S4 W3 — Knight\'s Spirit II (L10) gives the squad +20.89% Energy Damage Reduction plus a squad-wide shield equal to 3% of Lucius\'s max HP for 8s. Shield Breaker (L30) turns every shield break into +6% Attack Speed for 5s, stacking to +18%. Works on any formation type. EW is the highest-priority weapon in the game.',
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
    notes: 'Primary tank anchor. Team-wide damage reduction aura. Williams + Murphy = the defining dual-frontline of Tank meta. Williams survives sustained fire, Murphy multiplies the mitigation. EW adds reliable Overwhelm (auto-attack suppression) on both his auto-attacks and Tactic — silences the weakest front-row enemy every 2 attacks and locks down the tankiest back-row enemy for 4s after each Tactic. Iron Will II at L30 = +55% Defense for 10s to the squad PLUS +12% Energy Damage taken debuff on all enemies for 4s. Natural pairing with Energy-damage heroes (Kimberly, Tesla, Schuyler). Remains strong at endgame as anchor of Ultra Tank Wall formation.',
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
    notes: 'Aircraft backline threat specialist (Slot 4). CRITICAL MECHANIC: Blast Frenzy (tactical) PRIORITIZES 1 BACK-ROW UNIT for 927% energy damage + 20% stun chance for 2 seconds. This bypasses front row entirely — she can hit DVA, Kimberly, Fiona directly. The stun causes the target\'s queued tactical skill to fail and go on cooldown — a perfectly-timed Schuyler can prevent enemy DVA from firing Steel Barrage. Battle report signal: if your backline showed high damage with opponent\'s front row alive, Schuyler was likely the cause. EW (S3 W3) adds Disruption (buff nullification) on auto-attacks and extends Plasma Blast to 3 back-row targets with a Stun-or-Disruption guarantee per target. EMP Overdrive (L30) guarantees at least 1 Stun on her opening Tactic — turns the first Blast Frenzy into a lock-in disruption play regardless of RNG. Upgrade order in Aircraft team: DVA → Carlie → Morrison → Lucius → Schuyler. She is last investment priority in Air squad, but her PvP disruption is unique.',
    skillFocus: 'Blast Frenzy (tactical backline nuke + stun) first → Power Barrage (auto) second → Antimatter Armor (passive attack boost) last',
    exclusiveWeapon: true,
  },
  {
    name: 'McGregor',
    rarity: 'UR',
    type: 'combat',
    playstyle: ['fighter', 'commander'],
    hqUnlock: 22,
    priority: 'medium',
    notes: 'Missile squad taunt tank (Slot 2). Unyielding Heart redirects ALL enemy attacks to McGregor — protects Fiona and Tesla completely while active. Double-edged sword: McGregor absorbs every hit, so without solid DEF gear and star level he dies instantly and the backline is immediately exposed. The correct read in a battle report is: if McGregor died early and backline spiked, the problem is McGregor\'s gear/stars, not the formation. Needs 4-star minimum and DEF-priority gear. Missile-formation-specific specialist. EW (S3 W6) adds Fury stacking — each stack on an enemy = +20% DoT taken and -2.5% enemy Attack, up to 5 stacks (+100% DoT, -12.5% Attack). Ironclad mode at L30 triggers after each Tactic: -5% damage taken, -25% attack speed, but double-shell firing. Best in Missile squads with other DoT-dealing heroes who benefit from Fury amplification.',
    skillFocus: 'Unyielding Heart (taunt) first → HP Boost (passive survivability) second → Forward Rush (auto) last',
    exclusiveWeapon: true,
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
    notes: 'Universal support hero. Speeds up allied attacks — Command Strategy passive boosts all allies\' attack rate. The ONLY UR support hero — works in Tank, Aircraft, or Missile formations without type penalty. SARAH vs MARSHALL: In almost all situations, Marshall is better than Sarah for support role. Marshall\'s combat buffs are stronger, he works in any formation, and he does not require sacrificing an Aircraft type slot. Sarah only wins for Aircraft type bonus preservation or PvE monster content. Battle report signal: if opponent ran Marshall in what looks like an Aircraft squad, they either lack Schuyler or specifically chose support utility over the backline threat. EW (S3 W1) unlocks Weak Point Detection crit amplification — each stack = +1% Crit Chance taken and +2% Crit Damage taken on the target, max stacks = number of Tank heroes in squad (up to 5 stacks). Full Assault II (L10) = +16.95% Attack and +10% Crit Rate for all units for 8s. Ultimate Reset (L30) fully resets the Tactic cooldown of the highest-Attack unit 2s after Marshall\'s 3rd Tactic cast and grants +10% Attack and +10% Crit Rate for 3s — a genuine force multiplier that enables chained Tactic burst windows.',
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
    rule: 'Exclusive Weapons change the ceiling. Lucius EW is the top priority — team-wide shields work on any formation type. Murphy EW L10+ unlocks Air+Murphy hybrid — the most feared endgame squad. Violet and Sarah stay permanently relevant for development.',
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

// ── Exclusive Weapons — Full Detail ──────────────────────────────────
// All data sourced from cpt-hedge.com. Powered by cpt-hedge.com attribution
// is rendered in the system prompt when this section is included.
export interface ExclusiveWeaponEntry {
  hero: string;
  heroType: 'tank' | 'aircraft' | 'missile';
  season: number;
  week: 1 | 3 | 6;
  priority: number; // 1 = highest priority EW in the game
  unlockRequirement: string;
  l1Name: string;
  l1Effect: string;
  l10Name: string;
  l10Effect: string;
  l20Name: string;
  l20Effect: string;
  l30Name: string;
  l30Effect: string;
  mechanic: string;
  verdict: string;
  note: string; // Short strategic summary for quick reference
}

export const EXCLUSIVE_WEAPONS: ExclusiveWeaponEntry[] = [
  // ── Season 1 ───────────────────────────────────────────────────────
  {
    hero: 'Kimberly',
    heroType: 'tank',
    season: 1,
    week: 1,
    priority: 4,
    unlockRequirement: 'Kimberly at 5 stars + 50 Kimberly Exclusive Weapon Shards. Battle Pass (~$20) provides 70 shards = unlock + L2.',
    l1Name: 'Energy Assault II',
    l1Effect: 'Attack 1 enemy for Energy Damage equal to 472.12% of Attack. On critical hits, Kimberly gains 1 stack of Energy Amplification (max = number of Tank heroes in squad).',
    l10Name: 'Barrage Strike II',
    l10Effect: 'Fire 16 rockets at random enemies, each dealing Energy Damage equal to 302.06% of Attack. Fires 1 extra rocket per Energy Amplification stack.',
    l20Name: 'Tank Specialist',
    l20Effect: 'All Tank heroes +7.5% Attack, Defense, and HP in battles.',
    l30Name: 'Lethal Fireworks',
    l30Effect: 'With 4 stacks of Energy Amplification, each Barrage Strike rocket deals splash damage equal to 5% of Attack to 3 enemies close to the impact area.',
    mechanic: 'Energy Amplification: +3% Energy Damage per stack, up to 15% (5 stacks in full Tank squad). Gained on critical hits.',
    verdict: 'Highly recommended. First Tank-primary EW to push. Energy Amplification + Lethal Fireworks turns Kimberly into a multi-target crit-scaling damage engine. Tank Specialist at L20 is one of the strongest squad-wide buffs in the game.',
    note: 'Energy Amplification stacking on crits + Lethal Fireworks AoE at L30. First EW for Tank-primary players. First to push alongside Murphy for full Tank squad optimization.',
  },
  {
    hero: 'DVA',
    heroType: 'aircraft',
    season: 1,
    week: 3,
    priority: 3,
    unlockRequirement: 'DVA at 5 stars + 50 DVA Exclusive Weapon Shards. Battle Pass provides 70 shards = unlock + L2.',
    l1Name: 'Vortex Missile II',
    l1Effect: 'Attacks 1 enemy for Energy Damage equal to 408.11% of Attack. At battle start, DVA gains 2 Vortex Overload stacks per Aircraft hero on your side.',
    l10Name: 'Steel Barrage II',
    l10Effect: 'Attacks all enemies for Energy Damage equal to 753.69% of Attack. On hit, DVA gains 1 Storm Surge stack per Aircraft hero on your side.',
    l20Name: 'Aircraft Specialist',
    l20Effect: 'All Aircraft heroes +7.5% Attack, Defense, and HP in battles.',
    l30Name: 'Overdrive',
    l30Effect: 'At battle start, DVA attacks the 2 front-row enemies for Energy Damage equal to 718.17% of Attack. On hit, DVA gains 1 Storm Surge stack per Aircraft hero.',
    mechanic: 'Vortex Overload: +3% Energy Damage per stack, up to 30% (10 stacks in full Aircraft squad at battle open). Depletes 1 stack per auto-attack. Storm Surge: +20% Attack Speed per stack, up to 100% for 4s.',
    verdict: 'Highly recommended. Opening burst from Vortex Overload + Storm Surge attack speed stacking gives DVA a devastating opening window. Overdrive at L30 starts the Storm Surge stack chain before the battle even fully begins.',
    note: 'Vortex Overload opening burst + Storm Surge attack speed stacking. L10 = Steel Barrage II (all enemies + Storm Surge). L20 = all Aircraft heroes +7.5%. Push alongside Lucius EW for Aircraft-primary players.',
  },
  {
    hero: 'Tesla',
    heroType: 'missile',
    season: 1,
    week: 6,
    priority: 9,
    unlockRequirement: 'Tesla at 5 stars + 50 Tesla Exclusive Weapon Shards. Battle Pass provides 70 shards = unlock + L2.',
    l1Name: 'Lightning Chain II',
    l1Effect: 'Hits 1 enemy for Energy Damage equal to 408.11% of Attack. Applies 1 stack of Inductive Current.',
    l10Name: 'Electric Grid Lockdown II',
    l10Effect: 'Hits 3 back-row enemies for Energy Damage equal to 1182.52% of Attack. Applies 2 stacks of Inductive Current per target.',
    l20Name: 'Missile Specialist',
    l20Effect: 'All Missile Vehicle heroes +7.5% Attack, Defense, and HP in battles.',
    l30Name: 'EM Induction',
    l30Effect: 'Tesla\'s auto-attacks add a stack of Inductive Current to a random back-row enemy. Tactics gain +1% damage per Inductive Current stack on target, up to +15%.',
    mechanic: 'Inductive Current: 3% of Tesla\'s Attack per second as DoT, lasting 30s. Max stacks = (Missile heroes in squad × 3), up to 15. Full stack = 45% of Attack/sec sustained DoT per affected unit.',
    verdict: 'Highly recommended. Tesla\'s value "skyrockets" with EW — don\'t fully evaluate Tesla without it in the equation. Electric Grid Lockdown II at L10 sets up massive back-row DoT pressure immediately. EM Induction at L30 makes backline suppression constant.',
    note: 'Value "skyrockets" with EW. Backline suppression dramatically enhanced. Don\'t fully evaluate Tesla without EW in the equation.',
  },

  // ── Season 2 ───────────────────────────────────────────────────────
  {
    hero: 'Murphy',
    heroType: 'tank',
    season: 2,
    week: 1,
    priority: 2,
    unlockRequirement: 'Murphy at 5 stars + 50 Murphy Exclusive Weapon Shards. Battle Pass provides 70 shards = unlock + L2.',
    l1Name: 'Cannon Fire II',
    l1Effect: 'Deals Physical Damage equal to 490.99% of Attack to 1 enemy. After every 2 attacks, adds 1 stack of Mitigation to a front-row unit.',
    l10Name: 'Ironclad Barrier II',
    l10Effect: 'Increases front-row Physical Damage Reduction by 29.90% for 5s. Applies 1 stack of Mitigation to 3 random units.',
    l20Name: 'Tank Specialist',
    l20Effect: 'All Tank heroes +7.5% Attack, Defense, and HP in battles.',
    l30Name: 'Power Armor',
    l30Effect: 'Mitigation is first applied to the unit with the lowest HP. The Damage Reduction effect of Mitigation is increased to 75%.',
    mechanic: 'Mitigation: reduces damage from the next auto-attack, disappears after one auto-attack hit, stacks up to 3 per unit. Applied to front-row every 2 auto-attacks, and to 3 random units per Tactic.',
    verdict: 'Highly recommended. Second-highest priority EW in the game. Mitigation stacking makes the squad significantly more durable against auto-attack heavy compositions. Power Armor at L30 is a genuine game-changer — smart targeting of low-HP units + 75% reduction per stack = keeps dying allies alive longer.',
    note: 'Team-wide physical damage mitigation spreads to entire squad. Enables Air + Murphy hybrid at L10+. The reason Murphy appears in Aircraft squads. Second-highest priority — get to L20.',
  },
  {
    hero: 'Carlie',
    heroType: 'aircraft',
    season: 2,
    week: 3,
    priority: 12,
    unlockRequirement: 'Carlie at 5 stars + 50 Carlie Exclusive Weapon Shards. Battle Pass provides 70 shards = unlock + L2.',
    l1Name: 'Energy Adaption II',
    l1Effect: 'During battle, reduces Energy Damage taken by Carlie by 40%. Reduces all enemy Auto Attack damage by 12%. Both effects end when Carlie falls.',
    l10Name: 'Inferno Blaze II',
    l10Effect: 'Attacks all enemies for Physical Damage equal to 190.52% of Attack, lowering their Energy Damage by 15.45% for 5s. Also targets 1 back-row unit for 360% Physical Damage and -15% Attack for 5s.',
    l20Name: 'Aircraft Specialist',
    l20Effect: 'All Aircraft heroes +7.5% Attack, Defense, and HP in battles.',
    l30Name: 'Pebble Strike!',
    l30Effect: 'When Carlie falls, she summons Pebble — a mechanical toy that cannot be attacked. Pebble reduces all enemy Auto Attack Damage by 8% and attacks 1 back-row enemy for 360% Physical Damage and -15% Attack.',
    mechanic: 'Pebble: mechanical toy summoned on Carlie\'s death, cannot be attacked. Reduces enemy Auto Attack Damage team-wide and hits a back-row target.',
    verdict: 'Unlock for the stat boost — do NOT invest heavily past L20. From S4 onwards, Murphy becomes the preferred Aircraft slot hero in 4+1 mixed squads, and Carlie gradually gets phased out. L30\'s Pebble Strike only triggers when Carlie falls, which is unreliable. Save excess Universal shards for higher-priority EWs.',
    note: 'L30 summon was strong but meta moved on. Murphy EW for hybrid outclasses Carlie EW in most endgame aircraft formations. Functional but outclassed. Not a priority once Murphy EW is established.',
  },
  {
    hero: 'Swift',
    heroType: 'missile',
    season: 2,
    week: 6,
    priority: 10,
    unlockRequirement: 'Swift at 5 stars + 50 Swift Exclusive Weapon Shards. Battle Pass provides 70 shards = unlock + L2.',
    l1Name: 'Targeted Strike II',
    l1Effect: 'Attacks the enemy with the lowest current HP% for Physical Damage equal to 408.48% of Attack. Applies 1 stack of Burn to the target.',
    l10Name: 'Weakness Targeting II',
    l10Effect: 'Attacks 3 random enemies for Physical Damage equal to 826.54% of Attack. Applies 1 Burn stack per target and reduces Swift\'s damage taken by 5%.',
    l20Name: 'Missile Specialist',
    l20Effect: 'All Missile Vehicle heroes +7.5% Attack, Defense, and HP in battles.',
    l30Name: 'Winning Pursuit',
    l30Effect: 'When Swift uses any skill, launches an extra attack at the enemy with the highest Burn stack count for Physical Damage equal to 800% of Attack.',
    mechanic: 'Burn: continuous Physical Damage equal to 10% of Swift\'s Attack per second for 10s. Max stacks = number of Missile Vehicle heroes in squad, up to 5. Full stack = 50% of Attack/sec DoT per affected unit.',
    verdict: 'Recommended for Missile squads. +~10% HP/ATK/DEF per level enables frontline deployment with investment. Winning Pursuit at L30 nearly doubles Swift\'s single-target output against the most-Burned enemy — significant single-target DPS boost.',
    note: '+~10% HP/ATK/DEF per EW level. Enables frontline deployment. Enhances execution crit mechanics. Push after Tesla, Adam, McGregor, Fiona EWs are established.',
  },

  // ── Season 3 ───────────────────────────────────────────────────────
  {
    hero: 'Marshall',
    heroType: 'tank',
    season: 3,
    week: 1,
    priority: 8,
    unlockRequirement: 'Marshall at 5 stars + 50 Marshall Exclusive Weapon Shards. Battle Pass (~$20) provides 70 shards = unlock + L2.',
    l1Name: 'Command: Focus Fire II',
    l1Effect: 'Attacks the enemy unit symmetrically positioned to Marshall for Physical Damage equal to 381.47% of Attack. Applies 1 stack of Weak Point Detection to the target.',
    l10Name: 'Command: Full Assault II',
    l10Effect: '+16.95% Attack and +10% Crit Rate for all units for 8s. After first use, the highest-Attack unit prioritizes auto-attacking Marshall\'s target.',
    l20Name: 'Tank Specialist',
    l20Effect: 'All Tank heroes +7.5% Attack, Defense, and HP in battles.',
    l30Name: 'Command: Ultimate Reset',
    l30Effect: '2 seconds after Marshall\'s 3rd Tactic cast, the highest-Attack unit has its Tactic cooldown fully reset and gains +10% Attack and +10% Crit Rate for 3s.',
    mechanic: 'Weak Point Detection: each stack = +1% Crit Strike Chance taken and +2% Crit Damage taken. Max stacks = number of Tank heroes in squad, up to 5 (total +5% Crit Chance, +10% Crit Damage on target).',
    verdict: 'Highly recommended for Tank squads, especially when paired with strong Tactic-effect heroes. Weak Point Detection amplifies crit damage squad-wide. Command: Ultimate Reset at L30 is a genuine force multiplier — chained Tactic activations on the highest-Attack unit substantially increase squad DPS.',
    note: 'Weak Point Detection amplifies squad crit damage. Command: Ultimate Reset at L30 enables chained Tactic burst. Strong pick when building a Tank squad with heavy Tactic damage output.',
  },
  {
    hero: 'Schuyler',
    heroType: 'aircraft',
    season: 3,
    week: 3,
    priority: 11,
    unlockRequirement: 'Schuyler at 5 stars + 50 Schuyler Exclusive Weapon Shards. Battle Pass provides 70 shards = unlock + L2.',
    l1Name: 'Disruptive Beam II',
    l1Effect: 'Attacks 1 enemy for Energy Damage equal to 309.32% of Attack. 20% chance to apply Disruption for 2s.',
    l10Name: 'Plasma Blast II',
    l10Effect: 'Attacks 3 back-row enemies for Energy Damage equal to 974.38% of Attack. 20% Stun chance per target for 2s. If Stun fails, applies 9s Disruption instead.',
    l20Name: 'Aircraft Specialist',
    l20Effect: 'All Aircraft heroes +7.5% Attack, Defense, and HP in battles.',
    l30Name: 'EMP Overdrive',
    l30Effect: 'On Schuyler\'s first Tactic of the battle, guarantees at least 1 Stun regardless of the normal 20% Stun chance.',
    mechanic: 'Disruption: next attribute-boosting effect from Hero, Overlord, or Drone skills is nullified and the stack consumed. Stun: target\'s Tactics go off cooldown but fail to activate and immediately re-enter cooldown.',
    verdict: 'Highly recommended for Aircraft squads. Unique crowd control toolkit (both Disruption and Stun). Plasma Blast II\'s fallback-Disruption design means the Tactic is never wasted. EMP Overdrive at L30 removes opening-move RNG — guaranteed first-Tactic Stun is a powerful opener in competitive fights.',
    note: 'Unique Aircraft crowd control — Disruption + Stun. Plasma Blast II (L10) hits 3 back-row targets with Stun-or-Disruption guarantee. EMP Overdrive (L30) guarantees opening-move Stun. Invest after DVA/Lucius EWs are established.',
  },
  {
    hero: 'McGregor',
    heroType: 'missile',
    season: 3,
    week: 6,
    priority: 13,
    unlockRequirement: 'McGregor at 5 stars + 50 McGregor Exclusive Weapon Shards. Battle Pass provides 70 shards = unlock + L2.',
    l1Name: 'Relentless Assault II',
    l1Effect: 'Attacks 1 random front-row enemy for Physical Damage equal to 110.30% of Attack. Applies 1 stack of Fury to the target.',
    l10Name: 'Indomitable Force II',
    l10Effect: 'Taunts 4 random enemies (prioritizing back-row), reducing their Attack by 10.95%. Applies 1 Fury stack to each.',
    l20Name: 'Missile Specialist',
    l20Effect: 'All Missile Vehicle heroes +7.5% Attack, Defense, and HP in battles.',
    l30Name: 'Indomitable Force III (Ironclad mode)',
    l30Effect: 'After using Tactics, McGregor enters Ironclad mode: -5% damage taken, -25% Attack Speed, each shot fires 2 shells instead of 1.',
    mechanic: 'Fury: each stack = +20% DoT Damage Taken and -2.5% target Attack. Max 5 stacks (+100% DoT, -12.5% Attack). Taunt: forces auto-attacks onto McGregor, prioritizing back-row targets.',
    verdict: 'Recommended for Missile squads that include other DoT-dealing heroes. Fury stacking amplifies DoT damage significantly while weakening enemy Attack. Taunt pulls fire from key allies. Ironclad at L30 adds tankiness + double-shell burst after each Tactic.',
    note: 'Fury stacking amplifies squad DoT damage + Taunt pulls fire. Ironclad mode (L30) adds tanky double-shell state after each Tactic. Best in Missile squads with Fiona/Swift DoT synergy.',
  },

  // ── Season 4 ───────────────────────────────────────────────────────
  {
    hero: 'Williams',
    heroType: 'tank',
    season: 4,
    week: 1,
    priority: 6,
    unlockRequirement: 'Williams at 5 stars + 50 Williams Exclusive Weapon Shards. Battle Pass provides 70 shards = unlock + L2.',
    l1Name: 'Stun Bomb II',
    l1Effect: 'Deals Physical Damage equal to 408.11% of Attack to 1 enemy. After every 2 Auto Attacks, inflicts Overwhelm on the front-row enemy with the lowest Defense for 1.30s.',
    l10Name: 'Fire Lockdown',
    l10Effect: 'After using Tactics, inflicts Overwhelm on the back-row enemy with the highest Defense for 4s.',
    l20Name: 'Tank Specialist',
    l20Effect: 'All Tank heroes +7.5% Attack, Defense, and HP in battles.',
    l30Name: 'Iron Will II',
    l30Effect: 'Upgraded Tactic. +55% Defense to all troops for 10s. +12% Energy Damage taken debuff on all enemies for 4s.',
    mechanic: 'Overwhelm: target cannot perform Auto Attacks for the duration. Counterattacks still allowed — only regular auto-attacks are suppressed.',
    verdict: 'Highly recommended for Tank squads and mixed squads with Energy-damage heroes. Reliable auto-attack suppression through Overwhelm on both auto-attacks and Tactic. Iron Will II at L30 combines a massive +55% Defense buff with an Energy vulnerability debuff — natural fit alongside Kimberly/Tesla/Schuyler.',
    note: 'Reliable Overwhelm auto-attack suppression + Iron Will II at L30 (+55% Defense squad-wide, +12% Energy Damage taken debuff on enemies). Strong pick for Tank squads and Energy-damage mixed squads.',
  },
  {
    hero: 'Lucius',
    heroType: 'aircraft',
    season: 4,
    week: 3,
    priority: 1,
    unlockRequirement: 'Lucius at 5 stars + 50 Lucius Exclusive Weapon Shards. Battle Pass provides 70 shards = unlock + L2.',
    l1Name: 'Lightning Triple Strike II',
    l1Effect: 'Attacks 1 random front-row enemy for Physical Damage equal to 309.32% of Attack. Every 2 attacks, provides a shield equal to 3% of max HP to the ally with the lowest HP for 3s.',
    l10Name: 'Knight\'s Spirit II',
    l10Effect: 'All allies gain +20.89% Energy Damage Reduction and a shield equal to 3% of Lucius\'s max HP for 8s.',
    l20Name: 'Aircraft Specialist',
    l20Effect: 'All Aircraft heroes +7.5% Attack, Defense, and HP in battles.',
    l30Name: 'Shield Breaker',
    l30Effect: 'When any shield applied by Lucius breaks, the shield holder gains +6% Attack Speed for 5s, stacking up to 3 times (+18% Attack Speed max).',
    mechanic: 'Shield: protective barrier applied to an ally that absorbs damage before HP. Lucius generates shields through auto-attacks (lowest HP ally, every 2 attacks) AND through his Tactic (squad-wide).',
    verdict: 'Highest priority EW in the game. Works on any formation type — Aircraft, Tank, or Missile. Consistent shield generation + squad-wide Energy Damage Reduction makes survivability the team\'s floor, not a concern. Shield Breaker at L30 converts shield breaks into sustained Attack Speed gains — offensive accelerant wrapped in a support kit.',
    note: 'Highest priority EW in the game. Team-wide shields scale with level. Works on any formation type (Aircraft, Tank, or Missile squad). L20 = significant team-wide value. L10 already changes survivability ceiling.',
  },
  {
    hero: 'Adam',
    heroType: 'missile',
    season: 4,
    week: 6,
    priority: 5,
    unlockRequirement: 'Adam at 5 stars + 50 Adam Exclusive Weapon Shards. Battle Pass provides 70 shards = unlock + L2.',
    l1Name: 'Spike Armor II',
    l1Effect: 'Passive. Reduces all damage taken by front-row units by 13%. Missile heroes gain double effect (26%) while in Defense Counter state. Entire squad\'s Counterattack damage +6%.',
    l10Name: 'Counter Defense II',
    l10Effect: 'Squad enters Counterattack state for 8.98s and gains +5% Defense. In this state, each unit performs 1 normal attack per hit taken (max once per second).',
    l20Name: 'Missile Specialist',
    l20Effect: 'All Missile Vehicle heroes +7.5% Attack, Defense, and HP in battles.',
    l30Name: 'Armor Break Counter',
    l30Effect: 'Passive. Every 6 Counterattacks accumulated across the squad triggers Armor-piercing Ammunition at the closest enemy for 170% damage + +6% Auto Attack/Counterattack damage taken for 4s.',
    mechanic: 'Counterattack state: every squad member performs 1 normal attack per hit received, up to once per second per unit. Full 5-unit squad taking simultaneous hits = significant burst over 8.98s.',
    verdict: 'Highly recommended for Missile squads or mixed squads with counterattack synergy. Core mechanic of Tank + Adam hybrid. Converts incoming damage into offensive output. Armor Break Counter at L30 stacks enemy vulnerability as fights progress — great against aggressive opponents who deal frequent attacks.',
    note: 'Counterattack spreads to entire team at L10 — enables Tank + Adam hybrid anti-Aircraft formation. Core Kill Event hero. EW allows Adam to survive Aircraft much longer than standard tanks.',
  },

  // ── Season 5 ───────────────────────────────────────────────────────
  {
    hero: 'Fiona',
    heroType: 'missile',
    season: 5,
    week: 1,
    priority: 7,
    unlockRequirement: 'Fiona at 5 stars + 50 Fiona Exclusive Weapon Shards. Battle Pass provides 70 shards = unlock + L2.',
    l1Name: 'Double Trajectory',
    l1Effect: 'Attack 1 enemy for Physical Damage. Applies 1 stack of Radiation to the target.',
    l10Name: 'Atomic Blast',
    l10Effect: 'Attack all enemies for Physical Damage. Dispels a combined total of 2 stacks of hero-applied buffs from enemies.',
    l20Name: 'Missile Specialist',
    l20Effect: 'All Missile Vehicle heroes +7.5% Attack, Defense, and HP in battles.',
    l30Name: 'DoT Exploitation',
    l30Effect: 'For every 20 stacks of DoT debuffs on all enemies, Fiona\'s Tactic dispels 1 additional buff stack, up to 5 buff stacks total.',
    mechanic: 'Radiation: 5% of Fiona\'s Attack as Physical DoT per second for 20s. Max stacks per enemy = (Missile heroes in squad × 2), up to 10. Buff Dispel order: Reduced Physical Damage Taken → Defense Boost → Attack Speed Up → Energy Damage Boost → Counterattack → all others.',
    verdict: 'Highly recommended for Missile squads. Anti-Aircraft radiation effects finally make Missile squads competitive vs Aircraft. Buff dispel can neutralize enemy hero boosts — potential game-changer. DoT Exploitation at L30 can remove up to 5 buff stacks when combined with squad-wide DoT sources.',
    note: 'Anti-Aircraft radiation effects + enemy buff dispel. Makes Missile squad reliably burst down Aircraft. Combined with Venom UR in S5 = first time Missile is a serious primary formation.',
  },
  {
    hero: 'Stetmann',
    heroType: 'tank',
    season: 5,
    week: 3,
    priority: 14,
    unlockRequirement: 'Stetmann at 5 stars + 50 Stetmann Exclusive Weapon Shards. Battle Pass provides 70 shards = unlock + L2.',
    l1Name: 'Shield-Break Pulse',
    l1Effect: 'Attack 1 enemy for Energy Damage + additional Shield Damage to the target.',
    l10Name: 'EM Charge',
    l10Effect: 'Each auto-attack grants 1 Charge. When fully charged (3 charges), attack back-row enemies for Energy Damage + additional Shield Damage.',
    l20Name: 'Tank Specialist',
    l20Effect: 'All Tank heroes +7.5% Attack, Defense, and HP in battles.',
    l30Name: 'Tesla Barrier',
    l30Effect: 'Once fully charged, generate a shield that resists 1 Control effect (Stun, Overwhelm, Taunt), lasting 3 seconds.',
    mechanic: 'Charge: each auto-attack grants 1 charge, max 3. Triggers EM Charge (back-row attack) and Tesla Barrier (control resistance). Shield Damage: damages only the target\'s shield, not HP — no effect if target has no shield.',
    verdict: 'Unlock for the stat boost, but NOT a game-changer. Shield Damage is limited by rarity of shields in combat (Lucius EW is the main shield source). Control resistance is genuinely useful vs Schuyler\'s Stun, Williams\'s Overwhelm, or McGregor\'s Taunt. Hedge explicitly recommends waiting for off-season Black Market rather than rushing.',
    note: 'Not a game-changer per Hedge. Control resistance + situational shield damage. Consider waiting for off-season Black Market. Build after core squad weapons are established.',
  },
  {
    hero: 'Morrison',
    heroType: 'aircraft',
    season: 5,
    week: 6,
    priority: 15,
    unlockRequirement: 'Morrison at 5 stars + 50 Morrison Exclusive Weapon Shards. Battle Pass provides 70 shards = unlock + L2.',
    l1Name: 'Annihilation Shots',
    l1Effect: 'Attack 1 enemy for Physical Damage. Every 5 Auto Attacks, fires a Devastation Shell at the highest-current-HP enemy for HP%-based damage equal to 3% of the target\'s current HP.',
    l10Name: 'Devastation Barrage',
    l10Effect: 'Attack random enemies 20 times for Physical Damage + target Defense reduction (stacks up to 5 for 9s). After Tactics, fires a Devastation Shell at the highest-current-HP enemy for 10% of the target\'s current HP.',
    l20Name: 'Aircraft Specialist',
    l20Effect: 'All Aircraft heroes +7.5% Attack, Defense, and HP in battles.',
    l30Name: 'Explosive AP Rounds',
    l30Effect: 'After a Devastation Shell hits, the target\'s Defense is reduced by 10% for 5s.',
    mechanic: 'HP% Damage: ignores target\'s Defense, Damage Taken Reduction, Damage Resistance. Auto-Attack trigger capped at 150% of Attack per hit, Tactic trigger capped at 450% of Attack per hit. NOTE: Overlord Gorilla is the highest-HP unit at battle start — first Devastation Shells target the Overlord, not enemy heroes.',
    verdict: 'Highly recommended for Aircraft squads. HP% damage bypasses enemy defenses and resistances — particularly effective vs high-HP targets. Aircraft Specialist at L20 is the core team buff. Late-season specialist — build after Fiona and Stetmann.',
    note: 'HP% damage bypasses Defense/resistances. Late-season specialist. Build after Fiona and Stetmann. NOTE: first Devastation Shells target Overlord Gorilla (highest battle-start HP), not enemy heroes.',
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

  // Sort EWs by priority for tier list display
  const ewSortedByPriority = [...EXCLUSIVE_WEAPONS].sort((a, b) => a.priority - b.priority);

  // Group EWs by season for the detail section
  const ewBySeason: Record<number, ExclusiveWeaponEntry[]> = {};
  EXCLUSIVE_WEAPONS.forEach(ew => {
    if (!ewBySeason[ew.season]) ewBySeason[ew.season] = [];
    ewBySeason[ew.season].push(ew);
  });
  Object.values(ewBySeason).forEach(seasonEws => {
    seasonEws.sort((a, b) => a.week - b.week);
  });

  const ewDetailSection = Object.keys(ewBySeason)
    .map(s => Number(s))
    .sort((a, b) => a - b)
    .map(season => {
      const seasonEws = ewBySeason[season];
      const seasonBody = seasonEws.map(ew => {
        return `**${ew.hero}** — S${ew.season} W${ew.week} (${ew.heroType.charAt(0).toUpperCase() + ew.heroType.slice(1)}, Priority #${ew.priority})
- Unlock: ${ew.unlockRequirement}
- L1 — ${ew.l1Name}: ${ew.l1Effect}
- L10 — ${ew.l10Name}: ${ew.l10Effect}
- L20 — ${ew.l20Name}: ${ew.l20Effect}
- L30 — ${ew.l30Name}: ${ew.l30Effect}
- Mechanic: ${ew.mechanic}
- Verdict: ${ew.verdict}`;
      }).join('\n\n');
      return `#### Season ${season}\n${seasonBody}`;
    })
    .join('\n\n');

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

### Exclusive Weapons — Priority Tier List (Powered by cpt-hedge.com)
${ewSortedByPriority.map(ew => `- **${ew.hero}** (Priority #${ew.priority}, S${ew.season} W${ew.week}): ${ew.note}`).join('\n')}

### Exclusive Weapons — Full Skill Detail (Powered by cpt-hedge.com)
Complete L1/L10/L20/L30 breakdown for every EW currently in the game. When a commander asks what a specific EW does or how it scales, answer from this section. Lead with availability (season + week) so they know when it's on their server, then provide the skill detail.

${ewDetailSection}

### Hero Priority by Playstyle
- **Fighter:** Core = ${HERO_BY_PLAYSTYLE.fighter.core.join(', ')}. ${HERO_BY_PLAYSTYLE.fighter.note}
- **Developer:** Core = ${HERO_BY_PLAYSTYLE.developer.core.join(', ')}. ${HERO_BY_PLAYSTYLE.developer.note}
- **Commander:** Core = ${HERO_BY_PLAYSTYLE.commander.core.join(', ')}. ${HERO_BY_PLAYSTYLE.commander.note}
- **Scout:** Core = ${HERO_BY_PLAYSTYLE.scout.core.join(', ')}. ${HERO_BY_PLAYSTYLE.scout.note}

### Squad Skill Priority by Troop Type
These are the recommended skill max orders per squad. General rule: get all skills to level 20 first, then max in priority order below.

${squadSkillSection}`;
}