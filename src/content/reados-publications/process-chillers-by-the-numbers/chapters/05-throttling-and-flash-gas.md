---
book: process-chillers-by-the-numbers
chapterSlug: throttling-and-flash-gas
order: 5
title: "Throttling and flash gas"
description: "Why an expansion valve keeps enthalpy constant, the Joule–Thomson effect, CH-30's 27% flash gas, what subcooling is worth, and a blocked filter-drier."
draft: false
---

The expansion valve is the simplest part of a refrigeration circuit and the one that throws away the most. It takes warm liquid at the condensing pressure and lets it fall to the evaporating pressure through a narrow opening, with no work recovered. As the pressure falls, part of the liquid boils instantly, cooling the rest to the evaporating temperature. That vapour, the **flash gas**, has done no useful cooling, but the compressor must still pump it round. How much flashes, and what it costs, follow from one thermodynamic fact: a throttling process keeps enthalpy constant.

This chapter shows why throttling is isenthalpic, connects it with the Joule–Thomson effect using NIST's data, calculates CH-30's flash gas by mass and by volume, works out what subcooling is worth, describes where liquid can flash before it reaches the valve, and ends with a blocked filter-drier that flashed CH-30's liquid in the wrong place.

## Throttling keeps enthalpy constant

Consider a fluid flowing steadily through a valve, a porous plug or any restriction, with no heat exchanged with the surroundings and no work done by moving parts. The first law of thermodynamics for steady flow says that the energy carried in equals the energy carried out. The energy carried by each kilogram of flowing fluid is its enthalpy, which includes both its internal energy and the work done pushing it along, plus its kinetic and potential energy. With the velocities and heights much the same before and after, the result is:

h_in = h_out

A throttling process is **isenthalpic**. It is also irreversible: the pressure drop is spent in friction and turbulence, and entropy rises. That irreversibility is a real loss, and a turbine or expander in place of the valve could, in principle, recover some work from the fall in pressure. In small and medium systems the work available is too little to be worth the machinery, and a valve is used.

## The Joule–Thomson effect

What a throttle does to temperature depends on the fluid. For an **ideal gas**, enthalpy depends only on temperature, so constant enthalpy means constant temperature: an ideal gas throttled from one pressure to another comes out at the temperature it went in. Real gases change temperature slightly, because the forces between their molecules do work as they move apart. The rate of change is the **Joule–Thomson coefficient**, the temperature change per unit pressure drop at constant enthalpy.

NIST gives the coefficient for:

- **nitrogen** at 20 °C and atmospheric pressure: about **2.2 K per MPa**, so air throttled from 0.7 MPa to atmospheric pressure in a compressed-air system cools by roughly 1 to 1.5 K;
- **R-134a vapour** at 7 °C and 0.31 MPa, CH-30's compressor inlet: about **29.5 K per MPa**, more than ten times nitrogen's, because R-134a's vapour is far from ideal at those conditions.

The Joule–Thomson effect in gases is what large-scale air liquefaction exploits, by throttling cold compressed gas repeatedly. In a refrigeration cycle, the throttle works on a liquid at its boiling point, and something much more dramatic happens than a Joule–Thomson cooling of a few kelvin: the liquid boils.

## CH-30's flash gas

This is an illustration. CH-30's liquid reaches the expansion valve at 40 °C with an enthalpy of 108.27 kJ/kg. After the valve, at 0.31462 MPa, its enthalpy is unchanged, but the saturated liquid at 2 °C has an enthalpy of only 54.55 kJ/kg and the saturated vapour 251.62 kJ/kg. The mixture's enthalpy lies between them, and its vapour fraction, the **quality**, is:

x = (h₃ − h_f) ÷ (h_g − h_f) = (108.27 − 54.55) ÷ (251.62 − 54.55) = **0.273**

So **27.3%** of the refrigerant by mass is vapour before it reaches the evaporator. That vapour was produced by the liquid's own heat: as the pressure fell, the liquid at 40 °C was far above its new boiling point of 2 °C, and part of it boiled, taking its latent heat from the rest and cooling it to 2 °C.

By volume, the flash gas dominates. With NIST's densities at 2 °C, 15.465 kg/m³ for the vapour and 1,288.1 for the liquid, the vapour occupies **97%** of the mixture's volume entering the evaporator. The evaporator's inlet is mostly vapour, with liquid as drops and films, which is why evaporators are designed with distributors to share the liquid evenly between their passages.

