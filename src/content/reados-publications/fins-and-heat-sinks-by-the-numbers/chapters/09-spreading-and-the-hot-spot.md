---
book: fins-and-heat-sinks-by-the-numbers
chapterSlug: spreading-and-the-hot-spot
order: 9
title: "Spreading, base thickness and the hot spot"
description: "Heat from a small module must spread through the base before the fins can use it. A 2-D model sizes HS-150's base, and a short overload shows why a heavy sink cannot protect a hot junction."
draft: false
---

Every calculation so far has assumed that HS-150's base is at one temperature, so that every fin receives heat at the same root temperature. It is not. The module covers about 13 % of the base, and its heat enters there and must spread sideways through the aluminium to reach the fins at the edges. Spreading takes a temperature difference, so the base is hottest under the module and cooler towards its edges, and the module sits on the hottest part. The extra temperature rise is called **spreading resistance**, and for a small heat source on a large, thin base it can rival the interface resistance of Chapter 2.

This chapter calculates HS-150's spreading resistance with a two-dimensional conduction model, shows how base thickness and material change it, and looks at the hot spot under the module. It then turns to time: how long the sink takes to warm up, and why its heavy aluminium mass does not protect the junction during short overloads. That last point is the chapter's failure case.

## What spreading costs

Heat entering a base over a small area spreads out in a fan, and conduction through that fan has a resistance larger than the simple one-dimensional resistance t ÷ (k × A) of the full base. Exact solutions exist as infinite series for circular and rectangular sources on plates, and closed-form approximations, such as those of Lee, Song, Au and Moran, are widely used; Simons' 2004 summary is a practical introduction. This book takes a third route, which needs no special formula: a two-dimensional conduction model of the base, solved numerically, the steady-state form of the familiar finite-difference method, in which each node's temperature is the conductance-weighted average of its neighbours'.

The model treats HS-150's 62 mm × 108 mm module as a circular source of the same area, radius about 46 mm, centred on a circular base of the same area as the real 200 mm × 250 mm base, radius about 126 mm, 10 mm thick, in 6063-T5 at 209 W/m·K. The fins are represented by a uniform coefficient on the base's back face that gives the sink's 0.363 K/W when the base is isothermal, about 55 W/m²·K over the base's footprint. The model is solved on a grid of nodes in radius and depth until the temperatures stop changing.

```figure
type: formula
title: HS-150's spreading resistance from a two-dimensional base model, 150 W
formula: R_sp = (mean temperature over the source − the base temperature an isothermal model would give) ÷ P
caption: This is an illustration. The equal-area circular approximation is the usual first step for rectangular sources; a three-dimensional model or a test would refine it. Grid refinement changed the result by less than 0.001 K/W.
- Source | 62 × 108 mm module as an equal-area circle, radius ≈ 46 mm
- Base | equal-area circle, radius ≈ 126 mm, 10 mm thick, k = 209 W/m·K
- Fin side | uniform h ≈ 55 W/m²·K over the footprint, giving 0.363 K/W when isothermal
step: Mean rise over the source ≈ 61.3 K, against 54.5 K for an isothermal base
step: R_sp ≈ (61.3 − 54.5) ÷ 150 ≈ 0.044 K/W
```

The spreading resistance, about 0.044 K/W, costs about 6.7 K at 150 W, slightly more than the 6 K the interface costs, and it uses all of the 4 K reserve that Chapter 1 set aside and some more. With it, HS-150's junction at full load in 40 °C air is about 40 + 150 × (0.10 + 0.04 + 0.044 + 0.363) ≈ **122.1 °C**, inside the 125 °C limit by about 3 K.

## Base thickness

A thicker base spreads heat better. Running the same model at four thicknesses shows how much better, and at what cost in aluminium.

```figure
type: compare
title: HS-150's base thickness against spreading and junction temperature, 150 W in 40 °C air
cols: Spreading resistance | Mean rise over module | Junction | Base mass
caption: This is an illustration from the two-dimensional model, with the fins' resistance held at 0.363 K/W. Each extra 5 mm buys less, while the base's mass rises in proportion.
- 6 mm | 0.071 K/W | 65.2 K | 126.1 °C | 0.81 kg
- *10 mm | 0.044 K/W | 61.3 K | 122.1 °C | 1.35 kg
- 15 mm | 0.031 K/W | 59.4 K | 120.2 °C | 2.02 kg
- 20 mm | 0.025 K/W | 58.5 K | 119.2 °C | 2.70 kg
```

