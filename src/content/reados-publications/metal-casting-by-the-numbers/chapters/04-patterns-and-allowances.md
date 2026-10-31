---
book: metal-casting-by-the-numbers
chapterSlug: patterns-and-allowances
order: 4
title: "Patterns and allowances"
description: "Sizing a pattern so the casting comes out right: shrinkage and machining allowances, draft and cores, casting mass and metal poured, and a pattern made to the wrong shrinkage rule."
draft: false
---

A sand casting is a copy of a pattern, made in reverse twice: the pattern makes a cavity in sand, and the metal fills the cavity. But the casting is not the same size as the pattern. The metal shrinks as it cools from its freezing temperature to room temperature, so the pattern must be made larger than the casting by exactly the amount the metal will shrink. The casting itself must be larger than the finished part wherever it will be machined. Getting those allowances right is the patternmaker's first job, and getting them wrong is expensive, because a pattern is made once and used for every casting.

This chapter works out GB-12's pattern dimensions, casting mass and metal poured with two WORKOS tools, explains why real shrinkage varies across a casting, covers draft, cores and core prints, and works through a pattern made to the wrong shrinkage rule.

## Allowances, in order

Working from the finished part to the pattern, three allowances are added in turn.

```figure
type: steps
title: From finished part to pattern
caption: The order matters: shrinkage applies to the whole casting dimension, including its machining allowance, because the machining allowance is metal that also shrinks.
- Finished part dimension | from the drawing
- Add machining allowance on each machined face | metal to be cut off to reach a clean, accurate surface
- Casting dimension | what the casting must measure after cooling
- * Enlarge for shrinkage | pattern = casting × (1 + shrinkage allowance)
- Add draft, fillets and core prints | so the pattern draws from the sand and the cores locate
```

### Machining allowance

A cast surface is rough, slightly out of position and may carry sand, scale or a skin of fine porosity. Any surface that must be accurate is cast oversize and machined back. The allowance must cover the casting's dimensional variation, the depth of the defective skin and the machinist's need for a full cut. GB-12's foundry and the machinery builder agreed 3 mm per machined face, a figure that depends on the size of the casting and the process; very large castings and those cast in poorer processes need more.

### Datums the machinist can find

A machining allowance only works if the machinist can locate the casting so that the allowance is shared out sensibly. A casting clamped on a rough, distorted face can be machined clean on one side and leave black, unmachined patches on the other, even though the allowance was ample on average. GB-12's drawing therefore names three cast datum targets on surfaces that come off the pattern cleanly, away from the parting line, risers and gates, and the first machining operation locates on them. The foundry's first-article layout measures from the same targets. Agreeing those datums before the pattern is made is one of the most useful conversations a foundry and a machine shop can have, because it turns "the casting is out" into a measurement both can check.

### Shrinkage allowance

The shrinkage allowance, also called the patternmaker's contraction, is the linear contraction of the metal from its solidus to room temperature, as it occurs in the mould. It is usually given as a percentage or in millimetres per metre. Patternmakers once used special rules, "contraction rules", with their graduations stretched by the allowance, so that a pattern marked out with the rule came out at the right size without arithmetic. Each metal needed its own rule.

The allowance is a working figure, not a material constant. A casting that is free to contract shrinks more than one whose contraction is resisted by sand cores or by its own shape, and long, thin features shrink differently from compact ones. The foundry's own figure for GB-12's alloy in its resin-bonded sand moulds is 13 mm per metre, or 1.3%, confirmed by measuring earlier castings.

## Sizing GB-12's pattern

