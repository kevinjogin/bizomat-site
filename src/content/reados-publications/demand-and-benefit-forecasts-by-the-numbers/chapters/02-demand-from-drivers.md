---
book: demand-and-benefit-forecasts-by-the-numbers
chapterSlug: demand-from-drivers
order: 2
title: "Building a demand forecast from its drivers"
description: "The plant's 25.32m cans split into customers, runs and run sizes, converted to 3,680 line hours (92.0%) and contribution per hour, and eight 'new' customers who were not new."
draft: false
---

A forecast of 25.32m cans a year is one number, and one number cannot be tested. Nobody can say whether it is too high without knowing what it is made of: how many customers, how often they fill, how many cans each time, what each can earns and how long the line takes to fill them. Those are the forecast's **drivers**. Written out, each driver can be compared with a record, a contract or a physical limit, and the forecast stops being a matter of confidence and becomes a set of claims that can each be checked.

This chapter takes the canning plant's forecast apart into its drivers. It builds the driver tree, sets out the four segments, converts volume into line hours to see whether the plant can physically fill what is forecast, and works out what each segment earns per hour of line time. It grades each driver by the evidence behind it, notes the cautions that apply to any forecast made by judgement, and ends with eight customers who were counted as new business when they were already customers.

## Why one number hides its assumptions

This is an illustration. The managing director's business case, introduced in [The Hiding Hand and the evidence on optimistic forecasts](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/hiding-hand-and-the-evidence/), forecast 25.32m cans a year from 2027 and a contribution of A$3,201.6k a year, excluding GST. Presented as a total, the forecast invites only two responses: accept it, or say it feels high. Neither is useful. A board member who says it feels high has no way to say by how much, and a sponsor who defends it has nothing to point to but conviction.

The same forecast decomposed is far more useful. If segment B, ready-to-drink brands, supplies 47.4% of the volume from only five customers, then the forecast is mostly a claim about five businesses, and those five can be named and examined. If each craft brewer fills only 9,000 cans a run, the line spends more time changing over than filling, and that is a claim about capacity that can be tested with arithmetic. Decomposition does not make a forecast right. It makes it discussable, and it shows where checking effort will pay.

## The driver tree

For a contract filler the natural decomposition is by customer. For each segment:

- **volume** = customers × runs a year per customer × cans per run;
- **contribution** = volume × contribution per can;
- **line hours** = volume ÷ effective running rate + runs × changeover time.

Contribution per can is the service fee less the variable costs of filling: gases, power, water, cleaning chemicals, cartons and consumables. In this case it is an assumption for each segment, not a market price.

```figure
type: tree
title: The plant's forecast as a driver tree
caption: This is an illustration. Every leaf is a separate claim. Segment B carries 47.4% of the volume on five customers; segment A carries 360 of the 578 runs.
- Plant volume 25.32m cans, contribution A$3,201.6k | steady state from 2027
  - A, craft brewers: 3.240m | 30 customers × 12 runs × 9,000 cans; A$0.20 a can
  - * B, ready-to-drink and seltzer: 12.000m | 5 customers × 10 runs × 240,000 cans; A$0.10 a can
  - C, non-alcoholic: 7.200m | 12 customers × 12 runs × 50,000 cans; A$0.14 a can
  - D, overflow from larger brewers: 2.880m | 3 customers × 8 runs × 120,000 cans; A$0.12 a can
  - Line hours 3,680 of 4,000 | 2,813 h running + 867 h changeover across 578 runs
```

## The four segments

The segments differ in almost every driver. Craft brewers are many and small: each fills 108,000 cans a year in twelve runs of 9,000. Ready-to-drink brands are few and large: each fills 2.4m cans a year in ten runs of 240,000. Non-alcoholic brands sit between, at 600,000 cans a year each, and overflow work from larger brewers comes in eight runs of 120,000.

```figure
type: compare
title: The inside-view forecast by segment
rowhead: Segment
cols: Customers | Runs a year each | Cans a run | Volume | A$ a can | Contribution
caption: This is an illustration. A$ excluding GST. Volume shares A 12.8%, B 47.4%, C 28.4%, D 11.4%; segments B and C, the non-beer business, make up 75.8%.
- A, craft brewers | 30 | 12 | 9,000 | 3.240m | 0.20 | A$648.0k
- B, ready-to-drink and seltzer | 5 | 10 | 240,000 | 12.000m | 0.10 | A$1,200.0k
- C, non-alcoholic | 12 | 12 | 50,000 | 7.200m | 0.14 | A$1,008.0k
- D, overflow | 3 | 8 | 120,000 | 2.880m | 0.12 | A$345.6k
- * Total | 50 | 578 runs | | 25.320m | 0.126 average | A$3,201.6k
```

The table already shows something the total hid. The craft segment earns the most per can, A$0.20, because small runs carry a higher fee, but it supplies only 12.8% of the volume. Ready-to-drink earns the least per can and supplies nearly half. Fixed costs of A$1.30m a year are covered at **10.281m cans** at this mix, 40.6% of the forecast. That break-even point moves with the mix: more craft and it falls, more ready-to-drink and it rises.

