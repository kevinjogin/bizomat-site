---
book: pipe-welding-by-the-numbers
chapterSlug: preparation-and-fit-up
order: 3
title: "Joint preparation and fit-up"
description: "Bevel pipe ends, set the root face and gap, calculate the weld metal a circumferential joint needs, control misalignment and ovality, and tack and clamp the joint so the root can be made right."
draft: false
---

Most pipe weld defects are made before the arc is struck. A root gap too tight to penetrate, a root face too thick to melt through, one pipe sitting a couple of millimetres higher than the other, a bevel left rusty or oily, a tack that cracked when the clamp was taken off: each of these leaves the welder fighting the joint, and many end in a root defect that radiography finds and a cut-out repairs. Good pipe welders are fussy fitters for a reason. The fit-up is the part of the weld they can get exactly right before the difficult part begins.

This chapter covers the shape of a pipe butt joint and why each dimension matters, calculates the weld metal a joint needs from its shape, sets out how misalignment and ovality are controlled, and describes tacking and clamping.

## The shape of the joint

A pipe butt joint for full penetration is usually a single V, made by bevelling each pipe end so that the two bevels form a groove opening outward. Each part of the shape has a job.

```figure
type: compare
title: The parts of a single-V pipe butt joint
cols: What it is | Why it matters
caption: General description for teaching. The welding procedure specification sets the actual angles, root face, gap and tolerances for each joint, and the welder works to it.
- Bevel angle | the angle cut on each pipe end | opens the groove so the electrode or torch reaches the root and the sides fuse
- Root face | a small flat left at the bottom of the bevel | gives the root something to melt into without burning through
- *Root gap | the space between the two root faces | lets the root pass penetrate to the inside and form a bead there
- Alignment | how well the bores and outsides line up | a step inside the joint, high-low, leaves part of the root unfused
- Cleanliness | bare metal on bevels and a band each side | rust, scale, paint and oil cause porosity and lack of fusion
```

The bevel angle is a balance. A wider angle gives better access and easier side fusion but needs more weld metal; a narrower one saves metal but risks the electrode touching the side and the welder failing to fuse it. The root face and gap are a balance too: a thick face with a tight gap will not penetrate; a thin face with a wide gap burns through or sags. The procedure sets them, and the welder's skill is in making the root that the fit-up allows.

## Making the bevel

Pipe ends are bevelled by machine, by flame or by grinding. Willis noted in 1917 that the mills would supply pipe with bevelled ends at no extra charge if it was specified, and pipe for welding is still commonly bought with factory bevels, which are accurate, square and clean. Ends cut on site must be bevelled there.

Portable bevelling machines, clamped to the pipe and turning a cutter round it, make accurate bevels with the root face in one operation, and are the usual choice for stainless and alloy pipe, where flame cutting would leave a heat-affected, oxidised edge. Oxy-fuel bevelling with a torch running on a band track round the pipe is fast on carbon steel and leaves an edge that is ground clean of oxide before welding. Freehand torch bevelling and grinding are slow and less accurate, and best kept for repairs and odd cuts. The time each method takes per end is an estimating figure the contractor keeps, because on a job with hundreds of site cuts it adds up to weeks.

## Weld metal from the joint shape

The shape of the joint sets the volume of weld metal, and from it the consumables, the number of passes and the time. The groove's cross-section, multiplied by the circumference, gives the volume.

```figure
type: formula
title: Weld metal in a DN 150 Schedule 40 butt joint
formula: area ≈ (wall − root face)² × tan(bevel angle) + root gap × wall + cap and root reinforcement
caption: This is an illustration for a 168.3 mm pipe with a 7.11 mm wall, a 37.5° bevel on each end, a 1.6 mm root face and a 3 mm root gap, with a cap about 1.5 mm high and a small root bead inside. Steel density 7.85 g/cm³.
- Groove depth | 7.11 − 1.6 ≈ 5.5 mm
- Mean circumference | π × (168.3 − 7.11) ≈ 506 mm
step: groove area ≈ 5.5² × tan 37.5° + 3 × 7.11 ≈ 23 + 21 ≈ 45 mm²
step: with cap and root reinforcement about 62 mm²
step: weld metal ≈ 62 × 506 ≈ 31,600 mm³, about 0.25 kg per joint
```

