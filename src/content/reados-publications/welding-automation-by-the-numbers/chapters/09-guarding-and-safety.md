---
book: welding-automation-by-the-numbers
chapterSlug: guarding-and-safety
order: 9
title: "Guarding and safety of the cell"
description: "List a welding robot cell's hazards, choose fences, interlocks, light curtains and screens, see how stopping time sets a safeguard's distance, size fume extraction, and keep people safe inside."
draft: false
---

A welding robot cell combines two sets of hazards: those of an industrial robot, a powerful arm that moves fast, without warning and without noticing anyone in its way, and those of arc welding, radiation, fume, heat, spatter, fire and electricity. Automation removes the welder from some of the welding hazards, which is one of its real benefits, but it adds the robot's, and it concentrates the welding hazards in one place for many hours a day. Guarding a cell well is a design task, governed by the robot safety standards and the work health and safety laws, and done by people competent in it. This chapter sets out the hazards, the safeguards used, the arithmetic of a safeguard's distance and of fume extraction, and the special care needed when people must be inside the cell.

## The hazards

```figure
type: checklist
title: Hazards of a robotic arc welding cell
caption: This is an illustration of the hazards the fabricator's risk assessment addressed. Each cell needs its own assessment, by competent people, under the robot safety standards and the work health and safety laws.
- x Robot motion | impact, crushing and trapping by the arm, torch and cables, at full speed and without warning
- x Positioner motion | trapping between the turning fixture and the guarding or the operator's station
- x Arc radiation | ultraviolet and intense visible light that burn eyes and skin at a distance
- x Fume and gases | welding fume concentrated where the robot welds for hours; shielding gas
- x Fire and spatter | sparks into dust, packaging and anti-spatter spray; hot parts
- x Electrical | welding circuit, high-voltage supplies and stored energy in the controller and drives
- x Manual handling and burns | loading heavy or hot parts many times a shift
- *? Noise and pressure | arc, torch cleaning station and compressed air; wire under tension at the torch
```

The robot's motion is the hazard that most distinguishes a cell from a welding bay. An industrial welding robot can move its torch at several metres a second, carries enough force to injure badly, and may move suddenly after a pause, as part of its program, when a person nearby believes it has stopped. The basic principle of guarding is therefore to keep people out of the robot's reach while it can move, and to stop it safely whenever someone must come in.

## Keeping people out

```figure
type: compare
title: Safeguards used on welding robot cells
cols: How it works | Typical use
caption: General description for teaching. The robot and safeguarding standards set how safeguards are selected, designed, positioned and validated; the integrator's design governs.
- Perimeter fence | fixed guarding round the robot's reach, high enough not to be reached over | the whole cell
- *Interlocked doors | a door switch or lock that stops the robot when opened | maintenance and programming access
- Light curtain | beams across an opening; breaking them stops the hazardous motion | loading stations
- Area scanner | laser scanner detecting people on the floor in a zone | larger cells; zone-based slowing or stopping
- Dividing screen on a positioner | a screen between the two stations that turns with the turntable | two-station cells; protects the loader from the arc and the robot
- Welding screens and curtains | opaque or tinted barriers to radiation and spatter | round the cell and between stations
```

Most cells use a combination: a fixed fence round the robot, interlocked doors for access, a light curtain or a safety-rated door at the loading station, and a dividing screen on the turntable of a two-station cell, so that the operator loading one station is separated from the robot and the arc at the other. The safeguards are connected to the robot's safety system, which is designed so that a fault in the safeguard leads to a stop rather than to continued motion.

## Distance and stopping time

A light curtain or scanner stops the robot when someone crosses it, but the robot does not stop instantly; it takes a short time to brake to a standstill. The safeguard must be far enough from the hazard that a person moving towards it cannot reach the robot before it has stopped.

```figure
type: formula
title: Minimum distance from a light curtain to the hazard
formula: minimum distance = approach speed × overall stopping time + an allowance for reaching through or over
caption: This is an illustration with assumed values only, for teaching the structure of the calculation. The safeguarding standards set the approach speeds, allowances and method to use, and the stopping time must be measured on the actual robot and safety system.
- Assumed approach speed of a person | 2,000 mm/s
- Overall stopping time | detection, safety system and robot braking, measured at 0.25 s
- Assumed reach-through allowance | 100 mm
step: distance covered while stopping = 2,000 × 0.25 = 500 mm
step: minimum distance ≈ 500 + 100 = 600 mm from the curtain to the nearest hazard
step: a slower-stopping robot needs a greater distance, or a different safeguard
```

