# slayyyyer.github.io

A single-page personal site: a bright, layered “Aqua” desktop with scroll and pointer parallax.
Plain HTML, CSS and a small vanilla script — no dependencies, no build step, no image files.

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
| Colours, glass, type, layout | `assets/site.css` (`:root` holds the palette) |
| Parallax speeds | `data-speed` / `data-mouse` attributes in `index.html` |
| Parallax and scroll-cue behaviour | `assets/site.js` |

The contact address appears in the About spec sheet and the contact section. Search for
`jbakerdev199@gmail.com` to change it everywhere.
