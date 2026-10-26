---
book: diffusion-by-the-numbers
chapterSlug: hydrogen-and-bake-out
order: 7
title: "Hydrogen and bake-out: time grows with thickness squared"
description: "Treat hydrogen absorbed by DS-40's hard case during plating as a diffusion problem, see why trapping slows it, and size bake-out times from section thickness and diffusivity."
draft: false
---

Hydrogen is the smallest atom, and it diffuses through steel faster than anything else. Steel picks it up during acid cleaning, electroplating, welding and corrosion, and in hard, highly stressed steels a small amount of diffusible hydrogen can cause **hydrogen embrittlement**: cracks that appear hours or days after the part was made, under a load that it should carry easily. The standard remedy for plated parts is **baking**: holding them at a moderate temperature soon after plating so that the hydrogen diffuses out before it can do harm.

How long a bake needs is a diffusion problem. This chapter explains why hydrogen moves so fast and why trapping slows it, sets out how bake time depends on section thickness and diffusivity, applies the result to DS-40's zinc-plated end and to thinner and thicker parts, and shows what happens when a bake time is copied from a thin part to a thick one. The specification side of baking, including which parts need it and how soon, is covered in *Electroplating by the Numbers* in [Hydrogen embrittlement and baking](/reados/publications/electroplating-by-the-numbers/hydrogen-embrittlement-and-baking/); this chapter supplies the physics behind the times.

## Why hydrogen is fast, and why traps slow it

A hydrogen atom in iron sits in the small interstitial spaces of the lattice and hops between them with a very low energy barrier. Research on ferritic iron alloys reports diffusivities of up to about **10⁻⁵ to 10⁻⁴ cm²/s**, that is **10⁻⁹ to 10⁻⁸ m²/s**, even at room temperature: thousands of times faster than carbon diffuses at carburising temperature.

Real steels are full of places where hydrogen prefers to sit: dislocations, grain boundaries, interfaces with carbides and inclusions, and atoms of alloying elements. These are **traps**. A hydrogen atom that falls into a trap stays there for a while before it escapes, so its average progress through the steel is slowed, sometimes by orders of magnitude. The same research distinguishes **reversible** traps, with activation energies below about 50 kJ/mol, which release hydrogen at room or modestly raised temperature, from **irreversible** traps, above about 50 kJ/mol, which hold it unless the steel is heated considerably. Hardened, high-strength steels, like DS-40's martensitic case, are dense with traps.

The result is an **effective** diffusion coefficient, much lower than the lattice value, that depends on the steel's microstructure and on temperature. Published effective values for hardened and alloyed steels span orders of magnitude. This chapter uses **teaching values** for a hardened case: **D_eff ≈ 1 × 10⁻¹¹ m²/s at room temperature** and **1 × 10⁻¹⁰ m²/s at a typical bake temperature of about 200 °C**. They are illustrations of the method, not data for any steel. Measured effective diffusivities for a particular steel and heat treatment come from permeation or desorption tests in a laboratory, and differ between methods; specifications sidestep the uncertainty by prescribing tested bake conditions.

## Bake time and thickness

For a plate of thickness 2L that has absorbed hydrogen uniformly and is baked with its surfaces free to release it, the fraction of hydrogen remaining after time t falls, once the bake is under way, roughly as **(8 ÷ π²) × exp(−π² D t ÷ (4L²))**. The time to remove a given fraction therefore scales as **L² ÷ D**: twice the thickness needs four times the bake, and a tenfold lower diffusivity needs ten times the bake.

```figure
type: compare
title: Time to remove 90% of uniformly absorbed hydrogen from a plate, by half-thickness
cols: Bake, D_eff = 1 × 10⁻¹⁰ m²/s | Room temperature, D_eff = 1 × 10⁻¹¹ m²/s
caption: This is an illustration with teaching diffusivities, from the leading term of the slab solution. Time grows with the square of thickness; a thin clip clears in well under an hour at bake temperature, while a 12 mm plate takes days.
- 1 mm plate, L = 0.5 mm | about 0.6 hours | about 5.9 hours
- 2 mm plate, L = 1 mm | about 2.4 hours | about 24 hours
- *6 mm plate, L = 3 mm | about 21 hours | about 212 hours
- 12 mm plate, L = 6 mm | about 85 hours | about 850 hours
```

