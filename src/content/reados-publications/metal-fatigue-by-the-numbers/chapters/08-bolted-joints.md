---
book: metal-fatigue-by-the-numbers
chapterSlug: bolted-joints
order: 8
title: "Bolted joints: preload is the defence"
description: "Why a properly preloaded bolt sees only a fraction of a cycling load, how to check bolt fatigue by Goodman from the preload, and why a turn-of-nut rule failed on a short, stiff joint."
draft: false
---

A bolt is a notched bar by design. Its thread roots are among the sharpest notches in a machine, and a bolt that carried the full cycling load of a joint would often fail in fatigue within weeks. Yet bolted joints in machines run for decades. The reason is preload: a bolt tightened well clamps the joint so hard that most of the external load goes into relieving the clamping pressure, not into the bolt.

This chapter explains how that works, checks the PK-20's cam housing bolts for fatigue, and follows an assembly instruction that would have broken them while being tightened.

## The joint

The cam housing is bolted to the PK-20 frame with four bolts. As the cam turns, the follower's reaction tries to lift one side of the housing, and the bolts on that side carry an external tensile load that cycles from 0 to 12 kN on every revolution. This is an illustration. The other bolts carry less, so the check concentrates on the worst one.

### How preload shares the load

When a bolt is tightened, it stretches and the clamped parts compress, each by an amount set by its stiffness. The bolt's stiffness kb and the clamped parts' stiffness km act like two springs: the bolt in tension, the joint in compression, holding the same force between them.

An external load P pulling the joint apart stretches the bolt a little further and relieves some of the joint's compression. Because the two springs are in parallel for the external load, the bolt takes only the share C of P and the joint's compression drops by the rest, (1 − C) P.

```figure
type: formula
title: The share of external load carried by a preloaded bolt
formula: C = kb ÷ (kb + km)
formula: bolt force = Fi + C P,    clamp force = Fi − (1 − C) P
formula: the joint separates when (1 − C) P reaches Fi
caption: Valid while the joint stays closed. In a typical steel machine joint the clamped parts are stiffer than the bolt and C is about 0.15 to 0.35. Once the joint separates, the bolt carries the whole external load.
- Fi | preload
- P | external tensile load on the joint, per bolt
- C | joint constant: the bolt's share of the external load
- kb, km | stiffnesses of the bolt and of the clamped parts
```

For the PK-20 housing, the designer estimated C = 0.25. Of each 12 kN load cycle, only 0.25 × 12 = 3 kN reaches the bolt; the other 9 kN is taken by unclamping the housing flange. As long as the preload is well above 9 kN, the joint stays shut and the bolt sees a small cycle about a high mean.

```figure
type: line
title: Bolt and clamp force in a PK-20 housing joint as the external load rises
x: External load per bolt, kN
y: Force, kN
ymin: 0
ymax: 45
legend: Bolt force | Clamp force on the flange
caption: This is an illustration. M12 bolt preloaded to 37.9 kN, C = 0.25. Up to the working load of 12 kN the bolt force rises by only 3 kN. The joint would separate at 37.9 ÷ 0.75 = 50.5 kN, more than four times the working load.
- 0 | 37.9 | 37.9
- 6 | 39.4 | 33.4
- * 12 | 40.9 | 28.9
- 24 | 43.9 | 19.9
- 36 | 46.9 | 10.9
- 50.5 | 50.5 | 0
```

## Bolt fatigue strength

The threads make the bolt's fatigue strength low and quite independent of its tensile strength: a stronger bolt has a stronger core but equally sharp thread roots, and its notch sensitivity is close to 1. Bolt endurance strengths are therefore quoted as fully corrected values for the threaded bolt, which already include the thread's notch. For rolled-thread property class 8.8 bolts, Shigley's tabulates a fully corrected endurance strength of 129 MPa on the tensile stress area: about a sixth of the bolt's 830 MPa tensile strength. Rolled threads are better than cut threads, because rolling leaves compressive residual stress at the roots and a smooth grain flow.

Because that value already includes the threads, no further notch factor is applied. Applying Kf again is a common double count.

### Goodman for a preloaded bolt

A preloaded bolt does not move along a load line from the origin as its loads rise. Its mean stress starts at the preload stress σi and rises only with the alternating stress. The Goodman safety factor for that path, as given in Shigley's and used by the WORKOS tools, is:

```figure
type: formula
title: Fatigue safety factor of a preloaded bolt by Goodman
formula: σa = C P ÷ (2 At),   σi = Fi ÷ At,   σm = σa + σi
formula: n = Se (Sut − σi) ÷ [Sut σa + Se (σm − σi)]
caption: The external load cycles from zero to P. At is the tensile stress area of the thread. The safety factor scales the external load while the preload stays fixed.
- Se | fully corrected endurance strength of the bolt
- Sut | bolt tensile strength
- σi | preload stress
```

## The PK-20 housing bolts

