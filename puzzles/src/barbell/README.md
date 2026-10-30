> In this repo: the generator reads and writes `../../data/barbell.json` (served by the page) and imports the checker from `../../rules/barbell.js`. Wherever this file says `puzzles.json` or `rules.js`, read those paths.

# Barbell / «Загрузка штанги»

An original logic-puzzle genre. Files:

- `gen.js`: generator, exhaustive solver, logic-only propagator, and `--verify`
- `rules.js`: browser ES module, `check(puzzle, grid)` and `PLATES`
- `puzzles.json`: 12 puzzles (4 easy 4×4, 4 medium 5×5, 2 hard 6×5, 2 hard 6×6)
- `package.json`: only `{"type":"module"}`, so Node treats the `.js` files as ES modules

## Rules (EN)

1. Each row is one side of a barbell. Column 1 touches the collar.
2. Put a plate (25, 20, 15, 10 or 5 kg, plus 2.5 if the puzzle lists it) in a cell, or leave the cell empty.
3. In every row the plates start at the collar with no gaps, and they never get heavier going outward.
4. A row can hold each plate value at most twice.
5. A number to the right of a row is that row's total. A number under a column is that column's total.
6. Pre-printed plates are fixed. There is exactly one solution.

## Правила (RU)

1. Каждая строка — одна сторона штанги. Первый столбец прилегает к замку.
2. В клетку ставится блин (25, 20, 15, 10 или 5 кг, а также 2,5, если он указан) или клетка остаётся пустой.
3. В каждой строке блины идут от замка без пропусков и наружу не становятся тяжелее.
4. Каждый номинал встречается в строке не более двух раз.
5. Число справа от строки — её суммарный вес. Число под столбцом — сумма столбца.
6. Напечатанные блины даны заранее. Решение единственное.

## Rule changes / clarifications (change log)

- **No changes to the core rules.** None were needed to get unique, deducible puzzles.
- I added a `plates` field to each puzzle so it is explicit whether 2.5 kg is allowed. Only the hard puzzles use 2.5. If `plates` is missing, it defaults to 25/20/15/10/5.
- An empty row is legal. The generator never produces one, though: every row has at least one plate.
- The generator adds one rule of its own that players never see: every published puzzle must be solvable by the logic-only propagator below, so no guessing is needed. Givens are capped at 1 for easy puzzles and 2 for medium and hard.
- `stats` (`logicRounds`, `searchNodes`, `score`) is an extra field kept for information.

## Grid format for `check`

`grid[r][c]` is one of: `null` (undecided), `0` (marked empty), or a plate value in kg.
`complete` means there are no `null` cells. `solved` means the grid is complete and has no errors.

The error types are:

- `gap`: a plate comes after an explicit `0`
- `order`: a plate is heavier than the one before it
- `pair`: the third copy of a value in a row
- `rowSum` / `colSum`: the total is over the clue, or the line has no `null` cells and its total does not equal the clue
- `given`: a given cell was changed
- `plate`: the value is not in the puzzle's plate set

## How uniqueness is verified

- **Rows as patterns.** A legal row is a non-increasing multiset with each value used at most twice, so every legal row of length C can be listed in advance. There are only a few hundred of them.
- **Exhaustive search.** The solver filters each row's patterns by the row clue and the givens. It then backtracks row by row, starting with the row that has the fewest patterns. At each step it prunes using per-column lower and upper bounds taken from the rows not yet placed. It searches the whole space and stops once it finds 2 solutions. Weights are integers in units of 2.5 kg, so there are no floating-point issues.
- **Logic-only check (`propagate`).** Two steps repeat until nothing changes:
  - (a) For each cell, collect the values it can take across its row's remaining patterns.
  - (b) In each clued column, remove any value whose column total cannot be completed from the other cells' options. This is a subset-sum check.

  A puzzle passes if every row ends with exactly one pattern.
- **Generation.**
  - Draw a random legal grid and attach all row and column clues.
  - Add givens one at a time until the puzzle is unique and logic-solvable. Each new given is the cell that helps most.
  - Greedily remove givens, then row and column clues, in random order. A removal is kept only if the puzzle stays both unique and logic-solvable.
- **Difficulty.** The score combines several measures:
  - the number of propagation rounds
  - the number of column eliminations
  - how ambiguous the rows are at the start
  - log₂ of the exhaustive-search nodes
  - the number of hidden clues

  Easy puzzles come from the lower quartile of the 4×4 pool, medium from the middle of the 5×5 pool, and hard are the top scorers among 6×5 and 6×6 puzzles that use 2.5.

## Self-test

```
cd /home/claude/puzzles/barbell && node gen.js --verify
```

For each puzzle this checks four things:

- the solver finds exactly 1 solution, and it matches the stored one
- `check(puzzle, solution).solved === true`
- the logic-only propagator solves the puzzle
- a grid with one plate changed is rejected

To regenerate, run `node gen.js [--seed N]`. The output is deterministic and the default seed is 2026. It takes about 2.5 minutes.
