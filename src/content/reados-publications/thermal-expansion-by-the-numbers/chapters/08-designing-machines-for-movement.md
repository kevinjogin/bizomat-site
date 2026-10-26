---
book: thermal-expansion-by-the-numbers
chapterSlug: designing-machines-for-movement
order: 8
title: "Designing machines for movement"
description: "Design machines that stay accurate and free as they warm: fixed and floating bearings, hot alignment of pumps and motors, warm-up drift, mixed materials and slotted fixings, each with its numbers."
draft: false
---

A machine is a collection of parts at different temperatures, made of different materials, held together at points chosen by its designer. As it runs, bearings warm, motors warm, process fluids heat casings, and the room warms through the day. Every part grows by its own amount. A well-designed machine lets that growth happen where it does no harm: one bearing locates the shaft and the other lets it slide, alignments are set cold so they come true when hot, covers are fixed so they can move. A poorly designed one fights itself, with bearings preloaded until they overheat, couplings misaligned until they wear, and accuracy wandering through the shift.

This chapter applies thermal expansion to machine design in HW-60's plant. It explains the fixed and floating bearing arrangement and what happens without it, calculates the hot alignment offset for the circulating pump and its motor, estimates warm-up drift in a machine tool, deals with mixed materials and slotted fixings, and summarises the habits that make machines tolerant of temperature. The failure case is a conveyor shaft fixed at both bearings, whose bearings overheated every afternoon.

## Fixed and floating bearings

A shaft supported in two bearings grows in length as it warms, and so does the housing or frame between the bearings, usually by a different amount, because they are at different temperatures or made of different materials. If both bearings locate the shaft axially, the difference has nowhere to go: the shaft is squeezed or stretched between them, and the bearings are loaded axially by forces they were not chosen for.

The standard arrangement is **one fixed bearing and one floating bearing**. The fixed bearing locates the shaft axially in both directions. The floating bearing supports it radially but lets it slide along its axis, either because its outer ring can slide in its housing bore, or because it is a type, such as a cylindrical roller bearing, that allows axial movement within itself. The shaft can then grow freely from the fixed end.

For a steel shaft **600 mm** between bearings, running **30 °C** warmer than when it was assembled, the growth is **12 × 10⁻⁶ × 600 × 30 ≈ 0.22 mm**. If the bearing housing between them is aluminium and warms by the same 30 °C, it grows by about **0.41 mm**, so the housing grows about **0.20 mm** more than the shaft. Either way, the floating bearing takes up a fraction of a millimetre of movement. Without it, the shaft and frame fight, with forces of the kind calculated in Chapter 3.

## Hot alignment of the pump and motor

HW-60's circulating pump is driven by an electric motor through a flexible coupling. The two shafts must be aligned so the coupling runs straight. They are aligned cold, at installation, but they run at different temperatures: the pump's stainless casing is heated by the 85 °C water it pumps, while the motor's frame runs warm from its own losses, at perhaps 40 °C. The pump's shaft centre rises as its casing grows upwards from its feet; the motor's rises much less.

```figure
type: formula
title: Thermal rise of the pump and motor shaft centres
formula: rise = α × height from feet to shaft centre × temperature rise
caption: This is an illustration. Pump casing stainless steel at 17.3 × 10⁻⁶ per °C, 150 mm from feet to shaft centre, warming from 20 °C to 85 °C; motor frame steel at 12 × 10⁻⁶, 132 mm, warming from 20 °C to 40 °C.
- Pump rise | 17.3 × 10⁻⁶ × 150 × 65 ≈ 0.169 mm
- Motor rise | 12 × 10⁻⁶ × 132 × 20 ≈ 0.032 mm
step: difference ≈ 0.169 − 0.032 ≈ 0.137 mm, the pump's shaft rising above the motor's
step: so set the motor about 0.14 mm high when cold, to be level when hot
```

Aligned perfectly cold, the pump's shaft would sit about **0.14 mm** above the motor's at operating temperature, enough to load the coupling and the bearings on both machines. The installer therefore sets a **cold offset**: the motor is shimmed about 0.14 mm higher than true alignment when cold, so that the pump rises to meet it as the system warms. The WORKOS [alignment thermal growth](/tools/alignment-thermal-growth/) calculator works out such offsets, and pump makers often state the expected thermal rise for their machines at given temperatures, which is better than an estimate.

