---
book: vibration-monitoring-by-the-numbers
chapterSlug: why-vibration-reveals-condition
order: 1
title: "Why vibration reveals condition"
description: "How faults change vibration, the P-F interval between first sign and failure, why time-based replacement fails for random failures, monitoring intervals, and a quarterly route that missed a bearing."
draft: false
---

A machine in good condition vibrates in a characteristic, steady way. Its rotor is never perfectly balanced, its shafts never perfectly aligned, its bearings never perfectly round, and each imperfection produces a small force at a particular frequency, once or twice per revolution, or at a rate set by a bearing's geometry or a gear's tooth count. As the machine wears or develops a fault, one of those forces grows, or a new one appears, and the vibration measured on its bearing housing changes. That change, measured regularly and compared with the machine's own history, is the basis of vibration monitoring.

This chapter explains why faults show in vibration and how early, introduces the interval between a fault's first detectable sign and functional failure, shows with a Weibull model why replacing parts on a schedule does little for failures that occur at random, and turns the interval into a monitoring frequency. It finishes with the mill's chipper, whose bearings were checked every quarter and failed between two visits.

## How faults become vibration

A rotor spinning at speed carries any imbalance of its mass around with it. The imbalance produces a rotating force, and the bearings, housings and foundation respond to it by moving. That motion, measured at the bearing housing, is the machine's vibration. Its size depends on the force and on how stiff and well damped the structure is at the force's frequency; its frequency is the force's frequency.

The power of the method is that different faults produce forces at different frequencies. An unbalanced rotor produces a force once per revolution, at the shaft's rotational frequency, called 1×. A misaligned coupling bends the shafts and produces forces at 1× and 2×, often strongly in the axial direction. Loose mountings let the machine rattle at many multiples of the running speed. A defect on a rolling bearing's race is struck by each ball as it passes, at a rate set by the number of balls and the bearing's dimensions. A damaged gear tooth disturbs the mesh once per revolution of its gear. The spectrum of the vibration, its amplitude at each frequency, is therefore a catalogue of the forces acting in the machine, and each line can be traced to a cause. Reading that catalogue is the skill the rest of this book builds, one fault at a time, with the mill's machines as examples.

```figure
type: compare
title: Common faults and where they show in the spectrum
cols: Frequency | Direction | Typical progression
rowhead: Fault
- Unbalance | 1× running speed | radial, horizontal and vertical similar | steady; grows with build-up or loss of material
- Misalignment | 1× and 2×, sometimes 3× | strong axial component | steady; worsens as couplings wear
- Mechanical looseness | many harmonics of 1×, sometimes ½× | radial, often directional | can worsen quickly once fasteners loosen
- Rolling bearing defect | non-integer multiples set by geometry | radial | weeks to months from first sign to failure
- Gear tooth damage | gear mesh frequency with sidebands | radial and axial | slow wear or sudden after a tooth cracks
- Resonance | wherever a natural frequency meets a forcing frequency | one direction usually dominant | depends on speed; may appear only at one speed
caption: Typical signatures for guidance; Chapters 6 to 9 work through each with the mill's machines.
```

## The P-F interval

Most faults do not appear suddenly at full size. A bearing's race develops a small subsurface crack, which grows into a spall, which grows until the bearing runs rough, heats and seizes. Somewhere along that path the fault becomes detectable by vibration, at point P, potential failure. Later the machine can no longer do its job, at point F, functional failure. The time between them is the P-F interval, and it is the single most important number in planning condition monitoring.

```figure
type: line
title: The P-F curve: condition against time for a rolling bearing
x: Weeks from the start of the defect
y: Condition, % of new
ymin: 0
ymax: 100
caption: This is an illustration. P, the first point at which vibration analysis can detect the defect, is at about week 4; F, functional failure, at about week 12. The P-F interval is about 8 weeks. Other techniques, such as noise, heat or a visible leak, detect the same fault later, with shorter useful warning.
- 0 | 100
- 4 | 97
- 6 | 92
- 8 | 82
- 10 | 62
- 11 | 45
- 12 | 20
```

The P-F interval depends on the fault, the machine and the technique. A vibration route detects a rolling bearing defect much earlier than an operator listening for noise or touching for heat, so its P-F interval is longer, which is the reason for using it. The mill's records of past bearing failures on its fans and pumps, where the first change in the bearing's vibration had been noted afterwards on old route data, put the P-F interval for these bearings at about eight weeks. That figure is the mill's own, from its own machines and route equipment, and it is the right kind of number to plan with: one measured on similar machines with the same technique.

