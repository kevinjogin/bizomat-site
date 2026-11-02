---
book: springs-by-the-numbers
chapterSlug: torsion-springs-and-counterbalanced-lids
order: 8
title: "Torsion springs and counterbalanced lids"
description: "How helical torsion springs work and how to check one: bending stress, wind-up angle, legs and arbor clearance, and balancing a hinged hatch over its whole opening."
draft: false
---

A helical torsion spring looks like a compression spring with its ends bent out into straight legs. It is loaded by a moment that twists its legs round the coil's axis, and it is the spring used wherever something pivots: clothes pegs, mousetraps, hinged covers, ratchet pawls and the counterbalances on machine hatches. Despite the name, its wire is not in torsion. Turning the legs bends each coil a little tighter, so the stress in the wire is a bending stress, and the formulas use the elastic modulus E, not the shear modulus.

This chapter checks the two torsion springs that balance the VM-8's hinged top hatch, using three KEVOS® tools: the torsion spring check, the torsion spring designer, and the lid counterbalance check that follows the hatch's balance through its whole opening. Its mistake is a hinge sleeve made a little too large, on which the springs bound as they wound up.

## The hatch

The VM-8's enclosure has a hinged top hatch over the machining area, used to load long parts and to reach the spindle head. It is a steel frame with a polycarbonate window, 12 kg, with its centre of gravity 300 mm from the hinge line, and it opens through 90°, from flat to upright. The handle is 560 mm from the hinge. Two torsion springs sit on a sleeve over the hinge pin, one at each end, with one leg on the frame and the other on the hatch. This is an illustration.

The springs' job is to make the hatch easy to lift, to keep it shut when shut, and to hold it open when open, so that it cannot fall on an operator's arm. The shop's limit for the force at the handle is 50 N anywhere in the opening.

## How a torsion spring works

The moment on the legs bends every coil of the body by the same amount, and the angles add. The rate and the stress follow from beam bending.

```figure
type: formula
title: Helical torsion spring: angle, rate and stress
formula: θ = 64 M D Nb ÷ (E d⁴)  (radians, body only)
formula: Rate = E d⁴ ÷ (64 D Nb)  per radian
formula: σ = Ki × 32 M ÷ (π d³),  Ki = (4C² − C − 1) ÷ (4C (C − 1))
caption: M is the moment, D the mean coil diameter, Nb the body turns and d the wire diameter. Ki corrects for the higher bending stress on the inner side of the curved wire. The load must wind the coils tighter; a load that opens them is held only by a lower allowable stress.
- θ | angular deflection of the body
- Ki | curvature correction for bending
- C | spring index D ÷ d
```

As the spring winds up, its coils wrap tighter, the body's mean diameter shrinks and the body grows longer by about one wire diameter for each full turn of wind-up. The shrinking diameter is the reason a torsion spring needs clearance over the arbor or sleeve it sits on: a spring wound down onto its arbor binds, rubs and is overstressed.

### Legs

Straight legs bend too, and they add to the spring's angle. A common allowance treats the two legs, of lengths L1 and L2, as extra active coils equal to (L1 + L2) ÷ (3π D). For short legs on a large coil the effect is a few per cent; for long legs on a small coil it can be a quarter of the total angle.

## The hatch springs

Each spring is 5 mm music wire on a 32 mm mean diameter, with 8 body turns and legs of 60 mm and 40 mm. With the hatch shut, each is wound up 100° from its free position; as the hatch opens through 90°, each unwinds to 10°. The sleeve on the hinge pin is 22 mm in diameter. This is an illustration.

The shop's allowable bending stress for 5 mm music wire in a torsion spring is 1,300 MPa, about three-quarters of the wire's tensile strength of 1,751 MPa by the A ÷ d^m fit. This is an illustration. Torsion springs are allowed a higher fraction of tensile strength than compression springs because the wire is in bending, and because the coiling leaves residual stresses that favour loads which wind the spring up.

