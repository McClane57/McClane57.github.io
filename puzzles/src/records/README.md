> In this repo: the generator reads and writes `../../data/records.json` (served by the page) and imports the checker from `../../rules/records.js`. Wherever this file says `puzzles.json` or `rules.js`, read those paths.

# Records («Рекорды»)

## Rules (EN)

1. Fill the N×N grid with digits 1..N (weekly training loads). Each row and each column contains every digit exactly once.
2. A number outside the grid says how many times a **new record** is set when you read that row or column from that side. A value is a record if it is larger than every value before it. The first value always counts.
3. **Deload ▼**: the digit in a ▼ cell is smaller than both its left and right neighbours.
4. Given digits are fixed. Every puzzle has exactly one solution.

## Правила (RU)

1. Впишите в сетку N×N цифры от 1 до N (недельные нагрузки). В каждой строке и каждом столбце каждая цифра встречается ровно один раз.
2. Число за краем сетки показывает, сколько раз ставится **новый рекорд**, если читать строку или столбец с этой стороны. Значение — рекорд, если оно больше всех предыдущих. Первое значение всегда рекорд.
3. **Разгрузка ▼**: цифра в клетке с ▼ меньше обеих соседних цифр слева и справа.
4. Данные цифры менять нельзя. У каждой головоломки ровно одно решение.

## Files

- `gen.js`: generator and solvers. `node gen.js [--seed 2026] [--out puzzles.json]`
- `puzzles.json`: 12 puzzles. Easy: 4×4 with 0 or 1 ▼. Medium: 5×5. Hard: 6×6, with 2–3 ▼. Each puzzle has `top/bottom/left/right` arrays (null means no clue) with indices `[r,c]` from 0, `deload: [[r,c]]`, `givens: [[r,c,v]]`, `solution`. It also has a `stats` field with grading data, which the page can ignore.
- `rules.js`: browser ES module, `check(puzzle, grid)` (0 = empty). It returns `{complete, solved, errors}`. Error types are `row-duplicate`, `col-duplicate`, `deload` (checked when the cell and both neighbours are filled), `clue` with `side` (checked when the line is full), `given` and `range`.

## How uniqueness is verified

- **Generation.** The generator starts from a random Latin square and computes all edge clues. It puts ▼ only where the solution has a dip, at most one per row and never at a row end. If needed it adds givens until the puzzle is unique. Then it greedily removes givens first, then clues. A removal is kept only if two things still hold. First, a propagation and full backtracking solver finds exactly 1 solution (it stops counting at 2). Second, the logic grader solves the puzzle without guessing. Finally, any ▼ that can be removed is dropped, so every ▼ left is needed.
- **Verification (`--verify`).** Two independent solvers must each report exactly 1 solution:
  1. the propagation and backtracking counter;
  2. a brute-force row-permutation enumerator with no propagation, which counts every solution to the end.

  Verification also checks that the solution found is the stored one and that `check(puzzle, solution).solved === true`. It checks that `check` reports no errors on an empty grid and flags a grid with two digits swapped.
- **Difficulty.** The logic grader uses human rules first: naked and hidden singles, clue bounds (with clue k, the cell at distance d from the edge is at most N−k+1+d), and ▼ bounds. Only when stuck does it use "line enumeration", which tries all permutations of one row or column against the clues and ▼. Easy puzzles are solved by the basic rules alone. Medium and hard puzzles need line enumeration and are ranked by how much they need it (`stats.score`). No shipped puzzle needs guessing.

## Self-test

```sh
cd /home/claude/puzzles/records && node gen.js --verify
```
