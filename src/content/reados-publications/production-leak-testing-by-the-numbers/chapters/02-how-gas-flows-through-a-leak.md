---
book: production-leak-testing-by-the-numbers
chapterSlug: how-gas-flows-through-a-leak
order: 2
title: "How gas flows through a leak"
description: "Mean free path and Knudsen number, viscous, molecular and choked flow through leaks, how leak rate changes with pressure and gas, and converting a helium result to air correctly."
draft: false
---

A leak rate measured with one gas at one pressure is a fact about that test. The specification is about another gas at another pressure in service. Converting between them needs a model of how gas moves through the leak, and the right model depends on how big the leak is compared with the distance gas molecules travel between collisions. Get the model wrong and a helium reject limit can be set nearly three times too loose, which is exactly what happened at the oil cooler line.

This chapter explains mean free path and the flow regimes it defines, works out the flow through a capillary of the size real leaks have, shows how leak rate changes with pressure and gas in each regime, uses the compressed air leak tool for the gross leaks at the other end of the scale, and finishes with the helium limit that was set with the wrong conversion.

## Molecules, collisions and the mean free path

A gas is a crowd of molecules moving fast in random directions and colliding constantly. The average distance a molecule travels between collisions is its mean free path. In air at atmospheric pressure and 20 °C it is about 68 nanometres, roughly a hundredth of the diameter of a red blood cell. It is inversely proportional to pressure: at the OC-40's 6 bar gauge test pressure, 7.013 bar absolute, it is about 9.8 nm, and at 11.013 bar absolute, 6.3 nm.

The same idea of particles that travel freely between collisions runs through all of gas and plasma physics. In the ionised gas of a helium leak detector, Chapter 7 meets it again: the detector works only because its vacuum makes the mean free path much longer than the distance an ion must travel to reach the collector.

### The Knudsen number

What matters for flow through a channel is the ratio of the mean free path to the channel's width, the Knudsen number. It decides whether molecules mostly hit each other or mostly hit the walls.

```figure
type: compare
title: Flow regimes through a leak path, by Knudsen number
cols: Knudsen number λ ÷ d | What the molecules do | Leak rate scales with | Gas dependence
rowhead: Regime
- Viscous | below about 0.01 | collide mostly with each other; flow behaves as a fluid | p₁² − p₂² in a long channel | inversely with viscosity
- Transitional | about 0.01 to 1 | both kinds of collision matter | between the two | between the two
- Molecular | above about 1 | collide mostly with the walls; each travels independently | p₁ − p₂ | inversely with the square root of molar mass
- Choked orifice | short, large holes at high pressure ratio | flow reaches sonic speed at the throat | p₁ alone | √(γ ÷ (R T)) and the orifice size
caption: Boundaries between regimes are approximate. For air at 20 °C, λ ≈ 68 nm at atmospheric pressure, falling in inverse proportion to absolute pressure.
```

## Real leaks are long and narrow

A braze defect, a crack or a chain of pores is not a hole in a thin sheet. It is a channel through the wall, millimetres long and micrometres wide, often tortuous. Modelling it as a straight capillary of uniform bore is crude, but it gives the right scaling and a realistic idea of size.

```figure
type: formula
title: Viscous flow of a gas through a capillary
formula: Q = π d⁴ (p₁² − p₂²) ÷ (256 μ L)
caption: Q is the throughput in Pa·m³/s, measured at the gas's own temperature, for isothermal laminar flow of an ideal gas through a tube of diameter d and length L, with absolute pressures p₁ upstream and p₂ downstream. The square of the pressures appears because the gas expands as its pressure falls along the tube.
- d | capillary diameter, m
- L | capillary length, m
- μ | gas viscosity, Pa·s; 1.82 × 10⁻⁵ for air, 1.96 × 10⁻⁵ for helium at 20 °C
- p₁, p₂ | absolute pressures, Pa
```

Solving for the diameter that passes the OC-40's limit, 1 × 10⁻⁴ Pa·m³/s of air with 11.013 bar inside and 1.013 bar outside, gives 3.3 µm for a channel 1 mm long, 4.4 µm for 3 mm and 5.9 µm for 10 mm. A braze joint across the cooler's 3 mm wall would carry the limit through a channel about 4.4 µm wide. The choked orifice estimate in Chapter 1, about 1 µm, understates the size because a long channel resists flow far more than a sharp hole of the same bore.

### Checking the regime

At 4.4 µm, the Knudsen number at the low-pressure end, where molecules are furthest apart, is 0.068 ÷ 4.4 = 0.015, at the edge of the viscous regime; at the high-pressure end it is 0.0063 ÷ 4.4 = 0.0014, firmly viscous. Leaks at the OC-40's limit are viscous, slightly modified near the outlet. Much smaller leaks, below about 10⁻⁶ mbar·L/s, are typically transitional or molecular, which is why vacuum and refrigeration work, with tighter specifications, use molecular scaling. The regime belongs to the leak, not to the product: a single cooler can have a viscous leak at one joint and a molecular one at another.

