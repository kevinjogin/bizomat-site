---
book: deep-drawing-and-spinning-by-the-numbers
chapterSlug: ironing-work-hardening-and-annealing
order: 8
title: "Ironing, work hardening and annealing"
description: "Thin a drawn wall on purpose by ironing, follow how each stage hardens the metal, decide when an anneal is needed, and catch deeper stainless cups that split days after a redraw with no anneal."
draft: false
---

Every stage of drawing leaves the metal harder and less ductile than it was. For many materials and modest draws, that does not matter: the part is finished before the metal runs out of ductility, and the hardening even helps, strengthening the wall that carries the drawing force. For deeper parts, for stages that thin the wall on purpose, and for work-hardening materials like austenitic stainless steel, it matters a great deal. The metal can become too hard to draw further, or, more insidiously, hard and stressed enough to crack after it has left the press.

This chapter covers **ironing**, the deliberate thinning of a drawn wall; the **work hardening** that every stage causes; and **annealing**, the heat treatment that restores the metal's ductility between stages. The running case finds that the deeper 90 mm version of SC-100, drawn in two stages with the redraw at its planning limit and no anneal, produced cups that left the press sound and split at the rim within two days.

## Ironing

In ironing, a drawn cup is pushed through a die whose gap to the punch is **smaller** than the wall's thickness. The wall is squeezed thinner and, because its volume is constant, longer. The bottom, which does not pass through the gap, keeps its thickness. Ironing gives thin, uniform walls with a good finish and close thickness tolerance, which is why it is used for drinks cans, cartridge cases and thin-walled shells.

```figure
type: formula
title: Ironing reduction and wall length
formula: reduction = (t₀ − t₁) ÷ t₀;   new wall length = old wall length × t₀ ÷ t₁
caption: This is an illustration for the 0.6 mm wall of Chapter 1's enquiry drawing, ironed from SC-100's 0.8 mm wall in one pass.
- t₀ | Wall thickness before ironing, mm
- t₁ | Wall thickness after ironing, set by the gap, mm
step: Reduction = (0.8 − 0.6) ÷ 0.8 = 25%
step: A 72 mm wall becomes about 72 × 0.8 ÷ 0.6 = 96 mm
step: True thickness strain = ln(0.8 ÷ 0.6) ≈ 0.29
```

The ironing force must be carried by the wall that has already been ironed, the thinner wall above the die. Its limit is therefore the strength of the thinned wall. This is an illustration. With an illustrative mean flow stress of 900 MPa in the work-hardened 304 wall, and a factor of 1.5 for friction and the extra work of bending through the die's entry, the ironing force for a 25% reduction on a 100 mm cup is about π × 100 × 0.6 × 900 × 0.29 × 1.5 ≈ **73 kN**. The ironed wall, at an illustrative tensile strength of 1,000 MPa after hardening, can carry about π × 100 × 0.6 × 1,000 ≈ **188 kN**. The ratio of about 2.6 leaves room for the reduction; a much larger single reduction would close the gap between force and strength, and the wall would tear above the die.

Large total reductions are taken in several passes, sometimes with several ironing rings in one stroke, each taking a part of the reduction. Taking 0.8 mm to 0.6 mm in two passes, 0.8 to 0.7 and 0.7 to 0.6, means reductions of about 12.5% and 14.3%, each comfortably within an illustrative single-pass limit. SC-100's customer, as Chapter 1 recorded, decided that the 33 g a 0.6 mm wall would save was not worth an ironing stage, so SC-100 is drawn and not ironed.

## Work hardening

Plastic deformation raises a metal's strength and lowers its remaining ductility. Each stage of drawing deforms the wall and the flange, so each leaves them harder, and the rim, which has been compressed most around its circumference, is usually the hardest part of the cup.

Materials differ greatly in how fast they harden. Low-carbon drawing steels and aluminium alloys in soft tempers harden moderately. Austenitic stainless steels such as 304 harden fast, partly because their deformation transforms some of their structure to a harder, more brittle form, **strain-induced martensite**. The higher the strain, and the lower the temperature at which it is applied, the more martensite forms. This is part of why 304 draws well in a first stage and becomes progressively harder to draw in later ones.

