---
book: centrifugal-pumps-by-the-numbers
chapterSlug: throttling-bypass-and-trimming
order: 7
title: "Throttling, bypass and impeller trimming"
description: "Four ways to hold TP-3 to 12 L/s for a treatment unit: a throttled valve, a bypass, a trimmed impeller and a slower speed, each priced in A$ a year, and an impeller trimmed by the wrong ratio."
draft: false
---

Pumps are often bigger than their systems need. Margins are added at each stage of design, a standard size is chosen above the duty, and a system is built with less friction than was allowed for. The pump then delivers more than required, and something must be done to bring its flow down. There are four common ways to do it, and they differ in what they cost to install and, over a pump's life, much more in what they cost to run.

This chapter takes a new requirement for TP-3, a limit of exactly 12 L/s, and meets it four ways: by throttling a valve, by bypassing part of the flow, by trimming the impeller, and by slowing the pump. It works out each one's energy per cubic metre and annual cost, and ends with an impeller trimmed by the wrong ratio.

## The new limit

This is an illustration. The plant is considering adding an ultraviolet treatment unit to TP-3's discharge line to disinfect the washwater before it reaches the header tank. The unit's maker rates it for a maximum flow of 12 L/s; above that, the water passes too quickly to receive its full dose. TP-3, with the sump low, runs at 13.17 L/s, so its flow must come down by about 9%. With the sump high, at 13.86 L/s, it must come down further. The unit's own pressure loss is small enough to be ignored in this chapter's comparison.

At 12 L/s, TP-3's system needs **23.01 m** with the sump low. Each method must make the pump deliver 12 L/s into a system that needs that head.

## Throttling

The simplest method is to partly close a valve on the discharge until the flow falls to 12 L/s. The valve adds resistance, the system curve steepens, and the operating point slides up the pump's curve to 12 L/s, where the pump produces **25.36 m**. The system needs 23.01 m, so the valve takes the difference, **2.35 m**, and turns it into heat.

The pump's efficiency at 12 L/s is 73.6%, still close to its best, so its shaft power is 4.05 kW, and its shaft energy per cubic metre rises from 0.0867 kWh at its unthrottled point to **0.0937 kWh**, 8% more. The valve's 2.35 m is energy bought and thrown away on every cubic metre the pump delivers.

Throttling is cheap to install, easy to adjust, and keeps the pump within its preferred range, close to its best point. Its cost is in energy, every hour the pump runs.

## Bypass

A bypass returns part of the pump's flow from its discharge back to the sump, so that the pump delivers more than 12 L/s but only 12 L/s reaches the header tank. With the bypass's valve set so that the main line gets exactly 12 L/s at its 23.01 m, the pump produces that same 23.01 m, and so runs at the flow its curve gives at 23.01 m: **13.53 L/s**. The bypass carries the other 1.53 L/s round in a circle.

The pump's shaft power at 13.53 L/s and 23.01 m is 4.13 kW, and the energy per cubic metre actually delivered is **0.0955 kWh**, 10% more than unthrottled, and more than throttling. A bypass wastes the head and the flow it recirculates. It has a proper use, keeping a pump above its minimum flow when the system's demand falls to nothing, which Chapter 9 explains; as a way of reducing a steady flow, it is the most wasteful option.

## Trimming the impeller

A pump's impeller can be machined to a smaller diameter, which lowers its tip speed and so its whole curve. For small trims, the curve moves approximately as the affinity laws for speed describe, with the diameter ratio in place of the speed ratio: flow in proportion to diameter, head with its square.

To make TP-3's curve pass through 12 L/s at 23.01 m, the trimmed curve, H = 34 × d² − 0.060 × Q² for a diameter ratio d, must give 23.01 m at 12 L/s:

34 × d² = 23.01 + 0.060 × 144 = 31.65, so d = √(31.65 ÷ 34) = **0.9648**,

and the impeller is turned down from 160 mm to **154.4 mm**. The pump then delivers exactly 12 L/s into the unchanged system, with no valve throttled and nothing bypassed.