Going from 6 mm to 10 mm saves 4 K for 0.54 kg of aluminium; going from 10 mm to 15 mm saves about 1.9 K for another 0.67 kg; going on to 20 mm saves another 1 K for another 0.68 kg. HS-150's 10 mm base is a reasonable balance; a 6 mm base would push the junction over the limit, which is why thin, light bases need either a larger module footprint, a more conductive base or a heat spreader.

The material matters in the same way. Running the model with a conductivity of about 390 W/m·K, nearly twice aluminium's, roughly halves the spreading resistance, to about 0.024 K/W at 10 mm. That is why copper bases or copper inserts under the source are used on high-power sinks, and why heat pipes and vapour chambers, which move heat sideways with an effective conductivity many times copper's, are embedded in the bases of compact, high-flux sinks. For HS-150, with its large module and modest flux, aluminium at 10 mm is enough.

## The hot spot

The model also shows how temperature varies across the module itself. The mean rise over the source is about 61.3 K, but the rise at its centre is about 63.7 K, about 2.4 K higher. The module's devices near its centre therefore run hotter than those near its edges. Module makers design for this, and their junction-to-case figures assume a sink of reasonable spreading performance; on a thin or poorly conducting base, the centre devices can run several kelvin hotter than the budget suggests.

The effect grows quickly as the source shrinks. This is an illustration. The same 150 W from a 30 mm × 30 mm source, about one-seventh of the module's area, on the same base, has a spreading resistance of about 0.129 K/W, nearly three times as large, and its centre rises about 77 K above the air. Small, high-power devices on large heat sinks are the classic spreading problem.

### Off-centre sources

The model places the module at the centre of the base. HS-150's module sits about a third of the way up, as Chapter 5 recommended for the cooler air at the bottom, and its sides are closer to the base's edges in one direction. An off-centre source spreads less evenly and its spreading resistance is somewhat higher than a centred one's; the published series solutions and a three-dimensional model can quantify it. For HS-150 the module's position trades a little spreading against the higher natural-convection coefficient low on the sink, and the test of Chapter 10 measures the net result.

## How fast the sink warms

A heat sink has thermal mass as well as resistance. HS-150's aluminium weighs about 2.72 kg, which with 6063's specific heat of about 900 J/kg·K gives a heat capacity of about 2,450 J/K. Treating the sink as a single lump, at one temperature, its time constant is its heat capacity times its resistance to the air: about 2,450 × 0.363 ≈ **890 s**, about 15 minutes. After a step to full load, the sink reaches about 63 % of its final rise in 15 minutes and about 95 % in 45 minutes. That is why Chapter 10's test runs for at least an hour before reading the final temperature, and why the ambient in Chapter 1's budget must be the hottest air that lasts about an hour.

## The failure case: the overload the sink could not absorb

This is an illustration. The drive's specification called for an overload of 200 % for 60 seconds, as a machine started under load. The thermal designer reasoned that the module's losses would double to about 300 W for a minute, that the sink's time constant was about 15 minutes, and that the sink's 2,450 J/K would absorb the extra 150 W for 60 s with a rise of only about 150 × 60 ÷ 2,450 ≈ 3.7 K. The overload was approved on that basis.

The reasoning was right about the sink and wrong about the junction. The sink is only the last step of the thermal path. Between the junction and the sink lie the module's own resistances, junction to case 0.10 K/W and case to sink 0.04 K/W, and the spreading resistance of 0.044 K/W, and the masses along that part of the path, the silicon, its solder and substrate, the module's baseplate, are small. Their time constants are seconds, not minutes; in this illustration, the module maker's transient thermal impedance curve reaches most of its steady value within a few seconds. So within a few seconds of the overload beginning, the extra 150 W crosses those resistances at nearly its steady-state temperature drop: 150 × (0.10 + 0.04 + 0.044) ≈ **27.7 K**.

