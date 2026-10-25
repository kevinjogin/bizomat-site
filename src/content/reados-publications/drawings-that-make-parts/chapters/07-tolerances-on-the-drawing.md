---
book: drawings-that-make-parts
chapterSlug: tolerances-on-the-drawing
order: 7
title: "Tolerances on the drawing: general notes and explicit limits"
description: "Cover every feature with a general tolerance note, pick out the features that need explicit limits or geometric tolerances, and see how a general tolerance on a bearing bore fails."
draft: false
---

Every feature on a part has a size and a shape, and no feature is ever made exactly to its nominal value. A drawing that gives sizes without saying how much they may vary is incomplete, because the maker and the inspector cannot know what to accept. AS 1100.201 clause 2.1.2 puts it directly: tolerancing should be complete, so that deviations of size and geometry are controlled for all features.

Writing a tolerance beside every dimension would make drawings unreadable and parts expensive. The practical answer has two layers: a general tolerance note that covers every feature not otherwise toleranced, and explicit tolerances on the few features where function needs more. This chapter applies both layers to the running case housing. Its error case shows what happens when a functional feature is left to the general note.

## Layer one: general tolerances

AS 1100.201 Appendix A, which is informative, gives a guide to general tolerancing of machined parts. It proposes a general note that names an accuracy grade for linear and angular dimensions and a class for geometry. Many overseas drawings cite ISO 2768 for general tolerances instead; if you receive one, compare its values with the grade you normally use before assuming they are equivalent.

For linear dimensions, the appendix gives four grades, fine, medium, coarse and very coarse, designated f, m, c and v, with permissible deviations that grow with the size of the dimension. For the medium grade, selected values from its Table A1 are:

```figure
type: svg
title: Medium grade linear deviations, AS 1100.201 Table A1 (selected)
alt: Medium grade linear deviations, AS 1100.201 Table A1 (selected). Over 3 up to 6 mm: Permissible deviation, mm ±0.1. Over 6 up to 30 mm: Permissible deviation, mm ±0.2. Over 30 up to 120 mm: Permissible deviation, mm ±0.3. Over 120 up to 400 mm: Permissible deviation, mm ±0.5. Over 400 up to 1 000 mm: Permissible deviation, mm ±0.8
caption: From the informative Appendix A of AS 1100.201-1992, medium grade (m). The table also gives fine, coarse and very coarse grades and sizes up to 4 000 mm.
viewbox: 0 0 640 218
body:
<g class="kf-a kd1">
<rect class="fs" x="20" y="10" width="600" height="33" rx="4"/>
<text class="txb" x="323.6" y="31">Permissible deviation, mm</text>
</g>
<g class="kf-a kd2">
<path class="lf" d="M20 76H620"/>
<text class="txb" x="28" y="64">Over 3 up to 6 mm</text>
<text class="tx" x="323.6" y="64">±0.1</text>
</g>
<g class="kf-a kd3">
<path class="lf" d="M20 109H620"/>
<text class="txb" x="28" y="97">Over 6 up to 30 mm</text>
<text class="tx" x="323.6" y="97">±0.2</text>
</g>
<g class="kf-a kd4">
<rect class="bxa" x="20" y="109" width="600" height="33" rx="4"/>
<path class="lf" d="M20 142H620"/>
<text class="txb" x="28" y="130">Over 30 up to 120 mm</text>
<text class="tx" x="323.6" y="130">±0.3</text>
</g>
<g class="kf-a kd5">
<path class="lf" d="M20 175H620"/>
<text class="txb" x="28" y="163">Over 120 up to 400 mm</text>
<text class="tx" x="323.6" y="163">±0.5</text>
</g>
<g class="kf-a kd6">
<path class="lf" d="M20 208H620"/>
<text class="txb" x="28" y="196">Over 400 up to 1 000 mm</text>
<text class="tx" x="323.6" y="196">±0.8</text>
</g>
<rect class="lf" x="20" y="10" width="600" height="198" rx="4" fill="none"/>
<path class="lf" d="M315.6 10V208"/>
```

The appendix also covers broken edges (external radii and chamfer heights), angular dimensions by the length of the shorter side, and general geometric tolerances in three classes, H, K and L, for straightness, flatness, parallelism, perpendicularity and runout. It notes that parallelism is limited by the size tolerance or the flatness value, whichever is greater, and that for perpendicularity the longer side of the angle is taken as the datum.

### The housing's general note

This is an illustration. The business chose medium grade for linear and angular dimensions and class K for geometry, written as a general note beside the title block naming AS 1100.201 Appendix A. Applied to the housing, that gives:

