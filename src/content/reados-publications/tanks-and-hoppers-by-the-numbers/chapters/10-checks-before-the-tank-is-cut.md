---
book: tanks-and-hoppers-by-the-numbers
chapterSlug: checks-before-the-tank-is-cut
order: 10
title: "Checks before the tank is cut"
description: "Check a tank's calculations before cutting: the calculation sheet, independent checks, tolerance effects on capacity, the water fill and head, and catch a hopper's patterns mirrored front to back."
draft: false
---

Every chapter of this book has ended an error case with a check that would have caught it: gross against working, the box around a cylinder, the bounds on a frustum, the mid-section's dimensions, a water fill, a load case table, the mean circumference, the joint a pattern belongs to, a true length on the drawing. A tank job that passes all of them before the first sheet is cut is unlikely to surprise anyone in the workshop. One that skips them will find its errors in the order the parts are made, which is the most expensive order.

This chapter gathers the book's checks into a routine. It covers the calculation sheet that records them, the independent check by a second person, the effect of fabrication tolerances on capacity, the water fill and the pressure of its head, and the record that goes with the finished tank. The running case finds HP-420's wall patterns mirrored front to back, which the routine caught at the cutting stage rather than at assembly.

## The calculation sheet

Every tank and hopper job should have one calculation sheet, kept with the drawings, that records each number the drawing relies on, how it was found and from what. For TK-1 the sheet has seven short sections:

- **Dimensions**: internal diameter, shell height, cone depth, outlet, wall thickness, all from the drawing's revision.
- **Capacities**: gross, working and usable, with the levels that define them, as Chapter 1 required.
- **Level table**: the calibration points of Chapter 5.
- **Masses and load cases**: Chapter 6's table, with densities.
- **Sheet and welds**: areas, blanks, nesting, weld lengths, Chapter 7.
- **Patterns**: every pattern's radii, angles, true lengths and check dimensions, Chapters 8 and 9.
- **Checks**: who checked which section, and when.

A calculation sheet has two virtues beyond accuracy. It can be checked by someone who did not do the work, and it can be rerun when the drawing changes, which a set of numbers on scraps of paper cannot.

## Independent checks

The most effective check is a second person recalculating the key numbers by a different route. Recalculating by the same spreadsheet repeats the same mistakes; a different route catches them.

```figure
type: checklist
title: Independent checks for TK-1 and its hoppers
caption: This is an illustration. Each check uses a different route from the original calculation, so that it can catch an error rather than repeat it.
- Gross capacity | Enclosing box × π ÷ 4 for the shell; frustum bounds for the cone
- Hopper volumes | Prismoidal formula from mid-height dimensions; CAD volume of the internal surface
- Level table | Litres per mm in the shell; volume at half the cone's depth about 16% of the cone
- Masses | Weighed mass of a similar tank; net sheet area × thickness × density
- Shell blank | π × mean diameter; circumference tape on a test roll
- Cone pattern | Outer arc = top circumference; chord across the gap
- Hopper walls | Hip true length from plan offsets and rise, against the wall pattern's sloping sides
- x Same spreadsheet rerun by the same person | Repeats its errors
- ? Bulk solids flow at the wall and hip slopes | For a specialist, not for geometry
```

## The error: HP-420's walls mirrored

This is an illustration. HP-420, the offset hopper of Chapter 9, had its four wall patterns programmed for the cutter from the calculation sheet. The programmer, working from a plan view drawn looking up from below, placed the outlet offset towards the front instead of the back. The front and back walls' patterns were swapped, and the two side walls were mirror images of what they should have been.

The routine caught it at the cutting stage. The checker's step for hopper walls was to measure one hip on each cut wall against the calculation sheet's true length before the walls left the cutter. The front hips were supposed to be 1,131.9 mm and measured 990.6 mm, exactly the back hips' length, the signature of a mirrored offset that Chapter 9's exercise had worked out. The four walls were recut the right way round before any bending or welding, at the cost of the sheet and an hour of cutting, rather than at assembly, where the walls would not have closed and the error would have taken longer to diagnose.

The fix in the process was to state the view direction on every pattern drawing and to give each pattern a mark that reads correctly only from the face that ends up inside the hopper, so that a mirrored pattern cannot be cut unnoticed.

## Checking parts against each other

Some of the strongest checks compare two parts that must fit, because their numbers were calculated separately and must agree.

