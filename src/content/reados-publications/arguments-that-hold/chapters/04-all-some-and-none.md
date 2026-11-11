---
book: arguments-that-hold
chapterSlug: all-some-and-none
order: 4
title: "All, some and none: what a sample or a quiet period can support"
description: "How quantified claims work: what refutes all, what establishes some, why a small clean sample cannot show that a whole lot conforms, and what a period without failures does and does not prove."
draft: false
---

"All the pinions in this lot conform." "Some of the new pinions are soft." "None of the C2 pinions has failed." Each of these statements is about a group, and each needs a different kind of evidence. Mistakes with quantified claims are among the most expensive in engineering, because they usually take the form of accepting a whole batch, design or fleet on evidence that only covers part of it.

This chapter sets out the logic of "all", "some" and "none", applies it to a supplier's certificate for a replacement lot of pinions, and uses a sampling calculation to show what a small clean sample can and cannot support. It ends with the claim that sounds most reassuring and supports least: nothing has failed yet.

## Four kinds of quantified claim

Traditional logic sorts claims about a group into four kinds, and relates them in what is called the square of opposition. Its value for engineers lies in two relationships: which claims contradict each other, and which can both be false.

```figure
type: compare
title: Four claims about a lot of 60 pinions
cols: Contradicted by | Established by | Refuted by
caption: Contradictory pairs cannot both be true or both be false: one counterexample settles them. "All" and "none" can both be false, as they are when a lot is mixed.
- All conform | Some do not conform | Checking every pinion | One nonconforming pinion
- No pinion conforms | Some conform | Checking every pinion | One conforming pinion
- Some conform | No pinion conforms | One conforming pinion | Checking every pinion
- *Some do not conform | All conform | One nonconforming pinion | Checking every pinion
```

Three practical consequences follow.

- **A universal claim is easy to refute and hard to establish.** One soft pinion refutes "all conform". Nothing short of checking every pinion establishes it, unless the claim is changed into a statistical one, as below.
- **A particular claim is easy to establish and weak.** One conforming pinion establishes "some conform", which tells you very little about the rest.
- **"All conform" and "none conform" can both be false.** A mixed lot makes both false, which is why a finding that "not all conform" does not mean the lot is bad throughout. It means only that at least one is.

## The certificate for the replacement lot

This is an illustration. After the failures on C1, the new supplier reviews its process and finds that its heat-treatment furnace had been loaded beyond its rated charge, leaving some parts under-hardened. It corrects the process and offers a replacement lot of 60 pinions. Its certificate states:

> Hardness checked on 5 pieces at tooth mid-height: 286, 291, 295, 302, 308 HB. All within 280–320 HB. Lot conforms.

The certificate contains two claims. The first, "these five pieces are within 280 to 320 HB at tooth mid-height", is a particular claim about five named items, measured in the right place this time. It is well supported, assuming the readings are correct. The second, "the lot conforms", is a universal claim about all 60. It does not follow from the first. Five clean pieces out of 60 leave 55 unexamined.

The purchasing manager, wary after the first lot, asks the reliability engineer what the five readings do support. That is the right question, and it has a quantitative answer.

## What a clean sample of five can support

A sample can support a statistical claim about the lot even when it cannot support a universal one. Treat the certificate's check as a sampling plan: inspect n = 5 pieces and accept the lot if the number of nonconforming pieces is no more than c = 0. The question becomes: if the lot contained some proportion of soft pinions, how likely is it that a random sample of five would contain none?

The [acceptance sampling probability tool](/tools/sampling-oc/) in BIZOMAT Tools calculates exactly that. For a single sampling plan with sample size n and acceptance number c, it gives the probability of accepting a lot at a given fraction defective, using the binomial model, together with the average outgoing quality and a table of the operating characteristic at several defect levels. It assumes random sampling, and it notes that for lots smaller than about ten times the sample, the hypergeometric model is more accurate. The lot of 60 is twelve times the sample of five, so the binomial model is a fair approximation.