The [helical torsion spring check](/tools/torsion-spring/) takes the wire diameter, mean coil diameter, body turns, elastic modulus, the load at the arm and its moment arm, an arbor diameter and an allowable bending stress. It returns the moment, the angular deflection, the rate per turn and per degree, the corrected bending stress and the inside diameter of the wound coil, with a check that the inside diameter clears the arbor by 10%. It treats the body only, ignoring leg deflection and coil friction.

The full wind-up of 100° needs a moment of 7,896 N·mm per radian × 1.745 rad = 13,782 N·mm. Entered as 229.7 N at a 60 mm arm, the check gives:

```figure
type: steps
title: One hatch spring in the torsion spring check, hatch shut
caption: This is an illustration. 5 mm wire, 32 mm mean diameter, 8 body turns, E = 207 GPa, 229.7 N at a 60 mm arm, arbor 22 mm, allowable 1,300 MPa.
- Moment | 13,782 N·mm
- Angular deflection | 100.0°, 0.278 turns
- Rate | 137.8 N·mm/°
- * Bending stress | 1,271 MPa against 1,300 MPa
- Inside diameter when wound | 25.93 mm against 22 mm arbor: SPRING OK
```

The stress is within the allowable, with 2% to spare: the hatch springs work hard, as counterbalance springs usually do.

### Adding the legs

The [torsion spring designer](/tools/torsion-spring-designer/) adds the legs. It takes the same inputs plus the two leg lengths and a least arbor clearance as a share of the arbor diameter. It returns the moment, the equivalent active coils including the legs, the angular deflection, the rate per radian and per degree, the bending stress, the largest angle before the allowable stress is reached, the wound inside diameter and the wound body length.

```figure
type: steps
title: One hatch spring in the torsion spring designer, with legs
caption: This is an illustration. As above, with legs of 60 and 40 mm and a least arbor clearance of 10%.
- Equivalent active coils | 8.33
- Angular deflection for 13,782 N·mm | 104.1°
- Rate | 7,582 N·mm/rad, 132.3 N·mm/°
- Bending stress | 1,271 MPa
- * Largest angle at the allowable stress | 106.5°
- Wound inside diameter | 25.93 mm
- Wound body length | 46.4 mm: SPRING ADEQUATE
```

The legs make the spring 4% softer: to give 13.78 N·m it must be wound 104.1°, not 100°. Wound to 100° as installed, it gives 7,582 × 1.745 = 13.23 N·m. The largest safe angle, 106.5°, leaves only 2.4° of margin above the wind-up the designer calls for, which matters when the springs are installed: a fitter who pre-winds them an extra few degrees to make the hatch lighter would take them past their allowable.

The wound body length tells the shop how much room to leave along the sleeve: 46.4 mm for each spring when the hatch is shut, compared with 9 × 5 = 45 mm unloaded.

## Balancing the hatch through its whole opening

A spring's moment falls in a straight line as it unwinds, while the hatch's weight moment falls as the cosine of its opening angle: largest when it is flat and zero when it is upright. A straight line cannot follow a cosine, so a spring counterbalance is always a compromise, too strong in some positions and too weak in others.

The [lid counterbalance check](/tools/lid-counterbalance-spring/) takes the lid's mass, the distance from the hinge to its centre of gravity, the opening angle, the number of springs, each spring's wire, coil diameter, body turns and modulus, the wind-up at the closed position, an allowable bending stress, the handle's distance from the hinge and the largest handle force allowed. It returns each spring's rate, the lid's torque when closed, the out-of-balance torque closed and open, the largest out-of-balance torque and where it occurs, the largest handle force, and the spring stress at full wind-up, with checks that the lid stays open, stays shut, and is within the handle force and stress limits. It assumes linear springs, a frictionless hinge and a centre of gravity on the line through the hinge when closed.

