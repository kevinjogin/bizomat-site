---
book: surfaces-that-make-parts
chapterSlug: extruded-revolved-and-swept-surfaces
order: 3
title: "Extruded, revolved and swept surfaces"
description: "Build surfaces by moving one profile: extrude it, revolve it or sweep it along a path, and predict when a sweep will fold back on itself before it fails."
draft: false
---

The simplest surfaces are made by moving a single profile. Push it along a straight line and you have an extruded surface; spin it about an axis and you have a revolved surface; drag it along a curve and you have a swept surface. These are the surface versions of the first solid features most designers learn, and they behave the same way with one difference: the profile does not have to be closed, and the result has no end caps.

That difference makes these tools more useful than they first appear. An open profile extruded gives a sheet that can trim, split or check other geometry. A revolved arc gives a smooth lip that no solid fillet would produce as cleanly. This chapter builds the duct's inlet by revolving, uses extruded sheets as working tools, and shows why a sweep can fold back on itself, with a calculation that predicts the failure before the software reports it.

## Extruded surfaces

An extruded surface is a profile moved along a straight direction, usually normal to its sketch plane. A closed profile gives a tube with open ends; an open profile gives a sheet. End conditions work as they do for a solid extrusion: a set depth, symmetrical about the sketch plane, up to a vertex or up to another surface.

On the duct, extruded surfaces are working tools rather than part of the final skin:

- **A trim cylinder for the port hole.** A 12 mm circle sketched on the pressure-switch pad and extruded normal to it gives a cylindrical sheet that will cut the hole in Chapter 6. It is extruded in both directions so that it passes fully through the pad and the blend around it, whatever small changes are made to their positions.
- **A clearance sheet for the frame rail.** The rail's top edge is a straight line in the side view, at 70 mm below the duct axis. Extruded sideways as a sheet 300 mm wide, it represents the rail top without importing the rail model. A minimum-distance measurement between the sheet and the duct's outside will check the clearance.

The rule for working sheets is to make them generously larger than the geometry they act on. A trim tool that ends exactly on the edge of the surface it trims is a tie; a small change in either can leave a sliver uncut. Extend tools 5 mm or so beyond the geometry, and name them so it is clear they are tools, not product.

The clearance check is worth doing now, even though the wall does not exist yet. The flow surface bottom sits at −60 mm. Thickened outwards by 2.5 mm, the outside bottom will be at −62.5 mm, leaving **7.5 mm** above the rail top at −70 mm. If that were too small, the drop or the outlet height would have to change, and it is far cheaper to find that in the skeleton than after the transition is trimmed and knitted.

## Revolved surfaces

A revolved surface spins a profile about an axis. A straight line parallel to the axis gives a cylinder; an arc gives a section of a torus; a spline gives any surface of revolution. The angle can be a full 360° or any part of it.

The duct's inlet is the revolve profile from Chapter 2: a 10 mm quarter arc forming the bell-mouth and a straight line at 60 mm radius forming the round section, from x = 0 to x = 40. Revolved through 360°, it gives a lip that turns smoothly outwards and a cylinder that meets the transition at x = 40.

Two details matter.

**Where the seam falls.** A full revolve has a seam, a line along the surface where the start and end of the rotation meet. Most systems put the seam in the sketch plane. Because the duct will be split on its vertical plane of symmetry, the revolve profile should lie in that plane, so the seam lands on the future parting line. A seam anywhere else creates an extra edge on the inside of the duct that the knit, fillet and draft operations will have to deal with for no benefit.

**Whether to revolve 360° at all.** Some designers revolve only 180° on each side of the split, building each half-shell separately from the start. That keeps the halves independent but doubles the surface work and makes it harder to keep the two halves identical. For a symmetrical part, it is usually better to model the whole flow surface, check it as one, and split it at the end.

## Checking a revolve with Pappus

A surface of revolution has a convenient check. Pappus's centroid theorem says that the area swept by a curve rotated about an axis equals the curve's length multiplied by the distance its centroid travels.

