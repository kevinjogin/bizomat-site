// MAKEOS methods, input sources and limits for the quality statistics, forecasting and reliability tools (batch handbook81).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "normal-tolerance-interval-check": {
    "purpose": "Tolerance interval for a normally distributed characteristic from a sample: the tolerance factor for your sample size, coverage and confidence (two-sided by Howe’s method, one-sided exactly from the non-central t distribution, with the Natrella approximation alongside), the lower and upper tolerance limits, and whether they lie inside your specification limits.",
    "uses": [
      "Show that a stated share of production meets a drawing tolerance",
      "Set acceptance limits from a qualification sample",
      "Compare a supplier sample against a specification"
    ],
    "users": [
      "Quality engineers",
      "Design and test engineers",
      "Supplier quality staff"
    ],
    "inputs": {
      "side": "Two-sided for a characteristic with both limits; one-sided when only a minimum or only a maximum matters.",
      "mean": "Average of the sample measurements.",
      "s": "Standard deviation of the sample measurements (divisor n − 1).",
      "n": "Number of parts measured.",
      "p": "Proportion of the whole population the interval must contain.",
      "conf": "Confidence that the interval really contains that proportion.",
      "lsl": "Lowest value the drawing or specification allows.",
      "usl": "Highest value the drawing or specification allows."
    },
    "outputs": [
      "Tolerance factor k",
      "Lower and upper tolerance limits",
      "Limits compared with the specification"
    ],
    "method": [
      "Two-sided (Howe): k₂ = z₍₁₊ₚ₎/₂ √(ν (1 + 1/N) ÷ χ²), with ν = N − 1 and χ² the chi-square value with ν degrees of freedom exceeded with probability equal to the confidence (NIST e-Handbook 7.2.6.3).",
      "One-sided: k₁ = t ÷ √N, with t the confidence quantile of the non-central t distribution with N − 1 degrees of freedom and non-centrality z_p √N; the Natrella approximation k₁ = (z_p + √(z_p² − ab)) ÷ a, a = 1 − z²_conf ÷ (2(N − 1)), b = z_p² − z²_conf ÷ N, is shown for comparison.",
      "Tolerance limits = mean ± k s; the interval passes when it lies inside the specification limits.",
      "Example: tolerance factor 2.2173; tolerance interval 95.565 to 104.43."
    ],
    "limitations": [
      "Valid only for a normally distributed characteristic: check the data with a normal probability plot first; skewed data need a distribution-free interval.",
      "Howe’s two-sided factor is an approximation, very close to the exact value for usual sample sizes; the one-sided factor is exact.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A tolerance interval covers individual parts, unlike a confidence interval for the mean: it does not shrink to zero as the sample grows, but approaches mean ± z s."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 7.2.6.3 Tolerance intervals for a normal distribution — https://www.itl.nist.gov/div898/handbook/prc/section2/prc263.htm"
    ]
  },
  "one-way-anova-check": {
    "purpose": "One-way analysis of variance for up to four groups of up to six measurements each: the group means, the sums of squares between and within groups, the mean squares, the F statistic, the critical F value and p-value for your significance level, and whether the group means differ.",
    "uses": [
      "Compare parts made on several machines or cavities",
      "Test whether a process setting changes the result",
      "Compare material from different suppliers or lots"
    ],
    "users": [
      "Quality and process engineers",
      "Test and development engineers",
      "Continuous improvement staff"
    ],
    "inputs": {
      "k": "How many of the groups below to compare (2 to 4).",
      "alpha": "Chance of finding a difference when there is none (5 % is common).",
      "n1": "How many of group 1’s values to use, from the first.",
      "g1x1": "Measurement 1 from group 1 (one machine, supplier, shift or setting).",
      "g1x2": "Measurement 2 from group 1 (one machine, supplier, shift or setting).",
      "g1x3": "Measurement 3 from group 1 (one machine, supplier, shift or setting).",
      "g1x4": "Measurement 4 from group 1 (one machine, supplier, shift or setting).",
      "g1x5": "Measurement 5 from group 1 (one machine, supplier, shift or setting).",
      "g1x6": "Measurement 6 from group 1 (one machine, supplier, shift or setting).",
      "n2": "How many of group 2’s values to use, from the first.",
      "g2x1": "Measurement 1 from group 2 (one machine, supplier, shift or setting).",
      "g2x2": "Measurement 2 from group 2 (one machine, supplier, shift or setting).",
      "g2x3": "Measurement 3 from group 2 (one machine, supplier, shift or setting).",
      "g2x4": "Measurement 4 from group 2 (one machine, supplier, shift or setting).",
      "g2x5": "Measurement 5 from group 2 (one machine, supplier, shift or setting).",
      "g2x6": "Measurement 6 from group 2 (one machine, supplier, shift or setting).",
      "n3": "How many of group 3’s values to use, from the first.",
      "g3x1": "Measurement 1 from group 3 (one machine, supplier, shift or setting).",
      "g3x2": "Measurement 2 from group 3 (one machine, supplier, shift or setting).",
      "g3x3": "Measurement 3 from group 3 (one machine, supplier, shift or setting).",
      "g3x4": "Measurement 4 from group 3 (one machine, supplier, shift or setting).",
      "g3x5": "Measurement 5 from group 3 (one machine, supplier, shift or setting).",
      "g3x6": "Measurement 6 from group 3 (one machine, supplier, shift or setting).",
      "n4": "How many of group 4’s values to use, from the first.",
      "g4x1": "Measurement 1 from group 4 (one machine, supplier, shift or setting).",
      "g4x2": "Measurement 2 from group 4 (one machine, supplier, shift or setting).",
      "g4x3": "Measurement 3 from group 4 (one machine, supplier, shift or setting).",
      "g4x4": "Measurement 4 from group 4 (one machine, supplier, shift or setting).",
      "g4x5": "Measurement 5 from group 4 (one machine, supplier, shift or setting).",
      "g4x6": "Measurement 6 from group 4 (one machine, supplier, shift or setting)."
    },
    "outputs": [
      "Group means",
      "Sums of squares and mean squares",
      "F statistic, critical value and p-value",
      "Whether the means differ"
    ],
    "method": [
      "Treatment sum of squares SST = Σ nᵢ (ȳᵢ − ȳ)²; error sum of squares SSE = Σ Σ (yᵢⱼ − ȳᵢ)²; total = SST + SSE (NIST e-Handbook 7.4.3.3–7.4.3.4).",
      "MST = SST ÷ (k − 1), MSE = SSE ÷ (N − k), F = MST ÷ MSE.",
      "The means differ when F exceeds the upper α point of the F distribution with k − 1 and N − k degrees of freedom.",
      "Example: F = 9.5911 against a critical value of 3.8853 (p = 0.0032482)."
    ],
    "limitations": [
      "Assumes each group is roughly normal with about the same spread and that measurements are independent; check the spreads (the F test for two variances or a plot) before relying on the result.",
      "A significant F says at least one mean differs, not which: compare the group means, or follow up with a multiple-comparison method (NIST 7.4.7).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Practical importance is separate from significance: look at the size of the difference between means against your tolerance."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 7.4.3.3 The ANOVA table and tests of hypotheses about means — https://www.itl.nist.gov/div898/handbook/prc/section4/prc433.htm",
      "NIST/SEMATECH e-Handbook of Statistical Methods, 7.4.3.4 One-way ANOVA calculations — https://www.itl.nist.gov/div898/handbook/prc/section4/prc434.htm"
    ]
  },
  "two-variance-f-test": {
    "purpose": "F test for the equality of two variances from summary statistics: the ratio of the sample variances, the critical values of the F distribution for your significance level and test direction, the p-value, a confidence interval for the ratio of the two standard deviations, and whether the spreads differ.",
    "uses": [
      "Check whether a new machine holds a tighter spread",
      "Compare the scatter of two measurement methods",
      "Check the equal-spread assumption before a t test or ANOVA"
    ],
    "users": [
      "Quality and process engineers",
      "Laboratory staff",
      "Test engineers"
    ],
    "inputs": {
      "test": "Two-sided asks whether the spreads differ either way; one-sided asks whether sample 1 is more (or less) variable.",
      "alpha": "Chance of finding a difference when there is none (5 % is common).",
      "n1": "Number of values in sample 1.",
      "s1": "Standard deviation of sample 1 (divisor n − 1).",
      "n2": "Number of values in sample 2.",
      "s2": "Standard deviation of sample 2 (divisor n − 1)."
    },
    "outputs": [
      "Variance ratio F",
      "Critical values and p-value",
      "Confidence interval for the ratio of standard deviations",
      "Whether the spreads differ"
    ],
    "method": [
      "F = s₁² ÷ s₂² with N₁ − 1 and N₂ − 1 degrees of freedom (NIST e-Handbook 1.3.5.9).",
      "Two-sided: reject equal variances if F is below the α/2 point or above the 1 − α/2 point of the F distribution; one-sided: compare with the 1 − α point (larger) or the α point (smaller).",
      "Confidence interval for σ₁ ÷ σ₂: √(F ÷ F₁₋α/₂) to √(F ÷ F_α/₂), at confidence 1 − α.",
      "Example: F = 1.123 against critical values 0.77556 to 1.2894 (p = 0.37038)."
    ],
    "limitations": [
      "The F test is sensitive to non-normal data: with skewed data or outliers use Levene’s test (NIST 1.3.5.10) instead.",
      "Standard deviations must come from independent samples, each with the divisor n − 1.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Equal sample standard deviations are not needed: a ratio near 1 within the critical values only means the data cannot show a difference."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 1.3.5.9 F-Test for Equality of Two Variances — https://www.itl.nist.gov/div898/handbook/eda/section3/eda359.htm"
    ]
  },
  "standard-deviation-chi-square-check": {
    "purpose": "Chi-square test of a population standard deviation against a target value from one sample: the test statistic, the chi-square critical values for your significance level and test direction, the p-value, a confidence interval for the true standard deviation, and the decision.",
    "uses": [
      "Check whether a process still holds its qualified spread",
      "Show that a new set-up reduced variation below a target",
      "Put a confidence range on a measured standard deviation"
    ],
    "users": [
      "Quality and process engineers",
      "Laboratory and calibration staff",
      "Supplier quality staff"
    ],
    "inputs": {
      "test": "Two-sided asks whether the spread differs from the target either way; one-sided asks whether it is larger (a problem) or smaller (an improvement).",
      "n": "Number of values in the sample.",
      "s": "Standard deviation of the sample (divisor n − 1).",
      "sigma0": "Standard deviation the process is meant to hold, from a qualification or requirement.",
      "alpha": "Chance of a wrong rejection (5 % is common)."
    },
    "outputs": [
      "Chi-square statistic",
      "Critical values and p-value",
      "Confidence interval for the true standard deviation",
      "Decision against the target"
    ],
    "method": [
      "T = (N − 1)(s ÷ σ₀)² with N − 1 degrees of freedom (NIST e-Handbook 1.3.5.8).",
      "Two-sided: reject if T is below the α/2 point or above the 1 − α/2 point of the chi-square distribution; larger: reject if above the 1 − α point; smaller: reject if below the α point.",
      "Confidence interval for σ: √((N − 1)s² ÷ χ²₁₋α/₂) to √((N − 1)s² ÷ χ²_α/₂).",
      "Example: T = 0.39293 against critical values 73.361 to 128.42; true standard deviation 0.0055314 to 0.0073186."
    ],
    "limitations": [
      "The chi-square test for a standard deviation is very sensitive to non-normal data: check normality first.",
      "Values must be independent and from a stable process; a drifting process inflates s.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "The confidence interval is not symmetric about s: with small samples the upper bound can be far above the sample standard deviation."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 1.3.5.8 Chi-Square Test for the Standard Deviation — https://www.itl.nist.gov/div898/handbook/eda/section3/eda358.htm"
    ]
  },
  "holt-trend-forecast": {
    "purpose": "Double exponential smoothing (Holt’s method) from up to twelve periods of demand or usage: the smoothed level and trend from your two smoothing constants and starting trend, the one-step forecast errors on the history, the mean squared error and RMSE as a share of average demand, the forecast for the period you choose ahead, and the pair of constants with the smallest error found by trial, against the error you accept.",
    "uses": [
      "Forecast demand for a part whose sales are growing",
      "Plan capacity or stock for a rising workload",
      "Compare trend smoothing with simple smoothing on the same history"
    ],
    "users": [
      "Production and inventory planners",
      "Operations managers",
      "Sales and purchasing staff"
    ],
    "inputs": {
      "n": "How many periods below to use, oldest first (at least 4).",
      "alpha": "Weight on the latest actual value when updating the level (0 to 1).",
      "gamma": "Weight on the latest change in level when updating the trend (0 to 1).",
      "b1": "How to set the trend at the first period; NIST lists all three.",
      "m": "How many periods past the last actual value to forecast.",
      "target": "Largest root mean squared forecast error you accept, as a share of average demand.",
      "y1": "Actual demand or usage in period 1, oldest first.",
      "y2": "Actual demand or usage in period 2, oldest first.",
      "y3": "Actual demand or usage in period 3, oldest first.",
      "y4": "Actual demand or usage in period 4, oldest first.",
      "y5": "Actual demand or usage in period 5, oldest first.",
      "y6": "Actual demand or usage in period 6, oldest first.",
      "y7": "Actual demand or usage in period 7, oldest first.",
      "y8": "Actual demand or usage in period 8, oldest first.",
      "y9": "Actual demand or usage in period 9, oldest first.",
      "y10": "Actual demand or usage in period 10, oldest first.",
      "y11": "Actual demand or usage in period 11, oldest first.",
      "y12": "Actual demand or usage in period 12, oldest first."
    },
    "outputs": [
      "Level and trend after the last period",
      "Mean squared error and RMSE",
      "Forecasts for the periods ahead",
      "Best pair of smoothing constants on this history"
    ],
    "method": [
      "S₁ = y₁ and b₁ from the chosen start; Sₜ = α yₜ + (1 − α)(Sₜ₋₁ + bₜ₋₁); bₜ = γ (Sₜ − Sₜ₋₁) + (1 − γ) bₜ₋₁ (NIST e-Handbook 6.4.3.3).",
      "One-step forecast for period t is Sₜ₋₁ + bₜ₋₁; errors for t = 2 to n give MSE = Σ e² ÷ (n − 1); forecast m periods ahead = Sₙ + m bₙ (NIST 6.4.3.4).",
      "The best α and γ are found by trial over 0.01 to 1 in steps of 0.01.",
      "Example: level 22.815, trend 2.9568 per period; forecast 37.599 at the last period ahead; RMSE 1.9168 (15.07 % of average)."
    ],
    "limitations": [
      "Projects a straight-line trend: it overshoots when growth levels off and does not model seasonal patterns (NIST 6.4.3.5 covers triple smoothing).",
      "The best constants on a short history are uncertain; forecasts several periods ahead grow less reliable.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A best γ near 1 means the trend follows the latest change in level; a small γ keeps a steadier trend. NIST notes that regression gives a more conservative projection than double smoothing."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 6.4.3.3 Double Exponential Smoothing — https://www.itl.nist.gov/div898/handbook/pmc/section4/pmc433.htm",
      "NIST/SEMATECH e-Handbook of Statistical Methods, 6.4.3.4 Forecasting with Double Exponential Smoothing (LASP) — https://www.itl.nist.gov/div898/handbook/pmc/section4/pmc434.htm"
    ]
  },
  "arrhenius-acceleration-check": {
    "purpose": "Arrhenius temperature acceleration for a life test: the acceleration factor between the use and test temperatures for the activation energy you enter, the equivalent service hours of your test, the test hours needed to represent the target life, and the factor for activation energies 0.1 and 0.2 eV either side, because the result is very sensitive to that value.",
    "uses": [
      "Plan the length of a high-temperature life test",
      "Convert test hours into equivalent service hours",
      "Compare test temperatures before committing oven time"
    ],
    "users": [
      "Reliability and test engineers",
      "Electronics and product engineers",
      "Quality engineers"
    ],
    "inputs": {
      "tu": "Temperature the part runs at in service (at the failure site, not the room).",
      "ts": "Temperature during the accelerated test.",
      "ea": "Activation energy of the failure mechanism, from your own test data or a source for that mechanism.",
      "th": "Hours each unit spends at the test temperature.",
      "life": "Service life the test should represent."
    },
    "outputs": [
      "Acceleration factor",
      "Equivalent service hours of the test",
      "Test hours needed for the target life",
      "Sensitivity to the activation energy"
    ],
    "method": [
      "Arrhenius model: time to fail t_f = A exp(ΔH ÷ kT), with T in kelvin and k Boltzmann’s constant (NIST e-Handbook 8.1.5.1).",
      "Acceleration factor AF = exp[(ΔH ÷ k)(1 ÷ T_use − 1 ÷ T_test)], k = 8.617333262 × 10⁻⁵ eV/K, T = °C + 273.15.",
      "Equivalent service hours = AF × test hours; test hours needed = target life ÷ AF.",
      "Example: acceleration factor 132.66; 1,000 test hours represent 132,660 service hours."
    ],
    "limitations": [
      "Applies only to failure mechanisms driven by temperature that do not change between use and test temperature; too hot a test can start mechanisms the product never sees in service.",
      "The activation energy dominates the answer: a 0.1 eV error changes the factor many times over, so use a value measured for the mechanism.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "NIST’s example: from 25 °C to 125 °C the factor is about 133 at ΔH = 0.5 eV and about 17,600 at 1.0 eV."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 8.1.5.1 Arrhenius — https://www.itl.nist.gov/div898/handbook/apr/section1/apr151.htm"
    ]
  },
  "mtbf-confidence-bounds": {
    "purpose": "Confidence bounds on the mean time between failures (MTBF) for repairable equipment or components with a constant failure rate, from total operating hours and the number of failures in a time-terminated record: the MTBF and failure rate estimates, the one-sided lower bound at your confidence, the two-sided interval, the bound with no failures, and the further failure-free hours needed to demonstrate the requirement.",
    "uses": [
      "Report a defensible MTBF from field or test records",
      "Check whether a machine or fleet meets an MTBF requirement",
      "Work out how much more failure-free running would demonstrate it"
    ],
    "users": [
      "Maintenance and reliability engineers",
      "Test engineers",
      "Asset managers"
    ],
    "inputs": {
      "T": "Sum of operating hours over all units in the record (not calendar hours), up to the end of the record.",
      "r": "Failures recorded in those hours (each repair counts once).",
      "conf": "Confidence for the one-sided lower bound; the two-sided interval uses twice the remainder (95 % gives a 90 % interval).",
      "req": "MTBF the equipment must demonstrate, from a contract or specification."
    },
    "outputs": [
      "MTBF and failure rate estimates",
      "One-sided lower bound",
      "Two-sided interval",
      "Further failure-free hours needed"
    ],
    "method": [
      "MTBF = T ÷ r and λ = r ÷ T, with T the total operating hours and r the failures (NIST e-Handbook 8.4.5.1).",
      "Lower bound = 2T ÷ χ²(C; 2(r + 1)) and upper bound = 2T ÷ χ²(1 − C; 2r), where χ²(P; ν) is the chi-square value with cumulative probability P; together they form a two-sided interval at 2C − 1.",
      "With no failures the lower bound is T ÷ (−ln(1 − C)); further hours needed = required MTBF × χ²(C; 2(r + 1)) ÷ 2 − T, with no more failures.",
      "Example: MTBF lower bound 127.07 h at the confidence chosen, against 100 h required."
    ],
    "limitations": [
      "Assumes a constant failure rate (exponential or HPP model): check there is no trend of improving or worsening reliability first, for example with a reliability growth plot.",
      "The bounds are exact for records that end at a fixed time; for a record that ends at a failure they are approximate (NIST 8.4.5.1).",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "NIST’s example: 800 hours with 2 failures gives an MTBF of 400 h with a 90 % interval of 127 to 2,251 h, so 127 h is the 95 % lower bound."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 8.4.5.1 Constant repair rate (HPP/exponential) model — https://www.itl.nist.gov/div898/handbook/apr/section4/apr451.htm"
    ]
  },
  "reliability-growth-check": {
    "purpose": "Reliability growth analysis with the power-law (Duane, Crow–AMSAA) model from up to fifteen cumulative failure times in a test that ends at a fixed time: the growth slope, the model parameters by modified maximum likelihood, the instantaneous MTBF at the end of the test with approximate confidence bounds, the cumulative MTBF, and the test hours needed to reach the MTBF goal if growth continues at the same rate.",
    "uses": [
      "Track a test-analyse-and-fix programme on a new machine",
      "Estimate the MTBF reached at the end of a debugging run",
      "Plan how much more testing reaches an MTBF goal"
    ],
    "users": [
      "Reliability and test engineers",
      "Machine builders and commissioning engineers",
      "Development engineers"
    ],
    "inputs": {
      "T": "Total test hours when the test stopped (at or after the last failure).",
      "r": "How many failure times below to use, in order.",
      "conf": "Confidence for the one-sided lower limit on the end-of-test MTBF; the upper limit pairs with it as a two-sided interval.",
      "goal": "MTBF the equipment must reach, from a specification or plan.",
      "t1": "Cumulative test hours when failure 1 occurred.",
      "t2": "Cumulative test hours when failure 2 occurred.",
      "t3": "Cumulative test hours when failure 3 occurred.",
      "t4": "Cumulative test hours when failure 4 occurred.",
      "t5": "Cumulative test hours when failure 5 occurred.",
      "t6": "Cumulative test hours when failure 6 occurred.",
      "t7": "Cumulative test hours when failure 7 occurred.",
      "t8": "Cumulative test hours when failure 8 occurred.",
      "t9": "Cumulative test hours when failure 9 occurred.",
      "t10": "Cumulative test hours when failure 10 occurred.",
      "t11": "Cumulative test hours when failure 11 occurred.",
      "t12": "Cumulative test hours when failure 12 occurred.",
      "t13": "Cumulative test hours when failure 13 occurred.",
      "t14": "Cumulative test hours when failure 14 occurred.",
      "t15": "Cumulative test hours when failure 15 occurred."
    },
    "outputs": [
      "Growth slope β and model parameters",
      "Instantaneous MTBF at the end of test with confidence limits",
      "Cumulative MTBF",
      "Test hours for the MTBF estimate to reach the goal at the current growth rate"
    ],
    "method": [
      "Power-law model: expected failures M(t) = a t^b, repair rate m(t) = a b t^(b − 1); growth slope β = 1 − b (NIST e-Handbook 8.4.5.2).",
      "Modified maximum likelihood for a test ending at time T: b = (r − 1) ÷ Σ ln(T ÷ tᵢ), a = r ÷ T^b; MTBF at the end of test = 1 ÷ m(T) = T ÷ (r b).",
      "Approximate limits: M_L = MTBF × r(r − 1) ÷ [r + z²/4 + √(r z²/2 + z⁴/16)]², M_U = MTBF × r(r − 1) ÷ (r − z √(r/2))², with z the standard normal value for the confidence.",
      "Example: growth slope 0.51649; MTBF at end of test 310.23 h, lower limit 157.71 h."
    ],
    "limitations": [
      "For tests that end at a fixed time with fixes made during the test; NIST notes the bounds are approximate. A test that stops at a failure needs a slightly different estimate.",
      "Projecting the goal assumes growth continues at the same slope, which needs the same rate of finding and fixing faults.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A slope β near 0 means no growth (a constant failure rate); β between 0 and 1 means improvement, and a larger β faster improvement (NIST 8.1.9.1). NIST’s case study gives β = 0.5165 and an end-of-test MTBF of 310 h."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 8.4.5.2 Power law (Duane) model — https://www.itl.nist.gov/div898/handbook/apr/section4/apr452.htm",
      "NIST/SEMATECH e-Handbook of Statistical Methods, 8.1.9.1 NHPP power law — https://www.itl.nist.gov/div898/handbook/apr/section1/apr191.htm"
    ]
  }
});
