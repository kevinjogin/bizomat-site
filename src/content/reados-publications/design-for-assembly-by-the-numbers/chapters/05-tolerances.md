---
book: design-for-assembly-by-the-numbers
chapterSlug: tolerances-that-let-parts-go-together
order: 5
title: "Tolerances that let parts go together"
description: "Set fits, lead-ins and stacks so parts always go together and the assembled product meets its function, and show that fewer parts give shorter stacks that pass on worst case, not on statistics."
draft: false
---

A design can be easy to assemble on paper and still give trouble at the bench, because real parts are never exactly the size on the drawing. Every dimension varies within its tolerance, and in an assembly those variations add up. Two things can go wrong. Parts can refuse to go together, because a pin is at its largest and a hole at its smallest, or because two features are slightly out of line. And parts that do go together can make a product that does not work, because the variations have added up along a chain of dimensions to put a critical gap or protrusion out of limits.

Design for assembly helps with both, because fewer parts mean fewer variations to add. This chapter sets the fits and lead-ins that let revision B's parts go together, then compares the IP-16's most important tolerance stack, the protrusion of the nose, in revision A and revision B. The failure case is a batch of revision A plungers that a customer rejected, from parts that were all within their own tolerances.

## Explicit limits for the fits

Revision B has two fits that matter for assembly, and both are written on the drawings as explicit limits of size. ISO 286 is the international system for describing fits by tolerance grades, and the company's drawings could use it, but explicit limits let assemblers and inspectors read the sizes directly.

```figure
type: compare
title: Revision B's two working fits
cols: Hole | Shaft or bush | Result
caption: This is an illustration. Limits are the company's drawing values. The press fit's holding force depends on the interference, so the push-out test in Chapter 8 is made at the smallest interference, not the typical one.
- Plunger shank in body bore | bore 10.000 to 10.022 mm | shank 9.972 to 9.987 mm | clearance 0.013 to 0.050 mm
- *Rear bush in body | bore 14.000 to 14.018 mm | bush outside 14.028 to 14.039 mm | interference 0.010 to 0.039 mm
```

The plunger's clearance fit lets it slide freely under the spring while keeping it reasonably straight in the bore. The smallest clearance, 0.013 mm, must still allow free movement with a film of grease and at the coldest temperature the product meets.

The bush's interference fit is where design for assembly and tolerancing meet. The holding force of a press fit rises with the interference. A bush at the bottom of its outside limit in a bore at the top of its limit has only **0.010 mm** of interference, and holds the least. The 1,500 N push-out rating in Chapter 4 came from prototypes; the pilot build in Chapter 8 tests bushes deliberately chosen near the smallest interference, because that is the case the rating must cover. A bush at the other extreme, 0.039 mm, needs the most force to press in, and the press fixture must provide it without distorting the body's thin rear wall.

## Lead-ins that capture misalignment

A part placed by hand never lands exactly on the centre of its hole. The chamfer on the bush, the body's bore and the knob's insert are there to catch the part when it lands off-centre and guide it in. A chamfer works only if its width is larger than the largest misalignment it must catch.

The team measured where assemblers actually placed the bush in the prototype trial, using the video, and found it within about 0.3 mm of centre. A chamfer 0.5 mm wide, measured radially, on the bush's leading edge and another 0.5 mm wide on the bore's entry give about 1.0 mm of combined lead-in, more than three times the 0.3 mm misalignment seen. The chamfer angle matters too: a shallow angle, around 30° from the axis, turns the press's push into a gentle centring force, while a steep one tends to make the part catch on the edge and tilt. Wider chamfers would catch more, but each one shortens the length of the fit that actually holds the bush, so they were kept no wider than needed. The same thinking applies to the plunger's nose entering the body's bore past the O-ring, where the bore's chamfer has a second job: it lets the O-ring pass the edge without being cut, a problem Chapter 6 returns to.

## The nose protrusion stack

The IP-16's most important dimension is how far the nose protrudes from the front face of the body when engaged. Customers design the hole the nose drops into, and too little protrusion means a weak lock; too much means the nose can bottom in a shallow hole. This is an illustration: the IP-16's specification is **6.2 to 6.8 mm**, a nominal of 6.5 mm.

