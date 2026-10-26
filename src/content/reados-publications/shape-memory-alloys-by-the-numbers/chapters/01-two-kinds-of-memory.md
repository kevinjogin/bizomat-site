---
book: shape-memory-alloys-by-the-numbers
chapterSlug: two-kinds-of-memory
order: 1
title: "Two kinds of memory: shape memory and superelasticity"
description: "See how one reversible crystal change gives shape memory and superelasticity, set the vent latch's requirements, and catch a spring-steel sum that said the wire could not move."
draft: false
---

Ordinary metals deform in two ways. Small loads stretch their atomic bonds, and they spring back: that is elasticity, good for a fraction of a per cent. Larger loads make planes of atoms slip past each other, and the metal stays bent: that is plasticity, and it is permanent. Nickel-titanium has a third way. Its atoms can shift together, without slipping, from one crystal arrangement to another, and the shift can be undone by warming or by unloading. Because the shift changes the crystal's shape, it gives the metal strains of several per cent that are fully recoverable.

That one mechanism produces two useful behaviours. Below a certain temperature, the alloy can be deformed and will recover its shape when warmed: the **shape memory effect**, which makes actuators. Above a certain temperature, it can be deformed by several per cent and springs back as soon as the load is removed: **superelasticity**, which makes springs and clips. This chapter explains both, introduces the running case, and records a calculation that treated the actuator wire as spring steel and concluded it could not work.

## Austenite and martensite

Nickel-titanium has two crystal structures that matter. At high temperature it is **austenite**, a simple, symmetric structure that is relatively stiff and strong. At low temperature it is **martensite**, a less symmetric structure that forms in many differently oriented variants, arranged so that a piece of martensite, cooled without load, keeps the same outward shape as the austenite it came from.

The variants are the key to shape memory. Under a modest stress, martensite variants can reorient, the favourably oriented ones growing at the expense of the others, without any atoms slipping. The piece changes shape, by up to several per cent, at a low and nearly constant stress, and stays deformed when unloaded. Warm it above the austenite temperature and every variant must transform back to the one austenite structure, which has only one shape: the original. The piece recovers, and if something resists, it pulls with considerable force.

```figure
type: cycle
title: The shape memory cycle in an actuator wire
caption: This is an illustration of the cycle in VL-25's wire. The bias spring does the cold stretching; the electric current does the heating. Nothing slips, so the cycle can repeat millions of times if stress and strain are kept within limits.
- Cool martensite wire, stretched a few per cent by the bias spring at low stress
- *Heat by current: the wire transforms to austenite and contracts, pulling the latch
- Hot austenite wire, short, holding the latch open against the spring
- Cool: the wire transforms back to martensite, still short
- The bias spring stretches the soft martensite again, closing the latch
```

### The four temperatures

The transformations do not happen at a single temperature. On cooling, martensite starts to form at the **martensite start** temperature, Ms, and the transformation finishes at the **martensite finish** temperature, Mf. On heating, austenite starts to form at the **austenite start** temperature, As, and finishes at the **austenite finish** temperature, Af. The heating temperatures lie above the cooling ones, so the transformation has a hysteresis, often of the order of 20 to 40 °C in binary nickel-titanium. Chapter 2 deals with choosing a wire grade by these temperatures, and Chapter 3 with how stress moves them.

## Superelasticity

Above Af, with no load, the alloy is austenite. Load it, and at a high enough stress the austenite transforms to martensite anyway, in the variants that the stress favours. The result is a long, nearly flat plateau in the stress–strain curve over several per cent of strain. Unload it, and because martensite is not stable at that temperature without stress, it transforms back, on a lower plateau, and the part returns to its original shape. That is superelasticity.

A superelastic wire therefore behaves like a spring with an enormous elastic range but an odd shape: steep at first, then nearly flat for several per cent, then steep again, with a lower path on unloading. The stress at which the plateau occurs depends strongly on temperature, which Chapter 9 makes the centre of superelastic design.

### A phase change under load

The thermodynamics text listed in the references uses bars of material with a non-monotonic stress–strain relation, one that rises, falls and rises again, to explain why such a material, loaded in tension, splits into regions at two different strains rather than straining uniformly. A nickel-titanium wire loaded along its plateau does exactly that: the transformation starts at one point and spreads along the wire as a band, with untransformed and transformed lengths side by side at the same stress. Chapter 5 returns to this when it compares loading a wire with a weight and loading it with a spring.

