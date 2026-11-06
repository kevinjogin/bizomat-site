// BIZOMAT Tools input guides: handbook81. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook81.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "normal-tolerance-interval-check": {
    side: {
      what: "Whether the interval has both a lower and an upper limit, or only one limit for a characteristic with only a minimum or only a maximum.",
      tip: "Match the specification: a bore diameter with ± tolerance is two-sided; a minimum strength is one-sided lower.",
      effect: "A one-sided interval uses a smaller factor, so its single limit sits closer to the mean.",
      fig: "choice"
    },
    mean: {
      what: "The average of the sample measurements of the characteristic, in the same units as the specification limits.",
      tip: "Use parts made under the same conditions as production, measured with a capable gauge.",
      effect: "Moves the whole tolerance interval up or down.",
      fig: "number",
      sym: "Ȳ"
    },
    s: {
      what: "The standard deviation of the sample measurements, calculated with the divisor n − 1 as spreadsheets do with STDEV.S.",
      tip: "Calculate it from the same sample as the mean; one outlier inflates it, so check the data first.",
      effect: "The interval width grows in proportion to it.",
      fig: "tolerance",
      sym: "s"
    },
    n: {
      what: "The number of parts measured in the sample.",
      tip: "More parts shrink the factor: with fewer than about 10 the factor, and so the interval, becomes very wide.",
      effect: "A larger sample lowers the tolerance factor towards the normal value z.",
      fig: "count",
      sym: "N"
    },
    p: {
      what: "The proportion of the whole population of parts the interval must contain, for example 99 % of all parts made.",
      tip: "Choose it from the risk of a part out of tolerance you can accept; 90 %, 95 % and 99 % are common.",
      effect: "A higher coverage widens the interval.",
      fig: "percent",
      sym: "p"
    },
    conf: {
      what: "The confidence that the interval really contains at least the stated proportion of all parts, given only a sample.",
      tip: "Use 95 % for most qualification work and 99 % for critical characteristics.",
      effect: "A higher confidence widens the interval, more so for small samples.",
      fig: "percent",
      sym: "γ"
    },
    lsl: {
      what: "The lowest value the drawing or specification allows for the characteristic.",
      tip: "Take it from the drawing tolerance or material specification in the same units as the mean.",
      effect: "Only moves the pass or fail line for the lower tolerance limit.",
      fig: "tolerance",
      sym: "LSL"
    },
    usl: {
      what: "The highest value the drawing or specification allows for the characteristic.",
      tip: "Take it from the drawing tolerance or material specification in the same units as the mean.",
      effect: "Only moves the pass or fail line for the upper tolerance limit.",
      fig: "tolerance",
      sym: "USL"
    }
  },
  "one-way-anova-check": {
    k: {
      what: "How many groups are compared, from two to four; each group is one machine, supplier, shift, operator or setting.",
      tip: "Compare only groups that differ in the one factor you are studying, made otherwise the same way.",
      effect: "More groups add degrees of freedom between groups and change the critical F value.",
      fig: "count",
      sym: "k"
    },
    alpha: {
      what: "The significance level: the chance you accept of declaring that the group means differ when there is no real difference.",
      tip: "Use 5 % unless your procedure says otherwise; 1 % for decisions where a false alarm is costly.",
      effect: "A smaller level widens the acceptance region, so a difference must be larger to show.",
      fig: "percent",
      sym: "α"
    },
    n1: {
      what: "How many of the six value boxes for group 1 are used, counting from the first; the rest are ignored.",
      tip: "Enter group 1’s values from the first box onwards with no gaps; groups may have different counts.",
      effect: "More values per group make the error mean square more reliable and smaller differences detectable.",
      fig: "count",
      sym: "n1"
    },
    g1x1: {
      what: "Measurement 1 from group 1, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 1 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 1’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y11"
    },
    g1x2: {
      what: "Measurement 2 from group 1, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 1 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 1’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y12"
    },
    g1x3: {
      what: "Measurement 3 from group 1, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 1 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 1’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y13"
    },
    g1x4: {
      what: "Measurement 4 from group 1, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 1 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 1’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y14"
    },
    g1x5: {
      what: "Measurement 5 from group 1, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 1 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 1’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y15"
    },
    g1x6: {
      what: "Measurement 6 from group 1, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 1 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 1’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y16"
    },
    n2: {
      what: "How many of the six value boxes for group 2 are used, counting from the first; the rest are ignored.",
      tip: "Enter group 2’s values from the first box onwards with no gaps; groups may have different counts.",
      effect: "More values per group make the error mean square more reliable and smaller differences detectable.",
      fig: "count",
      sym: "n2"
    },
    g2x1: {
      what: "Measurement 1 from group 2, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 2 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 2’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y21"
    },
    g2x2: {
      what: "Measurement 2 from group 2, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 2 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 2’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y22"
    },
    g2x3: {
      what: "Measurement 3 from group 2, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 2 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 2’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y23"
    },
    g2x4: {
      what: "Measurement 4 from group 2, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 2 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 2’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y24"
    },
    g2x5: {
      what: "Measurement 5 from group 2, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 2 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 2’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y25"
    },
    g2x6: {
      what: "Measurement 6 from group 2, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 2 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 2’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y26"
    },
    n3: {
      what: "How many of the six value boxes for group 3 are used, counting from the first; the rest are ignored.",
      tip: "Enter group 3’s values from the first box onwards with no gaps; groups may have different counts.",
      effect: "More values per group make the error mean square more reliable and smaller differences detectable.",
      fig: "count",
      sym: "n3"
    },
    g3x1: {
      what: "Measurement 1 from group 3, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 3 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 3’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y31"
    },
    g3x2: {
      what: "Measurement 2 from group 3, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 3 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 3’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y32"
    },
    g3x3: {
      what: "Measurement 3 from group 3, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 3 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 3’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y33"
    },
    g3x4: {
      what: "Measurement 4 from group 3, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 3 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 3’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y34"
    },
    g3x5: {
      what: "Measurement 5 from group 3, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 3 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 3’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y35"
    },
    g3x6: {
      what: "Measurement 6 from group 3, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 3 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 3’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y36"
    },
    n4: {
      what: "How many of the six value boxes for group 4 are used, counting from the first; the rest are ignored.",
      tip: "Enter group 4’s values from the first box onwards with no gaps; groups may have different counts.",
      effect: "More values per group make the error mean square more reliable and smaller differences detectable.",
      fig: "count",
      sym: "n4"
    },
    g4x1: {
      what: "Measurement 1 from group 4, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 4 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 4’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y41"
    },
    g4x2: {
      what: "Measurement 2 from group 4, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 4 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 4’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y42"
    },
    g4x3: {
      what: "Measurement 3 from group 4, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 4 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 4’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y43"
    },
    g4x4: {
      what: "Measurement 4 from group 4, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 4 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 4’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y44"
    },
    g4x5: {
      what: "Measurement 5 from group 4, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 4 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 4’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y45"
    },
    g4x6: {
      what: "Measurement 6 from group 4, where a group is one machine, supplier, shift, operator or setting being compared.",
      tip: "Measure every part in group 4 the same way as the other groups, and in random order if you can.",
      effect: "Moves group 4’s mean and adds to the scatter within groups, which sets the error mean square.",
      fig: "number",
      sym: "y46"
    }
  },
  "two-variance-f-test": {
    test: {
      what: "Which question the test answers: whether the two spreads differ in either direction, or whether sample 1 is specifically larger or smaller.",
      tip: "Choose one-sided only if you decided the direction before seeing the data, such as a new machine claimed to be tighter.",
      effect: "A one-sided test puts the whole significance level in one tail, so it detects a difference in that direction sooner.",
      fig: "choice"
    },
    alpha: {
      what: "The significance level: the chance you accept of declaring that the spreads differ when there is no real difference.",
      tip: "Use 5 % unless your procedure says otherwise; 1 % for decisions where a false alarm is costly.",
      effect: "A smaller level widens the acceptance region, so a difference must be larger to show.",
      fig: "percent",
      sym: "α"
    },
    n1: {
      what: "The number of values in sample 1, from the first machine, batch or method.",
      tip: "Count only values from a stable period; samples of 20 or more give a useful test.",
      effect: "More values add degrees of freedom and narrow the critical values around 1.",
      fig: "count",
      sym: "N₁"
    },
    s1: {
      what: "The standard deviation of sample 1, calculated with the divisor n − 1.",
      tip: "Calculate it from individual values, not from subgroup means.",
      effect: "The variance ratio F rises with its square.",
      fig: "tolerance",
      sym: "s₁"
    },
    n2: {
      what: "The number of values in sample 2, from the second machine, batch or method.",
      tip: "Count only values from a stable period; the two samples need not be the same size.",
      effect: "More values add degrees of freedom and narrow the critical values around 1.",
      fig: "count",
      sym: "N₂"
    },
    s2: {
      what: "The standard deviation of sample 2, calculated with the divisor n − 1.",
      tip: "Calculate it in the same units and the same way as sample 1.",
      effect: "The variance ratio F falls with its square.",
      fig: "tolerance",
      sym: "s₂"
    }
  },
  "standard-deviation-chi-square-check": {
    test: {
      what: "Which question the test answers: whether the spread differs from the target either way, is larger than it (a problem) or is smaller (an improvement).",
      tip: "To show a process meets a maximum spread, test whether it is smaller; to raise an alarm, test whether it is larger.",
      effect: "Changes which tail of the chi-square distribution holds the rejection region.",
      fig: "choice"
    },
    n: {
      what: "The number of values in the sample used to calculate the standard deviation.",
      tip: "Use at least 20 to 30 values; with few values the confidence interval for the standard deviation is very wide.",
      effect: "More values add degrees of freedom and tighten the confidence interval.",
      fig: "count",
      sym: "N"
    },
    s: {
      what: "The standard deviation of the sample, calculated with the divisor n − 1.",
      tip: "Calculate it from individual values taken from a stable process.",
      effect: "The test statistic rises with its square.",
      fig: "tolerance",
      sym: "s"
    },
    sigma0: {
      what: "The standard deviation the process is meant to hold, from a qualification study, a requirement or a capability target.",
      tip: "For a capability target, σ₀ = tolerance width ÷ (6 × required Cp).",
      effect: "The test statistic falls with its square.",
      fig: "tolerance",
      sym: "σ₀"
    },
    alpha: {
      what: "The significance level: the chance you accept of a wrong rejection when there is no real difference.",
      tip: "Use 5 % unless your procedure says otherwise; 1 % for decisions where a false alarm is costly.",
      effect: "A smaller level widens the acceptance region, so a difference must be larger to show.",
      fig: "percent",
      sym: "α"
    }
  },
  "holt-trend-forecast": {
    n: {
      what: "How many of the demand periods listed below are used, counting from the oldest.",
      tip: "Use at least eight periods to judge the error and choose the constants.",
      effect: "Periods beyond this count are ignored.",
      fig: "count",
      sym: "n"
    },
    alpha: {
      what: "The level smoothing constant: the weight given to the latest actual demand when updating the smoothed level, between 0 and 1.",
      tip: "Start from the best value the tool finds on your history, then round it.",
      effect: "A larger constant follows recent demand more closely but also follows random noise.",
      fig: "factor",
      sym: "α"
    },
    gamma: {
      what: "The trend smoothing constant: the weight given to the latest change in level when updating the trend, between 0 and 1.",
      tip: "A smaller value keeps a steadier trend; check the best value on your history.",
      effect: "A larger constant lets the trend swing with each period’s change.",
      fig: "factor",
      sym: "γ"
    },
    b1: {
      what: "How the starting trend is set from the first periods of history; NIST gives all three choices.",
      tip: "The average of the first three changes is a good default; the first change alone is sensitive to noise.",
      effect: "Changes the early forecasts most; its effect fades as γ and the number of periods grow.",
      fig: "choice",
      sym: "b₁"
    },
    m: {
      what: "How many periods past the last actual period to forecast; the tool lists every period up to it.",
      tip: "Keep it short: a straight trend projected far ahead becomes unreliable.",
      effect: "The forecast moves by one trend step for each extra period ahead.",
      fig: "count",
      sym: "m"
    },
    target: {
      what: "The largest root mean squared forecast error you accept, as a share of average demand over the periods used.",
      tip: "Set it from the safety stock or capacity buffer you are prepared to hold against forecast error.",
      effect: "Only moves the pass or fail line.",
      fig: "percent"
    },
    y1: {
      what: "Actual demand or usage in period 1, counting from the oldest period entered.",
      tip: "The first period starts the level (S₁ = y₁), so avoid starting on an unusual period.",
      effect: "Changes the starting trend as well as the level and errors after it.",
      fig: "count",
      sym: "y1"
    },
    y2: {
      what: "Actual demand or usage in period 2, counting from the oldest period entered.",
      tip: "Use actual demand for period 2, not shipments cut short by stock-outs.",
      effect: "Changes the starting trend as well as the level and errors after it.",
      fig: "count",
      sym: "y2"
    },
    y3: {
      what: "Actual demand or usage in period 3, counting from the oldest period entered.",
      tip: "Use actual demand for period 3, not shipments cut short by stock-outs.",
      effect: "Changes the starting trend as well as the level and errors after it.",
      fig: "count",
      sym: "y3"
    },
    y4: {
      what: "Actual demand or usage in period 4, counting from the oldest period entered.",
      tip: "Use actual demand for period 4, not shipments cut short by stock-outs.",
      effect: "Changes the starting trend as well as the level and errors after it.",
      fig: "count",
      sym: "y4"
    },
    y5: {
      what: "Actual demand or usage in period 5, counting from the oldest period entered.",
      tip: "Use actual demand for period 5, not shipments cut short by stock-outs.",
      effect: "Changes the level, trend and forecast errors from this period on; recent periods weigh most.",
      fig: "count",
      sym: "y5"
    },
    y6: {
      what: "Actual demand or usage in period 6, counting from the oldest period entered.",
      tip: "Use actual demand for period 6, not shipments cut short by stock-outs.",
      effect: "Changes the level, trend and forecast errors from this period on; recent periods weigh most.",
      fig: "count",
      sym: "y6"
    },
    y7: {
      what: "Actual demand or usage in period 7, counting from the oldest period entered.",
      tip: "Use actual demand for period 7, not shipments cut short by stock-outs.",
      effect: "Changes the level, trend and forecast errors from this period on; recent periods weigh most.",
      fig: "count",
      sym: "y7"
    },
    y8: {
      what: "Actual demand or usage in period 8, counting from the oldest period entered.",
      tip: "Use actual demand for period 8, not shipments cut short by stock-outs.",
      effect: "Changes the level, trend and forecast errors from this period on; recent periods weigh most.",
      fig: "count",
      sym: "y8"
    },
    y9: {
      what: "Actual demand or usage in period 9, counting from the oldest period entered.",
      tip: "Use actual demand for period 9, not shipments cut short by stock-outs.",
      effect: "Changes the level, trend and forecast errors from this period on; recent periods weigh most.",
      fig: "count",
      sym: "y9"
    },
    y10: {
      what: "Actual demand or usage in period 10, counting from the oldest period entered.",
      tip: "Use actual demand for period 10, not shipments cut short by stock-outs.",
      effect: "Changes the level, trend and forecast errors from this period on; recent periods weigh most.",
      fig: "count",
      sym: "y10"
    },
    y11: {
      what: "Actual demand or usage in period 11, counting from the oldest period entered.",
      tip: "Use actual demand for period 11, not shipments cut short by stock-outs.",
      effect: "Changes the level, trend and forecast errors from this period on; recent periods weigh most.",
      fig: "count",
      sym: "y11"
    },
    y12: {
      what: "Actual demand or usage in period 12, counting from the oldest period entered.",
      tip: "Use actual demand for period 12, not shipments cut short by stock-outs.",
      effect: "Changes the level, trend and forecast errors from this period on; recent periods weigh most.",
      fig: "count",
      sym: "y12"
    }
  },
  "arrhenius-acceleration-check": {
    tu: {
      what: "The temperature at the failure site in normal service, such as the junction or the material temperature, not the room air.",
      tip: "Measure or estimate the part’s own temperature under typical load; a few degrees changes the factor noticeably.",
      effect: "A higher service temperature lowers the acceleration factor.",
      fig: "temperature",
      sym: "T₁"
    },
    ts: {
      what: "The temperature the parts are held at during the accelerated life test.",
      tip: "Stay below any temperature that changes the material or starts a different failure mode, such as a glass transition.",
      effect: "A higher test temperature raises the factor steeply.",
      fig: "temperature",
      sym: "T₂"
    },
    ea: {
      what: "The activation energy ΔH of the failure mechanism in electron volts, which sets how strongly its rate depends on temperature.",
      tip: "Use a value fitted from your own tests at two or more temperatures, or one published for the same mechanism and material.",
      effect: "The factor grows exponentially with it: check the sensitivity table.",
      fig: "factor",
      sym: "ΔH"
    },
    th: {
      what: "The hours each unit spends at the test temperature during the life test.",
      tip: "Count only time at the full test temperature, not warm-up or cool-down.",
      effect: "Equivalent service hours rise in proportion.",
      fig: "time",
      sym: "t"
    },
    life: {
      what: "The service life, in operating hours at the use temperature, that the test is meant to represent.",
      tip: "Take it from the product requirement or warranty period converted to operating hours.",
      effect: "Only moves the pass or fail line and the test hours needed.",
      fig: "time",
      sym: "L"
    }
  },
  "mtbf-confidence-bounds": {
    T: {
      what: "The total operating hours of all units in the record added together, counted to the end of the record rather than to the last failure.",
      tip: "Use hour meters or run logs; exclude idle and standby time unless failures happen then too.",
      effect: "More hours with the same failures raise the MTBF and both bounds in proportion.",
      fig: "time",
      sym: "T"
    },
    r: {
      what: "The number of failures recorded in those operating hours, counting each failure that needed a repair once.",
      tip: "Use a written failure definition and count only failures of the equipment itself, not operator errors.",
      effect: "More failures lower the MTBF but narrow the interval around it.",
      fig: "count",
      sym: "r"
    },
    conf: {
      what: "The confidence for the one-sided lower bound; the two-sided interval uses twice the remainder, so 95 % gives a 90 % interval.",
      tip: "Use the confidence named in the contract or specification; 80 %, 90 % and 95 % are common.",
      effect: "A higher confidence lowers the lower bound.",
      fig: "percent",
      sym: "C"
    },
    req: {
      what: "The mean time between failures the equipment must demonstrate, from a contract, specification or maintenance plan.",
      tip: "Make sure it uses the same failure definition and operating-hour basis as the record.",
      effect: "Only moves the pass or fail line and the further hours needed.",
      fig: "time",
      sym: "MTBF"
    }
  },
  "reliability-growth-check": {
    T: {
      what: "The total test hours when the growth test stopped, at or after the last failure.",
      tip: "Use the same test clock as the failure times; the test should stop at a planned time, not at a failure.",
      effect: "A longer failure-free end of test raises the growth estimate and the end-of-test MTBF.",
      fig: "time",
      sym: "T"
    },
    r: {
      what: "How many of the failure times listed below are used, from the first; at least two are needed.",
      tip: "Enter every relevant failure in the test; leaving failures out overstates the MTBF.",
      effect: "More failures narrow the confidence limits.",
      fig: "count",
      sym: "r"
    },
    conf: {
      what: "The confidence for the one-sided lower limit on the end-of-test MTBF; the upper limit pairs with it as a two-sided interval at twice the remainder.",
      tip: "NIST’s case study uses 90 %, giving an 80 % two-sided interval.",
      effect: "A higher confidence lowers the lower limit.",
      fig: "percent",
      sym: "C"
    },
    goal: {
      what: "The mean time between failures the equipment must reach, from a specification or development plan.",
      tip: "Use the same failure definition as the test records.",
      effect: "Only moves the pass or fail line and the projected test hours.",
      fig: "time",
      sym: "MTBF"
    },
    t1: {
      what: "Cumulative test hours on the test clock when failure 1 occurred, counted from the start of the growth test.",
      tip: "Record the test-clock hours at each failure, not calendar dates; count every relevant failure, fixed or not.",
      effect: "Earlier failures with long gaps later raise the growth slope and the MTBF at the end of the test.",
      fig: "time",
      sym: "t1"
    },
    t2: {
      what: "Cumulative test hours on the test clock when failure 2 occurred, counted from the start of the growth test.",
      tip: "Must be at or after failure 1’s time; use the same clock for every failure.",
      effect: "Earlier failures with long gaps later raise the growth slope and the MTBF at the end of the test.",
      fig: "time",
      sym: "t2"
    },
    t3: {
      what: "Cumulative test hours on the test clock when failure 3 occurred, counted from the start of the growth test.",
      tip: "Must be at or after failure 2’s time; use the same clock for every failure.",
      effect: "Earlier failures with long gaps later raise the growth slope and the MTBF at the end of the test.",
      fig: "time",
      sym: "t3"
    },
    t4: {
      what: "Cumulative test hours on the test clock when failure 4 occurred, counted from the start of the growth test.",
      tip: "Must be at or after failure 3’s time; use the same clock for every failure.",
      effect: "Earlier failures with long gaps later raise the growth slope and the MTBF at the end of the test.",
      fig: "time",
      sym: "t4"
    },
    t5: {
      what: "Cumulative test hours on the test clock when failure 5 occurred, counted from the start of the growth test.",
      tip: "Must be at or after failure 4’s time; use the same clock for every failure.",
      effect: "Earlier failures with long gaps later raise the growth slope and the MTBF at the end of the test.",
      fig: "time",
      sym: "t5"
    },
    t6: {
      what: "Cumulative test hours on the test clock when failure 6 occurred, counted from the start of the growth test.",
      tip: "Must be at or after failure 5’s time; use the same clock for every failure.",
      effect: "Earlier failures with long gaps later raise the growth slope and the MTBF at the end of the test.",
      fig: "time",
      sym: "t6"
    },
    t7: {
      what: "Cumulative test hours on the test clock when failure 7 occurred, counted from the start of the growth test.",
      tip: "Must be at or after failure 6’s time; use the same clock for every failure.",
      effect: "Earlier failures with long gaps later raise the growth slope and the MTBF at the end of the test.",
      fig: "time",
      sym: "t7"
    },
    t8: {
      what: "Cumulative test hours on the test clock when failure 8 occurred, counted from the start of the growth test.",
      tip: "Must be at or after failure 7’s time; use the same clock for every failure.",
      effect: "Earlier failures with long gaps later raise the growth slope and the MTBF at the end of the test.",
      fig: "time",
      sym: "t8"
    },
    t9: {
      what: "Cumulative test hours on the test clock when failure 9 occurred, counted from the start of the growth test.",
      tip: "Must be at or after failure 8’s time; use the same clock for every failure.",
      effect: "Earlier failures with long gaps later raise the growth slope and the MTBF at the end of the test.",
      fig: "time",
      sym: "t9"
    },
    t10: {
      what: "Cumulative test hours on the test clock when failure 10 occurred, counted from the start of the growth test.",
      tip: "Must be at or after failure 9’s time; use the same clock for every failure.",
      effect: "Earlier failures with long gaps later raise the growth slope and the MTBF at the end of the test.",
      fig: "time",
      sym: "t10"
    },
    t11: {
      what: "Cumulative test hours on the test clock when failure 11 occurred, counted from the start of the growth test.",
      tip: "Must be at or after failure 10’s time; use the same clock for every failure.",
      effect: "Earlier failures with long gaps later raise the growth slope and the MTBF at the end of the test.",
      fig: "time",
      sym: "t11"
    },
    t12: {
      what: "Cumulative test hours on the test clock when failure 12 occurred, counted from the start of the growth test.",
      tip: "Must be at or after failure 11’s time; use the same clock for every failure.",
      effect: "Earlier failures with long gaps later raise the growth slope and the MTBF at the end of the test.",
      fig: "time",
      sym: "t12"
    },
    t13: {
      what: "Cumulative test hours on the test clock when failure 13 occurred, counted from the start of the growth test.",
      tip: "Must be at or after failure 12’s time; use the same clock for every failure.",
      effect: "Earlier failures with long gaps later raise the growth slope and the MTBF at the end of the test.",
      fig: "time",
      sym: "t13"
    },
    t14: {
      what: "Cumulative test hours on the test clock when failure 14 occurred, counted from the start of the growth test.",
      tip: "Must be at or after failure 13’s time; use the same clock for every failure.",
      effect: "Earlier failures with long gaps later raise the growth slope and the MTBF at the end of the test.",
      fig: "time",
      sym: "t14"
    },
    t15: {
      what: "Cumulative test hours on the test clock when failure 15 occurred, counted from the start of the growth test.",
      tip: "Must be at or after failure 14’s time; use the same clock for every failure.",
      effect: "Earlier failures with long gaps later raise the growth slope and the MTBF at the end of the test.",
      fig: "time",
      sym: "t15"
    }
  }
});
