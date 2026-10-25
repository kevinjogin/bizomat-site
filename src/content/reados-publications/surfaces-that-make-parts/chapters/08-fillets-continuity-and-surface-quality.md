---
book: surfaces-that-make-parts
chapterSlug: fillets-continuity-and-surface-quality
order: 8
title: "Fillets, continuity and surface quality checks"
description: "Round surface edges, list every join with its continuity and curvature jump, and use zebra stripes, curvature and deviation analysis to prove the skin is as smooth as intended."
draft: false
---

A surface model can be closed, valid and the right size and still be poor. Its joins may crease where they should flow, a patch may sit as a flat facet in a curved face, or a blend may leave a surface in the wrong direction along part of its edge. None of these shows in a shaded view at normal zoom, and none stops the part from thickening. They show later, as a visible flat spot on a cover, a ridge in a seal face, or a line in the moulded part where the polished cavity reflects the crease.

This chapter covers the last shaping operation, filleting surface edges, and then the checks that prove the skin is as smooth as intended. The checks are not decoration. Each answers a specific question about a specific join, and the answers are recorded with the model.

## Fillets on surfaces

Surface fillets work much as solid fillets do, with a few differences:

- **The faces must be joined.** A fillet between two faces of one knitted body rolls a ball along their shared edge, as it would on a solid. Two separate surfaces can usually be filleted only with a face fillet, where you choose which side of each surface the fillet sits on. On the duct, the 5 mm outlet lip was added as a fillet after the transition and flange face were knitted.
- **Direction matters.** A solid knows its inside; a surface does not. A face fillet between two separate sheets can sit on either side, and the software may ask you to choose or may flip it unexpectedly when an upstream surface changes. Check the direction after every rebuild.
- **Options may be narrower.** Some fillet options available on solids, such as certain variable-radius or feature-keeping settings, may be limited or absent on surface bodies, depending on the software and release. If an option is greyed out, check the help rather than assume a fault.

Most modellers offer more than one fillet profile. A circular fillet meets its neighbours tangentially but with a jump in curvature, the G1 join of Chapter 2. A curvature-continuous fillet, sometimes offered as a conic or "curvature continuous" profile, starts and ends with the curvature of its neighbours, giving a G2 join. It needs more room: for the same nominal size it bulges further at the middle. Inside a duct, a circular fillet is adequate. On a visible styled surface, the curvature-continuous profile is usually worth the extra space.

A fillet also moves edges that other features may depend on. The 5 mm outlet lip rolls from the duct wall onto the flange face, so on the face itself the flat region now starts 5 mm further out. The opening seen on the flange face grows from 180 by 60 mm to 190 by 70 mm, and its corner radii grow from 15 to 20 mm. Its area there is 190 × 70 − (4 − π) × 20² = 13,300 − 343.4 = **12,956.6 mm²**, and the flat area of the flange face falls from 14,693.1 to 25,300 − 12,956.6 = **12,343.4 mm²**. The flow area of the duct itself, measured just inside the lip, is unchanged at 10,606.9 mm². The outlet gasket must be sized to the flat face, not to the duct's section, so the gasket drawing takes its inner outline from the edge where the lip meets the face. After any fillet, ask which later features referred to the edges it replaced.

## List every join

The first quality check is a list, made before any analysis display. For each join between faces, it records what continuity was intended and what curvature change happens across it. On the duct, the main joins are:

```figure
type: compare
title: Joins on the duct's flow surface
cols: Intended continuity | Curvature either side (per mm) | Jump
caption: This is an illustration. All the duct's designed joins are G1; the jumps are where the zebra stripes will bend.
- Bell-mouth arc to round section, along x | G1 | 0.1 and 0 | 0.1
- Round section to transition, top, along x | G1 | 0 and 0.009 | 0.009
- Outlet straight side to R15 corner, around section | G1 | 0 and 0.067 | 0.067
- *Outlet lip round to flange face | G1 | 0.2 and 0 | 0.2
- Pad skirt to side wall and to pad seat | G1 | measure | measure
```

The curvature of an arc is 1 ÷ R: 0.1 per mm for the 10 mm bell-mouth, 0.067 for the 15 mm corners, 0.2 for the 5 mm lip. The 0.009 per mm at the start of the transition is the top guide's end curvature from Chapter 2. Each of these joins is tangent, so the surface has no crease, but the curvature changes suddenly.

