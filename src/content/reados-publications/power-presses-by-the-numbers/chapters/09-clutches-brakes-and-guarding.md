---
book: power-presses-by-the-numbers
chapterSlug: clutches-brakes-and-guarding
order: 9
title: "Clutches, brakes, stopping time and guarding"
description: "Clutches and brakes, stopping time, the order of guarding measures in Australian guidance, how stopping time sets a light curtain's distance, and a brake that wore past its guard."
draft: false
---

A press that cannot be stopped cannot be guarded. Most of the ways of protecting people from a press's tool rely on the press stopping, or not starting, when someone could be in danger, and they work only if the clutch disengages and the brake stops the ram quickly and reliably every time. The press's stopping time is therefore a safety number as much as a performance one, and it changes as the brake wears.

This chapter describes clutches and brakes, from Hodgson's steel-pin clutch to the modern combined clutch-brake, explains stopping time and how it is measured, sets out the order of guarding measures in Australian regulators' guidance, shows how stopping time sets the distance of a presence-sensing device, applies all of it to Press 4's two jobs, and ends with a brake that wore until its light curtain no longer protected the loader.

This chapter explains principles. The guarding and controls of a real press are designed, installed and verified by competent people under Australian work health and safety law, the regulators' guidance and the Australian standards for power presses, AS 4024.3001 for mechanical presses and AS 4024.3002 for hydraulic ones.

## Clutches

The clutch connects the running flywheel to the crankshaft for a stroke and disconnects it afterwards. Two kinds matter.

- A **full-revolution clutch**, such as the steel-pin and rolling-key clutches Hodgson described in 1903, locks the crankshaft to the flywheel and cannot release it until the crank has come round to the top again. Once a stroke has started, it finishes. Hodgson wrote about the dangers of sliding-key stop motions and unexpected descents of the ram, and those dangers are why such clutches cannot be relied on to stop a stroke for anyone's safety.
- A **part-revolution clutch**, usually a friction clutch worked by air or oil, can be disengaged at any point in the stroke, and is combined with a brake that applies as the clutch releases. Modern presses use combined clutch-brake units in which springs apply the brake and air pressure releases it, so that a loss of air pressure stops the press.

Press 4's candidate has a pneumatic friction clutch-brake with a part-revolution control. That is what makes stopping mid-stroke possible, and with it the guarding options below.

## Brakes and stopping time

When a stop signal is given, the press takes a time to stop, made up of:

- the time for the control and valves to respond;
- the time for the clutch to release and the brake to engage;
- the time for the brake to bring the flywheel-side inertia that is still connected, the crankshaft, connecting rod, ram and upper die, to rest.

The total is the **stopping time**. It is longest when the ram is moving fastest, around the middle of the downstroke, and it is usually measured there, at about 90° of crank rotation before bottom dead centre. It grows as the brake's friction material wears and as its springs weaken, and it changes with the press's speed and the weight of the upper die.

Stopping time is measured with a stopping-time analyser: a sensor on the ram or crank and a timer triggered by the stop signal. It is measured when the press is commissioned, after brake maintenance, and at intervals set by the maker, the standards and the shop's risk assessment. Many presses also have a **brake monitor**, which measures the stopping distance or time on every stroke and stops the press from starting again if it exceeds a set limit.

```figure
type: steps
title: What makes up a press's stopping time
caption: Each stage adds time. The brake's share grows as its lining wears, which is why stopping time is measured repeatedly over a press's life, not once.
- Stop signal | a guard opens, a light curtain is broken or a stop is pressed
- Control and valve response | the safety relay and the clutch-brake valve switch
- Clutch release and brake engagement | air exhausts; springs apply the brake
- *Braking to rest | crankshaft, connecting rod, ram and upper die decelerate
- Ram at rest | stopping time measured, at about 90° before bottom dead centre
```

## The order of guarding measures

Australian regulators' guidance sets out an order of preference for protecting people from a press's tool, and the order matters more than any single device.

WorkSafe Western Australia's guidance on power presses gives priority, first, to tooling or stroke limits that prevent access to the danger area altogether, with very small openings between moving parts, together with fixed guards; then to automatic feeding; then to interlocking guards that prevent the press from stroking unless the guard is closed. It states that two-hand controls on their own are not an acceptable means of protection, because they protect only the person using them and can be defeated.

