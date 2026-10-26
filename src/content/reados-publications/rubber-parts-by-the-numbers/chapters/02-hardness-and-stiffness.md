---
book: rubber-parts-by-the-numbers
chapterSlug: hardness-and-stiffness
order: 2
title: "Hardness and stiffness"
description: "Turn a Shore A hardness into a Young's and shear modulus, see how far a ±5 hardness tolerance moves a design, know where the estimate fails, and catch a hardness read on a part too thin to measure."
draft: false
---

A rubber supplier describes a compound first by its hardness: "a 50 Shore A natural rubber", "a 70 Shore A nitrile". Hardness is easy to measure, with a hand-held durometer pressed against the rubber, and it is the number on almost every drawing that calls up a rubber part. But a designer calculating how much a sleeve stretches under pressure needs a modulus, a stiffness in megapascals, and the durometer does not give one directly.

The link between the two is an empirical relation published in 1958, which turns a hardness reading into an estimate of Young's modulus. It is good enough for design within its range and unreliable outside it. This chapter sets out the relation, applies it to TP-100's compound, follows a typical hardness tolerance through to the plug's numbers, and records a hardness reading that rejected a good batch of sleeves.

## What a durometer measures

A Shore A durometer presses a small, blunt indenter into the rubber with a calibrated spring. The softer the rubber, the further the indenter goes in and the lower the reading. The scale runs from 0, where the indenter sinks fully, to 100, where it does not sink at all. Soft rubber bands are around 30 to 40 Shore A, tyre treads around 60, and hard rubber rollers 80 or more.

Hardness standards, such as ISO 48-4 and ASTM D2240, fix the indenter's shape, the spring, how the instrument is applied, how long after contact the reading is taken, and the minimum thickness of the specimen. The last two details matter more than they seem. Rubber creeps under the indenter, so the reading falls slightly with time, and a thin specimen lets the indenter feel whatever is underneath it.

### Taking a reading that means something

A durometer reading is quick, and that is its danger: it is easy to take a reading that looks precise and means little. A reliable routine has a few steps, all of them set out in more detail in the standards:

1. **Condition the specimen.** Rubber's hardness changes with temperature, so specimens are tested at the laboratory temperature the standard specifies, after enough time to reach it. A sleeve brought in from a cold store or a hot ute reads differently.
2. **Use a proper specimen.** Flat, smooth, parallel-sided and at least as thick as the standard's minimum, stacked from plies if necessary, and resting on a hard, flat surface.
3. **Keep away from edges.** A reading taken too close to an edge lets the rubber bulge sideways and reads low.
4. **Apply the instrument squarely and firmly**, or use a stand that applies the specified force, so that the presser foot sits flat on the rubber.
5. **Read at the specified time** after contact, because the reading drifts down as the rubber creeps.
6. **Take several readings** at different points and report their median, so that one bad contact does not decide the result.

Done this way, two operators with two calibrated instruments usually agree within a couple of points. Done casually, the same pair can disagree by five or more, the whole width of a typical tolerance.

## From hardness to modulus

Gent's relation, from the 1958 paper in the references, estimates Young's modulus in megapascals from the Shore A hardness S:

```figure
type: formula
title: Gent's relation between Shore A hardness and Young's modulus
formula: E = 0.0981 (56 + 7.62336 S) / (0.137505 (254 − 2.54 S))
caption: E in MPa, S in Shore A. The relation is empirical; it departs from measurements below about 40 Shore A and runs to infinity at 100. For rubber, which keeps its volume, the shear modulus is G = E / 3.
- S | Shore A hardness
- E | Young's modulus at small strain, MPa
- G | Shear modulus, E / 3, MPa
step: For S = 50: E = 0.0981 × 437.2 / (0.137505 × 127) = 2.46 MPa
step: G = 2.46 / 3 = 0.82 MPa
```

The factor of three between E and G comes from incompressibility. For any isotropic material, E = 2G(1 + ν); with ν = 0.5, E = 3G. The neo-Hookean model of Chapters 3 to 5 uses G, so this book quotes both.

```figure
type: bars
title: Young's modulus estimated from Shore A hardness, Gent's relation
unit: MPa
max: 6
caption: This is an illustration of the relation across a common range. Below about 40 Shore A it departs from measurements and should not be used. The spread between neighbouring compounds of the same hardness can be large.
- 40 Shore A | 1.69
- 45 Shore A | 2.04
- *50 Shore A, TP-100 | 2.46
- 55 Shore A | 2.97
- 60 Shore A | 3.61
- 70 Shore A | 5.52
```

