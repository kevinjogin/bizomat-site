---
book: water-hammer-by-the-numbers
chapterSlug: wave-speed-in-a-pipe
order: 2
title: "Wave speed in a pipe: water, wall and air"
description: "Calculate pressure-wave speed from water's bulk modulus, the pipe wall's stiffness and its restraint, and see how a little entrained air or a plastic pipe changes it."
draft: false
---

Every surge calculation in this book starts with one number: the speed at which a pressure wave runs along the pipe. It sets the size of the instant surge, the pipe period, and which valve closures count as fast. It is also one of the few inputs a designer can estimate well from published properties, provided three effects are included: the water's own compressibility, the stretch of the pipe wall, and any air carried in the water.

This chapter derives the case's wave speed of about 1,343 m/s, compares it with other pipe materials, shows how strongly a small amount of entrained air lowers it, and explains which value to use for which question. It ends with a failure case in which a correct wave speed for one pipe was carried into a calculation for another.

## Water alone

In an infinitely stiff pipe, a pressure wave travels at the speed of sound in the water:

**a₀ = √(K ÷ ρ)**

where K is the bulk modulus and ρ the density. With K = 2.19 GPa and ρ = 998 kg/m³, typical values for water near 20 °C, a₀ is about **1,481 m/s**. The bulk modulus varies by a few per cent across the range of water temperatures found in plant, and more with dissolved salts or other liquids. For other liquids, use their own K and ρ: oils, for example, have bulk moduli well below water's and lower wave speeds.

## Adding the pipe wall

A real pipe stretches when the pressure inside it rises. As the wave front passes, part of the incoming water is accommodated by the pipe swelling rather than by the water compressing. The system as a whole becomes softer, and the wave slows. For a thin-walled pipe of internal diameter D, wall thickness e and elastic modulus E, the wave speed is:

```figure
type: formula
title: Pressure-wave speed in a thin-walled elastic pipe
formula: a = √(K ÷ ρ) ÷ √(1 + (K ÷ E) × (D ÷ e) × c₁)
- K, ρ | bulk modulus and density of the liquid
- E | elastic modulus of the pipe wall
- D, e | internal diameter and wall thickness
- c₁ | restraint factor: 1 for a pipe free to move lengthwise; about 0.91 for steel restrained along its length
step: D ÷ e = 154.1 ÷ 7.1 = 21.70
step: (K ÷ E) × (D ÷ e) × c₁ = (2.19 ÷ 200) × 21.70 × 0.91 = 0.2162
step: a = 1,481.3 ÷ √1.2162 = 1,481.3 ÷ 1.1028
step: a ≈ 1,343 m/s
caption: This is an illustration for the case's steel main, buried and restrained against lengthwise movement. The formula is the one first given by Korteweg and refined for restraint in the references.
```

The restraint factor accounts for how the pipe is held lengthwise. A pipe with expansion joints throughout can lengthen freely as it swells, c₁ = 1. A pipe anchored against lengthwise movement throughout, as a buried welded steel main effectively is, has c₁ = 1 − ν², about 0.91 for steel with Poisson's ratio 0.3. A pipe anchored only at its upstream end has c₁ = 1 − ν ÷ 2, about 0.85. For this pipe the choice moves the answer only from about 1,332 m/s to about 1,351 m/s. For thin, flexible pipes it matters more, and thick-walled pipes need a modified formula given in the references.

### What the formula is saying

The term under the root is a sum of two flexibilities: 1 for the water's own compressibility, and (K ÷ E)(D ÷ e)c₁ for the pipe wall's stretch, expressed relative to the water. For the case, the wall term is 0.216, so of every unit of "give" in the system as the wave passes, about 82 per cent comes from compressing the water and about 18 per cent from swelling the steel. The wave speed falls by the square root of the total, from 1,481 m/s to 1,343 m/s.

Three design consequences follow directly. A larger diameter for the same wall makes the pipe more flexible and slower. A thicker wall makes it stiffer and faster. A material with a lower modulus makes it much slower. None of these changes the surge produced by a given velocity change by much in steel, because the water term dominates; all of them change it a great deal in plastic, where the wall term dominates.

### Linings, encasement and thick walls

Real pipes complicate the thin-wall picture. A cement-mortar lining inside a steel or ductile iron pipe adds a little stiffness. A pipe encased in concrete or tunnelled through rock is held by its surroundings and behaves stiffer than its own wall suggests, approaching the rigid-pipe speed. A thick-walled pipe, where the wall is not small compared with the diameter, needs a modified restraint factor that accounts for the stress varying through the wall; Wylie and Streeter give the expressions. Flexible hoses are at the other extreme: a rubber hose can carry waves at only tens of metres per second, and its properties change with pressure.

