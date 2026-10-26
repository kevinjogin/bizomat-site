---
book: rubber-parts-by-the-numbers
chapterSlug: stretching-in-two-directions
order: 4
title: "Stretching in two directions"
description: "Calculate stress and thinning in rubber membranes stretched in two directions, follow the test plug's sleeve into a pipe, and catch a thickness rule borrowed from balloons that rejected a good use."
draft: false
---

Most stretched rubber parts are membranes: sleeves, bladders, diaphragms, gloves, balloons. A membrane is stretched in two directions at once, in its own plane, and gets thinner in the third. How much it thins, and what stress it carries, depends on the two in-plane stretches together, not on either alone. A sleeve whose ends are held carries a different stress, and thins differently, from a balloon stretched by the same amount around its circumference.

This chapter extends the neo-Hookean model of Chapter 3 to membranes, works out TP-100's sleeve inside a 100 mm pipe and inside an older 110 mm one, and shows how an engineer who borrowed the balloon's thinning rule for the sleeve nearly ruled out a perfectly good use.

## Three ways to stretch a membrane

A membrane has two in-plane stretches, λ₁ and λ₂. Constant volume fixes the third, the thickness stretch, at 1 / (λ₁ λ₂). Three special cases cover most rubber parts:

- **Uniaxial**, a strip pulled one way and free to narrow: λ₂ = 1 / √λ₁, and the thickness also falls by √λ₁.
- **Plane strain**, a membrane stretched one way while held from changing in the other: λ₂ = 1, so all the thinning goes into thickness, which falls by λ₁. A long sleeve with its ends held, stretched around its circumference, is in plane strain.
- **Equibiaxial**, stretched equally both ways: λ₁ = λ₂ = λ, and the thickness falls by λ². The pole of a balloon and the centre of an inflated diaphragm are equibiaxial.

For neo-Hookean rubber, the true stresses in the membrane's plane are:

```figure
type: formula
title: True membrane stresses in neo-Hookean rubber
formula: σ₁ = G (λ₁² − 1 / (λ₁ λ₂)²)     σ₂ = G (λ₂² − 1 / (λ₁ λ₂)²)
caption: The through-thickness stress is taken as zero, which is the usual membrane assumption. Membrane force per unit length is the true stress times the current thickness, t = T / (λ₁ λ₂).
- λ₁, λ₂ | In-plane stretches
- G | Shear modulus, 0.82 MPa for TP-100
- T, t | Original and current thickness, mm
```

The same stretch gives very different stress and thickness in the three cases. At λ₁ = 1.5, TP-100's compound carries a true stress of 1.30 MPa in uniaxial tension, 1.48 MPa in plane strain and 1.68 MPa in equibiaxial stretch, and its thickness falls to 82%, 67% and 44% of the original.

```figure
type: compare
title: TP-100's compound at a stretch of 1.5 in three membrane states
cols: Other in-plane stretch | Thickness, fraction of original | True stress in the stretched direction
caption: This is an illustration with G = 0.82 MPa. The thinning, and with it the force a membrane can carry per unit length, depends strongly on what the other direction is doing.
- Uniaxial, free to narrow | 0.82 | 0.82 | 1.30 MPa
- Plane strain, held in the other direction | 1.00 | 0.67 | 1.48 MPa
- *Equibiaxial, stretched both ways | 1.50 | 0.44 | 1.68 MPa
```

## The running case: the sleeve in a 100 mm pipe

This is an illustration. TP-100's sleeve has a mean radius of 42 mm and a 4 mm wall before inflation. Its ends are clamped 120 mm apart, so along most of its length it can only stretch around its circumference: it is in plane strain, with an axial stretch of 1.

Inflated, the sleeve grows until its outer surface meets the 100 mm bore. Its outer radius is then 50 mm, and since its thickness is t = 4 × 42 / r at mean radius r, the mean radius satisfies r + 2 × 42 / r = 50. Solving gives r = **48.26 mm**, a hoop stretch of λ = 48.26 / 42 = **1.149**, and a wall thickness of 4 / 1.149 = **3.48 mm**.

The membrane stresses follow from the formula with λ₁ = 1.149 and λ₂ = 1:

- hoop stress σθ = 0.82 × (1.149² − 1 / 1.149²) = **0.461 MPa**;
- axial stress σz = 0.82 × (1 − 1 / 1.149²) = **0.199 MPa**.