The list does two jobs. It tells the reviewer what to expect from the analysis displays, so that a bend in the zebra stripes at the outlet corners is recognised as designed rather than reported as a fault. And it singles out the joins whose behaviour was not designed directly, like the pad skirt, which need measuring.

## Zebra stripes

A zebra-stripe display reflects a pattern of parallel stripes in the surface, as if the part were standing in a room with striped walls. The stripes follow the surface's normal direction, so they reveal continuity at a glance:

- at a **G0** join, where the faces meet at an angle, the stripes break and jump sideways;
- at a **G1** join, the stripes meet but turn a sharp corner;
- at a **G2** join, the stripes run across the join with no visible change of direction.

```figure
type: svg
title: Zebra stripes across three kinds of join
alt: Three panels, each with three stripes crossing a vertical join line. In the G0 panel the stripes jump sideways at the join. In the G1 panel they meet but bend sharply. In the G2 panel they continue in smooth curves.
caption: Stripes that jump mean a crease; stripes that kink mean a curvature jump; stripes that flow mean matched curvature.
viewbox: 0 0 640 260
body:
<path class="lf dsh" d="M110 30V210"/>
<path class="lf dsh" d="M320 30V210"/>
<path class="lf dsh" d="M530 30V210"/>
<path class="li" d="M30 70H110"/>
<path class="li" d="M110 90H190"/>
<path class="li" d="M30 120H110"/>
<path class="li" d="M110 140H190"/>
<path class="li" d="M30 170H110"/>
<path class="li" d="M110 190H190"/>
<path class="li" d="M240 70H320L400 50"/>
<path class="li" d="M240 120H320L400 100"/>
<path class="li" d="M240 170H320L400 150"/>
<path class="la" d="M450 70H500C520 70 540 64 610 50"/>
<path class="la" d="M450 120H500C520 120 540 114 610 100"/>
<path class="la" d="M450 170H500C520 170 540 164 610 150"/>
<text class="txb" x="60" y="240">G0: stripes jump</text>
<text class="txb" x="262" y="240">G1: stripes kink</text>
<text class="txb" x="470" y="240">G2: stripes flow</text>
```

Zebra stripes are the fastest way to find the planar patch from Chapter 5: its edge showed as a small sideways jump in otherwise continuous stripes, a G0 crease that no measurement of position would have flagged. They are also the fastest way to see a twisted loft: stripes that should run along the duct snake from side to side.

Rotate the model while looking at the stripes, and change their direction and spacing. A defect that is invisible with the stripes running one way can be obvious with them running the other.

## Curvature displays and combs

Chapter 6 used the curvature map to find radii too tight for the offset. The same display shows continuity: a G1 join appears as a sudden change of colour along an edge, and a G2 join as a smooth colour gradient. Curvature combs on section curves are the quantitative version. Cut a section across a join, display the comb, and the length of the comb's teeth jumps at a G1 join and changes smoothly at a G2 join.

On the duct, a section across the outlet corner showed teeth of zero length along the straight side and a sudden step to 0.067 per mm on the corner arc, as the list predicted. A section along the top showed the comb rising smoothly from zero at x = 40 to its peak and falling back, except for a small step at x = 40 itself: the 0.009 per mm jump where the guide meets the round section.

## Deviation analysis along an edge

Displays show patterns; deviation analysis gives numbers. Most modellers can measure, along a chosen edge, the gap in position between the two faces and the angle between their normals. For a G1 join, the position deviation should be essentially zero and the angle deviation very small. For a G2 join, some systems also report curvature deviation.

The case set its own acceptance values for tangent joins on the flow surface. This is an illustration, not a standard: position deviation no more than 0.01 mm, angle deviation no more than 0.5°. Visible styled surfaces might need tighter limits; a hidden inside face could accept looser ones. What matters is that a limit exists, and that it is written down before the check runs.

## The skirt that was only half tangent

This is an illustration of the failure. The zebra stripes around the pad skirt ran smoothly along the top and front of the skirt but kinked along its lower rear edge. The skirt had been built with its start tangent to the side wall, so a kink should not have been possible.

A deviation analysis along the skirt's outer edge settled it. For most of the edge, the angle deviation was a few hundredths of a degree. Along about 15 mm of the lower rear edge it rose to about **4°**, far over the 0.5° limit.

The cause lay in the loft from Chapter 4. The transition is made of eight lengthwise faces, and the trimmed hole for the skirt crossed the edge between the side face and the lower corner face. When the skirt was built, the designer had picked only the side face as the tangency reference. Along the part of the boundary that lay on the corner face, the software matched the skirt to the side face's direction, not to the face it actually met.

