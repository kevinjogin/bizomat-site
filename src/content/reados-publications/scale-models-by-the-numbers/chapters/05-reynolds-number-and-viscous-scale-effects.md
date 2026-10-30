---
book: scale-models-by-the-numbers
chapterSlug: reynolds-number-and-viscous-scale-effects
order: 5
title: "The Reynolds conflict and viscous scale effects"
description: "See where viscosity acts in a Froude model, judge Reynolds independence, raise the model Reynolds number with temperature and flow, and tell conservative scale effects from unsafe ones."
draft: false
---

A Froude model reproduces gravity faithfully and viscosity badly. In the PS-3 model at 1:6, the Reynolds number at each bellmouth is 64,750 against the prototype's 951,700, a ratio of 14.7. Viscous forces are therefore relatively 14.7 times stronger in the model than in the station it represents. Whether that matters depends on where viscosity acts, and on whether the quantity being measured still changes with the Reynolds number at the model's values.

This chapter explains where viscosity acts in an intake model, introduces the idea of Reynolds independence, and sets out the practical ways to keep viscous scale effects small: model size, water temperature and testing above the Froude-scaled flow. It sorts scale effects into those that make a model conservative and those that make it optimistic, and ends with a winter morning when the laboratory's water was colder than anyone had checked.

## Where viscosity acts

In a high-Reynolds-number flow, viscosity matters only in thin layers and small structures. Far from walls, the flow behaves almost as if the water had no viscosity at all, and its pattern is set by geometry, gravity and inertia, which a Froude model reproduces. Near walls, in boundary layers, viscosity slows the water to zero velocity at the surface. In the cores of vortices, viscosity limits how fast the water can spin. And at the onset of turbulence, viscosity decides whether small disturbances grow or die away.

Each of those places behaves differently in a smaller model. Boundary layers are relatively thicker, so they separate from curved surfaces at slightly different points. Vortex cores are relatively wider and spin more slowly, so a vortex that would draw an air core in the prototype may only make a surface dimple in the model. Turbulence is weaker in the approach flow, so swirl generated upstream may persist further. All three effects tend to make the model's flow smoother and its vortices weaker than the prototype's.

## Reynolds independence

Many flow quantities change with the Reynolds number at low values and then stop changing, or change very slowly, once the Reynolds number is high enough. A sharp-edged orifice's discharge coefficient, the loss coefficient of a sharp entry, the drag coefficient of a bluff body and the pattern of a fully turbulent jet all behave this way. Above a threshold they are said to be Reynolds-independent, and a model operating above that threshold reproduces them even though its Reynolds number does not match the prototype's.

The practical aim of an intake model is therefore not to match the prototype's Reynolds number, which is impossible, but to keep the model above the range where the features being studied still depend on it. Standards for pump intake models set minimum model Reynolds numbers for this purpose, and the project specification sets which ones apply. For PS-3 the illustrative specification asks for at least 5.0 × 10⁴ at the bellmouth.

A model can test its own Reynolds independence. If a result stays the same when the model's Reynolds number is raised, by running warmer water or higher flows, it is probably independent at the model's normal setting. If it keeps changing, the model is in the sensitive range, and its result must be treated as a bound rather than an answer.

## The model's Reynolds numbers

The Reynolds number that matters depends on the feature. For the bellmouth and suction pipe, it is based on the bellmouth diameter and velocity. For the approach channel, it is based on the flow depth and the mean approach velocity. The [pipe flow tool](/tools/pipe-flow/) calculates the mean velocity and Reynolds number for a full circular pipe carrying a liquid, from its bore, the flow and the kinematic viscosity, and labels the regime as a guide.

For a model suction pipe of 100 mm bore carrying 5.10 L/s (306.2 L/min) of water at 20 °C, with a kinematic viscosity of 1.0034 mm²/s from the NIST WebBook, it gives a velocity of 0.650 m/s and a Reynolds number of **64,750**, comfortably turbulent. For the prototype's 600 mm bellmouth at 450 L/s it gives 1.592 m/s and **951,700**. In the approach channel, the prototype's 0.125 m/s at 1.8 m depth gives a depth-based Reynolds number of about 224,000; the model's 0.0510 m/s at 300 mm depth gives about 15,300, still turbulent but much less so.

```figure
type: compare
title: Reynolds numbers in PS-3 and its 1:6 model
rowhead: Location
cols: Prototype | Model | Ratio
caption: Water at 20 °C in both. Every Reynolds number falls by L_r^1.5 = 14.7 in a Froude model, whatever length and velocity define it.
- Bellmouth, based on diameter | 951,700 | 64,750 | 14.7
- Approach channel, based on depth | 224,200 | 15,260 | 14.7
- Storage tank outlet jet, based on outlet diameter | 2,294,000 | 156,100 | 14.7
```

