---
book: buckling-by-the-numbers
chapterSlug: temporary-frames-and-shear-legs
order: 10
title: "Temporary frames and shear legs"
description: "Buckling and stability of temporary lifting frames: leg forces, foot thrust and leg buckling of shear legs, why an A-frame has no stiffness out of its plane, and a lift that swung."
draft: false
---

Temporary works are where buckling and instability catch people most often. A lifting frame, a set of props or a pair of shear legs is put up in an afternoon from whatever is on hand, used for a day and taken down. It gets less design attention than the permanent structure it serves, it is often loaded closer to its limit, and its members are long, light and easily bent. Above all, temporary frames are frequently unbraced in at least one direction, and Chapter 2 showed what that does.

This chapter works through a set of shear legs used to lift a pump set out of a pit beside HT-8. It applies the leg checks with a KEVOS® tool, explains the out-of-plane instability that makes shear legs dangerous, and describes a lift that swung.

## Shear legs

Shear legs are two poles or tubes, lashed or pinned together at the top, with their feet spread apart on the ground and a lifting block hung from the head. They lean slightly, so that the head is over the load. In their own plane, the two legs and the ground form a triangle, which is stiff. Out of their plane, they are two pins on the ground and one pin at the top: a mechanism that can rotate about the line through the feet with no resistance at all. Shear legs therefore always need guys, ropes or chains from the head to anchors in front and behind, to hold them upright out of their plane.

This is an illustration. The transfer pump set next to HT-8, a pump, motor and baseplate weighing 650 kg, sits in a pit 2 m deep under an overhead pipe rack where no crane can reach. To lift it out for an overhaul, the maintenance crew rig shear legs of two CHS 60.3 × 3.6 tubes in grade C350, each 5,000 mm long, pinned together at the head, with their feet 2,600 mm apart on the floor beside the pit and tied together with a chain. A chain block hangs from the head. The crew take the load at the head as 7.0 kN, covering the pump set, the chain block and the slings.

```figure
type: svg
title: Shear legs in their own plane and out of it
alt: Two views of shear legs. On the left, the view in the plane of the legs: two legs meet at the head above a load, with their feet spread apart and joined by a tie, forming a triangle. Arrows show the load at the head, the compression in each leg and the outward thrust at each foot resisted by the tie. On the right, the side view: the legs appear as a single line from the feet to the head, with a front guy and a back guy running from the head down to anchors on the ground on either side. A dashed line shows the head leaning forward, which only the guys resist.
caption: In its own plane the frame is a triangle and is stiff; the leg forces and foot thrust follow from the geometry. Out of its plane it is a hinged mast, held only by its guys.
viewbox: 0 0 640 330
body:
<path class="la draw" pathLength="1" d="M70 290L170 50L270 290"/>
<circle class="fa" cx="170" cy="50" r="6"/>
<path class="ln" d="M170 56V160"/>
<rect class="bxa" x="145" y="160" width="50" height="34"/>
<path class="ln dsh" d="M70 296H270"/>
<path class="ah" d="M60 286L70 296L60 306Z"/>
<path class="ah" d="M280 286L270 296L280 306Z"/>
<text class="txb" x="142" y="214">load W</text>
<text class="tx txs" x="110" y="320">tie between the feet</text>
<text class="tx txs" x="40" y="24">in the plane of the legs</text>
<path class="la draw" pathLength="1" d="M460 290L460 50"/>
<path class="ln dsh" d="M460 290L500 54"/>
<circle class="fa" cx="460" cy="50" r="6"/>
<path class="ln" d="M460 50L360 290"/>
<path class="ln" d="M460 50L590 290"/>
<rect class="bx" x="352" y="290" width="16" height="10"/>
<rect class="bx" x="582" y="290" width="16" height="10"/>
<text class="tx txs" x="330" y="320">front guy anchor</text>
<text class="tx txs" x="520" y="320">back guy anchor</text>
<text class="tx txs" x="504" y="70">head leaning</text>
<text class="tx txs" x="410" y="24">out of the plane</text>
```

## The leg forces

The load at the head is shared by the two legs. If each leg makes an angle θ with the vertical in the plane of the frame, the compression in each leg and the outward thrust at each foot are:

F_leg = W ÷ (2 × cos θ) and H_foot = W × tan θ ÷ 2

With feet 2,600 mm apart and legs 5,000 mm long, sin θ = 1,300 ÷ 5,000 = 0.26, so θ = 15.07°. The head is √(5,000² − 1,300²) = 4,828 mm above the floor.

The KEVOS® [Shear legs (A-frame) check](/tools/shear-legs-check/) tool does the geometry and the leg check together. From the leg length, the spread between the feet, the load at the head, the tube's outside diameter and wall, its modulus and yield, the effective length factor, the required factor on buckling and the capacity of the foot tie or anchors, it gives the apex angle, head height, force in each leg, outward thrust at each foot, the leg's slenderness and buckling load by Euler or Johnson, the buckling factor and a check of the tie. Its checks include a reminder to guy the head fore and aft, because shear legs are unstable out of their plane, and its guide notes that the load is taken as hanging centrally at the apex in the plane of the legs.

