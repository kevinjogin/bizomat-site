---
book: weld-repairs-that-hold
chapterSlug: joint-preparation-and-weld-volume
order: 3
title: "Joint preparation and weld volume"
description: "Choose an excavation and groove shape that reaches sound metal, allows full fusion and limits weld volume, and calculate what each choice deposits."
draft: false
---

The shape of the groove decides how much metal the welder must deposit, how much heat goes into the plate and how much the joint will shrink. It also decides whether the weld can fuse properly at the root, where most repair defects hide. The 1919 Airco booklet repeated one joint almost everywhere: a butt weld with both edges bevelled at about 45°, making a 90° vee, left open about 3/16 inch at the bottom. It explicitly preferred that butt joint to a lap weld, which it said did not make a strong, tight joint.

This chapter explains what the groove must achieve, shows how to calculate its area and mass, and uses the result to compare the booklet's generous vee with a narrower modern preparation.

## A repair groove has three jobs

For a crack repair, the groove is not a fabrication detail chosen from a table. It must:

1. **Remove all of the defect.** The crack must be excavated until inspection confirms that none remains. A crack left in the root of a repair weld is pulled open by the weld's own shrinkage.
2. **Allow full fusion.** The welder needs access for the process and electrode or rod, so the groove must be wide and open enough at the root to fuse both sides completely.
3. **Avoid unnecessary metal.** Every extra square millimetre of groove means more heat, more shrinkage and more time.

The first two push towards a wider, more open groove. The third pushes back. A good preparation is the narrowest one that still removes the defect and lets a qualified welder fuse the root reliably with the chosen process.

## Calculate the groove area

For a single-V butt joint in plate of thickness t, with a root gap g, a bevel angle θ on each side measured from the vertical and no root face, the cross-sectional area is the rectangle of the gap plus two triangles:

**A = g × t + t² × tan θ**

The booklet's 90° included vee has θ = 45°, so tan θ = 1.

For the tank's 10 mm plate with a 4.8 mm root gap, close to the booklet's 3/16 inch:

**A = 4.8 × 10 + 10² × 1 = 48 + 100 = 148 mm²**

That excludes cap reinforcement. The booklet asked for the finished weld to stand about 1/8 inch, roughly 3 mm, above the plate, which adds further metal.

## Compare a narrower vee

A common modern preparation for manual welding of plate of this thickness is a 60° included vee, θ = 30°, with tan 30° ≈ 0.577. Keeping the same gap:

**A = 4.8 × 10 + 10² × 0.577 = 48 + 57.7 = 105.7 mm²**

The narrower vee needs about 29% less groove metal. Its exact suitability depends on the process, position, access and procedure qualification. The comparison is not a recommendation; it shows how sensitive the weld volume is to the bevel angle.

```figure
type: compare
title: Groove area in 10 mm plate, 4.8 mm root gap
cols: 90° included vee | 60° included vee
best: 2
caption: The bevel angle changes the deposited metal by almost a third before any reinforcement is added.
- Bevel each side | 45° | 30°
- Groove area | 148 mm² | 105.7 mm²
- *Weld metal per metre | About 1.16 kg | About 0.83 kg
```

## Convert area into mass and time

Steel's density is about 7.85 g/cm³, or 7.85 × 10⁻⁶ kg/mm³. One metre of the 90° groove holds:

**148 mm² × 1,000 mm × 7.85 × 10⁻⁶ kg/mm³ ≈ 1.16 kg**

The 60° groove holds about 0.83 kg per metre. The difference, about 0.33 kg per metre, must be melted, deposited and allowed to shrink. For the 170 mm crack, the absolute amounts are small, but the principle scales. On long seams, the bevel angle is one of the largest levers on cost and distortion.

For the booklet's own common case, a 3/8 inch plate (about 9.5 mm) with a 3/16 inch gap (about 4.76 mm) at 90°:

**A = 4.76 × 9.5 + 9.5² × 1 ≈ 45.2 + 90.25 ≈ 135.5 mm²**

The oxyacetylene process of the day deposited metal slowly and heated a broad area, so a wide, open vee helped the welder see and fuse the root. With the arc processes used for most structural and pressure repairs today, narrower grooves are often practical. The process sets the preparation, not the other way round.

## Root face, backing and access from both sides

Two refinements matter in repair work:

- **Root face and backing.** A small land at the root, or a backing strip, can support the first pass and control penetration. Whether either is acceptable depends on the service and the applicable standard; a permanent backing strip, for example, can trap a crevice that later corrodes or cracks.
- **Double-sided preparations.** For thicker plate, welding from both sides with a double-V halves the depth of each vee and balances shrinkage through the thickness. The booklet hinted at this for heavy beams, calling for a double bevel on sections over an inch thick. It also used a second welder on the far side of firebox seams to smooth the root while the metal was still red hot.

## The tank case: specifying the excavation

This is an illustration. For the 170 mm crack in the 10 mm tank plate, the workshop specifies:

- excavate by grinding along the full mapped length plus a margin beyond each end;
- confirm with dye penetrant that no crack indication remains before welding;
- form a single-V groove with an included angle and root gap within the range of the qualified procedure the workshop intends to use;
- grind the groove ends to a gentle taper, so the weld starts and finishes in sound metal rather than at an abrupt step.

The groove's final depth is set by where sound metal is found, not by a drawing. If the crack turns out to run deeper or longer than mapped, the supervisor reviews the decision from Chapter 1 before continuing, because a much larger excavation may make an insert a better repair.

```figure
type: steps
title: Preparing a crack for repair welding
caption: The groove depth follows the defect; inspection, not appearance, decides when the crack is gone.
- Map the crack | penetrant or magnetic particle
- Excavate | full length plus a margin
- *Confirm removal | inspect the clean groove
- Shape the groove | angle and gap per procedure
- Taper the ends | start and stop in sound metal
```

## Exercise: groove area for thicker plate

Calculate the groove area for 16 mm plate with a 3 mm root gap, first for a 60° included single vee and then for a symmetrical double vee, each side 8 mm deep with a 60° included angle and the same 3 mm gap through the full thickness.

For the single vee, **A = 3 × 16 + 16² × 0.577 ≈ 48 + 147.7 ≈ 195.7 mm²**. For the double vee, each side contributes **8² × 0.577 ≈ 36.9 mm²**, so the two sides give about 73.9 mm², plus the gap of **3 × 16 = 48 mm²**, for about 121.9 mm² in total. The double vee needs about 38% less metal and balances shrinkage through the thickness, but it needs access to both sides, which a repair may not have.
