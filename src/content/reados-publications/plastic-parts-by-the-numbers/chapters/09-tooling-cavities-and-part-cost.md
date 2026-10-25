---
book: plastic-parts-by-the-numbers
chapterSlug: tooling-cavities-and-part-cost
order: 9
title: "Tooling, cavities and part cost"
description: "Build a part cost from material, machine time, set-up and tool amortisation, compare one and two cavities, find the break-even volume and state GST correctly."
draft: false
---

Moulding economics turn on one trade: a large, fixed cost for the mould against a small cost for each part. The trade favours moulding at high volume and punishes it at low volume, and the number of cavities, the runner system and the mould's construction all shift the balance. A simple cost model, built from the estimates in earlier chapters, shows where each dollar goes and which decisions move the total.

This chapter builds that model for the cover, compares a single-cavity mould with a two-cavity mould, finds the volume at which the second cavity pays, compares the moulded cover with the steel cover it replaces and shows how GST is handled.

## The parts of a moulded part's cost

The cost of each moulded part has four main components:

1. **Material**, the part's mass times the material price, with an allowance for scrap and runner waste.
2. **Machine time**, the machine's hourly rate times the cycle time, divided by the number of cavities.
3. **Set-up**, the cost of mounting the mould, heating it and running until parts are good, divided by the parts made in each batch.
4. **Tooling**, the mould's cost spread over the parts it will make in its planned life.

Secondary operations, packaging, inspection, freight and the moulder's margin come on top. They matter in a real quotation, but the four components above are where design decisions show.

## Gather the inputs

This is an illustration. All prices are invented for teaching and exclude GST.

- Material: polycarbonate at A$6.50 per kilogram; the cover weighs about 79.4 g; scrap and start-up losses are allowed at 2%, and the hot tip leaves no runner.
- Single-cavity mould: A$32,000 for the base mould, plus A$4,500 for lifters and A$7,500 for the hot tip, A$44,000 in total.
- Two-cavity mould: A$52,000 base, A$9,000 for two pairs of lifters and A$12,000 for a two-drop hot manifold, A$73,000 in total.
- Machines from Chapter 8: A$85 an hour for the 60 to 80 tonne class, A$110 an hour for the 150 tonne class.
- Cycles from Chapter 8: 17.5 s for one cover, 18.5 s for two.
- Demand: 8,000 covers a year, made in four batches; set-up takes 3 hours for the single-cavity mould and 3.5 hours for the larger mould.
- Mould life for costing: five years, 40,000 covers.

## Build the cost for each mould

For the single-cavity mould:

- Material: **0.0794 × 6.50 × 1.02 ≈ A$0.53**
- Machine: **85 × 17.5 / 3,600 ≈ A$0.41**
- Set-up: **4 × 3 × 85 / 8,000 ≈ A$0.13**
- Tooling: **44,000 / 40,000 = A$1.10**

The total is about **A$2.17** per cover, excluding GST. For the two-cavity mould, the material is the same, the machine cost is **110 × 18.5 / 3,600 / 2 ≈ A$0.28**, the set-up is **4 × 3.5 × 110 / 8,000 ≈ A$0.19** and the tooling is **73,000 / 40,000 ≈ A$1.83**, a total of about **A$2.83**.

```figure
type: compare
title: Cost per cover at 8,000 a year over five years
cols: Single cavity | Two cavities
caption: Teaching values excluding GST. At this volume the tool dominates, so the cheaper single-cavity mould gives the cheaper part.
- Material, with 2% scrap | A$0.53 | A$0.53
- Machine time | A$0.41 | A$0.28
- Set-up, four batches a year | A$0.13 | A$0.19
- Tooling over 40,000 covers | A$1.10 | A$1.83
- *Total per cover | A$2.17 | A$2.83
```

At 8,000 covers a year, the single-cavity mould gives the cheaper part by about 66 cents. The tooling, at A$1.10 per cover, is half the total. The second cavity saves about 13 cents of machine time per cover but costs A$29,000 more to build and a little more to set up, and at this volume the saving cannot repay the extra tooling.

## Find the volume at which a second cavity pays

The comparison changes with volume, because tooling and set-up are spread over more parts as demand rises while machine time per part stays the same.

