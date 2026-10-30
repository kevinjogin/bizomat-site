---
book: defect-maps-by-the-numbers
chapterSlug: from-map-to-cause-and-proof
order: 11
title: "From map to cause and proof"
description: "Turning map evidence into changes, planning a before-and-after trial, proving the defect rate fell, using a fresh map to credit each change correctly, and keeping the gain."
draft: false
---

Mapping, testing and modelling are only worth doing if they lead to a change that works and can be shown to work. This last chapter follows Plant E from the evidence of the earlier chapters to the changes it made, the trial that tested them, the statistics that proved the improvement and the fresh map that showed which change deserved the credit. It ends with the routines that keep the gain.

Its error is the most human in the book: giving the whole credit to the most expensive change, because it was the one everybody could see.

## From evidence to changes

By the end of the study, the evidence pointed to three causes, each found by a different method.

```figure
type: compare
title: Plant E's causes, the evidence for each and the change made
rowhead: Cause
cols: Evidence | Change | Cost
caption: This is an illustration. Each change targets a cause identified by a specific piece of evidence, and each has a prediction that a fresh map can check.
- * Cured powder flakes falling from the hooks | top-band intensity three times the rest, peaks under the hooks, Chapters 1, 4 and 8 | second set of hooks; hooks stripped weekly in rotation | about A$900 a week
- Background dust on windy days | between-door clustering by time of day, settling plates, Chapters 7 and 9 | air curtain on the roller door, interlocked to close during coating | A$38,000 installed
- Oil in the touch-up gun's air | crater clusters on single doors, Chapters 5 and 6 | filter and drain on the touch-up drop | under A$500
```

Each change came with a prediction. Clean hooks should bring the top band down to the level of the rest of the door and leave the rest alone. The air curtain should lower the background density across the whole door and reduce the difference between dusty and still days. The air line filter should remove crater clusters. A trial that measures the total alone cannot check these predictions separately; a trial that maps the defects can.

## Planning the trial

The trial compared the 400 mapped doors from the original study, the "before" group, with doors coated after all three changes were in place. The question was how many "after" doors were needed.

The [process change trial tool](/tools/process-change-trial/) plans and evaluates a before-and-after comparison. For planning, it gives the number of parts needed in each group to detect the smallest difference worth detecting at a chosen significance level and power, from an expected standard deviation. For evaluation, it performs Welch's two-sample t-test on the two groups' means, standard deviations and sizes, reports whether the change was in the better direction, the p-value and a confidence interval for the improvement, and checks the result against the planned sample size and the worthwhile difference.

The engineer set the smallest worthwhile reduction at 0.3 defects per door, roughly the size of improvement that would justify the air curtain, and used the before group's standard deviation of about 1.2 defects per door. At a significance level of 0.05 and a power of 80%, the tool gives **252 doors per group**. The plant mapped 300 consecutive doors after the changes, over two weeks that included both still and windy days.

### Why defects per door, and not first-pass yield

The trial could have compared first-pass yields instead, as proportions. Defects per door carries more information, because a door with three defects and a door with one are both simply "rejected" in a yield, and it is the quantity whose zones and types the map can break down. The Welch t-test is approximate for counts as skewed as these, but with hundreds of doors in each group the approximation is sound, and a check with a test designed for rates, described below, gives the same conclusion.

### Running the trial fairly

A before-and-after comparison is only as fair as the conditions on each side. Plant E's engineer listed what else could change between the two periods and dealt with each. The after doors were consecutive production, not chosen, and included windy and still days in about the same proportion as the before period, which the weather records confirmed. The same door range, powder and line speed were used. One thing had changed that could not be undone: the second inspection lamp fitted after the detection study of Chapter 10, which made inspectors find more defects, not fewer. That biases the comparison against the improvement, so the measured reduction is, if anything, an underestimate. A bias whose direction is known and works against the conclusion is acceptable; one that works in favour of it would have needed correcting before the result could be believed.

The engineer also fixed the analysis before the after data came in: the primary comparison would be mean defects per door by Welch's test, with the zone breakdown and the rate test as secondary results. Deciding the analysis in advance prevents the temptation, once the data are in, to choose whichever comparison looks best.

