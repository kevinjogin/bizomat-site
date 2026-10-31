---
book: yield-and-plastic-flow-by-the-numbers
chapterSlug: elastic-then-plastic
order: 1
title: "Elastic, then plastic"
description: "How a metal stretches elastically, why it yields at a tiny fraction of its theoretical strength, and how dislocations carry plastic flow and make metals harden as they deform."
draft: false
---

Load a steel bar gently and it stretches a little and springs back exactly when the load comes off. Load it harder and, past a certain stress, it stretches more for each newton added, and some of that stretch stays when the load is removed. The first behaviour is elastic, the second plastic, and the stress that separates them is the yield strength. Nearly every decision about a metal part depends on which side of that line it is on.

This chapter explains both behaviours from the arrangement of atoms in a crystal. It shows how the elastic constants describe the first, why a perfect crystal would be far stronger than any real metal, and how line defects called dislocations let real metals yield, flow and harden. It introduces the book's running case, the HC-63 hydraulic cylinder.

## The elastic part

A metal is a mass of crystals, called grains, in each of which the atoms sit on a regular lattice. Under a small load, every bond between neighbouring atoms stretches a little, like a spring, and when the load is removed every atom returns to its place. The stretch is proportional to the load. That is Hooke's law, and the constant of proportionality is set by the stiffness of the bonds.

For an isotropic material, one whose properties are the same in every direction, two constants describe that stiffness completely. Engineers use four, related to one another, because each suits a particular kind of load.

```figure
type: formula
title: The elastic constants of an isotropic material
formula: G = E ÷ [2 (1 + ν)]      K = E ÷ [3 (1 − 2ν)]
formula: λ = E ν ÷ [(1 + ν)(1 − 2ν)]
caption: Any two of E, G and ν fix the rest. A polycrystalline metal with randomly oriented grains behaves as isotropic, although each grain on its own is not.
- E | modulus of elasticity: stress ÷ strain in simple tension
- G | shear modulus: shear stress ÷ shear strain
- ν | Poisson's ratio: lateral contraction ÷ axial extension in tension
- K | bulk modulus: pressure ÷ volume strain
- λ | Lamé constant, used in three-dimensional elasticity
```

Poisson's ratio cannot exceed 0.5, the value at which a material keeps its volume under any load. Metals sit between about 0.25 and 0.35. Rubber is close to 0.5, which is why it bulges sideways when squeezed and why hydraulic seals made from it behave almost like a liquid.

### The elastic constants tool

The [elastic constants](/tools/elastic-constants/) tool calculates E, G, ν, the bulk modulus K and the Lamé constant λ from any two of E, G and ν, rejects pairs that give a Poisson's ratio outside the physical range, and flags values outside the 0.25 to 0.35 usual for metals.

```figure
type: steps
title: The HC-63 rod steel in the elastic constants tool
caption: This is an illustration. E = 205 GPa and ν = 0.29, the builder's values for carbon steel.
- Shear modulus | G = 205 ÷ (2 × 1.29) = 79.5 GPa
- * Bulk modulus | K = 205 ÷ (3 × 0.42) = 162.7 GPa
- Lamé constant | λ = 109.7 GPa
- Poisson's ratio check | 0.29, within 0.25 to 0.35
```

### The HC-63 rod, elastically

When the HC-63 extends against a load at its working pressure of 21 MPa, the oil pushes on the full 63 mm piston, with an area of 3,117 mm², and the force is 65.5 kN. The 36 mm rod, with an area of 1,018 mm², carries it at a stress of 64.3 MPa: about a sixth of its yield strength. The strain is 64.3 ÷ 205,000 = 314 microstrain, so 600 mm of rod stretches by 0.19 mm, and the rod's diameter shrinks by 36 × 0.29 × 314 × 10⁻⁶ = 0.003 mm. All of that disappears when the pressure is released. This is an illustration.

### Where elastic ends

Three terms are used for the end of elastic behaviour, and they are not the same. The proportional limit is the stress at which the stress-strain line first bends away from straight. The elastic limit is the highest stress after which the specimen returns exactly to its original length. Both are hard to measure, because the departure is gradual and depends on how sensitive the extensometer is. The yield strength used in design is therefore defined by a convention that anyone can apply: for most steels, the 0.2% offset yield, the stress at which the specimen would keep a permanent strain of 0.002 if unloaded. Mild steels with a distinct yield point quote the upper or lower yield stress instead. Chapter 2 shows how each is read from a test.

By the time a metal reaches its 0.2% offset yield, some grains have already been yielding for a while. Yield is not a switch but the point at which plastic flow has spread far enough through the grains to show on the whole specimen.

## The theoretical strength

