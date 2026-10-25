---
book: designing-welded-joints-by-the-numbers
chapterSlug: eccentric-loads
order: 5
title: "Weld groups under eccentric load"
description: "Treat a group of welds as lines, find its centroid and polar moment, and calculate the force per millimetre at the worst point when a bracket's load acts away from its welds."
draft: false
---

Most brackets carry their load some distance from their welds. A motor sits on a shelf that sticks out from a column; a pulley hangs on a plate that stands off a frame; a handrail post leans on its base. The load then reaches the welds not only as a direct force but as a moment, a tendency to twist the bracket about its welds, and that moment usually dominates. The welds on the side farthest from the twisting centre carry far more than their share, and a weld sized for the direct load alone can be several times too small.

This chapter treats a group of welds as lines, finds the group's centroid and its polar moment of inertia, calculates the force per millimetre at the most heavily loaded point, and applies the method to the conveyor drive's motor bracket. It uses the elastic method, the simplest and most widely taught; design standards also allow other methods, which can give more capacity.

## Welds as lines

When the welds in a group are all the same size, it is convenient to treat each one as a line, with no width, and to calculate the force per millimetre of weld rather than the stress. The geometric properties of the group, its centroid, its second moments of area and its polar moment, are calculated for the lines, in units of millimetres cubed, and the force per millimetre found from them is then compared with the capacity per millimetre of the chosen fillet size from Chapter 3. Once the force per millimetre is known, the required throat is that force divided by the design strength, and the leg is the throat divided by 0.707.

## Direct shear and twisting

A load F acting at a distance e from the centroid of the weld group can be replaced, at the centroid, by the same force F acting through the centroid plus a twisting moment T = F × e. The direct force is shared equally by every millimetre of weld: each carries F divided by the total weld length. The twisting moment makes each point of the weld carry a force proportional to its distance from the centroid, at right angles to the line joining it to the centroid, just as the stress in a twisted shaft is proportional to the distance from its axis. The point of the weld farthest from the centroid carries the most.

```figure
type: formula
title: Force per millimetre at the worst point of a weld group
formula: f = √[(f_direct + f_Ty)² + f_Tx²], with f_T = T × r ÷ I_p
caption: The elastic method for a weld group of uniform size treated as lines. f_Tx and f_Ty are the horizontal and vertical components of the twisting force at the critical point; the direct force acts in the load's direction.
- f_direct | F ÷ total weld length
- T | F × e, the moment of the load about the centroid
- I_p | polar moment of the weld lines about their centroid, I_x + I_y
step: horizontal twisting component at a point: f_Tx = T × y ÷ I_p
step: vertical twisting component: f_Ty = T × x ÷ I_p
step: combine with the direct force, which here acts vertically
```

## The polar moment of two vertical welds

The conveyor drive's motor bracket is a vertical plate welded to the face of the column with two vertical fillet welds, one along each edge of a 150 mm wide flange on the bracket, each 200 mm long. Treating them as lines 150 mm apart, each 200 mm long:

- the centroid is midway between them;
- each line's second moment about the horizontal axis through the centroid is its length cubed over 12, 200³ ÷ 12 ≈ 666,700 mm³;
- each line's second moment about the vertical axis is its length times the square of its distance from the centroid, 200 × 75² = 1,125,000 mm³;
- the polar moment of the pair is twice the sum, about **3,583,000 mm³**.

## The motor bracket

This is an illustration. The bracket carries 40 kN vertically, at 300 mm from the column face, which is also 300 mm from the centroid of the two welds, since they lie in the column face.

