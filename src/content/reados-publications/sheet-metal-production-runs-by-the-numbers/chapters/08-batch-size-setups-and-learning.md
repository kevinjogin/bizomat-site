---
book: sheet-metal-production-runs-by-the-numbers
chapterSlug: batch-size-setups-and-learning
order: 8
title: "Batch size, setups and the learning curve"
description: "Spread A$316.25 of setup over a batch, find an economic batch of about 300 trays, follow an 85% learning curve to standard by tray 19, and catch a run timed from its first three trays."
draft: false
---

Two effects make the first trays of a run cost more than the rest. Every batch carries setups, machine time and charges spent before the first good part, which must be spread across however many parts follow. And every operator is slower on the first parts than on the hundredth, because they are learning the product: where the blank goes, which way the tab folds, how the jig closes. Both effects shrink as the batch grows, and both are why a price for 50 trays is not a tenth of the price for 500.

This chapter puts numbers on both for the running case. It costs the setups and spreads them over batches of different sizes, finds the economic batch for the distributor's expected 2,000 trays a year, follows the operators down an 85% learning curve, and ends with a run whose labour was estimated from the first three trays off the press brake.

## The setup cost

From Chapter 7's routing, each batch needs 80 minutes of setup in the shop, plus the coater's batch charge. This is an illustration, at the shop's rates excluding GST:

- laser, 20 minutes at A$4.00 per minute: **A$80.00**;
- press brake, 45 minutes at A$90.00 an hour: **A$67.50**;
- rivet jig, 15 minutes at A$75.00 an hour: **A$18.75**;
- coater's batch charge for the distributor's colour: **A$150.00**.

So each batch costs **A$316.25** in setup before any tray is made. Spread over a batch of 500, that is **A$0.63** a tray; over 200, A$1.58; over 50, **A$6.33**. For a small batch, setup is a large share of the cost; for a large batch, it nearly disappears.

```figure
type: bars
title: Setup cost per tray by batch size
unit: A$
max: 7
caption: This is an illustration, excluding GST. A$316.25 of setup per batch, spread over the trays in it.
- Batch of 50 | 6.33
- Batch of 100 | 3.16
- Batch of 200 | 1.58
- * Batch of 500 | 0.63
```

## The economic batch

If small batches carry heavy setup costs, why not make the distributor's whole year, 2,000 trays, in one batch? Because trays made before they are needed must be stored, and storing them costs money: the cash tied up in them, the warehouse space, insurance, handling and the risk that the design changes or the trays are damaged before use.

The classic economic batch quantity, from Harris's 1913 analysis, balances the two costs. With annual demand D, setup cost per batch S, and holding cost per tray per year H:

Q* = √(2DS ÷ H)

This is an illustration. With D = 2,000 trays a year, S = A$316.25, and a holding cost of 20% of a tray's cost of about A$66.69 a year, H = **A$13.34** per tray per year, the economic batch is √(2 × 2,000 × 316.25 ÷ 13.34) = **308 trays**, about 6.5 batches a year.

```figure
type: formula
title: Economic batch quantity
formula: Q* = √(2 × D × S ÷ H)
formula: annual cost = (D ÷ Q) × S + (Q ÷ 2) × H
caption: This is an illustration for the distributor's expected demand. The first term is setups per year times setup cost; the second is the average stock held, half a batch, times holding cost.
- D | Annual demand, 2,000 trays
- S | Setup cost per batch, A$316.25
- H | Holding cost per tray per year, 20% of A$66.69 = A$13.34
step: Q* = √(2 × 2,000 × 316.25 ÷ 13.34) = 308 trays
step: Annual setup plus holding cost at 308: about A$2,054 + A$2,054 = A$4,108
step: At batches of 500: about A$1,265 + A$3,335 = A$4,600
```

## A flat optimum

The economic batch is a guide, not a target, because the total cost changes slowly near it. At batches of 250, the year's setup and holding cost is about **A$4,197**; at 308, **A$4,108**; at 500, **A$4,600**. A batch of 500 costs about A$490 a year more than the optimum, an eighth more, while a batch of 100 would cost about **A$6,992** and a batch of 1,000 about **A$7,302**.