- spigot length 5 mm: ±0.1;
- flange thickness 12 mm: ±0.2;
- body diameter Ø95 and body length 60 mm: ±0.3;
- flange diameter Ø140: ±0.5;
- flatness of the flange face, whose largest dimension is 140 mm, in class K: 0.4 mm;
- general runout in class K: 0.2 mm.

These values are generous for a machined part, and that is deliberate. A general tolerance should be one that the supplier's normal process achieves without special care, so that it costs nothing and is rarely inspected feature by feature. Anything tighter belongs in layer two, written beside the feature that needs it.

### Choosing the grade

The right general grade is the one the supplier's normal process achieves comfortably. A grade that is tighter than the process forces extra care on every feature, which costs money everywhere to protect the few features that need it. A grade that is looser than the process is harmless for most features but tempts designers to leave functional features under it, as the error case below shows.

The business chose medium grade because its machined parts are made on ordinary CNC lathes and mills, which hold medium-grade tolerances without effort. A business making precision instruments might choose fine; a fabricator making large frames might choose coarse. Whatever the choice, it should be the same across a family of drawings, so that suppliers learn what to expect.

### Unmachined cast surfaces

The housing is a casting, and most of its outside is left as cast. Machining grades do not suit those surfaces. AS 1100.201 Appendix B, also informative, offers guidance on general tolerances for castings, with fourteen tolerance grades designated CT3 to CT16, a tolerance zone normally symmetrical about the basic dimension, and a list of what a casting drawing should show: the part name and number, the actual or estimated mass, the important dimensions, the dimensional tolerances, the surfaces to be machined and their machining allowances, and any special requirements such as testing or hardness locations. It recommends that the customer discuss the casting design, accuracy and method with the foundry before the order is finalised, because the achievable tolerance depends on the casting process and the quantity.

The running case business therefore has two drawings for the housing: a casting drawing for the foundry, with the raw casting dimensions, machining allowances and a casting tolerance grade agreed with the foundry, and the machining drawing for the machine shop, which refers to the casting drawing and tolerances only the machined features. Putting both sets of requirements on one sheet is possible, but two drawings for two suppliers is clearer.

## Layer two: explicit tolerances where function demands

The designer then went through the housing feature by feature and asked, for each one: does the general tolerance let this feature do its job? Four features failed the test.

```figure
type: svg
title: Features of the housing that need explicit tolerances
alt: Features of the housing that need explicit tolerances. Done: Bearing bore Ø62, general ±0.3 would let the bearing rattle or jam; explicit limits 62.000 to 62.030. Done: Spigot Ø100, locates the housing on the pump; explicit limits 99.964 to 99.986. Done: Bearing seat depth 18, sets the end cap clamp; explicit ±0.05 instead of general ±0.2. Done: Bore runout relative to the spigot, general 0.2 too large for the seal; explicit 0.02
caption: This is an illustration. Limits are illustrative values chosen by the designer from function and the bearing maker's guidance, not values from AS 1100.
viewbox: 0 0 640 302
body:
<g class="kf-a kd1">
<rect class="bx" x="20" y="12" width="600" height="77" rx="6"/>
<circle class="bxa" cx="40" cy="29" r="11"/>
<path class="la draw" pathLength="1" d="M34 29l4 4 8-8"/>
<text class="txb" x="64" y="32">Bearing bore Ø62</text>
<text class="tx" x="64" y="53">general ±0.3 would let the bearing rattle or jam; explicit limits 62.000 to</text>
<text class="tx" x="64" y="71">62.030</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="20" y="97" width="600" height="59" rx="6"/>
<circle class="bxa" cx="40" cy="114" r="11"/>
<path class="la draw" pathLength="1" d="M34 114l4 4 8-8"/>
<text class="txb" x="64" y="117">Spigot Ø100</text>
<text class="tx" x="64" y="138">locates the housing on the pump; explicit limits 99.964 to 99.986</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="20" y="164" width="600" height="59" rx="6"/>
<circle class="bxa" cx="40" cy="181" r="11"/>
<path class="la draw" pathLength="1" d="M34 181l4 4 8-8"/>
<text class="txb" x="64" y="184">Bearing seat depth 18</text>
<text class="tx" x="64" y="205">sets the end cap clamp; explicit ±0.05 instead of general ±0.2</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="20" y="231" width="600" height="59" rx="6"/>
<circle class="bxa" cx="40" cy="248" r="11"/>
<path class="la draw" pathLength="1" d="M34 248l4 4 8-8"/>
<text class="txb" x="64" y="251">Bore runout relative to the spigot</text>
<text class="tx" x="64" y="272">general 0.2 too large for the seal; explicit 0.02</text>
</g>
```

