---
book: metal-fatigue-by-the-numbers
chapterSlug: how-metal-tires
order: 1
title: "How metal tires"
description: "Why steel parts break under loads well below their strength: slip bands, crack starts, crack growth and final fracture, and how to read the story on a broken surface."
draft: false
---

A steel shaft that carries a load of half its yield strength once will carry it for ever. Make it carry the same load forty times a minute for a year and it may break. Nothing about the steel changed that anyone could see, no single load was too high, and yet the part failed. That is fatigue: damage that builds up, cycle by cycle, in a material loaded well inside its static strength.

This chapter explains where that damage comes from, how it turns into a crack and how the crack finally breaks the part. It introduces the book's running case, the PK-20 carton erector and the cracked camshafts of the machine it replaces, and it shows how to read a fatigue fracture surface, because the broken part is usually the best evidence an engineer will get.

## Why repeated small loads matter

A metal is not a uniform solid. It is a mass of crystals, called grains, each an ordered array of atoms stacked in a regular lattice. Under load the lattice stretches elastically, and when the load is removed it springs back. That is the behaviour that design formulas assume, and it is right for the bulk of a part almost all the time.

But the lattice is never perfect. It contains line-like defects called dislocations: lines along which the stacking of atoms is out of step. A dislocation can move through the crystal at a shear stress far below what it would take to slide a whole plane of atoms over another at once, and each time one sweeps across a plane, the crystal on one side shifts by one atomic spacing relative to the other. That movement is what plastic deformation is. A part that bends permanently does so because billions of dislocations have moved.

In a part loaded below its yield strength, most grains never see enough stress for dislocations to move far. A few do. Grains whose slip planes happen to lie at the most favourable angle to the load, grains at the surface where nothing holds them in on one side, and grains at the root of a notch where the stress is higher than the average, will see a little dislocation movement on every cycle even when the part as a whole is elastic.

That movement does not fully reverse. On each cycle, dislocations move out and back along slightly different paths, tangle, and gather into bands of intense slip. Where those bands meet the surface they push out tiny ridges and dig tiny grooves, a few tenths of a micrometre high, called extrusions and intrusions. An intrusion is a sharp notch at atomic scale. After enough cycles one of them becomes a crack.

### Three stages

Fatigue failure therefore has three stages, and design treats each differently.

1. **Crack initiation.** Slip concentrates in bands, the surface roughens and a crack forms in one or a few grains. In a smooth, well-finished part under a modest stress, this stage can take most of the life.
2. **Crack growth.** The crack turns to run at right angles to the largest tensile stress and grows a small distance on each cycle, opening on the tensile half of the cycle and blunting and resharpening as it goes. Its growth rate rises as it gets longer, because the stress at its tip rises with its length.
3. **Final fracture.** The remaining section can no longer carry the peak load, and it breaks in one cycle by ductile tearing or brittle cleavage.

```figure
type: timeline
title: The life of a fatigue crack in a rotating shaft
caption: An outline of the stages, not a timetable. How the life divides between them depends on the stress, the notch and the material. In a smooth part at low stress most of the life is spent starting the crack; at a sharp notch or a high stress, most of it is spent growing one.
- Slip bands | dislocations move a little on every cycle in favourably placed surface grains
- Extrusions and intrusions | the surface roughens at the scale of tenths of a micrometre
- * Crack initiation | a microcrack forms in one grain, usually at the surface or a notch root
- Crack growth | the crack turns perpendicular to the largest tensile stress and grows a little each cycle
- Final fracture | the remaining section breaks in one cycle when it can no longer carry the peak load
```

### What this means for design

Three practical conclusions follow from this picture, and every later chapter uses them.

- **Fatigue is a surface and notch problem.** Cracks almost always start at the surface, and at the highest local stress. Surface finish, scratches, corrosion pits, the radius of a fillet and the edge of a keyway matter far more than the strength of the steel in the middle of the section.
- **Fatigue depends on the stress range, not just the peak.** It is the cycling that moves the dislocations. A part that carries a steady stress of 300 MPa may last for ever; the same part cycling between 0 and 300 MPa may not.
- **Fatigue lives scatter.** Crack initiation depends on which grain happens to be worst placed, where the deepest scratch is, and how large the worst inclusion is. Identical parts on identical tests can differ in life by a factor of ten. Design must allow for that.

