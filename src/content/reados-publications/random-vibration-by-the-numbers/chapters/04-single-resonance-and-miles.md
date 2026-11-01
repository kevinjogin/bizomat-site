---
book: random-vibration-by-the-numbers
chapterSlug: one-resonance-and-miles-equation
order: 4
title: "One resonance and Miles' equation"
description: "How a single-degree-of-freedom part responds to random base vibration: transmissibility, Q and bandwidth, the response spectrum, Miles' equation for RMS response, relative displacement and its limits."
draft: false
---

Most equipment fails in random vibration at a resonance. A bracket, a circuit board, a mounted enclosure or a cantilevered sensor each has a natural frequency at which it amplifies the vibration of whatever it is fixed to, and random vibration, having energy at every frequency in its band, always finds that frequency. The part's response is then dominated by the narrow band of input around its resonance, amplified by its quality factor. For a single resonance and a smooth input spectrum, the whole calculation collapses into one short formula, published by John Miles in 1954, which every vibration engineer uses daily.

This chapter builds the single-degree-of-freedom model, shows how a resonance shapes the response spectrum, derives Miles' equation from the area under that spectrum, and applies it to the sensor bracket and to CB-7 on its original stiff mounts. It checks the equation against a full numerical integration, sets out its limits, and ends with a response estimated by multiplying the input RMS by Q, which overstated it fivefold.

## A mass on a spring, shaken at the base

The simplest model of a resonant part is a mass on a spring and damper whose base is shaken: the sensor and junction box on the end of their bracket, or CB-7 on its mounts. At frequencies well below the natural frequency, the mass simply follows the base. At the natural frequency it moves more than the base, by a factor called the quality factor, Q. Well above it, the spring cannot transmit the motion and the mass moves less than the base, which is what isolation means.

The ratio of the mass's acceleration to the base's at each frequency is the transmissibility. Q is related to the damping ratio ζ by Q = 1 ÷ (2ζ): an elastomer mount with ζ = 0.125 has Q = 4; a bolted steel bracket with ζ = 0.033 has Q of about 15. The resonance's half-power bandwidth, the width over which the response is within 3 dB of its peak, is fₙ ÷ Q: 8 Hz for the bracket at 120 Hz.

```figure
type: formula
title: Transmissibility of a base-excited single-degree-of-freedom system
formula: |H(f)|² = [1 + (2ζr)²] ÷ [(1 − r²)² + (2ζr)²], with r = f ÷ fₙ
formula: Response PSD = |H(f)|² × input PSD; at resonance |H|² ≈ Q²
caption: This is an illustration: the sensor bracket, fₙ = 120 Hz, Q = 15, ζ = 0.0333. Away from resonance the transmissibility falls quickly; above r = √2 it is below one and the part is isolated from the input.
- At 60 Hz, r = 0.5 | |H|² = 1.78: the bracket moves 1.3 times the frame
- At 120 Hz, r = 1 | |H|² = 226: 15 times the frame
- At 240 Hz, r = 2 | |H|² = 0.11: a third of the frame's motion
```

Multiplying the input PSD by |H|² frequency by frequency gives the response PSD: the input's broad plateau with a tall, narrow spike at the resonance, 226 times the input level at 120 Hz. Almost all of the response's mean square lies in that spike.

## Miles' equation

If the input PSD is roughly flat across the resonance's narrow bandwidth, the area under the spike can be calculated exactly: it is (π ÷ 2) × fₙ × Q × W(fₙ), where W(fₙ) is the input PSD at the natural frequency. The square root of that area is the RMS acceleration response.

```figure
type: formula
title: Miles' equation
formula: g_rms = √((π ÷ 2) × fₙ × Q × W(fₙ))
formula: Relative displacement z_rms = g_rms × 9.807 ÷ (2π fₙ)², in metres
caption: W(fₙ) in g²/Hz is the input PSD at the natural frequency. This is an illustration: the sensor bracket on the screen frame.
- Natural frequency and Q | fₙ = 120 Hz, Q = 15
- Input PSD at 120 Hz | W = 0.02 g²/Hz, in the flat band
step: g_rms = √(1.5708 × 120 × 15 × 0.02) = √56.5 = 7.52 g RMS
step: z_rms = 7.52 × 9.807 ÷ (2π × 120)² = 0.13 mm; 3σ = 0.39 mm
```

