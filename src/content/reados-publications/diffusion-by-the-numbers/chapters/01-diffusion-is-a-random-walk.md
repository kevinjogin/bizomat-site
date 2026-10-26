---
book: diffusion-by-the-numbers
chapterSlug: diffusion-is-a-random-walk
order: 1
title: "Diffusion is a random walk of atoms"
description: "See carbon atoms in DS-40's steel as random walkers, use the square-root-of-time rule to estimate how far they reach, and apply Fick's first law to the flow of carbon into the shaft."
draft: false
---

Solid steel looks perfectly still, but at red heat its atoms are anything but. Carbon atoms, small enough to sit in the gaps between the iron atoms, hop from gap to gap hundreds of millions of times a second, each hop in a random direction. No single hop goes anywhere in particular, yet over hours the carbon spreads measurably into the steel. That spreading is **diffusion**, and it is the mechanism behind carburising, decarburisation, scaling and the escape of hydrogen.

This chapter treats diffusion as a random walk of atoms, derives the square-root-of-time rule that estimates how far diffusion reaches, introduces the diffusion coefficient and Fick's first law of diffusion, and applies them to the carbon flowing into DS-40's surface in the carburising furnace. The failure case is a carburising time scaled in proportion to depth instead of to depth squared.

## Atoms that hop

In the austenite that steel becomes above about 900 °C, iron atoms sit on a face-centred cubic lattice, and carbon atoms occupy the gaps, or **interstitial** sites, between them. A carbon atom vibrates in its site and, every so often, gathers enough thermal energy to squeeze past its neighbours into an adjacent empty site. Each hop is about a quarter of a nanometre long, and its direction is random.

How often does a carbon atom hop? For a random walk in three dimensions with jump length a and jump rate Γ, the diffusion coefficient is about **D = Γ a² ÷ 6**. With the diffusion coefficient of carbon in austenite at 925 °C, about **8.1 × 10⁻¹² m²/s** (Chapter 3 shows where that number comes from), and a jump length of about 0.25 nm, each carbon atom makes about **6 × 8.1 × 10⁻¹² ÷ (2.5 × 10⁻¹⁰)² ≈ 7.8 × 10⁸** jumps every second. Nearly a billion random steps a second, each a quarter of a nanometre, and yet, as the next section shows, the atom wanders only a fraction of a millimetre in an hour.

## The square-root-of-time rule

That apparent paradox is the defining property of a random walk. Steps in random directions mostly cancel. After N steps of length a, the typical distance travelled from the start is not N a but about **a √N**. Since N grows in proportion to time, the distance grows with the **square root of time**.

Einstein showed in 1905, in his analysis of Brownian motion, that the same holds for a particle jostled by molecules, and connected the spread to the diffusion coefficient. In one direction, the root-mean-square distance travelled after time t is **√(2Dt)**, and the characteristic **diffusion distance**, used throughout this book, is simply **√(Dt)**. *Fine Particles by the Numbers* applies the same idea to fume particles in air in [Brownian diffusion](/reados/publications/fine-particles-by-the-numbers/brownian-diffusion/), and *Random Error and Drift by the Numbers* to measurement errors in [Random walks](/reados/publications/random-error-and-drift-by-the-numbers/random-walks/).

```figure
type: compare
title: Diffusion distance √(Dt) for carbon in austenite at 925 °C
cols: Time at temperature | √(Dt) | What it means for DS-40
caption: This is an illustration with D ≈ 8.1 × 10⁻¹² m²/s. Four times as long reaches only twice as far: a day at 925 °C moves carbon a characteristic 0.84 mm, and a hundred hours only about 1.7 mm.
- 1 hour | about 0.17 mm | a thin case
- 6 hours | about 0.42 mm | about half of DS-40's case
- *24 hours | about 0.84 mm | a deep case, at great cost in furnace time
- 100 hours | about 1.71 mm | impractically long
```

The diffusion distance is a scale, not a sharp boundary. Carbon does not stop at √(Dt); its concentration falls away smoothly with depth, and the depth at which it reaches any particular value, such as the 0.40% that defines DS-40's effective case, is some multiple of √(Dt) that depends on the surface and core carbon. Chapter 2 calculates that multiple from Fick's second law. For quick estimates, √(Dt) is the right order of magnitude, and a case depth of about one to two diffusion distances is typical.

