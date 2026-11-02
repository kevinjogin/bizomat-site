---
book: production-leak-testing-by-the-numbers
chapterSlug: capability-and-control
order: 9
title: "Capability and control of a leak test"
description: "Why leak data are log-normal and mixed, why a Cpk misleads, p-charts of reject rates, charting the reference leak, what a customer audit can show, and a capability claim corrected."
draft: false
---

A leak test station produces two streams of data: a leak reading for every part, and a pass or fail decision. Both can be used to keep the process and the station under control, but only if they are treated for what they are. Leak readings are not normally distributed, the parts that leak are not the tail of the parts that do not, and a capability index that is meaningful for a machined diameter can be badly misleading for leaks. The decisions, counted per shift, are often the more useful signal.

This chapter looks at the shape of the OC-40's leak readings, shows why a capability index computed from them overstates the line's performance, charts the helium station's reject rate and its reference leak check, considers what a customer's incoming sample can verify, and finishes with a capability figure that had to be withdrawn from a customer report.

## The shape of leak data

Leak readings span many orders of magnitude, and their distribution is skewed: most parts cluster near the station's background, a few read higher, and a very few much higher. Taking logarithms makes the bulk of the distribution roughly symmetrical, which is why leak data are best plotted and analysed on a log scale.

Two further features make leak data unusual. The readings of tight parts are censored at the background: a cooler whose true leak is 10⁻⁸ mbar·L/s reads the same as one at 10⁻⁷, because both are buried in the station's background of a few times 10⁻⁶. And the leaking parts are not simply the far tail of the tight ones. A braze joint that did not fill, a crack, or a porous tank is a discrete defect, produced by a separate cause, and the leak it gives can sit anywhere on the scale. The population is a mixture: a large group of sound coolers at the background and a small group of defective ones spread above it.

```figure
type: compare
title: A month of OC-40 helium readings, about 13,000 coolers
cols: Share of coolers | What they are
rowhead: Reading, mbar·L/s of helium
- Below 1 × 10⁻⁵ | 98.6% | sound coolers, readings at or near the background
- 1 × 10⁻⁵ to 8.2 × 10⁻⁴ | 0.8% | mostly small braze defects; pass
- * 8.2 × 10⁻⁴ to 9.3 × 10⁻⁴, the guard band | 0.2% | marginal defects; rejected and repaired
- Above 9.3 × 10⁻⁴ | 0.4% | defects; rejected, located by sniffer and repaired or scrapped
caption: This is an illustration from the station's records, as summarised in Chapter 8.
```

## Why a Cpk misleads

The quality engineer, asked by the customer for a capability figure, first took the log₁₀ of the readings of a sample of coolers in subgroups of five, as for any variable characteristic. The average of the log readings was −5.2, about 6.3 × 10⁻⁶ mbar·L/s, and the average subgroup range was 0.58.

The [process capability check](/tools/process-capability-check/) takes exactly those inputs. With a grand average of −5.2, an average range of 0.58, a subgroup size of five, an upper specification limit of log₁₀(8.2 × 10⁻⁴) = −3.086 and a lower limit set far below, at −9, to stand in for a one-sided specification, it gives a process standard deviation of 0.249, a Cpk of 2.83 against the upper limit and a predicted fraction outside the limit of effectively zero parts per million. The tool's warning about centring belongs to the artificial lower limit and can be ignored; Cpk against the upper limit is the figure of interest.

```figure
type: stats
title: What the capability index said, and what the station saw
caption: This is an illustration. The normal model of the log readings describes the sound coolers well and the defective ones not at all.
- 2.83 | Cpk on log₁₀ readings against the 8.2 × 10⁻⁴ threshold
- about 0 ppm | predicted share above the threshold from the normal model
- 0.6% | actual share above the threshold in the month's records
- 6,000 ppm | the difference: defects that do not belong to the normal distribution
```

The figure describes the sound coolers accurately: their readings are far below the threshold and tightly grouped, mostly at the background. It says nothing about the defective coolers, which came from causes the normal model does not represent, and it would have told the customer that essentially no cooler exceeds the threshold when about six in every thousand did. A capability index on leak data measures the margin of the good population; the rate of defects must be measured by counting them.

## Counting rejects with a p-chart

A p-chart tracks the fraction of parts rejected in each sample of fixed size and compares it with control limits from the binomial distribution. It answers the question that matters most for a leak line: is the defect rate stable, or has something changed?

