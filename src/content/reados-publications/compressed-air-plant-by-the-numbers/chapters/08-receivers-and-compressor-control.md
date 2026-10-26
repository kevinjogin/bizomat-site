---
book: compressed-air-plant-by-the-numbers
chapterSlug: receivers-and-compressor-control
order: 8
title: "Receivers and compressor control"
description: "Size CA-1's receiver from its cycle time, compare load and unload, modulation and variable speed control at 70 per cent load, store air for peaks, and catch a receiver valved out of service."
draft: false
---

A compressor that delivers 6.0 m³/min to a plant that uses an average of 4.2 m³/min must spend part of its time not compressing. How it does that, and how often it switches, decides much of its electricity bill and much of its wear. The receiver, the steel vessel between the compressor and the plant, decides how often it switches. The control system decides what the compressor does when it is not needed.

This chapter sizes CA-1's receiver from the time it takes to cycle, compares the main control modes at CA-1's 70 per cent load, shows how a receiver can also cover peaks, and sets out the duties attached to a receiver as a pressure vessel. It closes with a receiver that was quietly taken out of the system.

## Load and unload control

CA-1 runs on **load and unload** control. When the pressure falls to its lower limit, the compressor loads and delivers its full 6.0 m³/min. When the pressure reaches its upper limit, it unloads: its inlet closes and it runs on, compressing almost nothing, until either the pressure falls and it loads again or a run-on timer stops the motor. The pressure band between the limits, here taken as 60 kPa, and the receiver volume set how long each phase lasts.

While loaded, the compressor fills the receiver at the difference between its output and the plant's demand. While unloaded, the plant draws the receiver down at its full demand. For a receiver of volume V, a pressure band Δp and atmospheric pressure p_a:

```figure
type: formula
title: Load and unload times for a receiver
formula: t_unload = V Δp ÷ (p_a Q_demand)
formula: t_load = V Δp ÷ (p_a (Q_compressor − Q_demand))
- V | receiver volume, plus the volume of connected pipework, m³
- Δp | the pressure band between unload and load, kPa
- p_a | atmospheric pressure, 101.325 kPa
- Q | free air flows, m³/min
step: CA-1 with 3 m³, 60 kPa band, 6.0 m³/min compressor, 4.2 m³/min demand
step: t_unload = 3 × 60 ÷ (101.325 × 4.2) min ≈ 25.4 s
step: t_load = 3 × 60 ÷ (101.325 × 1.8) min ≈ 59.2 s
step: one cycle ≈ 84.6 s, about 43 cycles an hour
caption: Free air and ideal gas at constant temperature. Real receivers warm and cool slightly during each cycle; the formula is the standard sizing estimate.
```

## Sizing the receiver

The receiver's job in load and unload control is to stretch each cycle so the compressor does not switch too often. Rapid cycling wears valves, motors and starters, and with a run-on timer that stops the motor on long unload periods, too many starts per hour can overheat the motor. Compressor makers state limits on load cycles and motor starts; the receiver is sized so that the plant's demand pattern stays within them.

```figure
type: compare
title: CA-1's cycle time by receiver volume at 4.2 m³/min demand
rowhead: Effective storage
cols: Unload time | Load time | Cycles per hour
caption: This is an illustration: 6.0 m³/min compressor, 60 kPa pressure band. The worst cycling occurs when demand is about half the compressor's output.
- 0.3 m³, piping only | about 2.5 s | about 5.9 s | about 426
- 1 m³ | about 8.5 s | about 19.7 s | about 128
- * 3 m³ | about 25.4 s | about 59.2 s | about 43
- 5 m³ | about 42.3 s | about 98.7 s | about 26
```

The cycle rate also depends on demand. With a 3 m³ receiver, CA-1 cycles about 45 times an hour at 2.0 m³/min, about 51 times at 3.0 m³/min, about 43 times at 4.2 m³/min and about 28 times at 5.0 m³/min. The worst case is when demand is half the compressor's output, because load and unload times are then equal and their sum is shortest. A receiver sized for the average demand may still cycle too fast at the half-load point, which in many plants occurs on night shifts or weekends.

