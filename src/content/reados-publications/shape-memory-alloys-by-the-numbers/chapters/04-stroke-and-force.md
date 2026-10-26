---
book: shape-memory-alloys-by-the-numbers
chapterSlug: stroke-and-force
order: 4
title: "Stroke and force from a wire"
description: "Size an actuator wire's length from its working strain and its diameter from the maker's stress guidelines, weigh parallel wires and levers, and catch a compact wire run at 6% that lost its stroke."
draft: false
---

An actuator wire has two dimensions to choose, and each sets one output. Its length sets the stroke, because the wire contracts by a percentage of its length. Its diameter sets the force, because the wire is safe up to a stress, and force is stress times area. Everything else, current, cooling time, life, follows from those two choices and from how hard the wire is worked within them.

This chapter sizes VL-25's wire from the stroke and force the latch needs, using a wire maker's published table, compares one wire with several thinner ones and with a lever, and records a compact design that used the whole of the wire's strain and lost its stroke within a few thousand operations.

## Stroke from length

A wire that is stretched cool by a strain ε and then heated recovers that strain, so its stroke is ε times its length. The question is how large ε may be.

Nickel-titanium can recover strains of several per cent in a single cycle, but recovering them repeatedly is another matter. The actuator wire maker's data, listed in the references, describes repeatable motion of typically 2% to 6% of the working length as reasonable for tens of millions of cycles when the wire is used within its guidelines, and warns that at higher stresses or strains the motion may last only hundreds or a few thousand cycles. Within that range, lower strain means longer, more stable life, as Chapter 8 discusses.

```figure
type: formula
title: Wire length for a required stroke
formula: L = s / ε
caption: This is an illustration for VL-25. The latch needs 4.0 mm of travel. Ends that run cool near the terminations, from Chapter 3, reduce the effective length by a few per cent, so the wire is made a little longer than the minimum.
- s | Required stroke, 4.0 mm
- ε | Working strain, a fraction
- L | Working length between terminations, mm
step: At 6%: L = 4.0 / 0.06 = 66.7 mm
step: At 3.5%: L = 4.0 / 0.035 = 114 mm
step: VL-25 uses 150 mm: ε = 4.0 / 150 = 2.67%
```

This is an illustration. VL-25's designer chose a working strain of no more than 3.5% for a long, stable life, giving a minimum length of 114 mm, and then used 150 mm, the length that fitted the latch's housing, giving a working strain of 2.67%. The extra length also covers the few per cent lost at the cool ends.

## Force from diameter

The wire maker publishes, for each diameter, a heating pull force based on 172 MPa, which it describes as the maximum safe stress for many applications, and a cooling deformation force based on 70 MPa, a good starting point for the force needed to re-stretch the cool wire. Converted from the published grams to newtons:

```figure
type: compare
title: Published actuator wire data by diameter
cols: Heating pull force | Cooling deformation force | Resistance | Current for 1 s contraction
caption: From the actuator wire maker's published table listed in the references, with forces converted from grams to newtons. Heating force is based on 172 MPa and cooling force on 70 MPa; currents and times depend on ambient conditions.
- 0.15 mm | 3.15 N | 1.26 N | 55 Ω/m | 410 mA
- 0.20 mm | 5.59 N | 2.24 N | 29 Ω/m | 660 mA
- *0.25 mm | 8.74 N | 3.49 N | 18.5 Ω/m | 1,050 mA
- 0.31 mm | 12.56 N | 5.02 N | 12.2 Ω/m | 1,500 mA
- 0.38 mm | 22.07 N | 8.83 N | 8.3 Ω/m | 2,250 mA
```

VL-25's latch needs the wire to pull 7.5 N at the start of its stroke: 3.5 N of bias preload and 4.0 N of latch friction. The 0.20 mm wire, at 5.59 N, cannot. The 0.25 mm wire, at 8.74 N, can, at 148 MPa, which is 86% of the guideline stress. The 0.31 mm wire would give more margin, but it needs half as much current again, cools more slowly, as Chapter 7 shows, and its cooling deformation force of 5.0 N would need a stronger bias spring. The designer chose 0.25 mm and set out to reduce the latch's friction, which Chapter 3's exercise showed was worth more than a thicker wire.

