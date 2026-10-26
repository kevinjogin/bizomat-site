---
book: product-acoustics-by-the-numbers
chapterSlug: radiation-baffles-and-directivity
order: 8
title: "Radiation, baffles and directivity"
description: "See when a small source radiates evenly and when it beams, how a product's face acts as a baffle, how walls change the output, and catch a prompt speaker verified only on its axis."
draft: false
---

A loudspeaker's response measured on its axis at 1 m is only part of the story. A listener is rarely on the axis: they sit beside the product, stand across the room, or walk past it. How a product's sound spreads in different directions depends on the size of the source compared with the wavelength, on the product's cabinet, which acts as a baffle, and on the room's surfaces near the product. At low frequencies, a small speaker radiates almost equally in all directions; at high frequencies, it beams forward. The cabinet adds to the forward sound at high frequencies and lets it wrap round at low ones. And a product placed against a wall or in a corner gains low-frequency output that a test bench in open space never shows.

This chapter explains the parameter ka that governs a source's directivity, the baffle effect of a product's face, and the effect of nearby surfaces, and applies them to AP-40's prompt speaker. The running case finds that the prompt speaker, mounted facing up through the top panel, was verified only on its axis, above the product, while a seated listener 2 m away heard it about 76° off axis, where the top of the prompt band fell by up to about 6 dB.

## Size against wavelength: ka

A vibrating cone's directivity is governed by **ka**: the wavenumber k = 2π ÷ λ, multiplied by the cone's effective radius a. When ka is well below 1, the cone is small compared with the wavelength and radiates almost uniformly. When ka approaches and exceeds 1, sound from different parts of the cone arrives off axis with different delays, partly cancelling, and the response falls away from the axis.

```figure
type: formula
title: Directivity of a cone in a baffle
formula: ka = 2π × f × a ÷ c;   off-axis response ≈ 2 × J₁(ka sin θ) ÷ (ka sin θ), for a rigid piston in a large baffle
caption: This is an illustration for AP-40's 40 mm driver, with an effective radiating area of about 8 cm², an effective radius of about 16 mm. J₁ is the first-order Bessel function. A real cone is not rigid at high frequencies, and its directivity is measured.
- a | Effective radius of the radiating area, m
- θ | Angle from the axis
- ka | Size of the source relative to the wavelength
step: ka = 1 at f = c ÷ (2πa) ≈ 343 ÷ (2π × 0.016) ≈ 3.4 kHz
step: At 76° off axis, about −1.4 dB at 4 kHz and −6.4 dB at 8 kHz
step: At 31° off axis, about −0.4 dB at 4 kHz and −1.6 dB at 8 kHz
```

For AP-40's small driver, ka reaches 1 near 3.4 kHz, so the driver radiates almost evenly through most of the speech band and begins to beam only in the top octave. A larger driver beams lower: a 65 mm driver, with an effective radius of about 26 mm, reaches ka = 1 near 2.1 kHz, and at 76° off axis loses about 4 dB at 4 kHz in the same simple model. That is one reason small products use small drivers for voice: they spread their sound more evenly.

## The cabinet as a baffle

At high frequencies, a product's face acts like a large wall around the driver: sound that would have spread backwards is reflected forwards, and the driver radiates into a half-space, gaining about 6 dB on its axis compared with radiating into full space. At low frequencies, where the wavelength is long compared with the face, sound wraps round the cabinet and the driver radiates into full space. The transition, often called the **baffle step**, happens over roughly an octave or two around the frequency whose wavelength is comparable with the face's width: about 1.4 kHz for a face 250 mm wide. The result is a gentle rise of up to about 6 dB from low to high frequencies on the axis, which the product's equalisation must allow for.

The edges of the face also diffract sound, adding ripples to the response at frequencies set by the distances from the driver to each edge. A driver placed centrally on a face sees equal distances to its edges and a stronger ripple at one frequency; an offset driver spreads the ripples out. Rounded edges reduce them.

## Surfaces near the product

