---
book: yield-and-plastic-flow-by-the-numbers
chapterSlug: yield-under-combined-stress
order: 5
title: "Yield under combined stress"
description: "Why shear, not pressure, makes metals yield, how the Tresca and von Mises criteria compare, and how to check the HC-63 barrel's bore without dropping the radial stress."
draft: false
---

A tensile test gives the stress at which a bar yields under a single stress along its axis. Real parts are rarely so simple. The wall of the HC-63's barrel carries a hoop stress around the tube, an axial stress along it and, at the bore, a radial stress from the oil pressing on it, all at once. Which combination will make it yield?

This chapter answers that question from the mechanism of yield: dislocations move under shear, so it is shear, in some form, that decides. It sets out the Tresca and von Mises criteria, applies them to the barrel at working and test pressure, and follows a check that left out one of the three stresses and overstated the margin.

## Shear makes metals yield

Chapter 1 explained that plastic flow is the movement of dislocations on slip planes, driven by the shear stress resolved onto those planes. That has two direct consequences for yield under combined stresses.

First, the shear stresses in the material decide whether it yields. A stress state with large normal stresses but small differences between them has small shear stresses, and does not yield.

Second, a pure hydrostatic pressure, equal in all directions, produces no shear stress on any plane and cannot move a dislocation. It squeezes the lattice uniformly, changing the volume by an amount set by the bulk modulus, but it does not cause yielding. Steel at the bottom of the deepest ocean, at about 110 MPa all round, does not yield. Experiments at far higher pressures confirm that hydrostatic pressure has very little effect on the yield of metals. Plastic flow, accordingly, changes shape but not volume, which is why constant volume could be assumed in Chapter 3.

Both criteria in common use build on those facts: each takes yield to depend only on the differences between the principal stresses.

## Principal stresses

At any point in a loaded part there are three mutually perpendicular directions on which the shear stress is zero; the normal stresses on them are the principal stresses, σ1 ≥ σ2 ≥ σ3. Any stress state can be described by them. In the barrel wall, by symmetry, they are simply the hoop, axial and radial stresses, with no shear between them.

```figure
type: formula
title: The Tresca and von Mises yield criteria
formula: Tresca:  σ1 − σ3 = Sy
formula: von Mises:  √{½ [(σ1 − σ2)² + (σ2 − σ3)² + (σ3 − σ1)²]} = Sy
caption: Sy is the tensile yield strength. Both give Sy in simple tension. Both are unchanged if the same pressure is added to all three principal stresses. They differ most in pure shear.
- Tresca | yield when the largest shear stress, (σ1 − σ3) ÷ 2, reaches its value in a tensile test, Sy ÷ 2
- von Mises | yield when the distortion energy, or the octahedral shear stress, reaches its value in a tensile test
```

The Tresca criterion is the simpler idea: yield happens when the largest shear stress anywhere reaches the shear stress at which a tensile bar yields. The von Mises criterion takes all three shear stresses into account. For ductile metals, von Mises usually fits experiments slightly better, and Tresca is slightly more conservative; the difference is never more than about 15%.

```figure
type: compare
title: Where the two criteria agree and where they differ
cols: Principal stresses | Tresca predicts yield at | von Mises predicts yield at
rowhead: Stress state
- Simple tension | σ, 0, 0 | σ = Sy | σ = Sy
- Equal biaxial tension | σ, σ, 0 | σ = Sy | σ = Sy
- * Pure shear | τ, 0, −τ | τ = 0.5 Sy | τ = 0.577 Sy
- Hydrostatic pressure | −p, −p, −p | never | never
caption: In pure shear, such as a shaft in torsion, Tresca predicts yield at a shear stress 13% lower than von Mises. Elsewhere the two are closer. Neither predicts yield under hydrostatic pressure.
```

### The yield surface

The two criteria are easiest to compare as shapes. Plot the two principal stresses of a plane stress state on two axes, σ1 across and σ2 up, with the third zero. Every combination inside a closed curve around the origin is elastic; on the curve the material yields. For von Mises the curve is an ellipse; for Tresca it is a hexagon that fits inside the ellipse, touching it at six points: simple tension and compression along each axis, and equal biaxial tension and compression.

