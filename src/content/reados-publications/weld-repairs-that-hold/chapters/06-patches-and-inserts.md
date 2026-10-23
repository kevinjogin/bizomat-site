---
book: weld-repairs-that-hold
chapterSlug: patches-and-inserts
order: 6
title: "Patches and inserts"
description: "Shape, orient and size a welded insert so its edges sit in sound metal, avoid lines of weakness and keep weld length and restraint under control."
draft: false
---

When damage covers an area rather than a line, the repair becomes an insert: cut out the damaged region and weld in new plate. The 1919 Airco booklet devotes more pages to patches than to any other repair, and its central rule is striking: patches on firebox sheets should be triangular whenever possible. Its reason was that the sides of a triangle do not run parallel with the rows of staybolt holes, as the sides of a rectangle would, and so do not weaken the joint.

This chapter explains that reasoning, compares patch shapes by the weld length they need, and sets out what a modern insert must get right.

## Why edge position matters more than area

A plate drilled with rows of holes is weakest along the lines through them. The strength of that line, relative to the solid plate, is the ligament efficiency:

**ligament efficiency = (p − d) / p**

where p is the hole pitch along the row and d the hole diameter. For holes 25 mm in diameter at a 100 mm pitch:

**(100 − 25) / 100 = 0.75, or 75%**

A rectangular patch whose edge runs along such a row places its weld exactly where the plate is already reduced to three-quarters of its section, and runs the weld's heat and shrinkage through the ligaments between holes. A triangular patch crosses rows at an angle, so no single weld edge follows a line of holes. That is the booklet's argument in modern language.

```figure
type: svg
title: Patch edges and rows of holes
alt: Two panels showing a regular grid of holes. In the left panel, a rectangular patch has edges running along the rows of holes. In the right panel, a triangular patch has edges that cross the rows at an angle.
caption: A rectangle's edges can follow lines of holes; a triangle's edges cross them, as the 1919 booklet argued.
viewbox: 0 0 600 260
body:
<rect class="bx" x="20" y="20" width="260" height="210" rx="4"/>
<rect class="bx" x="320" y="20" width="260" height="210" rx="4"/>
<g class="fi"><circle cx="50" cy="50" r="5"/><circle cx="90" cy="50" r="5"/><circle cx="130" cy="50" r="5"/><circle cx="170" cy="50" r="5"/><circle cx="210" cy="50" r="5"/><circle cx="250" cy="50" r="5"/><circle cx="50" cy="90" r="5"/><circle cx="90" cy="90" r="5"/><circle cx="130" cy="90" r="5"/><circle cx="170" cy="90" r="5"/><circle cx="210" cy="90" r="5"/><circle cx="250" cy="90" r="5"/><circle cx="50" cy="130" r="5"/><circle cx="90" cy="130" r="5"/><circle cx="130" cy="130" r="5"/><circle cx="170" cy="130" r="5"/><circle cx="210" cy="130" r="5"/><circle cx="250" cy="130" r="5"/><circle cx="50" cy="170" r="5"/><circle cx="90" cy="170" r="5"/><circle cx="130" cy="170" r="5"/><circle cx="170" cy="170" r="5"/><circle cx="210" cy="170" r="5"/><circle cx="250" cy="170" r="5"/><circle cx="50" cy="210" r="5"/><circle cx="90" cy="210" r="5"/><circle cx="130" cy="210" r="5"/><circle cx="170" cy="210" r="5"/><circle cx="210" cy="210" r="5"/><circle cx="250" cy="210" r="5"/></g>
<g class="fi"><circle cx="350" cy="50" r="5"/><circle cx="390" cy="50" r="5"/><circle cx="430" cy="50" r="5"/><circle cx="470" cy="50" r="5"/><circle cx="510" cy="50" r="5"/><circle cx="550" cy="50" r="5"/><circle cx="350" cy="90" r="5"/><circle cx="390" cy="90" r="5"/><circle cx="430" cy="90" r="5"/><circle cx="470" cy="90" r="5"/><circle cx="510" cy="90" r="5"/><circle cx="550" cy="90" r="5"/><circle cx="350" cy="130" r="5"/><circle cx="390" cy="130" r="5"/><circle cx="430" cy="130" r="5"/><circle cx="470" cy="130" r="5"/><circle cx="510" cy="130" r="5"/><circle cx="550" cy="130" r="5"/><circle cx="350" cy="170" r="5"/><circle cx="390" cy="170" r="5"/><circle cx="430" cy="170" r="5"/><circle cx="470" cy="170" r="5"/><circle cx="510" cy="170" r="5"/><circle cx="550" cy="170" r="5"/><circle cx="350" cy="210" r="5"/><circle cx="390" cy="210" r="5"/><circle cx="430" cy="210" r="5"/><circle cx="470" cy="210" r="5"/><circle cx="510" cy="210" r="5"/><circle cx="550" cy="210" r="5"/></g>
<path class="la draw" d="M90 90H210V170H90Z"/>
<path class="la draw" d="M450 62L532 205H368Z"/>
<text class="tx txs" x="150" y="252" text-anchor="middle">Edges follow the rows</text>
<text class="tx txs" x="450" y="252" text-anchor="middle">Edges cross the rows</text>
```

