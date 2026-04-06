"""
inspect-hedge-types.py
Prints the first 40 lines of each generated lwtData file.
Run from repo root: python scripts/inspect-hedge-types.py
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
LIB  = os.path.join(ROOT, '..', 'src', 'lib')

for fname in ['lwtStoreItemData.ts', 'lwtPackData.ts', 'lwtDroneData.ts', 'lwtBuildingCostData.ts']:
    path = os.path.join(LIB, fname)
    print(f'\n{"="*60}')
    print(f'FILE: {fname}')
    print('='*60)
    if not os.path.exists(path):
        print('  NOT FOUND')
        continue
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    for i, line in enumerate(lines[:40], 1):
        print(f'{i:3}: {line}', end='')