// Unit tests for src/worker.js. Run: node --test "test/*.test.mjs"
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';

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
  for (const p of [
    '/coaching', '/coaching/', '/coaching/index.html', '/coaching/essay', '/coaching/essay/',
    '/coaching/essay/index.html', '/files/Grishchenko_CV.pdf'
  ]) {
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

test('assets are served with security headers', async () => {
  const res = await get('https://grishchenko.org/', { ASSETS: assets() });
  assert.equal(res.status, 200);
  const csp = res.headers.get('content-security-policy');
  assert.ok(csp, 'csp present');
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /object-src 'none'/);
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(res.headers.get('x-frame-options'), 'DENY');
  assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.match(res.headers.get('strict-transport-security'), /max-age=\d+/);
  assert.ok(res.headers.get('permissions-policy'));
});

test('404 from the assets keeps its status and gets the headers', async () => {
  const res = await get('https://grishchenko.org/nope', { ASSETS: assets(['/nope']) });
  assert.equal(res.status, 404);
  assert.ok(res.headers.get('content-security-policy'));
});

test('410 responses carry the headers too', async () => {
  const res = await get('https://grishchenko.org/coaching/', { ASSETS: assets() });
  assert.ok(res.headers.get('content-security-policy'));
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
});

test('www and plain http redirect to https apex, keeping path and query', async () => {
  const env = { ASSETS: assets() };
  let res = await get('https://www.grishchenko.org/talk/dao2019/?a=1', env);
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://grishchenko.org/talk/dao2019/?a=1');
  res = await get('http://grishchenko.org/files/Thesis.pdf', env);
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://grishchenko.org/files/Thesis.pdf');
  assert.deepEqual(env.ASSETS.seen, []);
});

test('preview and local hosts are served as is', async () => {
  const env = { ASSETS: assets() };
  for (const u of ['http://localhost:8787/', 'https://x-grishchenko-org.example.workers.dev/']) {
    const res = await get(u, env);
    assert.equal(res.status, 200, u);
  }
});
