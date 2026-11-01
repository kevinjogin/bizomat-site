---
book: microstructures-by-the-numbers
chapterSlug: sampling-and-preparing-sections
order: 2
title: "Sampling and preparing sections"
description: "Where to cut a casting or bar, which orientation to section, how to place microscope fields without bias, and which preparation faults change the numbers."
draft: false
---

Every metallographic number is the end of a chain of choices: which part from the lot, where on the part, in which orientation, which fields on the polished face and which points or lines within each field. A mistake at any link is carried into the result, and no amount of care at the microscope repairs a section cut in the wrong place. Specimen preparation adds its own errors, some of which look exactly like the features being measured.

This chapter sets out a sampling plan from lot to field, the orientation rules for wrought and cast parts, the systematic placing of fields, and the preparation faults that change numbers. Its error is a porosity result that was really a polishing fault.

## Sampling happens at several levels

A result for "the casing" is really an estimate built from a nested set of samples. Each level contributes its own variation, and the precision of the final number is limited by whichever level contributes the most.

```figure
type: layers
title: The levels of sampling behind one metallographic result
caption: Variation enters at every level. In castings the largest share usually comes from the upper levels, between castings and between locations in a casting, because cooling rate varies so much. Adding fields at the bottom level cannot reduce variation that comes from the top.
- Lot or heat | which castings or bars are taken from the delivery
- Part | which casting or which length of bar
- Location | flange, wall or boss; surface or centre of a bar
- Specimen and orientation | the plane of polish and its direction
- Field | which areas of the polished face are photographed
- Point or line | the grid or test lines laid on each field
```

The practical lesson is that a measurement plan should spread its effort across the levels that vary most. For a casting, one field from each of several locations usually tells more than many fields from one location. For a bar of wrought steel, where the structure is more uniform along the length but differs between surface and centre, the radial position matters more than the position along the bar.

## Where to cut a casting

The microstructure of a casting depends on how fast each part of it cooled. Thin walls cool quickly and, in ductile iron, have many small graphite nodules and usually more ferrite in the matrix when the iron is ferritising, or a finer structure overall. Thick sections cool slowly, with fewer, larger nodules, and are where shrinkage porosity collects because they solidify last. A test bar cast separately in a standard mould shows the properties of the iron at that bar's cooling rate, which may differ from any section of the real casting.

Plant P's casing has three characteristic sections: the 20 mm main wall, the 32 mm sealing flange and a 50 mm boss where the flange meets a mounting foot. The laboratory's routine plan cuts one specimen from each.

```figure
type: compare
title: The three sections of the pump casing
rowhead: Location
cols: Thickness | Expected structure | Why it is sampled
caption: This is an illustration. The three locations bracket the range of cooling rates in the casting. A requirement written for "the casting" should say which location it applies to, or the supplier and the purchaser can both be right about different sections.
- Main wall | 20 mm | many small nodules, the highest nodule count | the pressure-containing section
- * Sealing flange | 32 mm | intermediate | the face that must not leak
- Boss at the flange and foot | 50 mm | fewest, largest nodules; slowest to solidify | the most likely site of shrinkage and of the poorest nodularity
```

### Test bars, attached coupons and the casting itself

Foundries prove the quality of each melt with test pieces, and it is worth knowing what each kind represents. A **separately cast test bar** is poured from the same ladle into a standard mould. It shows whether the iron's chemistry and treatment were right, but it cools at the bar's own rate, so its nodule count and matrix match those of a casting section of similar thickness and no other. An **attached** or **cast-on coupon** is moulded onto the casting itself and cools in the casting's own sand, so it represents the adjacent section better, though still not the hottest part of the casting. A **specimen cut from the casting** represents exactly the place it came from, at the cost of the casting.

A requirement that names only "the material" will normally be proved on separately cast bars, because that is the supplier's routine. If a property matters at a particular place in the part, such as nodularity or porosity at a sealing face, the order must say so, and must say whether a cut casting, a coupon or a bar is the evidence. Plant P's original order did not, and the supplier's test bar certificates for the leaking batch were entirely correct: the bars were sound and fully nodular. They simply did not represent the 50 mm boss.

Where a requirement applies to the casting itself, the specimen must come from the casting, which means destroying one. Plant P's purchase order therefore allows the laboratory to section one casing in each batch of 40, chosen at random from the delivery, in addition to the supplier's own test bars. The random choice matters: a supplier asked to send a casing for sectioning will, quite reasonably, send a good one.

## Orientation in wrought steel

