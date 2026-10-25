---
book: printed-mechanisms-that-run
chapterSlug: index-with-a-geneva-drive
order: 6
title: "Index with a Geneva drive"
description: "Size a six-slot Geneva mechanism, calculate its motion and dwell, set the centre distance and locking clearance that decide station accuracy, and print it to last."
draft: false
---

A Geneva mechanism turns continuous rotation into intermittent steps. A pin on a continuously turning driver enters a slot in a slotted wheel, turns the wheel through a fixed angle, leaves the slot and then holds the wheel still while the driver completes its revolution. The mechanism is old, simple and robust, and it suits a printed indexing table well: it needs no sensor to find each station, it locks the dial during the dwell, and it tolerates some backlash in the gears driving it.

This chapter sizes the table's six-slot Geneva, works out its motion, shows which dimensions decide how accurately the dial stops, and deals with the details that make a printed Geneva last.

## See how the parts work together

The driver carries two features: a pin on a crank arm, and a locking disc, a raised circular boss with a cut-out. The Geneva wheel carries one radial slot for each station and, between the slots, concave arcs that match the locking disc.

While the pin is in a slot, it drives the wheel round. While the pin is out of the slots, the locking disc's circular edge sits in one of the wheel's concave arcs, and the wheel cannot turn. The cut-out in the locking disc lets the wheel rotate past during the drive phase. Nothing else is needed to hold the dial at each station.

```figure
type: svg
title: A six-slot Geneva at the start of an index
alt: A driver on the left with a crank and pin, and a locking disc with a cut-out. A six-slotted wheel on the right. The pin is entering a slot at right angles to it, and the line of centres between driver and wheel is 60 millimetres long. The crank radius is 30 millimetres.
caption: This is an illustration. For the pin to enter smoothly, the crank must be at right angles to the slot at the moment of entry, which fixes the crank radius for a given centre distance.
viewbox: 0 0 640 320
body:
<path class="cl" d="M60 150H500"/>
<circle class="bx" cx="330" cy="150" r="136"/>
<path class="bxi" d="M261.0 119.4 L208.2 88.9 L216.2 75.1 L269.0 105.6 Z"/>
<path class="bxi" d="M322.0 75.0 L322.0 14.0 L338.0 14.0 L338.0 75.0 Z"/>
<path class="bxi" d="M391.0 105.6 L443.8 75.1 L451.8 88.9 L399.0 119.4 Z"/>
<path class="bxi" d="M399.0 180.6 L451.8 211.1 L443.8 224.9 L391.0 194.4 Z"/>
<path class="bxi" d="M338.0 225.0 L338.0 286.0 L322.0 286.0 L322.0 225.0 Z"/>
<path class="bxi" d="M269.0 194.4 L216.2 224.9 L208.2 211.1 L261.0 180.6 Z"/>
<circle class="fi" cx="330" cy="150" r="5"/>
<circle class="bxa" cx="180" cy="150" r="50"/>
<circle class="fi" cx="180" cy="150" r="5"/>
<path class="la draw" pathLength="1" d="M180 150L217.5 85"/>
<circle class="fa pulse" cx="217.5" cy="85" r="7.5"/>
<path class="lf" d="M180 300H330 M180 294V306 M330 294V306"/>
<text class="tx txs" x="196" y="318">centre distance 60 mm</text>
<text class="txa" x="96" y="78">crank 30 mm</text>
<text class="txb" x="60" y="216">driver and</text>
<text class="txb" x="60" y="236">locking disc</text>
<text class="txb" x="480" y="40">Geneva wheel,</text>
<text class="txb" x="480" y="60">6 slots</text>
```

## Size the geometry from the centre distance

For an n-slot Geneva, the wheel turns 360° ÷ n per index. Smooth entry needs the pin to move straight into the slot, with no sideways component, at the moment it enters. That happens when the crank arm is at right angles to the slot. Two simple relations follow from that right angle, using the centre distance C between driver and wheel.

```figure
type: formula
title: Geneva geometry for six slots and a 60 mm centre distance
formula: a = C × sin(180° ÷ n); b = C × cos(180° ÷ n)
caption: This is an illustration. The crank radius and the slot's start radius on the wheel are fixed by the centre distance and the number of slots.
- a | crank radius, driver centre to pin centre, mm
- b | distance from wheel centre to the pin at entry, mm
- C | centre distance, 60 mm
- n | number of slots, 6
step: a = 60 × sin 30° = 30 mm
step: b = 60 × cos 30° ≈ 51.96 mm
step: Shortest slot that still reaches the pin's deepest point: a + b − C ≈ 21.96 mm; designed 24 mm
```

The slot must be long enough for the pin to reach its innermost position, which happens when the pin crosses the line of centres, at a distance C − a = 30 mm from the wheel's centre. The slot therefore runs from the wheel's rim, at about 51.96 mm plus a little, inwards to at least 30 mm from the centre. That is about 21.96 mm of slot, and the designer made it 24 mm to leave clearance at the bottom.

