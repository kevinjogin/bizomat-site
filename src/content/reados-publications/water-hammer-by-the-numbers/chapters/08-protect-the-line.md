---
book: water-hammer-by-the-numbers
chapterSlug: protect-the-line
order: 8
title: "Protect the line: vessels, valves and inertia"
description: "Compare surge protection for the case's main, screen a surge vessel's gas volume, place air and feed valves at the high point, and see why a drive's soft stop is not protection."
draft: false
---

The earlier chapters found two problems on the case's main. A fast closure of the inlet valve pushes pressures above the PN16 rating, and a pump trip pulls the grade line below the high point, all the way to vapour pressure if the pump stops on its own inertia. The first was solved in Chapter 5 by a two-stage closure. The second needs equipment.

This chapter compares the main families of surge protection, then screens the two that suit the case best: a surge vessel at the pump station and a feed arrangement at the high point. It explains what each does physically, what it costs in maintenance and compliance, and where it fails. It ends with the commonest gap in surge protection: relying on a control function that does not work when the power is off.

## The protection families

All surge protection does one of three things: it slows the velocity change, it supplies or absorbs water so the grade line moves less, or it limits the pressure directly.

```figure
type: compare
title: Surge protection options for a pumped main
rowhead: Measure
cols: How it works | Protects against | Watch for
caption: General characteristics. The right choice depends on the profile, the events and the owner's ability to maintain the equipment.
- Slower or two-stage valve closure | spreads the velocity change over many pipe periods | upsurge from closures | fail-safe closures; settings changed later
- Flywheel on the pump | slows the rundown after a trip | downsurge and separation | motor starting load; impractical on large pumps
- * Surge vessel at the pump | gas cushion supplies water as the column slows | downsurge and separation | pressure vessel compliance; gas and level control
- Feed tank at the high point | supplies water through a check valve when the line falls below its level | local low pressure at a knee | needs a suitable site and refilling
- Air and vacuum valves | admit air to stop vapour pressure; release it later | separation at high points | air must leave slowly or it causes its own surge
- Relief or anticipating valves | open to dump water when pressure rises, or in advance of it | upsurge | wastes water; needs regular testing
- Changing the route or profile | moves the pipe away from the grade line | separation at knees and summits | only cheap at design stage
```

For the case's main, valve closure is already managed. The remaining problem is the pump trip: a downsurge that reaches vapour pressure from the pump to beyond the high point. A flywheel was screened in Chapter 6 and gave a thin result: about −4.7 m at the high point for an 8 s rundown, positive only at 15 s. That leaves a surge vessel or a high-point arrangement, or both.

## How a surge vessel works

A surge vessel is a pressure vessel connected to the main just downstream of the pump's check valve, holding water in its lower part and a cushion of compressed gas above. In normal running the gas sits at the pump's discharge pressure. When the pump trips, the check valve shuts and the main's grade line starts to fall. The gas expands and pushes water from the vessel into the main, so the column is decelerated gently by a slowly falling head instead of being stopped abruptly. When the column reverses, it flows back into the vessel and recompresses the gas.

It is Chapter 1's energy idea in hardware. The column's kinetic energy is stored in a soft gas spring rather than in the very stiff spring of compressed water and stretched steel, so the pressures swing far less.

## Screening the gas volume

The size of the gas cushion decides how far the head falls. A first screening can treat the water in the main as a rigid column, because the vessel at the pump end removes the sharp wave and the column decelerates over many pipe periods. Stepping through time, the column is decelerated by the difference between the vessel's head and the tank's head plus friction, while the vessel loses water at the rate the column takes it and its gas expands with a polytropic exponent, here 1.2 as a teaching value.

This is an illustration. Starting from steady flow, with the gas at the pump's 58 m discharge head, the screening gives the lowest vessel head for several initial gas volumes. With the column nearly stopped at that moment, the grade line runs roughly straight from the vessel to the tank, which gives the minimum pressure head at the high point.