```figure
type: bars
title: Illustrative hardness at SC-100's rim through its stages, HV
unit: HV
max: 420
caption: This is an illustration of the trend only; real values depend on the material's chemistry, the strain at each stage and the temperature, and are measured on trial cups.
- Annealed sheet | 170
- After the first draw | 300
- After the redraw | 350
- *After an intermediate anneal | 170
- Redrawn after an anneal | 290
```

Hardness at the rim of trial cups is a quick check of how much a stage has hardened the metal. A rising hardness is not a fault in itself; it is a measure of how much ductility has been used and how much remains for the stages still to come.

## When the metal runs out

Two problems follow from too much work hardening. The first is the obvious one: the metal becomes too strong and too brittle to draw further, and the next stage tears at a ratio that would have worked on fresh sheet. The second is less obvious and more dangerous: **delayed cracking**. A deeply drawn cup of austenitic stainless steel can leave the press sound and crack hours or days later, usually as splits running down the wall from the rim. The causes combine high residual stress in the wall, especially the hoop tension that springs back into the rim, a high fraction of martensite, and hydrogen picked up in processing. The crack may appear on the shelf, in the wash or after delivery.

The ways to prevent it all act on its causes: lower the strain in each stage, anneal between stages to remove the martensite and the stress, draw at a moderately raised temperature where less martensite forms, choose a stainless grade with a more stable structure, often one with higher nickel, or stress-relieve promptly after drawing. Which is best depends on the part, the quantity and the cost, and the material supplier's guidance should be sought for any deep draw in an austenitic grade.

## The error: a deeper cup with no anneal

This is an illustration. When the larger contract was won, the customer also ordered the deeper 90 mm version of SC-100 that Chapters 2 and 3's exercises sized: a 218.4 mm blank, a first draw to 125 mm, ratio 1.75, and a redraw to 100 mm, ratio 1.25, at the redraw's planning limit. Trial cups drew fully at both stages, measured correctly and passed inspection. No anneal was planned between the stages, because SC-100's own two stages had not needed one.

Two days later, a check of the trial batch found **4 cups in 100** with vertical splits running from the rim, a few millimetres to a centimetre long. Across a run of 20,000 cups, that rate would have meant about 800 split parts, many of them found only by the customer.

```figure
type: decision
title: Does a drawn stainless stage need an anneal before the next?
question: How hard has the metal been worked, and what comes next?
- Modest total ratio, short redraw, no delayed cracks in trial | No anneal | SC-100's own two stages
- *High total ratio, a redraw at its limit, or delayed cracks in trial | Anneal between stages | The 90 mm cover
- Another stage still to come after a hard redraw | Anneal before it | Each stage starts from restored ductility
- Delayed cracks even with an anneal | Change the grade or the plan | Higher-nickel grade, warm drawing or smaller steps
```

The investigation found the cause in the second stage: a redraw at its planning limit, on metal already hardened by a first draw of 1.75, had left the rim with high martensite and high hoop stress. SC-100's own redraw, at 1.15, had not. The fix was an **intermediate anneal** after the first draw, which restored the metal before the redraw; cups from the revised process were held for a week and checked, and none split. The general lesson is that a work-hardening material's limit is set by the history of all its stages, not by each stage's ratio alone, and that a cup which passes inspection at the press has not yet passed every test.

## Checking the metal on trial cups

Two quick measurements on trial cups show how hard a stage has worked the metal. The first is **hardness**: a cup is sectioned through its wall and rim, and microhardness readings are taken at intervals from the bottom to the rim. The profile shows where the metal has hardened most, usually at the rim, and how much each stage adds. Comparing it with the hardness of cups from the same stage that have been held and found sound, or found cracked, turns the profile into a working limit for the part.

