---
book: fins-and-heat-sinks-by-the-numbers
chapterSlug: interfaces
order: 2
title: "Interfaces: contact, grease, pads and flatness"
description: "The thin joint between a device and its heat sink can cost more temperature than the sink's base. HS-150's interface is worked through, with a gap pad that added 10 K to save assembly time."
draft: false
---

Between a power module's baseplate and a heat sink lies a joint a few hundredths of a millimetre thick, and it can cost as much temperature as several millimetres of aluminium. Two metal surfaces pressed together touch only at the peaks of their roughness and at the high points of their flatness errors; everywhere else they are separated by a thin film of air, and air is one of the best insulators an engineer meets. Thermal interface materials, greases, pastes, pads and phase-change films, exist to fill that film with something that conducts better. Choosing and applying them well is cheap; getting them wrong is one of the commonest reasons a product runs hotter than its calculation.

This chapter explains what an interface resistance is, calculates the layers in HS-150's joint, compares grease with pads, and sets out the assembly practices that keep the resistance at its datasheet value. The running case's error was a change from grease to a thick gap pad, made to speed up assembly, which raised the junction by about 10 K and pushed it over its limit.

## A layer's resistance

A flat layer of thickness t and conductivity k, carrying heat across an area A, has a resistance R = t ÷ (k × A). For HS-150's module, the baseplate measures 62 mm × 108 mm, an area of about 0.006 70 m². That area is small enough that even very thin layers matter.

```figure
type: formula
title: Resistance of a thin layer across HS-150's module footprint
formula: R = t ÷ (k × A),   A = 0.062 × 0.108 ≈ 0.006 70 m²
caption: This is an illustration. Air's conductivity is the published value near 40 °C; the grease and pad conductivities are illustration values of the order quoted by makers, whose own datasheets govern real choices.
- 20 µm of still air, k ≈ 0.027 W/m·K | about 0.109 K/W
- 50 µm of grease, k ≈ 1.0 W/m·K | about 0.0075 K/W
- 150 µm of grease, k ≈ 1.0 W/m·K | about 0.0224 K/W
- 1.0 mm gap pad, k ≈ 1.5 W/m·K | about 0.0996 K/W
- 10 mm of 6063 aluminium, k = 209 W/m·K | about 0.0072 K/W
```

The comparison is startling. A film of air 20 µm thick, about a quarter of a human hair's width, would have about fifteen times the resistance of the sink's whole 10 mm base. A dry joint is not entirely air, because the surfaces touch at their high points, but the air film dominates its resistance, and that is why no power device should be mounted dry unless its maker says so. A good grease layer of 50 µm costs about the same as the base, which is acceptable; a thick one costs three times as much.

## What a datasheet's case-to-sink figure includes

The module maker's case-to-sink resistance, 0.04 K/W in this illustration, is larger than the 50 µm grease layer's 0.0075 K/W. The difference is real and expected. The datasheet figure includes the contact resistances at both faces of the grease, the effect of the baseplate's bow, which leaves the grease thicker in some places than others, and the heat's path through the baseplate to the interface. It is measured with the maker's recommended grease, layer thickness, screws and torque. It holds only when the assembly follows those instructions, and it is the right figure for the budget when it does.

At 150 W, the interface's 0.04 K/W costs 6 K. That is a modest share of HS-150's 85 K budget, but it is the share most easily spoiled.

## Surfaces, flatness and pressure

Three properties of the two surfaces set how thin the interface can be.

**Roughness** decides how deep the valleys between the surfaces' peaks are. A machined or extruded surface has valleys a few micrometres deep; grease fills them.

**Flatness** decides the larger gaps. A heat sink's mounting face that is bowed, twisted or dished leaves gaps far larger than its roughness, and grease thick enough to fill them adds resistance. Power modules often specify a flatness for the mounting surface over the module's footprint, and a sink extrusion may need its mounting area machined flat to meet it. Many large modules have a deliberately bowed baseplate designed to flatten when the screws are tightened in the right order.

**Pressure** decides how far the high points deform and how thin the grease spreads. Too little pressure, from screws under-tightened or tightened in the wrong sequence, leaves a thick layer; too much can crack a module's ceramic substrate. The maker's torque and sequence, often tightening each screw partly, then fully, in a set order, exist for both reasons.

