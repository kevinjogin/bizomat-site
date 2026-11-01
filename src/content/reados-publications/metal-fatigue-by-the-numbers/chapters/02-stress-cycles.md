---
book: metal-fatigue-by-the-numbers
chapterSlug: stress-cycles
order: 2
title: "Stress cycles: amplitude, mean and ratio"
description: "How to describe a repeated stress by its amplitude, mean and ratio, find the nominal stresses in a shaft and a lever, and avoid losing the sign of a stress in a von Mises check."
draft: false
---

Fatigue depends on how a stress changes, not only on how large it gets. Before any fatigue check can be made, the stress at the critical point has to be described as a cycle: where it starts, where it goes and how often. This chapter sets out the few quantities that do that, finds the nominal stresses in the PK-20's camshaft and rocker lever, and shows a common way of losing the very information a fatigue check needs.

The stresses in this chapter are nominal: the stresses that ordinary beam and shaft formulas give for the section, without the local rise at a fillet or hole. Chapter 4 adds the notch. Keeping the two apart makes each step easy to check.

## Describing a cycle

A stress that repeats between a largest value σmax and a smallest value σmin is described by four related quantities.

```figure
type: formula
title: The quantities of a stress cycle
formula: σa = (σmax − σmin) ÷ 2      σm = (σmax + σmin) ÷ 2
formula: Δσ = σmax − σmin = 2 σa      R = σmin ÷ σmax
caption: Tension is positive and compression negative. Any two of the four quantities fix the cycle. Fatigue design mainly uses the alternating stress and the mean stress.
- σa | alternating stress, or stress amplitude: half the range
- σm | mean stress: the middle of the cycle
- Δσ | stress range: the full swing, used for welded joints
- R | stress ratio: −1 for fully reversed, 0 for zero to maximum
```

The alternating stress drives the damage: it is the cycling that moves dislocations back and forth (Chapter 1). The mean stress changes how much damage a given amplitude does. A tensile mean holds cracks open and shortens life; a compressive mean helps hold them shut. Chapter 5 deals with that effect.

### Common kinds of cycle

```figure
type: compare
title: Kinds of stress cycle
cols: Stress ratio R | Alternating stress | Mean stress | Typical example
rowhead: Cycle
- * Fully reversed | −1 | σmax | 0 | a rotating shaft under a steady bending load
- Repeated, zero to maximum | 0 | σmax ÷ 2 | σmax ÷ 2 | a gear tooth, a lever pushed one way, a bolt with no preload
- Fluctuating in tension | between 0 and 1 | less than σmax ÷ 2 | more than σmax ÷ 2 | a spring with preload, a preloaded bolt
- Steady | 1 | 0 | σmax | a dead load: no fatigue
caption: Most fatigue test data are for fully reversed loading, R = −1, because rotating-beam machines produce it easily. Other cycles are related to that data by the mean stress methods of Chapter 5.
```

## The camshaft: rotating bending

The PK-20 camshaft carries the cam follower's reaction near its end, and the bending moment at the shoulder beside the follower-side bearing is 260 N·m. This is an illustration. The moment does not move: the follower always pushes from the same side. But the shaft turns, so any point on its surface passes in turn through the tension side and the compression side of the bend. A point at the fillet sees its bending stress swing from full tension to full compression and back once every revolution.

For a solid round shaft the section modulus is Z = π d³ ÷ 32. At the 30 mm bearing seat that is π × 30³ ÷ 32 = 2,651 mm³, and the bending stress is M ÷ Z = 260,000 ÷ 2,651 = 98.1 MPa. At the surface it cycles between +98.1 and −98.1 MPa.

```figure
type: line
title: Bending stress at a point on the camshaft surface over one revolution
x: Shaft angle from the tension side, degrees
y: Nominal bending stress, MPa
ymin: -120
ymax: 120
caption: This is an illustration. A steady moment of 260 N·m on a 30 mm shaft. Every point on the surface sees one fully reversed cycle per revolution: an alternating stress of 98.1 MPa with zero mean, R = −1. The 100 N·m torque adds a steady shear stress of 18.9 MPa that does not change with angle.
- 0 | 98.1
- 30 | 85.0
- 60 | 49.0
- 90 | 0
- 120 | -49.0
- 150 | -85.0
- 180 | -98.1
- 210 | -85.0
- 240 | -49.0
- 270 | 0
- 300 | 49.0
- 330 | 85.0
- 360 | 98.1
```

