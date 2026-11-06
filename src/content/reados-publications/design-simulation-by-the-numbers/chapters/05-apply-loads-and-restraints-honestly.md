---
book: design-simulation-by-the-numbers
chapterSlug: apply-loads-and-restraints-honestly
order: 5
title: "Apply loads and restraints honestly"
description: "Represent bolted supports, motor mass and torque realistically, prove equilibrium with a reaction check and catch loads that were applied several times over."
draft: false
---

Restraints are the least glamorous part of a model and the most influential. The same bracket, meshed identically, can give tip deflections that differ by a third depending only on how its base is held. Loads have the same power: a force applied to the wrong face, in the wrong direction or once per face instead of once in total changes every result while the model still solves without complaint.

This chapter applies the load cases from Chapter 1 to the Revision B model, compares three ways of holding the base plate and introduces the single most valuable check in finite element work: confirming that the reactions balance the applied loads.

## Restraints are part of the structure

A restraint tells the solver that a point, edge or face cannot move in certain directions, no matter how much force it takes to stop it. That is an idealisation of a real support, which always deflects a little. Choosing a restraint is choosing a stiffness for everything outside the model.

For the bracket, everything outside the model is the conveyor frame and four M12 bolts. The frame is a channel with a 10 mm web; the base plate sits flat against it and the bolts pass through both. When the motor's weight pulls the arm down, the top of the base plate tries to lift away from the frame, the bottom edge presses harder against it and the top bolts stretch. That behaviour, called prying, is what a realistic restraint must allow.

## Compare three ways to hold the base plate

This is an illustration. The analyst runs LC2, the 628 N vertical design load, with three different restraint schemes and the same mesh.

```figure
type: compare
title: Three restraint schemes for the base plate under LC2
cols: Fixed back face | Fixed bolt holes only | Bolts plus frame contact
caption: Teaching results for the same mesh. The realistic scheme lies between the two simple ones, and the fixed face is the stiffest.
- What it assumes | Whole plate welded to a rigid wall | Plate held only where bolts pass | Bolts stretch, plate can lift, frame pushes back
- Tip deflection | 0.0548 mm | 0.0702 mm | 0.0612 mm
- Top bolt tension | Not available | Distorted by local singularity | 610 N
- Plate prying shown | No | Exaggerated | Yes
- *Use | Quick lower bound | Avoid | Main model
```

The fixed back face treats the plate as part of an infinitely stiff wall. It cannot pry, so it underestimates deflection and gives no bolt loads at all. Its tip deflection of 0.0548 mm sits just above the fixed-base hand estimate of 0.053 mm, the small difference coming from shear deformation and the end plate.

Fixing only the inside surfaces of the bolt holes lets the rest of the plate float. The plate bends freely between the holes, as if the frame were absent, which overstates its flexibility. The hole surfaces themselves become points of artificially high stress, because a small fixed region must carry all the load. The tip deflection of 0.0702 mm is too high.

The realistic scheme represents each bolt as a connector with the stiffness of an M12 bolt, and represents the frame as a rigid surface that can push on the plate but cannot pull. This is a contact condition, which makes the analysis nonlinear in a small way: the solver must find which part of the plate stays in contact. It gives a tip deflection of 0.0612 mm and bolt tensions that can be checked by hand.

## Check the bolt loads by hand

A simple hand model treats the base plate as rotating about its bottom edge, where it presses hardest against the frame. The bolts resist that rotation in proportion to their distance from the pivot, like the spokes of a lever.

```figure
type: svg
title: Prying of the base plate under the vertical load
alt: Side view of the base plate against the frame. The arm projects to the right and the motor load acts downward at its end. The top of the plate tends to lift from the frame and the bottom edge acts as a pivot. Two bolt rows are shown, the top row 130 mm from the pivot and the bottom row 20 mm from it. Arrows show tension in the top bolts.
caption: The plate pivots on its bottom edge. Bolt tension is proportional to distance from the pivot, so the top bolts carry most of the moment.
viewbox: 0 0 620 320
body:
<rect class="bx" x="70" y="30" width="24" height="270"/>
<text class="tx txs" x="22" y="20">Frame</text>
<rect class="bxa" x="94" y="60" width="16" height="200"/>
<rect class="bxi" x="110" y="130" width="380" height="50"/>
<path class="la draw" pathLength="1" d="M520 140V230"/>
<path class="ah" d="M512 222L520 238L528 222Z"/>
<text class="txa" x="532" y="214">628 N</text>
<path class="ln" d="M60 90H130M60 230H130"/>
<circle class="fi" cx="102" cy="90" r="5"/>
<circle class="fi" cx="102" cy="230" r="5"/>
<text class="tx txs" x="140" y="94">Top bolts, 130 mm from pivot</text>
<text class="tx txs" x="140" y="242">Bottom bolts, 20 mm from pivot</text>
<circle class="fa pulse" cx="102" cy="260" r="6"/>
<text class="txb" x="140" y="282">Pivot at the bottom edge</text>
<path class="ln dsh" d="M110 60L124 64"/>
<text class="tx txs" x="160" y="52">Top of plate tends to lift</text>
<text class="tx txs" x="300" y="122">Moment at the base 157 N·m</text>
```

