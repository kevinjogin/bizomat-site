---
book: demand-and-benefit-forecasts-by-the-numbers
chapterSlug: testing-the-drivers
order: 3
title: "Testing each driver against the record"
description: "Letters of intent converted at 70.8% and other prospects at 25.0%, volumes realised at 0.800: tested driver by driver, the plant's 25.32m cans become 15.367m, 60.7% of plan."
draft: false
---

A driver tree shows what a forecast claims. It does not show whether the claims are likely. For that, each driver has to be set beside a record of what happened the last time similar claims were made. Most businesses that have launched anything before hold such a record without having looked at it: a list of the letters of intent they collected, the customers who actually signed, and what those customers actually bought in their first year.

This chapter tests the canning plant's customer drivers against the business's own record from the launch of its second mobile rig in 2021. It explains what a letter of intent is and is not, sets out the conversion and realisation rates from that launch, applies them segment by segment, and shows where the record fits the plant and where it can only stand in by analogy. It ends with a customer count that treated every letter of intent as a certainty.

## The inside view and the record

[Building a demand forecast from its drivers](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/demand-from-drivers/) took the forecast apart into customers, runs, run sizes and contribution. Each customer number was the managing director's judgement about which named businesses would sign. That is an inside-view judgement in the sense of Kahneman and Lovallo (1993): built from knowledge of each prospect, its owner, its plans and its enthusiasm in conversation. What it leaves out is the base rate, the proportion of similar prospects in the past who actually became customers.

Kahneman and Lovallo's point was not that the inside view is careless. It is that detailed knowledge of the case at hand crowds out the statistics of the class it belongs to, and the more detailed the knowledge, the stronger the crowding. A sponsor who has had coffee with every prospect is more confident, not less, and has no more information about how many will sign than the business's records already hold.

## What a letter of intent is and is not

A **letter of intent** (LOI) is a signed statement that a prospective customer intends to buy, usually with an indicative volume and timing. It is useful evidence. It shows that someone with authority in the customer's business has considered the offer seriously enough to put a name to it. It is not a contract: it carries no obligation to buy, no minimum volume and no penalty for walking away, and the volume in it is usually the customer's own optimistic forecast of its own sales.

A letter of intent therefore carries two separate uncertainties. The first is **conversion**: whether the prospect becomes a regular customer at all. The second is **realisation**: how much of the stated volume a converted customer actually buys. A forecast that treats each letter as a customer at its stated volume assumes both are certain.

## The rig 2 record

This is an illustration. When the business added its second mobile rig in mid-2021, it collected letters of intent from craft brewers and kept a list of other named prospects it had talked to. Eighteen months later the outcomes were clear:

- **24 letters of intent** produced **17 regular customers**, a conversion of **70.8%**.
- **20 other named prospects** produced **5 regular customers**, **25.0%**.

For the 17 who converted from letters, the business compared each customer's first full year of actual volume with the volume stated in its letter. The ratios, sorted, were 0.42, 0.55, 0.61, 0.64, 0.68, 0.71, 0.74, 0.77, 0.79, 0.82, 0.85, 0.88, 0.91, 0.95, 0.98, 1.06 and 1.24.

The **mean realisation is 0.800** and the **median 0.790**. Using linear interpolation (PERCENTILE.INC), the 10th percentile sits 1.6 places along the sorted list of 17, between 0.55 and 0.61: 0.55 + 0.6 × 0.06 = **0.586**. The 90th percentile sits 14.4 places along, between 0.98 and 1.06: 0.98 + 0.4 × 0.08 = **1.012**. Only 2 of the 17 customers bought more than they said they would.

Putting the two together, the expected yield of a letter of intent, the share of its stated volume the business could expect to see, is 0.708 × 0.800 = **0.567**. On this record a letter promising 100,000 cans a year is worth about 57,000 cans of expected volume.

## Applying the record segment by segment

Behind the plant's 50 customers was a prospect list of 72 named businesses. For each segment, the expected number of customers is the letters of intent × 0.708 plus the other prospects × 0.250, and the expected volume is expected customers × the sponsor's volume per customer × 0.800.

- **A, craft brewers:** 22 letters and 18 others. Expected customers 22 × 0.708 + 18 × 0.250 = **20.08**, against the sponsor's 30. Volume 20.08 × 108,000 × 0.800 = **1.735m cans**.
- **B, ready-to-drink:** 4 letters and 5 others. Expected customers **4.08**, against 5. Volume 4.08 × 2.4m × 0.800 = **7.840m**.
- **C, non-alcoholic:** 8 letters and 12 others. Expected customers **8.67**, against 12. Volume 8.67 × 600,000 × 0.800 = **4.160m**.
- **D, overflow:** 3 letters and no others. Expected customers **2.13**, against 3. Volume 2.13 × 960,000 × 0.800 = **1.632m**.

