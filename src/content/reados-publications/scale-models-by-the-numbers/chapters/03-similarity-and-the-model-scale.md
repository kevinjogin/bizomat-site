---
book: scale-models-by-the-numbers
chapterSlug: similarity-and-the-model-scale
order: 3
title: "Similarity and choosing the model scale"
description: "Distinguish geometric, kinematic and dynamic similarity, see why a small model cannot match every group at once, and choose a model scale from flow, space, measurement and scale-effect limits."
draft: false
---

A scale model is useful only if it is similar to its prototype in the ways that matter for the question being asked. Similar here has a precise meaning. Geometric similarity means every length has the same ratio. Kinematic similarity means the flow patterns have the same shape, so velocities at corresponding points have the same ratio. Dynamic similarity means the forces at corresponding points have the same ratios, which is the same as saying every dimensionless group from Chapter 2 has the same value.

Perfect similarity is almost never possible, and choosing a model scale is largely a matter of deciding which imperfection to accept. This chapter explains the three kinds of similarity, shows why a model in the same water cannot match both the Froude and Reynolds numbers, and works through the choice of scale for the PS-3 model. It ends with a model whose boundary was drawn too close to the pumps.

## Three kinds of similarity

**Geometric similarity** is the easiest to understand and the easiest to break. Every dimension of the model is the prototype's divided by the scale ratio, written L_r: 6 for a 1:6 model. That includes the bellmouths, the floor clearance, the channel width, the trash rack bars, the benching in the corners, the inflow pipe and the water depths. It cannot include surface roughness at small scales, because a concrete surface with 1 mm roughness would need 0.17 mm roughness in the model, which is smoother than most materials but rougher than the acrylic usually used. Chapter 8 deals with the consequence.

**Kinematic similarity** follows when the model is geometrically similar and dynamically similar. It means that streamlines in the model have the same shape as in the prototype, that a vortex forms in the same place, and that velocity ratios between any two points are the same. It cannot be imposed directly. It is what the model study is trying to achieve.

**Dynamic similarity** means the ratios of the forces acting on the fluid are the same at corresponding points. For PS-3 that means equal Froude, Reynolds and Weber numbers, because those three groups are the force ratios that govern the intake. When dynamic similarity holds, kinematic similarity follows, and swirl angles, vortex types and velocity distributions in the model can be read directly as the prototype's.

## Why a small model cannot match everything

The Froude number is V ÷ √(g D). If the model and prototype must have the same Froude number and g is the same in both, then velocity must scale as the square root of length: V_m ÷ V_p = 1 ÷ √L_r. The Reynolds number is V D ÷ ν. If it must be the same and the water is the same, velocity must scale inversely with length: V_m ÷ V_p = L_r.

At 1:6 the first rule says the model velocity is 1 ÷ 2.449 of the prototype's and the second says 6 times. Both cannot hold. The only way to match both is to change the fluid, using one whose kinematic viscosity is smaller by L_r^1.5. At 1:6 that factor is 14.7, which would need a liquid with a kinematic viscosity of 0.068 mm²/s at room temperature, about a fifteenth of water's. No practical laboratory liquid comes close. The Weber number adds a third requirement that also cannot be met.

```figure
type: compare
title: How model velocity must scale for each group, at 1:6
rowhead: Group matched
cols: Velocity scales as | Model velocity at the bellmouth | Achievable with water?
caption: Prototype bellmouth velocity 1.592 m/s. Only one group can be matched with the same fluid; free-surface intakes are modelled by Froude similarity and the others are checked for scale effects.
- * Froude number | L^½ | 0.650 m/s | Yes
- Reynolds number | L⁻¹ | 9.55 m/s | Not practical
- Weber number | L^−½ | 3.90 m/s | Not practical
```

So every free-surface model is a compromise. The standard choice is to match the Froude number exactly, because gravity governs the free surface, the water levels and the vortices that form there, and to keep the model large enough that viscosity and surface tension have little effect. Those remaining effects are called scale effects. They are the subject of Chapters 5 and 6, and the size of the model is the main defence against them.

Some models go further and break geometric similarity on purpose. River and estuary models are often distorted, with a vertical scale larger than the horizontal one, to keep water depths measurable and the flow turbulent. That trades one similarity for another and needs its own calibration. Pump intake models like PS-3's are normally undistorted.

## What limits the model scale

A larger model is more faithful and more expensive. The choice of scale balances five limits.