Rolling and forging stretch the structure of steel in the working direction. Manganese sulphide inclusions are drawn into long stringers, segregation forms bands of alternating composition, and grains may be elongated. A section's orientation must match the property being measured.

- **Inclusions** are rated on a longitudinal section, parallel to the working direction, where stringers show their full length. A transverse section shows only their small cross-sections.
- **Grain size and case depth** of a shaft are normally measured on a transverse section, across the axis, where the hardened layer has its true depth all round the circumference.
- **Banding** is seen on a longitudinal section and is invisible on a transverse one.

For the pump shaft, the laboratory cuts a transverse disc through the middle of the hardened journal for the hardness traverse and grain size, and a longitudinal specimen through the bar's mid-radius, outside the journal, for inclusions. The mid-radius position is a common convention for bar because the centre often has more segregation than the bulk and the surface has been worked differently; whatever position is used, the report must say which.

## Placing fields without bias

On the polished face, fields must be placed by a rule that does not depend on what they show. The most efficient rule is **systematic uniform random sampling**. Lay a regular grid of field positions over the area to be measured, with its origin chosen at random within one grid step, and photograph a field at every grid point. Every part of the face has the same chance of being measured, which removes selection bias, and the even spacing makes the estimate more precise than the same number of fields placed independently at random, because no region is missed or doubly sampled.

The flange specimen is 28 by 24 mm. The technician excludes a 2 mm band at each edge, where preparation rounds the surface and the casting skin differs from the interior, leaving a measurement region 24 by 20 mm. A grid step of 4 mm gives 6 positions across and 5 down, 30 fields in all, and the starting point is chosen by drawing two random numbers between 0 and 4 mm. On the microscope's motorised stage the grid is programmed once and repeated for every specimen.

```figure
type: steps
title: Placing fields on a polished section
caption: This is an illustration of Plant P's routine. Every step is fixed before the specimen is looked at, so nothing about where the fields fall depends on what they show.
- Define the measurement region | the face less a 2 mm edge band: 24 × 20 mm on the flange specimen
- Choose the grid step | from the number of fields needed: 4 mm for 30 fields
- Draw a random start | two random numbers between 0 and the step, for x and y
- Visit every grid point | photograph the field whatever it shows, including empty or damaged fields, and note any that cannot be used and why
- * Keep the worst-field photograph separate | searching for features is useful for description, never for the numbers
```

Fields that land on a scratch, a pull-out or the edge of the specimen should be recorded and either measured as they are or excluded by a rule written beforehand, never silently skipped. Skipping difficult fields is a selection bias like any other.

### Why a grid beats random placing

It can seem odd that a regular grid is better than truly random positions, since randomness is what removes bias. The random start supplies the randomness: before the start is drawn, every point on the face has the same chance of being measured, so the estimate is unbiased. Once it is drawn, the regular spacing guarantees that the fields spread evenly over the face. Independent random positions, by contrast, will by chance cluster in some regions and leave others empty, and when the structure varies across the face, as it does across a casting section from skin to centre, that clustering adds variance. For structures with gradual trends, a systematic sample is commonly several times more efficient than a random one of the same size. The exception is a structure with a regular period that matches the grid step, such as banding at a fixed spacing, where every field could land on the same kind of band; the cure is a step that is not a simple multiple of the period, or a grid rotated against it.

### How many fields?

The number of fields follows from the precision required and the field-to-field variation, which Chapter 3 shows how to estimate. As a starting point, enough fields to contain a few hundred of the features being counted, or a few hundred test points falling in the phase being measured, gives a standard error of a few per cent of the value. The grid step then follows from the region's area. For 30 fields on 480 mm² the step is √(480 ÷ 30) = 4.0 mm.

## Preparation faults that change the numbers

Grinding and polishing a section is a craft, and its faults are not just cosmetic. Several of them create or destroy exactly the features a measurement counts.

```figure
type: compare
title: Preparation faults and what they do to the measurement
rowhead: Fault
cols: Effect on the numbers | How to check
caption: Most of these faults are prevented by a correct preparation route for the material and checked by looking at the specimen unetched before etching it. Graphite pull-out and smeared pores are the two that most often change a reported value in cast iron.
- * Graphite pull-out | pits where nodules were torn out: graphite area falls, apparent porosity rises | unetched face, darker pits with sharp round edges at nodule sites; re-polish with a finer final step
- Smearing | soft metal is dragged over pores and cracks: porosity and crack length fall | extra polishing and light etching repeatedly; the result should stop changing
- Edge rounding | the face curves away near an edge: hardness and case depth near the surface are wrong, edge features out of focus | mount with an edge-retaining resin, check the edge is in focus at high magnification
- Over-etching | boundaries widen and dark phases spread: pearlite fraction and boundary length rise | etch lightly, check against a reference specimen
- Relief | hard phases stand proud of soft ones: boundaries blur in image analysis | shorter final polish on a harder cloth
- Contamination or staining | spots mistaken for inclusions or pores | clean and dry thoroughly, re-examine
```

