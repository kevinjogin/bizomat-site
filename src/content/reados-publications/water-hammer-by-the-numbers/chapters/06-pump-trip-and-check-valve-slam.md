---
book: water-hammer-by-the-numbers
chapterSlug: pump-trip-and-check-valve-slam
order: 6
title: "Pump trip and check valve slam"
description: "Estimate how fast a tripped pump loses flow, size the downsurge it sends into a rising main, and see why a check valve that closes late slams with a surge of its own."
draft: false
---

A power failure stops every pump on a site at once, without warning and without any of the careful ramping that controls provide in normal operation. On a rising main the consequences start at the pump. Its head collapses, the water in the main is still moving uphill, and the first wave into the line is a fall in pressure. Seconds later the column stops, turns and runs back downhill, and whatever check valve stands at the pump has to close against it.

This chapter takes those two events in order for the case's main: the downsurge from the trip, and the slam of the check valve when the flow reverses. It estimates how quickly a pump without extra inertia loses its flow, compares rundown times using the case's model, and shows how a check valve's closing behaviour, not just its rating, decides whether the trip ends quietly or with a bang.

## Why a pump stops so quickly

A pump and motor have little stored energy compared with the work they do each second. A useful measure is the time the rotating parts could keep supplying their full shaft power from their own kinetic energy, sometimes called the inertia time constant:

**T_p = J ω² ÷ P**

where J is the moment of inertia of pump and motor together, ω the running speed in radians per second, and P the shaft power.

This is an illustration. The case's pump delivers 30 L/s at 58 m. With an assumed efficiency of 75 per cent, its shaft power is 998 × 9.81 × 0.030 × 58 ÷ 0.75, about **22.7 kW**. A 4-pole motor turning at about 1,475 rpm runs at 154.5 rad/s. Taking the combined inertia as 0.35 kg·m², a teaching value, T_p is 0.35 × 154.5² ÷ 22,700, about **0.37 s**.

That is the scale of the problem. A pump's head falls with the square of its speed, so once the speed drops by about 15 per cent, to √(42 ÷ 58) of full speed, the pump can no longer lift water against the 42 m static head at all. With so little stored energy, that happens within a fraction of a second. For a small pump without a flywheel, flow at the pump falls to zero in perhaps half a second to a second. On the case's main, whose pipe period is 1.34 s, that is effectively an instant stop.

On an existing station the rundown can be measured rather than estimated. A tachometer or the drive's own speed record during a planned stop, or a fast-logging flow meter on the discharge, shows how quickly speed and flow fall. The motor maker's data gives the rotor inertia and the pump maker's data the impeller and coupling inertia, and the two should be added before any estimate is made. A measured rundown is worth far more to a surge study than an assumed one, because it captures the real pump curve, the real motor behaviour after power loss and any coupled equipment.

## The downsurge

When the flow at the pump stops instantly, the head on the main side falls by the Joukowsky amount, about 220 m. The steady head at the pump is 58 m above the pump, so the downsurge would take it to about 162 m below the pump. Water cannot do that. At about 10 m below atmospheric, its vapour pressure, it boils. A vapour cavity forms just downstream of the pump, and the column of water in the main carries on uphill, separating from it.

This is an illustration from the case's model. Three rundown times were run, with the flow at the pump falling linearly to zero and a check valve then holding it at zero.

```figure
type: compare
title: Downsurge at the pump for three rundown times
rowhead: Flow falls to zero in
cols: Lowest grade line at pump | Lowest pressure head at pump | Downsurge
caption: This is an illustration from the case's model, without a cavity model. The pump is at RL 100 m. Below about 10 m under atmospheric, vapour pressure is reached and the model's value is not physical.
- * 1 s, no flywheel | far below vapour pressure | not physical | full Joukowsky, about 220 m
- 8 s | RL 113.3 m | 13.3 m | 44.7 m
- 15 s | RL 129.5 m | 29.5 m | 28.5 m
```

The 1 s rundown, which is about what the case's pump would achieve on its own, produces a cavity at the pump. The 8 s and 15 s rundowns keep the pump end positive. Chapter 7 follows the same three rundowns along the profile, where the high point near chainage 600 m turns out to be the place that matters.

