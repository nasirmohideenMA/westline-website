# Westline Builders Website — Project Handoff

**For:** Continuing this project in Claude Code
**Repo:** `nasirmohideenMA/westline-website` on GitHub
**Live site:** `westline-website.pages.dev` (Cloudflare Pages, auto-deploys from GitHub `main`)
**Domain:** westline.co.in (currently on Wix — migration to this new site not yet cut over; verify DNS before going live)
**Last updated:** 2 September 2026

> **Working across more than one PC? Read §10 first.** Nasir works from three
> machines. GitHub is the only thing that moves work between them — pull before
> you start, push when he says so.

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

**Fixed 2 September 2026** (all verified against the live DOM, not screenshots):

- ~~Shared nav overflows horizontally on mobile~~ — the `.nav-actions` block showed WhatsApp + Call + Callback + hamburger together below 768px, putting the hamburger's right edge at 417-421px against a 390px viewport. Because the nav is `position:fixed` it never expanded `document.scrollWidth`, so there was no scrollbar to reveal it — roughly 90% of the hamburger was simply clipped off-screen and untappable. Callback moved into the mobile menu; the other three are now 44×44px.
- ~~Overview tab overflow on signature/jeppu~~ — the unbroken RERA number would not wrap, forcing the layout viewport to expand (390→413, 360→407). `overflow-wrap:anywhere` on `.spec-v`, mobile-only.
- Mobile tap targets on the 10 project pages raised to a 44px minimum (`.cb-select` was 32px, `.cb-btn` 37px, `.map-cta` 43px).
- Mobile text floor: every font-size under 11px across all 20 pages raised to 11px, size only. Note `signature.html` has 12 of these set via inline `style="font-size:10px"`, which needs `!important` to override.
- ~~Project cards had 300-420px of dead space between the specs row and the footer~~ — `.proj-body-wrap` had no `align-items`, so `.proj-grid` was stretched to the callback rail's height and the surplus was redistributed into the cards. Worst on single-card-row filters. Fixed with `align-items:start`.
- The callback rail never actually pinned on short filters (travel was exactly 0 whenever the grid was shorter than the rail). Given `min-height:100vh` plus a viewport `max-height` cap, matching the pattern already in `callback-rail.js`.

⚠️ **One thing to re-check in a real browser:** that the callback rail visually pins while scrolling. Programmatic scrolling is a no-op in the agent browser pane (`scrollY` stays 0 for `window.scrollTo`, `documentElement.scrollTop` and `body.scrollTop` alike), so only the geometry could be confirmed, not the behaviour. See §6.

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
| `callback-rail.js` | The Request-a-Callback card on all ten project pages — markup, CSS and per-project logic in one file. Single source of truth. |

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
| `signature.html` | ✅ Done | Flagship project. Unit cards with interior renders + floor-plan lightbox (§4), amenity/location tabs, Video Gallery (four films), Construction Status tab with the album cover banner (§4). The 3D coverflow reel and a duplicate construction clip strip were removed 8 Aug 2026 — the coverflow had no footage behind it and rendered as empty black cards, and 7 of the clip strip's 8 links had a corrupted share key |
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

### Unit photo carousel (9 Aug 2026)

Each unit-configuration card's photo (`.fp-photo[data-unit]`) can now hold multiple images that cross-fade, either via arrow clicks or a 3-second autoplay timer that pauses on hover. Driven by one `UNIT_IMAGES` map near the bottom of `signature.html` — unit key → ordered array of `{src, alt}`. A unit with a single image renders exactly as before (no arrows, no dots, no timer); the carousel only activates once an array has 2+ entries.

**86 real interior photos are live for 8 of the 10 units**, pulled from Google Drive (`Westline Website May 2026/Westline Website Finalising/Signature Unit Interiors`), deduped by content hash (several source zips had the same photo saved twice under different names), resized to 1600px/quality 80 with `sharp`, and saved to `images/units/<unit-key>/1.jpg, 2.jpg, ...`.

📌 **Two units still have no new photos — Nasir will send these later:**
- `4bhk-simplex` (3,285 sq ft)
- `4bhk-duplex-t2` (4,140 sq ft)

