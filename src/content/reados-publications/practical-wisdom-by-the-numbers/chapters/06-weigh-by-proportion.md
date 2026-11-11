---
book: practical-wisdom-by-the-numbers
chapterSlug: weigh-the-means-by-proportion
order: 6
title: "Weigh the means by proportion, not by the cheapest line"
description: "Cost each option for everyone it affects, find the acceptance probability at which asking pays, and test the choice for proportion between the means and the end."
draft: true
---

By the end of day zero the team had three legitimate options, a set of low residual risks and a draft concession request. Before the request went to the customer, the owner asked the question every business eventually asks: which option is cheapest? It is a fair question. It is not the decisive one.

Aquinas's test for a good means is proportion. Discussing self-defence, he observes that one act can have two effects, one intended and one beside the intention, and that an act done for a good end can still be wrong if it is "out of proportion to the end" (*Summa Theologiae* II-II q.64 a.7). The principle reaches well beyond its original setting. A means is judged by whether its costs and side effects are proportionate to what it achieves, for everyone it affects. This chapter applies that test to the flange options, and shows how a decision built on the workshop's cheapest line would have been the least proportionate of all.

## List the effects of each option

Every option has an intended effect: delivering flanges that seal reliably in time for installation. Each also has side effects, some falling on the workshop and some on the customer. Proportion requires both to be counted.

This is an illustration. The costs below use the case figures: A$221.50 to replace a flange, A$380 for a second freight delivery, A$600 to prepare the concession request, and the purchase order's deduction of A$200 for each working day any part of the order is late. Replacements ordered on day zero are ready on day 12, six working days after the due date, so any option that replaces flanges incurs six days of deductions, A$1,200.

The customer's side effects depend on the installation schedule learned in Chapter 2: stage 1 needs 120 flanges from working day 8 and stage 2 needs the rest from day 18. The customer's engineer, asked during counsel, estimated that an idle installation crew with its hired equipment costs about A$3,800 a working day.

| Option | Workshop cost | Customer effect | Notes |
|---|---|---|---|
| A. Hold all 240 until day 12 | A$5,187 | Stage 1 delayed 4 days: about A$15,200 | 18 replacements A$3,987 plus A$1,200 deductions; one freight |
| B. Ship 222 now, replace 18 | A$5,567 | None: stage 1 has its 120, stage 2 gets the rest early | Adds A$380 for a second delivery |
| C. Concession for 12, replace 6 (accepted) | A$3,509 | Review effort; 12 marked flanges on file | 6 replacements A$1,329, freight, request A$600, deductions |
| C. Concession refused | A$6,167 | None beyond B | Becomes B plus the A$600 spent on the request |

```figure
type: bars
title: Cost of each option to both parties combined
unit: A$
caption: Option A is the workshop's cheapest outright option but by far the most expensive once the customer's idle crew is counted.
- Option A, hold all | 20387 | A$5,187 to the workshop, about A$15,200 to the customer
- Option B, ship 222 | 5567 | all to the workshop
- *Option C, concession accepted | 3809 | A$3,509 to the workshop, about A$300 of the customer's review time
- Option C, concession refused | 6167 | all to the workshop
```

## A failure: choosing the cheapest line

The first spreadsheet the owner saw compared only the workshop's costs, and only options A and B. On that basis, holding the whole batch was A$380 cheaper than splitting the delivery, because it avoided a second freight. The owner's first instinct was to hold.

That choice would have saved the workshop A$380 by imposing about A$15,200 on the customer: four days of an idle crew waiting for flanges that were already sitting, conforming, on the workshop's floor. In Aquinas's terms, the means would have been grossly out of proportion to the small good it secured. In plainer terms, it would have been a poor way to treat a customer who would remember it.

The spreadsheet had a second error. It costed option B with the 18 replacement castings counted twice: once inside the A$221.50 replacement cost, and again as a separate line of 18 × A$62 = A$1,116 for "castings ordered". That inflated option B to A$6,683 and made holding look A$1,496 better instead of A$380. The error was found when the quality lead rebuilt each total from unit costs and the totals did not match.

