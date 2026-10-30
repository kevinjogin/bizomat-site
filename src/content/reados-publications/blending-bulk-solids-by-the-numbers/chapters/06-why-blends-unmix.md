---
book: blending-bulk-solids-by-the-numbers
chapterSlug: why-blends-unmix
order: 6
title: "Why blends unmix: segregation mechanisms"
description: "Sifting, trajectory, air and vibration-driven segregation in blends, the balance between segregation drift and mixing that sets a concentration profile, and how to test and design against unmixing."
draft: false
---

A blend that leaves the blender perfectly random can arrive at the process badly segregated. Every time it is poured, conveyed, vibrated or discharged, its particles have another chance to sort themselves by size, density or shape, and free-flowing blends take every chance. Segregation is the other half of blending: mixing creates a random arrangement, and handling destroys it unless the blend or the handling is designed to prevent it.

This chapter sets out the main segregation mechanisms in blends, shows how a steady balance between a segregating drift and random mixing produces an exponential concentration profile, the same mathematics as the barometer formula for the atmosphere, and works through Plant C's trial of pre-blended micro-pellets, which segregated in the moulding machine's hopper.

## The mechanisms

Williams's review sorts segregation into a handful of mechanisms, and Jaeger, Nagel and Behringer's review of granular physics describes the less obvious ones that appear under vibration. For blends, five matter most.

```figure
type: compare
title: Segregation mechanisms in blends
rowhead: Mechanism
cols: What drives it | Where it happens | Blends most at risk
caption: General guidance. Most real segregation problems involve two or more mechanisms at once. A blend whose components are the same size, density and shape, or which is cohesive, resists all of them.
- Sifting or percolation | small particles fall through gaps between large ones in a moving bed | heap surfaces, hoppers, chutes, conveyors, vibrating equipment | * free-flowing blends with a size difference
- Trajectory | particles of different size or density fly different distances in a stream | discharge from belts, chutes and pneumatic lines | blends with large differences in size or density
- Air entrainment and fluidisation | fine light particles carried or lifted by air | pneumatic filling, free fall, aeration | blends with a fine, light component
- Vibration-driven convection | shaking lifts large particles to the top of a bed | vibrating hoppers, feeders, transport | blends with a few large particles among many small ones
- Angle-of-repose sorting | particles that roll further reach the toe of a heap | filling bins, stockpiles | blends with differences in shape or roughness
```

The vibration mechanism has a memorable name. Rosato and colleagues showed by simulation in 1987 that shaking a container of mixed-size particles brings the large ones to the top, which they called the Brazil-nut effect after the mixed nuts in a tin. Later experiments, reviewed by Jaeger and colleagues, showed that much of the effect comes from convection rolls set up by the shaking, which carry particles up the centre and down the walls, with large particles unable to follow the thin downward stream at the walls. A sifting mechanism works alongside it: small particles fill the gaps that open beneath larger ones each time the bed is shaken loose.

## The size difference that matters

Sifting needs particles that can move independently and a difference in size large enough for the small ones to find gaps. Free-flowing pellets meet the first condition easily. The second is met by smaller differences than most people expect: even a ratio of around one and a half in diameter can segregate noticeably in a free-flowing bed that is moved repeatedly. Cohesive fine powders resist sifting because their particles stick together and move in clumps.

That explains Plant C's experience with its three blends. The colour blend of 20 mg masterbatch pellets and 24 mg natural pellets differs in diameter by only a few per cent and hardly segregates. The premix powders differ in size by four times, but at 150 and 600 µm and with some cohesion they segregate only moderately in gentle handling. The micro-pellet trial below combined a large size difference with very free-flowing particles.

## Drift against mixing: an exponential profile

A useful way to think about segregation in a bed that is both shaken and mixed is as a contest between two effects. Segregation gives the minor component a steady drift velocity, v, say downwards for small particles sifting through large ones. Random particle motion gives it a diffusive spread, D, as in Chapter 4. Left long enough, the two reach a balance in which the downward drift flux equals the upward diffusive flux, and the concentration c varies with height z as

c(z) = c(0) × e^(−z ÷ ℓ),  with ℓ = D ÷ v

This is the same mathematics as the barometer formula, which Kadanoff's lectures derive for gas molecules in a gravitational field: there the drift is gravity's pull, the spread is thermal motion, and the density falls exponentially with height over a scale height of kT ÷ m g. For a segregating blend, ℓ plays the part of the scale height. A long ℓ, from strong mixing or weak drift, gives a nearly uniform bed; a short one gives a bed concentrated at the bottom.

