---
book: bills-of-materials-by-the-numbers
chapterSlug: scrap-yield-and-cutting-allowances
order: 5
title: "Scrap, yield and cutting allowances"
description: "Turn net quantities into what is really consumed: pieces per bar with kerf and end trim, cut lists for mixed lengths, sheet nesting yield, scrap rates applied once and correctly."
draft: false
---

The quantities in a bill of materials are what ends up in the product. What the workshop consumes is more: every saw cut turns a few millimetres of tube into swarf, every bar leaves an offcut too short to use, every sheet leaves a skeleton after its parts are cut, and some parts are spoiled and remade. A purchase order sized to the BOM's net quantities will run short, sometimes at the saw on the last few parts of a batch. A purchase order sized with a generous guess will fill the store with material.

This chapter sets out how to get from net quantities to gross consumption with numbers rather than guesses. It covers cutting from bar, where the question is how many pieces fit, not how many metres; cut lists that mix lengths; sheet nesting and its yield; and scrap rates, applied once and in the right form. The running case finds that buying the rollers' tube by length left the saw seven pieces short.

## Net, gross and the allowances between

The BOM's quantity is the **net** quantity: what the product contains. The **gross** quantity is what must be issued to make it: net plus everything lost on the way. The difference has two parts that behave differently.

- **Cutting allowances** depend on geometry: how many pieces fit in a bar or a sheet, the width of each cut, the ends that must be trimmed. They are calculable in advance, exactly.
- **Scrap** depends on the process: parts spoiled by a mistake, a setup or a defect. It is a rate, estimated from experience, and it varies.

Mixing the two into a single percentage hides both. A tube that loses 8% to geometry and 1% to scrap is better described by its cut pattern and a 1% scrap rate than by a 9% allowance that nobody can recalculate when the length changes.

## Pieces per bar, not metres

Tube and bar are cut into pieces, and what matters is how many whole pieces each stock length gives.

This is an illustration. Each roller's tube is 500 mm long. The tube is bought in 6,000 mm lengths. The saw's blade removes 3 mm per cut, and the first 10 mm of each length is trimmed square. The usable length is 6,000 − 10 = 5,990 mm, and each piece takes 500 + 3 = 503 mm, so each bar gives floor(5,990 ÷ 503) = **11 pieces**, with an offcut of 5,990 − 11 × 503 = 457 mm, too short for another roller.

The yield is 11 × 500 ÷ 6,000 = **91.7%**. Expressed as a BOM quantity, each roller consumes 6,000 ÷ 11 = about 545 mm of tube, not 500.

```figure
type: formula
title: Pieces per stock length
formula: pieces = floor((stock length − end trim) ÷ (piece length + kerf))
caption: This is an illustration for the roller tube. The floor function discards the fraction: a part piece is an offcut, not a roller.
- stock length | 6,000 mm
- end trim | 10 mm squared off the first end
- piece length | 500 mm
- kerf | 3 mm per cut
step: pieces = floor(5,990 ÷ 503) = floor(11.9) = 11
step: Yield = 11 × 500 ÷ 6,000 = 91.7%
step: Tube consumed per roller = 6,000 ÷ 11 ≈ 545 mm
```

## The error: seven pieces short

This is an illustration. For a batch of seven PC-600 modules, the planning system calculated the tube requirement from the BOM's net 0.5 m per roller: 7 × 12 × 0.5 = 42 m, which it converted to 42 ÷ 6 = **7 lengths**. Seven lengths were bought.

At the saw, seven lengths gave 7 × 11 = **77 pieces**. The batch needed 84 rollers. The saw operator ran out with seven rollers to go, the batch's final assembly waited three days for an extra length, and the excess offcuts from all seven lengths, each 457 mm, sat in the rack.

The fix was to give the tube's BOM line a cutting basis: the roller consumes one piece, and pieces are cut 11 to a length. The planning system now divides the piece count by 11 and rounds up: 84 ÷ 11 = 7.6, so **8 lengths**, leaving 8 × 11 − 84 = 4 spare pieces, which the store keeps as cut rollers' tubes for the next batch. The general lesson is that length-based conversion is wrong for anything cut into pieces, by exactly the amount that the offcuts and kerf use, and that amount is always enough to run short at the end of a batch.