A quarter of a kilogram looks trivial against the weld metal in a structural fillet, but a large piping job has thousands of joints, and the figure feeds directly into the number of passes and the arc time in Chapter 6. It also shows where the metal goes. The root gap contributes nearly as much as the bevels on this light wall, and the cap and root reinforcement add more than a third again. A cap built up higher than it needs to be is weld metal paid for twice, once to lay it and once to grind it back if the code limits reinforcement.

## Thicker walls need much more

Because the groove's area grows roughly with the square of its depth, heavier walls need disproportionately more weld metal.

```figure
type: bars
title: Illustrative weld metal per butt joint by size and wall
unit: kg of weld metal per joint
max: 0.5
caption: This is an illustration using the same joint shape as above: 37.5° bevels, 1.6 mm root face, 3 mm gap, a cap about 1.5 mm high and a small root bead. A narrower bevel or compound bevel on thick walls would reduce the heavier figures.
- DN 50 Schedule 40, 3.91 mm | 0.04
- DN 100 Schedule 40, 6.02 mm | 0.13
- *DN 150 Schedule 40, 7.11 mm | 0.25
- DN 200, 6.4 mm wall | 0.28
- DN 200 Schedule 40, 8.18 mm | 0.40
- DN 150 Schedule 80, 10.97 mm | 0.48
```

The DN 150 Schedule 80 joint needs nearly twice the weld metal of the Schedule 40 one, though the pipe's size is the same. On very heavy walls, a compound bevel, steep near the root and shallower above, or a narrow J-shaped preparation, cuts the weld metal substantially, which is why heavy-wall pipe for power stations is often machined with special preparations.

## Misalignment

The inside of a pipe joint cannot be seen while it is welded, and any step between the two bores, called high-low or hi-lo, leaves part of the root face above the other. The root pass then penetrates one side and not the other, leaving a lack of fusion inside the pipe that is exactly the kind of defect radiography is looking for. Codes and procedures set a limit on the internal misalignment, and on hygienic stainless lines the limit is tight because any step traps product.

Misalignment comes from differences in wall thickness, in outside diameter within the mill's tolerance, and above all from ovality: pipe is never perfectly round, and two slightly oval ends rarely match all the way round. Fitters reduce it by rotating one pipe against the other to find the best match, by using clamps that round the ends as they align them, and on pipelines by internal line-up clamps that expand inside the pipe and hold both ends round and aligned while the root is welded.

## Different walls and fittings

Where a pipe joins a fitting or valve of a thicker wall, the thicker end is tapered or counterbored inside so that the two walls match at the root, with a gentle slope that the code specifies. Fittings and pipe from different suppliers can differ slightly in bore even at the same schedule. The fitter checks both ends with a gauge or calliper before fitting, rather than discovering the mismatch when the root will not tie in on one side.

## Cleaning

The bevels and a band of metal on each side, inside and out, must be clean, bright metal before welding. Mill scale, rust, paint, oil, grease, moisture and the coatings on galvanised or lined pipe all cause porosity, lack of fusion or cracking. Carbon steel is cleaned with grinders and wire brushes; stainless and nickel alloys with tools reserved for them, so that carbon steel particles are not ground into the surface to rust later. Pipe with an internal lining, such as the cement mortar or epoxy linings of water mains, has the lining cut back from the joint as the coating maker specifies, and reinstated after welding.

## Tacking

Tacks hold the joint at its gap and alignment while the root is welded, and they become part of the root. A tack is a short root weld, and it must be as sound as the root: fully fused, penetrated and free of cracks, made by a qualified welder with the same procedure. Tacks on small pipe are usually spaced evenly round the joint, three or four on a DN 100; larger pipe needs more. Their ends are ground to a feather edge so that the root pass can blend into them without a cold lap. A tack that cracks when the clamp is removed, or one that shrinks the gap on the opposite side, is ground out and remade.

```figure
type: checklist
title: The contractor's fit-up check before the root is welded
caption: This is an illustration of the contractor's check, written from its welding procedures. The procedure's own dimensions and tolerances are the ones that count.
- x Pipe and fitting identified | material, size, wall and heat number match the line list
- x Bevels and root faces | angle and face within the procedure; no notches or flame gouges
- x Root gap | set with a gauge all round; even within the procedure's tolerance
- x Alignment | internal high-low checked with a gauge at several points; best rotation found
- x Cleanliness | bevels and bands bright metal inside and out; no oil, paint or moisture
- x Tacks | sound, evenly spaced, ends feathered; no cracks
- *? Purge or backing | in place and working for stainless and alloy roots (Chapter 5)
```

