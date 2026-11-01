---
book: adhesive-bonding-by-the-numbers
chapterSlug: durability-heat-moisture-and-creep
order: 9
title: "Durability: heat, moisture and creep"
description: "How bonded joints lose strength over time through moisture at the interface, water in the adhesive, heat and sustained load, and how to design ageing tests that exercise the real failure mechanism."
draft: false
---

A bonded joint that passes every test on the day it is made can still fail years later. The adhesive absorbs water and softens. Water reaches the interface and displaces the adhesive from a poorly prepared oxide. Heat ages the polymer, and a sustained load makes it creep. These processes are slow, which is why they are so often missed, and why durability is the property that most separates a sound bonding process from one that merely looks sound.

This chapter describes the main ageing mechanisms, estimates how fast moisture reaches the middle of a bondline, introduces the wedge test for surface durability, and applies the Arrhenius relation to ageing tests with its limits. Its error is an ageing test that exercised the wrong mechanism.

## How bonded joints age

Four mechanisms account for most loss of strength in service.

```figure
type: layers
title: Where a bonded joint loses strength with time
caption: Moisture acts at two levels, in the adhesive and at the interface, and the interface is usually the more dangerous on metals. Each mechanism needs its own test conditions.
- Interface | water displaces the adhesive from the oxide or hydrates the oxide, turning a cohesive failure into an interfacial one
- Adhesive | absorbed water plasticises the polymer, lowers its glass transition temperature and its strength, mostly reversibly
- Heat | long exposure near the upper service limit oxidises and embrittles the polymer, irreversibly
- Sustained load | the adhesive creeps, faster when warm or wet, until the joint slips or ruptures
```

**Moisture at the interface** is the main threat to bonded aluminium. Water diffuses along the interface or through the adhesive, reaches the oxide and hydrates it, forming a weak, bulky hydroxide that pushes the adhesive off. On a well-prepared, stable oxide, especially one treated with a coupling agent or anodised, this is slow. On a surface that was only wiped, or abraded and left to age, it can be fast.

**Moisture in the adhesive** softens it. Most structural adhesives absorb a few per cent of water by mass, which acts as a plasticiser, lowering the glass transition temperature and the modulus. The effect is largely reversible if the joint dries out, but a wet adhesive at high temperature may be much weaker than the data sheet shows.

**Heat ageing** is a slow chemical change: oxidation, further crosslinking or chain breakage. It is irreversible and is what the Arrhenius relation describes best.

**Creep** is slow deformation under a sustained load. Rigid adhesives creep little at room temperature but much more as they approach their glass transition temperature, and elastic adhesives creep under any sustained stress, which is why they are designed for very low sustained loads.

## How long water takes to arrive

Water enters a bondline mostly from its exposed edges, by diffusion. In a diffusion process the depth reached grows with the square root of time: the time for water to reach a depth x is of the order of x² ÷ D, where D is the diffusion coefficient of water in the adhesive.

Diffusion coefficients of water in cured epoxies are commonly of the order of 10⁻¹³ to 10⁻¹² m²/s at room temperature, higher when warm. Plant K's stiffener flanges are 20 mm wide, open to the air on both edges, so the middle is 10 mm from an edge.

```figure
type: compare
title: Water reaching the middle of a 20 mm wide bondline
rowhead: Diffusion coefficient
cols: Time for water to reach 10 mm | Depth reached in one year
caption: This is an illustration. Order-of-magnitude estimates from t ≈ x² ÷ D and x ≈ √(Dt). Real diffusion coefficients come from water uptake tests on the actual adhesive at the service temperature.
- 10⁻¹² m²/s | about 3.2 years | about 5.6 mm
- 10⁻¹³ m²/s | about 32 years | about 1.8 mm
```

Two conclusions follow. First, the middle of a wide bondline stays dry for years, while the edges are wet within weeks or months, so degradation starts at the edges and works inward. A wide joint keeps a dry, strong core long after its edges have weakened. Second, water reaches the edges first, and the edges are exactly where shear lag, peel and thermal forces concentrate the load, as Chapters 6 to 8 showed. That is the worst coincidence in bonded joint design, and the reason edge sealing, fillets and good surface preparation at the edges matter so much.

Corrosion of the adherend can make things worse. On steel, rust creeping under the edge of a bond lifts the adhesive. On aluminium, filiform corrosion can undercut paint and adhesive alike. Sealing the edges with a fillet, or with the paint system that follows bonding, slows both.

## The wedge test

