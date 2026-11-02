---
book: inspecting-to-the-drawing
chapterSlug: choose-the-instrument-for-the-tolerance
order: 5
title: "Choose the instrument for the tolerance"
description: "Match each requirement to an instrument whose error is small against the tolerance, keep instruments calibrated and traceable, and allow for temperature on aluminium parts."
draft: false
---

Every instrument gives a number. Not every number can decide whether a feature is within its limits. A caliper reads to 0.01 mm on its display, and that is easy to mistake for an instrument that can tell 10.005 from 10.015. It cannot. The display shows resolution; what matters is how far the reading can be from the truth, and for a caliper on a small bore that can be more than the whole tolerance.

Choosing instruments is therefore part of inspection planning, done once per requirement and written on the method sheet, not left to whatever is on the bench. This chapter chooses an instrument for every numeric balloon on the bracket and explains why some obvious choices were rejected.

## Three properties that are easy to confuse

The International Vocabulary of Metrology defines these terms carefully, and the distinctions are practical, not academic.

- **Resolution** is the smallest change in the quantity that causes a perceptible change in the indication. A caliper with a 0.01 mm display has a resolution of 0.01 mm. Resolution sets a floor on what an instrument can distinguish, but says nothing about whether the reading is right.
- **Maximum permissible error**, often written MPE, is the extreme error the manufacturer or a specification allows for the instrument across its range. It is what a calibration checks against. A caliper with a 0.01 mm resolution commonly has an MPE several times larger.
- **Repeatability** is how closely repeated readings of the same thing, under the same conditions, agree. An instrument can repeat beautifully and still be wrong by a fixed amount.

For a decision against limits, the relevant number is the instrument's error in use: its MPE or calibrated error, plus the effects of how it is used on this feature. Chapter 6 adds those effects up properly. This chapter uses the instrument's stated error as a first screen.

## A screening rule

Workshops have long used a rule of thumb that an instrument's error should be no more than about a tenth of the tolerance band it is checking. It is not a requirement of any particular standard, and it is not a substitute for a proper uncertainty estimate. It is a fast way to reject obviously unsuitable instruments and to flag the requirements that need more thought.

Applied to the bracket, the screen divides each tolerance band by the stated error of the candidate instrument. A ratio of 10 or more passes the screen. A ratio between about 4 and 10 means the instrument may be usable but the decision near the limits needs the treatment in Chapter 6. A ratio below about 4 means the instrument should not be used to decide conformance on that feature at all.

This is an illustration. The shop's calibration records give these stated errors for its instruments: digital caliper 0.02 mm; outside micrometer 0.002 mm; three-point bore gauge, set with a ring, 0.002 mm; digital height gauge used directly 0.03 mm; test indicator used comparatively against gauge blocks, about 0.003 mm for the whole set-up; gauge pins 0.002 mm. Real values come from your instruments' certificates and the manufacturers' data, not from this list.

```figure
type: bars
title: Tolerance band divided by instrument error, selected bracket requirements
caption: This is an illustration. Ratios of 10 or more pass the screen; below about 4, the instrument cannot decide conformance on that feature.
unit: ×
max: 30
- Length 80, caliper | 10 | band 0.2 ÷ 0.02
- *Bore Ø10, caliper | 0.75 | band 0.015 ÷ 0.02; rejected
- Bore Ø10, bore gauge | 7.5 | band 0.015 ÷ 0.002; usable with Chapter 6
- *Bore height 30, height gauge direct | 1.33 | band 0.04 ÷ 0.03; rejected
- Bore height 30, comparative | 13.3 | band 0.04 ÷ 0.003
- Bore from B, height gauge direct | 3.33 | band 0.1 ÷ 0.03; rejected
- Flatness 0.05, indicator | 25 | band 0.05 ÷ 0.002
- Perpendicularity 0.02, indicator | 10 | band 0.02 ÷ 0.002
```

The two highlighted rows are the instructive ones. The caliper's error on the bore is larger than the bore's whole tolerance; no amount of care makes it a suitable instrument for balloon 9. The height gauge, read directly, has an error of 0.03 against a band of 0.04 on the bore height. Used comparatively, zeroed on a gauge block stack of 30.00 and reading the difference with a test indicator, the same equipment passes comfortably, because the gauge blocks carry the length and the indicator only has to resolve a small difference.

## The running case: the method sheet

This is an illustration. The inspector writes a method sheet for the bracket, one line per numeric requirement, naming the instrument and its identification number so the calibration record can be found.

