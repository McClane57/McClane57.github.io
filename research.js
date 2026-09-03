// Research archive for grishchenko.org — edit here; the Research page renders from this file.
// Sources: Google Scholar profile (citations as of Sep 2026) and the previous grishchenko.org (talks, teaching).
window.RESEARCH = {
  scholar: 'https://scholar.google.com/citations?user=bQCAEVIAAAAJ',
  metrics: { citations: 173, hIndex: 7, i10: 5 },
  interests: ['Optimization', 'Sparsification', 'Distributed algorithms', 'Machine learning'],
  papers: [
    { id: 'R-001', year: 2021, title: 'Proximal gradient methods with adaptive subspace sampling', authors: 'D. Grishchenko, F. Iutzeler, J. Malick', venue: 'Mathematics of Operations Research 46(4), 1303–1323', topic: 'sparsity', keywords: ['nonsmooth composite optimization', 'proximal gradient', 'randomized subspace descent', 'support identification', 'ℓ1 regularization'], cited: 24, kind: 'journal',
      url: 'https://pubsonline.informs.org/doi/abs/10.1287/moor.2020.1092', pdf: 'https://grishchenko.org/files/AdaptiveSubspace.pdf',
      note: 'The thesis result that made it into a journal: a random subspace method whose sampling adapts to the structure it identifies on the fly.' },
    { id: 'R-002', year: 2021, title: 'Distributed learning with sparse communications by identification', authors: 'D. Grishchenko, F. Iutzeler, J. Malick, M.-R. Amini', venue: 'SIAM Journal on Mathematics of Data Science 3(2), 715–735', topic: 'distributed', keywords: ['distributed learning', 'asynchronous updates', 'sparse communications', 'identification', 'proximal methods'], cited: 7, kind: 'journal',
      url: 'https://epubs.siam.org/doi/10.1137/20M1347772', pdf: 'https://arxiv.org/pdf/1812.03871.pdf',
      note: 'Workers send only the coordinates that matter — identified, not guessed — and the method still converges.' },
    { id: 'R-003', year: 2021, title: 'Adaptive catalyst for smooth convex optimization', authors: 'A. Ivanova, D. Pasechnyuk, D. Grishchenko, E. Shulgin, A. Gasnikov, V. Spokoiny', venue: 'Optimization and Applications (OPTIMA), 20–37', topic: 'acceleration', keywords: ['Catalyst envelope', 'smooth convex optimization', 'adaptive methods', 'inexact proximal point', 'universal acceleration'], cited: 41, kind: 'conference',
      url: 'https://arxiv.org/abs/1911.11271', pdf: 'https://arxiv.org/pdf/1911.11271.pdf',
      note: 'A generic envelope that accelerates almost any non-accelerated method without knowing its constants.' },
    { id: 'R-004', year: 2020, title: 'Randomized progressive hedging methods for multi-stage stochastic programming', authors: 'G. Bareilles, Y. Laguel, D. Grishchenko, F. Iutzeler, J. Malick', venue: 'Annals of Operations Research 295(2), 535–560', topic: 'stochastic programming', keywords: ['multistage stochastic programming', 'progressive hedging', 'scenario decomposition', 'randomized operator splitting', 'asynchronous variants'], cited: 43, kind: 'journal',
      url: 'https://link.springer.com/article/10.1007/s10479-020-03811-5', pdf: 'https://hal.archives-ouvertes.fr/hal-02946615/document',
      note: 'Progressive Hedging, but you only touch a random subset of scenarios per iteration. Most cited.' },
    { id: 'R-005', year: 2020, title: 'Sparse asynchronous distributed learning', authors: 'D. Grishchenko, F. Iutzeler, M.-R. Amini', venue: 'ICONIP 2020, Springer LNCS, 429–438', topic: 'distributed', keywords: ['asynchronous distributed learning', 'sparse communications', 'delay tolerance', 'parameter server'], cited: null, kind: 'conference',
      url: 'https://link.springer.com/chapter/10.1007/978-3-030-63823-8_50', pdf: null,
      note: 'Asynchronous workers, sparse updates, no waiting — the practical version of R-002.' },
    { id: 'R-006', year: 2019, title: 'A privacy preserving randomized gossip algorithm via controlled noise insertion', authors: 'F. Hanzely, J. Konečný, N. Loizou, P. Richtárik, D. Grishchenko', venue: 'arXiv:1901.09367', topic: 'gossip & privacy', keywords: ['average consensus', 'gossip algorithms', 'controlled noise insertion', 'decentralized networks'], cited: 9, kind: 'preprint',
      url: 'https://arxiv.org/abs/1901.09367', pdf: 'https://arxiv.org/pdf/1901.09367.pdf',
      note: 'Average a value across a network without any node learning its neighbours\u2019 inputs.' },
    { id: 'R-007', year: 2017, title: 'Privacy preserving randomized gossip algorithms', authors: 'F. Hanzely, J. Konečný, N. Loizou, P. Richtárik, D. Grishchenko', venue: 'arXiv:1706.07636', topic: 'gossip & privacy', keywords: ['average consensus', 'gossip algorithms', 'binary oracle', 'privacy by randomization'], cited: 22, kind: 'preprint',
      url: 'https://arxiv.org/abs/1706.07636', pdf: 'https://arxiv.org/pdf/1706.07636.pdf',
      note: 'KAUST collaboration, master\u2019s year. Three gossip protocols with privacy by construction.' },
    { id: 'R-008', year: 2013, title: 'Оригами, или что можно получить с помощью складывания листа бумаги', authors: 'Д. И. Грищенко', venue: 'Математическое просвещение 17, 68–87', topic: 'geometry', keywords: ['paper folding', 'geometric constructions', 'Huzita–Justin axioms', 'cubic equations by folding', 'angle trisection'], cited: 7, kind: 'journal',
      url: 'https://www.mathnet.ru/php/archive.phtml?wshow=paper&jrnid=mp&paperid=750', pdf: null,
      note: 'First paper, first year of university: what you can and cannot construct by folding paper. The Writing page owes its origami to this.' },
    { id: 'T-001', year: 2020, title: 'Proximal optimization with automatic dimension reduction for large-scale learning', authors: 'D. Grishchenko — PhD dissertation', venue: 'Université Grenoble Alpes · defended 3 Nov 2020', topic: 'sparsity', keywords: ['proximal methods', 'structure identification', 'automatic dimension reduction', 'distributed learning', 'large-scale ML'], cited: null, kind: 'thesis',
      url: 'https://theses.hal.science/tel-03102734', pdf: null,
      note: 'Supervised by Franck Iutzeler, Jérôme Malick and Massih-Reza Amini. Everything above from 2018–2021 is in here.' }
  ],
  talks: [
    { date: 'Jul 2021', title: 'Proximal gradient methods with adaptive subspace sampling', where: 'MOTOR 2021 · online', slides: 'https://grishchenko.org/talk/motor2021/' },
    { date: 'Nov 2020', title: 'Sparse asynchronous distributed learning', where: 'ICONIP 2020 · online', slides: 'https://grishchenko.org/talk/iconip2020/' },
    { date: 'Aug 2019', title: 'Identification-based first-order algorithms for distributed learning', where: 'ICCOPT 2019 · Berlin', slides: 'https://grishchenko.org/talk/iccopt2019/' },
    { date: 'Jul 2019', title: 'Distributed first-order optimization with tamed communications', where: 'SPARS 2019 · Toulouse', slides: 'https://grishchenko.org/talk/spars2019/', poster: true },
    { date: 'Apr 2019', title: 'Identify and sparsify: distributed optimization with asynchronous moderate communications', where: 'DAO 2019 · Grenoble', slides: 'https://grishchenko.org/talk/dao2019/' },
    { date: 'Mar 2019', title: 'Identify and sparsify: distributed optimization with asynchronous moderate communications', where: 'Optimization & Learning 2019 · poster', slides: 'https://grishchenko.org/talk/osl2019/', poster: true },
    { date: 'Jul 2018', title: 'Distributed optimization with sparse communications and structure identification', where: 'ISMP 2018 · Bordeaux', slides: 'https://grishchenko.org/talk/ismp2018/' },
    { date: 'Jun 2018', title: 'Distributed optimization with sparse communications and structure identification', where: 'Grenoble Optimization Days 2018', slides: 'https://grishchenko.org/talk/grenobleoptdays2018/' },
    { date: 'Mar 2018', title: 'Distributed optimization with sparse communications', where: 'SMAI-MODE 2018', slides: 'https://grishchenko.org/talk/smai-mode/' },
    { date: 'Nov 2016', title: 'Minimal mutual information model via dual regularization and an ellipsoid method with inexact oracle', where: 'MIPT 59th conference · Moscow', slides: 'https://grishchenko.org/talk/mipt59/' }
  ],
  teaching: [
    { years: '2019–20', course: 'Optimisation Numérique', where: 'Université Grenoble Alpes', what: 'Numerical optimization — theory and implementation', url: 'https://grishchenko.org/project/numerical-optimization-2020/' },
    { years: '2019', course: 'Refresher: Numerical Matrix Analysis and Optimization', where: 'Université Grenoble Alpes', what: 'Short intensive before the MSc year', url: 'https://grishchenko.org/project/refresher2019/' },
    { years: '2018–19', course: 'Optimisation Numérique', where: 'Université Grenoble Alpes', what: 'Numerical optimization — theory and implementation', url: 'https://grishchenko.org/project/numerical-optimization-2019/' },
    { years: '2018–19', course: 'Convex and Distributed Optimization', where: 'Université Grenoble Alpes', what: 'Incremental & stochastic methods, Spark, distributed optimization', url: 'https://grishchenko.org/project/cdo2018/' },
    { years: '2018', course: 'Refresher: Numerical Matrix Analysis and Optimization', where: 'Université Grenoble Alpes', what: 'Short intensive before the MSc year', url: 'https://grishchenko.org/project/refresher2018/' },
    { years: '2013–15', course: 'Calculus', where: 'Higher School of Economics, Moscow', what: 'Teaching assistant', url: null },
    { years: '2011–15', course: 'Tournament of Towns', where: 'International Mathematical Tournament of Towns', what: 'Olympiad grader', url: 'https://www.turgor.ru/en/index.php' }
  ]
};
