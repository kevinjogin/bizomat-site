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

## Fitting gears to a fixed centre distance

Often the centre distance comes first: a housing already exists, or a replacement must fit a machine. With standard gears, the centre distance fixes the total number of teeth for each module:

**z₁ + z₂ = 2 × a / m**

For a = 120 mm, the possible totals are 120 teeth at module 2, 96 at module 2.5, 80 at module 3 and 60 at module 4. A 3:1 ratio then gives 30 : 90, 24 : 72, 20 : 60 and 15 : 45 respectively.

The hunting-tooth pair 20 : 61 from Chapter 1 has 81 teeth, which at module 3 would need a centre distance of 121.5 mm. On a fixed 120 mm housing, the designer has three choices: accept the 20 : 60 pair, find another combination with 80 teeth and an acceptable ratio, or use profile shift to fit 81 teeth onto the shorter centre distance, using the relationship between shift and centre distance that Chapter 5 explains. The arithmetic is quick, and it is worth doing before a gear is ordered for an existing housing.

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

## Where one tooth carries the load alone

A contact ratio of 1.671 means more than an average. It divides the path of contact into zones. At each end, for a length of (εα − 1) base pitches, two pairs of teeth are in contact. In the middle, for a length of (2 − εα) base pitches, one pair carries the whole load:

- **Double contact at the start:** 0.671 × 8.8564 ≈ 5.94 mm
- **Single contact in the middle:** 0.329 × 8.8564 ≈ 2.92 mm
- **Double contact at the end:** ≈ 5.94 mm

The three lengths add up to the 14.80 mm path of contact.

```figure
type: bars
title: Load-sharing zones along the conveyor pair's path of contact
unit: mm
max: 7
caption: Two pairs share the load at each end; one pair carries it alone through the middle 2.92 mm.
- Double contact, approach | 5.94
- *Single contact, around the pitch point | 2.92
- Double contact, recess | 5.94
```

The single-contact zone matters for strength. When one pair takes the full load at the outer end of that zone, the force acts higher up the tooth than it would at the pitch point, and the bending moment at the root is larger. Detailed rating methods find this **highest point of single tooth contact** and use it in the bending calculation. The simpler Lewis method of Chapter 8 applies the load at the tip, which is conservative for gears with a contact ratio above one. Either way, the zones show why a higher contact ratio helps: the single-contact zone shrinks as εα approaches two.

## Contact ratio rises with tooth numbers

For standard gears with the same 3:1 ratio, the contact ratio increases as the teeth become smaller relative to the gears. Working the same formula for module 3 pairs of different sizes:

- **17 : 51 teeth:** εα ≈ 1.636
- **20 : 60 teeth:** εα ≈ 1.671
- **25 : 75 teeth:** εα ≈ 1.714
- **30 : 90 teeth:** εα ≈ 1.747
- **40 : 120 teeth:** εα ≈ 1.792

The gain is steady but modest. Standard 20° spur gears rarely reach a contact ratio of two, so there is always some single-pair contact. Designs that need a contact ratio of two or more, for very quiet running, use special tooth proportions with longer addenda, or helical gears whose axial overlap adds to the total.

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

## The housing decides the real centre distance

The gear drawing states a centre distance, but the housing produces it. Several features contribute:

- **Bore positions.** If each bearing bore is located with a positional tolerance zone of diameter 0.04 mm, each bore centre may lie up to 0.02 mm from its true position, and the distance between two bores can vary by up to ±0.04 mm in the worst case.
- **Bearing clearance and fit.** Internal clearance in rolling bearings, and the fits of the bearings in their bores and on their shafts, let the shafts move a little under load.
- **Shaft deflection.** The separating force from Chapter 2 bends the shafts and pushes the gears apart, most at mid-span between bearings.
- **Temperature.** Steel gears in an aluminium housing see the centres open as the housing warms, because aluminium expands about twice as much as steel. Chapter 6 works an example.

