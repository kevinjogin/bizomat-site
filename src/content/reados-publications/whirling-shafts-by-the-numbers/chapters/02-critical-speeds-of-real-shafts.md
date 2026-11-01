---
book: whirling-shafts-by-the-numbers
chapterSlug: critical-speeds-of-real-shafts
order: 2
title: "Critical speeds of real shafts"
description: "Estimating the first critical speed of a shaft carrying several masses: Dunkerley's lower bound, Rayleigh's energy method, how close each is to the exact answer, and how margins are defined."
draft: false
---

Chapter 1's single disc at mid-span is the easiest rotor to analyse and the least like a real one. Real rotors spread their mass along the shaft: a disc pack, an impeller and a coupling hub, a row of fan blades, a set of rolls. The shaft has mass of its own. And the masses do not all sit where they bend the shaft most. A better estimate needs a way of combining all of these.

This chapter presents the two classic hand methods, Dunkerley's and Rayleigh's, applies them to the HM-30 rotor with a WORKOS tool, compares them with a near-exact answer, and works through an error in which the wrong estimate and a loosely worded margin approved a shaft that was too slender for its speed.

## Dunkerley's method

In 1894 Stanley Dunkerley proposed a simple rule for a shaft carrying several masses. Work out the critical speed the shaft would have with each mass on its own, and the critical speed of the shaft alone, then combine them:

```figure
type: formula
title: Dunkerley's combination of critical speeds
formula: 1 ÷ ω_c² ≈ 1 ÷ ω_s² + 1 ÷ ω₁² + 1 ÷ ω₂² + …
formula: Each mass alone: ω_i = √(1 ÷ (m_i × α_ii)), where α_ii is the shaft's deflection at that mass per unit force there
formula: Shaft alone, uniform, simple supports: ω_s = (π ÷ L)² × √(E × I ÷ (ρ × A))
caption: Dunkerley's result is always at or below the true first critical speed, so it is a safe, conservative estimate. For a single mass at mid-span it reduces to the single-disc result of Chapter 1.
- ω_c | combined first critical speed, rad/s
- ω_s | critical speed of the shaft under its own mass
- ω_i | critical speed with mass i alone on a massless shaft
- α_ii | influence coefficient: deflection at mass i per newton applied at mass i, m/N
```

Dunkerley's rule works because it adds flexibilities, like springs in series, and each term treats one mass as if the others were absent. It slightly overstates the flexibility, which is why it always comes out low. For a typical machine rotor it is within a few per cent of the true answer.

## Rayleigh's method

Lord Rayleigh's method, from his Theory of Sound of 1877, takes a different route: energy. When a shaft vibrates in its first mode, its energy swings between kinetic energy, as the masses move fastest through the straight position, and strain energy, as the shaft is bent most at the end of each swing. The two maxima must be equal. If the shape of the vibration is known, equating them gives the frequency.

The shape is not known exactly, but a reasonable guess gives a remarkably good answer. Rayleigh's choice for a shaft is the shape it takes under its own static load: the deflection curve under gravity. With deflections y_i at each mass m_i under the static loads, the estimate is:

```figure
type: formula
title: Rayleigh's estimate from the static deflection curve
formula: ω² ≈ g × Σ m_i y_i ÷ Σ m_i y_i²
caption: The deflections y_i are those under the static weights of all the masses together. Any assumed shape gives a frequency at least as high as the true one, so Rayleigh's estimate is an upper bound; a good shape makes it very close.
- g | 9.81 m/s²
- m_i | each mass, kg
- y_i | static deflection at mass i under all the static loads, m
```

The reason any guessed shape gives a frequency at or above the true one is worth understanding, because it is the same reasoning behind many approximate methods in engineering and physics. The true first mode is the shape of motion that minimises the ratio of strain energy to kinetic energy. Near that minimum the ratio changes only slowly as the shape changes: an error in the shape of a few per cent produces an error in the frequency of a fraction of a per cent. And because it is a minimum, every other shape gives a larger ratio, so a higher frequency. Expanding an energy about its minimum, and reading the behaviour from the curvature there, is a technique used across physics, from vibrations to the theory of phase transitions; Rayleigh's method is its most practical engineering form.

