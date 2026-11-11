---
book: practical-wisdom-by-the-numbers
chapterSlug: change-the-procedure-with-care
order: 8
title: "Change the procedure only when the gain outweighs the change"
description: "Compare two lasting fixes on an honest baseline, recognise when a comparison is too close to call, and weigh the cost of changing a rule others rely on before standardising."
draft: true
---

The flanges are delivered. The decision about the 18 has been made, carried out and recorded. But the incoming sample from the next production batch shows porosity at a rate similar to the one that started the book, which means the problem was never really about 18 flanges. It was about a supply process that has changed for the worse. The workshop now has to decide whether, and how, to change its own procedures and its supply arrangements.

Aquinas has something precise to say about changing rules. Discussing human law, he argues that a law should not be changed every time something better comes along (*Summa Theologiae* I-II q.97 a.2). Changing a law does some harm in itself, because laws draw much of their force from custom, and custom is weakened every time the rule changes. A change is justified only when the common good is "compensated according to the extent of the harm done", either by a very great and evident benefit or by urgent necessity. He contrasts this with the rules of an art, which can be improved whenever something better is found.

That contrast is the key to this chapter. Some of what a workshop does is art: methods it controls and can improve freely, provided it verifies the improvement. Some of it functions like law: requirements other people rely on, such as a customer's approved material, a qualified supplier or a procedure that a whole team has been trained to follow. Changing those carries a cost that a simple saving calculation does not show.

## Set an honest baseline

Any lasting fix is valued by the rejects it avoids. The first question is how many rejects there would be without it. Chapter 2 established the answer from records: 46 rejects in 1,440 flanges, about 3.2%, with the current batch's 7.5% treated as an abnormal result to be explained, not a new normal.

This is an illustration. The workshop machines about 1,200 flanges a year from this foundry, five batches of 240. At 3.2%, that is about 38 rejects a year. Each reject costs the A$221.50 replacement cost from Chapter 1 plus about half an hour of nonconformance handling at A$110 an hour, A$55, for a total of A$276.50.

### A failure: the vivid baseline

The first draft of the business case for a fix used 7.5% as the baseline, because that was the rate everyone had just lived through. On that basis, a fix that brought rejects down to 1.2% would avoid 1,200 × (0.075 − 0.012) = 75.6 rejects a year, worth about A$20,900 before costs. The figure was exciting, and wrong.

It was detected by the same check that caught the shift lead's recollection in Chapter 2: every number in a decision must be traced to a source. The 7.5% traced to a single batch that the team had already shown, with a probability of about 0.0008, to be unlike the usual process. Using it as a baseline would have overstated the annual benefit by a factor of more than three and made almost any fix look worthwhile. The correction is to use the recorded long-run rate and to treat a return to it as the minimum the foundry must restore, not as a saving the workshop earns.

```figure
type: bars
title: Avoided reject cost a year for option A, on two baselines
unit: A$
caption: The vivid single-batch baseline makes the same fix look more than three times as valuable as the recorded rate supports.
- Baseline 7.5%, one abnormal batch | 20903 | 75.6 rejects avoided
- *Baseline 3.2%, recorded long-run rate | 6636 | 24 rejects avoided
```

## Two lasting fixes

Counsel with the foundry and a second supplier produced two options.

**Option A: fix the casting process.** The foundry proposes to revise its gating and add its own check of the flange face before dispatch. It will charge A$2.50 more per casting, A$3,000 a year at 1,200 castings, and asks the workshop to share a pattern modification at A$2,500. The workshop would inspect a trial batch more closely, about 6 hours at A$110. The foundry expects the reject rate to fall to about 1.2%. The castings would still be the same material and design, so nothing the customer relies on changes. Lead time to the first improved batch is about 60 days.

