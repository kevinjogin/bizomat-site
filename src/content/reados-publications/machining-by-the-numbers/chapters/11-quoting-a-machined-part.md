---
book: machining-by-the-numbers
chapterSlug: quoting-a-machined-part
order: 11
title: "Quoting a machined part"
description: "Turn cycle time into a quotation: material, machine time, set-up, programming, inspection and tooling, the effect of batch size, risk allowances and a quote the customer can compare."
draft: false
---

Everything in this book leads to a decision someone must make with money: whether to quote a job, at what price, and whether to accept the order. A quotation pulls together material, machine time, set-up, programming, tooling and inspection. It must also allow for the uncertainty in each estimate, and it must be clear enough for the customer to compare with others.

This chapter builds Harbourline's quotation for the pump flange from the figures developed in earlier chapters, then looks at batch size, risk and the difference between cost and price. All amounts are in Australian dollars, excluding GST, and every figure is fictional.

## The building blocks

A machined-part cost estimate usually has these elements:

1. **Material:** the bar, plate or casting, including saw kerf and offcuts, plus cutting it to blanks.
2. **Machine time per part:** the cycle time from Chapter 10, including handling, at the machine rate.
3. **Secondary operations:** deburring, cleaning, inspection, marking, heat treatment or coating, whether done in-house or bought in.
4. **Tooling:** cutting edges consumed per part, from tool life.
5. **Set-up:** preparing each machine for the batch, charged once per batch.
6. **One-off costs:** programming, prove-out, special fixtures and first-article inspection, charged once per job.
7. **Packaging and delivery**, where included.

The first four scale with quantity; the last three do not. That difference drives the effect of batch size.

## Material

The flange is cut from Ø110 medium-carbon steel bar. Each blank is 34 mm long, and the saw kerf is about 3 mm, so each part consumes 37 mm of bar.

- Volume: π ÷ 4 × 110² × 37 = 351,600 mm³
- Mass at a density of 7.85 g/cm³: about **2.76 kg**
- At an assumed bar price of A$4.50 per kilogram: **A$12.42**

Sawing takes about 0.9 minutes per blank at a bandsaw rate of A$90 per hour, adding A$1.35. Total material and sawing: **A$13.77** per part.

The finished flange weighs only about 1.2 kg. More than half the bar is turned into chips. For parts like this, a near-net blank, such as a forging, a flame-cut disc from plate or a bar size closer to the finished diameter, can be worth investigating once volumes justify it. Chips do have some scrap value, but it is small compared with the purchase price.

## Machine time

From Chapter 10, the flange needs 8.99 minutes of machine time per part, including handling, across the three operations. Harbourline's machine rate, including the operator, is A$150 per hour.

8.99 ÷ 60 × 150 = **A$22.49** per part

Deburring the bolt holes and edges, washing and a final visual and dimensional check take about 1.5 minutes per part at a bench rate of A$95 per hour: **A$2.38**.

## Tooling

Tooling cost per part is the cost per edge divided by the parts per edge, using each tool's cutting time per part and its expected life.

| Tool | Cost per edge or life | Expected life (cutting min) | Cutting time per part (min) | Parts per edge | Cost per part |
|---|---|---|---|---|---|
| Roughing insert | A$6.00 | 15 | 1.29 | 11.7 | A$0.51 |
| Finishing insert | A$6.50 | 25 | 0.40 | 63 | A$0.10 |
| Boring insert | A$7.00 | 30 | 0.19 | 160 | A$0.04 |
| Indexable drill inserts | A$22.00 per set | 40 | 0.27 | 151 | A$0.15 |
| Ø11 carbide drill, per regrind | A$30.00 | 60 | 0.32 | 185 | A$0.16 |
| Ø6.8 drill and M8 tap | A$45.00 combined | 45 | 0.21 | 217 | A$0.21 |
| Face mill, set of edges | A$75.00 | 120 | 0.13 | 938 | A$0.08 |
| **Total** | | | | | **A$1.26** |

The roughing insert's life of 15 minutes is more conservative than the shaft family's Taylor prediction at a similar speed in Chapter 8. Facing to the centre, cutting through the bar's surface skin and the heavier spigot roughing all shorten life. Using job-specific evidence, or a cautious estimate until evidence exists, is better than borrowing a figure from a different job.

Tooling is less than 3% of the part cost. That confirms Chapter 9's conclusion that, for this job, choosing a slightly different cutting speed would make little difference to the price.

## Set-up and one-off costs

Harbourline estimates the set-up times as 1.5 hours for operation 10, 1.0 hour for operation 20 and 1.25 hours for operation 30, a total of 3.75 hours. Programming and prove-out take about 2 hours, and first-article inspection about 1 hour. At A$150 per hour:

- Set-up: 3.75 × 150 = A$562.50 per batch
- Programming and first-article inspection: 3.0 × 150 = A$450 for the job

## Cost per part for 120 flanges

| Element | Per part |
|---|---|
| Material and sawing | A$13.77 |
| Machine time, 8.99 min | A$22.49 |
| Deburr, wash and inspect | A$2.38 |
| Tooling | A$1.26 |
| Set-up, A$562.50 ÷ 120 | A$4.69 |
| Programming and first article, A$450 ÷ 120 | A$3.75 |
| **Estimated cost** | **A$48.32** |

Before bench work, the batch takes about 24.7 hours in total: 3.75 hours of set-up, 3 hours of programming and first-article inspection, and 18 hours of machine time in production.

