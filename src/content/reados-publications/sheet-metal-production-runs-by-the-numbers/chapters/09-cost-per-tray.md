---
book: sheet-metal-production-runs-by-the-numbers
chapterSlug: cost-per-tray
order: 9
title: "Cost per tray across the run"
description: "Build the tray's unit cost from steel, machines, labour, coating, setup and learning: A$66.69 at 500 and A$73.25 at 50 excluding GST, with sensitivity, a die's payback and GST errors."
draft: false
---

Every earlier chapter produced a quantity: square metres of steel and coating, minutes on each machine, setup cost per batch, a learning curve. This chapter puts prices on them and adds them up into the cost of one tray, then of the run. The result is not a price. A price adds profit and reflects the market, the customer and the shop's strategy, which are separate questions. But a price set without knowing the cost is a guess, and a cost built from the run's own quantities is the most reliable number a shop has.

The chapter builds the running case tray's unit cost at a batch of 500, shows how it changes with batch size, tests which inputs matter most, uses the cost to decide whether a hemming die is worth buying, and ends with a cost that counted GST on the coater's quote as if it were a cost to the shop.

## Rates and what they include

Each operation is costed at a rate per minute that includes the machine, the operator and the shop's overheads: power, maintenance, floor space, supervision and administration, spread over the hours the work centre is used. This is an illustration, and the shop's rates, excluding GST, are:

- fibre laser: **A$4.00 per minute** (A$240 an hour);
- press brake and lug press: **A$1.50 per minute** (A$90 an hour);
- bench work, deburring and riveting: **A$1.25 per minute** (A$75 an hour).

A rate like these is worked out from the shop's own accounts, not borrowed, and it changes when the shop's costs or utilisation change. A rate that leaves out overheads understates every job; one that includes overheads twice, once in the rate and again as a percentage on top, overstates it.

## The unit cost at 500

This is an illustration, with every figure excluding GST.

- **Steel**: three blanks per A$84.00 sheet, **A$28.00** per blank (A$28.06 once the order is rounded up to whole sheets).
- **Laser**: 1.24 minutes at A$4.00, **A$4.96**.
- **Lugs**: 0.6 minutes at A$1.50, **A$0.90**.
- **Folding**: 4.2 minutes at A$1.50 at standard, **A$6.30**.
- **Deburring and riveting**: 3.0 minutes at A$1.25 at standard, **A$3.75**.
- **Rivets**: eight at A$0.05, **A$0.40**.
- **Coating**: 1.158 m² at A$18.00, **A$20.84**.
- **Packing**: labels, stretch wrap and pallet share, **A$0.80**.

At standard times, those add up to **A$65.96**. Two run effects add to it at a batch of 500: setup of A$316.25 spread over 500 trays, **A$0.63**, and the extra time of the learning curve's first trays, which raises the average manual time from 7.2 to 7.27 minutes and the manual cost by **A$0.10**. The unit cost at a batch of 500 is about **A$66.69**, and the run of 500 costs about **A$33,345** excluding GST.

```figure
type: stack
title: Where the tray's A$66.69 goes, at a batch of 500
unit: A$
caption: This is an illustration, excluding GST. Steel and coating are three quarters of the cost; the shop's own folding and riveting are about 15%.
- Steel | 28
- Coating | 20.84
- Folding | 6.3
- Laser | 4.96
- Deburring and riveting | 3.75
- Lugs, rivets and packing | 2.1
- Setup and learning | 0.73
```

## Cost by batch size

Repeating the calculation for other batch sizes, with Chapter 8's setup and learning figures, gives the cost curve the shop needs for repeat orders.

```figure
type: compare
title: Unit cost by batch size, excluding GST
rowhead: Batch
cols: Setup per tray | Average manual minutes | Unit cost
caption: This is an illustration. Steel, coating and machine times are the same at every batch size; setup and learning make the difference.
- 50 | A$6.33 | 7.89 | A$73.25
- 200 | A$1.58 | 7.37 | A$67.78
- * 500 | A$0.63 | 7.27 | A$66.69
- 1,000 | A$0.32 | 7.24 | A$66.32
```

