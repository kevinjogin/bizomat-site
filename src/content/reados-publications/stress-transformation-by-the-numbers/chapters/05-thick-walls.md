---
book: stress-transformation-by-the-numbers
chapterSlug: thick-walls
order: 5
title: "Thick walls"
description: "How stress varies through a thick cylinder wall under pressure by Lamé's equations, how the thin-wall formula compares, why extra wall stops helping, and the pressure cylinder tool."
draft: false
---

The thin-wall formulas of Chapter 4 assume that the hoop stress is the same right through the wall. For the RH-40 spindle, with a wall a tenth of its diameter and only 7 MPa inside, that assumption costs almost nothing. For a hydraulic cylinder at 21 MPa with a wall of 20 mm on a 140 mm bore, or a high-pressure pump body, it hides the fact that the bore works much harder than the outside, and it misses a third stress altogether: the pressure pressing directly on the bore surface.

This chapter sets out the thick-wall solution published by Gabriel Lamé in the 1850s, applies it with the BIZOMAT pressure cylinder tool to the RH-40's hydraulic chuck cylinder, and shows why adding wall thickness gives less and less benefit until it gives none.

## Stress through the wall

Picture the wall of a thick cylinder as a stack of thin rings, one inside the next. Each ring is pushed outwards by the ring inside it and held in by the ring outside it, so each carries a hoop tension and passes a radial pressure outwards. The radial stress falls from the full internal pressure, as a compression, at the bore, to zero at an outside surface that nothing presses on. The hoop stress is largest at the bore and falls towards the outside.

Lamé found the distribution that satisfies both equilibrium of every ring and the condition that the rings, once deformed, still fit together without gaps or overlaps. That second condition is compatibility, and it is what the thin-wall formula leaves out.

```figure
type: formula
title: Lamé's equations for a cylinder under internal pressure
formula: σhoop(r) = p ri² ÷ (ro² − ri²) × (1 + ro² ÷ r²)
formula: σradial(r) = p ri² ÷ (ro² − ri²) × (1 − ro² ÷ r²)
formula: σaxial = p ri² ÷ (ro² − ri²), for closed ends
caption: ri and ro are the inner and outer radii and r the radius of the point. The hoop stress is largest at the bore; the radial stress is −p at the bore and zero at the outside. The axial stress is uniform when the ends are closed and their thrust is carried by the wall.
- At the bore | σhoop = p (ro² + ri²) ÷ (ro² − ri²), σradial = −p
- At the outside | σhoop = 2p ri² ÷ (ro² − ri²), σradial = 0
```

The hoop and radial stresses always differ by a fixed amount at each radius, and their sum is the same everywhere in the wall: twice the axial stress for a closed cylinder. That is another invariant-like property, and it means the wall's thickness changes uniformly under pressure, which is why plane cross-sections of a closed cylinder stay plane.

## The RH-40 chuck cylinder

The RH-40's hydraulic chuck grips the drill rods with pistons fed at 21 MPa. Its cylinder has a 140 mm bore and a 20 mm wall, so ri = 70 mm and ro = 90 mm, and it is made from honed tube with a yield strength of 460 MPa. The wall is a seventh of the bore, well beyond the thin-wall limit. This is an illustration.

The [pressure cylinder tool](/tools/pressure-cylinder/) takes the inside diameter, wall thickness, pressure, end condition, yield strength and required safety factor. It returns the hoop, longitudinal and radial stresses at the bore by Lamé, the thin-wall estimate for comparison, the von Mises stress at the bore and the safety factor. It flags walls thicker than 5% of the bore as thick, telling the user to rely on the Lamé result, and it reminds the user that pressure equipment must be designed and certified to its code.