## Dunkerley by hand

The tool does the arithmetic, but working one case by hand shows where the numbers come from. This is an illustration, for the 90 mm production shaft.

```figure
type: steps
title: Dunkerley's estimate for the HM-30, 90 mm shaft, worked by hand
caption: This is an illustration. Steel, E = 200 GPa; simple supports 1,000 mm apart. Influence coefficients from the standard formula for a point load on a simply supported beam.
- Shaft bending stiffness | E × I = 200 × 10⁹ × π × 0.09⁴ ÷ 64 = 644,125 N·m²
- Middle mass, 60 kg at 500 mm | α = L³ ÷ (48 E I) = 32.3 µm per kN; ω = √(1 ÷ (60 × α)) = 718 rad/s, or 6,855 rpm
- Outer masses, 60 kg at 300 and 700 mm | α = 22.8 µm per kN each; 8,161 rpm each
- Shaft alone | (π ÷ L)² × √(E I ÷ mass per metre) gives 10,704 rpm
- * Combine | 1 ÷ n² = 1 ÷ 10,704² + 2 ÷ 8,161² + 1 ÷ 6,855², so n = 4,081 rpm
```

The middle mass contributes most to the sum of any single term, 35%, because it sits where the shaft is most flexible; the outer two together contribute 50%; the shaft's own mass contributes the remaining 15%, the least of the four terms but far from negligible.

The same breakdown explains the prototype. On the 80 mm shaft every flexibility term is larger by the ratio (90 ÷ 80)⁴ = 1.60 for the masses, because the shaft's stiffness varies as the fourth power of its diameter, while the shaft's own term grows less, because a thinner shaft is also lighter. The combined critical speed falls by roughly the square root of 1.6, about 21%, from 4,081 to 3,275 rpm. A shaft only 10 mm thinner lost a fifth of its critical speed, which is why diameter is the designer's most effective lever after span. That breakdown is useful in itself: it shows which change would help most. Here, anything that stiffens the middle of the span, or moves mass away from it, pays best.

## Stepped shafts

Real shafts are rarely one diameter. The HM-30's shaft is 90 mm through the disc pack but steps down to 85 mm at the bearing journals, to suit the bearings' bores, and to smaller diameters still at the coupling end outside the bearings. The simple tools assume one diameter throughout.

There are two sensible ways to deal with that. The quick, safe one is to use the smallest diameter between the bearings for the whole span: for the HM-30 that is 85 mm, which gives a Dunkerley estimate of 3,669 rpm, 10% below the 90 mm figure and a lower bound on the stepped shaft. The better one is to calculate the stepped shaft's actual deflection curve under the rotor's weight, by integrating the bending moment over the changing stiffness or by a beam program, and then to apply Rayleigh's formula to it. Because the HM-30's journals are short and sit right at the bearings, where the bending moment is small, their effect on the critical speed is only a few per cent, and the maker's rotordynamic model later confirmed that the 90 mm figure was the better guide.

## The HM-30 rotor with three masses

This is an illustration. The HM-30's 180 kg rotor is spread over the middle 400 mm of the 1,000 mm span. For a hand estimate, the maker split it into three equal masses of 60 kg, at 300, 500 and 700 mm from the drive-end bearing.

The WORKOS [Shaft critical speed with several masses](/tools/shaft-critical-speed-check/) tool takes a uniform shaft on simple supports, with up to three concentrated masses between the bearings. From the shaft diameter, bearing span, modulus and density, and each mass and its distance from the left bearing, it works out the shaft's own critical speed, the critical speed of each mass alone from its static deflection, Dunkerley's combination, and a Rayleigh estimate for the masses from their static deflection curve. It compares the running speed with the Dunkerley value and your margin. The tool's Rayleigh estimate uses the masses only, not the shaft's own mass, a point that matters later in this chapter.

