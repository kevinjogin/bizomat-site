# WORKOS release: batch handbook103, 3 November 2026

Three tools from Machinery’s Handbook pages read from the page images of the source PDF, taking WORKOS from 1037 to 1040 tools (MAKEOS handbook tools 843 → 846). On these pages the text extraction loses the figures or garbles the formulas. Requested by the owner ("continue to work on next sets"). No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 3 November 2026 (all three tools).

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. No tables, examples or text are reproduced.

The tools build in the formulas printed on these pages. These are always user inputs:
- gear sizes and speeds
- the turns of the secondary driver
- lubricant density, surface tension and contact angle
- the force-ratio constants a and LF ÷ L

## Deep audit

These pages were the last ones left on the deep audit lists:
- **Planetary gearing (pp. 2212–2214):** a ledger candidate since 31 October. It was set aside because the meshing in some figures could not be read reliably. The page images now show that the handbook prints a formula under every one of its 24 figures. The tool applies the printed formula of the figure you choose, and its option labels name only the figure and its formula, so no arrangement is described beyond what the page prints. `planetary-gear` and `planetary-gear-set-design` cover the simple sun, planet and ring set only.
- **Cutting fluid in micromachining (pp. 1118–1119):** in the extracted text the adhesion condition, Equation (18b), was garbled. The page image shows it clearly.
- **Machining econometrics (pp. 1140–1143):** the Colding tool-life and force-ratio relation T = (FH ÷ a FC)^(LF/L) on p. 1143 had not been built. Kc, FH and the chip flow angle forces are already in `ect-cutting-forces`.

These were left out on purpose:
- The droplet trajectory, Equations (16) and (17), prints its drag constant as α = 3μD. Stokes drag would be 3πμD, so it was not built until the constant can be confirmed.
- The surface finish five-constant equation needs laboratory constants for each tool and work pair.

## Tools

| Tool | Method | Library connections |
|---|---|---|
| [Planetary and Epicyclic Gearing Ratios for the 24 Handbook Arrangements](https://kevos.com/tools/planetary-arrangement-ratio/) | F or D by the formula printed with each of Figs. 1–24 (e.g. F = 1 + C/B, D = 1 + C/A, F = 1 − Cx/yB, D = (1 + C/A) ÷ (1 − Cx/yB), F = 1 + z(1 − S)/B, D = (A + z) ÷ (A + Sz)); F = 1 ÷ D; follower speed = F × driver speed | Gears: ratios, speeds and gear trains |
| [Micro-Droplet Adhesion on a Rotating Micro Tool (MQL)](https://kevos.com/tools/microdroplet-adhesion-check/) | m = ρ π d³ ÷ 6; Vc = π Dt n ÷ 60; adheres when 2m Vc² ÷ Dt ≤ P (1 + cos θ) σL; highest speed from equality | Machining and metal parts: EDM and micromachining |
| [Tool Life from the Force Ratio FH ÷ FC (Colding)](https://kevos.com/tools/force-ratio-tool-life/) | T = (FH ÷ (a FC))^(LF/L); FH ÷ FC = a T^(L/LF) for a target life | Machining: tool life and the Taylor equation |

Categories:
- the planetary tool is in Gears
- the two machining tools are in Manufacturing

Knowledge connections: 3 approved relationships (`docs/knowledge-links-review.md`).

## Handbook values reproduced by the tests

- **Planetary gearing:**
  - the printed formula of every figure, on one set of gear sizes
  - checks against the standard sun, ring and arm relations: with the ring held and the sun driving (Fig. 10) the arm turns A ÷ (A + C); with the arm driving (Fig. 9) the sun turns 1 + C/B
- **Micro-droplets (Fig. 25 and text):**
  - a Ø1 mm tool at 50,000 rpm runs at about 150 m/min
  - a 10 µm droplet adheres at that speed, as the handbook found for 1 to 10 µm droplets
- **Force ratio (Fig. 12, a = 0.5):**
  - all lines meet at FH ÷ FC = 0.5 and T = 1 min
  - at FH ÷ FC = 1, LF/L = 5 gives 32 min and LF/L = 10 gives 1024 min, as plotted
  - the roughing example ratio 1500 ÷ 3000 = 0.5

## Notes on the source

- **Planetary figure roles:** the notation defines A as the driving gear, B as the driven gear or follower and C as the fixed gear. In Figs. 1 to 4, F is the rotation of the planet follower about its own axis. Figs. 14, 15 and 24 combine A, B and C, so for these the user must match the figure, as the tool says.
- **Micro-droplet example lubricant:** the handbook’s Fig. 25 is for CL2210EP lubricant on uncoated carbide. The tool takes the lubricant’s density, surface tension, contact angle and drop size as inputs.

## Verification (on top of 00b4857)

- `node scripts/tools/input-guides.mjs check --file handbook103`: 3 tools, 24 inputs, 0 problems.
- Calculator tests: 1,181/1,181, including three new tests.
- `npm run verify`:
  - astro check: 0 errors and 0 warnings
  - tests: 1460/1460
  - post-build checks: 4377 pages verified
- `npm run knowledge:check`: valid (908 published links). `npm run seo:validate`: passed. Inventory: 1040 tools, 9,005 inputs, all covered.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 1040/1040 tools passed with 9,005 figures.
- The planetary tool was also run in the browser for Fig. 14 with A = 20, B = 30, C = 80, x = 18 and y = 24. It gives D = −5, with the follower turning at 200 rpm in the opposite direction to the driver.
- **Publishing:** main moved to 00b4857 (two Library books) before this batch was published. The batch was rebased onto it, and the knowledge links were rebuilt from main’s file with the batch’s links added again. Every gate above was then re-run on the rebased branch.
