---
book: magnetic-workholding-by-the-numbers
chapterSlug: grinding-on-a-magnetic-chuck
order: 6
title: "Grinding on a magnetic chuck"
description: "Surface grinding forces against magnetic holding, why a bowed part ground flat on the chuck springs back, thermal bow from grinding heat, chuck heating, and measuring at the right temperature."
draft: false
---

The magnetic chuck and the surface grinder grew up together. Grinding forces are small, the chuck face is ground flat in place on the machine it serves, and a part can be loaded, ground, turned over and ground again in a few seconds. Holding force is rarely the problem on a grinder. Flatness is. A chuck that holds a part firmly also pulls it flat, and a part that is ground flat while it is held flat may not be flat once it is released.

This chapter checks the grinding forces on BP-600's rail seats with the KEVOS® surface grinding planner, then deals with the three things that spoil flatness on a magnetic chuck: spring-back of a bowed part, thermal bow from grinding heat, and the temperature at which the part is measured. The error is a batch of rail seats that measured flat on the machine and not flat the next morning.

## Grinding forces and the chuck

The KEVOS® [surface grinding planner](/tools/surface-grinding-planner/) plans a reciprocating surface grinding operation with the wheel covering the width ground. It checks the wheel's surface speed against its marked maximum, calculates the contact length and equivalent chip thickness, the removal rate, and the grinding power from the specific grinding energy entered, against the spindle's power, and counts passes and time, including spark-out passes.

This is an illustration. BP-600's two rail seats are each 80 mm wide and 600 mm long, ground with a 350 mm wheel at 1,750 rpm, a table speed of 15 m/min and 0.008 mm per pass, removing 0.1 mm of stock with two spark-out passes. The shop uses a specific grinding energy of 30 J/mm³ for this steel and wheel. The spindle motor is 7.5 kW at 80% efficiency.

```figure
type: stats
title: Grinding one BP-600 rail seat, from the surface grinding planner
caption: This is an illustration. The tool's results for the inputs above. The tangential force is the grinding power divided by the wheel speed; the normal force uses an assumed normal-to-tangential ratio of 2, typical of the range seen in surface grinding of steel.
- 32.1 m/s | wheel speed, within the wheel's 35 m/s marking
- 160 mm³/s | removal rate
- 4.8 kW | grinding power, against 6.0 kW available
- 15 passes and 0.65 min | including two spark-out passes
- 150 N | tangential grinding force, 4,800 W ÷ 32.07 m/s
- About 300 N | normal force pressing the part onto the chuck
```

The grinder has a fine-pole electromagnetic chuck. On BP-600's milled face, with the fine-pole chuck's own fitted equivalent gap of 0.1 mm, the shop's estimate of the normal force is about 17 kN; with coolant, μ = 0.1, the sliding resistance is about 1.7 kN against a tangential force of 150 N. The safety factor against sliding is over 10. The grinder also has a fixed backstop at the end of the chuck, which takes the tangential force anyway. Holding is not the issue.

## Spring-back: the chuck pulls the part flat

The first face of BP-600 is milled with the plate's rolling stresses still in it. Removing metal from one face releases part of those stresses and the plate bows slightly. This is an illustration. BP-600 plates typically come off the mill with a bow of about 0.12 mm along their 600 mm length after the first face is cut.

When the bowed plate is put on the grinder's chuck and the chuck is switched on, the magnet pulls it down. Treating the plate as a beam supported at its ends, the force needed at its centre to remove a 0.12 mm bow is:

F = 48 × 200,000 × 520,833 × 0.12 ÷ 600³ = 2.8 kN

The chuck's 17 kN is six times that. The plate is pulled flat, the grinder grinds a flat face on the flattened plate, and when the chuck is switched off the plate springs back to very nearly its original bow. The ground face, flat while held, is now curved by close to 0.12 mm, twelve times the rail seats' 0.01 mm flatness tolerance.

```figure
type: steps
title: How a bowed part comes off the chuck bowed
caption: This is an illustration. The part's own elasticity undoes the flattening once the magnetic force is removed. Grinding removes too little metal to change the plate's stiffness or stresses much.
- Plate bowed 0.12 mm after milling | locked-in stresses partly released
- Chuck switched on | 17 kN pull against 2.8 kN needed to flatten: the plate is pulled flat
- Rail seats ground flat | flat relative to the chuck while held
- Chuck switched off | the plate springs back towards its bow
- * Rail seats measured on a surface plate | curved by about the original bow
```