Shear one plane of atoms over the next in a perfect crystal and the force needed rises as the atoms are pushed out of their seats, peaks when they are halfway to the next seat, and falls again. A simple model of that sliding, due to Frenkel, gives a peak shear stress of about G ÷ 2π. More careful models of the forces between atoms bring it down to something nearer G ÷ 30. Either way it is enormous.

```figure
type: compare
title: Theoretical and measured shear strength of the HC-63 rod steel
cols: Shear stress, MPa | Ratio to the measured value
rowhead: Estimate
- Frenkel, G ÷ 2π | 12,646 | 61
- Refined models, about G ÷ 30 | 2,649 | 13
- * Measured shear yield, 360 ÷ √3 | 208 | 1
caption: This is an illustration. G = 79.5 GPa; tensile yield 360 MPa from the rod bar's test in Chapter 2. Real metals yield at a small fraction of the stress that would slide perfect planes of atoms over each other.
```

The measured shear yield strength of the rod steel is about 208 MPa, between one-sixtieth and one-thirteenth of those estimates. Pure, annealed single crystals of metals yield lower still, at a few megapascals. Whatever makes real metals yield, it is not whole planes of atoms sliding at once.

## Dislocations

The answer, proposed independently by Taylor, Orowan and Polanyi in 1934, is a line defect in the crystal: the dislocation. In its simplest form, the edge dislocation, it is the edge of an extra half-plane of atoms squeezed into the lattice. Around that edge the lattice is distorted, and the atoms just there are already part-way between seats.

```figure
type: svg
title: An edge dislocation and how it moves
alt: A grid of atoms drawn as circles in rows and columns. In the upper half, one extra vertical column of atoms ends partway down, at the centre of the grid, marked with an inverted T symbol. A horizontal dashed line through the end of the extra column is labelled slip plane. A shear arrow pair above and below the grid shows the applied shear. An arrow along the slip plane shows the dislocation moving to the right, and a note says that when it reaches the edge the top half has shifted by one atomic spacing.
caption: An extra half-plane ends at the dislocation line, marked ⊥. Under shear, the dislocation moves along the slip plane one atomic spacing at a time by small adjustments of the bonds around it. When it leaves the crystal, the upper half has slipped by one spacing, the Burgers vector.
viewbox: 0 0 640 330
body:
<circle class="fa" cx="140" cy="70" r="7"/><circle class="fa" cx="200" cy="70" r="7"/><circle class="fa" cx="260" cy="70" r="7"/><circle class="fa" cx="320" cy="70" r="7"/><circle class="fa" cx="380" cy="70" r="7"/><circle class="fa" cx="440" cy="70" r="7"/><circle class="fa" cx="500" cy="70" r="7"/>
<circle class="fa" cx="140" cy="120" r="7"/><circle class="fa" cx="205" cy="120" r="7"/><circle class="fa" cx="265" cy="120" r="7"/><circle class="fa" cx="320" cy="120" r="7"/><circle class="fa" cx="375" cy="120" r="7"/><circle class="fa" cx="435" cy="120" r="7"/><circle class="fa" cx="500" cy="120" r="7"/>
<circle class="fa" cx="140" cy="170" r="7"/><circle class="fa" cx="212" cy="170" r="7"/><circle class="fa" cx="275" cy="170" r="7"/><circle class="fa" cx="320" cy="170" r="7"/><circle class="fa" cx="365" cy="170" r="7"/><circle class="fa" cx="428" cy="170" r="7"/><circle class="fa" cx="500" cy="170" r="7"/>
<circle class="fa" cx="140" cy="230" r="7"/><circle class="fa" cx="200" cy="230" r="7"/><circle class="fa" cx="260" cy="230" r="7"/><circle class="fa" cx="380" cy="230" r="7"/><circle class="fa" cx="440" cy="230" r="7"/><circle class="fa" cx="500" cy="230" r="7"/><circle class="fa" cx="320" cy="232" r="7"/>
<circle class="fa" cx="140" cy="280" r="7"/><circle class="fa" cx="200" cy="280" r="7"/><circle class="fa" cx="260" cy="280" r="7"/><circle class="fa" cx="320" cy="280" r="7"/><circle class="fa" cx="380" cy="280" r="7"/><circle class="fa" cx="440" cy="280" r="7"/><circle class="fa" cx="500" cy="280" r="7"/>
<path class="ln dsh" d="M100 200H560"/>
<path class="ln" d="M308 192H332M320 192V178"/>
<text class="tx txs" x="565" y="205">slip plane</text>
<text class="txb" x="300" y="30">extra half-plane ends at ⊥</text>
<path class="la draw" pathLength="1" d="M340 200H450"/>
<path class="ah" d="M450 194L462 200L450 206Z"/>
<path class="la" d="M150 40H300"/><path class="ah" d="M300 34L312 40L300 46Z"/>
<path class="la" d="M490 310H340"/><path class="ah" d="M340 304L328 310L340 316Z"/>
<text class="tx txs" x="40" y="45">shear</text>
<text class="tx txs" x="510" y="325">shear</text>
```

