---
book: product-acoustics-by-the-numbers
chapterSlug: the-driver-output-and-excursion
order: 5
title: "The driver: sensitivity, output and excursion"
description: "Work out how far a small cone must move to make a given level at a given frequency, read sensitivity and power, see why low notes run out of excursion, and catch an alarm chime pitched too low."
draft: false
---

A small loudspeaker's limits are set by physics that no amount of careful enclosure design can change. To radiate a given sound pressure at a distance, a small cone must move a certain volume of air, and at low frequencies the volume it must move rises steeply: halving the frequency needs four times the cone excursion for the same level. Every driver has a maximum excursion beyond which its motor and suspension stop behaving linearly and it distorts, buzzes or damages itself. That excursion limit, not the amplifier or the enclosure, is what decides how loud a small product can play its lowest notes.

This chapter relates a cone's excursion to the sound pressure it produces, sets out the driver's sensitivity and the power it needs, shows how the excursion limit caps the output at low frequencies, and discusses equalisation. The running case finds that an alarm chime added late to AP-40's firmware, specified at 85 dB at 1 m with a fundamental near 300 Hz, needed about three times the driver's excursion limit, and buzzed on the first prototype.

## Volume velocity and pressure

A small source radiating into open space produces, far from it, a sound pressure proportional to the rate of change of the volume of air it pushes. For a cone of area S_d moving sinusoidally with peak excursion x at frequency f, the peak volume velocity is S_d × 2πf × x, and the peak pressure at distance r, in free space and below the frequency where the cone becomes directional, is:

```figure
type: formula
title: Cone excursion needed for a given sound pressure, small source in free space
formula: p_peak ≈ ρ × (2πf)² × S_d × x_peak ÷ (4π × r);   so x_peak ≈ 4π × r × p_peak ÷ (ρ × (2πf)² × S_d)
caption: This is an illustration for AP-40's prompt driver, with S_d = 8 cm², at 1 m. A level of 68 dB SPL is an RMS pressure of about 0.050 Pa, a peak of about 0.071 Pa. Mounting in a baffle or near a surface raises the pressure for the same excursion, as Chapter 8 shows; free space is the conservative case.
- p_peak | Peak sound pressure at distance r, Pa
- S_d | Cone's effective radiating area, m²
- x_peak | Cone's peak excursion, m
- ρ | Density of air, about 1.2 kg/m³
step: At 1,000 Hz: x ≈ 0.024 mm for 68 dB
step: At 300 Hz: x ≈ 0.26 mm for 68 dB
step: At 200 Hz: x ≈ 0.59 mm for 68 dB
```

The excursion needed for a given pressure rises with the inverse square of frequency: an octave lower needs four times the excursion, or 12 dB more for the same excursion. This is the same physics as the closed box's 12 dB per octave roll-off below resonance, seen from the cone's side.

## Sensitivity and power

A driver's **sensitivity** is the sound pressure level it produces on axis at 1 m with a stated input, commonly 1 W into its nominal impedance or a stated voltage, in its passband. This is an illustration. AP-40's prompt driver has a sensitivity of about **78 dB** at 1 W and 1 m. Reaching the prompt requirement of 68 dB at 1 m in the passband needs 10 dB less, about **0.1 W**, well within a small amplifier's capability. Sensitivity is a passband figure: below the system's resonance, the same power produces less sound, as Chapter 4's response showed.

Small drivers are inefficient: most of the electrical power becomes heat in the voice coil, and only a small fraction becomes sound. That heat sets a second limit, the driver's thermal power rating, which matters for long, loud signals more than for short prompts.

## The excursion limit

Every driver has a **linear excursion limit**, X_max, the peak excursion beyond which the voice coil begins to leave the magnetic gap or the suspension stiffens sharply, and distortion rises steeply. Beyond it, at some larger excursion, the cone or coil strikes the magnet structure, producing an audible buzz and risking damage. This is an illustration. AP-40's driver has an X_max of about **0.6 mm**.

Running the excursion formula backwards gives the highest level the driver can produce at each frequency with x = X_max:

```figure
type: line
title: AP-40's prompt driver: highest level at X_max, against an alarm requirement
x: Frequency, Hz
y: Sound pressure level at 1 m, dB
legend: Highest level at X_max, free space | Alarm requirement, 85 dB at 1 m
ymin: 60
ymax: 100
caption: This is an illustration from the excursion formula with S_d = 8 cm² and X_max = 0.6 mm. The level available at the excursion limit rises 12 dB per octave; below about 500 Hz the driver cannot reach 85 dB at 1 m however much power it is given.
- 200 | 68.2 | 85
- 300 | 75.2 | 85
- 400 | 80.2 | 85
- 500 | 84.1 | 85
- 600 | 87.2 | 85
- 800 | 92.2 | 85
- 1000 | 96.1 | 85
```

For the prompts at 68 dB, the limit is no difficulty: even at 300 Hz the driver needs only about 0.26 mm, less than half of X_max. For anything louder at low frequencies, it becomes the governing constraint.

## The running case: the alarm chime

This is an illustration. Late in development, the product team added an **alarm chime** for a fault condition, to be heard from another room. Its sound designer composed a pleasant three-note chime with a fundamental near **300 Hz**, and the requirement was written as **85 dB SPL at 1 m**, 17 dB louder than the prompts.

## The error: a low note beyond the excursion limit

At 300 Hz, reaching 85 dB at 1 m needs a peak excursion of about **1.85 mm**, about three times the driver's X_max of 0.6 mm. The driver's highest level at its excursion limit at 300 Hz is only about 75.2 dB. On the first prototype with the new firmware, the amplifier's output was set to the level that would have given 85 dB in the passband, and the chime buzzed loudly as the voice coil struck its back plate, with heavy distortion even on its higher notes.

```figure
type: bars
title: The alarm chime: requirement and what the driver can give at X_max, dB at 1 m
unit: dB
max: 100
caption: This is an illustration. At 300 Hz the driver runs out of excursion about 10 dB short of the requirement; with the chime's fundamental moved to about 800 Hz, the requirement needs well under half the excursion limit.
- Requirement | 85.0
- Highest at X_max, fundamental at 300 Hz | 75.2
- *Highest at X_max, fundamental at 800 Hz | 92.2
```

The check that caught it, after the buzz, was the excursion calculation, which needs only S_d, X_max, the frequency and the required level. The fix was to re-voice the chime with its fundamental near **800 Hz**, where 85 dB at 1 m needs only about 0.26 mm of excursion, and to add an excursion limiter in the firmware that reduces the level of any content below about 500 Hz if it would exceed X_max. The chime still sounded warm, because the ear infers a low pitch from a sound's harmonics even when its fundamental is weak, an effect sound designers use routinely for small speakers. The general lesson is that a small driver's low-frequency output is set by its excursion, and that any sound designed for a product, prompts, chimes or alarms, must be checked against the excursion limit at its lowest frequencies before it is approved.

## Equalisation

Electronic **equalisation** can flatten a small speaker's response, boosting the frequencies where the enclosure and driver roll off. It costs power and excursion. This is an illustration. AP-40's closed-box response is about 10.5 dB down at 300 Hz, so equalising the prompts flat to 300 Hz needs a 10.5 dB boost there, about eleven times the power at that frequency, about 1.1 W instead of 0.1 W, and the excursion of about 0.26 mm that the formula gives for 68 dB at 300 Hz. Both are within the driver's and amplifier's limits for the prompts. For the alarm chime, no equalisation could help, because the excursion, not the response, was the limit.

Equalisation also changes with the driver's tolerances, as Chapter 4 noted, and a boost designed for a nominal driver can over-drive a unit at the low end of its tolerance. A limiter that watches the predicted excursion, using a model of the driver, protects every unit. Many small-speaker amplifiers now include such limiters, which need the driver's parameters to be programmed correctly.

## Distortion and rattles

Below X_max, distortion is low; above it, it rises quickly. But a product can sound distorted well below the driver's limit if something else vibrates: a loose grille, a cable touching the cone, a panel that rattles at a resonance, a screw that is not tight. Rattles are excited most strongly by the loudest, lowest content, which is why the alarm chime also revealed a rattling grille clip on the same prototype. A rattle test, sweeping a sine tone slowly through the band at the maximum drive level and listening, or measuring the distortion at each frequency, is part of every prototype's acoustic check.