```figure
type: compare
title: Instruments chosen for the bracket
cols: Instrument | Why
caption: This is an illustration. The method sheet names each instrument by its asset number, so results trace to calibration records.
- 1 to 5, 16, 17 | Digital caliper | band 0.2, screen ratio 10
- 6 Flatness | Jacks, surface plate, test indicator | method from Chapter 4
- 7.1, 7.2 Holes | Gauge pins in 0.01 steps | largest pin that enters
- 8.1, 8.2 Position | Height gauge, indicator, pins, on A B C | coordinates for Chapter 4
- *9 Bore | Bore gauge set on ring; GO/NO-GO plugs at the machine | variable result for the record; attribute check for every part
- 10, 11 Bore location | Gauge blocks, height gauge, test indicator, comparative | direct reading fails the screen
- 12 Perpendicularity | Pin, surface plate, test indicator | method from Chapter 4
- 13, 24 Texture | Stylus profilometer | settings from the drawing, Chapter 7
- 14, 15 Threads | M4-6H GO and NO-GO plugs, depth stop | attribute, depth read on gauge
- 18 Radius | Radius gauge set; optical comparator if disputed | ±0.1 on R3
- 20 Coating | Eddy-current coating thickness gauge | Chapter 7
- 22 Edge break | Visual against a measured sample; comparator if disputed | 0.2 to 0.5
```

Two choices need comment. The bore has two methods: a bore gauge for the variable results recorded on the first article and on sampled parts, and plain GO and NO-GO plug gauges at 10.000 and 10.015 for checking every part at the machine. The plug gauges answer "within limits or not" quickly and with little skill; they do not say where in the band the bore sits, which is why the bore gauge is still needed to watch the process. Plug gauges are themselves made to tolerances, and the gauge maker's tolerance zone determines whether a gauge at the limit will reject a part exactly on the limit; check the gauges' certificates.

The edge break and the radius are checked visually against references, with a measuring method held in reserve. That is legitimate if the record says so. Writing "R3: 3.0" when the inspector looked at a radius gauge and saw no light gap claims a measurement that was not made; writing "R3: conforms by radius gauge, no visible gap" is accurate.

## Attribute gauges and variable instruments

Instruments fall into two families. Variable instruments, such as micrometers, bore gauges and indicators, give a number. Attribute gauges, such as plug gauges, thread gauges and functional position gauges, give a pass or a fail. Each has a place, and a good method sheet usually uses both.

Attribute gauges are fast, need little skill and are hard to misread. That makes them ideal for checking every part at the machine. Their weakness is that they say nothing about where a feature sits within its limits. A bore that passes the plug gauges at 10.001 looks exactly like one at 10.014, so a process drifting towards a limit is invisible until the first reject. An attribute record also cannot support the decision-rule reasoning of Chapter 6, because there is no reading to compare with the limit.

Variable instruments are slower and need more care, but their numbers show trends. Five consecutive bore readings of 10.006, 10.008, 10.009, 10.011 and 10.012 tell the machinist to adjust the boring bar before a part fails. For the bracket, the shop therefore records variable results for every requirement on the first article and on a sample from each batch, and uses attribute gauges on every part for the requirements most likely to go wrong: the bore, the threads and the hole positions.

## Instruments at the machine and in the inspection room

The same requirement is often checked twice, once at the machine during manufacture and once at final inspection, and the two checks have different jobs. The machine-side check controls the process: it tells the operator whether to keep cutting, adjust or stop. The final check decides acceptance and produces the record.

That difference affects instrument choice. At the machine, speed and robustness matter, and the environment is warm, oily and full of swarf. Attribute gauges and simple variable instruments suit it. In the inspection room, conditions are steadier, parts can soak to room temperature, and slower, more capable methods are practical. A method sheet that names the same instrument for both jobs is usually either too slow at the machine or not capable enough at final inspection.

Neither check replaces the other. A shop that relies only on final inspection discovers problems after the whole batch is made. A shop that relies only on machine-side checks has no independent acceptance and no record a customer will accept.

## Using instruments properly

A well-chosen, calibrated instrument can still give a poor reading in careless hands. The common faults are familiar to anyone who has trained an apprentice, and they matter more as tolerances tighten.

- **Dirt.** A film of coolant or a single chip on a measuring face changes the reading. Wipe the part and the faces every time.
- **Zero.** Check the zero of a caliper or micrometer before a session, and re-check it after a knock or a battery change.
- **Force.** Use the micrometer's ratchet or friction thimble, and the same light pressure on caliper jaws. Squeezing harder makes the reading smaller.
- **Alignment.** Measure diameters across the true diameter and lengths square to the faces. A caliper tilted on a shoulder reads long; a bore gauge not centred reads small.
- **Wear.** Caliper jaw tips wear first, which is one reason inside measurements with calipers are poor. In-house checks against gauge blocks at the tips, not only at the base of the jaws, catch it.

None of this is new. It is listed because the stated error of an instrument assumes it is used properly, and the uncertainty estimate in Chapter 6 assumes the same.

