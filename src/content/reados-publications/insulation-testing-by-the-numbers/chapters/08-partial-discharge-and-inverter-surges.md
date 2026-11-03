---
book: insulation-testing-by-the-numbers
chapterSlug: partial-discharge-and-inverter-surges
order: 8
title: "Partial discharge and inverter surges"
description: "Partial discharge in voids, the field in a void and Paschen's law, why C-1's small voids stay quiet, PD testing, inverter surges and cable reflections, and condenser fan rewinds that failed again."
draft: false
---

A partial discharge is a small electrical spark that bridges only part of the insulation between two conductors: across a gas-filled void inside the groundwall, along a surface, or in the air between two turns of a winding. Each discharge is tiny, a pulse of a few picocoulombs to a few nanocoulombs, and does not short the winding. But each one bombards the walls of the void with ions and electrons, produces ozone and ultraviolet light and, with moisture, nitric acid. Repeated many times each cycle, for months and years, the discharges erode organic insulation until a channel grows through it and it fails. Mica resists this erosion, which is why it is used in high-voltage machines. The enamel and films of a low-voltage motor do not.

This chapter explains when the gas in a void breaks down, using the field in a void and Paschen's law, and shows why the small voids in C-1's groundwall should stay quiet at its operating voltage. It describes partial discharge testing, then turns to the low-voltage motors that variable speed drives expose to repeated fast surges, calculates the surge voltage at the condenser fan motors' terminals, and finishes with condenser fan motors that were rewound and failed again because nobody had looked at the drives.

## The field in a void

Consider a thin, flat void filled with air, lying parallel to the electrodes inside a slab of insulation. The void and the solid insulation act like two capacitors in series. Because the void's permittivity is about 1 while the solid's is εᵣ, the void carries a field εᵣ times higher than the solid around it. For a slab of total thickness d containing a void of thickness d_v, the field in the solid is E_s = V ÷ ((d − d_v) + εᵣ d_v), and the voltage across the void is V_v = εᵣ × E_s × d_v.

```figure
type: formula
title: Voltage across a thin flat void
formula: E_s = V ÷ ((d − d_v) + εᵣ × d_v)        E_v = εᵣ × E_s
formula: V_v = E_v × d_v
caption: The void and the solid share the voltage like capacitors in series. A void lying across the field, rather than along it, sees the highest field.
- V | voltage across the insulation, V
- d, d_v | insulation thickness and void thickness, mm
- εᵣ | relative permittivity of the solid
- E_s, E_v | field in the solid and in the void, V/mm
- V_v | voltage across the void, V
```

For C-1, the peak voltage between a phase conductor and earth is 1,905 × √2 = 2,694 V, and the average field across its 2.2 mm groundwall is 2,694 ÷ 2.2 = 1.22 kV/mm at the peak. A void 0.1 mm thick in mica-epoxy with εᵣ = 4.5 has a field in the solid of 2,694 ÷ (2.1 + 0.45) = 1,057 V/mm, a field in the void of 4,755 V/mm and a voltage across it of about 475 V at the peak. A larger delamination, 0.3 mm thick, sees 2,694 ÷ (1.9 + 1.35) = 829 V/mm in the solid and about 1,119 V across the gap.

## When the gas breaks down: Paschen's law

Whether those voltages cause a discharge depends on the breakdown voltage of the gas in the void. For a uniform field between parallel electrodes, Paschen's law expresses the breakdown voltage as a function of the product of gas pressure and gap length. The law comes from the physics of electron avalanches: an electron accelerated by the field ionises gas molecules, releasing more electrons, and breakdown occurs when the avalanche becomes self-sustaining.

```figure
type: formula
title: Paschen's law for breakdown of a gas gap
formula: V_b = B × pd ÷ (ln(A × pd) − ln(ln(1 + 1 ÷ γ)))
caption: Illustrative constants often quoted for air: A = 15 per cm·Torr, B = 365 V per cm·Torr and γ = 0.01. Real voids differ in gas, pressure, surface condition and shape, so the results are estimates. Atmospheric pressure is about 760 Torr.
- V_b | breakdown voltage of the gap, V
- p | gas pressure, Torr
- d | gap length, cm
- γ | secondary electron emission coefficient of the surfaces
```

With these constants, the breakdown voltage has a minimum of about 305 V near a pd of 0.84 Torr·cm, close to the commonly quoted minimum of a little over 300 V for air. No gap in air at any pressure breaks down below about this voltage. At atmospheric pressure the breakdown voltage of a 0.05 mm gap is about 550 V, of a 0.1 mm gap about 865 V, of a 0.3 mm gap about 1,930 V and of a 0.5 mm gap about 2,880 V.