To move the dislocation by one atomic spacing, only the bonds right at its core need to shift, and each by a small amount. The stress to do that is a tiny fraction of the stress to slide a whole plane at once, in the same way that a rug is moved across a floor more easily by pushing a ruck along it than by dragging the whole rug. When the dislocation has crossed the crystal, the top half has slipped over the bottom half by exactly one atomic spacing, a distance called the Burgers vector, b. For iron it is about 0.248 nm.

Plastic deformation is the passage of enormous numbers of dislocations. The plastic shear strain they produce is given by Orowan's relation, γ = ρ b x̄, where ρ is the dislocation density, in metres of dislocation line per cubic metre of crystal, and x̄ is the average distance each moves. An annealed steel holds about 10¹² m of dislocation line per cubic metre, a kilometre in every cubic millimetre. To give a plastic shear strain of 0.002, roughly the strain at the 0.2% offset yield, each of those dislocations needs to move an average of only 0.002 ÷ (10¹² × 0.248 × 10⁻⁹) = 8 µm: a few grain diameters at most.

### Slip in a polycrystal

A dislocation moves on particular crystal planes, in particular directions, its slip system. It responds to the shear stress resolved onto that plane and direction, which is at most half the applied tensile stress, on a plane at 45° to the load. In a polycrystal, each grain is oriented differently, and every grain must deform in a way compatible with its neighbours, which needs several slip systems to operate at once. As a result, the tensile yield strength of a polycrystal is about two and three-quarters to three times the shear stress needed to move dislocations on a single favourably oriented system; the factor is called the Taylor factor.

## Why metals harden as they flow

If dislocations moved freely, a metal would flow at a constant stress once it yielded. Real metals get stronger as they deform: that is work hardening, and it is what lets a tensile bar stretch uniformly before it necks, and what makes cold-drawn tube and rolled threads stronger than the bar they started from.

The cause is the dislocations themselves. Each is surrounded by a stress field that pushes and pulls on its neighbours. As deformation proceeds, dislocations multiply, by mechanisms that let a pinned segment bow out and release new loops, and they tangle, pile up at grain boundaries and cut through each other. The more there are, the harder it is for any one to move. Taylor's relation captures this: the flow stress rises with the square root of the dislocation density.

```figure
type: bars
title: Contribution of dislocation density to the shear flow stress of steel
unit: MPa
caption: This is an illustration. Taylor's relation τ = α G b √ρ, with α = 0.3, G = 79.5 GPa and b = 0.248 nm. Heavy cold work raises the dislocation density a thousandfold and the hardening contribution about thirtyfold.
- Annealed, 10¹² m⁻² | 5.9
- Lightly worked, 10¹⁴ m⁻² | 59.1
- * Heavily cold-worked, 10¹⁵ m⁻² | 186.9
```

In steel, the interstitial carbon and nitrogen atoms add another effect. They gather at dislocations and pin them, so that a fresh, annealed mild steel shows a distinct upper yield point, where pinned dislocations break free, followed by a drop to a lower yield stress at which deformation spreads along the bar in bands. Chapter 3 returns to this, and to strain ageing, when the pinning comes back after cold work.

## Everything that strengthens a metal

If dislocations make metals weak, anything that hinders them makes metals strong. Every practical way of strengthening a metal works by putting obstacles in the dislocations' path, and the yield strength on a mill certificate is the sum of their effects.

```figure
type: compare
title: Ways of hindering dislocations
cols: How it works | Where it appears in the HC-63
rowhead: Mechanism
- Lattice friction | the crystal's own resistance to dislocation movement; small in pure iron | the base of every steel's strength
- Solid solution | dissolved atoms distort the lattice and pin dislocations | carbon, manganese and silicon in the rod and barrel steels
- Grain boundaries | dislocations pile up at boundaries; smaller grains, shorter pile-ups, higher strength | normalised bar and plate (Chapter 4)
- * Work hardening | more dislocations tangle and obstruct each other | the cold-drawn barrel and rolled thread (Chapters 3 and 9)
- Second-phase particles | hard particles or precipitates block or bend dislocations | pearlite in the carbon steels; precipitates in micro-alloyed plate
- Transformation | a hard, strained structure such as martensite forms on quenching | the induction-hardened rod surface
caption: The mechanisms add, roughly, to give the yield strength. Most also lower ductility, which is why the strongest condition of a steel is rarely the easiest to form.
```

