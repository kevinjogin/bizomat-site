---
book: accept-or-reject-by-the-numbers
chapterSlug: inspection-as-inference
order: 1
title: "Inspection as inference"
description: "Treat an inspection result as evidence: false accepts and false rejects, the base rate from process capability, Bayes' rule in odds form, and why reject bins hold mostly good parts."
draft: false
---

An inspection does not tell us whether a part is good. It gives us a piece of evidence about whether the part is good, and the evidence can be wrong. A gauge reads a little high or low, a camera mistakes a reflection for a scratch, an inspector misses a burr at the end of a long shift. The decision to accept or reject is an inference: a judgement about the part's true state, made from imperfect evidence and from whatever else is known about the part.

This chapter sets up the two kinds of inspection error, works out how likely a BU-25 bush is to be bad before anyone looks at it, using the process's capability and the BIZOMAT out-of-tolerance tool, and applies Bayes' rule to the vision system's verdicts. Its central result surprises most people the first time: at the shop's defect rate, more than three-quarters of the bushes the camera rejects are good. The error is a monthly report built on that misunderstanding.

## Two kinds of error

Every part is either conforming or not, and every inspection either accepts it or rejects it. That gives four outcomes, two right and two wrong.

```figure
type: matrix
title: The four outcomes of an inspection
x: Inspection decision: reject → accept
y: True state of the part: bad → good
hot: 4
caption: The two errors have different costs. A false reject wastes a good part or an inspector's time; a false accept sends a bad part to the customer. The highlighted cell is the one customers notice.
- Good part rejected | false reject: the producer's loss
- Good part accepted | correct
- Bad part rejected | correct
- Bad part accepted | false accept, or escape: the customer's loss
```

Statistics calls the two errors by several names. A false reject is the producer's risk, or a false positive if "positive" means "flagged as defective". A false accept is the consumer's risk, an escape, or a false negative. This book uses false accept and false reject throughout, because those names say what happened to the part.

The two errors almost never cost the same. For BU-25, a good bush rejected costs about A$6.50 of material and machining. A bad bush accepted reaches the cylinder maker's assembly line, where it may be found at assembly, at test or in the field, and costs about A$400 in sorting, freight and goodwill. This is an illustration. The ratio of about 60 to 1 between the costs shapes every decision in this book.

## What we know before we look

Before a bush reaches the gauge or the camera, the shop already knows a lot about it: it came off a process with a known mean and spread. That knowledge is the prior, and for a measured characteristic it can be calculated from the process's capability. The [parts out of tolerance tool](/tools/normal-out-of-spec/) gives the fraction of parts beyond each limit for a normally distributed characteristic, from the process mean, the standard deviation and the limits.

This is an illustration. BU-25's bore runs at a mean of 25.0125 mm with a standard deviation of 0.0035 mm, against limits of 25.000 and 25.021 mm. For a shift of 2,000 bushes, the tool gives the following.

```figure
type: stats
title: BU-25's bore before inspection, from the parts out of tolerance tool
caption: This is an illustration. The process is capable of the tolerance in width (Cp 1.00) but runs above centre, so almost all its out-of-tolerance bushes are oversize. The tool flags the centring.
- 3.571 | z to the lower limit
- 2.429 | z to the upper limit
- 177.5 ppm | below 25.000 mm
- 7,579.2 ppm | above 25.021 mm
- 0.7757% | out of tolerance in total, 7,756.7 ppm
- 15.5 bushes | expected out of tolerance per shift of 2,000
```

So before any measurement, a BU-25 bush has a 0.78% chance of an out-of-tolerance bore, almost all of it oversize. That number is the bore's base rate. The chatter marks the camera looks for have their own base rate, about 0.6% of bushes, known from audits of the camera's rejects and accepts. Base rates are the most neglected numbers in inspection, and the rest of the chapter shows why they matter so much.

## Bayes' rule

The camera's performance is described by two numbers, measured by running it on bushes whose true state was known from a microscope.

- **Sensitivity:** the fraction of bad bushes it rejects, 95%.
- **False-call rate:** the fraction of good bushes it rejects, 2%.

These describe how the camera behaves given the truth. The question the shop needs answered is the reverse: given that the camera has rejected a bush, how likely is the bush to be bad? Bayes' rule, published after Thomas Bayes's death in 1763, turns one into the other.