## The result

The 300 after-doors carried 63 defects: a mean of 0.21 per door with a standard deviation of 0.60. Of the 300, 264 had no defects, a first-pass yield of **88%**, against 74% before.

Entered into the process change trial tool against the before group's 0.55 and 1.205 on 400 doors, the result is an improvement of 0.34 defects per door, with a t statistic of 4.89 on about 617 degrees of freedom and a p-value of about one in a million. The 95% confidence interval for the improvement runs from **0.20 to 0.48** defects per door. The tool's verdict is **improvement confirmed**, with the sample size check passed, since 300 doors exceeded the 252 planned, and the practical size check passed, since 0.34 exceeds the 0.3 worth detecting.

```figure
type: stats
title: Before and after the three changes
caption: This is an illustration. From the process change trial tool and the yield count. A rate test treating the 283 defects as Poisson counts with exposures of 400 and 300 doors gives z = −7.0, the same conclusion; with clustered counts that test overstates the certainty, which is why the per-door comparison is the primary result.
- 0.55 to 0.21 | defects per door, before to after
- 0.20 to 0.48 | 95% confidence interval for the reduction
- 74% to 88% | first-pass yield
- A$7,980 | weekly rework saving at 1,500 doors and A$38 a door
```

### A check with a rate test

As a check, the two groups can be compared as Poisson rates. If the rate per door were the same before and after, the 283 defects would be shared between the groups in proportion to their exposure, 400 and 300 doors, so the after group would be expected to hold 283 × 300 ÷ 700 = 121.3 of them. It held 63. Treating the split as binomial gives a z value of −7.0. This test assumes the counts are Poisson, which Chapter 7 showed they are not, so its certainty is overstated; but the direction and the size of the change agree with the per-door t-test, and it is reassuring that two different methods tell the same story.

## The error: credit for the visible change

At the next management meeting the improvement was presented as the result of the air curtain, the largest and most visible change, and the operations manager proposed buying a second one for the plant's other coating line, which had no roller door problem but a similar rework rate.

The engineer had the map of the 300 after-doors and split the improvement by zone, as Chapter 8 had planned.

```figure
type: compare
title: Defects per door by zone, before and after
rowhead: Zone
cols: Before, 400 doors | After, 300 doors | Change per door | Most likely cause of the change
caption: This is an illustration. The top band, the hook zone, fell by 0.175 defects per door, to the level of the rest of the door. The lower door fell by 0.165, which reflects the air curtain and the end of crater clusters. The two changes contributed about equally.
- * Top 200 mm band | 0.205 | 0.030 | −0.175 | clean hooks
- Rest of the door | 0.345 | 0.180 | −0.165 | air curtain and air line filter
- Whole door | 0.550 | 0.210 | −0.340 | all three
```

The top band's density after the changes was 0.19 per m², slightly below the rest of the door at 0.23 per m², exactly as the hook explanation predicted: its excess was gone. Of the total improvement of 0.34 defects per door, about half came from the hooks, the cheapest change by far, and about half from the lower door, where the air curtain and the filter shared the credit. The second line's defects, when mapped, turned out to be concentrated in the top band. It needed clean hooks, not an air curtain, and the purchase was cancelled.

The lesson is that a before-and-after test of the total says whether the changes together worked, but not which of them did. When several changes are made at once, a breakdown by zone, type or time, planned in advance with a prediction for each change, is what allows each to be credited correctly. Without it, credit tends to go to whatever was most expensive or most visible.

## What happened to the clustering

The after doors still showed clustering between doors. Their counts had a mean of 0.21 and a variance of 0.36, an index of dispersion of 1.7, and a negative binomial clustering parameter of 0.29, close to the 0.34 before. With m = 0.21 and α = 0.29, the model predicts a first-pass yield of 85%, a little below the 88% observed. The hooks had removed one source of variation between doors, but the background dust still varied from day to day, and the air curtain had reduced its level more than its variability. That is a pointer for the next round of work: what remains is mostly dust that arrives on some days more than others, and the settling plates are the tool for finding out why.

## Small or gradual changes

