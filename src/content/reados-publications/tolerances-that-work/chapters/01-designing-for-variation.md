---
book: tolerances-that-work
chapterSlug: designing-for-variation
order: 1
title: "Designing for variation, not perfection"
description: "Why every dimension needs a decided range, how function determines which features deserve tight control, and the guide roller assembly used throughout this book."
draft: true
---

A drawing shows a perfect part. The part that arrives is never perfect: every machine, tool, operator, temperature and batch of material leaves a small signature on it. A designer cannot remove that variation. A designer can only decide how much of it each feature may carry, how it will be judged and what happens when parts with different errors are assembled together.

That decision is the tolerance. It is one of the few places where a design directly sets manufacturing cost, inspection effort and field reliability with a single number. It deserves the same thought as choosing a material or a bearing, yet it is often filled in last, copied from a title block or set by habit.

This chapter sets out the principle that runs through the rest of the book: tolerances follow function. It also introduces the guide roller unit, the fictional assembly that every later chapter analyses.

## Variation is certain; its consequences are designed

Consider two shafts turned on the same lathe from the same program. One measures 19.996 mm and the other 20.004 mm at the bearing seat. Both may be good parts or both may be scrap. The answer depends entirely on what the bearing needs and what the drawing says.

Three ideas are worth separating from the start:

- **Variation** is what the process actually produces. It has a centre and a spread and it drifts over time as tools wear and machines warm up.
- **Tolerance** is the permitted range written on the drawing. It is a design requirement, not a measurement.
- **Function** is what the feature must do in the assembly: locate, seal, rotate freely, carry load, look acceptable or simply exist.

A good tolerance sits between the other two. It is wide enough that a capable process can stay inside it with margin, and narrow enough that every part inside it still performs its function. When either side of that relationship is ignored, the drawing creates cost or risk without anyone choosing it.

```figure
type: svg
title: Tolerance sits between process variation and functional limits
alt: A bell-shaped process distribution sits inside a shaded tolerance band, which in turn sits inside a wider band showing the range in which the assembly still functions.
caption: A capable process keeps its spread well inside the tolerance, and every part inside the tolerance still works.
viewbox: 0 0 640 260
body:
<rect class="bx" x="40" y="40" width="560" height="170" rx="4"/>
<rect class="bxa" x="150" y="62" width="340" height="126" rx="3"/>
<path class="la draw" pathLength="1" d="M190 188C250 188 262 80 320 80C378 80 390 188 450 188"/>
<path class="cl" d="M320 70V196"/>
<path class="ln" d="M40 226H600M40 220V232M600 220V232M150 220V232M490 220V232"/>
<text class="txb" x="320" y="30" text-anchor="middle">Functional limit: the assembly still works</text>
<text class="txa" x="320" y="56" text-anchor="middle">Tolerance on the drawing</text>
<text x="320" y="150" text-anchor="middle">Process spread</text>
<text x="95" y="128" text-anchor="middle">Margin</text>
<text x="545" y="128" text-anchor="middle">Margin</text>
<text x="320" y="250" text-anchor="middle">Measured dimension</text>
- Variation | is what the process produces: a centre and a spread that drift over time.
- Tolerance | is the permitted range written on the drawing, a design requirement.
- Function | sets the outer limit: what the feature must do in the assembly.
```

## Why tolerances are a contract

Once a drawing is issued to a supplier, the tolerances become the acceptance criteria for the work. A supplier quoting a part reads them to choose processes, machines and inspection methods. An inspector uses them to accept or reject. If a part inside tolerance does not work, the problem is the drawing, not the supplier.

That has two consequences. First, a tolerance must be **unambiguous**: two competent people measuring the same part should reach the same conclusion about conformance. A dimension without a stated datum, or a hole position with no indication of where it is measured from, invites argument. Second, the tolerance must be **complete for function**: if the assembly depends on a face being flat, square or concentric, that requirement has to be on the drawing. A supplier cannot be held to a requirement that was only in the designer's head.

