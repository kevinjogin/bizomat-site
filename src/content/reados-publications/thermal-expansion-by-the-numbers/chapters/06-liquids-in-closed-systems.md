---
book: thermal-expansion-by-the-numbers
chapterSlug: liquids-in-closed-systems
order: 6
title: "Liquids in closed systems"
description: "Calculate how much water a closed heating loop expels as it warms, size a diaphragm expansion vessel from its precharge and maximum pressure, and see what a wrong precharge or no vessel does."
draft: false
---

Water expands about ten times as much as the steel pipes and tanks that hold it. In an open system, with a vented tank, the extra volume simply rises in the tank. In a closed, pressurised system, it has nowhere to go. Water is nearly incompressible, so a sealed loop of water that warms by even a few degrees tries to raise its pressure enormously, until something gives: a relief valve opens, a gasket weeps, a component deforms. Every closed heating or hot water system therefore needs somewhere for the expansion to go, and the usual answer is an expansion vessel: a small tank with a cushion of gas that compresses as the water enters.

This chapter sizes the expansion vessel for HW-60's closed primary loop. It calculates the water's expansion from density tables, allows for the growth of the system's metal, explains how a diaphragm vessel works using Boyle's law, sizes the vessel from its precharge pressure and the system's maximum pressure, and shows what a wrong precharge does. The failure case is a relief valve that discharged every morning because the vessel had been precharged to the wrong pressure.

## The primary loop

HW-60's water heater does not heat the hot water directly in this part of the system. A closed **primary loop**, holding about **400 L** of treated water, carries heat from a boiler to a plate heat exchanger. The loop is filled cold, at about **15 °C**, and runs at up to **85 °C**. It is pressurised: filled to a **cold pressure of 1.5 bar gauge**, and protected by a **relief valve set at 6.0 bar gauge**. The highest working pressure allowed, with a margin below the relief setting, is **5.5 bar gauge**. These values are an illustration; real settings come from the system's design, the components' ratings and AS/NZS 3500.4 and related requirements.

## How much the water expands

Chapter 1 showed that water's expansion is best calculated from its densities. The 400 L of water filled at 15 °C, at 999.10 kg/m³, has a mass of about 399.6 kg. At 85 °C, at 968.61 kg/m³, the same mass occupies more space.

```figure
type: formula
title: Expansion of the primary loop's water from 15 °C to 85 °C
formula: expansion volume = V cold × (ρ cold ÷ ρ hot − 1)
caption: This is an illustration using published densities of 999.10 kg/m³ at 15 °C and 968.61 kg/m³ at 85 °C. The steel's own growth, about 0.36% of the system volume, would offset part of it.
- System volume when cold | 400 L
- Density ratio | 999.10 ÷ 968.61 ≈ 1.0315
step: expansion = 400 × 0.0315 ≈ 12.6 L
step: allowing for the system's metal growing by about 1.45 L, net about 11.1 L
```

The water expands by about **12.6 L**. The pipes, heat exchanger and boiler grow too, by about 3α × ΔT of the system's volume, about **1.45 L**, so the net volume to be absorbed is about **11.1 L**. Designers often ignore the metal's growth, which is a small safety margin, and size for the full 12.6 L. HW-60's design does that, and records the choice in the calculation.

## Why the pressure would soar

Without anywhere for that 12.6 L to go, the water would be compressed. Water is very stiff: forcing 12.6 L back into a 400 L system, a 3% reduction in volume, would need a pressure many hundreds of times the system's rating. Long before that, the relief valve opens and discharges the expansion volume as water. On cooling, the system then contracts, its pressure falls, and air can be drawn in at fittings and vents, bringing oxygen and corrosion. A closed system without expansion control loses water and gains air on every heating cycle.

## How a diaphragm expansion vessel works

A diaphragm expansion vessel is a steel shell divided by a flexible rubber diaphragm or bag. One side is connected to the system's water; the other holds a cushion of gas, usually nitrogen or air, charged before installation to a set **precharge pressure**. When the system warms and the water expands, water enters the vessel and compresses the gas. The gas's pressure rises as its volume falls, following **Boyle's law**: at constant temperature, absolute pressure times volume stays constant.

