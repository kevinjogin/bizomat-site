---
book: plate-work-by-the-numbers
chapterSlug: fit-up-roundness-and-peaking
order: 9
title: "Fit-up, roundness and peaking"
description: "Measure a rolled course against its tolerances: diameters, out-of-roundness, girth by tape on the right surface, peaking, misalignment, and a course trimmed 19 mm by mistake."
draft: false
---

A rolled course leaves the rolls close to round, and fit-up is where it is made round enough. The fitters pull the seam together, set the root gap, align the plates' surfaces, and hold the shape while the welders work, then measure again. Every one of those steps is judged by numbers, and every number has to be measured on the right surface and compared with the right figure. A measurement compared with the wrong figure is worse than none, because it leads to a correction that makes the part wrong.

This chapter sets out the measurements for the running case's shell: diameters and out-of-roundness, girth by tape, peaking at the vertical seams, and alignment at the circumferential seam. It uses illustrative tolerances, because the real ones belong to the bin's drawing, and it ends with a course measured on its outside and corrected to its mean.

## Diameters and out-of-roundness

The simplest measure of a course's shape is its inside diameter, read with a steel tape or a long rule across the course at several angles. Four diameters at 45° intervals, at the top, middle and bottom of each course, are a common minimum, twelve readings per course.

From the readings, two numbers matter:

- the **mean diameter**, which shows whether the course is the right size; and
- the **out-of-roundness**, the largest diameter less the smallest at the same level, which shows whether it is round.

This is an illustration. The running case's drawing allows the mean inside diameter at any level to lie within 2,400 ± 6 mm, and the out-of-roundness at any level to be no more than 12 mm, half a percent of the diameter. These are not values from any standard. Bin and tank standards set their own tolerances, which differ with the structure's size and duty, and the drawing states which apply.

```figure
type: compare
title: Lower course, middle level, inside diameters before welding
rowhead: Reading
cols: Angle | Diameter, mm | Against the illustrative tolerance
caption: This is an illustration. The mean diameter is right, but the course is 13 mm out of round at this level, 1 mm over the illustrative limit. The fitters adjust it before welding the second seam.
- 1 | 0° to 180° | 2,408 | +8
- 2 | 45° to 225° | 2,395 | −5
- 3 | 90° to 270° | 2,404 | +4
- 4 | 135° to 315° | 2,397 | −3
- * Mean and out-of-roundness | | 2,401.0; 13 | Out-of-roundness 13 against 12 allowed
```

Reading a 2.4 m diameter to a millimetre takes some care. A steel tape stretched across the course sags under its own weight unless it is pulled to a consistent tension, and the sag makes the reading long. Many shops use a telescopic measuring rod or a rule supported at the middle instead, which reads the same each time. The reading must also cross the course's centre: a tape held a little off centre reads a chord, which is shorter than the diameter. Swinging the tape's end slightly and taking the largest reading finds the diameter. Temperature matters less than it seems, because a steel tape and a steel shell expand together; a shell measured in the morning sun on one side and shade on the other can, however, be measurably oval until it evens out.

A course whose mean diameter is right and whose out-of-roundness is too great is not too big or too small; it is oval. It is pulled round by adjusting the seam, with a jack or an internal spider pressing out on the short diameter, and checked again. A course whose mean diameter is wrong cannot be pulled right: its girth is wrong, and that comes from the plate's length.

## Girth by tape, on the right surface

A circumference tape wrapped around the outside of a course measures its outside girth directly, and the average diameter follows from it without any reading across the course. Diameter tapes are graduated so that they read the diameter directly, which is the same measurement divided by π.

The running case's shell, with an inside diameter of 2,400 mm in 6 mm plate, has an outside girth of π × 2,412 = **7,577.5 mm**. A tape reading of 7,578 mm means an outside diameter of 7,578 ÷ π = 2,412.2 mm, and an inside diameter of 2,412.2 − 12 = **2,400.2 mm**. The course is the right size.

