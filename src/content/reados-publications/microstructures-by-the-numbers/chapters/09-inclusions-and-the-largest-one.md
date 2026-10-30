---
book: microstructures-by-the-numbers
chapterSlug: inclusions-and-the-largest-one
order: 9
title: "Inclusions and the largest one"
description: "Rating non-metallic inclusions on the right section, why their amount matters less than their largest size, estimating the largest inclusion by extreme values, and inclusions in tensile tests."
draft: false
---

Every steel contains non-metallic inclusions: particles of oxides, sulphides and silicates left from deoxidation and from the slag and refractories the steel met on its way to the mould. In a clean modern steel they occupy well under a tenth of a per cent of the volume, too little to change the strength. They matter because a fatigue crack, a brittle fracture or a lamellar tear starts at the worst place in the stressed volume, and the worst place is usually the largest inclusion in it. A measurement of how many inclusions there are on average answers the wrong question for those failures.

This chapter covers inclusion types and the chart-comparison ratings, the orientation rule, the extreme-value method that estimates the largest inclusion in a volume from a sample of small areas, and the effect of inclusions on tensile ductility across the working direction. Its error is a cleanliness rating made on a section that showed the stringers end-on.

## Kinds of inclusion

Inclusions are classed by composition and by how they behave when the steel is rolled or forged.

```figure
type: compare
title: Common inclusion types in wrought steel
rowhead: Type
cols: Behaviour in hot working | Appearance on a longitudinal section | Typical concern
caption: Rating charts group inclusions into types of this kind, commonly labelled sulphide, alumina, silicate and globular oxide. The types behave differently in working, so they look different on a longitudinal section and matter for different properties.
- Manganese sulphide | soft and plastic: drawn out into long stringers | grey, elongated, often many times longer than wide | transverse ductility, machinability (improved), lamellar tearing
- * Alumina | hard and brittle: broken up into strings of angular fragments | black angular particles in lines | fatigue initiation, especially in bearings and springs
- Silicates | deformable at rolling temperature: drawn out | dark, elongated | ductility, fatigue
- Globular oxides | hard and not deformed: stay round | round dark particles | fatigue if large
```

Sulphides are often present on purpose: free-machining steels contain extra sulphur so that manganese sulphide stringers break up the chips. A 42CrMo4 shaft steel is usually a normal or controlled-sulphur grade, and the drawing for Plant P's shaft calls for an inclusion rating within stated limits on each type.

## Rating by comparison charts

ASTM E45 and ISO 4967 rate inclusion content by comparing fields on a polished longitudinal section with standard chart images of each inclusion type at increasing severity. The worst field for each type, or the distribution of field ratings, is reported, depending on the method chosen. The methods are quick, widely used for acceptance and well understood by steelmakers, and their procedures and charts belong to the standards, not to this book. Three features of them matter for interpreting a result.

- They rate the **worst fields** in a defined area, so a rating depends on how much area was examined: the more area, the more likely a severe field.
- They are made on a **longitudinal** section, along the working direction, where elongated inclusions show their length.
- They group inclusions into **severity levels** by length or number per field, so a single very large inclusion and many moderate ones can rate similarly.

### Why the volume fraction says little

The volume fraction of inclusions can be measured by point counting or image analysis like any phase, but the fractions are so small that enormous areas are needed for precision: at a fraction of 0.0005, Chapter 3's arithmetic shows that independent points give a relative standard error of 10% only after about 200,000 points. More importantly, two steels with the same inclusion fraction can differ greatly in fatigue strength if one has its inclusions as a fine dispersion and the other has a few large ones. For fatigue-critical parts, the largest inclusion is the number that matters.

### Image analysis of inclusions

Automatic image analysis can measure every inclusion over a large polished area, sorting them by size, shape and grey level, and some systems add chemical analysis of each particle in a scanning electron microscope. These methods replace the subjective comparison with charts by counts and size distributions, and they are the practical way to examine the hundreds of square millimetres that a meaningful search for large inclusions needs. They inherit every preparation problem of Chapter 2, with one more: polishing can pull hard oxide inclusions out of the surface, leaving pits that the software counts as inclusions of the right size but that may also be pores or pull-out of something else. Inclusion analysis needs careful, short final polishing and a check of a sample of the detected particles by eye.

### What the steelmaking route says

Inclusion content is decided largely by how the steel was made: the deoxidation practice, ladle refining, calcium treatment to modify the shape of alumina and sulphides, vacuum degassing and the care taken to keep slag and refractory out of the moulds. A buyer cannot inspect those steps, but can ask for the route on the mill certificate and should expect a supplier to know it. A change of steel source, even to the same grade, changes the route and so can change the inclusion population, which is why Plant P examines the first bars from any new mill rather than relying on the grade name.

