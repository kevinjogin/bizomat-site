---
book: product-acoustics-by-the-numbers
chapterSlug: measuring-and-declaring-product-noise
order: 10
title: "Measuring and declaring product noise"
description: "Measure a product's sound power, set declared values that allow for spread and uncertainty, test every unit at the end of the line, and catch a declaration set at the pilot units' average."
draft: false
---

A product's acoustic design ends in two kinds of measurement. One proves the design: careful measurements of sound power, frequency response and directivity on a few units, in a controlled environment, to standard methods. The other protects it in production: a quick test of every unit, at the end of the assembly line, that catches the leaks, rattles, wrong parts and loose screws that turn a good design into a bad product. Between them sits the **declaration**: the noise figures printed on a datasheet or a box, which must hold for the units customers actually buy, not only for the ones the engineers measured.

This chapter covers measuring a product's sound power, the environments and backgrounds that limit low-noise measurements, setting declared values that allow for production spread and measurement uncertainty, and designing an end-of-line acoustic test. The running case finds that AP-40's first declared values were set equal to the average of three pilot units, which would have left about half of all production units above their declaration when checked.

## Measuring sound power

A product's sound power is found, as Machine Noise Control by the Numbers describes for machines, by measuring sound pressure over a surface that encloses it and adding the surface's area. ISO 3745 sets out precision methods for anechoic and hemi-anechoic rooms, and ISO 3744 engineering methods for a free field over a reflecting plane. For a floor-standing product like AP-40, a hemisphere over the reflecting floor is the natural surface.

```figure
type: formula
title: Sound power from a hemispherical measurement surface
formula: L_W ≈ L_p,average + 10 × log₁₀(S ÷ S₀), with S = 2πr² for a hemisphere of radius r and S₀ = 1 m²
caption: This is an illustration for AP-40 on the floor of a hemi-anechoic room, with a measurement hemisphere of 1 m radius. Background and environmental corrections, and the number and positions of microphones, follow the standard used.
- L_p,average | Energy average of the sound pressure levels over the surface
- r | Radius of the hemisphere, m
step: S = 2π × 1² ≈ 6.28 m², so 10 × log₁₀(6.28) ≈ 8.0 dB is added
step: At maximum speed, a sound power of 50.1 dB(A) corresponds to an average of about 42.1 dB(A) on the surface
step: At night speed, 31.1 dB(A) corresponds to about 23.1 dB(A)
```

## The final design's sound power

This is an illustration. With the air-path redesign of Chapter 6 and the panel fix of Chapter 9, AP-40's pilot units measured an average A-weighted sound power of about **50.1 dB(A)** at maximum speed, and by the 50 log rule and measurement about **41.3 dB(A)** at 800 rpm and **31.1 dB(A)** at its night setting of 500 rpm, all comfortably inside the requirements of Chapter 1, which were 55, 47 and 36 dB(A).

## Background noise sets the floor

A quiet product needs a quiet room to measure. At AP-40's night setting, the average sound pressure on the 1 m hemisphere is only about 23.1 dB(A), lower than many offices at night. Measured in an ordinary laboratory with a background of 30 dB(A), the product could not be measured at all; the background correction described in Machine Noise Control by the Numbers applies here too, and the source must stand several decibels above the background for a reliable result. Products with night or standby modes are measured in hemi-anechoic rooms whose background is far below the product's level, or at a smaller radius, with the standard's corrections, if the room allows. The requirement for a measurable night figure is one reason products like AP-40 are developed with access to such a room from the start.

## Declared values

A declared noise value is a promise about the product, not a report on a sample. Two sources of variation separate the units a customer buys from the pilot units measured: **production spread**, from part tolerances, assembly and material batches, and **measurement uncertainty**, from the method and the laboratory. ISO 4871 sets out how noise emission values are declared and verified, including declaring a value together with an uncertainty, or a single value that already includes it. The principle is that a declared value is set high enough that a unit taken from production and measured by a competent laboratory will rarely exceed it.

## The error: declaring the pilot average

