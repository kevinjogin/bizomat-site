---
title: "Specifying tolerances, fits and surface finish: tight where function needs it, economical everywhere else"
description: "Every tolerance is a cost commitment. How to set general tolerances, choose fits, analyse stack-ups, use datums and geometric tolerances, and specify surface finish only where it matters."
publishDate: 2026-10-09
category: "Engineering"
tags:
  - design
  - manufacturing
  - quality
author: "KEVOS®"
featured: false
draft: false
---

A drawing for a simple steel bracket arrives at a machine shop with every dimension toleranced at plus or minus 0.05 mm, because that is what the title block template says. The bracket has two holes that locate on a machine frame and a bore that carries a bearing; everything else is clearance around other parts. The machinist quotes for slow, careful machining and full inspection of every feature. Another supplier declines to quote. The designer never intended any of that. The tolerance was a habit, not a decision.

Tolerances are among the most consequential numbers on an engineering drawing. They tell the supplier how precisely each feature must be made, which in turn decides the process, the machine, the fixturing, the inspection method, the scrap rate and the price. A tolerance tighter than the function needs adds cost to every part, for the life of the product. A tolerance looser than the function needs produces parts that do not fit or do not work. The skill is to be exactly as tight as the function demands, and deliberately generous everywhere else.

This article explains how to set tolerances from function, how general tolerances work, how fits are specified, how tolerance stack-ups are analysed, why datums and geometric tolerances matter, how to specify surface finish and how to make sure every tolerance can be manufactured and measured. It is general information for designers, engineers, drafters and people who buy machined and fabricated parts. Detailed values must always be taken from the current editions of the relevant standards and from component manufacturers' recommendations.

## Start from function

Before writing a single tolerance, sort the features of the part by what they do:

- **Functional interfaces**: features that mate with other parts, such as bearing seats, locating holes, sliding surfaces, sealing faces and mounting patterns.
- **Features affecting performance or safety**: thicknesses that carry load, clearances that prevent rubbing, features that set alignment.
- **Everything else**: outlines, clearance holes, chamfers, pockets that only remove weight, cosmetic edges.

Only the first two groups normally need individual tolerances. The third can usually be covered by a general tolerance note. For each functional feature, ask what range of sizes and positions would still let the product work, then set the tolerance to that range, not to whatever the shop happens to be capable of. The [cost you commit before you spend](/reados/collections/specifications-product-quality-and-sustainability/the-cost-you-commit-before-you-spend/) article explains why these decisions set so much of a product's lifetime cost.

## General tolerances: cover the rest with one note

Most drawings carry a **general tolerance** note that applies to every dimension without an individual tolerance. Rather than inventing values, many businesses reference a standard. ISO 2768, for example, defines tolerance classes for linear and angular dimensions: fine, medium, coarse and very coarse. The tolerance grows with the size of the dimension, which reflects how real processes behave. For the medium class, linear dimensions between 6 and 30 mm carry ±0.2 mm, and those between 30 and 120 mm carry ±0.3 mm, with wider values for larger sizes. Check the current standard for the full tables.

Choosing a sensible general class, often medium for machined parts, then tightening only the functional features individually, usually reduces cost without any loss of function. In Australia, engineering drawing practice is set out in the AS 1100 series, and many businesses combine it with ISO tolerance standards.

## Fits: how mating parts are specified

Where a shaft fits into a hole, the relationship between their sizes decides how the assembly behaves. There are three families of fit:

- **Clearance fit**: there is always a gap, so the parts can slide or rotate. Used for running shafts, sliding parts and easy assembly.
- **Interference fit**: the shaft is always larger than the hole, so the parts must be pressed or shrunk together. Used for bushes, gears and hubs that transmit load through grip.
- **Transition fit**: depending on the actual sizes, the result may be a small clearance or a small interference. Used for accurate location where light tapping during assembly is acceptable.

The ISO system of limits and fits describes each tolerance zone with a letter and a number. The number, the **IT grade**, sets how wide the zone is; the letter sets where it sits relative to the nominal size, with capital letters for holes and lower case for shafts. In the common **hole-basis** system, the hole is usually H, starting exactly at the nominal size, and the shaft letter is chosen to give the fit required.

