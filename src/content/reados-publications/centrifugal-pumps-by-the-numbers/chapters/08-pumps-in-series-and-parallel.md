---
book: centrifugal-pumps-by-the-numbers
chapterSlug: pumps-in-series-and-parallel
order: 8
title: "Pumps in series and parallel"
description: "Combined curves in parallel and in series, TP-3's duty and standby pair together for 19.8 L/s, two pumps in series pushed past their range, and a worn standby pump that ran at shut-off."
draft: false
---

Two pumps can be connected so that their flows add, in parallel, or so that their heads add, in series. Either can be the right answer, and plants use both: duty and standby pairs that can run together at peak demand, booster sets of several pumps in parallel, multistage arrangements in series for high heads. But two pumps do not deliver twice what one does, except on a system that lets them, and the amount they do deliver depends on the system's curve as much as on the pumps.

This chapter builds the combined curves for pumps in parallel and in series, applies them to TP-3's duty and standby pair, shows how far the result falls short of double on a lift system, shows what series operation would do to TP-3, and ends with a worn standby pump that ran at shut-off beside a healthy one.

## TP-3's duty and standby pair

This is an illustration. TP-3 is in fact two identical pumps side by side, each with its own suction pipe and foot valve, discharging through check valves into a common discharge pipe. Normally one runs, the duty pump, and the other stands by, swapped each week so that both stay in use. The plant's control system can run both at once, and the question this chapter answers is what that achieves.

## Pumps in parallel

Two pumps in parallel share the same suction level and discharge into the same pipe, so they produce the same head, and the system's flow is the sum of theirs. Their combined curve is found by adding their flows at each head. For two identical pumps, each with the curve H = 34 − 0.060 × Q², each delivers half the total flow at any head, so the combined curve is

H = 34 − 0.060 × (Q ÷ 2)² = 34 − 0.015 × Q².

It has the same shut-off head, 34 m, and twice the flow at every head.

On TP-3's system with the sump low, H = 20.0 + 0.02075 × Q², the combined curve meets the system where 34 − 0.015 × Q² = 20.0 + 0.02075 × Q², which gives a total flow of **19.79 L/s** at **28.13 m**. Each pump delivers **9.89 L/s**, well left of its best point, at an efficiency of 69.8%.

```figure
type: compare
title: TP-3 with one pump and with two in parallel, sump low
rowhead: Arrangement
cols: Total flow, L/s | Head, m | Flow per pump, L/s | Pump efficiency | Shaft energy, kWh per m³
caption: This is an illustration. Two pumps deliver 50% more than one, not 100%, because the system's head rises as the flow does, pushing each pump back up its curve.
- * One pump | 13.17 | 23.60 | 13.17 | 74.0% | 0.0867
- Two pumps in parallel | 19.79 | 28.13 | 9.89 | 69.8% | 0.1096
```

The second pump adds 6.6 L/s, half of one pump's flow, not all of it. The system's head rises from 23.6 to 28.1 m as the flow rises, and each pump, delivering that higher head, runs further up its curve at a lower flow. And each pump is now less efficient, so the energy per cubic metre rises by 26%. Running both pumps fills the header tank faster, about half as fast again, but at a premium on every cubic metre.

On a system with more friction, whose curve rises more steeply, the second pump adds even less; on a system whose curve is nearly flat above its static head, it adds nearly a full pump's flow. The steepness of the system's curve, compared with the pumps', decides.

## When parallel operation makes sense

Two pumps in parallel are the right answer when the demand varies widely and the system's curve is fairly flat, so that one pump serves the low demand near its best point and two serve the high demand without being pushed too far left. A booster set of three or four pumps, switching in and out as demand changes, works that way. Parallel pumps also give redundancy: if one fails, the other still delivers a useful flow.

