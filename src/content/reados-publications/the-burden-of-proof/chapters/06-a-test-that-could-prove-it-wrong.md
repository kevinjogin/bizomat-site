---
book: the-burden-of-proof
chapterSlug: a-test-that-could-prove-it-wrong
order: 6
title: "A test that could prove it wrong: designing the seal trial before the results"
description: "How to turn a life claim into a trial with a refutation rule written first, what passing and failing can each show, and why a constant-failure-rate plan suits a controller but not a seal."
draft: false
---

By now the seal claim has been made definite: three times the life of the factory's present seals, in the cooling-water duty. The consequence of relying on it there is low, so a site trial is enough evidence. This chapter designs that trial. The design matters more than the running, because a trial whose rules are settled after the results can be read to support almost anything.

The chapter builds the baseline from the factory's own records, writes a rule that would show the claim false, works out what passing and failing could each mean, and shows why a well-known test-planning method fits the controller claim but would mislead if used for the seals.

## The baseline

This is an illustration. The factory's six pumps of this model have had fourteen seal failures in four years. The maintenance planner has fitted a Weibull distribution to the failure and survival times, with a shape β of 2.2 and a characteristic life η of 9,000 hours. A shape above 1 means the failure rate rises with age, the pattern of wear. The [Accelerated Life Testing chapter on reading life data with the Weibull distribution](/reados/publications/accelerated-life-testing-by-the-numbers/reading-life-data-with-weibull/) explains the method.

The [Weibull reliability tool](/tools/weibull-reliability/) in BIZOMAT Tools calculates, from a Weibull shape and characteristic life, the reliability at a chosen time, the probability of failure by then, the hazard rate, the B10 life, by which 10% have failed, and the mean time to failure, and it names the failure pattern from the shape. Its limitations are stated: it is a two-parameter Weibull with no failure-free period, and its parameters must come from failures of the same part in the same duty.

The supplier's "three times the life" needs one more definition before it can be tested. The plant engineer asks, and the supplier confirms in writing, that it means three times the characteristic life with the same wear-out shape: η of 27,000 hours instead of 9,000. She also works out an intermediate case, 1.5 times, to see whether a trial could tell a modest improvement from the full claim.

```figure
type: compare
title: Seal life under three hypotheses, β = 2.2
cols: η | Failing by 6,000 h | B10 life | Mean life
caption: This is an illustration. From the Weibull reliability tool. The claim predicts few failures in a year of running; the present seals predict a third failing.
- Present seals | 9,000 h | 33.6% | 3,236 h | 7,971 h
- 1.5 times as long | 13,500 h | 15.5% | 4,854 h | 11,956 h
- * Claim: 3 times as long | 27,000 h | 3.6% | 9,708 h | 23,912 h
```

## The trial and its rule

This is an illustration. The package covers only P1 and P2, but two seals are too few to test a life claim. The plant engineer asks the supplier to provide four more seals for the other four pumps of the same model, at its cost, so that six run under the same duty. The supplier agrees: the claim is its own, and Chapter 1's allocation puts the burden of evidence on it.

The trial runs for 6,000 hours, one year of production. Before any seal is fitted, the plant engineer writes the rule, and both parties sign it.

> Seal trial rule: six new seals, fitted to the supplier's instructions and witnessed. A failure is any leak needing the seal to be replaced. Each failed seal is torn down and its cause recorded. If two or more of the six fail within 6,000 hours, the claim of three times the present life is refuted for this duty. If one or none fails, the claim is not refuted, and the trial continues.

### What the rule can and cannot show

A rule is only as good as its behaviour under each hypothesis. The plant engineer works out, from the probabilities above and the binomial distribution, how likely each outcome is.

```figure
type: bars
title: Chance the trial does not refute the claim, by the seals' true life
unit: %
max: 100
caption: This is an illustration. Six seals, 6,000 hours, refuted by two or more failures. A true claim is almost never refuted. But seals no better than the present ones pass a third of the time, and seals half as good as claimed pass three times in four.
- * True life 3 times present | 98.2
- True life 1.5 times present | 76.6
- No better than present | 34.6
```

