---
book: fixtures-that-repeat
chapterSlug: draw-the-load-path-before-sizing-the-clamp
order: 3
title: "Draw the load path before sizing the clamp"
description: "Use a free-body model to calculate fixture reactions, detect contact loss and distinguish a useful static check from a complete workholding qualification."
draft: false
---

A clamp rating is meaningful only in a load path. The cutting force must travel through the workpiece, contacts, fixture body, fasteners and machine interface. If any link is absent or behaves differently from the model, a large number on the clamp does not complete the design.

Begin with a free-body diagram for each important load case. Show the applied forces, moments and the contacts capable of reacting them. Mark assumptions openly, especially where friction or a unilateral contact is involved.

## Use a deliberately simple section

This is an illustration, separate from a detailed three-dimensional fixture design. Replace the primary support arrangement by two resultant vertical support lines in a section, 100 mm apart. Set the left line at x = 0 and the right line at x = 100 mm.

Two downward clamps each apply force C, at x = 20 and x = 80 mm. An upward process force of 300 N acts at the centre, x = 50 mm. An assumed clockwise overturning couple of 32 N·m acts on the workpiece.

The couple could represent an 800 N horizontal force whose line of action is 40 mm above its opposing lateral reaction: **800 × 0.040 = 32 N·m**. The lateral reaction is assumed to be carried by an appropriate positive stop. This model does not calculate that stop's strength or contact stress.

Let RL and RR be upward support reactions. Contacts are assumed rigid and friction is not used to balance the overturning moment. Weight is omitted; it would need to be included where material to the actual load case.

## Say where the load envelope came from

The teaching forces are supplied, not derived. A real brief needs a source for every load case. Common routes include:

- **Estimates from specific cutting force.** The tangential force on a cutting edge is roughly the specific cutting force of the material multiplied by the chip cross-section. As an illustration only, an assumed specific cutting force of 1,800 N/mm² with a 2 mm depth of cut and a 0.1 mm chip thickness gives about **1,800 × 2 × 0.1 = 360 N** on one engaged edge. The real value depends on material, tool geometry and chip thickness, and should come from tool supplier data.
- **Tool and machine supplier data**, which often give recommended cutting conditions and, sometimes, force or power estimates.
- **Measurement**, using a force dynamometer under the part during a trial cut, or inferring forces from spindle and axis load data where the machine provides it reliably.

Each route has an uncertainty, and the load envelope should state it. An estimate that may be wrong by a factor of two calls for more margin, or for a measurement before final approval, than a measured value from the actual tool and material.

## Balance forces and moments

Vertical equilibrium gives:

**RL + RR + 300 − 2C = 0.**

Taking counter-clockwise moments as positive about the left support, and using N and mm:

**100RR − 20C − 80C + 50 × 300 − 32,000 = 0.**

The results are:

**RR = C + 170 N.**

**RL = C − 470 N.**

If each clamp applies 500 N, RR is **670 N** and RL is only **30 N**. Their sum is 700 N, which agrees with 1,000 N of downward clamping minus 300 N of uplift.

```figure
type: bars
title: Support reactions with two 500 N clamps
unit: N
max: 700
caption: The reactions sum to 700 N: 1,000 N of clamping minus 300 N of uplift. The left contact is only just loaded.
- Right support, RR = C + 170 | 670
- *Left support, RL = C − 470 | 30
```

This check catches a weakness hidden by comparing total clamping force with total uplift. Although 1,000 N exceeds 300 N, the overturning couple nearly unloads the left contact.

## Interpret a negative reaction physically

If C were 400 N, the equations would predict RL = −70 N. An ordinary support cannot pull downward on the part, so that result is not a valid maintained-contact state. It indicates that the assumed contact arrangement would change, typically through lift or rotation.

Once contact changes, the original equations no longer describe the system. A different contact model is required. Do not keep the negative reaction in a spreadsheet as though it were simply a load that the support must be rated to withstand.

Likewise, a zero reaction is a boundary condition, not a useful operating reserve. Real vibration, variation and imperfect contact can make a barely seated condition unsuitable. The required margin must be justified for the actual process.

