---
book: bulk-solids-flow-by-the-numbers
chapterSlug: bulk-solids-are-not-liquids
order: 1
title: "Bulk solids are not liquids"
description: "Why a powder or pellet store carries load by friction and force chains, so its pressures level off with depth and its discharge rate does not depend on how full it is."
draft: false
---

Pour water into a tank and every engineer knows what happens. The pressure at any depth is the density times gravity times the depth, the same in every direction. The surface is flat. Open a valve at the bottom and the outflow depends on the height of water above it, falling as the tank empties. These rules are so familiar that people carry them across to pellets and powders without noticing, and much of the trouble with bins and silos starts there.

A bulk solid is a crowd of separate particles that touch each other at points, rub against each other and against the walls, and have air in the gaps. It can stand in a heap, which no liquid can. It pushes sideways much less than it pushes down, so it leans on the walls and lets them carry part of its weight. It flows out of an outlet at a rate set by the size of the opening, not by the height above it. This chapter explains why, using Plant C's pellet silo, S1, and sets out the vocabulary the rest of the book uses.

## Particles, contacts and force chains

Look at a bed of pellets under load and the load is not shared evenly. Photoelastic experiments, in which discs of a stress-sensitive plastic are viewed through polarised light, show the force running along branching chains of particles that happen to be well aligned, while their neighbours carry very little. The review by Jaeger, Nagel and Behringer in the references describes these force chains and their consequences. A small rearrangement of a few particles can switch a chain off and send its load along another route.

Three practical consequences follow.

- **Friction lets a bulk solid hold shear.** A liquid at rest cannot resist a shearing force at all; that is what makes it a liquid. A bulk solid can, up to a limit set by friction between particles and by any cohesion. That is why it can form a slope, bridge an opening or stand as the wall of a hole.
- **Sideways pressure is less than vertical pressure.** Because the particles can hold shear, the horizontal stress in a bulk solid at rest is usually about a third to a half of the vertical stress, not equal to it. Chapter 5 puts a number on this ratio.
- **The walls carry weight.** The material rubs on the walls of its container, and the friction there holds part of the weight up. In a tall silo, most of the weight of the upper material is passed to the walls rather than to the material below.

A bulk solid must also expand slightly before it can shear, because interlocked particles have to ride up over each other. This dilation was first described by Osborne Reynolds in the 1880s. It is why a densely packed powder can be harder to start moving than a loosely packed one, and why a powder that has been vibrated or left to settle can refuse to flow at all.

```figure
type: compare
title: Water in a tank and pellets in a silo
rowhead: Behaviour
cols: Water at rest | Pellets or powder at rest
caption: The liquid rules on the left are the ones most people carry in their heads. Every row on the right is a reason a bin or silo behaves differently from the tank it resembles.
- Resists shear at rest | No | * Yes, up to a friction and cohesion limit
- Free surface | Flat | Heap at the angle of repose
- Horizontal and vertical pressure | Equal | Horizontal about 0.3 to 0.5 of vertical
- Vertical pressure with depth | Rises linearly for ever | * Rises, then levels off after a few diameters
- Who carries the weight | The floor | The floor and the walls, by friction
- Outflow through a bottom outlet | Depends on the head above | * Nearly independent of the head
- Mixture of sizes | Stays mixed | Sorts by size when poured or shaken
```

## Silo S1 as a liquid and as a solid

Silo S1 is a 3.2 m diameter stainless steel silo with a 9.0 m cylinder and a 60° conical hopper down to a 200 mm outlet. The [hopper and bin design tool](/tools/hopper-bin-design/) gives its volume as 79.8 m³, of which 72.4 m³ is in the cylinder and 7.4 m³ in the cone, and at the plant's 90% fill and the pellets' poured bulk density of 545 kg/m³ it holds 39.1 t. This is an illustration.

Suppose, for comparison, that S1 were full of water to the top of its cylinder. The pressure at the bottom of the cylinder would be ρ g h = 1,000 × 9.81 × 9.0 = 88.3 kPa, the same in every direction, and it would rise without limit if the silo were taller.

Filled with pellets to the same level, the vertical pressure at the bottom of the cylinder works out, by the Janssen method of Chapter 5, at about **26.7 kPa**. If the pellets behaved like a liquid of their own bulk density, it would be 545 × 9.81 × 9.0 = 48.1 kPa. The difference, about 44% of the weight of the cylinder's contents, is being held up by friction on the walls. The horizontal pressure on the wall at that level is smaller again, about 12.6 kPa.

