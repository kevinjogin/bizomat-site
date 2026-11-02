---
book: induction-hardening-by-the-numbers
chapterSlug: tempering-after-hardening
order: 7
title: "Tempering after hardening"
description: "Why freshly hardened cases are tempered, how time and temperature trade off, planning the tempering oven's load, energy and throughput, and a weekend batch left untempered that cracked."
draft: false
---

Fresh martensite is hard, but it is also brittle and highly stressed. Left as quenched, an induction-hardened case can crack under a modest impact, and in some steels and shapes it can crack by itself, hours after the quench, as stresses redistribute. Tempering, a gentle reheat to a low temperature, relieves part of those stresses and makes the martensite tougher at the cost of a little hardness. For the IH-40, tempering is a short, cheap step, but it must be done, done promptly and done in an oven big enough to keep up with the induction machine.

This chapter explains what tempering does, how time and temperature can be traded against each other, plans the tempering oven's load and throughput with a KEVOS® tool, and works through a batch of shafts left untempered over a weekend.

## What tempering does

Martensite holds its carbon trapped in a strained crystal structure. Reheating it to a moderate temperature lets some of that carbon move a short distance and form extremely fine carbide particles, relieving part of the strain. The result is a structure called tempered martensite: slightly softer, considerably tougher, and with lower internal stresses. The higher the tempering temperature, and the longer the time, the further the process goes and the softer and tougher the steel becomes.

For induction-hardened wear surfaces, where hardness matters most, tempering is usually done at a low temperature, roughly 150 to 200 °C, which keeps most of the hardness while removing the worst of the brittleness and the risk of delayed cracking. This is an illustration. The IH-40's recipe is 2 hours at 180 °C, chosen from trials in which as-quenched journals of about 690 HV1 tempered to about 650 HV1, comfortably inside the 600 to 720 specification, with a clear improvement in resistance to chipping in a simple impact test.

```figure
type: compare
title: The IH-40 case before and after tempering
cols: Surface hardness | Toughness | Residual stress | Risk of delayed cracking
rowhead: Condition
- As quenched | about 690 HV1 | low | high, uneven | present, especially at sharp features
- * Tempered 2 h at 180 °C | about 650 HV1 | improved | lower, still compressive at the surface | much reduced
- Tempered at a much higher temperature | well below 600 HV1 | high | low | negligible, but the case is too soft for the journal
caption: This is an illustration. Hardness values are the case manufacturer's trial results for this steel and recipe; the trend, hardness traded for toughness as tempering temperature rises, is general.
```

### What tempering keeps

Low-temperature tempering relieves the peaks of stress in the case without throwing away the most useful stress of all. An induction-hardened surface is left in compression, because the martensite that formed in the case occupies more volume than the steel beneath it (Chapters 5 and 9). That compressive layer is a large part of why induction-hardened shafts resist fatigue so well: a fatigue crack must first overcome it before it can grow. Tempering at 150 to 200 °C reduces the compressive stress only modestly, and it removes the local tensile peaks near the ends of the case and around features, which are where delayed cracks start. Tempering at much higher temperatures would relax much more of the useful compression along with the hardness.

### Time from quench to temper

Delayed cracking, when it happens, happens in the hours after the quench, as the fresh martensite's stresses redistribute and, in some steels, as hydrogen trapped in the steel moves to the most highly stressed regions. Tempering soon after quenching removes the risk before it can act. The manufacturer's rule, tempering within two hours, is its own, set from its experience with this steel and shape; specifications for critical parts often set such a limit explicitly, and a part that misses it is treated as nonconforming until it has been inspected.

## Trading time against temperature

Tempering depends on both time and temperature, and within limits more time at a lower temperature does the same as less time at a higher one. A widely used way of expressing the trade is the tempering parameter proposed by Hollomon and Jaffe in 1945: P = T × (C + log₁₀ t), where T is the absolute temperature, t the time in hours, and C a constant for the steel, often taken as about 20 for carbon and low-alloy steels. Two treatments with the same parameter give roughly the same tempered hardness.