The WORKOS [Casting pattern plan](/tools/casting-pattern-plan/) tool treats a casting as a rectangular block. From the finished length, width and height, the number of machined faces across each, the machining allowance per face and the shrinkage allowance, it gives the casting and pattern dimensions. From the metal density and the volume of cored-out spaces it gives the casting volume and mass, and from the casting yield (the casting's share of the metal poured) the metal to pour, checked against the ladle or furnace capacity. Its guide notes that draft, fillets and core prints are added by the patternmaker and that real castings with hindered contraction shrink less.

This is an illustration. GB-12's finished envelope is 300 × 200 × 100 mm. Both ends and both sides are machined, and the joint face, one of the two 300 × 200 faces, is machined. The hollow inside of the cover is formed by a sand core with a volume of 4.0 L. The alloy's density as a solid is 2,680 kg/m³. The foundry plans for a casting yield of 55% (Chapter 7) and pours from a 20 kg hand ladle.

```figure
type: compare
title: GB-12 pattern plan
cols: Finished, mm | Machined faces | Casting, mm | Pattern at 13 mm/m, mm
rowhead: Dimension
- Length | 300 | 2 | 306 | 309.98
- Width | 200 | 2 | 206 | 208.68
- Height | 100 | 1 | 103 | 104.34
caption: This is an illustration. From the casting pattern plan tool: casting dimension = finished + 3 mm per machined face; pattern = casting × 1.013.
```

```figure
type: steps
title: GB-12 casting mass and metal poured
caption: This is an illustration. Casting envelope 306 × 206 × 103 mm less a 4.0 L core; density 2,680 kg/m³; yield 55%; ladle 20 kg.
- Envelope volume | 306 × 206 × 103 = 6.493 L
- Casting volume after the core | 6.493 − 4.0 = 2.493 L
- * Casting mass | 2.493 × 2.68 = 6.68 kg
- Metal to pour at 55% yield | 6.68 ÷ 0.55 = 12.1 kg
- Ladle check | 12.1 kg within the 20 kg ladle
```

The block model is crude for a casting with ribs, bosses and flanges, but it gives the right order of mass for planning, and the foundry later checked it against the CAD model of the casting, which gave 6.71 kg. For a real quotation, the casting's volume comes from its CAD model, and the tool's block result is a cross-check.

### Single dimensions and weight from the pattern

The WORKOS [Pattern size for shrinkage and casting weight from pattern](/tools/pattern-shrinkage/) tool works on one dimension at a time: finished dimension, machining allowance and number of machined faces across it, and shrinkage allowance, giving the casting dimension, pattern dimension and the shrinkage added. It also estimates the casting weight from the pattern's weight and the densities of the pattern material and the metal, less the cored-out volume, a quick check that patternmakers have used for generations. Its guide notes that the weight method assumes a solid pattern of uniform density without core prints.

This is an illustration. GB-12's four bolt holes on the joint face are cored, not drilled, and lie on 260 mm centres along the length. Their centre distance is not machined, so no machining allowance applies, and the pattern's core prints must be 260 × 1.013 = 263.38 mm apart. And GB-12's pattern, made of a timber of about 500 kg/m³, weighs 3.2 kg: the weight method gives 3.2 × 2,680 ÷ 500 − 4.0 × 2.68 = 6.43 kg, within 4% of the block estimate. The difference comes from the pattern's core prints, fillets and draft, which the simple method cannot separate out.

## Draft, fillets and cores

A pattern must come out of the sand without tearing the mould. Every surface parallel to the direction of draw is tapered slightly, with draft, so that the pattern frees itself as soon as it starts to lift. The amount depends on the moulding process and the depth of the surface; it adds metal to the casting, which must be allowed for on machined faces and accepted on cast faces. Internal corners are rounded with fillets, which help the pattern draw, make the mould stronger and, most importantly, avoid hot spots and stress concentrations in the casting (Chapter 6).

Hollow shapes are made by cores: shapes of bonded sand, made in their own core boxes and set into the mould before it is closed. A core needs core prints on the pattern, extensions that leave recesses in the mould where the core sits. GB-12's main core forms the inside of the cover; four small cores form its bolt holes. Cores resist the casting's contraction as it cools, which is one reason the real shrinkage in a cored casting is often less than in a solid block.

```figure
type: checklist
title: Checking a new pattern before the first mould
caption: The open item is the one missed in the error below.
- Machining allowance on every machined face, and none on cast faces | against the agreed drawing
- ? Shrinkage allowance for this alloy and process, marked on the pattern | each metal needs its own
- Draft on all surfaces parallel to the draw | direction marked
- Fillets on internal corners | radius to the casting drawing
- Core prints sized and located for each core | with the core box checked against them
- Parting line and gating position agreed with the foundry | Chapter 5
```

## Pattern materials and production quantity

The pattern itself has to last for the number of moulds the job needs. Timber patterns are quick and cheap to make and to alter, but they wear, absorb moisture and change size slightly over time; they suit prototypes and short runs. Resin and polyurethane patterns are more stable and wear better, and suit medium runs. Aluminium or cast iron patterns, usually mounted on a match plate with the gating, last for many thousands of moulds and suit machine moulding at high volumes.

This is an illustration. GB-12's first order of 60 castings a shift, with repeat orders expected, justified moving from the first timber pattern to a resin pattern mounted with its gating and risers on a match plate once the first-article layout had settled the dimensions. The timber pattern was kept as a reference. The match plate also fixed the gating and riser positions, which had previously been placed by hand in each mould, and so removed one source of variation between castings.

### Distortion and camber

Long, thin or unsymmetrical castings can distort as they cool, because their sections cool at different rates and pull on each other. A long flat cover may bow, its thin edges cooling and contracting first while its thicker middle is still hot. Where a casting is known to distort consistently, the patternmaker builds the opposite curvature into the pattern, a camber or distortion allowance, so that the casting comes out straight. That allowance is found by measurement, not calculated in advance, and it is one more reason the first-article layout matters.

### Who owns the pattern

Patterns are expensive, slow to replace and easily lost or damaged in storage. Agreement on who owns a pattern, who stores and insures it, who pays for repairs and what happens to it when a job ends belongs in the commercial terms before the pattern is made. The general points are covered in [Designing parts for casting](/reados/collections/machining-and-metal-parts/designing-parts-for-casting/). GB-12's pattern is marked with the customer's part number, the alloy, the shrinkage allowance and the date of its last correction.

## Real shrinkage varies

A single shrinkage allowance is an average. In a real casting, features that are free to contract shrink by more than the average, and features held by cores or by stiffer surrounding sections shrink by less. Long, thin features, such as GB-12's 306 mm length, are often the most constrained. This is an illustration. If the material between GB-12's bolt-hole cores actually contracts by only 1.0% because the cores hold it, the 263.38 mm pattern distance comes out at 260.77 mm, 0.77 mm long.

That is why the first castings from any new pattern are laid out: measured all over, against the drawing, on a coordinate measuring machine or a surface table. Where measured dimensions differ consistently from the drawing, the patternmaker adjusts the pattern locally. A pattern that has been through a first-article layout and a correction is worth more than one built perfectly to a single nominal allowance.

## The error: an iron rule on an aluminium pattern

This is an illustration. GB-12's first pattern was made by a contract patternmaker who mostly worked for iron foundries and used 10.4 mm per metre, a common allowance for grey iron, throughout. Nobody had written the alloy's allowance on the pattern order.

The first castings were laid out on the foundry's coordinate measuring machine. Every dimension was short. The length came out at 305.21 mm instead of 306 mm, which still left 2.6 mm of machining allowance per end, enough to clean up. But the cored bolt-hole centres, which are not machined, came out at 259.33 mm instead of 260 mm, 0.67 mm short, and the machinery builder's mating housing had its bolts on 260 mm centres with only 0.5 mm of clearance on the diameter of each hole.

```figure
type: compare
title: GB-12's first castings from a pattern made at 10.4 mm/m
cols: Pattern, mm | Casting at the real 13 mm/m contraction, mm | Drawing, mm | Effect
rowhead: Dimension
- Length (machined both ends) | 309.18 | 305.21 | 306 | 2.6 mm left per end; machines clean
- Height (machined one face) | 104.07 | 102.74 | 103 | 2.7 mm left; machines clean
- * Bolt-hole centres (cast, not machined) | 262.70 | 259.33 | 260 | 0.67 mm short; bolts will not enter
caption: This is an illustration. Pattern = casting dimension × 1.0104; casting = pattern ÷ 1.013. Machined dimensions survive because the machining allowance absorbs the error; cast-to-size dimensions do not.
```

The cause was found from the layout in an hour: every dimension was short by the same proportion, about 0.26%, the signature of a wrong shrinkage allowance rather than random variation. The patternmaker moved the bolt-hole core prints out by 0.68 mm, and remade the length and width blocks, and the foundry added the alloy, the allowance and the process to its pattern order template. The first-article layout became a fixed step for every new pattern.

## Exercise: a bronze bush pattern

This is an illustration. A customer wants a bronze bush, 250 mm long finished, machined on both ends with 2.5 mm per face. The foundry uses 16 mm per metre for this bronze in its sand moulds.

1. What are the casting length and the pattern length?
2. How much shrinkage does the pattern add?
3. If the pattern were made with GB-12's 13 mm/m by mistake, how much machining allowance would be left on each end?

**Worked answer.**

1. Casting 250 + 2 × 2.5 = **255 mm**; pattern 255 × 1.016 = **259.08 mm**.
2. **4.08 mm**.
3. Pattern at 13 mm/m: 255 × 1.013 = 258.32 mm; casting at the real 1.6%: 258.32 ÷ 1.016 = 254.25 mm, 0.75 mm short of 255. The allowance left is (254.25 − 250) ÷ 2 = **2.1 mm per end**, which probably still cleans up, but with less margin for a casting that is slightly off-centre in the mould.
