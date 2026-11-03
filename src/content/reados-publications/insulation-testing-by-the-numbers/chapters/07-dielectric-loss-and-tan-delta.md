---
book: insulation-testing-by-the-numbers
chapterSlug: dielectric-loss-and-tan-delta
order: 7
title: "Dielectric loss and tan delta"
description: "AC tests of insulation: complex permittivity, the loss angle and tan delta, C-1's charging current and loss, relaxation peaks, capacitance and moisture, tip-up, and an alarm raised by a warm winding."
draft: false
---

A DC insulation test measures the small current that flows through and across insulation under a steady voltage. It is excellent at finding moisture and dirt, but it says little about the condition of the dielectric itself: whether the resin has aged, whether layers have separated, whether voids have formed. Under alternating voltage, insulation behaves differently. It draws a large charging current that leads the voltage by almost exactly a quarter of a cycle, and a much smaller current in phase with the voltage that represents energy lost as heat. The ratio of the two, the dissipation factor or tan delta, and the capacitance itself, change as insulation ages, absorbs water or develops voids, and they are measured at the voltage and frequency at which the machine actually runs.

This chapter describes insulation under alternating voltage: complex permittivity, the loss angle and tan delta, and how to calculate C-1's charging current and dielectric loss. It explains the relaxation peak that links the AC loss to the DC absorption current, shows how capacitance reveals moisture, describes the tip-up test for voids, and finishes with an alarm raised because C-1's tan delta was measured while the winding was still warm.

## Insulation under alternating voltage

An ideal capacitor connected to an alternating voltage draws a current that leads the voltage by exactly 90°, and consumes no power: energy flows in during one quarter-cycle and out during the next. Real insulation is not ideal. Some of its polarisation lags behind the field, as Chapter 3 described, and some current is conducted through it. Both mean that part of the current is in phase with the voltage, and that power is dissipated as heat.

The simplest model is a perfect capacitance C in parallel with a resistance R. The capacitive current, I_C = ωCV, leads the voltage by 90°; the resistive current, I_R = V ÷ R, is in phase with it. The total current leads the voltage by a phase angle φ slightly less than 90°. The difference, δ = 90° − φ, is the loss angle, and its tangent is the dissipation factor: tan δ = I_R ÷ I_C = 1 ÷ (ωRC). For small angles, tan δ is almost equal to the power factor, cos φ.

```figure
type: formula
title: Dissipation factor and dielectric loss
formula: I_C = ωCV        I_R = V ÷ R        tan δ = I_R ÷ I_C = 1 ÷ (ωRC)
formula: Dielectric loss: P = V² × ω × C × tan δ        Complex permittivity: ε* = ε′ − jε″, tan δ = ε″ ÷ ε′
caption: The parallel model. R here is the equivalent AC loss resistance, which includes polarisation lag as well as conduction, and is very much lower than the DC insulation resistance.
- ω | angular frequency, 2πf, rad/s
- C | capacitance, F
- tan δ | dissipation factor
- ε′, ε″ | real and imaginary parts of the permittivity
```

In terms of the material, the permittivity becomes a complex number. Its real part, ε′, measures the energy stored per cycle, and gives the capacitance. Its imaginary part, ε″, measures the energy lost per cycle. Their ratio is tan δ. Both depend on frequency and temperature, because the mechanisms of polarisation have their own relaxation times.

## C-1's charging current and loss

For C-1, each phase has a capacitance to earth of about 21.1 nF in the working model, and in service the voltage between each phase and earth is 3,300 ÷ √3 = 1,905 V RMS. At 50 Hz, ω = 314.16 rad/s, so the capacitive susceptance is ωC = 314.16 × 21.1 × 10⁻⁹ = 6.629 µS and the charging current is 1,905 × 6.629 × 10⁻⁶ = 12.63 mA per phase.

The site's measurements on C-1 give a dissipation factor between about 1.2 % and 1.5 % at phase voltage, depending on the winding temperature; the round value of 1.5 % is used here for illustration. The equivalent conductance is then G = ωC tan δ = 6.629 × 0.015 = 0.0994 µS, and the in-phase current is 1,905 × 0.0994 × 10⁻⁶ = 0.189 mA. The total current is the complex product of the voltage and the admittance, Y = G + jωC. The [complex number calculator](/tools/complex-number/), multiplying 1,905.3 + 0j V by 0.0000994 + 0.006629j mS, gives a current of 0.1886 + 12.630j mA, or 12.63 mA at 89.14°. The loss angle is 90° − 89.14° = 0.86°, whose tangent is 0.015, as assumed.

