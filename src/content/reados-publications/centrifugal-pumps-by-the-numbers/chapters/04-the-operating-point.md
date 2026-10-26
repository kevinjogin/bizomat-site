---
book: centrifugal-pumps-by-the-numbers
chapterSlug: the-operating-point
order: 4
title: "The operating point"
description: "TP-3's lift-dominated system curve, where it meets the pump curve, how the point moves with sump level, ageing and a clogged foot valve, and a pump chosen on a curve with no lift."
draft: false
---

A pump does not choose its flow. It produces a head that falls as its flow rises, and the system it is connected to needs a head that rises as its flow rises. The pump runs at the one flow where the two agree: the **operating point**. Everything about a pump's performance in service, its flow, its power, its efficiency and its life, follows from where that point falls, and the point moves whenever either curve does.

This chapter builds TP-3's system curve, finds its operating point, follows how it moves with the sump's level, with the pipe's ageing and with a clogging foot valve, shows why a system dominated by lift behaves so differently from one dominated by friction, and ends with a pump selected against a system curve that left out the lift.

## TP-3's system curve

TP-3's system has a large static head and modest friction. With the sump at its low level, 2.0 m below the pump's centreline, the water must be lifted 2.0 m to the pump and 18.0 m from there to the free discharge above the header tank: a static head of **20.0 m** before any water moves. With the sump at its high level, 0.5 m below the pump, the static head is 18.5 m.

The dynamic head comes from the suction pipe, 6 m of 105.3 mm bore with its foot valve and strainer and an elbow, and the discharge pipe, 120 m of the same bore with six elbows, a check valve, a gate valve and the exit. READOS's [Pipe Flow by the Numbers](/reados/publications/pipe-flow-by-the-numbers/the-system-curve/) builds such curves step by step; for TP-3, at 12 L/s and a velocity of 1.378 m/s, the suction loses 0.425 m and the discharge 2.586 m, so the system needs 20.0 + 3.01 = **23.01 m** with the sump low.

```figure
type: compare
title: TP-3's system and pump at several flows
rowhead: Flow
cols: System, sump low, m | System, sump high, m | Pump, m
caption: This is an illustration. The system is new steel pipe and water at 20 °C; the pump curve is H = 34 − 0.060 × Q².
- 0 L/s | 20.00 | 18.50 | 34.00
- 4 L/s | 20.38 | 18.88 | 33.04
- 8 L/s | 21.39 | 19.89 | 30.16
- 12 L/s | 23.01 | 21.51 | 25.36
- * 14 L/s | 24.05 | 22.55 | 22.24
- 16 L/s | 25.23 | 23.73 | 18.64
```

The system curve starts high and rises slowly: from 20.0 m at zero flow to only 25.2 m at 16 L/s. Most of TP-3's head is lift, and only a small part is friction.

## Where the curves cross

Between 12 and 14 L/s, the pump's head falls below the system's. Solving for the exact crossing, with the sump low, gives the operating point at **13.17 L/s and 23.60 m**. The pump's efficiency there is 74.0%, essentially at its best efficiency point. The plant needs at least 12 L/s, so the pump delivers about 10% more than the minimum, which gives a margin for wear. That margin is deliberate, and the rest of the chapter shows how quickly ordinary wear and fouling use it up.

## How the point moves with the sump

As the sump fills, the static head falls, the whole system curve drops, and the operating point slides down the pump's curve to a higher flow.

```figure
type: compare
title: TP-3's operating point by sump level
rowhead: Sump level below the pump
cols: Static head, m | Flow, L/s | Head, m | Efficiency
caption: This is an illustration. The operating point moves by less than 0.7 L/s over the sump's whole range, and stays at the best efficiency point.
- 2.0 m, low | 20.0 | 13.17 | 23.60 | 74.0%
- 1.25 m, middle | 19.25 | 13.52 | 23.03 | 73.9%
- * 0.5 m, high | 18.5 | 13.86 | 22.47 | 73.7%
```

Over the sump's 1.5 m range, the flow changes by only 0.69 L/s, about 5%. That is a feature of a pump with a fairly steep curve on a system with a flat one: the pump's head changes much more quickly with flow than the system's does, so a change in the system's static head moves the crossing only a little. TP-3 runs close to its best point whatever the sump's level.

## How the point moves with resistance

Raising the system's resistance steepens its curve, and the operating point slides up the pump's curve to a lower flow and higher head. This is an illustration, with the sump low:

- **Ageing.** If the pipe's effective roughness rose from 0.045 to 0.5 mm, the flow would fall to **12.46 L/s** at 24.68 m. The plant's minimum of 12 L/s is still met, but most of the margin has gone.
- **A clogging foot valve.** If the foot valve's strainer clogged until its loss coefficient rose from 3.0 to 30, the flow would fall to **11.89 L/s** at 25.52 m, just below the plant's minimum. A clogged foot valve also cuts into the pump's suction margin, which Chapter 5 shows is the more serious effect.

The two effects together would take TP-3 well below its duty. The plant's maintenance schedule cleans the foot valve's strainer quarterly, and the yearly check of Chapter 3 tracks the pump's point on its curve.

## Starting with an empty pipe

The operating point above assumes the discharge pipe is full of water. After the system has been drained, it is not, and while it fills the pump meets a different system. With the discharge pipe partly empty, the water need only be lifted as far as the column has reached, and the system's head is less than its full static head. The pump runs further out on its curve, at a higher flow and lower head, until the column reaches the top.

