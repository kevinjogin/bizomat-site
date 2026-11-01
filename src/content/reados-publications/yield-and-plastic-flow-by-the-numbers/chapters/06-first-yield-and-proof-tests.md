---
book: yield-and-plastic-flow-by-the-numbers
chapterSlug: first-yield-and-proof-tests
order: 6
title: "First yield, collapse and proof tests"
description: "How a thick tube goes from first yield at its bore to plastic collapse, what a proof test proves, and how to judge a barrel after a test bench overpressure."
draft: false
---

Chapter 5 found the HC-63 barrel's safety factor against yield at its bore. Yield at the bore is not failure: a ductile tube can carry much more pressure after its inner layer yields, because the outer layers are still elastic and hold it. Between first yield and bursting lies a range of behaviour that matters for proof tests, for overloads, and for deliberately strengthening a tube by yielding it.

This chapter follows the barrel from first yield to plastic collapse, explains what the 31.5 MPa proof test does and does not prove, and works through a day when the test bench's relief valve stuck and the barrel saw 100 MPa.

## The proof test

Every HC-63 is pressure tested at 31.5 MPa, 1.5 times its working pressure, before it leaves the factory. The test is hydrostatic: the cylinder is filled with oil and pressurised by an intensifier, and held for a set time while the technician looks for leaks and the gauge for any fall in pressure. It proves the seals, the welds and the threads at a pressure above any the cylinder should see in service, and it shows up gross faults in the barrel. It is not meant to yield anything.

### The pressurised tube under torsion tool

The [pressurised tube under torsion check](/tools/pressure-tube-torsion-check/) tool takes a thin-walled tube's outside diameter and wall thickness, the internal pressure, an end thrust and a torque. It finds the hoop and axial stresses from the pressure with closed ends, adds the axial load and the shear from the torque in the thin wall, and returns the principal stresses, their direction, the maximum shear and the von Mises stress with a safety factor against yield. It flags walls thicker than a tenth of the diameter, for which the thick-wall equations of Chapter 5 should be used.

The test bench procedure forbids tightening a weeping gland while the cylinder is pressurised, because a failure then would release the oil and the gland together. Before that rule was written, a technician had done exactly that with an 800 N·m spanner. The builder used the tool to see what the barrel had carried. This is an illustration.

```figure
type: compare
title: The HC-63 barrel at proof pressure, with and without a gland torque, in the pressurised tube under torsion tool
cols: Proof pressure only | Proof pressure and 800 N·m
rowhead: Result
- Hoop and axial stress, MPa | 168.4 and 84.2 | 168.4 and 84.2
- Shear stress from torque, MPa | 0 | 16.2
- Principal stresses, MPa | 168.4 and 84.2 | 171.4 and 81.2
- Principal angle from the axis | 90° | 79.5°
- * von Mises stress and safety factor | 145.8 MPa, 3.57 | 148.5 MPa, 3.50
caption: This is an illustration. 76 mm outside diameter, 6.5 mm wall (mean diameter 69.5 mm), 31.5 MPa, closed ends, yield 520 MPa. The wall is just inside the tool's thin-wall limit. TUBE ADEQUATE. The torque changes the stresses very little; the reason for the rule is stored energy, not stress.
```

The thin-wall result, 145.8 MPa without torque, is lower than the 174.4 MPa that Lamé's equations gave at the bore in Chapter 5. The thin-wall formula uses the mean diameter and ignores the radial stress, so it describes the average state of the wall, not its worst point. For a wall this thick, the thick-wall figure is the one to quote for first yield; the thin-wall tool remains useful for the effect of torque and end loads, which the Lamé equations do not include.

### Why 1.5 times, and how it is checked

The proof pressure is set by the product standard or the customer's specification, not by the yield calculation. The HC-63's customer specifies 1.5 times the rated pressure, a common choice for fluid power components. The test pressure must be high enough to reveal faults and low enough to leave the part unharmed, and the yield calculation is what confirms the second condition: at 31.5 MPa the barrel's bore is at a third of its first-yield pressure, and its ports at about four-fifths of yield.