Each explicit tolerance overrides the general note for that feature only. Everything else on the drawing stays under the general note. In the end, four tolerances are written on the drawing instead of thirty, and those four are the ones the inspector must check carefully.

The bore and spigot limits are written as limits, upper above lower, which is unambiguous and easy to inspect. The bearing seat depth is written as a symmetrical plus or minus tolerance. The runout is a geometric tolerance, written in a feature control frame on the bore, referring to the spigot as datum A. The datum is identified on the spigot with a datum feature symbol. The READOS book [Fits That Work](/reados/publications/fits-that-work/) covers how to choose the size limits for a fit; this chapter is about how they appear on the sheet.

## Writing tolerances on the sheet

A few conventions keep explicit tolerances readable. Limits are written with the upper limit above the lower. Tolerance values are written at the same character height as the dimension they apply to, not smaller, as AS 1100.101 clause 4.1.2 requires. A dimension carries one tolerance only: either it is under the general note or it has its own tolerance, never both. And where a feature has both a size tolerance and a geometric tolerance, the feature control frame is attached to the feature or its size dimension so that there is no doubt which feature it governs.

## Basic dimensions and material condition

Two more conventions from AS 1100.101 appear on the housing.

**Basic dimensions.** A dimension that defines the theoretically exact position of a feature, controlled instead by a geometric tolerance, is a basic dimension and is shown in a box (AS 1100.101 clause 8.3.2.2). The pitch circle diameter of the flange holes, Ø115, is basic. It carries no tolerance of its own; the position tolerance on the holes controls how far each hole may stray from its exact position.

**Maximum material condition.** AS 1100.101 clause 8.5 explains that where a geometric tolerance is applied on a maximum material condition (MMC) basis, the tolerance applies at the MMC size and grows as the feature departs from it. For a hole, MMC is the smallest permitted size. This is an illustration. The flange holes are Ø9 with limits 9.0 to 9.2, and their position tolerance is Ø0.2 at MMC. A hole made at 9.0 must be within a Ø0.2 zone of its true position. A hole made at 9.2 has departed from MMC by 0.2, so its permitted position zone grows to **0.2 + 0.2 = Ø0.4**. The extra tolerance costs nothing functionally, because a larger hole gives the bolt more clearance.

```figure
type: svg
title: Position tolerance on a hole specified at MMC
alt: Position tolerance on a hole specified at MMC. Formula: permitted zone = stated tolerance + (actual hole size − MMC size). stated tolerance: the position tolerance in the feature control frame, Ø mm. MMC size: smallest permitted hole size, mm. Step: Hole at 9.0: zone = 0.2 + (9.0 − 9.0) = Ø0.2. Step: Hole at 9.1: zone = 0.2 + (9.1 − 9.0) = Ø0.3. Step: Hole at 9.2: zone = 0.2 + (9.2 − 9.0) = Ø0.4
caption: This is an illustration of the principle in AS 1100.101 clause 8.5, using the housing's flange holes.
viewbox: 0 0 640 320
- Formula | permitted zone = stated tolerance + (actual hole size − MMC size)
- stated tolerance | the position tolerance in the feature control frame, Ø mm
- MMC size | smallest permitted hole size, mm
- Worked | Hole at 9.0: zone = 0.2 + (9.0 − 9.0) = Ø0.2
- Worked | Hole at 9.1: zone = 0.2 + (9.1 − 9.0) = Ø0.3
- Worked | Hole at 9.2: zone = 0.2 + (9.2 − 9.0) = Ø0.4
body:
<g class="kf-a kd1">
<circle class="bx" cx="110" cy="140" r="99"/>
<circle class="fs pulse" cx="110" cy="140" r="10"/>
<path class="cl" d="M-10 140H230M110 20V260"/>
<text class="txb" x="110" y="285" text-anchor="middle">hole Ø9.0</text>
<text class="txa" x="110" y="305" text-anchor="middle">zone Ø0.2</text>
</g>
<g class="kf-a kd2">
<circle class="bx" cx="320" cy="140" r="100.1"/>
<circle class="fs pulse" cx="320" cy="140" r="15"/>
<path class="cl" d="M200 140H440M320 20V260"/>
<text class="txb" x="320" y="285" text-anchor="middle">hole Ø9.1</text>
<text class="txa" x="320" y="305" text-anchor="middle">zone Ø0.3</text>
</g>
<g class="kf-a kd3">
<circle class="bx" cx="530" cy="140" r="101.2"/>
<circle class="bxa pulse" cx="530" cy="140" r="20"/>
<path class="cl" d="M410 140H650M530 20V260"/>
<text class="txb" x="530" y="285" text-anchor="middle">hole Ø9.2</text>
<text class="txa" x="530" y="305" text-anchor="middle">zone Ø0.4</text>
</g>
<g class="kf-a kd4">
<text class="txs" x="320" y="20" text-anchor="middle">Hole drawn 22 × size; position zone drawn 100 × size; MMC is the smallest hole, Ø9.0</text>
</g>
```

