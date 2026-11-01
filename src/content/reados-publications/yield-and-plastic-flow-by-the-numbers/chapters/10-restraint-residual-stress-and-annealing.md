---
book: yield-and-plastic-flow-by-the-numbers
chapterSlug: restraint-residual-stress-and-annealing
order: 10
title: "Restraint, residual stress and annealing"
description: "How restrained thermal strain makes stress, why welds always leave yield-level residual stress, how a heated bar can buckle, and how stress relief and annealing undo plastic flow."
draft: false
---

A bar that is free to grow when it is heated carries no stress. Hold its ends and the same heating makes a stress that rises in proportion to the temperature, and for steel it reaches yield after a rise of only about 150 K. That simple fact explains why every weld leaves residual stress, why parts move when they are machined, and why a bar clamped between two cooler supports can bow sideways on a warm day.

This chapter puts numbers on thermal stress and its limits, checks a tie bar on the HC-63's test bench that did bow, and ends with the heat treatments that let a metal relax the stresses and work hardening that plastic flow has left in it.

## Restrained thermal strain

A steel bar heated by ΔT grows by a strain α ΔT, where α is its coefficient of thermal expansion, about 11.5 to 12 microstrain per kelvin for carbon steels. If its ends are held so that it cannot grow, the restraint must compress it by the same strain, and Hooke's law gives the stress.

```figure
type: formula
title: Stress from restrained thermal expansion
formula: σ = E α ΔT × (degree of restraint)
formula: temperature change to yield: ΔTy = Sy ÷ (E α)
caption: E is the elastic modulus and α the expansion coefficient. A fully restrained bar heated by ΔT is compressed; one cooled is pulled. Partial restraint, from supports that themselves move or flex, scales the stress down.
- α | coefficient of thermal expansion, per K
- ΔT | temperature change
- ΔTy | temperature change that brings a fully restrained bar to yield
```

The [restrained thermal stress](/tools/thermal-stress/) tool returns the free expansion strain, the restrained stress, compressive for heating and tensile for cooling, the force on the restraints and the safety factor against yield, from the modulus, expansion coefficient, temperature change, degree of restraint, area and yield strength. It notes that slender members in compression must be checked for buckling separately.

For a grade 350 steel, with E = 200 GPa, α = 12 microstrain per K and Sy = 350 MPa, the temperature change to yield is 350 ÷ (200,000 × 12 × 10⁻⁶) = 146 K. A fully restrained steel member yields if its temperature differs from its restraints' by more than about 150 K.

```figure
type: compare
title: Fully restrained grade 350 steel at four temperature changes, in the thermal stress tool
cols: Restrained stress, MPa | Safety factor against yield | What it means
rowhead: Temperature change
- 100 K | 240 | 1.46 | elastic
- * 146 K | 350 | 1.00 | just at yield
- 300 K | 720 | 0.49 | would be twice yield: the steel yields
- 600 K, a weld bead cooling | 1,440 | 0.24 | would be four times yield: the steel yields heavily
caption: This is an illustration. E = 200 GPa, α = 12 microstrain per K, 100% restraint. Above about 146 K the elastic stress is fictitious: the metal yields, and the stress stops at about the yield strength.
```

## Why every weld leaves residual stress

A weld bead is laid at the melting temperature and cools inside a plate that is mostly cold. As it cools it tries to shrink, by roughly 1,500 K of thermal strain from solidification to room temperature, and the cold plate around it holds it. The table above shows that any restrained cooling of more than about 150 K takes the metal to yield. The weld and the metal beside it therefore yield in tension as they cool, and they end up holding a residual tensile stress close to the yield strength along the weld, balanced by compression in the plate further away.

Residual stresses of this kind are in every weld, every flame-cut edge and every quenched part, and in cold-formed parts as Chapters 7 and 9 described. They do not show on a drawing or in a static strength calculation, because they balance themselves within the part. They show in four ways:

- **Distortion**, when the part is welded or later machined, because removing stressed material lets the rest move;
- **Fatigue**, because a tensile residual stress acts as a mean stress at the weld toe;
- **Brittle fracture and stress corrosion cracking**, which need a tensile stress that residual stress can supply on its own;
- **Buckling and instability** of thin welded panels and shells.

The HC-63's rear end cap is welded to the barrel. The weld's residual stresses pull the bore slightly out of round near the weld, so the barrel is honed after welding, not before, and the hone's last pass removes that distortion.

## The test bench tie bars

The HC-63 test bench has two heavy end blocks tied together by four 25 mm steel bars, 1,200 mm long between their nuts, which carry the frame's loads and hold the end blocks square. The bench also has an oil heater, so that cylinders can be tested at their operating temperature of about 65 °C. On a long run of hot tests, the bars, which run close to the hot oil tank, warm by about 45 K more than the massive end blocks. This is an illustration.

