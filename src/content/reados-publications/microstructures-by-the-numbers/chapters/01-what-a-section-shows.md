---
book: microstructures-by-the-numbers
chapterSlug: what-a-section-shows
order: 1
title: "What a section shows"
description: "How a flat polished section samples a three-dimensional structure, which quantities it shows without bias, which it distorts, and why one worst-looking field misleads."
draft: false
---

A metallographer never sees a microstructure. What reaches the eye is a flat, polished slice through it, a few square millimetres of a part that may weigh many kilograms, viewed through a microscope one small field at a time. The grains, nodules, pores and inclusions in that slice are cuts through solid objects whose real sizes, shapes and connections lie above and below the plane. A good measurement starts from knowing exactly what such a slice can and cannot tell.

This chapter sets out the geometry of sectioning, the quantities that a section shows faithfully and those it distorts, and the scale of what the microscope actually looks at. Its error is the most common one in any laboratory: a report built on the single field that looked worst.

## A slice through three dimensions

Cutting a solid with a plane removes one dimension from everything in it. A grain or a pore, which occupies a volume, shows up as an area. A grain boundary, which is a surface, shows up as a line. A dislocation line or the edge where three grains meet shows up as a point. Anything that is itself a point in space, such as the centre of a particle, almost never lies exactly in the plane and is not seen at all.

```figure
type: compare
title: What a plane section does to each kind of feature
rowhead: Feature in the solid
cols: Seen in the section as | Example | What can be measured directly
caption: Each feature loses one dimension in the section. Features that are points in the solid are invisible; their number must be inferred from the features that carry them.
- Volume, such as a phase, pore or particle | an area | ferrite, graphite, a shrinkage pore | area fraction, section sizes
- Surface, such as a grain or phase boundary | a line | grain boundaries in steel | boundary length per unit area
- Line, such as a triple junction or a crack front | a point | where three grains meet | points per unit area
- * Point, such as a particle centre | nothing | the number of nodules per volume | only by inference from sections
```

That last row is the source of much confusion. The number of graphite nodules in each cubic millimetre of a casting is a real and useful property, but no section shows it. A section shows the number of nodules cut per square millimetre, which depends on both how many there are and how big they are, because a large nodule is more likely to be cut by a given plane than a small one. Chapter 6 deals with that relation in detail.

## The quantities a section shows faithfully

The great simplification of quantitative metallography is that some quantities pass through the section without bias. The best known is the volume fraction of a phase. If a structure is sampled by sections placed at random through it, the average fraction of section area occupied by a phase equals its volume fraction. The same value is obtained from the fraction of a test line that falls in the phase, and from the fraction of a grid of test points that land in it. The principle was stated for rocks by the geologist Delesse in the nineteenth century and extended to lines and points later; it is the foundation of every phase fraction in this book.

```figure
type: formula
title: The fraction relations of stereology
formula: V_V = A_A = L_L = P_P     (each as an expected value over randomly placed sections, lines or points)
caption: The relation holds on average for unbiased sampling and does not need the phase to have any particular shape. It is what allows a two-dimensional measurement to give a three-dimensional answer. Chapter 3 uses the last form, point counting, because it is the quickest to do and the easiest to give an error for.
- V_V | volume fraction of the phase in the solid
- A_A | area fraction of the phase in the section
- L_L | fraction of the length of test lines lying in the phase
- P_P | fraction of test points falling in the phase
step: Casing matrix: 160 of 500 grid points fell in pearlite, so P_P = 0.32 and the estimated pearlite volume fraction of the matrix is 0.32
```

Two other quantities also pass through without needing any shape assumption. The surface area of boundaries per unit volume equals twice the number of boundary crossings per unit length of a randomly oriented test line, and the length of lines per unit volume equals twice the number of line crossings per unit area of section. Grain size, in Chapter 4, rests on the first of these: counting where a test line crosses grain boundaries measures how much boundary there is, and so how fine the grains are.

### The catch: random sampling

All of these hold only for sections that sample the structure without bias. In practice that means two things. The position of the section and of the fields within it must not be chosen by what they show, and, where the structure has a direction, the orientation of the section or test lines must be chosen deliberately. Rolled steel has inclusions drawn out along the rolling direction and grains that may be elongated; a casting has columnar grains growing in from the mould walls and coarser structure at its thermal centre. A section in one orientation, or at one place, gives a true answer for that orientation or place and not necessarily for the part. Chapter 2 turns these requirements into a sampling plan.

## What a section distorts

Other properties do not survive the section intact. Each needs either an assumption about shape or a different measurement.

