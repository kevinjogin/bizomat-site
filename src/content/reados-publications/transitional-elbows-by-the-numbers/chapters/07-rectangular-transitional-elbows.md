---
book: transitional-elbows-by-the-numbers
chapterSlug: rectangular-transitional-elbows
order: 7
title: "Rectangular elbows that change size"
description: "Develop F4, a rectangular elbow narrowing from 400 to 300 mm as it turns: wrappers stretched out as exact trapezoids, warped cheeks triangulated, and cheeks cut to the elevation 5.3 mm short."
draft: false
---

A rectangular elbow of constant size is made from two flat cheeks and two curved wrappers, and every piece develops exactly: the cheeks are drawn in their true shape from the elevation, and the wrappers are stretched out to the arc lengths of the throat and heel. Make the elbow change size as it turns, and that tidy arrangement breaks in one of two ways, depending on which dimension changes. One way leaves every piece exact; the other leaves the wrappers exact and warps the cheeks.

This chapter develops F4, the rectangular elbow at the DX-3 fan inlet box. It shows which change of size keeps the pieces flat, stretches out the wrappers as exact trapezoids, triangulates the warped cheeks, measures how far they depart from the elevation's shape, and ends with cheeks cut to that shape.

## Two ways to change size

A rectangular elbow has two dimensions at each section: its **depth**, measured in the plane of the bend from throat to heel, and its **width**, measured across the bend between the cheeks.

- If the **depth** changes and the width stays constant, the cheeks are flat and parallel, and their shape is whatever the elevation shows: the throat and heel curves need not be concentric arcs. The wrappers are bent in one direction only and stretch out to the lengths of the throat and heel curves. Every piece is exact. READOS's [Rectangular Duct Fittings by the Numbers](/reados/publications/rectangular-duct-fittings-by-the-numbers/) covers elbows of this kind.
- If the **width** changes, the cheeks cannot both stay in parallel planes. At least one cheek must move sideways as it goes round the bend, and a cheek that moves sideways while its edges follow the throat and heel curves is a warped surface. It needs triangulating.

F4 is the second kind. This is an illustration. The fan's inlet box needs a 300 mm wide connection, the duct arriving at it is 400 mm wide, and there is no room for a separate transition, so the elbow does the narrowing as it turns.

## F4's geometry

The job sheet gives:

- **bend**: 90°, throat radius 150 mm, heel radius 350 mm, so the depth is 200 mm throughout;
- **inlet**: 400 mm wide by 200 mm deep;
- **outlet**: 300 mm wide by 200 mm deep;
- **narrowing**: shared equally by the two cheeks, so each moves inward by 50 mm, at a uniform rate through the bend.

The axes put the bend's axis along y, through the origin. A section at angle φ round the bend lies in the plane through the y axis at angle φ from the inlet. Its throat is at radius 150 mm and its heel at 350 mm from the axis, and its width is 400 − 100 × φ ÷ 90° mm. A point on the +y cheek at radius r and angle φ is therefore at (r cos φ, w ÷ 2, r sin φ), where w is the section's width.

## The wrappers are exact

The heel wrapper lies on a cylinder of 350 mm radius around the bend's axis: every point on it is 350 mm from the axis, whatever its width. A cylinder is developable, so the heel wrapper unrolls exactly. Its length round the bend is the arc 350 × π ÷ 2 = **549.8 mm**, and its width at each point is the section's width, changing uniformly from 400 to 300 mm. Unrolled, it is a **trapezoid**: 549.8 mm long, 400 mm wide at one end and 300 mm at the other, with each long edge sloping inward by 50 mm.

The throat wrapper is the same on a 150 mm cylinder: a trapezoid **235.6 mm** long, 400 mm wide at the inlet and 300 mm at the outlet.

The wrappers' sloping edges are the lines along which they meet the cheeks. On the heel wrapper, each is √(549.8² + 50²) = **552.0 mm** long; on the throat wrapper, √(235.6² + 50²) = **240.9 mm**. Those two numbers matter: they are the lengths the cheeks' curved edges must have.

```figure
type: compare
title: F4's wrappers, stretched out
rowhead: Wrapper
cols: Length round the bend | Width at inlet and outlet | Sloping edge
caption: This is an illustration. Mean-line dimensions. Each wrapper lies on a cylinder about the bend's axis, so its stretch-out is exact.
- * Heel, R350 | 549.8 | 400 and 300 | 552.0
- Throat, R150 | 235.6 | 400 and 300 | 240.9
```

