// Barbell («Загрузка штанги») — generator + exhaustive solver.
// Usage:
//   node gen.js            generate puzzles.json (deterministic, seeded)
//   node gen.js --seed 7   use another seed
//   node gen.js --verify   re-solve every puzzle in puzzles.json, check uniqueness + rules.js
//
// Internally all weights are integer "units" of 2.5 kg (2.5->1, 5->2, ..., 25->10).

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { check } from '../../rules/barbell.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '../../data/barbell.json');
const toU = (kg) => Math.round(kg / 2.5);
const toKg = (u) => u * 2.5;
const BASE = [25, 20, 15, 10, 5];
const WITH_SMALL = [25, 20, 15, 10, 5, 2.5];

// ---------------------------------------------------------------- rng
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let rnd = mulberry32(1);
const ri = (n) => Math.floor(rnd() * n);
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = ri(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// ---------------------------------------------------------------- row enumeration
// Every legal row: non-increasing from the collar, contiguous, each value <= 2 times.
const rowCache = new Map();
function allRows(C, platesU) {
  const key = C + ':' + platesU.join(',');
  if (rowCache.has(key)) return rowCache.get(key);
  const vals = [...platesU].sort((a, b) => b - a);
  const out = [];
  const cur = [];
  (function rec(i) {
    if (i === vals.length || cur.length === C) {
      out.push([...cur, ...Array(C - cur.length).fill(0)]);
      return;
    }
    for (let k = 0; k <= 2 && cur.length + k <= C; k++) {
      for (let j = 0; j < k; j++) cur.push(vals[i]);
      rec(i + 1);
      for (let j = 0; j < k; j++) cur.pop();
    }
  })(0);
  // dedupe (rows ending early are produced several times)
  const seen = new Set();
  const res = out.filter((r) => { const s = r.join(','); if (seen.has(s)) return false; seen.add(s); return true; });
  rowCache.set(key, res);
  return res;
}

// Internal puzzle: {R,C,platesU,rowU:[int|null],colU:[int|null],givens:[[r,c,u]]}
function rowCandidates(P, r) {
  return allRows(P.C, P.platesU).filter((row) => {
    if (P.rowU[r] !== null && row.reduce((a, b) => a + b, 0) !== P.rowU[r]) return false;
    for (const [gr, gc, gu] of P.givens) if (gr === r && row[gc] !== gu) return false;
    return true;
  });
}

// ---------------------------------------------------------------- exhaustive solver
// Backtracking over rows (each row = one full legal pattern), pruned by column-sum bounds.
// Returns {solutions (up to limit), nodes}.
export function solve(P, limit = 2) {
  const cands = [];
  for (let r = 0; r < P.R; r++) cands.push(rowCandidates(P, r));
  const order = [...Array(P.R).keys()].sort((a, b) => cands[a].length - cands[b].length);
  // suffix min/max per column over not-yet-placed rows
  const sufMin = Array.from({ length: P.R + 1 }, () => Array(P.C).fill(0));
  const sufMax = Array.from({ length: P.R + 1 }, () => Array(P.C).fill(0));
  for (let i = P.R - 1; i >= 0; i--) {
    const cs = cands[order[i]];
    for (let c = 0; c < P.C; c++) {
      let mn = Infinity, mx = -Infinity;
      for (const row of cs) { mn = Math.min(mn, row[c]); mx = Math.max(mx, row[c]); }
      if (!cs.length) { mn = Infinity; mx = -Infinity; }
      sufMin[i][c] = sufMin[i + 1][c] + mn;
      sufMax[i][c] = sufMax[i + 1][c] + mx;
    }
  }
  const colSum = Array(P.C).fill(0);
  const pick = Array(P.R);
  const solutions = [];
  let nodes = 0;
  (function rec(i) {
    if (solutions.length >= limit) return;
    if (i === P.R) {
      for (let c = 0; c < P.C; c++) if (P.colU[c] !== null && colSum[c] !== P.colU[c]) return;
      const g = Array(P.R); for (let k = 0; k < P.R; k++) g[order[k]] = pick[k];
      solutions.push(g.map((row) => [...row]));
      return;
    }
    for (const row of cands[order[i]]) {
      nodes++;
      let ok = true;
      for (let c = 0; c < P.C && ok; c++) {
        if (P.colU[c] === null) continue;
        const s = colSum[c] + row[c];
        if (s + sufMin[i + 1][c] > P.colU[c] || s + sufMax[i + 1][c] < P.colU[c]) ok = false;
      }
      if (!ok) continue;
      for (let c = 0; c < P.C; c++) colSum[c] += row[c];
      pick[i] = row;
      rec(i + 1);
      for (let c = 0; c < P.C; c++) colSum[c] -= row[c];
      if (solutions.length >= limit) return;
    }
  })(0);
  return { solutions, nodes };
}

// ---------------------------------------------------------------- logical propagation (difficulty)
// Human-style deduction, no guessing:
//  (a) Row step: list the plate sets that fit the row total / givens; a cell's options are the
//      values it takes across those sets.
//  (b) Column step: a value in a clued column is kept only if the other cells' options can
//      complete the column total (subset-sum over options).
// Repeat until nothing changes. Returns {solved, rounds, work} where work counts eliminations.
export function propagate(P) {
  let cands = [];
  for (let r = 0; r < P.R; r++) cands.push(rowCandidates(P, r));
  const initial = cands.reduce((a, c) => a + Math.log2(Math.max(1, c.length)), 0);
  let rounds = 0, work = 0, colSteps = 0;
  for (;;) {
    rounds++;
    const dom = cands.map((cs) => Array.from({ length: P.C }, (_, c) => new Set(cs.map((row) => row[c]))));
    let changed = false;
    for (let c = 0; c < P.C; c++) {
      if (P.colU[c] === null) continue;
      for (let r = 0; r < P.R; r++) {
        // reachable sums of other rows in column c
        let reach = new Set([0]);
        for (let k = 0; k < P.R; k++) {
          if (k === r) continue;
          const nx = new Set();
          for (const s of reach) for (const v of dom[k][c]) if (s + v <= P.colU[c]) nx.add(s + v);
          reach = nx;
        }
        for (const v of [...dom[r][c]]) if (!reach.has(P.colU[c] - v)) { dom[r][c].delete(v); changed = true; work++; colSteps++; }
      }
    }
    const next = cands.map((cs, r) => cs.filter((row) => row.every((v, c) => dom[r][c].has(v))));
    if (next.some((cs, r) => cs.length !== cands[r].length)) changed = true;
    cands = next;
    if (cands.some((cs) => cs.length === 0)) return { solved: false, contradiction: true, rounds, work };
    if (!changed) break;
  }
  const solved = cands.every((cs) => cs.length === 1);
  const residualBits = cands.reduce((a, c) => a + Math.log2(Math.max(1, c.length)), 0);
  return { solved, residualBits, rounds, work, colSteps, initialBits: initial, grid: solved ? cands.map((c) => c[0]) : null };
}

// ---------------------------------------------------------------- generator
function randomSolution(R, C, platesU) {
  const g = [];
  for (let r = 0; r < R; r++) {
    // length biased to between ~half and full
    const minL = Math.max(1, Math.ceil(C / 2) - 1);
    const L = minL + ri(C - minL + 1);
    const counts = new Map();
    const row = [];
    while (row.length < L) {
      const v = platesU[ri(platesU.length)];
      if ((counts.get(v) || 0) >= 2) continue;
      counts.set(v, (counts.get(v) || 0) + 1);
      row.push(v);
    }
    row.sort((a, b) => b - a);
    g.push([...row, ...Array(C - L).fill(0)]);
  }
  return g;
}

// remaining ambiguity (bits) after logical propagation; 0 = solved by logic
function propagateResidual(P) {
  const pr = propagate(P);
  return pr.solved ? 0 : pr.residualBits ?? 50;
}
const isUnique = (P) => solve(P, 2).solutions.length === 1;
const isGood = (P) => isUnique(P) && propagate(P).solved;

function makePuzzle(R, C, plates) {
  const platesU = plates.map(toU);
  const sol = randomSolution(R, C, platesU);
  // reject degenerate grids: identical rows or all rows full
  if (new Set(sol.map((r) => r.join(','))).size < R) return null;
  if (sol.every((r) => r[C - 1] !== 0)) return null;
  const P = {
    R, C, platesU, sol,
    rowU: sol.map((r) => r.reduce((a, b) => a + b, 0)),
    colU: Array.from({ length: C }, (_, c) => sol.reduce((a, r) => a + r[c], 0)),
    givens: [],
  };
  // add givens until unique AND solvable by pure logic. Each time pick the cell whose reveal
  // helps most (uniqueness first, then fewest remaining row options after propagation),
  // preferring real plates over "empty" givens.
  let guard = 0;
  while (!isGood(P)) {
    if (++guard > 6) return null;
    let best = null, bestKey = Infinity;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      if (P.givens.some(([a, b]) => a === r && b === c)) continue;
      P.givens.push([r, c, sol[r][c]]);
      const uniq = isUnique(P);
      const pr = propagateResidual(P);
      P.givens.pop();
      const key = (uniq ? 0 : 1000) + pr + (sol[r][c] === 0 ? 0.5 : 0) + rnd() * 0.01;
      if (key < bestKey) { bestKey = key; best = [r, c]; }
    }
    P.givens.push([best[0], best[1], sol[best[0]][best[1]]]);
  }
  // greedy clue removal: givens first (fewer givens is nicer), then row/col clues
  const items = [
    ...shuffle(P.givens.map((g) => ['g', g])),
    ...shuffle([...Array(R).keys()].map((r) => ['r', r]).concat([...Array(C).keys()].map((c) => ['c', c]))),
  ];
  for (const [kind, x] of items) {
    if (kind === 'g') {
      const keep = P.givens; P.givens = keep.filter((g) => g !== x);
      if (!isGood(P)) P.givens = keep;
    } else {
      const arr = kind === 'r' ? P.rowU : P.colU;
      const old = arr[x]; arr[x] = null;
      if (!isGood(P)) arr[x] = old;
    }
  }
  const pr = propagate(P);
  const { nodes } = solve(P, 2);
  const hidden = P.rowU.filter((v) => v === null).length + P.colU.filter((v) => v === null).length;
  // difficulty score: propagation depth + column-deduction effort + initial ambiguity + search size
  const score = pr.rounds * 3 + pr.colSteps * 0.05 + pr.initialBits * 0.5 + Math.log2(nodes + 1) + hidden;
  return { P, rounds: pr.rounds, colSteps: pr.colSteps, initialBits: pr.initialBits, nodes, score };
}

