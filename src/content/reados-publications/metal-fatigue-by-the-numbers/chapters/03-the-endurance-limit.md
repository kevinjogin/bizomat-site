---
book: metal-fatigue-by-the-numbers
chapterSlug: the-endurance-limit
order: 3
title: "The endurance limit and what lowers it"
description: "What the S-N curve and the endurance limit of steel are, how to estimate the limit from tensile strength, and how surface, size, load type, temperature and reliability lower it."
draft: false
---

A steel test bar spun under a fully reversed bending stress will break after some number of cycles. Lower the stress and it lasts longer. Lower it far enough and, for most steels, it does not break at all, however long the test runs. The stress below which that happens is the endurance limit, and it is the foundation of infinite-life design.

This chapter explains where the endurance limit comes from, how to estimate it when no test data exist, and how to correct a laboratory value for a real part. Those corrections are where most of the judgement in a fatigue calculation lies, and the PK-20 camshaft shows how much they change the answer.

## The S-N curve

Fatigue strength is measured by testing many specimens, each at a constant alternating stress, and recording the number of cycles each survives. Plotted with the stress amplitude S on the vertical axis and the number of cycles N on a logarithmic horizontal axis, the results form the S-N curve, also called a Wöhler curve after the railway engineer who first measured one in the 1850s and 1860s.

```figure
type: line
title: An estimated S-N line for the PK-20 camshaft steel, corrected for the part
x: Cycles to failure, log₁₀ N
y: Alternating stress, MPa
ymin: 0
ymax: 900
mark: 6 | knee: corrected endurance limit, 250.5 MPa
caption: This is an illustration. The usual estimate for steel: 0.9 × tensile strength (810 MPa) at 10³ cycles, a straight line on log-log axes down to the corrected endurance limit at 10⁶ cycles, and a horizontal line beyond. Real test points scatter widely about such a line.
- 3 | 810
- 3.5 | 666
- 4 | 548
- 4.5 | 450
- 5 | 370
- 5.5 | 305
- 6 | 250.5
- 7 | 250.5
- 8 | 250.5
```

For steels and titanium alloys, the curve flattens at somewhere between 10⁶ and 10⁷ cycles. The flat part is the endurance limit, often called the fatigue limit. For aluminium, copper and most non-ferrous alloys the curve keeps falling, slowly, for as long as anyone has tested; for those materials a fatigue strength is quoted at a stated life, such as 5 × 10⁸ cycles, and there is no infinite life.

### Why steel has a limit

The flattening in steel is usually explained by the small interstitial atoms in its lattice, carbon and nitrogen. They gather around dislocations and pin them in place. Below a certain stress amplitude, the dislocations in even the worst-placed grains cannot break free often enough to build the slip bands that start cracks (Chapter 1), and the damage stops accumulating. Above it, they can, and the S-N curve continues downwards.

That picture carries three warnings. The limit can disappear when something else starts cracks: a corrosive environment that pits the surface, a high temperature that lets the pinning atoms move, or occasional large cycles that start a crack which smaller cycles then grow. Chapter 6 returns to the last of these, because it is what happened to the PK-16.

## Estimating the endurance limit

Where no fatigue test data exist for a steel, the endurance limit of a smooth, polished rotating-beam specimen is commonly estimated from its tensile strength. Textbooks such as Shigley's use about half the tensile strength, up to a tensile strength of about 1,400 MPa, and a ceiling of about 700 MPa above that, because very strong steels are limited by inclusions and their endurance limit stops rising.

```figure
type: formula
title: The specimen endurance limit and the corrected endurance limit
formula: S′e = 0.5 Su  (Su up to 1,400 MPa),  S′e = 700 MPa above that
formula: Se = ka × kb × kc × kd × ke × S′e
caption: The specimen value S′e is a rough estimate, with a scatter of about ±20% between steels of the same tensile strength. Use a tested value for the actual material when one exists. The five factors convert the specimen to the part.
- ka | surface factor: finish of the part's surface
- kb | size factor: the part's diameter or equivalent diameter
- kc | load factor: bending, axial or torsion
- kd | temperature factor: 1 at room temperature
- ke | reliability factor: the share of parts that should reach the limit
```

