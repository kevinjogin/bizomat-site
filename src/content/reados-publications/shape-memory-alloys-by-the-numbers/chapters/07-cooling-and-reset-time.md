---
book: shape-memory-alloys-by-the-numbers
chapterSlug: cooling-and-reset-time
order: 7
title: "Cooling and reset time"
description: "Estimate how long a wire takes to cool below its loaded martensite finish, see how a hot cabinet stretches it, compare faster options, and catch a self-test that raised false alarms."
draft: false
---

Heating a shape memory wire takes a second; cooling it takes several. Heating is driven by the current, which can be made as large as the wire tolerates. Cooling is driven only by the temperature difference between the wire and its surroundings, which shrinks as the wire cools and shrinks further when the surroundings are hot. For most wire actuators, cooling, not heating, sets how often they can operate, and in a hot environment it can set whether they reset at all.

This chapter takes the wire maker's published cooling times, estimates how they stretch as the cabinet warms, compares ways of cooling faster, and records a self-test routine that assumed the bench's cooling time and flagged healthy latches as faulty every hot afternoon.

## What the maker's table says

The actuator wire maker's table, listed in the references, gives approximate cooling times for each diameter and for two wire grades, the 70 °C and 90 °C grades. For 0.25 mm wire they are about 5.4 s and 4.5 s; for 0.15 mm wire about 2.0 s and 1.7 s. The maker notes that the times depend on room temperature, air currents and heat sinking, and that they exclude the last 0.5% of the wire's re-stretching.

Two patterns stand out. Thinner wires cool much faster, because a thin wire has more surface for its volume. And the higher-temperature grade cools faster than the lower one at the same diameter, because it only needs to fall to a higher temperature, its own Mf, from its heated state, and the temperature difference to the room is larger all the way down.

```figure
type: compare
title: Published cooling times for actuator wire
cols: 70 °C grade | 90 °C grade
caption: From the actuator wire maker's table listed in the references. Times are approximate, at room conditions in still air, and exclude the last 0.5% of re-stretching. Hot surroundings lengthen them, as this chapter estimates.
- 0.15 mm | 2.0 s | 1.7 s
- 0.20 mm | 3.2 s | 2.7 s
- *0.25 mm | 5.4 s | 4.5 s
- 0.31 mm | 8.1 s | 6.8 s
- 0.38 mm | 10.5 s | 8.8 s
```

### Why thin wires cool so much faster

A wire's heat is stored in its volume and lost through its surface. For a round wire, surface area per unit volume is 4 / d, so a 0.15 mm wire has 26.7 mm² of surface per cubic millimetre and a 0.25 mm wire has 16.0, a ratio of 1.67. The maker's cooling times differ by more than that, 4.5 s against 1.7 s for the 90 °C grade, a ratio of 2.6, because heat also leaves a thin wire more readily per unit of surface: in still air, the convection coefficient from a fine wire rises as its diameter falls. Both effects favour thin wires, which is why the cooling time climbs so steeply with diameter in the table, from under two seconds at 0.15 mm to nearly nine at 0.38 mm.

## How a hot cabinet stretches the time

A thin wire in still air cools roughly as Newton's law of cooling describes: its temperature falls towards that of its surroundings at a rate proportional to the difference, so the difference shrinks exponentially. The time to fall from the heated temperature to a target temperature is then proportional to the natural logarithm of the ratio of the starting difference to the final difference. [Heat Transfer by the Numbers](/reados/publications/heat-transfer-by-the-numbers/heating-up-and-cooling-down/) sets out the same idea for larger objects.

This is an illustration. VL-25's wire is heated to about 120 °C and must cool below its loaded Mf of about 72.6 °C under the bias spring, from Chapter 3. In a 20 °C room, the ratio of differences is (120 − 20) / (72.6 − 20) = 1.90. In a 60 °C cabinet it is (120 − 60) / (72.6 − 60) = 4.76. The logarithms are 0.64 and 1.56, so the hot cabinet's cooling time is about 2.4 times the room's. Scaling the maker's 4.5 s:

```figure
type: bars
title: Estimated reset time of VL-25's 0.25 mm wire by cabinet temperature
unit: s
max: 12
caption: This is an illustration using Newton cooling from about 120 °C to the loaded Mf of 72.6 °C, scaled from the maker's 4.5 s at room temperature. The estimate ignores the latent heat released as the wire transforms, which slows cooling further; tests on assembled latches govern.
- Cabinet at 0 °C | 3.5
- Cabinet at 20 °C | 4.5
- Cabinet at 40 °C | 6.3
- Cabinet at 50 °C | 7.9
- *Cabinet at 60 °C | 10.9
```

The time grows slowly at first and then sharply as the cabinet approaches the wire's loaded Mf, because the final temperature difference, the denominator of the ratio, is heading towards zero. At 60 °C, with only 12.6 °C between the cabinet and the reset temperature, the estimate is about 11 s. A cabinet a few degrees hotter would make it much longer, and at 72.6 °C the wire could not reset at all. That is the same margin Chapter 2 used to choose the grade, seen now as a time.

The estimate is rough. On cooling, the transformation back to martensite releases latent heat, which warms the wire as it passes through Ms to Mf and slows the final part of the cooling. Air currents in the cabinet speed it up. The team measured reset times in a climate chamber at 60 °C and found about 12 s, a little longer than the estimate.

```figure
type: stats
title: Measured reset times of assembled VL-25 latches in a climate chamber
caption: This is an illustration. Time from the end of the heating pulse to the latch microswitch confirming the pin's return, median of ten operations on each of five latches, still air in the chamber.
- 4.6 s | At 20 °C | estimate 4.5 s
- 6.6 s | At 40 °C | estimate 6.3 s
- *12.0 s | At 60 °C | estimate 10.9 s
```

The measurements track the estimate at moderate temperatures and run about 10% longer at 60 °C, where the latent heat released near the end of the cooling matters most because the wire is cooling slowly there anyway. For design, the measured values are the ones to use; the estimate's value is in showing why the time grows so sharply and what changes would help.

## Cycle rate

An actuator that must operate repeatedly can do so no faster than its heating and cooling allow. VL-25 at 20 °C needs about 1 s to heat and about 4.6 s to reset, so it could cycle about once every six seconds. In a 60 °C cabinet, with 0.7 s of heating and 12 s of reset, once every thirteen seconds. For the latch, which operates weekly, the rate is irrelevant; for a mechanism that pumps, sorts or positions repeatedly, it is usually the deciding limit, and it is the main reason such mechanisms use thin wires in parallel or forced air.

Repeated cycling has a second effect. If the wire is reheated before it has cooled fully, each cycle starts warmer than the last, and the wire's average temperature creeps up. Its reset slows, its stroke shrinks as it fails to re-stretch fully, and, if the heating pulse is not shortened to match, it may overheat. Any design that cycles quickly needs either a measurement of the wire's state, such as its resistance, or a cycle time long enough to reset fully in the hottest condition, with the heating pulse chosen for a warm start.

### Cold surroundings

In a cold cabinet the situation reverses. At 0 °C, the reset estimate falls to about 3.5 s, but the heating pulse lengthens, as Chapter 6 found, because the wire starts further below its transformation temperatures and loses heat faster while it heats. Cold also lowers the wire's surroundings well below its Mf, so it resets fully and reliably; cold is rarely a problem for an actuator wire's reset, only for its heating energy.

## Cooling faster

Several options shorten the reset, each with a cost:

- **Thinner wires in parallel.** Three 0.15 mm wires, from Chapter 4, cool in about 1.7 s at room temperature and, scaled the same way, about 4.1 s at 60 °C, at the cost of more terminations and careful load sharing.
- **A lower heating peak.** A shorter pulse in a hot cabinet, as VL-25's firmware already uses, starts the cooling from a lower temperature. Starting from 115 °C instead of 120 °C shortens the estimate at 60 °C only from 10.9 to about 10.3 s, because most of the time is spent near the end of the cooling.
- **Moving air.** A small fan or the cabinet's own ventilation increases heat transfer from the wire several-fold, but adds a part to fail and power to use.
- **Heat sinking.** Running the wire close to, but not touching, a metal surface, or through a close-fitting tube filled with a heat-conducting grease, speeds cooling but must not add friction or electrical leakage.
- **A cooler place.** Mounting the actuator away from the hottest part of the cabinet, as Chapter 2's temperature survey showed, lowers its surroundings directly.

