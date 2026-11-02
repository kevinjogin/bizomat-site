---
book: distribution-transformers-by-the-numbers
chapterSlug: why-iron-is-magnetic
order: 1
title: "Why iron is magnetic"
description: "Why iron is strongly magnetic: electron spins, exchange and domains give a transformer core its high permeability and saturation, and magnetism vanishes above the Curie temperature."
draft: false
---

A transformer works because its core carries a large, alternating magnetic flux that links its two windings, and it can do so with a tiny magnetising current only because the core is made of iron. Replace the iron with air and the same winding would need tens of thousands of times more current to set up the same flux. Almost everything about a transformer's design, its losses, its noise and its behaviour when switched on follows from what iron does in a magnetic field and why.

This chapter explains magnetism from the atoms up: where atomic magnetic moments come from, why in iron they line up with their neighbours, how domains make that alignment controllable, what limits it, and why it vanishes at the Curie temperature. It then looks at the silicon steel used in TX-1's core and why its grains are aligned, and ends with a steel plate in TX-1's cable box that was heating itself for no obvious reason.

## Where atomic magnetism comes from

Every electron behaves as a tiny magnet. Part of that comes from its motion around the nucleus, like a current in a loop, and part from a property called spin, which has no exact everyday analogue but carries a fixed magnetic moment of about one Bohr magneton, 9.27 × 10⁻²⁴ A·m². In most atoms the electrons pair up, two to each orbital with opposite spins, and their moments cancel. Atoms with completely filled shells have no net moment at all.

Iron, cobalt and nickel are different. Their outer 3d shells are only partly filled, and the electrons in them, following the rule that atoms prefer unpaired spins when they can, leave several spins unpaired. In a solid the orbital part of the moment is largely suppressed by the electric fields of the neighbouring atoms, but the spins remain. In metallic iron the result is about 2.2 Bohr magnetons per atom.

That alone would make iron only weakly magnetic, like many other substances whose atoms carry moments: in a field the moments would tilt slightly towards it, against the jostling of thermal agitation, and the effect would be tiny. What makes iron special is that its atoms' moments do not act independently.

## Exchange: why neighbouring spins line up

In iron, neighbouring atoms' spins are strongly coupled, so that the lowest energy state has them all pointing the same way. The coupling is not magnetic at all: the magnetic force between two atomic moments is far too weak. It is a consequence of quantum mechanics and the electrostatic repulsion between electrons. Electrons with parallel spins cannot occupy the same place, so they keep further apart and repel each other less, which lowers their energy. In iron, cobalt and nickel the balance of this saving against the extra kinetic energy it costs favours parallel spins. The effect is called exchange, and it acts as if a field of hundreds of teslas were holding each moment in line with its neighbours.

The result is spontaneous magnetisation: below a certain temperature, the atomic moments in a region of iron line up by themselves, without any applied field. That is ferromagnetism. Only a handful of elements and many alloys and compounds show it at room temperature.

The size of the effect can be checked with simple arithmetic. Iron has 8.49 × 10²⁸ atoms per cubic metre. At 2.22 Bohr magnetons each, fully aligned, they give a magnetisation of 1.75 × 10⁶ A/m. Multiplied by the permeability of free space, 4π × 10⁻⁷, that is a flux density of 2.20 T. Measured, pure iron saturates at about 2.15 T. That is the most flux any iron core can carry from its own magnetisation, and it explains why transformer cores work at 1.5 to 1.7 T: close enough to saturation to use the iron well, far enough below it to leave room for the supply voltage to rise.

```figure
type: steps
title: The saturation flux density of iron from its atoms
caption: Arithmetic with standard physical constants: density 7,874 kg/m³, molar mass 55.845 g/mol and 2.22 Bohr magnetons per atom. The measured saturation of pure iron, about 2.15 T, agrees within a few per cent.
- Atoms per cubic metre, 7,874 ÷ (55.845 × 1.66 × 10⁻²⁷ kg) | 8.49 × 10²⁸
- Moment per atom, 2.22 × 9.27 × 10⁻²⁴ A·m² | 2.06 × 10⁻²³ A·m²
- Magnetisation if all are aligned | 1.75 × 10⁶ A/m
- * Flux density from it, × 4π × 10⁻⁷ | 2.20 T
```

## Domains

