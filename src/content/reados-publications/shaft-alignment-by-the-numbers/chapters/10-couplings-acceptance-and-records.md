---
book: shaft-alignment-by-the-numbers
chapterSlug: couplings-acceptance-and-records
order: 10
title: "Couplings, acceptance and records"
description: "How to check a flexible coupling's torque, speed, misalignment and key ratings, why its allowance is not an alignment tolerance, and how to accept, record and re-check alignment."
draft: false
---

The alignment is done; the job is not. The coupling that joins the shafts must suit the duty, the machine must be accepted against stated criteria, and the result must be recorded so that the next person can see what was done and whether anything has changed. This chapter closes the HW-3 installation: it checks the coupling with the KEVOS® flexible coupling selection tool, explains why the coupling's misalignment allowance is not an alignment tolerance, sets out the acceptance checks at commissioning, and describes the record that makes the next alignment faster and more reliable.

## Checking the coupling

A flexible coupling must carry the drive's torque with margin, survive its starting and peak torques, run at its speed, accept the misalignment and end float it will see, and fit its shafts with hubs and keys that carry the torque. The [flexible coupling selection tool](/tools/flexible-coupling-selection/) checks each of those against the coupling maker's ratings: the running torque from power and speed, the torque with the service factor against the nominal rating, the peak torque against the maximum rating, the speed, the combined misalignment as the sum of the angular, parallel and axial shares of their allowances, the bore against the largest bore, and the hub key's shear and crushing stresses.

For the HW-3, the motor's 55 kW at 1,480 rpm gives a running torque of 354.9 N·m. The pump is a steady centrifugal load, and the site's coupling standard uses a service factor of 1.5 for it and a peak of 2.5 times running torque for direct-on-line starting. The chosen coupling's catalogue lists a nominal torque of 600 N·m, a maximum of 1,200 N·m, a maximum speed of 4,000 rpm, allowances of 1° angular, 0.5 mm parallel and 2 mm axial, and a largest bore of 80 mm. The motor's 65 mm shaft carries an 18 × 11 mm key, engaged 90 mm in the hub. This is an illustration.

```figure
type: steps
title: The HW-3 coupling in the flexible coupling selection tool
caption: This is an illustration. 55 kW, 1,480 rpm, service factor 1.5, peak ratio 2.5; ratings 600 and 1,200 N·m, 4,000 rpm; misalignment entered as 0.03°, 0.1 mm parallel and 0.4 mm axial against 1°, 0.5 mm and 2 mm; 65 mm shaft, 80 mm largest bore; key 18 × 11 × 90 mm; allowable key stresses 60 MPa shear and 100 MPa crushing.
- Running torque | 354.9 N·m
- With service factor | 532.3 N·m against 600 N·m
- Peak torque | 887.2 N·m against 1,200 N·m
- Combined misalignment | 43% of the allowance
- Key shear and crushing | 10.1 MPa and 33.1 MPa
- * Verdict | COUPLING SUITABLE
```

The misalignment entered into the tool was not the HW-3's measured running alignment. It was the site's design allowance for the coupling over its life: an angle of 0.03°, a parallel offset of 0.1 mm, twice the alignment tolerance, to cover drift between checks, and 0.4 mm of axial movement from end float and thermal growth along the shafts. Even with those, the coupling uses only 43% of its combined allowance.

### The mistake: sized on running torque

The coupling first ordered for the HW-3 was one size smaller, with a nominal rating of 400 N·m. It had been picked from the catalogue's table by matching the motor's running torque of 355 N·m to the next rating up. Run through the selection tool, it failed at once: 532.3 N·m with the service factor against 400 N·m. The service factor exists because a coupling sees torque variations, starts and occasional overloads that the running torque does not show, and coupling makers base their ratings on its use. The order was changed before delivery.

## Allowance is not tolerance

The coupling maker's misalignment allowance and the site's alignment tolerance answer different questions, and confusing them is a common way to accept a poor alignment.

```figure
type: compare
title: The HW-3 coupling allowance against the site's alignment tolerance
cols: Coupling maker's allowance | Site's running tolerance | HW-3 as left, running
rowhead: Quantity
- Parallel offset | 0.5 mm | 0.05 mm | 0.018 mm
- Angularity | 1°, about 1.75 mm per 100 mm | 0.05 mm per 100 mm | 0.003 mm per 100 mm
- * Meaning | the coupling will survive | the machine's bearings and seals will have a long life | well within both
caption: This is an illustration. The allowance tells you what the coupling can tolerate; the tolerance tells you what the rest of the machine should be asked to tolerate. The alignment tolerance is ten times tighter in offset and about thirty-five times tighter in angle.
```

