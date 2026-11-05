---
book: thermoelectric-cooling-by-the-numbers
chapterSlug: reading-a-module-datasheet
order: 3
title: "Reading a module datasheet"
description: "What Imax, Vmax, ΔTmax and Qmax mean, how to derive a module's Seebeck coefficient, resistance and conductance from them, and how to predict heat pumped, voltage, power and COP at any operating point."
draft: false
---

A thermoelectric module's datasheet gives four headline numbers and a page of curves. The numbers look like limits, and two of them are, but their real value is that they define the module completely. From the maximum current, maximum voltage and maximum temperature difference at a stated hot-side temperature, three constants follow, and with them the heat pumped, the voltage, the power and the COP at any current and any pair of face temperatures. Every later chapter's design rests on those three constants.

This chapter explains what each rating means, derives the trust's module constants, checks them against the datasheet's other figures, works the cabinet cooler's design point with the BIZOMAT tool that does the same calculation, and finishes with ratings read at the wrong temperature, which nearly bought a fourth module the cooler did not need.

## The four ratings

Datasheets state ratings at a hot-side temperature, usually 27 °C and often also 50 °C, with the module in a vacuum or dry nitrogen so that no heat leaks between the plates through air.

```figure
type: compare
title: What each headline rating means
cols: Definition | The trust's module at 27 °C hot side
rowhead: Rating
- ΔT_max | the largest difference between hot and cold faces, reached with no heat load at the optimum current | 68 K
- I_max | the current that produces ΔT_max | 6.0 A
- V_max | the voltage across the module at I_max and ΔT_max | 15.4 V
- Q_max | the most heat pumped, at I_max with both faces at the same temperature | about 57 W
caption: This is an illustration of a generic 127-couple bismuth telluride module. Q_max here is calculated from the other three ratings; datasheets usually state it, and the agreement is a check on the model.
```

None of the four is an operating point. At ΔT_max the module pumps no heat; at Q_max it holds no temperature difference. A useful cooler works between the two, typically at half to two-thirds of I_max and a third to a half of ΔT_max. The ratings are best read not as limits to approach but as the coordinates of the module's model.

## Three constants from three ratings

Chapter 1's heat balance contains three module constants: the Seebeck coefficient S, the electrical resistance R and the thermal conductance K. The three ratings fix all three, by three facts about the ideal model at the rated point.

```figure
type: formula
title: Module constants from the datasheet ratings
formula: S = V_max ÷ T_h
formula: R = (T_h − ΔT_max) × V_max ÷ (T_h × I_max)
formula: K = (T_h − ΔT_max) × V_max × I_max ÷ (2 × T_h × ΔT_max)
caption: T_h is the absolute hot-side temperature at which the ratings were measured. The formulas follow from three facts: I_max is the current that maximises the heat pumped at the cold side's temperature at ΔT_max; at that point the net heat pumped is zero; and V_max is the voltage there.
- S | module Seebeck coefficient, V/K
- R | module electrical resistance, Ω
- K | module thermal conductance, W/K
```

Each formula has a short story. At I_max and ΔT_max, the voltage across the module is the Seebeck voltage plus the resistive drop, S ΔT + I R; since I_max is the optimum current S T_c ÷ R, the resistive drop is S T_c, and the total is S T_h. So V_max divided by the absolute hot-side temperature is S. With S known, the optimum-current condition gives R. And with the net heat pumped zero at ΔT_max, the Peltier heat less half the Joule heat equals the conduction, which gives K.

For the trust's modules, rated at T_h = 27 °C = 300.15 K:

- S = 15.4 ÷ 300.15 = 0.05131 V/K, or 51.31 mV/K;
- R = (300.15 − 68) × 15.4 ÷ (300.15 × 6.0) = 1.985 Ω;
- K = (232.15 × 15.4 × 6.0) ÷ (2 × 300.15 × 68) = 0.5255 W/K.

Per couple, those are 404 µV/K, 15.6 mΩ and 4.14 mW/K, and Chapter 2 showed that together they give ZT = 0.76 at 300 K.

### Checks on the constants

Three checks confirm that the constants describe the module.

**Q_max.** With both faces at 300.15 K and the current at I_max, the heat pumped is S I T − ½ I² R = 0.05131 × 6.0 × 300.15 − ½ × 36 × 1.985 = 92.4 − 35.7 = 56.7 W. A datasheet stating 56 or 57 W agrees.

**The 50 °C ratings.** The model predicts what the module should be rated at a 50 °C hot side: ΔT_max = 76.7 K, I_max = 6.37 A, V_max = 16.6 V. Datasheets that give both sets of ratings let the designer check that the module behaves consistently, and entering the 50 °C ratings into the same formulas gives constants within 0.5% of those from the 27 °C ratings.

**The resistance.** A module's AC resistance, measured with a meter that uses a small alternating current so as not to create a temperature difference, should match R closely. A bench check of a new module's AC resistance is the quickest test that it is the type it is supposed to be and that no joint has failed.