```figure
type: steps
title: The RH-40 chuck cylinder in the pressure cylinder tool
caption: This is an illustration. Bore 140 mm, wall 20 mm, 21 MPa, closed ends, yield strength 460 MPa, required factor 2.0.
- Hoop stress at the bore, Lamé | 85.3 MPa
- Longitudinal stress | 32.2 MPa
- Radial stress at the bore | −21.0 MPa
- Thin-wall hoop stress | 84.0 MPa
- * von Mises stress at the bore and safety factor | 92.1 MPa; 5.00: ADEQUATE
- Wall ratio | thick wall: use the Lamé result
```

### How the stress falls through the wall

Lamé's equations give the hoop and radial stress at any radius. Across the chuck cylinder's 20 mm wall, the hoop stress falls by a quarter from bore to outside, and the radial stress rises from −21 MPa to zero.

```figure
type: line
title: Hoop and radial stress through the chuck cylinder wall at 21 MPa
x: Radius, mm
y: Stress, MPa
ymin: -30
ymax: 100
legend: Hoop stress | Radial stress
caption: This is an illustration. ri = 70 mm, ro = 90 mm. The hoop stress is 85.31 MPa at the bore and 64.31 MPa at the outside. The radial stress is −21 MPa at the bore and zero at the outside.
- 70 | 85.31 | -21.00
- 75 | 78.46 | -14.15
- 80 | 72.85 | -8.54
- 85 | 68.21 | -3.89
- 90 | 64.31 | 0.00
```

## Thin-wall formulas against Lamé

The thin-wall formula with the mean diameter gives 84.0 MPa for the chuck cylinder, against the Lamé bore value of 85.31 MPa: only 1.5% low. That is closer than many people expect, and it holds up to walls of about a tenth of the bore within half a per cent. Its failure is gradual, not sudden.

```figure
type: compare
title: Bore hoop stress at 21 MPa for a 140 mm bore and different walls
cols: Lamé at the bore, MPa | Thin-wall, mean diameter, MPa | Thin-wall error | von Mises at the bore, MPa | Safety factor, Sy = 460 MPa
rowhead: Wall thickness
- 5 mm | 304.86 | 304.50 | −0.1% | 282.20 | 1.63
- 10 mm | 158.20 | 157.50 | −0.4% | 155.19 | 2.96
- * 20 mm | 85.31 | 84.00 | −1.5% | 92.07 | 5.00
- 40 mm | 49.58 | 47.25 | −4.7% | 61.13 | 7.53
- 80 mm | 32.69 | 28.88 | −11.7% | 46.50 | 9.89
- 200 mm | 24.03 | 17.85 | −25.7% | 38.99 | 11.80
caption: This is an illustration. Closed ends. The thin-wall formula becomes unsafe as the wall thickens, but the larger story is in the last column: each doubling of the wall buys less margin than the one before.
```

### Which wall thickness to use

A stress calculation should use the thinnest wall the part can have in service, not the nominal one. Honed and cold-drawn tube is sold with tolerances on its outside diameter and wall, and machining the bore oversize to clean it up during a rebuild removes more. A hydraulic cylinder that may be re-honed twice in its life should be checked at the wall it will have after the second hone. Pressure equipment codes go further and add allowances for corrosion and for the manufacturing tolerance before the stress check. For the RH-40 chuck, the builder checked the wall at its minimum of 19.2 mm after one rebuild, which raised the bore hoop stress from 85.31 MPa to 88.33 MPa, the von Mises stress at the bore to 94.68 MPa, and lowered the safety factor from 5.00 to 4.86. This is an illustration.

## The mistake: the wrong diameter

The RH-40's first chuck calculation was done on the back of a drawing with the thin-wall formula and the bore diameter: 21 × 140 ÷ (2 × 20) = 73.5 MPa. That is 13.8% below the Lamé bore stress of 85.31 MPa. The calculation had not been wrong in its arithmetic; it had used the formula outside the conditions that make its choice of diameter unimportant.

