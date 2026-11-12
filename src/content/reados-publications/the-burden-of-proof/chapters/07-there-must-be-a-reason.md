---
book: the-burden-of-proof
chapterSlug: there-must-be-a-reason
order: 7
title: "There must be a reason: judging the explanation offered when a trial goes wrong"
description: "When a trial result goes against a claim and a hidden cause is offered, how to tell an explanation that can be checked from one that can absorb any evidence, using early seal failures and a teardown."
draft: false
---

Trials go wrong. When they go wrong for a claim, the claimant usually has an explanation, and the explanation usually points away from the product: it was installed badly, the conditions were unusual, the water was dirty. Sometimes the explanation is right. Unexplained failures often do have causes that nobody has found yet. But an explanation that can be produced for any failure, and never needs to be checked, turns every trial into one the claim cannot lose.

This chapter applies a test for telling the two apart to the seal trial, after two of the six seals fail in the first three months. It borrows the shape of the test from a long debate about unexplained evil, and it ends with a decision that keeps the trial's rule intact while still giving the supplier's explanation its due.

## Two early failures

This is an illustration. The six new seals were fitted in February. The seal on pump P3 failed at about 900 running hours; the seal on P5 at about 1,400 hours. The rule from Chapter 6 says that two or more failures within 6,000 hours refute the claim. The supplier's area manager calls the next day. The seals did not fail because of their design, he says. There must be a reason: perhaps the installation, perhaps the water.

## Unknown reasons and their critics

A debate in the philosophy of religion has the same structure. The evidential argument from evil holds that the amount of apparently pointless suffering in the world counts against the existence of a good and all-powerful God. Andrea Weisberger, in *The Cambridge Companion to Atheism*, describes a reply known as sceptical theism: there could be good reasons for allowing the suffering that we are simply unable to see, so apparent pointlessness does not show actual pointlessness. William Lane Craig, in the same volume, presses a related point: given our limited view, we are poorly placed to judge whether any particular evil serves a larger purpose.

Weisberger also sets out the response. If an unseen reason can always be invoked to explain away apparent evidence, the same move would undermine ordinary reasoning about the world in general, since any observation could be dismissed as misleading for reasons we cannot see. The debate continues, and this book takes no position on it.

The engineering lesson sits in the structure of the exchange. Craig's point is a fair warning against overconfidence: a buyer often does not know why a part failed, and a supplier's alternative explanation may be correct. Weisberger's response is a fair warning against the opposite: an explanation that needs no evidence, and could cover any result, ends inquiry rather than advancing it. The task is to give hidden-reason explanations a hearing without letting them become a shield.

## A test for a hidden-reason explanation

The plant engineer uses four questions. An explanation that passes them is a hypothesis worth taking seriously. One that fails them is a way of declining to be tested.

```figure
type: checklist
title: Is the explanation a hypothesis or a shield?
caption: A rescue that passes all four questions may well be right, and should be investigated. One that fails them should be recorded as unsupported.
- Is it specific? | It names a cause, a mechanism and the evidence that cause would leave
- Can it be checked independently? | Someone other than the claimant can look for that evidence
- Does it predict anything else? | If true, it implies other observations: in other units, in the timing, in the failed parts
- Does it cost the claim anything? | If accepted, it narrows or conditions the claim rather than leaving it untouched
- x It is offered for every failure | the same explanation, whatever the evidence, is a shield
```

"There must be a reason" fails the first question as stated. The plant engineer asks the area manager to be specific: which installation error, and what would it leave on the seal? He names two possibilities. A seal face knocked or chipped during fitting would show impact damage at the face edge. A seal run dry at start-up, without the seal chamber vented, would show heat cracking and discolouration on the faces. Those are specific and checkable. The water explanation, on request, becomes "abrasive solids", which would leave grooving and scoring across the faces.

## What the timing says before the teardown

The failure times carry evidence of their own, and the plant engineer reads it before anyone opens a seal.