The bracket's sensor and junction box therefore see 7.52 g RMS, nearly three times the frame's overall 2.55 g, and at 3σ, 22.6 g. The relative displacement between the bracket's tip and its base, 0.13 mm RMS, is what bends the bracket; Chapter 8 turns it into stress and fatigue.

The equation's structure is worth noticing. The response grows with the square root of Q, not with Q itself: doubling Q multiplies the response by 1.41. It grows with the square root of the natural frequency too, for the same input level, because a higher resonance gathers energy from a wider absolute bandwidth. And it depends only on the input near fₙ; the rest of the profile hardly matters to this part.

## Absolute and relative motion

Two motions matter for a resonant part, and they answer different questions. The absolute acceleration of the mass, which Miles' equation gives, sets the inertia forces on the mass and everything attached to it: the sensor's own internals, the junction box's terminals, the components on a board. The relative displacement between the mass and its base sets the deflection of the spring, which for a bracket is bending and for a mount is compression or shear, and therefore the stresses in the spring itself and the clearances around the mass.

For a lightly damped single-degree-of-freedom system, the two are linked through the natural frequency: relative displacement is close to absolute acceleration divided by (2πfₙ)², the formula used above. The link explains a pattern that surprises people. Raising a part's natural frequency, by stiffening it, often raises its absolute acceleration, because the higher resonance gathers more input energy, while sharply reducing its relative displacement and stress, because the deflection falls with the square of the frequency. Whether stiffening helps depends on which quantity governs the failure: for the bracket's fatigue, the stress; for a delicate component carried on the bracket, the acceleration. The exercise below works through both for the sensor bracket.

## Why √Q, not Q

The physics behind the square root is the balance between energy fed in and energy dissipated. Lemons develops it for the stochastically driven damped oscillator, which is exactly this model with a white-noise force: the random input feeds energy into the oscillator at a steady rate, the damping removes it at a rate proportional to the oscillator's energy, and the mean-square motion settles where the two balance. Halving the damping doubles the stationary mean square, which multiplies the RMS by √2. It is the same balance that Langevin used for Brownian particles, where it ties the size of thermal fluctuations to the friction that dissipates them, the fluctuation–dissipation relation.

A sine input is different. A sinusoid at the resonance feeds energy into every cycle in step, and the steady-state response is Q times the input, not √Q times. That is why sine and random tests of the same RMS load a resonant part so differently, as Chapter 1 noted.

## Checking the equation numerically

Miles' equation assumes a flat input across the resonance, a single mode and light damping. The assumptions can be checked by integrating the full response PSD numerically, frequency by frequency across the whole profile.

```figure
type: compare
title: Miles' equation against numerical integration over CB-7's profile
cols: Input PSD at fₙ, g²/Hz | Miles, g RMS | Numerical, g RMS | Difference
rowhead: Part
caption: This is an illustration. Numerical integration of |H|² × W(f) at 0.005 Hz steps from 5 to 500 Hz. The equation is within about 1.5% in every case here because the profile is smooth near each resonance and each part has one dominant mode.
- * Sensor bracket, 120 Hz, Q = 15 | 0.0200 | 7.52 | 7.50 | +0.2%
- CB-7 on stiff mounts, 25 Hz, Q = 4 | 0.0125 | 1.40 | 1.39 | +1.1%
- Stiffened bracket, 240 Hz, Q = 15 | 0.0152 | 9.27 | 9.36 | −1.0%
- CB-7 on soft mounts, 9.2 Hz, Q = 4 | 0.0046 | 0.52 | 0.51 | +1.4%
```

The agreement is good here, but it is not guaranteed. A resonance on a steep slope of the input spectrum, or near a sharp spectral peak, can make Miles' equation wrong by tens of per cent; a NASA Goddard review of the equation gives an example in which it underpredicted a shaped-input response by about a fifth. A part with two modes close together, or a heavily damped part whose bandwidth spans a large part of the spectrum, needs the full integration or a finite element random response analysis. The equation remains the right first estimate and the right check on such analyses.

## Where Q comes from

Q is the equation's least certain input. It depends on the material, the joints, the amplitude and the frequency, and estimates from handbooks differ widely. For bolted steel brackets values around 10 to 20 are common; for elastomer mounts, 3 to 10; for circuit boards, Steinberg's text on electronic equipment gives an approximation that rises with natural frequency. The best source is measurement: a tap test with an instrumented hammer and an accelerometer gives the natural frequency and the half-power bandwidth directly, and Q = fₙ ÷ bandwidth. This is an illustration. A tap test on the sensor bracket gave a peak at 121 Hz with a half-power bandwidth of 8.1 Hz: Q of about 15, the value used here.

