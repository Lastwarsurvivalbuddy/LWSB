// lwtStoresData.ts
// Sources: lastwartutorial.com/stores/ + cpt-hedge.com/guides/stores (all store pages)
// Full rewrite — merges original strategic advice with cpt-hedge brick-cost pricing data
// All prices in BRICKS unless otherwise noted. 1 brick ≈ $0.001 USD.
// Currency conversion rates sourced from cpt-hedge.com

// ─────────────────────────────────────────────
// BRICK CONVERSION REFERENCE
// ─────────────────────────────────────────────
export const BRICK_CONVERSION_RATES = `
STORE CURRENCY → BRICKS CONVERSION RATES:
- Black Market Cash:     1 cash = 1 brick  (reduced rate: 0.625 bricks/cash via special packs)
- Glittering Coins:      1 coin = 10 bricks (reduced rate: 6.25 bricks/coin via special packs)
- Bounty Voucher:        1 voucher = 8.333 bricks
- Mobilization Coupons:  1 coupon = 50 bricks
- Diamonds:              ~1 diamond = 1 brick (earned via gameplay/packs, not purchased directly)
- Ammo (Bullseye Loot):  progression-based, cannot be purchased directly
- Courage Medal:         earned via Zombie Invasion gameplay, cannot be purchased
- Alliance Points:       earned via alliance activities, cannot be purchased
- Campaign Medals:       earned via Honorable Campaign, cannot be purchased
- Honor Points:          earned via war events, cannot be purchased

KEY RULE: Bricks are the universal comparison unit. When evaluating whether a store item
is worth buying, compare its brick cost per item against what you'd pay for the same item
in packs or other stores.
`;

// ─────────────────────────────────────────────
// BLACK MARKET STORE
// ─────────────────────────────────────────────
export const STORES_BLACK_MARKET = `
BLACK MARKET STORE:
Currency: Black Market Cash (1 cash = 1 brick; reduced rate packs: 0.625 bricks/cash)
Availability: Event-based (items marked "Event ∞ avail" are unlimited during active event)

REDUCED RATE NOTE: Buying the Daily Special/Premium/Rare/Luxury/Supreme Black Market Cash Packs
gives you cash at a better-than-standard rate. At reduced rate, all prices are 37.5% cheaper.
Always buy these daily packs first before spending in this store.

CURRENCY PACKS (daily, limited):
- Daily Special Pack: 800 cash for 500 bricks (1.6 bricks/cash — BAD vs standard, use reduced rate)
- Daily Supreme Pack: 10,000 cash × 3 for 10,000 bricks each

TOP VALUE ITEMS (reduced rate prices, per item):
- UR Hero Universal Shard: 60 bricks/shard ← BEST VALUE in this store
- Hero Exclusive Weapon Shard Choice Chest: 60 bricks
- Armament Core ×5: 150 bricks total / 30 bricks per core
- Bond Badge: 500 bricks
- Decoration Chest (UR): 600 bricks (reduced) / 1,000 bricks (standard)
- Gear Blueprint (UR): 600 bricks (reduced) / 4,000 bricks per copy (standard — skip standard)
- Overlord Skill Badge ×2,000: 100 bricks / 0.05 bricks per badge (best badge source)
- Skill Medal ×1,000: 100 bricks total / 0.1 bricks per medal

STANDARD RATE ITEMS (skip unless no reduced rate available):
- Skill Chip Choice Chest (UR): 4,000 bricks — very expensive, skip
- Gorilla Overlord Shard ×5: 400 bricks / 80 bricks per shard
- Gear Blueprint (UR) ×5: 4,000 bricks / 800 bricks per copy — skip at standard rate
- 1h Speed-up ×30: 800 bricks / 26.67 bricks per hour

STRATEGIC NOTES:
- Priority #1: Buy reduced rate currency packs daily — never skip
- Priority #2: UR Hero Universal Shards (60 bricks each — cheapest UR shard source)
- Priority #3: Armament Cores (30 bricks each at reduced rate)
- Skip: Speed-ups here (better value elsewhere), Skill Chip Choice Chests at standard rate
`;

// ─────────────────────────────────────────────
// TOTAL MOBILIZATION STORE
// ─────────────────────────────────────────────
export const STORES_TOTAL_MOBILIZATION = `
TOTAL MOBILIZATION:
Currency: Mobilization Coupons (1 coupon = 50 bricks — HIGH VALUE currency)
Availability: Event-based

CURRENCY PACKS (daily, limited):
- Daily Sale Pack: 10 coupons for 500 bricks (50 bricks/coupon — standard rate)
- Daily Supreme Pack: 200 coupons × 3 for 10,000 bricks each

STORE MILESTONES (spend coupons to unlock — free bonus rewards):
- 20 coupons spent: +20 Mobilization Coupons
- 80 coupons spent: +40 Mobilization Coupons
- 200 coupons spent: +100 Mobilization Coupons
- 600 coupons spent: +300 Mobilization Coupons
- 2,000 coupons spent: +10 Gear Blueprint (MR) ← milestone worth pushing for

TOP VALUE ITEMS (brick cost per item):
- UR Hero Universal Shard ×10: 500 bricks / 50 bricks per shard ← MUST BUY daily (Value-tagged)
- Hero Exclusive Weapon Shard Choice Chest: 100 bricks ← RESALE value (listed as Resale)
- Hero Choice Chest: 100 bricks ← RESALE value
- Gorilla Overlord Shard: 100 bricks ← RESALE value
- Lv 5 Drone Component Chest: 1,500 bricks (Event ×50 avail)
- Gear Blueprint (UR): 600 bricks (Event ×20 avail)
- Overlord Skill Badge ×150: 50 bricks total / 0.333 bricks per badge
- Skill Medal ×150: 50 bricks total / 0.333 bricks per medal

STRATEGIC NOTES:
- UR Hero Universal Shards are the clear #1 priority here — Value-tagged, 50 bricks/shard
- Resale items (Hero Choice Chest, EW Shard, Gorilla Shard) are cheap but limited to 800 avail
- Push spending milestones when active — Gear Blueprint (MR) at 2,000 coupons is worth it
- Resource Choice Chest (SSR): only 1 brick — essentially free filler, grab it
`;

