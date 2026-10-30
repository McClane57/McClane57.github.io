#!/usr/bin/env node
// Records («Рекорды») — generator + exhaustive solvers. Node 22, no deps.
//
//   node gen.js [--seed 2026] [--out puzzles.json]   generate 12 puzzles
//   node gen.js --verify [file]                       re-verify a puzzles file
//
// Two independent solvers are used:
//   * countSolutions(): constraint propagation + full backtracking, stops at 2.
//   * bruteCount(): plain row-permutation enumeration (no propagation), counts every
//     solution to the end. Used only in --verify as an independent cross-check.
// Difficulty is graded by a human-style logic solver (logicSolve): cheap rules first
// (singles, clue bounds, ▼ bounds), "line enumeration" only when stuck. Every shipped
// puzzle must be solved by it with zero guessing.

import { readFileSync, writeFileSync } from "node:fs";
import { check, records } from '../../rules/records.js';

// ---------- utilities ----------
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const shuffle = (a, R) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const popcnt = (x) => { let c = 0; while (x) { x &= x - 1; c++; } return c; };
const lowbit = (x) => 31 - Math.clz32(x & -x); // index of lowest set bit
const highbit = (x) => 31 - Math.clz32(x);

const PERMS = {};
function perms(n) {
  if (PERMS[n]) return PERMS[n];
  const out = [];
  const rec = (p, used) => {
    if (p.length === n) { out.push({ p: p.slice(), f: records(p), b: records([...p].reverse()) }); return; }
    for (let v = 1; v <= n; v++) if (!(used & (1 << v))) { p.push(v); rec(p, used | (1 << v)); p.pop(); }
  };
  rec([], 0);
  return (PERMS[n] = out);
}

// ---------- line model ----------
// A line = list of cells in reading order, with clues for its start/end and the
// ▼ positions (index within line) that apply to it (rows only).
function buildLines(P) {
  const n = P.n, lines = [];
  const dl = new Set((P.deload || []).map(([r, c]) => r * n + c));
  for (let r = 0; r < n; r++) {
    const cells = [], dIdx = [];
    for (let c = 0; c < n; c++) { cells.push(r * n + c); if (dl.has(r * n + c)) dIdx.push(c); }
    lines.push({ cells, front: P.left[r], back: P.right[r], dIdx });
  }
  for (let c = 0; c < n; c++) {
    const cells = [];
    for (let r = 0; r < n; r++) cells.push(r * n + c);
    lines.push({ cells, front: P.top[c], back: P.bottom[c], dIdx: [] });
  }
  return lines;
}
const permOk = (L, q) =>
  (L.front == null || q.f === L.front) &&
  (L.back == null || q.b === L.back) &&
  L.dIdx.every((i) => q.p[i] < q.p[i - 1] && q.p[i] < q.p[i + 1]);

function initDom(P) {
  const n = P.n, full = ((1 << (n + 1)) - 1) & ~1;
  const dom = new Array(n * n).fill(full);
  for (const [r, c, v] of P.givens || []) dom[r * n + c] &= 1 << v;
  return dom;
}

// Line enumeration: restrict each cell of the line to values that appear in some
// permutation consistent with the current domains + clues + ▼. Returns false on contradiction.
function lineFilter(L, dom, n) {
  const union = new Array(n).fill(0);
  let any = false;
  for (const q of perms(n)) {
    let ok = true;
    for (let i = 0; i < n; i++) if (!(dom[L.cells[i]] & (1 << q.p[i]))) { ok = false; break; }
    if (!ok || !permOk(L, q)) continue;
    any = true;
    for (let i = 0; i < n; i++) union[i] |= 1 << q.p[i];
  }
  if (!any) return { ok: false, changed: false };
  let changed = false;
  for (let i = 0; i < n; i++) {
    const nd = dom[L.cells[i]] & union[i];
    if (nd !== dom[L.cells[i]]) { dom[L.cells[i]] = nd; changed = true; }
  }
  return { ok: true, changed };
}

