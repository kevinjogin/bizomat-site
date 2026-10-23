---
title: "Vectors and resolving forces: components, equilibrium, moments, sling angles and slopes"
description: "How to break forces into components, find resultants, apply equilibrium and moments, and use them for lifting slings, ramps, brackets and guy wires, with the checks that keep loads safe."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - operations
  - quality
author: "KEVOS"
featured: false
draft: false
---

Forces have direction as well as size. A load hanging from a two-leg sling pulls on each leg along the leg's line, not straight down. A trolley on a ramp is pulled down the slope by only part of its weight. A bracket carrying a load at a distance from its fixing feels a turning effect as well as a straight pull. A guy wire holding up a mast carries a tension much larger than the sideways force it resists. Understanding these effects requires treating forces as **vectors**, quantities with both magnitude and direction, and breaking them into components that can be added, balanced and checked.

The mathematics is a direct application of right-angle trigonometry, but its consequences are practical and sometimes surprising. Wide sling angles can double the tension in each leg. Small slopes can make heavy trolleys hard to control. A modest force applied far from a bolt can produce a large moment that overloads it. Many lifting and structural incidents trace back to forces that were larger than people expected because their direction was ignored.

This article explains vectors and their components, finding resultants, the conditions for equilibrium, moments, free-body diagrams and practical applications to lifting slings, ramps, friction, brackets and guy wires. It is general information; lifting operations and structures must be planned and designed by competent people using the relevant standards and manufacturers' ratings.

## Scalars and vectors

A **scalar** has size only: mass, temperature, time, energy. A **vector** has size and direction: force, velocity, acceleration, displacement. Vectors are drawn as arrows, with length proportional to magnitude and direction showing the line of action. Two forces of 10 kN each add to 20 kN only if they act in the same direction; at right angles, they add to about 14.1 kN; in opposite directions, they cancel.

## Mass and weight

Mass, in kilograms, is the amount of matter. Weight is the force gravity exerts on that mass, in newtons:

weight = mass × g

where g is about 9.81 m/s². A 2,000 kg load weighs about 19,620 N, or 19.6 kN. Lifting equipment is often rated in kilograms or tonnes for convenience, but force calculations should use newtons consistently.

## Resolving a force into components

A force F acting at an angle θ to the horizontal can be replaced by two perpendicular components:

- horizontal component: F × cos θ
- vertical component: F × sin θ

A 500 N pull at 35° above horizontal has a horizontal component of about 410 N and a vertical component of about 287 N. Resolving forces into components along convenient axes is the key step in almost every force problem.

## Finding the resultant

To add several forces, resolve each into components, add all the horizontal components and all the vertical components separately, then combine the totals using Pythagoras:

resultant = √(ΣFx² + ΣFy²)

and find its direction with tan θ = ΣFy ÷ ΣFx. Two forces of 300 N horizontally and 400 N vertically give a resultant of 500 N at about 53° above horizontal.

```figure
type: svg
title: Adding two forces
alt: A 300 newton horizontal force and a 400 newton vertical force drawn as arrows from the same point combine into a 500 newton resultant at about 53 degrees above horizontal.
caption: √(300² + 400²) = 500 N, at tan⁻¹(400 ÷ 300) ≈ 53° above horizontal.
viewbox: 0 0 400 260
body:
<path class="ln" d="M60 220H185"/>
<path class="ah" d="M183 212L199 220L183 228Z"/>
<path class="ln" d="M60 220V54"/>
<path class="ah" d="M52 56L60 40L68 56Z"/>
<path class="lf dsh" d="M60 40H195V220"/>
<path class="la draw" d="M60 220L186 52"/>
<path class="ah" d="M180 50L195 40L192 58Z"/>
<text class="tx" x="128" y="244" text-anchor="middle">300 N</text>
<text class="tx" x="14" y="134">400 N</text>
<text class="txb" x="140" y="120">500 N</text>
<text class="tx txs" x="94" y="212">53°</text>
```

## Equilibrium

An object that is stationary, or moving at constant velocity, is in **equilibrium**. All forces on it balance:

- the sum of horizontal forces is zero;
- the sum of vertical forces is zero; and
- the sum of moments about any point is zero.

These three equations let unknown forces, such as reactions at supports or tensions in cables, be calculated from known loads.

## Free-body diagrams

A **free-body diagram** isolates one object and shows every force acting on it: weights, applied loads, support reactions, cable tensions and friction, each with its direction. Drawing one before calculating is the most effective way to avoid missing a force or getting a direction wrong. Many errors in practice come from forgetting a reaction, a friction force or the weight of the object itself.

