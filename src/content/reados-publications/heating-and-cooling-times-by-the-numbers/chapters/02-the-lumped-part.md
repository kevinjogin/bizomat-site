---
book: heating-and-cooling-times-by-the-numbers
chapterSlug: the-lumped-part
order: 2
title: "The lumped part: when one temperature is enough"
description: "The lumped model treats a part as one temperature with a time constant. It is applied to DS-100's coupon and flange, with radiation stepped by hand, and shown failing in the quench."
draft: false
---

The simplest heating model treats a part as if it had a single temperature throughout, like a well-stirred pot of water. Heat crosses the surface at a rate set by the surface coefficient and the temperature difference, and all of it goes into raising that one temperature. The model is called **lumped** because it lumps the whole part's heat capacity into one number. It is quick, it gives a clear time constant, and for thin or small parts in gentle surroundings it is accurate. It is also the model most often stretched past its limits, because it is so easy to use.

This chapter sets out the lumped model, applies it to DS-100's test coupon and flange in the furnace, shows how to handle radiation, which does not fit a constant coefficient, by stepping the calculation in a table, and ends with the case where the model fails badly: DS-100's body in the oil quench.

## The energy balance

Take a part of volume V, surface area A, density ρ and specific heat c, at a uniform temperature T, in surroundings at T∞ with a surface coefficient h. In a short time dt, the heat crossing the surface is h × A × (T∞ − T) × dt, and it raises the part's temperature by dT, storing ρ × c × V × dT. Setting the two equal and integrating from the starting temperature Tᵢ gives:

(T − T∞) ÷ (Tᵢ − T∞) = exp(−t ÷ τ),   with τ = ρ × c × V ÷ (h × A)

The **time constant** τ is the time for the difference between part and surroundings to fall to 1/e, about 37 %, of its starting value. After two time constants it is about 13.5 %, after three about 5 %, after five under 1 %. The time to reach any target follows directly: t = τ × ln[(Tᵢ − T∞) ÷ (T − T∞)].

The time constant has a clear meaning. It is the part's heat capacity, ρ × c × V, multiplied by its surface resistance, 1 ÷ (h × A), just as an electrical time constant is a capacitance times a resistance. Doubling the part's mass, or halving its surface coefficient, doubles the time. The ratio V ÷ A, the characteristic length of Chapter 1, carries all the information about shape: half the thickness for a plate heated on both faces, half the radius for a long cylinder, a third of the radius for a sphere.

```figure
type: formula
title: The lumped model and its time constant
formula: (T − T∞) ÷ (Tᵢ − T∞) = e^(−t ÷ τ),   τ = ρ × c × V ÷ (h × A),   t = τ × ln[(Tᵢ − T∞) ÷ (T − T∞)]
caption: This is an illustration for DS-100's test coupon, a 25 mm bar, in the furnace at 850 °C with a constant effective h of 150 W/m²·K.
- V ÷ A | 0.0125 ÷ 2 = 0.00625 m for a long 25 mm bar
- ρ × c | 7,850 × 650 ≈ 5.10 MJ/m³·K
- τ | 5.10 × 10⁶ × 0.00625 ÷ 150 ≈ 213 s
step: From 20 °C to 840 °C: ln(830 ÷ 10) ≈ 4.42
step: t ≈ 213 × 4.42 ≈ 940 s, about 15.7 minutes
```

## When the model is good enough

The lumped model assumes the inside resistance is negligible, so its error grows with the Biot number. With the Biot number based on volume over area below about 0.1, the temperature difference inside the part is small compared with the difference across the surface, and lumped times are typically within a few per cent of the full solution. For DS-100's parts:

- the 25 mm coupon has Bi ≈ 0.028 on volume over area: lumped is excellent;
- the 40 mm flange has Bi ≈ 0.091: lumped is good, giving about 50.1 minutes against the one-term plate solution's 51.8;
- the 100 mm body has Bi ≈ 0.114: lumped gives about 62.6 minutes against the one-term cylinder's 67.1, about 7 % short.

The pattern is typical. Below the threshold the lumped model is excellent; just above it, the error is a few per cent and always in the same direction: the lumped model underestimates the time the centre takes, because it assumes the centre keeps up with the surface. That is the unsafe direction for a heating time, which is why the one-term solutions of the next two chapters are used for the body.

## Radiation does not have a constant coefficient

In an electric furnace at 850 °C, most of the heat reaching a part arrives by radiation from the walls and elements. Radiation exchange depends on the fourth power of absolute temperature, so it can be written with an equivalent coefficient:

h_rad = ε × σ × (T_s² + T_f²) × (T_s + T_f)