// Basic human rules, one pass. Returns {ok, changed}.
function basicPass(P, lines, dom) {
  const n = P.n;
  let changed = false;
  const set = (i, nd) => { if (nd !== dom[i]) { dom[i] = nd; changed = true; } };
  for (const L of lines) {
    const cs = L.cells;
    // clue bounds: with clue k read from one side, cell at distance d holds ≤ n-k+1+d;
    // clue 1 => first cell is n; clue n => strictly increasing 1..n.
    for (const [k, order] of [[L.front, cs], [L.back, [...cs].reverse()]]) {
      if (k == null) continue;
      for (let d = 0; d < n; d++) {
        const cap = n - k + 1 + d;
        if (cap < n) set(order[d], dom[order[d]] & ((1 << (cap + 1)) - 1));
      }
      if (k === 1) set(order[0], dom[order[0]] & (1 << n));
    }
    // naked singles: fixed value removed from the rest of the line
    for (const i of cs) if (popcnt(dom[i]) === 1) for (const j of cs) if (j !== i) set(j, dom[j] & ~dom[i]);
    // hidden singles
    for (let v = 1; v <= n; v++) {
      const where = cs.filter((i) => dom[i] & (1 << v));
      if (where.length === 0) return { ok: false, changed };
      if (where.length === 1) set(where[0], 1 << v);
    }
  }
  // ▼ bounds: v < both neighbours
  for (const [r, c] of P.deload || []) {
    const m = r * n + c, a = m - 1, b = m + 1;
    if (!dom[a] || !dom[b] || !dom[m]) return { ok: false, changed };
    const hiM = Math.min(highbit(dom[a]), highbit(dom[b])) - 1; // m ≤ this
    set(m, dom[m] & ((1 << (hiM + 1)) - 1));
    if (!dom[m]) return { ok: false, changed };
    const loN = lowbit(dom[m]) + 1; // neighbours ≥ this
    const mask = ~((1 << loN) - 1);
    set(a, dom[a] & mask); set(b, dom[b] & mask);
  }
  for (const d of dom) if (!d) return { ok: false, changed };
  return { ok: true, changed };
}

// Human-style logic solve. strong=false → basic rules only.
function logicSolve(P, dom = initDom(P), strong = true) {
  const lines = buildLines(P);
  let basicRounds = 0, lineSweeps = 0, lineCuts = 0;
  for (;;) {
    for (;;) {
      const r = basicPass(P, lines, dom);
      if (!r.ok) return { ok: false, dom };
      if (!r.changed) break;
      basicRounds++;
    }
    if (dom.every((d) => popcnt(d) === 1)) break;
    if (!strong) break;
    let changed = false;
    for (const L of lines) {
      const r = lineFilter(L, dom, P.n);
      if (!r.ok) return { ok: false, dom };
      if (r.changed) { changed = true; lineCuts++; }
    }
    if (!changed) break;
    lineSweeps++;
  }
  // final consistency check on solved grids
  const solved = dom.every((d) => popcnt(d) === 1);
  if (solved) for (const L of lines) if (!lineFilter(L, dom, P.n).ok) return { ok: false, dom };
  return { ok: true, solved, dom, basicRounds, lineSweeps, lineCuts };
}

// Exhaustive count with propagation + backtracking (stops at `limit`).
function countSolutions(P, limit = 2) {
  let count = 0, nodes = 0, first = null;
  const n = P.n;
  const rec = (dom) => {
    nodes++;
    const r = logicSolve(P, dom, true);
    if (!r.ok) return;
    if (r.solved) { count++; if (!first) first = dom.map((d) => lowbit(d)); return; }
    let best = -1;
    for (let i = 0; i < n * n; i++) if (popcnt(dom[i]) > 1 && (best < 0 || popcnt(dom[i]) < popcnt(dom[best]))) best = i;
    for (let v = 1; v <= n && count < limit; v++)
      if (dom[best] & (1 << v)) { const d2 = dom.slice(); d2[best] = 1 << v; rec(d2); }
  };
  rec(initDom(P));
  return { count, nodes, first };
}

