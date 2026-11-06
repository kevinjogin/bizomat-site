---
book: variable-speed-drives-by-the-numbers
chapterSlug: specifying-commissioning-and-maintaining-drives
order: 10
title: "Specifying, commissioning and maintaining drives"
description: "How to write a drive specification from the load and the site, commission a drive step by step, record its settings, plan spares across a fleet, and keep its set-up on replacement."
draft: false
---

The earlier chapters each dealt with one aspect of a drive: its switches, losses, heat, life, motor, load, stopping and wiring. A drive that works well for fifteen years is one where all of those were thought about before it was bought, set correctly when it was installed, and looked after afterwards. Most drive problems in factories are not failures of the drive at all but gaps between those stages: a specification that left out the ambient temperature, a commissioning that accepted the defaults, a replacement fitted without the old one's settings.

This chapter turns the book into a specification, a commissioning procedure and a maintenance and spares plan for DP-4, uses the BIZOMAT critical spares tool to decide how many spare drives the plant should hold, and ends with a replacement drive that started without its predecessor's settings.

## Writing the specification

A drive specification starts from the load and the site, not from a catalogue. For each of DP-4's drives the plant recorded:

```figure
type: compare
title: DP-4's drive specifications in brief
cols: F-1 extraction fan | P-3 cooling-water pump | C-2 infeed conveyor
rowhead: Item
- Motor | 30 kW, 4-pole, 53.8 A | 22 kW, 2-pole, 38.8 A | 7.5 kW, 4-pole geared, 14.5 A
- Load type | Variable torque | Variable torque with 8 m static head | Constant torque, rising at low speed
- Duty rating | Normal duty, 110% for 60 s | Normal duty | Heavy duty, 150% for 60 s, vector control
- Speed range | 25 to 50 Hz | 30 to 50 Hz, minimum set by the lift | 10 to 60 Hz, forced-ventilated motor
- Stopping | Coast | Ramp, 30 s | Ramp with backstop; no braking needed uphill
- Cable and filter | 45 m screened, dv/dt filter | 30 m screened | 20 m screened
- Control | Duct pressure, 4–20 mA | Return water temperature | Shredder current, fieldbus
caption: This is an illustration. Each line traces to a chapter: duty and speed range to Chapters 6 and 7, stopping to Chapter 8, cable and filter to Chapter 9. All three drives: 400 V supply, DC choke, EMC category for an industrial site, safe torque off, rated for 45 °C ambient at the chosen switching frequency.
```

The common items matter as much as the individual ones: the supply voltage and its variation, the ambient temperature range and humidity in the cabinet, the altitude if above about 1,000 m, where thinner air cools less and makers derate, the ingress protection of the drive or cabinet, the electromagnetic compatibility category for the site, harmonic limits, safety functions, communications and the documents the supplier must provide. A drive chosen only by kilowatts is a drive whose duty, cooling and installation have been left to chance.

## Commissioning step by step

Commissioning is where the specification becomes settings. DP-4's drives were commissioned by the installer with the plant's electrical engineer to a written procedure:

1. **Inspect before power.** Check cable sizes, screen terminations, earthing and bonding, the cabinet's ventilation, and that motor and drive ratings match.
2. **Check insulation.** Test the motor and its cable with the drive disconnected; a drive's output must never be insulation-tested.
3. **Enter the motor's nameplate data.** Rated voltage, current, frequency, speed, power and power factor or magnetising current. A drive's motor model, current limits and protection all depend on them.
4. **Run the identification.** Most drives can measure the motor's resistances and inductances with a short stationary or rotating test. Vector control depends on it.
5. **Check direction.** Bump the motor and confirm rotation, before coupling the load where possible.
6. **Set limits and ramps.** Minimum and maximum frequency, acceleration and deceleration ramps, current limit, stop mode, and any skip frequencies.
7. **Set protection.** Motor thermal model and thermistor input, phase loss, earth fault, stall and underload where useful.
8. **Test the control and safety functions.** Analogue and fieldbus references, run and stop commands, and safe torque off with its safety relay.
9. **Run under load.** Watch current, power, DC link voltage and heatsink temperature through starts, stops and the full speed range.
10. **Record and back up.** Save every parameter to a file and to the drive's removable keypad or memory module, and file a printed list of every non-default setting with the reason for it.

