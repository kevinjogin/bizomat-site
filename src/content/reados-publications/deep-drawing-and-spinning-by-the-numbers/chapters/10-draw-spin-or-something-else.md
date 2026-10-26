---
book: deep-drawing-and-spinning-by-the-numbers
chapterSlug: draw-spin-or-something-else
order: 10
title: "Draw, spin or something else"
description: "Choose between drawing, spinning and other routes by quantity: tooling and unit costs, break-even, cost per part across volumes, uncertain demand, and catch tooling costed over a contract not yet won."
draft: false
---

A round, seamless part like SC-100 can usually be made by more than one route, and the right one depends less on the part's shape than on how many are wanted. Drawing needs dies that cost thousands of dollars and weeks to make, and then makes parts in seconds. Spinning needs a former that costs a fraction as much and can be ready in days, and then makes parts in minutes. Somewhere between a few hundred and a few thousand parts, the two cost the same, and on either side of that quantity one is clearly cheaper. The decision is a calculation, and the inputs that matter most are the tooling cost, the cost per part and an honest estimate of the quantity.

This chapter builds illustrative costs for SC-100 by drawing and by spinning, finds the quantity at which they break even, shows how the cost per part changes with volume, and considers the case that SC-100's customer actually faced: a modest confirmed quantity and a possible large one. The running case finds that a buyer's first choice, drawing tools costed over a contract not yet won, would have more than tripled the cost of the first year's parts.

## Two cost structures

Every route has a fixed cost, paid once whatever the quantity, and a variable cost, paid for every part. The cost per part at a quantity q is the fixed cost divided by q, plus the variable cost.

```figure
type: formula
title: Cost per part by route
formula: cost per part = tooling ÷ q + unit cost;   break-even q = (tooling A − tooling B) ÷ (unit cost B − unit cost A)
caption: This is an illustration with invented costs in Australian dollars excluding GST: drawing tooling A$18,000 and A$3.20 a part, spinning tooling A$1,500 and A$11.17 a part.
- q | Quantity of parts over which the tooling is paid for
- Tooling | One-off cost of dies, formers and setup, A$
- Unit cost | Material, machine time, finishing and handling per part, A$
step: Break-even q = (18,000 − 1,500) ÷ (11.17 − 3.20) ≈ 2,070 parts
step: Below about 2,070 parts, spinning costs less in total; above it, drawing does
```

## SC-100's illustrative costs

This is an illustration. Every price below is invented to show the method, in Australian dollars excluding GST.

**Drawing.** The tooling is a first-draw die, a redraw die and a trimming tool, with their trials, totalling about **A$18,000**; blanks are cut in the press from strip. Each part uses a 200 mm square of 0.8 mm 304 sheet, about 253 g, at an illustrative A$6.50 a kilogram, about A$1.64. Its two draws and its trim take about 0.25 minutes of press time at A$150 an hour, about A$0.63. Washing and deburring add about A$0.40, and handling and inspection about A$0.53, for a unit cost of about **A$3.20**.

**Spinning.** The tooling is a steel former and a CNC program, about **A$1,500**. Each part uses the same material, A$1.64, with its blank laser-cut at about A$0.80. Chapter 9's cycle of about 2.6 minutes at A$180 an hour costs about A$7.80. Washing, deburring, handling and inspection add the same A$0.93, for a unit cost of about **A$11.17**.

```figure
type: compare
title: SC-100's two routes, in illustrative A$ excluding GST
cols: Tooling | Unit cost | Lead time to first parts | Best suited to
caption: This is an illustration with invented prices and lead times. A real comparison uses quotes from the toolmaker and the spinning shop for the part's actual quantity.
- *Deep drawing, two stages and trim | A$18,000 | A$3.20 | About 10 weeks for tools and trials | Thousands of parts a year and more
- Conventional spinning | A$1,500 | A$11.17 | About 2 weeks for the former | Hundreds of parts, prototypes and early production
```

## Cost per part across quantity

The break-even quantity tells only part of the story. The cost per part at each quantity shows how steeply the drawn route's tooling dominates at low volume and how quickly it fades at high volume.

