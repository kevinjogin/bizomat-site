---
book: sheet-metal-parts-by-the-numbers
chapterSlug: flanges-hems-and-the-die
order: 7
title: "Flanges, hems, joggles and the die"
description: "Find the shortest flange a die can bend, see why it grows with the die opening, design hems and joggles, and catch a thicker variant whose return flanges would fall into the die."
draft: false
---

A press brake can only bend a flange that is long enough to bridge its die. In air bending, the sheet rests on the V-die's two shoulders while the punch pushes it down between them. If the flange being formed is too short, it slips off its shoulder into the V before the bend is complete, and the bend comes out at the wrong angle, in the wrong place, or not at all. The shortest flange a folder can make therefore depends on the die, and the die depends on the thickness and radius, so a designer who changes the material can make a flange that was fine yesterday unbendable today.

This chapter sets out the minimum flange and how it scales with the die, then turns to the other formed features that live at the edges of sheet metal parts: hems, which fold an edge back on itself, and joggles, which offset a flange by a small step. The running case confirms the bracket's 15 mm returns, then finds that Chapter 2's thicker variant needs longer ones.

## Why flanges have a minimum length

As the punch pushes the sheet into the die, each flange slides a little over its shoulder towards the V. By the time the bend reaches 90°, the edge of the shorter flange must still be resting on the shoulder. The minimum flange length is set by the die opening, because a wider V needs a longer flange to stay on its shoulder through the bend, and by the radius and thickness, which decide how much of the flange is consumed by the bend itself.

Fabricators publish rules of thumb for it. The same fabricator's guide quoted in Chapter 6 gives two: a flange length of at least R + 3t, and about 0.7 times the V-die opening. This book takes both as applying to the outside flange dimension, uses whichever is larger, and confirms with the folder, which is the reliable source for its own dies.

```figure
type: compare
title: Minimum flange length by thickness and die
cols: R + 3t | 0.7 × die opening | Governing minimum
caption: This is an illustration using one fabricator's published rules of thumb, taken as outside flange dimensions. The folder's own figures for its dies take precedence.
- *2.0 mm sheet, V12 die, R 2.0 | 8.0 mm | 8.4 mm | 8.4 mm
- 2.0 mm sheet, V16 die, R 2.7 | 8.7 mm | 11.2 mm | 11.2 mm
- 3.0 mm sheet, V16 die, R 3.0 | 12.0 mm | 11.2 mm | 12.0 mm
- 3.0 mm sheet, V24 die, R 4.5 | 13.5 mm | 16.8 mm | 16.8 mm
```

## The running case: the bracket's returns

This is an illustration. The bracket's returns are its shortest flanges, 15 mm outside, in 2.0 mm sheet with the V12 die. The minimum from the table is 8.4 mm, and the folder's own figure for its V12 die in this material is 9 mm. The returns pass with a comfortable margin, and the folder can bend them first, while the blank is flat and easy to position against the back gauge.

The legs, 60 mm, and the base, 160 mm, are far above any minimum. On a part like the bracket, only the shortest flange needs checking, but on a part with many short tabs, every one does.

## The error: the thicker variant

This is an illustration. Chapter 2's exercise proposed a variant of the bracket in 3.0 mm high-strength steel, folded with the V24 die to an inside radius of 4.5 mm for a margin against cracking, and kept the 15 mm return flanges of the original. The designer released it to the folder without checking the returns against the new die.

The folder's first trial in the V24 die produced returns that slipped off the shoulder partway through the bend and came out at about 80°, with a visible scuff where the flange's edge had dragged into the V. The table shows why: for 3.0 mm sheet in a V24 die, the governing minimum flange is 0.7 × 24 = **16.8 mm**, and the folder's own figure was 17 mm. The 15 mm returns were too short for the die chosen to protect the bend from cracking.