The outside girth is not the mean girth used to cut the plates, which was 7,558.7 mm. The two differ by π × t = 18.8 mm, and comparing a tape on the outside with the mean girth on the plate list is the commonest misreading in shell work, as the error below shows. The shop's fit-up sheet therefore lists the tape value to expect, 7,577.5 mm outside, beside the plate length used, 3,777.3 mm.

Plate thickness is also a variable. Plate is rolled to a thickness tolerance, and a plate a few tenths of a millimetre thicker than nominal makes its outside girth a little larger without changing its inside. For the inside diameter, which the drawing controls, the tape result is corrected with the plate's measured thickness, not its nominal one, when the reading is close to a limit.

## Peaking at the vertical seams

Chapter 3 showed that a plate's flat ends make the seam stand proud of the true circle, a fault called **peaking**. It is measured with a template held across the seam: an inside template of 1,200 mm radius, or an outside one of 1,206 mm, centred on the seam, with the gap between template and plate read at the seam.

This is an illustration. The running case's drawing limits peaking to 3 mm measured on a 1,000 mm template. The rolled plates were pre-bent, and the fitters' readings at the four lower course seam positions were between 1 and 2 mm before welding.

Peaking can also go the other way, a seam that sits inside the circle because the ends were over-bent, and it is limited in the same way. Both directions matter because the hoop load in the shell tries to straighten a peaked seam, bending it, and the bending stress sits right at the weld.

Welding changes peaking. A single-V weld made from one side shrinks more on that side and tends to pull the seam towards it, so a seam welded from outside often peaks slightly outward after welding even if it was true at fit-up. The shop's records show how much its procedure moves a seam, and the fitters set each seam a little inward to allow for it. That is a correction from measured experience, not from a table.

```figure
type: bars
title: Peaking from un-pre-bent flat ends, against an illustrative 3 mm limit
unit: mm
max: 18
caption: The seam's departure from the true circle for flats of each length on the running case's 1,203 mm mean radius. Pre-bending removes the flats; without it, even short flats exceed a tight limit.
- Illustrative limit | 3
- Flats of 100 mm | 4.2
- Flats of 150 mm | 9.3
- Flats of 200 mm | 16.5
```

## Alignment at the circumferential seam

Where the lower and upper courses meet, their plate surfaces should line up. The offset between them, sometimes called hi-lo or misalignment, is measured with a straightedge across the seam at intervals around the girth.

Misalignment has two causes. The first is a difference in diameter between the courses. If the upper course were made 6 mm smaller in diameter than the lower, its surface would stand 3 mm inside the lower course's all round, before any fit-up error. Chapter 1's warning about developing different parts on different lines shows up here: two courses made on different lines are out of alignment by a built-in amount that clamping cannot remove.

The second cause is local out-of-roundness: one course oval one way, the other another, so that the offset varies around the girth. That is corrected at fit-up with wedges and dogs, or with strongbacks bridging the seam, working round the girth and checking the offset as the seam is tacked. The illustrative limit on the running case's drawing is 1.5 mm, a quarter of the plate's thickness.

Temporary fit-up attachments, such as dogs and strongbacks, are welded to the shell and later removed. Their welding and removal are part of the welding procedure, because a careless tack on a shell plate can leave a hard spot or a notch, and the drawing or the standard usually says how removal scars are to be ground and inspected.

## Holding the shape while welding

A course that is round at fit-up does not stay round while its seams are welded. The heat and shrinkage of each pass pull the plate, and a thin shell has little stiffness to resist. The shop holds the course with an internal **spider**, a set of adjustable struts radiating from a central hub and bearing on the shell at eight or more points, set to the inside diameter at each level.

The spider stays in until the vertical seams are welded and the course has cooled. The course is measured again after the spider is removed, because some of the welding distortion appears only then. A course that moves out of tolerance when the spider comes out has been held, not corrected, and the cause is usually in the welding sequence. The Library’s [Welding Distortion by the Numbers](/reados/publications/welding-distortion-by-the-numbers/welding-sequence/) covers balancing a sequence to reduce it.

## Plumb, level and height

Once the courses are stacked and the circumferential seam is tacked, the shell is checked as a whole. Three measurements are usual.

