---
book: metal-fatigue-by-the-numbers
chapterSlug: notches
order: 4
title: "Notches: where cracks start"
description: "How fillets, holes, keyways and grooves raise local stress, why the fatigue notch factor is smaller than the theoretical one, and how a fillet radius decides a shaft's life."
draft: false
---

Every fatigue crack in the PK-16 camshafts started at the same place: the root of the small fillet where the bearing seat steps up to the shaft body. That is no coincidence. Wherever the shape of a part changes, at a shoulder, a hole, a keyway, a groove or a thread, the stress rises locally above the nominal value that beam formulas give. Fatigue cracks start at the highest local stress, so the notch, not the section, usually decides the life.

This chapter explains how much a notch raises the stress, why fatigue feels less of that rise than a static calculation would suggest, and how to choose a fillet. It then follows a fillet that was drawn right and made wrong on the PK-20 prototype.

## The stress concentration factor

When a load flows through a part, the stress follows the material like water through a channel. At a sudden step the lines of stress crowd together around the corner, and the stress at the corner's surface rises. The ratio of that peak stress to the nominal stress is the theoretical, or elastic, stress concentration factor.

```figure
type: formula
title: Theoretical stress concentration factor
formula: Kt = σmax, local ÷ σnominal
caption: Kt depends only on the geometry and the type of load (bending, axial or torsion), not on the material. It is found from charts, such as those in Peterson's Stress Concentration Factors, from elastic finite element analysis, or from measurements.
- σmax, local | the largest elastic stress at the notch root
- σnominal | the stress the plain section formula gives at the same section, usually on the smaller section
```

Three examples show the range. A small round hole in a wide plate under tension has Kt = 3: the stress beside the hole is three times the stress far away, whatever the hole's size. A shoulder on a shaft in bending, with a step of 20% in diameter, has a Kt of about 1.5 with a generous fillet and 2.5 to 3 with a sharp one. A thread root or a retaining ring groove can exceed 3.

### Fillet radius

For a shoulder, the fillet radius r matters most, as a fraction of the smaller diameter d. The step D ÷ d matters less once it exceeds about 1.1. The PK-20's bearing seat is 30 mm and its body 36 mm, so D ÷ d = 1.2. The designer read the following factors for bending from a chart for that step. These are the designer's readings. This is an illustration.

```figure
type: bars
title: Theoretical stress concentration factor in bending, shoulder with D ÷ d = 1.2, d = 30 mm
unit: Kt
caption: This is an illustration. Chart readings for the PK-20's proportions. Doubling the radius from 0.5 to 1 mm removes about a third of the rise above 1; doubling again to 2 mm removes about a third again.
- 0.25 mm | 3.0
- 0.5 mm | 2.6
- 1 mm | 2.1
- * 2 mm | 1.7
- 3 mm | 1.55
```

## Notch sensitivity and the fatigue notch factor

If fatigue responded to the peak elastic stress, a part with Kt = 2.6 would have its fatigue strength cut by 2.6 times. Tests show that it usually loses less. The effective factor in fatigue, Kf, is smaller than Kt, and by more for sharp notches and soft steels.

The reason lies in the scale of the damage. A fatigue crack starts by slip in a few surface grains (Chapter 1). At a very sharp notch the peak stress falls away steeply below the surface, so only a tiny volume of material, smaller than a grain or two, actually feels the peak. The material responds to something closer to the average stress over a small characteristic depth. Softer steels, with larger grains and more ductile behaviour, have a larger characteristic depth and so are less sensitive to sharp notches; very strong steels have a small one and feel almost the full Kt.

```figure
type: formula
title: Peterson's notch sensitivity and the fatigue notch factor
formula: q = 1 ÷ (1 + a ÷ r)      Kf = 1 + q (Kt − 1)
formula: for steel: a ≈ 0.0254 × (2,070 ÷ Su)^1.8 mm, with Su in MPa
caption: q runs from 0 (no notch effect) to 1 (the full Kt). The material constant a is a characteristic length; the estimate for steel shown is the one used in the BIZOMAT tools. For aluminium and other alloys, use a value from data for the material.
- a | Peterson's material constant, mm
- r | notch root radius, mm
- q | notch sensitivity
- Kf | fatigue notch factor, applied to the nominal alternating stress
```