```figure
type: bars
title: Vertical pressure at the bottom of S1's 9.0 m cylinder
unit: kPa
caption: Water and a liquid of the pellets' bulk density follow ρ g h. The pellets themselves, by the Janssen equation of Chapter 5 with the test values used there, carry part of their weight on the walls and press down with little more than half the liquid-equivalent pressure.
- Water | 88.3 | ρ = 1,000 kg/m³
- Liquid of bulk density 545 kg/m³ | 48.1 | ρ g h
- * Pellets, Janssen | 26.7 | wall friction carries the rest
```

The second practical difference is discharge. The [tank drain time tool](/tools/tank-drain-time-check/) calculates how a vertical tank empties through a bottom outlet, with the outflow falling as the head falls. For S1's cylinder full of water to 9.0 m, draining through the 200 mm outlet with a discharge coefficient of 0.6, it gives an outflow of 15,026 L/min at the start, about 250 kg/s, falling to about 5,000 L/min when 1 m of water is left. The tank would empty in 8.6 minutes, most of that time spent on the last few metres, because the flow falls with the square root of the head.

The pellets do something different. With the slide gate fully open and the rotary valve removed, a 200 mm outlet would pass about 16.6 kg/s of pellets, by the Beverloo correlation of Chapter 9, and that rate would stay almost the same from a full silo until the level dropped into the cone. An hourglass keeps time for this reason: the sand flows at a steady rate whatever the height of sand above the neck. S1 would empty its 39.1 t in about 39 minutes at that rate, and the rate in the last few minutes would be the same as in the first few.

```figure
type: compare
title: Outflow through S1's 200 mm outlet at different levels
rowhead: Level above the outlet
cols: Water, by the tank drain time tool | Pellets, by the Beverloo correlation
caption: Water slows as the head falls because its outflow follows √(2gh). Pellets flow at a rate set by the outlet size and particle size, so the rate barely changes until the silo is nearly empty. Water figures are for the cylinder alone; pellet figures assume the gate fully open with no feeder.
- 9 m | 15,026 L/min (250 kg/s) | about 16.6 kg/s
- 4 m | 10,017 L/min (167 kg/s) | about 16.6 kg/s
- 1 m | 5,009 L/min (83 kg/s) | about 16.6 kg/s
- 0.25 m | 2,504 L/min (42 kg/s) | about 16.6 kg/s
```

Both of these differences come from the same cause. In a bulk solid the weight above an outlet does not push material through it, because the walls and the material around the outlet carry that weight. What drives the flow is the material near the outlet falling freely under gravity through a region a little larger than the opening, and that region does not know how tall the silo is.

## Air and particle size

The gaps between particles are full of air, and how much that air matters depends mainly on particle size. For pellets a few millimetres across, the gaps are wide, air moves through them easily and the material behaves as a dry granular solid. For powders below about 100 µm, the gaps are so narrow that air moves through them slowly. A fine powder that has been aerated, for example by being blown into a bin or poured from a height, can hold that air for minutes and behave almost like a liquid, flooding through an outlet or a seal. The same powder after it has settled and de-aerated can be strong enough to stand vertically.

Fine particles also stick together. Below a few tens of micrometres, the van der Waals attraction between particles and any moisture bridges at their contacts become large compared with their weight. That cohesion gives a powder strength even when it is not being squeezed, and it is the root of most arching and ratholing. A useful working distinction for this book is between free-flowing granular materials, such as S1's pellets, and cohesive powders, such as B2's filler. The first group is mostly governed by friction and geometry; the second by friction, cohesion and air together.

## What this means for design and operation

Several rules that work for liquids give wrong answers for bulk solids, some on the safe side and some not.

1. **Capacity.** A liquid's mass is volume times density. A bulk solid's density depends on how it was filled and how long it has been sitting, and the top surface is a heap or a crater, not a flat line. Chapters 2 and 3 cover both.
2. **Pressures.** Hydrostatic pressure overestimates the vertical pressure deep in a silo but says nothing about the friction load the walls carry, which is what buckles thin silo walls. It also misses the pressure peaks that occur when a silo starts to discharge. Chapter 5 deals with static pressures; silo structural loads are set by standards such as AS 3774.
3. **Flow.** A liquid always flows out of an open outlet. A bulk solid may bridge across the outlet and stop, or flow only down a channel in the middle and leave the rest of the bin standing still. Chapters 6 to 8 cover these flow problems.
4. **Discharge rate.** Doubling the depth of water raises the outflow by √2. Doubling the depth of pellets changes almost nothing; doubling the outlet diameter raises the flow by more than five times. Chapter 9 explains why.
5. **Mixtures.** A liquid blend stays mixed. A blend of particles of different sizes separates when it is poured into a heap, discharged or vibrated. Chapter 10 covers segregation.