- **Shell blank and cone pattern**: the shell's blank length and the cone pattern's outer arc are both the circumference of the joint between them, 3,779 mm at TK-1's mean diameter for a butt joint. If they differ, one of them was developed at the wrong diameter, which is the error of Chapters 7 and 8.
- **Cone outlet and nozzle**: the cone pattern's inner arc, 324 mm at mid-thickness, must match the outlet nozzle's circumference at the same surface.
- **Hopper hips**: each hip is shared by two walls, so the sloping sides of adjacent wall patterns must be equal. On HP-400 all eight are 1,044.6 mm; on HP-420, the two sides of each front hip are 1,131.9 mm and of each back hip 990.6 mm.
- **Transition and hopper outlet**: TR-405's 250 mm square must match HP-400's 250 mm outlet at the same surface, inside to inside or outside to outside, according to the joint.

A mismatch in any of these is found in seconds on the calculation sheet and in hours at fit-up.

## When the drawing changes

Drawings change, and each change ripples through the calculations. The calculation sheet should be rerun for every revision, and it helps to know which sections each kind of change affects.

```figure
type: compare
title: Which calculations a change to TK-1 affects
cols: Capacities and levels | Masses and loads | Sheet and patterns
caption: This is an illustration. A change that looks local, such as a different outlet valve, reaches three sections of the calculation sheet.
- Internal diameter | Every capacity and the level table | Every case | Shell blank, cone pattern, lid
- Shell height | Gross and freeboard; working if defined from the outlet | Every case | Shell blank width
- *Outlet size | Cone volume, every capacity, the cone's level table | Small change | Cone pattern inner radius and angle
- Cone depth | Every capacity and the cone's level table | Every case | Cone pattern, overall height
- Joint detail | None | None | Pattern diameters at that joint
- Product density | None | Operating and overfilled cases | None
```

Chapter 3 found that changing TK-1's outlet from 100 to 200 mm would add about 16 L to the cone. That one change alters the capacity block, the level table through the cone, the cone pattern's inner radius and sector, and every load case slightly. Treating it as a change to the nozzle alone is how the capacity block and the level table drift away from the tank that was built.

## Units and revisions on every number

Two small habits prevent many errors. Every number on the calculation sheet carries its unit, written beside it, not in a column heading three screens away. And every section of the sheet records the drawing revision it was calculated from, so that a checker can see at once whether the sheet is current. A capacity calculated from revision B of the drawing and a pattern from revision C are a mismatch waiting to happen, and the revision stamp makes it visible.

## Tolerances and capacity

Fabricated tanks are made to tolerances, and the tolerances move the capacity. A diameter error changes the volume by about twice its percentage, because the area goes as the diameter squared; a height error changes it in proportion.

This is an illustration. If TK-1's internal diameter is held to ±3 mm and its shell height to ±5 mm, its gross capacity ranges from about **1,847 L**, with both at their minimum, to about **1,875 L**, with both at their maximum, around the nominal 1,861 L: a range of about ±0.8%. Each millimetre of diameter is worth about 0.17% of the shell's volume and each millimetre of shell height about 0.06% of the tank's.

```figure
type: range
title: TK-1's gross capacity across its fabrication tolerances
min: 1830
max: 1890
unit: L
ticks: 1830 | 1845 | 1860 | 1875 | 1890
caption: This is an illustration with the internal diameter at 1,200 ± 3 mm and the shell at 1,500 ± 5 mm. The cone's volume is held at its nominal figure.
- Gross capacity range | 1846.8 | 1875.0
- *Nominal | 1860.9 | 1860.9
```

For most tanks the range is unimportant, but it matters when a capacity is guaranteed close to its calculated value, as TK-1's working capacity was after the shortfall of Chapter 1, or when a level table is used for accounting. In those cases the water fill, not the calculation, is the final word.

This is an illustration. TK-1's water fill measured a gross capacity of **1,866 L**, 5 L above the calculation and well inside the tolerance range. A circumference tape had already shown the shell's inside diameter at about 1,200.6 mm, which accounts for roughly 2 L of the difference; the rest is within the meter's accuracy and the reading of the level at the brim. The measured figure went on the capacity block beside the calculated one, and the level table was adjusted to the fill's readings, which differed from the calculated table by no more than 3 L at any point. Had the fill differed by 30 L, the cause would have been looked for before the tank was released, starting with the cone's depth, which is the dimension hardest to hold when rolling.