For the PK-20's steel, Su = 900 MPa, so a = 0.0254 × (2,070 ÷ 900)^1.8 = 0.114 mm. A 1 mm fillet gives q = 1 ÷ (1 + 0.114) = 0.898, and with Kt = 2.1, Kf = 1 + 0.898 × 1.1 = 1.988.

```figure
type: compare
title: Notch sensitivity for four steels at two fillet radii
cols: Material constant a, mm | q at r = 0.5 mm | q at r = 1 mm
rowhead: Tensile strength
- 400 MPa | 0.490 | 0.505 | 0.671
- 620 MPa (the PK-20 lever) | 0.223 | 0.692 | 0.818
- * 900 MPa (the PK-20 camshaft) | 0.114 | 0.815 | 0.898
- 1,400 MPa | 0.051 | 0.907 | 0.951
caption: Peterson's relation with the steel estimate for a. Strong steels lose most of the benefit of notch insensitivity: at 1,400 MPa, even a 0.5 mm notch acts with 91% of its theoretical factor.
```

That table carries a design lesson. Choosing a stronger steel raises the endurance limit, but it also raises q, so a notched part gains less than the tensile strengths suggest. Combined with the lower surface factor of strong steels (Chapter 3), it means that a strong steel with a sharp notch and a rough surface can be no better in fatigue than a mild one.

### The fatigue notch factor tool

The [fatigue notch factor](/tools/fatigue-notch-factor/) tool returns the material constant a, the notch sensitivity q, the fatigue notch factor Kf and the ratio Kf ÷ Kt, from Kt, the notch radius and either the tensile strength (for the steel estimate of a) or an entered value of a. It does not find Kt: that must come from a chart or an analysis for the right geometry and the right type of load, and the tool says so.

## Finding Kt honestly

The fatigue notch factor can be no better than the Kt it starts from, and Kt is where the largest errors in notch calculations hide. There are three ways to find it, and each has a trap.

**Charts.** Peterson's book collects charts for hundreds of geometries: shoulders, grooves, holes, keyways, threads and more, each for bending, axial load and torsion separately. The trap is reading the wrong chart. A shoulder in bending, in tension and in torsion has three different factors; for the PK-20's 1 mm fillet the torsion factor is noticeably lower than the bending one. A chart for a groove is not a chart for a shoulder, and a chart for a plate is not a chart for a shaft. The builder's rule is to write the chart's title, the load type and the two ratios read from it beside every Kt.

**Finite element analysis.** An elastic model gives the peak stress directly, and Kt is that peak divided by the nominal stress from the formula. The trap is the mesh. A fillet modelled with a few large elements reports too low a peak; a sharp corner with no radius reports a peak that keeps rising as the mesh is refined, because the true elastic stress at a zero radius is infinite. The analyst must model the real radius and refine the mesh at it until the peak stops changing by more than a few per cent.

**Measurement.** A strain gauge small enough to fit at a fillet root reads the local strain on a prototype, and the ratio to a gauge on the plain section gives Kt directly. Gauges average over their length, so a gauge longer than about a third of the radius reads low. The PK-20 prototype's shoulder gauge was 1 mm long on a 2 mm fillet, and it agreed with the chart reading of 1.7 to within 5%.

```figure
type: compare
title: Three ways to find Kt for the PK-20 shoulder
cols: What it needs | Main trap | Used on the PK-20
rowhead: Method
- Chart | the geometry's two ratios and the load type | the wrong chart or load type | yes, for every radius considered
- Elastic finite element model | a model with the real radius, refined | a coarse mesh reads low; a zero radius never converges | yes, for the spacer ring detail
- Strain gauge on a prototype | a gauge much shorter than the radius | long gauges average the peak away | yes, to confirm the 2 mm fillet
caption: This is an illustration. Two methods that agree are much more convincing than one used carefully.
```

### Local yielding at the notch

A notch also changes how the mean stress should be treated. When the peak local stress, Kf times the nominal maximum, exceeds the yield strength, the notch root yields on the first cycle. After that it unloads elastically, and the yielding leaves a compressive residual stress that lowers the local mean stress. A ductile part with a high mean stress at a notch can therefore be better off than a calculation that multiplies the mean by Kf suggests.

