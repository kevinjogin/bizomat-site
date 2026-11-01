---
book: scale-models-by-the-numbers
chapterSlug: froude-scaling
order: 4
title: "Froude scaling: flows, velocities, times and forces"
description: "Derive the Froude scaling ratios for velocity, flow, time, pressure, force and power, apply them to the PS-3 model, and check them on a draining tank and an orifice."
draft: false
---

Once a model is designed to match the Froude number, every other quantity in it follows from one ratio: the length scale. Velocities, flows, times, pressures, forces and powers all scale as simple powers of L_r, and those powers can be derived in a few lines from the definition of the Froude number. The result is a conversion table that turns every model reading into a prototype value and every prototype condition into a model setting.

This chapter derives that table, applies it to the PS-3 model at 1:6, and tests it on something that can be calculated exactly at both scales: the storage tank emptying through its outlet. It also shows the most common mistake in setting a model's flow, scaling it by the cube of the length ratio as if it were a volume, and how a Froude number check caught it.

## Deriving the ratios

Write every ratio as prototype value divided by model value, so that a ratio greater than one means the prototype quantity is larger. The length ratio for PS-3 is L_r = 6. Gravity is the same in both, and the same water is used, so the density ratio is 1.

Equal Froude numbers mean V_p ÷ √(g L_p) = V_m ÷ √(g L_m). Rearranging, the velocity ratio is **V_r = L_r^½**. Every other ratio follows from the definitions:

- **Flow** is velocity times area: Q_r = L_r^½ × L_r² = L_r^2.5.
- **Time** is length divided by velocity: t_r = L_r ÷ L_r^½ = L_r^½.
- **Acceleration** is velocity divided by time: L_r^½ ÷ L_r^½ = 1, which is consistent with gravity being the same.
- **Pressure** from a column of water, ρ g h, scales as a length: p_r = L_r. Pressure from velocity, ½ ρ V², scales as V_r² = L_r too, so both kinds of pressure scale alike, as they must.
- **Force** is pressure times area: F_r = L_r³, the same as the ratio of volumes and of weights.
- **Power** is force times velocity: P_r = L_r³ × L_r^½ = L_r^3.5.
- **Frequency** or rotational speed is the reciprocal of a time: L_r^−½. Things that rotate or oscillate in the model do so faster.

```figure
type: compare
title: Froude scaling ratios for the PS-3 model at 1:6
rowhead: Quantity
cols: Ratio | Value at 1:6 | Prototype | Model
caption: Ratios are prototype ÷ model, for the same fluid and the same gravity. The prototype examples are PS-3 design values; the model values follow by division.
- Length | L_r | 6 | 600 mm bellmouth | 100 mm
- Velocity | L_r^½ | 2.449 | 1.592 m/s | 0.650 m/s
- * Flow | L_r^2.5 | 88.18 | 450 L/s per pump | 5.10 L/s
- Time | L_r^½ | 2.449 | 2-hour storm | 49.0 min
- Pressure or head | L_r | 6 | 1.20 m submergence | 200 mm
- Force | L_r³ | 216 | 216 kN | 1 kN
- Power | L_r^3.5 | 529.1 | 96.7 kW | 183 W
- Rotational speed | L_r^−½ | 0.408 | 1 rev/s | 2.449 rev/s
```

Two consequences surprise people the first time. The model runs faster than real time, so a two-hour storm inflow hydrograph plays out in 120 ÷ 2.449 = 49.0 minutes, and anything that rotates in the model, including the swirl meters in its suction pipes, spins 2.449 times faster than its prototype equivalent. And the model's flows are tiny: each 450 L/s pump becomes 5.10 L/s, a garden-tap flow, because flow falls with the 2.5 power of the scale.

## Dimensionless results scale unchanged

The most useful model results need no conversion at all. Swirl angles, ratios of local to average velocity, vortex classifications, loss coefficients and discharge coefficients are all dimensionless. If dynamic similarity holds, a swirl angle of 3° in the model is a swirl angle of 3° in the prototype. That is why model studies report their main findings in dimensionless form, and why Chapter 2 began by choosing a dimensionless response.

The scaling table is needed for the inputs and for dimensional outputs: setting the model's flows and levels, converting a measured drawdown or head loss, and converting the times at which things happen. It also gives a quick plausibility check. A model reading that implies a prototype velocity of 20 m/s in the approach channel is a measurement error, not a finding.

## Testing the ratios on the storage tank

