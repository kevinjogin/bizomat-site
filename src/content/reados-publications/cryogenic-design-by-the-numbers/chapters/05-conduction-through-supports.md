---
book: cryogenic-design-by-the-numbers
chapterSlug: conduction-through-supports
order: 5
title: "Conduction through supports"
description: "Size a support from its conductivity integral, use a mean conductivity in the layered wall tool, follow the temperature along a strut, compare materials and intercepts, and a cold-end error."
draft: false
---

A cold mass has to be held in place, and whatever holds it connects it to the warm vessel. Every support is therefore a heat leak, and the art of supporting a cold mass is to carry the loads, stiffly enough for the job, through as little heat-conducting material as possible. Long, thin, low-conductivity parts do it best; short, fat, metal ones worst.

This chapter calculates the heat that CT-40's three G-10 support tubes conduct, from the conductivity integral of Chapter 4, and shows how to get the same answer from the BIZOMAT layered wall tool by giving it the right mean conductivity. It follows the temperature along a support, compares other materials and shapes, explains thermal intercepts, and ends with an estimate that used the conductivity at the cold end and came out at less than half the real leak.

## Heat through a support

For a support of uniform cross-section A and length L, running from a warm end at T_h to a cold end at T_c, Fourier's law with a conductivity that varies with temperature integrates exactly:

```figure
type: formula
title: Heat conducted by a support of uniform section
formula: Q = (A ÷ L) × ∫ k(T) dT, from T_c to T_h
formula: k_mean = [∫ k(T) dT] ÷ (T_h − T_c)
caption: Exact for steady one-dimensional conduction. The integral depends only on the material and the two end temperatures; the shape enters only through A ÷ L.
- A ÷ L | shape factor, m
- ∫ k dT | conductivity integral, W/m, from NIST's fits
- k_mean | the value a constant-conductivity tool needs
```

This is an illustration. Each of CT-40's G-10 tubes is 25 mm in outside diameter with a 2 mm wall, so its area is π ÷ 4 × (25² − 21²) = 144.5 mm². It is 150 mm long, giving a shape factor of 144.5 × 10⁻⁶ ÷ 0.15 = 9.63 × 10⁻⁴ m. The tubes are made with the glass fibres along their length, and NIST's fit for G-10 along the fibres gives a conductivity integral of 149.6 W/m between 40 K and 293.15 K.

```figure
type: steps
title: Heat conducted by CT-40's three G-10 support tubes
caption: This is an illustration. NIST's fit for G-10 CR along the warp direction, integrated from 40 K to 293.15 K.
- Area of one tube | π ÷ 4 × (25² − 21²) = 144.5 mm²
- Shape factor | 144.5 × 10⁻⁶ ÷ 0.150 = 9.63 × 10⁻⁴ m
- Heat through one tube | 149.6 × 9.63 × 10⁻⁴ = 0.144 W
- * Three tubes | 0.433 W
- Mean conductivity | 149.6 ÷ 253.15 = 0.591 W/(m·K)
```

Less than half a watt carries an 18.6 kg cold mass, about 1.4% of the cooler's 30 W at 40 K. It is worth noticing what the calculation did not need: the temperature profile along the tube, the conductivity at any one temperature or any assumption about how the heat spreads. The conductivity integral between the two end temperatures carries all of that, which is why cryogenic designers tabulate integrals rather than conductivities, and why a heat budget can be built from a short table and a ruler.

## The same answer from the layered wall tool

The [layered wall heat flow tool](/tools/wall-heat-loss/) calculates steady one-dimensional conduction through up to three flat layers with constant conductivities and optional surface film coefficients. A support is one layer, with the support's length as the thickness and its cross-section as the area, and no film coefficients, because its ends are bolted to the vessel and the plate.

This is an illustration. With a hot side of 20 °C, a cold side of −233.15 °C, an area of 3 × 144.5 mm² = 0.0004335 m², no films, and one layer 150 mm thick at the mean conductivity of 0.591 W/(m·K), the tool gives a heat flow of **0.433 W**, matching the integral. The tool's touch-temperature check is meaningless here and can be ignored; its overall coefficient and its interface temperatures, with one layer, simply restate the input.

## The temperature along a support

Because G-10 conducts better when warm than when cold, the temperature along a support is not a straight line. The same heat flows through every section, so where the conductivity is low the temperature gradient must be steep. Most of the temperature drop happens near the cold end.

