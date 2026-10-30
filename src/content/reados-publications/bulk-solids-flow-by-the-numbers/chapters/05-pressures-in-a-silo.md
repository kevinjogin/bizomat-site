---
book: bulk-solids-flow-by-the-numbers
chapterSlug: pressures-in-a-silo
order: 5
title: "Pressures in a silo: the Janssen equation"
description: "Derive the Janssen equation from a slice balance, apply it to Plant C's pellet silo, see how wall friction shifts weight from the floor to the walls, and know what static pressures leave out."
draft: false
---

In 1895 the German engineer H. A. Janssen measured the pressure on the floor of model grain bins and found that it stopped rising once the grain was a few bin widths deep. His explanation, a simple force balance on a thin slice of grain, gave an equation that is still the starting point for silo pressures more than a century later. Kadanoff's lectures reprint experimental work on the same effect, because it is one of the clearest everyday examples of a many-particle system behaving unlike a fluid.

This chapter derives the Janssen equation, applies it to Plant C's pellet silo S1, and shows how it moves weight from the floor to the walls. It explains why the wall friction angle has to be chosen differently for different checks, and it is clear about what the equation leaves out: the pressure changes during discharge that govern most silo failures and that silo standards deal with.

## The slice balance

Take a cylindrical silo of diameter D and cross-sectional area A = π D² ÷ 4, filled with a bulk solid of bulk density ρ_b. Consider a thin horizontal slice of thickness dz at depth z below the surface. Four forces act on it vertically:

- its weight, ρ_b g A dz, downwards;
- the vertical pressure from above, p_v A, downwards;
- the vertical pressure from below, (p_v + dp_v) A, upwards;
- the friction from the wall, which holds the slice up.

The wall friction is the wall shear stress times the wall area of the slice, π D dz. Two assumptions turn it into something calculable. The horizontal pressure on the wall is a fixed fraction K of the vertical pressure, p_h = K p_v, where K is called the lateral pressure ratio. And the material is on the point of sliding at the wall, so the wall shear stress is μ_w p_h, with μ_w = tan φ_w, the wall friction coefficient from Chapter 4.

Balancing the forces and dividing by A dz gives

dp_v ÷ dz = ρ_b g − (4 μ_w K ÷ D) p_v

With p_v = 0 at the surface, the solution is the Janssen equation.

```figure
type: formula
title: The Janssen equation for a cylindrical silo
formula: p_v(z) = p_∞ × [1 − exp(−z ÷ z₀)]     z₀ = D ÷ (4 μ_w K)     p_∞ = ρ_b g z₀     p_h = K p_v     τ_w = μ_w K p_v
caption: z is measured down from the surface, or from the equivalent level surface when the top is a heap. Near the surface the pressure rises like a liquid's; deep down it approaches the limit p_∞, about 95% of which is reached at three times z₀.
- p_v, p_h | vertical pressure in the material and horizontal pressure on the wall
- τ_w | wall shear stress, the friction the wall carries per unit area
- z₀ | characteristic depth, a few silo diameters for typical materials
- p_∞ | limiting vertical pressure deep in a tall silo
- μ_w = tan φ_w | wall friction coefficient
- K | lateral pressure ratio, horizontal ÷ vertical stress
step: S1: z₀ = 3.2 ÷ (4 × 0.2493 × 0.4701) = 6.826 m; p_∞ = 545 × 9.807 × 6.826 = 36.48 kPa
step: At z = 9.0 m: p_v = 36.48 × (1 − e^(−1.319)) = 26.72 kPa; p_h = 12.56 kPa; τ_w = 3.13 kPa
```

Near the surface, where z is small compared with z₀, the exponential is close to 1 − z ÷ z₀ and the equation reduces to p_v ≈ ρ_b g z, the liquid result. The material has not yet built up enough wall friction to matter. Deep down, the wall friction on each new slice carries the slice's whole weight, and the pressure stops rising.

## The lateral pressure ratio

K is the one input Janssen had to guess. For a granular material at rest, a common estimate is Jáky's approximation from soil mechanics, K ≈ 1 − sin φ_i, where φ_i is the angle of internal friction. For S1's pellets, with φ_i = 32° from Chapter 4, K = 1 − sin 32° = **0.470**.

K is not a fixed property. It depends on whether the wall moves slightly outwards or inwards, on how the silo was filled and on whether the material is at rest or flowing. Silo load standards such as AS 3774 and EN 1991-4 define how K is to be taken for design, often with an adjustment factor on Jáky's value. This book uses the plain Jáky value for illustration and does not quote any standard's factor.

## S1's static pressures

With S1's diameter of 3.2 m, the pellets' bulk density of 545 kg/m³, a wall friction angle of 14° (μ_w = 0.2493) and K = 0.470, the characteristic depth is z₀ = **6.83 m** and the limiting pressure is p_∞ = **36.5 kPa**. S1's 9.0 m cylinder is only 1.3 z₀ deep, so its pressures are still rising at the bottom, but already well below the liquid line.

