---
book: ductwork-by-the-numbers
chapterSlug: transitions-expansions-and-contractions
order: 7
title: "Transitions, expansions and contractions"
description: "Treat transitions as changes of velocity: sudden and gradual expansions, the Borda–Carnot loss, taper length, contractions and stack diffusers, and an abrupt step at a fan inlet."
draft: false
---

Every change of duct size or shape is a change of velocity. Air that slows down in a larger section gives up velocity pressure, and the question is whether that pressure is recovered as static pressure or lost in turbulence. Air that speeds up in a smaller section takes velocity pressure from static, and the question is whether the acceleration is smooth. The geometry of the transition, its length and its angle, decides both. A well-made transition costs a few pascals; a badly made one, an abrupt step or a steep cone, can cost as much as an elbow and upset the fan it feeds.

This chapter treats transitions for their effect on the air: sudden expansions and the exact loss they cause, gradual expansions and the taper angle that keeps them efficient, contractions, boots and the stack diffuser. Their flat patterns are a sheet metal development problem covered elsewhere; here the concern is what shape to ask for and why. The running case finds that EX-1's main joined the fan's larger inlet through an abrupt step, losing pressure and disturbing the fan.

## Expansion and contraction

When air passes from a smaller section to a larger one, it slows down. Its velocity pressure falls, and in an ideal, loss-free expansion the whole fall would reappear as a rise in static pressure, the **static regain** of Chapter 5. Real expansions recover only part of it, because the slowing air tends to separate from the walls and form eddies, and the eddies dissipate energy.

When air passes from a larger section to a smaller one, it speeds up. Acceleration is stable: the air follows the walls, and a smooth contraction loses very little. A sudden contraction loses more, because the air overshoots into a narrow jet just inside the smaller duct and then expands again to fill it.

The practical rule follows: **contractions forgive, expansions do not.** A contraction can be short and fairly steep; an expansion must be gradual, or it wastes most of the pressure it could have recovered.

## Why expansions separate

In an expansion, the static pressure rises in the direction of flow as the air slows. The air next to the wall, already slowed by friction, has the least momentum to push against that rising pressure, and in a steep expansion it stalls and turns back, so that the main stream detaches from the wall and leaves a region of recirculating eddies beside it. Those eddies are where the energy goes. In a gentle expansion the pressure rises slowly enough that the wall layer keeps moving, the stream stays attached and most of the velocity pressure is recovered. In a contraction the pressure falls in the direction of flow, which pushes the wall layer along rather than against it, and separation does not occur, which is why contractions forgive.

## The sudden expansion

A sudden expansion, a flat step from a small duct to a large one, has an exact loss that follows from momentum, the **Borda–Carnot** relation:

```figure
type: formula
title: Loss at a sudden expansion
formula: Δp = ρ × (v₁ − v₂)² ÷ 2
caption: This is an illustration for EX-1's 250 mm main stepping abruptly into a 315 mm fan inlet at 0.90 m³/s. The relation is exact for a sudden expansion; it does not need a published coefficient.
- v₁ | Velocity in the smaller duct, upstream
- v₂ | Velocity in the larger duct, downstream
step: v₁ = 0.90 ÷ (π × 0.25² ÷ 4) = 18.33 m/s; v₂ = 0.90 ÷ (π × 0.315² ÷ 4) = 11.55 m/s
step: Loss = 0.6 × (18.33 − 11.55)² = 27.6 Pa
step: The ideal recovery would have been 0.6 × (18.33² − 11.55²) = 121.7 Pa of static pressure
```

The loss is the velocity pressure of the *difference* in velocities, not of either velocity. Of the 121.7 Pa of velocity pressure that the slowing air gives up, an abrupt step loses 27.6 Pa and recovers the rest; a good gradual expansion loses much less.

## The error: an abrupt step at the fan

This is an illustration. EX-1's fan has a 315 mm inlet spigot; the main arriving from the collector is 250 mm. The drawing called for a tapered transition. The installer, short of time, fitted a flat ring plate that stepped the duct straight from 250 to 315 mm, and connected it within a few hundred millimetres of an elbow.