## The water fill and its head

The water fill of Chapters 1 and 5 does three jobs at once: it measures the capacity, it calibrates the level table and it tests the tank for leaks. Two numbers help plan it.

- **Time**: at a fill rate of 30 L per minute, TK-1's 1,861 L takes about **62 minutes**. A fill in measured steps, recording the level at each, takes longer, and the plan should allow for it.
- **Head**: full to the brim, the water at TK-1's outlet is 1.9 m deep and exerts a pressure of about ρ × g × h = 1,000 × 9.81 × 1.9 = **18.6 kPa** above atmospheric. With product of 1,050 kg/m³, the head at the outlet is about 19.6 kPa. The outlet valve, its gasket and the cone's welds all see this pressure.

These pressures are small, but they are what the bottom of the tank sees every day, and a tank intended to be pressurised, or to hold a liquid under a blanket of gas, is a pressure vessel subject to AS 1210 and to registration and inspection requirements that a water fill does not satisfy. Whether a tank falls within those requirements is for its designer and the relevant regulator to decide.

## What goes with the tank

When TK-1 leaves the workshop, a short record goes with it:

- the **capacity block**, with the water fill's measured gross capacity beside the calculated one;
- the **level table**, from the water fill;
- the **load case table**, with the weighed empty mass of Chapter 6;
- the **materials** and their certificates;
- the **test record**: the water fill's date, duration and result.

The record makes the tank's numbers usable by whoever installs and operates it, and it answers in advance the questions that would otherwise come back to the fabricator months later.

## TK-1 in numbers

The running case's tank, as built and checked, can be summarised in a handful of figures, each traceable to a chapter of this book and to a line on the calculation sheet.

```figure
type: stats
title: TK-1 as released
caption: This is an illustration. Every figure is calculated in this book and confirmed by the water fill or the weighing before release.
- 1,861 L | Gross capacity | Chapter 1; water fill within tolerance
- * 1,691 L | Working capacity | To 150 mm below the top of the shell
- 226 kg | Empty mass, weighed | Chapter 6; 2,180 kg overfilled with product
- 291.14° | Cone pattern sector | Chapter 8; 743.8 mm outer radius
```

## Who checks what

On a small job, one person may design, draw and calculate a tank, and the independent check is the only time a second mind looks at the numbers. It works best when the checker is given the drawing and the specification, not the calculation sheet, recalculates the key figures their own way, and only then compares them with the sheet. A checker who starts from the sheet tends to follow its reasoning and its mistakes. The fabricator in the running case keeps the check short: capacities, one pattern per type, one true length per hopper and the load case table. Those four cover the errors that this book's chapters found, and they take less than an hour for a job of TK-1's size.

## A final word on scope

The calculations in this book are geometric. They tell a fabricator what a tank holds, weighs and needs, and how to cut it. They do not tell anyone whether its walls are thick enough, its supports strong enough or its hopper steep enough for a particular powder. Those are design decisions for engineers working to the standards that apply: AS 1692 for steel tanks holding flammable and combustible liquids, AS 1210 for pressure vessels, the AS/NZS 1170 series for structural actions and the work health and safety regulations for the plant itself. The geometry's value is that it gives those decisions accurate numbers to start from.

## Exercise: the working capacity's tolerance

Using the same tolerances, ±3 mm on TK-1's internal diameter and ±5 mm on the shell height, what range does the working capacity take, if the maximum operating level stays 150 mm below whatever height the top of the shell turns out to be? Why does the shell height tolerance not matter here?

**Worked answer.** The working level is 1,350 mm up the shell however tall the shell is, because it is defined from the top. So only the diameter tolerance matters. At 1,197 mm, the working capacity is π × 1.197² ÷ 4 × 1.35 + 0.1644 = about **1,684 L**; at 1,203 mm, about **1,699 L**; nominally 1,691 L.

The shell height tolerance moves the top of the shell and the maximum level together, so it changes the freeboard volume, not the working volume. Had the working level been defined as a fixed height above the outlet instead, the height tolerance would change the freeboard instead, and a short shell could leave less than the 150 mm of freeboard the process needs. How a level is defined decides which tolerance it inherits, which is one more reason to state the definition in the capacity block.