The storage tank's outlet jet, at 7.67 m/s through 300 mm in the prototype, has a Reynolds number of about 2.29 million; the model's 3.13 m/s through 50 mm gives about 156,000. Both are high enough that a sharp-edged outlet's discharge coefficient changes little, which is why the drain-time comparison in Chapter 4 could use the same coefficient at both scales without serious error.

## Raising the model's Reynolds number

There are three practical ways to raise a model's Reynolds number without changing its scale.

1. **Warm the water.** The kinematic viscosity of water falls as it warms, from 1.306 mm²/s at 10 °C to 0.801 mm²/s at 30 °C according to the NIST WebBook. A model run at 30 °C has a Reynolds number 25% higher than at 20 °C and 63% higher than at 10 °C, with no change to its Froude scaling. Large laboratories sometimes heat their water for this reason; small ones at least log it.
2. **Run above the Froude-scaled flow.** Increasing the flow raises the Reynolds and Weber numbers, but it also raises the Froude number, so the model is no longer similar to the prototype at that flow. The usual purpose is not to measure at the higher flow but to see whether vortices and swirl get stronger as viscous effects shrink, which shows how far the Froude-scaled result understates them.
3. **Build a larger model.** The Reynolds number rises as L_r^1.5, so going from 1:6 to 1:4 raises it by a factor of 1.84. Chapter 3 showed what that costs in flow and space.

```figure
type: bars
title: PS-3 model bellmouth Reynolds number by water temperature

caption: At the Froude-scaled flow of 5.10 L/s through the 100 mm bellmouth, with NIST kinematic viscosities. The illustrative minimum of 50,000 is missed at 10 °C.
- 10 °C, ν 1.3063 mm²/s | 49,740 | below the illustrative minimum
- 15 °C, ν 1.1386 mm²/s | 57,070
- * 20 °C, ν 1.0034 mm²/s | 64,750 | design assumption
- 25 °C, ν 0.8927 mm²/s | 72,790
- 30 °C, ν 0.8007 mm²/s | 81,150
```

## Reading Reynolds sensitivity from the data

Once the model was running, the laboratory used the temperature and flow variations deliberately, to see how much its main result, the swirl angle in the downstream suction pipe, depended on the Reynolds number. This is an illustration. Each run held the lowest water level and both duty pumps, and the swirl angle was averaged over ten minutes of model time.

```figure
type: compare
title: Swirl angle in the downstream suction pipe against model Reynolds number
rowhead: Run
cols: Water | Flow | Bellmouth Re | Mean swirl angle
caption: Invented results for the illustration. The swirl angle rises with the Reynolds number and the rise flattens between the last two runs, which suggests the model is approaching, but has not fully reached, Reynolds independence. The illustrative limit in this book is 4°, not a value from any standard.
- A | 10 °C | Froude-scaled | 49,740 | 1.4°
- * B | 20 °C | Froude-scaled | 64,750 | 2.0°
- C | 30 °C | Froude-scaled | 81,150 | 2.3°
- D | 20 °C | 1.5 × Froude-scaled | 97,130 | 2.5°
```

Three things can be read from the table. First, the swirl angle is not Reynolds-independent at the design condition: it rose by 15% between runs B and C with nothing changed but the water temperature. Second, the rise is slowing, from 0.6° between A and B to 0.3° between B and C, which is the pattern expected as the model approaches the plateau. Third, run D differs from B in its Froude number as well as its Reynolds number, so its 2.5° is not a measurement of the prototype; it is an upper marker that shows how much the swirl could grow if viscous damping were weaker still.

The laboratory's report therefore did not state the prototype swirl angle as 2.0°. It stated that the model at its design condition gave 2.0°, that the trend with Reynolds number pointed to a prototype value of about 2.3° to 2.5°, and that even the upper figure left a margin of more than 1.5° to the illustrative 4° limit. That is a weaker-sounding sentence than "2.0°", and a far more useful one, because a reader can see both the number and how much to trust it.

The same approach works for any result: run the model at two or three Reynolds numbers without changing anything else, plot the result against the Reynolds number on a logarithmic axis, and judge from the slope whether the plateau has been reached. Chapter 7 shows how to fit such a trend, and Chapter 8 how to tell a plateau from a change of regime.

## Conservative and optimistic scale effects