The arithmetic shows why the stopping time must be measured, not assumed: a robot carrying a heavy torch at high speed may take longer to stop than its catalogue figure, and a safeguard placed for a shorter time would let a person reach it. The integrator measures stopping times during commissioning and positions the safeguards from the measured values.

## Teaching inside the cell

Teaching a program with a pendant often means the programmer is inside the fence, close to the robot, while it moves. The robot standards require special modes for this: reduced speed, motion only while an enabling device on the pendant is held in its middle position, which stops the robot if the programmer lets go or grips it in panic, and an emergency stop within reach. The programmer stays outside the robot's path where possible, and nobody else enters the cell while teaching is in progress. Offline programming, as Chapter 6 described, reduces the time people spend inside the cell, which is a safety benefit as well as a productivity one.

## Maintenance and lockout

Maintenance, tip changes, liner changes and clearing faults bring people into the cell. Routine tasks such as tip changes are designed to be done at a service position reached with the robot stopped and the door interlocked, ideally from outside the fence. Larger tasks need isolation: the robot's power and the welding power isolated and locked off by each person working, stored energy released, and the cell proved safe before entry. The fabricator's lockout procedure for the cell lists each energy source, the isolation point and the check that it is dead.

## Radiation

The arc's ultraviolet and visible light burn eyes and skin, and a robot welding for hours radiates a great deal of it. Opaque or tinted welding screens round the cell, and the dividing screen on the turntable, stop direct and reflected arc light reaching people nearby, including the operator at the loading station. Cells with windows for viewing use tinted filter panels. The operator does not watch the arc unprotected, however tempting it is to see the robot work, and visitors are kept behind the screens with filter glasses if they want to watch.

## Fume extraction

A robot welding continuously produces fume continuously, and in one place, so the cell needs extraction designed for it: an exhaust hood over the cell, extraction at the torch, or both.

```figure
type: formula
title: Airflow for an extraction hood over the cell
formula: airflow = face velocity across the opening × area of the opening
caption: This is an illustration with an assumed capture velocity of 0.5 m/s across a hood opening of 2.0 by 1.5 m. Extraction design depends on the fume rate, the cell's layout, cross draughts and the exposure standards; competent designers and measurements of exposure decide it.
- Hood opening | 2.0 × 1.5 = 3.0 m²
- Assumed face velocity | 0.5 m/s
step: airflow = 0.5 × 3.0 = 1.5 m³/s, about 5,400 m³/h
step: torch-mounted extraction captures fume at the source with far less air, but adds bulk to the torch
step: either way, the airflow must be measured at commissioning and checked at intervals
```

Torch extraction, which draws fume through a shroud round the torch nozzle, captures fume at its source with much less air, but makes the torch bulkier, which can limit access, and its suction must not disturb the shielding gas. Hoods are simpler but move a lot of air, which costs energy to move and, in winter, to heat. The fabricator's cell uses a hood with a filter unit returning cleaned air to the shop, and its exposure measurements after commissioning confirmed that operators' fume exposure was well below the workplace exposure standard. Safe Work Australia's model code for welding processes covers fume control.

## Fire

Spatter from a robot travels further and more often than a welder's, because the robot welds continuously and sometimes at higher currents. The cell's floor is kept clear of combustible material, packaging and dust; anti-spatter sprays are kept away from the arc; filters in the extraction system are protected from sparks with spark arrestors and cleaned on schedule, because a filter fire spreads quickly; and a suitable extinguisher is mounted at the cell where the operator can reach it without entering. A fire in an unattended cell, during a long run or overnight, is a serious risk, and cells that run unattended need fire detection.

## Collaborative robots

Collaborative robots are designed to work alongside people with limited force and speed, so that a contact with a person is unlikely to injure. For welding, that limit addresses only the arm's motion. The arc, the fume, the spatter, the radiation and the hot torch are as hazardous with a collaborative robot as with any other, and its torch can still injure an eye or burn skin even if the arm's force is limited. A collaborative welding robot therefore still needs a risk assessment, screens against radiation, fume extraction, and often a defined working zone that people stay out of while welding is under way.

## The welding circuit