The designer had three choices: lengthen the returns to 18 mm, which the drive's clamp could accept; use the V16 die, which forms R3.0, at the cost of the extra cracking margin Chapter 2 had sought; or have the folder use a special die with a narrower shoulder geometry for the returns only. The designer lengthened the returns to 18 mm, recalculated the flat pattern for the new thickness and radius, and asked the folder to confirm the K-factor for the V24 die with trial strips. The lesson the office recorded was that a change of material is a change of die, and a change of die is a change of every flange's minimum. Its sheet metal drawings now carry a note naming the die the flat pattern was calculated for, such as "FLAT PATTERN FOR V24 DIE, R4.5, K 0.40 (TO BE CONFIRMED)", so that a reader can see at once which tooling assumptions sit behind the flanges and the flat, and can ask before a substitution is made at the press brake.

## Hems

A **hem** folds the edge of a sheet back on itself, through 180°. It stiffens the edge, removes a sharp cut edge from where hands touch it, and can capture another sheet or a gasket. Hems come in three common forms:

- a **closed hem**, folded flat so that the two layers touch, which is the stiffest and the safest to handle but cracks easily in less ductile materials, since its inside radius is close to zero;
- an **open hem**, folded back with a small gap between the layers, which bends at a real radius and suits harder materials;
- a **teardrop hem**, which curls the edge into a tear shape, keeping a larger radius at the fold while bringing the edge close to the sheet.

A press brake usually forms a hem in two steps: an acute bend, to about 30° included angle, with a special die, then a flattening stroke. The flat length a hem consumes depends on how tightly the second step closes it, which is why the K-factor measured at 90° does not apply. As a rough estimate for a closed hem, treating its inside radius as zero, the bend allowance is θ × K × t = π × 0.4 × 2.0 = **2.5 mm** in the bracket's sheet. The folder's hem allowance, from its own trials, should replace that estimate before the flat is released.

```figure
type: decision
title: Choosing a hem for an exposed edge
question: The edge must be safe to handle and stiff. Which hem suits the material?
- Ductile mild steel or soft aluminium | Closed hem | Stiffest and neatest; inside radius near zero
- *Higher-strength steel or hard aluminium | Open hem or teardrop | Keeps a real radius at the fold and avoids cracking
- Edge must capture a panel or seal | Open hem sized to the captured thickness | The gap is a functional dimension
- Edge is not handled and not stiffened | No hem; deburr only | Cheapest; often enough on internal brackets
```

## Measuring a hem allowance

A hem allowance is measured the same way as a bend allowance, with a trial strip. This is an illustration. The folder cuts a strip of the bracket's 2.0 mm sheet exactly 100.0 mm long, hems one end with its two-step tooling, and measures two lengths: L₁, along the main layer from the strip's free end to the outside of the fold, and L₂, along the folded-back layer from the outside of the fold to its cut edge. With L₁ = 87.2 mm and L₂ = 10.3 mm, the hem has consumed 100.0 − 87.2 − 10.3 = **2.5 mm**, the same as the rough estimate above.

Agreement that close is partly luck; the estimate assumed an inside radius of zero and a K-factor measured at 90°, neither of which strictly applies to a squeezed hem. The measured value is the one to use, and the drawing should dimension the hem by its finished length, L₂ in this case, so that the folder can adjust the flat for its own tooling.

```figure
type: formula
title: Hem allowance from a trial strip
formula: hem allowance = L₀ − L₁ − L₂
caption: This is an illustration. L₁ and L₂ are measured to the outside of the fold. The rough estimate π × K × t, with an inside radius of zero, gave 2.5 mm for this sheet.
- L₀ | Strip length before hemming, 100.0 mm
- L₁ | Main layer, free end to outside of fold, 87.2 mm
- L₂ | Folded-back layer, outside of fold to cut edge, 10.3 mm
step: Hem allowance = 100.0 − 87.2 − 10.3 = 2.5 mm
step: For a finished hem 10.3 mm long, the flat needs 10.3 + 2.5 = 12.8 mm beyond the fold's outside line
```

## Joggles

A **joggle** is a small step formed by two opposite bends close together, so that a flange is offset by about one thickness and can overlap a neighbouring part flush. Joggles are common where two sheets meet, such as an enclosure's lid overlapping its walls.

