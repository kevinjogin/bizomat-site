---
book: shape-memory-alloys-by-the-numbers
chapterSlug: bias-springs-and-stops
order: 5
title: "Bias springs, dead loads and hard stops"
description: "Choose how to re-stretch a cool wire, with a weight, a spring or a second wire, size the bias spring's preload and rate, and catch a hard stop that blocked the wire and overloaded it."
draft: false
---

A shape memory wire only pulls. Once it has contracted and cooled, something else must stretch it out again, ready for the next operation. That something is the bias, and its design decides more about the actuator than the wire's own diameter does: how much stroke the wire gives, how much stress it carries at each point of its travel, how hot it must get, how cool it must fall, and how long it lasts.

This chapter compares the three ways of providing bias, a constant force, a spring and a second wire, explains why a spring makes the wire behave more steadily than a weight, sizes VL-25's bias spring, and records a stop that was set slightly short and quietly destroyed a batch of wires.

## A constant force and a spring

The thermodynamics text listed in the references spends a chapter on bars loaded in two different ways. One is a **dead load**, a constant force whatever the bar's length, like a hanging weight. The other is a **hard device**, which controls the bar's length, so that the force is whatever the bar exerts at that length. The same bar, with the same material, behaves differently in the two: under a dead load, a material whose stress–strain curve has a flat or falling region can jump suddenly from one strain to another; in a hard device, it passes through that region steadily, splitting into regions at different strains.

An actuator's bias lies somewhere between those extremes. A weight is a dead load: the wire carries the same stress at every point of its stroke. A spring is between the two: its force rises as the wire shortens, so the stress the wire must overcome increases along the stroke. A stiff spring approaches a hard device.

The difference shows in how the wire contracts. Under a weight, the transformation, once started, can run through the whole wire at one stress, so the wire tends to jump through its stroke as it passes a temperature. Under a spring, each bit of contraction raises the force and requires a little more temperature, so the wire contracts progressively over a range of temperature. For a two-position latch, either is acceptable. For anything that must move smoothly, the spring's steadier behaviour is an advantage.

```figure
type: compare
title: Three ways to bias an actuator wire
cols: Wire stress over the stroke | Behaviour | Practical points
caption: This is an illustration for VL-25's 0.254 mm wire. A weight is rarely practical in a cabinet but shows the ideal; a spring is the usual choice; a second wire gives two powered directions.
- Weight, 3.5 N | constant 69 MPa | can jump through its stroke at one temperature | bulky, orientation-dependent, but the gentlest on the wire
- *Spring, 3.5 N preload, 0.2 N/mm | 69 MPa cool, up to 85 MPa at full stroke | contracts progressively as temperature rises | compact; rate and preload must be chosen
- Second wire, opposed | depends on both wires' states | powered in both directions; each wire stretches the other | two drives, more heat, and neither wire may be heated with the other blocked
```

### Load lines

A graphical way to see an actuator's operation is to draw the wire's cool and hot stress–strain curves on one chart and the bias as a load line across them. For a weight, the load line is horizontal, at the weight's stress. For a spring, it slopes: its stress is highest where the wire is shortest. The actuator's two resting states are where the load line crosses the cool curve, the long wire, and the hot curve, the short wire, and the stroke is the horizontal distance between those crossings.

Read this way, the bias design becomes a matter of placing a line. Raise the line, with a stronger preload, and the cool crossing moves to a longer wire, more stroke, but the hot crossing moves up the hot curve, more stress. Steepen the line, with a stiffer spring, and the hot crossing climbs faster than the cool one, more stress for little extra stroke. The best line for a long life crosses the cool curve on its flat plateau, so the wire is fully re-stretched, and crosses the hot curve as low as possible. VL-25's soft spring does both.

## Sizing the bias spring

A bias spring has two numbers: its preload, the force when the wire is cool and long, and its rate, the force it adds per millimetre as the wire shortens.

**The preload** must re-stretch the cool wire fully, against the cool wire's deformation stress. Chapter 4's table gives about 3.49 N for 0.25 mm wire at the maker's 70 MPa starting point. This is an illustration. VL-25 uses 3.5 N, a stress of 69 MPa.

