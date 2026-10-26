---
book: tanks-and-hoppers-by-the-numbers
chapterSlug: prisms-and-cylinders
order: 2
title: "Prisms and cylinders"
description: "Calculate rectangular, cylindrical and elliptical tanks, find the height for a given capacity, allow for a sloping floor, compare sheet used per litre, and catch a cylinder four times too big."
draft: false
---

Most tanks are built from prisms and cylinders: a shape of constant cross-section extended through a height or a length. Their volume is the area of the cross-section times the length, which makes them the easiest tanks to calculate and the easiest to get wrong, because the cross-section's area is where every radius-for-diameter and axis-for-semi-axis error hides. Once the area is right, everything else in this chapter follows: the height for a given capacity, the litres per millimetre of level, and a fair comparison between a round tank and a square one.

This chapter covers rectangular tanks, vertical and horizontal cylinders, elliptical and oval sections, sloping floors, and the comparison of shapes by the sheet they use. The running case compares TK-1 with a rectangular tank of the same working capacity, and finds a cylinder calculated four times too large.

## The prism rule

For any prism or cylinder, whatever the shape of its cross-section:

- **volume = cross-sectional area × length**, where the length is measured perpendicular to the section.

For a vertical tank, the length is the liquid height; for a horizontal one, it is the tank's length along its axis. The rule holds for squares, rectangles, circles, ellipses, hexagons and any other constant section, so the work is all in the area.

```figure
type: compare
title: Cross-sectional areas for common tank sections
cols: Area | Watch for
caption: Use internal dimensions. Every one of these is a common source of a factor of two or four.
- Rectangle a × b | a × b | Internal dimensions, not outside
- *Circle, diameter d | π × d² ÷ 4, or π × r² | Using d where r belongs gives four times the area
- Ellipse, axes A and B | π × A × B ÷ 4, or π × a × b with semi-axes | Using full axes in π × a × b gives four times the area
- Regular hexagon, side s | about 2.598 × s² | Across-flats and across-corners dimensions differ
- Oval, two semicircles of diameter w and a straight part l | π × w² ÷ 4 + w × l | The straight part is the length between centres
```

## Rectangular tanks

A rectangular tank's volume is its internal length times width times liquid height. It is simple to build in flat plate, easy to fit against a wall or into a frame, and easy to calculate. Its weakness is structural: flat sides bulge under the liquid's pressure and need stiffeners or thicker plate, which is why large rectangular tanks have external frames and round ones often do not.

This is an illustration. The processor's first sketch for TK-1 was a rectangular tank to fit a 1,000 × 1,200 mm space, holding 1,800 L working with 150 mm freeboard. The liquid height is 1.800 ÷ (1.0 × 1.2) = **1.500 m**, so the tank is **1,650 mm** tall. Each millimetre of level holds 1.0 × 1.2 × 0.001 m³ = **1.2 L**, a figure that makes the level gauge easy to mark.

## Vertical cylinders

A vertical cylinder's volume is π × r² × h. For TK-1, with a 600 mm internal radius, each metre of height holds π × 0.6² = **1.1310 m³**, and each millimetre about **1.131 L**.

The height for a required capacity is the capacity divided by the cross-sectional area. A flat-bottomed cylinder of 1,200 mm diameter holding 1,800 L working needs a liquid height of 1.800 ÷ 1.1310 = **1.5915 m**, and with 150 mm freeboard stands **1,742 mm** tall. TK-1's cone bottom, which Chapter 3 calculates, lets the same capacity fit in a shorter shell, because the cone holds 164 L below the shell.

```figure
type: formula
title: Height of a vertical tank for a required capacity
formula: liquid height = required volume ÷ cross-sectional area;  tank height = liquid height + freeboard
caption: This is an illustration for a flat-bottomed 1,200 mm cylinder holding 1,800 L working with 150 mm freeboard.
- required volume | 1.800 m³ working
- cross-sectional area | π × 0.6² = 1.1310 m²
- freeboard | 0.150 m
step: Liquid height = 1.800 ÷ 1.1310 = 1.5915 m
step: Tank height = 1.5915 + 0.150 = 1.742 m
step: Level sensitivity = 1.1310 m² × 1 mm = 1.131 L per mm
```

## The error: a cylinder four times too big

