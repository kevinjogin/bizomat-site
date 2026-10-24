---
book: oxy-fuel-by-the-numbers
chapterSlug: measuring-gas-flow-and-consumption
order: 5
title: "Measuring gas flow and consumption"
description: "Measure gas use by weighing and with orifice and variable-area flow meters, correct readings for gas, pressure and temperature, and learn from the systematic error found in 1921."
draft: false
---

Chapters 1 to 4 used flows in cubic metres per hour as if they were simply known. In a real workshop they have to be measured, and every method of measuring them has a way of being wrong. The 1921 investigators measured gas two independent ways for every test, weighing and flow metering, and when the two disagreed they found an error that no amount of care with the instruments alone would have revealed.

This chapter covers the three methods a workshop is most likely to use, shows how to correct their readings and explains the 1921 discovery, because its lesson applies to almost any instrument used in conditions different from those in which it was calibrated.

## Weighing: the reference method

Weighing measures mass, and mass does not depend on temperature, pressure or the gas's behaviour in a meter. That is why the 1921 investigation used weight as its reference and why Chapter 1 used a platform scale for the base-plate trial. The conversion to volume needs only the gas density at the reference conditions: about 1.353 kg/m³ for oxygen and 1.101 kg/m³ for acetylene at 15 °C and 101.325 kPa.

Weighing has three weaknesses. It needs a scale large enough for the cylinders and fine enough for the gas used. It gives only the total over a run, not the flow at any moment. And it counts everything that leaves the cylinder, including leaks and, for acetylene, solvent. The 1921 balances dealt with leaks by measuring them: with the lines pressurised and no gas flowing, the drift over about half an hour gave the leak rate, which was subtracted from every test. Testing stopped if the leak exceeded about 0.01 to 0.02 lb of gas an hour. For oxygen that is roughly 3.4 to 6.7 litres an hour, a tiny fraction of a cutting flow, but large enough to matter in a precise comparison and, as Chapter 6 shows, a warning of a fault that matters for safety.

## The 1921 orifice flow meter

To read flow continuously, the investigators designed their own meter. It was a brass tube about 1.14 m long and 51 mm in bore, split near the middle by a screwed coupling that clamped a thin, sharp-edged orifice plate. A cross baffle and four fine brass screens at the inlet evened out the flow. Pressure tappings above and below the orifice led to manometers that read the **differential**, the pressure drop across the orifice, and a tapping below it read the **static pressure**. A thermocouple held just inside the orifice measured the gas temperature, and the meters were lagged with felt to keep room temperature changes out.

Five orifice sizes covered the whole range of flows, helped by inclined manometers that magnified small differentials. After the whole series, during which a vast quantity of oxygen had passed through one orifice at high speed, a photograph and check measurements showed no rounding of its edge and no enlargement. The sharp-edged plate had kept its calibration.

The meter worked on the standard orifice relationship. In the report's form, the flow at standard conditions is a constant times the square root of the absolute static pressure multiplied by the differential, divided by the absolute temperature and the gas density.

```figure
type: formula
title: The orifice meter relationship used in 1921
formula: V = K × √(Pₐ × h ÷ (Tₐ × G))
caption: Flow rises with the square root of the differential, so doubling the differential raises the flow only about 1.414 times. That is why one orifice cannot cover a wide range of flows well.
- V | flow at standard conditions
- K | orifice constant, found by calibration
- Pₐ | absolute static pressure at the meter
- h | differential across the orifice
- Tₐ | absolute gas temperature
- G | gas density
step: flow ratio = √(h₂ ÷ h₁) at the same pressure and temperature
step: flow ratio = √(16 ÷ 9)
step: flow ratio ≈ 1.333
```

For oxygen, whose density is constant, the investigators folded the density into the constant and treated the temperature term as a factor close to one; ignoring it altogether gave errors they put at no more than about 2%. Gas at 30 °C passing a meter calibrated for 15 °C, for example, gives a factor of √(288.15 ÷ 303.15) ≈ 0.975, an effect of about 2.5%. Acetylene was harder, because its density changed with the acetone it carried, as Chapter 3 described. They used two measured density curves, one for high flows and one for low.

## Which cubic metre?

A volume of gas means nothing until its temperature and pressure are stated. This book uses 15 °C and 101.325 kPa throughout. The 1921 report used 32 °F, or 0 °C, and 760 mm of mercury, which is the same pressure. Some suppliers, meters and data sheets use 15 °C, others 0 °C or 20 °C, and some state cylinder contents in kilograms precisely to avoid the question.

