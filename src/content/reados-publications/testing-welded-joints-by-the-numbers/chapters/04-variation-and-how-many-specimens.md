---
book: testing-welded-joints-by-the-numbers
chapterSlug: variation-and-how-many-specimens
order: 4
title: "Variation and how many specimens"
description: "Describe scatter in weld test results with a mean and standard deviation, estimate a low value and a confidence interval, and judge how many specimens a question really needs."
draft: false
---

Test the same weld twice and you get two different numbers, and test it ten times and you get ten. Some of the difference is measurement (Chapter 3), but most is real: no two specimens are identical, because welds vary along their length, plates vary across their width, and welders vary from run to run. A single result tells you about one specimen. To say anything about the welds that were not tested, you need to know how much results vary, and that needs more than one result and a little statistics.

This chapter uses Whittemore's twelve strip averages to show how scatter is described, what a low value and a confidence interval mean, how the number of specimens changes what can be concluded, and how the hopper fabricator reads its own results.

## Describing scatter

Two numbers describe a set of results: the mean, which is their average, and the standard deviation, which measures how far results typically lie from the mean. For n results x₁ to xₙ with mean x̄, the sample standard deviation is:

**s = √[ Σ(xᵢ − x̄)² ÷ (n − 1) ]**

The coefficient of variation, s ÷ x̄, expresses the scatter as a percentage of the mean, which makes different kinds of test comparable.

Whittemore's twelve strip averages, from Chapter 2, were 69.3, 68.0, 74.3, 64.5, 69.2, 66.8, 54.0, 82.4, 69.6, 50.6, 76.7 and 73.9%. Their mean is **68.3%** and their standard deviation **8.9 percentage points**, a coefficient of variation of about **13%**. Those are averages of strips, each itself the average of several specimens; the individual specimens scattered far more widely, from about 35% to over 100%.

```figure
type: formula
title: Mean and spread of Whittemore's twelve strip averages
formula: x̄ = Σxᵢ ÷ n;  s = √[Σ(xᵢ − x̄)² ÷ (n − 1)]
caption: Calculated from the strip averages Whittemore reported in 1910. The spread between strips was large compared with modern welding, a sign of a process still being learnt.
- n | 12 strips
- x̄ | mean efficiency, 68.3%
- s | standard deviation, 8.9 percentage points
step: coefficient of variation = 8.9 ÷ 68.3 ≈ 13%
step: lowest and highest strip averages: 50.6% (H) and 82.4% (Y)
```

For comparison, modern tensile tests of sound, parent-breaking weld specimens from a well-controlled procedure scatter by around a percent or two, mostly reflecting the plate. Whittemore's 13% between strip averages reflects a process whose results depended heavily on how each weld happened to be made.

## A low value

Engineers usually care more about the low results than the average, because a structure fails at its weakest weld. If results follow a roughly normal distribution, about 5% of results lie more than 1.645 standard deviations below the mean. For Whittemore's strip averages, that suggests a strip average as low as about 68.3 − 1.645 × 8.9 ≈ **53.6%** could be expected about one time in twenty, consistent with his lowest strips, U at 54.0% and H at 50.6%.

Two cautions apply. First, with only a dozen results, the estimate of the standard deviation is itself uncertain, so a low value estimated this way is approximate; statistical tolerance limits, which allow for the small sample, push the estimate lower. Second, weld results are not always normally distributed: a few welds with defects can produce a long tail of very low results that a normal distribution understates. That is exactly what happens when lack of fusion appears in some specimens and not others.

## How sure is the mean?

The mean of a sample is itself uncertain. Its standard error is s ÷ √n, and a 95% confidence interval for the true mean is roughly the sample mean plus or minus t × s ÷ √n, where t comes from the t distribution for n − 1 degrees of freedom.

For Whittemore's twelve strips, t for 11 degrees of freedom at 95% is about 2.20, so the interval is 68.3 ± 2.20 × 8.9 ÷ √12 ≈ 68.3 ± **5.7**, roughly 62.6% to 74.0%. Twelve strips pinned down the mean efficiency of his welds to within about six percentage points, but not the efficiency of any particular weld.

