// Postmortem — rules engine. Dependency-free ES module (browser + Node).
//
// Puzzle shape: { rows, cols, k, deps, clues, known, solution? }
//   deps[r*cols+c] = [[dr,dc], ...]  — services that cell (r,c) calls (0–2, orthogonal)
//   clues = [[r,c,n], ...]           — n = how many direct dependencies of (r,c) are DOWN
//   known = [[r,c,"up"|"down"], ...] — monitoring states
//
// Semantics: a root cause is a failing service whose own dependencies are all UP.
// A service is DOWN iff it is a root cause or calls a DOWN service.

/** Dependency target indices of cell i. */
export function depIdx(p, i) {
  const r = Math.floor(i / p.cols), c = i % p.cols;
  return p.deps[i].map(([dr, dc]) => (r + dr) * p.cols + (c + dc));
}

/** Boolean array (row-major) of DOWN cells given root indices. */
export function downFromRootIdx(p, rootIdx) {
  const n = p.rows * p.cols;
  const down = new Uint8Array(n);
  for (const i of rootIdx) down[i] = 1;
  const memo = new Int8Array(n).fill(-1);
  const visit = (i) => {
    if (memo[i] !== -1) return memo[i];
    let v = down[i];
    for (const j of depIdx(p, i)) if (visit(j)) v = 1;
    return (memo[i] = v);
  };
  for (let i = 0; i < n; i++) down[i] = visit(i);
  return down;
}

/** propagate(puzzle, roots:[[r,c],...]) -> boolean[rows][cols] (true = DOWN). */
export function propagate(p, roots) {
  const d = downFromRootIdx(p, roots.map(([r, c]) => r * p.cols + c));
  const out = [];
  for (let r = 0; r < p.rows; r++) {
    const row = [];
    for (let c = 0; c < p.cols; c++) row.push(!!d[r * p.cols + c]);
    out.push(row);
  }
  return out;
}

/**
 * check(puzzle, marks) — marks[r][c] in {0 none, 1 down, 2 root (implies down)}.
 * Returns { complete, solved, errors:[{type,row,col}] }.
 * Error types (all are definite contradictions with the current marks):
 *   too_many_roots          more roots marked than k (reported on every marked root)
 *   known_up_marked         a known-UP cell is marked down/root
 *   clue_over               more dependencies marked down than the number says
 *   clue_under              (only when complete) fewer marked down deps than the number
 *   known_down_unmarked     (only when complete) a known-DOWN cell left unmarked
 *   root_has_down_dep       a root marks a cell whose dependency is marked down
 *   down_without_cause      a cell marked down (not root) but none of its deps marked down
 *   missing_down            a cell left unmarked although one of its deps is marked down
 * complete = exactly k roots are marked. solved = complete and no errors.
 */
export function check(p, marks) {
  const { rows, cols } = p;
  const errors = [];
  const at = (i) => marks[Math.floor(i / cols)][i % cols] | 0;
  const isDown = (i) => at(i) > 0;
  const err = (type, i) => errors.push({ type, row: Math.floor(i / cols), col: i % cols });
  const n = rows * cols;

  const rootIdx = [];
  for (let i = 0; i < n; i++) if (at(i) === 2) rootIdx.push(i);
  const complete = rootIdx.length === p.k;
  if (rootIdx.length > p.k) for (const i of rootIdx) err("too_many_roots", i);

  for (const [r, c, s] of p.known || []) {
    const i = r * cols + c;
    if (s === "up" && isDown(i)) err("known_up_marked", i);
    if (s === "down" && !isDown(i) && complete) err("known_down_unmarked", i);
  }
  for (const [r, c, num] of p.clues || []) {
    const i = r * cols + c;
    const cnt = depIdx(p, i).filter(isDown).length;
    if (cnt > num) err("clue_over", i);
    else if (cnt < num && complete) err("clue_under", i);
  }
  for (let i = 0; i < n; i++) {
    const anyDepDown = depIdx(p, i).some(isDown);
    const m = at(i);
    if (m === 2 && anyDepDown) err("root_has_down_dep", i);
    if (m === 1 && !anyDepDown) err("down_without_cause", i);
    if (m === 0 && anyDepDown) err("missing_down", i);
  }
  return { complete, solved: complete && errors.length === 0, errors };
}
