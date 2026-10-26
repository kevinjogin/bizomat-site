---
book: blanking-and-piercing-dies-by-the-numbers
chapterSlug: clearance-and-tool-sizes
order: 3
title: "Clearance and the sizes of punches and dies"
description: "Choosing clearance per side, what too little and too much do to the edge, sizing MP-40's punches and die openings for wear, and a blanking die made to the wrong tool."
draft: false
---

The gap between a punch and its die opening is the most important dimension in a cutting tool, and it is too small to see with the naked eye. For MP-40 it is 0.15 mm on each side, about the thickness of two sheets of paper. Too little, and the cracks from the two edges miss each other, the force rises and the edges wear fast. Too much, and the edge rolls over, the burr grows and the part dishes. The clearance also decides the size of each tool, because one tool in each pair sets the part's dimension and the other is made larger or smaller by twice the clearance.

This chapter chooses MP-40's clearance, shows what a wrong clearance does, sizes every punch and die opening so that holes and blanks stay in tolerance as the tool wears, and ends with a blanking die built to the wrong rule.

## Clearance per side

Clearance is the gap from the punch edge to the die edge, measured on one side, and is usually stated as a percentage of the sheet's thickness. The die opening is therefore larger than the punch by twice the clearance. Some catalogues quote the total, both sides together, and a misread figure doubles or halves the gap; this book always means per side.

The right clearance depends on the material, its thickness and the edge wanted. University texts give ranges of a few per cent of thickness to about ten per cent for common sheet metals, smaller for soft, ductile metals and larger for hard or thick ones, and punch makers publish their own tables, often in total clearance. The number that matters is the one that gives an acceptable edge on trial, in the material actually used.

For MP-40, the toolmaker chooses **7.5% of thickness per side**:

- clearance per side c = 0.075 × 2.0 = **0.15 mm**;
- die opening larger than the punch by 2c = **0.30 mm**.

That is an illustration of a middle-of-the-range choice for low-carbon steel, aimed at a clean edge and long tool life rather than the smallest possible burr. A die for parts that must have a very straight, smooth edge would use a smaller clearance and accept more wear; a die for thick structural parts, where the edge is less important than the force and tool life, would use a larger one.

## What clearance does to the cut

Chapter 1 described how cracks start from both edges and meet. The clearance decides whether they meet cleanly.

- **Too little clearance.** The cracks start at the edges but run past each other. The metal between them must be sheared a second time, which leaves a second burnished band below the first, a rough ledge between them, a higher force and more friction and heat at the edges. Tools wear faster and can chip, and slugs tend to stick.
- **Suitable clearance.** The cracks meet. The edge shows a moderate rollover, a burnish band, a straight fracture and a small burr, and the force is close to the estimate.
- **Too much clearance.** The sheet bends further into the die before it cracks. The rollover is large, the fracture slopes, the burr is tall, and the part near the edge dishes. Holes come out with a tapered wall, and blanks lose flatness.

Clearance also changes as the tool is used. Punches and die openings both wear at their edges, and a die that is sharpened by grinding its face keeps its size only if the die opening's land is parallel; once the land is ground away into the relief taper, the opening gets bigger and the clearance grows. Chapter 9 deals with keeping track of that.

```figure
type: compare
title: Effect of clearance on the cut
rowhead: Clearance
cols: Edge | Burr | Force and wear | Part
caption: General patterns in low-carbon steel, for diagnosis. The suitable range for a given material is confirmed by trial.
- Too little | double burnish band with a ledge | small but ragged | force up; fast wear, chipping | flat; slugs may stick
- * Suitable | moderate rollover, straight fracture | small | close to estimate | flat
- Too much | large rollover, sloping fracture | tall | force similar; edges round off | edge dished; holes tapered
```

## Which tool sets the size

Chapter 1 gave the rule: a hole takes the size of the punch, and a blank takes the size of the die. The other tool is made to suit.

- For a **pierced hole**, the punch is made to the hole's size, and the die opening is the punch plus 2c.
- For a **blank**, the die opening is made to the blank's size, and the punch is the die opening less 2c.

Applying the clearance to the wrong tool makes the feature wrong by 2c, which for MP-40 is 0.30 mm, three times the outline's tolerance.

## Allowing for wear

Cutting edges wear, and the wear goes in a predictable direction. A punch's edge rounds and its size shrinks slightly; a die opening's edge rounds and its size grows. So a hole made by a worn punch is a little smaller than it was, and a blank made in a worn die is a little larger.

A toolmaker uses this by placing each tool's size towards the end of the part's tolerance that wear moves away from:

- **piercing punches** are made near the **upper** limit of the hole's tolerance, so that as they wear the holes shrink towards the lower limit;
- **blanking die openings** are made near the **lower** limit of the blank's tolerance, so that as they wear the blanks grow towards the upper limit.

The distance from the tool's size to the far limit is the **wear allowance**. Pierced holes also tend to close up very slightly as the strip relaxes after the punch withdraws, and blanks to grow very slightly; the amounts depend on the material and clearance and are found on the first trial, which is one reason toolmakers leave a little room at each end.

## MP-40's punches and die openings

This is an illustration. MP-40's drawing tolerances are: holes Ø8.5 +0.10/0, so 8.50 to 8.60 mm; slot 16 × 8 +0.10/0; outline 80 × 50 ±0.10, so 79.90 to 80.10 by 49.90 to 50.10 mm. With c = 0.15 mm per side, the toolmaker sizes the tools as follows.

**Hole punches.** Made at Ø8.58 mm, near the upper limit. Die openings 8.58 + 0.30 = **Ø8.88 mm**. Wear allowance before the holes reach 8.50: **0.08 mm** on diameter.

**Slot punch.** Made at 16.08 × 8.08 mm with full-radius ends of R4.04. Die opening 16.38 × 8.38 mm. Wear allowance 0.08 mm on each dimension.

**Blanking die opening.** Made at 79.92 × 49.92 mm, near the lower limit, with corner radii of R6.00. Blanking punch 79.92 − 0.30 = **79.62 × 49.62 mm**, with corners of R5.85, the die's radius less one clearance. Wear allowance before the blanks reach 80.10: **0.18 mm**.

The blanking die has more than twice the wear allowance of the piercing punches, partly because the outline's tolerance is wider and partly because its tolerance is split both ways. In practice the piercing punches are usually the first parts of a die to need attention, because they are slender and work hard, and Chapter 4 looks at their strength.

```figure
type: compare
title: MP-40's punch and die sizes for 0.15 mm clearance per side
rowhead: Feature
cols: Drawing size, mm | Tool that sets it | Punch, mm | Die opening, mm | Wear allowance, mm
caption: This is an illustration. Punches are placed near the upper limit of the holes' tolerance and the blanking die near the lower limit of the outline's, so wear moves each feature through its tolerance.
- Holes | Ø8.50 to 8.60 | punch | Ø8.58 | Ø8.88 | 0.08
- Slot | 16.00 to 16.10 × 8.00 to 8.10 | punch | 16.08 × 8.08 | 16.38 × 8.38 | 0.08
- * Outline | 79.90 to 80.10 × 49.90 to 50.10 | die | 79.62 × 49.62 | 79.92 × 49.92 | 0.18
```

## Pilots and the holes they enter

MP-40's die locates the strip at station 2 with two pilots that enter the holes pierced at station 1. A pilot has to enter every hole the punches make, from the first stroke, when the holes are at their largest, to the last before sharpening, when worn punches have made them at their smallest. So the pilot is sized to the smallest hole, not the nominal one.

This is an illustration. The hole punches start at Ø8.58 mm and are sharpened before the holes fall below 8.50 mm. A pilot of **Ø8.48 mm** fits every hole in that range. In a new hole it has 0.10 mm of clearance on diameter, so the strip can sit up to 0.05 mm either way of its true position; in a hole at the worn limit it has 0.02 mm. A pilot of 8.52 mm would locate more tightly in new holes, and would jam in the worn ones, tearing the strip or bending the pilot.

The pilot's float is part of the positional tolerance between the outline and the holes. MP-40's drawing allows the holes to be ±0.15 mm from their true position relative to the outline, and the toolmaker's budget gives ±0.05 mm to pilot float, ±0.03 mm to the die's own accuracy, and the rest to feed variation and strip camber. Pilots have a bullet-shaped nose so that they pull the strip into place as they enter, and they must enter before any punch touches the strip, which is why they are made longer than the punches. Chapter 8 checks that when the die is set.

## Clearance in other materials

The clearance that suits MP-40's mild steel would not suit every material the shop cuts. The general tendencies are worth knowing even though the numbers come from trials and suppliers' tables.

- **Soft aluminium and copper** shear with a large burnished band and are prone to burrs if the clearance is large; dies for them usually run tighter clearances in percentage terms.
- **Stainless steels** are stronger and work-harden quickly at the cutting edge; they need larger clearances in percentage terms and tougher, more wear-resistant tool steels, and they gall unless lubricated.
- **High-strength steels** need larger clearances again, more force for the same thickness, and carefully supported edges, because they chip tools that would last for years in mild steel.
- **Coated sheet**, such as galvanised steel, cuts like its base metal, but the coating can build up on punches and is scraped into the die.

