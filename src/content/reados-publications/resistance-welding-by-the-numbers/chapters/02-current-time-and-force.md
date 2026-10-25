---
book: resistance-welding-by-the-numbers
chapterSlug: current-time-and-force-the-welding-window
order: 2
title: "Current, time and force: the welding window"
description: "Find the range of current that makes a sound spot weld, set a schedule inside it from a weld-lobe trial, and see how force and time move the window."
draft: false
---

A spot weld has three main settings: the welding current, the weld time and the electrode force. Each can be set on its own, but they act together. Too little heat and the sheets stick without a proper nugget; too much and molten metal is expelled from between the sheets. Between those limits is a working range, the welding window, and the whole job of setting up a spot welder is to find that window and sit comfortably inside it.

This chapter sets the cabinet body's spot schedule from a weld-lobe trial, shows how the window moves with force and time, and explains why the shop does not simply set the current as high as it will go without expulsion.

## The parts of a weld schedule

A spot weld is a short sequence, usually set in cycles or milliseconds:

1. **Squeeze**: the electrodes close and the force builds to its set value before any current flows.
2. **Weld**: the current flows for the set weld time, possibly in more than one pulse.
3. **Hold**: the current stops but the force stays on while the nugget solidifies and cools.
4. **Off**: the electrodes open and the parts move to the next spot.

The squeeze time matters because current applied before the force has built up passes through a light contact, which causes surface burning and expulsion at the electrodes. The hold time matters because a nugget released while still partly liquid can crack or form a cavity as it shrinks without the electrodes pressing on it.

```figure
type: timeline
title: The cabinet body's spot weld schedule at 50 Hz
caption: This is an illustration. One cycle at 50 Hz is 20 ms. Squeeze and hold are set long enough for force to build and for the nugget to freeze under pressure.
- 0 to 0.40 s | Squeeze, 20 cycles | force builds to 3.0 kN
- *0.40 to 0.60 s | Weld, 10 cycles | 9,000 A
- 0.60 to 0.80 s | Hold, 10 cycles | force stays on while the nugget freezes
- 0.80 s | Electrodes open | part indexes to the next spot
```

## Hamilton and Oberg's four factors

Hamilton and Oberg listed four things that governed a spot weld in 1918: the material and its surface (whether pickled, scaled or coated), the time, the pressure, which they tied closely to the current and time, and the current itself. Their example for thin pickled sheet steel was a pressure of 200 pounds (about 890 N), 10 kW and one second. For scaled, hot-rolled sheet of the same thickness they increased the pressure by 50 to 100%, to 300 or 400 pounds, and the power to 10 to 12 kW, with the same one-second time.

They set the pressure by experiment. A platform scale was placed under the machine's upper arm with a bar between them, and trial welds were made on scraps of the same sheet until pressure, time and current gave a good result, confirmed by polishing and examining a section through the weld. That is the ancestor of the modern weld-lobe trial: settle the variables by testing on the actual material, then check the welds destructively.

One second, fifty cycles at 50 Hz, is long by modern standards. Modern machines deliver much higher currents, so they reach welding temperature in a fraction of the time and waste less heat by conduction, as Chapter 1 explained.

## The minimum nugget size

A spot weld is judged mainly by its nugget diameter, measured after a peel or chisel test (Chapter 10). A minimum diameter is usually stated as a function of the thinner sheet's thickness t. A widely used rule of thumb sets the minimum at **4√t**, with t in millimetres, and some users aim for 5√t as a target size. Customer specifications and standards may set their own values, and those govern.

For the cabinet body, t = 1.2 mm, so:

- minimum, 4√1.2 = **4.38 mm**;
- target, 5√1.2 = **5.48 mm**.

The shop uses 4.38 mm as its rejection limit and aims for about 5.5 mm in production.

## The weld-lobe trial

This is an illustration. With the force fixed at 3.0 kN and the time at ten cycles, the shop welded coupons of the cabinet sheet at currents from 7.5 kA to 10.5 kA in 0.5 kA steps, peeled them and measured the nuggets. Each coupon already carried one spot at the production pitch of 30 mm, and the trial weld was the second spot, so the results include the current lost through the neighbouring weld, an effect Chapter 5 explains.

