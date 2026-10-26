---
book: blanking-and-piercing-dies-by-the-numbers
chapterSlug: wear-sharpening-and-tool-cost
order: 9
title: "Wear, sharpening and the cost of a press tool"
description: "How cutting edges wear, using burr height to time regrinds, MP-40's grind life, the cost per plate from die and press, break-even against laser cutting, and a chipped punch found late."
draft: false
---

A new die cuts with sharp edges and a small burr. Every stroke wears the edges a little, the burr grows, and sooner or later the die must come out of the press to be sharpened. How often that happens, how many sharpenings the die can take, and what the die costs per part across its life are the numbers that decide whether a press tool was worth buying. They also decide how the die is looked after: a die that is sharpened on time lasts for years, and one that is run until it chips can lose a punch, a die insert and a batch of parts in a few strokes.

This chapter describes how edges wear, uses burr height to time MP-40's regrinds, works out its grind life, builds up its cost per plate, compares it with laser cutting to find the break-even quantity, and ends with a chipped punch whose burr went unnoticed for 30,000 strokes.

## How edges wear

Cutting edges wear mainly on their sides, not their faces. As the punch passes through the sheet and back out, the burnished wall of the hole rubs along the punch's side, and the slug or blank rubs along the die opening's land. The sharp edge rounds over, a few micrometres at first, then more. A rounded edge pushes more metal aside before cutting, so the rollover and burr grow, the force rises slightly and the stripping force rises with it.

Other wear modes add to it. Abrasive particles in the sheet, such as scale, score the edges. Soft or coated sheet can build up on a punch, galling. An edge that is overloaded, misaligned or hit by a slug chips, and a chipped edge wears very quickly from that point on. Good alignment (Chapter 7), the right clearance (Chapter 3), sound steel and hardening (Chapter 8) and light lubrication of the strip all slow wear down, but none stops it.

Sharpening restores the edge by grinding the punch faces and the die face flat, removing the rounded edge with them. A light regrind, taken before the edge has rounded far, removes little metal; a heavy one, taken after the edge has rounded badly or chipped, removes much more. That is the main reason to sharpen on a schedule rather than waiting for trouble.

## Using the burr to time regrinds

The burr is the most convenient measure of edge wear, because it is on every part and can be measured with a dial indicator or a burr gauge. The shop takes a reading from the last plate of each batch and plots it against the die's stroke count since its last sharpening.

This is an illustration. MP-40's die started with a burr of about 30 µm, 0.03 mm, at the outline. Over its first sharpening interval, the shop's readings rose steadily, and faster towards the end as the edges rounded further. The drawing's limit is 0.10 mm. The shop sets an **action limit of 0.08 mm**, 80 µm, at which the die is sent for sharpening, so that a die that is due never runs past the drawing's limit before it can be changed. On these readings, MP-40's die reaches the action limit at about **125,000 strokes**, roughly two years of its demand.

Different features wear at different rates. The slender piercing punches often wear first, because they work at higher stress (Chapter 4) and have less mass to carry heat away; the burr is checked at the holes and slot as well as the outline, and the worst of them sets the regrind.

```figure
type: line
title: Burr height at the outline of MP-40 against strokes since sharpening
x: Strokes since sharpening, thousands
y: Burr height, µm
ymin: 0
ymax: 120
legend: Burr at the outline | Action limit, 80 µm | Drawing limit, 100 µm
mark: 125 | Regrind
caption: This is an illustration of a shop's own readings, one per batch. The rate of growth rises as the edges round further. Regrinding at the action limit keeps every plate within the drawing's limit.
- 0 | 30 | 80 | 100
- 20 | 35 | 80 | 100
- 40 | 42 | 80 | 100
- 60 | 50 | 80 | 100
- 80 | 58 | 80 | 100
- 100 | 67 | 80 | 100
- 125 | 80 | 80 | 100
- 140 | 88 | 80 | 100
```

## Sharpening practice

A regrind is a surface-grinding job, but a careless one can do more harm than the wear it removes. Toolmakers follow a few habits.