The BIZOMAT tools take the simpler, conservative route: they apply Kf to both the alternating and the mean stress. For the PK-20's parts the peak local stress is well below yield, so the question does not arise, but for a highly preloaded part with a sharp notch it can, and texts such as Shigley's describe how to reduce the mean stress factor in that case. What must never be reduced is the factor on the alternating stress: yielding does not shrink the cycle.

## The PK-20 shoulder, radius by radius

With the nominal fully reversed bending stress of 98.1 MPa from Chapter 2 and the corrected endurance limit of 250.5 MPa from Chapter 3, each fillet radius gives a different local alternating stress and so a different safety factor.

```figure
type: compare
title: The camshaft shoulder with five fillet radii
cols: Kt | q | Kf | Alternating stress at the fillet, MPa | Safety factor, Se ÷ σa
rowhead: Fillet radius
- 0.25 mm | 3.0 | 0.687 | 2.375 | 232.9 | 1.08
- 0.5 mm (the PK-16) | 2.6 | 0.815 | 2.303 | 225.9 | 1.11
- 1 mm | 2.1 | 0.898 | 1.988 | 195.0 | 1.28
- * 2 mm | 1.7 | 0.946 | 1.662 | 163.1 | 1.54
- 3 mm | 1.55 | 0.963 | 1.530 | 150.1 | 1.67
caption: This is an illustration. Fatigue notch factor tool with Su = 900 MPa, then Se = 250.5 MPa and nominal σa = 98.1 MPa with zero mean. Bending only; Chapter 7 adds the torque. The 2 mm fillet is the smallest that meets the builder's 1.5.
```

Two features of the table are worth noticing. First, the sharpest fillet gains a little from notch insensitivity: at 0.25 mm, Kf is only 79% of Kt. That is no reason to use sharp fillets; it only means the penalty is somewhat less than Kt suggests, and q for very small radii is the least reliable part of the method. Second, the step from 0.5 to 2 mm cuts the local stress by 28% and raises the safety factor from 1.11 to 1.54, with no change in diameter, material or cost.

## Notches elsewhere in the PK-20

The rocker lever's critical section is where the arm meets the hub, and the designer gave it a 4 mm fillet with a chart reading of Kt = 1.8. For the lever's 620 MPa steel, a = 0.223 mm, q = 1 ÷ (1 + 0.223 ÷ 4) = 0.947 and Kf = 1 + 0.947 × 0.8 = 1.758. Chapter 5 uses it.

The cam is keyed to the shaft. A keyway raises the stress in both bending and torsion, and end-milled keyways, with their sharp ends, are worse than sled-runner keyways, which run out gradually. The PK-20 cam sits where the bending moment is small, and Chapter 7 checks it. The housing bolts have threads, which are notches of their own; bolt endurance strengths in Chapter 8 already include the thread's notch effect, so it must not be applied again.

```figure
type: decision
title: Reducing the effect of a notch
question: Can the notch be moved, removed or made gentler?
- Enlarge the radius | the cheapest fix; limited by what has to fit against the shoulder
- Move the notch to a lower-stress place | a step where the bending moment is small does little harm
- Add relief | a relief groove or undercut fillet lets a larger radius sit behind a mating part
- Strengthen the surface at the notch | rolling or peening the fillet adds compressive residual stress (Chapter 3)
- Accept a larger section | lowers the nominal stress; costs weight and may move other notches
caption: The builder works down this list in order. The first two are free at the drawing stage and expensive afterwards.
```

## The error: the fillet that was made sharp

The PK-20 prototype drawing specified a 2 mm fillet at the follower-side shoulder. The first shafts came back from the machine shop and went to the assembly bench, where the bearings would not seat: the inner ring stood off the shoulder by about a millimetre. The fitter found that the bearing's inner ring had a corner chamfer of only about 1 mm, which could not clear a 2 mm fillet. To get the prototype running, the fitter had the machine shop re-turn the fillet with a sharp tool to clear the chamfer.

