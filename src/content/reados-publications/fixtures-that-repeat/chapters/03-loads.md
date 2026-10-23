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

## Reverse the moment and move the loads

If the overturning couple reverses, the reactions exchange roles: the left side becomes heavily loaded and the right side becomes lightly loaded. A fixture approved for one cutting direction is not automatically approved for another.

The cutter may change direction around a profile or create a different force at entry and exit. Include those states in the load envelope. Do not assume a nominal toolpath direction defines every instantaneous force.

A force acting away from the centre also changes the reactions. The load position matters as much as its magnitude in a moment calculation. Record the coordinates and units with the force source, so later geometry changes cannot silently retain an obsolete lever arm.

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

## Trace the load beyond the workpiece

The 800 N lateral reaction does not disappear at the stop. It passes into the stop body, its attachment, the fixture plate and the machine interface. An offset stop may bend its mounting bolt or rotate on the plate.

Check whether fasteners are intended to locate, clamp mating surfaces or carry shear directly. Those are different joint designs. Clearance holes, preload, friction, bearing and fatigue may all matter. Use manufacturer data and an appropriate joint analysis for the actual arrangement.

Review the base connection as part of the same chain. A stiff nest attached to a flexible plate can still move. A correctly tightened local clamp cannot compensate for an inadequately secured fixture base.

## Recognise what this calculation does not prove

The two-dimensional model omits torsion about other axes, local contact deformation, dynamic loads, vibration, friction variability, fastener behaviour and the true three-dimensional support arrangement. It is a screening calculation that exposes reaction changes.

Use it to reject an obviously weak concept and identify sensitive inputs. Develop the actual model with a competent engineer and validate the intended operating conditions before cutting. The teaching numbers are not a safe-workholding prescription.

## Exercise: find the contact boundary

In the original 300 N uplift and 32 N·m case, what clamp force makes the left reaction exactly zero?

From RL = C − 470, the answer is **C = 470 N per clamp**. At that value, the maintained-contact model is at its boundary. The answer is not a recommended minimum clamp setting.

Then calculate reactions at C = 900 N for the original load case. They are **430 N and 1,070 N**, totalling 1,500 N. Compare them with the sensitivity-case reactions and identify which support must be checked under both moment directions.
