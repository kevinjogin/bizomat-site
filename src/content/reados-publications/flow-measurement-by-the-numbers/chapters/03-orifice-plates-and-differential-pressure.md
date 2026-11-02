---
book: flow-measurement-by-the-numbers
chapterSlug: orifice-plates-and-differential-pressure
order: 3
title: "Orifice plates and differential pressure"
description: "How an orifice plate turns flow into a pressure difference, the discharge coefficient, sizing a plate, the square-root law and turndown, permanent pressure loss, and a square root left out."
draft: false
---

The orifice plate is the oldest flowmeter in industrial use and still one of the commonest. It is a flat plate with a sharp-edged hole, clamped between flanges, and two pressure tappings, one each side. Fluid speeds up to squeeze through the hole, its pressure falls as it does, and the pressure difference across the plate tells how fast it is flowing. The physics is Bernoulli's, the hardware is cheap and has no moving parts, and the method is standardised so thoroughly that a plate made and installed to ISO 5167 can be used without flow calibration, its uncertainty known from the standard alone.

This chapter derives the orifice equation, explains the discharge coefficient and velocity-of-approach factor, sizes the brewery's hot liquor plate with the orifice flow tool, examines the square-root law and what it does to accuracy at low flow, calculates the plate's permanent pressure loss and its energy cost, and finishes with a commissioning trial that put a third more hot water into the mash tun than the recipe asked for.

## From Bernoulli to the orifice equation

In a smooth, frictionless flow, the sum of pressure and kinetic energy per unit volume is constant along a streamline. Where the fluid speeds up, its pressure falls. Upstream of the plate, the fluid moves at the pipe's mean velocity; through the plate's hole it must move faster, because the same volume passes through a smaller area. The pressure difference between upstream and the narrowest point of the jet is therefore related to the two velocities, and so to the flow.

```figure
type: formula
title: The orifice equation for a liquid
formula: Q = C × E × (π d² ÷ 4) × √(2 Δp ÷ ρ)
formula: Velocity-of-approach factor: E = 1 ÷ √(1 − β⁴)        β = d ÷ D
caption: Q is the volume flow, d the orifice bore, D the pipe bore, Δp the measured pressure difference and ρ the density at the plate. C, the discharge coefficient, corrects the ideal equation for the jet's contraction beyond the hole, friction and the tapping positions; for liquids the expansibility factor is 1.
- C | discharge coefficient, about 0.6 for a sharp-edged plate
- E | velocity-of-approach factor
- β | diameter ratio, d ÷ D
- Δp | differential pressure across the tappings, Pa
```

The discharge coefficient is the empirical heart of the equation. The jet leaving a sharp-edged hole keeps contracting for a short distance downstream, to a vena contracta whose area is only about 60% of the hole's, and the tappings do not sit exactly at the points the ideal equation assumes. ISO 5167-2 gives an equation for C as a function of β, the Reynolds number and the tapping arrangement, fitted to a very large body of calibration data; for a plate with β around 0.6 at high Reynolds number, C is close to 0.605. That figure is used here as a typical value for illustration; a real plate's coefficient comes from the standard's equation for its own geometry.

## Sizing the hot liquor plate

FT-301 must measure hot water at 80 °C, density 971.8 kg/m³, at a normal flow of 15 m³/h and a maximum of 20 m³/h, in a 62.7 mm bore. The brewery's plate has a bore of 37.62 mm, so β = 0.600. The velocity-of-approach factor is 1 ÷ √(1 − 0.6⁴) = 1.0719, and with C = 0.605 the combined flow coefficient C × E is 0.6485.

Solving the equation for the pressure difference at 15 m³/h gives Δp = 16,240 Pa, or 162.4 mbar. At 20 m³/h it is 288.6 mbar, which sets the differential pressure transmitter's range.

The [orifice and restrictor flow tool](/tools/orifice-flow/) calculates the flow through an orifice from a discharge coefficient, a diameter, a pressure drop and a density. Its equation has no separate velocity-of-approach factor, so for a plate in a pipe the coefficient entered must be the combined C × E. Entering a diameter of 37.62 mm, a coefficient of 0.6485, a pressure drop of 0.16236 bar and a density of 971.8 kg/m³ gives 250.0 L/min, which is 15.0 m³/h, and a jet velocity of 5.78 m/s, confirming the calculation.

```figure
type: stats
title: FT-301, the hot liquor orifice plate
caption: This is an illustration. Discharge coefficient 0.605 taken as typical for this β and a Reynolds number of about 230,000; the plate's own coefficient comes from ISO 5167-2.
- 62.7 mm / 37.62 mm | pipe bore and orifice bore, β = 0.600
- 0.6485 | flow coefficient C × E, entered in the orifice flow tool
- 162.4 mbar | differential at the normal 15 m³/h
- 288.6 mbar | differential at the maximum 20 m³/h, the transmitter's range
- 5.78 m/s | velocity through the orifice at 15 m³/h
```

