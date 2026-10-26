---
book: rectangular-duct-fittings-by-the-numbers
chapterSlug: branches-and-shoes
order: 8
title: "Branch take-offs and shoes"
description: "Take a 300 × 200 branch off the 600 × 400 main: a 45° lateral, a square tap with a 45° shoe, holes that are true shapes in a flat panel, collars, and a shoe fitted facing downstream."
draft: false
---

A branch takes part of the main duct's air off to a second zone. In rectangular duct, the branch's opening in the main is cut in a flat panel, so unlike a round tee there is no saddle to develop and no hole that changes shape when rolled: the hole on the flat panel is the hole in the duct. The work is in the branch's own pieces, cut to meet the main at an angle, and in the shape that leads the air smoothly into the branch.

This chapter takes the running case's 300 × 200 mm branch off the side of the 600 × 400 mm main in two ways: as a straight 45° lateral, and as a square tap with a 45° shoe on its upstream side, which is what the job uses. It sets out the holes, the branch pieces and the flanged collar that joins them to the main, and ends with a shoe fitted facing downstream.

## Where the branch goes

This is an illustration. Partway along the roof run, a branch supplies a second zone. It leaves from the main's side face, which is 400 mm high, and runs level, so it turns in plan. The branch is 300 mm wide and 200 mm high, with its 300 mm dimension in the plane of the turn, and it is centred vertically on the main's side, leaving 100 mm of the side panel above and below the opening.

The branch's top and bottom faces, 300 mm wide, lie in the plane of the turn; they are its cheeks. Its two side faces, 200 mm high, are its wrappers: the **upstream** face, which the main's air meets first, and the **downstream** face.

## The 45° lateral

The simplest angled branch is a straight duct that leaves the main at 45° to the direction of flow, leaning downstream. Its end is cut to lie flat against the main's side face.

The main's side face is vertical, so the branch's two side faces meet it along vertical lines: their ends are cut square and they simply differ in length. The branch's cheeks meet it along a line at 45° to their own length, so each cheek's end is cut at 45°, and its two edges differ in length by 300 ÷ tan 45° = **300 mm**.

The hole in the main's side panel is a rectangle 200 mm high and 300 ÷ sin 45° = **424.3 mm** long, because the 300 mm branch crosses the panel at a slant. Its area is 0.0849 m², more than the branch's 0.06 m² cross-section, which is part of why a lateral takes air off smoothly.

```figure
type: formula
title: Hole and cheek cut for an angled rectangular branch
formula: hole length along the main = w ÷ sin β        cheek edge difference = w ÷ tan β
caption: The running case's branch, w = 300 mm in the plane of the turn and 200 mm high, leaving the main's side at β to the main's direction.
- w | Branch dimension in the plane of the turn, 300 mm
- β | Angle between the branch and the main, 45° for a lateral
step: Lateral at 45°: hole 300 ÷ 0.7071 = 424.3 mm long, 200 mm high
step: Each cheek's two edges differ by 300 ÷ 1 = 300 mm
step: At 30°: hole 600.0 mm long; cheek edges differ by 519.6 mm
step: At 90°: hole 300 mm long; cheek edges equal, a plain square tap
```

## The square tap with a shoe

A lateral needs room along the main and points the branch away at 45°. Where the branch must leave square, at 90° to the main, a plain square tap would make the air turn sharply into it, with a high loss and an uneven split. The usual compromise is a **shoe**: a square tap whose upstream face is replaced, for a short length next to the main, by a sloping face that leans into the flow and catches the air.

This is an illustration. The running case's branch leaves square, with a shoe on its upstream side raked at 45° and extending **100 mm** along the main beyond the branch's upstream face. The pieces are:

- the **hole** in the main's side panel: 200 mm high and 300 + 100 = **400 mm** long, from the branch's downstream face to the start of the shoe;
- the **downstream side face**: a plain rectangle, 200 mm high, square to the main;
- the **shoe face**: a sloping panel, 200 mm high and 100 × √2 = **141.4 mm** long on the slope, folded at 45° to the upstream side face where it meets it, 100 mm out from the main;
- the **upstream side face**: a rectangle, 200 mm high, continuing square to the main beyond the shoe;
- the **cheeks**: each a rectangle 300 mm wide, with a 100 × 100 mm right-angled triangle added along its upstream edge next to the main, so that it covers the shoe.

The shoe's numbers are illustrations; the rake and length of a shoe are set by the specification or the designer for the airflow, and Ductwork by the Numbers covers how a branch's shape affects its loss.