For TP-3, the discharge pipe holds 120 × 0.00871 = 1.05 m³ of water. At an average of, say, 18 L/s while filling, it fills in about a minute. During that minute, the pump runs to the right of its best point, its power is near the peak of its curve, and its NPSH required is higher, so it is closest to cavitating just when the suction is also most disturbed. For a short fill like TP-3's, the risk is small. For long pipelines that take many minutes to fill, pumps are started against a partly closed valve, or slowly with a variable-speed drive, to keep them inside their range while the line fills. Water Hammer by the Numbers deals with the surge when the column arrives at the top and stops accelerating.

## Finding the point on site

The operating point on a running system can be found from two readings, the flow and the pump's head, which Chapter 1 showed how to take. With those, the point can be plotted on both curves. If it lies on the pump's curve and at the expected flow, both pump and system are as designed. If it lies on the pump's curve but at a different flow, the system has changed. If it lies below the pump's curve, the pump has.

On TP-3, the plant takes the readings once a quarter with the sump's level noted, and plots them on a copy of the data sheet that carries the system curves for the sump's high and low levels. Over a year, the points form a short line along the pump's curve between those two system curves. A point that falls outside that band is investigated.

## Lift systems and friction systems

TP-3's system is dominated by lift: of its 23.60 m at the operating point, 20.0 m is static and 3.60 m is dynamic. That shapes everything about how it behaves.

- **Flow is insensitive to resistance changes**, as long as they are small. A 10% rise in friction moves TP-3's flow by much less than 10%.
- **Flow is very sensitive to the pump's head near shut-off.** If the pump's head fell below 20 m at every flow, through wear or slowing, the flow would not fall gradually; it would stop. A lift system has a cliff edge at its static head.
- **Speed control saves little.** Most of the head is lift, which must be supplied at any flow. Chapter 6 works out how little.

A friction-dominated system, such as a closed cooling loop, is the opposite: its curve starts at zero and its flow responds to every change in resistance, and slowing its pump saves a great deal. Knowing which kind of system a pump is on is the first step in understanding it.

## How the header tank ends the run

TP-3 runs until the header tank is full and then stops. How it stops matters to the pump. The plant uses level switches in the header tank: a high-level switch stops the pump and a low-level switch starts it, so the pump always runs at its normal operating point and is never asked to run at low flow.

Many similar systems instead fit a float valve at the tank's inlet, which closes gradually as the tank fills. As it closes, it adds resistance, the system curve steepens, and the operating point slides back up the pump's curve towards shut-off. In the last few minutes before the tank is full, the pump runs far left of its best point, at low flow and high head, and if the float valve shuts completely while the pump is still running, the pump runs at shut-off, heating the trapped water. A float valve on a pumped tank therefore needs a pressure switch, a flow switch or a minimum-flow bypass to stop or protect the pump, which Chapter 9 covers. Level switches avoid the problem altogether, and they are the plant's standard.

## The system curve is a family

A real system has not one curve but a family: one for each sump level, valve setting and state of the pipes. The pump must work acceptably across the whole family, delivering at least the duty at the worst combination and not running out of its preferred range at the best. TP-3's family spans from the high sump with new pipe, at 13.86 L/s, to the low sump with aged pipe and a clogged foot valve, below 12 L/s. The selection was a good one for the new system; the maintenance schedule is what keeps the old system inside the family the pump can serve.

## Valves on the discharge

TP-3's discharge has two valves, a check valve that stops the column draining back when the pump stops, and a gate valve for isolation. Both are fully open in service, and their losses are part of the system curve. Partly closing the gate valve would add resistance and move the operating point to a lower flow, which is how many plants control a pump's flow. It works, but it wastes energy in the valve, and Chapter 7 shows how much. On TP-3, which needs only to fill a tank, there is no reason to throttle: a higher flow simply fills the tank sooner, and the energy per cubic metre is lowest near the best point, where the pump already runs.

## The error: a system curve with no lift

This is an illustration. When the plant designed a second, similar transfer system, TP-4, to a mezzanine tank, a junior engineer built its system curve from the friction calculation alone, forgetting the static head. Their curve passed through zero at zero flow and through about 3.0 m at 12 L/s, and they selected a small pump that gave about 4.5 m at that flow.

The real system, like TP-3's, needed about 18.5 to 20 m of lift before any water moved. The small pump's shut-off head was well below the static head, so it could not deliver any water at all; like the spare pump in Chapter 3, it would have churned against the standing column. Even TP-3's own pump, run on the friction-only curve, would appear to deliver **20.6 L/s** at 8.5 m, a point far beyond its published range and nothing like what it does on the real system.

It was caught at design review, when a senior engineer asked where the lift was. The fix was to add the static head, which made the duty 12 L/s at about 23 m, and to select accordingly. The review checklist now begins with one question: "What head does the system need at zero flow?" On a lift system, the answer to that question is most of the duty; on a closed loop, it is zero. Either way, it must be asked before any pump is chosen, and the answer written on the selection sheet.

```figure
type: bars
title: Head needed at 12 L/s with and without the lift
unit: m
max: 25
caption: This is an illustration for TP-3's system with the sump low. Leaving out the static head makes the duty look like an eighth of what it is.
- Friction-only curve | 3.01
- * Real system, sump low | 23.01
```

## Exercise: the operating point at the middle level

With the sump at its middle level, 1.25 m below the pump, TP-3's static head is 19.25 m. Taking the dynamic head as 0.02075 × Q², with Q in L/s, find the operating point with the pump curve H = 34 − 0.060 × Q².

**Worked answer.**

- At the operating point, 34 − 0.060 × Q² = 19.25 + 0.02075 × Q².
- So 14.75 = 0.08075 × Q², and Q² = 182.7, Q = **13.52 L/s**.
- The head is 34 − 0.060 × 182.7 = **23.04 m**.

The square-law approximation agrees with the full calculation's 13.52 L/s and 23.03 m to within 0.01 m. For a lift-dominated system with modest friction, the simple form is entirely adequate for finding the operating point.
