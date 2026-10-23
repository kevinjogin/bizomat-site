---
book: gears-by-the-numbers
chapterSlug: centre-distance-and-contact-ratio
order: 4
title: "Centre distance and contact ratio"
description: "Calculate the standard centre distance and the transverse contact ratio, and see how a centre distance error changes the pressure angle and overlap."
draft: false
---

Two gears with the right module and tooth numbers still need to be held the right distance apart. The centre distance is a housing dimension, set by bores, bearings and shafts that may be machined by people who never see the gears. Getting it right, and knowing how forgiving the involute is when it is slightly wrong, is part of every gear design.

This chapter calculates the conveyor pair's centre distance and its contact ratio, the measure of how many teeth share the load.

## The standard centre distance

For a pair of standard gears without profile shift, the pitch circles touch, so the centre distance is the sum of the pitch radii:

**a = (d₁ + d₂) / 2 = m × (z₁ + z₂) / 2**

For the conveyor pair:

**a = (60 + 180) / 2 = 120 mm**

That number goes onto the housing drawing with a tolerance chosen with the backlash requirement in mind (Chapter 6).

## Contact ratio: how many teeth share the load

As the gears turn, each pair of teeth enters contact at one end of the line of action and leaves at the other. If a new pair always enters before the previous pair leaves, the load passes smoothly from tooth to tooth. The **transverse contact ratio** εα measures that overlap: the average number of tooth pairs in contact.

It is the length of the path of contact divided by the base pitch:

**εα = [√(r_a1² − r_b1²) + √(r_a2² − r_b2²) − a × sin α] / p_b**

where r_a is a tip radius, r_b a base radius and p_b the base pitch.

For the conveyor pair, with tip radii of 33 mm and 93 mm and base radii of about 28.191 mm and 84.572 mm:

- **√(33² − 28.191²) ≈ 17.154 mm**
- **√(93² − 84.572²) ≈ 38.685 mm**
- **a × sin α = 120 × 0.342020 ≈ 41.042 mm**

The path of contact is about 17.154 + 38.685 − 41.042 ≈ 14.80 mm. Dividing by the base pitch of 8.8564 mm:

**εα ≈ 14.80 / 8.8564 ≈ 1.671**

On average, about 1.67 pairs of teeth are in contact. For roughly two-thirds of each tooth's engagement, two pairs share the load; for the remaining third, a single pair carries it alone. Many designers aim for a contact ratio of at least about 1.2 for spur gears, so that tip edges and small errors do not interrupt the hand-over between teeth.

```figure
type: stats
title: Mesh geometry of the conveyor pair
caption: Module 3 mm, 20 and 60 teeth, 20° pressure angle, standard centre distance.
- 120 mm | Centre distance | (60 + 180) ÷ 2
- 14.80 mm | Path of contact | along the line of action
- 8.8564 mm | Base pitch | π × 3 × cos 20°
- *1.671 | Contact ratio | average pairs in contact
```

## What happens if the centre distance is wrong

Involute gears have a valuable property: if the centre distance is slightly larger than standard, the speed ratio stays exactly the same. The base circles do not change, and the line of action is still tangent to both. What changes is the working pressure angle, the backlash and the contact ratio.

The working pressure angle α′ at a centre distance a′ follows from:

**cos α′ = a × cos α / a′**

At a′ = 120.5 mm:

**cos α′ = 120 × 0.939693 / 120.5 ≈ 0.935794, so α′ ≈ 20.64°**

Recalculating the contact ratio with a′ and α′ gives about **1.508**. At 121 mm, the working pressure angle rises to about 21.26° and the contact ratio falls to about **1.350**. The teeth also gain clearance between their flanks, so backlash increases.

```figure
type: line
title: Contact ratio falls as the centres open
x: Centre distance (mm)
y: Contact ratio
ymin: 1
ymax: 1.8
caption: The speed ratio is unaffected; overlap and backlash change.
legend: Contact ratio
- 120 | 1.671
- 120.5 | 1.508
- 121 | 1.35
```

The opposite error, centres too close, is worse. The tips of one gear begin to bottom in the roots of the other, the teeth jam and the pair may fail quickly. That is why the housing tolerance and the tooth thickness tolerance are always considered together.

## What a contact ratio does not tell you

The contact ratio is a geometric average. It does not include deflection of the teeth under load, which slightly extends contact in practice, nor tip relief and profile modifications, which deliberately shorten it at the tips to reduce noise. Helical gears add a second, axial overlap that usually makes them smoother than spur gears of the same size (Chapter 7). Use εα as a design check and a comparison between options, not as a rating.

## Exercise: contact ratio with smaller teeth

The alternative pair from Chapter 3 has module 2.5 mm with 24 and 72 teeth, on the same 120 mm centre distance. Its tip radii are 32.5 mm and 92.5 mm. Calculate its contact ratio and compare it with the conveyor pair.

The base radii are **30 × cos 20° ≈ 28.191 mm** and **90 × cos 20° ≈ 84.572 mm**, the same as before because the pitch diameters are unchanged. The base pitch is **π × 2.5 × cos 20° ≈ 7.380 mm**. The path of contact works out to about 12.60 mm, giving **εα ≈ 1.707**. Smaller teeth, more of them, slightly higher overlap: usually quieter, but with less bending strength per tooth, a trade-off Chapter 8 makes explicit.
