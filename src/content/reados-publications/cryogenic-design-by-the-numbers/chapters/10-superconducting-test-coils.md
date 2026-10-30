---
book: cryogenic-design-by-the-numbers
chapterSlug: superconducting-test-coils
order: 10
title: "Superconducting test coils"
description: "What superconductivity is and its limits of temperature, field and current; a test coil’s margins, stored energy, quench detection and dump, the hot spot, and a slowed detector."
draft: false
---

CT-40 exists to test superconducting coils, and the last chapter turns to the thing it holds. A superconductor carries current with no resistance at all, which is why it is worth all the trouble of the earlier chapters: a coil that would dissipate kilowatts as copper dissipates nothing in its windings. But that state has limits of temperature, magnetic field and current density, and when a coil crosses them, part of it becomes resistive in milliseconds. The energy stored in the coil's magnetic field then has to go somewhere, and if it goes into a small resistive spot, the coil can be destroyed.

This chapter explains, briefly and in engineering terms, what superconductivity is and where its limits come from, sets out the margins of CT-40's test coil at 40 K, calculates the energy it stores and how a dump resistor removes it, estimates the temperature of the hot spot during a quench from NIST's copper data, and ends with a quench detector that was slowed down to stop false alarms.

## Pairs of electrons and an energy gap

In 1957 Bardeen, Cooper and Schrieffer explained conventional superconductivity. Through the lattice vibrations of Chapter 1, two electrons near the top of the metal's electron gas can feel a weak net attraction, and Cooper showed that any such attraction, however weak, binds them into pairs. The paired electrons condense into a single quantum state that moves through the lattice without scattering, so the resistance vanishes. Breaking a pair costs a definite energy, the energy gap, which for weak coupling is about 1.76 k_B T_c for each electron, where T_c is the critical temperature at which superconductivity disappears.

Abrikosov, Gor'kov and Dzyaloshinskii's text, the map behind this book, develops this theory with the methods of quantum field theory: Gor'kov's equations for the superconductor, its thermodynamics, its gap, its critical field and its response to electromagnetic fields, and the theory of superconducting alloys. Abrikosov's own earlier work explained type II superconductors, which let a magnetic field into themselves as an array of quantised flux vortices while staying superconducting around them. Every practical magnet conductor is type II, because only type II materials stay superconducting in the strong fields a coil makes.

The high-temperature superconductors are a different family. In 1987, Wu, Chu and colleagues found superconductivity near 93 K in yttrium barium copper oxide, above the boiling point of liquid nitrogen. Today's REBCO tapes, made from that family of rare-earth barium copper oxides, are the conductors CT-40's customers bring for testing. Their mechanism is not the simple weak-coupling picture above, but the engineering consequences are the same: a critical temperature, a critical field and a critical current, all linked.

## The critical surface and the margins

A superconductor stays superconducting only below a critical surface in the space of temperature, magnetic field and current density. Raise any one of the three and the others must fall. A coil is therefore designed, and tested, with margins: how far its operating current is below the critical current at its temperature and field, and how far its temperature could rise before its operating current became critical.

This is an illustration. CT-40's current test coil is a small REBCO pancake coil with an inductance of 4.0 mH. Its measured critical current at 40 K in its own field is 180 A. Operated at 100 A, it runs at 56% of its critical current. The temperature at which 100 A would become critical, its current-sharing temperature, was measured during an earlier test at about 60 K.

```figure
type: range
title: CT-40's test coil margins at 100 A
unit: K
min: 25
max: 95
caption: This is an illustration. Plate temperature from Chapter 9's budget; current-sharing temperature from the fictional coil's earlier test; the family's critical temperature of about 93 K from Wu and colleagues' 1987 discovery.
- * Plate during the test | 33.6 | 36.2 | without and with 3 W of coil heat
- Temperature margin | 36.2 | 60 | before 100 A becomes critical
- Current-sharing temperature at 100 A | 60 | 60 | the coil's measured limit
- Critical temperature at zero current and field | 93 | 93 | superconductivity lost entirely
```

The temperature margin of more than 20 K is what makes a test at 40 K comfortable for this coil. It is also why the earlier chapters' care with the plate's temperature matters: a plate at 46 K, as in Chapter 7's error, would have taken a third of the margin away.

## What a test measures

