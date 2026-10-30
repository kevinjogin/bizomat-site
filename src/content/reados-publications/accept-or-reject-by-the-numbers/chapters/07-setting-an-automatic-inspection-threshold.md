---
book: accept-or-reject-by-the-numbers
chapterSlug: setting-an-automatic-inspection-threshold
order: 7
title: "Setting an automatic inspection threshold"
description: "Set an automatic check's reject threshold: score distributions, the trade-off curve, the cost-based threshold, how the defect rate moves it, review bands and the cost of a wrong prior."
draft: false
---

An automatic check, whether a camera, an eddy-current probe, a leak tester or a weighing station, rarely gives a pass or fail directly. It measures something, computes a score and compares the score with a threshold. Everything about its performance, its sensitivity, its false-call rate and the money its errors cost, depends on where the threshold sits. Thresholds are often left at the supplier's setting, or nudged up whenever operators complain about false calls and down whenever a customer complains about an escape. Neither is a method.

This chapter sets the threshold of BU-25's vision system by the same cost reasoning as Chapter 3's acceptance limits. It describes the camera's score distributions and the trade-off curve they produce, finds the threshold with the least expected cost, shows that the best threshold depends on the defect rate as much as on the camera, and prices the mistake of tuning for the wrong defect rate. The error is a threshold left alone while the process changed under it.

## Scores on good and bad bushes

This is an illustration. The vision system scores each bore for chatter on an arbitrary scale. Running it on several hundred bushes whose true state was known from a microscope showed that good bushes score around 20, with a standard deviation of about 6, and bushes with chatter score around 45.5, with a standard deviation of about 8. The two distributions overlap: some good bushes, with a reflective mark or a fleck of coolant, score in the thirties, and some mild chatter scores below 35.

```figure
type: line
title: The share of each kind of bush scoring above a threshold
x: Threshold score
y: Share above the threshold, %
ymin: 0
ymax: 100
legend: Bushes with chatter: sensitivity | Good bushes: false-call rate
caption: This is an illustration, from normal distributions fitted to the audit scores: good bushes mean 20, standard deviation 6; chatter mean 45.5, standard deviation 8. Raising the threshold lowers both curves.
- 26 | 99.3 | 15.9
- 28 | 98.6 | 9.1
- 30 | 97.4 | 4.8
- 32.3 | 95.1 | 2.0
- 34 | 92.5 | 0.98
- 36 | 88.2 | 0.38
- 38 | 82.6 | 0.13
- 40 | 75.4 | 0.04
- 42 | 66.9 | 0.01
```

At the camera's current threshold of 32.3, it catches 95.1% of chatter and falsely calls 2.0% of good bushes, the figures used in Chapters 1 and 6. Every other threshold gives a different pair. Plotting sensitivity against false-call rate for all thresholds gives the check's trade-off curve, often called its receiver operating characteristic. The area under that curve, 0.995 here, is a single-number summary of how well the scores separate good from bad: it is the probability that a randomly chosen chatter bush scores higher than a randomly chosen good one. It describes the camera, not the threshold.

## The cost of a threshold

For any threshold, the expected cost per shift is the false rejects times their cost plus the escapes times theirs. With 2,000 bushes, a base rate p of chatter, a false-reject cost of A$6.50 and an escape cost of A$400:

```figure
type: formula
title: Expected cost of a threshold, and the condition for the best one
formula: Cost per shift = 2,000 × [(1 − p) × false-call rate × 6.50 + p × (1 − sensitivity) × 400]
formula: At the best threshold, likelihood ratio of the score = (1 − p) × c_FR ÷ (p × c_FA)
caption: The likelihood ratio of a score is the height of the chatter score distribution there divided by the height of the good one. The best threshold is the score at which a bush is exactly as costly to accept as to reject.
- p | base rate of chatter
- c_FR, c_FA | costs of a false reject and of an escape
```

At the 0.6% base rate, the condition asks for a likelihood ratio of 0.994 × 6.50 ÷ (0.006 × 400) = 2.69. The score with that ratio is about 33.3. At that threshold, the camera catches 93.6% of chatter and falsely calls 1.33% of good bushes.

```figure
type: compare
title: The vision system at its current and its cost-based threshold, at 0.6% chatter
cols: Sensitivity | False-call rate | Good bushes rejected a shift | Escapes a shift | Cost, A$ ex GST
rowhead: Threshold
- 30.0 | 97.4% | 4.8% | 95.0 | 0.32 | 744
- 32.3, current | 95.1% | 2.0% | 40.1 | 0.59 | 498
- * 33.3, cost-based | 93.6% | 1.33% | 26.5 | 0.76 | 478
- 37.2 | 85.0% | 0.21% | 4.1 | 1.80 | 746
caption: This is an illustration. Moving the threshold from 32.3 to 33.3 rescues about 14 good bushes a shift at the price of 0.17 more escapes, saving about A$20 a shift.
```