The storage tank gives an exact test, because its emptying can be calculated in both model and prototype. At full size it is 6.0 m in diameter and empties from 3.0 m to 0.3 m above its 300 mm outlet. At 1:6 the model tank is 1.0 m in diameter, its outlet 50 mm, and it empties from 500 mm to 50 mm. Both have a discharge coefficient of 0.6, an assumption Chapter 5 returns to.

The [tank drain time tool](/tools/tank-drain-time-check/) integrates the falling head through a bottom orifice, using t = (A_tank ÷ (C_d × A_outlet)) × √(2 ÷ g) × (√H₁ − √H₂), and also reports the volume drained and the outflow at the starting level. For the prototype it gives 76,341 L drained in **356.6 s** (5.9 min) with a starting outflow of 19,520 L/min. For the model it gives 353 L in **145.6 s** (2.4 min) with a starting outflow of 221.4 L/min.

```figure
type: compare
title: The storage tank emptying, prototype and 1:6 model
rowhead: Quantity
cols: Prototype | Model | Ratio | Froude prediction
caption: Calculated with the tank drain time and orifice flow tools, discharge coefficient 0.6 in both. Every ratio matches the Froude scaling table, because the drain is governed by gravity alone in this model.
- Tank diameter | 6.0 m | 1.0 m | 6 | L_r = 6
- Starting head | 3.0 m | 0.5 m | 6 | L_r = 6
- Volume drained | 76,341 L | 353.4 L | 216 | L_r³ = 216
- Starting outflow | 19,520 L/min | 221.4 L/min | 88.18 | L_r^2.5 = 88.18
- * Drain time | 356.6 s | 145.6 s | 2.449 | L_r^½ = 2.449
```

The starting outflow can also be found from the [orifice flow tool](/tools/orifice-flow/), which gives the flow through a sharp-edged orifice from its diameter, discharge coefficient, pressure difference and fluid density by Q = C_d A √(2 Δp ÷ ρ). A 3.0 m head of water at 998.2 kg/m³ is a pressure of 0.2937 bar, and the tool gives 19,520 L/min through the prototype outlet. The model's 0.5 m head is 0.04894 bar, a sixth as much, and gives 221.4 L/min. The pressure ratio is L_r and the flow ratio is L_r^2.5, as the table says.

The agreement is exact because both tools use the same gravity-driven formula at both scales, with the same discharge coefficient. A real model outlet would have a slightly different discharge coefficient from the prototype's, because its Reynolds number is 14.7 times smaller. That difference is a scale effect, and it is why the next chapter exists.

## Setting the model's conditions

The scaling table turns the station's operating cases into a test schedule. For each case, the laboratory sets the water level in the model wet well, the flow in each model suction pipe, and the inflow to the approach. This is an illustration.

1. **Lowest operating level, two duty pumps.** Model water level 200 mm above the bellmouth lips; each duty suction pipe at 5.10 L/s; inflow 10.21 L/s.
2. **Lowest level, all three pumps.** The standby pump running as well, an abnormal but possible case; 15.31 L/s in total.
3. **Normal level, two duty pumps.** Levels set from the prototype's normal level divided by 6.
4. **Lowest level at 1.5 times the Froude-scaled flow.** Each duty pipe at 7.66 L/s, to see whether vortices strengthen as the model's Reynolds and Weber numbers rise; Chapter 6 explains why.

Each level is held until the flow is steady, which in the model takes 1 ÷ 2.449 of the prototype time. Observations are timed in model minutes and reported in both.

## Transient tests and the time scale

Some of the most informative model tests are not steady. When a duty pump starts, the water level over its bellmouth falls quickly, and a vortex can form for a few seconds before the approach flow settles. When the standby pump cuts in, the flow pattern in the wet well reorganises. When the storage tank begins to empty back into the wet well, a surge of water enters at the side. Each of these is a transient, and the model reproduces it only if the time scale is respected.

The time ratio for PS-3 is 2.449, so a pump start that brings the prototype flow from zero to full in 30 s must bring the model flow from zero to 5.10 L/s in 30 ÷ 2.449 = 12.2 s. A model valve opened by hand over two or three seconds would represent a prototype start of about 5 to 7 s, far faster than the real one, and would exaggerate the drawdown and any start-up vortex. The laboratory therefore uses a motorised valve with an adjustable ramp, set from the prototype's starting sequence divided by the time ratio.

The same reasoning applies to the station's level control. The prototype starts its second duty pump when the wet well rises 0.30 m above the first pump's start level and stops it when the level falls back. In the model the band is 50 mm, and the time between starts and stops is 2.449 times shorter than at full size. Ten cycles that take an hour at full size take 60 ÷ 2.449 = 24.5 minutes in the model, which makes it practical to watch the whole sequence several times in a day.

