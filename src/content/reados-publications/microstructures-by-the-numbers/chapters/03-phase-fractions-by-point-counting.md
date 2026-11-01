---
book: microstructures-by-the-numbers
chapterSlug: phase-fractions-by-point-counting
order: 3
title: "Phase fractions by point counting"
description: "Estimating the volume fraction of a phase by counting grid points, its standard error from field-to-field scatter, the number of fields needed, and image analysis thresholds."
draft: false
---

How much pearlite is in the matrix of a ductile iron, how much ferrite in a duplex stainless steel, how much retained austenite or martensite in a heat-treated part: these are volume fractions, and Chapter 1 showed that a section gives them without bias. The quickest way to measure one by eye is to lay a grid of points over each field and count how many fall in the phase. The method is old, simple and still the reference against which image analysis is checked.

This chapter covers point counting, the matrix and total fractions, the standard error of the result and the number of fields needed to reach a chosen precision. Its error is a confidence interval that was too narrow because the points were not independent.

## Counting points

A point grid is a transparent overlay, or a set of crosses drawn by the camera software, with a fixed number of points per field, commonly 16, 25, 49 or 100 in a square array. For each field the technician counts the points that fall in the phase of interest. A point that falls exactly on a boundary is counted as half. The point fraction P_P, the number of hits divided by the number of points laid, is the estimate of the volume fraction.

Counting points is quicker than tracing areas, needs no software and gives each field a simple count that can be checked by someone else on the same image. It also makes the error easy to state, because each point is a yes-or-no observation, as long as the points are spaced so that they behave as independent observations, which is the subject of the error later in this chapter.

### Matrix fraction and total fraction

The pump casing's drawing limits pearlite to 40% **of the matrix**, the metal around the graphite. Graphite nodules occupy about 9% of the section, so the distinction matters. A point that lands on a nodule is neither ferrite nor pearlite; it is left out of the matrix count.

On the main wall specimen the technician counted until 500 points had fallen in the matrix. That took 22 fields of 25 points, 550 points laid in all, of which 50 fell on graphite. Of the 500 matrix points, 160 fell in pearlite.

```figure
type: formula
title: Point fraction and its simplest standard error
formula: P_P = hits ÷ points     SE ≈ √[P_P (1 − P_P) ÷ N]   (only if every point is an independent observation)
caption: The binomial standard error is a lower bound on the real error. It is correct only when the points are far enough apart that each is a separate chance observation; otherwise the field-to-field scatter must be used, as the rest of this chapter shows.
- P_P | point fraction, the estimate of the volume fraction
- N | number of points counted in the reference phase or region
- hits | points falling in the phase being measured
step: Pearlite in the matrix: P_P = 160 ÷ 500 = 0.320; binomial SE = √(0.32 × 0.68 ÷ 500) = 0.0209
step: Pearlite in the whole section: 160 ÷ 550 = 0.291; graphite in the section: 50 ÷ 550 = 0.091
```

The two fractions answer different questions. The matrix fraction, 0.320, is what the drawing limits and what controls the strength and hardness of the matrix. The total fraction, 0.291, is what a volume-based calculation such as a density or a property mixture would use. A report should name which it gives.

## The error that matters: field-to-field scatter

The binomial standard error treats every point as a separate coin toss. Points in the same field are not: a pearlite colony in a ductile iron can be a few tenths of a millimetre across, so two neighbouring points often fall in the same colony, and if one hits pearlite the other probably does too. Fields also differ for real reasons, such as local cooling rate or segregation. Both effects make the scatter between fields larger than the binomial model predicts.

The robust approach treats each field as one observation. Compute the pearlite fraction of the matrix points in each field, then the mean and standard deviation of those field values. The standard error of the mean is the field standard deviation divided by the square root of the number of fields, and a confidence interval uses Student's t with one fewer degrees of freedom than fields.

For the wall specimen, the 22 field fractions had a mean of 0.320 and a standard deviation of 0.090.

