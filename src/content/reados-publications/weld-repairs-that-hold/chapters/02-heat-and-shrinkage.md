---
book: weld-repairs-that-hold
chapterSlug: heat-expansion-and-shrinkage
order: 2
title: "Heat, expansion and shrinkage"
description: "Estimate thermal expansion and restrained stress, and see why heating part of a plate leaves it shorter and stressed once it cools."
draft: true
---

Every instruction in the 1919 Airco booklet that seems fussy about heat makes sense once you see welding as a thermal event. Leave a root opening "to allow for expansion". Preheat the plate between two holes and keep it red hot. Let the heated section cool with the weld "for uniform shrinkage". Reheat the end of a crack after welding. The writers did not have modern residual-stress models, but they had seen plates pull, crack and leak, and they were managing expansion and contraction by hand.

This chapter explains the mechanism with a few simple calculations. They are not predictions of distortion in a real repair, which depends on geometry, restraint and process. They show why a weld leaves a part shorter and stressed, and why the order and spread of heating matter.

## Steel expands when heated

A steel bar heated uniformly and free to move grows in proportion to its length and temperature rise:

**ΔL = α × L × ΔT**

For carbon steel near room temperature, the coefficient of linear expansion α is about 12 × 10⁻⁶ per °C. The value rises somewhat at high temperature, so treat estimates at welding temperatures as indicative.

Take a 200 mm length of plate beside a weld, heated on average 600 °C above its surroundings. Its free expansion would be:

**ΔL = 12 × 10⁻⁶ × 200 × 600 = 1.44 mm**

If that strip were free, it would simply grow 1.44 mm and shrink back by the same amount on cooling, leaving no trace. Welding is not like that, because the hot metal is surrounded by colder, stronger plate that refuses to let it grow.

## Restraint turns expansion into stress

Now imagine the strip completely prevented from expanding. The stress needed to hold it at its original length is:

**σ = E × α × ΔT**

With Young's modulus E of about 200,000 MPa for steel, a temperature rise of only 100 °C gives:

**σ = 200,000 × 12 × 10⁻⁶ × 100 = 240 MPa**

That is comparable to the yield strength of a common structural plate at room temperature. In other words, a fully restrained piece of steel heated by just 100 °C is already pushed towards yield. Near a weld the temperature rise is many hundreds of degrees, and steel's yield strength falls sharply as it heats. The hot metal therefore yields in compression: it cannot expand, so it thickens and upsets locally instead.

## Why the plate ends up shorter

The key is what happens next. On cooling, the metal that was compressed and upset while hot now tries to contract by its full thermal strain. It contracts from a shorter, upset starting length, so it wants to end up shorter than it began. The cold plate around it resists. The weld zone is left in tension, the surrounding plate in balancing compression, and the part as a whole has shrunk along and across the weld.

This is the origin of the forms of distortion that TWI's job knowledge guidance describes: longitudinal and transverse shrinkage, angular distortion when contraction is uneven through the thickness, bowing when the weld sits away from a member's neutral axis, buckling of thin plate under long-range compression, and twisting. A repair weld in a restrained plate is especially prone to cracking, because the plate around it cannot move to relieve the shrinkage.

```figure
type: tree
title: How welding shrinkage shows itself
caption: Each form follows from the same mechanism: heated metal is upset, then contracts as it cools.
- Shrinkage after welding
  - Longitudinal | along the weld
  - Transverse | across the weld
  - *Angular | uneven through the thickness
  - Bowing | weld away from the neutral axis
  - Buckling | thin plate under compression
  - Twisting | unequal corner shear
```

## Reading the 1919 booklet through this lens

The booklet's techniques now fall into place.

- **The root opening.** Its standard butt joint was a 90° vee with a gap of about 3/16 inch, roughly 4.8 mm, at the bottom. The gap let the weld penetrate fully, and it also gave the edges room to close as the joint heated and the plates moved towards each other.
- **Preheating between holes.** When closing a crack between two staybolt holes, the booklet asks for the metal between them to be heated red hot and held there, then allowed to cool with the weld. Heating the surrounding plate makes it expand with the weld zone, so it shrinks with it afterwards instead of resisting, which spreads the contraction rather than concentrating it at the weld.
- **Reheating after welding.** Reheating an area after a weld to "relieve the shrinkage strains" is an early, local and uncontrolled cousin of stress relief. It may have reduced peak stresses. It may also have changed the plate's properties in ways no one measured.

These were reasonable responses to a real mechanism. Modern practice keeps the logic and replaces judgement by eye with qualified procedures, measured temperatures and, where required, controlled post-weld heat treatment.

## The tank case: how much does the crack area want to move?

This is an illustration. In the tank side plate from Chapter 1, the workshop will excavate the 170 mm crack and fill it with weld. The welding supervisor wants a feel for the movement involved before planning restraint.

Suppose the band of plate either side of the weld that gets hot enough to matter is about 200 mm long along the repair, and that its average rise is 600 °C during welding. If it could expand freely it would grow 1.44 mm. It cannot, because the cold plate around it holds it, so most of that strain is taken up by compressive yielding in the hot zone. When it cools, the zone wants to contract by a similar order of magnitude and is held by the surrounding plate, leaving tensile residual stress in and near the weld.

The supervisor does not use the number as a shrinkage prediction. It is used to make two decisions clear: the repair will try to pull the plate together across and along the weld, and the crack ends are where any remaining defect will be pulled open first. Both feed the sequence and preheat plans in later chapters.

```figure
type: bars
title: Thermal strain in context
unit: MPa
max: 260
caption: A fully restrained strip of steel reaches about 240 MPa with only a 100 °C rise; welding heats metal far more than that.
- Restrained stress, 50 °C rise | 120
- *Restrained stress, 100 °C rise | 240
```

## What the simple model leaves out

The calculations above assume a single average temperature, constant properties and complete restraint. Real welds involve steep temperature gradients, properties that change with temperature, partial restraint and phase changes in the steel near the fusion line. Real residual stresses are commonly of the order of the material's yield strength near a weld, and their pattern depends on process, sequence and geometry.

Use the model for direction and order of magnitude. For a repair whose residual stresses or distortion matter, rely on qualified procedures, measured trials, published guidance and, where justified, analysis by a competent engineer.

## Exercise: a shorter heated zone

Repeat the free-expansion estimate for a heated band 80 mm long at an average rise of 500 °C, then calculate the restrained stress for a 50 °C rise.

The free expansion is **12 × 10⁻⁶ × 80 × 500 = 0.48 mm**. The restrained stress for a 50 °C rise is **200,000 × 12 × 10⁻⁶ × 50 = 120 MPa**. Explain why a shorter weld segment, made one at a time, is one of the oldest ways to reduce distortion, and connect it to the booklet's instruction to weld in short steps.
