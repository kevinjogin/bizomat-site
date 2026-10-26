---
book: machine-noise-control-by-the-numbers
chapterSlug: vibration-isolation-and-structure-borne-noise
order: 9
title: "Vibration isolation and structure-borne noise"
description: "Stop machine vibration reaching the building: natural frequency from static deflection, transmissibility, mounts, flexible connections, and catch hard pads tuned to the motor's speed."
draft: false
---

A machine makes noise in two ways. It radiates sound into the air directly, which the previous chapters dealt with, and it shakes whatever it stands on and whatever is connected to it. That vibration travels through floors, walls, pipes and frames, often with little loss, and reappears as sound wherever a large surface is set vibrating: a wall in the next room, a steel roof, a panel of the machine's own enclosure. This **structure-borne** noise is usually low in frequency, it ignores enclosures and barriers, and it explains many of the rumbles that remain after the airborne paths have been treated.

This chapter explains how vibration isolators work, how to estimate a mount's natural frequency from its static deflection, what transmissibility means and when isolation helps or harms, and why the connections to a machine matter as much as its feet. The running case traces the store room's low-frequency rumble of Chapter 3 to structure-borne paths, and finds that the first "anti-vibration pads" fitted under CP-30 had a natural frequency almost exactly at its motor's running speed, so that they amplified the vibration they were meant to stop.

## A mass on a spring

A machine on isolating mounts behaves, at low frequencies, like a mass on a spring. Pushed and released, it bounces at its **natural frequency**, set by its mass and the mounts' stiffness. A convenient way to find that frequency is from the **static deflection**: how far the mounts compress under the machine's weight. Because stiffness and deflection are tied through the machine's weight, the natural frequency depends on the deflection alone.

```figure
type: formula
title: Natural frequency from static deflection, and transmissibility
formula: f_n = (1 ÷ 2π) × √(g ÷ δ) ≈ 15.76 ÷ √δ_mm Hz;   T = √( (1 + (2ζr)²) ÷ ((1 − r²)² + (2ζr)²) ), with r = f ÷ f_n
caption: This is an illustration for CP-30, whose motor runs at about 2,970 rpm, a forcing frequency of about 49.5 Hz, on mounts with an illustrative damping ratio ζ of 0.05.
- δ | Static deflection of the mounts under the machine's weight, m (or mm in the short form)
- f | Forcing frequency, Hz
- ζ | Damping ratio of the mount
- T | Transmissibility: the fraction of the force passed to the floor
step: δ = 6 mm: f_n ≈ 15.76 ÷ √6 ≈ 6.4 Hz; r ≈ 49.5 ÷ 6.4 ≈ 7.7
step: T ≈ 0.022: about 2% of the force reaches the floor, about 33 dB of isolation
step: δ = 0.1 mm: f_n ≈ 49.8 Hz; r ≈ 0.99; T ≈ 10, about 20 dB of amplification
```

## Transmissibility: when isolation helps

The **transmissibility** compares the force reaching the floor through the mounts with the force the machine's unbalance produces. It depends on the ratio r of the forcing frequency to the natural frequency.

- When r is well below 1, the forcing is slow compared with the natural frequency, the mounts behave as if rigid and T is about 1: no isolation.
- When r is near 1, the forcing excites the natural frequency and the machine bounces on its mounts: T can be 10 or more, amplification limited only by damping.
- When r is above √2, about 1.41, T falls below 1 and isolation begins; the higher r, the better the isolation.

The design rule follows: the mounts' natural frequency must be well below the lowest significant forcing frequency, typically by a factor of three or more, which means soft mounts with a large static deflection.

## Choosing mounts for CP-30

This is an illustration. CP-30 weighs about 900 kg, carried on four mounts, about 2,200 N each. Its lowest strong forcing frequency is its motor's running speed, about 49.5 Hz; its airend's rotors produce higher frequencies.

```figure
type: compare
title: Mount options under CP-30, at a forcing frequency of 49.5 Hz
cols: Static deflection | Natural frequency | Frequency ratio r | Isolation
caption: This is an illustration with a damping ratio of 0.05 for the rubber options and 0.02 for the springs. Real mounts' natural frequencies come from their makers' load–deflection data.
- Hard rubber pad, as first fitted | 0.1 mm | 49.8 Hz | 0.99 | −20 dB, amplifies
- Rubber pad | 1 mm | 15.8 Hz | 3.1 | 18.6 dB
- *Rubber-in-shear mount | 6 mm | 6.4 Hz | 7.7 | 33.3 dB
- Steel spring mount | 25 mm | 3.2 Hz | 15.7 | 46.4 dB
```

