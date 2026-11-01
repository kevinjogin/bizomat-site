---
book: stress-transformation-by-the-numbers
chapterSlug: interference-fits-on-hollow-shafts
order: 9
title: "Interference fits on hollow shafts"
description: "How a hub shrunk onto a shaft creates pressure and stress in both parts, how to design the fit from the torque, why a hollow shaft's bore needs checking, and how to check the limits."
draft: false
---

A gear, pulley or coupling hub can be fixed to a shaft by making its bore slightly smaller than the shaft and forcing the two together, by pressing or by heating the hub until it slides on and letting it shrink. The squeeze between them, the interference, produces a contact pressure, and friction at that pressure carries torque and thrust with no key, spline or fastener. It is a clean, strong joint, and it is a pure application of this book's methods: Lamé's thick cylinders from Chapter 5, joined by the condition that the two parts fit together.

This chapter designs the shrink fit for the RH-40's drive gear on its hollow spindle, using three WORKOS tools. The tools check the hub; the chapter's mistake shows what happens when nobody checks the shaft.

## Pressure from interference

Before assembly, the hub bore is smaller than the shaft by the diametral interference δ. After assembly they share one diameter at the interface, so the hub has grown and the shaft has shrunk, and together the two changes add up to δ. Each change depends on the contact pressure through Lamé's equations, the hub as a cylinder under internal pressure and the shaft as a cylinder under external pressure. Solving the fit condition for the pressure gives the central formula of interference fit design.

```figure
type: formula
title: Contact pressure in an interference fit, same material
formula: p = δ ÷ { d × [ (Kh + ν) ÷ E + (Ks − ν) ÷ E ] }
formula: Kh = (D² + d²) ÷ (D² − d²),  Ks = (d² + di²) ÷ (d² − di²)
formula: hub bore hoop stress = p × Kh;  hollow shaft bore hoop stress = −2p d² ÷ (d² − di²)
caption: d is the interface diameter, D the hub's outside diameter and di the shaft's bore (zero for a solid shaft, which makes Ks = 1). Different materials use their own E and ν in each term. Holding torque = μ p π d² L ÷ 2, with L the engaged length and μ the friction coefficient.
- Hub | tensile hoop stress, largest at its bore
- Solid shaft | uniform compression −p in every radial direction
- Hollow shaft | compressive hoop stress, largest at its bore
```

The last line matters most for this chapter. A solid shaft under external pressure is compressed evenly to −p. A hollow shaft behaves like an arch: the compression concentrates at its bore, and the thinner the wall, the more it concentrates. For the RH-40 spindle, with d = 90 mm and a 72 mm bore, the bore hoop stress is −5.56 times the contact pressure.

## Designing the fit from the torque

The RH-40's drive gear must carry the spindle's maximum torque of 6,500 N·m by friction alone, with a safety factor on slip of 1.5. Its hub is 160 mm in outside diameter and 80 mm long on the 90 mm seat, in a quenched and tempered gear steel with a yield strength of 550 MPa. For a shrink fit of clean, dry steel, the builder takes a friction coefficient of 0.15. This is an illustration.

The [shrink fit design tool](/tools/shrink-fit-design/) works backwards from the duty: from the torque and slip factor to the pressure needed, from the pressure to the interference by Lamé's equations for a solid or hollow shaft, and then to the hub's bore stresses with a von Mises check, the press-in force and the hub temperature for a shrink fit with an assembly clearance.

```figure
type: steps
title: The RH-40 gear fit in the shrink fit design tool, 72 mm spindle bore
caption: This is an illustration. 6,500 N·m, slip factor 1.5, d = 90 mm, di = 72 mm, D = 160 mm, L = 80 mm, μ = 0.15, both parts E = 205 GPa and ν = 0.29, hub yield 550 MPa, expansion 11.5 µm/(m·K), assembly clearance 0.03 mm, ambient 20 °C.
- Required interface pressure | 63.86 MPa
- * Required diametral interference | 181.7 µm
- Hub hoop and von Mises stress at its bore | 123.0 MPa and 164.5 MPa: FIT FEASIBLE
- Press-in force | 216.7 kN
- Hub temperature for shrinking on | 225 °C
```

The hub is comfortable, with a factor of 3.34 against its yield strength, and 225 °C is an ordinary heating temperature for a steel gear in an oven or on an induction heater, below the tempering temperatures of most quenched and tempered steels. The tool says the fit is feasible, and for the hub it is.

## The mistake: nobody checked the spindle

The first design note stopped there. At the drawing review, the spindle's designer asked what 63.86 MPa of external pressure did to a tube with a 9 mm wall.

The hollow shaft formula answers it: the hoop stress at the spindle's bore is −2 × 63.86 × 90² ÷ (90² − 72²) = −354.8 MPa, a compression of more than half the spindle steel's 650 MPa yield strength from the fit alone, before any service load. In service, the bore under the gear also carries the water pressure, the torque's shear, the pullback and the bending. Combining them as in Chapter 6, the bore state is a hoop stress of −322.9 MPa (the fit's compression less the water's Lamé hoop tension of 31.89 MPa), an axial stress of 102.71 MPa, a radial stress of −7.00 MPa and a shear of 61.53 MPa. Its von Mises stress is 397.3 MPa, a safety factor of 1.64 against the required 2.0.