The torque is different. The cam's driving torque, 100 N·m, twists the shaft the same way all the time. Its shear stress at the surface is T ÷ (2Z), because the polar section modulus of a solid round bar is twice its bending section modulus: 100,000 ÷ (2 × 2,651) = 18.9 MPa. A real cam torque varies around the cam profile; the builder's measurement showed the variation was small beside the mean, so the case treats it as steady. That is a judgement to record, not to forget: a cam with a sharp rise can put a large alternating torque on a shaft.

### The shaft combined stress tool

The [round shaft combined stress](/tools/shaft-combined-stress/) tool takes a solid or hollow round shaft carrying axial load, bending moment and torque together and returns the direct, bending and torsional stresses at the outer fibre, the principal stresses, and the von Mises and Tresca equivalent stresses with safety factors against yield. It is a static check: it works with the stresses at one instant and has no notion of cycles.

```figure
type: steps
title: The PK-20 camshaft at its worst instant, in the shaft combined stress tool
caption: This is an illustration. 30 mm solid shaft, no axial load, 260 N·m bending, 100 N·m torque, yield strength 700 MPa, required factor 2.
- Bending stress | 260,000 ÷ 2,651 = 98.1 MPa
- Torsional shear stress | 100,000 ÷ 5,301 = 18.9 MPa
- Principal stresses | 101.6 and −3.5 MPa
- * von Mises and Tresca | 103.4 and 105.1 MPa
- Safety factor against yield | 700 ÷ 103.4 = 6.77: ADEQUATE
```

This is the same static check that the PK-16 passed with a factor of almost 7 before its shafts cracked (Chapter 1). It is still worth doing: a part that yields on its first cycle will not survive the second million, and the tool gives the nominal stresses that the fatigue check needs. It just does not answer the fatigue question.

### Principal stresses through a revolution

The bending stress reverses but the shear stress from torque does not, so the principal stresses and their directions change as the shaft turns. The [principal stresses and von Mises](/tools/principal-stress/) tool resolves a plane stress state, σx, σy and τxy, into its principal stresses, their direction, the maximum shear stress, and the von Mises and Tresca equivalents, with safety factors against yield. Entering the camshaft surface element at several angles shows what happens.

```figure
type: compare
title: A point on the camshaft surface at five angles, in the principal stress tool
cols: Bending stress σx, MPa | Principal stresses, MPa | Principal angle from the axis | von Mises, MPa
rowhead: Shaft angle
- * 0° (tension side) | 98.1 | 101.6 and −3.5 | 10.5° | 103.4
- 45° | 69.4 | 74.2 and −4.8 | 14.3° | 76.7
- 90° (neutral axis) | 0 | 18.9 and −18.9 | 45° | 32.7
- 135° | −69.4 | 4.8 and −74.2 | 75.7° | 76.7
- * 180° (compression side) | −98.1 | 3.5 and −101.6 | 79.5° | 103.4
caption: This is an illustration. σy = 0 and τxy = 18.9 MPa throughout. The largest principal stress swings from +101.6 to +3.5 MPa while its direction turns through 69°. The von Mises stress is 103.4 MPa on both the tension and compression sides.
```

Two things stand out. The direction of the largest tensile stress turns as the shaft rotates, so the crack plane is not fixed by the torque alone; with bending this much larger than torsion, cracks still run close to perpendicular to the axis, as they did on the PK-16. And the von Mises stress is the same at 0° and 180°, although one point is in tension and the other in compression. That second fact leads straight to the most common error in this chapter.

## The rocker lever: a fluctuating cycle

The rocker lever never reverses. The return spring keeps the follower on the cam with at least 300 N, and the cam's rise pushes it up to 2,400 N. Both act on the same side at 150 mm from the critical section, where the hub joins the arm. The lever's section there is 16 mm thick and 40 mm deep, bent about its 16 mm face, so Z = b h² ÷ 6 = 16 × 40² ÷ 6 = 4,267 mm³.

```figure
type: steps
title: Nominal stresses at the PK-20 rocker lever's hub
caption: This is an illustration. 16 × 40 mm section, Z = 4,267 mm³, follower force 300 to 2,400 N at 150 mm.
- Largest moment | 2,400 × 150 = 360,000 N·mm
- Smallest moment | 300 × 150 = 45,000 N·mm
- Stress range | 84.4 MPa down to 10.5 MPa
- * Alternating and mean stress | 36.9 and 47.5 MPa
- Stress ratio | 10.5 ÷ 84.4 = 0.125
```