**The rate** sets how much the spring adds over the stroke. Every newton it adds is a newton the hot wire must pull and a rise in the temperature it must reach. The designer compared three rates:

```figure
type: formula
title: Wire stress at the end of the stroke with a spring bias
formula: σ_end = (P₀ + k s) / A
caption: This is an illustration for VL-25: preload P₀ = 3.5 N, stroke s = 4.0 mm, wire area A = 0.0507 mm². The latch friction acts only at the start, so at the end of the stroke the spring alone loads the wire.
- P₀ | Spring preload with the wire cool and long, N
- k | Spring rate, N per mm
- s | Stroke, mm
step: k = 0.2 N/mm: σ_end = 4.3 / 0.0507 = 85 MPa
step: k = 0.5 N/mm: σ_end = 5.5 / 0.0507 = 108 MPa
step: k = 1.2 N/mm: σ_end = 8.3 / 0.0507 = 164 MPa
```

With the soft spring, 0.2 N/mm, the wire's stress is highest at the start of the stroke, 148 MPa with the latch friction, and falls to 85 MPa as the latch releases. With the stiff spring, 1.2 N/mm, the stress at the end of the stroke climbs to 164 MPa, close to the 172 MPa guideline, so the wire carries a high stress at both ends of its travel. A stiff spring also raises the loaded Af at the end of the stroke to about 90 + 164 / 6.5 = 115 °C, from Chapter 3's relation, closing the margin to the 120 °C heating target.

The soft spring wins on every count but one: it gives a weaker push when the latch must re-engage. VL-25's latch is re-engaged by the flap being pushed shut, which moves the pin mechanically, so the spring only needs to restore the wire, not to drive the latch. The designer chose 0.2 N/mm. A design in which the bias spring must also do useful work on the return stroke would need to balance the two.

### Preload set too low

A preload below the cool deformation force leaves the wire partly unstretched, and the next stroke is shorter by that amount. Because the cool martensite's plateau stress varies from lot to lot and with temperature, a preload exactly at the nominal value can be marginal. VL-25's 3.5 N sits right at the table's figure, and the team checked it on wire from three lots at the coldest cabinet temperature, 0 °C, where martensite is fully formed and the plateau is well defined, and found full re-stretching on all three.

### The spring's own tolerance

A bias spring is a bought part with its own tolerances, and those tolerances land directly on the wire. Compression springs are commonly supplied with a load tolerance of the order of ±10% at a stated length. This is an illustration. For VL-25's 3.5 N preload, ±10% means 3.15 to 3.85 N. At the low end, the spring is about 10% below the 3.49 N cool deformation force for 0.25 mm wire, and in the team's tests a 3.15 N spring left the cool wire about 0.2 mm short of full length, cutting the next stroke by the same amount. At the high end, 3.85 N adds 0.35 N to the start-of-stroke load, raising the peak stress from 148 to about 155 MPa.

The team tightened the spring's specification to 3.5 N ± 5% at the installed length, checked on a sample from each spring lot, and chose a stainless steel spring for the outdoor cabinet, since a corroding spring loses load over the years. A spring is easy to treat as an afterthought; in a wire actuator it is half the mechanism.

```figure
type: checklist
title: VL-25 bias and stop checks
caption: This is an illustration of the checks the team now applies to every wire actuator design. Each is cheap to verify on a drawing or a prototype and expensive to discover in the field.
- x Preload at least the cool deformation force | 3.5 N against 3.49 N, ±5% spring tolerance
- x Peak stress below the guideline | 148 MPa at the start of the stroke against 172 MPa
- x Stress at the end of the stroke | 85 MPa with the 0.2 N/mm spring
- x Stop beyond the wire's free stroke | stop at 4.2 mm against 3.9 mm settled stroke
- x Over-stroke link in series | wire stress limited if the stop is reached early
- ? Opposed wires never heated together | not applicable to VL-25; required in any two-wire design
```

## Stops and why the wire must never be blocked

Most actuators have a mechanical stop at the end of their travel, to locate the moving part. A stop is safe only if the wire has finished contracting before the moving part reaches it, or if something in the load path can give way when it is reached.