### Choosing β

A larger β gives a smaller pressure difference and a smaller permanent loss for the same flow, but the coefficient becomes more sensitive to the upstream profile, and longer straight runs are needed. A smaller β gives a larger, easier-to-measure differential at the cost of more pressure lost. Values between about 0.4 and 0.7 are the usual compromise, and ISO 5167 limits the range over which its coefficients apply. The brewery's 0.6, with the flow conditioner of Chapter 2, sits comfortably in the middle.

## The square-root law

Flow is proportional to the square root of the differential pressure. Halving the flow quarters the differential; at a tenth of full flow the differential is a hundredth of full scale. That has two consequences.

The first is that the reading must be square-rooted somewhere, either in the transmitter or in the control system, but not in both and not in neither. This chapter's mistake comes from exactly that.

The second is that accuracy falls quickly at low flow. A differential pressure transmitter's uncertainty is usually stated as a percentage of its span. A fixed uncertainty in the differential becomes a relative uncertainty in flow of half its relative size in the differential, and as the differential shrinks, that relative size grows.

```figure
type: compare
title: Effect of a ±0.1% of span transmitter error on FT-301's flow reading
cols: Differential pressure | Error in differential | Resulting flow error
rowhead: Flow
- 20 m³/h, full scale | 288.6 mbar | ±0.29 mbar | ±0.05%
- 15 m³/h, normal | 162.4 mbar | ±0.29 mbar | ±0.09%
- 10 m³/h | 72.2 mbar | ±0.29 mbar | ±0.20%
- 5 m³/h | 18.0 mbar | ±0.29 mbar | ±0.80%
- 2 m³/h | 2.9 mbar | ±0.29 mbar | ±5.0%
caption: This is an illustration. Relative flow error = ½ × (absolute differential error ÷ differential). The transmitter's span is 0 to 288.6 mbar. The plate's own coefficient uncertainty adds to these.
```

A single orifice plate and transmitter are therefore usable over a flow range of about 3 or 4 to 1 for good accuracy, and perhaps 10 to 1 for indication. Wider turndown needs two transmitters on different ranges, or a different kind of meter. For the hot liquor line, which runs at 15 m³/h during transfers and is otherwise closed, the plate's limited turndown does not matter.

## The permanent pressure loss

Some of the pressure that falls at the plate is recovered downstream as the jet slows and spreads, but much is lost to turbulence. The permanent loss for a plate is commonly approximated as (1 − β^1.9) times the differential, a little less than two-thirds of it for β = 0.6.

At 15 m³/h, FT-301's permanent loss is about (1 − 0.6^1.9) × 16,240 = 10,100 Pa, about 0.1 bar. The pump must supply that pressure: the hydraulic power is the loss multiplied by the flow, 10,100 × 15 ÷ 3,600 = 42 W, or about 70 W of electrical power with a pump and motor efficiency of 60%. Over the 2,000 hours a year the line runs, that is about 140 kWh, worth a few tens of dollars. For a small, intermittent line the loss is unimportant. For a large, continuous water or air main, the same proportional loss can cost thousands of dollars a year, which is one of the reasons Chapter 10 considers when choosing a meter.

## The mistake: a square root left out

When FT-301 was commissioned, the differential pressure transmitter was configured to send a signal proportional to the differential, 4 to 20 mA for 0 to 288.6 mbar, and the control system was configured to treat the signal as proportional to flow, 4 to 20 mA for 0 to 20 m³/h. Neither applied the square root. During the commissioning water trial, the brewer asked the system for 1,900 L of hot liquor in the mash tun, and the transfer stopped with the tun filled far above the mark.

```figure
type: steps
title: Finding the missing square root during the water trial
caption: This is an illustration. With the differential read as if it were flow, the system saw 15 m³/h as 11.25 m³/h and kept filling.
- Trial | 1,900 L requested; the mash tun overfilled
- Actual flow during the transfer | about 15 m³/h, from the hot liquor tank's level fall
- Signal at 15 m³/h | differential 162.4 mbar, 56.3% of the transmitter's span
- * Control system's reading | 56.3% of 20 m³/h = 11.25 m³/h, three-quarters of the true flow
- Delivered | about 1,900 ÷ 0.75 = 2,530 L at 15 m³/h before the total reached 1,900
- Fix | square root applied in the transmitter only; checked at three flows against tank level
```