```figure
type: formula
title: Steady profile from segregation drift and random mixing
formula: c(z) = c(0) × e^(−z ÷ ℓ)     ℓ = D ÷ v     ratio bottom ÷ top over height H = e^(H ÷ ℓ)
caption: Same form as the barometer formula for a gas. Valid for a bed shaken or stirred long enough to reach steady state; real beds approach it from their initial state over a time of order H² ÷ D.
- c(z) | concentration of the segregating component at height z
- v | segregation drift velocity, downwards for sifting fines
- D | effective dispersion coefficient from random particle motion
- ℓ | segregation length, the height over which c falls by a factor of e
step: Press 2 hopper: c = 3.4% at 0.05 m and 1.2% at 0.35 m; ℓ = 0.30 ÷ ln(3.4 ÷ 1.2) = 0.288 m
step: Middle at 0.20 m predicted: 3.4 × e^(−0.15 ÷ 0.288) = 2.02%, measured 2.0%
```

The model is a simplification, but it gives the right shape for many shaken beds and it says what changes the outcome: reduce the drift, by matching particle sizes or reducing vibration, or increase the mixing relative to it.

### How fast the profile forms

The steady profile is where a shaken bed ends up, not where it starts. A bed that begins uniform develops its profile over a time of order H² ÷ D, the time random motion takes to carry particles across the bed's height H, and the drift sets which way the profile leans. A bed that is shaken hard mixes and segregates faster; one that is barely disturbed hardly changes at all. That is why the same blend can travel safely in a stationary octabin and unmix in a hopper bolted to a running press: the press supplies the shaking, every few seconds, for as long as the material sits there.

The time scale also suggests where to intervene. A hopper that holds only a few minutes of material, refilled little and often, gives segregation less time to act than one that holds an hour. Press 2's vacuum loader refilled its hopper every 20 minutes, from about a quarter full to full, so material near the top of each load had sat through most of a cycle before it was used.

## Density, shape and charge

Size is the main driver of sifting, but not the only property that matters. In trajectory and fluidisation segregation, density and drag matter as much as size: a dense, compact particle flies further from a belt end or a conveying line outlet and sinks in an aerated bed, while a light, flat one is carried by the air. Carbon-black masterbatch pellets are denser than natural polypropylene, so in a pneumatically conveyed pre-blend they tend to collect where the stream lands and the natural pellets spread further. Shape matters on heap slopes, where round particles roll to the toe and flat or angular ones stop near the top. And electrostatic charge, built up by conveying plastics through pipes, can make fine particles stick to walls and to each other, holding back a fine component and releasing it later in a lump.

A blend that differs in several properties at once can segregate by different mechanisms in different parts of its route, sometimes in opposite directions. The only reliable way to know is to sample the blend where it is used, at the start, middle and end of each container it passes through.

## The error: pre-blending micro-pellets

This is an illustration. Chapter 2's micro-pellets of 5 mg had cut the random-mixture rejects on Plant C's first moulding machine, where a doser adds the masterbatch at the throat. The plant's second machine, press 2, has no doser. Its material is pre-blended in an octabin, a large cardboard bulk container, and drawn by a vacuum loader into a 50 L hopper on top of the press, which vibrates with every injection and clamp movement. The production planner, seeing the micro-pellets' success, had the next press 2 job pre-blended with micro-pellets in a tumble blender, reasoning that pellets are free-flowing and therefore easy to mix.

The lids from press 2 came out in bands: dark for several minutes after each refill of the hopper, then normal, then grey for the last few minutes before the next refill. The p-chart for press 2 signalled within a day, with 12 grey lids in a sample of 200.

The engineer stopped the press partway through a hopper load and took samples from three depths in the hopper with a sampling spear. The masterbatch fraction was **3.4%** near the bottom, **2.0%** in the middle and **1.2%** near the top, against the 2% blended. The profile fitted the exponential model with a segregation length of **0.288 m**: the hopper's 0.4 m of depth spanned a concentration ratio of e^(0.4 ÷ 0.288) = 4.0. At 1.2% masterbatch, the top layer carried 0.48% carbon black, below the 0.60% visibility limit, so every lid made from it was grey.

```figure
type: bars
title: Masterbatch fraction at three depths in press 2's hopper
unit: %
caption: This is an illustration. Samples taken by spear after about 20 minutes of moulding with pre-blended 5 mg micro-pellets. The blend entered at 2.0%. The 5 mg micro-pellets sifted down through the 24 mg natural pellets as the press vibrated.
- Near the bottom, 0.05 m | 3.4 | dark lids first
- Middle, 0.20 m | 2.0 | as blended
- * Near the top, 0.35 m | 1.2 | 0.48% carbon: grey lids
```

