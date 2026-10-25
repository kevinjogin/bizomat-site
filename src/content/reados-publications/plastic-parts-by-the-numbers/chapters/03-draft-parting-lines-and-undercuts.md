---
book: plastic-parts-by-the-numbers
chapterSlug: draft-parting-lines-and-undercuts
order: 3
title: "Draft, parting lines and undercuts"
description: "Choose draft angles from texture and depth, calculate what draft does to dimensions and wall thickness, place the parting line and price each undercut before the tool is cut."
draft: false
---

A moulded part has to come out of the mould. That simple fact shapes almost every surface. Faces that slide against the steel as the mould opens need a taper, called draft. The line where the two halves of the mould meet, the parting line, has to run somewhere sensible on the part. Any feature that would hook behind the steel as the mould opens, an undercut, needs a moving mould component to release it, and each of those adds cost, maintenance and risk.

This chapter applies draft to the cover, calculates its effect on dimensions and wall thickness, places the parting line and chooses how to form the snap hooks' catches, which are the part's only undercuts.

## Why parts need draft

As the part cools in the mould, it shrinks onto the cores that form its internal features. When the mould opens and the ejectors push, the part must slide off those cores against friction, the grip of its own shrinkage and sometimes a partial vacuum. A face parallel to the direction of opening rubs along its whole length during ejection. A tapered face breaks away from the steel as soon as it moves.

Without enough draft, parts stick, ejector pins push dents or white stress marks into the part, textured faces scuff and the cycle slows while the moulder fights the release. The Covestro design guide recommends at least half a degree of draft for most polycarbonate materials and, where the design permits, one degree for easy ejection. It notes that features formed in blind pockets of the mould, such as ribs and bosses, should taper thinner as they extend into the mould.

## Add draft for texture

A textured surface has microscopic peaks and valleys in the mould steel, and the plastic fills them. Without extra draft, the textured face drags across the steel as the part is ejected, scraping the peaks off the plastic. The Covestro guide gives a rule of thumb: use the standard one degree of draft plus one more degree for every 0.001 inch, about 0.025 mm, of texture depth.

The cover's cosmetic outer face has a light texture with a depth of about 0.025 mm, chosen from the texture supplier's range. Its outer skirt faces therefore need about **1 + 1 = 2°** of draft. A deeper texture of 0.05 mm would call for about **1 + 0.05 / 0.025 = 3°**. Texture suppliers usually state the minimum draft for each of their textures, and their figure should take precedence over the rule of thumb for that texture.

```figure
type: compare
title: Draft for each face of the cover
cols: Surface | Draft | Basis
caption: Teaching values based on supplier guidance. The textured outside needs the most draft; ribs need the least.
- Outer skirt faces | Light texture, 0.025 mm deep | 2° | 1° plus 1° per 0.025 mm of texture
- Inner skirt faces | Polished, on the core | 1° | Easy ejection for polycarbonate
- Ribs, each side | Polished, in pockets of the core | 0.5° | Minimum for polycarbonate features
- Boss outside | Polished | 0.5° | Feature formed in a pocket
- *Boss bore | Core pin | 0.5° | Keeps screw engagement consistent along the bore
```

## Calculate what draft does to dimensions

Draft changes a dimension along the drafted face. The offset over a height h at a draft angle θ is **h × tan θ**. For the cover's skirt, the drafted height below the top is 17.5 mm.

- At 2°, the outer face moves inwards by **17.5 × tan 2° ≈ 0.61 mm** from the open edge to the top.
- At 1°, the inner face moves by **17.5 × tan 1° ≈ 0.31 mm** over the same height.

The first result matters for fit. The brief requires 0.5 mm nominal clearance per side between the cover's skirt and the box opening. If the skirt's outside dimension were specified at the top of the skirt, its width at the open edge would be 0.61 mm greater per side, more than consumed the clearance. The drawing must therefore state where each drafted dimension applies. For the cover, the fit with the box happens at the open edge, so the outside dimensions are specified at the parting line, and the skirt narrows towards the top.

