---
book: real-gases-by-the-numbers
chapterSlug: liquefied-gases-and-the-critical-point
order: 6
title: "Liquefied gases, vapour pressure and the critical point"
description: "Vapour pressure and Clausius–Clapeyron, liquid nitrogen in a microbulk tank, why warm liquid holds less, CO₂ cylinders that go liquid-full in summer, and a tank sized at the wrong density."
draft: false
---

Below its critical temperature, a gas can be squeezed into a liquid, and once part of it is liquid, the cylinder or tank behaves in a completely different way. Its pressure no longer tells you how much is inside: it is set by the temperature alone, and stays put until the last of the liquid boils away. Its contents can be many times what the same vessel would hold as gas. And if it is warmed with too little space left above the liquid, its pressure can rise faster than any gas cylinder's.

The shop running LN-1 meets this in two places. It is weighing up a microbulk tank of liquid nitrogen to replace the cylinder packs, and its welding bays use carbon dioxide, which is liquid in its cylinder at room temperature. This chapter sets out vapour pressure and the Clausius–Clapeyron equation, checks them against NIST's data for nitrogen, works out what a microbulk tank really holds at its working pressure, follows a carbon dioxide cylinder through an Australian summer to and past its critical point, and ends with a tank sized with the wrong density.

## Vapour pressure

When a liquid and its vapour share a closed space, molecules leave the liquid and return to it all the time. At equilibrium the two rates balance, and the pressure of the vapour is the **vapour pressure**, or saturation pressure. It depends only on the temperature. Raise the temperature and more molecules have the energy to escape, so the vapour pressure rises; draw vapour off and more liquid boils to replace it, cooling the liquid until the rates balance again.

For nitrogen, NIST gives these saturation conditions:

- **0.101 MPa**, atmospheric pressure: boils at **77.35 K**, −195.8 °C;
- **0.5 MPa**: 93.99 K;
- **1.0 MPa**: 103.75 K;
- **2.5 MPa**: 119.92 K;
- **3.0 MPa**: 123.62 K;
- the **critical point**, 3.3958 MPa and 126.192 K, where the line ends.

Above the critical temperature there is no vapour pressure, because there is no distinction between liquid and vapour to make. Nitrogen at room temperature is 162 K above its critical temperature, so no pressure will liquefy it; that is why LN-1's pack holds compressed gas, not liquid, however high it is filled. Carbon dioxide's critical temperature is 31.0 °C, so at ordinary room temperature it can be liquid, and in cylinders it is.

## The Clausius–Clapeyron equation

The slope of the vapour pressure curve follows from the first and second laws:

dp ÷ dT = L ÷ (T × Δv)

where L is the latent heat of vaporisation per kilogram and Δv is the increase in volume per kilogram from liquid to vapour. It says that the vapour pressure rises steeply where the latent heat is large and the volume change small.

The equation is exact, and NIST's data show it. For nitrogen at 1.0 MPa, NIST gives L = 152.1 kJ/kg, T = 103.75 K and densities that make Δv = 0.0227 m³/kg; the equation then gives a slope of **0.0646 MPa per kelvin**, and NIST's own saturation table changes by 0.0645 MPa per kelvin at that point.

The useful approximate form assumes the vapour is an ideal gas and the liquid's volume is negligible, and integrates to:

ln(p₂ ÷ p₁) = (L × M ÷ R) × (1 ÷ T₁ − 1 ÷ T₂)

Starting from nitrogen's normal boiling point with its latent heat there, 199.2 kJ/kg, it predicts the saturation temperature at 0.5 MPa as **94.8 K**, against NIST's 93.99, and at 2.5 MPa as **122.7 K**, against 119.92. It is good near atmospheric pressure and drifts as the critical point approaches, where the latent heat shrinks towards zero and the vapour is far from ideal: these are the same real-gas effects as in Chapter 1, in the vapour above a liquid.

```figure
type: formula
title: The Clausius–Clapeyron equation
formula: dp ÷ dT = L ÷ (T × Δv)
caption: Checked with NIST's data for nitrogen at 1.0 MPa. The integrated ideal-vapour form is a good interpolator near atmospheric pressure and drifts near the critical point.
- L | Latent heat of vaporisation, 152.1 kJ/kg
- T | Saturation temperature, 103.75 K
- Δv | Volume change, vapour minus liquid, 0.0227 m³/kg
step: dp ÷ dT = 152,100 ÷ (103.75 × 0.0227) = 64,600 Pa/K
step: NIST's saturation table: 0.0645 MPa per kelvin at 1.0 MPa
```

## LN-1 on liquid nitrogen

