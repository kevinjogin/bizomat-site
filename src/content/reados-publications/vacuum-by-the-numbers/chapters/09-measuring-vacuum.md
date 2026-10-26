---
book: vacuum-by-the-numbers
chapterSlug: measuring-vacuum
order: 9
title: "Measuring vacuum"
description: "Direct and indirect gauges, why a diaphragm gauge reads true pressure for any gas, how a Pirani gauge uses the mean free path, gas dependence, where a gauge sits, and two gauges that disagreed."
draft: false
---

A vacuum gauge is the only window into a chamber's state, and every decision in this book, when to start a timer, whether a leak has grown, whether a pump is wearing, rests on its reading. Gauges measure pressure in two fundamentally different ways. Some measure the force the gas exerts, as pressure is defined, and read the same for any gas. Others measure a property of the gas that depends on pressure, such as how well it conducts heat, and read differently for different gases. Choosing the right one, putting it in the right place and knowing what it is really telling you are as important as the pump.

This chapter divides gauges into direct and indirect kinds, explains the capacitance diaphragm gauge and the Pirani gauge, uses Chapter 3's kinetic theory to show why a Pirani gauge works only over a certain range and why it depends on the gas, works out how much the reading depends on where the gauge is fitted, covers calibration and ranges, and ends with two gauges on VC-200 that disagreed during degassing.

## Direct and indirect gauges

**Direct gauges** measure force per unit area. Their reading does not depend on what the gas is.