Widening the pressure band also lengthens cycles, but every extra kilopascal of upper limit costs compression energy, as Chapter 7 showed. Volume is usually the cheaper lever. The [compressed-air main sizing tool](/tools/air-main-sizing/) includes a receiver estimate on the same basis.

## Wet and dry receivers

A receiver placed between the compressor and the dryer, as CA-1's is, is called a wet receiver. It cools the air further, drops more water before the dryer, and buffers the dryer from the compressor's pulsing output. A receiver placed after the dryer, a dry receiver, stores dried air that can be drawn quickly without passing through the dryer, which helps when the plant's peaks exceed the dryer's rating. Many systems have both. The cycle-time formula applies to the total effective volume between the compressor and the point where its pressure is sensed, which is why the sensing point matters too: a pressure switch that sees only a small part of the system's volume will cycle the compressor as if the receiver were not there.

## Run-on timers and starts

A load and unload compressor that unloads for a long time stops its motor after a set run-on period to save the unloaded power. Each stop means a later restart, and electric motors are limited in how many starts an hour they can make without overheating, a limit the compressor and motor makers state. The run-on time is therefore a balance: long enough to keep starts within the limit at the plant's lightest loads, short enough to save unloaded power during genuinely quiet periods such as breaks and weekends. Variable speed compressors handle light loads by slowing down, and some can stop and restart more freely, which is another part of their advantage on swinging demands.

## Measuring how the control performs

The compressor's controller records loaded hours, running hours, load cycles and motor starts. Read monthly, these show the compressor's average load, how often it cycles and whether that is changing. A rising cycle count with no change in production, as in the failure case below, points to lost storage or a shifted pressure setting. Logging the compressor's power for a typical week, with a clamp-on power meter if the package has no meter, shows the actual unloaded power, which varies between machines more than brochures suggest and is the input that decides whether variable speed would pay.

## Comparing control modes

What a compressor draws while it is not delivering air varies greatly with its control:

- **Load and unload:** while unloaded, an oil-injected screw still turns its motor and element against the oil system and the residual pressure in its separator, drawing a significant fraction of its full-load power. The fraction depends on the machine and on how quickly it vents its separator pressure; a teaching value of 25 per cent of full-load power is used here.
- **Modulation:** the compressor throttles its inlet to match demand without unloading. It is simple and holds steady pressure, but power falls only slowly as output falls, so at 70 per cent output it may still draw around 90 per cent of full-load power.
- **Variable speed drive:** the motor slows to match demand. Power falls roughly in proportion to output over much of the range, with some loss of efficiency at low speeds.

```figure
type: bars
title: CA-1's annual electricity at 70 per cent average load, by control mode
unit: A$
max: 60000
caption: This is an illustration, excluding GST, at 6,000 hours and A$0.25 per kWh. Unloaded power is a teaching 25 per cent of full load, or 40 per cent for a machine slow to vent; modulation is taken as 90 per cent of full power at 70 per cent output; variable speed as 7.0 kW per m³/min.
- Modulation | 55350
- Load and unload, slow to vent, 40 per cent unloaded | 50430
- * Load and unload, 25 per cent unloaded | 47663
- Variable speed drive | 44100
```

At CA-1's 70 per cent average, the spread between control modes is about A$11,000 a year: about 8.79 kW per m³/min of average specific power for modulation, about 7.57 for load and unload with a quick-venting machine, and about 7.00 for variable speed. A variable speed compressor would save about A$3,600 a year against CA-1's current control, with a payback that depends on its price premium.

The saving grows as the average load falls further below full load, and disappears at full load, where a variable speed drive's own small losses make it slightly worse. That is why demand profile, measured over weeks, decides whether variable speed pays. A plant that runs fully loaded all day gains little; a plant whose demand swings widely gains a great deal. A month of logged power and pressure, taken before any quotation is requested, turns the choice into arithmetic rather than a sales conversation.


## Where the pressure band sits

The pressure band is not free either. A compressor on load and unload control with a 60 kPa band spends half its loaded time above its average pressure, generating air at up to 60 kPa more than the plant needs. If the plant's lowest acceptable pressure sets the band's lower limit, the average generated pressure is about 30 kPa above it, costing roughly 2.3 per cent of compression power at CA-1's pressure, from the slope in Chapter 2. A variable speed compressor holds a narrow band around a single set point, which is part of its saving, and a well-tuned sequencer does the same for a group of compressors.