```figure
type: stack
title: HS-150's junction at the end of a 60-second, 200 % overload from full load in 40 °C air
unit: °C
caption: This is an illustration. The sink's heavy mass limits its own rise to about 3.7 K in a minute, but the fast, light parts of the path between junction and sink pass the extra heat almost at once. The junction reaches about 153 °C, far over the 125 °C limit.
- Air | 40
- Steady full-load rise, junction to air | 82.1
- Fast rise across module, interface and spreading | 27.7
- Slow rise of the sink in 60 s | 3.7
```

The junction would reach about 122.1 + 27.7 + 3.7 ≈ **153 °C** at the end of the overload, 28 K over the designer's limit and possibly beyond the device's own maximum. The error was caught during type testing, when the drive's own junction-temperature estimate, which uses the module maker's transient model, tripped the drive partway through the overload test. The correction was to calculate overloads with the transient thermal impedance of the whole path, and to choose between a larger module, a lower overload rating and a pre-overload derating that keeps the steady junction temperature low enough to leave room. The general lesson is that thermal mass protects only the parts of the path it sits beside: a heavy heat sink smooths minute-scale load changes, but the junction's protection against second-scale overloads lies in the module itself.

## Several sources on one base

Many heat sinks carry more than one device: a drive's rectifier and its inverter module, or a row of power transistors. Each source heats the base under itself by its own spreading, and it also raises the temperature of the whole base, and so of every other source, through the fins' shared resistance. Because conduction is linear, the temperatures add: the rise under any one source is its own spreading rise, plus the base's mean rise from the total power, plus a smaller term for the extra local warming that nearby sources cause. The practical consequences are to space the hottest sources apart, to put them where the base is thickest and the fins strongest, and to check the most sensitive device with all sources running at once, not one at a time.

## Measuring spreading

Spreading can be measured with two thermocouples: one in the base directly under the module's centre, in a shallow groove as Chapter 2 described, and one in the base near its edge, between the fins' roots. The difference between them, divided by the power, is a direct measure of how unevenly the base runs. This is an illustration. The two-dimensional model gives HS-150's base, at full load, a rise of about 63.7 K under the module's centre against the isothermal model's 54.5 K average, and the edge of the base runs cooler than the average. A measured difference much larger than the model's suggests a base thinner than drawn, a void in a bonded base, or a module mounted off its intended position. The same two readings, logged during the warm-up, also give the sink's time constant directly.

## How this applies to a small Australian business

Spreading is the resistance most often left out of a heat sink calculation, and it is easy to include: a two-dimensional model like the one here, a published closed-form estimate, or a simple test with a thermocouple under the module and one at the base's edge. For large modules on thick aluminium bases it is a few kelvin; for small, powerful devices on thin bases it can be the largest resistance in the path. The time question needs the same care: a sink's time constant is minutes, but a device's is seconds, and overload ratings must be checked with the device maker's transient data, not with the sink's mass. Both checks are short, and both are cheaper than discovering in the field that a drive trips on every hard start or that one device on a crowded base fails years before its neighbours.

## Exercise: the 250 W version's base

Under the 250 W version's fan, the fins' resistance is about 0.140 K/W, which corresponds to a coefficient on the base's footprint of about 1 ÷ (0.140 × 0.05) ≈ 143 W/m²·K, and the model gives a spreading resistance of about 0.043 K/W at 10 mm. Find the spreading's share of the temperature rise from the module's case to the inlet air at 250 W, and compare with the natural-convection design at 150 W. Why does spreading matter more, in relative terms, under a fan?

**Worked answer.** Under the fan, the rise from case to inlet air is 250 × (0.04 + 0.043 + 0.140) ≈ 55.8 K, of which spreading is 250 × 0.043 ≈ **10.8 K**, about **19 %**. In natural convection at 150 W, the same rise is 150 × (0.04 + 0.044 + 0.363) ≈ 67.1 K, of which spreading is about 6.7 K, about **10 %**.

Spreading matters relatively more under the fan because the fins' resistance has fallen to well under half, while spreading, a property of the base's conduction, has hardly changed. The better the fins, the more the base limits; on high-performance fan-cooled and liquid-cooled sinks, spreading is often the largest single resistance after the device itself, which is where copper bases and heat pipes earn their cost.