If the seals failed by wear, as the Weibull models in Chapter 6 describe, two failures within 1,400 hours would be very unlikely, whichever model is true. Using the [Weibull reliability tool](/tools/weibull-reliability/), the probability that any one of the present seals fails by 1,400 hours is about 1.7%; for a seal as good as claimed, about 0.15%. The chance of two or more of six failing that early is about 0.4% if the seals are no better than the present ones, and about 0.003% if they are as good as claimed.

So the timing is improbable under both wear models. That does not mean the claim is true or false. It means the failures probably have a different cause from wear: they look like early-life failures, from fitting, start-up or a defect, which follow a different pattern. A Weibull shape below 1 describes that pattern, with a failure rate that is highest when the part is new and falls with age.

```figure
type: compare
title: Two failure patterns, as the Weibull reliability tool describes them
cols: Hazard at 500 h | Hazard at 5,000 h | Pattern
caption: This is an illustration. The wear model's hazard rises with age; an early-life model's falls. Two failures in the first 1,400 hours fit the second pattern much better than the first. The early-life parameters are illustrative, not fitted.
- Present seals, β 2.2, η 9,000 h | 0.00000762 per h | 0.00012074 per h, rising | Wear-out
- * Early-life pattern, β 0.7, η 20,000 h | 0.00010585 per h | 0.00005305 per h, falling | Early-life failures
```

This is the first point in the supplier's favour. The timing supports the idea that something other than the seal's wear life caused the failures. It does not yet say what.

```figure
type: timeline
title: The first months of the seal trial
caption: This is an illustration. Running hours are from each pump's meter. The rule from Chapter 6 was signed before the first seal was fitted, and the teardown was part of it.
- Day 1 | Rule signed; first seals fitted | Supplier's technician present for P1 and P2
- Day 2 | Remaining seals fitted | P3 fitted by a fitter working alone
- * About 900 h on P3 | P3 seal fails | First failure under the rule
- About 1,170 h on P5 | Bearing change on P5 | Restarted; no venting entry on the checklist
- * About 1,400 h on P5 | P5 seal fails | Second failure: the rule's refutation condition is met
- Next day | Supplier offers explanations | Installation, then water
```

## The teardown

The trial rule required each failed seal to be torn down and its cause recorded. The supplier's technician and the factory's maintenance planner open both seals together, photographing each step.

- **P3, failed at about 900 hours.** The carbon face has a chip at its outer edge with a small impact mark beside it, and leakage tracks lead from the chip. The fitting record shows P3's seal was fitted on the second day of the trial, by a fitter working alone after the supplier's technician had left. That is the specific evidence the knocked-face explanation predicted.
- **P5, failed at about 1,400 hours.** Both faces show fine radial heat cracks and blue discolouration. The maintenance log shows P5 was restarted after a bearing change about two weeks before the failure, and the start-up checklist has no entry for venting the seal chamber. That is the evidence the dry-running explanation predicted.
- **Water.** Neither seal shows grooving or scoring across the faces, and the factory's monthly solids readings for the trial period are within their usual range. The abrasive-water explanation predicted evidence that is absent. The plant engineer records it as unsupported and asks that it not be raised again without new evidence.

Two of the supplier's explanations passed all four questions: specific, independently checked, predicting evidence that was found, and, as the next section shows, at a cost to the claim. One failed.

## What the rule says, and what it does not

The trial rule counted any failure needing a seal replacement, whatever its cause. By that rule, two failures within 6,000 hours refute the claim, and the plant engineer records exactly that. She does not rewrite the rule now that its result is inconvenient for the supplier, any more than she would have rewritten it had the result been inconvenient for the factory. Chapter 4's test for a legitimate qualification applies: a condition introduced after the result is a rescue, not a refinement.

But she also records what the refutation shows and what it does not. It shows that, as fitted and started at this factory, these seals did not deliver three times the present life: two of six failed within three months, which the present seals, with no early failures in four years of records, have not done. It does not show that the seal's wear life is short. The teardown indicates that neither failure was caused by wear. The claim about wear life remains untested.