At 15 m³/h the differential was 162.4 mbar, 56.3% of the transmitter's span. The control system read 56.3% of 20 m³/h, 11.25 m³/h, three-quarters of the true flow, and its totaliser counted three-quarters of the water delivered. It stopped the transfer only when its total reached 1,900 L, by which time about 2,530 L had gone into the tun. At lower flows the error would have been worse: at 10 m³/h the reading would have been half the true flow. The square root was applied in the transmitter, the control system left linear, and the configuration was checked by comparing FT-301's totals with the hot liquor tank's level fall at three different flows. A trial with water before the first brew found the mistake; a production brew would have found it at the cost of a batch. The brewery's commissioning checklist now includes, for every differential pressure meter, a line asking where the square root is taken, and a comparison of the meter's total with an independent measure, such as a tank's level, at no fewer than two flows. A single comparison at one flow cannot distinguish a square-root error from a simple scaling error, because both can be made to agree at one point.

## Impulse lines and the transmitter

The differential is carried from the tappings to the transmitter by two small impulse lines, and many orifice problems are really impulse line problems. For a liquid, the lines must stay full of liquid: they slope down from the tappings to a transmitter mounted below the pipe, so that air rises back into the pipe rather than collecting in a line, where a bubble in one line but not the other adds a false differential. For hot water, the lines are long enough to let the water cool before it reaches the transmitter's diaphragm. A three-valve manifold at the transmitter lets the technician close both lines and open an equalising valve between them, so that the transmitter sees exactly zero differential: a zero check that takes a minute and catches drift. The brewery checks FT-301's zero this way each month, with the line shut, and logs the result.

## Other differential devices

The orifice plate has relatives that use the same equation with different geometry and coefficients. A Venturi tube contracts the flow gradually and expands it again through a long diverging cone, recovering most of the pressure: its permanent loss is typically a small fraction of its differential, against nearly two-thirds for a plate, which makes it the choice for large water mains where pumping energy matters. Flow nozzles sit between the two. Cone meters place a cone in the middle of the pipe, so that the flow accelerates through an annulus; they need shorter straight runs than plates. Wedge meters use a V-shaped restriction suited to slurries and dirty fluids. All are covered by parts of ISO 5167, and all share the square-root law and its limited turndown.

## Wear, deposits and the plate's edge

The plate's accuracy depends on its upstream edge staying sharp and its bore unchanged. A rounded or worn edge raises the discharge coefficient, so the plate reads low; deposits on the plate's face or in its bore change the coefficient in either direction; a plate bent by a pressure surge or installed backwards, with its bevelled face upstream, reads substantially wrong. Hot liquor is clean, but hard water scales, and the brewery pulls FT-301's plate once a year to inspect its edge and bore against the drawing, a check that takes an hour and needs no flow rig.

## Exercise: sizing a plate for a larger brewhouse

The brewery plans a larger brewhouse whose hot liquor line will be DN80, with an 80.0 mm bore, carrying water at 80 °C at up to 30 m³/h. The engineer wants the differential at full flow to be about 250 mbar. Using C = 0.605, find the orifice bore and β that give 250 mbar at 30 m³/h, and check the result with the orifice flow tool's method. Then calculate the permanent loss at full flow.

### Answer

**Given:** D = 0.0800 m; Q = 30 m³/h = 8.333 × 10⁻³ m³/s; Δp = 25,000 Pa; ρ = 971.8 kg/m³; C = 0.605.

**Assumptions:** the plate is within the standard's range; the coefficient is the typical value at this β and Reynolds number.

**Method:** the orifice equation contains d both in the area and, through β, in E, so solve by trial: choose β, compute the flow at 250 mbar, adjust.

**Ideal jet speed:** √(2 × 25,000 ÷ 971.8) = 7.173 m/s.

**Trial β = 0.60:** d = 48.0 mm, A = 1.810 × 10⁻³ m², E = 1.0719, Q = 0.605 × 1.0719 × 1.810 × 10⁻³ × 7.173 = 8.42 × 10⁻³ m³/s, 30.3 m³/h, slightly high.

**Trial β = 0.597:** d = 47.76 mm, A = 1.7915 × 10⁻³ m², E = 1.0703, Q = 0.605 × 1.0703 × 1.7915 × 10⁻³ × 7.173 = 8.32 × 10⁻³ m³/s, 29.96 m³/h. A bore of about 47.8 mm, β = 0.597, gives 250 mbar at 30 m³/h.

**Tool check:** the orifice flow tool, with a diameter of 47.76 mm, a coefficient of 0.605 × 1.0703 = 0.6475, 0.25 bar and 971.8 kg/m³, gives about 499 L/min, 29.9 m³/h.

**Permanent loss:** (1 − 0.597^1.9) × 25,000 = (1 − 0.375) × 25,000 = 15,600 Pa, about 0.16 bar at full flow.

**Verification:** scaling from FT-301, where 15 m³/h gives 162.4 mbar through a 37.62 mm bore, the flow for a given differential goes as the area times E; the larger plate's area is 1.61 times larger and at 250 mbar the jet is √(250 ÷ 162.4) = 1.24 times faster, giving about 15 × 1.61 × 1.24 ≈ 30 m³/h.