The vessel's usable fraction, its **acceptance factor**, is the share of its volume the water can take up between the precharge pressure and the maximum pressure. From Boyle's law, with absolute pressures:

**acceptance factor = 1 − p_precharge ÷ p_maximum**

Absolute pressures are gauge pressures plus atmospheric pressure, about 1.013 bar. Using gauge pressures here gives a wrong answer, for the same reason as the gas calculations in Chapter 7.

## Sizing HW-60's vessel

The vessel's precharge is set equal to the system's cold fill pressure, **1.5 bar gauge**, so that when the system is cold, the diaphragm sits against the water side and the vessel is empty of water, ready to accept the whole expansion.

```figure
type: formula
title: Expansion vessel for HW-60's primary loop
formula: vessel volume = expansion volume ÷ (1 − p_precharge ÷ p_maximum), pressures absolute
caption: This is an illustration. Precharge 1.5 bar gauge = 2.513 bar absolute; maximum working pressure 5.5 bar gauge = 6.513 bar absolute, 0.5 bar below the relief valve's setting.
- Expansion volume | 12.6 L
- Precharge, absolute | 1.5 + 1.013 = 2.513 bar
- Maximum, absolute | 5.5 + 1.013 = 6.513 bar
step: acceptance factor = 1 − 2.513 ÷ 6.513 ≈ 0.614
step: vessel volume ≈ 12.6 ÷ 0.614 ≈ 20.5 L, so a 25 L vessel is selected
```

A **25 L** vessel, the next standard size above 20.5 L, takes the full expansion with the system's pressure staying below 5.5 bar gauge at 85 °C.
## The precharge matters as much as the size

The acceptance factor depends heavily on the precharge. A higher precharge leaves less room for the gas to compress before reaching the maximum pressure, so the same vessel accepts less water.

```figure
type: bars
title: Vessel volume needed for 12.6 L of expansion, by precharge
unit: litres
max: 35
caption: This is an illustration with a maximum of 5.5 bar gauge. The precharge should match the system's cold fill pressure; a precharge set too high halves the vessel's usefulness.
- 0.5 bar gauge | 16.4
- 1.0 bar gauge | 18.2
- *1.5 bar gauge, matching the fill | 20.5
- 2.0 bar gauge | 23.4
- 3.0 bar gauge | 32.8
```

A precharge below the cold fill pressure is wasteful too, for a different reason: water enters the vessel as soon as the system is filled, using up part of its capacity before any heating has happened. The rule is to set the precharge to the cold fill pressure at the vessel's location, check it with the vessel isolated and its water side drained, because a gauge on the gas valve reads the water's pressure when the vessel holds water, and recheck it at least yearly, because gas slowly permeates through diaphragms.

## Where to connect the vessel

The point where the expansion vessel joins the loop is the one point whose pressure does not change when the pump starts, because the vessel holds it at the gas cushion's pressure. Pressures elsewhere rise or fall from it by the pump's head. Connecting the vessel near the **pump's suction**, on the cooler return side of the loop, keeps the pressure at the pump's inlet steady, which protects the pump from cavitation, and lets the rest of the loop sit above that pressure, which keeps air from being drawn in at fittings. The cooler side also spares the vessel's diaphragm from the highest temperatures. HW-60's vessel is connected to the return pipe just before the pump, through an isolating valve that can be locked open, with a drain point between the valve and the vessel so the precharge can be checked.

## Fill pressure and the system's height

The cold fill pressure is chosen so that the highest point of the loop stays above atmospheric pressure, with a margin, when the system is cold and the pump is stopped. Each metre of height between the gauge and the highest point takes about 0.1 bar. If the loop's highest point were 10 m above the vessel, the pressure there would be about 1 bar less than at the vessel. HW-60's loop is all within the plant room, about 3 m high, so a 1.5 bar gauge fill at the vessel leaves about 1.2 bar gauge at the top, a comfortable margin. A fill pressure too low lets air in at the highest automatic air vent; too high wastes the vessel's capacity and brings the working pressure closer to the relief setting.

## Other fluids

