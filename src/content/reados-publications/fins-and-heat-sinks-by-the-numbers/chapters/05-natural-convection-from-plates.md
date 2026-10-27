---
book: fins-and-heat-sinks-by-the-numbers
chapterSlug: natural-convection-from-plates
order: 5
title: "Natural convection from plates"
description: "Buoyant air rising past a warm plate sets the natural-convection coefficient. The Rayleigh number and Churchill–Chu give it for HS-150's base, with a β error that inflated it by half."
draft: false
---

A heat sink with no fan is cooled by air that it moves itself. The air next to a warm surface is heated, becomes lighter than the air around it, and rises, drawing cooler air in behind it. The rising layer, the **boundary layer**, is thin at the bottom of a vertical surface and thickens as it climbs, and the heat transfer coefficient is largest at the bottom, where the layer is thinnest, and falls with height. Everything about a natural-convection heat sink, from its coefficient to the best spacing of its fins, follows from the behaviour of that layer.

This chapter introduces the **Rayleigh number**, which measures the strength of buoyancy against the air's resistance to motion, uses the Churchill–Chu correlation for a vertical plate to find the coefficient on HS-150's base before any fins are added, and shows how height, temperature and orientation change it. Its failure case is a single unit error, the expansion coefficient of the air taken from a temperature in degrees Celsius instead of kelvin, which made the air seem five times more buoyant and the coefficient half as large again as it really was.

## What drives the flow

Buoyancy comes from the change of the air's density with temperature. For air, an ideal gas at nearly constant pressure, the volumetric expansion coefficient is simply β = 1 ÷ T, with T the absolute temperature in kelvin, usually taken at the film temperature, the mean of surface and air. The buoyant force on the warm layer is proportional to g × β × ΔT, where ΔT is the surface's excess over the air. Resisting the motion are the air's viscosity, through its kinematic viscosity ν, and its thermal diffusivity α, which spreads the heat out of the layer.

The **Rayleigh number** combines them, for a vertical surface of height L:

Ra_L = g × β × ΔT × L³ ÷ (ν × α)

It plays the part that the Reynolds number plays in forced flow. On a vertical plate, the boundary layer is laminar up to a Rayleigh number of about 10⁹, and becomes turbulent beyond. Almost all electronics heat sinks, with heights of tens of centimetres and excess temperatures of tens of kelvin, are laminar.

## Air's properties

This is an illustration. At full load, HS-150's base is at about 94.5 °C in 40 °C air (Chapter 6), so the film temperature is about 67 °C. Interpolating the published properties of air at one atmosphere gives, at that temperature, a conductivity of about 0.0293 W/m·K, a kinematic viscosity of about 19.6 × 10⁻⁶ m²/s and a Prandtl number of about 0.704, so a thermal diffusivity of ν ÷ Pr ≈ 27.8 × 10⁻⁶ m²/s. The expansion coefficient is 1 ÷ (67.25 + 273.15) ≈ 0.002 94 per kelvin.

```figure
type: formula
title: The Rayleigh number for HS-150's base as a plain plate
formula: Ra_L = g β ΔT L³ ÷ (ν α),   β = 1 ÷ T_film (kelvin)
caption: This is an illustration at full load, base 94.5 °C, air 40 °C, plate 250 mm tall. Air properties are interpolated from published tables at the 67 °C film temperature.
- g β | 9.81 × 0.002 94 ≈ 0.0288 per s²·K
- ΔT | 94.5 − 40 = 54.5 K
- L³ | 0.25³ ≈ 0.0156 m³
- ν α | 19.6 × 10⁻⁶ × 27.8 × 10⁻⁶ ≈ 5.46 × 10⁻¹⁰ m⁴/s²
step: Ra_L ≈ 0.0288 × 54.5 × 0.0156 ÷ 5.46 × 10⁻¹⁰ ≈ 4.50 × 10⁷, laminar
```

## The Churchill–Chu correlation

For a vertical plate at uniform temperature, Churchill and Chu correlated a wide range of experiments in two forms. For the laminar range, up to Ra_L ≈ 10⁹, the more accurate form is:

Nu_L = 0.68 + 0.670 × Ra_L^¼ ÷ [1 + (0.492 ÷ Pr)^(9/16)]^(4/9)

and the coefficient follows as h = Nu_L × k ÷ L. Their second form covers laminar and turbulent flow together and gives somewhat higher values in the laminar range; for heat sinks the laminar form is the one to use. For HS-150's base at full load, the denominator is about 1.304, Nu_L ≈ 0.68 + 0.670 × 81.9 ÷ 1.304 ≈ 42.8, and h ≈ 42.8 × 0.0293 ÷ 0.25 ≈ **5.0 W/m²·K**.

