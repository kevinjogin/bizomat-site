---
book: plate-work-by-the-numbers
chapterSlug: rolled-shells-courses-and-seams
order: 2
title: "Rolled shells: courses, plates and seams"
description: "Turn a shell's inside diameter into plate lengths: mean girth, root gaps, weld shrinkage, two ways to split each course, seam stagger between courses, and a seam laid out through the manway."
draft: false
---

A cylindrical shell is the simplest plate pattern there is: a rectangle, rolled. The geometry fits in one line. The work is in the decisions around it: how many plates make each course, where their seams fall, how far the seams of one course stand from those of the next, how much the welds will shrink, and how the seams sit relative to every opening the shell must carry. Each decision is a number, and each number goes on the plate list before any plate is cut.

This chapter makes those decisions for the running case's shell: two courses of 2,400 mm in 6 mm plate, 2,400 mm inside diameter. It compares two ways of splitting each course among 2,400 × 6,000 mm plates, lays out the seams so that they stagger, and ends with a seam layout that put a vertical seam straight through the manway.

## From inside diameter to plate length

The drawing gives the inside diameter, 2,400 mm. Chapter 1 established the rule: the shell is developed on its mean diameter, 2,400 + 6 = 2,406 mm, and its mean girth is π × 2,406 = **7,558.7 mm**.

Each vertical seam is a butt weld with a root gap. The running case's welding procedure, an illustration, specifies a 2 mm gap. A course made of n plates has n seams, so the plates' total length is the mean girth less n gaps.

```figure
type: formula
title: Plate length for a rolled course
formula: total plate length = π × (D + t) − n × g
formula: each plate, if equal = [π × (D + t) − n × g] ÷ n
caption: The running case's 6 mm shell, 2,400 mm inside diameter, split into two equal plates per course with a 2 mm root gap at each of the two seams.
- D | Inside diameter, 2,400 mm
- t | Plate thickness, 6 mm
- n | Number of plates in the course, and of vertical seams
- g | Root gap per seam, 2 mm
step: Mean girth = π × 2,406 = 7,558.7 mm
step: Less two gaps: 7,558.7 − 4 = 7,554.7 mm of plate
step: Each of two equal plates: 3,777.3 mm long, 2,400 mm wide
```

## Weld shrinkage

A butt weld shrinks across its length as it cools, pulling the plates on either side towards each other. Every vertical seam therefore reduces the course's girth slightly, and a shell with many seams can end up measurably small.

How much a seam shrinks depends on the joint preparation, the process, the number of passes and the restraint, and the shop's own records are the best guide. READOS's [Welding Distortion by the Numbers](/reados/publications/welding-distortion-by-the-numbers/transverse-shrinkage/) explains the estimates and their limits. This is an illustration. The shop's records for single-V butt welds in 6 mm plate with its procedure show about 1 mm of transverse shrinkage per seam.

For the running case's two-seam course, that is 2 mm of girth, which reduces the mean diameter by 2 ÷ π = **0.64 mm**. The shop judges that small enough to ignore against the drawing's diameter tolerance and does not add it to the plates. For a large tank with 20 vertical seams per course, the same shrinkage would take 20 mm off the girth and 6.4 mm off the diameter, and the plates would be cut long to compensate. The decision is made in numbers, and written on the plate list either way: "shrinkage allowance: nil" is a decision; a blank is not.

## Two ways to split a course

The plates are 2,400 mm wide, the same as the course height, so each course is made from plates laid with their 2,400 mm width vertical and their length around the girth. Two arrangements suggest themselves.

**Option A: two equal plates.** Each course uses two plates of 3,777.3 mm, cut from two 6,000 mm sheets. Each sheet leaves an offcut 2,222.7 × 2,400 mm. The two courses use four sheets and leave four offcuts.

**Option B: one long plate and one short.** Each course uses one full 6,000 mm sheet, uncut in length, and a short plate of 7,554.7 − 6,000 = 1,554.7 mm. Both short plates can come from one sheet, leaving an offcut of 6,000 − 2 × 1,554.7 = 2,890.6 × 2,400 mm. The two courses use three sheets and leave one offcut.

```figure
type: compare
title: Two ways to split each 7,554.7 mm course
rowhead: Option
cols: Plates per course | Sheets for two courses | Offcuts left | Seam positions in a course
caption: This is an illustration with 2,400 × 6,000 mm sheets. Option B uses one fewer sheet; option A gives symmetrical seams and equal plates to roll.
- A, two equal plates | 2 × 3,777.3 mm | 4 | four of 2,222.7 × 2,400 mm | 180° apart
- * B, one 6,000 and one 1,554.7 mm | 6,000 + 1,554.7 mm | 3 | one of 2,890.6 × 2,400 mm | 74.1° apart one way, 285.9° the other
```

