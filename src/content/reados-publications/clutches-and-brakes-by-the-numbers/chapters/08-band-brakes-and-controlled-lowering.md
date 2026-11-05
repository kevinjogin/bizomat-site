---
book: clutches-and-brakes-by-the-numbers
chapterSlug: band-brakes-and-controlled-lowering
order: 8
title: "Band brakes and controlled lowering"
description: "How a band brake multiplies a small lever force by friction round the drum: band tensions, lever force, lining pressure, the direction that matters, stops, and the heat of a controlled lowering."
draft: false
---

A band brake is a flexible steel band, lined with friction material, wrapped most of the way round a drum. One end is anchored to the frame; the other is pulled by a lever. Friction round the wrap makes the tension at one end several times the tension at the other, and the brake's torque comes from the difference. A lever force of a few hundred newtons can therefore hold a torque of thousands of newton metres, which is why band brakes are found on winches, capstans, cranes and hoists that must be controlled by hand.

This chapter designs the SW-25's new drum band brake with the BIZOMAT band brake tool and the band brake stopping design tool. It shows how the friction multiplication works, why the band must be anchored at the right end, how a weighted lever gives a brake that applies itself, and how much heat a controlled lowering produces. Its mistake is a band drawn anchored at the wrong end, which would have let a boat run away.

## Friction round a drum

Imagine a rope wrapped round a post. A small pull on one end can hold a large load on the other, and every extra turn multiplies the holding power. The same law governs a band. If the band slips round the drum with friction coefficient μ, the tension rises along the wrap in proportion to itself, and over a wrap angle θ the ratio of the tight-side tension T1 to the slack-side tension T2 is e^(μθ), where θ is in radians.

```figure
type: formula
title: Band brake tensions and torque
formula: T1 ÷ T2 = e^(μθ)
formula: Brake torque = (T1 − T2) r
formula: Peak lining pressure = T1 ÷ (r w)
caption: θ is the wrap angle in radians, r the drum radius and w the band width. The friction multiplies tension along the wrap in the direction the drum drags the band. The pressure is greatest at the tight end and smallest at the slack end.
- T1 | tension at the tight end, where the drum drags the band towards
- T2 | tension at the slack end
- e^(μθ) | the friction multiplier
```

For the SW-25's band, with μ = 0.30 and a wrap of 270°, which is 4.712 rad, the multiplier is e^(1.414) = 4.11. The tight end carries 4.11 times the slack end's tension, and the brake's net friction force is 3.11 times the slack tension.

### Which end the lever pulls

In a simple band brake one end is anchored to the frame and the other is attached to the lever close to its pivot. The lever then provides only the tension at its own end, multiplied by the lever ratio. If the drum turns so that it drags the band towards the anchor, the anchor carries the tight-side tension and the lever only the slack-side tension: the friction does most of the work. If the drum turns the other way, the lever's end becomes the tight side, and the lever must provide the large tension. The brake is the same, but in one direction it needs about four times the lever force of the other.

On the SW-25 the direction that matters is the lowering direction, the one in which the load always pulls. The band is arranged so that the drum, turning in the lowering direction, drags the band towards its anchor.

## Holding the boat

The holding torque, with the yard's factor of 1.5 on the load torque with rolling resistance ignored, is 9,165.1 N·m, as in Chapter 7. The brake rim is 700 mm in diameter.

The [band brake tool](/tools/band-brake/) takes the braking torque, the drum diameter, the wrap angle, the friction coefficient, the lever length from the pivot to the applied force, the distance from the pivot to the slack-end attachment, and the band width. It returns the tight and slack tensions, the lever force and the peak lining pressure. It assumes the drum rotates so that the anchored end is the tight side, and it reminds the user that reversing the drum greatly increases the lever force. It does not check heat or wear.

```figure
type: steps
title: Holding the SW-25's boat in the band brake tool
caption: This is an illustration. Holding torque 9,165.1 N·m, rim 700 mm, wrap 270°, μ = 0.30, lever 1,200 mm, slack end 50 mm from the pivot, band 120 mm wide.
- Tight side tension | 34,603 N
- Slack side tension | 8,417 N
- * Lever force | 350.7 N
- Peak lining pressure | 0.824 MPa
```

The lever multiplies the slack tension by 50 ÷ 1,200, so the 8,417 N slack tension needs only 350.7 N at the handle. Compare Chapter 7's single shoe, which needed 20.5 kN for the same torque. The band's wrap does the work the shoe brake asked of the lever.

The first layout, with a 900 mm lever and a 100 mm band, needed 516 N at the lever and 1.09 MPa at the tight end to make the stopping case below. A longer lever and a wider band brought both within the yard's limits of 400 N and 1.0 MPa; these limits are illustrations.

## A brake that applies itself