Two of these matter most for this book. Grain size can be controlled by heat treatment and rolling practice, and it raises strength without the usual loss of toughness; Chapter 4 puts numbers on it. Work hardening is the one that engineers produce, often without meaning to, every time they bend, draw, roll or straighten a part. It raises the yield strength where the metal has flowed and lowers the remaining ductility there, and it leaves behind residual stresses. A bent bracket, a cold-drawn tube and a rolled thread are all different materials, in their worked zones, from the bar or plate they started as.

The same mechanisms run backwards when a metal is heated. Annealing lets dislocations rearrange and annihilate, and at higher temperatures new strain-free grains grow, a process called recrystallisation. Work hardening and residual stress are removed together, which is why stress-relieving and annealing are part of so many process routes (Chapter 10).

## The running case: the HC-63

The book follows one product. This is an illustration. A hydraulic cylinder builder in Bayswater, Western Australia, makes the HC-63 for mobile mining equipment: 63 mm bore, 36 mm rod, 21 MPa working pressure and a 31.5 MPa proof test. Its parts span the whole subject of this book.

```figure
type: compare
title: Where the HC-63 meets yield and plastic flow
cols: What must not yield | What is made by yielding | Chapter
rowhead: Part
- * Barrel, cold-drawn tube 63 × 76 mm | the wall under working and test pressure | the tube itself, by cold drawing | 3, 5 and 6
- Rod, 36 mm bar | the rod under load | its end thread, by rolling | 2, 4 and 9
- Mounting brackets, 10 mm plate | the bracket in service | the bend, on a press brake | 7
- Hydraulic lines, 16 × 2 mm tube | the tube under pressure | the bends | 8
- Test bench | the bench's tie bars when the oil heats them | nothing | 10
caption: This is an illustration. The same material property, yield, is a limit for some parts and a manufacturing process for others.
```

## The error: two constants from two tables

A design engineer checking the twist of the HC-63's rod under a side-mounted torque arm needed its shear modulus. The engineer took E = 210 GPa from one textbook table and G = 75 GPa from another, and entered both in a spreadsheet that calculated the other constants from them.

The elastic constants tool, entered with the same pair in its "E and G" mode, showed the problem at once: Poisson's ratio would be 210 ÷ (2 × 75) − 1 = 0.40, and the bulk modulus 210 ÷ (3 × 0.2) = 350 GPa, more than twice the 163 GPa that a steel should have. The tool accepted the pair, because 0.40 is physically possible, but its check flagged it as outside the usual range for metals.

E, G and ν are not independent. Two values taken from different sources, each rounded, or each for a slightly different steel, can imply a third that is impossible or absurd. The engineer's torsion result was only about 6% out, but the same spreadsheet used the bulk modulus to estimate the barrel's volume change under pressure, and there it was badly wrong. The builder's rule now is to take two constants from one source, calculate the others, and never type in all three.

```figure
type: compare
title: Two constants from two tables against two from one
cols: E, GPa | G, GPa | ν implied | K implied, GPa
rowhead: Inputs
- Mixed tables | 210 | 75 | 0.40 | 350
- * One source, E and ν | 205 | 79.5 | 0.29 | 162.7
caption: This is an illustration. Elastic constants tool. A small mismatch in E and G produces a large error in ν and a very large one in K, because K depends on 1 − 2ν.
```

## Safety and duty of care

A hydraulic cylinder stores energy in its compressed oil and in whatever it is holding up, and a part that yields or bursts releases it. Under the model WHS laws, those who design, manufacture and test plant must manage those risks so far as is reasonably practicable, and Safe Work Australia's model Code of Practice on managing the risks of plant explains how. The yield checks in this book are part of that; so are the guards, procedures and inspections that surround the testing of pressurised equipment.

## Exercise: the rod on the return stroke

On its return stroke the HC-63 pulls with 21 MPa acting on the annulus between the 63 mm bore and the 36 mm rod. Find the pulling force and the rod's tensile stress, strain and extension over 600 mm, using E = 205 GPa. What is the ratio of the stress to the rod steel's 360 MPa yield strength?

**Worked answer.** The annulus area is π ÷ 4 × (63² − 36²) = 2,099 mm², so the force is 21 × 2,099 = 44.1 kN. The rod's stress is 44,087 ÷ 1,018 = 43.3 MPa, its strain 43.3 ÷ 205,000 = 211 microstrain, and its extension over 600 mm is 0.127 mm. The stress is 12% of the yield strength. The rod is far from yielding in simple tension; Chapters 5 and 9 show where its real limits lie, at its thread and under combined loads.