The alignment is checked hot, after the system has run for some hours, with the coupling still in place or with a laser alignment tool, and the cold offset adjusted if needed. The hot reading is the one that matters.

## Warm-up drift in machine tools

Machine tools grow as their spindles, motors and slides warm, and the growth moves the cutting tool relative to the work. In HW-60's workshop, the milling machine's spindle head carries the spindle about **400 mm** below its column's guideways. As the head warms by about **8 °C** over the first hour of running, the steel between spindle and guideway grows by about **12 × 10⁻⁶ × 400 × 8 ≈ 0.038 mm**, moving the tool towards the table. On a part with a ±0.02 mm depth tolerance, that is the whole tolerance, consumed by temperature.

```figure
type: bars
title: Thermal movements in HW-60's plant and workshop, compared
unit: mm
max: 0.5
caption: This is an illustration from this chapter's examples. Each is small; each is larger than the tolerance or clearance it affects.
- Milling spindle drift, first hour | 0.038
- Pump above motor at temperature | 0.137
- Aluminium housing over steel shaft, 600 mm, 30 °C | 0.198
- Steel shaft between bearings, 600 mm, 30 °C | 0.216
- *Aluminium housing between bearings, 600 mm, 30 °C | 0.414
```

The workshop runs the spindle through a warm-up cycle before precision work, checks the tool's position against a reference after warm-up, and keeps the room's temperature as steady as it reasonably can. Larger machine tools have temperature sensors and compensate their positions automatically; the workshop's machine does not, so the warm-up routine does that job.

## Mixed materials and slotted fixings

Wherever two materials with different coefficients are fixed together over a length, the difference in their growth must be allowed for. HW-60's conveyor frames are stainless steel, and their guards include **PVC** panels about **1 m** long. Over a 30 °C temperature range, the PVC grows about **(70 − 12) × 10⁻⁶ × 1,000 × 30 ≈ 1.7 mm** more than a carbon steel frame would, and about 1.6 mm more than the stainless one. Screwed tightly through round holes at both ends, the panel bows or cracks at its fixings.

The answer is **one fixed point and slotted holes elsewhere**: the panel is fixed tightly at its centre, and its other fixings pass through slots long enough to let each end move by half the difference, about 0.9 mm each way here, with a margin, using shoulder screws or washers that clamp the panel lightly enough to let it slide. The same principle applies to long aluminium extrusions on steel frames, plastic covers on metal housings and composite panels on structures.

## Symmetry and centreline mounting

A part that grows symmetrically about the point that matters keeps that point still. Pumps for very hot fluids are often **centreline mounted**: their feet are at the height of the shaft centre rather than below the casing, so the casing grows up and down equally from the shaft and the shaft hardly rises at all. HW-60's pump, at 85 °C, is foot mounted, and the cold offset handles its modest rise, but at much higher temperatures centreline mounting avoids the problem rather than compensating for it. The same idea runs through precision machine design: place a fixed point at the feature that must not move, and arrange the structure so that growth is symmetrical about it.

## Clearances that close when hot

Running clearances, the small gaps between moving and stationary parts in pumps, seals, pistons, valves and slides, change with temperature when the parts are of different materials or at different temperatures. A clearance that is right when cold can close when hot and cause rubbing or seizure, or open and cause leakage and loss of accuracy. Designers set clearances for the operating condition, using the difference in growth of the two parts. A pump impeller running close to its casing wear ring, a piston in a cylinder of a different alloy, a shaft in a plain bearing: each has its clearance specified hot, with the cold value worked back from it, and fitters set it accordingly.

```figure
type: checklist
title: Habits for machines that tolerate temperature
caption: This is an illustration of the design and maintenance checks used for HW-60's plant. Each one appears earlier in this chapter or the book.
- One fixed and one floating bearing on every shaft, marked on the drawing | the failure case
- Cold alignment offsets calculated, set and checked hot | pump and motor
- Warm-up routine before precision machining | spindle drift
- Panels and extrusions of other materials fixed at one point, slotted elsewhere | PVC guards
- Running clearances specified at operating temperature | wear rings, pistons, slides
- ? Temperature sensors and trending on critical machines | bearing temperatures logged
- x Tightening every fixing hard, everywhere | the commonest way to stop a machine growing
```