### Checking the bias spring against the table

The table's cooling deformation force is a check on the bias spring. To re-stretch the cool wire fully, the spring must pull at least about the cooling force for the wire's diameter. For 0.25 mm wire, that is 3.49 N, and VL-25's 3.5 N preload matches it almost exactly. A weaker spring might leave the cool wire short, reducing the next stroke; a much stronger one would add to the load the hot wire must pull. Chapter 5 designs the spring properly.

### Where the force goes during the stroke

The wire's force is not constant over its stroke, and the peak is what sizes it. At the start, the wire must overcome the latch pin's static friction, which is highest while the flap's pressure presses the pin into its keeper, plus the bias preload: 7.5 N in VL-25. Once the pin begins to move, friction falls to its sliding value, and the bias spring's force rises slowly as it is compressed, reaching 4.3 N at the end of the 4.0 mm stroke. The wire's stress therefore starts near 148 MPa and falls towards 85 MPa.

That profile suggests where effort pays. A latch whose static friction could be halved, by a roller on the pin, a ramp that lets the flap's pressure push the pin out, or a harder, smoother keeper, would lower the peak stress more than any change to the wire, and Chapter 3's exercise showed that it would also lower the temperature the wire must reach. In wire actuator design, the mechanism the wire drives is usually the place to find margin, because the wire itself has so little to spare.

## Several thin wires or one thick one

Force can also be had from several thin wires working in parallel, each carrying its share. Three 0.15 mm wires give 3 × 3.15 = **9.45 N**, a little more than one 0.25 mm wire's 8.74 N. The trade is mostly about cooling: thin wires have more surface for their volume and cool faster. The maker's table gives cooling times of about 1.7 s for 0.15 mm wire of the 90 °C grade, against 4.5 s for 0.25 mm. Three thin wires reset in well under half the time.

The costs are more terminations, more care to share load equally, since a slack wire carries nothing until the others have stretched, and more current in total: three wires at 410 mA draw 1.23 A, a little more than the single wire's 1,050 mA. For VL-25, whose reset time requirement of 10 s is generous, one wire is simpler. For a mechanism that must cycle quickly, parallel thin wires are often the answer. Thin wires are also more forgiving of a stiff terminal or a tight bend, since their bending strain over a given radius is smaller, but they are easier to damage in handling and assembly, and a single kinked strand in a parallel set leaves the others overloaded.

## Trading force for stroke

When a design needs more stroke than a wire of convenient length gives, a lever or pulley can multiply it, at the cost of force. A 2:1 lever turns 2 mm of wire stroke into 4 mm at the latch, but the wire must then pull twice the latch's force. For VL-25, that would be 15.0 N at the start of the stroke, about 296 MPa in a 0.25 mm wire, far beyond the guideline; it would need a 0.38 mm wire or two 0.25 mm wires. Levers suit applications with small forces and long strokes; VL-25 has a moderate force and a short stroke, and a direct pull is best.

A wire can also be lengthened within a small space by running it around pulleys. The wire bends as it passes round each pulley, adding a bending strain of the wire's diameter divided by the pulley's diameter to the working strain on the outer surface. The pulley must be large enough that this extra strain is small compared with the working strain, and the wire maker's guidance on minimum bend radius should be followed.

## The error: a compact wire at 6%

This is an illustration. VL-25's first concept, drawn to fit a smaller housing, used a 67 mm wire to give the 4.0 mm stroke, a working strain of 6%, at the top of the range the maker describes. Bench prototypes worked perfectly on their first operations, releasing the latch with a crisp 4 mm pull.

In the endurance test, cycling the latch every minute, the stroke began to fall within a few hundred operations and was down to about 3.2 mm, not enough to clear the latch, after about 3,000. The wires had not broken; they had stopped recovering their full strain. The maker's data had warned of exactly this: at the top of the strain range and at high stress, good motion may last only hundreds or a few thousand cycles. The concept's wire also ran at 148 MPa, near the stress guideline, which compounds the effect.