This is an illustration. AP-40's first datasheet declared its sound power as the pilot units' averages, rounded: **50, 41 and 31 dB(A)**. If production units spread about the mean with a standard deviation of about 0.8 dB, and a verification measurement adds an uncertainty with a standard deviation of about 1.0 dB, a unit's verified value has a combined standard deviation of about 1.28 dB around the mean. A declaration set at the mean is exceeded by about **half** of all verification measurements.

```figure
type: bars
title: Share of verification measurements above the declared value, maximum speed, %
unit: %
max: 55
caption: This is an illustration with a production mean of 50.1 dB(A), a production spread of 0.8 dB and a measurement uncertainty of 1.0 dB, both as standard deviations, combined to about 1.28 dB.
- Declared at the mean, 50.1 dB(A) | 50
- Declared 1 dB above the mean | 22
- Declared 2 dB above the mean | 6
- *Declared about 2.1 dB above the mean, 52.2 dB(A) | 5
```

The check that caught it was a review of the datasheet against the verification plan: the reviewer asked what fraction of production units would pass a verification measurement at the declared value, and the answer, about half, was not acceptable. The fix was to declare **52, 43 and 33 dB(A)**, about 2.1 dB above the means, which a verification measurement of a production unit would exceed only about one time in twenty, all still within the product's requirements. The general lesson is that a declaration must allow for the spread of what is sold and the uncertainty of how it is checked, and that a declared value equal to a sample's average is a coin toss.

## Claims on the box

Noise figures on packaging and in advertising are representations to consumers, and under the Australian Consumer Law they must not be misleading. A figure like "whisper quiet, 33 dB" should say what it is, sound power or sound pressure at a distance, at which setting, measured how, so that a customer can compare it with another product's figure on the same basis. Chapter 1's lesson applies with commercial force here: a decibel figure without its quantity and conditions invites comparisons that may be wrong, and a claim that cannot be backed by a declared value measured to a recognised method is a risk to the business making it. The ACCC publishes guidance on making claims about products, and the business's legal adviser should review noise claims like any other performance claim.

## The end-of-line test

The design measurements prove the design on a few units. The end-of-line test protects every unit, in seconds, on the production line, and it is designed to catch the faults that the design cannot prevent.

```figure
type: compare
title: AP-40's end-of-line acoustic test
cols: What it catches | How it is checked
caption: This is an illustration of a test run in a small, quiet booth on the line, comparing each unit with limits set from good units, not with the declared values.
- Fan sweep, 500 to 1,200 rpm | Rattles, a missing foam pad, a fan rubbing its scroll | Spectrum at a fixed microphone, against limits by band
- *Prompt speaker sweep | A wrong or damaged driver, a chamber leak, a buzzing grille | Response and distortion at a fixed microphone
- Microphone check | A gasket leak, a blocked port, a mismatched microphone | Response to a reference sound from the booth's loudspeaker
- Night-speed listening check | Tonal faults the limits miss | A trained listener on a sample of units
```

The test does not measure sound power; a production booth is not a hemi-anechoic room, and a few seconds is not long enough. It compares each unit with a reference made from many good units in the same booth, so that the booth's own acoustics cancel out. Its limits are set from the spread of good units, wide enough not to reject sound units and narrow enough to catch the faults that matter. A unit that fails is set aside and diagnosed, and the failure modes are tracked, because a rising rate of one failure, say chamber leaks, points to a problem upstream in assembly or in a supplier's part.

## Audits against the declaration

The end-of-line test cannot confirm the declared values, so a sample of production units is measured periodically in the hemi-anechoic room, to the same method as the design measurements. The results show whether the production mean and spread are where the declaration assumed. A mean drifting upwards, from a change of fan supplier, a softer foam or a revised moulding, is caught before units in the field exceed their declaration. The audit record, with the end-of-line test data, gives the business evidence that its declared values hold. For AP-40, the plan was five units a month for the first six months of production, falling to two a month once the mean and spread had settled, with an immediate extra audit after any change to the fan, the filter, the cabinet moulding or the air-path foam.

