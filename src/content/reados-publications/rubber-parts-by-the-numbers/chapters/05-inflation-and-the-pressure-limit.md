---
book: rubber-parts-by-the-numbers
chapterSlug: inflation-and-the-pressure-limit
order: 5
title: "Inflation and the pressure that stops rising"
description: "Find the pressure beyond which an inflated rubber sleeve or balloon cannot resist, see why a fixed charge of air is safer than a regulated supply, and catch a plug inflated half out of its pipe."
draft: false
---

Blow up a party balloon and the first few breaths are the hardest. Then, quite suddenly, the balloon gets easier to inflate, and it grows quickly for little extra effort, until it either stops or bursts. That everyday experience is one of the most important facts in rubber engineering. An inflated rubber part has a pressure it can resist, and beyond some stretch that pressure stops rising or even falls. If the supply keeps pushing, the part has no equilibrium short of a very large size, and in practice it bursts.

This chapter calculates that limit for TP-100's sleeve and for a spherical bladder, shows how real rubber's strain stiffening changes the picture, and explains why the way a part is inflated, from a regulated supply or from a fixed charge of air, decides whether it is safe in free air. It ends with a plug that was inflated while partly out of its pipe.

## Why the pressure stops rising

An inflated membrane balances pressure with wall tension, as Chapter 4 set out: for a cylinder, p = σ t / r. As the cylinder grows, three things happen at once. Its radius r increases, which reduces the pressure a given tension can hold. Its wall thins, because rubber keeps its volume, which reduces the tension for a given stress. And its stress rises, because the rubber is stretched further. For a steel vessel, the stress rises fast enough to win easily. For rubber at moderate stretch, it does not: the stress rises roughly with λ², while radius and thinning together cost a factor of λ², and the pressure levels off.

For TP-100's sleeve with its ends held, in plane strain, the neo-Hookean model gives a simple result:

```figure
type: formula
title: Pressure in a neo-Hookean sleeve with its ends held
formula: p = G (T / R) (1 − 1 / λ⁴)     limit p∞ = G T / R
caption: This is an illustration for TP-100. T and R are the sleeve's original wall thickness and mean radius; λ is the hoop stretch. The pressure rises steeply at first and then approaches, but never exceeds, G T / R.
- G | Shear modulus, 0.82 MPa
- T | Original wall, 4 mm
- R | Original mean radius, 42 mm
step: At λ = 1.149, in the pipe: p = 0.0780 × (1 − 0.574) = 0.0332 MPa, or 33 kPa
step: Limit: p∞ = 0.82 × 4 / 42 = 0.0780 MPa, or 78 kPa
```

Up to a stretch of about 2, the pressure rises to within 6% of its limit; beyond that it barely changes. A neo-Hookean sleeve inflated from a supply above 78 kPa has no stretch at which it can balance the pressure. It keeps growing.

### A spherical bladder

A sphere behaves worse. Stretched equally in both directions, it thins with λ², and the neo-Hookean model gives p = 2G (T / R)(1 / λ − 1 / λ⁷). That pressure rises to a maximum at λ = 7^(1/6) = **1.383** and then falls. For a sphere with TP-100's wall and radius, the maximum is **96.6 kPa**. Inflated past a stretch of 1.38, a spherical bladder needs less pressure to keep growing than it did to get there, which is the sudden easing every balloon blower feels.

The thermodynamics text listed in the references treats this balloon problem in detail, as an example of a system with more than one possible equilibrium at the same pressure and of how stability depends on what is held fixed. The practical message is simpler: **an inflated rubber part has a limit pressure, and above it the part is held only by whatever restrains it**.

## What real rubber adds

The neo-Hookean model ignores the strain stiffening of real rubber at large stretch. The Gent model of Chapter 3 includes it, and with it the sleeve's pressure, after levelling off, eventually rises again as the chains approach full extension.

```figure
type: compare
title: Pressure to hold TP-100's sleeve at a given hoop stretch, free of the pipe
cols: Neo-Hookean | Gent, Jm = 97 | Sleeve mean diameter | Wall thickness
caption: This is an illustration with G = 0.82 MPa, a 4 mm wall at 42 mm mean radius and ends held. The Gent model's late stiffening is what would finally stop free inflation at 150 kPa, at a stretch near 7, close to the compound's breaking stretch.
- λ = 1.149, in the pipe | 33.2 kPa | 33.3 kPa | 97 mm | 3.48 mm
- λ = 1.5 | 62.6 kPa | 63.0 kPa | 126 mm | 2.67 mm
- λ = 2 | 73.1 kPa | 74.8 kPa | 168 mm | 2.00 mm
- λ = 4 | 77.7 kPa | 90.8 kPa | 336 mm | 1.00 mm
- *λ = 6 | 77.9 kPa | 120.0 kPa | 504 mm | 0.67 mm
```