## Move the clamps before adding force

Clamp position changes the reactions as much as clamp force does. In the original section, the clamps sit symmetrically at x = 20 and x = 80 mm, and the left reaction is C − 470 N. Move both clamps 10 mm to the left, to x = 10 and x = 70 mm, and repeat the moment balance about the left support:

**100RR − 10C − 70C + 50 × 300 − 32,000 = 0, so RR = 0.8C + 170 N**

Vertical equilibrium then gives **RL = 1.2C − 470 N**.

With the same 500 N clamps, the left reaction rises from 30 N to **130 N**, and the right reaction falls from 670 N to **570 N**. The clamp force at which the left contact would just unload falls from 470 N to about **392 N**.

```figure
type: compare
title: The same two 500 N clamps in two positions
cols: Clamps at 20 and 80 mm | Clamps at 10 and 70 mm
caption: Moving clamp force towards the lightly loaded support raises its reaction without increasing the force on the part.
- Left reaction | 30 N | 130 N
- Right reaction | 670 N | 570 N
- *Clamp force where the left contact unloads | 470 N | About 392 N
```

The clamps now press closer to the support that the overturning couple tries to lift, so less clamping is needed to keep it loaded. The cost is that the arrangement is now tuned to one moment direction; if the couple reverses, the right support becomes the light one and the shifted layout is worse. That is why the load-case table matters: a clamp position should be chosen against every load case, not just the worst one found first.

## Reverse the moment and move the loads

If the overturning couple reverses, the reactions exchange roles: the left side becomes heavily loaded and the right side becomes lightly loaded. A fixture approved for one cutting direction is not automatically approved for another.

The cutter may change direction around a profile or create a different force at entry and exit. Include those states in the load envelope. Do not assume a nominal toolpath direction defines every instantaneous force.

A force acting away from the centre also changes the reactions. The load position matters as much as its magnitude in a moment calculation. Record the coordinates and units with the force source, so later geometry changes cannot silently retain an obsolete lever arm.

## Look at every axis, not just one section

The two-dimensional section shows rotation in one plane. A lateral force applied at a height above the supports also creates a moment about the other horizontal axis, and a force applied away from the centre of the part creates a twisting moment about the vertical axis. A fixture that is secure in the drawn section can still lift a corner, or rotate in plan, under a load the section does not show.

A practical check is to repeat the screening calculation in a second section at right angles, and to look at the plan view for twisting. In the plan view, the side and end stops resist rotation about the vertical axis; their spacing, like the side-locator spacing in Chapter 2, sets how well they do it. Where the three views give different weakest points, the clamp layout must satisfy all of them, not the one that happened to be drawn first.

## Run a sensitivity case without calling it a universal factor

For investigation, increase the assumed uplift and couple by 50%, to 450 N and 48 N·m. This is a chosen sensitivity case, not a recommended design factor or a validated representation of cutting dynamics.

With the same geometry:

**RL = C − 225 − 480 = C − 705 N.**

**RR = C − 225 + 480 = C + 255 N.**

```figure
type: stats
title: Reversing the moment and moving the loads
caption: A negative reaction means the contact would lift; the model then no longer describes the fixture.
- *RL = C − 705 N | Left reaction
- RR = C + 255 N | Right reaction
- C > 705 N | Each clamp | to keep the left contact loaded
```

At C = 900 N per clamp, the reactions are **195 N and 1,155 N**. The model retains contact in this case. It also imposes a larger reaction on one support, which must be assessed for its own contact and structural consequences.

This demonstrates why increasing clamp force is a trade-off. It can preserve contact while increasing deformation or damaging the workpiece. The next chapters examine those consequences.

## Peak loads are not average loads

Milling forces are not steady. Each tooth enters and leaves the cut, so the force rises and falls at the tooth-passing frequency, the spindle speed multiplied by the number of teeth. A four-flute cutter at 2,000 rpm produces about **2,000 × 4 / 60 ≈ 133** force pulses a second. Entry into the cut, interruptions such as crossing a pocket edge, and changes in engagement around corners can produce peaks well above the average force.

