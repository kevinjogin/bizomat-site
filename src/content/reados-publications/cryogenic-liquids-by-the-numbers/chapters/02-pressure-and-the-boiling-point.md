---
book: cryogenic-liquids-by-the-numbers
chapterSlug: pressure-and-the-boiling-point
order: 2
title: "Pressure and the boiling point"
description: "How tank pressure sets the temperature of a stored cryogen, the Clausius–Clapeyron estimate against NIST data, why liquid from a pressurised cylinder flashes, and a regulator set too high."
draft: false
---

Chapter 1 explained that a cryogenic liquid sits at its boiling point. This chapter adds the second half of the idea: the boiling point is not fixed. It rises with the pressure above the liquid, just as water in a pressure cooker boils above 100 °C. Liquid nitrogen in SF-180's cylinder, held at 100 kPa gauge, is about six kelvins warmer than liquid nitrogen in the open bath, and it is lighter and holds less latent heat per kilogram.

That difference matters every time liquid moves from a pressurised vessel into an open one. Some of it flashes to gas the instant the pressure falls, and that gas is a loss the user pays for. This chapter finds the saturation temperature at any pressure from NIST's tables, checks the Clausius–Clapeyron estimate that the WORKOS boiling point tool uses, calculates SF-180's flash loss and ends with a regulator setting that made the cylinder vent its contents.

## Liquid and vapour in a closed vessel

In a closed vessel holding liquid and nothing else, the space above the liquid fills with its own vapour. Molecules leave the surface and return to it, and when the two rates balance, the pressure in the space is the liquid's vapour pressure at its temperature. The liquid and vapour are then saturated: at that pressure, the liquid is exactly at its boiling point, and the vapour exactly at its condensing point.

The saturation curve is a one-to-one relationship between pressure and temperature. Pick either, and the other follows. That makes a pressure gauge on a cryogenic vessel a thermometer: if the liquid is saturated, its temperature can be read off the curve from the pressure.

```figure
type: line
title: Saturation temperature of nitrogen against absolute pressure
x: Absolute pressure, kPa
y: Saturation temperature, K
ymin: 75
ymax: 106
caption: NIST Chemistry WebBook saturation data for nitrogen. SF-180's cylinder runs at 201.3 kPa absolute (100 kPa gauge) and its relief valve opens at 251.3 kPa absolute.
- 101.3 | 77.36
- 151.3 | 80.93
- 201.3 | 83.69
- 251.3 | 85.98
- 301.3 | 87.96
- 401.3 | 91.27
- 501.3 | 94.03
- 1001.3 | 103.8
```

The curve rises steeply at first and then flattens. Near atmospheric pressure, each extra 10 kPa raises the boiling point by about 0.7 K; near 1 MPa, the same 10 kPa raises it by less than 0.2 K.

## SF-180's cylinder

This is an illustration. SF-180's liquid cylinder has a pressure-building circuit: a small coil, usually wrapped around the inner vessel or mounted outside, through which liquid flows by gravity, vaporises and returns to the vapour space. A regulator opens the circuit when the pressure falls below its set point, here 100 kPa gauge, and closes it above. When liquid is drawn off, the pressure falls, the circuit opens, and the extra vapour pushes the remaining liquid out through the liquid valve.

At 100 kPa gauge, the absolute pressure at sea level is 201.3 kPa. NIST's saturation tables give, at that pressure:

```figure
type: stats
title: Saturated liquid nitrogen in SF-180's cylinder at 100 kPa gauge
caption: This is an illustration of the cylinder's set point. Properties from NIST at 201.3 kPa absolute, compared with the open bath at 101.3 kPa.
- 83.69 K | Saturation temperature | −189.46 °C, 6.3 K warmer than the bath
- 776.5 kg/m³ | Liquid density | 3.7% lighter than at 101.3 kPa
- 190.5 kJ/kg | Latent heat | 4.4% less than at 101.3 kPa
- * −108.9 kJ/kg | Liquid enthalpy | 13.1 kJ/kg more than the bath's −122.0 kJ/kg
```