// Independent brute force: rows chosen from all permutations, no propagation beyond
// column-uniqueness and a top-clue bound; every constraint checked at the leaves. Counts to the end.
function bruteCount(P) {
  const n = P.n, all = perms(n);
  const dl = P.deload || [];
  const rowCands = [];
  for (let r = 0; r < n; r++) {
    rowCands.push(all.filter((q) =>
      (P.left[r] == null || q.f === P.left[r]) && (P.right[r] == null || q.b === P.right[r]) &&
      dl.every(([rr, c]) => rr !== r || (q.p[c] < q.p[c - 1] && q.p[c] < q.p[c + 1])) &&
      (P.givens || []).every(([rr, c, v]) => rr !== r || q.p[c] === v)));
  }
  let count = 0;
  const grid = [], colUsed = new Array(n).fill(0), colMax = new Array(n).fill(0), colRec = new Array(n).fill(0);
  const rec = (r) => {
    if (r === n) {
      for (let c = 0; c < n; c++) {
        const col = grid.map((row) => row[c]);
        if (P.top[c] != null && records(col) !== P.top[c]) return;
        if (P.bottom[c] != null && records(col.reverse()) !== P.bottom[c]) return;
      }
      count++;
      return;
    }
    for (const q of rowCands[r]) {
      let ok = true;
      for (let c = 0; c < n; c++) if (colUsed[c] & (1 << q.p[c])) { ok = false; break; }
      if (!ok) continue;
      const save = [colMax.slice(), colRec.slice()];
      for (let c = 0; c < n; c++) {
        colUsed[c] |= 1 << q.p[c];
        if (q.p[c] > colMax[c]) { colMax[c] = q.p[c]; colRec[c]++; }
        const t = P.top[c];
        if (t != null) { // records so far + at most (n - max) more, at most rows left
          const left = n - 1 - r;
          const ub = colRec[c] + Math.min(n - colMax[c], left);
          const lb = colRec[c] + (colMax[c] < n ? 1 : 0);
          if (t < lb || t > ub) ok = false;
        }
      }
      if (ok) { grid.push(q.p); rec(r + 1); grid.pop(); }
      for (let c = 0; c < n; c++) colUsed[c] &= ~(1 << q.p[c]);
      colMax.splice(0, n, ...save[0]); colRec.splice(0, n, ...save[1]);
    }
  };
  rec(0);
  return count;
}

// ---------- generation ----------
function randomLatin(n, R) {
  const g = Array.from({ length: n }, () => new Array(n).fill(0));
  const fill = (k) => {
    if (k === n * n) return true;
    const r = Math.floor(k / n), c = k % n;
    for (const v of shuffle([...Array(n)].map((_, i) => i + 1), R)) {
      let ok = true;
      for (let i = 0; i < n; i++) if (g[r][i] === v || g[i][c] === v) { ok = false; break; }
      if (!ok) continue;
      g[r][c] = v;
      if (fill(k + 1)) return true;
      g[r][c] = 0;
    }
    return false;
  };
  fill(0);
  return g;
}

function cluesOf(S) {
  const n = S.length, col = (c) => S.map((r) => r[c]);
  return {
    top: [...Array(n)].map((_, c) => records(col(c))),
    bottom: [...Array(n)].map((_, c) => records(col(c).reverse())),
    left: S.map((r) => records(r)),
    right: S.map((r) => records([...r].reverse())),
  };
}

const clone = (P) => JSON.parse(JSON.stringify(P));
// "good" = unique AND solvable by logic with no guessing.
const good = (P) => logicSolve(P).solved && countSolutions(P, 2).count === 1;