The total is **15.367m cans a year, 60.7%** of the inside view's 25.32m. The mix shifts slightly towards the lower-margin segments, so contribution is **A$1,909.3k** a year, excluding GST, an average of **A$0.124 a can**, and EBITDA after the A$1.30m of fixed costs is **A$609.3k** against the inside view's A$1,901.6k. Volume falls by about two fifths; EBITDA falls by about two thirds, because the fixed costs do not move.

```figure
type: compare
title: The sponsor's drivers against the record, by segment
rowhead: Segment
cols: Prospects (LOIs + others) | Sponsor's customers | Implied conversion | Expected customers | Sponsor's volume | Expected volume
caption: This is an illustration. Expected customers = LOIs × 0.708 + others × 0.250; expected volume = expected customers × volume per customer × 0.800. The expected volume is 60.7% of the sponsor's.
- A, craft brewers | 40 (22 + 18) | 30 | 75.0% | 20.08 | 3.240m | 1.735m
- B, ready-to-drink | 9 (4 + 5) | 5 | 55.6% | 4.08 | 12.000m | 7.840m
- C, non-alcoholic | 20 (8 + 12) | 12 | 60.0% | 8.67 | 7.200m | 4.160m
- D, overflow | 3 (3 + 0) | 3 | 100.0% | 2.13 | 2.880m | 1.632m
- * Total | 72 (37 + 35) | 50 | 69.4% | 34.96 | 25.320m | 15.367m
```

The segment ratios of expected to sponsor's volume differ: 0.536 for craft, 0.653 for ready-to-drink, 0.578 for non-alcoholic and 0.567 for overflow. The craft forecast is the most optimistic because it counted the most customers per prospect. Overflow looks modest in conversion terms, since it has only three prospects, but the sponsor counted all three as certain.

This is an expected value, not a forecast range. The 15.367m figure is what the record suggests on average; any single outcome could be well above or below it, especially in segment B, where each expected customer at 2.4m × 0.800 = 1.92m cans a year carries about one eighth of the plant's expected volume. [From base rates to an honest forecast range](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/an-honest-forecast-range/) in Chapter 6 turns these rates into a distribution.

## The error: every letter counted as a customer

This is an illustration. In the business case, the managing director counted 30 craft customers. The reviewer asked two questions: which prospects made up the 30, and what had happened to the letters collected for rig 2. The answer to the first was that the 30 were all 22 craft brewers who had signed letters of intent, plus 8 of the 18 other named prospects whom the managing director judged most likely to sign. In effect the forecast assumed **100% conversion of letters** and **44.4% conversion of other prospects**, and full realisation of every stated volume.

The answer to the second was in the business's own files: 70.8% of letters and 25.0% of other prospects had converted, and converted customers had bought 0.800 of what they stated. Applied to the craft list, the record gives **20.08 expected customers**, not 30, and 1.735m cans, not 3.240m.

```figure
type: funnel
title: Segment A, from named prospects to expected volume
caption: This is an illustration. 40 craft prospects at 108,000 cans each state 4.320m cans; the sponsor counted 30 customers (3.240m); the record converts 20.08 (2.169m stated) and realises 0.800 of that: 1.735m.
- All 40 named prospects at stated volume | 4.320m | 22 LOIs + 18 others
- Sponsor's 30 customers | 3.240m | all LOIs + 8 others
- Record: 20.08 expected customers | 2.169m | 70.8% of LOIs, 25.0% of others
- * After realisation of 0.800 | 1.735m | 53.6% of the sponsor's figure
```

Nobody had concealed anything. The letters were real, the prospects were real, and the managing director's judgement of each was sincere. The error was to treat a judgement about individuals as if it were a forecast for the group, when the business already held a record showing how such groups behave. The correction was to replace each customer count with an expected value for each class of prospect, using the record, and to keep the managing director's own ranking of prospects for the sales plan, where it belongs.

The reviewer also recommended that the business keep the record properly from now on, because the rig 2 list had survived largely by luck. For every prospect, one row: the date of first contact, the segment, whether a letter was signed, the volume stated, the date of any supply agreement, the date of the first commercial run, the first full year's actual volume, and, for prospects that never converted, the reason given. Kept for the plant's own launch, that list becomes the next decision's evidence, and it can be split by segment once there are enough rows, so that ready-to-drink and non-alcoholic prospects are no longer judged by a record of craft brewers. Chapter 10 adds the plant's outcomes to it.

