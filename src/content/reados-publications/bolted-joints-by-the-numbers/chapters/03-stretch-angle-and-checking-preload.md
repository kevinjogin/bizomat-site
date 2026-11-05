---
book: bolted-joints-by-the-numbers
chapterSlug: stretch-angle-and-checking-preload
order: 3
title: "Stretch and angle: setting preload closer to the bolt, and checking it"
description: "How bolt stretch and nut rotation relate to preload, why the snug point matters, how torque-angle tightening narrows scatter, and how measured stretch verifies preload."
draft: false
---

Torque is an indirect way of setting preload, filtered through friction. A bolt's stretch is a direct one: within its elastic range, a bolt's elongation is its preload divided by its stiffness, whatever the friction did on the way. And the angle a nut turns is nearly as direct, because each turn of the nut advances it by one pitch, shared between stretching the bolt and squeezing the members. Both methods take the nut factor out of the result, and both introduce their own uncertainties.

This chapter works out the CT-1 test head screws' stretch and turn angle for their target preload with the BIZOMAT bolt stretch and turn-of-nut tools, shows why the snug point ruins a simple angle method on a stiff joint and how torque-angle tightening fixes it, and uses the preload verification tool to check the tightened screws by their measured stretch. Its mistake is a stretch reading taken on a warm screw.

## Stretch and preload

A bolt tightened to preload F stretches by F ÷ kb, and the members it clamps compress by F ÷ km. From Chapter 1, the test head's M20 screws have a bolt stiffness of 949 kN/mm and the members a frustum stiffness of 3,781 kN/mm.

The [bolt stretch and turn-of-nut angle tool](/tools/bolt-stretch/) takes the nominal diameter, pitch, grip length, threaded length in the grip, the moduli of the bolt and members and a target preload. It returns the bolt and member stiffnesses, the bolt's elongation, the members' compression, the nut rotation from snug that gives the preload, and the bolt stress. It treats the elastic stiffness only, and warns that the snug point is uncertain and that turn angles should be validated by test on the actual joint.

```figure
type: steps
title: A test head screw in the bolt stretch tool
caption: This is an illustration. M20 × 2.5, grip 64 mm with 16 mm threaded, bolt and members 207 GPa, target preload 142.23 kN.
- Bolt stiffness | 949 kN/mm
- Member stiffness (estimate) | 3,781 kN/mm
- * Bolt elongation | 149.9 µm
- Member compression | 37.6 µm
- Nut turn from snug | 27.0°
- Bolt stress | 581 MPa
```

The screw stretches 0.15 mm at its full preload. That is too small to measure reliably with a micrometer across the screw's ends, even where both ends can be reached, and the test head's screws go into blind tapped holes. The shop measures it ultrasonically instead.

### Measuring stretch with ultrasound

An ultrasonic bolt gauge sends a sound pulse from a transducer on the screw's head down its length and times the echo from its far end. Tightening lengthens the screw and also slows the sound in the stressed steel, and the gauge, set up with the screw's material and effective length, converts the change in transit time into an elongation. The screw is measured before tightening, to set its zero, and after. The ends must be flat and square for a clean echo, so the shop has the screw ends faced, and each screw is numbered so its zero reading can be matched. This is an illustration of the general method; the gauge maker's procedure governs.

## The angle method

Each full turn of the nut, or of a screw into its tapped hole, advances it by one lead: 2.5 mm for an M20 × 2.5. Once the joint is snug, with everything in contact, that advance is taken up by the bolt stretching and the members compressing. So the angle from snug that gives a preload F is 360° × (F ÷ kb + F ÷ km) ÷ lead.

The [turn-of-nut angle for bolt preload tool](/tools/turn-of-nut-preload/) takes the target preload or a turn angle, the thread lead, the shank diameter, the tensile stress area, the plain shank and threaded lengths in the grip, the bolt's modulus and, optionally, the joint stiffness. It returns the bolt elongation, the turn angle from snug, the preload and the bolt stiffness, and the thread stress at the preload. With the joint stiffness left at zero it uses the handbook relation for a rigid joint, which underestimates the turn a real joint needs.

```figure
type: compare
title: Turn from snug for 142.23 kN on a test head screw
cols: Turn angle | Assumption
rowhead: Joint stiffness entered
- 0, rigid joint (handbook relation) | 21.6° | Only the bolt stretches
- * 3,781 kN/mm, frustum estimate | 27.0° | Bolt stretches and members compress
caption: This is an illustration. M20 × 2.5, 48 mm of plain shank and 16 mm of thread in the grip, tensile stress area 244.8 mm², E 207 GPa. Ignoring the members' compression understates the turn by a fifth.
```

