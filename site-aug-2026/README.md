# Westline — Aug 2026 rebuild

Static site. No build step, no server, no dependencies to install.
Open `index.html` in a browser and it runs, including from `file://`.

## Deploy

Copy this whole folder into the repo as-is. Nothing here touches the live site
at the repo root — every page lives under `site-aug-2026/`.

To promote it later, move the contents up one level. The internal links are all
relative and already use the root-level filenames (`signature.html`,
`projects.html`, …), so they resolve either way.

## Pages

| File | What it is |
|---|---|
| `index.html` | Homepage — hero video, flagship band, portfolio, EMI, brochure, site visit |
| `signature.html` | Westline Signature — scroll-driven 3D tower, view-from-floor, units, availability |
| `projects.html` | Portfolio — interactive 3D skyline of nine buildings at true relative height |
| `project.html?p=<key>` | The nine non-Signature projects. Keys: `cubix`, `vantage`, `salubrity`, `fairmont`, `ohana`, `jeppu`, `skydale`, `splendid`, `bonita` |
| `tools.html` | EMI + amortisation, Karnataka stamp duty, borrowing capacity, rent vs buy |
| `nri.html` | Call-window overlap by city, currency converter, FEMA/POA route |
| `investors.html` | Yield and exit modelling, sensitivity table, 3D skyline at night |
| `landowners.html` | Joint-development model and process |
| `insights.html` | Diligence checklist and three long-form explainers |
| `contact.html` | Addresses, directions, routed enquiry form |

## Shared files — do not rename

| File | Why |
|---|---|
| `SiteNav.dc.html` | Shared nav. Every page pulls it in by this exact filename |
| `SiteFooter.dc.html` | Shared footer with the RERA disclosure block |
| `support.js` | Runtime every page loads. Must sit beside the pages |
| `skyline3d.js` | The `<wl-skyline>` 3D component used by projects and investors |
| `site-config.js` | **The one file to edit.** Facts, endpoints, prices, TODO placeholders |
| `data/inventory.json` | Availability matrix, 51 floors × 6 units |

## What is still a placeholder

Anything unpublished reads as a named TODO rather than an invented number:
prices, four unit sizes, the 36+ amenity list, 360 tour URLs, view photography,
floor-plan artwork, photography for the nine other projects, flooring and
kitchen specs, sales office hours, and the Kannada strings.

Two figures on the calculators are assumptions stated on the page itself:
floor-to-floor height 3.0 m, and the Karnataka duty structure (2% / 3% / 5%
slabs, cess 10% of duty, surcharge 2% urban and 3% rural, registration fee 2%
of value after the 31 August 2025 revision). Both are labelled indicative.

## Known conflicts, not silently resolved

- Floor count: the brief says 55 floors (3B+G+51); the root-level pages say 53.
  This build uses 55 (3B+G+51) throughout.
- 3 BHK area: 2,070 sq ft here, matching the floor-plan artwork.
  westline.co.in says 2,180.
- Penthouse: 7,920 sq ft here. westline.co.in says 8,350.
- 4 BHK Duplex Type 3 (4,360 sq ft) keeps the root-level naming.
  westline.co.in calls it Type 2.

## Third-party

Three.js 0.160.0 from unpkg, on `signature.html`, `projects.html` and
`investors.html` only. Google Fonts: Cormorant Garamond and Jost.
Lead intake posts to the existing OriginOne endpoint set in `site-config.js`.