This is an illustration. Before TK-1's drawing was started, an estimator priced a flat-bottomed alternative from a spreadsheet. The spreadsheet's volume formula was π × d² × h, with the 1.2 m diameter where the radius belonged, or the division by four left out. For a 1.5 m shell it gave π × 1.44 × 1.5 = **6.786 m³**, four times the true 1.696 m³. The estimator, expecting about 1.7 m³, noticed that the tank "held" 6,786 L.

A quick check would have caught it in seconds. A cylinder fills π ÷ 4, about 78.5%, of the square box that encloses it. The box around TK-1's shell is 1.2 × 1.2 × 1.5 = 2.16 m³, and 78.5% of that is **1.696 m³**. A cylinder's volume can never exceed its enclosing box, so a calculation that gives 6.786 m³ for a shape that fits in a 2.16 m³ box is wrong by inspection. The spreadsheet was corrected to π × d² ÷ 4 × h and its formula cell labelled with the formula in words, so that the next person could see what it computed.

## Diameter for a height limit

Sometimes the height is fixed and the diameter is the unknown: a tank must fit under a mezzanine, or beside a machine of known height. The diameter follows from the same rule, rearranged: d = √(4V ÷ (π × h)), with h the liquid height.

This is an illustration. If TK-1's flat-bottomed alternative could be no taller than 1,500 mm, the liquid height with 150 mm freeboard would be 1.35 m, and the diameter for 1,800 L working would be √(4 × 1.8 ÷ (π × 1.35)) = **1.303 m**. The fabricator would round up to a diameter its rolls and its stock sheet width suit, such as 1,300 or 1,350 mm, and recheck the capacity at the rounded size, because rounding down 3 mm loses about 8 L here, and rounding to the nearest standard size can lose more.

## Deducting internals

Anything inside a tank displaces liquid: agitator shafts, heating or cooling coils, baffles, dip pipes, level probes. Most are small and many designers ignore them, but a tank with a long coil can lose a measurable volume, and the capacity block should say whether internals were deducted.

This is an illustration. A heating coil of 25 mm outside diameter tube, 12 m long, displaces π ÷ 4 × 0.025² × 12 = about **5.9 L**. An agitator shaft of 50 mm diameter immersed 1.6 m displaces about **3.1 L**. Together they are about half a percent of TK-1's working capacity: small, but larger than the rounding in the capacity block, and worth stating if the capacity is guaranteed.

## Horizontal cylinders

A horizontal cylinder's full volume is the same π × r² × L, with L the length along the axis. Horizontal tanks are common for fuel, water on trailers and anywhere height is limited. Their difficulty is that the volume is not proportional to the level: the tank is narrow at the bottom, widest at the middle and narrow again at the top, so a level gauge marked in equal steps of litres has unequal steps of height. Chapter 5 calculates the partly filled volume, which is a circular segment times the length.

Their ends add volume. A horizontal tank with flat ends holds π × r² × L; one with dished or hemispherical ends holds more, and the ends' volume must be added. A hemispherical end of radius r holds 2πr³ ÷ 3, half a sphere. Dished ends of other shapes have volumes that their manufacturers publish for each size, and those figures should be used rather than estimated.

## Elliptical and oval sections

Elliptical and oval tanks fit spaces that round ones do not, such as under a vehicle or beside a wall. The ellipse's area is π × a × b with **semi**-axes a and b, or π × A × B ÷ 4 with full axes A and B. This is an illustration. An elliptical tank 1,400 mm wide and 1,000 mm high in section, 1,500 mm long, holds π × 0.7 × 0.5 × 1.5 = **1.649 m³**. Calculated with full axes in π × a × b, it comes out at 6.597 m³, the same factor of four as the cylinder error, and the same box check catches it: an ellipse also fills π ÷ 4 of its enclosing rectangle.

An oval made of two semicircles joined by straight sides is not an ellipse, and its area is the circle's area plus the rectangle between the semicircles' centres. Calling it an ellipse in a calculation gives an area that is slightly wrong, and the difference grows with the length of the straight sides.

## Sloping floors

Flat-bottomed tanks usually have a small fall to the outlet so that they drain. The fall removes a wedge of volume from the bottom. This is an illustration. If the rectangular tank above had a floor that fell 50 mm across its 1,000 mm width, the wedge below the high side of the floor would be ½ × 1.0 × 0.05 × 1.2 = 0.030 m³, **30 L**. Whether the wedge is deducted depends on where the levels are measured from: from the high side of the floor, the wedge is extra volume below the zero; from the outlet, it is part of the volume. The capacity block of Chapter 1 should say which.

