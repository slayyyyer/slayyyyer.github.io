# slayyyyer.github.io

A single-page personal site: a bright, layered “Aqua” desktop with scroll and pointer parallax.
Plain HTML, CSS and a small vanilla script — no dependencies and no build step. The only image
is `og.png`, the 1200×630 social preview card.

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

## Editing

| What | Where |
| --- | --- |
| Copy, sections, links, email | `index.html` |
| Project cards (the `#projects` section) | `index.html`, styled by `.projectcard` in `assets/site.css` |
| Colours, glass, type, layout | `assets/site.css` (`:root` holds the palette) |
| Parallax speeds | `data-speed` / `data-mouse` attributes in `index.html` |
| Parallax and scroll-cue behaviour | `assets/site.js` |
| Share card | `og.png` (1200×630, referenced from the `og:image` / `twitter:image` tags) |

The contact address appears in the About spec sheet and the contact section. Search for
`jbakerdev199@gmail.com` to change it everywhere.

## Subprojects

The `#projects` section links the sibling project sites on this domain:

| Card | URL |
| --- | --- |
| JErlang | <https://slayyyyer.github.io/jerlang/> |
| Three-repo reference system | <https://slayyyyer.github.io/orders-service/> · <https://slayyyyer.github.io/migration-lab/> · <https://slayyyyer.github.io/gcp-reference-platform/> |
| Buffy | <https://slayyyyer.github.io/buffy/> |
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

Each is a separate repository published at `https://slayyyyer.github.io/<repo>/`, so adding a
project means adding one `<a class="projectcard">` block and one row here. The cards run in
thematic runs — systems, then play, then Charlotte, then motocross — and because they flow
two-up, each pair is a theme too: the two exact games, then two browser-only pieces, then the
city's weather face beside its record diff, then motocross news beside its archive tool. The
five `projectcard--wide` cards span both columns at the head and inside those runs, so keep
the count of ordinary cards even.
