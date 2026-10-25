---
book: designing-welded-joints-by-the-numbers
chapterSlug: direction-and-size-limits
order: 4
title: "Direction of load and limits on weld size"
description: "Compare fillet welds loaded along and across their length, see why mixing them needs care, and understand the minimum and maximum fillet sizes that thick plate, plate edges and fit-up gaps impose."
draft: false
---

Chapter 3 treated a fillet weld as carrying shear on its throat whatever the direction of the load. That simple method is conservative and widely used, but it hides two facts that matter in design. First, a fillet weld loaded across its length behaves differently from one loaded along it, in both strength and ductility. Second, there are limits on fillet weld size that have nothing to do with the load: a fillet can be too small for the plate it is laid on, or too large for the edge it runs along, and a gap under it can steal its throat.

This chapter explains the difference between longitudinal and transverse fillets, why combining them in one joint needs care, and the practical limits on fillet size set by plate thickness, plate edges and fit-up gaps.

## Longitudinal and transverse fillets

A **longitudinal** fillet runs parallel to the load, like the welds along the edges of the lapped tie in Chapter 3: the load tries to slide one part along the other, shearing the weld along its length. A **transverse** fillet runs across the load, like a weld along the end of a lapped bar: the load pulls across the weld, putting its throat under a combination of tension and shear.

Tests on fillet welds have long shown that transverse fillets carry more load per millimetre than longitudinal ones before breaking, but stretch much less before they do. Longitudinal fillets are weaker but more ductile: they deform considerably along their length before failing, which lets a long weld redistribute load from its heavily loaded ends to its lightly loaded middle. Some design standards recognise the extra strength of transverse fillets with a directional factor; the simple method of Chapter 3 ignores it and uses the lower, longitudinal strength for all directions.

```figure
type: compare
title: Longitudinal and transverse fillet welds
cols: Load relative to weld | Strength per mm | Deformation before failure
caption: General behaviour from tests on fillet welds. The applicable standard decides whether any extra strength for transverse loading may be used in design.
- *Longitudinal | along the weld | lower | larger: the weld stretches along its length
- Transverse | across the weld | higher | smaller: the weld breaks with little stretch
- Simple design method | any direction | lower value used throughout | not considered
```

## Mixing directions in one joint

The difference in ductility causes a trap. Consider a lapped bar welded with both longitudinal fillets along its edges and a transverse fillet across its end. Under load, the stiff transverse weld reaches its capacity at a small deformation, before the more flexible longitudinal welds have taken their full share. If the designer adds the capacities of all three welds, assuming each reaches its full strength together, the joint may fail at a lower load than calculated, because the transverse weld breaks first and the longitudinal welds then carry everything.

Design standards that allow the transverse weld's extra strength usually set rules for combining it with longitudinal welds; the simple method avoids the trap by using the lower strength for every weld. For the conveyor frame, the designer used the simple method throughout, which costs a little extra weld in the joints with transverse fillets and removes the question. It also keeps the calculations simple enough for a reviewer to check quickly.

## Why long longitudinal welds share load unevenly

A long longitudinal fillet in a lap joint does not carry its load evenly along its length. The two lapped parts stretch under load, each most where it carries most: the bar being pulled stretches most near the end of the lap where it still carries the whole load, and the plate it is lapped onto stretches most near the other end. The difference in their stretching is taken up by the weld, which is therefore sheared hardest near the ends of the lap and least in the middle. In a short lap, the weld's ductility evens this out before anything fails. In a very long lap, the ends can reach their capacity while the middle carries little, which is why some standards reduce the design capacity of very long longitudinal welds. For most machine frames the laps are short and the effect small, but a designer specifying a long lap to carry a heavy load should check the standard's rule.

## Welds that carry compression by bearing

Where parts are fitted closely and the load pushes one onto the other, much of the load can pass by direct bearing rather than through the weld. A column standing on a machined base plate, fitted tightly, can transfer its compression to the plate through contact, with the welds holding it in place and carrying any tension, shear or moment. Design standards allow this only where the fit is good enough to be relied on, which usually means machined or carefully prepared contact surfaces and an inspection of the fit. Where the fit cannot be guaranteed, the welds are designed to carry the full load.

## Size, passes and the welder

A fillet up to a certain size can be made in one pass; above that, it needs several, laid side by side and on top of each other. The single-pass limit depends on the process and the position: a fillet that can be laid in one pass in the flat position with a high-deposition process may need three passes in the vertical position with a smaller electrode. Every extra pass adds time, heat and distortion, and every pass boundary is a place where slag or lack of fusion can be trapped. The designer who knows roughly where the single-pass limit lies for the shop's processes can choose a weld size, or a joint arrangement, that keeps most welds within it, which is often the biggest single saving in welding cost.

## Minimum fillet size on thick plate

A small fillet weld laid on thick plate cools very quickly, because the plate draws the heat away into its mass from both sides of the corner. Fast cooling can harden the heat-affected zone and, with any hydrogen present, crack it, and the shrinkage of the small weld against the stiff thick plate puts high stresses in the weld itself. Design and welding standards therefore set a minimum fillet size that depends on the thickness of the thicker part joined, whatever the calculated load.

The underlying physics is the heat input. A small fillet is made with a low heat input, perhaps less than a kilojoule per millimetre of weld; a larger fillet, or one made in more than one pass, puts in more heat and cools more slowly. Weldability by the Numbers explains how heat input and plate thickness set the cooling rate, and why thick plate may need preheat as well as a minimum weld size, in its chapter on [heat flow, conductivity and preheat](/reados/publications/weldability-by-the-numbers/heat-flow-conductivity-and-preheat/). The KEVOS® WORKOS [welding heat input calculator](/tools/welding-heat-input/) does the arithmetic.