## Calibration and traceability

An instrument's stated error means something only if someone has checked it. Calibration compares the instrument against a reference of known value and smaller uncertainty, and records the result with its uncertainty. A chain of such comparisons links the shop's caliper, through its gauge blocks and a calibration laboratory's references, to the national standard of length. That chain is traceability.

In Australia, calibration laboratories can be accredited by NATA, the National Association of Testing Authorities, against ISO/IEC 17025. A certificate from an accredited laboratory states results with their uncertainty and carries the accreditation. Many customers' quality requirements ask for traceable calibration of instruments used for acceptance, and AS/NZS ISO 9001 requires measuring resources to be suitable and, where traceability is required, calibrated or verified at specified intervals.

A practical calibration system for a small shop has four parts:

1. **A register** listing every instrument used for acceptance, with an identification number, location, calibration interval and due date.
2. **External calibration** of reference standards, such as gauge blocks, setting rings and thread gauges, by an accredited laboratory.
3. **In-house verification** of working instruments, such as calipers and micrometers, against those references at shorter intervals, with the results recorded.
4. **A rule for out-of-calibration findings.** When an instrument is found out of tolerance, the shop reviews what it measured since its last good check and decides whether any accepted parts are affected.

The fourth part is the one most often missing. A caliper found to read 0.05 mm long at its calibration has been reading 0.05 mm long on an unknown number of parts. The register, the method sheets and the inspection records together say which parts those were.

## Temperature

Length is defined at a reference temperature of 20 °C, and both the part and the instrument expand as they warm. Aluminium expands about twice as much as steel: typical handbook values are around 23 × 10⁻⁶ per kelvin for 6061 alloy and around 11.5 × 10⁻⁶ per kelvin for steel gauges. When an aluminium part is measured with a steel instrument away from 20 °C, the difference in expansion becomes a measurement error.

```figure
type: formula
title: Thermal error on the bore at 24 °C
caption: This is an illustration. The error is small against the bore tolerance once the part and the setting ring have reached the same temperature, but not on a part straight off the machine.
formula: error ≈ L × (α part − α gauge) × (t − 20 °C)
- L | 10 mm bore
- α part, α gauge | about 23.6 and 11.5 × 10⁻⁶ per K, typical values
step: 10 × (23.6 − 11.5) × 10⁻⁶ × 4 = 0.00048 mm
step: About 3 per cent of the 0.015 mm bore tolerance
```

The calculation assumes the part and the gauge are at the same temperature. A bracket taken straight from a machining centre, warm from cutting and coolant, may be several degrees above the room and the gauge, and then the whole part's expansion counts, not the difference. The practical rule is to let parts soak on the surface plate, beside the instruments, before measuring tight features, and to record the room temperature with the results on the first article.

## The error: a caliper on the bore

This is an illustration. Before the method sheet existed, the boring bar was reset after the revision mix-up in Chapter 1, and the next trial bracket's bore was checked at the machine with the inside jaws of a digital caliper, because the machinist's bore gauge was out for calibration. It read 10.01, inside the 10.000 to 10.015 limits, and the part went on to the next operation.

At first article inspection, the bore gauge read 10.018: oversize by 0.003. The caliper had read small, which is typical of inside jaws on a small bore, where the jaw tips touch the bore on a chord rather than across the true diameter, and where a slight tilt also shortens the reading. Its stated error of 0.02 was larger than the bore's tolerance, so the caliper result could never have shown whether the bore conformed.

The part was rejected. The method sheet now states the instruments for balloon 9 and excludes the caliper explicitly. The plug gauges at the machine mean the machinist can check every bore in seconds without needing the bore gauge at the machine, and an oversize bore like this one is stopped at the operation that made it.

## Exercise: choose and screen

A turned pin has a diameter of Ø12.000 to Ø12.011 and a length of 40 ±0.1. The shop has a digital caliper with a stated error of 0.02, a micrometer with a stated error of 0.002, and a bench comparator that, set with gauge blocks, has a stated error of 0.0005. Screen each instrument against each requirement and choose.

**Answer.** Diameter band 0.011: caliper ratio 0.011 ÷ 0.02 = 0.55, rejected; micrometer 0.011 ÷ 0.002 = 5.5, usable only with a proper uncertainty estimate and a decision rule near the limits; comparator 0.011 ÷ 0.0005 = 22, passes the screen. Length band 0.2: caliper ratio 10, passes; the micrometer and comparator would also pass but are unnecessary. The sensible method sheet uses the comparator for the diameter and the caliper for the length. If the comparator is not available at the machine, GO and NO-GO ring or snap gauges at the diameter limits give a fast attribute check for every part, with the comparator used on samples and on the first article.