1. **Scale effects.** The model's Reynolds and Weber numbers fall as the model shrinks, as L_r^1.5 and L_r² respectively. Below some size, viscosity and surface tension start to change the flow. The project specification normally sets minimum values for both.
2. **Flow supply.** The laboratory must supply the model's flow, including any tests above the Froude-scaled flow to check for scale effects. Flow scales as L_r^2.5, so halving the scale ratio multiplies the flow by 5.7.
3. **Space.** The model must include enough of the approach to produce realistic flow at the pumps. Plan area scales as L_r².
4. **Measurement.** Water levels, velocities and swirl must be measurable with useful precision. A 1 mm uncertainty in level matters more in a small model.
5. **Cost and time.** Construction, instrumentation and the test programme all grow with size.

## Choosing PS-3's scale

This is an illustration. The laboratory has a flume bay 6 m long and 3 m wide and a supply that can deliver 30 L/s steadily. The region to be modelled, from the inflow pipe through the approach channel to the back wall of the wet well, is 30 m long and 10 m wide at full size. The test programme includes runs with both duty pumps at 1.5 times their Froude-scaled flow, to check whether vortices strengthen as the model Reynolds and Weber numbers rise.

The project specification, which in this book is illustrative and is not taken from any standard, asks for a model bellmouth Reynolds number of at least 5.0 × 10⁴ and a Weber number of at least 400 at the Froude-scaled flow. Each scale ratio gives the model the figures below.

```figure
type: compare
title: Candidate scales for the PS-3 model
rowhead: Scale
cols: Bellmouth | Flow per pump | Two pumps at 1.5 × | Re | We | Footprint
caption: Water at 20 °C. Flows scale as L_r^2.5, Re as L_r^1.5 and We as L_r². The laboratory limits are 30 L/s and a 6 m × 3 m bay; the illustrative specification asks for Re of at least 50,000 and We of at least 400.
- 1:4 | 150 mm | 14.06 L/s | 42.19 L/s | 118,960 | 1,304 | 7.5 m × 2.5 m
- 1:5 | 120 mm | 8.05 L/s | 24.15 L/s | 85,120 | 834 | 6.0 m × 2.0 m
- * 1:6 | 100 mm | 5.10 L/s | 15.31 L/s | 64,750 | 579 | 5.0 m × 1.7 m
- 1:8 | 75 mm | 2.49 L/s | 7.46 L/s | 42,060 | 326 | 3.75 m × 1.25 m
- 1:10 | 60 mm | 1.42 L/s | 4.27 L/s | 30,100 | 209 | 3.0 m × 1.0 m
```

The table settles the choice quickly. At 1:4 the model would be the most faithful, but it needs 42 L/s for the high-flow runs and a 7.5 m bay, so it fails two limits. At 1:8 and 1:10 the model is cheap and fits easily, but both fall short of the specification's Reynolds and Weber numbers, and a 1:10 model has only 120 mm of water over its bellmouths at the lowest level, where a 1 mm level error is almost 1% of the submergence. Between the two remaining options, 1:5 fills the bay's full 6 m length with no room for an inlet stilling section, while 1:6 leaves a metre for one. The laboratory proposes **1:6**.

```figure
type: decision
title: Choosing between the feasible scales
question: Which scale meets every limit with a margin?
caption: Each limit is checked at the most demanding test condition. A scale that just fits leaves no room for the inlet arrangements that make the approach flow realistic.
- 1:4 | Rejected | Needs 42 L/s and 7.5 m: exceeds the supply and the bay
- 1:5 | Possible but tight | Meets every number, but fills the 6 m bay with no stilling length
- * 1:6 | Chosen | Meets every limit with a metre for inlet stilling; Re 64,750, We 579
- 1:8 or 1:10 | Rejected | Below the illustrative Re and We minimums; levels hard to resolve
```

## Scaling the model's numbers

With the scale chosen, every model quantity follows from the prototype by Froude scaling, which Chapter 4 derives in full. The 600 mm bellmouths become 100 mm; the 1.20 m submergence becomes 200 mm; the 4.0 m channel becomes 667 mm; and each duty pump's 0.45 m³/s becomes 0.45 ÷ 6^2.5 = 5.10 L/s. The model's Froude numbers then equal the prototype's at every point, which is what makes its free surface, water levels and vortex locations representative.

Its Reynolds and Weber numbers do not. At the bellmouth the model's Reynolds number is 64,750 against the prototype's 951,700, a ratio of 6^1.5 = 14.7, and its Weber number is 579 against 20,860, a ratio of 6² = 36. The model is fully turbulent, but its vortex cores and boundary layers are relatively thicker, and Chapters 5 and 6 explain what that does to the results.

## Materials, roughness and construction tolerances

