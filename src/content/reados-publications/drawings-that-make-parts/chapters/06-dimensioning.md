---
book: drawings-that-make-parts
chapterSlug: dimensioning
order: 6
title: "Dimensioning for function, once and only once"
description: "Lay out dimensions to AS 1100.101: symbols, projection and dimension lines, leaders, numbers and units, functional origins, auxiliary dimensions and the cost of redundancy."
draft: false
---

Dimensions turn a picture into a specification. Each one tells a maker how big a feature is or where it sits, and, together with its tolerance, how much it may vary. A well-dimensioned drawing gives each size and position once, from a sensible origin, in a form nobody can misread. A poorly dimensioned one gives some sizes twice, others not at all, and leaves the maker to work out which numbers matter.

This chapter applies AS 1100.101 clause 8.2 to the running case housing. It covers the symbols in front of dimensions, the layout of projection lines, dimension lines and leaders, the way numbers are written, functional dimensioning, and auxiliary dimensions. Its error case is the most common dimensioning fault there is: a chain of dimensions plus an overall dimension, each with its own tolerance.

## Symbols in front of dimensions

AS 1100.101 Table 8.1 defines symbols that tell the reader what kind of feature a dimension refers to. Each is placed in front of the number unless stated otherwise.

```figure
type: svg
title: Dimensioning symbols, AS 1100.101 Table 8.1
alt: Dimensioning symbols, AS 1100.101 Table 8.1. Ø: Meaning diameter of a circle or cylinder; Placed in front of the dimension. R: Meaning radius; Placed in front of the dimension. SØ and SR: Meaning diameter or radius of a spherical surface; Placed in front of the dimension. Square symbol: Meaning width across flats of a square section; Placed in front of the dimension. Taper and slope symbols: Meaning a taper or slope and its direction; Placed in front of the ratio. Countersink, counterbore or spotface, depth: Meaning features of holes; Placed in front of the dimension. Arc symbol: Meaning length along an arc; Placed above the dimension. Centre line symbol: Meaning the centre line of a part or feature group; Placed on or beside the centre line
caption: Summarised from AS 1100.101-1992; the symbols' shapes and sizes are in its Figure 4.14.
viewbox: 0 0 640 457
body:
<g class="kf-a kd1">
<rect class="fs" x="20" y="10" width="600" height="33" rx="4"/>
<text class="txb" x="239" y="31">Meaning</text>
<text class="txb" x="448.2" y="31">Placed</text>
</g>
<g class="kf-a kd2">
<path class="lf" d="M20 93H620"/>
<text class="txb" x="28" y="64">Ø</text>
<text class="tx" x="239" y="64">diameter of a circle or</text>
<text class="tx" x="239" y="82">cylinder</text>
<text class="tx" x="448.2" y="64">in front of the</text>
<text class="tx" x="448.2" y="82">dimension</text>
</g>
<g class="kf-a kd3">
<path class="lf" d="M20 143H620"/>
<text class="txb" x="28" y="114">R</text>
<text class="tx" x="239" y="114">radius</text>
<text class="tx" x="448.2" y="114">in front of the</text>
<text class="tx" x="448.2" y="132">dimension</text>
</g>
<g class="kf-a kd4">
<path class="lf" d="M20 193H620"/>
<text class="txb" x="28" y="164">SØ and SR</text>
<text class="tx" x="239" y="164">diameter or radius of a</text>
<text class="tx" x="239" y="182">spherical surface</text>
<text class="tx" x="448.2" y="164">in front of the</text>
<text class="tx" x="448.2" y="182">dimension</text>
</g>
<g class="kf-a kd5">
<path class="lf" d="M20 243H620"/>
<text class="txb" x="28" y="214">Square symbol</text>
<text class="tx" x="239" y="214">width across flats of a</text>
<text class="tx" x="239" y="232">square section</text>
<text class="tx" x="448.2" y="214">in front of the</text>
<text class="tx" x="448.2" y="232">dimension</text>
</g>
<g class="kf-a kd6">
<path class="lf" d="M20 293H620"/>
<text class="txb" x="28" y="264">Taper and slope symbols</text>
<text class="tx" x="239" y="264">a taper or slope and its</text>
<text class="tx" x="239" y="282">direction</text>
<text class="tx" x="448.2" y="264">in front of the ratio</text>
</g>
<g class="kf-a kd7">
<path class="lf" d="M20 364H620"/>
<text class="txb" x="28" y="314">Countersink,</text>
<text class="txb" x="28" y="333">counterbore or</text>
<text class="txb" x="28" y="352">spotface, depth</text>
<text class="tx" x="239" y="314">features of holes</text>
<text class="tx" x="448.2" y="314">in front of the</text>
<text class="tx" x="448.2" y="332">dimension</text>
</g>
<g class="kf-a kd8">
<path class="lf" d="M20 397H620"/>
<text class="txb" x="28" y="385">Arc symbol</text>
<text class="tx" x="239" y="385">length along an arc</text>
<text class="tx" x="448.2" y="385">above the dimension</text>
</g>
<g class="kf-a kd9">
<path class="lf" d="M20 447H620"/>
<text class="txb" x="28" y="418">Centre line symbol</text>
<text class="tx" x="239" y="418">the centre line of a part</text>
<text class="tx" x="239" y="436">or feature group</text>
<text class="tx" x="448.2" y="418">on or beside the centre</text>
<text class="tx" x="448.2" y="436">line</text>
</g>
<rect class="lf" x="20" y="10" width="600" height="437" rx="4" fill="none"/>
<path class="lf" d="M231 10V447"/>
<path class="lf" d="M440.2 10V447"/>
```

