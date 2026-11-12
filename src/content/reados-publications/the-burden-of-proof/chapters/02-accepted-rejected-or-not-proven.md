---
book: the-burden-of-proof
chapterSlug: accepted-rejected-or-not-proven
order: 2
title: "Accepted, rejected or not proven: three verdicts on a reliability claim"
description: "Why not believing a claim differs from believing it false, how confidence bounds on MTBF give three verdicts rather than two, and what evidence each verdict needs, using a controller's field data."
draft: false
---

Most purchasing decisions treat claims as true or false. A supplier says its controller has an MTBF of 150,000 hours; the buyer either believes it or does not. That two-way choice hides a third verdict, and the third is often the right one: the evidence does not yet settle the question. Reaching it honestly, and saying so, avoids two expensive mistakes. One is accepting a claim the data do not support. The other is rejecting a claim the data do not refute.

This chapter sets out the three verdicts, applies them to the supplier's controller using confidence bounds from its field data, and ends with a plant that turned "not proven" into "false" and bought something worse.

## Not believing is not disbelieving

In his introduction to *The Cambridge Companion to Atheism*, Michael Martin distinguishes two positions that are often run together. One is the absence of a belief: not believing that something is so. The other is a positive belief that it is not so. He notes that to defend the second, two tasks are needed: the reasons for the claim must be refuted, and reasons against it must be given. Refuting the case for a claim establishes only the first position. Martin also observes that the position of neither believing nor disbelieving is a third option, compatible with the first but not the second.

The engineering version is exact. A buyer can be in one of three positions about a claim.

- **Accepted.** The evidence supports the claim to the standard the decision needs.
- **Rejected.** The evidence shows that the claim is false, to that standard. This needs evidence against the claim, not just a lack of evidence for it.
- **Not proven.** The evidence neither supports nor refutes the claim to the standard needed. The question stays open.

```figure
type: tree
title: Three verdicts and what each one needs
caption: Rejection needs more than the failure of acceptance. Most claims tested on limited data end in the middle branch.
- What does the evidence show about the claim?
  - It supports the claim to the standard needed | Accepted
    - Needs: evidence for the claim, strong enough for the stakes
  - It shows the claim is false to the standard needed | Rejected
    - Needs: the case for the claim refuted, and evidence against it
  - It does neither | Not proven
    - Needs: nothing more to reach; it is where the evidence leaves you
```

## The controller's claim and its data

This is an illustration. The supplier claims an MTBF of 150,000 hours for the monitoring controller. After the plant engineer's letter in Chapter 1, the supplier sends its field data. It comes from controllers installed under the supplier's own service contracts, where every failure is attended by the supplier's technicians and logged. That meets Craig's condition from Chapter 1: if a controller had failed, the failure would be in the record. The data cover 600,000 operating hours in total across the contracted units, counted from their run-hour logs rather than from shipment dates, with two failures.

The point estimate is simple: 600,000 hours ÷ 2 failures = 300,000 hours, twice the claim. That looks like strong support. It is not, because two failures are very few, and the estimate from two failures is highly uncertain.

## Confidence bounds turn one number into three verdicts

The [MTBF confidence bounds tool](/tools/mtbf-confidence-bounds/) in BIZOMAT Tools calculates confidence bounds on the mean time between failures for repairable equipment with a constant failure rate, from the total operating hours and the number of failures in a record that ends at a fixed time. It gives the MTBF and failure-rate estimates, a one-sided lower bound at the confidence you choose, the matching two-sided interval, the bound if no failures were recorded, and the further failure-free hours needed to demonstrate a required MTBF. Its limitations are stated: it assumes a constant failure rate, so a trend of improving or worsening reliability must be ruled out first; and the bounds are exact for records that end at a fixed time, approximate for records that end at a failure.

The plant engineer enters 600,000 hours, two failures and the required 150,000 hours, first at 90% confidence.

