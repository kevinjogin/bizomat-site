---
book: clutches-and-brakes-by-the-numbers
chapterSlug: shoe-brakes
order: 7
title: "Shoe brakes"
description: "How a shoe brake's lever, pivot and friction combine: normal and lever forces, self-energising and de-energising directions, self-locking, shoe pressure and the side load on the drum shaft."
draft: false
---

The shoe brake is the oldest brake in machinery: a block pressed against a turning wheel by a lever. It is simple to make and easy to understand, and it has one property that makes it worth a chapter even where it is not the right choice. The friction on the shoe produces a moment about the lever's pivot, and depending on the direction of rotation, that moment either helps press the shoe on or pushes it off. A shoe brake can therefore be much stronger one way than the other, and with the wrong geometry it can lock itself on.

This chapter examines the single-shoe brake the SW-25 had when the yard bought it, using the WORKOS single-shoe brake tool. It works out why the yard replaced it, shows how self-energising works and when it becomes self-locking, and covers the double-shoe brake that solves the old brake's worst problem. Its mistake is a refit proposal that cured a heavy lever by making the brake grab.

## The old drum brake

The SW-25's original drum brake was a single cast-iron shoe lined with a woven lining, acting on the 700 mm brake rim of the drum. A lever pivoted on the winch frame pressed the shoe against the rim. Measured from the old drawings, the applied force acted 1,200 mm from the pivot, the shoe's normal force acted along a line 300 mm from the pivot, and the friction force at the rim acted along a line 60 mm from the pivot. The shoe's contact area was 30,000 mm².

The yard's rule for a drum brake that holds a load is a holding torque of 1.5 times the load torque, with rolling resistance ignored, as set out in Chapter 1: 1.5 × 6,110.1 = 9,165.1 N·m. This is an illustration; the factor for a real winch comes from its design standard. Chapter 2's guidance on friction gives the old lining's lowest expected coefficient, 0.30.

## How the lever and shoe share the force

At the rim's radius of 0.35 m, the holding torque needs a friction force of 9,165.1 ÷ 0.35 = 26,186 N. With μ = 0.30 the shoe must press on the rim with 26,186 ÷ 0.30 = 87,287 N. The lever must provide that normal force through its geometry, and the friction force adds its own moment about the pivot.

```figure
type: svg
title: A single-shoe brake and the moments about its pivot
alt: A large circle representing the brake rim, with a shoe pressed against its right side. A lever runs vertically past the shoe, pivoted at its lower end, with an applied force F at its upper end pushing towards the rim. The distance from the pivot to the applied force is labelled a. The line of the normal force from the shoe onto the rim passes a distance b from the pivot. The friction force, tangent to the rim at the shoe, passes a distance c from the pivot. A curved arrow shows the rim's rotation.
caption: Taking moments about the pivot: F a = N b ∓ μ N c. When the rim's rotation drags the shoe in the direction that turns the lever towards the rim, friction helps apply the brake (self-energising) and the minus sign applies; in the other direction friction pushes the shoe off and the plus sign applies.
viewbox: 0 0 640 360
body:
<circle class="bx" cx="220" cy="180" r="130"/>
<rect class="fa" x="350" y="130" width="26" height="100"/>
<path class="ln" d="M400 330V40"/>
<circle class="bx" cx="400" cy="330" r="7"/>
<path class="ln" d="M376 180H400"/>
<path class="la" d="M480 50H404"/>
<text class="txb" x="488" y="56">F</text>
<path class="dsh" d="M410 330H560M410 50H560M410 180H560"/>
<path class="la" d="M540 330V54"/>
<text class="txb" x="548" y="200">a</text>
<path class="la" d="M590 330V184"/>
<text class="txb" x="598" y="260">b</text>
<path class="la" d="M300 60A150 150 0 0 1 350 110"/>
<text class="tx txs" x="250" y="40">rotation</text>
<text class="tx txs" x="410" y="346">pivot</text>
<text class="tx txs" x="150" y="186">brake rim, 700 mm</text>
<path class="dsh" d="M363 120V320"/>
<text class="tx txs" x="300" y="300">friction line, c from pivot</text>
```

The [single-shoe brake tool](/tools/shoe-brake/) takes the braking torque, the drum diameter, the friction coefficient, the three lever dimensions a, b and c, the direction of rotation relative to the pivot, and the shoe's contact area. It returns the normal force on the shoe, the friction force, the lever force and the shoe pressure, and checks whether the geometry is self-locking in the self-energising direction. It uses the short-shoe model, which treats the pressure as uniform over the shoe, and it does not check heat.

```figure
type: steps
title: The SW-25's old drum brake in the single-shoe brake tool
caption: This is an illustration. Holding torque 9,165.1 N·m, rim 700 mm, μ = 0.30, a = 1,200 mm, b = 300 mm, c = 60 mm, contact area 30,000 mm², self-energising in the lowering direction.
- Normal force on the shoe | 87,287 N
- Friction force | 26,186 N
- * Lever force | 20,512 N
- Shoe pressure | 2.91 MPa
- Self-locking | No
```

