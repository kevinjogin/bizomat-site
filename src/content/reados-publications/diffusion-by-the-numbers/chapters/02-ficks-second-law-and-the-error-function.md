---
book: diffusion-by-the-numbers
chapterSlug: ficks-second-law-and-the-error-function
order: 2
title: "Fick's second law and the error-function profile"
description: "Solve Fick's second law for a surface at constant carbon, read DS-40's profile from the error function, find the time for its 0.8 mm case, and see how the case definition changes it."
draft: false
---

Fick's first law says how fast carbon flows at a given moment. A heat treater needs something more: how the carbon content at every depth changes through the whole furnace cycle, so that the case depth at the end can be predicted. That is the job of Fick's second law, and for the commonest situation in surface treatment, a surface held at a fixed concentration while carbon diffuses into a thick part, its solution is a single, tabulated function: the **error function**.

This chapter states Fick's second law, gives its error-function solution for a surface at constant concentration, calculates DS-40's carbon profile and the furnace time for its 0.8 mm effective case, examines how the definition of "case depth" changes the answer, and checks when the simple solution applies. The failure case is a case depth measured to the wrong boundary.

## Fick's second law

Carbon is conserved: if more flows into a thin slice of steel than flows out, the concentration in the slice rises. Combining that bookkeeping with Fick's first law gives the second law: **∂C/∂t = D ∂²C/∂x²**. The concentration rises wherever the profile curves upwards and falls wherever it curves downwards; a straight-line profile does not change.

In words, the second law says that diffusion smooths. Wherever the concentration has a hump, carbon flows away from it; wherever it has a hollow, carbon flows in; and the sharper the curvature, the faster the change. A step in concentration, such as the jump from a carbon-rich atmosphere to a low-carbon steel at the start of carburising, is the sharpest feature possible, so the profile changes fastest at the beginning and ever more slowly as it relaxes into a smooth curve. That is the same behaviour the first law showed from the other side, as a flux falling with 1 ÷ √t.

The same equation governs the spreading of heat, with temperature in place of concentration and thermal diffusivity in place of D, which is why so much of diffusion's mathematics is borrowed from heat conduction. It is also the equation that Einstein derived for the probability of finding a Brownian particle at a given place, the starting point of the supplied lecture notes.

## The error-function solution

Consider a thick piece of steel with uniform carbon C₀, whose surface is suddenly held at a higher carbon C_s from time zero. Carbon diffuses inwards, and the solution of Fick's second law is:

**(C − C₀) ÷ (C_s − C₀) = erfc(x ÷ (2√(Dt)))**

where erfc is the **complementary error function**, one minus the error function, a standard function available in every spreadsheet as ERFC. Its argument, x ÷ (2√(Dt)), is the depth measured in units of twice the diffusion distance. The profile has the same shape at every time; it simply stretches deeper as √(Dt) grows.

```figure
type: compare
title: Values of the complementary error function
cols: erfc(z) | Meaning for the carbon profile
caption: Standard values. The carbon above the core level falls to half its surface value at z ≈ 0.48, to a third at z ≈ 0.68, and to under 5% at z = 1.5.
- z = 0 | 1.0000 | the surface
- z = 0.25 | 0.7237 | near the surface
- z = 0.5 | 0.4795 | just under half
- *z = 0.6841 | 0.3333 | DS-40's 0.40% carbon point
- z = 1.0 | 0.1573 | well into the transition
- z = 1.5 | 0.0339 | close to the core
- z = 2.0 | 0.0047 | essentially core carbon
```

## DS-40's profile and furnace time

DS-40's steel has **C₀ = 0.20%** carbon, the furnace holds its surface at **C_s = 0.80%**, and the effective case is taken as the depth where carbon falls to **0.40%**. At that depth, (0.40 − 0.20) ÷ (0.80 − 0.20) = 1/3, so erfc(z) = 1/3 and **z ≈ 0.6841**. The case depth is therefore **x = 2 × 0.6841 × √(Dt) ≈ 1.368 √(Dt)**.

```figure
type: formula
title: Time at 925 °C for DS-40's 0.8 mm effective case
formula: x = 2z√(Dt)    so    t = (x ÷ 2z)² ÷ D
caption: This is an illustration with D ≈ 8.115 × 10⁻¹² m²/s at 925 °C and a constant surface carbon of 0.80%. Chapter 4 shows how a boost-and-diffuse cycle shortens it.
- Target depth x | 0.8 mm
- z for 0.40% carbon | 0.6841
- Required √(Dt) | 0.8 ÷ (2 × 0.6841) ≈ 0.585 mm
- Time t | (0.585 × 10⁻³)² ÷ 8.115 × 10⁻¹² ≈ 42,100 s, about 11.7 hours
step: Holding the surface at 0.80% for about 11.7 hours at 925 °C gives 0.40% carbon at 0.8 mm
```