With the Gent model, a uniformly inflated sleeve at 150 kPa would balance only at a stretch of about **7**, a mean diameter of nearly 590 mm and a wall of 0.57 mm. The compound's breaking stretch, from Chapter 3, is about 7.2, and that is for an undamaged dumbbell. In practice the sleeve would not inflate uniformly to that size; it would form a local bulge, which thins fastest, and burst from there. Either way, free inflation at working pressure ends with a burst.

### Bulges and how they travel

A sleeve inflated beyond its limit does not grow evenly along its length. Any small variation, a slightly thinner patch of wall or a slightly softer region, lets one part stretch a little further than its neighbours, and because that part now needs less pressure to keep growing, it runs ahead. The result is a local bulge with almost unstretched sleeve on either side. In a long tube, the bulge can then travel: once formed, it lengthens along the tube at a lower pressure than was needed to start it, as the wall at its edges passes from the lightly stretched state to the heavily stretched one. The thermodynamics text listed in the references explains this choice between two stretches at the same pressure with an equal-area construction like the one used for phase changes.

For a short sleeve like TP-100's, there is no room for a bulge to travel; it forms where it starts, thins fastest there, and bursts. That is why the field failure described below split along a short length rather than ballooning the whole sleeve evenly.

### Why a burst is violent

The energy released when an inflated part bursts is mostly in the gas, not the rubber. This is an illustration. TP-100 in its pipe holds about 0.82 L of air at 251.3 kPa absolute. The work that air could do expanding to atmospheric pressure at constant temperature is p V ln(p / p₀) = 251,300 × 0.000816 × ln(251.3 / 101.3) = about **186 J**, roughly the energy of a 19 kg mass dropped from a height of one metre. The stretched rubber of the sleeve in the pipe stores only about 4 J. A burst releases the gas's energy in milliseconds, which is why it is loud and why fragments of rubber and loose fittings can be thrown.

## Regulated supply or fixed charge

How a part is inflated matters as much as how it is made. There are two extremes:

- **A regulated supply**, such as a compressor line through a regulator set to 150 kPa, holds the pressure constant however much air the part takes. That is the case above: above the limit pressure there is no equilibrium.
- **A fixed charge**, a small reservoir filled to a known pressure and then valved into the part, delivers a fixed quantity of air. As the part grows, the same air fills a larger volume and its pressure falls, by Boyle's law. The falling gas pressure can meet the rubber's curve at a stable equilibrium, even where the rubber alone would run away.

The thermodynamics text in the references analyses exactly this contrast for balloons, showing that a fixed mass of gas stabilises states that are unstable at fixed pressure. For TP-100 the effect can be put in numbers.

This is an illustration. Suppose the plug is inflated from a 0.32 L charging cylinder filled to 600 kPa gauge, a charge chosen so that, once valved into a plug sitting in a 100 mm pipe, the pressure settles at 150 kPa gauge. The sleeve's internal volume grows from about 0.60 L uninflated to about 0.82 L in the pipe. In free air, the same charge would expand the sleeve until the falling gas pressure met the rubber curve, at a hoop stretch of about **1.49**, a mean diameter of about 125 mm and a pressure of about 63 kPa. The sleeve would grow alarmingly but stop, well short of bursting.

```figure
type: compare
title: TP-100 in free air, regulated supply and fixed charge
cols: Supply in the pipe | Behaviour in free air | Outcome
caption: This is an illustration. Uniform inflation assumed; a local bulge would be more severe with a regulated supply. The fixed charge's protection is lost if anyone tops it up from a line.
- Regulated supply at 150 kPa | 150 kPa | no equilibrium below a stretch near 7 | burst
- *Fixed charge, 0.32 L at 600 kPa | settles at 150 kPa | stops at a stretch of about 1.49, 63 kPa | large but intact
- Fixed charge, 0.5 L at 150 kPa | settles at only 41 kPa | stops at a stretch of about 1.17 | safe, but cannot seal the pipe
```

