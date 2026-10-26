---
book: heat-pumps-and-refrigeration-by-the-numbers
chapterSlug: the-vapour-compression-cycle
order: 3
title: "The vapour-compression cycle"
description: "Follow refrigerant around the vapour-compression cycle: evaporating, compressing, condensing and throttling, the energy balance, superheat and subcooling, and how faults show up."
draft: false
---

Almost every refrigerator, air conditioner, chiller, freezer and heat pump works on the same cycle. A fluid, the refrigerant, boils at a low temperature in one heat exchanger, absorbing heat; is compressed to a higher pressure; condenses at a higher temperature in a second heat exchanger, rejecting heat; and is let back down to the low pressure through an expansion device, ready to boil again. The cycle uses exactly the same physics as a steam system, run in the opposite direction: boiling and condensing at temperatures set by pressure, latent heat carrying most of the energy, and throttling that keeps enthalpy constant. Understanding it turns a refrigeration plant from a sealed box into a set of measurable temperatures and pressures that tell a technician what is wrong.

This chapter follows the refrigerant around CS-1's plant. It describes the four components and what happens in each, ties them together with the first law's energy balance, explains why the refrigerant is slightly superheated before the compressor and subcooled after the condenser, links each part of the cycle to the COP from Chapter 2, and shows how common faults appear in the measurements. The failure case is a plant slowly losing its refrigerant through a small leak, found by its superheat before the room warmed.

## Boiling at a temperature set by pressure

A refrigerant is chosen because it boils at a useful temperature at a manageable pressure. Like water in *Process Steam by the Numbers*, each refrigerant has a saturation temperature for each pressure, published in its pressure-temperature table. At the low pressure in CS-1's evaporator, the refrigerant boils at about **−8 °C**; at the high pressure in its condenser, it condenses at about **40 °C**. A technician with a pressure gauge and the refrigerant's table can read the evaporating and condensing temperatures directly, just as a steam engineer reads a boiler's temperature from its gauge.

## The four stages

```figure
type: cycle
title: The vapour-compression cycle in CS-1's refrigeration plant
caption: This is an illustration. Heat enters at the evaporator and leaves at the condenser; the compressor's work is what lifts it from the cold side to the warm side.
- Evaporator, inside the room, refrigerant boils at about −8 °C, absorbing heat from the 2 °C air
- Compressor, vapour compressed from low pressure to high, using electrical work and heating the vapour
- *Condenser, outside, hot vapour cools and condenses at about 40 °C, rejecting heat to 30 °C air
- Expansion valve, liquid throttled from high pressure to low, part of it flashing to vapour and chilling to about −8 °C
- Return to the evaporator, a cold mixture of liquid and flash vapour ready to absorb heat again
```

**Evaporator.** Cold liquid refrigerant, at the low pressure, flows through the evaporator coil inside the room. Fans blow room air across the coil. Heat flows from the 2 °C air into the −8 °C refrigerant, which boils, absorbing its latent heat. This is the useful cooling, and the evaporator's size and airflow decide how much of it the plant can deliver.

**Compressor.** The vapour leaving the evaporator is drawn into the compressor, which raises its pressure. Compressing a vapour heats it, so the vapour leaves hot, well above its condensing temperature. The compressor is where the electrical work enters the cycle.

**Condenser.** The hot, high-pressure vapour flows through the condenser coil outside. Fans blow outside air across it. The vapour first cools to its condensing temperature, then condenses at 40 °C, giving up its latent heat, then cools a little further as liquid. All the heat removed from the room, plus the compressor's work, leaves here.

**Expansion valve.** The warm, high-pressure liquid passes through an expansion valve into the low-pressure side. As in the steam reducing valve and the flash steam of *Process Steam by the Numbers*, throttling keeps the enthalpy constant: the liquid cannot stay liquid at the low pressure at its present temperature, so part of it flashes to vapour, and the cooling effect of that flash chills the whole mixture to −8 °C. The cold mixture enters the evaporator, and the cycle repeats.

## The energy balance

The first law ties the stages together. In steady operation, the heat rejected at the condenser equals the heat absorbed at the evaporator plus the compressor's work. CS-1's plant, sized in Chapter 5, removes about **6.3 kW** from the room at full load. At the cooling COP of 2.76 from Chapter 2, its compressor uses about **6.3 ÷ 2.76 ≈ 2.3 kW** of electricity, and its condenser rejects about **6.3 + 2.3 ≈ 8.6 kW** to the outside air.