```figure
type: bars
title: Minimum pressure head at the high point against initial gas volume
unit: m
max: 3
caption: This is an illustration from a rigid-column screening of the case's main with a surge vessel at the pump. Below about 0.4 m³ of gas the high point goes sub-atmospheric; 0.8 m³ gives about 1.5 m of positive head.
- 0.2 m³ gas | -2.1
- 0.4 m³ gas | -0.1
- 0.6 m³ gas | 0.9
- * 0.8 m³ gas | 1.5
- 1.0 m³ gas | 1.9
```

With 0.8 m³ of gas, the vessel's head falls from RL 158 m to about RL 134.4 m over roughly 20 s while the column stops, and the high point stays about 1.5 m above atmospheric. Chainage 750 m stays about 1.2 m above. The returning column refills the vessel without exceeding the original steady head in this screening, because friction absorbs the energy on the way back.

Larger vessels give diminishing returns: doubling the gas from 0.4 m³ to 0.8 m³ gains about 1.6 m at the high point; going on to 1.0 m³ gains only 0.4 m more. The total vessel volume must also hold enough water that it never empties, plus margin for level control, so a vessel with 0.8 m³ of gas might be about 1.2 to 1.5 m³ overall.

The polytropic exponent is itself uncertain. Gas that expands quickly cools and behaves closer to the adiabatic exponent of about 1.4 for air; gas that expands slowly, with time to exchange heat with the water and the vessel wall, behaves closer to 1.0. A higher exponent means the gas pressure falls faster as it expands, so the vessel needs more gas for the same protection. Running the screening at both ends of the range, and sizing for the worse one, is a sensible habit.

The screening is only a starting point. A surge study, as Chapter 10 describes, models the vessel with the real pump, the waves in the main, the vessel's connection losses, which matter a great deal, and the gas behaviour. It also checks the return phase, where too free a connection lets the column slam back into the vessel.

## The connection matters

A surge vessel is only as good as the pipe that joins it to the main. In the outflow phase, when the vessel is supplying the main, the connection should be as free as possible, so the vessel's head reaches the main without loss. In the return phase, when the column runs back, a free connection lets the water rush into the vessel and can overshoot, compressing the gas further than needed and sending an upsurge back up the main.

The usual answer is a connection with different resistance in each direction: a short, large-bore outflow path, and a return path through an orifice or a check valve with a throttled bypass. The surge study tunes the two resistances. A screening like the one above, which ignores the connection, describes an ideal that the hardware has to be designed to approach.

The vessel should also be connected downstream of the pump's check valve, as close as practical to it, so it supplies the main and not the pump. Isolation valves on the connection, needed for maintenance, must be locked open in service and their position checked during routine inspections, because a closed isolation valve turns a surge vessel into an ornament.

## Relief and anticipating valves

Pressure relief valves protect against upsurges by opening above a set pressure and dumping water. A spring-loaded relief valve can be too slow for a sharp water hammer front: by the time it opens, the peak has passed. Surge anticipating valves address this by opening on the low-pressure wave that precedes the high-pressure return after a pump trip, so they are already open when the upsurge arrives, and then close slowly.

On the case's main, the upsurge after a trip comes from the column returning against the closed check valve and from any rejoin of separated columns. A surge vessel handles the first; preventing separation handles the second. Relief and anticipating valves are more often used where a surge vessel is impractical, such as very large mains, or as a backstop. They discharge water, which must go somewhere safe, and they need regular testing to stay reliable.

## Living with a surge vessel

A surge vessel is pressure equipment. Its design is governed by AS 1210, and under the model WHS Regulations certain pressure vessel designs and items must be registered with the regulator, depending on the hazard level. The owner takes on inspection obligations for its life.

Two arrangements are common. An air vessel holds air in direct contact with the water; air slowly dissolves into the water, so a compressor and level controls are needed to keep the cushion at the right volume. A bladder vessel holds its gas inside a flexible bladder, precharged with nitrogen to a set pressure, and needs no compressor but does need its precharge checked. In both, the gas volume at the running pressure is what protects the main. A vessel that has slowly filled with water, because the compressor failed or the bladder lost its precharge, looks unchanged from outside and protects nothing.

## Protecting the high point directly

The case's problem is local: the high point and the flat section beyond it. Two devices can act there directly.

