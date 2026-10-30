---
book: scale-models-by-the-numbers
chapterSlug: regimes-and-crossovers
order: 8
title: "Regimes, crossovers and the danger of extrapolating"
description: "Recognise when a flow changes regime, read a crossover from the local slope of test data, carry pipe losses to full size through the friction factor, and avoid extrapolating across a crossover."
draft: false
---

A power law holds within a regime. Laminar pipe flow loses pressure in proportion to the flow; smooth turbulent flow loses it roughly as the flow to the power 1.75; fully rough turbulent flow loses it as the square. Between those regimes the exponent changes, sometimes suddenly and sometimes gradually, and a single power law fitted across the change describes neither side. Physicists studying critical phenomena call such a change a crossover: a region where one scaling law gives way to another, controlled by a dimensionless ratio. Engineers meet crossovers constantly, usually without the name, and most of the serious errors in scaling test data come from extrapolating across one.

This chapter explains how to recognise a regime and a crossover, how to read them from the local slope of the data, and how to carry a measured loss from a model to its prototype through the friction factor rather than through a power law. The running case is the PS-3 model's suction pipe, and the error is an extrapolation that looked rigorous and was 23% wrong.

## The friction factor and its regimes

The head lost to friction in a straight pipe of length L and bore D is h_f = f × (L ÷ D) × V² ÷ (2g), where f is the dimensionless Darcy friction factor. Dimensional analysis says f can depend only on the Reynolds number and the relative roughness ε ÷ D, and a century of measurements has mapped that dependence. It falls into three regimes with two crossovers between them.

```figure
type: compare
title: Regimes of pipe friction
rowhead: Regime
cols: Reynolds number | Friction factor | Head loss varies as
caption: The exponents are those of the head loss against flow at a fixed pipe size. The crossovers between regimes are gradual in turbulent flow and abrupt, with an uncertain band, between laminar and turbulent flow.
- Laminar | below about 2,300 | f = 64 ÷ Re | Q¹
- Crossover to turbulence | about 2,300 to 4,000 | uncertain; depends on disturbances | unpredictable
- Smooth turbulent | above about 4,000, roughness hidden in the viscous layer | falls slowly with Re | Q^1.7 to Q^1.8
- Crossover to rough | roughness begins to poke through the viscous layer | depends on Re and ε ÷ D | rising towards Q²
- Fully rough | very high Re | depends on ε ÷ D only | Q²
```

The Colebrook equation, published in 1939, blends the smooth and rough turbulent laws into one curve that passes through the crossover between them, and is the basis of the familiar Moody chart. The [pipe friction tool](/tools/pipe-friction/) uses it for turbulent flow and 64 ÷ Re for laminar flow, and gives the Reynolds number, the friction factor, the pressure drop and the head loss for a straight pipe of given bore, length, roughness and flow, with a warning in the transitional band.

## The PS-3 suction pipe at both scales

This is an illustration. In the prototype, each pump's suction column is a 600 mm steel pipe, with a roughness of 0.045 mm, about 18 m long, or 30 diameters. In the model, each is a 100 mm acrylic tube with a roughness of about 0.0015 mm, 3 m long, also 30 diameters. The pipe friction tool gives, with water at 20 °C:

- **Model**, 5.10 L/s: velocity 0.650 m/s, Re 64,750, f = **0.0198**, head loss **12.8 mm**.
- **Prototype**, 450 L/s: velocity 1.592 m/s, Re 951,700, f = **0.0131**, head loss **50.9 mm**.

Froude scaling multiplies every length, including a head loss, by 6. Scaled that way, the model's 12.8 mm becomes 76.7 mm, 51% more than the prototype's 50.9 mm. The model's friction factor is higher because its Reynolds number is 14.7 times lower, and friction factors fall as the Reynolds number rises. This is the conservative scale effect Chapter 5 described: losses measured in a Froude model and scaled directly overstate the prototype's.

```figure
type: compare
title: Suction pipe friction in model and prototype
rowhead: Quantity
cols: Model, 1:6 | Prototype | Froude-scaled model
caption: Calculated with the pipe friction tool, water at 20 °C, both pipes 30 diameters long. Scaling the model's head loss directly overstates the prototype's by 51%; scaling it through the friction factor gives the right answer.
- Bore and roughness | 100 mm, 0.0015 mm | 600 mm, 0.045 mm | —
- Reynolds number | 64,750 | 951,700 | —
- Friction factor f | 0.0198 | 0.0131 | 0.0198 (unchanged)
- Loss coefficient f L ÷ D | 0.594 | 0.394 | 0.594
- * Head loss | 12.8 mm | 50.9 mm | 76.7 mm
```

## Roughness and the second crossover

Why does the prototype's steel pipe have a higher friction factor than a perfectly smooth pipe at the same Reynolds number, while the model's acrylic tube behaves as smooth? The answer lies in the thin viscous layer that lines every turbulent pipe flow. Next to the wall, turbulence is suppressed and the flow is dominated by viscosity. Roughness elements buried inside that layer have little effect; elements that poke through it shed small eddies and add drag.