Each of these changes the working centre distance and therefore the backlash and contact ratio. The housing tolerance should be chosen with them in mind, and the backlash specification in Chapter 6 must allow for the whole range, not just the nominal value.

## Keeping the axes parallel

Centre distance is measured between axes assumed to be parallel. If one shaft is tilted relative to the other, the teeth touch more heavily at one end of the face than the other. A tilt in the plane of the two axes changes the centre distance along the face; a tilt out of that plane, which skews the axes, is usually more harmful, because it moves the contact towards one end of every tooth.

This is an illustration. If one axis is out of parallel by 0.03 mm over a 100 mm bearing span, the mismatch across the conveyor pair's 30 mm face is 0.03 × 30 / 100 = 0.009 mm. That is small in absolute terms, but it is comparable to the deflection of the teeth under load, so the load can concentrate towards one end. Rating methods account for it with a face load factor. ISO technical reports give recommended limits for axis parallelism related to the gear accuracy grade, and the housing drawing should carry tolerances consistent with them.

## Measuring the centre distance of a housing

When a housing is made, or when an old one is being checked before new gears are fitted, the centre distance is measured rather than assumed. A coordinate measuring machine does this directly. In a workshop without one, the bores can be measured with a bore gauge and the distance across them with a micrometer, vernier or height gauge, then combined:

**a = L_outside − (D₁ + D₂) / 2**, measured across the far edges of both bores

**a = L_inside + (D₁ + D₂) / 2**, measured between the near edges

This is an illustration. A housing has bearing bores of 52.000 mm and 72.000 mm. The distance across their far edges, measured at the bore's mid-length, is 182.04 mm. Then:

**a = 182.04 − (52.000 + 72.000) / 2 = 182.04 − 62.00 = 120.04 mm**

That is 0.04 mm above the 120 mm nominal, inside the ±0.04 mm range of the example above but at its limit. Measuring at both ends of the bores also shows whether the axes are parallel: different values at the front and back faces mean one bore is tilted. Recording both figures before assembly saves a later argument about whether noise or wear came from the gears or from the housing they were put into.

## Checking the mesh with a contact pattern

The simplest check of centre distance and alignment in an assembled gearbox is the **contact pattern**. A thin layer of marking compound is brushed onto a few teeth of one gear, the pair is turned through mesh under light load, and the transferred marking on the mating teeth shows where they touched:

- **Even marking along the face, centred on the working depth:** alignment and centre distance are close to correct.
- **Marking heavy at one end of the face:** the axes are not parallel, or a shaft is deflecting.
- **Marking concentrated towards the tips:** the centres may be too far apart, or the profiles are in error.
- **Marking concentrated towards the roots:** the centres may be too close.

A light-load pattern does not show how the contact will move under full load as shafts and housings deflect, so critical drives are sometimes checked again under load. It remains one of the most useful and cheapest checks a fitter can make, and a photograph of the pattern is worth keeping with the assembly record.

## What a contact ratio does not tell you

The contact ratio is a geometric average. It does not include deflection of the teeth under load, which slightly extends contact in practice, nor tip relief and profile modifications, which deliberately shorten it at the tips to reduce noise. Helical gears add a second, axial overlap that usually makes them smoother than spur gears of the same size (Chapter 7). Use εα as a design check and a comparison between options, not as a rating.

## Exercise: contact ratio with smaller teeth

The alternative pair from Chapter 3 has module 2.5 mm with 24 and 72 teeth, on the same 120 mm centre distance. Its tip radii are 32.5 mm and 92.5 mm. Calculate its contact ratio and compare it with the conveyor pair.

The base radii are **30 × cos 20° ≈ 28.191 mm** and **90 × cos 20° ≈ 84.572 mm**, the same as before because the pitch diameters are unchanged. The base pitch is **π × 2.5 × cos 20° ≈ 7.380 mm**. The path of contact works out to about 12.60 mm, giving **εα ≈ 1.707**. Smaller teeth, more of them, slightly higher overlap: usually quieter, but with less bending strength per tooth, a trade-off Chapter 8 makes explicit.