## Measure the temperatures

Every calculation in this chapter depends on knowing how hot each part gets in service, and estimates are often poor. HW-60's maintenance team measured them: contact thermometer readings on the pump casing, the motor frame, the bearing housings and the machine tool's head, at start-up and after several hours of running, recorded on the machines' files. Those measured temperatures replaced the estimates in the alignment and clearance calculations. On the most critical machines, bearing temperatures are now logged continuously, and a rising trend is treated as an early warning of exactly the kind of restraint described in the failure case below.

## Long frames

The same thinking applies to whole machines. A stainless conveyor frame 20 m long, washed with hot water several times a shift, grows and shrinks by up to about 17 mm for a 50 °C swing during wash-downs. HW-60's longest conveyor is bolted down firmly at its drive end, where the motor and gearbox must stay aligned with the shaft they drive, and stands on slotted base plates along the rest of its length, so the frame can slide on its feet. The transfer points to the next conveyor are designed with enough overlap that a few millimetres of movement makes no difference. Fixing every foot hard to the floor would turn a harmless growth into bowed frames and loosened anchors, the conveyor equivalent of Chapter 3's restrained pipe.

## Bimetal strips: expansion put to work

Not every difference in expansion is a problem. A **bimetal strip**, two metals with different coefficients bonded along their length, bends when its temperature changes, because one side grows more than the other. The bending is predictable and repeatable, which is why bimetal strips have long been used in thermostats, thermal overload relays and simple dial thermometers. Their analysis, first set out in detail by Timoshenko in 1925, shows that the strip's curvature is proportional to the difference in the two metals' coefficients and the temperature change, and inversely proportional to the strip's thickness. The same physics that cracks a badly fixed PVC panel switches a heater off at a set temperature.

## A failure case: two fixed bearings

This is an illustration. A wash-down conveyor's drive shaft, about **600 mm** between two flanged ball bearing units bolted to its steel frame, was rebuilt by a contractor who fixed both bearings to the shaft with their locking collars tightened hard. Both bearings now located the shaft axially.

Each afternoon, after several hours of hot wash-downs warmed the shaft and bearings, the bearing units ran noticeably hot, and within weeks one began to growl. The shaft, warmed about **30 °C**, wanted to grow by about 0.22 mm and was prevented. Restrained fully, as Chapter 3 showed, a 40 mm steel shaft warmed by 30 °C would push with a force of the order of **90 kN**; in practice the frame, the bearing housings and the bearings themselves gave a little, but the bearings were carrying heavy axial loads they were never chosen for, and overheating.

The detection came from touch and sound, and a thermal camera that showed both bearing units far hotter than the motor. The correction was to free one bearing to float: its locking collar was released and the shaft allowed to slide through its inner ring, as the bearing unit's maker permits for that type, with the other bearing remaining the fixed one. The bearings ran cool afterwards, and the damaged unit was replaced. The maintenance instructions for the conveyor now mark which bearing is fixed and which floats.

## How this applies to a small Australian business

In any machine that warms in use, decide where each part is fixed and let it grow from there. Use one fixed and one floating bearing on every shaft, and mark which is which. Calculate the thermal rise of pumps, turbines and motors and set cold alignment offsets so they align hot, then check them hot. Expect machine tools to drift as they warm, and warm them up before precision work. Fix panels and extrusions of a different material at one point, with slotted holes elsewhere. And when a machine runs hot, noisy or inaccurate only after it has warmed up, look for something that has been prevented from growing.

## Exercise: a hotter pump

A different pump has a stainless casing **180 mm** from its feet to its shaft centre, handling water at **90 °C**. Its motor's frame is **160 mm** from feet to shaft centre and runs at **45 °C**. Both were aligned at 20 °C. What cold offset should the motor be given?

**Worked answer.** The pump rises **17.3 × 10⁻⁶ × 180 × 70 ≈ 0.218 mm**. The motor rises **12 × 10⁻⁶ × 160 × 25 ≈ 0.048 mm**. The pump's shaft ends up about **0.17 mm** above the motor's, so the motor should be set about **0.17 mm high** when cold. The offset should then be checked with the system at temperature, because the pump casing's real temperature distribution, and its maker's data, can differ from this estimate.
