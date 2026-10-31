---
book: stress-transformation-by-the-numbers
chapterSlug: three-dimensional-stress
order: 6
title: "Three-dimensional stress"
description: "How to find the three principal stresses of a general stress state from its invariants, how three Mohr's circles show the true maximum shear, and when ignoring a direction misleads."
draft: false
---

Chapters 2 to 5 worked on surfaces, where one direction carries no stress and three components describe the state. Inside a part, at a surface under pressure, or wherever a finite element model reports results, all six components can be present. The principal stresses still exist, but there are three of them, and the largest shear may act on a plane that a two-dimensional sketch never shows.

This chapter finds the three principal stresses at the RH-40 spindle's bore, where the flushing water presses on the surface, and at a point from a finite element model of the gear seat. It draws the three Mohr's circles that show the whole state, and it shows a case where leaving out the third direction halves the maximum shear.

## Six components, three principal stresses

At any point, there are three mutually perpendicular planes on which the shear is zero. The normal stresses on them are the principal stresses, sorted as σ1 ≥ σ2 ≥ σ3. Like the two-dimensional case, they are the roots of an equation whose coefficients are the invariants of the stress state, quantities that do not change when the axes turn.

```figure
type: formula
title: Principal stresses of a three-dimensional stress state
formula: σ³ − I1 σ² + I2 σ − I3 = 0
formula: I1 = σx + σy + σz
formula: I2 = σxσy + σyσz + σzσx − τxy² − τyz² − τzx²
formula: I3 = σxσyσz + 2τxyτyzτzx − σxτyz² − σyτzx² − σzτxy²
caption: The three roots of the cubic are the principal stresses. A cubic with real coefficients from a symmetric stress state always has three real roots, which can be found in closed form with trigonometry, as the WORKOS tools do.
- I1 | the sum of the normal stresses: three times the mean stress
- I2 | the second invariant, the three-dimensional form of σxσy − τxy²
- I3 | the determinant of the stress matrix
```

Two derived quantities matter most in design. The largest shear stress at the point is (σ1 − σ3) ÷ 2, half the difference between the largest and smallest principal stresses. The von Mises equivalent stress is √{½[(σ1 − σ2)² + (σ2 − σ3)² + (σ3 − σ1)²]}, which depends only on the differences between the principal stresses. Adding the same pressure to all three, a hydrostatic stress, changes neither of them, which is why metals do not yield under hydrostatic pressure alone however high it goes.

## Three Mohr's circles

In three dimensions, Mohr's construction gives three circles, one for each pair of principal stresses. The largest circle, from σ3 to σ1, encloses the other two, and every possible combination of normal and shear stress on any plane through the point lies inside the large circle and outside the two small ones. The top of the large circle is the largest shear at the point, (σ1 − σ3) ÷ 2.

The three circles make the plane stress shortcut easy to judge. On a free surface, one principal stress is zero. If the other two have opposite signs, the zero sits between them, the largest circle is the in-plane circle, and Chapter 3's radius is the right maximum shear. If they have the same sign, the zero is σ3 or σ1, and the largest circle runs from zero to the larger in-plane stress. Its radius is bigger than the in-plane circle's.

## The spindle bore

At the bore of the RH-40 spindle, in pullback, the water presses on the surface at 7 MPa, so the radial stress is −7.00 MPa. From Chapter 5's Lamé equations, the hoop stress at the bore is 31.89 MPa and the axial pressure stress 12.44 MPa, to which the pullback adds 52.40 MPa, giving 64.84 MPa axially. The torque gives a shear of 61.53 MPa at the bore radius. Bending is left out here, because at the bore it is smaller than at the outside and the outside already governs; the point of this example is the third direction. This is an illustration.

With x along the axis, y around the hoop and z radial, the state is σx = 64.84 MPa, σy = 31.89 MPa, σz = −7.00 MPa, τxy = 61.53 MPa and τyz = τzx = 0.

