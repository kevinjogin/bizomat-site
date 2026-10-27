---
book: heating-and-cooling-times-by-the-numbers
chapterSlug: a-finite-difference-model
order: 7
title: "A finite-difference model you can check"
description: "Build an explicit finite-difference model of DS-100's body in a spreadsheet, check it against the one-term solution, add radiation and changing conductivity, and avoid an unstable time step."
draft: false
---

The one-term solutions are exact for their assumptions, and the assumptions are strict: constant properties, a constant surface coefficient, a uniform starting temperature, a simple shape. Real cycles break them. A furnace's radiation coefficient rises as the part heats; steel's conductivity falls; a quench's coefficient changes from second to second; a part may go into a furnace that is still recovering from the last load. The tool for all of these is a **finite-difference model**: divide the part into slices, write an energy balance for each slice, and step forward in time. An explicit model of this kind fits in a spreadsheet, needs no special software and, built carefully, agrees with the exact solutions to a fraction of a minute.

This chapter builds such a model for DS-100's body, checks it against Chapter 4's one-term answer, then uses it for the things the one-term solution cannot do: radiation, conductivity that changes with temperature and the early seconds of the quench. The running case's error was a time step chosen too long, which made the model's quench explode into impossible temperatures, and the chapter shows the rule that prevents it.

## Slices and energy balances

Divide DS-100's 50 mm radius into ten rings, each Δr = 5 mm wide, with eleven nodes: one at the centre, nine inside and one at the surface. Each node stands for the metal in a ring around it, a control volume, and the model tracks one temperature per node. In each time step Δt, each node's temperature changes by the heat flowing in from its neighbours, divided by its heat capacity.

For an interior node at radius r, conduction from the inner neighbour crosses the ring's inner face, at r − Δr ÷ 2, and from the outer neighbour across its outer face, at r + Δr ÷ 2. Per radian of a unit length, the energy balance gives:

T_new = T + (α Δt ÷ Δr²) × [(1 + Δr ÷ 2r) T_out − 2T + (1 − Δr ÷ 2r) T_in]

The centre node has only an outer neighbour, and its control volume is a small cylinder of radius Δr ÷ 2. Its balance reduces to T₀,new = T₀ + 4 (α Δt ÷ Δr²) (T₁ − T₀). The surface node has a half-width ring, receiving heat by conduction from inside and from the surroundings at the outer surface, so its balance includes h × R × (T∞ − T_s), with h free to change at every step. That last point is the model's great advantage: the surface coefficient can be any function of the surface temperature or of time.

```figure
type: steps
title: Building the model in a spreadsheet
caption: This is an illustration of the layout used for DS-100's body. Each row is one time step and each column one node; every cell refers only to the row above, which is what makes the method explicit.
- Inputs | radius, number of rings, ρ, c, k (or a k(T) table), h (or a formula), furnace temperature
- Grid | Δr = R ÷ number of rings; node radii 0, Δr, 2Δr … R
- Time step | Δt below the stability limit for every node (see below)
- Row 1 | every node at the starting temperature
- Centre column | T₀ + 4 Fo_Δ (T₁ − T₀), with Fo_Δ = α Δt ÷ Δr²
- Interior columns | the interior-node formula, with each node's own radius
- *Surface column | conduction from inside plus h × R × (T∞ − T_s) over the half ring's heat capacity
- Output | the row where the centre first reaches the target, × Δt
```

## Checking against the exact answer

A model should first reproduce a case whose answer is known. With a constant h of 150 W/m²·K, the conditions of Chapter 4, and a time step of 0.9 s, the eleven-node model brings the centre to 840 °C in **67.0 minutes**, against the one-term solution's 67.1. Doubling the number of rings to twenty changes the answer by about a hundredth of a minute; halving it to five rings, with a 4 s step, gives 66.9 minutes. The temperatures through the cycle match equally well.

```figure
type: compare
title: DS-100's body with constant h = 150 W/m²·K: finite differences against the one-term solution
cols: Centre, model | Centre, one-term | Surface, model | Surface, one-term
caption: This is an illustration from an eleven-node explicit model with Δt = 0.9 s. Agreement within half a kelvin shows that the model's equations and inputs are right before it is used for anything new.
- 10 min | 401.0 °C | 400.7 °C | 447.9 °C | 447.7 °C
- 20 min | 619.7 °C | 619.4 °C | 643.8 °C | 643.5 °C
- 30 min | 731.8 °C | 731.6 °C | 744.1 °C | 744.0 °C
- 40 min | 789.4 °C | 789.2 °C | 795.7 °C | 795.6 °C
- *60 min | 834.0 °C | 834.0 °C | 835.7 °C | 835.7 °C
```

