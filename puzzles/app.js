// Puzzles page: three genres, one shell. Rules live in ./rules/*.js (shared with the
// generators that proved each puzzle unique); this file only draws boards and handles input.
import * as Barbell from './rules/barbell.js';
import * as Records from './rules/records.js';
import * as Postmortem from './rules/postmortem.js';

const $ = (s, el = document) => el.querySelector(s);
const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null) el.append(c);
  return el;
};
const SVG = 'http://www.w3.org/2000/svg';
const s = (tag, attrs = {}) => { const el = document.createElementNS(SVG, tag); for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v); return el; };
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode: progress is per-visit */ } },
  del(k) { try { localStorage.removeItem(k); } catch { } }
};
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const LEVELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
const fmtKg = v => (v === 2.5 ? '2.5' : String(v));

// ------------------------------------------------------------------ genres
const GENRES = {
  barbell: {
    name: { en: 'Barbell', ru: 'Загрузка штанги' },
    howto: {
      en: ['Tap a cell, then a plate. ✕ marks a cell as empty.', 'Keys: 1–6 for 25…2.5, 0 or X for empty, arrows to move, Backspace to clear.'],
      ru: ['Выберите клетку, затем блин. ✕ — клетка пустая.', 'Клавиши: 1–6 — от 25 до 2,5, 0 или X — пусто, стрелки — перемещение, Backspace — стереть.']
    },
    blank: p => Array.from({ length: p.rows }, () => Array(p.cols).fill(null)),
    size: p => [p.rows, p.cols],
    seed(p, g) { for (const [r, c, v] of p.givens || []) g[r][c] = v; return g; },
    isGiven: (p, r, c) => (p.givens || []).some(([a, b]) => a === r && b === c),
    keys(p) { const plates = p.plates || Barbell.DEFAULT_PLATES; return plates.map((v, i) => ({ key: String(i + 1), val: v, label: fmtKg(v) })).concat([{ key: '0', alt: 'x', val: 0, label: '✕', title: 'Empty' }]); },
    evaluate(p, g) {
      const live = Barbell.check(p, g);
      const filled = g.map(row => row.map(v => (v == null ? 0 : v)));
      return { errors: live.errors, solved: Barbell.check(p, filled).solved };
    },
    solution: p => p.solution.map(r => r.slice()),
    render(ctx) { return renderBarbell(ctx); }
  },
  records: {
    name: { en: 'Records', ru: 'Рекорды' },
    howto: {
      en: ['Tap a cell, then a digit.', 'Keys: digits, arrows to move, Backspace to clear.'],
      ru: ['Выберите клетку, затем цифру.', 'Клавиши: цифры, стрелки — перемещение, Backspace — стереть.']
    },
    blank: p => Array.from({ length: p.n }, () => Array(p.n).fill(0)),
    size: p => [p.n, p.n],
    seed(p, g) { for (const [r, c, v] of p.givens || []) g[r][c] = v; return g; },
    isGiven: (p, r, c) => (p.givens || []).some(([a, b]) => a === r && b === c),
    keys: p => Array.from({ length: p.n }, (_, i) => ({ key: String(i + 1), val: i + 1, label: String(i + 1) })),
    evaluate(p, g) { const res = Records.check(p, g); return { errors: res.errors, solved: res.solved }; },
    solution: p => p.solution.map(r => r.slice()),
    render(ctx) { return renderRecords(ctx); }
  },
  postmortem: {
    name: { en: 'Postmortem', ru: 'Постмортем' },
    howto: {
      en: ['Tap a service to cycle: unmarked → down → root cause.', 'Down marks are your notes. The puzzle is solved when the K root causes are right — the outage then replays from them.'],
      ru: ['Нажимайте на сервис: без отметки → лежит → первопричина.', 'Отметки «лежит» — ваши заметки. Задача решена, когда верно найдены K первопричин — тогда авария проигрывается от них.']
    },
    blank: p => Array.from({ length: p.rows }, () => Array(p.cols).fill(0)),
    size: p => [p.rows, p.cols],
    seed: (p, g) => g,
    isGiven: () => false,
    keys: () => [],
    evaluate(p, g) {
      // Only contradictions the player can act on now; "this chain isn't fully marked yet" is not one.
      const LIVE = new Set(['too_many_roots', 'known_up_marked', 'clue_over', 'root_has_down_dep']);
      const errors = Postmortem.check(p, g).errors.filter(e => LIVE.has(e.type));
      const roots = [];
      g.forEach((row, r) => row.forEach((m, c) => { if (m === 2) roots.push([r, c]); }));
      let solved = false;
      if (roots.length === p.k) {
        const down = Postmortem.propagate(p, roots);
        solved = Postmortem.check(p, down.map((row, r) => row.map((d, c) => (roots.some(([a, b]) => a === r && b === c) ? 2 : d ? 1 : 0)))).solved;
      }
      return { errors, solved };
    },
    solution(p) {
      const g = this.blank(p);
      for (const [r, c] of p.solution.down) g[r][c] = 1;
      for (const [r, c] of p.solution.roots) g[r][c] = 2;
      return g;
    },
    render(ctx) { return renderPostmortem(ctx); }
  }
};
const ORDER = ['barbell', 'records', 'postmortem'];