Taking the efficiency at the corresponding point as unchanged, 73.9%, the shaft power is 3.66 kW and the energy per cubic metre **0.0847 kWh**, slightly below the original unthrottled pump's, because the pump now delivers no more head than the system needs. In practice, trimming usually costs a little efficiency, and the maker's curve for the trimmed diameter gives the real figure; the comparison here is close to the best a trim can do.

Trimming is permanent and cannot be adjusted later, except by fitting a new impeller. It must be done by the maker's rules, because large trims can reduce efficiency noticeably and change the pump's NPSH behaviour.

## Slowing the pump

A variable-speed drive running TP-3 at 96.5% of full speed gives exactly the same curve as the trimmed impeller, by the affinity laws, and the same operating point. Its energy per cubic metre is the trimmed impeller's divided by the drive's efficiency, taken as 97%: **0.0873 kWh**. The drive costs more than a trim and loses a little in its electronics, but it can be adjusted, and it can raise the flow again if the treatment unit is ever upgraded.

## The four compared

```figure
type: compare
title: Four ways to hold TP-3 at 12 L/s, sump low
rowhead: Method
cols: Pump flow, L/s | Pump head, m | Shaft energy, kWh per m³ delivered | Annual cost, A$
caption: This is an illustration. Annual cost for 300 m³ a day with the motor at 88% and electricity at A$0.30 per kWh including GST. The unrestricted pump, at 13.17 L/s, is shown for reference.
- Unrestricted, 13.17 L/s | 13.17 | 23.60 | 0.0867 | 3,237
- Throttled valve | 12.00 | 25.36 | 0.0937 | 3,499
- Bypass to the sump | 13.53 | 23.01 | 0.0955 | 3,565
- * Impeller trimmed to 154.4 mm | 12.00 | 23.01 | 0.0847 | 3,162
- Drive at 96.5% speed | 12.00 | 23.01 | 0.0873 | 3,260
```

The trimmed impeller costs about A$337 a year less to run than the throttled valve, and about A$403 less than the bypass. Over a pump's life of perhaps 15 years, the throttle's extra energy would cost more than A$5,000, many times the cost of trimming the impeller. The drive costs a little more to run than the trim, but its flexibility may be worth that.

For TP-3, the plant's study recommended the trim, because the treatment unit's limit would be permanent. One more decision remained: which sump level to trim for.

## Trimming for a range of levels

A fixed trim gives one curve, and the sump's level moves the operating point along it. Trimmed to 154.4 mm for 12.0 L/s with the sump low, TP-3 would deliver 12.76 L/s with the sump high, over the treatment unit's limit. Trimmed for 12.0 L/s with the sump high, the system needs 21.51 m at 12 L/s, the diameter ratio is √((21.51 + 8.64) ÷ 34) = 0.9417, and the impeller is turned to **150.7 mm**; with the sump low, it then delivers 11.21 L/s.

```figure
type: compare
title: TP-3's flow over the sump's range by impeller diameter
rowhead: Impeller diameter
cols: Flow, sump low, L/s | Flow, sump high, L/s | Meets the 12 L/s limit at both levels?
caption: This is an illustration. A fixed trim gives a band of flows, not one flow; the band must sit under the treatment unit's limit at its top.
- 160 mm, original | 13.17 | 13.85 | no
- 154.4 mm, trimmed for the low sump | 12.01 | 12.76 | no, over at the high sump
- * 150.7 mm, trimmed for the high sump | 11.21 | 12.01 | yes
```

The study recommended 150.7 mm. At the low sump, TP-3 would then deliver 11.21 L/s, below the plant's former 12 L/s minimum, which the plant would accept after checking that the header tank still refills overnight. The annual-cost comparison above uses the low sump and the 154.4 mm trim to keep the four methods on an equal footing; the decision used both levels. A drive, which could hold exactly 12 L/s at every level, would avoid the compromise, at the drive's cost. The treatment unit was deferred to the next year's budget with the study attached, and until it is installed TP-3 keeps its 160 mm impeller, which the later chapters use. The study means the decision, when it comes, will take minutes rather than weeks.

## Checking a trim before cutting

A trim cannot be undone, so the plant's procedure checks it on paper before any metal is removed.