```figure
type: formula
title: Area of a surface of revolution
formula: A = 2π × r̄ × L
caption: This is an illustration. The two pieces of the inlet together have an area of about 17,590 mm², which the CAD area measurement should match.
- A | area of the revolved surface, mm²
- r̄ | radius of the profile curve's centroid from the axis, mm
- L | length of the profile curve, mm
step: Round section: L = 30, r̄ = 60, so A = 2π × 60 × 30 = 11,309.7 mm²
step: Bell-mouth arc: L = π ÷ 2 × 10 = 15.708 mm
step: Arc centroid lies 9.003 mm from the arc centre, along the 45° line, so r̄ = 70 − 9.003 ÷ √2 = 63.634 mm
step: Bell-mouth: A = 2π × 63.634 × 15.708 = 6,280.4 mm²
```

The centroid of a circular arc lies on its bisector at a distance R × sin(θ/2) ÷ (θ/2) from the centre, where θ is the arc angle. For a quarter arc of 10 mm radius, that is 10 × sin 45° ÷ (π/4) = 9.003 mm. The arc's centre sits at 70 mm radius and the centroid lies towards the axis at 45°, so its radius is 70 − 9.003 ÷ √2 = 63.634 mm.

The CAD system's area measurement of the two revolved faces should agree with 11,309.7 mm² and 6,280.4 mm² to the displayed precision. If it does not, the profile is not what you think it is: a tangent relation missing, the arc centre in the wrong place, or the revolve axis offset from the duct axis. The WORKOS tool [Surface and Volume of Revolution (Pappus–Guldinus)](/tools/pappus-revolution/) runs the same calculation for other profiles.

## Swept surfaces

A sweep moves a profile along a path. The profile can be open or closed; so can the path. Options control how the profile is oriented as it travels: it can stay normal to the path, which is the usual choice, or keep a fixed orientation. Further options add twist, guide curves that scale or distort the profile as it travels, and tangency to neighbouring faces at the start and end.

A sweep is the right tool when one cross-section runs along a curved route: a seal groove around an irregular flange, a tube following a bent centreline, a bead or a channel along an edge. On the duct, a sweep makes the tongue of the tongue-and-groove joint between the two half-shells: a small profile, 2 mm wide and 3 mm high, swept along the edge where the flow surface meets the split plane.

```figure
type: compare
title: Which profile-moving surface to use
cols: Moves the profile | Good for | Watch for
caption: The profile can be open or closed in all three. The sweep is the most flexible and the easiest to break.
- Extrude | Along a straight direction | Sheets, trim tools, ruled walls | Tools that end exactly on the edge they cut
- Revolve | About an axis | Lips, bells, round sections, domes | Seam position; axis offset from the intended centre
- *Sweep | Along a curved path | Grooves, beads, tubes, constant-section runs | Profile larger than the path's local radius
```

## When a sweep folds back on itself

Picture a profile travelling around a tight bend. The part of the profile on the inside of the bend moves through a smaller radius than the path itself. If the profile reaches further towards the inside of the bend than the path's radius of curvature, the inside part has to travel through a negative radius: it crosses itself, and the surface folds back. Depending on the system, the sweep fails with an error, or it succeeds and leaves a self-intersecting surface that fails later when it is knitted or thickened.

The rule is simple: **at every point of the path, the profile's extent towards the inside of the bend must be less than the local radius of curvature of the path.** Chapter 6 meets the same rule again for offsets.

This is an illustration of the failure on the duct. An early idea was to build the whole transition as a sweep of the inlet circle along the centreline, with the side and top guides scaling it into the rectangle. The centreline drops 30 mm along the smooth step from Chapter 2. Its curvature is greatest at the ends, where the second derivative of the step is 6. For a drop d over a length L, the end radius of curvature is therefore

**R = L² ÷ (6d)**

With the planned L = 200 mm and d = 30 mm, R = 40,000 ÷ 180 = **222.2 mm**. At the start, the profile's half-height is 60 mm, comfortably less. The sweep built.

Then the layout changed. To clear a new bracket, someone proposed making the whole 30 mm drop within 80 mm. The end radius became 6,400 ÷ 180 = **35.6 mm**, smaller than the 60 mm half-height of the circle at the start of the transition. The sweep failed with a self-intersection error at the inlet end, where the profile is largest, although at the outlet end, where the half-height is only 30 mm, the same radius would have been acceptable.