- **Bourdon and dial gauges** use a curved tube or capsule that deflects with the pressure difference across it. They are cheap and robust, usually read gauge pressure, and cannot resolve a few hundred pascals near full vacuum (Chapter 1's error).
- **Capacitance diaphragm gauges** use a thin metal or ceramic diaphragm with a sealed reference vacuum on one side. The chamber's pressure deflects it, and the change in capacitance between the diaphragm and a fixed electrode measures the deflection. They read absolute pressure, accurately, for any gas, over about three to four decades below each sensor's full scale.
- **Piezoresistive gauges** use a strain-gauged diaphragm and suit the range from atmospheric pressure down to about a kilopascal.

**Indirect gauges** measure something else that depends on pressure: the gas's thermal conductivity, its viscous drag on a moving surface, or the current of ions produced in it. They reach much lower pressures than direct gauges, but their readings depend on the gas.

- **Pirani and thermocouple gauges** measure heat conducted away from a heated wire.
- **Ionisation gauges** ionise the gas and measure the ion current; they serve high vacuum and are not needed for VC-200.

## The capacitance diaphragm gauge

Because it measures force, a capacitance diaphragm gauge reads the true total pressure of whatever gas or vapour is present: air, water vapour, solvent vapours or a mixture. That makes it the right gauge for a process specified in absolute pressure with a vapour-laden gas, and it is the gauge VC-200's controller now uses (Chapter 1).

Each sensor covers a limited range below its full scale. A sensor with a full scale of 133 kPa, about 1,000 Torr, reads from atmospheric pressure down to a few tens of pascals with useful accuracy; a sensor with a full scale of 1.33 kPa reads accurately down to a fraction of a pascal. VC-200's gauge has a full scale of 13.3 kPa, as an illustration, which places its working pressure of 200 Pa at 1.5% of full scale, well within its accurate range, and reads the early pump-down only from 13.3 kPa downward. Temperature changes shift a diaphragm gauge's zero; heated, temperature-controlled versions are used where the best accuracy matters.

## The Pirani gauge and the mean free path

A Pirani gauge holds a fine wire at a raised temperature inside a small tube connected to the chamber and measures the electrical power needed to keep it there. The power goes into heat conducted away through the gas, plus a small constant loss by radiation and through the wire's supports.

Chapter 3 showed, with NIST's data, that a gas's thermal conductivity hardly changes with pressure as long as the mean free path is small compared with the apparatus: nitrogen conducts 0.02547 W/(m·K) at 0.1 MPa and 0.02544 at 100 Pa. In that range, a Pirani gauge's wire loses the same heat whatever the pressure, and the gauge cannot measure anything. That is why a Pirani gauge cannot read well near atmospheric pressure.

Once the mean free path becomes comparable with the distance between the wire and its tube, a fraction of a millimetre to a few millimetres, molecules carry heat directly from wire to wall without colliding on the way, and the heat each carries no longer depends on how far it travels. The heat conducted is then proportional to the number of molecules striking the wire each second, and so to the pressure. For nitrogen, with λ × p = 6.49 × 10⁻³ Pa·m, the mean free path is 1 mm at about 6.5 Pa and 0.1 mm at about 65 Pa. A Pirani gauge is most sensitive in roughly that region and usable over a few decades either side of it, typically from a few kilopascals down to a fraction of a pascal, depending on its design.

Below that range, the heat carried by the gas becomes small compared with the radiation and support losses, and the gauge again loses sensitivity.

```figure
type: compare
title: Gauges for VC-200's range
rowhead: Gauge
cols: Measures | Reads absolute? | Depends on the gas? | Where it fits VC-200
caption: General characteristics; makers' data give each model's range and accuracy. Only a direct gauge reads a vapour-laden process correctly without correction.
- Dial or Bourdon | deflection by pressure difference | usually gauge pressure | no | not useful near 200 Pa
- * Capacitance diaphragm | diaphragm deflection | yes | no | controls the process
- Piezoresistive | strained diaphragm | yes | no | early pump-down only
- Pirani | heat conducted from a wire | yes, as calibrated | yes, strongly | trend and pump checks
- Ionisation | ion current | yes, as calibrated | yes | high vacuum only
```

## Gas dependence

A Pirani gauge's reading depends on how well the gas carries heat from the wire, which depends on its molecular mass, its heat capacity and how efficiently its molecules exchange energy with the wire's surface. Gauges are calibrated for nitrogen or air, and makers publish correction curves or factors for other gases. For gases that carry heat very differently from nitrogen, the error without correction can be a large factor, not a few per cent, and the correction itself varies along the gauge's range.

A process gas that is a changing mixture, such as VC-200's air, water vapour and resin vapours, cannot be corrected with a single factor at all, because its composition changes during the cycle. That is the fundamental reason a vapour-laden process is controlled with a direct gauge. A Pirani gauge is still useful in such a system for what it does well: showing trends, checking a pump's blanked-off ultimate in dry nitrogen or air, and covering pressures below the diaphragm gauge's range.

## Where the gauge sits

Throughput is conserved along a line, but pressure is not: it falls in the direction of flow by the throughput divided by the conductance. A gauge reads the pressure where it is fitted.

This is an illustration. At VC-200's working pressure, the pump removes Q = 3.91 × 10⁻³ × 200 = **0.78 Pa·m³/s** through the hose and valve, whose combined conductance at that pressure is about 32.9 L/s (Chapter 4). The pressure difference across them is:

- Δp = 0.78 ÷ 0.0329 = **23.8 Pa**,

so while the chamber is at 200 Pa, the pump's inlet is at about **176 Pa**. A gauge fitted at the pump would read about 12% lower than the chamber, enough to put the chamber outside the process tolerance while the gauge reads within it. VC-200's process gauge is fitted directly to the chamber wall, away from the pumping port, so that it reads the pressure the resin sees.

```figure
type: formula
title: How much a gauge's position changes its reading
formula: Δp = Q ÷ C
caption: This is an illustration for VC-200 at its working pressure, with the hose and valve's combined conductance from Chapter 4.
- Q | Throughput through the line, 3.91 × 10⁻³ × 200 = 0.78 Pa·m³/s
- C | Hose and valve in series at 200 Pa, about 32.9 L/s
step: Δp = 0.78 ÷ 0.0329 = 23.8 Pa
step: Chamber 200 Pa; pump inlet about 176 Pa, 12% lower
```

## Calibration and checks

Gauges drift, and a gauge whose reading controls a process needs a calibration record. The practical arrangements for a small shop:

- **Calibration** of the process gauge at intervals the maker recommends, by a laboratory that can trace its standard to national measurement standards, with the certificate kept against the gauge's serial number.
- **Zero checks** of the diaphragm gauge at a pressure far below its range, a routine the maker describes, since diaphragm gauges drift mainly in their zero.
- **Cross-checks** between gauges in dry, clean conditions, where a Pirani gauge calibrated for nitrogen and a diaphragm gauge should agree closely; a disagreement there points to a gauge fault rather than a gas effect.
- **Contamination control**: a gauge fitted where vapours or resin droplets can reach it can be fouled, so VC-200's gauges sit on short side-tubes with baffles, not facing the resin.

The calibration interval is a judgement, not a rule. It starts from the maker's recommendation and is lengthened or shortened by the record: a gauge whose calibrations show no drift year after year can go longer between them, and one that has drifted, or that has been dropped, contaminated or exposed to a pressure spike, goes back to the laboratory early. For a gauge that decides whether every batch of a product is acceptable, as VC-200's does, the cost of a calibration is small next to the cost of a year of batches processed at the wrong pressure.

## Displays, units and logging

Gauge controllers display pressure in pascals, millibar or torr, often switchable, and in mantissa-and-exponent form such as 2.0E+2 for 200. A misread exponent is a factor of ten, and a unit switched on one controller but not another makes two correct gauges appear to disagree by a factor of 100 or 133. VC-200's controllers are locked to pascals, and the process sheet states the unit with every number.

For trend work, a gauge's output is far more useful logged than glanced at. VC-200's controller records the diaphragm gauge's reading every second through each cycle, with the batch size and the time, and keeps the weekly pump ultimate readings from the Pirani gauge. Three uses of that log have appeared in this book: comparing each pump-down with a reference curve (Chapter 6), spotting the stalled pump-down of a wet container (Chapter 7), and following the monthly rate-of-rise result for a slow upward trend (Chapter 8). A gauge that is read but not recorded can answer only today's question.

## Gauges and interlocks

Gauge readings also drive safety and protection functions, which should use a gauge suited to them.

- **Door interlock.** VC-200's door is locked until the chamber is within a few kilopascals of atmospheric pressure, so that nobody can release its clamps while 16 kN is holding it shut. The interlock uses a simple pressure switch set near atmospheric pressure, independent of the process gauge.
- **Vent sequence.** The vent valve opens only after the pump valve has closed, so that the pump is not flooded with atmospheric air through the chamber.
- **Pump protection.** A pump that sees a sudden rise in inlet pressure, such as a chamber vented by mistake while connected, is protected by closing its valve on a pressure rise.

Each of these functions fails safe if its sensor fails: a door that stays locked when its switch fails is an inconvenience, while a door that unlocks under vacuum is a hazard (Chapter 10).

## The error: two gauges that disagreed

This is an illustration. Before the diaphragm gauge was fitted, VC-200's controller used a Pirani gauge calibrated for nitrogen. When the diaphragm gauge was added, the two were logged side by side for a week. With the chamber empty and dry, they agreed within about 5% at 200 Pa. During degassing of a full batch, they disagreed by up to about **40%**, and the disagreement changed through the cycle, largest in the first minutes and shrinking as the resin degassed.

The pattern was the signature of gas dependence, not of a faulty gauge: agreement in dry nitrogen-like gas, disagreement in a changing mixture rich in water vapour and resin vapours, varying as the mixture changed. The Pirani gauge had been controlling a process at a pressure it could not correctly read for that gas.

The controller was switched to the diaphragm gauge, which reads the true total pressure of the mixture. The Pirani gauge was kept, and its readings in dry conditions are now used for the weekly pump ultimate check and as a cross-check on the diaphragm gauge's zero. The process sheet records which gauge controls each step.

```figure
type: checklist
title: Gauge checks for a vacuum process
caption: The gauge decides every step; these checks make its number mean what the process sheet says. The last line is this chapter's error.
- Direct gauge for vapour-laden gas | capacitance diaphragm controls the process
- Working pressure within the gauge's accurate range | 200 Pa on a 13.3 kPa full-scale sensor
- Gauge fitted where the process pressure is | on the chamber, away from the pump port; 12% lower at the pump
- Calibration traceable and recorded | certificate against the serial number
- Gauges cross-checked in dry gas | within about 5% at 200 Pa
- x Pirani gauge controlling a changing vapour mixture | disagreed by up to 40% during degassing
```

## Exercise: a gauge at the pump

A second chamber's gauge is fitted at its pump's inlet. At its working pressure, the pump's effective speed is 8 L/s at the chamber, and the gauge at the pump reads 150 Pa. The line between chamber and pump has a conductance of 20 L/s at that pressure. Estimate the chamber's pressure.

**Worked answer.** The pump's own speed S satisfies 1 ÷ 8 = 1 ÷ S + 1 ÷ 20, so S = **13.3 L/s**.

- Throughput at the pump: Q = 13.3 × 10⁻³ × 150 = **2.0 Pa·m³/s**.
- Pressure drop along the line: 2.0 ÷ 0.020 = **100 Pa**.
- Chamber pressure: 150 + 100 = **250 Pa**.

The chamber is at two thirds as much again as the gauge shows, because the line's conductance is only one and a half times the pump's speed. The same answer comes from Q ÷ S_eff: 2.0 ÷ 0.008 = 250 Pa. The gauge belongs on the chamber.
