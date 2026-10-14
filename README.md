# grishchenko.org

Static personal site. No build step — plain HTML + JS, served by a Cloudflare Worker
with static assets (`src/worker.js`, `wrangler.jsonc`).

## Edit content
- `essays.js` — essays (set `draft: true` to hide one; remove it to publish)
- `research.js` — papers, talks, teaching
- `lab.js` — lab registry, log, postmortems
- `index.html` — layout and page copy (home, CV, lab shell)

## Deploy
Cloudflare Workers Builds deploys `master` automatically on push: every merge to `master` is a
production deploy. Any other branch uploads a preview version; its preview URL is posted as a
check on the commit and the PR. Work on a branch and open a PR.

The Worker (`src/worker.js`) runs in front of the files and:
- redirects `www` and plain `http` to `https://grishchenko.org`;
- answers 410 Gone for retired URLs (`/coaching/…`, `/files/Grishchenko_CV.pdf`);
- adds security headers (CSP and others) to every response.

Unknown paths get `404.html` with status 404. Files that are in the repo but not part of the
site (`README.md`, `src/`, `test/`, config) are listed in `.assetsignore`. A single asset may be
at most 25 MiB.

`/files/` and `/img/` are inherited from the previous (Hugo) site and stay in place — slides and thesis PDFs are linked from Research.

## Local checks
- Worker unit tests: `node --test "test/*.test.mjs"`
- Local server: `npx wrangler dev --persist-to ../.wrangler-state` (keeping the state outside the
  repo stops the dev server from reloading on its own writes), then open http://localhost:8787