```figure
type: line
title: Nugget diameter against current, 1.2 mm sheet, 3.0 kN, ten cycles
x: Welding current (kA)
y: Nugget diameter (mm)
ymin: 3
ymax: 7
caption: This is an illustration. At 7.5 kA the coupons stuck without a measurable nugget. At 10.5 kA every coupon expelled metal. The minimum of 4.38 mm is reached at about 8.2 kA.
legend: Mean of three coupons
- 8.0 | 4.1
- 8.5 | 4.8
- 9.0 | 5.5
- 9.5 | 6.0
- 10.0 | 6.3
```

The nugget grows quickly at first and then levels off as it approaches the electrode tip diameter, because the electrode face limits how wide the current path can spread. Beyond that, extra current mostly deepens the indentation and drives the weld towards expulsion.

Interpolating between 8.0 kA (4.1 mm) and 8.5 kA (4.8 mm), the 4.38 mm minimum is reached at 8.0 + (4.38 − 4.1) ÷ (4.8 − 4.1) × 0.5 = **8.2 kA**. Expulsion began at 10.5 kA. So at this force and time the window runs from about **8.2 kA to 10.5 kA**, a width of 2.3 kA.

## Choosing the set point

The midpoint of 8.2 and 10.5 kA is 9.35 kA. The shop set **9.0 kA**, slightly below the midpoint, for two reasons.

First, expulsion is easy to detect, because it throws sparks and leaves visible marks, while an undersized weld is invisible. That might argue for sitting closer to expulsion. But second, and more important, electrodes wear in a way that moves the whole window upwards. As the tips flatten and grow, the same current spreads over a larger area and produces less heat per unit area (Chapter 4), so the current needed for a minimum weld rises during the life of the tips. A set point 0.8 kA above the minimum would soon be at the minimum. The shop therefore combines a set point near the middle with regular tip dressing and current stepping, so the effective position in the window is maintained.

Sitting just below expulsion is also undesirable for a less obvious reason. Expulsion that occurs occasionally leaves cavities, rough surfaces and spatter that can damage fixtures and spoil paint finishes. A schedule that expels on one weld in fifty is not a good schedule.

```figure
type: gauge
title: The cabinet set point within the 1.2 mm welding window
min: 7
max: 11
value: 9.0
unit: kA
label: set point
caption: This is an illustration. Below about 8.2 kA nuggets are undersized; at 10.5 kA and above metal is expelled. The set point leaves room for electrode wear, which pushes the minimum upwards.
- 7 | 8.2 | Undersized or stuck
- 8.2 | 10.5 | Welding window
- 10.5 | 11 | Expulsion
```

## How force and time move the window

The lobe is the window plotted for several weld times. With longer times, more heat is generated at each current, so the whole window moves to lower currents; with shorter times it moves higher and usually becomes narrower, because there is less time for heat to spread evenly.

This is an illustration. The shop also ran shorter checks at eight and twelve cycles:

| Weld time | Minimum current for 4.38 mm | Expulsion current | Window width |
|---|---|---|---|
| 8 cycles (0.16 s) | 8.7 kA | 11.0 kA | 2.3 kA |
| 10 cycles (0.20 s) | 8.2 kA | 10.5 kA | 2.3 kA |
| 12 cycles (0.24 s) | 7.9 kA | 10.1 kA | 2.2 kA |

Force acts differently. Raising the force lowers contact resistance, so a higher current is needed to reach the minimum size, but it also holds the molten nugget more firmly, so expulsion moves up even further. Within limits, more force tends to widen the window. Too much force, though, causes deep indentation, sheet distortion and rapid electrode wear. The shop checked the effect at 10 cycles:

- at 2.5 kN, expulsion began at about 9.6 kA, narrowing the window to 1.4 kA;
- at 3.5 kN, the minimum rose to about 8.6 kA and expulsion was not reached by 10.5 kA.

Both of these are illustration values; the lesson is the direction of the change. A force of 3.0 kN with ten cycles gave a wide enough window with acceptable indentation, so it was kept.

## Upslope, pulses and other refinements

A simple schedule switches the full current on at once. Many controls can also ramp the current up over a few cycles, called upslope, or split the weld into several pulses with short cool intervals between them.

Upslope helps when the contact resistance is high or variable at the start of the weld, for example on lightly oiled or coated sheet. Full current applied to a high-resistance contact concentrates heat at the surface before the contact has been pressed flat, which tends to cause early expulsion and electrode pick-up. A ramp lets the contacts soften and settle first, so the heat moves to the faying surface before the current reaches its full value. On the cabinet body, with clean uncoated sheet, the shop found no benefit from upslope and kept the schedule simple.

