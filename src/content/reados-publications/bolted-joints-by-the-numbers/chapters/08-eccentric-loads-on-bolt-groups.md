---
book: bolted-joints-by-the-numbers
chapterSlug: eccentric-loads-on-bolt-groups
order: 8
title: "Eccentric loads on bolt groups and brackets"
description: "How a load applied away from a bolt group's centre loads its bolts unequally: the elastic method for in-plane loads, bracket bolts in tension and shear, and the most loaded bolt."
draft: false
---

When a load passes through the centre of a bolt group, the bolts share it equally. Loads rarely do. A bracket that holds something out from a column, a plate that carries a load at its far end, a support arm: each puts its load to one side of its bolts, and the offset turns part of the load into a moment that the bolts must also resist. The moment loads the bolts unequally, and the bolt furthest from the group's centre can carry several times the share that simple division would give it.

This chapter checks the CT-1 rig's two brackets. The rod-end support plate is loaded in the plane of its bolts, so they resist the moment in shear; it uses the BIZOMAT eccentric bolt group tool and the eccentric bracket bolt check. The load cell bracket sticks out from the face it is bolted to, so its bolts resist the moment in tension; it uses the bracket bolts in tension and shear tool. The chapter's mistake is a bracket whose bolts were sized by dividing the load by four.

## The rod-end support plate

During long-stroke tests, the rod end of a cylinder under test rests on a support that keeps it level. The support is a 12 mm steel plate bolted flat against the web of one of the frame's columns with four bolts, in single shear, at the corners of a rectangle 120 mm wide and 160 mm high. The plate reaches out sideways from the column, and the rod end's weight and the test's side load, together up to 30 kN acting downwards, are applied 360 mm from the bolts on the near side, level with the middle of the group. This is an illustration.

## The elastic method

The elastic method treats the plate as rigid and the bolts as equal springs. The load is moved to the group's centroid, where it becomes a direct load shared equally by the bolts, plus a moment about the centroid. The moment makes the plate rotate a little about the centroid, so each bolt resists it with a force at right angles to the line from the centroid to the bolt, in proportion to its distance from the centroid.

```figure
type: formula
title: Bolt forces in an eccentrically loaded group, elastic method
formula: Direct: Fx = Px ÷ n,  Fy = Py ÷ n
formula: Moment: M = (lx − xc) Py − (ly − yc) Px,  J = Σ (xᵢ − xc)² + (yᵢ − yc)²
formula: From the moment: Fx = −M (yᵢ − yc) ÷ J,  Fy = M (xᵢ − xc) ÷ J
caption: xc and yc locate the centroid of the bolt group, (lx, ly) is where the load acts, and J is the polar moment of the group about its centroid, in mm². Each bolt's total force is the vector sum of its direct and moment parts. The bolt where the two add most is the critical one.
- n | number of bolts
- M | moment of the load about the centroid
- J | polar moment of the bolt group
```

The [eccentrically loaded bolt group tool](/tools/bolt-group-eccentric/) takes the number of bolts, up to six, with each bolt's coordinates, the load's components and point of application, and a shear capacity per bolt. It returns the group's centroid, the moment about it, the critical bolt and its force, its utilisation of the capacity, and a table of each bolt's force components and resultant. It assumes a rigid plate and equal bolts; plate bearing, edge distance and prying are left to separate checks, and its notes point out that the instantaneous-centre method gives a higher capacity for ductile bolts.

```figure
type: steps
title: The rod-end support plate in the eccentric bolt group tool
caption: This is an illustration. Bolts at (0, 0), (120, 0), (0, 160) and (120, 160) mm; load 30 kN downwards at (360, 80) mm; capacity 35 kN per bolt.
- Group centroid | x 60, y 80 mm
- Moment about the centroid | −9.000 kN·m
- Bolts 1 and 3, nearer the column edge | 18.97 kN each
- * Bolts 2 and 4, nearer the load | 27.66 kN each
- Utilisation of the critical bolt | 79.0%: BOLTS ADEQUATE
```