The [three-dimensional principal stress tool](/tools/principal-stress-3d/) takes all six components and the yield strength, forms the invariants, solves the cubic and returns the principal stresses, the maximum shear, the von Mises stress and the safety factor.

```figure
type: steps
title: The RH-40 spindle bore in the three-dimensional principal stress tool
caption: This is an illustration. σx = 64.84, σy = 31.89, σz = −7.00, τxy = 61.53 MPa, τyz = τzx = 0, yield strength 650 MPa.
- Invariants I1, I2, I3 | 89.73 MPa, −2,395.3 MPa², 12,027 MPa³
- Principal stresses | 112.06, −7.00 and −15.33 MPa
- Maximum shear | 63.70 MPa
- * von Mises stress and safety factor | 123.44 MPa; 5.27
```

Because the radial direction carries no shear, −7.00 MPa is itself a principal stress, and the other two come from the in-plane circle of the axial and hoop stresses. Here the radial stress falls between them, so it is σ2, and the largest shear is still the in-plane radius, 63.70 MPa. Leaving out the water pressure on the surface would give a von Mises stress of 120.46 MPa instead of 123.44 MPa: 2.4% low. The bore is less critical than the outer surface, where Chapter 4 found 168.63 MPa.

```figure
type: svg
title: The three Mohr's circles for the spindle bore
alt: A horizontal sigma axis with a vertical tau axis at zero. A large circle spans from minus 15.33 to 112.06 megapascals with its centre at 48.36. Inside it, near the left end, a small circle spans from minus 15.33 to minus 7, and a medium circle spans from minus 7 to 112.06. The top of the large circle is marked tau max equals 63.70.
caption: This is an illustration. The large circle, from σ3 = −15.33 to σ1 = 112.06 MPa, has radius 63.70 MPa. The other two have radii 59.53 MPa (σ1 to σ2) and 4.17 MPa (σ2 to σ3). Every plane through the point has a stress pair inside the large circle and outside the two smaller ones.
viewbox: 0 0 640 360
body:
<path class="ln" d="M30 190H610M100 20V360"/>
<circle class="bx" cx="216" cy="190" r="153"/>
<circle class="la" cx="226" cy="190" r="143"/>
<circle class="la" cx="73" cy="190" r="10"/>
<circle class="fa" cx="369" cy="190" r="5"/>
<circle class="fa" cx="83" cy="190" r="5"/>
<circle class="fa" cx="63" cy="190" r="5"/>
<path class="ln dsh" d="M216 190V37"/>
<text class="txb" x="380" y="212">σ1 = 112.06</text>
<text class="tx txs" x="90" y="222">σ2 = −7.00</text>
<text class="tx txs" x="10" y="170">σ3 = −15.33</text>
<text class="txb" x="224" y="30">τmax = 63.70</text>
<text class="tx txs" x="106" y="34">τ</text>
<text class="tx txs" x="600" y="182">σ</text>
```

## A general state from a finite element model

The second example has all six components. A finite element model of the RH-40 spindle reported, at a node on the fillet between the gear seat and the shoulder, σx = 182.0 MPa, σy = 41.5 MPa, σz = 18.2 MPa, τxy = 88.4 MPa, τyz = 6.1 MPa and τzx = −12.7 MPa, in the model's global axes. This is an illustration: the numbers stand in for a real model's output.

The [triaxial stress check tool](/tools/triaxial-stress-check/) solves the same cubic and adds the yield factors by von Mises and by Tresca, the shear and bulk moduli from E and Poisson's ratio, and the principal strains and volume change by Hooke's law, against a required factor.

```figure
type: steps
title: The gear seat fillet node in the triaxial stress check tool
caption: This is an illustration. E = 205 GPa, ν = 0.29, yield strength 650 MPa, required factor 2.0.
- Principal stresses | 225.04, 22.87 and −6.20 MPa
- Maximum shear | 115.62 MPa
- * von Mises and Tresca safety factors | 218.17 MPa: 2.98; Tresca 2.81: WITHIN YIELD MARGIN
- Principal strains | 1,074.2, −198.0 and −381.0 microstrain
- Volume change | 495.2 microstrain
- Shear and bulk moduli | 79.46 GPa and 162.70 GPa
```

