---
book: welding-automation-by-the-numbers
chapterSlug: monitoring-and-quality-data
order: 8
title: "Monitoring and quality data"
description: "Record current, voltage and wire feed on every automated weld, set limits that catch drift, judge weld size capability with Cpk, and plan macro sections and first-article checks for a robot cell."
draft: false
---

A robot repeats its welds exactly, and that includes its mistakes. A worn contact tip, a moved fixture, a wrong program revision or a change in the wire can turn every weld of a batch bad, quickly and silently, because no welder is watching the pool. Automated welding therefore needs its own quality system, built on the fact that the process can be measured on every weld. The current, voltage and wire feed of each weld can be recorded and compared with limits; the weld size of sampled parts can be tracked and judged statistically; and sections cut from parts at planned intervals can confirm what the surface cannot show.

This chapter sets out what weld monitoring records and how limits are set, shows a monitored drift being caught, judges weld size capability with the Cpk index, and describes the first-article checks, macro sections and records that keep a cell's output trustworthy.

## What a monitor records

Most modern welding power sources and robot controllers can record, for every weld, the average and the variation of the current, the voltage and the wire feed speed, the arc time, and the gas flow if a flow sensor is fitted. Some record the waveform in detail. The records are stored against the part, the weld number and the time, and can be compared with limits set for each weld.

The limits are set from the procedure and from experience of good welds. A weld whose average current falls outside its band, whose arc time is too short, or whose voltage varies more than usual is flagged. Monitoring cannot see the weld itself; it sees the process that made it. But because the process is so repeatable, a change in its measurements is a strong sign of a change in the weld.

## Catching a drift

```figure
type: line
title: Average current on one bracket weld, part by part, as a contact tip wears
x: Part in the batch
y: Average current (A)
ymin: 200
ymax: 250
caption: This is an illustration. The weld's normal band was set at 225 to 245 A from qualified welds. A worn contact tip raises the effective stick-out and lowers the current; the monitor flagged part 18 below the band, and a tip change restored it.
legend: Average current per weld
- 2 | 236
- 4 | 235
- 6 | 235
- 8 | 233
- 10 | 232
- 12 | 230
- 14 | 228
- 16 | 226
- 18 | 223
- 20 | 237
```

The chart shows the kind of drift monitoring catches. As the contact tip wore, its bore enlarged and the current entered the wire further back, lengthening the effective stick-out, so that at the same wire feed the current fell, as Chapter 2 explained. The welds were still the right size, because the wire feed was unchanged, but their penetration was falling. The monitor flagged the first weld below its band; the operator changed the tip and the current returned to normal. Without monitoring, the drift would have continued until a macro section, or a customer, found shallow welds.

## Setting the limits

Limits too wide catch nothing; limits too narrow stop the cell for nothing. In the running case, the fabricator set its first limits from the procedure qualification and the trial welds, then refined them from the data of the first few thousand production welds, setting each band to cover the normal variation of good welds with some margin. Each alarm was investigated and its cause recorded. Over the first months, the record showed which alarms came from real problems, worn tips, spatter in the nozzle, a loose earth, and which from limits set too tight, and the bands were adjusted until almost every alarm meant something.

## Weld size capability

Weld size is checked by gauging sampled welds, and the measurements can be judged statistically. A useful measure for a dimension with only a lower limit, such as a fillet's leg length, which must not be undersized, is the one-sided capability index Cpk: the distance from the process average to the limit, divided by three standard deviations.

```figure
type: formula
title: Capability of the bracket fillet size, robot and manual
formula: Cpk = (average − lower limit) ÷ (3 × standard deviation)
caption: This is an illustration from gauged samples: robot welds averaging 5.3 mm with a standard deviation of about 0.08 mm, and manual welds averaging 6.2 mm with about 0.35 mm, both against a 5.0 mm minimum. A Cpk of about 1.33 or more is a common target for a capable process.
- Lower limit | 5.0 mm
- Robot | average 5.3 mm, standard deviation 0.08 mm
- Manual | average 6.2 mm, standard deviation 0.35 mm
step: robot: (5.3 − 5.0) ÷ (3 × 0.08) ≈ 1.25
step: manual: (6.2 − 5.0) ÷ (3 × 0.35) ≈ 1.14
step: to reach 1.33, the robot needs an average of about 5.32 mm; the manual welders about 6.4 mm
```