A shop that cuts several materials with one die usually cannot give each its ideal clearance. It chooses for the material that matters most, checks the edge on each of the others, and records which materials the die is proven on.

## Corners and small radii

A blank's corner radius is set by the die opening's corner, and the punch's corner is the die's radius less one clearance, not less two: the clearance is measured square to the edge, and at a corner that is along the radius. MP-40's R6 corners give a punch radius of 5.85 mm.

Sharp internal corners in a die opening, and sharp external corners on a punch, are where tools chip and crack, both in use and in heat treatment. Drawings that call for sharp corners on blanked parts make dies more expensive and less durable. A corner radius of at least about half the sheet's thickness is easier on the tool, and MP-40's 6 mm radii, three times the thickness, give no trouble. The obround slot's full-radius ends are the most durable shape a slot punch can have.

## Checking clearance

Clearance is checked when the die is assembled and after every sharpening.

1. **Measure the parts.** Punch sizes with a micrometer, die openings with pin gauges or a bore gauge, and compare with the tool drawing.
2. **Check alignment.** With the die set closed slowly, by hand or on inching, look along the punch into the die opening against a light. The light gap should be even all round; a gap that closes on one side means the punch is off centre, and a 0.15 mm clearance leaves little room.
3. **Strike a test.** Strike paper, or thin shim, with the die on inching. An even, clean cut all round means the clearance is even. A cut that tears on one side shows where it is tight.
4. **Read the first parts.** The edge zones on the first blanks and holes, as described in Chapter 1, confirm the clearance in the real material.

## The error: a blanking die made to the punch rule

This is an illustration. The MP-40 die was built by a subcontract toolmaker from a tool drawing that gave the part's sizes and the clearance, 0.15 mm per side, but did not give the tool sizes. The toolmaker made the blanking punch at 80.00 × 50.00 mm, the part's nominal size, and the die opening 0.30 mm larger, at 80.30 × 50.30 mm, as if the outline were a pierced hole.

The first-off inspection found blanks measuring 80.31 × 50.30 mm, 0.21 mm over the upper limit in length. The holes, which had been sized correctly, were fine. The cause was clear once the tools were measured: the blank had taken the size of the die, as blanks always do, and the die was 0.30 mm too big.

A die opening cannot be made smaller by grinding, so the blanking die insert was remade at 79.92 × 49.92 mm, and the existing punch was reground down to 79.62 × 49.62 mm, which it had enough stock to allow. The insert cost a week and an illustrative A$1,850 excluding GST. The shop's tool drawing template now lists every punch and die size explicitly, with the tool that sets each feature named, so that no toolmaker has to infer the rule.

```figure
type: checklist
title: Clearance and size checks before a cutting tool is made
caption: The first three are checks on the tool drawing; the rest are checks on the built tool.
- Clearance stated per side, with the material it was chosen for | 0.15 mm per side, 7.5% of 2.0 mm
- Every punch and die size listed, with the tool that sets the feature | holes and slot by punch; outline by die
- Punches near the upper limit, blanking die near the lower | wear allowances 0.08 and 0.18 mm
- Tools measured against the drawing before assembly | micrometer, pin gauges
- Clearance even all round, by light or a paper strike | before the first strip
- x Clearance applied to the wrong tool | blanks 0.21 mm over the upper limit
```

## Exercise: sizing the stainless version

For the 1.6 mm stainless steel version of MP-40 from Chapter 2, the toolmaker chooses a clearance of 9% of thickness per side, a larger percentage than for the mild steel because the stainless is harder and tougher. The tolerances are unchanged. Size the hole punches and their die openings, and the blanking die opening and its punch, using the same wear placement as above.

**Worked answer.** The clearance per side is 0.09 × 1.6 = 0.144 mm, so 2c = 0.288 mm, which the toolmaker would round to 0.29 mm for manufacture.

- Hole punches at Ø8.58 mm, die openings 8.58 + 0.29 = **Ø8.87 mm**.
- Blanking die opening at 79.92 × 49.92 mm, punch 79.92 − 0.29 = **79.63 × 49.63 mm**, corners R6.00 in the die and about R5.86 on the punch.

The tool sizes barely change, because the clearance is a small part of each. What changes more is the tool steel and the expected life: stainless steel wears cutting edges faster and tends to gall, and the die would be expected to need sharpening more often than the mild steel die in Chapter 9.