The [Geneva mechanism](/tools/geneva-mechanism/) tool in WORKOS computes the same geometry for other slot counts and centre distances.

## Work out the motion and dwell

During each index, the driver turns through 180° − 360° ÷ n. For six slots, that is **180° − 60° = 120°**. For the other 240° of each driver revolution, the wheel is locked.

This is an illustration. The planetary stage from Chapter 5 turns the driver at about 10 rpm when the motor runs at its rated 50 rpm. One driver revolution takes **60 ÷ 10 = 6 s**. The index occupies a third of that, **2 s**, and the dwell two thirds, **4 s**. The dial makes ten 60° steps a minute, meeting the requirement from Chapter 1.

```figure
type: stats
title: Motion of the six-slot Geneva at a 10 rpm driver speed
caption: This is an illustration. The dwell fraction is fixed by the number of slots; speed sets only how long each phase lasts.
- *6 s | Driver revolution | at 10 rpm
- 2 s | Index, wheel moving | 120° of driver rotation
- 4 s | Dwell, wheel locked | 240° of driver rotation
- 10 per minute | Index rate | 60° per index
```

The dwell fraction is a property of the slot count, not the speed. A slower driver gives a longer dwell, but always two thirds of the cycle for six slots. If a station needs more dwell than that, the controller in Chapter 8 can pause the motor during the dwell.

## Know the speed and acceleration of the dial

The dial does not move at a steady speed during the index. It starts from rest, speeds up to a peak at mid-index, when the pin crosses the line of centres, and slows again. At the peak, the ratio of dial speed to driver speed is λ ÷ (1 − λ), where λ = a ÷ C.

This is an illustration. For six slots, λ = 30 ÷ 60 = 0.5, so the peak ratio is **0.5 ÷ 0.5 = 1**. At mid-index, the dial turns as fast as the driver, about 10 rpm or 1.047 rad/s. A station puck 55 mm from the dial's centre moves at about 58 mm/s at that instant; the dial rim, at 70 mm, at about 73 mm/s.

Acceleration matters for anything sitting loose on the dial. Calculated numerically from the Geneva's kinematic equation, the six-slot wheel's peak angular acceleration is about **1.35 times the square of the driver's angular speed**, reached about 23° before and after mid-index. At 1.047 rad/s, that is about 1.48 rad/s². The dial and pucks have an estimated moment of inertia of about 0.00039 kg·m², so the torque needed to accelerate them is only about 0.0006 N·m. At this speed, inertia is negligible compared with friction, and a puck resting loosely on the dial will not slide.

There is one detail that inertia does not capture. At the instant the pin enters the slot, the wheel's acceleration jumps from zero to about 0.58 times the square of the driver speed, because the wheel goes from locked to driven in an instant. That sudden change is what makes a Geneva click at the start of each index. It is harmless at 10 rpm, but it grows with the square of speed, which is why the faster table in Chapter 1's exercise needed a closer look.

## Set the centre distance and keep it

The right-angle entry depends on the actual centre distance matching the crank radius. If the driver and wheel end up a little too far apart or too close together, the pin no longer enters straight down the slot. It strikes the slot's side at entry, which makes a sharper click, raises the current momentarily and wears the slot mouth.

Printed parts cannot be relied on to hold a 60 mm centre distance to a tenth of a millimetre between two separately printed plates. Chapter 3 introduced the solution: the motor mount that carries the driver is fastened through short slots, and an alignment tool sets the distance before the screws are tightened.

This is an illustration. The alignment tool is a printed bar with an 8 mm hole at each end, 60.0 mm apart, which slips over the driver shaft and the wheel shaft at the same time. With the tool in place, the motor mount screws are tightened, and the tool is removed. On the first assembled table, measured with calipers across the shafts, the centre distance came out at 60.6 mm before the tool was introduced, and the motor current showed a brief spike to about 0.55 A at each pin entry. With the alignment tool, the centre distance measured 60.0 mm and the entry spike fell to about 0.38 A, barely above the running current.

## Set the locking clearance for station accuracy

The dial's position during the dwell is held by the locking disc in the wheel's concave arc. Some clearance between the two is needed, or the disc will bind as the driver turns. That clearance lets the wheel rock slightly, and the rocking is the main limit on how accurately each station stops.

This is an illustration. The locking arcs touch the disc roughly 35 mm from the wheel's centre. A radial clearance of 0.3 mm at that point allows the wheel to rotate by roughly 0.3 ÷ 35 radians, about **±0.49°**, almost the whole ±0.5° station requirement from Chapter 1. Halving the clearance to 0.15 mm cuts the rocking to about **±0.25°**.

```figure
type: compare
title: Locking clearance and station accuracy
cols: Estimated rocking | Measured station spread | Running
caption: This is an illustration. Measured with a dial indicator at the 55 mm station radius over 30 indexes at each setting.
- 0.30 mm clearance | about ±0.49° | ±0.42° | Free
- *0.15 mm clearance | about ±0.25° | ±0.22° | Free after a short run-in
- 0.05 mm clearance | about ±0.08° | not measured | Bound at two stations
```

