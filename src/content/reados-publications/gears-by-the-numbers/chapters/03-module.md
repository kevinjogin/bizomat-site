---
book: gears-by-the-numbers
chapterSlug: module-pitch-and-gear-sizes
order: 3
title: "Module, pitch and gear sizes"
description: "Use module and tooth number to calculate pitch, tip and root diameters, circular pitch and tooth thickness, and avoid mixing module and diametral pitch gears."
draft: false
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

## Choosing the module

For a fixed pitch diameter, module and tooth number trade against each other. The conveyor pinion's 60 mm pitch diameter could be made in several ways:

- **Module 2:** 30 teeth
- **Module 2.5:** 24 teeth
- **Module 3:** 20 teeth
- **Module 4:** 15 teeth

```figure
type: compare
title: Four ways to make a 60 mm pitch diameter pinion
cols: Teeth | What changes
caption: Smaller teeth run more smoothly; larger teeth resist bending and damage better. The conveyor uses module 3.
- Module 2 | 30 | Smoother, quieter, weaker in bending
- Module 2.5 | 24 | A middle course
- *Module 3 | 20 | The conveyor case
- Module 4 | 15 | Strong teeth, but undercut needs attention
```

Smaller teeth give more teeth in mesh at once, which tends to make the drive smoother and quieter, and they slide less at the ends of contact. Larger teeth are stronger in bending, more tolerant of wear, debris and shock, and less sensitive to a given manufacturing error, because the error is a smaller fraction of the tooth. Below about 17 teeth at 20°, standard teeth start to undercut, which Chapter 5 addresses with profile shift.

A practical sequence is to fix the pitch diameters from the space and the surface-stress check of Chapter 9, which depends mainly on diameter and face width, and then to choose the smallest preferred module that passes the bending check of Chapter 8 with a sensible margin. ISO 54 lists preferred modules in a first-choice series that includes 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8 and 10 mm, with a second-choice series of intermediate values for cases where the first choice does not fit.

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

## Pitch diameter is not the outside diameter

A frequent mistake in specifying or ordering gears is to confuse the pitch diameter with the outside diameter. For the conveyor pinion, the pitch diameter is 60 mm, but the blank measures 66 mm across the tips. A housing, guard or neighbouring part laid out to the 60 mm figure would clash with the teeth.

The opposite mistake also happens: a gear measured at its tips and recorded as having a 66 mm "diameter" leads someone later to calculate the module as 66 / 20 = 3.3 mm, which is not a standard value and not the real tooth size. On drawings and in purchase descriptions, it is worth writing both values with their names, pitch diameter and tip diameter, rather than an unqualified "diameter". The data block described in Chapter 10 removes the ambiguity by stating the module, the tooth number and the tip diameter separately.

## Clearance and tooth height

The dedendum is deeper than the addendum by a quarter of a module, leaving a **clearance** of 0.25 m between the tip of each tooth and the root of its mate. For the conveyor pair, that is 0.75 mm. The clearance gives room for the root fillet that the cutting tool leaves, a path for oil and debris to escape from the tooth space, and an allowance for tolerances on tip diameter and centre distance.

Not all gears use the same proportions. Stub tooth systems with shorter addenda have been used where bending strength matters more than contact ratio, and fine-pitch and instrument gears follow their own standards. The conveyor case uses standard full-depth teeth, which suit most power transmission work and match commonly available hobs.

## Circular pitch and tooth thickness

The **circular pitch** p is the distance from one tooth to the next, measured along the pitch circle:

**p = π × m = π × 3 ≈ 9.4248 mm**

For standard teeth, the tooth and the space each take half the pitch, so the theoretical **tooth thickness at the pitch circle** is:

**s = p / 2 ≈ 4.712 mm**

A real gear is made slightly thinner than this to provide backlash, as Chapter 6 explains. The **base pitch**, the pitch measured along the line of action, is:

**p_b = p × cos α ≈ 9.4248 × 0.939693 ≈ 8.8564 mm**

It reappears in the contact ratio and in span measurement.

## Module and the rack

A rack is a gear of infinite radius, and module sizes it in the same way. Its teeth are spaced at the circular pitch, π × m, along a straight pitch line. A pinion meshing with a rack moves it by one circular pitch for each tooth that passes, so one revolution of the pinion moves the rack by:

**travel per revolution = π × m × z = π × d**

For a module-3 pinion with 20 teeth, that is π × 60 ≈ 188.5 mm per revolution. Rack and pinion drives are used for long linear travel in machine tools, gantries and steering gear, and the same module rules apply: a module-3 pinion needs a module-3 rack, and an inch rack of 8 diametral pitch will not do, for the reasons above.

