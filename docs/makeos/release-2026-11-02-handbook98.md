# WORKOS release: batch handbook98, 2 November 2026

Seven tools from the deep audit of the Machinery’s Handbook screw thread standards, bearing static loads and rail size pages, taking WORKOS from 1013 to 1020 tools (MAKEOS handbook tools 819 → 826). Requested by the owner ("next big sets"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 2 November 2026 (all seven tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced.

The thread tools build in the allowance and tolerance formulas that head the handbook’s tables, rather than the tables themselves. Two Acme table rules are followed as the tables direct:
- the pitch diameter allowance is taken at the mean of the nominal size range;
- the diameter increment of the tolerance is taken at the next tabulated nominal size.

The bearing tool builds in the static load factors Xo and Yo that the handbook gives for each bearing type. The rail tool builds in the rail and wheel formulas with their constants. These are always user inputs:
- static load ratings and required static safety factors
- the wheel material factor K
- yield strengths
- loads and lengths of engagement

## Deep audit

The audit flagged these pages because they are cited only inside wide page ranges:
- centralizing Acme (p. 1932) and trapezoidal (p. 1904) threads, cited only within the 26- and 46-page ranges of the thread tools
- the static equivalent load page (p. 2419), cited only within ranges of 21 to 76 pages
- the rail size page (p. 277), cited only within the 21-page beam range

What the existing tools cover:
- `acme-thread` gives the basic Acme and trapezoidal sizes, and `acme-tap-drill` and `acme-nut-bore-inspection` give the nut minor diameter.
- `whitworth-thread` gives the basic Whitworth sizes, and `crane-wheel-rail-check` gives the Hertz contact of a wheel on a rail.

None applies:
- the full B1.5 limits for general purpose and centralizing Acme threads
- the B1.8 Stub Acme limits
- the BS 84 Whitworth tolerances
- the B1.10 miniature thread limits
- the AFBMA static equivalent loads
- the handbook’s rail and wheel size rules

The trapezoidal page was examined too. Its basic formulas are already built into `acme-thread`, so it is recorded in `MH_DEEP_AUDIT.md` in the generator folder.

## Tools

| Tool | Method | READOS connections |
|---|---|---|
| [General Purpose Acme Thread Limits (Classes 2G, 3G, 4G)](https://kevos.com/tools/general-purpose-acme-limits/) | allowance (0.008, 0.006, 0.004) √D at the range mean, +10 % per inch of engagement beyond 2D; tolerance (0.006, 0.0028, 0.002) √D + (0.030, 0.014, 0.010) √P; Formulas 1–12 of Table 2a; nut allowance 50, 75, 100 % for 2, 3, 4+ starts; flats; stress area π ((d2 min + d1 min) ÷ 4)², shear area π D1 max [0.5 + n tan 14.5° (d2 min − D1 max)] | Machine elements: power screws and linear motion |
| [Centralizing Acme Thread Limits and Fit (Classes 2C, 3C, 4C)](https://kevos.com/tools/centralizing-acme-limits/) | allowances and tolerances as 2G–4G; screw major tolerance (0.0035, 0.0015, 0.0010) √D, nut major allowance 0.001 √D and tolerance (0.0035, 0.0035, 0.0020) √D; nut minor D − 0.9P + 0.05P; Formulas 1–12 of Table 8a; centralizing requirement and class pairing | none |
| [Stub Acme Thread Limits (Standard, Modified Form 1 and 2)](https://kevos.com/tools/stub-acme-limits/) | h = 0.3P, 0.375P or 0.25P; Formulas 1–12 of Table 14a with the 2G (or 3G, 4G) allowance and tolerance; crest flats 0.4224P, 0.4030P, 0.4353P | none |
| [Whitworth Thread Limits to BS 84 (BSW, BSF)](https://kevos.com/tools/whitworth-thread-limits/) | T = 0.002 ∛D + 0.003 √L + 0.005 √p; bolt tolerances 2/3 T, T, 3/2 T (+ 0.01 √p major, + 0.013 or 0.02 √p minor); nut effective 2/3 T, T, 3/2 T, nut minor 0.2p + 0.004, 0.005 or 0.007; stainless steel adjustment | Machine elements: choosing fasteners and threads; Practical mathematics: inch and metric conversion on legacy drawings |
| [Unified Miniature Screw Thread (UNM) Limits](https://kevos.com/tools/unified-miniature-thread-limits/) | E = D − 0.64952p, K = D − 1.04p; external minor D − 1.20p, internal major D + 0.072p; tolerances 0.12p + 0.006, 0.08p + 0.008, 0.16p + 0.008, 0.32p + 0.012, 0.168p + 0.008; lead angle; area at D − 1.28p | none |
| [Rolling Bearing Static Equivalent Load and Static Safety Factor](https://kevos.com/tools/bearing-static-equivalent-load/) | Po = Xo Fr + Yo Fa ≥ Fr with Xo, Yo for radial contact, angular contact (15°–40°, interpolated), self-aligning ball and roller, single and double row; Poa = Fa + 2.3 Fr tan α with its validity range; Co ÷ Po | Machine elements: selecting bearings and lubrication |
| [Rail Width and Track Wheel Diameter for a Wheel Load](https://kevos.com/tools/rail-and-track-wheel-size/) | B = C ÷ (1250 D), A = B + 5/8 in, D min = C ÷ (A K); AREA p = (y.s. − 13,000) ÷ 20,000 × 600 d for d < 25 in; contact length C ÷ p | none (one rejected pairing) |

Categories:
- the five thread tools are in Threads
- the bearing tool is in Power Transmission
- the rail tool is in Mechanics

Units: the inch thread standards take inches and threads per inch, as the existing inch thread tools do, and also show the limits in millimetres. The miniature thread, bearing and rail tools take SI units; the rail formulas are worked in inches and pounds and converted.

Knowledge connections: 4 approved and 1 rejected relationship (`docs/knowledge-links-review.md`). The rejected pair is the rail tool with the railway chapter on the track as a structure: that chapter is railway track design, not rail sizing for handling equipment.

## Handbook values reproduced by the tests

- **General purpose Acme (Tables 2b, 3 and 5):**
  - 1/2-10 major, minor and pitch diameter limits in 2G, 3G and 4G
  - 1-5 ACME-2G limits
  - the 1/4-16 2G tolerance of 0.0105 in
  - the 3G stress areas 0.0285, 0.0474 and 0.1287 in² for 1/4-16, 5/16-14 and 1/2-10
  - the 1/2-10 shear area 0.749 in²
  - the multi-start clearances 0.002, 0.003 and 0.004 in for 0.25-16 ACME-2G
- **Centralizing Acme (Tables 8b and 12):** 1/2-10 limits of the screw and nut in 2C, 3C and 4C, and the minimum minor diameter clearance.
- **Stub Acme (Table 14b):** 1/4-16 screw major and pitch limits and nut major and minor limits, and the 5/16-14 major minimum.
- **Unified miniature (Table 5):** every limit of 1.00 UNM and 0.30 UNM, with the lead angle 5° 26′ and the sectional areas 0.363 and 0.0307 mm².
- **Rail (p. 277–278 examples):**
  - B = 0.4 in and A = 1.025 in for 10,000 lb on a 20 in wheel, with the smallest wheel 16¼ in
  - the AREA 5,700 lb per inch for a 10 in roller, needing 1.75 in of width

## Notes on the source

- **Acme stress and shear areas:** the 5/16-14 stress area in Table 3 (0.0474 in²) is reproduced only when 5/16 is taken in the 3/16 to 5/16 nominal range, as Table 4 states ("above … to and including"). The shear areas of the finest pitches differ by up to 0.5 % because the table rounds them differently; the 1/2-10 value is reproduced.
- **Centralizing Acme Table 8b:** three nut values are printed without their leading digit:
  - 0.04150 for the 1/2-10 minor diameter maximum (the formula gives 0.4150)
  - 0.1282 for the 1 1/8-5 Class 4C major diameter maximum (1.1282)
  - 0.0700 for the 1 1/4-5 minor diameter minimum (1.0700)
- **Multi-start example:** the handbook’s 5-2 ACME-3G clearances (0.0091, 0.0136, 0.0181 in) are 50, 75 and 100 % of the Class 2G allowance at that size, not the 3G allowance. The tool applies the percentages to the allowance of the class chosen, as the text recommends.
- **Square roots:** the source text drops the radical signs from the table headings (for example "0.008 D", "0.01 p"). Each was confirmed by reproducing the tabulated values; for BS 84, where the handbook gives no table of tolerances, the square and cube roots follow the spacing of the printed formula.
- **Angular contact factors:** Yo for intermediate contact angles is interpolated linearly, as the table note directs.

## Verification (on top of dd97599)

- `node scripts/tools/input-guides.mjs check --file handbook98`: 7 tools, 36 inputs, 0 problems.
- Calculator tests: 1,162/1,162, including eight new tests. The first run failed the tier test on a "Free" class label, which is now "Loose fit (BS 84 free class)".
- `npm run verify` (after the header comments of `data-handbook98.js` and `inputs-handbook98.js` were changed to the new Tools name, which the site-name test on main requires):
  - astro check: 0 errors and 0 warnings
  - tests: 1,320/1,320
  - post-build checks: 4,291 pages verified
- `npm run knowledge:check`: valid (966 relationships). `npm run seo:validate`: passed. Inventory: 1020 tools, 8,843 inputs, all covered.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 1020/1020 tools passed with 8,843 figures.
- The centralizing Acme tool was also run in the browser. A 1-5 ACME-4C screw with a 2C nut reports NOT A CENTRALIZING FIT, with the 4C pitch diameter minimum of 0.8895 in as in Table 8b.