```figure
type: formula
title: Energy balance of CS-1's plant at full load
formula: Q_condenser = Q_evaporator + W_compressor        COP_cooling = Q_evaporator ÷ W_compressor
caption: This is an illustration at the realistic cooling COP of 2.76. The flash vapour formed at the expansion valve does no useful cooling, which is one reason the real COP is below the Carnot figure.
- Cooling, at the evaporator | about 6.3 kW
- Cooling COP | 2.76
step: compressor work ≈ 6.3 ÷ 2.76 ≈ 2.3 kW
step: heat rejected at the condenser ≈ 6.3 + 2.3 ≈ 8.6 kW
```

The condenser must be sized for the larger figure, 8.6 kW, not the 6.3 kW of cooling. A condenser sized for the cooling alone would run hotter than designed, raising the lift and lowering the COP.

## Where the cycle loses to Carnot

Chapter 2 used a realistic COP of half the Carnot figure. The cycle shows where the other half goes:

- **Throttling** at the expansion valve, where pressure energy is simply dissipated instead of being recovered by an expander, and part of the liquid flashes to vapour that then does no cooling;
- **Compression** that is not ideal: friction, leakage past valves or rotors, and heat transfer in the compressor;
- **Superheating** of the compressed vapour well above its condensing temperature, which the condenser must remove across a larger temperature difference;
- **Pressure drops** in the pipes and coils;
- and the **temperature differences** at both heat exchangers, which Chapter 2 counted in the lift itself.

Each is a design choice traded against cost and reliability, and each is why the maker's tested data, not the Carnot figure, decide a real plant's performance.

## Frost and defrost

CS-1's evaporator runs at −8 °C, below the freezing point of water. Moisture in the room air, brought in through the door and from the product, condenses on the cold coil and freezes as frost. Frost insulates the coil and blocks the airflow between its fins, so the evaporator's capacity falls and, to keep up, the evaporating temperature drops, raising the lift and lowering the COP. The coil must be defrosted periodically: the plant stops cooling, and the coil is warmed, by electric heaters, by hot refrigerant gas diverted from the compressor, or, in rooms kept above freezing, simply by letting the room air melt the frost with the fans running. Defrost uses energy, adds heat to the room that the plant must then remove, and interrupts cooling, so it is done as often as needed and no more. Demand defrost controls, which start a defrost when the coil's airflow or temperature shows frost has built up, rather than on a fixed timer, save energy in rooms where moisture loads vary. CS-1, at 2 °C, uses off-cycle defrost with the fans running, the simplest method, triggered on demand.

## The same cycle as a heat pump

A heat pump is the same cycle with the other side put to use. Its evaporator takes heat from a source, outside air, ground water or a waste stream; its condenser delivers heat to the water or air being heated. A heat pump water heater's condenser is a refrigerant-to-water heat exchanger, and the water's temperature sets the condensing temperature, which is why Chapter 2 found its COP so sensitive to the water temperature. Reversible air conditioners switch between the two roles with a valve that swaps which coil is the evaporator and which the condenser. In every case the cycle, the energy balance and the diagnostics are the same.

## The compressor and its oil

The compressor is the only moving machinery in the circuit, and its health decides the plant's life. Most refrigeration compressors are lubricated by oil that circulates with the refrigerant around the whole system and must return to the compressor. Pipework is sized and arranged so that the refrigerant's velocity carries oil back, particularly up vertical risers. A plant whose oil collects in the evaporator or in a long, low-velocity pipe starves its compressor of lubrication, which shows as noise, rising temperature and eventually failure. Compressor discharge temperature, oil level where a sight glass is fitted, and running current are all recorded at service alongside the refrigerant readings.

## Protecting the plant

A refrigeration circuit is a sealed pressure system, and its controls protect both the plant and the people near it. A **high-pressure cut-out** stops the compressor if the condensing pressure rises too far, as it does when a condenser fan fails or the coil is blocked. A **low-pressure cut-out** stops it if the suction pressure falls too low, as it does with a severe leak or a blocked expansion valve, protecting the compressor from running without enough refrigerant to cool and lubricate it. Larger systems carry pressure relief devices on vessels that hold liquid refrigerant, discharging safely if a fire or fault drives the pressure up. These devices are set by the plant's designer to the components' ratings and the applicable standard, and they are tested by the service technician as required. A plant that trips on its high-pressure cut-out is not being awkward; it is reporting a condenser problem that would otherwise overheat and damage the compressor.