```figure
type: line
title: Vertical pressure down S1's cylinder, Janssen and liquid-equivalent
x: Depth below the surface, m
y: Vertical pressure, kPa
ymin: 0
ymax: 50
legend: Janssen | Liquid of bulk density
caption: This is an illustration. Janssen pressure with φ_w = 14°, K = 0.470 and ρ_b = 545 kg/m³; liquid-equivalent pressure is ρ_b g z. The two agree near the surface and separate with depth as the walls take up the weight.
- 0 | 0 | 0
- 1 | 5.0 | 5.3
- 2 | 9.3 | 10.7
- 3 | 13.0 | 16.0
- 4 | 16.2 | 21.4
- 5 | 18.9 | 26.7
- 6 | 21.3 | 32.1
- 7 | 23.4 | 37.4
- 8 | 25.2 | 42.8
- 9 | 26.7 | 48.1
```

At the bottom of the cylinder the horizontal pressure on the wall is K p_v = **12.6 kPa** and the wall shear stress is μ_w p_h = **3.13 kPa**. The hoop tension in the shell from the horizontal pressure is p_h × D ÷ 2 = 12.56 × 1.6 = 20.1 kN per metre of height, a modest load for a stainless shell a few millimetres thick. The more demanding load is the vertical compression the wall collects from friction all the way down, which is what thin silo walls fail by: buckling.

### The heap and the equivalent surface

S1 is filled through a central inlet, so its top is the 33° heap of Chapter 3, 1.039 m high. Janssen's equation assumes a flat surface. The usual way round this is to measure depth from the equivalent level surface, the flat surface that would hold the same volume. For a cone that is one-third of the heap height above its base. If the heap's apex is at the top of the cylinder, the equivalent surface is 0.346 m below the top, and the depth to the bottom of the cylinder is 8.654 m, giving p_v = 26.2 kPa instead of 26.7 kPa. For S1 the difference is small; for a squat silo with a large heap it is not.

## Where the weight goes

The total weight of pellets in S1's cylinder, filled level to the top, is ρ_b g A H = 545 × 9.807 × 8.042 × 9.0 = **386.9 kN**. The vertical force they pass to the hopper below is the Janssen pressure times the area, 26.72 × 8.042 = **214.9 kN**. The difference, **172.0 kN** or 44% of the cylinder's contents, is carried by friction on the wall, an average of 17.1 kN on every metre of the silo's circumference by the time it reaches the bottom of the cylinder.

That redistribution changes which part of the structure carries what, but not the total. Every newton of the contents still goes down through the shell or the hopper to the supports and foundations. A common mistake is to use the reduced floor pressure to size the legs or foundation; those must carry the full weight of the contents, plus the silo itself and any dynamic and wind effects.

For B2, a bin on four legs, the [tank stand leg check tool](/tools/tank-stand-leg-check/) makes the point simply. It treats the bin as a vertical cylinder full of contents of a given density, adds the empty mass, shares the total equally between the legs and checks each leg for buckling as a column. B2's 3.947 m³ is entered as an equivalent cylinder 1,963 mm tall on its 1.6 m diameter, with the filler's upper density of 900 kg/m³ from Chapter 2 and an empty mass of 420 kg for the bin, screw feeder and fittings. On four 76.1 × 3.6 mm steel tube legs with 1.8 m unsupported, an effective length factor of 1.2 and 350 MPa yield, it gives a full mass of 3,972 kg, 9.74 kN per leg and a buckling safety factor of 20.2. This is an illustration. The legs are not in question; the point is that they carry the whole 3,972 kg however the friction inside the bin is distributed. The tool's own check notes what it leaves out: wind, seismic loads and bracing, which matter for a tall or outdoor bin.

```figure
type: stats
title: Where the weight of S1's cylinder contents goes, cylinder filled level
caption: This is an illustration. Janssen with φ_w = 14° and K = 0.470. The wall friction load is carried down the shell in compression; the supports carry everything.
- 386.9 kN | weight of pellets in the 9.0 m cylinder
- 214.9 kN | passed down to the hopper as vertical pressure
- 172.0 kN | carried by wall friction, 44% of the total
- 17.1 kN/m | wall friction load per metre of circumference at the bottom of the cylinder
```

## The error: one friction angle for every check

This is an illustration. When the plant asked a structural engineer to review S1 after a change of pellet grade, a graduate engineer prepared the first draft of the calculations using the wall friction angle from the test report, 14°, for every load case. The reviewing engineer returned the draft with one comment: the friction angle that gives the highest floor pressure is not the one that gives the highest wall load.

