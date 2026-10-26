---
book: product-acoustics-by-the-numbers
chapterSlug: writing-the-acoustic-requirements
order: 1
title: "Writing a product's acoustic requirements"
description: "Turn quiet, clear and able to hear into numbers: sound power by setting, sound pressure at a listener, levels in a real room, and catch a prompt speaker's level measured 2 cm from its grille."
draft: false
---

A product brief rarely states its acoustic requirements in a form anyone can design to. "Whisper quiet", "clear voice prompts" and "hears you across the room" are aims, not requirements, and they leave every supplier and every engineer free to interpret them in the way that suits their part. A requirement has a quantity, a value, a position, an operating condition and a method of measurement. Written that way, it can be designed to, tested, quoted against and argued about with numbers rather than opinions.

This chapter sets out the three acoustic jobs a product can have, being quiet, making sound and listening, and how each is written as a measurable requirement. It introduces the room the product will live in, because levels at a listener depend on it, and it sets AP-40's requirements, which the rest of the book designs to. The running case finds that the first sample of AP-40's prompt speaker met a "85 dB" requirement measured 2 cm from its grille, and would have produced about 51 dB at the 1 m the requirement intended.

## Three acoustic jobs

AP-40 has all three jobs a product can have.

- **Be quiet.** Its fan makes noise, which its users will judge most critically at night. The requirement is a limit on the noise it emits at each fan setting.
- **Make sound.** Its loudspeaker speaks short prompts: filter warnings, mode changes, confirmations. The requirement is a level and frequency range at the listener.
- **Listen.** Its microphone must pick up a spoken command over the product's own fan noise. The requirement is a ratio of speech to noise at the microphone.

The three interact. The fan's noise is the background against which the prompts must be heard and against which the microphone must pick out speech, so the noise requirement constrains the other two.

## Being quiet: sound power

A product's noise emission is best specified as its **sound power level**, as Machine Noise Control by the Numbers explains for machines: a property of the product in a stated operating condition, independent of the room. Sound pressure at a distance can also be specified, but only with the room or test environment stated, because the same product produces different levels in different rooms.

This is an illustration. AP-40's fan noise rises steeply with speed. Its A-weighted sound power level is about **55.0 dB(A)** at its maximum of 1,200 rpm, and, following the fan scaling relationship that Chapter 9 explains, about **46.2 dB(A)** at 800 rpm and **36.0 dB(A)** at its night setting of 500 rpm. Those three figures, measured to a named standard, are AP-40's noise requirements.

## The room

The levels a user hears depend on the room. This is an illustration. A living room 5 × 4 m and 2.6 m high, furnished, with a reverberation time of about 0.5 s, has about 16.7 m² of absorption by Sabine's formula and a room constant of about 20.7 m². Using the room equation, with AP-40 standing on the floor:

```figure
type: compare
title: AP-40's illustrative fan noise in the living room, by setting
cols: Sound power | At 1 m | At 2 m
caption: This is an illustration from the room equation, with a room constant of about 20.7 m² and AP-40 on the floor. Beyond about 0.9 m the room's reverberant sound dominates, so moving away helps little.
- Night, 500 rpm | 36.0 dB(A) | 31.5 dB(A) | 29.7 dB(A)
- Medium, 800 rpm | 46.2 dB(A) | 41.7 dB(A) | 39.9 dB(A)
- *Maximum, 1,200 rpm | 55.0 dB(A) | 50.5 dB(A) | 48.7 dB(A)
```

A small, furnished room has a short critical distance, here about 0.9 m, so most listening positions are in its reverberant field and the level changes little with distance. That is why a product's sound power, not its level at one distance in a test room, is the figure that predicts what users will hear in their own homes.

## Making sound: level at the listener

A loudspeaker's output is specified as a **sound pressure level at a stated distance**, on a stated axis, in a stated environment, at stated frequencies or over a stated band, with a stated input. The usual reference is 1 m on axis in a free field, or a half-space where the product is designed to stand on or in a surface.