```figure
type: checklist
title: HS-150's mounting instruction, from the module maker's application note
caption: This is an illustration of the drive's assembly sheet. Each step refers to the maker's own figures, which govern; the open item is closed by the thermal test of Chapter 10.
- x Mounting face | clean, free of burrs, flatness checked over the module footprint
- x Grease | the type the maker lists, applied with a stencil to the stated thickness
- x Screws | the stated size and grade, with the stated washers
- x Tightening | partial torque on all screws in the stated order, then final torque in the same order
- x Record | torque tool number and operator on the drive's traveller
- *? Proof | case-to-sink temperature difference measured on first articles
```

## Grease, pads and phase-change materials

**Greases and pastes** give the thinnest layers and the lowest resistances when applied well. Their drawbacks are mess, the need for a controlled thickness, and, over thousands of temperature cycles, a tendency for some greases to migrate out of the joint, called pump-out, which slowly raises the resistance.

Controlling a grease layer's thickness is the practical difficulty, and the usual answer is a stencil or screen: a thin sheet with a pattern of openings, laid on the baseplate, through which the grease is wiped, leaving a set volume in a set pattern that spreads to the right thickness when the module is tightened down. Some makers publish a recommended pattern and stencil thickness for their modules. A stencil turns grease application from a skill into a process step, takes seconds and makes every unit the same, which is what a datasheet value assumes.

**Gap pads** are soft, compliant sheets that are clean and quick to fit and can fill large or uneven gaps, for example between several components of different heights and one sink. They are much thicker than a grease layer, typically fractions of a millimetre to several millimetres, so even with a good conductivity their resistance is several times a grease layer's. They suit low-power parts and uneven gaps, not a large power module on a flat sink.

**Phase-change materials** are films that are solid at room temperature, which makes them clean to handle, and soften at operating temperature to flow into the joint like grease. They can approach a grease layer's performance with a pad's convenience.

**Insulating pads**, where a device's case is electrically live, add an electrical barrier and a resistance; their thermal performance must be checked against the budget like any other layer.

## The failure case: the pad that saved two minutes

This is an illustration. Production found applying the grease to the right thickness slow and messy, and an engineer proposed a 1.0 mm gap pad instead: clean, quick and tolerant of the sink's flatness. The pad's datasheet quoted a conductivity of about 1.5 W/m·K, which sounded better than the grease's 1.0. The change was approved without a recalculation.

The pad's bulk resistance across the module's footprint is t ÷ (k × A) = 0.001 ÷ (1.5 × 0.006 70) ≈ **0.0996 K/W**, thirteen times the 50 µm grease layer's, despite the better conductivity, because it is twenty times thicker. Adding an allowance for its two contact faces, the case-to-sink resistance becomes about **0.11 K/W** instead of 0.04. At 150 W that adds about 10.5 K, and the junction, which Chapter 9 puts at about 122 °C with grease, rose to about **133 °C**.

```figure
type: bars
title: HS-150's junction at full load in 40 °C air, by interface
unit: °C
max: 140
caption: This is an illustration including the spreading resistance found in Chapter 9. The 125 °C line is the designer's limit. Conductivity alone does not rank interface materials; thickness matters as much.
- Grease to the maker's instruction, R_cs 0.04 K/W | 122.1
- Grease three times too thick, about 0.055 K/W | 124.3
- *1.0 mm gap pad, about 0.11 K/W | 132.6
- Dry joint, no interface material | well over 140
```

The problem appeared in the first-article thermal test of Chapter 10, where the measured difference between case and sink was nearly three times the expected figure. The correction was to return to grease, applied with a stencil that sets the thickness in seconds, which removed the original reason for the pad. The general lesson is that interface materials should be compared by their resistance at the actual area and thickness, R = t ÷ (k × A), or by the maker's area-specific impedance at the actual pressure, never by conductivity alone.

## Area-specific resistance