The base plate is 150 mm tall, so its bottom edge is 75 mm below its centre. The bolt rows are 55 mm above and below the centre, giving distances from the pivot of **75 + 55 = 130 mm** for the top bolts and **75 − 55 = 20 mm** for the bottom bolts. With two bolts in each row, the sum of the squared distances is **2 × 130² + 2 × 20² = 34,600 mm²**. Each top bolt's tension is the moment times its distance over that sum:

**F_top = 157,000 × 130 / 34,600 ≈ 590 N.**

The model's 610 N is within about 3% of the hand value. The difference is plausible, because the real plate also bends between the bolts and its pivot is not exactly at the edge. Both numbers are small compared with the clamping force of a properly tightened M12 bolt, which the bolted joint design check should confirm with the actual bolt grade and tightening method; the BIZOMAT [bolt torque and preload calculator](/tools/bolt-torque-preload/) shows how preload relates to tightening torque.

## Represent the motor as a mass, not a block

The gearmotor's detailed CAD body would add thousands of elements and still be wrong, because its internal stiffness and the way its housing is joined are unknown. The usual approach is a remote or point mass: a single point at the motor's centre of mass, carrying 32 kg, connected to the end plate's bolt circle.

The connection matters. A rigid connection forces the bolt circle to move as a rigid ring, which stiffens the end plate and slightly overstates the bracket's frequency. A distributing connection spreads the load and inertia over the ring without adding stiffness, which is closer to reality for a motor flange that is itself fairly stiff but not perfectly so. For Revision B the end plate is thick and short, so the difference is small, but the choice should be recorded.

For static load cases, the same remote point can carry the forces and moments: the 628 N downward force for LC2, the 450 N sideways force for LC3 and the 120 N·m torque for LC4. Applying them at the motor's centre of mass, rather than spread over the end plate face, puts the correct moments into the bracket automatically.

## Apply gravity consistently

There are two ways to apply the motor's weight. One is a force of 314 N at the remote point. The other is a gravitational acceleration of 9,810 mm/s² applied to the whole model, which acts on the motor's point mass and on the bracket's own steel. The second includes the bracket's self-weight, about 4.3 kg or 42 N, which the first omits.

Both are acceptable if they are used deliberately. For LC2 the analyst uses an acceleration of **2 × 9,810 = 19,620 mm/s²**, which doubles the weight of both the motor and the bracket. The resulting downward reaction should then be **2 × (32 + 4.3) × 9.81 ≈ 712 N**, not 628 N. Knowing which number to expect is the whole point of the reaction check.

## Prove equilibrium with a reaction check

After every solution, read the total reaction forces and moments at the restraints and compare them with the applied loads. In a static analysis they must balance exactly, apart from rounding. If they do not, either a load is not where you think it is or a restraint is doing something you did not intend.

```figure
type: bars
title: Reaction check for LC2 applied as a remote force
unit: N
max: 1500
caption: Teaching values. Vertical reactions sum to the applied 628 N. Bolt tension and frame contact act along the bolt axes, balance each other and form the couple that resists the 157 N·m moment.
- Applied vertical load | 628
- *Sum of vertical reactions, bolt shear and friction | 628
- Total tension in all four bolts | 1390
- Frame contact compression | 1390
```

The last two bars look surprising at first, because they are larger than the load. They act horizontally, along the bolt axes, not vertically. The bolts pull the plate towards the frame and the frame pushes back, mostly near the bottom edge, so the two forces are equal and opposite and add nothing to the vertical balance. Because they act along different lines, though, they form a couple, and that couple is what resists the moment at the base. The vertical 628 N is carried separately, by bolt shear and friction between the plate and the frame.

The hand model predicts the same pattern. Each bottom bolt carries **157,000 × 20 / 34,600 ≈ 91 N**, so the four bolts together carry about **2 × 590 + 2 × 91 ≈ 1,360 N**, close to the model's 1,390 N. A complete reaction check therefore has three parts: the vertical forces sum to 628 N, the forces along the bolt axes sum to zero, and the moment of all the reactions about the base equals **628 × 250 = 157,000 N·mm**, or 157 N·m.

Real output lists each component of every reaction. What matters is that the sums agree with the applied loads in every direction, and that the analyst knows what each sum should be before reading it.

## A failure case: the load applied four times

This is an illustration. For LC3, the analyst wants to apply the 450 N belt pull to the end plate. The end plate's outer face has been split into four quadrants for meshing, and the analyst selects all four and types 450 N. The solver solves, and the sideways deflection at the load point is about 0.16 mm, four times the hand estimate of 0.04 mm.

