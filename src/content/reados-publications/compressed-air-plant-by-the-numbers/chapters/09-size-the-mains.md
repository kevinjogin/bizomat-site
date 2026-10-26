---
book: compressed-air-plant-by-the-numbers
chapterSlug: size-the-mains
order: 9
title: "Size the mains and lay them out"
description: "Size CA-1's main and branches from actual volume and a pressure budget, compare dead-end and ring layouts, choose suitable pipe materials and avoid a branch too small for the line it feeds."
draft: false
---

The main is where the compressor room's careful work can be undone. A compressor set to the lowest workable pressure, with clean filters and a well-sized receiver, can still deliver air too weak to run a machine if the pipe between them is too small or too long. Every kilopascal lost in the main has to be generated in the compressor room, every hour the plant runs.

This chapter sizes CA-1's 120 m main and a branch from the actual volume of air they carry, sets a pressure budget, compares a dead-end main with a ring, covers materials and layout, and closes with a branch that was too small for the line it was extended to feed.

## Pipes carry actual volume

Chapter 1 showed that CA-1's 6.0 m³/min of free air occupies only about 0.74 m³/min at 851.3 kPa absolute and 35 °C. In the main, slightly cooler at about 30 °C after the dryer has rewarmed it, the actual flow is about 0.0121 m³/s. That actual volume, not the free air figure, sets the velocity and pressure drop in the pipe.

The pressure drop in a straight pipe follows the Darcy equation used for steam and water:

**Δp = f × (L ÷ D) × ρ V² ÷ 2**

where f is the friction factor, L the length including an allowance for fittings, D the bore, ρ the air's density at line pressure, about 9.78 kg/m³ for CA-1's main, and V the velocity. The equation assumes the density changes little along the pipe, which holds when the pressure drop is a small fraction of the line pressure.

## CA-1's main

This is an illustration. CA-1's main runs 120 m of equivalent length, pipe plus fittings, from the compressor room to the far end of the plant. Carrying the compressor's full 6.0 m³/min, with a teaching friction factor of 0.02:

```figure
type: compare
title: CA-1's main at full output, by pipe size
rowhead: Pipe
cols: Bore | Velocity | Pressure drop over 120 m
caption: This is an illustration: 6.0 m³/min of free air at 750 kPa gauge and about 30 °C, density about 9.78 kg/m³, friction factor 0.02. The DN25 figure is only indicative, because a drop that large breaks the constant-density assumption.
- DN25 | 26.6 mm | about 21.8 m/s | about 210 kPa
- DN40 | 40.9 mm | about 9.2 m/s | about 24 kPa
- * DN50 | 52.5 mm | about 5.6 m/s | about 7 kPa
```

Pressure drop rises roughly with the fifth power of the bore's inverse for a given flow: halving the bore raises velocity four times and the drop about thirty times. Between DN40 and DN50 the drop falls from about 24 to about 7 kPa, and from Chapter 7's slope of about 0.8 per cent of compression power per 10 kPa, the 17 kPa difference is worth about A$620 a year at CA-1's electricity cost. Over a main's life of decades, and with future growth in mind, the larger pipe is usually the better buy. The [compressed-air pipe pressure drop tool](/tools/air-pipe-drop/) and the [compressed-air main sizing tool](/tools/air-main-sizing/) repeat the calculation for other sizes and flows.

## Why the fifth power matters

The steep dependence of pressure drop on bore is worth pausing on. For a fixed flow, velocity rises with the inverse square of the bore, and pressure drop rises with velocity squared and with the inverse of the bore again, so the drop varies roughly with the inverse fifth power of the bore. Going one pipe size smaller, from DN50 to DN40, cuts the bore by about a fifth and more than triples the drop. Going one size larger, from DN50 to DN65, cuts it by more than half.