**The Seebeck voltage.** Chapter 1's orientation test also checks S. With one face held 10 K above the other and the leads open, the module should show S × 10 K = 0.51 V. A module that shows much less has lost couples or has a damaged junction; one that shows the right voltage but the wrong AC resistance has a bad joint in series with sound couples. Together, the two bench checks catch most faulty modules before they are clamped into a cooler, where finding them costs a dismantling.

## Predicting any operating point

With S, R and K, the module's behaviour at any current I, hot face T_h and cold face T_c follows from Chapter 1's equations: heat pumped Q_c = S I T_c − ½ I² R − K ΔT; voltage V = S ΔT + I R; power P = V I; heat rejected Q_h = Q_c + P; COP = Q_c ÷ P. The [thermoelectric cooler check](/tools/thermoelectric-cooler-check/) does exactly this. It takes the datasheet's I_max, V_max and ΔT_max at the rated hot-side temperature, derives the three constants, and evaluates them at the operating current and face temperatures for a stated number of modules, checking the result against the heat load and the module's current and voltage ratings.

For the cabinet cooler CC-1, Chapter 5 settles the operating point after balancing the modules against the heat sinks: three modules in series on the 24 V supply, each at about 8.0 V and 3.20 A, with the cold faces at 27.0 °C and the hot faces at 59.3 °C, against a design heat load of 62 W.

```figure
type: stats
title: CC-1's three modules at the design point, from the thermoelectric cooler check
caption: This is an illustration. Ratings 6.0 A, 15.4 V and 68 K at 27 °C; 3.20 A per module; faces at 27.0 °C and 59.3 °C; 62 W heat load.
- 51.31 mV/K, 1.985 Ω, 0.5255 W/K | module constants
- 22.14 W per module, 66.43 W in all | heat pumped from the cold side
- 8.01 V, 25.63 W per module | voltage and power
- 0.864 | COP
- 143.3 W | heat the hot-side sink must reject
- 7.76 A, 42.8 W per module | current for the most heat pumped at these temperatures, and that heat
```

Three modules pump 66.4 W against the 62 W load, a margin of 7%. Each draws 25.6 W, so the cooler's modules take 76.9 W from the supply, and the hot-side sink must reject the sum of both, 143.3 W, more than twice the heat removed from the cabinet. That last figure drives Chapter 5's heat sink design.

The tool also reports the current at which each module would pump the most heat at these face temperatures, 7.76 A, beyond the module's 6.0 A rating, and the 42.8 W it would pump there. It is a reminder that the module is being run well below its capacity, for efficiency: pushing the current towards I_max would raise the heat pumped but raise the power faster, and Chapter 4 shows the cost.

## Datasheet curves

Most datasheets also show two families of curves at a stated hot-side temperature: the heat pumped against current for several temperature differences, and the voltage against current for the same differences. The model reproduces them, and drawing a few points from the constants is a good way to read the curves correctly.

```figure
type: line
title: Heat pumped per module against current, hot face 27 °C, from the fitted constants
x: Current, A
y: Heat pumped per module, W
ymin: -5
ymax: 60
caption: This is an illustration. Each curve is Q_c = S I T_c − ½ I² R − K ΔT with the hot face at 300.15 K. At ΔT = 0 the heat pumped reaches 56.7 W at the 6.0 A rating; with a 30 K difference, cold face at 270.15 K, it reaches 31.7 W, and at 1 A it pumps none.
series: ΔT = 0 K | ΔT = 30 K
- 1 | 14.4 | -2.9
- 2 | 26.8 | 8.0
- 3 | 37.3 | 16.9
- 4 | 45.7 | 23.8
- 5 | 52.2 | 28.7
- 6 | 56.7 | 31.7
```

Two features of the curves are worth knowing. Each curve is a parabola, rising steeply at first and flattening as Joule heating catches up, so the last ampere adds much less heat than the first. And the curves for larger temperature differences are nearly the same parabola shifted down by K ΔT, tilted slightly because a colder face absorbs a little less Peltier heat per ampere, so every kelvin of difference costs about the same heat, 0.53 W per module by conduction plus a little Peltier heat, at every current. That is why Chapter 5 works so hard to reduce the temperature differences added by the heat sinks.

## What else a datasheet must tell you

The four ratings define the module's thermoelectric behaviour. Several other lines on the datasheet decide whether it survives in service.

**Maximum operating temperature.** The legs are soldered to the copper strips, and the solder sets the highest temperature either face may reach, commonly around 80 °C for the standard low-melting solders and higher for modules made with high-temperature solders. CC-1's hot faces run at 59.3 °C at design; Chapter 5 shows they would exceed 69 °C if the heat sink fouled, so a module rated to only 70 °C would be close to its limit on the worst day.

