// Barbell («Загрузка штанги») — rule checker. Dependency-free ES module.
//
// Grid cell values: null/undefined = undecided, 0 = empty, otherwise a plate (kg).
// Row r is one side of a bar: column 0 is at the collar, last column is the outer end.

export const PLATES = [25, 20, 15, 10, 5, 2.5];
export const DEFAULT_PLATES = [25, 20, 15, 10, 5];

const EPS = 1e-9;
const isPlate = (v) => typeof v === 'number' && v > 0;
const eq = (a, b) => Math.abs(a - b) < EPS;

/**
 * check(puzzle, grid) -> { complete, solved, errors:[{type,row?,col?}] }
 * Error types:
 *   'plate'  — value not in the puzzle's plate set
 *   'gap'    — plate placed after an empty cell (plates must start at the collar)
 *   'order'  — plate heavier than the one closer to the collar
 *   'pair'   — third (or more) copy of a value in a row
 *   'rowSum' — row total exceeds the clue, or row is fully decided and total != clue
 *   'colSum' — same for columns
 *   'given'  — a given cell was changed
 * complete: no undecided (null) cells. solved: complete and no errors.
 */
export function check(puzzle, grid) {
  const R = puzzle.rows, C = puzzle.cols;
  const allowed = puzzle.plates || DEFAULT_PLATES;
  const errors = [];
  let complete = true;
  const cell = (r, c) => (grid[r] ? grid[r][c] : null);

  for (let r = 0; r < R; r++) {
    let sum = 0, undecided = false, seenEmpty = false, prev = Infinity;
    const counts = new Map();
    for (let c = 0; c < C; c++) {
      const v = cell(r, c);
      if (v === null || v === undefined) { undecided = true; complete = false; seenEmpty = true; continue; }
      if (v === 0) { seenEmpty = true; continue; }
      if (!allowed.some((p) => eq(p, v))) errors.push({ type: 'plate', row: r, col: c });
      // A null before a plate is "not yet decided", not a gap; only report a gap after an explicit 0.
      if (seenEmpty && hasExplicitEmptyBefore(grid, r, c)) errors.push({ type: 'gap', row: r, col: c });
      if (v > prev + EPS) errors.push({ type: 'order', row: r, col: c });
      prev = v;
      const k = String(v);
      counts.set(k, (counts.get(k) || 0) + 1);
      if (counts.get(k) > 2) errors.push({ type: 'pair', row: r, col: c });
      sum += v;
    }
    const clue = puzzle.rowClues ? puzzle.rowClues[r] : null;
    if (clue !== null && clue !== undefined) {
      if (sum > clue + EPS || (!undecided && !eq(sum, clue))) errors.push({ type: 'rowSum', row: r });
    }
  }

  for (let c = 0; c < C; c++) {
    const clue = puzzle.colClues ? puzzle.colClues[c] : null;
    if (clue === null || clue === undefined) continue;
    let sum = 0, undecided = false;
    for (let r = 0; r < R; r++) {
      const v = cell(r, c);
      if (v === null || v === undefined) undecided = true;
      else if (isPlate(v)) sum += v;
    }
    if (sum > clue + EPS || (!undecided && !eq(sum, clue))) errors.push({ type: 'colSum', col: c });
  }

  for (const [r, c, v] of puzzle.givens || []) {
    const g = cell(r, c);
    if (g !== null && g !== undefined && !eq(g, v)) errors.push({ type: 'given', row: r, col: c });
  }

  return { complete, solved: complete && errors.length === 0, errors };
}

function hasExplicitEmptyBefore(grid, r, c) {
  for (let k = 0; k < c; k++) if (grid[r][k] === 0) return true;
  return false;
}
