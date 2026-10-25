---
book: checking-drawings-by-the-numbers
chapterSlug: measuring-the-checking-process
order: 10
title: "Measuring and improving the checking process"
description: "Record checking findings by pass and severity, track the faults that escape, estimate the value of each pass per hour, sample released drawings, and decide where checking effort pays."
draft: false
---

Every chapter so far has been about checking one drawing set. This one steps back to the checking process as a whole. An office that checks every drawing still has questions it cannot answer by checking harder: Which passes find the faults that matter? How many faults get through anyway? Is the checking time well spent, or would a different split find more? Are released drawings as good as the office thinks?

Those questions have numerical answers, but only if the office records what its checks find and what escapes them. This chapter sets out a simple record, shows how to read it, and uses a year of the running case office's checks to decide where its checking effort should go. It ends with sampling released drawings, which is the only way to see the faults that checking missed and nobody has yet found.

## A finding record that can be counted

A marked-up print records what was found on one drawing. To learn anything about the process, the findings must also go into a list that can be counted. The record needs only a few fields for each finding:

- the drawing and revision;
- the **pass** that found it, using the passes of Chapter 1;
- a short description;
- a **severity**: would it have caused scrap or rework if it had escaped, a reissue only, or nothing beyond appearance;
- the time spent checking the drawing, recorded once per check.

A second list records **escapes**: faults found after issue, by anyone, with the same fields and the stage at which they were found. Escapes are the measure of what checking misses, and they are only visible if the workshop, the suppliers and the inspectors are asked to report them and are thanked when they do.

## The running case office's year

This is an illustration. Over a year, the office checked 120 drawings and recorded 310 findings, an average of 2.6 per drawing, in 144 hours of checking, an average of 1.2 hours per drawing. Nine faults escaped and were found after issue, from those 120 drawings.

```figure
type: bars
title: Findings in a year of checking, by pass
unit: findings
max: 100
caption: This is an illustration. 310 findings on 120 drawings. Dimension faults are the largest group; stack faults the smallest.
- Sheet and title block | 74
- Views | 18
- *Dimensions | 96
- Limits and fits | 22
- Stacks | 9
- Notes | 58
- The set | 33
```

The counts alone suggest that dimensions and the sheet pass are where checking finds most. But counts treat a misspelt title and a seizing pin alike. Two more numbers are needed: how long each pass takes, and what its faults would have cost if they had escaped.

## Value per hour of each pass

The checkers recorded their time by pass for a month, which the office scaled to the year: 18 hours on the sheet pass, 14 on views, 48 on dimensions, 20 on limits and fits, 16 on stacks, 16 on notes and 12 on the set. Dividing findings by hours gives each pass's yield, and multiplying the yield by the typical cost of an escaped fault of that kind, from Chapter 1's estimates, gives a rough value per hour.

This is an illustration. The office took a typical escaped sheet fault as costing a reissue, A$190; a view, dimension, fit or stack fault as costing scrap of a batch, A$3,050; a notes fault as A$600, since some cause scrap and many do not; and a set fault, such as a short kit, as A$400.

```figure
type: compare
title: Yield and rough value of each checking pass
cols: Hours | Findings per hour | Typical cost if escaped | Value per hour
caption: This is an illustration, excluding GST. Value per hour is findings per hour times the typical cost of an escape; it ranks the passes, it does not price them.
- Sheet and title block | 18 | 4.1 | A$190 | A$781
- Views | 14 | 1.3 | A$3,050 | A$3,921
- *Dimensions | 48 | 2.0 | A$3,050 | A$6,100
- Limits and fits | 20 | 1.1 | A$3,050 | A$3,355
- Stacks | 16 | 0.56 | A$3,050 | A$1,716
- Notes | 16 | 3.6 | A$600 | A$2,175
- The set | 12 | 2.8 | A$400 | A$1,100
```

