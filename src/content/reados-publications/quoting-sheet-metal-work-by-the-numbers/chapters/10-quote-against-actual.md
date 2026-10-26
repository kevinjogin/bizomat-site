---
book: quoting-sheet-metal-work-by-the-numbers
chapterSlug: quote-against-actual
order: 10
title: "Quote against actual"
description: "Compare a job's actual hours and costs with its quote line by line, find what totals hide, update standards, track quotes won and lost, and catch an assembly overrun masked by the total."
draft: false
---

A quote is a forecast, and a forecast that is never checked never improves. After a job, the shop knows what it actually spent: the hours on each machine and at each bench, the material bought, the rework done, the freight paid. Comparing those actuals with the quote, line by line, shows where the estimate was right, where it was wrong, and by how much. Done routinely, it turns the shop's estimating from a set of guesses into a set of measured standards, and it is the only way the times and rates in this book's chapters can be trusted for the next quote.

This chapter compares EN-700's first batch of 50 with its quote, line by line, then covers updating standards, tracking quotes won and lost, and using what was learned. The running case finds that the job's total came in almost exactly as quoted, and that the total hid an assembly overrun of about 24%, offset by small savings elsewhere and by the risk allowance.

## Collecting actuals

Actuals come from three places: **timesheets** or job clocking for labour, booked against the job and, ideally, against each operation; **machine logs** for the laser's cutting time and the brake's run time; and **purchase records** for material, bought-in items, subcontracted coating and freight. Each must be booked to the right job, which sounds obvious and is often where job costing fails: hours booked to whichever job number is handy produce actuals that describe nothing.

EN-700's fabricator books labour by operation, cutting, folding, joining, assembly, testing, inspection and packing, each with its own code, so that actual hours can be compared with the quote's lines directly. The laser and brake logs give machine times automatically.

## The running case: the first batch of 50

This is an illustration. The quote for 50 EN-700s priced the work at about **A$285.48** per enclosure in cost, A$14,274 for the batch, plus a risk allowance of about A$428 and a 20% margin, a price of about A$367.56 per enclosure, **A$18,378** for the batch.

The actual hours, against the quote's, were:

```figure
type: compare
title: EN-700 first batch of 50: hours quoted and actual
cols: Quoted hours | Actual hours | Variance
caption: This is an illustration. Most lines are within a few per cent; assembly is 24% over, and first-article inspection a third over.
- Laser | 5.17 | 4.90 | −5%
- Brake, running and set-ups | 8.50 | 9.10 | +7%
- Joining and set-ups | 8.61 | 8.40 | −2%
- *Assembly | 20.83 | 25.90 | +24%
- Water test | 1.25 | 1.30 | +4%
- Inspection and packing | 8.33 | 8.00 | −4%
- First-article inspection | 1.50 | 2.00 | +33%
- Deburring | 1.67 | 1.70 | +2%
```

At the quote's rates, the actual hours cost about **A$6,376.50** against the quoted A$5,873.65, about **A$502.85** more. The aluminium sheet came in about 3% below its quoted price, saving about A$43 with its on-cost. The job's actual cost was about **A$14,734**, against a quoted cost plus risk of about A$14,702.

## The error: a total that looked right

This is an illustration. The job's profit came to about A$3,644, a margin of about **19.8%** against the 20% quoted. The first reading of the result was that the quote had been accurate, and the job was about to be closed with a note saying so. The shop's rule that every job above a set value gets a line-by-line review, not just a margin check, is what kept it open long enough to look properly.

The line-by-line comparison told a different story. Assembly took about 25.9 hours against 20.8 quoted, **24%** over, about **A$482** more, and that overrun was almost exactly absorbed by the risk allowance of about A$428 and small savings on the laser, inspection and aluminium. The risk allowance had been spent, as it should be, but on a systematic underestimate of assembly rather than on the random scrap and rework it was meant for.