So the first order's 500 trays is a reasonable batch: close enough to the economic size that the difference is small, and matched to what the distributor actually ordered. For repeat orders, batches of about 250 to 350 would suit, and the shop can suggest that the distributor call off trays in batches of that size against an annual order.

The model's assumptions matter. It assumes steady demand, a setup cost that does not change with batch size, and a holding cost proportional to stock. Real setups shrink when the same product is set up often, because the operators remember the settings and the tooling stays together, and holding cost depends on who holds the stock, the shop or the distributor. The model's value is in showing which way to move and how sharply the cost rises at the extremes, not in its exact answer.

```figure
type: compare
title: Annual setup and holding cost by batch size
rowhead: Batch size
cols: Batches a year | Setup cost a year | Holding cost a year | Total
caption: This is an illustration for 2,000 trays a year, excluding GST. The total is nearly flat between 250 and 500 and rises steeply outside that range.
- 100 | 20.0 | A$6,325 | A$667 | A$6,992
- 250 | 8.0 | A$2,530 | A$1,667 | A$4,197
- * 308 | 6.5 | A$2,054 | A$2,054 | A$4,108
- 500 | 4.0 | A$1,265 | A$3,335 | A$4,600
- 1,000 | 2.0 | A$633 | A$6,669 | A$7,302
```

## Reducing the setup

The economic batch depends on the setup cost, and the setup cost is not fixed. Every minute taken out of a setup lowers the cost of small batches and the size of the economic batch, and lets the shop make what the customer needs when it is needed rather than in large lots.

The obvious places are the shop's own setups. This is an illustration. If the press brake's tooling for the tray is kept together as a set on a trolley, with its back-gauge programs saved, its 45-minute setup can fall to about 20 minutes. If the laser's nest is saved and its first-sheet check is reduced to a gauge check, its setup can fall from 20 to 10 minutes; and a jig whose stops are fixed for this tray needs only 5 minutes. The setup cost then falls from A$316.25 to **A$226.25**, and the economic batch from 308 to about **260** trays.

But the numbers show where the larger lever is. The coater's batch charge of A$150.00 is **47%** of the setup cost, more than all the shop's own setups together. Negotiating a lower charge for repeat batches of the same colour, or combining the distributor's trays with other work in the same colour, does more for small batches than any amount of work on the press brake. Setup reduction starts with finding which setup is largest, which is a matter of listing them all.

## Who pays for the setup

A customer who orders small batches is, in effect, asking for more setups, and someone pays for them. The shop can include setup in the unit price, charge it as a separate line on each order, or set a minimum order quantity. This is an illustration. If the distributor wanted batches of 50, the shop's unit cost would be about A$6.56 higher than at 500, almost all of it setup and learning, and the shop would say so rather than absorb it.

A common middle path for a product with steady demand is a scheduled call-off: the distributor commits to 2,000 trays a year, the shop makes them in batches of about 300 on a regular cycle and holds a small stock, and the distributor calls off trays as it needs them. The shop gets economic batches; the distributor gets small, frequent deliveries; and the agreement says who holds the stock and for how long.

## The learning curve

The routing's times are standard times, achieved once operators are practised. The first trays take longer. Wright's 1936 observation, made on aircraft assembly and found widely since, is that the time per unit falls by a constant fraction each time the cumulative quantity doubles. An **85% learning curve** means the second unit takes 85% of the first's time, the fourth 85% of the second's, and so on: T(n) = T(1) × n^b, where b = log₂ 0.85 = −0.2345.

This is an illustration. The tray's manual operations, folding, deburring and riveting, have a standard time of 7.2 minutes together. On the first run, the first tray took about twice that, **14.4 minutes**, as the operators found their way. On an 85% curve:

- tray 2 takes about 12.2 minutes, tray 4 about 10.4, tray 8 about 8.8 and tray 16 about 7.5;
- the curve reaches the 7.2-minute standard at about **tray 19**, and the operators hold that pace for the rest of the run.

Averaged over the batch, the manual operations take **7.89 minutes** a tray over the first 50, **7.37** over 200 and **7.27** over 500. Learning, like setup, costs most on small batches.

## Where the curve comes from

The 85% figure is an illustration, chosen because rates around that value are often reported for manual assembly work, but the right rate for a shop's operation is the one measured there. The shop measures it on the first run: it records the manual time for trays 1, 2, 4, 8 and 16, plots the logarithm of time against the logarithm of tray number, and reads the slope. Two runs of the same product usually give a good estimate for the next.

