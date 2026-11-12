---
book: industrial-hydraulics-by-the-numbers
chapterSlug: check-the-barrel-end-caps-and-frame
order: 3
title: "Check the barrel, end caps and frame"
description: "Check a press cylinder's barrel, end cap and rod at the relief setting, and its tie rods for stress, stretch and nut engagement, with off-centre loads, trapped pressure and a used cylinder."
draft: false
---

A cylinder is a pressure vessel with a moving end, and a press frame is a structure that has to hold that end in place. Both are loaded by the force the relief valve allows, which on this press is 214.8 kN, not the 200 kN rating. They are also loaded by pressures elsewhere in the cylinder that the relief valve never sees. This chapter checks the cylinder's barrel, end cap and rod, then the four tie rods that hold the crosshead to the bed, with the same discipline: start from the highest force or pressure that can occur, state the model, and know what the model leaves out.

The failure case is a second-hand cylinder offered cheaply by a local supplier. It looked right, and its bore and rod matched the design. An ultrasonic thickness reading showed why it should not be used.

## Design for the relief setting

The relief valve is set at 175 bar. At that pressure the cylinder pushes 17.5 MPa × 12,271.8 mm² = **214.8 kN**, and every part in the load path, from barrel to tie rods to bed, must carry that force with its margin. If the relief setting is ever raised, the checks in this chapter must be repeated at the new setting before the valve is touched. The workshop records the relief setting on the press's data plate for exactly this reason.

There is one pressure higher still. Chapter 2 showed that if oil is trapped in the rod end while the cap end is at 175 bar, the rod end can reach about 257 bar because of the area ratio. The barrel between the piston and the gland sees that pressure. A careful design either prevents trapping, or makes sure the barrel, gland and rod-end line can carry it. This press does both, and the barrel is checked at 257 bar below.

## The barrel

A cylinder barrel is a thick-walled tube under internal pressure. A thin-wall estimate, hoop stress equals pressure times radius divided by wall thickness, is quick but underestimates the stress at the bore when the wall is thick compared with the radius. The Lamé equations give the stresses through a thick wall. At the bore, the hoop stress is the pressure times (outer radius² + inner radius²) divided by (outer radius² − inner radius²). With closed ends, as a cylinder has, there is also an axial stress, the pressure times inner radius² divided by (outer radius² − inner radius²), and a radial stress equal to minus the pressure. A failure theory such as von Mises combines the three into one equivalent stress to compare with the material's yield strength.

The press's barrel is honed steel tube, 125 mm bore with a 10 mm wall and an outside diameter of 145 mm, with a specified yield strength of 355 MPa. This is an illustration; real tube is bought to a standard grade with a mill certificate, and its yield strength comes from that certificate.

```figure
type: formula
title: Hoop and axial stress at the bore of the barrel, by Lamé, at 175 bar
formula: hoop = p × (b² + a²) ÷ (b² − a²); axial = p × a² ÷ (b² − a²)
caption: This is an illustration. a is the inner radius and b the outer radius. The thin-wall estimate, p × a ÷ t, gives about 109 MPa, which is about 8% low at the bore.
- Pressure, p | 17.5 MPa
- Inner radius, a | 62.5 mm
- Outer radius, b | 72.5 mm
step: b² − a² = 5,256.25 − 3,906.25 = 1,350 mm²
step: hoop at the bore = 17.5 × 9,162.5 ÷ 1,350 = 118.8 MPa
step: axial = 17.5 × 3,906.25 ÷ 1,350 = 50.6 MPa
```

The [Hydraulic Cylinder Structure tool](/tools/hydraulic-cylinder-structure/) does this check. It takes the bore, wall thickness, working pressure, barrel yield strength and required safety factor, the elastic modulus and Poisson's ratio, the end cap thickness and its allowable stress, and the rod's diameter, buckling length, effective length factor, yield strength and required buckling safety factor. It returns the barrel's hoop and axial stresses at the bore, the von Mises stress and safety factor, the least wall for the required factor, the bore's expansion under pressure, the end cap thickness needed as a clamped flat plate, the push force, and the rod's slenderness, buckling mode and safety factor.

```figure
type: compare
title: Cylinder structure check at the relief setting and at the trapped rod-end pressure
cols: At 175 bar | At 257 bar
caption: This is an illustration. Same barrel, end cap and rod in both columns: 125 mm bore, 10 mm wall, 355 MPa yield, required factor 2; 40 mm cap, 150 MPa allowable; 70 mm rod, 700 mm, factor 0.7, 500 MPa yield. The 257 bar column checks the barrel only, because only the rod end reaches that pressure.
- Hoop / axial stress at the bore | 118.8 / 50.6 MPa | 174.4 / 74.4 MPa
- Von Mises stress and safety factor | 118 MPa, 3.01 | 173.3 MPa, 2.05
- Least wall for a factor of 2 | 6.13 mm | 9.71 mm
- Bore expansion on diameter | 66 µm | larger, in proportion
- *Governing case | the push force | the trapped rod-end pressure
```