The table changes the picture. The sheet pass finds the most per hour but the cheapest faults, so it is worth doing quickly and not lingering on. The dimension pass is the most valuable hour the office spends. The stack pass finds little per hour, but each of its finds is expensive, and the office's view was that it should be kept, targeted at the gaps the design brief names rather than spread across every possible pair of surfaces.

## Where escapes come from

The nine escapes tell the rest of the story. The office classified each by the pass that should have caught it:

- three were stack faults: two axial gaps and one guard clearance, all on assemblies where the stack pass had been skipped for time;
- two were coating or treatment faults that changed a fit, the kind Chapter 8 describes;
- two were dimension faults, one missing and one duplicated in a closed loop;
- one was a sheet fault, a wrong revision on a second sheet;
- one was a parts list quantity.

Five of nine escapes came from the two passes, stacks and treatments, that involve more than one drawing at a time. That matched the office's experience on the tensioner: the faults that hurt were not on any single sheet, but between sheets.

```figure
type: stack
title: The nine faults that escaped checking in a year
unit: escapes
caption: This is an illustration. Faults found after issue, classified by the pass that should have caught them. The cross-drawing passes produced most escapes.
- Stacks | 3
- Treatments changing a fit | 2
- Dimensions | 2
- Sheet | 1
- Parts list | 1
```

## The error: fewer findings, more escapes

This is an illustration. In the second half of the year, the office's findings per drawing fell from about 2.9 to 2.3, and the manager read it as a sign that drawings were improving. The escape list told a different story: seven of the nine escapes came in that half.

The cause was time pressure. One checker, short of time on a busy project, had stopped doing the stack pass on smaller assemblies and had not recorded the omission. Fewer stacks checked meant fewer stack findings recorded, which lowered the findings count, and more stack faults escaped, which raised the escape count. Measured by findings alone, checking had improved; measured by escapes, it had got worse.

The office changed two things. The check record now shows each pass as done or not done, so that a skipped pass is visible. And the manager reviews findings and escapes together each quarter, because either one alone can mislead.

## Severity needs a shared meaning

Counting findings by severity only works if every checker means the same thing by each grade. The office's first quarter of records showed one checker grading almost everything "major" and another almost nothing, which made the severity column useless.

The fix was a short definition for each grade, tied to consequences rather than impressions. A **critical** finding would, if it escaped, cause scrap, a failure in service or a safety risk: the seizing pin, the clamped arm. A **major** finding would cause rework, a reissue or a delay: the missing spindle boss offset, if caught at first article. A **minor** finding affects only clarity or presentation: a zone reference, a title that differs from the register. Each checker graded the same ten old findings against the definitions, the office compared the grades, and the two checkers discussed the three they disagreed on until they agreed. The exercise took an hour and made the severity column trustworthy.

## Two checkers, and the faults neither found

Escapes and samples measure what checking missed after the fact. A second method estimates it during checking, for drawings important enough to have two independent checkers. It borrows a technique from ecology, where it is used to estimate animal populations by capture and recapture.

This is an illustration. Two checkers each check the revised tensioner arm independently, without seeing each other's mark-ups. Checker A finds 12 faults, checker B finds 10, and 8 of those are the same faults. If the two checkers find faults independently, the total number of faults on the drawing can be estimated as A × B ÷ both = 12 × 10 ÷ 8 = **15**. Between them they found 12 + 10 − 8 = **14** distinct faults, so the estimate suggests about **one** fault remains that neither found.

The estimate is rough, and its independence assumption is optimistic, because checkers trained the same way tend to miss the same kinds of fault. It is still useful in two ways. A small estimated remainder, like this one, is reassuring evidence that a high-risk drawing has been checked well. A large one, say two checkers who found 6 and 5 faults with only 2 in common, suggesting about 15 in total and 6 unfound, is a clear signal that the drawing needs another look, or that the checkers need a common checklist.

## Feeding findings back

The most valuable use of the finding record is not measuring checkers but improving drawings before they reach checking. Recurring findings point to fixable causes: a template that carries an inapplicable note, a title block field that is easy to leave blank, a habit of dimensioning grooves from the wrong wall.