## Comparing shapes by sheet used

For a given capacity, the shape decides how much sheet the tank needs, and a cylinder needs less than a box. This is an illustration, for 1,800 L working and 150 mm freeboard, with flat bottoms and no lids:

- The **rectangular** tank, 1,000 × 1,200 mm and 1,650 mm tall, has sides of 2 × (1.0 + 1.2) × 1.65 = 7.26 m² and a bottom of 1.20 m², a total of **8.46 m²**.
- The **cylindrical** tank, 1,200 mm diameter and 1,742 mm tall, has a shell of π × 1.2 × 1.742 = 6.57 m² and a bottom of 1.13 m², a total of **7.70 m²**.

```figure
type: bars
title: Sheet area for 1,800 L working, by tank shape
unit: m²
max: 9
caption: This is an illustration with flat bottoms, no lids and 150 mm freeboard. The cylinder uses about 9% less sheet than the box for the same capacity, before stiffeners, which the box also needs more of.
- Rectangular, 1,000 × 1,200 mm | 8.46
- *Cylindrical, 1,200 mm diameter | 7.70
```

The cylinder uses about 9% less sheet, and its round wall resists the liquid's pressure in tension rather than in bending, so it usually needs no stiffeners at this size. The rectangular tank fits the space better and is easier to build without rolls. The choice is the processor's, but the numbers make it an informed one.

## Hexagons and other prisms

Some tanks and bins use regular polygons: hexagonal and octagonal bins are built from flat panels and approach a cylinder's efficiency. A regular hexagon of side s has an area of (3√3 ÷ 2) × s², about 2.598 s². Its across-flats dimension is √3 × s and its across-corners dimension is 2s, and a drawing must say which is meant, because a hexagon "600 mm across" has a side of about 346 mm if that is across flats and 300 mm if it is across corners, and an area a third larger in the first case.

## Levels and the cross-section

For any prism or cylinder standing vertically, volume is proportional to height, so a level gauge can be marked in equal steps. The litres per millimetre is the cross-sectional area times 0.001 m: 1.2 L/mm for the rectangular tank, 1.131 L/mm for TK-1's shell. That single number, written on the drawing, lets anyone convert a level to a volume and is the first line of the calibration table of Chapter 5. It is also a check: a level instrument that reports 100 L for a 100 mm rise in TK-1's shell is either reading wrong or measuring the wrong tank.

## Checking a rolled shell

A rolled shell's diameter is easiest to check from its circumference, because a tape round the outside is more reliable than a rule across a large, slightly oval opening. The internal diameter is the outside circumference divided by π, less twice the wall thickness. This is an illustration. A tape round TK-1's 3 mm shell that reads 3,789 mm gives an outside diameter of 3,789 ÷ π = 1,206.1 mm and an internal diameter of **1,200.1 mm**, as drawn. A reading of 3,800 mm would mean an internal diameter of about 1,203.6 mm, which adds about 10 L to the shell's volume: harmless for capacity, but a sign that the shell will not fit a cone rolled to the drawing.

## Exercise: a larger wash tank

The processor also needs a wash tank holding 4,000 L working with 200 mm freeboard, either rectangular, 1,500 × 2,000 mm in plan, or a flat-bottomed cylinder of 1,800 mm internal diameter. For each, what is the tank height, the litres per millimetre of level, and the sheet area of sides and bottom?

**Worked answer.**

- **Rectangular**: liquid height 4.000 ÷ (1.5 × 2.0) = 1.333 m; tank height **1,533 mm**; **3.0 L per mm**; sides 2 × (1.5 + 2.0) × 1.533 = 10.73 m² plus a 3.00 m² bottom, about **13.73 m²**.
- **Cylindrical**: cross-section π × 0.9² = 2.545 m²; liquid height 4.000 ÷ 2.545 = 1.572 m; tank height **1,772 mm**; about **2.545 L per mm**; shell π × 1.8 × 1.772 = 10.02 m² plus a 2.54 m² bottom, about **12.56 m²**.

The cylinder again uses less sheet, about 1.17 m² less, roughly 8.5%. The box check confirms the cylinder's volume: its enclosing box at the liquid height is 1.8 × 1.8 × 1.572 = 5.093 m³, and π ÷ 4 of that is 4.000 m³, as required.
