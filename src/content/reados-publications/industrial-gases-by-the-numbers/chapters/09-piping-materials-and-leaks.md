---
book: industrial-gases-by-the-numbers
chapterSlug: piping-materials-and-leaks
order: 9
title: "Piping, materials and leaks"
description: "Choose materials for each gas, see why oxygen valves are opened slowly, calculate what a pinhole leak costs, and test piping for leaks by pressure decay."
draft: false
---

Once a workshop moves gas from cylinders beside each machine to a manifold and fixed piping, as the running case did in Chapter 8, it takes on a small gas distribution system: pipes, valves, regulators, outlets and hoses, all of which must suit the gas, hold its pressure and not leak. The early manuals dealt with the same problem on a smaller scale, warning against oil, paint and white lead on oxygen joints and against copper in acetylene lines. Their warnings still stand, and modern practice adds a few more.

This chapter covers the choice of materials for each gas, the special care oxygen needs, the heating that happens when a valve is opened quickly, how much gas a small leak loses and what it costs, and how to find leaks in a piping system. The design and installation of gas piping is work for competent people, to the supplier's instructions and the applicable standards; this chapter explains the reasons behind the rules.

## Materials for each gas

Each gas places its own demands on the materials it touches. The inert gases, argon and nitrogen, and the argon mixtures are undemanding; copper, brass, stainless steel and suitable steels all serve, with the choice set mostly by purity and cost. Carbon dioxide is undemanding when dry but forms carbonic acid with moisture, which attacks carbon steel. Oxygen and acetylene are the demanding ones, for opposite reasons.

```figure
type: compare
title: Material cautions for workshop gases
cols: Main caution | Why
caption: General cautions. The gas supplier's instructions and the applicable standards set the materials, fittings and sealants permitted for each gas.
- Oxygen | clean for oxygen service; compatible metals, seals and lubricants only | oil, grease and many plastics ignite in oxygen
- *Acetylene | no copper, no brass above 66% copper, no silver-bearing brazing alloy | explosive acetylides form
- Hydrogen | materials rated for hydrogen; leak-tight joints | small molecule leaks readily; some steels embrittle
- Carbon dioxide | keep dry; allow for cooling at high flows | wet carbon dioxide corrodes carbon steel
- Argon and nitrogen | suitable for the purity required | moisture and air must be kept out of shielding lines
```

## Copper and acetylene

The acetylene caution comes from chemistry described in Chapter 3. The NIOSH Pocket Guide warns that acetylene forms explosive acetylide compounds with copper, mercury and silver, and with brasses containing more than 66% copper. A copper pipe carrying acetylene can build up a deposit of copper acetylide on its inner surface, which can later detonate from a shock, a spark or heat. That is why acetylene piping is steel, why fittings in acetylene service are of approved alloys, and why a silver-bearing brazing alloy, the obvious choice for joining copper pipe, must never be used on an acetylene line. Gauges and regulators for acetylene are made with this in mind, which is one reason equipment is not swapped between gases.

## Clean for oxygen

Oxygen does not burn, but in high concentration and at pressure it lets almost everything else burn, including materials that would never burn in air, such as steel. Oils and greases are the worst hazard, because they ignite at relatively low temperatures in oxygen and release enough heat to ignite the metal around them. The Davis-Bournonville course of 1919 told its welders never to use oil, paint or white lead on oxygen joints, and to use shellac instead; Swingle's 1915 manual described how oil in a valve could ignite, spread to the valve's other parts and release the cylinder's oxygen into the fire.

The modern equivalents are clear. Oxygen piping, valves, regulators and fittings are cleaned for oxygen service before installation and kept clean; only lubricants, seals and thread sealants rated for oxygen are used; hands, gloves and tools that touch oxygen fittings are free of oil and grease; and equipment cleaned for oxygen is labelled and stored separately, as the workshop learned with the borrowed regulator in Chapter 5.

## Why valves are opened slowly

The second oxygen hazard is less obvious. When a cylinder valve is opened quickly onto a regulator, the high-pressure gas rushes into the small space at the regulator inlet and compresses the gas already there almost instantly. Compression that fast has no time to lose heat, and the temperature of the compressed gas rises sharply. If there is any contamination at the inlet, such as a speck of oil, a particle or a non-metallic seat, the heat can ignite it, and in oxygen the fire can spread to the regulator body.