Two numbers control a joggle: the offset, usually close to the sheet thickness, and the length of flat between the two bends. If the two bends are too close, the second bend's die shoulder lands on the first bend, and the step cannot be formed by two separate air bends. Folders form short joggles in one stroke with a special offset die, whose geometry sets the minimum offset and length. For a joggle, as for a hem, the designer should take the minimum flat length and the flat allowance from the folder's tooling rather than calculate them.

## Flanges that carry features

A flange's minimum length is the length to bridge the die with nothing on it. A flange that carries a hole, a slot or a tab must also keep that feature clear of the bend by the distance of Chapter 6, and clear of its own cut edge by the edge distance. Those requirements add up, and on short flanges they often govern rather than the die.

This is an illustration. If the bracket's 15 mm returns carried a row of Ø5 holes for a cable tie, the holes' edges would need to be at least 7 mm from the return bend's tangent line, which is 4 mm from the leg's outside face, so at least 11 mm from it, and at least 4 mm from the return's cut edge at 15 mm, so no more than 11 mm from it. That leaves exactly one position, a hole with both edges at 11 mm, which is impossible for a hole with any diameter. The returns cannot carry the holes as drawn; they would need to be at least 11 + 5 + 4 = 20 mm long. The die's 8.4 mm minimum was never the limiting number.

## Flanges stiffen the part

Flanges are not only for fixing things to. A return flange along the top of a leg turns the leg from a flat plate into an angle section, which is far stiffer against bending and buckling. The bracket's 15 mm returns are what keep its 60 mm legs from flexing when the drive vibrates. Shortening or removing a return to save material or clear a cable, as Chapter 6's shortened return did for 40 mm of its length, reduces that stiffness locally, and the designer should check that the leg still carries its load where the return is missing.

## Short flanges by design

Sometimes a short flange is what the design needs: a small lip to stiffen an edge, a tab to locate a mating part. When it is shorter than the folder's minimum for any practical die, there are a few options:

- make the flange longer than needed and trim it after folding, which adds an operation;
- form it with a narrower die, accepting a smaller radius and more force;
- change the feature to one that does not need folding, such as an embossed rib for stiffness;
- move the feature to the mating part.

Each is a trade-off that the designer and folder settle together. What the designer should not do is draw a 5 mm flange in 3 mm sheet and leave the folder to discover that it cannot be made.

## Flanges and the bend sequence

Flange lengths also interact with the bend sequence of Chapter 1. A long flange already folded can collide with the press brake's ram or punch while a later bend is being made; a short flange may be too short to sit against the back gauge, which positions the blank for each bend. The back gauge needs an edge or a flange to register against, and on parts where every edge has already been folded, the folder may need a locating tab, cut off afterwards, or a fixture. The bracket's sequence, returns first and legs second, leaves the base edges free for the back gauge throughout, which is one reason the folder chose it.

## Exercise: a stiffening lip

A cover for the drive is folded from 1.6 mm mild steel with an inside radius of 1.6 mm using the folder's V10 die. The designer wants a 6 mm lip along one edge to stiffen it. Using the two rules of thumb, is 6 mm long enough, and what alternatives would you suggest if it is not?

**Worked answer.** R + 3t = 1.6 + 3 × 1.6 = **6.4 mm**, and 0.7 × 10 = **7.0 mm**. The governing minimum is 7.0 mm, so a 6 mm lip is about 1 mm too short for the V10 die.

Three alternatives, in rough order of preference:

1. **Lengthen the lip to 8 mm**, if the cover's space allows. That clears the minimum with a margin and stiffens the edge more.
2. **Use a smaller die**, if the folder has one that forms a suitable radius in 1.6 mm sheet, and recalculate the flat for its K-factor and radius.
3. **Replace the lip with an open hem or a pressed rib**, which stiffens the edge without needing a flange to bridge the die. An open hem also removes the sharp edge, which a cover handled during maintenance benefits from.

The designer should ask the folder which of these suits its tooling before choosing, and record the agreed minimum flange on the drawing's notes for future variants.