The [p-chart check](/tools/p-chart-check/) takes the number inspected in each sample and the defectives in up to ten samples. For ten shifts of 600 coolers each, with helium rejects of 2, 3, 2, 4, 3, 2, 5, 3, 11 and 1, it gives an average fraction rejected of 0.60%, control limits from 0% to 1.546%, and a signal at 10 or more rejects in a shift. Shift 9, with 11 rejects, is out of control.

```figure
type: bars
title: Helium rejects per shift of 600 coolers
unit: rejects
max: 12
caption: This is an illustration. Average 0.60%; upper control limit 1.546%, which is 9.3 rejects in 600, so 10 or more signal a special cause.
- Shift 1 | 2
- Shift 2 | 3
- Shift 3 | 2
- Shift 4 | 4
- Shift 5 | 3
- Shift 6 | 2
- Shift 7 | 5
- Shift 8 | 3
- * Shift 9 | 11
- Shift 10 | 1
```

The signal sent the quality engineer to the brazing furnace's records for the coolers tested in shift 9. Their braze cycle had run with the furnace's vacuum at about three times its normal pressure, from a door seal that had been damaged during loading, and the poorer vacuum had left oxide that stopped the filler from wetting some joints. The sniffer had located all eleven leaks at core joints, the pattern expected from a wetting fault. The furnace seal was replaced before the next load, and the p-chart returned to its usual pattern. The leak test had found the defects, as it should; the p-chart had found their cause. Without it, eleven rejects in a shift would have looked like a bad day, and the furnace would have gone on brazing with a damaged seal.

### The lower limit

With a 0.6% average and 600 coolers a shift, the lower control limit is zero, so the chart cannot show an improvement from a single good shift. Detecting a fall in the reject rate needs larger samples, such as a week's production, or a different chart. The line plots a weekly p-chart alongside the shift chart for that reason.

## Charting the station itself

The helium station's reference leak check, run at the start of every shift, gives a reading of a known leak, and charting it shows whether the station is stable. From the Type 1 study of Chapter 8, the reference leak reads a mean of 9.12 × 10⁻⁴ with a standard deviation of 0.32 × 10⁻⁴. On an individuals chart, its limits are 9.12 ± 3 × 0.32, from 8.16 to 10.08 × 10⁻⁴.

A reading outside those limits, or a run of readings drifting to one side, shows that the station's sensitivity has changed, from a detector needing tuning, a pumping fault or a change of timing like Chapter 7's. The line's rule is that a reference leak reading outside the limits stops the station until the cause is found and the readings since the last good check are reviewed. A reading inside the limits but outside ±5% of the certificate value prompts an internal recalibration of the detector before production starts.

## Where the leaks are

Counting rejects shows whether the defect rate is stable; locating them shows where to improve it. Every cooler the helium station rejects goes to the hydrogen sniffer, and the operator records the location of each leak found on a simple map of the cooler. A month's map is a Pareto chart of the line's leak causes.

```figure
type: bars
title: Location of leaks found in a month's rejected coolers
unit: %
max: 60
caption: This is an illustration. About 80 rejected coolers; one leak location recorded for each. The core's corner joints dominate, which pointed the brazing team at fit-up at the core's corners.
- * Core corner joints | 55
- Tank-to-header joints | 25
- Porosity in cast tanks | 15
- Fittings and threads | 5
```

More than half the leaks were at the core's corner joints, where the bars, plates and side sheets meet and the fit-up gaps are hardest to control. The brazing team added a fixture that clamps the corners during assembly, and over the next two months the corner share fell and the overall reject rate fell from 0.6% towards 0.4%, a change the weekly p-chart showed clearly. The leak test cannot make coolers tight; its records can show where they are not.

## Watching the pressure decay screen

The screen's control is different, because its main failure is false rejection from temperature, not escape. Its useful statistics are the reject rate and the share of rejects that pass the helium station without a leak being found. On the OC-40 line, the screen rejects about 0.3% of coolers, and about four in five of those turn out to have real gross leaks when sniffed; the rest are temperature-driven false rejects that pass on retest. A rise in the reject rate with a fall in the share confirmed by the sniffer is the signature of Chapter 4's warm coolers, and the screen's infrared check now reports the cooler temperatures alongside its decisions so that the cause shows in the same record.

The two stations also check each other. Every cooler the screen rejects as a gross leaker would also fail the helium test, and every gross leaker that reaches the helium chamber is one the screen missed. Counting the helium station's gross-leak events, the times its chamber is flooded, gives the screen's escape rate directly, without any extra testing.

## What a customer's sample can show

The customer audits incoming coolers by testing a random sample from each delivery in its own laboratory. The [acceptance sampling OC tool](/tools/sampling-oc/) shows what such a sample can and cannot detect. With 50 coolers sampled and none allowed to fail, a delivery in which 1% of coolers are out of specification is accepted 60.5% of the time, and one in which 0.1% are out of specification is accepted 95.1% of the time.

