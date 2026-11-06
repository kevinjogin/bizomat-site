---
book: plasma-surface-engineering-by-the-numbers
chapterSlug: adhesion-hardness-and-coating-failures
order: 9
title: "Adhesion, hardness and coating failures"
description: "What makes a PVD coating stick, how indentation and scratch tests judge adhesion, why measuring a thin coating's hardness needs very small loads, and how to trace a coating failure back to its cause."
draft: false
---

A hard coating that does not stick is worse than no coating at all. It flakes off in service, and its hard fragments act as an abrasive between the surfaces it was meant to protect. Adhesion is decided by everything before the coating's first atom arrives: the steel's hardness and finish, the cleaning, the etch, the interlayer and, in a duplex treatment, the nitrided layer underneath. It cannot be seen, and most of the tests that measure it destroy the sample, so the shop tests coupons from every run and treats a failed adhesion test as a stop sign.

This chapter explains what holds a coating on, describes the two common adhesion tests, the Rockwell indentation test and the scratch test, and shows with the BIZOMAT Vickers and Knoop hardness tool why a 4 µm coating's hardness can be measured only with very light loads. It then sets out a method for tracing coating failures in service, and ends with a duplex run in which the nitriding left a compound layer that the coating could not survive.

## What holds a coating on

A PVD coating is held by the chemical bonds between its first atomic layers and the substrate, and by the mechanical support of what lies beneath. Both can fail.

The bonds fail if anything sits between coating and steel: an oxide film, adsorbed water, a residue of oil or polishing compound (Chapter 4). That is why the etch step and the interlayer matter so much; a metallic chromium interlayer on freshly etched steel bonds strongly, and the nitride grows on the chromium. The support fails if the substrate is too soft: under a concentrated load the substrate yields and the thin, hard, stiff coating cannot follow it, so it cracks and the fragments lift. A hardened tool steel at 46 HRC supports a coating far better than a soft steel, and a nitrided diffusion zone at 1,000 HV supports it better again, which is the point of the duplex treatment.

Internal stress is the third factor. Ion bombardment during growth leaves PVD nitrides in compression, often a few gigapascals. Compression helps resist cracking, but it stores elastic energy that a weak interface can release by buckling and flaking, especially at edges and on thick coatings.

## The Rockwell indentation test

The simplest adhesion test uses a Rockwell C hardness tester: the diamond cone is pressed into a coated coupon under 150 kgf, deforming the coating and substrate severely, and the area around the indentation is examined under a microscope at about 100 times. A well-adhered coating shows fine radial cracks around the dent but stays attached; a poorly adhered one shows rings of flaking or large areas of delamination.

Results are graded against reference pictures in a published method, VDI 3198, which defines classes from fine cracking only to extensive delamination. The shop accepts only patterns with radial cracks and no flaking, and keeps a photograph of every coupon's indentation on file. The test is quick, needs only a standard hardness tester and catches gross adhesion failures well; it is less sensitive to small differences between good coatings, and needs a substrate hard enough that the indentation is not simply a deep crater.

## The scratch test

The scratch test draws a diamond stylus with a rounded tip across the coated surface while the load on it rises steadily, typically from a few newtons to 100 N or more over a scratch a few millimetres long. As the load rises, the coating first cracks inside the scratch track, then begins to chip at the edges, and finally is stripped from the substrate. The loads at which these events first occur are the critical loads, identified under the microscope and, on many instruments, by acoustic emission and changes in friction force.

```figure
type: compare
title: Scratch test critical loads on CrN coupons from the shop's trials
cols: First cohesive cracking | First adhesive chipping | Coating removed from the track
rowhead: Substrate
- H13 at 46 HRC, not nitrided | about 15 N | about 25 N | about 35 N
- * H13 nitrided to 0.12 mm, no compound layer | about 25 N | about 50 N | above 70 N
- H13 nitrided with a 2 µm compound layer | about 20 N | about 18 N, spalling at the compound layer | about 30 N
caption: This is an illustration. Critical loads depend on the stylus radius, loading rate, coating thickness and substrate, so they compare coatings only within one laboratory's method. The pattern, a better-supported coating on a nitrided diffusion zone and a weak link at a compound layer, is the general one.
```

The scratch test is more discriminating than the indentation test and gives numbers that can be trended, but it needs a dedicated instrument and careful interpretation, and its results depend on the method. The shop runs it on qualification coupons for each new recipe and on a sample of production runs, and keeps the stylus's tip under regular inspection, since a worn tip changes every result.

## Measuring the hardness of a thin coating

Measuring a 4 µm coating's hardness by pressing a diamond into it looks simple, but the indentation must be so shallow that the softer substrate underneath does not affect the reading. A common rule of thumb limits the indentation depth to about a tenth of the coating's thickness: 0.4 µm for a 4 µm coating.