```figure
type: formula
title: Force per millimetre in the motor bracket's welds
formula: f = √[(F ÷ L + T x ÷ I_p)² + (T y ÷ I_p)²]
caption: This is an illustration. The critical points are the four ends of the welds, the points farthest from the centroid, at x = 75 mm and y = 100 mm.
- F, e | 40 kN at 300 mm
- L, total weld length | 400 mm
- I_p | about 3,583,000 mm³
step: direct: 40,000 ÷ 400 = 100 N/mm; T = 40,000 × 300 = 12,000,000 N·mm
step: twisting: horizontal 12,000,000 × 100 ÷ 3,583,000 ≈ 335 N/mm; vertical 12,000,000 × 75 ÷ 3,583,000 ≈ 251 N/mm
step: f = √[(100 + 251)² + 335²] ≈ 485 N/mm, needing a leg of about 485 ÷ 200 ÷ 0.707 ≈ 3.4 mm
```

The direct load alone would have given 100 N/mm; the eccentricity multiplies the force at the worst point nearly five times. A designer who had checked only the direct load would have concluded that a tiny weld would do, and would have been wrong by a factor of five. At 485 N/mm, a 4 mm fillet with a capacity of about 566 N/mm would carry the load; the designer chose 6 mm, for the reasons set out below.

## How eccentricity grows the force

The force at the worst point grows almost in proportion to the eccentricity once the eccentricity is more than a small fraction of the weld group's size.

```figure
type: bars
title: Force per mm at the worst point of the motor bracket's welds, by eccentricity
unit: N per mm of weld, for a 40 kN load on two 200 mm welds 150 mm apart
max: 650
caption: This is an illustration. Calculated by the elastic method in this chapter. At zero eccentricity, the welds carry only the direct load of 100 N/mm.
- 0 mm | 100
- 100 mm | 215
- 200 mm | 348
- *300 mm | 485
- 400 mm | 623
```

The lesson for design is that reducing the eccentricity, by bringing the load closer to the welds, does more for the welds than almost anything else. Spreading the welds apart, which raises the polar moment, comes next, and the exercise at the end of this chapter shows how much it achieves. Making the welds larger, the habit most designers reach for first, is usually the least efficient of the three, because it adds weld metal in proportion to the square of the leg while adding capacity only in proportion to the leg.

## A three-sided weld group

The designer also considered welding the bracket's flange along its top and bottom edges as well as its sides, but the column face was too narrow. Instead, the comparison was made for a C-shaped group: one vertical weld 200 mm long on the column side and two horizontal welds, each 150 mm long, along the top and bottom of the bracket plate where it met a shelf. For that group, the total length is 500 mm, the centroid lies 45 mm from the vertical weld, and the polar moment is about 4,904,000 mm³. With the same 40 kN at 300 mm from the vertical weld, about 255 mm from the centroid, the force at the worst corner is about **364 N/mm**, a quarter less than the two-weld group, for 25% more weld length. Adding weld where it is far from the centroid pays; adding it near the centroid does little.

## Finding the critical point

In a symmetric group, the critical point is easy to find: it is the end of a weld farthest from the centroid, on the side where the twisting force adds to the direct force. In an unsymmetric group, such as the C-shape, several corners may be close, and the designer checks each. A quick way to find the candidates is to sketch the group, mark the centroid, draw the direction of the twisting force at each corner, at right angles to the line from the centroid, and see where it lines up with the direct force. The corner where the two point most nearly the same way, and which is farthest from the centroid, usually governs. A spreadsheet that calculates every corner removes the guesswork.

## Units and a sanity check

Mixing units is the commonest arithmetic error in weld group calculations. Working consistently in newtons and millimetres gives forces per millimetre in newtons per millimetre and moments in newton-millimetres, and the polar moment of lines in millimetres cubed. Two simple sanity checks help. The force per millimetre at the worst point can never be less than the direct force per millimetre. And doubling the eccentricity of a load well outside the group should roughly double the result, as the bar chart above shows; if it does not, an input is probably wrong. A result that fails either check deserves a second look before it goes on a drawing.

## Bolted and welded brackets compared

The same reasoning applies to bolt groups, where each bolt carries a share of the direct load and a share of the twisting load in proportion to its distance from the group's centroid. The difference is that a weld is continuous, so its properties are calculated as lines, while a bolt group is a set of points. Designers who have sized bolt groups will recognise the method. A bracket that must be removable is bolted; one that never moves is often welded, because a weld group of the same size usually carries more and needs no holes in the parts.

