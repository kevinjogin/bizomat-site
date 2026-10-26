---
book: tanks-and-hoppers-by-the-numbers
chapterSlug: mass-loads-and-supports
order: 6
title: "Mass, loads and supports"
description: "Estimate a tank's empty and full mass, list every load case including the hydrostatic test and an overfill, share loads between legs and load cells, and catch a floor checked 14% light."
draft: false
---

A tank that holds 1,861 litres weighs about two tonnes when it is full, and something has to carry that: legs, a frame, a mezzanine floor, a slab, hold-down bolts. The mass is easy to estimate from the geometry of the earlier chapters and the densities of the steel and the contents. The common mistakes are not in the arithmetic but in the choice of what to add up: which capacity, which contents, which load case, and how evenly the legs share it.

This chapter estimates TK-1's empty mass from its sheet areas, adds the contents for each load case, and shares the result between its legs; it then estimates HP-400's load on its load cells. The running case finds that the mezzanine floor under TK-1 had been checked for 1,908 kg when the worst case was 2,171 kg. The structural design of legs, frames and floors is an engineering task beyond this book; the purpose here is to get the loads that design starts from right.

## Empty mass from sheet area

The empty mass of a sheet metal tank is its sheet area times its thickness times the density of the steel, plus legs, nozzles, lugs and fittings. The areas come from the same geometry as the volumes.

This is an illustration. TK-1 is made from 3 mm austenitic stainless sheet, taken here as 7,900 kg/m³, a typical figure for that family of steels; the mill certificate or the supplier's data gives the figure for a particular grade.

- **Shell**: a cylinder 1,500 mm high at the mid-wall diameter of 1,203 mm has an area of π × 1.203 × 1.5 = 5.669 m², so a mass of 5.669 × 0.003 × 7,900 = **134.4 kg**.
- **Cone**: a frustum's curved area is π × (R + r) × s, where s is the slant height. TK-1's cone has s = √(0.55² + 0.4²) = 0.680 m and an area of π × 0.65 × 0.680 = 1.389 m², so **32.9 kg**.
- **Lid**: a flat 1,200 mm disc, 1.131 m², **26.8 kg**.
- **Legs**: four stainless hollow-section legs, 750 mm long at 4.4 kg/m in this illustration, **13.2 kg**.
- **Nozzles, lugs and fittings**: an allowance of **10 kg**.

The total is about **217 kg** empty.

```figure
type: stack
title: TK-1's empty mass by part
unit: kg
caption: This is an illustration for 3 mm stainless sheet at 7,900 kg/m³. The shell is well over half the tank's empty mass.
- Shell | 134.4
- Cone | 32.9
- Lid | 26.8
- Legs | 13.2
- Nozzles and fittings | 10
```

## Contents

The contents' mass is volume times density, and both depend on the load case. The product in TK-1 is taken here as 1,050 kg/m³, a little denser than water. Water for the hydrostatic test is 1,000 kg/m³. Bulk solids are described by a **bulk density**, the mass of a volume of loose material including the air between its particles, which varies with how the material is filled and settles; HP-400's powder is taken here as 600 kg/m³.

## Load cases

A tank's supports must carry every load the tank will see, and the largest is not always the obvious one. For TK-1:

- **Empty**: 217 kg.
- **Operating**: full to the working level of 1,691 L with product, 217 + 1.6912 × 1,050 = about **1,993 kg**.
- **Hydrostatic test**: full to the brim with water, 1,861 L, 217 + 1,861 = about **2,078 kg**.
- **Overfilled**: full to the brim with product, as happens if the high-level alarm fails, 217 + 1.8609 × 1,050 = about **2,171 kg**.

```figure
type: compare
title: TK-1's load cases
cols: Total mass | Total load | Per leg, four sharing | Per leg, three sharing
caption: This is an illustration at g = 9.81 m/s². The overfilled case with product is the largest; a rocking tank on an uneven floor can put most of the load on three legs.
- Empty | 217 kg | 2.13 kN | 0.53 kN | 0.71 kN
- Operating, working level | 1,993 kg | 19.55 kN | 4.89 kN | 6.52 kN
- Hydrostatic test, water to brim | 2,078 kg | 20.39 kN | 5.10 kN | 6.80 kN
- *Overfilled, product to brim | 2,171 kg | 21.30 kN | 5.32 kN | 7.10 kN
```

