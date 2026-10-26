---
book: product-acoustics-by-the-numbers
chapterSlug: microphone-ports-and-hearing-over-the-fan
order: 7
title: "Microphone ports and hearing over the fan"
description: "Design a microphone's acoustic path as a resonator kept above the speech band, place it where speech beats the product's own noise, and catch a gasket channel that put a peak at 6.4 kHz."
draft: false
---

A microphone in a product never hears the world directly. Sound reaches it through a hole in the housing, a channel in a gasket, a hole in the circuit board and a tiny cavity in front of its diaphragm, and that path is an acoustic circuit with a resonance of its own. Designed well, the resonance sits above the frequencies that matter and the path is transparent. Designed carelessly, it puts a peak in the middle of the speech band, colouring everything the product hears. And wherever the path leads, the microphone hears the product's own noise as well as its user, often from much closer.

This chapter models a microphone's acoustic path as a Helmholtz resonator, shows how its dimensions set the resonance, and then turns to placement: how far the microphone is from the user and from the product's noise sources, and what that does to the signal-to-noise ratio. The running case finds that a gasket channel, lengthened to move AP-40's microphone away from a rib, lowered its path's resonance from about 12.0 kHz to about 6.4 kHz, inside the wideband speech range the voice system relied on.

## The microphone's acoustic path

AP-40 uses a **bottom-port MEMS microphone**, a small silicon microphone soldered to the circuit board, with its sound inlet through a hole in the board beneath it. Sound reaches it through four elements in series:

- a **hole in the top panel** of the housing, 1.5 mm across and 1.0 mm long;
- a **channel through a gasket** that seals the board to the panel;
- a **hole in the circuit board**, 0.8 mm across and 1.0 mm long;
- a small **cavity** formed by the gasket's opening and the microphone's own front volume, about 4 mm³ in all.

The three openings are acoustic masses in series; the cavity is a compliance. Together they form a Helmholtz resonator driven by the sound outside, with the microphone's diaphragm sensing the pressure in the cavity.

```figure
type: formula
title: Resonance of a microphone's acoustic path
formula: f_r = 1 ÷ (2π × √(M_total × C)), with M_total = Σ ρ × L'ᵢ ÷ Sᵢ and C = V ÷ (ρ × c²)
caption: This is an illustration for AP-40's microphone path. End corrections of about 1.7a are applied to the panel and board holes, which open into larger spaces at both ends; the gasket channel is taken at its physical length.
- L'ᵢ, Sᵢ | Effective length and area of each opening in series
- V | Cavity volume in front of the diaphragm, m³
step: Panel hole 1.5 mm × 1.0 mm: about 1.5 × 10³ kg/m⁴; board hole 0.8 mm × 1.0 mm: about 4.0 × 10³ kg/m⁴
step: Gasket channel 1.5 mm across, 1 mm long: about 0.7 × 10³ kg/m⁴; total about 6.2 × 10³ kg/m⁴
step: With V ≈ 4 mm³: f_r ≈ 12.0 kHz
```

The narrowest opening, here the hole in the circuit board, contributes most of the mass, because acoustic mass rises with the inverse of area. The cavity's volume matters as much: every cubic millimetre of gasket opening around the microphone's port adds compliance and lowers the resonance.

## Why the resonance must be high

Below its resonance, the path passes sound unchanged; near it, the path's response rises to a peak, often several decibels high unless damped; above it, the response falls away. For a microphone used for speech, the resonance should sit above the speech band with margin. Wideband voice systems use frequencies up to about 7 or 8 kHz, and many speech-recognition systems are trained on audio with content to that range or beyond, so AP-40's acoustic requirements put the path's resonance above **10 kHz**.

## The error: a longer gasket channel

This is an illustration. During the mechanical design, a rib inside the top panel clashed with the microphone's position. The microphone was moved 5 mm along the board, and the gasket's channel was lengthened to reach it: a channel about **6 mm** long and **1.0 mm** across, routed under the rib. The gasket's opening round the microphone grew slightly too, raising the cavity's volume to about 6 mm³.