Pulsed welding is used mainly for thicker sheet and some coated or high-strength steels. Each pulse adds heat and the cool interval lets it spread into the stack while the surfaces next to the electrodes recover, so a larger nugget can be grown without overheating the surface. Some schedules also add a lower post-weld current pulse to temper a hard nugget in hardenable steels, a refinement linked to the carbon-and-cooling-rate ideas in [Weldability by the Numbers](/reados/publications/weldability-by-the-numbers/carbon-cooling-rate-and-hardness/).

Each refinement adds settings that must be recorded, controlled and justified by trials. A shop that cannot explain why a schedule has three pulses and an upslope is unlikely to notice when one of them has been changed by mistake.

## What the outside of a weld can and cannot tell you

The electrode marks on the outside of the sheet give some information. A clean, round mark of about the tip diameter, with light even discolouration, is what a normal weld leaves. A mark much larger than the tip suggests mushroomed electrodes; an oval or lopsided mark suggests misaligned electrodes or a weld made at an angle; a deep crater suggests too much force or current; and blackened, cratered surfaces or copper-coloured deposits suggest surface burning or electrode pick-up.

Indentation depth is also measurable. Many specifications limit it, typically as a percentage of sheet thickness, because deep indentation thins the sheet locally and spoils appearance. The cabinet's customer drawing limits it on visible faces, and the shop checks it with a dial depth gauge on test coupons.

What the outside cannot show is the nugget itself. A stuck weld with no nugget can leave a perfectly normal electrode mark. That is why visual inspection of resistance welds is always backed by destructive tests and process monitoring, the subject of Chapter 10.

## Standards and published schedules

Published guidance exists for many common materials. ISO 14373 sets out a procedure for spot welding uncoated and coated low carbon steels, and electrode and machine suppliers publish starting schedules. They are starting points, not answers. The actual window depends on the machine's secondary circuit, the electrode material and shape, the sheet's coating and surface, and the fit-up of the real part, so the shop's procedure always confirms a schedule by a lobe trial and destructive tests on the production material.

## A failure: the window that closed

This is an illustration. Three weeks into production, the cabinet line began to expel metal intermittently, on perhaps one weld in twenty, at the same 9.0 kA that had been comfortably inside the window. At the same time some welds near the cabinet corners were undersized.

The weld-lobe idea gave the structure for the investigation: something had narrowed the window from both ends. The maintenance fitter found that the air pressure to the welding cylinder had dropped because a regulator had been knocked, reducing the electrode force from 3.0 to about 2.4 kN. With lower force, the expulsion limit had dropped towards 9.0 kA. At the same time, the corner welds were affected by poor fit-up: where the flanges did not sit flat, part of the reduced force was spent pulling the sheets together, so the real force on the weld was lower still and the contact area unpredictable.

The regulator was reset and locked, a force check with a load cell was added to the start-of-shift routine, and the corner flanges were re-tooled to sit flat. A lobe check at 3.0 kN confirmed that the window had returned to 8.2 to 10.5 kA. The lesson was that a resistance welding window belongs to the whole set of conditions, not to the current alone.

## Exercise: a thicker cabinet

A heavier version of the cabinet uses 2.0 mm sheet. Calculate the minimum and target nugget diameters by the 4√t and 5√t rules. Then, given a lobe trial on 2.0 mm sheet that reached the minimum at 10.4 kA and expelled at 13.0 kA, find the window width and a set point placed 40% of the way across the window from the minimum. Also find the minimum and target for 0.8 mm sheet.

For 2.0 mm: minimum 4√2.0 = **5.66 mm**; target 5√2.0 = **7.07 mm**. The window is 13.0 − 10.4 = **2.6 kA**, and a set point 40% across it is 10.4 + 0.40 × 2.6 = **11.44 kA**, which the shop would round to about 11.4 kA. For 0.8 mm: minimum 4√0.8 = **3.58 mm**; target 5√0.8 = **4.47 mm**.

Placing the set point below the midpoint, as for the 1.2 mm sheet, leaves room for the window to move upwards as the electrodes wear. Whether 40% is right depends on how quickly the tips wear and how often they are dressed, which the shop learns from its tip-life records in Chapter 4.
