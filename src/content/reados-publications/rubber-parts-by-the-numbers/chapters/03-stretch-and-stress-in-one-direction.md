---
book: rubber-parts-by-the-numbers
chapterSlug: stretch-and-stress-in-one-direction
order: 3
title: "Stretch and stress in one direction"
description: "Describe rubber at large stretch with the neo-Hookean and Gent models, read a tensile data sheet's moduli correctly, and catch a model rejected because true and nominal stress were compared."
draft: false
---

The simplest test of rubber is to pull a strip and record force against stretch. For steel the result is a straight line up to yield; for rubber it is a curve from the start, softening a little through moderate stretch and then turning sharply upwards as the network approaches full extension, until the strip breaks at several times its original length. Describing that curve with a formula is the first step to calculating any stretched rubber part, because the same formula, applied in two directions, describes membranes, sleeves and balloons.

This chapter introduces the two quantities that rubber tests report, nominal and true stress, then two models of the curve: the neo-Hookean model, with one constant, and the Gent model, which adds the stiffening at large stretch. It fits them to TP-100's compound, reads the compound's data sheet correctly, and describes a model that was nearly thrown out because two different stresses were compared.

## Stretch, nominal stress and true stress

Rubber engineers describe deformation by **stretch**, λ, the deformed length divided by the original length. A stretch of 1 is no deformation, 2 is double length. Engineering strain is λ − 1, so a stretch of 2 is a strain of 100%, which is how data sheets often express it.

Because the cross-section shrinks so much as rubber stretches, two stresses are in common use:

- **Nominal stress** is force divided by the original cross-sectional area. Tensile test machines report it, and rubber data sheets quote it.
- **True stress**, or Cauchy stress, is force divided by the current, shrunken area. Finite element programs report it, and it is the stress the material actually carries.

At constant volume, the current area is the original area divided by λ, so true stress is nominal stress multiplied by λ. At a stretch of 3, they differ by a factor of three. Neither is wrong; mixing them up is.

## The neo-Hookean model

The neo-Hookean model treats rubber as an ideal network of chains, giving a stored energy per unit volume of W = (G / 2)(λ₁² + λ₂² + λ₃² − 3), where λ₁, λ₂ and λ₃ are the stretches in three perpendicular directions and G is the shear modulus. For a strip pulled in one direction, constant volume makes the other two stretches 1 / √λ, and the nominal stress is:

```figure
type: formula
title: Neo-Hookean rubber in simple tension
formula: nominal stress = G (λ − 1 / λ²)     true stress = G (λ² − 1 / λ)
caption: This is an illustration for TP-100's compound, G = 0.82 MPa from its 50 Shore A hardness. At small stretch the nominal stress approaches 3G × strain = E × strain, matching Hooke's law; at larger stretch the curve bends below the straight line.
- λ | Stretch, current length over original length
- G | Shear modulus, MPa
step: At λ = 2: nominal stress = 0.82 × (2 − 0.25) = 1.43 MPa
step: At λ = 2: true stress = 0.82 × (4 − 0.5) = 2.87 MPa
```

The model's single constant comes straight from Chapter 2's hardness estimate, which makes it a natural first model. It describes many rubbers fairly well up to stretches of about 1.5 to 2 in tension. Beyond that, real rubber is stiffer than the model predicts, increasingly so as the chains approach their full length.

## The Gent model

Gent's 1996 model, listed in the references, adds one constant, Jm, which limits how far the network can be stretched. Its energy is W = −(G Jm / 2) ln(1 − (λ₁² + λ₂² + λ₃² − 3) / Jm). For small stretches it matches the neo-Hookean model; as the term λ₁² + λ₂² + λ₃² − 3 approaches Jm, the stress rises steeply without limit. In simple tension the nominal stress is the neo-Hookean value divided by (1 − (λ² + 2 / λ − 3) / Jm).

Fitted values of Jm for unfilled natural rubber are commonly reported in the region of 100; this book uses Jm = 97 as an illustration. With that value, the model's limiting stretch in simple tension is about 10, beyond any real compound's breaking stretch, but the stiffening becomes significant from a stretch of about 3.