- **Grind the faces, not the sides.** Punches are ground on their cutting faces and the die block on its top face. Grinding the sides changes the size, and with it the clearance and the part.
- **Take light passes with coolant.** Hardened tool steel overheated by the wheel softens at the surface or cracks in a fine network, and either ruins the edge. Light passes, a suitable wheel kept dressed and plenty of coolant keep the steel cool.
- **Remove just enough.** The aim is to grind until the rounded edge has gone and the edge is sharp all round, checked under a magnifier. MP-40's routine regrind of 0.15 mm is set by experience of how much its edges round in 125,000 strokes; a chipped edge needs more.
- **Demagnetise.** Parts held on a magnetic chuck come off magnetised, and magnetised punches hold slugs, which then pull. They are passed through a demagnetiser before reassembly.
- **Break the edge very lightly.** Some toolmakers stone the new edge with a fine stone, just enough to remove the grinding burr without rounding it.
- **Measure and record.** The punches' lengths, the die block's thickness and the remaining land depth are measured, the amount removed is added to the log, and the shut height or shims are dealt with as in Chapter 8.

## Grind life

Every regrind takes height off the punches and the die face. A die can be reground until one of its parts runs out of usable length or thickness, and that total is its **grind life**.

This is an illustration. Each regrind of MP-40's die removes **0.15 mm** from the punch faces and 0.15 mm from the die block face. The limiting part is the die block: its openings have a straight land of 3.5 mm before the relief taper begins (Chapter 1), and once the face has been ground down into the taper, the openings get larger and the clearance and blank size grow. Allowing a margin, the toolmaker sets the die block's grind life at **3.0 mm**:

- regrinds available: 3.0 ÷ 0.15 = **20**;
- strokes per sharpening interval: about **125,000**;
- total life: the first interval plus twenty more, 21 × 125,000 = about **2.6 million strokes**.

At 60,000 plates a year, that is more than forty years of MP-40. The die will almost certainly outlast the product, which is typical of well-made dies for moderate volumes: their life is set by the product, not by wear. A die for a part made in millions a year would reach its grind life in a few years, and its cost per part would include replacement punches and inserts, which is why high-volume dies are built with replaceable inserts from the start.

The punches, at 63 mm long, have more than enough length for twenty regrinds; the stripper springs' extra compression over 3.0 mm of regrinds was allowed for in Chapter 5, and the shut height's loss was dealt with in Chapter 8.

## The cost of a plate

A press tool's economics are a fixed cost, the die, against a low cost per part. The illustration below builds up MP-40's cost per plate over an assumed five-year product life of **300,000 plates**, excluding GST.

- **Strip**: A$0.111 per plate (Chapter 6), less A$0.003 of scrap credit: **A$0.108**.
- **Press time**: 120 strokes a minute at 75% efficiency is 5,400 plates an hour; at A$110 an hour, **A$0.020** per plate.
- **Set-up**: 1.5 hours per batch at A$110, spread over 5,000 plates: **A$0.033**.
- **Deburring**, needed because of the burr faces (Chapters 1 and 7): **A$0.030**.
- **Regrinds**: two in five years at A$450 each, spread over 300,000 plates: **A$0.003**.
- **The die**: A$38,000 spread over 300,000 plates: **A$0.127**.

That is about **A$0.194** per plate in running costs plus A$0.127 for the die, about **A$0.321** per plate in all. The die is the largest single item, and its share falls the longer the product is made: over ten years, it would be about A$0.063.

```figure
type: stack
title: Where MP-40's A$0.321 per plate goes, over 300,000 plates
unit: A$
caption: This is an illustration, excluding GST. The die's share depends on how many plates it makes; the running costs barely change with volume.
- The die, A$38,000 | 0.127
- Strip, less scrap credit | 0.108
- Set-up | 0.033
- Deburring | 0.030
- Press time | 0.020
- Regrinds | 0.003
```

## Break-even against laser cutting

The alternative to a press tool for a flat part like MP-40 is to cut it on a laser, which needs no tool. Its cost per part is higher, because cutting each part takes seconds instead of a fraction of a second, but there is nothing to buy up front.

This is an illustration. A laser cutting MP-40 from 2.0 mm sheet takes about 9 seconds per plate, including the holes and slot, at a laser rate of A$150 an hour: A$0.375. Nested from sheet at 80% yield, a plate uses 0.0587 ÷ 0.80 = 0.0734 kg of steel, A$0.117 at the same price per kilogram. Handling and deburring add A$0.060. The laser-cut plate costs about **A$0.552**, with no tool.

The press tool's break-even quantity is the die's cost divided by the saving per plate:

38,000 ÷ (0.552 − 0.194) = about **106,000 plates**

At 60,000 a year, the die pays for itself in under two years. Below about 106,000 plates in the product's life, the laser is cheaper; above it, the die is. Over the assumed 300,000 plates, the die saves about A$69,500.

The comparison is sensitive to its inputs. A product that is dropped after a year, a design change that scraps the die, or a laser rate that falls, all move the break-even. A press tool is a bet on volume and on the design staying put, and the break-even quantity is the size of the bet. For a new product with uncertain demand, many shops cut the first few thousand parts on a laser and order the die once the demand and the design have settled.

```figure
type: line
title: Cumulative cost of MP-40 plates, press tool against laser
x: Plates made, thousands
y: Cumulative cost, A$ thousands
ymin: 0
ymax: 180
legend: Press tool, A$38,000 die | Laser cutting, no tool
mark: 106 | Break-even
caption: This is an illustration, excluding GST. The press tool starts A$38,000 behind and gains A$0.358 a plate; the lines cross at about 106,000 plates.
- 0 | 38.0 | 0.0
- 50 | 47.7 | 27.6
- 100 | 57.4 | 55.2
- 150 | 67.1 | 82.9
- 200 | 76.8 | 110.5
- 250 | 86.5 | 138.1
- 300 | 96.3 | 165.7
```

## Keeping the die

A die that lasts forty years needs a record. The shop keeps a log for each die with:

- every set-up, with the press, the stroke count and the first-off results;
- every burr reading, plotted as above;
- every regrind, with the amount removed, the total removed so far and the new shut height or the shims fitted (Chapter 8);
- every repair or replaced part, with the cause;
- the material it has been run on.

Between batches, the die is cleaned, lightly oiled against rust, and stored with its tag and a sample last plate. A die stored with a strip still in it, or without its springs relieved, is a die that will need work before it runs again.

## The error: a chipped punch found late

This is an illustration. Partway through a batch, a slug pulled back on the slot punch was struck into the strip, and the impact chipped a small piece from the corner of the slot punch, where a straight side meets the radius. The press ran on. Because the shop's burr check was only made on the last plate of each batch, and only at the outline, the chip was not noticed.

Three weeks later, the customer rejected a delivery: the slots had a burr of up to 0.18 mm at one corner, catching the cable ties as they were threaded. The retained last plates showed the problem on every batch since the chip, about **30,000 plates**. The customer sorted its stock, and the press shop replaced the plates and paid for the sorting.

The slot punch was replaced and the die reground. The shop changed three things. The burr check now covers the holes and slot as well as the outline. It is made every 1,000 strokes by the operator, with a simple go/no-go burr gauge, as well as on the last plate. And a pulled slug is now treated as a reason to stop the press and inspect the punches, because a pulled slug is often the event that chips them.

```figure
type: checklist
title: Wear and cost checks over a die's life
caption: The burr is the die's report card; the log turns readings into decisions.
- Burr measured at every cut feature, not just the outline | outline, holes and slot
- Action limit set below the drawing's limit | 80 µm against 100 µm
- Grind life known and tracked against the log | 3.0 mm, 20 regrinds
- Cost per part and break-even calculated for the expected volume | A$0.321; about 106,000 plates
- Pulled slugs treated as a reason to inspect punches | press stopped and punches checked
- x Burr checked only at the outline, once a batch | 30,000 plates with a burr at the slot
```

## Exercise: a shorter product life

The customer warns that MP-40 may be replaced by a new design after only two years, 120,000 plates. Recalculate the die's cost per plate and the total cost of both routes over 120,000 plates. Is the die still worth buying?

**Worked answer.** Over 120,000 plates:

- the die's cost per plate is 38,000 ÷ 120,000 = **A$0.317**, and one regrind would be due at about 125,000 strokes, so none is needed;
- press route total: 38,000 + 0.191 × 120,000 = about **A$60,900**, using A$0.191 per plate of running costs without regrinds;
- laser route total: 0.552 × 120,000 = about **A$66,300**.

The die still saves about A$5,400, because 120,000 plates is above the 106,000 break-even, but the margin is thin: a few months' less demand, or a modest fall in the laser rate, would wipe it out. With a two-year product life, cutting the plates on a laser and keeping the A$38,000 is a reasonable choice, and the decision turns on how confident the customer is in the volume, which is a question about the product, not the die.