The last row shows the trap in the other direction. A charge small enough to be harmless is also too small to seal: 0.5 L at 150 kPa, valved into the plug in its pipe, settles at only about 41 kPa, leaving almost nothing for contact. The useful design is a charge of high-pressure air in a small volume, sized for the pipe, which delivers enough air to seal but not enough to reach the runaway region in free air.

## The error: a plug inflated half out of its pipe

This is an illustration. During field trials of TP-100, a plumber inserted a plug into a pipe end only far enough to seat the first end plate, intending to push it further in once it had gripped. He inflated it from a compressor line through the regulator supplied, set to 150 kPa. The half of the sleeve inside the pipe expanded to the wall; the half outside, unrestrained, ballooned into a bulge the size of a grapefruit within seconds, then split along its length with a loud report. Nobody was hurt; the plumber's hand was on the hose, not the plug.

The investigation found nothing wrong with the sleeve. The rubber had done what the calculation says it must: the unrestrained part of the sleeve, inflated from a supply above its 78 kPa limit, had no equilibrium. The half inside the pipe had actually made things worse, because it anchored the sleeve and left only a short length free, which bulged locally and thinned fastest.

The manufacturer made three changes:

1. **An insertion mark.** The plug body now carries a line one sleeve length plus one pipe diameter from the end plate, and the instructions require the mark to be inside the pipe before inflation.
2. **A fixed-charge inflator.** Plugs are now supplied with the 0.32 L charging cylinder described above, filled from a line to 600 kPa and then valved into the plug, with no connection that allows the plug to be inflated directly from a line. The fixed charge seals the pipe at 150 kPa and, in free air, stops the sleeve at about 1.5 times its diameter instead of bursting it.
3. **A reinforced model.** The next design, TP-100R, has a layer of open-weave cord moulded into the sleeve, which limits its free diameter to about 120 mm whatever the pressure. That is how many commercial plugs are made, and it removes the limit-pressure problem by restraint built into the part.

The lesson was recorded in the design file in one line: an unreinforced rubber part inflated from a regulated supply is safe only while something outside it stops it growing.

## Designing inflated rubber parts

The principles that came out of TP-100 apply to any inflated rubber part, from bladders and diaphragms to inflatable seals and grippers:

- **Know the limit.** Calculate the limit pressure, G T / R for a held-end sleeve and about 1.24 G T / R for a sphere, and compare it with the working pressure. If the working pressure is higher, the part relies entirely on restraint.
- **Restrain by design.** A housing, a cage, a pipe wall or reinforcing cord that always surrounds the part makes the limit pressure irrelevant.
- **Inflate with a fixed charge where possible.** A fixed quantity of gas stabilises states that a fixed pressure cannot.
- **Instruct and mark.** Where the user controls restraint, as with a test plug, tell them, and mark the part so that the right use is the easy one.
- **Count the stored energy.** Work out the energy in the gas at working pressure, as above, and treat a burst as the release of that energy: shields for testing, distance for people, and no loose fittings that could become projectiles.
- **Keep the gas volume small.** Since the stored energy is in the gas, a design that fills unnecessary internal volume with a spacer or a larger central tube both stores less energy and needs less air to seal.
- **Test the misuse.** Inflate a sample unrestrained, behind a shield, from the supply users will actually have, and record what happens.

These are engineering principles, not a substitute for the maker's rating of a real product or for the work health and safety duties that apply to pressurised equipment.

## Exercise: a spherical bladder

A spherical rubber bladder of TP-100's compound, 60 mm mean radius with a 3 mm wall, is used inside a rigid housing to clamp parts.

1. What is its limit pressure, and at what stretch does it occur?
2. If it is designed to work at 60 kPa inside the housing, is it safe if the housing is removed?

**Worked answer.**

1. For a neo-Hookean sphere, the maximum pressure is at λ = 7^(1/6) = **1.383**, and equals 2G (T / R)(1 / 1.383 − 1 / 1.383⁷) = 2 × 0.82 × (3 / 60) × (0.723 − 0.103) = **50.7 kPa**.
2. No. The working pressure, 60 kPa, is above the 50.7 kPa limit, so a bladder inflated from a 60 kPa regulated supply with the housing removed has no equilibrium and would grow until it burst. The design relies entirely on the housing. Options are a thicker wall, which raises the limit in proportion; a fixed-charge inflation sized for the housing; an interlock that prevents inflation when the housing is open; or reinforcement. Since a housing is easily removed for maintenance, an interlock or a fixed charge is the stronger answer.