```figure
type: formula
title: Bayes' rule for an inspection result
formula: P(bad | rejected) = P(rejected | bad) × P(bad) ÷ P(rejected)
formula: P(rejected) = sensitivity × base rate + false-call rate × (1 − base rate)
formula: Posterior odds = prior odds × likelihood ratio
caption: The likelihood ratio of a rejection is sensitivity ÷ false-call rate. Odds are p ÷ (1 − p); convert back with p = odds ÷ (1 + odds).
- P(bad) | the base rate, before inspection
- P(bad given rejected) | the posterior, after inspection
- Likelihood ratio | how much more often bad parts give this result than good parts
```

The easiest way to apply the rule is with counts. Imagine a shift of 2,000 bushes.

```figure
type: steps
title: A shift of 2,000 bushes through the vision system
caption: This is an illustration. Base rate 0.6%, sensitivity 95%, false-call rate 2%.
- Bushes with chatter | 2,000 × 0.006 = 12
- Of those, rejected by the camera | 12 × 0.95 = 11.4; 0.6 escape
- Good bushes | 2,000 − 12 = 1,988
- Of those, rejected by the camera | 1,988 × 0.02 = 39.8
- Total rejected | 11.4 + 39.8 = 51.2
- * Share of rejects that are bad | 11.4 ÷ 51.2 = 22.3%
```

Only 22.3% of the bushes the camera rejects actually have chatter. More than three in four rejects are good bushes. The camera is not poor: it catches 95% of chatter and falsely rejects only 2% of good bushes. The cause is the base rate. Good bushes outnumber bad ones by 166 to 1, so even a small false-call rate among the many good bushes produces more rejects than a high catch rate among the few bad ones.

The odds form gives the same answer in one line. The prior odds of chatter are 0.006 ÷ 0.994 = 0.00604. The likelihood ratio of a rejection is 0.95 ÷ 0.02 = 47.5: a rejection is 47.5 times more likely from a bad bush than from a good one. The posterior odds are 0.00604 × 47.5 = 0.287, a probability of 0.287 ÷ 1.287 = 22.3%. The odds form is the one to remember, because Chapter 6 combines several checks by multiplying their likelihood ratios.

## The base rate decides

The same camera gives very different meanings to a rejection on different processes.

```figure
type: bars
title: Share of the camera's rejects that are truly bad, by the process's defect rate
unit: %
max: 100
caption: This is an illustration. Sensitivity 95% and false-call rate 2% in every case. Only the base rate changes.
- 0.1% defective | 4.5
- * 0.6% defective, BU-25 | 22.3
- 3% defective | 59.5
- 10% defective | 84.1
```

On a very good process, almost every reject is a false call; on a poor one, most rejects are real. This has three practical consequences. Rejected parts from a good process deserve a second look before scrapping, because most are good, which Chapters 5 and 10 put a price on. The reject rate is not the defect rate, and Chapter 8 shows how to recover one from the other. And as a process improves, its inspection's rejects become less informative, so a camera that was a sound investment on a poor process may become mostly a generator of false calls once the process is fixed.

### Pricing the errors

The costs turn these counts into money. Each shift, the camera rejects about 39.8 good bushes at A$6.50 each, A$258 of false rejects, and lets about 0.6 bushes with chatter through at A$400 each, A$240 of escapes: about A$498 a shift in inspection errors, before the cost of running the camera. The two halves are nearly equal, which is a hint, developed in Chapter 7, that the camera's setting is not far from the best for these costs. A setting that cut false calls at the expense of more escapes, or the reverse, would have to be judged by this total, not by either number alone.

## What a pass means

The other side of the result matters as much to the customer. Of the 2,000 − 51.2 = 1,948.8 bushes the camera passes, 0.6 have chatter, a rate of 0.6 ÷ 1,948.8 = 308 parts per million. Inspection has reduced chatter in shipped bushes from 6,000 ppm to 308 ppm, a factor of about 20. A pass is strong evidence of a good bush, because good bushes are so common to begin with and the camera rarely misses bad ones. This asymmetry, weak evidence from a reject and strong evidence from a pass, is typical of inspection on a capable process.

## Where base rates come from

A base rate is only useful if it is the right one for the part in hand, and getting it right takes some care.