The relevant comparison is a roughness Reynolds number, ε u* ÷ ν, where u* = V √(f ÷ 8) is the friction velocity, a measure of the shear at the wall. For uniform sand-grain roughness, classic experiments found the pipe hydraulically smooth when this number is below roughly 5 and fully rough when it is above roughly 70. Commercial pipe, with roughness of mixed sizes, leaves the smooth curve more gradually, which is the behaviour the Colebrook equation describes.

For the PS-3 prototype, u* = 1.592 × √(0.0131 ÷ 8) = 0.0645 m/s, so the roughness Reynolds number is 0.045 × 10⁻³ × 0.0645 ÷ 1.0034 × 10⁻⁶ = **2.9**. The steel's roughness is beginning to reach the edge of the viscous layer, enough on the Colebrook curve to raise its friction factor from the smooth-pipe value of 0.0117 to 0.0131. For the model, u* = 0.650 × √(0.0198 ÷ 8) = 0.0323 m/s and the acrylic's roughness Reynolds number is **0.05**, deep inside the viscous layer. Even if the model had been made with the steel's roughness scaled geometrically to 0.0075 mm, its roughness Reynolds number would have been only 0.24: at the model's low Reynolds number, scaled roughness simply disappears into a relatively thicker viscous layer.

This is the second crossover, from smooth to rough turbulent flow, and it is the reason a model cannot reproduce wall roughness effects by scaling the roughness. It is also why the model's measured friction losses must be carried to the prototype through the friction factor, as the next section explains, and never through an extended trend.

## Transferring losses through the dimensionless coefficient

The correct way to carry a measured friction loss from model to prototype is through the dimensionless groups, not through the length scale. Measure the loss in the model, convert it to a friction factor or loss coefficient, identify the regime the model is in, and then use the law of that regime, or of the prototype's own regime, to find the prototype's coefficient at its own Reynolds number and roughness. Only then multiply by the prototype's velocity head.

For PS-3 that procedure is simple, because the pipe's behaviour is well known: the prototype's friction factor comes straight from the Colebrook equation at its own Reynolds number and relative roughness, 0.045 ÷ 600 = 0.000075. For features whose behaviour is not well known, such as a bend, a trash rack or a novel fitting, the model's measured coefficient is usually transferred unchanged if the model is in a Reynolds-independent regime, or corrected by a stated method if it is not, with the direction of the correction stated in the report.

## Reading a crossover from the data

A crossover shows itself most clearly in the local slope of the data on logarithmic axes: the exponent calculated between neighbouring points. Within a regime the local slope is steady. Across a crossover it changes.

The laboratory measured the friction loss along 30 diameters of one model suction pipe at nine flows during commissioning, from 0.1 L/s up to 8 L/s. The values below are calculated with the pipe friction tool's method for a smooth 100 mm pipe, which is what a careful measurement would show.

```figure
type: compare
title: Friction along 3 m of the model suction pipe by flow
rowhead: Flow
cols: Reynolds number | Friction factor | Head loss | Local exponent to the next point
caption: Laminar below a Reynolds number of about 2,300, where the loss is proportional to flow; an abrupt jump across the laminar–turbulent crossover; then a slowly rising exponent in smooth turbulent flow as the friction factor's fall slows down.
- 0.10 L/s | 1,269 | 0.0504 | 0.013 mm | 1.00
- 0.15 L/s | 1,903 | 0.0336 | 0.019 mm | 3.08 across the crossover
- 0.20 L/s | 2,538 | 0.0458 | 0.045 mm | 1.70
- 0.30 L/s | 3,807 | 0.0405 | 0.090 mm | 1.71
- 0.50 L/s | 6,345 | 0.0350 | 0.217 mm | 1.73
- 1.0 L/s | 12,690 | 0.0290 | 0.720 mm | 1.75
- 2.0 L/s | 25,380 | 0.0245 | 2.43 mm | 1.77
- * 5.1 L/s | 64,720 | 0.0198 | 12.8 mm | 1.79
- 8.0 L/s | 101,500 | 0.0180 | 28.6 mm | —
```

The table shows both kinds of crossover. Between 0.15 and 0.20 L/s the flow changes from laminar to turbulent, the friction factor jumps up, and the local exponent leaps to 3.1, a value that belongs to neither regime. Above that, the exponent creeps from 1.70 to 1.79 as the Reynolds number rises, because the smooth-pipe friction factor falls more slowly at higher Reynolds numbers. At the prototype's much higher Reynolds number, with steel's roughness beginning to matter, the exponent would be closer still to 2. No single exponent describes the whole range.

Local slopes from real measurements are noisier than these calculated ones, because each is the difference of two logarithms divided by another difference, and small errors in either reading are magnified. A few habits keep them useful. Space the measurement points evenly on a logarithmic scale, for example in steps of about 1.5 to 2 times in flow, so that each local slope spans a reasonable range. Repeat readings near any suspected crossover. Calculate the slope over every pair and over every second pair, and trust a change of slope only if it appears in both. And always set the slopes beside a dimensionless number that could explain them, here the Reynolds number, since a crossover that happens at the same Reynolds number in two different pipe sizes is a regime change, while one that happens at the same flow in both is more likely an instrument problem.