At the relief setting the barrel has a safety factor of 3.01, and would need only 6.13 mm of wall for a factor of 2. At the trapped rod-end pressure the factor falls to 2.05, and the wall needed rises to 9.71 mm. The 10 mm wall was chosen because of that second case. A designer who checked only the relief setting would have accepted a 7 mm wall and lost the margin against intensification.

### Bore expansion and seals

Under 175 bar the bore grows by about **66 µm** on diameter. That sounds trivial, but a piston seal works by being squeezed into a small gap, and if the barrel balloons too much the gap opens and the seal extrudes or leaks. The tool flags this as a check against the seal maker's data rather than a pass. For a press it is usually acceptable; for a high-pressure cylinder with a thin wall it can govern.

## The end cap

Each end of the barrel is closed by a cap that carries the full pressure over its area. The tool treats the cap as a flat circular plate clamped at its edge, a simplification that suits a cap welded or bolted firmly to the barrel. At 175 bar, with an allowable stress of 150 MPa, it needs about **18.5 mm**. The press's caps are **40 mm** thick and the stress in them is about 32 MPa.

The difference is not waste. The cap carries ports, the gland's threads and seals, and mounting features, all of which remove material and add stress concentrations that a flat-plate model does not see. The 18.5 mm figure is a floor for the plate action alone. The maker's design, which includes the ports and threads, is what decides the real thickness.

## The rod, for a short and stocky column

Chapter 2 sized the rod for buckling by Euler's formula and found a minimum of 36 mm. Euler's formula is correct for long, slender columns, which buckle elastically. Short, thick columns fail differently: they start to yield before they buckle, and Euler then overestimates their strength. Slenderness, the effective length divided by the radius of gyration, tells which regime applies. For a solid round rod, the radius of gyration is a quarter of the diameter.

- effective length = 0.7 × 700 = 490 mm
- radius of gyration = 70 ÷ 4 = 17.5 mm
- slenderness = 490 ÷ 17.5 = **28**

A slenderness of 28 is low. For a rod with a yield strength of 500 MPa it falls in the range where the Johnson parabola, which blends yield and buckling, is the right model. The structure tool picks the method itself, reports "Johnson", and gives a buckling safety factor of **8.53** against the required 3.5. Euler alone would have given a far larger, and misleading, figure: about 9,980 kN for the ideal critical load, more than 46 times the push force.

The lesson is general. A buckling result is only as good as the model behind it, and a tool that reports which model it used is telling you something worth reading.

## The tie rods

The press is a four-post frame. The cylinder is flanged to a top crosshead, the work sits on a bed, and four tie rods with nuts above the crosshead and below the bed hold the two apart. When the cylinder pushes down on the work, it pushes up equally on the crosshead, and the tie rods carry that reaction in tension.

The [Press Tie Rod Check tool](/tools/press-tie-rod-check/) takes the cylinder bore and system pressure, the number of rods, their thread size and pitch, the length between nuts and modulus, an allowable thread stress, a largest acceptable stretch, the nut height and the tensile strengths of rod and nut. It returns the press force and load per rod, the thread's tensile stress area and stress, the elastic stretch of each rod, and the nut length needed so the threads do not strip.

```figure
type: steps
title: Press Tie Rod Check for four M30 rods at 175 bar
caption: This is an illustration. Rods are M30 × 3.5, 900 mm between nuts, modulus 200 GPa, tensile strength 800 MPa for rods and nuts, allowable thread stress 200 MPa, 30 mm nuts. The tool assumes the four rods share the load equally.
- Press force | 17.5 MPa × 12,271.8 mm² = 214.8 kN
- Load per rod | 214.8 ÷ 4 = 53.7 kN
- Thread stress area | 560.6 mm² for M30 × 3.5
- * Thread stress | 53.7 kN ÷ 560.6 mm² = 95.8 MPa, against 200 MPa allowed
- Stretch | 0.342 mm over 900 mm, against 1 mm allowed
- Nut engagement | 18.2 mm needed, 30 mm fitted
```

All three checks pass with margin. The stretch matters for the press's accuracy as well as its strength: at full force the crosshead lifts about a third of a millimetre relative to the bed, so the platen's final position on a part depends a little on the force. For a bush press that is irrelevant. For a press that stamps to a depth, it would matter.

