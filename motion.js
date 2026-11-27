// Motion layer: reveals and visibility signals. Pairs with motion.css.
// The page is rendered by the dc-runtime after load and re-rendered on navigation,
// so targets are (re)discovered with a MutationObserver instead of once at startup.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window)) return;
  if (!reduce) document.documentElement.classList.add('motion');

  // Timelines: draw once, when most of the rail is on screen.
  var tlObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('tl-in');
      tlObs.unobserve(e.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -15% 0px' });

  // Chat demo: tell the page when the phone is actually visible, so the
  // conversation starts when someone can watch it and stops looping offscreen.
  var chatVisible = false;
  var chatObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting === chatVisible) return;
      chatVisible = e.isIntersecting;
      window.dispatchEvent(new CustomEvent('m:chat', { detail: { visible: chatVisible } }));
    });
  }, { threshold: 0.4 });

  var seen = new WeakSet();
  function scan() {
    document.querySelectorAll('.tl-4, .tl-3').forEach(function (tl) {
      if (seen.has(tl)) return; seen.add(tl);
      Array.prototype.forEach.call(tl.children, function (c, i) { if (i >= 2) c.style.setProperty('--i', i - 2); });
      if (reduce) tl.classList.add('tl-in'); else tlObs.observe(tl);
    });
    document.querySelectorAll('[data-chat]').forEach(function (el) {
      if (seen.has(el)) return; seen.add(el);
      chatVisible = false; chatObs.observe(el);
    });
  }
  var queued = false;
  function soon() { if (queued) return; queued = true; requestAnimationFrame(function () { queued = false; scan(); }); }
  new MutationObserver(soon).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', scan);
  scan();
})();
