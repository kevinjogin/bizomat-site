---
book: tanks-and-hoppers-by-the-numbers
chapterSlug: partly-filled-tanks-and-level-tables
order: 5
title: "Partly filled tanks and level tables"
description: "Turn a level into a volume for cone-bottomed and horizontal tanks, build a calibration table, mark a dipstick, and catch a level transmitter scaled linearly that overstated the contents by 220 litres."
draft: false
---

A tank is rarely full. Operators read a level, from a sight glass, a dipstick or a transmitter, and need to know the volume it represents. For a vertical tank with a flat bottom the conversion is a single number of litres per millimetre. For anything else, a cone bottom, a horizontal cylinder, a dished end, the volume is not proportional to the level, and a level gauge marked or scaled as if it were will misreport the contents, worst of all near the bottom where running out matters most.

This chapter shows how to calculate the volume at any level in TK-1's cone and shell and in a horizontal cylinder, how to build a level-to-volume **calibration table**, how to mark a dipstick, and how to check the table against a water fill. The running case finds TK-1's level transmitter scaled linearly from empty to full, overstating the contents by 220 litres at the level where the batch was meant to stop.

## TK-1: cone then shell

TK-1's level is measured from the outlet. Below 400 mm the liquid is in the cone; above it, the cone is full and the rest is in the cylindrical shell.

- **In the cone**, at a level y below 400 mm, the liquid is a frustum from the 50 mm outlet radius to a radius of 50 + 550 × y ÷ 400 mm. Its volume is π × y ÷ 3 × (R² + R × r + r²), as Chapter 3 calculated.
- **In the shell**, at a level y above 400 mm, the volume is the full cone's 164.4 L plus 1.131 L for every millimetre above 400 mm.

```figure
type: formula
title: Volume at a level in TK-1
formula: below 400 mm: V = π × y ÷ 3 × (R² + R × r + r²), with R = 0.05 + 0.55 × y ÷ 0.4;   above 400 mm: V = 0.1644 + 1.1310 × (y − 0.4)
caption: This is an illustration. Levels y are in metres from the outlet and volumes in cubic metres; multiply by 1,000 for litres.
- y | Level above the outlet
- r | Outlet radius, 0.05 m
- R | Liquid surface radius in the cone
step: At 300 mm: R = 0.4625 m; V = π × 0.3 ÷ 3 × (0.4625² + 0.4625 × 0.05 + 0.05²) = 0.0753 m³, about 75 L
step: At 1,000 mm: V = 0.1644 + 1.1310 × 0.6 = 0.8430 m³, about 843 L
```

## The calibration table

A calibration table lists the volume at regular levels. It is what an operator, a dipstick or a transmitter's linearisation needs, and it is worth calculating more finely where the volume changes fastest with level, which in TK-1 is the cone.

```figure
type: compare
title: TK-1 calibration table, level from outlet
cols: Volume | Linear scale's reading | Linear scale's error
caption: This is an illustration. A linear scale from 0 to 1,900 mm for 0 to 1,861 L is right only at the ends; its error peaks at the top of the cone.
- 100 mm | 4.9 L | 97.9 L | +93 L
- 200 mm | 26.0 L | 195.9 L | +170 L
- 300 mm | 75.3 L | 293.8 L | +219 L
- *400 mm, top of cone | 164.4 L | 391.8 L | +227 L
- 800 mm | 616.8 L | 783.5 L | +167 L
- 1,200 mm | 1,069.2 L | 1,175.3 L | +106 L
- 1,750 mm, maximum level | 1,691.2 L | 1,714.0 L | +23 L
- 1,900 mm, top of shell | 1,860.9 L | 1,860.9 L | 0
```

Above the cone, the true volume rises at 1.131 L per millimetre, a straight line. The linear scale also rises in a straight line, but more slowly, at 1,860.9 ÷ 1,900 = 0.979 L per mm, because it spreads the full volume evenly over the full height. Its error is largest at the top of the cone and shrinks to nothing at the top of the shell.

## The error: 220 litres that were not there

This is an illustration. TK-1's level transmitter was commissioned with a simple linear scale: 0 mm reads 0 L, 1,900 mm reads 1,861 L. The processor's batch procedure drew product from TK-1 until the display showed 300 L remaining, then switched to a fresh tank.

