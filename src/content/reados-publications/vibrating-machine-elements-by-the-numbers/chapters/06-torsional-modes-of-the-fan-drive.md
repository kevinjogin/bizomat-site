---
book: vibrating-machine-elements-by-the-numbers
chapterSlug: torsional-modes-of-the-fan-drive
order: 6
title: "Twist: torsional modes of the fan drive"
description: "Model the RF-3 drive as inertias joined by torsional springs, find its twisting modes with and without the belt, and decide whether to stiffen the shaft or skip a speed."
draft: false
---

A shaft carrying a heavy impeller is a torsional spring with a flywheel on its end. Twist the impeller and let go, and it oscillates back and forth around the shaft at a natural frequency. Connect it through a belt to a motor rotor, and the drive has several twisting modes. If a pulsing torque meets one of them, the shaft sees alternating stress that never shows on a steady torque reading and can fatigue keys, couplings and the shaft itself.

This chapter finds RF-3's torsional modes. It starts from the twisting wave, confirms that the shaft can be treated as a simple spring, and then builds the model in steps: impeller and pulley on the shaft, then the whole drive with the belt and motor. Each step changes the answer, and one modelling mistake moves a mode by a factor of five. The chapter ends by choosing between a stiffer shaft and a skipped speed band.

## Twisting waves and when to ignore them

A twisting disturbance travels along a round shaft at:

**c = √(G ÷ ρ)**

where G is the shear modulus. For steel with G = 79.3 GPa and ρ = 7,850 kg/m³, c is about **3,178 m/s**. Unlike bending waves, this twisting wave travels at the same speed at every frequency, so the standing-wave rules of Chapter 1 apply directly.

This is an illustration. RF-3's fan shaft has 0.5 m of 40 mm diameter between the fan pulley and the impeller hub. At 120 Hz, near the top of the frequencies of interest, the twisting wavelength is 3,178 ÷ 120, about 26.5 m. The shaft length is less than 2 per cent of that. Every section twists in step, and the shaft behaves as a massless torsional spring with the impeller and pulley as concentrated inertias at its ends.

Long shafts are different. A line shaft or a long fan drive shaft, such as those used between a deck-mounted motor and a gearbox, can be long enough for the wave picture to matter. A 12 m steel shaft held at one end and free at the other has its first twisting mode at c ÷ (4L) = 3,178 ÷ 48, about 66 Hz, with the shaft's own distributed inertia doing the vibrating. Such shafts need the distributed treatment or a finite-element model with enough elements along the length.

## The shaft as a torsional spring

For a solid round shaft of diameter d and length L, the torsional stiffness is:

**k = G J ÷ L**, with **J = π d⁴ ÷ 32**

For RF-3: J = π × 0.040⁴ ÷ 32 = 2.513 × 10⁻⁷ m⁴, and k = 79.3 × 10⁹ × 2.513 × 10⁻⁷ ÷ 0.5, about **39,860 N·m/rad**.

The running torque at full speed is 5,500 W ÷ (2π × 15.47), about 56.6 N·m, which twists the shaft by only 56.6 ÷ 39,860 rad, about 0.08 degrees. The shaft is stiff in the everyday sense. Stiffness alone does not keep it out of resonance, because the impeller's inertia is large.

The fourth-power dependence on diameter is the main design lever. Going from 40 mm to 45 mm raises J, and the stiffness, by (45 ÷ 40)⁴, about 1.60 times. Going to 50 mm raises it about 2.44 times.

## The inertias

This is an illustration. The case assigns these mass moments of inertia as teaching values:

- **impeller:** 2.4 kg·m²;
- **fan pulley:** 0.08 kg·m²;
- **motor rotor and motor pulley together:** 0.05 kg·m².

Real values come from the fan and motor makers' data or from a CAD model. The impeller dominates: it is thirty times the pulley and nearly fifty times the motor.

## Model 1: impeller and pulley on the shaft

The simplest model treats the fan shaft as a spring joining two free inertias, the pulley J₂ and the impeller J₁, with nothing else attached. The two ends twist in opposite directions about a still point along the shaft. The natural frequency is:

**f = (1 ÷ 2π) × √(k (J₁ + J₂) ÷ (J₁ J₂))**

For RF-3: (2.4 + 0.08) ÷ (2.4 × 0.08) = 12.92 per kg·m², so f = (1 ÷ 2π) × √(39,860 × 12.92), about **114.2 Hz**. In this mode the light pulley does most of the moving and the heavy impeller swings only a little.

This is the value the early design review in Chapter 1 compared with blade pass. It lies inside the blade-pass band of 74.2 Hz to 123.7 Hz, meeting it at about 46.2 Hz supply.