The symbols do more than save words. A diameter symbol lets a single view define a round feature, as Chapter 4 showed. A depth symbol after a hole size removes the need for a section to show the depth. A counterbore symbol tells the reader the feature is a stepped hole, not two separate holes.

## Projection lines, dimension lines and leaders

Clause 8.2.3 sets out how the lines around a dimension are drawn:

- **Projection lines** (extension lines) are narrow continuous lines, projected from the feature so that the dimension can sit outside the outline. They start just clear of the outline and extend a little beyond the dimension line.
- **Dimension lines** are narrow continuous lines parallel to the direction of measurement, preferably outside the view. The first dimension line should be at least **3h** from the outline, and each further one at least **2h** from the last, where h is the character height. Arrowheads touch the projection lines.
- **A centre line, an extension of a centre line or an outline must never be used as a dimension line.**
- **Leaders** are narrow lines that show where a note or dimension applies. A leader ends in an arrowhead on a line or in a dot within an outline. It should not run parallel to nearby dimension or projection lines, and should meet the feature at no more than 45° from the normal. Long leaders should be avoided, even if that means dimensioning identical features separately or labelling them with a letter and a note.

With the 3.5 mm characters chosen in Chapter 3, the first row of dimensions on the housing sits at least **3 × 3.5 = 10.5 mm** from the outline, and each further row at least **2 × 3.5 = 7 mm** beyond the last. Three rows on one side of a view therefore need at least **10.5 + 7 + 7 = 24.5 mm** of clear space. That is part of the reason the housing needed an A3 sheet.

