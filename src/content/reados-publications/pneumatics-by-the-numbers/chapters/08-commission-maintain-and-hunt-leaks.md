---
book: pneumatics-by-the-numbers
chapterSlug: commission-maintain-and-hunt-leaks
order: 8
title: "Commission, maintain and hunt leaks"
description: "Commission a pneumatic station against its brief, record its settings, maintain it on a schedule informed by stroke-time data, and measure, find and fix compressed air leaks so they stay fixed."
draft: false
---

A pneumatic station is not finished when it first works. It is finished when it has been shown to do everything its brief required, including the things that should only happen when something goes wrong, and when the settings that make it work are written down so the next person can restore them. After that, it needs looking after: small, regular checks that catch wear before it causes a missed reject or a stopped line. And the air system that feeds it needs the same attention, because leaks grow quietly until someone measures them.

This chapter commissions the reject station against Chapter 1's brief, records its settings, sets a maintenance schedule that uses the stroke-time data the controller already collects, measures the factory's leaks with a simple compressor test, runs a leak survey and repair, and makes the improvement last. The failure case is the leak program that faded after its first success, until the leaks were nearly back where they started.

## Commission against the brief

Commissioning tests the station against what it was meant to do, not just whether it moves. The maintenance lead turned the brief from Chapter 1, the fail-state decisions from Chapter 4 and the safety requirements from Chapter 7 into a commissioning checklist, and worked through it with the production supervisor and the machinery safety adviser.

```figure
type: checklist
title: Commissioning the reject station
caption: This is an illustration of the commissioning checklist. Each line was tested, the result recorded and any failure fixed and retested before the station went into production.
- 50 forced rejects at line speed, at the busiest hour, with the heaviest, lightest and most awkward cartons | all pushed clear, chute eye confirmed each one
- Power removed mid-stroke | pusher retracted and stayed retracted
- Air removed and restored | slow retraction through the soft-start valve, no other movement
- Guard door opened during operation | line stopped, pusher could not fire, gauge fell to zero
- Pressure lowered at the regulator | pressure switch tripped at 4.5 bar and stopped the line
- Isolation procedure carried out by two fitters | gauge at zero, start button produced no movement
- Stroke-time and chute-eye alarms forced | each stopped the line with the right message
- x Accepting the station because it ran a shift without trouble | that tests the easy cases only
```

Three items failed first time and were fixed before acceptance. The chute eye's timing window was too short for the lightest cartons, which slid more slowly into the chute. The pressure switch tripped at 4.3 bar rather than 4.5 and was reset. And the soft-start valve was found to be fitted after the filter-regulator rather than before it, so the regulator's bowl filled with a sudden rush of air on restart; the components were swapped to match the drawing.

## Record the settings

A station tuned by hand can be untuned by hand. Every setting that makes it work was recorded on one sheet, kept in the machine's file and inside the control cabinet door:

- regulator: **6.0 bar**;
- pressure switch: trips at **4.5 bar**;
- extend and retract flow controls: turns from fully closed, with locking caps;
- cushion needles at each end: turns from fully closed;
- firing point: **100 mm** lead at the design belt speed, calculated from the conveyor encoder;
- stroke times at commissioning: extend about **0.43 s**, retract about **0.45 s**;
- chute-eye window: **0.8 s** after the valve fires.

When anything is changed, the sheet is updated, dated and initialled. When anyone suspects the station is not right, the first step is to compare it with the sheet.

## Hand over to the people who run it

Commissioning ended with a handover. The maintenance lead walked the shift leaders and the maintenance team through the station: what it does, what each alarm means and what to do about it, where the settings sheet and circuit drawing are kept, how to isolate it, and which jobs operators may do, such as clearing a jam through the interlocked door, and which they must leave to maintenance. The machine's file holds the brief, the risk assessment, the circuit drawing, the settings sheet, the commissioning results, the makers' instructions for each component and the training records. Everything a successor would need to understand the station is in one place.

## Keep spares that match the drawing

Chapter 4's failure case showed what happens when a spare looks right and behaves differently. The station's spares were chosen from the circuit drawing, by exact part number: a complete valve, a solenoid coil, a set of cylinder seals, two silencers, a position sensor, a flow control, and a length of each colour of tube. Each store bin is labelled with the part number, the function and the machine it belongs to. A complete guided cylinder unit was not stocked, because the maker could supply one within two days and the line could run with manual rejection in the meantime, a decision recorded with its reasons. Holding the right spares turned most failures into a half-hour repair.

