---
book: thermal-expansion-by-the-numbers
chapterSlug: pipe-expansion-anchors-and-loops
order: 4
title: "Pipe expansion: anchors, guides and loops"
description: "Absorb pipe growth with anchors, guides and an expansion loop sized from beam theory, compare loops with bends and bellows joints, and avoid the guide, venting and thrust mistakes that defeat them."
draft: false
---

Chapter 3 showed that a pipe held rigidly between two points develops enormous force and buckles sideways after a few degrees. The cure is to let the pipe grow, but in a controlled way: fix it at chosen points with anchors, keep it in line with guides, and give its growth somewhere to go. The somewhere is a flexible element: a loop, a natural change of direction or an expansion joint. Each flexible element works by bending, and the amount it can bend without overstressing the pipe follows from basic beam theory. That turns a question usually answered by rule of thumb into a short calculation.

This chapter lays out HW-60's 60 m pipe run. It places the anchors and the loop, derives the guided-cantilever relation from beam deflection, sizes the loop's legs for an allowable stress, checks the force the loop puts on the anchors, compares the loop with natural bends and with a bellows expansion joint, and covers the practical details of guides, vents and drains. The failure case is a loop whose legs were pinned by a guide placed too close.

## The layout

HW-60's 60 m straight run has an **anchor at each end** and an **expansion loop at the middle**. Each 30 m half grows about **36.3 mm** from 15 °C to 85 °C, from Chapter 1, and that growth is pushed towards the loop, which bends to absorb it. Guides along each half keep the pipe in line so it slides towards the loop rather than bowing.

The loop is a U shape in the horizontal plane: the pipe turns 90°, runs out sideways for a distance, turns 90° along the run, then turns back. The two sideways runs are the **legs**. When each half of the pipe grows, it pushes the end of a leg along the run, and the leg bends like a beam.

## The guided cantilever

Each leg is fixed in direction where it joins the straight run, because the run is held in line by its guides, and its other end, at the loop's top, is held in direction by the rest of the loop. A beam fixed in direction at both ends, with one end pushed sideways by a distance Δ, is called a **guided cantilever**. Standard beam theory gives its stiffness and its bending moment:

- the force needed to push the end sideways by Δ is **F = 12 × E × I × Δ ÷ L³**;
- the greatest bending moment, at each end of the leg, is **M = F × L ÷ 2 = 6 × E × I × Δ ÷ L²**;
- the greatest bending stress in a pipe of outside diameter D is **σ = M × (D ÷ 2) ÷ I = 3 × E × D × Δ ÷ L²**.

The second moment of area I has cancelled from the stress, leaving a relation between the leg length L, the pipe's diameter, its modulus, the displacement and the stress. Rearranged for the leg length needed to keep the stress at an allowable value:

```figure
type: formula
title: Leg length of HW-60's expansion loop
formula: L = √(3 × E × D × Δ ÷ σ_allowable)
caption: This is an illustration. The allowable bending stress range of 100 MPa is a teaching value; AS 4041 and similar codes set the real allowable stress range for the material, temperature and number of cycles. Each leg absorbs the growth of one 30 m half.
- Modulus E, stainless steel | 180,000 MPa
- Outside diameter D | 60.3 mm
- Displacement Δ, one half's growth | 36.3 mm
- Allowable stress range | 100 MPa, a teaching value
step: L = √(3 × 180,000 × 60.3 × 36.3 ÷ 100) ≈ √11,820,000 ≈ 3,438 mm
step: legs of 3.6 m give σ ≈ 3 × 180,000 × 60.3 × 36.3 ÷ 3,600² ≈ 91 MPa
```

HW-60's loop has legs **3.6 m** long, giving a bending stress of about **91 MPa**, inside the teaching allowable of 100 MPa. The loop's top, the run between the two legs, is about 1.5 m long; it also bends a little, which adds flexibility, so the guided-cantilever calculation on the legs alone is on the safe side.

## How the leg length depends on its inputs

The relation shows at once what changes the loop's size:

- **Displacement.** L grows with the square root of Δ. Halving the growth each loop must absorb, by using two loops instead of one, reduces each loop's legs by a factor of √2, from about 3.4 m to about 2.4 m.
- **Diameter.** Larger pipes need longer legs, again by the square root: a pipe twice the diameter needs legs about 1.4 times as long for the same growth.
- **Allowable stress.** A higher allowable stress range shortens the legs. At 150 MPa instead of 100, the legs could be about **2.8 m**.

The allowable stress range is not a free choice. It depends on the material, the temperature and the number of heating and cooling cycles the system will see, because thermal cycling causes fatigue, as Chapter 1 noted. Pressure piping codes such as AS 4041 set it, and a competent piping designer applies them.

## The force on the anchors

The loop pushes back on the pipe that bends it, and that force reaches the anchors. From the guided-cantilever stiffness, a 3.5 m leg pushed 36.3 mm needs a force of about **12 × 180,000 × 155,800 × 36.3 ÷ 3,500³ ≈ 285 N**. Add the guide friction from Chapter 3, about 0.56 kN for 30 m, and each anchor carries well under a kilonewton, against nearly 80 kN if the pipe were restrained. That is the whole point of a flexible loop: it turns a huge force into a small one by accepting movement.

## Natural flexibility: bends and offsets

A loop is not always needed. Pipe runs change direction anyway, around columns, through walls and to equipment, and each change of direction can absorb growth in the same way, if the leg beyond it is long enough and free to bend. An L-shaped run, two straight lengths meeting at a bend, absorbs each length's growth in the bending of the other, and the same formula sizes it. A Z-shaped offset does the same with two bends. Good pipe routing uses these natural changes of direction, placing anchors so that each straight length's growth is taken up by a bend, before resorting to loops.

## Bellows expansion joints

An expansion joint is a flexible section of pipe, usually a corrugated metal bellows, that compresses and extends along the pipe's axis. It absorbs growth in a short length, which suits tight spaces. It also brings obligations that loops do not.

```figure
type: compare
title: Expansion loop and bellows expansion joint for HW-60's run
cols: Expansion loop | Bellows expansion joint
caption: This is an illustration. The bellows' effective area of about 3,300 mm² and the system pressure of 0.4 MPa are teaching values; a joint maker gives the real effective area.
- Space | legs of about 3.6 m sideways from the run | a few hundred millimetres in line
- Pressure thrust | none: the loop carries pressure in its own walls | about 0.4 × 3,300 ≈ 1.3 kN pushing the anchors apart
- Anchors and guides | anchors for friction and loop force | main anchors for pressure thrust, and close guides either side
- Maintenance | none beyond the pipe's | inspect the bellows; it is a wearing part
- Failure if misinstalled | loop over-stressed | bellows squirm, burst or over-extend
- *Chosen for HW-60 | yes, the plant room has space | no
```

The most important difference is **pressure thrust**. A bellows cannot carry the pressure force along the pipe, because it is flexible, so the internal pressure tries to push the two halves of the pipe apart with a force equal to the pressure times the bellows' effective area. The anchors must resist it, and guides close to the joint must keep the pipe in line, or the bellows will buckle sideways, a failure known as squirm. HW-60 had space for a loop, which needs neither, so a loop was used. Where a bellows is chosen, its maker's installation instructions, its rated movement with a margin, and the anchor and guide arrangement it requires are part of the design, and the shipping bars that hold it at its installed length are removed only after the anchors are complete, never before.

## Guides, vents and drains

The details around a loop decide whether it works.

**Guides near the loop.** The legs must be free to bend. A guide placed on a leg, or on the straight run too close to the loop's first bend, holds the leg straight and transfers its bending to a short length near the bend, multiplying the stress there. HW-60's layout puts the first guide on each side a set distance from the loop, from the piping designer's rules, and none on the legs.

**Vents and drains.** A loop that rises above the line traps air at its top; one that dips below traps water and sediment when the line is drained. HW-60's loop is in the horizontal plane, level with the run, so it does neither. Where a loop must rise or fall, it needs an air vent at its high point or a drain at its low point.

**Cold pull.** Some installations deliberately stretch or compress the loop at installation by about half the expected growth, so that it bends half one way when cold and half the other when hot. That halves the bending at each extreme. Cold pull must be shown on the drawings and done exactly as designed; done wrongly, it doubles the stress instead.