// ─────────────────────────────────────────────
// GLITTERING MARKET
// ─────────────────────────────────────────────
export const STORES_GLITTERING_MARKET = `
GLITTERING MARKET:
Currency: Glittering Coins (1 coin = 10 bricks; reduced rate: 6.25 bricks/coin)
Availability: Event-based

REDUCED RATE NOTE: Daily Mega Sale Glitter Coin Pack is FREE (uses Diamonds, not Bricks).
Buy this every day without fail — it's 60 free coins daily.
Daily Value Pack: 80 coins for 500 bricks (6.25 bricks/coin — matches reduced rate).

CURRENCY PACKS (daily):
- Daily Mega Sale Pack: 60 coins — FREE (Diamonds currency, not Bricks) ← NEVER MISS
- Daily Value Pack: 80 coins for 500 bricks
- Daily Supreme Pack: 1,000 coins × 50 for 10,000 bricks each

STORE MILESTONES (spend coins to unlock):
- 100 coins: UR Hero Universal Shard ×10
- 400 coins: Decoration Chest (UR) ×1
- 1,000 coins: Lv 5 Drone Component Choice Chest ×1
- 4,000 coins: Drone Parts ×200
- 10,000 coins: Universal Decor Component ×1,000

TOP VALUE ITEMS (Offer-tagged items are daily limited, best rates):
- Hero Choice Chest (Offer, Daily ×1): 60 bricks per chest ← MUST BUY daily
- Dielectric Ceramic (Offer, Daily ×1): 40 bricks / 0.4 bricks per ceramic ← excellent
- Luxury Choice Chest (Offer, Daily ×1): 1,000 bricks (5 choices) ← situational
- Armament Core ×10: 400 bricks / 40 bricks per core (Event ×100 avail)
- Gear Blueprint (MR) — Rare Event ×10: 3,000 bricks / 300 bricks per copy
- Gear Blueprint (UR) ×1: 600 bricks (Event ×150 avail) ← great rate, buy all
- Dielectric Ceramic ×100: 600 bricks / 6 bricks per ceramic (Event ×200 avail)
- Valor Badge ×100: 500 bricks / 5 bricks per badge (Event ×200 avail)
- UR Hero Universal Shard: 100 bricks (Event ×300 avail)
- Dual Propeller Base (Rare decoration): 40,000 bricks ← cosmetic, endgame spenders only
- Tower of Victory (Rare): 1,000 bricks (×81 avail)

STANDARD RATE ITEMS (reduced rate = 37.5% cheaper — always buy currency packs first):
- Skill Chip Choice Chest (UR): 3,000 bricks standard / lower at reduced rate

STRATEGIC NOTES:
- Free daily coin pack is non-negotiable — 60 coins = up to 600 bricks of value, free
- Offer-tagged items reset daily — Hero Choice Chest (60 bricks) is cheapest hero chest in game
- Gear Blueprint (UR) at 600 bricks is excellent — buy all 150 available during events
- Skip: Armament Materials (0.01 bricks/item — not worth tracking), Skill Medals at standard rate
`;

