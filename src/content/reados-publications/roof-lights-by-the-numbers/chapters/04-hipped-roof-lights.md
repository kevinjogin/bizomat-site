---
book: roof-lights-by-the-numbers
chapterSlug: hipped-roof-lights
order: 4
title: "Hipped roof lights: hips, jacks and backing angles"
description: "Work out RL-24's rise, ridge, common and hip bar lengths, the hip's pitch and plan angle, the backing angle its glazing faces must be folded to, and jack bar lengths and cuts."
draft: false
---

A hipped roof light is a small hipped roof made of glass. Its geometry is the same as a carpenter's hipped roof: a rectangle of eaves, faces rising at a pitch, hips where adjacent faces meet, and a ridge where the two long faces meet at the top. The difference is precision. A timber roof can be planed and packed to fit; a glazed roof light must fit its glass to within a few millimetres, so every length and angle is calculated before metal is cut.

This chapter works out RL-24's geometry from its eaves rectangle and pitch: the rise, the ridge, the common bars, the hips with their true length, pitch and plan angle, the **backing angle** to which a hip's glazing faces are folded, and the lengths and cuts of jack bars. The failure case is a set of hip bars made with flat tops, on which the glass rocked.

## The reference plane

Every calculation needs a reference. In a glazed roof light, the natural reference is the **glass line**: the plane on which the underside of the glass sits, which is the line of the rebates in every bar. The 1922 trade course made the same point about its curbs and bars, that the rebates must lie in one line for the glass to bed true. If the commons, hips and ridge have different depths, as RL-24's do, each is positioned so that its rebates lie in the glass planes, and its own depth hangs below.

RL-24's eaves rectangle, at the glass line, is **2,400 × 1,200 mm** in plan, matching the kerb opening; the frame sits on the kerb and the glass line starts at its inner rebate. All four faces rise at **25°**.

## Rise, ridge and commons

With all four faces at the same pitch, the ridge sits centrally, half the short dimension in from each long side and the same distance in from each end. The horizontal **run** from either long eave to the ridge is half of 1,200 mm, **600 mm**.

```figure
type: formula
title: RL-24's rise, ridge and common bars
formula: rise = run × tan(pitch)        common = run ÷ cos(pitch)        ridge = length − width
caption: This is an illustration for equal 25° pitches on all faces. Every common bar, on the long faces and the ends, is the same length, because every face has the same pitch and the same run.
- Run | 1,200 ÷ 2 = 600 mm
- Rise | 600 × tan 25° ≈ 279.8 mm
- Common bar, on the slope | 600 ÷ cos 25° ≈ 662.0 mm
- Ridge | 2,400 − 1,200 = 1,200 mm
step: Check: 662.0² ≈ 600² + 279.8², so the common, run and rise form a right triangle
```

The ridge length follows from the plan. Each hip runs from an eaves corner to the end of the ridge, rising 279.8 mm over a plan distance that takes it 600 mm in from the long side and 600 mm in from the end. So each end of the ridge is 600 mm in from the end eave, and the ridge is **2,400 − 2 × 600 = 1,200 mm** long.

## The plan

```figure
type: svg
title: Plan of RL-24 at the glass line
alt: A rectangle representing the eaves, twice as long as it is wide. A ridge line runs along the middle for half the rectangle's length. Four diagonal hip lines run from the rectangle's corners to the ends of the ridge. Short common bar lines run square from the long sides to the ridge at each end of the ridge and at its middle, and from the middle of each short side to the ridge end.
caption: This is an illustration at 1:10 of the bar centre-lines. Hips run at 45° in plan. Eight commons, all 662.0 mm on the slope: three meet the ridge from each long side, and one from each end.
viewbox: 0 0 640 340
body:
<rect class="bx" x="80" y="50" width="480" height="240"/>
<path class="la draw" pathLength="1" d="M200 170H440"/>
<path class="ln" d="M80 50L200 170M80 290L200 170M560 50L440 170M560 290L440 170"/>
<path class="lf" d="M200 50V290M320 50V290M440 50V290M80 170H200M440 170H560"/>
<circle class="fa" cx="200" cy="170" r="4"/>
<circle class="fa" cx="440" cy="170" r="4"/>
<text class="txs" x="270" y="40">2,400 eaves</text>
<text class="txs" x="18" y="174">1,200</text>
<text class="txa" x="280" y="162">ridge 1,200</text>
<text class="txs" x="96" y="112">hip</text>
<text class="txs" x="212" y="112">common</text>
<text class="txs" x="130" y="320">600</text>
<text class="txs" x="250" y="320">600</text>
<text class="txs" x="370" y="320">600</text>
<text class="txs" x="490" y="320">600</text>
```

## The hip

A hip is the most interesting member in the roof light, because it lies in neither face. It runs diagonally upwards between two faces, so it is longer than a common, flatter than the faces and set at an angle in plan.

### Plan angle and plan length

With equal pitches on the two faces it divides, a hip bisects the corner in plan: it runs at **45°** to both eaves. Its plan length, from the corner to the point under the ridge end, is the diagonal of a 600 × 600 mm square: **600 × √2 ≈ 848.5 mm**.