```figure
type: bars
title: Chance that five clean pieces come from a lot with soft pinions in it
unit: %
max: 100
caption: This is an illustration. Probability of acceptance for the plan n = 5, c = 0 from the acceptance sampling probability tool. A lot with one soft pinion in ten passes 59% of the time; one with one in five still passes about a third of the time.
- 1% soft | 95.1
- 5% soft | 77.4
- 10% soft | 59.0
- *20% soft | 32.8
- 40% soft | 7.8
```

The numbers show what the certificate supports. It makes a badly mixed lot unlikely: if 40% of the pinions were soft, a clean sample of five would turn up only about 8% of the time. But it says very little about a lot with a modest fraction of soft pinions. A lot in which one pinion in five is soft, twelve soft pinions out of 60, would produce a clean sample of five about a third of the time.

### Readings say more than pass or fail, if the lot is one population

The certificate gives five actual readings, not just a pass, and readings carry more information. Their mean is 296.4 HB and their standard deviation 8.73 HB. If the hardness of the whole lot followed a single normal distribution with that mean and spread, the 280 HB limit would sit 1.88 standard deviations below the mean, and about 3% of the lot would be expected to fall below it. That is a sharper statement than the pass-or-fail analysis gives.

But it rests on a premise the certificate cannot support: that the lot is one population. A furnace overload does not shift every part a little; it leaves some parts properly hardened and others soft. A mixed lot of that kind has two populations, and five readings that all happen to come from the hardened group describe that group well and the soft group not at all. The variables calculation is only as good as the claim that every pinion came out of the same process, and that is precisely the claim in doubt.

So the honest conclusion from the certificate is not "the lot conforms". It is closer to: "the lot is unlikely to be mostly soft, but a soft fraction of 10 to 20% cannot be ruled out by this check." For a pinion whose failure stops a conveyor, that is not enough.

## The failure case: universal acceptance on particular evidence

The first lot from this supplier, the one that produced the failures, was accepted on a certificate that said "hardness 285 HB, conforms to drawing", based on an unstated number of readings on the hub face. Chapter 2 showed that the reading was in the wrong place. This chapter adds a second fault: even had it been in the right place, a single reading or a handful of readings cannot carry a universal conclusion.

That combination explains a pattern in the failures. Not every pinion in the first lot was soft: the furnace overload left some parts properly hardened and others not. The pinions that happened to go into C1 included soft ones; the one that went into C2 is of unknown hardness until tested. A mixed lot is exactly the case in which a small sample is most misleading.

### How it is detected and corrected

The mistake is detected by asking, of any "lot conforms" statement, how many items were checked and how the conclusion was drawn from them. If the answer is "some" and the conclusion is "all", the inference is not valid as a universal claim, and its statistical strength needs to be worked out, as above.

The correction depends on consequences. For the depot, one soft pinion means a broken conveyor drive, a night of repair and a day of lost throughput. Hardness checking with a portable tester at the tooth flank takes a few minutes per pinion. The depot therefore inspects **every pinion** in the replacement lot on receipt. Checking all 60 turns "all conform" into a claim that can be established directly, subject only to the accuracy of the tester. The [Accept or Reject by the Numbers chapter on accepting or rejecting a lot](/reados/publications/accept-or-reject-by-the-numbers/accepting-or-rejecting-a-lot/) covers the wider choice between sampling and full inspection.

## If you must sample, size the sample to the claim

Full inspection is not always possible. Destructive tests, long tests and large lots often force sampling. In that case, the plan should be chosen to support the claim actually needed, rather than the claim being stretched to fit the plan.

Suppose the claim the depot needed were: "If 20% or more of the lot is soft, our check will reject it at least nine times in ten." With an acceptance number of zero, the probability of accepting a lot with 20% soft is 0.8 raised to the power n. Setting that at 10% or less gives n of at least ln(0.10) ÷ ln(0.80) = 10.3, so **n = 11**. The acceptance sampling probability tool confirms that n = 11, c = 0 accepts such a lot 8.6% of the time, while n = 10 accepts it 10.7% of the time.

A plan of 11 is more than double the supplier's five, and it still says nothing reassuring about a lot with 5% soft. A sampling plan always buys protection against some lot qualities at the cost of others. The point of the calculation is to make that trade explicit, so the conclusion drawn from a clean sample matches what the sample can carry.

