---
book: combustion-by-the-numbers
chapterSlug: metering-gas-and-checking-firing-rate
order: 5
title: "Metering gas and checking the firing rate"
description: "What a gas meter measures, correcting metered volumes to standard conditions, turning cubic metres into megajoules, clocking a meter to check a burner's input, and a correction left out."
draft: false
---

A burner's firing rate, the energy it releases per hour, is the single most important number in its commissioning. Too low, and the furnace is slow and its flame may be unstable; too high, and the burner runs short of air, overheats its own parts and those of the furnace, and makes carbon monoxide. The firing rate is set by gas pressure at the burner, but it is checked by measuring gas flow, and that means reading a gas meter.

Gas meters measure volume, and a volume of gas means little until its pressure and temperature are known. This chapter explains what a meter measures, how to correct its readings to standard conditions, how networks turn cubic metres into the megajoules on a bill, how to clock a meter to check a burner's input, and how one missing correction factor led to TF-120's burners being set a third above their rating.

## What a gas meter measures

The meters on industrial gas supplies are mostly **positive displacement** meters: diaphragm meters for smaller loads and rotary meters for larger ones. Each one sweeps out a fixed volume per cycle and counts the cycles. Turbine and ultrasonic meters, used on large supplies, measure velocity and convert it to volume. Whatever their principle, they report the volume of gas that passed through them **at the pressure and temperature inside the meter**.

That volume depends strongly on pressure. Gas at 35 kPa gauge occupies about three-quarters of the volume it would occupy at atmospheric pressure, so the same amount of gas reads very differently on a meter at the burner's supply pressure and one at atmospheric. Temperature matters less but still counts: gas in a warm plant room in summer occupies a few per cent more volume than the same gas in winter.

## Correcting to standard conditions

To compare volumes, or to turn them into energy, they are corrected to **standard conditions**: 15 °C and 101.325 kPa absolute in the Australian gas industry. For an ideal gas, the correction is the ratio of absolute pressures times the inverse ratio of absolute temperatures. At the modest pressures of factory gas supplies, natural gas behaves as an ideal gas to within a small fraction of a per cent, so the compressibility correction is usually left out below a few hundred kilopascals.

```figure
type: formula
title: Metered volume to standard volume
formula: V_std = V_meter × (p_atm + p_gauge) ÷ 101.325 × 288.15 ÷ (273.15 + t)
caption: Ideal gas. Pressures in kPa, t in °C. The product of the pressure and temperature ratios is the correction factor; networks bill with an equivalent factor for each meter.
- V_meter | volume read on the meter, m³
- p_gauge | gas pressure at the meter, kPa gauge
- p_atm | atmospheric pressure, kPa
- t | gas temperature at the meter, °C
step: TF-120's sub-meter at 35 kPa gauge, 20 °C, 101.325 kPa: pressure ratio 1.3454 × temperature ratio 0.9829 = 1.3225
step: each cubic metre on the sub-meter is 1.3225 standard cubic metres
```

The [gas volume tool](/tools/gas-law/) does this conversion for any pair of states, including the change from gauge to absolute pressure. Entered with a volume or flow at state 1 at 0.35 bar gauge and 20 °C, and state 2 at 0 bar gauge and 15 °C, with atmospheric pressure of 1.01325 bar, it returns the standard volume and the ratio between the two.

### Atmospheric pressure and altitude

The correction uses absolute pressure, so atmospheric pressure appears in it too. For a meter at 35 kPa gauge, a site at an altitude where the atmosphere averages 98 kPa rather than 101.3 kPa has a correction factor about **2.4%** lower. Weather changes atmospheric pressure by a kilopascal or two, which moves the correction by about a per cent for a meter at 35 kPa and by less for a low-pressure meter. Networks allow for altitude in the factors they apply to each meter; a site engineer correcting a sub-meter should use the local atmospheric pressure too.

## From cubic metres to megajoules

Gas is sold by energy, not volume. Networks convert each meter's corrected volume to megajoules with a **heating value**, the gross energy per standard cubic metre, which they measure for the gas in their network and average over the billing period. Australian Gas Networks describes its bills in exactly these terms: the volume of gas used is converted to energy using a heating value and a pressure correction factor.