A display of 300 L on the linear scale corresponds to a level of 300 ÷ 1,860.9 × 1,900 = 306 mm. At that level TK-1 actually holds about **80 L**. The first time the procedure was run, the pump drew air well before the operator expected, with the display still showing over 200 L.

The fault was found by comparing the display with the calibration table, which had been calculated for the drawing but not loaded into the transmitter. The fix was to enter a linearisation table in the transmitter, a set of level and volume points between which it interpolates, using finer steps through the cone where the curve bends. Most level transmitters and controllers accept such a table. The table was then checked against a water fill, as below.

```figure
type: line
title: TK-1 volume against level, true and linear scale
x: Level above the outlet, mm
y: Volume, L
ymin: 0
ymax: 2000
legend: True volume | Linear scale
caption: This is an illustration. The true curve is flat through the cone, then straight through the shell; the linear scale is straight throughout and reads high everywhere between the ends.
- 0 | 0 | 0
- 200 | 26 | 196
- 400 | 164 | 392
- 800 | 617 | 784
- 1200 | 1069 | 1175
- 1600 | 1522 | 1567
- 1900 | 1861 | 1861
```

## How fine a table needs to be

A transmitter or an operator interpolates between the table's points in straight lines, and through a curve that gives an error. The finer the table, the smaller the error, and the table only needs to be fine where the curve bends.

This is an illustration. With TK-1's table at 100 mm steps through the cone, straight-line interpolation overstates the volume between points by up to about **5.7 L**, worst near 350 mm, just below the top of the cone. Halfway between the 100 and 200 mm points, at 150 mm, interpolation gives 15.5 L against a true 12.7 L. At 50 mm steps the worst error falls to about **1.5 L**. Above the cone, where the true volume is a straight line, two points are enough, at 400 mm and at the top of the shell, and any number of intermediate points adds nothing. TK-1's final table has 50 mm steps from the outlet to the top of the cone, nine points, and one more at the top of the shell: ten points in all.

## The instrument's own zero

A level instrument measures from its own datum, which is rarely the outlet. A pressure transmitter on a nozzle 80 mm above the outlet reads zero when the liquid is at the nozzle, not when the tank is empty, and cannot see the 3.0 L in the cone below it. A radar or ultrasonic transmitter on the roof measures the distance down to the surface, and converts it to a level by subtracting from its mounting height, which must be measured on the built tank. Most such instruments also have a dead zone close to the sensor, within which they cannot read.

Each of these offsets must be entered in the instrument or allowed for in the table, and each should be checked during the water fill, because an offset of 80 mm entered as 80 cm is a mistake that only a measurement catches.

## Volume, mass and temperature

A level table converts level to volume, but many processes need mass. The two differ by the liquid's density, which changes with temperature. This is an illustration. Water's density falls from about 998.2 kg/m³ at 20 °C to about 983.2 kg/m³ at 60 °C, so 1,500 L filled cold expands to about **1,523 L** when heated, raising TK-1's level by about 20 mm in the shell. That is part of why Chapter 1's freeboard exists. A process that doses by mass should convert from volume at the liquid's actual temperature, or weigh the tank directly.

## Horizontal cylinders

A horizontal cylinder's partly filled volume is the area of the circular **segment** below the liquid surface times the tank's length. For a cylinder of radius r filled to a depth h, the segment's area is:

- **A = r² × arccos((r − h) ÷ r) − (r − h) × √(2rh − h²)**, with the angle in radians.

This is an illustration. The processor also has a horizontal rinse water tank, RW-2, 1,200 mm internal diameter and 2,000 mm long with flat ends, holding π × 0.6² × 2.0 = **2,262 L** full. Its volume at a few depths shows how far from linear a horizontal tank is.

```figure
type: bars
title: RW-2's contents at five depths
unit: L
max: 2400
caption: This is an illustration for a 1,200 mm horizontal cylinder, 2,000 mm long. Half the depth holds exactly half the volume; a tenth of the depth holds only 4%.
- 100 mm | 90
- 300 mm | 442
- *600 mm, half depth | 1131
- 900 mm | 1820
- 1,100 mm | 2172
```

