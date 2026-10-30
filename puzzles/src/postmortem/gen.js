// Postmortem — generator + exhaustive verifier. Node 22, no deps.
//   node gen.js              generate puzzles.json (seeded, reproducible)
//   node gen.js --seed 7     different seed
//   node gen.js --verify     verify puzzles.json (uniqueness, solution, check())
//   node gen.js --show p-e1 [--solution]   ASCII view of one puzzle
import { readFileSync, writeFileSync } from "node:fs";
import { depIdx, downFromRootIdx, propagate, check } from '../../rules/postmortem.js';

const RULES_EN =
  "Every cell is a service; arrows show which neighbouring services it calls. " +
  "Exactly K services are root causes: they fail on their own while everything they call is UP. " +
  "A service is DOWN if it is a root cause or calls a DOWN service; otherwise it is UP. " +
  "A number in a cell tells how many of the services it calls are DOWN. " +
  "Green cells are known UP, red cells are known DOWN. " +
  "Mark every DOWN service and circle the K root causes. The answer is unique.";
const RULES_RU =
  "Каждая клетка — сервис; стрелки показывают, какие соседние сервисы он вызывает. " +
  "Ровно K сервисов — первопричины: они упали сами, а всё, что они вызывают, работает. " +
  "Сервис ЛЕЖИТ, если он первопричина или вызывает лежащий сервис; иначе он РАБОТАЕТ. " +
  "Число в клетке — сколько из вызываемых ею сервисов лежит. " +
  "Зелёные клетки точно работают, красные точно лежат. " +
  "Отметьте все лежащие сервисы и обведите K первопричин. Ответ единственный.";

// ---------- RNG ----------
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let rnd = mulberry32(1);
const ri = (n) => Math.floor(rnd() * n);
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = ri(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

// ---------- DAG ----------
// Random topological order; a cell may only call neighbours that come later in the order => acyclic.
function randomDag(rows, cols) {
  const n = rows * cols;
  const order = shuffle([...Array(n).keys()]);
  const pos = new Array(n); order.forEach((c, k) => (pos[c] = k));
  const deps = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const cand = shuffle(DIRS.filter(([dr, dc]) => {
      const rr = r + dr, cc = c + dc;
      return rr >= 0 && rr < rows && cc >= 0 && cc < cols && pos[rr * cols + cc] > pos[i];
    }).map((d) => d.slice()));
    const x = rnd();
    const want = x < 0.12 ? 0 : x < 0.55 ? 1 : 2; // arrow budget: 0–2, mostly 1–2
    deps.push(cand.slice(0, want));
  }
  return { rows, cols, deps };
}

// ---------- exhaustive candidate space ----------
// All K-subsets of cells that are valid root sets (no root reaches another root),
// each with its DOWN set. Valid root sets <-> DOWN sets is a bijection
// (roots = DOWN cells whose deps are all UP), so uniqueness of the root set
// is the same as uniqueness of the DOWN set.
function candidateSpace(p) {
  const n = p.rows * p.cols;
  const single = [];
  for (let i = 0; i < n; i++) single.push(downFromRootIdx(p, [i]));
  const sets = [];
  const cur = [];
  const rec = (start) => {
    if (cur.length === p.k) {
      // antichain: no root is downstream of another root
      for (const a of cur) for (const b of cur) if (a !== b && single[b][a]) return;
      const down = new Uint8Array(n);
      for (const a of cur) for (let i = 0; i < n; i++) if (single[a][i]) down[i] = 1;
      sets.push({ roots: cur.slice(), down });
      return;
    }
    for (let i = start; i < n; i++) { cur.push(i); rec(i + 1); cur.pop(); }
  };
  rec(0);
  return sets;
}

// clue = {kind:"num", i, n, deps:[...]} | {kind:"known", i, down:0|1}
function clueHolds(cl, down) {
  if (cl.kind === "known") return down[cl.i] === cl.down;
  let cnt = 0; for (const j of cl.deps) cnt += down[j];
  return cnt === cl.n;
}