The refit applies the band with a weight, not the operator's hand. A 40 kg weight on the end of the lever, 392.4 N, holds the brake on whenever the operator lets go. To lower a boat, the operator lifts the lever, reducing the band's tension until the brake's torque just balances the load and the drum turns at the speed the operator chooses. Letting go applies the full brake. The operator's force is therefore a releasing force, and the brake fails safe.

With μ = 0.30, the full weight gives a slack tension of 392.4 × 1,200 ÷ 50 = 9,418 N, a brake torque of 10,255 N·m, 1.68 times the load torque, and a peak pressure of 0.922 MPa. To lower at a steady speed the brake must produce exactly the load torque, 6,110.1 N·m, which needs 233.8 N at the lever; the operator lifts the other 158.6 N. If the lining's friction is at the top of its range, 0.35, the weight gives 13,856 N·m and the operator must lift 219.4 N to lower.

```figure
type: compare
title: The weighted band brake across the lining's friction range
cols: Full-weight torque | Times the load torque | Peak pressure | Operator's lift to lower steadily
rowhead: Friction coefficient
- * 0.30 | 10,255 N·m | 1.68 | 0.922 MPa | 158.6 N
- 0.35 | 13,856 N·m | 2.27 | 1.167 MPa | 219.4 N
caption: This is an illustration. 40 kg weight on a 1,200 mm lever, slack end at 50 mm, rim 700 mm, wrap 270°, band 120 mm. At the higher friction the tight-end pressure reaches 1.17 MPa when the full weight is applied, above the 1.0 MPa working figure; that applies only during a full application, and the lining maker's rating for such short duty is one of the yard's open checks.
```

## Stopping a lowering

The band brake must also stop a lowering quickly if the operator lets go. The yard's target is a stop within 2 s from the lowering speed of 10 m/min, 0.556 rad/s at the drum, with the load overhauling and the same factor of 1.5.

The [band brake stopping design tool](/tools/band-brake-stop-design/) takes the inertia at the drum, the speed at the start of braking, the required stopping time, the load torque and whether it resists motion or drives it, as in lowering, and a service factor; the drum diameter, wrap, friction, lever lengths, band width, the lever force available and the allowable lining pressure; and the drum mass, its specific heat and the stops per hour. It returns the torque to stop in time, the design torque with the service factor, the band tensions, the lever force, the peak pressure, the actual stopping time and turns at the design torque, the energy per stop, the drum's temperature rise and the average heat, with checks on lever force and pressure and a reminder to confirm that the anchored end is the tight side.

```figure
type: steps
title: Stopping a lowering in the band brake stopping design tool
caption: This is an illustration. Inertia 2,275 kg·m² at the drum, 5.305 rpm, stop in 2 s, load torque 6,110.1 N·m overhauling, service factor 1.5; rim 700 mm, wrap 270°, μ = 0.30, lever 1,200 and 50 mm, band 120 mm, 400 N available, 1.0 MPa allowed; rim 150 kg at 460 J/(kg·K), four stops an hour.
- Torque to stop in time | 6,742 N·m
- Design braking torque | 10,113 N·m
- Tight and slack tension | 38,181 N and 9,287 N
- * Lever force | 387.0 N: within 400 N
- Peak lining pressure | 0.909 MPa: within 1.0 MPa
- Actual stopping time | 0.32 s
- Energy per stop | 0.89 kJ
```

Most of the design torque holds the load: 6,110 N·m of the 6,742 N·m needed to stop in 2 s. Only 632 N·m decelerates the inertia. At the design torque the drum stops in 0.32 s, having turned 0.014 revolutions, about 26 mm of rope. The 40 kg weight provides 392.4 N, more than the 387.0 N the design asks for, so letting go of the lever stops the boat within the target.

## The heat of a controlled lowering

The stop's energy is under a kilojoule. The lowering's energy is not. Lowering 60 m at 10 m/min takes 360 s, and if rolling resistance is low the brake absorbs the load torque times the drum's rotation for all of that time: 6,110.1 × 0.556 = 3.39 kW, or 1,222 kJ for the whole lowering, the potential energy of Chapter 1.

```figure
type: bars
title: Brake energy in one SW-25 lowering, 25 t on the 60 m slip
x: Case
y: Energy, kJ
caption: This is an illustration. Stopping energy at 1.5 times the load torque, from the stopping tool. Controlled lowering energy is the load torque times the drum's turning, with and without rolling resistance's help.
- Emergency stop from 10 m/min | 0.89
- * Controlled lowering, rolling resistance ignored | 1222
- Controlled lowering, rolling resistance 0.02 | 929
```

