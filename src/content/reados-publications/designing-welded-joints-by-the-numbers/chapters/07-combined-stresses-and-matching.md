---
book: designing-welded-joints-by-the-numbers
chapterSlug: combined-stresses-and-matching
order: 7
title: "Combined stresses and matching the filler"
description: "Combine direct, shear, twisting and bending forces on a weld, check butt welds with an equivalent stress, choose matching or undermatching fillers, and check the parent metal at the fusion face."
draft: false
---

Real joints rarely carry one kind of load. The conveyor's gearbox plate carries weight and a reversing torque; the walkway's end supports carry vertical load, bending and a sideways push from the handrail; the motor bracket carries weight, belt pull and a twisting moment. The welds must carry all of them at once, and the designer needs a way to combine them into a single check. The designer also needs to know whether the weld metal or the steel beside it is the weaker, which depends on the filler chosen.

This chapter shows how forces on a fillet weld are combined as vectors, how a butt weld is checked with an equivalent stress, why the filler is usually chosen to match the steel's strength and when it is not, and how to check the parent metal along the fusion face of a fillet.

## Combining forces on a fillet weld

The simple method of Chapter 3 treats a fillet weld's capacity as a force per millimetre that can act in any direction. Combining loads is then a matter of adding the force-per-millimetre components at the critical point as vectors, as Chapters 5 and 6 did: the direct load, the twisting load and the bending load at that point each have a magnitude and a direction, and their vector sum is compared with the capacity per millimetre.

```figure
type: formula
title: Resultant force per millimetre on a fillet weld
formula: f = √(f_x² + f_y² + f_z²)
caption: The simple vector method. x and y are in the plane of the weld group; z is perpendicular to it, from bending. Each component is the sum of all the loads' contributions in that direction at the critical point.
- f_x | horizontal in-plane components, from shear and twisting
- f_y | vertical in-plane components, from shear and twisting
- f_z | out-of-plane component, from bending
step: add the contributions of every load to each component, with their signs
step: take the vector sum at each candidate point
step: the largest resultant is compared with the capacity per millimetre
```

This is an illustration. One of the walkway's end supports, welded all round as in Chapter 6, carries 3 kN vertically at 1 m, giving a bending force of about 360 N/mm at its top and bottom welds, and a horizontal handrail load that twists the weld group about its centroid, adding an in-plane force of about 150 N/mm at the same corners, plus small direct shears. At the worst corner, the components combine to about √(360² + 150² + 20²) ≈ **390 N/mm**, needing a leg of about 390 ÷ 200 ÷ 0.707 ≈ 2.8 mm at the illustrative strength. The 6 mm fillet the designer chose, for fatigue and minimum-size reasons, carries it comfortably.

## Butt welds and equivalent stress

A complete penetration butt weld is part of the plate, so it is checked like the plate, with the normal stress σ and the shear stress τ at a point combined into an equivalent stress, commonly the von Mises form √(σ² + 3τ²), and compared with the steel's design strength.

```figure
type: formula
title: Equivalent stress in a butt weld under tension and shear
formula: σ_e = √(σ² + 3τ²)
caption: This is an illustration for a complete penetration butt weld in a gearbox plate carrying both a bending stress and a shear stress at the same point.
- σ, normal stress from bending | 120 MPa
- τ, shear stress | 60 MPa
step: σ_e = √(120² + 3 × 60²)
step: σ_e = √(14,400 + 10,800) ≈ 159 MPa
```

The equivalent stress is higher than either component alone, and a weld that would pass either check on its own may fail the combined one. Design standards give the form of the combination they require; the principle is to check the stresses together at the same point, not separately at different points.

## Matching the filler

The filler metal's strength is described by its classification, and the usual choice is a **matching** filler, one whose deposited weld metal has a strength similar to or slightly greater than the parent steel's. With a matching filler, a complete penetration butt weld is as strong as the plate, and the design can treat it so. Most structural and machine steels have matching fillers readily available from several makers.