The fillet's von Mises stress, 218.17 MPa, is 29% above the smooth section's 168.63 MPa, which is the stress concentration of the fillet at work. That is the figure the fatigue check needs. The principal directions are not aligned with the model's axes: the large shear τxy has turned the largest principal stress about 26° away from the spindle's axis, much as at the smooth section.

### Checking a model's output by hand

A model's principal stress plot can be checked at a node by entering its six components into a tool like this one. If the tool's principal stresses do not match the plot, the most likely causes are a mismatch of axes (the plot in a local frame, the components in a global one), shear components reported as engineering strain values or in a different order, or a plot averaged across elements while the components came from one element. Comparing invariants is the quickest way to find out: I1 must match whatever the frame.

### Where a model's principal stresses come from

Finite element programs usually compute stresses at integration points inside each element and then extrapolate and average them to the nodes for plotting. The six components at a node can therefore differ between adjacent elements, and principal stresses computed from averaged components are not the same as averages of each element's principal stresses. At a fillet, where stresses change quickly, those differences can reach several per cent. For a hand check, take the components from one element at a time and compare like with like.

## The mistake: the missing third circle

A check of the RH-40 chuck cylinder for a customer used a maximum shear criterion with an allowable shear stress of 40 MPa, taken from the customer's standard for welded attachments. The designer took the outside surface of the cylinder, where the hoop stress is 64.31 MPa and the axial stress 32.16 MPa, drew Mohr's circle through those two values and found a largest shear of (64.31 − 32.16) ÷ 2 = 16.08 MPa. Comfortably inside 40 MPa.

The outside surface also has a third principal stress: zero, the radial stress at a free surface. Both in-plane stresses are tensile, so zero is σ3, and the largest circle runs from 0 to 64.31 MPa. The true maximum shear is 32.16 MPa, exactly twice the in-plane value, on planes at 45° to the surface. It was still inside 40 MPa, but with a margin of 1.24 rather than 2.5, and the attachment welds on that surface carry their own stress concentrations.

```figure
type: compare
title: Maximum shear at two points on the chuck cylinder
cols: σ1, MPa | σ2, MPa | σ3, MPa | In-plane shear only, MPa | True maximum shear, MPa
rowhead: Point
- * Outside surface | 64.31 | 32.16 | 0 | 16.08 | 32.16
- Bore | 85.31 | 32.16 | −21.00 | 26.58 | 53.16
caption: This is an illustration. 21 MPa, 140 mm bore, 20 mm wall, closed ends. At the outside, the free surface's zero stress is σ3; at the bore, the pressure on the surface is σ3. In both cases the in-plane circle between the hoop and axial stresses is not the largest one.
```

The tools in this book's earlier chapters avoid the trap: the principal stress tool's Tresca equivalent includes the zero principal stress, and the three-dimensional tools include every component. The trap lies in hand sketches and in spreadsheets built for two dimensions. The habit that prevents it is to write all three principal stresses, including any zero, before taking a maximum shear.

## Below a contact: where the third direction decides

The clearest case of a stress state that two dimensions cannot describe sits under every loaded contact in a machine: a gear tooth on a gear tooth, a roller on its race, a cam on its follower. The RH-40's drive gear meshes with a pinion on each rotation motor, and the teeth press on each other along a narrow band.

At the surface, in the middle of that band, the contact pressure compresses the material in all three directions: straight down from the load, and sideways because the surrounding material resists being squeezed out. All three principal stresses are compressive and not very different from each other, so the shear at the surface is modest. Below the surface the vertical compression falls off more slowly than the sideways ones, the difference between the largest and smallest principal stresses grows, and the maximum shear reaches a peak some distance down. For two cylinders in line contact, the classical elastic solution puts that peak at about 0.3 times the maximum contact pressure, at a depth of about 0.78 times the half-width of the contact band.