The reverse also holds: anything that wraps the wire slows its cooling. VL-25's PTFE guide, where the wire passes the latch body, insulates about 10 mm of the wire's length, and that length cools a little more slowly than the rest. The team kept the guide as short as the isolation needs and confirmed in the chamber tests that the guided section did not delay the latch's reset measurably. A wire run inside a long plastic sleeve for tidiness, as some prototypes are, can take considerably longer to reset than the maker's still-air figure suggests, and its reset time should be measured rather than assumed. The same applies to a wire enclosed in a small sealed housing, where the trapped air warms with each operation and the wire's surroundings become hotter than the cabinet around them.

## The error: a self-test that expected bench timing

This is an illustration. VL-25's controller exercises the latch once a week to show that it works. The routine fires the wire, waits, and checks a microswitch that confirms the pin has returned to its latched position, ready for the flap to be closed. The firmware engineer set the wait to 10 s, more than twice the 4.5 s measured on the bench.

Within a month of the first summer on site, the maintenance system had logged several dozen "latch fault" alarms, all from cabinets in afternoon sun, all cleared at the next week's test if that test happened to fall in the morning. Technicians sent to investigate found nothing wrong.

The estimate above explains it. At 60 °C, the wire takes about 11 to 12 s to cool below its loaded Mf, so at the 10 s check the pin had not quite returned, and the microswitch reported a fault. The latches were healthy; the test's timing was based on a room-temperature bench. The firmware was changed in two ways: the weekly test now runs at 3 am, when the cabinets are coolest, and the wait before the check is set from the controller's own cabinet temperature reading, at 30 s whenever the cabinet is above 45 °C. The false alarms stopped.

The lesson was recorded in the design guide: every time constant measured on a bench is a time constant at the bench's temperature, and a shape memory actuator's reset time is among the most temperature-sensitive numbers in a product. Any logic that waits for a reset must use a time chosen for the hottest condition, or measure the reset rather than assume it.

## Cooling and the requirement

The episode also exposed a requirement that had been written without its temperature. VL-25's checklist in Chapter 1 asked for a reset within 10 s, which the design meets up to a cabinet temperature of about 57 °C and not above. The team rewrote the requirement to say what it was for: the latch must be ready to re-engage before anyone could close the flap after a remote opening, which in practice is minutes, not seconds, because a technician must travel to the cabinet. The revised requirement, ready within 60 s at the hottest cabinet temperature, is met with a wide margin, and the design did not need to change. Writing a requirement with its conditions attached is cheaper than designing to one that has none. Had the 10 s figure been treated as fixed, the team would have been pushed towards parallel thin wires or a fan to meet a number that served no purpose.

## Exercise: a cooler-running variant

A variant of VL-25 for indoor cabinets that never exceed 35 °C uses the same 0.25 mm wire of the 90 °C grade.

1. Estimate the reset time at 35 °C, scaling from the maker's 4.5 s at 20 °C.
2. Would the 70 °C grade, with a loaded Mf of about 52.6 °C and the maker's 5.4 s, be acceptable indoors?

**Worked answer.**

1. The ratio of differences at 35 °C is (120 − 35) / (72.6 − 35) = 2.26, with a logarithm of 0.816, against 0.642 at 20 °C. The time scales by 0.816 / 0.642 = 1.27, to about **5.7 s**.
2. For the 70 °C grade, heated to about 100 °C, the ratio at 35 °C is (100 − 35) / (52.6 − 35) = 3.69, with a logarithm of 1.31; at 20 °C it is (100 − 20) / (52.6 − 20) = 2.45, with a logarithm of 0.90. The time scales by 1.31 / 0.90 = 1.46, to about **7.9 s**. It would reset, more slowly than the 90 °C grade, and with a reset margin of only about 18 °C above the cabinet. The 70 °C grade's lower operating temperature would save a little energy, but Chapter 2's self-triggering check would also need repeating for any indoor cabinet that could be heated by equipment inside it. The 90 °C grade is the more robust choice for both variants, and using one grade simplifies stock.
