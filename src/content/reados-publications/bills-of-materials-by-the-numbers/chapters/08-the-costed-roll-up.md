---
book: bills-of-materials-by-the-numbers
chapterSlug: the-costed-roll-up
order: 8
title: "The costed roll-up"
description: "Build a product's cost from its BOM: material at consumption, labour only where there is a routing, bought-in services, price changes through where-used, and a labour charge found on a phantom."
draft: false
---

A product's cost is its bill of materials with prices on it. Every material line is priced at what the business pays, every made level adds the labour of its routing, and the costs roll up from the lowest level to the top exactly as the quantities did in Chapter 3. The arithmetic is simple. The errors are in what gets priced, at what quantity and at which levels, and they make the product look cheaper or dearer than it is in ways that only show when the margin does not arrive.

This chapter builds the PC-600's cost from its BOM. It covers material priced at consumption rather than net quantity, labour added only to levels with a routing, bought-in parts and services, the order in which a roll-up is done, and how a price change travels through where-used. The running case finds the module's cost overstated by a labour charge on levels where no labour happens. All figures are in Australian dollars excluding GST, because GST is collected on the sale and credited on purchases, and does not belong in a product's cost.

## What a cost roll-up adds

Each level of the BOM has a cost made of three parts:

- **material**: the sum of each child's quantity per parent times the child's cost, where the child's cost is its price for a bought item or its own rolled-up cost for a made one;
- **labour**: the hours of the level's routing times the labour rate, for made levels only;
- **bought-in services**: work done by a subcontractor on the business's material, such as the laser cutting and folding of the guides, priced per item.

The cost of a level is the sum of the three, and the roll-up repeats the calculation from the bottom of the BOM to the top.

```figure
type: formula
title: Rolled-up cost of a BOM level
formula: cost = Σ (child quantity × child cost) + routing hours × labour rate + bought-in services
caption: This is an illustration for the IR-630 roller, ex GST. Material uses consumption quantities from Chapter 5, not net ones.
- child cost | Price for a bought item; rolled-up cost for a made one
- routing hours | The level's own operations only; zero for a phantom
- labour rate | A$85 an hour in this illustration
step: Tube A$4.91 + shaft bar A$3.10 + 2 × 6204 at A$6.50 + 2 end caps at A$1.20 = A$23.41
step: Labour 0.25 h × A$85 = A$21.25
step: Roller = A$23.41 + A$21.25 = A$44.66
```

## Material at consumption

Chapter 5 found that each roller consumes 6,000 ÷ 11 mm of tube, about 545 mm, not the 500 mm it contains. At A$54 a 6 m length, the roller's tube costs 54 ÷ 11 = **A$4.91**, not the A$4.50 its net length would suggest. Across twelve rollers that is about A$4.91 a module of cost that a net-quantity roll-up leaves out.

The same applies to every cut material. The frame's hollow section, bought in 8 m lengths at A$96 each, A$12 a metre in this illustration, is costed from the cut plan of Chapter 5: ten lengths, 80 m, for seven frames, so each frame carries 80 × 12 ÷ 7 = **A$137.14** of section, not the A$125.28 that its net 10.44 m would cost. Each guide carries a share of the two sheets that the batch's fourteen blanks need, 2 × A$94.92 ÷ 14 = **A$13.56**, where the sheet's A$94.92 is its 45.2 kg at A$2.10 a kilogram.

## Labour where there is a routing

Labour belongs to the levels where work is done, and the routing says which those are. In the PC-600's BOM:

- the **roller** has a routing of 0.25 h: saw, press bearings, fit caps;
- the **drive unit** has 2 h of assembly and test;
- the **frame** has 3.5 h of cutting, welding and painting;
- the **module** has 4 h of final assembly;
- the **belt kit** is a phantom and the **fastener kit** is bagged by the store as overhead, so neither has labour;
- the **guides** are cut and folded by the laser contractor, a bought-in service of A$18 each, with no internal labour.

## The running case: the PC-600's cost

This is an illustration, ex GST. Rolling up from the bottom gives:

```figure
type: compare
title: Rolled-up cost of one PC-600 module, ex GST
cols: Qty | Each | Extended
caption: This is an illustration. Each line is that level's own rolled-up cost; the module's 4 h of final assembly is its own labour.
- IR-630 roller | 12 | A$44.66 | A$535.92
- DU-620 drive unit | 1 | A$1,185.04 | A$1,185.04
- FR-610 frame | 1 | A$441.92 | A$441.92
- GD-640 guide | 2 | A$31.56 | A$63.12
- Belt kit | 1 | A$102.40 | A$102.40
- KT-650 kit | 1 | A$21.60 | A$21.60
- Final assembly | 1 | A$340.00 | A$340.00
- *Module | — | — | A$2,690.00
```

The drive unit is its motor set at A$780, the bought DS-621 at A$232, 8 bolts at A$0.38 and 2 h of labour. The frame is its section at A$137.14, paint at A$7.28 and 3.5 h of labour. Each guide is its sheet share of A$13.56 and A$18 of laser cutting and folding. The phantom belt kit is 4.2 m of belt at A$22 a metre and four screws at A$2.50.

Of the A$2,690.00, material and bought-in parts and services are A$1,627.50, about 60.5%, and internal labour is A$1,062.50, about 39.5%. The split matters for decisions: a module whose cost is mostly labour responds to process improvement, and one whose cost is mostly material responds to buying and design.

```figure
type: stack
title: Where the PC-600's A$2,690 goes
unit: A$
caption: This is an illustration, ex GST. Labour is the sum of the roller, drive unit, frame and final assembly routings.
- Bought parts and services | 1627.5
- Internal labour | 1062.5
```

## The order of a roll-up

A roll-up must cost every child before its parent, which is the low-level code order of Chapter 2 run backwards: the lowest-level items first, then their parents, up to the module. A roll-up that costs the drive unit before the drive shaft assembly uses the assembly's old cost, and the error only corrects itself if the roll-up is run twice. Business systems handle the order for them; spreadsheets do not, and a spreadsheet roll-up whose rows are not sorted from the bottom up can be wrong by whatever changed since the last run.

## Setup costs and batch size

Some labour is per batch, not per unit, as Chapter 3 found for some materials: setting the saw's stop for the roller tube, loading the frame's welding jig. A cost per unit then depends on the batch it is shared across.

This is an illustration. The PC-600's batch setups total 1.5 h, A$127.50: half an hour at the saw and an hour at the welding jig. Shared across a batch of seven modules, that is **A$18.21** a module; across a batch of four, **A$31.88**; across twenty, **A$6.38**. The roll-up above leaves setups out, and the business adds them as a per-batch line on each quotation, using the batch the customer's order will actually be built in. A cost roll-up that spreads setups over an assumed batch should state the batch, because the same product costs differently in different quantities, and a quotation for four modules priced on a batch of twenty understates the setups by A$25.50 a module.

## Rounding in a roll-up

Costs should be carried at full precision through the roll-up and rounded only for display. The roller's tube at 54 ÷ 11 is A$4.9090…, and twelve rollers carry 12 × 4.9090… = A$58.91; rounding each roller's tube to A$4.91 first gives A$58.92. One cent a module is harmless; the same habit applied to a fastener at A$0.0384 rounded to A$0.04, across thousands a year, is not. The rule is the same as Chapter 3's for quantities: store enough precision that a year's total is right, and round at the end.

The PC-600's table above rounds each roller to the cent, as a hand calculation naturally does, and so shows the module at A$2,690.00. A full-precision roll-up gives the rollers A$535.91 and the module **A$2,689.99**. The cent is worth mentioning because it is exactly what a comparison between the system and a hand calculation will turn up, and the person making the comparison should know to expect a cent or two of rounding and to chase anything larger. A difference of A$170, as in the error that follows, is not rounding.

## The error: labour on levels with none

This is an illustration. When the business first ran its cost roll-up in the new business system, the module came out at **A$2,860.00**, A$170 more than the hand calculation. The difference was exactly 4 × A$42.50: the system had a default of 0.5 h of assembly labour for any made or phantom level without its own routing, and four lines had none: the belt kit, the fastener kit and the two guides.

None of those levels has internal labour. The belt kit is a phantom, the fastener kit's bagging is overhead and the guides' work is bought in. The default added A$170 a module, about 6.3% of the true cost, and the quoting team used the overstated cost for two quotations before the difference was found. The fix was to set the default to zero and give every level that really has labour an explicit routing, so that a missing routing shows as a level with no labour, which someone will question, instead of as a plausible half-hour that nobody will.