The design was changed to the 150 mm wire at 2.67%, with the housing lengthened to fit, and a repeat endurance test of 40,000 operations, twice the requirement, showed the stroke settling to about 3.9 mm after the first few hundred operations and staying there. The extra 83 mm of housing cost little; the four weeks spent discovering the problem in an endurance test cost more, and would have cost far more in the field. The lesson recorded was that the upper end of a published strain range is a limit for short lives, not a design point for long ones, and that a compact design that spends all of a wire's strain on its first stroke has nothing left for its ten-thousandth.

## Measuring the stroke you actually get

A wire's stroke on its first operation is not its working stroke. Most actuator wires settle over their first tens to hundreds of cycles, losing a little stroke as their microstructure adjusts, and then hold a stable value. Wire supplied trained for actuator use has had much of that settling done by the supplier, but some always remains. The useful number for design is the settled stroke, measured on the real mechanism after it has run in.

```figure
type: compare
title: Stroke against operations in the endurance tests
cols: 67 mm wire at 6% | 150 mm wire at 2.67%
caption: This is an illustration from the fictional endurance tests, latch cycled once a minute at 20 °C with its bias spring. The 6% concept fell below the 3.6 mm needed to clear the latch; the final design settled at about 3.9 mm.
- First operation | 4.0 mm | 4.0 mm
- 100 operations | 3.8 mm | 3.95 mm
- 1,000 operations | 3.5 mm | 3.9 mm
- *3,000 operations | 3.2 mm, latch not cleared | 3.9 mm
- 40,000 operations | test stopped | 3.88 mm
```

The latch needs 3.6 mm of pin travel to clear, so the final design has about 0.3 mm of margin on settled stroke. That margin is thin enough that the team made the latch's clearance travel a controlled dimension on its drawing, and added a stroke check to the production test in Chapter 9.

## Mounting the wire

A wire actuator's mechanical details decide whether its calculated stroke and force reach the load. Four points mattered in VL-25:

- **Straight pull.** The wire should pull in a straight line from its fixed end to the moving part. A wire that pulls at an angle loses stroke to geometry and rubs where it changes direction.
- **Terminations.** Crimped terminals, made with the supplier's recommended crimps and tools, grip the wire without heating it. The wire must not be soldered or welded near its working length, because heat changes its properties; Chapter 8 records what happens when it is.
- **Electrical isolation.** The wire carries current, so it must not touch the metal latch or housing between its terminals, or the current will bypass part of it. VL-25 runs the wire through a small PTFE guide where it passes the latch body.
- **Overtravel protection.** If the moving part reaches a stop before the wire has finished contracting, the wire's stress rises steeply. Chapter 5 deals with stops and why the wire must never be blocked hard.

## A sizing routine

Pulling the chapter together, VL-25's wire was sized in this order, which works for most wire actuators:

1. **Stroke and force at the load**, including friction at its worst, from tests of the mechanism.
2. **Working strain** for the life required, from the maker's guidance, usually towards the lower half of the range for long lives.
3. **Length** from stroke and strain, plus an allowance for cool ends.
4. **Diameter** from the peak force at a stress comfortably below the maker's guideline, with the option of parallel wires if cooling time matters.
5. **Bias spring** checked against the cooling deformation force for that diameter, then designed in detail as in Chapter 5.
6. **Current, cooling and life** checked in Chapters 6 to 8, with the design revisited if any fails.

## Exercise: a longer stroke

A variant of VL-25 needs 6.0 mm of stroke at the same forces, in a housing that fits a wire no longer than 180 mm.

1. What working strain does a 180 mm wire need, and is it acceptable for a long life?
2. If not, what would you do?

**Worked answer.**

1. ε = 6.0 / 180 = **3.33%**, inside the 2% to 6% range and below VL-25's own 3.5% limit, so a 180 mm wire is acceptable on strain. Allowing for cool ends of about 2 mm each, the effective length is about 176 mm and the effective strain about 3.4%, still below 3.5%.
2. It is acceptable, with less margin than VL-25's 2.67%. The endurance test should be repeated for the variant, since life depends steeply on strain. If the housing could only fit 150 mm, the strain would be 4%, and a better option than working the wire harder would be to route it round a single pulley of suitable diameter to fit a longer wire in the same space, checking the added bending strain. Either way, the variant's settled stroke should be measured on a run-in prototype before its latch clearance is fixed on the drawing, as it was for VL-25.
