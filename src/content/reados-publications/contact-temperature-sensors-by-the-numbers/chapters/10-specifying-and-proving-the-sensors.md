---
book: contact-temperature-sensors-by-the-numbers
chapterSlug: specifying-and-proving-the-sensors
order: 10
title: "Specifying the sensors and proving the oven"
description: "A sensor specification for CV-180, an air uniformity survey, a loaded profile that found the slowest part, change control for sensors, and a cure proved on an empty oven."
draft: false
---

The earlier chapters each dealt with one part of a contact measurement: what the sensor is coupled to, how a thermocouple or a platinum or thermistor sensor turns temperature into a signal, how it is wired, installed, timed and calibrated. This chapter puts them together for CV-180. It writes a specification that fixes each sensor's purpose, type, installation and checks; runs an air uniformity survey and a loaded profile to prove the oven; sets out the change control that keeps the measurements right after the next repair; and ends with a cure that had been proved on an empty oven.

## The sensor specification

A sensor specification is a one-page record for each measurement, written so that someone replacing a sensor in five years' time reproduces what the business decided rather than whatever is in stock. For CV-180, each line of the table below draws on a chapter of this book.

```figure
type: compare
title: CV-180's sensor specification
cols: Controller | Limit | Profile channels | Logger cold junction
caption: This is an illustration. Every entry is a decision with a reason recorded on the sensor's own page; the chapter numbers show where.
- Purpose (Ch 1) | hold supply air at 200 °C | trip heaters if air exceeds 230 °C | prove slowest part ≥ 180 °C for 10 min | compensate every thermocouple channel
- Type and class (Ch 2–6) | Pt100, class A, 3-wire | type K, class 1, insulated junction | type K, class 1, 1.5 mm, system-calibrated | 10 kΩ NTC, Steinhart–Hart coefficients
- Installation (Ch 7) | 6 mm, 150 mm in straight duct, no view of elements | 3 mm in fast air, no view of elements or door | magnetic pads; peened test plate for checks | inside the logger's isothermal block
- Wiring (Ch 3, 5) | 3-wire, screened, configured as 3-wire | type K extension cable to cabinet | type K connectors; loop resistance recorded | maker's
- Response (Ch 8) | τ about 148 s; controller tuned for it | τ about 74 s | τ about 37 s | not applicable
- Checks (Ch 9) | ice point and dry block at 200 °C yearly; withdrawal test after changes | in-place comparison with oven hot, yearly | reference check before each set of profiles | system calibration yearly
- Uncertainty (Ch 9) | ±0.8 K at k = 2 | to be assessed with oven maker | ±1.7 K at k = 2 | within the profile budget
```

The specification also states who may change a sensor and what must be checked afterwards, which is the subject of the section on change control below.

### The sensor's own page

Behind each column of the table sits a page for that sensor, kept with the oven's records. It carries the sensor's tag and the instrument it feeds; the part number in full, including class, curve and, for a thermistor, B and its defining temperatures; the immersion length and mounting, with a photograph; the wiring, terminal numbers and instrument configuration; the measured time constant, loop or lead resistance and insulation resistance when new; and a running log of calibrations, checks, corrections and changes, each dated and initialled. The page is short, but each line answers a question that one of this book's errors raised too late. A replacement sensor ordered from it will have the right curve; a reconnection made from it will have the right number of wires; and a calibration offset entered from it will have a recorded sign that a second person can check.

The specification is also where the business records what it chose not to do and why. CV-180 does not calibrate its limit thermocouple's uncertainty to the same depth as the profile channels, because its job is protection and its setting is chosen with a margin from the oven maker's limits; the specification says so, and names the in-place hot comparison as the check that matters for it. Writing that down prevents a later reader from either over-engineering the limit or, worse, assuming it is as accurate as the controller.

## Proving the oven: the air uniformity survey

The first proving test measures how even the air temperature is across the working space with the oven empty and at its setpoint. It answers a simple question: does every part of the space get roughly the same air, or are there hot and cold regions that will treat parts differently?

This is an illustration. Nine shielded air thermocouples, calibrated with the logger, were placed at the corners and centre of CV-180's working space, each at least 100 mm from any wall, and logged for 30 minutes after the oven had been steady at 200 °C for an hour. The readings below are the averages over that period.

```figure
type: bars
title: CV-180 air uniformity survey, empty, setpoint 200 °C
unit: °C
max: 205
caption: This is an illustration. Mean 200.4 °C; spread 5.5 K from the lower door corner to the upper rear corner by the heater bank. The controller's supply-air reading sat at 200.0 °C throughout.
- Upper rear, heater side | 203.4
- Upper rear, far side | 202.6
- Upper front | 201.3
- Centre | 200.4
- Lower rear | 200.8
- Middle front | 199.6
- Lower front, far side | 199.1
- Middle rear | 198.2
- * Lower front, door side | 197.9
```