The lever's alternating stress, 36.9 MPa, is far below the camshaft's 98.1 MPa, but it carries a mean stress of 47.5 MPa in tension. Chapter 5 shows how much that mean matters.

### Every cycling part in the machine

```figure
type: compare
title: The cycles on the PK-20's cycling parts, before notches
cols: Smallest stress, MPa | Largest stress, MPa | Alternating, MPa | Mean, MPa | R
rowhead: Part and stress
- * Camshaft, bending at the shoulder | −98.1 | 98.1 | 98.1 | 0 | −1
- Camshaft, torsional shear | 18.9 | 18.9 | 0 | 18.9 | 1
- Rocker lever, bending at the hub | 10.5 | 84.4 | 36.9 | 47.5 | 0.125
- Return spring, shear in the wire | 192 | 449 | 128 | 321 | 0.43
- Housing bolt, tension, first design (M10) | 450 | 475.9 | 12.9 | 463 | 0.95
caption: This is an illustration. The spring and bolt figures come from Chapters 9 and 8. Each part has a different kind of cycle, which is why each needs its own check. The bolt's alternating stress is tiny but its mean is close to yield.
```

## Where the loads came from

Every number in the table above rests on a load, and a fatigue check is only as good as its loads. The PK-20's follower force was found in three ways, and the builder recorded all three.

First, by calculation. The return spring's force at the follower's lowest position sets the smallest load, 300 N. The largest load is the spring force at full lift plus the force needed to fold the carton flap and to accelerate the lever and follower. The folding force came from a test rig that pushed cartons with a load cell; the acceleration force came from the cam's lift curve and the moving parts' mass. At 40 cycles a minute the inertia added less than 5% to the peak, so the case treats it as part of the 2,400 N.

Second, by measurement. The prototype camshaft carried a strain gauge bridge at the shoulder, wired through a slip ring, and the lever carried a gauge on the face of its arm near the hub. Over a week of mixed production, the recorded peaks at the shoulder agreed with the calculated 98.1 MPa within about 4% for the standard carton, and they showed what the calculation could not: the larger cartons that some customers run, and the occasional jam.

Third, by comparison with the PK-16. The cracked shafts gave a lower bound on the stress that had been too much for that design, which Chapter 6 uses.

### How much the load matters

Fatigue life is very sensitive to stress. On the S-N line that Chapter 6 uses for the PK-16 camshaft steel, life falls by a factor of about 1.75 for every 10% rise in alternating stress above the endurance limit. A load that is 10% higher than assumed does not cost 10% of the life; it costs almost half of it. That is why the builder measured loads on a prototype instead of trusting the calculation alone, and why the design rule in Chapter 1 asks for a safety factor of 1.5, not 1.1.

```figure
type: bars
title: Life lost for a given error in the alternating stress, above the endurance limit
unit: share of the calculated life
caption: This is an illustration. Life varies with stress to the power 1 ÷ 0.1699 ≈ 5.9 on the PK-16 steel's S-N line (Chapter 6). A modest load error dominates every other uncertainty in a finite-life calculation.
- Stress 5% low | 1.35
- * Stress as calculated | 1
- Stress 5% high | 0.75
- Stress 10% high | 0.57
- Stress 20% high | 0.34
```

### Cycles per revolution

Not every part sees one cycle per turn. A cam with two lobes loads its follower twice a revolution. A gear tooth is loaded once a revolution, but an idler gear's tooth is loaded on both flanks. A shaft carrying a belt pulley sees one bending reversal per turn, but the belt itself flexes twice per pass over the pulleys. The PK-20's single-lobe cam gives one cycle per carton for the lever, spring and bolts, and one rotating bending cycle per carton for the shaft. A designer who counts cycles must count load events at the critical point, not revolutions of the machine.

### Recording the cycle

The builder now records every cycling part's stresses on one sheet before any fatigue factor is applied, so that a reviewer can check the mechanics separately from the fatigue judgement. The sheet has five lines for each critical point:

1. the part, the section and the critical point on it, with a sketch;
2. each load, its source (calculation, measurement or both) and its range;
3. each nominal stress component, with its formula and its sign at both ends of the cycle;
4. the alternating and mean value of each component, kept separate;
5. the number of cycles per machine cycle, and the design life in cycles.

Only after that sheet is checked does the notch factor (Chapter 4) or any mean stress method (Chapter 5) come in. Most errors that the builder's reviews find are in lines 2 and 3, not in the fatigue arithmetic.

