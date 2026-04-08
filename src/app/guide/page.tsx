'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
type UserContext = 'day1' | 'week1' | 'established' | 'lost' | null;
type SpendStyle = 'f2p' | 'low' | 'mid' | null;
type ActiveTab = 'checklist' | 'avoid' | 'weekly' | 'heroes' | 'glossary';
type AuthTier = 'loading' | 'guest' | 'free' | 'pro' | 'elite' | 'founding' | 'alliance';

interface CheckItem {
  text: string;
  tag: 'daily' | 'once';
}

interface HeroItem {
  name: string;
  role: string;
  tip: string;
  priority: boolean;
}

interface WeekDay {
  day: string;
  label: string;
  highlight: boolean;
  items: string[];
  note: string;
}

// ─────────────────────────────────────────────────────────────
// CHECKLIST DATA
// ─────────────────────────────────────────────────────────────
const checklistData: Record<string, CheckItem[]> = {
  day1: [
    { text: 'Join an alliance — everything important in this game happens inside one', tag: 'once' },
    { text: 'Get a second builder — best early spend, doubles your build speed immediately', tag: 'once' },
    { text: 'Set Squad 1 to Tank type and focus it exclusively — do not split resources', tag: 'once' },
    { text: 'Unlock VIP with diamonds (top-left of main base screen)', tag: 'once' },
    { text: 'Hit Code Boss for daily rewards — switch hero types per day to match the boss type', tag: 'daily' },
    { text: 'Send all squads out mining — gather resources constantly', tag: 'daily' },
    { text: 'Do 20 rallies and join 20 rallies — put Monica in your squad for the RSS buff', tag: 'daily' },
    { text: 'Scout for ATMs — abandoned bases with no alliance tag sitting on full resources', tag: 'daily' },
  ],
  week1: [
    { text: 'Join an active, communicating alliance — passive ones waste your time', tag: 'once' },
    { text: 'Stack Squad 1 with 3+ same troop type to activate the power buff', tag: 'once' },
    { text: 'Invest tech research into the Alliance Duel tree — helps you hit boxes each day', tag: 'once' },
    { text: 'Hit Code Boss daily and switch hero types to match which deals bonus damage that day', tag: 'daily' },
    { text: 'Do Honourable Campaign every other day (Sunday / Tuesday / Thursday)', tag: 'daily' },
    { text: '20 rallies + join 20 per day, Monica always in squad for the RSS buff', tag: 'daily' },
    { text: 'Start timing speed-up use to Alliance Duel and Arms Race days — this is the meta', tag: 'once' },
    { text: 'Stagger your barracks levels — never keep all barracks at the same level', tag: 'once' },
  ],
  established: [
    { text: 'Get Squad 1 fully to 5-star before touching Squad 2 at all', tag: 'once' },
    { text: 'Push toward T10 via the Special Forces tech tree — rush to the bottom row', tag: 'once' },
    { text: 'Level gear to gold on Squad 1 first — Gun and Chip before Armor and Radar', tag: 'once' },
    { text: 'Hit all 7 Alliance Duel days and aim for 7–9 boxes minimum every single day', tag: 'daily' },
    { text: 'Save 700–800 Ammo Bonanza bullets before spending — that unlocks 10 Mythic blueprints', tag: 'once' },
    { text: 'Level season decorations to level 3 for the season power bonus', tag: 'once' },
    { text: 'Use the 1-hero squad technique during sieges and MG to minimize troop loss', tag: 'once' },
  ],
  lost: [
    { text: "Confirm you're in an active alliance — if not, find one today", tag: 'once' },
    { text: "Pick ONE squad type and stop upgrading all others until it's dominant", tag: 'once' },
    { text: 'Stop spending speed-ups randomly — hold everything for Alliance Duel day timing', tag: 'once' },
    { text: "Hit Code Boss daily — it's free progress most confused players are skipping", tag: 'daily' },
    { text: 'Learn the 6-day Alliance Duel cycle and align all resource spending to it', tag: 'once' },
    { text: 'Check the Glossary tab — understanding the terms removes a lot of the fog', tag: 'once' },
  ],
};