Both still show their single legacy fallback image (`images/units/4bhk-simplex.jpg`, `images/units/4bhk-duplex-t2.jpg`) with no carousel. Once photos arrive: process the same way as the other 8 (dedupe → resize/compress with sharp → number sequentially) and add the array to `UNIT_IMAGES` in `signature.html`.

📌 **Photo order within each of the 8 carousel units is a best-effort default, not confirmed — Nasir will review and reorder later.** None of the source zips used a `1.jpg`/`2.jpg` naming convention; files were auto-ordered (numbered filenames first, by number; unnumbered filenames after, alphabetically). If he wants a specific lead photo per unit, re-sequence the numbered files in `images/units/<unit-key>/` and update the corresponding array order in `UNIT_IMAGES`.

⚠️ **Zip extraction pitfall, worth knowing if repeating this process:** `unzip -o` silently overwrites files that share an exact filename, which several of these zips did (different photos, same name). Extract each entry individually into a uniquely-prefixed staging name instead, then dedupe by content hash — never by filename.

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
7. 📌 **Build a custom dropdown in JavaScript.** Nasir asked for this explicitly on 8 Aug 2026, to be done later. Every `<select>` on the site now carries `accent-color`, gold `option:checked` (via the `linear-gradient` trick Chrome needs) and row padding — but the open list is painted by the browser, so that is the ceiling for CSS: Chrome and Edge honour the gold highlight, Firefox honours the padding better, Safari largely ignores both. Only a JS listbox gives identical rendering everywhere. Replace the `.cb-select` markup in `callback-rail.js` first (that is the one he was looking at), then the `.fsel` selects on the enquiry forms. Keep the underlying `<select>` in the DOM and drive it from the custom UI, so `westline-forms.js` keeps reading values through `data-field` unchanged.
8. 📌 **Unit interior photos for `4bhk-simplex` and `4bhk-duplex-t2`** — Nasir to send later, see §4's unit-photo-carousel section for how to process and wire them in once they arrive.
9. 📌 **Review/reorder unit carousel photo sequence** — auto-picked order, not confirmed. See §4's unit-photo-carousel section.
10. ~~⚠️ The shared nav overflows horizontally on mobile, on every page.~~ **Fixed 2 September 2026** — see §0. The measurement in the original note (675px at a 390px viewport) was wrong: the real figure was a 417-421px right edge, and because the nav is `position:fixed` the page never scrolled sideways at all, the hamburger was just clipped off-screen. Corrected here so nobody goes looking for a horizontal scrollbar that was never there.
11. 📌 **`site-aug-2026/` is a parallel rebuild, not the live site.** A complete alternative build of the site (3D skyline, 51-floor inventory matrix, NRI / investors / insights pages) committed 2 September 2026. It had been sitting untracked on one PC. Nothing under it is served — the live site is still the repo root — and its own README explains how to promote it if that's ever wanted. Ask Nasir before assuming which of the two is "the site".

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

**The callback rail (`callback-rail.js`, added 8 Aug 2026)** puts a Request-a-Callback card on all ten project pages. A page opts in with two lines — `<div id="callback-rail"></div>` after its hero, and the script tag *before* `westline-forms.js`. Everything else is in the one file, deliberately: before `nav-footer.css` existed, this site's "shared" nav had drifted into three different sets of values across pages.

- **≥1280px** — fixed to the right, hidden until the hero scrolls away. `body.cb-on` adds a 352px right gutter to `.panel` / `.tab-panel` / `.sec` so content never runs underneath (300px card + 28px edge gap).
- **<1280px** — renders inline under the hero, 440px max, not fixed.
- Project is derived from the filename, pre-selected, and drives the unit-type list — but stays editable. Cubix says "I'm Looking to **Lease**"; the four completed projects offer **Resale Enquiry** only.

⚠️ **Do not throttle its scroll handler with `requestAnimationFrame`.** It was written that way first: rAF never fires while a tab is hidden, so the "waiting for a frame" latch stayed shut and the reveal could not be exercised outside a visible window. It uses an 80ms timestamp throttle instead. Same family as the other testing traps in this doc — the agent browser pane does not composite, so **scrolling, rAF and CSS transitions all silently do nothing there.** Verify scroll-triggered behaviour by dispatching a `scroll` event after forcing the trigger condition (e.g. `hero.style.display='none'`), or use a real browser.

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

