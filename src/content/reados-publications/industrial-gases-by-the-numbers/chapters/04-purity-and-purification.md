---
book: industrial-gases-by-the-numbers
chapterSlug: purity-and-purification
order: 4
title: "Purity and purification"
description: "Trace the impurities in acetylene, oxygen and shielding gases to their sources, see what they do to flames, cuts and welds, and estimate what a small loss of oxygen purity costs in cutting."
draft: false
---

A gas is never perfectly pure. Acetylene from carbide carries traces of the phosphorus and sulphur that were in the lime and coke; oxygen from liquid air carries a little nitrogen and argon; oxygen from electrolysis carries a little hydrogen; shielding gases pick up moisture and air from hoses and fittings on their way to the arc. Most of the time the traces are too small to matter. Sometimes they matter a great deal: they make welds porous or brittle, slow a cut, foul a flame or harm the welder.

This chapter traces the main impurities in workshop gases to their sources, explains what each does, and works through the effect of oxygen purity on cutting, using a 1921 estimate that a few per cent of impurity could raise oxygen consumption sharply. It finishes with the gas quality checks the workshop added to its review.

## Purity as a number

Gas purity is stated as a percentage by volume, often with several nines: 99.5%, 99.9%, 99.995%. The more useful way to read it is as the impurity that remains. Oxygen of 99.5% purity contains 0.5% of other gases, 5,000 parts per million; oxygen of 99.9% contains 0.1%, or 1,000 parts per million. Each extra nine divides the impurity by ten. Suppliers describe their grades by purity and by the limits on particular impurities, such as moisture, oxygen in an inert gas or hydrocarbons in oxygen, and a certificate of analysis or a product specification states those limits. The grade a workshop buys should match what its processes need; a higher grade costs more and buys nothing if the process cannot use it.

## Impurities in acetylene from carbide

Swingle's 1915 manual explained where the impurities in generator acetylene came from. Even the best coke contained sulphur compounds and even the purest lime contained phosphates, and in the electric furnace these combined with calcium alongside the carbide. When the carbide met water, those compounds decomposed too, so that acetylene always carried some phosphine, which the manual called phosphoretted hydrogen, and hydrogen sulphide, in amounts that depended on the generator. Some ammonia formed as well, from nitrogen compounds that the hot carbide had picked up from the air as it cooled, and fine lime dust was carried along with the gas.

The manual set out why those impurities mattered for welding. Burned in the flame, phosphine and hydrogen sulphide formed oxides of phosphorus and sulphur, which could pass a little phosphorus and sulphur into the molten steel, the same elements steelmakers worked to remove because they make steel brittle. The manual reported that vessels welded for pressure service cracked frequently with unpurified generator gas and rarely with dissolved acetylene. Impure gas also gave a coloured flame that was harder to adjust, and its combustion products were harmful to breathe.

## Purification in practice

Washing the gas in water removed some ammonia and dust but did nothing about phosphine, and filtering through cotton wool, sand or charcoal removed little more than dust. Real purification needed a chemical bed that reacted with the phosphorus and sulphur compounds. Chapter 3 described the purifiers of the day and their main rule: the gas must pass slowly through enough bed area, or the bed would heat and purify poorly.

```figure
type: layers
title: Where generator acetylene's impurities came from and where they went
caption: Summarised from Swingle's 1915 account in new words. Dissolved acetylene from a modern supplier is purified to the supplier's specification before filling.
- Raw materials | sulphur in coke, phosphates in lime, nitrogen from the air during cooling
- In the carbide | calcium sulphides, phosphides and nitrogen compounds alongside the carbide
- In the generator | hydrogen sulphide, phosphine and ammonia released with the acetylene; fine lime dust
- Washer and filter | some ammonia and dust removed; phosphine untouched
- *Chemical purifier | phosphorus and sulphur compounds removed, if the gas passes slowly enough
- In the flame | anything left becomes oxides of phosphorus and sulphur, some reaching the weld and the welder's air
```

## Impurities in cylinder acetylene

Dissolved acetylene from a supplier is purified before filling, and its main impurity at the torch is acetone. Some acetone vapour always leaves the cylinder with the gas, and more if the gas is drawn too fast, if the cylinder is cold or nearly empty, or if it has been used lying down, in which case liquid acetone can reach the regulator. Acetone in the flame gives a purplish tinge, changes the flame setting and adds carbon and oxygen to the flame chemistry. The remedies are those set out in Oxy-Fuel by the Numbers: draw within the withdrawal limit, keep the cylinder upright, and use a manifold for large flows.

