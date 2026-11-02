---
book: ultrasonic-testing-by-the-numbers
chapterSlug: sizing-and-evaluating-weld-indications
order: 8
title: "Sizing and evaluating weld indications"
description: "Reference reflectors, distance–amplitude curves, transfer correction, echo amplitude against DAC, length sizing by the 6 dB drop, characterising indications and applying an acceptance specification."
draft: false
---

Finding an echo is half of weld testing. The other half is deciding what it means: how big the reflector is, what kind of flaw it probably is, and whether the weld can be accepted with it. Echo height alone cannot answer those questions, because it depends on distance, beam spread, attenuation, surface condition, the reflector's orientation and shape as well as its size. The answer is to compare every echo with echoes from reference reflectors of known size, at the same distance, through the same kind of surface.

This chapter builds a distance–amplitude curve for the mill's 70° probe, corrects it for the difference between the reference block and the vessel, evaluates two indications in the insert welds against the project's acceptance specification, sizes their length, and finishes with a slag line that was nearly accepted because a 4 dB correction was left out.

## Reference reflectors

The standard reference reflector for weld testing in plate of this thickness is a side-drilled hole: a hole, typically 3 mm in diameter, drilled parallel to the surface through a reference block of the same material and similar thickness as the part. A side-drilled hole returns the same echo whatever direction the beam approaches it from in the plane of the block, because it is round, and it is long enough to fill the beam's width, so its echo depends little on small errors in probe position. Holes at several depths give echoes at several sound paths.

```figure
type: compare
title: The mill's 12 mm reference block and the 70° probe's responses
cols: Hole depth | Sound path at 70° | Gain for 80% of full screen
rowhead: Reference
- Side-drilled hole A, 3 mm | 3.0 mm | 8.77 mm | 42.0 dB
- Side-drilled hole B, 3 mm | 6.0 mm | 17.54 mm | 44.5 dB
- Side-drilled hole C, 3 mm | 9.0 mm | 26.31 mm | 47.0 dB
- Side-drilled hole D, 3 mm | 11.5 mm | 33.62 mm | 49.2 dB
- Hole C reached on the second leg | 9.0 mm | 43.86 mm | 51.5 dB
caption: This is an illustration. Gains are measured, not calculated, because at these short paths the probe's near field and the wedge's sound path make any calculated fall-off unreliable. The block is of carbon steel plate from the same supplier as the insert.
```

The gains rise with sound path: each echo is weaker the further the hole is, because of beam spread and attenuation. Joining the points gives the distance–amplitude curve, or DAC: the gain needed to bring a 3 mm side-drilled hole's echo to 80% of full screen at any sound path between 8.77 and 43.86 mm, which covers the first leg and most of the second. An instrument can also draw the curve on its screen, or apply time-corrected gain, which raises the gain automatically with sound path so that the reference holes all appear at the same height. Either way, every indication is then compared with the reference hole it would match at its own sound path.

### Interpolating the curve

Between measured points the curve is interpolated. For an indication at a sound path of 30.0 mm, between holes C (26.31 mm, 47.0 dB) and D (33.62 mm, 49.2 dB), the DAC gain is 47.0 + (30.0 − 26.31) ÷ (33.62 − 26.31) × 2.2 = 48.11 dB. At 24.0 mm, between holes B and C, it is 44.5 + (24.0 − 17.54) ÷ (26.31 − 17.54) × 2.5 = 46.34 dB. Linear interpolation in decibels is adequate when the points are as close together as these.

## Transfer correction

The reference block has a smooth machined surface. The vessel's shell beside the insert welds is mill-scaled plate that has been wire-brushed, with a curvature of 600 mm radius. Both the rougher surface and the curvature let less sound into the part and less of the echo back out than on the block, so an echo from a given reflector in the vessel is weaker than from the same reflector in the block. If the DAC set on the block is used without correction, every indication in the vessel is underestimated.

The transfer correction measures the difference. The technician places two identical angle probes facing each other, one transmitting and one receiving, first on the block and then on the vessel, and compares the gains needed for the same transmitted signal at the same separation. The vessel needed 4.0 dB more than the block. That 4.0 dB is added to the DAC for all evaluations on the vessel, which is the same as raising every point of the curve by 4.0 dB.

```figure
type: formula
title: Evaluating an indication against a corrected DAC
formula: DAC on the part = DAC on the block + transfer correction
formula: Indication level relative to DAC, dB = (DAC on the part at its sound path) − (gain for the indication at 80% of full screen)
caption: A positive result means the indication is stronger than the reference hole at the same sound path; a negative result means it is weaker. The transfer correction here is +4.0 dB.
- Gains | in dB, both read at 80% of full screen height
```

## Two indications in the insert welds