That check is not a formality. A spreadsheet with a thousand rows and eleven columns has many places for an error to hide: a wrong cell reference, a radius off by one node, a surface term missing its factor of R. Matching a known solution to within a kelvin rules most of them out. Only then should the model be asked a question the exact solutions cannot answer.

## Stability: the rule for the time step

An explicit model has a limit on its time step. Each node's new temperature is a weighted sum of its own old temperature and its neighbours'. If the weight on its own old temperature becomes negative, a node that is hotter than its neighbours ends the step colder than them, the next step overshoots the other way, and the error grows without limit. The rule is therefore simple: **every node's own coefficient must be zero or positive.**

For DS-100's grid, with α ≈ 6.47 × 10⁻⁶ m²/s and Δr = 5 mm, that gives three limits:

- interior nodes: 1 − 2 Fo_Δ ≥ 0, so Δt ≤ Δr² ÷ 2α ≈ 1.93 s;
- the centre node: 1 − 4 Fo_Δ ≥ 0, so Δt ≤ Δr² ÷ 4α ≈ 0.97 s;
- the surface node: its heat capacity divided by its total conductance, k (R − Δr/2) ÷ Δr + h R, which is about 1.94 s with h = 150 W/m²·K and about 1.71 s with h = 1,000 W/m²·K.

The smallest limit, the centre's 0.97 s, governs. Halving the ring width quarters every limit, so a finer grid needs many more steps; that is the price of explicit methods. The limits also show why a quench is more demanding than a furnace: a larger h shrinks the surface node's limit, and a much larger h, such as a water spray's, can make it the binding one.

## The failure case: the exploding quench

This is an illustration. To model the quench, an engineer copied the furnace model and changed h to 1,000 W/m²·K and the surroundings to oil at 60 °C. To keep the spreadsheet short, the time step was raised to 3 s, because the furnace model had run happily at small steps and the quench seemed the same kind of problem. The results were nonsense within half a minute.

```figure
type: compare
title: DS-100's quench modelled with two time steps
cols: Node 9, 45 mm, Δt = 0.9 s | Surface, Δt = 0.9 s | Node 9, Δt = 3 s | Surface, Δt = 3 s
caption: This is an illustration with oil at 60 °C and h = 1,000 W/m²·K. At 3 s, above the 0.97 s and 1.93 s limits for the centre and interior nodes, the solution oscillates and grows; by 15 s the surface is "below" absolute zero.
- 3 s | 809 °C | 731 °C | 850 °C | 659 °C
- 6 s | 776 °C | 695 °C | 694 °C | 803 °C
- 9 s | 748 °C | 669 °C | 898 °C | 459 °C
- 12 s | 718 °C | 640 °C | 409 °C | 1,027 °C
- *15 s | 699 °C | 621 °C | 1,319 °C | −141 °C
```

The failure was obvious, which is the good kind of failure: a surface that heats up in an oil bath and then falls below −100 °C cannot be mistaken for physics. The dangerous case is a step just over the limit, where the oscillation is small and grows slowly and the results merely look a little noisy. The engineer's correction was to calculate the three limits, use a step below the smallest, and add a check column that flags any node whose temperature lies outside the range between its own previous value and the hottest or coldest neighbour. With Δt = 0.5 s, the quench model gives the centre reaching 300 °C at **261 s**, against the one-term solution's 260 s. If a model must run with long steps, the implicit method, which solves all the nodes together at each step, has no stability limit; it is more work in a spreadsheet but easy in any programming language.

## Radiation at the surface

With the model checked, radiation can replace the constant coefficient. The surface node's h becomes h_rad + h_conv, with h_rad = ε σ (T_s² + T_f²)(T_s + T_f) in kelvin, recalculated from the surface temperature at every step. For an isolated shaft that sees the furnace walls fully, with ε = 0.8 and 10 W/m²·K of convection, the centre reaches 840 °C in about **50.0 minutes**, much faster than with the constant 150 W/m²·K, because radiation's coefficient climbs to about 250 W/m²·K near the end. Inside a load, each shaft sees its neighbours and the basket as well as the walls, and Chapter 8 shows that an effective emissivity-and-view product of about 0.58 gives about **66.3 minutes**, which is why the constant 150 W/m²·K is a fair stand-in for DS-100's body in a loaded furnace.

## Conductivity that changes

Steel's conductivity is not constant. The published data for 4140 show about 42.6 W/m·K at 100 °C, 42.2 at 200 °C, 37.7 at 400 °C and 33.0 at 600 °C. Above 600 °C the source gives no value, and this illustration assumes the decline continues to about 27 W/m·K at 850 °C. In the model, each conduction term uses the conductivity at the mean temperature of the two nodes it connects, read from that table by straight-line interpolation.