Skip frequencies deserve a word. During F-1's commissioning, a run through its speed range showed the fan's support frame resonating at about 37 Hz, where the fan's running speed excited a natural frequency of the frame. A skip band from 35 Hz to 39 Hz was set, so that the drive passes through that range on its ramps but never dwells in it; the Library’s [Vibrating Machine Elements by the Numbers](/reados/publications/vibrating-machine-elements-by-the-numbers/) explains how such resonances are found and avoided.

## Keeping drives running

The maintenance plan from Chapter 5, the filter changes from Chapter 4 and the monitoring from Chapter 4's log make up most of the routine. Two more things complete it.

- **A drive register.** For every drive in the plant: its model, firmware version, serial number, location, motor, date of installation, parameter file name and date, spare part numbers and maintenance history. The register is how the plant knows which drives share a model and can share spares.
- **Firmware management.** Drive firmware is updated only when there is a known reason, after the update is tested on one drive, and with the parameter file saved before and after. An updated drive may interpret old parameters differently.

## Comparing offers

When the plant asked three suppliers to quote for DP-4, the prices differed by about 15%, and the cheapest was not the best buy. The comparison it used, worth repeating for any drive purchase, weighs five things besides price.

- **Losses.** Drives are compared at the standard operating points of IEC 61800-9-2, which also defines efficiency classes. A drive that loses 100 W more than another at the plant's usual duty costs 0.1 × 6,000 × A$0.21 = A$126 a year more to run. Over a 12-year life at 7%, the present value of that is 126 × 7.943 = about A$1,000, enough to reverse a small price difference.
- **Fit to the specification.** Duty rating, ambient temperature rating at the intended switching frequency, chokes, safe torque off and filters included in the price, not offered as extras.
- **Commonality.** A drive of the family already used elsewhere in the plant shares spares, software, parameter files and the technicians' experience.
- **Support.** Local stock, lead times for replacements, the supplier's ability to attend a breakdown, and the length and terms of the warranty.
- **Documentation and software.** A manual that covers installation, derating, braking and capacitor reforming, and commissioning software the plant may use without a fee.

The plant chose the second-cheapest offer, from the family it already used, with chokes and safe torque off included and the lowest losses at the fan's usual 40 Hz duty.

## People and documents

A drive is a programmable device, and the plant's ability to look after it depends on people who understand its settings. Two electricians and a maintenance technician were trained on the drive family's commissioning software and its fault codes when DP-4 was installed. The cabinet's documents include the single-line diagram, the cable schedule with screen terminations marked, the parameter list, the commissioning record with the motor identification results, the skip band and why it exists, and the maintenance schedule. Each was written for someone who was not there when the drives were commissioned, because that is who will read it at 3 am.

## Repair or replace

At some point every drive becomes more trouble to keep than to replace. The plant's rule is to replace rather than repair a drive of up to about 30 kW once it is past about ten years or its family is no longer supported with spare parts and firmware, because by then a new drive is usually cheaper than a repair, has lower losses and safety functions the old one lacks, and its parameters can be set from the old drive's file. The drive register shows when each drive reaches that age, so replacements can be budgeted and done in planned shutdowns rather than after a failure. Old drives go to an electronic waste recycler: their capacitors, circuit boards and power modules must not go to landfill.

## How many spare drives?

The plant has 14 drives of the same family, including DP-4's three, ranging from 5.5 kW to 30 kW. A spare of the largest frame, with its parameters loaded from the right file, can stand in for any of them for long enough to obtain a replacement. The question is whether to hold one and, if so, how many.

The [critical spares plan tool](/tools/critical-spares-poisson-plan/) gives the expected number of failures in the replacement lead time across the installed units, from their mean time between failures and running hours, and the spares needed for a chosen chance of not running out. Chapter 5's system model gave the drives' random electronics a characteristic life of 400,000 hours; with the planned fan replacements, the random failures dominate. The drive maker's distributor quoted 42 days for a replacement of this family from overseas stock.

```figure
type: compare
title: Spare drives for the plant's 14 drives, from the critical spares plan tool
cols: Expected failures in 42 days | Spares for the target | Cover with no spare | Cover with one spare
rowhead: Case
- MTBF 400,000 h, target 95% | 0.024 | 0 | 97.62% | —
- * MTBF 400,000 h, target 99% | 0.024 | 1 | 97.62% | 99.97%
- MTBF 67,820 h, no fan replacement, target 99% | 0.142 | 1 | — | 99.08%
caption: This is an illustration. 14 drives running 16.4 hours a day; lead time 42 days. Failures per year across the fleet: 0.21 at an MTBF of 400,000 h, 1.24 at the 67,820 h system mean time to failure of Chapter 5 if fans were left to fail.
```