The [Vickers and Knoop hardness tool](/tools/vickers-knoop-hardness/) gives the indentation depth and the minimum layer thickness for each test. Knoop indentations are shallowest for their size, about a thirtieth of their long diagonal. At 0.05 kgf, a CrN coating giving a long diagonal of 0.0191 mm reads 1,950 HK0.05, but the indentation is about 0.6 µm deep and the tool's minimum thickness is 6 µm, more than the coating: the reading is influenced by the substrate. At 0.01 kgf, a diagonal of 0.0085 mm reads 1,969 HK0.01 at a depth of about 0.3 µm and a minimum thickness of about 3 µm, which a 4 µm coating satisfies.

```figure
type: compare
title: Knoop tests on order 27's 4 µm CrN coating
cols: Long diagonal | Hardness | Indentation depth | Minimum layer thickness | Valid on 4 µm
rowhead: Test force
- 0.05 kgf | 0.0191 mm | 1,950 HK0.05 | about 0.6 µm | about 6 µm | No
- * 0.01 kgf | 0.0085 mm | 1,969 HK0.01 | about 0.3 µm | about 3 µm | Yes, barely
caption: This is an illustration. Results from the Vickers and Knoop hardness tool. A diagonal of 8.5 µm is hard to measure optically to better than a few per cent, which is why coating hardness is usually measured by instrumented nanoindentation, recording force against depth at loads of a few millinewtons.
```

Even at 0.01 kgf, measuring an 8.5 µm diagonal under an optical microscope to the accuracy hardness needs is difficult, and small errors become large ones in the result. For that reason the shop reports coating hardness only from qualification work done by a laboratory with a nanoindenter, and uses adhesion and thickness, which it can measure well, for routine release.

## Measuring residual stress

The compressive stress in a coating can be measured from how much it bends a thin substrate. A flat strip of steel, coated on one side, curves as the coating tries to expand against it. Stoney's equation, from 1909 and still the standard starting point, relates the coating stress to the curvature: σ = E_s t_s² ÷ [6 (1 − ν_s) R t_f], where E_s, ν_s and t_s are the substrate's modulus, Poisson's ratio and thickness, t_f the coating thickness and R the radius of curvature produced by the coating.

The shop runs a thin strip coupon in qualification runs. A hardened steel strip 0.5 mm thick, with E_s = 200 GPa and ν_s = 0.3, coated with 4 µm of CrN, curved to a radius of about 2.0 m, measured with a profilometer as the change from its curvature before coating. The coating stress is 200 × 10⁹ × (0.5 × 10⁻³)² ÷ (6 × 0.7 × 2.0 × 4 × 10⁻⁶) = about 1.5 GPa in compression, in the range expected for a dense sputtered nitride. A recipe change that doubled the bias voltage roughly doubled the curvature, which is how the shop chose the −80 V bias of Chapter 7: dense enough, without the stress that made thicker coatings flake at edges.

## Failure modes in service

Coatings fail in service in a handful of recognisable ways, and the pattern on the part usually points to the cause.

```figure
type: compare
title: Common coating failures and what they suggest
cols: What it looks like | Usual causes
rowhead: Failure
- Spalling | Coating lifted off in flakes, bare substrate beneath | Poor cleaning or etch, weak interlayer, compound layer, high stress, soft substrate
- Wear-through | Coating thinned evenly until the substrate shows | Coating too thin for the duty, wrong coating, abrasive work material
- Edge chipping | Small chips along sharp edges | Coating too thick on the edge, edge not prepared, high stress
- Soldering or build-up | Work material welded onto the surface | Thin or missing coating locally, wrong coating, local overheating in service
- Cracking in a network | Fine cracks, often with the substrate cracked too | Thermal fatigue of the tool; the coating may not be at fault
- * Pinhole corrosion | Small rust spots under an intact-looking coating | Defects from debris or droplets, coating too thin to seal the surface
caption: General patterns; a section through the failed area and a comparison with a sound one are needed to confirm a cause.
```

Not every failure is the coating's fault. A die-casting core that develops a network of heat-check cracks has reached the thermal fatigue life of its steel, and the coating cracks with it. A tool used outside its designed speeds or temperatures will wear whatever its coating. The sequence above exists to separate those cases from coating defects before anyone commits to a remedy.

## Stripping and recoating

Coatings can usually be removed without harming the part, which makes rework and reconditioning possible. Chromium and titanium nitrides on steel are stripped chemically, in solutions that attack the coating faster than the steel; the process must be controlled because some strippers also attack the substrate or cobalt binder in carbide. Worn tools are then re-prepared and recoated, often several times over their lives. For a duplex part, stripping leaves the nitrided case intact, so recoating restores the original structure as long as the case has not been worn through. The shop records every strip and recoat against the part's serial number, so that the customer knows how many times a tool has been reconditioned.