The step cost about **28 Pa** by the Borda–Carnot relation, which on its own is modest. The larger cost was to the fan. Fans are rated with air arriving evenly across their inlet; air arriving through an abrupt step just after an elbow enters unevenly and swirling, and the fan delivers less pressure than its curve shows for that flow. The fan maker's installation instructions, like most, called for a length of straight duct and a smooth transition before the inlet for exactly this reason. At commissioning, the fan's measured flow was below its curve's prediction at its measured pressure rise, the signature of a poor inlet.

The fix was the tapered transition the drawing had called for, with the elbow moved back to give a straight run before the fan. The general lesson is that the duct immediately before and after a fan is part of the fan's installation, not merely part of the ductwork, and its geometry should follow the fan maker's instructions.

## Gradual expansions and taper angle

A gradual expansion, a cone between the two sizes, recovers more pressure the more gently it tapers, up to a point. A cone that is too steep behaves almost like a sudden expansion, because the air separates from its walls; a cone that is very long and gentle recovers most of the pressure but adds friction and length. The usual guidance in design references is to keep the **included angle** of an expansion small, roughly 15° or less, with the loss rising quickly as the angle grows beyond that. The exact loss for a given angle and area ratio comes from published coefficients.

The length of a cone with a given half-angle follows from simple trigonometry: **L = (D₂ − D₁) ÷ (2 × tan(half-angle))**.

```figure
type: bars
title: Length of a 250 to 315 mm expansion, by half-angle
unit: mm
max: 400
caption: This is an illustration. A 7.5° half-angle, 15° included, needs about 247 mm; halving the angle roughly doubles the length.
- 5° half-angle | 371
- *7.5° half-angle | 247
- 10° half-angle | 184
- 15° half-angle | 121
- 30° half-angle | 56
```

For EX-1's fan inlet, a 15° included angle needs about 247 mm of cone, which fits easily; the abrupt step saved that length and cost its pressure.

## Contractions

Contractions occur at hoods, at reducers where a main narrows to a fan or a stack, and where a rectangular section returns to round. A contraction's loss is small if its entry edge is rounded or its taper moderate, and larger if the change is a sharp-edged step. Because acceleration is stable, a contraction can be much steeper than an expansion without penalty, and the shortest reasonable contraction is usually a good one. EX-1's mezzanine crossing returns from rectangle to round through a contraction in the flow direction at its downstream end and an expansion at its upstream end; of the two, the expansion is the one that needs care, and Chapter 2's loss estimate assumed both were properly tapered.

## Enlargements at junctions

EX-1's main enlarges at N2, from 140 to 200 mm, and at N3, from 200 to 250 mm, as each branch adds its flow. These are not expansions in the usual sense, because the flow increases with the area: at N2 the velocity goes from 19.49 m/s in the 140 mm duct to 19.10 m/s in the 200 mm duct, almost unchanged. The enlargement's job is to accommodate the extra air without a step that dust can collect behind, and a short taper downstream of the branch entry does that.

If B2 were shut off, though, the 200 mm section would carry only B1's 0.30 m³/s, and the enlargement at N2 would become a true expansion, from 19.49 to 9.55 m/s. Made as an abrupt step, it would lose 0.6 × (19.49 − 9.55)² = about **59 Pa**, and the slower air beyond it would drop dust, as Chapter 3 warned of shutting branches.

## Every change of size in EX-1

Listing every change of size or shape on the system, with the velocities on each side, shows which ones need care.

```figure
type: compare
title: Changes of size and shape in EX-1
cols: From and to | Velocities | Kind | Treatment
caption: This is an illustration at design flows. Only the fan inlet and the crossing's upstream end slow the air substantially; they are the transitions that must be gradual.
- N2 enlargement | 140 to 200 mm | 19.49 to 19.10 m/s | Flow added, little change | Short taper
- N3 enlargement | 200 to 250 mm | 19.10 to 18.33 m/s | Flow added, little change | Short taper
- Crossing, upstream end | 250 round to 160 × 310 | 18.33 to 18.15 m/s | Shape change | Gradual taper
- *Fan inlet | 250 to 315 mm | 18.33 to 11.55 m/s | True expansion | 15° cone, straight run before it
- Fan outlet to stack | 300 × 200 to 250 round | 15.00 to 18.33 m/s | Contraction | Short taper
```

