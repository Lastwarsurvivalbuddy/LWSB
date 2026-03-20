// lwtHotDealsData.ts
// Hot Deals spend intelligence
// Source: lastwartutorial.com (Cris84) — pending partnership
// Last updated: March 11, 2026
// Updated: March 20, 2026 (session 48) — Black Market rule added: never proactively recommend; Tier 2 only if asked

export const HOT_DEALS = [
  {
    name: 'Glittering Market',
    type: 'recurring',
    currency: 'Glitter Coins (real money only)',
    summary: 'Most popular Hot Deal. Only reliable source of Mythic Gear Blueprints. Also offers Mushroom skin, Helicopter skin, resource chests, Tower of Victory (very useful in Season 2).',
    topItems: [
      { item: 'Mythic Gear Blueprints', value: 'HIGHEST — required for 5-star gear. No other reliable source.' },
      { item: 'Tower of Victory', value: 'HIGH in Season 2 specifically' },
      { item: 'Mushroom / Helicopter skin', value: 'Cosmetic only' },
    ],
    spendAdvice: 'If you are going to spend anywhere, Mythic Gear Blueprints from Glittering Market are the highest power-per-dollar purchase in the game. Requires real money (Glitter Coins). F2P players cannot access this.',
    f2pValue: 'None — requires real money currency',
  },
  {
    name: 'Custom Weekly Pass',
    type: 'recurring_weekly',
    tiers: [
      { name: 'Premium Subscription', rewards: '2 rewards to choose', note: 'Must purchase this first before Elite is available' },
      { name: 'Elite Subscription', rewards: '4 rewards to choose', note: 'Only available after purchasing Premium' },
    ],
    summary: 'Choose your own rewards. Flexible — pick what you actually need. Premium must be bought before Elite unlocks.',
    spendAdvice: 'Good value for targeted resource acquisition. Buy Premium first, then Elite for 4 choices. Pick based on your current bottleneck.',
    f2pValue: 'Low — paid product',
  },
  {
    name: 'Special Training Pass',
    type: 'recurring_7day',
    tiers: [
      { name: 'Freebie', price: '$0', summary: 'Daily free rewards' },
      { name: 'Advanced', price: '~$5.99', summary: 'Gear-focused items, daily missions, target missions' },
      { name: 'Premium', price: '~$23.99', summary: 'Full gear upgrade materials, all missions unlocked' },
    ],
    summary: '7-day pass focused on gear power. Gear upgrade materials, blueprints, ore. Freebie tier available to all players.',
    spendAdvice: 'Best for players actively upgrading gear. Advanced at ~$6 is solid value. Premium at ~$24 for serious gear investment.',
    f2pValue: 'Claim the Freebie tier daily — free gear materials',
  },
  {
    name: 'Total Mobilization',
    type: 'recurring_7day',
    tiers: [
      { name: 'Paid only', price: 'Varies', summary: 'No freebie daily item — spending required to participate' },
    ],
    summary: '7-day event. Buy Mobilization Packs → get Mobilization Coupons → exchange for valuable items (limited availability per item). Packs refresh daily. Also grants VIP points equal to diamond pack equivalent.',
    mechanics: [
      'Buy packs → earn Mobilization Coupons',
      'Exchange coupons for items — each item has limited stock',
      'Random bonus rewards in each pack (equal probability)',
      'Progress bar unlocks additional rewards',
      'Buying packs grants same VIP points as equivalent diamond packs',
    ],
    spendAdvice: 'Good for Season 4+ players who have unlocked T11 content. VIP points bonus makes it efficient for investors.',
    f2pValue: 'None — no freebie tier',
    availableFrom: 'Season 4',
  },
  {
    name: 'Energy Loot Quest',
    type: 'recurring_weekly',
    summary: 'Earn Energy Badges for purchases made across other hot deals in the same week. Badges expire weekly — cannot be saved.',
    qualifyingEvents: ['Glittering Market', 'Custom Weekly Pass', 'Special Training Pass', 'Total Mobilization'],
    spendAdvice: 'Bonus rewards on top of other spending. No additional cost — just claim if you are already buying other hot deals.',
    f2pValue: 'None — requires purchases in other events',
  },
  {
    name: 'Hero Growth Battle Pass',
    type: 'recurring_7day',
    tiers: [
      { name: 'Freebie', price: '$0', summary: 'Daily free hero rewards' },
      { name: 'Advanced', price: '~$5.99', summary: 'Universal legendary shards, exclusive weapon shards, skill medals, ore' },
      { name: 'Supreme', price: '~$23.99', summary: 'Full rewards — all missions, maximum hero materials' },
    ],
    summary: '7-day pass focused on hero power. Universal legendary shards, exclusive weapon shards, skill medals, upgrade ore.',
    topItems: [
      { item: 'Universal Legendary Shards', value: 'HIGH — used for UR hero promotion' },
      { item: 'Universal Exclusive Weapon Shards', value: 'HIGH — required for hero skill L31-40' },
      { item: 'Skill Medals', value: 'MEDIUM — always needed' },
      { item: 'Upgrade Ore', value: 'HIGH — bottleneck for gear and armament' },
    ],
    spendAdvice: 'Advanced tier at ~$6 is strong value for hero-focused players. Supreme for serious hero investment.',
    f2pValue: 'Claim the Freebie tier daily — free hero materials',
  },
  {
    name: 'Drone Training Pass',
    type: 'recurring_7day',
    tiers: [
      { name: 'Freebie', price: '$0', summary: 'Daily free drone materials' },
      { name: 'Advanced', price: '~$5.99', summary: 'Drone parts, battle data, drone upgrade materials' },
      { name: 'Premium', price: '~$23.99', summary: 'Full drone upgrade materials, all missions' },
    ],
    summary: '7-day pass focused on drone leveling. Drone Parts and Battle Data — the two resources required to upgrade the drone.',
    spendAdvice: 'Best value for players actively pushing drone levels. Drone upgrade is a daily Arms Race action (Drone Boost phase) — materials directly enable scoring.',
    f2pValue: 'Claim the Freebie tier daily — free drone materials',
  },
  {
    name: 'Bounty Hunter',
    type: 'recurring',
    summary: 'Replaced Summon Supplies. Uses Bullets and Jammers as event currency. Features Boss Zombie and Wandering Merchant mechanics. F2P players can earn meaningful rewards — one of the few events accessible without spending.',
    mechanics: [
      'Use Bullets and Jammers to progress',
      'Boss Zombie encounter for bonus rewards',
      'Wandering Merchant for special purchases',
      'Free players can participate without purchasing additional currency',
    ],
    spendAdvice: 'Good value even without spending. Use your free Bullets and Jammers efficiently. Can purchase additional bullets for Boss Zombie / Wandering Merchant access.',
    f2pValue: 'GOOD — meaningful rewards without spending',
    availableFrom: 'Early servers first, rolling out gradually',
  },
];