## The error: pores that were holes left by graphite

When the laboratory examined the main wall of the first leaking casing, image analysis of 30 systematic fields reported 1.4% porosity, which was surprising in a 20 mm wall that should have fed well. The engineer asked to see the fields. The dark features the software had counted as pores were round, about the size of the graphite nodules nearby, and many sat in a ring of ferrite exactly as nodules do.

They were sockets where nodules had been torn out during polishing. The final polishing step had been shortened to save time, and graphite, which is soft and weakly bonded to the matrix, had pulled out of the surface. The software, set to classify dark features as pores, had no way of telling an empty socket from a pore.

The technician re-polished the specimen with the full final step and examined it unetched. The nodules were back in their sockets, and the real porosity in the wall was 0.1%, measured on the same 30 grid positions. The laboratory added two rules to its procedure: every cast iron specimen is checked unetched for pull-out before any measurement, and features classified as pores must be checked against their shape, since gas and shrinkage pores are rarely perfect circles in a ring of ferrite.

```figure
type: stats
title: The wall section before and after re-polishing
caption: This is an illustration. The same 30 field positions, measured before and after the full final polishing step. Graphite area rose as nodules were retained, and the apparent porosity fell to its true level.
- 1.4% | apparent porosity with the shortened final polish
- 0.1% | porosity after re-polishing with the full final step
- 8.1% | graphite area fraction before re-polishing
- 9.4% | graphite area fraction after re-polishing
```

The change in graphite area is the giveaway. With the nodules missing from their sockets, graphite area fell by 1.3 percentage points and apparent porosity rose by the same amount. Where two measured phases trade area like that between preparations, a preparation fault is the likeliest cause.

## How many parts?

Fields measure the variation within a specimen. They say nothing about the variation between castings, which in a foundry can be large: the magnesium treatment fades as a ladle stands, mould sand varies in moisture, and pouring temperature drifts through a shift. One casing sectioned from each batch of 40 tells Plant P whether that batch is grossly wrong, but not how much castings within a batch differ. When the leaking batch arrived, the laboratory sectioned three casings from it, chosen at random, and measured the boss on each. The spread between them, and not the spread between fields within any one, decided whether the problem lay with particular ladles or with the pattern design common to all of them.

## Keeping the record

A metallographic result is only reproducible if its sampling can be repeated. Plant P's laboratory records, for every specimen, the part and its identification, a sketch or photograph showing where it was cut and in which orientation, the preparation route and etchant, the objective used and the date of its last scale calibration, the grid step and random start, and any fields excluded with the reason. The record takes a few minutes to complete and has twice allowed a disputed result to be re-measured on the same specimen and the same field positions, settling the dispute in an afternoon.

## How this applies to a small Australian business

If you order castings or forgings with a microstructure requirement, write into the order where the specimen is to be taken, in which orientation, and whether it comes from the part or from a test bar. If you section parts yourself, decide the sampling plan before you look, place fields on a grid from a random start, and check every specimen unetched for preparation faults before measuring anything. Most of the disputes that reach a laboratory manager come down to two parties measuring different sections or different fields, not to one of them making a mistake at the microscope.

## Exercise: choosing a grid step

The laboratory wants about 40 fields on the shaft's longitudinal inclusion specimen, whose measurement region, after excluding the edges, is 24 by 20 mm. (a) What grid step gives about 40 fields? (b) If the technician rounds the step to 3.5 mm, about how many fields will the grid contain?

**Worked answer.** (a) The region is 24 × 20 = 480 mm². For 40 fields each grid square should be 480 ÷ 40 = 12 mm², so the step is √12 = **3.46 mm**. (b) With a 3.5 mm step there are 24 ÷ 3.5 = 6.9 positions across and 20 ÷ 3.5 = 5.7 down. Depending on where the random start falls, each row has 6 or 7 positions and each column 5 or 6, so the grid holds between 30 and 42 fields, about **39** on average (480 ÷ 3.5² = 39.2). The variation in count is a normal property of systematic sampling from a random start; the expected number is still the area divided by the area of one grid square.
