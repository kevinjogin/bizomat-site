---
book: process-chillers-by-the-numbers
chapterSlug: compressor-work-and-discharge-temperature
order: 6
title: "Compressor work and discharge temperature"
description: "Ideal and real compression from NIST data, isentropic efficiency, why R-134a heats less than air, motor losses, discharge temperature, and a starved evaporator."
draft: false
---

The compressor is where a chiller spends its electricity. Everything else in the cycle, the evaporator, the condenser, the expansion valve, moves heat or drops pressure without work; the compressor alone takes in power, and its efficiency decides how much. It also decides how hot the refrigerant leaves, which matters for the compressor's own life, for its oil, and for any heat recovered from the discharge gas. Both follow from the same calculation: the refrigerant's entropy at the inlet, its pressure at the outlet, and how far the real machine falls short of an ideal one.

This chapter calculates CH-30's ideal and real compression from NIST's data, defines isentropic efficiency and shows its effect, explains why compressing a refrigerant heats it far less than compressing air, adds the motor's losses, looks at what raises the discharge temperature, and ends with an expansion valve adjustment that starved the evaporator and pushed CH-30's discharge temperature up by 12 K.

## Ideal compression

A compressor that worked without friction, leakage or heat exchange would compress its gas **isentropically**, at constant entropy. That is the ideal against which real compressors are measured, and with property tables it is simple to find: the outlet state is the one at the discharge pressure with the same entropy as the inlet.

This is an illustration. CH-30's suction vapour, at 0.31462 MPa and 7 °C, has NIST entropy s₁ = **0.94664 kJ/(kg·K)** and enthalpy h₁ = 256.13 kJ/kg. At the discharge pressure of 1.1599 MPa, NIST's superheated vapour table reaches that entropy between 54 and 55 °C. Interpolating:

- isentropic outlet: **54.2 °C**, h₂s = **284.03 kJ/kg**;
- isentropic work: 284.03 − 256.13 = **27.90 kJ/kg**.

An ideal compressor would give CH-30 a COP of 147.86 ÷ 27.90 = **5.30**, still below the Carnot figure of 6.40, because even ideal compression produces superheated discharge vapour, whose heat is rejected at temperatures above the condensing temperature, and because the expansion valve's throttling is irreversible.

## Real compression and isentropic efficiency

A real compressor needs more work than the ideal one. Friction in its bearings and seals, turbulence in its valves and passages, leakage from high pressure back to low, and heat picked up from its hot body all add to the work and end up as extra heat in the gas. The **isentropic efficiency** is the ratio of the ideal work to the actual:

η_is = (h₂s − h₁) ÷ (h₂ − h₁)

CH-30's compressor is taken as **0.70** at its design point, an illustration of a typical figure for a small compressor at a moderate compression ratio. Then:

- actual work: 27.90 ÷ 0.70 = **39.86 kJ/kg**;
- outlet enthalpy: 256.13 + 39.86 = **295.99 kJ/kg**, which NIST places at **65.1 °C**;
- COP: 147.86 ÷ 39.86 = **3.71**.

The difference between 65.1 and 54.2 °C is the compressor's losses made visible as temperature. The efficiency matters a great deal to running cost: at 0.60, CH-30's COP would be **3.18** and its compressor power **9.43 kW**; at 0.75, **3.98** and **7.55 kW**. Compressor makers publish performance tables at defined conditions, and a chiller's efficiency comes mostly from choosing a good compressor for its operating range.

```figure
type: compare
title: CH-30's compression at different isentropic efficiencies
rowhead: Isentropic efficiency
cols: Work, kJ/kg | Discharge, °C | Compressor power for 30 kW, kW | COP
caption: This is an illustration with NIST R-134a data; suction 0.31462 MPa and 7 °C, discharge 1.1599 MPa. Lower efficiency means more work and hotter gas.
- Ideal, 1.00 | 27.90 | 54.2 | 5.66 | 5.30
- 0.75 | 37.20 | 62.7 | 7.55 | 3.98
- * 0.70, CH-30 | 39.86 | 65.1 | 8.09 | 3.71
- 0.60 | 46.50 | 71.3 | 9.43 | 3.18
```

## Why a refrigerant heats so little

Compressing air heats it a great deal, as anyone who has felt a tyre pump's hose knows. For an ideal gas compressed isentropically, the absolute temperature rises with the pressure ratio raised to the power (γ − 1) ÷ γ, where γ is the ratio of the gas's specific heats. For air, γ = 1.4 and the power is 0.286.

