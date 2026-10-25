---
book: designing-welded-joints-by-the-numbers
chapterSlug: load-paths
order: 1
title: "Load paths: what a weld must carry"
description: "Trace how force passes from one part to another through a welded joint, name the joint types and weld types, and see why a weld's strength depends on its fused throat, not its appearance."
draft: false
---

A welded joint exists to pass load from one part to another. Before anyone can size a weld, they need to know what load it carries, in which direction, and how that load gets into the weld and out again. Designers who skip this step size welds by habit and are sometimes surprised: a bracket that looked solid tears out at a weld that was loaded edge-on, or a frame cracks at a corner where the load turned through a small fillet. Tracing the load path is the first and most important step in designing a welded joint.

This chapter introduces the joint types and weld types, traces the load through the conveyor drive's motor bracket, and explains, using Whittemore's 1910 tests, why a weld's strength depends on its fused throat and not on how it looks. It introduces the design whose welds the rest of the book sizes.

## Joints and welds

Two sets of words describe a welded connection. The **joint type** describes how the parts meet: a butt joint, where they meet edge to edge in the same plane; a tee joint, where one meets the other at right angles; a lap joint, where they overlap; a corner joint, where they meet at their edges at an angle; and an edge joint, where their edges lie side by side. The **weld type** describes what is deposited: a butt or groove weld, which fills a gap or a prepared groove between the parts and can fuse their full thickness; a fillet weld, a roughly triangular weld in the corner between two surfaces; and plug, slot and spot welds, which join overlapping parts through holes or by fusion.

```figure
type: compare
title: Common joint types and the welds that join them
cols: How the parts meet | Usual welds
caption: General descriptions. Many joints can be made with more than one kind of weld; the load and the cost decide which.
- Butt | edge to edge, in line | butt (groove) weld, full or partial penetration
- *Tee | one part square to the other | fillet welds, or a butt weld with a prepared edge
- Lap | parts overlapping | fillet welds along the edges; plug or slot welds
- Corner | edges meeting at an angle | fillet or butt weld, depending on the preparation
- Edge | edges side by side | edge weld; mostly for thin sheet and sealing
```

The distinction matters for design, because butt welds and fillet welds carry load differently. A full-penetration butt weld, properly made, becomes part of the plate and carries load through its whole thickness, so it is usually designed as if it were the plate. A fillet weld carries load across its throat, the smallest dimension of its cross-section, and is usually designed for shear on that throat, whatever direction the load comes from.

## Tracing the load

A load path is the route force takes from where it is applied to where it is resisted. In a welded joint, the force passes from one part into the weld, through the weld, and from the weld into the other part. Each step must be strong enough, and each change of direction concentrates stress.

This is an illustration. The conveyor drive's motor sits on a bracket: a steel plate standing vertically, welded to the face of a column of the base frame, with the motor mounted on a horizontal shelf at the top of the plate. The motor's weight and the belt pull act on the shelf, some distance out from the column face. That load passes down the bracket plate as shear and bending, reaches the welds along the plate's edges where it meets the column, passes through the welds into the column's face, and then down the column to the base frame and the floor.

```figure
type: steps
title: The load path through the motor bracket
caption: This is an illustration of the conveyor drive's bracket. Each step must carry the load, and the welds at step 3 carry it both as a direct force and as a twisting moment, because the load acts away from them.
- Motor and belt | weight and belt pull act on the shelf, about 300 mm out from the column
- Bracket plate | carries the load as shear and bending towards the column
- *Welds at the column face | carry the direct load and the moment of the load about them
- Column face | must take the load from the welds without bending locally
- Column and base | carry it down to the floor fixings
```

The tracing shows something the habit of "6 mm fillet all round" hides: the welds at the column face carry not only the load itself but a twisting moment, because the load acts 300 mm away from them. Chapter 5 shows that the moment usually dominates, and that the weld stress depends far more on the eccentricity than on the load alone.

## Where joints are weak

Tracing the load also shows where the joint is weakest, and it is often not the weld. Common weak points in welded joints include:

- **the face of a thin part**, such as a hollow section's wall, that a heavy bracket is welded to and that bends locally under the load;
- **a part loaded through its thickness**, such as a plate pulled at right angles to its surface by a weld on one face, which can tear between the layers of the steel in thick plates;
- **the toe of a weld**, where the weld meets the plate surface at a sharp change of section, which concentrates stress and is where fatigue cracks start (Chapter 8);
- **a change of direction**, such as a corner where a flange meets a web, where stress concentrates.

A weld sized correctly for the load can still fail if the part it is welded to cannot carry that load locally, so the design checks both, and often finds that the cheapest improvement is to the part, not the weld.

## Stiffness attracts load

When a joint has more than one route for the load, the stiffer route carries more of it. A bracket welded to a column with a long weld along its stiff edge and a short weld on a flexible flange will load the edge weld heavily and the flange weld lightly, whatever their sizes. A base plate welded round its whole perimeter to a thin-walled tube will pass most of its load through the parts of the weld nearest the tube's corners, where the wall is stiffest. Designers therefore look not only at whether each weld can carry its share, but at which share each weld will actually take, and they avoid joints where a small, stiff weld attracts load that a larger, more flexible one was meant to carry.

## Whittemore's lesson: strength lives in the fused area