The same formula covers other liquids. This is an illustration. A hydraulic oil with K = 1.5 GPa and ρ = 870 kg/m³, both teaching values, has a₀ = √(1.5 × 10⁹ ÷ 870), about 1,313 m/s. In steel tube with D ÷ e = 10, the wall term is (1.5 ÷ 200) × 10 = 0.075, and the wave speed falls only to about 1,266 m/s. Oil hydraulics see water hammer too, usually from fast-acting directional valves, and the same methods apply.

## Comparing pipe materials

The ratio K ÷ E tells most of the story. Steel's modulus is about ninety times water's bulk modulus, so a steel wall barely softens the system. Plastics have moduli comparable to water's, so the wall dominates and the wave speed falls to a few hundred metres a second.

```figure
type: compare
title: Wave speed and instant surge for different pipes at 1.61 m/s
rowhead: Pipe
cols: Teaching inputs | Wave speed | Joukowsky surge
caption: This is an illustration. Plastic moduli depend strongly on temperature and on how fast the load is applied; take values from the pipe maker for real work. The surge column uses the relation in Chapter 3.
- Rigid pipe | none | 1,481 m/s | 243 m
- * Steel, the case | E 200 GPa, D/e 21.7, c₁ 0.91 | 1,343 m/s | 220 m
- Ductile iron | E 170 GPa, D/e 18.75, c₁ 0.91 | 1,341 m/s | 220 m
- PVC | E 3.0 GPa, D/e 21.4, c₁ 1 | 363 m/s | 60 m
- Polyethylene | E 0.9 GPa, D/e 9, c₁ 1 | 310 m/s | 51 m
```

The plastic rows show why plastic mains see much smaller instant surges for the same velocity change. They do not show that plastic mains are immune. Their lower wave speed means longer pipe periods, so more closures count as fast. Plastics are also more sensitive to repeated surges, which can fatigue the pipe well within its static rating, and their moduli fall as temperature rises. Industry guidance from the Plastics Industry Pipe Association of Australia and pipe makers' data cover surge and fatigue for PE and PVC lines.

## A little air, a large change

Water drawn from a dam or a sump often carries entrained air: fine bubbles from vortices at the intake, air drawn through leaking glands, or air released from solution as pressure falls. Air is thousands of times more compressible than water, so even a small fraction by volume softens the mixture dramatically.

For a well-mixed bubbly liquid, Wood's mixture rule gives the combined compressibility as the volume-weighted sum of the parts. Including the pipe wall:

**1 ÷ (ρₘ a²) ≈ (1 − α) ÷ K + α ÷ (n p) + D c₁ ÷ (E e)**

where α is the air fraction by volume, p the absolute pressure, n is 1 for slow, isothermal compression of the gas, and ρₘ the mixture density, very nearly ρ(1 − α). Because the gas term depends on pressure, a given amount of air matters most where pressure is low.

```figure
type: bars
title: Wave speed in the case's steel main with entrained air
unit: m/s
max: 1400
caption: This is an illustration from Wood's mixture rule with isothermal gas and the case's pipe wall. One part per thousand of air at 500 kPa halves the wave speed.
- No air | 1343
- 0.01 per cent air at 500 kPa | 1152
- 0.1 per cent air at 2 MPa | 975
- * 0.1 per cent air at 500 kPa | 627
- 1 per cent air at 500 kPa | 222
```

These figures look alarming, but they cut both ways. A lower wave speed reduces the instant surge, which is why some engineers have regarded entrained air as protective. That is not a safe assumption. Air content varies from day to day and is hard to measure, gas comes out of solution and redissolves during a transient, and air collecting as pockets at high points behaves quite differently from fine bubbles: a pocket compressed by a surge and then expelled through a valve can produce sharp pressure spikes. Chapter 8 covers air valves.

### Air that comes out of solution

Water in contact with air holds dissolved gas, and the amount it can hold falls as pressure falls. When a downsurge drops the pressure sharply, some of that gas comes out as bubbles. It does so quickly but redissolves slowly, so the water after a large low-pressure wave can carry more free gas than before it. Wave speed during the later cycles of a transient is therefore often lower than during the first, and the pressure oscillations are damped faster than friction alone would explain. Simple models with a single wave speed miss this, and it is one reason measured transients rarely repeat the clean square waves of textbook diagrams.

## Which wave speed to use

Because the wave speed affects both the size and the timing of a surge, different questions need different values:

```figure
type: checklist
title: Choosing wave speeds for a surge check
caption: Screen with the range, not a single value. A full surge study runs sensitivity cases for the same reason.
- For maximum pressure | use the highest credible speed: clean water, full restraint, upper-bound modulus
- For timing and pipe period | check both the high and the low ends of the credible range
- For plastic pipes | use moduli for the actual temperature and loading rate, from the pipe maker
- For mixed lines | calculate each material's speed separately; never average them blindly
- x Do not assume entrained air protects the line | air content is variable and pockets cause their own surges
- ? Can the wave speed be measured | on an existing line, a controlled test gives the best value
```

Whatever values are chosen, write them down with their basis: the fluid properties, the pipe modulus and its source, the dimensions, the restraint assumed and the resulting speed. A surge screening that states "a = 1,343 m/s, steel E 200 GPa, D/e 21.7, restrained, clean water" can be checked in a minute. One that states only "a = 1,000 m/s, typical" cannot, and the next engineer will not know whether the number still applies after a pipe is replaced.

## Measuring wave speed on a real line

On an existing pipeline, the wave speed can be measured. Two fast-responding pressure transducers some distance apart record the same transient front, for example from a planned partial valve closure. The time between the front arriving at each gives the speed directly.

This is an illustration. Transducers at chainages 0 m and 600 m on the case's main record a front 0.447 s apart, giving 600 ÷ 0.447, about 1,342 m/s, in agreement with the calculation. A single transducer near a closing valve also works: the pressure oscillation that follows a closure has a period of about 4L ÷ a, here about 2.68 s, from which a can be recovered. Any such test is planned, approved and kept small, with people clear of the line, because its purpose is to create a transient.

## Mixed pipelines and junctions

Pipelines are often repaired or extended in a different material. A wave reaching a change of material or diameter is partly reflected and partly transmitted, just as a stress wave in a bar is at a change of section. For a head wave passing from pipe 1 into pipe 2, the transmitted fraction is 2B₂ ÷ (B₁ + B₂), where B = a ÷ (gA) is the pipe's characteristic impedance.

This is an illustration. Suppose a section of the case's main were replaced with a PE pipe of the same bore. For a wave passing from the steel into the PE, B is proportional to wave speed, so the transmitted head is 2 × 310 ÷ (1,343 + 310), about 0.375 of the incident head, and about 0.625 of it reflects back into the steel with the opposite sign. Junctions like this change the timing and shape of every transient in the line and are one reason mixed lines are hard to screen by hand.

## A failure case: the borrowed wave speed

This is an illustration. A neighbouring site plans a 900 m PE main for a similar duty and asks for a quick check of its proposed 3 s motorised inlet valve. The engineer reuses the screening note from the steel main, including its wave speed of 1,343 m/s and pipe period of 1.34 s, and concludes that a 3 s closure is "more than two pipe periods, so a slow closure".

For the PE line the wave speed is about 310 m/s, and the pipe period is 2 × 900 ÷ 310, about **5.81 s**. A 3 s closure is about half a pipe period: a fast closure. The surge is the full wave value for PE, about 51 m, not a fraction of it.

The error happened to be partly offset, since 51 m is much less than the steel line's 220 m. The second error was in the conclusion: the review accepted the 3 s valve as slow, which would have been wrong for any line with a pipe period above 3 s, and it did not check fatigue of the PE under daily cycling. The error was detected when a second engineer recalculated the wave speed from the PE pipe's own data. The correction was a rule for the design office: wave speed is calculated afresh for every pipe material, diameter, wall and restraint, and the pipe period is recalculated with it.

## Exercise: a thinner steel wall

A replacement main of the same 154.1 mm bore uses a thinner 4.5 mm steel wall, still restrained (c₁ = 0.91). Find the wave speed and the instant surge for a 1.61 m/s velocity change, and comment on whether the thinner wall changes the design conclusion.

**Answer.** D ÷ e = 154.1 ÷ 4.5 ≈ 34.24. Then (2.19 ÷ 200) × 34.24 × 0.91 ≈ 0.3412, and a ≈ 1,481.3 ÷ √1.3412 ≈ 1,481.3 ÷ 1.1581 ≈ **1,279 m/s**.

The instant surge is 1,279 × 1.61 ÷ 9.81, about **210 m**, against about 220 m for the 7.1 mm wall. The thinner wall lowers the surge by only about 5 per cent, while it lowers the wall's pressure capacity roughly in proportion to thickness. The design conclusion is unchanged, and the thinner pipe has less margin, not more.

The pipe period also barely changes, from about 1.34 s to 2 × 900 ÷ 1,279, about 1.41 s. In steel, wall thickness is a strength decision far more than a surge decision. In plastic the same change in D ÷ e would move the wave speed, the surge and the period much further, which is why plastic pressure classes need their own surge check.
