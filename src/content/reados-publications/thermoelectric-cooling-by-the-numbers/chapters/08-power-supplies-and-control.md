---
book: thermoelectric-cooling-by-the-numbers
chapterSlug: power-supplies-and-control
order: 8
title: "Power supplies and control"
description: "Wiring modules in series or parallel, the switch-on surge, why ripple and unfiltered PWM waste cooling, on–off and proportional control, interlocks, and reversing current to heat or defrost."
draft: false
---

A thermoelectric module responds to current, and how that current is delivered matters more than for almost any other load. A module pumps heat in proportion to its average current but heats itself in proportion to the square of its current at every instant. Two supplies that deliver the same average current can therefore produce very different cooling: steady current gives the most, and current switched hard on and off gives much less. The controller, the sensors and the interlocks that protect the modules complete the electrical design.

This chapter covers how CC-1's modules are wired to its supply, the current surge at switch-on, the effect of ripple and pulse-width modulation, on–off and proportional control, the interlocks that protect the modules if a fan fails, and reversing the current to heat or defrost. It finishes with a replacement supply that halved the cooler's capacity while using more than twice the power.

## Series, parallel and the supply

Each of CC-1's modules works at about 8 V and 3.2 A at the design point. Three in series need 24 V at 3.2 A, a standard supply voltage; CC-1 has its own 24 V supply, separate from the electronics' supply. Three in parallel would need 8 V at 9.6 A, an unusual supply voltage and three times the current in the wiring. Series wiring is the usual choice: it matches common supply voltages, keeps currents and cable sizes small, and guarantees that every module carries the same current.

Its weakness is that one module failing open stops the whole string. Parallel strings keep working if one module fails, but if one module's resistance drifts, it carries more or less current than its neighbours, and a failure to short circuit draws excessive current through that branch. For a three-module cooler, a single series string, with the controller watching for a loss of current, is simplest.

### The switch-on surge

When the cooler starts, both faces are at the same temperature and there is no Seebeck voltage opposing the supply, so each module draws its full voltage divided by its resistance: 8.0 ÷ 1.985 = 4.03 A. As the faces separate, the Seebeck voltage builds up, S × ΔT = 1.66 V at the design point's 32.3 K, and the current falls to 3.20 A. The surge, 26% above the running current, is well within the modules' 6.0 A rating, but the supply must deliver 24 V × 4.03 A = 97 W at start-up without folding back. A supply sized only for the 77 W running load may limit its current, never let the faces separate properly, and never reach the design point.

## Ripple and pulse-width modulation

The heat pumped depends on the average current, through the Peltier term S Ī T_c. The Joule heating depends on the mean of the current squared, through ½ R × mean(I²). Any variation of the current around its average, whether ripple from a poorly filtered supply or deliberate switching, raises mean(I²) above Ī² and wastes cooling.

```figure
type: formula
title: Effect of current variation on a module's heat pumped
formula: Q_c = S Ī T_c − ½ R × mean(I²) − K ΔT
formula: Triangular ripple of peak-to-peak r × Ī: mean(I²) = Ī² (1 + r² ÷ 12)
formula: Square pulses of height I_on and duty D: Ī = D I_on; mean(I²) = D I_on² = Ī² ÷ D
caption: Ripple of 10% peak-to-peak raises the Joule heating by less than 0.1%. Pulses at 50% duty double it compared with steady current of the same average.
- Ī | average current, A
- mean(I²) | mean of the current squared, A²
- D | duty cycle of a pulsed supply, 0 to 1
```

For one of CC-1's modules at the design faces and 3.20 A average, 10% ripple costs 0.01 W of cooling, 30% costs 0.08 W and 100% costs 0.85 W. Ordinary switch-mode supplies with output ripple of a few per cent are harmless. Pulse-width modulation of the modules directly is not, unless the pulses are smoothed by an inductor and capacitor into a near-steady current. Chopped at a few hundred hertz, the module's own thermal mass smooths the temperature, but not the Joule heating, which follows the instantaneous current. The rule many module makers give is to keep the current ripple below about 10%, which this calculation supports.

## The mistake: a 48 V supply and a PWM controller

When CC-1's 24 V supply failed in its fourth summer, the only replacement in the contractor's van was a 48 V supply. To bring the voltage down, the electrician added a PWM motor-speed controller, set to 50% duty, reasoning that half of 48 V is 24 V. The controller's output went straight to the module string. The cooler ran, and within two hours on a 43 °C afternoon the cabinet passed 37 °C.

