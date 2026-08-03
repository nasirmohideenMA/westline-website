# Westline Builders Website — Project Handoff

**For:** Continuing this project in Claude Code
**Repo:** `nasirmohideenMA/westline-website` on GitHub
**Live site:** `westline-website.pages.dev` (Cloudflare Pages, auto-deploys from GitHub `main`)
**Domain:** westline.co.in (currently on Wix — migration to this new site not yet cut over; verify DNS before going live)
**Last updated:** 3 August 2026

---

## 0. Read This First — Current State

The site is **built and functional**. All 21 pages are live, the shared nav/footer system works, and forms create real CRM leads. What remains is mostly **content, not code**.

**Start here if you're picking this up cold:**

| Priority | What | Type |
|---|---|---|
| 1 | ~60 placeholders across 15 pages — RERA numbers, emails, bank rates, distances | **Needs Nasir to supply data** |
| 2 | Agent/landowner/careers/media forms discard their data (§5, §8) | Code + a decision |
| 3 | Gallery images + team photos not uploaded | Needs assets |
| 4 | Analytics, OTP, resume upload (§8) | Deferred by choice |

**Nothing is broken.** No known bugs are outstanding. If a session has nothing else to go on, working through §4's placeholder list is the useful default — but most of it is blocked on Nasir, so **ask what data he has before planning work**.

⚠️ **Sections below marked with a strikethrough or a ⚠️ were wrong in earlier versions of this doc and have been corrected against the actual repo.** Trust the code over any claim here; verify before relying on a statement.

---

## 1. Company Facts

- **Westline Builders Private Limited** — real estate developer, Mangalore, Karnataka
- **MD:** Nasir Mohideen
- **Registered address:** Westline Signature, 15-14-T-813/3, Panvel Kochi Kanyakumari Highway, Nanthoor, Mangaluru, Dakshina Kannada, Karnataka 575002
- **Phone:** +91 99000 33888
- **Email:** officeadmin@westlinebuilders.com
- **K-RERA registered developer**, 12+ years, 10 projects

---

## 2. Architecture — Read This First

The site uses a **shared-file pattern** to avoid duplicating nav/footer across 20 pages:

| File | Purpose |
|---|---|
| `nav.html` | The entire `<nav>` + mobile menu markup. Single source of truth. |
| `footer.html` | The entire `<footer>` markup. Single source of truth. |
| `nav-footer.css` | **All** CSS for nav + footer + mobile menu + dropdowns. Single source of truth. |
| `westline-forms.js` | Shared form submission handler (see §5). |

**How it works:** every page has `<div id="nav-placeholder"></div>` and `<div id="footer-placeholder"></div>` in its body, plus a small inline script that does:

```js
Promise.all([
  fetch('nav.html').then(r => r.text()),
  fetch('footer.html').then(r => r.text())
]).then(([navHtml, footerHtml]) => {
  document.getElementById('nav-placeholder').innerHTML = navHtml;
  document.getElementById('footer-placeholder').innerHTML = footerHtml;
});
```

**⚠️ Critical constraint:** `fetch()` requires the site to be served over `http`/`https`. It will **not** work opening an HTML file directly via `file://` in a browser — nav/footer will just be blank. Always test through a local server or the live Cloudflare deployment.

**Required CSS variables:** every page's own `:root` block must define these (nav-footer.css assumes they exist):
```
--gold, --gold-dim, --nav-bg, --nav-h, --nav-shadow,
--surface, --surface2, --surface3, --text, --text2, --border, --border2
```
Two naming schemes exist across older vs newer pages (e.g. `index.html` has legacy `--gold-l`/`--gold-d` names, aliased to `--gold-dim` for compatibility). If you add a new page, copy the `:root` block from an existing page rather than writing one from scratch — this exact class of bug (a CSS variable used but never defined, causing silently invisible text) has bitten this project **twice already**.

---

## 3. Every Page, What It Does