// ─────────────────────────────────────────────
// BOUNTY HUNTER STORE
// ─────────────────────────────────────────────
export const STORES_BOUNTY_HUNTER = `
BOUNTY HUNTER STORE:
Currency: Bounty Voucher (1 voucher = 8.333 bricks)
Availability: Event-based (Bounty Hunter event)

FREE CURRENCY:
- Daily Free Bounty Bullet Pack: 10 bullets × 2 — FREE ← collect daily without fail
- Daily Mega Sale Bounty Bullet: 20 bullets × 4 — FREE (uses Diamonds) ← FREE, always buy

WANDERING MERCHANT (secondary vendor, appears during event):
- Small Pack: 120 vouchers for 1,000 bricks (8.33 bricks/voucher)
- Large Pack: 600 vouchers for 5,000 bricks (8.33 bricks/voucher)
Buy these if you need vouchers and the event is active.

STORE MILESTONES (spend vouchers to unlock):
- 300 vouchers: Luxury Choice Chest ×1
- 1,000 vouchers: Decoration Chest (UR) ×2
- 1,800 vouchers: Luxury Choice Chest ×3
- 3,000 vouchers: Decoration Chest (UR) ×4
- 5,000 vouchers: Luxury Choice Chest ×5

TOP VALUE ITEMS (brick cost per item):
- Lv 5 Drone Component Chest (Must Buy, Daily ×1): 666.67 bricks ← PRIORITY daily buy
- Bond Badge ×10 (Must Buy, Event ×5): 3,750 bricks / 375 bricks per badge ← PRIORITY
- Training Certificate ×10 (Offer, Event ×100): 166.67 bricks / 16.67 bricks per cert
- Drone Parts ×10 (Offer, Event ×200): 183.33 bricks / 18.33 bricks per part
- Lv 5 Drone Component Choice Chest (Offer, Event ×20): 1,833.33 bricks per chest
- UR Hero Universal Shard ×10 (Event ×50): 666.67 bricks / 66.67 bricks per shard
- Valor Badge ×10 (Event ×100): 416.67 bricks / 4.17 bricks per badge
- 1h Speed-up ×10 (Event ×50): 166.67 bricks / 16.67 per hour

STRATEGIC NOTES:
- Always collect free bullets — they add up to meaningful vouchers over event
- Lv 5 Drone Component Chest (daily Must Buy) is the #1 priority — 666 bricks for a Lv5 chest
- Bond Badges (Must Buy tag): expensive but Bond Badges are scarce — buy if you need them
- Training Certificates at 16.67 bricks each are excellent value — Offer avail is limited
- Skill Medal ×1,000: 125 bricks / 0.125 per medal — low priority, just filler
`;

// ─────────────────────────────────────────────
// BULLSEYE LOOT
// ─────────────────────────────────────────────
export const STORES_BULLSEYE_LOOT = `
BULLSEYE LOOT:
Currency: Ammo (cannot be purchased directly — earned through Bullseye Loot event gameplay)
Store Type: Progression/level-based — not a standard brick-purchasable store

HOW IT WORKS:
- Play Bullseye Loot event to earn Ammo
- Daily packs let you buy Ammo with Bricks (see below), but the store itself is level-gated
- Advancing levels unlocks milestone rewards — these are the real prizes

AMMO PACKS (daily, buy to progress faster):
- Daily Sale Ammo Pack: 10 ammo for 500 bricks (50 bricks/ammo)
- Daily Ammo Pack (R): 12 ammo for 1,000 bricks (83.3 bricks/ammo)
- Daily Ammo Pack (SR): 24 ammo for 2,000 bricks (83.3 bricks/ammo)
- Daily Ammo Pack (SSR): 60 ammo for 5,000 bricks (83.3 bricks/ammo)
- Daily Ammo Pack (UR): 120 ammo × 5 for 10,000 bricks each (83.3 bricks/ammo)

LEVEL MILESTONE REWARDS (free, unlocked by reaching level):
- Level 5: Upgrade Ore ×2,000
- Level 10: Upgrade Ore ×4,000
- Level 20: Upgrade Ore Lucky Chest ×8
- Level 30: Gear Boost Choice Chest ×5
- Level 40: Gear Boost Choice Chest ×5
- Level 60: Gear Boost Choice Chest ×10
- Level 80: Gear Boost Choice Chest ×10
- Level 100: Gear Blueprint (MR) ×10 ← MAJOR milestone

STRATEGIC NOTES:
- Push for Level 100 milestone — 10× MR Gear Blueprints is exceptional free value
- Daily Sale Ammo Pack (50 bricks/ammo) is far cheaper than other daily packs — buy it first
- Mid/late game: Gear Boost Choice Chests start at Level 30 — worth pushing to at least Level 40
- F2P players: use only free ammo from gameplay, save bricks
`;