The second is **magnetic response**. Annealed 304 is essentially non-magnetic, and the martensite that drawing forms is magnetic, so the amount of martensite in a drawn wall can be estimated with a hand-held instrument that measures magnetic response, without cutting the cup. A rim that reads high, compared with sound cups from the trial, is a warning before any crack appears. This check is also relevant to the customer: a stainless part that is required to be non-magnetic, for an instrument that a magnetic field would disturb, may need an anneal after its last stage for that reason alone.

For SC-100's 90 mm cover, both checks were added to the trial record. Cups from the revised process with an intermediate anneal showed a rim hardness and a magnetic reading well below those of the cups that had split, and the hold-and-check period confirmed it. The two readings then became in-process checks on the first cups of each production batch, so that a change in the coil or the lubricant that raised the rim's hardness would be seen before a batch was shipped.

## Annealing in practice

Annealing a drawn stainless part between stages restores its ductility, but it is a significant operation. The cups must be cleaned of drawing compound before they go into the furnace, because residues burn onto the surface; heated to the temperature that the material's specification and the heat treater set; held long enough to recrystallise the structure and dissolve the martensite; and cooled quickly enough to keep the structure clean. Annealing in air leaves a scale that must be removed by pickling before the next stage, while **bright annealing** in a protective atmosphere avoids most of it at a higher furnace cost. Every anneal adds a wash, a furnace cycle, possibly a pickle and handling between stations, and therefore cost and lead time, which is why it is planned only where the metal needs it.

## Lubrication and heat

Work hardening and lubrication interact. A better lubricant lowers the drawing force, which lowers the strain the wall must take at the punch radius and the stress left in the rim. Drawing speed raises the metal's temperature through deformation and friction, and a warmer cup forms less martensite, which is one reason some stainless parts draw better at moderate speed and some processes warm the tools deliberately. These effects are refined in trial, and the process sheet should record the speed and lubricant used in the trial that proved the plan, so that production uses the same.

## Ironing and annealing together

A part that is drawn, redrawn and ironed takes the most strain in its last stage, the ironing, and that stage's force must be carried by the most hardened wall. In practice the order of operations, the place of any anneal and the reductions at each ironing pass are planned together. A common pattern for thin-walled stainless shells is a draw, an anneal, a redraw and then ironing in one or two passes, with the anneal placed where it restores the metal before the heaviest work. The calculation at each stage is the same: the force needed, the wall's capacity to carry it, and the ductility that remains.

## Recording the metal's history

The process sheet should record, for each stage, the strain it imposes, as a draw ratio or an ironing reduction, the hardness measured at the rim on trial cups, whether an anneal follows and its specification, and the hold-and-check period used to look for delayed cracking. For SC-100 that is two stages with no anneal and a hardness after each; for the 90 mm cover, two stages with an anneal between them and a week's hold on the first production batch. A later change to the plan, a higher ratio, a different grade or a faster press, sends the engineer back to those lines.

## Exercise: ironing the 90 mm cover

Suppose the customer now asks for the 90 mm cover with a 0.65 mm wall, to save weight, after the anneal and redraw. The redrawn cup's wall is about 0.8 mm and about 92 mm long below the trim allowance. What reduction does one ironing pass take, how long does the wall become, and is one pass reasonable against the earlier illustrative force and strength figures?

**Worked answer.** The reduction is (0.8 − 0.65) ÷ 0.8 = **18.75%**, and the wall becomes about 92 × 0.8 ÷ 0.65 ≈ **113 mm**, so the trim allowance and the drawn height must be recalculated, and the blank reduced, as Chapter 1's volume reasoning showed. The true strain is ln(0.8 ÷ 0.65) ≈ 0.21.

With the same illustrative figures, the ironing force is about π × 100 × 0.65 × 900 × 0.21 × 1.5 ≈ **57 kN**, against a wall capacity of about π × 100 × 0.65 × 1,000 ≈ **204 kN**, a ratio of about 3.6. One pass is reasonable on those figures. But the ironing stage follows a redraw at its limit, so the rim's hardness and any delayed cracking must be checked again in trial; the extra strain may make a second anneal, before ironing, the price of the thinner wall.
