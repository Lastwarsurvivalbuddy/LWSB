// lwtCapitolData.ts
// Sources: lastwartutorial.com/the-capitol/, lastwarhandbook.com/guides/capitol-conquest-guide
// Capitol conquest, ministries (hats), boosts, how to request and assign titles
// Updated: March 24, 2026 (session 64) — confirmed position buffs + application rules from in-game screenshots

export const CAPITOL_OVERVIEW = `
THE CAPITOL — OVERVIEW:
- The alliance that captures the Capitol gains the right to appoint the President
- President appoints Vice President (VP) and all Ministries
- Ministries (called "hats" in-game) give massive buffs to whoever holds them
- During Warzone Duel: if your server wins as attacker, President receives Conqueror Bonus (lasts ~7 days)
- Conqueror Bonus unlocks 2 extra roles: Military Commander and Administrative Commander

VICTORY CONDITIONS (Capitol Conquest):
- Immediate Victory: first alliance to accumulate 4 hours of total occupation time wins immediately
- Time Expiration Victory: if no alliance reaches 4 hours before the event ends, the alliance with the longest total occupation time wins

PARTICIPATION REQUIREMENTS:
- Your alliance must control land directly connected to the Capitol (waived during Pre-Season and End-of-Season)
- Alliance must have captured a Level 6 City minimum
- Individual: HQ Level 16 or higher required to hold any government position

ELIGIBILITY RULES:
- Minimum HQ level 16 to apply for any position
- Can only hold ONE position at a time
- 30-minute cooldown between position applications
- Each position accepts max 50 applications; applications expire after 24 hours if not approved
- Auto-appointment list: max 50 commanders; each appointment interval is exactly 4 minutes 40 seconds
- VP can appoint 1 official directly (in addition to queue management)
- When Capitol Conquest starts: all applications are wiped — reapply after new President takes office
`;

export const CAPITOL_MINISTRIES = `
CAPITOL MINISTRIES — FULL BUFF REFERENCE:

PRESIDENT (alliance that captured Capitol):
  Normal: Hero HP +5% · Hero Attack +5% · Hero Defense +5% (auto-applies on appointment)
  Conqueror Bonus: same + Enemy Unit Casualty Rate +5%

VICE PRESIDENT (appointed by President):
  Normal: Construction Speed +20% · Research Speed +20% · Training Speed +10% · Can appoint 1 official
  Conqueror Bonus: Construction +25% · Research +25% · Training +12.5%

SECRETARY OF DEVELOPMENT:
  Normal: Construction Speed +50% · Research Speed +25%
  Conqueror Bonus: Construction +60% · Research +30%

SECRETARY OF SCIENCE:
  Normal: Research Speed +50% · Construction Speed +25%
  Conqueror Bonus: Research +60% · Construction +30%

SECRETARY OF INTERIOR:
  Normal: Food Output +100% · Iron Output +100% · Coin Production +100%
  Conqueror Bonus: All resource outputs +150%
  ⚠️ IMPORTANT: This buff multiplies BASE PRODUCTION only — does NOT affect world map gathering.
  Strategy: wait until your mines/fields are FULL, THEN get the hat, THEN collect immediately.
  The boost only applies at moment of collection — not retroactively.

SECRETARY OF STRATEGY:
  Normal: Hospital Capacity +20% · Unit Healing Rate +20%
  Conqueror Bonus: Hospital Capacity +25% · Unit Healing Rate +25%

SECRETARY OF DEFENSE:
  Normal: Unit Training Cap +20% · Training Speed +20%
  Conqueror Bonus: Unit Training Cap +25% · Training Speed +25%

MILITARY COMMANDER (Conqueror Bonus only):
  March Speed +5% · Enemy Unit Casualty Rate +5%

ADMINISTRATIVE COMMANDER (Conqueror Bonus only — best progression buff in game):
  Construction Speed +60% · Research Speed +60%
  Note: This is the single highest construction + research buff available anywhere in the game.
  Priority #1 when your server has Conqueror Bonus active.
`;