**Flatness, parallelism and mounting pressure.** The faces are lapped flat to a few hundredths of a millimetre so that a thin layer of thermal grease or a pad can fill the gaps to the heat exchangers. The maker states the clamping pressure that keeps the thermal contact good without cracking the ceramic or the legs. Too little pressure leaves an air gap that adds a kelvin or more; too much breaks modules, often silently, so that they fail weeks later.

**Sealing.** Modules for humid service are sealed around their edges with silicone or epoxy to keep moisture out of the space between the plates, where it would condense on the cold side, corrode the junctions and short the strips. Chapter 7 explains why the cabinet cooler needs sealed modules.

**Dimensions and lead length.** The module's footprint and thickness set the heat exchanger's design, and its leads must reach the terminal block without strain on the solder joints at the module's edge.

None of these appears in the thermoelectric model, and none is optional.

## The mistake: ratings read at the wrong temperature

The trust's first sizing of CC-1 was done by a graduate engineer using the thermoelectric cooler check. The module's datasheet gave ratings at both 27 °C and 50 °C in two adjacent columns. The graduate entered I_max, V_max and ΔT_max from the 27 °C column but set the rated hot-side temperature to 50 °C, because the cooler's hot side would be closer to 50 °C than to 27 °C.

```figure
type: steps
title: Tracing a fourth module to a mismatched rating temperature
caption: This is an illustration. Ratings and their temperature are one set; the tool's rated hot-side temperature is the temperature of the ratings, not of the application.
- 27 °C ratings entered with a 50 °C rating temperature | S = 47.66 mV/K, 7% low; R = 2.027 Ω; K = 0.536 W/K
- Heat pumped at the design point | 18.07 W per module, 54.2 W for three, less than the 62 W load
- Recommendation | add a fourth module, a larger heat sink and a larger supply
- * Review: ratings and rating temperature must match | 27 °C ratings at 27 °C, or 50 °C ratings at 50 °C
- Recalculated | 66.4 W with the 27 °C set, 66.9 W with the 50 °C set: three modules suffice
```

The mismatch made S 7% too low, because S is V_max divided by the rated temperature, and the 15.4 V belonged to 300.15 K, not 323.15 K. The Peltier term fell with it, the predicted heat pumped fell to 54.2 W, and the graduate recommended a fourth module, which would also have needed a bigger hot-side sink and supply. The reviewing engineer noticed that the constants did not match the AC resistance printed on the datasheet, 1.98 Ω, and traced the problem to the rating temperature. With either matched set, three modules pump about 66 W. The rule is simple: the rated hot-side temperature in the calculation is the temperature at which the ratings were measured, never the temperature at which the module will work. The model takes care of the working temperature.

## Exercise: SC-1's module at its operating point

SC-1 uses one module of the same type. Its operating point is 3.0 A, with the cold face at 1 °C and the hot face at 45 °C, against a heat load of 9 W. Using the 27 °C ratings, calculate the module constants, the heat pumped, the voltage, the power, the COP and the heat to reject, and check whether the module carries the load. Then calculate the heat pumped if the hot face could be held at 40 °C instead.

### Answer

**Given:** I_max = 6.0 A, V_max = 15.4 V, ΔT_max = 68 K at 27 °C; I = 3.0 A; T_c = 274.15 K; T_h = 318.15 K, then 313.15 K; load 9 W.

**Assumptions:** the ideal module model with constants fitted at the rated point; faces at the stated temperatures.

**Method:** derive S, R and K; evaluate Q_c, V, P, COP and Q_h.

**Constants:** S = 51.31 mV/K, R = 1.985 Ω, K = 0.5255 W/K, as above.

**At 45 °C hot face:** ΔT = 44 K. Q_c = 0.05131 × 3.0 × 274.15 − ½ × 9 × 1.985 − 0.5255 × 44 = 42.20 − 8.93 − 23.12 = 10.14 W. V = 0.05131 × 44 + 3.0 × 1.985 = 2.26 + 5.96 = 8.21 V. P = 8.21 × 3.0 = 24.64 W. COP = 10.14 ÷ 24.64 = 0.41. Q_h = 10.14 + 24.64 = 34.78 W. The module carries the 9 W load with a margin of 13%.

**At 40 °C hot face:** ΔT = 39 K. The Peltier and Joule terms are unchanged; conduction falls to 0.5255 × 39 = 20.49 W. Q_c = 42.20 − 8.93 − 20.49 = 12.77 W, 26% more.

**Interpretation:** five kelvin off the hot face is worth 2.6 W, about a quarter more cooling, for nothing but a better heat sink. Chapter 5 turns that into the sink's thermal resistance.

**Verification:** the thermoelectric cooler check with these inputs gives 10.14 W, 8.21 V, 24.64 W, a COP of 0.41 and 34.78 W to reject, with the heat pumped passing against 9 W; the difference between the two hot-face cases is exactly K × 5 K = 2.63 W.
