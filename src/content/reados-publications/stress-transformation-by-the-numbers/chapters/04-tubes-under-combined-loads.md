---
book: stress-transformation-by-the-numbers
chapterSlug: tubes-under-combined-loads
order: 4
title: "Tubes under pressure, thrust and torque"
description: "How to check a thin-walled tube or hollow shaft under pressure, axial load and torque together, what the pressurised tube tool leaves out, and how to add bending and exact torsion."
draft: false
---

Hollow shafts, hydraulic tubes, drill rods, torque tubes and pressure lines all share a stress pattern. Internal pressure pulls the wall around its circumference and along its length, an axial load adds to the length direction, and torque shears it. The three combine into a plane stress state on the wall that can be checked in a few lines, as long as the assumptions behind the formulas still hold.

This chapter puts the RH-40 spindle through the WORKOS pressurised tube tool, then shows what that tool does not include, and how a first answer that looked comfortable turned out to be 20% light. It also uses the thin tube torsion tool to compare the thin-wall torsion formula with the exact one.

## The thin-walled tube

A tube is thin-walled when its wall is small compared with its diameter. Then the hoop stress from pressure is nearly even across the wall, and the shear stress from torque is nearly even too, so each can be described by one number at the mid-wall. The usual working limit is a wall no thicker than about a tenth of the outside diameter. Beyond that, the stresses vary across the wall enough to matter, and the thick-wall solution of Chapter 5 is needed.

```figure
type: formula
title: Stresses in a closed thin-walled tube under pressure, axial load and torque
formula: σhoop = p Dm ÷ 2t
formula: σaxial = p Dm ÷ 4t + N ÷ (π Dm t)
formula: τ = 2T ÷ (π Dm² t)
caption: Dm is the mean diameter, outside diameter minus wall thickness. The axial pressure term assumes closed ends whose pressure load the wall carries. N is positive in tension. The shear is the thin-wall value at the mid-wall, from Bredt's formula for a round tube.
- p | internal pressure, MPa
- t | wall thickness, mm
- N | axial load, N
- T | torque, N·mm
```

Three points about these formulas cause most errors.

**Closed or open ends.** The axial pressure term is there only if the tube's ends are closed in the sense that the pressure's end thrust is carried by the wall. A pipe with a closed cap is; a hydraulic cylinder barrel is, along its length, through the end caps and tie rods or welds; a tube whose end thrust is taken by an external anchor or a sliding seal may not be. The RH-40 spindle counts as closed: the swivel seal at the top and the rod string below hold the water in, and the thrust on them passes through the spindle.

**Mean diameter.** The formulas use the mean diameter. Using the outside diameter overestimates the stresses slightly; using the bore underestimates them. For the RH-40, Dm = 81 mm.

**Thin-wall torsion.** The shear formula spreads the torque evenly across the wall. In a real tube the shear rises linearly from the bore to the outside, so the outer surface carries more than the average. Later in this chapter that difference is put in numbers.

## The pressurised tube tool

The [pressurised tube under torsion tool](/tools/pressure-tube-torsion-check/) takes the outside diameter, wall thickness, internal pressure, axial load, torque, yield strength and required safety factor. It calculates the three stresses above, finds the principal stresses with the same method as the principal stress tool of Chapter 3, and reports the von Mises equivalent stress and the safety factor. It also checks the thin-wall assumption, passing walls up to a tenth of the outside diameter and warning above that.

```figure
type: steps
title: The RH-40 spindle in the pressurised tube tool, pullback case
caption: This is an illustration. Outside diameter 90 mm, wall 9 mm, 7 MPa, 120 kN tension, 6,500 N·m, yield strength 650 MPa, required factor 2.0.
- Hoop and axial stress | 31.5 MPa and 68.1 MPa
- Shear stress from torque | 70.1 MPa
- Principal stresses | 122.3 MPa and −22.6 MPa, at 37.7° from the axis
- Maximum shear | 72.4 MPa
- * von Mises stress and safety factor | 135.0 MPa; 4.82: TUBE ADEQUATE
- Thin-wall check | wall 9 mm = a tenth of 90 mm: within the limit
```

For the drilling case, with the axial load entered as −40 kN, the tool gives an axial stress of −1.7 MPa, principal stresses of 86.9 MPa and −57.1 MPa at 51.7°, a von Mises stress of 125.6 MPa and a safety factor of 5.17. Pullback governs.

The thin-wall check sits right on the limit. The RH-40 wall is exactly a tenth of the outside diameter, so the tool passes it, but a 10 mm wall would trip the warning. That is not a cliff: the thin-wall answers drift gradually away from the exact ones as the wall thickens. Chapter 5 shows how far.

## What the tool leaves out

The tool's limitations state that it applies away from ends, ports and welds, and its inputs show what it does not take: there is no bending moment, and the shear is the thin-wall average. For a straight pressure line with an axial load and a torque, that is the whole story. For the RH-40 spindle at its gear seat, two pieces are missing.

