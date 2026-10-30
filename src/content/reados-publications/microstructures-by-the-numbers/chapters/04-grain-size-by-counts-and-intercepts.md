---
book: microstructures-by-the-numbers
chapterSlug: grain-size-by-counts-and-intercepts
order: 4
title: "Grain size by counts and intercepts"
description: "Measuring grain size by counting grains in a known area or boundaries crossed by test lines, converting both to the ASTM grain size number, and the precision of each."
draft: false
---

Grain size is the most widely specified microstructural quantity in steel. Finer grains raise yield strength and toughness and lower the temperature at which steel turns brittle; coarse grains raise hardenability and may be wanted in some electrical and creep-resisting steels. Drawings and material standards therefore call for a grain size number, and a laboratory must turn a picture of a grain network into that number.

This chapter explains the ASTM grain size number, the planimetric method that counts grains in a known area, the intercept method that counts where test lines cross boundaries, and how precisely each can be done. Its error is a grain size that looked coarse because the boundaries had not been fully revealed.

## Which grains?

A steel can contain several grain structures at once, and a requirement must say which it means. In a ferritic–pearlitic steel the ferrite grains are visible after an ordinary nital etch. In a quenched and tempered steel such as the 42CrMo4 pump shaft, the structure is tempered martensite, and the grains that matter are the **prior austenite grains**: the grains of austenite that existed at the hardening temperature, before the steel was quenched. Their boundaries control the toughness of the hardened steel, and they are what "grain size" means in most specifications for hardened and tempered parts.

Prior austenite boundaries are not visible after a nital etch, which shows the martensite laths and packets within the old grains. They are revealed by special etchants, commonly based on picric acid with a wetting agent, that attack the phosphorus and other elements segregated at the old boundaries. Getting a complete network of prior austenite boundaries is often the hardest part of the job, and the error later in this chapter comes from exactly that difficulty.

## The grain size number

The ASTM grain size number G, defined in ASTM E112, is a logarithmic scale. Its original definition is that at a magnification of 100×, one square inch of image contains 2^(G−1) grains. Each step of one in G therefore halves the area of an average grain. G = 1 corresponds to one grain per square inch at 100×, a coarse structure; G = 8 corresponds to 128 grains per square inch at 100×, a fine one.

The same scale is written in metric quantities: the number of grains per square millimetre of actual specimen, N_A, and the mean lineal intercept length, ℓ̄, the average distance between boundaries along a straight test line. ASTM E112 gives the conversions, which the WORKOS grain size tools use.

```figure
type: formula
title: The grain size number and its two metric forms
formula: N (per in² at 100×) = 2^(G − 1)     G = 3.3219 log₁₀ N_A − 2.954     G = −6.6439 log₁₀ ℓ̄ − 3.288
caption: N_A is grains per square millimetre of specimen (at 1×) and ℓ̄ is the mean lineal intercept length in millimetres. The constants convert the original inch-based definition to metric units. One grain per square inch at 100× equals about 15.5 grains per square millimetre at 1×.
- G | ASTM grain size number, larger for finer grains
- N_A | grains per mm² of specimen surface
- ℓ̄ | mean lineal intercept length, mm
step: Planimetric count on the shaft: N_A = 1,012.5 per mm², so G = 3.3219 × 3.0054 − 2.954 = 7.03
step: Intercept count on the shaft: ℓ̄ = 0.02778 mm, so G = −6.6439 × (−1.5563) − 3.288 = 7.05
```

The [grain size tool](/tools/grain-size/) converts any one of three measurements, grains per square inch at 100×, grains per square millimetre at 1× or the mean lineal intercept length in micrometres, into G and the equivalent values of the other two. It assumes equiaxed grains and reminds the user to report the method and the number of fields with the result.

## The planimetric method

The planimetric method, often called Jeffries' method, counts the grains inside a test area of known size. A circle is drawn on the image, its true area on the specimen worked out from the magnification, and the grains counted. Grains entirely inside the circle count as one each; grains cut by the circle's edge count as one half each, on average, since the circle passes through them somewhere between their edge and their centre. The number of grains per square millimetre is the total count divided by the true area.

The count should include enough grains to be meaningful, usually at least 50, so the magnification is chosen to put that many grains inside the circle. For the shaft, the technician photographed the transverse disc at 250×, calibrated with the stage micrometer, and drew a circle of 5,000 mm² on the image. Its true area on the specimen is 5,000 ÷ 250² = 0.08 mm².