// ─────────────────────────────────────────────
// MALL
// ─────────────────────────────────────────────
export const STORES_MALL = `
MALL:
Currency: Bricks (direct brick purchase — no intermediate currency)
Reset: Items reset Daily, Weekly, or have longer timers as noted

DAILY SALE — HERO/EW SHARDS (1 per hero per day):
Exclusive Weapon Shard bundles (per hero):
- 2x EW Shard: 100 bricks (50 bricks/shard)
- 3x EW Shard: 200 bricks (66.67 bricks/shard)
- 5x EW Shard: 400 bricks (80 bricks/shard)
- 10x EW Shard (Take All): 500 bricks (50 bricks/shard) ← BEST rate for EW Shards

UR Hero Universal Shard bundles (per hero):
- 2x Shards: 100 bricks (50 bricks/shard)
- 3x Shards: 200 bricks (66.67 bricks/shard)
- 5x Shards: 400 bricks (80 bricks/shard)
- 10x Shards (Take All): 500 bricks (50 bricks/shard) ← matches best rate

DAILY MUST-BUY PACKS (500 bricks each — always available):
- Overlord Training Pack: Training Certificate ×30 @ 16.67 bricks/cert ← excellent
- Daily Drone Skill Chip: Skill Chip Chest (SSR) ×1 @ 500 bricks ← situational
- Valor Badge Pack: 50 Valor Badges @ 10 bricks/badge ← good value
- Drone Parts Pack: 20 Drone Parts @ 25 bricks/part
- Universal Speed-up Pack: 5m Speed-up ×180 @ 2.78 bricks per 5m ← best speed buy in Mall
- Value Food/Iron/Coin Pack: Resource Chest (UR) ×8 @ 62.5 bricks/chest each

WEEKLY DEALS (reset weekly, limited quantity):
- Armament Research Special (×4): 5,000 bricks — 100 Armament Core @ 50 bricks/core + 180K Armament Materials @ 0.028 bricks/mat ← PRIORITY weekly buy
- Training Certificate Pack (×4): 5,000 bricks — 180 certs @ 27.78 bricks/cert + 30K Guidebooks
- Bond Badge Pack (×1): 5,000 bricks — 10 Bond Badges @ 500 bricks/badge
- Universal Overlord Shard Pack (×2): 5,000 bricks — 40 Universal Overlord Shards @ 125 bricks/shard
- Drone Component (×6): 5,000 bricks — 1 Lv5 Drone Component Choice Chest @ 5,000 bricks ← expensive but rare
- Weekly Drone Skill Chip (×10): 5,000 bricks — 1 Skill Chip Chest (UR) @ 5,000 bricks
- Universal EW Shard (×2): 10,000 bricks — 80 Universal EW Shards @ 125 bricks/shard ← endgame only
- Valor Badge (×5): 10,000 bricks — 1,000 Valor Badges @ 10 bricks/badge + 1,200 Research Speed-ups
- Oil Special Offer (×5): 2,000 bricks — 40×10K Oil @ 50 bricks per 10K oil

WEEKLY PASSES (×1 each, resets weekly):
- Take All Weekly Pass: 2,000 bricks — Armament Core ×84 + Drone Parts ×105 + Lv4 Drone Component ×7 + Hero EXP Chest (UR) ×2 + Coin Chest (UR) ×2 ← BEST weekly value, buy always
- Armament Core Weekly Pass (S4): 500 bricks — 84 cores @ 5.95 bricks/core ← EXCELLENT
- Drone Parts Weekly Pass (S1): 500 bricks — 105 parts @ 4.76 bricks/part ← EXCELLENT
- Drone Components Weekly Pass (S2): 500 bricks — 7 Lv4 Component Chests @ 71.43 bricks/chest
- EXP/Coin Weekly Passes: 500 bricks each — 2 UR chests @ 250 bricks/chest

PACK STORE (daily resets, 500 bricks each unless noted):
- Fast Growth Pack: 5m Speed-up ×60 + Resource Chests ×4
- Overlord Training Pack: Training Guidebook ×4,000 @ 0.125 bricks/guidebook ← bulk guidebooks
- Drone Parts Pack: 10 Drone Parts + 3 Battle Data 10K @ 50 bricks/part
- Drone Component Pack: 2 Lv3 Drone Component Chests @ 250 bricks/chest
- Hero Growth Pack: 5 Hero Tickets + 4 Hero EXP Chests (SR) + 750 Skill Medals
- Gear Progression Pack: 1,000 Upgrade Ore + 30 Synthetic Resin @ 0.5 bricks/ore
- Decoration Collection: 900 Universal Decor Components for 10,000 bricks @ 11.11 bricks/component
- Moonlight Pack (2-week reset): 10 UR Hero Universal Shards + 10 SSR Resource Chests + 1,000 Upgrade Ore @ 500 bricks ← excellent value

STRATEGIC NOTES:
Priority order for weekly Mall buys:
1. Take All Weekly Pass (2,000 bricks) — always buy, best overall value
2. Armament Core Weekly Pass / Drone Parts Weekly Pass (500 bricks each) — buy every week
3. Armament Research Special (5,000 bricks × 4) — Armament Core source if you need them
4. Daily EW Shard and UR Hero Shard (10x packs, 500 bricks) — buy for heroes you're building

F2P note: Focus on weekly passes (low brick cost, high value items). Skip cosmetic packs.
Investor note: The weekly passes alone are non-negotiable. Also buy Drone Component and Universal EW Shard weeklies at endgame.
`;