### Grinding a bowed part flat

The remedy is to hold the part without bending it. Three practices work, often together:

- **Shim the gaps.** With the chuck off, place the plate on the chuck, find where it stands clear of the face with feeler gauges, and fill those gaps with shims or paper so that the plate is supported in its bowed shape. When the chuck is switched on, the plate is pulled onto the shims, not bent. The first face ground is then genuinely flat in the free state.
- **Reduce the holding force.** Electromagnetic chucks can usually be switched to a lower power. The force falls roughly as the square of the coil current while the steel is below saturation, so half current gives about a quarter of the force: about 4.3 kN here, still well above the grinding forces but less likely to pull a shimmed part out of shape.
- **Turn and repeat.** Grind a little off the first face, turn the plate over, grind a little off the second, and repeat, so that the stresses released by each cut are balanced and each face is ground with the other already nearly flat. Two or three turns usually settle the plate.

Stress relieving the plate before finish grinding, by heat treatment, removes the cause; it is the right answer for parts with tight flatness tolerances on both faces, and it costs time and money that the other methods do not.

## Thermal bow from grinding heat

Grinding puts its power into the part's surface as heat. Most of the 4.8 kW goes into the chips, wheel and coolant, but some goes into the plate, and it goes in from the top. If the ground face is warmer than the face on the chuck, the top expands more than the bottom and the plate bows upwards in the middle. The grinder grinds the bulge off. When the plate cools to a uniform temperature, the ground face is concave.

For a plate of thickness t and length L with a temperature difference ΔT between its faces, the bow is approximately α × ΔT × L² ÷ 8t, where α is the coefficient of thermal expansion.

```figure
type: bars
title: Thermal bow of BP-600 along its 600 mm length by top-to-bottom temperature difference
unit: µm
max: 45
caption: Calculated from α × ΔT × L² ÷ 8t with α = 11.5 µm/m·K, L = 600 mm and t = 25 mm. Half a degree of difference between the faces uses the whole 0.01 mm flatness tolerance.
- 0.25 °C | 5.2
- * 0.5 °C | 10.3
- 1 °C | 20.7
- 2 °C | 41.4
```

A temperature difference of half a degree between the faces of a plate on a grinder is easy to produce. Flood coolant at a steady temperature, light finishing passes, and spark-out passes after the last infeed all reduce it; so does waiting with the coolant running before the final passes, to let the plate settle.

## The chuck's own heat

An electromagnetic chuck's coils dissipate power for as long as the chuck is on: typically hundreds of watts on a chuck of this size. That heat warms the chuck and, through the contact, the bottom of the part. A part that sits on a warm chuck for several minutes has a warm bottom face and a cooler top, the reverse of grinding heat, and bows the other way. It also grows: a plate warmed by a few degrees is measurably longer and wider.

Two practices control this. The first is to leave the chuck and coolant running for long enough before precision work for the chuck to reach a steady temperature, and to keep coolant flowing over the chuck between parts. The second is to choose a chuck that does not heat: an electro-permanent chuck draws power only for a moment when it is switched on or off, and adds no heat while holding. Chapter 7 compares the types.

## Measuring at the right temperature

A part measured warm reads large. The KEVOS® [measurement temperature error tool](/tools/measurement-temperature-error/) calculates the apparent size error when the part and the gauge are at temperatures other than the 20 °C reference: the difference of their expansions, the size corrected to 20 °C, the share of the tolerance the error uses, and the temperature difference that would keep the error within a chosen share.

This is an illustration. The distance between the two rail seats' reference edges is 300 mm with a tolerance of 0.02 mm. Measured straight off the grinder, the plate is at 26 °C and the steel gauge at 20 °C.

```figure
type: compare
title: Apparent error in the 300 mm rail spacing, from the measurement temperature error tool
cols: Apparent deviation, µm | Share of the 0.02 mm tolerance
rowhead: Part and gauge temperatures
- * Part 26 °C, gauge 20 °C | 20.7 | 104%
- Part 26 °C, gauge 21 °C | 17.3 | 86%
- Part and gauge both at 20 °C | 0 | 0%
caption: This is an illustration. Steel part and steel gauge, both 11.5 µm/m·K. The tool flags both warm readings against a target of 10% of the tolerance and advises correcting or waiting for temperature.
```

