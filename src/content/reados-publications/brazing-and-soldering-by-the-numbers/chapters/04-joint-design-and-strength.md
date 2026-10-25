---
book: brazing-and-soldering-by-the-numbers
chapterSlug: joint-design-and-strength
order: 4
title: "Joint design and strength"
description: "Choose between butt, lap, scarf and socket joints, size a lap from the filler's shear strength and the part's strength, and see why pressure joints fail by leak paths and tubes break beside the joint."
draft: false
---

A brazing or soldering filler is almost always weaker than the parts it joins. A weld can match the strength of its parent metal through its own cross-section; a capillary joint usually cannot, so it makes up the difference with area. The filler is spread thinly over a large overlap, loaded in shear, and the joint as a whole can then be as strong as the parts. Designing a capillary joint is mostly a matter of providing that area, keeping the load in shear, and avoiding the ways joints fail that have nothing to do with the filler's strength.

This chapter compares the main joint types, sizes a lap or socket from the strengths of the filler and the parts, calculates the stress a pressure test puts on a socket joint, and explains two failures that are common in practice: leaks through voids, and tubes that crack just beside the joint.

## Joint types

Four joint types cover most capillary work.

```figure
type: compare
title: Joint types for brazing and soldering
cols: Load path in the filler | Strengths | Weaknesses
caption: General characteristics. Most capillary joints are laps or sockets; butt joints are used where thickness must not change and the constraint effect is enough.
- Butt | tension across a thin layer | no change in thickness | small area; strength depends on constraint and fit
- Scarf | mostly shear along an angled face | no change in thickness; more area than a butt | angled faces must be machined and aligned
- *Lap | shear along the overlap | large area; easy to fit and fill | change in thickness; peel at the ends if bent
- Socket or sleeve | shear round the circumference | large area; self-aligning; seals | needs controlled bore and tube sizes
```

The lap and the socket, which is a lap wrapped round a tube, are the workhorses. They give a large bonded area for little extra material, they are easy to fit up with the clearances of Chapter 3, and they put the filler in shear, the direction in which it is strongest relative to the load it must carry.

## Sizing a lap

For a lap joint between two flat strips of thickness t and width b, the strip can carry a tensile force of σ × t × b before failing, where σ is its tensile strength. The joint can carry τ × L × b, where τ is the shear strength of the brazed or soldered layer and L is the lap length. Setting the joint equal to the strip gives the lap length at which they are equally strong.

```figure
type: formula
title: Lap length for a joint as strong as the part
formula: L = σ_part × t ÷ τ_joint
caption: This is an illustration. The strengths are rounded teaching values, not data for a particular tube or filler; use the filler maker's and the material standard's values, and the applicable design rules, for real joints.
- σ_part, tensile strength of annealed copper tube | about 220 MPa
- t, tube wall | 1.0 mm
- τ_joint, shear strength of a well-filled silver-brazed layer | about 150 MPa
step: L = 220 × 1.0 ÷ 150
step: L ≈ 1.5 mm for a perfectly filled joint
```

The same result holds for a tube in a socket, because both the tube's cross-section and the joint's area are proportional to the circumference, which cancels: the socket depth for equal strength is the tensile strength times the wall thickness divided by the joint's shear strength.

## Why real joints are longer

A lap of 1.5 mm would never be used, and the reasons are instructive.

**Joints are never perfectly filled.** Voids, flux inclusions and unfilled regions reduce the area carrying load. If only a fraction f of the lap is sound, the length needed rises to L ÷ f.

```figure
type: bars
title: Socket depth needed for equal strength, by the fraction of the joint that is filled
unit: mm of socket depth
max: 6
caption: This is an illustration for the copper tube and filler values in this chapter, L = 1.5 mm ÷ f. Real design rules include margins for the factors discussed in the text as well as for filling.
- Fully filled | 1.5
- 70% filled | 2.1
- 50% filled | 2.9
- *30% filled | 4.9
```

**Loads are not pure tension.** A tube is bent, vibrated and twisted in service as well as pulled, and those loads produce stresses at the mouth of the socket far higher than the average.