### Setting the monitoring interval

If a machine is checked at intervals shorter than the P-F interval, a fault that starts between two checks will be caught before failure. A common rule is to check at half the P-F interval, which guarantees at least one check, and usually two, between P and F, leaving time to plan the repair after the fault is found.

```figure
type: formula
title: Monitoring interval from the P-F interval
formula: Interval ≤ P-F interval ÷ 2        Net warning after detection ≥ P-F interval − interval
caption: With an 8-week P-F interval and a 4-week route, a fault is detected with at least 4 weeks to spare; with a 2-week route, at least 6 weeks. A shorter interval buys more planning time at more cost.
- Interval | time between successive measurements of the machine
- Net warning | the least time left between detection and failure
```

The mill's fortnightly route gives at least six weeks' warning of a bearing defect on its fans and pumps, enough to order a bearing, schedule a shutdown and fit it during a planned stop.

## Why replacing parts on a schedule often fails

The alternative to monitoring is to replace parts at fixed intervals, before they are expected to fail. That works only when failures are concentrated at a predictable age, which depends on the shape of the failure distribution. A Weibull distribution describes it with two numbers: the shape β, which says whether failures cluster at an age (β well above 1), occur at a fairly constant rate whatever the age (β near 1), or concentrate early in life (β below 1); and the characteristic life η.

The [Weibull reliability tool](/tools/weibull-reliability/) shows the difference. For the mill's fan bearings, with a shape of 1.1 and a characteristic life of 45,000 hours, close to random failure, the tool gives a reliability of 84.8% after a year of continuous running, 8,760 hours, and a B10 life of 5,818 hours: one bearing in ten fails within the first eight months. Replacing them every year would still leave about 15% failing in service and would throw away many bearings with years of life left. For a part with a strong wear-out pattern, a shape of 3.0 and the same characteristic life, the tool gives 99.3% reliability at a year and a B10 life of 21,254 hours, and time-based replacement makes sense.

```figure
type: compare
title: Time-based replacement against the failure pattern
cols: Reliability at 8,760 h | B10 life | Mean life | Time-based replacement
rowhead: Bearing population
- Fan bearings, β = 1.1, η = 45,000 h | 84.8% | 5,818 h | ineffective: failures are nearly random in age
- Wear-out part, β = 3.0, η = 45,000 h | 99.3% | 21,254 h | effective: failures cluster at an age
caption: This is an illustration from the Weibull reliability tool. Rolling bearings in industrial service often show shapes near 1 to 1.5, because their failures are driven by contamination, lubrication and installation as much as by age.
```

Rolling bearings in industrial service often fail more from contamination, poor lubrication, misalignment and installation damage than from fatigue at their rated life, so their failures are spread widely in age. For such parts, condition monitoring, which replaces the part when it shows a fault rather than when it reaches an age, saves both the failures that time-based replacement misses and the good parts it discards.

## The baseline

Vibration monitoring compares a machine with itself. A reading of 3 mm/s on a fan means little on its own; the same reading on a fan that has run at 1.5 mm/s for two years means its vibration has doubled, which is worth investigating whatever any general guideline says. Every machine on the route therefore needs a baseline: a set of readings, overall levels and spectra, taken when it is known to be in good condition, ideally soon after commissioning or overhaul, under its normal operating conditions.

The mill took its baselines in the first month of the route, after checking each machine's alignment and mountings, and stored them with notes of the speed, load and temperature at the time. A baseline taken on a machine that already has a fault is a poor reference, because every later reading looks normal against it. When a machine is repaired or modified, its baseline is retaken, and the old one is kept for comparison.

## Measuring under the same conditions

A machine's vibration changes with its operating state as well as its condition. A fan running at full flow vibrates differently from the same fan throttled back; a pump near its best efficiency point runs smoother than one far to either side of it; a gearbox under load shows its mesh more clearly than one running light; a cold machine differs from a warm one as clearances change. If successive readings are taken in different states, the trend shows changes of state, not of condition.

The route therefore records the operating state with each reading and, where it can, takes readings in a standard state. F-2 is measured with its dampers fully open, P-4 with the log carriage running, and G-3 with logs on the deck. Where a machine cannot be put in a standard state, the readings are grouped by state and each group is trended separately. Skipping this step makes good trends noisy and hides real changes in the noise.