function toPublic(m, id, difficulty) {
  const { P } = m;
  return {
    id, difficulty, rows: P.R, cols: P.C,
    plates: P.platesU.map(toKg),
    rowClues: P.rowU.map((u) => (u === null ? null : toKg(u))),
    colClues: P.colU.map((u) => (u === null ? null : toKg(u))),
    givens: P.givens.map(([r, c, u]) => [r, c, toKg(u)]),
    solution: P.sol.map((row) => row.map(toKg)),
    stats: { logicRounds: m.rounds, searchNodes: m.nodes, score: +m.score.toFixed(2) },
  };
}

export function fromPublic(p) {
  const plates = p.plates || BASE;
  return {
    R: p.rows, C: p.cols, platesU: plates.map(toU),
    rowU: p.rowClues.map((v) => (v === null ? null : toU(v))),
    colU: p.colClues.map((v) => (v === null ? null : toU(v))),
    givens: (p.givens || []).map(([r, c, v]) => [r, c, toU(v)]),
  };
}

const RULES_EN =
  'Each row is one side of a barbell; column 1 touches the collar. Fill cells with plates (25, 20, 15, 10, 5 kg; 2.5 where listed) or leave them empty. ' +
  'In every row plates start at the collar with no gaps and never get heavier going outward. A row may contain each plate value at most twice. ' +
  'A number right of a row is that row\'s total; a number under a column is that column\'s total. Pre-printed plates are fixed. The solution is unique.';
