---
book: surfaces-that-make-parts
chapterSlug: knitting-surfaces-into-watertight-bodies
order: 7
title: "Knitting surfaces into watertight bodies"
description: "Join surfaces into one body, predict how many open edge loops it should have, find gaps the screen hides, and close a body to measure the volume it encloses."
draft: false
---

Up to this point, the duct exists as a collection of separate surfaces: a revolved inlet, a lofted transition, a flange face, a pad and its skirt, each built to meet its neighbours. Meeting is not the same as being joined. Until the surfaces are knitted into one body, the software treats them as independent sheets that happen to touch, and no operation that needs a continuous skin, such as a thicken, a fillet across a join or a closed volume, will work.

Knitting is also the moment when every small error in the earlier chapters comes to light. A guide that missed a section by 0.2 mm, a patch drawn from a sketch instead of an edge, a trim that left a sliver: each shows up as an edge that will not join. This chapter shows how to predict what a correct knit should produce, so that a wrong one is obvious, and how to fix a gap at its source rather than hiding it.

## What a knit does

A knit, called sew, stitch or merge in other systems, joins surfaces along edges that coincide within a tolerance. The result is one surface body whose faces share edges. Where all the edges of a set of surfaces are shared, the body is closed and encloses a volume. Most modellers can then turn it into a solid in the same step, or in a separate one.

The tolerance matters. Some systems apply a fixed internal tolerance; others let you set a gap tolerance in the knit command, and sometimes offer to close gaps up to that size by adjusting the edges. A generous tolerance will join edges that do not really meet, which can feel like a solution. It is not, for reasons explained below.

A knit can also include faces of a solid body. That is how a surface patch is joined to a solid to repair it, or how a surface is used to replace part of a solid's skin. On the duct, all the faces are surfaces, so the knit makes a single surface body that will be thickened in Chapter 9.

## Decide what belongs in the body

Before knitting, list the surfaces that make up the product and the surfaces that do not. Surface models accumulate helpers: trim tools, check caps, offsets for mating parts, clearance sheets. Knitting one of those in by mistake changes the part.

```figure
type: checklist
title: What goes into the duct's knitted body
caption: This is an illustration. Helpers stay as separate bodies, hidden and named, so that later checks can still use them.
- Bell-mouth and round section (revolved)
- Transition loft, eight faces, with the old top port untrimmed
- Outlet lip round, 5 mm
- Flange face
- Side wall trimmed for the pad skirt
- Pad skirt and pad seat with the 12 mm port hole
- x Check caps at inlet and outlet: keep out
- x Port trim cylinder, clearance sheet, 3 mm bracket offset: keep out
```

Count the surface bodies before and after. In the case, the designer had nine product surfaces and five helpers before the knit: fourteen bodies. After knitting the nine product surfaces, there should be one product body and five helpers: six bodies. Any other count means something was missed or something extra was caught.

## Predict the open edges

A knitted body that is not closed has open edges, sometimes called free or boundary edges: edges that belong to only one face. Most modellers can highlight them or list them in a geometry check. The useful habit is to predict them before looking.

The duct is a tube with a flange. Its knitted flow surface should have exactly three loops of open edges:

1. the outer lip of the bell-mouth, a circle of 70 mm radius on the inlet plane;
2. the outer boundary of the flange, the 230 by 110 mm rectangle;
3. the 12 mm port hole through the pad seat.

Every other edge in the body should be shared by two faces. If the check shows three loops in those places, the knit is sound. If it shows four, there is a gap somewhere, and its location is where the extra loop runs.

```figure
type: stats
title: Open edge loops on the knitted duct
caption: This is an illustration. The fourth loop on the first knit ran around the pad skirt; it marked a 0.03 mm gap.
- 3 | Expected loops | inlet lip, flange outline, port hole
- *4 | Found on first knit | one extra loop round the pad skirt
- 0.03 mm | Measured gap | between skirt and trimmed wall
- 3 | Found after correction | matches the prediction
```