| File | Status | Notes |
|---|---|---|
| `index.html` | ✅ Done | Homepage. Hero video carousel (4 slides), project grid with filters, "Request a Callback" form (sticky sidebar, project→unit-type dependent dropdown) |
| `signature.html` | ✅ Done, ⚠️ needs photos | Flagship project. Floor plans w/ lightbox+zoom, amenity/location tabs, 3D coverflow video reels, Construction Status tab (needs real photos + current floor) |
| `cubix.html` | ✅ Done, ⚠️ needs RERA# | Lease-only commercial. No floor plans/pricing (by design — leasing enquiry model) |
| `vantage.html` | ✅ Done, ⚠️ needs RERA# | For-sale commercial, ROI calculator, tenant-fit panel |
| `salubrity.html` | ✅ Done, ⚠️ needs RERA# | For-sale commercial/polyclinics, ROI calculator |
| `jeppu.html` | ✅ Done | Completed, sold out — "delivery proof" template |
| `fairmont.html` | ✅ Done, ⚠️ needs RERA# | Serviced apartments, investment framing |
| `ohana.html` | ✅ Done, ⚠️ needs RERA# | Resort investment, occupancy-based yield calculator |
| `skydale.html` | ✅ Done | Completed residential — delivery proof template |
| `splendid.html` | ✅ Done | Completed residential — delivery proof template |
| `bonita.html` | ✅ Done | Completed residential — delivery proof template |
| `services.html` | ✅ Done | Construction + interiors, for external clients |
| `tools.html` | ✅ Done, ⚠️ needs bank rates | EMI calc, stamp duty calc, rent-vs-buy, area converter, loan rates table (placeholder rates) |
| `agents.html` | ✅ Done, ⚠️ needs commission % | Westline Circle partner programme, 4-tier ladder |
| `landowners.html` | ✅ Done, ⚠️ needs case studies | JV/sale/development agreement, confidentiality-focused |
| `contact.html` | ✅ Done, ⚠️ needs email | Department routing + general enquiry form + site visit CTA |
| `terms.html` | ✅ Done | Includes no-binding-offer clause, arbitration (Westline-appointed sole arbitrator, seat Mangaluru), Grievance Officer |
| `privacy.html` | ✅ Done | DPDP Act 2023 aligned, narrow third-party sharing, landowner confidentiality carve-out |
| `careers.html` | ✅ Done | **Pre-existing page, not built by me** — rebuilt to use shared nav/footer, dark/light theme toggle removed (site is light-only). Has resume upload — see §5 for a real limitation there. |
| `team.html` | ✅ Done | MD profile + 4 senior staff. §8 used to say this didn't exist — wrong, it was already built but unlinked. Retrofitted to shared nav/footer and linked into the nav (desktop + mobile) on 3 Aug 2026. Photos are still initials placeholders (NM/YR/FA/LQ/SS) |

---

## 4. Placeholders Still Needing Real Data

**This is now the bulk of the remaining work, and almost none of it is code — it's Nasir supplying facts.** Tracked in `Westline_Website_Data.xlsx` (9 tabs, fill yellow cells).

Actual counts in the HTML as of 3 Aug 2026, by page:

| Page | Placeholders | What's missing |
|---|---|---|
| `tools.html` | 24 | Bank loan rates — 10 banks × rate/tenure. Needs monthly refresh once live |
| `landowners.html` | 6 | 2 case studies, plus the landowner enquiry email |
| `cubix.html` | 6 | RERA number, unit sizes, location distances |
| `splendid.html` / `skydale.html` / `bonita.html` | 5 each | Completed-project details — resident names for testimonials, nearby landmarks |
| `vantage.html` | 3 | RERA number, retail/office sizes |
| `services.html`, `salubrity.html`, `ohana.html`, `jeppu.html`, `fairmont.html` | 2 each | Mostly RERA numbers and distances |
| `signature.html` | 1 | Construction stage (e.g. "Floor 24 of 55") — needs updating as the build progresses |
| `contact.html` | 1 | General enquiry email address |
| `agents.html` | 1 | Commission % across the 4 tiers |

Priority order:

1. **RERA numbers** — 7 pages still say `[RERA number to be added]`. Legally the most important. Signature's is real: `PRM/KA/RERA/1257/334/PR/171021/000845`
2. **Department email addresses** — 4 still placeholder: general enquiry, leasing, partner, landowner
3. **Bank loan rates** — 24 placeholders in `tools.html`; the calculator works, the rate table is empty
4. **Location distances** — `[X.XX]` km and nearby school/hospital/landmark names
5. **Agent commission %** — all 4 tiers
6. **2 landowner case studies**
7. **Gallery images** — filenames already named in HTML comments, just need Cloudinary upload
8. **Signature construction photos** + current floor
9. **Fairmont/Ohana unit types** — estimates used in the homepage dropdown, never verified against real inventory

---

## 5. Form Backend — LIVE (as of 3 Aug 2026)

`westline-forms.js` powers every form site-wide and **is working in production**. Buyer enquiries create real leads in the OriginOne CRM.

> ⚠️ This file did not exist when the doc above was first written — every page referenced it but it 404'd, and each page's own `submitForm()` was a pure animation that discarded the data. It was built from scratch on 3 Aug 2026.