```figure
type: stack
title: Estimated cost of one flange in a batch of 120
unit: A$
caption: Estimated cost A$48.32 per part, excluding GST and before profit and risk.
- Machine time, 8.99 min | 22.49
- Material and sawing | 13.77
- Set-up, shared | 4.69
- Programming and first article, shared | 3.75
- Deburr, wash and inspect | 2.38
- Tooling | 1.26
```

## The effect of batch size

Repeating the calculation for the other quantities the customer asked about:

| Quantity | Set-up per part | One-off per part | Estimated cost per part |
|---|---|---|---|
| 30 | A$18.75 | A$15.00 | A$73.64 |
| 120 | A$4.69 | A$3.75 | A$48.32 |
| 500 | A$1.13 | A$0.90 | A$41.91 |

At 30 parts, set-up and one-off costs are nearly half the total. At 500, they almost disappear, and the cost approaches the sum of the per-part elements, A$39.90. This is why small batches cost much more per part, and why a customer who can commit to larger batches, or to repeat orders that avoid repeating the programming, can expect a lower price.

```figure
type: line
title: Estimated cost per flange against batch size
x: Batch size (parts)
y: Cost per part (A$)
ymin: 35
ymax: 80
caption: Set-up and one-off costs of A$1,012.50 are shared over the batch; the curve flattens towards the per-part cost of about A$39.90.
- 30 | 73.64
- 60 | 56.76
- 120 | 48.32
- 250 | 43.93
- 500 | 41.91
- 1000 | 40.90
```

A repeat order for 120 flanges, with the program and first article already proven, would not need the A$450 one-off cost again, although a short first-off check, say half an hour, is prudent. The estimated cost for a repeat batch would be about A$45.20 per part.

## Uncertainty and sensitivity

Every number in the estimate is uncertain. A quick sensitivity check shows which uncertainties matter most:

- A 20% rise in the bar price adds about A$2.48 per part.
- A 20% longer cycle time than estimated adds about A$4.50 per part.
- A 20% error in tool life changes cost by about A$0.25 per part.

Cycle time and material price dominate. A quote should therefore state how long the material price is held, and the estimator should spend effort refining the cycle estimate rather than tool life. For a new type of part, or a customer with uncertain requirements, a contingency allowance for the specific risks identified is better than a general inflation of every figure.

```figure
type: bars
title: Effect on cost per part of a 20% error in each estimate
unit: A$
caption: Spend estimating effort on cycle time and material price; tool life barely moves the number.
- *Cycle time 20% longer | 4.50
- Bar price 20% higher | 2.48
- Tool life 20% shorter | 0.25
```

## From cost to price

Cost is what the job is expected to consume. Price is a business decision that also reflects the value to the customer, the market, competition, the shop's capacity, the payment terms and the risk. Harbourline's policy in this fictional example adds 15% to estimated cost to cover profit and general risk. On a cost of A$48.32, that gives a price of about A$55.57 per part for 120 flanges.

Be careful with terms. A 15% **markup** on cost is not a 15% **margin** on price. Here the margin is 15 ÷ 115, about 13% of the price. Mixing the two is a common way to underprice work. The READOS chapter on [pricing your product or service](/reados/collections/pricing-margins-and-profitability/pricing-your-product-or-service/) discusses cost floors and value-based pricing in more depth.

```figure
type: formula
title: Markup is not margin
formula: Price = Cost × (1 + markup)
formula: Margin = markup ÷ (1 + markup)
caption: Quoting a 15% margin while applying a 15% markup underprices the work.
step: Price = 48.32 × 1.15 = A$55.57 per part
step: Margin = 0.15 ÷ 1.15 = 13% of price
```

## What the quotation should say

A clear quotation reduces disputes and helps the customer compare suppliers fairly. For machined parts it usually states:

- the part number, drawing revision and material specification quoted;
- the quantity breaks and unit prices, with set-up or one-off charges shown separately where that is the shop's practice;
- what is included and excluded, such as inspection reports, material certificates, surface treatment, packaging and delivery;
- the lead time and how it depends on material availability and confirmation of the order;
- the validity period, particularly for material prices;
- payment terms and whether prices include GST; and
- any assumptions, for example that the customer supplies a 3D model, or that general tolerances follow a stated standard.

The Australian Government's business.gov.au guidance on preparing quotes is a useful plain-language reference on the difference between a quote and an estimate and the information a quote should contain.

## Bringing it together

The flange quote shows the chain from technical calculation to commercial decision. Cutting speed sets spindle speed; feed and depth set removal rate and finish; power and deflection limit how hard each cut can be pushed; tool life and the machine rate decide the economic speed; cutting and non-cutting times build the cycle; and the cycle, material and set-up build the cost. At each step, the numbers make assumptions visible, so they can be checked, challenged and improved with evidence from real production.

The same habits apply to any machined part: start from reliable data, calculate rather than guess, check the limits of the machine, look for where the time really goes, and record actual results against every estimate so that the next quote is better than the last.

## Exercise: quote a part you know

Choose a part your workshop has made recently. Build an estimate using the elements in this chapter, then compare it with what the job actually cost and the price charged. Identify the largest difference and its cause. Repeat the exercise for the next three jobs and record how the differences change.

---

*Source: KEVOS® notes drawing on Taylor's and Gilbert's work on tool life and machining economics, tool supplier formula references and Machinery's Handbook as listed in the book references. The Harbourline case and all prices, rates and cutting data are fictional and illustrative. This book is general technical and business information.*