The first design used M10 property class 8.8 bolts, with a tensile stress area of 58 mm², tightened to 75% of their proof load: 0.75 × 600 × 58 = 26.1 kN. The [bolted joint fatigue check](/tools/bolted-joint-fatigue/) tool takes the stress area, preload, the external load cycling from zero, the joint constant, the bolt's fully corrected endurance strength and tensile strength, and a required factor, and returns the alternating, mean and preload stresses and the Goodman factor. Its check reminds the user that the joint must not separate.

```figure
type: compare
title: PK-20 cam housing bolts in the bolted joint fatigue tool
cols: Preload, kN | Preload stress, MPa | Alternating stress, MPa | Goodman factor | Against 2.0
rowhead: Bolt
- M10, 8.8, At = 58 mm² | 26.1 | 450 | 25.9 | 1.98 | FATIGUE RISK, just
- * M12, 8.8, At = 84.3 mm² | 37.9 | 450 | 17.8 | 2.88 | FATIGUE SAFE
caption: This is an illustration. External load 0 to 12 kN per bolt, C = 0.25, Se = 129 MPa, Sut = 830 MPa, required factor 2.0 as the builder's rule for bolts. Both bolts are preloaded to 75% of proof, so their preload stress is the same.
```

The M10 falls just short of the builder's factor of 2 for bolts, a higher factor than for machined parts because bolt preload scatters. The M12 carries the same load over a 45% larger area, its alternating stress falls in proportion from 25.9 to 17.8 MPa, and its factor rises to 2.88. The housing was redesigned for M12 bolts.

### Why not less preload?

The tool's formula holds a surprise. With the M12 bolt preloaded to only 20 kN, its Goodman factor rises to 4.48, because the mean stress is lower. That is true and dangerous. A lower preload means the joint separates sooner, and once it separates the bolt carries the whole external load, not a quarter of it. A low preload also lets the joint slip sideways, which loosens nuts, and lets the flange rock on each cycle, which bends the bolt. Field experience with bolted joints is clear: loose bolts break, tight ones do not. The builder's practice is to preload to about 75% of proof, check fatigue at that preload, and confirm separation separately.

```figure
type: compare
title: The M12 housing bolt at three preloads
cols: Preload as share of proof | Load at which the joint separates, kN | Goodman factor | Assessment
rowhead: Preload
- 20 kN | 40% | 26.7 | 4.48 | looks safest; prone to loosening and slip
- 30 kN | 59% | 40.0 | 3.58 | acceptable if held reliably
- * 37.9 kN | 75% | 50.5 | 2.88 | the design preload
caption: This is an illustration. Separation load is Fi ÷ (1 − C) with C = 0.25. The fatigue factor alone would favour low preload; separation, slip and loosening favour high preload. The design takes the high preload and checks fatigue there.
```

## Getting the preload

A preload exists only if the assembly method produces it. The three common methods differ widely in how well they do that.

- **Torque.** The nut is tightened to a specified torque, T = K F d, where K is a nut factor of about 0.2 for dry steel. Most of the torque goes in friction under the nut and in the threads, so a change in lubrication or surface finish changes the preload; a scatter of ±25% is typical. For the M12 at 37.9 kN, T = 0.2 × 37,900 × 0.012 = 91 N·m, and the preload could lie anywhere from about 28 to 47 kN.
- **Angle.** The nut is brought to a defined snug point and then turned a set angle. The preload depends on the thread lead and on the stiffness of the bolt and joint, not on friction after snug. Turn-of-nut is the structural steel version, with large angles that take the bolt into yield on purpose.
- **Direct measurement.** Load-indicating washers, ultrasonic bolt-length measurement or tension-indicating bolts measure the preload itself. They are used where it really matters.

Between torque and angle sit combined methods. Torque-angle tightening applies a modest torque to close the joint reliably, then a defined angle; yield-controlled tightening uses a tool that watches the torque gradient and stops when the bolt just begins to yield. Both are common in engine and automotive assembly, where the joints are designed for them and the bolts are often single-use. They need powered tools, defined joint materials and a validated procedure, which is why the PK-20, built in small numbers, uses a calibrated torque wrench and an audit instead.

### The turn-of-nut fatigue check tool

The [turn-of-nut preload and bolt fatigue check](/tools/turn-of-nut-fatigue-check/) tool calculates the bolt's stiffness from its shank and threaded lengths in the grip, the preload from a turn angle past snug and the thread lead with the joint stiffness, and the joint constant from the two stiffnesses. It then checks the preload against a maximum share of the proof load, and the fatigue factor by the same Goodman relation as the bolted joint tool.

## The error: a third of a turn

The first PK-20 assembly instruction for the housing bolts read: "Tighten to snug, then turn a further one third of a turn." The engineer who wrote it had used turn-of-nut on structural steelwork and liked its independence from friction.

Before the instruction reached the assembly floor, the reviewing engineer entered the joint in the turn-of-nut fatigue tool: M12 × 1.75, 20 mm of plain shank and 12 mm of thread in the grip, a joint stiffness of 1,900 kN/mm from the housing flange and frame plate, and a turn of 120°. The tool refused the case: the preload stress would be at or above the bolt's tensile strength. The calculated preload, if the bolt stayed elastic, would have been 280 kN, more than five times the proof load.