A coil test in CT-40 is mainly a measurement of the coil's critical current at a set temperature. The current is raised in steps, and at each step the voltage across the coil, after the inductive part has died away, is recorded. Below the critical current the voltage is essentially zero; near it, a small resistive voltage appears and grows steeply with current. The critical current is defined as the current at which that voltage, divided by the length of conductor, reaches a small agreed electric field, which the laboratory and its customer fix in the test plan. Because the transition is gradual, the definition matters as much as the measurement.

Each step adds heat at the coil: the small resistive dissipation near the critical current, and any heat from joints. Chapter 2 found that CT-40's plate responds to a change in heat with a time constant of about nine minutes, so the laboratory waits for the plate and the coil's own thermometers to settle at every step before the reading is taken. The test's temperature is the coil's, not the plate's: a thermometer on the coil's outer turns shows how much warmer they run than the plate when the coil carries current.

## Forces in the coil

A coil carrying current sits in its own magnetic field, and the field pushes on the current. In a solenoid or pancake coil the force acts outwards, like the pressure in a vessel, and puts the winding in hoop tension; at the ends, the field also squeezes the coil along its axis. For CT-40's small test coils at 100 A the forces are modest, but they scale with the square of the current, and in larger magnets they set the coil's structure. The windings are impregnated or clamped so that they cannot move, because a conductor that slips under force releases a little frictional heat, and in a superconductor working close to its limits, a little heat in the wrong place is enough to start a quench.

The forces also act between the coil and anything magnetic near it. That is a second reason, after the brittleness of Chapter 4, why ordinary steel fasteners and brackets are kept away from CT-40's coils: a ferromagnetic part near a coil is pulled towards the field, and a loose one can move when the current rises.

## The energy in the field

A coil carrying a current stores energy in its magnetic field, ½ L I². When the current is switched off normally, through the power supply, that energy returns to the supply or is dissipated in it slowly. When the coil quenches, part of the winding becomes resistive, and the energy has to be removed fast.

```figure
type: formula
title: Stored energy and dump of a coil
formula: E = ½ × L × I²
formula: τ = L ÷ R_dump, V = I × R_dump
caption: When a quench is detected, the power supply is disconnected and the coil's current flows through an external dump resistor, decaying with time constant τ; the resistor absorbs most of the energy, and the voltage across the coil is the current times the dump resistance.
- L | coil inductance, H
- I | current at the moment of the dump, A
- R_dump | dump resistance, Ω
```

This is an illustration. At 100 A, CT-40's 4.0 mH coil stores ½ × 0.004 × 100² = **20 J**, a modest amount. Its dump resistor is 0.5 Ω, so the current decays with a time constant of 0.004 ÷ 0.5 = **8 ms**, and the voltage across the coil at the start of the dump is 100 × 0.5 = **50 V**. The dump resistance is a compromise: a larger one empties the coil faster but raises the voltage, which the coil's insulation and the leads' feedthroughs must withstand.

Eddy currents in the copper cold plate also respond to the falling field. Copper at 34 K, with its low resistivity, carries large induced currents for a fast dump, which heat the plate and slow the field's decay slightly. For CT-40's small coil the effect is minor, but in large magnets the cryostat's metal parts are designed with slots and insulating breaks for this reason, as Chapter 4 noted.

## The hot spot

The danger in a quench is not the total energy but where it goes first. A quench starts at one spot, and until the protection acts, the coil's full current flows through that spot's resistive material. In a REBCO tape, the superconducting layer is backed by a thin copper stabiliser that carries the current when the superconductor cannot. That copper heats as I²R, too fast for the heat to escape, so its temperature rise depends only on how much current has flowed through it, and for how long.

```figure
type: formula
title: Adiabatic hot spot temperature in the stabiliser
formula: ∫ I² dt ÷ A² = ∫ [ρ_m × c(T) ÷ ρ_e(T)] dT, from T_op to T_max
caption: The left side is fixed by the current and the time to detect and dump; the right side is a property of the stabiliser, integrated from NIST's copper specific heat, with resistivity from the Wiedemann–Franz law for RRR 50. Heat spreading and current sharing with other layers are ignored, so the result is conservative.
- I² dt | from the detection delay plus half the dump time constant, A²·s
- A | stabiliser copper section, m²
- ρ_m, c, ρ_e | copper density, specific heat and electrical resistivity
```

