---
book: tolerances-that-work
chapterSlug: datums-and-reference-frames
order: 4
title: "Datums and the datum reference frame"
description: "Choose datum features that reflect how a part is located in its assembly, order them correctly and build a reference frame that manufacturing and inspection can reproduce."
draft: false
---

A dimension is a distance between two things. On many drawings one of those things is unclear: a hole is dimensioned from an edge, but which edge, touching where, with the part resting on which face? Two inspectors can measure the same part from different starting points and both be right according to the drawing, while disagreeing about whether the part conforms.

Datums solve that problem. They declare which features of the part establish the reference from which other features are located and oriented. Chosen well, they also make the drawing describe how the part actually sits in its assembly, which is the only reference that matters to function.

## Datum features, datums and simulators

Three related terms are often confused:

- A **datum feature** is a real, imperfect feature on the part, such as the mounting face of the Northgate housing. It is indicated on the drawing with a datum feature symbol and a letter.
- A **datum** is the theoretically exact plane, axis, line or point derived from that feature. A flat face gives a plane; a cylinder gives an axis.
- A **datum feature simulator** is the physical or computed geometry used to establish the datum in practice: a surface plate under the face, an expanding mandrel in the bore, or the fitting algorithm in a coordinate measuring machine.

The distinction matters because the real feature is never perfect. A mounting face that rocks slightly on a surface plate establishes a datum plane defined by its high points, not by an average. ISO 5459 and ASME Y14.5 both define how a datum is derived from an imperfect feature. Inspectors, programmers and designers need the same understanding, or measurements will differ.

## Six degrees of freedom

A rigid part in space can move in six ways: translation along three axes and rotation about three axes. A complete reference frame removes all six. The classic way to visualise this is the 3-2-1 principle for a prismatic part:

- The **primary datum** is established by the largest or most important face resting on three points. It removes three degrees of freedom: translation normal to the face and rotation about two axes.
- The **secondary datum** is established by a second face against two points, perpendicular to the first. It removes two more.
- The **tertiary datum** is a third face against one point, removing the last.

The order matters. If a part is first placed on its bottom face and then pushed against a side, the result differs from first pushing it against the side and then lowering it onto the bottom face, because the faces are not perfectly perpendicular. The datum letters in a geometric tolerance are therefore read in order of precedence: primary, secondary, tertiary.

```figure
type: svg
title: The 3-2-1 principle: three datum planes remove six degrees of freedom
alt: An isometric block rests on three contact points on its base, datum A, two points on its back face, datum B, and one point on its side face, datum C.
caption: Precedence matters: a part placed on A first and then pushed against B sits differently from one located the other way round.
viewbox: 0 0 640 330
body:
<path class="bx" d="M190 150L380 90L560 150L370 210Z"/>
<path class="bx" d="M190 150V250L370 310V210Z"/>
<path class="bx" d="M370 210L560 150V250L370 310Z"/>
<path class="lf dsh" d="M120 250L330 186L620 250L400 316Z"/>
<circle class="fa pulse" cx="250" cy="262" r="7"/>
<circle class="fa pulse" cx="345" cy="290" r="7"/>
<circle class="fa pulse" cx="470" cy="262" r="7"/>
<text class="txa" x="96" y="292">A: primary, 3 points</text>
<path class="la flow" d="M560 175L615 157M560 228L615 210"/>
<circle class="fa" cx="560" cy="175" r="6"/>
<circle class="fa" cx="560" cy="228" r="6"/>
<text class="txa" x="470" y="70">B: secondary, 2 points</text>
<path class="la flow" d="M190 195L140 178"/>
<circle class="fa" cx="190" cy="195" r="6"/>
<text class="txa" x="40" y="160">C: tertiary, 1 point</text>
<text x="380" y="135" text-anchor="middle">Part</text>
```

Not every part needs all three. A tolerance that controls only orientation, such as the perpendicularity of a bore to a face, needs only the face. A pattern of holes located around a bore may need a face and the bore axis, with a third datum only if the rotational position of the pattern matters.

```figure
type: bars
title: Degrees of freedom left as each datum is established
unit: free
max: 6
caption: Orientation-only tolerances need just datum A. Clocking a hole pattern about a bore needs the full frame.
- Unconstrained part | 6 | three translations, three rotations
- After primary datum A | 3 | one translation and two rotations removed
- After secondary datum B | 1 | two more removed
- *After tertiary datum C | 0 | the reference frame is complete
```

