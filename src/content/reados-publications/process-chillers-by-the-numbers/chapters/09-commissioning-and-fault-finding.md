---
book: process-chillers-by-the-numbers
chapterSlug: commissioning-and-fault-finding
order: 9
title: "Commissioning and fault-finding"
description: "Proving a chiller against its rating, the water-side capacity test and refrigerant-side checks, a log sheet, CH-30's fault signatures in numbers, and a cool-day test that passed a short chiller."
draft: false
---

A chiller that has been delivered, installed and switched on is not yet known to work. It may cool the water, but whether it delivers its rated capacity, at its rated power, with its controls and safety devices doing what they should, has to be shown by measurement. The same measurements, repeated in service and written down, are the most powerful tool for finding faults: almost every fault in the earlier chapters left a numerical signature in the pressures, temperatures and power long before it stopped the machine.

This chapter sets out how a process chiller is commissioned, works through a water-side capacity test and the refrigerant-side checks that go with it, lays out a log sheet, gathers CH-30's fault signatures from the earlier chapters into one table, says who may work on the refrigerant circuit, and ends with a capacity test on a cool day that passed a chiller that was short of refrigerant.

## What commissioning proves

Commissioning a process chiller shows four things, and each needs its own check.

1. **Capacity**: the chiller removes its rated heat at, or corrected to, its rating conditions.
2. **Efficiency**: its electrical input at that capacity matches the maker's figures.
3. **Control**: it holds its leaving water temperature at the setpoint across the range of load, without short cycling.
4. **Protection**: its flow switch, freeze protection, high- and low-pressure cut-outs and other safety devices work, and the alarms reach someone.

The installing contractor does the work; the owner, or an engineer acting for the owner, witnesses it and keeps the record. The maker's commissioning procedure and the contractor's licensed technicians govern the refrigerant side.

```figure
type: steps
title: Commissioning a process chiller
caption: An outline for orientation; the maker's procedure governs the details. Each step leaves a record that later fault-finding compares against.
- Check the water circuit | flushed, strainers clean, air vented, flow measured
- Check the refrigerant circuit | leak-tested, evacuated, charged by weight
- Prove the protections | flow switch, freeze cut-out, pressure cut-outs, alarms
- *Run a capacity test | water flow and temperatures, at or corrected to rating conditions
- Read the refrigerant side | pressures, superheat, subcooling, discharge temperature, power
- Record the baseline | the log sheet that every later reading is compared with
```

## The water-side capacity test

The capacity test uses Chapter 2's method on the chiller itself: measure the water flow through the evaporator and the temperatures entering and leaving, and multiply.

Q = ṁ × c_p × (T_in − T_out)

With NIST's mean specific heat of 4.189 kJ/(kg·K) between 12 and 17 °C, as an illustration:

- if the flow is **1.432 kg/s** and the water enters at 17.0 °C and leaves at 12.1 °C, a difference of 4.9 K, the capacity is 1.432 × 4.189 × 4.9 = **29.4 kW**.

The test is only as good as its instruments: a calibrated flow meter or an accurately measured pump curve, and matched temperature sensors placed where the water is well mixed, close to the evaporator's connections. Chapter 2 showed that a 0.5 K offset between the sensors changes a 30 kW reading by 10%. And the test must hold the load steady for long enough, typically some tens of minutes, for the readings to settle; a buffer tank that is warming or cooling during the test adds or subtracts heat that is not the chiller's.

## Correcting to the rating conditions

A chiller's capacity changes with the ambient temperature and the leaving water temperature (Chapter 7), so a test result means nothing until it is compared with the capacity expected at the conditions of the test. The maker's tables give that figure; this book's NIST calculations give an estimate for CH-30.

This is an illustration. At 25 °C ambient, with the same 10 K condenser approach, CH-30 condenses at about 35 °C, and Chapter 7 found that its fixed compressor should then deliver about **33.0 kW**. At 35 °C ambient, the design condition, it should deliver **30.0 kW**. A test on a mild day that shows 30 kW is therefore a failing result, not a pass: the chiller should be delivering 10% more than that in those conditions. That arithmetic is the subject of this chapter's error.

## The refrigerant-side checks

The water side shows what the chiller delivers; the refrigerant side shows why. With the chiller running steadily at full load, the technician reads:

- **suction pressure**, converted to the evaporating temperature (Chapter 4);
- **discharge pressure**, converted to the condensing temperature;
- **suction line temperature**, giving the superheat;
- **liquid line temperature**, giving the subcooling;
- **discharge line temperature**;
- **electrical input** to the compressor and fans;
- the **water and air temperatures** at the time.

From those readings, the cycle can be worked as in Chapter 3 and checked by an energy balance: the condenser must reject the evaporator's heat plus the compressor's work. With an airflow measurement across the condenser, or a heat meter on a water-cooled condenser, the balance can be closed from measurements; without one, the expected condenser heat is the measured capacity plus the compressor's electrical input less its small external losses. A balance that does not close within a few per cent points to an instrument error before it points to a fault.