```figure
type: svg
title: The square tap with a 45° shoe, in plan
alt: Plan view of the main duct running left to right, with airflow from left to right. A branch leaves the main's upper side at 90 degrees. On its upstream (left) side, a sloping shoe face runs from the main at 45 degrees up to the branch's upstream face, 100 mm from the main. The opening in the main is 400 mm long: 300 mm of branch plus the 100 mm shoe.
caption: This is an illustration at 0.25 scale. The shoe leans into the flow; the opening in the main's side is 400 mm long.
viewbox: 0 0 400 230
body:
<path class="li" d="M20 150H380M20 200H380"/>
<path class="la" d="M140 150L165 125V40M240 150V40"/>
<path class="lf" d="M165 40H240"/>
<path class="ln dsh" d="M140 150H240"/>
<text class="txs" x="30" y="185">Main 600 × 400, airflow →</text>
<text class="txs" x="172" y="36">Branch 300</text>
<text class="txs" x="88" y="128">Shoe 45°</text>
<text class="txs" x="150" y="168">Opening 400</text>
<path class="ah" d="M360 175L345 169V181Z"/>
```

## Holes in a flat panel

Because the main's side panel is flat, its hole is marked directly from the branch's outline. For the shoe, it is a rectangle 400 × 200 mm, its downstream edge at the branch's downstream face and its upstream edge 100 mm beyond the branch's upstream face. For the lateral, it is a rectangle 424.3 × 200 mm.

The hole is usually cut before the main section is folded, while the panel is flat on the bench or the cutting table, and the branch's position is set from the section's end: the running case's tap is centred 600 mm from the section's upstream joint. A hole in a 400 mm side panel that leaves only 100 mm above and below it weakens the panel, and the specification may call for the remaining strips to be stiffened, for example by turning a flange inward around the opening or adding a frame. That is a matter for the specification; the pattern maker allows for whatever it requires.

Contrast this with a round main, where Sheet Metal Patterns by the Numbers shows that a hole marked on the flat blank before rolling must be laid out in arc lengths, because the panel curves. Rectangular duct's flat panels spare the pattern maker that step, which is one of the few ways in which rectangular fittings are simpler than round ones.

## Joining the branch to the main

The branch is joined to the main by a flanged collar. Each of its four faces carries a flange, turned outward square to the face, which sits against the outside of the main's side panel around the hole and is fixed with rivets or screws and sealed.

This is an illustration. The shop uses 25 mm flanges. On the shoe tap, the flanges run along the downstream face's end (200 mm), the shoe face's end (along the main, 200 mm), and the cheeks' ends (along the main, 400 mm each including the shoe triangle). At each corner of the opening the flanges meet edge to edge after notching. The corners between the cheeks and the downstream face are square; the corners between the cheeks and the shoe face are at 45° in plan, so their notches are cut to 45° rather than square.

```figure
type: compare
title: Pieces of the square tap with a shoe, net sizes
rowhead: Piece
cols: Quantity | Net size, mm | Notes
caption: This is an illustration for a branch section 300 mm long beyond the shoe. Flanges and seam allowances are added as Chapter 9 sets out.
- Hole in the main's side panel | 1 | 400 × 200 | cut before folding the main section
- Cheek, top and bottom | 2 | 300 × 400 plus a 100 × 100 triangle | covers the shoe
- Downstream side face | 1 | 200 × 400 | square to the main
- Shoe face | 1 | 141.4 × 200 | folded 45° to the upstream face
- * Upstream side face | 1 | 200 × 300 | starts 100 mm out from the main
```

## Marking the cheek with its shoe

Each cheek of the shoe tap is marked from coordinates, with the origin at the cheek's corner on the main, at the downstream face, x across the branch towards upstream and y out from the main.

- Downstream edge: from (0, 0) out to (0, 400), the branch's 400 mm projection.
- Outer end: from (0, 400) to (300, 400), the branch's 300 mm width.
- Upstream edge: from (300, 400) back to (300, 100), 300 mm, where the upstream face runs.
- Shoe edge: from (300, 100) to (400, 0), the 45° rake, √(100² + 100²) = 141.4 mm, matching the shoe face.
- Main edge: from (400, 0) back to (0, 0), 400 mm, the length of the hole.

Every edge is the length of the face or hole it meets, which is the check. The two cheeks are identical shapes, mirror images in the assembly; their flanges, turned outward from each cheek, must both face away from the branch's inside.

