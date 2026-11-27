> In this repo: the generator reads and writes `../../data/postmortem.json` (served by the page) and imports the checker from `../../rules/postmortem.js`. Wherever this file says `puzzles.json` or `rules.js`, read those paths.

# Postmortem / Постмортем

An original SRE-themed deduction puzzle: find the root causes of an outage from a few monitoring signals.

## Rules (EN)

1. Every cell is a service. Arrows show which neighbouring services it calls (0–2 arrows per cell; no call cycles).
2. Exactly **K** services are **root causes**. A root cause fails on its own, and everything it calls is UP.
3. A service is **DOWN** if it is a root cause or calls a DOWN service. All other services are **UP**.
4. A **number** in a cell is how many of the services it calls are DOWN.
5. **Green** cells are known UP. **Red** cells are known DOWN.
6. Mark every DOWN service and circle the K root causes. There is exactly one answer.

## Правила (RU)

1. Каждая клетка — сервис. Стрелки показывают, какие соседние сервисы он вызывает (0–2 стрелки на клетку, циклов нет).
2. Ровно **K** сервисов — **первопричины**. Первопричина падает сама, а всё, что она вызывает, работает.
3. Сервис **лежит**, если он первопричина или вызывает лежащий сервис. Все остальные **работают**.
4. **Число** в клетке — сколько из вызываемых ею сервисов лежит.
5. **Зелёные** клетки точно работают, **красные** точно лежат.
6. Отметьте все лежащие сервисы и обведите K первопричин. Ответ единственный.

## Change from the original brief

**Rule 2 is added:** a root cause must have all its dependencies UP.
Without it the puzzle can never be unique. If root A calls root B, A is DOWN anyway, so "A is a root" changes no clue.
You could then swap A for any other DOWN cell and every clue would still hold.
With rule 2, the roots are exactly the DOWN cells whose dependencies are all UP. Each root set gives exactly one DOWN set and the reverse is also true.
This is also the real SRE meaning of a root cause: the failure starts there and is not caused by something it calls.

## Files

| file | what |
|---|---|
| `rules.js` | browser ES module, no deps: `propagate(puzzle, roots)` → `boolean[r][c]` DOWN grid; `check(puzzle, marks)` → `{complete, solved, errors:[{type,row,col}]}`; also `depIdx`, `downFromRootIdx` |
| `gen.js` | generator, exhaustive verifier and ASCII viewer (Node 22, imports `rules.js`) |
| `puzzles.json` | 12 puzzles: 4 easy (4×4, K=1), 4 medium (5×5, K=1,1,2,2), 4 hard (6×6, K=2,2,3,3) |
| `package.json` | only `{"type":"module"}`, no dependencies |

`marks[r][c]`: `0` none, `1` down, `2` root (counts as down). `check` error types:
- `too_many_roots`: on every marked root, when more than K roots are marked.
- `known_up_marked`
- `clue_over`: more neighbours are marked down than the number says.
- `root_has_down_dep`
- `down_without_cause`: the cell is marked down but none of its dependencies is marked down.
- `missing_down`: the cell is unmarked but a dependency is marked down.
- `clue_under` and `known_down_unmarked`: reported only once `complete`.

`complete` means exactly K roots are marked. `solved` means complete with no errors. The check rules out every other configuration, and the answer is unique, so `solved` holds only for the intended solution.
The UI may want to show only some error types while the player is still marking. `missing_down` in particular will fire while the player is working down a chain.

## Generation

