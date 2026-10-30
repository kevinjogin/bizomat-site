# WORKOS release: batch handbook80, 30 October 2026

Six tools for statistical process control, measurement and demand forecasting, taking WORKOS from 925 to 931 tools. Approved for publication by the owner on 30 October 2026. No shared tool code, layout, navigation, READOS content or existing tool was changed.

Sources (all checkable): NIST/SEMATECH e-Handbook of Statistical Methods §6.3.2.3 (CUSUM control charts), §6.3.2.4 (EWMA control charts), §6.3.3.1 (counts control charts), §1.3.5.17 (Grubbs’ test for outliers), §2.3.6.6 (calibration of future measurements), §4.5.1.2 (prediction of a single response), §4.5.2.1 (single-use calibration intervals), §6.4.3.1 (single exponential smoothing) and §6.4.3.2 (forecasting with single exponential smoothing); Neter, Wasserman and Kutner, *Applied Linear Regression Models* (Irwin, 1983), cited by NIST, for the variance of the fitted value on a straight line. No tool cites Machinery’s Handbook, so the batch is in `TOOL_FILES` and the test `FILES` list but not in `HB_FILES`.

| Tool | Category | Method | READOS connections |
|---|---|---|---|
| [EWMA Control Chart Check](https://kevos.com/tools/ewma-chart-check/) | Quality | EWMA from the target; limits target ± k s √(λ ÷ (2 − λ)); first reading beyond the limits | Statistical process control on the shop floor; Drift, check intervals and the uncertainty budget |
| [CUSUM Control Chart Check](https://kevos.com/tools/cusum-chart-check/) | Quality | Tabular upper and lower sums with k = δσ ÷ 2 against a decision interval h; first signal, direction and where the sum left zero | Statistical process control on the shop floor; Drift, check intervals and the uncertainty budget |
| [c-Chart Check](https://kevos.com/tools/c-chart-check/) | Quality | c̄ ± k √c̄, no lower limit when it would be negative, defect count that signals | Statistical process control on the shop floor |
| [Grubbs Outlier Check](https://kevos.com/tools/grubbs-outlier-check/) | Quality | G statistic, two- or one-sided, against the critical value from the t distribution | Screening and cleaning data before analysis; Describing data |
| [Linear Calibration Check](https://kevos.com/tools/linear-calibration-check/) | Quality | Least-squares line, tests of zero intercept and unit slope, calibrated value by inverting the line, calibration limits solved exactly | Straight-line relationships and estimating models; Measurement system analysis; Measuring humidity on site |
| [Exponential Smoothing Forecast](https://kevos.com/tools/exponential-smoothing-forecast/) | Planning | Single exponential smoothing from S₂ = y₁, MSE and RMSE, next-period forecast, best constant by trial over 0.01 to 1 | Demand forecasting for small manufacturers; Measuring forecast error and reading base rates |

Knowledge connections: 12 approved and 6 rejected relationships, each with the chapter text and tool checked (`docs/knowledge-links-review.md`). The twelfth approved link, to *Measuring humidity on site* in *Humidity Control by the Numbers*, was added during publication because that book reached main while the batch was being published (3bd6b03); the tools commit message counts the eleven reviewed before that.

NIST worked examples reproduced by the tests:

- EWMA: limits 47.4115 and 52.5884 and the EWMA series ending at 51.99 (λ = 0.3, s = 2.0539, target 50).
- CUSUM: first signal at group 14. The final upper sum is 19.06 against NIST’s printed 19.04, because NIST worked from unrounded group means; the test allows for that.
- c chart: limits 4 and 28 for c̄ = 16.
- Grubbs: G = 2.4687 against the one-sided critical value 2.032 at α = 0.05, N = 8.
- Calibration: NIST’s interval 41.07564 to 45.56146 for a reading of 178 on the pressure–temperature line, reproduced in the hand checks from NIST’s published fit statistics.
- Exponential smoothing: MSE 19.0 at α = 0.1.

Open fact-check: NIST §6.4.3.1 reports an MSE of 16.29 at α = 0.5 for the same data, but the method as stated there gives 16.50 (16.29 would need α ≈ 0.52; rounding, other start values and other error counts do not reproduce it). The tool follows the stated method, its tests use the α = 0.1 example, and no page quotes 16.29.

Overlap: `instrument-calibration-check` already compares instrument errors at test points and interpolates a correction; the linear calibration check instead fits a least-squares line and gives a statistical calibration interval.

## Verification (on top of 3bd6b03)

- Independent hand-calculated reference values for every tool: explicit EWMA and smoothing weights, the max-of-partial-sums identity for the CUSUM, a t quantile by Simpson integration of the density (the tools use the incomplete beta function), and normal equations with bisection of the calibration limits (the tool solves them as a quadratic). Identity checks, pass and fail verdicts, and out-of-range inputs that return CHECK INPUTS.
- `node scripts/tools/input-guides.mjs check --file handbook80`: 6 tools, 114 inputs, 0 problems. Inventory: 931 tools, 8,037 inputs, all covered.
- `npm run verify`: astro check 0 errors and 0 warnings; 1,203/1,203 tests; 3,779 pages verified by the post-build checks.
- `npm run knowledge:check`: valid. `npm run seo:validate`: passed.
- Browser sweep (`scripts/tools/input-guides-browser.mjs`, Playwright Chromium 130 on the built site): 931/931 tools passed, 8,037 figures, including every tool on a 360 px phone screen.
