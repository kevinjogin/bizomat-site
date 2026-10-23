---
title: "Ratio, proportion and scaling: drawing scales, gear ratios, mixtures and the square-cube law"
description: "How ratios and direct and inverse proportion work in technical tasks, from drawing scales and pulley ratios to mixing, dilution and recipe scaling, and why areas and volumes scale differently."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - manufacturing
  - quality
author: "KEVOS"
featured: false
draft: false
---

Much of practical engineering and production comes down to keeping things in proportion. A drawing at 1:20 must be measured at the right scale. A pulley twice the size of the one driving it turns at half the speed. Two-part adhesives cure properly only when mixed in the stated ratio. A cleaning concentrate must be diluted correctly to work without damaging surfaces or people. A batch recipe developed for 20 litres must be scaled to 500 litres without changing the product. A prototype built at half size behaves differently from the full-size product, because areas and volumes do not scale in the same way as lengths.

These are all problems of **ratio** and **proportion**. The mathematics is simple, but errors are common, especially when ratios are expressed in different ways, when quantities are mixed by weight in one place and by volume in another, or when someone assumes that everything scales in a straight line. A sound understanding of direct and inverse proportion, and of how lengths, areas and volumes scale, prevents many costly mistakes.

This article explains ratios, direct and inverse proportion, drawing scales, speed ratios in drives, mixtures and dilutions, recipe scaling and the square-cube law, with worked examples and checks that apply in workshops, design offices and production lines.

## Ratios

A **ratio** compares two or more quantities of the same kind. A mix of 1 part cement to 3 parts sand is written 1:3. Ratios can be simplified by dividing all parts by a common factor: 4:12 is the same as 1:3.

Ratios can be expressed in several ways:

- as parts, such as 1:3;
- as a fraction of the whole, where 1:3 means the cement is 1/4 of the mix and the sand 3/4;
- as a **unit ratio**, such as 1:3 or 0.33:1; or
- as a percentage, where cement is 25% of the mix.

Confusion between "parts of each" and "fraction of the whole" is a common source of mistakes. A ratio of 1:4 resin to hardener means one part resin for every four parts hardener, so resin is one fifth, or 20%, of the mixture, not one quarter.

## Direct proportion

Two quantities are in **direct proportion** when doubling one doubles the other. If y is directly proportional to x, then y = k × x for some constant k. The cost of steel bar at a fixed price per metre is directly proportional to length; the volume of paint needed is directly proportional to the area covered at a given film thickness.

The **unitary method** is a reliable way to solve direct proportion problems: find the value for one unit, then multiply. If 12 brackets need 3.6 kg of steel, one bracket needs 0.3 kg, and 50 brackets need 15 kg.

Many relationships that look proportional are not. Labour cost per unit usually falls as batch size increases because set-up time is spread over more parts. Freight cost does not rise in proportion to weight across different shipping methods. Assuming direct proportion where there is a fixed component, a step or a discount produces errors.

## Inverse proportion

Two quantities are in **inverse proportion** when doubling one halves the other. If y is inversely proportional to x, then y = k ÷ x. At a constant flow rate, the time to fill a tank is inversely proportional to the flow; for a fixed distance, travel time is inversely proportional to speed.

Inverse proportion is often over-applied to people and work. Doubling the number of people on a task does not always halve the time, because tasks have sequences, coordination needs and limited workspace. Inverse proportion is a useful first estimate only when work can genuinely be divided.

## Drawing scales

A drawing scale is a ratio of drawing size to real size. At 1:20, one millimetre on the drawing represents 20 millimetres on the object; at 2:1, the drawing is twice full size. Typical scales include 1:1, 1:2, 1:5 and 1:10 for parts, and 1:20, 1:50, 1:100 and 1:200 for buildings and sites.

Measuring a printed drawing with a ruler is risky, because prints may be reduced or enlarged, and the stated scale applies only to the original sheet size. Dimensions should be read from the dimension text, not scaled. Where scaling is unavoidable, check a known dimension on the print first to confirm the actual scale. The [checking CAD layouts and plot scale before issue](/reados/collections/cad-drafting-and-drawing-standards/checking-cad-layouts-and-plot-scale-before-issue/) article explains how to avoid scale errors when drawings are produced.

## Speed ratios in drives

### Pulleys and sprockets

In a belt drive, the belt moves at the same surface speed on both pulleys, so their rotational speeds are inversely proportional to their diameters:

driven speed = driver speed × driver diameter ÷ driven diameter

A motor running at 1,450 rpm with a 100 mm pulley driving a 250 mm pulley turns the driven shaft at 1,450 × 100 ÷ 250 = 580 rpm. Sprockets and chains work the same way using numbers of teeth.