Testimony about intentions is a kind of evidence that has to be weighed, not counted, as [Testing the numbers you are given](/reados/collections/investment-appraisal-and-business-cases/testing-the-numbers-you-are-given/) argues more generally.

## Where the record does not fit

The rig 2 record is the best evidence the business has, but it comes from one kind of customer: craft brewers taking up a mobile service. Applying it to the plant's other segments is an argument by analogy, and the analogy has limits.

- **Ready-to-drink and seltzer brands** are larger, more commercial businesses. A letter from one may be more carefully considered than a craft brewer's, which would raise conversion, but such brands also tender their filling and switch suppliers on price, which would lower it. Their volumes depend on retail ranging decisions the brand does not control.
- **Non-alcoholic brands** are often young, fast-growing and thinly funded. Their stated volumes are forecasts of their own growth, the kind of forecast this book is about.
- **Overflow work** depends on the larger brewers' own capacity. It is real when their lines are full and vanishes when they are not.

None of this justifies ignoring the record for those segments. A record from an analogous class is better than none, and the burden of proof sits with anyone who argues that this class will behave better. What the limits do justify is a wider range around the expected value for the segments furthest from the record, which Chapter 6 provides. [Choosing the reference class](/reados/publications/reference-class-forecasting-by-the-numbers/choosing-the-reference-class/) in *Reference Class Forecasting by the Numbers* discusses the same trade between how similar a class is and how much evidence it holds.

## Runs and run sizes as separate checks

The realisation ratio of 0.800 combines two things: customers running less often than they said, and filling fewer cans each time. For appraisal the product is what matters, but for planning the line the parts matter separately. Fewer runs of the same size cost no extra line time per can. Smaller runs at the same frequency cost much more, because each run carries the same 1.5-hour changeover. A craft run that shrinks from 9,000 to 6,000 cans still takes 1.5 hours to change over and 0.67 hours to fill, so its changeover share rises from 60.0% to 69.2%.

The mobile rigs' job records hold both numbers for every craft customer, and the reviewer recommended splitting the realisation into a runs ratio and a run-size ratio for the plant's tracking, so that the operations manager could plan changeovers from the right one. The same split shows which segment's drivers deserve the most scrutiny before a decision. A ready-to-drink run of 240,000 cans takes 26.67 hours of filling, close to two days of the plant's two-shift operation, so a brand's run size is also a claim about its warehouse, its cash tied up in stock and its retail orders.

Gathering this evidence takes the reviewer a few days, and the board must decide whether that is worth it. [How much front-end planning is enough](/reados/publications/front-end-planning-by-the-numbers/how-much-front-end-is-enough/) in *Front-End Planning by the Numbers* sets out how to weigh the cost of such work against the value of what it can change.

```figure
type: checklist
title: Questions to ask of any evidence of customer intent
caption: Ticked items were done for the plant before approval; question marks are the open questions the reviewer put to the board. Weigh each letter; do not count it.
- Ask for the full prospect list, split into signed letters and other named prospects | 72 prospects: 37 letters, 35 others
- Find the business's own record of conversion for each class | rig 2: 70.8% of letters, 25.0% of others
- Compare first-year volume with stated volume for converted customers | mean realisation 0.800; 2 of 17 above 1.00
- Match the prospect list against existing customers | 8 craft prospects already on the mobile rigs
- ? Does the record come from the same kind of customer | no history for ready-to-drink, non-alcoholic or overflow work
- ? Which prospects are a large share of the volume on their own | each ready-to-drink customer carries about 1.92m expected cans
- ? Will any customer sign a minimum volume before approval | none had in February 2024
- x Counting every letter of intent as a customer at its stated volume | the sponsor's 30 craft customers
```

## Exercise: one more letter

Suppose that, before the board meets, one of the five ready-to-drink prospects without a letter signs one, so that segment B has 5 letters of intent and 4 other prospects. Using the rig 2 record, what are segment B's expected customers and expected volume, and how much does the new letter add?

**Worked answer.** Expected customers are 5 × 0.708 + 4 × 0.250 = 3.542 + 1.000 = **4.542**. Expected volume is 4.542 × 2.4m × 0.800 = **8.720m cans**, against 7.840m with four letters, an increase of **0.880m cans**. The letter moves one prospect from a 25.0% chance to a 70.8% chance, worth 0.458 of an expected customer at 1.92m cans each. It is good news, worth about 5.7% of the plant's expected volume, but it does not bring segment B anywhere near the 12.000m of the business case. Converting the letter into a supply agreement with a minimum volume would be worth more than collecting several further letters.
