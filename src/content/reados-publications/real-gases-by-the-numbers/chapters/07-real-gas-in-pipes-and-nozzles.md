---
book: real-gases-by-the-numbers
chapterSlug: real-gas-in-pipes-and-nozzles
order: 7
title: "Real gas in pipes and nozzles"
description: "When the ideal law is good enough downstream of the regulator: LN-1's line velocity and pressure drop, choked flow at the 2.0 mm nozzle, reference conditions, and two flow figures that did not match."
draft: false
---

The first six chapters dealt with gas at high pressure, where the ideal gas law fails badly. Once the gas has passed the regulator, LN-1's nitrogen is at 1.9 MPa, and at that pressure the law is almost right again. The engineer's job on the low-pressure side is to know how almost, to know which calculations still need real-gas data, and to avoid the units traps that cause more trouble in practice than the physics.

This chapter works through LN-1's line from the regulator to the laser: the gas's density and velocity, the pressure drop along the tube, the flow through the 2.0 mm nozzle that sets the 36 kg an hour used throughout this book, the small real-gas corrections to it, the places on the high-pressure side where flow calculations do need real-gas methods, and a nozzle replaced because two flow figures were stated at different reference conditions.

## How ideal is the line

This is an illustration. LN-1's regulator delivers nitrogen at 1.9 MPa absolute, and the line warms it back to about 15 °C (Chapter 5). NIST's density there is **22.32 kg/m³**. The ideal law gives 1.9 × 10⁶ ÷ (296.80 × 288.15) = 22.22 kg/m³, so Z = **0.995**. Behind the nozzle, at 1.6 MPa, NIST gives 18.78 kg/m³ and Z = 0.996.

The ideal law is wrong by less than half a per cent. For velocity, pressure drop, pipe sizing and the energy balance of the line, that is negligible against the other uncertainties: pipe roughness, the exact flow, the temperature of the gas along the line. Downstream of LN-1's regulator, the ideal gas law is the right tool, and every calculation in this chapter uses it except where the real-gas corrections are being shown.

## Velocity and Reynolds number

The mass flow through the line is the laser's 36.0 kg an hour, 0.0100 kg/s. Divided by the density, the volume flow at line conditions is 0.0100 ÷ 22.32 = **4.48 × 10⁻⁴ m³/s**, less than half a litre per second, because the gas is compressed nineteen-fold.

Through tube of different bores:

- **6 mm** bore: velocity **15.9 m/s**;
- **8 mm** bore: **8.9 m/s**;
- **10 mm** bore, LN-1's line: **5.7 m/s**.

With NIST's viscosity of 17.61 µPa·s at 1.9 MPa and 15 °C, the Reynolds number in the 10 mm line is ρ × v × d ÷ μ = 22.32 × 5.70 × 0.010 ÷ 17.61 × 10⁻⁶ = **72,300**, well into turbulent flow. Gas lines at a few megapascals almost always are, because the density is high and the viscosity of a gas barely changes with pressure.

## Pressure drop along the line

For turbulent flow in a smooth tube, the Darcy friction factor can be estimated from the Blasius formula, f = 0.316 ÷ Re^0.25, which is suitable for smooth tube in this range. The pressure drop over a length L is:

Δp = f × (L ÷ d) × ρ × v² ÷ 2

This is an illustration for 15 m of straight tube, with fittings left out.

- **10 mm** bore: f = 0.0193, Δp = **10.5 kPa**.
- **8 mm** bore: f = 0.0182, Δp = 30.3 kPa.
- **6 mm** bore: f = 0.0170, Δp = **119 kPa**.

The drop goes roughly as the inverse fifth power of the bore at a fixed mass flow, so a small reduction in bore costs a great deal. In the 10 mm line, the 10.5 kPa drop is about 0.6% of the line pressure, and the laser's own valve, which needs about 0.3 MPa of margin above its 1.6 MPa setting, has plenty. In 6 mm tube, the 119 kPa drop eats a third of that margin before any fittings, filter or quick-connect are counted, and the laser would see its pressure sag whenever it cut at full flow. Pipe Flow by the Numbers covers [friction in straight pipe](/reados/publications/pipe-flow-by-the-numbers/friction-in-straight-pipe/) in detail.

```figure
type: bars
title: Pressure drop in 15 m of LN-1's line at 36 kg/h, by bore
unit: kPa
max: 130
caption: This is an illustration for nitrogen at 1.9 MPa and 15 °C in smooth tube, Blasius friction factor, fittings excluded. The ideal gas law is within 0.5% of NIST here.
- 6 mm bore | 118.8
- 8 mm bore | 30.3
- * 10 mm bore, LN-1 | 10.5
```

## The nozzle