## Cut lists with mixed lengths

When several piece lengths come from the same stock, the question becomes how to combine them to waste least. The PC-600's frame uses rectangular hollow section in two lengths: four rails of 1,800 mm and six cross members of 540 mm per module, bought in 8,000 mm lengths.

This is an illustration, with a 3 mm kerf and no end trim for the frame section. Four rails take 4 × 1,803 = 7,212 mm of a bar, leaving 788 mm, which fits one cross member, 543 mm, with 245 mm left over. So each bar gives four rails and one cross member. A bar of cross members alone gives floor(8,000 ÷ 543) = 14.

For seven modules, the frame needs 28 rails and 42 cross members. Seven bars give the 28 rails and 7 cross members; the remaining 35 cross members need three more bars of 14 each. The batch uses **10 bars**, 80 m, against a net requirement of 73.08 m, a yield of **91.4%**.

```figure
type: compare
title: Cut plan for seven PC-600 frames from 8 m hollow section
cols: Bars | Pieces from each bar | Offcut per bar
caption: This is an illustration with a 3 mm kerf. Mixing a short piece into the rail bars uses most of what would otherwise be a 788 mm offcut.
- Rail bars | 7 | 4 rails and 1 cross member | 245 mm
- Cross member bars | 3 | 14 cross members, 7 spare in all | 398 mm
- *Total | 10 | 28 rails, 49 cross members | Yield 91.4% against 73.08 m net
```

Cut planning of this kind is a small optimisation problem, and saw shops often use software for it. For a BOM, the point is that the frame's section requirement should be expressed as bars per batch from a cut plan, or as a yield factor derived from one, not as metres per frame.

## Sheet nesting

Sheet metal parts are cut from sheets, and the question is how many blanks fit per sheet, with the gaps the laser or punch needs between parts and at the edges.

This is an illustration. Each side guide's blank is 2,000 × 120 mm. The sheet is 2,400 × 1,200 mm. The laser contractor leaves 5 mm between parts and 10 mm at the sheet's edges. Laid lengthways, a blank fits once along the 2,400 mm side, and across the 1,200 mm side, floor((1,200 − 2 × 10 + 5) ÷ (120 + 5)) = **9** blanks fit, not the 10 that Chapter 4's exercise found with no gaps.

A batch of seven modules needs 14 blanks, so **2 sheets**, holding 18. The yield is 14 × 0.24 ÷ (2 × 2.88) = **58%**: the guides' long, narrow blanks waste the strip along the sheet's length, which could be used for small parts nested in the same run. That is a nesting decision for the cutter, but the BOM's sheet requirement for a batch should reflect sheets, not square metres.

## Scrap rates, applied once

Scrap from defects and setups is a rate, and two forms of the calculation are common:

- **gross = net × (1 + s)**, which adds s of the net quantity;
- **gross = net ÷ (1 − s)**, which assumes s of what is made is lost.

The second is correct when s is the fraction of production that is scrapped: to end up with net good parts after losing s of everything made, the business must make net ÷ (1 − s). For small rates the two hardly differ: at 1%, 84 rollers become 84 × 1.01 = 84.84 or 84 ÷ 0.99 = 84.85, both 85 when rounded up. At 10%, they become 1.100 and 1.111 times the net, a difference worth getting right.

The larger risk is applying scrap more than once. A scrap rate on the roller, another on the roller's tube and a third on the module compound: three rates of 2% each give 1 ÷ 0.98³ = 1.062, a 6.2% allowance where 2% was meant, if all three were set by different people for the same losses. The rule is that each loss is allowed for at the level where it happens, once.

```figure
type: bars
title: Gross material for 84 rollers' tubes, by method
unit: lengths
max: 9
caption: This is an illustration. Converting net metres to lengths runs short; pieces per bar gives the real number; a 1% scrap rate then adds a piece, not a length.
- Net metres converted to 6 m lengths | 7
- *Pieces per bar, 11 per length | 8
- Pieces per bar with 1% roller scrap, 85 pieces | 8
```

## Offcuts: stock or scrap?

