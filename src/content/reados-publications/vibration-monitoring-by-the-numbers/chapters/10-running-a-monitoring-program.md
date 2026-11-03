---
book: vibration-monitoring-by-the-numbers
chapterSlug: running-a-monitoring-program
order: 10
title: "Running a monitoring program"
description: "Choosing which machines to monitor and how, routes and intervals, people and qualifications, acting on findings, measuring the program's value, and appraising an online system for the chipper."
draft: false
---

Vibration monitoring is not a measurement; it is a program. A data collector and a technician produce readings, but the value lies in what happens next: a trend noticed, a fault diagnosed, a repair planned and done at the right time, and the result checked. Many programs collect years of data and prevent few failures, because the readings are taken and nobody acts on them, or the machines that matter are not on the route, or the people reading the spectra are not trained to read them. A program that works is designed around decisions, staffed by people who can make them, and measured by the failures it prevents.

This chapter sets out how the mill chose its machines and methods, designed its route, qualified its people, reports and acts on findings, and measures the program's value, appraises the chipper's online system with the investment appraisal tool, and finishes with a finding that was reported correctly and then ignored.

## Which machines, and how

Not every machine is worth monitoring, and not every monitored machine needs the same method. The mill ranked its machines by two questions: how much would a failure cost, in lost production, repair, safety and environment; and how likely is a failure that vibration can detect with useful warning?

```figure
type: matrix
title: Choosing a monitoring method by consequence and detectability
x: Consequence of failure: low → high
y: Detectable by vibration with warning: low → high
hot: 4
caption: This is an illustration of the mill's ranking. The highlighted cell, high consequence and good detectability, is where online monitoring pays.
- Run to failure, or simple checks | small fans, small pumps with spares on the shelf
- Route, fortnightly | F-2, P-4, G-3 and most fans, pumps and gearboxes
- Other techniques first | electrical faults, leaks, wear not shown in vibration
- Online, with alarms to the control room | the chipper's main bearings
```

Small machines with cheap failures and spares on the shelf can run to failure. Machines whose likely failures vibration does not see well, such as electrical faults in motors, need other techniques. The bulk of the mill's rotating plant, about forty machines, goes on the fortnightly route. The chipper alone, whose failure stops the mill, has online sensors.

## Designing the route

A route is a list of measurement points in a walking order, each with its sensor, mounting, direction, measurements and settings, and the operating state in which it should be measured. The mill's route takes about six hours every second week: forty machines, about 160 points, with overall levels, spectra and envelope measurements at each bearing. Its design follows the lessons of the earlier chapters: steel pads at every point, settings chosen for each machine's speed and faults, operating states recorded, and band alarms set from each machine's baseline.

The route's interval, fortnightly, comes from the shortest P-F interval among the failure modes the program is meant to catch, as Chapter 1 explained. Machines whose findings are developing are moved to a weekly sub-route until they are repaired, and machines that have been steady for a year with long P-F intervals may move to a monthly route, freeing time for the others.

## People

Reading spectra well is a skill built by training and experience. ISO 18436-2 sets out a scheme of four categories of vibration analyst, from personnel who collect data on a defined route to those who direct a program and solve complex problems, with training, experience and examination for each. The mill's route technician is certified at the second category, able to set up measurements, diagnose common faults and recommend actions; for unusual problems the mill calls on a category III analyst from a service company. Certification is not a guarantee of good diagnosis, but it ensures a common vocabulary and a tested minimum of knowledge, which matters when findings must be explained to planners and managers. The mill budgets for refresher training every two years and for its technician to spend a day with the service company's analyst on each difficult case.

## Contractors or in-house

Many sites buy vibration monitoring as a service: a contractor walks the route on a schedule and sends a report. That brings trained analysts and good instruments without the cost of employing them, and it suits a site with too few machines to keep a technician busy. Its risks are the ones this book's mistakes illustrate: a contractor's instrument set up differently from the site's history, as in Chapter 2; reports that arrive but are not acted on, as in this chapter; and knowledge of the machines that leaves with the contractor. The mill chose an in-house technician for the route, because its forty machines and two shifts of production justified one, and keeps a service company for the specialist work and for cover during leave, with written settings and units that the service company must follow so that its readings join the same trend.

## Reporting and acting