The survey shows an oven that is reasonably even, with a spread of 5.5 K, cooler near the door seal at the bottom and warmer near the heater bank at the top. It also shows that the supply-air reading of the controller is close to the space's mean, which is what a controller sensor in a well-mixed duct should give. Uniformity alone does not prove a cure, but it does show where the slowest parts are likely to be: low, near the door, where the air is both cooler and slower.

## Proving the cure: the loaded profile

Air uniformity says what the air does. A cure depends on what the parts do, and that depends on the air temperature and speed at each part and on the part's thickness. The second proving test therefore runs a real load, or a representative one, with trailing thermocouples on the heaviest parts in the positions most likely to be slow.

This is an illustration. The first loaded profile placed 10 mm plates at three positions chosen from the empty survey. The times to reach 180 °C and the guard-banded 182 °C, from the logged traces, agreed closely with the lumped model using each position's air temperature and an estimated surface coefficient.

```figure
type: compare
title: Time for a 10 mm plate to reach temperature, by position
cols: Local air | Estimated h | To 180 °C | To 182 °C
caption: This is an illustration. Positions and coefficients from CV-180's surveys; times from the lumped model and confirmed by the logged profiles. The dense rack was found only when the oven was profiled with a production load.
- Upper rear, heater side | 203.4 °C | 30 W/m²·K | 21.7 min | 22.6 min
- Centre, open shelf | 200.4 °C | 25 W/m²·K | 27.6 min | 28.9 min
- Lower front, door side | 197.9 °C | 22 W/m²·K | 33.0 min | 34.8 min
- Edge of a dense rack | 200.0 °C | 24 W/m²·K | 29.0 min | 30.4 min
- * Centre of a dense rack | 199.0 °C | 18 W/m²·K | 39.4 min | 41.4 min
```

The lesson of the table is that position can matter as much as thickness. The same plate reaches temperature in under 22 minutes beside the heater bank and in nearly 40 minutes in the middle of a crowded rack, where the surrounding frames block the air. The cure time for a load must come from its slowest position, measured, with the guard band of Chapter 9.

### Reading a profile trace

A profile is only as good as the reading of it, and a logged trace carries more information than the time at which it crossed 182 °C. Each shape in a trace has a physical cause, and the commonest faults show themselves plainly to anyone who knows what a healthy trace looks like.

- **A healthy part trace** rises quickly at first and then more slowly, curving towards the local air temperature without crossing it, as the lumped model predicts. Plotting the logarithm of the gap to the air temperature against time gives a near-straight line whose slope gives the part's time constant, which can be compared with the calculation.
- **A trace that goes flat while the oven is hot** means the junction is no longer on the part, or that the two wires are touching somewhere else, as in Chapter 2. A real part does not stop heating in hotter air.
- **A trace that jumps up to the air temperature** means a probe has fallen off its part and is now reading the air. Magnetic pads can slip on painted or curved surfaces.
- **A trace that crosses above the local air** near the heater bank shows radiation from the elements, as Chapter 7 described, either on the probe or on the part itself.
- **Steps or spikes in time with the heaters switching** point to electrical interference on that channel, and noise that appears on every channel at once points to the logger or its cold junction.
- **Two probes on identical parts in identical positions that disagree steadily** point to attachment or calibration, and are the cue to check both against the peened test plate and the reference.

The business keeps a reference trace for each part family, from its proving run, and compares each later profile with it. A new trace that has the same shape but a different time to temperature points to a change in the oven, its air, its racking or its load. A trace with a different shape points to the measurement.

### A proving routine

```figure
type: steps
title: CV-180's routine for proving a part family's cure
caption: This is an illustration. Each step uses checks from earlier chapters; the routine is repeated whenever the part, the racking or the oven changes.
- Check the logger channels against the working reference | Chapter 9; correction signs verified
- Inspect leads and record loop resistances | Chapters 2 and 3
- Attach probes to the heaviest parts in the slowest positions of a production load | Chapters 1 and 7; magnetic pads with their correction
- Run the normal cycle and log every channel at 10 s intervals | Chapter 8; lag corrected where needed
- Find the time for the slowest probe to reach the guard-banded 182 °C | Chapter 9
- * Set the cycle as that time plus the 10-minute cure, plus the door-recovery allowance | recorded against the part family and racking
```

## Change control

Most of the errors in this book were introduced by a change that seemed harmless: a cable run, a controller replaced, a sensor moved, a thermistor from stock, an offset entered. None of them was caught by the check that followed, because the check was made under conditions in which that error could not show. A short change-control rule addresses this directly: any change to a sensor, its wiring, its instrument or its position triggers the checks that could reveal the errors that change can cause.

