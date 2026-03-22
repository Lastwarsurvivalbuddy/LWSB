// lwtWarzoneDuelData.ts
// Sources: lastwartutorial.com/warzone-duel/, lastwarhandbook.com/guides/warzone-duel-server-war-guide
// Warzone Duel (server war): competition rules, stages, points, rewards, tactics

export const WARZONE_DUEL_OVERVIEW = `
WARZONE DUEL (SERVER WAR) — OVERVIEW:
- 1v1 challenge between entire warzones (servers)
- Victory = capturing the rival warzone's Capitol and pushing occupation to 100%
- Competition runs 2–3 weeks with 4–8 warzones in a bracket
- Winners face winners, losers face losers until one champion warzone remains
- Huge rewards for participants: speedups, resources, diamonds from diamond mines in conquered server
- The strongest servers aren't those with the biggest spenders — they're the ones with the best organization

BRACKET FORMATS:
- 4-Server Bracket: 4 warzones · 2 weeks · single elimination tournament
- 8-Server Bracket: 8 warzones · 3 weeks · 1v1 matchups to crown one champion

WEEKLY SCHEDULE:
- Monday–Friday: Invasion Right Contest Phase (points race — determines attacker vs defender)
- Saturday: Capitol War — invading warzone attacks defender's Capitol
- ⚠️ Saturday overlap: Warzone Duel Capitol War AND normal Alliance Duel VS Day 6 both run on Saturday

ATTACKER vs DEFENDER:
- Warzone with MORE points at end of Friday = INVADER (attacks enemy Capitol Saturday)
- Warzone with FEWER points = DEFENDER (protects their own Capitol Saturday)
- Attacker advantage: initiative, can choose timing, psychological pressure on defenders
- Defender advantage: home territory familiarity, can pre-position 1–2 days early, shorter reinforcement march times

VICTORY CONDITION:
- Attackers must push Capitol occupation to exactly 100% before time expires
- If time expires without 100% occupation: DEFENDER wins by default
- Critical: partial occupation does not count — only 100% is a win for attackers
`;

export const WARZONE_DUEL_POINTS = `
WARZONE DUEL — INVASION RIGHT CONTEST POINTS (Mon–Fri):

| Action | Points | Notes |
|--------|--------|-------|
| Warzone Total Damage Victory (Wanted Boss) | 250,000 | Highest single source |
| Apex Arena 1st Place | 100,000 | Once per week if your server wins |
| Wanted Boss 1st Place (Individual) | 50,000 | Up to 5× per week (5 Wanted Boss events) |
| Desert Storm Victory | 50,000 | Per alliance win; up to 20 alliances × 50k = 1M possible |
| Alliance Duel Victory | 30,000 | Per alliance per day; multiplied by all winning alliances |
| Arms Race 1st Place | 10,000 | Per 1st place finish |
| Alliance Duel MVP | 6,000 | Per MVP from your server; multiplied by number of MVPs |
| Plunder hostile warzone truck | 100 | Up to 4×/day per player × 5 days — massive at scale |

TRUCK PLUNDERING (highest volume source):
- Each player can plunder enemy warzone trucks 4 times per day
- 10,000 active players × 4 plunders × 5 days × 100 pts = 20,000,000 points for the server
- ⚠️ NEVER plunder your OWN server's trucks — hurts your own alliance growth
- Always plunder ENEMY server trucks only

KEY INSIGHT: Desert Storm victories and truck plundering are the two highest-leverage server-wide contributions.

MAXIMIZING PREPARATION POINTS (individual):
- Complete all Alliance Duel daily tasks
- Participate in Arms Race phases
- Do NOT waste points during server reset (5-minute dead zone)
- Save resources for optimal point days
`;

