// ── STICKY CALLBACK RAIL (project pages only) ──
// A "Request a Callback" card that appears once the visitor scrolls past the
// hero and then stays with them down the page.
//
// This is one shared file rather than the same 70 lines of markup pasted into
// ten pages, for the same reason nav.html and footer.html are shared: the last
// time this site duplicated a "shared" component across pages, the copies
// drifted into three different sets of values. Add a project page and it only
// needs the placeholder div and this script tag.
//
// The project is derived from the filename, pre-selected in the dropdown, and
// used to populate the unit-type list. It stays editable — a visitor reading
// about Signature may well want to ask about something else.
(function () {
  "use strict";

  // filename -> the value used by the project <select> and the unit-type map
  var PROJECT_BY_PAGE = {
    "signature.html": "signature",
    "cubix.html": "cubix",
    "vantage.html": "vantage",
    "salubrity.html": "salubrity",
    "fairmont.html": "fairmont",
    "ohana.html": "ohana",
    "jeppu.html": "jeppu",
    "skydale.html": "skydale",
    "splendid.html": "splendid",
    "bonita.html": "bonita",
  };

  var PROJECT_LABELS = [
    ["signature", "Westline Signature — Nanthoor"],
    ["cubix", "Cubix — Kadri"],
    ["vantage", "Vantage — Kankanady"],
    ["salubrity", "Salubrity — Falnir"],
    ["ohana", "Ohana Luxury Stays — Chikmagalur"],
    ["fairmont", "Fairmont — Kadri"],
    ["jeppu", "Jeppu Medicity"],
    ["skydale", "Skydale"],
    ["splendid", "Splendid Homes"],
    ["bonita", "Bonita"],
    ["notsure", "Not Sure Yet"],
  ];

  // Mirrors the homepage list. The four completed projects are sold out, so
  // "Resale Enquiry" is the only honest option — offering unit types on a
  // building with nothing left to sell would generate leads we cannot serve.
  var UNIT_TYPES_BY_PROJECT = {
    signature: ["2 BHK Type 1 (1,590 sq ft)", "2 BHK Type 2 (1,695 sq ft)", "3 BHK (2,070 sq ft)", "4 BHK Simplex (3,285 sq ft)", "3 BHK Duplex + Media", "4 BHK Duplex + Media", "Sky Villa Penthouse", "Not Sure — Show Me Options"],
    cubix: ["Retail Space", "Office / IT Park Floor", "Hotel / Serviced Residence"],
    vantage: ["Retail Unit", "Office Unit"],
    salubrity: ["Clinic / Practitioner Space", "Diagnostic Lab", "Pharmacy / Retail", "General Office Use"],
    fairmont: ["1 BHK Serviced Apartment", "2 BHK Serviced Apartment", "3 BHK Serviced Apartment"],
    ohana: ["Cottage Unit", "Suite Unit", "Investment — Any Unit"],
    jeppu: ["Resale Enquiry"],
    skydale: ["Resale Enquiry"],
    splendid: ["Resale Enquiry"],
    bonita: ["Resale Enquiry"],
    notsure: ["Not Sure Yet"],
  };

  // Cubix is lease-only, so "purchase" framing would be wrong there.
  var LEASE_ONLY = { cubix: true };

  function currentPage() {
    var last = location.pathname.split("/").pop();
    if (!last) return "index.html";
    return last.indexOf(".") === -1 ? last + ".html" : last;
  }

  var page = currentPage();
  var project = PROJECT_BY_PAGE[page];
  var mount = document.getElementById("callback-rail");
  if (!project || !mount) return;

  /* ── styles ───────────────────────────────────────────────────────────── */
  var css = [
    // Reserve the gutter so page content never slides under the fixed rail.
    "@media(min-width:1280px){body.cb-on .panel,body.cb-on .tab-panel,body.cb-on .sec{padding-right:352px}}",
    "#callback-rail{width:100%}",
    ".cb-card{background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:24px;box-shadow:0 12px 40px rgba(166,124,61,0.10)}",
    ".cb-title{font-family:'Cormorant Garamond',serif;font-size:19px;letter-spacing:0.06em;color:var(--gold);margin-bottom:6px;font-weight:500;text-transform:uppercase}",
    ".cb-sub{font-size:11px;color:var(--muted);margin-bottom:18px;line-height:1.6}",
    ".cb-row{margin-bottom:16px}",
    ".cb-label{font-size:11px;color:var(--text);margin-bottom:7px;display:block}",
    ".cb-label .req{color:var(--gold)}",
    ".cb-input,.cb-select{width:100%;background:transparent;border:none;border-bottom:1.5px solid var(--border);padding:7px 0;color:var(--text);font-family:'Jost',sans-serif;font-size:13px;outline:none;transition:border-color .3s;border-radius:0;appearance:none}",
    ".cb-input::placeholder{color:var(--muted)}",
    ".cb-input:focus,.cb-select:focus{border-bottom-color:var(--gold)}",
    ".cb-select{cursor:pointer;background-image:url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23A67C3D\" stroke-width=\"2\"><polyline points=\"6 9 12 15 18 9\"/></svg>');background-repeat:no-repeat;background-position:right center;background-size:13px}",
    ".cb-select option{color:var(--text);background:var(--surface)}",
    ".cb-phone{display:flex;align-items:center;gap:7px;border-bottom:1.5px solid var(--border)}",
    ".cb-phone:focus-within{border-bottom-color:var(--gold)}",
    ".cb-phone-pre{font-size:13px;color:var(--text2);padding:7px 0;flex-shrink:0}",
    ".cb-phone .cb-input{border-bottom:none}",
    ".cb-consent{display:flex;gap:8px;align-items:flex-start;margin-bottom:12px}",
    ".cb-consent input{margin-top:3px;accent-color:var(--gold);flex-shrink:0;cursor:pointer}",
    ".cb-consent label{font-size:10.5px;color:var(--text2);line-height:1.55}",
    ".cb-consent a{color:var(--gold);font-weight:500}",
    ".cb-btn{width:100%;background:var(--gold);color:#fff;border:none;padding:12px 0;font-family:'Jost',sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;cursor:pointer;margin-top:4px;transition:background .3s;border-radius:2px}",
    ".cb-btn:hover{background:var(--ink)}",
    // Desktop: fixed to the right, revealed once the hero is behind us.
    "@media(min-width:1280px){",
    // --cb-top is measured at runtime from whatever is pinned above the page —
    // project pages have a sticky tab bar under the nav, and using nav height
    // alone put the top of the card behind it.
    "  #callback-rail{position:fixed;top:var(--cb-top, 110px);right:28px;width:300px;max-height:calc(100vh - var(--cb-top, 110px) - 24px);overflow-y:auto;z-index:60;",
    "    opacity:0;visibility:hidden;transform:translateY(10px);transition:opacity .45s ease,transform .45s ease,visibility .45s;scrollbar-width:thin}",
    "  #callback-rail.cb-visible{opacity:1;visibility:visible;transform:none}",
    "}",
    // Below that, it simply sits in the page under the hero.
    "@media(max-width:1279px){#callback-rail{padding:0 20px;margin:36px 0 8px}.cb-card{max-width:440px;margin:0 auto}}",
    "@media(prefers-reduced-motion:reduce){#callback-rail{transition:none}}",
  ].join("\n");

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ── markup ───────────────────────────────────────────────────────────── */
  var buying = LEASE_ONLY[project] ? "I'm Looking to Lease" : "I'm Looking to Purchase";
  var projectOptions = PROJECT_LABELS.map(function (p) {
    return '<option value="' + p[0] + '"' + (p[0] === project ? " selected" : "") + ">" + p[1] + "</option>";
  }).join("");

  mount.innerHTML =
    '<div class="cb-card">' +
      '<div class="cb-title">Request a Callback</div>' +
      '<div class="cb-sub">Tell us how to reach you and our team will call back.</div>' +
      '<div class="cb-row"><label class="cb-label">Your Name<span class="req">*</span></label>' +
        '<input type="text" class="cb-input" data-field="name" placeholder="Enter Your Name" autocomplete="name"></div>' +
      '<div class="cb-row"><label class="cb-label">Mobile<span class="req">*</span></label>' +
        '<div class="cb-phone"><span class="cb-phone-pre">+91</span>' +
        '<input type="tel" class="cb-input" data-field="phone" placeholder="Your Mobile" autocomplete="tel" maxlength="10"></div></div>' +
      '<div class="cb-row"><label class="cb-label">Your Email</label>' +
        '<input type="email" class="cb-input" data-field="email" placeholder="Enter Your Email" autocomplete="email"></div>' +
      '<div class="cb-row"><label class="cb-label">City</label>' +
        '<input type="text" class="cb-input" data-field="city" placeholder="Your City" autocomplete="address-level2"></div>' +
      '<div class="cb-row"><label class="cb-label">Project of Interest</label>' +
        '<select class="cb-select" id="cb-project" data-field="project">' + projectOptions + "</select></div>" +
      '<div class="cb-row"><label class="cb-label">Unit Type</label>' +
        '<select class="cb-select" id="cb-unittype" data-field="unit_type"></select></div>' +
      '<div class="cb-row"><label class="cb-label">' + buying + "</label>" +
        '<select class="cb-select" data-field="purchase_timeline">' +
          '<option value="">Select</option><option>Immediately</option><option>In the Next 3 Months</option>' +
          "<option>In the Next 6 Months</option><option>In the Next 12 Months</option><option>Just Curious</option>" +
        "</select></div>" +
      '<div class="cb-consent"><input type="checkbox" id="cb-terms" data-field="terms_accepted">' +
        '<label for="cb-terms">I confirm that I am 18 years of age or older and agree to the ' +
        '<a href="terms.html">Terms and Conditions</a> and <a href="privacy.html">Privacy Policy</a>, ' +
        "including the collection and processing of my personal data.</label></div>" +
      '<div class="cb-consent"><input type="checkbox" id="cb-marketing" data-field="marketing_opt_in">' +
        '<label for="cb-marketing">Inform me about upcoming projects and offers.</label></div>' +
      '<button class="cb-btn" type="button" data-orig="Request a Callback">Request a Callback</button>' +
    "</div>";

  /* ── unit types follow the selected project ───────────────────────────── */
  var projectSel = mount.querySelector("#cb-project");
  var unitSel = mount.querySelector("#cb-unittype");

  function fillUnitTypes() {
    var opts = UNIT_TYPES_BY_PROJECT[projectSel.value] || ["General Enquiry"];
    unitSel.innerHTML =
      '<option value="">Select a unit type</option>' +
      opts.map(function (o) { return "<option>" + o + "</option>"; }).join("");
  }
  projectSel.addEventListener("change", fillUnitTypes);
  fillUnitTypes();

  // westline-forms.js defines window.submitForm and loads after this file, so
  // the handler is resolved at click time rather than captured now.
  mount.querySelector(".cb-btn").addEventListener("click", function (e) {
    if (typeof window.submitForm === "function") window.submitForm(e);
    else console.error("[callback-rail] westline-forms.js has not loaded — submission would be lost.");
  });

  /* ── reveal once the hero is behind us (desktop only) ─────────────────── */
  var desktop = window.matchMedia("(min-width:1280px)");
  var hero = document.querySelector(".proj-hero");
  var tabsBar = document.querySelector(".tabs-bar");

  // Whatever is sticky above the content decides where the card can start.
  // Measured rather than hardcoded: the tab bar is 56px on Signature but the
  // other pages differ, and its own sticky offset is set in each page's CSS.
  function measureTop() {
    var top = 18;
    if (tabsBar) {
      var stickyTop = parseFloat(getComputedStyle(tabsBar).top) || 0;
      top = stickyTop + tabsBar.getBoundingClientRect().height + 18;
    } else {
      var navEl = document.getElementById("nav");
      top = (navEl ? navEl.getBoundingClientRect().height : 68) + 18;
    }
    document.documentElement.style.setProperty("--cb-top", Math.round(top) + "px");
  }

  function sync() {
    if (!desktop.matches) {
      document.body.classList.remove("cb-on");
      mount.classList.remove("cb-visible");
      return;
    }
    var past = hero ? hero.getBoundingClientRect().bottom <= 90 : window.scrollY > 400;
    mount.classList.toggle("cb-visible", past);
    document.body.classList.toggle("cb-on", past);
  }

  // Throttled on a timestamp rather than requestAnimationFrame. sync() only
  // reads one bounding box and toggles two classes, so it does not need to be
  // frame-aligned, and rAF does not fire at all while a tab is hidden — which
  // would leave a "waiting for the next frame" latch stuck shut.
  var lastRun = 0;
  function onScroll() {
    var now = Date.now();
    if (now - lastRun < 80) return;
    lastRun = now;
    sync();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { measureTop(); sync(); });
  if (desktop.addEventListener) desktop.addEventListener("change", sync);
  measureTop();
  sync();
  // The tab bar's height depends on webfonts, so re-measure once they land.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureTop);
})();