The result is lopsided, and the lopsidedness is the key to reading the trial honestly.

- **Refutation is strong.** If the claim is true, the chance of two or more failures in a year is about 1.8%. If the trial refutes the claim, it is very unlikely to be wrong.
- **Survival is weak.** If the seals are no better than the present ones, the trial still passes about 35% of the time. If they are half as good as claimed, it passes about 77% of the time. A pass is consistent with the claim, and with much less than the claim.

So the trial is a test that could prove the claim wrong, which is exactly what was asked of it. It is not a test that could prove the claim right. A pass after one year means "not refuted", and the plant engineer writes that phrase, not "confirmed", into the rule's outcome. The trial continues past 6,000 hours precisely because a longer run discriminates better, as the exercise shows.

### Why write the rule first

A trial without a written rule invites reading the results to suit. If one seal fails, the buyer may call it a warning; the supplier may call it bad luck. If two fail, the supplier may find reasons why they do not count. Each reading might be defensible, and none can be checked, because nobody said in advance what would count. The [Stage Gates chapter on kill criteria written before the evidence](/reados/publications/stage-gates-and-stopping-rules-by-the-numbers/kill-criteria-before-the-evidence/) makes the same argument for project decisions.

Writing the rule first has a second benefit: it forces both parties to say what they think will happen. The supplier, signing the rule, is betting that two or more failures in a year are unlikely. If it would not sign, that tells the buyer something about its confidence in its own claim.

## Making the trial fair to both sides

A rule protects the trial from being read to suit. It does not protect it from being run unfairly, and unfairness can run in either direction. The plant engineer adds four conditions to the trial plan, each agreed with the supplier.

**Same pumps, same duty.** The new seals go into the same six pumps whose records produced the baseline, at the same flows, temperatures and water treatment. If the new seals ran in an easier duty, a pass would mean nothing; in a harder one, a refutation would be unfair. The factory logs the duty monthly, so that either side can show later that it did not change.

**Witnessed fitting.** Each seal is fitted by the factory's fitters to the supplier's written instructions, with the supplier's technician present for the first two. That protects the supplier from careless fitting and protects the factory from a later claim that the seals were fitted wrongly. Chapter 7 shows why this condition matters more than it seems.

**Hours, not calendar time.** The rule speaks of 6,000 hours, and pumps do not all run every hour. A pump that is stopped for a mould change or a breakdown accumulates no seal hours. Each pump's run-hour meter is read monthly, and a seal removed for a reason other than its own failure, such as a bearing replacement, is recorded as a suspension: it survived to that point and then left the trial. Ignoring suspensions, or counting them as failures, would bias the result.

**The baseline's own uncertainty.** The baseline of η = 9,000 hours comes from fourteen failures, which is a modest record. Its true value could plausibly be somewhat higher or lower. The plant engineer asks the maintenance planner for the uncertainty in the fit, and checks how the rule behaves if the present seals' true η were, say, 8,000 or 10,000 hours. The chance of wrongly refuting the claim does not change, because it depends only on the claimed η of 27,000 hours, which the supplier has fixed in writing. The chance that seals no better than the present ones pass moves from about 35% to between about 22% and 47%. The shape of the result, strong refutation and weak survival, is unchanged. Had the baseline been much less certain, she would have run some standard seals alongside the new ones, so that both were measured in the same year.

These conditions are not bureaucracy. Each closes a route by which a result could later be disputed. A trial that both parties agree was fair produces a result both must accept, whichever way it goes. That is worth more to the supplier of a good seal than a lenient trial, because only a fair trial's pass is worth showing to the next customer.

## A test plan that suits the controller but not the seals

There is a well-known way to plan a reliability demonstration, and it is worth seeing why the plant engineer does not use it for the seals.