```js
ORIGINONE_ENABLED: true,    // live — verified creating leads (LD-2608-0001, LD-2608-0002)
ORIGINONE_URL: "https://tercgsdwswtnyrrrjeab.supabase.co/functions/v1/website-lead-intake",
EMAILJS_ENABLED: false,     // deliberately NOT used — see below
```

**EmailJS was evaluated and rejected.** It needs a separate account per company, has a 200 email/month free cap, and is another thing to maintain. OriginOne already sends email via Resend, so notifications belong there instead. Don't reintroduce EmailJS without a specific reason — the config keys are left in place only so a future page could opt in.

**How submissions travel:** the script reads each input's `data-field` attribute, posts `{page, handler, fields, elapsed_ms}` to the Edge Function, which maps fields onto `crm_leads`. A submission faster than 2 seconds is treated as a bot and silently dropped.

**Scope decision:** only genuine *buyer* enquiries become CRM leads (homepage callback, project pages, contact.html general enquiry). Agent, landowner, careers and media enquiries are not buyer leads and currently have **no destination** — they still show a success message to the visitor but the data goes nowhere. This is the biggest outstanding gap on the website side.

**Known limitation — the receiver picks the wrong company.** `website-lead-intake` resolves the company by taking the oldest row in `company_groups`. Correct today (only Westline exists) but wrong the moment OriginOne has a second customer. It also hardcodes Westline project names for page→project matching. Tracked on the OriginOne side.

**Special case — `careers.html` resume upload:** file attachments don't go through the generic pipeline. The resume needs uploading to Cloudinary first, then only its URL travels with the rest of the fields. Not built.

---

## 6. Known Bugs Fixed (context for future work)

- **Cloudinary URLs:** no version numbers, no folder prefixes unless the file is genuinely in a subfolder. Format: `https://res.cloudinary.com/dbw8ugwim/image/upload/f_auto,q_auto/[filename]`
- **CSS variable typos silently break rendering** — an undefined `var(--x)` doesn't error, it just falls through to inherited color, which on a dark background often means invisible text. Happened with `--gold-dim`, then again with `--nav-shadow`/`--nav-h`. Always verify new variables are defined in `:root` before using them.
- **CSS duplication caused value drift** — before consolidating into `nav-footer.css`, the same "shared" nav had 3 different `font-size`/`gap`/`letter-spacing` combinations across different pages because each page had its own copy. Now centralized — don't reintroduce per-page nav/footer CSS.
- **`position:sticky` needs the parent to stretch**, not `align-items:start` — used for the homepage callback form's sticky-sidebar behavior.
- **GitHub Pages vs Cloudflare Pages** — this repo has *both* connected. **Cloudflare Pages (`westline-website.pages.dev`) is the real, working deployment.** GitHub Pages is a leftover/unused second target — safe to ignore or disable in repo Settings.

---

## 7. Repo Cleanup — DONE

All removed in commit `454c5e4`: `admin/` (Decap CMS), `netlify.toml`, `neighbourhood-preview.html`, `_data/`, `project-style.css`. The working tree is clean; every file now present is in use.

---

## 8. Explicitly Deferred / Not Yet Built

- **Agent / landowner / careers / media enquiries have no destination.** Their forms show success but discard the data — see §5. **This is the highest-value outstanding item on the website.** Options: a second Edge Function writing to a general enquiries table, or notification-only. Needs a decision on where non-buyer enquiries should land.
- **Cookie consent + analytics** — recommended starting with cookieless analytics (Plausible/Fathom, no consent banner legally required) rather than Google Analytics. Full cookie consent + GTM should wait until paid ad campaigns launch (Nasir does run paid campaigns, so this will be needed eventually).
- **OTP verification** on the callback form — deliberately removed for now. ⚠️ The doc previously said "Nasir has WAPI, check if it supports SMS OTP" — **WATI has since been confirmed CANCELLED for about a year**, so that route is closed. Any OTP work needs a new provider decision first.
- **`team.html`** — ~~doesn't exist~~ **it does; built and linked 3 Aug 2026.** See §3. Only the photos are outstanding.
- **Resume upload on careers.html** — see §5.

---

## 9. Deployment Flow

1. Edit files locally (or in Claude Code directly against the cloned repo)
2. Commit + push to `main` on GitHub (`nasirmohideenMA/westline-website`)
3. Cloudflare Pages auto-detects the push and redeploys — usually live in 1–2 minutes
4. Verify at `westline-website.pages.dev`

Nasir uses **GitHub Desktop** for git operations, not the command line — worth keeping instructions GUI-friendly if walking him through anything git-related directly, though this won't be necessary once Claude Code is working directly in the repo.
