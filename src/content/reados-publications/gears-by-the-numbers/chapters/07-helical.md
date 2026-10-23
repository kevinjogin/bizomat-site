---
book: gears-by-the-numbers
chapterSlug: helical-gears-and-axial-thrust
order: 7
title: "Helical gears and axial thrust"
description: "Convert between normal and transverse module, size a helical pair to a centre distance, and calculate the axial thrust and face overlap the helix creates."
draft: false
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

## Hand of helix, and why it must match

A helical tooth winds around the gear like a screw thread, either right-handed or left-handed. Two external helical gears on parallel shafts must have the **same helix angle and opposite hands**: a right-hand pinion meshes with a left-hand gear, and the reverse. Two right-hand gears on parallel shafts will not mesh correctly.

The hand also decides which way the axial thrust acts on each shaft, together with the direction of rotation and which gear is driving. Rather than memorise a rule, it is safer to sketch the tooth at the contact point, draw the normal force perpendicular to the tooth surface, and resolve it into its tangential and axial parts for each operating direction. Bearing and gear suppliers publish diagrams for the common cases, and the result should be written on the assembly drawing so that the fitter installs the thrust bearing the right way round.

## The lead of a helix

The **lead** is the axial distance the helix advances in one full turn around the gear. It is a useful number for setting up hobbing and grinding machines, and for checking a helix:

**L = π × d / tan β**

For the 15° design:

- **Pinion:** π × 62.117 / 0.26795 ≈ 728.3 mm
- **Gear:** π × 186.350 / 0.26795 ≈ 2,184.9 mm

The leads differ in proportion to the pitch diameters, even though the helix angles are the same at the pitch circle. Over the 30 mm face width, the pinion's helix turns through only 30 / 728.3 of a revolution, about 14.8°, which is a reminder that a helical gear's teeth are only gently twisted across a typical face.

## The virtual number of teeth

In the normal section, a helical tooth looks like a spur tooth on a larger gear, because the section through an inclined cylinder is an ellipse with a larger radius of curvature at the pitch point. The tooth number of that equivalent spur gear is the **virtual number of teeth**:

**z_v = z / cos³ β**

For the 15° design, the 20-tooth pinion behaves in its normal section like a spur gear of about **22.2 teeth**, and the 60-tooth gear like one of about **66.6 teeth**.

The virtual number is used when choosing a bending form factor for a helical gear, and in judging undercut. A helical pinion can have fewer teeth than a spur pinion before it undercuts. Using the transverse pressure angle of about 20.65° for the 15° design, the theoretical minimum is:

**z_min = 2 × cos β / sin² αₜ ≈ 2 × 0.965926 / 0.12455 ≈ 15.5 teeth**

compared with about 17.1 for a 20° spur pinion. That is one more reason helical pinions are popular where a high ratio must fit in a small space.

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

## What the thrust does to the bearings

The axial force does more than push along the shaft. Because it acts at the pitch radius, not on the axis, it also creates a moment that tilts the shaft and adds to the radial loads on its bearings.

This is an illustration. For the 15° pinion, carried between two bearings 100 mm apart with the gear midway:

- **Transverse force** on the pinion, combining tangential and radial components: √(640.6² + 241.4²) ≈ **684.6 N**, shared between the two bearings.
- **Axial force:** **171.6 N**, carried by whichever bearing is arranged to take thrust in that direction.
- **Moment from the axial force:** 171.6 × 0.031058 ≈ **5.33 N·m**. Over a 100 mm span, that adds about **53.3 N** to the radial load on one bearing and removes the same from the other, in the plane containing the axial force and the shaft axis.

```figure
type: stats
title: Loads from the 15° helical pinion
caption: Illustrative bearing span of 100 mm with the pinion midway. The axial force also tilts the shaft.
- 684.6 N | Transverse force | tangential and radial combined
- 171.6 N | Axial force | to one thrust-capable bearing
- 5.33 N·m | Overturning moment | axial force × pitch radius
- *± 53.3 N | Added radial load | moment ÷ 100 mm span
```

The extra radial load is modest here, but it grows with helix angle, torque and pitch diameter, and it is easy to miss when bearings are sized only from tangential and radial forces. Bearing selection should use the full set of loads in every operating direction.

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

