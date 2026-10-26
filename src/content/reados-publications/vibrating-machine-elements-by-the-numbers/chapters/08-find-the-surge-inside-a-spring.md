---
book: vibrating-machine-elements-by-the-numbers
chapterSlug: find-the-surge-inside-a-spring
order: 8
title: "Find the surge inside a spring"
description: "Calculate a coil spring's surge frequencies, see how they break high-frequency isolation, and use the spring's mass correction and a soft pad to keep the isolator working."
draft: false
---

The isolation calculation in Chapter 7 treated each spring as a massless link: a perfect spring with no inertia of its own. A real coil spring has mass spread along its coils. Squeeze one end quickly and a compression wave runs along the coils to the other end, reflects and comes back. The spring has its own ladder of natural frequencies, called surge frequencies, and at each one it stops behaving like a spring and starts passing vibration through.

This chapter calculates the surge frequencies of RF-3's isolator springs and compares them with the fan's higher-frequency excitations. It shows why choosing a different spring rarely clears them on a variable-speed fan, and why a thin elastomer pad under the spring is the usual answer. It also covers the spring-mass correction, the rule that adds a third of the spring's mass to the load, and shows when that rule is accurate and when it is not.

## A spring as a slow bar

A coil spring compressed between two plates is a bar with a very low wave speed. Its stiffness comes from twisting the wire, and its mass is the whole length of wire wound into the coils. A disturbance travels along the spring's axis from coil to coil, much more slowly than through solid steel.

For a spring of rate k and active mass mₛ, compressed between two ends that do not move, the first surge frequency is the half-wave mode:

**fₛ = ½ × √(k ÷ mₛ)**

with higher modes at whole multiples, 2fₛ, 3fₛ and so on. For a helical spring of wire diameter d, mean coil diameter D and n active coils, this can be written directly in terms of the geometry:

```figure
type: formula
title: Surge frequency of a helical compression spring, both ends fixed
formula: fₛ = (d ÷ (2π n D²)) × √(G ÷ (2ρ))
- d | wire diameter, m
- D | mean coil diameter, m
- n | number of active coils
- G | shear modulus, Pa; 79.3 GPa for spring steel as a teaching value
- ρ | density, kg/m³; 7,850 for steel
step: d = 0.008, D = 0.060, n = 4.5
step: d ÷ (2π n D²) = 0.008 ÷ (2π × 4.5 × 0.0036) = 0.0786
step: √(G ÷ 2ρ) = √(79.3 × 10⁹ ÷ 15,700) = 2,247 m/s
step: fₛ = 0.0786 × 2,247 ≈ 176.6 Hz
caption: This is an illustration for RF-3's isolator spring. The same answer comes from ½ √(k ÷ mₛ) with k = 41.77 N/mm and mₛ = 0.335 kg.
```

## RF-3's isolator spring

This is an illustration. Each RF-3 isolator uses a spring of 8 mm wire, 60 mm mean coil diameter and 4.5 active coils, in steel with G = 79.3 GPa. Its rate is:

**k = G d⁴ ÷ (8 D³ n) = 79,300 × 8⁴ ÷ (8 × 60³ × 4.5) ≈ 41.77 N/mm**

with G in N/mm² and lengths in millimetres. That is the rate used in Chapter 7. The [compression spring designer tool](/tools/compression-spring-designer/) works the same formula with end types, solid height and stress.

The active coils contain a wire length of π D n = π × 60 × 4.5, about 848 mm. At π × 4² mm² of cross-section and 7,850 kg/m³, the active mass is about **0.335 kg**. Then:

**fₛ = ½ × √(41,770 ÷ 0.335) ≈ 176.6 Hz**

The second and third surge modes are at about 353 Hz and 530 Hz.

If the spring's working height is about 85 mm, the wave along it travels at 2 × 0.085 × 176.6, about **30 m/s**. A compression wave that would cross the same length of solid steel in about 17 microseconds takes nearly 3 milliseconds to cross the spring.

## What surge does to isolation

The transmissibility curve in Chapter 7 falls steadily above √2 times the natural frequency. That curve assumes a massless spring. With a real spring, the fall is interrupted by a peak at each surge frequency. At those frequencies the spring's coils are vibrating in a standing wave, and the end on the roof is pushed far harder than the ideal curve predicts. Steel springs have very little internal damping, so the peaks are sharp and tall.

The practical effect is that a spring isolator can work very well at fan running speeds, tens of hertz, and poorly at a few hundred hertz, exactly where motor and blade noise and vibration live. Building occupants hear this as a hum or tone that the isolators were supposed to stop.

