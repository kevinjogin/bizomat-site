---
book: water-hammer-by-the-numbers
chapterSlug: model-it-and-write-the-surge-study
order: 10
title: "Model it and write the surge study"
description: "Work through the method of characteristics behind the case's model by hand, check it against Joukowsky, know where it stops being physical, and brief a surge study properly."
draft: false
---

Hand methods show whether a pipeline has a surge problem and roughly how large it is. They cannot follow a wave through friction, a closing valve, a pump that is slowing down and a profile that rises and falls. For that, engineers use the method of characteristics, a step-by-step calculation that tracks waves along the pipe on a grid of points in space and time. Every surge program in common use is built on it or on close relatives.

This chapter explains the method using the short model written for this book's case and shows one time step worked by hand. It sets out the checks that tell you a model is behaving, the point at which a simple model stops describing reality, and what a surge study report should contain. The aim is not to make every reader a surge analyst. It is to make every reader able to brief one, check the results and ask the questions that catch the common errors.

## Characteristics in one paragraph

The equations for unsteady flow in a pipe relate head and flow along its length and through time. Along two special paths, one moving downstream at the wave speed and one moving upstream at the wave speed, they reduce to simple relations between head and flow. Those paths are the characteristics, labelled C⁺ and C⁻. Along C⁺, the quantity H + BQ is carried forward unchanged apart from friction; along C⁻, the quantity H − BQ is. Here H is the head, Q the flow and B = a ÷ (gA), the pipe's characteristic impedance.

Divide the pipe into equal reaches of length Δx and choose the time step Δt = Δx ÷ a, so a wave crosses exactly one reach per step. At each new time step, the head and flow at an interior point P come from its two neighbours at the previous step:

```figure
type: formula
title: Method of characteristics at an interior point
formula: C_P = H_u + B Q_u − R Q_u |Q_u|
formula: C_M = H_d − B Q_d + R Q_d |Q_d|
formula: H_P = (C_P + C_M) ÷ 2, Q_P = (C_P − H_P) ÷ B
- u, d | the upstream and downstream neighbours of point P at the previous time step
- B | characteristic impedance a ÷ (gA), s/m²
- R | friction coefficient f Δx ÷ (2 g D A²) for one reach
step: the case: 20 reaches of 45 m, Δt = 45 ÷ 1,343.2 = 0.0335 s
step: B = 1,343.2 ÷ (9.81 × 0.018651) ≈ 7,341 s/m²
step: R = 0.018 × 45 ÷ (2 × 9.81 × 0.1541 × 0.018651²) ≈ 770 s²/m⁵
caption: This is an illustration of the case's model. The friction term uses the flow at the previous step, a common first-order treatment that is accurate when each reach's friction loss is small.
```

At the ends, one characteristic arrives from inside the pipe and the boundary supplies the second equation: a fixed head at a reservoir, zero flow at a closed valve, the valve equation for a partly open valve, or a pump's head-flow curve and its rundown equation for a pump.

## One step by hand

This is an illustration. Start from steady flow at 30 L/s, with the grade line falling from RL 158 m at the pump by R Q² = 770 × 0.03², about 0.693 m per reach. The inlet valve closes instantly at time zero.

At the valve, point N, the flow is now zero. Only the C⁺ characteristic arrives, from point N−1 one reach upstream, which still holds its steady values: H = 144.83 m and Q = 0.030 m³/s. So:

**C_P = 144.83 + 7,341 × 0.030 − 0.693 ≈ 364.38 m**

With Q_P = 0 at the closed valve, H_P = C_P = **364.38 m**. The head at the valve has jumped from its steady 144.14 m by **220.24 m**, the Joukowsky value from Chapter 3, to within rounding. The model reproduces the hand result exactly for the first step, which is the first check any model should pass.

At an interior point well upstream, say point 10, nothing has arrived yet. Its neighbours hold steady values of 151.76 m and 150.38 m, giving C_P ≈ 371.31 and C_M ≈ −69.17, so H_P ≈ 151.07 m and Q_P = 0.0300 m³/s: unchanged, as it should be until the wave arrives.

## Boundaries carry the physics

The interior equations are the same in every pipe. What makes one study different from another is the boundaries, and most of the engineering judgement goes into them.