const RULES_RU =
  'Каждая строка — одна сторона штанги; первый столбец прилегает к замку. Поставьте в клетки блины (25, 20, 15, 10, 5 кг; где указано — и 2,5) или оставьте пустыми. ' +
  'В каждой строке блины идут от замка без пропусков и наружу не становятся тяжелее. Каждый номинал встречается в строке не более двух раз. ' +
  'Число справа от строки — её суммарный вес, число под столбцом — сумма столбца. Напечатанные блины даны заранее. Решение единственное.';

function generate(seed) {
  rnd = mulberry32(seed);
  const buckets = [
    { difficulty: 'easy', prefix: 'b-e', configs: [[4, 4, BASE]], pool: 150, maxGivens: 1, pickFrom: 'low' },
    { difficulty: 'medium', prefix: 'b-m', configs: [[5, 5, BASE]], pool: 150, maxGivens: 2, pickFrom: 'mid' },
    { difficulty: 'hard', prefix: 'b-h', configs: [[6, 5, WITH_SMALL], [6, 6, WITH_SMALL]], pool: 80, maxGivens: 2, pickFrom: 'high' },
  ];
  const puzzles = [];
  for (const b of buckets) {
    const pool = [];
    for (const [R, C, plates] of b.configs) {
      let made = 0, tries = 0;
      while (made < b.pool && tries < b.pool * 20) {
        tries++;
        const m = makePuzzle(R, C, plates);
        if (!m || m.P.givens.length > b.maxGivens) continue;
        pool.push(m); made++;
      }
    }
    pool.sort((a, b2) => a.score - b2.score);
    let chosen;
    if (b.pickFrom === 'low') {
      // lower quartile of the 4x4 pool: easy, but not trivial (needs column deductions)
      const ok = pool.filter((m) => m.colSteps > 0);
      const q = Math.floor(ok.length / 4);
      chosen = ok.slice(q - 2, q + 2);
    } else if (b.pickFrom === 'mid') {
      const mid = Math.floor(pool.length / 2);
      chosen = pool.slice(mid - 2, mid + 2);
    } else {
      // hardest two of each size
      chosen = [];
      for (const [R, C] of b.configs) chosen.push(...pool.filter((m) => m.P.R === R && m.P.C === C).slice(-2));
    }
    chosen.sort((a, b2) => a.score - b2.score);
    chosen.forEach((m, i) => puzzles.push(toPublic(m, `${b.prefix}${i + 1}`, b.difficulty)));
    const sc = pool.map((m) => m.score);
    console.log(`${b.difficulty}: pool ${pool.length}, score range ${Math.min(...sc).toFixed(1)}..${Math.max(...sc).toFixed(1)}, chosen ${chosen.map((m) => m.score.toFixed(1)).join(' ')}`);
  }
  return { genre: 'barbell', rules_en: RULES_EN, rules_ru: RULES_RU, puzzles };
}