Because the area of a joint varies from product to product, interface materials are often specified by an **area-specific resistance**, sometimes called thermal impedance, in K·m²/W or K·cm²/W. Dividing it by the joint's area gives the resistance. A value of 1 K·cm²/W, which is 1 × 10⁻⁴ K·m²/W, across HS-150's 0.006 70 m² footprint gives about 0.015 K/W. Makers usually quote impedance at a stated pressure and thickness, and it rises at lower pressure; the figure for the joint's real clamping pressure is the one to use.

The same arithmetic warns about small devices. A transistor in a small package, with a mounting area perhaps a twentieth of HS-150's module, sees twenty times the resistance from the same interface material, and its interface can easily become the largest resistance in its path.

## Measuring an interface

An interface's resistance can be checked directly on a first article, and the check takes less than an hour. A fine thermocouple is set in a shallow groove machined in the sink's mounting face, so that its tip sits under the middle of the module's baseplate, touching the baseplate; a second is fixed in the sink's base just below the groove. Some module makers specify exactly where the case temperature is to be measured for their datasheet values, and their position should be copied. With the drive running at a known, steady loss, the difference between the two readings divided by the power is the case-to-sink resistance.

This is an illustration. With grease applied to the instruction, HS-150's first article read a case-to-sink difference of about 6.2 K at 150 W, a resistance of about 0.041 K/W, close to the datasheet's 0.04. The unit built with the gap pad read about 16.5 K, about 0.11 K/W, which is the figure used above. A single pair of thermocouples turned an argument about which material was better into a number. The groove must be shallow and narrow, and filled around the thermocouple, or it becomes a small air gap of its own and the reading is spoiled.

## Joints inside the heat sink

Interfaces also exist inside heat sinks that are not single extrusions. Bonded-fin and folded-fin sinks, used where fins must be taller or thinner than an extrusion allows, have a joint at every fin root: an epoxy bond, a braze or a crimp. Each joint is a layer, and the same arithmetic applies.

This is an illustration. Suppose HS-150's 18 fins were bonded into slots with 0.1 mm of epoxy whose conductivity is about 1 W/m·K, over a root area of 250 mm × 2.5 mm per fin. Each joint would have a resistance of about 1 × 10⁻⁴ ÷ (1 × 0.000 625) ≈ 0.16 K/W, and the 18 in parallel about 0.0089 K/W. With most of the 150 W passing through the fins, that adds about 1.2 K to the base temperature, a small but real cost that an extrusion avoids. A bonded-fin sink that performs much worse than its calculation often has voids in its bonds, which the same thermocouple method, applied between base and fin root, will find.

## Interfaces over time

An interface's resistance at assembly is not its resistance after years of service. Temperature cycling, as the drive starts, loads and stops, makes the module's baseplate and the sink expand and contract by different amounts, which works the grease and can pump it out of the joint. Screws can relax. Dust and moisture can enter at the edges. A product with a long life and many cycles should use an interface material whose maker publishes cycling data, should be designed with a reserve for some degradation, and should be checked in service. Chapter 10 describes a simple check that compares the drive's own temperature reading with the expected figure for its load and ambient, which shows a degrading interface before it trips the drive.

## How this applies to a small Australian business

The interface is the cheapest part of a thermal design and one of the easiest to get wrong. A small manufacturer can protect it with three habits: follow the device maker's mounting instructions to the letter, including flatness, grease type and thickness, torque and sequence; compare any proposed change of interface material by its resistance at the real area and thickness, not by its conductivity; and measure the case-to-sink temperature difference on first articles and after any process change. A stencil and a torque tool cost little compared with one batch of drives returned from the field.

## Exercise: a small device

The same drive has a small regulator transistor on the same sink, with a mounting area of 10 mm × 15 mm, dissipating 4 W, and fitted with an insulating pad whose area-specific resistance at its clamping pressure is 1.5 K·cm²/W. Find its case-to-sink resistance and temperature difference. Compare the result with the module's interface.

**Worked answer.** The area is 1.5 cm². The resistance is 1.5 K·cm²/W ÷ 1.5 cm² = **1.0 K/W**, and at 4 W the temperature difference is about **4 K**.

The module's interface, at 0.04 K/W and 150 W, costs about 6 K. So a 4 W part on a small pad loses nearly as much temperature across its interface as a 150 W module on grease, because its area is about one forty-fifth as large. Small devices on pads deserve their own budget, and their interface often dominates it.
