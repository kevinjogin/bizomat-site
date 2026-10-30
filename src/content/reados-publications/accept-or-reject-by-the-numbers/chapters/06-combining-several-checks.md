---
book: accept-or-reject-by-the-numbers
chapterSlug: combining-several-checks
order: 6
title: "Combining several checks"
description: "Combine several imperfect checks with likelihood ratios: the evidence in each pass or fail, posteriors for every pattern, cost-based rules, checking only disagreements, and correlated checks."
draft: false
---

Many inspection stations use more than one check on the same feature. BU-25's bores are looked at by the vision system, felt by a roughness probe and, on some shifts, glanced at by an operator. Each check is imperfect in its own way, and each sometimes contradicts the others. The question is how to combine their verdicts into one decision, and the common answers, reject if any check fails, accept unless all fail, or take a majority, are each right only by accident.

This chapter combines checks properly, with likelihood ratios. It works out how much evidence each check's pass or fail carries, calculates the probability of chatter for every pattern of results, applies the cost-based rule of Chapter 3, and designs a station that sends only the disagreements to the operator. The error is two checks that looked independent but saw the same thing.

## The evidence in a pass and a fail

Chapter 1 showed that Bayes' rule in odds form multiplies the prior odds by a likelihood ratio. Each check has two likelihood ratios, one for each result. A fail multiplies the odds by the check's sensitivity divided by its false-call rate; a pass multiplies them by its miss rate divided by its true-pass rate. If the checks' errors are independent given the bush's true state, the ratios of several checks simply multiply.

```figure
type: formula
title: Combining independent checks
formula: Likelihood ratio of a fail, LR+ = sensitivity ÷ false-call rate
formula: Likelihood ratio of a pass, LR− = (1 − sensitivity) ÷ (1 − false-call rate)
formula: Posterior odds = prior odds × LR₁ × LR₂ × LR₃ × …
caption: Each check contributes its LR+ if it failed the bush and its LR− if it passed it. Independence means that, among bad bushes and among good bushes separately, one check's result tells nothing about another's.
- Prior odds | base rate ÷ (1 − base rate)
- LR greater than 1 | evidence of a defect
- LR less than 1 | evidence of a good part
```

This is an illustration. The three checks on BU-25's bores for chatter were each characterised on bushes whose true state was known from a microscope.

```figure
type: compare
title: Three checks for chatter, with the evidence each result carries
cols: Sensitivity | False-call rate | LR of a fail | LR of a pass
rowhead: Check
- Vision system | 95% | 2% | 47.5 | 0.051
- Roughness probe | 85% | 3% | 28.3 | 0.155
- Operator's look | 70% | 5% | 14.0 | 0.316
caption: This is an illustration. The vision system is the strongest check in both directions. The operator's look carries the least evidence: a fail multiplies the odds by 14, a pass divides them by about 3.
```

A fail from the camera multiplies the odds of chatter by 47.5; a pass divides them by about 20. The operator's look is much weaker: a fail multiplies by 14, but a pass only divides by 3, because the operator misses three in ten bushes with chatter. That asymmetry is common: checks are usually better at confirming a defect than at clearing a part, or the reverse, and the likelihood ratios show which.

## Every pattern of results

With three pass–fail checks, every bush falls into one of eight patterns. Starting from prior odds of 0.006 ÷ 0.994 = 0.00604, multiplying by the three ratios gives each pattern's probability of chatter.

```figure
type: compare
title: Probability of chatter for each pattern of results, with bushes per shift
cols: Probability of chatter | Bushes a shift | Of which have chatter
rowhead: Vision, probe, operator
- pass, pass, pass | 0.002% | 1,795.3 | 0.03
- pass, pass, fail | 0.067% | 94.6 | 0.06
- pass, fail, pass | 0.275% | 55.7 | 0.15
- fail, pass, pass | 1.38% | 37.2 | 0.51
- pass, fail, fail | 10.9% | 3.3 | 0.36
- fail, pass, fail | 38.3% | 3.1 | 1.20
- fail, fail, pass | 72.0% | 4.0 | 2.91
- * fail, fail, fail | 99.1% | 6.8 | 6.78
caption: This is an illustration. Base rate 0.6%; checks independent. Of the 12 bushes a shift with chatter, 6.8 fail all three checks; the rest are spread across the mixed patterns.
```

The table shows things no simple rule captures. A camera fail contradicted by both other checks leaves only a 1.38% chance of chatter, less than a bush that failed nothing but came from a worse process. A probe fail and an operator fail together, with the camera passing, give 10.9%, more evidence than either alone but far from certain. And the camera and probe failing together, even with the operator passing, give 72%.

## The cost-based rule