```figure
type: steps
title: A planimetric count on the pump shaft
caption: This is an illustration. One field at 250×. The count of 81 grains is comfortably above the usual minimum of about 50, and the result, G 7.03, sits well inside the requirement of G 5 or finer.
- Calibrate | 250× confirmed with the stage micrometer
- Draw the test circle | 5,000 mm² on the image, 0.08 mm² on the specimen
- Count grains wholly inside | 64
- Count grains cut by the circle | 34, counted as 17
- Total and density | 81 grains in 0.08 mm²: N_A = 1,012.5 per mm²
- * Grain size number | G = 7.03 from the grain size tool, equivalent intercept 28.0 µm
```

## The intercept method

The intercept method, often called Heyn's method, lays test lines across the image and counts where they cross grain boundaries. The number of grains crossed, or **intercepts**, per unit true length of line gives the mean lineal intercept length directly: ℓ̄ is the true line length divided by the number of intercepts. Straight lines, circles or a pattern of both can be used; circles avoid the bias of straight lines in one direction and the awkward decisions at line ends.

On the same shaft disc, the technician applied a test pattern with a total length of 500 mm on images at 100×, a true length of 5 mm, over several fields, and counted 180 intercepts. The mean lineal intercept is 5 ÷ 180 = 0.02778 mm, or 27.8 µm, and the grain size tool gives G = 7.05.

ASTM E112 sets out counting rules for awkward cases, such as a line that ends inside a grain, touches a boundary tangentially or passes through a junction of three grains. These rules matter for the last few per cent of accuracy, and a laboratory should follow the standard's rules exactly so that its results compare with others.

### Why the intercept method is more fundamental

The intercept length has a direct physical meaning that the grain count lacks. Chapter 1 noted that the boundary area per unit volume of a structure, S_V, equals twice the number of boundary crossings per unit length of a randomly oriented test line. Each intercept is one crossing, so S_V = 2 ÷ ℓ̄ whatever the grains' shape. For the shaft, S_V = 2 ÷ 0.02778 = 72 mm² of boundary in every cubic millimetre of steel. The grain count, by contrast, relates to grain size in three dimensions only through an assumed grain shape, which is built into the conversion constants. That is why the planimetric and intercept methods give slightly different values of G on the same structure, as they did here, 7.03 against 7.05, and why a difference of a tenth of a grain size number between them is no cause for concern.

```figure
type: compare
title: Planimetric and intercept methods compared
rowhead: Feature
cols: Planimetric (grain count) | Intercept (boundary crossings)
caption: Both methods are standard and give closely similar results for equiaxed grains. The intercept method is usually quicker by hand, copes better with elongated grains and relates directly to the boundary area per volume.
- What is counted | grains in a known area | grains crossed by test lines of known length
- Basic result | N_A, grains per mm² | ℓ̄, mean intercept length
- Physical meaning | depends on an assumed grain shape | gives S_V = 2 ÷ ℓ̄ without a shape assumption
- Elongated grains | needs care; one area count hides the shape | count lines in several directions and report each
- * Speed by hand | slower, every grain must be ticked off | faster, only crossings are counted
- Incomplete boundary network | missing boundaries merge grains, coarsening G | missing boundaries drop crossings, coarsening G
```

## How precise is one count?

A grain count is a count of discrete things, and its scatter can be judged by counting statistics. If grain counts scattered like random Poisson counts, the relative standard error of a count of N grains would be 1 ÷ √N. For 81 grains that is 11%, and since G changes by 1 ÷ ln 2 = 1.443 for each unit change in the natural logarithm of the count, an 11% count error corresponds to about 0.16 in G for one field. Grains fill space and are more regular than random points, so real field-to-field scatter in a uniform structure is usually somewhat smaller, but real structures also vary from place to place, which adds scatter back.

The practical answer is the same as for phase fractions: measure several fields placed systematically, compute G or the count for each, and use their scatter. Averaging five fields like the one above would cut the error to about 0.16 ÷ √5 = 0.07 in G, which is ample when the requirement is a range several numbers wide. Chapter 5 turns several field readings into an acceptance decision.

### Elongated grains

Rolled or forged material may have grains elongated in the working direction. A single grain count hides that, and test lines in one direction give a value that depends on the direction. For such material the intercept method is applied with lines in the longitudinal, transverse and through-thickness directions, each reported separately, and an overall value obtained from them. The prior austenite grains of the quenched and tempered shaft were re-formed during austenitising and are close to equiaxed, which the technician confirmed by counting intercepts on lines parallel and perpendicular to the bar axis on a longitudinal specimen: the two intercept lengths differed by less than 5%.