```figure
type: compare
title: Stresses from the gear fit, 72 mm spindle bore, minimum required interference
cols: Hoop stress, MPa | von Mises, MPa | Safety factor
rowhead: Location
- Hub bore | 123.0 | 164.5 | 3.34 on 550 MPa
- Spindle outside, at the interface, fit alone | −290.9 | 264.8 | 2.45 on 650 MPa
- * Spindle bore, fit alone | −354.8 | 354.8 | 1.83 on 650 MPa
- Spindle bore, fit and pullback | −322.9 | 397.3 | 1.64 on 650 MPa
caption: This is an illustration. Contact pressure 63.86 MPa, the least that carries the torque with a slip factor of 1.5. Real fits have a tolerance band, and the most interference in that band would make the spindle bore worse still.
```

And this was the minimum interference that would carry the torque. Every real fit has a tolerance band, and the tightest pair of parts in that band would squeeze harder. The fit as designed would overstress its own shaft.

The tools had not been wrong. Their outputs and limitations describe the hub's stresses, and the shrink fit design tool takes the shaft's bore only to work out how much the shaft deflects under the pressure. The review question, which part is the weaker cylinder, belonged to the engineer.

## Thickening the wall under the gear

The RH-40 team had three options: carry the torque another way, such as a spline or a keyed fit, with a lighter interference only to locate the gear; use a shorter, thicker gear seat; or make the spindle wall thicker under the gear. The flushing water needs a free bore, but not a 72 mm one along the whole spindle, so the bore was stepped down to 50 mm for the length of the gear seat and a little beyond, with a generous taper at each end of the step.

With di = 50 mm, the spindle's factor Ks drops from 4.56 to 1.89. The same 63.86 MPa now needs only 107.1 µm of interference, the hub heating falls to 152 °C, and the spindle bore's hoop stress from the fit is −2 × 63.86 × 8,100 ÷ 5,600 = −184.7 MPa, little more than half the previous value.

## Checking the fit over its limits

A designed interference is a pair of tolerances, a hole and a shaft, and the joint must work at both ends of the band. At the least interference, the loosest pair of parts must still carry the torque with its slip factor. At the most, the tightest pair must not overstress the hub, or here the spindle.

The [interference fit limits tool](/tools/interference-fit-limits-check/) works out the hole and shaft tolerances from their IT grades for the size, using the international tolerance system of ISO 286-1, with a basic hole and a shaft lower deviation that the user chooses. It then gives the least and most interference, the pressure and holding torque at the least against the torque times the slip factor, the hub stress and safety factor at the most, and the press-in force and heating at the most.

```figure
type: steps
title: The RH-40 gear fit in the interference fit limits tool, 50 mm spindle bore
caption: This is an illustration. Hole IT7, shaft IT6, shaft lower deviation +150 µm, the same geometry and materials, required hub factor 1.5, torque 6,500 N·m, slip factor 1.5.
- Hole and shaft limits | hole 0 to +34.8 µm; shaft +150.0 to +171.7 µm
- Least and most interference | 115.2 µm and 171.7 µm
- Pressure at least and most | 68.7 MPa and 102.4 MPa
- Holding torque at least interference | 10,495 N·m against 9,750 N·m required
- Hub at most interference | von Mises 264 MPa, factor 2.08
- * Assembly at most | press force 347.6 kN, or heating 195 K above ambient: FIT WORKS OVER ITS LIMITS
```

The spindle's bore needs the same check at the most interference, by hand. With 102.4 MPa of contact pressure, the fit alone gives a bore hoop stress of −296.3 MPa. In service, with the water's Lamé hoop tension of 13.25 MPa at the 50 mm bore, the torque's shear of 27.88 MPa at that radius, and an axial stress of 47.57 MPa from the water's end thrust, the pullback and the bending, the von Mises stress at the bore is 310.8 MPa and the safety factor 2.09. The stepped bore passes, narrowly, and the review recorded that the fit's upper limit, not its nominal value, sets the spindle's margin.

```figure
type: bars
title: Spindle bore safety factor under the gear, pullback with the fit
x: Design
y: Safety factor against 650 MPa
caption: This is an illustration. The required factor is 2.0. The stepped bore design is checked at the most interference of its IT7/IT6 fit.
- 72 mm bore, least interference that grips | 1.64
- 50 mm bore, least interference of the fit | 3.00
- * 50 mm bore, most interference of the fit | 2.09
```

## Assembly and the press fit tool

The [press and shrink fit tool](/tools/press-fit/) runs the forward calculation for any one interference, which is useful for the assembly instructions. At the middle of the tolerance band, 143.5 µm, it gives a contact pressure of 85.6 MPa, a hub hoop stress of 164.8 MPa, a holding torque of 13,067 N·m, an axial holding force of 290.4 kN and a hub temperature rise of 168 K to assemble with 0.03 mm clearance. The tool's checks remind the user to repeat the calculation at both ends of the tolerance band and that the heating temperature is moderate.