A scale effect is not automatically a problem. What matters is its direction. If the model overstates a hazard, its results are conservative: a design that passes in the model will do at least as well at full size. If it understates the hazard, its results are optimistic, and a pass in the model proves less than it seems.

For an intake, the main viscous scale effects run in both directions.

- **Vortex strength: optimistic.** Viscous damping in the model's vortex cores is relatively stronger, so vortices are weaker and air cores less likely than at full size. A model that shows only surface dimples may represent a prototype with intermittent air-entraining vortices.
- **Swirl decay: mixed.** Swirl generated in the approach decays by wall friction, which is relatively stronger in the model, so swirl may decay faster. But weaker turbulence may let organised swirl persist. The net effect depends on the geometry and is one reason swirl is measured, not predicted.
- **Friction losses: conservative.** Friction factors are higher at lower Reynolds numbers, so pipe and channel losses scaled from the model overstate the prototype's. Chapter 8 quantifies this for PS-3's suction pipe.
- **Separation: uncertain.** Thicker boundary layers can separate earlier or later depending on the surface curvature and the pressure gradient. Features that depend on separation, such as the flow around a pier or the edge of a benching, should be judged with care.

The rule of thumb that follows is simple: treat a model's vortex observations as a lower bound on the prototype's, and its loss measurements as an upper bound. A model study report should say which way each scale effect runs, not only that scale effects exist.

That rule has a practical consequence for design margins. If a model shows that an intake is free of air-entraining vortices with some margin, for example that only surface swirl appears even at the 1.5 times flow check, the optimistic bias is unlikely to overturn the conclusion. If the model shows intermittent dimples at the design condition and occasional air cores at the higher flow, the prototype may well be worse, and the sensible response is to improve the geometry, for example with a floor splitter, a back-wall fillet or a curtain wall, and test again, rather than to argue that the model is too small to be believed. Scale effects are a reason to demand margin, not a reason to dismiss an unwelcome result.

## The error: a winter morning in the laboratory

This is an illustration. The PS-3 model's acceptance tests were scheduled for a week in July. The laboratory draws its water from a large underground storage tank, and on the first morning nobody checked its temperature. The lowest-level, two-pump case ran cleanly: surface swirl over the downstream bellmouth was faint and no vortices were recorded.

The reviewing engineer noticed that the swirl meter readings were noticeably lower than in the commissioning runs a month earlier, at the same flow and level. Since the geometry and the Froude number were unchanged, something else had changed, and the obvious candidate was the water itself. A thermometer in the sump read 10.4 °C. At 10 °C the kinematic viscosity is 1.306 mm²/s, and the pipe flow tool gives a bellmouth Reynolds number of 49,740 at the Froude-scaled flow, below the specification's illustrative minimum of 50,000 and 23% lower than the design assumption.

The model had moved further into the range where viscous damping weakens vortices, which is exactly the direction that makes a model optimistic. The morning's results were set aside. The laboratory recirculated the water through its heated holding tank until it reached 20 °C, reran the case, and recovered the faint surface swirl and the swirl meter readings of the commissioning runs. Water temperature is now logged with every reading, the model's Reynolds number is calculated live beside the Froude number, and any run below the specified minimum is flagged before its results are used.

## How this applies to a small Australian business

Viscous scale effects appear in every small-scale or slow test of a flow device: a quarter-size spray nozzle, a slow-running pump test, a mixing trial in a beaker. The questions are always the same. Is the test's Reynolds number high enough that the result has stopped changing with it? Which way does any remaining effect push the result? And is the fluid's temperature known, since it changes viscosity faster than most people expect? Recording the water temperature costs nothing; ignoring it can turn a pass into a false pass.

## Exercise: the high-flow check on a cold day

The laboratory runs the 1.5 times Froude-flow check on the same winter morning, before the water is warmed, with each duty suction pipe at 7.66 L/s and the water at 10 °C. Find the bellmouth Reynolds number with the pipe flow tool's method. Is it above the illustrative minimum, and does it tell the laboratory anything about the Froude-scaled case at 20 °C?

**Worked answer.** At 7.66 L/s the velocity through the 100 mm pipe is 0.00766 ÷ 0.007854 = 0.975 m/s, so Re = 0.975 × 0.1 ÷ 1.3063 × 10⁻⁶ = **74,700**, above 50,000. But this run is at 1.5 times the Froude number as well as a higher Reynolds number, so it is not a similar test of the prototype. Its value is in the comparison: if swirl and vortices at this run are much stronger than at the Froude-scaled flow, the model is Reynolds-sensitive in this range, and the 20 °C Froude-scaled result, at a Reynolds number of 64,750 between the two, should be treated as a lower bound on the prototype's vortex activity.