For example, a 25 mm H7/g6 fit is a close running clearance. The H7 hole ranges from 25.000 to 25.021 mm and the g6 shaft from 24.980 to 24.993 mm, so the clearance between any conforming hole and shaft lies between 0.007 and 0.041 mm.

| Duty | Typical hole-basis fit | Character |
|---|---|---|
| Free running with a generous oil film | H9/d9 or H8/e8 | Loose clearance |
| Precision running or sliding | H7/g6 | Close clearance |
| Location, assembled by hand | H7/h6 | Line-to-line clearance |
| Location with a light tap | H7/k6 | Transition |
| Permanent press fit | H7/p6 | Interference |

Interference fits deserve extra care: the grip that transmits load also creates stresses in both parts, and assembly may need a press, heating of the outer part or cooling of the inner one. Check the stresses and the assembly method with an engineer for anything that carries significant load. These pairings are indicative; confirm values against the standard tables for the size involved. For bearings, seals and other bought-in components, use the manufacturer's recommended shaft and housing tolerances, which reflect load, speed and mounting conditions.

## Tolerance stack-ups

When several dimensions add up to a gap, clearance or overall size, their tolerances accumulate. A **stack-up analysis** works out the range the result can take.

- **Worst-case analysis** adds the tolerances. If four dimensions in a chain each have ±0.1 mm, the result can vary by ±0.4 mm. Every conforming part combination will work, but the individual tolerances must be tight.
- **Statistical analysis**, often called root sum of squares, assumes that it is unlikely all parts will be at their extremes at once. Four ±0.1 mm tolerances combine to about ±0.2 mm. This allows looser individual tolerances, but accepts a small risk that some assemblies fall outside the limit, and it relies on stable, centred processes.

Choose the method according to the consequence of a bad assembly. Where an out-of-limit assembly would be unsafe or very costly, use worst case. Where occasional selective assembly or adjustment is acceptable and processes are well controlled, statistical analysis can be justified.

Design changes often reduce stack-ups more cheaply than tight tolerances: fewer parts in the chain, dimensions taken from a common datum rather than chained from feature to feature, adjustable features, slotted holes or shims.

## Datums and geometric tolerances

Size tolerances alone do not control everything that matters. A hole can be the right size but in the wrong place, a face can be the right thickness but not flat, and a bore can be round but tilted. **Geometric tolerances** control form, orientation, location and runout:

- **Form**: flatness, straightness, roundness and cylindricity.
- **Orientation**: perpendicularity, parallelism and angularity.
- **Location**: position, concentricity and symmetry.
- **Runout**: how much a feature wobbles when the part rotates about an axis.

Geometric tolerances refer to **datums**: the features from which a part is located and measured. A clear datum scheme on the drawing tells the manufacturer how to fixture the part and the inspector how to measure it, so both work from the same reference. A **position tolerance** for a pattern of bolt holes, measured from the datums that locate the part in its assembly, is often both more functional and less restrictive than plus or minus tolerances on each coordinate.

Geometric tolerancing is defined by the ISO geometrical product specification standards and, in North America, by ASME Y14.5. The two systems are similar but not identical, so state which applies. Use geometric tolerances where they express function better; covering every feature with them adds complexity without benefit.

## Surface finish: specify only where it pays

Surface texture is usually specified by **Ra**, the average deviation of the surface profile from its mean line, in micrometres. Typical values by process:

| Process | Typical Ra (µm) |
|---|---|
| Sawing, flame cutting | 12.5 to 25 |
| Rough turning or milling | 3.2 to 12.5 |
| Finish turning or milling, reaming | 0.8 to 3.2 |
| Grinding | 0.2 to 1.6 |
| Honing | 0.1 to 0.8 |
| Lapping and polishing | 0.025 to 0.4 |

Roughly, each halving of Ra means a slower operation or an extra one. Ra averages the profile, so two surfaces with the same Ra can behave differently if one has occasional deep scratches. For seals, fatigue-loaded fillets or plated surfaces, a peak-to-valley measure such as Rz may be specified as well.

Apply a general finish note for machined surfaces, and specify finer finishes only on surfaces where function needs them, such as bearing seats, seal faces and sliding surfaces.

## Make every tolerance manufacturable and measurable

A tolerance is only meaningful if the supplier's process can hold it and the inspector can measure it.