with both temperatures in kelvin, ε the part's emissivity and σ the Stefan-Boltzmann constant, 5.670 × 10⁻⁸ W/m²·K⁴. For oxidised steel with ε ≈ 0.8 in a furnace whose walls are at 850 °C, h_rad is about 87 W/m²·K when the part's surface is at 20 °C, about 140 at 400 °C, about 183 at 600 °C and about 240 at 800 °C. The coefficient rises as the part heats, and so the lumped exponential, which assumes a constant h, is only an approximation.

The fix is to step the calculation. Divide the heating into short intervals, work out h_rad at the current temperature, add a small convection coefficient (10 W/m²·K is assumed here for the furnace's still atmosphere), and raise the temperature by h × A × (T_f − T) × Δt ÷ (ρ × c × V). A spreadsheet with one row per half-second, or a few lines of code, does this in moments. Done for the coupon, it gives a very different curve from the constant-h exponential.

```figure
type: line
title: DS-100's test coupon heating in the furnace, stepped with radiation
x: Time in the furnace, min
y: Coupon temperature, °C
legend: Radiation + convection, stepped
ymin: 0
ymax: 900
caption: This is an illustration of a lumped 25 mm bar with ε = 0.8, furnace walls and atmosphere at 850 °C and a convection coefficient of 10 W/m²·K, stepped every 0.5 s. The coupon reaches 840 °C after about 11.6 minutes.
- 0 | 20
- 2 | 310
- 4 | 551
- 6 | 711
- 8 | 793
- 10 | 828
- 12 | 842
- 14 | 847
- 16 | 849
```

The stepped coupon reaches 840 °C after about **11.6 minutes**, not the 15.7 minutes that a constant 150 W/m²·K gave. Two things account for the difference. The coupon is hung on top of the load, where it sees the furnace walls freely, so its full emissivity of 0.8 applies; and the radiation coefficient rises as it heats, so in the last few degrees, where the exponential approach is slowest, its effective coefficient is about 260 W/m²·K, not 150. The constant 150 W/m²·K used for DS-100's body was chosen to match the stepped and finite-difference results for a body partly shaded by its neighbours in a loaded furnace, as Chapter 8 explains, so it is a fair average for the body but not for a small, exposed part. A single constant coefficient is only valid for the part, the position and the cycle it was derived for.

## Reading a time constant from a test

The time constant can also be measured, and a measured value is worth more than any assumed coefficient. Put a thermocouple in the part, put the part in the furnace or oven, and log its temperature. Then work out the natural logarithm of (T∞ − T) at each reading and plot it against time. If the lumped model holds, the points fall on a straight line, and its slope is −1/τ. A line that curves, steepening as the part heats, says that the coefficient is rising, as radiation's does; a line that starts flat and then steepens says the centre lagged the surface at first, and the Biot number is too large for the lumped model.

This is an illustration. Logged at the coupon's centre, the stepped readings above give (850 − T) of 540 K at 2 minutes and 57 K at 10 minutes. The slope between them is ln(540 ÷ 57) ÷ 8 minutes ≈ 2.25 ÷ 8 ≈ 0.281 per minute, a time constant of about 3.6 minutes, against the 3.5 minutes the constant 150 W/m²·K would give. Between 8 and 12 minutes, with (850 − T) falling from 57 K to 8 K, the slope is steeper, about 0.49 per minute, a time constant of about 2.0 minutes, which is the radiation coefficient's rise showing up in the data. A test like this, repeated in the furnace position a part will actually occupy, is the most reliable way to set an effective coefficient for a calculation.

## Energy: how much heat the part takes

The lumped view also gives the energy a part absorbs, which matters for furnace loading and cost. The heat stored between two temperatures is simply ρ × c × V × ΔT, or mass × c × ΔT. For DS-100, with the assumed mean specific heat of 650 J/kg·K from 20 °C to 850 °C:

- the 30.8 kg body stores about 30.8 × 650 × 830 ≈ 16.6 MJ, about 4.62 kWh;
- the 11.9 kg flange stores about 6.42 MJ.

So one shaft takes about 23 MJ, and a furnace load of six shafts nearly 140 MJ before any losses. Chapter 10 builds those figures into a furnace cycle. The lumped model gives the energy correctly whatever the Biot number, because energy depends only on the average temperature, not on how the temperature is distributed. That is worth remembering: the lumped model can be poor for the centre temperature and still right for the energy.

## Two lumps

Some problems have two masses at different temperatures that exchange heat, such as a part sitting on a heavy fixture, or a thermocouple sheath inside a part. Each can be treated as a lump if its own Biot number is small, with one energy balance for each and a coupling term between them. The result is two time constants, a fast one and a slow one, and the slower lump lags the faster. DS-100's furnace basket is an example: about 60 kg of heat-resisting steel bars that heat with the shafts and shade their undersides. Its heating takes energy and slows the shafts slightly, and Chapter 10 includes it in the load.

## The failure case: lumping the quench

This is an illustration. After the furnace, DS-100 is quenched in oil at 60 °C. The shop's question was how long the shaft had to stay in the oil before its centre fell below 300 °C, after which it could be lifted out to drain without the centre reheating the surface too far. A planner used the lumped model with an assumed effective quench coefficient of 1,000 W/m²·K, a figure the quench's supplier had suggested for first estimates. The lumped calculation was:

- τ = 7,850 × 650 × 0.025 ÷ 1,000 ≈ 128 s;
- t = 128 × ln[(850 − 60) ÷ (300 − 60)] ≈ 128 × 1.19 ≈ **152 s**.

Two and a half minutes was written into the procedure. But in the quench the Biot number, based on the radius, is 1,000 × 0.05 ÷ 33 ≈ **1.52**, fifteen times the lumped limit. The one-term cylinder solution of Chapter 4 says the centre takes about **260 s** to fall to 300 °C. At 152 s, when the lumped model said the whole shaft was at 300 °C, the centre was still at about **497 °C** and the surface at about 293 °C.

```figure
type: compare
title: DS-100's body in the oil quench at 152 s, two models
cols: Lumped model | One-term cylinder solution
caption: This is an illustration with oil at 60 °C and an assumed effective coefficient of 1,000 W/m²·K, Bi ≈ 1.52. The lumped model gives the right average but the wrong centre; lifting the shaft at 152 s would leave a 497 °C core.
- Biot number used | 0.76 (volume ÷ area) | 1.52 (radius)
- Centre at 152 s | 300 °C (assumed uniform) | 497 °C
- Surface at 152 s | 300 °C (assumed uniform) | 293 °C
- *Time for the centre to reach 300 °C | 152 s | 260 s
```

The error was found on the first trial quench, where a thermocouple in a scrap body showed the centre still glowing dull red when the procedure said to lift. The lumped model had not made an arithmetic mistake: it gave the correct **average** temperature at 152 s. It gave the wrong **centre** temperature because its central assumption, a uniform temperature, fails when the Biot number exceeds about 0.1. The correction was to recalculate with the cylinder solution, check it against the thermocouple, and add a margin for the uncertain quench coefficient, which Chapter 8 discusses. The quench coefficient itself is far from constant, and the 1,000 W/m²·K figure is only an assumption for this illustration; the shape of the lesson does not depend on it.

## Thermocouples are lumps too

A thermocouple junction or a small sheathed thermocouple is almost always a lumped body, and its time constant decides how faithfully it follows a changing temperature. A thermocouple with a time constant of several seconds, used to log a quench that changes hundreds of degrees in a minute, will lag and round off the curve. Chapter 9 returns to this when it proves a furnace cycle, and [Furnaces and radiation](/reados/publications/industrial-electric-heating-by-the-numbers/furnaces-and-radiation/) in *Industrial Electric Heating by the Numbers* discusses measuring furnace temperature; for now, the point is that the same equation that describes the coupon describes the sensor, and that a sensor's time constant should be much shorter than the changes it is meant to follow.

## How this applies to a small Australian business

The lumped model is the right first tool for thin sheet, wire, small fasteners, food in thin trays and thermocouples, and it is often good enough for plates and bars in air ovens. Its time constant is a useful single number to put on a process sheet: a part that needs five time constants to be within 1 % of the oven temperature, and whose time constant is 10 minutes, needs about 50 minutes. Before using it, calculate the Biot number on volume over area. Above about 0.1, use the one-term solutions; above about 1, the lumped model can be badly wrong for the centre, as the quench showed. Where radiation dominates, as in most furnaces above about 500 °C, step the calculation in a spreadsheet rather than choosing a single coefficient.

## Exercise: the flange alone

DS-100's flange is a disc 220 mm in diameter and 40 mm thick. Treat it as a plate heated on both faces, ignoring its rim and its join to the body. Using h = 150 W/m²·K and the book's properties, find its volume-over-area Biot number, its time constant and the lumped time to reach 840 °C from 20 °C in the 850 °C furnace. Then estimate the error compared with the one-term plate solution's 51.8 minutes, and say whether the flange or the body will be ready first.

**Worked answer.** For a plate heated on both faces, V ÷ A is the half-thickness, 0.02 m, so Bi = 150 × 0.02 ÷ 33 ≈ **0.091**, just inside the lumped limit. The time constant is 7,850 × 650 × 0.02 ÷ 150 ≈ 680 s, about **11.3 minutes**. The lumped time to reach 840 °C is 11.3 × ln(830 ÷ 10) ≈ 11.3 × 4.42 ≈ **50.1 minutes**.

Against the one-term solution's 51.8 minutes, the lumped estimate is about 1.7 minutes, or about 3 %, short, as expected just under the threshold. Either way, the flange is ready well before the body's 67 minutes, so the body sets the heating time for the whole shaft. The flange's rim, which is heated from three sides, will be readier still, and the junction between flange and body, which is heated from fewer directions, will be the last place to arrive; Chapter 6 deals with that.