The flow inside such a channel is also slow and laminar. The mass flow at the limit, 1.19 × 10⁻⁹ kg/s, through a channel a few micrometres across gives a Reynolds number of a few tens, far below the value at which turbulence could start.

## How the leak rate changes with pressure

In the viscous regime, doubling the absolute pressure inside roughly quadruples the throughput when the outside pressure is small by comparison, because both the driving pressure difference and the gas density double. Chapter 1 used this to scale the OC-40's limit from 10 bar to 6 bar gauge: the ratio (7.013² − 1.013²) ÷ (11.013² − 1.013²) = 0.400.

```figure
type: bars
title: A leak at the OC-40 limit at 10 bar gauge, seen at lower test pressures
unit: ×10⁻⁴ mbar·L/s
max: 10
caption: This is an illustration. Viscous scaling with (p₁² − p₂²) and 1.013 bar outside. A test at a lower pressure sees a smaller rate from the same leak and needs a proportionally lower reject limit.
- * 10 bar gauge, the specification | 10.0
- 6 bar gauge, the pressure decay screen | 4.00
- 3 bar gauge | 1.25
- 1 bar gauge | 0.25
```

Pressure also changes the leak itself. Cracks and some braze defects open wider under pressure and close when it is removed, so a leak that is real at 10 bar may not pass gas at 1 bar. That is a reason to test near the working pressure, not merely to scale.

## How the leak rate changes with the gas

Helium is used as a tracer because it is rare in air, inert, safe and easily detected, and because it passes through small leaks readily. How readily depends on the regime.

**Viscous regime.** Throughput is inversely proportional to viscosity. Helium's viscosity at 20 °C, 1.96 × 10⁻⁵ Pa·s, is slightly higher than air's, 1.82 × 10⁻⁵ Pa·s, so through the same viscous leak at the same pressures helium passes 0.93 times the throughput of air.

**Molecular regime.** Throughput is inversely proportional to the square root of the molar mass, because lighter molecules move faster. Helium, at 4.003 g/mol against air's 28.97, passes √(28.97 ÷ 4.003) = 2.69 times the throughput of air.

The difference between those two factors, 0.93 and 2.69, is a factor of nearly three, and it matters for every helium result compared with an air specification.

## Gross leaks: choked flow

At the other end of the scale, a hole of a tenth of a millimetre or more at several bar behaves like an orifice: the flow accelerates to the speed of sound at the narrowest point and is choked, depending only on the upstream pressure. The [compressed air leak cost tool](/tools/air-leak-cost/) calculates exactly that flow from a hole's diameter, its discharge coefficient and the line pressure, in litres of free air per second, as part of costing compressed-air leaks. For the gross leaks the pressure decay screen exists to catch, its first output is the leak rate the screen will see.

Entering a 0.1 mm hole at 6 bar gauge, a discharge coefficient of 0.65 and 20 °C gives 0.00702 L/s of free air, which is 0.00702 × 1,013 = 7.1 mbar·L/s. In the screen's 0.90 L test volume that empties at 7.1 ÷ 0.90 = 7.9 mbar every second, a signal no test could miss. The tool's power and cost outputs, which belong to plant compressed air, are not used here.

## The mistake: a helium limit set with the wrong factor

When the helium station was commissioned, the supplier's technician set its reject limit by converting the air specification to helium. The technician's notes, from vacuum work, said that helium leaks 2.7 times faster than air, so the limit was set at 2.7 × 10⁻³ mbar·L/s of helium.

```figure
type: steps
title: Correcting the helium reject limit
caption: This is an illustration. The factor 2.69 belongs to molecular flow, typical of much finer leaks in vacuum work; leaks at the OC-40's limit are viscous.
- Limit set at commissioning | 2.7 × 10⁻³ mbar·L/s of helium, from the molecular factor 2.69
- Regime check | 4.4 µm channel; Knudsen number about 0.015 or less: viscous
- Viscous factor for helium | 0.93 of the air throughput
- * What the commissioned limit accepted | helium 2.7 × 10⁻³ ÷ 0.93 = air 2.9 × 10⁻³ mbar·L/s, nearly three times the specification
- Corrected | helium limit at most 0.93 × 10⁻³ mbar·L/s for the 10 bar test, before the guard band of Chapter 8
```

The quality engineer, reviewing the commissioning report, asked which regime the factor came from. Leaks at the OC-40's limit are viscous, where helium passes 0.93 times the throughput of air, not 2.69 times. A helium reading of 2.7 × 10⁻³ mbar·L/s therefore corresponded to an air leak of 2.7 × 10⁻³ ÷ 0.93 = 2.9 × 10⁻³ mbar·L/s, nearly three times the specification. For the first week, coolers with air leaks up to almost three times the limit had been passed. The limit was corrected to 0.93 × 10⁻³ mbar·L/s of helium at 10 bar, later tightened further by the guard band of Chapter 8, and the week's production was retested.

