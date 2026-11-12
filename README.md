# slayyyyer.github.io

A three-page personal site: the homepage, a `/projects/` collection page and an illustrated
`/world/` map, all a bright, layered “Aqua” desktop with scroll and pointer parallax. Plain HTML,
CSS and a small vanilla script — no dependencies and no build step. The only image is `og.png`,
the 1200×630 social preview card.

## Preview locally

Open `index.html`, or serve the folder:

```
py -3 -m http.server 4180 --directory slayyyyer.github.io
```

Then visit <http://localhost:4180>.

## Publish it as a root GitHub Pages site

A root (user) site is served at `https://<username>.github.io/` with no repository name in
the path. GitHub only does this for a repository named exactly `<username>.github.io`, so
yours has to be **`slayyyyer.github.io`**.

1. Create the public repository `slayyyyer/slayyyyer.github.io` on GitHub (empty — no
   README, license or `.gitignore`).
2. Push this folder's contents to its `main` branch:

   ```
   cd slayyyyer.github.io
   git init -b main
   git add .
   git commit -m "Add the site"
   git remote add origin https://github.com/slayyyyer/slayyyyer.github.io.git
   git push -u origin main
   ```

3. In the repository: **Settings → Pages**.
4. Set **Source** to **Deploy from a branch**, choose **`main`** and **`/ (root)`**, then save.
5. Watch the **Actions** tab for the first run (usually under a minute), then open
   <https://slayyyyer.github.io/>.

HTTPS is issued automatically. A custom domain can be added later with a `CNAME` file and
DNS records.

Notes:

- On GitHub Free, Pages for a user site needs the repository to be public.
- A root site coexists with project sites: a repo like `saf-explorer` can still publish at
  `https://slayyyyer.github.io/saf-explorer/`.
- Keep asset paths relative (as they are now) so the page also works from the filesystem
  and from any subpath.
- No `.nojekyll` is needed: there are no underscore-prefixed folders here.

## How the parallax works

- Elements with `data-speed` get a CSS custom property `--par` from `assets/site.js`,
  calculated as `scrollY × speed`, and their CSS transform consumes it. Background layers
  use small positive speeds; the three hero panes use negative speeds so they separate as
  you scroll.
- Elements with `data-mouse` also get `--mx` / `--my` from the pointer position in the hero.
- Everything is transform-only and updated in `requestAnimationFrame`, so scrolling stays
  off the layout path.
- `prefers-reduced-motion: reduce` disables the script and the entrance animations.
- The `/projects/` page's back link (`assets/site.js`) steps back through history when the
  visitor arrived from the homepage, so the browser restores the section and scroll position they
  left from; its `href` still points at the homepage for a cold arrival, a new tab or a
  modified click.

## The world page

`/world/` is one static page with an inline SVG map and a grouped list fallback. Four regions
hold sixteen linked buildings: Foundry coast (systems), Arcade quarter (games), Observatory
hills (data) and Motocross valley (play). The Boggle booth at the end of the Arcade quarter links to
`/boggle/`.

- The map links work with JavaScript disabled. The list is the default below 700px; wide screens
  get the map. JavaScript only adds the Map/List toggle, the local-time sky, the dish scan, the
  blink and two optional live lines.
- `prefers-reduced-motion: reduce` stops the dish and the blink. The site is light-only, so there
  is no dark colour scheme.
- A new project means one SVG group inside `world/index.html` plus one entry in the matching
  `.world-items` list. Use the same `<a>` structure, a unique `<title>` id and a caption.
- Two live lines are wired, both same-origin and both optional:
  `/what-changed/data/today.json` and `/mx-lab/data/meta.json`. The script times out after four
  seconds, shows nothing on a first failure and marks a cached value `stale` after one.
- The world page also includes `morphex-ts`, a newer project not yet in the collection page.

## Editing

| What | Where |
| --- | --- |
| Copy, sections, links, email | `index.html` |
| Project cards — the three featured on the homepage | `index.html`, `#projects` section |
| Project cards — the full collection | `projects/index.html` |
| Project card styling | `.projectcard` in `assets/site.css` |
| Colours, glass, type, layout | `assets/site.css` (`:root` holds the palette) |
| Parallax speeds | `data-speed` / `data-mouse` attributes in `index.html` |
| Parallax and scroll-cue behaviour | `assets/site.js` |
| World map, buildings and captions | `world/index.html` |
| World view toggle, local-time sky and live details | `world/world.js` |
| World page styling | `.world-*` and the map classes at the end of `assets/site.css` |
| Share card | `og.png` (1200×630, referenced from the `og:image` / `twitter:image` tags) |

The contact address appears in the About spec sheet and the contact section. Search for
`jbakerdev199@gmail.com` to change it everywhere.

## Subprojects

The sibling project sites on this domain, in the order they appear on `projects/index.html` (the
homepage's `#projects` section shows the first three):

| Card | URL |
| --- | --- |
| JErlang | <https://slayyyyer.github.io/jerlang/> |
| Three-repo reference system | <https://slayyyyer.github.io/orders-service/> · <https://slayyyyer.github.io/migration-lab/> · <https://slayyyyer.github.io/gcp-reference-platform/> |
| Buffy | <https://slayyyyer.github.io/buffy/> |
| Morphex (english-inflector) | <https://slayyyyer.github.io/morphex/> |
| Yahtzee | <https://slayyyyer.github.io/yahtzee/> |
| Blackjack Lab | <https://slayyyyer.github.io/blackjack/> |
| Word Chomp! | <https://slayyyyer.github.io/word-chomp/> |
| Earth Radio | <https://slayyyyer.github.io/earth-radio/> |
| The Charlotte Almanac | <https://slayyyyer.github.io/clt-almanac/> |
| Murmur | <https://slayyyyer.github.io/murmur/> |
| What Changed Today | <https://slayyyyer.github.io/what-changed/> |
| MX Lab | <https://slayyyyer.github.io/mx-lab/> |
| MotoBuzz | <https://slayyyyer.github.io/motobuzz/> |
| SAF Explorer | <https://slayyyyer.github.io/saf-explorer/> |

Each is a separate repository published at `https://slayyyyer.github.io/<repo>/`. Adding a project
means adding its card to `projects/index.html` and a row here — and to `index.html` as well if it
should be one of the three featured cards. The cards run in thematic runs — systems and tooling, then play, then Charlotte, then motocross — and because they flow
two-up, each pair is a theme too: the two exact games, then two browser-only pieces, then the
city's weather face beside its record diff, then motocross news beside its archive tool. The
six `projectcard--wide` cards span both columns at the head and inside those runs, so keep
the count of ordinary cards even.

The homepage's header and footer `Projects` links go to `projects/`; its own `#projects` anchor is
kept so existing links still land on the three featured cards.