## A failure case: holding the pulley still

This is an illustration. A second reviewer, checking the first, reasons that the belt holds the pulley, and models the impeller twisting on a shaft fixed at the pulley end. That gives f = (1 ÷ 2π) × √(k ÷ J₁) = (1 ÷ 2π) × √(39,860 ÷ 2.4), about **20.5 Hz**.

That number sits inside the motor's 1× band, 14.5 Hz to 24.2 Hz, and just above the fan's 1× band. The reviewer recommends a much larger shaft to move the mode, at considerable cost.

The error lies in the boundary condition. A belt is not a rigid clamp. It is a spring, and a soft one compared with the shaft. The detection came from asking how stiff the belt connection actually is, which led to Model 2. The correction was to model the belt as a spring and the motor as an inertia, and to stop treating any belt-driven pulley as fixed. The "fixed pulley" result is a lower bound that applies only if the belt were infinitely stiff and the motor infinitely heavy.

```figure
type: compare
title: Three models of the same drive
rowhead: Model
cols: What it assumes | Modes found
caption: This is an illustration. The boundary condition at the pulley moves the answer by a factor of five. Model 3 needs a belt stiffness, here a teaching value.
- Pulley held fixed | belt infinitely stiff, motor infinitely heavy | 20.5 Hz
- Pulley free | no belt at all | 114.2 Hz
- * Belt and motor included | belt as a spring, motor as an inertia | 31.7 Hz and 121.6 Hz
```

## Model 3: adding the belt and the motor

A belt couples the pulleys through the stretch of its spans. Each span behaves as an axial spring of stiffness E A ÷ L, where E A is the belt's axial stiffness per unit strain. Both spans of each belt resist a relative twist of the pulleys, as long as the slack side stays in tension, so a two-belt drive has four spans in parallel.

This is an illustration. The case takes E A as 50 kN per belt, a teaching value; belt makers can supply stiffness data for their sections, and it varies with tension and age. Each span's stiffness is 50,000 ÷ 0.5983, about 83,570 N/m, and four spans give about 334,300 N/m. At the fan pulley's 0.125 m pitch radius, the torsional stiffness of the belt connection is 334,300 × 0.125², about **5,220 N·m/rad**, less than one-seventh of the shaft's.

The motor turns 1,450 ÷ 928 = 1.5625 times faster than the fan. Referred to the fan shaft, an inertia on the motor side counts as its own value times the speed ratio squared: 0.05 × 1.5625², about 0.122 kg·m².

### Why the speed ratio is squared

The squared ratio comes from energy. A model referred to the fan shaft must store the same kinetic energy as the real drive. The motor inertia J spins at n times the fan's angular velocity ω, so its kinetic energy is ½ J (n ω)², which equals ½ (J n²) ω². Seen from the fan shaft, it behaves as an inertia J n². The same argument applies to a torsional spring on the motor side: it twists n times as far for a given fan-shaft twist, so it stores n² times the energy and counts as k n².

A common slip is to refer by the ratio rather than its square. For RF-3 that would give 0.05 × 1.5625 = 0.078 kg·m² instead of 0.122, an error of more than a third in the motor's contribution. In a gear or belt reduction with a large ratio, the error can dominate the result. When a model has been built in this way, a quick check is to confirm that the referred values reproduce the same total kinetic energy at a chosen running speed.

The model is now a chain of three inertias joined by two springs: the motor (0.122 kg·m²), the belt spring (5,220 N·m/rad), the fan pulley (0.08 kg·m²), the shaft spring (39,860 N·m/rad) and the impeller (2.4 kg·m²). Solving it gives two modes:

- **31.7 Hz**, in which the motor swings against the fan through the belt, with the shaft barely twisting;
- **121.6 Hz**, in which the pulley and impeller twist against each other through the shaft, much like Model 1 but stiffened slightly by the belt.

The [torsional natural frequency tool](/tools/torsional-vibration/) solves chains of this kind. It is worth testing the sensitivity to the uncertain belt stiffness: halving E A to 25 kN per belt gives modes of about 23.1 Hz and 117.8 Hz; doubling it to 100 kN gives about 42.1 Hz and 129.4 Hz. The low mode is sensitive to the belt; the high mode much less so.

## What pushes on the twisting modes

Torsional modes respond to pulsing torque, not to sideways force. On RF-3 the sources are:

- **blade pass:** each blade passing the housing cut-off produces a small torque pulse, eight per fan revolution, so 74.2 Hz to 123.7 Hz across the range;
- **variable speed drive torque ripple:** inverter-fed motors produce torque pulsations at multiples of the output frequency, commonly six and twelve times it, so about 180 Hz to 300 Hz for the sixth multiple across RF-3's range;
- **belt and pulley irregularities:** a belt joint or a pulley with run-out produces small torque variations at belt-pass frequency and at 1× and 2× shaft speed.

```figure
type: compare
title: RF-3 torsional modes against torque excitations
rowhead: Mode
cols: Frequency | Nearest band | Crossing and margin
caption: This is an illustration using the 15 per cent working margin. The high mode sits inside the blade-pass band and within 2 per cent of blade pass at full speed.
- Low, motor against fan | 31.7 Hz | motor 2×, 29.0 to 48.3 Hz | crosses at about 32.8 Hz supply; weak forcing
- * High, pulley against impeller | 121.6 Hz | blade pass, 74.2 to 123.7 Hz | crosses at about 49.1 Hz supply; 1.7 per cent at full speed
- High mode, against VSD sixth multiple | 121.6 Hz | 180 to 300 Hz | clear: about 32 per cent below 180 Hz
```

The low mode's crossing with the motor 2× harmonic involves a weak torque source and is recorded rather than acted on. The high mode is the concern. With the fan running at full speed for most of the day, blade pass sits within about 2 per cent of it.

## Stiffen the shaft or skip the speed

Two responses are possible. The first is to skip a band of speeds. Applying the 15 per cent margin, the drive would have to avoid any speed at which blade pass lies between 121.6 ÷ 1.15 and 121.6 ÷ 0.85, that is 105.7 Hz to 143.1 Hz. That covers every supply frequency above about 42.7 Hz, including full speed. A skip band that wide removes the fan's top range and its duty point. It is not a practical answer here.

The second is to move the mode. Because torsional stiffness rises with the fourth power of diameter, a modest increase in shaft size has a large effect.

```figure
type: bars
title: High torsional mode against fan shaft diameter
unit: Hz
max: 200
caption: This is an illustration from the three-inertia model. 45 mm clears blade pass by about 21 per cent and stays below the VSD sixth-multiple band; 50 mm runs into that band.
- 40 mm, as designed | 121.6
- * 45 mm | 150.3
- 50 mm | 183
- Blade pass at full speed | 123.7
- VSD sixth multiple at 30 Hz supply | 180
```

A 45 mm shaft puts the high mode at about 150.3 Hz. That is about 21.5 per cent above full-speed blade pass and about 16.5 per cent below the lowest VSD sixth-multiple frequency of 180 Hz: clear of both. A 50 mm shaft overshoots into the VSD band at about 183 Hz.

The case adopts the 45 mm shaft as a specification point for the fan maker, not as a field modification. Changing a shaft diameter changes bearings, hub bores, keys and the shaft's bending critical speed, all of which the fan maker controls. The resonance register records the requirement and the reason, so it survives the next fan replacement.

## How likely is real trouble

It is worth keeping this in proportion. Belt-driven fans often run for years with torsional modes near blade pass without failure. The blade-pass torque pulse is small, and belts add damping to the twisting modes. The modes found here are screening results with uncertain inputs, in particular the belt stiffness.

Torsional vibration is also hard to see. An ordinary accelerometer on a bearing housing measures sideways motion and may show nothing. Direct measurement needs a torsional vibration method, such as a high-resolution encoder or a laser torsional vibrometer on the shaft, or strain gauges with telemetry. Signs that justify that measurement include repeated key or keyway failures, fretting at hub fits, coupling wear and shaft cracks at 45 degrees to the axis, the angle at which torsional fatigue cracks typically run.

## Exercise: a lighter impeller

The fan maker offers an aluminium impeller with an inertia of 1.2 kg·m² in place of the 2.4 kg·m² steel one. Using Model 1 (pulley and impeller on the 40 mm shaft, no belt), find the new torsional frequency. Does halving the impeller inertia move the mode clear of blade pass?

**Answer.** (1.2 + 0.08) ÷ (1.2 × 0.08) = 13.33 per kg·m², so f = (1 ÷ 2π) × √(39,860 × 13.33), about **116.0 Hz**, against 114.2 Hz before.

Halving the impeller's inertia barely moves the mode, because in this mode the light pulley does almost all the moving. The frequency is governed mostly by the shaft stiffness and the pulley inertia: as J₁ grows large, the formula tends to (1 ÷ 2π) × √(k ÷ J₂), about 112.3 Hz. The lighter impeller does not clear the blade-pass band. Stiffening the shaft, or reducing the pulley's inertia, is the effective lever for this mode.