```figure
type: svg
title: Tresca and von Mises yield surfaces in plane stress
alt: Two axes cross at the origin, labelled sigma one horizontally and sigma two vertically. An ellipse tilted at 45 degrees surrounds the origin and is labelled von Mises. A hexagon inside it touches the ellipse at six points, on the axes at plus and minus the yield strength and at the two corners where both stresses are equal. A dashed line at minus 45 degrees through the origin marks pure shear, where the gap between the hexagon and the ellipse is widest. A dot inside both shapes marks the barrel bore's operating point.
caption: Combinations inside the curves are elastic. The hexagon (Tresca) lies inside the ellipse (von Mises) and touches it at six points. The gap is largest along the pure shear line, where Tresca allows a shear stress of 0.5 Sy and von Mises 0.577 Sy.
viewbox: 0 0 640 400
body:
<path class="ln" d="M120 200H520M320 20V380"/>
<ellipse class="bx" cx="320" cy="200" rx="192" ry="111" transform="rotate(-45 320 200)"/>
<path class="la" d="M456 200L456 64L320 64L184 200L184 336L320 336Z"/>
<path class="ln dsh" d="M200 80L440 320"/>
<circle class="fa" cx="350" cy="188" r="6"/>
<text class="tx txs" x="525" y="205">σ1</text>
<text class="tx txs" x="328" y="30">σ2</text>
<text class="txb" x="470" y="70">von Mises</text>
<text class="txb" x="200" y="370">Tresca</text>
<text class="tx txs" x="445" y="340">pure shear</text>
<text class="tx txs" x="360" y="180">barrel bore, 21 MPa</text>
<text class="tx txs" x="460" y="218">Sy</text>
<text class="tx txs" x="326" y="58">Sy</text>
```

A design check asks how far the operating point lies inside the curve, along the line from the origin through it: that distance is the safety factor if all the stresses rise together. With a third principal stress that is not zero, as at the barrel's bore, the surfaces become a cylinder and a hexagonal prism in three dimensions, both running along the line of equal stresses, the hydrostatic axis, without end. Adding the same pressure to all three stresses slides the point along that axis and never brings it to yield.

## The barrel at its bore

The HC-63's barrel is a thick tube: its 6.5 mm wall is about a tenth of its 63 mm bore. Under internal pressure p, the stresses in such a tube are given by Lamé's equations. The hoop stress is highest at the bore and falls towards the outside; the radial stress is −p at the bore and zero at the outside; and with closed ends, the end caps push on the barrel to give a uniform axial stress.

```figure
type: formula
title: Lamé stresses in a closed-ended thick tube under internal pressure
formula: σθ = p ri² (1 + ro² ÷ r²) ÷ (ro² − ri²),   σr = p ri² (1 − ro² ÷ r²) ÷ (ro² − ri²)
formula: σz = p ri² ÷ (ro² − ri²)
caption: ri and ro are the inner and outer radii and r the radius at the point considered. At the bore, σr = −p and σθ = p (ro² + ri²) ÷ (ro² − ri²).
- σθ | hoop stress
- σr | radial stress
- σz | axial stress, for closed ends
```

For the HC-63, ri = 31.5 mm and ro = 38 mm. At the working pressure of 21 MPa, the stresses at the bore are a hoop stress of 113.3 MPa, a radial stress of −21.0 MPa and an axial stress of 46.1 MPa. This is an illustration.

```figure
type: line
title: Hoop and radial stress through the HC-63 barrel wall at 21 MPa
x: Radius, mm
y: Stress, MPa
ymin: -40
ymax: 140
legend: Hoop stress | Radial stress
caption: This is an illustration. Lamé's equations, ri = 31.5 mm, ro = 38 mm. The hoop stress falls from 113.3 MPa at the bore to 92.3 MPa at the outside; the radial stress rises from −21 MPa to zero. The axial stress, 46.1 MPa, is uniform. The bore is the most highly stressed point.
- 31.5 | 113.3 | -21.0
- 33 | 107.3 | -15.0
- 34.5 | 102.1 | -9.8
- 36 | 97.5 | -5.3
- 38 | 92.3 | 0
```

### The triaxial stress check tool

