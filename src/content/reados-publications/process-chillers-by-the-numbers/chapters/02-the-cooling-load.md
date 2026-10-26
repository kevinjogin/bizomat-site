---
book: process-chillers-by-the-numbers
chapterSlug: the-cooling-load
order: 2
title: "The cooling load"
description: "Cooling load from flow and temperature difference with NIST water data, where CH-30's 30 kW comes from, measuring a load and its uncertainty, peaks and part load, and a chiller sized from nameplates."
draft: false
---

Before any refrigeration cycle can be worked out, the job has to be stated: how much heat must be removed, from what, at what temperature, and how steadily. For a process chiller, the answer is the **cooling load**, and it is surprisingly often guessed instead of calculated or measured. An oversized chiller costs more, cycles on and off, controls its water temperature poorly and runs at its least efficient; an undersized one lets the process run warm on the hottest days, when it can least afford to. The load deserves the same care as the machine.

This chapter calculates CH-30's load from its water flow and temperature difference using NIST's water data, builds it up from its sources in the moulding shop, shows how to measure a load and how uncertain the measurement is, deals with peaks, margins and part load, and ends with a chiller sized from the nameplates of the machines it served.

## Load from flow and temperature difference

Heat removed from a stream of water equals its mass flow times the change in its enthalpy. Over a small temperature range, that is mass flow times specific heat times temperature difference:

Q = ṁ × c_p × ΔT

NIST gives the enthalpy of water at 0.3 MPa as **71.641 kJ/kg at 17 °C** and **50.698 kJ/kg at 12 °C**, a difference of **20.943 kJ/kg**, which is a mean specific heat of 4.189 kJ/(kg·K) over the range. For CH-30 to remove 30 kW from water returning at 17 °C and leaving at 12 °C, the water flow must be:

- ṁ = 30 ÷ 20.943 = **1.432 kg/s**;
- at a density of about 999 kg/m³, **1.43 litres a second**, or **86 litres a minute**.

The temperature difference and the flow are linked: for the same load, a smaller difference needs a larger flow. At a 3 K difference, CH-30 would need 2.39 kg/s, two thirds more water, with larger pipes and a bigger pump. At a 5 K difference, the moulds see water between 12 and 17 °C, which the moulder's process engineers accept. The temperature difference is a process decision, and it fixes the pumping system.

```figure
type: formula
title: Cooling load from water flow and enthalpy change
formula: Q = ṁ × (h_return − h_supply)
caption: This is an illustration for CH-30 with NIST's water enthalpies at 0.3 MPa. Over a few degrees, ṁ × c_p × ΔT gives the same result.
- h at 17 °C | 71.641 kJ/kg (NIST)
- h at 12 °C | 50.698 kJ/kg (NIST)
step: Δh = 71.641 − 50.698 = 20.943 kJ/kg; mean c_p = 4.189 kJ/(kg·K)
step: ṁ = 30 ÷ 20.943 = 1.432 kg/s, about 86 L/min
```

## Where CH-30's load comes from

A chiller's load is the sum of every source of heat that ends up in its water. This is an illustration for the moulder's shop at full production, built from measurements of each circuit:

- **Mould cooling: 24.5 kW.** Molten polymer enters the moulds at well over 200 °C and must be cooled to below its ejection temperature before each part is released. The heat it gives up passes through the mould steel into the cooling water. The amount depends on the polymer, its throughput and the temperatures, and is measured on each mould circuit.
- **Hydraulic oil coolers: 3.0 kW.** The moulding machines' hydraulic systems turn part of their pump power into heat, which oil-to-water coolers pass to the chilled water.
- **Circulation pump: 1.5 kW.** Almost all the power of the pump that circulates the chilled water ends up as heat in the water, through friction in the pump and the pipes.
- **Heat gains to the pipework: 1.0 kW.** Water at 12 to 17 °C in pipes running through a 30 °C factory picks up heat through the pipe walls and their insulation.

The total is **30.0 kW**. The last two items are easy to forget: the pump and the pipes add a tenth of the load in this case, and both grow if the pipes are long and poorly insulated or the pump is oversized.

```figure
type: stack
title: CH-30's 30 kW load at full production
unit: kW
caption: This is an illustration built from measured circuits. The pump's own power and the pipe gains are a tenth of the load.
- Mould cooling | 24.5
- Hydraulic oil coolers | 3.0
- Circulation pump | 1.5
- Pipework heat gains | 1.0
```