The load is 30 kN, and four bolts carry 18.97 + 27.66 + 18.97 + 27.66 = 93.3 kN between them. That is not an error: the forces are vectors, and the moment's contributions point in different directions at different bolts, so their magnitudes add to more than the load. Each bolt sees a downward share of 7.5 kN, plus a moment force of 9,000 × 100 ÷ 40,000 = 22.5 kN at right angles to its 100 mm radius from the centroid. At bolts 2 and 4, on the side towards the load, the moment's vertical component adds to the direct load; at bolts 1 and 3 it opposes it.

```figure
type: svg
title: Forces on the rod-end support plate's bolts
alt: A rectangle of four bolts, two on the left and two on the right, with the group centroid marked by a cross in the middle. A downward arrow labelled 30 kilonewtons acts at a point well to the right of the group, level with the centroid. At each bolt, a short downward arrow shows the direct share of 7.5 kilonewtons, and a longer arrow at right angles to the line from the centroid shows the moment force of 22.5 kilonewtons, circulating clockwise. The two right-hand bolts are labelled 27.7 kilonewtons and the two left-hand bolts 19.0 kilonewtons.
caption: This is an illustration. The moment about the centroid, 30 kN × 300 mm = 9 kN·m, makes the plate try to turn clockwise. Each bolt resists with 22.5 kN at right angles to its radius. On the right, that force has a large downward component that adds to the direct 7.5 kN.
viewbox: 0 0 620 300
body:
<rect class="bx" x="80" y="60" width="160" height="200"/>
<circle class="fa" cx="110" cy="90" r="8"/>
<circle class="fa" cx="210" cy="90" r="8"/>
<circle class="fa" cx="110" cy="230" r="8"/>
<circle class="fa" cx="210" cy="230" r="8"/>
<path class="ln" d="M154 160h12M160 154v12"/>
<path class="dsh" d="M160 160L210 90M160 160L210 230M160 160L110 90M160 160L110 230"/>
<path class="la" d="M520 120V200"/>
<text class="tx txs" x="530" y="165">30 kN</text>
<path class="dsh" d="M240 160H520"/>
<text class="tx txs" x="330" y="150">300 mm from centroid</text>
<path class="la" d="M210 90l40 28"/>
<path class="la" d="M210 230l-40 28"/>
<path class="la" d="M110 90l40-28"/>
<path class="la" d="M110 230l-40-28"/>
<text class="tx txs" x="225" y="80">27.7 kN</text>
<text class="tx txs" x="225" y="280">27.7 kN</text>
<text class="tx txs" x="20" y="80">19.0 kN</text>
<text class="tx txs" x="20" y="280">19.0 kN</text>
```

### Shear and bearing at the critical bolt

The [eccentric bracket bolt check](/tools/eccentric-bracket-bolt-check/) does the same group calculation and then checks the critical bolt's shear stress and the bearing stress it puts on the plate. It takes the bolt positions and the load as before, plus the bolt diameter at the shear plane, single or double shear, the thinnest plate and allowable shear and bearing stresses. It returns the centroid, the moment, the critical bolt and its force, its shear stress and its bearing stress, with a table of all the bolts' forces.

```figure
type: steps
title: The rod-end support plate in the eccentric bracket bolt check
caption: This is an illustration. As above, with M16 bolts in single shear on their 16 mm shank, a 12 mm plate, allowables 150 MPa shear and 250 MPa bearing.
- Critical bolt / force | 2 (and 4) / 27.66 kN
- * Bolt shear stress | 137.6 MPa against 150 MPa
- Plate bearing stress | 144.1 MPa against 250 MPa: BOLTS ADEQUATE
```

## The mistake: dividing by four