They are the wrong answer when the second pump would be pushed far left of its best point, into recirculation and vibration, or when the pumps are not matched, as the error below shows. For TP-3, the plant runs both pumps only when the header tank has been drawn down heavily during a cleaning shutdown and must be refilled quickly; the rest of the time, one pump at its best point is cheaper.

## Combined curves at a glance

The combined curves can be tabulated once and read for any system, by finding the flow each arrangement gives at the head the system needs.

```figure
type: compare
title: Flow from one, two in parallel and two in series, by head
rowhead: Head
cols: One pump, L/s | Two in parallel, L/s | Two in series, L/s
caption: This is an illustration from TP-3's pump curve. In parallel, flows double at each head; in series, heads double at each flow, so at modest heads two pumps in series run far out on their curves.
- 20 m | 15.28 | 30.55 | 20.00
- 24 m | 12.91 | 25.82 | 19.15
- * 28 m | 10.00 | 20.00 | 18.26
- 32 m | 5.77 | 11.55 | 17.32
```

Reading the table against TP-3's system curve, which needs about 24 m at 13 L/s and 28 m at 20 L/s, shows the parallel answer of about 19.8 L/s at 28.1 m directly. The series column shows why series is wrong for TP-3: at the heads its system needs, two pumps in series would want to deliver flows beyond either pump's published range.

## Pumps in series

In series, the first pump's discharge feeds the second pump's suction, so the same flow passes through both, and their heads add. The combined curve of two identical pumps is

H = 2 × (34 − 0.060 × Q²) = 68 − 0.120 × Q²,

with twice the shut-off head and the same flow at each corresponding head.

This is an illustration. Two of TP-3's pumps in series, on TP-3's system, would run where 68 − 0.120 × Q² = 20.0 + 0.02075 × Q², at **18.47 L/s** and 27.08 m, each pump producing 13.54 m. But 18.47 L/s is beyond the end of each pump's published curve at 18 L/s, far right of its best point, at an efficiency of 60.9% and an NPSH required of 5.59 m. On a system whose head is mostly static, two pumps in series have far more head than the system needs, and each runs out towards its run-out.

Series operation is the right answer for systems that need more head than one pump can produce, such as a tall building or a long pipeline, where each pump then runs near its best point. It is also how multistage pumps work, with several impellers on one shaft. It is not the right answer for TP-3, which needs flow, not head.

## Parallel pumps and NPSH

Running two pumps in parallel lowers each pump's flow, so each needs less NPSH: at 9.89 L/s, TP-3's NPSH required is 2.67 m, against 3.58 m when one pump runs alone. Each pump has its own suction pipe, so its suction losses fall too. Parallel operation is therefore easy on NPSH.

The danger is the reverse case. If one pump of a running pair trips, the other is suddenly alone on the system, its flow rises from 9.89 to 13.17 L/s, and its NPSH required rises with it. On TP-3 that is still well within the margin Chapter 5 found. On a system selected with a tight NPSH margin for parallel running, a single pump left running can cavitate, and the check is made for the single-pump case as well as the pair.

## Check valves and starting

Every pump in a parallel set needs a check valve on its discharge. Without one, a stopped pump would let water flow backwards through it from the running pump's discharge to the sump, wasting the running pump's flow and spinning the stopped pump backwards. With one, a stopped pump's check valve is held shut by the discharge pressure.

Starting a second pump into a running system means it must build up head above the system's present head before its check valve opens. A pump started into a high head runs briefly at shut-off, which is harmless for a few seconds, and then its check valve opens and it takes its share. A pump that cannot reach the system's head never takes a share at all, which is the subject of the error below.

## Controlling parallel pumps

A set of parallel pumps needs rules for when each runs. Common ones are:

- **Duty and standby**, as on TP-3: one runs, the other waits, and they swap on a schedule so that both wear evenly and the standby is known to work.
- **Staging on demand**: a booster set starts a second pump when the first approaches the right-hand end of its range, and stops it when the demand falls back, with a gap between the two thresholds so that pumps do not start and stop repeatedly.
- **Staging on pressure**: a pressure-holding set starts pumps as the discharge pressure falls below a set point, often with a variable-speed drive on the lead pump to smooth the steps.