```figure
type: bars
title: PC-600 module cost, ex GST, by how the roll-up was set up
unit: A$
max: 3000
caption: This is an illustration. The default labour was 0.5 h at A$85 on four levels with no routing.
- Net tube length instead of consumption | 2685.09
- *Correct: consumption, labour only on routings | 2690
- Default 0.5 h on every level without a routing | 2860
```

## Overheads

The roll-up above gives the cost of material and direct labour. The business also has overheads: rent, supervision, the store's kitting time, quality checks, the planning time of Chapter 6. Most businesses recover them by adding an overhead rate to labour, or a percentage to material, or both. The BOM does not decide the overhead method, but the method should be applied once and visibly, as a line of its own, not hidden in an inflated labour rate that makes every routing look more expensive than it is.

The A$85 an hour in this illustration is a labour rate including on-costs such as superannuation and leave, but not the business's overheads. Whatever a business's rate includes, it should be stated with the roll-up, so that whoever reads the cost knows what it contains. Two costs built on different rates cannot be compared until the rates are put on the same basis, which is a common trap when a quotation is checked against an old one.

## Price changes and where-used

When a price changes, every product that uses the item changes cost by the item's total quantity in it times the change. The where-used view of Chapter 2 finds them.

This is an illustration. The 6204 bearing's price rises from A$6.50 to A$7.20, an increase of A$0.70. It appears in each IR-630 roller twice, and the PC-600 has twelve rollers, so the module's cost rises by 24 × 0.70 = **A$16.80**. The 6205 bearings in DS-621 do not change the module's cost, because DS-621 is bought at the machine shop's quoted price, A$232, until the machine shop re-quotes.

That last point is easily missed. A bought sub-assembly's cost is its price, not its BOM, so a change in its components affects the business only through the supplier's next quotation. A roll-up that kept exploding DS-621's own BOM after it became bought would show a cost change that the business will not see until the supplier passes it on, if they do.

## Standard and current cost

Many businesses keep two costs. A **standard cost** is fixed for a period, usually a year, and used for quoting and for measuring variances. A **current cost** is rolled up from today's prices and routings. The difference between them shows how far costs have moved since the standard was set, which is worth knowing before a large quotation.

The PC-600's business sets its standard costs each July, at the start of the Australian financial year, and rolls up current costs monthly. When the bearing price rose, the current cost rose by A$16.80 and the standard did not; the variance report showed the gap, and the quoting team used the current cost for new quotations.

## Checking a cost roll-up

A few checks catch most cost errors:

- **Compare with a hand calculation** of one product, done once, carefully, as above. A difference between the system and the hand figure is an error in one of them.
- **Check labour against routings.** Total the routing hours for the product, 0.25 × 12 + 2 + 3.5 + 4 = 12.5 h for the PC-600, and compare with the roll-up's labour, A$1,062.50 ÷ A$85 = 12.5 h. A difference is labour from somewhere other than a routing.
- **Check material shares.** A product whose material share jumps from one roll-up to the next has a changed price or quantity, and the change should be explainable.

## Exercise: a cost for the PC-900

The PC-900 has 18 rollers, 6.2 m of belt and a longer frame whose section, from its cut plan, costs A$198.00 a frame; its routing hours are the same as the PC-600's except that the frame takes 4.5 h and final assembly 5 h. Its other levels are as the PC-600's. Using the PC-600's figures above, what is the PC-900's cost, ex GST?

**Worked answer.**

- **Rollers**: 18 × A$44.66 = **A$803.88**.
- **Drive unit**: unchanged, **A$1,185.04**.
- **Frame**: section A$198.00 + paint A$7.28, taking the paint as unchanged for this exercise, + 4.5 h × A$85 = A$382.50, so **A$587.78**.
- **Guides**: two guides, taken here as the same cost, **A$63.12**; a longer guide would in practice change its sheet share.
- **Belt kit**: 6.2 m × A$22 = A$136.40, plus four screws at A$2.50, **A$146.40**.
- **Fastener kit**: **A$21.60**, taken as unchanged.
- **Final assembly**: 5 h × A$85 = **A$425.00**.

The total is **A$3,232.82**, ex GST. The exercise's assumptions, that paint, guides and fasteners are unchanged, are exactly the kind that a real roll-up should not make, and listing them is the point: a cost estimated by adjusting another product's cost is only as good as the list of what was assumed to stay the same.