For the PK-20 camshaft steel, Su = 900 MPa, so S′e = 450 MPa. That is the estimate for a polished 7.5 mm specimen in a laboratory, loaded in rotating bending, at room temperature, with a 50% chance of surviving. The camshaft is none of those things except the bending.

## The correction factors

The factors below are the widely used Marin factors as given in Shigley's Mechanical Engineering Design. They are empirical fits to test data, and other texts and standards use different values; the point is not their third decimal place but the order of magnitude of each effect.

### Surface: ka

Surface finish matters most, because cracks start at the surface. The surface factor is fitted as ka = a × Su^b, with Su in MPa.

```figure
type: compare
title: Surface factors for the PK-20 camshaft steel, Su = 900 MPa
cols: a, MPa | b | ka | Corrected endurance limit, MPa
rowhead: Surface finish
- Ground | 1.58 | −0.085 | 0.886 | 298.3
- * Machined or cold-drawn | 4.51 | −0.265 | 0.744 | 250.5
- Hot-rolled | 57.7 | −0.718 | 0.437 | 147.1
- As-forged | 272 | −0.995 | 0.313 | 105.4
caption: This is an illustration. Fit constants as given in Shigley's. The endurance limits use the case's size and reliability factors, 0.862 and 0.868. The same steel with a forged surface has about a third of the endurance limit it has when ground.
```

Note how the factor falls as the steel gets stronger. A strong steel is more sensitive to surface defects, because its higher stresses act on the same scratches and pits. Machined surfaces of a 400 MPa steel keep 92% of their polished endurance limit; at 1,600 MPa they keep 64%. Buying a stronger steel and leaving its surface rough gains far less than the tensile strengths suggest.

### Size: kb

Larger parts have more surface and more volume at high stress, so they are more likely to contain a weak spot, and in bending their stress gradient is shallower. For rotating round sections in bending or torsion the size factor is kb = 1.24 d^−0.107 for d from 2.79 to 51 mm and kb = 1.51 d^−0.157 from 51 to 254 mm. For the camshaft's 30 mm seat, kb = 0.862.

For a non-rotating part, or one that is not round, an equivalent diameter is used: the diameter of a rotating round bar whose most highly stressed volume matches that of the part. For a rectangular section h × b in non-rotating bending, the equivalent diameter is 0.808 √(h b). For the rocker lever's 16 × 40 mm section that is 0.808 × √640 = 20.4 mm, and kb = 0.898.

For axial loading there is no stress gradient and no size effect in this sense: kb = 1, although kc then reduces the limit.

### Load: kc

Rotating bending is the reference. Axial loading takes kc = 0.85, because the whole section is at the peak stress, not just the outer fibre. Torsion is usually handled either with kc = 0.59, giving a torsional endurance limit in shear, or by combining the stresses into a von Mises equivalent and using kc = 1. Never do both: Chapter 7 shows that error.

### Temperature: kd

At room temperature kd = 1. Steel's endurance limit stays near its room-temperature value up to roughly 250 to 350 °C and then falls; above that, creep and oxidation join in and data for the actual alloy are needed. The PK-20 runs in a packing hall, so kd = 1.

### Reliability: ke

The estimate S′e is a mean value: half of all parts would have a lower endurance limit. To design so that a larger share of parts survive, the limit is reduced, assuming the scatter follows a normal distribution with a standard deviation of about 8% of the mean.

```figure
type: bars
title: Reliability factors for an 8% standard deviation of endurance limit
unit: factor
caption: Factors as tabulated in Shigley's. The builder uses 95% (0.868) for the PK-20, which is an engineering choice, not a rule. Higher reliability costs strength quickly.
- 50% | 1
- 90% | 0.897
- * 95% | 0.868
- 99% | 0.814
- 99.9% | 0.753
- 99.99% | 0.702
```

