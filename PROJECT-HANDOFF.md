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
| 1 | Gallery images + team photos not uploaded | Needs assets |
| 2 | Resume upload on careers.html still not sent (§5) | Needs a decision |
| 3 | Content removed for lack of data — testimonials, case studies, distances, 3 FAQ answers (§4) | Needs Nasir when convenient |
| 4 | Analytics, OTP (§8) | Deferred by choice |

~~Agent/landowner/careers/media forms discard their data~~ — **fixed 3 Aug 2026, see §5.**
~~~60 placeholders across 15 pages~~ — **cleared 3 Aug 2026. Every one of the 19 linked pages is now free of visible `[placeholder]` text.** See §4 for what was filled in versus removed.

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

## 4. Content — Filled In, Removed, Or Still Open

**Cleared 3 Aug 2026.** Nasir filled in `Westline-Website-Fill-These-In.xlsx` (kept in this repo) and it was applied the same day. No linked page shows a visible placeholder any more.

To re-audit, search for bracketed text **without a length cap** — see the warning at the end of the removals table:

```bash
grep -oE "\[[^]<>]{1,400}\]" *.html | grep -viE "navHtml|\[[0-9]+\]|type=|style\*|data-role"
```

### Filled in

RERA rows on 8 project pages · 4 department emails (`properties@westlinebuilders.com` for general, leasing and partner; `nasirm@westlinebuilders.com` for landowner) · commission ladder 2 / 2.5 / 3 / 4% at 2, 5 and 8+ closures · unit types, plus Vantage's size range · years occupied on the four completed projects · Signature at 53 floors · services minimum size and interiors timeline · contact hours · the home-loan FAQ answer · a newly written NRI FAQ answer.

**Only Jeppu supplied a real new RERA number** (`PRM/KA/RERA/1257/334/PR/200211/003258`). The rest are statuses rather than numbers: Cubix "Not applicable — lease only"; Vantage, Salubrity and Ohana "Registration in progress"; Skydale, Splendid and Bonita "Completed project — not applicable". Signature's remains `PRM/KA/RERA/1257/334/PR/171021/000845`.

### Removed for lack of data — restore when Nasir has it

Every removal left an HTML comment saying what to put back.

| What | Where | Why |
|---|---|---|
| Bank interest-rate table | `tools.html` | Nasir: don't publish rates. The section became an **approved-lender list** (6 banks) rather than disappearing, so the tab link and the `#sec-rates` anchor still work |
| 4 resident testimonials | skydale, splendid, bonita, jeppu | Quote *and* name were both placeholder. Only the `.testi-box` went; the delivery-proof section around it stays |
| 2 landowner case studies | `landowners.html` | Every field including the narrative was placeholder. The whole `.case-sec` section was removed; its CSS is still in the file |
| Nearby-landmark distances | 9 project pages | Named landmarks stayed and lost their distance chip. Cards blank on *both* name and distance were removed outright (13 of them). Skydale/Splendid/Bonita lost the list entirely but keep their map and address |
| Per-sq-ft prices | `services.html` | Nasir: "do not mention" → now "On Request" |
| 3 FAQ answers | `tools.html` | Booking amount, what the base price includes, maintenance charges |

⚠️ **The first two of those FAQ answers never reached the workbook.** The scan that generated it capped placeholders at 90 characters and both were longer, so Nasir was never asked about them. Six testimonial and case-study placeholders were missed the same way. When auditing for placeholders, don't cap the length.

### Fairmont and Ohana — resolved, but worth understanding

Nasir initially marked **both** "Not for Sale" in the workbook, while both pages sell ownership throughout — Fairmont is headlined "Own It. Let Us Run It." and quotes "Price on Request"; Ohana says "Own A Piece Of The Hills". The two could not both be true, so Fairmont was temporarily unlinked rather than publish a possibly-false claim on a public property advert.

He then confirmed both projects **do invite investors**. Both therefore carry **"Registration in progress"**, the same wording he chose for Vantage and Salubrity, and Fairmont was relinked (nav desktop + mobile, footer, homepage project grid, both homepage form dropdowns). Its unit-type entry in the homepage dropdown map was also corrected from Studio/1/2 BHK to 1/2/3 BHK, to match what the project page now states.