The channel's acoustic mass rose from about 0.7 × 10³ to about 9.2 × 10³ kg/m⁴, more than doubling the path's total, and the larger cavity added compliance. The resonance fell from about 12.0 kHz to about **6.4 kHz**. The first prototypes' voice recognition performed worse than the development board's, and a measurement of the microphone's response in the housing showed a peak of several decibels at about 6.4 kHz, emphasising sibilants and the fan's high-frequency noise alike.

```figure
type: compare
title: AP-40's microphone path: resonance by design
cols: Gasket channel | Cavity volume | Resonance
caption: This is an illustration with the panel and board holes unchanged. Length and narrowness in the channel, and volume in the cavity, each pull the resonance down into the speech band.
- *Original, microphone under the hole | 1.5 mm across, 1 mm long | 4 mm³ | 12.0 kHz
- Moved under the rib, as first built | 1.0 mm across, 6 mm long | 6 mm³ | 6.4 kHz
- Moved, wider channel, cavity restored | 2.0 mm across, 6 mm long | 4 mm³ | 10.7 kHz
```

The check that would have caught it was the acoustic path's calculation, attached to the microphone's placement in the mechanical design, so that any change to the gasket triggered a recalculation. The fix widened the channel to 2.0 mm and trimmed the gasket's opening back to restore the 4 mm³ cavity, which put the resonance at about **10.7 kHz**, just above the 10 kHz requirement. A second option, moving the panel hole to sit over the microphone's new position, would have restored the original 12.0 kHz, and was adopted for the next tooling revision. The general lesson is that a microphone's path is an acoustic component with a resonance, and its dimensions, especially narrow passages and extra volume, are controlled as tightly as the microphone itself.

## Damping and protection

A mesh over the panel hole, a common dust and water barrier, adds acoustic resistance in series with the path's mass, which damps the resonance's peak, a useful side effect. Too much resistance, though, rolls off the high frequencies and adds noise: the mesh's resistance generates thermal noise of its own, small but significant for low-noise microphones. Mesh makers publish acoustic resistance values, and the microphone maker's application notes show the effect on sensitivity and noise. For AP-40, a fine dust mesh of low resistance was added over the panel hole, lowering the remaining peak to about a decibel.

## Hearing over the fan

The microphone's second problem is placement. AP-40's user speaks from across the room; its fan noise comes from inside the product, centimetres away. This is an illustration. A person speaking normally from 3 m in the living room of Chapter 1 produces about **61.2 dB** at AP-40, direct and reverberant sound together. At maximum fan speed, with the air-path treatment of Chapter 6, the outlet path radiates about 46.0 dB(A) of sound power and the inlet path about 48.0 dB(A).

With the microphone on the top panel, **0.15 m** from the outlet grille, the outlet's direct sound at the microphone is about 54.6 dB(A) and the total noise, with the inlet's contribution, about 55.3 dB(A): a speech-to-noise ratio of only about **5.9 dB**. Moved to the far corner of the top panel, **0.4 m** from the outlet grille, the outlet's contribution falls to about 46.7 dB(A), the total to about 50.0 dB(A), and the ratio rises to about **11.2 dB**, a gain of more than 5 dB from moving the microphone 25 cm.

```figure
type: bars
title: Speech-to-noise ratio at AP-40's microphone, fan at maximum, dB
unit: dB
max: 14
caption: This is an illustration with a talker at 3 m in the living room. Close to the outlet grille the fan's direct sound swamps the speech; further away the room's reverberant field sets the noise.
- Microphone 0.15 m from the outlet grille | 5.9
- *Microphone 0.4 m from the outlet grille | 11.2
```

The ratio a voice system needs is its supplier's figure, but the direction of every design choice is clear: microphones go as far from the product's noise sources as the housing allows, out of the air jets, and on the side of the product that faces the user. Many products also lower their fan speed briefly when they detect a wake word, buying several decibels for the command that follows, an inexpensive firmware measure that the 50 log rule of Chapter 6 makes powerful: a 20% reduction in fan speed for a few seconds lowers the fan's sound power by about 4.8 dB, and the noise at the microphone by nearly as much where the fan dominates.

## Air flow over the port