The error equals the whole tolerance. A plate measured warm and accepted on the reading could be out of tolerance once it cools, and a plate rejected warm could be in tolerance. The shop's rule is that rail-seat spacing and flatness are measured only after the plate has stood beside the surface plate for long enough to reach the room's temperature, and the time is written on the inspection record.

## Checking flatness in the free state on the machine

The on-machine check can still be useful if it is made in the free state. After the last spark-out pass, the operator switches the chuck to its lowest setting or off, leaves the plate resting on its shims under its own weight, and sweeps the indicator along the seat again. A plate that springs back shows it at once, while it is still on the machine and can be reground. The free-state sweep is not a substitute for the final check on the surface plate, because the plate is still warm and still resting on a chuck that may not be at room temperature, but it catches spring-back, which is the largest error.

The case's shop adds one more step for the first plate of each batch: the plate is checked on the surface plate after soaking before the rest of the batch is ground. If the first plate passes, the shims, power setting and turning sequence are recorded on the operation sheet and repeated. If it fails, the set-up is changed before nineteen more plates are made the same way.

## Thin parts on the grinder

Thin parts show every effect in this chapter more strongly. From Chapter 3, the force needed to flatten a plate falls as the cube of its thickness, so a 6 mm plate is pulled flat by a few hundred newtons, and even a fine-pole chuck at low power flattens it completely. Spring-back is then certain, and shimming is difficult because the gaps under a thin, wavy plate are small and many.

For thin parts that must be flat in the free state, shops use a few established approaches. Grinding both faces alternately in several light passes balances the stresses. Holding the part at very low chuck power, with a backstop taking the grinding force, reduces the flattening. Bonding the part to a carrier plate with wax or a low-melting adhesive, and holding the carrier on the chuck, removes the magnet from the part altogether. Vacuum chucks are another option for thin parts, with their own limits, as Chapter 5 showed. Which works best depends on the part, and the first-part check on the surface plate is the way to find out.

Thin hardened parts also keep more residual magnetism, and thin parts with residual magnetism pick up grinding swarf that scratches the next face ground. Chapter 10 deals with demagnetising.

## The error: flat on the machine, not on the table

This is an illustration. The first batch of 20 BP-600 plates was ground with the chuck at full power, no shims, and the rail seats were checked on the machine with a dial indicator swept along each seat. Every seat read within 0.004 mm. The next morning, on the surface plate, the seats measured between 0.06 and 0.13 mm out of flat, all bowed in the same direction as the plates had been after milling.

The supervisor's analysis separated the causes. Spring-back of the milling bow explained almost all of it: the plates' bows after milling had been 0.07 to 0.14 mm, and the seats' errors followed them plate by plate. Thermal bow from grinding added a little, of the order of the 0.01 mm the bars above suggest for half a degree. The on-machine check had been measuring flatness relative to the chuck while the chuck was pulling the plate flat, which is exactly the condition that hides spring-back.

The batch was reground with shims under each plate's gaps, at half power, turning the plate twice, and then checked on the surface plate after temperature soaking. All 20 passed. The shop changed the operation sheet: rail-seat flatness is never accepted on the machine.

## Exercise: setting the measuring rule

This is an illustration. Using the measurement temperature error tool's formula, for the 300 mm rail spacing with a 0.02 mm tolerance:

1. What temperature difference between the steel part and the steel gauge keeps the apparent error within 10% of the tolerance?
2. A plate comes off the grinder at 26 °C into a 20 °C room. If it cools with a time constant of 40 minutes, roughly how long must it wait to come within that difference?

**Worked answer.**

1. The allowed error is 10% × 0.02 mm = 2 µm, so ΔT = 2 ÷ (300 × 11.5 × 10⁻³) = **0.58 °C**.
2. The excess temperature falls as 6 × e^(−t ÷ 40). Setting 6 × e^(−t ÷ 40) = 0.58 gives t = 40 × ln(6 ÷ 0.58) = **about 94 minutes**. The shop's rule of soaking for two hours is consistent with this.