CH-30's compression ratio is 1.1599 ÷ 0.31462 = **3.69**. Air at 7 °C compressed isentropically through that ratio would leave at 280.15 × 3.69^0.286 = 406.7 K, about **134 °C**. R-134a, compressed through the same ratio from the same temperature, leaves at **54.2 °C**.

The difference is molecular. R-134a's molecules are large and floppy, with many ways to store energy in vibrations and rotations, so its specific heat is high and its γ close to 1. Fitting the ideal-gas formula to NIST's result gives an effective γ of about **1.14** for this compression. Energy put into compressing the gas spreads across all those internal motions instead of raising its temperature. That is one of the properties that makes a good refrigerant, and it is why refrigerant compressors run much cooler than air compressors at the same ratio. WORKOS's [gas compression process calculator](/tools/gas-compression-process/) and [compressor power calculator](/tools/compressor-power/) work the ideal-gas versions of these sums for air.

```figure
type: bars
title: Isentropic discharge temperature through a 3.69 compression ratio from 7 °C
unit: °C
max: 140
caption: Air from the ideal-gas formula with γ = 1.4; R-134a from NIST's entropy data. A large, complex molecule stores compression energy in internal motions, not temperature.
- Air, γ = 1.4 | 134
- * R-134a, NIST | 54.2
```

## Kinds of compressor

Refrigeration compressors come in several mechanical forms, and the form affects how efficiency varies with conditions.

- **Reciprocating** compressors use pistons and valves. They are robust and suit a wide range of ratios, but their re-expansion of clearance gas lowers their volumetric efficiency as the ratio rises.
- **Scroll** compressors trap gas between two interleaved spirals, one fixed and one orbiting, and squeeze it towards the centre. They have few moving parts, run quietly and are common in chillers of CH-30's size. A scroll has a built-in volume ratio, and it is most efficient when the system's pressure ratio matches it; well above or below, it over- or under-compresses and loses efficiency.
- **Screw** compressors use meshing helical rotors, also with a built-in volume ratio, and suit larger capacities.
- **Centrifugal** compressors accelerate the gas with an impeller and convert its speed into pressure. They suit large chillers, and their behaviour at low load and high lift needs careful control.

Whatever the form, the compressor maker's tables give capacity and power at defined evaporating and condensing temperatures and superheat, and they are what a chiller's performance is built from. An isentropic efficiency is a convenient summary of those tables at one point, not a constant: it varies with the pressure ratio and speed.

## Oil in the circuit

Every compressor needs lubrication, and in most refrigeration systems a little of the compressor's oil travels round the circuit with the refrigerant. The oil must come back. It is carried along the discharge and liquid lines easily, mixed with liquid refrigerant, but in the evaporator and the suction line it is carried only by the vapour's velocity. A suction line that is too large for the flow, or a long vertical rise at low load, lets oil settle, and the compressor slowly runs short.

Suction lines are therefore sized for a minimum vapour velocity, as well as for an acceptable pressure drop, and rises are arranged so that oil can be carried up them at the lowest load the system will see. A compressor whose oil level falls in its sight glass over a few hours of low-load running, and recovers at full load, is losing oil to the circuit. The oil also matters to the refrigerant: R-134a needs synthetic oils of the type the compressor maker specifies, and mixing oils, or using the wrong one after a repair, can damage the compressor.

## The motor

CH-30's compressor is **hermetic**: its electric motor is sealed inside the compressor's shell, cooled by the suction vapour flowing over it. The motor's losses, as heat, therefore go into the refrigerant before it is compressed, which raises the suction temperature inside the shell and the discharge temperature after it, and which is why a hermetic compressor's measured efficiency is usually quoted from electrical input to refrigerant output.

This is an illustration. With a motor efficiency of 90%, the 8.09 kW of compression work needs **8.99 kW** of electrical input, and 0.90 kW of motor losses appear as heat in the refrigerant, all of which the condenser must then reject. Chapter 8 adds the condenser fans and controls to find the chiller's total electrical demand.

**Open** compressors, with the motor outside the shell driving through a shaft seal, put their motor losses into the plant room air instead. They are used in larger and ammonia systems, where the refrigerant is incompatible with motor windings or the motors are large.

## What raises the discharge temperature

A compressor's discharge temperature rises with:

- **compression ratio**: at 55 °C condensing instead of 45 °C, CH-30's discharge would be about **77 °C** (Chapter 7);
- **suction superheat**: warmer vapour in means warmer vapour out, for the same ratio;
- **lower efficiency**: from wear, leaking valves or the compressor working away from its best conditions;
- **lower evaporating pressure**: which raises the ratio.