## Why small sources struggle at low frequencies

The formula has a simple physical meaning. A small cone pushing air back and forth produces sound by compressing the air around it, and far away the pressure depends on how quickly the volume of displaced air changes, its acceleration. At a fixed excursion, the cone's acceleration rises with the square of frequency, so at low frequencies a small cone, however far it moves, barely compresses the air: most of the air near the cone simply sloshes round it. The radiation resistance of Chapter 2, small for a small source at low frequencies, is the circuit's way of saying the same thing. The only ways to produce more low-frequency sound are more area, more excursion, or help from the surroundings, a baffle, a nearby wall or a resonator, each of which the following chapters use.

## Heat and long signals

The power that does not become sound heats the voice coil. For short prompts at 0.1 W, the temperature rise is negligible. For a long, loud signal, music or a sustained alarm, the coil heats up, its resistance rises, and the driver draws less current from the same voltage, so its output falls: a loss called **power compression**, which can reach several decibels in small drivers driven hard. Sustained overheating damages the coil's adhesive and insulation. The driver's thermal rating, often stated as a power for a stated test signal and duration, and its thermal time constants, set how long and how hard it can be driven. AP-40's alarm chime, repeated every few seconds until acknowledged, has a duty cycle that matters: a sound that is harmless for a second may overheat the coil over ten minutes. The firmware's limiter should therefore watch the coil's predicted temperature as well as its excursion.

## Measuring excursion

A datasheet's X_max is a definition as well as a measurement, and makers define it in different ways: some by the geometry of the voice coil and the magnetic gap, the distance the coil can move before part of it leaves the gap; others by the excursion at which distortion reaches a stated level. The two can differ considerably. When excursion is the binding limit, as for the alarm chime, it is worth measuring. A **laser displacement sensor** aimed at the cone measures its excursion directly while the driver plays a test tone; a distortion measurement with a microphone shows where the output stops being clean. Running the driver at increasing levels at the lowest frequency of interest, measuring both, gives the practical limit for the driver in its chamber, which is the number the firmware's limiter needs.

## Choosing the driver

The excursion formula points to the alternatives when a driver cannot reach a requirement. A larger cone, with more area, moves more air for the same excursion: doubling S_d gives 6 dB more for the same excursion. A driver with a longer X_max gives more at the same size, usually at some cost in sensitivity or price. Two drivers in parallel double the area. Moving the content up in frequency, as with the chime, uses the 12 dB per octave in the designer's favour. And lowering the requirement may be right: 85 dB at 1 m from a purifier for a fault alarm was the team's guess at what would be heard from another room, and a calculation with the room of Chapter 1 might have shown a lower level would do.

## Writing the sound designers' brief

The chime error was not an engineering mistake so much as a missing handover: the sound designer had never been told what the driver could do. The fix included a short brief for anyone creating sounds for AP-40, drawn straight from this chapter's numbers: the prompt level and the alarm level, the frequency below which content must be avoided at each, about 300 Hz for prompts and about 600 Hz for anything at the alarm's level, the response's shape so that sounds are voiced for the product rather than for studio monitors, and the limiter's behaviour, so that a designer knows what will happen to content that breaks the rules. With the brief, sounds arrive in a form the product can play, and the excursion check becomes a routine approval step rather than a buzz discovered on a prototype.

## Exercise: how low can the prompts go?

AP-40's prompts must reach 68 dB at 1 m. Down to what frequency can the driver produce that level within its excursion limit of 0.6 mm? What happens below it?

**Worked answer.** The level available at X_max falls 12 dB per octave, and the line above shows it is about 68.2 dB at 200 Hz, so the driver can reach 68 dB down to about **200 Hz**, but only at its excursion limit there. At 300 Hz, it needs about 0.26 mm, comfortably within the limit.

Below about 200 Hz, the driver cannot reach 68 dB however much it is driven, and the excursion limiter would reduce the level. The prompts' requirement starts at 300 Hz, which leaves margin, and speech has little energy below about 200 Hz anyway. The calculation gives a design rule for the sound designers: prompts and chimes for AP-40 should keep their significant content above about 300 Hz, and anything louder than 68 dB should keep it higher still.