The general rule: before converting a leak rate between gases, decide the regime from the leak's likely size and the pressures, and use the viscous factor unless the leaks of interest are clearly molecular. Where the regime is uncertain, use the factor that gives the tighter limit.

## Telling the regime from two tests

When the size of the leaks of interest is uncertain, the regime can be measured rather than assumed. Test the same leaking part at two pressures and compare the readings. In the viscous regime, the ratio follows the difference of squares: going from 6 to 10 bar gauge multiplies the rate by 1 ÷ 0.400 = 2.50. In the molecular regime it follows the pressure difference: 10 ÷ 6 = 1.67. A ratio near 2.5 confirms viscous flow; one near 1.7 points to molecular flow; one between them, transitional. The test engineer did this on six rejected coolers during commissioning and found ratios between 2.3 and 2.6, which confirmed the viscous factor for the OC-40's leaks and gave the quality engineer the evidence for the corrected helium limit.

## Things that look like leaks, and leaks that hide

Three effects can confuse a leak test, and all follow from the same physics.

**Virtual leaks.** Gas trapped in a blind thread, a pocket behind a seal or a crevice inside the part flows slowly out into the tested volume through a narrow path, exactly as a leak would, but from inside. In a pressure decay test it looks like a leak until the trapped pocket's pressure has equalised; in a vacuum chamber it adds a slowly falling background. The cure is design, avoiding blind volumes, or patience, letting the pocket equalise before the measurement.

**Permeation.** Gas dissolves into and diffuses through solid materials, particularly elastomers and plastics. Helium permeates rubber seals fast enough to matter at the levels the helium station measures, which is why the station's fixture seals are a known background source and are replaced on a schedule, as Chapter 7 describes. Aluminium and steel are, for practical purposes, impermeable.

**Blocked leaks.** Water from a wash, oil from machining or flux residue can fill a fine channel and stop gas flowing for a while, so the part passes. Later, in service, the blockage dries out or is pushed through and the leak appears. The OC-40 line dries every cooler in a warm air oven after washing, which also matters for the temperature effects of Chapter 4.

## Liquids and the end of the scale

Liquid leaks follow the same viscous law without the compressibility: throughput in the capillary is proportional to the pressure difference divided by viscosity. Hydraulic oil at 40 °C is around two thousand times as viscous as air, so a channel that passes the OC-40's air limit passes a vanishingly small volume of oil, and a surface film of oil may block it entirely. That is the physical basis of the customer's specification in Chapter 1, and the reason why leak testing with gas can stand in for oil-tightness only after the relationship has been confirmed by tests like the blotting paper trial.

## Exercise: one capillary, three tests

A cooler has a braze defect that behaves as a capillary 3 µm in diameter and 2 mm long. Calculate its air throughput at 10 bar gauge, its helium throughput at 10 bar gauge, and its air throughput at the pressure decay screen's 6 bar gauge, with 1.013 bar outside and gas at 20 °C. Then decide whether the cooler meets the specification.

### Answer

**Given:** d = 3 × 10⁻⁶ m; L = 2 × 10⁻³ m; μ_air = 1.82 × 10⁻⁵ Pa·s; μ_He = 1.96 × 10⁻⁵ Pa·s; p₁ = 11.013 × 10⁵ Pa at 10 bar gauge and 7.013 × 10⁵ Pa at 6 bar gauge; p₂ = 1.013 × 10⁵ Pa.

**Assumptions:** isothermal viscous flow through a straight capillary; the Knudsen number below about 0.02, as for the 4.4 µm channel.

**Method:** Q = π d⁴ (p₁² − p₂²) ÷ (256 μ L), then the helium and pressure ratios.

**Air at 10 bar gauge:** π × (3 × 10⁻⁶)⁴ × (11.013² − 1.013²) × 10¹⁰ ÷ (256 × 1.82 × 10⁻⁵ × 2 × 10⁻³) = 3.28 × 10⁻⁵ Pa·m³/s = 3.3 × 10⁻⁴ mbar·L/s.

**Helium at 10 bar gauge:** 3.28 × 10⁻⁴ × (1.82 ÷ 1.96) = 3.0 × 10⁻⁴ mbar·L/s.

**Air at 6 bar gauge:** 3.28 × 10⁻⁴ × 0.400 = 1.3 × 10⁻⁴ mbar·L/s.

**Decision:** the cooler's air leak at 10 bar, 3.3 × 10⁻⁴ mbar·L/s, is a third of the 1 × 10⁻³ limit; it passes. The helium station would read about 3.0 × 10⁻⁴ and pass it; the pressure decay screen would not see it at all, as Chapter 3 shows.

**Verification:** the Knudsen number at the outlet, 0.068 ÷ 3 = 0.023, is near the viscous boundary, so the viscous model is reasonable; a little slip near the outlet would raise the helium reading slightly towards the air figure, which does not change the conclusion. The 6 bar figure also checks against the bars above: 0.400 of the 10 bar rate.