```figure
type: formula
title: Temperature after rapid compression of oxygen, ideal gas
formula: T₂ = T₁ × (P₂ ÷ P₁) ^ ((γ − 1) ÷ γ)
caption: An idealised upper estimate, with no heat lost to the metal. Real temperatures are lower, but can still be far above the ignition temperature of oils and some plastics in oxygen.
- T₁, starting temperature | 288 K, 15 °C
- P₁ to P₂ | about 0.1 MPa to 20 MPa
- γ for oxygen | about 1.4
step: (P₂ ÷ P₁) ^ 0.286 ≈ 200 ^ 0.286 ≈ 4.54
step: T₂ ≈ 288 × 4.54 ≈ 1,310 K, about 1,040 °C
```

Real temperatures are lower, because heat flows into the metal of the fitting even in a fraction of a second, but the calculation shows why the rule exists: open oxygen cylinder valves slowly, so the downstream space fills gradually and the heat has time to escape, stand to the side of the regulator rather than in front of it, and keep the inlet clean. Regulator makers design oxygen regulators to resist this ignition, with metal inlet filters and materials chosen for oxygen, which is another reason to use only regulators rated for the gas.

## Pipes, pressure and flow

A workshop piping system carries modest flows, and the main sizing question is whether the pressure lost along the pipes leaves enough at each outlet when all the outlets are flowing. This is an illustration. The workshop's mixture manifold feeds six welding outlets, each needing up to 15 L/min, a total of about 90 L/min at the meters. At the piping pressure of 400 kPa gauge, about five times atmospheric pressure in absolute terms, the gas occupies about a fifth of its atmospheric volume, so the actual flow in the pipe is about 90 ÷ 4.95 ≈ 18 L/min. In a copper tube of about 13 mm bore, that is a velocity of only a few metres per second, and the pressure loss over the workshop's length is small. Larger systems, higher flows and oxygen service need proper calculation, and oxygen systems in particular are designed to limit gas velocity where particles could strike fittings, a requirement the applicable standards set.

## The cost of a leak

A leak that is too small to hear can still cost a great deal, because it runs continuously, day and night, whenever the line is under pressure. A steady leak of 1 L/min loses 1 × 60 × 24 × 365 ≈ **525,600 L**, about **526 m³**, in a year.

```figure
type: formula
title: Annual loss and cost of a continuous leak
formula: loss per year = leak rate × minutes in a year
caption: This is an illustration, excluding GST, at an illustrative A$9.00 per cubic metre for the argon mixture. A line depressurised outside working hours loses far less.
- Leak rate | 1 L/min
- Minutes in a year | 525,600
step: loss ≈ 525,600 L ≈ 526 m³ a year
step: cost ≈ 526 × 9.00 ≈ A$4,730 a year
step: at a working-hours-only pressure of about 2,000 hours a year: 120 m³, about A$1,080
```

How large a hole makes a 1 L/min leak? For a small hole with gas at a few hundred kilopascals, the flow is choked, limited by the speed of sound in the hole, and proportional to the hole's area and the absolute upstream pressure. A calculation with the standard choked-flow formula for argon at 400 kPa gauge and 15 °C, taking a discharge coefficient of about 0.6, gives about 0.25 L/min through a hole of 0.1 mm diameter, about **1.0 L/min** through 0.2 mm and about 6 L/min through 0.5 mm. A pinhole too small to see, in a fitting or a cracked hose, can therefore cost thousands of dollars a year.

```figure
type: bars
title: Annual gas lost through a hole in a line at 400 kPa gauge, pressurised all year
unit: m³ of argon a year
max: 3500
caption: This is an illustration from the choked-flow formula for argon at 15 °C with a discharge coefficient of 0.6. Real leaks are cracks and imperfect seals rather than round holes, but the scale is similar.
- 0.1 mm hole | 131
- *0.2 mm hole | 523
- 0.5 mm hole | 3269
```

## Turning the system off

The simplest leak control is to remove the pressure when nobody is working. A manifold isolated at the end of each shift, or a solenoid valve that shuts the supply outside working hours, cuts the hours a leak can run from 8,760 a year to the 2,000 or so the workshop is open, which cuts the loss from every leak by more than three-quarters. Cylinders at individual machines can be closed at the valve at the end of each day for the same reason. The workshop now closes its manifold at the end of each shift and its individual cylinders at each machine, a habit that costs nothing.

## Finding leaks

Leaks are found in three main ways. A leak detection solution, brushed or sprayed on joints, bubbles at a leak; solutions made for the purpose are used rather than household detergent, which can contain substances unsuitable for oxygen fittings. Ultrasonic leak detectors pick up the high-frequency hiss of gas escaping through a small hole, even in a noisy workshop, and suit long piping runs. And a pressure decay test shows whether a whole isolated system is tight, without finding where the leak is.