```figure
type: compare
title: Nominal stress in simple tension for TP-100's compound, two models
cols: Neo-Hookean, nominal | Gent, Jm = 97, nominal | Neo-Hookean, true
caption: This is an illustration with G = 0.82 MPa. The models agree closely to a stretch of 2 and diverge beyond 3, where real rubber's strain stiffening shows. True stress is nominal stress times the stretch.
- λ = 1.5 | 0.86 MPa | 0.87 MPa | 1.30 MPa
- *λ = 2 | 1.43 MPa | 1.46 MPa | 2.87 MPa
- λ = 3 | 2.37 MPa | 2.54 MPa | 7.10 MPa
- λ = 4 | 3.22 MPa | 3.75 MPa | 12.90 MPa
- λ = 6 | 4.89 MPa | 7.45 MPa | 29.34 MPa
```

### Other models

Many other strain energy functions are in use. The Mooney–Rivlin model adds a second constant and fits moderate stretches of some rubbers better; Ogden models use several power-law terms and fit test data over wide ranges; filled rubbers often need models that also capture their softening over the first cycles. All of them reduce to the same small-strain shear modulus, and all need test data to fit their constants. For understanding and for first designs, the neo-Hookean and Gent models are enough, and for TP-100 the in-pipe stretch is small enough that the neo-Hookean model alone is adequate. The large-stretch behaviour matters for free inflation, where Chapter 5 uses the Gent model.

## Reading a rubber data sheet

A compound data sheet usually quotes a handful of tensile results from standard dumbbell tests, such as those in ISO 37:

- **Tensile strength**, the nominal stress at break.
- **Elongation at break**, the strain at break in per cent; 600% is a stretch of 7.
- **Modulus at 100%, 200% or 300%**, often written M100 or M300. Despite the name, these are not moduli. They are the nominal stresses at those elongations, that is, at stretches of 2, 3 and 4.

This is an illustration. The data sheet for TP-100's compound quotes a tensile strength of 18 MPa, an elongation at break of 620% and an M100 of 1.5 MPa. The neo-Hookean model with G = 0.82 MPa predicts a nominal stress of 1.43 MPa at a stretch of 2, within 5% of the data sheet's M100, so the hardness-based modulus and the tensile test agree well for this compound. The breaking stretch of 7.2 is a useful number for Chapter 5: a sleeve stretched in free air towards that range is close to tearing.

## Fitting the models to a test

Fitting a model is simpler than it sounds when the model has one or two constants. This is an illustration of the manufacturer's routine for a new compound.

```figure
type: steps
title: Fitting neo-Hookean and Gent constants to tensile data
caption: This is an illustration. Dumbbells cut from a moulded sheet of the batch, tested at the laboratory temperature; the first cycles are run to a stretch beyond the part's working range before the recorded pull.
- Precondition | stretch each dumbbell to about 2.5 and release, three times, then rest
- Record | pull to break, recording nominal stress against stretch from an extensometer
- Fit G | choose G so the neo-Hookean curve matches the data between stretches of 1.1 and 1.5
- Fit Jm | with G fixed, choose Jm so the Gent curve matches the data at stretches of 3 to 5
- Check | compare both models with the data across the range; note where each departs
- Record | G, Jm, tensile strength and breaking stretch, with batch and test date
```

Two details in that routine deserve explanation. Preconditioning matters because filled rubber is stiffer on its first stretch than on later ones; the effect is named after Mullins, who studied it. A part in service is stretched many times, so its stiffness is the cycled one, not the first-pull one, and a model fitted to first-pull data overstates it. And the range used to fit G should be the range the part works in. TP-100 works at a hoop stretch of about 1.15 in the pipe, so the fit of G between 1.1 and 1.5 is the one that matters most for sealing and grip.

### Rate and temperature

A tensile curve depends on how fast the strip is pulled and how warm it is. Faster pulling gives slightly higher stresses, because the chains have less time to rearrange; colder rubber is stiffer at the same rate, increasingly so near its glass transition. Standard tests fix both, and design data should be used at conditions close to those of the part. TP-100 is inflated over a few seconds and then held, which is close to the slow rates of a standard test; a part that flexes rapidly, such as a pump diaphragm, needs data at its working rate.

## The error: comparing true stress with nominal stress

This is an illustration. Early in TP-100's design, the manufacturer commissioned a finite element model of the sleeve from a consultant, using a Gent model fitted to its own tensile tests. The model reported stresses at several stretches, and the manufacturer's engineer compared them with the tensile test report to check the fit. At a stretch of 3, the model showed about 7.6 MPa, while the test report showed 2.5 MPa. The engineer concluded that the model was three times too stiff and asked for it to be refitted.