A microphone port in a moving air stream hears the air itself: turbulence over the port's opening produces pressure fluctuations that appear as low-frequency noise, the same mechanism as wind noise on a phone call outdoors. AP-40's outlet air flows upwards across the top panel, and a microphone in that stream would hear it at every fan speed. Keeping the port out of the outlet's jet, or recessing it behind a small baffle, avoids the problem. A strip of tissue taped near the proposed port position on a running prototype shows at a glance whether the air is moving there. A mesh over the port also helps, by breaking up the turbulence at the opening.

## Hearing itself speak

When AP-40 speaks a prompt while its microphone is listening, the microphone hears the prompt far more loudly than any user, through the air and through the housing. Voice systems use **acoustic echo cancellation** to subtract the product's own output from the microphone's signal, but it works best when the coupling is linear and steady. Mechanical coupling through the chassis, a speaker frame that shakes the circuit board, or a rattle excited by the speaker, adds distortion that the canceller cannot remove. The speaker and microphone should therefore be mounted with resilient gaskets, as far apart as the housing allows, and the housing checked for rattles at the prompt level, as Chapter 5 recommended.

## The microphone's own limits

A MEMS microphone's datasheet gives three figures that the product's acoustics must respect. Its **sensitivity**, the electrical output for a stated sound pressure, sets the signal level the electronics receive. Its **self-noise**, often expressed as a signal-to-noise ratio for a reference level, sets the quietest sound it can resolve, which matters for a quiet room at night and for a distant talker. And its **acoustic overload point**, the level at which its distortion reaches a stated value, sets the loudest sound it can handle cleanly.

This is an illustration. AP-40's prompt speaker produces 68 dB at 1 m; if the microphone were about 0.2 m from the speaker in its direct field, the prompt would reach it at roughly 68 + 20 × log₁₀(5) ≈ 82 dB, before any coupling through the housing. That is far below the overload point of typical MEMS microphones, but the alarm chime of Chapter 5, at 85 dB at 1 m, would reach about 99 dB at the same position. The calculation should be made for the loudest sound the product makes, at the microphone's actual position, and compared with the microphone maker's figure, because a microphone that overloads during the product's own alarm cannot hear the user's command to silence it.

## Measuring the path in the housing

The design calculation is checked by measuring the microphone's response in the housing. The product, or a housing sample with the board installed, is placed in a free field or a small test chamber beside a reference measurement microphone, and both are exposed to the same sweep or noise signal from a loudspeaker. The difference between the product microphone's response and the reference's, after allowing for the bare microphone's own datasheet response, is the acoustic path's effect: its resonance, its damping and any leaks.

A leak in the gasket is the most common surprise. A gap between the gasket and the board or panel connects the microphone's cavity to the inside of the product, where the fan's noise is much louder than outside, and the microphone hears the inside of the cabinet. A leak usually shows as extra low-frequency noise with the fan running and a change in response at low frequencies. The production test of Chapter 10 includes a check for it, because a gasket that seals on the prototype bench may not seal on every unit off the assembly line.

## Microphone arrays

Many voice products use two or more microphones, whose signals are combined to favour sound from the user's direction and reject sound from elsewhere, including the product's own fan. An array's performance depends on each microphone's path being consistent with the others: two paths with resonances a few hundred hertz apart, or sensitivities a decibel apart, degrade the array's directional processing. Each path should be designed identically where possible, and the production test of Chapter 10 should check that the microphones match within the array processing's tolerance.

## Exercise: a thinner circuit board

A cost reduction proposes a 0.8 mm circuit board instead of 1.0 mm, shortening the board hole. With the original design, panel hole and gasket unchanged, the board hole's acoustic mass falls from about 4.0 × 10³ to about 3.5 × 10³ kg/m⁴, taking the path's total from about 6.2 × 10³ to about 5.75 × 10³ kg/m⁴. Does the resonance rise or fall, and by about how much?

**Worked answer.** The resonance is proportional to 1 ÷ √M_total, so it rises by √(6.23 ÷ 5.75) ≈ 1.04, about 4%, from about 12.0 kHz to about **12.5 kHz**. The change is small and in the right direction: a shorter neck means less mass and a higher resonance.

The thinner board is acoustically harmless here. But the example shows the sensitivity of the calculation to the narrowest passage: the board hole carries about two-thirds of the path's mass, so its diameter and length, which are set by the board's design rules rather than by the acoustic engineer, should be fixed on the board drawing and checked whenever the board is revised.
