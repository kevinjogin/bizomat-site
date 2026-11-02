---
book: production-leak-testing-by-the-numbers
chapterSlug: differential-flow-and-reference-leaks
order: 5
title: "Differential tests, flow tests and reference leaks"
description: "How differential decay and mass flow testers improve on direct decay, what a master part cancels, reference leaks for setting and proving a tester, and a master that leaked."
draft: false
---

Direct pressure decay reads a small pressure change against a large absolute pressure. Its resolution is limited by the transducer, its stability by the supply and the temperature. Two refinements push pressure-based testing further. A differential tester compares the part with a reference, so that only differences between them are measured. A flow tester holds the pressure constant and measures the gas needed to keep it there, which reads the leak directly as a flow and does not depend on the part's volume. Both need a way to prove that they work, and that is the job of a reference leak.

This chapter explains how differential and flow testers work and what each cancels, chooses a screen for the larger OC-60 cooler, sets out how reference leaks are made, calibrated and used, and finishes with a master part that had developed its own leak.

## Differential pressure decay

A differential tester fills the test part and a reference side from the same supply, then closes the valves between them and reads the pressure difference with a differential transducer. The reference side may be a known-good master part of the same type, or a sealed volume. Because both sides start at the same pressure, the transducer only has to measure the small difference that develops, and differential transducers with a range of tens of millibar resolve a hundredth of a millibar or better, ten times finer than the OC-40 screen's direct transducer.

```figure
type: svg
title: A differential pressure decay circuit
alt: A schematic with a pressure supply at the left feeding a fill valve. After the fill valve the line splits to two branches, each with its own isolating valve, one leading to the test part and one to a master part. A differential pressure transducer connects across the two branches between the isolating valves and the parts. Labels show that the supply is common and that only the difference between the two sides is measured.
caption: This is an illustration. Both sides fill together from one supply and are then isolated; the transducer sees only the pressure difference that develops between the test part and the master.
viewbox: 0 0 640 260
body:
<rect class="bxi" x="20" y="105" width="90" height="44" rx="4"/>
<text class="txb" x="34" y="132">supply</text>
<path class="ln" d="M110 127 L170 127"/>
<rect class="bx" x="170" y="111" width="50" height="32" rx="3"/>
<text class="tx txs" x="176" y="132">fill</text>
<path class="ln" d="M220 127 L260 127 L260 60 L330 60 M260 127 L260 200 L330 200"/>
<rect class="bx" x="330" y="44" width="50" height="32" rx="3"/>
<text class="tx txs" x="336" y="65">iso</text>
<rect class="bx" x="330" y="184" width="50" height="32" rx="3"/>
<text class="tx txs" x="336" y="205">iso</text>
<path class="ln" d="M380 60 L500 60 M380 200 L500 200"/>
<rect class="bxa" x="500" y="36" width="120" height="48" rx="6"/>
<text class="txa" x="512" y="66">test part</text>
<rect class="bxi" x="500" y="176" width="120" height="48" rx="6"/>
<text class="txb" x="512" y="206">master part</text>
<path class="la" d="M430 60 L430 105 M430 155 L430 200"/>
<rect class="bxa" x="395" y="105" width="70" height="50" rx="4"/>
<text class="txa" x="409" y="136">Δp</text>
<text class="tx txs" x="120" y="240">only the difference between the two sides reaches the transducer</text>
```

### Why a small range gives a fine resolution

Pressure transducers resolve a roughly fixed fraction of their full range, often a few hundredths of a per cent once noise is included. The OC-40 screen's direct transducer must read 6 bar, so its range is 10 bar, and a fraction of that is about 0.1 mbar. A differential transducer never sees the 6 bar, only the difference between the two sides, so its range can be ±50 mbar, two hundred times smaller, and its resolution about 0.005 to 0.01 mbar for the same fractional quality. Its weakness is the moment of filling, when the two sides must be connected through a valve so that the transducer is never exposed to the full test pressure on one side only; a tester whose bypass valve opens late or leaks can overload or damage its own transducer. Averaging the reading over the measurement window, rather than taking two single samples at its start and end, reduces the random noise further, by roughly the square root of the number of samples averaged.