## The cheeks are warped

Each cheek is bounded by four edges: its inlet edge, 200 mm from throat to heel in the inlet plane; its outlet edge, the same in the outlet plane; and its throat and heel edges, the curves along which it meets the wrappers. Its inlet edge lies at y = 200 and its outlet edge at y = 150. The straight radial lines across the cheek, from throat to heel at each angle φ, are each at a single y, but y changes from one to the next.

A surface made of straight lines that turn steadily as they move sideways is warped: no plane contains it. The simplest measure of how much is to take three of the cheek's corners, the inlet throat, the inlet heel and the outlet heel, and ask how far the fourth, the outlet throat, lies from their plane. For F4's cheek, it lies **28.3 mm** away. That is far too much for the cheek to be cut flat and pushed into place; it must be developed.

## Triangulating a cheek

The cheek is divided at every 15° round the bend, giving seven radial lines, each 200 mm long from throat to heel. Each strip between neighbouring radial lines is split by a diagonal from the throat point at one angle to the heel point at the next. Because the cheek's warp is uniform, every strip is the same shape, and every diagonal is **208.9 mm**.

The steps along the edges are the true lengths of the cheek's curved edges between division points. Those edges are the wrappers' sloping edges, so each step is one sixth of 240.9 mm along the throat, **40.1 mm**, and one sixth of 552.0 mm along the heel, **92.0 mm**. Using the true edge lengths, not the elevation's arcs of 39.3 and 91.6 mm, is what makes the cheek meet the wrappers.

```figure
type: formula
title: True length of a cheek's curved edge
formula: edge = √((r × θ)² + s²)
caption: The cheek's throat and heel edges are helices on the wrappers' cylinders. Each edge is the hypotenuse of its arc length and the cheek's sideways movement.
- r | Radius of the edge, 150 mm at the throat and 350 mm at the heel
- θ | Angle of the bend in radians, π ÷ 2 for 90°
- s | Sideways movement of the cheek through the bend, 50 mm
step: Throat: √(235.6² + 50²) = 240.9 mm, steps of 40.1 mm at 15°
step: Heel: √(549.8² + 50²) = 552.0 mm, steps of 92.0 mm at 15°
```

## The cheek's pattern

Laid out strip by strip from the inlet edge, the cheek's pattern is close to a quarter of an annulus, but not quite. Its inlet and outlet edges, each 200 mm, meet at an angle of **89.15°** where the radial lines would meet if extended, instead of the elevation's 90°. Its curved edges are 240.9 and 552.0 mm long against the elevation's 235.6 and 549.8 mm. Its area is about 79,300 mm² against the elevation's 78,540 mm², about 1% more.

Those differences look small, and they are: the cheek is only slightly warped, and its pattern is only slightly different from the elevation's shape. But the throat edge's 5.3 mm is enough to leave a visible gap, and the pattern must be laid out from the triangles, not traced from the elevation.

## Laying out a cheek

Because every strip of the cheek is the same shape, the layout is quick, and it shows clearly how the triangulated cheek differs from the elevation.

1. **Strike the inlet edge**, 200 mm, from the throat point to the heel point.
2. **Find the next heel point** at 92.0 mm along the heel from the inlet heel point and at the diagonal's 208.9 mm from the inlet throat point.
3. **Find the next throat point** at 40.1 mm along the throat from the inlet throat point and at the radial line's 200 mm from the new heel point.
4. **Repeat** five more times, to 90°. The last radial line is the outlet edge.
5. **Check** that the outlet edge is 200 mm and that the angle between the inlet and outlet edges, extended to meet, is 89.15°.
6. **Draw the curved edges** through the throat points and through the heel points with a flexible batten.

On a cutting table, the same cheek is given as a list of fourteen points, seven on each edge, and the table joins them with smooth curves. The other cheek is the mirror image, not a copy: the two cheeks warp in opposite directions, and a pair cut from the same template the same way up will not both fit.

## Forming and assembly

The cheeks are cut flat and twisted into place as the elbow is assembled. In 0.8 mm sheet, a 28 mm twist across a 200 by 550 mm cheek is easily taken up by hand; in heavier sheet, it would need to be formed. The wrappers are rolled to their radii, 150 and 350 mm, as ordinary curved wrappers, and their edges are flanged or folded to receive the cheeks.