```figure
type: line
title: Cost per cover against annual volume, five-year mould life
x: Annual volume, thousands of covers
y: Cost per cover, A$ excluding GST
legend: Single cavity | Two cavities
ymin: 0
ymax: 9
caption: Teaching values. Both curves fall steeply as tooling is spread over more parts. The two-cavity mould becomes cheaper only at about 50,000 covers a year.
- 2 | 5.85 | 8.88
- 8 | 2.17 | 2.83
- 20 | 1.43 | 1.62
- 50 | 1.14 | 1.13
```

At 2,000 covers a year, the single-cavity part costs about A$5.85 and the two-cavity part about A$8.88, because both moulds are heavily under-used. At 20,000 a year, the gap narrows to about 19 cents. The curves cross at about 50,000 covers a year, where both cost about A$1.13 to A$1.14. A simpler view of the same result: the second cavity saves about 13 cents of machine time per cover, so repaying its extra A$29,000 of tooling from that saving alone would take about **29,000 / 0.13 ≈ 222,000** covers, more than five years' demand even at 40,000 a year.

The lesson generalises. Cavities trade tooling for machine time, and they pay when volume is high enough that machine time is the larger cost. At low and moderate volumes, a single, well-made cavity is usually the economic choice, and the money saved is better spent on the mould's cooling, which shortens every cycle it ever runs.

## Test the sensitivity to the estimates

The model rests on estimates, and it is worth seeing which matter. A cycle 3 s longer than estimated adds **85 × 3 / 3,600 ≈ A$0.07** per cover. A material price 20% higher adds about **0.53 × 0.2 ≈ A$0.11**. A mould costing 20% more adds **1.10 × 0.2 = A$0.22**. A demand forecast that turns out 50% too high, so that only 20,000 covers are made over the mould's life, doubles the tooling share to A$2.20 and raises the total to about A$3.27.

The forecast is the largest risk, which is common for new products. If demand is uncertain, a cheaper mould with a shorter life, or a contract that shares the tooling cost with the customer, may be worth more than any design refinement.

## Compare with the steel cover it replaces

The moulded cover must earn its tooling against the folded steel cover it replaces. This is an illustration. The steel cover costs about A$9.20 including folding, painting and four screws, excluding GST. The moulded cover costs about A$2.17 plus about A$0.10 for its two screws, about A$2.27, and takes less time to fit because the hooks replace two screws.

The saving is about **9.20 − 2.27 ≈ A$6.93** per cover, before counting the assembly time. At 8,000 covers a year, that is about **6.93 × 8,000 ≈ A$55,500** a year, so the A$44,000 single-cavity mould would pay for itself in about **44,000 / 55,500 ≈ 0.8 years**. The tooling share in the part cost already recovers the mould over five years; the comparison with steel shows the decision is sound even if demand falls well short of forecast.

## State GST clearly

Prices in quotations and cost models should say whether they include GST. In Australia, GST is 10% of the GST-exclusive price for most goods and services. A business registered for GST can generally claim back the GST it pays on business purchases, which is why business-to-business costs are usually compared excluding GST. The Australian Taxation Office's guidance explains the rules for a particular business, and an adviser should confirm them.

For the cover, the single-cavity mould costs A$44,000 excluding GST, or **44,000 × 1.10 = A$48,400** including GST, and the two-cavity mould A$80,300 including GST. A per-part price of A$2.17 excluding GST is about A$2.39 including it. Mixing the two in a comparison, for example a mould price including GST against a part price excluding it, is a common and avoidable error in purchasing decisions.

## See which design decisions move the cost

Breaking the single-cavity cost into its parts shows where design changes would pay.

```figure
type: stack
title: Where the A$2.17 single-cavity cover cost goes
unit: A$
caption: Teaching values excluding GST. Tooling is half the cost at this volume, so features that add mould complexity matter more than grams of material.
- Tooling | 1.10
- Material | 0.53
- Machine time | 0.41
- Set-up | 0.13
```

Each design decision in earlier chapters maps onto one of these slices.

