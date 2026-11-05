---
book: bolted-joints-by-the-numbers
chapterSlug: torque-and-the-nut-factor
order: 2
title: "Tightening by torque: the nut factor and its scatter"
description: "How tightening torque becomes preload through the nut factor, why friction makes that uncertain, how lubricants change it, and how to correct a torque wrench for an adapter."
draft: false
---

Most bolts in the world are tightened by torque, because a torque wrench is cheap, quick and needs no access to the bolt's far end. But a torque wrench measures how hard the nut was turned, not how hard the bolt pulls. Between the two lies friction, in the threads and under the head, which takes most of the torque and varies from one bolt to the next. Tightening by torque is therefore a way of getting a preload that is roughly right, and knowing how roughly is as important as the torque figure itself.

This chapter turns the CT-1 test head's target preload into a tightening torque with the BIZOMAT bolt torque and preload tool, looks at what changes the nut factor, and corrects the torque for the crowfoot adapter the fitters need to reach the screws. Its mistake is a wrench set to the right torque that tightened every screw too far.

## The nut factor

The torque needed to tighten a bolt is made of three parts: the torque that actually stretches the bolt, through the lead of the thread; the torque to overcome friction in the threads; and the torque to overcome friction under the head or nut. In a typical steel joint, only about a tenth of the torque goes into stretching the bolt. The rest is friction, about half of it under the head and the rest in the threads.

All of that is summarised in one empirical number.

```figure
type: formula
title: Torque and preload
formula: T = K F d
formula: F = T ÷ (K d)
caption: T is the tightening torque, F the preload, d the bolt's nominal diameter and K the nut factor. K is not a friction coefficient: it bundles thread geometry, thread friction and bearing-face friction into one figure found by test.
- K | nut factor, dimensionless
- d | nominal diameter, in metres for N·m
```

Because K bundles two friction coefficients, it changes with everything that changes friction: the finish of the bolt and nut, the lubricant, the condition of the threads, the hardness of the bearing face, how many times the bolt has been tightened, and even how fast the wrench is pulled. Shigley's tabulates typical values that show the spread: about 0.30 for unplated black-finish bolts, 0.20 for zinc-plated, 0.18 for lubricated, 0.16 for cadmium-plated, and lower still with anti-seize compounds. A figure of 0.2 is a common default when nothing better is known.

For a given condition, K still scatters from bolt to bolt, typically by about ± 25% around its mean in ordinary workshop conditions. That scatter, not the mean, is what limits torque tightening.

## The test head's tightening torque

The CT-1's test head screws are black-oxide finished and lightly oiled as delivered. Rather than take a textbook K, the shop measured it on a sample of screws in a test block, by the method in Chapter 3, and found an average of 0.20. This is an illustration.

The [bolt tightening torque and preload tool](/tools/bolt-torque-preload/) takes the nominal diameter, the thread pitch, the nut factor, the bolt's proof strength and either a target preload as a share of the proof load or a tightening torque, and works the relation in either direction. It returns the tensile stress area, the proof load, the preload, the bolt stress, the share of the proof load and the tightening torque. It covers coarse and fine metric threads and warns that the nut factor must be confirmed for the actual finish and lubricant.

```figure
type: steps
title: The test head screws in the bolt torque and preload tool
caption: This is an illustration. M20 × 2.5, nut factor 0.20, proof strength 830 MPa, target preload 70% of proof.
- Tensile stress area | 244.79 mm²
- Proof load | 203.18 kN
- Preload | 142.23 kN
- Bolt stress | 581 MPa
- Share of proof load | 70.0%: WITHIN PROOF LOAD
- * Tightening torque | 568.9 N·m
```

The shop's work instruction rounds the figure to 570 N·m.

### How the shop found its nut factor

The figure of 0.20 came from ten screws from the batch bought for the rig, each tightened in a steel test block with the same washers and oil to 570 N·m, with its stretch measured ultrasonically before and after, as Chapter 3 describes. The stretch gave each screw's preload, and the torque divided by preload and diameter gave its nut factor. The ten values ranged from 0.17 to 0.24 with an average of 0.20. This is an illustration. A sample like that does two jobs: it gives a mean that belongs to the actual screws and lubricant, and it shows the scatter the shop can expect, which in this case was a little narrower than the ± 25% of the textbook allowance.

The sample has to match production. Screws from another batch, a different oil, plated instead of black-oxide washers, or threads in a tapped hole that has been used many times, all change K, and a figure measured on one set of conditions does not transfer to another.

### What a different lubricant would do

The tool also runs backwards: given a torque, what preload does it give? That shows what happens when the friction changes but the torque does not.

