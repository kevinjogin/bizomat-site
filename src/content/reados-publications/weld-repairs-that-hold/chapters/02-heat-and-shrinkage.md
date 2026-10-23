---
book: weld-repairs-that-hold
chapterSlug: heat-expansion-and-shrinkage
order: 2
title: "Heat, expansion and shrinkage"
description: "Estimate thermal expansion and restrained stress, and see why heating part of a plate leaves it shorter and stressed once it cools."
draft: false
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

## Heat input: the quantity procedures control

The 1919 welder controlled heat with flame size, torch tip and travel by eye. A modern arc welding procedure controls it with numbers. The basic quantity is **arc energy**, the electrical energy delivered per millimetre of weld:

**arc energy (kJ/mm) = V × I × 60 / (travel speed in mm/min × 1,000)**

where V is the arc voltage and I the current. Standards such as EN 1011-1 then apply a thermal efficiency factor for the process to estimate the **heat input** actually absorbed by the work; for manual metal arc welding that factor is commonly taken as 0.8.

This is an illustration. A root pass at 24 V and 180 A, travelling at 150 mm/min, gives:

**arc energy = 24 × 180 × 60 / (150 × 1,000) ≈ 1.728 kJ/mm**

**heat input ≈ 0.8 × 1.728 ≈ 1.38 kJ/mm**

Doubling the travel speed to 300 mm/min at the same voltage and current halves both values, to about 0.86 kJ/mm of arc energy and 0.69 kJ/mm of heat input. That single number links the welder's technique to the physics of this chapter: more heat per millimetre means a wider hot zone, more upsetting and more shrinkage. Procedures therefore set ranges for voltage, current and travel speed, and the record of a repair should show that the welder stayed within them.

```figure
type: bars
title: Heat input from two travel speeds
unit: kJ/mm
max: 1.6
caption: 24 V and 180 A, with a thermal efficiency factor of 0.8. Faster travel halves the heat put into each millimetre.
- *150 mm/min | 1.38
- 300 mm/min | 0.69
```

Heat input is not simply "less is better". Too little can cause lack of fusion and hard, crack-prone heat-affected zones; too much can coarsen the steel's grain, reduce toughness and increase distortion. The qualified procedure sets the window.

Heat input also interacts with thickness. The same 1.38 kJ/mm cools far more slowly in thin plate, where heat has little metal to flow into, than in thick plate, where the surrounding steel draws it away quickly. Thin plate therefore tends to distort more for a given heat input, while thick plate tends to cool fast enough to form hard structures in the heat-affected zone. That is one reason procedures are qualified for a thickness range, and why a procedure written for 10 mm plate should not simply be reused on 3 mm or 25 mm plate without checking its range.

## Restraint decides whether you get distortion or stress

The same weld shrinkage has to go somewhere. If the part is free to move, the shrinkage shows up as distortion: the plates close up, rotate or bow. If the part is held rigidly, the shrinkage cannot become movement, so it remains as residual stress instead. Restraint does not remove shrinkage; it changes how it appears.

That trade-off matters in repair work:

- **Clamps, strongbacks and fixtures** keep parts in position during welding and reduce distortion. They also raise the residual stress locked into the joint when the restraint is released, and they can increase the risk of cracking during welding.
- **A repair in the middle of a large plate** is surrounded by stiff material on all sides. It is one of the most highly restrained situations in welding, which is why repair welds crack more readily than the original fabrication welds.
- **Releasing restraint** after welding lets some stress relax as distortion, so a part that looked flat in the fixture may move when it comes out.

The booklet's practice of preheating the plate around a weld was an attempt to reduce the effective restraint by making nearby plate move with the weld. Modern practice may use preheat, sequence, controlled restraint and, where a standard calls for it, post-weld heat treatment to manage the same balance.

## Measure distortion as the repair proceeds

Distortion is easier to control than to correct. Before welding, establish references you can measure against: centre-punch marks a known distance apart across the joint, a straightedge position marked on the plate, or dial gauge readings from a fixed point. Measure again after the root pass, after each few passes and after cooling.

This is an illustration. Before welding the tank crack, the workshop marks two punch points 300 mm apart across the groove, at its middle, and records the distance between them. After the root pass, the distance has closed by about 0.3 mm; after the full repair and cooling, by about 0.7 mm. A straightedge laid across the repair shows a slight inward dish of about 1 mm over 300 mm. The supervisor records the readings, judges that neither affects the tank's function, and notes them in the repair record so a later inspection can tell whether the area has moved further.

## Correcting distortion uses the same physics

When distortion must be corrected, two broad approaches exist:

- **Mechanical straightening** with presses, jacks or peening, which deforms the part plastically back towards its intended shape.
- **Flame straightening**, which heats small, carefully chosen spots or lines on the convex side so that, as they cool and shrink, they pull the part back. It is the shrinkage mechanism of this chapter used deliberately.

Both introduce new strain and new residual stresses, and flame straightening reheats the steel. Some steels, particularly quenched and tempered grades, can lose strength or toughness if heated beyond specified limits. Any straightening of a repaired part that matters should follow a procedure, with temperature limits suited to the material, and be recorded.

## Thinking about shrinkage before welding

The practical lessons of this chapter fit into a short list of questions to ask before any repair weld is made:

1. How much weld metal and heat will this repair put into the plate?
2. How restrained is the repair, and where will the shrinkage appear: as movement, as stress, or both?
3. Which features nearby, such as holes, other welds or crack tips, will be most affected by the residual stress?
4. What references will be measured to detect distortion as the work proceeds?
5. If distortion or cracking appears, what will the response be?

Answering those questions before the arc is struck turns shrinkage from a surprise into a planned outcome, which is the same thing the 1919 booklet was trying to do with its preheating and short welding steps.

## Exercise: a shorter heated zone

Repeat the free-expansion estimate for a heated band 80 mm long at an average rise of 500 °C, then calculate the restrained stress for a 50 °C rise.

The free expansion is **12 × 10⁻⁶ × 80 × 500 = 0.48 mm**. The restrained stress for a 50 °C rise is **200,000 × 12 × 10⁻⁶ × 50 = 120 MPa**. Explain why a shorter weld segment, made one at a time, is one of the oldest ways to reduce distortion, and connect it to the booklet's instruction to weld in short steps.