- **The lifters** for the snap hook catches cost A$4,500, about **4,500 / 40,000 ≈ 11 cents** per cover over the mould's life, plus some opening time and maintenance. Chapter 3's alternative, catches that engage holes in the box, would remove them entirely. That option was set aside because the box is an existing design, but the number shows what the next revision of the box is worth.
- **The hot tip** costs A$7,500, about 19 cents per cover, in exchange for no runner waste, a gate under the label and a slightly shorter cycle. For a part this size at this volume it is close to break-even, and the decision rests mainly on the gate position from Chapter 7.
- **The wall thickness** drives both material and machine time. The 2.2 mm wall examined in Chapter 8 would save about 12% of the material, about 6 cents, and about 2.6 s of cycle, about 6 cents more, if the stiffness could still be met.
- **The mould's cooling** affects every cycle. Each second saved is worth about **85 / 3,600 ≈ 2.4 cents** per cover, so 4 s saved by good cooling design is worth about 9 cents per cover, or about A$3,800 over the mould's life.

None of these is large on its own. Together they are worth roughly a third of the part's cost, and every one is decided before the mould is cut.

## Add the costs the model leaves out

The four components are not a quotation. A moulder's price adds inspection, packaging, handling, freight, the cost of capital tied up in material and finished stock, and a margin. Some of those scale with parts, some with batches and some with the account as a whole. If the cover needed a secondary operation, such as pad-printing a logo or fitting the label, that would add labour and fixtures.

The model's job is to compare options and to judge whether a quotation is plausible. If quotes come back at A$5 a cover against a modelled A$2.17, the difference should be explained line by line before an order is placed. If they come back at A$1.50, the quote probably assumes something the brief did not intend, as the failure case below shows.

## Decide who owns the mould

The mould is a significant asset, and its ownership and care should be agreed in writing before it is made. Typical questions include who owns it, where it is kept, who insures it, who pays for maintenance and repairs, what happens to it if the moulding contract ends, and whether the moulder may run it for anyone else. The Covestro design guide notes that the true cost of a mould includes its maintenance and the costs of scrap, cycle time and down time, and that spare parts for items prone to wear are usually cheaper to make during construction than after the mould is in production. A small budget for spare lifter components and a spare hot tip, agreed at the outset, can prevent a long stoppage later.

## A failure case: the cheapest quote

This is an illustration. Three toolmakers quoted for the cover's mould. The lowest quote, A$31,000, was about A$13,000 below the others. On inspection, it assumed a cold runner with an edge gate at one end, which Chapter 7 had rejected, omitted the cooling line under the rib grid, and was based on a mould life of 10,000 shots.

Each omission had a cost the quote did not show. The edge gate risked weld lines through the hooks. The missing cooling line would lengthen the cycle by perhaps 3 s, about A$0.07 per cover or about A$2,800 over the mould's planned life, and would invite the warpage seen in Chapter 6. The short mould life would need a replacement mould within two years. The quotes were not comparable because the brief had not specified the gate, the cooling requirement or the mould life clearly enough.

The detection is a quote comparison against the brief, line by line, before price is considered. The fix is to reissue the brief with those items stated and ask all three toolmakers to requote against it.

## Exercise: a family mould

Suppose the manufacturer also needs 8,000 a year of a smaller gland plate, similar in material and cycle, and a toolmaker proposes a family mould with one cavity for the cover and one for the plate, at A$58,000 excluding GST, run on the 150 tonne machine at an 18.5 s cycle. Separately, a single-cavity mould for the plate would cost A$30,000 and run on the smaller machine at a 15 s cycle. Compare the combined tooling and machine cost per pair of parts over five years, ignoring material and set-up.

**Worked answer.** For the family mould, tooling per pair is **58,000 / 40,000 = A$1.45** and machine time per pair is **110 × 18.5 / 3,600 ≈ A$0.57**, a total of about **A$2.02**. For two separate moulds, tooling per pair is **(44,000 + 30,000) / 40,000 = A$1.85** and machine time is **85 × (17.5 + 15) / 3,600 ≈ A$0.77**, a total of about **A$2.62**. The family mould is about 60 cents cheaper per pair in this model. Its drawbacks are that both parts must always be made together, in equal numbers, and that balancing the filling of two different cavities can be difficult, which the toolmaker and a mould flow analysis must confirm.