1. **Plumb.** A plumb line or a laser dropped from the top edge at four points 90° apart shows whether the shell leans. This is an illustration. Over the running case's 4,800 mm height, the drawing allows the top to be no more than 10 mm out of plumb, about 1 in 480. A shell whose courses are each slightly conical, from the uneven rolling Chapter 3 warned of, often leans in one direction by the sum of their errors.
2. **Level.** The top edge is checked level with a laser or water level at eight points around the girth. A step at a vertical seam, or a course that is taller on one side than the other, shows here. The roof and the angle ring both sit on this edge, so it matters for fit as well as appearance.
3. **Height.** The shell's height is measured at the same eight points, from the bottom edge, where it will meet the cone, to the top. Chapter 2's plate list recorded 4,802 mm, the two course widths plus one root gap, less any shrinkage of the circumferential seam. The measured heights should agree within the drawing's tolerance and with each other.

These checks are made before the circumferential seam is welded out, while the upper course can still be moved on the lower. Afterwards, a lean or a twist can only be corrected with heat or force, both of which put new stresses into the shell.

## Recording the measurements

Every measurement in this chapter goes on a dimensional record for the bin: the readings, where they were taken, who took them, with what instrument, and whether each was before or after welding. The record is part of the bin's quality documentation, and the client or an inspector may ask for it. It is also the shop's own evidence of how its procedures perform. A shop whose records show that its seams always peak 1 mm outward after welding knows to set them 1 mm in, and one without records is guessing.

## The error: a course measured on the outside, corrected to the mean

This is an illustration. During fit-up of the upper course, a fitter checked its girth with a tape around the outside and read 7,578 mm. The plate list beside him gave the course's mean girth as 7,558.7 mm. He concluded that the course was 19.3 mm too large in girth, and, with the second seam still only tacked, had 19.3 mm trimmed from the end of one plate so that the seam would close to the right figure.

The course was in fact right: a reading of 7,578 mm on the outside is an inside diameter of 2,400.2 mm. After trimming, its girth was 19.3 mm short. Its inside diameter became about 2,393.9 mm, 6.1 mm small, outside the illustrative ±6 mm tolerance, and its surface would have stood about 3 mm inside the lower course's at the circumferential seam.

The fault was found the same day, when the course was stood on the lower course and the misalignment showed all round. The trimmed plate was scrapped and replaced. The shop's fit-up sheet now gives three girths in a column, inside, mean and outside, with the surface each is measured on, and the tape reading is written beside the outside figure only.

```figure
type: checklist
title: Fit-up measurements for a rolled course
caption: Each measurement is compared with the figure for the surface it is taken on.
- Inside diameters at four angles, three levels | mean 2,400 ± 6, out-of-roundness 12 or less
- Girth by tape on the outside, compared with the outside girth | 7,577.5 mm
- Peaking at each seam with a 1,000 mm template on the correct surface | 3 mm or less
- Misalignment at the circumferential seam with a straightedge | 1.5 mm or less
- Course re-measured after the spider is removed | distortion appears then
- x Outside tape compared with the mean girth on the plate list | the trimmed course
```

## Exercise: reading the readings

A course's four inside diameters at its top level, at 0°, 45°, 90° and 135°, are 2,409, 2,404, 2,393 and 2,396 mm, and a circumference tape on the outside at the same level reads 7,579 mm. Using the illustrative tolerances, is the course acceptable at that level, and what should the fitters do?

**Worked answer.**

- Mean of the four diameters: (2,409 + 2,404 + 2,393 + 2,396) ÷ 4 = **2,400.5 mm**, within 2,400 ± 6.
- The tape gives an outside diameter of 7,579 ÷ π = 2,412.5 mm and an inside diameter of **2,400.5 mm**, agreeing with the readings.
- Out-of-roundness: 2,409 − 2,393 = **16 mm**, over the 12 mm allowed. The largest and smallest diameters are 90° apart in this example, so the course is oval.

The course is the right size and the wrong shape. The fitters should not touch the plate lengths; they should push out on the short diameter, or pull in on the long one, with the spider or a jack, and re-measure until the out-of-roundness is 12 mm or less, before welding the seams that will fix the shape.