```figure
type: compare
title: Bounds on the controller's MTBF from 600,000 hours and two failures
cols: Lower bound | Upper bound | Claim of 150,000 h
caption: This is an illustration. From the MTBF confidence bounds tool. At every usual confidence level the claim lies between the bounds, so the data neither demonstrate nor refute it.
- 80% one-sided | 140,218.7 h | 727,812.4 h | Inside
- * 90% one-sided | 112,732.8 h | 1,128,219.1 h | Inside
- 95% one-sided | 95,301.7 h | 1,688,421.5 h | Inside
- 99% one-sided | 71,378 h | 4,038,915.2 h | Inside
```

At 90% confidence, the lower bound is 112,733 hours. The data do not show, with 90% confidence, that the MTBF is at least 150,000 hours, so the claim is not accepted at that standard. But the 90% upper bound is 1,128,219 hours, far above the claim, so the data do not show that the MTBF is below 150,000 hours either. The claim is not rejected. The verdict is not proven.

The tool also reports that about 198,348 more operating hours without a failure would demonstrate the claim at 90% confidence. At 95% it would be about 344,369 hours. That is useful: it tells the supplier what further evidence would settle the question, and tells the buyer roughly how long it would take to gather.

### Why the estimate misleads

The point estimate of 300,000 hours is twice the claim, yet the claim is not proven. This is the commonest misreading of reliability data. With two failures, the plausible range of the true MTBF is very wide: the 80% two-sided interval runs from about 113,000 to 1,128,000 hours. Two failures could easily have been four by chance, which would halve the estimate, or one, which would double it. The estimate is the centre of a wide range, not a measurement.

```figure
type: range
title: Plausible range of the controller's MTBF
min: 0
max: 1200
unit: thousand h
ticks: 0 | 300 | 600 | 900 | 1200
caption: This is an illustration. The 80% two-sided interval from the MTBF confidence bounds tool at 90% one-sided confidence. The claim and the point estimate both sit well inside it.
- 80% interval | 112.7 | 1128.2
- * Claim | 150 | 150
- Point estimate | 300 | 300
```

## The confidence level is a choice, made before the data

The verdict depends on the confidence level, and the confidence level is chosen by the buyer, not supplied by statistics. At 80% the lower bound is 140,219 hours; at 99% it is 71,378 hours. A buyer who wanted to accept the claim might be tempted to keep lowering the confidence until the lower bound reached 150,000 hours. A buyer who wanted to reject it might keep raising the confidence for the upper bound until it fell below. Both would be choosing the verdict first and the standard afterwards.

The remedy is to choose the confidence level before looking at the data, on the basis of the decision's stakes. For a monitoring controller whose failure costs some lost savings, 80% or 90% is a reasonable standard. For a safety function, the standard would be higher and would usually be set by the applicable functional safety requirements, not by the buyer's judgement alone. The plant engineer writes her choice of 90% into her evaluation note before the supplier's data arrive, along with the verdicts each result would lead to. That way the conclusion follows from a standard she set in advance, and anyone reviewing the decision can see that it did.

A related trap is to use a two-sided interval when the question is one-sided. The buyer's question about acceptance is one-sided: is the MTBF at least 150,000 hours? A two-sided 90% interval puts 5% of the uncertainty in each tail and gives a lower bound equal to the one-sided 95% bound, a stricter standard than intended. The tool reports both, labelled, so the user can pick the one that matches the question. The plant engineer uses the one-sided bounds for both verdicts: the lower bound for acceptance, the upper bound for rejection.

None of this makes the decision mechanical. It makes it transparent. The verdict says what the evidence shows at a stated standard; the decision then weighs that verdict against the consequence of being wrong and the cost of waiting.

## Check the model before the bounds

The bounds are only as good as the constant-failure-rate assumption behind them. For electronic controllers after an initial burn-in, a roughly constant failure rate is often a fair model, because failures come from random events rather than wear. But it must be checked, as the tool's limitations say. The plant engineer asks two questions of the supplier's data.