The insert has two welds tested in this chapter: the lower weld, where the root indication of Chapter 7 was found, and the upper weld. The project's acceptance specification for the insert, written by the mill's engineer for this repair and approved by the vessel's inspection body, uses three levels relative to the corrected DAC. It is quoted here only as an illustration: real acceptance levels come from the code and standard the work is done to, such as AS 2207 or ISO 11666, and are not reproduced in this book.

```figure
type: range
title: The insert's illustrative acceptance levels, relative to the corrected DAC
unit: dB
min: -14
max: 8
caption: This is an illustration of a project specification, not the levels of any published standard. Indications are recorded from DAC −10 dB; between DAC −6 dB and DAC they are accepted only if no longer than the 12 mm plate thickness; above DAC they are rejected.
- Not recorded | -14 | -10 | below DAC −10 dB
- Recorded, accepted | -10 | -6 | DAC −10 to DAC −6 dB
- * Accepted if length ≤ 12 mm | -6 | 0 | DAC −6 dB to DAC
- Rejected | 0 | 8 | above DAC
```

**The root indication, lower weld.** At a sound path of 30.0 mm, the echo reached 80% of full screen at 47.0 dB. The corrected DAC at 30.0 mm is 48.11 + 4.0 = 52.11 dB. The indication's level is 52.11 − 47.0 = +5.1 dB: stronger than the reference hole, and above DAC. It was rejected and repaired, as Chapter 7 described.

**The upper weld's indication.** At a sound path of 24.0 mm, on the first leg at a depth of 24.0 × cos 70° = 8.21 mm, an echo reached 80% of full screen at 53.3 dB. The corrected DAC at 24.0 mm is 46.34 + 4.0 = 50.34 dB, so the indication's level is 50.34 − 53.3 = −3.0 dB, between DAC −6 dB and DAC. Its acceptance depends on its length.

## Scanning sensitivity and evaluation sensitivity

The gain used while scanning is not the gain used to evaluate. While the probe is moving, an echo is on screen for a fraction of a second, and an indication whose maximum is at the edge of the recording level may be passed over at the gain it will be judged at. The procedure therefore scans with extra gain, typically several decibels above the corrected DAC, so that anything approaching the recording level shows clearly. When an echo appears, the technician stops, maximises it and evaluates it at the reference gain. The extra scanning gain also raises the noise from the plate's grain structure and from the surface, which a technician learns to recognise as a moving, flickering background distinct from a reflector's echo that rises and falls smoothly as the probe passes over it.

Two simple checks protect the sensitivity throughout the job. The DAC is re-checked on the reference block at intervals during the shift and at the end; if any point has drifted by more than the procedure's allowance, the welds tested since the last good check are retested. And the couplant and surface are kept the same between transfer measurement and testing: a transfer correction measured on wire-brushed plate is not valid on plate with loose scale or a different couplant.

## Sizing length by the 6 dB drop

For an indication longer than the beam is wide, the usual method of sizing its length is the 6 dB drop. The technician maximises the echo, then moves the probe along the weld in one direction until the echo falls to half its maximum, 6 dB down, and marks the beam index position; then repeats in the other direction. When the beam's axis is at the end of a long reflector, about half the beam is on it, so the echo has fallen by about half. The distance between the two marks is the length.

```figure
type: steps
title: Sizing the upper weld's indication by the 6 dB drop
caption: This is an illustration. The −6 dB beam width of the 4 MHz, 9 mm probe at a 24 mm sound path is about 2.2 mm, much less than the indication's length, so the method is appropriate.
- Echo maximised | 80% of full screen at 53.3 dB, sound path 24.0 mm
- Probe moved along the weld to one end | echo falls to 40% of full screen at 112 mm from the weld's start mark
- Probe moved to the other end | echo falls to 40% at 128 mm
- * Length by 6 dB drop | 128 − 112 = 16 mm, longer than the 12 mm allowed between DAC −6 dB and DAC
- Result | rejected: indication at DAC −3.0 dB and 16 mm long
```

The method has a limit set by the beam. A reflector shorter than the beam's width gives a 6 dB drop length about equal to the beam width, whatever its real length, so the method overestimates small reflectors. At the insert's short sound paths the 4 MHz probe's beam is only about 2 mm wide, and the error is small; at the long paths of Chapter 9 the beam is hundreds of millimetres wide, and length sizing by beam movement is impossible.

### Height and character

The specification assesses length and amplitude, but the technician also notes what each indication probably is, because that guides the repair. Several signs help. Echo dynamics, the way the echo rises and falls as the probe is moved across the reflector, differ: a smooth planar reflector gives a sharp single peak, a slag inclusion a ragged one, and a cluster of pores several small peaks. Indications seen equally from both sides of the weld are usually volumetric, like slag; indications much stronger from one side are usually planar, like lack of fusion on one face. Position matters: an indication on a fusion face, at the angle of the bevel, is probably lack of sidewall fusion; one in the weld body, probably slag or porosity; one at the root, incomplete root fusion or penetration.

