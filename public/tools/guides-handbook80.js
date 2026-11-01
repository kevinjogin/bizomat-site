// MAKEOS methods, input sources and limits for the quality statistics and forecasting tools (batch handbook80).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "ewma-chart-check": {
    "purpose": "Exponentially weighted moving average (EWMA) control chart from up to twenty readings in time order: the EWMA statistic starting from the target, its standard deviation for your weighting factor, the upper and lower control limits from your historical standard deviation, and the first reading at which the EWMA leaves the limits, so small sustained shifts show sooner than on a Shewhart chart.",
    "uses": [
      "Watch a slowly drifting dimension or temperature",
      "Detect a small shift in a process mean early",
      "Chart individual readings where single points are noisy"
    ],
    "users": [
      "Quality engineers and technicians",
      "Process engineers",
      "Laboratory and calibration staff"
    ],
    "inputs": {
      "target": "Mean of the historical in-control data, used as the starting EWMA and the centre line.",
      "s": "Standard deviation of the historical in-control data.",
      "lam": "Weight given to the newest reading (0 to 1); NIST notes 0.2 to 0.3 are usual.",
      "L": "How many standard deviations of the EWMA the limits sit from the centre (3 is common).",
      "n": "How many of the readings below to use, in time order.",
      "x1": "Measurement number 1 in the order it was taken.",
      "x2": "Measurement number 2 in the order it was taken.",
      "x3": "Measurement number 3 in the order it was taken.",
      "x4": "Measurement number 4 in the order it was taken.",
      "x5": "Measurement number 5 in the order it was taken.",
      "x6": "Measurement number 6 in the order it was taken.",
      "x7": "Measurement number 7 in the order it was taken.",
      "x8": "Measurement number 8 in the order it was taken.",
      "x9": "Measurement number 9 in the order it was taken.",
      "x10": "Measurement number 10 in the order it was taken.",
      "x11": "Measurement number 11 in the order it was taken.",
      "x12": "Measurement number 12 in the order it was taken.",
      "x13": "Measurement number 13 in the order it was taken.",
      "x14": "Measurement number 14 in the order it was taken.",
      "x15": "Measurement number 15 in the order it was taken.",
      "x16": "Measurement number 16 in the order it was taken.",
      "x17": "Measurement number 17 in the order it was taken.",
      "x18": "Measurement number 18 in the order it was taken.",
      "x19": "Measurement number 19 in the order it was taken.",
      "x20": "Measurement number 20 in the order it was taken."
    },
    "outputs": [
      "EWMA after each reading",
      "Upper and lower control limits",
      "First reading beyond the limits"
    ],
    "method": [
      "EWMAₜ = λ Yₜ + (1 − λ) EWMAₜ₋₁, starting from EWMA₀ = the target (NIST e-Handbook 6.3.2.4).",
      "Standard deviation of the EWMA s_ewma = s √(λ ÷ (2 − λ)); control limits = target ± k s_ewma (the approximation NIST gives for t not small).",
      "An EWMA above the upper or below the lower limit signals a shift in the mean.",
      "Example: limits 47.412 to 52.588; final EWMA 51.988; no signal."
    ],
    "limitations": [
      "Uses the steady-state limits NIST gives for t not small; the first few EWMA values have a smaller spread, so the chart is slightly slow to signal right at the start.",
      "The historical mean and standard deviation must come from in-control data; limits from data that contain a shift hide it.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A small λ averages many readings and finds small shifts but reacts slowly to large ones; λ = 1 turns the chart into an ordinary individuals chart."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 6.3.2.4 EWMA Control Charts — https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc324.htm"
    ]
  },
  "cusum-chart-check": {
    "purpose": "Tabular CUSUM control chart from up to twenty readings or subgroup means in time order: the reference value from the shift you want to detect, the upper and lower cumulative sums, the decision interval you set, and the first reading at which either sum exceeds it, with the direction of the shift.",
    "uses": [
      "Detect a small, sustained shift in a process mean",
      "Find roughly when a process changed",
      "Watch a filling weight or dimension against its target"
    ],
    "users": [
      "Quality engineers and technicians",
      "Process engineers",
      "Production supervisors"
    ],
    "inputs": {
      "mu0": "Mean the process should run at when in control.",
      "sx": "Standard deviation of the values being plotted (of subgroup means if you plot means).",
      "delta": "Size of shift you want to detect quickly, in standard deviations of the plotted values.",
      "h": "Decision interval in the same units as the readings; a sum above it signals.",
      "n": "How many of the values below to use, in time order.",
      "x1": "Reading or subgroup mean number 1 in time order.",
      "x2": "Reading or subgroup mean number 2 in time order.",
      "x3": "Reading or subgroup mean number 3 in time order.",
      "x4": "Reading or subgroup mean number 4 in time order.",
      "x5": "Reading or subgroup mean number 5 in time order.",
      "x6": "Reading or subgroup mean number 6 in time order.",
      "x7": "Reading or subgroup mean number 7 in time order.",
      "x8": "Reading or subgroup mean number 8 in time order.",
      "x9": "Reading or subgroup mean number 9 in time order.",
      "x10": "Reading or subgroup mean number 10 in time order.",
      "x11": "Reading or subgroup mean number 11 in time order.",
      "x12": "Reading or subgroup mean number 12 in time order.",
      "x13": "Reading or subgroup mean number 13 in time order.",
      "x14": "Reading or subgroup mean number 14 in time order.",
      "x15": "Reading or subgroup mean number 15 in time order.",
      "x16": "Reading or subgroup mean number 16 in time order.",
      "x17": "Reading or subgroup mean number 17 in time order.",
      "x18": "Reading or subgroup mean number 18 in time order.",
      "x19": "Reading or subgroup mean number 19 in time order.",
      "x20": "Reading or subgroup mean number 20 in time order."
    },
    "outputs": [
      "Reference value k",
      "Upper and lower cumulative sums after each reading",
      "First signal and its direction"
    ],
    "method": [
      "Reference value k = δ σ ÷ 2 (half the shift to detect, in data units).",
      "S_hi(i) = max(0, S_hi(i − 1) + xᵢ − μ₀ − k); S_lo(i) = max(0, S_lo(i − 1) + μ₀ − k − xᵢ), both starting at 0 (NIST e-Handbook 6.3.2.3, tabular form).",
      "The process is out of control when either sum exceeds the decision interval h.",
      "Example: k = 0.3175; first signal at reading 14; final upper sum 19.06."
    ],
    "limitations": [
      "The decision interval h sets the false alarm rate and the speed of detection: take it from your chart design or the average run length tables (NIST 6.3.2.3.1).",
      "Readings must be independent; autocorrelated data, common in continuous processes, give false signals.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "After a signal, the reading where the sum last left zero shows roughly when the shift began."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 6.3.2.3 Cusum Control Charts — https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc323.htm"
    ]
  },
  "c-chart-check": {
    "purpose": "Counts (c) control chart from up to twelve inspection units of the same size: the average number of defects per unit, the upper and lower control limits from the Poisson model (no lower limit when it would be negative), the defect count that would signal, and which units fall outside the limits.",
    "uses": [
      "Chart paint or weld defects per panel or assembly",
      "Check whether a bad unit is a special cause",
      "Set an alarm level for defects found at final inspection"
    ],
    "users": [
      "Quality engineers and inspectors",
      "Production supervisors",
      "Continuous improvement staff"
    ],
    "inputs": {
      "k": "How many of the units below to use, in time order.",
      "L": "How many standard deviations the limits sit from the centre line (3 is usual).",
      "c1": "Number of defects (nonconformities) counted on inspection unit 1.",
      "c2": "Number of defects (nonconformities) counted on inspection unit 2.",
      "c3": "Number of defects (nonconformities) counted on inspection unit 3.",
      "c4": "Number of defects (nonconformities) counted on inspection unit 4.",
      "c5": "Number of defects (nonconformities) counted on inspection unit 5.",
      "c6": "Number of defects (nonconformities) counted on inspection unit 6.",
      "c7": "Number of defects (nonconformities) counted on inspection unit 7.",
      "c8": "Number of defects (nonconformities) counted on inspection unit 8.",
      "c9": "Number of defects (nonconformities) counted on inspection unit 9.",
      "c10": "Number of defects (nonconformities) counted on inspection unit 10.",
      "c11": "Number of defects (nonconformities) counted on inspection unit 11.",
      "c12": "Number of defects (nonconformities) counted on inspection unit 12."
    },
    "outputs": [
      "Average defects per unit",
      "Upper and lower control limits",
      "Defect count that signals",
      "Units outside the limits"
    ],
    "method": [
      "Centre line c̄ = total defects ÷ number of units.",
      "Control limits = c̄ ± k √c̄ (Poisson: the variance equals the mean; NIST e-Handbook 6.3.3.1); if the lower limit is negative there is no lower limit.",
      "A unit above the upper or below a positive lower limit signals a special cause.",
      "Example: average 16 defects per unit, limits 4 to 28; 0 unit(s) outside."
    ],
    "limitations": [
      "Every inspection unit must be the same size (same area, length or number of items); different sizes need a chart of defects per unit size.",
      "Assumes defects occur independently (Poisson); clustered defects give false signals.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A c chart counts defects, not defective items: one unit can carry several defects. Use a p chart for the fraction of defective items."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 6.3.3.1 Counts Control Charts — https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc331.htm"
    ]
  },
  "grubbs-outlier-check": {
    "purpose": "Grubbs test for a single outlier in up to twelve measurements from a roughly normal population: the mean and standard deviation, the most extreme value (or the largest or smallest, for a one-sided test), the Grubbs statistic G, the critical value from the t distribution for your significance level and sample size, and whether the suspect value is an outlier.",
    "uses": [
      "Decide whether to question a stray test result",
      "Screen calibration or inspection data before analysis",
      "Check a laboratory result against its replicates"
    ],
    "users": [
      "Quality and laboratory staff",
      "Test and calibration engineers",
      "Process engineers"
    ],
    "inputs": {
      "n": "How many of the values below to use (at least 3).",
      "test": "Test the most extreme value either way, or only the largest or only the smallest.",
      "alpha": "Chance of calling a value an outlier when there is none (5 % is common).",
      "x1": "Measured value number 1.",
      "x2": "Measured value number 2.",
      "x3": "Measured value number 3.",
      "x4": "Measured value number 4.",
      "x5": "Measured value number 5.",
      "x6": "Measured value number 6.",
      "x7": "Measured value number 7.",
      "x8": "Measured value number 8.",
      "x9": "Measured value number 9.",
      "x10": "Measured value number 10.",
      "x11": "Measured value number 11.",
      "x12": "Measured value number 12."
    },
    "outputs": [
      "Mean and standard deviation",
      "Suspect value and G statistic",
      "Critical value of G",
      "Outlier decision"
    ],
    "method": [
      "Two-sided: G = max |Yᵢ − Ȳ| ÷ s; one-sided: G = (Y_max − Ȳ) ÷ s or (Ȳ − Y_min) ÷ s, with s the sample standard deviation (NIST e-Handbook 1.3.5.17).",
      "Critical value G_crit = (N − 1) ÷ √N × √(t² ÷ (N − 2 + t²)), where t is the upper critical value of the t distribution with N − 2 degrees of freedom at α ÷ (2N) (two-sided) or α ÷ N (one-sided).",
      "The suspect value is an outlier if G > G_crit.",
      "Example: G = 2.4688 against a critical value of 2.1266: the suspect value is an outlier."
    ],
    "limitations": [
      "Tests one outlier only and assumes the rest of the data are roughly normal; for several suspect values NIST points to the generalised ESD or Tietjen–Moore tests.",
      "An outlier is a reason to investigate, not to delete: find the cause before removing it.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "With few values a single outlier inflates the standard deviation and can hide itself; with three values almost no result can be shown to be an outlier."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 1.3.5.17 Grubbs’ Test for Outliers — https://www.itl.nist.gov/div898/handbook/eda/section3/eda35h1.htm"
    ]
  },
  "linear-calibration-check": {
    "purpose": "Straight-line calibration from up to eight reference standards: the least-squares intercept and slope with their standard errors, the residual standard deviation, t tests of zero intercept and unit slope, the calibrated value for a new instrument reading by inverting the line, and the approximate calibration interval for that value at your confidence level, against the half-width you can accept.",
    "uses": [
      "Calibrate a load cell, pressure transducer or thermocouple against standards",
      "Correct readings from an instrument with a gain or offset error",
      "Check whether a calibration is good enough for a tolerance"
    ],
    "users": [
      "Calibration and metrology technicians",
      "Test and laboratory engineers",
      "Quality engineers"
    ],
    "inputs": {
      "n": "How many standards below to use (at least 3).",
      "ystar": "Instrument reading to convert to a calibrated value.",
      "conf": "Confidence level of the calibration interval.",
      "tol": "Largest half-width of the calibration interval you accept, in reference units.",
      "r1": "Certified value of reference standard 1.",
      "y1": "Instrument reading when measuring standard 1.",
      "r2": "Certified value of reference standard 2.",
      "y2": "Instrument reading when measuring standard 2.",
      "r3": "Certified value of reference standard 3.",
      "y3": "Instrument reading when measuring standard 3.",
      "r4": "Certified value of reference standard 4.",
      "y4": "Instrument reading when measuring standard 4.",
      "r5": "Certified value of reference standard 5.",
      "y5": "Instrument reading when measuring standard 5.",
      "r6": "Certified value of reference standard 6.",
      "y6": "Instrument reading when measuring standard 6.",
      "r7": "Certified value of reference standard 7.",
      "y7": "Instrument reading when measuring standard 7.",
      "r8": "Certified value of reference standard 8.",
      "y8": "Instrument reading when measuring standard 8."
    },
    "outputs": [
      "Intercept, slope and residual standard deviation",
      "Tests of zero intercept and unit slope",
      "Calibrated value for the new reading",
      "Calibration interval and its half-width"
    ],
    "method": [
      "Least-squares line Y = a + bX through the readings Y against the reference values X; residual standard deviation s with ν = n − 2 degrees of freedom; s_b = s ÷ √Sxx, s_a = s √(1 ÷ n + X̄² ÷ Sxx).",
      "Calibrated value X′ = (Y′ − a) ÷ b; tests of a = 0 and b = 1 compare |a| ÷ s_a and |b − 1| ÷ s_b with t₁₋α/₂,ν (NIST e-Handbook 2.3.6.6).",
      "Calibration interval: the values of X where Y′ − (a + bX) = ± t₁₋α/₂,ν σ_p(X), with σ_p(X) = s √(1 + 1 ÷ n + (X − X̄)² ÷ Sxx), the standard deviation of a new reading (NIST e-Handbook 4.5.1.2 and 4.5.2.1), solved exactly as a quadratic.",
      "Example: reading 50 calibrates to 49.289, interval 48.566 to 50.012 (± 0.72309)."
    ],
    "limitations": [
      "Straight line only, with the same scatter at every level; a curved or uneven response needs a quadratic or weighted fit.",
      "Few standards give wide intervals; use standards that span the working range, with repeats.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "If the intercept test fails the instrument has a constant offset; if the slope test fails the error grows with size (NIST 2.3.6.6). If both pass, the instrument may not need correcting."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 2.3.6.6 Calibration of future measurements — https://www.itl.nist.gov/div898/handbook/mpc/section3/mpc366.htm",
      "NIST/SEMATECH e-Handbook of Statistical Methods, 4.5.2.1 Single-Use Calibration Intervals — https://www.itl.nist.gov/div898/handbook/pmd/section5/pmd521.htm",
      "NIST/SEMATECH e-Handbook of Statistical Methods, 4.5.1.2 How can I predict the value and estimate the uncertainty of a single response? — https://www.itl.nist.gov/div898/handbook/pmd/section5/pmd512.htm",
      "Neter J., Wasserman W. and Kutner M. H., Applied Linear Regression Models (Irwin, 1983): variance of the fitted value on a straight line."
    ]
  },
  "exponential-smoothing-forecast": {
    "purpose": "Single exponential smoothing forecast from up to twelve periods of demand or usage: the smoothed values from your smoothing constant, the one-step forecast errors on the history, the mean squared error and its square root as a share of average demand, the forecast for the next period, and the smoothing constant with the smallest error found by trial over 0.01 to 1, against the error you accept.",
    "uses": [
      "Forecast next month’s demand for a stocked part",
      "Choose a smoothing constant for an inventory system",
      "Check whether simple smoothing is good enough for an item"
    ],
    "users": [
      "Production and inventory planners",
      "Purchasing staff",
      "Operations managers"
    ],
    "inputs": {
      "n": "How many periods below to use, oldest first.",
      "alpha": "Weight on the latest actual demand (0 to 1); larger reacts faster but follows noise.",
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
      "Smoothed values and forecast errors",
      "Mean squared error and RMSE",
      "Forecast for the next period",
      "Best smoothing constant on this history"
    ],
    "method": [
      "S₂ = y₁; Sₜ = α yₜ₋₁ + (1 − α) Sₜ₋₁ for t ≥ 3, where Sₜ is the forecast for period t (NIST e-Handbook 6.4.3.1).",
      "Errors eₜ = yₜ − Sₜ for t = 2 to n; MSE = Σ eₜ² ÷ (n − 1); RMSE = √MSE.",
      "Next-period forecast Sₙ₊₁ = α yₙ + (1 − α) Sₙ (NIST 6.4.3.2); the best α is found by trial over 0.01 to 1 in steps of 0.01, as NIST suggests.",
      "Example: next-period forecast 72.402 with RMSE 4.0616 (5.7206 % of average); best α 1."
    ],
    "limitations": [
      "Single smoothing does not follow a trend or seasonal pattern (NIST 6.4.3.2): its forecasts lag a rising or falling demand.",
      "Few periods make both the error and the best α uncertain; the start value S₂ = y₁ matters most when α is small.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A best α near 1 means the latest period is the best guess (demand moves like a random walk); a best α near 0 means demand is steady around a level."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 6.4.3.1 Single Exponential Smoothing — https://www.itl.nist.gov/div898/handbook/pmc/section4/pmc431.htm",
      "NIST/SEMATECH e-Handbook of Statistical Methods, 6.4.3.2 Forecasting with Single Exponential Smoothing — https://www.itl.nist.gov/div898/handbook/pmc/section4/pmc432.htm"
    ]
  }
});