```figure
type: stats
title: Pearlite fraction of the matrix, main wall specimen
caption: This is an illustration. Twenty-two fields of 25 points. The field-based standard error, 0.0192, is close to the binomial one, 0.0209, because the 0.2 mm grid spacing is coarse compared with the pearlite colonies. That agreement is the check that the points behaved as independent observations.
- 0.320 | mean pearlite fraction of the matrix
- 0.090 | standard deviation between fields
- 0.0192 | standard error of the mean, 0.090 ÷ √22
- 0.280 to 0.360 | 95% confidence interval, using t = 2.080 for 21 degrees of freedom
```

The upper end of the interval, 0.360, is below the drawing's limit of 0.40, so the wall passes with a clear margin. Had the interval straddled the limit, the result would not have shown either a pass or a fail, and the right response would be more fields or another specimen, not a decision by rounding.

### When the two estimates agree, and when they do not

Comparing the binomial and field-based standard errors is a useful diagnostic. If they are similar, the points are effectively independent and the binomial formula can be used for planning. If the field-based error is much larger, either the points are too close together or the structure varies across the specimen. The first is cured by a coarser grid; the second is a real property of the part, and needs more fields, more specimens or a separate result for each region.

## Lines and areas instead of points

Point counting is one of three equivalent ways of measuring a fraction. **Lineal analysis** lays test lines across each field and measures the total length lying in the phase; the length fraction L_L estimates the volume fraction just as P_P does. **Areal analysis** traces or thresholds the phase and measures its area fraction A_A directly. All three are unbiased, and on the same fields they converge on the same value. They differ in effort and in precision per hour of work.

For coarse, compact phases, such as graphite nodules or large ferrite grains, point counting is usually the most efficient by hand, because each point is a quick yes-or-no decision and a coarse grid avoids redundant points. For fine, interconnected phases, such as pearlite in a fine ferrite–pearlite steel, line or area methods capture more of the structure per field, but by hand they are slow, and they are now almost always done by image analysis. A useful working arrangement, and the one Plant P adopted, is image analysis for the routine numbers and manual point counting on a few fields as the independent check that the threshold is right.

Whichever method is used, the precision is governed by the same thing: how much the phase fraction varies from field to field and how many fields are measured. Measuring each field more exactly does not help once that variation dominates.

## How many fields?

To plan the next measurement, the laboratory needs the number of fields that will give a chosen margin of error. The [sample size for a mean tool](/tools/sample-size-mean/) gives the minimum number of measurements needed to estimate a mean within a chosen margin at a chosen confidence, from an expected standard deviation, with an optional correction for a small finite population. Here the measurements are field fractions and the standard deviation is the field-to-field value from a pilot measurement.

With a field standard deviation of 0.09, a margin of ±0.03 at 95% confidence needs **35** fields; the tool shows 34.57 before rounding up. A margin of ±0.02 needs **78**. Halving the margin roughly quadruples the effort, because the margin shrinks only with the square root of the number of fields. The tool uses the normal z value, 1.96, rather than Student's t; for planning purposes with more than about 20 fields the difference is small, and the result can be checked with t once the data are in.

```figure
type: bars
title: Fields needed for a pearlite fraction, 95% confidence
unit: fields
caption: From the sample size for a mean tool with a field standard deviation of 0.09. Each halving of the margin multiplies the fields by about four. A margin of ±0.03 is enough to judge a 0.40 limit when the expected value is near 0.32; a value near the limit needs the tighter margins.
- Margin ±0.05 | 13
- * Margin ±0.03 | 35
- Margin ±0.02 | 78
- Margin ±0.01 | 312
```

### Points per field and grid spacing

More points per field cost little extra time but add little information once neighbouring points start to fall in the same feature. A sensible grid has a spacing at least as large as the typical size of the features being counted, so that two points rarely land in the same colony, grain or particle, and enough points that each field gives a few hits on the phase. ASTM E562 gives guidance on choosing grid sizes and the number of fields for manual point counting; a laboratory working to it should follow its procedure rather than the rules of thumb here.

For a minor phase, such as 2% of retained austenite, most points miss and the hits per field are few. The relative error is then large unless the total number of points is large: for a fraction of 0.02 and independent points, a relative standard error of 10% needs P_P (1 − P_P) ÷ N = (0.002)², or about 4,900 points. Minor phases are where image analysis, which measures every pixel, earns its place.

## Image analysis and the threshold

