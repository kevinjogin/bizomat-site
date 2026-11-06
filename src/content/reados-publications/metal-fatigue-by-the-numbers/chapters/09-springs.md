---
book: metal-fatigue-by-the-numbers
chapterSlug: springs
order: 9
title: "Springs: high stress, every cycle"
description: "How a compression spring's working stroke sets its stress cycle, how to check it for fatigue with wire strengths and Zimmerli's data, and what a longer stroke did to the PK-20's return spring."
draft: false
---

A spring is the most highly stressed part in most machines. It is made from very strong wire precisely so that it can store energy in a small space, and it works at stresses that would be reckless in a shaft. Most springs in machines also cycle on every stroke of the mechanism, so they must carry those stresses for millions of cycles. Spring fatigue is a separate discipline with its own data, and it repays care.

This chapter checks the PK-20's cam follower return spring, explains where its strength figures come from, and follows a change of cam lift that would have broken it within weeks.

## The return spring

The cam follower is held against the cam by a helical compression spring between the rocker lever and the frame. When the follower is on the cam's base circle, the spring is at its preload length; at full lift, it is compressed to its working length. This is an illustration.

```figure
type: compare
title: The PK-20 return spring
cols: Value | Notes
rowhead: Property
- Wire | 3.0 mm music wire | cold-drawn, high-carbon spring wire
- Mean coil diameter | 24 mm | spring index C = D ÷ d = 8
- Active coils | 10 | closed and ground ends, 12 total coils
- Shear modulus | 81.7 GPa | for music wire
- Free length | 80 mm | unloaded
- Preload length | 68 mm | follower on the base circle
- * Working length | 52 mm | follower at full lift: a 16 mm stroke
- Solid length | 36 mm | 12 coils × 3 mm
caption: This is an illustration. The spring is chosen to keep at least 70 N on the follower at all times, so it never leaves the cam at the PK-20's speed.
```

### Rate, loads and stresses

The spring's rate is k = G d⁴ ÷ (8 D³ Na) = 81,700 × 3⁴ ÷ (8 × 24³ × 10) = 5.984 N/mm. At the preload length it is compressed 12 mm, giving F1 = 71.8 N; at the working length 28 mm, giving F2 = 167.5 N.

The shear stress in the wire is the torsional stress of a bar twisted by the force times the coil radius, corrected for the curvature of the coil and the direct shear from the force. The correction factor used in the BIZOMAT tools is the Wahl form, K = (4C − 1) ÷ (4C − 4) + 0.615 ÷ C, which for C = 8 is 1.184.

```figure
type: formula
title: Shear stress in a helical compression spring
formula: τ = K × 8 F D ÷ (π d³)
formula: K = (4C − 1) ÷ (4C − 4) + 0.615 ÷ C,   C = D ÷ d
caption: The stress is highest on the inside of the coil, where cracks start. For C = 8, K = 1.184: the inside surface carries 18% more than the simple torsion formula gives.
- F | spring force
- D, d | mean coil diameter and wire diameter
- K | Wahl correction factor
```

The stress at the preload is τ1 = 1.184 × 8 × 71.8 × 24 ÷ (π × 27) = 192 MPa, and at the working length τ2 = 449 MPa. The alternating stress is (449 − 192) ÷ 2 = 128 MPa and the mean stress 321 MPa. Both are shear stresses, and the spring's strengths must be shear strengths to match.

## Spring wire strength

Spring wire is cold-drawn to very high strength, and thinner wire is stronger, because it has been drawn further. Spring texts fit the minimum tensile strength of each wire type as Sut = A ÷ d^m. For music wire, Shigley's gives A = 2,211 MPa·mm^m and m = 0.145, so a 3 mm wire has Sut = 2,211 ÷ 3^0.145 = 1,885 MPa.

