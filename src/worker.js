// grishchenko.org — Cloudflare Worker in front of the static site (ASSETS binding).
// Static files are served by the assets layer directly, with headers from /_headers.
// The Worker runs only for the paths listed
// in "run_worker_first" (wrangler.jsonc): the retired URLs, which answer 410 Gone.
// Its own responses get the same security headers, plus noindex on any host other
// than grishchenko.org (workers.dev and preview URLs).

import { SECURITY_HEADERS, CANONICAL_HOST } from './headers.js';

// Pages that were taken offline on purpose. /coaching covers the whole subtree.
// Keep in sync with "run_worker_first" in wrangler.jsonc.
const GONE_PREFIXES = ['/coaching'];
const GONE_EXACT = new Set(['/files/Grishchenko_CV.pdf']);

const GONE_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Gone — Dmitry Grishchenko</title>
<link rel="icon" href="/img/icon-32.png" sizes="32x32">
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
    background:#F0E6CE;color:#1B1712;font-family:ui-monospace,Menlo,monospace;padding:24px;box-sizing:border-box}
  main{max-width:520px}
  h1{font-size:20px;margin:0 0 12px}
  p{margin:0 0 12px;line-height:1.5;color:#423a30}
  a{color:#1B1712}
</style>
</head>
<body>
<main>
<h1>410 — this page has been removed</h1>
<p>It was taken offline on purpose and will not come back.</p>
<p><a href="/">grishchenko.org</a></p>
</main>
</body>
</html>
`;

function isGone(pathname) {
  if (GONE_EXACT.has(pathname)) return true;
  return GONE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function withHeaders(response, hostname) {
  const res = new Response(response.body, response);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.headers.set(k, v);
  if (hostname !== CANONICAL_HOST) res.headers.set('X-Robots-Tag', 'noindex');
  return res;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (isGone(url.pathname)) {
      return withHeaders(new Response(request.method === 'HEAD' ? null : GONE_PAGE, {
        status: 410,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
      }), url.hostname);
    }

    // Only reached if run_worker_first lists a path that is not handled above.
    return withHeaders(await env.ASSETS.fetch(request), url.hostname);
  }
};