The differences are not trivial. Because volume at constant pressure is proportional to absolute temperature, a cubic metre measured at 0 °C becomes 288.15 ÷ 273.15 ≈ 1.055 m³ at 15 °C, a difference of about 5.5%. Between 15 °C and 20 °C the difference is about 1.7%. The base-plate job's 20.6 m³ of oxygen at 15 °C would be quoted as about 19.53 m³ at 0 °C. Neither figure is wrong, but comparing a meter in one basis with an invoice in another can create a discrepancy of several per cent that looks like a leak or a meter fault. The settings sheet and every measurement record should state the reference conditions, and the conversion should be made before any comparison.

## Temperature: the error that appeared later

Early calibration suggested that, at the low acetylene flows, temperature effects were too small to justify a thermocouple in the acetylene meter. When the gauge board was installed in its permanent position, close enough to the cutting to be warmed by it, some readings were found to be well out. Thermocouples were fitted to both meters for nearly all the tests. For the few early tests without one, the investigators established a straight-line relationship between room temperature and gas temperature in the meter, accurate to within about 1%, corrected the data and confirmed the method with check runs.

The lesson is that a meter's environment is part of its calibration. A flow meter mounted on a cutting machine, beside a heating operation or in the sun is not in the conditions of the calibration laboratory.

## The discovery: fluctuating pressure fools the meter

The orifice meters were calibrated a second time once the chosen regulators and their rappers were in place, against a dry gas meter and the balances. It was consistent: seven runs on one orifice at widely different pressures and flows gave constants between about 1.169 and 1.190. Then the first torch tests were worked up, and the gas consumption from the flow meters differed systematically from the consumption by weight.

Investigation showed that the meter constant, as determined with the manometers in use, fell when the pressure fluctuated. With very good regulation the constant for one orifice was about 1.189; with average regulation, about 1.145; with poor regulation, about 1.114. The effective constant was about 3.7% lower with average regulation and 6.3% lower with poor regulation, so using the very-good figure would overstate the flow by about 1.189 ÷ 1.145 − 1 ≈ 3.8% in average conditions and about 6.7% in poor ones. The effect was larger for the smaller orifices.

```figure
type: bars
title: Orifice constant for one meter under different pressure regulation
unit: K
max: 1.25
caption: From the 1921 report. Under fluctuating pressure the meter read a higher average differential than the true flow warranted, so the effective constant fell.
- *Very good regulation | 1.189
- Average regulation | 1.145
- Poor regulation | 1.114
```

Part of such an effect is pure arithmetic. Because flow goes with the square root of the differential, the square root of an average differential is larger than the average of the square roots. If the differential swung evenly between 4 and 16 units, the average of the square roots would be 3.000 and the square root of the average 3.162, a difference of about 5.4%. The investigators checked this and found that, for the much smaller fluctuations in their tests, the arithmetic effect was far too small to explain what they saw. They put the rest down either to the inertia and friction of the liquid columns or to observers consistently reading a bouncing column too high.

Their solution was practical. They derived a third set of meter constants from the preliminary torch tests themselves, comparing the flow meters with the balances under the pressure regulation actually achieved in testing. The close agreement between flow meter and balance in the later tests justified the choice. They noted that a full investigation of the cause would be desirable, but would have taken too long.

The general rule is one of the most useful in measurement: **calibrate an instrument in the conditions in which it will be used**, or at least check it there against an independent method. A flow meter calibrated on a steady laboratory supply and read on a fluctuating workshop supply can be consistently wrong in one direction, and no amount of care in reading it will reveal the error.

## Variable-area meters in the workshop

The flow meters most often seen on cutting machines and gas panels today are variable-area meters, often called rotameters: a float rises in a tapered tube until the gas flowing past it holds it in balance. They are simple and robust, but their scale is correct only for the gas, pressure and temperature for which it was made. On any other gas or at any other pressure, the reading must be corrected.

```figure
type: formula
title: Correcting a variable-area meter for gas and pressure
formula: Q = Q_ind × √(ρ_cal ÷ ρ_gas) × √(P_act ÷ P_cal)
caption: This is an illustration. An air-scaled meter calibrated at atmospheric pressure, used on oxygen at 400 kPa gauge and reading 2.0, is passing about 4.23 m³/h at standard conditions. Same temperature assumed.
- Q_ind | scale reading
- ρ_cal, ρ_gas | densities of calibration gas and gas in use at standard conditions
- P_cal, P_act | absolute pressures at calibration and in use
step: Q = 2.0 × √(1.204 ÷ 1.330) × √(501.3 ÷ 101.3)
step: Q = 2.0 × 0.951 × 2.224
step: Q ≈ 4.23 m³/h
```