## The gap around the pad

This is an illustration of the failure. On the first knit, the open-edge check showed four loops. The extra one ran all the way round the pad skirt, where the skirt should have met the trimmed side wall. On screen, the two surfaces looked continuous. The skirt was part of the knitted body on one side, the wall on the other, with a line of open edges between them.

A minimum-distance measurement between the skirt's outer edge and the wall's trimmed edge gave about **0.03 mm** at the worst point. The cause was a second definition of the same boundary. When building the skirt in Chapter 5, the designer had started the loft from a fresh 56 by 46 mm sketch on the pad's plane, projected along the pad normal, rather than from the edge the trim had actually left in the wall. The projection and the trim had both used the same rectangle, but the projected curve was a separate approximation of the curve on a curved wall, and the two differed by a few hundredths of a millimetre. Each was correct to its own tolerance; together they did not meet.

Two corrections were possible.

- **Raise the knit tolerance to 0.05 mm.** The knit would succeed and the check would show three loops. The gap would still be there, hidden inside the body.
- **Rebuild the skirt from the trimmed edge.** Change the loft's start section to the wall's actual edge. The skirt and wall then share one boundary by construction, and the knit joins them within the normal tolerance.

The designer chose the second. The first would have caused trouble downstream. A thicken offsets each face separately and then joins the offsets; a hidden gap can reopen as a slot in the wall or stop the thicken altogether. A neutral export such as STEP carries the faces, not the history of the knit, so a receiving system with a tighter tolerance sees the gap as an open edge. A toolmaker's CAM software, cutting the mould cavity, may treat the gap as a real feature. A gap closed by tolerance is a gap postponed.

```figure
type: decision
title: An edge will not knit. What now?
question: Do the two surfaces share a single definition of the boundary?
caption: Fixing the definition removes the gap. Raising the tolerance only hides it from this one operation.
- No | Rebuild one surface from the other's edge | Use the edge, or trim both with one tool, so the boundary is defined once.
- Yes, but they overlap | Trim them to each other | A mutual trim creates their shared edge exactly.
- *Yes, and the gap is from imported data | Repair locally | Delete the bad face, fill with a tangent patch, knit, then record the repair.
```

## Why a few hundredths of a millimetre matter

A 0.03 mm gap on a part 240 mm long is about one part in eight thousand. No moulding will hold that tolerance, and no inspector will find it on the part. So why not let the tolerance absorb it?

Because the model is not only a picture of the part. It is the input to several other programs, each of which interprets edges by its own rules. The thicken in this modeller treats the edge as joined if the knit says so. A finite element mesher may place nodes along both edges separately and leave the mesh disconnected, so a load path that looks continuous in the model is broken in the analysis. A mould designer's software may build its parting surfaces from open edges and find one where none should be. A CAM system cutting the cavity steel may follow the gap with a tool path. Each of those failures is cheap to prevent in the surface model and expensive to diagnose afterwards, often by someone in another company who did not build the model.

The working rule on the case is that the knit tolerance stays at the software's default, and any edge that will not join at that tolerance is fixed at its source. The only exception is imported geometry that cannot be rebuilt, where a local repair is made and recorded in the model notes so the next person knows it is there.

## Use a geometry check, not your eyes

A gap of 0.03 mm is invisible on screen at any normal zoom. So is a sliver face 0.01 mm wide left by a trim, or a face whose edges are slightly out of tolerance with each other. These problems are found by the software's geometry check, which typically reports open edges, invalid faces, short edges, minimum radii and self-intersections.

Run it at three points: after the knit, after any change to an upstream surface, and before thickening. Compare the open-edge count with the prediction each time. On the duct the routine is quick, because the prediction is simple: three loops, in known places. A more complex part might have a dozen loops, which is a reason to write the prediction down before running the check rather than rationalising the result afterwards.

## Close the body to measure the passage

A closed set of surfaces encloses a volume, and a closed volume can be measured exactly. The duct's flow passage is not closed, because air has to go through it. But closing it temporarily gives the fluid volume for a flow analysis and an independent check of all the surfaces at once.