The support plate's first drawing showed four M10 bolts. The calculation on the drawing divided 30 kN by four bolts, giving 7.5 kN each, and checked an M10's shank in single shear: 7,500 ÷ 78.5 = 95.5 MPa, comfortably under 150 MPa.

That calculation is the direct share alone. It treats the load as if it acted at the middle of the group, when it acts 300 mm to one side of it. Run through the eccentric bracket bolt check with M10 bolts, the critical bolt carries 27.66 kN, and its shear stress is 27,660 ÷ 78.5 = 352 MPa: more than twice the allowable, and close to the shear strength of a class 8.8 bolt.

```figure
type: compare
title: The support plate's bolts by two methods
cols: Force on the worst bolt | Shear stress, M10 | Shear stress, M16
rowhead: Method
- Load divided by four | 7.5 kN | 95.5 MPa | 37.3 MPa
- * Elastic method, with the moment | 27.66 kN | 352 MPa | 137.6 MPa
caption: This is an illustration. Allowable 150 MPa. The moment from the 300 mm offset nearly quadruples the force on the worst bolt.
```

The plate would not have broken at once. Bolts in single shear through clearance holes slip into bearing, and the plate would have rotated slightly, loading the bolts unevenly and bending them. Over repeated tests the M10s would have worked loose or sheared. The drawing was corrected to M16s before the plate was made.

## More bolts, or bolts further apart

Adding bolts in the same rectangle helps less than spreading them out, because a bolt near the centroid resists little of the moment. With six bolts, in three rows of two at 80 mm spacing, the critical bolt's force falls to 22.43 kN; spreading the original four bolts further apart would do more. The polar moment J grows with the square of the bolts' distances from the centroid while each bolt's share of the moment grows only with its distance, so doubling the spacing halves the moment forces.

The eccentric bolt group tool shows it directly. Moving the four bolts out to a rectangle 180 mm wide and 240 mm high, with the load still 300 mm from the group's centroid, raises J from 40,000 to 90,000 mm² and the corner bolts' distance from the centroid from 100 to 150 mm. The moment force on each bolt falls from 22.5 to 15 kN, and the critical bolt's force from 27.66 to 20.40 kN, giving 101 MPa in an M16. The plate grows, but the bolts work less hard.

## Elastic or instantaneous centre

The elastic method assumes the bolts stay elastic and the plate rotates about the group's centroid. Tests on bolt groups loaded to failure show that real groups rotate about a point that moves away from the centroid as the load rises, and that ductile bolts share the load more evenly than the elastic method says, because the most loaded bolt yields a little and passes load to its neighbours. The instantaneous-centre method, used in structural steel design, follows that behaviour and gives a higher capacity for the same group. The elastic method is the simpler and the more conservative of the two, which is why the BIZOMAT tools use it and why it suits machine brackets, where the shop wants the bolts to stay elastic in service, not to reach their ultimate strength.

## Friction or bearing in an eccentric group

The support plate's bolts are preloaded, so at first the plate's load is carried by friction between the plate and the column web, as in Chapter 7's splice. Friction resists the moment as well as the direct load, and as long as the most heavily loaded region of the joint does not slip, the bolts carry no shear at all. The elastic method's bolt forces then describe what each bolt must resist if friction is overcome. The shop checks both: the slip resistance per bolt, its preload times the friction coefficient divided by a safety factor, against the critical bolt's 27.66 kN, and the bolt's shear and bearing in case it slips. With M16 class 8.8 bolts at 70% of proof, 65.8 kN of preload and a coefficient of 0.35 on clean steel, each bolt resists 18.4 kN before slip with a factor of 1.25. That is less than the critical bolt's share, so the plate is expected to slip into bearing at full load, and the bearing check governs. This is an illustration. For the rod-end support a millimetre of movement does no harm, because the support only steadies the rod. On a bracket that must not move, the cure would be more or larger bolts, a higher preload, or a fitted dowel beside the bolts to take the shear, so that friction or the dowel carries the working load and the bolts are never pushed into bearing.