Above about 200 trays the cost hardly moves: the setup is spread thinly and the learning curve is long past. Below 200 it rises quickly, and at 50 it is about A$6.56 higher than at 500. The distributor's batches of 250 to 350 from Chapter 8 sit on the flat part of the curve.

## Which inputs matter

A cost is only as good as its inputs, and some inputs matter far more than others. Testing each by a plausible change shows where to spend effort on accuracy. This is an illustration.

- A **12% rise in the steel price** adds 0.12 × A$28.00 = **A$3.36** a tray.
- Nesting **two blanks per sheet instead of three** adds **A$14.00** a tray, Chapter 5's error.
- A **10% change in the coating rate** moves the cost by **A$2.08** a tray.
- **Folding 0.3 minutes slower** than standard adds 0.3 × A$1.50 = **A$0.45** a tray.
- **Halving the setup cost** saves only **A$0.32** a tray at 500.

The steel and coating prices and the nesting yield dominate; the shop's own operation times and setups matter much less at this batch size. So the estimate's most important checks are a current steel price, a coater's quote on the actual part and a real nest, and the shop's effort to cut its own cost is best spent at the bottleneck and on yield, not on shaving setups for large batches.

## Costs the unit cost leaves out

The unit cost above covers making trays. Several costs of the run sit outside it and must be added once, not per tray, or the run loses money even when every tray costs what it should.

**Engineering.** Developing the blank, writing the nest and the routing, making the jig and running the first article took the shop's production engineer, this is an illustration, about 6 hours at A$110.00 an hour, A$660.00 excluding GST. Spread over the first 500 trays, that is A$1.32 a tray; spread over the expected 2,000 a year, A$0.33. Whether it is charged to the first order, recovered over the year or treated as the shop's investment in a new customer is a commercial decision, but it is a real cost and the cost sheet lists it.

**Testing.** The first article's capacity and load tests use a tray that may not be saleable afterwards, and an hour or two of time. The spare blank in the steel order covers the tray; the time belongs with the engineering.

**Scrap and rework.** Not every tray will be right first time. This is an illustration. If the shop's experience on similar products is that about 1% of trays need rework or are scrapped, that adds about A$0.67 to each good tray's cost, or the shop makes 505 to deliver 500. The cost sheet states the allowance, so that a run with fewer rejects shows a gain and one with more shows a loss, rather than both vanishing into an average.

**Freight.** Seven pallets to the distributor's warehouse is a single quoted delivery, added to the run.

## From estimated cost to actual cost

After the run, the shop compares what each line actually cost with what it estimated, line by line. This is an illustration. Suppose folding settled at 4.5 minutes instead of 4.2, adding A$0.45 a tray; the steel was bought at A$86.00 a sheet instead of A$84.00, adding A$0.67 a tray; and the coater charged exactly as quoted. The run then cost about A$1.12 a tray more than estimated, about A$560 over 500 trays, and the shop knows exactly why.

Those differences feed the next estimate: the folding standard rises to 4.5 minutes unless the shop changes the method, and the steel price is updated. A shop that compares estimates with actuals after every run gets more accurate estimates every time; one that never compares makes the same estimating errors on every job.

## A hemming die: worth buying?

Chapter 7 found that a hemming die closing each hem in one hit would cut folding from 4.2 to 3.4 minutes. At A$1.50 a minute, that saves **A$1.20** a tray, A$600 on this run and about **A$2,400** a year on the distributor's expected 2,000 trays.

This is an illustration. If the die costs A$1,800 excluding GST, it pays for itself in 1,800 ÷ 1.20 = **1,500 trays**, about nine months of the expected demand, and it also shortens every run at the bottleneck by more than a day. The decision depends on how confident the shop is in the repeat orders: on the first order alone, the die would not pay back; on the expected annual demand, it would, with time to spare. The cost model makes the question precise, and the commercial judgement remains the shop's.

## The cost sheet as a document

The shop's cost sheet for the run is a short document, not a single number, and its layout makes it checkable by someone who did not write it.