export const HOT_DEALS_GENERAL_STRATEGY = `
HOT DEALS STRATEGY BY SPEND TIER:

F2P / Budget players:
- ALWAYS claim Freebie tiers: Special Training Pass, Hero Growth Battle Pass, Drone Training Pass
- Bounty Hunter — participate with free currency, strong F2P value
- Glittering Market and Total Mobilization require real spending — skip
- Custom Weekly Pass only if budget allows

Moderate spenders ($10–$50/mo):
- Hero Growth Battle Pass Advanced (~$6) — consistent hero material value
- Drone Training Pass Advanced (~$6) — if actively leveling drone
- Special Training Pass Advanced (~$6) — if actively upgrading gear
- Custom Weekly Pass Premium → Elite for targeted resource needs
- Energy Loot Quest badges automatically accumulate on top of above purchases

Investor/Whale ($50+/mo):
- Glittering Market — Mythic Gear Blueprints are irreplaceable
- Total Mobilization (Season 4+) — VIP point efficiency + valuable items
- All pass Supreme tiers
- Energy Loot Quest maximizes value across all purchases

TIMING TIPS:
- Buy packs with Diamonds DURING the relevant Arms Race phase — diamond purchases score Arms Race points in any phase
- Total Mobilization packs count as VIP points — efficient for VIP progression
- Freebie tiers reset daily — claim every day without fail
`;

export function getHotDealsSummary(): string {
  return `
## Hot Deals — Spend Intelligence

### Recurring Hot Deals

**Glittering Market** (real money / Glitter Coins)
Only reliable source of Mythic Gear Blueprints — required for 5-star gear. Highest power-per-dollar in the game for spenders. F2P: no value. Also offers Tower of Victory (high value in Season 2).

**Custom Weekly Pass**
Choose your own rewards. Buy Premium ($) first to unlock Elite ($) for 4 choices. Good for targeting your specific bottleneck.

**Special Training Pass** (~$6 / ~$24, 7 days)
Gear-focused. Freebie tier: claim free daily. Advanced tier solid value for active gear upgraders.

**Total Mobilization** (Season 4+, paid only)
No freebie tier. Buy packs → Mobilization Coupons → exchange for limited items. VIP points bonus. Best for Season 4+ investors.

**Energy Loot Quest** (weekly)
Bonus badges for purchases across other hot deals. No extra cost — claim if already spending.

**Hero Growth Battle Pass** (~$6 / ~$24, 7 days)
Hero-focused. Universal legendary shards, exclusive weapon shards, skill medals, ore. Freebie tier: claim free daily. Advanced tier strong value.

**Drone Training Pass** (~$6 / ~$24, 7 days)
Drone Parts + Battle Data. Freebie tier: claim free daily. Best for players actively leveling drone.

**Bounty Hunter** (rolling release)
Uses Bullets + Jammers. Boss Zombie + Wandering Merchant. BEST F2P hot deal — meaningful rewards without spending.

### By Spend Tier
F2P: Claim all Freebie tiers daily. Bounty Hunter with free currency. Skip everything else.
Budget: Hero Growth Pass Advanced + Drone Pass Advanced + Special Training Pass Advanced (~$18 total) = best value stack.
Investor+: Glittering Market (Mythic Blueprints) is the priority. Then pass Supreme tiers.

### Timing Rule
Buy any diamond-containing packs DURING their matching Arms Race phase — diamond purchases score Arms Race points in any phase.

### BLACK MARKET — BUDDY RULE (DO NOT VIOLATE)
The Black Market is a LIMITED, SEASONAL store — it is NOT always available. It appeared in specific post-season windows and Armament items were only available through Season 4. After that it may not exist or may have different inventory.
- NEVER proactively recommend the Black Market or suggest players look there for specific items.
- NEVER say "check the Black Market for cores" or similar — it may be closed on the player's server.
- IF a player directly asks about the Black Market: acknowledge it exists as a seasonal/post-season feature, tell them to check if it is currently active on their server, and note that availability and inventory varies by server season phase.
- Treat the Black Market like a feature that may or may not be live — never assume it is open.
`;
}