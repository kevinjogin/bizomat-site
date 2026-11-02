---
book: pneumatics-by-the-numbers
chapterSlug: size-the-cylinder-for-force-and-side-load
order: 2
title: "Size the cylinder for force and side load"
description: "Size a pneumatic cylinder from friction and acceleration loads at the lowest supply pressure, keep a sensible load ratio, check retract force and buckling, and guide side loads."
draft: false
---

A cylinder that is too small is slow, unreliable at low pressure and quick to wear. A cylinder that is too large costs more, uses more air on every stroke, hits harder at the end of its travel and needs bigger valves and tubing to move quickly. Both errors are common because cylinder size is usually chosen by eye. The calculation that replaces the guess is short: work out the load, compare it with the force available at the lowest pressure the machine will see, keep a margin for speed, and then check the things a bore size alone does not cover, such as side loads on the rod.

This chapter sizes the reject pusher. It estimates the friction and acceleration loads, converts pressure and piston area into force, applies a load ratio suited to a fast stroke, compares three bore sizes, checks retract force and rod buckling, and deals with the side load from cartons that strike the pusher plate off-centre. The failure case is the first prototype, built from a cylinder in the store that was strong enough but could not take the side load.

## What the pusher has to push

Two loads dominate. The first is **friction** between the carton and the belt. A 4 kg carton weighs **4 × 9.81 ≈ 39 N**. With an assumed friction coefficient of 0.5 between the carton's base and the belt surface, sliding it sideways needs up to about **0.5 × 39 ≈ 19.6 N**. The belt is moving, so the carton is already sliding relative to it and the friction acts against the combined motion. Taking the whole friction force across the belt is slightly conservative, which suits a first estimate. A real coefficient depends on the belt surface, the carton board and any dust, and is worth measuring by pulling a carton across a stopped belt with a spring balance.

The second is **acceleration**. The pusher must move the carton and its own moving parts from rest to about 1 m/s in roughly a tenth of a second, an acceleration of about 10 m/s². The moving parts, the piston, rod, guide rods and pusher plate, are estimated at **1.5 kg**. With the carton, the moving mass is **5.5 kg**, and the force to accelerate it is **5.5 × 10 = 55 N**.

```figure
type: formula
title: The pusher's load and the force it needs
formula: load = friction + mass × acceleration        required theoretical force = load ÷ load ratio
caption: This is an illustration. The friction coefficient, moving mass and acceleration are assumptions to be checked on the real line. A load ratio of 0.5 is a common rule of thumb for fast strokes.
- Friction, 4 kg carton, coefficient 0.5 | 0.5 × 4 × 9.81 ≈ 19.6 N
- Acceleration, 5.5 kg at 10 m/s² | 55 N
step: load ≈ 19.6 + 55 ≈ 75 N
step: required theoretical force = 75 ÷ 0.5 = 150 N
step: at 0.5 MPa, area ≥ 150 ÷ 0.5 = 300 mm², a bore of at least about 19.5 mm
```

## From pressure and area to force

As Chapter 1 showed, force in newtons is pressure in megapascals multiplied by area in square millimetres. A double-acting cylinder pushes with the whole piston area when it extends, and pulls with the piston area less the rod's area when it retracts. For a 25 mm bore with a 10 mm rod, the piston area is about **491 mm²** and the annulus, the area left around the rod, is about **412 mm²**.

The pressure to use is the lowest the machine will actually see, which Chapter 1 measured at **5 bar**, or 0.5 MPa, during the busiest hour. At that pressure, the 25 mm cylinder's theoretical extend force is **491 × 0.5 ≈ 245 N**, and its retract force about **206 N**.

Theoretical force is not delivered force. Piston and rod seals create friction, and a few percent to about 10% of the force is commonly lost to it, more in small bores and at low pressure. The load ratio, the next section, covers that loss along with the margin for speed.

## Choose a load ratio for the speed you need