```figure
type: matrix
title: Which check catches which change
x: Check made at room temperature → check made at working conditions
y: Check of the sensor alone → check of the whole installation
hot: 4
caption: The errors in this book sit mostly in the top-right quadrant: they are invisible to cold, sensor-only checks. Change control must reach that quadrant.
- Sensor alone, cold | ice point; multimeter; loop resistance: finds broken, shorted and gross faults
- Sensor alone, at temperature | dry-block comparison: finds tolerance, curve and conversion errors
- Installation, cold | wiring inspection; configuration review: finds wrong connections on paper
- Installation, at working conditions | in-place comparison, withdrawal test, plunge test, loaded profile: finds cold-junction, immersion, lag and position errors
```

For CV-180, the rule names the checks for each kind of change. A new or moved sensor gets a withdrawal test and an in-place comparison with the oven hot. A wiring or controller change gets a check at the working temperature with a simulated input or a reference probe. A new part family or racking arrangement gets a loaded profile. A calibration offset gets an immediate comparison against the reference. And every change is recorded on the sensor's page, so that the next person knows what was done and why.

## What a profile record should contain

A profile that is to serve as evidence, to a customer, an auditor or the business itself a year later, has to be readable without the person who ran it. CV-180's profile record has a fixed set of contents: the date, the part family and its racking, with a sketch or photograph showing where each probe was; the logger's serial number and the date of its last calibration, with the reference check made before the run; the attachment method for each probe and the correction applied; the oven's setpoint and the controller's reading during the run; the logged traces themselves, kept in their original file as well as printed; the time at which the slowest probe reached the guard-banded temperature and the time it stayed above it; and the decision taken, with the name of the person who took it.

Most of these items take seconds to record at the time and are impossible to recover later. A trace without the probe positions cannot show which part was slowest; a trace without the logger's calibration record cannot be trusted to a kelvin; and a cure time without the guard band cannot be compared with the next one. The record also protects the business. If a coating fails in service for a reason unrelated to the cure, the profile record shows that the cure was proved and how, which is a far stronger position than a remembered setting on a controller.

## How this applies to a small Australian business

Customers increasingly ask coaters, heat treaters and food processors for evidence that a process was in control, and a profile record from a calibrated logger is the simplest form that evidence takes. The tools are modest: a data logger with a handful of thermocouples, a working reference thermometer with a current certificate from a NATA-accredited laboratory, a dry-block calibrator that can be bought or hired, and an hour or two for each part family. The discipline is harder: writing down what each sensor is for, profiling with production loads rather than empty ovens, and checking after every change at the conditions in which the change could matter.

## The error: a cure proved on an empty oven

This is an illustration. After the timer problem of Chapter 1, CV-180's heavy-frame cycle was set at about 38 minutes, from a profile of a single frame on an open shelf in the centre of the oven, where its 10 mm plate reached 180 °C in about 28 minutes. That profile was correct for what it measured.

Months later, a larger order led the business to rack heavy frames densely to fit more into each load. At the centre of a dense rack, where the air was slower and slightly cooler, a 10 mm plate's surface coefficient fell to about 18 W/m²·K. At 38 minutes it had reached only about **178.4 °C**, and it never spent any time above 180 °C before unloading. The coating on the frames at the centre of the rack passed visual inspection, but a customer's solvent rub test on a sample frame was marginal.

The business profiled a production load with probes at the centre and edges of the dense rack and found the slow position at once. The plate at the centre took about 41.4 minutes to reach the guard-banded 182 °C. Two changes followed: the racking was opened up with spacers so that air could reach the centre, and the cycle for dense loads was set from the loaded profile at about 52 minutes until the spaced racking had been profiled in turn. The proving routine was rewritten to require a production load, with probes in the slowest positions, for every new part family or racking arrangement.

```figure
type: checklist
title: Before a cure cycle is accepted
caption: The open item is this chapter's error. A cure is proved for a load, not for an oven.
- x Logger channels checked against the reference | corrections and signs verified
- x Air uniformity survey current | spread and slow regions known
- x Probes on the heaviest parts | magnetic pads with their correction
- x Guard band applied | cure clock starts at 182 °C
- ? Profile made with a production load in its real racking | empty-oven profile: dense-rack plate 1.6 K short
```

## Exercise: the spaced rack

With spacers fitted, the profile of the centre of the rack shows local air at **199.8 °C** and a surface coefficient for the 10 mm plate of about **23 W/m²·K**. Using the lumped model with a 25 °C start, how long does the plate take to reach the guard-banded 182 °C, and what cycle should the business set, allowing 10 minutes of cure and 2 minutes for the air to recover after the door closes?

**Worked answer.** The plate's time constant scales inversely with h: τ = 769 × 25 ÷ 23 = **836 s**. The time to reach 182 °C is 836 × ln((199.8 − 25) ÷ (199.8 − 182)) = 836 × ln(174.8 ÷ 17.8) = 836 × 2.284 = **1,909 s**, about **31.8 minutes**. Adding the 10-minute cure and the 2-minute recovery gives about **43.8 minutes**, so the business would set a 44-minute cycle for spaced dense loads, about 8 minutes shorter than the unspaced dense-rack cycle. That figure is a prediction. The business sets the cycle only after a loaded profile with the spacers fitted has confirmed it.