The diagnosis was clear. The micro-pellets, about 0.59 times the diameter of the natural pellets, sifted down through them as the hopper vibrated, and the hopper discharged bottom first. The blend had been random when it left the tumbler; press 2's hopper unmixed it. The octabin and the vacuum conveying probably contributed too.

The fix was to stop pre-blending micro-pellets for press 2 and fit it with a doser at the throat like press 1's, so that the masterbatch meets the natural pellets only a few centimetres above the screw. Until the doser arrived, press 2 returned to the standard 20 mg masterbatch, pre-blended, which differs from the natural pellets by too little to segregate measurably, and accepted the higher random-mixture reject rate of Chapter 2.

## Testing a blend's tendency to segregate

The plant now tests any new pre-blend before using it on press 2. ASTM D6940 describes a practice for measuring sifting segregation tendency, in which a blend is repeatedly poured into a small heap and the first and last material to leave the tester are compared. The plant uses a simpler in-house version that mimics its own handling: a sample of blend is shaken in a 300 mm tall transparent tube on a vibrating table for ten minutes, and the top and bottom 50 mm are analysed. A ratio of bottom to top concentration above 1.2 sends the blend back for reformulation or a change of handling.

```figure
type: checklist
title: Before pre-blending a free-flowing blend
caption: This is an illustration. The open item is the one press 2's micro-pellet trial skipped.
- x Particle sizes and densities of every component known | supplier data or a sieve test
- x Size ratio and density ratio checked | diameter ratio near 1 is safest
- ? Shaken-tube segregation test run | bottom ÷ top above 1.2 fails
- x Handling route reviewed | conveying, hoppers, vibration, drop heights
- x Option of dosing at the point of use considered | the most reliable way to avoid segregation
```

## Designing against segregation

The options fall into three groups, in order of reliability.

1. **Remove the difference.** Make the components similar in size, shape and density; pelletise or granulate a fine component so it matches the coarse one; use a masterbatch carrier pellet the same size as the natural pellets.
2. **Avoid handling the blend.** Blend at the point of use, by dosing each component into the process, as press 1 does. A blend that exists for a few seconds cannot segregate much.
3. **Handle the blend gently.** Minimise drop heights and vibration, use mass-flow hoppers that discharge a cross-section of the bed rather than the centre first, avoid pneumatic conveying for blends with a fine component, and keep hoppers small so that their contents are used before segregation develops.

Adding a little liquid or binder to make a blend slightly cohesive is also used, in fertiliser and feed blending for example, but it changes the blend's other properties and must be weighed against them.

## Segregation and the random limit together

Segregation and the random-mixture limit of Chapter 2 compound each other. A lid made from the top layer of press 2's hopper contained, on average, only 1.2% masterbatch, so about 144 micro-pellets instead of 240, and its random scatter was then around that lower mean. Segregation moves the mean of the portion a product unit receives; the random limit spreads the units around that mean. Calculating either alone underestimates the rejects when both are present, and the two must be measured separately, segregation by sampling at known positions and the random limit by calculation, to know which to fix.

## How this applies to a small Australian business

If a blended product varies in a pattern that repeats with each hopper, bin or bag, suspect segregation before suspecting the blender. Take samples at several depths or at the start, middle and end of each container's discharge. A smooth gradient points to sifting or vibration; a sharp change between loads points to the filling or discharge pattern. The most reliable fix is usually to blend later, closer to the point of use, rather than to blend better.

Keep a note of every component's particle size and density with the blend's recipe. When a supplier changes a grade, a pellet cutter or a carrier, a change of size that nobody thought to mention can turn a blend that never segregated into one that does, and the recipe sheet is where the comparison should start.

## Exercise: halving the vibration

Suppose isolating press 2's hopper from the machine's vibration halves the segregation drift velocity v while leaving the random mixing D unchanged. (a) What is the new segregation length? (b) What would the ratio of bottom to top concentration be over the 0.30 m between the bottom and top sampling points, compared with the 2.83 measured?

**Worked answer.** (a) ℓ = D ÷ v doubles, from 0.288 to **0.576 m**. (b) The ratio over 0.30 m becomes e^(0.30 ÷ 0.576) = e^0.521 = **1.68**, against e^(0.30 ÷ 0.288) = 2.83 before. With a 2.0% blend the top would still be noticeably lean, probably near 1.5%, so isolation alone would reduce but not remove the grey lids. Removing the size difference or dosing at the throat removes the drift altogether.
