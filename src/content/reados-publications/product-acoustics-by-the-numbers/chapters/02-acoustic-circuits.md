---
book: product-acoustics-by-the-numbers
chapterSlug: acoustic-circuits
order: 2
title: "Acoustic circuits: masses, springs and resistances"
description: "Model the small air spaces in a product as acoustic masses, compliances and resistances with an electrical analogy, know when that model holds, and catch a long duct treated as a lumped mass."
draft: false
---

Inside a product, sound moves through spaces that are small compared with its wavelength: the air behind a loudspeaker cone, the hole in a grille, the passage to a microphone, the gap round a panel. In such spaces the air behaves in simple ways. A slug of air in a short tube moves as a single mass. A small closed volume of air compresses as a single spring. A fine mesh or a narrow slit resists flow like a damper. Combined, these elements behave exactly like the inductors, capacitors and resistors of an electrical circuit, and the same circuit theory predicts their resonances, their filtering and their response to a driving force.

This chapter defines the three acoustic elements and their values, sets out the electrical analogy that makes them easy to combine, and states the condition under which the whole approach is valid. The running case finds that AP-40's internal air duct, 250 mm long, was first modelled as a single acoustic mass, which predicted a smooth response, when at the frequencies of interest it was as long as a wavelength and whistled at its half-wave resonances.

## Volume velocity and acoustic pressure

The analogy uses two quantities. **Acoustic pressure**, p, in pascals, is the fluctuating pressure that drives air through an element, like a voltage. **Volume velocity**, U, in cubic metres per second, is the fluctuating volume of air flowing through it, like a current: the air's velocity multiplied by the area it flows through. A loudspeaker cone of area S_d moving at velocity v produces a volume velocity U = S_d × v. The ratio of pressure to volume velocity is the **acoustic impedance**, in pascal-seconds per cubic metre.

## The three elements

```figure
type: formula
title: Acoustic mass, compliance and resistance
formula: M_A = ρ × L' ÷ S;   C_A = V ÷ (ρ × c²);   R_A = p ÷ U for a resistive element
caption: This is an illustration with air at about 20 °C, ρ ≈ 1.2 kg/m³ and c ≈ 343 m/s, so ρc² ≈ 141,000 Pa. L' is a tube's effective length, including the end corrections of Chapter 3.
- M_A | Acoustic mass of a short tube or hole, kg/m⁴
- C_A | Acoustic compliance of a closed volume, m⁵/N
- R_A | Acoustic resistance of a mesh, slit or porous layer, Pa·s/m³
step: A tube 10 mm across and 20 mm long: M_A ≈ 1.2 × 0.02 ÷ (7.85 × 10⁻⁵) ≈ 306 kg/m⁴, before end corrections
step: AP-40's 30 cm³ speaker chamber: C_A ≈ 30 × 10⁻⁶ ÷ 141,000 ≈ 2.1 × 10⁻¹⁰ m⁵/N
step: That chamber's stiffness on an 8 cm² cone: S_d² ÷ C_A ≈ 3.0 kN/m
```

An **acoustic mass** is air that moves as a whole: the slug of air in a short tube, a hole or a slot. Its value rises with the length of the tube and falls with its area, because a narrow, long passage holds a heavy slug that must be accelerated through a small area. An **acoustic compliance** is air that is compressed: a small enclosed volume, whose air resists being squeezed, like a spring. Its value rises with the volume, because a larger volume is a softer spring. An **acoustic resistance** dissipates energy: fine meshes, felts, narrow slits and porous foams turn the air's motion into heat, damping resonances.

## The electrical analogy

In the **impedance analogy**, pressure corresponds to voltage and volume velocity to current, and the three elements map directly onto circuit components.

```figure
type: compare
title: Acoustic elements and their electrical analogues
cols: Acoustic quantity | Electrical analogue | Behaviour
caption: In the impedance analogy, elements carrying the same volume velocity are in series, and elements sharing the same pressure are in parallel.
- Driving pressure | p, Pa | Voltage | The source's push
- Volume velocity | U, m³/s | Current | The flow it produces
- *Acoustic mass | M_A, a short tube or hole | Inductance | Impedance rises with frequency
- Acoustic compliance | C_A, a closed volume | Capacitance | Impedance falls with frequency
- Acoustic resistance | R_A, a mesh or felt | Resistance | Independent of frequency, dissipates energy
```