The axial stress is not zero, because the end clamps prevent the sleeve from shortening as it would like to. Around the sleeve's circumference, that axial stress acting on a 3.48 mm wall pulls on each end clamp with 0.199 × 3.48 × 2π × 48.26 = **210 N**. The clamps must hold that in addition to everything else, which is why TP-100's end plates grip the sleeve in a groove rather than relying on friction alone.

The hoop stress sets the pressure the sleeve itself absorbs. A thin sleeve of radius r and wall t, carrying hoop stress σθ, balances a pressure of σθ t / r = 0.461 × 3.48 / 48.26 = 0.0332 MPa, or **33 kPa**. Of the 150 kPa supplied, 33 kPa goes into stretching the sleeve and the remaining 117 kPa presses the sleeve against the pipe. Chapter 6 turns that into grip.

### The ends of the sleeve

Near each end plate, the sleeve cannot reach the pipe wall, because it is clamped at its original radius. Over a short length it curves outwards from the clamp to the wall, with a varying stretch and a bending stiffness that the membrane model ignores. This is an illustration. The manufacturer measured the contact patch on a sleeve inflated inside a clear acrylic test pipe and found that the sleeve touched the wall over about 100 mm of its 120 mm length, losing about 10 mm at each end. Chapter 6 uses 100 mm as the contact length.

### Pressure, tension and curvature

The step from hoop stress to pressure used above is one case of a general rule for membranes. A curved membrane carrying tension pushes on whatever is inside its curve, and the pressure it can balance is its membrane force per unit length divided by its radius of curvature, added over the two directions: p = N₁ / R₁ + N₂ / R₂, where N is stress times thickness. A cylinder is curved only around its circumference, so p = Nθ / r. A sphere is curved equally both ways, so p = 2N / r, and a spherical balloon balances twice the pressure of a cylinder of the same radius and membrane force.

The rule explains a familiar puzzle: a long party balloon inflates first as a bulge at one end, not evenly along its length. A cylinder needs less pressure than a sphere for the same wall tension, and a rubber cylinder's wall tension stops rising usefully beyond moderate stretch, as Chapter 5 shows. Once one part of the tube has grown a little more than the rest, it holds the pressure with less effort than its neighbours, so it keeps growing while they wait. The same logic, applied to a test plug inflated in the open, is the subject of the next chapter.

### Out-of-round and rough pipes

Real pipes are not perfect cylinders. An old pipe may be oval by a few millimetres, and a joint between two pipes may leave a small step. A sleeve inflating into an oval bore stretches more where the bore is wider and less where it is narrower, so its wall is thinner and its contact pressure lower at the wide points. For TP-100, an oval bore of 98 by 102 mm stretches the sleeve between about 1.12 and 1.17 around its circumference, a range comfortably inside what it handles in round pipes of 100 and 110 mm. A step at a joint is more serious, because the sleeve bridges the step with an unsupported fold and may not seal or grip across it. The manufacturer's instructions say to position the plug clear of joints by at least its own length.

## A larger pipe

Older clay and cast-iron drains in some buildings have bores larger than their nominal size. This is an illustration. A plumber asked whether TP-100 could be used in a pipe with a 110 mm bore. With an outer radius of 55 mm, the same calculation gives a mean radius of 53.43 mm, a hoop stretch of **1.272** and a wall thickness of **3.14 mm**. The hoop stress rises to 0.819 MPa, and the pressure the sleeve absorbs to **48 kPa**, leaving 102 kPa of contact pressure at 150 kPa inflation. The sleeve still seals and grips, with less margin; Chapter 6 checks the holding force.

The manufacturer turned the two calculations into a bore range on the plug itself. This is an illustration. TP-100 is marked "BORE 98 TO 112 MM", the range over which the sleeve stretches between about 1.12 and 1.30 around its circumference and its wall stays above the 3.0 mm service minimum. Below the range, the sleeve would barely stretch and the plug would be hard to insert; above it, the wall would thin past the minimum and the contact pressure would fall further. A range printed on the part is more useful on site than a calculation in a file, because the person choosing the plug is usually standing at the open end of a pipe with a tape measure, not at a desk.