export const CAPITOL_SPEED_MATH = `
CAPITOL — HOW SPEED BUFFS ACTUALLY WORK:

Speed buffs do NOT reduce time by the percentage shown. They increase your speed, which reduces time less than expected.

Example: Secretary of Development gives +50% construction speed
- Base: 1 block/min → 100 blocks = 100 min
- With +50% speed: 1.5 blocks/min → 100/1.5 = 66.7 min (33% time reduction, not 50%)

The more existing buffs you already have, the LESS effective each new hat is:
- If you already have 100% construction speed (2 blocks/min) and add the +50% hat (2.5 blocks/min):
- Time reduction is only 100/2 → 100/2.5 = 20% (not 33%)

GOLDEN RULE — CRITICAL:
Speed hats only affect operations you START while holding the hat.
- Ongoing constructions, researches, trainings, healings are NOT affected retroactively
- Once you start an operation with the hat active, the time is locked in — hat can then be removed
- ALWAYS start the upgrade/research BEFORE your hat expires, not while waiting for it

ARMS RACE ALIGNMENT TIP:
Stack government speed hats with matching Arms Race phases for maximum ROI:
- Construction hat + City Building Arms Race phase = points + speed simultaneously
- Research hat + Tech Research Arms Race phase = points + speed simultaneously
- Training hat + Unit Progression Arms Race phase = points + speed simultaneously
This doubles the value of every hat session during aligned windows.
`;

export const CAPITOL_HOW_TO_REQUEST = `
CAPITOL — HOW TO REQUEST A HAT:

1. Find the VP (Vice President): go to Capitol → Management → Title Assignment → see current VP
2. Click the VP's avatar → Chat → send private message requesting the hat
   Example: "I would like the Secretary of Development hat please"
3. Share your map coordinates: go to your base → map mode → click your base → Share button → share with VP
4. VP will add you to the queue and notify you when it's your turn
5. Hat duration: 4 minutes 40 seconds per appointment slot (VP rotates through the queue)
6. You'll know you have the hat when:
   - VP sends you a message confirming
   - Hat symbol appears above your base on map
   - Hat symbol appears next to your username in chat
   - Announcement banner appears on map
   - You receive a mail with the assignment

WHAT TO DO WHEN YOU GET THE HAT:
- Speed hats (Development, Science, Defense, VP): immediately START a construction, research, or training
  The reduced time is locked in the moment you start — you can then release the hat for the next person
- Interior hat: must collect resources WHILE holding the hat — wait for mines to be FULL before your turn
  Interior boosts BASE PRODUCTION ONLY — not world map gathering tiles
- Strategy hat: hospital capacity and heal rate apply automatically

EXTENDED HOLD (advanced):
- For major upgrades (HQ 25+, late-game research) ask the VP for an Extended Hold
- Many alliances allow longer appointments for high-value progression milestones
- Coordinate in advance — don't spring it on the VP at your turn

SHIELD RULES DURING CAPITOL:
- You do NOT lose your shield by reinforcing the Capitol garrison
- You MUST drop your shield to launch an initial attack on the Capitol
- Plan shield timing accordingly if you are both defending your base and participating in Capitol conquest

AUTO-APPOINTMENT QUEUE STRATEGY:
- Always have an application pending — dead time in queues = wasted opportunity
- If not on cooldown, you should be in a queue for a hat
- Each appointment interval is exactly 4 minutes 40 seconds — plan your upgrade queue accordingly
- Principle: maximize hat (especially Administrative Commander during Conqueror window) around your longest pending upgrades
`;

export function getCapitolDataSummary(): string {
  return `
=== THE CAPITOL & MINISTRIES ===

${CAPITOL_OVERVIEW}

${CAPITOL_MINISTRIES}

${CAPITOL_SPEED_MATH}

${CAPITOL_HOW_TO_REQUEST}
`;
}