LN-1's cutting gas leaves through a **2.0 mm** nozzle with **1.6 MPa** absolute behind it into the cut, at close to atmospheric pressure. The pressure ratio, 0.1 ÷ 1.6, is far below the critical ratio of about 0.53 for nitrogen, so the flow is **choked**: the gas reaches the speed of sound in the narrowest section, and the mass flow depends only on the upstream conditions and the nozzle's area, not on what happens downstream.

For an ideal gas with ratio of specific heats γ, the choked mass flow is:

ṁ = C_d × A × p₀ × √(γ ÷ (R_s × T₀)) × (2 ÷ (γ + 1))^((γ + 1) ÷ (2 × (γ − 1)))

This is an illustration with γ = 1.4, T₀ = 288.15 K and a discharge coefficient C_d = 0.85, a typical value for a short, well-made nozzle that is assumed here, not measured. The nozzle's area is π × 0.001² = 3.142 × 10⁻⁶ m². Then ṁ = **0.0100 kg/s**, **36.0 kg an hour**, the figure used throughout this book.

In the throat, the gas is at about 0.85 MPa, −33 °C and 316 m/s. Beyond the nozzle it expands further and accelerates into the kerf, which is where the cutting work is done; the gas's job is to blow the molten metal out of the cut and keep oxygen away from the cut edge.

```figure
type: formula
title: Choked flow through LN-1's cutting nozzle
formula: ṁ = C_d × A × p₀ × √(γ ÷ (R_s × T₀)) × (2 ÷ (γ + 1))^((γ + 1) ÷ (2 × (γ − 1)))
caption: This is an illustration. The discharge coefficient of 0.85 is assumed. Real-gas corrections at 1.6 MPa change the result by under 1%.
- p₀, T₀ | Upstream pressure and temperature, 1.6 MPa and 288.15 K
- A | Nozzle area, 3.142 × 10⁻⁶ m² for 2.0 mm
- γ | Ratio of specific heats, 1.4 for nitrogen
- C_d | Discharge coefficient, 0.85 assumed
step: √(1.4 ÷ (296.80 × 288.15)) × (2 ÷ 2.4)^3 = 2.342 × 10⁻³ s/m
step: ṁ = 0.85 × 3.142 × 10⁻⁶ × 1.6 × 10⁶ × 2.342 × 10⁻³ = 0.0100 kg/s = 36.0 kg/h
```

## The real-gas corrections at the nozzle

Two corrections apply to a real gas. First, the density at the throat is slightly higher than ideal, which the compressibility factor captures: dividing R_s × T₀ by Z = 0.996 raises the flow by **0.2%**. Second, the isentropic exponent of real nitrogen at 1.6 MPa, found from NIST's speed of sound as c² × ρ ÷ p = 348.41² × 18.78 ÷ 1.6 × 10⁶, is **1.425**, not 1.4, which raises the flow by a further 0.6%. Together they change 36.0 kg an hour to 36.3, **0.8%**.

That is smaller than the uncertainty in the assumed discharge coefficient, which can easily differ by 5% between nozzles of different makes and states of wear. At 1.6 MPa, the ideal-gas nozzle formula is good enough, and the way to pin down the flow of a real nozzle is to measure it, with a flow meter in the line or by weighing gas used against beam-on time.

## A leak at line pressure

The same choked-flow formula gives the loss through a leak, because a small hole in a line at 1.9 MPa discharging to the atmosphere is choked just as the nozzle is. This is an illustration with an assumed discharge coefficient of 0.6 for a ragged leak path, treating the leak as an equivalent round hole:

- a **0.1 mm** hole loses **0.076 kg an hour**, about 3 minutes of cutting a day if the line stays pressurised round the clock, and **661 kg a year**, about three packs;
- a **0.2 mm** hole loses 0.30 kg an hour, **2,640 kg a year**, about 12.6 packs;
- a **0.5 mm** hole loses 1.89 kg an hour, about 79 packs a year.

The flow goes as the square of the equivalent diameter, so a leak too small to hear can still cost several packs a year, and a line left pressurised over weekends and nights leaks for three times as many hours as it cuts. The remedies are ordinary: isolate the line at the pack when the cell is not running, leak-test fittings with a soap solution when they are disturbed, and compare the gas bought with the gas the cell should have used, which the next chapter turns into a routine check. Leak losses on the low-pressure side can be calculated with the ideal law; the pressure is low enough that Z changes the answer by less than the uncertainty in the hole.

## Where flow does need real-gas methods

On the high-pressure side of the regulator, the picture changes.