The [triaxial stress check](/tools/triaxial-stress-check/) tool takes a general three-dimensional stress state, three normal and three shear stresses, finds the principal stresses from its invariants, and returns the maximum shear stress, the von Mises stress and the safety factors against yield by von Mises and by Tresca. From the elastic modulus and Poisson's ratio it also gives the principal strains by Hooke's law and the volume change, with the shear and bulk moduli.

```figure
type: compare
title: The HC-63 barrel bore in the triaxial stress check tool
cols: At working, 21 MPa | At proof test, 31.5 MPa
rowhead: Result
- Principal stresses, MPa | 113.3, 46.1, −21.0 | 169.9, 69.2, −31.5
- Maximum shear stress, MPa | 67.15 | 100.7
- * von Mises stress, MPa | 116.3 | 174.4
- * Safety factor, von Mises and Tresca | 4.47 and 3.87 | 2.98 and 2.58
- Hoop strain at the bore, microstrain | 517.2 | 775.4
- Volume change, microstrain | 283.6 | 425.3
caption: This is an illustration. E = 205 GPa, ν = 0.29, Sy = 520 MPa from the barrel's certificate, required factor 1.5. WITHIN YIELD MARGIN at both pressures.
```

The barrel has a large margin against yield at both pressures. That is normal for a hydraulic barrel: its wall thickness is set less by yield than by stiffness, fatigue under pressure cycles and the need to hold a precise bore. The hoop strain at the bore, 517 microstrain at working pressure, means the 63 mm bore grows by 0.033 mm when pressurised, and by 0.049 mm at the proof test. That growth opens the gap the piston seal must bridge, and the seal maker's limit on the extrusion gap is often a tighter limit on the barrel than yield is.

### Strains and the seal

The strains in the tool come from Hooke's law in three dimensions: each principal strain is the stress in that direction, less Poisson's ratio times the other two, all divided by E. The hoop strain at the bore at working pressure is (113.3 − 0.29 × (46.1 − 21.0)) ÷ 205,000 = 517 microstrain. The axial stress and the radial compression partly cancel each other's Poisson effect, so the hoop strain is a little less than the hoop stress alone would give.

That strain matters to the seal more than to the steel. The piston's diametral clearance in the bore is 0.15 mm when the barrel is unpressurised. At working pressure the bore grows by 0.033 mm and the gap the seal must bridge becomes 0.183 mm; at the proof test, 0.199 mm. The seal's anti-extrusion ring is chosen for a gap of up to 0.25 mm at the proof pressure, so it has a margin, but a thinner barrel, which might still pass a yield check comfortably, could fail the seal long before the steel. This is an illustration.

### Ports and local yielding

The barrel has an oil port drilled through its wall near each end. A cross-bore in a pressurised tube is a stress concentration: the hoop stress at the edge where the port meets the bore rises to several times the plain bore's value. The designer took a stress concentration factor of about 2.5 for the HC-63's port proportions from published data for cross-bores in thick cylinders. This is an illustration. That puts the local hoop stress at about 283 MPa at working pressure and 425 MPa at the proof test, still below the 520 MPa yield.

Had the local stress exceeded yield at the proof test, a small zone at the port's edge would have yielded and, on unloading, been left in residual compression by the elastic material around it. For a ductile steel under a single static load, that local yielding is not a failure; it is how ductile parts redistribute stress. But it uses up part of the material's ductility, and for a part under repeated pressure, the port's edge is where fatigue cracks start. The HC-63's ports are deburred and their edges radiused for that reason, and the port is the first place the builder looks on a cylinder returned from service.

## The error: dropping the radial stress

A graduate engineer was asked to prepare the yield check for a higher-pressure version of the barrel. The engineer had learned the [principal stresses and von Mises](/tools/principal-stress/) tool, which handles plane stress, and entered the hoop and axial stresses at the bore, 113.3 and 46.1 MPa, with no shear. The tool returned a von Mises stress of 98.7 MPa and a safety factor of 5.27.

A plane stress check assumes the third principal stress is zero. That is true at a free surface, such as the outside of the barrel. It is not true at the bore, where the oil presses on the wall with the full pressure: the radial stress there is −21 MPa. Leaving it out reduced both criteria's view of the stress. By Tresca, the largest shear stress at the bore is (113.3 − (−21.0)) ÷ 2 = 67.2 MPa, not 113.3 ÷ 2 = 56.7 MPa; by von Mises the equivalent stress is 116.3 MPa, not 98.7.