The designer copied the knitted flow surface, kept the original untouched, and closed the copy:

1. Add the two check caps from Chapter 5, at the inlet lip and the outlet edge.
2. Add a small planar cap over the 12 mm port hole.
3. Knit the flow surface copy and the three caps. The open-edge check must now report **zero** loops.
4. Make a solid from the enclosed volume. This solid is the air inside the duct, not the duct.
5. Measure its volume and compare with the estimate.

The estimate comes from earlier chapters. The bell-mouth region, from the inlet plane to x = 10, holds about **121,489 mm³**, from integrating π × r² along the 10 mm arc. The round section holds π × 60² × 30 = **339,292 mm³**. The transition, by the prismoidal formula in Chapter 4, holds **2,308,970 mm³**. The total is **2,769,751 mm³**, about 2.77 litres.

```figure
type: stack
title: Where the duct's 2.77 litres of air sits
unit: mm³
caption: This is an illustration. The CAD volume of the closed fluid body should agree with this estimate to within a percent or two; a larger difference means a surface is not where the skeleton puts it.
- Bell-mouth, x 0 to 10 | 121489
- Round section, x 10 to 40 | 339292
- Transition, x 40 to 240 | 2308970
```

The estimate ignores the pad, which bulges the side wall outwards by about 3 mm over a 40 by 30 mm area, adding of the order of 3,600 mm³, and the 5 mm lip round at the outlet, which removes a little. Both are well under 1% of the total. If the CAD volume differs by more than about 2%, something is wrong. A transition loft that lost its control section, for example, would hold about 60,600 mm³ more.

## Knitting into a solid: repairing imported geometry

Knits are not only for building new surfaces. They are also the standard repair for solids that arrive damaged from another system. Later in the project, the moulder sent back the duct as a STEP file with their proposed gate and ejector positions marked, and the file opened as a surface body rather than a solid: one face of the flange, re-exported by their software, had lost its inner loop.

The repair took four steps. Delete the damaged face, leaving a hole in the body. Rebuild it as a planar surface from the surrounding edges, so that it shares those edges exactly. Knit the new face to the rest with the option to create a solid. Then run the geometry check: zero open edges, one solid body. The repaired model's volume matched the designer's own thickened duct to the displayed precision, which confirmed that nothing else had been lost.

The same approach handles most imported damage: remove what is wrong, rebuild it from the edges that remain, knit, and check that the body closes. Record what was repaired in the model notes, because the next export from the same source may need the same fix.

## Keep the knitted body editable

A knit sits in the feature tree after all the surfaces it joins. When an upstream surface changes, the knit usually updates, provided the surfaces still meet. When a surface is replaced, say the transition rebuilt as a boundary surface, the knit may lose its reference and fail. Keep the knit late in the tree, immediately before the operations that need it, and avoid hanging detail features off individual surfaces after they have been knitted. Edit the source surface, not the knitted result.

## Exercise: the volume without the control section

The control section added in Chapter 4 reduced the mid-length area from 12,292.9 to 11,838.1 mm². Using the prismoidal formula, find the transition volume without the control section and the total fluid volume. By what percentage would the closed-body check differ from the corrected estimate, and would it be noticed?

**Worked answer.** Without the control section, V = 200 ÷ 6 × (11,309.7 + 4 × 12,292.9 + 10,606.9) = 33.333 × 71,088.2 = **2,369,607 mm³**. Adding the bell-mouth and round section gives 121,489 + 339,292 + 2,369,607 = **2,830,388 mm³**, about 2.83 litres.

That is 60,637 mm³, or about **2.2%**, more than the corrected estimate of 2,769,751 mm³. It is just over the 2% threshold, so a designer comparing the closed body with the corrected estimate would notice it and look for the cause. The closed-body volume is a coarse check, but it catches a missing section, a misplaced guide or a lost patch, because each of those changes the volume by more than the small features do.