The rule cuts both ways. It makes thin layers fast and thick ones slow: the time to reach a depth grows with the **square of the depth**. Doubling a case depth needs four times the furnace time. And it makes diffusion negligible at room temperature even over a lifetime: carbon in ferrite at 20 °C has a diffusion coefficient of only about 6 × 10⁻²¹ m²/s, so over fifty years its diffusion distance is about **3 µm**. A carburised case, once made, stays put.

### A random walk on paper

The cancellation is easy to see with a coin. Start at zero; for each toss, step one unit right for heads and one unit left for tails. After 100 tosses, the walker is typically about 10 units from the start, not 100; after 10,000 tosses, about 100 units. Repeating the experiment many times, the spread of final positions follows a bell curve whose width grows as the square root of the number of steps.

```figure
type: steps
title: From one atomic hop to a carburised case
caption: This is an illustration of the scale change at 925 °C. A billion random hops a second become a slow, predictable spreading that a furnace cycle can be designed around.
- One hop | about 0.25 nm, in a random direction
- One second | about 7.8 × 10⁸ hops; typical spread about √(2D × 1 s) ≈ 4 µm
- One hour | typical spread √(Dt) ≈ 0.17 mm
- One working day in the furnace | √(Dt) ≈ 0.84 mm after 24 hours
- *A whole cycle, designed | a profile predicted by Fick's second law (Chapter 2)
```

The same mathematics appears wherever many small, independent random steps add up: pollen grains jostled by water molecules, errors accumulating in a running total, and carbon atoms hopping through austenite. The physics of the steps differs; the square-root law does not.

## The diffusion coefficient

The **diffusion coefficient**, D, in square metres per second, is the single number that describes how fast a given species diffuses in a given material at a given temperature. It depends on:

- **what is diffusing and where**: small interstitial atoms like carbon, nitrogen and hydrogen diffuse far faster than substitutional atoms like chromium or nickel, which must wait for a vacancy beside them;
- **the crystal structure**: carbon diffuses faster in the more open body-centred cubic ferrite than in face-centred cubic austenite at the same temperature, though austenite can hold far more of it;
- **temperature**, overwhelmingly, which Chapter 3 quantifies;
- **defects**: grain boundaries, dislocations and traps can speed or slow diffusion, which matters greatly for hydrogen in Chapter 7.

The interstitial–substitutional difference explains much of heat-treatment practice. Carbon and nitrogen move into steel quickly enough to build a case in hours. The alloying elements that make the steel hardenable, chromium, manganese, molybdenum and nickel, sit on iron's own lattice sites and diffuse so slowly at carburising temperatures that they barely move during a cycle; a part's alloy distribution is essentially fixed when it is made. That is why carburising changes a part's carbon content near the surface and nothing else, and why segregation of alloying elements inherited from the steelmaking survives every later heat treatment.

Units matter too. Older texts give diffusion coefficients in square centimetres per second; one square centimetre per second is **10⁻⁴ m²/s**, so a value of 8.1 × 10⁻⁸ cm²/s is the same 8.1 × 10⁻¹² m²/s used here. Mixing the two is a common way to be wrong by a factor of ten thousand in D, and of a hundred in depth.

Because so much depends on the material, published values of D for pure iron are a starting point; heat treaters use data and experience for the specific grades they process.

## Fick's first law

A random walk by itself carries atoms in every direction equally. A net flow arises only where there are more atoms on one side than the other, because more atoms then hop from the crowded side to the sparse side than back. In 1855, the physiologist Adolf Fick stated the resulting law: the **flux** J, the net amount crossing unit area per unit time, is proportional to the concentration gradient and flows down it: **J = −D dC/dx**.

```figure
type: formula
title: Carbon flowing into DS-40's surface in the first hour at 925 °C
formula: J = −D dC/dx        surface gradient for a fresh carburising surface = (C_s − C₀) ÷ √(π D t)
caption: This is an illustration. Concentrations are converted from mass per cent to kilograms per cubic metre with a steel density of 7,800 kg/m³: 0.80% is about 62.4 kg/m³ and 0.20% about 15.6 kg/m³. The flux falls with time as the case fills, in proportion to 1 ÷ √t.
- Surface and core carbon | 0.80% and 0.20%, a difference of about 46.8 kg/m³
- Surface gradient after 1 hour | 46.8 ÷ √(π × 8.1 × 10⁻¹² × 3,600) ≈ 1.5 × 10⁵ kg/m⁴
- Flux after 1 hour | about 1.25 × 10⁻⁶ kg/m²·s, about 4.5 g per square metre per hour
- Flux after 11.7 hours | about 1.3 g per square metre per hour
step: The carbon uptake slows as the case fills: fast at first, then ever more slowly
```