```figure
type: formula
title: Effect of draft on the skirt
formula: offset = h × tan θ        wall change = h × (tan θ_outside − tan θ_inside)
caption: Both faces taper in the same direction. Because the outside has more draft than the inside, the wall is thicker at the open edge than at the top.
- h | Drafted height, 17.5 mm for the skirt
- θ | Draft angle on each face
step: Outside offset: 17.5 × tan 2° ≈ 0.61 mm per side
step: Inside offset: 17.5 × tan 1° ≈ 0.31 mm per side
step: Wall at the open edge: 2.5 + 0.31 ≈ 2.81 mm if 2.5 mm at the top
```

## Calculate what draft does to wall thickness

Both skirt faces taper in the same direction, narrowing towards the top, but by different amounts. Because the outside tapers more than the inside, the wall changes thickness along its height by **17.5 × (tan 2° − tan 1°) ≈ 0.31 mm**. If the wall is 2.5 mm where it meets the top, it is about 2.81 mm at the open edge, about 12% thicker.

That is within the roughly 25% variation that the Covestro guide suggests amorphous materials tolerate, so it is acceptable. It would not be acceptable to ignore: with a deeper texture and 3° outside, the change would be about 0.61 mm, or about 24%, at the edge of the guideline. A designer can balance it by giving the inside face more draft too, if the core can tolerate it, or by specifying the nominal wall at mid-height so the variation is split above and below.

The same arithmetic applies to ribs. A rib 1.5 mm thick at its base and 4.5 mm tall, with 0.5° on each side, is about **1.5 − 2 × 4.5 × tan 0.5° ≈ 1.42 mm** thick at its tip. Taller ribs with more draft become thin at the tip and hard to fill, which is one reason Chapter 4 limits rib height.

## Place the parting line

The parting line is where the cavity half and the core half of the mould meet. It leaves a fine witness line on the part and, if the mould is worn or poorly fitted, a thin fin of plastic called flash. It also determines which way each face must be drafted, because draft is always relative to the direction in which that face separates from the steel.

For the cover, the natural parting line runs around the open edge of the skirt. The cavity half forms the whole outer, cosmetic surface, so there is no parting line on the visible faces. The core half forms the entire underside, including the ribs, bosses and hooks. The part shrinks onto the core and is ejected from it, so ejector pins act on the underside, away from the cosmetic face, as the brief requires.

A parting line that is not flat, stepping up and down around a part, makes the mould more expensive to make and fit, and is more prone to flash. The cover's flat skirt edge allows a flat parting line, which is the cheapest and most robust arrangement.

## Identify every undercut

An undercut is any feature that the mould steel would have to pass through as the mould opens. A hole in the side of the skirt, a groove around a boss or the catch on a snap hook all create undercuts if they face sideways. Each one needs a moving component in the mould: a slide that moves sideways as the mould opens, a lifter that moves the steel inwards as the part is ejected, or a collapsible core.

The cover has two undercuts: the catches on its two snap hooks, which hook outwards under a lip on the box. Everything else, including the boss bores and the ribs, lies in the direction of opening and needs no moving steel.

## Choose how to form the hook catches

There are several ways to form a catch, each with a different cost and consequence.

```figure
type: decision
title: Forming the snap hook catches on the cover
question: How should the outward-facing catch on each hook be formed?
- Slide in the mould | Moves sideways as the mould opens | Robust, adds cost and a maintenance item
- *Lifter on the core side | Moves inwards as the part is ejected | Suits small internal catches; moderate cost
- Window through the skirt | Steel from the cavity passes through to form the catch | No moving steel; leaves a visible opening
- Redesign the catch | Engage a hole in the box instead of a lip | May remove the undercut; needs a change to the box
```

This is an illustration. The toolmaker's quotation adds about A$4,500 excluding GST for a pair of lifters, and about A$6,000 for slides. A window through the skirt below each hook would avoid moving steel altogether: the cavity steel reaches through the window to form the catch face. But the windows would be visible on the cosmetic skirt and would let dust into the box, which the brief does not allow.

The fourth option is often the best and is often missed. If the box had two small rectangular holes in its side walls, the hooks could engage those instead of a lip, and their catches could face inwards, towards the box's interior. The catch would then lie in the direction of opening for the core, and no moving steel would be needed. That requires a change to the box, which the manufacturer controls. In the running case, the box is an existing design used on other products, so the manufacturer chooses lifters, at the quoted cost, and records the alternative for the next revision of the box.

