---
book: infrared-temperature-measurement-by-the-numbers
chapterSlug: spot-size-distance-and-alignment
order: 6
title: "Spot size, distance and alignment"
description: "Distance-to-spot ratio, filling the spot, the error from a part-filled spot at 1 µm and 10 µm, round targets, moving parts and response time, and smaller billets that wandered out of the spot."
draft: false
---

A pyrometer does not measure a point. It measures the average radiance over a patch of the target, the **spot**, whose size grows with distance. Chapter 1 showed that, as long as the target fills the spot, distance does not change the reading. This chapter is about what happens when it does not: when the target is too small, too far away, wandering on its conveyor, or curved away from the instrument at the edges.

It sets out the distance-to-spot ratio and how to read it, calculates the error from a part-filled spot for IH-40's single-wavelength pyrometer and for a long-wave instrument, deals with round targets, moving parts and response time, and ends with a change to smaller billets that let them wander partly out of the spot and filled the cold-reject bin.

## The distance-to-spot ratio

An instrument's optics collect radiation from a cone that starts at the lens and widens with distance. The **distance-to-spot ratio**, written D:S, gives the spot's diameter at a given distance: an instrument with D:S of 100:1 sees a spot 1 mm across for every 100 mm of distance. Some instruments focus at a particular distance, where the spot is smallest, and the spot grows on either side of focus; the data sheet then gives the spot at the focus distance and a diagram for other distances.

The spot does not have a sharp edge. Makers define its diameter as the circle containing a stated share of the energy the instrument collects, commonly 90% or 95%, and the rest comes from outside it. The data sheet states which. A target that exactly fills the stated spot therefore still loses a few per cent of the signal to whatever surrounds it, which is why a margin is needed.

This is an illustration. IH-40's pyrometer has D:S of 100:1 and sits 0.6 m from the billets' path, so its spot is **6 mm** across, on a billet 40 mm in diameter. A common rule of thumb is that the target should be at least twice the spot's diameter, and IH-40's billet is more than six times it.

```figure
type: formula
title: Spot diameter from the distance-to-spot ratio
formula: spot diameter = distance ÷ (D:S)
caption: This is an illustration for IH-40's pyrometer. Check whether the maker's spot contains 90% or 95% of the energy, and allow a margin.
- Distance | 600 mm from lens to billet path
- D:S | 100:1
step: Spot = 600 ÷ 100 = 6 mm, on a 40 mm billet
step: Same instrument at 1.5 m: 15 mm
```

Focus deserves a word of its own. A close-focus instrument, chosen to give a very small spot at a short distance, gives a much larger spot than its ratio suggests if it is mounted further away, because beyond its focus the cone widens faster. An instrument moved during maintenance from 0.6 m to 1.2 m does not simply double its spot if 0.6 m was its focus; it may more than double it. The data sheet's spot diagram, not the D:S figure alone, gives the spot at the actual mounting distance, and checking it is part of any move.

## The part-filled spot

When the target fills only part of the spot, the instrument receives the target's radiance over that part and the background's over the rest. Against a cold background at 1 µm, the background contributes almost nothing, and the signal is simply the filled fraction f times the full signal. To a single-wavelength instrument this is indistinguishable from an emissivity f times too low, and Chapter 2's formula gives the error:

1 ÷ T_indicated = 1 ÷ T − (λ ÷ c₂) × ln f

For IH-40's billet at 1,200 °C, with the full Planck law:

- spot **99%** filled: **1.5 K** low at 1.0 µm; 9.4 K low at 10 µm;
- **95%** filled: 7.7 K low at 1.0 µm; 47.1 K at 10 µm;
- **90%** filled: **15.7 K** low; 94.5 K at 10 µm;
- **75%** filled: 42.1 K low; 239 K at 10 µm;
- **50%** filled: 97.6 K low; 489 K at 10 µm.