Pressing a fit of this size cold would take around 300 kN and risks galling the surfaces, which reduces the effective interference and the holding torque. Shrinking avoids both. The assembly instruction for the RH-40 gear sets the oven to heat the hub to 230 °C, enough for the tightest pair with clearance, specifies a maximum time at temperature, and requires the gear to be pushed against its shoulder and held until it grips.

Heating also changes the hub's size permanently if it is overdone. A quenched and tempered gear held above its tempering temperature softens, and an induction heater can overheat the hub's bore while its outside is still cool. The instruction therefore sets a temperature limit as well as a target, with a contact thermometer or temperature crayons as the check.

### What the formulas leave out

The Lamé fit equations assume a hub and shaft of equal length with uniform pressure along the fit. In reality the shaft continues beyond the hub, and the pressure peaks at the hub's ends, where the stiff hub edge bites into the shaft. Those edges are where fretting fatigue cracks start in shafts with press-fitted parts, and the stress concentration there can be large. Relief grooves, a slightly tapered hub bore or a raised seat on the shaft reduce it. Surface roughness also flattens during assembly and takes some of the interference with it, so a fit on rough surfaces grips less than its measured interference suggests.

```figure
type: checklist
title: An interference fit review
caption: The RH-40 review list after the spindle bore finding. This is an illustration.
- x Pressure needed for the torque and thrust, with a slip factor
- x Hub stress at the most interference
- x Shaft stress at the most interference: solid shafts in uniform compression, hollow shafts at the bore
- x Holding torque at the least interference
- x Service stresses added at the hollow shaft's bore
- x Assembly method: press force or heating temperature, with clearance
- ? Fretting at the hub's ends: relief and surface treatment considered for the fatigue check
```

## How much the friction coefficient matters

The holding torque is directly proportional to the friction coefficient, and μ is the least certain number in the calculation. Values quoted for shrink fits on clean, dry steel range from about 0.1 to 0.2 and more, depending on surface finish, cleanliness, whether the surfaces were oiled and whether they were pressed or shrunk. Pressing with lubricant gives lower values than shrinking dry.

For the RH-40 fit at its least interference, the holding torque of 10,495 N·m with μ = 0.15 becomes 8,396 N·m with μ = 0.12, below the 9,750 N·m required, and 13,993 N·m with μ = 0.20. A fit that only just passes at the assumed friction can fail at a slightly lower one. The RH-40 instruction therefore requires the seat and hub bore to be degreased and assembled dry, and the design note records μ = 0.15 as an assumption to be confirmed by a slip test on the first prototype, applying a torque above the working maximum and checking a scribed line across hub and shaft for movement.

## Taking the gear off again

A joint that must be serviced must also come apart. The force to pull the gear off cold is roughly the axial holding force at the actual interference, around 290 kN at the middle of the tolerance band, and pulling it risks scoring both surfaces. Reheating the hub works only if the hub can be heated much faster than the spindle, which is difficult once they are joined. For larger fits, designers often add a small oil groove and a drilled passage to the interface so that oil injected at high pressure can float the hub off, a method widely used on large couplings and bearings. The RH-40 gear was small enough to be removed with a hydraulic puller after induction heating of the hub, and the manual says so, with the expected force.

## The same equations, used on purpose

A hollow shaft crushed by its hub is the fit equations working against the designer. They can also work for the designer. A ring shrunk onto a pressure cylinder puts the cylinder's bore into hoop compression before any pressure is applied, so that the internal pressure first has to undo that compression before it can build tension. That is the compound cylinder mentioned in Chapter 5, and it is how high-pressure pump bodies and extrusion containers raise the pressure their bores can carry beyond the single-cylinder limit. The same compression that was a problem for the RH-40 spindle becomes the point of the design.

## Exercise: a solid spindle for comparison

Suppose a different rig used a solid 90 mm spindle under the same 160 × 80 mm gear hub, with the same steel, friction and torque requirement. What interference would carry 6,500 N·m with a slip factor of 1.5, and what would the shaft's stress be from the fit?

**Worked answer.** The required pressure depends only on the torque, slip factor, friction and geometry of the interface, so it is again 63.86 MPa. For a solid shaft Ks = 1, so the interference is 63.86 × 90 × [(1.93 + 0.29) + (1 − 0.29)] ÷ 205,000 = 63.86 × 90 × 2.926 ÷ 205,000 = 82.0 µm, against 181.7 µm for the 72 mm bore.

The solid shaft is in uniform compression of −63.86 MPa in the hoop and radial directions, a von Mises stress from the fit of 63.86 MPa, less than a fifth of the 72 mm bore's 354.8 MPa. The solid shaft needs less than half the interference and is barely loaded by it; the hollow one needs more than twice the interference and takes most of the squeeze at its bore. This is an illustration.
