---
title: "Shafts, keys, couplings and alignment: connecting rotating machinery reliably"
description: "Shafts crack at keyways and shoulders, couplings wear and misalignment quietly destroys bearings and seals. How to size shafts, join hubs, choose couplings and align machines properly."
publishDate: 2026-10-09
category: "Engineering"
tags:
  - design
  - operations
  - quality
author: "KEVOS"
featured: false
draft: false
---

Every rotating machine depends on shafts that carry torque and bending loads, on connections that fix gears, pulleys and sprockets to those shafts, and on couplings that join one machine to the next. These parts are simple and familiar, so they rarely get the attention they deserve. When they go wrong, the symptoms often appear somewhere else: a bearing that fails every few months, a pump seal that keeps leaking, a gearbox that runs hot or a coupling that eats its elastic elements.

Many of these problems trace back to a few causes. Shafts are sized for strength but not stiffness, or are notched by keyways, grooves and sharp shoulders exactly where bending stress is highest. Hubs are fixed with methods that cannot carry the load and loosen or fret. Couplings are chosen for torque without checking misalignment capacity. Most commonly, machines are installed and maintained without accurate alignment, so bearings and seals carry hidden loads every revolution.

This article explains how shafts are loaded and sized, how stress concentrations cause fatigue failures, the main ways to connect hubs to shafts, how to choose couplings, and how to measure and correct shaft alignment. It is general information for designers, engineers and maintenance teams. Critical shafts should be designed to recognised standards, such as AS 1403 for rotating steel shafts, and coupling and alignment equipment makers provide detailed selection and tolerance data.

## How shafts are loaded

A shaft carries **torque** from the driver to the driven machine. Torque in newton metres is about 9,549 times the power in kilowatts divided by speed in rev/min. A 15 kW motor at 1,440 rev/min delivers about 99.5 N·m; after a 6:1 reduction, the slow shaft carries about 597 N·m. Gear reductions multiply torque, which is why slow shafts are always larger.

Shafts also carry **bending** from belt and chain tension, gear tooth forces, the weight of rotating parts and any misalignment, and sometimes **axial loads** from helical gears, thrust or thermal expansion.

## Sizing for strength and stiffness

For a solid round shaft in torsion, the maximum shear stress is 16 times the torque divided by π times the diameter cubed. At 99.5 N·m and an allowable shear stress of 40 MPa, chosen conservatively to cover keyways and shock, the required diameter is about 23.3 mm, so a 25 mm shaft would satisfy strength.

Stiffness often governs. Twist in a shaft is the torque times its length divided by the shear modulus times the polar moment of area. A common guide for machine drives is to limit twist to about a quarter to one degree per metre. The 25 mm shaft at 99.5 N·m twists about 1.9 degrees per metre, almost double the upper guide. A 30 mm shaft brings it to about one degree per metre. Bending deflection matters too: excessive deflection misaligns gears, overloads bearing edges and wears seals.

Long, slender shafts also have a **critical speed**, the speed at which they resonate in bending. Running near it causes large vibration and rapid damage. Most industrial shafts run well below their first critical speed, but long line shafts, fan shafts and high-speed spindles should be checked, and stiffer shafts or closer bearing spacing raise the critical speed.

**Hollow shafts** use material more efficiently in torsion and bending, because the core carries little stress. A tube with a bore 60% of its outside diameter loses little stiffness and saves substantial weight, which matters where inertia or mass is important.

## Fatigue and stress concentrations

Most shafts that break fail by **fatigue**, not by a single overload. A shaft rotating under a steady bending load sees fully reversed stress every revolution, millions of times. Cracks start at **stress concentrations**: sharp shoulders, keyway ends, circlip grooves, cross holes and rough or damaged surfaces.

Design details reduce the risk:

- **Use generous fillet radii** at shoulders, consistent with the bearing or hub that seats there. Relief grooves and spacer rings allow large radii where a seated part needs a sharp corner.
- **Place keyways, grooves and holes away from bending peaks**, such as the centre of a span or next to a heavily loaded gear.
- **Use sled-runner keyway ends** and rounded keyway bottoms rather than sharp-ended profiles.
- **Avoid circlip grooves** in highly stressed sections; use shoulders or spacers instead.
- **Specify surface finish** appropriate to fatigue-critical areas, and protect shafts from damage in handling.
- **Combine bending and torsion** in the calculation. Classical methods use an equivalent torque, the square root of bending moment squared plus torque squared, for ductile shafts; standards such as AS 1403 provide fuller methods including fatigue and stress concentration factors.