function makePuzzle(n, nDeload, R) {
  const S = randomLatin(n, R);
  const P = { n, ...cluesOf(S), deload: [], givens: [] };
  // ▼ only where the property holds in the solution; at most one per row.
  const cand = [];
  for (let r = 0; r < n; r++) for (let c = 1; c < n - 1; c++) if (S[r][c] < S[r][c - 1] && S[r][c] < S[r][c + 1]) cand.push([r, c]);
  const usedRows = new Set();
  for (const [r, c] of shuffle(cand, R)) {
    if (P.deload.length >= nDeload) break;
    if (usedRows.has(r)) continue;
    usedRows.add(r); P.deload.push([r, c]);
  }
  if (P.deload.length < nDeload) return null;
  P.deload.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  // If the full clue set is not enough, add random givens until it is.
  const cells = shuffle([...Array(n * n).keys()], R);
  while (!good(P)) {
    const k = cells.pop();
    P.givens.push([Math.floor(k / n), k % n, S[Math.floor(k / n)][k % n]]);
  }
  // Greedy removal: givens first, then clues, in random order; keep a removal only if still good.
  const items = [
    ...shuffle(P.givens.map((g) => ["g", g]), R),
    ...shuffle(["top", "bottom", "left", "right"].flatMap((s) => [...Array(n)].map((_, i) => ["c", s, i])), R),
  ];
  for (const it of items) {
    const Q = clone(P);
    if (it[0] === "g") Q.givens = Q.givens.filter((g) => g !== it[1] && !(g[0] === it[1][0] && g[1] === it[1][1]));
    else Q[it[1]][it[2]] = null;
    if (good(Q)) Object.assign(P, Q);
  }
  // ▼ marks must matter: drop any single ▼ that is redundant.
  for (const d of [...P.deload]) {
    const Q = clone(P);
    Q.deload = Q.deload.filter(([r, c]) => !(r === d[0] && c === d[1]));
    if (good(Q)) Object.assign(P, Q);
  }
  P.givens.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const L = logicSolve(P);
  const basicOnly = logicSolve(P, undefined, false).solved;
  const clueCount = ["top", "bottom", "left", "right"].reduce((s, k) => s + P[k].filter((x) => x != null).length, 0);
  // difficulty score: line-enumeration work dominates, then propagation depth
  const score = L.lineCuts * 10 + L.lineSweeps * 5 + L.basicRounds;
  return { P, S, stats: { basicRounds: L.basicRounds, lineSweeps: L.lineSweeps, lineCuts: L.lineCuts, basicOnly, clues: clueCount, givens: P.givens.length, deload: P.deload.length, nodes: countSolutions(P, 2).nodes, score } };
}

const RULES_EN =
  "Fill the grid with digits 1..N (weekly training loads) so that every row and every column contains each digit exactly once. " +
  "A number outside the grid tells how many times a new record is set when reading that row or column from that side: a value counts as a record if it is larger than every value before it (the first value always counts). " +
  "Deload ▼: a digit in a ▼ cell is smaller than both its left and right neighbours. Given digits are fixed.";
const RULES_RU =
  "Впишите в сетку цифры от 1 до N (недельные нагрузки) так, чтобы в каждой строке и каждом столбце каждая цифра встречалась ровно один раз. " +
  "Число за краем сетки показывает, сколько раз ставится новый рекорд, если читать строку или столбец с этой стороны: значение — рекорд, если оно больше всех предыдущих (первое значение всегда рекорд). " +
  "Разгрузка ▼: цифра в клетке с ▼ меньше обеих соседних по горизонтали (слева и справа). Данные цифры менять нельзя.";