The shear strengths used for fatigue are fractions of that: an ultimate shear strength of about 0.67 Sut, here 1,263 MPa, and a torsional yield strength for music wire of about 0.45 Sut, here 848 MPa. These fractions differ between wire types and between springs that have or have not had their set removed by pre-compression in manufacture; they should be taken from the spring maker's data where it exists.

### Zimmerli's data

Spring wire endurance is unusual in one useful way. Tests by Zimmerli in the 1950s found that, for spring steels with wire diameters under about 10 mm, the fatigue strength in torsion is almost independent of the wire's tensile strength and its size: the surface, not the core, sets it. Shigley's reports Zimmerli's results as a pair of figures for repeated loading from a low stress: an alternating strength of 241 MPa at a mean of 379 MPa for unpeened springs, and 398 MPa at 534 MPa for shot-peened ones.

A Goodman line through Zimmerli's point and the ultimate shear strength gives the torsional endurance limit for fully reversed shear, which is what the spring tool needs.

```figure
type: formula
title: Torsional endurance limit from Zimmerli's data, by Goodman
formula: Sse = Ssa ÷ (1 − Ssm ÷ Ssu)
formula: unpeened: 241 ÷ (1 − 379 ÷ 1,263) = 344 MPa
formula: shot-peened: 398 ÷ (1 − 534 ÷ 1,263) = 689 MPa
caption: This is an illustration for the PK-20's 3 mm music wire. Shot peening roughly doubles the fully reversed torsional endurance limit, because it leaves the inner coil surface in compression.
- Ssa, Ssm | Zimmerli's alternating and mean strengths
- Ssu | ultimate shear strength of the wire
- Sse | torsional endurance limit for the Goodman check
```

## The spring fatigue check tool

The [compression spring fatigue check](/tools/spring-fatigue-check/) tool takes the wire and coil diameters, active coils, end type, shear modulus, the free, preload and working lengths, and the wire's torsional endurance limit, ultimate and yield strengths. It returns the rate, the loads and Wahl-corrected stresses at the two lengths, the solid length, the alternating and mean stresses, and the Goodman, Soderberg and Gerber factors with a first-cycle yield factor, against a required factor. It refuses a working length below the solid length. It applies the Wahl factor to both the alternating and the mean stress, which is conservative, and reminds the user to check surge.

```figure
type: steps
title: The PK-20 return spring in the spring fatigue check tool
caption: This is an illustration. d = 3 mm, D = 24 mm, Na = 10, closed and ground, G = 81.7 GPa, lengths 80, 68 and 52 mm, Sse = 344 MPa, Ssu = 1,263 MPa, Ssy = 848 MPa, required factor 1.3.
- Rate and loads | 5.984 N/mm; 71.8 N and 167.5 N
- Stresses at preload and working length | 192 and 449 MPa
- Alternating and mean stress | 128 and 321 MPa
- * Goodman factor | 1.60: INFINITE LIFE EXPECTED
- Soderberg, Gerber and yield factors | 1.33, 1.99 and 1.89
- Solid length | 36 mm, 16 mm below the working length
```

The builder requires 1.3 on Goodman for springs, less than the 1.5 for machined parts, because spring wire and spring-making are closely controlled and Zimmerli's data are for the actual product form. The return spring passes with 1.60.

## The error: more lift for larger cartons

A customer asked for the PK-20 to handle a deeper carton, and the cam designer gave the cam 8 mm more lift. The spring's working length fell from 52 to 44 mm, still well clear of its 36 mm solid length, and the spring fitted. The cam designer, reasonably, checked only that the spring would not go solid.

The spring's designer was not asked. The first machine with the new cam came back from the customer's site after four weeks with two broken return springs, each cracked on the inside of a coil near the middle of the spring, with the fracture running at about 45° to the wire axis: the signature of torsional fatigue.

