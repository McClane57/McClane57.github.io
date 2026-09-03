# grishchenko.org

Static personal site. No build step — plain HTML + JS, served by GitHub Pages.

## Edit content
- `essays.js` — essays (set `draft: true` to hide one; remove it to publish)
- `research.js` — papers, talks, teaching
- `lab.js` — lab registry, log, postmortems
- `index.html` — layout and page copy (home, CV, lab shell)

## Deploy
Push to `master`. GitHub Pages serves the root. `.nojekyll` keeps Jekyll from touching anything.
`/files/` and `/img/` are inherited from the previous (Hugo) site and stay in place — slides and thesis PDFs are linked from Research.