The room's surfaces add their own reflections. At low frequencies, where the distance to a wall is small compared with the wavelength, a nearby wall reflects sound back in step with the direct sound and adds to it: against one wall, the low-frequency output rises by up to about 3 dB, in a corner between two walls and the floor by up to about 9 dB, compared with a free field. At higher frequencies, the reflection arrives at a different phase at different frequencies and produces a pattern of peaks and dips. AP-40 will often be placed against a wall, which helps its low-frequency prompts, and its equalisation is designed for a typical placement rather than for a free field, which no user's living room provides.

## How placement changes the low end

Because nearby surfaces add in step at low frequencies, where a product stands changes its low-frequency output by several decibels, and a product designed for one placement sounds different in another.

```figure
type: compare
title: Low-frequency gain from nearby surfaces, idealised
cols: Radiation space | Gain at low frequencies, ideal
caption: Idealised values for surfaces much closer to the source than a quarter wavelength. Real rooms give less, because surfaces are not perfectly reflecting and not perfectly close, and higher frequencies see peaks and dips instead of a gain.
- Free field, test fixture in an anechoic room | Full space | 0 dB
- *On the floor, clear of walls | Half space | Up to about 3 dB
- On the floor against one wall | Quarter space | Up to about 6 dB
- On the floor in a corner | Eighth space | Up to about 9 dB
```

For AP-40's prompts, whose lowest important content is around 300 Hz, the gain applies only where the surfaces are within a fraction of a wavelength: a quarter of a wavelength at 300 Hz is about 0.29 m, so a purifier with its back 10 cm from a wall gets much of the wall's gain at 300 Hz, and one 1 m from the wall gets little. The prompt speaker's equalisation was tuned with AP-40 on the floor, 10 cm from a wall, the placement the product's instructions recommend, and checked at 1 m from the wall to make sure the prompts stay clear in the other common placement.

## Designing for real placements

A product's acoustic design should start from the placements its users will choose, not from the test fixture. For AP-40, the team listed three: against a living room wall, beside a bed, and in the middle of an office floor. Each gives a different balance of direct and reverberant sound, a different low-frequency gain and a different listening angle. The equalisation and the speaker's orientation were chosen to work acceptably in all three, and the listening tests of the error above were repeated in each. Requirements measured in a free field remain useful, because they are repeatable and comparable between suppliers, but they are a means of checking a design, not a description of what users hear. The two kinds of figure belong side by side in the requirements: the free-field one for testing, the real-placement one for judging.

## The running case: the speaker on the top panel

This is an illustration. To keep AP-40's front face clean, its designers placed the prompt speaker on the top panel, firing upwards through a grille beside the air outlet. The prompt requirement of Chapter 1, 68 dB at 1 m on axis over 300 Hz to 8 kHz, was verified with the measurement microphone 1 m above the top panel, on the speaker's axis, and passed.

## The error: verified on an axis nobody uses

A user seated 2 m from AP-40, with their ears about 0.5 m above its top panel, is about **76°** off the speaker's axis. At that angle, the piston model gives a loss of about 1.4 dB at 4 kHz, 3.4 dB at 6 kHz and **6.4 dB at 8 kHz**, compared with the axis where the speaker was verified. The prompts' consonants, which carry their intelligibility, lose much of their top octave for the person they are meant for.

```figure
type: line
title: AP-40's prompt speaker: loss relative to its axis, two listening angles
x: Frequency, Hz
y: Level relative to the axis, dB
legend: Listener 76° off axis, speaker facing up | Listener 31° off axis, speaker tilted 45° forward
ymin: -7
ymax: 0
caption: This is an illustration from the rigid-piston model for a 16 mm effective radius. Tilting the speaker towards the listening position brings the loss at 8 kHz from about 6.4 dB to about 1.6 dB.
- 1000 | -0.1 | 0.0
- 2000 | -0.4 | -0.1
- 3000 | -0.8 | -0.2
- 4000 | -1.4 | -0.4
- 5000 | -2.3 | -0.6
- 6000 | -3.4 | -0.9
- 7000 | -4.7 | -1.2
- 8000 | -6.4 | -1.6
```