```figure
type: compare
title: The return spring with the original and the deeper-carton cam
cols: Working length, mm | Stress at working length, MPa | Alternating and mean, MPa | Goodman factor | Result
rowhead: Cam
- * Original, 16 mm stroke | 52 | 449 | 128 and 321 | 1.60 | INFINITE LIFE EXPECTED
- Deeper carton, 24 mm stroke | 44 | 577 | 192 and 385 | 1.16 | FATIGUE FAILURE LIKELY
caption: This is an illustration. Spring fatigue check tool, unpeened music wire, required factor 1.3. The extra 8 mm of stroke raised the alternating stress by half. The Soderberg factor fell to 0.99.
```

At four weeks of two-shift running the springs had seen about 770,000 cycles: a finite life in the range a factor of 1.16 on Goodman would suggest for a population with the usual scatter, some springs failing early.

### The fix

Two fixes were checked, both with the same tool.

```figure
type: compare
title: Two fixes for the deeper-carton spring
cols: Change | Goodman factor | Yield factor | Cost and effect
rowhead: Option
- Longer spring, 14 active coils | free length 92.8 mm, same preload, stroke 24 mm, lengths 76 to 52 mm | 1.51 | 1.81 | a longer spring pocket and lever; 4 mm clash allowance
- * Shot-peened spring, same size | Sse = 689 MPa | 1.71 | 1.47 | a few cents a spring; no other change
caption: This is an illustration. Both pass 1.3. Peening was chosen; it leaves the spring and pocket unchanged and keeps the margin above the longer spring's.
```

The builder chose a shot-peened spring of the same dimensions, with a peening specification on the drawing and a certificate from the spring maker. The deeper-carton machines have since run without spring failures. The lasting fix was a change to the design process: any change to a cam's lift now triggers a check of every spring and bolt the follower loads.

## How the spring is made matters

A spring's calculated stresses are the same whoever makes it; its fatigue strength is not. The steps of spring making, and what each does for fatigue, are worth knowing well enough to specify them.

1. **Wire.** Music wire is a high-carbon steel drawn through a series of dies to its final size. Its surface must be free of seams, laps and die marks, because any of them is a crack waiting to start under the high shear stress at the inside of the coil. Wire for fatigue-critical springs is bought to a grade with surface quality requirements, and the spring maker checks it.
2. **Coiling.** The wire is wound cold around a mandrel. Coiling leaves residual stresses in the wire that work against fatigue at the inside of the coil, the most highly stressed point.
3. **Stress relief.** A low-temperature heat treatment, typically a few hundred degrees for music wire, removes most of the coiling stresses and stabilises the spring's dimensions. Skipping it, or doing it at the wrong temperature, lowers both the fatigue strength and the yield strength.
4. **End grinding.** Closed and ground ends sit square on their seats, so the force acts along the spring's axis. A spring with rough or tilted ends loads one side of its coils more than the other.
5. **Shot peening.** Small hard shot fired at the coils cold-works the surface and leaves it in compression to a depth of a few tenths of a millimetre. It roughly doubles the endurance limit in Zimmerli's data. It must reach the inside of the coils, which is why closely wound springs are hard to peen well.
6. **Set removal.** The finished spring is compressed beyond its working length, sometimes to solid, so that the most highly stressed fibres yield slightly and are left with favourable residual stress. It raises the useful yield strength and stops the spring losing length in service.

The PK-20 drawing names the wire grade, requires stress relief and closed, ground ends, and for the deeper-carton spring calls up shot peening with a coverage check. A certificate from the spring maker confirms each step for every batch.

### Where spring cracks start

Because the Wahl correction puts the highest stress on the inside of the coil, fatigue cracks in helical compression springs start there, on the inner surface, usually near the middle of the spring where the active coils work hardest. The fracture face lies at about 45° to the wire axis, along the plane of greatest tensile stress in torsion. A crack at the end coil instead points to a seating problem: a tilted or damaged seat, or an end coil that touches the next one and rubs. The two broken PK-20 springs had the first pattern, which pointed straight to stress, not to installation.