The joints between cheeks and wrappers are the same longitudinal seams used on any rectangular elbow, typically a lock seam formed on the wrapper's edge with the cheek's edge turned into it. Their allowances are added to the wrappers' sloping edges and the cheeks' curved edges after the mean-line patterns are checked, and Chapter 10 lists them. On a warped cheek, the lock must follow an edge that is slightly twisted along its length, which a hand seamer manages easily in 0.8 mm sheet; a machine-formed lock may need the cheek's edge eased with a mallet as it goes in.

The shop assembles F4 on a flat table, with the inlet end clamped square. It checks four things before closing the seams:

1. **the outlet is square to the inlet**, at 90°, measured with a square on the inlet face;
2. **the outlet is 300 mm wide** between the cheeks, and the inlet 400 mm;
3. **the depth is 200 mm** at the inlet, the outlet and the middle of the bend;
4. **the cheeks are symmetric**: each has moved 50 mm inward at the outlet, checked from a centre line marked on the wrappers.

```figure
type: checklist
title: F4 before seaming
caption: Each check confirms one dimension that the warped cheeks could disturb.
- Wrappers stretched out as trapezoids | 549.8 and 235.6 mm long, 400 to 300 mm wide
- Cheeks laid out from triangles | 15° divisions, diagonals 208.9 mm
- Cheek edges stepped at true lengths | 40.1 mm throat, 92.0 mm heel
- Outlet square to inlet and 300 mm wide | measured from a centre line on the wrappers
- x Cheeks traced from the elevation | throat edge 5.3 mm short
```

## Other ways to narrow an elbow

There are two alternatives to F4's warped cheeks, and each has its place.

- **One cheek flat.** If one cheek stays in its plane and the other moves the full 100 mm inward, the flat cheek is exactly the elevation's shape and only the other cheek is warped, more strongly. The wrappers become trapezoids with one square edge and one sloping edge. This suits an elbow that must sit flat against a wall on one side.
- **Narrow in a separate transition.** A constant-size elbow followed by a straight rectangular transition keeps every piece flat, at the cost of length. Where space allows, it is simpler to make.

F4 shares the narrowing between the cheeks because the fan inlet is central on the box, and because sharing it halves each cheek's warp.

## The error: cheeks traced from the elevation

This is an illustration. The first pair of F4 cheeks was traced directly from a full-size elevation of the elbow, as a quarter annulus of 150 and 350 mm radii. The wrappers were developed correctly as trapezoids. At assembly, the cheeks would not close onto the wrappers: their throat edges were 235.6 mm long against the throat wrapper's 240.9 mm sloping edges, **5.3 mm short**, and their heel edges 549.8 mm against 552.0 mm, 2.2 mm short.

Forced together, the cheeks pulled the outlet end of the wrappers round, and the outlet came out about a degree short of square. The fan inlet's flexible connector would have taken up the error, but the shop's rule is that fittings are made to the drawing, not to the connector. The cheeks were remade from the triangulated pattern.

The worker had not done anything wrong by the usual rules: rectangular elbow cheeks are always traced from the elevation, and on every elbow the shop had made before, that was correct. The rule assumes the cheeks are flat, and on an elbow whose width changes, they are not.

```figure
type: bars
title: F4 cheek edges, elevation against true
unit: mm
max: 600
caption: This is an illustration. The warped cheek's edges are longer than the elevation's arcs, by 5.3 mm at the throat and 2.2 mm at the heel.
- Throat, elevation | 235.6
- * Throat, true | 240.9
- Heel, elevation | 549.8
- * Heel, true | 552.0
```

## Exercise: one cheek flat

Suppose F4 were made with one cheek flat and the other moving the full 100 mm inward. Find the sloping edges of the throat and heel wrappers on the moving cheek's side. How much longer is the moving cheek's throat edge than the elevation's arc?

**Worked answer.**

- The throat wrapper's sloping edge is √(235.6² + 100²) = **255.9 mm**.
- The heel wrapper's sloping edge is √(549.8² + 100²) = **558.8 mm**.
- The moving cheek's throat edge is 255.9 − 235.6 = **20.3 mm** longer than the elevation's arc, nearly four times F4's 5.3 mm.

Doubling the sideways movement more than doubles the extra length, because the edge grows with the square of the movement. Sharing the narrowing between both cheeks keeps each one closer to flat.