function generate(seed, out) {
  const R = rng(seed);
  const spec = [
    { tag: "e", difficulty: "easy", n: 4, deload: () => (R() < 0.5 ? 0 : 1), pool: 40, minDeload: 0, pick: "low" },
    { tag: "m", difficulty: "medium", n: 5, deload: () => 2 + Math.floor(R() * 2), pool: 40, minDeload: 2, pick: "mid" },
    { tag: "h", difficulty: "hard", n: 6, deload: () => 3 + Math.floor(R() * 2), pool: 30, minDeload: 2, pick: "high" },
  ];
  const puzzles = [];
  for (const sp of spec) {
    const pool = [];
    let tries = 0;
    while (pool.length < sp.pool && tries < sp.pool * 20) {
      tries++;
      const res = makePuzzle(sp.n, sp.deload(), R);
      if (!res) continue;
      const s = res.stats;
      if (s.deload < sp.minDeload) continue;
      if (s.givens > (sp.n === 4 ? 1 : 2)) continue;
      if (sp.difficulty === "easy" && !s.basicOnly) continue; // easy: no line enumeration needed
      if (sp.difficulty !== "easy" && s.basicOnly) continue;  // medium/hard: need some line reasoning
      pool.push(res);
    }
    pool.sort((a, b) => a.stats.score - b.stats.score);
    let chosen;
    if (sp.pick === "low") {
      // easy: no givens, more clues first (gentler), two plain + two with one ▼
      const ez = pool.filter((r) => r.stats.givens === 0).sort((a, b) => a.stats.score - b.stats.score || b.stats.clues - a.stats.clues);
      chosen = [...ez.filter((r) => r.stats.deload === 0).slice(0, 2), ...ez.filter((r) => r.stats.deload === 1).slice(0, 2)];
    }
    else if (sp.pick === "high") chosen = pool.slice(-4);
    else { const m = Math.max(0, Math.floor(pool.length / 2) - 2); chosen = pool.slice(m, m + 4); }
    if (chosen.length < 4) throw new Error(`only ${chosen.length} ${sp.difficulty} puzzles`);
    chosen.forEach((res, i) => {
      const { P, S, stats } = res;
      puzzles.push({ id: `r-${sp.tag}${i + 1}`, difficulty: sp.difficulty, n: P.n, top: P.top, bottom: P.bottom, left: P.left, right: P.right, deload: P.deload, givens: P.givens, solution: S, stats });
      console.log(`r-${sp.tag}${i + 1}`, JSON.stringify(stats));
    });
  }
  const doc = { genre: "records", rules_en: RULES_EN, rules_ru: RULES_RU, puzzles };
  writeFileSync(out, stringify(doc) + "\n");
  console.log(`wrote ${puzzles.length} puzzles to ${out} (seed ${seed})`);
}

// compact JSON: arrays of primitives / small arrays on one line
function stringify(doc) {
  return JSON.stringify(doc, null, 2).replace(/\[\s+([^\[\]{}]*?)\s+\]/g, (_, inner) => "[" + inner.split(/,\s+/).join(",") + "]")
    .replace(/\[\s+((?:\[[^\[\]]*\],?\s*)+)\]/g, (_, inner) => "[" + inner.replace(/\s+/g, "") + "]");
}

function verify(file) {
  const doc = JSON.parse(readFileSync(file, "utf8"));
  let fail = 0;
  for (const p of doc.puzzles) {
    const n = p.n;
    const fast = countSolutions(p, 2);
    const brute = bruteCount(p);
    const sol = fast.first && [...Array(n)].map((_, r) => fast.first.slice(r * n, r * n + n));
    const matches = JSON.stringify(sol) === JSON.stringify(p.solution);
    const chk = check(p, p.solution);
    const logic = logicSolve(p).solved;
    const deloadOk = p.deload.every(([r, c]) => c > 0 && c < n - 1);
    // check() sanity: empty grid has no errors; a corrupted solution is flagged
    const empty = check(p, [...Array(n)].map(() => new Array(n).fill(0)));
    const bad = p.solution.map((r) => r.slice()); [bad[0][0], bad[0][1]] = [bad[0][1], bad[0][0]];
    const badChk = check(p, bad);
    const ok = fast.count === 1 && brute === 1 && matches && chk.solved && logic && deloadOk &&
      empty.errors.length === 0 && !empty.complete && !badChk.solved && badChk.errors.length > 0;
    if (!ok) fail++;
    console.log(`${ok ? "OK  " : "FAIL"} ${p.id} ${n}x${n} solutions(prop)=${fast.count} solutions(brute)=${brute} check.solved=${chk.solved} logic=${logic} ▼=${p.deload.length} givens=${p.givens.length}`);
  }
  console.log(fail ? `${fail} FAILED` : `all ${doc.puzzles.length} puzzles verified`);
  process.exit(fail ? 1 : 0);
}

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : d; };
const here = new URL(".", import.meta.url).pathname;
if (args.includes("--verify")) verify(opt("--verify", here + "../../data/records.json"));
else generate(Number(opt("--seed", 2026)), opt("--out", here + "../../data/records.json"));