That is a small number, and it is typical. Natural convection in air gives coefficients of a few watts per square metre per kelvin, which is why natural-convection heat sinks need so much area.

## Radiation alongside

A plain plate in air also radiates, and Chapter 7 treats radiation fully. For a quick comparison here, an anodised plate with emissivity 0.77, at 94.5 °C, facing surroundings at 40 °C, has a radiation coefficient of about 6.9 W/m²·K, larger than its convection coefficient. The two act in parallel. So HS-150's base, as a plain plate of 0.05 m² with no fins, would have a resistance of about 1 ÷ ((5.0 + 6.9) × 0.05) ≈ **1.67 K/W**, more than four times the 0.40 K/W the budget allows.

```figure
type: bars
title: HS-150's base as a plain plate: coefficients at full load, and the area 150 W would need
unit: W/m²·K
max: 14
caption: This is an illustration at a base temperature of 94.5 °C and air at 40 °C. A plain anodised plate would need about 0.23 m² of vertical surface, nearly five times HS-150's footprint, to shed 150 W; fins provide that area in the footprint.
- Natural convection, Churchill–Chu laminar | 5.0
- Radiation, ε 0.77 | 6.9
- *Combined | 11.9
```

The need for fins follows directly. To shed 150 W at a 54.5 K excess with a combined coefficient of about 11.9 W/m²·K needs about 0.23 m² of surface at the base temperature. HS-150's footprint is 0.05 m². Fins supply the missing area, but, as Chapter 6 will show, packing them close interferes with the boundary layers and reduces the coefficient, and as Chapter 7 will show, fins mostly radiate to each other rather than to the room.

## The failure case: β in the wrong units

This is an illustration. An early hand calculation for HS-150 used the film temperature in degrees Celsius to work out the expansion coefficient: β = 1 ÷ 67.25 ≈ 0.0149 per kelvin, instead of 1 ÷ 340.4 ≈ 0.002 94. Everything else was right. The Rayleigh number came out about 5.06 times too large, about 2.28 × 10⁸, and because the laminar Nusselt number goes with its fourth root, the coefficient came out about 1.49 times too large: **7.5 W/m²·K** instead of 5.0.

```figure
type: compare
title: The β error's effect on HS-150's plain-base coefficient
cols: β used | Ra_L | h, laminar Churchill–Chu
caption: This is an illustration at full load. The fourth-root dependence hides most of the error: a factor of five in the Rayleigh number becomes a factor of 1.5 in the coefficient, small enough to look plausible.
- *Correct, kelvin | 0.002 94 per K | 4.50 × 10⁷ | 5.0 W/m²·K
- Wrong, degrees Celsius | 0.0149 per K | 2.28 × 10⁸ | 7.5 W/m²·K
```

The insidious thing about this error is that 7.5 W/m²·K looks reasonable; it lies within the range of natural-convection coefficients printed in many tables. It was caught when a reviewer cross-checked the calculation against a simple rule: for a vertical plate a few tens of centimetres tall, with tens of kelvin of excess, a natural-convection coefficient in air above about 6 W/m²·K deserves a second look. Tracing the inputs back found β. The correction was to put every temperature in kelvin in a separate, labelled cell and to derive β from it. Had the error stood, every fin calculation built on it would have been optimistic by about half, and the natural-convection design of Chapter 6 would have been under-sized. The general lesson is that any quantity that enters through a fourth root conceals its own errors, and its inputs need checking more carefully than its result.

## Height, temperature and orientation

The laminar correlation shows how the coefficient depends on the plate. Because Nu_L grows as Ra_L^¼ and Ra_L as L³, the coefficient h = Nu k ÷ L falls roughly as L^(−¼): taller plates have lower average coefficients, because more of their surface sits under a thick boundary layer. For HS-150's conditions, a plate 100 mm tall has about 6.4 W/m²·K, 250 mm about 5.0, 500 mm about 4.2 and 1 m about 3.5. The coefficient rises slowly with the excess temperature, as ΔT^¼, which is why a natural-convection sink's resistance falls as its power rises (Chapter 1).

Orientation matters a great deal. A vertical plate lets the boundary layer rise freely along its whole height. A horizontal plate facing up sheds a plume from its middle; one facing down traps a layer of warm air beneath it and is the worst orientation of all. For finned sinks, the effect is larger still: vertical fins form chimneys that guide the rising air, while horizontal fins block it, and a natural-convection sink mounted with its fins horizontal can lose a large part of its performance. HS-150's fins run vertically for that reason, and its installation instructions say so.