### True length and pitch

The hip rises the same 279.8 mm as the commons, but over its longer plan length. Its true length, along the bar, is the hypotenuse of plan length and rise, and its pitch is the angle whose tangent is rise over plan length.

```figure
type: formula
title: RL-24's hip bars
formula: hip true length = √(plan length² + rise²)        hip pitch = arctan(rise ÷ plan length)
caption: This is an illustration. Measured on the face, the hip is also the hypotenuse of the 600 mm eave run and the 662.0 mm common, which gives the same length and is the shop's independent check.
- Plan length | 600 × √2 ≈ 848.5 mm
- Rise | 279.8 mm
- True length | √(848.5² + 279.8²) ≈ 893.5 mm
- Hip pitch | arctan(279.8 ÷ 848.5) ≈ 18.25°
- Check on the face | √(600² + 662.0²) ≈ 893.5 mm
step: The hip is about 35% longer than a common and pitched about 7° flatter than the faces
```

The check on the face is worth understanding. Lay a long face of the roof light flat: it is a trapezium with a 2,400 mm base, a 1,200 mm top and a slant height of 662.0 mm. The hip is its sloping end, running from the base corner to the end of the top edge, 600 mm along and 662.0 mm up the face. That right triangle in the face gives the hip's true length directly, without the plan. Two independent routes to the same number make an error unlikely.

### The angle between hip and common on the face

On the flattened face, the hip makes an angle with the eave of **arctan(662.0 ÷ 600) ≈ 47.81°**, and therefore an angle of **90 − 47.81 = 42.19°** with the commons and jacks that run square up the face. That angle is the cut on the end of a jack where it meets the hip, measured in the plane of the glass. It is not 45°, which is the plan angle; using 45° for the jack cut is a common error that leaves a wedge-shaped gap at every jack.

## The backing angle

The two faces that meet at a hip are not in one plane. Seen in a section cut square across the hip, they meet at an angle, the **dihedral angle** between the faces. A hip bar has a glazing rebate on each side, and each rebate must lie in its own face. So the top of the hip bar is not flat: its two glazing surfaces are each tilted down from the horizontal, across the bar, by the **backing angle**.

For two faces at the same pitch meeting over a square corner in plan, the backing angle can be found from the hip's pitch: **tan(backing) = sin(hip pitch) × tan(plan angle)**. With a plan angle of 45°, tan 45° = 1, and **tan(backing) = sin 18.25° ≈ 0.3131**, so the backing angle is **about 17.39°**. The dihedral angle between the faces, measured on the underside, is then **180 − 2 × 17.39 ≈ 145.22°**.

```figure
type: stats
title: RL-24's hip geometry for the shop
caption: This is an illustration. The backing angle is what the brake operator needs: each glazing face of the hip bar is folded 17.39° down from the bar's top centre-line.
- 893.5 mm | Hip true length | four required
- 18.25° | Hip pitch | the angle the hip rises at along its length
- *17.39° | Backing angle on each side | tan b = sin 18.25° × tan 45°
- 145.22° | Dihedral angle between the faces | measured on the underside, square to the hip
```

There is a second way to the same result that is useful as a check. The faces' upward normals each lean 25° from vertical, one towards each eave. The angle between the normals has a cosine of cos 25° × cos 25° ≈ 0.8214, giving **34.78°**, and the faces' dihedral angle is 180 − 34.78 = 145.22°. Half the difference from flat, 34.78 ÷ 2 = 17.39°, is the backing on each side.

### What the backing angle means for a folded hip bar

RL-24's hip bars are folded from aluminium sheet rather than extruded. Each is a channel with a raised centre rib that carries the capping, and a rebate on each side for the glass. The brake operator folds the two rebate flats at 17.39° from the bar's centre-plane horizontal, using a stay cut to the angle, not by eye. An extruded hip, if one is used, is either made with the backing angle built in for one pitch, or uses a hinged glazing adaptor that sets itself to the angle; neither works if the angle has not been calculated.

## Jack bars

On RL-24 the panes are 600 mm wide, so the triangles beside the hips have no intermediate bars. On a larger roof light, or with narrower panes, **jack bars** run up the face from the eave like short commons and stop against the hip. A jack is shorter than a common in proportion to its distance from the corner, measured along the eave.

On RL-24's face, a jack 300 mm from the corner would be **300 ÷ 600 × 662.0 = 331.0 mm** long, measured along its centre-line from the eave to where it meets the hip's centre-line. Every jack between the corner and the ridge-end common would differ in length by the same amount for each step in spacing: the jacks form a **common difference** series, which makes them quick to cut and easy to check. At the hip end, each jack has two cuts: the 42.19° cut in the face plane found earlier, and the backing angle, so that its end sits flush against the hip's tilted glazing face.

## The ridge-end node