An **overmatching** filler, much stronger than the steel, adds little: the joint's strength is limited by the steel beside the weld. It can also make the weld less tolerant of defects and more prone to hydrogen cracking, because stronger weld metals are generally more sensitive to hydrogen. An **undermatching** filler, weaker than the steel, is sometimes chosen deliberately for very high-strength steels, to reduce the risk of cracking, with the fillet welds sized larger to compensate, because the weld metal is then the weaker part.

```figure
type: compare
title: Filler strength relative to the parent steel
cols: When used | Effect on design
caption: General guidance. The welding procedure, the filler maker's data and the design standard decide the filler for each steel and joint.
- *Matching | most structural and machine steels | complete penetration butt welds carry the plate's strength
- Overmatching | rarely by choice; sometimes by default | little gain; joint limited by the steel; more crack-sensitive
- Undermatching | very high-strength steels, crack-sensitive joints | fillet welds sized larger for the weaker weld metal
```

## The fusion face of a fillet

A fillet weld can fail through its throat, which is the usual design check, or along its fusion faces, where it joins each part, if the parent metal there is weaker than the weld metal. Each fusion face is as long as the weld and as wide as the leg, so its area is the leg times the length, about 1.41 times the throat area. With a matching filler on ordinary steel, the throat governs. With an undermatching parent, such as a softened heat-affected zone in some heat-treated steels, or with a strong filler on a soft steel, the fusion face can govern, and design standards include a check of the parent metal at the fusion face for this reason.

## Heat-affected zone softening

Some steels get their strength from heat treatment, quenching and tempering, or from cold work, and welding heat softens a zone beside the weld, reducing its strength below the parent's. Aluminium alloys that are heat treated or work hardened lose much of their strength in the heat-affected zone, and their design standards give reduced strengths for welded zones. Weldability by the Numbers discusses aluminium's heat-affected zone in its chapter on [aluminium, oxide, hydrogen and heat](/reados/publications/weldability-by-the-numbers/aluminium-oxide-hydrogen-and-heat/). For such materials, the joint's design strength is not the parent metal's, and a design that ignores the softened zone overestimates the joint.

## Stainless steel and dissimilar joints

Stainless steels are welded with fillers chosen for corrosion resistance and crack resistance as well as strength, and their weld metals are often of a different composition from the parent, as are the fillers for joining stainless steel to carbon steel. The designer specifies the joint and its strength requirement; the welding engineer chooses the filler that meets it. Weldability by the Numbers covers dissimilar joints in its chapter on [joining different metals](/reados/publications/weldability-by-the-numbers/joining-different-metals/).

## Combining with the member's stresses

A weld rarely carries load alone; the member it joins is often stressed by other loads at the same place. A fillet weld along a beam's flange, joining a cover plate, carries the shear flow between the plate and the flange as the beam bends, while the flange itself carries bending stress along the weld. In the simple method, the weld is checked for its own forces; but at the weld toe, the member's stress and the weld's stress concentration add, which is why fatigue checks of welded details use the member's stress range at the detail (Chapter 8).

## The running case: the gearbox plate

This is an illustration. The gearbox mounting plate carries the gearbox's 3 kN weight and a reaction torque that the designer resolved into forces of about 18 kN on each of the two frame members, reversing in direction when the conveyor starts and stops. On each member's two 250 mm fillets, the vertical force per millimetre from the weight is about 3 N/mm and the horizontal force from the torque about 36 N/mm. Their vector sum, about 36 N/mm, is far below any fillet's capacity. The welds are governed not by strength but by fatigue, because the torque reverses many times a day, and by the minimum size for the 16 mm plate. Chapter 8 checks the fatigue.

## Partial penetration welds under combined load

Partial penetration butt welds sit between the two simple cases. They are usually checked like fillet welds, on their effective throat, with the forces combined as vectors, because their unfused root means they cannot be treated as part of the plate. Where bending puts tension across the root, the earlier warning applies with extra force: the combination of a normal stress across the throat with an unfused root behaves like a crack under load, and the joint is better redesigned than checked more precisely.