## Screening a rundown

For a quick estimate of a slower rundown, the slow-closure formula from Chapter 5 can be applied to the pump end: ΔH ≈ 2 L V ÷ (g t), with t the time for the flow to fall to zero. For an 8 s rundown on the case's main this gives about 36.9 m, against the model's 44.7 m. The screening is optimistic by about 17 per cent here, for reasons like those in Chapter 5: the flow does not fall evenly, and once the pump stops pushing, friction no longer opposes the deceleration in the same way. Use the screening to decide whether a rundown is in the right range, then model it.

## Adding inertia

The direct way to slow the rundown is a flywheel on the pump shaft. Rundown time scales roughly with inertia, so moving from about 0.6 s, a reasonable figure for the case's pump, to 8 s needs roughly thirteen times the total inertia.

This is an illustration. With the pump and motor at 0.35 kg·m², the flywheel would need to add about 0.35 × (8 ÷ 0.6 − 1), roughly **4.3 kg·m²**. A solid steel disc of 0.3 m radius has J = ½ m r², so it would weigh about 2 × 4.3 ÷ 0.09, roughly **96 kg**.

That is an order-of-magnitude estimate, not a design. Flywheels add starting load on the motor, which must accelerate the extra inertia every start, and change the bearing loads and the shaft's critical speed. They also only work if the pump keeps rotating: they do nothing for a pump that seizes, and nothing on a variable speed drive that brakes the motor to a stop. They are most practical on small and medium pumps; on large pumps the required inertia becomes impractical and surge vessels take over, as Chapter 8 discusses.

## Check valves and reverse flow

After a trip, the column in the main decelerates, stops and starts to run back towards the pump under the 42 m of static head. Something must stop it, or the main drains back through the pump, spinning it backwards. That is the check valve's job.

A rigid-column estimate shows how quickly reversal comes. With the pump head gone, the column is decelerated by about the full 58 m of head it was working against. Its deceleration is g × 58 ÷ 900, about 0.63 m/s², so it would stop in about 1.6 ÷ 0.63, roughly 2.5 s. It then accelerates backwards under the 42 m static head at about 9.81 × 42 ÷ 900, about 0.46 m/s². The wave model differs in detail, but the order of magnitude stands: on a steep rising main, reverse flow builds within a few seconds of a trip, and quickly.

A check valve that closes exactly at zero velocity stops nothing and causes no surge. A check valve that closes late, after reverse flow has developed, stops the reverse velocity suddenly and launches a Joukowsky wave of its own:

**ΔH_slam = a × V_r ÷ g**

where V_r is the reverse velocity at the moment of closure.

```figure
type: bars
title: Check valve slam surge on the case's main
unit: m
max: 90
caption: This is an illustration at a = 1,343 m/s. The slam surge acts on the main side of the valve, on top of whatever head the transient has left there.
- Closes at 0.1 m/s reverse | 13.7
- * Closes 0.5 s after reversal, about 0.23 m/s | 31.3
- Closes at 0.3 m/s reverse | 41.1
- Closes 1 s after reversal, about 0.46 m/s | 62.7
- Closes at 0.6 m/s reverse | 82.2
```

The slam is the bang many plant operators hear when a pump stops. It also batters the valve: disc, seat and hinge pin take the impact on every trip.

## Which check valves close in time

Check valves differ greatly in how fast they respond to decelerating flow. Their behaviour is described by the valve maker's dynamic characteristic, which relates the reverse velocity at closure to the rate at which the flow was decelerating. Thorley's book in the references explains how such characteristics are measured and used.

```figure
type: compare
title: Check valve types and their response
rowhead: Type
cols: How it closes | Tendency to slam on a steep main
caption: General tendencies only. The valve maker's dynamic characteristic, matched to the system's deceleration, decides the real behaviour.
- Swing check, heavy disc | gravity and reverse flow swing a hinged disc a long arc | high: the disc lags and closes on reverse flow
- Swing check with lever and weight or damper | as above, with adjustable assistance or damping | moderate; set-up dependent
- Dual-plate, spring-assisted | two light half-discs close a short arc under springs | lower
- * Nozzle or axial, spring-assisted | a light disc moves a short distance along the flow axis | low: closes near zero velocity
- Controlled-closure valve | actuated or hydraulically damped final closure | designed into the scheme; not a simple check
```

