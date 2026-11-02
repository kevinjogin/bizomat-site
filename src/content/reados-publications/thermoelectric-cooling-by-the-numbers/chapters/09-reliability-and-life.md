---
book: thermoelectric-cooling-by-the-numbers
chapterSlug: reliability-and-life
order: 9
title: "Reliability and life"
description: "How thermoelectric coolers wear out, Weibull and series-system reliability for a cooler, field MTBF with confidence bounds, spares, and a thermostat that cycled a module to death."
draft: false
---

A thermoelectric module has no moving parts, and it is tempting to treat it as lasting forever. Run steadily, at a moderate hot-side temperature and sealed against moisture, a good module does last a very long time. But a cooler is more than its modules. Its fans wear out, its controller and supply can fail, and its modules themselves wear quickly if they are cycled hard and often or run hot. Since Chapter 6 showed that TC-1's insulated cabinet overheats within hours without its cooler, the cooler's reliability is the cabinet's.

This chapter sets out how each part of a cooler wears, models CC-1's reliability over five years with Weibull and series-system calculations, reads the trust's field record with confidence bounds, and finishes with the sample box's first module, killed by a thermostat that switched it on and off fifteen times an hour.

## How modules wear

The modules' weak points are their joints. Each leg is soldered at both ends to copper strips, with a thin barrier layer, usually nickel, between the solder and the semiconductor to stop the two interdiffusing.

**Thermal cycling.** Every time a module starts or stops, its hot plate expands and its cold plate contracts, by different amounts, and the legs between them are bent slightly. The solder joints at the corners of the module take the most strain. Repeated thousands of times, the cycles crack the joints, and the module's resistance rises until it fails open. The damage per cycle grows steeply with the size of the temperature swing. Steady operation, or slow and small changes, causes very little.

**Hot-side temperature.** Diffusion of solder and copper into the legs, and of the legs' elements into the joints, proceeds faster as temperature rises, and the hot side is where it happens. A module run continuously near its maximum hot-side temperature degrades much faster than one at 50 or 60 °C. That is one more reason for the clean hot-side sink of Chapter 5.

**Moisture.** Water condensing inside a module, on its cold strips, corrodes the joints and creates leakage paths. Edge sealing, as Chapter 7 described, is the defence.

**Mechanical stress.** Uneven clamping, shock or over-tightening cracks the ceramic or the legs. These failures are often immediate, or appear within the first weeks, and they are prevented by the assembly procedure rather than by the design.

## How the rest of the cooler wears

The fans are the cooler's only moving parts and its most likely failures. A fan's bearing life is usually stated as an L10 life: the time by which 10% of fans are expected to have failed, at a stated temperature. CC-1's hot-side and internal fans are ball-bearing types whose maker states, for this illustration, an L10 life of 50,000 hours at 40 °C. Fan life falls as temperature rises, because bearing lubricant degrades faster, so the hot-side fan, breathing 45 °C air on summer afternoons, is the one most at risk.

The controller and supply are electronic, and their failures are dominated by components such as electrolytic capacitors, whose life also falls with temperature, and by surges from lightning and switching on long rural supply lines.

## A Weibull model of one fan

The Weibull distribution describes wear-out with two parameters: a shape β, above 1 for wear-out, and a characteristic life η, by which 63.2% have failed. A fan with an L10 of 50,000 hours and a shape of 3, typical of bearing wear, has η = 50,000 ÷ (−ln 0.9)^(1/3) = 105,900 hours.

The [Weibull reliability tool](/tools/weibull-reliability/) gives the consequences. Entering β = 3, η = 105,900 hours and a mission of five years of continuous running, 43,800 hours, it gives a reliability of 93.2%, so 6.8% of fans would fail within five years, a B10 life of 50,000 hours, as stated, and a mean time to failure of 94,600 hours. The pattern is wear-out, so replacing fans on a schedule before they fail is effective.

## The whole cooler as a series system

CC-1 fails if any one of four blocks fails: the hot-side fan, the internal fan, the module string or the controller and supply. That is a series system, and its reliability is the product of the blocks'.

```figure
type: compare
title: CC-1's reliability over five years of continuous running, 43,800 hours
cols: Weibull shape β | Characteristic life η | Reliability at 5 years
rowhead: Block
- Hot-side fan, L10 50,000 h | 3 | 105,900 h | 93.2%
- Internal fan, L10 50,000 h | 3 | 105,900 h | 93.2%
- Module string, steady proportional control | 1.5 | 400,000 h | 96.4%
- * Controller and supply | 1 | 500,000 h | 91.6%
- Cooler as a series system | — | — | 76.7%
caption: This is an illustration. Block parameters are assumed for illustration, not maker's data; the system result is from the system reliability tool, which also gives a system mean time to failure of 66,500 h.
```