At the end of that time, the carbon profile through DS-40's surface is:

```figure
type: bars
title: DS-40's carbon profile after 11.7 hours at 925 °C
unit: % carbon
max: 0.9
caption: This is an illustration from the error-function solution with C_s = 0.80%, C₀ = 0.20% and √(Dt) ≈ 0.585 mm. The effective case, at 0.40%, is at 0.8 mm; by 2 mm the carbon is within 0.01% of the core.
- Surface | 0.80
- 0.2 mm | 0.685
- 0.4 mm | 0.577
- 0.6 mm | 0.481
- *0.8 mm | 0.400
- 1.0 mm | 0.336
- 1.2 mm | 0.288
- 1.6 mm | 0.232
- 2.0 mm | 0.209
```

## What "case depth" means

The calculation gives a different depth for every carbon level chosen as the boundary, and the choice is not trivial.

- An **effective case depth** is defined by a property that matters in service: in practice, the depth at which hardness falls to a stated limit, measured by a hardness traverse on a sectioned sample. ISO 18203, which replaced ISO 2639, describes such measurements; the limit hardness is stated on the drawing. This book stands in for it with a carbon level of 0.40%.
- A **total case depth** is the depth to which carbon has been raised at all, often judged by etching a section and measuring to where its appearance changes, or as the depth where carbon is just above the core level.

For DS-40, the depth at which carbon is **0.45%** is about **0.67 mm**; at **0.40%** about **0.80 mm**; at **0.35%** about **0.95 mm**; and at **0.22%**, barely above the core, about **1.76 mm**. The total case is more than twice the effective case. A drawing that says only "case depth 0.8 mm" leaves room for a factor of two in what is delivered.

### How steep the profile is at the case boundary

The slope of the profile at the case boundary decides how sensitive the measured depth is to small errors. Differentiating the error-function solution, the carbon gradient at depth x is (C_s − C₀) × (2 ÷ √π) × exp(−z²) ÷ (2√(Dt)). At DS-40's 0.8 mm boundary that is about **0.36% carbon per millimetre**. A carbon analysis that is out by 0.02%, or a hardness-to-carbon relation that is off by the equivalent, moves the reported case depth by about **0.02 ÷ 0.36 ≈ 0.055 mm**. The tolerance band of 0.7 to 1.0 mm is about five times that, which is comfortable; a tighter tolerance, or a shallower profile from a lower surface carbon, would make the measurement itself a significant part of the uncertainty.

The profile's shape also matters after hardening. Hardness follows carbon closely in the hardened case, so a gently sloping carbon profile gives a gently falling hardness and a gradual change in residual stress from the compressed case to the core, which suits fatigue resistance. A very steep profile, from a short cycle at high surface carbon, concentrates the change into a thin layer. That is one reason carburising cycles end with a diffusion stage that softens the profile's slope, as Chapter 4 describes.

## Reading the profile backwards

The solution can be run in reverse. A test coupon carburised with the parts and analysed for carbon at several depths gives a measured profile; fitting the error function to it gives the effective diffusion coefficient for that steel, furnace and cycle. If DS-40's coupon, after 11.7 hours at 925 °C, showed 0.40% carbon at **0.78 mm** rather than 0.80 mm, then √(Dt) = 0.78 ÷ (2 × 0.6841) ≈ 0.570 mm, and the effective D is about **(0.570 × 10⁻³)² ÷ 42,120 ≈ 7.7 × 10⁻¹² m²/s**, about 5% below the pure-iron value used for planning. That figure, recorded for the grade and furnace, makes the next cycle's calculation more accurate than any handbook value. Heat treaters who keep such records accumulate exactly the grade-specific data that published tables cannot give.

## Continuing a cycle

The error-function solution has a convenient property for re-treatment. If a part has been carburised for a time t₁ at a given surface carbon and temperature, and is returned to the same conditions, the profile simply continues as if the cycle had never been interrupted: after a further time Δt, it is the profile for t₁ + Δt. The undersized pins of Chapter 1's failure case, with a 0.57 mm case at DS-40's conditions, correspond to about **5.9 hours** at 925 °C; reaching 0.8 mm needs a total of 11.7 hours, so about **5.8 hours** more. That is true only if the surface carbon, the temperature and the parts are the same, and if nothing happened in between, such as decarburisation during cooling or a hardening operation; otherwise, the starting profile is no longer an error function and the calculation must be done numerically from the measured profile.