```figure
type: line
title: SC-100's illustrative cost per part by quantity, A$ excluding GST
x: Quantity of parts
y: Cost per part, A$
legend: Deep drawing | Spinning
ymin: 0
ymax: 70
caption: This is an illustration with invented costs. The routes cross near 2,070 parts; at 20,000 parts, a drawn part costs about A$4.10 and a spun one about A$11.25.
- 300 | 63.20 | 16.17
- 1000 | 21.20 | 12.67
- 2000 | 12.20 | 11.92
- 5000 | 6.80 | 11.47
- 10000 | 5.00 | 11.32
- 20000 | 4.10 | 11.25
```

At 300 parts, a drawn part costs about A$63.20 and a spun one about A$16.17. At 20,000, a drawn part costs about A$4.10, against A$11.25 for spinning, and the drawn route saves about A$143,000 over the run. Near 2,000, the two are within a few per cent, and the decision turns on other things: lead time, the risk of a design change, the shop's capacity and the quality each route gives.

## The error: tooling paid for by a contract not yet won

This is an illustration. SC-100's buyer received both quotes. The drawing quote showed A$18,000 for tooling and A$3.20 a part; the spinning quote A$1,500 and A$11.17. The buyer, told that the customer might need 20,000 a year if a large contract were won, amortised the tooling over 20,000 parts, compared about A$4.10 against A$11.25, and recommended ordering the drawing tools.

The large contract had not been won. The confirmed quantity for the first year was **400** parts. At 400, the drawing route costs about 18,000 + 400 × 3.20 ≈ **A$19,280** in total, about A$48.20 a part; spinning costs about 1,500 + 400 × 11.17 ≈ **A$5,970**, about A$14.92 a part. If the contract were never won, the drawing tools would have cost more than three times as much as spinning for the same 400 parts.

```figure
type: bars
title: The first year's 400 parts, total cost by route, A$ excluding GST
unit: A$
max: 21000
caption: This is an illustration. Amortising tooling over a possible quantity made drawing look cheaper; at the confirmed quantity it costs more than three times as much.
- Deep drawing, tooling and 400 parts | 19280
- *Spinning, former and 400 parts | 5970
```

The engineering manager who reviewed the recommendation asked one question: over what quantity is the tooling actually paid for? The answer, 400 confirmed and 20,000 possible, changed the decision. The general lesson is that a break-even calculation is only as good as its quantity, and that the quantity should be the one that is committed, with the possible one treated as a scenario rather than a fact.

## Deciding under uncertain demand

SC-100's real choice was not simply drawing or spinning, but when to commit to drawing. Two strategies were compared over two years, assuming that if the contract were won, the second year would need 20,000 parts.

- **Draw from the start**: buy the drawing tools now. If the contract is won, the two years' 20,400 parts cost about **A$83,280**; if not, the first year's 400 cost A$19,280 and the tools sit idle.
- **Spin first, draw if won**: spin the first year's 400 for about A$5,970, and buy the drawing tools only when the contract is won. If it is won, the two years cost about **A$87,960**, A$4,680 more, mostly the spinning premium on the first 400; if not, the first year cost A$5,970.

Spinning first costs A$4,680 more if the contract is won and saves A$13,310 if it is not. The two strategies cost the same, on average, only if the contract is about **74%** certain. Below that, spinning first is the better bet; above it, drawing from the start. The customer judged the contract much less certain than that, and SC-100's first year was spun, with the drawing tools ordered when the contract was signed. The spinning shop's first parts also served as field trial units, which found a gasket change before any drawing tool was cut.

The arithmetic leaves out the drawing tools' lead time, about ten weeks in this illustration, which in the "spin first" strategy must be covered by spinning while the tools are made. In practice that adds some spun parts to the second year and narrows the difference slightly; the conclusion holds.

## Other routes

Drawing and spinning are not the only ways to make a seamless round cover, and the comparison should include any route the part's quantity and shape allow.

- **Progressive or transfer drawing** in a single press, with all stages in one tool and parts fed automatically from coil, costs more in tooling and less per part than separate dies, and suits very high quantities.
- **Hydroforming** or rubber-pad forming replaces one half of the tooling with a fluid or a pad, lowering tooling cost for moderate quantities and complex shapes.
- **Machining from solid** suits very small quantities of small parts, but wastes most of the material for a thin-walled cup.
- **Fabrication**, a rolled and welded tube with a welded disc, is cheap in tooling but adds a seam, which SC-100's seal ruled out.

Each has its own fixed and variable cost, and the same arithmetic compares them.

## Quality, risk and lead time