The protrusion is set by a chain of dimensions, from the face where the plunger stops to the tip of its nose and back along the body to its front face.

### Revision A's chain

In revision A the plunger is stopped by the cross pin bearing on the rear cap's outer face. The chain runs through five dimensions:

1. the plunger, from the cross pin's hole to the nose tip, 54.25 ± 0.10 mm, added;
2. the clearance of the cross pin in its hole, which lets the pin sit up to 0.05 mm either way, taken as 0 ± 0.05 mm;
3. the cross pin's radius, 1.25 ± 0.02 mm, subtracted;
4. the rear cap's flange thickness, 4.00 ± 0.10 mm, subtracted;
5. the body, from its rear face to its front face, 42.50 ± 0.10 mm, subtracted.

### Revision B's chain

In revision B the plunger's collar stops against a step inside the body. The chain has two dimensions:

1. the plunger, from the collar's front face to the nose tip, 30.50 ± 0.05 mm, added;
2. the body, from its internal step to its front face, 24.00 ± 0.05 mm, subtracted.

The rear bush is not in the chain at all, because the spring holds the collar against the step, not against the bush.

### Checking both with the tool

The [Tolerance Stack Design tool](/tools/tolerance-stack-design/) handles a one-dimensional stack of up to six dimensions with symmetric tolerances. It takes each dimension's direction, nominal and tolerance, the smallest and largest gap allowed, an inflation factor for the root-sum-square method, the process capability index of each dimension, and the largest reject share accepted. It returns the nominal gap, the worst-case limits, the root-sum-square limits, the statistical spread from the capability index, the predicted share of assemblies outside the required range assuming centred normal distributions, and the largest contributor.

```figure
type: compare
title: Nose protrusion stack, revision A against revision B
cols: Revision A, five dimensions | Revision B, two dimensions
caption: This is an illustration. Requirement 6.2 to 6.8 mm; each dimension's process capability index taken as 1.33; reject limit 0.27%. Worst case adds every tolerance; root-sum-square assumes independent, centred, normal variation.
- Nominal protrusion | 6.50 mm | 6.50 mm
- Worst-case range | 6.13 to 6.87 mm | 6.40 to 6.60 mm
- Root-sum-square range | 6.319 to 6.681 mm | 6.429 to 6.571 mm
- Predicted rejects, centred processes | effectively zero | zero
- *Verdict | passes only statistically | passes on worst case
```

Revision A fails on worst case: if every part happened to be at its unfavourable limit, the protrusion could be 6.13 or 6.87 mm, outside the 6.2 to 6.8 mm requirement. It passes on root-sum-square, and the tool predicts a vanishingly small share of rejects, provided each process is centred on its nominal with the stated capability. Revision B passes on worst case, with **0.2 mm** to spare at each end: every assembly made from parts within their tolerances will be within specification, whatever the parts.

That is a direct benefit of design for assembly that rarely appears in the savings figures. Removing the cross pin and rear cap from the chain shortened it from five links to two and made a statistical pass into a certain one.

## A failure case: parts in tolerance, product out

This is an illustration. A year before this review, a customer rejected a delivery of 200 revision A plungers because the noses protruded too little; their inspector measured several at about 6.1 mm. Every part in the rejected units, when the company measured them, was within its drawing tolerance.

The cause was not any single part but three batches running off-centre at the same time. The plungers came from a new bar supplier and ran about 0.08 mm short of their nominal. The bodies and rear caps from that month's machining both ran about 0.08 mm long. Each was well inside its own ±0.10 mm. Together they moved the stack's centre from 6.50 mm to about **6.26 mm**.

The root-sum-square calculation had predicted almost no rejects because it assumed every process was centred. Running the stack again with the three nominals shifted by 0.08 mm, the tolerance stack tool predicts about **9.3%** of assemblies below 6.2 mm, and a worst case down to 5.89 mm. A statistical tolerance only works if the processes behind it are centred and stable, and a five-part stack gives five chances for one of them not to be.

The detection was the customer's incoming inspection, which is the most expensive place to find it. The short-term correction was to sort the stock and measure protrusion on every unit at the function test. The lasting correction is revision B, whose two-dimension stack passes on worst case and does not depend on the suppliers' processes being centred.

