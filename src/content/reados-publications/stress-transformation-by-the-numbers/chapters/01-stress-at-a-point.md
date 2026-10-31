---
book: stress-transformation-by-the-numbers
chapterSlug: stress-at-a-point
order: 1
title: "Stress at a point"
description: "What stress at a point means, how a small element describes it with normal and shear components, and how pressure, axial load, bending and torque on a hollow spindle turn into those components."
draft: false
---

Engineers usually meet stress as force divided by area: a bar pulled with 10 kN over 100 mm² carries 100 MPa. That works for a straight bar under a straight pull, where the force is spread evenly over a cross-section and has only one direction. It stops working as soon as a part carries more than one kind of load, because the loads produce stresses in different directions at the same point, and the cross-section is no longer the only cut that matters.

This chapter sets up the language the rest of the book uses: the stress at a point, the small element that describes it, the signs of its components, and how each load on a part produces them. It then works through the hollow spindle of the RH-40 rotary head, where water pressure, pullback, bending and torque all act at once.

## Cutting the part

Imagine slicing a loaded part with a flat cut through a point inside it. To hold the two pieces as they were, each face of the cut must carry a distribution of force that the other piece used to supply. Divide the force on a tiny patch of the cut by the patch's area and you have the stress on that cut at that point.

That stress has a direction, and it is rarely square to the cut. Split it into two parts:

- the **normal stress**, σ (sigma), perpendicular to the cut, which pulls the faces apart (tension, positive) or pushes them together (compression, negative);
- the **shear stress**, τ (tau), lying in the plane of the cut, which slides one face over the other.

The key fact is that both depend on the cut's direction. Turn the cut through the same point and the normal and shear stresses on it change. A bar pulled with 100 MPa has 100 MPa of normal stress and no shear on its cross-section, but a cut at 45° carries 50 MPa of normal stress and 50 MPa of shear. Nothing about the bar changed; only the question did. The stress at a point is the complete answer to that question for every possible cut, and it turns out that a small number of components contain it.

## The stress element

The standard way to record the stress at a point is to imagine a tiny cube around it, with its faces square to three chosen axes x, y and z. Each face carries one normal stress and a shear stress, which is split into two components along the face's edges. That gives nine numbers for the three visible faces.

Not all nine are independent. If the cube is to stay still, the moments of the shear forces about each axis must balance, and that forces the shear on adjacent faces to match: τxy = τyx, τyz = τzy and τzx = τxz. The stress at a point is therefore fully described by six components, three normal and three shear. Mathematically, they form a symmetric tensor, which is a precise way of saying that the components change in a fixed way when the axes turn. Chapter 2 sets out that rule.

```figure
type: svg
title: A plane stress element on the spindle surface
alt: A square element with the x axis horizontal along the spindle and the y axis vertical around its circumference. Arrows on the left and right faces point outward and are labelled sigma x. Arrows on the top and bottom faces point outward and are labelled sigma y. Half arrows along each face, pointing in opposite directions on opposite faces, are labelled tau x y and form a pair that would turn the element anticlockwise on the right face and clockwise on the top face.
caption: The element is drawn on the outer surface, where nothing presses on the free face, so the stresses on it are zero and only σx, σy and τxy remain: a state of plane stress. Positive normal stresses pull on the faces; positive shear acts in the positive y direction on the positive x face.
viewbox: 0 0 640 380
body:
<rect class="bx" x="220" y="110" width="200" height="160"/>
<path class="la" d="M420 190H520M220 190H120"/>
<path class="la" d="M320 110V30M320 270V350"/>
<path class="ln" d="M432 250V130M208 130V250"/>
<path class="ln" d="M240 98H400M400 282H240"/>
<text class="txb" x="530" y="196">σx</text>
<text class="txb" x="80" y="196">σx</text>
<text class="txb" x="330" y="34">σy</text>
<text class="txb" x="330" y="360">σy</text>
<text class="tx txs" x="440" y="140">τxy</text>
<text class="tx txs" x="160" y="250">τxy</text>
<text class="tx txs" x="404" y="90">τxy</text>
<text class="tx txs" x="200" y="300">τxy</text>
<text class="tx txs" x="560" y="300">x: along the spindle</text>
<text class="tx txs" x="40" y="40">y: around it</text>
```

### Plane stress

Most failures start at a surface, and a surface that nothing presses on carries no stress on itself. At such a point the normal stress perpendicular to the surface and the two shears on it are zero, and only three components remain: two normal stresses in the surface and one shear. That is plane stress, and it covers the outside of shafts, tubes, brackets and plates. Chapters 2 to 4 work entirely in plane stress. Inside a thick wall, or at a surface under pressure, the third direction returns, and Chapter 6 deals with it.

### Signs

Sign conventions cause more wrong answers in stress work than any formula. This book uses one convention throughout:

1. Tension is positive and compression negative.
2. A shear stress is positive when it acts in the positive direction of an axis on a face whose outward normal points in the positive direction of another axis, and so on around the element.
3. Angles are measured anticlockwise from the x axis.