Each route produces a report that lists every machine with a change since the last route, the finding, its severity and a recommended action with a time frame. Machines with no change are listed in a single line, so the report's length reflects the findings, not the route.

```figure
type: steps
title: From a finding to a closed work order
caption: This is an illustration of the mill's process. Each step is recorded so the loop can be audited.
- Finding | technician diagnoses the fault and its stage; severity and recommended action entered in the report
- Work request | raised in the maintenance system with the finding attached and a required-by date
- Planning | parts ordered; repair scheduled at a planned stop before the required-by date
- Repair | fitter records what was found, for example the bearing's damage pattern
- * Verification | technician measures the machine after repair and resets its baseline
- Review | monthly meeting checks every open finding and every overdue work order
```

The last two steps are the ones most often skipped. A measurement after repair confirms that the fault was fixed and no new one introduced, such as misalignment after a motor change, and sets the machine's new baseline. The monthly review is where findings that have stalled, waiting for parts or a shutdown, are escalated before they become failures.

## The mistake: a finding that was not acted on

In the program's first year, the route report flagged G-3's second-stage mesh as rising, recommended an inspection within eight weeks, and raised a work request. The request sat in the maintenance system's queue without a due date, because the system's default for new requests was "when convenient". Eleven weeks later the gearbox's output pinion failed, stopping the log deck for a day.

```figure
type: steps
title: Closing the gap between finding and action
caption: This is an illustration. The diagnosis was right and on time; the process around it failed.
- Finding | second-stage mesh harmonics rising; inspect within 8 weeks
- Work request | raised without a required-by date; sat in the queue
- Failure | week 11; log deck stopped for a day
- Review | the route report had been right; nobody had owned the request
- * Fix | every vibration finding carries a required-by date set from its severity; overdue findings reported at the monthly review
- Measure | findings closed by their date tracked as a program performance indicator
```

The vibration program had done its job; the maintenance system had not carried the finding to action. The mill changed the system so that every work request from a vibration finding carries a required-by date set from its severity, and the share of findings closed by their date became one of the program's performance indicators, reviewed monthly. In the following year it rose above 90%, and no failure occurred on a machine with an open finding. The lesson is general: the weakest link in most vibration programs is not the sensor, the analyst or the software, but the step from a correct finding to a scheduled repair.

## Combining techniques

Vibration is one of several condition monitoring techniques, and a program built on it alone misses what it cannot see. Oil analysis shows wear spread over many teeth or bearings and contamination before it causes damage, as Chapter 9 noted for G-3. Infrared thermography shows overheating connections, overloaded bearings and blocked coolers. Airborne ultrasound finds compressed-air leaks, electrical discharge and early bearing lubrication problems. Motor current analysis and insulation testing find electrical faults in motors, which vibration sees only when they become mechanical. The mill's program schedules each technique on the machines where it gives the longest warning of their likeliest failures, and its route technician records findings from all of them in the same system, so a planner sees one list of machine conditions, not five.

## Starting a program

The mill started its program small. In the first three months it put its ten most critical machines on the route, took their baselines after checking alignment and mountings, trained its technician and set up its alarm bands. Only when that core was running smoothly, with findings reaching work orders and repairs being verified, did it add the next thirty machines. Starting with every machine at once is a common reason programs fail: the technician spends all the available time collecting data, there is no time left to analyse it, and the first missed failure discredits the whole effort. A small program that demonstrably prevents failures earns the support to grow.

## Managing the data

Each route adds about 160 sets of readings to the database, and over a few years the history is the program's most valuable asset. It shows each machine's normal behaviour, how its faults developed and how quickly, and which repairs worked. The mill's software keeps every reading with its operating state, setting and notes, and every repair record is linked to the readings before and after it. The data is backed up with the maintenance system's, and when the route instrument is replaced, the history is migrated, not abandoned. A program that loses its history every few years starts again from nothing, and loses the P-F intervals and baselines that make its decisions sound.

## Measuring the program's value

The program's value is the failures it prevents, less its cost, and both must be estimated honestly. The mill counts, each year, the faults found and repaired before failure, with the repair's actual cost against an estimate of what the failure would have cost: lost production, collateral damage such as a seized bearing destroying a shaft, overtime and expedited parts. It counts failures that occurred despite the program, with their causes, which show where the program needs to change. And it counts the program's costs: the technician's time, instruments, sensors, training and the service company's call-outs.