## Fitting and fixing the collar

The shop fits the branch to the main in this order:

1. Cut the hole in the main's flat side panel and fold and seam the main section.
2. Assemble the branch, closing its corner seams and the fold at the shoe.
3. Turn the 25 mm collar flanges on the branch's main end, notching each corner to its angle.
4. Offer the branch to the hole, check its orientation against the airflow arrows and its square with a set square against the main's side.
5. Drill and rivet the flanges through the main's side panel and seal the joint.

This is an illustration. The flange runs round the 400 × 200 mm opening, a perimeter of 2 × (400 + 200) = 1,200 mm, and the shop rivets it at about 50 mm pitch, so each collar takes about 24 blind rivets, with one close to each corner. Fewer rivets let the flange lift between them and leak; many more add time without adding much strength. The pitch for a real job is whatever its specification or the shop's tested practice requires.

## Material for the branch fitting

The shoe tap's net pieces add up to little sheet: two cheeks of 0.125 m² each with their shoe triangles, a downstream face of 0.080 m², a shoe face of 0.028 m², an upstream face of 0.060 m² and a collar flange of about 0.030 m², a total of about **0.45 m²**, or **2.8 kg** of 0.8 mm steel before seam allowances. The hole removes 0.080 m² from the main's side panel, which is usually returned to scrap, as it is too small and too awkwardly placed to be worth keeping.

Small as it is, the branch takes more labour per kilogram than any straight duct: five pieces, four corner seams, one fold at the shoe, a notched collar on every face and two dozen rivets through the main. Chapter 10's take-off counts fittings by their pieces and seams as well as their area for that reason.

## The error: a shoe facing downstream

This is an illustration. The first shoe tap was assembled correctly in every dimension, then fitted to the main section on the bench with the shoe on the branch's downstream side. In that position, the sloping face leans away from the flow, and the air passing the opening, instead of being caught by the shoe and turned into the branch, sweeps past it. The branch would have drawn less air than designed, and the opening's leading edge would have been a sharp 90° corner facing the flow.

Nothing about the pieces was wrong; only their orientation. The shop found it at dry assembly because every main section carries an airflow arrow, painted on when it is cut, and the checker compared the shoe's position with the arrow. The rule is simple: a shoe, like a lateral, leans with the flow, its sloping face on the upstream side of the branch, facing the oncoming air.

The shop now marks each branch fitting with its own airflow arrow at the collar, and the hole in the main is marked "SHOE THIS END" on its upstream edge when it is cut, so that the orientation is fixed before assembly.

```figure
type: checklist
title: Branch checks before fitting
caption: The checks that would have caught the reversed shoe, and the others every branch needs.
- Branch's dimension in the plane of the turn | 300 mm
- Hole length along the main | 400 mm for the shoe tap, 424.3 mm for a 45° lateral
- Hole position from the section's joint | centred 600 mm from the upstream joint
- Shoe or lateral leaning with the airflow | sloping face upstream
- Collar flange notches cut to the corner angles | square and 45°
- x Branch fitted without checking the airflow arrow | the shoe facing downstream
```

## Branches in other faces

A branch can leave from the main's top or bottom face instead of its side, turning upward or downward. The method is the same with the faces exchanged: the hole is in the 600 mm face, the branch's cheeks are its faces in the vertical plane of the turn, and the hole's length is the branch's dimension in that plane divided by the sine of its angle. A branch from the bottom of a supply duct is common for ceiling outlets, where a short vertical drop leads to a diffuser.

Branches close to an elbow, a transition or another branch disturb each other's airflow, and specifications often set a minimum straight length between them. That length is the designer's to set; the fabricator checks it on the run's layout before cutting holes.

## Exercise: a 30° lateral

A second branch, also 300 × 200 mm, leaves the main's side at 30° to the direction of flow. Find the hole's length in the main, the difference between each cheek's two edges, and the hole's area. Compare the hole's length with the 45° lateral's.

**Worked answer.**

- Hole length: 300 ÷ sin 30° = **600.0 mm**, 200 mm high.
- Cheek edge difference: 300 ÷ tan 30° = **519.6 mm**.
- Hole area: 0.600 × 0.200 = **0.120 m²**, twice the branch's cross-section.

The 30° lateral's hole is 175.7 mm longer than the 45° lateral's 424.3 mm, and its cheeks are much longer on one edge than the other. A shallower angle takes air off more gently but needs more room along the main and longer, more awkward pieces, which is the trade-off a shoe tap avoids.