Chapter 3's rule applies unchanged: reject when the probability of a defect exceeds the cost ratio, here 6.50 ÷ 406.50 = 1.6%. Reading down the table, that rejects every pattern with two or more fails, and accepts the patterns with one fail or none, including the camera fail contradicted by both other checks, at 1.38%.

```figure
type: compare
title: Four ways to combine the three checks, per shift of 2,000 bushes
cols: Rejected | Good bushes rejected | Escapes | Cost, A$ ex GST
rowhead: Rule
- Camera alone | 51.2 | 39.8 | 0.60 | 498
- Reject if any check fails | 204.7 | 192.7 | 0.03 | 1,263
- Reject only if all three fail | 6.8 | 0.06 | 5.22 | 2,087
- * Cost-based: reject if the probability exceeds 1.6% | 17.3 | 6.0 | 0.76 | 342
caption: This is an illustration. Escapes A$400, false rejects A$6.50. Here the cost-based rule happens to reject exactly the patterns with two or more fails, so it coincides with a majority vote; with different checks or costs it would not.
```

Rejecting on any fail is the instinct of a cautious inspector, and it is ruinous: three checks with modest false-call rates together falsely reject almost 10% of good bushes. Rejecting only on unanimous fails lets almost half the chatter through. The cost-based rule costs A$342 a shift, against A$498 for the camera alone, because the other two checks overturn most of the camera's false calls while catching most of what the camera misses.

The coincidence with a majority vote is worth a warning. It holds here because the three checks are of broadly similar strength and the cost ratio falls between the right patterns. If the operator's look were much weaker, a camera fail plus an operator fail might fall below the threshold, and the majority vote would reject bushes the costs say should pass. The likelihood ratios, not the count of fails, are what should decide.

## Sending only the disagreements

Running all three checks on every bush is expensive in the operator's time. The table suggests a cheaper station. When the camera and the probe agree, the operator's look rarely changes the decision: two passes leave the probability of chatter far below 1.6% whatever the operator sees, and two fails leave it far above. Only when the camera and the probe disagree can the operator's verdict tip the decision.

```figure
type: steps
title: A station that asks the operator only about disagreements
caption: This is an illustration. The camera and probe check every bush automatically; the operator looks only at the bushes on which they disagree, about 99 a shift.
- Camera and probe both pass | 1,889.9 bushes; probability of chatter 0.005%: accept
- Camera and probe both fail | 10.9 bushes; probability 89%: reject
- They disagree | 99.2 bushes go to the operator
- Operator fails a disagreement | reject: probability 10.9% or 38.3%
- Operator passes a disagreement | accept: probability 0.275% or 1.38%
- * Result | the same decisions as all three checks on every bush, with the operator looking at 5% of bushes
```

The station makes exactly the same decisions as the cost-based rule with all three checks on every bush, so its error cost is the same A$342 a shift. The operator's time, about 10 seconds for each of 99 bushes, adds A$22, for a total of about A$364. The design principle is general: spend the weakest or most expensive check only where it can change the decision, which is where the stronger checks disagree.

## Scores carry more than verdicts

A pass or fail throws information away. The vision system does not really see "chatter" or "no chatter"; it computes a score for each bore and compares it with a threshold, 32.3 at its current setting. A bush scoring 33 and one scoring 60 both fail, but they are very different evidence. When the check reports its score, the likelihood ratio can be worked out for the score itself, from the distributions of scores on good and on bad bushes, which Chapter 7 describes.

This is an illustration. With the camera's score distributions, a score of 34, just over the threshold, has a likelihood ratio of only about 4, which takes the probability of chatter from 0.6% to 2.4%. A score of 38 has a ratio of about 44 and gives 20.8%; a score of 45 has a ratio in the thousands and gives about 96%. Treating all three as the same "fail" with a ratio of 47.5 overstates the first and understates the last. Where checks report scores, combining the scores' likelihood ratios gives better decisions than combining verdicts, at no extra cost in inspection time. The caution is that score distributions are least reliable in their far tails, where few bushes have been seen, so very large ratios should be capped at what the audit data can support.

## Neighbouring parts as evidence

Bushes are not made one at a time in isolation. Chatter comes from the boring bar's condition and its set-up, so when one bush has chatter, the next few are more likely to have it too, until the bar is changed. A bush's neighbours are therefore evidence about it, in the same way that neighbouring pixels are evidence about a pixel in a noisy image, which is how image-restoration methods recover a picture from a noisy scan.