This is an illustration. The year's 74 sheet findings included 19 stale used-on references and 11 sheets of multi-sheet drawings left at an old revision. The office changed its template so that the used-on field is filled from the assembly's parts list automatically, and its release procedure so that all sheets of a drawing are reissued together. In the following half-year, those two findings fell to 3 and 1. That is checking working as it should: each fault it finds once is a fault the office stops making.

## Sampling released drawings

Escapes are the faults someone found. Some faults in released drawings have not been found yet: they wait for the next batch, the next supplier or the first part made to a rarely used revision. The only way to estimate how many there are is to re-check a sample of released drawings, thoroughly, as if they were new.

The arithmetic of a sample is worth knowing, because small samples say less than people expect. If a sample of n drawings finds no faults, the true fault rate could still be quite high. A useful rule is that zero faults in n drawings gives an upper 95% confidence bound of about 3 ÷ n on the fraction of drawings with faults. Twenty clean drawings therefore show only that the rate is probably below about 14%; forty clean drawings, below about 7%.

```figure
type: formula
title: What a sample of released drawings can show
formula: zero faults in n drawings: upper 95% bound ≈ 3 ÷ n
caption: The exact binomial bound for zero faults in 20 is 13.9%, close to 3 ÷ 20 = 15%. With faults found, use the binomial bound itself.
- n | Number of released drawings re-checked in full
- x | Number of those found to contain at least one fault
step: 0 in 20: exact upper bound 13.9%; rule of three 15%
step: 0 in 40: exact upper bound 7.2%
step: 2 in 20: observed 10%; exact upper bound 28.3%
```

This is an illustration. The office re-checked 20 drawings released in the previous year, chosen at random, and found faults on 2 of them: one missing surface texture symbol and one stale used-on reference. The observed rate is 10%, but with only 20 drawings, the upper 95% bound is about 28%. The sample is enough to show that released drawings are not fault-free, which the office had half believed, and not enough to measure the rate closely. The office decided to sample ten drawings a quarter and accumulate the results, so that a year's sample of 40 would narrow the estimate.

## Scaling the check to the risk

The office's final change used everything above. It now classifies each drawing before checking as high, medium or low risk, from the cost of a fault reaching manufacture and the part's complexity, and scales the check:

- **high risk**, such as the tensioner arm: every pass, with every fit and every named stack recalculated, and a second checker for the fits and stacks;
- **medium risk**: every pass, with stacks only for the gaps the design brief names;
- **low risk**, such as a simple bracket made in twos: the sheet pass, a view check and the dimension count, with the other passes noted as not done.

The classification is recorded on the check sheet, so that a later reader knows what kind of check the signature represents.

This is an illustration. In the office's year, about 40% of the 120 drawings, 48 of them, were simple enough to class as low risk. Checking them in about half an hour instead of the average 1.2 hours saves 48 × 0.7 = **33.6 hours** a year. That is more than double the stack pass's 16 hours, and the office spent the saving on second checkers for its high-risk drawings, which is where the capture–recapture estimate above can be used and where the escapes had come from.

## Exercise: is the stack pass worth its 16 hours?

The office's manager proposes dropping the stack pass entirely to save its 16 hours a year, at A$95 an hour. In the year's record, the stack pass found 9 faults, and 3 stack faults escaped where the pass had been skipped. Taking an escaped stack fault as costing A$3,050, is dropping the pass a saving?

**Worked answer.** The stack pass costs 16 × A$95 = **A$1,520** a year.

Its 9 findings, had they escaped, would have cost up to 9 × A$3,050 = **A$27,450**. Not every fault would have reached manufacture; even if only a third had, that is about A$9,150, six times the pass's cost.

The 3 escapes where the pass was skipped cost about 3 × A$3,050 = **A$9,150** in that year, which is consistent with the estimate. Dropping the pass would save A$1,520 and cost several times that. The better saving is the one the office adopted: keep the pass, but aim it at the gaps the design brief names and at the drawings classified as high risk, where its finds are concentrated.