### Bending

The gear mesh puts 2,000 N·m of bending on the spindle at the gear seat, adding ±47.33 MPa to the axial stress at the outer fibres (Chapter 1). The tool has no input for it. Entering it as an extra axial load would be wrong, because an axial load spreads the stress evenly while bending concentrates it at the outer fibre and changes its sign across the section. The correct route is to add the bending stress to the axial stress at the worst fibre by hand and put the resulting element into the principal stress tool.

### The exact torsion stress

The thin-wall shear is 70.08 MPa. The exact shear at the outer surface of a 90 × 72 mm tube is T r ÷ J = 76.91 MPa, about 10% higher, and at the bore 61.53 MPa. Because the outer surface also carries the bending stress, the outside is where the worst point lies, and the exact value belongs there.

The [thin tube torsion tool](/tools/thin-tube-torsion/) shows the size of the difference for the round section. It uses Bredt's formula for closed thin-walled sections, with the enclosed mid-line area Am = π × 81² ÷ 4 = 5,153 mm².

```figure
type: compare
title: Torsion of the RH-40 spindle: thin-wall formula against exact
cols: Shear stress, MPa | Torsion constant, mm⁴ | Twist over 1 m, °
rowhead: Method
- Thin tube torsion tool, Bredt | 70.08 | 3,756,535 | 1.247
- * Exact, outer surface | 76.91 | 3,802,912 | 1.232
- Exact, bore | 61.53 | 3,802,912 | 1.232
caption: This is an illustration. 6,500 N·m, G = 79.5 GPa. Bredt's formula gets the stiffness within about 1%, because it depends on the average shear, but underestimates the peak surface stress by 9%.
```

The pattern is general for thin-wall formulas. They are good for quantities that depend on averages, such as stiffness and twist, and less good for peak stresses, which sit at a surface.

## The mistake: a tool answer taken as the whole answer

The RH-40's first design note checked the gear seat with the pressurised tube tool alone and recorded a safety factor of 4.82 against yield. A reviewer, working down the list of loads in Chapter 1, found the bending moment missing and asked where the shear value had come from. Adding the two corrections in turn shows how much each mattered.

```figure
type: compare
title: The same point checked four ways, pullback case
cols: σx, MPa | σy, MPa | τxy, MPa | von Mises, MPa | Safety factor
rowhead: Method
- Tube tool alone: thin-wall shear, no bending | 68.15 | 31.50 | 70.08 | 134.99 | 4.82
- Exact outer shear, no bending | 68.15 | 31.50 | 76.91 | 145.72 | 4.46
- * Exact outer shear, bending tension side | 115.48 | 31.50 | 76.91 | 168.63 | 3.85
- As above, thick-wall pressure stresses at the outside | 112.17 | 24.89 | 76.91 | 167.79 | 3.87
caption: This is an illustration. Yield strength 650 MPa. The last row uses the Lamé values of Chapter 5 for the outer surface: hoop 24.89 MPa and axial 12.44 MPa from pressure.
```

The corrected factor is 3.85, 20% lower than the first answer. That was still above the required 2.0, so the spindle stood, but the fatigue check that followed starts from these stresses, and there a 20% error in the stress can mean a factor of several in life. The last row shows the opposite effect: the thick-wall pressure stresses at the outer surface are lower than the thin-wall ones, and they change the answer by less than 1%. For the RH-40 spindle the bending was the big omission; the wall thickness was not.

The general lesson is to read a tool's inputs as a list of what it includes. A load that has no input box is a load the tool does not see.

```figure
type: checklist
title: Using a tube tool for a hollow shaft
caption: The RH-40 reviewer's checklist. This is an illustration.
- x Every load on the section has an input, or is added by hand
- x Bending added at the worst fibre, not entered as axial load
- x Shear taken at the surface being checked, not only at the mid-wall
- x Ends closed or open, as the real assembly carries the pressure thrust
- x Wall within the thin-wall limit, or the thick-wall check run as well
- x Section away from ports, shoulders and welds, or a stress concentration applied
```

## Open ends: when the wall does not carry the thrust

The closed-end assumption deserves its own check, because it can move the answer either way. Suppose a later RH-40 design took the water in through a floating seal that let the pressure's end thrust react against the head's housing instead of the spindle. The spindle's wall would then carry the hoop stress but not the 15.75 MPa axial pressure stress.

At the gear seat in pullback, on the bending tension side, the element would become σx = 52.40 + 47.33 = 99.73 MPa, σy = 31.50 MPa and τxy = 76.91 MPa. Its principal stresses are 149.75 MPa and −18.52 MPa, its von Mises stress 159.82 MPa and its safety factor 4.07, a little better than the closed-end 3.85, because a smaller axial stress brings σx closer to σy. The thrust has not vanished: it has moved to the housing and its bolts, which then need their own check. Under a different combination, such as a tube in axial compression, removing the pressure's axial tension can make things worse, so the end condition must match the hardware, not the most convenient formula.