The best-known test of surface durability for bonded aluminium is the wedge test, standardised as ASTM D3762 and named here for scope only. Two strips of the aluminium, prepared by the process under test, are bonded together, and a wedge is driven into one end to open a crack in the bondline. The specimen is then held in hot, humid air, and the crack is watched. On a durable surface, the crack grows little and stays in the adhesive. On a poor one, water reaches the crack tip, attacks the interface and the crack runs along it.

Plant K ran wedge tests on its two candidate preparations.

```figure
type: compare
title: Plant K's wedge tests on two surface preparations
rowhead: Preparation
cols: Initial crack length | Growth after exposure | Failure surface
caption: This is an illustration. Five specimens of 3 mm 5052 aluminium for each preparation, wedge inserted at room temperature, then held for 24 hours in hot, humid air. The growth and the failure surface both separate the preparations clearly within a day.
- Abraded and wiped with isopropanol | 31 mm | 18 mm | mostly interfacial, bare metal visible
- * Grit blasted, silane primed | 29 mm | 6 mm | cohesive, adhesive on both faces
```

The two preparations gave nearly the same lap shear strength when tested fresh, as Chapter 10 shows. The wedge test separated them in a day, by the amount the crack grew and, even more clearly, by where it ran. That is the value of a durability test: it finds the difference that a strength test made on the day cannot.

## Temperature and the Arrhenius relation

For mechanisms driven by temperature alone, the Arrhenius relation of Chapter 5 links ageing at a high test temperature to ageing at a lower service temperature. The [Arrhenius acceleration check](/tools/arrhenius-acceleration-check/) gives the acceleration factor, the service hours a test represents, and the test length needed for a target life, with a sensitivity table for activation energies 0.1 and 0.2 eV either side of the value entered.

### What temperature is "service"?

Because the Arrhenius rate rises exponentially with temperature, a few hot hours a day age a joint far more than the average temperature suggests. Suppose a door spends 6 hours a day at 60 °C in the sun and 18 hours at 25 °C. The average temperature is 33.8 °C, but with Ea = 0.6 eV the constant temperature that would cause the same ageing, found by averaging the rates rather than the temperatures, is about 42.5 °C. Using the average temperature as the service temperature would overstate the life by a large factor. A temperature log of a real door over a summer week, weighted this way, gives the right service temperature.

## The error: testing the wrong mechanism

The plant's first durability plan was a dry heat test: 500 hours at 85 °C on lap shear coupons, treating 35 °C as the service temperature. With Ea = 0.6 eV, the Arrhenius acceleration check gave a factor of 23.4, so the test represented about 11,720 service hours, under a year and a half; to cover ten years it would need about 3,737 hours. The coupons were tested after 500 hours and lost only a few per cent of their strength, and the plan's first draft concluded that heat ageing was not a concern.

The conclusion was sound as far as it went, which was not far. Three problems emerged in review.

- **It tested a mechanism that was not the threat.** Dry heat ages the polymer. The threat to bonded aluminium is water at the interface, which a dry test never exercises. The wiped-only preparation, which the wedge test later showed to be poor, passed the dry heat test as well as the primed one.
- **The test temperature was close to the adhesive's limit.** After its oven cure, the epoxy's illustrative glass transition temperature was about 95 °C. At 85 °C, within about 10 K of it, the polymer is close to softening, and its ageing may follow a different mechanism from the one at service temperatures. The tool flags exactly this with its "same failure mechanism" check.
- **The activation energy was assumed.** The plan used 0.6 eV because it had been used for the cure. The tool's sensitivity table showed the 500-hour test representing anywhere from 4,095 hours at 0.4 eV to 33,541 hours at 0.8 eV.

```figure
type: bars
title: Service hours at 35 °C represented by 500 hours at 85 °C
unit: hours
caption: From the Arrhenius acceleration check. The answer spans a factor of eight across a plausible range of activation energies, and none of it says anything about moisture at the interface.
- 0.4 eV | 4095
- 0.5 eV | 6928
- * 0.6 eV | 11720
- 0.7 eV | 19827
- 0.8 eV | 33541
```

The revised plan used three tests, each aimed at a mechanism: the wedge test in hot, humid air for the interface; lap shear coupons aged for 1,000 hours in hot, humid air and tested both wet and after drying, for moisture in the adhesive; and a smaller dry heat test at 70 °C, well below the glass transition temperature, for heat ageing. Humidity acceleration does not follow the Arrhenius temperature relation alone, and the plan made no claim to convert the humid test to years of service. It compared preparations and adhesives against each other and against a requirement for retained strength, which is what such tests do reliably.