## Record faults and learn from them

Every fault on the station, however small, goes into a short log: the date, what happened, what was found, what was done and how long the line was stopped. The log is reviewed at the six-monthly check. Patterns matter more than single events. In the first year, two of the station's faults were silencers clogged with flour dust, so the silencer check moved from monthly to fortnightly on line 2. One was a position sensor knocked out of place during cleaning, so the sensors were fitted with protective covers. Small changes like these, driven by the log, are how a maintenance schedule improves from a reasonable guess into something fitted to the real machine.

## Maintain on a schedule

Pneumatic components wear slowly and fail in predictable ways: seals harden and leak, guide bearings wear, silencers clog, hoses crack, fittings loosen with vibration, filter elements fill. A short schedule catches most of it.

```figure
type: timeline
title: The reject station's maintenance schedule
caption: This is an illustration. Intervals were set from the makers' recommendations and the factory's experience, and are reviewed after the first year using the stroke-time and fault records.
- Every shift | Operators | check the filter-regulator bowl and drain any water; report any new hissing
- Weekly | Maintenance | test the guard interlock; review the stroke-time trend; check the bracket and plate fixings
- Monthly | Maintenance | inspect hoses and fittings; check the exhaust silencers; check the chute eye's alignment
- Six-monthly | Maintenance | inspect the guide rods and bearings; check cushion and flow settings against the sheet
- *Yearly | Maintenance and safety adviser | review the risk assessment, isolation procedure and training records
```

## Let the stroke times tell you

The controller logs the extend and retract time of every stroke, as Chapter 3 described. Plotted weekly, those times are a health record. A slow rise in extend time over weeks suggests falling supply pressure, a clogging silencer on the retract side, or seal wear. A sudden jump suggests something has changed: a flow control turned, a hose kinked, water in the valve, as Chapter 6's failure case showed. A difference between the extend and retract trends points to one side of the circuit.

The maintenance lead set an alarm that warns if the average extend time over a shift exceeds **0.5 s**, about 15% above the commissioned value, and stops the line if any single stroke exceeds the 0.6 s limit from Chapter 3. In the first year, the warning was raised three times: once by a silencer clogged with flour dust, once by a worn regulator, and once by the dryer bypass in Chapter 6. Each was fixed before a reject was missed.

## Measure the factory's leaks

Chapter 5 showed that leaks cost far more than the machines that do useful work. To find out how much the factory was losing, the maintenance lead used a simple test described in the U.S. Department of Energy's compressed air sourcebook, suited to compressors with load and unload control.

On a Sunday, with all production equipment switched off but the air system pressurised, the compressor was left running. With nothing using air, it loaded only to replace what leaked away. The maintenance lead timed several load and unload periods and averaged them.

```figure
type: formula
title: Estimating leakage from the compressor's load and unload times
formula: leakage (% of compressor capacity) = T × 100 ÷ (T + t)        where T is the average loaded time and t the average unloaded time
caption: This is an illustration for the factory's 1.2 m³/min compressor, after the pressure was lowered in Chapter 6. The cost assumes 4,000 hours a year at 7 kW per m³/min and A$0.30 a kilowatt-hour.
- Average loaded time | 0.6 minutes
- Average unloaded time | 1.8 minutes
step: leakage = 0.6 × 100 ÷ (0.6 + 1.8) = 25%
step: leak flow ≈ 0.25 × 1.2 = 0.3 m³/min
step: cost ≈ 0.3 × 7 kW × 4,000 h × A$0.30 ≈ A$2,520 a year
```

A quarter of the compressor's capacity was leaking away. The sourcebook describes leak rates of 20 to 30 percent as typical of poorly maintained systems, and less than 5 to 10 percent as achievable with proactive detection and repair. The test cannot see leaks in parts of the system that were isolated during the test, so the maintenance lead left every machine's isolating valve open.

## Find, tag and fix

The survey was done on a weekday evening after production, when the factory was quiet and the air was still on. The maintenance lead hired an ultrasonic leak detector, which picks up the high-frequency sound of escaping air even when it is inaudible, and walked every metre of the main, every drop, every machine and the compressor room. Each leak found was given a numbered tag at its location and entered in a log with its position, type and an estimated size.