## Route-based and online monitoring

**Route-based monitoring** sends a technician with a portable data collector to each machine at set intervals. It is flexible and cheap per machine and suits most plant whose P-F intervals are weeks or months.

**Online monitoring** mounts sensors permanently and measures continuously or every few minutes. It suits machines whose failure would be very costly, whose P-F intervals are short, or which are hard to reach, and it can trip a machine automatically on a sudden rise. The mill's chipper, its largest and most critical machine, has online sensors; everything else is on the route. Between the two sit wireless sensors, small battery-powered units fixed to a bearing housing that send an overall level and a short spectrum a few times a day. They cost far less to install than wired online systems and suit machines that are hard to reach on a route, such as fans on a roof or pumps in a pit, though their battery life limits how often and how much they measure. The choice for each machine follows from three questions: how short is its P-F interval, how much would its failure cost, and how easy is it to reach?

## The mistake: a quarterly route on the chipper

Before its online sensors were fitted, the chipper was on a quarterly route, because it was large, slow-running and robust, and because the route technician's time was short. In its third year a main bearing failed during a shift, two weeks after a route visit at which its vibration had been normal. The chipper was down for four days while a bearing was flown in and fitted.

```figure
type: steps
title: Matching the chipper's monitoring to its P-F interval
caption: This is an illustration. A quarterly interval is longer than the P-F interval, so a fault can start just after one visit and fail before the next.
- Interval | quarterly, about 13 weeks
- Bearing P-F interval on similar machines | about 8 weeks
- Failure | 2 weeks after a normal reading; a defect starting after that visit had 6 weeks to reach failure
- * Rule | interval at most half the P-F interval: 4 weeks or less
- Decision | chipper fitted with online sensors on both main bearings; other critical machines put on a fortnightly route
```

A quarterly interval, about thirteen weeks, was longer than the eight-week P-F interval, so a defect starting just after one visit could run its whole course before the next. The rule of half the P-F interval would have required at most four weeks. Given the chipper's importance and the cost of four days' lost production, the mill fitted permanent sensors to both main bearings, with alarms to the control room, and moved its other critical machines to a fortnightly route. The cost of the online system was recovered by avoiding a single repeat of the failure, as Chapter 10 shows.

## What vibration cannot see

Vibration monitoring is powerful for rotating machines and weak for other failure modes. It does not see an electrical fault in a motor winding until it becomes mechanical, a corroded pipe, a failing seal that leaks without changing the forces, or a lubricant that is degrading but not yet affecting the bearing. Oil analysis, thermography, motor current analysis and ultrasonic testing each see some of what vibration misses, and a mature program uses each where it gives the longest warning.

## Exercise: setting the gearbox's interval

The mill's records show that gear tooth wear on conveyor gearboxes like G-3 is detectable by vibration about 20 weeks before the gearbox loses function, and that a sudden tooth crack, when it occurs, gives about 3 weeks. Using the half-interval rule, set a route interval for each failure mode and decide which to adopt. Then state the least warning each interval gives for each mode.

### Answer

**Given:** P-F interval 20 weeks for wear and 3 weeks for a cracked tooth.

**Assumptions:** the P-F intervals apply to this gearbox with the mill's route equipment; detection occurs at the first route visit after P.

**Method:** interval ≤ P-F ÷ 2; least net warning = P-F − interval.

**Wear:** interval ≤ 20 ÷ 2 = 10 weeks.

**Cracked tooth:** interval ≤ 3 ÷ 2 = 1.5 weeks.

**Choice:** the route visits G-3 fortnightly with the rest of the critical plant, so the interval is 2 weeks. That more than covers wear, with at least 20 − 2 = 18 weeks of warning. For a cracked tooth, a 2-week interval exceeds the 1.5-week guide; the least warning is 3 − 2 = 1 week, which is enough to arrange a planned stop for a gearbox like G-3, held as a spare, but not much more.

**Interpretation:** the shortest P-F interval among the failure modes that matter sets the interval. If a cracked tooth on G-3 were more damaging, for example if the conveyor fed the whole mill, weekly checks or an online sensor would be justified.

**Verification:** each interval is at most half its P-F interval, except the fortnightly route for the cracked tooth, which is 0.67 of it, and the warnings follow from subtraction: 18 weeks and 1 week.