At each end of the ridge, six members meet: the ridge itself, two hips, the two ridge-end commons from the long faces and the end common from the hipped end. On a timber roof the carpenter nails them together as they come. On a glazed roof light they must meet so that every rebate stays in its face and every capping can be sealed, which is hard to achieve by cutting and fitting the bars against each other.

RL-24's shop makes a small **ridge-end node** for each end: a folded and riveted aluminium piece with a short stub for each member, each stub set at the member's pitch and plan angle, with its rebates at the right backing. The bars slide over or into the stubs and are riveted. The node is developed once, from the numbers in this chapter, and checked on the jig with the ridge propped at its height. Its stubs carry the same backing angle as the hips they receive, so the glass seats correctly right up to the ridge end, which is where a hand-fitted junction most often leaks.

The node also locates the ridge in plan. With the ridge-end nodes fixed at 600 mm in from each end and centred across the width, the ridge cannot drift, and the hips' lengths are checked simply by measuring from each corner to the node.

## The bar cut list

The geometry ends in a cut list, the document the shop works from:

- **Eaves frame:** two lengths of 2,400 mm and two of 1,200 mm at the glass line, mitred at the corners.
- **Ridge:** one length of 1,200 mm between the ridge-end nodes, in the deeper ridge section from Chapter 3.
- **Commons:** eight of 662.0 mm on the slope, each with a plumb cut at the ridge and a seat cut at the eaves frame set at the 25° pitch.
- **Hips:** four of 893.5 mm, backed at 17.39°, each with its plumb cut at the node and its seat at the eaves corner set at the 18.25° hip pitch.

In all, about **5,296 mm** of common bar, **3,574 mm** of hip bar, **1,200 mm** of ridge and **7,200 mm** of eaves frame. Each bar is listed with its section, length, end cuts and backing, so the person at the saw does not need to understand the geometry to cut it correctly; the geometry has been done once, in the office, and checked.

## Setting out on the jig

The geometry is proved in the shop before any glass is ordered:

```figure
type: steps
title: Setting out RL-24's bars on the shop jig
caption: This is an illustration. Each step checks a calculated number against the assembled bars.
- Lay out the eaves frame | 2,400 × 1,200 mm at the glass line; diagonals equal at about 2,683.3 mm
- Prop the ridge | 1,200 mm long, its glass line 279.8 mm above the eaves and centred in plan
- Fit the hips | 893.5 mm, backing folded to 17.39°; tape from corner to ridge end
- Fit the commons | 662.0 mm; check square to the eave with a set square
- *Lay a straight-edge across each face | glass line flat to within 1 mm at every bar
- Take triangle templates | from the assembled bars, coated face and hand marked
```

The diagonal check on the eaves rectangle, √(2,400² + 1,200²) ≈ 2,683.3 mm, proves that the frame is square. If the diagonals differ, the hips will not land at the ridge ends together, and the error shows as one hip too long and its partner too short.

## A failure case: hips with flat tops

This is an illustration. On an earlier hipped roof light, the shop folded the hip bars with the same flat-topped section as the commons, on the reasoning that the gaskets would take up the difference. Nobody had calculated the backing angle, which on that roof light was also about 17°.

At the dry fit, each triangular pane rocked on the hip's rebate. With a flat top on a 40 mm hip bar, the outer edge of the rebate stood about **20 × tan 17.39° ≈ 6.3 mm** below where the glass wanted to sit, so the glass touched the hip only along its inner edge and the gasket could not seal the gap. The detection came from the fitter, who found the panes would not lie flat and measured the gap with a feeler.

The correction was to refold four hips with their rebates backed to the calculated angle. The shop's bar schedule now shows the backing angle against every hip and valley, and the stay for the brake is cut from it.

## How this applies to a small Australian business

Set out every bar from the glass line. Calculate the rise, ridge and commons from the run and pitch, and the hip's true length two ways, through the plan and on the flattened face. Calculate the backing angle and make the hip bars to it. Cut jacks against the hip at the face angle, not the plan angle. Prove the frame square with its diagonals, assemble the bars on a jig, check each face with a straight-edge, and take templates for the triangles before ordering glass.

## Exercise: steeper ends

The owner asks for RL-24's hipped ends to be steeper, at **35°**, keeping the long faces at 25° and the same 279.8 mm rise. How far in from each end does the ridge now start? How long is the ridge? What is the hip's plan angle from the long eave, its plan length and true length? How long is the end common?

**Worked answer.** The end run is **279.8 ÷ tan 35° ≈ 399.6 mm**, so the ridge starts about 399.6 mm in from each end and is **2,400 − 2 × 399.6 ≈ 1,600.8 mm** long. The hip runs 399.6 mm along the long side and 600 mm across, so its plan angle from the long eave is **arctan(600 ÷ 399.6) ≈ 56.34°**, its plan length **√(600² + 399.6²) ≈ 720.9 mm**, and its true length **√(720.9² + 279.8²) ≈ 773.3 mm**. The end common is **279.8 ÷ sin 35° ≈ 487.8 mm**. With unequal pitches, the hip no longer bisects the corner, and its two backing angles are different, one for each face; each must be calculated separately.