The check that caught it was a listening test in a furnished room, where panel members seated across the room rated the prompts dull compared with listeners standing over the product. The fix was in two parts. The speaker was tilted 45° towards the front within the top panel, which brought the seated listener to about **31°** off axis and the loss at 8 kHz to about 1.6 dB. And the requirement was rewritten to include a **listening window**: the response averaged over a range of angles that covers where users actually are, here from the axis to 45° off it, in front of the product and above its top. The general lesson is that a sound requirement verified on an axis nobody uses tells nothing about what users hear, and that the requirement should name the listening positions.

## Grilles and directivity

The grille in front of a driver also shapes its directivity, slightly. Below its Helmholtz resonance, a perforated grille with a shallow front cavity, like AP-40's redesigned one in Chapter 3, is nearly transparent and the driver's directivity is unchanged. A grille whose open area is concentrated in a small patch in front of a larger driver acts as a smaller source, and radiates more widely than the driver would bare; one with a deep front cavity and a long throat begins to behave like a short horn, concentrating the sound forwards. For AP-40, the grille's holes are spread over the full cone area, which keeps the driver's own directivity, and the 72-hole pattern was checked at the 45° tilt to make sure no hole was blocked by the top panel's edge.

## Directivity and the room

A product's directivity also shapes how much of its sound reaches a listener directly and how much via the room. A source that beams forward sends more of its high-frequency energy to listeners in front and less into the reverberant field. In a small, furnished room, where the critical distance of Chapter 1 is under a metre, most listeners hear mainly reverberant sound at low and mid frequencies, and the direct sound's directivity matters most at high frequencies, where the room's furnishings absorb well and the reverberant field is weak. That is why the top octave suffered most in the error above: it was the part of the prompt that arrived mainly by the direct path.

## Directivity of the noise

Directivity applies to a product's noise as much as to its prompts. AP-40's outlet grille, on its top, radiates the fan's mid and high frequencies upwards more than sideways, and its inlet grilles, on its sides and base, radiate sideways and towards the floor. A product standing beside a bed, with its inlet facing the pillow, is heard differently from one facing the other way. Declared sound power, Chapter 10's subject, averages over all directions and is the right figure for comparing products, but a product's instructions can usefully tell users which way to face it in a bedroom.

## Measuring directivity

Directivity is measured by rotating the product on a turntable in a free field, or in an anechoic or half-anechoic room, and recording the response at a set of angles. For a voice-prompt speaker, measurements every 15° in the horizontal and vertical planes are usually enough. The results show the listening window's average response and how evenly the product covers the positions where its users will be. For a prompt speaker of AP-40's size, the measured curves at low and mid frequencies should agree closely with the piston model; at high frequencies, the cone's break-up, the grille's resonance and the cabinet's edges add detail that only the measurement shows.

## Several speakers

Products with more than one speaker, stereo pairs or arrays, add the interference between the speakers' outputs, which depends on their spacing compared with the wavelength. Two speakers driven with the same signal, spaced more than about half a wavelength apart, produce a pattern of lobes and nulls in the frequency range above that spacing's frequency; spaced closely, they behave as one larger source. AP-40 has one speaker for prompts, which avoids the problem, but a product with a speaker on each side for a wider spread would need its crossover between them, or its delays, designed with the lobing in mind.

## Exercise: a front-mounted speaker

Instead of tilting the speaker, AP-40's designers consider moving it to the front face, at 0.4 m above the floor, facing forwards. For a seated listener 2 m in front with ears 1.1 m above the floor, about how far off axis is the listener? What does the piston model give at 8 kHz, and what does the front face do to the response?

**Worked answer.** The listener is 0.7 m higher and 2 m forward, so the angle off the axis is about arctan(0.7 ÷ 2) ≈ **19°**. At that angle, the piston model's loss at 8 kHz is about **0.7 dB**, well under the 1.6 dB of the tilted design.

The front face, about 250 mm wide, also acts as a baffle, giving the full half-space gain above about 1.4 kHz and less below it, so the front-mounted speaker's response rises a few decibels across the prompt band on axis, which the equalisation would flatten. The front position also moves the speaker further from the top-panel microphone, which helps the echo cancellation of Chapter 7, at the cost of the industrial designers' clean front face, a trade-off for the team rather than the acoustic engineer alone.