## The error: a bearing bore under the general note

The business's first prototype housing was drawn before the designer had finished the tolerancing. The bore was dimensioned Ø62 with no tolerance, so it fell under the general note: medium grade, ±0.3 mm, giving limits of **61.7 to 62.3 mm**. The prototype shop, reasonably, made it to the middle of that range with an ordinary turning operation.

The bore came out at 62.15 mm. The bearing slid in by hand and could be rocked in the bore. On test, the outer ring crept, the bore wore, and the seal started leaking within hours because the shaft was no longer running true. The fault was traced by measuring the bore with a bore gauge and comparing it with the bearing's outside diameter. The part was within the drawing. The drawing was wrong.

The fix was layer two: explicit limits for the bore based on the bearing maker's recommendations for the load and fit, and the runout tolerance relative to the spigot. The general lesson is that a general tolerance note is a promise that every unmarked feature can tolerate that much variation. The designer must check that promise against every feature, especially bearing seats, locating diameters, sealing faces and anything that mates with a bought-out part.

## A review routine for the general note

The bore error happened because nobody checked the general note against each feature. The business now runs a short routine on every new detail drawing before release:

1. List every feature on the part: each diameter, length, hole, face and chamfer.
2. Mark the features that mate with another part, locate the part, seal, carry a bearing or are measured in service.
3. For each marked feature, write down the variation it can tolerate, from the mating part, the bearing or seal maker's data, or a stack-up.
4. Compare that with the general note's value for the feature's size. If the general note allows more, the feature needs an explicit tolerance.
5. For the unmarked features, check that the general note is not tighter than the process needs; if it is, the grade may be wrong for the part.

On the housing, the routine marked seven features and found four that needed explicit tolerances. The other three, the flange holes, the tapped holes and the flange face, were adequately covered by the general note or by the position tolerance on the holes. The routine takes perhaps twenty minutes for a part like the housing, and it would have saved the prototype.

## Tolerances that can be inspected

Each explicit tolerance should be checked by asking how it will be measured. The bore limits can be checked with a bore gauge or plug gauges. The spigot can be checked with a micrometer or ring gauges. The seat depth needs a depth micrometer or height gauge from the rear face. The runout needs the housing mounted on its spigot and an indicator on the bore while it rotates. If a tolerance cannot be measured with the equipment the supplier or the business has, either the measurement must be arranged or the tolerance reconsidered. A tolerance nobody can check is a hope, not a requirement. The inspection method also affects cost: a runout check on a rotating fixture takes longer than a diameter check with a micrometer, so a tight geometric tolerance should be there because function needs it, not because it was convenient to write.

## Exercise: tolerance the end cap

The end cap is a turned steel part with a register diameter that fits into the housing's Ø62 bore to locate it, an outside diameter of 95 mm, a thickness of 10 mm, a seal bore and four Ø7 holes for the M6 screws. Using the two-layer approach, which features would you leave to the general note (medium grade, class K) and which need explicit tolerances?

**Worked answer.** The **register diameter** locates the cap in the bore and must clear it with a small, controlled gap, so it needs explicit limits chosen against the bore's limits. The **seal bore** must hold the lip seal with the interference its maker specifies, so it needs explicit limits, and its runout relative to the register needs an explicit geometric tolerance so that the seal lip runs concentric with the shaft. The **face that clamps the bearing** may need an explicit flatness or perpendicularity if the clamp is critical.

The **outside diameter Ø95** (medium: ±0.3), the **thickness 10** (±0.2) and the **screw holes Ø7** can usually stay under the general note, since the screw holes give clearance for M6 screws. If the holes' positions must match the housing's tapped holes closely, a position tolerance at MMC is the better tool than tightening the general note. The pattern is the same as for the housing: a handful of explicit tolerances where function lives, and the general note for everything else.