WorkSafe Victoria's guidance prefers permanently fixed guards or interlocked guards that stop any part of the body entering the danger area while the press operates, with presence-sensing systems such as light curtains where fixed or interlocked guards are not possible. It also calls for daily checks of interlocks and clutch and brake mechanisms, chocks during maintenance, and several test runs before production.

Safe Work Australia's model Code of Practice for managing the risks of plant sets out the general approach that both apply. Readers check with their own state or territory regulator for the code's status and for local requirements.

```figure
type: steps
title: Guarding measures in order of preference, as in WorkSafe WA's guidance
caption: A summary for orientation, not a substitute for the guidance, the standards or a risk assessment. Lower measures supplement the higher ones; they do not replace them.
- *Tooling or stroke limits that prevent access, with fixed guards | the tool area cannot be reached
- Automatic feeding | parts reach the die without hands
- Interlocking guards | the press cannot stroke unless the guard is closed
- Presence-sensing devices where guards are not possible | the press stops if a person is detected
- Two-hand controls | not acceptable on their own
```

## Press 4's jobs

**MP-40** is fed from coil (Chapter 8), and its tool area can be enclosed by fixed guards with openings only for the strip to enter and the skeleton to leave, sized so that fingers cannot reach the tool through them. Nobody needs to reach in during production. That is the top of the order, and it is why coil-fed progressive dies are among the safest press work. The guards are opened only for setting and maintenance, under isolation and with the ram blocked (from the companion book's chapter on setting the die).

**AB-75** is hand-loaded, so the loader's hands must reach the nest. The options, in order, are:

- a **shuttle or dial feed** that lets the loader load outside a fixed-guarded tool area (Chapter 8);
- an **interlocked guard**, a gate that must be closed before the press will stroke and cannot be opened until the stroke is complete;
- a **presence-sensing device**, such as a light curtain, where neither of the above is practicable, positioned far enough from the tool that the press stops before a hand that breaks the curtain can reach it.

The shop chooses the shuttle feed for AB-75 (Chapter 10). The next sections show how a light curtain's distance is found, because it shows plainly why stopping time matters.

## Stopping time sets the distance

A presence-sensing device works only if a hand that triggers it cannot reach the danger area before the ram has stopped. The distance from the device to the danger area must be at least the distance a hand can travel in the press's stopping time, plus allowances for the device's own detection capability and any other delays.

A publicly readable example of the basic relationship is the United States regulation for mechanical power presses, 29 CFR 1910.217, which sets the safety distance of a presence-sensing device as:

Ds = 63 inches per second × Ts

where Ts is the press's stopping time measured at about 90° of crankshaft rotation. Sixty-three inches per second is about **1,600 mm/s**, a hand-speed constant. It is used here only to show the principle: Australian presses are guarded under Australian law and standards, whose methods for safety distances include allowances this simple formula leaves out, and the distance for a real installation is determined by a competent person to the applicable standard.

This is an illustration. If Press 4's candidate has a measured stopping time of **0.18 s**:

- Ds = 1,600 × 0.18 = **288 mm**, before any allowance for the device's detection capability.

The key fact is in the formula's shape: **the distance is proportional to the stopping time**. If the stopping time rises by a third, so must the distance.

```figure
type: formula
title: How stopping time sets a presence-sensing device's distance
formula: Ds = 1,600 mm/s × Ts
caption: This is an illustration of the principle, using the hand-speed constant in the US regulation 29 CFR 1910.217, about 1,600 mm/s. Real distances add allowances for the device's detection capability and are set to the applicable Australian standard.
- Ts | Stopping time measured at about 90° before bottom dead centre, s
- 1,600 mm/s | Hand-speed constant, 63 inches per second
step: Ts = 0.18 s: Ds = 1,600 × 0.18 = 288 mm
step: Ts = 0.24 s: Ds = 1,600 × 0.24 = 384 mm
```

## Why two-hand controls are not enough

A two-hand control makes the operator hold two buttons, far enough apart that both hands are on them, to start and continue a stroke. It keeps that operator's hands out of the tool for as long as both buttons are held. It does nothing for anyone else: a second person loading parts, a setter reaching in from the side, or a passer-by. Its buttons can be tied down or bridged, and the stroke can continue if a fault keeps the press moving after a hand is released. WorkSafe Western Australia's guidance says plainly that two-hand controls on their own are not an acceptable means of protection. Where they are used, they are a supplement to guards or presence sensing, and they depend on the same stopping time as a light curtain, because an operator who lets go of a button can reach the tool before the ram stops.

## Inching, setting and single strokes

Guarding during production is only part of the problem. Die setting, try-out and maintenance need the guards open, and they are where many press injuries happen.

- **Inching** moves the ram slowly, only while a control is held, for setting and checking. It is used with the guards in their setting mode and the setter outside the tool area wherever possible.
- **Safety blocks** or chocks are placed between the ram and the bolster whenever anyone must reach into the tool area with the ram up, so that a fault or a falling ram cannot close the die.
- **Isolation and lockout** of the press's electrical, pneumatic and hydraulic energy, and of the flywheel's stored energy, before work inside the press. A flywheel takes minutes to run down.
- **Single-stroke controls** that require the operator's action to be repeated for each stroke prevent unintended repeat strokes.

WorkSafe Western Australia's guidance describes **foul strokes**, where the tool descends without the press being operated, from causes such as brake failure, inadequate clutch disengagement and seizures. Daily checks of the clutch and brake, the interlocks and the stopping performance are how they are caught before they happen.

## Daily checks

WorkSafe Victoria's guidance calls for daily inspection and testing of a press's safety systems, including interlocked guards, clutch locks and clutch-brake mechanisms. For Press 4, as an illustration, the operator's start-up check includes:

- guards in place and undamaged, with no gaps that were not there before;
- each interlock tested by opening its guard and confirming that the press will not stroke;
- the shuttle feed's interlocks tested in the same way;
- a single stroke made and the ram seen to stop at the top, without overrunning;
- the clutch-brake's air pressure read on its gauge and within its marked range;
- the stop controls tested;
- any unusual noise, smell or behaviour reported before production starts.

The check takes a few minutes and is recorded. It cannot measure the stopping time, which needs an analyser, or find wear that has not yet changed the press's behaviour, which is why the periodic inspections and measurements by a competent person are a separate part of the press's maintenance, not something the daily check replaces.

## The error: a brake that wore past its guard

This is an illustration. Before the shuttle feed was fitted, AB-75 ran for a period on the shop's existing press with a light curtain, installed by a contractor at a distance calculated from that press's measured stopping time of 0.18 s, with the contractor's allowances added. The shop's daily check confirmed that breaking the curtain stopped the press; nobody re-measured the stopping time.

Eight months later, the press's annual inspection by a competent person included a stopping-time measurement. It read **0.24 s**. The brake lining had worn, and the brake's springs had weakened. At 1,600 mm/s, a hand moves 96 mm further in the extra 0.06 s: by the same basic relationship, the distance needed had risen from 288 to **384 mm** before allowances. The curtain had been placed for the old stopping time. For some months, a loader reaching quickly into the die after breaking the curtain could have reached the tool before the ram stopped.

The daily check had not found it, because it tested only that the press stopped, not how quickly. The press was taken out of service, the brake was relined and its springs replaced, and the stopping time was measured again, at 0.17 s. A brake monitor was fitted to measure stopping on every stroke and to stop the press if it exceeded a limit set from the curtain's distance, and the stopping time was added to the shop's maintenance schedule at an interval set by the maker's and the inspector's advice. The shop also brought forward its plan to move AB-75 to a shuttle feed with fixed guarding, which does not depend on stopping time at all.

```figure
type: bars
title: Minimum distance for a presence-sensing device by stopping time
unit: mm
max: 420
caption: This is an illustration of the basic relationship Ds = 1,600 mm/s × Ts, before allowances for detection capability. A light curtain placed for a 0.18 s stop is too close once the brake has worn to 0.24 s.
- Relined brake, 0.17 s | 272
- * As installed, 0.18 s | 288
- Worn brake, 0.24 s | 384
```

## Exercise: a faster press

A servo press considered for Press 4 has a measured stopping time of 0.12 s at its fastest speed. Using the same basic relationship, what minimum distance would a presence-sensing device need before allowances, and how much further could the stopping time rise before the 288 mm distance of the original curtain became too short?

**Worked answer.**

- Ds = 1,600 × 0.12 = **192 mm** before allowances.
- A distance of 288 mm corresponds to a stopping time of 288 ÷ 1,600 = 0.18 s, so the stopping time could rise by **0.06 s**, half as much again, before a device at 288 mm was too close by this measure.

A shorter stopping time allows a device closer to the tool, which is convenient for the loader, but the margin still has to be watched: a press whose stopping time is short when new can lose it as its brake or drive wears, and a brake monitor or periodic measurement is what keeps the distance valid.