```figure
type: svg
title: A pulley drive
alt: A 100 millimetre pulley on a motor turning at 1,450 rpm drives a 250 millimetre pulley by a belt, so the driven shaft turns at 1,450 times 100 divided by 250, or 580 rpm.
caption: Speeds are inversely proportional to diameters: 1,450 × 100 ÷ 250 = 580 rpm.
viewbox: 0 0 600 220
body:
<circle class="bxa" cx="140" cy="110" r="40"/>
<path class="lf spin" d="M104 110H176M140 74V146"/>
<circle class="bx" cx="420" cy="110" r="95"/>
<path class="lf spin" d="M335 110H505M420 25V195"/>
<path class="ln" d="M140 70L420 15M140 150L420 205"/>
<circle class="fa" cx="140" cy="110" r="5"/>
<circle class="fi" cx="420" cy="110" r="6"/>
<text class="txb" x="140" y="114" text-anchor="middle">100 mm</text>
<text class="tx txs" x="140" y="185" text-anchor="middle">1,450 rpm</text>
<text class="txb" x="420" y="104" text-anchor="middle">250 mm</text>
<text class="tx" x="420" y="130" text-anchor="middle">580 rpm</text>
```

### Gears

For a pair of gears, speeds are inversely proportional to the numbers of teeth. A 20-tooth pinion driving a 60-tooth gear gives a 3:1 reduction: the gear turns at one third of the pinion speed and, ignoring losses, delivers three times the torque. In a gear train with several stages, the overall ratio is the product of the stage ratios. The [choosing gearboxes and geared motors](/reados/collections/machine-elements-and-mechanical-design/choosing-gearboxes-and-geared-motors/) article explains how ratio, torque and service factors guide selection.

Speed and torque trade against each other: power, the product of torque and speed, stays the same apart from losses. Doubling the reduction ratio halves the output speed and roughly doubles the output torque.

## Mixing ratios: by weight or by volume

Many materials are mixed by ratio: two-part adhesives, resins, paints, concrete, fuels for two-stroke engines and process chemicals. The ratio may be specified **by weight** or **by volume**, and the two are not the same unless the components have the same density.

If a resin system specifies 100:30 by weight and the hardener is less dense than the resin, measuring 100:30 by volume will put in too much hardener. Always check which basis the manufacturer specifies, use the right measuring method and convert using densities only when necessary:

volume = mass ÷ density

Incorrect ratios cause soft or brittle adhesive joints, uncured coatings, weak concrete and engine damage, so mixing procedures should state the ratio, the basis and the measuring equipment.

## Dilution

Diluting a concentrate to a working strength follows a simple rule. The amount of active ingredient stays the same, so:

C1 × V1 = C2 × V2

where C1 and V1 are the concentration and volume of the concentrate, and C2 and V2 the concentration and volume of the diluted solution. To make 50 litres of a 2% solution from a 20% concentrate:

V1 = C2 × V2 ÷ C1 = 2 × 50 ÷ 20 = 5 litres of concentrate

topped up with water to a total of 50 litres. Note that the water added is 45 litres, not 50. Dilution ratios on labels are sometimes given as "1:10", which may mean one part concentrate to ten parts water, or one part concentrate in ten parts total. Labels and procedures should make the meaning unambiguous.

## Scaling recipes and batches

Scaling a batch recipe from a trial to production looks like simple direct proportion: multiply every ingredient by the same factor. That works for quantities, but several aspects of a process do not scale linearly:

- **Heating and cooling times** depend on surface area and volume, which scale differently, so large batches heat and cool more slowly.
- **Mixing** behaves differently in larger vessels.
- **Evaporation losses** depend on surface area.
- **Minimum quantities**, such as a small amount of a critical additive, may be hard to measure accurately in small trial batches and easy to overshoot in large ones.

Production scale-up usually needs trials at intermediate sizes and adjustment of process settings, not just multiplication of ingredients.

## The square-cube law

When an object is scaled by a factor in every direction, its lengths change by that factor, its areas by the square of the factor and its volumes, and therefore its weight, by the cube. A part scaled up by 2 has 4 times the surface area and 8 times the volume and mass.

Consequences appear everywhere:

- A beam scaled up in every dimension becomes relatively weaker under its own weight, because its weight grows faster than the cross-sectional area that carries it.
- Larger tanks and vessels lose heat more slowly relative to their contents because their surface area grows more slowly than their volume.
- A half-scale prototype weighs only one eighth of the full-size product, so it may not reveal problems caused by mass, such as deflection, vibration or handling.
- Painting or coating costs scale with area, while material costs scale with volume.