```figure
type: compare
title: Turn angles for the PK-20 M12 housing bolt, in the turn-of-nut fatigue check tool
cols: Preload, kN | Share of proof load | Goodman factor | Tool result
rowhead: Turn past snug
- 10° | 23.3 | 46% | 4.14 | JOINT ADEQUATE, but preload low
- * 16° | 37.3 | 74% | 2.90 | JOINT ADEQUATE
- 20° | 46.7 | 92% | 2.07 | PRELOAD TOO HIGH, above 90% of proof
- 30° | 70.0 | 138% | not applicable | refused: preload stress at or above tensile strength
- 120° | 280 | 554% | not applicable | refused: preload stress at or above tensile strength
caption: This is an illustration. Bolt stiffness 642.3 kN/mm, joint stiffness 1,900 kN/mm, joint constant 0.253. In this short, stiff joint each degree of turn adds 2.33 kN of preload.
```

The joint was simply too short and stiff for an angle method of that kind. Structural turn-of-nut works on long grips with comparatively soft joints, and it relies on the bolt yielding: the angle carries the bolt past its proof load into a plastic plateau where further turning adds little force. A machine bolt with a 32 mm grip in a steel flange reaches its proof load in less than 20° of turn. A third of a turn would have yielded the bolts while they were being tightened, and on some, stripped the thread or broken the bolt.

The tool also gave the correct angle: about 16° for the design preload. But that angle is too small to control by hand. An error of 5° in the snug point or the turn changes the preload by about 12 kN, nearly a third of it. The instruction was rewritten to use a calibrated torque wrench at 91 N·m with lubricated threads, and the first ten housings were checked with an ultrasonic bolt gauge to confirm that the preload lay between 32 and 44 kN.

## Other ways to help a bolt

Preload is the main defence, but the details of the joint decide how much of it survives and how evenly the bolt is loaded. The builder's bolting guide lists these, and the PK-20 housing uses most of them.

- **Rolled threads, rolled after heat treatment where possible.** Rolling leaves compressive residual stress at the thread roots; rolling after hardening keeps it, whereas hardening after rolling relaxes it. Bolt standards and suppliers state which process a bolt has had.
- **Avoid bending.** A flange that rocks, or a nut seated on a sloping or uneven face, bends the bolt on every cycle and adds a bending stress at the first engaged thread, often larger than the tensile alternating stress the tool calculates. The PK-20 housing has a machined, flat flange face and a spot-faced frame plate, and the bolts sit as close to the load as the housing allows to limit prying.
- **Flexible bolts.** A long bolt, or one with its shank turned down to about the thread's root diameter, has a lower stiffness and so a lower joint constant. The exercise below shows the effect.
- **Thread engagement and nut load distribution.** Most of the load in a standard nut is carried by the first two or three engaged threads. Tension nuts and nuts of a softer material spread the load better. In a tapped hole, enough engagement must be provided for the weaker material.
- **Keeping the preload.** Preload is lost by embedding, as surface roughness flattens under the nut and the joint faces settle, by relaxation at high temperature, and by self-loosening under transverse slip. Few joint faces, hard washers, a high preload and the absence of slip are the best defences; locking devices help only if the preload is right first.

### Checking preload in production

The housing bolts are audited on one machine in twenty: an ultrasonic gauge measures the bolt's stretch before and after tightening, which gives the preload from the bolt's stiffness. The results go on an individuals chart, like any other process measurement. When a new batch of bolts arrived with a different coating, the audit showed the mean preload had fallen by about 15% at the same torque, and the torque was re-set before any machine left the factory.

## Exercise: a longer grip

A PK-20 variant mounts the cam housing through a 40 mm spacer block, so each M12 bolt has 55 mm of plain shank and 12 mm of thread in the grip, and the joint stiffness falls to 1,400 kN/mm. Using the turn-of-nut tool's relations (E = 205 GPa, lead 1.75 mm), find the bolt stiffness, the joint constant and the turn angle for a preload of 37.9 kN. What happens to the alternating bolt stress?

**Worked answer.** The shank area is π × 12² ÷ 4 = 113.1 mm². The bolt's flexibility is (55 ÷ 113.1 + 12 ÷ 84.3) ÷ 205,000 = (0.4863 + 0.1423) ÷ 205,000 = 3.066 × 10⁻⁶ mm/N, so its stiffness is 326.1 kN/mm. The joint constant is 326.1 ÷ (326.1 + 1,400) = 0.189. The angle for 37.9 kN is 37,900 × (3.066 × 10⁻⁶ + 1 ÷ 1,400,000) ÷ 1.75 × 360 = 37,900 × 3.780 × 10⁻⁶ ÷ 1.75 × 360 = 29.5°.

The longer, more flexible bolt takes a smaller share of the external load, so its alternating stress falls from 18.0 to 0.189 × 12,000 ÷ (2 × 84.3) = 13.4 MPa, and the angle needed for the same preload almost doubles. Long, slender bolts are kinder in fatigue and easier to preload accurately; that is why bolts in heavily cycled joints are often given reduced shanks or long sleeves.