## Retained strength as the measure

Ageing tests are most useful when their result is expressed as **retained strength**: the mean strength after ageing divided by the mean strength of identical coupons tested fresh. A retained strength compares like with like, so it removes much of the effect of adherend thickness and geometry that makes absolute lap shear numbers hard to compare, and it points straight at the mechanism when read together with the failure surfaces.

Plant K set itself an illustrative requirement: at least 80% retained lap shear strength after 1,000 hours in hot, humid air, with failures remaining mainly cohesive. Its results for the two preparations, on 12.5 mm overlap coupons of 1.6 mm skin stock, were these.

```figure
type: compare
title: Lap shear strength before and after hot, humid ageing
rowhead: Preparation
cols: Fresh mean | Aged mean | Retained | Aged failure surface
caption: This is an illustration. 1,000 hours of hot, humid exposure, coupons tested after drying back to room conditions. The requirement was 80% retained with mainly cohesive failures.
- Abraded and wiped with isopropanol | 21.8 MPa | 14.0 MPa | 64% | mostly interfacial at the edges of the overlap
- * Grit blasted, silane primed | 24.9 MPa | 21.9 MPa | 88% | cohesive
```

The abraded and wiped surface failed the requirement, and its failure surfaces showed the pattern expected from the diffusion estimate: a band of bare, interfacial failure round the edges of each overlap, where water had arrived first, and cohesive failure in the drier middle. The grit-blasted and primed surface met the requirement with cohesive failures throughout. The fresh strengths differed by only about 14%; the retained strengths and failure surfaces showed a difference in kind.

Retained strength has its own limits. It says nothing about how the loss would continue beyond the test, and a preparation that retains 88% after 1,000 hours may retain much less after 10,000 if the attack is progressive. Long-term confidence comes from comparing a candidate with a preparation that has a known service record, from the wedge test's crack path, and, where the stakes justify it, from exposing coupons outdoors at the site and testing them over years.

## Creep under sustained load

Most of Plant K's joints carry little sustained load. The window weighs about 0.43 kg: 300 × 200 × 6 mm of polycarbonate at about 1.2 g/cm³. Spread over its bonded flange of 300 × 200 − 260 × 160 = 18,400 mm², its weight produces a shear stress of about 4.2 N ÷ 18,400 mm², about 0.00023 MPa, far below anything an elastic adhesive would creep under. The stiffeners carry only their own weight in service.

Creep matters more for joints that hold a sustained load, such as a bonded hanger or a joint under constant spring preload, and much more when warm. For such joints, a sustained-load test at the highest service temperature, measuring slip over hundreds of hours, is the relevant test, and design stresses are typically a small fraction of the short-term strength. Elastic adhesives in particular are rated for sustained loads far below their breaking strength, and their suppliers state the figure. Where a window or panel is large or overhead, a mechanical retainer that carries the weight while the adhesive seals and locates is a common and sensible arrangement, and it also holds the part if the bond is ever damaged.

## How this applies to a small Australian business

Design durability tests around the mechanisms that threaten your joint. For bonded metals, test the surface with a wedge test or with lap shear coupons aged hot and wet, and compare preparations; do not rely on dry heat alone. Work out the effective service temperature from the hot hours, not the average. Use the Arrhenius relation only for temperature-driven ageing, with an activation energy measured for the mechanism, and keep test temperatures well below the adhesive's glass transition temperature. Seal the edges, because that is where water arrives first and where the load is highest. And keep the aged coupons and their failure surfaces: a labelled box of broken coupons is often the clearest record of why a process was chosen.

## Exercise: a hotter test

To shorten testing, the plant considers 300 hours of dry heat at 90 °C, against a service temperature of 42.5 °C. (a) With Ea = 0.6 eV, what is the acceleration factor? (b) How many service hours does the test represent? (c) Should the plant run it?

**Worked answer.** (a) AF = exp[(0.6 ÷ 8.617 × 10⁻⁵)(1 ÷ 315.65 − 1 ÷ 363.15)] = **17.9**. (b) 300 × 17.9 = **about 5,400 service hours**, about seven months. (c) **No.** At 90 °C the test is within about 5 K of the adhesive's glass transition temperature of about 95 °C, where the polymer softens and ageing may follow a different mechanism, so the factor cannot be trusted. It also says nothing about moisture at the interface. A longer test at a lower temperature, plus hot and wet tests aimed at the interface, would give results the plant could rely on.