Loops that must not freeze, or that run below 0 °C, use a mixture of water and glycol. Glycol mixtures expand more than water over the same temperature range, so their expansion is calculated from the mixture's own density data, from its supplier, not from water's. The same applies to thermal oils used in high-temperature loops, which expand far more again and need much larger expansion tanks. The method does not change: density at the cold temperature divided by density at the hot, minus one, times the cold volume.

## Trapped liquid

Expansion control protects the loop as a whole. It does nothing for a section that has been isolated from it. If valves either side of a heat exchanger, a length of pipe or a hose are closed with liquid trapped between them, and that section is then heated, by the sun, by a neighbouring hot pipe or by heat still flowing through the exchanger's other side, the trapped liquid has nowhere to go and its pressure rises until something fails. Isolation procedures for maintenance therefore drain isolated sections, or open a vent on them, and sections that can be isolated while heat is applied are fitted with their own small relief valve.

## Open and vented systems

HW-60's storage tank, from *Heat Transfer by the Numbers*, is vented to the atmosphere through its top, so its water's expansion simply raises the level slightly in the tank and needs no vessel. Mains-pressure hot water heaters are different again: they are closed to the atmosphere but connected to the water main, and their expansion is usually controlled by an expansion control valve and a temperature and pressure relief valve, under the plumbing standards. The physics is the same in each case; the arrangement for absorbing the expansion differs.

## Relief valves are the last line

A relief valve protects the system from overpressure whatever the cause: a failed vessel, a control fault, a closed valve trapping heated water. It must be sized and set to protect the lowest-rated component in the system, discharge somewhere safe, and be tested regularly. It is not a means of expansion control. A relief valve that discharges routinely is a sign that the expansion control has failed, and a valve that discharges often tends to dirty its seat and leak. Its discharge pipe must be open, visible and directed where hot water cannot scald anyone, so that a discharge is both safe and noticed. HW-60's relief valve discharges to a tundish beside the boiler, where a technician walking past can see any flow.

## A failure case: the morning discharge

This is an illustration. After the primary loop's expansion vessel was replaced during a service, the relief valve began to discharge water to its tundish every morning as the boiler brought the loop up to temperature, and the loop's pressure gauge read about 6 bar at full temperature. The system had to be topped up every few days.

The maintenance technician isolated the vessel, drained its water side and checked its gas precharge: **3.0 bar gauge**, the factory setting for a different application, not the loop's 1.5 bar. With a 3.0 bar precharge, the 25 L vessel's acceptance factor fell to about **0.384**, so it could take only about **9.6 L** before the pressure reached 5.5 bar gauge, against the 12.6 L needed. The rest was discharged through the relief valve.

The detection came from the routine discharge and frequent top-ups, together with a precharge check. The correction was to reduce the precharge to 1.5 bar gauge with the vessel isolated and drained, refill and repressurise the loop, and confirm that its pressure stayed below 5.5 bar gauge at full temperature. The service procedure now includes checking and setting every replacement vessel's precharge before it is installed, and a label on the vessel records the required precharge and the date it was last checked, so the next technician does not have to work it out.

## How this applies to a small Australian business

Every closed water system needs somewhere for its expansion to go. Calculate the expansion from densities at the cold and hot temperatures, size the expansion vessel from its acceptance factor using absolute pressures, and choose the next size up. Set the precharge to the cold fill pressure at the vessel, check it with the water side drained, and recheck it yearly. Treat a relief valve that discharges routinely as a fault in the expansion control, not as normal operation. And follow the plumbing standards and the equipment makers' instructions for the arrangement, the relief settings and the discharge.

## Exercise: a larger loop

A second closed loop holds **600 L** of water, filled at 15 °C and run at **80 °C**, with the same 1.5 bar gauge fill and 5.5 bar gauge maximum. Using a density of **971.79 kg/m³** at 80 °C, how much does the water expand, and what size of vessel is needed?

**Worked answer.** The density ratio is **999.10 ÷ 971.79 ≈ 1.0281**, so the expansion is **600 × 0.0281 ≈ 16.9 L**. The acceptance factor is the same, about **0.614**, so the vessel volume needed is **16.9 ÷ 0.614 ≈ 27.5 L**, and the next standard size above that is chosen, for example a 35 L vessel. A lower top temperature saves a little expansion, but the larger volume more than makes up for it.