## The PK-20 camshaft and lever corrected

```figure
type: stack
title: From specimen to part: the PK-20 camshaft's endurance limit
unit: MPa
caption: This is an illustration. Each step multiplies by one factor: 450 × 0.744 × 0.862 × 1 × 1 × 0.868 = 250.5 MPa. The machined surface costs the most; the size and reliability factors together cost about a quarter more.
- Lost to the machined surface | 115.2
- Lost to the 30 mm size | 46.2
- Lost to 95% reliability | 38.1
- * Corrected endurance limit | 250.5
```

The camshaft's corrected endurance limit is 250.5 MPa, a little over half of the 450 MPa specimen estimate. The rocker lever, in a 620 MPa normalised steel, starts from S′e = 310 MPa and is corrected by a machined surface factor of 0.821, an equivalent-diameter size factor of 0.898 and the same reliability factor of 0.868, to Se = 198.4 MPa.

### In the fatigue design check tool

The [fatigue design check](/tools/fatigue-design-check/) tool takes the tensile and yield strength, an optional tested specimen endurance limit (entering 0 makes it estimate 0.5 Su, capped at 700 MPa) and the five factors, and reports the corrected endurance limit with everything that depends on it. The factors are typed in, not calculated: the tool cannot know the surface finish, the size or the reliability wanted. That is deliberate. Each factor is a decision that someone must be able to defend.

```figure
type: compare
title: The PK-20 camshaft at the shoulder with three surface finishes
cols: ka | Corrected endurance limit, MPa | Goodman factor with a 2 mm fillet
rowhead: Finish of the fillet
- Hot-rolled (not machined) | 0.437 | 147.1 | 0.90
- * Turned | 0.744 | 250.5 | 1.54
- Ground | 0.886 | 298.3 | 1.83
caption: This is an illustration. Fatigue design check tool, 900 and 700 MPa, size 0.862, reliability 0.868, fillet stress concentration factor 1.7 at 2 mm radius, bending ±98.1 MPa. Chapter 4 explains the fillet; the point here is that finish alone moves the answer from failure to a comfortable margin.
```

## Other things that move the limit

The five Marin factors cover the effects that every part has. Several others apply only to some parts, and the list below is the one the builder runs through for each critical surface. None of them has a reliable universal factor; where they apply, test data for the actual process are the only sound basis.

- **Residual stress.** A compressive residual stress at the surface works like a compressive mean stress: it holds cracks shut. Shot peening, cold rolling of fillets and threads, and surface hardening by induction or carburising all leave such a stress, and can raise the fatigue strength of a notched part substantially. Grinding done badly, welding and some machining leave tensile residual stress, which does the opposite.
- **Surface hardening.** An induction-hardened or carburised case is both stronger and in residual compression. A hardened fillet can carry far more than the core's endurance limit suggests, but the crack may then start below the case, where the hardness has fallen and the residual stress has turned tensile. The check must be made at that depth too.
- **Plating and coating.** Hard chromium and nickel plating can lower the fatigue strength of steel, because the plating carries tensile residual stress and cracks easily, and its cracks run into the steel. Zinc and cadmium plating have smaller effects. Hydrogen absorbed during plating can embrittle high-strength steel unless it is baked out.
- **Corrosion.** A corroding surface has no endurance limit: pits keep forming, and each pit is a notch. Even a damp atmosphere lowers the fatigue strength of steel noticeably; salt water lowers it severely.
- **Fretting.** Where two surfaces in contact slide by a few micrometres on every cycle, such as a hub pressed onto a shaft or a bearing race in its seat, the rubbing tears the surface and starts cracks at stresses far below the normal endurance limit. The PK-20's cam is keyed and clamped to its shaft; Chapter 7 checks the keyway, and the fit is chosen so that the hub does not slip.
- **Decarburisation.** A hot-rolled or forged surface often loses carbon from its outer layer, leaving soft ferrite where the stress is highest. This is part of the reason the hot-rolled and forged surface factors are so low.