The upper weld's indication was at 8.2 mm deep, in the weld body between the fusion faces, gave a ragged echo of similar height from both sides, and was 16 mm long: the signature of a slag line, slag trapped between weld runs. The height of a flaw through the wall, which matters for fracture assessment, cannot be measured reliably from amplitude. Techniques that time the diffracted signals from a flaw's tips, such as time-of-flight diffraction, do measure it, and they are the method to use where a flaw is to be assessed for fitness for service rather than simply repaired.

## The mistake: a slag line nearly accepted

The upper weld was first evaluated by a technician new to the vessel who used the DAC set on the reference block without the transfer correction. Against the uncorrected DAC of 46.34 dB at 24.0 mm, the indication at 53.3 dB was 46.34 − 53.3 = −7.0 dB, below DAC −6 dB, and so accepted regardless of length under the project specification. The report recorded it as acceptable.

```figure
type: steps
title: Restoring the transfer correction
caption: This is an illustration. The same indication moved from accepted to rejected by a 4.0 dB correction that the procedure required and the first evaluation left out.
- First evaluation, no transfer correction | −7.0 dB against DAC: below DAC −6 dB, accepted regardless of length
- Review by the level 3 | the procedure requires a measured transfer correction on the vessel; none recorded
- Transfer measured | vessel needs 4.0 dB more than the block for the same signal
- * Re-evaluated with corrected DAC | −3.0 dB: between DAC −6 dB and DAC, so length governs
- Length by 6 dB drop | 16 mm, over the 12 mm allowed; rejected and repaired; re-test clear
```

The inspection company's level 3 reviewer, checking the report before it went to the inspection body, noticed that no transfer correction was recorded. Measured on the vessel, it was 4.0 dB, and with it the indication moved from −7.0 dB to −3.0 dB, into the band where length governs, and its 16 mm length rejected it. The slag line was ground out and rewelded, and the re-test was clear. The procedure's report template now has a mandatory field for the transfer correction, with the method and the date it was measured.

A 4 dB difference is a factor of 1.6 in amplitude, well within the range that rough or curved surfaces produce, and it is invisible unless measured. Without the review, the vessel would have returned to service with a 16 mm slag line in a new weld, a flaw that the specification, correctly applied, rejects.

## What amplitude can and cannot say

The DAC method compares echoes with a standard reflector; it does not measure flaws. A planar flaw tilted away from the beam can return a small echo for its size and a rounded flaw a large one. The evaluation is therefore a set of agreed rules, written into the specification, rather than a measurement of the flaw: they work because experience and testing have shown that, applied consistently, they reject the flaws that matter for welds of the kind tested. That is why the probe angles, the scanning pattern, the reference block, the transfer correction and the levels must all be those the specification names: changing any of them changes what the rules mean.

## Exercise: an indication on the second leg

During the re-test of the upper weld, a new echo appears at a sound path of 33.0 mm, reaching 80% of full screen at 50.0 dB. Using this chapter's DAC and transfer correction, decide which leg it is on, calculate its depth, and evaluate its level against the corrected DAC. Then decide what to do next if its 6 dB drop length is 9 mm.

### Answer

**Given:** S = 33.0 mm; gain 50.0 dB at 80% of full screen; 70° probe; plate 12 mm; DAC points at 26.31 mm (47.0 dB) and 33.62 mm (49.2 dB); transfer correction +4.0 dB; length 9 mm.

**Assumptions:** the probe's angle and index have been checked (70°); the reflector lies within the plate; linear interpolation of the DAC.

**Method:** compare S with the half-skip path; calculate depth; interpolate the DAC; add the transfer correction; compare with the specification.

**Leg and depth:** half-skip path = 12 ÷ cos 70° = 35.1 mm. S = 33.0 mm is less, so the echo is on the first leg, near the root: depth = 33.0 × cos 70° = 11.29 mm.

**DAC at 33.0 mm:** 47.0 + (33.0 − 26.31) ÷ (33.62 − 26.31) × 2.2 = 47.0 + 2.01 = 49.01 dB on the block; corrected, 49.01 + 4.0 = 53.01 dB.

**Level:** 53.01 − 50.0 = +3.0 dB, above DAC: rejected under the project specification, whatever its length.

**What to do next:** the 9 mm length does not matter at this level. The position, 11.3 mm deep and near the root of the newly repaired weld, suggests incomplete fusion of the repair's root run. The technician confirms it from the other side of the weld, records it, and the weld is excavated again, this time with the excavation depth taken from a checked probe angle, and retested after rewelding.

**Verification:** the interpolated DAC must lie between the two neighbouring points, as 49.01 dB does, and the depth must be less than the plate thickness on the first leg, as 11.29 mm is. A wrong-leg calculation would give 24 − 11.29 = 12.71 mm, deeper than the plate, which confirms the first leg.