### Very thin tubes

The RH-40 spindle has a diameter-to-thickness ratio of 10, which is stocky. Tubes with ratios of 50 or more, such as thin-walled torque tubes, drive shafts and ducting, can buckle in torsion by wrinkling into a helical pattern at a shear stress well below yield, and a thin tube under axial compression can buckle locally in the same way. Neither the tube tool nor the transformation equations sees that: they describe the stress in a wall that keeps its shape. A thin tube carrying torque or compression needs a separate stability check from a buckling reference or a code.

## Which point on the wall?

A tube's wall has two surfaces, and they see different stresses. On the outside, the bending stress is largest, the torsion shear is largest and, under internal pressure, the hoop stress is smallest. At the bore, the bending and torsion stresses are smaller, the hoop stress is largest, and the water pressure itself acts as a third stress perpendicular to the surface.

For the RH-40 spindle, the outside governs: its von Mises stress of about 168 MPa compares with about 123 MPa at the bore without bending (Chapter 6 works the bore as a three-dimensional state). For a thick hydraulic tube under high pressure and modest torque, the bore would govern instead. The way to know is to check both.

## How much torque could the spindle take?

A tube check is also a quick way to explore a design's margins. Holding the pressure at 7 MPa and the pullback at 120 kN, and raising the torque in the tube tool, gives the safety factors below. They do not include bending, so they are upper bounds for the gear seat.

```figure
type: bars
title: Tube tool safety factor against torque, RH-40 spindle in pullback
x: Torque, N·m
y: Safety factor against yield
caption: This is an illustration. Thin-wall method without bending; the factor at the gear seat is lower, as the table above shows. The required factor is 2.0.
- * 6,500 | 4.82
- 9,000 | 3.65
- 12,000 | 2.80
- 15,000 | 2.27
```

Even at more than twice its rated torque the spindle's tube section is clear of yield. That is typical of a part whose design is governed by fatigue and stiffness, and it is useful to know when a drill string jams and the hydraulic relief setting, not the spindle's strength, limits the torque. A jam that drives the torque past the relief setting, through inertia, is a separate question about energy, not about this static check.

## Pressure lines on the same rig

The tube tool's natural home is a straight, pressurised line. The RH-40 carries several: the flushing water line, the hydraulic lines to the rotation motors and the chuck. For a hydraulic line with no torque and no axial load beyond its own pressure thrust, the tool reduces to the familiar hoop and axial stresses and gives the principal stresses directly as the hoop and axial values, with no shear. Its thin-wall warning is the useful part for small high-pressure tubing, where walls of a sixth or a seventh of the diameter are common and the thick-wall stresses of Chapter 5 are a little higher than the thin-wall ones.

Pressure equipment such as hydraulic accumulators and receivers falls under its own design code and registration rules, and fittings and hoses under their makers' ratings. A tube check of this kind is a way to understand those ratings, not to replace them.

## Recording the check

The RH-40 design file now records the gear seat check in three lines that anyone can repeat: the tube tool's run with its inputs, for the pressure, pullback and torque stresses; the hand addition of the bending stress at the tension fibre and the exact outer-surface shear; and the principal stress tool's run on the corrected element, with its safety factor of 3.85. Each line names its assumptions: closed ends, the section away from the shoulder, elastic behaviour. When the gear supplier later changed the tooth geometry and the bending moment rose, only the second and third lines had to be repeated.

## Exercise: a thicker spindle wall

A proposal for a heavy-duty version of the RH-40 keeps the 90 mm outside diameter but reduces the bore to 70 mm, a 10 mm wall, and raises the pullback to 150 kN. With 7 MPa and 6,500 N·m, what do the thin-wall formulas give for the hoop, axial and shear stresses? What does the tube tool's thin-wall check say, and how much does the extra wall reduce the shear at the outer surface by the exact formula?

**Worked answer.** The mean diameter is 80 mm. Hoop: 7 × 80 ÷ 20 = 28.0 MPa. Axial: 7 × 80 ÷ 40 + 150,000 ÷ (π × 80 × 10) = 14.0 + 59.68 = 73.68 MPa. Thin-wall shear: 2 × 6,500,000 ÷ (π × 80² × 10) = 64.66 MPa. The wall is 10 mm against a limit of 9 mm, so the tool warns that the thick-wall equations should be used.

The exact polar moment of the 90 × 70 mm section is π × (90⁴ − 70⁴) ÷ 32 = 4,084,070 mm⁴, so the outer surface shear is 6,500,000 × 45 ÷ 4,084,070 = 71.62 MPa, against 76.91 MPa for the 9 mm wall: a reduction of 6.9%. The thin-wall shear of 64.66 MPa understates it by about 10%, as before. This is an illustration.