The number 73.5 MPa is not meaningless. It is exactly the average hoop stress across the wall, because equilibrium of half the cylinder requires the pressure force on the bore, p × di per unit length, to be carried by the two walls: 21 × 140 ÷ 40 = 73.5 MPa. The thin-wall formula with the bore diameter is the equilibrium average, just as in Chapter 1. What it cannot say is how that average is shared out, and Lamé's compatibility condition says the bore takes more. Using the outside diameter instead would give 94.5 MPa, 10.8% too high.

The review caught it by running the pressure cylinder tool, whose Lamé and thin-wall values sit side by side, and by asking which diameter the hand formula had used. For thick walls, the check that matters is the bore, with Lamé.

## Why more wall stops helping

The compare table above shows the safety factor rising from 5.00 at a 20 mm wall to only 9.89 at 80 mm, although the wall's mass per metre has risen 5.5 times. Lamé's equations show the limit. As the outer radius grows without bound, the bore hoop stress falls to equal the pressure, not to zero, and the radial stress at the bore is always −p. The bore is always loaded by at least the pressure in two directions at once.

For a closed cylinder, the internal pressure at which the bore first yields is, by the Tresca criterion, p = (Sy ÷ 2) × (1 − ri² ÷ ro²). For the chuck cylinder with Sy = 460 MPa, that is 90.9 MPa at a 20 mm wall, 136.9 MPa at 40 mm, 179.9 MPa at 80 mm, and never more than 230 MPa however thick the wall. The von Mises criterion gives a little more, up to Sy ÷ √3 = 265.6 MPa. The material near the outside of a very thick wall carries almost nothing.

```figure
type: bars
title: Pressure at first yield of the bore, chuck cylinder, Tresca
x: Wall thickness, mm
y: Pressure at first yield, MPa
caption: This is an illustration. 140 mm bore, yield strength 460 MPa, closed ends. The limit for an infinitely thick wall is half the yield strength, 230 MPa.
- 5 | 29.6
- 10 | 53.9
- * 20 | 90.9
- 40 | 136.9
- 80 | 179.9
- Infinite | 230.0
```

Designers of very high-pressure equipment get around this limit in two ways, both of which work by putting the bore into compression before the pressure is applied. A compound cylinder shrinks one tube onto another, so the inner tube starts in hoop compression; Chapter 9's interference fit equations describe it. Autofrettage pressurises a cylinder once beyond the bore's yield point, so that the yielded inner layer is squeezed into compression by the elastic outer layer when the pressure is released; Chapter 10 discusses that kind of locked-in stress. Both are specialist techniques, governed by the codes for the equipment concerned.

## The RH-40 spindle by Lamé

The same equations settle the question left open in Chapter 4. For the spindle, with ri = 36 mm and ro = 45 mm at 7 MPa, the bore hoop stress is 31.89 MPa against the thin-wall 31.50 MPa, the outside hoop stress 24.89 MPa, and the axial pressure stress 12.44 MPa against the thin-wall 15.75 MPa. The pressure cylinder tool gives a von Mises stress at the bore of 33.7 MPa from pressure alone, a factor of 19.3 against 650 MPa. Pressure is a small part of the spindle's load; the torque and the pullback dominate. The difference between thin and thick-wall pressure stresses changes the gear seat's combined safety factor by less than 1%, as Chapter 4's last table showed.

## How much the bore grows

Stresses are only half of what a cylinder designer needs. The other half is how much the bore grows under pressure, because a piston seal has to bridge the gap between the piston and the bore, and a seal pushed into a gap that has opened too far extrudes and fails. Lamé's stresses give the growth directly through Hooke's law, which Chapter 7 sets out in full.

At the chuck cylinder's bore, the hoop strain is the hoop stress less Poisson's ratio times the other two stresses, all divided by the elastic modulus. With E = 205 GPa and ν = 0.29:

εhoop = [85.31 − 0.29 × (−21.00 + 32.16)] ÷ 205,000 = 4.00 × 10⁻⁴.