```figure
type: steps
title: The top hatch in the lid counterbalance check
caption: This is an illustration. 12 kg, 300 mm to the centre of gravity, 90° opening, two springs of 5 mm wire, 32 mm coil, 8 turns, E = 207 GPa, wound 100° when shut, allowable 1,300 MPa, handle at 560 mm, largest handle force 50 N.
- Rate of each spring | 7,896 N·mm/rad
- Hatch torque closed | 35.30 N·m
- Out-of-balance closed / open | +7.74 / −2.76 N·m
- Largest out-of-balance torque | 11.34 N·m at 26°
- * Largest handle force | 20.2 N
- Spring stress at full wind-up | 1,271 MPa: LID BALANCED
```

The signs carry the meaning. Shut, the hatch's weight exceeds the springs' torque by 7.74 N·m, so it rests closed and stays there. Fully open, the springs exceed the weight by 2.76 N·m, so they hold it against its stop. In between, the largest imbalance is 11.34 N·m, which an operator overcomes with 20.2 N at the handle: well within the 50 N limit.

```figure
type: compare
title: Hatch weight torque, spring torque and the difference, by opening angle
cols: Weight torque, N·m | Spring torque, two springs, N·m | Difference, N·m
rowhead: Opening angle
- 0°, shut | 35.30 | 27.56 | +7.74, holds it shut
- 15° | 34.10 | 23.43 | +10.67
- * 30° | 30.57 | 19.29 | +11.28, near the largest
- 45° | 24.96 | 15.16 | +9.80
- 60° | 17.65 | 11.03 | +6.63
- 75° | 9.14 | 6.89 | +2.25
- 90°, open | 0.00 | 2.76 | −2.76, holds it open
caption: This is an illustration. Weight torque 35.30 cos θ N·m; spring torque from two springs wound 100° shut, each 7,896 N·mm/rad. A positive difference holds the hatch down and is what the operator lifts against; a negative one holds it up.
```

Allowing for the legs, which make the springs 4% softer, the hatch rests shut with 8.84 N·m and is held open with 2.65 N·m; the balance still works.

### Choosing the wind-up

The wind-up at the shut position is the one setting that trades the hatch's behaviour against the springs' stress. More wind-up makes the springs stronger everywhere: the hatch is lighter to lift and held open more firmly, but rests shut less heavily and the springs are more stressed. The shop ran the lid counterbalance check at four wind-ups before choosing.

```figure
type: compare
title: The top hatch at four wind-ups
cols: Rests shut with, N·m | Held open with, N·m | Largest handle force, N | Spring stress, MPa
rowhead: Wind-up when shut
- 90° | 10.50 | 0.00 | 25.2 | 1,144
- 95° | 9.12 | 1.38 | 22.7 | 1,207
- * 100° | 7.74 | 2.76 | 20.2 | 1,271
- 105° | 6.36 | 4.14 | 17.8 | 1,334, over 1,300
caption: This is an illustration. Two springs of 5 mm wire, 32 mm coil, 8 turns. At 90° the springs are fully unwound when the hatch is open, so nothing holds it there; at 105° they are overstressed.
```

At 90°, the springs reach their free position exactly as the hatch reaches upright, so nothing holds it open: a draught or a knock could start it closing. At 105°, the springs pass their allowable stress. The shop chose 100°, which holds the hatch open with 2.76 N·m and keeps the stress just within the allowable.

### Friction helps, and hides

The counterbalance check assumes a frictionless hinge. Real hinges and spring sleeves have friction, which acts against whichever way the hatch is moving. That helps: it holds the hatch in part-open positions and adds to the holding torque at the ends of travel. It also hides a weakening spring, because a hatch that is no longer quite balanced may still stay where it is put. The six-monthly drift check is done after the hinge has been cleaned and lightly lubricated, so that friction is low and any loss of spring torque shows.

### Fitting wound springs