## The pressure decay test

In a pressure decay test, a section of piping is pressurised, isolated from its supply and from all outlets, and its pressure watched over a period. If the pressure falls, gas is leaving. The volume of gas lost follows from the system's internal volume and the fall in pressure.

This is an illustration. The workshop's new mixture piping, about 60 m of tube of 13.4 mm bore plus the manifold header, has an internal volume of about **10 L**. Isolated at 400 kPa gauge at the end of a shift, its pressure fell to zero within about 2 hours. The gas lost was about 10 × 400 ÷ 101.3 ≈ 39.5 L at atmospheric pressure, about **0.33 L/min** on average over the 2 hours, and higher at first, when the pressure was highest. That leak, running through every working hour, would have lost about 40 m³ a year; pressurised all year, about 170 m³. The installer traced it to an outlet fitting that had not been fully tightened, and a repeat test held its pressure overnight.

## Commissioning new piping

New piping is not ready for use when the last joint is made. It is full of air, it may hold swarf, flux residue and moisture from installation, and its joints are untested. Commissioning, by the installer, normally follows a fixed order: a strength and leak test at the pressure the installation instructions require, with the test medium they specify; purging with the gas to be carried, or with a dry inert gas, until the air and moisture are swept out, using the volume-change reasoning of Chapter 7; for oxygen, confirmation that the system was cleaned for oxygen service and has not been contaminated since; and finally labelling, a record of the tests and handover of the drawing. The workshop's installer purged the new mixture piping with the mixture itself, at each outlet in turn from the nearest to the furthest, and the first welds made through it were checked for porosity before the bays went back into production. The test record went into the gas plan with the drawing, so that the next person to work on the system knows what was tested and when.

## Hoses

Hoses are the weakest part of most gas systems. They are dragged, kinked, run over, scorched by spatter and cut by sharp edges, and they age, harden and crack. Oxy-fuel hoses are colour-coded by gas, and the hoses, fittings and flashback arrestors used with oxy-fuel equipment are covered by AS 4839 for portable and mobile oxy-fuel systems; Oxy-Fuel by the Numbers covers [backfire, flashback and the safety chain](/reados/publications/oxy-fuel-by-the-numbers/backfire-flashback-and-the-safety-chain/). Shielding gas hoses should be of materials suited to shielding gas, as the porous mornings in Chapter 4 showed, and no longer than needed. Every hose is inspected before use and replaced, not taped, when it is damaged.

## Labelling and identification

A gas system needs to be readable by anyone who works on it. Pipes are labelled with the gas they carry and its direction of flow; outlets are marked with their gas; isolation valves are labelled and accessible; and the piping drawing, showing the manifold, pipes, valves and outlets, is kept with the gas plan. Cylinder labels and colours identify the contents, and AS 4484 deals with gas cylinder labelling and colour coding; the label, not the colour alone, is the authority on what a cylinder contains.

## A failure: the copper tee

This is an illustration. During the installation of the new piping, a contractor proposed running a short branch from the acetylene manifold to a new heating bay in copper tube, brazed with a silver-bearing alloy, because that was what was on the van and the branch was only a few metres long.

The workshop's manager, who had read the supplier's installation instructions, stopped the work. Copper and silver-bearing alloys are both prohibited in acetylene service because of the acetylide risk described in this chapter and in Chapter 3. The branch was installed in steel pipe with fittings approved for acetylene, and the contractor's own procedures were updated to make the restriction explicit. The near miss is a reminder that the rules for one gas cannot be assumed to apply to another, and that the person installing gas piping must know the gas.

## Exercise: one leak, two schedules

A cracked hose fitting on an argon line leaks about 0.5 L/min at the line pressure. Calculate the gas lost in a year if the line stays pressurised all year, and if it is isolated outside a working year of about 2,000 hours. Find the cost of each at an illustrative A$11.00 per cubic metre, excluding GST.

Pressurised all year, the leak loses about 0.5 × 525,600 ≈ 262,800 L, about **263 m³**, costing about 263 × 11.00 ≈ **A$2,890**. Isolated outside working hours, it loses about 0.5 × 60 × 2,000 = 60,000 L, about **60 m³**, costing about **A$660**.

Isolation saves about A$2,230 a year from one leak, but it does not remove the leak, which still costs A$660 a year and lets air and moisture into the line when the pressure is off. The full answer is both: isolate the line out of hours and fix the fitting.
