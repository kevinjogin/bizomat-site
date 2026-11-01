---
book: shaft-alignment-by-the-numbers
chapterSlug: pipe-strain
order: 4
title: "Pipe strain"
description: "How connected pipes pull a pump out of alignment, how to support pipe weight and absorb thermal growth so the pump carries neither, and how to measure pipe strain at the coupling."
draft: false
---

A pump is joined to the rest of the plant by pipes, and pipes are heavy, stiff and, when they carry hot water, constantly changing length. If they are not supported and guided properly, they push and pull on the pump's suction and discharge flanges. The pump casing and its feet move, the shaft moves with them, and an alignment done before the pipes were connected is wrong as soon as they are. Pipe strain is one of the most common reasons for an alignment that does not last and for pumps that wear out their bearings and seals early.

This chapter covers the three sources of pipe strain on the HW-3: the weight of the pipes, their thermal growth, and flanges forced together that were never quite in line. It uses the WORKOS pipe support span and pipe run expansion tools to check the supports and the expansion leg, and shows how dial indicators on the coupling measure what the pipes are doing to the alignment.

## Where pipe forces come from

```figure
type: compare
title: Sources of pipe strain at a pump
cols: Cause | When it acts | Remedy
rowhead: Source
- Weight | pipe, water, valves and insulation hanging on the flange | always | a support close to the pump that carries the weight
- * Thermal growth | a hot pipe run lengthening against the pump | at working temperature | a bend or loop that flexes, and anchors that take the force
- Forced fit-up | flanges pulled together across a gap or an angle | from the moment the bolts are tightened | make the pipe fit the pump, not the reverse
- Pressure | thrust at bends and reducers | under pressure | thrust restraint or anchors in the pipework
caption: The pump's maker states the forces and moments its flanges may carry. A well-designed system keeps the actual loads well inside those limits, and lets the pump sit on its base as if no pipes were attached.
```

Pump makers publish allowable nozzle loads, and piping codes and industry practices describe how to design supports so that they are not exceeded. The aim for alignment is stricter than the nozzle allowance: the pipes should not move the shaft by more than a small fraction of the alignment tolerance.

## Carrying the weight

The HW-3's discharge pipe is DN100 steel, 114.3 mm outside diameter with a 6.02 mm wall, full of water at 85 °C, with 5 kg/m of insulation and cladding. As first drawn, its first support after the pump was 4.5 m away, beyond the discharge valve. This is an illustration.

The [pipe support span tool](/tools/pipe-support-span-check/) checks the span between supports: the pipe's section properties, its weight per metre with contents and insulation, the bending moment, stress and sag for the chosen end conditions, and the longest span that keeps stress and sag within the user's limits.

```figure
type: steps
title: The HW-3 discharge pipe's first span in the pipe support span tool
caption: This is an illustration. 114.3 × 6.02 mm steel, water at 970 kg/m³, insulation 5 kg/m, span treated as fixed at one end and supported at the other, 4,500 mm, allowable bending stress 60 MPa, largest sag 2.5 mm.
- Section | area 2,047.8 mm², I = 3,010,519 mm⁴, Z = 52,678 mm³
- Weight per metre | 29.04 kg/m
- Bending moment | 0.7209 kN·m
- Bending stress and sag | 13.7 MPa; 1.05 mm: SPAN ADEQUATE
- * Longest span | 9,422 mm by stress, 5,589 mm by sag
```

By the pipe's own standards, the 4.5 m span is fine. But the fixed end of that span is the pump's discharge flange. A span fixed at one end and supported at the other puts five-eighths of its weight on the fixed end, so the flange would carry about 0.80 kN of the span's 1.28 kN, plus the weight of the valve, which the tool's checks flag: "put a support next to valves, flanged fittings and changes of direction". The pipe does not mind; the pump does.

The fix is to move the weight off the pump: an adjustable support directly under the discharge valve, set so that the pipe's weight sits on it and not on the flange. The suction side got the same treatment. The span tool then confirmed the remaining spans, all under 3 m, with stresses and sags far inside the limits.

### Weight in numbers

It helps to see the weights involved. The HW-3's discharge valve, a DN100 flanged gate valve, weighs of the order of 40 kg, about 0.4 kN, and a water-filled DN100 pipe weighs 29 kg per metre. A pump flange that carries a valve and the end of a 4.5 m span is holding over a kilonewton, much of it as a moment about the flange. Moving that load to a stand a few hundred millimetres away costs very little and takes it off the pump completely. This is an illustration.

## Absorbing thermal growth