The builder confirms the absence of permanent set on one cylinder in fifty. The bore is measured at three positions along its length with a bore gauge before the test and again afterwards, and the two sets must agree within the gauge's repeatability. A growth that persists after the pressure is released means something has yielded, and the cylinder is set aside for investigation, whatever the leak test showed.

## From first yield to collapse

As the pressure in a thick tube rises past the elastic range, plastic flow starts at the bore, where the stresses are highest. The yielded zone then spreads outward as a ring. The tube does not fail until the whole wall has yielded, at the collapse pressure; for a ductile steel that work hardens, it can carry still more before it bursts.

For a tube of an elastic, perfectly plastic material with closed ends, the classic results, given in Hill's text among others, are:

```figure
type: formula
title: First-yield and collapse pressures of a closed-ended thick tube
formula: first yield, von Mises: pY = (Sy ÷ √3) × (1 − ri² ÷ ro²)
formula: collapse, von Mises: pC = (2 ÷ √3) × Sy × ln(ro ÷ ri)
caption: Tresca gives the same forms with Sy ÷ 2 in place of Sy ÷ √3, and Sy in place of 2Sy ÷ √3. Real steels work harden, so they burst above pC; an estimate using the tensile strength in place of Sy gives a rough upper figure.
- ri, ro | inner and outer radii
- Sy | yield strength
- pY | pressure at which the bore first yields
- pC | pressure at which the whole wall has yielded
```

For the HC-63 barrel, with Sy = 520 MPa and radii of 31.5 and 38 mm:

```figure
type: bars
title: Pressures for the HC-63 barrel
unit: MPa
caption: This is an illustration. Elastic, perfectly plastic estimates with Sy = 520 MPa; the burst estimate uses a tensile strength of 640 MPa in the collapse formula. The proof test is a third of the first-yield pressure.
- Working | 21
- * Proof test | 31.5
- First yield at the bore, Tresca | 81.3
- First yield at the bore, von Mises | 93.9
- Collapse, von Mises | 112.6
- Rough burst estimate | 138.6
```

The first-yield pressure by von Mises, 93.9 MPa, is 2.98 times the proof pressure: the same safety factor that the triaxial stress tool gave at the bore at proof pressure, as it must be, because the stresses rise in proportion to the pressure. The collapse pressure, 112.6 MPa, is 20% higher again. That reserve between first yield and collapse is the plastic reserve of a thick tube. For a thin tube it shrinks towards nothing, because the stress is almost uniform through the wall and the whole wall yields at once.

### How much reserve a wall has

The plastic reserve depends only on the ratio of the outer to the inner radius. A thin wall has almost none; a very thick wall has a great deal.

```figure
type: compare
title: First-yield and collapse pressures for tubes of the barrel's steel, by wall ratio
cols: First yield, MPa | Collapse, MPa | Collapse ÷ first yield
rowhead: Outer ÷ inner radius
- 1.05, a thin tube | 27.9 | 29.3 | 1.05
- 1.10 | 52.1 | 57.2 | 1.10
- * 1.206, the HC-63 barrel | 93.9 | 112.6 | 1.20
- 1.5 | 166.8 | 243.5 | 1.46
- 2.0, a very thick tube | 225.2 | 416.2 | 1.85
caption: This is an illustration. von Mises, Sy = 520 MPa, closed ends. The ratio of collapse to first yield is close to the radius ratio itself for walls up to about 1.2.
```

That pattern explains a rule of thumb in pressure design. For thin walls, the first-yield and collapse pressures are nearly the same, so it hardly matters which a design uses. For thick walls, codes that allow some plasticity can save a great deal of metal compared with an elastic design, which is one reason high-pressure equipment is often designed by limit-load methods with an appropriate margin, and why autofrettage pays off in very thick-walled tubes.