This is an illustration. The coil's tape carries 20 µm of copper on each side of a 4 mm width, 0.16 mm² in all, so 100 A is a current density of 625 A/mm² in the copper. The current flows at full value for the detection delay and then decays with the 8 ms dump, which adds about half a time constant. Solving for the hot spot from the coil's 33.6 K operating temperature:

```figure
type: bars
title: Hot spot temperature in CT-40's coil after a quench at 100 A, by detection delay
unit: K
max: 320
caption: This is an illustration. Adiabatic model in the copper stabiliser only, 0.16 mm² at 100 A, 8 ms dump; NIST copper specific heat and Wiedemann–Franz resistivity for RRR 50. The model reaches 300 K at an effective time of about 0.23 s; beyond that it is outside the data's range, and the coil is at serious risk.
- 20 ms | 49
- 100 ms | 115
- * 0.5 s, beyond the data | above 300
```

The result is steep. A detector that acts in 20 ms keeps the hot spot below 50 K. One that takes 100 ms lets it reach about 115 K, far below room temperature. One that takes half a second lets it pass room temperature, where the tape's thin bonded layers are stressed by their different expansion and its superconducting layer can be permanently damaged; the safe limit for a particular tape comes from its maker and from tests. REBCO coils make detection harder than older conductors, because a normal zone in them spreads slowly, so a quench may involve only a small spot for a long time, producing a small voltage. Fast, sensitive detection is the main protection.

## Detecting a quench

The usual detector compares voltages. A coil's terminal voltage includes the inductive voltage L × dI/dt whenever the current changes, which can be much larger than a small resistive voltage. Comparing the voltages across two matched halves of the coil cancels the inductive parts and leaves any resistive voltage that appears in one half. When that difference exceeds a threshold for longer than a validation time, the detector opens the power supply's switch and the dump begins.

Threshold and validation time pull against each other. A lower threshold and a shorter time catch a quench sooner; a higher threshold and a longer time ignore noise. CT-40's detector uses a threshold of a few millivolts and a validation time of 10 ms, with the voltage taps' wires twisted in pairs and anchored along their run, which keeps the pick-up from the cold head's vibration and the power supply's ripple well below the threshold.

## The error: a detector slowed down

This is an illustration. During a long series of tests, CT-40's quench detector tripped several times with no quench, interrupting runs. A technician traced the false trips to noise on the voltage taps and, to stop them, raised the validation time from 10 ms to 500 ms. The next real quench, at 100 A, left a section of the coil's tape discoloured and its critical current permanently reduced.

The hot spot calculation shows why. At a half-second delay, the stabiliser's ∫ I² dt is about 100² × 0.504 = 5,040 A²·s, while the adiabatic model shows the copper passing room temperature at about 0.23 s of full current. The damaged spot had been heated far beyond what REBCO tape tolerates.

The engineer found the cause by comparing the detector's settings log with the test records, and the fix addressed the noise rather than the detector. The voltage tap wires were rerouted away from the cold head, twisted, and anchored at the plate; the noise fell by a factor of about ten, and the 10 ms validation time was restored. The laboratory's procedure now states the maximum validation time for each coil, calculated from its hot spot limit, and no setting may exceed it.

## Exercise: testing at 150 A

A customer's coil of the same 4.0 mH inductance must be tested at 150 A, with new leads designed for that current (Chapter 8). The coil's insulation is rated for 50 V. Find the stored energy at 150 A, the largest dump resistance that keeps the voltage at 50 V, the time constant, and the current density in a 0.16 mm² stabiliser. Then say how the hot spot calculation changes.

**Worked answer.** This is an illustration. The stored energy is ½ × 0.004 × 150² = **45 J**, more than twice the energy at 100 A. The largest dump resistance is 50 ÷ 150 = **0.333 Ω**, giving a time constant of 0.004 ÷ 0.333 = **12 ms**, half as long again as at 100 A. The stabiliser's current density is 150 ÷ 0.16 = **938 A/mm²**. Because the left side of the hot spot equation grows with the square of the current, every millisecond of delay at 150 A heats the spot 2.25 times as much as at 100 A, and the slower dump adds to it. The time to reach any given hot spot temperature falls to 1 ÷ 2.25 of its value at 100 A, about 0.10 s instead of 0.23 s to room temperature, so the detector's validation time must be shortened in proportion, and the test plan must state it.