A **valve** is modelled by its flow equation, Q = C τ √ΔH, where τ is the relative opening, defined so that τ = 1 gives the steady loss with the valve fully open, and ΔH the head across it. The case's model used a τ falling linearly with time, which Chapter 5 showed is already optimistic for many valves. A real study uses the valve maker's curve of flow coefficient against stroke, and the actuator's real stroke profile, including any two-stage setting and the fail-safe closure.

A **pump** is modelled by its head and torque characteristics over a wide range of speeds and flows, including reverse flow and reverse rotation, together with the rotating inertia that decides how quickly it slows. Using only the normal head-flow curve, as many simple programs do, is not enough for a trip, because the pump passes through operating states far from its normal curve as it runs down.

A **check valve** can be modelled as closing instantly at zero flow, which hides slam, or with a dynamic characteristic that lets reverse flow develop before closure. A **surge vessel** needs its gas law, its connection losses in each direction and its water level limits. An **air valve** needs its inflow and outflow orifice sizes and its closing behaviour. Each of these is a place where a reviewer should ask: where did this data come from?

## Friction during a transient

The model uses the steady friction factor throughout the transient. Measurements on real pipes show that pressure waves die away faster than steady friction predicts, because the velocity profile across the pipe changes rapidly during a transient and the wall shear is higher than in steady flow at the same mean velocity. Unsteady friction models, reviewed by Ghidaoui and colleagues in the references, add this extra damping.

For the first peak and trough, which usually govern design, steady friction is adequate and slightly conservative. For later cycles, or for events that depend on several reflections building up, such as resonance with a hunting control valve, the choice of friction model can matter, and a study should say which it used.

## Choosing the grid

The time step must be the same everywhere in the model, and the method works best when each pipe's reach length equals its wave speed times that time step. In a network of pipes with different lengths and wave speeds, that rarely divides evenly. Programs handle it either by interpolating between grid points, which smears sharp fronts, or by adjusting each pipe's wave speed slightly so its length becomes a whole number of reaches. Either is acceptable if the adjustment is small, a few per cent, and the study reports it. The grid-refinement check above shows whether the choice has affected the answer.

## Checks that a model is behaving

A model that produces plausible numbers can still be wrong. These checks, run before any results are believed, catch most errors:

```figure
type: checklist
title: Checks before believing a surge model
caption: Each check compares the model with a result you can derive by hand. A model that fails any of them has an input or set-up error.
- Steady state holds | run with no event; heads and flows must not drift
- First jump equals Joukowsky | an instant closure gives a ΔV ÷ g at the device
- Timing matches the pipe period | reflections return after 2L ÷ a; the cycle repeats every 4L ÷ a
- Line packing is about the friction loss | the closed-end peak creeps up by roughly the steady friction head
- Grid refinement changes little | halve the reach length; peaks and troughs should barely move
- * Minimum heads are physical | nothing below vapour pressure unless a cavity model is active
- Inputs are traceable | wave speed, profile, pump and valve data each have a stated source
```

The case's model passes the first five. For an instant closure it gives a jump of 220.3 m, a peak of 377.5 m at about 1.3 s from line packing of about 13 m, and a cycle of about 2.7 s. It fails the sixth, and that matters.

## Where a simple model stops being physical

After an instant closure, the case's model reports the head at the valve falling to about RL −49 m in the low phase. The valve is at RL 141 m, so that is a pressure head of about −190 m. Water cannot exist at that pressure; it boils at about −10 m. The model has no way to form a cavity, so it carries on calculating impossible numbers, and everything it reports after that moment is wrong: the timing, the later peaks and the minimums along the line.

Programs used for surge studies include cavity models for this reason. The most common, the discrete vapour cavity model, allows a cavity to open at any computing point where the head would fall below vapour pressure, tracks its volume, and collapses it when the flows on either side bring it shut, producing the rejoin surge described in Chapter 7. Gas-release models go further, for lines where dissolved air matters. None of them is exact, and their results near cavity collapse are sensitive to the grid and to assumptions. A study that finds column separation should therefore aim to prevent it, not to rely on a precise prediction of the rejoin surge. The same caution applies to air. Once air valves open and admit air, the model must track the air pocket's volume and its expulsion, and results near the moment the pocket closes are as uncertain as those near a cavity collapse. The safest designs keep the pressure positive everywhere in the governing events, so that neither model is needed to predict the worst moment.

## A failure case: reporting the impossible

