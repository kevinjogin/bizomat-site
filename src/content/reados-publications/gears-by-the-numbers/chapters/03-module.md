---
book: gears-by-the-numbers
chapterSlug: module-pitch-and-gear-sizes
order: 3
title: "Module, pitch and gear sizes"
description: "Use module and tooth number to calculate pitch, tip and root diameters, circular pitch and tooth thickness, and avoid mixing module and diametral pitch gears."
draft: true
---

Once the ratio is chosen, the next decision sets the size of every tooth: the module. Two gears can mesh only if their teeth are the same size and shape, so module is the first number on any metric gear drawing and the first question when replacing a gear from another supplier.

This chapter defines module, calculates the conveyor pair's principal dimensions and explains why a metric gear and an inch gear that look alike will not run together.

## Module defines tooth size

The **module** m is the pitch diameter divided by the number of teeth:

**m = d / z, so d = m × z**

It is measured in millimetres. A larger module means larger, stronger teeth and, for the same tooth number, a larger gear. Preferred module values are standardised in ISO 54, so cutters and gauges are available in a limited, practical series. Designers normally choose from that series rather than inventing a module.

For the conveyor pair, with m = 3 mm:

- pinion pitch diameter **d₁ = 3 × 20 = 60 mm**
- gear pitch diameter **d₂ = 3 × 60 = 180 mm**

The pitch circles are the imaginary circles that roll together without slipping. They are not physical edges you can measure directly, but every other dimension is referred to them.

## Tooth proportions from the basic rack

Standard full-depth involute teeth take their proportions from the basic rack defined in ISO 53. Commonly used proportions are:

- **addendum**, the height of the tooth above the pitch circle: 1.0 m
- **dedendum**, the depth below the pitch circle: 1.25 m, leaving a clearance of 0.25 m below the mating tooth's tip
- **whole depth**: 2.25 m

From these, the tip and root diameters follow:

**d_a = m × (z + 2)**

**d_f = m × (z − 2.5)**

For the conveyor pair:

- pinion tip diameter **d_a1 = 3 × 22 = 66 mm**, root diameter **d_f1 = 3 × 17.5 = 52.5 mm**
- gear tip diameter **d_a2 = 3 × 62 = 186 mm**, root diameter **d_f2 = 3 × 57.5 = 172.5 mm**
- whole depth **2.25 × 3 = 6.75 mm**

```figure
type: compare
title: Principal dimensions of the conveyor pair
cols: Pinion, 20 teeth | Gear, 60 teeth
caption: Module 3 mm, 20° pressure angle, standard full-depth teeth with no profile shift.
- Pitch diameter | 60 mm | 180 mm
- Tip diameter | 66 mm | 186 mm
- Root diameter | 52.5 mm | 172.5 mm
- *Base diameter | 56.382 mm | 169.145 mm
```

## Circular pitch and tooth thickness

The **circular pitch** p is the distance from one tooth to the next, measured along the pitch circle:

**p = π × m = π × 3 ≈ 9.4248 mm**

For standard teeth, the tooth and the space each take half the pitch, so the theoretical **tooth thickness at the pitch circle** is:

**s = p / 2 ≈ 4.712 mm**

A real gear is made slightly thinner than this to provide backlash, as Chapter 6 explains. The **base pitch**, the pitch measured along the line of action, is:

**p_b = p × cos α ≈ 9.4248 × 0.939693 ≈ 8.8564 mm**

It reappears in the contact ratio and in span measurement.

## Face width

Face width b is the length of the tooth along the axis. Wider faces carry more load, but only if the gears are aligned well enough for the load to spread across the face. A common starting range for spur gears is around 8 to 12 times the module, adjusted for alignment, shaft stiffness and manufacturing quality. The conveyor pair uses **b = 30 mm**, ten times the module, as a teaching value.

## Module and diametral pitch do not mix

Gears made to inch standards are sized by **diametral pitch** P, the number of teeth per inch of pitch diameter. The conversion is:

**m = 25.4 / P**

A module-3 gear corresponds to a diametral pitch of 25.4 / 3 ≈ 8.47, which is not a standard inch value. The nearest common inch size, 8 diametral pitch, has a module equivalent of 25.4 / 8 = 3.175 mm. The difference of about 0.175 mm per unit of module looks small, but it changes the pitch on every tooth. Over 20 teeth, the pitch circles differ by about 3.5 mm in diameter.

```figure
type: bars
title: Pitch diameter of a 20-tooth gear
unit: mm
max: 70
caption: Module 3 and 8 diametral pitch look alike but will not run together.
- *Module 3 mm | 60
- 8 diametral pitch, equivalent module 3.175 mm | 63.5
```

When a replacement gear does not mesh properly, a module and diametral pitch mix-up is one of the first things to rule out. Measure the tooth count and outside diameter, calculate both possibilities, and check against the mating gear.

## Exercise: size a second pair

A pair has module 2.5 mm with 24 and 72 teeth. Calculate the pitch diameters, tip diameters, root diameters and circular pitch.

Pitch diameters are **2.5 × 24 = 60 mm** and **2.5 × 72 = 180 mm**, the same as the conveyor pair. Tip diameters are **2.5 × 26 = 65 mm** and **2.5 × 74 = 185 mm**. Root diameters are **2.5 × 21.5 = 53.75 mm** and **2.5 × 69.5 = 173.75 mm**. Circular pitch is **π × 2.5 ≈ 7.854 mm**. Same ratio, same centre distance, smaller teeth: compare the bending strength implications once you reach Chapter 8.