The **load ratio** is the load divided by the theoretical force. A cylinder working near a ratio of 1 can just hold its load and barely move it. To move quickly, it needs spare force to accelerate, and the air on the exhaust side of the piston pushes back as it is squeezed out through the valve and flow control. A widely used rule of thumb keeps the load ratio at or below about **0.5** for fast strokes, and accepts up to about **0.7** where speed does not matter. Manufacturers' sizing guides give their own figures, which take precedence for their products.

The reject pusher's stroke must be fast, so the maintenance lead used 0.5. The required theoretical force is **75 ÷ 0.5 = 150 N**, which at 0.5 MPa needs a piston area of at least 300 mm², a bore of about 19.5 mm.

```figure
type: bars
title: Theoretical extend force at the lowest measured pressure, 5 bar
unit: N
max: 450
caption: This is an illustration for three common bores, against the 150 N the pusher needs at a load ratio of 0.5. The 20 mm bore just passes; the 32 mm bore has a large margin and uses nearly two thirds more air.
- 20 mm bore, load ratio 0.48 | 157
- *25 mm bore, load ratio 0.31 | 245
- 32 mm bore, load ratio 0.19 | 402
```

## Compare the candidates

The 20 mm bore meets the rule, but only just, at a load ratio of about 0.48. Any further fall in pressure, or a heavier product, would push it over. The 32 mm bore has a large margin but uses about **63%** more air per cycle than the 25 mm, needs a larger valve and tubing to reach the same speed, and carries more kinetic energy into the end of its stroke, which Chapter 3 shows matters. The 25 mm bore, at a load ratio of about **0.31**, leaves room for a heavier product or a lower pressure without being oversized. The maintenance lead chose it.

That choice also reflects the business's stock. The maintenance store already carried seals and spare cylinders in 25 mm and 32 mm bores, and adding a 20 mm size would have meant a new set of spares for a marginal design.

## Check the retract stroke

The retract stroke only has to bring the pusher plate back, with no carton. Its load is the moving parts' acceleration and friction in the guides, perhaps **20 N**, against a retract force of about 206 N at 5 bar. The margin is large, so the retract stroke will be fast unless flow control slows it, which Chapter 3 recommends so it does not slam into the end cap.

Retract force matters more in other jobs: a clamp that must pull a part free, a door that must lift its own weight, a cylinder mounted so it lifts on the retract stroke. In those, check the annulus area, not the full piston area.

## Check the rod does not buckle

A long, thin rod pushing a load can buckle sideways before the cylinder reaches its rated force. For a 10 mm steel rod at full extension, with the cylinder fixed and the rod end free to move sideways, the effective length is roughly twice the extended length. Taking an extended length of 350 mm gives an effective length of 700 mm. Euler's formula for a slender column then gives a buckling load of about **1,980 N**, using a second moment of area of about 491 mm⁴ and a modulus of 200 GPa.

The largest force the cylinder can produce, at the 6 bar the line normally sees, is about 295 N, so the margin is a factor of nearly **7**. Buckling is not a concern here, but it becomes one quickly with long strokes and small rods, because the buckling load falls with the square of the length. Manufacturers publish permissible stroke charts for their rods, which are the place to check a real design.

## Side load: the force a cylinder is not built for

A cylinder's rod is supported by a bearing in the front end cap and by the piston inside the barrel. It is designed to push and pull along its axis. Sideways forces and twisting moments wear the rod bearing and seals unevenly, until the cylinder leaks and binds.

The reject pusher meets side loads in two ways. The pusher plate is **280 mm** wide, to cover the carton's length, and weighs about **1.0 kg**. Hanging on the end of a rod extended 300 mm, its weight alone puts a bending moment of about **1.0 × 9.81 × 0.3 ≈ 2.9 N·m** on the rod bearing. And cartons do not always meet the plate at its centre. A carton striking the plate 100 mm off-centre, with the full 75 N load, applies a twisting moment of about **7.5 N·m** to the rod, which a round rod in a round bearing resists only through friction, so the plate rotates.