The comparison is instructive. Both processes are close to capable, but the manual welders reach it only by over-welding heavily, averaging 6.2 mm for a 5 mm weld, while the robot reaches the same capability at 5.3 mm. That is the arithmetic behind Chapter 3's saving: capability through consistency instead of capability through excess.

## First-article checks

Every new program, every revised program and every changeover is followed by a first-article check before the batch is released. The check confirms that the right program is running on the right part, that every weld is present, in the right place and of the right size, and that the part's dimensions are within tolerance after welding.

```figure
type: checklist
title: The fabricator's first-article check for a robot-welded bracket
caption: This is an illustration of the fabricator's check, built from its quality plan and its customers' requirements.
- x Program and revision | match the part's drawing revision and the approved program record
- x All welds present | counted against the drawing; none missing or extra
- x Weld size | gauged at marked points; all above minimum, average near target
- x Weld appearance | no porosity, undercut, cold lap or spatter beyond the limits
- x Part dimensions | checked after welding and cooling against the drawing
- x Macro section | cut and etched for new or revised programs; root fusion and penetration confirmed
- *? Sign-off | operator and inspector sign; batch released
```

## Macro sections

The surface of a weld does not show its root. A fillet can be the right size and look perfect while its root is unfused, as the fast robot of Chapter 3 showed. A macro section, a slice cut across the weld, polished and etched, shows the fusion into both plates and the penetration at the root. The fabricator cuts a macro section from the first part of every new or revised program, and from a sampled part at a set interval in production, for example one part per thousand or one per week of each program, whichever comes first. The cost is the part and about half an hour of a technician's time; the value is the confidence that the root is fused. Testing Welded Joints by the Numbers covers macro sections and visual inspection.

## Sampling in production

Between first articles and macros, production welds are sampled for size and appearance. Because robot welds are so consistent, sampling can be lighter than for manual welding, but not absent: a sample at a regular interval catches a drift that the monitor missed, a part that has moved in a fixture, or a supplier's change of material. The sampling frequency is set from the monitoring record and the history of problems, and raised after any change.

## Traceability

A part with a serial number or a batch code can be linked to the monitoring records of its welds, the program revision, the wire batch, the operator and the time. When a customer reports a problem, the fabricator can look up the part's welds and see whether anything was unusual, and identify every other part made under the same conditions. Without traceability, a problem in one part puts the whole of production in doubt. The fabricator marks each batch of brackets with a code that links to its records, and stores the monitoring data for the period its customers require.

## Data without action

Monitoring produces large amounts of data, and data that nobody reviews is worthless. The fabricator assigned the cell's daily review to the operator and the weekly review to the welding engineer: alarms and their causes, trends in current and arc time, weld size samples and capability, macro results, and any customer feedback. Each review ends either with actions, each given an owner and a date, or with a record that none were needed. The weekly review is where a slow drift across several programs, such as a gradual change in wire quality, is noticed.

## The program as part of the quality system

Chapter 6 described program management. For quality, the program is part of the process specification, like the welding procedure: an approved version, linked to the part revision and the qualified procedure, changed only through a controlled process with a new first-article check. The monitoring limits are part of the program's record. Customers who audit the fabricator increasingly ask to see this control, because they know that a robot's consistency cuts both ways.

## Monitoring manual welding too

The same monitoring equipment can be fitted to hand-held semi-automatic welding, and it changes the conversation about manual work. A monitor on a welder's power source records the current, voltage, wire used and arc time of each weld, and from the arc time and the weld's known length gives the average travel speed. The fabricator fitted monitors to the stations welding implement frames, and the records showed, for the first time, the arc-on time of each station, the variation in travel speed between welders, and the wire used per frame. The welders were wary at first, until it was agreed that the data would be used to improve fixtures, positioners and training, not to rank individuals. Within months, the data had justified two more positioners and a change of wire size on one frame.

