// KEVOS® MAKEOS: quality statistics, forecasting and reliability tools (batch handbook81) within the WORKOS directory.
window.GOCORE_TOOLS = (window.GOCORE_TOOLS || []).concat([
  {
    "id": "normal-tolerance-interval-check",
    "name": "Normal Tolerance Interval Check (Coverage, Confidence, Tolerance Factor, Against Specification)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "From a sample mean and standard deviation, between what limits can I say a stated proportion of all parts lie, at my confidence level, and do those limits sit inside the specification?",
    "description": "Tolerance interval for a normally distributed characteristic from a sample: the tolerance factor for your sample size, coverage and confidence (two-sided by Howe’s method, one-sided exactly from the non-central t distribution, with the Natrella approximation alongside), the lower and upper tolerance limits, and whether they lie inside your specification limits.",
    "keywords": [
      "MAKEOS",
      "tolerance interval",
      "tolerance factor",
      "coverage",
      "normal distribution",
      "specification limits",
      "statistical tolerance limits"
    ],
    "fields": [
      {
        "key": "side",
        "label": "Interval",
        "type": "select",
        "default": "two",
        "options": [
          [
            "two",
            "Two-sided (lower and upper limits)"
          ],
          [
            "lower",
            "One-sided lower limit"
          ],
          [
            "upper",
            "One-sided upper limit"
          ]
        ]
      },
      {
        "key": "mean",
        "label": "Sample mean",
        "type": "number",
        "default": 100,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "s",
        "label": "Sample standard deviation",
        "type": "number",
        "default": 2,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "n",
        "label": "Sample size",
        "type": "number",
        "default": 43,
        "unit": "parts",
        "min": 3,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "p",
        "label": "Coverage (proportion of all parts)",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 60,
        "max": 99.99,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "conf",
        "label": "Confidence",
        "type": "number",
        "default": 99,
        "unit": "%",
        "min": 60,
        "max": 99.99,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_specification",
        "label": "Specification",
        "type": "heading"
      },
      {
        "key": "lsl",
        "label": "Lower specification limit",
        "type": "number",
        "default": 94,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "usl",
        "label": "Upper specification limit",
        "type": "number",
        "default": 106,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "one-way-anova-check",
    "name": "One-Way ANOVA Check (Group Means, F Test, Machines, Suppliers or Settings)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "I have measurements from two to four machines, suppliers, shifts or settings: do their means really differ, or is the difference within the scatter inside each group?",
    "description": "One-way analysis of variance for up to four groups of up to six measurements each: the group means, the sums of squares between and within groups, the mean squares, the F statistic, the critical F value and p-value for your significance level, and whether the group means differ.",
    "keywords": [
      "MAKEOS",
      "one-way ANOVA",
      "analysis of variance",
      "F test",
      "compare means",
      "treatment effect",
      "design of experiments"
    ],
    "fields": [
      {
        "key": "k",
        "label": "Number of groups",
        "type": "number",
        "default": 3,
        "unit": "groups",
        "min": 2,
        "max": 4,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "alpha",
        "label": "Significance level",
        "type": "number",
        "default": 5,
        "unit": "%",
        "min": 0.1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_group_1",
        "label": "Group 1",
        "type": "heading"
      },
      {
        "key": "n1",
        "label": "Group 1 values used",
        "type": "number",
        "default": 5,
        "unit": "values",
        "min": 1,
        "max": 6,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "g1x1",
        "label": "Group 1 value 1",
        "type": "number",
        "default": 6.9,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g1x2",
        "label": "Group 1 value 2",
        "type": "number",
        "default": 5.4,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g1x3",
        "label": "Group 1 value 3",
        "type": "number",
        "default": 5.8,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g1x4",
        "label": "Group 1 value 4",
        "type": "number",
        "default": 4.6,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g1x5",
        "label": "Group 1 value 5",
        "type": "number",
        "default": 4,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g1x6",
        "label": "Group 1 value 6",
        "type": "number",
        "default": 5.5,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_group_2",
        "label": "Group 2",
        "type": "heading"
      },
      {
        "key": "n2",
        "label": "Group 2 values used",
        "type": "number",
        "default": 5,
        "unit": "values",
        "min": 1,
        "max": 6,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "g2x1",
        "label": "Group 2 value 1",
        "type": "number",
        "default": 8.3,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g2x2",
        "label": "Group 2 value 2",
        "type": "number",
        "default": 6.8,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g2x3",
        "label": "Group 2 value 3",
        "type": "number",
        "default": 7.8,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g2x4",
        "label": "Group 2 value 4",
        "type": "number",
        "default": 9.2,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g2x5",
        "label": "Group 2 value 5",
        "type": "number",
        "default": 6.5,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g2x6",
        "label": "Group 2 value 6",
        "type": "number",
        "default": 7.5,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_group_3",
        "label": "Group 3",
        "type": "heading"
      },
      {
        "key": "n3",
        "label": "Group 3 values used",
        "type": "number",
        "default": 5,
        "unit": "values",
        "min": 1,
        "max": 6,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "g3x1",
        "label": "Group 3 value 1",
        "type": "number",
        "default": 8,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g3x2",
        "label": "Group 3 value 2",
        "type": "number",
        "default": 10.5,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g3x3",
        "label": "Group 3 value 3",
        "type": "number",
        "default": 8.1,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g3x4",
        "label": "Group 3 value 4",
        "type": "number",
        "default": 6.9,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g3x5",
        "label": "Group 3 value 5",
        "type": "number",
        "default": 9.3,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g3x6",
        "label": "Group 3 value 6",
        "type": "number",
        "default": 8.6,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_group_4",
        "label": "Group 4",
        "type": "heading"
      },
      {
        "key": "n4",
        "label": "Group 4 values used",
        "type": "number",
        "default": 5,
        "unit": "values",
        "min": 1,
        "max": 6,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "g4x1",
        "label": "Group 4 value 1",
        "type": "number",
        "default": 7,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g4x2",
        "label": "Group 4 value 2",
        "type": "number",
        "default": 7.5,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g4x3",
        "label": "Group 4 value 3",
        "type": "number",
        "default": 6.8,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g4x4",
        "label": "Group 4 value 4",
        "type": "number",
        "default": 7.2,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g4x5",
        "label": "Group 4 value 5",
        "type": "number",
        "default": 7.1,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "g4x6",
        "label": "Group 4 value 6",
        "type": "number",
        "default": 6.9,
        "unit": "",
        "min": -1000000000,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "two-variance-f-test",
    "name": "Two-Variance F Test (Compare the Spread of Two Machines, Batches or Methods)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "Two machines, batches or methods give the same average but one looks more variable: from their sample standard deviations, is the difference in spread real at my significance level?",
    "description": "F test for the equality of two variances from summary statistics: the ratio of the sample variances, the critical values of the F distribution for your significance level and test direction, the p-value, a confidence interval for the ratio of the two standard deviations, and whether the spreads differ.",
    "keywords": [
      "MAKEOS",
      "F test",
      "equality of variances",
      "compare standard deviations",
      "variance ratio",
      "process spread",
      "hypothesis test"
    ],
    "fields": [
      {
        "key": "test",
        "label": "Alternative",
        "type": "select",
        "default": "two",
        "options": [
          [
            "two",
            "Two-sided: spreads differ"
          ],
          [
            "greater",
            "One-sided: sample 1 spread larger"
          ],
          [
            "less",
            "One-sided: sample 1 spread smaller"
          ]
        ]
      },
      {
        "key": "alpha",
        "label": "Significance level",
        "type": "number",
        "default": 5,
        "unit": "%",
        "min": 0.1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_sample_1",
        "label": "Sample 1",
        "type": "heading"
      },
      {
        "key": "n1",
        "label": "Sample 1 size",
        "type": "number",
        "default": 240,
        "unit": "values",
        "min": 2,
        "max": 1000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "s1",
        "label": "Sample 1 standard deviation",
        "type": "number",
        "default": 65.54909,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_sample_2",
        "label": "Sample 2",
        "type": "heading"
      },
      {
        "key": "n2",
        "label": "Sample 2 size",
        "type": "number",
        "default": 240,
        "unit": "values",
        "min": 2,
        "max": 1000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "s2",
        "label": "Sample 2 standard deviation",
        "type": "number",
        "default": 61.85425,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "standard-deviation-chi-square-check",
    "name": "Standard Deviation Chi-Square Check (Process Spread Against a Target Sigma, Confidence Interval)",
    "category": "Quality",
    "collection": "MAKEOS",
    "question": "Is my process spread different from (or larger or smaller than) the standard deviation it is meant to hold, judging from a sample, and what range does the true standard deviation lie in?",
    "description": "Chi-square test of a population standard deviation against a target value from one sample: the test statistic, the chi-square critical values for your significance level and test direction, the p-value, a confidence interval for the true standard deviation, and the decision.",
    "keywords": [
      "MAKEOS",
      "chi-square test",
      "standard deviation test",
      "variance test",
      "process spread",
      "confidence interval for sigma",
      "hypothesis test"
    ],
    "fields": [
      {
        "key": "test",
        "label": "Alternative",
        "type": "select",
        "default": "two",
        "options": [
          [
            "two",
            "Two-sided: spread differs from target"
          ],
          [
            "upper",
            "One-sided: spread larger than target"
          ],
          [
            "lower",
            "One-sided: spread smaller than target"
          ]
        ]
      },
      {
        "key": "n",
        "label": "Sample size",
        "type": "number",
        "default": 100,
        "unit": "values",
        "min": 2,
        "max": 1000000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "s",
        "label": "Sample standard deviation",
        "type": "number",
        "default": 0.0063,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "sigma0",
        "label": "Target standard deviation σ₀",
        "type": "number",
        "default": 0.1,
        "unit": "",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "alpha",
        "label": "Significance level",
        "type": "number",
        "default": 5,
        "unit": "%",
        "min": 0.1,
        "max": 20,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "holt-trend-forecast",
    "name": "Holt Trend Forecast (Double Exponential Smoothing, Level and Trend, Forecast Error)",
    "category": "Planning",
    "collection": "MAKEOS",
    "question": "My demand or usage is rising (or falling) steadily: what does double exponential smoothing forecast for the next few periods, how large is its error on my history, and which smoothing constants would have done best?",
    "description": "Double exponential smoothing (Holt’s method) from up to twelve periods of demand or usage: the smoothed level and trend from your two smoothing constants and starting trend, the one-step forecast errors on the history, the mean squared error and RMSE as a share of average demand, the forecast for the period you choose ahead, and the pair of constants with the smallest error found by trial, against the error you accept.",
    "keywords": [
      "MAKEOS",
      "double exponential smoothing",
      "Holt method",
      "trend forecast",
      "demand forecast",
      "forecast error",
      "smoothing constants"
    ],
    "fields": [
      {
        "key": "n",
        "label": "Number of periods used",
        "type": "number",
        "default": 10,
        "unit": "periods",
        "min": 4,
        "max": 12,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "alpha",
        "label": "Level smoothing constant α",
        "type": "number",
        "default": 0.3623,
        "unit": "",
        "min": 0.01,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "gamma",
        "label": "Trend smoothing constant γ",
        "type": "number",
        "default": 1,
        "unit": "",
        "min": 0.01,
        "max": 1,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "b1",
        "label": "Starting trend b₁",
        "type": "select",
        "default": "three",
        "options": [
          [
            "three",
            "Average of the first three changes"
          ],
          [
            "first",
            "First change (y₂ − y₁)"
          ],
          [
            "all",
            "Average change over all periods"
          ]
        ]
      },
      {
        "key": "m",
        "label": "Periods ahead to forecast",
        "type": "number",
        "default": 5,
        "unit": "periods",
        "min": 1,
        "max": 24,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "target",
        "label": "Forecast error accepted (RMSE)",
        "type": "number",
        "default": 20,
        "unit": "% of average",
        "min": 0.1,
        "max": 100,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_demand_in_each_period_oldest_first",
        "label": "Demand in each period, oldest first",
        "type": "heading"
      },
      {
        "key": "y1",
        "label": "Period 1 demand",
        "type": "number",
        "default": 6.4,
        "unit": "units",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y2",
        "label": "Period 2 demand",
        "type": "number",
        "default": 5.6,
        "unit": "units",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y3",
        "label": "Period 3 demand",
        "type": "number",
        "default": 7.8,
        "unit": "units",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y4",
        "label": "Period 4 demand",
        "type": "number",
        "default": 8.8,
        "unit": "units",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y5",
        "label": "Period 5 demand",
        "type": "number",
        "default": 11,
        "unit": "units",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y6",
        "label": "Period 6 demand",
        "type": "number",
        "default": 11.6,
        "unit": "units",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y7",
        "label": "Period 7 demand",
        "type": "number",
        "default": 16.7,
        "unit": "units",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y8",
        "label": "Period 8 demand",
        "type": "number",
        "default": 15.3,
        "unit": "units",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y9",
        "label": "Period 9 demand",
        "type": "number",
        "default": 21.6,
        "unit": "units",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y10",
        "label": "Period 10 demand",
        "type": "number",
        "default": 22.4,
        "unit": "units",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y11",
        "label": "Period 11 demand",
        "type": "number",
        "default": 24.9,
        "unit": "units",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "y12",
        "label": "Period 12 demand",
        "type": "number",
        "default": 27.3,
        "unit": "units",
        "min": 0,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "arrhenius-acceleration-check",
    "name": "Arrhenius Acceleration Check (Temperature Acceleration Factor, Equivalent Hours, Test Length)",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "If I run a life test hotter than the parts see in service, how much faster do temperature-driven failures happen, how many service hours does my test represent, and is it long enough to cover the target life?",
    "description": "Arrhenius temperature acceleration for a life test: the acceleration factor between the use and test temperatures for the activation energy you enter, the equivalent service hours of your test, the test hours needed to represent the target life, and the factor for activation energies 0.1 and 0.2 eV either side, because the result is very sensitive to that value.",
    "keywords": [
      "MAKEOS",
      "Arrhenius",
      "acceleration factor",
      "accelerated life test",
      "activation energy",
      "temperature acceleration",
      "burn-in"
    ],
    "fields": [
      {
        "key": "tu",
        "label": "Use (service) temperature",
        "type": "number",
        "default": 25,
        "unit": "°C",
        "min": -200,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ts",
        "label": "Test (stress) temperature",
        "type": "number",
        "default": 125,
        "unit": "°C",
        "min": -200,
        "max": 2000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "ea",
        "label": "Activation energy ΔH",
        "type": "number",
        "default": 0.5,
        "unit": "eV",
        "min": 0.01,
        "max": 5,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "th",
        "label": "Test duration",
        "type": "number",
        "default": 1000,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "life",
        "label": "Target service life to cover",
        "type": "number",
        "default": 100000,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "mtbf-confidence-bounds",
    "name": "MTBF Confidence Bounds (Field or Test Failures, Chi-Square Limits, Requirement Check)",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "From the operating hours and failures I have recorded, what is the mean time between failures, what lower bound can I claim at my confidence level, and does it meet the requirement?",
    "description": "Confidence bounds on the mean time between failures (MTBF) for repairable equipment or components with a constant failure rate, from total operating hours and the number of failures in a time-terminated record: the MTBF and failure rate estimates, the one-sided lower bound at your confidence, the two-sided interval, the bound with no failures, and the further failure-free hours needed to demonstrate the requirement.",
    "keywords": [
      "MAKEOS",
      "MTBF",
      "confidence bounds",
      "failure rate",
      "chi-square",
      "exponential model",
      "reliability analysis"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Total operating hours",
        "type": "number",
        "default": 800,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Number of failures",
        "type": "number",
        "default": 2,
        "unit": "failures",
        "min": 0,
        "max": 10000,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "conf",
        "label": "Confidence for the lower bound",
        "type": "number",
        "default": 95,
        "unit": "%",
        "min": 50.1,
        "max": 99.9,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "req",
        "label": "Required MTBF",
        "type": "number",
        "default": 100,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  },
  {
    "id": "reliability-growth-check",
    "name": "Reliability Growth Check (Duane Power-Law Model, Growth Slope, MTBF at End of Test)",
    "category": "Maintenance",
    "collection": "MAKEOS",
    "question": "We have been fixing faults as they appear during a development or debugging test: is reliability actually growing, what MTBF has the equipment reached at the end of the test, and has it reached the goal?",
    "description": "Reliability growth analysis with the power-law (Duane, Crow–AMSAA) model from up to fifteen cumulative failure times in a test that ends at a fixed time: the growth slope, the model parameters by modified maximum likelihood, the instantaneous MTBF at the end of the test with approximate confidence bounds, the cumulative MTBF, and the test hours needed to reach the MTBF goal if growth continues at the same rate.",
    "keywords": [
      "MAKEOS",
      "reliability growth",
      "Duane model",
      "Crow-AMSAA",
      "power law process",
      "MTBF",
      "test analyse and fix"
    ],
    "fields": [
      {
        "key": "T",
        "label": "Test end time",
        "type": "number",
        "default": 1500,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "r",
        "label": "Number of failures",
        "type": "number",
        "default": 10,
        "unit": "failures",
        "min": 2,
        "max": 15,
        "step": 1,
        "integer": true,
        "sens": false
      },
      {
        "key": "conf",
        "label": "Confidence for the lower limit",
        "type": "number",
        "default": 90,
        "unit": "%",
        "min": 50.1,
        "max": 99.9,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "goal",
        "label": "MTBF goal",
        "type": "number",
        "default": 150,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "h_cumulative_test_hours_at_each_failure",
        "label": "Cumulative test hours at each failure",
        "type": "heading"
      },
      {
        "key": "t1",
        "label": "Failure 1 time",
        "type": "number",
        "default": 5,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t2",
        "label": "Failure 2 time",
        "type": "number",
        "default": 40,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t3",
        "label": "Failure 3 time",
        "type": "number",
        "default": 43,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t4",
        "label": "Failure 4 time",
        "type": "number",
        "default": 175,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t5",
        "label": "Failure 5 time",
        "type": "number",
        "default": 389,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t6",
        "label": "Failure 6 time",
        "type": "number",
        "default": 712,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t7",
        "label": "Failure 7 time",
        "type": "number",
        "default": 747,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t8",
        "label": "Failure 8 time",
        "type": "number",
        "default": 795,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t9",
        "label": "Failure 9 time",
        "type": "number",
        "default": 1299,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t10",
        "label": "Failure 10 time",
        "type": "number",
        "default": 1478,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t11",
        "label": "Failure 11 time",
        "type": "number",
        "default": 1600,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t12",
        "label": "Failure 12 time",
        "type": "number",
        "default": 1750,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t13",
        "label": "Failure 13 time",
        "type": "number",
        "default": 1900,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t14",
        "label": "Failure 14 time",
        "type": "number",
        "default": 2100,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      },
      {
        "key": "t15",
        "label": "Failure 15 time",
        "type": "number",
        "default": 2300,
        "unit": "h",
        "min": 0.000001,
        "max": 1000000000000,
        "step": "any",
        "integer": false,
        "sens": true
      }
    ]
  }
]);
