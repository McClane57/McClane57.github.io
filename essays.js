// Essays for grishchenko.org — edit text here; the page renders from this file.
// Each essay: slug, title, dek, meta, cat, lab (which lab section proves it), body (array of blocks).
// Block kinds: p (paragraph, inline <b>/<a>/<code> allowed), h (section heading), q (pull quote),
// pre (mono block; add nowrap: true for diagrams that must keep their alignment and scroll instead of wrapping),
// stat (row of {n, l}), ph (placeholder you still have to write).
window.ESSAYS = [
  {
    slug: 'proof', cat: 'rel', labSec: 'arch', draft: true,
    title: "The proof I can't link to",
    dek: "Every other page on this site links to something you can click — a repo, a model, a paper. This one doesn't.",
    date: '4 Sep 2026', tags: ['google', 'reliability'],
    body: [
      { k: 'p', t: "What I'm about to describe is internal to Google, under NDA. The closest thing to a receipt is a performance doc nobody's going to show you. So here's the story instead." },
      { k: 'split', cant: '‹the exact trigger incident› · ‹the implementation› · ‹the codebase›', can: 'Built it alone. It is in production. It now runs across <b>thousands</b> of internal services.' },
      { k: 'h', t: '1. The part that kept repeating' },
      { k: 'ph', t: "Describe the recurring incident / toil pattern you kept hitting as SRE — the thing that made you think “a human shouldn't have to do this every time.”" },
      { k: 'h', t: '2. Why an agent, not another runbook' },
      { k: 'p', t: "I didn't reach for a model first. A runbook is just domain knowledge nobody formalized into something a system could act on — so that's what I did first: wrote down ‹the class of decision it's allowed to make, and the boundary it can't cross› before anything got to touch a live service. The model came last." },
      { k: 'p', t: 'Same order as everywhere else on this site. I just did it here first, before I had a name for it.' },
      { k: 'q', t: 'The Google version of this story has no linter and no lookup matrix. It has ‹the equivalent guardrail›. Same idea, different noun.' },
      { k: 'h', t: "3. What it's worth, without the receipts" },
      { k: 'stat', rows: [{ n: '1000s', l: 'internal services hardened' }, { n: '1', l: 'engineer who built it' }, { n: '‹X%›', l: '‹the metric you are proudest of›' }] },
      { k: 'p', t: "I can't send you the diff. I can tell you it's the same method as every other page here — domain, then constraints, then model — and that Google's internal services have been quietly running on it since ‹date›." }
    ]
  },
  {
    slug: 'talks', cat: 'ai', labSec: 'arch',
    title: "The model doesn't compute. It talks.",
    dek: 'How a powerlifting coach fits in 3.18 GB on an iPhone — and why it physically cannot lie about the weight on the bar.',
    date: '4 Sep 2026', tags: ['ai systems', 'on-device'],
    body: [
      { k: 'p', t: "The main problem with an LLM in a training app isn't that it's dumb. It's that it computes. Ask any model “what do I bench today at minus five percent from 140” and it answers. Confidently. Sometimes “133”. There are no plates for 133. There is 132.5. That's not a model inaccuracy — that's a broken product: an athlete at the bar with a number that cannot be loaded." },
      { k: 'p', t: 'So the first architectural decision: <b>the model is not a source of facts. Not one number.</b>' },
      { k: 'h', t: 'Rules decide, the model phrases' },
      { k: 'p', t: 'Inside the app is a deterministic engine — it knows the plan, weeks to the meet, percentages, rounding to 2.5 kg, plates per side. It computes everything and hands the model a small fact block. The model never sees the plan; it sees a few finished lines. Its job is to turn them into a living sentence in the athlete\'s language.' },
      { k: 'p', t: "That isn't a wish in the prompt. It's baked into the data: before every training example is written, a regex pulls every number out of the answer and drops the record if one doesn't trace to ground truth. Current corpus: <b>0 rejections</b>. The model has simply never seen an example where it did arithmetic." },
      { k: 'q', t: 'A hallucinated number stops being probabilistic. You can\'t “prompt it down” — there is structurally nowhere for it to come from.' },
      { k: 'h', t: 'One model, three roles' },
      { k: 'p', t: 'The expected design is specialists: a small model parses workout text to JSON, a bigger one talks. We tried. What ships is <b>one Gemma 4 E2B</b> acting as parser, coach and clarifier. The roles differ in harness, not weights: the parser runs under a GBNF grammar (the decoder guarantees valid JSON, not the prompt) with a 1024 context; the coach is free text at 2048, history trimmed in whole turn-pairs. One file instead of three — one download, one warm backend.' },
      { k: 'h', t: 'There was no data. At all.' },
      { k: 'p', t: 'Zero annotated real plans. Two lines instead. <b>Deterministic:</b> a Swift generator walks programmes × athletes × days × question templates, calls the rules engine, renders the gold answer — 24,135 raw → 18,642 pairs, 50/50 RU/EN, split <b>by programme</b> (33 train / 6 held out), so no leak by construction. <b>Distillation:</b> a local teacher, Gemma 4 26B-A4B (MoE, 3.8B active), on a home machine. API spend for the whole project: <b>zero</b>. The student learns behaviour — format, language stability, refusals, tone — not knowledge. Knowledge arrives from the engine at runtime.' },
      { k: 'h', t: 'Training: LoRA, a Mac, two and a half hours' },
      { k: 'p', t: 'LoRA rank 8, seven projections, loss masked to the answer. PyTorch+MPS died (84 s/it, OOM at 42 GB); an 8 GB CUDA card had no CPU offload for 4-bit. <b>MLX</b> worked: bf16 base; the run that shipped was <b>1200 iterations, 2.5 h on an M5/32 GB</b>, val-loss 0.105. Two evenings went to Gemma 4 quirks — KV-sharing layers that strict loading rejects, and new turn markers that, if you use the old ones, tokenise into seven text tokens and make the model echo the prompt. Looks like a bad model. It\'s two lines of rendering.' },
      { k: 'h', t: 'The expensive discovery: quantisation killed Russian' },
      { k: 'p', t: 'Q4_K_M — the phone standard — scored <b>4/8 probes, 41/80 holdout</b>. Content was fine; the model kept sliding into English. Q8_0 fixed it at 5 GB. Unacceptable. The fix was <b>imatrix quantisation</b> calibrated on our own RU/EN corpus, not generic text: <b>Q8 quality at 3.25 GB</b>, 7/8 probes, 71/80 holdout. 5.87 bits per weight, not the expected 4.8 — the shared-KV layers get no importance stats and are conservatively raised to q6_K. One correction, added later: that was the June build. The export script committed to the repo never got the imatrix step, and the file that ships today carries no imatrix metadata — it is a plain Q4_K_M. The recipe is proven; putting it in the pipeline is still open work.' },
      { k: 'h', t: 'Validating with no reference API' },
      { k: 'p', t: 'Three independent loops. A <b>gate harness</b>: 51 parser fixtures + 8 chat probes, EN ≥ 90%, RU ≥ 80%. A <b>fact scorer</b>: language must match, every kg-number must trace to ground truth or the fact block, the key number within one plate. The trick that replaced the missing reference: <b>run the scorer on the gold answers first</b>. It must score ~100% — it did: 99.7 / 100 / 100 / 99.4. Calibrate the instrument before the model. And a <b>hard holdout</b> once the old one saturated at 80/80: 120 tasks with multi-turn clarification, contradiction bait, pain + fatigue, gym slang. Manual reading still found three corpus holes no check caught.' },
      { k: 'h', t: 'We threw away the better model' },
      { k: 'p', t: 'Two Qwen3 specialists trained in parallel: a 0.6B parser at <b>EN 96.3 / RU 92.7</b> in 640 MB (the shipped Gemma on Russian: 91.1), a 1.7B coach at <b>119/120</b> on the hard holdout versus 108. They didn\'t ship: for now only the Gemma-based model is available in the app. That cost points in my own harness and a gigabyte, and it was a call about how many moving parts to own — one file, one warm backend, one thing to say about what runs on a user\'s phone. Qwen3 stays in the repo as a documented fallback runway.' },
      { k: 'stat', rows: [{ n: '3.18 GB', l: 'model file, downloaded once' }, { n: '10–20 s', l: 'cold start · estimate, not a device measurement' }, { n: '~40 tok/s', l: 'from the spike doc — never measured on device' }, { n: '6 GB', l: 'RAM floor · iPhone 13 Pro+' }] },
      { k: 'h', t: 'The point' },
      { k: 'p', t: 'The valuable part isn\'t the fine-tune. That took an afternoon. The valuable part is <b>the boundary</b>: the model does exactly one thing — turns a finished fact into a human sentence in the right language. Arithmetic, rounding, planning, refusals are code you can test and be accountable for. Draw the line there and hallucination stops being a risk to reduce. It becomes a state that cannot occur.' }
    ]
  },
  {
    slug: 'linter', cat: 'method', labSec: 'tools', draft: false,
    title: 'Everyone can write a generator. Almost nobody writes a linter.',
    dek: 'A very clean, well-tested, completely dead branch of code — and how I lived with it for three months.',
    date: '8 Sep 2026', tags: ['method', 'honest'],
    body: [
      { k: 'p', t: 'When I started the powerlifting app I had one idea that felt strong: anyone can generate a training plan. Five minutes with any language model and you have sixteen weeks, percentages, sets, all pretty. That\'s not the value. The value is catching that the plan is <b>bad</b>.' },
      { k: 'p', t: 'There are classic mistakes everyone burns on — self-taught lifters and models alike. Monotone load week after week with no wave. Linear intensity ramp to the very end with no deload. The peak in the wrong place. A bodybuilding split instead of competition specificity. Training by feel instead of structure. Five. Every coach knows them; no generator does.' },
      { k: 'p', t: 'That\'s what I wanted to build: not another generator, a checker. A <b>linter for training plans</b>.' },
      { k: 'h', t: 'What was actually built' },
      { k: 'p', t: 'The periodization engine exists. Sixteen weeks, a class × weight-category matrix, peak volume from it, demographic corrections on top. Deterministic, offline, tests green. The rules catalogue exists — twenty rules, stable IDs, each described.' },
      { k: 'p', t: 'The linter doesn\'t. Formally it does — a file, a type, a function. Inside: one check. If the cycle is sixteen weeks, deloads must sit on weeks 3, 7, 11, 15. Twenty-two lines. None of the five detectors is written. Worse: <b>the function has zero callers from the app</b>. Only its own test calls it. Same for the engine — it isn\'t wired to the planner that actually hands the user today\'s session.' },
      { k: 'h', t: 'How I didn\'t notice' },
      { k: 'p', t: 'The project docs had a work plan with a status table. Five rows said “Implemented”. The table wasn\'t a report. It was text inside a document describing what <i>would</i> be done — “create this file, put this in it” — and the content included a table written in the future tense as if it were the past. Nobody executed the plan. It reads like a result.' },
      { k: 'q', t: 'For three months I believed the linter worked because somewhere it was written that it worked.' },
      { k: 'p', t: 'One more detail that finished me: “five anti-patterns” across my own two documents were two different lists of five. Overlap: three. I wrote both, a week apart.' },
      { k: 'h', t: 'Then I read the check itself' },
      { k: 'p', t: 'The engine numbers weeks from one and marks the deloads in a switch: <code>case 3, 7, 11, 15</code>. The linter asserts that a sixteen-week cycle has deloads on weeks 3, 7, 11 and 15. Same four numbers, hardcoded twice, one file apart.' },
      { k: 'q', t: 'Pointed at the engine, the check cannot fail. It asserts that the engine equals itself.' },
      { k: 'p', t: 'So the missing caller was never the whole problem. Even wired up exactly as designed, that detector would have produced a diagnostic on no plan ever — it restates the constant it is supposed to audit. A test can pass, a rule can be catalogued, a check can run on every build, and the thing still verifies nothing.' },
      { k: 'p', t: 'And the plan a user actually receives does not come from that engine. It comes from the planner, which carries its own periodization: a four-week wave on a zero-based index, deloading when <code>cycleIndex % 4 == 3</code> — weeks 4, 8, 12 and 16 in the engine\'s numbering. Off by one from both the engine and the linter, and its last deload lands on the week the engine calls competition. Nothing converts between the two: the type the linter reads is produced by nothing in the product. If the check were ever aimed at what ships, it would fire on every plan — which is the one useful thing it could do, and the reason a bridge is the first job, not the fifth.' },
      { k: 'h', t: 'The takeaway, no moral' },
      { k: 'p', t: 'A spec is not code. A plan is not a report. A green test is not a user. The most practical thing I took away: <b>if a function has no caller from the product, it doesn\'t exist</b>. The first thing I now check in any “done” feature isn\'t the tests — it\'s a grep for who calls it.' },
      { k: 'pre', t: '$ grep -rn "lint(" Sources/ App/ | grep -v Tests/\n(no output)\n\nchecks: 1 · detectors: 0 / 5 · callers from product: 0' },
      { k: 'p', t: 'Off to write the detectors.' }
    ]
  },
  {
    slug: 'system',
    cat: 'method',
    labSec: 'exp',
    draft: false,
    title: 'A training system, not a plan generator.',
    dek: 'How PowerliftME turns methodology, training history and live session feedback into an inspectable iPhone product — and where the seams still show.',
    date: '8 Sep 2026',
    tags: ['method', 'product'],
    body: [
      { k: 'p', t: 'PowerliftME is a rules-first iPhone app for powerlifters. It plans training, carries the prescription into the gym, records what actually happened, and adapts what comes next without rewriting history. The app is fully useful with no model installed. Its optional on-device coach may parse, explain and phrase; deterministic code still owns the numbers and the decision boundary.' },
      { k: 'p', t: 'I built it as a competitive lifter, a coach and an engineer. Powerlifting looks simple from the outside — three lifts and more weight over time — but a useful product has to survive missed sessions, changing readiness, equipment limits, meet dates, incomplete logs, and the difference between what an athlete was asked to do and what they really did.' },

      { k: 'h', t: 'The problem was coherence' },
      { k: 'p', t: 'A training plan is a long-horizon promise. A gym session is evidence arriving one set at a time. Most workout software flattens both into the same editable table. That works until real life changes the plan.' },
      { k: 'p', t: 'PowerliftME has to answer questions that are small in the interface and large in the domain model. Was <code>0 kg</code> deliberately logged for a bodyweight movement, or was load never recorded? Was a set prescribed, performed, skipped, or added by the athlete? Should one bad session alter the next set, the next week, or nothing at all? If a model proposes a workout, when does that proposal become training truth? If a plan changes, can the athlete still see what was originally prescribed?' },
      { k: 'p', t: 'The product is not the screen that displays a workout. The product is the coherence of the whole loop:' },
      { k: 'pre', t: 'source → draft → validated plan → queue snapshot → active session → completed record' },
      { k: 'p', t: 'Each transition narrows what may happen next. A workout can begin as a generated plan, manual entry, import or model-assisted draft, but every source crosses the same normalisation and validation boundary before it reaches the queue.' },

      { k: 'h', t: 'Written in Swift from the start' },
      { k: 'p', t: 'An earlier Flutter codebase existed, but PowerliftME itself was written natively in Swift from day one. The attempted port did not carry over cleanly, so I started the current product as a Swift codebase rather than reproducing the Flutter implementation.' },
      { k: 'p', t: 'The restart was useful. Instead of reproducing screens first, I began with a standalone Swift package and the invariants the interface would eventually have to respect. <code>IronQueueCore</code> therefore contains the domain, planning, progression, coaching rules, calculations and the session state machine without a SwiftUI dependency. The app target composes those capabilities into the product.' },
      { k: 'p', t: 'That separation makes a practical promise: the view can change without quietly changing the meaning of a training record.' },

      { k: 'h', t: 'Planned work and performed work are different facts' },
      { k: 'p', t: 'The central split is between prescription and evidence. <code>SetPrescription</code> describes the intended work: load, repetitions, duration, effort target, optionality and source. <code>SetRecord</code> describes what happened: actual load, actual repetitions, RPE, duration, status, notes and attached evidence. A record may point back to its planned set, but it never overwrites it.' },
      { k: 'p', t: 'This gives the product several non-negotiable invariants. <b>Planned is not actual</b> — finishing a session preserves the prescription and writes performance separately. <b>Missing is not zero</b> — unspecified load, unrecorded load and an explicit <code>0 kg</code> are three distinct values. <b>A proposal is not a mutation</b> — planner, rule or model output must be accepted before it changes a prescription. <b>Source survives</b> — imported text and source fragments remain attributable through completed history. <b>Finish is not hide or delete</b> — session lifecycle and record visibility are separate concerns.' },
      { k: 'p', t: 'The active workout is a finite-state machine:' },
      { k: 'pre', nowrap: true, t: 'not started → check-in → warm-up → working sets → assistance → review → finished\n                                              ↘ aborted' },
      { k: 'p', t: 'Invalid transitions belong in the core, not in a collection of disabled buttons. The UI renders state and sends intent; it does not own training truth.' },

      { k: 'h', t: 'The planner bends without losing the thread' },
      { k: 'p', t: 'The app supports four training stances rather than pretending one schedule fits every phase of life. <b>Life First</b> builds the week around two gym sessions and optional home work. <b>Balance</b> prioritises steady off-season progress without a fixed platform date. <b>Focus</b> plans toward a competition date and adds a meet-specific taper. <b>All In</b> assumes the calendar is fixed and the athlete wants the most structured path.' },
      { k: 'p', t: 'The default PowerliftME route uses a repeating four-week loading wave:' },
      { k: 'pre', nowrap: true, t: 'week 1       week 2       week 3       week 4\n1.000   →    1.033   →    1.066   →    0.850\nbuild        build        overload     deload' },
      { k: 'p', t: 'Meet preparation changes the final block with a calendar-aware taper. Recent top-set evidence can update the maximum used for future planning while the completed session stays unchanged. Estimated one-repetition maximum is calculated deterministically — Epley, for sets of up to twelve repetitions — and load rounding and plate math stay in code.' },
      { k: 'p', t: 'The product also contains a deterministic sixteen-week periodisation engine built on a class × weight-category lookup matrix with demographic corrections. That engine is tested, but I will not pretend every current workout flows through it: the live planner still has its own periodisation path, with its own deload cadence, and the two disagree by a week. Bridging them is explicit open work — the first job, not the fifth.' },

      { k: 'h', t: 'The linter is the honest unfinished part' },
      { k: 'p', t: 'Generating a plausible plan is cheap. Detecting a bad plan is the more useful problem: monotone loading, no deload, a peak in the wrong place, competition specificity disappearing, or a plan that merely follows day-to-day feeling.' },
      { k: 'p', t: 'I designed a training-plan linter around those failure modes. The catalogue and the type exist; one deload-cadence check exists. The five useful detectors do not, and the function that exists has no caller from the product. Its only caller is its own test.' },
      { k: 'pre', t: '$ grep -rn "lint(" Sources/ App/ | grep -v Tests/\n(no output)\n\nchecks: 1 · detectors: 0 / 5 · callers from product: 0' },
      { k: 'p', t: 'That gap stayed hidden for three months because a planning document contained an "implemented" table written like a report. It is not polished away as a roadmap footnote; it is one of the most useful lessons in the project, and it has <a href="#essay/linter">its own essay</a>. A specification is not code, a green unit test is not a user path, and a function with no product caller does not exist.' },

      { k: 'h', t: 'AI is an optional translator, not the training engine' },
      { k: 'p', t: 'PowerliftME works with no language model installed. Deterministic routing answers what it understands directly from the plan and journal; the optional local model handles the language-shaped edges — parsing free-form coach text, clarifying ambiguous input, turning a finished fact block into a natural reply. One Gemma 4 E2B file serves all three roles. How that model was trained, quantised and where it still falls short is <a href="#essay/talks">a separate essay</a>; this one is about the boundary around it.' },
      { k: 'p', t: 'The boundary is structural, not a sentence in a system prompt. The model does not calculate percentages, choose plate-loadable weights, change a plan or write directly to history. Its output remains a draft until validation and acceptance. A reply guard replaces the whole answer if it invents a number next to a unit that appears neither in the athlete\'s message nor in the supplied fact block; the same boundary rejects nocebo language and moralising copy.' },
      { k: 'p', t: 'The current app artifact is a 3.18 GB plain <code>Q4_K_M</code> GGUF, downloaded on demand and run through llama.cpp. It is cached locally, excluded from backup, and verified by SHA-256. Devices without enough memory keep the deterministic and manual paths. There is no application server anywhere in the loop: private training data stays on the iPhone and in the user\'s own iCloud.' },

      { k: 'h', t: 'A movement library that is useful under the bar' },
      { k: 'p', t: 'The catalogue holds 156 exercise definitions and 114 full-size illustrations. The distinction matters: not every entry claims a unique image, and the app deliberately falls back to a base illustration for variations that have none — the banded deadlift shows the conventional pull. The visual system prioritises recognisable setup and finish positions for the competition lifts and their variations.' },

      { k: 'h', t: 'The architecture follows the boundary' },
      { k: 'pre', nowrap: true, t: 'programmes · manual input · model-assisted drafts\n                         ↓\n                 normalise + validate\n                         ↓\n                    IronQueueCore\n planning · rules · calculations · progression · session FSM\n              ↓                         ↓\n SwiftUI + DesignSystem         LocalInference\n              ↓                 Gemma · llama.cpp\n          repositories\n              ↓\n   SwiftData · private CloudKit' },
      { k: 'p', t: 'The module names matter less than the direction of authority. SwiftUI renders state and sends intent. <code>DesignSystem</code> owns the reusable primitives and the visual contract. <code>IronQueueCore</code> owns calculations, planning, transitions and invariants. Repositories map domain records to SwiftData entities; release builds sync supported records through the user\'s private CloudKit database. <code>LocalInference</code> sits beside the core, never above it.' },
      { k: 'p', t: 'The two narrow network paths are user-triggered: downloading the optional model from Hugging Face, and looking up a public OpenPowerlifting profile. Neither path receives the athlete\'s private training history.' },

      { k: 'h', t: 'Current evidence and current limits' },
      { k: 'p', t: 'Working now: a native SwiftUI product for iOS 26+, on TestFlight since late August 2026; the full source-to-record pipeline and session state machine; planned-versus-actual history; four training stances and several deterministic programme routes; SwiftData persistence with a private CloudKit production schema; the optional on-device runtime with deterministic fallbacks; an illustrated exercise catalogue; and core tests around the pipeline, state transitions, persistence semantics, planning and model acceptance.' },
      { k: 'p', t: 'Deliberately visible: the periodisation engine and the product planner still need one canonical bridge; the plan linter has one check, no detector set and no product caller; the imatrix quantisation result was proven in June and has not entered the export pipeline; app and UI integration coverage is thinner than core coverage.' },

      { k: 'h', t: 'What I learned' },
      { k: 'p', t: '<b>Formalisation is a product feature.</b> Separating prescription from evidence is what lets the app adapt without lying about the past.' },
      { k: 'p', t: '<b>The useful AI work is the boundary.</b> When the model receives finished facts and cannot write training truth directly, hallucination becomes a state the product can reject rather than a risk the copy merely promises to reduce.' },
      { k: 'p', t: '<b>A test can pass while a feature does not exist.</b> Trace every important claim to the product caller — not only to a file, a type, a plan or a unit test.' },
      { k: 'p', t: '<b>Simulators are not phones.</b> Memory tiers, quantised language quality and model start-up all have to be measured on the hardware users will hold — and, as of this writing, the on-device speed has not been.' },
      { k: 'q', t: 'Formalisation is not paperwork before the product. It is the product\'s ability to remain coherent while the real world changes the plan.' },
      { k: 'p', t: '<a href="https://powerlift.me" target="_blank" rel="noopener">powerlift.me</a> · <a href="https://huggingface.co/powerliftme" target="_blank" rel="noopener">models on Hugging Face</a> · <a href="https://www.openpowerlifting.org/u/dmitrygrishchenko" target="_blank" rel="noopener">me on OpenPowerlifting</a>' }
    ]
  },
];
