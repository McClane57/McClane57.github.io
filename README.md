# grishchenko.org

Static personal site. No build step — plain HTML + JS.

**Hosting.** The site is moving from GitHub Pages to a Cloudflare Worker with static assets
(`src/worker.js`, `wrangler.jsonc`). Until the domain is switched, GitHub Pages serves `master`
and the Worker is not live; the Deploy section below describes the setup after the switch.

## Edit content
- `essays.js` — essays (set `draft: true` to hide one; remove it to publish)
- `research.js` — papers, talks, teaching
- `lab.js` — lab registry, log, postmortems
- `index.html` — layout and page copy (home, CV, lab shell)

## Deploy (after the move to Cloudflare)
Cloudflare Workers Builds deploys `master` automatically on push: every merge to `master` is a
production deploy. Any other branch uploads a preview version; its preview URL is posted as a
check on the commit and the PR. Work on a branch and open a PR.

Static files are served straight from the assets layer, without running the Worker:
- `_headers` adds the security headers (CSP and others) to every file, and `noindex` on
  `*.workers.dev` and preview hosts;
- `www.grishchenko.org` → `grishchenko.org` is a Cloudflare Redirect Rule on the zone, and
  plain `http` → `https` is the zone setting "Always Use HTTPS" (Workers static assets
  accept only relative paths in `_redirects`, so neither can live in the repo).

The Worker (`src/worker.js`) runs only for the paths in `run_worker_first`
(`wrangler.jsonc`): the retired URLs (`/coaching/…`, `/files/Grishchenko_CV.pdf`), which
answer 410 Gone with the same headers. The header list lives in `src/headers.js` and in
`_headers`; a unit test keeps them equal.

HSTS is `max-age=300` for now; raise it to `31536000` in both places once the site has run
on Cloudflare for a week.

Unknown paths get `404.html` with status 404. Files that are in the repo but not part of the
site (`README.md`, `src/`, `test/`, config) are listed in `.assetsignore`. A single asset may be
at most 25 MiB.

`/files/` and `/img/` are inherited from the previous (Hugo) site and stay in place — slides and thesis PDFs are linked from Research.

## Local checks
- Worker unit tests: `node --test "test/*.test.mjs"`
- Local server: `npx wrangler dev --persist-to ../.wrangler-state` (keeping the state outside the
  repo stops the dev server from reloading on its own writes), then open http://localhost:8787