Integrating that flux over time gives the total carbon taken up, **2(C_s − C₀) √(Dt ÷ π)** per unit area. For the 11.7 hours Chapter 2 finds DS-40 needs, that is about **31 g of carbon per square metre** of surface. DS-40's carburised bearing and spline lengths total about 300 mm of its 40 mm diameter, about **0.038 m²**, so the shaft absorbs only about **1.2 g** of carbon in a day's furnace cycle. Tiny amounts of carbon, placed in the right layer, transform the surface. The furnace atmosphere supplies far more carbon than that; the limit is not supply but how fast diffusion can carry it inwards.

## Geometry: corners, edges and thin sections

The square-root rule describes diffusion into a flat surface. Real parts have corners, edges and thin sections, and diffusion responds to them. At an external corner, such as the edge of a spline tooth on DS-40, carbon enters from two faces at once, and the case there is deeper and richer in carbon than on either flat face. At the tip of a sharp edge it can become so rich that it forms brittle carbides or retains too much soft austenite after hardening. At an internal corner, such as the root of a spline, carbon from the two faces competes for the same small volume of steel near the surface, and the case is slightly shallower. In a thin section, such as a flange of 2 mm, a deep case from both sides can meet in the middle, leaving no tough core at all.

The practical consequences are familiar to heat treaters: chamfer sharp edges before carburising, expect the case to vary around a profile, and do not specify a case depth that is a large fraction of the thickness of a thin section. DS-40's drawing calls for chamfers on all spline ends and for the case depth to be measured on a plain diameter, where the flat-surface calculation applies.

## Why the furnace atmosphere matters

The flux formula assumes the surface is held at 0.80% carbon. In gas carburising, that surface carbon is set by the furnace atmosphere's **carbon potential**: a mixture of gases, controlled by the heat treater, that tends to bring the steel's surface to a chosen carbon content. If the carbon potential drops, the surface carbon drops, the gradient falls and carbon goes in more slowly; if it falls below the steel's own carbon, carbon comes out, which is decarburisation, Chapter 5's subject. The atmosphere sets the boundary condition; diffusion inside the steel does the rest.

## A failure case: depth scaled with time

This is an illustration. A heat treater had a well-proven cycle that gave a 0.4 mm case on a family of small pins. A new customer asked for a 0.8 mm case on a similar steel. The planner, reasoning that twice the depth needed twice the time, doubled the cycle.

The first batch was sectioned for its hardness traverse, as the procedure required, and the effective case was only about **0.57 mm**, well below the 0.7 mm minimum. The detection came from that first-article check. The arithmetic explained it: depth grows with the square root of time, so doubling the time increases the depth by only √2, from 0.4 to about 0.57 mm. Reaching 0.8 mm needed **four** times the original time, or a higher temperature, which Chapter 3 calculates.

The correction was a new cycle designed from the diffusion calculation and proved on test coupons before production. The undersized batch could not simply be returned to the furnace for "a bit more", because a second cycle starts from the existing profile rather than from a fresh surface; it needed its own calculation, which Chapter 2's methods provide, and its own coupon to confirm the result before the parts were released. The planner's sheet now converts every case-depth request into time with the square law, and flags any request that scales time linearly.

## How this applies to a small Australian business

Think of diffusion as a random walk: fast at the atomic scale, slow at the scale of parts. Use √(Dt) to estimate how far diffusion reaches in a given time, and remember that the time to reach a depth grows with the square of the depth. Use Fick's first law to see why uptake is fast at first and slows as a layer fills. Treat published diffusion coefficients for pure iron as starting points, and rely on the heat treater's data and test coupons for real grades.

## Exercise: a thinner case

A different shaft needs an effective case of only 0.4 mm, half of DS-40's 0.8 mm, carburised in the same way at the same temperature. If DS-40's cycle reaches 0.8 mm in 11.7 hours, how long is needed for 0.4 mm? How much carbon per square metre does the shorter cycle put in, compared with DS-40's 31 g?

**Worked answer.** Time grows with the square of depth, so half the depth needs a quarter of the time: **11.7 ÷ 4 ≈ 2.9 hours**. The carbon taken up grows with √t, so a quarter of the time gives half the carbon: about **31 ÷ 2 ≈ 15.5 g per square metre**. A thin case is quick and uses little carbon; doubling it is four times as slow.