- **Size.** A plane through a sphere cuts it in a circle no larger than the sphere's diameter and usually smaller. Only planes through the centre show the full size. Sections of identical spheres therefore show a spread of circle sizes, most of them smaller than the spheres.
- **Number.** Large particles are hit more often than small ones, so the sections over-represent the large particles and the number per area reflects size as well as number.
- **Connectivity.** Two pores that look separate in the section may join above or below it, and a network that looks broken may be continuous. Whether porosity forms a leak path through a wall cannot be seen in one section.
- **Shape and orientation.** An elongated inclusion looks like a long streak when the section lies along it and like a small dot when the section crosses it.

```figure
type: svg
title: Identical spheres cut by one plane
alt: Three equal circles representing spheres seen from the side, with a horizontal line representing the plane of polish. The first sphere is cut through its centre, the second slightly above its centre and the third further from its centre. Below, three filled discs show the sections: the first is as wide as the sphere, the second a little narrower and the third narrower still.
caption: Three spheres of the same size, 80 units across, cut by one plane at different distances from their centres. The sections measure 80, 69 and 53 units. A section can never be larger than the particle, and is usually smaller, so the average section underestimates the particle. Chapter 6 shows that for spheres of one size the mean section diameter is π ÷ 4, or about 0.785, of the true diameter.
viewbox: 0 0 560 330
body:
<circle class="bx" cx="110" cy="120" r="40"/>
<circle class="bx" cx="280" cy="100" r="40"/>
<circle class="bx" cx="450" cy="150" r="40"/>
<path class="la" d="M30 120H530"/>
<text class="txs tx" x="34" y="112">plane of polish</text>
<rect class="bxa" x="70" y="232" width="80" height="16" rx="8"/>
<rect class="bxa" x="245" y="232" width="69" height="16" rx="8"/>
<rect class="bxa" x="424" y="232" width="53" height="16" rx="8"/>
<text class="txs tx" x="88" y="280">80 wide</text>
<text class="txs tx" x="256" y="280">69 wide</text>
<text class="txs tx" x="425" y="280">53 wide</text>
<text class="txb" x="170" y="315">Sections as seen on the polished face</text>
<path class="li flow" d="M110 160V222M280 140V222M450 190V222"/>
```

## Sections, projections and fracture faces

Not every image of a microstructure is a section. The distinction matters because the relations in this book apply only to true plane sections.

A **polished section** is a plane, and features in it have zero thickness. Everything in this book assumes this kind of image. A **thin foil** or a thick slice viewed in transmitted light or in a transmission electron microscope is a projection: everything within its thickness is superimposed. In a projection, particles overlap and hide each other, and small particles appear in greater numbers than in a section of the same area because the slice has depth. Area fractions measured on projections overstate volume fractions, by an amount that depends on the slice thickness and the particle size. A **fracture face** or an etched-out deep relief is not a plane at all. A fracture runs preferentially through weak features, so a fracture face shows far more inclusions or pores than a random plane would, which makes it excellent for finding the cause of a failure and useless for estimating how common that cause is.

The same distinction applies to non-destructive images. A radiograph is a projection of the whole wall thickness, and the porosity it shows cannot be compared directly with porosity measured in a section. Computed tomography reconstructs the volume itself and avoids the sectioning problems altogether, but at a resolution limited by the size of the part, so in a casting the size of Plant P's it resolves pores of a fraction of a millimetre and misses the micrometre-scale structure that the microscope shows.

## Which numbers need a model

It helps to sort every quantity in a metallographic report by what it assumes. Some follow from the section alone, given unbiased sampling. Others need a model of particle shape or a statement about orientation, and their accuracy is only as good as that model.

```figure
type: compare
title: What each common measurement assumes beyond unbiased sampling
rowhead: Measurement
cols: Extra assumption | Chapter
caption: Quantities in the first group are safe whatever the shape of the features. Those in the second are correct only as far as their model is, so a report should state the model it used.
- Phase or porosity volume fraction | none | 3 and 8
- Grain boundary area per volume, and hence the intercept grain size | none if test lines are randomly oriented; otherwise holds for the orientation used | 4
- Number of grains per area in a section | none, as a section property; converting it to grains per volume needs a shape model | 4
- * Particle or pore size distribution in the solid | particles of known shape, usually spheres | 6 and 8
- Number of particles per volume | particle shape and size distribution | 6
- Largest inclusion in a volume | a distribution for the largest values, usually Gumbel | 9
```

The practical rule is simple. Report section quantities as section quantities, with their sampling, and present anything three-dimensional as an estimate under a stated model. A report that says "nodule count 200 per mm²" makes a correct statement about the section. A report that says "200 nodules per mm³" has made a units error, and one that says "about 6,700 nodules per mm³, assuming spheres of one size" has made a model-based estimate and said so.

## The scale of a field