```figure
type: compare
title: Preload from 569 N·m at different nut factors, M20 × 2.5 class 10.9
cols: Preload, kN | Share of proof load | Effect
rowhead: Nut factor
- 0.25, dry, slightly rusty threads | 113.8 | 56% | Under-tightened
- * 0.20, as delivered and oiled | 142.2 | 70% | As designed
- 0.15, molybdenum disulphide paste | 189.7 | 93% | Close to proof load; the screws may yield
- 0.12, anti-seize compound | 237.1 | 117% | Beyond proof: screws yield or break
caption: This is an illustration. The same torque gives preloads ranging over a factor of two as the friction changes. Torque figures must always be read with the lubrication they were written for.
```

A fitter who applies a molybdenum paste to the threads to make the screws turn smoothly, and then uses the torque written for oiled screws, takes them to 93% of proof. With an anti-seize compound, the same torque would stretch them past proof. This is why the shop's work instruction states the lubricant beside the torque, and why a torque from a generic chart is not used without knowing what condition it assumes.

## Reaching the screws

The test head's screws sit in counterbores close to the chamber's mounting brackets, and a socket on a torque wrench cannot reach them squarely. The fitters use a crowfoot adapter: an open-ended spanner head that fits the wrench's square drive and reaches the screw from the side, extending the wrench by 70 mm. The wrench is 600 mm from its hand grip to the square drive. This is an illustration.

An adapter in line with the wrench lengthens its lever. The wrench clicks when the torque at its own square drive reaches the setting, but the hand's force is now acting over 670 mm to the screw instead of 600 mm, so the screw receives more torque than the wrench reads.

```figure
type: formula
title: Torque wrench with an extension adapter
formula: L eff = Lw + E cos φ
formula: Torque at the bolt = setting × L eff ÷ Lw
formula: Setting for a target = target × Lw ÷ L eff
caption: Lw is the wrench length from the centre of the hand grip to the square drive, E the adapter's length from the square drive to the bolt centre, and φ the adapter's angle to the wrench. At 90° the adapter adds no length and needs no correction.
- L eff | effective lever length
- φ | adapter angle, 0° in line
```

The [torque wrench adapter check](/tools/torque-wrench-adapter-check/) takes the wrench length, the adapter length and its angle, the wrench setting, and the bolt's diameter, pitch, nut factor and proof strength with a target preload, a tolerance and a largest share of proof allowed. It returns the effective length and correction factor, the target torque at the bolt, the actual torque the setting gives, the setting needed for the target, and the preload and share of proof load from the actual torque. It assumes the wrench is held at the centre of its grip.

## The mistake: the right number on the wrench

When the test head was first assembled, the fitter set the wrench to the 570 N·m on the work instruction, fitted the crowfoot in line to get the most reach, and tightened all eight screws in the cross pattern. The joint did not leak. A week later the shop's engineer, checking the first preload measurements from Chapter 3, found the screws stretched more than predicted, and asked how they had been tightened.

```figure
type: steps
title: The crowfoot adapter in the torque wrench adapter check, as used
caption: This is an illustration. Wrench 600 mm, crowfoot 70 mm in line (0°), setting 570 N·m; M20 × 2.5, K 0.20, proof 830 MPa, target 70% ± 5% of proof, largest 90%.
- Effective length / correction factor | 670.0 mm / 1.1167
- Target torque at the bolt | 568.9 N·m
- * Actual torque at the bolt | 636.5 N·m
- Wrench setting for the target | 509.5 N·m
- Preload / share of proof | 159.1 kN / 78.3%: OVER-TIGHTENED against 65 to 75%
```

The in-line crowfoot added 11.7% to every screw's torque. With the nut factor at its average, the screws reached 78% of proof instead of 70%; with a nut factor at the low end of its scatter they would have been near 100%. The screws were loosened one at a time, in the cross pattern, and retightened with the wrench set to 510 N·m. The work instruction now gives the setting for the crowfoot in line, 510 N·m, beside the socket setting of 570 N·m, and a sketch of the crowfoot's position.

Two practical rules follow. An adapter at 90° to the wrench needs no correction, because it adds no length to the lever; fitters who can use it that way avoid the arithmetic entirely. And any adapter, extension or crowfoot that changes the lever length must be corrected for, every time, because the wrench cannot know it is there.

```figure
type: bars
title: Torque at the screw for a 570 N·m setting, by crowfoot angle
x: Crowfoot angle to the wrench
y: Torque at the screw, N·m
caption: This is an illustration. Wrench 600 mm, crowfoot 70 mm. The correction falls with the cosine of the angle; at 90° it is zero.
- 0°, in line | 636.5
- 30° | 627.6
- 60° | 603.3
- * 90°, square | 570.0
```

## Wrenches, locking nuts and reused screws