Every cut plan leaves offcuts, and each one is either stock or scrap. Keeping every offcut fills the rack with pieces nobody uses; scrapping every one throws away material that a smaller part could have used. The business behind the PC-600 has a simple rule: an offcut is returned to stock, with its length recorded, if it is at least as long as the shortest part regularly cut from that material, and scrapped otherwise.

For the roller tube, the shortest regular part is the 500 mm roller, so the 457 mm offcut is scrapped. For the frame section, the 540 mm cross member is the shortest regular part, so the 245 mm and 398 mm offcuts are scrapped, though the workshop keeps a few for jigs. Offcuts returned to stock are booked in by measured length, as Chapter 4's issue units required, so that the stock record knows exactly what is in the rack. The rule is crude and it works, because it keeps only offcuts that the next cut plan can use, and the cut plan then takes stocked offcuts before new lengths.

## Yield belongs in the cost

The material cost of a part should include its yield, or the product's cost will be understated by the scrap and offcuts that every batch produces. This is an illustration. At A$54 a 6 m length, excluding GST, tube costs A$9.00 a metre. By net length, each roller's 0.5 m costs A$4.50. By consumption, each roller uses 6 ÷ 11 = 0.545 m of tube, which costs about **A$4.91**. The difference, A$0.41 a roller, is about A$4.91 a module across twelve rollers, small for one module and a few thousand dollars a year across the business's production. Chapter 8's cost roll-up uses consumption, not net quantity, for every cut material.

## Scrap rates from data

A scrap rate should come from records, not from a feeling about how often things go wrong. The store records every part scrapped, with its reason, and the business reviews the rates each quarter.

This is an illustration. Over the last year, 3 rollers of 290 made were scrapped, two for a bearing pressed in crooked and one for a tube cut short. That is a rate of about **1.03%**, which the BOM uses, rounded to 1%. The frame weldment had no scrap at all, because weld faults are repaired, not scrapped, so its scrap rate is zero and its rework time belongs in the routing. Rates set from data can be questioned and updated; a rate of "5% to be safe" can only be argued about.

Scrap rates also have a direction of risk. Too low, and batches run short at the end. Too high, and every batch buys material that becomes stock, which ties up cash and eventually becomes obsolete. For items with long lead times or expensive shortages, a slightly higher rate is a reasonable choice, recorded as such; for cheap items with short lead times, the measured rate is enough.

## Recording allowances

Each allowance should be recorded with its basis, as Chapter 3 recommended for quantities: "11 pieces per 6,000 mm length, 3 mm kerf, 10 mm trim", "9 blanks per sheet, 5 mm gap, 10 mm edge", "1% roller scrap, last twelve months' average". When the stock length, the saw blade or the contractor changes, the basis shows what to recalculate, and the yield follows. A thinner saw blade, for example, cutting a 2 mm kerf instead of 3 mm, changes the roller tube's pieces per length only if 11 pieces of 502 mm leave room for a twelfth, which they do not: 12 × 502 = 6,024 mm, more than the 5,990 mm usable. The basis makes that a thirty-second check instead of a guess.

## Exercise: a longer roller

The PC-900 uses the same roller, but a customer asks for a wider variant with 650 mm tubes. With 6,000 mm lengths, a 3 mm kerf and a 10 mm end trim, how many pieces does each length give, what is the yield, and how many lengths do 72 rollers need?

**Worked answer.** Each piece takes 650 + 3 = 653 mm of the usable 5,990 mm, so each length gives floor(5,990 ÷ 653) = floor(9.17) = **9 pieces**, with an offcut of 5,990 − 9 × 653 = 113 mm.

The yield is 9 × 650 ÷ 6,000 = **97.5%**, better than the 500 mm roller's 91.7%, because the 650 mm length happens to fit the stock length closely.

For 72 rollers, the requirement is 72 ÷ 9 = **8 lengths** exactly, with no spare pieces. By net length, 72 × 0.65 = 46.8 m would have been converted to 46.8 ÷ 6 = 7.8, rounded to 8 lengths, which is right this time only because the yield is so high. The pieces-per-bar method gives the right answer for both rollers; the length method gives it for one and runs short on the other.