## Cameras on the weld

Camera systems that inspect the weld bead after welding are becoming common in high-volume automated welding. A laser profile scanner passing over the finished weld measures its width, height, leg lengths and surface defects such as undercut, porosity and missing segments, and compares them with limits, on every weld. For short-cycle parts in very high volumes, such inspection can replace much of the manual sampling. It sees only the surface, so it complements rather than replaces macro sections and monitoring of the process. The fabricator judged such systems too costly for its volumes, but kept them under review as their prices fell.

## Non-destructive testing

Where customers or codes require it, automated welds are examined by the same non-destructive methods as manual ones: visual inspection, magnetic particle or dye penetrant testing for surface cracks, and ultrasonic or radiographic testing for internal defects. Because automated welds are so consistent, a well-chosen sample tells more about the whole population than it would for manual welds, and some customers accept reduced sampling once the process has shown its consistency. That reduction is earned with data: a record of monitoring, capability and test results over a long run.

## The cost of quality

The checks in this chapter cost money: monitors and sensors, macro sections, gauging time, data review and records. Against them stand the costs they prevent: scrapped batches, rework, customer returns, warranty claims and lost customers. The fabricator estimated its quality costs for the cell at about A$25,000 a year, including the welding engineer's review time and the macro sections, against the cost of a single batch of 2,000 brackets with unfused roots reaching a customer, which it put at well over that figure once the recall, rework and damage to the relationship were counted. The checks are part of the cell's running cost and belong in the business case of Chapter 5 alongside tips, nozzles and maintenance; at about 1,700 hours a year, A$25,000 is roughly A$15 for each hour the cell welds, which a careful case counts rather than leaving out. The fabricator added the figure to its case after the first year, and the payback on one full shift lengthened from about 2.7 to about 3.2 years, still within the board's limit.

## The running case: the first year's data

This is an illustration. In its first year, the cell welded about 160,000 welds on about 52,000 parts. The monitor raised about 420 alarms, of which about 300 traced to worn tips or spatter in the nozzle, about 60 to parts loaded incorrectly, about 30 to a loose earth on one fixture, and the rest to limits set too tight, which were adjusted. Macro sections from 140 programs and production samples found two programs with marginal root fusion, both corrected before customers saw a problem. Customer returns for weld defects on robot-welded brackets fell to almost none, against several a year for the manual welds before.

## A failure: the gas that ran out

This is an illustration. Another fabricator's cell ran through a night shift with its shielding gas bottle nearly empty, the flow falling slowly as the pressure dropped. The robot kept welding, and by morning the last few hundred parts were porous. The cell had no gas flow monitoring, and the monitor's current and voltage limits had not been triggered, because porosity barely changes them.

The fabricator fitted a gas flow sensor with an alarm and a stop, moved to a bulk gas supply, and added a check of the gas pressure to the operator's start-of-shift routine. The porous parts from that night were all scrapped.

## Exercise: capability and target

A fillet must be at least 6.0 mm. A robot's welds have a standard deviation of 0.10 mm. What average size gives a Cpk of 1.33? If manual welds have a standard deviation of 0.40 mm, what average do they need for the same Cpk, and how much more weld metal does that mean, relative to the robot's average?

For a Cpk of 1.33, the average must be 1.33 × 3 × σ above the limit. For the robot that is 1.33 × 3 × 0.10 ≈ 0.40 mm, an average of about **6.40 mm**. For manual welds it is 1.33 × 3 × 0.40 ≈ 1.60 mm, an average of about **7.60 mm**.

Weld metal grows with the square of the leg, so the manual welds hold about (7.60 ÷ 6.40)² ≈ **1.41 times**, or 41% more, weld metal than the robot's for the same assurance that no weld is undersized.