Two lessons follow. The error is always low, because the empty part of the spot looks cold. And a part-filled spot hurts a long-wave instrument about six times as much as a short-wave one, for the same reason as emissivity: at long wavelengths the signal changes little with temperature, so a lost share of signal is a large lost share of temperature. A ratio pyrometer, against a cold background, does not suffer from it at all (Chapter 4), which is one of its strongest advantages on small or moving targets.

```figure
type: compare
title: Reading error on a 1,200 °C billet from a part-filled spot, cold background
rowhead: Share of spot filled
cols: Single-wavelength 1.0 µm | Single-wavelength 10 µm | Ratio, 0.90 and 1.05 µm
caption: Calculated from Planck's law. The empty part of the spot looks cold, so single-wavelength readings are always low.
- 99% | −1.5 K | −9.4 K | 0
- 95% | −7.7 K | −47.1 K | 0
- * 90% | −15.7 K | −94.5 K | 0
- 75% | −42.1 K | −238.7 K | 0
- 50% | −97.6 K | −488.5 K | 0
```

## A hot background changes the answer

The figures above assume a cold background, which at 1 µm contributes nothing. A hot background does contribute, and it pushes a single-wavelength reading back up, sometimes past the truth. This is an illustration from Chapter 4's coil-exit case: IH-40's billet filling half the spot, with the coil's liner at about 900 °C filling the rest. The single-wavelength pyrometer reads **1,113.5 °C** instead of the 1,102.4 °C it would read against a cold background, because the liner adds some signal. Behind a small target, a background hotter than the target would make the reading high.

The safest background is a cold, dull one: a guard plate, a conveyor frame or open space well away from hot plant. When choosing the aiming point, look at what is behind the target as carefully as at the target itself.

## A spot that sees more than one temperature

Even a fully filled spot can see more than one temperature, because a real target is not uniform. A billet's ends cool faster than its middle, its surface is cooler than its core after it leaves the coil, and its scale can be patchy. The instrument averages the radiance over its spot, not the temperature, and at short wavelengths radiance rises so steeply with temperature that the hotter parts dominate.

This is an illustration. A spot that sees half its area at 1,180 °C and half at 1,220 °C reads **1,201.1 °C** at 1.0 µm, slightly above the arithmetic mean of 1,200 °C. With halves at 1,150 and 1,250 °C, it reads 1,206.5 °C; with halves at 1,100 and 1,300 °C, **1,224.8 °C**. A long-wave instrument, whose signal is nearly proportional to temperature over a narrow range, reads very close to the mean in every case.

For IH-40, where the spot sees a small patch in the middle of the billet's side, the variation within the spot is a few kelvin and the bias is negligible. It matters for larger spots on uneven targets, such as a thermal camera's single pixel on a busbar joint (Chapter 7) or a pyrometer looking at a whole furnace load: the reading leans towards the hottest part the spot can see, which is often what a maintenance survey wants and seldom what a process control wants.

## Round targets

A billet is a cylinder, and a pyrometer aimed at its side sees a curved surface. At the centre line, the view is square-on. Away from it, the surface turns away: at a point 10 mm off the centre line of IH-40's 40 mm billet, the surface is inclined at 30° to the line of sight. Chapter 2 noted that emissivity changes at steep angles, so the edges of a round target are a poorer place to measure than the middle, even before the spot starts to spill off the side.

The practical rule is to aim at the centre line of a round target, keep the spot well inside the middle third of its diameter, and arrange the conveyor or guides so that the target's position across the line of sight varies as little as possible.

## Moving parts and response time

IH-40's billets pass the pyrometer at 0.5 m/s. A 100 mm billet with a 6 mm spot fills the spot completely for (100 − 6) ÷ 500 = **0.19 seconds**. The instrument must settle to its reading well within that time, and its output must be captured while the spot is full. An instrument's **response time**, usually stated as the time to reach 95% of a step change, must be a small fraction of the time in view. Silicon-detector pyrometers are fast enough for this; slower instruments, or a reading averaged over too long a window, would blend the billet with the gaps between billets.

