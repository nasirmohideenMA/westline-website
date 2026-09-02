/* Westline Builders — Website Aug 2026
   Single editable config. Everything factual that can change lives here.
   Anything marked TODO is a deliberate placeholder: nothing on the site invents a fact. */

window.WESTLINE_CONFIG = {
  company: {
    name: "Westline Builders Private Limited",
    established: 2014,
    phone: "+91 99000 33888",
    whatsapp: "919900033888",
    site: "westline.co.in",
    instagram: "https://instagram.com/westlinebuilders",
    youtube: "https://youtube.com/@nasirmohideen1",
    salesOffice: "Westline Signature, NH66, Nanthoor Hilltop, Mangalore 575005",
    registeredAddress: "Westline Signature, 15-14-T-813/3, Panvel Kochi Kanyakumari Highway, Nanthoor, Mangaluru, Dakshina Kannada, Karnataka 575002",
    email: "officeadmin@westlinebuilders.com"
  },

  forms: {
    // Live OriginOne intake. Swap this one string to change the destination site-wide.
    endpoint: "https://tercgsdwswtnyrrrjeab.supabase.co/functions/v1/website-lead-intake",
    // Bot guard used by the existing site: submissions faster than this are dropped by the receiver.
    minElapsedMs: 2000,
    // Fallback if the endpoint fails. Never silently discard.
    fallback: "whatsapp"
  },

  media: {
    cloudinary: "https://res.cloudinary.com/dbw8ugwim/image/upload/f_auto,q_auto/",
    cloudinaryVideo: "https://res.cloudinary.com/dbw8ugwim/video/upload/f_auto,q_auto/",
    heroVideos: ["1.mp4", "2.mp4", "3.mp4", "4.mp4"],
    signatureHero: "SignaturePageHero.mp4",
    progressAlbum: "https://photos.app.goo.gl/5eUcXku62UuLpbt77"
  },

  signature: {
    floorsLabel: "55 Floors (3B+G+51)",      // confirmed wording, use verbatim everywhere
    residentialFloors: 51,
    amenityCount: "36+",
    floorToFloorMetres: 3.0,                  // TODO assumption — used by the view-from-floor slider
    rera: "PRM/KA/RERA/1257/334/PR/171021/000845",
    reraCompletion: "September 2027",
    glazing: { system: "Schuco, Germany", type: "Low-E double-glazed, argon-filled", shgc: 0.335, uValue: 1.521 },
    floorsBuiltToDate: null,                  // TODO — current site says "53 floors built"; confirm and date it
    amenities: [],                            // TODO — supply the confirmed 36+ list; amenity cutaway renders this array
    tours: { flat: null, amenityDeck: null },  // TODO — 360 tour URLs
    views: []                                 // TODO — real view photography per height band
  },

  // Prices: "starting from" only, supplied by Westline. null renders "Price on Request".
  pricing: {
    display: "startingFrom",
    currency: "INR",
    units: {
      "2bhk-t1": { size: null, startingFrom: null },       // TODO size + price
      "2bhk-t2": { size: null, startingFrom: null },       // TODO size + price
      "3bhk": { size: 2070, startingFrom: null },          // 2,070 matches floor-plan artwork; westline.co.in says 2,180
      "3bhk-dm-t1": { size: null, startingFrom: null },    // TODO
      "3bhk-dm-t2": { size: null, startingFrom: null },    // TODO
      "4bhk-simplex": { size: 3285, startingFrom: null },
      "4bhk-dm-t1": { size: null, startingFrom: null },    // TODO
      "4bhk-d-t2": { size: 4140, startingFrom: null },
      "4bhk-d-t3": { size: 4360, startingFrom: null },     // westline.co.in calls this Type 2
      "penthouse": { size: 7920, startingFrom: null }      // westline.co.in says 8,350 for the 5 BHK penthouse
    }
  },

  materials: {
    glass: { brand: "Low-E double-glazed, argon-filled", spec: "SHGC 0.335 · U-value 1.521" },
    windows: { brand: "Schuco, Germany", spec: "German window and door systems" },
    floor: { brand: null, spec: null },       // TODO
    kitchen: { brand: null, spec: null }      // TODO
  },

  projects: [
    { key: "signature", name: "Westline Signature", type: "Ultra-luxury residential", floors: 55, floorsLabel: "55 Floors (3B+G+51)", status: "Ongoing", location: "NH66, Nanthoor", rera: "PRM/KA/RERA/1257/334/PR/171021/000845", forSale: true },
    { key: "cubix", name: "Cubix", type: "IT park, retail, office & hotel", floors: 53, status: "Upcoming", location: "NH66, Kadri", rera: "Not applicable — lease only", forSale: false, leaseOnly: true },
    { key: "vantage", name: "Vantage", type: "Premium corner commercial", floors: 10, status: "Upcoming", location: "Fr. Muller Rd × Balikashram Rd, Kankanady", rera: "Registration in progress", forSale: true },
    { key: "salubrity", name: "Salubrity", type: "Commercial / polyclinics", floors: 7, status: "Ongoing", location: "Sturrock × SL Mathias Rd, Falnir", rera: "Registration in progress", forSale: true },
    { key: "jeppu", name: "Jeppu Medicity", type: "Commercial", floors: 6, status: "Completed", location: "Jeppu Market Rd", rera: "PRM/KA/RERA/1257/334/PR/200211/003258", forSale: false },
    { key: "fairmont", name: "Fairmont", type: "Serviced apartments", floors: 6, status: "Ongoing", location: "Karavali Lane, Kadri", rera: "Registration in progress", forSale: true },
    { key: "ohana", name: "Ohana Luxury Stays", type: "Resort", floors: null, status: "Upcoming", location: "Mullayanagiri, Chikmagalur", rera: "Registration in progress", forSale: true },
    { key: "skydale", name: "Skydale", type: "Residential", floors: 7, status: "Completed", location: "Bikkarnakatte", rera: "Completed project — not applicable", forSale: false },
    { key: "splendid", name: "Splendid Homes", type: "Residential", floors: 5, status: "Completed", location: "Kulashekar", rera: "Completed project — not applicable", forSale: false },
    { key: "bonita", name: "Bonita", type: "Residential", floors: 6, status: "Completed", location: "Thokkottu", rera: "Completed project — not applicable", forSale: false }
  ],

  // Launch / event banner. Set enabled: true and it appears site-wide.
  banner: { enabled: false, text: null, cta: null, href: null },

  // Lead capture aggression: "passive" | "standard" | "assertive"
  leadCapture: { level: "assertive", exitIntent: true, scrollDepth: 0.6, oncePerSession: true },

  // Kannada strings. English is the fallback for any key not present here.
  i18n: { kn: {} }
};