This is an illustration. The gas supplier offers the shop a **microbulk** tank: a vacuum-insulated vessel of **1,000 litres** that is refilled in place from a tanker, holding liquid nitrogen with gas drawn from the space above it, or liquid drawn off and vaporised in a finned ambient vaporiser, then regulated to the laser's 1.8 MPa gauge. To feed a regulator set to 1.8 MPa gauge with margin, the tank works at **2.5 MPa** absolute, so its liquid sits at nitrogen's saturation temperature at that pressure, 119.92 K, or −153.2 °C.

Here the real-fluid effect is in the liquid. Liquid nitrogen near its critical point is much less dense than at its normal boiling point, because the molecules are moving fast enough to hold each other apart:

- at **0.1 MPa**, saturated liquid: **806.1 kg/m³**;
- at **1.0 MPa**: 665.8 kg/m³;
- at **2.5 MPa**: **524.5 kg/m³**;
- at **3.0 MPa**: 463.5 kg/m³.

A tank filled to 90% with liquid at 2.5 MPa therefore holds 0.9 × 524.5 = 472.0 kg of liquid and 12.4 kg of vapour above it, **484.4 kg** in all. The same tank at 0.1 MPa would hold 725.9 kg. Working at high pressure costs a third of the tank's capacity. At LN-1's 36.0 kg an hour, 484.4 kg lasts **13.5 hours** of cutting, about two and a quarter days at six hours a day, against 5.83 hours for a cylinder pack.

```figure
type: bars
title: A 1,000 litre microbulk tank, 90% liquid, by working pressure
unit: kg
max: 800
caption: This is an illustration from NIST's saturated densities. The vapour space adds little. Higher working pressure means warmer, less dense liquid.
- 0.1 MPa, −195.8 °C | 725.9
- 0.5 MPa, −179.2 °C | 653.5
- 1.0 MPa, −169.4 °C | 603.4
- * 2.5 MPa, −153.2 °C | 484.4
```

## A litre of liquid makes a room of gas

The same densities give the expansion from liquid to gas, which matters for both supply and safety. One litre of saturated liquid nitrogen at atmospheric pressure, 0.806 kg, becomes 0.806 ÷ 1.1851 = **0.680 m³** of gas at 15 °C and atmospheric pressure, an expansion of 680 times. A litre of the warmer liquid in LN-1's tank at 2.5 MPa, 0.5245 kg, becomes **0.443 m³**.

Either way, a small volume of liquid makes a large volume of gas, and nitrogen gas gives no warning: it has no smell, and breathing it causes no discomfort, while it displaces the oxygen in a room. A 20 litre spill of liquid nitrogen at atmospheric pressure would make about 13.6 m³ of gas, enough to replace a large share of the air in a small store room or a pit. That is why cryogenic tanks are sited outdoors or in well-ventilated enclosures, why rooms that hold cryogenic liquids or large inert gas supplies are assessed for oxygen depletion, and why the supplier's siting requirements for a microbulk tank are not a formality.

## Boil-off

No insulation is perfect, and heat leaks into a cryogenic tank all the time. While gas is being drawn, that heat simply boils some of the liquid that would have been drawn anyway. When nothing is drawn, the boiling raises the pressure, and once the relief valve's setting is reached, gas is vented and lost.

At 2.5 MPa, nitrogen's latent heat is only **92.5 kJ/kg**, less than half its value at atmospheric pressure, so a given heat leak boils more liquid. This is an illustration. If the tank's heat leak were 20 watts, it would boil 20 × 86,400 ÷ 92,500 = **18.7 kg a day** with nothing drawn. Over a long weekend that could be 40 to 50 kg vented, about one and a quarter hours of cutting, lost. Suppliers state the normal evaporation rate of each tank, and that figure, not an assumed heat leak, is the one to use. The point of the illustration is the direction: high working pressure makes boil-off worse, as well as reducing capacity.

## Carbon dioxide: liquid at room temperature

Carbon dioxide's critical temperature is **31.0 °C** and its critical pressure **7.377 MPa**. Below 31.0 °C, a cylinder filled with enough carbon dioxide holds liquid with vapour above it, at the vapour pressure:

- at **0 °C**: 3.49 MPa;
- at **15 °C**: 5.09 MPa;
- at **20 °C**: 5.73 MPa;
- at **25 °C**: 6.43 MPa;
- at **30 °C**: 7.21 MPa.

Two practical rules follow. First, the gauge on a carbon dioxide cylinder reads the vapour pressure, which depends on temperature, not contents. It reads the same on a full cylinder and an almost empty one, as long as any liquid remains, and only falls when the liquid is gone and a little vapour is left. Carbon dioxide is sold and checked **by weight**: the cylinder's tare is stamped on it, and the scales give the contents. Second, drawing gas boils the liquid, which takes heat, so a cylinder in heavy use cools and its pressure falls; Chapter 5's frozen regulators are the downstream end of the same process.