### What the master cancels and what it does not

Anything that affects both sides equally cancels. Fluctuations of the supply pressure during the fill, slow changes in the shop's air temperature that warm both parts alike, and the parts' elastic stretch, if they are identical, all disappear from the difference. What does not cancel is anything that differs between them. A test part that has just come off the buffer conveyor and a master that has sat in the fixture all shift may differ by a few hundredths of a kelvin, and a difference of 0.01 K between the two sides is still 0.24 mbar at 6 bar gauge, half the OC-40 screen's limit. Differential testing improves resolution and rejects common disturbances; it does not remove the need for the parts to be at the same temperature. A master kept in the fixture should therefore be the same type of part and should be cycled through the same temperatures as production parts.

## The mass flow method

A flow tester fills the part and then keeps it connected to a regulated supply through a flow sensor, usually a laminar flow element with a differential transducer or a thermal mass flow sensor. Gas leaving through a leak is replaced through the sensor, which reads the leak rate directly as a flow, typically in standard cubic centimetres per minute.

Two properties make the flow method attractive for large parts. The reading does not depend on the part's volume: a leak of 2 sccm reads 2 sccm whether the part holds 0.5 L or 50 L. And the signal does not shrink as the volume grows, as a decay signal does. Its weakness is the same as every pressure method's: if the gas inside cools, the supply must add gas to keep the pressure up, and the sensor reads that as a leak. The apparent flow is the volume multiplied by the pressure and by the rate of cooling, divided by the absolute temperature.

```figure
type: formula
title: Apparent leak from cooling, in a flow test
formula: Q_thermal = V × p_abs × (dT/dt) ÷ T
caption: dT/dt is the gas's rate of cooling, in K/s. Unlike a decay test, a flow test's temperature error grows with the volume, because a larger volume of gas needs more make-up for the same cooling rate.
- Q_thermal | apparent leak rate from cooling, mbar·L/s
- V | test volume, L
```

## A screen for the OC-60

The OC-60 cooler's 1.60 L test volume makes direct pressure decay less sensitive: its screen limit of 0.045 mbar·L/s gives only 0.28 mbar in 10 seconds, as Chapter 3 found, and Chapter 4 showed that it needs 12 seconds of stabilisation. The test engineer compared that with the flow tester that Chapter 1's comparison sheet had first rejected.

```figure
type: compare
title: Two screens for the OC-60 at its 0.045 mbar·L/s screen limit
cols: Direct pressure decay, 10 s | Mass flow tester
rowhead: Question
- Signal at the limit | 0.28 mbar | 0.045 × 59.2 = 2.66 sccm
- Resolution | 0.1 mbar, 36% of the signal | 0.5 sccm, 19% of the signal
- Depends on test volume | yes: limit must be recalculated per part | no
- Temperature error, part 0.05 K warm, 300 s time constant | 0.039 mbar, 14% of the limit | 1.60 × 7,013 × (0.05 ÷ 300) ÷ 293.15 = 0.0064 mbar·L/s, 0.38 sccm, 14% of the limit
- Stabilisation needed | 12 s | about the same, for the fill heat
- Verdict | workable | chosen: better resolution, and one limit for both coolers
caption: This is an illustration. The flow tester's 0.5 sccm resolution, too coarse for the specification as Chapter 1 showed, is a fifth of the screen limit, which is enough for a screen.
```

The flow tester resolved the OC-60's screen limit better and, because its reading does not depend on volume, could use the same 2.66 sccm limit for both coolers, removing the class of error that Chapter 3's copied program created. Its temperature error, for a cooler 0.05 K above the shop air, was about the same fraction of the limit as the decay screen's. The manufacturer bought it for the OC-60 line, the same instrument that, in the wrong units, had nearly been bought as a specification tester.

## Reference leaks

Every leak tester needs to be shown that it responds correctly to a leak of known size. A reference leak, also called a calibrated or standard leak, is a device that passes a known, stable leak rate of a stated gas at stated pressures and temperature.