### Two curves for one wire

The simplest way to picture an actuator wire is as two different springs that the wire switches between. When it is cool, it is martensite, and its stress–strain curve is low and flat: a modest stress, around 70 MPa for the wire in this book, stretches it by several per cent. When it is hot, it is austenite, and its curve is steep and high: it resists being stretched until the stress reaches the level at which austenite would be forced to transform, far above the cool plateau.

An actuator works in the gap between those curves. The bias spring is chosen to stretch the wire along its cool, flat curve, and to be overcome when the wire is heated and switches to its hot, steep curve. Heating the wire is like replacing a soft spring with a stiff one while the load stays attached: the wire shortens until the stiff spring balances the load, and that shortening is the stroke. Cooling switches back, and the load stretches the wire again.

The picture also shows why the maker's two guideline stresses matter. The cool stress must be high enough to reorient the martensite fully, or the wire will not lengthen by the full stroke. The hot stress must be low enough that the austenite is not forced back into martensite under load, or the wire will not shorten by the full stroke, and low enough that the wire's life is not shortened by every operation. Chapters 3 and 5 work through both limits for VL-25.

## The running case: VL-25

This is an illustration. VL-25 releases a vent flap on an outdoor control cabinet. A spring-loaded latch pin holds the flap shut; the controller opens the vent by passing current through 150 mm of 0.25 mm nickel-titanium actuator wire, which contracts and pulls the pin back 4.0 mm. A steel bias spring with a preload of 3.5 N stretches the cool wire back to its long length and re-engages the latch when the flap is pushed shut.

```figure
type: checklist
title: What VL-25 must do
caption: This is an illustration. The enclosure maker's targets for its fictional latch. VL-25 is a convenience release; any safety-related venting function would have its own requirements.
- ? Pull the latch pin 4.0 mm | against 4.0 N of latch friction plus the bias spring
- ? Not operate by itself | at cabinet temperatures up to 60 °C in summer sun
- ? Release within 2 s of command | from the controller's 5 V supply
- ? Reset ready for re-latching | within 10 s after the current stops
- ? Survive 20,000 operations | weekly exercise plus faults over 15 years, with margin
- ? Stay within the wire maker's guidelines | stress and strain limits on its data sheet
```

## The error: treating the wire as spring steel

This is an illustration. VL-25's first concept review included a calculation by an engineer used to steel springs. To check whether the 3.5 N bias spring could stretch the cool wire back by 4.0 mm, the engineer used Hooke's law with a Young's modulus for nickel-titanium of 75 GPa, from the top of the range a data sheet gave. The wire's cross-section, for a diameter of 0.254 mm, is 0.0507 mm², so the stretch under 3.5 N would be 3.5 × 150 / (0.0507 × 75,000) = **0.14 mm**. Even with the bottom of the range, 41 GPa, it came to only 0.25 mm. The engineer concluded that a 3.5 N spring could not reset the wire by 4 mm, and proposed a spring ten times stronger.

The calculation was right about elasticity and wrong about the material. Cool martensite does not stretch elastically by 4 mm, or 2.7%; it deforms by reorienting its variants along its low, flat plateau. The 3.5 N spring puts the wire under 3.5 / 0.0507 = **69 MPa**, almost exactly the 70 MPa that the wire maker's data sheet, listed in the references, describes as a good starting point for the force to deform the cool wire. At that stress, the martensite reorients and the wire lengthens by the few per cent needed.

The proposed stiffer spring would have done real harm. It would have loaded the hot wire, at the end of its contraction, well above the maker's 172 MPa guideline, and Chapter 5 shows what that does to the wire's life. The review recorded the lesson in a sentence: nickel-titanium's modulus describes its small elastic stretch, while its useful strains come from transformation and reorientation, which follow their own stress levels, given in the maker's data, not by Hooke's law.

## Numbers to start from

Published data for nickel-titanium give an idea of the material, with the caution that properties depend strongly on composition and processing.

