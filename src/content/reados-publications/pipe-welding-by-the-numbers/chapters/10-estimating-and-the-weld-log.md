---
book: pipe-welding-by-the-numbers
chapterSlug: estimating-and-the-weld-log
order: 10
title: "Estimating and the weld log"
description: "Estimate pipe welding in diameter-inches with factors for wall, material and position, track productivity weekly against the estimate, and keep a weld log that traces every joint to its test."
draft: false
---

Willis's manual of 1917 gave the number of joints a competent welder could make in an hour at each size of pipe. It was an estimating rule: count the joints, divide by the rate, and the hours follow. Pipe contractors still estimate that way, with more refinement, because joints of different sizes, walls, materials and positions take very different times, and an estimate that counts them all alike is wrong before the job begins. The same counting, done week by week as the job proceeds, shows whether the work is on track, and the record of every joint, the weld log, is what the contractor hands the client to prove that the piping was built as it should be.

This chapter sets out the diameter-inch method of estimating pipe welding and the factors that adjust it, shows how productivity is tracked against the estimate, describes the weld log and what it must contain, and closes by bringing the book together.

## Diameter-inches

Bigger joints take longer, roughly in proportion to their circumference, so a convenient unit of pipe welding is the diameter-inch: the nominal size of the pipe in inches multiplied by the number of joints. A 6 inch joint, DN 150, counts as 6 diameter-inches; a 2 inch joint, DN 50, as 2. The unit survives from North American practice because pipe sizes are so widely named in inches, and it lets joints of every size be added into one total. Contractors keep their own productivity rates in hours per diameter-inch for each kind of work, built from their records, and estimate by multiplying.

```figure
type: formula
title: Estimating the dairy's carbon steel butt welds in diameter-inches
formula: welding hours = Σ (joints × nominal size in inches × factors) × hours per diameter-inch
caption: This is an illustration with the contractor's assumed rates of about 0.18 hours per diameter-inch in the shop and 0.40 in the field for Schedule 40 carbon steel, including fit-up but not examination or heat treatment. Every contractor's rates differ, and must come from its own records.
- Joints | 640, averaging about 6 inches nominal
- Split | 75% shop, 25% field
- Rates | shop 0.18 h; field 0.40 h per diameter-inch
step: total = 640 × 6 = 3,840 diameter-inches
step: shop: 0.75 × 3,840 × 0.18 ≈ 518 hours; field: 0.25 × 3,840 × 0.40 = 384 hours
step: about 900 welding hours in all, an average of about 0.235 hours per diameter-inch
```

The diameter-inch total is the size of the job in one number. It makes comparisons easy: between projects, between the shop and the field, between welders, and between this week and last. It is not perfect, because small joints take longer per inch than large ones, with fit-up and set-up a larger share, and very large joints take longer per inch than the proportion suggests because of their thicker walls. Contractors refine it with factors.

## Factors

The base rate is for a standard joint: carbon steel, standard wall, a common position and a normal site. Other joints are factored up or down from it.

```figure
type: compare
title: Illustrative factors on the base hours per diameter-inch
cols: Typical factor | Why
caption: This is an illustration of the kind of factors a contractor keeps, for teaching. Real factors come from the contractor's own records for its procedures, crews and sites.
- Schedule 80 or heavier wall | about 1.5–2.0 | more weld metal and passes (Chapters 3 and 6)
- Stainless with purge | about 1.3–1.5 | slower root, purge set-up, cleanliness
- *Chromium-molybdenum | about 2.0, plus heat treatment priced separately | preheat, interpass control, consumable care
- Small bore below DN 50 | about 1.3 per inch | fit-up and set-up dominate
- Tie-in in a running plant | about 1.5–2.0 | permits, isolation, access, waiting
- Branch connections | count as a joint of the branch size, factored about 1.5 | saddle fit-up and difficult root
```

Factors make the estimate honest about the hard joints. A run of chromium-molybdenum pipe, a tie-in during a shutdown or a set of fabricated branches can each take as much time as a much larger run of simple joints, and an estimate that missed them would be short exactly where the job is most difficult.

## What the estimate leaves out

Welding hours are not the whole job. The estimate adds examination, by the code's percentage and method; preheat and heat treatment, per joint by size; purging equipment and gas; consumables, from the weld metal per joint of Chapter 3 and the deposition efficiencies of Chapter 6; welding equipment and its hire; supervision and quality management; the test packs and pressure tests of Chapter 9; repairs, at an expected repair rate; and the handover records. On many piping jobs these add as much again as the welding itself. The contractor's estimating sheet lists them line by line, so that none is forgotten and each can be checked against the job record afterwards.