## Impurities in oxygen by method

Viall's *Gas Torch and Thermit Welding* of 1921 summarised the impurity in oxygen by the method used to make it. Oxygen from the liquid-air process carried some nitrogen; oxygen from chemical methods could carry various impurities; oxygen from electrolysis carried hydrogen. He gave the average purity of cylinder oxygen at the time as about 99%. Today, almost all oxygen comes from air separation plants, described in Chapter 5, and its residual impurities are mainly argon and nitrogen, whose boiling points lie close to oxygen's.

```figure
type: compare
title: Oxygen's main impurity by method of production
cols: Main impurity | Why
caption: Viall's 1921 summary, restated in new words, with the modern air-separation case added. Purity grades and impurity limits come from the supplier's specification.
- Liquid air, 1921 | nitrogen | nitrogen's boiling point is close to oxygen's
- Chemical methods, 1921 | various | depends on the chemicals and their purity
- Electrolysis | hydrogen | hydrogen and oxygen are made side by side in the same cell
- *Modern air separation | argon and nitrogen | argon's boiling point is closer still to oxygen's
```

## Oxygen purity and cutting

Oxygen purity matters most in cutting, because the cutting jet's oxygen must react with the steel along the whole depth of the kerf. Any inert gas in the jet does not react; it dilutes the oxygen at the cutting front, and the dilution grows as the jet entrains combustion products and the iron oxide it produces. Viall stated that if oxygen is diluted with even a small quantity of incombustible gas, its cutting efficiency is greatly reduced, and that a decrease of 4% in purity results in an increase of about 60% in oxygen consumption.

The 1921 figure is an estimate from its time, not a law, and modern cutting with modern tips and high-purity oxygen behaves differently in detail. But the direction is not in doubt: small amounts of impurity in cutting oxygen cost far more than their proportion suggests, because they slow the oxidation at the cutting front, so the operator slows down or raises the oxygen flow to keep the cut going.

```figure
type: formula
title: What the 1921 purity estimate implies per percentage point
formula: consumption ratio per point ≈ (1 + 0.60) ^ (1 ÷ 4)
caption: This is an illustration that spreads Viall's 1921 estimate evenly over four percentage points. It is a teaching approximation, not a modern cutting model.
- Viall's estimate | 4 points less purity → about 60% more oxygen
step: (1.60) ^ 0.25 ≈ 1.125
step: about 12.5% more oxygen for each percentage point of purity lost
```

## What purity costs the workshop

This is an illustration. The workshop spends about A$7,600 a year on oxygen, and about four-fifths of it, about A$6,080, goes into cutting. If the cutting oxygen were a full percentage point lower in purity than it should be, the 1921 estimate, spread as above, would put the extra consumption at about 12.5%, or about 0.125 × 6,080 ≈ **A$760** a year, excluding GST, plus the slower cutting and poorer cut faces that come with it.

Modern supplier oxygen is far purer than the 1921 average, so the workshop's real risk is not the grade it buys but what happens between the cylinder and the tip: leaking fittings that let air in when the flow stops, contaminated hoses, and oxygen drawn through a regulator or manifold that has been fouled. Those are the purity losses the workshop can control.

## Moisture and air in shielding gases

For the arc processes, the impurities that matter most are moisture and air. Moisture in the shielding gas breaks down in the arc and puts hydrogen into the weld metal, causing porosity in aluminium and, in hardenable steels, contributing to hydrogen cracking. Oxygen and nitrogen from air oxidise and contaminate the weld pool, causing porosity, oxide films and, in reactive metals such as titanium, embrittlement. Cylinder gas leaves the supplier dry and pure; it picks up moisture and air on the way to the arc.

The main routes are familiar to anyone who has chased porosity. Hoses of unsuitable material let moisture diffuse through their walls, especially when they are long and the gas sits in them overnight. Loose fittings and cracked hoses can draw air in, because gas flowing fast past a small leak can lower the local pressure enough to aspirate air into the stream. Gas left sitting in a hose overnight collects moisture, so the first weld of the morning can be porous unless the line is purged. A cylinder emptied to zero can admit moist air through its open valve, which is why cylinders are returned with some pressure left.

## Purging a hose

This is an illustration. A 10 m welding hose with an 8 mm bore holds about π × 0.004² × 10 ≈ **0.50 L** of gas. At a flow of 15 L/min, the hose is swept through once every 2 seconds, and five volume changes, enough to clear most of the moisture and air that has collected overnight, take about 10 seconds. A short purge at the start of each shift, and after every cylinder change, costs a fraction of a litre of gas and removes one of the commonest causes of start-of-day porosity.

