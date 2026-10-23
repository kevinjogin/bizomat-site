---
book: gears-by-the-numbers
chapterSlug: helical-gears-and-axial-thrust
order: 7
title: "Helical gears and axial thrust"
description: "Convert between normal and transverse module, size a helical pair to a centre distance, and calculate the axial thrust and face overlap the helix creates."
draft: true
---

Spur teeth engage across their whole face at once, so each tooth pair picks up and drops its load abruptly. Helical gears cut the teeth at an angle to the axis, so contact starts at one end of a tooth and spreads gradually across the face. The result is usually quieter running and higher load capacity for the same size. The price is an axial thrust that bearings must carry, and slightly more complicated geometry.

This chapter converts the conveyor pair into a helical design and calculates what changes.

## Normal and transverse module

A helical tooth has two natural cross-sections. The **normal** section is perpendicular to the tooth, and it is the section the cutting tool sees, so the tool's module is the **normal module** mₙ. The **transverse** section is perpendicular to the gear axis, and it governs the pitch diameter. With helix angle β:

**mₜ = mₙ / cos β**

**d = z × mₜ = z × mₙ / cos β**

Keep the normal module at 3 mm, so the same hob can be used, and choose β = 15°:

**mₜ = 3 / cos 15° ≈ 3 / 0.965926 ≈ 3.1058 mm**

The pinion's pitch diameter becomes **20 × 3.1058 ≈ 62.117 mm**, and the gear's **60 × 3.1058 ≈ 186.350 mm**. The centre distance grows from 120 mm to about **124.233 mm**.

## Fitting a helical pair to an existing centre distance

Often the housing already exists. Rearranging the centre distance relation gives the helix angle needed for chosen tooth numbers:

**cos β = mₙ × (z₁ + z₂) / (2 × a)**

At a = 120 mm with mₙ = 3 mm, 20 and 60 teeth give cos β = 1, so no helix fits. Reducing the tooth numbers to 19 and 57 keeps the 3:1 ratio and gives:

**cos β = 3 × 76 / 240 = 0.95, so β ≈ 18.19°**

Small adjustments of tooth numbers, helix angle and profile shift are the designer's tools for fitting a helical pair to a fixed housing.

## The helix creates axial thrust

Because the tooth is inclined, the force between teeth has an axial component as well as tangential and radial ones. For the 15° design carrying the same 19.90 N·m pinion torque:

**Fₜ = 2 × T / d₁ = 2 × 19.90 / 0.062117 ≈ 640.6 N**

**Fₐ = Fₜ × tan β ≈ 640.6 × 0.26795 ≈ 171.6 N**

The radial force uses the transverse pressure angle, where tan αₜ = tan αₙ / cos β ≈ 0.36397 / 0.965926 ≈ 0.37681:

**Fᵣ = Fₜ × tan αₜ ≈ 640.6 × 0.37681 ≈ 241.4 N**

The radial force is the same as for the spur pair, because the larger pitch diameter reduces Fₜ by exactly the factor that the transverse pressure angle increases its radial share. The axial force is new. About 172 N must now be carried by a bearing that can take thrust, on both shafts, in a direction set by the hand of the helix and the direction of rotation.

```figure
type: compare
title: Spur and 15° helical versions of the conveyor pair
cols: Spur | Helical, β = 15°
caption: Same normal module, tooth numbers and torque. The helix enlarges the pair and adds axial thrust.
- Pinion pitch diameter | 60 mm | 62.117 mm
- Centre distance | 120 mm | 124.233 mm
- Tangential force | 663.2 N | 640.6 N
- Radial force | 241.4 N | 241.4 N
- *Axial force | None | 171.6 N
```

## Face overlap adds smoothness

The helix adds a second overlap to the transverse contact ratio of Chapter 4. The **face contact ratio**, or overlap ratio, measures how far the helix carries contact across the face:

**εβ = b × sin β / (π × mₙ)**

With b = 30 mm and β = 15°:

**εβ = 30 × 0.258819 / (π × 3) ≈ 7.765 / 9.425 ≈ 0.824**

The total contact ratio is the transverse ratio plus the overlap ratio, so the load is shared by more teeth more of the time than in the spur pair. An overlap ratio of 1.0 or more means at least one helix pitch fits within the face width, which designers often aim for to gain the full smoothing benefit. The 18.19° version on the 120 mm centres gives εβ ≈ 0.994, very close to that point.

```figure
type: bars
title: Face overlap ratio with 30 mm face width
caption: Overlap rises with helix angle; about 1.0 means a full helix pitch fits within the face.
max: 1.2
- Spur, β = 0° | 0
- 15° helix | 0.824
- *18.19° helix, 19:57 teeth | 0.994
```

## Managing the thrust

Axial thrust is the main practical cost of helical gears. The options are to:

- **carry it** with angular contact, tapered roller or thrust bearings arranged for the direction of load;
- **cancel it** with double helical or herringbone gears, whose two opposite-hand halves balance each other;
- **limit it** by choosing a modest helix angle, accepting less overlap.

Check the thrust direction for every operating direction, including reversing and braking, because it reverses when torque reverses. A bearing arrangement that is fine in one direction may be overloaded or unloaded in the other.

## Exercise: a 20° helix

A helical pair has normal module 3 mm, 18 and 54 teeth and a 20° helix angle. Calculate the transverse module, pitch diameters and centre distance, and state the ratio of axial to tangential force.

The transverse module is **3 / cos 20° ≈ 3.1925 mm**. The pitch diameters are **18 × 3.1925 ≈ 57.466 mm** and **54 × 3.1925 ≈ 172.397 mm**, and the centre distance is about **114.931 mm**. The axial force is **tan 20° ≈ 0.364** times the tangential force, a larger share than the 15° design, so bearing selection deserves particular care.
