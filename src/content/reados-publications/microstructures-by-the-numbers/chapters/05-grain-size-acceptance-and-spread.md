---
book: microstructures-by-the-numbers
chapterSlug: grain-size-acceptance-and-spread
order: 5
title: "Grain size acceptance and spread"
description: "Turning several field readings into one grain size result, averaging correctly, judging field-to-field spread, recognising duplex structures and writing a defensible acceptance decision."
draft: false
---

One field gives one grain size reading. A result that can be used to accept or reject material comes from several fields, and turning them into a decision raises three questions. How should the readings be averaged? How much should they be allowed to differ? And what does it mean when one field is very different from the rest? The answers decide whether a laboratory accepts a steel with a hidden coarse-grained region or rejects a good one because of a single odd field.

This chapter turns field readings into an average grain size, a confidence interval and a spread, and shows how to recognise a duplex structure. Its error is an acceptance that relied on the average and missed what the spread was saying.

## Averaging field readings

There are two ways to average five fields. One is to average the measured quantity, the intercept lengths or the grain counts, and convert the average to a grain size number. The other is to convert each field to G and average the G values. Because G is a logarithm of the count, the two give slightly different answers, and the difference grows as the fields become more different.

ASTM E112 averages the measurements and converts the average, and that is what the [grain size acceptance tool](/tools/grain-size-acceptance/) does. It takes up to five field readings in any of the three forms, averages them, converts the average to G and to the equivalent count and intercept length, works out G for each field separately, and reports the spread between the coarsest and finest fields. It then checks the average against the specified range of G and the spread against the largest spread the user will accept, warning of a possible duplex structure when the spread is too large.

### The shaft's five fields

For the shaft from Plant P's established supplier, the technician measured the mean lineal intercept on five systematically placed fields of the transverse disc. The drawing requires G 5 or finer, with no upper limit, so the technician entered a finest limit of G 12 to leave the upper check open, and the laboratory's own rule of a spread of no more than 1.0 grain size number between fields.

```figure
type: compare
title: Five intercept readings on the shaft
rowhead: Field
cols: Mean intercept | Field G
caption: This is an illustration. Fields placed on a grid from a random start across the through-hardened core of the transverse disc. The field values vary by under half a grain size number, normal scatter for a uniform structure.
- 1 | 27.8 µm | 7.05
- 2 | 29.5 µm | 6.88
- 3 | 26.4 µm | 7.20
- * 4 | 31.2 µm | 6.72 (coarsest)
- 5 | 28.0 µm | 7.03
```

The tool reports an average intercept of 28.6 µm and a grain size of **G 6.97**, with the coarsest field at 6.72 and the finest at 7.20, a spread of 0.48. Both checks pass and the verdict is accept. Averaging the five G values instead gives 6.974, practically the same, because the fields are so similar.

## How sure is the average?

The spread of the five field values also gives the precision of the average. The field G values have a standard deviation of 0.183, so the standard error of their mean is 0.183 ÷ √5 = 0.082, and a 95% confidence interval uses Student's t of 2.776 for four degrees of freedom: 6.97 ± 2.776 × 0.082, or about **6.74 to 7.20**. The whole interval is more than one and a half grain size numbers finer than the limit of 5, so the decision is not close.

```figure
type: stats
title: The shaft's grain size result
caption: This is an illustration. The confidence interval is calculated from the scatter of the field G values with Student's t for four degrees of freedom. Five fields give a narrow interval because the structure is uniform; a less uniform structure would need more.
- G 6.97 | average grain size from the average intercept of 28.6 µm
- 0.48 | spread between the coarsest and finest field
- 0.183 | standard deviation of the field G values
- 6.74 to 7.20 | 95% confidence interval for the average G
```

Five fields is a modest number. It is enough here because the structure is uniform and the result is far from the limit. When fields vary more, or the average is close to a limit, the same arithmetic shows how many more fields are needed: with a field standard deviation of 0.4 in G and a wish to know the average within ±0.2 at 95% confidence, about 16 fields are needed, by the same reasoning as Chapter 3.

## Where on the part the grains are measured

