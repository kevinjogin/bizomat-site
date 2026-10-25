---
book: designing-welded-joints-by-the-numbers
chapterSlug: bending-on-welds
order: 6
title: "Bending on welded joints"
description: "Calculate the force per millimetre in a weld group carrying a bending moment, compare welding a cantilever on its sides, flanges or all round, and check the member and support beside the weld."
draft: false
---

Chapter 5 dealt with loads in the plane of a weld group, which twist it. Many joints carry loads out of their plane instead, which bend them: a cantilever welded to a column, a post welded to a base plate, a beam welded to an end plate. The bending puts one side of the weld group in tension and the other in compression, and the welds farthest from the bending axis carry the most. Where the welds are placed decides how well they resist the bending, often more than their size does.

This chapter treats a weld group in bending as a set of lines with a section modulus, calculates the force per millimetre for the walkway's cantilever supports welded in three different ways, and checks the member and the support beside the weld. It uses the illustrative design shear strength of 200 MPa from earlier chapters.

## Weld groups as beams

When a weld group carries a bending moment M about an axis in its plane, it behaves like a beam's cross-section: the force per millimetre at a point is proportional to its distance from the neutral axis. Treating the welds as lines, the group's second moment of area I about the bending axis is calculated in millimetres cubed, and its section modulus S, the second moment divided by the distance to the farthest weld, in millimetres squared. The force per millimetre at the farthest weld is then:

f_b = M ÷ S

which can be compared directly with the capacity per millimetre of the chosen fillet.

Two simple cases give most of what is needed. For two horizontal lines each of length b, a distance d apart, the section modulus is about b × d. For two vertical lines each of length d, the section modulus is about d² ÷ 3. A rectangle of welds all round, with horizontal sides b and vertical sides d, has a section modulus of about b × d + d² ÷ 3.

## The walkway cantilever

This is an illustration. Each walkway support is a rectangular hollow section, 100 mm deep and 50 mm wide, cantilevered from the base frame and welded to the face of a frame member. Under the design load, each support carries about 3 kN at about 1 m from the weld, a bending moment of about 3 kN·m, plus the 3 kN as vertical shear.

```figure
type: formula
title: Bending on the walkway support's weld group, welded all round
formula: f_b = M ÷ S, with S = b × d + d² ÷ 3 for a rectangle of weld lines
caption: This is an illustration. The shear is assumed to be carried by the two vertical welds; it is small beside the bending.
- M | 3 kN·m = 3,000,000 N·mm
- b × d, the weld rectangle | 50 mm × 100 mm
- V | 3 kN
step: S = 50 × 100 + 100² ÷ 3 ≈ 8,333 mm²
step: bending: f_b = 3,000,000 ÷ 8,333 ≈ 360 N/mm; shear on the vertical welds: 3,000 ÷ 200 = 15 N/mm
step: resultant ≈ 360 N/mm, needing a leg of about 360 ÷ 200 ÷ 0.707 ≈ 2.5 mm
```

## Where the welds are matters most

The same cantilever can be welded in other ways, and the arithmetic shows why the choice matters.

```figure
type: bars
title: Leg needed on the walkway support's welds, by where they are placed
unit: mm of fillet leg, at an illustrative 200 MPa on the throat
max: 7
caption: This is an illustration for the 3 kN·m moment on a 100 × 50 mm hollow section. The flange welds are the ones far from the bending axis; the side welds are partly near it, where they resist bending poorly.
- *All round | 2.5
- Top and bottom flanges only | 4.2
- Two sides only | 6.4
```

Welding only the two sides, the shortest welds to reach in some joints, needs a leg of about 6.4 mm, because much of each side weld lies close to the bending axis, where it contributes little. Welding only the top and bottom needs about 4.2 mm, because those welds are as far from the axis as possible. Welding all round needs only about 2.5 mm. As with the twisting of Chapter 5, weld placed far from the axis does the work. The all-round weld is not much longer than the flange welds alone, 300 mm against 100 mm, yet it lets the leg fall from 4.2 mm to 2.5 mm, and the fillet's weld metal falls with the square of the leg, so the all-round weld uses about the same weld metal as the flange-only weld, roughly 940 against 880 cubic millimetres per joint, while giving a stiffer joint with smaller, single-pass welds that are easier to make well.

## Checking the member

The weld is not the only thing that must carry the moment. The hollow section itself, at the face where it is welded, carries the same 3 kN·m. Its elastic section modulus, for a 100 × 50 mm section with 4 mm walls, is roughly 28,800 mm³, so its bending stress beside the weld is about 3,000,000 ÷ 28,800 ≈ **104 MPa**, a reasonable level for an ordinary structural steel. The weld toe, where the section meets the weld, is also a stress concentration, which matters for the repeated loads of people walking (Chapter 8).

## Checking the support

The frame member the cantilever is welded to must also carry the moment, locally. The top weld pulls on the frame member's face and the bottom weld pushes on it, and if that face is the thin wall of a hollow section, it bends in and out like the column face in Chapter 1. The designer checked the frame member's face for the local forces from the support's top and bottom welds, using a hollow section design guide's method, and found that a 6 mm wall was adequate for the support but not for the heavier ones at the walkway's ends, which were given a doubler plate.

## Where the neutral axis lies

For a symmetric weld group, such as the rectangle round the walkway support, the bending axis passes through the middle of the group, and the top and bottom welds carry equal and opposite forces. For an unsymmetric group, such as a cantilever welded along its top and sides but not its bottom, the neutral axis moves towards the heavier side, and the weld farthest from it, usually at the side with less weld, carries the most. The designer finds the neutral axis as the centroid of the weld lines in the direction of bending, calculates the second moment about it, and uses the larger distance to the extreme weld to find the section modulus. Getting the axis wrong, by assuming symmetry that is not there, underestimates the force in the critical weld.