### When the load is off-centre

The tool assumes the load is on the centreline, so the four rods share it equally. Real work is not always central. If the load acts at an offset from the centre, the rods on that side carry more.

The press's rods are at the corners of a 450 mm square. For an offset along one side, the two rods on that side each gain the moment divided by twice the distance between the two pairs:

- extra load per rod = 214.8 kN × 100 mm ÷ (2 × 450 mm) = **23.9 kN** for a 100 mm offset
- most heavily loaded rods: 53.7 + 23.9 = **77.6 kN**, a thread stress of about 138 MPa

For the same offset along a diagonal, one rod gains 214.8 × 100 ÷ (2 × 318.2) = **33.8 kN**, reaching about 87.4 kN and 156 MPa. Both are still inside the 200 MPa allowable, but the margin has gone from about two to about 1.3. The workshop painted a 100 mm circle on the bed and a rule that all pressing is done inside it.

### Fatigue and pre-tension

On the contract job the press cycles about 80 times an hour. Over a year of single-shift work that is well over a hundred thousand load cycles on each tie rod, and threads are notches that concentrate stress. Fatigue, not static strength, then governs. Two measures help: rolled threads, which have a smoother root and compressive surface stress, and tightening the nuts to a pre-tension so that the rods carry a steady load with a smaller fluctuation on top. [Fatigue of bolted joints](/reados/publications/bolted-joints-by-the-numbers/fatigue-of-bolted-joints/) explains why pre-tension reduces the stress range, and [Bolted joints](/reados/publications/metal-fatigue-by-the-numbers/bolted-joints/) in *Metal Fatigue by the Numbers* shows how to check the result. The tie rod tool flags fatigue as a check to verify, not a pass.

### What the tools do not check

Neither tool checks the crosshead or the bed. Both are thick plates loaded by the cylinder in the middle and supported by the tie rods at the corners, and they bend. A bending check, with the holes for the rods and the cylinder taken into account, is needed for each. The workshop had its crosshead and bed checked by a structural engineer, who also looked at the welds holding the cylinder's mounting flange. That is the right division of work: the tools cover the hydraulic and threaded parts, and a competent person signs off the structure.

## A failure case: the second-hand cylinder

This is an illustration. Before the new cylinder was ordered, a local supplier offered a used 125 mm × 70 mm cylinder from a decommissioned machine at about a third of the new price. Bore, rod and stroke matched. The owner was keen.

The designer asked for the barrel's wall thickness and material. Neither was known; the cylinder had no data plate. An ultrasonic thickness gauge gave a wall of about **6 mm**, not 10 mm. Run through the structure tool at 175 bar with an assumed yield of 355 MPa, a 6 mm wall gives a von Mises stress of about 181 MPa and a safety factor of **1.96**, already below the required 2 at the relief setting, and much lower at the trapped rod-end pressure. With the material unknown, even that figure was a guess.

The detection was the habit of checking a cylinder's barrel before accepting it, with a measured wall rather than an assumed one. The correction was to buy the new cylinder, with a 10 mm wall in a certified grade and a maker's pressure rating above 257 bar on the rod end. The used cylinder went to a low-pressure application where its rating could be established by the supplier.

## How this applies to a small Australian business

Check every part in the load path at the force the relief valve allows, and record that setting where the next person will see it. Remember that the rod end of a cylinder can see more than the relief pressure, and size the barrel and gland for it or prevent it. Read which buckling model a result uses; a stocky rod needs Johnson, not Euler. Treat tie rods as tension members that also need checks for off-centre loads and fatigue, and get the crosshead and bed checked by someone competent in structures. Never fit a cylinder whose wall and material are unknown.

## Exercise: smaller tie rods

To save cost, someone proposes **M24 × 3** tie rods instead of M30, with 24 mm nuts, everything else the same. Do they pass the [Press Tie Rod Check](/tools/press-tie-rod-check/) at 175 bar? What happens to the most heavily loaded rod with the 100 mm diagonal offset?

**Worked answer.** The tool gives a thread stress area of **352.5 mm²**, a thread stress of 53.7 kN ÷ 352.5 mm², about **152.3 MPa**, against 200 MPa; a stretch of **0.534 mm** against 1 mm; and a nut engagement of 14.4 mm needed against 24 mm fitted. All three pass on the centreline. With the 100 mm diagonal offset, the worst rod carries 53.7 + 33.8 = **87.4 kN**, a stress of 87,400 ÷ 352.5, about **248 MPa**, which exceeds the 200 MPa allowable. The M24 rods are acceptable only if every load is kept central, which cannot be guaranteed on a repair press. The M30 rods stay.