function verify() {
  const data = JSON.parse(readFileSync(OUT, 'utf8'));
  let fail = 0;
  for (const p of data.puzzles) {
    const P = fromPublic(p);
    const { solutions, nodes } = solve(P, 2);
    const matches = solutions.length === 1 && JSON.stringify(solutions[0].map((r) => r.map(toKg))) === JSON.stringify(p.solution);
    const chk = check(p, p.solution);
    const logic = propagate(P).solved;
    // also make sure a wrong grid is rejected
    const bad = p.solution.map((r) => [...r]); bad[0][0] = bad[0][0] === 25 ? 20 : 25;
    const badChk = check(p, bad);
    const ok = solutions.length === 1 && matches && chk.solved && logic && !badChk.solved;
    if (!ok) fail++;
    console.log(`${p.id.padEnd(6)} ${p.difficulty.padEnd(6)} ${p.rows}x${p.cols}  solutions=${solutions.length}  matchesStored=${matches}  check.solved=${chk.solved}  logicOnly=${logic}  nodes=${nodes}  ${ok ? 'OK' : 'FAIL'}`);
  }
  console.log(fail ? `${fail} FAILED` : `all ${data.puzzles.length} puzzles OK`);
  process.exit(fail ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--verify')) verify();
else {
  const si = args.indexOf('--seed');
  const seed = si >= 0 ? Number(args[si + 1]) : 2026;
  const data = generate(seed);
  writeFileSync(OUT, JSON.stringify(data, null, 1).replace(/\[\n\s+([^\[\]{}]*?)\n\s+\]/g, (m, inner) => '[' + inner.replace(/\s*\n\s*/g, ' ') + ']') + '\n');
  console.log(`wrote ${data.puzzles.length} puzzles to ${OUT}`);
}
