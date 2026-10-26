---
book: pneumatics-by-the-numbers
chapterSlug: choose-valves-tubing-and-the-fail-state
order: 4
title: "Choose valves, tubing and the fail state"
description: "Decide what a pneumatic machine does when power or air is lost, then choose the valve function, flow rating, tubing and exhaust treatment, and draw the circuit so spares match the design."
draft: false
---

The directional valve is the part of a pneumatic circuit that decides what the cylinder does. It also decides what the cylinder does when nobody intends anything: when the power fails, when the air is turned off, when the air comes back, when someone presses the manual override to see what happens. Those moments are rare, which is why they are often left to whichever valve was cheapest or already in the store. They are also the moments when people get hurt and machines get damaged, because the machine moves when nobody expects it to, or fails to move when everyone expects it will.

This chapter chooses the reject station's valve and the parts around it. It decides the fail state first, then chooses the valve function and actuation to deliver it, checks the flow the valve must pass, chooses tubing and where to mount the valve, treats the exhaust air for a food line, adds a pressure switch, and draws the circuit with standard symbols. The failure case is a spare valve that looked identical to the original and behaved differently when the power went off.

## Decide the fail state first

Chapter 1's brief stated what the pusher must do when things go wrong: retract and stay retracted on loss of power, and not move unexpectedly when air returns. Those requirements choose the valve, not the other way round.

```figure
type: decision
title: Choosing the directional valve from the fail state
question: What must the pusher do when electrical power is lost?
caption: This is an illustration of the reasoning for the reject pusher. A different machine, such as a clamp that must keep holding a part, could need a different answer. ISO 4414 sets out general safety requirements for pneumatic systems that a designer should consult.
- *Return to a known position and stay there | the pusher, which must clear the belt | 5/2 valve, single solenoid, spring return
- Stay where it is, holding its last position | a clamp that must not release its part | 5/2 valve, double solenoid, which keeps its last position
- Stop and hold wherever it is | a vertical load that must not drop or rise | 5/3 valve, closed centre, with checks on the cylinder ports
- Stop and go slack, free to be moved by hand | a mechanism people must push clear in an emergency | 5/3 valve, exhaust centre
```

A **5/2** valve has five ports, one supply, two to the cylinder and two exhausts, and two positions. In one position it feeds the retract side of the cylinder and exhausts the extend side; in the other, the reverse. A **single-solenoid, spring-return** version, also called monostable, sits in its spring position whenever the solenoid is not powered. Wired so the spring position retracts the pusher, it retracts the pusher whenever the controller drops its output, whether because the reject is complete, the controller has stopped, or the power has failed.

## What happens when the air goes and comes back

If the air supply is lost while the pusher is retracted, nothing moves, because the valve still connects the retract side to the supply line, now empty. If the air is lost with the pusher extended, it stops where it is or drifts with whatever pushes it.

When the air comes back, the spring-return valve is in its rest position, so air flows to the retract side. A pusher that was retracted stays retracted. A pusher that was stopped part-way, or extended, retracts. That is a movement, and it happens the moment air returns, at whatever speed the flow controls allow. To keep it controlled, the station's air supply has a **soft-start valve** after its isolating valve, which lets pressure build slowly over a couple of seconds before opening fully, so any movement on restart is slow. Chapter 7 covers the isolating valve and what people must do before restoring air.

## Check the flow the valve must pass

The valve must let air in and out of the cylinder fast enough for the timing budget in Chapter 3. Each extend stroke uses about **1.02 litres** of free air for the cylinder itself, as Chapter 1 calculated, plus the air needed to fill the tube between valve and cylinder. Spread over the roughly 0.4 s the stroke takes, that is an average of about **160 L/min** of free air with a short tube. The flow at the start of the stroke, as the cylinder fills, is higher than the average.

Valve makers rate flow in different ways. ISO 6358-1 sets out a method of describing a component's flow characteristics by a sonic conductance and a critical pressure ratio, and many catalogues also quote a nominal flow in litres a minute under stated inlet pressure and pressure drop. The figures from different makers are only comparable if they are measured the same way, so the maintenance lead used one maker's sizing method throughout and chose a valve whose stated flow was about twice the average demand. That margin covers the higher flow at the start of each stroke and the pressure falling to 5 bar at busy times.