That is why undersizing is the commonest and most expensive mistake in compressed air distribution, and why the extra cost of one size up at installation is usually repaid quickly. It is also why the last few metres of small hose and fittings at a machine, with bores a fraction of the main's, can dominate the whole system's pressure loss. The same rule appears in steam mains and water pipes; it is a property of turbulent flow in pipes, not of air.

## A pressure budget

A useful way to size a whole distribution system is to set a pressure budget from the compressor to the furthest user and divide it between the parts. This is an illustration for CA-1:

```figure
type: stack
title: CA-1's pressure budget from compressor to the far user
unit: kPa
caption: This is an illustration. The total of 75 kPa is the most the system may lose between the compressor's lower limit and the far user's inlet at full flow; each part is designed to stay within its share.
- Compressor room: separator, dryer and filters | 35
- * Main, 120 m | 10
- Branch to the line | 10
- Drop, regulator, hose and couplings at the user | 20
```

The budget makes trade-offs visible. If the compressor room's share can be reduced by clean filters, as Chapter 7 found, the set point can fall. If a branch is extended, its share must still be met. If a user's hose and couplings take 100 kPa instead of 20, no amount of main sizing will help it.

## Dead-end and ring mains

A **dead-end** main runs from the compressor room to the far end of the plant, with branches along it. The air for the far end travels the whole length, and the pressure there depends on every user upstream.

A **ring** main loops around the plant and back to its start, so each user is fed from two directions. For a load spread around the ring, each path carries roughly half the flow over roughly half the length, and the pressure drop to the furthest point falls to a fraction of the dead-end figure, on the order of a quarter for a simple even layout. A ring also lets sections be isolated for maintenance while the rest stays live. For a plant with users spread around its floor, a ring is often worth its extra pipe.

## Branches and drops

Branches are sized the same way, for their own peak flow and length. They are taken from the top of the main, so that any water in the main runs past rather than into them, and they drop down to the user with a drain leg at the bottom, as Chapter 5 described. Each user should have an isolating valve, so it can be worked on without shutting down the branch, and a regulator where it needs less than line pressure, as Chapter 7 recommended.

The last few metres matter most. Flexible hoses, quick-release couplings and push-in fittings at the user typically have much smaller bores than the pipe feeding them and can drop more pressure than the whole main. A machine's supply should be sized for its peak flow all the way to its inlet, with couplings chosen from their makers' flow data rather than their thread size.

## Velocity matters beyond pressure drop

Pressure drop is the main reason to keep velocity low in a main, but not the only one. At high velocity, any liquid water that gets past a failed drain or dryer is carried along as droplets and slugs instead of running along the bottom of the pipe to a drain leg. Particles and scale are swept into valves and instruments. Noise rises, especially at fittings and valves. A main sized for low velocity is more forgiving of upsets as well as cheaper to run, which is one more reason the larger pipe in the comparison above is the better long-term choice.

```figure
type: checklist
title: Laying out CA-1's main and branches
caption: Common good practice. The details for a real system come from its designer and the pipe system maker's instructions.
- Size every section for its peak flow and length | against its share of the pressure budget
- Fall the main gently in the direction of flow | with drain legs at low points and the ends
- Take branches from the top of the main | and drop to the user with a drain leg below the take-off
- Fit isolating valves at each branch and each user | so sections can be worked on without a plant shutdown
- x Do not use plastic pipe made for water | only systems rated for compressed air at the system's pressure and temperature
- Label the main with its contents and flow direction | and record its route on a drawing
- ? Is a ring better for this layout | when users are spread around the floor, usually yes
```

## Isolation and sections

A plant that can isolate one part of its main without shutting down the rest can repair leaks, add branches and service equipment during production. Isolating valves at each branch, and at intervals around a ring, cost little at installation and a great deal to add later. They also allow a simple leak test: isolate a section during a quiet period, watch its pressure fall from a gauge, and the rate of fall gives that section's leakage, the same principle as the load-time method for the whole plant.

## Old mains