This is an illustration. AP-40's brief asked that prompts be "clearly audible over the fan at maximum". The team turned that into a requirement: **68 dB SPL at 1 m on axis** in a free field, over the band from about 300 Hz to 8 kHz, at the prompt's nominal drive level. In the living room, that prompt level corresponds to about 69.7 dB at 2 m, about 21 dB above the fan's 48.7 dB(A) at maximum, which the team judged ample for short prompts.

## Listening: speech to noise at the microphone

A microphone's job is specified by the **signal-to-noise ratio** it must achieve: the level of the wanted speech at the microphone compared with the level of everything else, in the frequency band that matters for speech. The ratio a voice-recognition system needs is set by its supplier and is part of that system's data, not something the product designer chooses. The product designer's job is to deliver it: to place the microphone where the speech is strong and the product's own noise weak, and to design its port so that it does not distort the speech band, as Chapter 7 shows.

This is an illustration. A person speaking normally produces roughly 60 dB at 1 m in front of them; at 3 m in open space that falls to about 50.5 dB, and in a room the reverberant sound adds a little. AP-40's microphone, on its top panel, sits much closer to its own fan than to its user, which is the central difficulty of Chapter 7.

## The running case: the prompt speaker's sample

This is an illustration. The prompt speaker's supplier was given the requirement as "**85 dB SPL**, voice band", without the distance, axis or environment written beside it, because the brief's author assumed 1 m on axis was obvious. The supplier's first sample was tested and reported as meeting 85 dB SPL. Its test report, when it arrived, showed the measurement microphone **2 cm** from the grille.

## The error: a level without a distance

Close to a small source, sound pressure falls with distance much faster than it does far away, and very close to it, in its near field, the level is high and varies from point to point. As a rough guide in the far field, the level falls by 20 × log₁₀ of the distance ratio, so moving from 2 cm to 1 m lowers it by about 20 × log₁₀(50) ≈ **34 dB**. The sample's 85 dB at 2 cm corresponds to roughly **51 dB** at 1 m: about 17 dB short of the 68 dB the team actually needed.

```figure
type: bars
title: The prompt speaker: requirement and sample, dB SPL
unit: dB
max: 90
caption: This is an illustration. The sample met "85 dB" at 2 cm; at the intended 1 m it gives about 51 dB, and in the room at 2 m about 52.7 dB, only about 4 dB above the fan at maximum.
- Sample, as reported, at 2 cm | 85.0
- *Requirement, at 1 m on axis | 68.0
- Sample, estimated at 1 m | 51.0
```

In the living room, the sample's prompts would reach a listener at 2 m at about 52.7 dB, only about 4 dB above the fan at maximum: barely audible, and unintelligible for anyone not standing beside the product. The check that caught it was reading the test report's measurement conditions before accepting the result. The fix was to restate the requirement in full, 68 dB SPL at 1 m on axis, free field, 300 Hz to 8 kHz, at the stated drive, and to ask the supplier for a larger driver or a more sensitive one, which Chapter 5 sizes. The general lesson is that a sound pressure figure without its distance, axis and environment is not a requirement, and that a supplier will measure it wherever the number looks best.

## A requirements table

AP-40's acoustic requirements, as finally written, fit on one table, and every row has a quantity, a value, a condition and a method.

- **Noise emission**: A-weighted sound power level at each fan setting, at most 36, 47 and 55 dB(A) at night, medium and maximum, measured to a named sound power standard, declared as Chapter 10 describes.
- **Tonal content**: no prominent tone at the fan's blade-passing frequency, assessed by a stated method, because tones are judged more harshly than broadband noise.
- **Prompt level**: 68 dB SPL at 1 m on axis, free field, 300 Hz to 8 kHz, at the nominal drive.
- **Prompt response**: within a stated tolerance over that band, so that prompts sound natural and are intelligible.
- **Microphone**: the voice system supplier's signal-to-noise ratio at the microphone, with the user at 3 m and the fan at maximum.
- **Mechanical**: no rattles or buzzes from panels, grilles or the speaker at any drive level and fan setting.

Each requirement then becomes a test, which Chapter 10 sets out, so that a sample, a pilot build and a production unit can each be checked against it.

## How noise is judged