```figure
type: bars
title: Cost variance by line, EN-700 first batch of 50, ex GST
unit: A$
max: 500
caption: This is an illustration of the overruns only; savings on the laser, joining, inspection and packing, about A$99.90, are not shown. The assembly overrun alone is larger than the whole risk allowance of about A$428.
- Assembly | 481.65
- Brake | 66.00
- First-article inspection | 47.50
- Water test and deburring | 7.60
```

Had the next quote, for 200 off, used the same 25 minutes of assembly per enclosure, the overrun would have recurred four times over, about A$1,927, with no risk allowance large enough to absorb it. The review of the actuals found the cause: the door's fit took longer to adjust than the prototype had suggested, because the hinge's position varied slightly from enclosure to enclosure. The fix was twofold: a simple fixture for fitting the hinge, which removed most of the adjustment, and an updated assembly standard of about **31 minutes** per enclosure for quotes until the fixture's effect had been measured.

```figure
type: stats
title: EN-700 first batch of 50, quoted against actual, ex GST
caption: This is an illustration. The margin was close to target; the detail showed an assembly standard that was 24% optimistic.
- A$18,378 | Price | 50 enclosures at about A$367.56
- A$14,734 | Actual cost | Against about A$14,702 quoted with risk
- 19.8% | Actual margin | Against 20% quoted
- * +24% | Assembly hours | 25.9 against 20.8 quoted
```

## Line by line, not total

The general lesson is that a total can be right for the wrong reasons. Overruns in one line and savings in another cancel, a risk allowance absorbs a systematic error, a material price falls just enough to hide a labour overrun. Only the line-by-line comparison separates them, and only it shows which estimate to change. A shop that reviews only job totals learns whether a job made money, but not why, and its next quote repeats the same errors.

## Material actuals

Material is compared the same way. EN-700's batch used the 30, 7 and 9 sheets its nests predicted, because the nests were cut as programmed, and the store recorded no extra sheet for remakes. The aluminium price was about 3% below the quote's, and the hinge's price had risen slightly, a few cents an enclosure. A batch that uses more sheets than its nests predict has either scrapped parts, been re-nested on the floor or had its nests built for the wrong quantity, and the reason is worth finding, because material is the quote's largest line and the one that should be most certain.

## Variances that are not estimating errors

Not every variance is the estimator's fault. A customer's late design change, a rush that forced overtime, a machine breakdown, a new operator learning on the job, a coater's delay: each changes the actuals without saying anything about the estimate. The job review should note such causes separately, so that the standards are updated only for genuine estimating differences. EN-700's first-article inspection overran by half an hour because a customer representative attended and asked for extra measurements, which the review recorded as a customer request rather than a change to the standard.

## Updating the standards

Each comparison updates the shop's standards: the times per hit, per joint, per assembly step, the set-up times, the laser speeds and the scrap rates that estimates use. The update should be measured, not reactive. One job's actuals may be unusual; three similar jobs pointing the same way are evidence. EN-700's fabricator keeps a running record of each standard's quoted and actual values across jobs and adjusts a standard when the record shows a consistent difference, as it did for assembly. Rates, as Chapter 8 said, are updated from the accounts annually or when costs change.

## Booking time well

Actuals are only as good as the bookings behind them. Time booked at the end of a week from memory is approximate; time booked against operation codes at the start and end of each task is accurate. A shop that wants useful actuals makes booking easy, with clear job and operation codes on the job traveller and a terminal or tablet at each area, and makes it routine. It also explains why it matters: the bookings set the times in the next quote, and an operator who books carefully is helping to make sure the next job is priced at a time they can actually achieve.

## Sharing the results

The comparison of quote and actual is worth sharing with the people who did the work. EN-700's assembly team saw the overrun, explained the hinge's variability, and suggested the fixture that fixed it. Production knows where the time goes better than any estimate, and showing them the estimate's assumptions invites corrections that improve both the next quote and the next batch. A comparison kept only in the office improves only the office's numbers.