## Round the corners

The booklet asked for patch corners to be rounded to a radius of about 3/4 inch, roughly 19 mm. A sharp internal corner concentrates stress and is hard to weld with full fusion, because the welder must stop and turn in a confined space. A generous radius lets the weld run continuously and spreads stress around the corner. Modern repair codes and procedures specify minimum corner radii for flush inserts; the right value comes from the applicable standard, not from the booklet.

## Compare shapes by weld length

Shape also changes how much welding a given area needs. For an equal area, a circle has the shortest perimeter, and shapes with sharp angles have longer ones. Take an area equal to a 400 mm × 300 mm rectangle with 50 mm corner radii, about 117,900 mm²:

- a circle of the same area has a radius of about 193.7 mm and a circumference of about **1,217 mm**;
- the rounded rectangle has a perimeter of about **1,314 mm**;
- an equilateral triangle of the same area, before its corners are rounded, has sides of about 521.7 mm and a perimeter of about **1,565 mm**.

The triangle needs about 19% more weld than the rounded rectangle for the same area. The booklet accepted that cost to keep weld edges off the lines of holes. Without rows of holes, as in an unstayed plate or a tank wall, that trade-off may favour a rounded rectangle or a circle instead. The right shape depends on what the surrounding plate looks like.

```figure
type: bars
title: Weld length for inserts of equal area
unit: mm
max: 1700
caption: About 117,900 mm² in each case. Shape trades weld length against where the edges fall.
- Circle | 1217
- *Rectangle, 50 mm corner radii | 1314
- Equilateral triangle, sharp corners | 1565
```

## Orient inserts in shells

On cylindrical shells and tanks, the booklet asked for the base of a triangular patch to run with the circumference. Modern thinking adds a reason: in a pressurised cylinder, the hoop stress around the circumference is about twice the longitudinal stress, so a weld running along the cylinder's length carries the larger stress. Orientation, seam position and existing seams all affect where an insert's welds should go, which is why repairs to pressure shells follow the applicable repair standard and are reviewed before work begins.

## What a modern insert must get right

Whatever its shape, a sound insert:

- **sits wholly in sound metal**, with its edges clear of the damage and of thinned areas confirmed by thickness measurement;
- **keeps clear of existing welds, holes and changes of section**, by distances set in the applicable standard or procedure;
- **matches the original plate's material and thickness**, or justifies any difference;
- **uses full-penetration butt welds** where the original plate was continuous, rather than a lap patch, which the booklet already distrusted and which leaves a crevice and an offset load path;
- **follows a planned sequence**, as in Chapter 4, so the insert's shrinkage is spread rather than concentrated at one edge or corner.

The booklet also extended patches to include a full row of staybolts where possible, and cut half door sheets between the first and second rows of staybolts rather than close to the door hole. Both choices put the weld in plate whose support and stiffness were predictable.

## The tank case: an insert near the base

This is an illustration. While the crack is being repaired, thickness readings near the tank's base reveal a corroded region about 350 mm by 250 mm, with remaining thickness down to 6.5 mm on the nominal 10 mm plate. There are no holes nearby. The workshop decides on a flush insert rather than build-up (Chapter 8 discusses that choice).

It chooses a rounded rectangle 400 mm by 300 mm with 50 mm corner radii, placed so every edge lies in plate measuring at least 9.4 mm, at least the procedure's minimum distance from the tank's existing vertical seam. The insert is cut from new plate of matching grade and thickness. Welding follows a back-step sequence around the perimeter, starting partway along a long side rather than at a corner. The total weld length is about 1,314 mm.

## Sizing the insert

An insert is sized from the thickness survey and crack map, not from the visible damage. Its edges must sit in plate that inspection has confirmed to be sound and of adequate thickness, with a margin beyond the last thinned reading or crack indication. Several further considerations push the size up or down:

- **Distance from existing welds, holes and openings.** Placing a new weld close to an existing one overlaps their heat-affected zones and residual stresses. Standards and procedures set minimum separations; where an insert would fall too close, it is often better to enlarge it so that it takes in the nearby feature or seam completely.
- **Shape proportions.** Very long, narrow inserts concentrate shrinkage along their long sides and can pull the surrounding plate out of shape. A more compact shape usually behaves better.
- **Practical access.** The insert must be weldable around its whole perimeter, on both sides if the procedure requires, and inspectable afterwards.
- **Future repairs.** An insert that leaves a narrow strip of old plate between itself and the next seam may make the next repair harder. Sometimes extending to the seam is the better long-term choice.

The booklet showed the same instinct when it extended firebox patches to include a whole row of staybolts, and when it cut half door sheets between the first and second rows rather than close to the door hole.

## Matching the curvature of a shell

Inserts in curved parts must be formed to the curvature before they are fitted. The error from fitting a flat plate into a curved shell is larger than many people expect. The height of an arc over a straight chord, called the sagitta, is:

**s = R − √(R² − (c/2)²)**

where R is the shell radius and c the chord length.