## Superheat and subcooling

Two small temperature margins protect the cycle, and they are the technician's most useful diagnostic numbers.

**Superheat** is how far the vapour leaving the evaporator is above its evaporating temperature. A few kelvins of superheat guarantee that all the liquid has boiled, so no liquid reaches the compressor, which compresses vapour and can be damaged by liquid. The expansion valve, in most plants a thermostatic or electronic valve, regulates the refrigerant flow to hold the superheat at its set value.

**Subcooling** is how far the liquid leaving the condenser is below its condensing temperature. A few kelvins of subcooling guarantee that only liquid, without vapour bubbles, reaches the expansion valve, so it can meter the flow properly.

Both are measured with a pressure gauge and a pipe thermometer: the gauge gives the saturation temperature from the refrigerant's table, the thermometer gives the actual pipe temperature, and the difference is the superheat or subcooling.

## How faults show up

Because the cycle is governed by pressures, temperatures and the energy balance, common faults show up in recognisable patterns.

```figure
type: compare
title: Common refrigeration faults and their signs
cols: Superheat | Subcooling | Condensing pressure | Typical cause
caption: This is an illustration of general patterns. Diagnosis on a real plant is done by a licensed technician with the plant's design data.
- *Low refrigerant charge | high | low | low | a leak
- Dirty or blocked condenser | normal | normal to high | high | dust, debris or a failed condenser fan
- Iced or dirty evaporator | low to normal | normal | low | defrost failure, blocked airflow
- Overcharge | normal | high | high | too much refrigerant added after service
- Restricted expansion valve or filter | high | high | normal | blockage, moisture freezing at the valve
```

The pattern for a low charge is distinctive: with too little refrigerant, the evaporator is starved, the vapour picks up extra heat in the dry part of the coil and leaves with high superheat, the condenser holds little liquid so subcooling is low, and both pressures fall. The room warms only later, when the plant can no longer keep up.

## A failure case: the slow leak

This is an illustration. During a routine quarterly service, the refrigeration technician servicing CS-1 recorded a superheat at the evaporator outlet about twice its usual value, with subcooling and condensing pressure both a little lower than the previous service's readings. The room was holding 2 °C, but the compressor's running time, logged by the controller, had crept up over the previous month.

The pattern pointed to a low charge. An electronic leak detector found a small leak at a flare fitting on the evaporator, loosened by vibration. The technician, licensed to handle the refrigerant as Chapter 8 requires, isolated and repaired the fitting, pressure-tested and evacuated the affected section, and recharged the system by weight to its specified charge. Superheat, subcooling and the compressor's running time returned to their usual values.

The detection came from comparing service readings with previous ones, before the room ever warmed. The correction included recording the amount of refrigerant added, as required, and adding the evaporator's fittings to the service checklist. A plant whose readings are recorded at every service tells its own story; one whose readings are not has to fail before anyone notices. CS-1's service sheets are kept in a single folder, newest first, so each technician sees the last three visits before starting.

## How this applies to a small Australian business

Think of a refrigeration plant as a steam system in reverse: boiling and condensing at temperatures set by pressure, with a compressor doing the lifting. Size condensers for the cooling plus the compressor's work. Ask your service technician to record superheat, subcooling, both pressures and the compressor's running time at every service, and compare them with previous readings, because the pattern of change shows faults such as slow leaks long before the room warms. And leave work on the refrigerant circuit to licensed technicians.

## Exercise: a heat pump's balance

A heat pump water heater delivers **30 kW** of heat to water at a heating COP of **2.86**. How much electricity does it use, and how much heat does it absorb from its source air? What is its cooling COP at the same conditions?

**Worked answer.** The electricity is **30 ÷ 2.86 ≈ 10.5 kW**. The heat absorbed from the air is the heat delivered minus the work: **30 − 10.5 ≈ 19.5 kW**. The cooling COP is the heating COP minus one: **2.86 − 1 = 1.86**, which checks: **19.5 ÷ 10.5 ≈ 1.86**. About two thirds of the delivered heat comes free from the air; the electricity pays for lifting it.