## The error: a floor checked 14% light

This is an illustration. TK-1 was to stand on an existing mezzanine. The processor's engineer asked the fabricator for the tank's full weight so that the floor's capacity could be checked. The fabricator's drafter sent "1,908 kg full": the empty 217 kg plus the 1,691 L working capacity at 1 kg per litre.

The figure was wrong twice. It used the working capacity, not the brim, and water's density, not the product's. The worst case, overfilled with product, is about 2,171 kg, **263 kg or about 14% more** than the figure sent. The engineer, checking the load cases as a matter of habit, noticed that the figure did not mention the hydrostatic test, asked for the load case table, and rechecked the floor at 2,171 kg. It was adequate, with less margin than the first check had suggested.

The fix in the fabricator's practice was to answer every request for "full weight" with a load case table, not a single number, stating the contents, density and level for each case. A single number invites the reader to assume the case they had in mind.

## Sharing between legs

A tank on four legs does not necessarily put a quarter of its weight on each. On a rigid, perfectly flat floor with legs of exactly equal length it does. On a real floor, one leg is usually a little short, and a stiff tank rocks onto three legs, two of which then carry most of the load and the third the rest. The usual practice is to design each leg and its fixing for a share larger than a quarter, and to shim or adjust the legs at installation so that all four bear. For TK-1, a quarter of the overfilled load is 5.32 kN; if three legs share it, each carries about 7.10 kN.

Levelling feet, which let each leg be adjusted after installation, are the practical answer for small tanks. For larger tanks on rings or skirts, the support is continuous and the question becomes the bearing pressure under the ring.

## Bearing pressure

Each leg's load spreads into the floor through its base plate, and the pressure under the plate is the load divided by its area. This is an illustration. A 150 × 150 mm base plate under TK-1's most heavily loaded leg, at 7.10 kN, gives a bearing pressure of 7,100 ÷ 0.0225 = about **316 kPa** on the floor surface. Whether a slab, a mezzanine deck or a timber floor can take that, and the anchor or fixing, is for the floor's engineer to confirm; the point here is that a small base plate concentrates a modest load into a high local pressure, and the fabricator should state the plate size with the leg loads.

## HP-400 on load cells

Hoppers of bulk solid are often weighed rather than level-measured, as Chapter 5 noted, by standing them on load cells. The load cells carry the hopper's own mass, the frame or brackets between hopper and cells, and the contents.

This is an illustration. HP-400's four walls are trapezoids, each with parallel sides of 1,000 and 250 mm and a slant height of √(0.9² + 0.375²) = 0.975 m, so 0.609 m² each and 2.438 m² together; the upstand adds 1.2 m². In 3 mm stainless at 7,900 kg/m³, the 3.638 m² of sheet weighs about **86 kg**. With 40 kg of brackets and the powder level full at 0.694 m³ × 600 kg/m³ = **416 kg**, the hopper puts about 542 kg on its load cells. Shared between three cells, that is about 181 kg, or 1.77 kN, each.

```figure
type: bars
title: HP-400's mass on its load cells, by contents
unit: kg
max: 650
caption: This is an illustration with a bulk density of 600 kg/m³. Heaped filling adds about 70 kg of powder to the level-full figure.
- Empty, hopper and brackets | 126
- Level full | 542
- *Heaped full | 612
```

Load cells should be sized for the largest load, including heaped filling and any impact from material falling into the hopper, with a margin the load cell supplier recommends. The weighing resolution is a separate question: a cell sized for 600 kg will not resolve a few grams of powder, and a process that doses small amounts by loss in weight needs cells chosen for that.

## Dynamic and environmental loads