```figure
type: compare
title: Kinds of reference leak and their uses on the OC-40 line
cols: How it works | Range | Used on the line for
rowhead: Reference leak
- Sharp orifice | a laser-drilled hole in a thin disc; choked flow at the test pressure | about 10⁻² to 10 mbar·L/s | the pressure decay screen's 0.045 mbar·L/s check
- Capillary | a crimped or drawn glass or metal tube; viscous flow | about 10⁻⁶ to 10⁻² mbar·L/s | the helium station's check near its reject limit
- Permeation | helium dissolving through a glass or polymer membrane from a reservoir | about 10⁻¹⁰ to 10⁻⁶ mbar·L/s | the helium detector's internal sensitivity calibration
caption: This is an illustration of common types. Each reference leak carries a calibration certificate stating its rate, gas, pressures, temperature and uncertainty; ISO 20486 sets out how reference leaks for gases are calibrated.
```

Each reference leak's certificate states the conditions of its calibration. Orifice and capillary leaks are calibrated at a stated upstream pressure, and their rate changes with pressure according to the regimes of Chapter 2. Permeation leaks change strongly with temperature, by a few per cent per kelvin, and their certificates give a temperature coefficient. A reference leak used outside its stated conditions is no longer a reference.

### Correcting a reference leak to the test pressure

The screen's orifice reference leak was calibrated at 6.0 bar gauge, where it passes 0.045 mbar·L/s. Because its flow is choked, its rate is proportional to the upstream absolute pressure. If the supply regulator drifts to 5.8 bar gauge, the leak passes 0.045 × 6.813 ÷ 7.013 = 0.0437 mbar·L/s, 3% less, a small error that the daily check would hardly notice. If someone used the same leak on a test at 3 bar gauge, it would pass 0.045 × 4.013 ÷ 7.013 = 0.0258 mbar·L/s, little more than half its certificate value, and a tester set up with it would be set far too tight. A capillary leak, being viscous, changes even more steeply with pressure, with the difference of squares. The reference leak's certificate pressure must match the test's, or the correction must be made explicitly.

### Seals that leak

The fixture's own seals are part of the tested volume, and a worn or contaminated seal leaks exactly as a part would. A seal leak cannot be told from a part leak by any of these testers, because the gas is lost from the same volume. The line checks its seals with a sealed dummy part, a solid aluminium block with the cooler's port geometry that cannot leak: tested at the start of each shift, it must show a drop below 0.05 mbar on the decay screen and below 0.2 sccm on the flow tester. A dummy reading above that points to the fixture, not the parts, and sends the seals for replacement before any cooler is rejected for a leak it does not have.

### Using a reference leak

A reference leak serves three purposes. It sets up a tester, by showing the reading that a leak at the limit produces. It proves a tester, by confirming at the start of each shift that the reading has not changed. And it estimates the tester's uncertainty, by repeated measurements, which Chapter 8 uses to set the reject limit's guard band. The OC-40 screen's orifice leak, fitted to a known-good cooler through a valve, is used for the first two; the helium station's capillary leak for all three.

## Choosing among pressure methods

The three pressure-based methods suit different parts and limits.

**Direct pressure decay** is the simplest and cheapest. It suits small parts, moderate limits and lines where the parts reach the tester at a stable temperature. Its limit must be recalculated for every part volume.

**Differential decay with a master** adds resolution and cancels supply and common thermal disturbances. It suits tighter limits on small and medium parts, provided the master is kept at the parts' temperature and checked for its own leaks.

**Mass flow** reads the leak directly in volume-independent units and suits large parts and families of parts of different sizes. Its thermal error grows with volume, so it still needs parts near the shop's temperature.

None of the three reaches the OC-40's specification of 1 × 10⁻³ mbar·L/s in a production cycle. Each is limited by temperature long before its resolution, and at that level the only practical method is a tracer gas, which Chapter 6 introduces.

## The mistake: a master that leaked