A valve that is too small slows the cylinder however the flow controls are set, because it becomes the narrowest point in the circuit. A valve that is far too large costs more, switches more slowly and wastes nothing but money. Matching the valve to the cylinder and the speed needed is the aim.

## Choose tubing and mount the valve close

The air between the valve and the cylinder is filled and exhausted on every stroke, and it adds to the time before the piston moves. The maintenance lead compared two layouts: the valve on a manifold in the line's control cabinet, about **1.5 m** of tube from the cylinder, or a single valve mounted on the conveyor frame beside the pusher, about **0.5 m** away. With 6 mm outside diameter tube, which has a 4 mm bore, each 1.5 m line holds about **0.019 litres** and each 0.5 m line about **0.006 litres**.

```figure
type: compare
title: Valve in the cabinet or valve beside the cylinder
cols: Valve in the control cabinet, 1.5 m tubes | Valve beside the pusher, 0.5 m tubes
caption: This is an illustration. Free air per cycle includes both tubes at 6 bar gauge. The shorter tubes matter mainly for response, not for running cost.
- Air volume in the two tubes | about 0.038 litres | about 0.013 litres
- Free air per cycle, cylinder and tubes | about 2.14 litres | about 1.96 litres
- Time for pressure to build before the piston moves | longer | shorter
- Protection of the valve | good, inside the cabinet | needs a protective cover and a rated enclosure for washdown
- Cable needed | short, inside the cabinet | a solenoid cable run to the conveyor
- *Choice for the reject pusher | no | yes, with a cover and a sealed connector
```

The air saved by the shorter tubes, about 0.17 litres a cycle, is worth very little in money, as the exercise shows. The reason for the choice is response: less volume to fill before the piston moves, and more consistent stroke times. Tubes were cut square, pushed fully into their fittings, run without tight bends and clipped clear of the belt, and the extend and retract lines were coloured differently so they could not be swapped during maintenance.

## Treat the exhaust air

Every stroke exhausts a litre or so of air through the valve's exhaust ports, with a sharp noise and, if the air carries any oil, a fine mist. Line 2 packs food, and people work beside it. The valve's exhaust ports were fitted with **silencers**, which reduce the noise, and the maintenance lead chose a type that also filters the exhaust. Because the factory's air is supplied without added lubricant, as Chapter 6 explains, and the valve and cylinder are designed to run on unlubricated air, the exhaust carries little oil. Any lubricant from the compressor that gets past the air treatment would still appear here, so the exhaust filters are part of the checks in Chapter 8.

A blocked silencer slows the stroke it exhausts, because the air cannot leave the cylinder. That is one of the reasons the controller logs stroke times.

## Treat the manual override with care

Most solenoid valves have a manual override: a small button or screw on the valve body that shifts the valve without power. It is useful during commissioning and fault-finding, because a technician can make the pusher move without the controller. It is also a way to move the machine that bypasses the controller, its sensors and any guard interlocks wired into the controller's outputs.

Overrides come in two kinds. A **momentary** override shifts the valve only while it is held down. A **locking** override can be pushed and turned to stay shifted, which is convenient and easy to forget. The maintenance lead specified a momentary override, under the valve's protective cover, so that using it needs a deliberate act and stops the moment it is released. The circuit drawing notes the override and the maintenance procedure says when it may be used: only with the guard closed, or with the station isolated and a second person present for fault-finding, as Chapter 7 describes.

## Monitor the supply pressure

Chapter 2 sized the cylinder for the lowest pressure measured, 5 bar. If the supply falls further, because the compressor fails or a large leak opens, the pusher will slow and eventually fail to reject in time. A **pressure switch** after the station's regulator signals the controller if the pressure falls below a set point, and the controller stops the line with an alarm.

The set point came from a trial. The maintenance lead lowered the regulator in steps and ran forced rejects at each. At 4.5 bar the pusher's longest cycle was **0.99 s**, just inside the 1.0 s budget, and its theoretical force about **221 N**, a load ratio of about 0.34. Below that, the cycle overran. The switch was set to trip at **4.5 bar**, so the line stops before the pusher stops working reliably.