Cost is not the only basis for the choice. A drawn part is highly repeatable once its tools are proved, and its surface is uniform; a spun part depends more on the program or the spinner, and shows roller marks. Drawing tools take weeks to make and are expensive to change if the design changes; a spinning former can be remade in days. For a new product whose design may still move, those differences favour spinning early and drawing later, which is exactly the sequence SC-100's strategy produced. The calculation should record them beside the costs, because a decision taken on cost alone can be reversed by a design change that the cost did not include.

## Stating prices with GST

Prices in a quote or a recommendation should state whether they include GST, and the comparison should use one basis throughout. This is an illustration. SC-100's spun part at 400 a year costs about A$14.92 excluding GST, about **A$16.41** including GST at 10%. The drawn part at 20,000 a year costs about A$4.10 excluding GST, about **A$4.51** including it. A comparison that mixes a price including GST with one excluding it is wrong by 10% before any other error.

## What a quote must include

Two quotes can only be compared if they cover the same things. A drawing quote's tooling figure should say whether it includes the trials, the first-article inspection and the corrections that trials usually bring; who owns the tools once they are paid for; how long they are expected to last before major maintenance; and who pays for that maintenance. A spinning quote should say the same of its former and program. Unit prices should state the quantity they assume, the batch size, the material's price basis, the finish, the packaging and the freight, and whether they include GST.

This is an illustration. If SC-100's drawing quote of A$18,000 had excluded trials worth A$2,500, and the spinning quote had included its sample parts, the break-even would have moved from about 2,070 to about 2,380 parts. Small differences in what each quote includes move the break-even more than most buyers expect, so the first step in comparing quotes is to put them on the same basis, line by line, before any arithmetic.

## When to revisit the decision

A route chosen for one quantity should be revisited when the quantity changes, and the triggers should be written down with the decision. For SC-100, the decision record listed three: the large contract being won, which would move the part to drawing tools; a design change to the cover, which would need a new former or new dies and therefore a fresh comparison; and the spun part's annual quantity passing about 2,000, the break-even, even without the large contract. Each trigger points back to the calculation, so the decision is remade with numbers rather than by habit. A part that stays on spinning at 10,000 a year because nobody reopened the decision costs, in this illustration, about A$63,000 a year more than it needs to.

## SC-100 on one sheet

Every chapter of this book adds a line to SC-100's process sheet. Gathered together, in this book's illustrations: a 199.3 mm blank of 0.8 mm 304, sized from 31,184 mm² of surface with 6 mm of trim; a first draw to 115 mm at a ratio of 1.73 and a redraw to 100 mm at 1.15, against planning limits of 1.8 and 1.25; a first-draw force of about 220 kN including a holder force of 46.7 kN, profiled through the stroke, on a 400 kN hydraulic press; a clearance of 0.96 mm per side, set against a rim measured at 0.92 mm; ears of 2.5 mm, a trim allowance of 6 mm and a rotary shear trim; no anneal for SC-100 itself, an intermediate anneal for the 90 mm cover; and, for the first year's 400 parts, spinning at 2.6 minutes a part, with drawing tools ordered when the large contract is signed. Each line has its calculation and its trial evidence behind it, and each can be checked by someone who was not there when it was decided. That sheet, more than any single number, is what turns a drawn part from a toolmaker's craft into a process a business can plan, quote and repeat.

## Exercise: a third option

A transfer-press supplier offers SC-100 at an illustrative A$45,000 in tooling and A$2.10 a part. At what quantity does the transfer route break even with the separate drawing dies, and with spinning? What would you recommend at 20,000 a year, and at 2,000?

**Worked answer.** Against separate dies: (45,000 − 18,000) ÷ (3.20 − 2.10) ≈ **24,550 parts**. Against spinning: (45,000 − 1,500) ÷ (11.17 − 2.10) ≈ **4,800 parts**.

At 20,000 parts, the separate dies are cheaper than the transfer route, because 20,000 is below their break-even of about 24,550: about A$82,000 against A$87,000. The transfer route would pay only if the volume reliably exceeded about 24,550 parts over the tools' life, which, over several years at 20,000 a year, it would, so the right comparison is over the expected life of the product, not one year. At 2,000 a year, spinning and the separate dies are close, as the chart showed, and the transfer route's A$45,000 is far from paid; it should not be considered until the volume is known to be large, and the separate dies themselves only once the quantity is committed.
