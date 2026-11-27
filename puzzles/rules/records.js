// Records («Рекорды») — live rule checker. Dependency-free browser ES module.
//
// check(puzzle, grid) -> { complete, solved, errors }
//   puzzle: { n, top, bottom, left, right, deload: [[r,c]...], givens: [[r,c,v]...] }
//   grid:   n×n array of numbers, 0 = empty
// Error objects:
//   { type: "row-duplicate", row }            same digit twice in a row
//   { type: "col-duplicate", col }            same digit twice in a column
//   { type: "range", row, col }               digit outside 1..n
//   { type: "given", row, col }               a given digit was changed
//   { type: "deload", row, col }              ▼ cell not smaller than both row neighbours (checked once both neighbours and the cell are filled)
//   { type: "clue", side, row|col }           record count wrong (checked only when the line is full)
// side is "top" | "bottom" | "left" | "right"; top/bottom carry col, left/right carry row.

/** Number of new records when reading the sequence in order (first value always counts). */
export function records(seq) {
  let max = 0, cnt = 0;
  for (const v of seq) if (v > max) { max = v; cnt++; }
  return cnt;
}

export function check(puzzle, grid) {
  const n = puzzle.n;
  const errors = [];
  const at = (r, c) => (grid[r] && grid[r][c]) | 0;
  let complete = true;

  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      const v = at(r, c);
      if (v === 0) complete = false;
      else if (v < 1 || v > n) errors.push({ type: "range", row: r, col: c });
    }

  for (const [r, c, v] of puzzle.givens || [])
    if (at(r, c) !== 0 && at(r, c) !== v) errors.push({ type: "given", row: r, col: c });

  const dupes = (vals) => {
    const seen = new Set();
    for (const v of vals) { if (!v) continue; if (seen.has(v)) return true; seen.add(v); }
    return false;
  };
  const row = (r) => Array.from({ length: n }, (_, c) => at(r, c));
  const col = (c) => Array.from({ length: n }, (_, r) => at(r, c));

  for (let r = 0; r < n; r++) if (dupes(row(r))) errors.push({ type: "row-duplicate", row: r });
  for (let c = 0; c < n; c++) if (dupes(col(c))) errors.push({ type: "col-duplicate", col: c });

  for (const [r, c] of puzzle.deload || []) {
    const v = at(r, c), a = at(r, c - 1), b = at(r, c + 1);
    if (v && a && b && !(v < a && v < b)) errors.push({ type: "deload", row: r, col: c });
  }

  const full = (line) => line.every((v) => v > 0);
  const clue = (arr, i) => (arr && arr[i] != null ? arr[i] : null);
  for (let i = 0; i < n; i++) {
    const R = row(i), C = col(i);
    if (full(R)) {
      const L = clue(puzzle.left, i), Rt = clue(puzzle.right, i);
      if (L != null && records(R) !== L) errors.push({ type: "clue", side: "left", row: i });
      if (Rt != null && records([...R].reverse()) !== Rt) errors.push({ type: "clue", side: "right", row: i });
    }
    if (full(C)) {
      const T = clue(puzzle.top, i), B = clue(puzzle.bottom, i);
      if (T != null && records(C) !== T) errors.push({ type: "clue", side: "top", col: i });
      if (B != null && records([...C].reverse()) !== B) errors.push({ type: "clue", side: "bottom", col: i });
    }
  }

  return { complete, solved: complete && errors.length === 0, errors };
}