```figure
type: steps
title: The pump-set shear legs in the shear legs check tool
caption: This is an illustration. Legs CHS 60.3 × 3.6, C350, pinned at both ends (K = 1.0) on their full 5,000 mm length; required factor on buckling 3; foot tie chain rated at 2 kN.
- Geometry | apex angle 30.14°, each leg 15.07° from vertical, head height 4,828 mm
- Force in each leg | 7.0 ÷ (2 × cos 15.07°) = 3.62 kN
- Outward thrust at each foot | 7.0 × tan 15.07° ÷ 2 = 0.94 kN, within the 2 kN tie
- Leg slenderness | 5,000 ÷ 20.09 = 249, Euler
- Leg buckling load | 20.4 kN
- * Factor on buckling | 20.4 ÷ 3.62 = 5.64, above the required 3
```

In its own plane, the frame is comfortable. The legs, at a slenderness of 249, are very slender, so the shop treats a factor of 3 as its minimum for temporary lifting frames: such legs are easily bent in handling, and a bend acts as a large initial bow (Chapter 5). The crew sight along each leg before every use, and reject a leg with a visible bend.

### Spreading the feet

It is tempting to spread the feet wider to make the frame feel more stable. In the plane of the frame it does feel steadier, but the forces rise.

```figure
type: compare
title: The same shear legs with the feet at two spreads
cols: Leg angle from vertical | Head height, mm | Force in each leg, kN | Thrust at each foot, kN | Factor on buckling
rowhead: Spread between feet
- * 2,600 mm | 15.07° | 4,828 | 3.62 | 0.94 | 5.64
- 4,500 mm | 26.74° | 4,465 | 3.92 | 1.76 | 5.21
caption: This is an illustration. Same legs, load and tool inputs. Spreading the feet loses 363 mm of head height, raises the leg force by 8% and nearly doubles the outward thrust at each foot.
```

The thrust at the feet is the quantity that grows fastest. At 4,500 mm spread it is 1.76 kN at each foot, still within the 2 kN chain, but on a smooth concrete floor without a tie, the feet would slide outwards and the frame would collapse in its own plane. The foot tie is not optional.

## The danger is out of the plane

All of the forces above assume the head stays exactly in the plane of the feet. Out of that plane, the frame has no stiffness of its own. It is the extreme case of Chapter 2's sway frame: pinned at the feet, pinned at the head, nothing to stop it rotating. Its effective length out of its plane is, in effect, infinite, and its only resistance comes from the guys.

The guys must hold the head against any horizontal force that tries to move it out of the plane. If the head leans forward by a distance δ, the load W, still hanging vertically, has a lever arm δ about the line of the feet, and the back guy must supply a horizontal force at the head of about W × δ ÷ h, where h is the head height.

```figure
type: compare
title: Horizontal force the back guy must supply as the head leans
cols: Horizontal force at the head, kN | Share of the load
rowhead: Forward lean of the head
- 100 mm | 0.145 | 2.1%
- * 300 mm | 0.435 | 6.2%
- 500 mm | 0.725 | 10.4%
caption: This is an illustration. Load 7.0 kN, head height 4,828 mm. The forces are small, but without a guy there is nothing at all to supply them, and the lean then grows without limit.
```

The forces are small, which is exactly why guys are skimped. A guy needs only to be strong enough for a few per cent of the load, plus any swing or snatch, but it needs to be there and tight before the load comes off the ground. And when the load swings, as a load lifted out of a pit and pulled sideways to clear the edge always does, the horizontal force at the head can be many times larger than the lean alone suggests.

## The error: a lift that swung

This is an illustration. On the morning of the pump lift, the crew set up the shear legs and tied the feet, rigged a back guy to a column of the pipe rack, and intended to rig a front guy to an anchor point in the floor. The anchor's eye bolt was missing, and the crew decided to go ahead without the front guy, reasoning that the back guy and the load hanging under the head would hold the frame upright.

As the pump set cleared the pit, a fitter pulled it sideways with a tag line to swing it clear of the pit's edge. The load swung back past the vertical, towards the pit, and the head of the shear legs followed it forward. With no front guy, and with the back guy only able to pull, not push, nothing resisted the head moving towards the pit except the load's swing coming back. The head moved forward an estimated 300 mm before the load swung back and the frame settled. Nobody was hurt. The supervisor stopped the job.

The investigation was brief. The frame had been checked in its own plane, by the tool, and passed with a factor of 5.64. Nobody had checked it out of its plane, because out of its plane there is no capacity to calculate: it is a mechanism held up by its guys. A guy that can only pull holds the head against moving one way only; the head needs a guy on each side.