```figure
type: formula
title: Heat input of two fillet welds
formula: heat input = efficiency × V × I × 60 ÷ (travel speed in mm/min × 1,000)
caption: This is an illustration with typical arc values for a small and a larger fillet made in one pass. Efficiency is the fraction of arc power reaching the work, about 0.8 for the processes shown.
- 4 mm fillet | 22 V, 180 A, 450 mm/min
- 8 mm fillet | 28 V, 280 A, 250 mm/min
- efficiency | 0.8
step: 4 mm: 0.8 × 22 × 180 × 60 ÷ (450 × 1,000) ≈ 0.42 kJ/mm
step: 8 mm: 0.8 × 28 × 280 × 60 ÷ (250 × 1,000) ≈ 1.51 kJ/mm
step: the larger weld puts in about 3.6 times the heat per millimetre
```

On a 20 mm base plate, the 4 mm fillet's low heat input would cool fast in the heavy plate; the larger weld cools more slowly and is less likely to crack. The minimum size rules in the standards encode that experience. They are one of the few places where the standard, not the calculation, decides the weld size, and a design review should check them as carefully as the strength.

## Maximum size along an edge

A fillet weld laid along the edge of a plate, as in a lap joint, cannot have a leg larger than the plate's thickness, because the welder would melt the edge away trying to reach it and the weld's size could not be confirmed by inspection. Standards set a maximum leg for fillets along edges, a little less than the plate's thickness for thicker plates, so that the edge remains visible after welding. The designer who needs more capacity in a lap joint along a thin edge lengthens the weld or adds another, rather than specifying a fillet larger than the edge can take.

## Gaps under the weld

A fillet weld assumes the parts are in contact at the root. If there is a gap between them, from poor fit-up or distortion, the weld's root moves away from the corner, and the throat measured from the actual root is smaller than the leg suggests. A 6 mm fillet over a 2 mm gap has a throat measured from the parts' surfaces of only about 0.707 × 4 ≈ 2.8 mm if the welder makes the usual 6 mm legs, a third less than intended. Arc Welding by the Numbers compares fillets with and without a root gap in its chapter on weld metal in fillet welds. Welding standards usually require the leg to be increased by the amount of the gap, or set a maximum gap, and the designer can help by specifying fit-up tolerances on the drawing and by designing parts that sit together without forcing.

## Welds on curved and uneven surfaces

Fillets on round bars, tube ends and uneven castings meet surfaces that are not flat, and their throat varies round the joint. A tube welded to a plate by a fillet round its end has a throat that depends on how the tube's end meets the plate; a fillet on a round bar laid on a flat plate has a throat that depends on the bar's curvature. Design guides give methods for these shapes; the practical point is that the throat must be checked in the actual geometry, and that the drawing must state what size is wanted where.

## Through-thickness loading

A tee joint where the load pulls the standing plate away from the face plate loads the face plate through its thickness. Steel plate is weaker in that direction than along its rolling direction, and thick plates can tear between their layers, a failure called lamellar tearing, usually during welding when the weld shrinks, and occasionally in service. The risk rises with plate thickness, with the size of the weld and with the restraint of the joint. Designers reduce it by avoiding large welds that pull through thick plates, by arranging joints so that the load runs along the plate rather than through it, and, for critical joints, by specifying plate with guaranteed through-thickness properties.

## The running case: the base frame feet

This is an illustration. Each column of the conveyor drive's base frame stands on a 20 mm base plate, bolted to the floor, welded to the column's rectangular hollow section by fillets all round. The load on each foot is modest, and the calculation of Chapter 3 suggested that a 4 mm fillet would carry it with a large margin.

The designer did not use 4 mm. On a 20 mm plate, a 4 mm single-pass fillet would cool quickly, and its shrinkage against the stiff plate could crack it or the column wall. The design standard's minimum size for the thickness governed, and the designer specified a larger fillet, at least the minimum the standard sets for a 20 mm plate, and noted on the drawing that the minimum size, not the load, controlled. The fabricator's welding procedure then set the preheat, if any, for the plate.

## A failure: the cracked small fillets

This is an illustration. On an earlier job, a fabricator welding stiffeners to a thick crane rail support plate had used 5 mm fillets, because the drawing showed 5 mm and the calculation behind it had considered only the load. Several welds cracked along their centres as they cooled, with audible pings in the shop.

The 5 mm fillets on plate more than 30 mm thick had cooled far too fast and shrunk against a joint that could not move. The welds were ground out and remade larger, with preheat, to a procedure that considered the thickness. The drawing was corrected to the standard's minimum size, and the company added a check of minimum sizes, against the thickest part at every joint, to its design review.

## Exercise: a gap and a fix

A 6 mm fillet is specified on a tee joint, but the parts have a 1.5 mm gap at the root. If the welder makes 6 mm legs measured from the surfaces, what is the effective throat, and what leg would restore the intended throat of about 4.24 mm?

With a 1.5 mm gap, the effective leg measured from the root is about 6 − 1.5 = 4.5 mm, giving a throat of about 0.707 × 4.5 ≈ **3.2 mm**, about a quarter less than intended. To restore a throat of 4.24 mm, the effective leg must be 6 mm, so the legs measured from the surfaces must be about 6 + 1.5 = **7.5 mm**.

That is the reasoning behind the common welding rule of increasing the leg by the gap. The better fix is to reduce the gap by better fit-up, which saves the extra weld metal and the distortion it brings.