## Allowing for repairs

The estimate includes repairs, not because the contractor plans to make defective welds, but because some always occur. An allowance based on the contractor's measured repair rate, say 3% of joints at three times the cost of the original weld for carbon steel, is honest and realistic. An allowance of zero is a promise nobody can keep. The allowance is also a target: if the job's actual repair rate is below it, the saving shows in the margin; if above, the cause is found, as Chapter 9 described.

## Tracking productivity

Once welding begins, the contractor counts diameter-inches completed each week, from the weld log, and the hours booked to welding, from the timesheets, and divides one by the other.

```figure
type: line
title: Weekly welding productivity on the dairy's carbon steel piping
x: Week
y: Hours per diameter-inch
ymin: 0.2
ymax: 0.34
caption: This is an illustration. The estimate's average was about 0.235 hours per diameter-inch. The early weeks were slower as crews learned the procedures and the spool shop set up; by week 9 the average was at or below the estimate.
legend: Actual, shop and field combined
- 1 | 0.31
- 2 | 0.30
- 3 | 0.29
- 4 | 0.27
- 5 | 0.26
- 6 | 0.25
- 7 | 0.25
- 8 | 0.24
- 9 | 0.23
- 10 | 0.23
```

The curve is typical: slow at the start, while crews learn the job and the procedures, and improving as the work settles into a rhythm. Because the early weeks were slower than the estimate, the job was behind in hours at week 5, and the supervisor's question was whether the later weeks would be fast enough to recover. The weekly figures answered it: the trend crossed the estimate around week 9, and the job finished slightly under its welding hours. A contractor that measured only at the end would have learned nothing it could act on.

## Counting what is complete

Productivity figures are only as good as the definition of complete. A joint that is welded but not yet examined, or examined and rejected, is not complete. The contractor counts diameter-inches in stages: fitted, welded, examined and accepted, tested. Weekly reports show each stage, so that a growing gap between welded and accepted, which would mean examination falling behind or repairs piling up, is visible early.

## The weld log

The weld log is the record of every weld on the job. It is kept as the work proceeds, not reconstructed at the end, and it links each weld to everything that determines whether it is fit for service.

```figure
type: checklist
title: What the contractor's weld log records for each weld
caption: This is an illustration of the contractor's weld log, set from its quality plan and the client's requirements. The code and the contract may require more.
- x Weld number | unique, marked on the isometric drawing and beside the weld
- x Line, size, schedule and material | from the line list; heat numbers of the pipe and fittings joined
- x Procedure and welder | welding procedure specification; welder or operator identification and qualification
- x Date and location | shop or field; test pack it belongs to
- x Preheat, interpass and heat treatment | readings or chart references, where the procedure requires them
- x Examination | visual result; other methods, reports and results; repairs and re-examination
- x Test | test pack, test pressure, date and result
- *? Hygienic records | coupon, purge reading, borescope image and colour assessment where applicable
```

Each weld is marked with its number and the welder's identification, by a marker or stamp the procedure permits, so that the weld in the pipe can be matched to its entry in the log. The isometric drawings, one for each line or spool, show every weld's number and position. Together, the drawings and the log let anyone find any weld's history and every weld made by a particular welder, with a particular procedure, or in pipe from a particular heat.

## Why traceability matters

The weld log earns its keep when something goes wrong. If a batch of electrodes turns out to have been defective, or a welder's qualification is found to have lapsed, or a heat of pipe proves to be the wrong grade, the log shows exactly which welds are affected, so that they alone can be examined or replaced. Without it, the whole system would be suspect. Willis noted with approval the long runs of welded yard piping some railways had installed; a modern client asks not only for the welded line but for the record that shows how each joint in it was made.

## The small welds

Estimates built from the main runs miss the small welds: vents and drains at every high and low point, instrument connections, pressure gauge tappings, thermowell bosses, pipe support attachments, temporary lugs for lifting and their removal, and the field-fit welds of Chapter 4. Each is small, but there are many, and each needs fit-up, a qualified welder, examination and a line in the weld log. On plant piping they can add a fifth or more to the joint count. The contractor's take-off counts them from the isometrics, by size, with a minimum allowance per small weld so that their fit-up and handling are not lost in a diameter-inch total that makes them look trivial.