If every atom in a lump of iron is already aligned, why is an ordinary nail not a strong magnet? Because a uniformly magnetised piece of iron would spread a large magnetic field into the space around it, and that field stores energy. The iron lowers its total energy by splitting into domains, regions each magnetised to saturation but pointing in different directions, so that their external fields largely cancel. Domains are typically tens to hundreds of micrometres across, separated by thin domain walls in which the moments turn gradually from one direction to the next.

Domains are the key to a transformer core. Apply a small field and the domains that happen to point roughly along it grow at the expense of the others, as their walls move. Wall movement needs very little energy in a good soft magnetic material, so a field of a few tens of amperes per metre can bring the core close to saturation. In air, the same 1.65 T needs a field of 1.31 million amperes per metre, more than 40,000 times as much. That ratio is why TX-1's magnetising current is less than 1% of its rated current.

```figure
type: compare
title: Air and a grain-oriented steel core at TX-1's working flux density
cols: Field needed for 1.65 T | Ampere-turns for a 4 m flux path | Magnetising current on 15 LV turns
rowhead: Material
- Air | 1,313,000 A/m | 5.25 million | about 350,000 A
- * Grain-oriented silicon steel, about 30 A/m | 30 A/m | 120 | about 8 A, 0.4% of rated
caption: This is an illustration. The field for the steel is an assumed typical value well below saturation; real cores need more at the joints between laminations, so measured magnetising currents are somewhat higher, but still a small fraction of the 2,000 A rated LV current.
```

Wall movement is not perfectly smooth. Walls catch on impurities, grain boundaries and internal stresses and then jump free, and each jump dissipates a little energy. That is the origin of hysteresis loss, the subject of Chapter 3, and the reason core steels are made very clean, annealed to relieve stress and handled carefully during core building.

## Saturation and the Curie temperature

Once every domain points along the field, the iron is saturated: more field adds flux only as fast as it would in air. Saturation is the hard limit on a core's flux density, and Chapter 5 shows what happens when switching a transformer on drives its core into saturation for a few cycles.

Heat works against exchange. As temperature rises the atoms' moments wobble more, the average alignment within each domain falls and the saturation flux density drops. At the Curie temperature the alignment vanishes altogether and the material stops being ferromagnetic. For iron that is about 770 °C. The Library's [Induction Hardening by the Numbers](/reados/publications/induction-hardening-by-the-numbers/) shows how this transition changes the way steel heats in an induction coil. In a transformer the core never comes near it, but the falling saturation with temperature is one reason core temperature limits matter.

## Silicon steel and grain orientation

TX-1's core, like nearly every power transformer core, is made of thin sheets of iron alloyed with about 3% silicon. Silicon does three useful things. It raises the electrical resistivity about fourfold, from roughly 0.1 to about 0.48 µΩ·m, which reduces the eddy currents of Chapter 3. It reduces the energy needed to rotate the magnetisation away from the crystal's preferred directions, which narrows the hysteresis loop. And it reduces magnetostriction, the small change in length of the steel as it magnetises, which is the source of a transformer's hum (Chapter 9). The cost is a slightly lower saturation, about 2.0 T, and a more brittle steel.

Each iron crystal has easy directions of magnetisation along its cube edges. In ordinary sheet steel the grains point every which way, so in any direction only some of them are easy. Grain-oriented steel is rolled and annealed in a carefully controlled sequence so that nearly all its grains end up with a cube edge along the rolling direction. Along that direction it magnetises with very little field and low loss; across it, it is much worse. Transformer cores are therefore built so that the flux runs along the rolling direction in every limb and yoke, with the sheets cut at 45° at the corners where the flux turns.

```figure
type: compare
title: Iron and its alloys as core materials
cols: Saturation flux density | Resistivity | Notes
rowhead: Material
- Pure iron | about 2.15 T | about 0.10 µΩ·m | High eddy losses in alternating fields
- Non-oriented silicon steel | about 2.0 T | about 0.4–0.5 µΩ·m | Same in all directions; used in motors
- * Grain-oriented silicon steel, about 3% Si | about 2.0 T | about 0.48 µΩ·m | Low loss along the rolling direction; transformer cores
- Iron-based amorphous metal | about 1.56 T | about 1.3 µΩ·m | No grains; very low loss, lower saturation (Chapter 3)
caption: Indicative values from published material data; the steel maker's data for a particular grade govern a real design.
```

## Soft and hard magnetic materials