Two features of the curve matter in design. Stiffness rises faster than hardness: from 50 to 70 Shore A, E more than doubles. And the relation steepens towards the top of the scale, so small differences in hardness among hard compounds mean large differences in stiffness.

## The running case: TP-100's compound

This is an illustration. TP-100's sleeve is specified as natural rubber of 50 ± 5 Shore A, a common way of writing a hardness requirement. The nominal compound gives E = 2.46 MPa and G = 0.82 MPa. The tolerance band, from 45 to 55 Shore A, gives E from 2.04 to 2.97 MPa, a ratio of 1.46. A five-point tolerance on hardness is a 46% band on stiffness.

That band runs through every number in the plug's design. Chapters 4 and 5 show that the pressure needed to stretch the sleeve to the pipe wall, and the pressure limit beyond which it cannot resist inflation in free air, are both proportional to G. The table carries the tolerance through.

```figure
type: compare
title: TP-100's sleeve across its hardness tolerance
cols: Shear modulus G | Pressure to reach the pipe | Contact pressure at 150 kPa | Free-inflation limit
caption: This is an illustration. 4 mm sleeve, 42 mm mean radius, ends held, stretched to the 100 mm bore; neo-Hookean model from Chapters 4 and 5. Every compound in the band has a free-inflation limit far below the 150 kPa working pressure.
- 45 Shore A | 0.68 MPa | 27.6 kPa | 122.4 kPa | 64.7 kPa
- *50 Shore A | 0.82 MPa | 33.2 kPa | 116.8 kPa | 78.0 kPa
- 55 Shore A | 0.99 MPa | 40.1 kPa | 109.9 kPa | 94.2 kPa
```

For sealing and grip, the tolerance hardly matters: contact pressure changes by about 10%, because most of the 150 kPa goes into contact whatever the compound. For the free-inflation limit, it matters more, moving the limit from 65 to 94 kPa. But all three limits are well below 150 kPa, so the tolerance does not change the conclusion of Chapter 1: no compound in the band makes free inflation at working pressure safe.

## Where the estimate fails

Gent's relation is a fit to measurements on a range of compounds. It is a good first estimate, and three limits keep it honest:

1. **Soft compounds.** Below about 40 Shore A, the relation departs from measured moduli. Soft compounds should be characterised by test.
2. **Filled compounds at larger strain.** Carbon black and other fillers stiffen rubber at small strain more than at large strain, and their stiffness falls noticeably over the first few cycles. The modulus from hardness is a small-strain value; at the stretches TP-100 reaches in the pipe, about 15%, it is adequate, but the behaviour at large stretch needs the tensile tests of Chapter 3.
3. **Compound-to-compound scatter.** Two compounds with the same hardness can differ in modulus by 10% to 20% because of their filler, oil and cure. Hardness is a first estimate of stiffness, not a measurement of it.

When a part's function depends critically on stiffness, as an inflatable part's limit pressure does, the compound's modulus should be measured, typically by a tensile test on dumbbell specimens from the same batch, as Chapter 3 describes.

### Measuring the modulus directly

When hardness is not good enough, there are three common ways to measure stiffness more directly, each suited to a different situation:

- **Tensile test on dumbbells.** Specimens cut from a sheet of the compound are stretched in a test machine, and the stress at several stretches is recorded. The low-strain slope gives E, and the whole curve feeds the large-stretch models of Chapter 3. It is the standard route for a compound being qualified.
- **Compression of a bonded button.** A short cylinder of rubber bonded between two plates is compressed a few per cent. Because the bonded faces cannot slide, the measured stiffness depends on the button's shape as well as the rubber's modulus, and a correction for shape is needed. It is the natural test for compounds used in mounts and pads.
- **Testing the part itself.** For an inflatable part, the most relevant stiffness measurement is an inflation test: pressure against diameter, measured on a real sleeve held in a fixture. Chapter 9 describes TP-100's version, which checks the whole chain from compound to geometry in one test.

For TP-100, the manufacturer qualifies each new compound with tensile tests and then checks each batch with hardness and a sample inflation test. Hardness alone screens out gross errors cheaply; the inflation test confirms the number that matters. The two together also build a record, batch by batch, of how hardness and measured stiffness track each other for this compound, which over time tells the manufacturer how much to trust a hardness reading on its own and when a batch deserves a closer look.

