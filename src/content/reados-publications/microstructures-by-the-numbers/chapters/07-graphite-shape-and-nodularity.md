---
book: microstructures-by-the-numbers
chapterSlug: graphite-shape-and-nodularity
order: 7
title: "Graphite shape and nodularity"
description: "Describing particle shape with circularity and roundness, measuring nodularity in ductile iron, how section thickness affects it, and checking casting hardness with valid Brinell tests."
draft: false
---

Ductile iron owes its ductility to the shape of its graphite. In grey iron the graphite grows as flakes, whose sharp edges concentrate stress and give the iron its low strength and almost no elongation. Treating the molten iron with magnesium makes the graphite grow instead as near-spherical nodules, which barely weaken the matrix. The fraction of graphite that is properly nodular, the **nodularity**, is therefore one of the main quality measures of a ductile iron casting, and measuring it means describing shape with a number.

This chapter covers shape descriptors and their pitfalls, the measurement of nodularity, how it varies with section size, and the Brinell hardness check that accompanies it on castings. Its error is a hardness failure caused by testing the casting's skin.

## Describing shape with a number

Image analysis can measure, for every particle in a field, its area, its perimeter and its longest dimension, the maximum Feret diameter. From these, two dimensionless shape factors are common.

- **Circularity**, 4π × area ÷ perimeter², equals 1 for a circle and falls for any other shape. A square scores 0.785, and a shape with a ragged or branched outline scores much lower.
- **Roundness**, area ÷ (π × (maximum Feret diameter ÷ 2)²), compares the particle's area with that of the circle that would just contain its longest dimension. It too equals 1 for a circle; an ellipse twice as long as it is wide scores 0.5.

The two answer different questions. Circularity is sensitive to the roughness of the outline, so it separates smooth nodules from irregular, spiky graphite. Roundness is sensitive to elongation, so it separates nodules from elongated, worm-like compacted (vermicular) graphite. Methods for nodularity by image analysis use a shape factor of this kind with a threshold above which a particle counts as a nodule. Plant P's laboratory uses roundness with a threshold of 0.6 and a minimum particle size of 10 µm, the settings agreed with the foundry after the nodule count dispute in Chapter 6. The settings matter as much as the measurement.

```figure
type: compare
title: Shape factors for some simple outlines
rowhead: Outline
cols: Circularity | Roundness | Classed as a nodule at roundness 0.6?
caption: Roundness is computed from the area and the longest dimension; circularity from the area and the perimeter. A smooth ellipse has a fairly high circularity but a low roundness, so the choice of factor decides how elongated particles are classed.
- Circle | 1.000 | 1.000 | yes
- Square | 0.785 | 0.637 | yes, just
- * Ellipse, 2 to 1 | 0.841 | 0.500 | no
- Thin worm-like particle | low | low | no
- Irregular nodule with a rough outline | low | about 0.7 | yes
```

### Pixels and small particles

Shape factors measured on small particles are unreliable, because their outlines are made of a few pixels. A circle drawn with a dozen pixels across has a stepped perimeter, longer than a true circle's, so its circularity is understated; very small particles can score anything. This is one reason methods set a minimum particle size for shape classification, and it means that the magnification must put the smallest particle that is classified at least 10 to 15 pixels across. At Plant P's 100× setting, with about 1.25 µm per pixel, a 10 µm particle is 8 pixels across, which is too few, so the laboratory classifies shape at 200×, where the same particle is 16 pixels across.

## Nodularity

Nodularity is commonly defined as the share of graphite that is nodular, measured by area: the total area of particles classed as nodules divided by the total area of all graphite particles above the minimum size. Some methods count particles rather than area, or weight particles differently, so a nodularity figure, like a nodule count, must name its method. ISO 945-1 describes the forms of graphite in cast iron by reference images and is the common language for describing them; the nodularity requirement of 80% on Plant P's drawing is the plant's own illustrative choice, not a value from a standard.

### The casing's nodularity

On the main wall of the leaking casings, nodularity was 92%, comfortably above 80%. The 50 mm boss told a different story. Of 11,400 µm² of graphite measured per square millimetre of section, 8,100 µm² was in particles classed as nodules, 1,900 µm² in intermediate, irregular forms and 1,400 µm² in compacted, worm-like graphite.

