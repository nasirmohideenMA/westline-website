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
    ["signature", "Signature — Nanthoor"],
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
    // Two real columns. The card is sticky inside its own column, so it travels
    // with the reader and stops where the column stops — at the footer.
    //
    // This replaced a fixed rail that flickered at the bottom of the page. The
    // cause was structural: hiding it removed the reserved gutter, the content
    // reflowed wider, the page got shorter, the footer moved back out of view
    // and it re-showed — a loop. Laying it out in flow removes the loop rather
    // than damping it, and deletes the scroll handler, the body class and the
    // gutter overrides along with it.
    "@media(min-width:1280px){",
    "  .wl-layout{display:grid;grid-template-columns:minmax(0,1fr) 340px}",
    // The content sections alternate their own backgrounds, so those bands now
    // stop at the column edge. A hairline makes that read as a deliberate
    // column rather than a seam where a background ran out.
    "  .wl-rail{padding:0 28px 0 26px;background:var(--surface2);border-left:1px solid var(--border2)}",
    // Sticky goes on #callback-rail, NOT on .cb-card.
    //
    // A sticky element travels within its own parent's box. .cb-card's parent
    // is #callback-rail, which shrink-wraps to the card — 594px for a 594px
    // card, i.e. no room to move, so it scrolled away as if sticky were not
    // set at all. #callback-rail's parent is the .wl-rail aside, which is
    // stretched to the full height of the content column, so sticking there
    // gives it the whole column to travel and it stops at the footer.
    //
    // max-height caps it to the viewport: the card is ~594px, and on a 700px
    // screen 134 + 594 would push the submit button below the fold with no way
    // to reach it, since a pinned element no longer scrolls with the page.
    "  .wl-rail #callback-rail{position:sticky;top:var(--cb-top, 130px);margin-top:34px;",
    "    max-height:calc(100vh - var(--cb-top, 130px) - 24px);overflow-y:auto;scrollbar-width:thin}",
    "  .wl-rail .cb-card{position:static;margin-top:0}",
    "  .vg-wide-grid{grid-template-columns:repeat(4,1fr);gap:12px}",
    "}",
    // Stacked below the breakpoint. The rail is last in the markup so the
    // desktop grid can place it on the right, but on a phone that would bury
    // the form under the whole page — order:-1 lifts it back to just under the
    // hero, where it was before this became a column.
    "@media(max-width:1279px){",
    "  .wl-layout{display:flex;flex-direction:column}",
    "  .wl-rail{order:-1;padding:0 20px;margin:30px 0 6px;border-left:none;background:transparent}",
    "  .wl-rail .cb-card{max-width:440px;margin:0 auto}",
    "}",
    "#callback-rail{width:100%}",
    // Sized to fit a laptop screen without the card scrolling inside itself:
    // at 774px it overflowed a 742px slot on a 900px-tall viewport, and the
    // seven field rows were 399px of that on their own.
    ".cb-card{background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:18px 20px;box-shadow:0 12px 40px rgba(166,124,61,0.10)}",
    ".cb-title{font-family:'Cormorant Garamond',serif;font-size:18px;letter-spacing:0.06em;color:var(--gold);margin-bottom:14px;font-weight:500;text-transform:uppercase}",
    ".cb-row{margin-bottom:10px}",
    ".cb-label{font-size:10.5px;color:var(--text);margin-bottom:4px;display:block;line-height:1.3}",
    ".cb-label .req{color:var(--gold)}",
    ".cb-input,.cb-select{width:100%;background:transparent;border:none;border-bottom:1.5px solid var(--border);padding:6px 0;color:var(--text);font-family:'Jost',sans-serif;font-size:13px;outline:none;transition:border-color .3s;border-radius:0;appearance:none}",
    ".cb-input::placeholder{color:var(--muted)}",
    ".cb-input:focus,.cb-select:focus{border-bottom-color:var(--gold)}",
    ".cb-select{cursor:pointer;background-image:url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23A67C3D\" stroke-width=\"2\"><polyline points=\"6 9 12 15 18 9\"/></svg>');background-repeat:no-repeat;background-position:right center;background-size:13px}",
    // The open dropdown is drawn by the browser, so only some of it is
    // reachable from CSS. accent-color and the option background are; the
    // linear-gradient is the trick that makes Chrome honour a background on the
    // highlighted row, where a plain background-color is ignored.
    ".cb-select{accent-color:var(--gold)}",
    ".cb-select option{color:var(--text);background:var(--surface);padding:9px 12px;line-height:2}",
    ".cb-select option:checked,.cb-select option:hover,.cb-select option:focus{",
    "  background:linear-gradient(var(--gold),var(--gold));color:#fff;font-weight:500}",
    ".cb-phone{display:flex;align-items:center;gap:7px;border-bottom:1.5px solid var(--border)}",
    ".cb-phone:focus-within{border-bottom-color:var(--gold)}",
    ".cb-phone-pre{font-size:13px;color:var(--text2);padding:7px 0;flex-shrink:0}",
    ".cb-phone .cb-input{border-bottom:none}",
    ".cb-consent{display:flex;gap:7px;align-items:flex-start;margin-bottom:7px}",
    ".cb-consent input{margin-top:2px;accent-color:var(--gold);flex-shrink:0;cursor:pointer}",
    ".cb-consent label{font-size:10px;color:var(--text2);line-height:1.45}",
    ".cb-consent a{color:var(--gold);font-weight:500}",
    ".cb-btn{width:100%;background:var(--gold);color:#fff;border:none;padding:11px 0;font-family:'Jost',sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;cursor:pointer;margin-top:6px;transition:background .3s;border-radius:4px}",
    ".cb-btn:hover{background:var(--ink)}",
    // .cb-select was ~32px tall, .cb-btn ~37px — both under the 44px tap
    // target minimum. min-height only, mobile-only: desktop keeps the
    // original compact padding-driven height.
    "@media(max-width:600px){",
    "  .cb-select{min-height:44px}",
    "  .cb-btn{min-height:44px}",
    "}",
  ].join("\n");

  var style = document.createElement("style");
  style.textContent = css;
  // Appended to <body>, not <head>. These pages carry <style> blocks partway
  // down the body, and a head-injected sheet loses to them at equal
  // specificity — which is why the video grid stayed four across. This script
  // tag sits below those blocks, so appending here lands after them.
  (document.body || document.head).appendChild(style);

  /* ── markup ───────────────────────────────────────────────────────────── */
  var buying = LEASE_ONLY[project] ? "I'm Looking to Lease" : "I'm Looking to Purchase";
  var projectOptions = PROJECT_LABELS.map(function (p) {
    return '<option value="' + p[0] + '"' + (p[0] === project ? " selected" : "") + ">" + p[1] + "</option>";
  }).join("");

  mount.innerHTML =
    '<div class="cb-card">' +
      '<div class="cb-title">Request a Callback</div>' +
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
      // Shortened, but the substance is unchanged: age confirmation, agreement
      // to both documents, and explicit consent to processing — which DPDP
      // requires be asked for, not buried.
      '<div class="cb-consent"><input type="checkbox" id="cb-terms" data-field="terms_accepted">' +
        '<label for="cb-terms">I\'m 18 or older and accept the <a href="terms.html">Terms</a> and ' +
        '<a href="privacy.html">Privacy Policy</a>, including processing of my data.</label></div>' +
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

  /* ── where the sticky card can start ──────────────────────────────────────
     The only measurement still needed. Everything above the content that is
     pinned — the nav, and the sticky section tab bar on project pages — has to
     be cleared, or the top of the card sits behind it. Measured rather than
     hardcoded: the tab bar is 56px on Signature, differs elsewhere, and each
     page sets its own sticky offset in CSS.

     There is deliberately no scroll listener any more. The card's position is
     the browser's job now, which is what stopped the flickering. */
  var tabsBar = document.querySelector(".tabs-bar");

  function measureTop() {
    var top;
    if (tabsBar) {
      top = (parseFloat(getComputedStyle(tabsBar).top) || 0) + tabsBar.getBoundingClientRect().height + 18;
    } else {
      var navEl = document.getElementById("nav");
      top = (navEl ? navEl.getBoundingClientRect().height : 68) + 18;
    }
    document.documentElement.style.setProperty("--cb-top", Math.round(top) + "px");
  }

  measureTop();
  window.addEventListener("resize", measureTop);
  // The tab bar's height depends on webfonts, so re-measure once they land.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureTop);
})();