// ------------------------------------------------------------------ state
const data = {};
let lang = store.get('pz:lang') || 'en';
let cur = null; // { genre, p, grid, sel:[r,c], undo:[], t0, elapsed, solved, revealed }
let tick = null;

async function load() {
  await Promise.all(ORDER.map(async g => { data[g] = await (await fetch(`data/${g}.json`)).json(); }));
  buildTabs();
  window.addEventListener('hashchange', route);
  document.addEventListener('keydown', onKey);
  $('#undo').onclick = undo;
  $('#reset').onclick = reset;
  $('#reveal').onclick = reveal;
  document.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => { lang = b.dataset.lang; store.set('pz:lang', lang); paintRules(); paintPad(); });
  route();
}

function route() {
  const [g, id] = location.hash.slice(1).split('/');
  const genre = GENRES[g] ? g : (store.get('pz:last') || 'barbell');
  const list = data[genre].puzzles;
  const p = list.find(x => x.id === id) || list.find(x => !(store.get('pz:' + x.id) || {}).solved) || list[0];
  if (location.hash !== `#${genre}/${p.id}`) { history.replaceState(null, '', `#${genre}/${p.id}`); }
  open(genre, p);
}

function open(genre, p) {
  store.set('pz:last', genre);
  const G = GENRES[genre];
  const saved = store.get('pz:' + p.id);
  const grid = saved && saved.grid ? saved.grid : G.seed(p, G.blank(p));
  const [R, C] = G.size(p);
  cur = { genre, G, p, grid, sel: firstFree(G, p, R, C), undo: [], elapsed: saved ? saved.t || 0 : 0, solved: !!(saved && saved.solved), revealed: !!(saved && saved.revealed), t0: performance.now(), R, C };
  paintTabs(); paintLevels(); paintRules(); paintPad();
  $('#pid').textContent = `${p.id.toUpperCase()} · ${LEVELS[p.difficulty]}${genre === 'postmortem' ? ` · K = ${p.k}` : ''}`;
  $('#stamp').hidden = !cur.solved && !cur.revealed;
  $('#stamp').textContent = cur.revealed ? 'REVEALED' : 'SOLVED';
  $('#stamp').classList.remove('in');
  paint();
  clearInterval(tick);
  tick = setInterval(paintTimer, 500);
  paintTimer();
}

function firstFree(G, p, R, C) {
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (!G.isGiven(p, r, c)) return [r, c];
  return [0, 0];
}