```figure
type: compare
title: Times equivalent to 2 h at 180 °C by the Hollomon–Jaffe parameter, C = 20
cols: Equivalent time | Practical comment
rowhead: Tempering temperature
- 170 °C | about 5.7 h | a long cycle for a small hardness gain
- * 180 °C | 2 h | the IH-40 recipe
- 190 °C | about 0.7 h | shorter, but sensitive to oven uniformity
- 200 °C | about 0.3 h | too short to control reliably in a batch oven
caption: This is an illustration. P = (180 + 273) × (20 + log₁₀ 2) = 9,199. The parameter is an approximation, useful for comparing recipes; a changed recipe is still proved by hardness tests on tempered parts.
```

The table shows why batch ovens use modest temperatures and times of an hour or more. At 200 °C the equivalent time is only about 17 minutes, so a few minutes' difference in how long each basket really spends at temperature, or a few degrees' difference between the oven's hot and cool corners, changes the result noticeably. At 180 °C for 2 hours, the same variations matter little.

### Induction tempering

Tempering can also be done by induction, reheating the hardened zone with a low-power heat immediately after the quench, either in the same coil or at a second station. Because the time is seconds, not hours, induction tempering needs a higher temperature for the same effect, and the parameter shows why: a temper equivalent to 2 hours at 180 °C in a few seconds needs a temperature well above 300 °C. Induction tempering saves floor space and work in progress, and tempers each part immediately, but it needs careful proving because small errors in time or temperature have large effects. The manufacturer uses a batch oven for the IH-40.

### Checking the tempered case

Tempering is checked the same way the hardening is: by hardness on the finished part and, on a sample, by the hardness traverse through a sectioned journal (Chapter 8). The surface check on a tempered IH-40 journal should show a small, consistent drop from the as-quenched hardness. A larger drop points to a temper that ran too hot or too long; no drop at all points to a basket that never reached temperature or was missed altogether. Both show in the batch's hardness record, which is why the manufacturer records the as-quenched surface hardness of the first part of each batch alongside the tempered values.

### Finding cracks

Cracks in a hardened case are usually too fine to see. Magnetic particle testing finds them: the shaft is magnetised, and fine iron particles, in a fluorescent liquid, are flowed over its surface; where a crack interrupts the magnetic field, field leaks out of the surface and gathers the particles into a visible line under ultraviolet light. The test is fast, sensitive to surface cracks in steel, and leaves the shaft magnetised, so it is demagnetised afterwards. The manufacturer tests a sample of each batch, and every shaft from any batch that has been out of its normal process.

## Planning the tempering oven

The KEVOS® [Heat-treatment furnace load plan](/tools/furnace-heat-treat-plan/) tool estimates a furnace or oven cycle. From the work mass and the basket's mass, a mean specific heat, the start and set temperatures, the input power, the share of it reaching the load while heating, the standing heat loss at temperature, the soak time and the energy price, it gives the heat into the load, the heat-up time, the cycle time, the energy and cost per load and per kilogram of work, and the basket's share of the heat. Its guide notes that the real heat-up slows as the load approaches set temperature, and that soak times come from the specification for the section size.

This is an illustration. The IH-40's tempering oven is a 30 kW electric air-circulation oven. A basket holds 100 shafts, 395 kg, and weighs 80 kg itself. Over the range from 20 to 180 °C the manufacturer uses a mean specific heat of 0.48 kJ/(kg·K) for steel, a heating efficiency of 60% and a standing loss of 2 kW.

```figure
type: compare
title: The tempering oven in the furnace load plan tool
cols: Heat into the load, kWh | Heat-up time, h | Cycle with 2 h soak, h | Energy, kWh | Cost per load | Shafts per hour of oven time
rowhead: Load
- * One basket, 100 shafts | 10.1 | 0.56 | 2.56 | 20.9 | A$6.27 | 39
- Three baskets, 300 shafts | 30.4 | 1.69 | 3.69 | 54.7 | A$16.40 | 81
caption: This is an illustration. Energy at A$0.30 per kWh including GST. Tempering costs about A$0.06 per shaft in energy; the oven's throughput, not its energy, is the constraint.
```

Energy is not the issue: about 6 cents a shaft. Across a year at 120 shafts an hour, two eight-hour shifts and 250 days, that adds up to about A$30,000 for nearly half a million shafts, still only a few cents in the cost of each one. Throughput is. The induction machine hardens 120 shafts an hour. One basket at a time, the oven tempers about 39 shafts an hour; even loaded with three baskets, about 81. Either way, the oven cannot keep up, and untempered shafts pile up waiting for it. The mismatch is easy to miss when a line is planned around its most expensive machine. The induction machine, its coil and its generator received weeks of attention; the tempering oven was a catalogue item bought to fit a space on the floor. Yet a line runs at the rate of its slowest step, and the slowest step here was the cheapest piece of equipment in it. The manufacturer's answer was a second oven, so that two ovens of three baskets each temper about 160 shafts an hour, more than the induction machine produces, with time to spare for loading.