The current threshold turns out to be close to the best, which is reassuring, and the cost curve is flat near its minimum, as Chapter 3's was. Moving to 33.3 saves about A$20 a shift. The table also shows how steeply the cost rises away from the best: three points lower and the false calls more than double; four points higher and the escapes triple.

## The defect rate moves the threshold

The condition for the best threshold contains the base rate. When chatter is rare, a high score is needed before a bush is more likely bad than the costs allow, so the threshold rises. When chatter is common, a lower score is enough, so the threshold falls. The camera has not changed; the meaning of its scores has.

```figure
type: compare
title: Cost-based threshold by base rate of chatter
cols: Best threshold | Sensitivity | False-call rate | Cost a shift at that rate, A$
rowhead: Base rate
- 0.06% | 37.2 | 85.0% | 0.21% | 99
- * 0.6%, normal running | 33.3 | 93.6% | 1.33% | 478
- 3%, worn boring bars | 30.3 | 97.1% | 4.3% | 1,232
- 5% | 29.2 | 97.9% | 6.3% | 1,605
caption: This is an illustration. The same camera, the same costs, four different defect rates. A tenfold change in the base rate moves the best threshold by about four score points.
```

This is the inspection version of a result from decoding theory: the best decoder uses the true noise level and the true prior, and a decoder that assumes the wrong ones does worse even if its hardware is perfect. For the camera, the hardware is the score; the prior is the base rate; and the decoder is the threshold.

## The cost of a wrong prior

How much does a wrong base rate cost? The answer follows from applying a threshold tuned for one rate to bushes from a process running at another.

```figure
type: compare
title: Cost per shift at the true 0.6% chatter rate, by the rate the threshold was tuned for
cols: Threshold | Good bushes rejected | Escapes | Cost, A$ ex GST
rowhead: Tuned for
- 0.06% | 37.2 | 4.1 | 1.80 | 746
- * 0.6%, the true rate | 33.3 | 26.5 | 0.76 | 478
- 5% | 29.2 | 124.4 | 0.25 | 909
caption: This is an illustration. A threshold tuned for a process ten times better than the real one lets escapes through; one tuned for a process eight times worse floods the reject bin. Both cost far more than the matched threshold.
```

Assuming too low a defect rate costs A$268 a shift extra, mostly in escapes; assuming too high a rate costs A$431 extra, mostly in false rejects. Neither is a small error. The lesson is that tuning a threshold is not a one-off calibration of the instrument. It is a statement about the process the instrument is inspecting, and it must be revisited when the process changes.

Thresholds set by a supplier during commissioning deserve particular suspicion. They are often tuned on demonstration parts, collected to include plenty of defects so that the system can be shown catching them. A demonstration set with 5% defective parts, tuned to look good, produces exactly the second error in the table when it meets a 0.6% process.

## Two thresholds and a review band

A single threshold forces every bush into accept or reject, including the bushes whose scores say little either way. A second threshold creates a review band between them: bushes scoring clearly low are accepted, bushes scoring clearly high are rejected, and the uncertain ones in between are sent for a closer look. It is the pass–fail version of Chapter 3's indeterminate band, and it is usually far cheaper than any single threshold.

This is an illustration. Suppose bushes scoring below 30 are accepted, those above 40 are rejected, and those between go to a microscope check at the inspection bench, taking about 15 seconds each and treated here as reliable.

```figure
type: compare
title: One threshold against a review band, at 0.6% chatter
cols: Bushes reviewed a shift | Good bushes rejected | Escapes | Review time, A$ | Total cost, A$ ex GST
rowhead: Scheme
- One threshold at 33.3 | 0 | 26.5 | 0.76 | 0 | 478
- * Accept below 30, reject above 40, review between | 96.8 | 0.85 | 0.32 | 32 | 164
caption: This is an illustration. The review band catches most of what the single threshold misses and rescues most of what it falsely rejects, for about 25 minutes of microscope time a shift. The microscope check is assumed to decide correctly; its own errors would add a little to the cost.
```

The review band cuts the cost by about two-thirds. It works because it spends the expensive check only on the bushes whose scores are ambiguous, the same principle as sending only disagreements to the operator in Chapter 6, and as the two-stage gauging plan of Chapter 10. The width of the band is a trade between review time and errors: a wider band reviews more bushes and makes fewer mistakes, and the best width is where an extra review costs about what it saves.

## Measuring the score distributions

Every number in this chapter depends on the two score distributions, and they deserve the same care as a gauge study. They are measured by running the camera on a set of bushes whose true state is known, ideally drawn from normal production rather than chosen for the purpose, plus enough confirmed chatter bushes to describe the chatter distribution: Chapter 6's point about scarce defects applies here too. The good-bush distribution is easy to fill out, because good bushes are plentiful; the chatter distribution is harder, and its lower tail, where mild chatter scores close to good bushes, matters most for the threshold.