## A failure: half the oxygen went missing

This is an illustration. Before the base-plate trial, the workshop borrowed a variable-area meter from the maintenance store to check the oxygen to the preheat flame and part of the cutting supply. Its scale read in cubic metres per hour of air at atmospheric pressure, but it was fitted in a line at about 400 kPa gauge. The reading, 2.0, was entered on the trial sheet as 2.0 m³/h of oxygen.

The weighing showed far more oxygen leaving the cylinders than the meter could account for. Applying the correction above gives about 4.23 m³/h, more than double the recorded figure. The meter had been read correctly; it had simply been read as though it were in the conditions printed on its scale. Once corrected, the meter and the scale agreed within a few per cent, which was the cross-check the trial needed. The workshop labelled the meter with the gas and pressure for which it was scaled and added the correction to the trial procedure.

## Logging and totalling flow over a job

A flow meter gives a rate; a job needs a total. The 1921 log sheets recorded flow meter readings every few minutes throughout each test, alongside the pressures and temperatures, and the totals were compared with the balances. The same approach works in a workshop with nothing more than a clipboard or a phone.

This is an illustration. During one hour of cutting at setting B, the operator reads the total oxygen flow every 15 minutes: 5.1, 5.2, 5.0 and 5.3 m³/h. Treating each reading as representative of its quarter-hour, the total is (5.1 + 5.2 + 5.0 + 5.3) × 0.25 = **5.15 m³**. Over the same hour the oxygen manifold, weighed before and after, lost 6.92 kg, which is 6.92 ÷ 1.353 ≈ **5.11 m³**. The two totals differ by about 0.7%, about the same as the scale's resolution of 0.05 kg on 6.92 kg. That agreement is good evidence that the meter is reading correctly in the conditions of use.

The readings also carry information. A meter that reads steadily within a few per cent is behaving as expected. One that swings widely suggests a regulator problem, a sticking float or a varying demand, and a swinging reading is exactly the condition in which the 1921 meters read high. In the 1921 welding tests, flow readings taken every few minutes varied noticeably even though the pressure was held within a few hundredths of a pound per square inch. That variation, at constant pressure, was one of the clues that led the investigators to the cause of flashback described in the next chapter.

Meters should be checked against an independent reference at intervals, after any damage and whenever they are moved to a different gas, pressure or position. Weighing a known run, as above, is a check any workshop can make. The record of the check, with the date, the method and the agreement found, belongs with the meter.

## Choosing a method

Each method answers a different question, and a sound measurement plan uses more than one.

```figure
type: compare
title: Three ways to measure gas use
cols: What it gives | Main sources of error
caption: Weighing is the reference for totals; meters give flow at a moment. Use one to check the other.
- *Weighing | total mass over a run; independent of conditions | scale resolution; leaks; solvent in acetylene
- Orifice meter | continuous flow; robust | square-root law; pressure fluctuation; temperature; gas density
- Variable-area meter | quick visual flow | scale only right for its gas, pressure and temperature
```

Modern electronic meters, including thermal mass flow meters that read mass flow directly, remove some of these corrections, but they still need to be set for the gas, checked against a reference and used within their range. Whatever the instrument, the 1921 principle holds: two independent measurements that agree are worth far more than one precise-looking number.

## Exercise: correcting a meter for a new pressure

A variable-area meter on the track machine is scaled for oxygen at 400 kPa gauge. During a job, the regulator is turned down so the meter sits at 300 kPa gauge, and the float reads 4.6 m³/h. Atmospheric pressure is 101.3 kPa and the temperature is unchanged. Estimate the true flow at standard conditions.

The gas is the same, so only the pressure correction applies: Q = 4.6 × √((300 + 101.3) ÷ (400 + 101.3)) ≈ 4.6 × √(401.3 ÷ 501.3) ≈ 4.6 × 0.895 ≈ **4.12 m³/h**. Reading the scale directly would overstate the flow by about 12%. Then consider the orifice meter: if its differential rose from 9 to 16 units at constant pressure and temperature, the flow would rise by a factor of √(16 ÷ 9) ≈ **1.33**, not 16 ÷ 9 ≈ 1.78.