The litres per millimetre of depth equal the width of the liquid surface times the length. At half depth, the surface is the full 1,200 mm wide, so RW-2 holds 1.2 × 2.0 = 2.4 L per mm. At 100 mm depth, the surface is 2 × √(2 × 0.6 × 0.1 − 0.1²) = 0.663 m wide, so it holds only about 1.33 L per mm. A sight glass on a horizontal tank needs a scale with unequal steps, closer together in the middle and wider apart at the top and bottom.

## Dished and domed ends

A horizontal tank with dished ends holds more than its cylinder, and the ends' partly filled volume is harder to calculate than the cylinder's. For hemispherical ends the partly filled volume is the volume of a spherical cap, π × h² × (3r − h) ÷ 3 for the two ends together, at depth h. For torispherical and ellipsoidal ends, the manufacturer's tables or a CAD model sliced at each level are more reliable than an estimate. Many fabricators build such tables from the model by cutting it at regular levels and reading the volume below each cut.

## Marking a dipstick

A dipstick is marked at the levels where round volumes fall, which means solving the calibration the other way round: given a volume, find the level. For a cone or a segment there is no simple formula for the level, so the level is found by trial, by halving the interval until the volume matches, or by interpolating in a fine calibration table. A spreadsheet's goal-seek function does the same.

This is an illustration. TK-1's 100 L mark falls at about 333 mm, inside the cone; its 500 L mark at 400 + (500 − 164.4) ÷ 1.131 = about 697 mm; and above the cone each further 100 L is 88.4 mm higher. The marks are closer together through the cone than a ruler would suggest, so they cannot be spaced by eye.

A dipstick should be marked for the tank it will be used in, measured from a fixed datum such as the outlet or the tank's top flange. A stick dipped through a top nozzle measures from the top down, and its zero is the nozzle face; converting it to a level from the outlet needs the distance from the nozzle face to the outlet, which should be measured on the built tank, not read off the drawing.

## Checking the table with a water fill

A calibration table is a calculation, and the tank as built may differ from the drawing. A **water fill** checks it. The tank is filled in measured increments from a meter, and the level recorded after each, giving a measured table that can be compared point by point with the calculated one.

TK-1's fabricator fills in 50 L steps through the cone and 200 L steps through the shell. A cone rolled shallower than drawn shows up as levels that run higher than calculated through the cone and then parallel to the calculation through the shell. A shell slightly oversize shows as a slope through the shell that is a little shallower than 1.131 L per mm. Either is corrected by using the measured table rather than the calculated one, which is the point of measuring.

## Bulk solids and level

Level in a hopper of bulk solid is harder still, because the surface is not level: it is a heap when filling and a crater when emptying from the outlet. A level probe at one point reports one height on a surface that may vary by hundreds of millimetres across the hopper. Hopper inventories are therefore usually estimated by weighing, on load cells under the hopper's supports, which Chapter 6 discusses, rather than by level. Where a level is used, it is best treated as an alarm, full or empty, not as a measure of contents.

## Exercise: dipstick marks for RW-2

Mark a dipstick for RW-2, the 1,200 mm × 2,000 mm horizontal rinse tank, at 500, 1,000, 1,500 and 2,000 L, measured from the bottom of the shell. Explain why the marks are not equally spaced.

**Worked answer.** Solving the segment formula for each volume by trial gives:

- **500 L** at about **327 mm**;
- **1,000 L** at about **545 mm**;
- **1,500 L** at about **756 mm**;
- **2,000 L** at about **992 mm**.

The steps between marks are 218, 211 and 236 mm. They are not equal because the liquid surface is widest at mid-depth, 600 mm, where each millimetre holds the most volume. The 1,000 and 1,500 L marks straddle the middle and are closest together; the 2,000 L mark is near the top, where the surface narrows again and each 500 L needs more depth. Half the full volume, 1,131 L, is exactly at half depth, 600 mm, which is a useful check on any horizontal tank's table.

The first step, from the bottom to the 500 L mark, is the longest of all at 327 mm, because the bottom of a horizontal tank is where its surface is narrowest. A dipstick marked by eye with equal spacing would read low near the bottom and high near the middle, the same pattern as the linear transmitter scale on TK-1 but symmetrical about half depth. Like TK-1's table, RW-2's dipstick should be checked against a measured water fill before it is used to account for product, and the fill readings, not the calculation, should go on the stick if the two disagree by more than a few litres. The stick should also carry the tank's tag, RW-2, so that it is never used in another tank of a different size.