The [system reliability tool](/tools/system-reliability/) multiplies the blocks' reliabilities and integrates the system's reliability curve for its mean life. With the four blocks above it gives 76.7% at five years, against the trust's target of 80%, and identifies the controller and supply as the weakest block, closely followed by the fans. The modules, under steady proportional control, are the most reliable part.

Two improvements follow. Replacing both fans every two and a half years, before wear-out builds up, raises each fan position's reliability over the five years to 0.991² = 98.2%, and the cooler's to 85.3%. Protecting the controller and supply with a surge diverter on the station's incoming supply addresses the most likely cause of electronic failures, and stocking a spare controller at the trust's depot shortens the outage when one fails. The trust did both. Neither change touches the modules, which is typical: in a well-designed thermoelectric cooler, the modules are rarely the weakest part.

## What the field record says

The trust runs fourteen coolers like CC-1 across its pump stations. Over four years, a total of 14 × 4 × 8,760 = 490,560 cooler-hours, three failed: two hot-side fans and one controller after a lightning storm. The [MTBF confidence bounds tool](/tools/mtbf-confidence-bounds/) treats the failures as occurring at a constant rate and gives an MTBF estimate of 163,520 hours, a one-sided 90% lower bound of 73,400 hours, and an 80% two-sided interval from 73,400 to 445,100 hours.

```figure
type: range
title: The fleet's MTBF, with its confidence interval
unit: h
min: 0
max: 460000
caption: This is an illustration. 490,560 cooler-hours and 3 failures. The constant-rate assumption is rough for fans, which wear out, but adequate for a fleet of mixed ages.
- 80% two-sided interval | 73428 | 445128 | from the chi-square bounds
- * Point estimate | 163520 | 163520 | cooler-hours per failure
- Trust's target MTBF | 100000 | 100000 | not yet demonstrated at 90% confidence
```

Three failures are too few to say much. The estimate, one failure per 163,500 hours, about one failure per cooler in nineteen years of continuous running, is encouraging, but the tool shows that the trust's target of 100,000 hours is not yet demonstrated at 90% confidence: about 177,500 more failure-free cooler-hours, roughly a year and a half of the fleet, would be needed. Meanwhile, the failures themselves are the more useful information: two of the three were fans, which supports the planned fan replacement.

## A maintenance plan built from the numbers

The reliability model and the field record together give the trust a plan for each cooler, set out in its maintenance system.

**Every spring, before summer.** Clean the hot-side fins with compressed air from the fan side outwards, as Chapter 5 found necessary; check both fans run freely and quietly; check the cabinet's gasket and glands; read the hot-side and cabinet temperature trends from the telemetry for the previous summer and compare them with the commissioning figures at similar outside temperatures.

**Every two and a half years.** Replace both fans, whatever their condition, since their wear-out pattern makes failures increasingly likely after that time and a fan costs far less than a site visit to an overheated cabinet.

**When the telemetry asks.** Investigate a hot-side temperature more than about 5 K above its commissioning value at the same outside temperature, a module string resistance more than 10% above commissioning, or a cabinet dew point rising from week to week.

**Never.** Replace modules on a schedule. Under steady proportional control their wear is slow, and the resistance trend gives warning; replacing sound modules disturbs their carefully clamped interfaces for no benefit.

## Spares and the cost of an outage

Reliability is only half of what matters; the other half is how long the cabinet is without cooling when something fails. An insulated cabinet with 48 W inside rises towards 42.5 K above the outside air once its cooler stops, and on a summer day it passes 35 °C within an hour or two. The router and battery tolerate a few hours at 40 to 50 °C without damage, so the trust's target is to restore cooling within a day of the alarm. That target sets the spares: two fans of each type, one controller and one complete spare cooler held at the depot, from which a technician can swap a cooler in an hour and return the faulty one to the workshop for repair.