Static masses are the start of a support design, not the end. Liquid sloshing in a moving or agitated tank, powder discharging from a hopper, wind on an outdoor tank, earthquake loads and the forces from connected pipework all add to the static loads, and the Australian Standards for structural actions, the AS/NZS 1170 series including AS/NZS 1170.2 for wind, and AS 1170.4 for earthquake, govern how they are combined. Those calculations belong to a structural engineer. The geometry's part is to supply accurate masses and centres of mass for each load case.

## Centre of mass

A tank's centre of mass matters for lifting and for overturning. For TK-1 empty, most of the mass is in the shell, and the centre of mass is near the shell's mid-height. Full, the contents dominate, and the centre of mass moves to near the centre of the liquid. For lifting, the empty centre of mass sets where the lugs go; for an outdoor tank in wind, the full and empty cases both matter, because an empty tank is lighter and easier to overturn. Each component's mass times the height of its own centre, summed and divided by the total mass, gives the overall centre of mass, and a spreadsheet with one row per component does it in minutes.

## Lifting the empty tank

TK-1 is lifted into place empty, on two lugs at the top of the shell, by a sling from a single hook. The load in each sling leg is not half the weight but more, because the legs pull at an angle. With the tank's 217 kg, 2.13 kN, shared between two legs at an angle θ from the horizontal, each leg carries the weight divided by 2 × sin θ.

This is an illustration. At 60° from the horizontal, each sling leg and each lug carries 2.13 ÷ (2 × 0.866) = about **1.23 kN**. At 30°, it carries 2.13 ÷ (2 × 0.5) = about **2.13 kN**, the whole weight on each lug. Flatter slings load the lugs harder and pull them inwards, which is why lifting plans specify a minimum sling angle. A tank must never be lifted with contents unless its lugs and shell were designed for it, because the full mass is ten times the empty mass. Lifting gear, plans and competency are governed by work health and safety law, and the lifting plan should be prepared by someone competent to do so.

## Checking the estimate by weighing

An empty-mass estimate should be checked when the tank is finished, by weighing it on a crane scale or a platform scale. This is an illustration. TK-1 weighed **226 kg** on the fabricator's crane scale, about 4% more than the 217 kg estimate. The difference was traced to the sheet: the 3 mm stainless supplied measured about 3.1 mm, within its tolerance, and the weld metal, which the estimate ignored, added a few kilograms more. A difference of a few per cent is normal; one of 20% means a component was missed or the wrong thickness used, and should be found before the load case table is sent. The fabricator updated TK-1's load case table with the weighed 226 kg, which raises every case by 9 kg; the overfilled case becomes about 2,180 kg, still within the floor check made at 2,171 kg plus that check's own margin, but the table should carry the weighed figure from then on, with a note saying it was weighed, on which scale and when.

## Partly filled masses

The calibration table of Chapter 5 converts directly to mass. At a level of 1,000 mm, TK-1 holds about 843 L, which with product at 1,050 kg/m³ is about **885 kg** of contents. A processor that tracks inventory by mass can apply the density to every line of the level table and print a second column, provided the density is right for the product's temperature, as Chapter 5 showed it changes.

## Exercise: a heavier product

The processor proposes a syrup with a density of 1,330 kg/m³ for TK-1. Recalculate the operating and overfilled masses and the load per leg with four and with three legs sharing. Which load case now governs, and by how much does it exceed the hydrostatic test?

**Worked answer.** Operating: 217 + 1.6912 × 1,330 = about **2,466 kg**, 24.19 kN. Overfilled: 217 + 1.8609 × 1,330 = about **2,692 kg**, 26.41 kN, so **6.60 kN** per leg with four sharing and **8.80 kN** with three.

The overfilled case still governs, and it now exceeds the hydrostatic test's 2,078 kg by about **614 kg**, nearly 30%. That matters for more than the legs: a tank tested only with water has never carried its worst operating load, so the floor, legs and shell should be checked for the syrup case explicitly. The heavier liquid also raises the pressure at the bottom of the shell, which affects the shell's thickness, a question for the tank's designer.
