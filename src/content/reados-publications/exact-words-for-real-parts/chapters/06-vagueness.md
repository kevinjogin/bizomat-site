---
book: exact-words-for-real-parts
chapterSlug: vague-words-sharp-limits
order: 6
title: "Vague words, sharp limits: tolerance, uncertainty and the borderline part"
description: "Apply Russell's 1923 account of vagueness to drawings and measurements: why a tolerance makes a requirement precise, why every reading stays vague, and how to decide a borderline part."
draft: true
---

The replacement brackets are machined from a new plate on the corrected set-up. Thickness is measured on every one, as before. Most read comfortably inside 12.00 ± 0.05 mm. One reads 12.047 mm. The inspector writes "12.05, in tolerance" and moves on.

That note contains two small acts of rounding, and either could be wrong. Is the bracket really within 12.05 mm? The reading says 12.047, but the micrometer is not perfect, and the true thickness could be a few micrometres either side. Whether the bracket conforms is a precise question with a definite answer. Whether the inspector can know the answer from this reading is a different question. Russell's short paper on vagueness, published in 1923 in an Australian journal, explains why the two come apart.

## Russell on vagueness

Russell's paper "Vagueness" was printed in the first volume of the *Australasian Journal of Psychology and Philosophy* in 1923, the journal that later became the *Australasian Journal of Philosophy*. Its central claim is that vagueness belongs to representations, not to the things represented. Words, pictures, maps and measurements represent the world, and all of them do so imperfectly. The world itself is whatever it is.

He defined precision in terms of the relation between a representation and what it represents. A representation is precise when the relation is one-one: each distinct state of affairs gets its own distinct representation. It is vague when the relation is one-many: one representation fits many different states of affairs. On that account every actual representation is vague to some degree, because no system of signs distinguishes every possible difference. Russell included the quantitative words of science, which have been made as precise as anyone can make them, and still fall short of perfect precision. He also drew the conclusion that troubles logicians: the law of excluded middle, that every statement is either true or false, holds for precise symbols but cannot be relied on for vague ones.

Russell's paper is the starting point for most modern work on vagueness, and his particular account has been widely criticised. Philosophers still disagree about whether vagueness lies only in language. For engineering purposes his framework is exactly right, because it separates three things that inspection constantly runs together: the part, the requirement and the reading.

```figure
type: compare
title: Three things in a thickness check, and how vague each is
cols: What it is | How vague
caption: The tolerance makes the requirement precise. The reading stays vague, because many true thicknesses produce the same reading.
- The part | a plate with some definite thickness at each point | not vague: it is whatever it is
- The requirement | 12.00 ± 0.05 mm, at every point | precise: every true thickness is either in or out
- * The reading | 12.047 mm from a micrometer | vague: true values within a few micrometres all give this reading
```

## How a tolerance makes a word precise

"Twelve millimetres thick" is a vague phrase. A bracket of 11.9 mm would satisfy it in conversation and fail it in a fit. Engineers made such words precise long before Russell wrote, by attaching limits. "12.00 ± 0.05 mm" divides every possible true thickness into two classes with nothing in between: from 11.95 to 12.05 mm conforms, anything else does not. In Russell's terms, the tolerance replaces a one-many relation between word and thickness with a sharp boundary.

The same move works for features that drawings often leave vague. The CB-12 drawing, revision B, carried the note "remove sharp edges". During the investigation, the customer's fitter mentioned that some edges on the first batch were noticeably sharper than others. Both batches met the note, because the note had no limits: any edge that someone had deburred was, arguably, not sharp. Revision C replaced it with "break all edges 0.2 to 0.5 mm". The vague predicate became a precise one, and the inspector gained something to check.

## Why the reading stays vague

The tolerance makes the requirement precise. It cannot make the reading precise. A micrometer that displays 12.047 mm would display the same number for a true thickness a little above or below, because of its calibration, its resolution, the operator's repeatability and the temperature of the part. The reading is one representation that fits many true values: Russell's one-many relation, in a metrology lab.

The measure of that vagueness is the measurement uncertainty. It is estimated by listing each contributor, converting each to a standard uncertainty, combining them, and multiplying by a coverage factor so that the result covers the true value with high probability.

This is an illustration. The workshop's micrometer for thickness has these contributors:

| Contributor | Value | Standard uncertainty |
| --- | --- | --- |
| Calibration certificate | 2 µm expanded at k = 2 | 2 ÷ 2 = 1.000 µm |
| Display resolution | 1 µm | 1 ÷ √12 = 0.289 µm |
| Repeatability | standard deviation 1.5 µm | 1.500 µm |
| Abbe error | none, because a micrometer measures in line with its scale | 0 µm |
| Temperature | 12 mm × 23.6 µm/m·K × 2 K = 0.566 µm | 0.566 ÷ √3 = 0.327 µm |