If the stop is reached while the wire still has strain left to recover, the wire is blocked. It is now heated in a hard device in the fullest sense: its length is fixed, and as its temperature rises, its transformation tries to shorten it and, prevented, generates stress instead. Blocked nickel-titanium can develop stresses of several hundred megapascals, far above the 172 MPa guideline, and the high stress damages its ability to recover strain, which Chapter 8 calls functional fatigue.

A rough estimate shows the scale. If VL-25's wire were stopped 1.0 mm short of its 4.0 mm free stroke, the unrecovered strain would be 1.0 / 150 = 0.67%. Resisted by austenite with a Young's modulus of 41 to 75 GPa, that strain corresponds to an extra stress of roughly 270 to 500 MPa, on top of the load already there. The estimate is crude, since the transformation and the elasticity interact, but it makes the point: a blocked wire is overloaded several times over.

## The error: a stop set short

This is an illustration. VL-25's drawing places the pin's open stop at 4.2 mm of travel, beyond the wire's settled free stroke of about 3.9 mm from Chapter 4, so that the wire always finishes before the pin reaches the stop. In the first production batch, the latch body's stop face was moulded about 0.5 mm closer than drawn, because a tool insert had been fitted the wrong way round. Pins now stopped at 3.7 mm. That was still more than the 3.6 mm needed to clear the keeper, so every latch passed its release test.

But every wire in the batch was now blocked by about 0.2 mm, the difference between its 3.9 mm free stroke and the 3.7 mm stop, at the end of every operation. An unrecovered strain of 0.2 / 150 = 0.13%, resisted by austenite, adds roughly 55 to 100 MPa to the 85 MPa the spring already applies at that point, taking the wire to something like 140 to 185 MPa at the end of every stroke, at or above the maker's guideline. The production endurance sample, run for 5,000 operations, showed its stroke falling steadily, from 3.9 mm towards 3.75 mm, eating into the 0.3 mm margin over the latch's clearance; the 150 mm wire in the design's own endurance test had held 3.88 mm for 40,000. Measuring the stop position on the batch's latch bodies found the cause.

The tool insert was corrected, and the batch's latch bodies were scrapped with their wires. A 0.5 mm moulding error had quietly turned a well-margined design into one that wore itself out. Two design changes followed:

1. **Over-stroke protection.** The pin is now connected to the wire through a small compliant link, a light spring in series that compresses if the pin meets its stop before the wire has finished, so that the wire's stress at a blocked stop rises only to the link spring's force, below the 172 MPa guideline. Over-stroke protection of this kind is a standard feature of well-designed wire actuators.
2. **A stop check.** The stop position became a critical dimension on the latch body's drawing, with a go/no-go gauge in incoming inspection.

The team also wrote down the general rule: in a shape memory actuator, the wire must always be the part that finishes moving last, or something must give before it does.

## Opposed wires

Some mechanisms need power in both directions: a valve that must be driven open and driven shut, or a mechanism that must not rely on a spring's stored energy. Two wires opposing each other provide it, each heated in turn and each re-stretching the other as it cools. The design rules are the same as for a spring bias, with one addition: the two wires must never be heated at the same time, because each would then be blocked by the other, and the electronics must make that impossible, not merely unlikely.

## Exercise: a dead weight in a test rig

For a laboratory test of VL-25's wire, a technician hangs a 3.5 N weight from the wire in place of the bias spring and heats it slowly with a controlled current.

1. What stress does the wire carry throughout the test, and over what temperature range would you expect it to contract?
2. How would the contraction differ from that in the latch with its 0.2 N/mm spring?

**Worked answer.**

1. The weight gives a constant 3.5 / 0.0507 = **69 MPa**. From Chapter 3, the loaded As and Af are about 82 + 10.6 = **92.6 °C** and 90 + 10.6 = **100.6 °C**, so the wire contracts between about 93 and 101 °C.
2. Under the constant weight, the transformation runs at one stress, and once it starts it can progress quickly through much of the wire within a narrow temperature band, sometimes as visible bands moving along the wire. In the latch, the spring's force rises from 3.5 to 4.3 N over the stroke, raising the stress from 69 to 85 MPa and the loaded Af from about 101 to 103 °C, so the contraction is spread over a slightly wider and higher range and proceeds more steadily. For a two-position latch the difference is small; for a mechanism that needs controlled motion, it is the reason to prefer a spring.