export const WARZONE_DUEL_BATTLEFIELD = `
WARZONE DUEL — CAPITOL WAR BATTLEFIELD LAYOUT:

MAP STRUCTURE:
  [N CANNON]
       |
[W CANNON] --- [CAPITOL] --- [E CANNON]
       |
  [S CANNON]

All buildings surrounded by the CONTAMINATED ZONE

CONTAMINATED ZONE RULES (critical):
- NO SHIELDS — shields cannot be activated inside the contaminated zone
- SLOW MOVEMENT — march speed dramatically reduced
- NO RADAR — cannot use radar for scouting
- FULL COMMITMENT — once inside, you are in the fight
- ASH/MUD PILES — dead troops leave obstacles that slow enemy movement

CAPITOL MECHANICS:
- Attackers must occupy and push progress to 100%
- Progress increases while attackers hold it with troops
- Garrison troops inside to slow enemy progress
- Multiple alliances can reinforce simultaneously
- Building leader sees all incoming attacks and reinforcements

CANNON MECHANICS:
- 4 cannons surround the Capitol (North, South, East, West)
- Once captured, cannons automatically fire at the enemy Capitol
- Cannon fire kills garrisoned units inside the Capitol
- If your side holds the Capitol, cannon fire accelerates your capture speed
- Cannons can be recaptured if lost
- Cannon rush is PRIORITY #1 — capture cannons before the Capitol itself
- Recommended: hit 2 opposite cannons simultaneously (N+S or E+W) to create crossfire

CANNON RUSH SEQUENCE:
1. Split forces — assign teams to each cannon before battle
2. Simultaneous attack — hit 2–4 cannons at the same time
3. Burn squad first — smaller alliances soften defenders
4. Main rally follows — capture before reinforcements arrive
5. Hold immediately — station defenders the moment you capture
`;

export const WARZONE_DUEL_WAR = `
WARZONE DUEL — CAPITOL WAR (SATURDAY):

- Starts at 15:00 server time on Saturday
- Invading warzone players teleport to defender's warzone
- Goal: capture all 4 cannons then push Capitol to 100% occupation

IMPORTANT RULES:
- Commanders from the SAME warzone are allies — no friendly fire on neutral buildings
- Internal server conflicts do NOT carry over to the Capitol War map
- Burning down (destroying) a hostile base = 50,000 individual points — massive point source
- Many enemy players relocate to mud area without defenses set — easy zero targets for any power level
- NO SHIELDS in the contaminated zone — full commitment required

BURN SQUAD STRATEGY (critical for smaller alliances):
Before the main assault hits a cannon or the Capitol, smaller alliances launch softening attacks:
  Wave 1 (2-3 min before main rally): Smaller alliances send 5 attacks — deplete 30–50% of garrison
  Wave 2 (main): Top alliance main rally lands on weakened garrison — capture with fewer losses
Without burn squad: main rally hits full garrison, heavy losses, possible fail
With burn squad: main rally hits depleted garrison, higher capture success rate

DOUBLE/TRIPLE RALLY TECHNIQUE:
- Rally Leader A launches, Rally Leader B launches 10–15 seconds after
- Both coordinate march time so Rally A lands first, Rally B arrives seconds later
- Result: garrison depleted then eliminated, building captured cleanly

CAPITOL WAVE SEQUENCE:
  T-3 min: Burn squads soften Capitol garrison (deplete 40–50%)
  T-0: Main rally #1 lands — heavy damage
  T+15 sec: Main rally #2 finishes garrison
  T+1 min: Reinforcement wave holds position
  T+5 min: Fresh troops relieve tired squads

REWARDS FOR PARTICIPANTS:
- Warzone Winning Streak Rewards: for players on winning server with 50,000+ individual points minimum
- Winning streak multipliers: 1 win = 1.0x · 2 wins = 1.25x · 3+ wins = higher multipliers
- 9 Capitol Reward Chests with escalating loot (starts ~5,000 points, top tier ~200,000+ points)
- Diamond mines spawn in conquered server after Capitol is taken — all winning server players can collect
- 200 Valor Badges for winning alliance + milestone bonuses — critical for Alliance Duel research

HONOR POINTS (earned by battling in contaminated zone):
- Inflicting damage on enemy units
- Casualties sustained in battle
- Building capture participation
- Capitol Reinforcement Rotation: reinforce Capitol → stay 30 min → recall → claim honor points → rotate
`;

export const WARZONE_DUEL_HONOR_SHOP = `
WARZONE DUEL — HONOR SHOP (spend Honor Points earned in contaminated zone):

| Item | Honor Points Cost |
|------|------------------|
| Legendary Decoration Chest | 50,000 |
| Legendary Hero Universal Shard | 3,000 |
| Legendary Recruitment Ticket | 2,000 |
| Dielectric Ceramic | 800 |

HONOR POINTS STRATEGY:
- Legendary Decoration Chests are the highest long-term value item
- Universal Legendary Hero Shards are the most immediately useful for hero progression
- Dielectric Ceramic is essential for gear star promotion
- Honor Points are a shared currency across PvP events (Desert Storm also awards Honor Points)
`;