## The error: extrapolating across a crossover

This is an illustration. A reviewer of the draft model report wanted to estimate the prototype's suction pipe loss from the model's measurements alone, without assuming a friction law. They fitted a single power law to the model's measured losses from 0.2 to 8 L/s, obtaining an exponent of 1.748. Reasoning that a loss varying as Q^1.748 at fixed size implies a friction factor varying as Re^(1.748 − 2) = Re^−0.252, they extrapolated the model's friction factor of 0.0198 to the prototype's Reynolds number, 14.7 times higher: 0.0198 × 14.7^−0.252 = **0.0101**. That gave a prototype loss of 38.9 mm.

The figure was 23% below the 50.9 mm from the Colebrook equation, and in the optimistic direction for the pumps' suction conditions. The station designer asked why. Two checks found the answer. The residuals of the single power-law fit were not random: they ran +0.011, +0.002, −0.006, −0.010, −0.009, +0.002, +0.010 in log₁₀, an arch that showed the exponent was changing across the range. And the extrapolation carried the model's smooth-pipe trend fourteen-fold beyond its data and into a different regime: at the prototype's Reynolds number, the steel pipe's roughness of 0.045 mm is no longer hidden in the viscous layer, and its friction factor levels off at 0.0131 instead of continuing to fall.

```figure
type: bars
title: Prototype suction pipe head loss by method
unit: mm
caption: The single power law extrapolated the model's smooth-pipe trend into the prototype's rougher regime and understated the loss. Direct Froude scaling overstates it. The friction-factor method, using the Colebrook equation at the prototype's own Reynolds number and roughness, is the one to use.
- Direct Froude scaling of the model loss | 76.7 | 51% high, conservative
- * Friction factor at the prototype's Re and roughness | 50.9 | the correct estimate
- Single power law extrapolated in Re | 38.9 | 23% low, optimistic
```

The reviewer withdrew the estimate, and the report kept the friction-factor method. The laboratory's guidance now says that a fitted exponent may be used only within the range of its data, that any extrapolation in Reynolds number must name the regime at both ends, and that residuals must be checked for an arch before any single power law is accepted.

## Crossovers elsewhere in a model study

Pipe friction is the clearest example, but crossovers appear throughout a model study.

1. **Orifice and flow-meter coefficients** change slowly with Reynolds number at the low end of their range, the effect that lowered the exponent in Chapter 7.
2. **Weir and notch coefficients** change at low heads, where surface tension and viscosity affect the thin nappe. A small model weir reading low heads can be in a different regime from the prototype weir it represents.
3. **Swirl decay** changes with the Reynolds number, as Chapter 5 showed.
4. **Vortex type** changes as the model's Reynolds and Weber numbers rise, the size effect of Chapter 6.

Bluff bodies give a striking example. The drag coefficient of a circular cylinder in cross-flow is nearly constant over a wide range of Reynolds numbers and then drops sharply, by more than half, at a Reynolds number of a few hundred thousand, when its boundary layer turns turbulent and separates later. This drag crisis is a crossover with real consequences for model studies of piers, piles and screens. A trash-rack bar 12 mm wide in a prototype flow of 0.8 m/s has a Reynolds number of about 9,600; at 1:6 its 2 mm model equivalent in 0.33 m/s water has about 650. The two are in different regimes of vortex shedding behind the bar, so the model rack's head loss and vibration behaviour do not scale directly, which is one reason models often represent racks by calibrated screens rather than scaled bars.

In each case the question is the same as for pipe friction: which regime is the model in, which regime is the prototype in, and is the law used to connect them valid in both?

## How this applies to a small Australian business

Most bench tests are run over a narrower range than the product will meet in service: lower speeds, smaller flows, shorter times. A trend measured on the bench and extended into service conditions is an extrapolation, and if a regime changes between the two, the extension is wrong. The protection is cheap. Plot the data on logarithmic axes, look at the local slope between neighbouring points, and ask what physical change could alter it between the test and the real use. If a known law describes the regime the product will be in, use the law rather than the extended trend.

## Exercise: the laminar limit in the model

The model's suction pipes are 100 mm in bore. At what flow does the pipe Reynolds number fall to 2,300, the usual upper limit of laminar flow, with water at 20 °C? The test programme includes a low-flow case at 10% of the design flow, 0.51 L/s per pipe. Is it safely turbulent?

**Worked answer.** Re = V D ÷ ν = 4 Q ÷ (π D ν), so Q = 2,300 × π × 0.1 × 1.0034 × 10⁻⁶ ÷ 4 = 0.000181 m³/s, or **0.181 L/s**. At 0.51 L/s the Reynolds number is 2,300 × 0.51 ÷ 0.181 = about **6,480**, above the 4,000 at which flow is normally fully turbulent, so the low-flow case is turbulent, though far less so than the prototype at the same proportion of its flow, whose Reynolds number would be about 95,000.
