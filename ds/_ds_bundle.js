/* @ds-bundle: {"format":3,"namespace":"PowerliftMEIronAmpHearthDesignSystem_c01a24","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"PlateBar","sourcePath":"components/data/PlateBar.jsx"},{"name":"StatReadout","sourcePath":"components/data/StatReadout.jsx"},{"name":"StatusPill","sourcePath":"components/data/StatusPill.jsx"},{"name":"Tag","sourcePath":"components/data/Tag.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Input","sourcePath":"components/surfaces/Input.jsx"},{"name":"SegmentedControl","sourcePath":"components/surfaces/SegmentedControl.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"bfea66cdf86b","components/buttons/IconButton.jsx":"b5e38e80313a","components/data/PlateBar.jsx":"9227d872a5a8","components/data/StatReadout.jsx":"fe5b32a5ce51","components/data/StatusPill.jsx":"22fec33a079d","components/data/Tag.jsx":"848e9e7209a6","components/surfaces/Card.jsx":"821ac79b7336","components/surfaces/Input.jsx":"c93099850e67","components/surfaces/SegmentedControl.jsx":"6def4e632ef5","ui_kits/app/ScreenCoach.jsx":"f50165f4d0df","ui_kits/app/ScreenCockpit.jsx":"eac0eb0d4865","ui_kits/app/ScreenHome.jsx":"cff01bf8df97","ui_kits/app/ScreenRecords.jsx":"b3eac788004b","ui_kits/app/ScreenToday.jsx":"dbe6aac31513","ui_kits/app/Shared.jsx":"824414a54a66","ui_kits/site/Bands.jsx":"ed0fb55d95bd","ui_kits/site/Gearbox.jsx":"1996fbe788cc","ui_kits/site/SiteTop.jsx":"12013d86bcb2","ui_kits/site/i18n.js":"6d2738670057","ui_kits/site/tweaks-panel.jsx":"6591467622ed"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PowerliftMEIronAmpHearthDesignSystem_c01a24 = window.PowerliftMEIronAmpHearthDesignSystem_c01a24 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — the stamped action control.
 * Bold ink outline + hard block shadow that "presses" into the page on click.
 * One loud red primary per view; everything else is outline or ghost.
 */

