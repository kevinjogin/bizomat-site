---
book: metal-fatigue-by-the-numbers
chapterSlug: surfaces-scatter-and-proof
order: 10
title: "Surfaces, scatter and proof"
description: "How surface finish is specified and inspected at fatigue-critical points, how Weibull analysis reads a fleet's failures, and how tests and field checks prove a design's life."
draft: false
---

A fatigue calculation ends with a safety factor. A fatigue-safe machine needs three more things: the critical surfaces must be made as the calculation assumed, the scatter in real lives must be understood, and the design must be proved on test and watched in service. This chapter covers all three for the PK-20, and it closes the loop on the PK-16, whose field failures turn out to be a textbook example of how fatigue lives scatter.

## Surface finish at the critical fillet

Chapter 3's surface factor depends on the process: ground, machined, hot-rolled or forged. Within a process, the roughness still varies, and a turned or ground fillet with deep marks behaves worse than the factor assumes. The PK-20 drawing therefore gives the shoulder fillet both a process, ground, and a roughness limit, Ra 0.8 µm.

### What turning leaves

Before grinding, the fillet and seat are turned. A turning tool with a nose radius r and a feed f per revolution leaves a pattern of scallops, and their geometry sets a theoretical roughness.

```figure
type: formula
title: Theoretical roughness of a turned surface
formula: Rt ≈ f² ÷ (8 r),    Ra ≈ 0.0316 f² ÷ r
caption: Rt is the peak-to-valley height and Ra the arithmetic mean roughness, for feed f and nose radius r in mm (results in mm; multiply by 1,000 for µm). The real surface is usually rougher, because of tool wear, built-up edge and vibration.
- f | feed per revolution, mm
- r | tool nose radius, mm
```

The [turning feed for surface finish](/tools/feed-for-finish/) tool returns the theoretical Ra and Rt from the feed and nose radius, or the feed for a target Ra, and warns when the feed is large relative to the nose radius. For the PK-20's pre-grind turning with a 0.8 mm nose radius at 0.12 mm per revolution, it gives Ra 0.568 µm and Rt 2.25 µm: a good turned finish, which grinding then improves. At the 0.2 mm feed that the PK-16 shafts had been turned with, the theoretical Ra was 1.578 µm, nearly three times rougher, with the fillet left as turned.

```figure
type: bars
title: Theoretical Ra for the camshaft turning, by feed and nose radius
unit: µm
caption: This is an illustration. Feed for finish tool. Halving the feed quarters the roughness; a larger nose radius helps in proportion. The real surface will be somewhat rougher.
- 0.2 mm/rev, 0.8 mm radius (PK-16, left as turned) | 1.578
- * 0.12 mm/rev, 0.8 mm radius (PK-20 pre-grind) | 0.568
- 0.1 mm/rev, 0.8 mm radius | 0.394
- 0.1 mm/rev, 1.2 mm radius | 0.263
```

### What the drawing must say

A roughness symbol on its own leaves too much to chance at a fatigue-critical point. The PK-20 drawing note for the follower-side fillet gives five things: the process (ground), the parameter and limit (Ra 0.8 µm, upper limit, default 16% rule), the direction of the lay, the radius (2 mm minimum, critical), and the inspection (magnetic particle, no indications). Each was added because something went wrong without it, on this machine or an earlier one. Ra alone does not describe the deepest scratch, which is what starts a crack; where that matters, a peak parameter such as Rz, or the max rule, can be specified as well.

### Accepting a measured surface

Roughness varies from place to place, so a drawing limit is assessed against several measurements by rules set out in ISO 4288 for the profile method. The [surface roughness acceptance](/tools/surface-roughness-acceptance/) tool applies the comparison rules as it describes them. Under the default 16% rule, no more than 16% of the measured values may exceed the upper limit; more than 16% may still be accepted if the values are normally distributed and the mean plus one standard deviation lies within the limit. Under the max rule, for a parameter marked max on the drawing, no value may exceed the limit anywhere. The tool also reminds the user that each value is measured over an evaluation length of five sampling lengths.

```figure
type: steps
title: First-article roughness of a PK-20 ground fillet, in the surface roughness acceptance tool
caption: This is an illustration. Upper limit Ra 0.8 µm, 16% rule, 12 values measured across the lay, 2 above the limit, largest 0.86 µm, mean 0.66 µm, standard deviation 0.09 µm, sampling length 0.8 mm.
- Share above the limit | 2 of 12 = 16.7%, more than 16%
- Mean plus one standard deviation | 0.66 + 0.09 = 0.75 µm, within 0.8 µm
- * Result | SURFACE ACCEPTED, but only through the normal-distribution provision: verify
- Evaluation length | 5 × 0.8 = 4.0 mm per value
```

The acceptance on the second test was a warning, not a pass to file away. The grinding engineer redressed the wheel's fillet radius more often, and later batches had no values above the limit.

### The error: measuring along the lay

The first set of fillet measurements, taken by a new inspector, showed every value below Ra 0.3 µm: a remarkably fine ground surface. The quality engineer doubted it, because a fillet ground with that wheel would not normally be so smooth.