```figure
type: bars
title: DS-100's body: centre time to 840 °C, constant and temperature-dependent conductivity
unit: min
max: 80
caption: This is an illustration from the eleven-node model. The k(T) rows use the published 4140 values to 600 °C and an assumed 27 W/m·K at 850 °C; the specific heat stays at the mean 650 J/kg·K throughout.
- Constant h 150, k = 33 | 67.0
- Constant h 150, k(T) | 67.5
- Radiation, isolated, ε 0.8, k(T) | 50.5
- *Radiation, loaded, ε × view 0.58, k(T) | 66.8
```

The conductivity's variation adds about half a minute in the furnace, as Chapter 4's sensitivity table predicted for a small Biot number. In the quench it matters more: with k(T), the centre reaches 300 °C at about 247 s instead of 261 s, because the steel conducts better as it cools and the quench's Biot number is large enough for conduction to matter. The model makes such questions cheap to answer; it does not make the input data any more certain, and the specific heat, which this illustration holds constant, matters more than the conductivity and is harder to pin down because of the heat absorbed and released as the steel transforms.

## What the model is for

A finite-difference model is worth building once for each family of parts, checked against the exact solution and then kept. It answers the questions that turn up in practice: a furnace that recovers slowly after loading (the furnace temperature becomes a time series), a two-stage heat with a preheat (the starting temperature is the end of the last stage), a part that sits on a cold rack (one node's surroundings change), or a quench whose coefficient follows a cooling-curve test (h becomes a table against surface temperature). The same structure extends to two dimensions, a grid of nodes in r and z for a shaft with a flange, with the same stability rule; at that point a finite-element package usually becomes the better tool, and the one-dimensional model becomes its check.

## How this applies to a small Australian business

A checked finite-difference spreadsheet is one of the most useful thermal tools a small manufacturer can own. It costs an afternoon to build, runs in seconds, and handles the real conditions that hand formulas cannot. The discipline that makes it trustworthy is short: reproduce a known solution first, calculate the stability limits and stay under the smallest, add a check column that flags impossible temperatures, and record the input data and its sources beside the model. A model that has not been checked against an exact case, or that runs with an unexamined time step, is a source of confident-looking errors.

## Exercise: a coarser grid

The engineer wants a faster model of DS-100's body with five rings, Δr = 10 mm. Find the stability limits for the centre, interior and surface nodes with h = 150 W/m²·K, choose a time step, and say how many steps are needed to reach 67 minutes. The coarse model gave 66.9 minutes against 67.0 for the eleven-node model; is it good enough?

**Worked answer.** Fo_Δ = α Δt ÷ Δr², with Δr² = 1.0 × 10⁻⁴ m². The interior limit is Δr² ÷ 2α ≈ 1.0 × 10⁻⁴ ÷ 1.294 × 10⁻⁵ ≈ **7.7 s**, and the centre limit is half that, about **3.9 s**. The surface node's half ring, from 45 mm to 50 mm, has a heat capacity per radian of ρ c (0.05² − 0.045²) ÷ 2 ≈ 5.10 × 10⁶ × 2.375 × 10⁻⁴ ≈ 1,212 J/K, and a conductance of 33 × 0.045 ÷ 0.01 + 150 × 0.05 ≈ 156 W/K, so its limit is about **7.8 s**. The centre governs; a step of 3.5 s is safe, and 67 minutes takes about 1,150 steps instead of about 4,470.

At 66.9 minutes against 67.0, the coarse model is within 0.2 % of the fine one, good enough for setting a cycle. Run as a quench with a 1 s step, it even gives the centre reaching 300 °C at about 260 s, the same as the fine model. Where it falls short is the surface in the first seconds of a quench, when the cooling has reached only 9 to 20 mm deep (Chapter 5): a 10 mm ring cannot show a temperature gradient that steep, so the surface node reports an average over a layer that is far from uniform. For questions about the surface's cooling rate, the finer grid, or a grid that is finer near the surface, is the right choice.

## Keeping the model honest

Three habits keep a spreadsheet model trustworthy after it has been checked. First, give every input a labelled cell with its source written beside it, so that changing an assumption, such as the assumed 27 W/m·K at 850 °C, is a deliberate act that shows in the file. Second, keep the energy balance as a running check: the heat that has crossed the surface, summed step by step as h × A × (T∞ − T_s) × Δt, should equal the change in stored heat, summed over the nodes as ρ × c × V × ΔT. A mismatch of more than a fraction of a per cent means a node's volume or a face's area is wrong. Third, keep the original check case, constant h against the one-term solution, as a tab in the same file and rerun it after every change to the model's structure. These take minutes, and they turn a calculation that only its author trusts into one that a reviewer can follow.