// ─────────────────────────────────────────────
// VIP STORE
// ─────────────────────────────────────────────
export const STORES_VIP = `
VIP SHOP:
Currency: Diamonds (~1 diamond ≈ 1 brick, earned through gameplay and pack purchases)
Reset: Weekly (limited quantities per item)

CRITICAL RULE: Buy VIP subscription FIRST before spending diamonds here.

ALL ITEMS (weekly, diamond prices):
- Food/Iron/Coin Chest (SR) ×100 each: 40 diamonds/chest
- Armament Materials ×5,000: 200 diamonds total / 0.04 diamonds per mat
- Armament Core ×5: 100 diamonds total / 20 diamonds per core
- Bond Badge: 3,000 diamonds
- Training Guidebook ×6,000: 1 diamond per guidebook
- Universal Decor Component ×50: 100 diamonds each
- Stamina (50) ×5: 60 diamonds each ← PRIORITY #1
- Superalloy ×100: 6 diamonds each
- Advanced Teleporter ×3: 600 diamonds each
- Drone Parts ×50: 400 diamonds each
- Skill Medal ×2,000: 4 diamonds each
- SR Hero Universal Shard ×50: 40 diamonds each
- Hero EXP Chest (SSR) ×50: 160 diamonds each
- 5m Speed-up ×200: 8 diamonds each
- Upgrade Ore ×1,500: 4 diamonds each
- Skill Chip Chest (SR) ×10: 800 diamonds each
- Synthetic Resin ×100: 16 diamonds each
- Survivor Recruitment Ticket ×50: 200 diamonds each
- Hero EXP Chest (UR) ×20: 480 diamonds each
- 1h Speed-up ×60: 72 diamonds each
- SSR Hero Universal Shard ×30: 200 diamonds each
- 4h Speed-up ×20: 192 diamonds each
- Dielectric Ceramic ×50: 64 diamonds each
- 8h Speed-up ×10: 480 diamonds each
- UR Hero Universal Shard ×10: 300 diamonds each ← PRIORITY #2

PRIORITY PURCHASE ORDER (weekly diamond spend):
1. Stamina (50) — 5×60 = 300 diamonds — stamina is always gated, always buy
2. UR Hero Universal Shard — 10×300 = 3,000 diamonds — best UR shard source using diamonds
3. 8h Speed-up — 10×480 = 4,800 diamonds
4. 4h Speed-up — 20×192 = 3,840 diamonds
5. 1h Speed-up — 60×72 = 4,320 diamonds
Estimated full priority weekly cost: ~16,260 diamonds

Bonus buy: SSR Hero Universal Shard if 6,000+ diamonds available after above.

SKIP: Resource Chests (SR tier), Upgrade Ore, Training Guidebooks — these are filler
`;

// ─────────────────────────────────────────────
// DIAMOND STORE
// ─────────────────────────────────────────────
export const STORES_DIAMOND = `
DIAMOND STORE:
Currency: Diamonds (unlimited availability — always open)
All items available in unlimited quantities, no reset needed.

ITEMS & DIAMOND PRICES:
- Hero Recruitment Ticket: 400 diamonds each
- Survivor Recruitment Ticket: 400 diamonds each
- 50k Iron: 50 diamonds
- 50k Food: 50 diamonds
- 18k Coins: 50 diamonds
- Trade Contract: 100 diamonds each
- Advanced Teleporter: 1,500 diamonds each
- Alliance Teleporter: 500 diamonds each

RECOMMENDATION: Do NOT buy anything here regularly.
- These are emergency/convenience purchases only
- Exception: Advanced Teleporter or Alliance Teleporter when sold out everywhere else
- Resource purchases (Iron/Food/Coins) are terrible value — never buy for routine use
- Hero Tickets at 400 diamonds each are overpriced vs. other sources
`;

// ─────────────────────────────────────────────
// ZOMBIE INVASION STORE
// ─────────────────────────────────────────────
export const STORES_ZOMBIE_INVASION = `
ZOMBIE INVASION STORE:
Currency: Courage Medals (earned through Zombie Invasion gameplay — cannot be purchased)
Availability: Event-based

ALL ITEMS (Courage Medal prices per item):
- 10K Oil ×10 avail: 500 medals each
- Armament Core ×30 avail: 80 medals each ← STRONG VALUE
- Universal Exclusive Weapon Shard ×10 avail: 120 medals each ← STRONG VALUE
- Hero Recruitment Ticket ×10 avail: 80 medals each
- Survivor Recruitment Ticket ×30 avail: 80 medals each
- Stamina (50) ×3 avail: 10 medals each ← MUST BUY, best medal rate
- Training Certificate ×20 avail: 50 medals each ← very good
- Overlord Supply Chest (SSR) ×30 avail: 100 medals each
- Overlord Skill Badge ×1,000 (×5 avail): 250 medals total / 0.25 per badge ← EXCELLENT
- Iron/Food Chest (SSR) ×50 avail each: 160 medals each
- Coin Chest (SSR) ×100 avail: 160 medals each
- Coin Chest (UR) ×20 avail: 480 medals each
- Valor Badge ×10 (×50 avail): 200 medals total / 20 per badge
- Drone Parts ×50 avail: 200 medals each
- Lv3 Drone Component Chest ×3 avail: 360 medals each
- Skill Chip Chest (SR) ×3 avail: 120 medals each
- Skill Chip Chest (SSR) ×1 avail: 400 medals ← one of cheapest SSR chip sources
- Research Speed-ups: 4–36 medals (good rates, buy freely)
- Synthetic Resin ×300: 8 medals each
- Upgrade Ore ×100 (×50 lots): 100 medals / 2 medals per ore ← decent bulk filler

PRIORITY PURCHASE ORDER:
1. Stamina (50) — 10 medals each, always buy all 3 available
2. Overlord Skill Badges — 0.25 medals per badge, buy all 5 lots
3. Training Certificates — 50 medals each, buy all 20 available
4. Armament Cores — 80 medals each, buy all 30 available
5. Universal EW Shards — 120 medals each, buy all 10 available
6. Speed-ups (Research/Construction) — cheap, fill remaining medals

SKIP: Upgrade Ore (2 medals per ore is OK but low priority), Resource Chests if medals are tight
`;