Rubber-in-shear mounts with about 6 mm of deflection suit CP-30 well: isolation of about 33 dB at the motor's frequency and more at the airend's higher ones, with enough damping to control the machine's movement as it starts and stops. The WORKOS [Vibration Isolator Selection calculator](/tools/vibration-isolator-selection/) works the same relationships for a target isolation and damping. Steel springs would isolate better, but they let the machine sway more and have little damping of their own; they are used for heavier machines and lower forcing frequencies, often with separate dampers.

## The error: pads at the motor's frequency

This is an illustration. When CP-30 was installed, the installer placed it on four hard rubber "anti-vibration pads", chosen from a catalogue because their load rating suited the machine's weight. Under CP-30's 2,200 N per corner, the pads compressed by only about **0.1 mm**. Their natural frequency was therefore about **49.8 Hz**, almost exactly the motor's 49.5 Hz.

The frequency ratio was about 0.99, and with light damping the transmissibility was about **10**: the pads passed about ten times more force into the slab than bolting the compressor straight down would have, a 20 dB amplification at the motor's frequency. The slab carried the vibration to the end wall, the end wall radiated it into the store room, and the storeperson heard it as the rumble of Chapter 3. The foam lining could not touch it, and the enclosure of Chapters 7 and 8, which deals with airborne sound, could not either.

```figure
type: bars
title: The store room's level, dB(C), as each measure was added
unit: dB(C)
max: 80
caption: This is an illustration. The rumble lived in the 63 and 125 Hz bands and travelled through the structure; only isolating the machine and its connections lowered it.
- As found | 73.9
- After the foam lining | 73.4
- After the silenced enclosure | 73.6
- *After mounts, flexible hose and resilient clamps | 63.6
```

The check that would have caught it is the static deflection calculation, which needs only the machine's weight per mount and the pad's load–deflection data: a deflection of 0.1 mm puts the natural frequency near 50 Hz, which is exactly where a two-pole motor on a 50 Hz supply runs. The fix had three parts: rubber-in-shear mounts with about 6 mm of deflection; a flexible hose in place of the rigid steel discharge pipe for its first metre from the compressor; and resilient clamps where the air main was fixed to the end wall, which had been a second, direct path for the vibration. With those in place, the store room's 63 and 125 Hz bands fell by about 10 dB, and its C-weighted level from about 73.6 to about **63.6 dB(C)**. The general lesson is that a mount is chosen by its natural frequency, not its load rating, and that a stiff pad near the forcing frequency is worse than no pad at all.

## Measuring vibration and isolation

Isolation can be checked directly. An **accelerometer**, a small vibration sensor, is fixed on the machine's side of each mount and another on the floor beside it, and the two signals are recorded with the machine running. The difference between their levels, band by band, is the mount's isolation in place, and a frequency analysis of the machine-side signal shows the forcing frequencies: the motor's running speed, the airend's rotor and lobe frequencies, and any harmonics. A floor reading that is not much lower than the machine reading, or a strong peak at the running speed in both, says the mount is not isolating, or that another path, a pipe or a conduit, is bypassing it.

This is an illustration. With the hard pads, the floor beside CP-30's feet showed a vibration level at 49.5 Hz higher than on the compressor's own frame, the signature of a mount at resonance, because the frame's movement was being amplified on its way into the slab. With the rubber-in-shear mounts, the floor reading at that frequency was about 30 dB below the frame's, close to the 33 dB the calculation predicted, and the remaining difference was traced to the air main's last clamp, which was replaced with a resilient one.

Vibration readings are also useful long after installation. A rising level at the running speed, or new peaks at other frequencies, can show wear, misalignment or imbalance in the machine before it fails, which is why many plants measure the vibration of important machines on a schedule. The mounts themselves age: rubber hardens, springs corrode and dampers leak, and a mount that isolated well when new can drift towards the forcing frequency as its stiffness changes. A check of each mount's deflection at service, against its installed value, catches the drift.

## Low-frequency noise and building structure