The same physics gives two opposite kinds of useful material. A permanent magnet is made hard on purpose: its microstructure pins domain walls so firmly, or makes its grains so small that each is a single domain, that once magnetised it stays magnetised against large opposing fields. Its hysteresis loop is wide, and the area inside it, the energy lost in taking it round once, is large; that does not matter, because a permanent magnet is magnetised once and then left alone. The Library's [Permanent Magnets in Machines by the Numbers](/reados/publications/permanent-magnets-in-machines-by-the-numbers/) deals with those materials.

A transformer core must be the opposite: as soft as possible, so that its domain walls move freely, its magnetisation follows the alternating field fifty times a second with the least possible lag, and its loop is as narrow as can be made. Every cycle, the area of the loop is paid for in heat, 4.32 million cycles a day for as long as the transformer is energised, loaded or not. Softness comes from clean steel with few inclusions to pin walls, large grains with few boundaries, freedom from internal stress, and alloying that reduces the energy cost of turning the magnetisation. Each of those is a matter of steelmaking and core building, and Chapter 3 shows what each costs in watts.

## The case: TX-1's core in numbers

TX-1's core is a three-limb core of grain-oriented steel, 0.27 mm thick, working at a peak flux density of 1.65 T at the principal tap and rated voltage. It weighs about 1,850 kg. Chapter 2 shows how the flux density follows from the voltage and the turns, and Chapter 3 how the core's 2.40 kW of no-load loss follows from its steel and its building. The magnetic properties of the steel, its permeability, saturation and losses, all come from the physics in this chapter.

## When it goes wrong: the hot gland plate

A routine thermal image of TX-1's low-voltage cable box showed the steel gland plate, through which the LV cables enter, at about 95 °C on a busy afternoon, while the box around it was at 35 °C. The cables themselves were cool. The plate had been replaced in 2014, when the cables were renewed, with a new steel plate drilled with a separate hole for each single-core cable.

The cause was magnetism. A single conductor carrying 2,000 A of alternating current is surrounded by an alternating magnetic field. Where it passes through a hole in a steel plate, the steel around the hole forms a closed magnetic path around the conductor, and the field drives an alternating flux round it. Every cycle that flux magnetises the steel back and forth, dissipating hysteresis loss, and induces eddy currents in the plate. With all three phases and the neutral passing through one opening, their fields would largely cancel; with each phase in its own hole, they do not.

```figure
type: decision
title: Fixing TX-1's hot gland plate
caption: This is an illustration. The plant fitted an aluminium plate; austenitic stainless steel, which is not ferromagnetic, would also have served.
- Add ventilation to the cable box | Treats the symptom; the plate still makes heat | Not adopted
- Cut slots between the holes in the steel plate | Breaks the magnetic paths; cheap, but weakens the plate | Considered
- * Replace the plate with aluminium | Not ferromagnetic, so no closed magnetic path; small eddy loss only | Adopted
```

Austenitic stainless steel, such as grade 304, is worth a note because it shows that magnetism depends on structure, not just on the elements present. It is mostly iron, yet its atoms sit on a face-centred cubic lattice whose spacing does not favour parallel spins at room temperature, so it is not ferromagnetic. Ordinary carbon steel, with iron atoms on a body-centred cubic lattice, is. The new aluminium plate ran at the cable box's own temperature.

## Exercise: a magnetic check

A fitter preparing a replacement gland plate for another switchboard has a sheet that may be 304 stainless steel or ferritic stainless steel, which is ferromagnetic.

1. How can a permanent magnet tell them apart, and why does it work?
2. Iron's saturation flux density is about 2.15 T and silicon steel's about 2.0 T. If a core of either is worked at 1.7 T, what fraction of its saturation flux density is that?
3. Why is a core never worked at, say, 2.1 T in iron to save steel?

**Answer.**

1. A magnet is strongly attracted to ferritic stainless steel, because its body-centred cubic structure is ferromagnetic, and only very weakly to annealed 304, whose face-centred cubic structure is not. Cold-worked 304 can be slightly magnetic, because working transforms part of it to a magnetic phase, so a weak pull is not conclusive, but a strong one is.
2. For iron, 1.7 ÷ 2.15 = 79%; for silicon steel, 1.7 ÷ 2.0 = 85%.
3. Near saturation the field needed for each extra bit of flux rises steeply, so the magnetising current would be large and distorted, the losses higher, and any rise in supply voltage, or the transient at switch-on, would drive the core hard into saturation. Silicon steel, despite its lower saturation, is used because its far lower losses matter more than the few per cent of flux given up.