The [restrained bar heating check](/tools/restrained-bar-thermal-check/) tool takes a round bar held at both ends, its diameter and length between restraints, an effective length factor, the modulus, expansion coefficient, temperature rise, degree of restraint, yield strength and a required factor. It returns the thermal stress and the force on the restraints, the yield safety factor, the bar's slenderness and buckling load by Euler or Johnson, the buckling safety factor against the thermal force, and the temperature rises at which yielding and buckling would begin.

```figure
type: steps
title: A test bench tie bar in the restrained bar heating check tool
caption: This is an illustration. 25 mm bar, 1,200 mm between restraints, effective length factor 0.5 for ends held by nuts against heavy blocks, E = 205 GPa, α = 11.5 microstrain per K, 45 K rise, full restraint, Sy = 350 MPa, required factor 1.5.
- Thermal stress and force | 106.1 MPa compressive; 52.1 kN on the end blocks
- Yield safety factor | 3.30
- Slenderness | 0.5 × 1,200 ÷ 6.25 = 96, below the Johnson–Euler transition of 107.5
- * Buckling load (Johnson) | 103.3 kN: buckling safety factor 1.98
- Temperature rise at buckling and at yield | 89.3 K and 148.5 K
- Result | BAR ADEQUATE
```

The bar is far from yielding, but the comparison that matters for a slender bar is with buckling. Its buckling load, 103.3 kN, is twice the 52.1 kN thermal force, and it would buckle at a temperature rise of 89.3 K, well before it yielded at 148.5 K. For slender members, restraint of thermal expansion is a buckling problem first.

## The error: the replacement bar

One of the tie bars was damaged when a cylinder was dropped on the bench, and the fitter replaced it with a 20 mm bar from stock, because no 25 mm bar of the right length was available that day. The bench was re-squared and used for cold tests without trouble.

A week later, after an afternoon of hot tests, the technician noticed the new bar visibly bowed between the end blocks. It straightened again as the bench cooled overnight. The engineer who looked into it ran the tool for the 20 mm bar.

```figure
type: compare
title: The tie bar at 25 mm and at 20 mm, in the restrained bar heating check tool
cols: Slenderness and mode | Thermal force, kN | Buckling load, kN | Buckling safety factor | Rise at buckling, K
rowhead: Bar
- * 25 mm, as designed | 96, Johnson | 52.1 | 103.3 | 1.98 | 89.3
- 20 mm, the replacement | 120, Euler | 33.3 | 44.1 | 1.32 | 59.6
caption: This is an illustration. Same length, end conditions and 45 K rise. The thermal stress, 106.1 MPa, is the same for both bars because it does not depend on the area; the buckling load falls much faster than the force, with the fourth power of the diameter. BAR NOT ADEQUATE for the 20 mm bar.
```

The thermal stress is the same in both bars, because it depends only on the temperature change and the restraint. The force falls with the area, as the square of the diameter, but the buckling load falls with the second moment of area, as the fourth power. The thinner bar's buckling safety factor fell to 1.32, below the required 1.5, and its buckling temperature rise to 59.6 K. On a hot afternoon, with some extra heat from the oil tank and a little initial crookedness, it bowed elastically.

The bar was replaced with a 25 mm bar the next morning, and the bench's maintenance instructions now list the tie bar size as a critical dimension. The episode is also a reminder that restraint is not always obvious: nobody had thought of the tie bars as heated members until one moved.

## Restraint from inside the part

A part does not need external supports to restrain itself. When one region is hotter than another, the hot region cannot grow freely because the cold region holds it, and the two push and pull on each other. A thick tube with hot oil inside and cool air outside is an example. For a linear temperature difference ΔT across the wall of a long tube, the largest thermal stress at the surfaces is about E α ΔT ÷ [2 (1 − ν)].

For the HC-63 barrel at start-up on a cold morning, with oil entering at 65 °C, the difference across the 6.5 mm wall is only a few kelvin, because steel conducts heat quickly through so thin a wall: at 5 K, the stress is 205,000 × 11.5 × 10⁻⁶ × 5 ÷ (2 × 0.71) = 8.3 MPa, negligible beside the pressure stresses. Thicker parts, faster heating and quenching are another matter. A difference of 40 K through a heavy section gives about 66 MPa, and the far larger differences during quenching are what make quench cracks and distortion. Every process that heats or cools a part unevenly is, in effect, a restrained thermal strain problem.

## Measuring residual stress

Residual stress cannot be seen and can only be inferred by disturbing it. The common methods each release some of it and measure how the part responds.

- **Hole drilling.** A small rosette of strain gauges is bonded on the surface, a hole about 2 mm across is drilled in its centre, and the gauges record the strain that the released stress produces. It measures stresses in the first millimetre or so, at a chosen point, and is widely used on welds.
- **X-ray diffraction.** The spacing of the crystal planes, measured by X-rays, changes with elastic strain, so the stress in a very thin surface layer can be found without damage. It suits shot-peened and machined surfaces.
- **Sectioning.** Cutting a part and measuring how it springs, or how much a cut surface deforms, gives the stresses that were holding it together. It destroys the part but can map the stress through a whole section.