The correction was to give the skirt's start condition both faces as references, or, in software that needs a single face, to knit the side and corner faces first and use the knitted face. The deviation along the whole edge then fell below the limit, and the stripes ran without a kink. The lesson is general: a tangency condition is only as good as the face it refers to, and a boundary that crosses a face edge needs both faces.

## The outside inherits the inside

The duct's outside skin will not be modelled directly. It is created by thickening the flow surface outward by 2.5 mm, which offsets every face. That has a useful consequence for quality: an offset keeps the continuity of the surface it came from.

Where two faces of the flow surface meet tangentially, their offsets meet tangentially too, because both move the same distance along the same normal at the shared edge. Where the curvature matches across a join, the offset curvatures match as well. The radius of each region changes by the offset distance, so the size of a curvature jump changes, but its kind does not. The 15 mm outlet corners become 17.5 mm outside, and the jump across their edges falls from 0.067 to 1 ÷ 17.5 = 0.057 per mm. The join stays G1.

So the quality review of the flow surface is also a review of the outside, with one exception: features added after the thicken, such as ribs, bosses and the joint tongue, have their own joins and need their own checks. A crease in the flow surface, on the other hand, appears on both skins, which is one more reason to find it before the thicken rather than after.

## Gloss, texture and what the eye sees

How much continuity a moulded surface needs depends partly on its finish. A high-gloss surface, moulded from a polished cavity, reflects its surroundings, and every G1 join shows as a line in the reflection. A textured surface, moulded from a cavity that has been etched or blasted, scatters light, and small curvature jumps disappear into the texture.

The duct's outside will be lightly textured and is mostly hidden inside the enclosure, so G1 joins are acceptable there. The inside is never seen. For a visible product cover, the decision would be different: the designer would agree the finish with the industrial designer and toolmaker first, then choose G2 for every join that crosses a visible glossy face. The zebra display is useful for that conversation, because a toolmaker or industrial designer can see the stripes and agree what is acceptable without reading curvature values.

## What the checks do not prove

Smooth surfaces are not automatically good surfaces. The checks in this chapter show that the geometry is continuous, consistently built and free of hidden facets. They say nothing about whether the duct flows well, whether the moulding will fill, or whether the flange is stiff enough to seal. Those questions need different tools: a flow analysis of the fluid volume from Chapter 7, a mould-filling simulation from the moulder, a stiffness check of the flange, and a prototype test. Surface quality is a necessary condition for those later steps, not a substitute for them.

## A quality review routine

```figure
type: checklist
title: Surface quality review before thickening
caption: This is an illustration of the case's routine. Each check is recorded with the model revision.
- List every join with its intended continuity and curvature jump
- Zebra stripes in two directions; every kink and jump matches the list
- Curvature map; smallest wall-side radius recorded against the wall thickness
- Combs on sections across every join that is not on the list
- Deviation along every designed tangent edge: under 0.01 mm and 0.5°
- Geometry check: three open loops, no invalid or tiny faces
- ? Any joins that need G2 because they will be visible or polished
```

The routine takes about half an hour on a part like the duct. It is cheaper than one round of corrections after a toolmaker has started work, and it gives the toolmaker evidence about the surface they are about to cut.

## Exercise: should the bell-mouth be G2?

The marketing team wants a photograph of the duct's open inlet, and asks whether the bell-mouth could look smoother. Using the join list, describe what the zebra stripes will show where the bell-mouth meets the round section, and what changing to a curvature-continuous lip would involve.

**Worked answer.** The bell-mouth is a 10 mm arc meeting a straight cylinder line, a G1 join with a curvature jump of 1 ÷ 10 = **0.1 per mm** along the duct. Zebra stripes will meet at the join without breaking but will turn a sharp corner there, and on a glossy moulding that corner can show as a visible line in reflections.

A G2 lip replaces the arc with a curve whose curvature starts at zero where it meets the cylinder and builds up gradually, such as a conic or a curvature-continuous spline. To turn the same 90° within the same space, its curvature must peak higher than 0.1 per mm somewhere in the middle, so the tightest radius on the lip falls below 10 mm. That radius moves towards the wall side when the duct is thickened. If it fell below the 2.5 mm wall, the thicken would fail. In practice, the designer would enlarge the lip slightly so its tightest radius stays comfortably above 2.5 mm, and then repeat the Pappus area check, the curvature check and the offset check for the new profile.