export const WARZONE_DUEL_TIPS = `
WARZONE DUEL — TIPS FOR PLAYERS:

DURING INVASION RIGHT CONTEST (Mon–Fri):
- Plunder enemy server trucks EVERY DAY — 4 times per day per player — biggest personal contribution
- Win your Alliance Duel VS daily (30,000 pts per alliance win)
- Participate in Desert Storm and win (50,000 pts per win)
- Try to win Arms Race (10,000 pts)
- Go for Wanted Boss 1st place if you can (50,000 pts each, 5 events/week)

ATTACKER PREPARATION (Wednesday–Friday before Saturday):
- Heal ALL troops — empty hospitals completely
- Fill Drill Ground to maximum — collect during battle for instant replacement
- Queue training in barracks but DON'T collect yet — emergency reserves
- Stock 2–3 teleports minimum including paid teleports
- Prepare 50+ hours healing speedups — you'll need them
- Coordinate with server: know your role before Saturday
- Shield your base to protect from counter-raids

DURING CAPITOL WAR (Saturday — ATTACKER):
- Teleport via Warzone Duel icon → Match Info → Grouping button → select server
- CANNON RUSH FIRST — do not attack Capitol directly until cannons are secured
- Burn squads launch 2–3 minutes before main rally
- Target players in mud area (often no defense set) — easy burns for 50k points each
- Coordinate with server alliance leaders for organized pushes
- Remember: Saturday also has normal Alliance Duel VS Day 6 — manage troops accordingly

DURING CAPITOL WAR (Saturday — DEFENDER):
- Pre-position at Capitol and cannons by THURSDAY–FRIDAY — this is critical
- Top alliances move to Capitol perimeter Thursday
- Secondary alliances position at cannons Thursday–Friday
- Verify shield status if staying outside contaminated zone
- Set wall order: strongest squad in slot 1 (absorbs first push)
- Counterattack lost cannons — recapture before they stack fire
- Outer ring intercept team: 3–5 players designated to teleport to undefended cannons

AFTER WINNING CAPITOL WAR:
- President receives Conqueror Bonus (~7 days) — extra ministry roles unlock:
  · Military Commander: +5% March Speed, +5% Enemy Casualty Rate
  · Administrative Commander: +60% Construction AND +60% Research Speed (best progression buff)
- Diamond mines appear in conquered server — go collect them

WAR FEVER (useful free buff):
- Activate by initiating an attack or rally against an enemy base
- Lasts 15 minutes, refreshable by re-initiating
- Provides a small flat attack buff — does NOT increase morale, does NOT stack
- ⚠️ Activating War Fever removes any active shield — use before shielding, not after

TROOP STAGING STRATEGY:
- Drill Ground: fill with max troops — collect during battle as instant replacement
- Barracks: queue training but don't collect — emergency reserves
- Hospital: heal all wounded but don't retrieve — pull when needed
- Execute: as you lose troops in battle, collect from each location in sequence
`;

export const WARZONE_DUEL_COMMON_MISTAKES = `
WARZONE DUEL — COMMON MISTAKES TO AVOID:

PREPARATION MISTAKES:
- ❌ Ignoring weekly Invasion Right Contest points (Mon–Fri) — lose attacker advantage
- ❌ Not coordinating with server before Saturday — chaos on Capitol War day
- ❌ Arriving Saturday unprepared — can't contribute meaningfully
- ❌ Not stocking healing speedups and teleports — run out mid-battle

ATTACKER MISTAKES:
- ❌ Rushing Capitol directly without capturing cannons first — heavy losses, possible fail
- ❌ Weakest squad in wall slot 1 — defense crumbles against first push
- ❌ Entering contaminated zone without plan — no retreat once committed
- ❌ Panic teleporting away from prime position — losing position costs more than troops
- ❌ Fighting enemies instead of capturing buildings — kills score points but buildings win wars
- ❌ No communication — uncoordinated attacks fail even with power advantage
- ❌ Smaller alliances sitting out — 30% of server contributing nothing

DEFENDER MISTAKES:
- ❌ Positioning late (arriving Saturday) — no defensive formation possible
- ❌ All forces at Capitol while cannons fall — losing cannons accelerates defeat
- ❌ Not rotating defenders — troop fatigue, garrison gets wiped
- ❌ Ignoring burn squad softening — main rally hits full garrison
`;

export function getWarzoneDuelDataSummary(): string {
  return `
=== WARZONE DUEL (SERVER WAR) ===
${WARZONE_DUEL_OVERVIEW}

${WARZONE_DUEL_POINTS}

${WARZONE_DUEL_BATTLEFIELD}

${WARZONE_DUEL_WAR}

${WARZONE_DUEL_HONOR_SHOP}

${WARZONE_DUEL_TIPS}

${WARZONE_DUEL_COMMON_MISTAKES}
`;
}