```figure
type: compare
title: C-1's voids at peak phase-to-earth voltage, working model
cols: Voltage across the void | Paschen breakdown estimate | Discharge expected?
rowhead: Void thickness
- 0.1 mm | about 475 V | about 865 V | no
- 0.3 mm | about 1,119 V | about 1,930 V | no
caption: This is an illustration. Groundwall 2.2 mm, εᵣ = 4.5, peak 2,694 V; air at atmospheric pressure in the void. The margins are large, which is one reason sound 3.3 kV windings seldom show groundwall discharge.
```

Both voids are well below their estimated breakdown voltage, so the model predicts no discharges in C-1's groundwall at operating voltage. This is consistent with C-1's small tip-up in Chapter 7, and with the general experience that partial discharge in the groundwall is chiefly a concern of machines rated 6 kV and above, where the fields are higher. Those machines also need semiconducting coatings in the slots and stress-grading coatings at the slot exits to prevent discharges at the coil surfaces, and the condition of those coatings is a major target of their partial discharge tests.

## Testing for partial discharge

An off-line partial discharge test raises the voltage on an isolated winding from a separate supply and detects the current pulses from discharges through a coupling capacitor, reporting their magnitude, number and position in the power-frequency cycle. Raising the voltage until discharges start gives the inception voltage; lowering it until they stop gives the extinction voltage. An on-line test uses couplers installed permanently at the machine's terminals or in its switchgear and measures discharges in service, under real temperature, vibration and voltage distribution.

Partial discharge results depend heavily on the test equipment, its calibration, the frequency band it measures and the machine's construction, so absolute values cannot be compared between different systems or different machines. Like the other tests in this book, partial discharge readings are most useful as a trend on one machine with one system. For C-1 and C-2, the site's rewinder runs an off-line partial discharge test every few years as a check rather than a routine, because the model and the tip-up results suggest they should be discharge-free.

## Surges from variable speed drives

The condenser fan motors present a very different problem. Each is supplied by a variable speed drive, which rectifies the 415 V supply to a DC bus of about √2 × 415 = 587 V and switches it on and off thousands of times a second with transistors to make a variable-frequency output. Each switching edge rises in a fraction of a microsecond, typically around 0.1 µs for a modern drive.

Over a long cable, such a fast edge behaves as a travelling wave. The cable has a surge impedance of a few tens of ohms; the motor winding's surge impedance is far higher, typically hundreds to thousands of ohms. When the wave reaches the motor it is reflected by the mismatch, with a reflection coefficient Γ = (Z_m − Z_c) ÷ (Z_m + Z_c), and the voltage at the motor terminals rises towards (1 + Γ) times the step. If the edge rises in a time short compared with the time the wave takes to travel to the motor and back, the reflection builds fully. The cable length above which that happens, the critical length, is about l_c = v × t_r ÷ 2, where v is the wave's speed on the cable, about 150 m/µs, half the speed of light, for typical power cable.

```figure
type: formula
title: Reflected surge at a motor fed by a drive
formula: Γ = (Z_m − Z_c) ÷ (Z_m + Z_c)        l_c = v × t_r ÷ 2
formula: Peak at the motor: V_pk ≈ (1 + Γ) × V_dc for l ≥ l_c;   V_pk ≈ V_dc × (1 + Γ × l ÷ l_c) for l < l_c
caption: A common engineering approximation. Further overshoot can occur when pulses follow each other closely, so measured peaks can exceed these estimates.
- Z_m, Z_c | surge impedance of the motor and the cable, Ω
- v | wave speed on the cable, about 150 m/µs
- t_r | rise time of the drive's output edge, µs
- l, l_c | cable length and critical length, m
```

For the condenser fans, with a rise time of 0.1 µs the critical length is 150 × 0.1 ÷ 2 = 7.5 m, and the cables are 60 m long, eight times longer. Taking the motor's surge impedance as 2,000 Ω and the cable's as 60 Ω for illustration, Γ = 1,940 ÷ 2,060 = 0.942, and the peak at the motor is about 1.942 × 587 = 1,140 V, close to double the DC bus voltage. With a carrier frequency of 4 kHz, each phase sees about 8,000 such edges every second, roughly 2.5 × 10¹¹ a year of continuous running.

The steep front also distributes unevenly along the winding. Because the front is faster than the time for the wave to travel through the winding, a large part of the surge appears across the first few turns of the first coil. In a random-wound motor, the first and last turns can lie side by side, separated only by two layers of enamel, so the turn insulation sees a large fraction of the full surge.

## The mistake: rewinding without looking at the drive

Chapter 1 found that three of the six condenser fan motors had failed in five years. Each time, the rewinder found a turn-to-turn failure near the line end of one phase, rewound the motor with standard magnet wire and returned it. The fourth failure, in the second motor rewound, came only fourteen months after its rewind.