## Using the log while the job runs

The weld log is not only a record for the handover. During the job it answers the questions the supervisor asks every day: which welds are waiting for examination, which have been rejected and not yet repaired, which test packs are complete and ready to test, which welders have welds outstanding, and which heats of pipe have gone into which lines. Kept in a shared spreadsheet or database, updated by the welders, examiners and supervisors as each step is done, it becomes the job's control panel. A log updated once a week from paper notes is always out of date, and the gaps in it hide exactly the problems it should show.

## Welders' continuity

Welder qualifications lapse if a welder does not use the process for longer than the qualification standard allows, and most standards require the employer to record that each welder has continued to weld with each process. The weld log supplies the evidence: every weld lists its welder and procedure, so the dates of each welder's work with each process can be extracted at any time. The contractor reviews the continuity of every welder monthly from the log, so that no qualification lapses unnoticed in the middle of a job.

## Handover

At the end of the job, the contractor hands the client the records the code and the contract require: the line list, isometric drawings with weld numbers, the weld log, welding procedure specifications and qualification records, welder qualifications, material certificates by heat number, examination reports, heat treatment charts, test pack records, and any concessions or deviations approved during the job. Assembling it is far easier if each record was filed as it was made. The contractor's handover for the dairy was a set of indexed electronic files, one per test pack, cross-referenced to the weld log.

## Learning from the job

The job record is also the contractor's best estimating data. At the close of each job, the supervisor compares the actual hours per diameter-inch with the estimate by kind of work, the actual factors for stainless, heavy wall and tie-ins, the repair rate by procedure and welder, the examination costs and the consumables used, and updates the estimating rates. The rates in this chapter's figures came, in the story, from that process repeated over many jobs. An estimator who uses rates from the last job, rather than from a book, estimates the next job better.

## Bringing it together

This book began with the choice of joint, and with Willis's observation that the welded joint's advantage grows with the pipe's size. It went on to the wall thickness and what sets it, the preparation and fit-up that make a sound root possible, the positions and the spool plan that put most welds where they are easiest to make, the root and its purge, the filling and capping passes, the special demands of stainless and hygienic lines, the preheat and heat treatment that harder steels need, and the examination and testing that prove the work.

Each of those chapters fed a number into this one. The joint choice fixes the joint count; the wall fixes the weld metal and passes; the fit-up, position and process fix the hours; the purge and heat treatment add their own time; the examination and repair rate add theirs. The estimate collects them, the weekly tracking checks them, and the weld log records the result joint by joint. A piping contractor that keeps those numbers honestly can quote with confidence, deliver what it quotes, and show the client exactly what was built.

## A failure: the joints nobody counted

This is an illustration. A contractor elsewhere had estimated a plant's piping by counting the joints on the main runs from the general arrangement drawings, at a single average rate. The isometric drawings issued later showed about 30% more joints, mostly small-bore branches, vents, drains and instrument connections, and a run of heavy-wall pipe at the boiler that the general drawings had not distinguished.

The welding hours overran the estimate by nearly half. The small-bore joints, at a higher rate per diameter-inch than the average, and the heavy-wall joints, at nearly twice the base rate, accounted for almost all of it. Estimating from isometrics, or from a careful take-off of every connection with factors for size and wall, would have shown the true size of the job before the price was agreed.

## Exercise: estimating the water main

The raw water main of Chapter 4 has about 332 joints of DN 200, 8 inches nominal. Using about 0.20 hours per diameter-inch for string welds on the bank and 0.45 for trench joints, with 299 string joints and 33 trench joints, estimate the welding hours. At A$135 an hour excluding GST, what is the welding labour, and what would a 3% repair allowance at three times the original joint's cost add?

The string joints are 299 × 8 = 2,392 diameter-inches, at 0.20 hours, about **478 hours**; the trench joints 33 × 8 = 264 diameter-inches at 0.45 hours, about **119 hours**. The total is about **597 hours**, matching the estimate of Chapter 4, and the labour is about 597 × 135 ≈ **A$80,600**.

The average joint costs about 80,600 ÷ 332 ≈ A$243. A 3% allowance is about 10 joints at three times that, about 10 × 3 × 243 ≈ **A$7,300**. The examination, consumables, lining reinstatement, testing and handover records would be added separately, line by line.