**Local-only workflow (current, as of 8 Aug 2026):** by Nasir's request, changes are made and committed locally but NOT pushed until he explicitly says he's finished reviewing. Check `git status -sb` for how many commits are ahead of `origin/main` before assuming anything is live.

### Local preview server — do not stop it via the browser preview tool

Nasir reviews work by pointing his **own real Chrome** at `http://localhost:4173`, not by looking at the agent's testing pane. This caused a recurring `ERR_CONNECTION_REFUSED` bug: the agent's own verification tool (`mcp__Claude_Browser__preview_start` / `preview_stop`) was being used to start/stop the *same* port 4173 server for its own checks, and every `preview_stop` killed Nasir's connection too.

**Fixed 9 Aug 2026** by running the server as a standalone background process via the Bash tool (`run_in_background: true`), fully decoupled from the browser-preview tool:
```
npx --yes serve --listen 4173 westline-website
```
Rules for future sessions:
- Start it once per session this way, then leave it running — never call `preview_stop` on it.
- For the agent's own visual checks, point `mcp__Claude_Browser__preview_start` at the URL (`http://localhost:4173/...`) rather than launching the `westline-static` launch.json config, so there's only ever one server process and it isn't tied to the testing tool's lifecycle.
- If the port really does go down (e.g. the whole session restarted), restart it the same way — as a detached background Bash process, not via `preview_start`.

---

## 10. Working Across Three PCs (added 2 September 2026)

Nasir works from **three machines**. GitHub is the *only* thing that carries
work between them. Nothing else is shared — see the "what does not travel"
list below before assuming context exists on the machine you're on.

### The rule

**Pull before you start. Push when Nasir says so.**

```bash
git pull            # first thing, every session, on every machine
git status -sb      # confirms how far ahead/behind origin/main you are
```

If `git status -sb` says `behind`, you are looking at stale files — pull before
reading anything, or you will "fix" problems that were already fixed elsewhere.

### ⚠️ Do not put this repo inside OneDrive

The repo used to live at `C:\Users\<name>\OneDrive\Documents\GitHub\westline-website`,
which meant OneDrive was syncing the `.git` folder (15MB, thousands of small
files) at the same time git was writing to it. With one machine that is merely
untidy. With three it reliably corrupts the repo: `index.lock` files sync
between machines and block git, `.git/index` gets copied mid-write giving
"index file corrupt", and OneDrive drops conflict-copies *inside* `.git` with
names like `HEAD (nasir's conflicted copy).txt`.

**One sync system per folder.** For this repo that system is git. Keep the
working copy somewhere OneDrive does not touch, e.g. `C:\dev\westline-website`
or a Documents folder outside the OneDrive root.

### What does *not* travel between machines

| Thing | Travels? | Notes |
|---|---|---|
| Everything committed and pushed | ✅ | Including `CLAUDE.md`, `.claude/launch.json`, `.claude/skills/local-preview/` — deliberately tracked so a fresh clone is configured |
| Uncommitted / untracked files | ❌ | This is exactly how `site-aug-2026/` ended up stranded on one PC for a week |
| Claude Code's memory files | ❌ | They live in the user profile (`~/.claude/projects/.../memory/`), not the repo. **This file and `CLAUDE.md` are the cross-machine memory** — if something matters on the next machine, write it here |
| Local server / node install | ❌ | Per-machine, see below |

### Per-machine setup

1. Git + GitHub Desktop, signed in to the account with **write access to `nasirmohideenMA/westline-website`**.
2. Clone the repo to a path outside OneDrive.
3. Node.js, for the local preview server.

⚠️ **Two gotchas seen on the current machine:**

- **Push permission.** A `git push` from the CLI failed with `Permission to
  nasirmohideenMA/westline-website.git denied to nasirm-lab` — git was
  authenticated as a different GitHub account than the one owning the repo.
  Pushing via GitHub Desktop worked. If the CLI can't push on a machine, that's
  why: check which account git is signed in as before debugging anything else.
- **Node not on PATH.** `npx` was not resolvable from Git Bash even though Node
  was installed at `C:\Program Files\nodejs`. If `npx: command not found`, call
  it by full path: `"/c/Program Files/nodejs/npx.cmd" --yes serve --listen 4173 .`