The discharge runs 12 m from an anchor at the header to the pump, and turns down to the pump through a single L-bend. At 85 °C, 65 K above the installation temperature, a straight steel run that long grows by 12 × 1,000 × 12 × 10⁻⁶ × 65 = 9.36 mm. That growth must go somewhere. If the run were fully restrained, its stress would be about 156 MPa and its force on the anchors about 319 kN; no pump flange could resist it, and the pump would move instead.

The [pipe run expansion tool](/tools/pipe-run-expansion-check/) checks how a bend or loop takes the growth. It calculates the growth, the restrained stress and force for comparison, the displacement the leg of the bend must take, the leg length needed for an allowable bending stress range, and, for the leg length available, the leg's bending stress and the force it puts on its anchors by the guided cantilever method.

```figure
type: compare
title: The HW-3 discharge L-bend in the pipe run expansion tool
cols: Leg bending stress, MPa | Force from the leg, kN | Tool verdict
rowhead: Leg length available
- As drawn, 1,500 mm | 285.3 | 20.04 | LOOP NOT ADEQUATE
- 3,000 mm | 71.3 | 2.50 | LOOP NOT ADEQUATE: force over 2 kN
- * 4,000 mm | 40.1 | 1.06 | LOOP ADEQUATE
caption: This is an illustration. 12 m run, steel 12 µm/(m·K), 20 °C to 85 °C, 114.3 × 6.02 mm, E = 200 GPa, L-bend, allowable stress range 150 MPa, allowable force 2 kN, set from the pump maker's nozzle allowance with a margin for the alignment. The leg needed for stress alone is 2,069 mm.
```

The leg as drawn was far too short and too stiff: it would have pushed on the pump with about 20 kN as the pipe warmed. The redesign added a horizontal offset at the header end of the run, giving a 4,000 mm leg, and the force fell to about 1 kN. The tool's checks also point out that its guided-cantilever estimate is conservative for stress and only an estimate for force, and that a flexibility analysis to the piping code confirms the design; the plant's piping engineer did that.

### Hot pipe strain can only be seen hot

A pipe that strains the pump only when it is hot cannot be found by a cold check. The cold alignment can be perfect and the running alignment poor. Chapter 8 covers how to measure or allow for the change between cold and running conditions; pipe growth is one of its causes, alongside the machines' own growth.

## Fit-up: make the pipe fit the pump

The most common cause of pipe strain is the simplest: the last piece of pipe does not quite meet the pump's flange, and the fitter pulls it into place with the flange bolts. The gap or angle closes, and the force needed to close it is now held permanently by the pump.

Good practice is the reverse. The pump is set and aligned first, with no pipes attached. The pipes are then built towards it, and the final spool is made to fit the gap that is actually there, with the flanges meeting parallel and concentric without force. Industry installation practices such as API RP 686 describe this in detail. On the HW-3, the discharge spool was fitted last, with its flange faces checked for parallel gap with feelers before the bolts went in.

## Measuring pipe strain at the coupling

The test for pipe strain uses the alignment indicators. With the pump and motor aligned and all bolts tight, indicators are set up on the coupling to read the motor shaft's position relative to the pump shaft, vertically and horizontally, and zeroed. Then the bolts of one pipe flange are loosened. If the pipe is applying a force to the pump, the pump shifts as the flange is released, and the indicators show it. The bolts are retightened and the other flange tested. The HW-3 site's limit is 0.05 mm of movement at the coupling; that is its working figure, labelled as an illustration.

```figure
type: compare
title: HW-3 pipe strain check at the coupling
cols: Vertical movement, mm | Horizontal movement, mm | Against 0.05 mm
rowhead: Flange released
- * Suction, first check | 0.18 | 0.07 | fail
- Discharge, first check | 0.02 | 0.01 | pass
- Suction, after the spool was re-made | 0.03 | 0.02 | pass
caption: This is an illustration. Dial indicators on the coupling, zeroed with all flanges bolted; movement read as each flange's bolts are loosened.
```

Isolation applies here too. Loosening flange bolts on a pipe connected to a live system is only done with the pump's isolating valves closed, the lines drained and depressurised, and the water allowed to cool; the HW-3's loop runs at 85 °C, hot enough to scald.

### The mistake: a suction spool pulled into place

The suction check failed badly: 0.18 mm vertically and 0.07 mm sideways when the suction flange was released. With the bolts out, the flanges sprang apart, leaving a 3 mm gap at the top and an offset of about 2 mm. The suction spool had been made to the drawing dimensions, but the pump's final position, after alignment, was a few millimetres from the drawing, and the fitter had closed the difference with the flange bolts. The supports had then been adjusted to hold the pipe where the bolts had pulled it.