## The running case: the PK-16 camshafts

The book follows one design job. This is an illustration. A packaging machinery builder in Wetherill Park, New South Wales, sells the PK-16 carton erector. Its main camshaft turns once for each carton, 40 times a minute. The cam follower on the end of the shaft pushes a rocker lever that erects the carton, and its reaction puts a bending moment on the shaft at the shoulder beside the follower-side bearing.

Of the 36 PK-16 machines in the field, 11 cracked their camshafts within their first year of running, 4,000 running hours, and more were cracking in their second year. The crack was always in the same place: the fillet where the 30 mm bearing seat steps up to the 36 mm body. No shaft had been overloaded; the moment there had been calculated and the stress checked against the steel's yield strength with a safety factor of almost 7.

The builder is now designing the PK-20 to replace the PK-16, and the camshaft, the rocker lever, the return spring and the bolts that hold the cam housing to the frame must all last the PK-20's 10-year design life.

```figure
type: steps
title: Counting the cycles the PK-20 must survive
caption: This is an illustration. Each cam revolution gives one full cycle of rotating bending on the camshaft and one load cycle on the lever, spring and housing bolts.
- Cycles per minute | 40, one per carton
- Running hours per year | 2 shifts × 8 h × 250 days = 4,000 h
- * Cycles per year | 40 × 60 × 4,000 = 9.6 million
- Cycles over the 10-year design life | 96 million
- What that means | far beyond 10⁶ cycles: the design must aim for infinite life
```

Ninety-six million cycles is a large number. Laboratory fatigue tests on steel usually stop at 10 million cycles, and design methods for steel assume that a part which survives about a million cycles at a stress below its endurance limit will survive indefinitely. The PK-20 design must therefore aim for stresses below that limit, with a margin. Chapter 3 explains what the limit is and how to estimate it.

### The cost of getting it wrong

The broken PK-16 shafts did not injure anyone, because the follower and lever are inside guards and the machine stopped when the follower dropped. But each failure stopped a customer's packing line. A replacement shaft, bearings and a technician's day cost the builder A$2,860 including GST per machine under warranty, before any claim for the customer's lost production. This is an illustration. Eleven failures in the first year cost A$31,460 in direct repairs alone.

## Reading a fatigue fracture

The broken shafts were sent to the builder's design office, and the fracture surfaces told most of the story before anyone did a calculation.

```figure
type: svg
title: The fracture surface of a PK-16 camshaft
alt: A circular cross-section of a broken shaft. At the top edge a small dot marks the crack origin at the fillet surface. Curved lines, like ripples spreading from the origin, cover most of the section and are labelled beach marks in the smooth fatigue zone. A smaller rough region on the opposite side, roughly crescent shaped and off centre, is labelled final fracture. An arrow at the side shows the direction of shaft rotation, and a note says the final fracture zone is displaced against the rotation.
caption: This is an illustration. A smooth fatigue zone with beach marks spreading from a single origin at the fillet, and a small, rough final-fracture zone. The small size of the final zone shows that the nominal stress was low; its offset against the direction of rotation is typical of rotating bending.
viewbox: 0 0 640 340
body:
<circle class="bx" cx="300" cy="170" r="140"/>
<circle class="fa" cx="300" cy="32" r="6"/>
<path class="ln" d="M240 50Q300 110 360 50"/>
<path class="ln" d="M210 75Q300 170 390 75"/>
<path class="ln" d="M185 110Q300 230 415 110"/>
<path class="ln dsh" d="M170 150Q300 280 430 150"/>
<path class="bxa" d="M205 270Q300 320 395 270Q340 230 260 245Q225 252 205 270Z"/>
<path class="la" d="M300 32V8"/>
<text class="txb" x="320" y="24">crack origin at the fillet</text>
<text class="tx txs" x="455" y="100">beach marks</text>
<text class="tx txs" x="455" y="120">smooth fatigue zone</text>
<path class="ln" d="M450 105L405 100"/>
<text class="tx txs" x="455" y="285">final fracture</text>
<text class="tx txs" x="455" y="305">rough, small, offset</text>
<path class="ln" d="M450 290L380 280"/>
<path class="la draw" pathLength="1" d="M90 260A150 150 0 0 1 90 80"/>
<path class="ah" d="M84 86L90 74L96 86Z"/>
<text class="tx txs" x="20" y="300">rotation</text>
```