It helps to put numbers on the ideal curve. Far above resonance, the massless-spring transmissibility falls roughly as the square of the frequency ratio. At 176.6 Hz, RF-3's springs would ideally pass about (3.17 ÷ 176.6)², roughly 0.0003, of the force. If a surge peak raised that a hundredfold, the spring would still pass only about 3 per cent of the force. That sounds small, but a steady tone at a few per cent of a fan's blade-pass force, delivered into a lightweight roof, can be clearly audible in a quiet office. Isolation at high frequencies is judged by ear and by tonal content as much as by force ratio.

## Excitations near the surge modes

RF-3's higher-frequency excitations, across the drive range, include:

- **twice blade pass:** 148 Hz to 247 Hz, from the blade-pass pressure pulses, which are rarely pure tones;
- **variable speed drive effects:** inverter-fed motors produce vibration and torque ripple at multiples of the output frequency, commonly six times, which is 180 Hz to 300 Hz;
- **motor and bearing tones** at higher frequencies.

Twice blade pass equals the first surge mode, 176.6 Hz, when blade pass is 88.3 Hz, at a fan speed of 11.04 revolutions per second, or about **35.7 Hz supply**. The sixth multiple of the drive output frequency reaches 176.6 Hz at 29.4 Hz supply, just below the 30 Hz minimum, so at minimum speed it sits within about 2 per cent of the surge frequency.

## A failure case: an evening hum

This is an illustration. After the spring isolators are reinstated, as described in Chapter 7, the low-frequency shaking in the office stops. A new complaint follows: a faint tonal hum in the evenings, when the building system often runs RF-3 at around 35 Hz to 36 Hz supply.

A vibration analyser on the roof slab beside one isolator shows a sharp peak near 177 Hz, which grows as the fan approaches 36 Hz supply and fades above and below. The fan bearings show twice blade pass at the same frequency but with no unusual level.

That pattern points to surge. The forcing is normal; what changed is that the springs now provide a clean path for it at their surge frequency. The calculation predicts the crossing at 35.7 Hz supply, which matches. The correction was to fit a ribbed elastomer pad under each isolator's base plate, a common feature of spring isolators supplied for building plant, and to recheck at the same speed. The peak at 177 Hz on the roof slab fell to a level that could no longer be picked out against background vibration.

## Why changing the spring rarely clears it

Moving the surge frequency looks like the obvious fix. For a fixed rate k, rearranging the two formulas shows that the surge frequency is proportional to D ÷ d³: thinner wire on a smaller coil raises it, thicker wire on a larger coil lowers it.

```figure
type: bars
title: Surge frequency of springs with the same 41.8 N/mm rate
unit: Hz
max: 260
caption: This is an illustration. Each spring has about 4.5 active coils and the same rate. Raising the surge frequency raises the wire stress, and every option still lies inside the 148 to 247 Hz band of twice blade pass.
- 9 mm wire, 70 mm coil | 144.7
- * 8 mm wire, 60 mm coil, as fitted | 176.6
- 7.5 mm wire, 55 mm coil | 196.5
- 7 mm wire, 50 mm coil | 219.7
- Twice blade pass at full speed | 247.5
```

Two limits apply. First, the higher surge frequencies come from thinner wire, which carries higher stress for the same load: the corrected shear stress under the 1,030 N static load rises from about 368 MPa for the 8 mm spring to about 462 MPa for the 7 mm spring. Whether that is acceptable depends on the spring material and its maker's allowable stresses. Second, on a variable-speed fan the band of twice blade pass alone spans 148 Hz to 247 Hz. Every practical spring in the table has its first surge mode inside that band, so changing the spring only moves the crossing to a different speed.

## The soft pad

Chapter 5 showed that a wave in steel meeting a much softer material is almost entirely reflected. A thin elastomer pad under the spring works on the same principle, though at these frequencies it behaves more as a soft spring in series than as a wave carrier. Either way, the high-frequency vibration that the spring's surge carries to its base meets a soft layer and is largely stopped there. The pad also adds damping, which lowers the surge peaks.

### Do not bolt through the pad

A pad only works if nothing bridges it. Isolators are usually held down to the roof steel with bolts through the base plate, and a steel bolt clamped tight through the pad carries vibration straight past it. The usual detail uses an elastomer bush around each hold-down bolt and an elastomer washer under its head or nut, so the base plate touches steel nowhere. The bolt is tightened only enough to locate the isolator, not to crush the pad.