Compressor makers set limits on discharge temperature, because oil breaks down and valves suffer if the gas gets too hot, and many compressors have a discharge temperature sensor that stops them before the limit. A rising discharge temperature with no change in conditions is an early sign of a fault: a refrigerant shortage, a starving expansion valve, a dirty condenser or a failing compressor.

Measuring it is easy: a temperature sensor clamped to the discharge pipe a short distance from the compressor, insulated from the air, reads within a few kelvin of the gas inside. Logged alongside the suction and discharge pressures and the water and air temperatures, it gives a running record of the compressor's condition. A discharge temperature that is unusually low is worth attention too: it can mean liquid refrigerant is reaching the compressor with the suction gas, which dilutes the oil and can damage valves and scrolls.

## Capacity control

A compressor sized for the 30 kW peak runs most of the time at part load (Chapter 2). The common ways of matching it to the load, each with its own effect on efficiency:

- **on-off cycling**, simplest, with a buffer tank to keep the cycles long;
- **variable speed**, through an inverter drive, which lowers the flow in proportion to speed and keeps the compressor running smoothly; at part load the heat exchangers are oversized for the flow, the lift falls, and efficiency often rises;
- **cylinder unloading** or **slide valves** on reciprocating and screw compressors;
- **multiple compressors**, staged in and out as the load changes;
- **hot-gas bypass**, which recirculates discharge gas to keep the compressor loaded at low demand, and wastes energy doing so.

CH-30 uses a fixed-speed scroll compressor with a buffer tank, as an illustration; Chapter 8 compares a variable-speed alternative.

## The error: a starved evaporator

This is an illustration. During a service visit, a technician adjusted CH-30's thermostatic expansion valve to raise its superheat setting from 5 to 15 K, intending to protect the compressor from liquid during start-ups. The next week, the compressor tripped twice on high discharge temperature on hot afternoons, and the leaving water temperature crept up at full load.

With the valve passing less refrigerant, the evaporator was starved: more of its surface was spent superheating vapour, which transfers heat poorly, and less boiling liquid. To take in the same heat with less effective surface, the evaporating temperature fell, to about **−2 °C**, with the suction vapour leaving at 13 °C. Working that cycle from NIST's data:

- discharge temperature **77.3 °C**, against 65.1 °C at the design setting;
- compression ratio **4.26** instead of 3.69;
- at the compressor's fixed suction volume of about 48.5 m³/h, capacity about **26.0 kW**, 13% down, and COP **3.31**, 11% down.

The evaporator also ran closer to the water's freezing point. The superheat was reset to 5 K, the discharge temperature returned to about 65 °C, and the start-up concern was dealt with properly, by checking that the compressor's crankcase heater was working so that refrigerant did not migrate into the oil while the chiller was off.

```figure
type: checklist
title: Compressor checks on a running chiller
caption: Discharge temperature is the compressor's thermometer; read it with the pressures. The last line is this chapter's error.
- Discharge temperature against the design figure for the conditions | about 65 °C at 2 °C and 45 °C
- Compression ratio from absolute pressures | 3.69 at the design point
- Suction superheat at the valve's design setting | 5 K
- Electrical input against the compressor maker's table | about 9.0 kW at the design point
- Crankcase heater working during off periods | protects against refrigerant in the oil
- x Superheat raised to 15 K to protect the compressor | evaporator starved; discharge 77 °C; capacity down 13%
```

## Exercise: a worn compressor

After some years, CH-30's compressor's isentropic efficiency has fallen to **0.62** at the design conditions. Find the work per kilogram, the discharge enthalpy and temperature, the compressor power for 30 kW and the COP. NIST's superheated data at 1.1599 MPa give 296.97 kJ/kg at 66 °C and 298.05 kJ/kg at 67 °C, and 300.21 kJ/kg at 69 °C and 301.28 at 70 °C.

**Worked answer.**

- Work: 27.90 ÷ 0.62 = **45.00 kJ/kg**.
- Discharge enthalpy: 256.13 + 45.00 = **301.13 kJ/kg**, which lies between 69 and 70 °C: about **69.9 °C**.
- Power: 0.2029 × 45.00 = **9.13 kW**, 13% more than when new.
- COP: 147.86 ÷ 45.00 = **3.29**.

A worn compressor shows itself as more power and a hotter discharge at the same pressures, and Chapter 9's log sheet is where those two numbers are compared with their values at commissioning. Tracking both against the design figures, at the same water and air temperatures, finds the wear before the compressor fails.