### What each feature means

- **The origin.** A fatigue crack usually starts at one point, or at a few points on the same line. On the PK-16 shafts it was at the root of the 0.5 mm fillet, on the surface. A single origin points to a stress concentration; many origins around the circumference point to a high nominal stress.
- **The fatigue zone.** It is smooth, often slightly polished by the crack faces rubbing, and flat at right angles to the shaft axis, because bending puts the largest tensile stress along the axis. On the PK-16 shafts it covered about four-fifths of the section.
- **Beach marks.** Curved lines spreading from the origin, like the edge of the tide on a beach. Each marks a change in the conditions of growth: a stop over a weekend, a change of product, a period of heavier load. They are not one line per cycle; the individual cycle marks, called striations, are a thousand times finer and need an electron microscope to see.
- **The final fracture zone.** Rough, fibrous or crystalline. Its size shows the stress at the end: a small zone means the remaining section broke under a low nominal stress, a large zone means the stress was high. Its position, offset against the direction of rotation, is typical of a rotating shaft, because the crack grows faster on the side where the tensile stress arrives first.

```figure
type: compare
title: What fracture surfaces say about the load
cols: Origins | Fatigue zone | Final fracture zone | Usually means
rowhead: Pattern
- * Single origin, small final zone | one, at a notch or defect | large, with beach marks | small | low nominal stress, high local stress: a notch problem; the PK-16 shafts
- Several origins around the surface, small final zone | many, on ratchet lines between them | large | small | moderate stress with a severe notch all round, such as a sharp shoulder
- Single origin, large final zone | one | small | large | high nominal stress: the part was too small for its load
- No fatigue zone, all rough | none | none | the whole section | a single overload, not fatigue
caption: General patterns described in fractography texts such as Dowling's. Fracture surfaces must be protected from rubbing, rust and handling as soon as a part is found, or the evidence is lost.
```

### The error: the static check that looked safe

The PK-16's camshaft had been checked, and the check passed. The designer had calculated the bending moment at the shoulder, 260 N·m, and the steady torque, 100 N·m, found the bending and shear stresses in the 30 mm section, combined them into a von Mises equivalent stress of 103 MPa, and compared that with the steel's yield strength of 700 MPa: a safety factor of 6.8. Chapter 2 works the same numbers.

That check answered a question nobody needed to ask. The shaft was never going to yield. What it had to resist was 9.6 million reversals of its bending stress a year, concentrated at a fillet of only 0.5 mm radius, on a turned surface. None of that was in the static check.

The fracture surface showed it at once: a single origin at the fillet root, a smooth fatigue zone across most of the section and a small final fracture. That pattern means the nominal stress was low and the local stress at the notch was high. It is the classic signature of a design that was checked for strength but not for fatigue.

When the shaft was checked again with the fatigue design check tool, using the method that Chapters 3 to 5 explain, the answer changed completely. With the estimated endurance limit corrected for a machined surface, a 30 mm size and 95% reliability, and the 0.5 mm fillet's stress concentration, the safety factor against fatigue was 1.11, against the 1.5 the builder now requires. That is not a comfortable margin. Given the scatter in fatigue strength, and heavier loads with some products (Chapter 6), a failure rate of nearly a third in the first year is just what such a margin would predict.

## The fatigue design check tool

The [fatigue design check](/tools/fatigue-design-check/) tool does the whole first estimate in one place, and later chapters take it apart step by step. From the tensile and yield strength it estimates the test-specimen endurance limit as half the tensile strength, capped at 700 MPa, unless a tested value is entered. It multiplies that by the five correction factors for surface, size, load type, temperature and reliability. It finds the fatigue notch factor from the stress concentration factor and the notch radius by Peterson's relation, applies it to the nominal maximum and minimum stresses to get the alternating and mean stresses, and returns the Goodman, Soderberg and Gerber safety factors with a first-cycle yield check. If the equivalent stress lies above the corrected endurance limit, it estimates a finite life from the S-N line.