## Estimating a mould's load before it exists

For a new mould or machine, there is nothing yet to measure, and the load has to be estimated from the heat the polymer must lose. The method is the same formula applied to the polymer instead of the water: the polymer's mass throughput times the change in its enthalpy between the melt temperature and the temperature at which parts are ejected. For semi-crystalline polymers that change includes the latent heat of crystallisation, which can be a large part of it.

This is an illustration only, with round numbers rather than data for any particular polymer. A machine moulding 60 kg of polymer an hour, whose enthalpy falls by 500 kJ/kg between melt and ejection, releases 60 × 500 ÷ 3,600 = **8.3 kW**. Not all of it reaches the cooling water: some leaves in the ejected parts, which are still warm, and some passes from the mould's outer surfaces into the factory air. The polymer supplier's data give the enthalpy change for a specific grade, and a trial on a similar mould, measured as below, gives the share that reaches the water. Estimates built this way are good enough to choose between chiller sizes, and they should be checked by measurement once the mould runs.

## Pipe gains

The 1.0 kW of heat gained by CH-30's pipework is worth a moment, because it is the one part of the load that can be cut cheaply. Heat leaks into chilled-water pipes through their walls in proportion to the difference between the factory air and the water, and to the pipes' surface area, and inversely to the thermal resistance of their insulation. READOS's Heat Transfer by the Numbers works through pipe insulation in detail. For CH-30, insulating the uninsulated return runs halved the measured pipe gains, and the same insulation also stopped condensation dripping from the cold pipes on humid days, which had been rusting the steel above the moulding machines.

## Water, glycol and freezing

CH-30's refrigerant evaporates at 2 °C, only 2 K above the freezing point of water. With design flow, the water in its evaporator never comes near freezing, because the water is at 12 to 17 °C and the tube walls are only a little below it. If the flow falls, through a blocked strainer, a closed valve or a failed pump, the water in the evaporator can cool towards the refrigerant's temperature, and ice can form and split tubes or plates. Chillers that evaporate near freezing are therefore protected by a flow switch that stops the compressor when flow falls, and by a low-temperature cut-out on the leaving water.

Where water must be cooled below about 5 °C, or where the chiller or its pipes are outdoors in a climate with frost, the water is mixed with an antifreeze, usually a glycol. A glycol solution has a lower specific heat and a higher viscosity than water, so it needs more flow and more pumping power for the same load, and the chiller's evaporator transfers heat less well. Those penalties are why glycol is used only where it is needed; CH-30's indoor circuit at 12 °C uses treated water.

## Measuring a load

Where a process already exists, measuring its load beats any estimate. The method is the formula above, applied to readings:

1. Measure the water flow with a flow meter, or from a calibrated pump curve and the measured pressure rise.
2. Measure the supply and return temperatures with matched sensors, close to the chiller.
3. Log both for long enough to cover a full cycle of production, including start-up and the hottest part of the day.
4. Calculate the load at each logged point and look at its average, peak and pattern.

The temperature difference is small, so the measurement is sensitive to the thermometers. With two sensors each uncertain by ±0.2 K, the uncertainty in a 5 K difference is about √(0.2² + 0.2²) = **±0.28 K**, which is **±5.7%** of the load. A constant offset between the sensors matters more: a 0.5 K offset would make CH-30's load appear to be 33 kW or 27 kW. Sensors are therefore matched, by checking them together in the same water before installation, or swapped and re-read to cancel their offset.

```figure
type: compare
title: How sensor errors change a measured 30 kW load
rowhead: Error in the 5 K difference
cols: Measured difference, K | Load shown, kW | Error
caption: This is an illustration at 1.432 kg/s. Small temperature differences make the load sensitive to the thermometers; matching the sensors matters more than their absolute accuracy.
- None | 5.00 | 30.0 | 0%
- Random, ±0.2 K each sensor | 5.00 ± 0.28 | 30.0 ± 1.7 | ±5.7%
- Constant offset, +0.5 K | 5.50 | 33.0 | +10%
- Constant offset, −0.5 K | 4.50 | 27.0 | −10%
```

## Peaks, margins and part load

A logged load is rarely steady. CH-30's shows a morning peak as the moulds come up to temperature, a steady load through each shift, a dip at breaks, and a rise on hot afternoons when the factory air and the pipes are warmer. Three numbers matter to the chiller's choice.