Grain size can vary with position in a part, and an acceptance result applies only to where it was measured. In the shaft there are three regions worth distinguishing. The **core** of the bar was austenitised in the furnace during through-hardening and tempering, and its prior austenite grains record that treatment. The **induction-hardened journal** was re-austenitised for a few seconds by the induction coil, much hotter but far more briefly, and its surface layer has its own, usually finer, prior austenite grains. A thin **decarburised** layer at the original bar surface, if any remains after machining, may have ferrite grains rather than martensite and is not representative of either.

The drawing's grain size requirement refers to the steel as heat treated in the furnace, so the technician placed the five fields in the core of the transverse disc, at least 5 mm inside the hardened layer. A grain size measured in the hardened surface layer would answer a different question, whether the induction hardening overheated the surface, which is sometimes worth asking but must be reported as such.

### Comparing two laboratories

When a supplier's certificate and a purchaser's laboratory disagree about grain size, the first question is whether they measured the same thing in the same place. A supplier may measure on a test piece heat treated with the batch, on a different section, or by a comparison chart, and a purchaser may measure on the part by the intercept method. Differences of half a grain size number between such results are common and usually explained by the differences in method and location. A disagreement larger than about one number, or one that changes a pass to a fail, justifies an exchange of specimens or images so that both laboratories can measure the same fields. Chapter 11 returns to comparing laboratories with a statistical test.

## When one field is different

A spread larger than normal scatter is information, not noise. It means either that the structure varies across the specimen, or that something in the specimen or the measurement is wrong. Both deserve attention before any average is reported.

### Duplex structures

A **duplex** grain structure contains two distinct grain size populations, either mixed together throughout or in separate regions. Common causes in steels are abnormal grain growth during austenitising, where a few grains grow rapidly once the fine particles that pin the boundaries dissolve, as can happen when a steel is heated too hot or for too long; inadequate grain refinement in the steelmaking; and banding from segregation, where alternate bands transform differently. A small number of grains very much larger than the rest, scattered through an otherwise fine structure, can matter more to toughness and fatigue than the average suggests.

The average of a duplex structure describes neither population. ASTM E1181 describes how to characterise duplex grain sizes, by reporting the two populations and their area fractions, and ASTM E930 covers estimating the largest grain observed in a section, sometimes called the "as large as" grain. These are the right methods when a structure is not uniform, and a specification may forbid duplex structures outright, as Plant P's shaft drawing does.

```figure
type: decision
title: What to do when field readings differ widely
question: Is the spread between fields larger than the laboratory's limit?
caption: This is an illustration of Plant P's procedure. A large spread is never averaged away. It is either explained as a measurement fault and corrected, or characterised as a real feature of the material and reported as such.
- No | normal scatter for a uniform structure | report the average G with its interval
- *Yes, and one field shows a fault | an incomplete etch, a scratch or a misplaced field | correct the fault and re-measure the same position
- Yes, and the odd field is a real structure | coarse grains in a region, or two populations mixed | characterise as duplex, report both populations and their fractions, and apply the drawing's rule on duplex structures
```

## The error: an average that hid a coarse region

The second shaft from the new supplier, received a month after the incomplete-etch episode in Chapter 4, was etched with the improved method and measured on five fields. Four fields gave intercepts of 27.1, 28.9, 29.8 and 26.6 µm, very like the established supplier's shaft. The third field gave 62.0 µm.

The grain size acceptance tool returned an average intercept of 34.9 µm and **G 6.39**, comfortably finer than G 5, and an overall verdict of **accept**. It also reported a coarsest field of G 4.74 and a finest of 7.18, a spread of 2.44, and attached a **warning** to the spread check: check for a duplex (mixed) structure. The technician, seeing the accept verdict, wrote the result up as a pass.

The engineer reviewing the report read the warning. A field at G 4.74 is coarser than the drawing's limit, and an average of G 6.39 had been produced by averaging that field with four much finer ones. The technician returned to the specimen and photographed the region around field 3 at lower magnification. It was a band about 3 mm wide, running across the disc, of grains several times larger than those elsewhere, with a few individual grains in it as large as G 3.