The heat-up time from the tool is an energy estimate. The soak's 2 hours count from when the shafts reach 180 °C, not the oven's air, and the manufacturer proved the cycle with a thermocouple in a shaft at the middle of a full load, which reached 175 °C about 50 minutes after loading, longer than the tool's 34 minutes because heating slows as the load approaches the oven's temperature.

### Uniformity inside the oven

An oven's set temperature is not the temperature of every shaft in it. Air-circulation ovens have warmer and cooler regions, and a densely packed basket shields its middle from the moving air. This is an illustration. By the Hollomon–Jaffe parameter, 2 hours at 185 °C is equivalent to about 3.3 hours at 180 °C, and 2 hours at 175 °C to about 1.2 hours; so a spread of ±5 K across the oven acts like a spread of tempering times from 1.2 to 3.3 hours at 180 °C. That is enough to widen the hardness spread of a batch noticeably.

The manufacturer's oven is surveyed with thermocouples in shafts at the corners and centre of a full load, and its baskets are packed with a gap between shafts so the air can reach them. The survey also fixes the soak start: the timer starts when the slowest shaft reaches 175 °C, not when the oven's own controller reaches 180 °C.

## The error: a weekend batch

This is an illustration. Before the second oven arrived, a backlog built up on Fridays. One Friday afternoon about 200 hardened shafts were left in their bins to be tempered on Monday morning, because the oven was full and the shift was ending.

On Monday the tempered shafts went through the routine magnetic particle crack check that the manufacturer applies to a sample from each batch. Three shafts from the weekend batch showed fine cracks at the edge of the journal's case, near the end where the case meets the softer steel; none of the shafts tempered on the day they were hardened did. The cracks had formed during the weekend, in the as-quenched case, as its stresses redistributed: delayed cracking, the risk tempering exists to remove.

Three cracked shafts out of about 200 may sound few, but a crack at the end of a journal case sits where the shaft carries its highest bending stress in service, and a cracked shaft that reached a customer could fail in the field, with a tractor or harvester, rather than on a test bench. The whole weekend batch was inspected by magnetic particle testing, the cracked shafts scrapped and the rest released. The manufacturer set a rule that hardened shafts must be in the tempering oven within two hours of quenching, made the oven's capacity a condition of running the induction machine at full rate, and brought forward the second oven.

```figure
type: checklist
title: Tempering rules for induction-hardened shafts
caption: The open item is the rule broken in the error above: the time from quench to temper, not just the tempering recipe.
- Tempering recipe 2 h at 180 °C, measured in the part | proved with a thermocouple in a loaded basket
- ? Shafts in the oven within 2 h of quenching | the induction machine slows if the ovens are full
- Oven uniformity surveyed periodically | every basket position within the set band
- Tempered hardness checked on each batch | 600 to 720 HV1
- Magnetic particle crack check on a sample of each batch | more if anything changes
```

## Exercise: a shorter temper

This is an illustration. To relieve the oven bottleneck, someone proposes tempering at 190 °C instead of 180 °C.

1. By the Hollomon–Jaffe parameter with C = 20, how long at 190 °C matches 2 h at 180 °C?
2. With the tool's one-basket heat-up of 0.56 h, what would the cycle be, and how many shafts an hour would one oven temper?
3. Is it a good idea?

**Worked answer.**

1. P = 9,199. log₁₀ t = 9,199 ÷ 463.15 − 20 = −0.137, so t = **0.73 h**, about 44 minutes.
2. About 0.56 + 0.73 = **1.29 h** (heating to 190 °C takes slightly longer than to 180 °C, so a little more in practice); one basket of 100 shafts in 1.29 h is about **78 shafts an hour**, double the 39 at 180 °C.
3. **Perhaps, but not as a quick fix.** The parameter predicts a similar hardness, but a 44-minute soak is far more sensitive to how long each part really spends at temperature and to the oven's uniformity, and the soak must be timed from when the parts, not the air, reach 190 °C. It would need proving with thermocouples and hardness tests on tempered parts, and a second oven is the more robust answer.