```figure
type: steps
title: Why half of 48 V is not 24 V to a module
caption: This is an illustration with the faces held at their design temperatures for comparison. In practice the hot side ran hotter still, which made the result worse.
- PWM at 50% duty from 48 V | each module sees 16 V pulses; on-current (16 − 1.66) ÷ 1.985 = 7.22 A, above the 6.0 A rating
- Average current | 3.61 A, a little above the design's 3.20 A
- Joule heating per module | 0.5 × 7.22² × 1.985 = 51.8 W, against 20.3 W at a steady 3.20 A
- * Heat pumped by three modules | 38.3 W for 173 W of power, against 66.4 W for 77 W
- Fix | a 24 V supply fitted the next morning; PWM drives allowed only with an output filter keeping ripple below 10%
```

The average current, 3.61 A, was close to the design's, but the modules saw it as pulses of 7.22 A, above their rating, half the time. The Joule heating, which follows the square of the instantaneous current, was 51.8 W per module instead of about 20 W, and the three modules pumped only 38.3 W while drawing 173 W. The hot side, rejecting 212 W instead of 143 W, ran hotter than design, which cut the cooling further. The cabinet overheated, and the modules spent an afternoon pulsed beyond their rated current. A 24 V supply was fitted the next morning, and the trust's specification for the cooler now states that any PWM drive must have an output filter that keeps the current ripple below 10% at full load.

## On–off and proportional control

The simplest controller is a thermostat that switches the full supply to the modules when the cabinet passes an upper setpoint and off when it falls below a lower one. It works, and it was CC-1's original control. It has three drawbacks.

**Efficiency.** Chapter 4 showed that delivering 40 W of average cooling by switching full current on and off at 60% duty takes 46.3 W of power, against 43.4 W for a steady reduced current, and more once the hot side's lower temperature at low current is counted.

**Temperature cycling.** Each switch-on cools the cold face and heats the hot face of every module, and each switch-off lets them relax. Chapter 9 shows that these cycles, repeated thousands of times, fatigue the modules' solder joints.

**Condensation.** At switch-on the cold face falls quickly to its full-load temperature, which on a humid day may be below the dew point even though the average would be safe, as Chapter 7 explained.

CC-1's present controller is proportional. It measures the cabinet air temperature and varies a filtered, steady module current smoothly between zero at 30 °C and the full 3.2 A at 34 °C, with the dew-point limit of Chapter 7 raising the band when the cabinet is humid. The current is varied by a buck converter between the 24 V supply and the modules, whose output inductor keeps the ripple to a few per cent.

```figure
type: compare
title: CC-1's control options
cols: Effect on COP | Temperature cycling | Condensation risk | Cost and parts
rowhead: Control
- Thermostat, full current on and off | lowest | a cycle every switch-on | cold face at full-load temperature at every start | cheapest
- Thermostat with soft start | low | fewer, gentler cycles | lower | small extra
- * Proportional, filtered steady current | highest at part load | almost none | lowest; can follow the dew point | a buck converter and sensors
- Proportional with dew-point limit | as above | almost none | managed | adds a humidity sensor
caption: This is an illustration. CC-1 uses proportional control with a dew-point limit.
```

### Where the sensor goes

The controller can only hold what it measures. A sensor placed in the cold exchanger's outlet air reads several kelvin below the cabinet's average and makes the controller think the cabinet is cooler than it is; one placed against the power supply reads high. CC-1's sensor sits in the cabinet's return air, mid-height on the side away from the cooler, where it reads the air that the electronics breathe. A second sensor on the hot-side sink base, beside the modules, feeds the interlock below and the dust alarm of Chapter 5.

## Interlocks

The modules can destroy themselves in minutes if their hot side cannot reject heat. With the hot-side fan stopped, the sink's resistance rises roughly fourfold, to about 0.4 K/W in still air. The model then puts the hot faces at about 82 °C on a 45 °C afternoon, above the modules' soldering limit, while the cooling collapses to about 27 W. CC-1's controller therefore cuts the module current whenever the hot-side fan's speed signal is lost or the hot-side sink exceeds 75 °C, and sends an alarm. It also watches the module current: a current near zero with the supply on means an open circuit in the string, and a current far above the expected value means a shorted module.