That re-cut fillet measured 0.4 mm with a radius gauge. On the table above, a 0.4 mm fillet would put the shaft back below the PK-16's 1.11 safety factor. The prototype had been given, without anyone deciding to, exactly the weakness the redesign was meant to remove.

It was found at the first-article inspection, which the builder had made compulsory for cycling parts after the PK-16. The inspector checked every radius on the drawing with radius gauges and found the 0.4 mm fillet, and the change note that should have accompanied it did not exist.

The correction was a design change, not a machining one. The shaft kept its 2 mm fillet, and a hardened spacer ring with a 2.5 mm internal chamfer was added between the shoulder and the bearing. The ring sits on the seat, clears the fillet, and gives the bearing a square face to locate against. Where a spacer does not fit, an undercut fillet, cut partly into the shoulder face, does a similar job.

```figure
type: svg
title: Spacer ring between the fillet and the bearing
alt: A side view of a shaft shoulder in section. A smaller diameter seat on the left steps up to a larger body on the right with a generous fillet at the corner. A rectangular spacer ring with a chamfer on its inner corner sits on the seat against the shoulder, its chamfer clearing the fillet. To its left a bearing inner ring with a small corner chamfer sits against the spacer's flat face. Labels mark the 2 mm fillet, the spacer's 2.5 mm chamfer, and the bearing's small chamfer.
caption: This is an illustration. The spacer's chamfer clears the 2 mm fillet, and its square face locates the bearing. The fillet stays generous where the bending stress is highest.
viewbox: 0 0 640 300
body:
<path class="bx" d="M40 200H360Q380 200 380 180V120H600"/>
<path class="ln" d="M40 250H600"/>
<path class="bxa" d="M300 200H360Q372 200 372 188V140H300Z"/>
<path class="bxi" d="M190 200H300V130H190Z"/>
<path class="la" d="M380 180Q380 200 360 200"/>
<text class="txb" x="400" y="215">2 mm fillet</text>
<path class="ln" d="M398 210L375 195"/>
<text class="tx txs" x="300" y="110">spacer ring</text>
<text class="tx txs" x="300" y="95">2.5 mm chamfer clears the fillet</text>
<text class="tx txs" x="160" y="115">bearing inner ring</text>
<text class="tx txs" x="60" y="230">30 mm seat</text>
<text class="tx txs" x="460" y="110">36 mm body</text>
<text class="tx txs" x="60" y="275">shaft axis</text>
```

The builder added two rules to its drawing standard. Every fatigue-critical radius carries a note naming it as critical and giving its minimum. And any change to such a radius, for any reason, needs the design engineer's signature.

The episode also changed how the builder inspects fillets. A radius gauge shows whether a fillet is roughly right, but it cannot show a small step or tool mark at the point where the fillet blends into the seat, and such a mark is itself a notch. The first-article inspection now includes a replica or profile trace of each critical fillet, and the turning program uses a tool whose nose radius matches the fillet, so that the fillet is cut in one smooth pass rather than blended by hand. Chapter 10 returns to how the surface of that fillet is specified and checked.

## Exercise: a hole in the lever

A later PK-20 option adds a 10 mm cross-hole through the rocker lever's arm, at a section where the nominal bending stress range is 8 to 64 MPa. The designer reads Kt = 2.2 for the hole in bending. The lever steel has Su = 620 MPa. Using the hole's radius as the notch radius, find q, Kf and the local alternating and mean stresses at the hole's edge.

**Worked answer.** The notch radius is 5 mm. The material constant is a = 0.0254 × (2,070 ÷ 620)^1.8 = 0.2225 mm. Then q = 1 ÷ (1 + 0.2225 ÷ 5) = 0.957 and Kf = 1 + 0.957 × 1.2 = 2.149.

The nominal alternating stress is (64 − 8) ÷ 2 = 28 MPa and the nominal mean is (64 + 8) ÷ 2 = 36 MPa. Applying Kf to both, as the fatigue design check tool does, gives a local alternating stress of 2.149 × 28 = 60.2 MPa and a local mean of 2.149 × 36 = 77.4 MPa. The large radius makes q close to 1: a hole is not a sharp notch, and almost its full Kt applies. Chapter 5 shows how to judge whether that combination is safe.