Later chapters show how size tolerances, datums and geometric tolerances together make a specification that is both unambiguous and complete. The rest of this chapter is about deciding what needs specifying in the first place.

## The guide roller unit

Northgate Rollers is an invented manufacturer of conveyor and guide components. Its guide roller unit is a compact cartridge that bolts to a machine frame and guides a moving belt. The design below is simplified for teaching; the dimensions are illustrative and are not a recommendation.

| Part | Description | Key features |
|---|---|---|
| Housing | Machined aluminium alloy body with a mounting flange | Mounting face; bearing bore Ø42; shoulder at the inner end of the bore; internal groove for a retaining ring; four clearance holes for M8 screws |
| Shaft | Steel shaft that rotates with the roller | Two bearing seats Ø20; shoulder; threaded end for the roller |
| Bearings | Two deep-groove ball bearings, 20 mm bore, 42 mm outside diameter, 12 mm wide | Bought in; width and diameter tolerances set by the bearing manufacturer |
| Spacer | Steel tube between the two outer rings | Length 16 mm nominal |
| Retaining ring | Internal ring in the housing groove | Thickness set by the ring supplier |
| Frame | Customer's machine frame | Four tapped M8 holes |

The shaft rotates and the housing is stationary. The bearings therefore see a rotating load on their inner rings and a stationary load on their outer rings. That fact will decide the fits in Chapter 3.

The assembly has four functional requirements that drive every important tolerance:

1. **Bearing seats.** The inner rings must not creep on the rotating shaft, and the outer rings must locate in the housing without being crushed. This is a fit problem.
2. **Axial float.** The two outer rings, the spacer and the retaining ring are captured between the housing shoulder and the groove. The total axial clearance must stay between 0.05 mm and 0.40 mm. Too little and thermal growth or tolerance build-up can load the bearings axially; too much and the shaft can shuttle and the roller will not track. This is a stack-up problem.
3. **Mounting.** The housing must bolt to the frame with four M8 screws in every combination of good housings and good frames. This is a positional tolerance problem.
4. **Roller alignment.** The roller must run square to the frame so the belt tracks. This depends on the bore being perpendicular to the mounting face, which is an orientation problem.

Everything else on the housing, such as the outside shape of the flange, chamfers and cosmetic faces, has no functional role beyond looking tidy and fitting the available space.

## From function to features

The most useful habit in tolerancing is to list the functional requirements first and trace each one to the features that control it. For the housing that trace is short:

| Requirement | Housing features that control it |
|---|---|
| Bearing outer ring fit | Bore diameter and its form |
| Axial float | Distance from shoulder to groove load face; groove width |
| Mounting | Position of the four clearance holes relative to the mounting face and bore |
| Roller alignment | Perpendicularity of the bore axis to the mounting face |

A useful classification, adapted from common design review practice, places every feature in one of three groups:

- **Critical features** directly control a functional requirement. They get deliberately chosen tolerances, explicit datums and a defined inspection method.
- **Important features** affect assembly or performance less directly, such as clearances around moving parts. They get reasoned tolerances but usually not individual analysis.
- **General features** have no functional effect beyond appearance and fit within the envelope. They are covered by a general tolerance note.

On a typical machined housing the critical list is surprisingly short, often fewer than ten features. That is where engineering effort should go. A drawing that spends equal care on every dimension spends too little on the ones that matter.

```figure
type: layers
title: Where tolerancing effort belongs
shape: pyramid
caption: Most features are general; the few critical ones deserve deliberate tolerances, datums and an inspection method.
- *Critical | Directly control a function. Chosen tolerances, explicit datums, defined inspection. Often fewer than ten.
- Important | Affect assembly or performance less directly. Reasoned tolerances without individual analysis.
- General | Appearance and envelope only. Covered by the general tolerance note.
```

## What tighter tolerances cost

Tighter tolerances cost money through several mechanisms, and it helps to name them because they suggest where savings come from:

- **Process choice.** Below a certain range, a feature that could be turned or milled must be ground, reamed, honed or lapped. Each extra operation adds a set-up, machine time and handling.
- **Slower cutting.** Within one process, holding a closer tolerance usually means lighter finishing cuts, more frequent tool changes and more time waiting for machines to reach thermal stability.
- **Inspection.** A tolerance of a few micrometres may need a temperature-controlled room, a coordinate measuring machine or dedicated gauges, plus time to measure every part rather than a sample.
- **Scrap and rework.** If the process spread is close to the tolerance, some parts will fall outside it. Those parts cost the full manufacturing price and return nothing.
- **Supplier pool.** Very tight work narrows the number of capable suppliers and weakens price competition.

The relationship is strongly non-linear. Halving a tolerance that a process holds comfortably may cost little. Halving one that is already at the edge of the process can force a different process altogether. Handbooks and standards include charts relating machining processes to tolerance grades, and they show the broad pattern: grinding, honing and lapping reach finer grades than turning and milling, which in turn reach finer grades than drilling. The capability that matters for a particular part, however, is the measured capability of the supplier's machine, at that size and in that material.

The cost of loose tolerances is less visible but often larger: assemblies that need selective fitting, warranty returns, noisy or short-lived products and investigation time when parts that pass inspection still fail to work together.

## Tolerance follows function, then capability

A practical sequence for setting any critical tolerance is:

1. **State the functional limit.** What range of the assembled condition still works? For the guide roller, axial float between 0.05 mm and 0.40 mm.
2. **Find the contributing dimensions.** Which features on which parts add up to that condition? Chapter 7 shows how to draw this chain.
3. **Allocate the range.** Share the allowable variation between contributors, giving more to features that are expensive to control and less to those that are cheap. Chapter 9 covers allocation.
4. **Check against capability.** Compare each allocated tolerance with what the intended process and supplier can actually hold. If a tolerance is tighter than the process, change the design, the process or the allocation; do not simply hope.
5. **Define verification.** Decide how each critical tolerance will be measured, from which datums and with what instrument. Chapter 10 deals with measurement.

This sequence reverses the common habit of choosing tolerances first and discovering their consequences in production. It also produces a record, the reasoning behind each number, that makes later changes much safer.

```figure
type: steps
title: Setting a critical tolerance: function first, then capability
caption: The sequence produces a record of the reasoning behind every critical number.
- State the functional limit | e.g. axial float 0.05 to 0.40 mm
- Find the contributors | the dimension chain (Chapter 7)
- Allocate the range | more to costly features (Chapter 9)
- Check capability | against the real process and supplier
- Define verification | method, datums, instrument (Chapter 10)
```

## Common mistakes

- **Template tolerances.** A title block that says ±0.1 mm on all dimensions applies a single number to features with very different functions. It is usually too tight for cosmetic features and sometimes too loose for critical ones.
- **Tolerancing what is easy to dimension.** Drawings often tolerate the distances that are convenient to draw, such as from an edge, rather than the relationships that control function, such as hole position relative to a bore.
- **Ignoring bought-in parts.** Bearings, rings, seals and fasteners have their own manufacturing tolerances. They belong in stack-ups even though nobody at the design office draws them.
- **Treating the nominal as the design.** Checking that an assembly works at nominal dimensions proves almost nothing. It must work at the combinations of limits that real parts will produce.
- **No inspection thought.** A tolerance that cannot be measured with available equipment is not a usable requirement.

## Questions to ask

- What does this feature do in the assembly, and what happens if it is at either limit?
- Which other parts and features contribute to the same functional condition?
- Can the intended supplier hold this tolerance with margin, and what evidence shows that?
- How will this requirement be measured, and from which features?
- Is any bought-in part's tolerance missing from the analysis?

## Exercise: classify one drawing

Take a drawing of a part you know well. List its functional requirements in the assembly, then mark every dimension and tolerance as critical, important or general. Count how many tolerances are tighter than their function needs and how many functional relationships have no tolerance at all. Most first attempts find both.

The next chapter examines the basic building block: the size tolerance, and the ISO system that gives each size range a consistent set of tolerance grades.