```figure
type: line
title: Temperature along one of CT-40's G-10 support tubes
x: Distance from the cold end, mm
y: Temperature, K
ymin: 30
ymax: 300
caption: This is an illustration. Found by locating the points where the conductivity integral from 40 K reaches a quarter, a half and three-quarters of its total, using NIST's fit for G-10 along the fibres.
- 0 | 40
- 37.5 | 132
- 75 | 195
- 112.5 | 247
- 150 | 293
```

A quarter of the way from the plate, the tube is already at 132 K. That profile matters in two places. It sets how much the support shortens as it cools, which Chapter 3 found to be about 0.17 mm, about half of what a fully cold tube would shrink. And it shows where a thermal intercept would have to go.

## Materials and shapes compared

The same shape factor multiplies every material's integral, so comparisons are quick.

```figure
type: bars
title: Heat conducted by three 25 × 2 mm support tubes, 150 mm long, 293 K to 40 K
unit: W
max: 9
caption: This is an illustration. Conductivity integrals from NIST's fits multiplied by CT-40's shape factor of 3 × 9.63 × 10⁻⁴ m. Strength, stiffness and buckling have to be checked separately for each material.
- 304 stainless steel | 8.21
- Ti-6Al-4V | 3.65
- * G-10 along the fibres | 0.433
```

Stainless steel tubes of the same size would leak 8.2 W, more than a quarter of the cooler's capacity at 40 K. G-10 is the obvious choice for CT-40, whose loads are small. For heavier cold masses, where G-10 tubes would have to be very thick, titanium alloy rods or thin-walled stainless steel tubes are used, and the comparison becomes the strength-per-watt one of Chapter 4.

Within one material, the shape factor is the only lever. Thinning the wall from 2.0 to 1.5 mm cuts the area to 110.7 mm² and the leak to 0.331 W; lengthening the tubes to 200 mm cuts it to 0.324 W. Both trade stiffness for heat, and both are limited by the cryostat's height and by how far the cold mass may sag or swing.

## Loads, stiffness and the vacuum

The tubes hang the plate from the top flange, so in normal use they are in tension. This is an illustration. The cold mass weighs 18.64 × 9.81 = 183 N, or 61 N per tube, a stress of only 0.42 MPa in 144.5 mm². Even a transport shock of five times gravity gives 2.1 MPa. The tubes are sized not by strength but by stiffness and by the forces that the cryostat must survive in handling and when the coil's magnetic forces act on the plate, which Chapter 10 discusses. The bonded or bolted end fittings, not the tube wall, are usually the weak point, and they are checked at both room temperature and the operating temperature, because their bond lines see the contraction mismatches of Chapter 3.

All of this assumes a good vacuum. Gas left in the vacuum space conducts heat from the vessel wall to every cold surface, by a mechanism that depends on pressure, and it adds directly to the heat budget. Vacuum by the Numbers explains how [mean free path and flow regimes](/reados/publications/vacuum-by-the-numbers/mean-free-path-and-flow-regimes/) set when gas conduction becomes independent of the gap; for a cryostat, the practical rule is to keep the insulating vacuum well below the pressure at which gas conduction matters, and to measure it.

## Every link is a support

The supports are the obvious mechanical connection between warm and cold, but they are not the only one. Anything that touches both the vessel and the cold mass conducts heat by the same law: a pumping or instrumentation tube that reaches the plate, a push rod for a position sensor, a bracket holding a field probe, a radiation baffle bolted to both. Each needs its own shape factor and conductivity integral in the heat budget, and each is a candidate for the same cures: a low-conductivity material, a small section, a long path, and a clamp to an intercept where one exists.

This is an illustration. CT-40's coil position sensor is read through a thin 304 stainless steel push rod, 3 mm in diameter and 200 mm long, running from a warm micrometer to the plate. Its shape factor is π × 1.5² × 10⁻⁶ ÷ 0.2 = 3.53 × 10⁻⁵ m, and with stainless steel's integral of 2,839 W/m it conducts 0.10 W, a quarter of all three supports. The laboratory replaced it with a G-10 rod of the same size, conducting 0.005 W, after the budget in Chapter 9 showed it.

## End fittings and joints