The pad also has a load limit. Elastomer pads are rated for a compressive stress range; overloaded, they creep and harden, and underloaded, they are too stiff to help. The isolator maker's pad selection, for the load on each mount, governs. When pads are added after installation, as in the failure case, it is worth checking that the isolator's base plate is large enough to spread the load over the pad's rated area.

### Confirming surge with a tap

With the fan stopped, a light tap on a spring coil with a small hammer or a screwdriver handle makes the spring ring at its surge frequency, often audibly as a short metallic note. A vibration analyser with a magnetic sensor on the spring's top plate, or a phone held against the isolator housing running a spectrum app, shows the frequency. For RF-3 it should sit near 177 Hz.

The reading gives two checks at once. It confirms the calculation, and it shows whether the four springs match. A spring that rings noticeably lower than the others may have a broken end coil, or be a different spring altogether, fitted during an earlier repair.

The pad does little at running-speed frequencies, where the steel spring does the isolating. At surge frequencies, where the steel spring fails, the pad does the work. The combination of a steel spring for low frequencies and an elastomer element for high frequencies is a standard isolator arrangement for building plant, and is worth specifying from the start rather than adding after a complaint.

## The mass of the spring itself

The spring's mass also affects the bouncing mode calculated in Chapter 7. A common rule adds one-third of the spring's active mass to the load:

**fₙ ≈ (1 ÷ 2π) × √(k ÷ (M + mₛ ÷ 3))**

The rule comes from assuming that the coils move in proportion to their distance from the fixed end, so the average coil moves a third as much, in energy terms, as the load. The exact answer comes from the standing wave in the spring with a mass on its end, and the rule is accurate when the load is much heavier than the spring.

```figure
type: compare
title: The one-third rule against the exact spring-and-mass answer
rowhead: Load on the 41.77 N/mm spring
cols: Ignoring spring mass | One-third rule | Exact
caption: This is an illustration with spring mass 0.335 kg. The rule is excellent for heavy loads, good when the load equals the spring's mass, and drifts when the spring is heavier than the load.
- 105 kg, RF-3 mount | 3.174 Hz | 3.173 Hz | 3.173 Hz
- * 1 kg instrument | 32.53 Hz | 30.85 Hz | 30.82 Hz
- 0.335 kg, equal to spring mass | 56.21 Hz | 48.68 Hz | 48.36 Hz
- 0.1 kg | 102.9 Hz | 70.72 Hz | 68.65 Hz
```

For RF-3, at 105 kg per spring, the correction is about 0.05 per cent and irrelevant. For a light instrument or sensor on the same spring, ignoring the spring's mass overestimates the frequency by over 5 per cent, and the one-third rule recovers almost all of the error. Where the load is lighter than the spring, as in valve springs and some cam-follower springs, neither shortcut is reliable, and the spring must be treated as a wave carrier from the start.

## Valve springs and other fast springs

The same physics causes trouble wherever a spring is driven fast. Engine valve springs, cam-follower return springs and the springs in high-speed packaging mechanisms are cycled by cams whose motion contains many harmonics. If one harmonic matches the spring's surge frequency, the coils vibrate in a standing wave, the force the spring exerts on the follower fluctuates, and the follower can lose contact with the cam. Coils can also clash. Variable-pitch springs, nested springs and friction dampers are all used to break up or damp the surge. The [cam and follower design tool](/tools/cam-follower-design/) covers follower spring sizing; surge needs a separate check with the formula in this chapter.

## Exercise: a heavier isolator on a lighter unit

A smaller fan unit, RF-5, is to sit on four mounts carrying 40 kg each. The designer wants the same 25 mm static deflection, so chooses a spring of about 15.7 N/mm: 6 mm wire, 50 mm mean coil diameter. Find the number of active coils, the spring's active mass and its first surge frequency. Is the one-third correction significant?

**Answer.** The rate needed is 40 × 9.81 ÷ 25 ≈ 15.70 N/mm. The active coils are n = G d⁴ ÷ (8 D³ k) = 79,300 × 6⁴ ÷ (8 × 50³ × 15.70) ≈ 6.55 coils.

The active wire length is π × 50 × 6.55, about 1,029 mm. The wire area is π × 3², about 28.3 mm², so the active mass is about 1,029 × 28.3 × 7.85 × 10⁻⁶, roughly **0.228 kg**.

The surge frequency is ½ × √(15,700 ÷ 0.228) ≈ **131 Hz**. On a fan with a similar speed range, that sits inside the blade-pass band rather than twice blade pass, so a soft pad matters even more.

The one-third correction adds 0.076 kg to a 40 kg load, a change in frequency of about 0.1 per cent. It is not significant.