The torque wrench itself is a smaller source of error than the nut factor, but not a negligible one. A click-type wrench in calibration is accurate to a few per cent of its setting, and less accurate near the bottom of its range. The shop has its wrenches checked by its calibration provider against ISO 6789 and uses each one in the upper part of its range. A wrench that has been dropped, or left wound up at a high setting for weeks, is checked before use.

Prevailing-torque nuts, which have a deformed thread or a nylon insert to resist loosening, need torque just to turn before the joint is tight. That torque produces no preload. The correct practice is to measure the prevailing torque as the nut runs down, before it seats, and add it to the tightening torque. Thread-locking compounds change friction during tightening too, so the compound maker's figure for the nut factor is used instead of the dry one.

Reused screws behave differently from new ones. The first tightening burnishes the thread and bearing faces, and the nut factor on later tightenings is often different from the first, sometimes lower and sometimes, where the surfaces have galled, much higher. High-strength screws that have been tightened close to their proof load may also have yielded slightly. The CT-1's test head screws are replaced after a set number of reassemblies, and any that show galled threads or a stretched shank are scrapped at once.

## Tightening patterns and passes

A joint with several bolts is not tightened one bolt at a time to full torque. Each bolt that is tightened squeezes the members and lets its neighbours relax a little, so the last bolt tightened ends up tighter than the first. The shop's procedure for the test head is a cross pattern in three passes: all eight screws to 30% of the final torque, then 70%, then 100%, and a final check pass at 100% in a circle to catch any that the later screws relaxed. Gasketed joints, in Chapter 9, need more passes.

```figure
type: checklist
title: Torque tightening the test head
caption: The CT-1 work instruction. This is an illustration.
- x Threads and bearing faces clean; screws lightly oiled as specified, no other lubricant
- x Hardened washers under the heads, chamfer towards the head
- x Wrench in calibration, setting chosen for the tool used: 570 N·m by socket, 510 N·m by crowfoot in line
- x Cross pattern, three passes at 30%, 70% and 100%, then a check pass
- x Torque applied smoothly, the last part of the turn without stopping
- x Screws marked when complete; any screw that turns on the check pass is noted
```

## Impact wrenches and hydraulic tools

Impact wrenches are fast and popular, and they deliver torque in a series of hammer blows whose effect depends on the joint's stiffness, the tool's air supply and how long the operator holds the trigger. Their output is not a controlled torque. The shop allows an impact wrench to run screws down to snug and no further; the final tightening is always by a calibrated hand wrench or a calibrated power tool.

For the larger joints on the rig's frame, the shop uses a hydraulic torque wrench, which reacts against a neighbouring bolt or a fixed arm and applies a set torque from its pump pressure. It removes the effort and the variation of a long hand wrench, but not the nut factor: the preload it gives is still the torque divided by K and the diameter, with K's scatter. A more powerful tool makes torque easier to apply, not more accurate as a measure of preload.

## The limits of torque

Torque tightening is quick and good enough for most joints, but it delivers a preload that is uncertain by the scatter of the nut factor. For the test head, ± 25% in K means the preload may lie anywhere from about 114 to 190 kN for the same 569 N·m. Chapter 4 designs the joint to work across that whole range. When a joint cannot tolerate it, the preload must be set by something closer to the bolt itself: its stretch or the angle the nut turns, which Chapter 3 covers.

## Exercise: the manifold screws

The CT-1's aluminium valve manifold is held by M10 × 1.5 cap screws of property class 12.9, with a proof strength of 970 MPa, tightened to 70% of proof. Their nut factor, measured on a sample, is 0.20. Find the target preload and tightening torque. If a fitter uses a 40 mm crowfoot in line on a 300 mm wrench without correcting, what preload does the setting give?

### Worked answer

The tensile stress area is π ÷ 4 × (10 − 0.9382 × 1.5)² = 57.99 mm². The proof load is 970 × 57.99 = 56.25 kN, and 70% of it is 39.37 kN. The torque is 0.20 × 39,370 × 0.010 = 78.7 N·m.

With a 40 mm crowfoot in line on a 300 mm wrench, the effective length is 340 mm and the correction factor 1.1333. A setting of 78.7 N·m puts 89.2 N·m on the screw, which with K = 0.20 gives 89.2 ÷ (0.20 × 0.010) = 44.6 kN: 79% of proof. The correct setting is 78.7 × 300 ÷ 340 = 69.5 N·m. The torque wrench adapter check, with those inputs and a 70% ± 5% target, reports the joint as over-tightened and gives the corrected setting of 69.5 N·m. A short crowfoot on a short wrench needs a larger correction than a long one, because the correction depends on the ratio of the two lengths.