At a 95% target, no spare is needed: the chance of a failure in any 42-day window is only about 2.4%. But a failure of F-1's or P-3's drive stops the wash line, and the plant values an hour of the line at several thousand dollars, so it set a 99% target for these drives, and one spare meets it with 99.97% cover. The third row shows why the maintenance plan matters to the spares plan: if fans were left to fail, the fleet's failure rate would rise about six-fold, and one spare would only just meet the target.

The spare's own care is in Chapter 5: dated, stored dry, powered up yearly and its capacitors reformed if it has been stored too long.

## What the drives can report

A modern drive is also a sensor. Over the fieldbus, DP-4's drives report to the plant's controller their output frequency, current, power, motor torque estimate, DC link voltage, heatsink temperature, running hours, energy used, fault and warning history and, on some models, an estimate of the remaining life of their fans and capacitors. The plant logs these every minute and uses them in four ways. The energy figures verify the savings of Chapter 7 month by month. The heatsink temperatures, plotted against current and hall temperature, show clogged filters and failing fans before they trip anything (Chapter 4). The running hours drive the fan replacement schedule (Chapter 5). And a change in a machine's power at the same speed is often the first sign of a mechanical problem: a fan whose power falls at constant speed may have a blocked duct or a slipping belt; a conveyor whose torque rises may have a seized idler or a misaligned belt.

None of that needs extra sensors, only someone to look. The plant's maintenance planner reviews a one-page summary of each drive's trends every month.

## The error: a replacement without its settings

When P-3's drive failed in its fourth year (Chapter 5) and its replacement was finally fitted, the technician on night shift found no parameter file in the panel, and the failed drive's keypad could not be read. He entered the motor's nameplate data, ran the identification, set the ramps from memory and connected the temperature control. The pump started and ran normally.

At about 3 am, with the extruder idling and the night cool, the temperature controller slowed the pump. The replacement drive had the factory minimum frequency of 0 Hz, not the 30 Hz that had been set on the original. The controller drove the pump below 19.6 Hz, the speed below which P-3's shut-off head no longer exceeds the 8 m lift to the tower (Chapter 7), and the flow stopped. The return temperature rose, the controller called for more speed, the flow restarted, the temperature fell, and the pump hunted for an hour before the extruder's high-temperature alarm stopped the line.

The original drive's parameters had been backed up at commissioning, but the file was on the installer's laptop, not the plant's, and the printed list of non-default settings was in a folder in the installer's office.

```figure
type: checklist
title: Parameter control the plant adopted
caption: This is an illustration. Applied to every drive in the register.
- x Every drive's parameter file held on the plant's server, named by drive tag and date, and copied to the drive's memory module where it has one
- x A printed list of non-default settings, with the reason for each, kept inside each cabinet door
- x Parameter files saved after every change, with the change recorded in the register
- x Replacement procedure: load the parameter file first, then check the motor data and the critical limits before the first start
- ? Critical limits, such as P-3's 30 Hz minimum, also enforced in the controller, so that a drive at defaults cannot breach them
```

The last item is the deepest fix. P-3's minimum speed is a property of its system, not of its drive; enforcing it only in the drive meant that any drive at factory settings would breach it. The controller now clamps P-3's speed reference at 30 Hz as well.

## Exercise: spares for a second site

The company opens a second plant with 6 drives of the same family, also running 16.4 hours a day, 200 km from the first.

1. With an MTBF of 400,000 hours and a 42-day lead time, what is the expected number of failures at the second plant in 42 days, and the chance of none?
2. Does it need its own spare for a 99% target?
3. If the two plants shared one spare, held at the first plant and delivered within a day, what would the expected number of failures in 42 days be across both plants, and does one shared spare give 99% cover?

### Worked answer

1. λ = 6 × 16.4 × 42 ÷ 400,000 = 0.0103. The chance of no failure is e^(−0.0103) = 98.97%, just below 99%.
2. Strictly, yes: 98.97% is below 99%, so the target calls for one spare, though the margin is tiny.
3. Across 20 drives, λ = 20 × 16.4 × 42 ÷ 400,000 = 0.0344. With one spare, the cover is the chance of at most one failure: e^(−0.0344) × (1 + 0.0344) = 0.9661 × 1.0344 = 99.94%. One shared spare covers both plants at well above 99%, provided it can be delivered in a day; the day's delay must be weighed against the cost of a second spare.