For a measured characteristic, the base rate comes from the process's distribution, as above, and is only as good as the capability study behind it. The study must come from a stable process, measured with a gauge whose own error has been allowed for, and it must be current: a capability study from before the last tool change, or from a different machine, describes a different process. For an attribute such as chatter, the base rate comes from audits, in which a sample of parts, accepted and rejected alike, is checked by a method much better than the routine inspection. Chapter 8 shows how to run such audits and update the base rate as their results arrive.

Base rates also vary within a process. A boring bar near the end of its life produces more chatter than a new one; the first bushes after a set-up are more often out of tolerance than the hundredth; one lathe may run better than the other. An inspection decision made with the average base rate is a reasonable default, but where the shop knows that a part comes from a riskier stretch of production, it should use the higher rate, and Chapter 7 shows that the best camera threshold changes when it does. In information terms, every piece of knowledge about where a part came from is part of its prior.

## One part at a time, or the whole batch

The calculations above treat each bush on its own: given this bush's result, how likely is this bush to be bad, and should it be accepted? Deciding every part on its own probability minimises the expected number of parts decided wrongly, which is the right aim when each part's fate is separate, as at a 100% inspection station.

Some decisions are about a whole batch at once: ship the lot or sort it, release the batch or hold it. Then the question is different: what is the most probable state of the whole lot, or the expected cost of shipping it? The best decision for the lot is not always the one obtained by deciding each part separately and adding up, and decoding theory makes the same distinction between deciding each bit of a message on its own and choosing the most probable whole message. Chapter 9 takes up lot decisions in their own right.

## Inspection as a noisy channel

Information theory offers a useful way to see all this. A bush's true state is a message, the inspection is a noisy channel, and the inspector's decision is the decoded message. The best decoder, the one that makes the fewest costly mistakes, uses two things: what the channel reports, and what messages are likely to be sent. Physicists studying the decoding of error-correcting codes have shown that decoders do best when the prior and the noise level they assume match the true ones, and lose accuracy when either is wrong. In inspection terms: an inspector or a machine that uses the true defect rate and the gauge's true uncertainty makes better decisions than one that ignores either. Chapters 2 to 7 apply that principle to the gauge and the camera, and Chapter 7 shows the cost of assuming the wrong base rate.

## The error: the reject rate reported as the defect rate

This is an illustration. The shop's monthly quality report took the camera's reject count as the number of bushes with chatter. Month after month, it reported a chatter rate of about 2.6%, and the general manager, alarmed, asked for a study of the boring tool.

The quality engineer checked a sample of rejects under a microscope. Of 100 consecutive rejects, 23 had chatter and 77 were good, close to the 22.3% that Bayes' rule predicts. The camera was reporting 2,000 × 0.0256 = 51.2 rejects a shift, but only 12 bushes a shift actually had chatter. The report had confused the camera's reject rate, which includes false calls, with the process's defect rate. The boring tool was fine.

The correction had two parts. The report now states the reject rate and an estimated true defect rate, corrected for the camera's known sensitivity and false-call rate by the method of Chapter 8. And rejected bushes are no longer scrapped on the camera's word alone: they go to a quick microscope check, which returns most of them to stock. The microscope check costs about 15 seconds a bush, about 13 minutes a shift for 51 rejects, and saves about 40 good bushes a shift.

## Exercise: a better camera

This is an illustration. A supplier offers a camera with a sensitivity of 98% and a false-call rate of 0.5%. After a process improvement, chatter has fallen to 0.2% of bushes.

1. In a shift of 2,000 bushes, how many have chatter, how many does the new camera catch, and how many good bushes does it reject?
2. What share of its rejects are truly bad?
3. What is its likelihood ratio for a rejection, and what does that give in odds form?

**Worked answer.**

1. 2,000 × 0.002 = **4** bushes with chatter, of which 4 × 0.98 = **3.92** are caught. Good bushes: 1,996, of which 1,996 × 0.005 = **9.98** are rejected.
2. 3.92 ÷ (3.92 + 9.98) = 3.92 ÷ 13.90 = **28.2%**. Despite a much better camera, most rejects are still good bushes, because the process has also improved.
3. Likelihood ratio 0.98 ÷ 0.005 = **196**. Prior odds 0.002 ÷ 0.998 = 0.002004; posterior odds 0.002004 × 196 = 0.3928; probability 0.3928 ÷ 1.3928 = **28.2%**, the same as the counts.