## Moments

A force acting at a distance from a point tends to rotate an object about that point. The **moment** is:

moment = force × perpendicular distance from the point to the force's line of action

measured in newton metres. A 200 N force applied 0.5 m from a bolt produces a moment of 100 N·m. Moments explain levers, spanners, torque wrenches, overturning of tall objects and the loads on brackets fixed to walls. In equilibrium, clockwise and anticlockwise moments about any point balance.

## Lifting slings and sling angles

When a load is lifted with a two-leg sling, each leg carries part of the weight along its own direction. If each leg makes an angle θ with the vertical, the tension in each leg is:

tension = weight ÷ (2 × cos θ)

For a 2,000 kg load (19.6 kN):

- with legs at 30° to the vertical (60° between them), each leg carries about 11.3 kN;
- at 45° to the vertical (90° between them), each leg carries about 13.9 kN; and
- at 60° to the vertical (120° between them), each leg carries about 19.6 kN, the full weight of the load.

```figure
type: bars
title: Leg tension lifting a 2,000 kg load on two legs
unit: kN
max: 20
caption: Tension = weight ÷ (2 × cos θ); wide sling angles multiply the load in each leg.
- *30° to the vertical | 11.3
- 45° to the vertical | 13.9
- 60° to the vertical | 19.6 | the full weight of the load
```

As the angle between the legs widens, leg tensions rise sharply, and the horizontal components also squeeze the load and pull inward on the lifting points. Sling manufacturers and lifting standards provide working load limits that reduce with angle, and many limit the included angle used in practice. The [before you buy big equipment](/reados/collections/suppliers-contractors-and-government-work/planning-the-path-from-supplier-to-installation/) article covers planning lifts for large items.

Unequal leg lengths or an off-centre centre of gravity load one leg more than the other. In the worst case, one leg of a two-leg sling may carry most of the load.

## Slopes and inclined planes

An object on a slope of angle θ has its weight resolved into two components:

- along the slope: weight × sin θ, which tends to make it slide or roll down;
- perpendicular to the slope: weight × cos θ, which presses it onto the surface.

A 300 kg trolley on a ramp of 1:12, about 4.8°, has a component of about 244 N acting down the slope. With rolling resistance equivalent to a coefficient of about 0.02, a further 59 N or so is needed, so pushing it up the ramp takes a force of roughly 300 N, and stopping it from running down needs nearly 190 N of restraint. Even gentle slopes can make heavy trolleys hard to control, which is why ramps for manual handling are kept shallow and trolleys may need brakes.

## Friction

Friction resists sliding between surfaces. A simple model is:

friction force ≤ μ × normal force

where μ is the coefficient of friction, which depends on the materials, surface condition and lubrication. Friction holds loads on slopes, allows belts and clutches to transmit torque and lets bolted joints carry shear by clamping. It also wastes energy and causes wear. Friction coefficients vary widely and change with contamination, so designs that depend on friction should include margins.

## Brackets, guy wires and props

Brackets fixed to walls carry both a direct load and a moment, which tends to pull the top fixing out and push the bottom of the bracket into the wall. Calculating the moment and the resulting forces on each fixing shows whether anchors are adequate. The [bolted joints that stay tight](/reados/collections/machine-elements-and-mechanical-design/bolted-joints-that-stay-tight/) article explains how fasteners carry tension and shear.

Guy wires and props resolve sideways loads into tension or compression along their lines. A guy wire at a shallow angle to the ground must carry a tension much larger than the horizontal force it resists, because only its horizontal component does the useful work. Steeper angles reduce tension but take up more ground area.

## Overturning and stability

Tall objects tip over when the moment trying to overturn them exceeds the moment holding them down. A cabinet pushed at its top edge, a stack of pallets on a forklift braking hard, or a machine on a slope will tip about the edge of its base if the line of action of the resultant force passes outside that base. The restoring moment is the object's weight multiplied by the horizontal distance from its centre of gravity to the tipping edge. Low centres of gravity and wide bases resist overturning, which is why tall storage units are fixed to walls, forklift loads are carried low and mobile equipment has outriggers. Comparing overturning and restoring moments, with a safety margin, is a simple check for many stability problems.

## Dynamic loads