The welding circuit in a cell carries hundreds of amps at low voltage, and the robot, positioner and fixtures are part of it. If the return path is poor, welding current can find its way through the robot's bearings, the positioner's gearbox, earth conductors and even the building's structure, damaging bearings and overheating cables that were never meant to carry it. The cell's design gives the welding current a dedicated, heavy return path from the fixture to the power source, insulates the torch mount from the robot arm, and keeps the welding return separate from the protective earth of the electrical supply. The supply side has its own hazards: the controller, drives and power source carry mains voltages and store energy, and only licensed electricians work inside them, under isolation.

## Loading by hand

Automation can move the strain of welding onto the person who loads the cell. An operator loading a two-station cell may lift, place and remove several hundred parts a shift, sometimes hot, sometimes sharp-edged, and always at the pace the robot sets. The fabricator's risk assessment looked at the weights lifted, the reach to the fixture, the height of the turntable and the frequency of lifts, and set the turntable at a working height that avoided stooping, kept heavy sub-assemblies on a lift assist, and rotated operators between the cell and other work during the shift. Gloves suitable for hot, sharp parts, and a cooling rack for welded parts so they are not handled hot, are part of the same plan.

## Noise

A robot cell is noisy in ways a manual bay is not: the torch cleaning station's reamer and air blast, compressed air blowing parts clean, the positioner's motion, and the arc itself running continuously. Levels near the cell should be measured, and if they approach the exposure standard, the noisiest sources quietened or enclosed, with hearing protection for the operator where needed. Moving the torch cleaning station to the side of the cell away from the loading station was one of the fabricator's simplest improvements.

## Validation and periodic testing

Safeguards are validated when the cell is commissioned and tested at intervals after: interlocks opened to check that they stop the robot, light curtains broken with a test piece at several points, emergency stops pressed, and stopping times re-measured after any change to the robot's program speeds, payload or safety settings. A fixture change that puts a hazard closer to a safeguard, or a new program that runs the arm faster near the loading station, can quietly invalidate the original validation. The fabricator's change procedure for the cell requires a safety review of every change that could affect the safeguards, signed off before production resumes.

## People and procedures

Guarding works only if people use it as it was intended to be used. Interlocks that are defeated because they slow the work, doors propped open, light curtains muted for convenience, and people climbing over fences to clear a fault are all common causes of serious robot accidents. The fabricator trained every operator and maintainer in the cell's hazards and procedures, made it easy to do things the safe way, with service positions reachable from outside the fence and fault recovery from the operator's station, and made defeating a safeguard a disciplinary matter. The safety system is tested at regular intervals, and every test and its result is recorded in the cell log.

## The running case: commissioning the cell

This is an illustration. The integrator designed the fabricator's cell with a fixed fence, an interlocked maintenance door, a two-station turntable with a dividing screen, a light curtain at the loading station, welding screens and a fume hood. At commissioning, the integrator measured the robot's stopping times and set the light curtain's distance from the measured values, tested every safeguard, and handed over the risk assessment, the validation records and the procedures. The fabricator's own staff were trained before production began, and the first month's safety audit found two problems, a gap under the fence where a forklift had bent it and a light curtain mounted a little too close after a fixture change, both fixed the same day.

## A failure: the fault cleared from inside

This is an illustration. At another fabricator, a robot stopped with its wire stuck to a part. The operator, under pressure to keep the cell running, opened the maintenance door, which stopped the robot, then reached in, cut the wire, and reset the cell from the panel beside the door while still half inside. The robot resumed its program and the torch struck the operator's shoulder, causing a serious injury.

The investigation found that the cell's reset could be pressed from inside the guarded area and that the procedure for clearing a stuck wire had never been written down. The fabricator moved the reset outside the fence, where the whole cell could be seen, wrote and trained the procedure, and added a stuck-wire routine that the operator could trigger from outside.

## Exercise: stopping time and distance

A robot's overall stopping time, measured at commissioning, is 0.35 seconds. Using the illustrative approach speed of 2,000 mm/s and reach-through allowance of 100 mm, what minimum distance is needed between the light curtain and the nearest hazard? If the layout allows only 600 mm, what must change?

The distance covered while stopping is 2,000 × 0.35 = **700 mm**, so the minimum distance is about 700 + 100 = **800 mm**.

With only 600 mm available, the light curtain would let a person reach the hazard before the robot stopped. Something must change: reduce the stopping time, for example by lowering the robot's speed near the loading station or using safety functions that slow it when someone approaches; move the hazard further from the curtain by changing the robot's path; or use a different safeguard, such as an interlocked door or a turntable with a dividing screen, that keeps people physically away while the robot moves. The real calculation must use the standard's values and the measured stopping time.
