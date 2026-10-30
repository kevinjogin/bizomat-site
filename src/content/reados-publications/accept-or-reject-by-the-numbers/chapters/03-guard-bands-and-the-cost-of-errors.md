---
book: accept-or-reject-by-the-numbers
chapterSlug: guard-bands-and-the-cost-of-errors
order: 3
title: "Guard bands and the cost of errors"
description: "Set acceptance limits inside the tolerance: the one-uncertainty guard band in the WORKOS tool, cost-based limits from the costs of each error, sensitivity to costs, and contract rules."
draft: false
---

Chapter 2 showed that accepting every reading inside the tolerance lets about 3.5 oversize BU-25 bushes through each shift, at a cost far greater than the false rejects it avoids. The usual remedy is a guard band: an acceptance zone inside the tolerance, narrower by an allowance for measurement uncertainty, so that a part is accepted only if its reading is far enough inside the limit to be confidently good. The question is how wide the guard band should be.

This chapter answers it two ways. The conventional way, a guard band of one expanded uncertainty, is calculated with the WORKOS guard-banded acceptance tool. The economic way chooses the limit that minimises the expected cost of wrong decisions, using the process prior of Chapter 2 and the costs of each kind of error. The two give quite different limits for BU-25, and the difference is worth A$96 a shift. The error is a guard band applied by rule, which turned an escape problem into a scrap problem.

## The one-uncertainty guard band

The most common guard band shrinks each limit by the expanded uncertainty U. A part is accepted only if its reading is at least U inside both limits, and rejected only if its reading is outside the tolerance. Readings between are indeterminate: inside the tolerance, but too close to a limit for the gauge to decide. The [guard-banded acceptance decision tool](/tools/guard-band-acceptance/) applies this rule to a single reading. It builds the same uncertainty budget as the measurement uncertainty budget tool, works out the acceptance zone for a symmetric tolerance about a nominal size, and reports accept, reject or indeterminate for the reading entered, with the test uncertainty ratio.

This is an illustration. BU-25's tolerance of 25.000 to 25.021 mm is entered as a nominal of 25.0105 mm with a total band of 0.021 mm, with the air gauge's budget from Chapter 2. The expanded uncertainty is 2.26 µm, so the acceptance zone is 25.0105 ± (10.5 − 2.26) µm, 25.0023 to 25.0187 mm.

```figure
type: range
title: BU-25 bore: tolerance and the one-U acceptance zone, from the guard-banded acceptance tool
unit: mm
min: 24.998
max: 25.024
ticks: 25.000 | 25.0105 | 25.021
caption: This is an illustration. Expanded uncertainty 2.26 µm at k = 2. A reading of 25.0185 is accepted, 25.0195 is indeterminate, and 25.0215 is rejected.
- Tolerance | 25.000 | 25.021 | drawing limits
- * One-U acceptance zone | 25.0023 | 25.0187 | readings here are accepted
- Upper indeterminate band | 25.0187 | 25.021 | inside tolerance, too close to call
- Process ±2σ | 25.0055 | 25.0195 | where 95% of bushes lie
```

The tool's three example readings show the rule at work. A reading of 25.0185 mm is 8.0 µm above nominal, inside the 8.24 µm half-width of the zone, and is accepted. A reading of 25.0195 mm is 9.0 µm above nominal: inside the tolerance's 10.5 µm but outside the zone, so the tool reports it as indeterminate and advises re-measuring with a better gauge. A reading of 25.0215 mm is 11.0 µm above nominal, outside the tolerance, and is rejected.

## What the one-U band does to a shift

The guard band does what it was meant to do: escapes fall from 3.54 a shift to 0.09. But the process runs close to the upper limit, and many good bushes read inside the upper indeterminate band. If indeterminate bushes are rejected, false rejects rise from 9.6 a shift to 79.8.

```figure
type: compare
title: Three acceptance rules for BU-25, per shift of 2,000 bushes
cols: Accept readings from, mm | Accept readings to, mm | Escapes | Good bushes rejected | Cost, A$ ex GST
rowhead: Rule
- Tolerance limits | 25.0000 | 25.0210 | 3.54 | 9.6 | 1,478
- One-U guard band | 25.0023 | 25.0187 | 0.09 | 79.8 | 555
- * Cost-based limits | 25.0012 | 25.0193 | 0.34 | 50.0 | 459
caption: This is an illustration. Escapes cost A$400 and false rejects A$6.50. Calculated by integrating over the bore distribution and the gauge error. The cost-based limits are derived below.
```

The one-U band cuts the cost of errors by almost two-thirds, from A$1,478 to A$555 a shift. But it is not the best rule, because its width was set by the gauge alone, without reference to the process or to the costs. It pays for its very low escape rate with 80 scrapped bushes a shift, and the last few micrometres of that guard band reject many more good bushes than they catch bad ones.

## The cost-based limit

