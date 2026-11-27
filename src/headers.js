// Security headers. The same set is in /_headers for the static files, which the
// assets layer serves without running the Worker; test/worker.test.mjs checks that
// the two lists match.

// The page renders its templates in the browser: support.js compiles them with
// new Function and loads React and Babel from unpkg, so script-src needs
// 'unsafe-eval' and unpkg. Inline style attributes are everywhere, hence
// 'unsafe-inline' for styles only. Inline scripts stay blocked.
export const CSP = [
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

// HSTS starts at five minutes so a move back is still possible; raise it to a year
// (31536000) once the site has run on Cloudflare for a week.
export const SECURITY_HEADERS = {
  'Content-Security-Policy': CSP,
  'Strict-Transport-Security': 'max-age=300',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin'
};

export const CANONICAL_HOST = 'grishchenko.org';