```figure
type: stats
title: The route program's first full year at the mill
caption: This is an illustration from the mill's records; failure-cost estimates are the mill's own.
- 14 | faults found and repaired at planned stops
- 2 | failures despite the program: G-3's pinion, and a fan with no route point at the failed bearing
- about A$180,000 | estimated failure costs avoided
- about A$55,000 | program cost: technician time, instruments, sensors, training, call-outs
- about 3.3 to 1 | ratio of avoided cost to program cost
```

## Appraising the chipper's online system

The chipper's online system, two stud-mounted sensors, cabling, a monitoring unit and software, cost about A$38,000 installed, with about A$2,500 a year for calibration, software and maintenance. The chipper's bearing failure of Chapter 1 had stopped the mill for four days, which the mill valued at about A$30,000 a day of lost margin, A$120,000 in all. The mill's records suggested such a failure about once in three years, an expected cost of about A$40,000 a year, and the online system was credited with preventing 80% of it, A$32,000 a year.

The [equipment investment appraisal tool](/tools/investment-appraisal/) evaluates that case. With A$38,000 installed, A$32,000 a year in savings, A$2,500 a year running cost, no salvage, an eight-year life and an 8% hurdle rate, it gives a net yearly flow of A$29,500, an NPV of A$131,500, an IRR of 77% and a simple payback of 1.3 years. Halving the savings, to allow for the failure being rarer or the system less effective, still gives an NPV of A$39,600 and a payback of 2.8 years, within the mill's three-year rule. The online system also brought benefits the appraisal does not count: the control room sees the chipper's bearings continuously, so a sudden change during a night shift raises an alarm at once rather than waiting for the next route, and the load-triggered measurements of Chapter 8 are possible only online. Both strengthen a case that was already sound on the numbers.

```figure
type: compare
title: The chipper's online system at two levels of benefit
cols: Yearly saving | Net yearly flow | NPV at 8%, 8 years | IRR | Simple payback
rowhead: Case
- * Expected | A$32,000 | A$29,500 | A$131,500 | 77% | 1.3 years
- Half the benefit | A$16,000 | A$13,500 | A$39,600 | 32% | 2.8 years
caption: This is an illustration from the equipment investment appraisal tool, A$38,000 installed and A$2,500 a year running cost. Figures exclude GST and tax.
```

## Learn, apply, improve

Vibration monitoring rests on simple physics: forces in a machine shake its bearings at frequencies set by its speed and geometry, a crystal under a seismic mass turns that motion into charge, and a Fourier transform sorts the motion by frequency. Everything practical follows from measuring carefully and comparing honestly: the right units and the right band, a sensor mounted on clean steel, settings that resolve the frequencies that matter, alarms set from each machine's own history, a diagnosis confirmed by more than one line in a spectrum, and a finding carried all the way to a repair and a check. Each mistake in this book broke one of those links, and each was caught by someone asking whether a number made sense against what else was known.

## Exercise: should P-4 go online?

The mill considers fitting online sensors to P-4 at A$9,000 installed and A$800 a year. P-4's failures have cost about A$12,000 each, including a day of lost carriage operation, and occur about once every four years. The fortnightly route already catches most bearing faults; the mill estimates that online monitoring would prevent an additional 25% of P-4's failure cost. Using the investment appraisal tool's method with an 8% hurdle rate and an eight-year life, decide whether to proceed.

### Answer

**Given:** cost A$9,000; running A$800 a year; failure cost A$12,000 every four years, A$3,000 a year expected; extra benefit 25%, A$750 a year; 8%; 8 years.

**Assumptions:** uniform yearly benefit; no salvage; the route continues either way.

**Method:** net yearly flow = benefit − running cost; NPV = −cost + net flow × the uniform-series present worth factor for 8% and 8 years, 5.747.

**Net yearly flow:** 750 − 800 = −A$50.

**NPV:** −9,000 + (−50 × 5.747) = −A$9,287.

**Decision:** do not proceed. The route already captures most of P-4's benefit; online monitoring's extra protection is worth less than its running cost alone. The chipper's case was strong because its failures are much costlier and the route could not match online monitoring's warning; P-4's is not.

**Verification:** the investment appraisal tool, entered with A$9,000, A$750 savings, A$800 running cost, no salvage, 8 years and 8%, gives a negative net yearly flow and an NPV of about −A$9,290, and reports the investment as not justified.