## Image analysis

Grain size can be measured automatically once the boundaries are a clean, closed network in the image. The software then finds each grain, counts them and measures their areas, giving not only N_A but a distribution of grain areas. ASTM E1382 covers grain size measurement by semi-automatic and automatic image analysis. The weak step is the image itself: an incomplete etch leaves gaps in the network, and the software joins grains across the gaps, while scratches and inclusions can split grains that are really one. Every automatic grain size should be checked against a manual count on a few fields of the same specimen, and the image should be inspected for an unbroken network before any measurement is trusted.

## Comparison charts

Before counting methods became routine, grain size was estimated by comparing the image at a standard magnification with a set of chart images of known G, and comparison is still used for quick checks in production. It is fast and, for an experienced eye on a uniform equiaxed structure, usually within about one grain size number. It is less reliable for structures that differ in appearance from the chart images, for duplex structures and for elongated grains, and its result cannot be given a standard error from the measurement itself. A comparison rating is a reasonable screening result; a value close to a specification limit, or one in dispute, should be confirmed by a planimetric or intercept count.

## The error: a grain size that was really an incomplete etch

The first shaft from a new supplier came to the laboratory with a request for a grain size check, as its certificate gave no prior austenite grain size. The technician etched the transverse disc with the laboratory's usual picric acid etchant, counted intercepts over the same 5 mm of true line length and found 120 intercepts. The mean intercept length was 5 ÷ 120 = 41.7 µm, and the grain size tool gave **G 5.88**, inside the requirement of G 5 or finer but close enough to its limit to prompt a query to the supplier.

The engineer, reviewing the images before the query went out, noticed that many grains in them were outlined only on two or three sides, with the network fading out in places. Some of the "grains" were plainly two or three grains whose dividing boundaries had not etched. The intercept count had missed every boundary that the etch had not revealed, and every missing boundary makes the structure look coarser.

The technician re-etched the disc with a longer etch, a little wetting agent and gentle swabbing, and the network closed up almost completely. The recount over the same 5 mm gave 180 intercepts, a mean intercept of 27.8 µm and **G 7.05**, the result given earlier in this chapter. The query to the supplier was withdrawn. The laboratory now records, for every grain size, an estimate of the fraction of boundaries revealed, and does not report a value when the network is visibly incomplete.

```figure
type: compare
title: The same shaft disc etched twice
rowhead: Etch
cols: Intercepts on 5 mm | Mean intercept | Grain size G
caption: This is an illustration. The incomplete etch missed a third of the boundaries. Because a missing boundary always merges grains, an incomplete etch biases the result towards coarse grains and can never make them look finer.
- * Usual etch, network incomplete | 120 | 41.7 µm | 5.88
- Longer etch with wetting agent, network closed | 180 | 27.8 µm | 7.05
```

The episode also shows why a grain size result should never be read in isolation from its image. A number alone cannot reveal an incomplete etch, while a single glance at the micrograph usually can.

## How this applies to a small Australian business

If a drawing or order calls for a grain size, say which grains: ferrite grains, prior austenite grains, or austenite grains in a stainless steel. Ask the laboratory for the method, the magnification, the number of fields and the field-to-field spread, and if possible for one of the images, so that you can see whether the boundary network is complete. A grain size close to a coarse limit deserves a look at the etch before anyone blames the steel.

## Exercise: what to expect at the limit

The shaft requirement is G 5 or finer. (a) What are the grains per square millimetre and the mean intercept length at exactly G 5? (b) A technician uses a planimetric circle of 5,000 mm² on an image at 100×. About how many grains would that circle contain for steel at G 5, and is it enough for a count?

**Worked answer.** (a) At G 5 there are 2⁴ = 16 grains per square inch at 100×, which is 15.5 × 16 = **248 grains per mm²** at 1×. The mean intercept length is 10^(−(5 + 3.288) ÷ 6.6439) mm = **56.6 µm**, as the grain size tool shows. (b) The circle's true area is 5,000 ÷ 100² = 0.5 mm², so it would contain about 248 × 0.5 = **124 grains**, well above the minimum of about 50. A higher magnification would show the boundaries more clearly but leave fewer grains to count, so 100× is a reasonable choice for a structure this coarse.
