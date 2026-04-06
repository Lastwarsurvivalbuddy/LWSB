"""
fix-hedge-types.py v4
Uses regex with proper non-greedy matching on interfaces.
Run from repo root: python scripts/fix-hedge-types.py
"""

import os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
LIB  = os.path.join(ROOT, '..', 'src', 'lib')

def read(filename):
    path = os.path.join(LIB, filename)
    if not os.path.exists(path):
        return None, path
    with open(path, 'r', encoding='utf-8') as f:
        return f.read(), path

def write(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def replace_interface(content, name, new_decl):
    """Replace entire interface declaration using non-greedy match."""
    pattern = rf'export interface {re.escape(name)} \{{[^}}]*\}}'
    result, n = re.subn(pattern, new_decl, content, flags=re.DOTALL)
    if n == 0:
        print(f'    WARNING: interface {name} not found')
    return result

def fix_reduce(content, field):
    content = content.replace(f'sum + l.{field}', f'sum + (l.{field} ?? 0)')
    content = content.replace(f's + l.{field}', f's + (l.{field} ?? 0)')
    return content

# ── lwtStoreItemData.ts ───────────────────────────────────────────────────────
content, path = read('lwtStoreItemData.ts')
if content:
    original = content
    content = replace_interface(content, 'StoreItem',
        'export interface StoreItem {\n'
        '  name: string; availability: string | number; rotation: string; amount: number;\n'
        '  price: number | null; priceInBricks?: number | null; priceInBricksReduced?: number | null; tag?: string;\n'
        '}'
    )
    content = replace_interface(content, 'StorePack',
        'export interface StorePack {\n'
        '  name: string; priceInBricks?: number | null; items: { name: string; amount: number }[];\n'
        '  availability?: string | number;\n'
        '}'
    )
    content = replace_interface(content, 'StoreMilestone',
        'export interface StoreMilestone {\n'
        '  spend: number; rewards: { name: string; amount: number }[];\n'
        '}'
    )
    content = replace_interface(content, 'GameStore',
        'export interface GameStore {\n'
        '  id: string; name: string; availabilitySchedule: string; currency: string;\n'
        '  bricksRate?: number | null; bricksRateReduced?: number | null;\n'
        '  items: StoreItem[]; packs?: StorePack[]; milestones?: StoreMilestone[];\n'
        '}'
    )
    if content != original:
        write(path, content)
        print('  FIXED: lwtStoreItemData.ts')
    else:
        print('  NO CHANGE: lwtStoreItemData.ts')

# ── lwtPackData.ts ────────────────────────────────────────────────────────────
content, path = read('lwtPackData.ts')
if content:
    original = content
    content = replace_interface(content, 'PackItem',
        'export interface PackItem { name: string; amount: number | null; }'
    )
    content = replace_interface(content, 'PackTier',
        'export interface PackTier { priceInBricks: number | null; items: PackItem[]; }'
    )
    content = replace_interface(content, 'TieredPack',
        'export interface TieredPack {\n'
        '  id: string; name: string; availability: string | number; availabilityType: string;\n'
        '  tiers: PackTier[];\n'
        '}'
    )
    content = replace_interface(content, 'FlatPack',
        'export interface FlatPack {\n'
        '  id: string; name: string; availability: number | string | null;\n'
        '  priceInBricks: number | null; items: PackItem[];\n'
        '}'
    )
    content = replace_interface(content, 'PassTier',
        'export interface PassTier { name: string; priceInBricks: number | null; items: PackItem[]; }'
    )
    content = replace_interface(content, 'BattlePass',
        'export interface BattlePass { id: string; name: string; rotation: string; tiers: PassTier[]; }'
    )
    content = replace_interface(content, 'BrickCurrency',
        'export interface BrickCurrency { currency: string; bricksPerUnit: number | null; unitsPerBrick: number | null; }'
    )
    if content != original:
        write(path, content)
        print('  FIXED: lwtPackData.ts')
    else:
        print('  NO CHANGE: lwtPackData.ts')

# ── lwtDroneData.ts ───────────────────────────────────────────────────────────
content, path = read('lwtDroneData.ts')
if content:
    original = content
    content = replace_interface(content, 'DronePartsLevel',
        'export interface DronePartsLevel {\n'
        '  level: number; droneParts: number | null; battleData: number | null; requiresDroneParts: boolean;\n'
        '}'
    )
    content = replace_interface(content, 'DroneChipLevel',
        'export interface DroneChipLevel { level: number; chips: number | null; }'
    )
    content = fix_reduce(content, 'battleData')
    content = fix_reduce(content, 'droneParts')
    content = fix_reduce(content, 'chips')
    if content != original:
        write(path, content)
        print('  FIXED: lwtDroneData.ts')
    else:
        print('  NO CHANGE: lwtDroneData.ts')

# ── lwtBuildingCostData.ts ────────────────────────────────────────────────────
content, path = read('lwtBuildingCostData.ts')
if content:
    original = content
    content = replace_interface(content, 'BuildingLevel',
        'export interface BuildingLevel {\n'
        '  level: number; rss: Record<string, number | null>; time: string | null; power: number | null;\n'
        '  [key: string]: unknown;\n'
        '}'
    )
    content = replace_interface(content, 'BuildingCostEntry',
        'export interface BuildingCostEntry { name: string; levels: BuildingLevel[]; }'
    )
    if content != original:
        write(path, content)
        print('  FIXED: lwtBuildingCostData.ts')
    else:
        print('  NO CHANGE: lwtBuildingCostData.ts')

print('\nDone. Run: npx tsc --noEmit')