Whatever the rule, the control system should confirm that each running pump is delivering, by a flow switch, a pressure difference across the pump or its motor's power, and stop any pump that is running without flow. The error below shows why.

## Matched pumps

Pumps in parallel should have similar curves, and in particular similar shut-off heads. If one pump's curve is lower, through a smaller impeller, a lower speed or wear, it delivers less than its partner at the common head, and if its shut-off head is below the system's head, it delivers nothing at all.

```figure
type: bars
title: The standby pump's flow when run with a healthy duty pump, by its shut-off head
unit: L/s
max: 12
caption: This is an illustration with the sump low. As the standby pump wears and its shut-off head falls, its share of the flow falls faster, and at 23 m it delivers nothing.
- Standby as new, 34 m | 9.89
- Shut-off 30 m | 7.25
- Shut-off 26 m | 3.69
- Shut-off 24 m | 0.87
- * Shut-off 23 m | 0
```

## Unequal pumps on purpose

Pumps of different sizes are sometimes paired deliberately: a small "jockey" pump that runs most of the time at a low demand, and a large pump that starts only when the demand is high. That works well when they run separately, each near its own best point. Run together in parallel, they need the same care as worn pumps: the small pump must be able to reach the head the large pump creates, or it will be shut off by its own check valve. The combined curve, built by adding each pump's flow at each head, shows at once whether it can. Where it cannot, the controls must stop the small pump when the large one starts.

## The error: a worn standby pump at shut-off

This is an illustration. The plant's weekly swap between TP-3's two pumps lapsed for most of a year, and one pump, which had been run as the duty pump throughout and had pumped gritty water from a sump that was not cleaned, wore heavily. Its wear rings opened and its impeller eroded until its shut-off head was about 23 m. Running alone, it still filled the header tank, slowly.

During a cleaning shutdown, the control system ran both pumps together. The healthy pump raised the system's head to 23.6 m. The worn pump could produce at most 23 m, so its check valve never opened: it ran at shut-off, with no flow, for nearly an hour, while the healthy pump did all the work. The worn pump's casing heated until its mechanical seal failed and sprayed hot water across the pump room. It was found when an operator heard the seal fail and isolated the pump.

The investigation found three faults: the lapsed swap, the lack of any check on each pump's performance, and a control system that started both pumps without confirming that both were delivering. The plant reinstated the weekly swap and the yearly curve check of Chapter 3, and added a flow switch on each pump's discharge, which stops a pump that runs for more than a minute without flow. The worn pump was rebuilt with new wear rings and an impeller, its curve was checked on test, and the sump's cleaning schedule was tightened, because the grit that wore it would have worn its replacement just as quickly.

## Exercise: three pumps in parallel

Suppose a third identical pump were added in parallel to TP-3's pair. Find the combined curve, and the total flow and head on TP-3's system with the sump low. How much does the third pump add?

**Worked answer.**

- With three pumps, each delivers a third of the total: H = 34 − 0.060 × (Q ÷ 3)² = 34 − 0.00667 × Q².
- At the system: 34 − 0.00667 × Q² = 20.0 + 0.02075 × Q², so 14 = 0.02742 × Q², Q = **22.60 L/s**.
- The head is 20.0 + 0.02075 × 22.60² = **30.60 m**, and each pump delivers 7.53 L/s.
- The third pump adds 22.60 − 19.79 = **2.81 L/s**, about a fifth of one pump's flow on its own.

Each added pump adds less, because each raises the system's head further and pushes all the pumps further up their curves. At 7.53 L/s, each pump is well left of its best point, in the region where recirculation begins. A third pump would not be a good way to raise TP-3's flow; a larger discharge pipe, which flattens the system curve, would do more.