function consistent(p, sets, clues) {
  return sets.filter((s) => clues.every((cl) => clueHolds(cl, s.down)));
}

// ---------- human-style logic solver (for difficulty) ----------
// Variables per cell: D (down) and R (root), each -1 unknown / 0 / 1.
function makeSolver(p, clues) {
  const n = p.rows * p.cols;
  const deps = [...Array(n).keys()].map((i) => depIdx(p, i));
  const num = new Map(), known = [];
  for (const cl of clues) cl.kind === "num" ? num.set(cl.i, cl.n) : known.push(cl);

  function propagate1(D, R) {
    // returns false on contradiction; mutates D, R
    let ch = true;
    const set = (A, i, v) => { if (A[i] === -1) { A[i] = v; ch = true; return true; } return A[i] === v; };
    for (const cl of known) if (!set(D, cl.i, cl.down)) return false;
    while (ch) {
      ch = false;
      let roots = 0, unk = 0;
      for (let i = 0; i < n; i++) { if (R[i] === 1) roots++; else if (R[i] === -1) unk++; }
      if (roots > p.k || roots + unk < p.k) return false;
      if (roots === p.k) for (let i = 0; i < n; i++) if (R[i] === -1 && !set(R, i, 0)) return false;
      if (roots + unk === p.k) for (let i = 0; i < n; i++) if (R[i] === -1 && !set(R, i, 1)) return false;
      for (let i = 0; i < n; i++) {
        const ds = deps[i];
        let dDown = 0, dUnk = 0, lastUnk = -1;
        for (const j of ds) { if (D[j] === 1) dDown++; else if (D[j] === -1) { dUnk++; lastUnk = j; } }
        if (R[i] === 1) { if (!set(D, i, 1)) return false; for (const j of ds) if (!set(D, j, 0)) return false; }
        if (D[i] === 0) { if (!set(R, i, 0)) return false; for (const j of ds) if (!set(D, j, 0)) return false; }
        if (dDown > 0) { if (!set(D, i, 1) || !set(R, i, 0)) return false; }
        if (D[i] === 1 && dDown === 0 && dUnk === 0) { if (!set(R, i, 1)) return false; }
        if (R[i] === 0 && dDown === 0 && dUnk === 0) { if (!set(D, i, 0)) return false; }
        if (D[i] === 1 && R[i] === 0 && dDown === 0 && dUnk === 1) { if (!set(D, lastUnk, 1)) return false; }
        if (num.has(i)) {
          const k = num.get(i);
          if (dDown > k || dDown + dUnk < k) return false;
          if (k > 0 && !set(D, i, 1)) return false;
          if (dDown === k) for (const j of ds) if (D[j] === -1 && !set(D, j, 0)) return false;
          if (dDown + dUnk === k) for (const j of ds) if (D[j] === -1 && !set(D, j, 1)) return false;
        }
      }
    }
    return true;
  }
  const done = (D, R) => D.every((v) => v !== -1) && R.every((v) => v !== -1);

  // level 1: propagation only. level 2: + single-cell hypothesis (assume, propagate, refute).
  function solve() {
    const D = new Int8Array(n).fill(-1), R = new Int8Array(n).fill(-1);
    if (!propagate1(D, R)) return { ok: false };
    const level1Known = D.filter((v) => v !== -1).length;
    let trials = 0;
    while (!done(D, R)) {
      let progress = false;
      for (const A of [D, R]) {
        for (let i = 0; i < n && !progress; i++) {
          if (A[i] !== -1) continue;
          for (const v of [0, 1]) {
            const D2 = D.slice(), R2 = R.slice();
            (A === D ? D2 : R2)[i] = v;
            if (!propagate1(D2, R2)) {
              A[i] = 1 - v; trials++; progress = true;
              if (!propagate1(D, R)) return { ok: false };
              break;
            }
          }
        }
        if (progress) break;
      }
      if (!progress) return { ok: true, solved: false, trials, level1Known, D };
    }
    return { ok: true, solved: true, trials, level1Known, D };
  }
  return { solve };
}