The consultant's reply was short. The finite element program reports true (Cauchy) stress, force over current area; the tensile test report gives nominal stress, force over original area. At a stretch of 3 they differ by exactly the stretch: 2.54 × 3 = 7.6 MPa. The model and the test agreed.

No time was lost beyond a day, but a refit would have produced a model three times too soft, which would have underestimated the pressure needed to reach the pipe wall and, more importantly, the stiffening that eventually limits free inflation. The manufacturer's engineering procedure now requires every comparison between model and test to state which stress each uses, and its model reports show both. The same check applies to any rubber data: a stress at a stated stretch means nothing until it is clear whether the area used is the original or the current one.

## Compression and shear with the same model

The same energy function covers compression and shear, which is part of its value. In unconstrained compression, the stretch is less than 1 and the neo-Hookean formula still applies: a block squeezed to λ = 0.8 carries a nominal compressive stress of 0.82 × (0.8 − 1 / 0.64) = −0.62 MPa, a little more than a linear spring with E = 2.46 MPa would predict for 20% compression, 0.49 MPa. In simple shear, the neo-Hookean model gives a shear stress exactly proportional to shear strain, τ = G γ, at any size of strain, which is one reason shear pads are so predictable and why rubber mounts are often loaded in shear.

Compression of a bonded block is different again, because the bonded faces stop the rubber bulging freely and the block's shape then dominates its stiffness. That is the territory of rubber mounts and pads, covered in Vibrating Machine Elements by the Numbers. TP-100's sleeve is never compressed in that way; at its clamped ends it is squeezed against the end plates, and the clamping is designed by the end-plate geometry rather than by calculation of the rubber.

## Breaking: strength, cuts and tearing

Tensile strength and elongation at break are measured on smooth, uncut dumbbells, and they describe rubber at its best. A real part with a small cut, a moulding flash line or a scratch from handling can break at a fraction of that strength, because a cut in stretched rubber concentrates the stretch at its tip and grows. Rubber's resistance to this is measured separately, as tear strength or as the energy needed to grow a cut, and natural rubber, which crystallises when stretched, is unusually good at it.

For TP-100, this has a practical meaning that the tensile numbers hide. The sleeve's breaking stretch of about 7 applies to an undamaged sleeve. A sleeve nicked on a burr inside a pipe or cut by a sharp end plate edge may tear at a much smaller stretch, and a tear in an inflated sleeve releases its stored air suddenly. The manufacturer's response, set out in Chapters 8 and 9, is to inspect sleeves before each use, to radius every metal edge the sleeve touches, and to retire any sleeve with a visible cut, however small.

## What tension tells us about inflation

A strip in tension is not an inflated sleeve, but the models fitted in tension carry over directly, which is their value. The same energy function, with the stretches of a membrane in place of those of a strip, gives the stress in a sleeve or balloon; Chapter 4 does that for TP-100's sleeve in the pipe, and Chapter 5 for the sleeve in free air. What tension tests add is confidence in the constants: G from the low-stretch slope, and Jm from the stiffening at high stretch.

For TP-100, three tension results matter:

1. **G** sets everything about the plug in the pipe, from seating pressure to contact pressure.
2. **The stiffening, Jm**, sets how large the sleeve would grow before strain stiffening caught it in free inflation.
3. **The breaking stretch** tells whether it would burst first. For this compound, with a breaking stretch of about 7, Chapter 5 shows that free inflation at 150 kPa would take the sleeve close to tearing.

## Exercise: reading a different compound

A nitrile compound for oily pipes has a hardness of 60 Shore A and a data sheet M100 of 2.3 MPa.

1. Estimate G from the hardness and predict the neo-Hookean nominal stress at a stretch of 2. Does it agree with the data sheet?
2. What would the true stress be at that stretch?

**Worked answer.**

1. From Chapter 2, 60 Shore A gives E = 3.61 MPa and G = 1.20 MPa. The neo-Hookean nominal stress at λ = 2 is 1.20 × (2 − 0.25) = **2.10 MPa**, about 9% below the data sheet's 2.3 MPa. That is reasonable agreement for a hardness estimate; nitrile compounds with reinforcing fillers are often a little stiffer at moderate stretch than an ideal network. If the plug's design depended on that 9%, a tensile fit to the compound's own data would be the next step.
2. True stress is nominal stress times stretch: 2.3 × 2 = **4.6 MPa** from the data sheet, or 2.10 × 2 = 4.2 MPa from the model. Any comparison with a finite element result should use these, not the nominal values.