The rewinder suggested that something other than ageing was attacking the windings, and asked to measure the voltage at a motor's terminals. With a high-bandwidth differential probe and an oscilloscope, the electrician measured peaks of about 1,130 V between phases at the motor, with rise times close to 0.1 µs: almost exactly what the reflection calculation predicts. On a sample of the same wire wound into a test coil, the rewinder measured a partial discharge inception voltage between turns of about 1,050 V peak. The motors' turn insulation was therefore discharging on many of the eight thousand edges each second, and the enamel was eroding.

```figure
type: steps
title: Finding the cause of the condenser fan failures
caption: This is an illustration. Peaks measured at a motor's terminals; the inception voltage measured by the rewinder on a test coil of the same wire.
- Failures | three in five years, all turn-to-turn near the line end
- Rewinds | standard magnet wire; one failed again after 14 months
- Measurement at the motor | peaks about 1,130 V between phases, rise time about 0.1 µs
- Calculation | critical length 7.5 m against a 60 m cable; peak about 1,140 V
- * Comparison | turn-to-turn inception about 1,050 V peak: discharges on many edges
- Fix | dv/dt filters at the drives; inverter-duty rewinds with discharge-resistant wire
```

The fix had two parts. A dv/dt filter at each drive's output slows the edges. With a rise time of about 2 µs, the critical length becomes 150 × 2 ÷ 2 = 150 m, longer than the 60 m cables, and the approximation gives a peak of about 587 × (1 + 0.942 × 60 ÷ 150) = 808 V, well below the inception voltage. Measured peaks after fitting the filters were about 820 V. And future rewinds of these motors use magnet wire with an enamel designed to resist discharges, with improved phase separators, to the rewinder's inverter-duty specification. The DC insulation resistance tests had shown nothing wrong with these motors at any time, because enamel eroding between turns does not change the resistance to earth until it fails.

```figure
type: bars
title: Surge peak at the condenser fan motors
unit: V peak
max: 1300
caption: This is an illustration. Estimated by the reflection approximation for a 60 m cable on a 587 V DC bus; the turn-to-turn inception voltage of the original wire was about 1,050 V peak.
- * No filter, rise time 0.1 µs | 1140
- dv/dt filter, rise time 1 µs | 1029
- dv/dt filter, rise time 2 µs | 808
- DC bus | 587
```

## Specifying motors for drives

The cheapest time to solve the surge problem is when a motor and drive are bought. The site's purchasing specification for any new drive-fed motor now states the drive's DC bus voltage, its output rise time, the cable length and whether a filter will be fitted, and asks the motor supplier to confirm that the winding is designed for the resulting peak voltage and rise time at its terminals, with discharge-resistant wire where the peaks may exceed the turn insulation's inception voltage. Motor makers and standards publish guidance on the peak voltages and rise times their windings can tolerate; those values belong in the specification, taken from the maker's data, not assumed. The drive supplier is asked for the expected terminal voltage with the chosen cable, and the result is measured once at commissioning and kept with the motor's records.

## Testing turn insulation

The DC and AC tests of earlier chapters test the groundwall between the winding and earth. They do not test the insulation between turns, because adjacent turns are at almost the same potential during those tests. Turn insulation is tested by a surge test, which applies fast voltage pulses to a winding and compares the ringing waveforms of the phases, or of a phase and a reference: a weak or shorted turn changes the waveform. Rewinders use surge testing as a quality check after a rewind. For inverter-fed motors, the surge test voltage should reflect the surges the drive will apply, which is a matter for the rewinder's procedure and the relevant standards.

## Exercise: a new conveyor drive

A new 415 V conveyor drive is to be installed with a 15 m cable to its motor. The drive's output rise time is 0.2 µs. Using the same surge impedances and wave speed as above, estimate the critical length and the peak voltage at the motor, then repeat with a filter that slows the rise time to 1 µs.

### Answer

**Given:** V_dc = 587 V; l = 15 m; t_r = 0.2 µs, then 1 µs; v = 150 m/µs; Γ = 0.942.

**Assumptions:** the reflection approximation; one pulse at a time, so no further overshoot from closely spaced pulses.

**Method:** l_c = v t_r ÷ 2; if l ≥ l_c, V_pk = (1 + Γ) V_dc; otherwise V_pk = V_dc (1 + Γ l ÷ l_c).

**Without a filter:** l_c = 150 × 0.2 ÷ 2 = 15 m. The cable is as long as the critical length, so the reflection builds fully: V_pk = 1.942 × 587 = 1,140 V.

**With the filter:** l_c = 150 × 1 ÷ 2 = 75 m. V_pk = 587 × (1 + 0.942 × 15 ÷ 75) = 587 × 1.188 = 697 V.

**Conclusion:** even a 15 m cable gives nearly double the bus voltage at this rise time, enough to exceed the inception voltage of the condenser fans' original wire. Either the filter or an inverter-duty motor with discharge-resistant wire is needed, and a terminal measurement after commissioning would confirm the result.

**Verification:** with the filter the cable is one fifth of the critical length, so the overshoot is about one fifth of the full reflection: 0.188 of 587 V, which matches.