## A spreadsheet recipe

The whole calculation fits in a few cells: C₀, C_s and the boundary carbon; D from the Arrhenius formula of Chapter 3; the time; and a column of depths with the formula C₀ + (C_s − C₀) × ERFC(x ÷ (2 × SQRT(D × t))). A goal-seek on time, for the boundary carbon at the target depth, gives the cycle time. The same sheet, with C_s below C₀, describes decarburisation, which Chapter 5 uses. Building the sheet once, checking it against the numbers in this chapter, and keeping it with the furnace records is an hour well spent.

## When the simple solution applies

The error-function solution assumes three things, each worth checking:

- **A thick part.** The solution is for a "semi-infinite" solid, deep enough that the far side never notices. DS-40's √(Dt) of 0.585 mm is about 3% of its 20 mm radius, so the assumption holds. For thin sections, Chapter 1's warning applies, and a numerical solution is needed.
- **A flat surface.** On a 40 mm shaft, the curvature over a 1 mm case is slight; on a 3 mm pin, it is not, and the case is a little deeper than the flat-surface solution predicts, because the inner layers are smaller in volume.
- **A constant surface concentration and constant D.** In a real furnace, the surface carbon rises from the initial value towards the atmosphere's carbon potential over the first part of the cycle, and D varies somewhat with carbon content. Heat treaters handle both with experience, empirical charts and, increasingly, simulation software that solves Fick's second law numerically with real boundary conditions.

A fourth assumption is easily forgotten: that the part's starting carbon is uniform. Bar stock can carry a thin decarburised skin from the steel mill, a few tenths of a millimetre deep, unless that layer is machined away before carburising. DS-40's turning allowance removes it, and the drawing says so.

The error-function solution remains the right tool for understanding, estimating and checking; it is the calculation against which a furnace recipe or a simulation should make sense.

## A failure case: the wrong boundary

This is an illustration. An earlier batch of shafts similar to DS-40 was ordered from a new heat treater with a drawing note reading "carburise to 0.8 mm". The heat treater, used to measuring total case on an etched section, set a cycle that put the visible etch boundary at about 0.8 mm.

Hardness traverses on the first-article samples, carried out by the customer's inspector, showed the hardness falling below the drawing's limit at about **0.36 mm**, less than half the depth the designer intended. The detection came from the customer's traverse; the cause, from comparing what each side meant by "case depth". The error-function profile showed exactly the size of the gap: a total case of 0.8 mm, measured to near-core carbon, corresponds to an effective case of only about **0.8 × 0.6841 ÷ 1.5048 ≈ 0.36 mm**.

The correction was to revise the drawing to state an **effective** case depth of 0.7 to 1.0 mm, defined by a stated limit hardness and measured by a traverse under ISO 18203, and to scrap the batch. The design office's drawing template now requires every case depth to state its definition and limit.

## How this applies to a small Australian business

Use Fick's second law, through the error-function solution, to predict carbon profiles for a surface held at constant concentration, and to estimate furnace times from target depths. Remember that depth depends on which boundary is called the case: specify effective case depth, with its defining hardness and measurement method, on every drawing. Check that the part is thick enough and the surface flat enough for the simple solution, and use numerical methods or the heat treater's experience where it is not.

## Exercise: a richer surface

If the furnace held DS-40's surface at **0.90%** carbon instead of 0.80%, with the same 0.20% core and 0.40% effective-case boundary, what value of erfc(z) defines the case, and what is z? How deep would the effective case be after 11.7 hours, and how long would 0.8 mm take?

**Worked answer.** The boundary is at (0.40 − 0.20) ÷ (0.90 − 0.20) = **0.2857**, so erfc(z) = 0.2857 and **z ≈ 0.755**. After 11.7 hours, √(Dt) ≈ 0.585 mm, so the case is about **2 × 0.755 × 0.585 ≈ 0.88 mm**. For 0.8 mm, √(Dt) must be **0.8 ÷ (2 × 0.755) ≈ 0.530 mm**, which takes about **(0.530 × 10⁻³)² ÷ 8.115 × 10⁻¹² ≈ 34,600 s, about 9.6 hours**. A richer surface shortens the cycle, but too rich a surface forms carbides and retained austenite, which is why Chapter 4 boosts first and then diffuses.