let injected = false;
function ensureStyles() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const css = `
  .ih-btn{
    --_sh: var(--shadow-block-sm);
    display:inline-flex;align-items:center;justify-content:center;gap:.6em;
    font-family:var(--font-text);font-weight:800;text-transform:uppercase;
    letter-spacing:.04em;line-height:1;cursor:pointer;
    border:var(--bw-bold) solid var(--ink);border-radius:var(--r-sm);
    background:var(--surface);color:var(--ink);
    box-shadow:var(--_sh);transition:transform var(--dur-fast) var(--ease),
      box-shadow var(--dur-fast) var(--ease),background var(--dur-fast) var(--ease);
    -webkit-appearance:none;appearance:none;text-decoration:none;
    padding:13px 20px;font-size:14px;white-space:nowrap;
  }
  .ih-btn:hover{ transform:translate(-1px,-1px); --_sh: 4px 4px 0 0 var(--ink); }
  .ih-btn:active{ transform:translate(3px,3px); --_sh: 0px 0px 0 0 var(--ink); }
  .ih-btn:focus-visible{ outline:var(--bw-bold) solid var(--accent);outline-offset:3px; }

  .ih-btn--primary{ background:var(--red);color:var(--chalk);border-color:var(--ink); }
  .ih-btn--primary:hover{ background:var(--red-bright); }
  .ih-btn--secondary{ background:var(--surface);color:var(--ink); }
  .ih-btn--ghost{ background:transparent;border-color:transparent;box-shadow:none;
    --_sh:none;text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:2px; }
  .ih-btn--ghost:hover{ transform:none;color:var(--red);box-shadow:none; }
  .ih-btn--ghost:active{ transform:translateY(1px);box-shadow:none; }
  .ih-btn--good{ background:var(--sage);color:var(--chalk); }

  .ih-btn--sm{ padding:9px 14px;font-size:12.5px; }
  .ih-btn--lg{ padding:17px 28px;font-size:16px; }
  .ih-btn--block{ display:flex;width:100%; }

  .ih-btn[disabled]{ opacity:.45;cursor:not-allowed;transform:none;box-shadow:var(--shadow-block-sm); }
  [data-theme="iron"] .ih-btn{ border-color:var(--ink); }
  [data-theme="iron"] .ih-btn--secondary{ background:var(--iron-card);color:var(--iron-text);
    border-color:var(--iron-text);box-shadow:3px 3px 0 0 #000; }
  [data-theme="iron"] .ih-btn--secondary:hover{ --_sh:4px 4px 0 0 #000; }
  [data-theme="iron"] .ih-btn--ghost{ color:var(--iron-text);border-color:transparent; }
  `;
  const el = document.createElement('style');
  el.id = 'ih-btn-styles';
  el.textContent = css;
  document.head.appendChild(el);
}
function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  icon = null,
  iconRight = false,
  as = 'button',
  className = '',
  ...rest
}) {
  ensureStyles();
  const Tag = as;
  const cls = ['ih-btn', `ih-btn--${variant}`, size !== 'md' ? `ih-btn--${size}` : '', block ? 'ih-btn--block' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), icon && !iconRight ? /*#__PURE__*/React.createElement("span", {
    className: "ih-btn__icon",
    "aria-hidden": "true"
  }, icon) : null, children, icon && iconRight ? /*#__PURE__*/React.createElement("span", {
    className: "ih-btn__icon",
    "aria-hidden": "true"
  }, icon) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * IconButton — a square stamped button for a single glyph.
 * Used for nav actions, +/- steppers, finish/close. Always give an aria-label.
 */

let injected = false;
function ensureStyles() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const css = `
  .ih-iconbtn{
    --_sh: var(--shadow-block-sm);
    display:inline-grid;place-items:center;cursor:pointer;
    width:44px;height:44px;font-size:18px;line-height:1;
    border:var(--bw-bold) solid var(--ink);border-radius:var(--r-sm);
    background:var(--surface);color:var(--ink);
    box-shadow:var(--_sh);transition:transform var(--dur-fast) var(--ease),box-shadow var(--dur-fast) var(--ease);
    -webkit-appearance:none;appearance:none;font-family:var(--font-text);font-weight:800;
  }
  .ih-iconbtn:hover{ transform:translate(-1px,-1px); --_sh:4px 4px 0 0 var(--ink); }
  .ih-iconbtn:active{ transform:translate(3px,3px); --_sh:0 0 0 0 var(--ink); }
  .ih-iconbtn:focus-visible{ outline:var(--bw-bold) solid var(--accent);outline-offset:3px; }
  .ih-iconbtn--primary{ background:var(--red);color:var(--chalk); }
  .ih-iconbtn--sm{ width:34px;height:34px;font-size:15px; }
  .ih-iconbtn--round{ border-radius:var(--r-pill); }
  [data-theme="iron"] .ih-iconbtn{ background:var(--iron-card);color:var(--iron-text);
    border-color:var(--iron-text);box-shadow:3px 3px 0 0 #000; }
  [data-theme="iron"] .ih-iconbtn:hover{ --_sh:4px 4px 0 0 #000; }
  [data-theme="iron"] .ih-iconbtn--primary{ background:var(--red);color:var(--chalk);border-color:var(--ink); }
  `;
  const el = document.createElement('style');
  el.id = 'ih-iconbtn-styles';
  el.textContent = css;
  document.head.appendChild(el);
}
function IconButton({
  children,
  variant = 'secondary',
  size = 'md',
  round = false,
  className = '',
  ...rest
}) {
  ensureStyles();
  const cls = ['ih-iconbtn', variant === 'primary' ? 'ih-iconbtn--primary' : '', size === 'sm' ? 'ih-iconbtn--sm' : '', round ? 'ih-iconbtn--round' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/PlateBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PlateBar — the loaded-barbell readout. The signature PowerliftME visual:
 * a kg number becomes the exact plates on the bar, IPF-coloured.
 * Bar is 20kg; the rest is loaded greedily per side.
 */

const PLATES = [{
  kg: 25,
  fill: '#C13A26',
  edge: '#6f1a10'
},
// red
{
  kg: 20,
  fill: '#2f5d8f',
  edge: '#16314d'
},
// blue
{
  kg: 15,
  fill: '#C6902C',
  edge: '#6e4d10'
},
// yellow/brass
{
  kg: 10,
  fill: '#3f6f3f',
  edge: '#1c331c'
},
// green
{
  kg: 5,
  fill: '#e7ddc8',
  edge: '#8a8170'
},
// white
{
  kg: 2.5,
  fill: '#C13A26',
  edge: '#6f1a10'
},
// small red
{
  kg: 1.25,
  fill: '#b9b9bf',
  edge: '#6c6c72'
} // silver
];
function platesPerSide(total, bar) {
  let perSide = Math.max(0, (total - bar) / 2);
  const out = [];
  for (const p of PLATES) {
    while (perSide + 1e-6 >= p.kg) {
      out.push(p);
      perSide -= p.kg;
    }
  }
  return out; // heaviest -> lightest (inner -> outer)
}
function PlateBar({
  kg = 100,
  bar = 20,
  height = 64,
  showLoad = false,
  className = '',
  ...rest
}) {
  const W = 480,
    H = 120,
    mid = H / 2;
  const plates = platesPerSide(kg, bar);
  const sleeveStart = 150; // px from centre where sleeve begins
  const sleeveEnd = 232;
  const maxPlateH = 96,
    minPlateH = 44;
  const pw = 9,
    gap = 1.5;
  function renderSide(dir) {
    let x = sleeveStart;
    const nodes = [];
    plates.forEach((p, i) => {
      const t = (p.kg - 1.25) / (25 - 1.25);
      const ph = minPlateH + t * (maxPlateH - minPlateH);
      const px = dir === 1 ? W / 2 + x : W / 2 - x - pw;
      nodes.push(/*#__PURE__*/React.createElement("rect", {
        key: dir + '-' + i,
        x: px,
        y: mid - ph / 2,
        width: pw,
        height: ph,
        rx: "2",
        fill: p.fill,
        stroke: p.edge,
        strokeWidth: "1.2"
      }));
      x += pw + gap;
    });
    // collar
    const cx = dir === 1 ? W / 2 + x + 1 : W / 2 - x - 7;
    nodes.push(/*#__PURE__*/React.createElement("rect", {
      key: dir + '-collar',
      x: cx,
      y: mid - 11,
      width: 6,
      height: 22,
      rx: "1.5",
      fill: "#b9b9bf",
      stroke: "#6c6c72",
      strokeWidth: "1"
    }));
    return nodes;
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    className: 'ih-platebar ' + className
  }, rest), /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    width: "100%",
    height: height,
    "aria-hidden": "true",
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: W / 2 - sleeveEnd,
    y: mid - 3.5,
    width: sleeveEnd * 2,
    height: 7,
    rx: "3.5",
    fill: "#c9c9cf"
  }), /*#__PURE__*/React.createElement("rect", {
    x: W / 2 - sleeveEnd,
    y: mid - 3.5,
    width: sleeveEnd * 2,
    height: 3.5,
    rx: "2",
    fill: "#e8e8ee",
    opacity: ".7"
  }), /*#__PURE__*/React.createElement("rect", {
    x: W / 2 + sleeveStart - 6,
    y: mid - 9,
    width: 92,
    height: 18,
    rx: "2",
    fill: "#a9a9b0"
  }), /*#__PURE__*/React.createElement("rect", {
    x: W / 2 - sleeveStart - 86,
    y: mid - 9,
    width: 92,
    height: 18,
    rx: "2",
    fill: "#a9a9b0"
  }), renderSide(1), renderSide(-1)), showLoad && /*#__PURE__*/React.createElement("div", {
    className: "ih-platebar__load",
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--text-dim)',
      marginTop: '8px',
      textAlign: 'center'
    }
  }, plates.map(p => p.kg).join(' · ') || 'bar only', " / side \xB7 ", kg, " kg"));
}
Object.assign(__ds_scope, { PlateBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/PlateBar.jsx", error: String((e && e.message) || e) }); }

// components/data/StatReadout.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StatReadout — a big Anton number with a mono label and unit.
 * The loudest data on screen: weights, totals, PRs, IPF score.
 */

let injected = false;
function ensureStyles() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const css = `
  .ih-stat{ display:flex;flex-direction:column;gap:2px;font-family:var(--font-mono); }
  .ih-stat__label{ font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--text-dim); }
  .ih-stat__row{ display:flex;align-items:baseline;gap:8px; }
  .ih-stat__value{ font-family:var(--font-display);line-height:.82;letter-spacing:-.01em;color:var(--text);
    font-size:60px; }
  .ih-stat__unit{ font-size:14px;font-weight:700;color:var(--text-dim);letter-spacing:.04em; }
  .ih-stat--sm .ih-stat__value{ font-size:34px; }
  .ih-stat--lg .ih-stat__value{ font-size:88px; }
  .ih-stat--xl .ih-stat__value{ font-size:116px; }
  .ih-stat--red .ih-stat__value{ color:var(--red); }
  .ih-stat--brass .ih-stat__value{ color:var(--brass); }
  .ih-stat--good .ih-stat__value{ color:var(--accent-good); }
  .ih-stat__sub{ font-size:12px;color:var(--text-dim);font-weight:400; }
  `;
  const el = document.createElement('style');
  el.id = 'ih-stat-styles';
  el.textContent = css;
  document.head.appendChild(el);
}
function StatReadout({
  value,
  unit = '',
  label = '',
  sub = '',
  size = 'md',
  tone = 'default',
  className = '',
  ...rest
}) {
  ensureStyles();
  const cls = ['ih-stat', size !== 'md' ? `ih-stat--${size}` : '', tone !== 'default' ? `ih-stat--${tone}` : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), label ? /*#__PURE__*/React.createElement("span", {
    className: "ih-stat__label"
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    className: "ih-stat__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ih-stat__value"
  }, value), unit ? /*#__PURE__*/React.createElement("span", {
    className: "ih-stat__unit"
  }, unit) : null), sub ? /*#__PURE__*/React.createElement("span", {
    className: "ih-stat__sub"
  }, sub) : null);
}
Object.assign(__ds_scope, { StatReadout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatReadout.jsx", error: String((e && e.message) || e) }); }

// components/data/StatusPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StatusPill — LIVE / SOON / READY status with an optional pulsing dot.
 * Mirrors the gearbox + readiness states in the app.
 */

let injected = false;
function ensureStyles() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const css = `
  .ih-status{ display:inline-flex;align-items:center;gap:7px;font-family:var(--font-mono);
    font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;line-height:1;
    padding:5px 11px;border-radius:var(--r-pill);border:var(--bw) solid var(--hairline);color:var(--text-dim); }
  .ih-status__dot{ width:7px;height:7px;border-radius:50%;background:currentColor;flex:none; }
  .ih-status--live{ color:var(--accent-good);border-color:color-mix(in oklab,var(--accent-good) 45%,transparent); }
  .ih-status--live .ih-status__dot{ box-shadow:0 0 0 3px color-mix(in oklab,var(--accent-good) 22%,transparent); }
  .ih-status--alarm{ color:var(--red);border-color:color-mix(in oklab,var(--red) 45%,transparent); }
  .ih-status--brass{ color:var(--brass-deep);border-color:color-mix(in oklab,var(--brass) 50%,transparent); }
  [data-theme="iron"] .ih-status{ border-color:var(--iron-line); }
  [data-theme="iron"] .ih-status--brass{ color:var(--brass); }
  @media (prefers-reduced-motion: no-preference){
    .ih-status--live .ih-status__dot{ animation:ih-pulse 2s var(--ease) infinite; }
    @keyframes ih-pulse{ 0%,100%{ opacity:1 } 50%{ opacity:.45 } }
  }
  `;
  const el = document.createElement('style');
  el.id = 'ih-status-styles';
  el.textContent = css;
  document.head.appendChild(el);
}
function StatusPill({
  children,
  status = 'live',
  dot = true,
  className = '',
  ...rest
}) {
  ensureStyles();
  const cls = ['ih-status', `ih-status--${status}`, className].filter(Boolean).join(' ');
  const showDot = dot && status === 'live';
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), showDot ? /*#__PURE__*/React.createElement("span", {
    className: "ih-status__dot",
    "aria-hidden": "true"
  }) : null, children);
}
Object.assign(__ds_scope, { StatusPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatusPill.jsx", error: String((e && e.message) || e) }); }

// components/data/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tag — a stamped mono label chip. The logbook voice: W23 · D3, SQUAT DAY,
 * RPE 8. Outline by default; tones tint the text/border.
 */

let injected = false;
function ensureStyles() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const css = `
  .ih-tag{ display:inline-flex;align-items:center;gap:6px;font-family:var(--font-mono);
    font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;line-height:1;
    padding:5px 10px;border:var(--bw-bold) solid var(--ink);border-radius:var(--r-sm);
    background:transparent;color:var(--text);white-space:nowrap; }
  .ih-tag--solid{ background:var(--ink);color:var(--bg); }
  .ih-tag--red{ border-color:var(--red);color:var(--red); }
  .ih-tag--red-solid{ background:var(--red);border-color:var(--red);color:var(--chalk); }
  .ih-tag--brass{ border-color:var(--brass);color:var(--brass-deep); }
  .ih-tag--brass-solid{ background:var(--brass);border-color:var(--brass);color:var(--ink); }
  .ih-tag--good{ border-color:var(--accent-good);color:var(--accent-good); }
  .ih-tag--ghost{ border-color:var(--hairline);color:var(--text-dim); }
  .ih-tag--sm{ font-size:10px;padding:3px 7px;letter-spacing:.08em; }
  [data-theme="iron"] .ih-tag{ border-color:var(--iron-text);color:var(--iron-text); }
  [data-theme="iron"] .ih-tag--brass{ color:var(--brass); }
  [data-theme="iron"] .ih-tag--ghost{ border-color:var(--iron-line);color:var(--iron-dim); }
  `;
  const el = document.createElement('style');
  el.id = 'ih-tag-styles';
  el.textContent = css;
  document.head.appendChild(el);
}
function Tag({
  children,
  tone = 'default',
  size = 'md',
  icon = null,
  className = '',
  ...rest
}) {
  ensureStyles();
  const cls = ['ih-tag', tone !== 'default' ? `ih-tag--${tone}` : '', size === 'sm' ? 'ih-tag--sm' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, icon) : null, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Tag.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — the stamped panel. Bold ink outline + optional hard block shadow.
 * The structural unit on both paper and iron surfaces.
 */

let injected = false;
function ensureStyles() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const css = `
  .ih-card{ position:relative;background:var(--surface);color:var(--text);
    border:var(--bw-bold) solid var(--ink);border-radius:var(--r);padding:var(--sp-5);
    box-shadow:var(--shadow-block); }
  .ih-card--flat{ box-shadow:none; }
  .ih-card--soft{ box-shadow:var(--shadow-soft);border-color:var(--hairline);border-width:var(--bw); }
  .ih-card--sunk{ background:var(--surface-sunk);box-shadow:none; }
  .ih-card--accent{ border-color:var(--red); }
  .ih-card--hoverable{ transition:transform var(--dur) var(--ease),box-shadow var(--dur) var(--ease); cursor:pointer; }
  .ih-card--hoverable:hover{ transform:translate(-2px,-2px); box-shadow:6px 6px 0 0 var(--ink); }
  .ih-card__bar{ position:absolute;left:-2px;top:-2px;bottom:-2px;width:6px;border-radius:var(--r) 0 0 var(--r);background:var(--red); }
  .ih-card--barred{ padding-left:calc(var(--sp-5) + 8px); }
  [data-theme="iron"] .ih-card{ border-color:var(--iron-line);box-shadow:var(--shadow-iron); }
  [data-theme="iron"] .ih-card--accent{ border-color:var(--red); }
  [data-theme="iron"] .ih-card--hoverable:hover{ box-shadow:0 14px 30px rgba(0,0,0,.5); transform:translateY(-2px); }
  `;
  const el = document.createElement('style');
  el.id = 'ih-card-styles';
  el.textContent = css;
  document.head.appendChild(el);
}
function Card({
  children,
  variant = 'default',
  bar = false,
  hoverable = false,
  className = '',
  ...rest
}) {
  ensureStyles();
  const cls = ['ih-card', variant !== 'default' ? `ih-card--${variant}` : '', bar ? 'ih-card--barred' : '', hoverable ? 'ih-card--hoverable' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), bar ? /*#__PURE__*/React.createElement("span", {
    className: "ih-card__bar",
    "aria-hidden": "true"
  }) : null, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — a stamped text field. Bold ink outline, mono label, red focus.
 * Pairs with Button for the beta signup and search rows.
 */

let injected = false;
function ensureStyles() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const css = `
  .ih-field{ display:flex;flex-direction:column;gap:7px;font-family:var(--font-text); }
  .ih-field__label{ font-family:var(--font-mono);font-size:11px;font-weight:700;
    letter-spacing:.14em;text-transform:uppercase;color:var(--text-dim); }
  .ih-input{ font-family:var(--font-text);font-size:16px;font-weight:500;color:var(--text);
    background:var(--bg);border:var(--bw-bold) solid var(--ink);border-radius:var(--r-sm);
    padding:13px 15px;width:100%;outline:none;-webkit-appearance:none;appearance:none;
    transition:box-shadow var(--dur-fast) var(--ease),border-color var(--dur-fast) var(--ease); }
  .ih-input::placeholder{ color:var(--text-dim);opacity:.8;font-family:var(--font-mono);font-size:14px; }
  .ih-input:focus{ border-color:var(--red);box-shadow:3px 3px 0 0 var(--red-deep); }
  .ih-input--mono{ font-family:var(--font-mono);letter-spacing:.02em; }
  .ih-field__hint{ font-size:12px;color:var(--text-dim); }
  .ih-field--err .ih-input{ border-color:var(--red); }
  .ih-field--err .ih-field__hint{ color:var(--red); }
  [data-theme="iron"] .ih-input{ background:var(--iron-2);color:var(--iron-text);border-color:var(--iron-line); }
  [data-theme="iron"] .ih-input:focus{ border-color:var(--red); }
  `;
  const el = document.createElement('style');
  el.id = 'ih-input-styles';
  el.textContent = css;
  document.head.appendChild(el);
}
function Input({
  label = '',
  hint = '',
  error = false,
  mono = false,
  id,
  className = '',
  ...rest
}) {
  ensureStyles();
  const autoId = id || (label ? 'ih-' + label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: ['ih-field', error ? 'ih-field--err' : '', className].filter(Boolean).join(' ')
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "ih-field__label",
    htmlFor: autoId
  }, label) : null, /*#__PURE__*/React.createElement("input", _extends({
    id: autoId,
    className: 'ih-input' + (mono ? ' ih-input--mono' : '')
  }, rest)), hint ? /*#__PURE__*/React.createElement("span", {
    className: "ih-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Input.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/SegmentedControl.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SegmentedControl — the "gearbox" selector. A stamped row of options where
 * exactly one is engaged. Used for gears, modes, tab-like switches.
 */

let injected = false;
function ensureStyles() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const css = `
  .ih-seg{ display:inline-flex;padding:4px;gap:4px;background:var(--surface-sunk);
    border:var(--bw-bold) solid var(--ink);border-radius:var(--r); }
  .ih-seg--block{ display:flex;width:100%; }
  .ih-seg--block .ih-seg__opt{ flex:1; }
  .ih-seg__opt{ position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;
    font-family:var(--font-text);font-weight:800;text-transform:uppercase;letter-spacing:.04em;
    font-size:13px;line-height:1.1;color:var(--text);background:transparent;cursor:pointer;
    border:0;border-radius:var(--r-sm);padding:9px 16px;white-space:nowrap;
    transition:background var(--dur-fast) var(--ease),color var(--dur-fast) var(--ease); -webkit-appearance:none;appearance:none; }
  .ih-seg__opt i{ font-style:normal;font-family:var(--font-mono);font-size:9px;font-weight:700;
    letter-spacing:.12em;color:var(--text-dim); }
  .ih-seg__opt:hover:not(.is-on):not(:disabled){ background:color-mix(in oklab,var(--ink) 8%,transparent); }
  .ih-seg__opt.is-on{ background:var(--red);color:var(--chalk); }
  .ih-seg__opt.is-on i{ color:color-mix(in oklab,var(--chalk) 80%,transparent); }
  .ih-seg__opt:disabled{ opacity:.4;cursor:not-allowed; }
  .ih-seg__opt:focus-visible{ outline:var(--bw-bold) solid var(--accent);outline-offset:2px; }
  [data-theme="iron"] .ih-seg{ border-color:var(--iron-line);background:var(--iron-2); }
  [data-theme="iron"] .ih-seg__opt.is-on{ background:var(--red);color:var(--chalk); }
  `;
  const el = document.createElement('style');
  el.id = 'ih-seg-styles';
  el.textContent = css;
  document.head.appendChild(el);
}
function SegmentedControl({
  options = [],
  value,
  onChange,
  block = false,
  className = '',
  ...rest
}) {
  ensureStyles();
  const cls = ['ih-seg', block ? 'ih-seg--block' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    role: "tablist"
  }, rest), options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const label = typeof o === 'string' ? o : o.label;
    const sub = typeof o === 'string' ? null : o.sub;
    const on = val === value;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      type: "button",
      role: "tab",
      "aria-selected": on,
      disabled: typeof o === 'object' && o.disabled,
      className: 'ih-seg__opt' + (on ? ' is-on' : ''),
      onClick: () => onChange && onChange(val)
    }, /*#__PURE__*/React.createElement("span", null, label), sub ? /*#__PURE__*/React.createElement("i", null, sub) : null);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ScreenCoach.jsx