// ─────────────────────────────────────────────────────────────
// HERO DATA
// ─────────────────────────────────────────────────────────────
const heroData: Record<string, HeroItem[]> = {
  f2p: [
    { name: 'Mason', role: 'Tank attacker', tip: 'Core damage dealer vs monsters. Bottom-left skill buffs your back row against monsters. Goes UR in Season 1 — get to 5 stars before that hits.', priority: true },
    { name: 'Monica', role: 'RSS gatherer', tip: 'Put her in any squad hitting doom elites or zombies. Bottom-left skill RSS buff is essential for keeping resources flowing.', priority: true },
    { name: 'Violet', role: 'Tank defender', tip: 'Best free frontline defender until Kim is available. Goes UR in Season 2.', priority: true },
    { name: 'Murphy', role: 'Support', tip: 'Invest early. Solid across multiple situations and squad setups.', priority: true },
    { name: 'Marshall', role: 'Code Boss specialist', tip: 'Include in every Code Boss team. Top-right skill is essential for boss damage output.', priority: false },
    { name: 'Kim', role: 'Premium tank attacker', tip: 'Available via hero choice chests — worth pursuing over time. Strong long-term investment.', priority: false },
  ],
  low: [
    { name: 'Kim', role: 'Tank attacker', tip: 'Your main investment. Shards available in daily sale bundles. Get to 5 stars as your first priority goal.', priority: true },
    { name: 'Williams', role: 'Tank support', tip: '10 shards from the daily sale bundle. Pick up early — pairs well with Kim and adds squad-wide value.', priority: true },
    { name: 'Stetman', role: 'Squad buffer', tip: '10 shards from daily sale. Strong squad-wide buffs that pay off quickly across all situations.', priority: true },
    { name: 'Mason', role: 'Tank attacker', tip: 'Goes UR in Season 1 — must be at 5 stars before that or you miss the transformation window entirely.', priority: true },
    { name: 'Marshall', role: 'Code Boss specialist', tip: 'Every Code Boss run, every time. Non-negotiable inclusion.', priority: false },
    { name: 'Monica', role: 'RSS gatherer', tip: 'Always in squad when gathering. Her RSS buff pays for itself constantly.', priority: false },
  ],
  mid: [
    { name: 'Kim', role: 'Tank attacker', tip: 'Priority buy — get to 5 stars via bundles as fast as you can. She anchors your entire squad.', priority: true },
    { name: 'Williams', role: 'Tank support', tip: 'Essential pairing with Kim. Buy shards early and level them together for maximum squad power.', priority: true },
    { name: 'Stetman', role: 'Squad buffer', tip: 'Strong squad-wide buffs — early investment pays dividends throughout the game.', priority: true },
    { name: 'Mason', role: 'Tank attacker', tip: 'Must be 5 stars before Season 1 hits for the UR transformation. Make this a clear priority.', priority: true },
    { name: 'Marshall', role: 'Code Boss specialist', tip: 'Every single Code Boss team. Top-right skill is irreplaceable for boss damage output.', priority: true },
    { name: 'DVA / Swift / Tesla', role: 'Hero Choice picks', tip: 'Available from Hero Choice 1 boxes — prioritize whichever matches your primary squad troop type.', priority: false },
  ],
};

// ─────────────────────────────────────────────────────────────
// WEEKLY RHYTHM DATA
// ─────────────────────────────────────────────────────────────
const weeklyDays: WeekDay[] = [
  {
    day: 'DAY 1',
    label: 'Radar Training',
    highlight: true,
    items: ['Radar tasks', 'Drone parts & data', 'Gather resources', 'Hero EXP'],
    note: "Radar task day — check your storage cap so it doesn't fill up",
  },
  {
    day: 'DAY 2',
    label: 'Base Expansion',
    highlight: false,
    items: ['Construction speed-ups', 'Complete builds', 'Gold trucks', 'Survivor tickets'],
    note: 'Construction speed-ups & completions double-dip Arms Race today',
  },
  {
    day: 'DAY 3',
    label: 'Age of Science',
    highlight: true,
    items: ['Tech research speed-ups', 'Complete research', 'Drone component boxes'],
    note: 'Research speed-ups & completions double-dip Arms Race · Radar task day',
  },
  {
    day: 'DAY 4',
    label: 'Train Heroes',
    highlight: false,
    items: ['Hero EXP', 'Hero shards', 'Skill medals', 'Elite recruits'],
    note: 'Stack hero items all week and unload everything today',
  },
  {
    day: 'DAY 5',
    label: 'Total Mobilization',
    highlight: true,
    items: ['Train & promote troops', 'Construction speed-ups', 'Tech speed-ups', 'Radar tasks'],
    note: 'Radar task day · Stagger barracks to train and promote simultaneously',
  },
  {
    day: 'DAY 6',
    label: 'Enemy Buster',
    highlight: false,
    items: ['Kill opponent troops', 'Gold secret tasks', 'Gold trucks', 'Healing speed-ups'],
    note: 'Save trade contracts for today · Tile trades if allied with opponent',
  },
  {
    day: 'DAY 7',
    label: 'Reset',
    highlight: false,
    items: ['Prep for next cycle', 'Stock radar tasks', 'Queue builds & research', 'Send gatherers'],
    note: 'Cycle resets — set up Day 1 gatherers and queue everything before reset',
  },
];