Image analysis software measures area fractions by classifying every pixel of a field as one phase or another, usually by setting a grey-level or colour threshold. It is fast and tireless, but its answer depends on where the threshold is set, and the boundary between a dark pearlite colony and lighter ferrite is not sharp: the lamellae within pearlite are finer than the pixels, and etching shades boundaries. Moving the threshold by a few grey levels moves pixels at every boundary from one phase to the other.

Plant P's technician checked the sensitivity on five wall fields. With the threshold at the value set by the software's automatic method, the pearlite fraction of the matrix was 0.33; moving it two grey levels either way gave 0.30 and 0.35. The manual point count on the same five fields gave 0.32. The laboratory now sets the threshold on a reference image whose fraction has been established by careful point counting, checks it against that reference at the start of each session, and reports the threshold with the result.

```figure
type: checklist
title: Plant P's checks before trusting an image-analysis phase fraction
caption: This is an illustration. Image analysis removes counting fatigue but adds threshold and preparation sensitivity. These checks keep it honest.
- x Scale calibrated with the stage micrometer | per objective, monthly
- x Etch and illumination standardised | same etchant, time and lamp setting
- x Threshold set on the reference image | point-counted reference, fraction known
- x Threshold sensitivity checked | ±2 grey levels changes pearlite by about ±0.03
- x Graphite excluded from the matrix | separate threshold on the unetched image
- ? Software method validated against manual counts for a new material | to do for the new supplier's iron
```

## The error: a confidence interval that was too narrow

Some months later a batch from a second foundry gave a pearlite fraction close to the limit. To be thorough, the technician used a finer grid of 100 points per field, 0.1 mm apart, on 22 fields, 2,200 matrix points in all, and found a point fraction of 0.370. The binomial standard error was √(0.37 × 0.63 ÷ 2,200) = 0.0103, giving a 95% interval of 0.370 ± 0.020, or 0.350 to 0.390, and the report recorded a pass.

The engineer recomputed the interval from the field values. Their standard deviation was 0.085, so the standard error was 0.085 ÷ √22 = 0.0181, 1.76 times the binomial figure, and the 95% interval was 0.370 ± 0.038, or 0.332 to **0.408**. The upper end lay above the 0.40 limit. With 0.1 mm spacing, many neighbouring points had fallen in the same pearlite colony, so the 2,200 points carried about as much information as 710 independent ones. Quadrupling the points per field had cost four times the counting and bought almost nothing.

The laboratory measured 40 more fields from a second specimen with the 25-point grid at 0.2 mm spacing. The combined result from all 62 fields was 0.366 with a field standard deviation of 0.10, giving an upper 95% limit of 0.366 + 2.00 × 0.10 ÷ √62 = 0.391, a pass with a small margin, and the supplier was asked to look at its cooling practice. The procedure was changed to require the field-based standard error in every report, with the binomial value shown only as a check.

## How this applies to a small Australian business

When a report gives a phase fraction against a limit, ask for the number of fields, the field-to-field standard deviation and the confidence interval, and look at whether the interval clears the limit. A result close to a limit with no interval is not a pass or a fail, it is a reason to measure more. If your own laboratory uses image analysis, keep a point-counted reference image and check the threshold against it every session.

## Exercise: retained austenite in a carburised case

A technician lays a 25-point grid on 16 fields of a carburised case and counts 38 points in retained austenite out of 400 points in the case. The field fractions have a standard deviation of 0.06. (a) What are the point fraction and its binomial standard error? (b) What are the field-based standard error and the 95% confidence interval, using t = 2.131 for 15 degrees of freedom? (c) Do the two errors suggest the points behaved independently?

**Worked answer.** (a) P_P = 38 ÷ 400 = **0.095**. Binomial SE = √(0.095 × 0.905 ÷ 400) = **0.0147**. (b) Field-based SE = 0.06 ÷ √16 = **0.0150**, and the 95% interval is 0.095 ± 2.131 × 0.0150 = 0.095 ± 0.032, or **0.063 to 0.127**. (c) **Yes.** The two standard errors agree closely, so the grid spacing was coarse enough for the points to act as independent observations, and the binomial formula could be used to plan a repeat. The interval is wide for a fraction near 0.10, so a decision against a limit of, say, 0.15 is clear, but one against 0.10 would need many more fields.