// ---------- clue selection ----------
function buildClueSpace(p, sol) {
  const n = p.rows * p.cols;
  const all = [];
  for (let i = 0; i < n; i++) {
    const ds = depIdx(p, i);
    if (ds.length) all.push({ kind: "num", i, n: ds.reduce((a, j) => a + sol.down[j], 0), deps: ds, cost: 1 });
    all.push({ kind: "known", i, down: sol.down[i], cost: sol.down[i] ? 3.5 : 2 });
  }
  return all;
}

function chooseClues(p, sets, sol) {
  const all = buildClueSpace(p, sol);
  let alive = sets;
  const chosen = [];
  while (alive.length > 1) {
    let best = null, bestScore = -1;
    for (const cl of all) {
      if (chosen.includes(cl)) continue;
      let killed = 0; for (const s of alive) if (!clueHolds(cl, s.down)) killed++;
      if (!killed) continue;
      const score = (killed / cl.cost) * (0.75 + 0.5 * rnd());
      if (score > bestScore) { bestScore = score; best = cl; }
    }
    if (!best) return null;
    chosen.push(best);
    alive = alive.filter((s) => clueHolds(best, s.down));
  }
  // minimise: drop redundant clues, expensive ones (known states) first
  const order = shuffle(chosen.slice()).sort((a, b) => b.cost - a.cost);
  let keep = chosen.slice();
  for (const cl of order) {
    const trial = keep.filter((x) => x !== cl);
    if (consistent(p, sets, trial).length === 1) keep = trial;
  }
  return keep;
}

// Solver-guided tuning: the minimal clue set is usually far too thin for a human
// (it may need long chains of hypotheses). Add number clues until the logic solver
// needs at most sp.trials[1] hypothesis steps, then prune clues that are redundant
// for both uniqueness and the difficulty window.
function tuneClues(p, sets, sol, clues, sp) {
  const solveWith = (cl) => makeSolver(p, cl).solve();
  const cost = (r) => (!r.ok || !r.solved ? 1000 : 0) + r.trials;
  const pool = buildClueSpace(p, sol).filter((c) => c.kind === "num");
  const has = (cl, c) => cl.some((x) => x.kind === c.kind && x.i === c.i);
  let cur = clues.slice(), res = solveWith(cur);
  while (cost(res) > sp.trials[1]) {
    let best = null, bestRes = null;
    for (const c of shuffle(pool.filter((c) => !has(cur, c)))) {
      const r = solveWith([...cur, c]);
      if (!best || cost(r) < cost(bestRes)) { best = c; bestRes = r; }
    }
    if (!best) return null;
    cur.push(best); res = bestRes;
  }
  const order = shuffle(cur.slice()).sort((a, b) => b.cost - a.cost);
  for (const c of order) {
    const trial = cur.filter((x) => x !== c);
    if (consistent(p, sets, trial).length !== 1) continue;
    const r = solveWith(trial);
    if (cost(r) <= sp.trials[1]) { cur = trial; res = r; }
  }
  if (!res.ok || !res.solved || res.trials < sp.trials[0]) return null;
  return { clues: cur, res };
}

// ---------- puzzle factory ----------
const SPEC = {
  easy:   { rows: 4, cols: 4, ks: [1],    minDown: 4,  maxDown: 10, maxKnown: 1, maxKnownDown: 0, minClues: 4, maxClues: 8,  trials: [0, 0] },
  medium: { rows: 5, cols: 5, ks: [1, 2], minDown: 6,  maxDown: 15, maxKnown: 2, maxKnownDown: 1, minClues: 5, maxClues: 11, trials: [1, 3] },
  hard:   { rows: 6, cols: 6, ks: [2, 3], minDown: 9,  maxDown: 22, maxKnown: 2, maxKnownDown: 1, minClues: 6, maxClues: 14, trials: [3, 8] },
};