Plant C's two stores show the range. S1's pellets are large, smooth, nearly the same size and free of cohesion, so they flow easily and few of these effects cause trouble. B2's filler is a fine powder with particles a thousand times smaller. Its particles stick together, it holds air, and every one of the problems above has turned up in it.

## The error: a taller silo and a heavier gate

This is an illustration. Plant C's sales have grown and the purchasing manager asks whether S1 could hold two tanker loads instead of one. A fabricator offers to add a 4.5 m section to the cylinder, raising the volume to 116.0 m³ and the capacity at 90% fill to 56.9 t. The quotation includes replacing the slide gate and rotary valve, with the note that the taller silo would raise the pressure on them by 50%, since 13.5 m is 1.5 times 9 m.

The engineer checks the claim. The pressure that matters for the gate and valve is the pressure in the hopper near the outlet, and that depends on the vertical pressure arriving at the top of the hopper from the cylinder above. By the Janssen equation with S1's test values, that pressure rises from 26.7 kPa at 9.0 m to **31.4 kPa** at 13.5 m, an increase of 17.6%, not 50%. Below the transition the hopper builds its own pressure field, which near the outlet depends mainly on the outlet size and hopper shape. The existing gate and valve were rated with margin for the original design, so the replacement was not justified on pressure grounds.

The engineer's review did not stop there, because the taller silo changes other things that do scale with height and weight. The total mass on the foundation and legs rises by about 18 t. The wall friction load, which the shell carries down in compression, rises too, and thin silo walls fail by buckling under that load. Wind loading on a 15 m structure is higher than on a 10.5 m one. Those checks need a structural engineer working to AS 3774 and the wind loading standard; the point of the review was that the fabricator had applied a liquid rule to the one item it did not govern, while the items it did affect were left out of the quotation.

```figure
type: compare
title: Effect of adding 4.5 m to S1's cylinder
rowhead: Quantity
cols: 9.0 m cylinder | 13.5 m cylinder | Change
caption: Pressures from the Janssen equation with S1's test values; capacity from the hopper and bin design tool at 90% fill. The quotation assumed the gate load would scale like a liquid; the quantities that do scale with height were not in it.
- Capacity at 90% fill | 39.1 t | 56.9 t | +45%
- Vertical pressure at the bottom of the cylinder | 26.7 kPa | 31.4 kPa | * +17.6%
- Liquid-equivalent pressure, ρ g h | 48.1 kPa | 72.2 kPa | +50%
- Weight on foundations and legs | rises with contents | about 18 t more | structural check needed
```

The lesson is not that a bulk solid is always gentler than a liquid. Discharge can raise wall pressures well above the static Janssen values, and an arch or rathole that collapses suddenly can shock-load a hopper. The lesson is to stop and ask which physics governs each quantity before scaling it.

## How this applies to a small Australian business

Many small plants store bulk materials in bins bought with a machine, made locally or reused from another product: plastic pellets, flour, sugar, sand, sawdust, fertiliser, cement, feed. The trouble usually shows up as a feeder that starves, a bin that has to be hit to keep it going, a product that changes quality as a bin empties or a silo that never seems to hold its rated capacity. Each has a cause that a few measurements can identify. The first step is to stop thinking of the bin as a tank.

For a small business the payback is direct. A bin that has to be struck several times a shift costs labour, stoppages, dents that make it worse, and sometimes an injury. A material change can make a bin that worked for years stop working overnight. Knowing why is cheaper than finding out by trial.

## Exercise: the water clock and the hourglass

A small 0.8 m diameter bin with a flat bottom has a 100 mm outlet. (a) If it were full of water to 2.0 m, what would the outflow be at the start, by Q = C_d A √(2 g h) with C_d = 0.6, and what would it fall to at 0.5 m? (b) If it held dry sand, would the outflow at 0.5 m be higher, lower or about the same as at 2.0 m, and why?

**Worked answer.** (a) The outlet area is π × 0.1² ÷ 4 = 0.007854 m². At 2.0 m, √(2 × 9.81 × 2.0) = 6.264 m/s, so Q = 0.6 × 0.007854 × 6.264 = 0.02952 m³/s, about **1,771 L/min**. At 0.5 m the velocity is half as much, 3.132 m/s, so the outflow halves to about **886 L/min**. (b) For sand the outflow at 0.5 m would be **about the same** as at 2.0 m. The weight of the sand above is carried by the walls and by the material around the outlet; the flow is set by the outlet diameter and the particle size, as long as the level stays well above the outlet.