Forces calculated for loads at rest can be exceeded considerably when loads move. A load that is jerked off the ground, dropped a short distance onto a sling, or stopped suddenly produces forces larger than its weight, sometimes much larger. Lifting equipment ratings include margins for normal dynamic effects, but snatch loading, swinging loads and impacts can still exceed them. Smooth starts and stops, avoiding slack in slings before lifting and controlling swing reduce dynamic forces. Machines with reciprocating or rotating parts also apply repeated dynamic loads to their supports, which must be designed for fatigue as well as strength.

## Wind on loads and structures

Wind applies a force roughly proportional to the exposed area and to the square of wind speed. A large, light panel lifted by a crane can act like a sail, swinging and spinning, and wind limits are part of every lifting plan for such loads. Signs, shade structures, solar panels and temporary fencing must also be designed or anchored for wind, and the force on their fixings includes both direct pull and moment. Because the force rises with the square of wind speed, a gust twice as fast as the design breeze produces about four times the load.

## Velocities and other vectors

The same methods apply to velocities, accelerations and displacements. A conveyor moving at one speed while a product is pushed across it at another produces a resultant velocity at an angle. Wind acting on a crane load adds a horizontal force that, combined with the weight, swings the load. Resolving vectors into components keeps these problems manageable.

## A worked example

This is an illustrative example. The figures are hypothetical, and real lifts must follow the lifting plan and equipment ratings.

A workshop must lift a 2,000 kg machine with a two-leg chain sling from an overhead crane. The lifting points are 1.6 m apart, and the rigger initially plans legs about 1.1 m long, giving an angle to the vertical of roughly 45°. Each leg would then carry about 13.9 kN, about 70% of the load's weight, and the inward squeeze on the lifting points would be considerable.

The supervisor asks for longer legs, about 1.6 m, which reduces the angle to about 30° from vertical and the leg tension to about 11.3 kN. The rigger checks the sling's tag for its rated working load limit at that angle, confirms the machine's centre of gravity sits between the lifting points and uses the machine maker's designated lifting points. A trial lift a few centimetres off the floor confirms the load hangs level before it is moved.

## How this applies to a small Australian business

- **Draw free-body diagrams** before calculating forces.
- **Use newtons for forces** and convert masses with g.
- **Keep sling angles narrow** and check ratings at the angle used.
- **Check slopes for manual handling** and fit trolley brakes where needed.
- **Calculate moments on brackets and fixings**, not just direct loads.
- **Compare overturning and restoring moments** for tall or top-heavy items.
- **Avoid snatch loading** by taking up slack before lifting.
- **Use competent riggers and engineers** for lifts and structures.

## Common mistakes

- **Assuming each sling leg carries half the load** regardless of angle.
- **Forgetting the object's own weight** or a support reaction.
- **Ignoring moments** when checking brackets and anchors.
- **Mixing kilograms and newtons.**
- **Underestimating forces on gentle slopes.**
- **Ignoring wind on large, light loads** during lifts.
- **Treating static calculations as enough** when loads move or vibrate.
- **Relying on friction** without allowing for contamination.

## Frequently asked questions

**Why do wide sling angles increase tension so much?** Because only the vertical component of each leg's tension supports the load. As the legs spread, the vertical component becomes a smaller fraction of the tension, so the tension must rise.

**What is the difference between a moment and torque?** Both are turning effects measured in newton metres. Torque usually refers to a twisting moment about a shaft's axis; moment is the general term.

**How accurate are friction coefficients from tables?** Only approximate. Real values depend on surface condition, contamination, lubrication and speed, so tests or conservative values should be used for safety-critical designs.

**Why does a guy wire need so much tension?** Only the horizontal component of its tension resists the sideways load. At a shallow angle to the ground, that component is a small fraction of the tension, so the wire must be pulled very tight to provide it.

## Questions to ask

- Do our lifting plans state sling angles and leg tensions?
- Are lifting points on our equipment marked and rated?
- Which ramps on our site are too steep for the trolleys used on them?
- Have the fixings on our wall-mounted brackets and equipment been checked for moments?
- Who reviews force calculations for temporary works and lifts?

## Bringing it together

Forces are vectors, and their direction matters as much as their size. Resolving forces into components, adding them to find resultants and applying the three conditions of equilibrium solve most practical force problems. Moments explain levers, brackets and overturning. Sling tensions rise sharply with angle, slopes resolve weight into sliding and pressing components, friction depends on surfaces and guy wires carry tensions larger than the loads they resist. Free-body diagrams, consistent units and competent review keep loads and people safe.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. This article is general information and does not replace lifting plans, equipment ratings or engineering advice.*