- **Check process capability.** Ask suppliers what their processes reliably achieve. A tolerance the process can just about hold will produce scrap, inspection and arguments. The [proving a process is ready for production](/reados/collections/product-development-and-launch/proving-a-process-is-ready-for-production/) article explains capability in more detail.
- **Check measurement.** The measuring method should resolve about a tenth of the tolerance. A tolerance of ±0.01 mm demands very different equipment from ±0.2 mm.
- **Avoid tolerances on reference dimensions** and on features defined elsewhere, which create conflicting requirements.
- **Dimension from datums**, not in chains, so tolerances do not accumulate unintentionally.
- **Talk to suppliers early.** They often know a cheaper way to achieve the same function.

## A worked example

This is an illustrative example. A machine builder buys a machined steel bearing bracket in batches of 200. The drawing carries ±0.05 mm on every dimension and a 0.8 µm finish note on all machined surfaces, both inherited from an old template. The current supplier quotes $185 per bracket and inspects every feature.

**Review by function.** The engineer identifies three functional features: the bearing bore, the two locating dowel holes and the mounting face. Everything else, including the outline, lightening pockets and clearance holes, is non-functional.

**Revised specification.**

- A general tolerance note referencing the medium class of ISO 2768 replaces ±0.05 mm for non-functional dimensions.
- The bearing bore is toleranced to the bearing manufacturer's recommended housing fit, with a cylindricity tolerance and a 1.6 µm Ra finish.
- The mounting face is made datum A, with a flatness tolerance. The dowel holes are datums B and C, with a position tolerance relative to A.
- The bore is located by a position tolerance relative to A, B and C, matching how the bracket is assembled.
- The general finish note becomes 3.2 µm Ra.

**Stack-up check.** A clearance between the bracket and an adjacent guard depends on four dimensions. With ±0.1 mm on each, worst-case variation is ±0.4 mm around a 0.6 mm nominal gap, giving a minimum of 0.2 mm, which is acceptable. If each were loosened to ±0.2 mm, the worst case could produce interference, so those four dimensions keep ±0.1 mm.

**Result.** The same supplier re-quotes at $140 per bracket, about 24% less, because most features can now be machined in one set-up at normal feeds and inspection focuses on the functional features. The first batch is inspected against the new drawing and all brackets pass.

## Applying this in an Australian business

- **Classify features** by function before tolerancing.
- **Use a general tolerance note**, ideally referencing a standard class.
- **Tolerance functional features individually**, and only those.
- **Use the ISO fit system** for mating features, and manufacturers' recommendations for bought-in components.
- **Analyse stack-ups** for critical gaps and clearances, choosing worst-case or statistical methods deliberately.
- **Define datums** and use geometric tolerances where they express function.
- **Specify surface finish** only where it pays.
- **Check capability and measurement** with suppliers before release.
- **Review old templates**, which often carry unnecessarily tight defaults.

## Where tolerancing goes wrong

- **Template tolerances** applied to every dimension.
- **Chain dimensioning** that accumulates variation.
- **No datums**, so supplier and inspector measure differently.
- **Tolerances tighter than the process** or the gauge can deliver.
- **Fine finishes on every surface.**
- **Ignoring bought-in component recommendations.**
- **Loosening tolerances** without checking stack-ups.

## Questions to ask before releasing a drawing

- Which features on this part actually interface with something?
- Is there a general tolerance note, and is it appropriate?
- Which gaps or clearances depend on several dimensions, and have we checked them?
- Are the datums the features that locate the part in its assembly?
- Which surfaces need a fine finish, and why?
- Can our supplier make and measure every tolerance we have specified?

## Bringing it together

Tolerances turn a design into a manufacturing commitment, so set them from function rather than habit. Cover non-functional features with a general tolerance note, tolerance the functional features individually, use the fit system for mating parts and follow manufacturers' recommendations for bought-in components. Analyse stack-ups where several dimensions combine, define datums that reflect how the part is assembled and use geometric tolerances where they express function. Specify surface finish only where it pays, and confirm that every tolerance can be made and measured. The result is parts that work, quote competitively and pass inspection without argument.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® engineering handbooks on tolerance specification and manufacturing cost, allowances and tolerances for fits, and surface texture. The worked example is illustrative. This article is general information; take detailed values from current standards and component manufacturers' recommendations.*