// ─────────────────────────────────────────────────────────────
// GLOSSARY DATA
// ─────────────────────────────────────────────────────────────
const glossaryTerms = [
  { term: 'RSS', def: 'Resources — food, iron, gold. The currency of everything in the game.' },
  { term: 'HQ', def: 'Headquarters — your main base building. Its level unlocks higher troop tiers and buildings.' },
  { term: 'MG', def: "Marshall's Guard — a group rally event run by your alliance. Show up. It's free rewards." },
  { term: 'DS/DSB', def: 'Desert Storm / Desert Storm Battle — large-scale alliance vs alliance territory war event.' },
  { term: 'SvS', def: 'Server vs Server — cross-server war. Major event with high-value rewards.' },
  { term: 'UR', def: 'Ultra Rare — the highest hero rarity tier. Certain heroes transform to UR at specific seasons.' },
  { term: 'F2P', def: 'Free to Play — no real money spent. Totally viable with disciplined timing.' },
  { term: 'Arms Race', def: 'Alliance-wide points event running alongside Alliance Duel. Time spending to score both.' },
  { term: 'Alliance Duel', def: '6-day rotating event cycle (day 7 is an "off" day). Each day has a different focus — this cycle is everything.' },
  { term: 'Radar Tasks', def: 'Daily tasks that generate points on Radar days (1, 3, 5). They have a storage cap — watch it.' },
  { term: 'Troop Buff', def: 'Same-type power bonus: 3 same=5%, 3+2 mix=10%, 4 same=15%, 5 same=20%.' },
  { term: '1-Hero Squad', def: 'Deploy your weakest hero alone to carry fewer troops and minimize losses in risky situations.' },
  { term: 'Drill Grounds', def: 'Building that sets your maximum troop capacity. Level it to hold more troops.' },
  { term: 'Honor Campaign', def: 'PvE event every other day (Sun/Tue/Thu). Win stages for boxes and progression points.' },
  { term: 'ATK / DEF gear', def: 'Attack gear = Gun + Chip (left side). Defense gear = Armor + Radar (right side).' },
];