```figure
type: formula
title: Flash gas after the expansion valve
formula: x = (h₃ − h_f) ÷ (h_g − h_f)
caption: This is an illustration for CH-30 with NIST R-134a enthalpies at 2 °C. A quarter of the mass, and nearly all the volume, enters the evaporator as vapour.
- h₃ | Liquid at the valve, 40 °C: 108.27 kJ/kg
- h_f, h_g | Saturated liquid and vapour at 2 °C: 54.55 and 251.62 kJ/kg
step: x = 53.72 ÷ 197.07 = 0.273, or 27.3% by mass
step: By volume, with densities 15.465 and 1,288.1 kg/m³: about 97% vapour
```

## What the flash gas costs

The flash gas has already boiled, so it takes in no more heat in the evaporator. Only the remaining liquid, 72.7% of the flow, does the useful boiling; the vapour is carried through the evaporator and back to the compressor, which must compress it again. In other words, the compressor pumps 0.2029 kg/s round the circuit, of which 0.0553 kg/s arrives at the evaporator already as vapour.

The refrigerating effect, 147.86 kJ/kg, is what is left of the latent heat at 2 °C, 197.07 kJ/kg, after the flash gas's share is taken out, plus the small amount of superheat. Anything that cools the liquid further before the valve reduces the flash gas and raises the refrigerating effect, without changing the compressor's work per kilogram.

The flash gas fraction also grows with the lift. A higher condensing temperature means warmer liquid at the valve, and a lower evaporating temperature means a lower boiling point after it; both mean more of the liquid must boil to cool the rest. At 55 °C condensing, CH-30's flash gas would be about 35% instead of 27%, which is one of the reasons its capacity falls on hot days (Chapter 7).

## What subcooling is worth

NIST's data give the liquid's enthalpy falling by about 1.51 kJ/kg for each kelvin it is cooled near 40 °C. Each kelvin of subcooling therefore adds about 1.51 kJ/kg to the refrigerating effect, about **1.0%** of CH-30's 147.86 kJ/kg, for no extra compressor work per kilogram.

This is an illustration for CH-30 at its design point:

- with **no subcooling**, liquid at 45 °C, h = 115.80 kJ/kg: flash gas **31.1%**, refrigerating effect **140.33 kJ/kg**, COP **3.52**;
- with **5 K** of subcooling, the design: flash gas **27.3%**, refrigerating effect **147.86 kJ/kg**, COP **3.71**.

Five kelvin of subcooling is worth about 5% of the COP. It comes from a section of the condenser that the liquid passes through after condensing, and it depends on the condenser having enough surface and the right charge of refrigerant; an undercharged system has less liquid to subcool and loses it first (Chapter 4).

```figure
type: compare
title: CH-30's flash gas and performance with and without subcooling
rowhead: Liquid at the valve
cols: Enthalpy, kJ/kg | Flash gas by mass | Refrigerating effect, kJ/kg | COP
caption: This is an illustration with NIST data; compressor work per kilogram is 39.86 kJ/kg in every case. Each kelvin of subcooling is worth about 1% of capacity.
- 45 °C, no subcooling | 115.80 | 31.1% | 140.33 | 3.52
- 43 °C, 2 K subcooling | 112.77 | 29.5% | 143.36 | 3.60
- * 40 °C, 5 K subcooling | 108.27 | 27.3% | 147.86 | 3.71
```

## Expansion devices

All expansion devices throttle; they differ in how they decide how much refrigerant to pass.

- A **capillary tube**, a long, fine tube, is a fixed restriction. It is cheap and has no moving parts, and it suits small systems with a steady load and a carefully set charge, such as domestic refrigerators. It cannot adapt to changes in load or condensing pressure.
- A **fixed orifice** works the same way in a short length, common in some air-conditioning equipment.
- A **thermostatic expansion valve** adjusts its opening to hold a set superheat at the evaporator's outlet, using a sensing bulb (Chapter 3). It is the long-standing choice for chillers and commercial refrigeration.
- An **electronic expansion valve** holds superheat with a sensor, a transducer and a controller, and can work over a wide range of loads and condensing pressures, which lets a chiller run with a lower condensing pressure on cool days (Chapter 7).
- **Float valves** keep a liquid level in a flooded evaporator or a receiver, used in larger plant.

Whatever the device, the throttling itself is the same isenthalpic process, and the flash gas fraction is set by the liquid's enthalpy and the evaporating pressure, not by the type of valve.

## Throttling elsewhere in the plant

The same physics appears wherever a fluid passes through a restriction without doing work.

- A **compressed-air regulator** throttling from 0.7 MPa to 0.1 MPa cools ideal air not at all and real air by about 1.3 K, from nitrogen's Joule–Thomson coefficient; the noticeable chilling at an air tool's exhaust comes instead from the air expanding and doing work in the tool.
- A **steam trap** or pressure-reducing valve passing hot condensate to a lower pressure produces **flash steam**, exactly as a refrigerant flashes, and the flash fraction follows from the same enthalpy balance with water's properties.
- A **gas cylinder regulator** throttling carbon dioxide, whose Joule–Thomson coefficient is large, can chill enough to frost, which is why some regulators are heated.

