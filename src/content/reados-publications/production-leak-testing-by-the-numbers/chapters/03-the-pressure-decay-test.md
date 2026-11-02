---
book: production-leak-testing-by-the-numbers
chapterSlug: the-pressure-decay-test
order: 3
title: "The pressure decay test"
description: "How a pressure decay test turns a pressure drop into a leak rate, test volume and time, measuring the volume, what the test can resolve, and limits that do not transfer between parts."
draft: false
---

The pressure decay test is the workhorse of production leak testing. Fill the part with air, isolate it, wait, and watch the pressure fall. If gas is leaking out, the pressure drops at a rate set by the leak and the volume. The equipment is simple, the gas is free, and a test takes seconds. Its limitation is equally simple: the signal is a pressure drop, and anything else that changes the pressure, above all temperature, looks exactly like a leak.

This chapter derives the relationship between pressure drop and leak rate, sets out the stages of a test cycle, works the OC-40 screen's numbers, shows how to measure the test volume that the calculation depends on, and explains why the screen cannot reach the specification. It finishes with a reject limit carried from one part to another that let larger leaks through.

## From pressure drop to leak rate

Gas in a closed volume obeys the ideal gas law: pV = mRT. If the volume and temperature stay fixed and gas leaks out, the pressure falls in proportion to the mass lost. Since a leak rate in pressure–volume units is the rate of loss of pV, the pressure falls at the leak rate divided by the volume.

```figure
type: formula
title: Pressure decay and leak rate
formula: Q = V × Δp ÷ Δt
formula: Δp = Q × Δt ÷ V
caption: Valid while the volume V and the gas temperature stay constant during the measurement time Δt, and while the pressure drop is small compared with the test pressure, so that the leak rate itself does not change. Units: Q in mbar·L/s, V in litres, Δp in mbar and Δt in seconds.
- Q | leak rate, mbar·L/s
- V | total test volume: part, fixture and tubing, L
- Δp | pressure drop over the measurement time, mbar
- Δt | measurement time, s
```

Two features of the formula decide everything about the method. The signal grows with the measurement time, so a longer test sees smaller leaks. And the signal shrinks as the volume grows: the same leak gives half the drop in twice the volume. Large parts are hard to test by pressure decay; small parts are easy.

## The OC-40 screen

The cooler's oil side holds 0.85 L, and the fixture's seals, valves and tubing add 0.05 L, so the test volume is 0.90 L. The screen fills to 6 bar gauge and measures for 10 seconds. It rejects any cooler whose pressure falls by more than 0.5 mbar in that time.

The reject limit therefore corresponds to Q = 0.90 × 0.5 ÷ 10 = 0.045 mbar·L/s. That is the screen's leak rate limit, 45 times the specification's 1 × 10⁻³ mbar·L/s at 10 bar, and about 110 times the 4.0 × 10⁻⁴ mbar·L/s that the specification becomes at the screen's 6 bar, as Chapter 1 calculated. The screen is deliberately a gross leak test. Its job is to reject coolers with leaks large enough to flood the helium chamber with helium, which would contaminate it for minutes and stop the line.

```figure
type: steps
title: The OC-40 screen's test cycle
caption: This is an illustration. Cycle time 23 seconds against a line takt of about 48 seconds at 600 coolers in an 8-hour shift.
- Clamp and seal | operator loads the cooler; pneumatic seals close both oil ports
- Fill, 3 s | air at 6 bar gauge from a regulated supply
- Stabilise, 8 s | supply valve closed; pressure settles as the fill heat and part movement fade
- * Measure, 10 s | pressure drop recorded; reject if more than 0.5 mbar
- Vent, 2 s | pressure released; result shown and logged with the serial number
```

### Why the stabilisation stage matters

Filling compresses the air quickly, and compression heats it. Immediately after the fill valve closes, the air in the part is several kelvin warmer than the part's walls and starts to cool, and its pressure falls as it does. The part itself also stretches slightly under pressure and continues to creep for a moment. Both effects produce a pressure drop with no leak at all. The stabilisation stage waits for them to fade before the measurement starts. Chapter 4 calculates how large they are and how they set the screen's practical limit.

### The part stretches too

A cooler under 6 bar is a pressure vessel, and its thin aluminium plates bulge very slightly. If the bulge grows during the measurement, the volume grows and the pressure falls, exactly as if gas had leaked. The size of the effect follows from the gas law at constant mass: the fractional pressure change equals minus the fractional volume change. An increase of just 0.02 mL in the OC-40's 0.90 L test volume during the measurement lowers 7.013 bar absolute by 7,013 × 0.00002 ÷ 0.90 = 0.16 mbar, a third of the reject limit. Most of the bulge happens during the fill, about 0.5 mL in all, which would be 3.9 mbar if it happened during the measurement; the stabilisation stage lets it finish. Parts with flexible walls, such as thin plastic housings or bellows, can creep for many seconds and may need mechanical restraint in the fixture to be testable by pressure decay at all.