```figure
type: compare
title: HM-30 rotor, three masses of 60 kg at 300, 500 and 700 mm, 1,000 mm span
cols: Shaft alone, rpm | Masses alone, rpm | Dunkerley, rpm | Rayleigh, masses only, rpm | Running 2,950 rpm ÷ Dunkerley
rowhead: Shaft diameter
- 80 mm, prototype | 9,514 | 6,448, 5,416, 6,448 | 3,275 | 3,589 | 90.1%
- * 90 mm, production | 10,704 | 8,161, 6,855, 8,161 | 4,081 | 4,542 | 72.3%
- 100 mm | 11,893 | 10,075, 8,463, 10,075 | 4,955 | 5,608 | 59.5%
caption: This is an illustration. Steel, E = 200 GPa, density 7,850 kg/m³, rigid bearings. The "masses alone" figures are for each 60 kg mass on its own on a massless shaft, in order along the span.
```

Spreading the mass towards the bearings has raised the estimate for the 90 mm shaft from the single-disc model's 3,712 rpm in Chapter 1 to 4,081 rpm. With the 25% margin the maker requires, the production shaft now runs below its critical speed: 72.3%, inside the 75% limit. The prototype's 80 mm shaft, at 90.1%, was well inside the danger band.

### How close are the estimates?

The hand methods can be compared with a more complete model. Dividing the shaft into a hundred short pieces, each with its own mass, adding the three rotor masses and solving for the lowest natural frequency gives a near-exact first critical speed for the same simple-supported, rigid-bearing idealisation.

```figure
type: compare
title: Four estimates of the HM-30's first critical speed, 90 mm shaft
cols: Critical speed, rpm | Against the near-exact value
rowhead: Method
- Single disc at mid-span (Chapter 1) | 3,712 | −11.2%
- * Dunkerley, three masses and shaft | 4,081 | −2.4%
- Near-exact, shaft in 100 pieces plus three masses | 4,181 | reference
- Rayleigh, static deflection including the shaft's mass | 4,182 | +0.0%
- Rayleigh, masses only (as the tool reports it) | 4,542 | +8.6%
caption: This is an illustration. Rigid bearings and simple supports in every case. The shaft's own mass, 49.9 kg between the bearings, is a quarter of the rotor's and cannot be ignored.
```

Dunkerley's estimate is 2.4% below the near-exact value, as expected for a lower bound. Rayleigh's method using the full static deflection, including the shaft's own weight, is within a few rpm of the exact answer, which is typical of the method. But Rayleigh's method applied to the masses only, leaving out a shaft that weighs 49.9 kg, is 8.6% high. The shaft's own mass lowers the critical speed, and an estimate that leaves it out errs on the unsafe side.

That is why the tool checks the running speed against the Dunkerley value, and reports the masses-only Rayleigh value for comparison rather than as the answer.

```figure
type: decision
title: Which estimate to design with
question: What is the estimate for?
- Checking the margin from running speed | Use Dunkerley | It is always low, so a margin met by Dunkerley is met by the real rotor (on rigid bearings)
- Predicting the speed where vibration will peak | Use Rayleigh with the shaft's mass, or a finite element model | Closest to the true value; still assumes rigid bearings
- * Quick comparison of options | Either, consistently | Ratios between options are reliable even if the absolute values are not
```

## Defining the margin

A critical speed margin can be written in two ways, and they are not the same.

- **Running speed at least X% below critical:** n_run ≤ (1 − X) × n_c. A 25% margin means running at no more than 75% of critical; the critical speed must be at least 1.33 times running speed.
- **Critical speed at least X% above running:** n_c ≥ (1 + X) × n_run. A 20% margin means the critical speed must be at least 1.2 times running speed; running at no more than 83.3% of critical.

The WORKOS critical speed tools use the first form: they ask for a margin and report the running speed as a percentage of critical, flagging anything within the margin on either side as "near critical". The HM-30's maker adopted the same form, with 25%, and wrote it into its design standard so that nobody could quote a different one.

## The error: the export variant approved on the wrong numbers

