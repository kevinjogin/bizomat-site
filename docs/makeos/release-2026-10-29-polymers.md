# WORKOS release: batch polymers, 29 October 2026

Six polymer thermodynamics tools added to WORKOS (MAKEOS collection), taking the directory from 850 to 856 tools. Approved for publication by the owner on 29 October 2026. No shared tool code, layout, navigation, READOS content or existing tool was changed.

Source: V. J. Klenin, *Thermodynamics of Systems Containing Flexible-Chain Polymers* (Elsevier, 1999; ISBN 0-444-82373-5; © Elsevier Science B.V.), cited by section and equation number. The supplied PDF has a text layer; the cited equations were also checked on the page images. No tables, figures, examples or text are reproduced. Further references are the original papers Klenin cites and standard texts: Flory (1953) and Flory (1949); Stockmayer (1949); Blanks and Prausnitz (1964); Hansen, *Hansen Solubility Parameters: A User’s Handbook* (CRC, 2007); Flory and Rehner (1943); Kraus (1963); Solomon and Ciută (1962); Billmeyer (1949); Huggins (1942); Mandelkern (2002); Berne and Pecora (1976); Koppel (1972). Standards are named by number and scope only (ISO 175, ISO 1817, ISO 1628-1, ISO 22412, ASTM D2857, D4603, D6814).

These tools do not cite *Machinery’s Handbook*, so the batch is named `polymers` rather than handbookNN. It is registered in `TOOL_FILES` and the test `FILES` list, not in the handbook-only `HB_FILES` list (which stays at 729).

| Tool | Category | Method (Klenin) | READOS connections |
|---|---|---|---|
| [Polymer Solution and Blend Phase Check](https://kevos.com/tools/polymer-solution-phase-check/) | Materials | Flory–Huggins χ from solubility parameters (Eq. 3.1-71); polydisperse spinodal and critical point (Eqs. 3.2-9 to 3.2-11); binodal for a uniform chain of length Mw solved from equal chemical potentials | none yet |
| [Solvent Attack and Swelling Screen](https://kevos.com/tools/hansen-solvent-compatibility/) | Materials | Hansen distance Ra and RED, volume-weighted blends (§3.1.1; Hansen 2007) | Plastic Parts (two chapters); Heat Exchangers |
| [Rubber Swelling Test](https://kevos.com/tools/rubber-swelling-crosslink-density/) | Quality | Flory–Rehner for an f-functional network (Eq. 3.5-65); G = νRT and E = 3G (Eqs. 3.5-50, 3.5-58) | Rubber Parts (two chapters) |
| [Polymer Intrinsic Viscosity](https://kevos.com/tools/polymer-intrinsic-viscosity/) | Quality | Solomon–Ciuta, Billmeyer and Huggins single-point relations; Mark–Houwink (§5.3) | none yet |
| [Polymer Melting or Dissolution Temperature with a Diluent](https://kevos.com/tools/polymer-melting-point-depression/) | Materials | Flory melting-point depression from equal chemical potentials in crystal and solution (§6.1) | none yet |
| [Particle and Polymer Coil Size from DLS](https://kevos.com/tools/dls-particle-size/) | Quality | Γ = Dq², Siegert relation, Stokes–Einstein, condition qR ≪ 1 (§3.3.2) | Fine Particles |

Knowledge connections: 6 approved and 3 rejected relationships, each with the chapter text and tool checked (`docs/knowledge-links-review.md`).

## Verification

- Every tool has independent hand-calculated reference values: closed forms, the exact regular-solution binodal ln[φ/(1 − φ)] ÷ (2φ − 1), equal chemical potentials of both components at the computed binodal, and the binodal and spinodal meeting at the critical point. Each also has pass and fail verdicts and out-of-range inputs that return CHECK INPUTS.
- The binodal solver was swept over chain lengths from 1 to 5 million and polymer fractions from 0.001 % to 99 % before release.
- `node scripts/tools/input-guides.mjs check --file polymers`: 6 tools, 66 inputs, 0 problems. Inventory: 856 tools, 7,265 inputs, all covered.
- `npm run verify` (after rebasing on 4cbe9b8): astro check 0 errors and 0 warnings; 1,072/1,072 tests; 3,682 pages verified by the post-build checks.
- `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium on the built site): 856/856 tools passed, 7,265 figures. The sweep's 360 px check samples older tools, so the six new tools were also checked at 360 px: each calculates with no horizontal overflow.

## Limits stated in the tools

Flory–Huggins is a mean-field model with χ independent of concentration and only upper critical behaviour; the binodal is for a uniform chain, so a polydisperse polymer's cloud point must be measured. The Hansen sphere is a screen and does not predict environmental stress cracking. Flory–Rehner results are affine-network values without a filler correction and are very sensitive to χ. Single-point viscosity relations assume a typical Huggins constant, and Mv depends on the Mark–Houwink constants entered. Flory's melting-point equation is an equilibrium result and does not apply alone when χ ≥ 0.5. DLS from one decay rate gives a z-average size for dilute samples only.