The usual way to read discrete parts is a **peak hold** over the time the part is in view, reset between parts, as Chapter 4 described. The peak comes from the moment the spot is fully filled, which is the reading wanted. For targets that might include brief hot spots, such as a flash of scale, a valley hold or an average over a gate may be better; the choice depends on what the reading is used for.

## The error: smaller billets that wandered out of the spot

This is an illustration. The forge took on a new product forged from **25 mm** billets. To make room for a new loading chute, the pyrometer was moved back to **1.5 m** from the conveyor, where its 100:1 optics gave a **15 mm** spot. On the 40 mm billets this would have been fine. On 25 mm billets, it left only 5 mm of margin on each side.

The new billets were lighter and rolled about on the conveyor, wandering up to about **8 mm** either side of the centre line. Within an hour, the cold-reject rate was over 10%, and the rejected billets checked hot with the portable instrument.

The engineer worked out the geometry. With the spot's centre 8 mm off the billet's centre line, the 15 mm spot reaches 15.5 mm from the centre line, past the 12.5 mm radius; about **14%** of the spot falls off the billet, so the spot is 86% filled. At 1.0 µm, that reads about **22.8 K** low, enough to push billets near 1,190 °C below the 1,170 °C limit. At 6 mm off, the spill is about 3% and the error 4.4 K; centred, none. The rejects were the billets that had rolled furthest. The part of the spot still on the billet was also looking at the surface at nearly 40° from square-on, where the emissivity was not what the setting assumed.

The forge moved the pyrometer back to 0.6 m, where the spot is 6 mm, and fitted a V-guide to centre the billets as they passed. With 6 mm of spot on a 25 mm billet centred within ±2 mm, the spot stays well inside the middle third, and the cold-reject rate returned to its usual level.

```figure
type: bars
title: Reading error on a 25 mm billet with a 15 mm spot, by how far the billet sits off centre
unit: K low
max: 25
caption: This is an illustration at 1.0 µm, 1,200 °C, cold background. The error appears only once the spot spills past the billet's edge.
- Centred | 0
- 4 mm off | 0
- 6 mm off, 3% spilled | 4.4
- * 8 mm off, 14% spilled | 22.8
```

## Alignment in practice

A pyrometer is aimed once and then knocked, heated, vibrated and cleaned for years. A few habits keep its aim true.

- Use the instrument's sighting aid, whether a laser pointer, a through-the-lens sight or a video image, to aim it at the target's centre, and check the aim with a target in place, not on an empty conveyor.
- Mount it on a bracket stiff enough not to move when someone leans on it or when the press thumps, and mark its position so that a knock can be seen.
- After any work near it, recheck the aim before production restarts.
- Keep a record of the distance and the spot size it gives, so that anyone moving the instrument knows what they are changing.

## Exercise: choosing the optics

For the 25 mm billets, the forge would prefer the pyrometer at 1.5 m, out of the way of the chute, and can hold the billets within ±4 mm of the centre line with a guide. Taking the rule that the spot must stay within the middle 60% of the billet's diameter, what is the largest spot it can use, and what distance-to-spot ratio does that need at 1.5 m?

**Worked answer.**

- The middle 60% of a 25 mm billet is a band 15 mm wide, 7.5 mm either side of the centre line.
- With the billet up to 4 mm off centre, the spot's edge must stay within 7.5 − 4 = 3.5 mm of the spot's centre, so the spot can be at most **7 mm** across.
- At 1.5 m, that needs D:S of at least 1,500 ÷ 7 ≈ **214:1**.

An instrument with D:S of 100:1 would need to be within 0.7 m. A longer-focus optic with D:S of 250:1 or more at 1.5 m would do, and the data sheet must show that the 90% or 95% energy spot at that distance is no larger than 7 mm. Alternatively, a ratio pyrometer at 1.5 m would tolerate the part-filled spot against the cold conveyor, though not the steep viewing angle at the billet's edge.