Both errors are detected by the same habit: rebuild every total from its parts, and add a column for every party who bears a cost. The first catches arithmetic. The second catches the narrower error of treating one party's ledger as the whole of the consequences.

## Count the effects nobody intended

Aquinas's distinction between what is intended and what happens beside the intention is useful because side effects are where decisions most often go wrong. Nobody in the workshop intends to idle the customer's crew, displace another customer's job or strain the relationship with the foundry. Each of those can still follow from an option, and a prudent decision accounts for them before choosing.

Three side effects appear once the team looks for them:

1. **Machine time.** Replacing 18 flanges takes about 28 hours of machining, inspection and packing; replacing 6 takes about 10. Those hours come out of capacity already promised to other customers in the week of day 10 to day 12. Option B displaces about 18 more hours of other work than option C. Chapter 7 checks whether the hours exist at all.
2. **The deduction.** All three options incur the same six days of deductions, A$1,200, because each leaves some part of the order late. The deduction therefore does not distinguish between them. Teams under pressure often fixate on a penalty clause and let it drive the choice, when a quick check shows it is the same for every option on the table. The workshop will ask the customer whether the deduction will apply given that stage 1 is supplied on time, but it does not assume a waiver in its numbers.
3. **The foundry.** Each option involves telling the foundry that its castings caused rejects. That conversation has to happen whichever option is chosen, so it does not distinguish the options either, but it does need an owner and a date, which go into the command in Chapter 7.

Listing side effects in this way often shows that some of them do not matter to the choice. That is a useful result. It shortens the argument and points attention at the effects that do differ, which here are the customer's idle crew under option A and the extra machine hours under option B.

## Is asking worth it?

Option C is the cheapest for both parties if the customer accepts the concession, and the most expensive for the workshop if the customer refuses, because the A$600 spent on the request is then wasted. Whether to ask therefore depends on how likely acceptance is.

The comparison is with option B, which is what the workshop would do without asking. Let p be the probability that the concession is accepted. The expected cost of asking is p × 3,509 + (1 − p) × 6,167. Asking is worth it when that is less than B's 5,567.

```figure
type: formula
title: The acceptance probability at which asking pays
formula: p* = (cost if refused − cost of B) ÷ (cost if refused − cost if accepted)
caption: Below about 23% acceptance, asking costs more than it saves; the team's estimate of 70% is well above it.
- Cost if refused | A$6,167
- Cost of B | A$5,567
- Cost if accepted | A$3,509
step: p* = (6,167 − 5,567) ÷ (6,167 − 3,509) = 600 ÷ 2,658 = 0.226
step: At p = 0.7, expected cost = 0.7 × 3,509 + 0.3 × 6,167 = A$4,306.40
step: Expected saving against B = 5,567 − 4,306.40 = A$1,260.60
```

The break-even probability is about 22.6%. The team's estimate, based on the customer's engineer saying that concessions are allowed with evidence, the size and position of the indications, and the section results, is that acceptance is likely, perhaps 70%. At that estimate the expected cost of asking is A$4,306.40, about A$1,261 less than option B.

The number should not be overrated. A 70% estimate is a judgement, and nobody will ever know whether it was right; the customer either accepts or does not. What the calculation shows is that the decision is robust. Asking is worthwhile at any estimate above about 23%, and nobody in the room thought the chance was that low. When a decision is robust to a wide range of a key estimate, the team can stop arguing about the estimate.

## Proportion is not only money

Proportion weighs more than dollars. Option C asks the customer to accept 12 flanges that do not conform to the letter of their specification. That has a cost the table does not show: a nonconformance on the customer's records, and a small, permanent difference between these 12 flanges and the other 228. The workshop's request proposes conditions that keep that cost small: marking, traceable records and the customer's pressure test before service.

Australian work health and safety law has its own version of proportion. Under the model Work Health and Safety Act, duties to ensure health and safety are qualified by what is reasonably practicable, and Safe Work Australia's guidance explains that cost is weighed against the risk and can justify not taking a control only when it is grossly disproportionate to the risk. The flange decision is a supply decision, not a workplace safety duty, and the analogy should not be pushed too far. The shared idea is sound: a means is acceptable when its burdens are in proportion to what it secures, and convenience alone is never a sufficient reason to accept a serious risk. The Library chapter [so far as is reasonably practicable](/reados/collections/operational-data-records-and-controls/so-far-as-is-reasonably-practicable/) covers the Australian safety standard itself.

