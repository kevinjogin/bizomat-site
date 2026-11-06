// BIZOMAT Tools input guides: handbook80. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook80.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "ewma-chart-check": {
    target: {
      what: "The mean of the process when it was in control, used as the starting EWMA value and the centre line of the chart.",
      tip: "Take it from at least 20 to 25 historical readings from a stable period, or use the nominal if the process is centred on it.",
      effect: "Moves the centre line and both limits up or down by the same amount.",
      fig: "number",
      sym: "EWMA₀"
    },
    s: {
      what: "The standard deviation of the historical in-control readings, which sets how far apart the limits are.",
      tip: "Calculate it from the same stable period as the target; data containing a shift give limits that are too wide.",
      effect: "The limits widen in proportion; a larger value makes signals rarer.",
      fig: "tolerance",
      sym: "s"
    },
    lam: {
      what: "The weight given to the newest reading in the moving average, between 0 and 1; older readings get geometrically less.",
      tip: "NIST notes 0.2 to 0.3 are usual; use a smaller value to find smaller shifts.",
      effect: "A smaller weight narrows the limits and smooths more, finding small shifts but reacting slowly to large ones.",
      fig: "factor",
      sym: "λ"
    },
    L: {
      what: "How many standard deviations of the EWMA the control limits sit above and below the centre line.",
      tip: "Three is common; narrower limits give earlier signals and more false alarms.",
      effect: "The limits move out in proportion.",
      fig: "factor",
      sym: "k"
    },
    n: {
      what: "How many of the readings listed below are charted, counting from the first reading in time order.",
      tip: "Enter readings from the oldest; unused fields at the end are ignored.",
      effect: "Readings beyond this count are ignored.",
      fig: "count",
      sym: "n"
    },
    x1: {
      what: "Measurement number 1 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Enter the first reading taken; the order matters because each new value builds on the ones before.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y1"
    },
    x2: {
      what: "Measurement number 2 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 2 must be the one taken after reading 1.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y2"
    },
    x3: {
      what: "Measurement number 3 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 3 must be the one taken after reading 2.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y3"
    },
    x4: {
      what: "Measurement number 4 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 4 must be the one taken after reading 3.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y4"
    },
    x5: {
      what: "Measurement number 5 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 5 must be the one taken after reading 4.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y5"
    },
    x6: {
      what: "Measurement number 6 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 6 must be the one taken after reading 5.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y6"
    },
    x7: {
      what: "Measurement number 7 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 7 must be the one taken after reading 6.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y7"
    },
    x8: {
      what: "Measurement number 8 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 8 must be the one taken after reading 7.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y8"
    },
    x9: {
      what: "Measurement number 9 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 9 must be the one taken after reading 8.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y9"
    },
    x10: {
      what: "Measurement number 10 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 10 must be the one taken after reading 9.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y10"
    },
    x11: {
      what: "Measurement number 11 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 11 must be the one taken after reading 10.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y11"
    },
    x12: {
      what: "Measurement number 12 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 12 must be the one taken after reading 11.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y12"
    },
    x13: {
      what: "Measurement number 13 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 13 must be the one taken after reading 12.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y13"
    },
    x14: {
      what: "Measurement number 14 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 14 must be the one taken after reading 13.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y14"
    },
    x15: {
      what: "Measurement number 15 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 15 must be the one taken after reading 14.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y15"
    },
    x16: {
      what: "Measurement number 16 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 16 must be the one taken after reading 15.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y16"
    },
    x17: {
      what: "Measurement number 17 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 17 must be the one taken after reading 16.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y17"
    },
    x18: {
      what: "Measurement number 18 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 18 must be the one taken after reading 17.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y18"
    },
    x19: {
      what: "Measurement number 19 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 19 must be the one taken after reading 18.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y19"
    },
    x20: {
      what: "Measurement number 20 in the order the readings were taken, one value of the characteristic being charted.",
      tip: "Keep the time order: reading 20 must be the one taken after reading 19.",
      effect: "Moves the EWMA towards this value by the weighting factor; a run of high or low values carries it across a limit.",
      fig: "number",
      sym: "Y20"
    }
  },
  "cusum-chart-check": {
    mu0: {
      what: "The mean the process should run at when in control, the value the cumulative sums measure departures from.",
      tip: "Use the target or the mean of a stable historical period.",
      effect: "Readings above it build the upper sum and readings below it build the lower sum.",
      fig: "number",
      sym: "μ₀"
    },
    sx: {
      what: "The standard deviation of the values being plotted: of single readings, or of subgroup means if you plot means.",
      tip: "For subgroup means it is the process standard deviation divided by the square root of the subgroup size.",
      effect: "Sets the reference value k with the shift to detect; a larger value lets bigger departures pass without adding to the sums.",
      fig: "tolerance",
      sym: "σ"
    },
    delta: {
      what: "The size of the shift in the mean you want to detect quickly, in standard deviations of the plotted values.",
      tip: "One standard deviation is a common choice; CUSUM charts are best at shifts of about 0.5 to 2.",
      effect: "Raises the reference value k, so the sums grow only for larger departures.",
      fig: "factor",
      sym: "δ"
    },
    h: {
      what: "The decision interval: a sum above this value signals that the process mean has shifted, in the same units as the readings.",
      tip: "Choose it with the shift to detect from your chart design or the average run length tables, not by trial on the data.",
      effect: "A larger interval gives fewer false alarms but later signals.",
      fig: "tolerance",
      sym: "h"
    },
    n: {
      what: "How many of the values listed below are used, counting from the first in time order.",
      tip: "Enter values from the oldest; unused fields at the end are ignored.",
      effect: "Values beyond this count are ignored.",
      fig: "count",
      sym: "n"
    },
    x1: {
      what: "Reading or subgroup mean number 1 in time order, in the same units as the target.",
      tip: "Enter the first value taken; the order matters because each new value builds on the ones before.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x1"
    },
    x2: {
      what: "Reading or subgroup mean number 2 in time order, in the same units as the target.",
      tip: "Keep the time order: value 2 must be the one taken after value 1.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x2"
    },
    x3: {
      what: "Reading or subgroup mean number 3 in time order, in the same units as the target.",
      tip: "Keep the time order: value 3 must be the one taken after value 2.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x3"
    },
    x4: {
      what: "Reading or subgroup mean number 4 in time order, in the same units as the target.",
      tip: "Keep the time order: value 4 must be the one taken after value 3.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x4"
    },
    x5: {
      what: "Reading or subgroup mean number 5 in time order, in the same units as the target.",
      tip: "Keep the time order: value 5 must be the one taken after value 4.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x5"
    },
    x6: {
      what: "Reading or subgroup mean number 6 in time order, in the same units as the target.",
      tip: "Keep the time order: value 6 must be the one taken after value 5.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x6"
    },
    x7: {
      what: "Reading or subgroup mean number 7 in time order, in the same units as the target.",
      tip: "Keep the time order: value 7 must be the one taken after value 6.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x7"
    },
    x8: {
      what: "Reading or subgroup mean number 8 in time order, in the same units as the target.",
      tip: "Keep the time order: value 8 must be the one taken after value 7.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x8"
    },
    x9: {
      what: "Reading or subgroup mean number 9 in time order, in the same units as the target.",
      tip: "Keep the time order: value 9 must be the one taken after value 8.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x9"
    },
    x10: {
      what: "Reading or subgroup mean number 10 in time order, in the same units as the target.",
      tip: "Keep the time order: value 10 must be the one taken after value 9.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x10"
    },
    x11: {
      what: "Reading or subgroup mean number 11 in time order, in the same units as the target.",
      tip: "Keep the time order: value 11 must be the one taken after value 10.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x11"
    },
    x12: {
      what: "Reading or subgroup mean number 12 in time order, in the same units as the target.",
      tip: "Keep the time order: value 12 must be the one taken after value 11.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x12"
    },
    x13: {
      what: "Reading or subgroup mean number 13 in time order, in the same units as the target.",
      tip: "Keep the time order: value 13 must be the one taken after value 12.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x13"
    },
    x14: {
      what: "Reading or subgroup mean number 14 in time order, in the same units as the target.",
      tip: "Keep the time order: value 14 must be the one taken after value 13.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x14"
    },
    x15: {
      what: "Reading or subgroup mean number 15 in time order, in the same units as the target.",
      tip: "Keep the time order: value 15 must be the one taken after value 14.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x15"
    },
    x16: {
      what: "Reading or subgroup mean number 16 in time order, in the same units as the target.",
      tip: "Keep the time order: value 16 must be the one taken after value 15.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x16"
    },
    x17: {
      what: "Reading or subgroup mean number 17 in time order, in the same units as the target.",
      tip: "Keep the time order: value 17 must be the one taken after value 16.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x17"
    },
    x18: {
      what: "Reading or subgroup mean number 18 in time order, in the same units as the target.",
      tip: "Keep the time order: value 18 must be the one taken after value 17.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x18"
    },
    x19: {
      what: "Reading or subgroup mean number 19 in time order, in the same units as the target.",
      tip: "Keep the time order: value 19 must be the one taken after value 18.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x19"
    },
    x20: {
      what: "Reading or subgroup mean number 20 in time order, in the same units as the target.",
      tip: "Keep the time order: value 20 must be the one taken after value 19.",
      effect: "A value above the target plus k adds to the upper sum; one below the target minus k adds to the lower sum.",
      fig: "number",
      sym: "x20"
    }
  },
  "c-chart-check": {
    k: {
      what: "How many of the inspection units listed below are used for the chart, counting from the first in time order.",
      tip: "Use 20 to 25 units for settled limits; twelve gives a first look.",
      effect: "Units beyond this count are ignored.",
      fig: "count",
      sym: "k"
    },
    L: {
      what: "How many standard deviations the control limits sit above and below the average count.",
      tip: "Three is usual (NIST notes k is often 3).",
      effect: "The limits move out in proportion to the square root of the average count.",
      fig: "factor",
      sym: "k"
    },
    c1: {
      what: "The number of defects (nonconformities) counted on inspection unit 1, such as blemishes on a panel or faults on an assembly.",
      tip: "Count every defect on unit 1, using the same inspection unit size and method as the other units.",
      effect: "Raises the average count and the limits slightly; a count above the upper limit signals a special cause.",
      fig: "count",
      sym: "c1"
    },
    c2: {
      what: "The number of defects (nonconformities) counted on inspection unit 2, such as blemishes on a panel or faults on an assembly.",
      tip: "Count every defect on unit 2, using the same inspection unit size and method as the other units.",
      effect: "Raises the average count and the limits slightly; a count above the upper limit signals a special cause.",
      fig: "count",
      sym: "c2"
    },
    c3: {
      what: "The number of defects (nonconformities) counted on inspection unit 3, such as blemishes on a panel or faults on an assembly.",
      tip: "Count every defect on unit 3, using the same inspection unit size and method as the other units.",
      effect: "Raises the average count and the limits slightly; a count above the upper limit signals a special cause.",
      fig: "count",
      sym: "c3"
    },
    c4: {
      what: "The number of defects (nonconformities) counted on inspection unit 4, such as blemishes on a panel or faults on an assembly.",
      tip: "Count every defect on unit 4, using the same inspection unit size and method as the other units.",
      effect: "Raises the average count and the limits slightly; a count above the upper limit signals a special cause.",
      fig: "count",
      sym: "c4"
    },
    c5: {
      what: "The number of defects (nonconformities) counted on inspection unit 5, such as blemishes on a panel or faults on an assembly.",
      tip: "Count every defect on unit 5, using the same inspection unit size and method as the other units.",
      effect: "Raises the average count and the limits slightly; a count above the upper limit signals a special cause.",
      fig: "count",
      sym: "c5"
    },
    c6: {
      what: "The number of defects (nonconformities) counted on inspection unit 6, such as blemishes on a panel or faults on an assembly.",
      tip: "Count every defect on unit 6, using the same inspection unit size and method as the other units.",
      effect: "Raises the average count and the limits slightly; a count above the upper limit signals a special cause.",
      fig: "count",
      sym: "c6"
    },
    c7: {
      what: "The number of defects (nonconformities) counted on inspection unit 7, such as blemishes on a panel or faults on an assembly.",
      tip: "Count every defect on unit 7, using the same inspection unit size and method as the other units.",
      effect: "Raises the average count and the limits slightly; a count above the upper limit signals a special cause.",
      fig: "count",
      sym: "c7"
    },
    c8: {
      what: "The number of defects (nonconformities) counted on inspection unit 8, such as blemishes on a panel or faults on an assembly.",
      tip: "Count every defect on unit 8, using the same inspection unit size and method as the other units.",
      effect: "Raises the average count and the limits slightly; a count above the upper limit signals a special cause.",
      fig: "count",
      sym: "c8"
    },
    c9: {
      what: "The number of defects (nonconformities) counted on inspection unit 9, such as blemishes on a panel or faults on an assembly.",
      tip: "Count every defect on unit 9, using the same inspection unit size and method as the other units.",
      effect: "Raises the average count and the limits slightly; a count above the upper limit signals a special cause.",
      fig: "count",
      sym: "c9"
    },
    c10: {
      what: "The number of defects (nonconformities) counted on inspection unit 10, such as blemishes on a panel or faults on an assembly.",
      tip: "Count every defect on unit 10, using the same inspection unit size and method as the other units.",
      effect: "Raises the average count and the limits slightly; a count above the upper limit signals a special cause.",
      fig: "count",
      sym: "c10"
    },
    c11: {
      what: "The number of defects (nonconformities) counted on inspection unit 11, such as blemishes on a panel or faults on an assembly.",
      tip: "Count every defect on unit 11, using the same inspection unit size and method as the other units.",
      effect: "Raises the average count and the limits slightly; a count above the upper limit signals a special cause.",
      fig: "count",
      sym: "c11"
    },
    c12: {
      what: "The number of defects (nonconformities) counted on inspection unit 12, such as blemishes on a panel or faults on an assembly.",
      tip: "Count every defect on unit 12, using the same inspection unit size and method as the other units.",
      effect: "Raises the average count and the limits slightly; a count above the upper limit signals a special cause.",
      fig: "count",
      sym: "c12"
    }
  },
  "grubbs-outlier-check": {
    n: {
      what: "How many of the values listed below are tested, counting from the first.",
      tip: "The test needs at least three values; with fewer than about seven it rarely finds an outlier.",
      effect: "Values beyond this count are ignored; more values raise the critical value slightly.",
      fig: "count",
      sym: "N"
    },
    test: {
      what: "Whether to test the value furthest from the mean in either direction, or only the largest or only the smallest value.",
      tip: "Use a one-sided test only if you decided before seeing the data that only high (or low) values matter.",
      effect: "A one-sided test uses a smaller critical value, so it flags an outlier more readily in that direction.",
      fig: "choice"
    },
    alpha: {
      what: "The chance of calling a value an outlier when the data contain none, the significance level of the test.",
      tip: "Five per cent is common; use 1 % when wrongly rejecting a good result is costly.",
      effect: "A smaller level raises the critical value, so fewer values are flagged.",
      fig: "percent",
      sym: "α"
    },
    x1: {
      what: "Measured value number 1 of the set being screened for an outlier, such as one replicate of a test result.",
      tip: "Enter value 1 as measured, before any rounding or correction you would not apply to the others.",
      effect: "Changes the mean and standard deviation; an extreme value raises the Grubbs statistic.",
      fig: "number",
      sym: "Y1"
    },
    x2: {
      what: "Measured value number 2 of the set being screened for an outlier, such as one replicate of a test result.",
      tip: "Enter value 2 as measured, before any rounding or correction you would not apply to the others.",
      effect: "Changes the mean and standard deviation; an extreme value raises the Grubbs statistic.",
      fig: "number",
      sym: "Y2"
    },
    x3: {
      what: "Measured value number 3 of the set being screened for an outlier, such as one replicate of a test result.",
      tip: "Enter value 3 as measured, before any rounding or correction you would not apply to the others.",
      effect: "Changes the mean and standard deviation; an extreme value raises the Grubbs statistic.",
      fig: "number",
      sym: "Y3"
    },
    x4: {
      what: "Measured value number 4 of the set being screened for an outlier, such as one replicate of a test result.",
      tip: "Enter value 4 as measured, before any rounding or correction you would not apply to the others.",
      effect: "Changes the mean and standard deviation; an extreme value raises the Grubbs statistic.",
      fig: "number",
      sym: "Y4"
    },
    x5: {
      what: "Measured value number 5 of the set being screened for an outlier, such as one replicate of a test result.",
      tip: "Enter value 5 as measured, before any rounding or correction you would not apply to the others.",
      effect: "Changes the mean and standard deviation; an extreme value raises the Grubbs statistic.",
      fig: "number",
      sym: "Y5"
    },
    x6: {
      what: "Measured value number 6 of the set being screened for an outlier, such as one replicate of a test result.",
      tip: "Enter value 6 as measured, before any rounding or correction you would not apply to the others.",
      effect: "Changes the mean and standard deviation; an extreme value raises the Grubbs statistic.",
      fig: "number",
      sym: "Y6"
    },
    x7: {
      what: "Measured value number 7 of the set being screened for an outlier, such as one replicate of a test result.",
      tip: "Enter value 7 as measured, before any rounding or correction you would not apply to the others.",
      effect: "Changes the mean and standard deviation; an extreme value raises the Grubbs statistic.",
      fig: "number",
      sym: "Y7"
    },
    x8: {
      what: "Measured value number 8 of the set being screened for an outlier, such as one replicate of a test result.",
      tip: "Enter value 8 as measured, before any rounding or correction you would not apply to the others.",
      effect: "Changes the mean and standard deviation; an extreme value raises the Grubbs statistic.",
      fig: "number",
      sym: "Y8"
    },
    x9: {
      what: "Measured value number 9 of the set being screened for an outlier, such as one replicate of a test result.",
      tip: "Enter value 9 as measured, before any rounding or correction you would not apply to the others.",
      effect: "Changes the mean and standard deviation; an extreme value raises the Grubbs statistic.",
      fig: "number",
      sym: "Y9"
    },
    x10: {
      what: "Measured value number 10 of the set being screened for an outlier, such as one replicate of a test result.",
      tip: "Enter value 10 as measured, before any rounding or correction you would not apply to the others.",
      effect: "Changes the mean and standard deviation; an extreme value raises the Grubbs statistic.",
      fig: "number",
      sym: "Y10"
    },
    x11: {
      what: "Measured value number 11 of the set being screened for an outlier, such as one replicate of a test result.",
      tip: "Enter value 11 as measured, before any rounding or correction you would not apply to the others.",
      effect: "Changes the mean and standard deviation; an extreme value raises the Grubbs statistic.",
      fig: "number",
      sym: "Y11"
    },
    x12: {
      what: "Measured value number 12 of the set being screened for an outlier, such as one replicate of a test result.",
      tip: "Enter value 12 as measured, before any rounding or correction you would not apply to the others.",
      effect: "Changes the mean and standard deviation; an extreme value raises the Grubbs statistic.",
      fig: "number",
      sym: "Y12"
    }
  },
  "linear-calibration-check": {
    n: {
      what: "How many of the calibration standards listed below are used in the fit, counting from the first.",
      tip: "Use at least four standards spread over the working range; three leave only one degree of freedom.",
      effect: "Standards beyond this count are ignored; more standards narrow the interval.",
      fig: "count",
      sym: "n"
    },
    ystar: {
      what: "The new instrument reading you want to convert to a calibrated (true) value using the fitted line.",
      tip: "Read it under the same conditions as the standards were measured.",
      effect: "Moves the calibrated value; the interval is narrowest near the middle of the standards.",
      fig: "number",
      sym: "Y′"
    },
    conf: {
      what: "The confidence level of the calibration interval around the calibrated value.",
      tip: "Ninety-five per cent is usual for calibration certificates and uncertainty statements.",
      effect: "A higher confidence widens the interval.",
      fig: "choice"
    },
    tol: {
      what: "The largest half-width of the calibration interval you can accept, in the units of the reference values.",
      tip: "Set it from the tolerance of the measurement the instrument is used for, typically a quarter to a tenth of it.",
      effect: "Only moves the pass or fail line; the interval does not change.",
      fig: "tolerance"
    },
    r1: {
      what: "The certified (reference) value of calibration standard 1, the true value the instrument should read.",
      tip: "Take standard 1’s value from its calibration certificate, in the units you want the corrected readings in.",
      effect: "Sets where this standard sits on the calibration line; spreading the standards across the range narrows the interval.",
      fig: "number",
      sym: "X1"
    },
    r2: {
      what: "The certified (reference) value of calibration standard 2, the true value the instrument should read.",
      tip: "Take standard 2’s value from its calibration certificate, in the units you want the corrected readings in.",
      effect: "Sets where this standard sits on the calibration line; spreading the standards across the range narrows the interval.",
      fig: "number",
      sym: "X2"
    },
    r3: {
      what: "The certified (reference) value of calibration standard 3, the true value the instrument should read.",
      tip: "Take standard 3’s value from its calibration certificate, in the units you want the corrected readings in.",
      effect: "Sets where this standard sits on the calibration line; spreading the standards across the range narrows the interval.",
      fig: "number",
      sym: "X3"
    },
    r4: {
      what: "The certified (reference) value of calibration standard 4, the true value the instrument should read.",
      tip: "Take standard 4’s value from its calibration certificate, in the units you want the corrected readings in.",
      effect: "Sets where this standard sits on the calibration line; spreading the standards across the range narrows the interval.",
      fig: "number",
      sym: "X4"
    },
    r5: {
      what: "The certified (reference) value of calibration standard 5, the true value the instrument should read.",
      tip: "Take standard 5’s value from its calibration certificate, in the units you want the corrected readings in.",
      effect: "Sets where this standard sits on the calibration line; spreading the standards across the range narrows the interval.",
      fig: "number",
      sym: "X5"
    },
    r6: {
      what: "The certified (reference) value of calibration standard 6, the true value the instrument should read.",
      tip: "Take standard 6’s value from its calibration certificate, in the units you want the corrected readings in.",
      effect: "Sets where this standard sits on the calibration line; spreading the standards across the range narrows the interval.",
      fig: "number",
      sym: "X6"
    },
    r7: {
      what: "The certified (reference) value of calibration standard 7, the true value the instrument should read.",
      tip: "Take standard 7’s value from its calibration certificate, in the units you want the corrected readings in.",
      effect: "Sets where this standard sits on the calibration line; spreading the standards across the range narrows the interval.",
      fig: "number",
      sym: "X7"
    },
    r8: {
      what: "The certified (reference) value of calibration standard 8, the true value the instrument should read.",
      tip: "Take standard 8’s value from its calibration certificate, in the units you want the corrected readings in.",
      effect: "Sets where this standard sits on the calibration line; spreading the standards across the range narrows the interval.",
      fig: "number",
      sym: "X8"
    },
    y1: {
      what: "The instrument’s reading when measuring calibration standard 1.",
      tip: "Let the instrument settle before reading standard 1; average repeat readings if the display fluctuates.",
      effect: "Changes the fitted slope and intercept and the residual scatter, which sets the interval width.",
      fig: "number",
      sym: "Y1"
    },
    y2: {
      what: "The instrument’s reading when measuring calibration standard 2.",
      tip: "Let the instrument settle before reading standard 2; average repeat readings if the display fluctuates.",
      effect: "Changes the fitted slope and intercept and the residual scatter, which sets the interval width.",
      fig: "number",
      sym: "Y2"
    },
    y3: {
      what: "The instrument’s reading when measuring calibration standard 3.",
      tip: "Let the instrument settle before reading standard 3; average repeat readings if the display fluctuates.",
      effect: "Changes the fitted slope and intercept and the residual scatter, which sets the interval width.",
      fig: "number",
      sym: "Y3"
    },
    y4: {
      what: "The instrument’s reading when measuring calibration standard 4.",
      tip: "Let the instrument settle before reading standard 4; average repeat readings if the display fluctuates.",
      effect: "Changes the fitted slope and intercept and the residual scatter, which sets the interval width.",
      fig: "number",
      sym: "Y4"
    },
    y5: {
      what: "The instrument’s reading when measuring calibration standard 5.",
      tip: "Let the instrument settle before reading standard 5; average repeat readings if the display fluctuates.",
      effect: "Changes the fitted slope and intercept and the residual scatter, which sets the interval width.",
      fig: "number",
      sym: "Y5"
    },
    y6: {
      what: "The instrument’s reading when measuring calibration standard 6.",
      tip: "Let the instrument settle before reading standard 6; average repeat readings if the display fluctuates.",
      effect: "Changes the fitted slope and intercept and the residual scatter, which sets the interval width.",
      fig: "number",
      sym: "Y6"
    },
    y7: {
      what: "The instrument’s reading when measuring calibration standard 7.",
      tip: "Let the instrument settle before reading standard 7; average repeat readings if the display fluctuates.",
      effect: "Changes the fitted slope and intercept and the residual scatter, which sets the interval width.",
      fig: "number",
      sym: "Y7"
    },
    y8: {
      what: "The instrument’s reading when measuring calibration standard 8.",
      tip: "Let the instrument settle before reading standard 8; average repeat readings if the display fluctuates.",
      effect: "Changes the fitted slope and intercept and the residual scatter, which sets the interval width.",
      fig: "number",
      sym: "Y8"
    }
  },
  "exponential-smoothing-forecast": {
    n: {
      what: "How many of the demand periods listed below are used, counting from the oldest.",
      tip: "Use at least eight periods to judge the error and choose a smoothing constant.",
      effect: "Periods beyond this count are ignored.",
      fig: "count",
      sym: "n"
    },
    alpha: {
      what: "The smoothing constant: the weight given to the latest actual demand when updating the forecast, between 0 and 1.",
      tip: "Start with the best value the tool finds on your history, then round it; values of 0.1 to 0.3 suit steady demand.",
      effect: "A larger constant follows recent demand more closely but also follows random noise.",
      fig: "factor",
      sym: "α"
    },
    target: {
      what: "The largest root mean squared forecast error you accept, as a share of average demand over the periods used.",
      tip: "Set it from the safety stock or capacity buffer you are prepared to hold against forecast error.",
      effect: "Only moves the pass or fail line.",
      fig: "percent"
    },
    y1: {
      what: "Actual demand or usage in period 1, counting from the oldest period entered.",
      tip: "The first period also starts the smoothing (S₂ = y₁), so avoid starting on an unusual period.",
      effect: "Changes the smoothed values after it and the forecast errors; recent periods weigh most in the forecast.",
      fig: "count",
      sym: "y1"
    },
    y2: {
      what: "Actual demand or usage in period 2, counting from the oldest period entered.",
      tip: "Use actual demand for period 2, not shipments limited by stock-outs.",
      effect: "Changes the smoothed values after it and the forecast errors; recent periods weigh most in the forecast.",
      fig: "count",
      sym: "y2"
    },
    y3: {
      what: "Actual demand or usage in period 3, counting from the oldest period entered.",
      tip: "Use actual demand for period 3, not shipments limited by stock-outs.",
      effect: "Changes the smoothed values after it and the forecast errors; recent periods weigh most in the forecast.",
      fig: "count",
      sym: "y3"
    },
    y4: {
      what: "Actual demand or usage in period 4, counting from the oldest period entered.",
      tip: "Use actual demand for period 4, not shipments limited by stock-outs.",
      effect: "Changes the smoothed values after it and the forecast errors; recent periods weigh most in the forecast.",
      fig: "count",
      sym: "y4"
    },
    y5: {
      what: "Actual demand or usage in period 5, counting from the oldest period entered.",
      tip: "Use actual demand for period 5, not shipments limited by stock-outs.",
      effect: "Changes the smoothed values after it and the forecast errors; recent periods weigh most in the forecast.",
      fig: "count",
      sym: "y5"
    },
    y6: {
      what: "Actual demand or usage in period 6, counting from the oldest period entered.",
      tip: "Use actual demand for period 6, not shipments limited by stock-outs.",
      effect: "Changes the smoothed values after it and the forecast errors; recent periods weigh most in the forecast.",
      fig: "count",
      sym: "y6"
    },
    y7: {
      what: "Actual demand or usage in period 7, counting from the oldest period entered.",
      tip: "Use actual demand for period 7, not shipments limited by stock-outs.",
      effect: "Changes the smoothed values after it and the forecast errors; recent periods weigh most in the forecast.",
      fig: "count",
      sym: "y7"
    },
    y8: {
      what: "Actual demand or usage in period 8, counting from the oldest period entered.",
      tip: "Use actual demand for period 8, not shipments limited by stock-outs.",
      effect: "Changes the smoothed values after it and the forecast errors; recent periods weigh most in the forecast.",
      fig: "count",
      sym: "y8"
    },
    y9: {
      what: "Actual demand or usage in period 9, counting from the oldest period entered.",
      tip: "Use actual demand for period 9, not shipments limited by stock-outs.",
      effect: "Changes the smoothed values after it and the forecast errors; recent periods weigh most in the forecast.",
      fig: "count",
      sym: "y9"
    },
    y10: {
      what: "Actual demand or usage in period 10, counting from the oldest period entered.",
      tip: "Use actual demand for period 10, not shipments limited by stock-outs.",
      effect: "Changes the smoothed values after it and the forecast errors; recent periods weigh most in the forecast.",
      fig: "count",
      sym: "y10"
    },
    y11: {
      what: "Actual demand or usage in period 11, counting from the oldest period entered.",
      tip: "Use actual demand for period 11, not shipments limited by stock-outs.",
      effect: "Changes the smoothed values after it and the forecast errors; recent periods weigh most in the forecast.",
      fig: "count",
      sym: "y11"
    },
    y12: {
      what: "Actual demand or usage in period 12, counting from the oldest period entered.",
      tip: "Use actual demand for period 12, not shipments limited by stock-outs.",
      effect: "Changes the smoothed values after it and the forecast errors; recent periods weigh most in the forecast.",
      fig: "count",
      sym: "y12"
    }
  }
});