⚠️ **This is the site's main remaining legal exposure and it is not a code problem.** Four projects — Vantage, Salubrity, Ohana, Fairmont — publicly solicit buyers or investors while stating that RERA registration is still in progress. RERA restricts advertising, marketing or taking bookings for an unregistered project. Nasir has been told this twice and has decided to proceed; that is his call to make, but **do not quietly "tidy" these lines, and do not let anyone assume the wording was chosen casually.** If registration numbers arrive, they replace the status text on those four pages.

### Unit configurations on signature.html (rebuilt 8 Aug 2026)

The grid now leads with an interior render per unit, the size set large, and the figures buyers ask for — floors available, bedrooms, bathrooms — with the floor plan behind a **View Floor Plan** click. The lightbox, including the duplex lower/upper pairs, is unchanged.

**Where the renders came from.** The nine unit pages on `westline.co.in/properties/…` (the 9-item `properties` collection — *not* `properties-3`, which is 45 individual flats). Each page carries its own set of renders, server-rendered into the HTML, so they can be scraped without a browser. ⚠️ **The first image in markup order is the floor plan, not a render** — picking by position ships ten cropped floor plans. Each one was opened and checked before use. `4 BHK Duplex Type 2` (4,140 sq ft) has no page of its own and takes a second render from the other 4 BHK duplex.

**Why the images are in `images/units/`, not Cloudinary.** Cloudinary's console is not reachable from the agent browser (blocked by policy) and fetch delivery returns **401** on this account, so the only route left was handling an API secret — not something to do on someone's behalf. Serving from the repo also drops the dependency on Wix, which is being retired. Ten JPEGs, ~1.3 MB total, lazy-loaded. Moving them to Cloudinary later is a find-and-replace on ten `src` attributes.

⚠️ **Two figures disagree with westline.co.in and were left as-is rather than changed on a guess:**

| This site says | westline.co.in says |
|---|---|
| 3 BHK — **2,070** sq ft (matches the floor plan artwork) | 3 BHK — **2,180** sq ft |
| **Sky Villa Penthouse** — 7,920 sq ft | **5 BHK Penthouse** — 8,350 sq ft |

Everything else — every other size, and all ten floors/bed/bath figures — already agreed between the two sites. `westline.co.in` also lists the 4,360 unit as "Type 2" where this site calls it "Type 3", and gives the 4 BHK Duplex + Media T1 floors as "G to 44th", which looks like a data-entry slip against its siblings' "30–45".

### Construction progress gallery → album cover card (8 Aug 2026)

The Progress Gallery on the Construction Status tab was four grey placeholder tiles plus a line naming files that were never uploaded (`sig-progress-1.jpg` … `sig-progress-8.jpg`). It is now a single **album cover card** linking to the shared Google Photos album that was already kept current — the same album the Gallery section further down has always pointed to (`https://photos.app.goo.gl/5eUcXku62UuLpbt77`, which resolves to the `Signature Construction Updates` share).

Three real site photographs cross-fade as the cover, saved to `images/progress/` (~340 KB for all three at 1600px, lazy-loaded). Title and the January 2018 – January 2026 range are read off the album's own metadata. **The mockup showed a photo count; that figure is not exposed anywhere verifiable, so it was left out rather than guessed.**

**It is a full-bleed banner, not a small card.** The first attempt capped it at 760px and it looked stranded under the full-width RERA box above it. It now spans the same width as that box at every breakpoint (verified: 1305px at a 1440 viewport, 350px at 390). Two layouts:

- **Above 760px** — photograph fills the card, text overlaid bottom-left over a left-to-right + bottom-up gradient scrim. The scrim is doing real work: the three frames run from a bright midday aerial to a near-black dusk shot, so the text cannot rely on the photograph for contrast.
- **760px and below** — stacks. Photograph on top at 16:10, text in a solid `--ink` panel beneath, scrim off. Position dots move to the top-right corner of the image.

Card height is `clamp(260px, 27vw, 380px)` so it stays cinematic on wide screens without becoming a wall on small ones.

The rotation script sits at the bottom of `signature.html`. It respects `prefers-reduced-motion`, only runs while the card is on screen (IntersectionObserver), and stops on `visibilitychange`. The first `<img>` carries `.is-on` in the markup so the card still shows a photograph with JS disabled.