## Measuring the test volume

The leak rate depends on the volume, and the volume is not simply the part's drawing figure. Fixture passages, transducer ports, tubing and the cavities in the seals all add to it. The test engineer measures it by expansion from a reference volume, using Boyle's law.

A reference vessel of known volume, 0.200 L, is filled to 6.000 bar gauge, 7.013 bar absolute, and then connected to the cooler and fixture at atmospheric pressure, 1.013 bar absolute. After the temperature settles, the shared pressure is 2.104 bar absolute. The gas originally in the reference vessel and in the part is now spread over both, so 7.013 × 0.200 + 1.013 × V = 2.104 × (0.200 + V), giving V = (7.013 − 2.104) × 0.200 ÷ (2.104 − 1.013) = 0.900 L. The expansion method measures the volume the gas actually occupies, including every passage, which is exactly what the decay formula needs. It is repeated whenever the fixture or tubing changes, because a longer hose or a different seal changes the volume.

### Air used per test

The [gas volume at pressure and temperature tool](/tools/gas-law/) converts a gas volume between pressures and temperatures. Entering 0.90 L at 6 bar gauge and 20 °C and converting to atmospheric pressure at 20 °C gives 6.23 L of free air for each fill, a volume ratio of 6.92. At 600 coolers a shift that is 3.7 m³ of free air, a small load on the plant's compressed air but one worth knowing when the fill pressure or the line rate is changed.

## Gross leaks and the fill check

The decay formula assumes the pressure drop is small. A very large leak, such as a missing braze fillet or a cracked tank, empties the part so fast that the pressure never reaches its set point during the fill. The screen therefore checks the pressure at the end of the fill and before the measurement: if it is more than 0.2 bar below the 6 bar set point, the cooler is rejected as a gross leak without a measurement. Chapter 2's 0.1 mm hole, leaking 7.1 mbar·L/s, would lose the reject limit's 0.5 mbar in 0.5 × 0.90 ÷ 7.1 = 0.06 seconds; holes several times larger never fill at all. A screen without the fill check can pass such a part if its pressure drop during the measurement window happens to be small because the part was never properly pressurised, a failure that has caught out more than one production line.

## Proving the screen works

The screen's reject decision rests on the volume, the transducer and the timing all being right. The simplest daily proof is a reference leak: a calibrated orifice or capillary, fitted to a known-good cooler through a valve, that passes 0.045 mbar·L/s at 6 bar gauge. With the reference leak open, the screen should show close to 0.5 mbar in 10 seconds and reject; with it closed, the same cooler should pass with a drop near zero. The operators run both checks at the start of every shift and after any program change, and the screen refuses to run production until they have been done. Chapter 8 develops the same idea into a full study of the screen's capability.

## What the screen can resolve

The pressure transducer on the OC-40 screen resolves 0.1 mbar. A leak at the specification, 4.0 × 10⁻⁴ mbar·L/s at 6 bar, produces Δp = 4.0 × 10⁻⁴ × 10 ÷ 0.90 = 0.0044 mbar in 10 seconds, a twenty-third of the transducer's resolution. To produce a drop of 0.1 mbar, the measurement would have to last 0.1 × 0.90 ÷ 4.0 × 10⁻⁴ = 225 seconds, almost four minutes, and over four minutes the part's temperature would change far more than enough to swamp the signal.

```figure
type: bars
title: Pressure drop in 10 s in the 0.90 L test volume, at 6 bar gauge
unit: mbar
max: 1
caption: This is an illustration. Δp = Q × 10 s ÷ 0.90 L. The transducer resolves 0.1 mbar, and Chapter 4 shows that a change of 0.05 K in the air's temperature alone moves the pressure by about 1.2 mbar.
- Leak at the specification, 4.0 × 10⁻⁴ mbar·L/s at 6 bar | 0.0044
- Leak of 0.01 mbar·L/s | 0.11
- * Screen's limit, 0.045 mbar·L/s | 0.50
- Leak of 0.08 mbar·L/s | 0.89
```

No improvement in the transducer alone changes the conclusion, because the limit is set by temperature, not by resolution. That is why the specification is tested with helium. Chapter 5 shows how differential and flow methods push pressure-based testing further, but not to 10⁻³ mbar·L/s on a 0.9 L part in a production cycle.

## The mistake: a limit carried to a bigger part