```figure
type: checklist
title: Before lifting with shear legs or any temporary A-frame
caption: The open item is the one the crew skipped. The forces in it are small; its absence makes the frame a mechanism.
- Legs checked for buckling and sighted for bends | factor of at least 3 on slender temporary legs
- Feet tied together or anchored against spreading | tie or anchors rated for the foot thrust
- Feet on firm, level bearing that cannot slide or sink | timber packing on soft ground
- ? Guys rigged and tensioned fore and aft before the load leaves the ground | anchors checked, not assumed
- Load lifted in the plane of the legs, with tag lines used only to steady it | no side pulls on the head
- Lift planned and supervised by a competent person | temporary works are still works
```

The lift was re-planned. A proper floor anchor was installed for the front guy, both guys were tensioned with ratchet straps before lifting, and the pump set was lifted vertically clear of the pit and then moved horizontally on a trolley run across the pit on two beams, so that no side pull was ever needed at the head.

## Feet, floors and lifting speed

Two smaller checks complete the frame. Each foot carries half the load vertically, 3.5 kN, plus the leg's own weight, onto the floor. On a concrete floor that is trivial; on a suspended timber floor, a grating or soft ground, it is not, and a foot that sinks on one side tilts the head out of the plane just as a lean does. The crew stood each foot on a 300 × 300 mm steel plate on timber packing, which spreads 3.5 kN to under 0.04 MPa, and checked that the plates sat level.

The second check is the speed of the lift. A chain block lifts slowly and smoothly, and the load at the head is close to the static weight. A load that is snatched, dropped onto slack slings, or allowed to run down and stopped suddenly can briefly put far more than its weight on the head, and on slender legs with a factor of 3 or so that margin can be used up in an instant. The crew's lift plan stated a hand chain block with no powered hoist, slings taken up slowly before the load was lifted, and no load lowered at speed.

## Longer legs and joints

The crew's next question was whether longer legs would let them lift the pump set clear of a higher obstruction. This is an illustration. With 6,500 mm legs of the same tube at the same 2,600 mm spread, the tool gives a head height of 6,369 mm, a leg force of 3.57 kN, a slenderness of 324, a buckling load of 12.1 kN and a factor of 3.38: just above the required 3.

The arithmetic passes, but two warnings apply. A slenderness of 324 is extremely high; a leg that slender sags visibly under its own weight, bends easily when carried and is very sensitive to any bow. And longer legs are usually made by joining two shorter tubes with a sleeve. A sleeved joint that is loose, or a pin through a sleeve with clearance, behaves like a kink: an offset at mid-length that the axial load amplifies, exactly as Chapter 5 described. The shop's rule for temporary legs is to keep the slenderness below about 250 and to use single lengths or properly designed splices, not improvised sleeves.

## Other temporary compression members

The lessons apply to every temporary frame:

- **Adjustable steel props** are struts whose capacity falls as they are extended, because their effective length grows and the joint between the inner and outer tubes adds an offset. Their maker's load tables, by extension, are the only valid source of their capacity; they must be plumb, braced if tall, and set on a firm base.
- **Portable gantries** are A-frames at each end joined by a beam. The beam braces the A-frames in one direction only; out of the plane of the A-frames, a gantry without diagonal bracing can rack and collapse sideways.
- **Packing and jacking stacks** under a frame being levelled are stocky in the vertical direction but can slide or topple if not square and stable.

In every case the question from Chapter 2 is the first one to ask: in each direction, what stops the top moving sideways relative to the bottom?

## Exercise: a heavier lift

This is an illustration. The overhaul finds the pump's motor needs replacing with a larger one, and the new pump set weighs 950 kg. With chain block and slings, the crew take the load at the head as 10 kN, on the same legs, at the same 2,600 mm spread.

1. What are the force in each leg and the thrust at each foot?
2. What is the factor on buckling, and is it acceptable?
3. A guy anchor rated at 0.5 kN is available. If the head leans forward by 300 mm, what horizontal force must the guy supply, and is the anchor enough for the lean alone?
4. What else should the crew consider?

**Worked answer.**

1. With θ = 15.07° as before: F_leg = 10 ÷ (2 × 0.9656) = **5.18 kN**; H_foot = 10 × 0.2692 ÷ 2 = **1.35 kN**, within the 2 kN chain.
2. Factor = 20.4 ÷ 5.18 = **3.94**, above the required 3. **Acceptable** for leg buckling, provided the legs are straight.
3. H ≈ 10 × 300 ÷ 4,828 = **0.62 kN**, more than the 0.5 kN anchor. **Not enough**, even before any swing or snatch is allowed for. A stronger anchor is needed, and the guy's own tension, which is larger than its horizontal component because it runs at an angle to the ground, must be checked too.
4. The floor's capacity under each foot, the chain block's and slings' working load limits for 950 kg, the head pin's strength, and whether a heavier lift is better done with a hired gantry or a mobile crane with a long reach. A lift plan, checked by a competent person, should cover all of these.