**Option B: switch to forged flanges.** A second supplier offers forged blanks with a reject rate it states as about 0.3%, at A$6 more per piece, A$7,200 a year. Changing from a casting to a forging changes the material form the customer's specification calls for, so the workshop would need 8 hours of engineering to prepare a submission and first-article documentation, 6 hours of first-article inspection, and 4 hours of engineering for the customer's approval process. Lead time is about 90 days, mostly waiting for that approval.

| | Option A: fix the casting | Option B: switch to forging |
|---|---|---|
| Rejects a year | 38.4 down to 14.4 | 38.4 down to 3.6 |
| Avoided reject cost a year | 24 × A$276.50 = A$6,636 | 34.8 × A$276.50 = A$9,622.20 |
| Added price a year | A$3,000 | A$7,200 |
| Net annual benefit | A$3,636 | A$2,422.20 |
| One-off cost | A$2,500 + 6 h × A$110 = A$3,160 | 8 h × A$140 + 6 h × A$110 + 4 h × A$140 = A$2,340 |
| Time to effect | About 60 days | About 90 days |
| What changes for the customer | Nothing they rely on | Material form; needs their approval |

## Compare them with a tool

The BIZOMAT [two-option comparison](/tools/option-compare/) scores two alternatives on annual benefit, cost, delivery time and risk. Its score is the benefit-to-cost ratio multiplied by 50, plus 8 points for each step the risk rating sits below 6 on a 1-to-5 scale, plus a delivery term of 40 less one point for every three days, floored at zero. It calls the result too close to call when the two scores are within 10% of each other, and it reminds the user to exclude any option that fails a mandatory requirement before scoring.

The workshop enters the net annual benefit and the one-off cost for each option, with risk ratings of 3 for option A, whose 1.2% is the foundry's expectation rather than a demonstrated result, and 2 for option B, whose supplier has a longer record.

```figure
type: compare
title: How the two-option comparison scores the fixes
cols: Option A: fix the casting | Option B: switch to forging
caption: The scores are within 10% of each other, so the tool reports the comparison as too close to call.
- Benefit ÷ cost × 50 | 3,636 ÷ 3,160 × 50 = 57.5 | 2,422.20 ÷ 2,340 × 50 = 51.8
- Risk term (6 − risk) × 8 | (6 − 3) × 8 = 24 | (6 − 2) × 8 = 32
- Delivery term 40 − days ÷ 3 | 40 − 60 ÷ 3 = 20 | 40 − 90 ÷ 3 = 10
- *Score | 101.5 | 93.8
- Benefit-to-cost ratio | 1.15 times | 1.04 times
```

Option A scores 101.5 and option B 93.8. The difference is 7.7 points, about 7.6% of the higher score, so the tool reports that the options are too close to call and advises deciding on factors outside the score or gathering better data. Both options pay back their one-off cost within about a year: A in about 10.4 months and B in about 11.6.

A score that cannot separate two options has done its job. It has shown that the quantities it measures do not settle the question, and pointed attention at what they leave out.

## Weigh the harm of change

What the score leaves out is exactly what Aquinas's discussion of law puts at the centre: the harm of changing a rule that others rely on.

Option A changes the foundry's method, which is an art in Aquinas's sense. The castings arriving at the workshop are the same part to the same specification. The workshop's own procedures do not change, the customer's approvals do not change, and if the foundry's improvement fails, the workshop is no worse off than today. The change is reversible and local.

Option B changes something the customer relies on. Their specification calls for a casting; their quality records, perhaps their own customer's approvals, are built on it. Changing to a forging means asking them to change their rule, with all the review, documentation and residual uncertainty that brings, and it means the workshop's inspectors learning a new part from a new supplier. If the change proves troublesome, reversing it means asking the customer to change their rule back. None of that appears in A$2,340 of one-off cost.

On Aquinas's test, option B's benefit would need to be very great and evident to compensate for that harm. It is neither: its net annual benefit is lower than option A's, and its advantage, a lower reject rate, rests on the supplier's statement rather than the workshop's own evidence. Option A is the proportionate change. Option B remains a sound idea to put to the customer in its own right, for them to decide on their own schedule, but not one the workshop should press because of one bad batch.