1. **DAG.** Shuffle the cells into a random topological order. A cell may only call orthogonal neighbours that come later in the order, so there are no cycles. Each cell gets 0 arrows (12%), 1 arrow (43%) or 2 arrows (45%), as far as its eligible neighbours allow.
2. **Candidate space.** List every K-subset of cells that is a valid root set (no root reaches another), with its DOWN set. At 6×6 with K=3 that is at most C(36,3) = 7140 subsets. Then pick a solution whose DOWN set is a reasonable size. Every root must take down at least one other service.
3. **Clues.** Every cell with a dependency has a possible number clue. Every cell also has a possible known-state clue. Known-UP costs 2 and known-DOWN costs 3.5; a number costs 1, so numbers are preferred.
   - Add clues greedily, picking the one that removes the most candidate root sets per unit of cost, until only one root set is left.
   - Remove redundant clues, the expensive ones first.
4. **Difficulty tuning.** `gen.js` has a human-style logic solver with two levels:
   - **Propagation.** Local rules: UP cell ⇒ its dependencies are UP; a DOWN dependency ⇒ the cell is DOWN; a DOWN cell with all dependencies UP ⇒ it is a root; a non-root DOWN cell with one undecided dependency ⇒ that dependency is DOWN; number-clue saturation; the K root budget.
   - **Hypotheses.** Assume one cell is UP or DOWN, propagate, and if that leads to a contradiction, set the cell the other way.

   The minimal clue set from step 3 is usually too sparse to solve this way. So the generator adds the number clues that cut the hypothesis count the most. It then removes any clue that is not needed for uniqueness or for staying inside the difficulty window.
5. **Buckets and filters:**

   | bucket | grid | K | hypothesis steps | clues | known cells (max / of which red) |
   |---|---|---|---|---|---|
   | easy | 4×4 | 1 | 0 (propagation alone) | 4–8 | 1 / 0 |
   | medium | 5×5 | 1–2 | 1–3 | 5–11 | 2 / 1 |
   | hard | 6×6 | 2–3 | 3–8 | 6–14 | 2 / 1 |

   Anti-trivial filter: no single clue on its own may pin down the answer. This also rules out "one red cell reveals everything".

## Uniqueness verification

`node gen.js --verify` re-checks `puzzles.json` from scratch, without using the generator's data structures:
- **Structure:** ≤2 arrows per cell, arrows orthogonal and on the grid, and the graph is acyclic (Kahn's algorithm).
- **Uniqueness:** it tries all C(R·C, K) subsets of cells, not just antichains. A subset counts as consistent if every chosen root has all its dependencies UP and every number and known clue holds. Exactly one subset must pass, and it must equal `solution.roots`. `solution.down` must equal `propagate(solution.roots)`.
- **`check()` on the solution:** it must return `solved`.
- **`check()` negatives:** it must reject an empty board and flag an extra root. It must also reject every alternative obtained by swapping one root, fully propagated.
- **Logic solvability:** the logic solver must solve the puzzle (propagation plus single-cell hypotheses).

## Commands

```sh
node gen.js                    # regenerate puzzles.json (default seed 20261030, ~5 s)
node gen.js --seed 42          # another set
node gen.js --verify           # self-test: exit code 0 if all 12 puzzles pass
node gen.js --show p-e1 --solution   # ASCII view (^ v < > = arrows, G/R = known, x down, @ root)
```

## Worked example (p-e1, K=1)

```
0: .     . <v  . >v  .
1: 1 v>  .     . v   . ^v
2: . >v  . ^>  .     . <
3: G     1 <^  1 ><  . ^
```
1. (3,1)=1 calls (3,0), which is green (UP), and (2,1). So (2,1) is DOWN.
2. (3,2)=1 calls (3,1) and (3,3). (3,1) has a nonzero number, so it is DOWN. That uses up the 1, so (3,3) is UP. Then (2,3) is UP, and so is (2,2).
3. (2,0) calls (2,1), which is DOWN, so (2,0) is DOWN. (1,0)=1 calls (2,0) and (1,1), so (1,1) is UP.
4. All of (2,1)'s dependencies, (1,1) and (2,2), are UP, so (2,1) is the root (K=1).
5. The DOWN services are (2,1), plus everything that calls it, directly or through other services: (2,0), (1,0), (3,1), (3,2). Every other service is UP.
