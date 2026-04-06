"""
patch_index.py — run from your repo root (same folder as index.html)

Usage:
    python patch_index.py           # apply patches
    python patch_index.py --debug   # diagnose encoding issues
"""

import sys
import re


def patch(filepath='index.html'):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"ERROR: {filepath} not found. Run this from your repo root.")
        sys.exit(1)

    original = content

    # Plain string replacements — most reliable across encodings
    pairs = [
        # 1. Founding screenshots: Unlimited -> 25/month
        (
            '<strong>Unlimited</strong> screenshots',
            '<strong>25 screenshots</strong> / month'
        ),
        # 2. Pricing footnote counts
        (
            '10/mo Pro \u00b7 20/mo Elite \u00b7 15/mo Founding',
            '8/mo Pro \u00b7 16/mo Elite \u00b7 16/mo Founding'
        ),
        # 3. Bottom CTA copy
        (
            'unlimited screenshots \u2014 pay once, never again. Once gone, monthly-only pricing.',
            '25 screenshots/month \u2014 pay once, never again. Once gone, monthly-only pricing.'
        ),
    ]

    applied = 0
    for old, new in pairs:
        if old in content:
            content = content.replace(old, new)
            applied += 1
            print(f"  \u2713 Applied: {old[:70]}")
        else:
            print(f"  \u2717 Not found: {old[:70]}")

    # Battle report numbers — use regex to skip over the emoji bytes safely
    # Pattern: match "10 Battle Reports", "20 Battle Reports", "15 Battle Reports"
    # inside a <strong> tag, replace with correct number
    br_replacements = [
        (r'(?<=<strong>)\S+\s+10 Battle Reports\s+\S*(?=</strong>)', '8 Battle Reports'),
        (r'(?<=<strong>)\S+\s+20 Battle Reports\s+\S*(?=</strong>)', '16 Battle Reports'),
        (r'(?<=<strong>)\S+\s+15 Battle Reports\s+\S*(?=</strong>)', '16 Battle Reports'),
    ]

    for pattern, replacement in br_replacements:
        new_content, count = re.subn(pattern, replacement, content)
        if count > 0:
            content = new_content
            applied += 1
            print(f"  \u2713 Applied (regex, {count}x): {pattern}")
        else:
            print(f"  \u2717 Not found (regex): {pattern}")

    # Simpler fallback for battle reports — just replace the number text
    simple_br = [
        ('10 Battle Reports</strong> / month</div>\n          <div class="price-feature">\u2756 Pack Scanner</div>\n          <div class="price-feature">\u2756 Daily action plan',
         '8 Battle Reports</strong> / month</div>\n          <div class="price-feature">\u2756 Pack Scanner</div>\n          <div class="price-feature">\u2756 Daily action plan'),
        ('20 Battle Reports</strong> / month</div>\n          <div class="price-feature">\u2756 Pack Scanner</div>\n          <div class="price-feature">\u2756 Priority features',
         '16 Battle Reports</strong> / month</div>\n          <div class="price-feature">\u2756 Pack Scanner</div>\n          <div class="price-feature">\u2756 Priority features'),
        ('15 Battle Reports</strong> / month</div>\n          <div class="price-feature">\u2756 Pack Scanner</div>',
         '16 Battle Reports</strong> / month</div>\n          <div class="price-feature">\u2756 Pack Scanner</div>'),
    ]

    for old, new in simple_br:
        if old in content:
            content = content.replace(old, new)
            applied += 1
            print(f"  \u2713 Applied (simple BR): {old[:60]}")
        else:
            # Last resort: just the number + " Battle Reports</strong>"
            pass

    # Absolute last resort — bare number replacements in Battle Report context
    last_resort = [
        ('10 Battle Reports</strong>', '8 Battle Reports</strong>'),
        ('20 Battle Reports</strong>', '16 Battle Reports</strong>'),
        ('15 Battle Reports</strong>', '16 Battle Reports</strong>'),
    ]

    for old, new in last_resort:
        if old in content:
            content = content.replace(old, new)
            applied += 1
            print(f"  \u2713 Applied (last resort): {old[:60]}")

    if content == original:
        print("\nNothing changed. Running --debug to show what's actually in the file:")
        debug(filepath)
        return

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"\nDone. File saved. Run with --debug if you want to verify the raw bytes.")


def debug(filepath='index.html'):
    """Show raw context around key strings."""
    try:
        content = open(filepath, 'r', encoding='utf-8').read()
    except FileNotFoundError:
        print(f"ERROR: {filepath} not found.")
        return

    needles = [
        'Battle Reports',
        'Unlimited',
        '15/mo',
        '10/mo',
        'unlimited screenshots',
    ]
    for needle in needles:
        idx = content.find(needle)
        if idx >= 0:
            snippet = content[max(0, idx-60):idx+len(needle)+60]
            print(f"\n[{needle!r}] at char {idx}:")
            print(f"  {repr(snippet)}")
        else:
            print(f"\n[{needle!r}] NOT FOUND")


if __name__ == '__main__':
    if '--debug' in sys.argv:
        filepath = next((a for a in sys.argv[1:] if not a.startswith('-')), 'index.html')
        debug(filepath)
    else:
        filepath = next((a for a in sys.argv[1:] if not a.startswith('-')), 'index.html')
        print(f"Patching {filepath}...\n")
        patch(filepath)