Plant E's improvement was large and the trial was clear. Many improvements are smaller, or happen gradually as a cause is worn away, and a single before-and-after comparison may not detect them with a reasonable number of parts. For those, charting the defect rate continuously is more effective than a one-off trial: a cumulative sum chart, which accumulates small departures from a target, detects a sustained shift of a fraction of a standard deviation far sooner than a Shewhart chart, as the companion book on control charts explains in [CUSUM: a random walk that remembers](/reados/publications/control-charts-by-the-numbers/cusum-a-random-walk-that-remembers/). The same per-door counts feed it, and the clustering adjustment of Chapter 10 applies to its limits too.

## Reporting the result

The engineer's report to management fitted on two pages. It stated the problem and its cost, the three causes and the evidence for each, the changes made, the trial design fixed in advance, the primary result with its confidence interval, the zone breakdown, the remaining clustering and the routines put in place. It included the before and after composite maps side by side, which did more to persuade than any statistic. The report also recorded what had not worked, the finer filters bought in the first week, and why. Recording failures is as useful to the next engineer as recording successes, and it protects the plant from buying the same filters again.

## Keeping the gain

Improvements decay when the routines that produced them lapse. Plant E's engineer built the findings of this book into the line's standard work.

```figure
type: checklist
title: Plant E's routines for keeping the defect rate down
caption: This is an illustration. Each routine maps to a cause or a method from an earlier chapter, and the open item is the one still being tested.
- x Hooks stripped weekly in rotation | logged by hook set, Chapter 8's cause
- x Air curtain interlock checked each morning | Chapter 7's dusty-day clustering
- x Touch-up air drop drained daily, filter changed monthly | Chapter 5's crater clusters
- x Daily 20-door chart with adjusted limits | Chapter 10, signals about once in two months
- x Daily top-band chart | early warning of hook build-up
- x Monthly 100-door map | composite map and quadrat test, Chapters 1 and 4
- ? Settling plates near the booth each week | trial running, Chapter 9's reverse coverage method
```

The monthly map is the routine that matters most. It costs about half a shift of an inspector's time each month and repeats, on a small scale, the study that found the causes in the first place. A new hot spot on the map, a rise in the dispersion of counts per door or a change in the top band's share gives warning of a new cause long before the rework rate rises enough to be noticed.

## What the study cost and returned

The whole study, from the first mapped door to the report, took about eight weeks of the engineer's part-time attention, two weeks of mapping by inspectors who were already inspecting every door, a few hours of measuring positions on single doors and a spreadsheet. The changes it led to cost about A$38,500 in equipment and A$900 a week in hook stripping. The rework saving was close to A$8,000 a week, and the customer's lot rejections fell as the escape rate dropped. None of it needed specialised software or a statistician; it needed defect positions, the patience to look at them, and the discipline to test each idea against what chance would have produced.

## How this applies to a small Australian business

Tie each change to the evidence that motivated it and to a prediction that can be checked. Plan the trial with enough parts to detect the smallest improvement worth having, map the defects after the change as well as counting them, and break the result down by zone or type so that each change gets the credit it earned. Then keep a small, regular map going: the same method that finds causes is the cheapest way to notice new ones.

## Exercise: was the air curtain worth it?

The lower door's defects fell from 0.345 to 0.180 per door. Suppose the engineer's settling plates suggest that two thirds of that fall came from the air curtain and one third from the air line filter. (a) What reduction in defects per door is attributed to the air curtain? (b) If each 0.1 fall in defects per door raises first-pass yield by about 4 percentage points on this line, what weekly rework saving does the air curtain bring at 1,500 doors and A$38 a door? (c) How long does the A$38,000 curtain take to pay for itself?

**Worked answer.** (a) The lower-door fall is 0.345 − 0.180 = 0.165 per door; two thirds of it is **0.110 defects per door**. (b) That is about 1.1 × 4 = 4.4 percentage points of first-pass yield, so 1,500 × 0.044 × 38 = **A$2,508 a week**. (c) A$38,000 ÷ 2,508 = **about 15 weeks**. The curtain pays for itself, but the hooks, at about A$900 a week for a saving of the same order, are the better investment, and the comparison is only possible because the map separated the two effects.