The bore radius grows by 70 × 4.00 × 10⁻⁴ = 0.028 mm, so the 140 mm bore grows by 0.056 mm in diameter at 21 MPa. The outside diameter grows by 0.048 mm. The cylinder also lengthens slightly, by about 0.02 mm over a 300 mm length, because the axial stress outweighs the Poisson contraction from the hoop and radial stresses. This is an illustration.

```figure
type: stats
title: The chuck cylinder's growth at 21 MPa
caption: This is an illustration. Elastic, closed ends, E = 205 GPa, ν = 0.29. The seal maker's extrusion gap limit for the seal and pressure is the number to compare with.
- Bore diameter growth | 0.056 mm
- Outside diameter growth | 0.048 mm
- Hoop strain at the bore | 400 microstrain
- Length change over 300 mm | 0.020 mm
```

Those numbers are small, but so are seal clearances. A piston with a diametral clearance of 0.10 mm in the bore at rest has 0.156 mm when the cylinder is pressurised. Seal makers publish the extrusion gaps their seals and back-up rings tolerate at each pressure, and the bore growth belongs in that comparison. A thin-wall estimate would have found almost the same growth here, but for a thick cylinder at high pressure the strain at the bore is set by the Lamé stresses there, not by an average.

## Pressure from outside

Lamé's solution also covers a cylinder pressed from outside, by a hub shrunk onto it, by water at depth or by a surrounding casting. Then both the hoop and radial stresses are compressive, and the largest hoop compression is again at the bore, at twice the external pressure times ro² ÷ (ro² − ri²). For a solid shaft, with no bore, the hoop and radial stresses are both equal to minus the external pressure everywhere. That difference, between a solid and a hollow inner member, is the subject of the most important check in Chapter 9: a hub shrunk onto a hollow spindle squeezes its bore much harder than the same hub on a solid shaft.

## Codes and the limits of elastic theory

Lamé's equations give the elastic stress in an ideal cylinder, away from its ends. Real cylinders have end caps, ports, threads and welds, each of which raises local stress, and real pressure equipment must meet the design rules of its code. In Australia, AS 1210 covers the design of pressure vessels, and hydraulic cylinders are generally designed to the maker's standards and test pressures. Those codes set allowable stresses, required thicknesses and test pressures that this book does not reproduce. The value of Lamé's solution is in understanding why the code's rules look the way they do, and in checking a design's stress state, not in replacing them.

```figure
type: checklist
title: Before trusting a thick-wall result
caption: The RH-40 chuck review. This is an illustration.
- x Bore stress taken by Lamé, not by a thin-wall formula
- x End condition, closed or open, matched to how the caps are held
- x Radial stress at the bore included in the equivalent stress
- x Ports, cross-drillings and thread runouts treated as stress concentrations
- ? Pressure rating and test pressure confirmed against the applicable code or maker's standard
```

## Exercise: a smaller chuck cylinder

A compact version of the RH-40 chuck uses a 100 mm bore with a 15 mm wall at the same 21 MPa, closed ends and the same 460 MPa tube. Find the Lamé hoop stress at the bore, the axial stress, the von Mises stress at the bore and the safety factor. What does the thin-wall formula with the mean diameter give, and how far off is it?

**Worked answer.** ri = 50 mm and ro = 65 mm, so ro² = 4,225 mm², ri² = 2,500 mm² and ro² − ri² = 1,725 mm². The bore hoop stress is 21 × (4,225 + 2,500) ÷ 1,725 = 81.87 MPa, the axial stress 21 × 2,500 ÷ 1,725 = 30.43 MPa and the radial stress −21.00 MPa.

The von Mises stress is √{½ × [(81.87 + 21.00)² + (−21.00 − 30.43)² + (30.43 − 81.87)²]} = 89.09 MPa, and the safety factor 460 ÷ 89.09 = 5.16. The thin-wall formula with the mean diameter of 115 mm gives 21 × 115 ÷ 30 = 80.50 MPa, 1.7% below the Lamé value. The wall is 15% of the bore, so the tool would flag it as thick. This is an illustration.
