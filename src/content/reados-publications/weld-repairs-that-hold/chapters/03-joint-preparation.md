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

## Root opening and fit-up are part of the design

The groove area formula has a feature worth noticing: the root gap term g × t grows with plate thickness. In 10 mm plate, every extra millimetre of gap adds 10 mm² of groove area. For the 60° preparation, opening the gap from 4.8 mm to 6.8 mm, a common enough result of careless fit-up, raises the area from about 105.7 mm² to about 125.7 mm², an increase of about 19%. The welder deposits a fifth more metal than planned, and the joint shrinks accordingly.

A gap that is too tight causes the opposite problem. The root cannot fuse fully, leaving a lack of penetration that acts as a built-in crack, the defect a repair can least afford. For the same 60° groove in 10 mm plate, a 3 mm gap gives about 87.7 mm² of area, less metal, but only if the welder can still achieve a sound root with the chosen process.

Other fit-up conditions matter as much as the gap:

- **Misalignment**, sometimes called hi-lo, where one plate surface sits higher than the other, creates a step that concentrates stress and makes fusion at the root harder. Procedures and standards limit it.
- **Uneven bevels** leave one side of the joint easier to fuse than the other.
- **Contamination** such as paint, oil, rust, scale or moisture on the groove faces feeds porosity and hydrogen into the weld.

For a repair, the excavation becomes the joint, so these checks apply to the ground-out groove as much as to a new fabrication. The tank repair specification therefore asks for the groove angle, gap and cleanliness to be checked against the procedure before welding begins.

```figure
type: bars
title: Groove area as the root gap changes
unit: mm²
max: 140
caption: 60° single-V in 10 mm plate. Each extra millimetre of gap adds 10 mm² before reinforcement.
- 3.0 mm gap | 87.7
- *4.8 mm gap | 105.7
- 6.8 mm gap | 125.7
```

## Choosing how to excavate

Several methods remove cracked metal, each with consequences for the repair:

- **Grinding** is controllable and leaves a clean surface, but it is slow for deep or long excavations and can smear metal over a crack, hiding it from penetrant inspection unless the surface is properly prepared.
- **Air carbon arc gouging** removes metal quickly by melting it with an arc and blowing it away with compressed air. It leaves a carbon-enriched layer on the groove surface that is normally ground off before welding, because carbon pick-up can harden and crack the weld.
- **Oxy-fuel gouging**, a descendant of the cutting torch the 1919 booklet used for its bevels, works on carbon steels but heats a wider zone.
- **Machining or milling** gives the most accurate groove where the part can be set up on a machine or a portable machining head can reach it.

Whatever the method, the groove surface must end up clean, smooth and free of notches, with the shape the procedure requires. The excavation is then inspected, and only when inspection confirms that no crack remains does welding begin.

## When the crack goes right through

If a crack runs through the full thickness, the excavation goes through too, and the repair becomes a full-penetration butt weld across an open slot. The welder then needs either access to both sides, so the back of the joint can be ground and welded, or a means of supporting the root from behind, such as a backing bar or a ceramic backing tape. Each choice has implications: welding from both sides balances shrinkage but needs access; a permanent backing bar leaves a crevice that may be unacceptable in corrosive or cyclic service; temporary backings must be removed and the root inspected.

In the firebox, the booklet often had a second welder working on the far side of the plate while the first welded. The modern equivalent is a planned back-gouge and back-weld, or a qualified procedure for single-sided welding with suitable backing.

## Reinforcement and finishing

The cap of a weld usually stands a little proud of the plate, and its area adds to the metal deposited. A rough estimate treats the cap as a shallow curved profile of area about two-thirds of its width times its height.

For the 60° groove in 10 mm plate with a 4.8 mm gap, the top of the groove is about 4.8 + 2 × 10 × tan 30° ≈ 16.35 mm wide. A cap overlapping each edge by 1.5 mm and standing 2 mm high has an area of roughly:

**⅔ × (16.35 + 3) × 2 ≈ 25.8 mm²**

That is about a quarter of the groove area again. Excess reinforcement wastes metal, adds heat, and creates a sharper change of section at the weld toes, where fatigue cracks like to start. In fatigue-sensitive areas, procedures may call for the cap to be dressed smooth or ground flush, which also makes surface inspection more reliable. The booklet's instruction to stand the weld about 1/8 inch proud reflects a time when extra metal was seen mainly as extra strength.

## A preparation checklist

Before the first pass of any repair weld, confirm that:

1. the defect has been fully removed and the clean groove inspected;
2. the groove angle, root gap and root face match the qualified procedure;
3. misalignment is within the procedure's limits;
4. the groove and a margin either side are clean, dry and free of coatings;
5. access is adequate for the welder and for inspection, on both sides if required;
6. any backing is suitable for the service and will be removed or accepted as the procedure states.

Each item is quick to check and expensive to discover afterwards.

## From volume to time

Weld volume also drives time, which helps when planning a repair or comparing options. This is an illustration with assumed figures. The tank crack groove is about 170 mm long, with about 105.7 mm² of groove and 25.8 mm² of cap, so about 131.5 mm² in total. Its volume is about 131.5 × 170 ≈ 22,360 mm³, or about 0.18 kg of weld metal at 7.85 g/cm³.

If the welder deposits an assumed 1.2 kg per hour while the arc is running, that is roughly 9 minutes of arc time. Arc time is only part of the work: cleaning between passes, changing electrodes, checking interpass temperature and moving position all take time. With an assumed operating factor of 30%, meaning the arc runs for 30% of the welder's time on the job, the welding itself takes around half an hour, before excavation, preheat and inspection are counted. Use your own process data for real estimates; the method, not the figures, is the point.

## Exercise: groove area for thicker plate

Calculate the groove area for 16 mm plate with a 3 mm root gap, first for a 60° included single vee and then for a symmetrical double vee, each side 8 mm deep with a 60° included angle and the same 3 mm gap through the full thickness.

For the single vee, **A = 3 × 16 + 16² × 0.577 ≈ 48 + 147.7 ≈ 195.7 mm²**. For the double vee, each side contributes **8² × 0.577 ≈ 36.9 mm²**, so the two sides give about 73.9 mm², plus the gap of **3 × 16 = 48 mm²**, for about 121.9 mm² in total. The double vee needs about 38% less metal and balances shrinkage through the thickness, but it needs access to both sides, which a repair may not have.