## Choosing datum features from function

The best datum features are the ones that locate the part in its assembly. For each part, ask how it is held in place by its neighbours and in what order contact happens.

The Northgate housing is bolted to the machine frame. Its mounting face sits flat against the frame first, the bearing bore then carries the shaft, and the bolt holes clock the housing rotationally. Its natural datum reference frame is:

| Datum | Feature | Why |
|---|---|---|
| A (primary) | Mounting face of the flange | It contacts the frame first and controls the tilt of the roller axis |
| B (secondary) | Bearing bore axis Ø42 | It carries the bearings and therefore the shaft; other features must be located relative to it |
| C (tertiary) | One of the four bolt holes, or a dowel hole if added | It fixes the rotational orientation of the housing about the bore axis |

With that frame, the drawing can say what really matters: the bore axis must be perpendicular to A within a stated tolerance, and the four bolt holes must be positioned relative to A and B, and to C where clocking matters.

A tempting alternative is to use the outside edges of the flange as datums, because they are easy to measure with a height gauge. That would make the drawing describe a part located by surfaces that touch nothing in the assembly. Inspection would be easier, but the drawing would no longer guarantee function. A part could pass with the bore badly placed relative to the bolt holes.

```figure
type: compare
title: Functional datums versus convenient edge datums for the housing
cols: Functional: face A, bore B, hole C | Convenient: flange edges
best: 1
caption: Manufacturing may use any set-up, provided it shows the finished part meets the requirements relative to the functional datums.
- Reflects the assembly | Yes, the same contacts as on the machine frame | No, the edges touch nothing
- Bore located to bolt holes | Guaranteed by the position tolerance | Not guaranteed; a part can pass with the bore misplaced
- Ease of inspection | Needs a fixture or CMM set-up | Easy with a height gauge
- Disputes over results | Unlikely | Likely when parts fail in assembly
```

## Good datum features are also practical

Function comes first, but datum features also need to be usable in manufacturing and inspection:

- **Accessible:** the feature must be reachable by a fixture or probe.
- **Stable:** a large, flat or long feature gives a repeatable datum. A narrow strip or a short bore can rock or tilt, and small errors in the datum become large errors at distant features.
- **Machined early:** in production, the datum features are often machined in the first operation and used to locate the part for later operations. A datum scheme that matches the machining sequence reduces errors from re-fixturing.
- **Well defined:** a datum feature should be identifiable without argument. Where a large face is uneven or partly cast, **datum targets** can specify the exact points, lines or small areas that establish the datum.

When function and practicality conflict, the drawing should still reflect function. Manufacturing can use any convenient set-up it likes, provided it can show that the finished part meets the requirements relative to the functional datums.

## Reading a datum reference frame on the drawing

On a drawing, the reference frame appears in two places: datum feature symbols attached to features, each with a letter, and feature control frames listing datums in order of precedence. A position tolerance on the bolt holes written with datums A, B and C means: establish datum A from the mounting face, then datum B from the bore perpendicular to A, then datum C from the selected hole to fix rotation; then evaluate the hole axes against their exact theoretical locations in that frame.

The theoretical locations are given by **basic dimensions**, called theoretically exact dimensions in ISO terminology. They are shown in a rectangular frame and carry no tolerance of their own. The tolerance lives in the geometric tolerance instead. This is a crucial change from coordinate tolerancing, examined in the next chapter.

## Datum features of size

When a datum feature has size, like the Ø42 bore, a further question arises: does the datum come from the actual size of the feature, or from a fixed boundary? With a simulator that expands to fill the bore, such as an expanding mandrel, the datum axis is essentially the axis of the largest cylinder that fits inside the actual bore. That is the ASME default for a datum feature of size referenced without a modifier. ISO 5459 defines its own default association rules, which give a very similar result for a well-formed bore; where the bore has significant form error, check the standard your drawing invokes.

A material condition modifier on the datum reference, discussed in Chapter 6, changes this. The simulator becomes a fixed-size pin, and if the actual bore is larger than that pin the part can shift on it. That shift can be useful, because it reflects assemblies where the mating part has clearance, but it also changes how much movement the frame allows. The designer must decide which behaviour reflects the real assembly.

## A note on secondary datums and perpendicularity