## Trial before standardising

Option A's benefit is not yet evident either. It is the foundry's expectation. The prudent course is to run a trial before standardising, and to decide in advance what result would count as success.

The workshop sets the rule before the trial batch arrives: three or fewer rejects in a batch of 240. If the process had not improved and the true rate were still 3.2%, the chance of three or fewer rejects would be about 5%, so success would be good evidence of a real improvement. If the process had improved to 1.2%, the chance of three or fewer would be about 67%. The rule therefore has about a one-in-three chance of failing a genuine improvement, which is why the workshop agrees with the foundry that a failed trial leads to a second trial, not straight to option B.

```figure
type: steps
title: From trial to standard
caption: The success rule is fixed before the trial so the result cannot be argued into a conclusion afterwards.
- Agree the success rule | three or fewer rejects in 240, set before the trial
- Run the trial batch | foundry's revised gating and face check; full inspection at the workshop
- *Decide | success: standardise and update records; failure: second trial, then reconsider
- Update memory | add the trial and its result to the batch records used in Chapter 2
```

## Who owns the change, and who is told

A change to a process has an owner, and the owner is the party whose method changes. For option A, the foundry owns the revised gating and its face check. The workshop owns the trial, the success rule and the decision to accept improved castings as standard. Each party should write down what it has agreed to, because a change that two parties believe the other is responsible for tends to lapse after the first good batch.

The customer does not own option A and does not need to approve it, because nothing they rely on changes. That does not mean they should be left out. They were affected by the bad batch, they accepted a concession on the workshop's evidence, and they will reasonably want to know whether the next order will look the same. A short note from the quality lead, saying that the cause has been traced to the foundry, that a process fix is being trialled, and that incoming castings are being sampled until it is proven, costs nothing and answers the question before it is asked. Informing is not the same as asking permission, and a prudent workshop knows which of the two each change requires.

Option B, if it is ever pursued, reverses the roles. The customer would own the decision because it changes their specification, and the workshop's part would be to present the evidence, as it did for the concession, and let them decide.

## Close the loop

The last act of prudence in this case is to make its lessons available to the next decision. The decision record for the 18 flanges, the risk ratings, the concession request and the customer's answer, the corrected spreadsheets, the capacity check, the command and the outcomes are filed together with the trial plan. The batch records gain the current batch and, in due course, the trial.

Each part of prudence has left something in that file. Memory has a longer record. Understanding has the customer's confirmation of what the criterion means. Docility has the names of the people who knew what the inspection report did not say. Foresight and caution have a risk register with its assumptions written beside each rating. And command has a timeline showing that what was promised was done. The next team facing a bad batch will start where this one finished.

## Exercise: a dearer fix

Suppose the foundry's price increase for option A were A$4.00 per casting instead of A$2.50, with everything else unchanged. Recalculate option A's net annual benefit and score, compare it with option B and say what the workshop should do.

**Worked answer.** The added price becomes 1,200 × A$4.00 = A$4,800 a year, so option A's net annual benefit falls to 6,636 − 4,800 = A$1,836. Its benefit-to-cost ratio is 1,836 ÷ 3,160 = 0.58, worth 29.1 points; with the unchanged risk term of 24 and delivery term of 20, the score is about 73.1. Option B still scores about 93.8. The difference is now about 22% of the higher score, so the tool would prefer option B, and it would also note that option A no longer pays back its one-off cost within a year: payback is about 20.7 months. The score's preference does not by itself justify option B, because B still changes the customer's specification and its benefit still rests on a supplier's claim. The prudent next step is to return to the foundry with the numbers, since a surcharge of A$2.50 makes A clearly worthwhile and A$4.00 does not, and in parallel to put option B to the customer as a proposal for them to evaluate. The workshop should change what it controls on its own evidence, and ask before changing what others rely on.