### The plastic zone

Between first yield and collapse, the wall has an inner plastic ring and an outer elastic one. For a given pressure, the radius c of the boundary satisfies p = (Sy ÷ √3) × [1 − c² ÷ ro² + 2 ln(c ÷ ri)], from the same analysis. At 100 MPa, c = 32.63 mm: the inner 17% of the wall has yielded.

```figure
type: line
title: Radius of the plastic zone in the HC-63 barrel as pressure rises
x: Pressure, MPa
y: Radius of the elastic-plastic boundary, mm
ymin: 31
ymax: 39
mark: 100 | the stuck relief valve: 32.63 mm
caption: This is an illustration. von Mises, elastic, perfectly plastic, Sy = 520 MPa. The plastic zone starts at the bore at 93.9 MPa and reaches the outside at 112.6 MPa.
- 93.9 | 31.5
- 96 | 31.86
- 100 | 32.63
- 104 | 33.54
- 108 | 34.71
- 112.6 | 38
```

### What yielding leaves behind

When the pressure is released, the outer elastic ring tries to return to its original size, and the yielded inner ring, now permanently a little larger, stops it. The result is a residual stress: the bore is left in hoop compression and the outer layers in tension. This is the principle of autofrettage, used deliberately on gun barrels, fuel injection lines and high-pressure tubing: the residual compression at the bore lowers the hoop stress there in service and greatly improves fatigue life. The Bauschinger effect of Chapter 3 limits how much residual compression can be used, because the bore, having yielded in tension, yields in compression sooner than the certificate suggests.

Autofrettage is a controlled process, with a specified pressure, a known plastic zone and a check of the result. An accidental overpressure is the same physics without the control.

### Beyond collapse: bursting

The collapse pressure assumes the steel stops hardening at its yield strength. Real steel keeps hardening, so a tube pressurised past collapse continues to swell while the pressure still rises, until its wall thins enough that, like a tensile bar at its maximum load, further swelling needs less pressure, not more. That is the burst condition, and it occurs at a pressure set by the tensile strength and the work-hardening exponent, not the yield strength. Using the tensile strength in place of the yield strength in the collapse formula gives a rough estimate of 138.6 MPa for the HC-63 barrel, more than six times its working pressure.

Two things erode that figure in practice. A brittle zone, such as a weld with poor toughness or a seam in the tube, can fracture long before the wall has swelled, and a sharp defect makes the tube fail at the defect rather than by general yielding. That is why burst tests are made on sample barrels with their welds and ports, not on plain tube, and why the barrel's toughness and freedom from defects matter as much as its strength. The builder burst-tests one barrel from each new tube supplier; each one so far has swelled visibly and split along its length, the ductile pattern that the calculation assumes.

## The error: the stuck relief valve

One afternoon the test bench's intensifier kept pumping after it reached 31.5 MPa. Its relief valve, set to 35 MPa as a backstop, had stuck closed. The technician saw the gauge pass 60 MPa and pressed the stop; the bench's recording transducer showed a peak of 100 MPa before the pressure fell. The cylinder did not leak or burst, and the technician's first thought was that it had passed a far harder test than required. This is an illustration.

The test engineer quarantined the cylinder and worked through the numbers. A peak of 100 MPa is above the barrel's first-yield pressure of 93.9 MPa and below its collapse pressure of 112.6 MPa: the inner 17% of the wall had yielded and the barrel would now carry residual stress, and its bore would be slightly enlarged. The ports were worse. With a stress concentration of about 2.5 at the cross-bores (Chapter 5), their edges had seen an elastic hoop stress of about 1,350 MPa, far beyond yield; they had certainly yielded, and they are the places fatigue cracks start.