The last line is the one that matters for the next section. The liquid in the cylinder carries 13.1 kJ/kg more energy than liquid at the bath's pressure can hold, because it is warmer. When it reaches the bath, that extra energy has to go somewhere.

The figure also explains why SF-180's 140 kg filled the 180 L cylinder in Chapter 1: at 776.5 kg/m³ it occupies 140 ÷ 0.7765 = 180.3 L.

## The Clausius–Clapeyron estimate

NIST's tables are the reference, but a quick estimate is often wanted when no table is to hand, or for a liquid that has no table. The integrated Clausius–Clapeyron equation gives one, from a single known point on the curve and the latent heat.

```figure
type: formula
title: Integrated Clausius–Clapeyron relation
formula: 1 ÷ T = 1 ÷ T₀ − (R ÷ (L × M)) × ln(p ÷ p₀)
formula: p_v = p₀ × exp[−(L × M ÷ R) × (1 ÷ T − 1 ÷ T₀)]
caption: The vapour is treated as an ideal gas, the liquid's volume is neglected and the latent heat is held constant. All temperatures in kelvins.
- T₀, p₀ | a known boiling point and its pressure: 77.36 K at 101.325 kPa
- L | latent heat, 199.2 kJ/kg at the known point
- M | molar mass, 28.013 g/mol; R = 8.314 J/(mol·K)
- L × M ÷ R | 671.1 K for nitrogen
```

The [boiling point and vapour pressure tool](/tools/boiling-point-at-pressure/) applies exactly this relation. From a known boiling point, its pressure, the latent heat and the molar mass, it gives the boiling temperature at an operating pressure, the vapour pressure at a stated liquid temperature, the margin between the two and the slope of the vapour-pressure curve, and it warns when the estimate is carried more than 30 K from its reference point.

This is an illustration. With −195.79 °C at 101.325 kPa, 199.2 kJ/kg, 28.013 g/mol and an operating pressure of 201.325 kPa, the tool gives a boiling point of **−189.15 °C (84.00 K)**, 0.31 K above NIST's 83.69 K. That is good enough to understand the cylinder, and the error grows with distance from the reference point: about 0.5 K at 300 kPa and 1.4 K at 1 MPa, because the real latent heat falls as the pressure rises.

```figure
type: compare
title: Clausius–Clapeyron estimate against NIST for nitrogen
cols: Absolute pressure | Estimate | NIST | Difference
caption: Estimate from 77.36 K at 101.325 kPa with a constant latent heat of 199.2 kJ/kg; NIST saturation data for comparison.
- 150 kPa | 81.02 K | 80.84 K | +0.18 K
- * 201.3 kPa (SF-180 set point) | 84.00 K | 83.69 K | +0.31 K
- 251.3 kPa (relief) | 86.40 K | 85.98 K | +0.42 K
- 500 kPa | 94.80 K | 93.99 K | +0.81 K
- 1,000 kPa | 105.1 K | 103.7 K | +1.4 K
```

The tool's vapour-pressure output answers the opposite question. At a liquid temperature of −190 °C, it gives a vapour pressure of 185.5 kPa absolute, a little below the cylinder's 201.3 kPa, and a margin of 0.85 K below boiling. Read the other way, it says the cylinder's liquid is very close to boiling at its own pressure. That is not a fault. It is the normal state of stored cryogenic liquid: saturated, with no margin, so that any fall in pressure makes some of it boil.

## Flash: the loss at every transfer

When liquid moves from the cylinder at 201.3 kPa into the bath at 101.3 kPa, its pressure falls and its boiling point falls with it, from 83.69 K to 77.36 K. The liquid cannot stay at 83.69 K in the open bath. It cools to 77.36 K by boiling part of itself, and the vapour that forms carries off the excess energy. This is flash.