A coupling running at half its allowance may be in no danger, while the machine's bearings carry the reaction forces of Chapter 1 every revolution. That is why the site aligns to its own tolerance and uses the coupling's allowance only as a design limit for the coupling itself. Alignment standards such as ANSI/ASA S2.75 Part 1, and machine makers' instructions, are the sources for tolerances; coupling catalogues are not.

## Coupling types

Flexible couplings accept misalignment in different ways, and the way matters for both their allowance and the forces they put back on the machines.

```figure
type: compare
title: Common flexible coupling types
cols: How it flexes | Character | Typical concern
rowhead: Type
- * Jaw or elastomeric insert | rubber or polyurethane element compresses between jaws | forgiving, damps shocks | element wears or hardens with heat and misalignment
- Tyre or elastomeric sleeve | rubber element flexes in shear | very forgiving of misalignment | larger size for the torque; element ageing
- Disc | thin steel discs bend | no wear parts, stiff torsionally | discs fatigue if misalignment exceeds their allowance
- Grid | steel grid slides in tapered slots | high torque in a small size | needs lubrication; wear of grid and teeth
- Gear | crowned teeth slide in a sleeve | very high torque and speed | needs lubrication; friction forces grow with misalignment
caption: Values of allowable misalignment, stiffness and speed come from each maker's catalogue for each size. The HW-3 uses an elastomeric insert coupling.
```

Couplings that slide, such as gear and grid types, generate friction forces that resist misalignment and can push hard on the bearings, especially along the axis. Couplings that bend, such as disc and elastomeric types, push back in proportion to their stiffness. Either way, the machine sees less force when the alignment is better, which is why a coupling's generous allowance is no reason to accept a poor alignment.

## Hubs, keys and the bore fit

The coupling hubs must fit their shafts as the maker specifies, usually with a light interference or transition fit for the bore, a key of the standard size for the shaft, and a set screw over the key or a clamping feature to stop the hub moving along the shaft. A hub that is loose on its shaft can rock as it turns, which looks like misalignment in the vibration readings and wears the key and keyway. The HW-3's hubs were measured with a bore gauge and the shafts with a micrometer before fitting, and the fits recorded; the motor hub was heated to fit and pushed to its marked position so that the hub gap of Chapter 9 could be set accurately.

The key check in the selection tool covers the key's shear and crushing stresses at the design torque. It does not cover the shaft's own strength at the keyway, which is the motor maker's responsibility for the motor's shaft end, or the hub's strength, which is the coupling maker's.

## Guards

A rotating coupling is a hazard. Its guard must enclose it fully, be fixed so that it can only be removed with a tool, and leave enough clearance that it cannot touch the coupling as the machines warm and move. The HW-3's guard was refitted before the isolation was removed, and its fixings checked at the acceptance. Safe Work Australia's Code of Practice for plant sets out the duty to guard moving parts and the principles for guard design.

## Handing over

The installation is handed to the people who will run and maintain it with what they need to keep it aligned: the alignment record, the coupling maker's installation sheet with the hub gap and torque values, the bracket and its sag value, the shims used, a spare flexible element, and the re-check plan. The maintenance fitters who will do the three-month check took part in the final readings, so that they know the machine's baseline as well as the installers did.

## Acceptance at commissioning

The HW-3 is accepted when every item on its commissioning list is complete and recorded. The list draws together the checks of every earlier chapter.

```figure
type: checklist
title: HW-3 alignment acceptance
caption: The site's acceptance list, signed by the fitter and the supervisor. This is an illustration.
- x Foundation and base accepted; grout tap-tested (Chapter 2)
- x Soft foot within 0.05 mm at every foot, after the final moves (Chapter 3)
- x Pipe strain within 0.05 mm at the coupling for each flange (Chapter 4)
- x Final readings validated, sag-corrected, with a repeat set (Chapter 5)
- x Running offset 0.018 mm and angularity 0.003 mm per 100 mm, against 0.05 (Chapter 9)
- x Coupling selection checked; hub gap set; bolts and keys at torque
- x Guard refitted before isolation removed
- x Hot check after two hours: running offset 0.02 mm (Chapter 8)
- x Vibration and bearing temperatures recorded as the baseline
```

### Vibration as the final witness

The last item matters because vibration is how a machine reports on its alignment for the rest of its life. At commissioning, vibration is measured on each bearing housing of both machines, horizontally, vertically and axially, and on the block, and those readings become the baseline. ISO 20816-1 sets out the general framework for evaluating machine vibration, with further parts for particular machine types; the site's condition monitoring program uses it to set alarm levels for the HW-3. A later rise, especially at running speed and twice running speed with a strong axial component, prompts an alignment check before anything else.

