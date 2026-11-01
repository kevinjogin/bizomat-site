# WORKOS release: batch handbook78, 30 October 2026

Three integrated process plans added to WORKOS (MAKEOS collection), taking the directory from 920 to 923 tools. Requested by the owner ("Build another batch"). No shared tool code, layout, navigation, READOS content or existing tool was changed. Batch number handbook76 belongs to another session's quality and reliability batch, which was published while this one was being verified, so this batch is handbook78.

Source: *Machinery’s Handbook*, 29th edition (Oberg, Jones, Horton and Ryffel; Industrial Press, 2012), cited by topic page only. The handbook's electrical discharge machining (pp. 1394–1403) and laser (pp. 1487–1494) sections had not been cited by any tool before this batch. No tables, examples or text are reproduced; removal rates, wear, overcut, spark gaps, area cutting rates, beam quality, required power density and reference cutting speeds are always user inputs.

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [EDM Sinker Plan](https://kevos.com/tools/edm-sinker-plan/) | Manufacturing | Roughing current = current density × face area against the machine limit; duty cycle t_on ÷ (t_on + t_off) and spark frequency; finishing volume = stock × (perimeter × depth + face area); times = volume ÷ removal rate; roughing end wear and electrodes needed; electrode undersize = overcut (+ finishing stock); cost | EDM and micromachining |
| [Wire EDM Cut Plan](https://kevos.com/tools/wire-edm-cut-plan/) | Manufacturing | Kerf = d + 2g; smallest inside corner = d ÷ 2 + last-pass gap; main-cut feed = area rate ÷ thickness; cut, skim and start-hole time; wire length and mass; breaking load = R_m π d² ÷ 4 and tension share; cost | EDM and micromachining |
| [Laser Cutting Plan](https://kevos.com/tools/laser-cutting-plan/) | Manufacturing | Focused spot d = 4 M² λ f ÷ (π D); power density 4P ÷ (π d²); depth of focus 2 z_R √((1 + g)² − 1) with z_R = π d² ÷ (4 M² λ); speed scaled v_ref × (P ÷ P_ref) × (t_ref ÷ t) on the handbook's rule that cut depth is proportional to power and inversely proportional to speed; time and cost per part | Laser cutting; Choosing a cutting process for plate and sheet; Lasers from theory to tool |

Knowledge connections: 5 approved relationships, each with the chapter text and the tool's calculation checked (`docs/knowledge-links-review.md`).

## Verification

- Every tool has independent reference values computed separately in Node (cavity and finishing volumes, electrode wear and count, kerf, wire mass and breaking load, Gaussian spot, power density and depth of focus), scaling checks (half the focal length halves the spot, quadruples the power density and quarters the depth of focus; a tenth of the wavelength gives a tenth of the spot; twice the thickness doubles the wire cut time), pass and fail verdicts for every outcome, and out-of-range inputs that return CHECK INPUTS.
- `node scripts/tools/input-guides.mjs check --file handbook78`: 3 tools, 51 inputs, 0 problems.
- Fixed before release: the laser plan's reference speed label contained an apostrophe, which the calculator report escapes, so the report test could not find it; it was reworded.
- `npm run verify` on the tree as pushed (bb71e2d, rebased once as handbook76 landed): astro check clean; 1,188/1,188 tests; 3,749 pages verified by the post-build checks. `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Browser sweep: `scripts/tools/input-guides-browser.mjs` on that build, served locally, with Playwright 1.48 and Chromium from a private browsers folder: 923/923 tools passed, 7,910 inputs with guides and figures, no failures (`docs/tool-input-guides-browser.json`).

## Limits stated in the tools

The EDM sinker plan covers a straight-walled cavity of constant section, and its removal rates, wear and overcut come from the machine's tables; it does not predict them. The wire EDM plan uses a constant area rate on the main cut and leaves out taper cuts, part supports and wire breakages. The laser plan uses Gaussian-beam estimates, and its speed rule holds only within the maker's chart for the material, gas and laser; it does not predict cut quality or the thickest sheet that can be cut.