Because the rack's pitch line is straight, the pinion's height above the rack sets the backlash just as the centre distance does for two gears, as Chapter 6 explains. Long racks are often made in sections, and the joints between sections must keep the pitch continuous across the join, usually by setting them with a short gauge rack.

## Face width

Face width b is the length of the tooth along the axis. Wider faces carry more load, but only if the gears are aligned well enough for the load to spread across the face. A common starting range for spur gears is around 8 to 12 times the module, adjusted for alignment, shaft stiffness and manufacturing quality. The conveyor pair uses **b = 30 mm**, ten times the module, as a teaching value.

## The gear blank

Before any tooth is cut, a blank is turned. Its dimensions and accuracy carry into the finished gear:

- **Tip diameter:** made to a tolerance, because it is used for setting the cutter depth and, sometimes, for checking. A tip that is too large reduces the clearance; one that is too small reduces the contact ratio.
- **Bore and reference faces:** the bore, or the shaft journals for a pinion made on its shaft, is the datum about which the teeth are cut and checked. Faces used to locate the blank on the machine must be square to that datum.
- **Runout:** a blank that wobbles on its datum will produce teeth that wobble with it, appearing as runout and as varying backlash around the gear.
- **Chamfers:** small chamfers on the tip edges at each face remove the sharp corners that would otherwise chip, and reduce burrs from cutting.

These items belong on the drawing alongside the tooth data, as Chapter 10 describes. A good gear cannot be cut from a poor blank.

## Size, mass and inertia

The gear in a reduction pair is far heavier than the pinion. Treating each as a solid steel disc 30 mm wide, with a density of 7,850 kg/m³ and its pitch diameter as a rough outside size:

- **Pinion, 60 mm:** about 0.67 kg, with a mass moment of inertia of about 0.0003 kg·m²
- **Gear, 180 mm:** about 6.0 kg, with a mass moment of inertia of about 0.0243 kg·m²

Mass rises with the square of diameter and inertia with the fourth power, so tripling the diameter multiplies the inertia by eighty-one. Large gears are therefore often made with a thinner web and a separate rim, or with holes in the web, to save material and inertia while keeping the rim stiff enough to support the teeth.

Seen from the motor, the gear's inertia is divided by the square of the ratio: 0.0243 / 9 ≈ 0.0027 kg·m². That reflected value is what the motor feels when it starts the drive, and it matters when choosing a motor for frequent starts or a drive that must accelerate quickly.

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

## Confirming module and pressure angle from the base pitch

Chapter 10 shows the first step in identifying an unknown gear: count the teeth, measure the tip diameter and test both the metric and inch systems against it. That test is quick, and for a standard, unworn gear it is usually enough to tell a module 3 gear from an 8 diametral pitch one, because their tip diameters differ by several millimetres.

It cannot tell the pressure angle, though, and it is easily misled. Tip diameter alone can mislead. Tips wear, profile-shifted gears have larger or smaller tips than standard, and some gears are topped to a non-standard diameter. A second check uses the base pitch, which does not depend on the tip. Measuring a span over k + 1 teeth and over k teeth with a disc micrometer, as described in Chapter 10, the difference between the two readings is the base pitch:

- module 3 at 20°: **π × 3 × cos 20° ≈ 8.856 mm**
- module 3 at 14.5°: **≈ 9.125 mm**
- 8 diametral pitch at 14.5°: **≈ 9.657 mm**
- 8 diametral pitch at 20°: **≈ 9.373 mm**

These values are far enough apart for a careful measurement to distinguish them. Measuring the base pitch confirms both the module and the pressure angle, which a tip diameter cannot do.

To make the base pitch check reliable, take both span readings with the same micrometer and anvils, at the same height on the face, and repeat them at three or four positions around the gear. Worn gears thin unevenly, so a single pair of readings can mislead by a few hundredths of a millimetre, while the differences between the candidate base pitches above are about a quarter of a millimetre or more. Averaging several differences gives a figure close enough to choose between them with confidence. Recording the readings also gives the replacement supplier evidence for the tooth thickness of the old gear, which matters if its mate is being kept.

## Exercise: size a second pair

A pair has module 2.5 mm with 24 and 72 teeth. Calculate the pitch diameters, tip diameters, root diameters and circular pitch.

Pitch diameters are **2.5 × 24 = 60 mm** and **2.5 × 72 = 180 mm**, the same as the conveyor pair. Tip diameters are **2.5 × 26 = 65 mm** and **2.5 × 74 = 185 mm**. Root diameters are **2.5 × 21.5 = 53.75 mm** and **2.5 × 69.5 = 173.75 mm**. Circular pitch is **π × 2.5 ≈ 7.854 mm**. Same ratio, same centre distance, smaller teeth: compare the bending strength implications once you reach Chapter 8.