## Making the bracket stiffer

A bracket that twists under load also bends its parts. A thin plate bracket with a long overhang deflects, so its load moves outwards as it bends, increasing the eccentricity slightly, and its corners, where the welds end, see stress concentrations. Stiffeners, triangular plates welded between the bracket and the column, shorten the effective overhang and spread the load into the column over a larger area. They also add welds, and those welds must be sized for the share of the load the stiffener attracts, which is often most of it, because a stiffener is stiff.

## Why 6 mm, not 4 mm

The calculation allowed a 4 mm fillet, but the designer specified 6 mm for three reasons: the motor's vibration made the joint fatigue-loaded (Chapter 8); the column wall was 6 mm thick and the standard's minimum size for the joint governed (Chapter 4); and the belt pull could increase if the belts were overtightened, which is common in service. The design note recorded each reason, so that nobody later reduced the weld to the calculated minimum.

## Checking the column face

The force per millimetre at the weld ends is also the force the column wall must take locally, and on a hollow section, the wall between its corners is flexible. At 485 N/mm, pulling the wall outwards at the top of the bracket, the 6 mm wall bends locally, which is exactly the failure in Chapter 1. The designer added a flange plate on the bracket, 12 mm thick and wider than the column face, so that the welds ran over the column's side walls, and checked the wall's local bending with a design guide's method for hollow sections.

## Out-of-plane loads

The method above handles loads in the plane of the weld group, which twist the group in its own plane. A load acting out of the plane, perpendicular to the face the welds lie in, bends the group instead, putting one side of it in tension and the other in compression. The motor's belt pull, which acts partly away from the column, does both. Chapter 6 deals with bending; the two are combined in Chapter 7.

## Other methods

The elastic method assumes the welds stay elastic and the bracket rotates about the group's centroid, which makes it simple and conservative. Tests have shown that weld groups can carry more than the elastic method predicts, because the welds deform and redistribute load before failing, and some standards allow an instantaneous centre of rotation method that captures this, using tabulated or calculated coefficients. The designer used the elastic method for its simplicity and its margin. Where a joint is critical or the extra capacity matters, the standard's method should be used.

## Software and checking

Weld group calculations are easily done in a spreadsheet or by design software, which handles complicated groups. The risk with software is a wrong input: a load applied at the wrong point, a weld length entered as a total rather than per weld, a centroid taken from the wrong edge. The designer checked the software's result for the motor bracket with the hand calculation above, and the two agreed within a few per cent. A hand check of the governing joint is cheap insurance against a wrong number that the software will faithfully process.

## A failure: the pulley bracket

This is an illustration. On an earlier conveyor, a take-up pulley's bracket had been welded to the frame with two short vertical fillets, sized for the pulley's load as a direct shear. The pulley sat 450 mm from the frame on its bracket. The welds cracked from their top ends within months.

Recalculating with the eccentricity showed the force at the top of the welds was about six times the direct load. The bracket was redesigned with its welds spread farther apart, a stiffener to bring the load path closer to the frame, and welds sized from the elastic method, and it has not cracked since.

## Exercise: spread the welds

The motor bracket's two vertical welds are moved from 150 mm apart to 250 mm apart, still each 200 mm long, with the same 40 kN load at 300 mm. Calculate the new polar moment and the force per millimetre at the worst point.

The polar moment is 2 × (200³ ÷ 12 + 200 × 125²) = 2 × (666,700 + 3,125,000) ≈ **7,583,000 mm³**. The twisting moment is still 12,000,000 N·mm. At the weld ends, x = 125 mm and y = 100 mm: the horizontal component is 12,000,000 × 100 ÷ 7,583,000 ≈ 158 N/mm, and the vertical component 12,000,000 × 125 ÷ 7,583,000 ≈ 198 N/mm, plus the direct 100 N/mm, about 298 N/mm. The resultant is √(298² + 158²) ≈ **337 N/mm**, about 30% less than with the welds 150 mm apart, for the same weld length.