## Plan where the ejectors will push

Draft lets the part release; ejectors make it move. Ejector pins push on the part's working face as the mould opens, and every pin leaves a small, slightly raised or recessed circular mark. They need flat areas large enough to push on without denting the part, and they should push where the part is stiff, near the bases of ribs, bosses and walls, so that the force goes into the part's structure rather than bending a thin panel.

For the cover, the toolmaker proposes pins under the four corners of the skirt, at the base of each boss and at several rib intersections. Pushing at rib intersections spreads the load into the grid. Pushing in the middle of a thin panel between ribs would risk a visible mark showing through to the cosmetic face, which is exactly what the brief forbids.

A deep, closed-bottomed shape can also form a partial vacuum on its core as it is pushed off, because air cannot get in behind it fast enough. The Covestro guide notes that some deep shapes may need air valves at the top of the core to relieve it. The cover is shallow, at 20 mm, and the vacuum risk is small, but a deeper variant might need them. The design review is the place to ask.

Parts with little room for ejector pins often need extra draft, according to the same guide, because less pushing area means each pin must apply more force. If the design leaves the toolmaker few places to push, more draft is the cheapest way to compensate.

## Mark the pull direction on every feature

Before release, check that every feature on the part either lies in the pull direction with enough draft or is listed as an undercut with an agreed way of forming it. For the cover, that list is short: two hook catches, formed by lifters. Any feature that is in neither group, such as a small sideways hole added late for a cable tie, is a hidden undercut that will surface as an unexpected slide in the toolmaker's quotation or, worse, as a feature that cannot be moulded at all.

## A failure case: no draft on the textured skirt

This is an illustration. In an earlier project, a similar cover was modelled with its skirt faces exactly perpendicular to the top, because the designer intended to add draft later and forgot. The drawing showed the texture but no draft. The toolmaker, working from the model, cut the cavity with near-zero draft on the textured faces, as modelled.

At the first trial, every part came out with bright scuff lines running down the textured skirt, where the plastic had been scraped as it left the cavity. Several parts stuck in the cavity and had to be pulled out by hand. The fix required recutting the cavity with draft, which changed the skirt's outside dimensions, and re-texturing it, a delay of several weeks and a substantial cost.

The failure was detectable with a tool every CAD system has: a draft analysis, which colours each face according to whether its draft relative to the pull direction is above a chosen minimum. Run on the original model with a minimum of 2° for the textured faces, the skirt would have shown red. The check takes seconds and belongs on the release checklist for every moulded part.

## Decide draft before detailing

Draft changes dimensions, wall thickness and the shape of every rib and boss, so it should be applied early in modelling, not added as a finishing touch. Many designers model the main faces with their draft from the start, using the pull direction and parting line as the first references. Adding draft to a finished, heavily detailed model often fails or produces unexpected geometry where drafted faces meet fillets.

Record the pull direction, parting line and draft angles in the model and on the drawing, so that the toolmaker can confirm them. The toolmaker may suggest changes, for example more draft on a deep rib that would otherwise be difficult to polish, and those are worth accepting while the change is still free.

## Exercise: a deeper skirt

A variant of the cover for a deeper box has a skirt 30 mm deep, with 27.5 mm drafted below the top. With the same 2° outside and 1° inside, how much narrower is the skirt at the top than at the open edge, per side, and how much does the wall thickness change? Does it stay within a 25% variation from 2.5 mm?

**Worked answer.** The outside offset is **27.5 × tan 2° ≈ 0.96 mm** per side, so the skirt is nearly 1 mm narrower per side at the top than at the open edge. The wall changes by **27.5 × (tan 2° − tan 1°) ≈ 0.48 mm**. If the wall is 2.5 mm at the top, it is about 2.98 mm at the edge, about 19% thicker, which is within the guideline. Specifying the nominal 2.5 mm at mid-height instead would split the variation to about ±0.24 mm, roughly ±10%, which would be a sensible refinement for the deeper part.