function tryMake(diff, k) {
  const sp = SPEC[diff];
  const p = randomDag(sp.rows, sp.cols);
  p.k = k;
  const n = p.rows * p.cols;
  const sets = candidateSpace(p);
  if (sets.length < 2) return null;
  const sizeOk = sets.filter((s) => { const nd = s.down.reduce((a, b) => a + b, 0); return nd >= sp.minDown && nd <= sp.maxDown; });
  if (!sizeOk.length) return null;
  const sol = sizeOk[ri(sizeOk.length)];
  // no root may be an isolated leaf with nothing depending on it (boring)
  for (const r of sol.roots) if (downFromRootIdx(p, [r]).reduce((a, b) => a + b, 0) < 2) return null;

  const clues0 = chooseClues(p, sets, sol);
  if (!clues0) return null;
  const tuned = tuneClues(p, sets, sol, clues0, sp);
  if (!tuned) return null;
  const { clues, res } = tuned;
  const knownCl = clues.filter((c) => c.kind === "known");
  if (knownCl.length > sp.maxKnown) return null;
  if (knownCl.filter((c) => c.down).length > sp.maxKnownDown) return null;
  if (clues.length < sp.minClues || clues.length > sp.maxClues) return null;
  // anti-trivial: no single clue may pin the answer
  for (const cl of clues) if (consistent(p, sets, [cl]).length === 1) return null;
  const rc = (i) => [Math.floor(i / p.cols), i % p.cols];
  const down = [], roots = sol.roots.map(rc);
  for (let i = 0; i < n; i++) if (sol.down[i]) down.push(rc(i));
  return {
    difficulty: diff, rows: p.rows, cols: p.cols, k,
    deps: p.deps,
    clues: clues.filter((c) => c.kind === "num").map((c) => [...rc(c.i), c.n]).sort((a, b) => a[0] - b[0] || a[1] - b[1]),
    known: knownCl.map((c) => [...rc(c.i), c.down ? "down" : "up"]).sort((a, b) => a[0] - b[0] || a[1] - b[1]),
    solution: { roots, down },
    _meta: { trials: res.trials, candidates: sets.length, nclues: clues.length },
  };
}

function make(diff, k, tag) {
  for (let t = 0; t < 200000; t++) {
    const p = tryMake(diff, k);
    if (p) { process.stderr.write(`${tag}: ok after ${t + 1} tries ${JSON.stringify(p._meta)}\n`); return p; }
  }
  throw new Error("failed " + tag);
}

// ---------- verification ----------
function toInternal(pz) {
  const p = { rows: pz.rows, cols: pz.cols, k: pz.k, deps: pz.deps };
  const n = p.rows * p.cols;
  const clues = [
    ...pz.clues.map(([r, c, v]) => { const i = r * p.cols + c; return { kind: "num", i, n: v, deps: depIdx(p, i) }; }),
    ...pz.known.map(([r, c, s]) => ({ kind: "known", i: r * p.cols + c, down: s === "down" ? 1 : 0 })),
  ];
  return { p, n, clues };
}