## The error: a von Mises stress has no sign

When the builder's graduate engineer set up the first PK-20 fatigue spreadsheet, the inputs came from the stress tool's von Mises column. At the tension side the shaft's equivalent stress was 103.4 MPa; at the neutral axis it was 32.7 MPa; and since a von Mises stress is never negative, the lowest value round the revolution was the 32.7 MPa at the neutral axis. The spreadsheet took the cycle as 32.7 to 103.4 MPa: an alternating stress of 35.4 MPa and a mean of 68.1 MPa.

The real cycle is +98.1 to −98.1 MPa in bending: an alternating stress of 98.1 MPa and no mean. The spreadsheet's alternating stress was about a third of the true value, and it invented a tensile mean that does not exist.

The senior engineer who checked the spreadsheet found the error by asking a simple question: what is the stress on the compression side? A von Mises stress is a scalar built from squares. It is designed to tell whether a material yields, and yielding does not care whether a stress is tensile or compressive. Fatigue does. A cycle from tension to compression and a cycle from tension to a smaller tension can have the same von Mises values and very different fatigue lives.

The correction is a rule the builder now applies to every fatigue check:

1. Work out the alternating and mean values of each stress component separately, with their signs: here, bending 98.1 MPa alternating and 0 mean; torsion 0 alternating and 18.9 MPa mean.
2. Apply the notch factors to each component (Chapter 4).
3. Only then combine the alternating components into an equivalent alternating stress, and the mean components into an equivalent mean stress, by von Mises (Chapter 7).

```figure
type: compare
title: The graduate's cycle and the real one
cols: Alternating stress, MPa | Mean stress, MPa | Fatigue effect
rowhead: Method
- Equivalent stress taken round the revolution | 35.4 | 68.1 | understates the damage about threefold
- * Components with their signs | 98.1 bending; 0 torsion | 0 bending; 18.9 torsion | the real cycle
caption: This is an illustration. Never form a fatigue cycle from von Mises values taken at different instants. Split each stress component into its alternating and mean parts first.
```

## Variable loads and cycle counting

Real loads are rarely one clean sine wave. The PK-20 erects cartons of different sizes, starts and stops, and occasionally jams. Each produces cycles of different sizes. For a load history like that, the cycles must be counted before they can be assessed.

The method used for this is called rainflow counting. It pairs each peak with the valley that closes the same loop in the stress-strain behaviour of the material, so that a small wobble on top of a large swing counts as a small cycle plus a large one, not as many medium ones. Counting software does this automatically from a recorded stress or strain history. For the PK-20, the builder fitted a strain gauge at the camshaft shoulder of a prototype and recorded a week of mixed production; Chapter 6 uses the counted result.

```figure
type: decision
title: Choosing how to describe the load on a part
question: Does the stress at the critical point repeat the same cycle every time?
- Yes, one steady cycle | use σa and σm directly; Chapters 3 to 5
- Yes, but with a few fixed levels (products, starts) | treat each level as a block of cycles; Chapter 6
- No, it varies irregularly | record it, rainflow count it, then treat the counted cycles as blocks
- Random, with a known spectrum | use spectral methods; see Random Vibration by the Numbers
caption: Most machine parts fall into the first two groups. Recording a real history on a prototype is cheap compared with a field failure.
```

## Exercise: a lever pushed both ways

A redesigned PK-20 lever is pushed by the cam in one direction with up to 2,400 N and pulled back by a second cam with up to 900 N in the other, both at 150 mm from the same 16 × 40 mm section. Find the largest and smallest nominal stress, the alternating and mean stresses and the stress ratio. Is the cycle more or less damaging than the original?

**Worked answer.** The section modulus is still 4,267 mm³. The largest moment is 2,400 × 150 = 360,000 N·mm, giving +84.4 MPa. The pull-back moment is 900 × 150 = 135,000 N·mm the other way, giving −31.6 MPa. The alternating stress is (84.4 + 31.6) ÷ 2 = 58.0 MPa and the mean stress is (84.4 − 31.6) ÷ 2 = 26.4 MPa. The stress ratio is −31.6 ÷ 84.4 = −0.37.

The alternating stress has risen from 36.9 to 58.0 MPa while the mean has fallen from 47.5 to 26.4 MPa. Because the alternating stress drives fatigue damage, the new cycle is more damaging, even though its peak is the same. Chapter 5 shows how to weigh the two against each other properly.