When the manufacturer introduced the larger OC-60 cooler, with an oil-side volume of 1.55 L, the screen's program was copied from the OC-40's and the new part number added. The 0.5 mbar reject limit came with it. Nobody recalculated it, because the limit looked like a property of the machine rather than of the part.

```figure
type: steps
title: Recalculating the screen's limit for the OC-60
caption: This is an illustration. A pressure-drop limit is a leak rate only when multiplied by the volume, and the volume belongs to the part.
- OC-60 test volume, measured by expansion | 1.60 L, part and fixture
- Copied limit | 0.5 mbar in 10 s
- Leak rate it accepted | 1.60 × 0.5 ÷ 10 = 0.080 mbar·L/s, 1.8 times the intended 0.045
- Symptom | the helium chamber went into gross-leak contamination twice in the first week of OC-60 production
- * Corrected limit for 0.045 mbar·L/s | 0.045 × 10 ÷ 1.60 = 0.28 mbar in 10 s
- Procedure changed | every program records its measured test volume, and its limit is calculated from the leak rate, not copied
```

The OC-60's test volume, measured by expansion, was 1.60 L. With the copied 0.5 mbar limit, the screen accepted leaks up to 1.60 × 0.5 ÷ 10 = 0.080 mbar·L/s, 1.8 times the intended screen limit. Coolers with leaks between the two passed the screen and went into the helium chamber, where twice in the first week they filled the chamber with enough helium to stop the line for a quarter of an hour while it pumped clean. The test engineer traced the cause to the copied program, recalculated the limit as 0.28 mbar in 10 seconds, and changed the procedure: every program now stores its measured test volume and its leak rate limit, and the pressure-drop limit is calculated from them.

## Choosing test time and pressure

Within the limits set by temperature, two settings trade against cycle time.

**Measurement time.** Doubling it doubles the signal, but it also doubles the temperature drift's contribution if the drift has not fully died away, and it lengthens the cycle. The screen's 10 seconds fit within the line's takt with room for loading.

**Test pressure.** Raising the pressure raises the leak rate, roughly with the difference of squares, but also raises the fill heating, the part's stretch and the energy stored in the part. The screen's 6 bar is below the cooler's 10 bar rating, which is a deliberate choice for an operator-loaded station, and it is high enough that leaks which open under pressure are open during the test.

**Direction of pressure.** The cooler is pressurised from inside, the way it is loaded in service, so that any defect that opens under internal pressure is open during the test. Some parts are tested by vacuum decay instead, evacuating the inside and watching the pressure rise. That avoids stored pressure energy and suits parts that see vacuum in service, but its driving pressure difference can never exceed one atmosphere, and leaks that open only under internal pressure stay closed.

**Test volume.** Every millilitre of fixture and tubing dilutes the signal. The OC-40 fixture's 0.05 L costs only 6% of the signal, but for a small part with a large fixture the dilution can be decisive. Short, narrow tubing, transducers mounted close to the part and seals that fill the ports keep the dead volume small.

## Exercise: the screen's response to a mid-size leak

A cooler has a braze defect passing 0.02 mbar·L/s of air at 6 bar gauge. In the OC-40's 0.90 L test volume, calculate the pressure drop in 5, 10 and 20 seconds of measurement. Say whether the screen rejects it with its 10 s and 0.5 mbar settings, and what measurement time would be needed to reject it with the same limit. Then say what happens to the cooler next.

### Answer

**Given:** Q = 0.02 mbar·L/s; V = 0.90 L; limit 0.5 mbar; measurement times 5, 10 and 20 s.

**Assumptions:** constant temperature and volume during the measurement; the leak rate constant over the small pressure drop.

**Method:** Δp = Q × Δt ÷ V.

**Pressure drops:** 5 s: 0.02 × 5 ÷ 0.90 = 0.11 mbar; 10 s: 0.22 mbar; 20 s: 0.44 mbar.

**Screen decision:** at 10 s the drop is 0.22 mbar, below the 0.5 mbar limit, so the screen passes it, as designed: the screen's limit is 0.045 mbar·L/s.

**Time to reject with 0.5 mbar:** Δt = 0.5 × 0.90 ÷ 0.02 = 22.5 s, which would also make the screen reject everything above 0.020 mbar·L/s, not 0.045.

**What happens next:** the cooler goes to the helium chamber, where its leak, about 0.02 ÷ 0.400 = 0.05 mbar·L/s at 10 bar by viscous scaling, is fifty times the specification. The chamber rejects it. Its helium burst is larger than usual and the chamber needs a little longer to recover, but it is well below the gross-leak level that stops the line.

**Verification:** the drops scale with time as the formula requires, 0.11 : 0.22 : 0.44, and at the screen's own limit the formula returns 0.045 × 10 ÷ 0.90 = 0.50 mbar.