Two consequences matter for the fixture. First, the load case should use a credible peak, not an average from spindle power. Second, a repeating force can excite vibration if it lands near a natural frequency of the part and fixture, which is one reason Chapter 5 treats stiffness as part of the load-path design rather than a separate concern.

## Build a load-case table

The teaching case discusses a few states; a real fixture review lists them all. For the bracket, a load-case table might include:

```figure
type: compare
title: Load cases for the bracket fixture
cols: Main force direction | What it tests
caption: Each operation pushes the part a different way. The clamp layout must hold the part in every case, not only the first one drawn.
- Roughing, one direction | Lateral and uplift | Stop strength, the lightly loaded support
- Roughing, reversed | Lateral the other way | The opposite support and clamp
- Finishing pass | Small lateral | Deflection and surface finish
- Drilling | Axial, downwards | Supports under the hole, local bending
- *Tapping or reaming | Torque about the hole axis | Rotation in plan, side and end stops
```

Drilling usually pushes the part onto its supports, which helps seating but can bend an unsupported region under the drill. Tapping applies torque that tries to spin the part about the hole, which the side and end stops must resist. Each line in the table should carry its force estimate, source, direction and location, so the screening calculations can be repeated whenever the process changes.

## Trace the load beyond the workpiece

The 800 N lateral reaction does not disappear at the stop. It passes into the stop body, its attachment, the fixture plate and the machine interface. An offset stop may bend its mounting bolt or rotate on the plate.

Check whether fasteners are intended to locate, clamp mating surfaces or carry shear directly. Those are different joint designs. Clearance holes, preload, friction, bearing and fatigue may all matter. Use manufacturer data and an appropriate joint analysis for the actual arrangement.

Review the base connection as part of the same chain. A stiff nest attached to a flexible plate can still move. A correctly tightened local clamp cannot compensate for an inadequately secured fixture base.

## Give the stop a load path of its own

The stop that carries the 800 N lateral force is itself a small structure. If the force acts on the stop 10 mm above the fixture plate, it creates a moment of **800 × 0.010 = 8 N·m** at the stop's base, which tries to tip the stop over its own edge and to slide it across the plate.

A common arrangement separates the jobs. Dowel pins, fitted closely in reamed holes in both stop and plate, set the stop's position and carry the sideways force in shear. Bolts clamp the stop to the plate so that it cannot tip and so that the joint faces stay in contact. Relying on the bolts alone to carry the sideways force, through friction under the bolt heads or by bearing on the sides of clearance holes, invites the stop to creep a little each time the force is applied, which shifts every part located against it.

The proportions matter as well. A tall, thin stop bends more than a short, broad one, and a stop whose contact point sits well above its base multiplies the moment. Keeping the contact low on the stop, consistent with the side-contact heights in Chapter 2, and the base broad, keeps the load path short.

## Recognise what this calculation does not prove

The two-dimensional model omits torsion about other axes, local contact deformation, dynamic loads, vibration, friction variability, fastener behaviour and the true three-dimensional support arrangement. It is a screening calculation that exposes reaction changes.

Use it to reject an obviously weak concept and identify sensitive inputs. Develop the actual model with a competent engineer and validate the intended operating conditions before cutting. The teaching numbers are not a safe-workholding prescription.

## Record the load review with the design

The free-body diagrams, load-case table, sensitivity cases and their results belong with the fixture drawing, under the same revision control. When the cutting process changes later, a new tool, a deeper cut or a reversed toolpath, the review shows immediately which assumptions have moved and which calculations must be repeated. Without it, the next engineer has only the clamp catalogue numbers and the hope that the original designer allowed for the change.

## Exercise: find the contact boundary

In the original 300 N uplift and 32 N·m case, what clamp force makes the left reaction exactly zero?

From RL = C − 470, the answer is **C = 470 N per clamp**. At that value, the maintained-contact model is at its boundary. The answer is not a recommended minimum clamp setting.

Then calculate reactions at C = 900 N for the original load case. They are **430 N and 1,070 N**, totalling 1,500 N. Compare them with the sensitivity-case reactions and identify which support must be checked under both moment directions.