// ------------------------------------------------------------------ chrome
function buildTabs() {
  const el = $('#genres');
  el.replaceChildren(...ORDER.map(g => h('button', { type: 'button', role: 'tab', 'data-g': g, onclick: () => { location.hash = g; } },
    h('span', { class: 'tab-name' }, GENRES[g].name.en), h('span', { class: 'tab-ru' }, GENRES[g].name.ru))));
}
function paintTabs() { document.querySelectorAll('#genres [data-g]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.g === cur.genre))); }
function paintLevels() {
  const list = data[cur.genre].puzzles;
  $('#levels').replaceChildren(...['easy', 'medium', 'hard'].map(d => h('div', { class: 'level' },
    h('span', { class: 'mono label' }, LEVELS[d]),
    ...list.filter(x => x.difficulty === d).map((x, i) => {
      const st = store.get('pz:' + x.id) || {};
      return h('a', { href: `#${cur.genre}/${x.id}`, class: 'chip' + (x.id === cur.p.id ? ' on' : '') + (st.solved ? ' done' : st.revealed ? ' seen' : ''), 'aria-label': `${LEVELS[d]} ${i + 1}${st.solved ? ', solved' : ''}` }, String(i + 1));
    }))));
}
function paintRules() {
  document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  const G = cur.G;
  $('#gname').textContent = G.name[lang];
  $('#rules').textContent = data[cur.genre]['rules_' + lang];
  $('#howto').replaceChildren(...G.howto[lang].map(t => h('p', {}, t)));
}
function paintPad() {
  const keys = cur.G.keys(cur.p);
  const pad = $('#pad');
  pad.classList.toggle('empty', !keys.length);
  if (!keys.length) {
    pad.replaceChildren(
      h('span', { class: 'legend' }, h('i', { class: 'lg down' }), lang === 'ru' ? 'лежит' : 'down'),
      h('span', { class: 'legend' }, h('i', { class: 'lg root' }), lang === 'ru' ? 'первопричина' : 'root cause'),
      h('span', { class: 'legend' }, h('i', { class: 'lg up' }), lang === 'ru' ? 'точно работает' : 'known up'),
      h('span', { class: 'legend' }, h('i', { class: 'lg kdown' }), lang === 'ru' ? 'точно лежит' : 'known down'));
    return;
  }
  pad.replaceChildren(...keys.map(k => h('button', { type: 'button', class: 'key' + (cur.genre === 'barbell' && k.val ? ' kp kp' + String(k.val).replace('.', '_') : ''), title: k.title || k.label, onclick: () => put(k.val) }, k.label)),
    h('button', { type: 'button', class: 'key erase', title: 'Clear', onclick: () => put(cur.genre === 'barbell' ? null : 0) }, '⌫'));
}
function paintTimer() {
  if (!cur) return;
  const ms = cur.elapsed + (cur.solved || cur.revealed ? 0 : performance.now() - cur.t0);
  const sec = Math.floor(ms / 1000);
  $('#timer').textContent = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
}
function setStatus(t, kind = '') { const el = $('#status'); el.textContent = t; el.dataset.kind = kind; }

// ------------------------------------------------------------------ edits
function snapshot() { return cur.grid.map(r => r.slice()); }
function commit(next, { animate } = {}) {
  cur.undo.push(snapshot());
  if (cur.undo.length > 200) cur.undo.shift();
  cur.grid = next;
  save();
  paint(animate);
}
function save() {
  const elapsed = cur.elapsed + (cur.solved || cur.revealed ? 0 : performance.now() - cur.t0);
  store.set('pz:' + cur.p.id, { grid: cur.grid, t: elapsed, solved: cur.solved, revealed: cur.revealed });
}
function put(val) {
  if (cur.solved || cur.revealed) return;
  const [r, c] = cur.sel;
  if (cur.G.isGiven(cur.p, r, c)) { nudge(r, c); return; }
  if (cur.grid[r][c] === val) return;
  const next = snapshot(); next[r][c] = val;
  commit(next, { animate: [r, c] });
}
function cycle(r, c) {
  if (cur.solved || cur.revealed) return;
  cur.sel = [r, c];
  const next = snapshot(); next[r][c] = (next[r][c] + 1) % 3;
  commit(next, { animate: [r, c] });
}
function undo() {
  if (!cur.undo.length || cur.solved || cur.revealed) return;
  cur.grid = cur.undo.pop(); save(); paint();
}
function reset() {
  store.del('pz:' + cur.p.id);
  history.replaceState(null, '', `#${cur.genre}/${cur.p.id}`);
  open(cur.genre, cur.p); paintLevels();
}
function reveal() {
  if (cur.solved || cur.revealed) return;
  if (!confirmReveal()) return;
  cur.revealed = true; cur.elapsed += performance.now() - cur.t0;
  cur.grid = cur.G.solution(cur.p); save(); paint(); paintLevels();
  showStamp('REVEALED');
}
// A second tap confirms; no browser dialog.
function confirmReveal() {
  const b = $('#reveal');
  if (b.dataset.armed) { delete b.dataset.armed; b.textContent = 'Show solution'; return true; }
  b.dataset.armed = '1'; b.textContent = 'Tap again to show';
  setTimeout(() => { if (b.dataset.armed) { delete b.dataset.armed; b.textContent = 'Show solution'; } }, 2500);
  return false;
}
function move(dr, dc) {
  const [r, c] = cur.sel;
  cur.sel = [Math.max(0, Math.min(cur.R - 1, r + dr)), Math.max(0, Math.min(cur.C - 1, c + dc))];
  paint();
  const el = document.querySelector(`[data-rc="${cur.sel[0]},${cur.sel[1]}"]`);
  if (el) el.focus({ preventScroll: true });
}
function onKey(e) {
  if (!cur || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.target.closest && e.target.closest('a,[data-lang]')) return;
  const k = e.key;
  const arrows = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
  if (arrows[k]) { e.preventDefault(); move(...arrows[k]); return; }
  if (cur.genre === 'postmortem') {
    if (k === ' ' || k === 'Enter') { e.preventDefault(); cycle(...cur.sel); }
    if ((k === 'Backspace' || k === 'Delete') && !cur.solved && !cur.revealed) { const next = snapshot(); next[cur.sel[0]][cur.sel[1]] = 0; commit(next); }
    return;
  }
  if (k === 'Backspace' || k === 'Delete') { e.preventDefault(); put(cur.genre === 'barbell' ? null : 0); return; }
  if (k === 'z' || k === 'u') { undo(); return; }
  const key = cur.G.keys(cur.p).find(x => x.key === k || x.alt === k.toLowerCase());
  if (key) { e.preventDefault(); put(key.val); }
}

// ------------------------------------------------------------------ paint
function paint(animate) {
  const res = cur.G.evaluate(cur.p, cur.grid);
  const board = $('#board');
  board.dataset.genre = cur.genre;
  board.replaceChildren(cur.G.render({ ...cur, errors: res.errors, animate }));
  const n = res.errors.length;
  if (cur.revealed) setStatus('Solution shown. Reset to try it yourself.');
  else if (cur.solved) setStatus(`Solved in ${$('#timer').textContent}.`, 'good');
  else if (n) setStatus(`${n} conflict${n > 1 ? 's' : ''} — marked in red.`, 'bad');
  else setStatus('');
  if (res.solved && !cur.solved && !cur.revealed) win();
}
function win() {
  cur.elapsed += performance.now() - cur.t0; cur.solved = true; paintTimer();
  if (cur.genre === 'postmortem') {
    // Replay the outage from the roots the player found.
    const roots = []; cur.grid.forEach((row, r) => row.forEach((m, c) => { if (m === 2) roots.push([r, c]); }));
    const down = Postmortem.propagate(cur.p, roots);
    cur.grid = down.map((row, r) => row.map((d, c) => (roots.some(([a, b]) => a === r && b === c) ? 2 : d ? 1 : 0)));
    cur.cascade = true;
  }
  save(); paint(); cur.cascade = false; paintLevels();
  setStatus(`Solved in ${$('#timer').textContent}.`, 'good');
  showStamp('SOLVED');
}
function showStamp(text) {
  const st = $('#stamp'); st.textContent = text; st.hidden = false;
  st.classList.remove('in'); void st.offsetWidth; st.classList.add('in');
}
function nudge(r, c) {
  const el = document.querySelector(`[data-rc="${r},${c}"]`);
  if (!el || reduceMotion) return;
  el.classList.remove('nudge'); void el.offsetWidth; el.classList.add('nudge');
}
const errAt = (errors, r, c, types) => errors.some(e => e.row === r && e.col === c && (!types || types.includes(e.type)));

// ---- Barbell: a row is a bar. Collar on the left, plates sized by weight.
function renderBarbell(ctx) {
  const { p, grid, sel, errors, animate } = ctx;
  const R = p.rows, C = p.cols;
  const wrap = h('div', { class: 'bb', style: `--cols:${C}` });
  const rowBad = r => errors.some(e => e.type === 'rowSum' && e.row === r);
  const colBad = c => errors.some(e => e.type === 'colSum' && e.col === c);
  for (let r = 0; r < R; r++) {
    wrap.append(h('div', { class: 'bb-collar', 'aria-hidden': 'true' }, h('i')));
    for (let c = 0; c < C; c++) {
      const v = grid[r][c], given = (p.givens || []).some(([a, b]) => a === r && b === c);
      const bad = errAt(errors, r, c, ['order', 'gap', 'pair', 'given', 'plate']);
      const isSel = sel[0] === r && sel[1] === c && !ctx.solved && !ctx.revealed;
      const cell = h('button', {
        type: 'button', class: 'cell' + (isSel ? ' sel' : '') + (given ? ' given' : '') + (bad ? ' bad' : '') + (rowBad(r) || colBad(c) ? ' line-bad' : ''),
        'data-rc': `${r},${c}`, 'aria-label': `Row ${r + 1}, column ${c + 1}: ${v == null ? 'blank' : v === 0 ? 'empty' : fmtKg(v) + ' kg'}${given ? ', given' : ''}`,
        onclick: () => { ctx.sel = cur.sel = [r, c]; paint(); }
      });
      if (v > 0) {
        const pl = h('span', { class: `plate p${String(v).replace('.', '_')}` + (animate && animate[0] === r && animate[1] === c ? ' drop' : '') }, h('b', {}, fmtKg(v)));
        cell.append(h('span', { class: 'sleeve', 'aria-hidden': 'true' }), pl);
      } else if (v === 0) cell.append(h('span', { class: 'sleeve', 'aria-hidden': 'true' }), h('span', { class: 'x', 'aria-hidden': 'true' }, '✕'));
      else cell.append(h('span', { class: 'sleeve', 'aria-hidden': 'true' }));
      wrap.append(cell);
    }
    const clue = p.rowClues[r];
    wrap.append(h('div', { class: 'clue row' + (rowBad(r) ? ' bad' : '') }, clue == null ? '' : fmtKg(clue)));
  }
  wrap.append(h('div'));
  for (let c = 0; c < C; c++) { const clue = p.colClues[c]; wrap.append(h('div', { class: 'clue col' + (colBad(c) ? ' bad' : '') }, clue == null ? '' : fmtKg(clue))); }
  wrap.append(h('div', { class: 'clue unit' }, 'kg'));
  return wrap;
}

// ---- Records: Latin square with record-count clues around it.
function renderRecords(ctx) {
  const { p, grid, sel, errors, animate } = ctx;
  const n = p.n;
  const wrap = h('div', { class: 'rc', style: `--n:${n}` });
  const clueBad = (side, i) => errors.some(e => e.type === 'clue' && e.side === side && (side === 'top' || side === 'bottom' ? e.col === i : e.row === i));
  const lineBad = (r, c) => errors.some(e => (e.type === 'row-duplicate' && e.row === r) || (e.type === 'col-duplicate' && e.col === c));
  const clue = (side, i) => { const v = p[side][i]; return h('div', { class: `clue ${side}` + (clueBad(side, i) ? ' bad' : '') }, v == null ? '' : String(v)); };
  wrap.append(h('div'));
  for (let c = 0; c < n; c++) wrap.append(clue('top', c));
  wrap.append(h('div'));
  for (let r = 0; r < n; r++) {
    wrap.append(clue('left', r));
    for (let c = 0; c < n; c++) {
      const v = grid[r][c], given = (p.givens || []).some(([a, b]) => a === r && b === c);
      const deload = (p.deload || []).some(([a, b]) => a === r && b === c);
      const isSel = sel[0] === r && sel[1] === c && !ctx.solved && !ctx.revealed;
      const dup = v && grid[r].filter(x => x === v).length > 1 || v && grid.filter(row => row[c] === v).length > 1;
      const bad = errAt(errors, r, c, ['deload', 'given', 'range']) || (dup && lineBad(r, c));
      wrap.append(h('button', {
        type: 'button', class: 'cell' + (r === 0 ? ' r0' : '') + (c === 0 ? ' c0' : '') + (isSel ? ' sel' : '') + (given ? ' given' : '') + (bad ? ' bad' : '') + (deload ? ' deload' : ''),
        'data-rc': `${r},${c}`, 'aria-label': `Row ${r + 1}, column ${c + 1}: ${v || 'empty'}${deload ? ', deload' : ''}${given ? ', given' : ''}`,
        onclick: () => { cur.sel = [r, c]; paint(); }
      }, deload ? h('span', { class: 'tri', 'aria-hidden': 'true' }, '▼') : null,
        v ? h('span', { class: 'v' + (animate && animate[0] === r && animate[1] === c ? ' pop' : '') }, String(v)) : null));
    }
    wrap.append(clue('right', r));
  }
  wrap.append(h('div'));
  for (let c = 0; c < n; c++) wrap.append(clue('bottom', c));
  wrap.append(h('div'));
  return wrap;
}

// ---- Postmortem: services on a grid, calls drawn as arrows in the gaps.
function renderPostmortem(ctx) {
  const { p, grid, sel, errors, animate } = ctx;
  const R = p.rows, C = p.cols, S = 64, G = 26, W = C * S + (C - 1) * G, H = R * S + (R - 1) * G, P = 4;
  const svg = s('svg', { viewBox: `${-P} ${-P} ${W + 2 * P} ${H + 2 * P}`, class: 'pm', role: 'grid', 'aria-label': `Postmortem board, ${R} by ${C}` });
  const defs = s('defs');
  const mk = s('marker', { id: 'ah', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 5.5, markerHeight: 5.5, orient: 'auto-start-reverse' });
  mk.append(s('path', { d: 'M0,0 L10,5 L0,10 z', fill: 'currentColor' }));
  defs.append(mk); svg.append(defs);
  const x0 = c => c * (S + G), y0 = r => r * (S + G);
  // depth from a root along reverse calls, for the outage replay
  let depth = null;
  if (ctx.cascade) {
    depth = new Map();
    const q = [];
    grid.forEach((row, r) => row.forEach((m, c) => { if (m === 2) { depth.set(r * C + c, 0); q.push(r * C + c); } }));
    while (q.length) {
      const j = q.shift();
      for (let i = 0; i < R * C; i++) if (!depth.has(i) && grid[Math.floor(i / C)][i % C] && Postmortem.depIdx(p, i).includes(j)) { depth.set(i, depth.get(j) + 1); q.push(i); }
    }
  }
  // arrows first, under the cells
  const arrows = s('g', { class: 'arrows' });
  for (let i = 0; i < R * C; i++) {
    const r = Math.floor(i / C), c = i % C;
    for (const [dr, dc] of p.deps[i]) {
      const cx = x0(c) + S / 2, cy = y0(r) + S / 2;
      const x1 = cx + dc * (S / 2 + 3), y1 = cy + dr * (S / 2 + 3), x2 = cx + dc * (S / 2 + G - 3), y2 = cy + dr * (S / 2 + G - 3);
      const hot = grid[r + dr][c + dc] > 0 && grid[r][c] > 0;
      arrows.append(s('line', { x1, y1, x2, y2, class: 'call' + (hot ? ' hot' : ''), 'marker-end': 'url(#ah)' }));
    }
  }
  svg.append(arrows);
  const known = new Map((p.known || []).map(([r, c, st]) => [r * C + c, st]));
  const clues = new Map((p.clues || []).map(([r, c, n]) => [r * C + c, n]));
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const i = r * C + c, m = grid[r][c], k = known.get(i), isSel = sel[0] === r && sel[1] === c && !ctx.solved && !ctx.revealed;
    const bad = errAt(errors, r, c);
    const g = s('g', {
      class: 'svc' + (m === 1 ? ' down' : m === 2 ? ' root' : '') + (k ? ' k-' + k : '') + (isSel ? ' sel' : '') + (bad ? ' bad' : '') + (animate && animate[0] === r && animate[1] === c ? ' pop' : ''),
      transform: `translate(${x0(c)},${y0(r)})`, tabindex: 0, role: 'gridcell', 'data-rc': `${r},${c}`,
      'aria-label': `Service row ${r + 1}, column ${c + 1}${clues.has(i) ? `, ${clues.get(i)} calls down` : ''}${k ? `, known ${k}` : ''}: ${m === 2 ? 'root cause' : m === 1 ? 'marked down' : 'unmarked'}`
    });
    if (depth && depth.has(i)) g.style.setProperty('--d', depth.get(i));
    g.addEventListener('click', () => cycle(r, c));
    g.append(s('rect', { class: 'box', x: 0, y: 0, width: S, height: S, rx: 6 }));
    if (k) g.append(s('rect', { class: 'kbar', x: 6, y: 6, width: 14, height: 4, rx: 2 }));
    if (m === 2) g.append(s('circle', { class: 'ring', cx: S / 2, cy: S / 2, r: S / 2 - 7 }));
    if (clues.has(i)) { const t = s('text', { x: S / 2, y: S / 2 + 1, class: 'num' }); t.textContent = clues.get(i); g.append(t); }
    else if (m === 1) { const t = s('text', { x: S / 2, y: S / 2 + 1, class: 'mark' }); t.textContent = '✕'; g.append(t); }
    svg.append(g);
  }
  return svg;
}

load().catch(err => { setStatus('Could not load the puzzles. Reload the page.', 'bad'); console.error(err); });