```figure
type: formula
title: The chiller's energy balance as a commissioning check
formula: Q_condenser ≈ Q_evaporator + P_compressor
caption: This is an illustration at CH-30's design point. For a hermetic compressor, nearly all the electrical input ends up in the refrigerant, so it is used for P; a balance that misses by more than a few per cent points first to an instrument.
- Q_evaporator | 30.0 kW, from the water-side test
- P_compressor | 8.99 kW electrical, 8.09 kW of it as compression work
step: Expected condenser heat: about 30.0 + 8.99 = 39 kW, of which the cycle calculation gives 38.09 kW plus about 0.9 kW of motor losses
step: Compare with the condenser's measured heat, or check the refrigerant-side readings against Chapter 3's states
```

## Testing the controls and protections

A chiller's capacity matters only if it is controlled, and its protections matter only if they work. Commissioning tests them one at a time, with the contractor operating the machine and the owner watching:

- **Setpoint control.** With the load reduced, by closing some mould circuits, the leaving water temperature should stay within its control band, and the compressor should run in cycles long enough to satisfy its maker's minimum run time. Short cycling at light load points to a buffer tank that is too small or a control band that is too narrow.
- **Flow switch.** With the pump stopped or a valve closed, the compressor must stop before the evaporator's water can freeze. This is the most important protection on a chiller that evaporates near 0 °C.
- **Freeze protection.** The low leaving-water cut-out is checked against its setting, usually by the maker's simulated method rather than by actually freezing anything.
- **Pressure cut-outs.** The high-pressure cut-out, which stops the compressor if the condensing pressure rises too far, for example when a condenser fan fails, and the low-pressure cut-out, which stops it if the suction pressure falls too far, are proved by the licensed technician by the maker's method.
- **Alarms.** Every fault that stops the chiller should raise an alarm where someone will see it, because a stopped chiller in a moulding shop is noticed only when the moulds overheat.

The results go on the commissioning sheet beside the capacity test.

## Trending, not just testing

A single test shows the chiller on one day. The log sheet's value is in the trend. Plotting, month by month, the condenser approach, the subcooling, the discharge temperature and the system COP at similar conditions shows slow faults, a coil fouling with dust, a charge slowly leaking, a compressor wearing, long before any of them trips the machine or warms the water. Chapter 8 showed that a fouled condenser can cost a fifth of the chiller's electricity for a whole summer before anyone notices the water temperature. The trend notices first.

## The log sheet

The baseline readings at commissioning are the reference for every later reading, and the shop records the same set at regular intervals: monthly for CH-30, and whenever its performance seems to change. The log sheet holds, as an illustration of CH-30's design point:

- leaving and returning water temperatures: **12.0 and 17.0 °C**; water flow **1.43 kg/s**;
- ambient air at the condenser: **35 °C**;
- suction **213 kPa gauge** (2 °C); discharge **1,059 kPa gauge** (45 °C);
- superheat **5 K**; subcooling **5 K**; discharge temperature **65 °C**;
- compressor input **9.0 kW**; fans **1.2 kW**.

Readings taken at other conditions are compared with the expected figures for those conditions, not with the design point; a mild-day reading of 35 °C condensing is normal, and the same reading on a 35 °C day would show a remarkably clean condenser or a faulty gauge.

## CH-30's fault signatures

The earlier chapters each found a fault through its numbers. Gathered together, they form a diagnostic table for CH-30. READOS's Heat Pumps and Refrigeration by the Numbers gives a general table of [common refrigeration faults and their signs](/reados/publications/heat-pumps-and-refrigeration-by-the-numbers/the-vapour-compression-cycle/); the figures below are the specific values this book calculated for CH-30.

```figure
type: compare
title: CH-30's fault signatures at full load and 35 °C ambient
rowhead: Fault
cols: Condensing | Evaporating | Superheat | Subcooling | Discharge | Other signs
caption: This is an illustration from the calculations in Chapters 4 to 7. Read each reading against the expected value at the conditions; it is the pattern, not a single number, that identifies the fault.
- * Normal, design point | 45 °C | 2 °C | 5 K | 5 K | 65 °C | capacity 30 kW, COP 3.71
- Dirty condenser coil | about 52 °C | about 2 °C | normal | normal | about 74 °C | approach 17 K; COP down 18% (Chapter 7)
- Air in the circuit | high, about 49 °C by pressure | normal | normal | odd for the pressure | high | standstill pressure 80 kPa above saturation (Chapter 4)
- Blocked filter-drier | normal | low | high | normal at condenser | high | 3 K drop across the drier; bubbles in sight glass (Chapter 5)
- Starved evaporator | normal | about −2 °C | about 15 K | normal | about 77 °C | capacity down about 13% (Chapter 6)
- Worn compressor | normal | normal | normal | normal | about 70 °C | power up about 13% for the same cooling (Chapter 6)
- Short of refrigerant | slightly low | low | high | low, near 0 to 1 K | high | bubbles in sight glass; capacity down
```