The receiver allows the band to stay narrow without fast cycling. Volume and band are traded against each other in the formula above: doubling the receiver halves the band needed for the same cycle time. Steel is a one-off cost; pressure is paid for every hour the compressor runs.

## Storage for peaks

A receiver can also cover short peaks that would otherwise need a larger compressor or cause pressure to sag. The volume needed to supply an extra flow Q for a time t, with an allowable pressure drop Δp, follows from the same reasoning:

**V = Q t p_a ÷ Δp**

This is an illustration. A line on CA-1's site draws an extra 2.0 m³/min for 30 seconds at the start of each batch. If the pressure may fall by 100 kPa during that burst, the storage needed is 2.0 × 0.5 × 101.325 ÷ 100, about **1.0 m³**. Placed close to that line, a 1 m³ receiver covers the burst without the compressor loading up or the main's pressure dropping for everyone else. That is the local receiver used to fix the far machine in Chapter 7.

## Several compressors

Plants with more than one compressor need a sequencer or master controller that decides which compressors run, which one trims, and at what pressures. Without one, each compressor's own pressure switch acts independently, the pressure bands stack one above another, and the plant runs at a higher average pressure than it needs, with several compressors part-loaded at once. A common arrangement runs fixed-speed compressors fully loaded for the base demand and a single variable speed compressor to trim, with the sequencer holding one narrow pressure band for the whole system.

## The receiver is a pressure vessel

CA-1's receiver stores about 3 m³ of air at 750 kPa gauge: a considerable amount of energy, released violently if the vessel fails. Air receivers are pressure vessels, designed and built to AS 1210, classified by hazard level under AS 4343, and subject to the model WHS Regulations, which require registration of certain pressure vessel designs and items depending on hazard level, and to an in-service inspection regime. Every receiver has a safety valve, set at or below its design pressure and sized to pass the full output of every compressor that can feed it, and a drain, because water collecting inside corrodes it from within, as Chapter 5 noted.

Receivers that are moved, modified, repaired by welding or connected to a new, larger compressor need competent review before they return to service. A receiver's nameplate, design registration and inspection records belong with the compressor room's records.

## A failure case: the receiver valved out

This is an illustration. During a dryer service, CA-1's receiver was isolated with its inlet and outlet valves so the dryer could be worked on. After the service, the dryer was returned to service, but the receiver's outlet valve was left closed. The compressor now fed the plant through the dryer bypass directly, with only the piping as storage.

Nothing failed immediately. Over the following weeks the compressor's controller logged far more load cycles than before, its motor ran hotter, and a maintenance technician noticed that the system pressure was swinging rapidly. With about 0.3 m³ of piping in place of 3 m³ of receiver, the calculation above predicts about 426 cycles an hour at CA-1's average demand, against about 43. The compressor was approaching its maker's limits on cycling for much of the day.

The error was detected from the controller's cycle count, which had been noted in the monthly report. The correction was to open the receiver outlet valve, close the dryer bypass, and add valve positions to the start-up checklist that follows any maintenance in the compressor room. Valves in the main air path were given locks or tags showing their normal running position. The monthly cycle count, which caught this fault, was kept as a standing line in the compressor report.


## Exercise: the night shift

On night shift, CA-1's plant uses about 3.0 m³/min. With the 3 m³ receiver and 60 kPa band, how often does the compressor cycle? If the night shift's demand fell to 2.0 m³/min, would the cycle rate rise or fall?

**Answer.** At 3.0 m³/min, unload and load each take 3 × 60 ÷ (101.325 × 3.0) min, about 35.5 s, a cycle of about 71.1 s: about **51 cycles an hour**, the highest rate for this receiver, because demand is exactly half the compressor's output. At 2.0 m³/min, unload takes about 53.3 s and load about 26.6 s, a cycle of about 79.9 s: about **45 cycles an hour**. The cycle rate falls on either side of half load, which is why the half-load condition, not the average, is the one to check against the maker's limit. If the night-shift rate were too high, the cheapest remedies would be a second receiver, a wider band only at night, or a smaller compressor for the light-load hours, in roughly that order of cost.