## Measuring the speaker and microphone

The prompt speaker's design verification follows Chapters 1 and 8: its frequency response on axis at 1 m and over its listening window, in a free field, at the stated drive level, with its distortion at the same time. In an anechoic room this is straightforward. Without one, a **time-gated** measurement in an ordinary large room can approximate a free field: the speaker plays a short or swept signal, and only the part of the microphone's recording that arrives before the first reflection from the floor, walls or ceiling is analysed. The gate's length limits the lowest frequency that can be resolved, roughly to the inverse of the time before the first reflection, so a room where the first reflection arrives 5 ms after the direct sound resolves down to about 200 Hz, adequate for AP-40's prompts.

The microphone is verified as Chapter 7 described, in the housing beside a calibrated reference microphone. Both measurements depend on calibrated reference instruments, checked against an acoustic calibrator before and after each session, and the records of each unit measured, its serial number, the date and the conditions, become the baseline against which production audits and field returns are compared.

## Where the uncertainty comes from

The measurement uncertainty used in the declaration is not a guess; it is built up from the method's sources of variation. A sound power measurement varies with the number and position of the microphones, the room's departure from an ideal free field, the background and its correction, the instruments' calibration, and the product's own operating condition: its fan speed, which a controller holds only within a tolerance, its filter, its supply voltage and its temperature. The standards for sound power set out the uncertainty expected for their methods under stated conditions, and a laboratory checks its own by repeating measurements of the same unit, on different days and after re-setting it up. For AP-40, repeated measurements of one reference unit, kept for the purpose, show the laboratory's repeatability, and that unit is remeasured at each production audit to confirm the laboratory has not drifted.

## Complaints and returns

When a customer complains that a product is noisy, the record makes the complaint answerable. The first questions are the ones the requirements were written around: which setting, where the product stands, how old its filter is, and what kind of noise, a hum, a whine, a rattle or simply too loud. A returned unit can be measured in the hemi-anechoic room and compared with the production audit data and its own end-of-line test record. A unit that measures within its declaration but hums at one speed points to a resonance in that customer's placement, or a tone the listening check should have caught; a unit far above its declaration points to a fault, which its end-of-line record should show, or to a failure in service, such as a fan bearing wearing or a foam pad coming adrift. Each returned unit's diagnosis feeds back into the end-of-line limits and, where it reveals a design weakness, into the acoustic record that Chapter 1 began.

## Closing the loop

Every chapter of this book adds a line to AP-40's acoustic record: its requirements, its acoustic circuit, its grille's and microphone path's resonances, its speaker chamber's volume and Q, its driver's excursion limit, its air path's elements and fan speed, its listening window, its cabinet's resonances against its fan's tones, and its declared values and tests. Each line names the dimension or part that controls it and the change that would require it to be recalculated. That record is how a product's sound survives the dozens of small changes that every product undergoes between its first prototype and its last production run.

## Exercise: a quieter fan supplier

A second fan supplier offers a fan that, in AP-40's air path, gives a production mean of 48.6 dB(A) at maximum speed, with a production spread of about 1.4 dB as a standard deviation instead of 0.8 dB. With the same measurement uncertainty of about 1.0 dB, what declared value at maximum speed would be exceeded by about one verification measurement in twenty? Is the quieter fan worth it?

**Worked answer.** The combined standard deviation is √(1.4² + 1.0²) ≈ **1.72 dB**. For about one in twenty, the declared value sits about 1.645 standard deviations above the mean: 48.6 + 1.645 × 1.72 ≈ **51.4 dB(A)**.

That is only about 0.8 dB below the present declaration of 52.2 dB(A), although the new fan's mean is 1.5 dB lower, because its wider spread eats most of the gain. The quieter fan may still be worth having for the units' average sound, which is what users hear, but the declaration improves only slightly unless the supplier can narrow the spread. The comparison shows why a supplier's spread belongs in the purchase specification alongside its mean, and why the end-of-line data, which show the spread of every unit built, are as valuable to the purchasing team as to the quality team.
