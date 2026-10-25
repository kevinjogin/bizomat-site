---
book: testing-welded-joints-by-the-numbers
chapterSlug: bend-tests-and-ductility
order: 5
title: "Bend tests and ductility"
description: "Calculate the strain a bend test imposes from specimen thickness and former diameter, see what root, face and side bends reveal, and read an opening that appears on the stretched surface."
draft: false
---

A weld can be strong and still brittle, and a brittle weld gives no warning before it breaks. A tensile test pulls a specimen until it breaks and reports the load, but it says little about whether the weld can stretch and deform before it fails. The bend test asks that question directly. A strip cut across the weld is bent around a former until its outer surface is stretched by a large, known amount. A ductile, sound weld bends without cracking; a brittle weld, or one with lack of fusion or other imperfections near the stretched surface, opens up and shows them.

This chapter calculates the strain a bend test imposes, explains what the different kinds of bend test reveal, and works through the hopper procedure's bend tests and a failure that the root bend found.

## The bend test

In a guided bend test, a specimen cut across the weld is placed on supports and pushed by a former, a rounded plunger, until it is bent through a specified angle, commonly 180 degrees, around the former's radius. The weld sits at the centre of the bend, so it receives the largest strain. After bending, the stretched outer surface is examined for openings. ISO 5173 describes transverse root, face and side bend tests on butt welds and how they are carried out.

The test is simple and cheap, needing little more than a press and a set of formers, and it is demanding. It applies to the weld and its heat-affected zones the kind of large plastic strain they might see if a structure were overloaded or deformed, and it reveals imperfections that a tensile test may not, because the strain concentrates at the surface where the imperfections lie.

## How much strain

When a strip of thickness t is bent around a former of diameter D, its outer surface is stretched and its inner surface compressed. For a bend through 180 degrees, the strain at the outer surface is approximately:

**ε ≈ t ÷ (D + t)**

This follows from the geometry: the specimen's centreline keeps its length, while the outer surface, at a radius larger by t ÷ 2, is stretched in proportion. The strain depends only on the ratio of the former diameter to the thickness, so a test can impose the same strain on any thickness by scaling the former.

```figure
type: formula
title: Outer-surface strain in the hopper procedure's bend tests
formula: ε ≈ t ÷ (D + t)
caption: This is an illustration. The former diameter is four times the specimen thickness, a common ratio; the standard and the material's elongation set the actual former.
- t | specimen thickness, 12 mm (full plate thickness)
- D | former diameter, 48 mm (4t)
step: ε ≈ 12 ÷ (48 + 12)
step: ε ≈ 0.20, a 20% stretch of the outer surface
```

A 20% stretch is large: the outer surface of the specimen grows by a fifth of its length. The relationship between the ratio D ÷ t and the strain is:

```figure
type: bars
title: Outer-surface strain in a 180° bend by former diameter to thickness ratio
unit: % strain at the outer surface
max: 35
caption: Strain from ε ≈ t ÷ (D + t). A tighter former imposes more strain. The former is chosen so that the strain is demanding but within the ductility the parent and weld metal are expected to have.
- D = 2t | 33.3
- D = 3t | 25.0
- *D = 4t | 20.0
- D = 6t | 14.3
```

The former is chosen with the material in mind. A steel with high elongation can be bent around a tight former; a higher-strength steel with less elongation needs a larger former, or the test would crack sound metal. Standards and specifications link the former diameter to the material, so the test checks the weld, not the limit of the steel.

## Where the formula comes from

The strain formula is worth deriving, because its assumption explains its limits. When a strip is wrapped around a former of diameter D, its inner surface follows the former at radius D ÷ 2, and its centreline lies at radius (D + t) ÷ 2. If the centreline keeps its original length, which is the usual assumption, then a fibre at distance y from the centreline is stretched by y divided by the centreline radius. The outer surface is at y = t ÷ 2, so its strain is:

ε = (t ÷ 2) ÷ ((D + t) ÷ 2) = t ÷ (D + t)

At large strains, the neutral axis, the fibre that keeps its length, moves towards the inside of the bend, and the specimen does not wrap perfectly around the former. The formula is therefore an approximation, accurate enough to compare tests and to choose formers, and it is the reason standards specify bend tests by the ratio of former diameter to thickness.

## Bend strain and elongation

The bend test's outer-surface strain can be compared with the elongation measured in a tensile test, with one difference. Tensile elongation is an average over a gauge length that includes the necked region; the bend test imposes its strain on a short length at the centre of the bend. A material whose tensile elongation is 20% over a standard gauge length can usually tolerate somewhat more than 20% locally, because the local elongation at a neck is higher than the average. That is why sound steels pass bend tests imposing strains close to their tensile elongation, and why the former is related to the material's elongation in the standards.

## Preparing a bend specimen

A bend specimen must be prepared so that it tests the weld and not the preparation. The weld reinforcement is removed flush, as for the tensile specimen. The long edges are smoothed and the corners on the stretched side are lightly rounded, because a sharp, rough-cut corner is a notch that can start a crack under 20% strain, regardless of the weld. Cutting with a saw or machining is preferred to flame cutting for the edges, or the heat-affected edge from flame cutting is removed. The specimen is marked so that the root and face sides can be identified, because a root bend tested as a face bend answers the wrong question.

## Longitudinal bends

In a transverse bend, the weld, the heat-affected zones and the parent metal lie side by side along the specimen, and if they differ in strength, the softer zone bends more and takes more of the strain. Where the weld metal and parent differ markedly in strength, as in some dissimilar-metal welds, a longitudinal bend, with the weld running along the length of the specimen, is used instead, so that all the zones are stretched equally. Standards specify when it is appropriate.