Once a product's air spaces are drawn as a circuit, every tool of circuit analysis applies. A mass and a compliance in series form a resonator, the Helmholtz resonator of Chapter 3. A driver's moving parts, its suspension and the air behind it form the resonant system of Chapters 4 and 5. A microphone's port and the small volume in front of its diaphragm form a low-pass filter with a resonance, the subject of Chapter 7. Mechanical and electrical parts of a transducer join the same circuit through its transduction coefficients, which is how a loudspeaker's voice coil, cone and enclosure are analysed as one system.

## The running case: the speaker's chamber as a spring

This is an illustration. AP-40's prompt speaker has a cone area S_d of about 8 cm² and sits at the front of a sealed chamber of about 30 cm³. Its own suspension has a compliance equivalent to a volume of air V_as of about 80 cm³, a figure its maker gives, which Chapter 4 explains. The chamber's compliance, about 2.1 × 10⁻¹⁰ m⁵/N, acts on the cone as a spring of about 3.0 kN/m; the suspension's equivalent spring is about 1.1 kN/m. The chamber's air is therefore about 2.7 times as stiff as the cone's own suspension, which, as Chapter 4 shows, raises the speaker's resonance considerably. That one comparison, made on a page in a few minutes, predicts much of how the speaker will sound in the product.

## Comparing impedances

The analogy's practical power is that impedances can be compared at a glance to see which element controls the behaviour at a given frequency. An acoustic mass has an impedance of magnitude ω × M_A, rising with frequency; a compliance has 1 ÷ (ω × C_A), falling with frequency; ω is 2π times the frequency.

This is an illustration. At 1 kHz, the 10 mm × 20 mm tube above, with an acoustic mass of about 306 kg/m⁴, has an impedance of about 2π × 1,000 × 306 ≈ 1.9 × 10⁶ Pa·s/m³. AP-40's 30 cm³ chamber, with a compliance of about 2.1 × 10⁻¹⁰ m⁵/N, has an impedance of about 1 ÷ (2π × 1,000 × 2.1 × 10⁻¹⁰) ≈ 7.5 × 10⁵ Pa·s/m³. If the tube were connected to the chamber, the mass would dominate at 1 kHz, about 2.6 times the compliance's impedance; the two would be equal, and the combination would resonate, at about 624 Hz. That is the Helmholtz resonance of Chapter 3, found here by comparing two numbers.

## Joining the mechanical and electrical sides

A transducer joins three domains: electrical, mechanical and acoustic. In a moving-coil loudspeaker, the current i in the voice coil produces a force F = Bl × i on the cone, where Bl is the motor's force factor, the product of the magnetic flux density and the length of wire in the gap. The cone, moving at velocity v, displaces a volume velocity U = S_d × v, and a pressure p acting on it produces a force F = p × S_d. These relations convert each element from one domain to another: a mechanical mass m acting on the cone appears in the acoustic circuit as an acoustic mass m ÷ S_d², and an acoustic compliance appears on the mechanical side as a spring of stiffness S_d² ÷ C_A, which is how the chamber's 3.0 kN/m above was found.

With the conversions, the whole loudspeaker, its amplifier, voice coil, cone, suspension, enclosure air and the outside air, becomes a single circuit, and its response to a drive voltage can be calculated. This is exactly what the Thiele–Small parameters of Chapters 4 and 5 summarise: a handful of numbers, measurable on any driver, that describe its circuit well enough to design its enclosure without building one.

## When the model holds

Lumped elements assume that every part of an element moves or compresses together, which is true only when the element is small compared with the wavelength. A common working rule is that an element's largest dimension should be less than about an eighth of the wavelength at the highest frequency of interest.

```figure
type: bars
title: Highest frequency for a lumped model, by element size, Hz
unit: Hz
max: 4500
caption: From the working rule that an element's largest dimension should be less than about one-eighth of the wavelength, with c ≈ 343 m/s.
- 10 mm element | 4288
- 30 mm element | 1429
- 50 mm element | 858
- 100 mm element | 429
- *250 mm element | 172
```

Above that frequency, the element has pressure and velocity that vary along its length, and it must be treated as a **distributed** element: a transmission line, a duct with standing waves, a cavity with internal modes. A grille hole a few millimetres long is lumped up to many kilohertz. A speaker chamber 30 mm across is lumped up to about 1.4 kHz and only approximately above. A duct 250 mm long is lumped only below about 170 Hz.