## Signs and directions

Combining forces as vectors means keeping track of their directions. The twisting force at a corner of a weld group points at right angles to the line from the centroid, and its direction depends on which way the load twists; the bending force is tension on one side and compression on the other; the direct force points with the load. A sketch of the weld group with arrows for each contribution at each corner, before any arithmetic, avoids the common error of adding magnitudes that actually partly cancel, or subtracting ones that add. Where loads reverse, as the gearbox torque does, both directions must be checked, because the corner that is worst for one direction may be different from the worst for the other.

## Toughness as well as strength

Filler choice affects toughness, the ability of the weld to resist brittle fracture, as well as strength. Joints in structures that work at low temperatures, carry impact loads, or have thick parts and high restraint need weld metal and heat-affected zones with adequate toughness, measured by impact tests, as Testing Welded Joints by the Numbers describes in its chapter on [impact toughness](/reados/publications/testing-welded-joints-by-the-numbers/impact-toughness/). The design specification sets the toughness required, and the filler and procedure are chosen to provide it. For the conveyor frame, indoors and at ordinary temperatures, a standard structural filler met the need; a frame for a cold store or an exposed structure in winter might not.

## Preheat and the strong filler

Higher-strength steels and fillers are more sensitive to hydrogen cracking, and the welding procedure for them usually sets a preheat, low-hydrogen consumables and controlled cooling. The designer who specifies a higher-strength steel to save weight should know that it brings these requirements into the shop, with their cost and time. Sometimes the saving in steel is worth it; sometimes an ordinary steel of slightly larger section is cheaper to make into a sound joint.

## Keeping the combination simple

Combined-stress checks can become elaborate, and elaborate checks are where mistakes hide. The designer's habit for the conveyor frame was to find the one or two joints in each group that carried the most combined load, check those carefully by hand, and size the rest of the group the same, rather than calculating every joint to its own exact size. The result used a few extra kilograms of weld metal across the frame and saved hours of calculation and checking, and every joint on the drawing could be traced to a governing check.

## The filler on the drawing

The drawing or the welding procedure specification must state the filler's classification or strength requirement, or the fabricator will use whatever is on the shelf, which is usually, but not always, a matching filler for ordinary steel. For high-strength steels, stainless steels, aluminium and dissimilar joints, the filler choice is a design decision, and the drawing says so. The designer's note on the conveyor frame specified a matching filler for the frame's structural steel and named the welding procedure to be used.

## A failure: the strong filler on a soft plate

This is an illustration. A repair to a machine frame made of an ordinary mild steel had been welded with a high-strength low-hydrogen electrode, chosen because it was what the repairer had for another job. When the frame was later overloaded, it tore not through the welds but along the fusion faces in the soft plate beside them, a fracture that surprised the owner, who had been told the welds were very strong.

The welds were indeed stronger than the plate, and that was the point: the joint could never be stronger than the steel beside it, and the stronger weld metal had concentrated the strain in the softer plate at the fusion line. A matching filler would have given the same joint strength with more even deformation. The lesson is that a stronger filler does not make a stronger joint; it only moves the failure into the steel, and can make the joint less ductile when it gets there.

## Exercise: an equivalent stress check

A complete penetration butt weld in a frame member carries a normal stress of 140 MPa and a shear stress of 50 MPa at the same point. The member's illustrative design strength is 250 MPa. Does the weld pass? What if the shear rises to 90 MPa?

At 140 MPa and 50 MPa, σ_e = √(140² + 3 × 50²) = √(19,600 + 7,500) ≈ **165 MPa**, within the 250 MPa illustrative strength.

At 90 MPa shear, σ_e = √(19,600 + 3 × 8,100) = √(19,600 + 24,300) ≈ **210 MPa**, still within 250 MPa but with much less margin. Checked separately, neither 140 MPa nor 90 MPa looks alarming; combined, the weld is at about 84% of its design strength, which is why the combination must be checked.
