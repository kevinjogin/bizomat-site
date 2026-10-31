---
book: stress-transformation-by-the-numbers
chapterSlug: turning-the-element
order: 2
title: "Turning the element"
description: "How the normal and shear stresses on a cut change as it turns, from the balance of a wedge: the transformation equations, the invariants that never change and checks that catch angle errors."
draft: false
---

Chapter 1 described the stress at a point on the RH-40 spindle with three numbers: 115.48 MPa along the axis, 31.50 MPa around the hoop and 76.91 MPa of shear. Those numbers belong to an element whose edges happen to line up with the spindle's axis. A crack does not care about that choice. It grows on whichever plane carries the most tension, and a weld, a cross-drilling or a strain gauge may sit at any angle. To use the stress at a point, you need the stresses on every plane through it.

This chapter derives the rule that gives them. It needs nothing more than the balance of forces on a small wedge and some trigonometry. The result, the transformation equations, is the foundation of Mohr's circle in Chapter 3, of the strain gauge rosettes in Chapter 8 and of every finite element stress plot.

## Balancing a wedge

Cut the element on a plane whose outward normal makes an angle θ with the x axis, measured anticlockwise. The cut leaves a triangular wedge with three faces: the inclined face, of area A; a face square to x, of area A cos θ; and a face square to y, of area A sin θ. The known stresses act on the two square faces; the unknown normal stress σθ and shear τθ act on the inclined face.

The wedge is in equilibrium, so the forces on it balance in every direction. Take the components along the inclined face's normal and along the face itself, and divide through by A. With a little use of the double-angle identities, that gives two equations.

```figure
type: formula
title: The transformation equations for plane stress
formula: σθ = (σx + σy) ÷ 2 + (σx − σy) ÷ 2 × cos 2θ + τxy × sin 2θ
formula: τθ = −(σx − σy) ÷ 2 × sin 2θ + τxy × cos 2θ
caption: θ is measured anticlockwise from the x axis to the normal of the plane. The stress on the perpendicular plane, σθ+90, follows by adding 90° to θ. The equations hold at a point for any material, elastic or not, because they come only from the balance of forces.
- σθ | normal stress on the plane at θ
- τθ | shear stress on that plane
- 2θ | the angle appears doubled: turning the plane by 180° returns the same stresses
```

Two features of these equations are worth noticing before any numbers go in. First, the angle appears as 2θ. A plane turned through 180° is the same plane, so the stresses must repeat every 180°, and the doubled angle makes them do so. Second, the equations contain no material properties. They follow from equilibrium alone, so they hold for steel, aluminium, timber or a plastically flowing metal, as long as the stresses describe a point that is in balance.

### A direct check by forces

The derivation can be checked numerically, which is a good habit with any formula used rarely. For the RH-40 element and θ = 30°, give the inclined face an area of 1 mm². The face square to x then has an area of cos 30° = 0.866 mm² and the face square to y an area of sin 30° = 0.5 mm². The force on the wedge from the x face is 115.48 × 0.866 = 100.01 N along x and 76.91 × 0.866 = 66.61 N along y; from the y face, 76.91 × 0.5 = 38.46 N along x and 31.50 × 0.5 = 15.75 N along y. The total is 138.46 N along x and 82.36 N along y.

Resolve that total along the inclined face's normal: 138.46 × 0.866 + 82.36 × 0.5 = 161.09 N, so σ30 = 161.09 MPa. Resolve it along the face: −138.46 × 0.5 + 82.36 × 0.866 = 2.09 N, so τ30 = 2.09 MPa. The transformation equations give the same numbers. This is an illustration.

## The spindle element at every angle

With the equations, the stresses on any plane through the RH-40 critical point can be listed. The table runs from 0° to 90°; from 90° to 180° the values repeat with σθ and σθ+90 swapped and the shear's sign reversed.

```figure
type: compare
title: Stresses on planes through the RH-40 critical point
cols: σθ, MPa | σθ+90, MPa | τθ, MPa | σθ + σθ+90, MPa
rowhead: Plane angle θ
- 0° | 115.48 | 31.50 | 76.91 | 146.98
- 15° | 148.31 | −1.33 | 45.61 | 146.98
- * 30° | 161.09 | −14.11 | 2.09 | 146.98
- 45° | 150.40 | −3.42 | −41.99 | 146.98
- 60° | 119.10 | 27.88 | −74.82 | 146.98
- 75° | 75.58 | 71.40 | −87.60 | 146.98
- 90° | 31.50 | 115.48 | −76.91 | 146.98
caption: This is an illustration. σx = 115.48 MPa, σy = 31.50 MPa, τxy = 76.91 MPa: the pullback case at the gear seat on the bending tension side (Chapter 1). The last column never changes.
```

