---
book: thermal-expansion-by-the-numbers
chapterSlug: thermal-stress-when-growth-is-stopped
order: 3
title: "Thermal stress when growth is stopped"
description: "Calculate the stress and force when thermal growth is prevented, see why they do not depend on length and why a restrained pipe buckles, and what guides, anchors and equipment must carry."
draft: false
---

A part that is free to grow when it warms carries no stress from the temperature change. A part that is prevented from growing is squeezed by whatever holds it, as if it had been compressed by exactly the amount it wanted to grow. The stress that results is surprisingly large and, more surprisingly, has nothing to do with the part's length. A short pipe clamped between a pump and a wall is stressed as highly as a long one between two anchors, and pushes just as hard. That one fact explains a great many cracked welds, overloaded pump nozzles, bowed pipes and buckled rails.

This chapter calculates thermal stress and force in HW-60's pipe. It derives the stress for full restraint, shows why length drops out, calculates the force on anchors, shows that a restrained pipe buckles sideways long before that force is reached, calculates the friction at guides, and looks at what happens to equipment connected rigidly to a pipe. The failure case is a pump whose seals kept failing because a short, rigid pipe pushed on its nozzle every time the system warmed up.

## The stress of full restraint

Picture HW-60's pipe fixed rigidly at both ends, so that it cannot lengthen at all. When it warms by ΔT, it wants to grow by α × L × ΔT. The fixings prevent that, so the pipe is compressed by the same amount. Compressing a bar by a strain ε needs a stress of E × ε, where **E** is the material's modulus of elasticity, and the strain here is the growth divided by the length, α × ΔT.

**Thermal stress σ = E × α × ΔT**

The length has cancelled. Whether the restrained pipe is 3 m long or 60 m, the stress is the same.

```figure
type: formula
title: Thermal stress in HW-60's pipe if fully restrained
formula: σ = E × α × ΔT        F = σ × A
caption: This is an illustration for stainless steel with a published modulus of 180 GPa (AISI 302) and α = 17.3 × 10⁻⁶ per °C. The pipe's metal area is π ÷ 4 × (60.3² − 56.3²) ≈ 366.3 mm².
- Modulus E | 180,000 MPa
- Coefficient α | 17.3 × 10⁻⁶ per °C
- Temperature change ΔT | 70 °C
step: σ = 180,000 × 17.3 × 10⁻⁶ × 70 ≈ 218 MPa
step: F = 218 × 366.3 ≈ 79,800 N ≈ 79.8 kN on each anchor
```

A compressive stress of about **218 MPa** is comparable with the yield strength of annealed austenitic stainless steel. The material's data would be checked, but the point is plain: fully restraining a hot stainless pipe stresses it to around the point where it starts to yield, and the anchors would each have to resist about **79.8 kN**, the weight of about eight tonnes. Even a 10 °C change, if fully restrained, produces about **31 MPa** and **11.4 kN**.

## Why length does not matter

The result surprises people because a long pipe grows more than a short one. But a long pipe also needs more compression to squeeze it back by a given amount, in exact proportion. The two effects cancel. What the length does change is how far the pipe would move if released, and therefore how much flexibility is needed to absorb that movement, which is the subject of Chapter 4. A short run between two fixed points is not safer than a long one; it simply has less room to flex.

## A restrained pipe buckles sideways

A long, slender pipe pushed from its ends does not simply carry the compression. Like a column, it buckles sideways once the force exceeds its **buckling load**. For a pipe between guides that hold it in line but let it rotate, the classical Euler buckling load is **π² × E × I ÷ L²**, where L is the distance between guides and I is the pipe's second moment of area, about **155,800 mm⁴** for HW-60's pipe.

```figure
type: compare
title: When a restrained HW-60 pipe would buckle between guides
cols: Euler buckling load | Temperature rise that reaches it
caption: This is an illustration. Full restraint produces about 1.14 kN of force for each degree of warming, so the pipe reaches its buckling load after only a few tens of degrees, far below its 70 °C working rise.
- Guides 3 m apart | about 30.8 kN | about 27 °C
- Guides 6 m apart | about 7.7 kN | about 6.8 °C
- *Working rise | about 79.8 kN if it could not buckle | 70 °C
```