```figure
type: decision
title: A barrel after an overpressure: what the numbers say
question: What was the peak pressure against the barrel's first-yield and collapse pressures?
- Below first yield at the bore, and below yield at the ports | elastic: check seals and threads; the barrel is unaffected
- * Above first yield, below collapse | partial yield: residual stress, enlarged bore, yielded ports; quarantine, measure and inspect
- Above collapse | gross yielding: the barrel is scrap
- Peak not known reliably | treat as the worst credible value
caption: This is an illustration of the builder's procedure. The HC-63's peak of 100 MPa falls in the second group. The decision also depends on how well the peak is known and on what the part will do in service.
```

The bore was measured: at mid-length it was 0.03 mm over its original size, still inside its tolerance. Magnetic particle inspection found no cracks at the ports. But the barrel's service was to be millions of pressure cycles on mining equipment, its ports had yielded by an unknown amount, and its residual stresses were unknown. The builder scrapped it, at a cost of about A$650 including GST for the barrel and the labour of rebuilding. This is an illustration.

The more important result was the bench. The investigation found that the relief valve had no test record and that the intensifier relied on it alone. The bench now has two independent limits, a pressure switch that cuts the intensifier at 33 MPa and a relief valve at 35 MPa tested monthly, and the test enclosure door is interlocked. The technician's first thought, that the cylinder had passed a harder test, was the most dangerous part of the episode: a proof test that yields the part proves only that the part has been damaged.

The episode is now part of the builder's training for new test technicians. They are shown the transducer trace, the calculation of the plastic zone and the scrapped barrel, and asked to explain why it was scrapped although it passed every visual and dimensional check.

## Hydrostatic testing and safety

A hydrostatic test is far safer than a pneumatic one at the same pressure, because a liquid stores little energy: it is barely compressible. A gas at the same pressure stores hundreds of times more, which is why pneumatic proof tests of pressure equipment need special justification and precautions. A hydrostatic test still has hazards: a jet of oil from a failing seal or fitting at 30 MPa can penetrate skin, and a cylinder can move suddenly if a mounting fails. Under the model WHS laws, the builder must manage those risks, and Safe Work Australia's Code of Practice on managing the risks of plant applies to the test bench as to any other plant. The HC-63 bench's enclosure, interlocks, independent pressure limits and the ban on working on pressurised components follow from that duty.

## What the proof test proves

```figure
type: checklist
title: What the HC-63's 31.5 MPa proof test does and does not show
caption: This is an illustration. The test is one check among several.
- x Seals, threads and welds hold at 1.5 times working pressure
- x No gross defect in the barrel, such as a seam or a wrong wall
- x No measurable permanent set at that pressure, when the bore is checked afterwards on sample units
- ? Fatigue life under millions of pressure cycles: needs design and testing separately
- ? Behaviour at the highest pressure the hydraulic system can generate if its relief fails: needs a system check
- ? Material properties: come from the certificates and the builder's tests
```

## Exercise: a thinner barrel

A lighter version of the HC-63 would use a 63 × 73 mm barrel, a 5 mm wall, in the same steel. Find its first-yield pressure and collapse pressure by von Mises, and its safety factor against first yield at the 31.5 MPa proof test. Check the bore's von Mises stress at proof pressure with Lamé's equations and compare.

**Worked answer.** With ri = 31.5 mm and ro = 36.5 mm, ri² ÷ ro² = 0.7448. The first-yield pressure is (520 ÷ √3) × (1 − 0.7448) = 76.6 MPa and the collapse pressure (2 ÷ √3) × 520 × ln(36.5 ÷ 31.5) = 88.5 MPa. The safety factor at proof is 76.6 ÷ 31.5 = 2.43.

At the bore at 31.5 MPa, Lamé gives a hoop stress of 31.5 × (36.5² + 31.5²) ÷ (36.5² − 31.5²) = 215.4 MPa, an axial stress of 91.9 MPa and a radial stress of −31.5 MPa. The von Mises stress is 213.8 MPa and 520 ÷ 213.8 = 2.43, the same factor. The thinner barrel still has a large margin against yield; its bore growth and seal gap (Chapter 5), and its fatigue life, would need checking before it could be adopted.