Structure-borne vibration that reaches a building's walls and floors is radiated as sound by every large, lightweight surface it reaches. Steel cladding, suspended ceilings and plasterboard partitions are efficient radiators at low frequencies, which is why the store room, behind a steel-clad end wall, heard CP-30's motor frequency so clearly. Treating the room, as the foam did, cannot help; treating the wall, by adding mass or decoupling a lining from it, can help a little; isolating the machine removes the cause.

## Connections are paths too

A machine on perfect mounts is still connected to the building by pipes, ducts, cables and conduits, and each connection is a path for vibration that bypasses the mounts. For CP-30, the rigid discharge pipe clamped to the end wall carried as much vibration to the store room as the slab did. Every connection to an isolated machine needs a flexible element close to the machine: a braided hose or a rubber bellows for pipes, a canvas or rubber flexible connector for ducts, a loop of flexible conduit for cables. Pipes beyond the flexible element should be supported on resilient hangers or clamps for some distance, because a pipe excited by the air pulsations inside it can radiate noise of its own.

## Starting and stopping

Soft mounts have one cost: as the machine starts and stops, its speed passes through the mounts' natural frequency, and for a moment the machine bounces. With CP-30's mounts at about 6.4 Hz, that happens as the motor passes about 384 rpm, which it does in a fraction of a second at start-up and somewhat longer as it runs down. Damping in the mounts limits the movement, and flexible connections must accept it. Machines that run up slowly through a low natural frequency, such as large fans, sometimes need restraints or snubbers that limit their movement at resonance.

## The floor matters

Isolation calculations assume that the floor is much stiffer than the mounts, so that the mounts do all the moving. On a ground-bearing concrete slab like the workshop's, that is true. On a light suspended floor, a steel mezzanine or a roof, the floor has its own flexibility and resonances, and a machine on isolators may still excite it. Machines on suspended structures need mounts much softer than the structure, and often an **inertia base**, a heavy concrete or steel block on which the machine is mounted and which itself sits on the isolators, which lowers the machine's movement and spreads its load. Placing heavy machines on ground-bearing slabs, away from lightweight structures, is the simplest way to avoid the problem. Where a slab is cut or jointed near a machine, the joint can also be used: a machine on its own isolated slab section, separated from the surrounding floor by a resilient joint, adds a second stage of isolation that helps most at the lowest frequencies.

## Inside the enclosure

Chapter 7 noted that an enclosure fixed to a vibrating machine radiates its vibration. With CP-30 on its new mounts, the enclosure stands on the slab independently, with a gap all round the compressor's base, and every connection passes through the enclosure wall in a flexible, sealed gland. The enclosure's panels see only airborne sound inside, which their lining and mass deal with. Had the enclosure been fixed to the compressor's base frame, its panels would have been driven by the machine's vibration and radiated it directly into the workshop.

## Damping panels

Where a machine's own panels, guards or covers vibrate and radiate sound, **damping** them can help: a viscoelastic layer bonded to the panel, or a constrained layer of viscoelastic material between the panel and a thin metal skin, converts the panel's vibration into heat. Damping reduces a panel's response at its resonances, which is where it radiates most, without adding much mass, and it is often effective on thin sheet metal guards, hoppers and chutes. It does nothing for a panel driven well away from its resonances, where mass and isolation are the controls. A quick test is to tap the panel with a knuckle: a panel that rings needs damping, and one that thuds does not.

## Exercise: a heavier compressor on the same mounts

CP-30 is to be replaced by a larger model of about 1,300 kg, using the same four rubber-in-shear mounts, which have a stiffness of about 368 N/mm each. What static deflection and natural frequency will the new machine have, and what isolation at a motor speed of 2,970 rpm? What else must be checked?

**Worked answer.** The total stiffness is 4 × 368 ≈ 1,472 N/mm, and the weight about 1,300 × 9.81 ≈ 12,750 N, so the static deflection is about 12,750 ÷ 1,472 ≈ **8.7 mm** and the natural frequency about 15.76 ÷ √8.7 ≈ **5.4 Hz**. At 49.5 Hz, r ≈ 9.2, and with ζ = 0.05 the transmissibility is about 0.016, about **36 dB** of isolation, slightly better than for CP-30.

The heavier machine improves the isolation, but the mounts must be checked against their maximum rated load and deflection: rubber mounts loaded beyond their rating creep and can fail. The weight distribution matters too: if the new machine's centre of mass is off-centre, the corners carry different loads, deflect differently and tilt the machine, so each mount is chosen for its own corner's load, and the deflections are measured after installation to confirm that the machine sits level and every mount carries what it was chosen for.