### Tested data

The best endurance limit is one measured on the actual material, in the actual condition, ideally on specimens with the actual surface. A small builder rarely runs fatigue tests, but three sources are often available: the steel maker's data for the grade and heat treatment, published data for the same grade in handbooks, and the builder's own field history. The PK-20 used the first two to check the 0.5 Su estimate and the third, the PK-16 failures, to check the whole method (Chapter 6).

Where a laboratory measures an endurance limit, it normally uses a staircase, or up-and-down, test: each specimen is tested at a stress one step above the last if the last survived, or one step below if it failed, so that the tests cluster around the limit and give both its mean and its scatter. A dozen or more specimens are needed for a useful estimate of the scatter. That cost is why the estimate and its factors are so widely used.

## The error: the datasheet endurance limit

Early in the PK-20 project, a supplier's datasheet for the alloy steel bar quoted a rotating-beam endurance limit of 460 MPa. The design engineer, pleased to have a tested value, entered it in the fatigue spreadsheet as the endurance limit of the camshaft. With the shoulder's notch and loads, the spreadsheet showed a safety factor of 2.8, and the engineer proposed to reduce the shaft to 25 mm to save weight.

The design review found the problem in one question: what specimen? The datasheet's footnote described polished specimens of 7.5 mm diameter. A tested specimen value is a better S′e than the 0.5 Su estimate, and the builder was right to want it, but it is still a specimen value. It needs every one of the corrections: the turned surface, the 30 mm size, and the 95% reliability. With them, 460 MPa becomes 0.744 × 0.862 × 0.868 × 460 = 256 MPa, close to the estimate the tool gives from the tensile strength.

The spreadsheet had overstated the endurance limit by about 80%. A 25 mm shaft, with its bending stress raised by (30 ÷ 25)³ = 1.73 times, would have been far weaker than the PK-16 shaft that cracked.

The builder's checklist now requires every endurance limit to be labelled as either a specimen value, S′e, or a part value, Se, with the factors that turned one into the other written beside it.

```figure
type: checklist
title: Checks on any endurance limit before it is used
caption: The builder's checklist after the datasheet error. This is an illustration.
- x Is the value for a specimen or for the part?
- x Which surface, size, load type, temperature and reliability does it represent?
- x Are the five factors written down, with their source?
- x Is the material in the condition tested (heat treatment, direction of rolling)?
- ? Is there corrosion, fretting or high temperature that could remove the limit altogether?
```

## Exercise: the lever's endurance limit

The PK-20 rocker lever is made from normalised 0.45% carbon steel with Su = 620 MPa. Its critical section is 16 × 40 mm in non-rotating bending, machined all over. Find its corrected endurance limit at 95% reliability. If the lever were instead left with its flame-cut and hot-rolled surface, which the builder takes as a hot-rolled finish, what would the limit be?

**Worked answer.** The specimen estimate is S′e = 0.5 × 620 = 310 MPa. The machined surface factor is 4.51 × 620^−0.265 = 0.821. The equivalent diameter is 0.808 × √(16 × 40) = 20.4 mm, so kb = 1.24 × 20.4^−0.107 = 0.898. The load factor is 1 for bending, the temperature factor 1 and the reliability factor 0.868. The corrected endurance limit is 0.821 × 0.898 × 1 × 1 × 0.868 × 310 = 198.4 MPa.

With a hot-rolled surface, ka = 57.7 × 620^−0.718 = 0.570, and the limit becomes 0.570 × 0.898 × 0.868 × 310 = 137.7 MPa: 31% lower. Machining the lever's critical faces, or at least the hub fillet, is worth its cost.