```figure
type: compare
title: What a 50-cooler audit with no failures allowed can detect
cols: Probability the delivery is accepted | What it means
rowhead: True share of coolers out of specification
- 1% | 60.5% | a badly failing station would often go unnoticed by one audit
- 0.1% | 95.1% | a small escape rate is essentially invisible to the audit
- 0.01% | about 99.5% | the level the 100% test is meant to achieve; no audit can confirm it
caption: This is an illustration. Binomial model, probability (1 − p)⁵⁰. Escape rates after a 100% test with a guard band are expected to be far below 0.1%.
```

A sample audit cannot confirm the very low escape rates that a 100% test with a guard band is designed to achieve. Its value lies elsewhere: it checks that the customer's and the supplier's measurements agree, which is how Chapter 8's guard band came about, and it detects a gross failure of the supplier's station. Confidence in a low escape rate comes from the supplier's control of its station, through its reference leak chart, its uncertainty budget and its records, not from the customer's sample.

## The mistake: a capability figure in a customer report

The quality engineer's first draft of the annual quality report to the customer quoted the Cpk of 2.83 as evidence that "the leak process is highly capable, with a predicted rate above the threshold of effectively zero". The reviewing manager, who had seen the station's monthly reject counts, asked how that could be true when the station rejected about one cooler in every 170.

```figure
type: steps
title: Replacing a capability index with counted rates
caption: This is an illustration. A capability index is valid for a stable, single population; leak data are a mixture of two.
- Draft claim | Cpk 2.83; predicted rate above the threshold effectively zero
- Review | the station rejects about 0.6% of coolers above the threshold every month
- Cause | the defective coolers are a separate population from discrete defects; the normal model fits only the sound ones
- * Report changed | defect rate reported from p-chart counts, 0.60% with control limits; Cpk reported only as the margin of the sound population
- Added | escape protection evidence: uncertainty budget, guard band, reference leak chart and retest rule
```

The capability figure was not wrong about what it measured; it was wrong about what it implied. The report was rewritten to give the counted reject rate, 0.60% with its p-chart limits, as the measure of the line's defect rate; to describe the Cpk only as the margin by which sound coolers clear the threshold; and to set out the evidence that rejected coolers do not escape, which is what the customer actually needed to know.

## Responding to a signal

A chart is only as useful as the response to it. The line's reaction plan, posted at both stations, sets out who does what when a chart signals. A shift p-chart signal stops nothing by itself, because the rejected coolers are already contained, but it starts an investigation within the shift: the sniffer locations of that shift's rejects are compared with the usual pattern, and the brazing furnace's and wash line's records for the coolers concerned are checked, as they were for shift 9. A reference leak signal stops the helium station immediately, because it questions every reading since the last good check. A screen signal, a rise in false rejects, sends the test engineer to the cooler temperatures and the buffer conveyor first. Each response, and what was found, is written on the chart beside the point that triggered it, so that the chart becomes a record of the line's problems and their causes rather than a sheet of dots.

## Exercise: a week's p-chart

For the weekly chart, the line uses samples of one week's production, about 6,000 coolers, with an average rejected fraction of 0.60%. Calculate the upper and lower control limits, and the reject counts that would signal a deterioration and an improvement. Then say whether a week with 22 rejects would signal an improvement.

### Answer

**Given:** n = 6,000; p̄ = 0.0060.

**Assumptions:** binomial counts; samples of equal size; a stable process at the average.

**Method:** limits p̄ ± 3 √(p̄ (1 − p̄) ÷ n).

**Standard deviation of p:** √(0.0060 × 0.9940 ÷ 6,000) = √(9.94 × 10⁻⁷) = 0.000997.

**Limits:** upper 0.0060 + 3 × 0.000997 = 0.00899, or 0.899%; lower 0.0060 − 0.00299 = 0.00301, or 0.301%.

**Counts:** upper 0.00899 × 6,000 = 53.9, so 54 or more rejects signal a deterioration; lower 0.00301 × 6,000 = 18.1, so 18 or fewer signal an improvement.

**A week with 22 rejects:** 22 ÷ 6,000 = 0.37%, above the lower limit of 0.301%. It does not signal an improvement on its own; several weeks below the centre line would be needed, or a run rule.

**Verification:** the weekly chart's limits are √10 = 3.16 times closer to the centre line in proportion than the shift chart's, because the sample is ten times larger: the shift chart's 3σ width, 0.946 percentage points, divided by 3.16 gives 0.299, matching 0.0060 − 0.00301.