// ─────────────────────────────────────────────
// ALLIANCE STORE
// ─────────────────────────────────────────────
export const STORES_ALLIANCE = `
ALLIANCE STORE:
Currency: Alliance Points (earned from donating to Alliance Tech)
Reset: Store resets on a countdown visible at top of store — check before spending
DO NOT spend all contribution points — wait for rare items if current reset has nothing good

ALL ITEMS (Alliance Point prices, weekly availability):
- UR Hero Universal Shard ×5 (×5 avail): 3,000 AP each ← TOP PRIORITY
- Bond Badge (×1 avail): 3,000 AP ← TOP PRIORITY — only 1 per reset
- Universal Overlord Shard ×5 (×5 avail): 2,000 AP each ← HIGH PRIORITY
- Survivor Recruitment Ticket ×30 (×30 avail): 2,000 AP each
- Armament Materials ×2,000 (×10 avail): 1,000 AP / 0.5 AP per mat
- Hero Shards (Violet, Sarah, Scarlett, Mason) ×30 each: 1,000 AP each ← Season 1/2 priority
- Drone Parts (×30 avail): 1,000 AP each
- Lv1 Drone Component Chest (×20 avail): 1,000 AP each
- Skill Chip Chest (SR) ×5: 4,000 AP each
- Drone Combat Boost EXP Card ×5: 2,000 AP each
- 8h Shield (×7 avail): 7,500 AP each ← ALWAYS have at least 1×24h + 1×8h ready
- 12h Shield (×2 avail): 10,000 AP each
- 24h Shield (×3 avail): 20,000 AP each ← buy for Saturday wars
- Advanced Teleporter (×1 avail): 7,500 AP
- Alliance Teleporter (×3 avail): 2,500 AP each
- Random Teleporter (×3 avail): 2,500 AP each
- Dielectric Ceramic (×20 avail): 800 AP each
- Synthetic Resin (×70 avail): 200 AP each
- Superalloy (×100 avail): 50 AP each ← cheap bulk filler
- Resource Choice Chest (SSR) (×50 avail): 12,000 AP each ← VERY expensive, skip
- Speed-ups (1h/8h Construction/Training/Healing/Research): 900–6,000 AP range
- Transfer Ticket (×3 avail): 4,000 AP each
- Survivor's Token ×2,500: 1 AP each ← effectively free, grab them all

PRIORITY PURCHASE ORDER:
1. UR Hero Universal Shards — 3,000 AP each, buy all 5
2. Bond Badge — 3,000 AP, buy the 1 available every reset
3. Universal Overlord Shard — 2,000 AP each, buy all 5
4. Shields — 24h shields for Saturday wars; always maintain 1×24h + 1×8h minimum
5. During Season 1/2: Mason shards + Violet shards BEFORE UR upgrades
6. Speed-ups (bulk construction/research) if AP is excess after above

IMPORTANT RULES:
- Alliance Points are NOT lost if you leave an alliance — but you cannot spend them until you rejoin
- NEVER buy Resource Choice Chest (SSR) at 12,000 AP — massively overpriced
- NEVER buy Survivors, Superalloy for AP when better uses exist
`;

// ─────────────────────────────────────────────
// CAMPAIGN STORE
// ─────────────────────────────────────────────
export const STORES_CAMPAIGN = `
CAMPAIGN STORE:
Currency: Campaign Medals (earned via Honorable Campaign missions + Restricted Area Training)
Location: Alert Tower (previously under yellow helicopter)
Reset: Weekly (limited quantities per item)

ALL ITEMS (Campaign Medal prices):
- Campaign Chest (UR) ×10 avail: 200 medals each ← TOP VALUE (may contain 100 golden shards)
- Lv3 Drone Component Chest ×3 avail: 200 medals each
- UR Hero Universal Shard ×10 avail: 200 medals each ← excellent rate
- Training Certificate ×20 avail: 500 medals each
- Battle Data 100K ×25 avail: 2,000 medals each ← expensive, low priority
- Training Guidebook ×6,000: 1 medal each ← buy all, effectively free
- Overlord Skill Badge ×3,000: 1 medal each ← buy all, effectively free
- Universal Decor Component ×30: 200 medals each
- Basic Chip Material ×400 (×1 avail): 5,000 medals / 12.5 per mat
- Skill Chip Chest (SSR) ×1 avail: 10,000 medals ← expensive but SSR chips are scarce
- Universal EW Shard ×10 avail: 300 medals each ← strong value
- Skill Chip Chest (R) ×20 avail: 300 medals each
- Upgrade Ore ×1,000 (×10 lots): 300 medals / 0.3 per ore
- Drone Parts ×30 avail: 300 medals each
- Hero Recruitment Ticket ×30 avail: 300 medals each
- Hero EXP Chest (SSR) ×100 avail: 300 medals each
- Dielectric Ceramic ×200 avail: 300 medals each ← excellent bulk ceramics
- Battle Data 10K ×750: 1,000 medals each
- Resource Choice Chest (SSR) ×200 avail: 500 medals each
- 1h Speed-up ×200 avail: 500 medals each

PRIORITY PURCHASE ORDER:
1. Training Guidebook and Overlord Skill Badge — 1 medal each, buy every single one (free essentially)
2. Campaign Chest (UR) — 200 medals each — chance at 100 golden shards, best value per medal
3. UR Hero Universal Shard — 200 medals each (10 available)
4. Universal EW Shard — 300 medals each (10 available)
5. Dielectric Ceramic — 300 medals each (200 available) — best bulk ceramic source
6. HQ 30+ players: Resource Choice Chest (SSR) — each chest yields ~165M gold equivalent per week

SKIP: Battle Data 100K (2,000 medals each — far too expensive), Basic Chip Material unless you have excess medals, Skill Chip Chest (SSR) unless completely flush on medals
`;