## The filling ratio and the hot cylinder

As the temperature rises, the liquid expands and the vapour space shrinks, because liquid carbon dioxide's density falls sharply towards the critical point, from 927 kg/m³ at 0 °C to 821 at 15 °C, 711 at 25 °C and 593 at 30 °C. If the cylinder was filled with too much carbon dioxide for its volume, the liquid fills it completely before the critical point is reached. From then on there is no vapour to compress, and the pressure rises along the steep line of a compressed liquid, then a supercritical fluid.

The amount filled per litre of cylinder volume is the **filling ratio**, and the AS 2030 series and the filler's procedures set the limits for each gas and cylinder. This is an illustration with NIST's data for two filling densities, not a statement of any limit.

- Filled at **0.75 kg per litre**: the liquid fills the cylinder at **22.1 °C**. The pressure is then 7.17 MPa at 25 °C, **13.3 MPa at 40 °C** and **21.8 MPa at 60 °C**.
- Filled at **0.667 kg per litre**: liquid-full at **27.5 °C**; 10.6 MPa at 40 °C and 17.1 MPa at 60 °C.

A cylinder at either filling ratio in a closed vehicle in an Australian summer, where the cabin can be far hotter than the air outside, can reach several times its normal working pressure. That is what the filling ratio limits and the cylinder's pressure relief device protect against, and why cylinders of liquefied gas are kept out of hot vehicles and direct sun.

```figure
type: line
title: Pressure in a carbon dioxide cylinder by temperature and filling density
x: Temperature, °C
y: Absolute pressure, MPa
legend: 0.75 kg/L | 0.667 kg/L
ymin: 0
ymax: 24
caption: From NIST data at constant density. Both follow the vapour pressure until the liquid fills the cylinder, at 22.1 °C and 27.5 °C, then rise steeply. This is an illustration, not a filling limit.
- 0 | 3.49 | 3.49
- 15 | 5.09 | 5.09
- 20 | 5.73 | 5.73
- 25 | 7.17 | 6.43
- 30 | 9.18 | 7.55
- 40 | 13.32 | 10.63
- 50 | 17.55 | 13.84
- 60 | 21.82 | 17.10
```

## The error: a microbulk tank sized at the wrong density

This is an illustration. When the shop's production planner first compared the microbulk offer with the cylinder packs, the planner worked out the tank's contents from the density of liquid nitrogen given in a general reference table, 806 kg/m³, the value at its normal boiling point. A 1,000 litre tank at 90% would then hold about 726 kg, enough for 20 hours of cutting, and the planner proposed a delivery every three working days, 18 hours of cutting, with a margin.

The supplier's engineer, reviewing the proposal, pointed out that the tank would work at 2.5 MPa to feed the laser, and that liquid nitrogen at that pressure is at −153 °C, not −196 °C, with a density of 524.5 kg/m³. The tank's usable contents at 2.5 MPa were **484 kg**, 13.5 hours of cutting. On the planner's schedule, the tank would run dry on the afternoon of the third day, every delivery cycle, the same failure as Chapter 1's packs on a longer timescale.

The shop changed the plan to a delivery every two working days and asked the supplier for a telemetry gauge on the tank, which reports its liquid level by the weight of liquid, so that deliveries follow use rather than the calendar. The planner's spreadsheet now takes the liquid density at the tank's working pressure from NIST, not a general table, and Chapter 8 compares the two supply options on that basis.

## Exercise: weighing a carbon dioxide cylinder

A welding bay's carbon dioxide cylinder has a water capacity of 40 litres and a stamped tare of 52.0 kg. It weighs 70.5 kg on the scales at 15 °C, and its gauge reads 5.0 MPa gauge. How much carbon dioxide does it hold, what is its average filling density, and roughly what share of its volume is liquid? Would its gauge reading change if it held half as much?

**Worked answer.**

- Contents: 70.5 − 52.0 = **18.5 kg**. Average density: 18.5 ÷ 40 = **0.4625 kg per litre**, 462.5 kg/m³.
- At 15 °C, NIST's saturated densities are 821.2 kg/m³ for liquid and 160.7 kg/m³ for vapour. The liquid volume fraction f satisfies 821.2 f + 160.7 (1 − f) = 462.5, so f = (462.5 − 160.7) ÷ (821.2 − 160.7) = **0.457**: about 46% of the cylinder is liquid.
- The gauge reads the vapour pressure, 5.09 MPa absolute, about 5.0 MPa gauge, whatever the contents. With half as much, 9.25 kg, the cylinder would still hold some liquid, and the gauge would read the same.

Only the scales tell the contents of a liquefied gas cylinder.