The designer chose 0.15 mm. The measured spread, ±0.22° or about ±0.21 mm at the station radius, sits comfortably within the requirement. The 0.05 mm attempt bound at two stations, because the wheel's printed arcs were not all exactly the same radius; that is the practical limit of printed accuracy at this size.

The clearance is set in the CAD model as a named parameter, alongside the fit offsets from Chapter 3, so a future reprint in a different material can be retuned with one value.

## Fix the dial to the wheel without losing the timing

The Geneva wheel sets the dial's stopping positions, but the stations are on the dial. The two must be joined so that each station sits exactly where the wheel stops, and stays there.

This is an illustration. The wheel and the dial share the 8 mm dial shaft, each with a D-flat bore and a grub screw as Chapter 4 described. That joint carries the torque but does not by itself set the angular relationship between them, because the flat could be ground anywhere around the shaft. The designer added two features. A printed key on the underside of the dial engages a notch in the top of the wheel, so the dial can only be fitted in one of six positions, each aligned with a station. And station 1 is marked on both the dial and the frame, so the builder can confirm that station 1 stops at the frame mark after assembly.

Without the key, a builder could fit the dial a few degrees off, and every station would stop consistently in the wrong place. The Geneva would be working perfectly, and the table would fail its position test. Keys and marks of this kind cost nothing to print and remove a whole class of assembly errors, which Chapter 9 relies on.

## Check the drive torque the Geneva needs

A useful check is to compare the torque the Geneva needs with what the gearbox delivers. Inertia, as calculated above, needs only about 0.0006 N·m. Friction in the dial bearings, the pin sliding in the slot and any drag from station fixtures dominate, and they are easier to measure than to calculate.

This is an illustration. With the motor disconnected, a spring scale on a 100 mm lever clamped to the driver shaft measured the torque needed to drive the dial through a full index. It peaked at about 0.05 N·m near the start of the index, when the pin works hardest against the wheel's friction, and fell to about 0.02 N·m during the dwell. The gearbox delivers about 0.675 N·m at rated torque, more than ten times the measured need. That margin is welcome on a printed mechanism, because friction will rise as parts wear, gather dust or meet a student's fingers, and because the controller in Chapter 8 can then run the motor at reduced power for quieter operation.

## Print the Geneva to last

The Geneva's slot and pin carry the mechanism's highest local loads and slide against each other at every index. A few design choices make a printed wheel last.

- **Steel pin.** As decided in Chapter 1, the pin is a 6 mm steel dowel pressed into the crank, not a printed feature.
- **PETG wheel, printed flat.** The slot walls carry the pin load in the layer plane, the strong direction from Chapter 2.
- **Slot width from the coupons.** The slot uses the running-fit approach from Chapter 3: designed at 6.4 mm, it printed at about 6.23 mm, giving about 0.23 mm clearance on the pin.
- **Rounded slot mouths.** The edges where the pin enters each slot have a 1 mm radius, so a slightly mistimed entry rolls in rather than chipping a sharp corner.
- **Light lubrication.** A little dry PTFE lubricant on the slot walls reduces wear and noise.

## Detect a Geneva failure

This is an illustration. The first wheel was printed in PLA with sharp slot mouths, before the alignment tool existed. After about two hours of running, the mouths of three slots had small chips missing, and the clicking at entry had become noticeably louder. Under a magnifier, each chip sat on the side of the slot that the pin struck first.

The pattern pointed straight at the misaligned centre distance: the pin was hitting the slot side at entry rather than sliding straight in. The fixes were the alignment tool, the 1 mm mouth radius and a PETG wheel. A replacement wheel ran for the full soak test in Chapter 9 with only light polishing visible on the slot walls.

## Exercise: compare a four-slot Geneva

A colleague suggests a four-slot Geneva with the same 60 mm centre distance, giving four stations. Calculate the crank radius, the motion fraction and the peak speed ratio, and comment on what changes.

**Worked answer.** For four slots, a = 60 × sin 45° ≈ **42.43 mm**, and b is the same, about 42.43 mm. The driver turns 180° − 90° = **90°** per index, so the index takes a quarter of each revolution and the dwell three quarters.

With λ = 42.43 ÷ 60 ≈ 0.707, the peak speed ratio is 0.707 ÷ (1 − 0.707) ≈ **2.41**. At mid-index the dial moves about 2.4 times faster than the driver, compared with exactly 1 for six slots. Calculated the same way as before, the peak angular acceleration rises to about 5.4 times the square of the driver speed, four times the six-slot value, and the jump at entry rises to about 1.0 times the square of the driver speed.

The four-slot mechanism gives a longer dwell fraction but a much harsher index. On a printed mechanism, that means more shock on the pin and slot and more chance of a loose puck sliding. The six-slot design is the gentler choice for this table.