## Supply losses are part of the load

A supply's losses are heat, and where they are released matters. At the design point CC-1's modules draw 76.7 W; a 90% efficient supply feeding them takes 85.2 W from the mains and loses 8.5 W. Mounted inside the cabinet, that 8.5 W would be heat the cooler must pump, costing a further 9.8 W of module power at a COP of 0.865, and 14% more load on a cooler with only 7% of margin. That is why CC-1's supply sits in the cooler's outer housing, in the hot-side airstream, where its losses go straight to the outside air. The electronics' own supply cannot be moved out, so its efficiency at its actual light load belongs on the purchase specification: every watt it loses is a watt the cooler must pump, and about 1.2 W more electricity to pump it.

## Monitoring through the telemetry

The pump station is unattended, so the controller's measurements go out through the station's telemetry radio with its other data: cabinet air temperature and humidity, the calculated dew point, hot-side sink temperature, module current and the fan speed signals. Trends in these numbers show trouble before it becomes a fault. A hot-side temperature creeping up from summer to summer at the same outside temperature points to fouling fins, as in Chapter 5. A module current drifting at the same voltage points to a module whose resistance is changing, the first sign of joint wear. A cabinet whose dew point rises steadily points to a gasket that no longer seals. The cost is a few registers in the controller and a page in the station's control system, and it turns a cooler that fails without warning into one that asks for maintenance.

## Reversing the current

A module heats its cold side when the current is reversed, through an H-bridge in the controller, with no other change. CC-1 does not need it, because the insulated cabinet with 48 W inside never falls near its dew point on winter nights, as Chapter 6 showed. A bare cabinet in a colder place might, and reversing the cooler then makes it a heater with a COP above one, since it adds both the heat pumped from outside and its own electrical power.

SC-1 uses reversal for a different reason. If its cold plate ever falls below 0 °C, for example after a fault in its controller, frost builds on the fins and insulates them. A short reverse pulse warms the plate above 0 °C and lets the frost melt into the drain. Reversal must be gentle: a module switched abruptly from full cooling to full heating suffers the largest possible temperature swing across its joints, so the controller ramps the current down to zero, waits, and ramps it up in the reverse direction.

## Exercise: sizing the supply for SC-1

SC-1's single module runs at 3.0 A and about 8.2 V at its design point, with faces at 1 °C and 45 °C. Its controller is powered from the station's 24 V supply through a buck converter that is 92% efficient. Calculate the module's switch-on current if the converter delivered 8.2 V with the faces at the same temperature, the converter's input power at the design point, and the effect on the heat pumped if the converter's output ripple were 30% peak-to-peak. Then say what current limit the converter should have.

### Answer

**Given:** I = 3.0 A; V = 8.21 V; faces 274.15 K and 318.15 K; R = 1.985 Ω; S = 0.05131 V/K; converter efficiency 92%; ripple 30%.

**Assumptions:** the ideal module model; triangular ripple; the converter's output voltage fixed at 8.21 V until its current limit acts.

**Method:** surge = V ÷ R with no Seebeck voltage; input power = V I ÷ efficiency; ripple loss = ½ R Ī² × r² ÷ 12.

**Switch-on current:** 8.21 ÷ 1.985 = 4.14 A, 38% above the running current and within the 6.0 A rating.

**Input power:** 8.21 × 3.0 ÷ 0.92 = 26.8 W, of which 2.1 W is lost in the converter as heat in the controller's enclosure.

**Ripple loss:** ½ × 1.985 × 3.0² × 0.30² ÷ 12 = 0.067 W, less than 1% of the 10.1 W pumped.

**Current limit:** set it a little above the switch-on surge and below the rating, about 4.5 A, so that the converter does not fold back during start-up and the module is protected if the faces are ever forced together, such as by a failed sink.

**Interpretation:** a converter with modest ripple costs almost nothing in cooling; the start-up surge, not the running current, sets the converter's rating; and the current limit is a protection, not a control.

**Verification:** at 4.14 A with both faces equal, the voltage is all resistive: 4.14 × 1.985 = 8.21 V; as the faces separate by 44 K, the Seebeck voltage of 2.26 V reduces the current to (8.21 − 2.26) ÷ 1.985 = 3.0 A, the design current.