function verifyPuzzle(pz) {
  const { p, n, clues } = toInternal(pz);
  const problems = [];
  // structure
  if (pz.deps.length !== n) problems.push("deps length");
  pz.deps.forEach((ds, i) => {
    if (ds.length > 2) problems.push(`cell ${i} has >2 deps`);
    const r = Math.floor(i / p.cols), c = i % p.cols;
    for (const [dr, dc] of ds) {
      if (Math.abs(dr) + Math.abs(dc) !== 1) problems.push(`cell ${i} non-orthogonal dep`);
      const rr = r + dr, cc = c + dc;
      if (rr < 0 || rr >= p.rows || cc < 0 || cc >= p.cols) problems.push(`cell ${i} dep off-grid`);
    }
  });
  // acyclic (Kahn)
  const indeg = new Array(n).fill(0);
  for (let i = 0; i < n; i++) for (const j of depIdx(p, i)) indeg[j]++;
  const q = [...Array(n).keys()].filter((i) => !indeg[i]); let seen = 0;
  while (q.length) { const i = q.pop(); seen++; for (const j of depIdx(p, i)) if (!--indeg[j]) q.push(j); }
  if (seen !== n) problems.push("cycle");
  // exhaustive uniqueness over ALL K-subsets of cells (not only antichains):
  // a subset is a consistent root set if every chosen cell has all deps UP and all clues hold.
  const single = [...Array(n).keys()].map((i) => downFromRootIdx(p, [i]));
  let count = 0, found = null, cur = [];
  const rec = (start) => {
    if (cur.length === p.k) {
      const down = new Uint8Array(n);
      for (const a of cur) for (let i = 0; i < n; i++) if (single[a][i]) down[i] = 1;
      for (const a of cur) for (const j of depIdx(p, a)) if (down[j]) return; // root must have all deps UP
      if (clues.every((cl) => clueHolds(cl, down))) { count++; found = { roots: cur.slice(), down }; }
      return;
    }
    for (let i = start; i < n; i++) { cur.push(i); rec(i + 1); cur.pop(); }
  };
  rec(0);
  if (count !== 1) problems.push(`consistent root sets = ${count}`);
  else {
    const want = pz.solution.roots.map(([r, c]) => r * p.cols + c).sort((a, b) => a - b);
    if (JSON.stringify(want) !== JSON.stringify(found.roots)) problems.push("solution roots mismatch");
    const grid = propagate(pz, pz.solution.roots);
    const listed = new Set(pz.solution.down.map(([r, c]) => r * p.cols + c));
    for (let i = 0; i < n; i++) if (grid[Math.floor(i / p.cols)][i % p.cols] !== listed.has(i)) problems.push("solution.down mismatch at " + i);
  }
  // check() on the solution
  const marks = [...Array(p.rows)].map(() => new Array(p.cols).fill(0));
  for (const [r, c] of pz.solution.down) marks[r][c] = 1;
  for (const [r, c] of pz.solution.roots) marks[r][c] = 2;
  const ch = check(pz, marks);
  if (!ch.solved) problems.push("check(solution) not solved: " + JSON.stringify(ch.errors));
  // check() must reject an empty board and a wrong root
  if (check(pz, marks.map((row) => row.map(() => 0))).solved) problems.push("empty board solved?!");
  // an extra root must be flagged
  const extra = marks.map((row) => row.slice());
  outer: for (let r = 0; r < p.rows; r++) for (let c = 0; c < p.cols; c++) if (!extra[r][c]) { extra[r][c] = 2; break outer; }
  const ce = check(pz, extra);
  if (ce.solved || !ce.errors.some((e) => e.type === "too_many_roots")) problems.push("extra root not flagged");
  // every other self-consistent root set, fully propagated, must be rejected
  for (let i = 0; i < n; i++) {
    if (pz.solution.roots.some(([r, c]) => r * p.cols + c === i)) continue;
    const alt = pz.solution.roots.slice(1).concat([[Math.floor(i / p.cols), i % p.cols]]);
    const g = propagate(pz, alt);
    const m2 = g.map((row) => row.map((d) => (d ? 1 : 0)));
    for (const [r, c] of alt) m2[r][c] = 2;
    if (check(pz, m2).solved) problems.push("wrong root set accepted: " + JSON.stringify(alt));
  }
  // logic-solver result
  const res = makeSolver(p, clues).solve();
  return { problems, trials: res.trials, logicSolved: res.solved };
}