```figure
type: compare
title: The barrel bore checked with and without the radial stress
cols: Principal stresses used, MPa | von Mises stress, MPa | von Mises safety factor
rowhead: Check
- Plane stress, radial stress left out | 113.3 and 46.1 | 98.7 | 5.27
- * All three stresses | 113.3, 46.1 and −21.0 | 116.3 | 4.47
caption: This is an illustration. Leaving out the radial stress at the bore overstated the margin by 18%. The error grows with pressure: for a high-pressure barrel the radial stress is a large share of the total.
```

The checking engineer spotted it by asking where the check had been made. At the outside surface, plane stress applies and the hoop stress is lower, 92.3 MPa; at the bore, the stresses are higher and triaxial. A check that takes the bore's hoop stress with the outside's assumption of no radial stress uses the worst of both and gets the wrong answer. For the higher-pressure barrel, the error would have been larger still, because the radial stress grows in proportion to the pressure while the wall is sized to keep the hoop stress in check.

The builder's rule since then: name the point, then list all three principal stresses there, writing the zero explicitly where it is zero.

## What happens after yield

A yield criterion says when plastic flow starts. Two further rules say how the metal then flows, and they are used in every forming calculation in the later chapters.

**Plastic flow keeps volume constant.** Because flow is by slip, which only shears the lattice, the plastic strains in three directions add to zero. In a tensile test, the plastic strain across the bar is half the axial strain, with the opposite sign: the plastic equivalent of Poisson's ratio is 0.5, not 0.29. That is why a bar thins faster once it yields, and why the constant-volume assumption of Chapter 3 holds.

**The plastic strain follows the shear.** For a von Mises material, the plastic strain increments are in proportion to the differences between each stress and the mean stress, a result known as the Lévy–Mises flow rule. In equal biaxial tension, the metal thins and stretches equally in both directions; in a plane strain bend, where the material cannot change its width, the stress across the width rises to half the sum of the other two, and the yield stress in the bending direction rises to 2 ÷ √3, about 1.15 times Sy. Press-brake and plate-rolling formulas include that factor, sometimes hidden in a constant.

**The flow stress replaces the yield strength.** As the metal flows it work hardens, so the stress needed to keep it flowing is the flow stress at the current strain from the flow curve, not the original yield strength. The criteria stay the same; only the number on the right-hand side rises.

## Where each criterion is used

```figure
type: decision
title: Choosing a yield criterion
question: What is being checked?
- A ductile metal part, design check | von Mises; Tresca where a code requires it or a margin of conservatism is wanted
- A shaft in torsion | either; Tresca gives the lower allowable shear stress, 0.5 Sy against 0.577 Sy
- A pressure vessel or pipe to a code | the criterion and allowable stresses the code prescribes
- A brittle material such as grey cast iron | neither; a maximum normal stress or other brittle criterion
- Plastic forming, such as bending or drawing | either, with the flow stress in place of yield (Chapters 7 and 8)
caption: The two criteria agree to within about 15%. The larger errors in practice come from the stresses fed into them.
```

## Exercise: the rod under tension and twist

On its return stroke, the HC-63's rod pulls with 44.1 kN (Chapter 1's exercise), giving a tensile stress of 43.3 MPa in the 36 mm rod. A misaligned mounting adds a torque of 400 N·m. Find the shear stress at the rod's surface, the von Mises and Tresca equivalent stresses, and the safety factors against the rod steel's 360 MPa yield strength. Which criterion is more conservative, and by how much?

**Worked answer.** The shear stress at the surface is 16T ÷ (π d³) = 16 × 400,000 ÷ (π × 36³) = 43.7 MPa. With one normal stress σ and one shear stress τ, the von Mises equivalent is √(σ² + 3τ²) = √(43.3² + 3 × 43.7²) = 87.1 MPa, and the Tresca equivalent √(σ² + 4τ²) = 97.5 MPa.

The safety factors are 360 ÷ 87.1 = 4.13 by von Mises and 360 ÷ 97.5 = 3.69 by Tresca. Tresca is about 11% more conservative here, because the stress state is close to pure shear, where the two criteria differ most. Both show a comfortable margin; the rod's limit lies elsewhere, at its thread (Chapter 9) and under buckling when it pushes.