```figure
type: steps
title: From a meter reading to a bill
caption: The network's factors are on the bill. A site sub-meter needs the same steps with its own pressure and temperature.
- Read the meter | end reading minus start reading, m³ at meter conditions
- Correct to standard | × pressure correction factor (and temperature, if the network applies it)
- Convert to energy | × heating value, MJ per standard m³, gross
- Price | MJ × tariff, plus fixed and network charges, plus GST
```

For TF-120 this is an illustration. A typical load of 745 MJ is 745 ÷ 38.6 = **19.3 standard m³**, which the sub-meter records as 19.3 ÷ 1.3225 = **14.6 m³** at its 35 kPa. Anyone reading the sub-meter needs to know which of those two numbers it shows.

## Clocking a meter to check a firing rate

To check a burner's input, the meter is timed while the burner fires steadily at the condition being checked, usually high fire, with every other appliance on the same meter switched off. The test dial on a diaphragm meter turns once for a known volume, and timing a whole number of turns gives the actual flow. The flow is then corrected to standard conditions and multiplied by the heating value.

This is an illustration. With TF-120 at high fire and everything else on the sub-meter isolated, the technician times one turn of the 0.25 m³ test dial at **105 seconds**. The meter is at 35 kPa gauge and 20 °C.

```figure
type: formula
title: TF-120's firing rate from the clocked meter
formula: input = V_dial ÷ t × 3,600 × correction factor × heating value
caption: This is an illustration. The burners are rated 120 kW gross between them; a check within a few per cent of the rating is normal.
- V_dial | 0.25 m³ per turn
- t | 105 s for one turn
- correction factor | 1.3225 at 35 kPa gauge and 20 °C
- heating value | 38.6 MJ per standard m³, gross
step: actual flow = 0.25 ÷ 105 × 3,600 = 8.571 m³/h at meter conditions
step: standard flow = 8.571 × 1.3225 = 11.34 m³/h; input = 11.34 × 38.6 = 437.6 MJ/h = 121.5 kW
```

TF-120's burners are firing at **121.5 kW**, about 1.3% above their 120 kW rating, close enough for the burner maker's tolerance. Working backwards, a dial turn of about **106 seconds** corresponds to exactly 120 kW, which gives the technician a target time for future checks at the same pressure and temperature.

Several details make clocking reliable:

- **Time several turns** where the flow is low, so that a second's error in starting or stopping the watch is a small share of the total.
- **Let the burner settle** at the condition being tested before timing; a burner just lit, or a furnace still purging, is not at steady state.
- **Read the meter pressure and temperature** at the time, not from the nameplate or last year's record.
- **Isolate every other user** on the meter, including pilot burners and other appliances that cycle on their own.
- **Use the network's current heating value**, or a measured one, not a value from an old bill.

## Gas pressure and firing rate

A burner's gas flow is set by the pressure difference across its gas orifice or injector, and through a fixed orifice the flow rises with the square root of that difference. To change the firing rate by a factor, the burner pressure must change by the square of that factor. The relation is useful in both directions: it tells a technician roughly how much to adjust, and it tells an investigator how far a regulator must have been moved to produce a given change.

For TF-120, bringing the burners from 121.5 kW down to exactly 120 kW would need the burner pressure reduced to (120 ÷ 121.5)² = 0.975 of its present value, a cut of only 2.5%, which is why small firing-rate corrections need care and a good gauge. In the opposite direction, the error described below took the burners from 121.5 kW to about 159 kW, a ratio of 1.31, which needed the burner pressure raised by a factor of about **1.71**, or 71%. A change that large should never pass unremarked: it is far outside what any normal adjustment needs, and it is a sign that the calculation behind it deserves a second look. The same square-root relation, combined with the gas's density, is what lies behind the Wobbe index of Chapter 1.

## How meters go wrong

Meters are robust, but they have failure modes worth knowing before trusting one for a firing-rate check.

- **Running beyond their capacity.** Every meter has a maximum flow. A diaphragm meter pushed past it loses accuracy and wears quickly; a rotary meter overloaded can be damaged. A meter sized for a site's original load may be undersized once a new furnace is added.
- **Wear and contamination.** Diaphragm meters can drift as their diaphragms age, and rotary meters can slow if dirt reaches their impellers. A meter whose readings no longer agree with the network's, after correction, may need testing.
- **Pulsation.** A meter close to an on–off burner or a compressor sees a pulsing flow that some types measure poorly.
- **Gas colder than the room.** In winter, gas arriving from an underground main can be colder than the plant room, and a temperature correction taken from the room air overstates the gas temperature.