```figure
type: svg
title: Space needed for rows of dimensions
alt: Space needed for rows of dimensions. Formula: space = 3h + 2h × (n − 1). h: character height, mm. n: number of rows of dimension lines on one side. Step: h = 3.5 mm, n = 3: 10.5 + 7 + 7 = 24.5 mm. Step: h = 2.5 mm, n = 3: 7.5 + 5 + 5 = 17.5 mm
caption: From the minimum spacings in AS 1100.101 clause 8.2.3.2, with h the character height and n the number of rows on one side of a view.
viewbox: 0 0 640 330
- Formula | space = 3h + 2h × (n − 1)
- h | character height, mm
- n | number of rows of dimension lines on one side
- Worked | h = 3.5 mm, n = 3: 10.5 + 7 + 7 = 24.5 mm
- Worked | h = 2.5 mm, n = 3: 7.5 + 5 + 5 = 17.5 mm
body:
<g class="kf-a kd1">
<rect class="bxi" x="20" y="250" width="220" height="40"/>
<text class="txs" x="130" y="275" text-anchor="middle">part outline</text>
<path class="lf" d="M30 248V181M230 248V181"/>
<path class="ln" d="M30 187H230"/>
<path class="ah" d="M30 187l8 -4v8z"/>
<path class="ah" d="M230 187l-8 -4v8z"/>
<text class="txs" x="130" y="181" text-anchor="middle">row 1</text>
<path class="lf" d="M50 248V139M210 248V139"/>
<path class="ln" d="M50 145H210"/>
<path class="ah" d="M50 145l8 -4v8z"/>
<path class="ah" d="M210 145l-8 -4v8z"/>
<text class="txs" x="130" y="139" text-anchor="middle">row 2</text>
<path class="lf" d="M70 248V97M190 248V97"/>
<path class="ln" d="M70 103H190"/>
<path class="ah" d="M70 103l8 -4v8z"/>
<path class="ah" d="M190 103l-8 -4v8z"/>
<text class="txs" x="130" y="97" text-anchor="middle">row 3</text>
<path class="ln" d="M270 187V250"/>
<path class="ah" d="M270 187l-4 8h8z"/>
<path class="ah" d="M270 250l-4 -8h8z"/>
<text class="txs" x="278" y="222.5" text-anchor="start">3h = 10.5</text>
<path class="ln" d="M270 145V187"/>
<path class="ah" d="M270 145l-4 8h8z"/>
<path class="ah" d="M270 187l-4 -8h8z"/>
<text class="txs" x="278" y="170" text-anchor="start">2h = 7</text>
<path class="ln" d="M270 103V145"/>
<path class="ah" d="M270 103l-4 8h8z"/>
<path class="ah" d="M270 145l-4 -8h8z"/>
<text class="txs" x="278" y="128" text-anchor="start">2h = 7</text>
<text class="txb" x="130" y="315" text-anchor="middle">h = 3.5 mm: 24.5 mm for 3 rows</text>
</g>
<g class="kf-a kd2">
<rect class="bxi" x="340" y="250" width="220" height="40"/>
<text class="txs" x="450" y="275" text-anchor="middle">part outline</text>
<path class="lf" d="M350 248V199M550 248V199"/>
<path class="ln" d="M350 205H550"/>
<path class="ah" d="M350 205l8 -4v8z"/>
<path class="ah" d="M550 205l-8 -4v8z"/>
<text class="txs" x="450" y="199" text-anchor="middle">row 1</text>
<path class="lf" d="M370 248V169M530 248V169"/>
<path class="ln" d="M370 175H530"/>
<path class="ah" d="M370 175l8 -4v8z"/>
<path class="ah" d="M530 175l-8 -4v8z"/>
<text class="txs" x="450" y="169" text-anchor="middle">row 2</text>
<path class="lf" d="M390 248V139M510 248V139"/>
<path class="ln" d="M390 145H510"/>
<path class="ah" d="M390 145l8 -4v8z"/>
<path class="ah" d="M510 145l-8 -4v8z"/>
<text class="txs" x="450" y="139" text-anchor="middle">row 3</text>
<path class="ln" d="M590 205V250"/>
<path class="ah" d="M590 205l-4 8h8z"/>
<path class="ah" d="M590 250l-4 -8h8z"/>
<text class="txs" x="598" y="231.5" text-anchor="start">3h = 7.5</text>
<path class="ln" d="M590 175V205"/>
<path class="ah" d="M590 175l-4 8h8z"/>
<path class="ah" d="M590 205l-4 -8h8z"/>
<text class="txs" x="598" y="194" text-anchor="start">2h = 5</text>
<path class="ln" d="M590 145V175"/>
<path class="ah" d="M590 145l-4 8h8z"/>
<path class="ah" d="M590 175l-4 -8h8z"/>
<text class="txs" x="598" y="164" text-anchor="start">2h = 5</text>
<text class="txb" x="450" y="315" text-anchor="middle">h = 2.5 mm: 17.5 mm for 3 rows</text>
</g>
```

## Chain, parallel and running dimensions

Where several features are positioned along one direction, there are three common arrangements, and the choice affects how tolerances add up.

- **Chain dimensioning** gives each feature from the previous one. It is compact, but tolerances accumulate along the chain, so the position of the last feature relative to the first varies by the sum of all the tolerances in between.
- **Parallel dimensioning** gives every feature from one common origin, with a separate dimension line for each. Each feature's position varies only by its own tolerance relative to the origin. It uses more space.
- **Running dimensioning** also measures every feature from one origin, but along a single dimension line, with the values written near their arrowheads. AS 1100.101 clause 8.2.3.2 asks for a prominent dot at the common origin when this method is used, replaced by a datum indicator where the origin is a datum.

The choice should follow function. If two features must be accurately positioned relative to each other, dimension one from the other directly. If several features must each be accurately positioned relative to one face, dimension them all from that face. Chain dimensioning suits features whose positions relative to each other matter more than their positions relative to a distant face, such as a row of holes that must match a mating part's row.

## Aligned and unidirectional text

AS 1100.101 recognises two ways of orienting dimension text: aligned with the dimension line, readable from the bottom or right of the sheet, and unidirectional, always horizontal. Dimension lines may be broken for the number in the aligned method, and must be broken where necessary in the unidirectional method. Either can be used, but one method should be used consistently on a drawing. CAD templates usually fix the choice, and it should be the same across a business's drawings so that readers are not switching between conventions.

## Writing the numbers

Clause 8.2.4 is precise about numbers, because a misread number makes a wrong part:

- The decimal sign is a point.
- A value less than one has a zero before the point: **0.25**, not .25.
- Groups of three digits on either side of the point are separated by a space, not a comma: **2 500**, **2.498 5**.
- Whole numbers are written without a decimal point or trailing zeros: **50**, not 50.0.
- Dimensions are given to as many decimal places as the design requires, and no more.

Units are stated once, prominently: "DIMENSIONS IN MILLIMETRES". Where more than one unit is used, the main unit is stated in a note and the others are written beside their values.

Two further conventions from clause 8.2.5 help the reader. A dimension that is deliberately not to scale, typically after a late change, is underlined with a wide continuous line, so nobody tries to check it against the geometry. And an **auxiliary dimension**, given for information only, is placed in parentheses, carries no tolerance and does not govern acceptance or rejection of the part.

## Functional dimensioning

AS 1100.101 defines a functional dimension as one that directly affects the functioning of the product. The practical rule follows: dimension functional features directly, from the surfaces that locate them in use, so that their tolerance applies to the relationship that matters.

This is an illustration. The housing locates on the pump through its spigot face and spigot diameter. The bearing is pushed into the bore from the rear until it meets the shoulder, and the end cap clamps it there. The designer chose the functional origins accordingly:

- **Axial dimensions** for features that relate to the pump, such as the spigot length and flange thickness, are taken from the spigot face, because that face sits against the pump.
- **The bore depth to the shoulder** is taken from the rear face, because that is the face the end cap clamps against, and the clamping depends on the distance from the rear face to the shoulder.
- **Diameters and hole positions** are referred to the axis, which is established by the spigot and the bore together (Chapter 7 adds the geometric tolerance that makes this explicit).

```figure
type: svg
title: Axial dimensions on the housing, chosen by function
alt: Axial dimensions on the housing, chosen by function. 1. Spigot length 5: from the spigot face, which seats on the pump. 2. Flange thickness 12: from the flange front face, which carries the bolt load. 3. Body length 60: from the flange rear face to the rear face. 4. Bearing seat depth 18: from the rear face, against which the end cap clamps. 5. Overall length (77): auxiliary: 5 + 12 + 60, not toleranced, not for acceptance
caption: This is an illustration. The overall length is shown in parentheses as an auxiliary dimension because the chain already defines it.
viewbox: 0 0 640 373
body:
<path class="la draw" pathLength="1" d="M34 58.5V101.5"/>
<path class="la draw" pathLength="1" d="M34 129.5V172.5"/>
<path class="la draw" pathLength="1" d="M34 200.5V243.5"/>
<path class="la draw" pathLength="1" d="M34 271.5V314.5"/>
<g class="kf-a kd1">
<rect class="bx" x="58" y="14" width="562" height="61" rx="6"/>
<circle class="bxi" cx="34" cy="44.5" r="14"/>
<text class="txb" x="34" y="49.5" text-anchor="middle">1</text>
<text class="txb" x="74" y="36">Spigot length 5</text>
<text class="tx" x="74" y="57">from the spigot face, which seats on the pump</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="58" y="85" width="562" height="61" rx="6"/>
<circle class="bxi" cx="34" cy="115.5" r="14"/>
<text class="txb" x="34" y="120.5" text-anchor="middle">2</text>
<text class="txb" x="74" y="107">Flange thickness 12</text>
<text class="tx" x="74" y="128">from the flange front face, which carries the bolt load</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="58" y="156" width="562" height="61" rx="6"/>
<circle class="bxi" cx="34" cy="186.5" r="14"/>
<text class="txb" x="34" y="191.5" text-anchor="middle">3</text>
<text class="txb" x="74" y="178">Body length 60</text>
<text class="tx" x="74" y="199">from the flange rear face to the rear face</text>
</g>
<g class="kf-a kd4">
<rect class="bxa" x="58" y="227" width="562" height="61" rx="6"/>
<circle class="fa" cx="34" cy="257.5" r="14"/>
<text class="txb" x="34" y="262.5" text-anchor="middle">4</text>
<text class="txb" x="74" y="249">Bearing seat depth 18</text>
<text class="tx" x="74" y="270">from the rear face, against which the end cap clamps</text>
</g>
<g class="kf-a kd5">
<rect class="bx" x="58" y="298" width="562" height="61" rx="6"/>
<circle class="bxi" cx="34" cy="328.5" r="14"/>
<text class="txb" x="34" y="333.5" text-anchor="middle">5</text>
<text class="txb" x="74" y="320">Overall length (77)</text>
<text class="tx" x="74" y="341">auxiliary: 5 + 12 + 60, not toleranced, not for acceptance</text>
</g>
```