Whittemore's tests of 1910 measured the strength of welded steel strips against the strength of the same strip unwelded, and expressed the result as a joint efficiency. Whittemore found that the welds were, on average, considerably weaker than the plate and varied widely from specimen to specimen. Two of the observations matter for design.

First, the weld's strength depends on the area that is actually fused, not on the size the weld appears to be. A weld with a bulging surface can look larger than the plate, but if its root is not fused, the load is carried by a smaller area than it appears. Second, Whittemore found that the rough surface of the unground welds made it hard to measure their true cross-section, and that when specimens were measured at their thinnest points, the efficiencies appeared higher than they really were; grinding the surface flush gave more consistent results. Testing Welded Joints by the Numbers explains the method and results in its chapter on [tensile tests and joint efficiency](/reados/publications/testing-welded-joints-by-the-numbers/tensile-tests-and-joint-efficiency/).

For a designer, the lesson is that weld strength is calculated on a defined throat, the dimension through which the weld is assumed to carry load, and not on the visible size of the weld or its reinforcement. Chapters 2 and 3 define the throat for butt and fillet welds.

## Design strength

To size a weld, the designer needs a design strength for the weld metal: the stress it may carry under the design load. Design standards give these values, with factors that allow for the variability of welds, the consequences of failure and the kind of loading. For teaching, this book uses round illustrative numbers: a design shear strength of **200 MPa** on the throat of a fillet weld made with an ordinary structural filler, and the plate's own strength for a full-penetration butt weld. They are illustrations only; real designs use the values in the applicable standard, such as AS 4100 for steel structures.

## Static, impact and fatigue loads

The kind of load matters as much as its size. A **static** load, such as the dead weight of a walkway, is applied and stays. An **impact** load, such as a conveyor jamming or a load dropped onto a platform, is applied suddenly and can be several times larger than the static load it represents. A **fatigue** load is applied and removed, or reversed, many times, such as the vibration of a motor bracket or the passing of people over a walkway. Welds designed for static load can fail under fatigue at a fraction of that load, which is why Chapter 8 is devoted to it. The designer lists every load each joint will see, with its type, before sizing anything.

## The running case: the conveyor drive

This is an illustration. The conveyor drive's steelwork consists of:

- **a base frame** of rectangular hollow sections, welded at its corners, carrying the motor, gearbox and drive pulley, bolted to the floor;
- **a motor bracket**, a vertical plate welded to a column of the frame, carrying a 15 kW motor and its belt pull, as described above;
- **a gearbox mounting plate**, welded across two frame members, carrying the gearbox's weight and its reaction torque;
- **walkway supports**, cantilevered from the frame, carrying a grated walkway beside the drive.

The designer's first table lists, for each joint, the load, its direction, its type and how it reaches the weld. The motor bracket's welds carry about 40 kN, at about 300 mm from the column face, combining the motor's weight, the belt pull and an allowance for starting; the gearbox plate's welds carry the gearbox's reaction torque, which reverses whenever the conveyor stops and starts; the walkway supports carry people, with the bending of a cantilever. Each needs a different kind of calculation, and the later chapters work through them.

## Joint design is part of the product's design

Welds cannot be sized well once the parts are already detailed, because the joint's geometry decides what welds are possible. A bracket that meets its column with its edge has only its two edges to weld; one that meets it with a flange plate has a whole perimeter. A joint that the welder cannot reach cannot be welded well, whatever the drawing says. Cravens noted in 1921 that when thick castings or plates were to be welded, enough space had to be provided for the welding material, or the weld could never reach right through the joint. The same is true of every joint on a drawing: the designer must leave room for the weld and for the welder.

## Access for the welder

A weld needs room for the welding gun or electrode to reach the root at the right angle, and for the welder to see the pool. Joints in tight corners, the inside of small boxes, and welds behind other parts are hard to make well, and the welds that are hard to make are the ones most likely to have defects. Designers who have watched a welder struggle to reach a joint design differently afterwards. Checking access is part of tracing the load: a load path through a weld that cannot be made properly is not a load path.

## A failure: the edge-on bracket

This is an illustration. On an earlier machine, the company's motor bracket had been a vertical plate whose edge was welded to the face of a rectangular hollow section column with two 6 mm fillets, one each side of the plate. Within a few months, the column's wall cracked round the weld, and the bracket sagged.

The welds themselves were sound. The load path had been ignored: the bracket's moment was delivered to the column through a short length of weld on a thin wall, which bent in and out under the motor's vibration until it cracked. A flange plate on the bracket, welded to the column over a larger area, or a stiffener inside the column, would have spread the load. The welds had been sized; the joint had not been designed.

## Exercise: list the loads

For the walkway supports, list the loads each cantilever weld will carry, their types and how they reach the weld. Then say which part of the joint, other than the weld, you would check.

Each walkway support is a short cantilever welded to the frame. It carries the weight of the grating and its own weight, a static load; the weight of people walking on the walkway, which is applied and removed many times, a repeated load with some fatigue effect; and possibly the impact of a dropped tool or part. These loads act at a distance from the weld, so they reach the weld as a vertical shear and a bending moment, which puts the top of the weld in tension and the bottom in compression.

Other than the weld, the designer would check the frame member the support is welded to, for local bending of its wall under the support's moment, and the support itself at the weld toe, where the bending stress and the stress concentration are highest.