1. **Summary**: unit cost at the planned batch and at two or three other batch sizes, and the run's total, all excluding GST.
2. **Quantities**: blank area, sheets, coated area, minutes per operation, rivets, setups, each with the chapter or document it came from.
3. **Rates and prices**: each with its source, its date and whether it includes GST.
4. **Allowances**: scrap, rivet losses, spares, each stated as a percentage or count with a reason.
5. **One-off costs**: engineering, testing, tooling, freight, listed separately from the unit cost.
6. **Sensitivity**: the few inputs that move the cost most, with the effect of a plausible change in each.
7. **Version and author**: so that a later revision can be compared with this one.

Laid out this way, the cost sheet answers the questions a manager or an auditor asks first: where the number came from, what it assumes, and what would change it. It also makes the comparison of estimate and actual after the run a matter of reading across lines.

## Cost per litre

One more figure is useful to the distributor, though not to the shop's costing: the cost per litre of capacity. At A$66.69 for 36.5 litres to the fill line, the tray's cost is about **A$1.83 per litre** excluding GST. The half-size tray from earlier exercises, if its cost per tray were roughly in proportion to its area, would cost about 64% as much for half the capacity, around A$2.34 per litre. Smaller trays cost more per litre, because their surface, which is what the shop pays for in steel and coating, is larger relative to their volume.

That kind of figure helps the distributor choose a mix of sizes for its stores. The shop provides it as information, not as a price, because the price will include margin.

## GST and costs

The shop is registered for GST, so the GST it pays on its inputs, steel, coating, rivets, is credited back against the GST it collects on its sales, as the ATO's guidance on GST explains. For a registered business, GST is not a cost, and every cost in this chapter is excluding GST. GST is added once, at 10%, on the shop's selling price to the distributor, which this book does not set.

Two practical habits keep the basis consistent. Suppliers' quotations are entered excluding GST, and the cost sheet records the quotation's own statement of whether its figures include GST, so that nobody has to guess later. And every summary figure on the cost sheet carries the words "excluding GST" beside it, because a cost figure without them will eventually be read as including GST by somebody, and compared with a price that does.

## The error: GST counted as a cost

This is an illustration. The first version of the cost sheet took the coater's quotation of A$19.80 per square metre, which included GST, and used it alongside the shop's other costs, which excluded GST. The coating came out at 1.158 × 19.80 = A$22.93 a tray instead of A$20.84, A$2.08 too high, and so did the unit cost.

The error was small but systematic, and in a competitive quotation, A$2.08 a tray on 500 trays, about A$1,040, can decide whether a shop wins the work. It was found when the cost sheet was checked line by line against the source quotations, each of which states whether GST is included. The shop's cost sheet now has a column stating, for every input, the source document and whether its figure includes GST, and every figure entered is excluding GST.

```figure
type: checklist
title: Cost sheet checks before a price is set
caption: Each check makes sure the cost is built from the run's own quantities on one consistent basis.
- Every rate includes overheads once, not twice | laser A$4.00, press brake A$1.50, bench A$1.25 per minute
- Steel from a current price and the real nest | A$28.00 per blank at three per sheet
- Coating from the coater's quote on the actual part | A$20.84 per tray
- Setup and learning added for the actual batch size | A$0.73 at 500
- Every input excluding GST, with its source noted | GST added once, on the price
- x A GST-inclusive quote mixed with GST-exclusive costs | A$2.08 a tray too high
```

## Exercise: a batch of 1,000

The distributor considers ordering a year's trays in two batches of 1,000. Using the figures in this chapter, find the setup per tray, the unit cost, and the total cost of one batch of 1,000 excluding GST. What does the larger batch save per tray over a batch of 500, and what does Chapter 8's holding cost say about it?

**Worked answer.**

- Setup per tray: A$316.25 ÷ 1,000 = **A$0.32**.
- Average manual time over 1,000 trays is about 7.24 minutes, so the unit cost is about **A$66.32**.
- One batch of 1,000 costs about **A$66,320** excluding GST.

The larger batch saves only about **A$0.37** a tray over a batch of 500. Against that, Chapter 8 found that two batches of 1,000 a year cost about A$7,302 a year in setup and holding together, against about A$4,600 for four batches of 500, because twice as much stock is held on average. The unit cost falls a little; the total cost of supplying the year rises. Batches of 1,000 suit the shop only if the distributor holds and pays for the stock.