Chapter 2 gave, for every reading, the probability that the bush is out of tolerance. Rejecting a bush costs A$6.50 if it is good; accepting it costs A$400 if it is bad. The expected cost of accepting a bush with probability p of being bad is 400p; the expected cost of rejecting it is 6.50(1 − p). Accepting is cheaper whenever 400p < 6.50(1 − p), that is whenever p is below 6.50 ÷ 406.50 = 1.6%.

```figure
type: formula
title: The cost-based acceptance rule
formula: Reject when P(bad | reading) > c_FR ÷ (c_FR + c_FA)
formula: BU-25: 6.50 ÷ (6.50 + 400) = 0.016
caption: The limit is the reading at which the probability of a bad part, worked out with the process prior as in Chapter 2, equals the cost ratio. Every reading has its own probability, so the rule gives one limit on each side.
- c_FA | cost of accepting a bad part
- c_FR | cost of rejecting a good part
- P(bad given reading) | from the reading, the gauge's uncertainty and the process distribution
```

For BU-25, the probability of being oversize reaches 1.6% at a reading of 25.0193 mm, and the probability of being undersize reaches 1.6% at 25.0012 mm. These are the cost-based limits. They sit inside the tolerance, like a guard band, but they are asymmetric: the upper limit is 1.66 µm inside the tolerance and the lower only 1.24 µm. Near the lower limit, 3.6 standard deviations from the process mean, the prior pulls every reading strongly back towards the mean, so a reading must come closer to the limit before an undersize bush becomes likely.

The cost-based limits cost A$459 a shift, A$96 less than the one-U band and A$1,019 less than the tolerance limits. They accept 0.34 escapes and reject 50 good bushes a shift: more escapes than the one-U band, but 30 fewer false rejects, a trade the costs say is worth making.

## The shape of the cost curve

Moving the upper acceptance limit traces out the trade between the two errors.

```figure
type: compare
title: Cost of wrong decisions per shift by upper acceptance limit, lower limit 25.0012 mm
cols: Escapes | Good bushes rejected | Cost, A$ ex GST
rowhead: Upper limit, mm
- 25.0210 | 3.46 | 11.0 | 1,457
- 25.0205 | 1.99 | 18.4 | 916
- 25.0200 | 1.01 | 29.2 | 592
- 25.0195 | 0.45 | 44.2 | 466
- * 25.0193 | 0.34 | 50.0 | 459
- 25.0190 | 0.18 | 64.1 | 488
- 25.0187 | 0.11 | 76.6 | 541
- 25.0185 | 0.07 | 89.6 | 610
- 25.0180 | 0.03 | 121.6 | 804
caption: This is an illustration. The cost falls steeply as the limit moves inside the tolerance, is flat for about half a micrometre around its minimum, and rises again as false rejects mount.
```

The curve is steep on the tolerance side, because each micrometre removes a large share of the escapes, and shallower inside, because false rejects rise steadily. Its bottom is flat: any upper limit from 25.0192 to 25.0195 mm costs within A$7 a shift of the minimum. That flatness is useful, because it means the limit does not need to be calculated to a fraction of a micrometre, and it can be rounded to a value the gauge displays and operators can remember.

## Putting the limits on the gauge

A limit worked out to a tenth of a micrometre has to be applied by a gauge that displays in steps and by operators who read it quickly. The air gauge displays in steps of 0.5 µm, so a limit of 25.0193 mm cannot be shown as such: the practical choice is between accepting readings up to 25.0190 mm and accepting readings up to 25.0195 mm. The flat bottom of the cost curve makes the choice easy. Accepting up to 25.0195 mm costs A$466 a shift and accepting up to 25.0190 mm costs A$488, so the shop chose 25.0195 mm on the upper side and, by the same reasoning, 25.0010 mm on the lower side, where the display's step makes little difference because so few bushes are near it.

The limits are set as coloured bands on the gauge's column display, green between the acceptance limits and red outside them, so the operator's decision is a glance rather than a comparison of numbers. They are written into the inspection instruction with their reason: cost-based acceptance limits, calculated from a dated capability study, a dated gauge budget and costs agreed by quality and production on a stated date. That record matters, because each of those inputs will change. If the process is recentred, as Chapter 10 proposes, the prior changes and the limits must be recalculated; if a better gauge is bought, the uncertainty changes; if the customer's charges change, the costs change. Limits without a record of their inputs tend to stay in place long after the inputs that justified them have gone.

## How the costs move the limit

The limit depends on the ratio of the costs, and the costs are estimates.

```figure
type: compare
title: Cost-based upper and lower limits for different escape costs, false reject A$6.50
cols: Reject above probability | Lower limit, mm | Upper limit, mm
rowhead: Cost of an escape, A$
- 60 | 9.8% | 25.0002 | 25.0203
- * 400 | 1.6% | 25.0012 | 25.0193
- 1,000 | 0.65% | 25.0016 | 25.0189
- 2,000 | 0.32% | 25.0019 | 25.0187
caption: This is an illustration. A thirty-fold range of escape costs moves the upper limit by only 1.6 µm. The answer is robust to rough cost estimates.
```