The supplier's explanation therefore costs its claim something real. The seal appears to be more sensitive to careful fitting and to dry running at start-up than the factory's present seals. That is a property of the product in this factory's hands. A claim of long life that holds only when every fitter, on every shift, fits it perfectly and vents it every time is a narrower claim than "three times as long", and the factory must decide whether it can meet those conditions.

### The decision

The plant engineer separates the two questions and gives each its own rule.

1. **Robustness to fitting and start-up.** Refuted for the seal as supplied and fitted. The supplier agrees to provide a fitting tool that protects the face edge, a written venting step for the start-up checklist, and training for the factory's fitters.
2. **Wear life.** Not yet tested. The four surviving seals continue, and the two failed seals are replaced, fitted with the new tool and procedure. A new rule is written and signed before the replacements go in, with its own count of hours from their fitting, on the pattern of Chapter 6.

The supplier is not let off, and it is not treated unfairly. Its explanation was heard, checked, partly confirmed, and turned into conditions that now form part of its claim.

## Which failures should a rule count?

The trial rule counted every failure. A reasonable supplier could argue that it should have counted only failures of the seal's design, and the argument deserves an answer, because the next rule will have to settle it in advance.

There is a case for counting everything. The factory does not experience design life; it experiences seals that leak or do not. A seal that fails more often in ordinary hands is, for the factory, a seal with a shorter life, whatever the reason. Field reliability includes fitting, start-up and the occasional mistake, and a claim about life in this duty is a claim about life as the factory will actually get it.

There is also a case for separating causes. A claim about wear life is a claim about the seal's faces and materials, and a failure from a knocked face says nothing about them. Counting it against the wear claim mixes two questions, and it could lead a buyer to reject a seal whose design is excellent because its fitting instructions were inadequate.

Both positions are defensible. What is not defensible is choosing between them after the result. The plant engineer's new rule for the replacement seals therefore lists the failure modes in advance and says how each will be counted: wear and material failures count against the wear-life claim; fitting and start-up failures count against a separate robustness record, which the factory will use when it decides whether the seal suits its fitters and procedures. Each failure is classified at teardown by the factory's planner and the supplier's technician together, with photographs, and any disagreement about the classification is recorded rather than resolved by whoever argues longer.

## The failure case: water, every time

This is an illustration. The coating supplier from Chapter 6's failure case had an explanation for every disappointing impeller: abrasive water. When the first coated impeller wore, the water was blamed. When the factory pointed out that its solids readings were normal, the supplier said the readings were not taken at the right time. When asked what evidence would show the water was not the cause, the supplier could not say.

### How it is detected and corrected

The failure is detected by the last line of the checklist: the same explanation, offered for every failure, whatever the evidence, is a shield. The correction is to ask, the first time an explanation is offered, what evidence it predicts, and to agree in advance that if that evidence is absent the explanation will be set aside. A supplier confident in its explanation will agree, because the agreement is its best chance of being believed.

## Exercise: one more explanation

At the next review, the area manager offers a further explanation for P5: excessive shaft runout on that pump.

1. Is the explanation specific? What would it predict?
2. How would you check it independently?
3. If it were confirmed, what would it cost the claim?

**Worked answer.**

1. It is specific: runout makes the rotating face wobble against the stationary one. It would predict uneven, eccentric wear tracks on the faces, possibly alongside the heat cracking; higher runout on P5 than on the other pumps; and, if P5's runout has been high for years, a history of shorter seal lives on P5 than on the other pumps in the factory's own records.
2. Measure shaft runout at the seal position on P5 with a dial indicator and compare it with the seal maker's stated limit and with the other five pumps. Re-examine the photographs of P5's faces for eccentric wear tracks. Check the factory's records for P5's previous seal lives.
3. If confirmed, it would show that P5's failure had a cause in the pump, which the factory must fix whatever seal it uses. It would also add a condition to the claim: the seal needs runout within the stated limit, which every pump must be checked against. If the earlier evidence of dry running still stands, the runout may be a second contributing cause rather than a replacement for the first; a failure can have more than one cause, and the record should say so.