```figure
type: formula
title: Expanded uncertainty of the thickness micrometer
formula: U = k × √(Σ ui²)
caption: This is an illustration. The temperature term uses the expansion coefficient of 6061 aluminium and allows 2 K between part and micrometer in an unconditioned workshop.
- U | expanded uncertainty, µm
- k | coverage factor, 2 for about 95%
- ui | standard uncertainty of each contributor, µm
step: Σ ui² = 1.000² + 0.289² + 1.500² + 0² + 0.327² = 3.440 µm²
step: combined uncertainty = √3.440 = 1.855 µm
step: U = 2 × 1.855 = 3.71 µm
step: test uncertainty ratio = tolerance band ÷ 2U = 100 ÷ 7.42 = 13.5
```

An expanded uncertainty of 3.71 µm means that a reading of 12.047 mm is consistent with a true thickness anywhere from about 12.043 to 12.051 mm. The upper end of that range is outside the tolerance. The inspector's note, "12.05, in tolerance", claimed more than the reading can support.

## Deciding the borderline part

The usual remedy is a guard band. Instead of accepting any reading inside the tolerance, accept only readings that are inside the tolerance by at least the uncertainty. Readings outside the tolerance are rejected. Readings in between are neither: the measurement cannot decide them.

The [Guard-Banded Acceptance Decision](/tools/guard-band-acceptance/) tool does this calculation. Enter a nominal of 12 mm, a total tolerance band of 0.1 mm and the reading, then the contributors from the table: calibration 2 µm, resolution 1 µm, repeatability 1.5 µm, an Abbe offset of 0, a length of 12 mm, an expansion coefficient of 23.6 µm/m·K, a temperature uncertainty of 2 K, and a coverage factor of 2. It returns the uncertainty budget, the expanded uncertainty, the test uncertainty ratio, the acceptance zone and a decision of accept, reject or indeterminate. It assumes a symmetric tolerance, uncorrelated contributors and a guard band of exactly one expanded uncertainty. Your contract, your customer or the relevant standard may require a different rule, and ISO 14253-1 is the standard that deals with decision rules of this kind for dimensional specifications.

```figure
type: range
title: Tolerance, acceptance zone and three readings on the micrometer
unit: mm
min: 11.94
max: 12.06
caption: This is an illustration. The acceptance zone is the tolerance narrowed by U = 3.71 µm at each end. A reading in the strip between the zone and the limit is indeterminate.
- Tolerance | 11.95 | 12.05 | 12.00 ± 0.05 mm
- * Acceptance zone, micrometer | 11.9537 | 12.0463 | accept inside this range
- Reading 12.038 | 12.038 | 12.038 | accept
- Reading 12.047 | 12.047 | 12.047 | indeterminate
- Reading 12.053 | 12.053 | 12.053 | reject
```

For the bracket at 12.047 mm, the deviation from nominal is 47 µm. The acceptance zone extends 46.29 µm either side of nominal, and the tolerance 50 µm. The reading falls between them, so the decision is indeterminate. The honest record is not "in tolerance" but "12.047 mm, indeterminate at U = 3.7 µm".

## Failure: a precise number from a vague instrument

The more serious error in the workshop's records came from a different instrument. During the rush to re-inspect, a second inspector checked thickness on several replacement brackets with digital callipers rather than the micrometer, and recorded readings to three decimal places. One read 12.038 mm and was accepted.

Callipers display to 0.01 mm and are subject to Abbe error, because the jaws measure away from the scale. A realistic budget for these callipers is a calibration uncertainty of 20 µm, a resolution of 10 µm and a repeatability of 8 µm, with the same temperature term. That gives a combined uncertainty of 13.13 µm and an expanded uncertainty of 26.26 µm. The test uncertainty ratio falls to 100 ÷ 52.5 = 1.9, well below the minimum of 4 that the tool uses by default and many inspection plans adopt. The acceptance zone shrinks to 11.976 to 12.024 mm.

```figure
type: compare
title: The same reading of 12.038 mm on two instruments
cols: Micrometer | Callipers
caption: This is an illustration. The reading is identical; what it can tell you is not. On the callipers, a part that reads 12.038 mm cannot be accepted or rejected.
- Expanded uncertainty U | 3.71 µm | 26.26 µm
- Test uncertainty ratio | 13.5 | 1.9
- Acceptance zone | 11.954 to 12.046 mm | 11.976 to 12.024 mm
- * Decision for 12.038 mm | accept | indeterminate
```