// ---------- main ----------
const args = process.argv.slice(2);
if (args.includes("--show")) {
  // ASCII view: arrows ^ v < > after the cell token; number clue, G/R = known up/down
  const data = JSON.parse(readFileSync(new URL("../../data/postmortem.json", import.meta.url)));
  const pz = data.puzzles.find((x) => x.id === args[args.indexOf("--show") + 1]);
  const sol = args.includes("--solution");
  const arrow = { "-1,0": "^", "1,0": "v", "0,-1": "<", "0,1": ">" };
  console.log(`${pz.id} ${pz.difficulty} ${pz.rows}x${pz.cols} K=${pz.k}`);
  for (let r = 0; r < pz.rows; r++) {
    let line = "";
    for (let c = 0; c < pz.cols; c++) {
      const i = r * pz.cols + c;
      const num = pz.clues.find(([a, b]) => a === r && b === c);
      const kn = pz.known.find(([a, b]) => a === r && b === c);
      let tok = num ? String(num[2]) : kn ? (kn[2] === "up" ? "G" : "R") : ".";
      if (sol) {
        const isRoot = pz.solution.roots.some(([a, b]) => a === r && b === c);
        const isDown = pz.solution.down.some(([a, b]) => a === r && b === c);
        tok += isRoot ? "@" : isDown ? "x" : " ";
      }
      line += (tok + pz.deps[i].map((d) => arrow[d.join()]).join("")).padEnd(sol ? 6 : 5);
    }
    console.log(`${r}: ${line}`);
  }
  process.exit(0);
}
if (args.includes("--verify")) {
  const data = JSON.parse(readFileSync(new URL("../../data/postmortem.json", import.meta.url)));
  let bad = 0;
  for (const pz of data.puzzles) {
    const v = verifyPuzzle(pz);
    const ok = v.problems.length === 0 && v.logicSolved;
    if (!ok) bad++;
    console.log(`${pz.id.padEnd(5)} ${pz.difficulty.padEnd(6)} ${pz.rows}x${pz.cols} k=${pz.k} ` +
      `clues=${pz.clues.length} known=${pz.known.length} hypotheses=${v.trials} ` +
      (ok ? "OK (unique, check() solved, logic-solvable)" : "FAIL " + v.problems.join("; ")));
  }
  console.log(bad ? `${bad} puzzle(s) FAILED` : `all ${data.puzzles.length} puzzles verified`);
  process.exit(bad ? 1 : 0);
} else {
  const si = args.indexOf("--seed");
  rnd = mulberry32(si >= 0 ? +args[si + 1] : 20261030);
  const plan = [
    ["easy", 1, "p-e1"], ["easy", 1, "p-e2"], ["easy", 1, "p-e3"], ["easy", 1, "p-e4"],
    ["medium", 1, "p-m1"], ["medium", 1, "p-m2"], ["medium", 2, "p-m3"], ["medium", 2, "p-m4"],
    ["hard", 2, "p-h1"], ["hard", 2, "p-h2"], ["hard", 3, "p-h3"], ["hard", 3, "p-h4"],
  ];
  const puzzles = plan.map(([d, k, id]) => { const { _meta, ...p } = make(d, k, id); return { id, ...p }; });
  const out = { genre: "postmortem", rules_en: RULES_EN, rules_ru: RULES_RU, puzzles };
  // compact JSON: one line per puzzle field
  const J = JSON.stringify;
  const json = "{\n" +
    `  "genre": ${J(out.genre)},\n  "rules_en": ${J(out.rules_en)},\n  "rules_ru": ${J(out.rules_ru)},\n  "puzzles": [\n` +
    puzzles.map((p) => "    {\n" + Object.entries(p).map(([k, v]) => `      ${J(k)}: ${J(v)}`).join(",\n") + "\n    }").join(",\n") +
    "\n  ]\n}";
  writeFileSync(new URL("../../data/postmortem.json", import.meta.url), json + "\n");
  console.log("wrote puzzles.json");
}
