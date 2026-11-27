# grishchenko.org

Static personal site. No build step — plain HTML + JS, served by GitHub Pages.

## Edit content
- `essays.js` — essays (set `draft: true` to hide one; remove it to publish)
- `research.js` — papers, talks, teaching
- `lab.js` — lab registry, log, postmortems
- `index.html` — layout and page copy (home, CV, lab shell)
- `motion.css` / `motion.js` — how the site moves: reveals, transitions, reduced-motion
- `puzzles/` — the puzzles page (plain HTML + ES modules, no runtime). Puzzles are in `puzzles/data/*.json`; rule checkers in `puzzles/rules/`, shared with the generators in `puzzles/src/` (`node gen.js --verify` re-proves every puzzle unique; `node gen.js` regenerates the set)

## Deploy
Push to `master`. GitHub Pages serves the root. `.nojekyll` keeps Jekyll from touching anything.
`/files/` and `/img/` are inherited from the previous (Hugo) site and stay in place — slides and thesis PDFs are linked from Research.