## Eccentric reducers in dust ducts

A reducer or enlarger can be **concentric**, tapering equally all round, or **eccentric**, with one side straight and the other tapered. In a horizontal dust duct, an eccentric fitting with its straight side at the bottom keeps the duct's floor continuous, so that there is no step or pocket for dust to collect in, and the change of section happens across the top. A concentric fitting in the same position leaves a small ledge at the bottom of every enlargement. EX-1's enlargements at N2 and N3 are horizontal and are made eccentric, flat on the bottom; its fan inlet cone, which is vertical, is concentric, because the air there arrives evenly and dust cannot lie on a vertical wall.

## Transitions in the calculation

Each transition belongs in the pressure calculation, with its loss coefficient referred to the right velocity, as Chapter 5 required. The usual omissions are the fan inlet and outlet pieces, which are drawn on the fan supplier's drawing rather than the ductwork's; the transitions at both ends of a shape change such as the mezzanine crossing; and reducers added on site to connect equipment whose spigots turned out to be a different size from the drawing. A walk along the installed system with the calculation sheet, ticking each change of size, is the simplest way to find them before commissioning finds them instead.

## Transitions and dust

In a dust duct, transitions affect where dust goes as well as how much pressure is lost. Downstream of an expansion, the air is slower and, if it separates, has eddies that drop dust in the recirculating zone; a fitting that loses a few pascals can still collect a heap of dust beside it over a few months. At a contraction, the air speeds up and the dust it carries is flung against the converging wall, which wears. Gradual expansions, eccentric fittings with continuous floors and heavier gauge or replaceable wear sections at contractions and elbows are the usual responses, and access doors placed just downstream of expansions make inspection and cleaning easy.

## Boots and shape changes

A **boot** is a fitting that changes a duct's shape as well as its direction or size, such as a round duct turning into a rectangular floor register or hood. Older sheet metal practice sized boots by equal area, so that the velocity stayed the same through the shape change, which is the right basis when velocity matters, as Chapter 2 found. The pressure loss of a boot comes from its turn and its change of section together, and published coefficients for common boot shapes, or the boot maker's data, should be used. The geometric point is to keep any part of the boot that expands gradual, and to put the sharp changes, if any, where the air is accelerating.

## The stack diffuser

Chapter 5 found that EX-1's stack exit throws away a full velocity pressure, about 202 Pa at 18.33 m/s, nearly a tenth of the system's total. A **diffuser**, a gentle expansion at the top of the stack, slows the air before it leaves and recovers part of that pressure. This is an illustration. Expanding the stack top from 250 to 315 mm reduces the exit velocity to 11.55 m/s and its velocity pressure to about **80 Pa**, so an ideal diffuser would save about 122 Pa, and a real one somewhat less after its own loss.

The saving has a cost. A slower exhaust rises less far before the wind bends it over, and an extraction stack's job is to put the exhaust where it will disperse clear of the building, its air intakes and its neighbours. The stack's height, exit velocity and shape are therefore part of the ventilation design and the building's approvals, and a diffuser should be added only if that design allows the lower velocity.

## Exercise: the taper at N2

The main's enlargement at N2, from 140 to 200 mm, is to be made as a cone with a 15° included angle. How long is the cone? How long would it be at 30°? If the enlargement were instead an abrupt step and B2 were shut, carrying only 0.30 m³/s, what would the step lose?

**Worked answer.** The diameter grows by 60 mm, so the radius grows by 30 mm. At a 7.5° half-angle, L = 30 ÷ tan 7.5° = about **228 mm**; at a 15° half-angle, 30° included, L = 30 ÷ tan 15° = about **112 mm**.

With B2 shut, the velocity falls from 19.49 m/s in 140 mm to 9.55 m/s in 200 mm, and an abrupt step would lose 0.6 × (19.49 − 9.55)² = about **59 Pa** by the Borda–Carnot relation. With B2 running, the step's loss would be tiny, because the velocity hardly changes; the cone earns its place in the case where a branch is closed, and in keeping the duct wall smooth so that dust has no step to collect behind.
