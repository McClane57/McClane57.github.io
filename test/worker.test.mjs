// Unit tests for src/worker.js. Run: node --test "test/*.test.mjs"
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../src/worker.js';
import { SECURITY_HEADERS } from '../src/headers.js';

const root = new URL('../', import.meta.url);
const read = (f) => fs.readFileSync(new URL(f, root), 'utf8');
const GONE_PATHS = [
  '/coaching', '/coaching/', '/coaching/index.html', '/coaching/essay', '/coaching/essay/',
  '/coaching/essay/index.html', '/files/Grishchenko_CV.pdf'
];

// Stand-in for the static assets binding: records the request and answers 200,
// or 404 for paths listed in `missing`.
function assets(missing = []) {
  const seen = [];
  return {
    seen,
    async fetch(request) {
      const { pathname } = new URL(request.url);
      seen.push(pathname);
      if (missing.includes(pathname)) {
        return new Response('<h1>not found</h1>', { status: 404, headers: { 'content-type': 'text/html' } });
      }
      return new Response('ok', { status: 200, headers: { 'content-type': 'text/html' } });
    }
  };
}

const get = (url, env) => worker.fetch(new Request(url), env);

test('gone paths answer 410 without reaching the assets', async () => {
  const env = { ASSETS: assets() };
  for (const p of GONE_PATHS) {
    const res = await get('https://grishchenko.org' + p, env);
    assert.equal(res.status, 410, p);
    assert.match(res.headers.get('content-type'), /^text\/html/, p);
    assert.match(await res.text(), /410/, p);
  }
  assert.deepEqual(env.ASSETS.seen, []);
});

test('similar but live paths are not gone', async () => {
  const env = { ASSETS: assets() };
  for (const p of ['/coachingx', '/files/Thesis.pdf', '/files/Grishchenko_CV.pdf.bak']) {
    const res = await get('https://grishchenko.org' + p, env);
    assert.equal(res.status, 200, p);
  }
});

test('worker responses carry the security headers', async () => {
  const res = await get('https://grishchenko.org/coaching/', { ASSETS: assets() });
  const csp = res.headers.get('content-security-policy');
  assert.ok(csp, 'csp present');
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /object-src 'none'/);
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(res.headers.get('x-frame-options'), 'DENY');
  assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.equal(res.headers.get('strict-transport-security'), 'max-age=300');
  assert.ok(res.headers.get('permissions-policy'));
});

test('404 from the assets keeps its status and gets the headers', async () => {
  const res = await get('https://grishchenko.org/nope', { ASSETS: assets(['/nope']) });
  assert.equal(res.status, 404);
  assert.ok(res.headers.get('content-security-policy'));
});

test('noindex on every host except grishchenko.org', async () => {
  const env = { ASSETS: assets() };
  let res = await get('https://grishchenko.org/coaching/', env);
  assert.equal(res.headers.get('x-robots-tag'), null);
  for (const host of ['grishchenko-org.example.workers.dev', 'abc123-grishchenko-org.example.workers.dev', 'localhost:8787']) {
    res = await get('https://' + host + '/coaching/', env);
    assert.equal(res.headers.get('x-robots-tag'), 'noindex', host);
  }
});

test('www redirects to the bare domain, keeping path and query', async () => {
  const env = { ASSETS: assets() };
  const res = await get('https://www.grishchenko.org/coaching/?a=1', env);
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://grishchenko.org/coaching/?a=1');
  assert.deepEqual(env.ASSETS.seen, []);
});

// --- static config that the assets layer applies without the Worker ---

function headersFileRules() {
  const rules = {};
  let cur = null;
  for (const line of read('_headers').split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) { cur = line.trim(); rules[cur] = {}; continue; }
    const i = line.indexOf(':');
    rules[cur][line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return rules;
}

test('_headers gives every static file the same security headers as the Worker', () => {
  assert.deepEqual(headersFileRules()['/*'], SECURITY_HEADERS);
});

test('_headers marks workers.dev hosts noindex', () => {
  assert.deepEqual(headersFileRules()['https://:sub.:account.workers.dev/*'], { 'X-Robots-Tag': 'noindex' });
});

test('_redirects sends www to the bare domain', () => {
  const rules = read('_redirects').split('\n').filter((l) => l.trim() && !l.startsWith('#'));
  assert.deepEqual(rules, ['https://www.grishchenko.org/* https://grishchenko.org/:splat 301']);
});

test('run_worker_first covers exactly the gone paths', () => {
  const cfg = JSON.parse(read('wrangler.jsonc').replace(/^\s*\/\/.*$/gm, ''));
  const patterns = cfg.assets.run_worker_first;
  assert.ok(Array.isArray(patterns), 'a list, not true');
  const matches = (p) => patterns.some((pat) => pat.endsWith('/*') ? p.startsWith(pat.slice(0, -1)) : p === pat);
  for (const p of GONE_PATHS) assert.ok(matches(p), p);
  for (const p of ['/', '/index.html', '/files/Thesis.pdf', '/files/ICONIP.mkv', '/coachingx']) assert.ok(!matches(p), p);
});