## The error: a long duct as a single mass

This is an illustration. AP-40's air path runs from the fan's outlet to the top grille through a duct about **250 mm** long and 60 × 40 mm in section. When the team modelled the product's acoustic response to the fan's noise, the duct was entered as a single acoustic mass, because it was a passage, and the model predicted that the duct would act as a gentle low-pass filter, smoothly reducing the fan's higher frequencies.

The first prototype whistled. A measurement at the outlet showed peaks at about **690 Hz** and **1,370 Hz**, frequencies where the fan's broadband noise was being amplified. A duct open at both ends, 250 mm long, has **half-wave resonances** at n × c ÷ (2L): about 686, 1,372 and 2,058 Hz. At those frequencies the duct is half a wavelength, one wavelength and one and a half wavelengths long, about as far from a lumped element as it could be. The lumped rule put the model's limit at about 172 Hz; every frequency that mattered for the fan's noise was above it.

The fix was to treat the duct as what it was: a distributed element, modelled with standing waves, and then to line it, as Chapter 6 shows, so that its resonances were damped and its walls absorbed the fan's mid and high frequencies. The general lesson is that the lumped model is valid only below a frequency set by size, and that the first step in any acoustic model is to check every element's size against the wavelength at the highest frequency of interest.

## Resistances and damping

Real resonators are always damped to some extent: air viscosity in narrow passages, the losses in a driver's suspension, absorbent material in a cavity. Adding resistance on purpose is one of the designer's most useful tools. A fine acoustic mesh over a port adds resistance that flattens the port's resonance; a felt behind a driver damps the chamber's internal reflections; a porous layer in a duct absorbs energy at its standing-wave peaks. The value of a mesh's resistance is given by its maker, often as an airflow resistance in rayls for a stated area, and it enters the circuit as a resistor in series with the element it covers.

## Radiation as an element

Where an element opens to the outside, the outside air acts on it too. The air just outside a port or a cone moves with it, adding a small **radiation mass**, and the sound radiated away carries energy, adding a **radiation resistance**. At low frequencies, for a source small compared with the wavelength, the radiation resistance is small, which is why small sources are inefficient radiators at low frequencies: they push air back and forth near their surface without launching much sound. The radiation mass is the physical reason for the end corrections of Chapter 3, and the radiation resistance is the reason that a small speaker in AP-40 struggles to produce much sound below a few hundred hertz, as Chapters 5 and 8 show.

## Drawing the circuit

A product's acoustic circuit is drawn the same way as an electrical schematic. Each air space and passage is identified, its size measured from the CAD model, and its element value calculated. Elements carrying the same air flow, one after another, are drawn in series; elements sharing the same pressure, such as two branches from one cavity, in parallel. Sources, the driver or the fan, drive the circuit; the outside world loads it through the radiation impedance. The circuit can then be solved by hand for simple cases, or entered into a circuit simulator, which treats it as an ordinary electrical network once the analogies are applied. The check against size and wavelength comes first, so that only elements that are genuinely lumped are drawn as lumped, and the rest are given distributed models or left to numerical simulation.

## Exercise: a short port and a long one

AP-40's prompt speaker could vent its front cavity through one of two grille designs: a single round hole 6 mm across in a 2 mm faceplate, or a slot passage 6 mm across and 40 mm long leading to a side grille. Up to what frequency can each be treated as a lumped acoustic mass? What is each one's acoustic mass, ignoring end corrections?

**Worked answer.** By the one-eighth rule, the hole, whose largest dimension is its 6 mm diameter, is lumped up to about 343 ÷ (8 × 0.006) ≈ **7.1 kHz**. The 40 mm passage is lumped only up to about 343 ÷ (8 × 0.040) ≈ **1.1 kHz**, well inside the prompt band of 300 Hz to 8 kHz.

The hole's area is π × 0.003² ≈ 2.83 × 10⁻⁵ m², so its acoustic mass is about 1.2 × 0.002 ÷ 2.83 × 10⁻⁵ ≈ **85 kg/m⁴** before end corrections, which, as Chapter 3 shows, are larger than its length. The passage's acoustic mass is about 1.2 × 0.040 ÷ 2.83 × 10⁻⁵ ≈ **1,700 kg/m⁴**, twenty times heavier, and above about 1.1 kHz it would have to be modelled as a short transmission line with its own resonance. The simple hole is the better choice for a speech-band speaker, and the easier one to model.