A standard keyway can reduce a shaft's torsional strength by roughly a quarter and adds a stress raiser at each end.

## Connecting hubs to shafts

| Method | How it works | Strengths | Limitations |
|---|---|---|---|
| Parallel key | A key sits in matching slots in shaft and hub | Simple, standard, easy to assemble | Weakens shaft; can work loose and fret under reversing loads |
| Splines | Multiple teeth on shaft and hub | High torque, can allow axial sliding, better load distribution | More costly to make |
| Interference fit | Hub shrunk or pressed onto the shaft | No stress-raising slots, transmits torque through friction | Hard to remove; needs accurate machining and calculation |
| Keyless locking assembly | Tapered rings expanded by screws to clamp hub to shaft | Backlash-free, adjustable, removable, no keyway | Space and cost; must be tightened correctly |
| Taper-lock bush | Split tapered bush clamps shaft and hub, usually with a key | Standard for pulleys and sprockets, easy fitting | Must be tightened to specification |
| Set screw | Screw bears on the shaft | Very cheap | Light duty only; damages shafts and loosens |

**Reversing and shock loads** are hard on keys, which can roll and wallow their keyways. Splines, interference fits and keyless locking assemblies handle them better. **Fretting**, damage from tiny relative movements at clamped surfaces, appears as reddish oxide debris and leads to fatigue cracks; tight fits and adequate clamping prevent it.

**Axial location** of parts uses shoulders, spacers, locknuts, end plates and circlips. Retaining compounds can supplement fits but should not be relied on alone for primary torque transmission unless designed for it.

## Choosing couplings

**Rigid couplings** join shafts as one and suit only shafts held in perfect alignment by a common rigid frame. **Flexible couplings** accommodate the unavoidable misalignment between separately mounted machines and should be used wherever a motor is coupled to a separate gearbox, pump or fan.

Flexible couplings handle four conditions: **angular misalignment**, **parallel offset**, **axial movement** or end float, and **torsional flexibility** that absorbs shocks. Common types include:

- **Jaw couplings** with an elastomer spider: compact and widely used. If the spider fails, the jaws still engage, so drive continues until repaired.
- **Pin and bush couplings**: pins in resilient bushes, good shock absorption.
- **Tyre couplings**: a flexible rubber tyre, high misalignment capacity and very soft torsionally.
- **Disc couplings**: flexing steel disc packs, torsionally stiff with no wearing parts.
- **Gear and grid couplings**: high torque in compact sizes, needing lubrication.
- **Fluid couplings**: smooth starting of high-inertia loads.

Selection follows a pattern: multiply the running torque by a **service factor** for the driver and driven machine; choose a size whose rating exceeds it; check the bore range, maximum speed and misalignment capacity; and consider torsional stiffness, which matters for positioning drives and for avoiding torsional vibration in engine-driven systems. A coupling that carries the torque can still be wrong if its misalignment capacity is below what the installation will see.

Coupling flexibility is not a substitute for alignment. A flexible coupling absorbs misalignment by flexing every revolution, and the reaction forces load the bearings and seals of both machines.

**Overload protection** can be provided by torque-limiting couplings or shear pins that slip or break at a set torque, protecting gearboxes and machinery from jams.

## Shaft alignment

Misalignment is a continuous hidden load. It raises bearing loads, which shortens their lives sharply, wears seals unevenly, overheats couplings and raises vibration, often at once and twice running speed. It also wastes energy.

### The two errors

Misalignment between two shafts is described by **parallel offset**, the distance between the shaft centrelines at the coupling, and **angular misalignment**, the difference in their direction, usually expressed as a slope such as millimetres per 100 mm. Each is measured in both the vertical and horizontal planes, giving four values to correct.

### Measuring

- **Straightedge and feeler gauges** give a rough set suitable only for slow, non-critical drives.
- **Dial indicators** in rim-and-face or reverse-indicator arrangements measure offset and angle accurately. A rim indicator reads twice the actual offset, so a total reading of 0.30 mm means an offset of 0.15 mm. A face reading divided by the diameter swept gives the angle: 0.10 mm across a 100 mm diameter is 1 mm per metre. Indicator brackets sag and must be corrected.
- **Laser alignment systems** perform the same geometry with automatic calculation of shim and move values, quickly and accurately.

### Before aligning