// ─────────────────────────────────────────────
// HONOR STORE
// ─────────────────────────────────────────────
export const STORES_HONOR = `
HONOR STORE:
Currency: Honor Points (earned via war-related events — cannot be purchased)
Reset: Monthly (limited quantities per item)

ALL ITEMS (Honor Point prices):
- Gear Blueprint (MR) ×2 avail: 30,000 HP each
- Gear Blueprint (UR) ×50 avail: 10,000 HP each ← #1 PRIORITY — ONLY free UR Blueprint source
- Skill Chip Chest (UR) ×1 avail: 50,000 HP ← very expensive, situational
- Bond Badge ×20 avail: 12,000 HP each ← strong secondary priority
- Armament Core ×100 avail: 1,000 HP each ← excellent bulk cores
- Decoration Chest (UR) ×1 avail: 50,000 HP ← cosmetic, skip unless flush
- Universal Decor Component ×150 avail: 200 HP each
- UR Hero Universal Shard ×10 avail: 3,000 HP each
- Drone Parts ×100 avail: 800 HP each
- Universal EW Shard ×25 avail: 2,500 HP each
- Dielectric Ceramic ×100 avail: 800 HP each
- Resource Choice Chest (UR) ×100 avail: 4,000 HP each
- Hero Recruitment Ticket ×100 avail: 2,000 HP each
- Emote: Victory Fest / Let's Celebrate: 100,000 HP each ← cosmetic only, skip

PRIORITY PURCHASE ORDER:
1. Gear Blueprint (UR) — 10,000 HP each, buy all 50 available ← MANDATORY every month
   This is the ONLY reliable free-to-play source of UR Gear Blueprints in the game
   You will need hundreds to fully upgrade gear — never skip this monthly
2. Bond Badge — 12,000 HP each (×20 avail) ← buy after Gear Blueprints
3. Armament Core — 1,000 HP each (×100 avail) ← strong value, buy all remaining budget
4. Universal EW Shard — 2,500 HP each (×25 avail) — endgame priority
5. UR Hero Universal Shard — 3,000 HP each (×10 avail) — situational

CRITICAL RULE: Do NOT spend Honor Points on anything else until you've maxed Gear Blueprint (UR)
purchases for the month. Monthly limit: 50 UR Blueprints. Never miss this reset.

SKIP: Emotes (100,000 HP — completely wasteful), Decoration Chest (50,000 HP), Skill Chip Chest (50,000 HP unless you have massive surplus Honor Points)
`;

// ─────────────────────────────────────────────
// ALLIANCE DONATION RULES
// ─────────────────────────────────────────────
export const STORES_DONATION_RULES = `
ALLIANCE TECH DONATION RULES (how to earn Alliance Contribution Points):
- Donating to RECOMMENDED tech: +20% bonus → 60 EXP + 60 Alliance Contribution Points per donation
- Donating to non-recommended tech: 50 EXP + 50 Alliance Contribution Points

Critical hit chances per donation:
- No crit: 45%
- 2x crit (extra 50 Alliance Tech EXP): 30%
- 3x crit (extra 100 Alliance Tech EXP): 15%
- 5x crit (extra 200 Alliance Tech EXP): 10%

Coin donation cap: 30 donations/day. Regenerates at 1 opportunity per 20 minutes when below 30.
Diamond donations: unlimited, cost increases per donation (starts 2 diamonds, +2 per donation, max 50 diamonds). Cost decreases gradually after 20 minutes.

RULE: Always use coins for donations — never diamonds unless absolutely necessary.
`;

// ─────────────────────────────────────────────
// SEASON STORE
// ─────────────────────────────────────────────
export const STORES_SEASON = `
SEASON STORE:
Only available after Season 1 (The Crimson Plague) begins.
Contains season-specific items tied to current season progression.
Check store contents when entering each new season — items vary by season.
`;