A steep rising main, like the case's, decelerates its flow quickly after a trip. It needs a check valve that closes quickly and close to zero velocity: short stroke, light moving parts, spring assistance. A heavy swing check that works well on a flat, slow-decelerating line can slam badly here.

## A failure case: the cheaper check valve

This is an illustration. The case's pump was commissioned with a spring-assisted nozzle check valve. Years later it is replaced during an emergency repair with a large swing check valve, which happened to be in the store, of the right size and pressure rating.

From then on, every power failure and every stop of the pump ends in a loud bang at the pump station. Within a year, the swing valve's hinge pin is worn, its seat is damaged, and a flange gasket downstream of it has failed.

A pressure logger at the pump discharge shows the cause: a sharp spike of about 40 m above the post-trip head a little after each stop. That matches a closure at a reverse velocity of about 0.3 m/s. The heavy disc was still swinging shut when the column reversed.

The correction was to fit a check valve of the original type, chosen against the maker's dynamic characteristic for the main's deceleration, and to add check valves to the list of controlled items for this main: they may only be replaced like for like, or after a surge check. The swing valve was not faulty. It was the wrong valve for this pipeline.

## Without a check valve

Some systems deliberately omit the check valve, or lose it to failure. Then, after a trip, the reversed column drives water back through the pump, which slows, stops and starts to turn backwards as a turbine. The main drains towards the pump until the tank's inlet valve or a downstream check closes, or until the tank empties. Reverse rotation can reach speeds above normal running speed on a high-head main, and a motor restarted while turning backwards takes a heavy shock. Pump makers state the reverse speed their equipment can tolerate, and some installations fit anti-reverse ratchets for this reason.

Draining has its own transient risk. As the main empties, air enters at high points, and when the pump is next started the column accelerates into a partly empty line and meets trapped air or a closed valve, the start-up case listed in Chapter 3. A check valve is usually much cheaper than managing those effects.

## Two pumps in parallel

Many pump stations run two pumps in parallel on one main, often a duty pump and a standby, or two duty pumps at high demand. A trip of one while the other keeps running produces a different transient. The running pump keeps the main pressurised, so the downsurge is smaller, but the tripped pump's check valve now sees reverse flow pushed back through the idle pump by the running one, at a rate set by the running pump's head. A slow check valve on the tripped pump can slam as hard as on a single-pump trip, and repeatedly over the station's life.

A power failure, by contrast, trips both at once and gives the full single-main downsurge with two check valves closing together. Both cases need checking: the single trip for check valve behaviour, the double trip for the downsurge and column separation. Pump sequencing, such as staggered starts and stops, helps in normal operation but does nothing in a power failure.

## Pumps on variable speed drives

A variable speed drive can ramp a pump down gently in normal operation, over tens of seconds, and many surge problems on stopping vanish as a result. That protection disappears in exactly the event that matters most: a power failure, when the drive has no power to control anything and the pump coasts down on its own inertia. A drive can also trip on a fault and let the motor coast. Surge protection must be designed for an uncontrolled trip. Chapter 8 returns to this, because relying on a soft stop is one of the commonest gaps in surge design.

## Exercise: a heavier pump

A larger pump set on a similar main has a shaft power of 55 kW at 1,475 rpm and a combined inertia of 1.2 kg·m². Find its inertia time constant. If the flow then falls to zero in roughly twice that time, is the trip fast or slow compared with a pipe period of 1.34 s?

**Answer.** ω = 154.5 rad/s, so T_p = 1.2 × 154.5² ÷ 55,000 ≈ 28,644 ÷ 55,000 ≈ **0.52 s**. Twice that is about 1.04 s.

That is less than the 1.34 s pipe period: still a fast trip, producing close to the full Joukowsky downsurge. A larger motor and pump add inertia, but they also carry more power, so their rundown time does not grow much. That is why even large pumps on long mains usually need deliberate surge protection rather than relying on their own inertia.