A lever force of 20.5 kN is about the weight of two tonnes. No operator can hold that by hand, and the old brake had been worked by a weighted lever and a hand screw, which were slow to apply and impossible to modulate during a lowering. The shoe pressure of 2.91 MPa was also well above the 1.0 MPa the woven lining's maker allows. The old brake could only ever have been adequate for a much lighter boat, or with a friction coefficient higher than anyone could rely on.

## Self-energising, de-energising and the direction of the load

The SW-25's drum turns one way while lowering and the other while hauling. The old brake was arranged so that in the lowering direction friction helped press the shoe on: the lever's effective arm for the normal force is b − μc = 300 − 0.30 × 60 = 282 mm. Hauling, friction works against the lever and the arm becomes b + μc = 318 mm, so stopping a haul needs 23,131 N, 13% more.

```figure
type: compare
title: The old brake in each direction of rotation
cols: Effective arm | Lever force for 9,165.1 N·m
rowhead: Direction
- * Lowering, self-energising | b − μc = 282 mm | 20,512 N
- Hauling, de-energising | b + μc = 318 mm | 23,131 N
caption: This is an illustration. μ = 0.30. On a winch whose load always pulls in the lowering direction, the brake's working direction is the lowering one, and that is the direction to make self-energising.
```

For a winch on a slipway the arrangement is sensible. The load always pulls the drum in the lowering direction, whatever the drum is doing at the moment. When the brake holds a stationary boat, or stops a lowering, the friction on the shoe acts in the self-energising sense. When it stops a haul, the drum is briefly turning the hauling way, but the load is decelerating it too: Chapter 10 shows that a hauling load stops the drive by itself in a fraction of a second.

### When self-energising becomes self-locking

The effective arm b − μc falls as the friction line moves further from the pivot. If it reaches zero, no lever force is needed: the friction alone presses the shoe on hard enough to keep the brake applied. The condition is b ≤ μc. For the old brake's b = 300 mm and μ = 0.30, that happens if c reaches 1,000 mm.

A self-locking brake grabs as soon as the shoe touches and cannot be released by easing the lever, because the lever is no longer holding it on. On a hoist or winch that is dangerous in two ways: the lowering cannot be controlled smoothly, and the shock of a brake that grabs can overload the rope, the drum shaft and the structure.

## The side load

A single shoe pushes the drum sideways. The normal force and friction force on the shoe, 87.3 kN and 26.2 kN, combine to a resultant of about 91.1 kN on the drum shaft, which its bearings must carry in addition to the rope pull. That was the second reason the yard rejected the old brake: the drum bearings had been sized for the rope, not for the brake.

The double-shoe brake answers the side load. Two shoes act on opposite sides of the drum, usually pressed on by a single spring and released by a thruster or solenoid, and their normal forces cancel. One shoe is self-energising and the other de-energising, so they carry slightly different torques for the same spring force, but the shaft sees only the difference of their friction forces.

The yard kept one double-shoe brake of this kind, on the old motor coupling, as a reference. With a 250 mm drum, μ = 0.40, a = 300 mm, b = 120 mm and c = 15 mm, the tool gives a lever force of 152 N on the self-energising shoe and 168 N on the de-energising shoe for 20 N·m each. Applied by one spring that puts 160 N on each lever, the two shoes carry 21.05 N·m and 19.05 N·m: 40.1 N·m together, with the shaft relieved of everything but the small difference.

```figure
type: stats
title: Single and double shoe brakes compared
caption: This is an illustration. Single shoe: the SW-25's old drum brake at its holding torque, μ = 0.30. Double shoe: the reference motor-coupling brake with 160 N on each lever, μ = 0.40.
- Single shoe: resultant side load on the drum shaft | 91.1 kN
- Single shoe: lever force | 20,512 N
- Double shoe: torque, self-energising shoe | 21.05 N·m
- Double shoe: torque, de-energising shoe | 19.05 N·m
- * Double shoe: total torque | 40.1 N·m
```

The SW-25's refit replaced the drum shoe brake with a band brake, examined in Chapter 8, which also multiplies a small lever force into a large one but spreads its pressure round most of the rim. The motor's spring-applied brake, examined in Chapter 10, does the job the double-shoe coupling brake used to do.

## Short shoes and long shoes

The tool's short-shoe model assumes the pressure is the same everywhere on the shoe and that the normal and friction forces act at the middle of the shoe. That is a good description of a shoe that covers a small arc of the drum. As the arc grows, two things change. The pressure is no longer uniform: on a rigid shoe pivoted away from the drum, it is greatest where the shoe's motion is most nearly square to the drum surface. And the friction acts over an arc rather than at a point, so its effective radius and its moment about the pivot both shift.