On the RH-40 spindle, x runs along the spindle's axis and y around its circumference. Some texts and some software use other conventions, especially for the sign of shear in Mohr's circle; Chapter 3 points out where that matters.

## Loads to components on the spindle

The RH-40 spindle is a tube: 90 mm outside diameter, 72 mm bore, so a 9 mm wall. Its cross-section has an area of 2,290 mm², a second moment of area of 1,901,456 mm⁴, a polar moment of 3,802,912 mm⁴ and a section modulus in bending of 42,255 mm³. This is an illustration.

At the critical section, the gear seat, five loads act at once while the rods are being pulled back from a hole. Each contributes to one component of the stress on the outer surface.

```figure
type: compare
title: RH-40 spindle, pullback case: each load and the stress it gives on the outer surface
cols: Formula | Value, MPa | Component
rowhead: Load
- Water pressure 7 MPa, hoop | p Dm ÷ 2t | 31.50 | σy
- Water pressure 7 MPa, end load | p Dm ÷ 4t | 15.75 | σx
- Pullback 120 kN | N ÷ A | 52.40 | σx
- * Bending 2,000 N·m | M ÷ Z | ±47.33 | σx
- Torque 6,500 N·m | T r ÷ J | 76.91 | τxy
caption: This is an illustration. Dm = 81 mm is the mean diameter. The pressure stresses are the thin-wall values; Chapter 5 compares them with the exact thick-wall ones. The torsion stress is the exact value at the outer surface.
```

### Pressure

Water at 7 MPa inside the bore tries to burst the tube along its length and to push its ends apart. The thin-wall formulas give the hoop stress around the circumference as p Dm ÷ 2t = 7 × 81 ÷ 18 = 31.50 MPa, and the axial stress as half that, 15.75 MPa. The axial stress assumes the tube is effectively closed at both ends, so that the pressure pushes on the ends and the wall carries that push. At the RH-40 head the swivel seal above and the rod string below close the spindle in that sense.

### Axial load

The 120 kN pullback adds a uniform tension of 120,000 ÷ 2,290 = 52.40 MPa. While drilling, the 40 kN feed thrust gives a compression of 17.47 MPa instead.

### Bending

The gear mesh puts a bending moment of 2,000 N·m on the spindle at the gear seat. On the outer surface it gives an axial stress of M ÷ Z = 2,000,000 ÷ 42,255 = 47.33 MPa, tensile on one side and compressive on the other.

### Torque

Torque produces shear on the cross-section. In a tube, the exact shear stress at radius r is T r ÷ J, so at the outer surface it is 6,500,000 × 45 ÷ 3,802,912 = 76.91 MPa, and at the bore 61.53 MPa. A thin-wall formula that assumes the shear is even across the wall gives 70.08 MPa, the value at the mean radius. For a 9 mm wall on a 90 mm tube, the difference matters: the outer surface carries 10% more than the thin-wall average.

### The torsion member comparison

The [torsion member comparison tool](/tools/torsion-member-comparison/) puts a tube, a solid bar and a rectangle side by side under the same torque, with the exact polar moment for the round sections and the standard handbook formulas for the rectangle. It is a quick way to see why the spindle is a tube.

```figure
type: compare
title: The torsion member comparison tool with the RH-40 torque
cols: Shear stress, MPa | Twist over 1 m, ° | Mass, kg/m
rowhead: Section
- * Tube 90 × 9 mm | 76.91 | 1.23 | 17.98
- Solid bar 54 mm, same area | 210.23 | 5.61 | 17.98
- Rectangle 80 × 40 mm | 198.05 | 4.00 | 25.12
caption: This is an illustration. 6,500 N·m, 1,000 mm length, G = 79.5 GPa, density 7,850 kg/m³. The tube and the solid bar weigh the same; the tube carries the torque at little more than a third of the stress and twists less than a quarter as much. The bore is also the water passage.
```

A solid bar would need a diameter of 75.5 mm to bring its surface shear down to the tube's 76.9 MPa, and it would weigh 35.2 kg/m, almost twice as much. The material near the centre of a solid shaft carries little shear and adds little stiffness, so taking it out costs almost nothing in strength.

## Superposition and the critical point

Because the spindle stays elastic and its deflections are small, the stresses from separate loads simply add, component by component. This is superposition, and it is what lets the table above be built one load at a time. It has limits: it fails once anything yields, when large deflections change the geometry, and when contact or friction makes a load depend on another load.

Adding the components needs care about where each one is largest. The pressure, axial and torque stresses are the same all round the outer surface; the bending stress is not. On the side where bending pulls, the axial stress during pullback is 15.75 + 52.40 + 47.33 = 115.48 MPa; on the side where it pushes, 15.75 + 52.40 − 47.33 = 20.81 MPa. The hoop stress and the shear are the same on both sides. The element at the tension side is