Bridge tacks, small blocks or pieces tacked across the gap on the outside of the bevel rather than in the root, are used on some pipe so that the root can be run continuously, and are removed as the root reaches them. They avoid making tacks part of the root but leave marks that must be ground and checked.

## Clamps and their removal

External clamps, chain clamps and line-up clamps hold pipe in position while it is tacked. On pipelines, an internal line-up clamp holds the joint round and aligned during the root pass, and is released and pulled to the next joint once the root is complete. The rule is that the clamp stays until enough of the root is made to hold the joint, because removing it too soon lets the pipe move and can crack the root. Pipeline procedures state how much of the root must be complete before the clamp is released and the pipe lowered, and the crew's rhythm is built around that rule.

## Supporting the pipe

A pipe joint that sags while it is being welded opens its gap at the top and closes it at the bottom, and the root changes with it. Pipe being welded is supported on stands, rollers or timber close to the joint so that its weight is not hanging on the tacks. Willis described laying mains on timber supports on the ground so they could be turned easily, which is still how pipe is rolled for welding in yards. On racks and in plants, the pipe is supported temporarily until its permanent supports are in place.

## Fit-up time

Fitting a joint takes time, often as much as welding it on small pipe. Cutting, bevelling, cleaning, aligning, tacking and checking a DN 100 joint can take as long as the root and fill together. The contractor's estimating records separate fit-up from welding for this reason, and the spool shop of Chapter 4 earns much of its advantage by making fit-up faster and more accurate, with jigs and positioners, than it can be on site.

## Branch connections

Not every pipe joint is a straight butt. Branches leave a main at a tee, a forged outlet fitting, or a set-on or set-in branch, where the branch pipe is cut to the saddle shape of the main and welded directly to it. Willis's manual showed laterals and branches welded onto mains as a routine job for the torch. Fabricated branches save fittings but are harder to fit and weld well: the saddle cut must follow a three-dimensional curve, the joint's angle changes all the way round, and the root at the crotch is difficult to reach. Codes treat them separately, often requiring reinforcement of the opening in the main. The contractor uses forged outlets or tees on pressure lines wherever the size allows, and saves fabricated branches for large, low-pressure lines where the fittings would be costly, cut with a template or a profile-cutting machine so that the fit is right before any tack is placed.

## The running case: a fit-up standard

This is an illustration. The contractor's supervisor wrote a one-page fit-up standard for each welding procedure on the dairy project, with a sketch of the joint, the bevel, root face and gap with their tolerances, the internal alignment limit, the number of tacks for each size, and the cleaning required. Each fitter carried a set of gauges: a bevel gauge, root gap gauges, a high-low gauge and a weld size gauge. The supervisor checked the first joints of each fitter and welder pair and then sampled, and the radiography results in the first month showed which pairs needed help.

## A failure: the tight root

This is an illustration. On an earlier job, a fitter working fast had set several DN 100 joints with a root gap of little more than a millimetre, because a tight gap made the joint quick to tack and looked neat. The welder made the root without complaint. Radiography showed lack of penetration along much of the circumference on four joints, which had to be cut out, rebevelled and rewelded, with new pipe pups where the cuts had shortened the line too much.

A tight gap with a full root face could not be penetrated at the procedure's current. The repairs cost several times what checking the gap with a gauge would have, and the contractor now makes the gauge check part of the fit-up sign-off, with the welder entitled to refuse a joint that is out of tolerance.

## Exercise: weld metal for a DN 200 joint

A DN 200 pipe, 219.1 mm outside with an 8.18 mm wall, is prepared with 37.5° bevels, a 1.6 mm root face and a 3 mm gap. Estimate the groove area, and the weld metal per joint if the cap and root reinforcement add about 19 mm². How much weld metal do 180 such joints need?

The groove depth is 8.18 − 1.6 ≈ 6.6 mm, so the bevel area is about 6.6² × tan 37.5° ≈ 43.6 × 0.767 ≈ 33 mm², and the gap adds 3 × 8.18 ≈ 25 mm², a groove of about **58 mm²**. With reinforcement it is about 77 mm².

The mean circumference is π × (219.1 − 8.18) ≈ 663 mm, so each joint has about 77 × 663 ≈ 51,000 mm³ of weld metal, about **0.40 kg**. One hundred and eighty joints need about **72 kg** of weld metal, before allowing for stubs, spatter and the deposition efficiency of the process, which can make the consumable bought considerably more than the metal deposited.