## Reading the table

Three habits make the table useful in practice.

- **Start with the water and air.** Before reading any refrigerant figure, confirm that the water flow, the leaving water temperature and the air entering the condenser are what the reading assumes. A low water flow, a closed mould valve or a condenser drawing in its own hot exhaust air produces signatures that look like refrigerant faults.
- **Look for the pattern.** A high condensing temperature alone could be a dirty coil, a failed fan, air in the circuit or simply a hot day. With a normal subcooling and a large approach, it is the coil; with a normal approach on a hot day, it is the weather; with a standstill pressure above saturation, it is air.
- **Change one thing at a time.** Clean the coil, then read again. A technician who cleans the coil, adds refrigerant and adjusts the expansion valve on the same visit cannot tell which of the three fixed the problem, and may have created a new one.

Most faults on a chiller of CH-30's size are found this way, by an owner who knows the normal readings and a licensed technician who is shown the trend.

## Who may work on the refrigerant circuit

Reading gauges that are permanently fitted, and logging temperatures and power, are owner's tasks. Connecting service gauges, adding or recovering refrigerant, and opening the circuit are work on a refrigerant circuit, and in Australia that work is done by people holding a refrigerant handling licence, working for a business with a refrigerant trading authorisation, under the scheme the Australian Refrigeration Council administers. READOS's chapter on [refrigerants, rules and safety](/reados/publications/heat-pumps-and-refrigeration-by-the-numbers/refrigerants-rules-and-safety/) sets out the owner's obligations and the safety classes of refrigerants. The owner's part is to know what normal looks like, to notice when the numbers drift, and to call a licensed technician with the readings in hand.

## The error: a cool-day test

This is an illustration. CH-30 was commissioned on a mild spring day with the air at 25 °C. The water-side test showed **31.0 kW**: flow 1.432 kg/s, water entering at 17.0 °C and leaving at 11.83 °C. The commissioning sheet compared it with the rated 30 kW, recorded a pass, "3% above rating", and the chiller was accepted.

On the first hot afternoon in December, with the air at 35 °C, the moulds' water rose to 13.5 °C. A test that afternoon showed **28.2 kW**, 6% below rating. The moulder's engineer went back to the commissioning sheet and did the comparison that should have been done in spring: at 25 °C ambient, CH-30 should have delivered about **33.0 kW**, not 30. The spring result of 31.0 kW had been about **6% short** even then. The cool day had hidden the shortfall.

The refrigerant-side readings from the commissioning sheet confirmed it: subcooling of only about **1 K** against the design's 5 K, and superheat slightly high. Both pointed to a shortage of refrigerant. The licensed contractor found that the charge had been estimated from the sight glass, not weighed in, and was about a tenth short. The circuit was leak-tested, the refrigerant recovered and the correct charge weighed in; the next hot-day test showed 30.1 kW. The moulder's commissioning sheet now states the expected capacity at the test's actual conditions, and requires the charge to be recorded by weight.

```figure
type: checklist
title: Commissioning and fault-finding checks
caption: A test is a comparison with an expectation; the expectation must be for the conditions of the test. The last line is this chapter's error.
- Flow meter and matched temperature sensors, steady load | sensors swapped and re-read to cancel offsets
- Capacity compared with the expected figure at the test's conditions | 33.0 kW expected at 25 °C ambient
- Refrigerant-side readings recorded with the water and air temperatures | superheat, subcooling, discharge temperature
- Energy balance checked | condenser heat about evaporator heat plus compressor input
- Charge recorded by weight; log sheet kept monthly | baseline for every later reading
- x Mild-day result compared with the 35 °C rating | 31.0 kW "passed"; it was 6% short
```

## Exercise: reading a log entry

A monthly log entry for CH-30, taken on a 30 °C afternoon at full load, shows: water flow **1.40 kg/s**, entering at **16.8 °C** and leaving at **12.0 °C**; total electrical input **10.4 kW**, of which **1.2 kW** is the fans and **0.1 kW** the controls; condensing temperature from the discharge pressure **48 °C**. Find the capacity, the system COP and the compressor's input, and say whether the reading suggests a fault.

**Worked answer.**

- Capacity: 1.40 × 4.189 × 4.8 = **28.2 kW**.
- System COP: 28.2 ÷ 10.4 = **2.71**.
- Compressor input: 10.4 − 1.2 − 0.1 = **9.1 kW**.

On a 30 °C day, with a 10 K approach, CH-30 should condense at about 40 °C and deliver about 31.5 kW with a lower input than at the design point. Condensing at 48 °C on a 30 °C day is an approach of 18 K, and the capacity and COP are both below what the conditions should give. The pattern matches a dirty or obstructed condenser coil, which is the first thing to check, before calling the licensed technician for the refrigerant-side readings.