Into the 150 kg rim, with no cooling, 1,222 kJ is a temperature rise of 17.7 K; spread over six minutes, much of it is shed to the air as it goes. The lining's surface runs hotter than the rim's average, and Chapter 2's guidance applies: the lining must stay within its temperature limit. The yard measures the rim's temperature with an infrared thermometer after each lowering and allows a second lowering only when it has fallen below 50 °C. The band brake stopping tool's heat figures cover a stop, not a lowering; the lowering's heat has to be worked separately, as here.

## The band, the anchor and the pin

The band brake's multiplication has a price: the anchor must carry the tight-side tension. In the stopping case that is 38,181 N, nearly four tonnes, on a pin and bracket bolted to the winch frame. The band itself carries the same tension in its steel. The SW-25's band is 120 mm wide and 3 mm thick, so the tight end's tensile stress is 38,181 ÷ (120 × 3) = 106 MPa, and the 20 mm anchor pin, in double shear, carries 38,181 ÷ (2 × 314.2) = 60.8 MPa. Both are comfortable for the steels specified, but both had to be checked, and both are higher at the top of the friction range, where the full weight gives a tight-side tension of 49,005 N.

The band also bends round the drum each time it is applied and straightens when released, and the rivets or bonding that hold the lining to it see a shear from the friction along the whole wrap. The lining must be fixed so that its edges cannot lift and catch; bonded linings or countersunk rivets, inspected at each service, are the usual answer.

## Differential band brakes

In a simple band brake one end of the band is anchored to the frame. In a differential band brake both ends are attached to the lever, on opposite sides of its pivot, so that pulling the lever tightens one end and slackens the other. The lever force then depends on the difference between the slack-side tension times one arm and the tight-side tension times the other.

The arrangement reduces the lever force further, and if the arms are chosen so that the tight side's moment exceeds the slack side's, the brake becomes self-locking, exactly as Chapter 7's shoe brake did. Differential bands are sometimes made self-locking on purpose, to act as a backstop that lets a drum turn one way and locks it the other. For a brake that must control a lowering they share the shoe brake's danger: their behaviour depends on the friction coefficient, and a band that is controllable when the lining is damp may grab when it is dry. The SW-25 uses a simple band for that reason.

## The mistake: anchored at the wrong end

The refit's first general-arrangement drawing showed the band's anchor and lever ends the other way round from the layout above. In hauling the arrangement would have been strong, but in the lowering direction the lever would be at the tight end.

The reviewer caught it by tracing the drum's rotation on the drawing: lowering, the rim's surface under the band moves away from the anchor end, dragging the band towards the lever. With the weight on the lever, the tight-side tension at the lever end would be only 392.4 × 1,200 ÷ 50 = 9,418 N, the slack end 9,418 ÷ 4.11 = 2,291 N, and the brake torque (9,418 − 2,291) × 0.35 m = 2,494 N·m. That is 41% of the load torque: the brake would not hold the boat, and a lowering, once started, could not be stopped.

The band brake tool's own warning, that reversing the drum greatly increases lever force, is the clue. The drawing was corrected, and the yard added a check to its method: draw an arrow for the drum's rotation in the direction the load drives it, and confirm that the arrow points along the band towards the anchor.

```figure
type: checklist
title: Band brake checks on the SW-25
caption: This is an illustration.
- x Rotation in the load's direction drags the band towards the anchor
- x Holding and stopping checked at the lowest friction expected
- x Peak pressure at the tight end checked at the highest friction expected
- x Weight on the lever applies the brake when the operator lets go
- x Lowering heat estimated separately from stopping heat
- x Rim temperature checked before a second lowering
- ? Lining maker's short-duty pressure rating for full application at high friction
```

## Exercise: a band brake on a hoist drum

**Problem.** A hand-operated band brake on a 500 mm drum must provide 800 N·m. The wrap is 240°, μ = 0.30, the lever is 800 mm long with the slack end 60 mm from the pivot, and the band is 80 mm wide. Find (a) the friction multiplier, (b) the tensions, lever force and peak pressure, and (c) the lever force if the drum turned the other way.

**Answer.** (a) θ = 240° = 4.189 rad. e^(0.30 × 4.189) = e^(1.257) = 3.514.

(b) Net force = 800 ÷ 0.25 = 3,200 N. T2 = 3,200 ÷ (3.514 − 1) = 1,273 N; T1 = 4,473 N. Lever force = 1,273 × 60 ÷ 800 = 95.5 N. Peak pressure = 4,473 ÷ (250 × 80) = 0.224 MPa.

(c) With the lever at the tight end: 4,473 × 60 ÷ 800 = 335.5 N, 3.5 times as much. A brake that is easy in one direction is heavy in the other, and it must be checked in the direction the load drives it.

The multiplier also explains why a wet band is dangerous. If water on the lining dropped μ to 0.20, the multiplier at 240° would fall to e^(0.838) = 2.31, and the same 95.5 N lever force would hold only about 420 N·m, barely half the torque required.