```figure
type: compare
title: The new supplier's shaft, read two ways
rowhead: Reading
cols: Average G | Spread | What it implies
caption: This is an illustration. The tool's verdict on the average was accept; its warning on the spread was the signal that mattered. The laboratory now treats a spread warning as a stop until it has been explained.
- * Average of five fields | 6.39 | 2.44 | a fine-grained steel, comfortably inside the limit
- Field 3 alone | 4.74 | not applicable | a coarse region outside the limit
- Region around field 3, low magnification | about 4.7, with isolated grains near 3 | not applicable | a duplex structure, forbidden by the drawing
```

The laboratory reported the shaft as having a duplex grain structure, with a coarse band of about G 4.7 occupying roughly an eighth of the section and isolated grains near G 3, and the shaft was rejected under the drawing's note forbidding duplex structures. The supplier traced the cause to one furnace load that had overshot its austenitising temperature, and recalled the shafts from that load. Had the average been accepted, a shaft with a coarse band through its journal would have gone into a pump.

### What the tool did and did not do

The tool behaved as designed. Its overall verdict tests the average against the grain size range, and it flags the spread separately as a warning because a large spread may be a fault in the measurement rather than in the steel, which only a person looking at the specimen can decide. The lesson is about reading results, not about the tool: an accept verdict with a warning attached is not a clean accept, and a procedure should say what happens next when a warning appears.

### Why a coarse band matters more than its share

A coarse band occupying an eighth of the section might seem a small matter, since seven eighths of the steel is fine. Toughness and fatigue do not work by averages. A crack starts at the weakest place and, once started, needs only a path, so a band of coarse grains crossing the journal is a continuous region of lower toughness exactly where the bearing loads the shaft. For properties governed by the weakest region, the coarsest grains in the part are the relevant measure, not the average, which is the same reasoning Chapter 9 applies to the largest inclusion.

## Writing the result

A grain size result that will stand up to scrutiny states the method, the grains measured, the number and placement of fields, the average G with its confidence interval, the spread and whether the structure was uniform. Plant P's laboratory reports grain size in a fixed form:

- prior austenite grain size by the intercept method, ASTM E112, five fields on a systematic grid on a transverse section at mid-journal;
- average G with its 95% confidence interval;
- coarsest and finest field;
- a statement that the structure was uniform, or a description of the duplex structure found, following ASTM E1181;
- the etch used and an estimate of the fraction of boundaries revealed.

That last line came from the incomplete-etch episode, and the third line from the duplex one. Each was added after a mistake, which is how most good laboratory procedures grow.

## How this applies to a small Australian business

When a grain size report reaches you, look past the average to the spread between fields. A spread of more than about one grain size number, or any single field outside the limit, means the average is not the whole story, and you should ask whether the structure is duplex. If you write specifications, say whether duplex structures are acceptable, and if a tool or a laboratory gives you an accept with a warning, find out what the warning means before you sign.

## Exercise: averaging grain counts

A technician measures a ferritic steel by the planimetric method and records grains per square inch at 100× on four fields: 30, 26, 34 and 28. The specification is G 5 to 8 with a spread of no more than 1.0 between fields. (a) What is the average count and the grain size number? (b) What are the coarsest and finest fields in G, and does the spread pass? (c) Does the steel meet the specification?

**Worked answer.** (a) The average count is (30 + 26 + 34 + 28) ÷ 4 = **29.5 grains per square inch** at 100×. Since N = 2^(G−1), G = 1 + log₂ 29.5 = 1 + 4.88 = **G 5.88**, which is what the grain size acceptance tool returns, with an equivalent intercept of 41.7 µm. (b) The coarsest field, 26, gives G = 1 + log₂ 26 = **5.70**; the finest, 34, gives **6.09**. The spread is 0.39, which **passes** the limit of 1.0. (c) **Yes**: the average of 5.88 lies within G 5 to 8 and the fields are uniform. With only four fields and an average under one grain size number from the coarse limit, the laboratory might still choose to add fields before certifying, but nothing in the readings suggests a problem.