```figure
type: steps
title: Laying out a hot pipe run for expansion
caption: This is an illustration of the sequence HW-60's designer followed. The numbers for each step are recorded on the piping drawings.
- Calculate growth | α × L × ΔT for each straight length, from installation to the hottest and coldest service temperature
- Place anchors | at equipment, at branches that must not move and to divide long runs
- Use natural flexibility | bends and offsets placed to take up each length's growth
- Add loops or joints | where the routing gives no natural flexibility, sized by the guided-cantilever relation
- Place guides | to keep straight lengths in line, away from loop legs and bends
- Check forces | friction, loop stiffness and any bellows pressure thrust on every anchor
- *Mark and measure | pen marks at guides when cold; check the movement when hot
```

## Branches near anchors and loops

Every branch off a moving pipe moves with it. A branch taken off the main run 25 m from an anchor moves about 30 mm along the run when the system heats. If the branch runs a short, straight distance to a fixed point, such as a hose station bracket or a wall, it is forced to bend through that 30 mm over a short length, and the stress at its connection to the main can be far higher than in the main itself. Branches are therefore taken off near anchors where the main hardly moves, or given their own flexibility, a bend or a short offset, before their first fixed point. HW-60's hose station branches leave the main close to the anchors where possible, and the two that could not do so have a bend and a free length before their brackets.

## Check the loop when it is hot

Commissioning includes watching the loop as the system first heats. The pen marks at the guides, described in Chapter 1, show that each half is sliding towards the loop as calculated. The loop's legs can be seen to deflect: on HW-60, the top of the loop moved about 36 mm along the run relative to its cold position on each leg. A leg that does not move, or a guide whose mark has not moved, means something is binding, and the system is shut down and checked before the stress builds through repeated cycles. The same check is repeated after any modification to the pipework, its supports or its insulation, and recorded with the date.

## A failure case: the guide too close

This is an illustration. On an earlier extension of the hot water line, a contractor built a loop to a sound design, then added a pipe guide on one of the legs, about 300 mm from the bend, "to stop the leg sagging". The leg was now held straight near its root and could bend only in its outer part.

Within about a year, the elbow weld at that bend began to weep. Inspection found a fatigue crack running partly round the weld. The guide had shortened the effective length of the leg sharply, and because the stress rises with the inverse square of the length, the bending stress at the weld had multiplied many times with every heating cycle.

The detection came from the weeping weld, found on a routine walk-round. The correction was to replace the cracked elbow, remove the guide from the leg, and support the leg's weight with a sliding support that carried it vertically without preventing it from bending sideways. The business's piping inspection checklist now includes a line checking that no guide or clamp has been added to an expansion loop's legs.

## How this applies to a small Australian business

Lay out hot pipework with anchors at chosen points, guides between them, and a flexible element for every straight run's growth. Use natural changes of direction first, then loops, then bellows joints where space is tight and their anchors and guides can be provided. Size loop legs from the guided-cantilever relation, L = √(3 E D Δ ÷ σ), with the allowable stress range from the applicable piping code. Keep guides off loop legs and away from loop bends, vent high points and drain low points, and treat bellows as wearing parts whose pressure thrust must be anchored. Check that loops, guides and supports are still as designed whenever pipework is modified.

## Exercise: two loops

The business considers two smaller loops instead of one, at 15 m and 45 m along the 60 m run, with anchors at both ends and at the middle, so each loop sits halfway between two anchors 30 m apart. How much growth does each leg now absorb? Using the same allowable stress of 100 MPa, how long must the legs be?

**Worked answer.** Each loop absorbs the growth of **15 m** of pipe from each side, so each leg's displacement is **17.3 × 10⁻⁶ × 15,000 × 70 ≈ 18.2 mm**. The legs need to be **√(3 × 180,000 × 60.3 × 18.2 ÷ 100) ≈ 2,430 mm**, about 2.4 m, compared with about 3.4 m for one loop. Two smaller loops fit more easily in a crowded plant room, at the cost of four extra bends and an extra anchor.