The same idea applies, on a larger scale, to the back purge of a stainless steel pipe weld, where the volume to be cleared is the inside of the pipe; Chapter 7 calculates how long that takes.

## Analysers and checks

A workshop does not need a laboratory to manage gas quality, but some simple checks help. Gas suppliers provide product specifications and, for critical work, certificates of analysis. Portable oxygen analysers can measure the residual oxygen in a purge, and some welding procedures specify a maximum residual oxygen before the root is welded. Dew-point meters measure moisture in gas lines where welding of reactive metals demands it. And the simplest check of all, a leak test of every connection with a suitable leak detection solution, finds the leaks through which air and moisture get in, as Chapter 9 explains.

```figure
type: checklist
title: The workshop's gas quality checks
caption: This is an illustration of the routine the workshop adopted. Procedures for critical welds and the gas supplier's advice set the actual requirements.
- x Correct grade ordered | product code checked against each process's need
- x Lines purged | at the start of each shift and after every cylinder change
- x Connections leak tested | at each cylinder change and monthly on fixed lines
- x Cylinders returned with pressure | never run to zero
- x Hoses of the right material | replaced when cracked or hardened
- *? Residual oxygen measured | for stainless and titanium back purges
```

## Choosing the grade

Suppliers sell most gases in several grades, from industrial grades suited to cutting, heating and general welding to high-purity and specialty grades for laboratories, electronics and the most demanding welds. The step from one grade to the next can add a good deal to the price, so the choice is worth making deliberately. The workshop's review matched each gas to its use: industrial oxygen and acetylene for cutting and heating; a standard welding-grade argon and carbon dioxide mixture for structural steel; welding-grade argon for tungsten arc work on stainless and aluminium; and nitrogen of a grade suitable for purging. None of its work needed a laboratory grade, and the manager found that one cylinder of a higher grade, ordered years earlier for a special job, had been reordered automatically ever since at a higher price. Matching the grade to the need, and checking the product codes on each delivery, is a small task that pays every month.

## Specifications as evidence

For some work, the gas used is part of the evidence that a weld is sound. A welding procedure specification may name the shielding gas by composition and standard, and a fabricator working to a quality system may need to show which gas, from which batch, was used on a job. Keeping the supplier's specifications on file, recording cylinder changes on critical work, and labelling manifolds and lines clearly turn gas quality from an assumption into a record.

## The early lesson restated

The early manuals' long chapters on purification can seem quaint now that acetylene arrives purified in a cylinder. But their lesson still applies. Gas purity is decided not only where the gas is made but everywhere it passes on its way to the work, and small impurities have effects far larger than their share of the gas. The 1915 writers saw cracked pressure vessels from unpurified gas; a modern workshop sees porous aluminium welds from a damp hose, or a slow cut from a leaking oxygen fitting. The cure in each case is to find where the impurity enters and stop it.

## A failure: porous mornings

This is an illustration. The workshop's aluminium welder complained that the first few welds every morning were porous, after which the work came good. The gas, pure argon, was from a new cylinder, and the procedure had not changed.

The cause was the hose. A replacement fitted some months earlier was a general-purpose hose, not one intended for shielding gas, and it was 15 m long, coiled behind the welding set. Overnight, moisture diffused through its walls into the stagnant argon, and the first welds of the day were made with damp gas until the flow had swept it out. Replacing the hose with one of a suitable material, shortening it to the length the bay needed, and adding a short purge at the start of each shift ended the porosity.

## Exercise: purity in parts per million

A shielding gas specification limits moisture to 10 parts per million and oxygen to 10 parts per million. Express each limit as a percentage, and say what purity those two impurities alone would allow. Then estimate how many volume changes are needed to reduce moisture in a hose from 1,000 ppm to 10 ppm, assuming the incoming gas is perfectly dry and the hose behaves as a well-mixed volume.

Ten parts per million is 10 ÷ 1,000,000 = 0.001%. The two impurities together, 20 ppm, would allow a purity of at least 100 − 0.002 = **99.998%**, before any other impurities are counted.

For a well-mixed volume swept by dry gas, the concentration falls exponentially with the number of volume changes N: C = C₀ × e^(−N). Reducing 1,000 ppm to 10 ppm needs e^(−N) = 0.01, so N = ln(100) ≈ **4.6 volume changes**. A real hose behaves more like a plug of gas pushed through than a mixed volume, which clears it faster, but moisture held in the hose walls comes out slowly, which is why a short purge helps more than its arithmetic suggests and why the hose material matters so much.