This is an illustration. An early draft surge report for the case's main, produced with a simple model, includes a table of minimum pressures with "−190 m at the inlet valve" for the instant-closure case and the comment "steel pipe resists full vacuum; acceptable". The maximum-pressure table for the same case lists 236.5 m, from the first peak.

Both conclusions are unsafe. The minimum is not a pressure the pipe will see; it is a sign that a cavity forms. And because the model cannot represent the cavity's collapse, its maximum-pressure table covers only the first peak, not the rejoin surge, which can be larger.

The error was detected by the reviewer's sixth check: any reported head below vapour pressure means the model has left the physical range. The correction was to rerun the cases with a cavity model, to treat any predicted column separation as a design failure to be removed by protection, and to require the report to state, for every event, whether the minimum head stays above the owner's limit. The reviewer also added a line to the report template: "Minimum heads below vapour pressure are not results. They are warnings."

## What a surge study should contain

A surge study is an engineering deliverable with a reader: the designer who must act on it, the owner who must operate the line, and the next engineer who changes something. A useful report lets each of them find what they need:

```figure
type: steps
title: Contents of a surge study report
caption: The order follows the questions a reviewer asks. Every assumption and input needs a source or a reason, so the study can be repeated when something changes.
- Scope and events | the pipeline, its operating modes, and every event analysed: closures, trips, starts, power failure, emergency shutdowns
- Inputs and their sources | as-built profile, pipe data and wave speeds, pump curves and inertia, valve characteristics, check valve dynamics, air content assumptions
- Acceptance criteria | maximum pressure against component ratings; minimum pressure against the owner's limit; fatigue for plastics if relevant
- Method and checks | program, cavity and friction models, grid, and the checks against hand results
- * Results as envelopes | maximum and minimum heads along the profile for each event, with the governing event at each point
- Protection and settings | equipment sizes, valve stroke settings, operating rules, and what each protects
- Sensitivity and residual risk | wave speed range, gas volume, failure of each protection device
- Commissioning and review | pressure logging tests, and the changes that trigger a new study
```

Acceptance criteria deserve special attention. They are the owner's to set, informed by the component ratings, any applicable standards and the owner's own policy on transient pressures and minimum pressures. A study that chooses its own criteria without stating them, or that applies a rating without checking what the rating allows for transients, cannot be reviewed.

## After the study

The study is not finished when the report is issued. Its protection settings and operating rules belong in the operating manual, its devices in the maintenance system with test intervals, and its model with the asset records, so it can be rerun. The commissioning tests in Chapter 5 should be compared with the model's predictions, and the model corrected if they disagree. A main whose pumps, valves, profile or duty change should have its study reviewed, and the triggers for that review, listed in the report, should be part of the site's management of change.

## Briefing the study

A surge study is only as good as its brief and its data. For the case's main, the brief would ask for the events in this book, give the as-built profile, request a cavity-capable program, and supply measured or vendor data for the pump's rundown, the inlet valve's flow characteristic and the check valve's dynamic characteristic. It would state the acceptance criteria and ask specifically for the protection to be sized for an uncontrolled power failure. It would also ask for the study's sensitivity to wave speed and to the surge vessel's gas volume, since those were the two inputs the hand screening showed to matter most.

The [pumping system design tool](/tools/pump-system-design/) helps assemble the steady-state data a brief needs: heads, flows, power and suction conditions. The [water hammer pressure surge tool](/tools/water-hammer/) gives the screening numbers that tell you whether the study's headline results are in a sensible range.

## Exercise: the second step

Continue the hand calculation by one time step. At the second step, point N−1, one reach upstream of the closed valve, receives a C⁺ characteristic from point N−2, which still holds steady values of H = 145.52 m and Q = 0.030 m³/s, and a C⁻ characteristic from the valve, where H = 364.38 m and Q = 0. Find the head and flow at N−1.

**Answer.** C_P = 145.52 + 7,341 × 0.030 − 0.693 ≈ 365.07 m. At the valve Q = 0, so C_M = 364.38 − 0 + 0 = 364.38 m.

H_P = (365.07 + 364.38) ÷ 2 ≈ **364.72 m**, and Q_P = (365.07 − 364.72) ÷ 7,341 ≈ 0.00005 m³/s, about **0.05 L/s**.

The wave front has moved one reach upstream: point N−1 now has nearly zero flow and a head about 220 m above its steady value, slightly higher than at the valve one step earlier. That small rise is line packing beginning, as the steady grade line was higher at N−2 than at the valve.