The inspector had run the stylus around the fillet's circumference, along the grinding marks, because the fillet's curved profile made an axial trace awkward. A stylus run along the lay follows the bottom of one scratch and misses the peaks and valleys across it, so it reads far smoother than the surface is. Roughness for acceptance is measured across the lay, at right angles to the machining marks, which for a cylindrically ground fillet means along the shaft's axis, following the fillet's profile.

The re-measurement across the lay gave the values above, two of them over the limit. The inspection instruction now shows a sketch of the stylus direction for each critical surface, and the fixture holds the shaft so the stylus can follow the fillet axially.

### Grinding can also do harm

A ground fillet is only better than a turned one if the grinding is done well. Grinding generates intense heat in a thin surface layer. If the wheel is dull, the feed too heavy or the coolant poor, that layer can be tempered soft or even rehardened into brittle martensite, and it is often left in tensile residual stress. Such grinding burn can be invisible to the eye and halve the fatigue strength of the surface it was meant to improve. Grinding cracks, fine networks of shallow cracks from the same cause, are worse still.

The PK-20's grinding instruction sets the wheel dressing interval, the stock removal per pass and the coolant flow, and every first-article shaft is checked for burn by a nital etch on a sample and for cracks by magnetic particle inspection of the fillet. Production shafts are checked by magnetic particle inspection at a sampling rate agreed with the machine shop. A process that can damage the critical surface needs a check that can see the damage.

## Scatter: what the PK-16 failures say

Fatigue lives scatter widely, and a fleet's failure record shows how. Of the 36 PK-16 machines, 11 cracked their camshafts in the first 4,000 running hours, and more followed in the second year. Fitting the failure times to a Weibull distribution, the usual model for fatigue and wear-out lives, gave a shape parameter β = 3.0 and a characteristic life η = 5,600 running hours. This is an illustration.

The [Weibull reliability and B10 life](/tools/weibull-reliability/) tool takes the shape and scale and a mission time and returns the reliability, the probability of failure, the hazard rate, the B10 life (the time by which 10% have failed) and the mean time to failure, and it says whether the pattern is early-life, random or wear-out.

```figure
type: compare
title: The PK-16 camshafts in the Weibull reliability tool
cols: Value | Meaning
rowhead: Result
- Reliability at 4,000 h | 69.5% | 30.5% fail in the first year: 11.0 of 36 expected, 11 seen
- * B10 life | 2,645 h | about 8 months of two-shift running
- Mean time to failure | 5,001 h | about 15 months
- Hazard rate at 4,000 h | 0.00027 per hour | and rising
- Failure pattern | wear-out, β > 1 | time-based replacement would reduce failures
caption: This is an illustration. β = 3.0, η = 5,600 h. The mean life, about 15 months, agrees with the elementary Miner estimate of about 13 months in Chapter 6.
```

```figure
type: line
title: Share of PK-16 camshafts surviving against running hours
x: Running hours
y: Surviving, %
ymin: 0
ymax: 100
mark: 4000 | one year: 69.5%
caption: This is an illustration. Weibull β = 3.0, η = 5,600 h. A shape parameter of 3 means failures are rare at first and then come quickly, the classic pattern of fatigue.
- 0 | 100
- 1000 | 99.4
- 2000 | 95.6
- 2645 | 90.0
- 4000 | 69.5
- 5001 | 49.1
- 6000 | 29.2
- 8000 | 5.4
```

Two lessons come from that analysis. First, the mean life and the B10 life are far apart: a design that "lasts 15 months on average" loses one machine in ten within 8 months. Design for fatigue must be about the weak tail, which is what the reliability factor and the safety factor are for. Second, β = 3 shows wear-out: the failure rate rises with time. For the PK-16 fleet, the builder replaced every camshaft with the PK-20 design at the next service, prioritising machines over 2,000 hours, by which time about 4.5% of shafts would be expected to have cracked.

### Why lives scatter so much

The spread in the PK-16 lives is no sign of poor manufacture. Chapter 1 explained that a fatigue crack starts in the worst-placed surface grain, at the deepest scratch, or at the largest inclusion near the surface. Every shaft has a slightly different worst point, and life is very sensitive to the local stress there: on the PK-16 steel's S-N line, a 10% difference in effective stress changes life by a factor of 1.75. Loads differ between customers too. Put together, lives that differ by a factor of three to ten between nominally identical parts are normal, and the safety factors and reliability factors in the earlier chapters exist to cover that spread.

### How the Weibull fit was made

The fit used the failure times of the 11 cracked shafts and the running hours of the 25 that had not yet cracked. Those 25 are not failures, but they are evidence: each shows that a shaft survived at least that long. Leaving them out would make the fit far too pessimistic; treating them as failures at their current hours would bias it the other way. Reliability software handles such suspended items properly, by ranking the failures among all the units, failed and unfailed, before fitting. The builder's reliability engineer used that method, plotted the result on Weibull axes, where a two-parameter Weibull distribution appears as a straight line, and read β as the line's slope and η as the hours at which 63.2% would have failed.

