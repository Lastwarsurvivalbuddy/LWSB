// src/lib/profileTypes.ts
// Central type definitions for profile bucket system
// Last updated: March 8, 2026

export type Season = 0 | 1 | 2 | 3 | 4 | 5;

export type SquadPowerTier =
  | 'under_10m'
  | '10_15m'
  | '15_20m'
  | '20_25m'
  | '25_30m'
  | '30_35m'
  | '35_40m'
  | '40_45m'
  | '45_50m'
  | '60m'
  | '70m'
  | '80m'
  | '90m'
  | '100m_plus';

export type RankBucket =
  | 'top_10'
  | '11_25'
  | '26_50'
  | '51_100'
  | '101_150'
  | '151_200'
  | 'not_top_200';

export type PowerBucket =
  | 'under_50m'
  | '50_150m'
  | '150_300m'
  | '300_500m'
  | '500m_plus';

export type KillTier =
  | 'under_500k'
  | '500k'
  | '1m'
  | '2m'
  | '3m'
  | '5m'
  | '10m'
  | '25m'
  | '100m_plus';

// Display labels for UI rendering
export const SQUAD_POWER_TIER_LABELS: Record<SquadPowerTier, string> = {
  under_10m:  'Under 10M',
  '10_15m':   '10M – 15M',
  '15_20m':   '15M – 20M',
  '20_25m':   '20M – 25M',
  '25_30m':   '25M – 30M',
  '30_35m':   '30M – 35M',
  '35_40m':   '35M – 40M',
  '40_45m':   '40M – 45M',
  '45_50m':   '45M – 50M',
  '60m':      '~60M',
  '70m':      '~70M',
  '80m':      '~80M',
  '90m':      '~90M',
  '100m_plus':'100M+',
};

export const RANK_BUCKET_LABELS: Record<RankBucket, string> = {
  top_10:      'Top 10',
  '11_25':     'Rank 11–25',
  '26_50':     'Rank 26–50',
  '51_100':    'Rank 51–100',
  '101_150':   'Rank 101–150',
  '151_200':   'Rank 151–200',
  not_top_200: 'Not Top 200 / Still Building',
};

export const POWER_BUCKET_LABELS: Record<PowerBucket, string> = {
  under_50m:   'Under 50M',
  '50_150m':   '50M – 150M',
  '150_300m':  '150M – 300M',
  '300_500m':  '300M – 500M',
  '500m_plus': '500M+',
};

export const KILL_TIER_LABELS: Record<KillTier, string> = {
  under_500k: 'Recruit — Under 500K kills',
  '500k':     'Soldier — 500K kills',
  '1m':       'Punisher — 1M kills',
  '2m':       'Powerhouse — 2M kills',
  '3m':       'Warlord — 3M kills',
  '5m':       'Destroyer — 5M kills',
  '10m':      'Annihilator — 10M kills',
  '25m':      'Apex Predator — 25M kills',
  '100m_plus':'LW Dominator — 100M+ kills',
};

export const KILL_TIER_TITLES: Record<KillTier, string> = {
  under_500k: 'Recruit',
  '500k':     'Soldier',
  '1m':       'Punisher',
  '2m':       'Powerhouse',
  '3m':       'Warlord',
  '5m':       'Destroyer',
  '10m':      'Annihilator',
  '25m':      'Apex Predator',
  '100m_plus':'LW Dominator',
};

export const SEASON_LABELS: Record<number, string> = {
  0: 'Pre-Season / Season 0',
  1: 'Season 1',
  2: 'Season 2',
  3: 'Season 3',
  4: 'Season 4',
  5: 'Season 5 — Wild West',
};