## The error: hardness read on a thin, curved sleeve

This is an illustration. The first production batch of TP-100 sleeves arrived with the supplier's certificate showing 51 Shore A, measured on a moulded test button from the batch. The plug manufacturer's incoming inspector checked a sleeve with the workshop's durometer, pressing it against the outside of a sleeve that had been fitted onto a plug body for convenience. The readings were 55 to 57 Shore A, outside the 45 to 55 tolerance. The batch was put on hold and the supplier was asked to explain.

The supplier pointed to two problems with the inspection. The sleeve wall is 4 mm thick, thinner than the minimum specimen thickness the hardness standards require, so the indenter was partly feeling the hard plug body beneath the sleeve. And the sleeve's outside surface is curved, so the durometer's foot did not sit flat. Both effects make the reading high.

The inspector repeated the check correctly, on a test button cut from the same batch and on a stack of flat offcuts from the sleeve material, thick enough to meet the standard's minimum and laid on a flat, rigid table. Both read 50 to 52 Shore A, matching the certificate. The batch was released, after a three-day delay.

The manufacturer changed two things. The incoming inspection instruction now specifies the specimen: the supplier's test button or flat offcuts stacked to the standard's minimum thickness, never a sleeve on a plug body. And the purchase specification now asks the supplier to supply a test button with each batch, so that the manufacturer can check the same specimen the certificate describes. The lesson is that a hardness number is only meaningful with its specimen and method, and that a reading taken any other way should not be used to accept or reject anything.

## Hardness in the specification

A rubber part's drawing or specification should state more than "50 Shore A". A useful minimum is:

- the polymer type, such as natural rubber or nitrile, and any service requirements such as oil or ozone resistance;
- the hardness with its tolerance and its test method, including the specimen;
- the tensile strength and elongation at break the compound must meet, from tensile tests;
- any compression set or ageing requirement, from Chapter 8;
- how each batch is to be certified and what specimens come with it.

Hardness tolerances of ±5 points are common because compounding and curing vary from batch to batch, and tighter tolerances cost more to hold. A designer whose part is sensitive to stiffness should either design for the whole band, as the table above does, or ask the supplier what tolerance it can hold reliably and pay for it. Asking for ±3 points on a compound the supplier normally makes to ±5 without discussing it usually produces rejected batches rather than better rubber.

For TP-100, the manufacturer's specification also states the minimum shear modulus it relies on for the free-inflation warning, so that a substitute compound cannot quietly make the plug's behaviour worse. Since the free-inflation limit is proportional to G, a softer substitute lowers it further.

## Exercise: could a harder sleeve make free inflation safe?

A reviewer suggests making TP-100's sleeve harder so that inflating it in free air at 150 kPa would not run away. Using the plane-strain limit p = G × t / r from Chapter 5:

1. What is the free-inflation limit of a 60 Shore A sleeve with the same 4 mm wall?
2. What hardness would be needed to raise the limit to 150 kPa with a 4 mm wall and a 42 mm mean radius?
3. Alternatively, what wall thickness would be needed with the 50 Shore A compound, keeping the 88 mm outside diameter?

**Worked answer.**

1. At 60 Shore A, E = 3.61 MPa and G = 1.20 MPa, so the limit is 1.20 × 4 / 42 = **114 kPa**, still below 150 kPa.
2. The limit equals 150 kPa when G = 0.150 × 42 / 4 = 1.575 MPa, so E = 4.73 MPa, which Gent's relation reaches at about **66.5 Shore A**.
3. With G = 0.82 MPa, the wall must satisfy G × t / r = 0.150 with r = 44 − t / 2, giving **t ≈ 7.4 mm** and a mean radius of about 40.3 mm.

Both changes would make the sleeve much stiffer to inflate, so it would need more pressure to reach the pipe wall and would leave less of the 150 kPa as contact pressure. A thicker wall also reduces the sleeve's ability to stretch into an oversize or out-of-round pipe. The real lesson is that a harder or thicker sleeve moves the limit without removing it: some higher pressure will always have no equilibrium in free air. Safe design of inflatable rubber parts relies on restraint, reinforcement and procedure, as Chapter 5 discusses, not on making the rubber stiff enough to be inflated anywhere.