People do not judge a product's noise by its A-weighted level alone. Two products with the same sound power can be judged very differently if one has a steady, smooth broadband sound and the other a whine, a hum, a rattle or a regular pulsing. **Tones**, single frequencies standing out from the broadband noise, are the commonest complaint about fans and motors, and they are noticed at levels well below the broadband noise around them. **Fluctuations**, such as a fan's beating when two speeds are close, and **rattles**, intermittent impacts from loose parts, draw attention because they change. And noise in the frequency range where hearing is most sensitive, roughly 1 to 5 kHz, sounds louder and sharper than the same level lower down.

Many product makers therefore run **listening tests**, in which a panel of listeners rates recordings of prototypes, and track measures of sound quality alongside the sound power. For AP-40, the requirements table includes a tonal limit as well as the sound power, because a purifier with a whining blade-pass tone at night will be returned whatever its decibels. The design chapters that follow come back to tones repeatedly: in ports and resonators, in the air path and above all in the fan.

```figure
type: checklist
title: Is it a requirement yet?
caption: A statement that fails any of these checks is an aim, not a requirement. The prompt speaker's "85 dB SPL, voice band" failed four of them.
- Quantity | Sound power, sound pressure or signal-to-noise ratio, named
- Value and tolerance | A number with its limit or its tolerance
- Position | Distance and axis, or the measurement surface
- Environment | Free field, half-space, a test room, or a stated real room
- Operating condition | Fan setting, drive level, input signal
- Frequency range and weighting | Band, octave bands or A-weighting, stated
- Method | The standard or test procedure that will be used to check it
- x Level stated without distance or environment | The prompt speaker's first requirement
```

## When requirements conflict

The three jobs pull against each other, and writing them as numbers is what makes the conflicts visible. A quieter fan helps the microphone and the prompts but may need a larger fan running slower, which costs space and money. A louder prompt speaker needs a larger driver or a larger enclosure, which competes with the air path for space inside the cabinet. A microphone placed far from the fan may be close to the speaker, which then interferes with it when the product talks while listening. None of these trade-offs can be made sensibly with adjectives; each can be made with the numbers in the requirements table and the calculations of the chapters that follow.

## Requirements for suppliers

Most of a product's acoustic parts are bought: the fan, the motor, the loudspeaker, the microphone, the grille material, the gaskets. Each supplier needs its own part of the requirements, written in the same form, so that its sample can be tested against something. A loudspeaker supplier needs the level, distance, axis, band and drive, and the enclosure volume the driver will have. A fan supplier needs the air flow and pressure at each setting and the sound power limit at each. A microphone supplier needs the sensitivity, noise floor and frequency response the voice system requires. Passing each supplier a fragment of the brief's adjectives, as happened with the prompt speaker, guarantees samples measured to each supplier's own convenience.

## Units and weightings in requirements

Product noise is usually specified A-weighted, as here, because it predicts annoyance and audibility reasonably for broadband noise. Loudspeaker and microphone requirements are usually unweighted, in dB SPL, by frequency or over a band, because they describe a signal's level, not its effect on hearing. A requirements table should say which applies to each row. A fan requirement of "55 dB" without its weighting, or a prompt requirement of "68 dB(A)" when an unweighted level was meant, invites exactly the kind of misreading this chapter's error illustrates.

## Exercise: the night-time prompt

At night, AP-40 runs at 500 rpm and its prompts could be quieter, so as not to wake anyone. If the prompts were set 15 dB above the fan's level at 2 m in the living room, what level would that be, and how much lower than the daytime prompt is it? What does that mean for the drive level?

**Worked answer.** At night, the fan produces about 29.7 dB(A) at 2 m, so prompts 15 dB above it would be about **44.7 dB** at 2 m. The daytime prompt is about 69.7 dB at 2 m, so the night prompt is about **25 dB** lower.

Because the speaker's output follows its drive level, roughly 1:1 in decibels within its linear range, the night prompt needs about 25 dB less drive, about an eighteenth of the voltage. That is a software setting, but it should be written into the requirements as a second prompt level, with its own test, so that it is not lost when the firmware changes.