A common rule of thumb in machine design texts is that the short-shoe model is acceptable for shoes covering up to about 45° of the drum. The old SW-25 shoe was 250 mm long and 120 mm wide, an arc of about 41° on the 350 mm radius, at the edge of that range. Long-shoe analysis integrates the pressure over the arc and generally predicts a somewhat stronger self-energising effect than the short-shoe model does, which is one more reason to keep a self-energising design well away from the self-locking line.

## Heat in a shoe brake

A shoe brake puts all its friction through a small patch of lining, while the rim it rubs on passes under the shoe for only a fraction of each turn and spends the rest of the turn cooling. The rim, not the shoe, absorbs and sheds most of the heat. That suits occasional stops, and it suits a brake whose rim is large and well ventilated.

For the SW-25 the heat comes from lowering, which Chapter 1 showed can put up to 1,222 kJ into the brake on a single 60 m lowering when rolling resistance is low. Into the old 150 kg rim, without any cooling, that would be a rise of 1,222,000 ÷ (150 × 460) = 17.7 K, which the rim could carry. The shoe lining was another matter: its small area, at 2.9 MPa, was well beyond its pressure limit, and long lowerings under that pressure had glazed it. The yard's records showed two relinings in the previous three years.

## Inspecting a shoe brake

Because a shoe brake's strength depends so heavily on its geometry, its inspection checks the geometry as well as the lining. The yard's inspection sheet for the double-shoe reference brake asks for the lining thickness at each end of each shoe, the clearance between each shoe and the drum when released, the spring's length when applied, the pins and bushes at each pivot for wear, and the drum's surface for scoring or heat cracks. Worn pivot bushes move the pivot, change b and c, and change the self-energising effect without anyone noticing; a drum that has been skimmed to remove scoring has a smaller radius, so the same lever force gives less torque.

## The mistake: curing a heavy lever by making the brake grab

Before the band brake was chosen, a refit proposal tried to keep the old shoe and reduce its lever force by redesigning the lever so that the friction line passed further from the pivot. The proposal moved c from 60 mm to 1,050 mm, which with the design friction of 0.30 gives an effective arm of 300 − 315 = −15 mm.

The single-shoe brake tool flags this immediately as SELF-LOCKING. The reviewer then ran it across the lining's friction range. At μ = 0.25, on a damp morning, the arm is 37.5 mm and the brake needs 3,273 N at the lever: a light, controllable brake. At μ = 0.30 or above, on a dry afternoon, it locks. A brake whose behaviour switches between controllable and grabbing with the weather cannot be used to lower a boat.

```figure
type: compare
title: The proposed lever across the friction range
cols: b − μc | Lever force for 9,165.1 N·m | Behaviour
rowhead: Friction coefficient
- 0.25 | 37.5 mm | 3,273 N | Applies; light lever
- * 0.30 | −15 mm | none | Self-locking: grabs
- 0.35 | −67.5 mm | none | Self-locking: grabs hard
caption: This is an illustration. b = 300 mm, c = 1,050 mm, a = 1,200 mm, rim 700 mm. Self-energising geometry must keep b − μc comfortably positive at the highest friction the lining can reach, not only at the design value.
```

The principle is general: a brake's geometry must be checked at the highest friction coefficient expected, to be sure it does not lock, and at the lowest, to be sure it holds. Strong self-energising is attractive because it reduces the effort needed, and it is exactly the property that makes a brake sensitive to friction.

## Exercise: a conveyor tail-drum brake

**Problem.** A shoe brake on a conveyor's 400 mm tail drum must provide 300 N·m. μ = 0.35, a = 800 mm, b = 250 mm, c = 50 mm, and the shoe's area is 10,000 mm². Find (a) the normal and friction forces, (b) the lever force in each direction, (c) the shoe pressure, and (d) the offset c at which the brake would self-lock.

**Answer.** (a) Friction force = 300 ÷ 0.2 = 1,500 N. Normal force = 1,500 ÷ 0.35 = 4,286 N.

(b) Self-energising: arm = 250 − 0.35 × 50 = 232.5 mm; lever force = 4,286 × 232.5 ÷ 800 = 1,246 N. De-energising: arm = 250 + 17.5 = 267.5 mm; lever force = 1,433 N.

(c) Pressure = 4,286 ÷ 10,000 = 0.43 MPa.

(d) Self-locking when c ≥ b ÷ μ = 250 ÷ 0.35 = 714 mm. At c = 50 mm the brake is far from locking: its self-energising saves only 13% of the lever force, and its behaviour changes little with friction.

**The comparison.** The SW-25's old drum brake, like this one, had only a small self-energising effect: μc was 6% of b. The refit proposal tried to make the effect large and pushed it past the locking line. A modest ratio, like this conveyor brake's, gives up some of the force saving in exchange for a brake that behaves the same on wet and dry days.