## Quotes won and lost

Actuals measure the quotes that became jobs. The quotes that did not are just as informative. A shop that records every quote, its price, the customer's response and, where it can find out, the winning price or the reason for losing, learns where its prices are high, where they are low and where it wins on other grounds such as lead time or quality. This is an illustration. If EN-700's fabricator wins about one quote in four overall, but one in two for repeat customers and one in eight for new customers on price-led tenders, it knows both where its prices are competitive and where it may be spending estimating time it will not recover.

## A yearly look at the whole

Once a year, the job reviews are worth reading together. Across a year's jobs, the shop can see which standards are consistently optimistic or pessimistic, which kinds of work earn their target margin and which do not, which customers' jobs run smoothly and which generate changes and rework, and whether the overall recovery of overheads matched the rates of Chapter 8. That yearly look is where a shop decides to raise a rate, drop a kind of work, invest in a fixture or a faster brake, or change how it quotes a particular customer. It turns the individual comparisons of quote and actual into decisions about the business, which is where their value finally lies.

## The cost of estimating

Estimating itself costs money, as Chapter 1 noted, and the record of quotes shows how much. A shop that spends 4 hours on each quote and wins one in four spends 16 hours of estimating per job won, about A$1,520 at A$95 an hour, which must be recovered in the overheads that rates carry. Faster estimating for simple and repeat work, from well-kept standards and past jobs, and full estimating for complex and new work, keeps that cost proportionate to the work it wins.

## The job review

A job review need not be long. EN-700's fabricator uses a one-page sheet for every job above a set value: the quoted and actual hours and costs by line, the variances above a threshold with their causes, the standards to be updated, any change to the shop's methods suggested by the job, and the margin achieved. The review is done within two weeks of the job's completion, while people remember what happened, and filed with the quote, so that the next quote for the same customer or product starts from the last job's real figures. Small jobs are reviewed in batches, a month's worth at a time, looking for patterns rather than for each job's detail.

## Using the last job in the next quote

The most valuable output of a job review is a better next quote. For a repeat order, the last job's actual times, adjusted for any improvement since, are better than the original estimate's. For a similar new product, the last job's standards, updated where the review found them wrong, give a starting point that has been tested against reality. EN-700's 200-off quote, revisited in the exercise below, uses the updated assembly standard; its other lines, close to their actuals, stay as they were.

## Closing the loop

Each chapter of this book found a quote going wrong and the check that caught it: a finish on a general sheet, material priced by net area, a grille left out, hems uncounted, fasteners counted twice, masking and freight missed, a call-off at the wrong price, a markup taken for a margin, a unit price slipped by a decimal place, and an assembly overrun hidden in a total. Every one was caught by comparing a number with a source or with another number that should have agreed. Comparing the quote with the actual is the last such comparison, and the one that makes every future quote better.

## Exercise: the 200-off quote revisited

Using the updated assembly standard of 31 minutes per enclosure instead of 25, and keeping every other line as before, what is the cost per enclosure at 200 off, the price at a 20% margin with a 3% risk allowance, and the difference from the original 200-off price of A$348.04?

**Worked answer.** The extra 6 minutes of assembly cost 6 × A$95 ÷ 60 = **A$9.50** per enclosure, so the cost at 200 off rises from about A$270.32 to about **A$279.82**. With the 3% risk allowance, about A$288.21, and at a 20% margin the price is 288.21 ÷ 0.80 = about **A$360.27** per enclosure.

That is about **A$12.23** more than the original 200-off price of A$348.04, about A$2,446 across 200. If the hinge fixture brings assembly back towards 25 minutes, the next actuals will show it and the standard can return; until then, the honest quote uses the time the shop actually achieves. A quote that ignores what the last job taught is no longer a forecast, only a hope, and a shop that prices on hope eventually learns the difference from its bank statements rather than from its job reviews.