## Other spring checks

Fatigue is not the only way a spring can fail its job.

- **Surge.** A spring is a mass and a stiffness, and it has its own natural frequency. If a harmonic of the cam's motion is close to it, waves run along the coils and the stresses rise far above the static values. For the PK-20 spring, with ends against flat seats, the fundamental frequency is about half of √(k ÷ m) for the active coils' mass of 0.042 kg: 0.5 × √(5,984 ÷ 0.0418) = 189 Hz. The cam turns at 0.67 Hz, and even its 20th harmonic is far below that. Engine valve springs, at thousands of revolutions a minute, are another matter.
- **Buckling.** A long compression spring can bow sideways. With both ends on flat, parallel seats, a common guide is that a spring is stable when its free length is less than about 5.26 times its mean diameter; the PK-20 spring's 80 mm is 3.3 times its 24 mm diameter, and it runs on a guide pin anyway.
- **Set.** A spring stressed close to its yield strength takes a permanent set, and its preload falls. The yield factor of 1.89 (1.47 for the peened deep-carton spring) keeps the PK-20 spring well clear; springs made with set removed tolerate higher stresses.
- **Corrosion.** A spring in a damp or washed-down machine needs a coating or a stainless or coated wire, and corrosion lowers its fatigue strength far more than a shaft's, because of the high stresses.

```figure
type: checklist
title: Spring design record for the PK-20 return spring
caption: This is an illustration. The record the builder now keeps for every cycling spring.
- x Wire type, diameter and strength source
- x Lengths: free, preload, working and solid, with the cam that sets them
- x Goodman factor at least 1.3, yield factor at least 1.2
- x Surge frequency against the cam's harmonics
- x Peening or set removal specified on the drawing where the check relies on it
- ? Re-check triggered by any change to cam lift or follower geometry
```

### Other kinds of spring

The same approach, stress cycle against a fatigue strength for the actual wire and finish, applies to other springs, but each has its own weak point. An extension spring usually fails at its hooks, where the wire is bent sharply and carries bending as well as torsion; its body may be far from its limit. A torsion spring's wire is in bending, not torsion, so its strengths are the bending strengths of the wire, and its legs and their bends need checking. A leaf spring's critical point is often at the clamp or the centre bolt hole, where fretting and a notch combine. In each case, the calculation for the body of the spring is the easy part; the ends are where the experience lies.

## Exercise: a heavier wire

Instead of peening, a designer proposes 3.2 mm music wire for the deeper-carton spring, with the same 24 mm mean diameter, 10 active coils and lengths of 80, 68 and 44 mm. The wire's strengths are close enough to the 3 mm wire's to keep Sse = 344, Ssu = 1,263 and Ssy = 848 MPa for a first look. Find the rate, the stresses and the Goodman factor. Is it an improvement?

**Worked answer.** The index falls to 24 ÷ 3.2 = 7.5 and K = (4 × 7.5 − 1) ÷ (4 × 7.5 − 4) + 0.615 ÷ 7.5 = 29 ÷ 26 + 0.082 = 1.197. The rate is 81,700 × 3.2⁴ ÷ (8 × 24³ × 10) = 7.746 N/mm, so F1 = 7.746 × 12 = 93.0 N and F2 = 7.746 × 36 = 278.9 N. The stresses are τ1 = 1.197 × 8 × 93.0 × 24 ÷ (π × 3.2³) = 208 MPa and τ2 = 623 MPa, so the alternating stress is 208 MPa and the mean 415 MPa. Goodman: 1 ÷ n = 208 ÷ 344 + 415 ÷ 1,263 = 0.605 + 0.329 = 0.934, n = 1.07.

The heavier wire is worse, not better. A stiffer spring with the same stroke carries more force, and the force rises faster than the wire's section modulus. Under a fixed deflection, the way to lower the stress is a lower rate: more coils or a larger coil diameter, or a stronger surface, as peening gives.