## From volume to line hours

A canning line does not fill cans at its rated speed all day. The plant's line is rated at 200 cans a minute, 12,000 an hour, but after allowing for short stops, slow starts, can supply and minor faults, the case assumes an **effective running rate of 9,000 cans an hour** at maturity, 75% of rated. The plant is scheduled for **4,000 hours a year**: two shifts of 8 hours on 250 days. Every run also needs a **changeover** of 1.5 hours to clean, set up for the new can and liquid, and complete first-off checks.

The hours for each segment follow directly:

- **A:** 3.240m ÷ 9,000 = 360 h running, plus 360 runs × 1.5 h = 540 h changeover: **900 h**.
- **B:** 12.000m ÷ 9,000 = 1,333.3 h running, plus 50 runs × 1.5 h = 75 h: **1,408 h**.
- **C:** 7.200m ÷ 9,000 = 800 h running, plus 144 runs × 1.5 h = 216 h: **1,016 h**.
- **D:** 2.880m ÷ 9,000 = 320 h running, plus 24 runs × 1.5 h = 36 h: **356 h**.

In total the forecast needs 2,813 hours of running and 867 hours of changeover, **3,680 hours, 92.0% of the scheduled 4,000**. With no changeovers at all the line could fill 36.0m cans a year; with 578 runs taking 867 hours, the practical capacity falls to (4,000 − 867) × 9,000 = **28.197m cans**. The forecast fits, but with only about 320 hours to spare across a year.

```figure
type: stack
title: Scheduled line hours at the forecast volume
unit: h
caption: This is an illustration. Four segments fill 3,680 of 4,000 scheduled hours (92.0%). Craft's 900 hours are 60.0% changeover; ready-to-drink's 1,408 hours are 5.3% changeover.
- A, craft brewers | 900 | 360 h running + 540 h changeover
- B, ready-to-drink and seltzer | 1408 | 1,333 h running + 75 h changeover
- C, non-alcoholic | 1016 | 800 h running + 216 h changeover
- D, overflow | 356 | 320 h running + 36 h changeover
- Spare | 320 | about 8% of the year
```

Two points follow. First, 92.0% is a high planned load for a line that has never run. It leaves little room for breakdowns, slow learning, or the seasonal peak, when much of the year's demand arrives in a few months. Chapter 4 shows that the line itself runs well below 9,000 cans an hour in its first months. Second, the craft segment's line time is dominated by changeover. One craft run is 1.00 hour of filling and 1.5 hours of changeover, so 60.0% of its line time is spent not filling cans. A ready-to-drink run of 240,000 cans takes 26.67 hours of filling for the same 1.5-hour changeover, 5.3%.

The [Capacity Check tool](/tools/capacity/) performs the same comparison of demand hours with available hours for any process.

### The seasonal peak

An annual load hides the months that matter. The mobile business's records show a strong season: its seasonal index, each month's share of the year multiplied by 12, runs from 0.72 in June and July to 1.38 in December. If the plant's demand followed the same pattern, an average month would need 3,680 ÷ 12 = 306.7 hours, but December would need 306.7 × 1.38 = **423.2 hours** against 333.3 scheduled, **127.0%** of the month's capacity, while June would need only 220.8 hours, 66.2%. December would be about 90 hours short, roughly eleven extra 8-hour shifts, or the work would have to be filled earlier and stored, which brewers of fresh beer resist. The ready-to-drink and non-alcoholic brands may not follow a beer season exactly, but they sell most in the Australian summer too. A forecast that fits the year at 92.0% may not fit the peak at all, and the annual figure would never show it. The check takes one line of arithmetic and belongs in every capacity case with a seasonal market.

## Contribution per line hour

When a line is nearly full, the scarce resource is not cans but hours. Dividing each segment's contribution by its line hours gives a different ranking from contribution per can:

- **A, craft:** A$648.0k ÷ 900 h = **A$720.0** an hour.
- **B, ready-to-drink:** A$1,200.0k ÷ 1,408.3 h = **A$852.1** an hour.
- **C, non-alcoholic:** A$1,008.0k ÷ 1,016 h = **A$992.1** an hour.
- **D, overflow:** A$345.6k ÷ 356 h = **A$970.8** an hour.

Craft, the best segment per can, is the worst per hour, because so much of its time goes on changeovers. Non-alcoholic work is the best per hour. That matters for two decisions the business will face. If the plant fills up, an hour given to a craft run displaces about A$270 of contribution that a non-alcoholic run would have earned. If the plant does not fill up, the ranking matters much less, because spare hours earn nothing whichever segment would have used them. The value of mix depends on whether capacity binds, which is one more reason to know whether the volume forecast is right.

## Grading each driver by its evidence

A decomposed forecast should also say where each number came from. A simple four-grade scale works well:

```figure
type: layers
title: Evidence grades for a volume driver
caption: Grade each driver separately. In February 2024 no supply agreement had been signed; the strongest evidence behind any customer count was a letter of intent.
- Contract | a signed supply agreement with volumes, prices and a term; a minimum volume or take-or-pay clause is stronger still
- * Letter of intent | a signed statement that the customer intends to buy, usually with an indicative volume, but no obligation
- Named prospect | a real business that has discussed the service, with no written commitment
- Assumption | a number chosen by the forecaster, perhaps from experience or an analogy, with no customer behind it
```

Applied to the plant, the grades are sobering. The prospect list behind the 50 customers held 37 letters of intent and 35 other named prospects. Runs a year and cans per run for craft brewers could be compared with the mobile rigs' own records, but for ready-to-drink, non-alcoholic and overflow work the business had no history at all: those drivers were assumptions informed by conversations. Contribution per can was an assumption in every segment, set from the mobile business's costs and a view of what customers would pay. Chapter 3 tests the customer counts and volumes against the business's record of converting letters of intent into customers.

Writing the forecast down in this form belongs in the front end of the project, before the board is asked to decide. [Finding the hidden scope before approval](/reados/publications/front-end-planning-by-the-numbers/finding-the-hidden-scope/) in *Front-End Planning by the Numbers* makes the same case for a project's scope: what is not written down cannot be checked.

## Cautions for judgemental forecasts

A forecast built from the sponsor's knowledge of customers is a **judgemental forecast**, and Hyndman and Athanasopoulos's *Forecasting: Principles and Practice* (3rd edition, 2021) sets out the cautions that apply to such forecasts. Judgement is valuable where there is no data, which is the position of any new venture, but it is prone to optimism, to anchoring on a first number, and to inconsistency between one forecaster and the next or one day and the next. Their recommendations translate directly to a business case: set the forecasting task clearly; use a systematic, written method rather than a figure produced whole; document and justify every assumption; evaluate forecasts afterwards against what happened; and, where possible, keep the people who prepare a forecast separate from the people who benefit from its approval.

The driver tree meets the first three. The board's conditions, quarterly tracking and a review at month 21, meet the fourth. The fifth is why the board asked an independent reviewer to test the forecast, and the measures that would show whether the plant did what it was for are best chosen from questions the board needs answered, as [Measures from questions: goal, question, metric](/reados/publications/outcome-first-projects-by-the-numbers/measures-from-questions/) in *Outcome-First Projects by the Numbers* describes.

## The error: new customers who were not new

This is an illustration. The forecast counted 30 craft brewers as new customers for the plant. When the reviewer matched the prospect list against the mobile business's customer list, **8 of the 30**, 26.7%, were already customers of the mobile rigs. Moving them to the plant would add their volume to the plant, as the forecast assumed, but it would also remove their volume from the rigs. The business as a whole would gain only the difference.

Each of the eight filled about 60,000 cans a year on the mobile rigs, 480,000 cans in all, at a mobile contribution of A$0.12 a can. Moving them to the plant would therefore lose **A$57,600 a year** of mobile contribution. Over ten years at 9%, the present-value factor is 6.418, so the loss is worth A$369.7k, and the business case NPV falls from A$6,081.5k to **A$5,711.8k**.

The error is common in any business that adds capacity alongside an existing service: the new asset's forecast counts every customer it will serve, while the decision should count only the change to the whole business. It was found by a simple cross-check of two lists that sat in the same office. The correction was to keep the plant's forecast volume unchanged and add a separate line to the appraisal for the contribution lost elsewhere, a **dis-benefit** that the board would track alongside the benefits. From here on the book uses A$5,711.8k as the corrected inside-view NPV, and Chapter 8 carries the A$57,600 into the benefits register.

## Exercise: a wine segment

The sales manager suggests adding a fifth segment: 6 wineries filling canned wine, 4 runs a year each of 30,000 cans, at a contribution of A$0.16 a can. Using the driver tree, what volume, contribution and line hours would the segment add, what would the plant's total load become, and how does the segment rank on contribution per line hour?

**Worked answer.** Volume is 6 × 4 × 30,000 = **720,000 cans**, and contribution is 720,000 × A$0.16 = **A$115.2k** a year. Line time is 720,000 ÷ 9,000 = 80.0 h of running plus 24 runs × 1.5 h = 36 h of changeover, **116.0 h**. The plant's load rises from 3,680 h to **3,796 h, 94.9%** of the 4,000 scheduled. Contribution per line hour is A$115.2k ÷ 116.0 h = **A$993.1**, the highest of any segment, just above non-alcoholic work at A$992.1. On these numbers wine is attractive work, but adding it leaves about 204 hours of slack in a year, and a forecast that is already at 92.0% of capacity has no room for any of its drivers to be wrong upwards. Before adding segments, it is worth testing the ones already there, which [Testing each driver against the record](/reados/publications/demand-and-benefit-forecasts-by-the-numbers/testing-the-drivers/) does next.