That buried peak explains why contact fatigue cracks, the pits and spalls on gear teeth and bearing races, often start beneath the surface, and why case-hardened gears need a hardened case deep enough to cover it. None of it is visible to a plane stress analysis of the surface, which sees only a state of near-equal compression and concludes that nothing much is happening. Contact stress checks for gears and bearings use their own standards and methods; the point for this chapter is that they are three-dimensional by nature.

## Octahedral shear: von Mises as a shear stress

The von Mises equivalent stress can look like an arbitrary formula. It has a physical meaning that the three-dimensional picture makes clear. The eight planes equally inclined to the three principal directions, the faces of an octahedron, carry a shear stress called the octahedral shear stress, τoct. It equals √2 ÷ 3 times the von Mises stress. Yield by von Mises is therefore yield when the octahedral shear reaches a critical value, which is a natural measure of the average shear that the many randomly oriented grains in a metal experience.

For the RH-40 spindle bore, τoct = 0.471 × 123.44 = 58.19 MPa, a little below the maximum shear of 63.70 MPa. For the gear seat fillet node, it is 102.85 MPa against a maximum shear of 115.62 MPa. The octahedral shear always lies between about 82% and 94% of the maximum shear: 94% when two principal stresses are equal, 82% when the middle one sits exactly halfway between the others. Scaled to equivalent stresses, that is why the von Mises and Tresca criteria never differ by more than about 15%, and why they agree exactly in uniaxial tension, where two principal stresses are both zero.

## Hydrostatic stress and deviatoric stress

Any stress state can be split into two parts. The hydrostatic part is the mean stress, I1 ÷ 3, applied equally in every direction. The deviatoric part is what is left, and it has a mean of zero. Yield of metals depends on the deviatoric part, because slip is driven by shear, while the hydrostatic part changes volume and, in tension, helps voids grow and cracks open.

For the spindle bore, the mean stress is 89.73 ÷ 3 = 29.91 MPa, and the deviatoric principal stresses are 82.15, −36.91 and −45.24 MPa. For the gear seat fillet node, the mean stress is 80.57 MPa, a substantial hydrostatic tension. Fracture mechanics and ductile failure models use this split; for yield checks it is enough to know that the von Mises stress depends on the deviatoric part only.

```figure
type: checklist
title: Handling a three-dimensional stress state
caption: The RH-40 analyst's routine for model results. This is an illustration.
- x All six components taken from the same element or node, in the same frame
- x Invariants compared with the software's principal stresses
- x All three principal stresses written down, including any zero at a free surface
- x Maximum shear taken as (σ1 − σ3) ÷ 2
- x Equivalent stress and safety factor by the criterion the design rules require
- ? Mean stress noted where fracture or fatigue under tension is the concern
```

## Exercise: the chuck cylinder bore

At the bore of the RH-40 chuck cylinder at 21 MPa, the hoop stress is 85.31 MPa, the axial stress 32.16 MPa and the radial stress −21.00 MPa, with no shear on those planes. Find the three principal stresses, the maximum shear, the von Mises stress and the Tresca and von Mises safety factors against 460 MPa. What is the mean stress?

**Worked answer.** With no shear on the axial, hoop and radial planes, those stresses are the principal stresses: σ1 = 85.31 MPa (hoop), σ2 = 32.16 MPa (axial) and σ3 = −21.00 MPa (radial). The maximum shear is (85.31 + 21.00) ÷ 2 = 53.16 MPa.

The von Mises stress is √{½[(85.31 − 32.16)² + (32.16 + 21.00)² + (−21.00 − 85.31)²]} = 92.07 MPa, matching the pressure cylinder tool in Chapter 5, so the von Mises factor is 460 ÷ 92.07 = 5.00. The Tresca equivalent is σ1 − σ3 = 106.31 MPa and its factor 460 ÷ 106.31 = 4.33. The mean stress is (85.31 + 32.16 − 21.00) ÷ 3 = 32.16 MPa, equal to the axial stress, a feature of every closed thick cylinder under internal pressure. This is an illustration.
