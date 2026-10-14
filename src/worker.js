// grishchenko.org — Cloudflare Worker in front of the static site (ASSETS binding).
// - Canonical host: www and plain http redirect to https://grishchenko.org.
// - Retired URLs answer 410 Gone.
// - Every response gets the security headers below.
// Everything else is the static files from the repo root, unchanged.

const CANONICAL_HOST = 'grishchenko.org';
const REDIRECT_HOSTS = new Set([CANONICAL_HOST, 'www.' + CANONICAL_HOST]);

// Pages that were taken offline on purpose. /coaching covers the whole subtree.
const GONE_PREFIXES = ['/coaching'];
const GONE_EXACT = new Set(['/files/Grishchenko_CV.pdf']);

// The page renders its templates in the browser: support.js compiles them with
// new Function and loads React and Babel from unpkg, so script-src needs
// 'unsafe-eval' and unpkg. Inline style attributes are everywhere, hence
// 'unsafe-inline' for styles only. Inline scripts stay blocked.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join('; ');

const SECURITY_HEADERS = {
  'Content-Security-Policy': CSP,
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin'
};

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

function withHeaders(response) {
  const res = new Response(response.body, response);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.headers.set(k, v);
  return res;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (REDIRECT_HOSTS.has(url.hostname) && (url.hostname !== CANONICAL_HOST || url.protocol === 'http:')) {
      const target = 'https://' + CANONICAL_HOST + url.pathname + url.search;
      return withHeaders(new Response(null, { status: 301, headers: { Location: target } }));
    }

    if (isGone(url.pathname)) {
      return withHeaders(new Response(request.method === 'HEAD' ? null : GONE_PAGE, {
        status: 410,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
      }));
    }

    return withHeaders(await env.ASSETS.fetch(request));
  }
};