```figure
type: compare
title: Three ways to carry the pusher plate
cols: Plain cylinder | Cylinder with external guide rods | Guided cylinder unit
caption: This is an illustration of the options considered. Allowable loads and moments come from each maker's data, which the chosen unit must meet with margin.
- Takes the plate's weight | no, the rod bearing carries it | yes, the guide bearings carry it | yes, built in
- Resists twist from off-centre cartons | no, the plate rotates | yes | yes
- Build and alignment effort | least | most: guides must be parallel to the cylinder | little: one bolted unit
- Space beside the line | least | most | moderate
- *Chosen for the reject pusher | no | no | yes, 25 mm bore, 300 mm stroke
```

The maintenance lead chose a **guided cylinder unit**, a cylinder built into a body with two parallel guide rods running in linear bearings, joined at the front by a plate to which the pusher is bolted. The guide rods carry the weight and the twist; the cylinder only pushes. The unit's published allowable moment at 300 mm extension was compared with the 2.9 N·m and 7.5 N·m estimates, and the design kept the actual loads well within it.

## Mount it rigidly and in line

A guided unit still needs a rigid mount. The pusher was bolted to a fabricated bracket fixed to the conveyor frame, not to the guard, so that knocks to the guard could not misalign it. The plate's face was set square to the direction of travel and about **10 mm** above the belt, low enough to catch the base of the carton, high enough to clear the belt's joins. Cartons are pushed most stably low on their side face, near their base, where the push does not tend to tip them.

## A failure case: the cylinder from the store

This is an illustration. The first prototype was built in a week from what was in the store: a 20 mm bore, 300 mm stroke plain cylinder, with the pusher plate bolted directly to its rod end. It passed its first trial with flying colours, rejecting twenty test cartons in a row.

In production, it lasted three weeks. Operators first noticed that the plate no longer sat square: it had rotated a few degrees on the rod, so cartons were pushed at an angle and some jammed against the chute. Then the cylinder began to hiss at the front end. When it was removed, the rod bearing was worn oval and the rod seal was torn on one side. The pusher had also become noticeably slower during the busiest hour, when the pressure dipped towards 5 bar and its load ratio rose close to 0.5.

The detection came from operators, who saw the misaligned plate and heard the leak. The trial had used cartons placed carefully in the centre of the belt; production cartons wander, and every off-centre hit had twisted the rod. The correction was the guided 25 mm unit described above, and two additions to the business's design checklist: list every load on a cylinder, including side loads and moments, and trial with the worst real conditions, not the best.

## How this applies to a small Australian business

Small factories often size cylinders by copying a similar machine or reaching for whatever is in stock. Spend ten minutes on the numbers instead. Estimate the friction and acceleration loads, use the lowest pressure measured at the machine, keep the load ratio at or below about half for anything that must move quickly, and check the retract stroke if it does real work. Then list every force that is not along the rod's axis. If there are any, carry them on guides, not on the cylinder. A guided unit costs more than a plain cylinder and a great deal less than the downtime of replacing a worn one every few weeks.

## Exercise: a heavier product

The business wins a contract to pack 6 kg cartons on line 2, with the same dimensions. Using the same friction coefficient, moving mass and acceleration, what is the new load and the theoretical force needed at a load ratio of 0.5? What load ratio would the 25 mm cylinder run at, at 5 bar, and is it still acceptable? What would a 32 mm bore give?

**Worked answer.** Friction becomes **0.5 × 6 × 9.81 ≈ 29.4 N**. The moving mass is **6 + 1.5 = 7.5 kg**, so the acceleration force is **7.5 × 10 = 75 N**. The load is about **104 N**, and at a load ratio of 0.5 the theoretical force needed is about **209 N**. The 25 mm cylinder gives 245 N at 5 bar, a load ratio of **104 ÷ 245 ≈ 0.43**. That is still within the 0.5 rule, but with little margin for a lower pressure or a stickier carton, and the stroke will be slower than with the 4 kg cartons. A 32 mm bore gives 402 N, a load ratio of about **0.26**, at the cost of more air per stroke and more energy to absorb at the end of the stroke. A sensible step is to trial the 25 mm unit with 6 kg cartons at the lowest pressure and measure the stroke time against the 1.0 s budget before deciding.