A main's resistance grows with age. Corrosion roughens the inside of galvanised steel, scale builds up at fittings, and the friction factor rises, sometimes enough to double the pressure drop of the original design. A main that once worked comfortably can become the bottleneck after twenty years without any change in the plant. The pressure survey described below detects it, and the cure is sometimes a new section of main rather than a new compressor.

## Materials and safety

Compressed air mains are built in several materials. Galvanised steel is robust but corrodes inside where any water reaches it, shedding rust and scale into the air. Purpose-made aluminium systems with push-fit or clamp joints are light, smooth inside and easy to modify. Copper and stainless steel suit clean-air applications. Some plastic systems are designed and rated for compressed air.

Plastic pipe made for water, such as ordinary PVC, must not be used for compressed air. Stored energy in compressed air is far greater than in water at the same pressure, and a brittle plastic pipe that fails can shatter and throw sharp fragments. Only pipe systems rated by their makers for compressed air, at the system's pressure and temperature, should be used, and the rating should be recorded.

Mains are supported to carry their weight and the forces at bends and ends, protected from impact where they cross traffic routes, and labelled with their contents and flow direction. Like the receiver, the main stores energy, and work on it starts with isolation and venting.

## A failure case: a branch extended too far

This is an illustration. A new packaging line was placed at the end of an existing DN20 branch, extending it to about 60 m of equivalent length. The branch had served a few hand tools for years. The new line drew a peak of about 2.0 m³/min.

At that flow, the DN20 branch, 20.9 mm bore, runs at about 12.6 m/s and loses about 42 kPa over 60 m: more than four times its 10 kPa share of the budget. Added to the line's own hoses and couplings, the line's inlet fell below its minimum at peak, and the line faulted on low pressure during each batch start.

The calculation, done after the faults began, showed the cause. A DN25 branch would have lost about 12.5 kPa over the same route, and connecting the line to the main at its nearest point, through a short DN25 or DN32 branch, would have cut the loss further. The correction was a new DN32 branch from the main and a small local receiver for the batch start, as Chapter 8 calculated. The engineering office's rule is now that any new user's peak flow is checked against its branch's size and length before it is connected, using the same budget as the main. The check takes ten minutes with the formula in this chapter, against the weeks of lost production the undersized branch caused.


## Point-of-use storage and the main

Chapter 8 showed that a small receiver near a user with a heavy, short demand can cover its peak. That has a direct effect on the main: a main that only has to carry the average flow to that user, rather than its peak, can be smaller, or an existing main can serve a larger plant. Where a few users have high peaks and long runs from the compressor room, local storage is often a cheaper answer than a larger main, and it improves the pressure stability for every other user on the same branch.

## Mains change over time

A main designed carefully for one plant becomes a different main as the plant changes. Lines are added at the far end, branches extended, temporary hoses made permanent. A periodic pressure survey, with readings at the compressor, after the treatment equipment, at the end of the main and at several users during a peak, shows where the budget is being exceeded. It is one of the cheapest checks in compressed air work, and it often finds that a pressure problem blamed on the compressor is in the last ten metres to the machine. Repeating the survey each year, at the same points and a similar production level, turns it into a trend that shows a main ageing or a plant outgrowing it.


## Exercise: a ring for CA-1

If CA-1's main were converted to a ring with the load spread evenly around it, and its pressure drop to the furthest point fell to about a quarter of the dead-end figure, what would the DN40 and DN50 drops become? Would DN40 then meet the 10 kPa main budget?

**Answer.** A quarter of about 24 kPa is about **6 kPa** for DN40, and a quarter of about 7 kPa is about **1.7 kPa** for DN50. As a ring, DN40 would meet the 10 kPa budget at today's flow. Whether a DN40 ring or a DN50 dead-end main is better depends on the plant's layout, its expected growth and the cost of each route; the calculation shows both are workable, which a dead-end DN40 main is not. A ring also has a resilience benefit the calculation does not show: a leak repair or a new branch on one side can be isolated while the other side keeps the whole plant supplied. For a plant that cannot easily stop its air, that alone can decide the layout.