```figure
type: compare
title: TP-100's sleeve in two bores at 150 kPa
cols: Hoop stretch | Wall thickness | Pressure absorbed by the sleeve | Contact pressure
caption: This is an illustration. Plane strain, neo-Hookean, G = 0.82 MPa, 4 mm wall at 42 mm mean radius. The larger bore stretches the sleeve further, thins it more and leaves less pressure for contact.
- *100 mm bore | 1.149 | 3.48 mm | 33 kPa | 117 kPa
- 110 mm bore | 1.272 | 3.14 mm | 48 kPa | 102 kPa
```

## The error: a balloon's thinning rule applied to a sleeve

This is an illustration. When the plumber's question about the 110 mm pipe reached the manufacturer, an engineer answered it quickly using the thinning rule from a balloon calculation he had seen: thickness falls with the square of the stretch. At a stretch of 1.272, that gives 4 / 1.272² = 2.47 mm. The manufacturer's own specification sets a minimum wall of 3.0 mm in service, to keep a margin against cuts and wear, so the engineer advised that TP-100 must not be used in 110 mm pipes.

A colleague questioned the answer because it implied that the sleeve would also thin to 3.03 mm in the standard 100 mm pipe, close to the limit, which did not match the manufacturer's test results. The sleeve's ends are clamped 120 mm apart, so the sleeve cannot get shorter or longer; it stretches only around its circumference. That is plane strain, and the thickness falls by the stretch, not its square: 4 / 1.272 = **3.14 mm** in the 110 mm pipe. A balloon thins with the square of its stretch because it is stretched equally in both directions; a sleeve with held ends is not.

The colleague checked the reasoning on a sleeve inflated inside a 110 mm test pipe, marking two rings around the sleeve 80 mm apart before inflation and measuring them after: the axial distance was unchanged within half a millimetre, confirming that the sleeve had not stretched along its length. The advice to the plumber was corrected: TP-100 may be used in 110 mm bores, with a wall of about 3.1 mm, above the 3.0 mm limit, and with the reduced holding force that Chapter 6 calculates.

The lesson is that a membrane's thinning depends on what both in-plane directions are doing, and that the first question in any membrane calculation is which directions are free and which are held. Borrowing a formula from a different shape of part, even one made of the same rubber, borrows its assumptions too.

## Instability in two directions

Membranes have one more surprise that strips do not. A square sheet pulled by equal forces on all four edges, a so-called equal dead load, stretches equally in both directions at first. Beyond a certain stretch, the equal state can become less stable than an unequal one, and the sheet may stretch more one way than the other even though the forces are equal. The effect was observed by Treloar in experiments on rubber sheets and is analysed in the thermodynamics text listed in the references as an example of a system choosing between equilibrium states.

Real parts rarely face perfectly equal dead loads, but the principle carries over to inflated parts: when the loading allows a part to choose its shape, it will not necessarily choose the symmetric one. A sleeve inflated in free air does not stay a neat cylinder; it develops a local bulge, as Chapter 5 shows, because a bulged shape is more stable under the given pressure than a uniformly expanded one. Inside a pipe, the wall removes that choice: it fixes the radius the sleeve can reach, and the sleeve has no freedom to bulge. Restraint, more than the rubber itself, is what makes TP-100 well behaved in use, and that is the thread that runs through the next two chapters.

## Exercise: a diaphragm

A flat circular diaphragm of TP-100's compound, 2 mm thick, is clamped at its edge and inflated into a dome. At its centre the rubber is stretched equally in both directions by 1.25.

1. What is its thickness at the centre, and its true membrane stress?
2. What membrane force per millimetre does it carry there, and how does that compare with a sleeve in plane strain at the same stretch?

**Worked answer.**

1. Equibiaxial, so the thickness falls by λ²: 2 / 1.25² = **1.28 mm**. True stress σ = 0.82 × (1.25² − 1 / 1.25⁴) = 0.82 × (1.5625 − 0.4096) = **0.944 MPa**.
2. Membrane force is stress times thickness: 0.944 × 1.28 = **1.21 N/mm**. In plane strain at the same stretch, the thickness would be 2 / 1.25 = 1.60 mm and the stress 0.82 × (1.5625 − 0.64) = 0.755 MPa, giving 1.21 N/mm as well. The two membranes carry the same force per unit length at this stretch, but the diaphragm does it with a thinner, more highly stressed wall, which is where it will first tear or show ozone cracks.