```figure
type: bars
title: Graphite in the boss of a leaking casing, by form
unit: % of graphite area
caption: This is an illustration. Area shares of graphite on 30 systematically placed fields at 200× in the 50 mm boss. Nodularity is the first bar, 71%, below the drawing's 80%. The main wall of the same casings measured 92%.
- * Nodules, roundness 0.6 or more | 71.1
- Intermediate, irregular forms | 16.7
- Compacted, worm-like graphite | 12.3
```

Low nodularity in a thick section, with good nodularity in thin ones, is a familiar pattern. Magnesium, the element that makes graphite grow as nodules, fades from the melt over time, so iron poured late from a ladle has less of it. Thick sections stay liquid longest and are the last to solidify, giving any shortage the most time to show. The foundry's records showed that the leaking casings had been poured at the end of their ladles. That explained the boss's nodularity and, as Chapter 8 shows, was part of the porosity story too.

### Other forms worth recognising

Not every departure from nodular graphite is the compacted form seen in the boss, and the form says something about the cause. **Chunky graphite**, a network of fine, interconnected graphite in the thermal centres of very heavy sections, is associated with long solidification times and certain trace elements, and does great harm to elongation while hardly changing the nodularity a shape factor reports, because each chunk of the network is small and compact. **Exploded** nodules, broken into fragments, can come from too much of some rare earth additions. **Spiky** or intercellular graphite points to contamination of the melt by elements that interfere with nodule growth. A nodularity number captures none of these distinctions by itself, so the laboratory always keeps and reports images of the representative fields along with the number, and looks at the thermal centre of any heavy section for forms that the shape factor would miss.

### Reading three numbers together

Nodule count, nodularity and matrix fraction are best read together, because a single cause usually moves all three. Slow cooling in a thick section gives fewer, larger nodules, more ferrite in a ferritising iron and more opportunity for degenerate forms. A late pour with faded magnesium lowers nodularity everywhere but most in thick sections. A poorly inoculated melt lowers nodule count in every section and tends to raise pearlite and the risk of carbides in thin walls. The leaking casings showed the pattern of the first two together: a normal wall, and a boss with low nodularity and a softer, more ferritic matrix, which pointed to slow cooling at the end of a ladle rather than to a problem with the iron as a whole.

### Nodularity and properties

Lower nodularity lowers tensile strength and, more sharply, elongation, because compacted and irregular graphite concentrate stress more than nodules do. A casing whose wall meets every requirement but whose boss has 71% nodularity may still be fit for service, since the boss carries little stress, or may not, if it carries bolt loads. That is a question for the designer, not the laboratory. The laboratory's job is to measure the nodularity where it was asked to, report where else it found a difference, and say how confident it is in each value.

## Hardness of castings

Hardness is the quickest check on a casting's matrix. In ductile iron it rises with the pearlite fraction and falls with ferrite, so it confirms the point counts of Chapter 3 and flags castings whose matrix has gone wrong. The coarse structure of cast iron needs a large indentation that averages over many nodules and matrix regions, which is why castings are tested by the Brinell method, typically with a 10 mm tungsten carbide ball and a 3,000 kgf load. ISO 6506-1 covers the Brinell test method.

The [Brinell hardness test check](/tools/brinell-test-check/) evaluates a test from two perpendicular indentation diameters. It reports the mean diameter, the Brinell hardness, the ratio of indentation to ball diameter, the force–diameter ratio and the indentation depth. It checks the indentation ratio against the user's limits, the specimen thickness as a multiple of the indentation depth, and the edge distance and spacing as multiples of the indentation diameter, all against rules the user enters. It also checks the result against the specification range. It gives an approximate tensile strength that, as the tool states, applies to steels only; for cast iron that figure must be ignored, because the relation between hardness and strength in a graphitic iron is different.

On a machined face of the casing wall, with a 10 mm ball and 3,000 kgf, the technician measured diameters of 4.20 and 4.24 mm. The tool gives a mean of 4.22 mm and **204 HBW**, with every validity check passed and the result inside the drawing's 170 to 230 HBW. A test on the machined boss gave 188 HBW, softer, consistent with the more ferritic matrix of the slowly cooled section.