### Boundary layer thickness

The boundary layer's thickness is of the order of L ÷ Ra_L^¼, about 3 mm for HS-150's base, and the full thermal layer, where the air is noticeably warmed, is several times that near the top of the plate. That length scale matters for the next chapter. When fins are spaced more closely than about twice the boundary layer's full thickness, the layers from neighbouring fins meet and the air between them is warmed throughout; when they are spaced much more widely, much of the gap carries cool air that does no work. The optimum spacing lies between, at a few times L ÷ Ra_L^¼, and Chapter 6 calculates it.

### Bottom and top of the plate

The correlation gives the average coefficient over the plate's height, but the local coefficient varies along it. In laminar natural convection the local value falls as the distance from the leading edge to the power of minus one-quarter, and the average over a height L is four-thirds of the local value at L. For HS-150's base at full load, with an average of 5.0 W/m²·K, the local coefficient at the top edge is about 3.75 W/m²·K, and 25 mm above the bottom edge it is about 3.75 × (0.025 ÷ 0.25)^(−¼) ≈ 6.7 W/m²·K. The bottom of the plate is cooled almost twice as well as the top, and it meets the coolest air.

That has a practical consequence for layout. Where several heat sources share a vertical natural-convection sink, the hottest or most sensitive should sit low, where the coefficient is highest and the air coolest, and the less sensitive ones higher, where they are bathed in air already warmed below. HS-150's module is mounted with its centre about a third of the way up the base for that reason, rather than centrally, while its cables leave from the top. The same logic says that a heat sink should never be mounted directly above another warm device whose plume will feed it pre-heated air. In a cabinet with several drives stacked vertically, the top drive's sink breathes the lower ones' exhaust, and its ambient in the budget of Chapter 1 must be the temperature of that exhaust, not of the room.

## Altitude and enclosure

Two installation details change the coefficient. At altitude, the air's density falls, and with it the Rayleigh number, so natural convection weakens; equipment designed for sea level and installed at a high mine site may need derating. And a heat sink inside a cabinet or close to a wall is not in free air: the cabinet's air is warmer than the room's, and a wall close to the fins' tips restricts the inflow of cool air. The correlations of this chapter assume free air at a stated temperature, and the installation should provide it or the design should allow for what it provides.

## How this applies to a small Australian business

The natural-convection coefficient is small, uncertain and easy to overestimate. For a quick sense of scale, vertical surfaces in still air at tens of kelvin above ambient have convection coefficients of about 4 to 6 W/m²·K, and anodised or painted surfaces radiate about as much again. A calculation that gives much more than that for natural convection has probably gone wrong, and the most common cause is a temperature in the wrong units. A spreadsheet with temperatures in labelled kelvin cells, air properties interpolated from a published table and the laminar Churchill–Chu correlation is enough for the first estimate of any natural-convection surface. Two layout rules come free with it: mount natural-convection sinks with their fins vertical, and put the hottest parts low on the sink, away from other equipment's rising plumes. Both cost nothing at the design stage and are expensive to change after the cabinet is built.

## Exercise: the cooler base

At 50 W, HS-150's base runs at about 64.3 °C in 40 °C air. Using a film temperature of about 52 °C, the published air properties give k ≈ 0.0282 W/m·K, ν ≈ 18.1 × 10⁻⁶ m²/s and Pr ≈ 0.705. Find the Rayleigh number and the laminar Churchill–Chu coefficient for the 250 mm base as a plain plate, and compare with the full-load value of 5.0 W/m²·K.

**Worked answer.** β = 1 ÷ (52 + 273.15) ≈ 0.003 08 per K; ΔT ≈ 24.3 K; α ≈ 18.1 × 10⁻⁶ ÷ 0.705 ≈ 25.7 × 10⁻⁶ m²/s. Then Ra_L ≈ 9.81 × 0.003 08 × 24.3 × 0.0156 ÷ (18.1 × 10⁻⁶ × 25.7 × 10⁻⁶) ≈ **2.46 × 10⁷**. Ra_L^¼ ≈ 70.4, so Nu_L ≈ 0.68 + 0.670 × 70.4 ÷ 1.304 ≈ 36.8, and h ≈ 36.8 × 0.0282 ÷ 0.25 ≈ **4.2 W/m²·K**.

The coefficient at 50 W is about 16 % lower than at full load, because the excess temperature is less than half as large and the coefficient varies as its fourth root. That is part of why HS-150's resistance at 50 W, about 0.485 K/W, is higher than its 0.363 K/W at full load.