It is easy to forget how little of a part the microscope sees. Plant P's camera captures a field 1.60 mm wide and 1.20 mm high at 100× magnification, an area of 1.92 mm². At 200× the field is a quarter of that, 0.48 mm², and at 500× it is 0.0768 mm². A polished specimen cut from the casing flange measures 28 by 24 mm, or 672 mm², so a single field at 200× covers well under a thousandth of the face, and the face itself is one plane through a flange that holds several hundred cubic centimetres of iron.

```figure
type: bars
title: Area of one camera field at each magnification
unit: mm²
caption: This is an illustration. Plant P's camera field is 1.60 by 1.20 mm at 100× and scales with the inverse square of magnification. Doubling the magnification shows a quarter of the area, so a measurement at high magnification needs many more fields to cover the same ground.
- 50× | 7.68
- 100× | 1.92
- * 200× | 0.48
- 500× | 0.0768
```

The choice of magnification is a compromise. It must be high enough that the features of interest are many pixels across, so that their boundaries are located well, and low enough that each field contains enough of them to count. A useful rule is to choose the lowest magnification at which the smallest feature that matters is still clearly resolved, and then to measure enough fields to reach the precision needed, which Chapter 3 shows how to calculate.

### Calibrating the scale

Every length in a metallographic report depends on the scale of the image, which is set by the objective, any intermediate optics and the camera. Nominal magnifications are not accurate enough for measurement. Plant P's technician calibrates each objective by photographing a stage micrometer, a glass slide ruled with a 1 mm scale in 10 µm divisions, and entering the measured number of pixels per micrometre into the image analysis software. The calibration is repeated after any change to the optics and checked monthly. An error of 3% in the scale becomes a 3% error in every length and a 6% error in every area.

## The error: the worst field

When the first leaking casing reached the laboratory, the technician sectioned its flange across the leak path, polished the section, and searched it under the microscope until finding the region of greatest porosity. That field, photographed at 100×, showed a cluster of irregular cavities covering 5.6% of its area. The draft report stated that the flange contained 5.6% porosity.

The engineer who read the report asked how the field had been chosen. The 5.6% was a true measurement of one field, but the field had been chosen because it was the worst, so it said nothing about the flange as a whole. A picture of the worst field is useful: it shows what the defect looks like and where to look. A number from it is not an estimate of anything.

The technician repeated the measurement on 30 fields placed on a regular grid, 4 mm apart, starting from a randomly chosen point, across the whole flange section. The average porosity was 0.8%, with the porous fields concentrated near the junction between the flange and a thick boss, and almost none elsewhere. Chapter 8 follows that result to its cause.

The corrected report kept the photograph of the worst field, labelled as the worst field found in a search, alongside the systematic result and a sketch of the section showing where the porous fields lay. That combination answered three different questions at once: what the defect looked like, how much of it there was on average, and where it was concentrated. The third answer turned out to matter most, because porosity concentrated at one junction points to a feeding problem in the casting process, while porosity spread evenly through a section points to gas. A single number, however carefully measured, would have hidden that pattern.

```figure
type: stats
title: Two answers to "how porous is the flange?"
caption: This is an illustration. Both numbers are correct measurements of what was measured. Only the second is an estimate of the flange's porosity, because only its fields were placed without looking at what they showed.
- 5.6% | porosity in the single field chosen because it looked worst
- 0.8% | average porosity over 30 systematically placed fields
- 30 | fields on a 4 mm grid from a random start
- 1 | junction where the porous fields were concentrated
```

## How this applies to a small Australian business

Whether a business runs its own microscope or sends parts to a laboratory, it should ask how every number in a report was obtained: which section, which orientation, how many fields, and how they were placed. A report that gives a single field, or fields described as representative, gives a picture rather than a measurement. Ask also whether the image scale was calibrated with a stage micrometer and when. These questions cost nothing and catch most of the errors that matter, and accredited laboratories will answer them as a matter of course.

## Exercise: size bias in a nodule count

A casting contains equal numbers per cubic millimetre of two kinds of graphite particle: small spheres 10 µm across and large spheres 40 µm across. (a) On a random section, in what ratio will the large and small particles appear? (b) For the large spheres, what fraction of their sections will look smaller than 20 µm across, given that the fraction of sections of a sphere of diameter D smaller than x is 1 − √(1 − (x ÷ D)²)?

**Worked answer.** (a) A sphere is cut by a plane if its centre lies within half a diameter of the plane on either side, so the chance of being cut is proportional to the diameter. With equal numbers per volume, the large spheres appear **4 times** as often as the small ones, 40 ÷ 10, even though there are equally many of each. (b) x ÷ D = 20 ÷ 40 = 0.5, so the fraction is 1 − √(1 − 0.25) = 1 − 0.866 = **0.134**. About one section in seven of a 40 µm sphere looks smaller than 20 µm, and would be mistaken for a much smaller particle by anyone reading the section at face value.