Datum B in the Northgate frame is the bore axis, established **perpendicular to datum A**. If the actual bore is slightly tilted relative to the mounting face, datum B is still perpendicular to A by definition, so the tilt appears as an error in the bore itself, not as a tilted reference. That is why the bore needs its own perpendicularity tolerance to A. Without it, the housing could pass every positional check and still hold the roller out of square, the functional failure the assembly most needs to avoid.

## The failure case: two inspectors, two answers

This is an illustration. On the first issue of the housing drawing, the bore and the four clearance holes were all dimensioned from two edges of the flange, each with ±0.1 mm. The supplier machined the flange outline in one set-up and the bore and holes in another. Its inspector set the housing on a surface plate, measured every feature from the two edges with a height gauge, and passed the batch.

Northgate's receiving inspection measured the same housings differently. Its inspector located them on the mounting face and the bore, the way they sit on the machine, and found some bolt holes about 0.25 mm from where they belonged relative to the bore. Both inspectors had followed the drawing. The drawing allowed both readings.

The arithmetic shows why. Each hole was allowed ±0.1 mm in each direction from the edges, and so was the bore. Relative to each other, a hole and the bore could therefore differ by up to 0.2 mm in each direction. That is a radial error of √(0.2² + 0.2²) ≈ 0.28 mm, or a diametral position error of about 0.57 mm. Chapter 6 shows that, with M8 screws in Ø9.0 clearance holes and tapped holes in the frame, the housing holes can afford a position error of only about Ø0.5 mm at their smallest size. A housing that passed every edge dimension could therefore fail to accept its screws. Before the drawing was changed, three housings in the first batch needed their holes opened up by hand at assembly.

### How it is detected

Ask which features touch the mating part, and in what order. The flange edges touch nothing, yet every location on the drawing was measured from them. Working out the relationship that function needs, here hole to bore, shows how much error the edge dimensions allow between the features that matter.

### How it is corrected

Northgate adopted the A, B, C frame in this chapter. The bore and holes are now located by basic dimensions relative to the mounting face and the bore axis, with their tolerances in geometric tolerance frames. The supplier can still set up on the flange edges if that suits its machines. It must show that the finished housing meets the requirements relative to A, B and C.

## Common mistakes

- **Edge datums by habit.** Choosing datums for convenience rather than function produces drawings that are easy to check but do not guarantee assembly.
- **Unclear precedence.** A drawing that labels features A, B and C but references them inconsistently in different frames invites different measurements.
- **Small or unstable datum features.** A short datum bore magnifies its own errors at features far from it.
- **Missing orientation control on secondary datums.** The datum frame assumes perpendicularity; the part must be required to have it.
- **Over-constraining.** Referencing a third datum where rotation does not matter adds inspection effort and can reject good parts.

## Questions to ask

- How is this part located in its assembly, and in what order do the contacts occur?
- Do the chosen datum features reflect those contacts?
- Are the datum features large, stable and accessible enough to give repeatable measurements?
- Does each geometric tolerance reference only the datums its function needs?
- Do the datum features of size need modifiers to match the clearance in the real assembly?

## Exercise: a datum scheme for the shaft

Build a datum scheme for the Northgate shaft. It turns in two bearings, its inner rings bear axially against a shoulder, and a roller is mounted on its threaded end. The shaft was turned between centres. Which features should be the datum features, in what order, and should the centre holes be datums?

**Worked answer.** The shaft is located in the assembly by its two bearing seats. Together they decide the axis it actually turns about, so the primary datum should be the **common axis of the two bearing seats**, usually written A–B. Using one seat alone would make the shaft's alignment depend on a short feature, and errors at that seat would be magnified at the far end of the shaft. Axially, the shaft is located by the **shoulder** that the inner ring bears against. That face is the natural datum for axial dimensions, such as the distance to the roller seat. Rotation about the axis does not matter to function, so no third datum is needed.

The centre holes are where the shaft was held during turning. They are a manufacturing datum, not a functional one, and they touch nothing in the assembly. The workshop can still check the shaft between centres if it shows that the result agrees with the common axis of the bearing seats. Chapter 5 uses this A–B axis for the run-out tolerances on the shaft.

**Try it on your own part.** Choose a part that bolts or clamps to something else. Sketch how it sits in the assembly and number the contacts in the order they happen. Assign datums A, B and C accordingly, then compare with the dimensions on its current drawing. Note any feature that is dimensioned from a surface that touches nothing in the assembly.

With a reference frame in place, the next chapter introduces the geometric tolerances that control form, orientation and location relative to it.