This is an illustration. The shop's audits show that when a bush has chatter, the next bush has chatter about a quarter of the time, against 0.6% overall. For the bush after a confirmed chatter bush, the prior odds are therefore 0.25 ÷ 0.75 = 0.33 instead of 0.006. A camera pass on that bush, with its likelihood ratio of 0.051, still leaves a probability of chatter of 1.7%, just above the 1.6% threshold: by the costs, it should be rejected or checked further, even though the camera passed it. A camera pass and a probe pass together bring it down to 0.26%, safely accepted. The practical rule is simple: after any confirmed chatter bush, the next few bushes need two passes, not one, and the boring bar should be inspected.

## The error: two checks that saw the same thing

This is an illustration. In an earlier version of the station, the operator's "look" was a glance at the camera's own image of the flagged bush on a screen beside the line. The station's designer treated it as an independent check and combined it as above. Bushes the camera failed and the operator confirmed were rejected with a calculated probability of chatter of 38% or more, and the rejects in that group were scrapped without further checking.

A microscope audit of 40 scrapped bushes with a camera fail, a probe pass and an operator fail found only 2 with chatter, 5%, not the 38% the calculation claimed. The cause was that the operator was looking at the same image the camera had analysed. A reflection or tool mark that fooled the camera's software usually fooled the operator too, so the operator's verdict was almost a copy of the camera's, not independent evidence. Combining the two as if independent counted the camera's evidence twice. Without the operator's glance, a camera fail with a probe pass has a probability of chatter of 4.2%; multiplying by the operator's ratio of 14 as if it were new evidence pushed it to 38%, when the true figure was about the 4% the camera and probe alone supported.

The correction was to make the operator's check genuinely independent: the operator now examines the bush itself under a lamp and a loupe, from a different angle from the camera's, and the operator's sensitivity and false-call rate were re-measured for that method. Where a second check cannot be made independent, it should be combined with the first as a single check, characterised together, rather than multiplied in as new evidence.

## How well is each check known?

Every likelihood ratio in this chapter rests on a measured sensitivity and false-call rate, and those measurements have their own uncertainty. False-call rates are usually well known, because good parts are plentiful: 10 false calls in 500 good bushes gives 2%, with a 95% confidence interval of roughly 1.1% to 3.6%. Sensitivities are much harder, because defective parts are scarce. Nineteen catches out of 20 chatter bushes gives 95%, but the interval runs from about 76% to 99%, and the likelihood ratio of a pass, which depends on the miss rate, could be anything from about 0.01 to 0.25.

The remedy is to collect defective parts deliberately. Bushes with confirmed chatter, from audits, from customer returns or from deliberately worn tooling, are kept as a labelled reference set, and every check is run on them when it is set up and after any change. A set of 60 chatter bushes, with 57 caught, narrows the sensitivity's interval to about 86% to 98%. Until the set is large enough, decisions that hinge on a check's pass, such as the neighbouring-bush rule above, should use the cautious end of the interval, and the set should be topped up whenever a new kind of defect turns up.

## When independence fails

Independence is the assumption most likely to be wrong when checks are combined, and it fails in predictable ways. Checks that use the same physical signal, two cameras under the same light or a camera and a person viewing its image, share their blind spots. Checks that are all affected by the same condition, such as coolant on the bore or a dirty part, fail together. And checks that are tuned on the same training parts may share the same biases. In each case, the combined evidence is weaker than the product of the separate ratios suggests, and decisions based on the product are overconfident in exactly the borderline cases where confidence matters most.

A test for independence is cheap. Take a sample of bushes whose true state is known, run all the checks, and see whether, among good bushes, one check's false calls are more common when another has also made a false call. If they are, the joint behaviour of the pair must be measured directly, as one combined check with four possible results, and used in place of the product of two ratios.

## Exercise: a second camera

This is an illustration. A second camera, viewing the bore from a different angle, has a sensitivity of 90% and a false-call rate of 4%, and its errors are independent of the first camera's.

1. What are its likelihood ratios for a fail and a pass?
2. With the 0.6% base rate, what is the probability of chatter when both cameras fail, when only the first fails, and when only the second fails?
3. Which of these patterns does the cost-based rule reject?

**Worked answer.**

1. LR of a fail = 0.90 ÷ 0.04 = **22.5**. LR of a pass = 0.10 ÷ 0.96 = **0.104**.
2. Prior odds 0.00604. Both fail: 0.00604 × 47.5 × 22.5 = 6.45, probability **86.6%**. First only: 0.00604 × 47.5 × 0.104 = 0.0299, probability **2.9%**. Second only: 0.00604 × 0.051 × 22.5 = 0.0069, probability **0.69%**.
3. The threshold is 1.6%, so the rule rejects **both-fail** and **first-only** patterns, and accepts the second-only pattern. The first camera is the stronger check, so its fail alone is enough evidence to reject, while the second camera's fail alone is not.