- **Velocity in the pack's manifold.** At 30.1 MPa, LN-1's 36 kg an hour moves through a 6 mm bore pigtail at 1.14 m/s, against the ideal law's 1.01 m/s, 14% faster, because the real gas is less dense. The velocity is low either way, but in a high-flow manifold the same 14% matters for sizing.
- **The speed of sound.** NIST gives nitrogen's speed of sound as 346 m/s at atmospheric pressure and 15 °C, but **482 m/s** at 30.1 MPa, and an isentropic exponent of about 2.38 instead of 1.4. Any calculation of choked flow from the high-pressure side, such as the flow through a regulator's seat at full pack pressure or through a fitting that fails, is badly wrong if it uses ideal-gas values.
- **Release and blowdown.** The flow from a broken pigtail or an open valve at cylinder pressure, and the time for a pack to empty through it, are safety calculations that should be made with real-gas methods: property software built on reference equations of state, or the procedures of the relevant standards, not the formula above.
- **Gas metering at pressure.** A flow meter in the high-pressure side that infers mass flow from volume flow needs Z to convert, and a 14% error at 30 MPa is not a rounding matter.

## Reference conditions

Gas volumes are quoted at a reference temperature and pressure, and there is more than one convention. Two are common in gas supply:

- **normal** cubic metres, written Nm³, usually at 0 °C and 101.325 kPa;
- **standard** cubic metres, often at 15 °C and 101.325 kPa, which is the convention used for natural gas in ISO 13443 and the one used in this book.

Some suppliers and equipment makers use 20 °C. The differences are not small. From NIST's densities for nitrogen at 101.325 kPa:

- at **0 °C**, 1.2504 kg/m³: LN-1's 36.0 kg an hour is **28.79 Nm³/h**;
- at **15 °C**, 1.1851 kg/m³: **30.38 m³/h**;
- at **20 °C**, 1.1648 kg/m³: **30.91 m³/h**.

The same flow is 5.5% larger at 15 °C than at 0 °C, and 7.4% larger at 20 °C. Any comparison of a consumption figure, a contents figure and a meter reading must put all three at the same reference conditions, or in kilograms, which have no reference conditions.

```figure
type: compare
title: LN-1's nozzle flow of 36.0 kg/h, at different reference conditions
rowhead: Reference conditions
cols: Nitrogen density, kg/m³ | Volume flow, m³/h
caption: Densities from NIST at 101.325 kPa. Compare flows in kilograms, or state the reference conditions next to every volume.
- 0 °C, 101.325 kPa, normal | 1.2504 | 28.79
- * 15 °C, 101.325 kPa, standard | 1.1851 | 30.38
- 20 °C, 101.325 kPa | 1.1648 | 30.91
```

## The error: a worn nozzle that was not worn

This is an illustration. The laser maker's data sheet gave the cell's nitrogen consumption for the shop's main job, 3 mm stainless steel with a 2.0 mm nozzle at 1.6 MPa, as **28.8 Nm³/h**. After the run-time trouble in Chapter 1, the shop fitted a thermal mass flow meter to LN-1's line to measure what the cell actually used. The meter, set up by the supplier, read **30.4 m³/h** during cutting.

The production planner compared the two, saw 5.5% more gas than the data sheet, and concluded the nozzles were wearing faster than expected and opening up. The shop changed to new nozzles every shift instead of every week, at about A$12 each including GST, and the reading did not change.

The production engineer checked the meter's settings. It was configured to report in cubic metres at 15 °C and 101.325 kPa, the gas supplier's convention. The data sheet's normal cubic metres were at 0 °C. Converting both to kilograms, 28.8 × 1.2504 = **36.0 kg/h** and 30.4 × 1.1851 = **36.0 kg/h**: the same flow. The nozzles were fine. The shop went back to weekly nozzle changes, relabelled the meter's display "m³/h at 15 °C", and from then on recorded gas use in kilograms in its job costing.

## Exercise: a smaller line

A second laser is to be fed from LN-1's regulator through 20 m of 8 mm bore tube, drawing the same 36.0 kg an hour at 1.9 MPa and 15 °C. Find the velocity, the Reynolds number and the straight-tube pressure drop, and say whether the ideal gas law is adequate for the calculation.

**Worked answer.**

- Area: π × 0.004² = 5.027 × 10⁻⁵ m². Volume flow at line conditions: 0.0100 ÷ 22.32 = 4.48 × 10⁻⁴ m³/s. Velocity: **8.91 m/s**.
- Reynolds number: 22.32 × 8.91 × 0.008 ÷ 17.61 × 10⁻⁶ = **90,400**, turbulent.
- Friction factor: 0.316 ÷ 90,400^0.25 = 0.0182.
- Pressure drop: 0.0182 × (20 ÷ 0.008) × 22.32 × 8.91² ÷ 2 = **40.4 kPa**, before fittings.

At 1.9 MPa, nitrogen's Z is 0.995, so the ideal gas law changes the density, and with it the velocity and pressure drop, by about half a per cent: adequate. The 40 kPa drop is acceptable against the laser valve's margin of about 300 kPa, but with a filter, a quick-connect and a dozen fittings it should be checked before the tube is bought.