The spool was re-made to the measured gap, the supports reset to carry the pipe's weight with the flange bolts loose, and the flange bolted up without force. The re-test showed 0.03 mm vertically and 0.02 mm horizontally. Because the suction strain had been pulling the pump, the alignment was re-measured afterwards: the vertical offset at the coupling had changed by 0.05 mm, and that new state, not the one before the pipe work, became the starting point for the moves in Chapter 9.

```figure
type: checklist
title: Pipe work around the HW-3
caption: The site's sequence and checks. This is an illustration.
- x Pump and motor set, soft foot corrected and roughly aligned before any pipe is connected
- x Supports next to the pump carry the pipe and valve weight with flange bolts loose
- x Thermal growth taken by bends or loops, checked against the pump maker's nozzle allowance
- x Final spools made to the measured gap; flanges meet parallel and concentric without force
- x Pipe strain measured at the coupling for each flange: 0.05 mm limit
- x Alignment re-measured after the pipe work, and that state used for the moves
```

## Supports that keep doing their job

A support next to the pump only helps if it carries the weight at working temperature as well as cold. A hot pipe rises and falls as it grows, and a rigid support set cold can lift clear of the pipe when it warms, handing the weight back to the pump flange, or take extra load and push the flange up. Pipes that move vertically near machines are often carried on spring supports, which hold a nearly constant load over their travel, or on adjustable supports set with the system hot. The HW-3's discharge valve support was an adjustable stand, set cold with a dial indicator on the coupling to show that tightening it neither lifted nor lowered the pump, and checked again hot at commissioning.

## Flexible connectors and their hidden thrust

Rubber expansion joints and metal bellows are often fitted next to pumps to absorb movement and vibration, and they work well for that. They carry a trap. A bellows under internal pressure behaves like a small piston: unless it is restrained by tie rods, it pushes the pipes on each side apart with a force equal to the pressure times its effective area. For a DN100 bellows with an effective diameter of about 125 mm, at a pressure of 0.6 MPa, that is π ÷ 4 × 125² × 0.6 ÷ 1,000 = 7.36 kN, pushing directly on the pump flange. This is an illustration. The bellows maker's data give the effective area for a real unit. That thrust is far larger than the HW-3's allowance and far larger than anything the pipe's weight produces. An untied bellows next to a pump can strain it more than the pipe it was meant to isolate, so connectors at pumps are fitted with tie rods or limit rods, or the pipes on each side are anchored to take the thrust.

## Pipe strain over time

Pipe strain is not fixed at installation. Supports corrode, settle or are adjusted by someone chasing a leak; hangers are removed for maintenance and not replaced; insulation gets wet and heavy. The HW-3's maintenance plan repeats the pipe strain check whenever a pipe near the pump is disturbed and at each scheduled alignment check, with the indicators on the coupling and each flange released in turn. A pump whose alignment drifts between checks, with a sound foundation and no soft foot, points first to its pipes.

## Why pipes win against pumps

A pump on a base is held by friction and four bolts and is designed to be stiff enough to keep its internal clearances under its own forces. A steel pipe is a long lever. A small force at the end of a pipe run produces a large moment at the pump flange, and the pump casing and base are not designed to resist large moments indefinitely. The numbers above show the scale: a pipe that grows 9.36 mm against a short leg pushes with 20 kN; a suction spool pulled 3 mm to meet its flange moved the HW-3 pump 0.18 mm at the coupling, more than three times the alignment tolerance. In a contest between a pipe and a pump, the pump moves, and the coupling, bearings and seals pay for it.

## Exercise: the 3,000 mm leg

With the 3,000 mm leg, the pipe run expansion tool found a leg stress of 71.3 MPa, inside the 150 MPa allowable, but a force of 2.50 kN, over the 2 kN allowance. By what factor does the force change if the leg is lengthened from 3,000 mm to 3,500 mm, and does that leg pass?

**Worked answer.** In the guided cantilever estimate, the force from the leg is 12 E I δ ÷ L³, so it falls with the cube of the leg length. Lengthening the leg from 3,000 to 3,500 mm reduces the force by a factor of (3,000 ÷ 3,500)³ = 0.630, to 2.50 × 0.630 = 1.57 kN, inside 2 kN.

The stress, 3 E D δ ÷ L², falls with the square: 71.3 × (3,000 ÷ 3,500)² = 52.4 MPa, inside 150 MPa. The 3,500 mm leg passes both checks. The cube law is why a modest increase in a leg's length can solve a pipe force problem: each 10% of extra length removes about a quarter of the force. This is an illustration.
