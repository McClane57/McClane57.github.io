// Essays for grishchenko.org — edit text here; the page renders from this file.
// Each essay: slug, title, dek, meta, cat, lab (which lab section proves it), body (array of blocks).
// Block kinds: p (paragraph, inline <b>/<a>/<code> allowed), h (section heading), q (pull quote),
// pre (mono block), stat (row of {n, l}), ph (placeholder you still have to write).
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
      { k: 'h', t: 'Training: LoRA, a Mac, ninety minutes' },
      { k: 'p', t: 'LoRA r=16, seven projections, loss masked to the answer. PyTorch+MPS died (84 s/it, OOM at 42 GB); an 8 GB CUDA card had no CPU offload for 4-bit. <b>MLX</b> worked: bf16 base, ~1000 iterations, <b>90 minutes on an M5/32 GB</b>, val-loss 0.105. Two evenings went to Gemma 4 quirks — KV-sharing layers that strict loading rejects, and new turn markers that, if you use the old ones, tokenise into seven text tokens and make the model echo the prompt. Looks like a bad model. It\'s two lines of rendering.' },
      { k: 'h', t: 'The expensive discovery: quantisation killed Russian' },
      { k: 'p', t: 'Q4_K_M — the phone standard — scored <b>4/8 probes, 41/80 holdout</b>. Content was fine; the model kept sliding into English. Q8_0 fixed it at 5 GB. Unacceptable. The fix was <b>imatrix quantisation</b> calibrated on our own RU/EN corpus, not generic text: <b>Q8 quality at 3.25 GB</b>, 7/8 probes, 71/80 holdout. 5.87 bits per weight, not the expected 4.8 — the shared-KV layers get no importance stats and are conservatively raised to q6_K.' },
      { k: 'h', t: 'Validating with no reference API' },
      { k: 'p', t: 'Three independent loops. A <b>gate harness</b>: 51 parser fixtures + 8 chat probes, EN ≥ 90%, RU ≥ 80%. A <b>fact scorer</b>: language must match, every kg-number must trace to ground truth or the fact block, the key number within one plate. The trick that replaced the missing reference: <b>run the scorer on the gold answers first</b>. It must score ~100% — it did: 99.7 / 100 / 100 / 99.4. Calibrate the instrument before the model. And a <b>hard holdout</b> once the old one saturated at 80/80: 120 tasks with multi-turn clarification, contradiction bait, pain + fatigue, gym slang. Manual reading still found three corpus holes no check caught.' },
      { k: 'h', t: 'We threw away the better model' },
      { k: 'p', t: 'Two Qwen3 specialists trained in parallel: a 0.6B parser at <b>EN 96.3 / RU 92.7</b> in 640 MB (beat our Gemma on Russian), a 1.7B coach at <b>119/120</b> on the hard holdout versus 108. They didn\'t ship. Owner\'s decision: Google models only. That cost quality points and a gigabyte, and it\'s a normal engineering call — licence, vendor predictability and being able to say in one sentence what runs on a user\'s phone are part of the product. Qwen3 stays in the repo as a documented fallback runway.' },
      { k: 'stat', rows: [{ n: '3.18 GB', l: 'model file, downloaded once' }, { n: '10–20 s', l: 'cold start — the most honest number here' }, { n: '~40 tok/s', l: 'a short reply in 2–4 s' }, { n: '6 GB', l: 'RAM floor · iPhone 13 Pro+' }] },
      { k: 'h', t: 'The point' },
      { k: 'p', t: 'The valuable part isn\'t the fine-tune. That took ninety minutes. The valuable part is <b>the boundary</b>: the model does exactly one thing — turns a finished fact into a human sentence in the right language. Arithmetic, rounding, planning, refusals are code you can test and be accountable for. Draw the line there and hallucination stops being a risk to reduce. It becomes a state that cannot occur.' }
    ]
  },
  {
    slug: 'linter', cat: 'method', labSec: 'tools', draft: true,
    title: 'Everyone can write a generator. Almost nobody writes a linter.',
    dek: 'A very clean, well-tested, completely dead branch of code — and how I lived with it for three months.',
    date: '4 Sep 2026', tags: ['method', 'honest'],
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
      { k: 'h', t: 'The takeaway, no moral' },
      { k: 'p', t: 'A spec is not code. A plan is not a report. A green test is not a user. The most practical thing I took away: <b>if a function has no caller from the product, it doesn\'t exist</b>. The first thing I now check in any “done” feature isn\'t the tests — it\'s a grep for who calls it.' },
      { k: 'pre', t: '$ grep -rn "lint(" Sources/ App/ | grep -v Tests/\n(no output)\n\nchecks: 1 · detectors: 0 / 5 · callers from product: 0' },
      { k: 'p', t: 'Off to write the detectors.' }
    ]
  }
];