The fraction that flashes follows from an energy balance. The liquid enters with the cylinder's enthalpy and leaves as a mixture of bath liquid and saturated vapour with the same total enthalpy.

```figure
type: steps
title: Flash fraction for liquid moved from 100 kPa gauge into the open bath
caption: This is an illustration. Enthalpies from NIST; the transfer is treated as adiabatic, with heat gained in the hose left to Chapter 7.
- Liquid enthalpy in the cylinder | −108.94 kJ/kg at 201.3 kPa
- Liquid enthalpy in the bath | −122.02 kJ/kg at 101.3 kPa
- Latent heat at the bath | 199.18 kJ/kg
- * Flash fraction | (−108.94 + 122.02) ÷ 199.18 = 0.0659, or 6.6% of the mass
- Per 10 L drawn | 7.765 kg drawn, 0.511 kg flashes, 7.254 kg stays: 9.00 L at 806.1 kg/m³
```

So every 10 L drawn from the cylinder delivers 9.0 L to the bath, and the other half kilogram leaves as a white plume. The flash fraction rises quickly with the cylinder pressure: 3.7% at 50 kPa gauge, 6.6% at 100, 9.0% at 150 and 11.1% at 200 kPa gauge.

```figure
type: bars
title: Mass of liquid nitrogen flashed when moved into an open bath, by cylinder pressure
unit: % of mass
max: 16
caption: Calculated from NIST saturated liquid enthalpies, adiabatic transfer to 101.325 kPa. Lower cylinder pressure means less flash, but slower transfer.
- 50 kPa gauge | 3.7
- * 100 kPa gauge (SF-180) | 6.6
- 150 kPa gauge | 9.0
- 200 kPa gauge | 11.1
- 300 kPa gauge | 14.7
```

Flash is unavoidable whenever saturated liquid passes from a higher to a lower pressure, but it can be kept small. The cylinder should run at the lowest pressure that gives an acceptable transfer rate; liquid for an open bath should come from a low-pressure vessel, not a high-pressure one; and where liquid is used at atmospheric pressure in quantity, a phase separator or a small intermediate dewar lets the flash happen once, at one place, where the gas can be vented safely.

## When the gauge is not a thermometer

Reading the liquid's temperature from the pressure assumes the liquid and vapour are in equilibrium throughout. A real vessel is rarely that tidy. Heat leaks in through the walls, warms the liquid next to them, and the warmed liquid, being lighter, rises along the wall to the surface. Over hours a stored cryogen stratifies: a warm layer forms at the top, close to saturation at the vessel's pressure, while the bulk below stays colder than the pressure suggests. The pressure follows the surface layer, because that is where liquid and vapour meet, so the gauge reports the warmest liquid in the vessel, not the average.

Stratification makes two things happen that surprise users. First, a stratified vessel's pressure rises faster than a calculation that assumes well-mixed contents would predict, because only the thin top layer is being warmed towards the relief pressure. Chapter 8 uses the well-mixed calculation as an upper bound on the time to relief for exactly this reason. Second, if the vessel is jolted or its contents are disturbed, for example when it is moved on a trolley or when a large withdrawal starts, the warm top layer mixes into the colder bulk and the pressure can drop suddenly. The opposite happens when a vessel is vented quickly: the pressure falls below the saturation pressure of the warm layer, the layer boils vigorously, and the vessel can spit liquid through its vent.

## Venting down before a transfer

Many liquid cylinders have a gas-use valve that draws vapour from the top of the vessel. Opening it slowly lowers the pressure, and the liquid boils until it reaches the saturation temperature at the new pressure. That costs nitrogen, but it is nitrogen that would have flashed anyway when the liquid reached the open bath, and venting it at the cylinder, through a vent line to outside, puts the cold gas somewhere safer than the bath's rim.

