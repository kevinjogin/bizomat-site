# WORKOS release: batch handbook81, 30 October 2026

Eight tools for tolerance intervals, comparing means and spreads, trend forecasting and reliability, taking WORKOS from 931 to 939 tools. No shared tool code, layout, navigation, READOS content or existing tool was changed.

Approved for publication by the owner on 30 October 2026 (all eight tools).

Sources (all checkable): NIST/SEMATECH e-Handbook of Statistical Methods §7.2.6.3 (tolerance intervals for a normal distribution), §7.4.3.3 and §7.4.3.4 (the ANOVA table and one-way ANOVA calculations), §1.3.5.9 (F test for equality of two variances), §1.3.5.8 (chi-square test for the standard deviation), §6.4.3.3 and §6.4.3.4 (double exponential smoothing and forecasting with it), §8.1.5.1 (Arrhenius), §8.4.5.1 (constant repair rate, HPP/exponential model), §8.4.5.2 (power law, Duane, model) and §8.1.9.1 (NHPP power law). No tool cites Machinery’s Handbook, so the batch is in `TOOL_FILES` and the test `FILES` list but not in `HB_FILES`.

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [Normal Tolerance Interval Check](https://kevos.com/tools/normal-tolerance-interval-check/) | Quality | Two-sided k₂ by Howe; one-sided k₁ exactly from the non-central t distribution, with the Natrella approximation alongside; limits against the specification | Variation and how many specimens; Proving a process is ready for production |
| [One-Way ANOVA Check](https://kevos.com/tools/one-way-anova-check/) | Quality | Sums of squares between and within up to four groups, F against the critical value, p-value | Experiment before you standardise |
| [Two-Variance F Test](https://kevos.com/tools/two-variance-f-test/) | Quality | F = s₁² ÷ s₂², two- or one-sided critical values, p-value, interval for σ₁ ÷ σ₂ | Averaging and the square-root rule |
| [Standard Deviation Chi-Square Check](https://kevos.com/tools/standard-deviation-chi-square-check/) | Quality | T = (N − 1)(s ÷ σ₀)², two- or one-sided critical values, p-value, confidence interval for σ | Averaging and the square-root rule |
| [Holt Trend Forecast](https://kevos.com/tools/holt-trend-forecast/) | Planning | Level and trend smoothing, one-step errors and MSE, forecast m periods ahead, best α and γ by trial | Demand forecasting for small manufacturers |
| [Arrhenius Acceleration Check](https://kevos.com/tools/arrhenius-acceleration-check/) | Maintenance | Acceleration factor from the user’s activation energy, equivalent service hours, test hours for a target life, ±0.2 eV sensitivity | The Arrhenius model; Compressing time |
| [MTBF Confidence Bounds](https://kevos.com/tools/mtbf-confidence-bounds/) | Maintenance | MTBF = T ÷ r with chi-square lower and upper bounds, the zero-failure bound and further failure-free hours to a requirement | Qualification testing; Verify with a pilot fleet; Up and down: the two-state model; Are stops random? |
| [Reliability Growth Check](https://kevos.com/tools/reliability-growth-check/) | Maintenance | Power-law model by modified maximum likelihood, growth slope, instantaneous MTBF at the end of test with Crow’s approximate limits, hours to the goal | Ramp-up to nameplate |

Knowledge connections: 13 approved and 6 rejected relationships, each with the chapter text and tool checked (`docs/knowledge-links-review.md`).

NIST worked examples reproduced by the tests:

- Tolerance interval (N = 43, 90 % coverage, 99 % confidence): χ² = 23.650, k₂ = 2.217; one-sided k₁ = 1.8740 (non-central t) and 1.8752 (Natrella); for N = 6, 4.4111 and 5.2808.
- One-way ANOVA: SST 27.897, SSE 17.452, F = 9.59 against F(0.05; 2, 12) = 3.89.
- F test (JAHANMI2 batches): F = 1.123037 against 0.7756 and 1.2894.
- Chi-square test (GEAR.DAT): critical values 73.361 and 128.422. The statistic is 0.3929 from the printed s = 0.0063; NIST prints 0.3903 from the unrounded standard deviation.
- Holt forecast: forecasts 25.8, 28.7, 31.7, 34.6 and 37.6 for periods 11 to 15 at α = 0.3623, γ = 1, b₁ = 0.8, and with γ = 1 the level constant with the smallest error is 0.3623, as NIST states.
- Arrhenius: factors 133 and 17,600 from 25 °C to 125 °C at 0.5 and 1.0 eV. The tool uses the exact Boltzmann constant 8.617333262 × 10⁻⁵ eV/K and 273.15 K; NIST’s 17,597 uses 11605 and 273.16, a 0.02 % difference.
- MTBF bounds (800 h, 2 failures): 400 h, 90 % interval 127 to 2,251 h, zero-failure bound 267 h.
- Reliability growth (case study, T = 1,500 h): β = 0.5165, a = 0.2913, MTBF at end of test 310.234 h, 80 % interval 157.7139 to 548.5565 h.

Open fact-check: NIST §6.4.3.4 prints a double-smoothing MSE of 3.7024 and a single-smoothing MSE of 8.8867 for the same data. The stated method gives 3.6743 and 8.8768, but it reproduces NIST’s forecasts and its best constants exactly (0.3623 and 0.977), so the small difference lies in how NIST’s software reports MSE. The tool follows the stated method and no page quotes 3.7024.

Overlap: `mtbf-confidence-bounds` uses the same chi-square relation as `reliability-demonstration-test`, which plans a test before it runs; the new tool reads results after the hours are logged. `holt-trend-forecast` sits beside `exponential-smoothing-forecast`, which has no trend term.

Speed: the one-sided tolerance factor integrates the non-central t distribution numerically; one calculation takes about 0.1 s at N = 43 and 0.2 s at N = 10,000. Coverage and confidence start at 60 %, because the integration loses accuracy as both approach 50 %.

## Verification (on top of b32e1a1)

- Independent hand-calculated reference values for every tool: chi-square tails in closed form for integer degrees of freedom, the closed-form F tail for 2 numerator degrees of freedom, Simpson integration of the F and normal densities, a z-integral for the non-central t, raw-sum ANOVA as NIST lays it out, and the end-of-test MTBF as 1 ÷ m(T). The tools use incomplete gamma and beta functions instead. Identity checks, pass and fail verdicts, and out-of-range inputs that return CHECK INPUTS.
- `node scripts/tools/input-guides.mjs check --file handbook81`: 8 tools, 95 inputs, 0 problems. Inventory: 939 tools, 8,132 inputs, all covered.
- `npm run verify`: astro check 0 errors and 0 warnings; 1,215/1,215 tests; 3,808 pages verified by the post-build checks.
- `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium 130 on the built site): 939/939 tools passed, 8,132 figures, including every tool on a 360 px phone screen.