A G-10 tube cannot simply be bolted to a copper plate. Its ends carry bonded or pinned metal fittings, usually stainless steel or titanium, which must stay attached through every cooldown despite the contraction mismatch between laminate and metal. Along the fibres, Chapter 3's numbers are kind: G-10 shrinks 0.23% and stainless steel 0.30% between room temperature and 40 K, so a short bonded joint sees a small mismatch. Across the fibres, G-10 shrinks 0.69%, so a G-10 tube inside a metal sleeve pulls away from it radially as it cools, while a metal plug inside a G-10 tube is gripped harder. Fittings are designed so that the cold contraction tightens, not loosens, the joint: plugs inside tubes rather than sleeves outside them, with pins as a mechanical backup to any adhesive.

The fittings also carry heat, but they are short and are at the ends, where they add little resistance; they are left out of the support's shape factor.

## Measuring a support's heat leak

The heat through a support cannot be measured directly with any accuracy in a working cryostat, but it can be checked in two ways. The first is a bench test before installation: hold one end at 77 K in liquid nitrogen, the other at room temperature with a small heater and thermometer, and measure the heat needed to hold the warm end steady with the room cut off by insulation. The second is the cryostat's own balance: with the cooler's capacity curve known, the plate's settled temperature gives the total heat load, and removing or changing one component at a time shows its share. CT-40's laboratory uses the second method in Chapter 9, and it is how the push rod above was found.

## Thermal intercepts

Many cryostats have a second, intermediate temperature: a radiation shield cooled to about 50 to 80 K by the first stage of a two-stage cryocooler or by liquid nitrogen. Supports are then clamped to that shield partway along their length, so that most of their heat goes to the intermediate stage, where a watt is cheap, rather than to the cold stage.

This is an illustration. If CT-40 had a 77 K intercept at the middle of each G-10 tube, the cold half would carry the integral from 40 K to 77 K, only 12.3 W/m, through half the length. Each tube's load on the cold plate would fall to 12.3 × 144.5 × 10⁻⁶ ÷ 0.075 = 0.024 W, a sixth of the 0.144 W without the intercept, while the intercept took 0.265 W. With a single-stage cooler, CT-40 has nowhere to put an intercept, which is one reason its other heat leaks, in Chapters 7 and 8, matter so much.

## The error: the conductivity at the cold end

This is an illustration. The first heat budget for CT-40's supports took G-10's conductivity from a data sheet at "cryogenic temperature", 0.274 W/(m·K) at 40 K, and multiplied it by the shape factor and the full 253 K difference. It gave 3 × 0.274 × 9.63 × 10⁻⁴ × 253.15 = **0.200 W** for the three tubes. When CT-40 was commissioned, the cooler settled at a temperature that implied a total heat load larger than the budget by a little over a watt, and the multilayer insulation was blamed first.

The supports were part of the answer. Most of each tube is far warmer than 40 K and conducts much better there, so the conductivity at the cold end understates the leak. The integral gives 0.433 W, more than twice as much: the cold-end estimate was 54% low. (The opposite mistake, using the room-temperature conductivity of 0.851 W/(m·K), gives 0.623 W, 44% high.) The engineer found it by redoing the calculation with the integral, which closed part of the gap; Chapter 9 accounts for the rest. The laboratory's rule now is that every conduction path in a heat budget uses a conductivity integral or a mean value from one, never a conductivity at one temperature.

## Exercise: titanium rods instead

A heavier coil needs stiffer supports, and the designer considers three solid Ti-6Al-4V rods, 8 mm in diameter and 150 mm long, in place of the G-10 tubes. NIST's fit gives Ti-6Al-4V a conductivity integral of 1,264 W/m between 40 K and 293.15 K. Find the heat conducted, the mean conductivity to enter in the layered wall tool, and the effect on CT-40's 30 W budget.

**Worked answer.** This is an illustration. Each rod's area is π × 4² = 50.3 mm², so its shape factor is 50.3 × 10⁻⁶ ÷ 0.15 = 3.35 × 10⁻⁴ m, and it conducts 1,264 × 3.35 × 10⁻⁴ = 0.424 W. Three rods conduct **1.27 W**, nearly three times the G-10 tubes' 0.433 W, using 4.2% of the cooler's capacity instead of 1.4%. The mean conductivity is 1,264 ÷ 253.15 = **4.99 W/(m·K)**; the layered wall tool with 0.000151 m², 150 mm and that value gives 1.27 W. The extra 0.84 W would raise the cold head's balance temperature by about 0.4 K on CT-40's curve, which is acceptable if the stiffness is needed.