In each case the enthalpy balance gives the outlet state, and the fluid's own properties decide whether the result is a small temperature change or a change of phase.

## Liquid that flashes too early

The expansion valve is meant to be the only place where the liquid's pressure falls below its saturation pressure. If the pressure falls below saturation anywhere before the valve, the liquid starts to flash there, and the valve receives a mixture of liquid and vapour. Because the vapour takes up so much volume, the valve's capacity for refrigerant falls sharply, the evaporator is starved, the superheat rises and the system loses capacity.

Subcooling is the liquid's margin against early flashing. CH-30's liquid at 40 °C is subcooled by 5 K, which at its pressure of 1.1599 MPa means the pressure can fall to 1.0166 MPa, the saturation pressure at 40 °C, before flashing starts: a margin of **143 kPa**. Three things can use up that margin:

- **friction** in a long or narrow liquid line, and in its fittings and components;
- **lift**, if the liquid line rises: each metre of vertical rise in liquid R-134a, density about 1,150 kg/m³, costs about 11 kPa, so an 8 m rise costs about 90 kPa;
- **restrictions**: a partly closed valve, a kinked line, or a filter-drier clogged with debris.

A sight glass in the liquid line just before the expansion valve shows the result: clear liquid when all is well, a stream of bubbles when the liquid is flashing or the system is short of refrigerant.

## The error: a blocked filter-drier

This is an illustration. A few weeks after CH-30's evaporator was replaced, its capacity began to fall on hot afternoons, and its leaving water temperature drifted above 12 °C. The sight glass showed a steady stream of bubbles. The technician's first thought was a leak and a shortage of refrigerant, and the contractor's first proposal was to add some.

The moulder's maintenance technician measured temperatures along the liquid line instead. The liquid left the condenser at 40 °C, as designed, but after the filter-drier it was at **37 °C**. A liquid that cools as it passes through a restriction, without any heat being removed, is flashing: its temperature had fallen to the saturation temperature at the pressure after the drier. NIST's saturation pressure at 37 °C is **0.937 MPa**, so the drier was dropping about **0.22 MPa**, far more than the 143 kPa of margin the subcooling provided. About 2.7% of the liquid by mass was flashing in the drier, which by volume was about 41% of the stream reaching the valve.

The filter-drier had collected debris from the evaporator replacement. It was replaced, the bubbles cleared, and the capacity returned. No refrigerant was added; adding it would have hidden the fault while overcharging the system. The contractor's work instruction now calls for a new filter-drier after any work that opens the circuit, and a check of the temperature across it at commissioning.

```figure
type: checklist
title: Liquid line checks when a sight glass shows bubbles
caption: Bubbles mean flashing before the valve, from a shortage or a restriction; temperatures tell which. The last line is this chapter's error.
- Subcooling at the condenser outlet measured | 5 K, a margin of 143 kPa at 40 °C
- Temperature along the liquid line, before and after each component | 40 °C, then 37 °C after the drier
- Pressure drop across any component that shows a temperature drop | about 0.22 MPa across the drier
- Lift and length of the liquid line known | about 11 kPa per metre of rise
- Charge checked by weight or by the maker's method, not by sight glass alone | no refrigerant added
- x Refrigerant added to clear bubbles | would have hidden a blocked drier and overcharged the circuit
```

## Exercise: a roof-mounted condenser

A different chiller has its condenser on the roof, 8 m above its expansion valve, and its liquid line has 40 kPa of friction loss. With R-134a condensing at 45 °C and 5 K of subcooling, will the liquid reach the valve without flashing? What subcooling would give a 30 kPa margin?

**Worked answer.** The liquid line's pressure falls by about 1,150 × 9.81 × 8 = **90 kPa** of lift plus **40 kPa** of friction, 130 kPa in all.

- With 5 K of subcooling, the margin is 1,159.9 − 1,016.6 = **143 kPa**, so the liquid arrives with about 13 kPa to spare: no flashing, but very little margin.
- For a 30 kPa margin, the saturation pressure at the liquid's temperature must be no more than 1,159.9 − 130 − 30 = **1,000 kPa**, which NIST's table places at a little below 40 °C, about **39.4 °C**. The liquid needs about **5.6 K** of subcooling.

A designer would either provide more subcooling, run a larger liquid line to reduce the friction, or place the condenser lower. A sight glass at the valve confirms the result in service.