With only 11 failures, β and η carry real uncertainty: a shape between about 2 and 4.5 would also fit the data reasonably. Every conclusion the builder drew, that the pattern is wear-out and that early replacement would cut failures, holds anywhere in that range. A conclusion that depended on the exact value of β would need more data.

## Proving the PK-20

Calculations rank designs and find weak points; a test proves that nothing was missed. Testing a 10-year, 96-million-cycle life in real time is impossible, so the builder's plan combines three kinds of evidence.

### A rig test at raised load

A rotating bending rig spins the camshaft at 1,500 revolutions a minute with a dead load hung on the follower end. Ten million cycles take 111 hours. Three production-standard PK-20 shafts, ground fillets and spacer rings included, were run to 10 million cycles each at 1.3 times the design moment. At that load the local alternating stress is about 212 MPa, 71% of the corrected endurance limit. All three ran out without cracks, confirmed by magnetic particle inspection of the fillets afterwards.

A run-out at a raised load shows margin. It does not demonstrate a reliability figure: three survivors are not enough for that. A test that demonstrates 90% reliability at 90% confidence with no failures, run to the target life, needs 22 units. With a Weibull shape assumed known, testing longer than the target life reduces the count: at twice the target life, with β = 3, about 3 units suffice. Such plans depend heavily on the assumed β, and the builder used them only as a guide.

```figure
type: compare
title: Units needed for a zero-failure demonstration of 90% reliability at 90% confidence
cols: Units needed | Notes
rowhead: Test length as a multiple of the target life
- 1 | 21.9, so 22 | no shape assumption needed
- 1.5, β = 3 assumed | 6.5, so 7 | relies on β
- * 2, β = 3 assumed | 2.7, so 3 | relies on β; the PK-20 rig plan in shape
caption: This is an illustration. n = ln(1 − C) ÷ [k^β × ln R], with C = 0.9, R = 0.9 and k the test-length multiple. The rig test ran at raised load rather than for longer, so the table is a guide to the plan's strength, not its result.
```

The rig test also leaves things out by design. It loads the shaft in pure rotating bending, without the cam's torque or the follower's real load pattern, and it runs in a clean, dry rig rather than a packing hall. It cannot show fretting under the cam hub, corrosion from wash-down, or a customer who runs a carton the machine was not designed for. Those gaps are why the field watch exists.

### Field watch

The first ten PK-20 machines delivered were inspected at 2,000 and 4,000 running hours: the camshaft fillet with dye penetrant through an inspection port, the spring visually, and the housing bolts with the ultrasonic gauge. Nothing was found. The inspections stopped after 4,000 hours, the point by which almost a third of PK-16 shafts had cracked.

## Closing the file

```figure
type: checklist
title: PK-20 fatigue release checklist
caption: This is an illustration. Every item has an owner and a record in the design file.
- x Loads measured on a prototype, cycles counted and mixed-load damage added (Chapters 2 and 6)
- x Every notch checked with named Kt sources; critical radii marked on drawings (Chapters 4 and 7)
- x Goodman and yield checks at every critical point, factors recorded (Chapters 3 to 9)
- x Fillet ground, roughness specified and measured across the lay
- x Bolt preload set by calibrated torque and audited ultrasonically (Chapter 8)
- x Springs re-checked for the deeper-carton cam; peening specified (Chapter 9)
- x Rig test at 1.3 times load to 10 million cycles, three run-outs
- x Field inspections at 2,000 and 4,000 h on the first ten machines
- x PK-16 fleet retrofit with PK-20 shafts
```

Under the model WHS laws, the builder's duty as a designer and manufacturer of plant includes giving users the information they need to use the machine safely, and Safe Work Australia's Code of Practice on managing the risks of plant explains what that covers. The PK-20 manual states the design life of the camshaft, spring and bolts in running hours, the inspection points, and the rule that any change to the cam, the spring or the product range beyond the specification must be referred back to the builder. A fatigue design is only as good as the conditions it was made for, and the manual is where those conditions are written down.

## Exercise: a different fleet

A different machine's drive shafts fail with a Weibull shape β = 1.0 and characteristic life η = 20,000 hours. What is the reliability at 4,000 hours, and would replacing shafts every 4,000 hours reduce failures? What would you suspect about the cause, compared with the PK-16?

**Worked answer.** The reliability is exp(−(4,000 ÷ 20,000)^1.0) = exp(−0.2) = 0.819: 18.1% fail within 4,000 hours. With β = 1 the failure rate is constant, 1 ÷ 20,000 per hour whatever the shaft's age, so a new shaft is no more reliable than an old one, and replacing at 4,000 hours would not reduce failures; it would only waste shafts.

A constant failure rate points away from fatigue under a steady load, which produces wear-out with β well above 1, as on the PK-16. It suggests failures caused by random events: overloads from jams or misuse, installation faults, or external damage. The investigation should look at what happens to the machine, not at how long the shafts have run.