// ─────────────────────────────────────────────────────────────
// SHARE STRIP COMPONENT
// ─────────────────────────────────────────────────────────────
function ShareStrip() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText('https://LastWarSurvivalBuddy.com/guide').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={s.shareStrip}>
      <span style={s.shareText}>Know a new commander? Share this guide.</span>
      <button
        style={{ ...s.shareBtn, ...(copied ? s.shareBtnCopied : {}) }}
        onClick={handleCopy}
      >
        {copied ? '✓ Copied!' : 'Copy link'}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function GuidePage() {
  const router = useRouter();
  const [authTier, setAuthTier] = useState<AuthTier>('loading');
  const [userContext, setUserContext] = useState<UserContext>(null);
  const [spendStyle, setSpendStyle] = useState<SpendStyle>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('checklist');
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [screen, setScreen] = useState<'start' | 'guide'>('start');

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        setAuthTier('guest');
        return;
      }
      const { data } = await supabase
        .from('subscriptions')
        .select('tier')
        .eq('user_id', session.user.id)
        .single();
      setAuthTier((data?.tier as AuthTier) ?? 'free');
    });
  }, []);

  const isPaidMember = ['pro', 'elite', 'founding', 'alliance'].includes(authTier);
  const isLoggedIn = authTier !== 'guest' && authTier !== 'loading';

  function handleContextSelect(ctx: UserContext) {
    setUserContext(ctx);
  }

  function handleSpendSelect(spend: SpendStyle) {
    setSpendStyle(spend);
    const items = checklistData[userContext ?? 'day1'];
    const initial: Record<number, boolean> = {};
    items.forEach((_, i) => { initial[i] = false; });
    setChecks(initial);
    setScreen('guide');
    setActiveTab('checklist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleCheck(i: number) {
    setChecks(prev => ({ ...prev, [i]: !prev[i] }));
  }

  function handleReset() {
    setUserContext(null);
    setSpendStyle(null);
    setChecks({});
    setScreen('start');
    setActiveTab('checklist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleTabSwitch(tab: ActiveTab) {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const checkItems = checklistData[userContext ?? 'day1'];
  const doneCount = Object.values(checks).filter(Boolean).length;
  const totalCount = checkItems.length;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const heroes = heroData[spendStyle ?? 'f2p'];

  function renderCTA() {
    if (authTier === 'loading') return null;

    if (authTier === 'guest') {
      return (
        <div style={s.ctaBox}>
          <div style={s.ctaLabel}>LAST WAR: SURVIVAL BUDDY</div>
          <p style={s.ctaHeading}>Want a plan built around your actual profile?</p>
          <p style={s.ctaSub}>
            This guide covers the fundamentals for any new commander. Buddy AI gives you a personalized daily action plan built around your exact server, HQ level, spend style, troop type, and goals — every single day.
          </p>
          <button style={s.ctaBtn} onClick={() => router.push('/')}>
            Create your free account →
          </button>
        </div>
      );
    }

    if (authTier === 'free') {
      return (
        <div style={s.ctaBox}>
          <div style={s.ctaLabel}>UPGRADE YOUR GAME</div>
          <p style={s.ctaHeading}>Ready for advice tailored to you specifically?</p>
          <p style={s.ctaSub}>
            This guide uses general advice. Buddy Pro gives you a daily action plan personalized to your server, HQ level, troop type, and goals — not just general tips for all new players.
          </p>
          <button style={s.ctaBtn} onClick={() => router.push('/upgrade')}>
            Upgrade to Buddy Pro →
          </button>
        </div>
      );
    }

    return (
      <div style={{ ...s.ctaBox, borderColor: 'rgba(29,158,117,0.25)', backgroundColor: 'rgba(29,158,117,0.05)' }}>
        <div style={{ ...s.ctaLabel, color: '#1D9E75' }}>YOUR PROFILE IS ACTIVE</div>
        <p style={s.ctaHeading}>Go deeper with Buddy.</p>
        <p style={s.ctaSub}>
          This guide covers the fundamentals. Buddy AI knows your specific server, HQ level, and troop situation — ask it anything and get answers built around you.
        </p>
        <button
          style={{ ...s.ctaBtn, backgroundColor: '#1D9E75', borderColor: '#0F6E56', color: '#fff' }}
          onClick={() => router.push('/buddy')}
        >
          Ask Buddy about your situation →
        </button>
      </div>
    );
  }

  // Renders CTA + share strip together — share always below CTA
  function renderTabFooter() {
    return (
      <div style={{ marginTop: '1.5rem' }}>
        {renderCTA()}
        <ShareStrip />
      </div>
    );
  }

  return (
    <div style={s.root}>
      {/* HEADER */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <div>
            <div style={s.classify}>LAST WAR: SURVIVAL BUDDY · FIELD MANUAL</div>
            <h1 style={s.h1}>Rookie Commander Guide</h1>
            <p style={s.headerSub}>
              Quick-start guide for new commanders — answer two questions, get your priorities
            </p>
          </div>
          {isLoggedIn && (
            <button style={s.backBtn} onClick={() => router.push('/dashboard')}>
              ← Dashboard
            </button>
          )}
        </div>
      </div>

      {/* DISCLAIMER BAR */}
      <div style={s.disclaimerBar}>
        <span style={s.disclaimerIcon}>ℹ</span>
        <span style={s.disclaimerText}>
          {isPaidMember ? (
            <>
              This guide uses general advice for all new commanders — it does not read your profile.{' '}
              <button style={s.inlineLink} onClick={() => router.push('/buddy')}>
                Ask Buddy for advice tailored to your situation →
              </button>
            </>
          ) : (
            'This guide uses general advice for all new commanders. Create an account for a personalized daily plan.'
          )}
        </span>
      </div>

      {/* CONTENT */}
      <div style={s.content}>
        {/* ══ START SCREEN ══ */}
        {screen === 'start' && (
          <div>
            <div style={s.questionCard}>
              <h2 style={s.questionH2}>Where are you right now?</h2>
              <p style={s.questionSub}>Pick the one that best matches your situation today.</p>
              <div style={s.branchGrid}>
                {([
                  { key: 'day1', label: 'Just downloaded', sub: 'First time playing, or literally day one' },
                  { key: 'week1', label: 'First week in', sub: 'HQ 5–12, finding my feet' },
                  { key: 'established', label: 'Getting serious', sub: 'HQ 13+, want to grow smarter' },
                  { key: 'lost', label: 'Feeling lost', sub: "Been playing a while but something isn't clicking" },
                ] as { key: UserContext; label: string; sub: string }[]).map(({ key, label, sub }) => (
                  <button
                    key={key}
                    style={{ ...s.branchBtn, ...(userContext === key ? s.branchBtnSelected : {}) }}
                    onClick={() => handleContextSelect(key)}
                  >
                    <span style={s.branchLabel}>{label}</span>
                    <span style={s.branchSub}>{sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {userContext && (
              <div style={s.questionCard}>
                <h2 style={s.questionH2}>How do you plan to spend?</h2>
                <p style={s.questionSub}>
                  This shapes which heroes and strategies make the most sense for you.
                </p>
                <div style={{ ...s.branchGrid, gridTemplateColumns: '1fr 1fr 1fr' }}>
                  {([
                    { key: 'f2p', label: 'Free to play', sub: 'No real money — playing smart' },
                    { key: 'low', label: 'Low spender', sub: '~$30–35 total, wisely spent' },
                    { key: 'mid', label: 'Invested', sub: 'Mid to high spender' },
                  ] as { key: SpendStyle; label: string; sub: string }[]).map(({ key, label, sub }) => (
                    <button
                      key={key}
                      style={s.branchBtn}
                      onClick={() => handleSpendSelect(key)}
                    >
                      <span style={s.branchLabel}>{label}</span>
                      <span style={s.branchSub}>{sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ GUIDE SCREEN ══ */}
        {screen === 'guide' && (
          <div>
            <button style={s.backLink} onClick={handleReset}>← Start over</button>

            <div style={s.navTabs}>
              {(['checklist', 'avoid', 'weekly', 'heroes', 'glossary'] as ActiveTab[]).map(tab => (
                <button
                  key={tab}
                  style={{ ...s.navTab, ...(activeTab === tab ? s.navTabActive : {}) }}
                  onClick={() => handleTabSwitch(tab)}
                >
                  {tab === 'checklist' && 'Day 1 checklist'}
                  {tab === 'avoid' && "Don't do yet"}
                  {tab === 'weekly' && 'Weekly rhythm'}
                  {tab === 'heroes' && 'Heroes'}
                  {tab === 'glossary' && 'Glossary'}
                </button>
              ))}
            </div>

            {/* CHECKLIST TAB */}
            {activeTab === 'checklist' && (
              <div>
                <div style={s.mindsetBox}>
                  <div style={s.mindsetLabel}>// THE #1 MINDSET SHIFT</div>
                  <p style={s.mindsetText}>
                    Do <strong style={{ color: '#e8f0f8' }}>not</strong> spend speed-ups, shards, hero EXP, or skill medals the moment you get them. Timing your spending around Alliance Duel days is the single biggest advantage in this game. New players who ignore this regret it — every time.
                  </p>
                </div>
                <div style={s.progressWrap}>
                  <div style={s.progressBg}>
                    <div style={{ ...s.progressFill, width: `${progressPct}%` }} />
                  </div>
                  <span style={s.progressLabel}>{doneCount} / {totalCount}</span>
                </div>
                <ul style={s.checklist}>
                  {checkItems.map((item, i) => (
                    <li
                      key={i}
                      style={{ ...s.checkItem, ...(checks[i] ? s.checkItemDone : {}) }}
                      onClick={() => toggleCheck(i)}
                    >
                      <div style={{ ...s.checkbox, ...(checks[i] ? s.checkboxChecked : {}) }}>
                        {checks[i] && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <polyline points="1,4 4,7 9,1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span style={{ ...s.checkText, ...(checks[i] ? s.checkTextDone : {}) }}>
                        {item.text}
                      </span>
                      <span style={{ ...s.checkTag, ...(item.tag === 'daily' ? s.tagDaily : s.tagOnce) }}>
                        {item.tag === 'daily' ? 'daily' : 'do once'}
                      </span>
                    </li>
                  ))}
                </ul>
                {renderTabFooter()}
              </div>
            )}

            {/* AVOID TAB */}
            {activeTab === 'avoid' && (
              <div>
                <div style={s.sectionLabel}>// COMMON NEW COMMANDER MISTAKES</div>
                {[
                  {
                    title: 'Buildings — slow down',
                    items: [
                      "Don't level every building at the same pace — prioritize HQ level requirements first",
                      "RSS buildings (farms, mines) don't need to go past level 15–20 early on — diminishing returns",
                      "Vaults are nearly useless early — don't waste resources leveling them",
                    ],
                  },
                  {
                    title: 'Heroes & resources — be patient',
                    items: [
                      "Don't spread hero shards, EXP, or skill medals across multiple heroes — one to 4 stars, then 5, then move on",
                      "Don't open chests or use speed-ups randomly — hold them for Alliance Duel day timing",
                      "Don't level all barracks to the same level — stagger them intentionally for Day 5 troop promotion",
                    ],
                  },
                  {
                    title: 'Squad — commit to one type',
                    items: [
                      "Focus Squad 1 (tanks) exclusively until it's dominant — do not build all squads simultaneously",
                      "Don't mix troop types randomly — same-type stacking gives up to 20% power bonus",
                      "Don't put attack heroes in the frontline or defense heroes in the backline without good reason",
                    ],
                  },
                  {
                    title: 'Resources — hold your fire',
                    items: [
                      "Don't spend Ammo Bonanza bullets until you have 700–800 saved — that's the Mythic blueprint threshold",
                      "Save trade contracts and secret orders for Days 2 and 6 — Gold Trucks and Gold Secret Tasks",
                      "Don't play solo — if you're not in an active alliance you're missing 40% of the game's systems",
                    ],
                  },
                ].map(({ title, items }) => (
                  <div key={title} style={s.warningBox}>
                    <div style={s.warningTitle}>{title}</div>
                    <ul style={s.warningList}>
                      {items.map((item, i) => (
                        <li key={i} style={s.warningItem}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {renderTabFooter()}
              </div>
            )}

            {/* WEEKLY TAB */}
            {activeTab === 'weekly' && (
              <div>
                <div style={s.sectionLabel}>// ALLIANCE DUEL — 6-DAY EVENT</div>
                <div style={s.mindsetBox}>
                  <div style={s.mindsetLabel}>// THE CORE PRINCIPLE</div>
                  <p style={s.mindsetText}>
                    Alliance Duel runs on a 6-day rotating cycle (Day 7 is an off day). Arms Race runs at the same time. On Days 2 and 3, specific actions score{' '}
                    <strong style={{ color: '#e8f0f8' }}>both simultaneously</strong> — that is your highest efficiency window of the week. Learn this cycle. Align everything to it.
                  </p>
                </div>
                <div style={s.weekGrid}>
                  {weeklyDays.map(({ day, label, highlight, items, note }) => (
                    <div key={day} style={{ ...s.dayCard, ...(highlight ? s.dayCardHL : {}) }}>
                      <div style={s.dayNum}>{day}</div>
                      <div style={{ ...s.dayLabel, ...(highlight ? s.dayLabelHL : {}) }}>{label}</div>
                      <ul style={s.dayItems}>
                        {items.map((item, i) => (
                          <li key={i} style={s.dayItem}>{item}</li>
                        ))}
                      </ul>
                      {note && <div style={s.dayNote}>{note}</div>}
                    </div>
                  ))}
                </div>
                <p style={s.weekFootnote}>
                  Aim for 7–9 Alliance Duel boxes per day. Save radar tasks before radar days (1, 3, 5). Highlighted days = highest scoring density.
                </p>
                {renderTabFooter()}
              </div>
            )}

            {/* HEROES TAB */}
            {activeTab === 'heroes' && (
              <div>
                <div style={s.sectionLabel}>// WHO TO FOCUS FIRST</div>
                <div style={s.heroGrid}>
                  {heroes.map(hero => (
                    <div key={hero.name} style={{ ...s.heroCard, ...(hero.priority ? s.heroCardPriority : {}) }}>
                      {hero.priority && <div style={s.priorityBadge}>Focus now</div>}
                      <div style={s.heroName}>{hero.name}</div>
                      <div style={s.heroRole}>{hero.role}</div>
                      <div style={s.heroTip}>{hero.tip}</div>
                    </div>
                  ))}
                </div>
                <div style={s.warningBox}>
                  <div style={s.warningTitle}>Star-up priority rules</div>
                  <ul style={s.warningList}>
                    <li style={s.warningItem}>Get each hero to 4 stars before moving to the next — never spread thin</li>
                    <li style={s.warningItem}>Mason → UR in Season 1 · Violet → Season 2 · Scarlett → Season 3. Must be 5 stars before the season hits or you miss the transformation</li>
                    <li style={s.warningItem}>Save universal UR shards for Kim or your main attacker first, then heroes not in hero choice chests</li>
                    <li style={s.warningItem}>Use defender-type heroes in the frontline and attacker/support types in the backline</li>
                  </ul>
                </div>
                {renderTabFooter()}
              </div>
            )}

            {/* GLOSSARY TAB */}
            {activeTab === 'glossary' && (
              <div>
                <div style={s.sectionLabel}>// JARGON DECODER</div>
                <div style={s.glossGrid}>
                  {glossaryTerms.map(({ term, def }) => (
                    <div key={term} style={s.glossItem}>
                      <div style={s.glossTerm}>{term}</div>
                      <div style={s.glossDef}>{def}</div>
                    </div>
                  ))}
                </div>
                {renderTabFooter()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh',
    backgroundColor: '#0d1117',
    color: '#c8d6e5',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '14px',
    lineHeight: '1.5',
  },
  header: {
    backgroundColor: '#161c24',
    borderBottom: '1px solid #2a3442',
    padding: '16px 20px 14px',
  },
  headerInner: {
    maxWidth: '740px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
  },
  classify: {
    fontFamily: 'monospace',
    fontSize: '9px',
    color: '#f0a500',
    letterSpacing: '0.15em',
    marginBottom: '5px',
  },
  h1: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#e8f0f8',
    margin: '0 0 3px',
    lineHeight: '1.2',
  },
  headerSub: {
    fontSize: '12px',
    color: '#6b7f94',
    margin: 0,
  },
  backBtn: {
    fontSize: '12px',
    color: '#6b7f94',
    background: 'none',
    border: '1px solid #2a3442',
    borderRadius: '6px',
    padding: '7px 14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    marginTop: '2px',
  },
  disclaimerBar: {
    backgroundColor: 'rgba(240,165,0,0.05)',
    borderBottom: '1px solid rgba(240,165,0,0.12)',
    padding: '9px 20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  disclaimerIcon: {
    color: '#f0a500',
    fontSize: '12px',
    flexShrink: 0,
    marginTop: '1px',
  },
  disclaimerText: {
    fontSize: '12px',
    color: '#8a9ab0',
    lineHeight: '1.5',
  },
  inlineLink: {
    background: 'none',
    border: 'none',
    color: '#f0a500',
    fontSize: '12px',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
  },
  content: {
    maxWidth: '740px',
    margin: '0 auto',
    padding: '20px 20px 40px',
  },
  questionCard: {
    backgroundColor: '#161c24',
    border: '1px solid #2a3442',
    borderRadius: '8px',
    padding: '18px',
    marginBottom: '12px',
  },
  questionH2: {
    fontSize: '15px',
    fontWeight: 500,
    color: '#e8f0f8',
    margin: '0 0 4px',
  },
  questionSub: {
    fontSize: '12px',
    color: '#6b7f94',
    margin: '0 0 14px',
    lineHeight: '1.5',
  },
  branchGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  branchBtn: {
    backgroundColor: '#1e2730',
    border: '1px solid #2a3442',
    borderRadius: '6px',
    padding: '13px 12px',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  branchBtnSelected: {
    border: '1px solid #0f6e56',
    backgroundColor: 'rgba(29,158,117,0.08)',
  },
  branchLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#e8f0f8',
    display: 'block',
  },
  branchSub: {
    fontSize: '11px',
    color: '#6b7f94',
    display: 'block',
    lineHeight: '1.4',
  },
  backLink: {
    fontSize: '12px',
    color: '#6b7f94',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0 0 14px',
    display: 'block',
  },
  navTabs: {
    display: 'flex',
    gap: 0,
    borderBottom: '1px solid #2a3442',
    marginBottom: '18px',
    overflowX: 'auto',
  },
  navTab: {
    fontFamily: 'monospace',
    fontSize: '11px',
    letterSpacing: '0.06em',
    color: '#6b7f94',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    padding: '8px 14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  navTabActive: {
    color: '#f0a500',
    borderBottom: '2px solid #f0a500',
  },
  sectionLabel: {
    fontFamily: 'monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    color: '#6b7f94',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #2a3442',
  },
  mindsetBox: {
    backgroundColor: 'rgba(240,165,0,0.05)',
    border: '1px solid rgba(240,165,0,0.18)',
    borderLeft: '3px solid #f0a500',
    borderRadius: '4px',
    padding: '13px 16px',
    marginBottom: '16px',
  },
  mindsetLabel: {
    fontFamily: 'monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    color: '#f0a500',
    marginBottom: '7px',
  },
  mindsetText: {
    fontSize: '13px',
    color: '#c8d6e5',
    lineHeight: '1.65',
    margin: 0,
  },
  progressWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '14px',
  },
  progressBg: {
    flex: 1,
    height: '4px',
    backgroundColor: '#2a3442',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '4px',
    backgroundColor: '#1D9E75',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  progressLabel: {
    fontFamily: 'monospace',
    fontSize: '10px',
    color: '#6b7f94',
    whiteSpace: 'nowrap',
  },
  checklist: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  checkItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '11px 0',
    borderBottom: '1px solid #1e2730',
    cursor: 'pointer',
  },
  checkItemDone: {
    opacity: 0.45,
  },
  checkbox: {
    width: '18px',
    height: '18px',
    minWidth: '18px',
    border: '1px solid #3a4a5c',
    borderRadius: '3px',
    backgroundColor: '#1e2730',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1px',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: '#1D9E75',
    borderColor: '#0F6E56',
  },
  checkText: {
    flex: 1,
    fontSize: '13px',
    color: '#c8d6e5',
    lineHeight: '1.5',
  },
  checkTextDone: {
    textDecoration: 'line-through',
    color: '#4a5a6a',
  },
  checkTag: {
    fontSize: '10px',
    fontWeight: 500,
    padding: '2px 8px',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
    alignSelf: 'center',
    flexShrink: 0,
  },
  tagDaily: {
    backgroundColor: 'rgba(29,158,117,0.12)',
    color: '#5dca8a',
    border: '1px solid rgba(15,110,86,0.3)',
  },
  tagOnce: {
    backgroundColor: 'rgba(55,138,221,0.1)',
    color: '#6aacdd',
    border: '1px solid rgba(24,95,165,0.25)',
  },
  warningBox: {
    backgroundColor: 'rgba(240,165,0,0.04)',
    border: '1px solid rgba(240,165,0,0.14)',
    borderLeft: '3px solid rgba(240,165,0,0.35)',
    borderRadius: '4px',
    padding: '13px 16px',
    marginBottom: '10px',
  },
  warningTitle: {
    fontFamily: 'monospace',
    fontSize: '11px',
    letterSpacing: '0.06em',
    color: '#c8a040',
    marginBottom: '9px',
    fontWeight: 500,
  },
  warningList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  warningItem: {
    fontSize: '13px',
    color: '#a0b0c0',
    padding: '3px 0 3px 14px',
    position: 'relative',
    lineHeight: '1.55',
  },
  weekGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    marginBottom: '12px',
  },
  dayCard: {
    backgroundColor: '#161c24',
    border: '1px solid #2a3442',
    borderRadius: '6px',
    padding: '11px 13px',
  },
  dayCardHL: {
    borderColor: '#0f6e56',
    backgroundColor: 'rgba(29,158,117,0.04)',
  },
  dayNum: {
    fontFamily: 'monospace',
    fontSize: '9px',
    letterSpacing: '0.12em',
    color: '#6b7f94',
    marginBottom: '3px',
  },
  dayLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#e8f0f8',
    marginBottom: '7px',
  },
  dayLabelHL: {
    color: '#1D9E75',
  },
  dayItems: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 7px',
  },
  dayItem: {
    fontSize: '12px',
    color: '#8a9ab0',
    padding: '1px 0',
    lineHeight: '1.45',
  },
  dayNote: {
    fontSize: '11px',
    color: '#b08020',
    lineHeight: '1.4',
    fontStyle: 'italic',
  },
  weekFootnote: {
    fontSize: '12px',
    color: '#6b7f94',
    lineHeight: '1.6',
    margin: 0,
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    marginBottom: '12px',
  },
  heroCard: {
    backgroundColor: '#161c24',
    border: '1px solid #2a3442',
    borderRadius: '6px',
    padding: '13px',
  },
  heroCardPriority: {
    borderColor: '#0f6e56',
  },
  priorityBadge: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: 500,
    backgroundColor: 'rgba(29,158,117,0.12)',
    color: '#5dca8a',
    border: '1px solid rgba(15,110,86,0.3)',
    padding: '2px 8px',
    borderRadius: '20px',
    marginBottom: '7px',
  },
  heroName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#e8f0f8',
    marginBottom: '2px',
  },
  heroRole: {
    fontSize: '11px',
    color: '#6b7f94',
    marginBottom: '7px',
  },
  heroTip: {
    fontSize: '12px',
    color: '#8a9ab0',
    lineHeight: '1.5',
  },
  glossGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '6px',
  },
  glossItem: {
    backgroundColor: '#161c24',
    border: '1px solid #2a3442',
    borderRadius: '6px',
    padding: '9px 11px',
  },
  glossTerm: {
    fontFamily: 'monospace',
    fontSize: '11px',
    fontWeight: 600,
    color: '#f0a500',
    marginBottom: '3px',
    letterSpacing: '0.06em',
  },
  glossDef: {
    fontSize: '12px',
    color: '#8a9ab0',
    lineHeight: '1.45',
  },
  ctaBox: {
    backgroundColor: 'rgba(240,165,0,0.05)',
    border: '1px solid rgba(240,165,0,0.2)',
    borderRadius: '8px',
    padding: '18px',
  },
  ctaLabel: {
    fontFamily: 'monospace',
    fontSize: '9px',
    letterSpacing: '0.15em',
    color: '#f0a500',
    marginBottom: '7px',
  },
  ctaHeading: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#e8f0f8',
    margin: '0 0 6px',
  },
  ctaSub: {
    fontSize: '13px',
    color: '#8a9ab0',
    lineHeight: '1.6',
    margin: '0 0 14px',
  },
  ctaBtn: {
    fontSize: '13px',
    fontWeight: 500,
    backgroundColor: '#f0a500',
    color: '#0d1117',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    cursor: 'pointer',
  },
  // ── SHARE STRIP ──
  shareStrip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginTop: '10px',
    padding: '11px 14px',
    backgroundColor: '#161c24',
    border: '1px solid #2a3442',
    borderRadius: '6px',
  },
  shareText: {
    fontSize: '12px',
    color: '#6b7f94',
  },
  shareBtn: {
    fontSize: '11px',
    fontWeight: 500,
    fontFamily: 'monospace',
    letterSpacing: '0.06em',
    backgroundColor: '#1e2730',
    color: '#8a9ab0',
    border: '1px solid #2a3442',
    borderRadius: '4px',
    padding: '5px 12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s, borderColor 0.15s',
  },
  shareBtnCopied: {
    color: '#5dca8a',
    borderColor: 'rgba(15,110,86,0.4)',
  },
};