A model's materials are chosen for visibility and accuracy as much as for strength. Intake models are usually built largely of clear acrylic, so that dye traces, floating markers and vortex funnels can be seen and photographed from below and from the side. Acrylic is also smooth, much smoother in relative terms than the concrete of a prototype wet well, and the model's walls therefore have relatively less friction than the prototype's. For a short intake that matters little, because the flow pattern is set by geometry and gravity, but it is one more reason the model's friction losses are not the prototype's.

Construction tolerances shrink with the scale too. If the prototype's bellmouth is to sit 300 mm above the floor within a construction tolerance of ±25 mm, the model bellmouth sits 50 mm above its floor, and the same relative tolerance is ±4 mm. The laboratory usually works to tighter limits than that, because a model error of 4 mm in floor clearance is an error of 8% in the clearance ratio C ÷ D, enough to change the flow under the bellmouth. The PS-3 model is built to ±1 mm on every dimension that sets a geometric group.

The model must also reproduce any feature that could shape the flow, even small ones: a step in the floor, a chamfer on a wall corner, a pipe support, a ladder. Features that cannot be reproduced exactly, such as a trash rack with many thin bars, are often represented by a perforated plate or screen with the same head loss, which needs its own calibration.

## Measurement at model scale

The instruments must resolve the quantities that matter at the model's size. Water levels are read with point gauges or ultrasonic sensors to about ±0.5 mm. At 1:6, the PS-3 submergence of 1.20 m becomes 200 mm in the model, so ±0.5 mm is ±0.25% of the submergence, and a prototype-equivalent ±3 mm. At 1:10 the same gauge gives ±0.42% of the 120 mm model submergence, a prototype-equivalent ±5 mm. Either is acceptable for levels, but velocity measurements suffer more as the model shrinks, because probes have a fixed size and disturb a larger share of a smaller flow.

Swirl in each suction pipe is usually measured with a swirl meter: a light, free-spinning vane assembly whose rotation rate, together with the pipe velocity, gives a swirl angle. A swirl meter needs enough flow to overcome its own bearing friction, which sets a practical lower limit on the model's pipe size and velocity. Flows are measured with calibrated meters or with orifice plates calibrated in place, which is the subject of Chapter 7.

## The error: a model boundary drawn too close

This is an illustration. The laboratory's first layout, drawn when 1:4 was still under consideration, saved length by starting the model only 1.5 m upstream of the pumps at full scale, with the inflow entering through a perforated diffuser. At 1:4 that made the model fit the bay.

During the design review, the station designer pointed out that the real station is fed by a 1,200 mm pipe entering the side of the approach channel 20 m upstream of the pumps, and that the jet from that pipe, deflected by the channel wall, is the most likely source of the skewed approach flow that causes vortices. A diffuser 1.5 m upstream would deliver an even, idealised flow and hide the very problem the model was meant to find. The model would have produced reassuring results that did not represent the station.

The fix was to model the approach from the inflow pipe onwards, which made the modelled region 30 m long at full size. That single change is what ruled out 1:4 and pushed the choice to 1:6. The laboratory's checklist now requires the modelled region to start far enough upstream to include every feature that could shape the approach flow, and the review to confirm it against the prototype drawings before the scale is chosen.

## How this applies to a small Australian business

Most small businesses never build a hydraulic model, but many test something smaller, slower or simpler than the real thing: a short length of conveyor, a quarter-size enclosure, a single nozzle, a prototype at reduced power. The questions in this chapter apply to all of them. Which forces matter? Which of them does the test reproduce, and which does it not? Is the test boundary far enough from the region of interest? Asking them before the test is built is far cheaper than discovering afterwards that the results do not represent the product.

## Exercise: the 1:5 option

The laboratory reconsiders 1:5 after finding that a stilling section 0.6 m long would do. At 1:5, find the model bellmouth diameter, the flow per duty pump, the total flow for two pumps at 1.5 times the Froude-scaled flow, and the bellmouth Reynolds and Weber numbers. Does it meet the laboratory's limits and the illustrative specification?

**Worked answer.** The bellmouth is 600 ÷ 5 = **120 mm**. The flow ratio is 5^2.5 = 55.90, so each pump draws 450 ÷ 55.90 = **8.05 L/s**, and two pumps at 1.5 times draw 3 × 8.05 = **24.15 L/s**, within the 30 L/s supply. The Reynolds number is 951,700 ÷ 5^1.5 = 951,700 ÷ 11.18 = **85,120** and the Weber number is 20,860 ÷ 5² = **834**, both above the illustrative minimums. The modelled region is 30 ÷ 5 = 6.0 m long, so with a 0.6 m stilling section the model needs 6.6 m and does not fit the 6 m bay. The 1:5 option fails on space alone, and 1:6 stands.