```figure
type: compare
title: Brinell tests on the casing, 10 mm ball, 3,000 kgf
rowhead: Test
cols: Mean diameter | Hardness | Tool verdict
caption: This is an illustration. Results from the Brinell hardness test check with the laboratory's validity rules: indentation ratio 0.24 to 0.6, thickness at least 8 times the depth, edge distance at least 2.5 and spacing at least 3 indentation diameters.
- Machined wall face | 4.22 mm | 204 HBW | within specification
- Machined boss face | 4.39 mm | 188 HBW | within specification
- * As-cast skin, lightly ground | 4.64 mm | 167 HBW | out of specification
- Flange face, 8 mm from the edge | 4.32 mm | 195 HBW | test not valid: edge distance 8 mm against 10.8 mm needed
```

The last row shows why the validity checks matter. An indentation too close to an edge lets the metal flow sideways, enlarging the indentation and lowering the reading. The tool reports the test as not valid rather than as a pass, even though its hardness lies inside the specification. A result from an invalid test is not evidence either way.

### How many tests?

A single Brinell indentation samples a few square millimetres of surface, and castings vary. Plant P's routine is three tests on each location, spaced to the validity rules, with the mean and range reported. On the wall the three tests gave 202, 204 and 207 HBW, a range of 5, which is ordinary scatter for a uniform matrix. A range of 20 or more on one face would suggest a mixed matrix, local chill or a test fault, and the laboratory would section the location before reporting.

## The error: testing the skin

The first hardness check on a casing from the leaking batch was made by a production inspector, who ground a small flat on the as-cast outer surface of the wall and tested it there. The tool returned **167 HBW**, below the 170 minimum, and the batch was nearly rejected for hardness as well as for leaks.

The laboratory sectioned the wall at the test position and found what it expected. Ductile iron castings commonly have a surface layer, up to a millimetre or two deep, whose structure differs from the interior: a ferritic rim where carbon has been lost to the mould, and sometimes degenerate graphite where the magnesium reacted with the mould coating. The light grinding had removed the sand and scale but not that layer. A test after grinding 2 mm below the as-cast surface, at the same position, gave 204 HBW, the same as the machined face, and the batch was cleared on hardness.

```figure
type: steps
title: Plant P's rule for Brinell tests on castings
caption: This is an illustration. The rule was written after the skin test nearly rejected a batch for the wrong reason.
- Choose the location | a face that will be machined, or one specified on the drawing
- Remove the as-cast layer | grind at least 2 mm below the cast surface, or test on a machined face
- Check the geometry | thickness, edge distance and spacing against the validity rules, before testing
- Test and measure two diameters | perpendicular, with the calibrated measuring microscope
- * Run the Brinell test check | accept only valid tests, and ignore its tensile estimate for cast iron
```

The episode is a sampling error in a different guise: the hardness was correctly measured on the wrong material. The casting skin is part of the casting, and in some applications its properties matter, but a drawing hardness for "the casting" normally means the bulk material, and the test must reach it.

## How this applies to a small Australian business

If you buy ductile iron castings, ask for nodularity and nodule count with the method and settings stated, and for where on the casting they were measured. A test bar result says how the iron was treated; a section through a thick part of the casting says how the iron behaved there. For hardness, test machined or properly ground faces and check every test's validity before reading its number; a hardness tool's approximate tensile strength for steel does not apply to cast iron.

For a new casting or a new supplier, it is worth paying once for a full survey: nodularity, nodule count and matrix in the thinnest wall, the thickest section and any critical face, with hardness at the same places. That survey shows how much the casting varies and where to look in future, and a routine check at one or two locations can then be chosen with confidence. Repeating it after any change of pattern, gating or foundry practice is cheap insurance against the kind of section-dependent problem that the leaking casings showed.

## Exercise: nodularity from particle classes

On a test coupon, image analysis measures graphite in three classes per square millimetre of section: 9,600 µm² in particles of roundness 0.6 or more, 1,100 µm² in intermediate forms and 500 µm² in compacted graphite. (a) What is the nodularity by area? (b) Does it meet an 80% requirement? (c) If the laboratory raised its roundness threshold from 0.6 to 0.7, would the nodularity rise or fall?

**Worked answer.** (a) Total graphite area is 9,600 + 1,100 + 500 = 11,200 µm². Nodularity is 9,600 ÷ 11,200 = **85.7%**. (b) **Yes**, it exceeds 80%. (c) It would **fall**: a stricter threshold moves particles with roundness between 0.6 and 0.7 out of the nodule class and into the intermediate class, while the total graphite area stays the same. That is why a nodularity result is meaningful only with its threshold stated, and why a laboratory should not change thresholds without recording the change.