**Stress is not uniform along a lap.** When a lap joint is pulled, the parts stretch, and they stretch most where they carry the most load. Near the ends of the lap, one part is carrying nearly all the force and the other nearly none, so the shear in the filler is concentrated at the ends and is low in the middle. Beyond a certain length, extra lap adds little strength, although it still adds sealing length and margin for voids.

**Alignment and sealing.** A deep socket holds a tube straight and gives a long leak path, which matters more than strength for pressure joints, as the next sections show.

Standard capillary fittings for copper tube have sockets many times deeper than the equal-strength length calculated here, for exactly these reasons. A designer making their own sockets, as the manufacturer does, should not cut them shorter than the fitting standards they replace without good evidence.

## Pressure on a socket joint

A tube under internal pressure pushes its own end out of the socket with a force equal to the pressure times the tube's internal area. That force is resisted by shear in the filler round the socket.

This is an illustration. For a 22 mm tube at a test pressure of 1.0 MPa, the end force is about 1.0 × π × 20² ÷ 4 ≈ **314 N**, taking the bore as 20 mm. Spread over a socket 12 mm deep round a 22 mm tube, an area of about π × 22 × 12 ≈ 829 mm², the average shear in the filler is about 314 ÷ 829 ≈ **0.38 MPa**, about one four-hundredth of the illustrative joint strength of 150 MPa. Even a joint only 10% filled would carry the pressure load hundreds of times over.

```figure
type: stats
title: A 22 mm socket joint at a 1.0 MPa pressure test
caption: This is an illustration. The shear stress from pressure is tiny beside the joint's strength, so pressure joints that fail almost always fail by leaking through a continuous void, not by pulling apart.
- 314 N | End force on the joint | pressure times bore area
- 829 mm² | Socket area | 12 mm deep round a 22 mm tube
- *0.38 MPa | Average shear in the filler | about 1/400 of 150 MPa
```

The conclusion is important for anyone chasing leaks. A pressure joint almost never fails by shearing, because the pressure load is tiny compared with what a capillary joint can carry. It fails by leaking: a channel of unfilled gap or a chain of voids running from the inside of the socket to the outside. A joint can be 90% filled and leak, if the 10% that is empty is a continuous path, and another can be 50% filled and tight, if the filled half is a complete ring. That is why the manufacturer's leaks, in Chapters 1 and 3, came from incomplete penetration, and why a deep socket, which gives the filler a long ring to close, is valuable for sealing even when strength is not in question.

## Peel and cleavage

Capillary joints are strong in shear and weak in peel, the load that tries to lift one part away from the other from an edge. A lap joint between thin strips that is bent will peel at the end of the lap, concentrating all the load on a thin line of filler, and fail at a fraction of its shear strength. Design keeps capillary joints in shear: laps loaded along their length, sockets loaded along the tube, and no thin flanges or tabs that can be levered off. Where bending cannot be avoided, a longer lap, a stiffer part at the joint, or a mechanical feature that carries the bending, such as a flare, a bead or a fastener, protects the filler.

## The softened zone beside the joint

One failure has nothing to do with the joint itself. Cold-drawn copper tube is hard and strong; heated to brazing temperature, it anneals, becoming soft and much weaker in the heated zone on each side of the joint. If the tube is then vibrated or bent in service, it bends where it is softest, just outside the socket, and fatigue cracks start there. The brazed joint survives intact while the tube breaks beside it.

The remedy is not in the joint but in the support. Pipework near brazed joints is clipped or supported so that vibration and bending loads do not concentrate at the softened zone, and heavy fittings and valves are supported independently rather than hanging from the tube. Heat is kept to the joint area, with heat sinks or wet cloths where the design allows, to limit the length of tube annealed.

## Strength at temperature

A capillary joint's strength falls as its temperature approaches the filler's melting range, and it falls much earlier than the parts' strength does. A soft-soldered joint, with a filler melting at under 250 °C, loses much of its strength well below 100 °C under sustained load, and creeps slowly even at room temperature if it is loaded for long periods, which is why soldered joints are not used to carry structural loads. A silver-brazed joint keeps useful strength to a few hundred degrees, and nickel-based brazing fillers to much higher temperatures. The design must therefore know the joint's service temperature, including the worst case, such as a heating manifold running hot when a pump fails, and choose a filler whose strength at that temperature, from the maker's data, carries the load with margin.

## Unequal parts