## Loads in and out of the plane together

Some brackets carry both kinds of load at once: a load in the plane of the bolts and a load out of it. The bolts then see shear from the in-plane part, found by the elastic method, and tension from the out-of-plane part, found as for the load cell bracket, and the most loaded bolt is checked for both together with an interaction like the bracket bolt tool's. The bolt with the largest shear and the bolt with the largest tension are not always the same, so each bolt is checked, not just the worst of each.

## The load cell bracket

The CT-1 measures the force on a cylinder under test with a load cell mounted on a bracket that sticks out 200 mm from the face of a column flange. The bracket's back plate is bolted to the flange with four M16 bolts in two rows, 40 mm and 200 mm above the bottom edge of the back plate. The load, 30 kN at most, acts downwards, parallel to the column face, at 200 mm from it. This is an illustration.

This bracket's moment tries to peel its top edge away from the column, pivoting about its bottom edge. The bolts resist it in tension, the top row most, and also carry the 30 kN downwards in shear.

The [bracket bolts in tension and shear tool](/tools/bracket-bolt-tension/) takes the load parallel to the face and its distance from the face, up to four rows of bolts with their heights above the pivot edge and the number of bolts in each, the bolt diameter and pitch, and allowable tensile and shear stresses. It returns the moment, the tension in the most loaded bolt with each row's share in proportion to its height, the shear per bolt shared equally, the tensile stress on the stress area, the shear stress on the shank, and an elliptical interaction of the two. It treats the bracket as rigid, pivoting about its bottom edge, and warns that a thin flange adds prying force to the top bolts.

```figure
type: steps
title: The load cell bracket in the bracket bolt tension tool
caption: This is an illustration. 30 kN at 200 mm from the face; rows of 2 bolts at 40 mm and 200 mm above the pivot edge; M16 × 2; allowables 300 MPa in tension and 150 MPa in shear.
- Moment | 6.00 kN·m
- * Tension in each top bolt | 14.42 kN
- Shear per bolt | 7.50 kN
- Tensile stress, stress area | 92.1 MPa
- Shear stress, shank | 37.3 MPa
- Interaction | 0.156 against 1: BOLTS ADEQUATE
```

The bolts have a large margin, and the shop's concern with this bracket is different: the tool's prying warning. The back plate is 10 mm thick. If it bends as the top edge is pulled, it pivots not about its bottom edge but about its outer edges beyond the bolts, levering the bolts with extra force. The back plate was made 20 mm thick, so that it stays nearly rigid, and the bolts are preloaded so that their share of the moment's tension is small, as Chapter 1 showed for any preloaded joint.

## Exercise: smaller bolts in the load cell bracket

To fit inside a lighter column, the designer proposes M12 × 1.75 bolts in the load cell bracket, with the same rows and load. Find the tension in the top bolts, the stresses and the interaction. Do they pass?

### Worked answer

The moment and the bolt forces depend only on the load and geometry, not on the bolt size. The moment is 30 kN × 200 mm = 6.0 kN·m. The sum of n y² is 2 × 40² + 2 × 200² = 83,200 mm², so the top bolts carry 6,000,000 × 200 ÷ 83,200 = 14.42 kN each, and each bolt carries 7.5 kN in shear.

An M12 × 1.75 has a stress area of 84.27 mm² and a shank area of 113.1 mm². The tensile stress is 14,420 ÷ 84.27 = 171.2 MPa and the shear stress 7,500 ÷ 113.1 = 66.3 MPa. The interaction is (171.2 ÷ 300)² + (66.3 ÷ 150)² = 0.326 + 0.195 = 0.521.

The bracket bolt tension tool gives the same figures. The M12s pass, with the interaction at about half of its limit. But they would be preloaded to a much lower force than the M16s, so the joint would carry more of the moment's tension in the bolts and less as relief of clamp, and the prying check on the back plate would have to be repeated. The designer kept M16s, which the column takes without difficulty.