## Whittemore's ductility observation

Whittemore's preliminary tests on band iron found that the unwelded material had an elongation of about 20% in 4 inches, along with its strength, and that when welded, all of its properties were lower, including elongation. Loss of ductility at the weld was one of the clearest findings of early weld testing, and it is why ductility tests, of which the bend test is the most practical, became part of weld qualification. A weld that loses its ductility can crack under a deformation that the plate would simply absorb.

## Root, face and side bends

The surface that is stretched decides what the test reveals.

- **Root bend**: the root side of the weld is on the outside of the bend and is stretched. It reveals lack of root fusion, incomplete root penetration, root cracks and imperfections near the root.
- **Face bend**: the face, or cap, side of the weld is stretched. It reveals imperfections near the weld surface, such as lack of fusion at the cap's edges, undercut and surface porosity.
- **Side bend**: a specimen is cut so that its width is the plate thickness, and the bend stretches a cross-section through the whole thickness of the weld. Side bends are used for thicker plates and reveal lack of sidewall fusion and interrun defects through the whole depth, the defect that caused the tensile failure in Chapter 2.

Which bends are required, and how many, depends on the standard and the plate thickness. Thin plates are typically tested with root and face bends; thicker plates with side bends.

```figure
type: compare
title: What each type of bend test reveals
cols: Surface stretched | Typical imperfections revealed
caption: The test reveals imperfections near the stretched surface. Which bends are required depends on the standard and the plate thickness.
- Root bend | root side of the weld | lack of root fusion, incomplete penetration, root cracks
- Face bend | face or cap side | cap edge lack of fusion, undercut, near-surface porosity
- Side bend | full weld cross-section | lack of sidewall fusion, interrun defects through the depth
```

## Reading a bend specimen

After bending, the stretched surface is examined, sometimes with magnification. A perfect specimen shows a smooth, stretched surface with no openings. Standards set acceptance criteria for openings: small openings below a stated length may be acceptable, larger ones are not, and cracks that start at the specimen's corners are treated as the standard directs, because they may come from the cut edge rather than the weld. The criteria in the applicable standard must be applied as written.

Beyond accepting or rejecting, the location and appearance of an opening point to its cause. An opening along the fusion line, the boundary between weld and parent, suggests lack of fusion. A ragged opening in the weld metal may be porosity or slag. A sharp crack in the heat-affected zone may point to hardening. The specimen is evidence, and a failed bend should be sectioned or examined to find out which, because the cure for lack of fusion is quite different from the cure for porosity or hardening.

## Bend tests in welder qualification

Bend tests are also the workhorse of welder qualification. A welder's test plate is commonly assessed by visual inspection and either bend tests or radiography, depending on the standard, the process and the joint. The bend test suits welder qualification well: it is cheap, quick, needs only a press and a former, and it is very good at revealing exactly the faults a welder's technique produces, such as lack of root fusion, lack of sidewall fusion and porosity. A welder who can produce plates that bend cleanly has shown control of the arc, the electrode angle and the travel speed at the root and through the joint. In Australia, AS/NZS 2980, used with ISO 9606-1, sets out the qualification testing of welders for fusion welding of steels.

## The hopper procedure's bend tests

This is an illustration. The hopper procedure qualification plate yielded two root bends and two face bends, each 12 mm thick, bent through 180 degrees around a 48 mm former, imposing about 20% strain at the stretched surface.

| Specimen | Type | Result |
|---|---|---|
| B1 | root bend | no openings |
| B2 | root bend | no openings |
| B3 | face bend | one opening about 1 mm long in the weld metal, examined and found to be a small pore |
| B4 | face bend | no openings |

The laboratory assessed B3's small opening against the standard's criteria and reported the specimen acceptable. The fabricator noted it anyway, because a pass with a small opening and a pass with none are not quite the same result: a pore near the cap is a sign that shielding or technique on the cap runs could be improved, and the hopper's production visual inspection would watch for surface porosity.

## A failure: the root bend that opened

This is an illustration. On another procedure, for a single-sided butt weld in a chute liner, the fabricator's first qualification plate produced a root bend that opened along one fusion line at the root, an opening about 6 mm long, well beyond acceptable. The tensile specimens had passed, both breaking in the parent.

The root bend had found what the tensile test could not. Sectioning the remaining part of the plate showed that the root run had not fused into one of the bevel faces for part of the joint's length. The fit-up record explained why: the two plates had been misaligned by about 1.5 mm at the root, so that one root face sat higher than the other, and the root run had bridged across without melting into the higher face. In tension, the sound weld above the root carried the load and the specimen broke in the parent; in bending, the root was stretched, and the unfused edge opened.

The fabricator added a limit on root misalignment to its fit-up check, repaired its plate-clamping fixture, and welded a new plate, which passed. The incident is a good illustration of why procedure qualification combines several tests: each looks at the weld in a different way, and a weld can pass one while failing another.

## Exercise: choosing a former

A 10 mm thick specimen is to be bent through 180 degrees. Calculate the outer-surface strain if it is bent around a 30 mm former. Then calculate the former diameter that would limit the strain to 15%, for a higher-strength steel with less elongation.

Around a 30 mm former, ε ≈ 10 ÷ (30 + 10) = **0.25**, a 25% stretch. To limit the strain to 15%, the former must satisfy 0.15 = 10 ÷ (D + 10), so D = 10 ÷ 0.15 − 10 ≈ **56.7 mm**, which would be rounded to an available former of about 57 mm or the next standard size.

A larger former makes the test gentler, so it must not be made larger than the standard allows merely to avoid failures. The former should match the steel's ductility, so that a crack in the test means a problem in the weld, not a test asking more than the parent metal can give.