1. **State the duty** the trimmed pump must meet, at every system condition: here, no more than 12 L/s at the high sump, and enough at the low sump to refill the header tank.
2. **Calculate the diameter ratio** with the square root, from the head the system needs at the duty flow, plus the curve's fall at that flow.
3. **Draw the trimmed curve** and find its operating points on the system curves for every condition.
4. **Ask the maker** to confirm the trimmed diameter is within the impeller's allowed range, and for the trimmed curve's efficiency, power and NPSH required.
5. **Keep the old impeller**, or buy the new one, so that the trim can be reversed by replacement if the duty changes.
6. **Test after reassembly** at a known sump level, and compare the measured point with the trimmed curve.

The procedure takes an hour and a phone call. Its fourth step is the one most often skipped, and the maker's answer sometimes changes the decision: a trim near the bottom of an impeller's range can cost several points of efficiency, which may tip the comparison towards a drive.

## Oversized pumps in general

TP-3's case is a mild one: its pump was well matched until a new limit arrived. Many pumps are oversized from the day they are installed, often by a wide margin, because margins are added for uncertainty at every stage and never removed. An oversized pump on a throttled valve looks healthy, runs quietly enough and delivers its flow, and its waste shows only on the electricity bill and in a valve that is always half shut.

The signs are easy to read: a discharge valve never fully open, a pump that runs well left of its best efficiency point, or a bypass that is always flowing. Each is an invitation to measure the operating point, compare it with the system's real need, and consider a trim or a smaller impeller. Such changes are among the best-paying energy measures in a plant, because they cost little and save every hour the pump runs.

## Control valves that must throttle

Some valves throttle by design. A control valve holding a temperature or a level must have some pressure drop to control with; a valve that is wide open has no control left. The design question is not whether to throttle but how much: enough head across the valve to control well, and no more. On a pumped system, the valve's design pressure drop is part of the system curve, and it is the one part that the designer chooses rather than calculates. Choosing it generously adds energy every hour; choosing it too small makes the control sluggish or unstable. The valve maker's sizing method gives the balance.

## The error: an impeller trimmed by the wrong ratio

This is an illustration. Two years earlier, when the plant had ordered a trim for TP-4, a sister pump with the same model and curve on a similar system, the work order calculated the diameter ratio as the ratio of the heads, 23.01 ÷ 25.36 = 0.907, and the impeller was turned down to **145.2 mm**. But head varies with the square of the diameter, so the ratio of heads gives the square of the diameter ratio, not the ratio itself.

With the over-trimmed impeller, the pump's curve became H = 34 × 0.907² − 0.060 × Q², with a shut-off head of only 28.0 m. On its system, which needed the same head as TP-3's, it delivered about **9.95 L/s**, 17% short of the 12 L/s the plant needed, and the header tank could not keep up with wash-down. A trimmed impeller cannot be made larger again; the plant bought a new impeller and trimmed it correctly.

It was found at the first test after reassembly, when the flow meter read just under 10 L/s. The work order template now shows the formula, with the square root, and requires the trimmed curve to be checked against the system curve before the machinist starts.

```figure
type: bars
title: TP-3's flow with three impeller diameters
unit: L/s
max: 15
caption: This is an illustration with the sump low. Trimming by the head ratio instead of its square root took the impeller to 145.2 mm and the flow below the requirement.
- Original, 160 mm | 13.17
- * Correct trim, 154.4 mm | 12.00
- Over-trimmed, 145.2 mm | 9.95
```

## Exercise: the throttling valve's waste

With TP-3 throttled to 12 L/s, the valve takes 2.35 m. Find the hydraulic power the valve dissipates, and its share of the pump's hydraulic power at that point.

**Worked answer.**

- The valve's dissipated power is ρ × g × Q × h = 998.21 × 9.807 × 0.012 × 2.35 = **276 W**.
- The pump's hydraulic power at 12 L/s and 25.36 m is 998.21 × 9.807 × 0.012 × 25.36 = 2.98 kW.
- The valve's share is 0.276 ÷ 2.98 = **9.3%**.

Nearly a tenth of the pump's useful output is turned to heat in the valve. Behind it are the pump's and motor's losses on that tenth as well, so the electricity spent on the throttle is about 276 ÷ (0.736 × 0.88) = 426 W, every hour the pump runs.