With fourteen coolers, the expected number of failures each year at the fleet's present rate is 14 × 8,760 ÷ 163,520 = 0.75, so one complete spare cooler and the fan and controller spares cover the likely demand with room to spare. The [critical spares plan tool](/tools/critical-spares-poisson-plan/) makes that check with a Poisson model of random failures over the time it takes to repair a returned cooler and put it back on the shelf. Entering 14 coolers, an MTBF of 163,520 hours, 24 running hours a day, a 30-day workshop turnaround and a 95% target gives 0.062 expected failures during a turnaround, one spare needed, and 99.8% cover from the one spare held. The tool's own caution applies: the model assumes random failures, and fans wear out, which is another reason to replace them on a schedule rather than rely on the spare.

### Commissioning catches the early failures

Mechanical damage during assembly, a cracked leg or a poorly wetted solder joint, tends to show itself early. Each new or rebuilt cooler is therefore run for 48 hours at full current on the workshop bench, with its module string resistance measured before and after and its hot and cold faces logged. A rise in resistance, or one module whose face temperature differs from its neighbours, sends it back for rework before it reaches a station, where the same failure would cost a site visit.

## The mistake: a thermostat that wore out a module

SC-1's first module failed after four years, as Chapter 1 recorded. When the reliability engineer reviewed the sample box's controller log, the cause was clear. Its original thermostat had a hysteresis of only 0.5 K around its 4 °C setpoint, and in the box's small, well-insulated volume it switched the module fully on and off about every four minutes, fifteen times an hour.

```figure
type: steps
title: Counting the cycles that killed SC-1's first module
caption: This is an illustration. The maker's cycling test figure is assumed for illustration; the point is the ratio, not the exact number.
- Thermostat | 0.5 K hysteresis; module switched fully on and off about every 4 minutes
- Cycles per running year | 15 an hour × about 3,000 running hours = 45,000
- Cycles in four years | about 180,000 full on–off cycles
- Module maker's cycling test | qualification to 5,000 full cycles, a small fraction of the duty
- * Failure | module resistance rose over the last months; failed open in its fourth year
- Fix | proportional control with a filtered steady current; resistance logged monthly as an early warning
```

About 45,000 full on–off cycles a year, 180,000 in four years, each swinging the module's faces from near equal temperatures to a 44 K difference and back, is a far harsher duty than steady running and well beyond the cycling qualification in the maker's data. The module's resistance, which the controller had logged without anyone watching it, had risen steadily over its last few months as its joints cracked. The replacement module runs under proportional control, with a steady current that changes slowly with the box's load, and the controller now reports the module's resistance, calculated from its voltage and current at moments when the faces are near equal, in the station's monthly telemetry summary. A rise of more than about 10% from its commissioning value will prompt a replacement before the box warms.

## Exercise: fan replacement interval

The trust wants the cooler's five-year reliability above 85%. Using the block parameters in this chapter, calculate each fan position's reliability over five years if both fans are replaced every 2.5 years, and then the cooler's reliability. Then calculate the cooler's reliability if, in addition, the controller block's characteristic life is raised to 1,000,000 hours by a surge diverter and a better supply.

### Answer

**Given:** fans β = 3, η = 105,900 h; modules β = 1.5, η = 400,000 h; controller β = 1, η = 500,000 h, then 1,000,000 h; mission 43,800 h; fan replacement every 21,900 h.

**Assumptions:** a replaced fan is as good as new; blocks fail independently; the Weibull parameters apply at the station's conditions.

**Method:** R(t) = exp[−(t ÷ η)^β] for each block; a replaced fan's reliability over the mission is its reliability over one interval squared; system reliability is the product of the blocks.

**Fan over one interval:** exp[−(21,900 ÷ 105,900)³] = exp(−0.00884) = 0.9912. Over two intervals: 0.9912² = 0.9825.

**Modules:** exp[−(43,800 ÷ 400,000)^1.5] = exp(−0.0362) = 0.9644.

**Controller, η = 500,000 h:** exp(−43,800 ÷ 500,000) = exp(−0.0876) = 0.9161.

**Cooler with fan replacement:** 0.9825 × 0.9825 × 0.9644 × 0.9161 = 0.853, or 85.3%, just above the target.

**Controller, η = 1,000,000 h:** exp(−0.0438) = 0.9571. **Cooler:** 0.9825 × 0.9825 × 0.9644 × 0.9571 = 0.891, or 89.1%.

**Interpretation:** fan replacement alone just meets the target, with no margin for the hot-side fan's shorter life in hot air. Improving the controller's protection lifts the cooler to 89%, and makes the controller no longer the clear weakest block.

**Verification:** the system reliability tool, given the replaced fans' effective reliability and the other blocks, gives the same products; without fan replacement, its result of 76.7% matches 0.9317² × 0.9644 × 0.9161 = 0.767.