```figure
type: bars
title: Standard error of a mean efficiency, with Whittemore's scatter, by number of specimens
unit: percentage points
max: 7
caption: Calculated with a standard deviation of 8.9 percentage points. Doubling the number of specimens does not halve the uncertainty of the mean; it reduces it by a factor of about 1.4.
- 2 specimens | 6.31
- 5 specimens | 3.99
- *10 specimens | 2.82
```

The square root in s ÷ √n is the essential fact about sample size. To halve the uncertainty of a mean, four times as many specimens are needed. Small increases in the number of specimens buy little precision; large improvements need large samples or, better, a less variable process.

## Two specimens are not a distribution

A procedure qualification test for a butt weld typically includes only two transverse tensile specimens. Two results cannot describe a distribution: their standard deviation is extremely uncertain, and nothing can be said about how often a weld would fall below the requirement. Qualification does not try to. It asks a narrower question: can this procedure, carried out under these conditions, produce welds that meet the requirement? Two passing specimens, with sound fracture faces and the other tests passing too, are evidence of capability. The variation in production is then controlled through the procedure's variables, welder qualification and inspection, not estimated from the qualification test.

## Variation within and between welds

Whittemore's results contain two kinds of variation. Within each strip, specimens cut from different parts of the same weld scattered widely: the average range within a strip was 39.8 percentage points for the unground strips and 22.2 for the ground ones (Chapter 3). Between strips, the averages scattered with a standard deviation of about 8.9 points. The within-strip variation reflects how a single weld varies along its length and how well each specimen was measured; the between-strip variation reflects how one weld differs from another, made on another day, perhaps with a different flame setting or filler.

Separating the two matters because they have different causes and different cures. Large variation within a weld points to technique and consistency along the joint, or to measurement. Large variation between welds points to conditions that change from weld to weld: settings, consumables, operators, preparation. A test plan that cuts several specimens from each of several welds can tell them apart; one that tests one specimen from each weld, or many from one weld, cannot.

## A marginal procedure often passes

It is worth knowing how easily a marginal procedure can pass a small qualification test. This is an illustration. Suppose a procedure's welds, tested in tension, would average 445 MPa with a standard deviation of 10 MPa, against a requirement of 430 MPa. A single specimen then has about a 93% chance of passing, and two specimens both pass about 87% of the time. Yet in production about one weld in fifteen, roughly 7%, would fall below the requirement.

By contrast, a procedure averaging 470 MPa with a standard deviation of 6 MPa, like the hopper's production results, would almost never produce a result below 430 MPa. Both procedures would usually pass qualification; only one is robust. Qualification shows capability, not margin, which is why the margin between results and limits, and the variation over time, are worth watching after qualification as well as during it.

## Choosing how many to test

The right number of specimens depends on the question, the scatter and the consequence. Where scatter is small and the question is capability, as in tensile tests of a sound procedure, a few specimens suffice. Where scatter is large, as in impact tests near the transition temperature, more specimens are needed for a meaningful average, and test standards specify sets of several. Where a result will decide whether a safety-critical weld goes into service, more evidence is justified than where it decides a stiffener weld on a hopper. And where the process is new or has changed, more testing early on establishes the scatter that later, lighter testing relies on.

## The hopper fabricator's production test plates

This is an illustration. The hopper customer also requires one production test plate a month, welded alongside the hoppers with the production procedure and tested in tension. After ten months, the fabricator had ten transverse results, all breaking in the parent: 468, 474, 461, 470, 479, 466, 472, 463, 476 and 469 MPa.

Their mean is **469.8 MPa**, their standard deviation **5.7 MPa**, and their coefficient of variation about **1.2%**. The 95% confidence interval for the mean is about 469.8 ± 2.26 × 5.65 ÷ √10 ≈ 469.8 ± **4.0 MPa**. The lowest result, 461 MPa, is well above the 430 MPa requirement.