- **When did the two failures occur?** If both were in the first few hundred hours of their units' lives, they suggest early-life failures, and the constant-rate model would understate later reliability. If both were late, they might suggest wear-out of a component such as a capacitor or fan, and the model would overstate it. The supplier's log shows one at about 11,000 hours and one at about 26,000 hours on different units, which fits a random pattern.
- **Are the hours comparable to this site?** The contracted units run in plant rooms of similar temperature. A controller in a hot motor control centre would fail sooner. The factory's controller would sit in an air-conditioned switch room, so the data are a fair guide.

With those answers, the bounds stand. The verdict remains not proven.

## What follows from not proven

Not proven is a verdict on the evidence, not a decision. What the factory does with it depends on the consequence of being wrong, which Chapter 5 develops, and on whether a decision can wait, which Chapter 8 does.

For the controller, the consequence is modest. It monitors the drives and adjusts their speed; if it fails, the supplier's design reverts the drives to a fixed speed, the pumps keep running, and the factory loses some energy saving until a technician attends. So the plant engineer does not need the claim proven before buying. She needs three things: confirmation that the controller fails to a safe fixed speed, a warranty that covers the first years, and a record of the factory's own controller hours and any failures, which will add to the evidence over time.

Had the controller been in charge of something whose failure stopped production or created a hazard, the same verdict would have led to a different decision: a demand for more evidence, a redundant controller, or a different product.

## The failure case: not proven treated as false

This is an illustration. A neighbouring plant faced a similar choice two years earlier. A supplier claimed an MTBF of 100,000 hours for a drive controller and offered field data of 250,000 hours with two failures. The plant's engineer calculated a 90% lower bound below 100,000 hours, concluded that the claim was false, and bought a competitor's controller instead. The competitor's controller came with no field data at all, only a calculated prediction from a parts-count method.

The engineer had applied the standard of evidence to one product and not the other. The first product's claim was not proven, which is not the same as false; its upper bound was far above the claim. The second product's claim had not been tested by field data at all. On the evidence available, the first product was the better supported of the two. Within two years the second controller had failed three times.

### How it is detected and corrected

The error is detected by always reporting both bounds, never only the lower one, and by stating the verdict in one of the three words. A claim is rejected only when the upper bound at the chosen confidence falls below it. The correction is to compare alternatives on the same footing: the same kind of evidence, the same confidence, the same three verdicts. If one supplier's claim is not proven by its data and another's is untested, the second is not better supported; it is less supported.

## Asking for the evidence that would settle it

The tool's last result, the further failure-free hours needed, turns a not-proven verdict into a request. The plant engineer asks the supplier whether its contracted fleet will accumulate another 200,000 hours or so in the coming year, and whether it will share the updated record. If no further failures occur in that time, the claim will be demonstrated at 90% confidence. If failures do occur, the bounds will move, and the verdict may change either way. Either outcome improves the factory's knowledge, and neither requires the factory to wait before deciding on the drives.

This is the honest use of a confidence bound. It does not pretend to settle a question the data leave open. It says how open the question is, which way the evidence leans, and what it would take to close it.

## Exercise: two other data sets

Use the MTBF confidence bounds tool at 90% one-sided confidence, against a claim of 150,000 hours.

1. The supplier's record had shown 600,000 hours with five failures. What are the estimate, the bounds and the verdict?
2. It had shown 600,000 hours with no failures. What are the bound and the verdict?

**Worked answer.**

1. The estimate is 120,000 hours, below the claim. The 90% lower bound is 64,692 hours and the 90% upper bound 246,651 hours. The claim of 150,000 hours lies between them, so the verdict is still not proven, even though the estimate is below the claim. The evidence now leans against the claim but does not refute it at this confidence. The tool reports that about 791,201 further failure-free hours would be needed to demonstrate the claim, which is a long way off.
2. With no failures, the tool gives a 90% lower bound of 260,577 hours, the total hours divided by −ln(0.10). That is above 150,000 hours, so the claim is demonstrated at 90% confidence and the verdict is accepted, at that standard. There is no upper bound, because no failure has yet been seen. Before relying on it, check that failures would have been recorded and that the hours were counted from run-hour logs.