Twenty-seven degrees is a small angle, and that is the problem with the angle method on a short, stiff joint. Each degree of turn adds 142.23 ÷ 27.0 = 5.27 kN of preload. The angle is counted from snug, and snug, the point at which the faces are fully in contact, is not sharp. If one fitter's snug is a few degrees further on than another's, the preloads differ by several times 5.27 kN.

## The mistake: an angle from an undefined snug

The shop first tried a pure angle method for the test head, because it promised to remove the nut factor: run each screw down hand-tight with a short key, then turn it 27°. Ten screws in the test block, checked with the ultrasonic gauge, gave preloads from 112 to 171 kN: a spread of − 21% to + 20%, no better than torque.

The reason was the snug point. "Hand-tight with a short key" depended on the fitter, on how clean the threads were, and on whether the screw had been tightened before. Some screws were barely seated at snug; others were already at 30 kN or more. On a joint where one degree is 5.27 kN, an uncertainty of 6° in the starting point is an uncertainty of 32 kN in the result.

Structural turn-of-nut methods work because structural bolts have long grips and soft joints, so the angle is large and a few degrees at snug matter little, and because they deliberately take the bolt into yield, where extra turn adds little force. Metal Fatigue by the Numbers describes a joint where that second feature turned into a hazard, in its [chapter on bolted joints](/reados/publications/metal-fatigue-by-the-numbers/bolted-joints/). The test head screws are not structural bolts and are not meant to yield.

### Torque, then angle

The fix is to define snug by torque. The shop's procedure now tightens each screw to 100 N·m, which with a nut factor of 0.20 gives about 25 kN, and then turns it a further 22°. The angle adds 22 × 5.27 = 115.9 kN, whatever the friction. Only the snug torque's 25 kN carries the nut factor's scatter.

```figure
type: compare
title: Preload scatter by tightening method, test head screws
cols: Preload range, kN | Range around 142 kN
rowhead: Method
- Torque, 569 N·m, K 0.20 ± 25% | 113.8 to 189.6 | − 20% to + 33%
- Angle, 27° from hand-tight snug, as tried | 112 to 171 | − 21% to + 20%
- * Torque to 100 N·m, then 22° | 135.9 to 149.2 | − 4% to + 5%
caption: This is an illustration. The torque-angle range assumes the snug torque's preload varies from 20 to 33 kN with the nut factor, and the 22° adds 115.9 kN. Angle measuring error, a degree or so, adds about ± 4% more.
```

The combined method narrows the scatter from about ± 25% to about ± 5% before angle measuring error. The turn-of-nut tool, run in preload mode with 22° and the joint stiffness, confirms the 115.9 kN that the angle adds. The cost is a second operation and an angle gauge on the wrench. The shop uses it for the test head, where Chapter 4 shows the narrower scatter is worth having, and plain torque everywhere else on the rig.

### Tightening into yield

Some production joints, notably engine cylinder heads and connecting rods, are tightened deliberately past the bolt's yield point, by a torque-angle procedure or by a tool that watches the torque–angle curve and stops when its slope falls. Once a bolt yields, further turn adds little force, so the preload is set by the bolt's yield strength, which varies much less than friction does. The price is that the bolt has been plastically stretched: it usually cannot be reused, and the joint must be designed so that external loads do not take it further. None of the CT-1's joints are tightened that way. The elastic relations in this chapter's tools stop at yield, and the bolt stretch tool's limitations say so: an angle that would take a bolt past its proof load is a sign the joint needs a different method, not a bigger angle.

## Checking the preload

Whatever the tightening method, the shop verifies a sample by measured stretch. The [bolt preload verification tool](/tools/bolt-preload-verification/) takes the bolt's diameter and pitch, the grip and threaded length, the moduli of bolt and members, its proof strength, the target preload as a share of proof, an accepted deviation, the measured stretch and the torque that was applied. It returns the bolt stiffness, the preload the stretch implies, the target, the deviation, the nut factor the torque implies, the torque that would give the target with that nut factor, and the turn angle that corresponds to the measured preload. It checks the deviation against the tolerance and the preload against proof, and flags a nut factor outside 0.1 to 0.3.

```figure
type: compare
title: Two test head screws in the preload verification tool, after 570 N·m by torque
cols: Measured stretch | Preload from stretch | Deviation | Implied nut factor | Result
rowhead: Screw
- * Screw 3 | 0.140 mm | 132.8 kN | − 6.6% | 0.215 | PRELOAD VERIFIED within ± 10%
- Screw 6 | 0.118 mm | 112.0 kN | − 21.3% | 0.255 | PRELOAD OUT OF TOLERANCE
caption: This is an illustration. M20 × 2.5, grip 64 mm with 16 mm threaded, proof 830 MPa, target 70% of proof (142.23 kN), accepted deviation ± 10%, applied torque 570 N·m by the original torque procedure.
```