The curve also has limits. It describes learning by people, so it applies to the folding, deburring and riveting and not to the laser, whose time is set by the program. And it flattens at the standard: the operators do not get indefinitely faster, because the operations' content, sixteen hits and eight rivets, sets a floor. In this chapter's illustration, the curve meets the floor at about tray 19, after which every tray takes the standard 7.2 minutes. A product with many more steps, or more judgement in each, would take longer to reach its floor.

## Learning on repeat runs

Learning is partly lost between runs. When the second batch starts weeks after the first, the operators remember much but not all, and the first trays are again slower than standard, though not as slow as the very first tray of the very first run. The shop's records from similar products show that a repeat run, an illustration, starts at about 9 minutes and reaches standard within a few trays.

That is a second argument for regular repeat batches over occasional large ones: frequent repeats keep the learning, and the work instructions and photographs of Chapter 7 help a new operator start further down the curve.

## Batch size and the cost of a mistake

The economic batch counts setup and holding costs, but there is a third cost that grows with batch size and that the formula leaves out: the cost of a mistake that is not caught early. A fault introduced at the press brake, such as the inward lugs of Chapter 4, affects every tray made until it is found. In a batch of 50, that is at most 50 trays; in a batch of 1,000, it can be hundreds.

The defence is not small batches, which cost more in setups, but early and regular checks within each batch: a first-article inspection before the batch is released, and in-process checks at a fixed interval, every twentieth tray in the shop's plan. With a check every twenty trays, a fault can affect at most twenty trays whatever the batch size. Chapter 10 sets out those checks; the point here is that they are what makes a large batch safe, and their cost belongs in the comparison of batch sizes alongside setup and holding.

## The error: a run timed from its first three trays

This is an illustration. Before the routing's standard times had been set, an estimator timed the press brake and riveting on the first-article trays and used their average for the whole run. The first three trays' manual operations took 14.4, 12.2 and 11.1 minutes, an average of **12.6 minutes**.

For 500 trays, that gave about **6,295 minutes** of manual work. The run actually took about **3,635 minutes**, because the operators were at the 7.2-minute standard from about tray 19. The estimate was **73% high** on those operations, enough to have priced the trays out of the distributor's budget had it been used.

The shop found it when the production engineer compared the estimate with the routing built from the operations' parts. The rule now is that first-article times are recorded and kept, because they show where the learning curve starts, but are never used as the standard for a run. The standard comes from the operation's content, as in Chapter 7, and the learning curve adds the extra time for the first trays.

```figure
type: checklist
title: Batch and learning checks before costing the run
caption: Each check separates a one-off cost from a per-tray cost, so that neither is double counted nor forgotten.
- Setup cost per batch, every work centre and the coater | A$316.25
- Setup spread over the actual batch size | A$0.63 a tray at 500
- Economic batch worked out for repeat orders | about 308, flat from 250 to 500
- Learning curve applied to the first trays, not the whole run | standard by about tray 19
- First-article times recorded but not used as standard | the 73% overestimate
- x Run timed from its first three trays | 12.6 minutes against 7.2
```

## Exercise: a batch of 200

The distributor asks for a first batch of 200 instead of 500. Using the numbers in this chapter, find the setup cost per tray, the average manual minutes per tray, and the manual labour for the batch at the shop's blended rate of about A$1.40 per minute. Compare it with the same figures for 500.

**Worked answer.**

- Setup per tray: A$316.25 ÷ 200 = **A$1.58**, against A$0.63 at 500.
- Average manual minutes: **7.37** over 200 trays, against 7.27 over 500.
- Manual labour: 200 × 7.37 × A$1.40 = about **A$2,063**, or about A$10.32 a tray, against about A$10.18 a tray at 500.

The batch of 200 costs about A$1.09 more per tray than the batch of 500, A$0.95 of it from setup and A$0.14 from learning. Both are small against the tray's total cost of about A$67, but they are why the shop's price for 200 is not simply two fifths of its price for 500. Over the distributor's expected 2,000 trays a year, the same A$1.09 difference would be worth about A$2,180, which is why the batch structure of repeat orders deserves a conversation before the first order is confirmed.