Because the response varies as √Q, an error in Q matters less than it might: a Q of 20 instead of 15 raises the response by 15%, a Q of 10 lowers it by 18%. The natural frequency matters more, because a few per cent of error in fₙ can move the resonance onto a different part of the input spectrum; the tap test settles both at once.

## From acceleration to force

The response acceleration turns into the loads that brackets, bolts and mounts must carry. For a single-degree-of-freedom part, the force through its support is its mass times its absolute acceleration. This is an illustration. The sensor and junction box on the bracket weigh 0.8 kg, so the force at the bracket's root is 0.8 × 7.52 × 9.807 = 59 N RMS, and 177 N at 3σ. CB-7, at 18 kg and 1.40 g RMS on its stiff mounts, puts 247 N RMS through its four mounts together, 742 N at 3σ, or about 185 N per mount if they share equally.

Those 3σ figures are a common basis for strength checks, with a factor of safety; the RMS figures, with the peak distribution of Chapter 7, are the basis for fatigue. Neither should be confused with the static weight, and a static design check at "1 g plus a margin" can be several times too low for a resonant part.

## More than one mode

Real parts have more than one natural frequency. A bracket has a first bending mode, a second bending mode at several times the first, and twisting modes; a circuit board has a family of plate modes. When the modes are well separated, each behaves like its own single-degree-of-freedom system, responding to the input near its own frequency, and the mean squares of their responses add, as independent random quantities do. Each mode's contribution must be weighted by how strongly the input excites it, its participation, which a finite element model or a test provides. For most brackets and enclosures the first mode dominates, because it has the largest participation and the largest deflection for a given acceleration, and the single-mode Miles estimate is a good first answer. When two modes are close together, within each other's bandwidth, their responses are correlated and must be combined with care, and a numerical random response analysis is the right tool.

## CB-7 on its original mounts

This is an illustration. CB-7 was first mounted on four stiff rubber bushes giving a natural frequency of about 25 Hz with Q = 4. The input PSD at 25 Hz, on the rising segment of the profile, is 0.0125 g²/Hz. Miles' equation gives the enclosure an RMS acceleration of √(1.5708 × 25 × 4 × 0.0125) = 1.40 g, and a relative displacement on its mounts of 0.56 mm RMS, 1.7 mm at 3σ. On random vibration alone, that is a reasonable mounting: the enclosure is shaken less than the frame, because most of the profile's energy lies well above 25 Hz, where the mounts isolate. Chapter 5 shows why the design was nevertheless wrong, and it has nothing to do with the random profile.

## The error: input RMS times Q

This is an illustration. A first estimate of the sensor bracket's response multiplied the frame's overall level by the bracket's Q: 2.55 g × 15 = 38.3 g RMS. The bracket was redesigned for that load, heavier and stiffer than necessary, and the heavier design then failed a weight check for the screen's side panel.

The error mixes two rules. Multiplying by Q is right for a sine input at the resonance. For random input, the part responds only to the energy near its resonance, and the response is √(π ÷ 2 × fₙ × Q × W(fₙ)), here 7.52 g RMS, about a fifth of the estimate. The overall RMS of the input is the wrong quantity altogether: it includes energy at frequencies the bracket does not respond to. The bracket was resized for 7.52 g RMS and a 3σ load of 22.6 g, checked in fatigue as Chapter 8 describes, and the weight problem disappeared.

## Exercise: the stiffened bracket

The bracket is stiffened so that its natural frequency rises to 240 Hz, with Q still 15. The input PSD at 240 Hz, on the falling segment, is 0.0152 g²/Hz. Find the RMS and 3σ acceleration response and the RMS relative displacement. How do they compare with the original bracket?

**Worked answer.** This is an illustration. g_rms = √(1.5708 × 240 × 15 × 0.0152) = √85.8 = **9.26 g RMS**, so 3σ is **27.8 g**: higher than the original 7.52 g, because the higher resonance gathers energy over a wider band and the input has not fallen much by 240 Hz. The relative displacement is 9.26 × 9.807 ÷ (2π × 240)² = 90.9 ÷ 2,274,000 = **0.040 mm RMS**, less than a third of the original 0.13 mm. Since the bracket's bending stress follows its deflection, not the acceleration of its tip, the stiffer bracket is far less stressed even though its tip is shaken harder. Chapter 8 completes the comparison in fatigue.