Both instruments showed the same number. The callipers' number was far vaguer, in exactly Russell's sense: it fitted a much wider range of true thicknesses. Recording it to three decimals made it look as precise as the micrometer's. Detection is straightforward once looked for: every recorded result should carry the instrument used, and any result taken with an instrument whose test uncertainty ratio is below the plan's minimum should be flagged. The correction was to re-measure every bracket that had been checked with callipers, using the micrometer, and to add a line to the inspection plan naming the instrument for each characteristic.

## What to do with an indeterminate part

An indeterminate result is not a failure of inspection. It is an accurate report that the measurement cannot settle the question. There are four sensible responses, and the inspection plan should say in advance which applies:

1. Re-measure with a better instrument, so that the uncertainty shrinks and the reading lands in a decided zone.
2. Re-measure several times with the same instrument and use the mean, if repeatability dominates the budget; the calibration term does not shrink this way.
3. Treat indeterminate as reject, which protects the customer at the cost of scrapping some good parts.
4. Agree a decision rule with the customer, in writing, before parts are made.

For the bracket at 12.047 mm, the workshop re-measured on its height gauge and surface plate with a better-calibrated comparator, with an expanded uncertainty of about 1.5 µm. The reading was 12.046 mm, inside an acceptance limit of 12.0485 mm. The bracket was accepted, and the record shows both readings, both instruments and both uncertainties.

For a fuller treatment of guard bands, decision costs and readings near the limits, see [guard bands and the cost of errors](/reados/publications/accept-or-reject-by-the-numbers/guard-bands-and-the-cost-of-errors/) in *Accept or Reject by the Numbers*.

## Small roundings add up

Vagueness has a classic puzzle attached to it, older than Russell: the heap. One grain of sand is not a heap; adding one grain to something that is not a heap never makes it one; so no number of grains is a heap. Each step looks harmless, and the conclusion is absurd. The workshop version is quieter but real.

This is an illustration. Before the investigation, the workshop's informal practice was to accept a reading that rounded to the limit. A reading of 12.054 mm was written as "12.05" and passed, on the reasoning that the extra 4 µm was within the micrometer's error anyway. Then a reading of 12.056 mm was compared with the 12.054 mm part already accepted, found to be only 2 µm thicker, and passed too. Each step was small and each had a reason. Over a few weeks the working limit had drifted to about 12.06 mm, and nobody had decided to change it.

Russell's framework explains why the slide happens. The inspector was treating a vague reading as if it could stand in for a precise requirement, and then using the reading's vagueness as a reason to stretch the requirement. The guard band reverses the direction of the argument. Because the reading is vague, the acceptance limit moves inward, not outward. The requirement stays precise, the reading is honestly labelled, and the part that cannot be decided is named as such instead of being nudged across the line.

The correction is mechanical: the acceptance limits are printed on the inspection sheet, computed from the budget, and readings are compared with those printed numbers, not with the drawing's limits and not with the previous part.

## The limit of precision

Russell's argument has one more consequence worth keeping. No amount of instrument improvement removes vagueness; it only narrows it. A better comparator turns a 3.7 µm band into a 1.5 µm band, and a reading just inside the new band is again undecided. There will always be some parts that no available measurement can classify. A quality system that pretends otherwise forces inspectors to round, and every rounding is a small, unrecorded decision. A system that names the indeterminate zone, and says what to do in it, turns those decisions into a rule.

## Exercise: decide three replacement brackets

Three more replacement brackets read 11.951, 11.957 and 12.049 mm on the micrometer, with the same budget as above. Give the decision for each, say what the inspector should record, and say which parts would change their decision if the callipers had been used.

**Worked answer.** The acceptance zone is 12.000 ± 0.04629 mm, so 11.9537 to 12.0463 mm, and the tolerance is 11.95 to 12.05 mm. At 11.951 mm the deviation is 49 µm: inside the tolerance but outside the acceptance zone, so indeterminate. At 11.957 mm the deviation is 43 µm, inside the acceptance zone, so accept. At 12.049 mm the deviation is 49 µm, indeterminate. The record for each should show the reading, the instrument, the expanded uncertainty and the decision, for example "11.951 mm, micrometer M-07, U = 3.7 µm, indeterminate, re-measure on comparator". On the callipers, with an acceptance zone of 11.976 to 12.024 mm, all three would be indeterminate, including 11.957 mm, which the micrometer accepts. That is the practical cost of a vaguer instrument: more parts that no one can decide.