## Bending in plate-to-plate tees

A plate welded edge-on to another plate, with a fillet on each side, carries bending about the joint by pulling one fillet and pushing the other. For bending that tries to rotate the standing plate, the two fillets act as a couple, with a lever arm roughly equal to the plate thickness plus a share of the weld. Because that lever arm is small, a thin plate's fillets carry large forces for a modest moment, and thick plates under bending at a tee often need complete penetration welds (Chapter 2) or stiffeners to spread the moment. A fillet-welded tee that bends repeatedly is also a fatigue concern, with the weld root on the tension side acting like a crack.

## Deflection and stiffness

Strength is not the only requirement. A walkway that bounces under a person's step feels unsafe even if it is strong, and a motor bracket that flexes lets the belts slap and the bearings wear. The cantilever's deflection depends on the member's stiffness and length, and on the joint's stiffness: a joint welded on two sides only, or to a flexible face, rotates under load and adds to the deflection at the tip. Designers check deflection against the use, often more strictly than strength, and stiff joints, welded all round to stiff supports, help keep it within limits.

## Load combinations

The design load on a walkway or platform is set by the applicable loading standard for the use, combining dead load, the weight of people and equipment, and sometimes other actions, with factors. The weld is designed for the worst combination. For the walkway, the worst combination for the supports was the full live load on the grating with the handrail load at the same time; for the frame's connections, it was the full conveyor load with the walkway loaded. A table of loads for each joint, set up at the start (Chapter 1), makes it easy to see which combination governs where.

## End plates and base plates

A common way to make a bending connection is to weld the member to an end plate or base plate, which is then bolted or welded to the support. The weld between member and plate carries the moment as above. The plate itself must also carry it, bending between the member and the bolts, and a thin plate can bend enough to load the bolts unevenly and the weld unexpectedly at its ends. Design guides for end plate and base plate connections cover the plate and bolts; the weld is sized as in this chapter, with the moment the plate delivers.

## Bending and shear together

Most bending connections also carry shear, and the shear adds to the force on the welds. In the walkway support, the shear was small beside the bending; in a short, heavily loaded bracket, it can be larger. The usual approach in the simple method is to calculate the bending force at the critical point and the shear force per millimetre on the welds assumed to carry it, usually those parallel to the shear, and combine them as a vector, as in Chapter 5. Chapter 7 discusses combining stresses more generally.

## Bending about two axes

A post or cantilever loaded at an angle bends about two axes at once. The force at each corner of the weld group is then the sum of the bending forces about each axis, which add at one corner and partly cancel at the opposite one. The walkway's end supports, which also carry a horizontal load from people leaning on the handrail, see this. The designer calculated the bending force at each corner from each moment, added them with their signs, and found the worst corner, which was about 30% more heavily loaded than with vertical load alone.

## Posts and handrails

Handrail posts are a classic bending connection: a short post carries a horizontal load at its top, from people leaning or falling against the rail, and delivers a large moment to its base weld, relative to the post's small size. The design loads for handrails are set by the applicable standards for the building or structure, not by guesswork. A 50 mm square post welded to a base plate with small fillets on two sides only, a common detail, often has far less capacity than the same post welded all round, as the bar chart above suggests, and the base plate and its anchors must carry the same moment.

## Access sets what can be welded

The all-round weld is only possible if the welder can reach all round. A cantilever welded to the inside of a channel, or close to another member, may have one side the welder cannot reach, and the designer must then either use the welds that can be made, larger, or arrange the joint differently, for example with an end plate that can be welded on the bench and bolted on site. Designing a connection for welds that cannot be made, and leaving the fabricator to discover it, produces a joint welded on fewer sides than calculated, without anyone recording it.

## A failure: welded on two sides

This is an illustration. On an earlier platform, cantilevered supports of the same size as the walkway's had been drawn welded all round, but the fabricator, finding the bottom welds awkward to reach overhead in the jig, welded only the two sides and the top. The bottom of the joint, where the bending compression was carried, was unwelded; under load, the support rotated slightly and the top weld, now carrying more than its share, cracked at its ends.

The fabricator had not recorded the change, and the drawing had not said why the bottom weld mattered. The repair added the bottom welds, overhead, with the platform in place. The company now marks bending connections on its drawings with a note that every side shown must be welded, and its fabrication drawings are checked against the weld map at inspection.

## Exercise: a heavier load

The walkway's end support carries 5 kN at 1 m, welded all round to the same weld rectangle. Calculate the bending force per millimetre and the leg needed at the illustrative design strength. Would a 6 mm fillet do, and what else would you check?

The moment is 5 kN·m, 5,000,000 N·mm, and with S ≈ 8,333 mm², the bending force is about 5,000,000 ÷ 8,333 ≈ **600 N/mm**. The shear on the vertical welds is 5,000 ÷ 200 = 25 N/mm, so the resultant is about 600 N/mm. The leg needed is about 600 ÷ 200 ÷ 0.707 ≈ **4.2 mm**, so a 6 mm fillet would carry it.

The designer would also check the hollow section's bending stress at the weld, about 5,000,000 ÷ 28,800 ≈ 174 MPa, which is high for repeated loads at a weld toe (Chapter 8), and the frame member's face for the local forces, which may need a doubler plate. A larger support section might be the better answer than a larger weld.