Option B saves a whole sheet, 678 kg of plate, but that is not the whole comparison. A 6,000 mm plate is heavier to handle and roll than a 3,777 mm one, and a short plate of 1,554.7 mm is stiff relative to its length and rolls with relatively longer flat ends, as Chapter 3 shows. Option A's four offcuts are not waste if the job can use them: the square loading hopper's 6 mm sides and the manway neck are both 6 mm plate and fit in them, as Chapter 8 works out. The choice depends on the whole job's plate list, not on the shell alone.

The running case's shop chooses **option A**, because its offcuts carry the loading hopper and because its rolls handle 3,777 mm plates more easily. The rest of this book uses that choice.

## Staggering the seams

Where a vertical seam of one course meets the circumferential seam between courses, the welds cross. If the vertical seams of two adjacent courses line up, they form a continuous seam the full height of the shell, crossing the circumferential seam in a cruciform junction. Designers and the standards they apply usually require vertical seams in adjacent courses to be offset from one another by a minimum distance, so that each crossing is a T rather than a cross.

The minimum offset belongs to the drawing. The shop's job is to lay the seams out so that they meet it comfortably. With option A, each course's two seams are 180° apart. Rotating the upper course through 90° relative to the lower puts every upper seam a quarter of the girth from the nearest lower seam: 7,558.7 ÷ 4 = **1,889.7 mm** of arc. That is the largest offset two-seam courses can have.

With option B, the seams in each course are 74.1° apart one way. Rotating the upper course through 180° gives a smallest offset of 105.9°, or **2,222.7 mm** of arc, which happens to equal the option A offcut length. Either arrangement clears any plausible minimum by a wide margin. The calculation matters more for shells with many plates per course, where a careless layout can bring two seams within a few hundred millimetres of each other.

## Laying out the shell's development

The shell's seam layout is drawn as a development: the shell unrolled into a flat rectangle 7,558.7 mm long (the mean girth) and 4,800 mm high, with the two courses, their plates, their seams, and every opening drawn on it at its true position. Angles around the shell become distances along the girth: 1° is 7,558.7 ÷ 360 = 21.0 mm.

The development is the single most useful drawing in plate shell work, because it shows every seam and opening on one sheet, at their true distances, where clashes are obvious. It also carries the datum: the shop marks a vertical line at 0° on every plate, from which every angle on the drawing is measured, and that line is punched and painted on the shell so that the fitters and the welders work from the same reference.

```figure
type: svg
title: Development of the running case's shell
alt: A long rectangle representing the shell unrolled, 7,558.7 mm long and 4,800 mm high, divided horizontally into two courses of 2,400 mm. The lower course has vertical seams at 45 and 225 degrees, the upper course at 135 and 315 degrees. A circle near the bottom at 0 degrees marks the manway, clear of the lower course's seams.
caption: This is an illustration at about 1:14. Angles are measured from the 0° datum line at the manway's centre. Upper-course seams are rotated 90° from the lower-course seams.
viewbox: 0 0 600 400
body:
<rect class="bx" x="30" y="30" width="540" height="343"/>
<path class="ln" d="M30 201.5H570"/>
<path class="la" d="M97.5 201.5V373M367.5 201.5V373"/>
<path class="la" d="M232.5 30V201.5M502.5 30V201.5"/>
<path class="cl" d="M30 20V385"/>
<circle class="bxa" cx="30" cy="330" r="18"/>
<circle class="bxa" cx="570" cy="330" r="18"/>
<text class="txs" x="34" y="18">0°, datum and manway centre</text>
<text class="txs" x="74" y="392">45°</text>
<text class="txs" x="344" y="392">225°</text>
<text class="txs" x="208" y="24">135°</text>
<text class="txs" x="478" y="24">315°</text>
<text class="txs" x="420" y="120">Upper course, 6 mm</text>
<text class="txs" x="420" y="290">Lower course, 6 mm</text>
<text class="txb" x="200" y="260">Mean girth 7,558.7 mm</text>
```

## Openings and seams

Openings are placed clear of seams for the same reason seams are staggered: a weld that crosses another weld, or that runs into the reinforcement around a hole, makes a complex, highly restrained joint that is hard to make and inspect. The drawing usually sets a minimum distance from the edge of an opening to the nearest seam, and it is checked on the development.

The running case's manway is centred at 0°, 600 mm above the bottom of the lower course. With the lower course's seams at 45° and 225°, the nearest seam is 45° away, 944.8 mm of arc from the manway's centre. The manway's neck has an outside radius of 256 mm, so its edge stands **688.8 mm** clear of the seam, far more than any likely minimum.

The same check applies to every opening and attachment: the roof's inlet against the roof plate's seams, the support legs' pads against the lower course's seams, the angle ring's own joint against the upper course's seams. All of them are drawn on the development before the seam positions are fixed.

## Course height and the circumferential seams

The vertical dimension of the shell is simpler, but it has its own allowances. The running case's two courses are each the full 2,400 mm plate width, giving 4,800 mm of shell. The circumferential seam between them is a butt weld with its own 2 mm root gap, and the seam between the lower course and the hopper's top edge is another. If the drawing's 4,800 mm is an overall height from the hopper junction to the top of the shell, the plates' widths plus the root gap must make it up: 2,400 + 2 + 2,400 = 4,802 mm, so either the drawing's height includes the gap or one course is trimmed by 2 mm.

