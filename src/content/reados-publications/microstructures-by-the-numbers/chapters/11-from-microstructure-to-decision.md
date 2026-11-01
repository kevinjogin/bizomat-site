---
book: microstructures-by-the-numbers
chapterSlug: from-microstructure-to-decision
order: 11
title: "From microstructure to decision"
description: "The uncertainty of a microstructure result from sample to report, comparing laboratories and batches fairly, avoiding pseudo-replication, decision rules near limits, and writing specifications."
draft: false
---

The earlier chapters each dealt with one measurement and its own errors. A real decision draws on several of them at once, made by different people on different specimens, sometimes in different laboratories, and has to be defended to a supplier, a customer or an auditor. This last chapter puts the pieces together: where the uncertainty of a microstructure result comes from, how to compare two sets of results fairly, how to state a decision rule near a limit, and how to write a specification that leaves little room for argument.

Its error is the most common statistical mistake in materials testing: treating many fields from one part as if they were many parts.

## Where the uncertainty comes from

The uncertainty of a microstructure result has several layers, and they differ greatly in size. The field-to-field scatter that Chapter 3 used for a confidence interval is only one of them, and often not the largest.

```figure
type: compare
title: Sources of uncertainty in a microstructure result
rowhead: Source
cols: What it covers | How it is estimated | Size in Plant P's work
caption: This is an illustration. The order of importance changes with the quantity measured. For pearlite fraction in castings, between-casting variation dominates; for nodule counts, the counting rule; for microhardness, diagonal measurement.
- * Between parts and locations | real differences between castings, bars and sections | several parts measured; Chapter 2's sampling plan | pearlite 0.30 to 0.36 between three casings
- Between fields | variation across one specimen | field scatter, Chapter 3 | pearlite ±0.04 at 95% on 22 fields
- Method settings | threshold, cutoff, etch, counting rules | change one setting, re-measure | nodule count 168 to 200 with cutoff, Chapter 6
- Operator | judgement in placing lines, tips and boundaries | two operators on the same images | about 4% in nodule count, this chapter
- Instrument | scale calibration, resolution | calibration certificate, Chapter 10's budget | diagonal ±0.81 µm at k = 2
```

The practical consequence is that the uncertainty quoted on a report should match the question being asked. A confidence interval from field scatter answers "how well do we know this specimen?" It does not answer "how well do we know this batch?", which needs the between-part variation, or "would another laboratory get the same?", which needs the method and operator components. Most disputes about microstructure results come from treating the first kind of interval as if it answered the second or third.

## Comparing two sets of results

Two questions come up again and again: do two laboratories, or two operators, measure the same thing the same way, and has a supplier's material changed? Both are comparisons of means, and both depend on choosing the right unit of comparison.

The [two-sample comparison tool](/tools/two-sample-t/) performs Welch's two-sample t-test on two groups from their means, standard deviations and sample sizes: it gives the difference of the means, its standard error, the t statistic, the Welch degrees of freedom, the two-sided p-value and the confidence interval for the difference, and reports whether the difference is significant at the chosen level. It reminds the user that the samples must be independent and random. That reminder matters more than any number the tool returns.

### Two laboratories on the same fields

After the nodule count dispute in Chapter 6, Plant P and the foundry agreed to measure the same ten saved field images, each with its own software, using the agreed 10 µm cutoff. Plant P's counts averaged 168.0 nodules per mm² with a standard deviation of 8.64; the foundry's averaged 161.8 with a standard deviation of 9.57.

Entered into the two-sample comparison tool, the difference of 6.2 per mm² has a standard error of 4.08, a t statistic of 1.52 and a p-value of 0.146: **no significant difference**, with a 95% confidence interval for the difference from −2.4 to 14.8 per mm².

That test, however, ignores the most useful feature of the experiment: both laboratories measured the **same** fields. The field-to-field variation, which is large, affects both sets of counts equally and should cancel out. Taking the difference field by field gives ten differences, 7, 10, 5, 6, 2, 8, 8, 7, 4 and 5, with a mean of 6.2 and a standard deviation of only 2.30. A paired t-test gives t = 6.2 ÷ (2.30 ÷ √10) = 8.53 with nine degrees of freedom, far beyond any usual critical value, and a 95% interval for the systematic difference of **4.6 to 7.9 per mm²**.

