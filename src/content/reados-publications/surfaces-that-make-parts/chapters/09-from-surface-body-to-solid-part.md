---
book: surfaces-that-make-parts
chapterSlug: from-surface-body-to-solid-part
order: 9
title: "From surface body to solid part"
description: "Thicken a knitted surface into a moulded wall, check the direction, mass and clearances, and use surfaces to close volumes, cut mating parts, replace faces and build mid-surfaces."
draft: false
---

The surfaces are built, trimmed, knitted and checked. The duct still has no material. This chapter gives it some: a 2.5 mm polypropylene wall, added to the outside of the flow surface. It also shows the other ways a surface becomes part of a solid model: closing a volume, cutting a solid, replacing a face, deleting and patching faces, and extracting a mid-surface for analysis.

Each operation is followed by a check that compares the result with a number calculated independently. The most important of these is the mass. A mass estimate made from the surface areas catches the commonest thickening mistake in seconds, and the case shows how.

## Thicken a surface body

A thicken offsets a surface body by a chosen distance and closes the gap between the original and the offset with side faces along the open edges. The result is a solid. The options are usually:

- **side 1** or **side 2**, which add the full thickness on one side of the surface;
- **both sides**, which adds the chosen thickness on each side, or in some systems splits it between them;
- for a closed surface body, an option to **fill the enclosed volume** instead of making a wall.

The surface must be a single knitted body. If it is several separate surfaces, each thickens on its own and the walls overlap or leave gaps at the joins. The thicken will fail wherever the offset fails, which is why Chapter 6 checked every wall-side radius against the 2.5 mm thickness first.

For the duct, the flow surface carries the requirement, so the wall goes outwards: side 1 or side 2, whichever the arrow shows pointing away from the passage. The software's preview arrow is the only reliable guide. "Side 1" means different things on different surfaces, depending on how each was built.

## Which way the wall goes changes the part

The direction is not a detail. It decides which dimensions are kept and which change.

```figure
type: compare
title: Three ways to add a 2.5 mm wall to the flow surface
cols: Inlet inside diameter | Inlet flow area | Outside at inlet | Wall
caption: This is an illustration. Only the outward thicken keeps the flow area the airflow calculation assumed.
- *Outward | 120 mm | 11,309.7 mm² | Ø125 mm | 2.5 mm
- Inward | 115 mm | 10,386.9 mm², 8.2% less | Ø120 mm | 2.5 mm
- Both sides, 2.5 mm each | 115 mm | 10,386.9 mm², 8.2% less | Ø125 mm | 5.0 mm
```

An inward thicken keeps the outside where the flow surface was and moves the passage in. The inlet becomes 115 mm inside diameter with an area of π × 115² ÷ 4 = **10,386.9 mm²**, 8.2% less than intended, and the mean inlet velocity at 0.12 m³/s rises from 10.61 to **11.55 m/s**. The outlet shrinks in the same way. None of this produces an error message.

The outward thicken keeps the flow surface exactly and moves the outside out. The outside of the round section becomes 125 mm, the outlet outside 185 by 65 mm, and the bottom of the transition 62.5 mm below the axis, leaving the 7.5 mm clearance to the frame rail that Chapter 3 checked with the clearance sheet.

## The wall that came out twice as thick

This is an illustration of the failure. The designer's first thicken used the "both sides" option, picked by habit from a sheet-metal job. The preview looked plausible, and the solid built without error.

The mass check found it. Before thickening, the designer had estimated the mass from the surface areas, as described below: about 256 g. The CAD mass properties reported about twice that. A wall twice as thick, or a body counted twice, are the usual causes of a mass error of exactly two. A section through the round part showed the wall running from 57.5 to 62.5 mm radius: 5 mm thick, centred on the flow surface, with the passage reduced to 115 mm diameter.

The correction was to change the thicken to one side, outward, and repeat the checks: inside diameter 120 mm, outside 125 mm, mass back near the estimate. An interference check between the duct and the fluid-volume solid from Chapter 7 then reported that the two bodies touched along the whole flow surface but did not overlap, which confirmed that no material had gone into the passage anywhere.

## Estimate the mass before you thicken

For a thin wall of uniform thickness t, the volume of material is close to the surface area multiplied by t, and the mass is that volume multiplied by the density. The areas come from earlier chapters:

```figure
type: stack
title: Flow-surface area of the duct
unit: mm²
caption: This is an illustration. The total is about 113,900 mm²; the transition is estimated from its section perimeters and ignores the slope of its walls, so the true area is slightly larger.
- Transition, x 40 to 240 | 81636
- Flange face | 14693
- Round section, x 10 to 40 | 11310
- Bell-mouth | 6280
```

The round section's area is π × 120 × 30 = 11,310 mm². The bell-mouth's, by Pappus in Chapter 3, is 6,280 mm². The flange face is 14,693 mm² from Chapter 5. The transition's lateral area can be estimated with the prismoidal formula applied to perimeters instead of areas: with perimeters of 376.99 mm at the inlet, 404.46 mm at the 44 mm control section and 454.25 mm at the outlet, it is 200 ÷ 6 × (376.99 + 4 × 404.46 + 454.25) = **81,636 mm²**. The total is **113,919 mm²**.

Multiplied by 2.5 mm, that gives 284.8 cm³. Polypropylene has a density of about 0.90 g/cm³ (the grade's datasheet governs), so the estimate is about **256 g**.

The estimate is a little low for three reasons. The wall sits outside the flow surface, so its mid-thickness surface is larger: for the round section, by the ratio 61.25 ÷ 60, or about 2%. The perimeter method ignores the slope of the transition's walls, which reaches 24° along the top. And the outlet lip round changes the area near the flange by under 1%. Allowing for these, the designer expected the CAD mass to be roughly **260 to 270 g**. A result in that range confirms the thicken; a result far outside it means the wall, the direction or the body is wrong.

## Check the wall, not just the mass

A correct mass shows that the total amount of material is right. It does not show that the material is in the right places. A moulded part wants a wall that is close to uniform: thick spots cool slowly and sink, thin spots may not fill, and sudden changes between them distort the part as it cools. Most modellers include a thickness analysis that colours the solid by local wall thickness, with limits you set.

On the duct, the designer set the display to flag anything under 2.2 mm or over 2.8 mm. This is an illustration of a case limit, not a moulding rule; the moulder's guidance governs a real part. The analysis showed three things worth recording:

- The wall, the flange plate and the pad seat were all 2.5 mm, because each was thickened from one surface by one operation.
- The corner where the duct wall turns into the flange read slightly over 2.5 mm across the bend, as any bend does when measured diagonally, but well inside the limit, because the 5 mm and 2.5 mm radii from Chapter 6 keep the bend uniform. With a sharp inside corner, that region would have shown as a thick spot.
- The joint tongue and the bracket bosses, added later as solid features, created local thick regions where they met the wall. Those are normal for such features and are the moulder's to review, usually by coring them out or thinning them.

```figure
type: checklist
title: Checks on the thickened duct
caption: This is an illustration. Each result is compared with a number worked out before the thicken.
- One solid body; no stray surface bodies left in the product folder
- Inlet inside diameter 120 mm, outside 125 mm, by section
- Mass within the estimated 260 to 270 g range
- No interference with the fluid volume; contact along the whole flow surface
- Rail clearance 7.5 mm and bracket gap 0.5 mm by minimum-distance measurement
- Thickness analysis: wall 2.5 mm, no flagged regions except designed features
- ? Moulder's review of local thick regions at bosses and tongue
```

## Close a volume instead of thickening

A closed surface body can become a solid by filling the volume it encloses. Chapter 7 used this to make the fluid volume: the flow surface plus three caps, knitted closed and filled. The same operation turns a closed surface model of a solid object, such as a moulded knob or a cast handle built from surfaces, into its solid part.

The body must be fully closed, with zero open edges, and must not intersect itself. If the fill fails, run the geometry check: an open edge or a self-intersecting face is almost always the cause.

## Cut a solid with a surface

A surface can cut a solid, removing material on one side of it. Most modellers have a cut-with-surface command, with a direction arrow that sets which side goes. A related command, a thickened cut, removes a slab of material along a surface.

The duct's support bracket is a steel block whose top must follow the underside of the duct with a 0.5 mm gap. Chapter 6 made a 3.0 mm offset of the flow surface for this: the outside of the wall is at 2.5 mm, so 3.0 mm leaves 0.5 mm clear.

```figure
type: steps
title: Shaping the bracket saddle from the duct
caption: This is an illustration. The saddle stays associated with the flow surface, so a change to the duct updates the bracket.
- Offset | Offset the flow surface outward by 3.0 mm; check the offset has no failed regions.
- Extend | Extend the offset sheet beyond the bracket on every side, so it cuts cleanly.
- Cut | Cut the bracket block with the sheet, removing material above it.
- *Check | Minimum distance from bracket to duct outside: 0.5 mm, with no interference.
```

The cut keeps the bracket associated with the duct's flow surface. If the duct changes, the offset changes, and the bracket's saddle follows it. A bracket modelled by measuring the duct and sketching a matching profile would not.

## Replace a face

A replace-face command swaps one or more faces of a solid for a surface, extending or trimming the solid's neighbouring faces to meet it. It does the same job as a surface cut but works from the face's point of view: the block's flat top is replaced by the offset sheet. Which to use is a matter of preference and robustness in the particular software. Replace-face is often cleaner when the new surface is close to the old face; a cut is clearer when a large amount of material is removed.

## Delete faces, with or without a patch

A delete-face command removes faces from a body. On a solid, removing a face opens it into a surface body unless the software patches the hole, usually with an option to delete and patch, which extends the neighbouring faces to close it.

The compressor maker wanted a variant duct without the pressure switch. On the surface model, the designer suppressed the pad, skirt and port features and untrimmed the side wall, which restored the original loft surface exactly. Where the history was not available, for example on the moulder's STEP file, a delete-and-patch of the pad seat and skirt faces would do the same job approximately, and the result would need the deviation and zebra checks from Chapter 8.

## Mid-surfaces for analysis

Thin-walled parts are often analysed with shell elements, which need a mid-surface and a thickness rather than a solid. A mid-surface tool finds pairs of opposite faces on a solid and builds a surface halfway between them, or at a chosen fraction of the distance. For the duct, the mid-surface lies 1.25 mm outside the flow surface, and the analyst assigns it a thickness of 2.5 mm.

The tool may need help on a moulded part. Where the wall meets the flange, at the pad and around ribs, faces do not pair up neatly, and the mid-surfaces may leave gaps that must be extended and trimmed, the operations of Chapter 6. Because the duct was built from a single flow surface, an alternative is simpler: offset that surface by 1.25 mm. It gives a clean mid-surface directly, without face pairing, and stays associated with the design.

## Keep the surfaces upstream of the solid

Once the duct is a solid, the remaining work is ordinary solid modelling: the joint tongue and groove, screw bosses, the bracket's mounting holes, ribs under the flange. These features belong after the thicken in the feature tree and should reference the solid's faces or the skeleton, not the individual surfaces underneath.

The surfaces stay in the model, hidden, and remain the place where the shape is changed. If the outlet must be 5 mm taller, the change goes into the skeleton and the section sketch; the loft, patches, knit, offset and thicken update in turn, and the solid features follow. Editing the shape by pushing faces of the solid instead, with a direct-edit or move-face command, would leave the flow surface and the solid disagreeing, and the next rebuild from the skeleton would quietly undo the edit.

Two habits keep this clean. Keep a folder or naming convention that separates product surfaces, helper surfaces and check bodies, so that anyone opening the model can see which body is the part. And after every upstream change, rerun the short list of checks above in order, mass first, because it is the quickest and catches the largest errors.

## Exercise: the moulder's 3 mm wall

The moulder asks again for a 3 mm wall, thickened outward. Using the area estimate, calculate the new mass, the outside diameter of the round section, and the clearance to the frame rail.

**Worked answer.** The mass scales with thickness: 113,919 × 3 = 341.8 cm³, times 0.90 g/cm³, is about **308 g**, before the few per cent allowance for the larger mid-surface. The round section's outside becomes 120 + 2 × 3 = **126 mm**. The transition's bottom outside moves to 63 mm below the axis, so the clearance to the rail top at 70 mm falls to **7.0 mm**.

Chapter 6 found that a 3 mm outward offset is still possible, with the 5 mm outlet lip leaving a 2 mm inside radius. So the change can be built. Whether it should be made is a design decision: it adds about 51 g of material per part and reduces the rail clearance by 0.5 mm, in exchange for easier filling. The surface model makes the consequences measurable; it does not make the decision.