The leading-term formula is accurate once the bake is well under way, which is the regime that matters for a 90% target; in the first minutes it overestimates what remains, because hydrogen near the surface escapes faster than the single exponential suggests. For comparisons between parts it is more than adequate, since the same approximation applies to each.

The table shows why baking specifications distinguish parts by section and why bakes are done hot: at room temperature, with the teaching value, even a 2 mm part would take a day to release most of its hydrogen, during which a loaded part might crack.

### Where the hydrogen is matters

The plate calculation assumes hydrogen spread uniformly through the thickness. Hydrogen absorbed during plating starts near the surface and diffuses inwards as well as outwards. For a thick part such as DS-40's 40 mm shaft, the relevant length is not the half-thickness but the depth the hydrogen has reached, set by √(Dt) since plating. At the teaching room-temperature value, hydrogen spreads about **0.2 mm** in the first hour after plating and about **0.5 mm** in eight hours, deeper into the hard case where stress concentrations and traps await it. That is one reason baking specifications require the bake to start soon after plating: the longer the delay, the deeper the hydrogen, and the longer it takes to bring it out.

```figure
type: stats
title: How far hydrogen spreads, √(D_eff t), with the teaching diffusivities
caption: This is an illustration. During a bake at the higher teaching diffusivity, hydrogen near the surface can escape from a depth of about 1.7 mm in 8 hours; left at room temperature, it moves about a third as far in the same time.
- 0.19 mm | 1 hour at room temperature | D_eff = 10⁻¹¹ m²/s
- 0.54 mm | 8 hours at room temperature | about three times the 1-hour figure
- 0.60 mm | 1 hour at bake temperature | D_eff = 10⁻¹⁰ m²/s
- *1.70 mm | 8 hours at bake temperature | about three times the 1-hour figure
```

### The coating itself

The zinc on DS-40's end does not simply let hydrogen walk out. Hydrogen must leave the steel through the coating or at uncoated areas, and many electroplated coatings slow its escape considerably. That is another reason specifications set bake conditions for each coating and steel strength rather than leaving them to calculation, and why some processes bake before applying a final passivate or use plating processes that introduce less hydrogen in the first place. The diffusion calculation explains the scaling with thickness and time; the specification sets the actual conditions.

### The cost of a delay

The effect of a delay before baking can be put into numbers. Hydrogen absorbed at the surface during plating spreads inwards at room temperature by about √(D_eff t). With the teaching value, it reaches a characteristic depth of about **0.19 mm** one hour after plating and about **0.38 mm** after four hours. To bring hydrogen back out from twice the depth takes roughly **four** times as long, because time scales with the square of distance. A four-hour delay can therefore cost several times the bake time that a prompt bake would have needed, and in the meantime the hydrogen has been sitting in the most highly stressed layer of a hard part. Prompt baking is not bureaucratic caution; it is the square law at work.

## Bake temperature and the traps

Why bake at around 200 °C rather than hotter or cooler? Higher temperatures raise the effective diffusivity, shortening the bake, and they release hydrogen from more of the reversible traps. But a hardened part's own tempering temperature sets a ceiling: baking above it would soften the case. Lower temperatures are safer for hardness but slower, by the Arrhenius factor of Chapter 3 applied to the effective diffusivity. Specifications choose bake temperatures and times together, by steel strength and coating, within that window. Hydrogen held in irreversible traps is not released at bake temperatures, and, being immobile, it is generally less harmful than diffusible hydrogen; the bake's purpose is to remove the hydrogen that can move.

## Testing the result

A bake cannot be confirmed by looking at the part. Embrittlement is tested indirectly, by holding notched or threaded specimens of the same steel, processed with the parts, under sustained load for a set time, or by loading them in steps, and checking that none crack. Test methods such as ASTM F519, named here by number, describe such tests for plating and coating processes. A plater qualifies a process with them, and the routine control is then the process record: the time from plating to bake, the bake temperature and its duration, logged for every batch.

## DS-40's bake

DS-40's zinc-plated threaded end is not carburised, but the shaft's hard case begins a few millimetres away, and the whole shaft passes through the acid cleaning and plating line. The process sheet requires DS-40 to be baked at the specification's conditions, starting within the specified time after plating, with every shaft in the bake. The calculation in this chapter informed the choice of the bake time within the specification's options: the hydrogen of concern is near the surface of the hard case and threads, at depths of a fraction of a millimetre to about a millimetre, which a bake of several hours at bake temperature reaches according to the √(D_eff t) estimate.