```figure
type: stack
title: The 34 leaks found in the first survey, by type
unit: leaks
caption: This is an illustration. Most leaks were at connections, which vibration and repeated disconnection loosen over time. The pattern matches the sourcebook's list of common problem areas.
- Push-in fittings and quick couplings | 14
- Hoses, cracked or chafed | 8
- Regulators and filter bowls | 5
- Valve exhausts and cylinder rod seals | 4
- Condensate drains stuck open | 3
```

Leaks were repaired largest first, many the next morning with spare fittings and hose from the store, the rest over three weeks as parts arrived. Each tag was removed and the log marked when its leak was fixed and checked. Every repair was checked again with the detector, because a tube pushed back into a fitting can still leak if its end is scored or cut at an angle. Three repairs needed a second attempt, each on a tube that had to be cut back square to undamaged material. The work took about **24 hours** of maintenance time and about **A$600** of parts, roughly **A$2,520** in total at the internal rate of A$80 an hour.

The load and unload test was repeated. The average loaded time had fallen to about **0.25 minutes** and the unloaded time risen to about **2.75 minutes**, giving leakage of about **8.3%**, a leak flow of about **0.1 m³/min** and an electricity cost of about **A$840** a year. The saving, about **A$1,680** a year, repaid the program's cost in about a year and a half, and the compressor ran unloaded more often, which would extend its service life.

## A failure case: the program that faded

This is an illustration. After the first survey, everyone was pleased. The leak tags were gone, the compressor was quieter, and the maintenance lead moved on to other projects. Nobody was named to keep the program going, and no further survey was scheduled.

Eighteen months later, the business's accountant noticed that electricity use had crept up again without any increase in production. The maintenance lead repeated the load and unload test and found leakage back at about **22%**, costing about **A$2,200** a year, nearly where it had started. The new leaks were in the same kinds of places: fittings loosened by vibration, hoses chafed against frames, a drain stuck open.

The detection came from the electricity bill, a slow and indirect signal. Leaks are not fixed once; they are managed, because new ones appear continuously. The correction was to make the program permanent. The maintenance lead was named as its owner. The load and unload test is now run on the first Sunday of every quarter and its result reported on the monthly operations report, with a target of below 10%. A quick ultrasonic walk follows each test, and operators can tag any leak they hear, with tags kept in a box at each line. After a year of this, leakage has stayed between 7% and 10%.

## Close the loop with the brief

A year after commissioning, the maintenance lead reviewed the station against the brief from Chapter 1. The chute eye had counted every reject the checkweigher identified, with no underweight cartons found by customers. The station had stopped the line on alarm eleven times, each for a real fault, and none had caused an injury. Its settings sheet had been updated twice, both for documented changes. And the work on the air system that the station prompted, the pressure survey, the restrictions fixed, the pressure lowered and the leaks managed, had saved far more each year than the station cost to run. The wider approach to finding and fixing waste across a building's energy use is covered in [Cutting energy use in business premises](/reados/collections/lean-and-continuous-improvement/cutting-energy-use-in-business-premises/).

## How this applies to a small Australian business

Small factories often commission equipment by running it until it seems fine, and maintain air systems only when something stops. Commission against the brief, including the fail states, and do not accept until every line passes. Write down every setting. Keep a short maintenance schedule and use the data the controller already collects. Measure your leaks with a load and unload test on a quiet day; it costs nothing but a few hours. Find leaks with an ultrasonic detector when the factory is quiet, tag them, fix the largest first and test again. Then name an owner, repeat the test every quarter and report the number, because leaks come back.

## Exercise: a neighbour's leak test

A neighbouring business with the same size of compressor, 1.2 m³/min, runs the load and unload test and finds an average loaded time of **0.7 minutes** and an average unloaded time of **1.3 minutes**. Using the same assumptions, 4,000 hours a year, 7 kW per m³/min and A$0.30 a kilowatt-hour, what is its leakage, leak flow and annual cost? If it brought leakage down to **8%**, what would it save each year?

**Worked answer.** Leakage is **0.7 × 100 ÷ (0.7 + 1.3) = 35%**. The leak flow is about **0.35 × 1.2 = 0.42 m³/min**, costing about **0.42 × 7 × 4,000 × 0.30 ≈ A$3,530** a year. At 8%, the leak flow would be about **0.096 m³/min**, costing about **A$810** a year, a saving of about **A$2,720** a year. With 35% of its compressor's output leaking, the business may also find that a planned compressor upgrade is unnecessary, which is often the largest saving of all.