The reaction check shows a sideways reaction of 1,800 N, which is **4 × 450 N**. The software's force dialog was set to apply the value to each selected face rather than as a total over the selection. The model has carried four times the belt pull ever since.

The error is common because both behaviours exist in commercial tools, sometimes in the same dialog under a small option. It is also completely detected by the reaction check, which takes seconds. Make the check a fixed step: solve, then read the reactions, then look at anything else.

## Apply the torque so it reaches the right parts

LC4, the 120 N·m start-up torque, is easy to apply wrongly. The motor's housing pushes on the end plate through its flange bolts, so the torque enters the bracket as a set of tangential forces around the bolt circle. Applying a moment at the remote point, connected to the bolt circle, reproduces that. Applying the moment to a single small face, or to an edge, concentrates it into a region that never carries it in reality and produces local stresses of no meaning.

The reaction check for LC4 is a moment about the arm's axis. The four bolts and the frame contact must together resist 120 N·m about that axis. At the base, the torque appears as shear forces in the bolts, each roughly **120,000 / (4 × r)**, where r is the distance from the arm's axis to the bolt. With bolts at 55 mm and 40 mm from the centre lines, r is about **√(55² + 40²) ≈ 68 mm**, so each bolt carries roughly **120,000 / (4 × 68) ≈ 441 N** of shear from the torque. That screening value tells the reviewer what order of bolt shear the model should report.

## Treat each load case as its own model run

Running every load at once in a single case makes the reaction check impossible to interpret and hides which load drives which result. Run each basic case separately, check its reactions and deformed shape, then form combinations either by running a combined case or by adding the results of the basic cases. Adding results is valid only while the analysis is linear. The contact between the base plate and the frame makes the bracket model mildly nonlinear, so for the combination C1 the analyst runs a combined case directly and compares it with the sum of the separate cases. A difference of a few per cent is the contact at work; a large difference would mean the plate lifts much more under the combination than under any single load, which is worth knowing.

Name each case by its load case number from the plan. A results folder full of studies called "Static 1", "Static 2" and "Copy of Static 2" is a common source of reports that quote the wrong case.

## Avoid rigid body motion and over-restraint

A model with too few restraints can move as a rigid body in some direction, and the solver either fails or produces enormous displacements. A model with too many restraints locks in stresses that would be relieved in reality. Both are visible in the reaction check and the deformed shape.

For the bracket's contact scheme, the frame surface prevents motion into the frame, and the bolts prevent motion away from it and sideways. In the direction along the bolts' axes, friction and bolt shear prevent sliding. If the bolt connectors were modelled without shear stiffness, the plate could slide freely downwards, and the model would fail or report huge vertical displacements. A small amount of shear stiffness, or a restraint representing friction, removes that freedom.

Over-restraint is subtler. Fixing both the back face and the bolt holes would add nothing but locked stress. Fixing the end plate as well as the base, perhaps by mistake when copying restraints from another study, would turn the cantilever into a beam fixed at both ends and reduce the tip deflection to almost nothing. The deformed shape, viewed with exaggeration, shows immediately whether the bracket bends as a cantilever.

## Record every load and restraint

The report needs a table of load cases, as in Chapter 1, and a table of restraints and connections: what each represents, its stiffness or contact behaviour and why it was chosen. For Revision B, the restraint table names the frame contact surface, the four bolt connectors with their axial and shear stiffness and the remote mass connection. It also names the choice that was rejected, the fixed back face, and gives its result as a lower bound on deflection.

Showing the rejected scheme is useful evidence. It tells the reviewer how sensitive the answer is to the restraint assumption: here, the realistic scheme gives about 12% more tip deflection than the fixed face, so a reasonable restraint error might move the result by a few per cent, not by a factor of two.

## Exercise: bolt tension under the belt pull

Under LC3, the 450 N sideways belt pull creates a moment of 112.5 N·m about a vertical axis at the base. The bolt columns are 40 mm either side of the plate's centre, and the plate is 120 mm wide, so it pivots on its side edge, 60 mm from the centre. Estimate the tension in each bolt on the far side from the pivot.

**Worked answer.** The distances from the pivot edge are **60 + 40 = 100 mm** for the far column and **60 − 40 = 20 mm** for the near column. With two bolts in each column, the sum of squared distances is **2 × 100² + 2 × 20² = 20,800 mm²**. The tension in each far bolt is **112,500 × 100 / 20,800 ≈ 541 N**. Under combination C1, the worst bolt sees roughly the sum of its vertical and sideways shares, about **590 + 541 ≈ 1,131 N**, plus a share of the start-up torque. That is a screening value; the real bolt check uses the model's bolt forces, the bolt grade and the preload.