## The largest inclusion: an extreme-value estimate

A shaft journal's fatigue-critical zone contains far more steel than any laboratory can section. The question "how large is the largest inclusion in the journal?" therefore has to be answered by extrapolation from a sample, and the statistics of extremes provide the method.

The idea, developed for engineering use by Murakami among others, is to divide the inspected area into a number of equal **control areas** and to record only the largest inclusion in each. The size measure is the square root of the inclusion's projected area, √area, which captures the size that matters for a crack starting at the inclusion without depending on its exact shape. The maxima from many control areas follow, to a good approximation, the Gumbel distribution of largest values, whose cumulative probability is exp(−exp(−(x − λ) ÷ δ)), with a location λ and a scale δ.

Sorting the n maxima from smallest to largest and giving the j-th the reduced variate y = −ln(−ln(j ÷ (n + 1))) turns the Gumbel distribution into a straight line, x = λ + δ y. A straight line fitted to the plotted points gives λ and δ. The largest inclusion expected in an area S, which is T = S ÷ S₀ control areas, is then estimated as λ + δ × (−ln(−ln(1 − 1 ÷ T))), where T is called the return period.

### The shaft steel

The technician cut four longitudinal specimens from the established supplier's bar at mid-radius and placed five control areas of 100 mm² on each, 20 in all, recording the largest inclusion in each by √area under the microscope at 500×. The 20 maxima ranged from 8.4 to 22.3 µm.

```figure
type: line
title: Largest inclusion in each of 20 control areas, on Gumbel axes
x: Reduced variate y = −ln(−ln(j ÷ 21))
y: √area of the largest inclusion, µm
ymin: 0
ymax: 25
caption: This is an illustration. Twenty maxima, each the largest inclusion found in a 100 mm² control area, sorted and plotted against the Gumbel reduced variate. A straight line fits them well, with a location of 12.0 µm and a slope of 3.50 µm per unit of y; that line is extrapolated to estimate the largest inclusion in larger areas.
- -1.11 | 8.4
- -0.86 | 8.5
- -0.67 | 10.0
- -0.51 | 10.3
- -0.36 | 10.7
- -0.23 | 11.4
- -0.09 | 11.4
- 0.04 | 12.1
- 0.17 | 12.7
- 0.30 | 13.1
- 0.44 | 13.8
- 0.58 | 13.9
- 0.73 | 14.0
- 0.90 | 15.5
- 1.09 | 16.2
- 1.30 | 16.3
- 1.55 | 17.6
- 1.87 | 18.2
- 2.30 | 20.7
- 3.02 | 22.3
```

A least-squares line through the points gives λ = 12.0 µm and δ = 3.50 µm. The inspected area itself, 2,000 mm², is T = 20 control areas, and the line gives 12.0 + 3.50 × 2.970 = 22.4 µm, close to the largest value actually found, 22.3 µm, as it should be. Extrapolating to an area ten times larger, T = 200, gives 12.0 + 3.50 × 5.296 = **30.5 µm**, and to an area a hundred times larger, T = 2,000, gives 38.6 µm.

```figure
type: stats
title: Estimated largest inclusion against the area considered
caption: This is an illustration. Each tenfold increase in area adds only about 8 µm to the expected largest inclusion, because the Gumbel tail is exponential. The prediction is only as good as the assumption that the same population of inclusions continues into the larger area.
- 22.4 µm | largest expected in 2,000 mm², the area inspected
- 30.5 µm | largest expected in 20,000 mm²
- 38.6 µm | largest expected in 200,000 mm²
- 3.50 µm | Gumbel scale δ from the fit
```

How the estimate is used is a design question. A designer with a fatigue model that accepts a defect size can compare the predicted largest inclusion in the journal's stressed volume with the size the model allows. For Plant P's laboratory the more immediate use is comparison: the same procedure on the new supplier's bar gives a λ and δ that can be set beside the established supplier's, and a steel whose line lies well above the other's has larger inclusions where it counts, whatever its chart rating says.

### Limits of the method

The Gumbel extrapolation assumes the maxima all come from one population and that the population continues unchanged into the larger area. A steel with a rare second population of very large inclusions, such as exogenous slag or refractory particles, will show it only if the sample happens to catch one, and then as a point far above the line. Such a point should never be discarded as an outlier without investigation, because it may be the most important result in the measurement.

### Choosing the control area