Screw 6's implied nut factor of 0.255 pointed at friction, and when it was removed its tapped hole showed a burred first thread that had been dragging. The hole was chased and the screw replaced. The verification tool also gives, for each screw, the torque that would have hit the target with its own nut factor: 610 N·m for screw 3 and 724 N·m for screw 6. Those figures are not a new tightening torque; they show how far one bolt's friction can move the torque it needs.

## The mistake in the measurement: a warm screw

When the shop began verifying the test head after endurance runs, one set of readings showed every screw stretched about 7% more than its baseline, as if the preload had risen. Preload does not rise on its own.

The readings had been taken an hour after a run, with the head and screws still about 10 K above the room. A 100 mm steel screw 10 K warmer is 11.5 × 10⁻⁶ × 10 × 100 = 0.0115 mm longer, and the ultrasonic gauge, set for room temperature, read that thermal growth as stretch: 11.5 µm on a preload stretch of 150 µm, 7.7%. The gauge has a temperature correction; it had not been set. The procedure now records the screw temperature with each reading, and verification is done with the rig at room temperature.

## Other ways to know the preload

Stretch and angle are not the only alternatives to torque. Direct tension indicators are hardened washers with small raised bumps that flatten as the bolt is tightened; when a feeler gauge no longer enters the gap under them, the bolt has reached at least a set tension. They are common on structural bolts. Load-indicating bolts carry a small gauge pin or a visual indicator in their head that changes as the bolt stretches. Hydraulic bolt tensioners stretch the bolt directly with a hydraulic jack on its protruding end, run the nut down by hand, and release the jack, so that no torque is applied at all; they are used on large bolts in pressure equipment and wind turbines, and need a length of thread above the nut to grip.

For the CT-1's screws, which go into blind tapped holes with nothing protruding, tensioners and nut-end indicators do not fit. Ultrasonic measurement and torque-angle tightening suit them better.

```figure
type: decision
title: Choosing a tightening method
caption: The CT-1 rig's rule of thumb. This is an illustration.
- Preload scatter of ± 25% acceptable, Chapter 4 check passes with it | Torque with a known nut factor | Most of the rig's joints
- Short stiff joint, scatter must be about ± 5% | Torque to a defined snug, then angle | Test head screws
- Long bolts with access to both ends, critical preload | Hydraulic tensioning or measured stretch | Not used on the CT-1
- Structural bolts in slip-critical joints | The structural standard's tightening method | Frame splice, Chapter 7
```

## Recording what was done

A tightened joint gives no outward sign of its preload, so the record of how it was tightened is the evidence that it was made as designed. For the test head, the shop records the screw numbers, the snug torque and the angle applied, the wrench and angle gauge used with their calibration dates, the ultrasonic readings for the sample checked, the temperature, and the name of the fitter. When a screw is replaced, its replacement gets a new zero reading. The record goes into the rig's maintenance file beside the pressure test results, so that anyone investigating a leak or a broken screw later can see what the joint started with.

## Exercise: angle for the manifold screws

The CT-1's manifold screws are M10 × 1.5, with 20 mm of plain shank and 10 mm of thread in a 30 mm grip, a tensile stress area of 58 mm² and E = 207 GPa, and the aluminium manifold's member stiffness is 655 kN/mm. Their target preload is 39.4 kN. Find the bolt stiffness, the turn angle from snug for the target, and how much preload one degree adds. Would a torque-angle method suit them?

### Worked answer

The shank area is π × 10² ÷ 4 = 78.54 mm². The bolt's flexibility is (20 ÷ 78.54 + 10 ÷ 58) ÷ 207,000 = (0.2546 + 0.1724) ÷ 207,000 = 2.063 × 10⁻⁶ mm/N, so its stiffness is 484.7 kN/mm. The member flexibility is 1 ÷ 655,000 = 1.527 × 10⁻⁶ mm/N.

The angle for 39,400 N is 360 × 39,400 × (2.063 + 1.527) × 10⁻⁶ ÷ 1.5 = 33.9°. One degree adds 39.4 ÷ 33.9 = 1.16 kN, about 3% of the preload.

The turn-of-nut preload tool, with a joint stiffness of 655 kN/mm, gives the same 33.9°. The aluminium manifold is softer than the steel test head, so the angle is larger and each degree matters less; a torque-angle method would work well. With a snug torque of 15 N·m, about 7.5 kN at K = 0.20, the angle to add the remaining 31.9 kN would be 31.9 ÷ 1.16 = 27.5°.