Most of these errors are a few per cent at most, much smaller than a missing correction factor, but they explain why one clocking is a check, not a calibration.

## The error: a correction left out

This is an illustration. After a burner service, a new technician clocked TF-120's meter at high fire and timed the same 105 seconds for one turn. But they worked out the input directly from the meter volume, without the correction factor: 8.571 m³/h × 38.6 MJ/m³ = 331 MJ/h, or **91.9 kW**. Compared with the 120 kW rating, the burners appeared to be 23% under-fired. The technician raised the gas pressure at the burners' regulators until the uncorrected calculation gave 120 kW.

Because the uncorrected figure understated the true input by the factor 1.3225, the burners were now firing at about 120 × 1.3225 ≈ **159 kW**, a third above their rating. The air supply had not changed, so the excess air fell sharply. Within an hour the operator noticed that the flue gas oxygen, which the furnace's fixed analyser displayed, had dropped from 3% to well under 1%, and that the carbon monoxide alarm had begun to warn.

The furnace was shut down and the burners returned to their original regulator settings. The supervising gasfitter recalculated the clocking with the correction and confirmed that the original setting had given 121.5 kW. The investigation produced a one-page firing rate check sheet that lists the meter's pressure and temperature and its correction factor in its first lines, and requires the flue gas oxygen and carbon monoxide to be recorded after any change to a gas pressure. A change to firing rate is also now made only by the licensed gasfitter responsible for the appliance, with the result checked against the appliance's data plate and its approval.

```figure
type: compare
title: The same clocking, with and without the correction
cols: Flow used | Calculated input | Against the 120 kW rating
rowhead: Calculation
caption: This is an illustration. A meter reading taken at line pressure must be corrected before it is turned into energy; at 35 kPa the missing factor is a third.
- Uncorrected | 8.57 m³/h | 91.9 kW | appears 23% low
- *Corrected to standard | 11.34 m³/h | 121.5 kW | 1.3% high
- After the "fix" | 14.8 m³/h standard | 158.7 kW | 32% high
```

## Sub-meters and the network's meter

A sub-meter on one appliance and the network's main meter on the site will never agree exactly. They sit at different pressures and temperatures, the network applies its own factors and averages its heating value over a billing period, and every meter has its own small error. Checking that the monthly sum of sub-meters, each corrected properly, comes within a few per cent of the network's corrected volume is a good way to find a sub-meter that has failed, a correction factor that is wrong, or an appliance nobody knew was connected.

## Using the meter between checks

A sub-meter earns its keep between firing-rate checks. Read at the start and end of each load, as Chapter 3 suggested, it gives the gas per load, and a chart of gas per load against load mass shows drift long before it shows on a bill. A slipping air linkage, a door seal going hard, a burner holding too high a fire through the soak: each moves the points on that chart within weeks.

The meter can also give an early warning of a leak. With every appliance on the meter off and its isolating valves open as normal, the test dial should not move at all. A dial that creeps slowly over half an hour of watching means gas is going somewhere, through a passing valve, a leaking joint or an appliance nobody switched off. Watching the dial is not a leak test; finding and testing the leak is work for the licensed gasfitter. But it is a check anyone can make, and it is worth doing whenever the gas per load rises with no other explanation, or whenever anyone notices a smell of gas.

## Exercise: a low-pressure meter in a warm room

A smaller oven on another site is supplied through a meter at **1.1 kPa** gauge in a plant room at **25 °C**, with atmospheric pressure at 101.325 kPa. Timing shows **2.000 m³** in 10 minutes at high fire. With a heating value of 38.6 MJ/m³, what is the oven's input, and what error would leaving out the correction cause?

**Worked answer.** The actual flow is 2.000 ÷ 10 × 60 = **12.00 m³/h**. The correction factor is (101.325 + 1.1) ÷ 101.325 × 288.15 ÷ 298.15 = 1.0109 × 0.9665 = **0.9770**, so the standard flow is 12.00 × 0.9770 = **11.72 m³/h** and the input is 11.72 × 38.6 = **453 MJ/h**, or about **125.7 kW**. Leaving out the correction would give 12.00 × 38.6 = 463 MJ/h, about **2.4% high**. At low meter pressure the temperature correction can outweigh the pressure correction, so the factor falls below 1. The error is small compared with the 35 kPa case, but it is in a consistent direction and adds up on every reading.
