#!/usr/bin/env python3
"""Regenerate the homepage "Last code push" panel from the GitHub API.

Reads the pushed_at timestamp of each listed project, keeps the five most
recent, and rewrites the block between the lastpush markers in index.html.
Rows stay ordered by the actual instant of the push; the date shown is
Charlotte local time, so an evening push does not read as the next day.
Run by .github/workflows/last-push.yml once a day; exits non-zero without
touching the file if GitHub cannot be reached, so a failure is visible
instead of silently freezing the panel.
"""

from __future__ import annotations

import html
import json
import os
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

try:
    from zoneinfo import ZoneInfo

    EASTERN = ZoneInfo("America/New_York")
except Exception:  # Windows builds without the tzdata package
    EASTERN = None

OWNER = "slayyyyer"
INDEX = Path(__file__).resolve().parent.parent / "index.html"
START = "<!-- lastpush:start -->"
END = "<!-- lastpush:end -->"
END_LINE = f"      {END}"
SHOWN = 5
MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()

# (repository, site path, label, one-line description)
PROJECTS = [
    ("jerlang", "/jerlang/", "JErlang", "an Erlang-to-JVM compiler, built solo"),
    ("orders-service", "/orders-service/", "Orders Service", "orders held consistent through six schema changes"),
    ("buffy", "/buffy/", "Buffy", "a desk companion for long coding sessions"),
    ("morphex", "/morphex/", "Morphex", "an API that says why a form was chosen"),
    ("transcend", "/transcend/", "Transcend", "English↔French translation trained from scratch"),
    ("yahtzee", "/yahtzee/", "Yahtzee", "exact Yahtzee odds, enumerated"),
    ("blackjack", "/blackjack/", "Blackjack", "a solver checked against simulation"),
    ("word-chomp", "/word-chomp/", "Word Chomp", "a garden word game in 2:20 rounds"),
    ("boggle", "/boggle/", "Boggle", "an exact Boggle solver in the browser"),
    ("earth-radio", "/earth-radio/", "Earth Radio", "a browser instrument driven by USGS data"),
    ("clt-almanac", "/clt-almanac/", "Charlotte Almanac", "a daily forecast retrained on the 1939 station record"),
    ("murmur", "/murmur/", "Murmur", "a small animated face reading public sources"),
    ("what-changed", "/what-changed/", "What Changed Today", "a field-level diff of 311 requests and the Federal Register"),
    ("mx-lab", "/mx-lab/", "MX Lab", "seven seasons of motocross, measured"),
    ("motobuzz", "/motobuzz/", "MotoBuzz", "what the motocross world is talking about"),
    ("saf-explorer", "/saf-explorer/", "SAF Explorer", "a standalone viewer for the .saf format"),
]


def fetch_pushed_at() -> dict[str, str]:
    url = f"https://api.github.com/users/{OWNER}/repos?per_page=100&sort=pushed"
    request = urllib.request.Request(
        url,
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "slayyyyer.github.io-last-push",
        },
    )
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        request.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(request, timeout=30) as response:
        repos = json.load(response)

    pushed = {repo.get("name"): repo.get("pushed_at") for repo in repos}
    missing = [name for name, *_ in PROJECTS if not pushed.get(name)]
    if missing:
        raise SystemExit(f"GitHub API returned no pushed_at for: {', '.join(missing)}")
    return pushed


def _eastern_offset(moment: datetime) -> timedelta:
    """US Eastern offset, used when no system tz database is installed."""
    year = moment.year

    def nth_sunday(month: int, n: int) -> datetime:
        first = datetime(year, month, 1, tzinfo=timezone.utc)
        return first + timedelta(days=(6 - first.weekday()) % 7 + 7 * (n - 1))

    starts = nth_sunday(3, 2).replace(hour=7)  # 02:00 EST
    ends = nth_sunday(11, 1).replace(hour=6)  # 02:00 EDT
    return timedelta(hours=-4 if starts <= moment < ends else -5)


def local_time(iso: str) -> datetime:
    moment = datetime.fromisoformat(iso.replace("Z", "+00:00"))
    if EASTERN is not None:
        return moment.astimezone(EASTERN)
    return moment.astimezone(timezone(_eastern_offset(moment)))


def display_date(when: datetime) -> str:
    return f"{when.day} {MONTHS[when.month - 1]} {when.year}"


def render(pushed: dict[str, str]) -> str:
    rows = sorted(PROJECTS, key=lambda row: (pushed[row[0]], row[0]), reverse=True)[:SHOWN]
    lines = [
        START,
        '      <p class="recent__head">Last code push <span>checked daily from the GitHub API</span></p>',
        '      <ul class="recent__list">',
    ]
    for repo, href, label, blurb in rows:
        when = local_time(pushed[repo])
        lines += [
            "        <li>",
            f'          <time class="recent__when" datetime="{when:%Y-%m-%d}">{display_date(when)}</time>',
            f'          <a href="{href}">{html.escape(label)}</a>',
            f'          <span class="recent__what">{html.escape(blurb)}</span>',
            "        </li>",
        ]
    lines += ["      </ul>", END_LINE]
    return "\r\n".join(lines)


def main() -> int:
    with INDEX.open(encoding="utf-8", newline="") as handle:
        page = handle.read()

    if page.count(START) != 1 or page.count(END_LINE) != 1:
        raise SystemExit(f"expected exactly one {START} / {END} pair in {INDEX}")
    if page.index(START) > page.index(END_LINE):
        raise SystemExit("lastpush markers are out of order")

    block = render(fetch_pushed_at())
    start = page.index(START)
    updated = page[:start] + block + page[page.index(END_LINE) + len(END_LINE):]

    if updated == page:
        print("panel already current")
        return 0

    with INDEX.open("w", encoding="utf-8", newline="") as handle:
        handle.write(updated)
    print("panel updated")
    return 0


if __name__ == "__main__":
    sys.exit(main())