That 2 mm is within any reasonable height tolerance, and the shop notes on the plate list that the shell's height is 4,802 mm to the top edge, 2 mm over nominal. The point of writing it down is not that 2 mm matters but that every gap is accounted for somewhere, so that when a larger shell with six courses accumulates 12 mm, the decision has already been made.

Circumferential seams also shrink, along the shell's axis. A single circumferential butt seam in 6 mm plate shortens the shell by about as much as a vertical seam shrinks its girth, in the shop's records about 1 mm, which partly cancels the root gap. Both are small here; neither is ignored.

The order of fitting matters too. The shop fits and welds each course's vertical seams first, while the course can still be adjusted for roundness, and only then stacks the courses and fits the circumferential seam. Fitting a circumferential seam to an unwelded course lets the vertical seams open or close as the course is pulled into line, and the girth drifts.

## What the plate list says about the shell

By this point every number for the shell's plates has been decided, and the plate list records them so that the cutter, the roller and the fitter work from the same figures:

1. Material: 6 mm plate, grade as the drawing specifies.
2. Lower course: two plates, 3,777.3 × 2,400 mm, marked LOWER 45°–225° and LOWER 225°–45°, inside face marked, one bevelled edge each end as the procedure requires, manway opening marked on the first plate.
3. Upper course: two plates, 3,777.3 × 2,400 mm, marked UPPER 135°–315° and UPPER 315°–135°.
4. Basis: mean diameter 2,406 mm; root gaps 2 mm; shrinkage allowance nil.
5. Offcuts: four of 2,222.7 × 2,400 mm, reserved for the loading hopper and manway neck.

A checker can recompute the plate length from items 4 and the drawing in a minute, which is the purpose of writing the basis on the list.

## Rolling direction and marking

Each plate is rolled with its 3,777.3 mm length going around the shell, so its 2,400 mm edges run through the rolls parallel to the roll axis. Before rolling, the plate is marked with:

1. its course and position, for example "LOWER, 45° TO 225°";
2. the 0° datum line or the angle of each end, so that fitters can orient it;
3. "INSIDE" on the face that will be inside, which must match the weld preparation's bevel and any coating requirement;
4. the positions of any openings that fall on it, which for the lower course's first plate includes the manway, marked as Chapter 6 describes.

Plates for a bin are usually cut and bevelled flat, then rolled. An opening near the middle of a plate can be cut before or after rolling, but its outline is always marked on the flat in arc lengths on the mean line.

## The error: a seam through the manway

This is an illustration. The shop's first seam layout for the lower course was done by a fitter who placed the seams at 0° and 180° "on the datum, where they are easy to find", without drawing the development. The general arrangement put the manway's centre at 0°.

The clash was found during the plate list check, before any plate was cut, when the checker drew the development and the manway's circle landed on the seam line. Had it not been found, the manway's opening would have been cut through a vertical seam, and the reinforcement around the neck would have sat across a butt weld, a detail the designer had not allowed and would almost certainly have rejected.

The fix cost nothing at that stage: the lower course's seams were rotated to 45° and 225°, and the upper course's to 135° and 315°, which kept the 90° stagger between courses and put the manway 688.8 mm clear of the nearest seam. The shop's rule since then is that no seam position is fixed until every opening and attachment has been drawn on the shell's development, by someone other than the person who chose the seams.

```figure
type: checklist
title: Checks on a shell's seam layout
caption: All of them are made on the development drawing before any plate is cut.
- Mean girth and root gaps give the plate lengths | 3,777.3 mm each for option A
- Weld shrinkage decided and written down | nil for two seams per course
- Vertical seams staggered between courses | 1,889.7 mm with a 90° rotation
- Every opening clear of every seam by the drawing's minimum | manway 688.8 mm clear
- 0° datum marked on every plate | the manway's centre line
- x Seams placed for convenience before openings are drawn | the manway clash
```

## Exercise: three plates per course

The shop is offered a cheaper supply of 2,400 × 3,000 mm plates. Using three equal plates per course with a 2 mm root gap at each seam, find the plate length, the offcut from each plate, and the arc between seams in a course. Then find the largest stagger between courses.

**Worked answer.**

- Total plate per course: 7,558.7 − 3 × 2 = 7,552.7 mm.
- Each plate: 7,552.7 ÷ 3 = **2,517.6 mm**, leaving an offcut of 3,000 − 2,517.6 = **482.4 mm** × 2,400 mm.
- Seams are 120° apart, 7,558.7 ÷ 3 = **2,519.6 mm** of arc.
- The largest possible stagger between two three-seam courses is half the seam spacing: rotate the upper course by 60°, putting each upper seam **1,259.8 mm** of arc from the nearest lower seam.

The offcuts are narrow, and six of them are of little use on this job, so the cheaper plate may not be cheaper once yield is counted. Chapter 8 compares plate options by the whole job's plate list.