// ─────────────────────────────────────────────
// CROSS-STORE ITEM COMPARISON (key items)
// ─────────────────────────────────────────────
export const STORES_CROSS_COMPARISON = `
BEST SOURCES BY ITEM TYPE (lowest effective brick cost):

UR HERO UNIVERSAL SHARD:
- Glittering Market (Offer, daily ×1): 240 bricks ← cheapest daily
- Total Mobilization (Value-tagged): 50 bricks/shard ← CHEAPEST when event active
- Black Market (reduced rate): 60 bricks/shard
- Mall (Take All 10x pack): 50 bricks/shard
- VIP Store: 300 diamonds/shard
- Alliance Store: 3,000 AP/shard (use only after UR and Bond Badge purchased)

ARMAMENT CORE:
- Mall weekly pass: ~5.95 bricks/core (Armament Core Weekly Pass) ← CHEAPEST
- Mall Armament Research Special: 50 bricks/core
- Zombie Invasion: 80 medals/core (cannot directly compare to bricks)
- Honor Store: 1,000 HP/core (use after Gear Blueprints purchased)

GEAR BLUEPRINT (UR):
- Honor Store: ONLY free-to-play source — 10,000 HP/copy, buy all 50 monthly
- Glittering Market: 600 bricks (reduced rate) or buy at event
- Black Market: 600 bricks (reduced rate) or 4,000 bricks (standard — avoid)
- Total Mobilization: 600 bricks (Event ×20 avail)

BOND BADGE:
- Black Market: 500 bricks (reduced rate) ← cheapest brick source
- Bounty Hunter: 375 bricks/badge (Must Buy, Event ×5) ← CHEAPEST when available
- Alliance Store: 3,000 AP ← buy monthly
- Honor Store: 12,000 HP ← secondary honor spend
- VIP Store: 3,000 diamonds

LV 5 DRONE COMPONENT CHEST:
- Bounty Hunter (Must Buy, daily ×1): 666.67 bricks ← buy daily
- Glittering Market milestone: 1,000 coins (free milestone reward)
- Mall weekly: 5,000 bricks (very expensive — only if you need it urgently)

DRONE PARTS:
- Mall Drone Parts Weekly Pass: 4.76 bricks/part ← CHEAPEST
- Zombie Invasion: 200 medals/part (event currency)
- Bounty Hunter (Offer): 18.33 bricks/part
- Alliance Store: 1,000 AP/part

TRAINING CERTIFICATE:
- Bounty Hunter (Offer): 16.67 bricks/cert ← cheapest brick source
- Zombie Invasion: 50 medals/cert
- Campaign Store: 500 medals/cert (weekly reset)
- Mall: 16.67 bricks/cert (Overlord Training daily pack)

SPEED-UPS:
- Mall Universal Speed-up Pack: 2.78 bricks per 5m ← cheapest mall source
- VIP Store: 8 diamonds per 5m speed-up (weekly)
- Never buy speed-ups in Black Market at standard rate

OVERLORD SKILL BADGE:
- Black Market (reduced rate): 0.05 bricks/badge ← CHEAPEST by far
- Campaign Store: 1 medal/badge (effectively free — buy all)
- Zombie Invasion: 0.25 medals/badge (buy all)
`;

// ─────────────────────────────────────────────
// SPEND TIER GUIDANCE
// ─────────────────────────────────────────────
export const STORES_SPEND_TIER_GUIDANCE = `
STORE STRATEGY BY SPEND TIER:

F2P / FREE PLAYERS:
- Focus exclusively on stores that use earned (non-brick) currencies
- Alliance Store: UR Shards, Bond Badge, Universal Overlord Shard, Shields — every reset
- Honor Store: Gear Blueprint (UR) — buy all 50 every single month, no exceptions
- Campaign Store: Training Guidebooks + Overlord Badges (1 medal each = free), UR Shards
- Zombie Invasion: Stamina, Overlord Badges, Training Certificates, Armament Cores
- VIP Store: Stamina first if you have diamonds from gameplay
- Never spend bricks on currency packs unless you have excess from events

BUDGET SPENDERS ($10–50/month):
- All F2P priorities above, plus:
- Mall: Take All Weekly Pass (2,000 bricks) — non-negotiable weekly buy
- Mall: Armament Core + Drone Parts Weekly Passes (500 bricks each)
- Glittering Market: Daily free coin pack (FREE — never miss), Offer items
- Black Market: Collect reduced rate currency packs daily; buy UR Hero Shards + Armament Cores

MODERATE SPENDERS ($50–200/month):
- All budget priorities above, plus:
- Mall: Full weekly deal rotation (Armament Research Special, Training Certificate Pack)
- Bounty Hunter: Lv5 Drone Component (daily Must Buy), Bond Badges
- Glittering Market: Gear Blueprint (UR) at 600 bricks — buy all available during events
- Total Mobilization: UR Shards (50 bricks/shard), Gear Blueprints when event active

INVESTOR / HIGH SPENDERS ($200+/month):
- All moderate priorities above, plus:
- Mall: Universal EW Shard weekly (10,000 bricks × 2), Drone Component weekly
- Glittering Market: Push all milestone rewards, buy rare decorations if desired
- Black Market: Full reduced rate + top standard rate items (Skill Chip Choice Chests)
- Total Mobilization: Push all spending milestones including 2,000 coupon Gear Blueprint (MR) reward
`;

// ─────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────
export function getStoresDataSummary(): string {
  return `
=== STORES GUIDE ===

${BRICK_CONVERSION_RATES}

${STORES_BLACK_MARKET}

${STORES_TOTAL_MOBILIZATION}

${STORES_GLITTERING_MARKET}

${STORES_BOUNTY_HUNTER}

${STORES_BULLSEYE_LOOT}

${STORES_MALL}

${STORES_VIP}

${STORES_DIAMOND}

${STORES_ZOMBIE_INVASION}

${STORES_ALLIANCE}

${STORES_CAMPAIGN}

${STORES_HONOR}

${STORES_SEASON}

${STORES_DONATION_RULES}

${STORES_CROSS_COMPARISON}

${STORES_SPEND_TIER_GUIDANCE}
`;
}