### Why only hard steels

Every steel absorbs hydrogen during plating; only hard, high-strength steels are usually at serious risk of cracking from it. Their strength lets them carry high local stresses at notches, threads and fillets, and those stressed regions attract diffusible hydrogen, which accumulates there and lowers the stress needed to crack. Softer steels yield locally instead, relieving the stress before a crack can start. That is why specifications tie baking requirements to hardness or tensile strength, and why DS-40, with a hardened case and a thread nearby, is baked while a mild-steel bracket plated on the same line may not need to be. The diffusion calculation applies to both; the consequence of the hydrogen differs.

## Hydrogen beyond plating

The same arithmetic governs other hydrogen problems:

- **welding**, where hydrogen from moisture in consumables enters the weld metal and heat-affected zone, and a post-weld heat, sometimes called a dehydrogenation or hydrogen-release treatment, lets it diffuse out of thick sections before it causes cold cracking; *Weldability by the Numbers* covers when such treatments are needed;
- **pickling**, where acid cleaning of high-strength parts introduces hydrogen as plating does;
- **service**, where corrosion or cathodic protection generates hydrogen at the surface continuously, and the part's diffusivity and traps decide how much accumulates.

In each, bake or hold times scale with the square of the section and inversely with the effective diffusivity at the hold temperature.

## A failure case: a bake time copied from a thin part

This is an illustration. A plating shop had a well-established bake of about an hour for thin spring clips about 1 mm thick, half-thickness 0.5 mm. When a customer sent hardened 6 mm plates for plating, the planner applied the clips' bake time, reasoning that the steel and hardness were similar.

Several plates cracked at bolt holes within days of assembly. The detection came from the cracked plates; the investigation, from the bake record and the arithmetic. With the teaching bake diffusivity, an hour removes all but about **2%** of the hydrogen from a 1 mm clip, but leaves about **73%** of uniformly absorbed hydrogen in a 6 mm plate, whose 3 mm half-thickness needs about 36 times as long, around 21 hours, for the same fraction.

```figure
type: bars
title: Hydrogen remaining after the clips' one-hour bake, by part thickness
unit: % remaining
max: 80
caption: This is an illustration with the teaching bake diffusivity of 1 × 10⁻¹⁰ m²/s and hydrogen initially uniform. The same hour that clears a 1 mm clip leaves a third of the hydrogen in a 2 mm part and nearly three-quarters in a 6 mm plate.
- 1 mm clip | 2.3
- 2 mm part | 33.3
- 3 mm bracket | 54.6
- *6 mm plate | 73.4
```

The correction was to quarantine the remaining plates, set bake times from section thickness, the steel's strength and the specification for each part number, and add the section thickness to the plating order form. The shop's lesson was that a bake time belongs to a part, not to a material, and that a proven recipe is proven only for what it was proven on.

The same reasoning protected DS-40's own route. Because the shaft's carburised and hardened case lies a few millimetres from the plated thread, its process sheet was reviewed against the plating order: the bake was confirmed as a separate operation with its own start-time limit, the shafts were racked so that the oven heated them evenly, and the bake record joined the heat-treatment record in the shaft's batch file.

## How this applies to a small Australian business

Treat hydrogen as a fast but trap-slowed diffusing species, and expect effective diffusivities in hardened steels to be far lower than in soft iron. Remember that bake or hold time grows with the square of the section thickness and inversely with diffusivity, and that hydrogen spreads deeper the longer a bake is delayed. Use the calculation to understand and compare cases, and take the actual bake conditions from the applicable specification and the plater's qualified procedure. Set bake times per part, with section thickness on the order.

## Exercise: a 3 mm bracket

A hardened bracket 3 mm thick is to be baked after plating. Using this chapter's teaching bake diffusivity of 1 × 10⁻¹⁰ m²/s, roughly how long does it take to remove 90% of uniformly absorbed hydrogen, compared with a 1 mm clip and a 6 mm plate?

**Worked answer.** The half-thickness is **1.5 mm**, three times the clip's 0.5 mm, so the time is about **3² = 9** times the clip's 0.6 hours: about **5.3 hours**. The 6 mm plate, with twice the bracket's half-thickness, needs about **4** times as long again, about 21 hours. The bracket sits between them, and its bake time comes from its own thickness, not from either neighbour's.