## The release tests for each run

Putting the chapters together, the shop releases a PV-1 run only when four things are true. The witness coupons' ball craters show the thickness inside its band and on the X̄ chart (Chapter 8). The Rockwell indentation photographs from the coupons show radial cracks only, with no flaking. The run log shows the etch, interlayer and deposition steps at their set values, with target voltages inside their bands, the bias current normal for the load and the arc count low. And, for duplex work, the nitriding run's coupons have passed their own checks (Chapter 6) before the parts were coated at all.

Each test covers something the others cannot. Thickness says nothing about adhesion; adhesion on a coupon says nothing about shadowing on a part; the run log says the machine did what it was told, not that what it was told was right. A run that passes all four has been checked from several independent directions, which is the most a destructive-testing process can offer, and the certificate lists each result so that the customer can see the evidence rather than a bare statement of compliance.

When a run fails one check, the parts stay in quarantine until the cause is known. The shop's rule is that a failed coupon is never retested until it passes: if a second indentation on the same coupon looks better than the first, that is a reason to look harder, not a reason to release.

## Tracing a failure in service

When a coated part fails early, the shop works through a fixed sequence before forming a view, because the obvious explanation is often wrong.

```figure
type: steps
title: The shop's sequence for a coating failure
caption: This is an illustration. It shows the shop's procedure. The customer's information on how the part was used is as important as the laboratory's.
- Get the failed part, its run number and its service history | Which run, which position, how many cycles, what conditions
- Look at the pattern | Random spots, a band, an edge, everywhere: each points to different causes
- Check the run records and that run's coupons | Thickness, adhesion test photographs, bias current, arc counts
- Section the failed part through the failure and through a sound area | Coating thickness, interlayer, substrate, any compound layer
- * Compare with a part or coupon from a good run | The difference is the evidence
- Agree the cause with the customer and record the change | Recipe, cleaning, loading or design
```

Order 27's soldering band in Chapter 8 was found this way: the pattern was a band, the band matched the loading geometry, and the thickness measurements confirmed it. The next failure was different.

## When it goes wrong: a compound layer under the coating

The fourth batch of order 27 passed its thickness checks, but the Rockwell indentation photographs from all five coupons showed rings of flaking around the dents, the pattern the shop rejects. The batch was held.

Sections of a coupon showed a bright, continuous layer about 2 µm thick between the nitrided diffusion zone and the chromium interlayer: a compound layer, which order 27's specification forbids. The coating had adhered well to it; the failure ran through the compound layer itself, which is brittle, so the flakes carried the coating with them. The nitriding run sheet showed why: the nitrogen flow had been set at 0.5 standard litres per minute, the shop's standard 25% recipe, instead of order 27's lean 0.2. The operator had selected the general nitriding recipe from the controller's list.

```figure
type: decision
title: What to do with the held batch
caption: This is an illustration. The shop stripped the coating chemically, which leaves the nitrided case, and lightly polished off the compound layer before recoating; the toolmaker agreed the rework after seeing the sections.
- Release the batch, since thickness passed | Coating would flake in the first shots | Not adopted
- Scrap the inserts | Loses the toolmaker's machined inserts | Not adopted
- * Strip the coating, remove the compound layer by fine polishing, check by section, recoat | Recovers the inserts with the specified structure | Adopted
- Prevent a repeat | Recipe names made order-specific; recipe printed on the job card and checked by a second person | Adopted
```

The adhesion test caught a fault that thickness measurements could never have seen, and it did so before a single insert reached the toolmaker's die-casting machine, where a spalled coating would have cost a die change and a shift's production. The general lesson is that a duplex treatment is two processes whose results interact, and a release check on the second, the coating, must be able to reveal faults in the first.

## Exercise: a Vickers test on the coating

A technician tries a Vickers test on order 27's 4 µm CrN coating at 0.025 kgf and measures a mean diagonal of 0.0048 mm.

1. What hardness does the Vickers and Knoop hardness tool give, and how deep is the indentation?
2. Is the reading valid on a 4 µm coating by the tenth-of-thickness rule?
3. What would you advise?

**Answer.**

1. 1.8544 × 0.025 ÷ 0.0048² = 2,012 HV, at a depth of about 0.0048 ÷ 7 = 0.7 µm. The tool displays the force rounded to two decimals, so it labels the scale HV0.03.
2. No. The rule of thumb limits the depth to about 0.4 µm for a 4 µm coating, and the tool's minimum layer thickness of about 7 µm also exceeds the coating, so the softer nitrided steel beneath has influenced the reading.
3. Treat the number as indicative only. For a valid coating hardness, use a Knoop test at 0.01 kgf with careful measurement, or better, instrumented nanoindentation; and for release, rely on adhesion and thickness tests, which matter more for the part's performance than a few per cent of hardness.