```figure
type: compare
title: The same comparison analysed two ways
rowhead: Analysis
cols: Standard error of the difference | Result | What it means
caption: This is an illustration. The two-sample test treats the two sets of counts as independent and so includes the large field-to-field variation in its error. The paired analysis removes it, because both laboratories measured the same fields, and reveals a small, consistent offset.
- Welch two-sample t-test, from the tool | 4.08 | no significant difference, p = 0.146 | the test could not see a difference through the field scatter
- * Paired t-test on field differences | 0.73 | consistent offset of 6.2 per mm², 95% interval 4.6 to 7.9 | Plant P counts about 3.8% more nodules on identical images
```

The laboratories traced the offset to a small difference in the grey-level threshold, which made Plant P's software separate a few touching nodules that the foundry's counted as one. A 4% systematic difference is small enough to live with once it is known, and the two agreed a common threshold for future disputes. The lesson is about design rather than arithmetic: when two methods are compared, measure the same items with both and analyse the differences, and use an independent-samples test like the tool's only when the two groups really are different items.

## The error: many fields, one casting

When the foundry changed its inoculant, Plant P's engineer wanted to know whether the matrix of the casings had changed. The laboratory measured the pearlite fraction on 22 fields of one casing made before the change and 22 fields of one casing made after. The means were 0.32 and 0.38, each with a field standard deviation of 0.09. The two-sample comparison tool returned a difference of 0.06, a p-value of 0.033 and a verdict of **significant difference**, and a draft memo told the foundry that its change had raised the pearlite content.

The engineer's manager asked how many castings had been measured. The answer was two, one each side of the change. The 22 fields were 22 measurements of one casting each, not 22 castings, so the test had compared two castings, using the variation within each as if it were the variation between castings. That is **pseudo-replication**, and it makes almost any two parts look significantly different, because two castings always differ by more than the fields within one casting do.

The laboratory measured two more castings from each side of the change, three in all, and used each casting's mean as one observation. Before the change the three casting means were 0.33, 0.36 and 0.30; after it, 0.38, 0.33 and 0.37.

```figure
type: compare
title: The inoculant change tested with fields and with castings
rowhead: Unit of comparison
cols: Means | Spread used | Tool result
caption: This is an illustration. With castings as the unit, the difference of 0.03 is well within the variation between castings and the test cannot distinguish it from no change. The earlier result came from treating fields within one casting as independent castings.
- * Fields, one casting each side | 0.32 and 0.38 | field standard deviation 0.09, n = 22 each | significant, p = 0.033
- Castings, three each side | 0.33 and 0.36 | casting standard deviations 0.030 and 0.026, n = 3 each | no significant difference, p = 0.265
```

The two-sample comparison tool, given casting means of 0.330 and 0.360 with standard deviations of 0.030 and 0.0265 and three castings each, returns a p-value of 0.265 and **no significant difference**, with a 95% interval for the difference from −0.095 to +0.035. The memo was withdrawn. The honest conclusion was that three castings each side could not show whether the change had moved pearlite by a few hundredths, and that if such a change mattered, more castings would be needed; with a between-casting standard deviation near 0.03, detecting a change of 0.03 with 80% power at the 0.05 level would take about 16 castings each side.

## Repeatability, reproducibility and reference specimens

Two terms from measurement science help to keep these sources apart. **Repeatability** is the agreement between results obtained by the same operator, with the same equipment and method, on the same specimen in a short time. **Reproducibility** is the agreement between results obtained in different laboratories, by different operators, with their own equipment, on the same material. Reproducibility is always worse than repeatability, because it adds the method-setting and operator components that repeatability holds fixed. A supplier's certificate and a purchaser's check are separated by reproducibility, not repeatability, and should be expected to differ by that much.

Interlaboratory comparisons, often called round robins, measure reproducibility directly: identical specimens, or identical images, go to several laboratories, and the spread of their results is analysed. Standards bodies run them when they develop methods, and the precision statements in test standards come from them. A small laboratory cannot run its own round robin, but it can do two things that serve a similar purpose. It can keep **reference specimens** and **reference images** of known value, measured carefully when the method was set up, and re-measure them at intervals to detect drift in its own work; and it can exchange specimens or images with a supplier or customer when results are disputed, as Plant P did with the foundry. Both are cheap and both turn arguments into measurements.

Plant P keeps a reference set of five images for nodule count and nodularity, one polished ductile iron specimen for pearlite fraction, and a certified hardness block for each microhardness force it uses. Each is measured monthly and the result plotted on a simple chart; a result outside its usual band stops routine work until the cause is found. In two years the chart has caught a drifting camera calibration and a software update that changed the default threshold, either of which would otherwise have shifted every result the laboratory reported.

## Decision rules near limits

