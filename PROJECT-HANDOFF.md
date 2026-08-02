# Westline Builders Website — Project Handoff

**For:** Continuing this project in Claude Code
**Repo:** `nasirmohideenMA/westline-website` on GitHub
**Live site:** `westline-website.pages.dev` (Cloudflare Pages, auto-deploys from GitHub `main`)
**Domain:** westline.co.in (currently on Wix — migration to this new site not yet cut over; verify DNS before going live)

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

---

## 4. Placeholders Still Needing Real Data

All tracked in **`Westline_Website_Data.xlsx`** (9 tabs — fill yellow cells). Priority order:

1. **RERA numbers** — Vantage, Salubrity, Cubix, Fairmont, Ohana (Signature's is already real: `PRM/KA/RERA/1257/334/PR/171021/000845`)
2. **Location tab distances** — most project pages have `[X] km` placeholders
3. **Gallery images** — filenames already specified in each page's HTML comments, just need Cloudinary upload
4. **Agent commission %** — `agents.html` has `[X]%` placeholders in all 4 tiers
5. **2 landowner case studies** — `landowners.html`
6. **Bank loan rates** — `tools.html`, 10 banks, update monthly
7. **Signature construction photos** + current floor/stage — `signature.html` Construction Status tab
8. **`contact.html`** — general enquiry email still placeholder
9. **Fairmont/Ohana unit types** — reasonable estimates used in the homepage callback form's dropdown, not verified against real inventory

---

## 5. Form Backend — Not Yet Live

`westline-forms.js` powers every form site-wide (overrides each page's fake "success" animation). Two integrations, both currently **disabled**:

```js
EMAIL_ENABLED: false,       // needs: EmailJS Service ID, Template ID, Public Key (~10 min setup at emailjs.com)
ORIGINONE_ENABLED: false,   // needs: OriginOne webhook URL + auth method + expected field names — ask Nasir
```

Until both are flipped to `true`, forms show the user a normal success message, but data goes nowhere except the browser console (logged with a warning).

**Special case — `careers.html` resume upload:** EmailJS's API doesn't handle file attachments. When wiring this up, the resume will need to upload to Cloudinary (or similar) first, then just its URL gets included in the notification — don't try to force it through the generic `submitForm()` pipeline as-is.

---

## 6. Known Bugs Fixed (context for future work)

- **Cloudinary URLs:** no version numbers, no folder prefixes unless the file is genuinely in a subfolder. Format: `https://res.cloudinary.com/dbw8ugwim/image/upload/f_auto,q_auto/[filename]`
- **CSS variable typos silently break rendering** — an undefined `var(--x)` doesn't error, it just falls through to inherited color, which on a dark background often means invisible text. Happened with `--gold-dim`, then again with `--nav-shadow`/`--nav-h`. Always verify new variables are defined in `:root` before using them.
- **CSS duplication caused value drift** — before consolidating into `nav-footer.css`, the same "shared" nav had 3 different `font-size`/`gap`/`letter-spacing` combinations across different pages because each page had its own copy. Now centralized — don't reintroduce per-page nav/footer CSS.
- **`position:sticky` needs the parent to stretch**, not `align-items:start` — used for the homepage callback form's sticky-sidebar behavior.
- **GitHub Pages vs Cloudflare Pages** — this repo has *both* connected. **Cloudflare Pages (`westline-website.pages.dev`) is the real, working deployment.** GitHub Pages is a leftover/unused second target — safe to ignore or disable in repo Settings.

---

## 7. Repo Cleanup — In Progress

Confirmed **safe to delete** (old Netlify/Decap CMS leftovers, predate this project):
- `admin/` folder (`config.yml`, `index.html`)
- `netlify.toml`
- `neighbourhood-preview.html`

**Check before deleting:**
- `_data/` folder — likely old CMS content storage
- `project-style.css` — old standalone stylesheet; confirm nothing still references it

**Kept:** `careers.html` — genuinely good pre-existing page, now integrated into the shared design system (see §3).

---

## 8. Explicitly Deferred / Not Yet Built

- **Cookie consent + analytics** — recommended starting with cookieless analytics (Plausible/Fathom, no consent banner legally required) rather than Google Analytics. Full cookie consent infrastructure + Google Tag Manager should wait until paid ad campaigns actually launch (Nasir confirmed he does run paid campaigns, so this will be needed eventually — just not yet).
- **OTP verification** on the callback form — deliberately removed for now. Nasir has WAPI; check if it supports SMS OTP, otherwise Twilio is the fallback. Flagged as a real future requirement, not abandoned.
- **`team.html`** — referenced nowhere currently; doesn't exist. Ask if it's wanted before building.

---

## 9. Deployment Flow

1. Edit files locally (or in Claude Code directly against the cloned repo)
2. Commit + push to `main` on GitHub (`nasirmohideenMA/westline-website`)
3. Cloudflare Pages auto-detects the push and redeploys — usually live in 1–2 minutes
4. Verify at `westline-website.pages.dev`

Nasir uses **GitHub Desktop** for git operations, not the command line — worth keeping instructions GUI-friendly if walking him through anything git-related directly, though this won't be necessary once Claude Code is working directly in the repo.