## Dimensioning for the inspector

Every dimension is a measurement someone must make. A dimension to a point that cannot be reached, such as the intersection of two chamfers or the centre of a hole hidden behind a flange, forces the inspector to measure something else and calculate. That adds error and argument. Where possible, dimension to surfaces and edges that exist on the part and can be reached with a gauge or probe. Where an imaginary point is unavoidable, AS 1100.101 asks for the projection lines to pass through it and allows it to be emphasised with a dot, so that at least the definition is unambiguous.

## The error: a chain and an overall, both toleranced

The housing's first issue showed the spigot length 5, the flange thickness 12 and the body length 60, and also the overall length 77, all as ordinary dimensions covered by the general tolerance note. Under the medium grade the business used (Chapter 7 explains the grades), those dimensions carry permissible deviations of:

- 5 mm: ±0.1
- 12 mm: ±0.2
- 60 mm: ±0.3
- 77 mm: ±0.3

The chain of three segments can vary by up to **0.1 + 0.2 + 0.3 = ±0.6 mm** in total, but the overall length is limited to **±0.3 mm**. A part can have every segment within tolerance and still fail the overall dimension, or meet the overall dimension only if the segments are held tighter than their own tolerances allow. The drawing contradicts itself.

The machine shop's programmer noticed and asked which dimension governed. That was the right question, and it exposed the error. The designer's fix was to decide which relationship mattered. Here, the overall length matters only for packaging, while the spigot length, flange thickness and bearing seat depth matter for fit. The overall length became an auxiliary dimension, **(77)**, in parentheses, untoleranced and not used for acceptance. AS 1100.101 clause 8.2.5.5 describes exactly this: where all the intermediate dimensions are given, the overall dimension should generally be auxiliary.

There was a second valid fix: keep the overall length as a real, toleranced dimension and remove the body length 60, leaving it to be the remainder. That would be the right choice if the overall length mattered more than the body length, for example because the housing had to fit between two fixed faces. The point is not which dimension is removed but that the designer decides, on the basis of function, rather than leaving the maker to choose.

The programmer found the conflict while preparing his in-process inspection sheet. Listing every dimension with its upper and lower limits, he noticed that the same length appeared twice: once as 77 ± 0.3 and once as the sum of three toleranced segments whose limits ran from 76.4 to 77.6. The nominal values agreed; the limits did not. Not every shop builds that list, and not every programmer would have stopped to ask. A designer who runs a simple stack, adding the tolerances along each chain and comparing them with any overall dimension, finds the same problem before release.

The general rule is that every dimension on a drawing is a requirement. Two requirements for the same distance are either identical, in which case one is redundant, or different, in which case one is wrong.

## Dimensioning hole patterns and threads

The housing's holes illustrate several conventions at once. The four flange holes are given as a count and size, "4 × Ø9", with their pitch circle diameter, Ø115, dimensioned on the end view, and their angular positions shown by centre lines at 90°. The four tapped holes are given as "4 × M6", with a thread depth and a drill depth using the depth symbol, on a Ø78 pitch circle, with their 45° offset from the flange holes dimensioned explicitly so that the relationship between the two patterns is not left to inference. The lubrication hole carries its angle in words as well as by dimension, for the reason Chapter 4 explained.

Repeated features may be shown once in full and the rest by centre lines only, under AS 1100.101 clause 9.3.1, which keeps the end views uncluttered. The count in front of the size, such as "4 ×", is what tells the reader how many there are.

## Exercise: fix the shaft dimensions

A drawing of a stepped shaft shows four diameters with lengths of 20, 35, 40 and 25 mm along the axis, all dimensioned in a chain from the left end, and also an overall length of 120 mm. The bearing seats are the 35 mm and 25 mm steps, and their axial positions control the bearing preload. What is wrong, and how should it be dimensioned?

**Worked answer.** The chain adds up to **20 + 35 + 40 + 25 = 120 mm**, so the overall length duplicates it. With general tolerances on all five dimensions, the drawing over-defines the length, exactly as on the housing.

Choose the functional origin first. The bearing seats' positions control preload, so the distance between the bearing shoulders is the critical dimension, and it should be given directly with its own tolerance rather than built up from several chained dimensions. A sound scheme is to dimension both bearing shoulders from one origin, usually one shoulder or one end face that locates the shaft, and to make the overall length auxiliary, **(120)**, or to omit one non-functional segment instead. The result gives each functional distance once, directly, with a tolerance that applies to the relationship that matters.