```figure
type: stats
title: C-1 per phase at 1,905 V and 50 Hz, working model
caption: This is an illustration. Capacitance 21.1 nF per phase; tan δ taken as 1.5 %. The current from the complex number calculator.
- 12.63 mA at 89.14° | total current, leading the voltage
- 0.189 mA | in-phase current from the loss
- 0.86° | loss angle δ
- 0.36 W | dielectric loss per phase
- 10.1 MΩ | equivalent AC loss resistance
- 2,000 MΩ | DC insulation resistance at 40 °C, for comparison
```

The dielectric loss per phase is V²ωC tan δ = 1,905² × 314.16 × 21.1 × 10⁻⁹ × 0.015 = 0.36 W. That is negligible as a heat source in a 315 kW motor, but it is a sensitive measure of the dielectric's condition. The equivalent AC loss resistance, 1 ÷ G, is about 10.1 MΩ, roughly two hundred times lower than the DC insulation resistance of 2,000 MΩ. The difference shows that at 50 Hz almost all the loss comes from polarisation lagging behind the field, not from conduction. The AC test and the DC test are therefore measuring different things, and a winding can pass one and fail the other.

## The relaxation peak

The Debye model of Chapter 3 predicts how a single relaxing mechanism contributes to the loss at different frequencies. At frequencies far below 1 ÷ (2πτ), where τ is the relaxation time, the polarisation follows the field fully and little energy is lost. At frequencies far above it, the polarisation cannot follow at all and again little is lost. In between, at ωτ = 1, the loss is greatest. The loss part of the permittivity from one mechanism is proportional to ωτ ÷ (1 + ω²τ²), which rises to a peak of 0.5 at ωτ = 1 and falls symmetrically on a logarithmic scale either side.

```figure
type: line
title: Loss from a single Debye relaxation against frequency
x: ωτ, logarithmic steps
y: ε″ ÷ Δε
ymin: 0
ymax: 0.6
caption: Δε is the strength of the mechanism, the difference between its permittivity at low and high frequency. A mechanism with τ of about 3.2 ms would peak at 50 Hz. Real insulation has many mechanisms, so its loss curve is broader and flatter.
- 0.1 | 0.099
- 0.3 | 0.275
- 1 | 0.500
- 3 | 0.300
- 10 | 0.099
```

Real insulation has many mechanisms with a broad spread of relaxation times, which is the same spread that makes the DC absorption current a power law. Its loss therefore changes slowly with frequency, but it changes markedly with temperature, because temperature shortens relaxation times and moves the loss peaks to higher frequencies. Water adds mechanisms of its own. Measuring tan delta over a range of frequencies, a technique called dielectric frequency response, can separate moisture from ageing in transformer and cable insulation, and is used increasingly on machines.

## Capacitance and moisture

The capacitance itself is also informative. Water's relative permittivity of about 80 is much higher than that of mica-epoxy, so a winding that absorbs water shows a rise in capacitance. A simple estimate, taking the permittivities in proportion to the volume of each material, gives an upper bound: if 0.2 % of the insulation's volume became water, the effective permittivity would rise from 4.5 to 0.998 × 4.5 + 0.002 × 80 = 4.651, an increase of 3.4 %, and C-1's capacitance per phase would rise from 21.1 nF to about 21.8 nF. Modern test sets measure capacitance to better than 0.1 %, so changes of this size are easily seen when they are compared with previous readings at the same temperature.

A fall in capacitance, by contrast, can indicate delamination: layers of insulation separating so that air-filled gaps, with a relative permittivity of 1, are added in series with the solid. In form-wound machines, a slow fall in capacitance together with a rising tip-up is a classic sign of thermal ageing.

```figure
type: compare
title: What changes in capacitance and tan delta suggest
cols: Capacitance | Tan delta at low voltage | Tip-up
rowhead: Condition
- Moisture absorbed | rises | rises | little change
- Surface contamination | little change | rises | may rise
- Thermal ageing and delamination | falls | rises slowly | rises
- Voids discharging | little change | little change | rises
caption: Typical patterns, used together and compared with the machine's own history at the same temperature. No single result is diagnostic on its own.
```

## Tip-up

The tip-up test measures tan delta at two or more voltages, typically a low voltage at which no partial discharge occurs and a higher voltage near the machine's phase-to-earth voltage. In a sound, well-impregnated winding the dissipation factor hardly changes with voltage. If the insulation contains voids, the gas in them breaks down once the voltage is high enough, as Chapter 8 explains, and the discharges add loss. The dissipation factor then rises with voltage, and the difference between the high- and low-voltage values is the tip-up.

Tip-up is most useful on high-voltage machines, typically those rated 6 kV and above, where voids are more likely to discharge at operating voltage. C-1's tip-up between 20 % and 100 % of phase voltage was 0.05 percentage points at commissioning and has stayed below 0.1 percentage points since, which is consistent with Chapter 8's finding that small voids in its groundwall should not discharge at its operating voltage. Large stator coils in high-voltage machines are often tested individually for tip-up when they are made, which is a quality check on their impregnation.