```figure
type: compare
title: Typical nickel-titanium properties from two published data sheets
cols: Value | Source
caption: Values as published by the makers listed in the references; typical, not guaranteed. The superelastic data sheet notes that properties depend strongly on processing and temperature. Actuator stresses are the actuator maker's design guidelines, not material limits.
- Density | 6.5 g/cm³ | superelastic wire data sheet
- Electrical resistivity | 82 µΩ·cm | superelastic wire data sheet
- Young's modulus | 41 to 75 GPa | superelastic wire data sheet
- Ultimate tensile strength | 1,100 to 1,150 MPa | superelastic wire data sheet
- *Heating pull stress guideline | 172 MPa | actuator wire data
- Cool deformation stress guideline | 70 MPa | actuator wire data
- Working strain for long life | 2% to 6% | actuator wire data
```

The two guideline stresses frame actuator design. The wire pulls safely at up to about 172 MPa when hot, and is re-stretched by about 70 MPa when cool. The difference between them, about 100 MPa, is the stress available to do useful work, and Chapter 5 spends it. For VL-25's 0.0507 mm² wire, 100 MPa is about 5 N, which must cover the latch's 4.0 N of friction and the bias spring's rise over the stroke. The margin is not generous, and the latch's friction, not the wire, turns out to be the number that most needs watching.

## Where wire actuators fit

Shape memory wire is not a general replacement for motors and solenoids. It has a particular combination of strengths and weaknesses, and a designer should weigh both before choosing it.

Its strengths are compactness, silence and simplicity. A wire a quarter of a millimetre thick and 150 mm long, weighing about 0.05 g, pulls with nearly 9 N, which no electromagnetic device of that size can match. It has no moving parts beyond the wire itself, makes no noise, produces no sparks and needs only a switched current. For a latch that operates occasionally in a sealed outdoor cabinet, those are real advantages.

Its weaknesses are just as real:

- **Low efficiency.** This is an illustration. VL-25's wire takes about 3.06 J of electrical energy per operation, from Chapter 6. The useful work it does, pulling the latch pin 4 mm against a bias spring rising from 3.5 to 4.3 N and against 4.0 N of latch friction over the first millimetre, is about 0.016 + 0.004 = 0.020 J. That is an efficiency of about **0.6%**. Almost all of the energy heats the wire and the air around it.
- **Small strain.** A few per cent of the wire's length is all the stroke there is, so a useful stroke needs a long wire, or a lever or pulley that trades force for stroke.
- **Slow cooling.** Heating can be fast; cooling depends on heat leaving a thin wire, which takes seconds, as Chapter 7 shows.
- **Temperature sensitivity.** The wire responds to the temperature around it as well as to its current, so it must be chosen so that the hottest environment cannot trigger it, as Chapter 2 discusses.
- **Fatigue.** Life depends steeply on stress and strain, and the wire's stroke can drift with use, as Chapter 8 discusses.

For VL-25, which operates rarely, is battery-backed but not battery-limited, and benefits from silence and sealing, the trade is a good one. For a mechanism that cycles every second, runs from a small battery or must move far, it usually is not.

### Composition and processing

Nickel-titanium is close to equal parts nickel and titanium by atoms, and its transformation temperatures are very sensitive to the exact balance: very small changes in nickel content shift them by tens of degrees. Cold work and heat treatment change them further and set the shape the alloy remembers. That sensitivity is why wire is bought by its transformation temperatures, measured and certified for each lot, rather than by its nominal composition, and why a designer should never assume that two wires of the same nominal grade from different lots or makers behave identically.

## Exercise: a superelastic comparison

A superelastic nickel-titanium wire and a spring steel wire of the same 0.25 mm diameter are each to be bent around a pin so that their outer surfaces see a strain of 3%. Spring steel's elastic limit corresponds to a strain of the order of 1%.

1. Which wire survives without permanent set, and why?
2. If the pin is chosen so that the strain is 1.5%, what is the pin diameter, taking strain as wire diameter divided by bend diameter?

**Worked answer.**

1. The superelastic wire. At 3% strain, spring steel is well past its elastic limit and stays bent. Superelastic nickel-titanium accommodates the strain by transforming to martensite on its plateau and transforms back when the bend is released. The superelastic data sheet in the references gives a permanent set of no more than 0.2% after 6% strain, which illustrates how far it can go.
2. Bending strain at the outer surface is d / D, where D is the bend diameter to the wire's centreline. For 1.5%, D = 0.25 / 0.015 = **16.7 mm**. For 3%, D = 8.3 mm. A pin about 8 mm in diameter would be fine for the superelastic wire and would permanently bend the steel one.