The HC-63 builder has never needed to measure residual stress in production. Its checklist names hole drilling as the method it would use first if fatigue cracking were ever found at the barrel's end-cap weld.

## Other ways of relaxing stress

Heat is the most reliable way to relax residual stress, but not the only one. A single overload that yields the most highly stressed regions, such as a hydrostatic overpressure test of a welded vessel, redistributes residual stress, reducing peaks at the weld while leaving the rest of the structure elastic: the same physics as autofrettage in Chapter 6, used deliberately and under control. Vibratory stress relief, which shakes a fabrication at or near its resonance, is used for dimensional stability before machining, though its effect on the stress levels themselves is less certain than heat treatment's. Neither replaces a code-required post-weld heat treatment where one applies.

## Stress relief and annealing

Residual stress and work hardening are stored in a metal as dislocations and elastic strain. Heating gives the atoms the mobility to release them, in three overlapping stages.

```figure
type: timeline
title: What heating does to a cold-worked or welded steel
caption: Temperatures are indicative for carbon steels and depend on the steel, the amount of prior strain and the time at temperature. The supplier's or the applicable code's procedure governs any real heat treatment.
- Stress relief, typically about 550 to 650 °C | the yield strength falls with temperature, so residual stresses above the hot yield strength relax by local yielding and creep; dislocations rearrange; strength changes little
- * Recovery | dislocations annihilate and form low-energy arrays; residual stress falls further; hardness falls slightly
- Recrystallisation, at higher temperatures for cold-worked steel | new, strain-free grains form and replace the worked ones; strength and hardness fall to the annealed level; ductility returns
- Grain growth, if held too hot or too long | the new grains grow, lowering yield strength and toughness (Chapter 4)
```

Stress relief works because the yield strength falls as the steel heats. At the stress relieving temperature, the residual stresses in a weld can be no larger than the steel's yield strength at that temperature, a fraction of its room-temperature value, and during the hold, creep relaxes them further. When the part cools slowly and evenly, it keeps the lower residual stress. Cooling quickly or unevenly would make new thermal stresses, so the cooling rate is part of every stress-relief procedure.

Annealing goes further. Heating a cold-worked steel through recrystallisation replaces its worked grains with new ones, so it regains its original ductility and loses its work hardening. Fabricators use it between heavy forming steps, as the tube drawers of Chapter 3 do between passes. It must be controlled: too hot or too long, and the grains grow, as in the coarse heat of Chapter 4. A grain size check after a new annealing procedure, with the [ASTM grain size number](/tools/grain-size/) tool to convert the counts, is cheap insurance.

```figure
type: checklist
title: Thermal stress and heat treatment checks on the HC-63 and its bench
caption: This is an illustration. The builder's checklist for anything heated, welded, restrained or heat treated.
- x Restrained members checked for both yield and buckling under their temperature range
- x Tie bar size listed as a critical dimension on the bench
- x Barrel honed after the end-cap weld, not before
- x Stress relief and anneal procedures from the steel supplier or code, with cooling rates
- x Grain size checked after any new annealing procedure
- ? Residual stress measured on a welded barrel if fatigue cracking is ever found at the weld
```

## Closing the loop

The HC-63 has now been followed from the crystal to the test bench. Its rod bar was chosen and tested for yield, its barrel cold drawn, stress relieved and proved, its brackets bent, its lines bent, its thread rolled and its test bench's bars checked against their own heating. In every case the same few ideas did the work: metals yield by the movement of dislocations under shear; they harden as they flow; the yield strength is a limit for what must stay elastic and a tool for what must be formed; and whatever plastic flow happens, it leaves the metal stronger, less ductile and stressed until heat lets it relax. Under the model WHS laws, the builder's duty is to make sure its products and its test equipment are without risks to health and safety so far as is reasonably practicable; understanding when and how its metals yield is a large part of discharging it.

## Exercise: partial restraint

The bench's end blocks are not perfectly rigid; measurements show they let the tie bars grow by about 40% of their free expansion, so the restraint is about 60%. Using the 25 mm bar's figures (1,200 mm, K = 0.5, E = 205 GPa, α = 11.5 microstrain per K, Sy = 350 MPa), find the thermal stress, the force, the buckling safety factor and the temperature rise at buckling for a 45 K rise.

**Worked answer.** The thermal stress is 205,000 × 11.5 × 10⁻⁶ × 45 × 0.6 = 63.7 MPa, and the force on the 490.9 mm² bar is 31.3 kN. The buckling load is unchanged at 103.3 kN, because it depends on the bar, not on the heating, so the buckling safety factor is 103.3 ÷ 31.3 = 3.31. The temperature rise at buckling is the buckling stress, 210.5 MPa, divided by E α times the restraint: 210.5 ÷ (205,000 × 11.5 × 10⁻⁶ × 0.6) = 148.8 K.

Partial restraint helps a great deal: it lowers the force in proportion. But the degree of restraint depends on the stiffness of everything the bar is fixed to, and it is rarely known well. The builder's check uses full restraint unless the restraint has been measured, as it was here, and records which assumption was made.