The control area is a choice, and it affects the fitted λ and δ though not, if the method is working, the extrapolated largest inclusion in a given large area. A control area should be large enough to contain a clear maximum, so that the largest inclusion in it is not just a speck at the detection limit, and small enough that 20 to 40 of them can be examined in reasonable time. Keeping the same control area, magnification and size measure from one steel to the next is what makes the comparisons meaningful.

## Inclusions and ductility across the working direction

Elongated sulphide and silicate stringers barely affect strength or ductility when a part is loaded along them, but they act as planes of weakness when it is loaded across them. A tensile test on a specimen cut transverse to the bar's axis therefore shows lower elongation and, especially, lower reduction of area than a longitudinal one from the same steel.

The [tensile test evaluation tool](/tools/tensile-test-evaluation/) calculates, from the readings of a round specimen test, the yield strength from the 0.2% offset load, the tensile strength, the elastic modulus from a load and extension in the elastic range, the elongation after fracture, the reduction of area from the fracture diameter, the true fracture stress and strain, and the ratio of yield to tensile strength, and checks them against minimum values the user enters. It evaluates the test; it says nothing about inclusions directly, which is why it complements rather than performs this chapter's method. It also reminds the user that elongation is valid only if the specimen broke within the middle part of its gauge length.

The laboratory tested one longitudinal and one transverse specimen, 10 mm in diameter with a 50 mm gauge length, from the established supplier's bar, and entered both against the drawing's longitudinal minimums of 650 MPa yield, 900 MPa tensile and 12% elongation.

```figure
type: compare
title: Longitudinal and transverse tensile tests on the shaft bar
rowhead: Specimen
cols: Yield | Tensile | Elongation | Reduction of area | Tool result against the longitudinal minimums
caption: This is an illustration. Strength is almost the same in both directions; ductility is not. The transverse reduction of area, 45% against 64%, is the clearest sign of elongated inclusions. The drawing's minimums apply to longitudinal specimens, so the transverse fail is information about the steel, not a rejection.
- Longitudinal | 750 MPa | 950 MPa | 16% | 64% | meets specification
- * Transverse | 745 MPa | 945 MPa | 11% | 45% | elongation below 12%
```

For a shaft loaded mainly along its axis, the transverse result does not threaten function, but it confirms the inclusion picture and would matter for a part loaded across the working direction, such as a flange forged from bar or a plate welded through its thickness.

## The error: rating stringers end-on

The new supplier's shaft certificate gave an excellent inclusion rating, and the first check in Plant P's laboratory agreed: the technician rated the transverse disc already cut for the grain size and hardness work and found only small dark dots, rating the steel among the cleanest the laboratory had seen.

The engineer pointed out that the rating had been made on the wrong section. On a transverse section, sulphide and silicate stringers appear only as their small cross-sections, so they look like scattered fine dots and rate as almost nothing. The rating methods specify a longitudinal section for exactly this reason. Repeated on a longitudinal specimen from mid-radius, the same steel showed sulphide stringers up to several hundred micrometres long, rating within the drawing's limits but several severity levels worse than the transverse rating had suggested. The supplier's certificate, it turned out, had been correct and made on a longitudinal section; the laboratory's first check had not.

The lesson repeats Chapter 2's: the orientation of the section is part of the measurement. The laboratory's procedure now names the section for every quantity it reports, and the inclusion rating form has a box for "section orientation" that must be filled before the result is accepted.

## How this applies to a small Australian business

For parts where fatigue or toughness matters, ask the steel supplier for an inclusion rating made to a named standard on a longitudinal section, and recognise that the rating describes typical and worst fields in the area examined, not the largest inclusion in your part. If the largest inclusion matters, an extreme-value estimate from control areas gives a number that can be compared between steels. Remember too that inclusions cost ductility across the working direction, and that a part loaded that way needs transverse properties in its specification.

## Exercise: comparing two steels

The new supplier's bar is examined with the same 20 control areas of 100 mm² each. The Gumbel fit gives λ = 13.5 µm and δ = 5.2 µm. (a) What is the expected largest inclusion in 20,000 mm² (T = 200, y = 5.296)? (b) How does it compare with the established supplier's 30.5 µm? (c) Which parameter causes most of the difference?

**Worked answer.** (a) 13.5 + 5.2 × 5.296 = 13.5 + 27.5 = **41.0 µm**. (b) It is about **10.5 µm larger**, roughly a third larger than the established supplier's estimate. (c) The **scale δ**. The location differs by only 1.5 µm, so the typical maxima are similar, but the larger scale means the new supplier's maxima spread further, so its tail, and therefore its largest inclusion in a big volume, is much worse. A comparison of chart ratings or of average inclusion content might not reveal this at all.