## The total contact ratio

The helical pair's transverse contact ratio is calculated exactly as in Chapter 4, but in the transverse section, using the transverse module of 3.1058 mm and the transverse pressure angle of about 20.65°. The addendum stays at one normal module, 3 mm, because the tool cuts in the normal section. For the 15° design, the tip radii are about 34.058 mm and 96.175 mm on a centre distance of 124.233 mm, and the working gives:

**εα ≈ 1.592**

That is a little lower than the spur pair's 1.671, because the transverse pressure angle is larger and the teeth are relatively shorter in the transverse section. Adding the overlap ratio gives the **total contact ratio**:

**εγ = εα + εβ ≈ 1.592 + 0.824 ≈ 2.42**

On average, about two and a half tooth pairs share the load, against about 1.67 for the spur version.

## Why helical gears run quieter

The noise of a gear pair comes mainly from the way the load changes as teeth enter and leave contact. In a spur pair, the load on each tooth changes in steps as the mesh moves between single and double contact, and the stiffness of the mesh changes in steps with it. Those steps repeat at the tooth-passing frequency, 480 Hz for the conveyor pinion, and excite the shafts and housing.

In a helical pair, each tooth enters contact at one end of the face and the line of contact sweeps gradually across it. The total length of contact lines changes much less as the gears turn, so the mesh stiffness and the transmission error vary more smoothly. With an overlap ratio close to a whole number, the variation becomes particularly small. The practical result is that a helical pair of similar accuracy is usually noticeably quieter than its spur equivalent, especially at higher speeds. That benefit, together with greater load capacity, is why most industrial gearboxes use helical gears, accepting the cost of the thrust bearings.

## Managing the thrust

Axial thrust is the main practical cost of helical gears. The options are to:

- **carry it** with angular contact, tapered roller or thrust bearings arranged for the direction of load;
- **cancel it** with double helical or herringbone gears, whose two opposite-hand halves balance each other;
- **limit it** by choosing a modest helix angle, accepting less overlap.

Check the thrust direction for every operating direction, including reversing and braking, because it reverses when torque reverses. A bearing arrangement that is fine in one direction may be overloaded or unloaded in the other.

## Double helical and herringbone gears

A double helical gear carries two sets of helical teeth of opposite hand side by side, so that their axial forces cancel within the gear. Herringbone gears are the same idea with no gap between the halves. They allow large helix angles, and therefore high overlap and smooth running, without thrust on the bearings.

They bring their own requirements. The two halves must share the load equally, which usually means one of the two shafts is left free to float axially so that the gears can centre themselves; if both shafts are fixed axially, small manufacturing differences put most of the load on one half. Double helical gears cut by hobbing need a gap between the halves for the hob to run out, which adds width. They are common in large, high-power drives such as marine and mill gearboxes, and rare in small machinery, where single helical gears with suitable thrust bearings are simpler.

## Matching a replacement helical gear

Replacing one gear of a helical pair needs more care than replacing a spur gear. The replacement must match the normal module, normal pressure angle, tooth number, helix angle, hand and profile shift of the original. A helix angle that is slightly wrong, say 15.5° instead of 15°, changes the transverse module and pitch diameter. The gears may still assemble, but they will touch only at one end of the face, carrying the load on a small part of each tooth.

A worn gear's helix angle can be estimated by rolling its tips on paper or measuring the lead with an indicator on a lathe or measuring machine, but the most reliable route is the original drawing or a measurement on a gear measuring machine. When the original data are unknown, measuring both gears of the pair, and replacing them together, is often the safer choice.

## Exercise: a 20° helix

A helical pair has normal module 3 mm, 18 and 54 teeth and a 20° helix angle. Calculate the transverse module, pitch diameters and centre distance, and state the ratio of axial to tangential force.

The transverse module is **3 / cos 20° ≈ 3.1925 mm**. The pitch diameters are **18 × 3.1925 ≈ 57.466 mm** and **54 × 3.1925 ≈ 172.397 mm**, and the centre distance is about **114.931 mm**. The axial force is **tan 20° ≈ 0.364** times the tangential force, a larger share than the 15° design, so bearing selection deserves particular care.