```figure
type: bars
title: Path radius at the transition ends against the profile it must carry
unit: mm
max: 230
caption: This is an illustration. The 80 mm transition gives a path radius smaller than the 60 mm inlet half-height, so the sweep folds at the inlet end.
- Path radius, 200 mm transition | 222.2
- *Path radius, 80 mm transition | 35.6
- Inlet half-height | 60
- Outlet half-height | 30
```

The failure was detected by the rebuild error, but the calculation would have predicted it before anyone modelled the change. For the radius to exceed 60 mm, L² must exceed 6 × 30 × 60 = 10,800, so L must be at least **103.9 mm**. For a margin of half as much again, a radius of 90 mm, L must be at least 127.3 mm. The designer took the result back to the layout meeting, the bracket moved, and the 200 mm transition stayed.

The duct's final transition is built as a loft in Chapter 4 rather than as a sweep, because a loft handles the change of section shape more directly. The curvature limit still applies to the loft's guides and to any later offset, so the calculation is worth keeping in the design notes.

## Sweeps along edges: the joint tongue

The tongue that runs around the half-shell joint is a sweep along a path made from model edges: the bell-mouth arc, the straight lines of the round section and the transition, and the flange edge. The smallest radius on that path is the 10 mm bell-mouth arc. The tongue profile is 3 mm high, so it reaches at most 3 mm towards the inside of any bend. Since 3 is well under 10, the sweep is safe.

Two practical points apply to any sweep along edges. First, the path must be tangent-continuous where it is meant to be smooth; a path with a tiny kink, perhaps where two surfaces meet at G0, gives a profile that jumps orientation at the kink and leaves a crease. Second, if the path is built from edges of surfaces that will change, the sweep depends on those edges. A projected or composite curve built from the skeleton is more stable than a selection of edges that may be renumbered on rebuild.

## Leave clean edges for the next surface

The revolved inlet ends at x = 40 with a circular edge. That edge is where the transition will start, so it should be left in a state the next operation can use.

First, check the edge's continuity with the revolve profile: the round section's last 30 mm is a cylinder, so at x = 40 the surface direction is exactly along the axis. The transition guides were given zero slope at their start for the same reason. When the loft is built, it can be told to leave its start section tangent to the revolved face. The software then matches the direction across the join instead of merely meeting the edge.

Second, consider how the edge is divided. A 360° revolve usually gives a circular edge split once, at the seam. The loft's start section has eight segments. Most modellers will knit two faces whose shared boundary is divided differently, but some downstream operations, such as fillets and offsets, are more reliable when the edges line up. If the revolve is split at the same angles as the section sketch, the two faces share eight matching edges, and later checks report them as one clean boundary.

Third, keep the revolve's own end cap out of it. A solid revolve would put a flat disc across the inlet; a surface revolve does not. Do not add one for appearance: a capped inlet would have to be removed before thickening, and a forgotten cap later fills the duct with material in the solid.

These are small details in a single feature, but surface models fail at their joins. Every surface built in this book is finished by asking what its edges will meet next.

## Exercise: a shorter transition

The layout team asks whether the transition could be 150 mm long with the same 30 mm drop. Using the smooth-step centreline, find the radius of curvature at the ends, and say whether a sweep of the 120 mm inlet circle along it would fold.

**Worked answer.** R = L² ÷ (6d) = 150² ÷ (6 × 30) = 22,500 ÷ 180 = **125 mm**. The inlet half-height is 60 mm, which is less than 125 mm, so the sweep would not fold at the inlet end. The ratio of radius to half-height is about 2.1, a reasonable margin.

The answer is not the end of the review. A shorter transition also steepens the guides: the top guide's mid-length slope becomes 60 × 1.5 ÷ 150 = 0.6, or 31.0°, up from 24.2°. Whether that is acceptable for the airflow is a separate question. Surface geometry can say whether the shape can be built; it cannot say whether the shape is a good duct.