Three things stand out. The normal stress peaks near 30°, at about 161 MPa, which is 40% more than the largest stress on the element's own faces. Near the same angle the shear passes through zero. And near 75° the shear peaks at almost 88 MPa, more than the 76.91 MPa that the torque alone produces on the cross-section.

```figure
type: line
title: Normal and shear stress on the plane at angle θ, RH-40 critical point
x: Plane angle θ, degrees
y: Stress, MPa
ymin: -100
ymax: 175
legend: Normal stress σθ | Shear stress τθ
mark: 30.68 | largest normal stress
caption: This is an illustration. Both curves repeat every 180°. The normal stress is largest where the shear is zero, and the shear is largest 45° away.
- 0 | 115.48 | 76.91
- 15 | 148.31 | 45.61
- 30 | 161.09 | 2.09
- 45 | 150.40 | -41.99
- 60 | 119.10 | -74.82
- 75 | 75.58 | -87.60
- 90 | 31.50 | -76.91
- 105 | -1.33 | -45.61
- 120 | -14.11 | -2.09
- 135 | -3.42 | 41.99
- 150 | 27.88 | 74.82
- 165 | 71.40 | 87.60
- 180 | 115.48 | 76.91
```

The pattern is general, not a feature of this element. Differentiate the normal stress equation with respect to θ and the result is −2 times the shear equation. So wherever the normal stress is at a maximum or minimum, the shear on that plane is zero. Those planes are the principal planes, and the stresses on them the principal stresses. Chapter 3 finds them exactly; the table already shows them to lie between 30° and 31°.

## What never changes

The last column of the table is the same on every row. Adding the two transformation equations for θ and θ + 90° shows why: the cosine and sine terms cancel and leave σθ + σθ+90 = σx + σy. The sum of the normal stresses on any two perpendicular planes is a fixed property of the point, 146.98 MPa for the RH-40 element, however the element turns.

A second combination is also fixed: σθ × σθ+90 − τθ². For the RH-40 element it is −2,277.5 MPa² at 0°, at 30° and at 60°. These two quantities are the invariants of plane stress. They are why the material can respond to the stress at a point without knowing which axes the engineer chose: anything that depends only on the invariants, such as the principal stresses, the maximum shear and the von Mises equivalent stress, is the same in every frame.

```figure
type: stats
title: The invariants of the RH-40 element
caption: This is an illustration. Both are the same for every orientation of the element; Chapter 3 builds the principal stresses from them, and Chapter 6 extends them to three dimensions.
- First invariant, σx + σy | 146.98 MPa
- Second invariant, σx σy − τxy² | −2,277.5 MPa²
- Mean normal stress, half the first | 73.49 MPa
```

The invariants are also the cheapest check on a transformation done by hand or in a spreadsheet. If σθ + σθ+90 differs from σx + σy, something is wrong.

## The other load cases

The RH-40 spindle does not live at one stress state. In each revolution, every point on the gear seat passes from the bending tension side to the compression side and back, and the rig switches between drilling and pullback many times a shift. Running the transformation for the four combinations of load case and fibre shows how much the worst plane moves.

```figure
type: compare
title: The plane of largest normal stress at the gear seat, four states
cols: σx, MPa | Largest normal stress, MPa | Its plane angle θ
rowhead: State
- * Pullback, bending tension side | 115.48 | 161.12 | 30.7°
- Pullback, bending compression side | 20.81 | 103.26 | 47.0°
- Drilling, bending tension side | 45.61 | 115.80 | 42.4°
- Drilling, bending compression side | −49.05 | 78.05 | 58.8°
caption: This is an illustration. σy = 31.50 MPa and τxy = 76.91 MPa in every state. The angles come from Chapter 3's formula and agree with a fine sweep of the transformation equations.
```

Two conclusions follow. For a static check, the pullback case on the tension side governs, with 161.12 MPa on a plane about 31° from the cross-section. For fatigue, the picture is less tidy. As the spindle turns under steady torque and pressure and rotating bending, the plane of largest tension at a point swings between about 31° and 47° during each revolution in pullback, and between about 42° and 59° while drilling. A crack has no single preferred plane to grow on.

Loading of this kind, where the principal directions turn during the cycle, is called non-proportional. It is harder on many steels than loading that cycles along a fixed direction, because more slip systems in more grains are worked. The usual fatigue methods based on an equivalent stress, such as those in [Metal Fatigue by the Numbers](/reados/publications/metal-fatigue-by-the-numbers/shafts/), handle the common case of rotating bending with steady torque well; where the torque itself fluctuates out of step with the bending, specialist multiaxial methods and tests are needed.

### Why the angle moves

The transformation equations show why. The angle of the principal plane depends on the ratio of the shear to the difference between the normal stresses, 2τxy ÷ (σx − σy). On the pullback tension side, σx − σy is large and the angle is small: the axial tension dominates and the principal plane sits close to the cross-section. On the drilling compression side, σx − σy is negative and the shear dominates, so the angle passes 45° and the principal plane leans towards the spindle's axis. When σx = σy, the angle is exactly 45° whatever the shear, which is the state of pure torsion with equal normal stresses on top.