This is an illustration. The 60 Hz export version of the HM-30 runs at 3,550 rpm. An early design review for it, held while the maker's engineer was away, kept the production 90 mm shaft. The person checking it ran the several-masses tool, read the Rayleigh line, 4,542 rpm, and checked it against a rule they remembered from a previous employer: "critical speed at least 20% above running speed". Since 1.2 × 3,550 = 4,260 rpm, which is below 4,542, the shaft was recorded as acceptable.

Two things were wrong. The Rayleigh line leaves out the shaft's mass, and so overstates the critical speed by 8.6%. And the rule used was looser than the maker's own: 20% above, rather than 25% below. On the maker's rule, with the tool's Dunkerley value, the export variant runs at 3,550 ÷ 4,081 = 87.0% of critical, deep in the "near critical" band. Even the near-exact 4,181 rpm puts it at 84.9%.

```figure
type: bars
title: HM-30 export variant at 3,550 rpm, running speed as a share of critical
unit: %
caption: This is an illustration. The maker's limit is 75% (a 25% margin below critical). Only the 100 mm shaft meets it.
- 90 mm, Rayleigh masses only (as approved) | 78.2
- 90 mm, near-exact | 84.9
- * 90 mm, Dunkerley (the maker's check) | 87.0
- 100 mm, Dunkerley | 71.6
- Maker's limit | 75
```

The engineer caught it on return, at the drawing approval stage, by rerunning the tool and reading the line the tool actually checks against. The export variant was redesigned with a 100 mm shaft between the same bearings: Dunkerley 4,955 rpm, running at 71.6% of critical. Its bearings, pillow blocks and coupling were resized to suit. The maker added two notes to its design standard: the critical speed check uses the Dunkerley value from the several-masses tool, and the margin is "running speed at least 25% below the first critical speed", in those words.

## Beyond the hand methods

Dunkerley and Rayleigh are powerful because they are quick, and because they are bounds: the true answer lies between them when Rayleigh includes all the mass. But both assume a uniform shaft on rigid, simple supports, with point masses. Real rotors have stepped shafts, distributed discs, flexible bearings and supports, overhangs and gyroscopic effects. For a new design close to its margin, or one running above its critical speed, a rotordynamic model, built with beam elements for the shaft and springs and dampers for the bearings, is the right tool. The hand methods then serve to check that the model is roughly right, which is exactly what they did for the HM-30's maker when it later commissioned such a model for the export variant.

A rotordynamic model is only as good as its inputs, and the hardest inputs to get right are not the shaft's dimensions but the stiffness and damping of the bearings, pedestals and frame, and the way the rotor's discs and sleeves stiffen the shaft where they are shrunk or keyed onto it. A good practice is to build the model, check that it reproduces the hand estimates when its supports are made rigid, and then check that it reproduces a bump test on the real machine when the supports are given their real stiffness. A model that does both can be trusted for the variants that have not been built yet.

Chapter 4 adds the most important of the missing effects: the flexibility of the bearings and the frame.

## Exercise: moving the rotor mass

This is an illustration. A designer proposes a wider grinding chamber for a higher-capacity version, with the same 180 kg rotor spread as three 60 kg masses at 250, 500 and 750 mm on the same 90 mm shaft and 1,000 mm span.

1. Without calculating, will the critical speed rise or fall compared with masses at 300, 500 and 700 mm?
2. The several-masses tool gives a Dunkerley critical speed of 4,305 rpm for the new arrangement. What share of critical does the 2,950 rpm version run at?
3. Does the change help the 3,550 rpm export variant enough to keep the 90 mm shaft?

**Worked answer.**

1. It will **rise**. Moving the outer masses towards the bearings puts them where the shaft deflects less, so they contribute less flexibility in Dunkerley's sum and less kinetic energy in Rayleigh's.
2. 2,950 ÷ 4,305 = **68.5%**, comfortably inside the 75% limit.
3. 3,550 ÷ 4,305 = **82.5%**. **No**: still well inside the near-critical band. Moving mass towards the bearings helps, but not by enough; the export variant still needs the 100 mm shaft.