⚠️ **Testing note:** in the agent browser pane `document.hidden` is `true`, so the rotation correctly refuses to start and CSS transitions do not run — computed `opacity` reads frozen. Verify the class cycling (`is-on` moving 100 → 010 → 001) rather than computed styles, or check in a real browser.

### Still open

1. **RERA registration numbers** for Vantage, Salubrity, Ohana and Fairmont — they replace the "Registration in progress" status text on those four pages
2. **Gallery images** — filenames already named in HTML comments, just need Cloudinary upload
3. **Signature construction photos**, and the floor count needs updating as the build progresses (currently "53 floors built")
4. **Ohana unit types** — the homepage dropdown estimate was never verified against real inventory. Fairmont's was corrected to 1/2/3 BHK on 3 Aug 2026
5. The removed content in the table above, whenever Nasir has it
6. **Two FAQ answers Nasir was never asked for** — typical booking amount, and what the base price includes
7. ⚠️ **The shared nav overflows horizontally on mobile, on every page.** At a 390px viewport `<nav id="nav">` renders 675px wide, so the whole page scrolls sideways. The desktop `.nav-actions` block (WhatsApp / Call buttons) stays visible at mobile widths instead of giving way to the mobile menu. Pre-existing — found while rebuilding the unit cards, not caused by it. Fix belongs in `nav-footer.css`; verify `document.body.scrollWidth <= documentElement.clientWidth` at 390/520/768px afterwards

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

**Every form now reaches a destination (fixed 3 Aug 2026).** The *receiver* decides where a submission belongs, so every page posts to the same endpoint:

- **Buyer enquiries** (homepage callback, project pages, contact.html) → `crm_leads`, as before
- **agents / landowners / services / careers** → a new `website_enquiries` table, visible in OriginOne under **Sales & CRM → Website Enquiries** (`/website-enquiries`), filterable by type and status, with every raw submitted field shown

One inbox rather than four destinations: routing these into Channel Partners, Land Opportunities and a new recruitment module meant three modules to maintain for a handful of submissions a month. A landowner worth pursuing gets copied into `land_opportunities` by hand.

⚠️ **`currentPage()` must send the filename with its `.html` extension.** Cloudflare Pages serves clean URLs and 308-redirects `/agents.html` → `/agents`, so `location.pathname` has no extension. The receiver keys *two* lookups on the filename — which form type this is, and which project the enquiry is about — so before this was fixed, both missed on every real submission. That is why every website lead created before 3 Aug 2026 has `primary_project_id` null. The edge function now normalises the incoming value too, so an old cached script can't reintroduce it. This class of bug is invisible in curl testing, because a handwritten payload sends the name the code expects rather than the one the site sends — **test forms through a browser.**

⚠️ **`careers.html` still does not send the resume**, only its filename. The form insists on an attachment, so the success panel asks the applicant to email it to `officeadmin@westlinebuilders.com`, and the payload records `resume_attached: "No — ..."` so HR isn't left wondering. Sending the file properly needs an upload step (Cloudinary, or a Supabase Storage bucket via the intake function) — still a decision, see §8.

**Known limitation — the receiver picks the wrong company.** `website-lead-intake` resolves the company by taking the oldest row in `company_groups`. Correct today (only Westline exists) but wrong the moment OriginOne has a second customer. It also hardcodes Westline project names for page→project matching. Tracked on the OriginOne side.

**`careers.html` keeps its own submit handler** — it validates its own required fields and swaps the whole card for a success panel rather than changing button text. It borrows only the transport, via `window.westlineSubmitFields(fields, handlerName)` exported from `westline-forms.js`, so the endpoint URL stays in one place.

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

- ~~**Agent / landowner / careers / media enquiries have no destination.**~~ **Done 3 Aug 2026** — they land in the Website Enquiries inbox, see §5.
- **Resume upload on careers.html.** The application text is captured but the file is not; the applicant is asked to email it. Doing this properly means either an unsigned Cloudinary upload preset (simplest, but an open upload endpoint invites abuse) or posting the file to the intake function for it to store in a private Supabase bucket (safer, needs a bucket + policy + a size guard). Needs a decision before it's worth building.
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