```figure
type: balance
title: Option C in proportion
left: What it secures
right: What it costs
caption: The means is proportionate when the burdens on each side are small compared with the end they serve.
- On-time delivery for stage 1 | A$600 request preparation
- 12 good castings returned to stock | 12 marked nonconformances on file
- A$2,658 of replacements avoided | The customer's review time
- Full evidence for the customer's decision | Risk of refusal, already hedged
```

## Check the choice against the circumstances

Circumspection, in Aquinas's list, is the habit of checking whether a means that suits the end in general still suits it in the particular circumstances (II-II q.49 a.7). Chapter 1 described the decision by seven circumstances. Before committing, the team runs the preferred option back through the same seven questions.

| Circumstance | Option C, checked | Still fits? |
|---|---|---|
| Who | The workshop proposes; the customer's engineer decides on the 12 | Yes: authority stays with the owner |
| What | 222 conforming now, 12 by concession, 6 replaced | Yes: no flange ships without a decision |
| Where | Pump station at 1.6 MPa, pressure-tested before service | Yes: the test is a condition of the request |
| By what aids | 18 castings on order, machine hours to be confirmed | Not yet: capacity is checked in Chapter 7 |
| Why | Reliable seal, delivered to suit installation | Yes: stage 1 on time, stage 2 ahead of need |
| How | Full evidence, including what argues against | Yes: the request states its limits |
| When | Request today; answer by day 2; replacements day 12 | Yes, if the foundry holds its lead time |

One line is not yet settled. The option depends on the workshop having the machine hours to finish the replacements by day 12, and nobody has checked that. Circumspection does not reject the option for that reason; it marks the gap as a condition of the decision, to be closed before the command is given. Choosing an option while an essential means is unconfirmed is how plans that look sound on paper fail in the workshop.

## The choice

On day zero the team chose option C with option B as its fallback: ship the 222 conforming flanges on the due date, request a concession for the 12 outside the gasket band, and replace the 6 that could affect the seal. It ordered all 18 castings immediately, so a refusal would not delay the castings. The choice was the cheapest for the workshop in expectation, the cheapest for the two parties together, and it left the decision about nonconformance with the party who owned the specification.

That last feature is what makes the choice proportionate rather than merely economical. A cheaper option that took the customer's decision away from them would have failed the test, however good its numbers.

The decision record now carries the options considered and the reasons for the choice. It shows the cost of each option to each party, the corrected spreadsheet with a note of the double-counting error, the break-even probability and the team's estimate, and the one open condition: machine capacity for the replacements. A reviewer reading it later can disagree with the 70% estimate or the A$3,800 crew cost, but can see that both were stated, sourced and tested for their effect on the outcome. That is what a proportionate decision looks like on paper: not a single number, but a weighing that someone else can follow and challenge.

## Exercise: a more expensive request

Suppose preparing the concession request had needed an external metallurgist's report costing A$1,500 instead of A$600 of internal time. All other figures are unchanged. Calculate the new break-even acceptance probability and say whether the team should still ask.

**Worked answer.** If accepted, option C now costs 1,329 + 380 + 1,500 + 1,200 = A$4,409. If refused, it costs 3,987 + 380 + 1,500 + 1,200 = A$7,067. Option B is unchanged at A$5,567. The break-even probability is (7,067 − 5,567) ÷ (7,067 − 4,409) = 1,500 ÷ 2,658 = 0.564, or about 56%. At the team's estimate of 70%, the expected cost of asking is 0.7 × 4,409 + 0.3 × 7,067 = A$5,206.40, still about A$361 less than B. The team should still ask, but the decision is no longer robust: an estimate a little below 60% would reverse it. In that position it would be prudent to call the customer's engineer before commissioning the report and ask informally whether a concession of this kind is likely to be considered, because that one conversation is worth more than the report's precision.