Every acceptance decision is made with some uncertainty, and a result close to a limit forces a choice about who carries the risk. The choice should be made in advance and written down as a **decision rule**. ISO/IEC 17025, the standard for the competence of testing laboratories, requires a laboratory to state the decision rule it uses when it reports conformity with a specification, and ILAC G8 gives guidance on such rules.

Three kinds of rule are common.

- **Simple acceptance**: accept if the measured value is within the limit, regardless of uncertainty. The purchaser carries the risk near the limit.
- **Guarded acceptance**: accept only if the value is within the limit by more than the uncertainty. The supplier carries the risk, and some good material is rejected.
- **Three-way decision**: accept when clearly inside, reject when clearly outside, and call the result indeterminate in between, with an agreed action such as more measurement.

Plant P's laboratory uses the three-way rule for microstructure results, as the earlier chapters did in practice: the pearlite result near 0.40 in Chapter 3 was indeterminate until more fields were measured, and the microhardness of Chapter 10 is judged against the surface band only when the mean of three readings lies clear of the limits by more than its uncertainty.

## Microstructure as a proxy

Most microstructure requirements stand in for properties that are harder to test directly. Grain size stands in for toughness and strength; the relation between finer grains and higher yield strength, described in the early 1950s by Hall and by Petch, is one of the best established in metallurgy. Pearlite fraction and nodularity stand in for the strength and elongation of ductile iron; inclusion content for fatigue and transverse ductility; case depth for wear and fatigue life. The proxy is useful because it is quicker and can be checked on the part itself, but when a microstructure result is borderline and the property matters, the direct test, a tensile, impact or fatigue test, settles the question.

## Writing a microstructure specification

Almost every error in this book could have been prevented by a clearer requirement. A good specification states each of the following for every microstructural quantity.

```figure
type: checklist
title: What a microstructure requirement should state
caption: Each line answers a question that caused a dispute or an error somewhere in this book.
- x The quantity and the phase or feature | prior austenite grain size, not just "grain size", Chapter 4
- x Where it applies | which section of the casting or which region of the shaft, Chapters 2 and 5
- x Specimen source and orientation | cut from the part, coupon or test bar; longitudinal or transverse, Chapters 2 and 9
- x The method and its settings | named standard, cutoff, threshold or shape factor, Chapters 6 and 7
- x How many fields and parts | the sampling plan behind the result, Chapters 2 and 3
- x Whether non-uniform structures are acceptable | duplex grains, local porosity, Chapters 5 and 8
- x The decision rule near the limit | simple, guarded or three-way
```

## A report others can use

A microstructure report outlives the decision it was written for. It may be read a year later in a warranty claim, by a supplier's metallurgist trying to reproduce a result, or by an auditor. Plant P's reports therefore include, besides the results and their uncertainties, the specimen record from Chapter 2, at least one image of a representative field at a stated magnification with a scale bar, the settings of any image analysis, and the individual field values, not just their mean. The field values cost nothing to include and allow anyone to recompute the statistics, to test for outliers or to pool the result with later measurements. A report that gives only a mean and a pass invites the questions this book has spent eleven chapters answering.

## How this applies to a small Australian business

Before comparing two sets of results, ask what the unit of comparison is: fields, specimens, parts or batches, and make sure the statistics use that unit. When two laboratories disagree, have both measure the same items and look at the differences. When writing a requirement, state the method, location, sampling and decision rule, so that the supplier, your laboratory and any arbitrating laboratory are all measuring the same thing in the same way. Most of these steps cost nothing but forethought.

## Exercise: was the new supplier's grain size different?

Three shafts from the established supplier gave average grain sizes of G 6.97, 7.10 and 6.85; three from the new supplier, after its furnace was corrected, gave 6.60, 6.95 and 6.75. (a) What are the means and standard deviations of each group? (b) Using the two-sample comparison tool's method, is the difference significant at 0.05? (c) Why is the shaft, not the field, the right unit here?

**Worked answer.** (a) Established: mean **6.973**, standard deviation **0.125**. New: mean **6.767**, standard deviation **0.176**. (b) The difference is 0.206 with a standard error of √(0.125² ÷ 3 + 0.176² ÷ 3) = 0.125, so t = 1.65 with about 3.6 Welch degrees of freedom and a two-sided p-value of about 0.18: **no significant difference** at 0.05. (c) The question is whether the suppliers' shafts differ, and shafts vary between heat treatment loads more than fields vary within one shaft. Using fields would be pseudo-replication and would exaggerate the evidence; with three shafts each, a difference of 0.2 in G cannot be distinguished from shaft-to-shaft variation.