- σx = 115.48 MPa, σy = 31.50 MPa, τxy = 76.91 MPa.

That is the starting point for Chapters 2 and 3, which find the largest stress on any cut through it. This is an illustration.

```figure
type: bars
title: Axial stress on the spindle's outer surface, pullback case
x: Position around the spindle
y: Axial stress σx, MPa
caption: This is an illustration. The pressure and pullback stresses are uniform; bending adds 47.33 MPa on one side and takes it away on the other. On a rotating spindle every point passes through both.
- Bending compression side | 20.81
- Neutral axis | 68.15
- * Bending tension side | 115.48
```

## The mistake: the wrong fibre

The first draft of the RH-40 calculation listed the gear seat's stresses for the side of the spindle facing the gear mesh, where the bending from the tooth load is compressive. It gave σx = 20.81 MPa and a comfortable result in every later check. A reviewer asked a simple question: which side faces the mesh after half a turn?

The spindle rotates; the gear load does not. Every point on the surface passes the tension side once per revolution, so the worst element for a static check is the one with σx = 115.48 MPa, and for a fatigue check the bending stress is fully reversed, swinging between +47.33 and −47.33 MPa on top of the steady stresses. The draft had treated a rotating shaft as if it were a fixed beam. The correction raised the axial stress at the critical element by a factor of 5.5.

The general lesson is to ask, for every load, whether it stays fixed to the part or moves relative to it. Pressure, pullback and torque turn with the spindle and look steady to a point on its surface. The gear's bending load stays fixed in space, so to the spindle it rotates.

## Equilibrium as a check

Stress is a way of describing how a part balances its loads, and every stress distribution must pass that test. Two checks catch most mistakes in a hand calculation.

**Forces across a cut.** The axial stress from pullback, integrated over the cross-section, must give back the load: 52.40 MPa × 2,290 mm² = 120.0 kN. If an area or unit is wrong, this check fails.

**Pressure on half the tube.** Cut a length L of the spindle along a diameter. The water pushes the halves apart with p × d × L = 7 × 72 × L = 504L newtons, and the two walls must hold it with an average hoop stress across their total thickness 2 × 9 mm: 504 ÷ 18 = 28.0 MPa. The thin-wall formula gave 31.50 MPa because it uses the mean diameter, not the bore; the exact thick-wall solution of Chapter 5 gives 31.9 MPa at the bore and 24.9 MPa at the outside, and its average is exactly 28.0 MPa. Equilibrium fixes the average stress, not how it is spread; that takes the extra condition that the deformed parts still fit together, which Chapter 10 calls compatibility.

```figure
type: checklist
title: Before using a set of stress components
caption: The designer's checks on the RH-40 element. This is an illustration.
- x Every load listed, with its direction and whether it rotates with the part
- x Units consistent: N and mm give MPa
- x Each component placed on the right face and with the right sign
- x Bending taken at the worst fibre for the way the part moves
- x Forces across a cut balance the applied loads
- ? Stress concentrations at the gear seat's shoulder and keyway (applied in the fatigue check, not here)
```

## What the components are for

The six components at a point are raw material. On their own they do not say whether the part is safe, because a material does not care about the x and y axes that an engineer happened to choose. Yield depends on combinations that are the same in every frame (Chapter 3 and the yield criteria in [Yield and Plastic Flow by the Numbers](/reados/publications/yield-and-plastic-flow-by-the-numbers/yield-under-combined-stress/)), and fatigue cracks grow on the planes of largest tensile stress, whatever their direction. The next two chapters turn the components into those frame-free quantities.

Failures of pressurised rotating parts such as a drill spindle can release water at pressure and throw parts, and the rig builder must manage those risks under the model WHS laws and Safe Work Australia's Code of Practice for plant. The calculations here are one input to that work.

## Exercise: the drilling case

While drilling, the RH-40 spindle carries the same 7 MPa of water pressure and 6,500 N·m of torque, the 2,000 N·m bending moment at the gear seat, and a feed thrust of 40 kN in compression instead of the pullback. Write down the stress components at the outer surface on the bending tension side and on the bending compression side. Which side has the larger axial stress in magnitude?

**Worked answer.** The thrust gives −40,000 ÷ 2,290 = −17.47 MPa. The pressure still gives 15.75 MPa axially and 31.50 MPa around the hoop, and the torque 76.91 MPa of shear.

On the bending tension side, σx = 15.75 − 17.47 + 47.33 = 45.61 MPa, σy = 31.50 MPa and τxy = 76.91 MPa.

On the bending compression side, σx = 15.75 − 17.47 − 47.33 = −49.05 MPa, σy = 31.50 MPa and τxy = 76.91 MPa.

The compression side has the larger axial stress in magnitude, 49.05 MPa against 45.61 MPa. Its axial and hoop stresses also have opposite signs, which, as Chapter 3 shows, makes its largest shear stress greater than on the tension side even though neither axial stress is as large as in the pullback case. This is an illustration.