The [reliability demonstration test plan](/tools/reliability-demonstration-test/) in BIZOMAT Tools calculates the test length needed to demonstrate an MTBF for equipment with a constant failure rate: the chi-square test-length factor for the confidence and the number of failures allowed, the total unit-hours, the hours per unit and the calendar days at your running hours, against the days available. Its limitations are stated plainly: it applies to a constant failure rate only; early-life failures and wear-out make the model optimistic or pessimistic.

That model suits the controller from Chapter 2, whose failures are random. The plant engineer uses it to see what demonstrating the 150,000-hour claim at the factory would take: six controllers, if the factory had six, running about 16.4 hours a day.

```figure
type: stats
title: Demonstrating a 150,000-hour MTBF on site
caption: This is an illustration. From the reliability demonstration test plan, 90% confidence, no failures allowed. The test is impossible at one factory; the evidence must come from a fleet, which is why the supplier's field data in Chapter 2 matter.
- 2.303 | Test-length factor | No failures allowed
- 345,388 h | Total unit-hours needed | 150,000 h × 2.303
- 3,510 days | With six units at 16.4 h a day | About nine and a half years
- * 58 units | Needed to finish in one year | The tool's own suggestion
```

The burden of demonstrating the controller claim cannot be met at one factory in any reasonable time. It can only be met by the supplier's fleet, which is where it belongs.

For the seals, the same tool would mislead. Seals wear: their failure rate rises with age, as the shape of 2.2 shows. A constant-rate test plan treats an hour on a new seal as worth the same as an hour on an old one, so a short test on many new seals would "demonstrate" a long MTBF that the seals could never reach, because they had not yet begun to wear. A tool used outside its model gives a confident wrong answer. That is why the seal trial is built on the Weibull model and runs long enough for wear to show.

## The failure case: the trial that was never over

This is an illustration. Some years ago the factory trialled a ceramic coating on pump impellers, sold as "greatly extending life in abrasive water". Three coated impellers were fitted. No rule was written. After a year, one coated impeller showed wear similar to an uncoated one, and two looked better. Maintenance thought the coating was promising; purchasing thought it was unproven; the supplier thought it was proven. Two years later the trial was still "ongoing", and nobody could say what result would end it.

### How it is detected and corrected

The failure is detected at the start, by asking before anything is fitted: what result, by what date, will refute the claim, and what will we do if it does or does not? If nobody can answer, the trial is not a test. The correction is to write the rule, with the definitions of a failure and a measurement, the sample, the duration and the decision each outcome leads to, and to have both parties sign it. For the coating, that would have meant measuring vane thickness at fixed points every quarter and stating the wear rate that would count as no improvement.

## Exercise: a longer trial

The plant engineer considers running the trial to 9,000 hours instead of 6,000. By then, the Weibull reliability tool gives a failure probability of 63.2% for the present seals, 33.6% for seals 1.5 times as good, and 8.5% for seals as claimed.

1. With the rule "two or more failures refute", what is the chance of wrongly refuting a true claim, and of failing to refute seals no better than the present ones?
2. With the rule "three or more failures refute", what are those chances, and what is the chance of failing to refute seals 1.5 times as good?
3. Which rule would you choose, and why?

**Worked answer.**

1. With six seals and two or more failures refuting, the chance of wrongly refuting a true claim is about 8.7%, and the chance of failing to refute seals no better than the present ones about 2.8%.
2. With three or more failures refuting, the chance of wrongly refuting a true claim falls to about 1.0%. The chance of failing to refute seals no better than the present ones rises to about 13.8%, and for seals 1.5 times as good it is about 67.5%.
3. Either rule is defensible if chosen before the trial; the choice depends on which error matters more. The three-failure rule protects the supplier from an unlucky refutation, but lets a mediocre seal pass more often. The two-failure rule catches weak seals better, at a higher risk of refuting a good one. For a low-consequence duty where the factory is paying a premium for the claimed life, many buyers would choose the two-failure rule at 9,000 hours and agree it with the supplier in writing. Whatever the choice, it must be made, and signed, before the first seal is fitted.
