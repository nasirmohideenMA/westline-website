// ── SHARED FORM SUBMISSION HANDLER ──
// Every page defines its own local fake-success submitForm()/submitEnquiry()
// (or, on careers.html, a separate submitApp() this file intentionally does
// not touch — resume uploads need a Cloudinary step first, still deferred).
// Because this script loads after each page's inline <script>, the functions
// defined here overwrite those local fake ones with the real thing.
(function () {
  "use strict";

  var CONFIG = {
    ORIGINONE_ENABLED: true,
    ORIGINONE_URL: "https://tercgsdwswtnyrrrjeab.supabase.co/functions/v1/website-lead-intake",
    // Built and ready, but inert until an EmailJS account exists. Once you
    // have a Service ID / Template ID / Public Key, fill these in and flip
    // EMAILJS_ENABLED to true — nothing else needs to change.
    EMAILJS_ENABLED: false,
    EMAILJS_SERVICE_ID: "",
    EMAILJS_TEMPLATE_ID: "",
    EMAILJS_PUBLIC_KEY: "",
  };

  // Partner/services enquiries aren't buyer leads — they stay email-only and
  // never reach OriginOne. Every other page (including both forms on
  // index.html) is treated as a genuine buyer enquiry.
  var EMAIL_ONLY_PAGES = ["agents.html", "landowners.html", "services.html"];

  var PAGE_LOAD_TIME = Date.now();
  var MAX_CLIMB = 8;

  function currentPage() {
    var last = location.pathname.split("/").pop();
    return last || "index.html";
  }

  function slugify(label) {
    return label
      .replace(/\*/g, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  // Pages use two markup styles: a handful (contact.html, index.html's
  // callback widget) tag inputs with data-field="name" etc; everything else
  // just uses a consistent .fg > .fl (label) + .fi/.fsel/.fta (input)
  // structure with no explicit field name. Rather than retrofit data-field
  // onto every page, derive a key from the label text when data-field isn't
  // present.
  function collectFields(button) {
    var container = button.parentElement;
    var hops = 0;
    while (
      container &&
      container !== document.body &&
      hops < MAX_CLIMB &&
      !container.querySelector(".fg, [data-field]")
    ) {
      container = container.parentElement;
      hops++;
    }
    if (!container || container === document.body) {
      container = button.parentElement || document.body;
    }

    var fields = {};

    container.querySelectorAll("[data-field]").forEach(function (el) {
      var key = el.getAttribute("data-field");
      fields[key] = el.type === "checkbox" ? el.checked : el.value;
    });

    container.querySelectorAll(".fg").forEach(function (fg) {
      if (fg.querySelector("[data-field]")) return; // already captured above
      var input = fg.querySelector(".fi, .fsel, .fta");
      if (!input) return;
      var labelEl = fg.querySelector(".fl");
      var label = labelEl ? labelEl.textContent : "";
      var key = slugify(label) || "field_" + Object.keys(fields).length;
      fields[key] = input.type === "checkbox" ? input.checked : input.value;
    });

    return fields;
  }

  function setButtonState(btn, text, bg) {
    btn.textContent = text;
    btn.style.background = bg || "";
  }

  function finish(btn, success) {
    var orig = btn.dataset._origText || btn.textContent;
    setButtonState(btn, success ? "✓ Enquiry Received" : "Something went wrong — try again", success ? "#2E7D4F" : "#B3261E");
    setTimeout(function () {
      setButtonState(btn, orig);
      btn.disabled = false;
    }, 3500);
  }

  function sendToOriginOne(page, handlerName, fields) {
    if (!CONFIG.ORIGINONE_ENABLED) return Promise.resolve();
    return fetch(CONFIG.ORIGINONE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: page,
        handler: handlerName,
        fields: fields,
        elapsed_ms: Date.now() - PAGE_LOAD_TIME,
      }),
    }).then(function (res) {
      if (!res.ok) throw new Error("OriginOne intake failed: " + res.status);
      return res.json();
    });
  }

  function sendToEmailJS(page, fields) {
    if (!CONFIG.EMAILJS_ENABLED) {
      console.warn("[westline-forms] EmailJS not configured yet — enquiry not emailed.", { page: page, fields: fields });
      return Promise.resolve();
    }
    if (typeof emailjs === "undefined") {
      console.error("[westline-forms] EMAILJS_ENABLED is true but the EmailJS SDK isn't loaded on this page.");
      return Promise.resolve();
    }
    var params = Object.assign({ source_page: page }, fields);
    return emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, params, CONFIG.EMAILJS_PUBLIC_KEY);
  }

  function handleSubmit(e, handlerName) {
    e.preventDefault();
    var btn = e.target.closest ? e.target.closest("button") || e.target : e.target;
    if (btn.disabled) return;
    if (!btn.dataset._origText) btn.dataset._origText = btn.textContent;
    btn.disabled = true;
    setButtonState(btn, "Sending...");

    var page = currentPage();
    var fields = collectFields(btn);
    var isBuyerLead = EMAIL_ONLY_PAGES.indexOf(page) === -1;

    var tasks = [sendToEmailJS(page, fields)];
    if (isBuyerLead) tasks.push(sendToOriginOne(page, handlerName, fields));

    Promise.all(tasks)
      .then(function () {
        finish(btn, true);
      })
      .catch(function (err) {
        console.error("[westline-forms] submission failed:", err);
        finish(btn, false);
      });
  }

  window.submitForm = function (e) {
    handleSubmit(e, "submitForm");
  };
  window.submitEnquiry = function (e) {
    handleSubmit(e, "submitEnquiry");
  };
})();