- **Fix soft foot**: a machine foot that does not sit flat distorts the frame when the bolt is tightened. A foot that lifts more than a few hundredths of a millimetre when its bolt is loosened needs shimming first.
- **Remove pipe strain**: pipework forced into position pulls pumps out of line. Pipes should be supported independently and fit without force.
- **Allow for thermal growth**: machines that run hot grow, changing alignment between cold and running. Manufacturers provide cold offsets to apply so machines are aligned when hot.

### Tolerances

Acceptable misalignment depends mainly on speed: faster machines need tighter alignment. Alignment tool makers and coupling manufacturers publish tolerance tables; use them rather than the coupling's maximum misalignment capacity, which is a survival limit, not a target. Record the as-found and as-left values.

## Shaft seals

Seals keep lubricant in and contamination out where shafts leave housings. **Lip seals** need a hard, smooth, correctly finished shaft surface and good alignment. **Mechanical seals** in pumps are sensitive to misalignment, vibration and running dry. **Labyrinths** suit high speeds and dirty conditions. **O-rings** seal static joints and slow movements; they work by controlled squeeze in a groove designed to the seal maker's dimensions, with the material chosen for the fluid and temperature. Many seal failures are really alignment, vibration or shaft surface problems.

## A worked example

This is an illustrative example. A process plant has a motor-driven pump whose mechanical seal and motor bearings fail several times a year. Each failure stops part of the process and needs a fitter for most of a shift.

**Investigation.** The maintenance team checks the installation. One motor foot lifts 0.2 mm when its bolt is loosened. The pump is pulled about 0.4 mm out of line by an unsupported discharge pipe. The coupling spider is worn and cracked. Vibration readings are high at twice running speed, consistent with misalignment.

**Changes.**

- The discharge pipe is given its own support and refitted without strain.
- The soft foot is corrected with stainless shims.
- The motor and pump are aligned with a laser system, using the pump maker's cold offset for thermal growth, to within the tolerance for the running speed.
- The coupling element is replaced, and as-left alignment values are recorded.
- Alignment checks are added after any maintenance that disturbs the machines.

**Result.** Vibration falls substantially, and over the following year seal and bearing replacements drop to planned changes found by inspection. The [maintenance that prevents breakdowns](/insights/maintenance-that-prevents-breakdowns/) article covers condition monitoring routines that catch these problems early, and [what engineering failures teach a business](/insights/what-engineering-failures-teach-a-business/) explains why repeat failures deserve investigation.

## Applying this in an Australian business

- **Size shafts for stiffness as well as strength**, using recognised standards for critical shafts.
- **Keep stress raisers away** from bending peaks, with generous radii.
- **Choose hub connections** that suit the torque and whether loads reverse.
- **Use flexible couplings** between separately mounted machines, checking misalignment capacity.
- **Align with dial indicators or lasers**, after fixing soft foot and pipe strain.
- **Allow for thermal growth** on hot-running machines.
- **Record as-found and as-left alignment** values.
- **Treat repeated seal and bearing failures** as possible alignment problems.

## Where shafts and couplings go wrong

- **Sharp shoulders and keyway ends** at high bending stress.
- **Set screws** used for real torque.
- **Keys under reversing loads** without adequate fit.
- **Couplings chosen only for torque.**
- **Alignment by eye** or straightedge on fast machines.
- **Soft foot and pipe strain** left uncorrected.
- **Relying on coupling flexibility** instead of aligning.

## Questions to ask about a shaft line

- Is the shaft stiff enough, not just strong enough?
- Where are the stress raisers, and are they at bending peaks?
- How are hubs fixed, and can they handle reversing and shock loads?
- What misalignment can the coupling accept, and what will it see?
- When were these machines last aligned, and to what tolerance?
- Have we checked for soft foot, pipe strain and thermal growth?

## Bringing it together

Shafts, hub connections, couplings and alignment are simple parts of a machine that decide whether bearings and seals last. Size shafts for stiffness as well as strength, keep stress concentrations away from bending peaks, and fix hubs with methods suited to the loads. Choose flexible couplings for torque, misalignment and stiffness, and protect drives from overload where needed. Align machines accurately, after correcting soft foot and pipe strain and allowing for thermal growth, and record the results. The result is smoother running, longer bearing and seal life and fewer unexplained failures.

---

*Source: KEVOS editorial notes, drawing on earlier KEVOS engineering handbooks on shafts, keys, circlips and seals, splines and serrations, shaft couplings and clutches, shaft coupling selection, shaft alignment and O-ring selection, together with established machine design and maintenance practice. The worked example is illustrative. This article is general information; use recognised standards and manufacturers' data for critical designs.*