- **The peak**, which the chiller must meet at the hottest condition it is designed for, 35 °C ambient here. CH-30's measured peak is the 30 kW above.
- **The margin**, added for growth or uncertainty. A modest margin is sensible; a large one buys a machine that spends its life at part load.
- **The typical load**, at which the chiller actually runs most of the time, and which decides its running cost. CH-30 averages about 70% of its peak across a year's operating hours, as an illustration, which Chapter 8 uses for the energy.

A chiller running well below its capacity either cycles its compressor on and off, which wears the compressor and swings the water temperature, or unloads its compressor by one of several methods, each with its own efficiency at part load. A buffer tank in the water circuit smooths cycling, because its thermal mass absorbs the difference between the chiller's output and the load while the compressor is off; the larger the tank, the longer each on and off period, and the fewer starts the compressor makes each hour. A variable-speed compressor follows the load most closely. Both cost more than a fixed-speed compressor, and both are easier to justify than an oversized machine.

## Heat from the chiller's own pump and fans

The chiller's own circulation pump puts its power into the water, as above. The condenser fans do not: their power goes into the air leaving the condenser, outdoors. That difference matters for running cost and for reading performance figures, because a chiller's quoted cooling capacity may or may not have had the pump's heat subtracted, and its quoted input power may or may not include the fans (Chapter 1). For CH-30, the moulder counts the pump's 1.5 kW as part of the load and the fans' power as part of the chiller's input.

## The error: a chiller sized from nameplates

This is an illustration. The moulder's previous chiller had been chosen by adding up the heating power on the nameplates of the moulding machines it served, 55 kW in all, on the reasoning that every kilowatt of heater power would end up in the cooling water. A 55 kW chiller was installed.

The reasoning was wrong in two ways. The heater power on a moulding machine's barrel is a maximum, used in full only at start-up; in production the heaters cycle, and much of the heat that melts the polymer comes from the screw's mechanical work, not the heaters. And not all the heat goes to the chilled water: a large part leaves the barrel and the parts into the factory air. When the moulder logged the old chiller's water flow and temperatures for a fortnight, the measured load averaged **21 kW** and peaked at **30 kW**.

The 55 kW chiller had been running at 38% of its capacity on average, cycling its compressor every few minutes, with the water temperature swinging by ±2 K around its setpoint and the moulds' cycle times set long to tolerate it. CH-30, sized at 30 kW from the measured peak, with a buffer tank, replaced it, and the water temperature now holds within ±0.5 K. The moulds' cycle times were then shortened, because steady cooling let the process engineers set them closer to what each part needed, and the moulder kept the fortnight's log as the reference for any future change to the chilled-water system.

```figure
type: checklist
title: Checks on a cooling load before a chiller is chosen
caption: Measured is better than estimated; estimated from heat flows is better than added up from nameplates. The last line is this chapter's error.
- Load from flow and temperature difference, measured where possible | 1.432 kg/s across 5 K
- Every source counted, including pumps and pipe gains | 2.5 of 30 kW
- Thermometers matched for small temperature differences | ±0.28 K on 5 K
- Peak at the design ambient, typical load and margin stated | 30 kW peak; about 70% average
- Part-load behaviour of the chiller considered | buffer tank fitted
- x Load added up from machine nameplates | 55 kW chosen; 21 kW average, 30 kW peak measured
```

## Exercise: a new moulding cell

A new moulding cell will add mould-cooling circuits measured on a similar machine at **6.0 kW**, an oil cooler of **0.8 kW**, and about 15 m of additional pipe gaining **0.3 kW**. The circulation pump stays the same. Find the new design load, the new water flow at a 5 K difference, and whether CH-30 can take it.

**Worked answer.**

- New load: 30.0 + 6.0 + 0.8 + 0.3 = **37.1 kW**.
- Water flow: 37.1 ÷ 20.943 = **1.77 kg/s**, about 106 L/min.

CH-30 is rated at 30 kW at its design point, so it cannot carry 37.1 kW at 35 °C ambient. It might carry it on cooler days, because its capacity rises as the condensing temperature falls (Chapter 7), but the design must hold on the hottest day. The options are a second chiller, a larger replacement, or accepting a warmer water temperature on hot days if the process can tolerate it; Chapter 7's figures show how much capacity a warmer setpoint would buy.