## The record

An alignment record is short, and its value grows with every later check. The HW-3's record, filed with the machine's maintenance history, contains:

1. **Identification:** the machine train, the stationary and movable machines, the coupling type and size, and the date, names and instruments, with bracket sag values.
2. **Preparation:** soft foot readings for every foot before and after correction, pipe strain readings for each flange, and room and machine temperatures.
3. **Readings:** every set taken, as read and sag-corrected, with the validity check and the view direction.
4. **Calculation:** the tool results or plots, thermal targets and the sketch showing which machine sits higher cold.
5. **Moves:** shims under each foot before and after, horizontal moves made, and bolt positions in their holes.
6. **As left:** the final readings, the running offset and angularity against tolerance, and the hot check.
7. **Baseline:** vibration and bearing temperatures at commissioning.

Laser systems produce their own reports, often with more detail than a hand-written sheet. They belong in the same file, provided the report states the view direction, the sign convention, the targets entered and the tolerances it was judged against. A report that says only "within tolerance" is a signature, not a record.

## How often to check

Alignment does not stay fixed. Foundations settle in their first months, pipes and supports change, and machines are disturbed by maintenance. The HW-3 plan re-checks the alignment after three months of running, after any work that disconnects the coupling or the pipes, and whenever vibration trends or bearing temperatures suggest a change. Once the installation has settled, a yearly check during a planned shutdown is the site's routine. These intervals are the site's choice, labelled as illustrations; the right interval for a machine depends on its criticality, its history and what its condition monitoring shows.

A change found at a re-check is information. A small, one-off change after the first months is settling. A steady drift at every check points to a cause still acting, such as a foundation, a pipe support or a soft foot that has returned, and the record makes it possible to see it.

## Why alignments fail to last

Re-checks on many machines show the same few reasons an alignment that was good on the day has gone. Each has appeared in the HW-3 story, and each leaves a mark in a good record.

- **Soft foot left in place.** The machine was aligned on a foot that was pulled down by its bolt; vibration and temperature cycles let it creep. The as-left soft foot readings show whether this was checked.
- **Pipe strain.** A support was moved, a hanger removed, or a hot pipe pushes the pump when running but not when cold. The pipe strain readings and a hot check show it.
- **Foundation and grout.** Settlement, cracked grout or a loose baseplate let the machines move relative to each other. Tapping the grout and comparing base levels with the installation record show it.
- **Thermal targets missing or wrong.** The machine was aligned to zero cold, or with the target the wrong way, and has run out of line from the first day. The record's thermal sketch shows it at a glance.
- **Disturbance during maintenance.** A motor removed for repair and refitted without a full alignment, or a coupling replaced with a different type and gap. The maintenance history shows it.

None of these is solved by aligning more precisely. Each is solved by a measurement that was skipped, which is why the acceptance list includes them all, and why the record keeps the numbers rather than only a signature.

## What the book adds up to

The HW-3 alignment took a day and a half, most of it in preparation: the foundation, the soft foot, the pipes, the brackets. The moves themselves took a few hours. That proportion is typical, and it is the main lesson of the book. Two shafts end up in line, and stay there, when the machine sits squarely on a sound base with nothing pulling on it, when the readings are valid and corrected, when the targets allow for what will change as the machines warm, and when every move is checked by a fresh set of readings. Each of those is a measurement with a number, a tolerance and a record. This is an illustration.

The work is done on isolated, locked-out plant, and the final decision to return the machine to service rests with the people responsible for it under the site's procedures and the model WHS laws.

## Exercise: a heavier duty

The pasteuriser's maker later proposed running the HW-3 on a duty with frequent starts, for which the site's coupling standard calls for a service factor of 2.0. With the same motor, coupling and key, what do the coupling tool's torque and key checks give? Does the coupling still pass?

**Worked answer.** The running torque is unchanged at 354.9 N·m. With a service factor of 2.0, the design torque is 709.7 N·m, which exceeds the coupling's nominal 600 N·m: the tool reports COUPLING NOT SUITABLE. The peak torque, 2.5 × 354.9 = 887.2 N·m, still passes against 1,200 N·m.

The key force at the design torque would be 2 × 709,700 ÷ 65 = 21,838 N, giving a shear stress of 21,838 ÷ (18 × 90) = 13.5 MPa and a crushing stress of 21,838 ÷ (5.5 × 90) = 44.1 MPa, both within their allowables. The key is fine; the coupling's torque rating is not. The next size up, re-checked in the tool, would be needed, and the alignment's hub gap and bores re-checked for it. This is an illustration.