Each degree of restrained warming adds about **1.14 kN** of force. With guides 6 m apart, the pipe reaches its buckling load after less than **7 °C**; with guides 3 m apart, after about 27 °C. Long before the full 70 °C rise, a restrained pipe bows sideways between its guides, scraping, lifting off its supports and loading its branches and fittings unpredictably. Thermal stress in pipes is therefore controlled not by making the anchors strong enough, which would be impractical, but by giving the growth somewhere to go: a loop, a bend or an expansion joint, between anchors that hold the pipe's position at chosen points.

## Anchors, guides and friction

A well-designed pipe run has three kinds of support:

- **Anchors** fix the pipe at chosen points, so that growth is divided into known lengths and directed towards the places designed to absorb it.
- **Guides** let the pipe slide along its length but keep it in line, preventing the sideways bowing described above.
- **Sliding supports** carry the pipe's weight while it moves.

Even with free growth, the anchors carry some force: the friction of the pipe sliding on its supports, and the spring force of the loop or joint that absorbs the movement. Friction is the weight on the supports times a friction coefficient. HW-60's pipe, full of water and insulated, weighs about **6.4 kg/m**, an illustration including the steel, the water and about 1 kg of insulation and jacket. Over the 30 m from an anchor to the loop, that is about **1.88 kN**; with a friction coefficient of 0.3, a teaching value for steel sliding on steel, the friction is about **0.56 kN**. That is less than a hundredth of the restrained force, which is why letting the pipe move is so effective. The guides and sliding supports must actually let it slide, though. A support that has seized, rusted, been painted over, been bent by a forklift, had insulation packed into it or been replaced by a fixed clamp during maintenance turns into an unplanned anchor, and the force it then carries is no longer friction but a share of the full restrained force, applied at a point that was never designed to take it. HW-60's maintenance plan checks each guide for free movement every year, using the pen marks from commissioning described in Chapter 1.

## Partial restraint

Real fixings are rarely perfectly rigid. A pipe clamped to a wall bracket, a bracket bolted to a stud wall, a pump on rubber mounts: each yields a little. With partial restraint, part of the growth happens and part becomes stress, in proportion to how stiff the restraint is compared with the pipe. That is why a rigidly installed pipe can survive for a while without obvious damage: its fixings, brackets and connected equipment are all giving slightly, absorbing the growth in places never meant to move. The damage shows later, as cracked brackets, loosened anchors, distorted equipment or fatigue cracks at welds. Partial restraint does not make an unplanned arrangement safe; it hides where the movement is going.

## Contraction pulls

Everything in this chapter applies in reverse when a part cools below the temperature at which it was fixed. A pipe installed at 15 °C and later drained and left in an unheated area on a winter night at 0 °C tries to shrink by α × L × 15 °C. If its ends are held, the pipe is put in tension, and its anchors are pulled rather than pushed. Tension is often the more dangerous case for welds and threaded joints, which may be weaker in tension than in compression. Systems that can cool below their installation temperature are designed for both directions.

## Long structures

The same physics applies to anything long that changes temperature. A steel crane rail or conveyor frame 40 m long in a building that heats up in summer grows by about **12 × 10⁻⁶ × 40,000 × 30 ≈ 14 mm** for a 30 °C rise. Long steel buildings, concrete slabs, bridges and railway tracks all have expansion joints, sliding bearings or other provisions for it, and when those provisions are blocked, the results are the bowed rails and cracked slabs familiar from hot summers. In a factory, the lesson is to check the movement of every long, continuous steel element, and to make sure that one end of it, at least, is free to move, with slotted holes or a sliding bearing.

## Equipment connected to pipes

Pumps, heat exchangers, tanks and valves have nozzles that were designed to carry only modest loads. A pipe connected rigidly to a nozzle, with its growth unaccounted for, pushes on that nozzle with the force calculated above, or as much of it as the nozzle and its mounting can resist before something moves. A pump nozzle loaded this way distorts the pump casing slightly, misaligning the shaft with its motor and loading its bearings and seals.