## The lock-out stack

The IP-16 has a second function with its own stack: the locked-out position. In revision B, the knob's moulded lug sits in a slot in the body's rear face when the plunger is engaged. To lock it out, the operator pulls the knob and turns it a quarter turn, so the lug rests on the rear face instead. The plunger is then held back by the depth of the slot, and the nose must be fully withdrawn into the body, with some clearance, so that the customer's moving part can pass freely.

This is an illustration. The slot is **7.5 ± 0.10 mm** deep. The nose withdraws by the slot depth from its engaged position, so its distance behind the front face in lock-out is the slot depth minus the protrusion. The requirement is at least **0.5 mm** behind the face.

```figure
type: range
title: Nose position in the locked-out state, revision B
unit: mm behind the body's front face
min: 0
max: 1.5
caption: This is an illustration. Slot depth 7.4 to 7.6 mm minus protrusion 6.4 to 6.6 mm, by worst case. The requirement is at least 0.5 mm. The bush pressed 0.4 mm too deep in Chapter 4's failure case stopped the lug reaching the face at all, which is a different failure: the plunger's travel ran out before the slot's depth was reached.
- Requirement | 0.5 | 1.5 | nose at least 0.5 mm inside the body
- * Revision B, worst case | 0.8 | 1.2 | slot depth minus protrusion
- Nominal | 1.0 | 1.0 | 7.5 − 6.5
```

The worst case gives **0.8 to 1.2 mm**, which meets the requirement with 0.3 mm to spare. A second condition must also hold: the plunger must be able to travel far enough for the lug to clear the slot. The travel available is the distance from the collar's rear face to the bush's front face when engaged, and the bush, pressed flush to a hard stop, puts that face in a known place. That is why the hard stop in Chapter 4 was a tolerance decision as well as an assembly one: without it, the bush's position was a dimension with no tolerance at all.

## Measuring the stack at the bench

Revision B's function test, described in Chapter 6, measures nose protrusion on every unit with a simple go and no-go gauge: a fixture with two steps, at 6.2 and 6.8 mm, that the nose must reach and must not pass. It takes about a second and turns the stack from a calculation into a measured fact for each unit shipped. A gauge like this is cheap, and the cost of not having one was a rejected delivery.

## Tolerances that cost money

Tolerances also have a price. A tighter tolerance needs a more capable process, more inspection, or both. The ±0.05 mm tolerances in revision B's two-dimension chain are tighter than revision A's ±0.10 mm, but there are only two of them, and both are turned or bored dimensions that the company's CNC lathe holds comfortably. The plunger supplier priced the ±0.05 mm collar-to-nose length at no extra cost because it is cut in the same set-up as the nose. The exercise asks how far that tolerance could be relaxed if a cheaper process ever needed it.

## How this applies to a small Australian business

Write fits as explicit limits that assemblers and inspectors can read, and test a press fit's holding force at its smallest interference. Size every lead-in chamfer for the misalignment that actually happens at the bench, which a video will show. Draw the chain of dimensions behind each critical gap or protrusion and count its links; each part removed by design for assembly is a link removed. Prefer stacks that pass on worst case. When a stack passes only on statistics, check that every process in it is centred and stable, and measure the result on the product.

## Exercise: a looser plunger

To let a second supplier quote for revision B's plunger, the company asks how far the plunger's collar-to-nose tolerance could be relaxed while the stack still passes on worst case. First check **±0.15 mm** with the body at ±0.05 mm. Then find the largest symmetric plunger tolerance that still passes worst case.

**Worked answer.** With the plunger at ±0.15 mm and the body at ±0.05 mm, the [Tolerance Stack Design tool](/tools/tolerance-stack-design/) gives a worst-case range of **6.30 to 6.70 mm**, which passes, and a root-sum-square range of 6.342 to 6.658 mm. The plunger becomes the largest contributor. The requirement allows ±0.30 mm about the 6.50 mm nominal, and the body takes 0.05 mm of it, so the largest plunger tolerance that still passes on worst case is **±0.25 mm**. Anything up to that would keep every assembly in specification without relying on statistics, provided the processes really stay inside their tolerances, which the protrusion gauge at the function test confirms.