The wall friction angle varies. It falls if the wall is polished by years of flow and rises if it is roughened, corroded, coated in fines or wetted by condensation, and pellet grades differ. Lower wall friction lets more weight reach the hopper and raises the vertical pressure there. Higher wall friction loads the wall more heavily in vertical compression, the load case for buckling. Each check must use the value that is unfavourable for it.

Re-running the Janssen calculation for a plausible range of φ_w from 10° to 20° shows how much it matters.

```figure
type: compare
title: S1's cylinder, by wall friction angle, cylinder filled level
rowhead: Wall friction angle
cols: z₀ | Vertical pressure at 9 m | Horizontal pressure at 9 m | Wall friction load
caption: This is an illustration. K = 0.470, ρ_b = 545 kg/m³. Low wall friction governs the hopper and floor; high wall friction governs the shell's vertical compression. The graduate's draft used 14° for both and understated each by roughly a fifth.
- 10°, polished wall | 9.65 m | 31.3 kPa | 14.7 kPa | 135.3 kN
- 14°, test report | 6.83 m | 26.7 kPa | 12.6 kPa | 172.0 kN
- 20°, rough or wetted wall | 4.68 m | 21.3 kPa | 10.0 kPa | * 215.2 kN
```

With 10°, the vertical pressure at the transition is 31.3 kPa, 17% higher than the draft's 26.7 kPa. With 20°, the wall friction load is 215.2 kN, 25% higher than the draft's 172.0 kN. The draft had understated both governing loads at once. Silo load standards formalise this by requiring upper and lower characteristic values of each material property; the principle can be applied even in a quick check.

## What the static equation leaves out

Janssen's equation describes a silo that has been filled and left at rest. Silos fail mostly when they are emptied, and several effects of discharge are outside the static equation.

1. **Discharge pressures.** When a silo starts to discharge, the stress state in the flowing material changes. In mass flow, a peak of wall pressure forms where the flowing material converges at the transition from cylinder to hopper, often called the switch. Wall pressures in the cylinder can also rise above the static values.
2. **Eccentric discharge.** If material leaves from an off-centre outlet, or flows down one side in funnel flow, the pressures around the circumference become uneven. Uneven pressure bends a thin shell out of round and is a well-known cause of silo buckling.
3. **Patch loads and impact.** Collapsing arches and ratholes, and the falling stream during filling, apply local and dynamic loads.
4. **Hopper pressures.** The hopper has its own pressure field, which depends on its angle, the wall friction and whether the material is flowing.

Silo standards such as AS 3774 and EN 1991-4 set out load cases and factors for all of these, and real silo design follows them. Janssen's equation is the foundation they build on and a useful sanity check, not a design load.

## Stresses near the outlet

One feature of hopper stresses matters so much for flow that it is worth stating here. In a converging hopper that is discharging in mass flow, the stresses in the material fall towards the outlet. Jenike's analysis of the flowing material shows that, well below the transition, the stress field depends only on the distance from the hopper's imaginary apex: the stresses are roughly proportional to that distance, whatever is above. Near the outlet they are therefore small, set by the outlet size, the hopper angle and the material's density, and nearly independent of how tall the silo is.

That has two consequences. It explains why the gate and valve in Chapter 1's taller silo hardly noticed the extra height: the material near the outlet was carrying very little of it. And it explains why arching happens at the outlet. The material there has been consolidated by modest stresses, so it is not very strong, but the stresses available to break an arch across the opening are smaller still if the opening is narrow. Chapter 7 turns that comparison into a calculation of the smallest outlet that will not arch.

## How this applies to a small Australian business

The Janssen equation is a five-minute calculation that explains a lot. It shows why a tall silo does not need a proportionally stronger outlet gate, why a silo's legs must carry its full contents even though the floor does not, and why a change of material, coating or wall condition changes the loads. For an existing silo, it is a good way to understand a structural engineer's report. For a new or modified silo, it is where the engineer starts, not where they stop.

## Exercise: a taller, narrower silo

A proposed replacement for S1 is 2.6 m in diameter with a 14.0 m cylinder, storing the same pellets. Using φ_w = 14° and K = 0.470, find z₀, p_∞ and the vertical pressure at the bottom of the cylinder, and compare the vertical pressure with S1's 26.7 kPa.

**Worked answer.** z₀ = 2.6 ÷ (4 × 0.2493 × 0.4701) = **5.546 m**. p_∞ = 545 × 9.807 × 5.546 = **29.64 kPa**. At 14.0 m, z ÷ z₀ = 2.524 and e^(−2.524) = 0.0801, so p_v = 29.64 × (1 − 0.0801) = **27.27 kPa**, only about 2% more than S1's 26.7 kPa although the cylinder is more than half as tall again. The narrower diameter lowers the limiting pressure, and at 2.5 z₀ the pressure is already within 8% of it.