Many capillary joints join a thin part to a thick one: a tube to a heavy body, a sheet to a casting, a carbide insert to a steel shank. The joint's design should make it possible to bring both parts to temperature together, because the filler flows only where the joint is hot (Chapter 2). A heavy part next to a thin one can be relieved, with a groove or a reduced section round the joint, so that it heats faster, and the design can place the joint where the heat can reach it from the side of the heavy part. These are design decisions, made on the drawing, that save the brazer from fighting the joint every time.

## Joints in electrical service

Brazed and soldered joints are often used in electrical conductors, and their resistance is easily estimated. This is an illustration. A brazed lap between two copper bars 40 mm wide, with a 40 mm overlap and a filler layer 0.05 mm thick, has a bonded area of 1,600 mm². If the filler's resistivity were four times copper's, about 6.8 × 10⁻⁸ Ω·m, the resistance of the layer would be about 6.8 × 10⁻⁸ × 0.000 05 ÷ 0.0016 ≈ **2 nanohms**, negligible beside the resistance of the bars themselves. Electrical joints fail not through the filler's resistivity but through voids, cracks and corrosion that reduce the real contact area, and they need the same sound filling as pressure joints.

## Joints and tolerances in the design

Because a capillary joint depends on its clearance, the joint's geometry must appear on the drawing: the bore and its tolerance, the tube or part size and its tolerance, the socket depth, the finish, and any chamfer or lead-in that helps assembly and lets the filler enter. A drawing that shows only the nominal sizes leaves the clearance to chance, as the manufacturer's headers showed. Where a joint will be brazed with a preplaced ring or foil of filler, the drawing also shows where the filler sits, such as an internal groove in the socket.

## Designing for inspection

A joint that cannot be inspected cannot be shown to be sound. Socket joints can be leak tested and, on a sample basis, sectioned or examined by radiography or ultrasonics; lap joints between flat parts can be inspected by ultrasonics or by peeling test pieces apart. Designing so that the filler is fed from one side and must appear at the other, where it can be seen, gives a simple visual check that it ran right through. Chapter 10 returns to inspection methods.

## The running case: the manifold outlet

This is an illustration. The manufacturer's manifold bodies have copper outlets of 15 mm and 22 mm tube, in sockets 12 mm deep machined in the brass body. Using the illustrative values in this chapter, the equal-strength depth for a 1.0 mm wall is about 1.5 mm, so the 12 mm socket gives about eight times that, a margin that covers voids, bending loads and stress concentration. The pressure load at the 1.0 MPa test pressure is trivial, as calculated. The returns, therefore, were never a question of strength; they were leaks, caused by incomplete penetration from uneven heating (Chapter 1) and too tight a hot clearance in the steel headers (Chapter 3). The production manager left the socket depths alone and concentrated on clearance and heating.

## A failure: the cracked outlet

This is an illustration. A manifold installed in a plant room came back with a crack in a copper outlet tube about 5 mm from the brass body, while the brazed joint itself was perfect. The installer had connected a heavy circulating pump directly to the outlet with no separate support, and the pump's vibration had flexed the tube at its softened zone until a fatigue crack grew through the wall.

The manufacturer's installation instructions were revised to require independent support of pumps and heavy fittings near the manifold, with a diagram, and the production manager added a note to the product's design file explaining why: the joint was sound, but the brazing heat had made the tube beside it the weakest point in the assembly.

## Exercise: a lap for a steel strap

A mild steel strap 3 mm thick and 25 mm wide is to be brazed in a lap to a steel bracket. Taking an illustrative tensile strength of 400 MPa for the strap and an illustrative shear strength of 200 MPa for the brazed layer, calculate the lap length for equal strength if fully filled, and if only 60% filled. Then say what lap you would use and why.

For full filling, L = 400 × 3 ÷ 200 = **6 mm**. If only 60% of the lap is sound, L = 6 ÷ 0.6 = **10 mm**.

A practical lap would be longer still, perhaps 15 mm or more, because a strap is likely to be bent as well as pulled, which concentrates load at the lap ends and tries to peel the joint, and because extra length gives margin for voids and for stress concentration at the ends. Beyond a certain length, more lap adds little strength, so the designer would also consider stiffening the joint against bending or adding a mechanical feature, rather than simply lengthening the lap.