Makers of pumps and other equipment state the loads their nozzles can accept. The pipework designer arranges anchors, guides and flexibility so that the growth of the connected pipes stays well within them, usually by putting an anchor close to the equipment and a flexible element between them, so the pipe's growth is directed away from the nozzle.

## Thermal stress inside one part

Thermal stress does not need external restraint. If one part of a component is hotter than another, the hot part wants to grow more than the cool part, and they restrain each other. A thick-walled pipe or vessel heated quickly on the inside has a hot inner surface held back by its cooler outer surface. A weld cools faster at its surface than its core. A glass jar filled with boiling water can crack for this reason. The same formula, E × α × ΔT, gives the order of the stress, with ΔT now the temperature difference within the part. That is one reason pressure equipment has limits on its heating and cooling rates, and why thermal shock, sudden temperature changes, damages brittle materials.

```figure
type: checklist
title: Thermal stress checks for HW-60's pipework
caption: This is an illustration of the design checks. Pressure piping design to AS 4041 includes thermal stress among the checks a competent designer makes.
- Every straight run between anchors has a loop, bend or joint to absorb its growth | Chapter 4
- Guides keep the pipe in line between anchors | spacing chosen against buckling
- Anchors designed for friction plus the loop's spring force | not for full restraint
- Pump and exchanger nozzles protected by an anchor and a flexible element | within makers' nozzle loads
- Branch connections near anchors checked for the main pipe's movement | a stiff branch can crack
- x Pipe fixed rigidly between two pieces of equipment | the failure case
```

## A failure case: the pump that ate its seals

This is an illustration. Before HW-60's present layout, the circulating pump sat about **3 m** from the plant room wall, connected by a straight, rigid stainless pipe clamped firmly to the wall at one end and bolted to the pump's outlet flange at the other. The pump's mechanical seal failed three times in two years, each time after a few months.

A maintenance engineer, reviewing the history, noticed the seal failures followed periods of frequent start-up from cold. The 3 m pipe wanted to grow about **3.6 mm** each time the system warmed from 15 °C to 85 °C. Held at the wall, it pushed that growth into the pump, with a force that could have reached tens of kilonewtons had the pump's mounting not moved first. A dial indicator on the pump's shaft coupling, read as the system warmed, showed the motor and pump shafts moving out of alignment by several tenths of a millimetre.

The detection came from linking a repeating failure to temperature cycles, then measuring the misalignment as the system warmed. The correction was to fit a flexible connector between the pipe and the pump, add an anchor at the wall end and a guide between, so the pipe's growth was taken by the connector, not the pump. The seal has not failed since. The business's piping checklist now includes the line "no rigid pipe between two fixed points without a way for it to grow".

## How this applies to a small Australian business

Never fix a pipe, rail, bar or frame rigidly at two points if it will change temperature, unless it has been checked. Calculate the restrained stress as E × α × ΔT and the force as that stress times the metal area; it does not depend on length, and it is usually very large. Expect a restrained slender member to buckle sideways long before that force is reached. Give growth somewhere to go, with anchors at chosen points, guides between them, and loops, bends or joints to absorb the movement. Protect pump and equipment nozzles with anchors and flexible connections, within the makers' stated loads. And look for thermal cycles behind repeated failures of seals, welds and fittings.

## Exercise: a carbon steel line

A carbon steel pipe with a metal area of **366.3 mm²** is fixed rigidly between two anchors and warmed by **40 °C**. Using E = 200 GPa and α = 12 × 10⁻⁶ per °C, what stress and anchor force result? How does the stress compare with the stainless pipe over the same temperature change?

**Worked answer.** The stress is **200,000 × 12 × 10⁻⁶ × 40 = 96 MPa**, and the force **96 × 366.3 ≈ 35,200 N**, about **35.2 kN**. For stainless steel over the same 40 °C, the stress would be **180,000 × 17.3 × 10⁻⁶ × 40 ≈ 125 MPa**, about 30% higher, because stainless steel's larger coefficient outweighs its slightly lower modulus. Both are far more than anchors, nozzles or slender pipes are normally designed to resist.