Normal curves are a convenient description, but the threshold sits where the two curves' tails meet, and tails are where real distributions most often depart from the normal shape. It is worth checking the fitted curves against the actual counts near the threshold, and preferring the counts where they disagree. The distributions also change when the camera does: a new lens, cleaned optics, a moved light or a software update can shift every score. The score distributions should be re-measured after any such change, and a small reference set of known good and known chatter bushes kept beside the camera makes a quick check possible at any time.

## Adapting the threshold

Since the best threshold depends on the base rate, a threshold that adapts to the current rate would be better than a fixed one. Two simple versions are practical. The first uses a small number of preset thresholds, one for normal running and one for known high-risk conditions, such as the first hour after a set-up or the last part of a boring bar's life, switched by the operator or the machine's tool counter. The second estimates the current base rate from recent audit results, as Chapter 8 describes, and moves the threshold when the estimate changes by more than an agreed amount.

Both need care. A threshold that falls as the reject rate rises can feed on itself: more rejects make the estimated defect rate rise, which lowers the threshold, which makes more rejects. The base rate used for tuning must therefore come from confirmed defects in audits, not from the camera's own rejects, which, as Chapter 1 showed, are mostly false calls.

## Who owns the threshold

Because a threshold is a business decision as well as a technical setting, it needs an owner and a change record. In many shops, anyone with the camera's password can move it, and it drifts with whoever complained last: up after a morning of false calls, down after a customer escape. Each move may be sensible on the day, but nobody can later say why the threshold is where it is, or whether the last change made things better.

A simple discipline fixes this. The threshold is set by the quality engineer, from audit data and agreed costs, by the method in this chapter. Every change is recorded with its date, the old and new values, the evidence and the expected effect on false rejects and escapes. Operators who see too many false calls or suspect escapes report them, with the bushes kept for examination, rather than adjusting the threshold themselves. And the effect of each change is checked at the next audit, so that the record becomes a history of what worked.

The operators' reports are valuable data in their own right. False calls that operators set aside show which features fool the camera, and can be sent to the camera's supplier for retraining or used to adjust lighting; suspected escapes, confirmed or not, refine the chatter score distribution. A camera that is fed back its mistakes in this way improves; one whose threshold is merely nudged does not. Over a year, the feedback can do more for the camera's performance than any threshold, because it moves the two score distributions apart rather than choosing a point on their overlap.

## The error: a threshold left alone

This is an illustration. One month, a batch of boring inserts from a new supplier wore faster than usual, and chatter rose from 0.6% to about 3% of bushes for two weeks before the cause was found. The vision system's threshold had recently been moved to the cost-based 33.3. Nobody thought to change it.

At 3% chatter, a threshold of 33.3 lets 3.8 bushes with chatter through each shift, against 1.7 at the threshold of 30.3 that suits a 3% rate. The cylinder maker found several of them at assembly and complained. The investigation that followed found the inserts, and also showed that the threshold had cost about A$463 a shift more than a threshold tuned for 3% would have: A$1,695 against A$1,232.

The correction had two parts, in the right order. First the process: the inserts were replaced and the supplier's batch was returned, which brought chatter back to 0.6% and was worth far more than any threshold. Then the inspection: a second, lower threshold of 30.3 was set up in the camera for use whenever the audit, or the tool counter, shows that the process is running at a higher defect rate, with a rule for switching back. The lesson is that an automatic check is tuned to a process, and when the process changes, the tuning is wrong in exactly the direction that hurts.

## Exercise: tuning for 3%

This is an illustration. Suppose chatter runs at 3% for a period, with the same costs and score distributions.

1. What likelihood ratio does the best threshold need?
2. At a threshold of 30.0, the camera's sensitivity is 97.4% and its false-call rate 4.8%. What are the false rejects, escapes and cost per shift?
3. Compare with the current threshold of 32.3 at the same 3% rate, where sensitivity is 95.1% and the false-call rate 2.0%.

**Worked answer.**

1. 0.97 × 6.50 ÷ (0.03 × 400) = 6.305 ÷ 12 = **0.525**. The best threshold is the score whose likelihood ratio is 0.525, which for these distributions is about 30.3.
2. Good bushes: 2,000 × 0.97 = 1,940, of which 4.78% are rejected: **92.7**. Chatter bushes: 60, of which 2.63% escape: **1.58**. Cost: 92.7 × 6.50 + 1.58 × 400 = 603 + 632 = **A$1,235** a shift.
3. At 32.3: false rejects 1,940 × 0.0202 = **39.2**; escapes 60 × 0.0495 = **2.97**; cost 39.2 × 6.50 + 2.97 × 400 = 255 + 1,188 = **A$1,442**. The lower threshold saves about A$207 a shift while chatter runs at 3%, even though it rejects 53 more good bushes, because each escape costs as much as about 62 false rejects.