The energy balance is the same as for flash. Lowering SF-180's cylinder from 100 kPa gauge to 50 kPa gauge would boil off (−108.94 + 114.72) ÷ 194.4 = 3.0% of the contents, about 4.2 kg from a full cylinder, and leave the liquid at 80.93 K. A transfer from 50 kPa gauge then flashes only 3.7% at the bath. The total nitrogen lost is about the same; what changes is where the gas goes and how quickly the bath fills, because the lower driving pressure slows the transfer. Venting down is worth doing when the cylinder has built up pressure after standing, when a quiet transfer matters more than a fast one, or when the bath is in a small room and the vent can be piped outside.

## Gauge, absolute and altitude

Pressure gauges on cryogenic vessels read gauge pressure, the pressure above atmospheric. The saturation curve, the Clausius–Clapeyron equation and every NIST table use absolute pressure. Adding the local atmospheric pressure converts one to the other, and the local atmospheric pressure is not always 101.3 kPa. At 600 m above sea level, for example, standard atmospheric pressure is about 94 kPa. An open bath there boils a little below 77.36 K, and a cylinder at 100 kPa gauge sits at about 194 kPa absolute, not 201.

A simple check catches most errors. If a calculation gives a liquid nitrogen temperature below −196 °C for anything other than a deliberately evacuated vessel, a gauge pressure has been used as if it were absolute. Entering 100 kPa into the boiling point tool as the operating pressure, for instance, gives −195.9 °C, colder than an open bath, which cannot be true of a pressurised cylinder.

## The error: a regulator set above the relief valve

This is an illustration. Transfers to SF-180's bath were slow when the cylinder was full and the hose cold, and a fitter turned the pressure-building regulator up to 200 kPa gauge to speed them up. The next morning the cylinder was frosted around its top, the relief valve was hissing and the contents had dropped by far more than the station's normal use.

The cause was the regulator setting. At 200 kPa gauge, the cylinder wanted to be at 301.3 kPa absolute, but its relief valve opens at 150 kPa gauge. The pressure-building circuit kept vaporising liquid to raise the pressure, and the relief valve kept venting it, so the cylinder converted its contents to gas continuously and threw the gas away. Even where a relief valve does not intervene, a higher operating pressure costs nitrogen: the flash at the bath would have risen from 6.6% to 11.1% of every transfer, and the liquid delivered would have been warmer.

The supervisor found it by comparing the regulator's setting with the relief valve's, which the maker's data plate gives. The fix was to return the regulator to 100 kPa gauge and to speed transfers by cooling the hose first (Chapter 7) rather than by raising the pressure. The station's procedure now records both settings, and the regulator is locked.

## Exercise: liquid at the relief pressure

Suppose a cylinder has stood unused until its pressure reached the relief setting of 150 kPa gauge (251.3 kPa absolute). Using NIST's values below, find the saturation temperature, the flash fraction when 10 L of its liquid is run into the open bath, and the litres that arrive. Then check the temperature with the Clausius–Clapeyron relation.

NIST values at 251.3 kPa: saturation temperature 85.98 K; liquid density 765.3 kg/m³; liquid enthalpy −104.08 kJ/kg. At 101.3 kPa: liquid enthalpy −122.02 kJ/kg, latent heat 199.18 kJ/kg, liquid density 806.08 kg/m³.

**Worked answer.** This is an illustration. The liquid is at **85.98 K (−187.17 °C)**. The flash fraction is (−104.08 + 122.02) ÷ 199.18 = **0.090, or 9.0%**. Ten litres weighs 7.653 kg, of which 0.689 kg flashes and 6.964 kg stays, which is 6.964 ÷ 0.806 = **8.64 L** in the bath. The Clausius–Clapeyron relation gives 1 ÷ T = 1 ÷ 77.355 − ln(251.3 ÷ 101.325) ÷ 671.1, so T = **86.40 K**, 0.42 K above NIST, which the boiling point tool reproduces. A cylinder that has been left to build up pressure delivers about 4% less liquid per transfer than one at its normal set point, which is one more reason to draw from cylinders regularly or to vent them to their set point through the gas-use valve before a transfer.