## Draw the circuit with standard symbols

The finished circuit was drawn on one page using the graphical symbols of ISO 1219-1, which any trained technician can read. It shows, in order from the supply: the lockable isolating and dump valve, the soft-start valve, the filter and regulator with its gauge, the pressure switch, the 5/2 single-solenoid spring-return valve with its silencers, the two meter-out flow controls and the guided cylinder with its two position sensors. Each component is labelled with its function and the exact part number, including the valve's function code.

```figure
type: layers
title: The reject station's circuit, from supply to cylinder
caption: This is an illustration of the order of components. The drawing itself uses the standard ISO 1219-1 symbols and lists each part number.
- Lockable isolating and dump valve | shuts off the supply and exhausts the station's air
- Soft-start valve | lets pressure build slowly when air is restored
- Filter, regulator and gauge | set to 6 bar, with a pressure switch tripping at 4.5 bar
- 5/2 single-solenoid, spring-return valve | retracts the pusher whenever its solenoid is unpowered
- Meter-out flow controls with locking caps | set the extend and retract speeds
- *Guided cylinder, 25 mm bore, 300 mm stroke | with magnetic sensors at both ends and adjustable cushions
```

The drawing is kept in the machine's file, a copy is fixed inside the control cabinet door, and the store's spare-parts list refers to it. That last connection matters more than it might seem, as the failure case shows.

## A failure case: the spare that looked the same

This is an illustration. A year after commissioning, the reject valve's solenoid coil failed. The maintenance technician on night shift took a replacement from the store bin labelled with the valve's size and body style, fitted it and restarted the line. The pusher worked normally.

Two weeks later, a storm caused a brief power interruption while a reject was being pushed. When the power returned, the pusher stayed extended across the belt, instead of retracting. The line restarted automatically, cartons ran into the extended plate, and several split, spilling flour across the conveyor and the floor. Nobody was hurt, but the line was down for two hours for cleaning.

The replacement was a **double-solenoid** valve of the same body and size, kept in the same bin. A double-solenoid valve holds its last position when power is lost, which is exactly right for some machines and exactly wrong for this one. The store's labels listed sizes and bodies, not functions, and the technician had no reason to suspect the difference. The controller also had no check that refused to restart with the pusher extended.

The detection came from the incident itself. The correction had three parts. Store bins are now labelled with full part numbers and functions, and each machine's circuit drawing lists the exact part. The controller now refuses to restart the line unless the pusher's retracted sensor is on. And the line no longer restarts automatically after a power interruption: an operator must reset it after checking the line is clear, a change reviewed with the machinery safety adviser.

## How this applies to a small Australian business

Small factories often choose valves by size and fit, and stock spares the same way. Decide the fail state first, write it on the circuit drawing, and choose the valve function and actuation that deliver it. Remember that air returning is an event too, and use a soft-start valve so any movement it causes is slow. Size the valve for the flow the stroke needs, using one maker's method consistently. Mount the valve close to the cylinder for quick, consistent response. Silence and filter the exhaust where people work or food is handled. Fit a pressure switch set from a real trial. And label spares by function and part number, because two valves that look identical can make a machine behave in opposite ways.

## Exercise: tube length and the pressure switch

First, the shorter tubes save about **0.17 litres** of free air a cycle. The station makes about **192,000** cycles a year, as Chapter 5 shows. If compressed air costs about **A$0.035** per cubic metre of free air in electricity, what is the annual saving? Second, at what supply pressure would the 25 mm cylinder's load ratio reach 0.5 for the 75 N load, and why is the pressure switch set higher than that?

**Worked answer.** The annual saving is about **0.17 × 192,000 ≈ 33,400 litres**, or **33.4 m³**, worth about **33.4 × A$0.035 ≈ A$1.17** a year. Tube length is chosen for response, not running cost. For the second part, the theoretical force needed at a load ratio of 0.5 is 150 N, so the pressure is **150 ÷ 491 ≈ 0.31 MPa**, about **3.1 bar**. The switch is set at 4.5 bar because the limit that matters is the timing budget, not the force: the trial showed the cycle reaching 0.99 s at 4.5 bar. A pusher with enough force but too little speed still misses rejects.