The differential tester used during the OC-60's development compared each cooler with a master OC-60 kept in the fixture's reference port. Over several weeks the development team noticed that the tester's readings for coolers with known seeded leaks were drifting lower, from the expected 0.50 mbar for a 0.045 mbar·L/s leak to about 0.28 mbar. Real leaks were being reported as a little over half their size.

```figure
type: steps
title: Finding the leak in the master
caption: This is an illustration in the OC-40's 0.90 L volume for comparison. A master that leaks makes every test part look tighter by the master's own leak.
- Symptom | seeded 0.045 mbar·L/s leak read 0.28 mbar, not 0.50 mbar
- Check 1 | test side alone, direct decay with the reference port capped: 0.50 mbar, correct
- Check 2 | master alone, direct decay: 0.22 mbar in 10 s, equivalent to 0.020 mbar·L/s
- * Cause | the master had developed a leak at a cracked fitting thread; its pressure fell alongside the test part's
- Arithmetic | (0.045 − 0.020) × 10 ÷ 0.90 = 0.28 mbar, as observed
- Procedure changed | master checked alone by direct decay every week; master replaced annually; reference leak check every shift
```

A master that leaks loses pressure on the reference side, so the difference between the two sides grows more slowly, and every test part looks tighter by the amount of the master's own leak. Checked alone by direct decay with the test port capped, the master lost 0.22 mbar in 10 seconds, a leak of 0.020 mbar·L/s at a cracked thread on one of its fittings. The arithmetic matched the symptom: a 0.045 mbar·L/s seeded leak, less the master's 0.020, gave a difference of 0.025 mbar·L/s, or 0.28 mbar in 10 seconds. A master is a measuring instrument and needs checking like one. The development team now checks the master alone weekly, replaces it yearly, and runs the reference leak check every shift.

## Exercise: a flow screen for a large tank

The manufacturer is asked to quote for testing a 25 L hydraulic reservoir at 0.5 bar gauge, with a gross leak limit of 0.10 mbar·L/s. Its parts reach the tester within 0.1 K of the shop air, with a cooling time constant of 600 seconds. Calculate the pressure drop a leak at the limit would give by direct decay in 20 seconds, the apparent flow from the part's cooling in a flow test, and say which method suits the job.

### Answer

**Given:** V = 25 L; p = 0.5 bar gauge, 1,513 mbar absolute; limit Q = 0.10 mbar·L/s; part 0.1 K warm, time constant 600 s; T = 293.15 K.

**Assumptions:** exponential cooling; the leak rate constant during the test.

**Method:** decay Δp = Q Δt ÷ V; flow error Q_thermal = V p (dT/dt) ÷ T with dT/dt = 0.1 ÷ 600 at the start.

**Direct decay signal:** 0.10 × 20 ÷ 25 = 0.080 mbar in 20 seconds, below the OC-40 screen's 0.1 mbar transducer resolution.

**Cooling in a decay test:** the part cools by 0.1 × (1 − e^(−20 ÷ 600)) = 0.0033 K in 20 s, worth 1,513 × 0.0033 ÷ 293.15 = 0.017 mbar.

**Flow test thermal error:** dT/dt = 0.1 ÷ 600 = 1.67 × 10⁻⁴ K/s; Q_thermal = 25 × 1,513 × 1.67 × 10⁻⁴ ÷ 293.15 = 0.0215 mbar·L/s, about a fifth of the limit, or 1.3 sccm against a limit of 5.9 sccm.

**Choice:** the flow method. Its signal at the limit, 5.9 sccm, is well above the 0.5 sccm resolution, while a direct decay test would need a far finer transducer or a much longer time to see 0.080 mbar. The thermal error uses a fifth of the limit; bringing the parts closer to the shop's temperature would reduce it.

**Verification:** 0.10 mbar·L/s × 59.2 = 5.9 sccm; 0.0215 × 59.2 = 1.27 sccm; and the decay signal is 6.25 times smaller than the OC-40 screen's 0.5 mbar at its own limit, because the volume is 27.8 times larger, the time twice as long and the limit 2.2 times higher.