A **feed tank**, sometimes called a one-way surge tank, is a small open tank beside the main at the high point, with its water level a little above the pipe, connected to the main through a check valve. In normal running the main's pressure holds the check valve shut. When a trip pulls the main's grade line below the tank's water level, the check valve opens and the tank feeds water into the main, holding the grade line near its own level and preventing a cavity. A float valve or small pump refills it afterwards. It suits profiles like the case's, where the flat top is close to the delivery level, and it is not a pressure vessel.

**Air and vacuum valves** at the high point admit air when the pressure falls below atmospheric, so the pressure cannot reach vapour pressure. That prevents a vapour cavity, but replaces it with an air pocket. When the columns return, the air must be expelled. A large-orifice valve that lets the air rush out lets the columns meet at speed when the last of it goes, and the valve's float slams shut, causing a surge of its own. Valves with a restricted outflow, often called anti-slam or non-slam valves, release the air slowly and cushion the rejoining columns. Air valves need maintenance: a seized float or a blocked orifice disables them silently.

## Layers of protection

No single device is perfect, and each can fail silently: a vessel loses its gas, an air valve float seizes, a flywheel coupling is replaced without it. A robust scheme uses more than one measure for the governing event, each able to limit the damage if the other fails, and gives every measure a test that shows it still works. A scheme also needs an owner: someone responsible for knowing that the main depends on these devices, so that a well-meant change elsewhere does not remove one. The register of protection devices, with their design basis and test interval, belongs in the same file as the surge study.

## Choosing for the case

```figure
type: decision
title: Choosing pump-trip protection for the case's main
question: Can the high point be kept above atmospheric pressure after a power failure without relying on control power?
caption: This is an illustration of the case's decision. Every option must work with the power off.
- Flywheel alone | No | 8 s rundown leaves −4.7 m at the high point; 15 s is marginal and impractical
- * Surge vessel, about 0.8 m³ of gas | Yes, by screening | to be confirmed by surge study; owner accepts pressure vessel obligations
- Feed tank at the high point | Yes, locally | also protects chainage 750 m if sized for the flat section
- Air valves alone | Partly | prevents boiling but leaves an air pocket and a rejoin to manage
```

The case selects a bladder surge vessel at the pump station, subject to the surge study, with an anti-slam air and vacuum valve at the high point as a second line of defence. The feed tank was a close alternative; the site at the high point had no reliable water supply for refilling it.

## A failure case: protection that needs power

This is an illustration. A neighbouring station with a similar main is upgraded with a variable speed drive. The drive is programmed to ramp the pump down over 60 s, and the commissioning report notes that "with the soft stop, the surge vessel is no longer required". The vessel is isolated and later removed.

For two years, every normal stop is gentle and silent. Then a storm causes a power failure. The drive has no power, the pump coasts down in under a second, and the main separates at its knee. When the columns rejoin, a pipe joint near the knee pulls apart and the main is out of service for a week.

The error was a confusion between control and protection. A soft stop is a control function. It works only when the drive has power and is healthy. Surge protection must work in the worst event, which for a pumped main is almost always a power failure. The error was detected in the failure investigation, which compared the design event in the surge study, a power failure, with the event the drive protected against, a commanded stop. The correction was to reinstate the vessel and to add to the site's management-of-change procedure a rule that surge protection may only be removed after a surge study of the uncontrolled trip.

## Exercise: a vessel that has lost its gas

The case's surge vessel is found during an inspection with only 0.2 m³ of gas at running pressure instead of 0.8 m³, because its bladder precharge has leaked. Using the screening results in this chapter, what pressure head would the high point see after a power failure? What should the inspection procedure check to catch this?

**Answer.** With 0.2 m³ of gas, the screening gives about **−2.1 m** at the high point: sub-atmospheric, about 21 kPa of suction, and at chainage 750 m about −0.5 m. The protection has fallen to roughly the level of the flywheel option the case rejected, and the air valve at the high point would open on every trip.

The procedure should check the precharge pressure of a bladder vessel, or the water level and gas volume of an air vessel, at a set interval, record the result against the design value, and treat a shortfall as a failure of surge protection, not just a maintenance item. A vessel's appearance tells you nothing about its gas volume.