Each spring stores 12 J when the hatch is shut. Fitting them means winding each one 100° and hooking its leg behind the hatch frame, and a leg that slips off a fitter's tool releases that energy as a sharp blow. The shop fits the springs with the hatch held fully open, where they are wound only 10°, and lets the hatch's own weight wind them up as it is lowered.

## The mistake: a sleeve too large

During the rebuild the hinge pin was replaced, and the machinist made a new sleeve for the springs from tube to hand, 24 mm outside diameter instead of 22 mm. After a week, operators reported that the hatch squealed and stuck about halfway down when being closed.

Run with a 24 mm arbor, the torsion spring check gives the same stress, but its arbor check fails: the wound inside diameter of 25.93 mm is only 8% larger than 24 mm, below the 10% the tool wants. With the hatch shut and the springs fully wound, their coils were closing onto the sleeve. Friction between coil and sleeve made the springs' torque depend on which way the hatch was moving, and grease squeezed out of the contact made the squeal.

```figure
type: compare
title: Arbor clearance with the springs fully wound
cols: Wound inside diameter | Clearance | Arbor check
rowhead: Sleeve
- 24 mm, made from tube to hand | 25.93 mm | 8% | Fails: binds on arbor
- * 22 mm, as designed | 25.93 mm | 18% | Passes
caption: This is an illustration. Each spring's inside diameter shrinks from 27.0 mm free to 25.93 mm at 100° of wind-up. The 10% clearance allows for coil tolerance and for the coils not winding evenly.
```

A new 22 mm sleeve was made and the squeal stopped. The shop added the sleeve diameter to the hatch drawing, which had not shown it, and added a note that the springs must wind tighter as the hatch closes; a spring fitted the other way round would unwind under load, open its coils, and need a much lower allowable stress.

## Why not gas struts?

Many hinged covers are held up by gas struts instead of springs, and the shop considered them. A gas strut gives a nearly constant force over its stroke, and when it is mounted off the hinge line its moment about the hinge changes with angle in a way that can follow a lid's weight torque more closely than a torsion spring's straight line. Gas struts are compact and come with built-in damping.

Against that, a gas strut's force changes with temperature, because the gas pressure does, and its seals slowly lose gas, so the force falls over the years. Inside a machine enclosure, coolant mist and fine chips attack the rod and its seal. Torsion springs on the hinge sleeve are out of the way, keep their torque across the workshop's temperature range, and show their condition to a visual inspection. For the VM-8's hatch, the springs were kept. For a cover outside the enclosure, the shop might well choose struts.

## Inspection

Counterbalance springs fail suddenly when they fail, and a hatch that suddenly weighs its full 12 kg can injure. The shop's routine inspects them every six months: each spring for cracks at the legs and for broken coils, the sleeve for wear, and the hatch for drift: it should stay fully open on its own and rest shut on its own. A hatch that starts to drift down from fully open has springs that have lost torque, and both springs are replaced as a pair.

## Exercise: one spring broken

If one of the two hatch springs breaks, what are the out-of-balance torques with the hatch shut and fully open, the largest handle force, and does the hatch still behave safely?

### Worked answer

With one spring, wound 100° shut, the spring torque shut is 7,896 × 1.745 = 13.78 N·m. The out-of-balance shut is 35.30 − 13.78 = 21.52 N·m, so the hatch rests shut heavily. Fully open, the spring is still wound 10°, giving 7,896 × 0.1745 = 1.38 N·m against zero weight torque: an out-of-balance of −1.38 N·m, so the hatch is still held open, but only just.

In between, the largest out-of-balance found by the lid counterbalance check with one spring is 22.41 N·m near 13° of opening, needing 22.41 ÷ 0.56 = 40.0 N at the handle: within the 50 N limit, but twice the normal effort.

So the hatch remains usable and still holds open, which is why it has two springs, but with so little holding-open torque that a knock could start it closing. The operators are told to report a hatch that suddenly feels heavy, and the six-monthly inspection checks both springs.