try { (() => {
/* Coach — on-device guidance. Chat bubbles + a quick-ask row. */
const NS_K = window.PowerliftMEIronAmpHearthDesignSystem_c01a24;
function Bubble({
  side,
  children
}) {
  const me = side === 'me';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '82%',
      alignSelf: me ? 'flex-end' : 'flex-start',
      background: me ? 'var(--red)' : 'var(--iron-card)',
      color: me ? 'var(--chalk)' : 'var(--iron-text)',
      border: '2px solid ' + (me ? 'var(--ink)' : 'var(--iron-line)'),
      borderRadius: 'var(--r)',
      padding: '11px 14px',
      fontSize: 14,
      lineHeight: 1.4,
      fontFamily: 'var(--font-text)',
      borderBottomRightRadius: me ? 3 : 'var(--r)',
      borderBottomLeftRadius: me ? 'var(--r)' : 3
    }
  }, children);
}
function ScreenCoach() {
  const {
    Input,
    Button,
    Tag
  } = NS_K;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '12px 0',
      borderBottom: '2px solid var(--iron-line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 22,
      color: 'var(--iron-text)'
    }
  }, "Coach")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'center'
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: "ghost"
  }, "On-device \xB7 private")), /*#__PURE__*/React.createElement(Bubble, {
    side: "me"
  }, "Today felt heavy \u2014 drop the weight?"), /*#__PURE__*/React.createElement(Bubble, null, "Yes \u2014 take 5% off and keep RPE at 8. One good session beats a missed one. We'll return to full load on Friday."), /*#__PURE__*/React.createElement(Bubble, {
    side: "me"
  }, "Only have 40 minutes today."), /*#__PURE__*/React.createElement(Bubble, null, "Then squat is the priority \u2014 hit your top sets, skip the back-off, and I'll move accessories to the weekend. No guilt.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: '12px 16px',
      borderTop: '2px solid var(--iron-line)',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Ask your coach\u2026"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "arrow-up",
      style: {
        width: 16,
        height: 16
      }
    }),
    "aria-label": "Send"
  }, " ")));
}
window.ScreenCoach = ScreenCoach;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ScreenCoach.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ScreenCockpit.jsx
try { (() => {
/* Cockpit — the working set. Log advances the set counter and weight. */
const NS_C = window.PowerliftMEIronAmpHearthDesignSystem_c01a24;
function ScreenCockpit({
  onClose
}) {
  const {
    Card,
    Tag,
    Button,
    IconButton,
    PlateBar,
    StatReadout
  } = NS_C;
  const sets = [{
    kg: 150,
    reps: 5
  }, {
    kg: 180,
    reps: 3
  }, {
    kg: 200,
    reps: 2
  }, {
    kg: 215,
    reps: 1
  }, {
    kg: 225,
    reps: 5
  }, {
    kg: 225,
    reps: 5
  }, {
    kg: 225,
    reps: 5
  }, {
    kg: 235,
    reps: 3
  }, {
    kg: 235,
    reps: 3
  }];
  const [i, setI] = React.useState(4);
  const s = sets[i];
  const last = i >= sets.length - 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 18px 14px'
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: "red"
  }, "Working \xB7 Set ", i + 1, "/9"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "History",
    size: "sm"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "list",
    style: {
      width: 15,
      height: 15
    }
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: onClose
  }, "Finish"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 18px',
      flex: 1,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: "brass-solid"
  }, "Working")), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-h2)',
      textTransform: 'uppercase',
      color: 'var(--iron-text)',
      margin: '0 0 16px',
      letterSpacing: '-.01em'
    }
  }, "Competition Squat"), /*#__PURE__*/React.createElement(Card, {
    variant: "accent",
    style: {
      padding: 16,
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--brass)',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", null, "On Bar"), /*#__PURE__*/React.createElement("span", null, s.kg, " KG")), /*#__PURE__*/React.createElement(PlateBar, {
    kg: s.kg,
    height: 66
  })), /*#__PURE__*/React.createElement(StatReadout, {
    value: s.kg,
    unit: 'kg × ' + s.reps,
    size: "xl"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(StatReadout, {
    label: "Target RPE",
    value: i < 5 ? 'OPEN' : '8',
    tone: "brass",
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      marginTop: 20
    }
  }, sets.map((_, k) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      flex: 1,
      height: 6,
      borderRadius: 2,
      background: k < i ? 'var(--brass)' : k === i ? 'var(--red)' : 'var(--iron-line)'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: '14px 18px',
      borderTop: '2px solid var(--iron-line)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    block: true,
    onClick: () => setI(Math.max(0, i - 1)),
    icon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "corner-down-left",
      style: {
        width: 16,
        height: 16
      }
    })
  }, "Back"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    block: true,
    icon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "x",
      style: {
        width: 16,
        height: 16
      }
    })
  }, "Skip"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    block: true,
    onClick: () => last ? onClose() : setI(i + 1),
    icon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "check",
      style: {
        width: 16,
        height: 16
      }
    })
  }, last ? 'Done' : 'Log')));
}
window.ScreenCockpit = ScreenCockpit;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ScreenCockpit.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ScreenHome.jsx
try { (() => {
/* Home — the dashboard. Mark, two big actions, PRs as loaded bars, category grid. */
const NS_H = window.PowerliftMEIronAmpHearthDesignSystem_c01a24;
function BigTile({
  icon,
  label,
  primary,
  onClick
}) {
  const {
    Card
  } = NS_H;
  return /*#__PURE__*/React.createElement(Card, {
    hoverable: true,
    onClick: onClick,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: '24px 12px',
      background: primary ? 'var(--red)' : 'var(--iron-card)',
      borderColor: primary ? 'var(--ink)' : 'var(--iron-line)',
      color: primary ? 'var(--chalk)' : 'var(--iron-text)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    style: {
      width: 34,
      height: 34
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 18,
      letterSpacing: '.01em'
    }
  }, label));
}
function PRRow({
  lift,
  kg
}) {
  const {
    PlateBar
  } = NS_H;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 0',
      borderTop: '1px solid var(--iron-line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--iron-dim)',
      width: 74,
      flex: 'none'
    }
  }, lift), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(PlateBar, {
    kg: kg,
    height: 34
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      color: 'var(--iron-text)',
      lineHeight: 1
    }
  }, kg, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--iron-dim)',
      marginLeft: 4
    }
  }, "kg")));
}
const CATS = [{
  icon: 'history',
  label: 'History',
  tint: '#2a211a'
}, {
  icon: 'trophy',
  label: 'Records',
  tint: '#2a2410'
}, {
  icon: 'calendar',
  label: 'Calendar',
  tint: '#16241a'
}, {
  icon: 'medal',
  label: 'Meets',
  tint: '#2a2410'
}, {
  icon: 'dumbbell',
  label: 'Exercises',
  tint: '#2a211a'
}, {
  icon: 'trending-up',
  label: 'Strength',
  tint: '#2a1a18'
}, {
  icon: 'line-chart',
  label: 'Analytics',
  tint: '#2a211a'
}, {
  icon: 'users',
  label: 'Forum',
  soon: true,
  tint: '#1c1a16'
}];
function ScreenHome() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 18px 20px',
      overflowY: 'auto',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 0 18px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/icon-192.png",
    alt: "",
    style: {
      width: 42,
      height: 42,
      borderRadius: 9,
      border: '2px solid var(--iron-line)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 24,
      color: 'var(--iron-text)',
      letterSpacing: '-.01em'
    }
  }, "Powerlift", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--red)'
    }
  }, "ME")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "settings",
    style: {
      width: 22,
      height: 22,
      color: 'var(--iron-dim)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(BigTile, {
    icon: "zap",
    label: "Workout",
    primary: true
  }), /*#__PURE__*/React.createElement(BigTile, {
    icon: "messages-square",
    label: "Coach"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--brass)',
      marginBottom: 2
    }
  }, "Personal Records"), /*#__PURE__*/React.createElement(PRRow, {
    lift: "Squat",
    kg: 300
  }), /*#__PURE__*/React.createElement(PRRow, {
    lift: "Bench",
    kg: 190
  }), /*#__PURE__*/React.createElement(PRRow, {
    lift: "Deadlift",
    kg: 330
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 10,
      marginTop: 22
    }
  }, CATS.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.label,
    style: {
      aspectRatio: '1',
      background: c.tint,
      border: '2px solid var(--iron-line)',
      borderRadius: 'var(--r)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      opacity: c.soon ? .5 : 1
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": c.icon,
    style: {
      width: 26,
      height: 26,
      color: c.soon ? 'var(--iron-dim)' : 'var(--brass)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: c.soon ? 'var(--iron-dim)' : 'var(--iron-text)'
    }
  }, c.soon ? 'Soon' : c.label)))));
}
window.ScreenHome = ScreenHome;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ScreenHome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ScreenRecords.jsx
try { (() => {
/* Records — all-time bests, IPF GL, per-lift est 1RM / top set. */
const NS_R = window.PowerliftMEIronAmpHearthDesignSystem_c01a24;
function RecCard({
  lift,
  sub,
  oneRm,
  top
}) {
  const {
    Card
  } = NS_R;
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: '16px 18px',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 21,
      color: 'var(--iron-text)'
    }
  }, lift), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--iron-dim)'
    }
  }, sub)), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "trophy",
    style: {
      width: 20,
      height: 20,
      color: 'var(--brass)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 36,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--iron-dim)'
    }
  }, "Est. 1RM"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      color: 'var(--brass)'
    }
  }, oneRm, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--iron-dim)',
      marginLeft: 4
    }
  }, "kg"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--iron-dim)'
    }
  }, "Top Set"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      color: 'var(--brass)'
    }
  }, top, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--iron-dim)',
      marginLeft: 4
    }
  }, "kg")))));
}
function ScreenRecords() {
  const {
    Card,
    Tag,
    StatusPill
  } = NS_R;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 18px 20px',
      overflowY: 'auto',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '10px 0 16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 22,
      color: 'var(--iron-text)'
    }
  }, "Records")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--brass)',
      marginBottom: 8
    }
  }, "All-time bests"), /*#__PURE__*/React.createElement(Card, {
    variant: "accent",
    style: {
      padding: '18px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--iron-dim)'
    }
  }, "Declared vs working"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 22,
      color: 'var(--iron-text)'
    }
  }, "IPF GL Score")), /*#__PURE__*/React.createElement(StatusPill, {
    status: "brass",
    dot: false
  }, "Elite")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      marginTop: 12
    }
  }, [['Real', '820 kg'], ['Working', '761 kg'], ['IPF GL', '103.59']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--iron-dim)'
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      color: 'var(--brass)',
      whiteSpace: 'nowrap'
    }
  }, v))))), /*#__PURE__*/React.createElement(RecCard, {
    lift: "Deadlift",
    sub: "Deadlift",
    oneRm: "330",
    top: "330"
  }), /*#__PURE__*/React.createElement(RecCard, {
    lift: "Squat",
    sub: "Competition Squat",
    oneRm: "300",
    top: "300"
  }), /*#__PURE__*/React.createElement(RecCard, {
    lift: "Bench Press",
    sub: "Bench press",
    oneRm: "190",
    top: "190"
  }));
}
window.ScreenRecords = ScreenRecords;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ScreenRecords.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ScreenToday.jsx
try { (() => {
/* Today — the plan for the day, with a Start Workout that opens the cockpit. */
const NS_T = window.PowerliftMEIronAmpHearthDesignSystem_c01a24;
function NextRow({
  title,
  week,
  planned
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 16px',
      background: 'var(--iron-card)',
      border: '2px solid var(--iron-line)',
      borderRadius: 'var(--r)',
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 18,
      color: 'var(--iron-text)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--iron-dim)',
      letterSpacing: '.06em'
    }
  }, week)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--iron-dim)',
      border: '1.5px solid var(--iron-line)',
      borderRadius: 'var(--r-sm)',
      padding: '4px 9px'
    }
  }, planned), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    style: {
      width: 18,
      height: 18,
      color: 'var(--iron-dim)'
    }
  }));
}
function ScreenToday({
  onStart
}) {
  const {
    Card,
    Tag,
    Button
  } = NS_T;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 18px 20px',
      overflowY: 'auto',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0 16px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "notebook-text",
    style: {
      width: 22,
      height: 22,
      color: 'var(--brass)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 22,
      color: 'var(--iron-text)'
    }
  }, "Today"), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus",
    style: {
      width: 22,
      height: 22,
      color: 'var(--brass)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--brass)',
      marginBottom: 12
    }
  }, "Today"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: "brass"
  }, "Training block \xB7 no meet date set")), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-h1)',
      textTransform: 'uppercase',
      color: 'var(--iron-text)',
      margin: '0 0 18px',
      letterSpacing: '-.01em'
    }
  }, "Squat Day"), /*#__PURE__*/React.createElement(Card, {
    variant: "accent",
    bar: true,
    style: {
      padding: '18px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: "ghost"
  }, "W23 \xB7 D3"), /*#__PURE__*/React.createElement(Tag, {
    tone: "brass-solid"
  }, "Squat Day")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 34,
      color: 'var(--iron-text)',
      lineHeight: 1
    }
  }, "Squat"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 15,
      color: 'var(--iron-dim)',
      margin: '8px 0 18px'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--iron-text)',
      fontFamily: 'var(--font-display)',
      fontSize: 22
    }
  }, "150"), " kg \xA0\xB7\xA0", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--iron-text)',
      fontFamily: 'var(--font-display)',
      fontSize: 22
    }
  }, "5"), " reps"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    block: true,
    size: "lg",
    onClick: onStart
  }, "Start workout")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      margin: '24px 0 4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--brass)'
    }
  }, "Next"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 2,
      background: 'var(--iron-line)'
    }
  })), /*#__PURE__*/React.createElement(NextRow, {
    title: "Bench day",
    week: "W23 \xB7 D5",
    planned: "Planned"
  }), /*#__PURE__*/React.createElement(NextRow, {
    title: "Deadlift day",
    week: "W23 \xB7 D6",
    planned: "Planned"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    block: true,
    icon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "brain-circuit",
      style: {
        width: 18,
        height: 18
      }
    })
  }, "Ask coach")));
}
window.ScreenToday = ScreenToday;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ScreenToday.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Shared.jsx
try { (() => {
/* PowerliftME app — shared chrome (status bar, tab bar, phone frame).
   Iron surface. Icons: Lucide (outline). Exposes to window for sibling screens. */

const {
  IconButton
} = window.PowerliftMEIronAmpHearthDesignSystem_c01a24;
function StatusBar() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 22px 4px',
      color: 'var(--iron-text)',
      fontFamily: 'var(--font-text)',
      fontWeight: 700,
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 7,
      alignItems: 'center',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "signal",
    style: {
      width: 16,
      height: 16
    }
  }), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "wifi",
    style: {
      width: 16,
      height: 16
    }
  }), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "battery-full",
    style: {
      width: 20,
      height: 20
    }
  })));
}
const TABS = [{
  id: 'home',
  label: 'Home',
  icon: 'layout-grid'
}, {
  id: 'today',
  label: 'Today',
  icon: 'calendar-check-2'
}, {
  id: 'records',
  label: 'Records',
  icon: 'trophy'
}, {
  id: 'coach',
  label: 'Coach',
  icon: 'brain-circuit'
}];
function TabBar({
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      borderTop: '2px solid var(--iron-line)',
      background: 'var(--iron)',
      padding: '8px 6px calc(8px + env(safe-area-inset-bottom))'
    }
  }, TABS.map(t => {
    const on = t.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => onChange(t.id),
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        background: 'transparent',
        border: 0,
        cursor: 'pointer',
        padding: '6px 0',
        color: on ? 'var(--red)' : 'var(--iron-dim)',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '.08em',
        textTransform: 'uppercase'
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": t.icon,
      style: {
        width: 22,
        height: 22
      }
    }), t.label);
  }));
}
function useLucide(dep) {
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
}
function PhoneFrame({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    "data-theme": "iron",
    style: {
      width: 390,
      height: 800,
      background: 'var(--iron)',
      borderRadius: 38,
      border: '2px solid #000',
      boxShadow: '0 40px 90px rgba(0,0,0,.6), inset 0 0 0 8px #000',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }
  }, children);
}
Object.assign(window, {
  StatusBar,
  TabBar,
  PhoneFrame,
  useLucide,
  APP_TABS: TABS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Shared.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/Bands.jsx
try { (() => {
/* Marketing site — lifts, screens, pricing, founder, FAQ, footer. Text from SITE_COPY. */
const NS_B = window.PowerliftMEIronAmpHearthDesignSystem_c01a24;
function SiteLifts({
  lang = 'en'
}) {
  const C = window.SITE_COPY[lang].lifts;
  const imgs = ['lift-squat.jpg', 'lift-bench.jpg', 'lift-deadlift.jpg'];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '64px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--red)',
      marginBottom: 10
    }
  }, C.kicker), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 'clamp(28px,4vw,44px)',
      letterSpacing: '-.015em',
      margin: 0,
      lineHeight: .92
    }
  }, C.title)), /*#__PURE__*/React.createElement("div", {
    className: "lifts-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 14
    }
  }, imgs.map((img, i) => /*#__PURE__*/React.createElement("figure", {
    key: img,
    style: {
      margin: 0,
      position: 'relative',
      border: '2px solid var(--ink)',
      borderRadius: 'var(--r)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-block-sm)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `../../assets/${img}`,
    alt: C.names[i],
    style: {
      display: 'block',
      width: '100%',
      aspectRatio: '3/4',
      objectFit: 'cover',
      objectPosition: 'center 80%'
    }
  }), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: '26px 14px 12px',
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 20,
      letterSpacing: '.02em',
      color: 'var(--chalk)',
      background: 'linear-gradient(180deg,transparent,rgba(8,7,5,.85))'
    }
  }, C.names[i])))));
}
function SiteScreens({
  lang = 'en'
}) {
  const {
    SitePhone
  } = window;
  const C = window.SITE_COPY[lang].screens;
  const shots = ['today.png', 'home.png', 'meets.png'];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--paper-2)',
      borderTop: '2px solid var(--ink)',
      borderBottom: '2px solid var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '60px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 34
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--red)',
      marginBottom: 10
    }
  }, C.kicker), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 'clamp(28px,4vw,44px)',
      letterSpacing: '-.015em',
      margin: 0,
      lineHeight: .92
    }
  }, C.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 26,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, shots.map((s, i) => /*#__PURE__*/React.createElement("figure", {
    key: s,
    style: {
      margin: 0,
      maxWidth: 240,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(SitePhone, {
    src: `../../assets/shots/${s}`,
    w: 236
  }), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      fontSize: 14,
      textAlign: 'center',
      color: 'var(--ink-2)',
      lineHeight: 1.45
    }
  }, C.caps[i]))))));
}
function SitePricing({
  lang = 'en'
}) {
  const {
    Card,
    Button,
    Tag
  } = NS_B;
  const C = window.SITE_COPY[lang].pricing;
  return /*#__PURE__*/React.createElement("section", {
    id: "pricing",
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '64px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--red)',
      marginBottom: 10
    }
  }, C.kicker), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 'clamp(28px,4vw,44px)',
      letterSpacing: '-.015em',
      margin: 0,
      lineHeight: .92
    }
  }, C.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 440,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "accent",
    style: {
      padding: '30px 28px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: 4,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      color: 'var(--red)'
    }
  }, "$"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 72,
      color: 'var(--red)',
      lineHeight: .9
    }
  }, "4.99"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 14,
      color: 'var(--ink-soft)'
    }
  }, C.perMo)), C.approx ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--ink-soft)',
      marginBottom: 6
    }
  }, C.approx) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18,
      fontSize: 14,
      color: 'var(--ink-2)'
    }
  }, C.or, " ", /*#__PURE__*/React.createElement("b", null, C.yr), " \xA0", /*#__PURE__*/React.createElement(Tag, {
    tone: "brass",
    size: "sm"
  }, C.best), "\xA0 \xB7 ", C.trial), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: '0 0 22px',
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, C.features.map(t => /*#__PURE__*/React.createElement("li", {
    key: t,
    style: {
      position: 'relative',
      paddingLeft: 26,
      fontSize: 14.5,
      lineHeight: 1.4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      color: 'var(--sage-deep)',
      fontWeight: 900
    }
  }, "\u2713"), t))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    block: true,
    size: "lg",
    as: "a",
    href: "#join"
  }, C.cta), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11.5,
      color: 'var(--ink-soft)',
      margin: '16px 0 0',
      lineHeight: 1.5
    }
  }, C.fine))));
}
function SiteFounder({
  lang = 'en'
}) {
  const C = window.SITE_COPY[lang].founder;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--paper-2)',
      borderTop: '2px solid var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "founder-grid",
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      padding: '60px 24px',
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      gap: 40,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '2px solid var(--ink)',
      borderRadius: 'var(--r)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-block)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/founder.jpg",
    alt: "",
    style: {
      display: 'block',
      width: '100%',
      aspectRatio: '4/5',
      objectFit: 'cover'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--red)',
      marginBottom: 14
    }
  }, C.kicker), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: '0 0 18px',
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 'clamp(22px,2.8vw,32px)',
      lineHeight: 1.04,
      letterSpacing: '-.01em'
    }
  }, C.qPre, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--red)'
    }
  }, C.qRed), C.qEnd), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontWeight: 800,
      fontSize: 16
    }
  }, C.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--ink-soft)'
    }
  }, C.stats), C.profileUrl ? /*#__PURE__*/React.createElement("a", {
    href: C.profileUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 14,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--red)',
      textDecoration: 'none',
      borderBottom: '2px solid var(--red)',
      paddingBottom: 3
    }
  }, C.profileLabel) : null)));
}
function SiteFAQ({
  lang = 'en'
}) {
  const C = window.SITE_COPY[lang].faq;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 760,
      margin: '0 auto',
      padding: '64px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--red)',
      marginBottom: 10
    }
  }, C.kicker), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 'clamp(28px,4vw,44px)',
      letterSpacing: '-.015em',
      margin: 0
    }
  }, C.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, C.qs.map(([q, a]) => /*#__PURE__*/React.createElement("details", {
    key: q,
    style: {
      border: '2px solid var(--ink)',
      borderRadius: 'var(--r-sm)',
      padding: '0 16px',
      background: 'var(--paper-card)'
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: 'pointer',
      padding: '14px 0',
      fontWeight: 800,
      fontSize: 16,
      listStyle: 'none',
      display: 'flex',
      justifyContent: 'space-between',
      gap: 10
    }
  }, q, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--red)',
      fontWeight: 900
    }
  }, "+")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      fontSize: 14.5,
      lineHeight: 1.6,
      color: 'var(--ink-2)'
    }
  }, a)))));
}
function SiteFooter({
  lang = 'en'
}) {
  const C = window.SITE_COPY[lang].footer;
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '2px solid var(--ink)',
      background: 'var(--ink)',
      color: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '28px 24px',
      display: 'flex',
      gap: '12px 22px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 18
    }
  }, "Powerlift", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--red-bright)'
    }
  }, "ME")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), C.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--paper-line)',
      textDecoration: 'none',
      letterSpacing: '.06em'
    }
  }, l)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--ink-soft)'
    }
  }, C.copy)));
}
Object.assign(window, {
  SiteLifts,
  SiteScreens,
  SitePricing,
  SiteFounder,
  SiteFAQ,
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/Bands.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/Gearbox.jsx
try { (() => {
/* Marketing site — The Gearbox (interactive) + the Creed band. Text from SITE_COPY. */
const NS_G = window.PowerliftMEIronAmpHearthDesignSystem_c01a24;

/* Visual props only; all words come from window.SITE_COPY[lang].gearbox */
const GEARS = {
  life: {
    n: '1',
    img: 'gear-life.jpg',
    accent: '#8fa067',
    panel: '#1a1712',
    mood: 'linear-gradient(115deg, rgba(143,160,103,.22), transparent 58%)',
    track: '.04em',
    rule: 2,
    tex: 0,
    live: true
  },
  balance: {
    n: '2',
    img: 'gear-balance.jpg',
    accent: '#d3a23d',
    panel: '#1d1710',
    mood: 'linear-gradient(115deg, rgba(211,162,61,.24), transparent 58%)',
    track: '.02em',
    rule: 3,
    tex: .05,
    live: false
  },
  focus: {
    n: '3',
    img: 'gear-focus.jpg',
    accent: '#e0623f',
    panel: '#1a0f0c',
    mood: 'linear-gradient(115deg, rgba(224,98,63,.30), transparent 52%)',
    track: '-.01em',
    rule: 5,
    tex: .09,
    live: true
  },
  allin: {
    n: '4',
    img: 'gear-allin.jpg',
    accent: '#c8362a',
    panel: '#0b0a08',
    mood: 'linear-gradient(180deg, rgba(200,54,42,.20), rgba(0,0,0,.55) 72%)',
    track: '.06em',
    rule: 8,
    tex: .16,
    live: false
  }
};
function SiteGearbox({
  lang = 'en'
}) {
  const {
    StatusPill
  } = NS_G;
  const C = window.SITE_COPY[lang].gearbox;
  const gearWord = lang === 'ru' ? 'Передача' : 'Gear';
  const [g, setG] = React.useState('life');
  const gear = GEARS[g];
  const a = gear.accent;
  return /*#__PURE__*/React.createElement("section", {
    id: "how",
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '64px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: a,
      marginBottom: 10,
      transition: 'color .35s var(--ease)'
    }
  }, C.kicker, " \xB7 ", C.modes[g]), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 'clamp(30px,4.4vw,48px)',
      letterSpacing: '-.015em',
      margin: 0,
      lineHeight: .92
    }
  }, C.title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-lead)',
      color: 'var(--ink-2)',
      maxWidth: '56ch',
      margin: '14px auto 0'
    }
  }, C.lead)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    "aria-label": "Pick a gear",
    style: {
      display: 'inline-flex',
      gap: 4,
      padding: 4,
      background: 'var(--paper-2)',
      border: '2px solid var(--ink)',
      borderRadius: 'var(--r)',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, Object.keys(GEARS).map(k => {
    const gg = GEARS[k];
    const on = k === g;
    const txt = on ? k === 'balance' ? 'var(--ink)' : 'var(--chalk)' : 'var(--ink)';
    return /*#__PURE__*/React.createElement("button", {
      key: k + '-' + (on ? 1 : 0),
      role: "tab",
      "aria-selected": on,
      onClick: () => setG(k),
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer',
        border: 0,
        borderRadius: 'var(--r-sm)',
        padding: '9px 16px',
        background: on ? gg.accent : 'transparent',
        color: txt,
        fontFamily: 'var(--font-text)',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '.04em',
        fontSize: 13,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        transition: 'background .25s var(--ease),color .25s var(--ease)'
      }
    }, /*#__PURE__*/React.createElement("span", null, gg.n, " \xB7 ", C.labels[k]), /*#__PURE__*/React.createElement("i", {
      style: {
        fontStyle: 'normal',
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '.12em',
        color: on ? k === 'balance' ? 'rgba(27,23,18,.7)' : 'rgba(244,237,220,.8)' : 'var(--ink-soft)'
      }
    }, gg.live ? C.live : C.soon));
  }))), /*#__PURE__*/React.createElement("div", {
    key: 'card-' + g,
    className: "gear-card",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 0,
      border: '2px solid var(--ink)',
      borderRadius: 'var(--r)',
      overflow: 'hidden',
      boxShadow: '5px 5px 0 0 ' + a,
      background: 'var(--ink)',
      minHeight: 360
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      minHeight: 300,
      backgroundImage: `url(../../assets/${gear.img})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'background-image .35s var(--ease)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: gear.mood,
      transition: 'background .35s var(--ease)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 14,
      left: 14
    }
  }, /*#__PURE__*/React.createElement(StatusPill, {
    status: gear.live ? 'live' : 'muted',
    dot: gear.live
  }, gear.live ? C.live : C.soon))), /*#__PURE__*/React.createElement("div", {
    "data-theme": "iron",
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: gear.panel,
      color: 'var(--iron-text)',
      padding: '34px 32px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderLeft: '3px solid ' + a,
      transition: 'background .35s var(--ease), border-color .35s var(--ease)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    key: 'rule-' + g,
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: gear.rule,
      background: a,
      transition: 'height .35s var(--ease), background .35s var(--ease)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      backgroundImage: 'radial-gradient(currentColor 1.1px, transparent 1.2px)',
      backgroundSize: '7px 7px',
      color: a,
      opacity: gear.tex,
      transition: 'opacity .35s var(--ease), color .35s var(--ease)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: '-6px',
      bottom: '-40px',
      fontFamily: 'var(--font-display)',
      fontSize: '230px',
      lineHeight: .7,
      color: a,
      opacity: .12,
      pointerEvents: 'none',
      transition: 'color .35s var(--ease)'
    }
  }, gear.n), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 3,
      background: a,
      transition: 'background .35s var(--ease)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: a,
      transition: 'color .35s var(--ease)'
    }
  }, gearWord, " ", gear.n, " \xB7 ", C.modes[g])), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 31,
      letterSpacing: gear.track,
      margin: '0 0 14px',
      lineHeight: .96,
      transition: 'letter-spacing .35s var(--ease)'
    }
  }, C.heads[g]), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15.5,
      lineHeight: 1.6,
      color: 'var(--iron-dim)',
      maxWidth: '42ch'
    }
  }, C.bodies[g])))));
}
function SiteCreed({
  lang = 'en'
}) {
  const C = window.SITE_COPY[lang].creed;
  return /*#__PURE__*/React.createElement("section", {
    "data-theme": "iron",
    style: {
      position: 'relative',
      overflow: 'hidden',
      borderTop: '2px solid var(--ink)',
      borderBottom: '2px solid var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'url(../../assets/creed.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center 42%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(120% 90% at 50% 40%, rgba(10,9,8,.55), rgba(10,9,8,.9))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 900,
      margin: '0 auto',
      padding: '72px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 'clamp(30px,5vw,56px)',
      lineHeight: 1.0,
      letterSpacing: '-.02em',
      color: 'var(--chalk)',
      margin: 0,
      maxWidth: '20ch',
      marginInline: 'auto'
    }
  }, C.big, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--red-bright)'
    }
  }, C.bigRed)), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-lead)',
      color: 'var(--iron-dim)',
      maxWidth: '52ch',
      margin: '22px auto 0'
    }
  }, C.sub)));
}
Object.assign(window, {
  SiteGearbox,
  SiteCreed
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/Gearbox.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/SiteTop.jsx
try { (() => {
/* Marketing site — top: Nav, Hero, Proof strip. Paper (light) surface. */
const NS_S = window.PowerliftMEIronAmpHearthDesignSystem_c01a24;
function SiteNav({
  lang = 'en',
  onLang
}) {
  const {
    Button
  } = NS_S;
  const t = window.SITE_COPY[lang].nav;
  const langBtn = (code, label) => /*#__PURE__*/React.createElement("button", {
    onClick: () => onLang && onLang(code),
    style: {
      cursor: 'pointer',
      border: 0,
      background: 'transparent',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.08em',
      color: lang === code ? 'var(--ink)' : 'var(--ink-soft)',
      textDecoration: lang === code ? 'underline' : 'none',
      textUnderlineOffset: 4,
      textDecorationThickness: 2,
      padding: '2px 2px'
    }
  }, label);
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--paper)',
      borderBottom: '2px solid var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-inner",
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/icon-192.png",
    alt: "",
    style: {
      width: 34,
      height: 34,
      borderRadius: 8,
      border: '2px solid var(--ink)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "nav-word",
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 21,
      letterSpacing: '-.01em'
    }
  }, "Powerlift", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--red)'
    }
  }, "ME")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "nav-links",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#pricing",
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-soft)',
      textDecoration: 'none'
    }
  }, t.pricing), /*#__PURE__*/React.createElement("a", {
    href: "#how",
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-soft)',
      textDecoration: 'none'
    }
  }, t.how)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      borderLeft: '2px solid var(--paper-line)',
      paddingLeft: 14
    }
  }, langBtn('ru', 'RU'), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--paper-line)'
    }
  }, "/"), langBtn('en', 'EN')), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    as: "a",
    href: "#join"
  }, t.cta)));
}
function SitePhone({
  src,
  w = 300
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: w,
      background: 'var(--ink)',
      borderRadius: 34,
      padding: 9,
      border: '2px solid var(--ink)',
      boxShadow: 'var(--shadow-block)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "PowerliftME app screen",
    style: {
      display: 'block',
      width: '100%',
      borderRadius: 26
    }
  }));
}

/* Four heroes — one per gear / audience. Visual props here; copy in SITE_COPY. */
const HERO_VIS = {
  life: {
    accent: 'var(--red)',
    shot: 'today.png'
  },
  balance: {
    accent: 'var(--brass)',
    shot: 'home.png'
  },
  focus: {
    accent: 'var(--red)',
    shot: 'meets.png'
  },
  allin: {
    accent: 'var(--ink)',
    shot: 'cockpit.png'
  }
};
function SiteHero({
  variant = 'life',
  lang = 'en'
}) {
  const {
    Input,
    Button
  } = NS_S;
  const v = HERO_VIS[variant] || HERO_VIS.life;
  const h = window.SITE_COPY[lang].heroes[variant] || window.SITE_COPY[lang].heroes.life;
  const ph = lang === 'ru' ? 'ты@почта.com' : 'you@email.com';
  return /*#__PURE__*/React.createElement("header", {
    className: "hero-grid",
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '52px 24px 40px',
      display: 'grid',
      gridTemplateColumns: '1.15fr .85fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: 'var(--ink-soft)',
      marginBottom: 12
    }
  }, window.SITE_COPY[lang].cat), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: v.accent,
      border: '2px solid ' + v.accent,
      borderRadius: 999,
      padding: '6px 13px',
      marginBottom: 22
    }
  }, h.kicker), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 'clamp(46px,6.6vw,82px)',
      lineHeight: .86,
      letterSpacing: '-.015em',
      margin: '0 0 20px'
    }
  }, h.pre, /*#__PURE__*/React.createElement("br", null), h.post, /*#__PURE__*/React.createElement("span", {
    style: {
      color: v.accent
    }
  }, h.word), h.end), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-lead)',
      color: 'var(--ink-2)',
      maxWidth: '42ch',
      margin: '0 0 28px'
    }
  }, h.sub), /*#__PURE__*/React.createElement("form", {
    id: "join",
    onSubmit: e => e.preventDefault(),
    style: {
      display: 'flex',
      gap: 10,
      maxWidth: 440,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 220px'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    type: "email",
    placeholder: ph,
    "aria-label": "email"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    type: "submit"
  }, h.cta)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--ink-soft)',
      margin: '14px 0 0',
      maxWidth: '46ch',
      lineHeight: 1.5
    }
  }, h.note)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(SitePhone, {
    src: '../../assets/shots/' + v.shot
  })));
}
function SiteProof({
  lang = 'en'
}) {
  const items = window.SITE_COPY[lang].proof;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--paper-2)',
      borderTop: '2px solid var(--ink)',
      borderBottom: '2px solid var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "proof-grid",
    style: {
      maxWidth: 1120,
      margin: '0 auto',
      padding: '34px 24px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 0
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: '4px 28px',
      borderLeft: i ? '2px solid var(--paper-line)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      fontSize: 19,
      color: 'var(--red)',
      marginBottom: 8,
      letterSpacing: '-.01em'
    }
  }, it[0]), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--ink-2)'
    }
  }, it[1])))));
}
Object.assign(window, {
  SiteNav,
  SiteHero,
  SiteProof,
  SitePhone
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/SiteTop.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/i18n.js
try { (() => {
/* Marketing site — bilingual copy (EN / RU). One dictionary, two languages.
   Visual props (gear accents, images, type tracking) stay in the components;
   only words live here. window.SITE_COPY[lang] -> all strings. */

const SITE_COPY = {
  en: {
    nav: {
      pricing: 'Pricing',
      how: 'How it works',
      cta: 'Join the beta'
    },
    cat: 'iPhone app for powerlifters',
    heroes: {
      life: {
        gear: 'Gear 1 · Life First',
        persona: 'Busy adult',
        kicker: 'For lifters who have a life',
        pre: 'Strong,',
        post: 'around your ',
        word: 'life',
        end: '.',
        sub: 'Life got in the way? Lighter today, no guilt. Two gym days carry the week — miss one and the plan just adapts.',
        cta: 'Join the beta →',
        note: 'Day-one price: $4.99/mo, locked for life. No spam.'
      },
      balance: {
        gear: 'Gear 2 · Balance',
        persona: 'Off-season / first 100',
        kicker: 'No meet on the calendar',
        pre: 'Just get',
        post: '',
        word: 'bigger',
        end: '. And stronger.',
        sub: 'No meet, no clock. Eat volume, grow, and test a true 1RM the day you feel like a freight train — not when a date says so.',
        cta: 'Start growing →',
        note: 'About a coffee a month. First plate to first hundred.'
      },
      focus: {
        gear: 'Gear 3 · Focus',
        persona: 'Competitor',
        kicker: 'You name the date',
        pre: 'Peak for',
        post: 'the ',
        word: 'platform',
        end: '.',
        sub: 'A hidden 1RM model climbs every week and calls your openers — to the kilo, no fairy tales — by meet day.',
        cta: 'Build my peak →',
        note: 'Openers, attempts, IPF GL and meet history — all on your iPhone.'
      },
      allin: {
        gear: 'Gear 4 · All In',
        persona: 'No excuses',
        kicker: 'Fixed schedule. No excuses.',
        pre: 'Hold the',
        post: '',
        word: 'line',
        end: '.',
        sub: 'Exact days, exact sessions, bolted down. When a loose plan is just slow surrender, All In holds the line.',
        cta: 'Lock me in →',
        note: 'Same engine, zero negotiation. Discipline, on rails.'
      }
    },
    proof: [['100% on your iPhone', 'Lives on your phone and your own iCloud. No servers, no ads, no tracking.'], ['The programs you already trust', 'Sheiko · 5/3/1 · Calgary · GreySkull — or a planner that writes its own.'], ['Built by a competitive lifter', 'A 162.5 kg comp bench behind every call. A lifter\u2019s app, not a spreadsheet with a logo.']],
    gearbox: {
      kicker: 'The Gearbox',
      title: 'One app. Four gears.',
      lead: 'Your first plate or your next platform total — one app, four gears. You just pick yours.',
      live: 'Live',
      soon: 'Soon',
      modes: {
        life: 'Cruise',
        balance: 'Build',
        focus: 'Peak',
        allin: 'Redline'
      },
      labels: {
        life: 'Life First',
        balance: 'Balance',
        focus: 'Focus',
        allin: 'All In'
      },
      heads: {
        life: 'Strong, around your life.',
        balance: 'Build, no deadline.',
        focus: 'Peak for a date.',
        allin: 'Fixed schedule. No excuses.'
      },
      bodies: {
        life: 'Two kids, a 6 a.m. alarm, a boss who books evening meetings. Two gym days do the heavy lifting; quick home top-ups mop up the rest. Miss a week and the plan just adapts.',
        balance: 'Pure off-season hunger. No meet on the calendar, so you just get bigger and stronger — and you test your max the day you feel like a freight train, not the day a date orders you to.',
        focus: 'You name the date; the app names the numbers. A hidden 1RM model climbs every week and calls your openers — to the kilo, no fairy tales — for the platform.',
        allin: 'For the lifter who answers to a calendar, not a mood. Exact days, exact sessions, bolted down. When a loose plan is just a slow surrender, All In holds the line.'
      }
    },
    creed: {
      big: 'Life happens.',
      bigRed: 'Your training shouldn\u2019t punish you for it.',
      sub: 'Miss a session, sleep badly, lose a week to a sick kid — PowerliftME adjusts and brings you back to full load. Progress survives real life.'
    },
    lifts: {
      kicker: 'Squat · Bench · Deadlift',
      title: 'Three lifts are sacred. The rest bends.',
      names: ['Squat', 'Bench', 'Deadlift']
    },
    screens: {
      kicker: 'See it in action',
      title: 'Real screens. Real plates on the bar.',
      caps: ['Your day, already planned — and it bends when life does.', 'Your PRs as loaded bars — the way lifters actually think.', 'Where you stand — live IPF class and total.']
    },
    pricing: {
      kicker: 'Pricing',
      title: 'About a coffee a month.',
      perMo: '/ mo',
      approx: '',
      or: 'or',
      yr: '$39.99/yr',
      best: 'Best value',
      trial: '7-day free trial',
      features: ['Every program — plus a planner that writes itself', 'No-guilt deloads, meet peaking, and the coach', '100% on-device — your data never leaves your iPhone'],
      cta: 'Get in early →',
      fine: 'Day-one lifters lock in $4.99/mo for life. Cancel anytime.'
    },
    founder: {
      kicker: 'Built by a lifter',
      qPre: '\u201CTwo years, zero kilos added to my meet bench. That\u2019s not a confession — that\u2019s the ',
      qRed: 'reason this app exists',
      qEnd: '.\u201D',
      name: 'Dmitry Grishchenko · founder',
      stats: 'Raw total · 185 / 162.5 / 207.5',
      profileUrl: 'https://www.openpowerlifting.org/u/dmitrygrishchenko',
      profileLabel: 'Verified on OpenPowerlifting →'
    },
    faq: {
      kicker: 'Questions',
      title: 'Straight answers',
      qs: [['When can I get it?', 'We\u2019re in the final stretch before the TestFlight beta. Join the list and you get an invite the day it opens — day-one lifters first.'], ['What if I miss a week?', 'The plan eases you back in and climbs to where you left off. No guilt, no "you\u2019re behind." Real life is the feature, not the bug.'], ['Is my data private?', 'Yes. Everything lives on your iPhone, syncing only to your own iCloud — no servers, no analytics, no ads. Even the AI runs on-device.'], ['Do I have to follow one program?', 'No. Run Sheiko, 5/3/1, Calgary or GreySkull — or let the planner grow with you. Squat, bench and deadlift stay fixed; everything else is yours.']]
    },
    footer: {
      links: ['Privacy', 'Support', 'Contact'],
      copy: '© 2026'
    }
  },
  ru: {
    nav: {
      pricing: 'Цена',
      how: 'Как это работает',
      cta: 'В бету'
    },
    cat: 'Приложение для пауэрлифтинга · iPhone',
    heroes: {
      life: {
        gear: 'Передача 1 · Жизнь важнее',
        persona: 'Занятой взрослый',
        kicker: 'Для тех, у кого есть жизнь',
        pre: 'Сильный,',
        post: 'вокруг своей ',
        word: 'жизни',
        end: '.',
        sub: 'Стало тяжело по жизни? Сегодня — легче, без чувства вины. Два зала в неделю делают основную работу — пропустил неделю, и ничего, план подстроится.',
        cta: 'В бету →',
        note: 'Цена первопроходца — 4,99 $/мес остаётся с тобой навсегда. Никакого спама.'
      },
      balance: {
        gear: 'Передача 2 · Баланс',
        persona: 'Межсезонье / первая сотня',
        kicker: 'Без даты на календаре',
        pre: 'Просто стань',
        post: '',
        word: 'больше',
        end: '. И сильнее.',
        sub: 'Без дедлайна и спешки. Растёшь на объёме и проверяешь максимум в тот день, когда прёт как танк, — а не когда дата прикажет.',
        cta: 'Начать расти →',
        note: 'Цена чашки кофе в месяц. От первого блина до первой сотни.'
      },
      focus: {
        gear: 'Передача 3 · Фокус',
        persona: 'Соревнующийся',
        kicker: 'Ты называешь дату',
        pre: 'Пик к',
        post: '',
        word: 'помосту',
        end: '.',
        sub: 'Ты называешь дату — приложение называет килограммы. Скрытая проекция растёт неделя за неделей и говорит — до килограмма, без сказок — с чем ты выйдешь на помост.',
        cta: 'Собрать пик →',
        note: 'Выбор подходов, IPF GL и история стартов — всё на твоём iPhone.'
      },
      allin: {
        gear: 'Передача 4 · Ва-банк',
        persona: 'Без отмазок',
        kicker: 'Жёсткий график. Без отмазок.',
        pre: 'Держи',
        post: '',
        word: 'строй',
        end: '.',
        sub: 'Точные дни, точные сессии — намертво. Когда свободный план превращается в медленную капитуляцию, «Ва-банк» держит строй.',
        cta: 'Встать в строй →',
        note: 'Тот же план, никаких переговоров с собой. Дисциплина по рельсам.'
      }
    },
    proof: [['100% на твоём iPhone', 'Тренировки живут на телефоне и в твоём iCloud. Ни серверов, ни рекламы, ни слежки.'], ['Системы, которым доверяют', 'Шейко · 5/3/1 · Калгари · GreySkull — или планировщик, который растёт сам.'], ['Сделано действующим лифтером', '162,5 кг соревновательного жима за каждым решением. Приложение лифтера, а не таблица с логотипом.']],
    gearbox: {
      kicker: 'Коробка передач',
      title: 'Одно приложение. Четыре передачи.',
      lead: 'От первого блина до соревновательной суммы — одно приложение, четыре передачи. Выбираешь свою.',
      live: 'Есть',
      soon: 'Скоро',
      modes: {
        life: 'Круиз',
        balance: 'Набор',
        focus: 'Пик',
        allin: 'Отсечка'
      },
      labels: {
        life: 'Жизнь важнее',
        balance: 'Баланс',
        focus: 'Фокус',
        allin: 'Ва-банк'
      },
      heads: {
        life: 'Сильный, вокруг своей жизни.',
        balance: 'Расти без дедлайна.',
        focus: 'Пик к дате.',
        allin: 'Жёсткий график. Без отмазок.'
      },
      bodies: {
        life: 'Двое детей, будильник в 6 утра, начальник с вечерними совещаниями. Два зала тянут основное; быстрые домашние подходы добивают остальное. Пропустишь неделю — и ничего, план подстроится.',
        balance: 'Чистый межсезонный голод. Даты на календаре нет, поэтому ты просто становишься больше и сильнее — и проверяешь максимум в день, когда прёт как танк, а не когда дата прикажет.',
        focus: 'Ты называешь дату; приложение называет цифры. Скрытая проекция растёт неделя за неделей и говорит — до килограмма, без сказок — с чем ты откроешься на помосте.',
        allin: 'Для того, кто отвечает перед календарём, а не перед настроением. Точные дни, точные сессии — намертво. Когда свободный план превращается в медленную капитуляцию, «Ва-банк» держит строй.'
      }
    },
    creed: {
      big: 'Жизнь случается.',
      bigRed: 'Тренировки не должны за это наказывать.',
      sub: 'Пропустил сессию, плохо спал, потерял неделю из-за заболевшего ребёнка — PowerliftME подстроится и вернёт тебя к полной нагрузке. Прогресс переживает реальную жизнь.'
    },
    lifts: {
      kicker: 'Присед · Жим · Тяга',
      title: 'Три движения священны. Остальное гнётся.',
      names: ['Присед', 'Жим', 'Тяга']
    },
    screens: {
      kicker: 'Посмотри в деле',
      title: 'Настоящие экраны. Настоящие блины на грифе.',
      caps: ['Твой день уже расписан — и гнётся, когда гнётся жизнь.', 'Рекорды — загруженным грифом. Так, как думает лифтер.', 'Где ты стоишь: разряд IPF и сумма, вживую.']
    },
    pricing: {
      kicker: 'Цена',
      title: 'Цена чашки кофе в месяц.',
      perMo: '/ мес',
      approx: '',
      or: 'или',
      yr: '$39.99/год',
      best: 'Выгоднее всего',
      trial: '7 дней бесплатно',
      features: ['Все программы + планировщик, который растёт сам', 'Подстройка без вины, пик к турниру и тренер', '100% на устройстве — данные не покидают iPhone'],
      cta: 'У истоков →',
      fine: 'Первопроходцы закрепляют 4,99 $/мес навсегда. Отмена в любой момент.'
    },
    founder: {
      kicker: 'Сделано лифтером',
      qPre: '«Два года, ноль килограммов к соревновательному жиму. Это не признание — это ',
      qRed: 'причина, по которой существует это приложение',
      qEnd: '».',
      name: 'Дмитрий Грищенко · основатель',
      stats: 'Сумма без экипировки · 185 / 162,5 / 207,5',
      profileUrl: 'https://www.openpowerlifting.org/u/dmitrygrishchenko',
      profileLabel: 'Подтверждено на OpenPowerlifting →'
    },
    faq: {
      kicker: 'Вопросы',
      title: 'Прямые ответы',
      qs: [['Когда я смогу его получить?', 'PowerliftME на финишной прямой перед бетой в TestFlight. Запишись — и получишь приглашение в день старта. Первопроходцы — первыми.'], ['А если я пропущу неделю?', 'План мягко вернёт тебя в строй и доберётся туда, где ты остановился. Без вины и без «ты отстал». Реальная жизнь — это фича, а не баг.'], ['Мои данные приватны?', 'Да. Всё живёт на твоём iPhone и синхронизируется только с твоим iCloud — ни серверов, ни аналитики, ни рекламы. Даже ИИ работает на устройстве.'], ['Обязательно следовать одной программе?', 'Нет. Гоняй Шейко, 5/3/1, Калгари или GreySkull — или дай планировщику расти вместе с тобой. Присед, жим и тяга остаются на месте; остальное — твоё.']]
    },
    footer: {
      links: ['Приватность', 'Поддержка', 'Контакты'],
      copy: '© 2026'
    }
  }
};
window.SITE_COPY = SITE_COPY;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/i18n.js", error: String((e && e.message) || e) }); }

// ui_kits/site/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.PlateBar = __ds_scope.PlateBar;

__ds_ns.StatReadout = __ds_scope.StatReadout;

__ds_ns.StatusPill = __ds_scope.StatusPill;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

})();