The tank in this book is 3 m in diameter, so R = 1,500 mm. Across the 400 mm width of the base insert, measured around the circumference:

**s = 1,500 − √(1,500² − 200²) ≈ 1,500 − 1,486.61 ≈ 13.39 mm**

A flat insert would sit about 13 mm away from the shell at its centre, far beyond any fit-up tolerance. Across a 200 mm chord, the error would still be about 3.3 mm. The insert must therefore be rolled to the shell radius, and its fit checked with a template before welding. Forcing a poorly formed insert into place with tacks and clamps locks in stress before welding even begins.

## Choosing the insert material

The insert becomes part of the structure, so its material deserves the same care as the welding procedure:

- **Match the grade and condition** of the original plate where it is known, or choose a material that the design, the welding procedure and the applicable standard all accept. A stronger plate is not automatically better: a much harder or stronger insert concentrates strain in the softer plate around it.
- **Match the thickness.** An insert thinner than the surrounding plate weakens the repair. One that is thicker creates a step, which concentrates stress and complicates the joint; where a thickness change is unavoidable, standards typically require the thicker part to be tapered to the thinner at a specified slope.
- **Keep traceability.** Record the plate's specification, heat or batch number and certificate, and mark the insert so that its origin can be confirmed later. For pressure equipment, material traceability is usually a formal requirement.
- **Check weldability against the procedure.** The welding procedure must be qualified for the combination of insert and existing plate, including any difference in composition between new steel and old.

Old plate complicates the last point. Steel from a century ago may differ from any modern grade in carbon, sulphur, phosphorus and cleanliness. Chapter 5's advice applies here: test the existing plate's composition before choosing the insert and the procedure, rather than assuming that any mild steel will do.

For the tank, the workshop records the new plate's grade and heat number, the measured composition of the old plate from Chapter 5, and the procedure's qualified range covering both, so that anyone repairing the tank again starts with the same information.

```figure
type: bars
title: Gap from fitting a flat plate into a 3 m diameter shell
unit: mm
max: 15
caption: Sagitta at the centre of the chord, for a shell radius of 1,500 mm. Inserts must be formed to the curvature.
- 200 mm chord | 3.34
- 300 mm chord | 7.52
- *400 mm chord | 13.39
```

## Preparing and fitting the insert

The insert and the opening are prepared together:

1. **Cut the opening** to the planned shape with radiused corners, by a method that leaves an edge suitable for bevelling.
2. **Cut the insert** from plate of matching grade and thickness, slightly oversize if it will be trimmed to fit.
3. **Form the insert** to the part's curvature where needed, and check it with a template.
4. **Bevel both edges** to the procedure's groove geometry, keeping the root gap even around the perimeter.
5. **Check the fit** for gap, misalignment and contact before tacking.
6. **Tack in the planned positions**, avoiding corners, with tacks made to the welding procedure.

An even root gap around the whole perimeter is the single most important fit-up feature. A gap that varies from tight to wide changes the heat input, penetration and shrinkage along the weld, and makes the closing segments harder still.

## Lap patches and doublers

A lap patch, or doubler, is a plate laid over the damaged area and fillet welded around its edge. It is quick, needs no cutting of the original plate and does not require a full-penetration weld. It also has serious drawbacks:

- It leaves the damaged plate in place underneath, where corrosion can continue unseen.
- It creates a crevice between the plates that traps moisture and corrodes.
- It offsets the load path, so load must turn through the fillet welds, which concentrates stress at their toes and roots.
- It is difficult to inspect, because the original plate and the fillet roots are hidden.

The 1919 booklet already judged that a lap weld did not make a strong, tight joint compared with a butt weld. Modern codes generally restrict lap patches on pressure-retaining parts, and the United States steam locomotive rule quoted in Chapter 8 requires approval even for flush patches on unstayed boiler portions. Outside regulated equipment, a doubler may be acceptable as a temporary measure or on lightly loaded structures, but it should be recorded as such and its condition monitored.

## Inspecting an insert

Insert welds are inspected around their whole perimeter, with particular attention to the corners and to the closing segments, which carry the most restraint. Surface methods find cracks at the toes and corners; volumetric methods, where the standard requires them, check fusion through the thickness. Thickness readings around the outside of the insert confirm that its edges really did land in sound plate. Any indication at a corner or closing segment is worth investigating carefully, because those are the places where a sequence or fit-up problem would show first.

For the tank, the base insert is inspected visually around its perimeter, penetrant tested after the delayed hold, and surrounded by thickness readings at 50 mm intervals, all recorded in the dossier with the template check that confirmed its curvature.

## Exercise: ligament efficiency and patch edges

A plate has a row of 22 mm holes at a 90 mm pitch. Calculate the ligament efficiency, then explain why a patch edge laid along that row would be a poor choice even if the weld itself were perfect.

The ligament efficiency is **(90 − 22) / 90 ≈ 0.756, or about 76%**. A weld edge along the row adds the weld's residual tension and any weld imperfection to a line that already has only about three-quarters of the plate's section. Relocating the edge so it crosses the row at an angle, or moves to plate between rows, avoids stacking those weaknesses on one line.