Understanding the square-cube law helps interpret prototypes and models correctly and explains why scaling up a successful small design can produce surprises.

## Rates and unit conversions

A **rate** is a ratio of quantities with different units: kilometres per hour, parts per hour, litres per minute or dollars per kilogram. Converting rates means converting both units: 120 parts per hour is 2 parts per minute. Writing units through every step of a calculation and cancelling them like algebraic terms catches many errors.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A small food manufacturer is scaling up a sauce from a 20-litre development batch to a 400-litre production kettle, a factor of 20. The development recipe uses 18 kg of tomato base, 1.2 kg of sugar, 0.3 kg of salt and 60 g of a thickener, with a 30-minute cook.

Multiplying by 20 gives 360 kg of tomato base, 24 kg of sugar, 6 kg of salt and 1.2 kg of thickener. The production manager checks the parts of the process that do not scale linearly. The 400-litre kettle takes much longer to heat because its contents have 20 times the volume but its heated surface is only around seven times larger. The 30-minute cook is therefore redefined as 30 minutes after the batch reaches temperature, measured with a probe. Evaporation is lower relative to the batch, so the sauce comes out thinner, and the thickener is adjusted after two trial batches. The cleaning concentrate used on the kettle also needs a new dilution: 200 litres of 2% solution from a 25% concentrate needs 2 × 200 ÷ 25 = 16 litres of concentrate.

```figure
type: compare
title: Scaling a sauce from 20 to 400 litres
cols: Scales by 20 | Does not scale simply
caption: The ingredients scale linearly; heating, evaporation and timing do not.
- Ingredients | 18 kg base to 360 kg; sugar, salt, thickener ×20 | Thickener adjusted after two trials
- Heating | Contents ×20 | Heated surface only about ×7
- *Cook time | 30 minutes | Redefined: 30 minutes after reaching temperature
```

The first production batches match the development product's thickness and taste, and the scale-up notes are added to the product file for future reference.

## How this applies to a small Australian business

- **Write ratios clearly**, stating parts or fractions and weight or volume.
- **Read dimensions, not scaled measurements**, from drawings.
- **Use the unitary method** for direct proportion problems.
- **Check speed ratios and torque** when changing pulleys, sprockets or gears.
- **Use C1 × V1 = C2 × V2** for dilutions and label solutions clearly.
- **Expect non-linear effects** when scaling batches, prototypes or designs.

## Common mistakes

- **Mixing by volume** when the ratio is specified by weight.
- **Misreading dilution ratios** as parts of the total instead of parts of water.
- **Scaling a printed drawing** that has been reduced.
- **Assuming labour or cost scales in proportion** with quantity.
- **Testing half-scale prototypes** and assuming full-size behaviour will match.
- **Forgetting that torque rises** as speed is reduced through a drive, overloading shafts and keys.

## Frequently asked questions

**Is a 1:4 ratio one quarter or one fifth?** It depends on what the ratio describes. One part to four parts gives five parts in total, so the first ingredient is one fifth of the whole.

**Why does a bigger batch take disproportionately longer to heat?** Volume grows with the cube of size while heated surface area grows with the square, so each litre has less heating surface in a larger vessel.

**Can a prototype at reduced scale prove a design?** It can test shape, fit and some functions, but mass, stiffness, thermal behaviour and strength all scale differently, so critical behaviours need full-size or carefully scaled testing.

**How should mixing ratios be written in procedures?** State the ratio, whether it is by weight or by volume, the total batch size, the measuring equipment to use and the tolerance allowed. For critical mixes, give the actual quantities for each standard batch size so operators do not have to calculate on the floor, and record the quantities used on the batch record.

## Questions to ask

- Are our mixing ratios stated with a clear basis of weight or volume?
- How do we confirm the scale of printed drawings before anyone measures them?
- Which of our processes would behave differently at a larger scale?
- Do our dilution instructions leave any room for misinterpretation?
- Where are we assuming costs or times scale in proportion when they do not?
- Do our drive changes include a check of the new speed and torque at the driven machine?

## Bringing it together

Ratios and proportion underpin drawing scales, drive ratios, mixtures, dilutions, recipes and costs. Direct and inverse proportion solve many problems quickly, but only where the relationship genuinely holds. Mixing by the right basis, diluting with C1 × V1 = C2 × V2, reading dimensions rather than scaling prints, and remembering that areas grow with the square and volumes with the cube of size prevent many practical errors. The [choosing and maintaining belt and chain drives](/reados/collections/machine-elements-and-mechanical-design/choosing-and-maintaining-belt-and-chain-drives/) article applies speed ratios to real drive selection.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