Transient tests also need a faster logging rate. If the prototype behaviour of interest happens over 5 s, a model record at 2 Hz would capture only about four points per prototype event, after dividing the time by 2.449. The laboratory logs levels and flows at 20 Hz during starts and stops and at 1 Hz during steady runs.

## The error: flow scaled as a volume

This is an illustration. On the first day of testing, a technician set up the lowest-level, two-pump case from a handwritten schedule. The schedule's author had reasoned that the model is 216 times smaller in volume than the prototype, and had divided each pump's 450 L/s by 216, giving 2.08 L/s. The model ran calmly. No vortices formed, the swirl meters barely turned, and the first day's log recorded the intake as satisfactory.

The engineer reviewing the log calculated the model's bellmouth Froude number from its recorded flow. At 2.08 L/s through a 100 mm bellmouth the velocity is 0.265 m/s and the Froude number is 0.268, against the prototype's 0.656. The ratio between them, 0.408, is 1 ÷ √6, exactly the difference between dividing by L_r³ and by L_r^2.5. The model had been run at 41% of its correct flow.

```figure
type: bars
title: Model flow per duty pump, correct and as first set
unit: L/s
caption: Dividing the prototype flow by the volume ratio, 216, instead of the flow ratio, 88.18, ran the model at 41% of its Froude-scaled flow. The swirl meters and vortex observations from that day were discarded.
- Correct, 450 ÷ 6^2.5 | 5.10 | Froude number 0.656
- * As first set, 450 ÷ 6³ | 2.08 | Froude number 0.268
- Prototype-equivalent test at 1.5 × | 7.66 | scale-effect check
```

At that flow every velocity in the model was too low by the same factor, the drawdown over the bellmouths was a sixth of the correct value, and any vortex tendency was understated. The day's results were discarded and the case rerun at 5.10 L/s, at which surface swirl appeared over the downstream bellmouth. The laboratory changed two things: the test schedule now lists the Froude number at the bellmouth beside every flow setting, and the data logger calculates it live from the flow meter, so a wrong setting shows at once.

## When Froude scaling is the wrong choice

Froude scaling is right when gravity governs the flow, which is true for free-surface flows such as intakes, open channels, spillways and waves. It is the wrong basis for a full pipe system with no free surface, where gravity only adds a hydrostatic pressure and the flow pattern depends on the Reynolds number. A model of a closed pipe manifold, a valve or a heat exchanger tube bank is normally run at a matched or sufficiently high Reynolds number instead, often with a different fluid such as air.

Many problems involve both. The PS-3 model is Froude-scaled for its free surface, but its suction pipes are full pipes, and its swirl meters, flow meters and pipe losses all depend on the Reynolds number. Knowing which parts of a model follow which scaling law is the first step to knowing which of its results can be trusted.

Air models are a special case worth knowing about. Some closed-conduit features, such as a pump's suction bend or a manifold, are tested with air instead of water because air is cheap to move and easy to measure. The Froude number then plays no part, and the model is run at a Reynolds number high enough to be in the plateau of Chapter 5, with the air velocity kept low enough, below roughly a third of the speed of sound, that compressibility does not enter. The results are dimensionless loss coefficients and velocity ratios, and they transfer to water through those groups, not through a Froude scaling table. Mixing the two approaches, for example by Froude-scaling an air model's flow, is a mistake that produces numbers with no physical meaning.

## How this applies to a small Australian business

Froude scaling turns up wherever a smaller tank, channel, chute or tray is used to judge a bigger one: a scaled tundish, a wash tank, a settling pond, a hopper discharge, a slosh test. The table in this chapter gives the conversions, and the drain-time example shows the simplest possible check: calculate one thing exactly at both scales and confirm the ratio. A test that runs at the wrong flow or the wrong time scale is not just less accurate, it is answering a different question.

## Exercise: the inflow hydrograph

The design storm delivers its peak inflow of 0.90 m³/s to PS-3 about 35 minutes after the start of rain, and the full event lasts 3 hours. At 1:6, what is the model's peak inflow, when does it occur, and how long does the model event last? If the model's peak drawdown over a bellmouth is measured as 18 mm, what is the prototype drawdown?

**Worked answer.** The flow ratio is 6^2.5 = 88.18, so the model's peak inflow is 900 ÷ 88.18 = **10.21 L/s**. The time ratio is √6 = 2.449, so the peak occurs at 35 ÷ 2.449 = **14.3 min** and the event lasts 180 ÷ 2.449 = **73.5 min**. A drawdown is a length, so the prototype drawdown is 18 × 6 = **108 mm**.