```figure
type: compare
title: The PK-16 camshaft in the fatigue design check tool
cols: Input or result | Value
rowhead: Item
- Tensile and yield strength | 900 and 700 MPa
- Endurance limit estimate | 0.5 × 900 = 450 MPa
- Correction factors | surface 0.744, size 0.862, load 1, temperature 1, reliability 0.868
- Corrected endurance limit | 250.5 MPa
- Fillet | stress concentration factor 2.6, radius 0.5 mm
- Nominal bending stress, fully reversed | +98.1 to −98.1 MPa
- Fatigue notch factor | 2.303
- Alternating stress at the fillet | 225.9 MPa
- * Goodman safety factor | 1.11, against 1.5 required: MARGIN TOO SMALL
- First-cycle yield factor | 3.10
caption: This is an illustration. The stress concentration factor is the designer's reading from a chart for the PK-16's proportions. The safety factor is above 1, so the estimate predicts infinite life on average, but the margin is too small for the scatter of real parts and loads.
```

The tool's result is "MARGIN TOO SMALL", not "FATIGUE FAILURE EXPECTED". That distinction matters. A safety factor of 1.11 means that the average PK-16 shaft, under the average load, should last. It does not mean every shaft will. Half of a population of parts is weaker than average, some loads are heavier, and a margin of 11% cannot cover both. Chapter 10 shows how the PK-16's field failures fit a statistical pattern that says exactly that.

## What the PK-20 design must do

From the fracture surfaces and the first check, the builder set the PK-20's design rules for every part that cycles:

- design for infinite life under the normal load, with a Goodman safety factor of at least 1.5 on the corrected endurance limit;
- check the finite life separately for any load that exceeds the endurance limit, however rarely (Chapter 6);
- treat every fillet, hole, keyway and thread as a notch, and check the stress there, not the nominal stress;
- specify the surface finish where it matters, and inspect it (Chapter 10);
- prove the design on test before release, and watch the first machines in service.

```figure
type: checklist
title: PK-20 fatigue design rules, as adopted
caption: This is an illustration. The rules the builder wrote after the PK-16 investigation. The open items are the subject of later chapters.
- x Design life stated in cycles: 96 million
- x Fatigue check required for every cycling part, not only a static check
- x Required Goodman safety factor 1.5 on the corrected endurance limit
- ? Notch factors at every fillet, hole and keyway (Chapter 4)
- ? Finite-life check for heavy-carton loads (Chapter 6)
- ? Bolt preload and spring stroke under control (Chapters 8 and 9)
- ? Surface finish specified and inspected at the critical fillets (Chapter 10)
```

## Safety and duty of care

A fatigue failure can be dangerous as well as costly. A broken shaft can drop a load, a broken spring can release stored energy, and a broken bolt can let a housing move. Under the model WHS laws, a business that designs or manufactures plant must ensure, so far as is reasonably practicable, that it is without risks to health and safety when used as intended, and Safe Work Australia's model Code of Practice on managing the risks of plant explains how. Guards that contain a part if it breaks, and stops that detect a failure, are part of the answer; designing the part not to break is the first part.

## Exercise: how many cycles?

The PK-20's optional high-speed version runs at 55 cartons a minute on three shifts of 8 hours, 300 days a year. How many cycles does its camshaft see over a 10-year life, and does the infinite-life design rule still apply? If the corrected endurance limit is taken as the stress for 10⁶ cycles, how many days of running does a million cycles take?

**Worked answer.** Running hours a year are 3 × 8 × 300 = 7,200 h. Cycles a year are 55 × 60 × 7,200 = 23.76 million, and over 10 years 237.6 million. That is far beyond 10⁶, so the design must still aim for infinite life: the rule applies with even more force, because any stress above the endurance limit, however rarely it occurs, will use up life faster.

A million cycles at 55 a minute takes 1,000,000 ÷ 55 = 18,182 minutes, or 303 hours. At 24 running hours a day that is about 12.6 days. A part stressed just above its endurance limit, which an S-N line would credit with about a million cycles, would last less than a fortnight on this machine.