A thirty-fold change in the escape cost moves the upper limit by only 1.6 µm, because the probability of being oversize changes very quickly with the reading near the limit. Rough estimates of the costs are therefore good enough, which is fortunate, because the cost of an escape is the hardest number in quality to pin down. It includes the customer's sorting and downtime, freight, the shop's investigation, and a share of the risk to the relationship. A shop that cannot agree on it can work out the limit for a low and a high estimate and pick a value between them, knowing that the cost of being somewhat wrong is small.

## Contracts and decision rules

The cost-based limit is the shop's own business decision, and it applies where the contract leaves the acceptance rule to the supplier. Some contracts and drawings call up formal decision rules. ISO 14253-1 sets out decision rules for proving conformity or nonconformity with geometrical specifications in the light of measurement uncertainty, and where a contract invokes it, the rule it specifies governs, whatever the cost calculation says. Customers may also specify a guard band or a minimum test uncertainty ratio. The calculation in this chapter is then still useful, because it shows the cost of the contractual rule against the economic one, which is information worth having in the next contract negotiation. For BU-25, a contractual requirement to prove conformity with a one-U guard band, with indeterminate bushes rejected, would cost about A$96 a shift more than the cost-based limits, roughly A$24,000 a year on one shift a day, a figure that can be weighed against what the customer gains from the stricter rule. Inspection near the limits is also covered, for first-article measurements without process history, in *Inspecting to the Drawing*.

## Indeterminate readings

A guard band divides readings into three groups: accept, reject and, between them, an indeterminate band. What happens to the indeterminate bushes decides much of the cost. Rejecting them all, as in the table above, is the simplest rule. Re-measuring them on a better gauge resolves most of them, at the cost of the extra measurement time, and Chapter 10 shows that a two-stage plan of this kind halves the cost again. Re-measuring them on the same gauge until one reading falls inside the zone is the worst option of all, as Chapter 5 shows, because it turns the gauge's random error into a way of accepting bad bushes.

## The error: a guard band applied by rule

This is an illustration. After the returned batch described in Chapter 2, the quality manager introduced a one-U guard band on both limits, with indeterminate bushes rejected. Escapes stopped. Within a month, the production manager asked why the scrap bin by the air gauge was filling so fast: about 80 bushes a shift, against fewer than 10 before.

The quality engineer worked out the table above and showed that the guard band, though it had fixed the escapes, cost A$555 a shift in wrong decisions, almost all of it in scrapped good bushes, while the cost-based limits would cost A$459. The guard band's width had been set by the gauge's uncertainty alone, with no account of the costs or of where the process ran. The shop adopted the cost-based limits, rounded to the gauge's display steps as 25.0010 and 25.0195 mm and shown as green bands on the air gauge's column, and the scrap bin returned to about 44 bushes a shift, most of them destined for the bench gauge check of Chapter 10. The rounded limits give 0.46 escapes and 43.8 false rejects a shift, A$467, against A$459 for the unrounded ones. The later chapters compare other plans with the unrounded limits of 25.0012 and 25.0193 mm, so that the comparisons are not blurred by the display's steps.

The deeper lesson is about who sets acceptance limits. A guard band chosen by the metrologist from the gauge alone answers a metrology question, how far inside the limit a reading must be for conformity to be proven. The cost-based limit answers a business question, which decision loses the least money on average. Both are legitimate, and contracts sometimes require the first. But where the shop is free to choose, the limit should be set jointly by the people who understand the gauge, the process and the costs, and it should be revisited whenever any of the three changes.

## Exercise: a costlier escape

This is an illustration. The cylinder maker introduces a charge of A$1,000 for every nonconforming bush found at its plant.

1. What is the new probability threshold for rejecting a bush?
2. The cost-based limits become 25.0016 and 25.0189 mm. Per shift, these give 0.146 escapes and 68.1 false rejects. What is the cost?
3. What would the old limits, 25.0012 to 25.0193 mm, cost under the new charge, and the tolerance limits?

**Worked answer.**

1. 6.50 ÷ (6.50 + 1,000) = **0.65%**.
2. 0.146 × 1,000 + 68.1 × 6.50 = 146 + 443 = **A$589** a shift, excluding GST.
3. Old limits: 0.335 × 1,000 + 50.0 × 6.50 = 335 + 325 = **A$660**. Tolerance limits: 3.54 × 1,000 + 9.59 × 6.50 = 3,540 + 62 = **A$3,602**. Moving the limits by less than half a micrometre saves A$71 a shift; staying at the tolerance limits would cost A$3,013 a shift more than the new limits.