## Doing the AC test

An AC insulation test set applies a power-frequency voltage from a high-voltage source and measures the current's magnitude and phase against a low-loss reference capacitor, in effect a modern, automated form of the classic bridge. Like the DC test, it is done with the machine isolated, its cables disconnected or accounted for, and the site's high-voltage rules in force, and the winding is discharged and earthed afterwards.

The test set must be able to supply the winding's charging current. For one phase of C-1 at 1,905 V, the current of 12.63 mA needs an apparent power of 1,905 × 0.01263 = 24 VA; for all three phases tested together, about 72 VA. Those are small, and a portable set handles them easily. A long cable or a large generator has a far greater capacitance, and testing it at full voltage needs a much larger source or a resonant test set that cancels the capacitive current with an inductor.

Each phase is usually tested with the other two phases either earthed or connected to the test set's guard. With the others earthed, the measurement includes the insulation between phases; with them guarded, it measures only the insulation between the tested phase and the core. The connection used must be recorded and kept the same from test to test, because the two give different capacitances and different dissipation factors. The site tests each phase of C-1 and C-2 with the other two guarded, at 20 % and 100 % of phase voltage, after the winding has cooled.

## The mistake: a warm winding

At C-1's eighth annual shutdown, the AC test set was booked for the first morning, and to save time the technician tested the motor within an hour of stopping it. The phase measurements gave a dissipation factor of about 1.95 % at phase voltage. At commissioning, and in the previous seven years, it had been between 1.20 % and 1.30 %. The rise of about 50 % was reported as a sign of serious ageing, and the plant manager was asked to approve an inspection by the rewinder with the rotor removed, at an estimated cost of A$12,000 and two extra days of shutdown.

The electrical supervisor checked the test sheet. The winding temperature, from the embedded detectors, had been 55 °C at the time of the test. All previous tests had been done after the motor had cooled overnight, at 20 to 25 °C. The dissipation factor of mica-epoxy insulation rises with temperature, and C-1's own readings taken as it cooled during an earlier shutdown had shown about 1.20 % at 20 °C, 1.40 % at 40 °C and about 1.95 % at 60 °C. A reading of about 1.95 % with the winding still warm was therefore at or near what the winding would show at that temperature, not a sign of ageing.

The test was repeated the next morning with the winding at 24 °C, and gave 1.28 %, within the range of previous years. The inspection was cancelled.

```figure
type: steps
title: Tracing the high tan delta
caption: This is an illustration. Tan delta at phase voltage, 50 Hz. The temperature curve was measured on C-1 as it cooled during an earlier shutdown.
- Test one hour after stopping | tan δ about 1.95 %, against 1.20 to 1.30 % in previous years
- First conclusion | serious ageing; rotor-out inspection requested
- Test sheet check | winding at 55 °C; previous tests at 20 to 25 °C
- C-1's own temperature curve | about 1.20 % at 20 °C, 1.40 % at 40 °C, 1.95 % at 60 °C
- * Retest at 24 °C | 1.28 %, within the normal range
- Fix | AC tests only after the winding has cooled to within 5 °C of the reference temperature
```

The site's procedure now requires AC tests to be made only after the winding has cooled to within 5 °C of its reference temperature of 20 °C, and the winding temperature is a mandatory field on the test sheet. C-1's temperature curve is kept with its records, so that a test that must be done warm can at least be compared with the expected value at that temperature.

## Exercise: tan delta from a power reading

An AC test set connected to one phase of C-2 at 1,905 V and 50 Hz reads a current of 12.7 mA and a power of 0.42 W. Calculate the power factor, the phase angle, the loss angle, tan delta and the capacitance.

### Answer

**Given:** V = 1,905 V, I = 12.7 mA, P = 0.42 W, f = 50 Hz.

**Assumptions:** the parallel model; sinusoidal voltage and current.

**Method:** cos φ = P ÷ (VI); δ = 90° − φ; tan δ; C = I sin φ ÷ (ωV).

**Power factor:** 0.42 ÷ (1,905 × 0.0127) = 0.01736.

**Phase angle:** φ = arccos 0.01736 = 89.005°.

**Loss angle:** δ = 90° − 89.005° = 0.995°.

**Tan delta:** tan 0.995° = 0.01736, or 1.74 %, almost exactly the power factor, as expected for a small angle.

**Capacitance:** 0.0127 × sin 89.005° ÷ (314.16 × 1,905) = 21.2 nF.

**Conclusion:** C-2's capacitance matches C-1's within 0.6 %, and its tan delta is a little higher. Before comparing it with C-1's 1.28 % or its own history, the winding temperature at the time of the test must be checked.

**Verification:** the dielectric loss calculated from the result, 1,905² × 314.16 × 21.2 × 10⁻⁹ × 0.01736 = 0.42 W, matches the measured power.