## The mistake: degrees in a spreadsheet

The RH-40 designer built a small spreadsheet to tabulate the transformation, with the angle in degrees in one column and the formula =(B+C)/2+(B-C)/2*COS(2*A)+D*SIN(2*A) in the next. At 30° it returned 10.06 MPa for the normal stress and −60.45 MPa for the shear. The values looked strange but not absurd, and the same formula filled the whole column.

Spreadsheet trigonometric functions expect radians. COS(60) is the cosine of 60 radians, not 60°. The sum check did not catch it, because the error enters σθ and σθ+90 in a way that still adds up to σx + σy. What did catch it was a second check worth building into any transformation sheet: at θ = 90° the element has simply turned a quarter turn, so σ90 must equal σy and τ90 must equal −τxy. The spreadsheet gave σ90 = −13.26 MPa instead of 31.50 MPa. Wrapping the angles in RADIANS() fixed every row.

```figure
type: checklist
title: Checks for any stress transformation, by hand or in software
caption: The designer's checks after the spreadsheet error. This is an illustration.
- x At θ = 0°, the original σx and τxy come back
- x At θ = 90°, σy and −τxy come back
- x σθ + σθ+90 equals σx + σy on every row
- x Angles converted to radians wherever the software expects them
- x The sign convention for shear and for θ written at the top of the sheet
```

## Where transformation is used

The equations are not only for finding the worst plane. They answer practical questions about stresses on planes that the design or the process has already chosen.

**Seams and joints.** A spirally welded tube carries its weld at the helix angle of the spiral. The stress across the weld, which is what matters for its strength, is the normal stress on that plane, not the hoop or axial stress.

**Grain and fibre direction.** A forged spindle has its inclusions and grain flow stretched along the axis. Its strength across those fibres is lower than along them, so the normal stress on planes parallel to the axis deserves a check of its own. For the RH-40 element that is σy on the 0° plane, 31.50 MPa, well within the forging's transverse strength, but on a part whose largest stress sat across the fibre the answer could be different.

**Gauges and sensors.** A strain gauge measures strain along its own direction. Chapter 8 uses the strain version of these same equations to turn readings from gauges at 0°, 45° and 90° into the full state at the point.

**Cracks found in service.** A crack's angle is evidence about the stress that grew it, because fatigue cracks in ductile steels usually run across the plane of largest tension once they are long enough to see. A crack square to a shaft's axis points to bending; one at about 45° points to torsion; one at an angle in between points to a mix, and the transformation equations can test whether a proposed load case would put its largest tension across that plane. Investigators use this routinely before any sectioning or microscopy.

**Software output.** Finite element programs report stress components in a global frame, a local frame, or as principal values, depending on settings. Knowing that they are related by the transformation equations, and that the invariants must agree, makes it possible to check a plot by hand at a few points. [Design Simulation by the Numbers](/reados/publications/design-simulation-by-the-numbers/read-stress-results-correctly/) covers how to read those results.

### Tensors and frames

The rule that turns σx, σy and τxy into σθ and τθ is the rule that defines a second-order tensor. Strain obeys the same rule, as do the second moments of area of a beam section. Seeing them as one family is useful: any trick learned for stress, including Mohr's circle, works for strain and for section properties too. The physics literature takes the idea further, describing a body that has been plastically deformed as one whose local frames no longer fit together, but for machine design the frame-free quantities at a point are what matter, and they come from the transformation equations.

## Exercise: the stress across a 45° seam

Suppose a later version of the RH-40 used a spirally welded tube for a non-rotating water pipe on the mast, with the seam's normal at θ = 45° to the pipe axis. At a point on the pipe, the stresses are σx = 40.0 MPa axially, σy = 80.0 MPa around the hoop and τxy = 0, because the pipe carries pressure but no torque. Find the normal and shear stresses on the seam, and check the answer with the invariant.

**Worked answer.** The mean is (40.0 + 80.0) ÷ 2 = 60.0 MPa and the half-difference (40.0 − 80.0) ÷ 2 = −20.0 MPa. At θ = 45°, cos 2θ = 0 and sin 2θ = 1, so

σ45 = 60.0 + (−20.0) × 0 + 0 × 1 = 60.0 MPa, and τ45 = −(−20.0) × 1 + 0 × 0 = 20.0 MPa.

On the perpendicular plane, θ = 135°, cos 2θ = 0 again, so σ135 = 60.0 MPa. The check σ45 + σ135 = 120.0 MPa = σx + σy passes. The seam carries 60.0 MPa across it, three-quarters of the hoop stress, and a shear of 20.0 MPa along it. A seam at 45° is better placed than a longitudinal seam, which would carry the full 80.0 MPa hoop stress across it. This is an illustration.