## "None has failed" and the quiet period

The most comforting quantified claim in an investigation is usually about time: none has failed. At the depot, C2 has run a pinion from the first, faulty lot for ten weeks without failure. The maintenance supervisor uses that to argue that the lot cannot be all bad, and the production manager uses it to argue that C2 is safe to leave running.

Both arguments ask the quiet period to carry more than it can.

- **"None has failed so far" is a claim about the past.** Ten weeks at about 20 hours a day is about 1,400 running hours. The claim is true for those hours. It says nothing directly about the next 1,400.
- **Fatigue takes time.** A tooth bending fatigue failure needs cycles. At C2's lower load, a soft pinion would be expected to last longer than on C1, perhaps much longer. Ten weeks without failure is consistent with a sound pinion and with a soft one that has not yet accumulated enough cycles.
- **One survivor does not describe a lot.** The C2 pinion is one item, a sample of one. Even if it is sound, it establishes only "some pinions in the first lot are sound", which nobody doubted.

The correct use of the quiet period is as weak evidence, stated with its exposure: "One pinion from the first lot has run about 1,400 hours at 9.8 kW without failure." The decision about C2 should rest on something more direct. The depot tests the C2 pinion's hardness at the next planned stop, rather than waiting for it to fail or assuming it will not.

### Universal claims about conditions

Quantifiers range over conditions as well as items. "The drive is adequate" usually means adequate in all the conditions it will meet: steady running, starts, surges of material, a jammed belt, a cold morning. A calculation at one condition establishes adequacy at that condition only. Chapter 1's measured 12.4 kW is the steady case. Chapter 5 checks tooth stress at that case, and it is a valid check, but it is a particular claim about one load case. To claim adequacy for the drive's whole duty, the starting and surge cases need their own evidence, or the claim has to be narrowed to say which conditions it covers. A design review that asks "for which conditions?" of every "adequate" is applying the square of opposition to load cases.

## Quantifiers hidden in ordinary words

Quantified claims are not always marked with "all" or "some". Ordinary engineering language hides them, and the hidden quantifier is often stronger than the evidence.

```figure
type: checklist
title: Hidden quantifiers to make explicit
caption: This is an illustration. Each phrase was used at the depot. Making the quantifier explicit shows what evidence the claim needs.
- x "The lot conforms" | all 60 pinions meet every drawing requirement
- x "The new pinions are soft" | all, most or some of them; which lot
- x "The drive is reliable" | every start, every shift, for how long, at what duty
- x "No failures on C2" | none so far, in about 1,400 hours, on one pinion
- x "Typically 285 HB" | most readings near 285; how many readings; what spread
- x "Never had a problem" | none recorded; how complete are the records
```

## Exercise: the supervisor's argument

The maintenance supervisor argues: "The C2 pinion came from the first lot. It has done ten weeks without failing. The C1 failures came from the same lot. So the C1 failures weren't caused by the lot; it must be something about C1."

Identify the quantified claims in this argument, say what each is supported by, and decide whether the conclusion follows. What would you check instead?

**Worked answer.** The argument contains three quantified claims. "The C2 pinion has not failed in ten weeks" is a particular claim about one item over about 1,400 hours; it is supported by the maintenance record. "The C1 failures came from the same lot" is a particular claim about three items; it is supported by the stores issue records. The conclusion, "the lot did not cause the C1 failures", relies on a hidden universal premise: that the pinions in the lot are all alike, so one survivor shows the lot is sound.

That hidden premise is the weak point. A mixed lot, which is exactly what an overloaded furnace produces, makes "all alike" false. The survivor on C2 could be one of the sound pinions, or a soft one at a lower load that has not yet failed. The conclusion does not follow.

The supervisor is right that something about C1 may also matter; Chapter 3 noted that all three fractures started at the same end of the face. But that is a separate claim with its own evidence. The checks that settle the lot question are direct: test the hardness of the failed C1 pinions, the unused pinions from the first lot still in stores, and the C2 pinion at its next planned stop. Those tests, reported in Chapter 7, replace an argument about the lot with measurements of it.