Because every specimen broke in the parent, this distribution describes mainly the plate's strength beside the weld, not the weld's. It shows that the welds were at least that strong every month, across changes of plate batch and electrode batch, which is what the customer wanted to know, and that nothing changed over the period to weaken them. If a result had broken in the weld, or fallen noticeably below the others, the change would have stood out against the 5.7 MPa scatter.

```figure
type: line
title: Monthly production test plate results, hopper butt-weld procedure
x: Month
y: Ultimate tensile stress (MPa)
ymin: 420
ymax: 490
caption: This is an illustration. All ten specimens broke in the parent metal. The requirement for this example is 430 MPa; the results scatter by about 1.2% around their mean of 469.8 MPa.
legend: Transverse tensile specimen
- 1 | 468
- 2 | 474
- 3 | 461
- 4 | 470
- 5 | 479
- 6 | 466
- 7 | 472
- 8 | 463
- 9 | 476
- 10 | 469
```

## Watching for change

Plotting results in order, as above, turns a set of numbers into a record of the process. A result outside about three standard deviations of the established mean, or a run of results all drifting one way, suggests that something has changed: a new batch of consumables, a different welder, worn equipment, a new plate supplier. This is the idea behind statistical process control charts, and it applies to hardness, impact energy, weld size and defect rates as much as to tensile strength. It is far more informative than checking each result against its limit and filing it, and it costs nothing more than putting the results that are already being collected in date order on one chart.

## Averages can hide the weak result

Some tests are assessed on averages, such as the mean of three impact specimens (Chapter 7). An average protects against one unlucky specimen, but it can also hide a weak one. Three impact results of 64, 41 and 58 J average 54.3 J, but the 41 J specimen may represent a genuinely weaker region of the weld. For this reason, specifications that use averages usually also set a minimum for any individual result, and good practice is to look at each result and its fracture face, not just the average.

## Outliers

Now and then one result stands far from the rest. It is tempting to discard it as a mistake, and sometimes it is one: a specimen gripped badly, a dimension misread, a machine fault. But an unusually low weld result is often real, the specimen that happened to contain the defect the others missed. The rule is to explain an outlier before setting it aside. If the fracture face shows lack of fusion or porosity, the result is telling the truth about the weld and must be kept. If the test record shows a gripping failure or a measurement error, the result can be set aside and the reason recorded, and the specimen replaced if the standard allows. Whittemore's apparent efficiencies above 100% were outliers with an explanation, the rough-surface bias, and he kept them in his report with the explanation alongside.

## A failure: the averaged-away defect

This is an illustration. On an earlier contract with a different procedure, the fabricator's customer had accepted bend and tensile results on the basis of averages provided by a laboratory. A later investigation of a cracked weld found that one of the qualification tensile specimens had broken in the weld at a low stress with a defect on its fracture face, but that the laboratory's summary had reported only the mean of the two specimens, which still exceeded the requirement.

The weak result had been a warning that the procedure, or the way it was carried out, could produce lack of fusion. Averaging had removed the warning from the summary. Since then, the fabricator requires every test report to list individual results, fracture locations and fracture-face descriptions, and it reviews each one before accepting a qualification.

## Exercise: five impact results

Five impact specimens from a weld give 52, 61, 47, 58 and 55 J. Calculate the mean, the standard deviation and a 95% confidence interval for the mean, using t = 2.78 for four degrees of freedom. Comment on what the interval and the lowest result suggest.

The mean is (52 + 61 + 47 + 58 + 55) ÷ 5 = **54.6 J**. The squared deviations from the mean are 6.76, 40.96, 57.76, 11.56 and 0.16, summing to 117.2, so s = √(117.2 ÷ 4) ≈ **5.4 J**. The 95% interval is 54.6 ± 2.78 × 5.4 ÷ √5 ≈ 54.6 ± **6.7 J**, roughly 47.9 to 61.3 J.

The interval shows that the true mean is known only to within about 7 J from five specimens, and the lowest result, 47 J, lies below the lower end of the interval for the mean, as individual results often do. Whether the weld is acceptable depends on the specification's requirements for the average and for individual results, applied to the actual test temperature and specimen size, which Chapter 7 discusses.
