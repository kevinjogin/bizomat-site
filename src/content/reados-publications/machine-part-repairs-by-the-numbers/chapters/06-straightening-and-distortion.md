---
book: machine-part-repairs-by-the-numbers
chapterSlug: straightening-and-distortion
order: 6
title: "Straightening and distortion"
description: "Measure a repaired shaft's run-out, calculate the load and springback in press straightening, see when heat straightening is unsafe, and allow for contraction when repairing wheels and frames."
draft: false
---

Welding a machine part bends it. Every bead shrinks as it cools and pulls the metal around it, and a shaft built up on one side, or a broken shaft welded across its break, comes out of line. The early repair welders knew it well. Dunham told his readers in 1917 that the importance of V-blocks for holding a shaft in line while welding was greatly exaggerated, because no clamp could stop the expansion and contraction from moving it, and that, however carefully a shaft was lined up beforehand, it must be put in the lathe after welding and straightened. He added that the straightening was itself, to a degree, a test of the weld, and that a shaft left out of line would break, with the weld, as the weakest place, taking the blame.

This chapter covers measuring a shaft's run-out, the arithmetic of straightening it in a press, when heat straightening is and is not safe, and the related problem Campbell described for wheels and frames: allowing for contraction so that a repaired part comes back to shape.

## Measuring run-out

A shaft's straightness is measured as run-out: the shaft is supported between centres, or on V-blocks or rollers at its bearing journals, turned slowly, and a dial indicator on each journal and at points between shows how much the surface rises and falls. The **total indicator reading**, the difference between the highest and lowest readings in one turn, is twice the eccentricity at that point; for a shaft with a simple bow, the bow at the middle is about half the reading there. Run-out is measured before repair, so that the effect of the repair can be separated from any bend the shaft already had, and after, to decide whether and how to straighten it. The readings are written on a sketch of the shaft, journal by journal, with the angular position of each high point marked, so that the straightener knows exactly where to press.

The acceptable run-out depends on the shaft's speed, its bearings, its seals and what it drives. Bearing and seal makers, and the machine maker, give the limits for their parts. A slow agricultural shaft may tolerate more than a high-speed spindle, but a bowed shaft always loads its bearings unevenly, wears its seals and adds a bending stress on every revolution, which is the fatigue load of Chapter 2.

## The running case: the harvester shaft after build-up

This is an illustration. Before the journal build-up in Chapter 4, the harvester shaft's run-out at the worn journal was about 0.04 mm, mostly from the wear. After the build-up and slow cooling, the run-out at the rebuilt journal, measured on the unmachined weld metal against the other journals, was about 0.30 mm total indicator reading, a bow of about 0.15 mm towards the side where the last beads had been laid. Machining the journal true without straightening would have removed 0.15 mm more from one side than the other, and left the rest of the shaft bowed relative to the journal. The shaft needed straightening before the final turning. It also needed it for a reason beyond the journal: a bowed shaft running in two bearings bends a little more, and reverses that bend, on every revolution, adding exactly the kind of cyclic stress that starts fatigue cracks at keyways and shoulders.

## Press straightening

The commonest method is to support the shaft on two blocks with the bow upward and press down on the high point, bending it the other way a little beyond straight, so that when the load is released and the shaft springs back, it is straight. The difficulty is the springback: steel bends elastically first, and only once the stress at its surface exceeds the yield point does it take a permanent set. The press must therefore push the shaft through all of its elastic deflection, and then a little further.

```figure
type: formula
title: Elastic deflection of a shaft in a straightening press
formula: δ = F × L³ ÷ (48 × E × I), with I = π × d⁴ ÷ 64
caption: This is an illustration for the 50 mm shaft supported on blocks 600 mm apart and loaded at the middle. The yield stress of 400 MPa is an assumption for a medium-carbon steel; the real value depends on the steel and its condition.
- d, shaft diameter | 50 mm, so I ≈ 3.07 × 10⁻⁷ m⁴
- L, span between supports | 600 mm
- E | 205 GPa
step: force for 0.5 mm of elastic deflection ≈ 48 × 205 × 10⁹ × 3.07 × 10⁻⁷ × 0.0005 ÷ 0.6³ ≈ 7.0 kN
step: surface stress at that force ≈ 85 MPa, well below yield
step: deflection when the surface reaches 400 MPa ≈ 2.3 mm, at a force of about 33 kN
```

The numbers show the shape of the job. To remove a bow of 0.15 mm, the press must first push the shaft about 2.3 mm, until its surface just begins to yield, and then a small amount further, so that on release a permanent set of about 0.15 mm remains in the opposite direction. The force rises to over 30 kN, about three tonnes, before anything permanent happens. In practice, the straightener presses a little, releases, measures, and repeats, creeping up on the right overbend, because the yield point is not known precisely and a small overpress bends the shaft the other way.

## Where to press

A shaft is pressed where it is bowed, not where it is convenient, and on a section that can take the load without damage. Pressing directly on a finished bearing journal can mark it; pressing near a keyway or a groove concentrates stress there and can crack the shaft. Supports are placed under strong sections, such as unworn journals, with soft packing to protect them. The repaired journal itself, still with its machining allowance on, is often a good place to press, because any marks will be turned off.

Dunham's point, that straightening tests the weld, follows from the arithmetic: the press puts the shaft's surface beyond its yield stress at the point of maximum bending, and a poorly fused or cracked build-up in that region may crack open. A repair that survives straightening and inspection afterwards has passed a demanding test.

## Choosing the method

```figure
type: compare
title: Ways to straighten a repaired shaft
cols: How it works | Suits | Avoid on
caption: General characteristics. The steel, its heat treatment, the shaft's size and the amount of bow decide the method; the maker's guidance governs for critical shafts.
- *Press straightening | overbend past yield; springback leaves it straight | most steel shafts with modest bows | finished journals under the press; near keyways and grooves
- Heat straightening | heat a spot on the convex side; it shrinks on cooling | large shafts and structures of non-hardened steel | hardened and tempered shafts; quenching the hot spot
- Peening | hammer or peen the concave side to stretch its surface | small corrections on soft steel | hardened shafts; where surface damage matters
- Machining true | turn the journal concentric, leave the rest bowed | tiny bows within the allowance | anything more, because the shaft stays bent
```

## After straightening

A shaft that has been press straightened has been yielded at its surface where it was pressed, and that surface carries residual stresses. The repairer checks the run-out at every journal, not only the one that was straightened, because a press on one section can move another. The pressed region is inspected by magnetic particle or dye penetrant for cracks, particularly in and next to any weld, as Dunham's remark about straightening testing the weld implies. The journals are then turned or ground to size, the run-out is measured again in the finished state, and the readings are recorded. For the harvester shaft, the final run-out at the rebuilt journal was about 0.02 mm total indicator reading, within the bearing maker's guidance for the speed.

## Housings and frames

Distortion affects more than shafts. Welding a crack in a gearbox housing can pull its bores out of line, so that the bearings and gears no longer sit as they should. Welding a cracked machine frame can twist it so that the machine's drives misalign. For housings and frames, the measurement is of bore positions and alignment rather than run-out, using a mandrel through the bores, a boring bar, or measurement on a surface plate or with a portable measuring arm, and the correction may be line boring, shimming or rework rather than straightening. Chapter 8 deals with cast housings, where distortion and cracking go together.

## Heat straightening

Heat straightening uses the same shrinkage that caused the distortion to reverse it. A small area on the convex side of the bow is heated quickly, often with an oxy-fuel torch, so that it tries to expand, is held back by the cooler metal round it, and is upset; as it cools, it shrinks and pulls the shaft back towards straight. Skilled hands can straighten large shafts and structures this way without a press.

On shafts, heat straightening has a serious limitation. A medium-carbon or alloy steel shaft that has been hardened and tempered loses its properties if it is heated above its tempering temperature, and if it is heated into the range where it hardens, and then cooled quickly, it forms hard, brittle spots that can crack in service. Heat straightening is therefore used on shafts only within temperature limits set from the steel's heat treatment, measured with temperature-indicating crayons, and is avoided on hardened shafts altogether. For the harvester shaft, which was a medium-carbon chromium steel in a hardened and tempered condition, the repairer used press straightening, not heat.

## Allowing for contraction

Distortion is easier to prevent than to correct. Campbell described in 1919 how to repair a broken spoke in a cast pulley wheel: because the rim and hub held the spoke's ends, the weld's contraction would either crack the spoke again or pull the wheel out of shape. His method was to saw through the rim, jack the hub and rim apart with a wedge so that the crack in the spoke opened by the amount the weld would contract, weld the spoke, remove the jack while it was still hot so the rim could draw in, and then weld the rim the same way. He noted that the allowance might be only a thirty-second or a sixteenth of an inch, about 0.8 to 1.6 mm, and that each welder had to judge it from their own technique.

The same principle applies to many machine repairs: where a weld joins parts that are held at both ends, provide for the contraction before welding, by presetting the parts apart, by preheating the surrounding structure so that it contracts with the weld, or by sequencing the welds so that each shrinks against a free end. Weld Repairs That Hold explains the shrinkage of welds and how sequence controls it in its chapter on [heat, expansion and shrinkage](/reados/publications/weld-repairs-that-hold/heat-expansion-and-shrinkage/).

## Broken shafts

Welding a shaft that has broken right through is a bigger job than building up a journal. Dunham described preparing the break by grinding both ends to a chisel edge, which in modern terms is a double-V preparation, lining the shaft up in a lathe or by eye, tacking it, welding it, and straightening it in the lathe afterwards. Campbell judged that a crankshaft that had broken by fatigue in the cheek, with no part thrown out of line, could usually be welded and restored quickly, but that one broken by an external force was apt to be bent as well, so that restoring its alignment could take days. Modern practice treats a welded-through shaft with great caution: the weld runs across the whole section at a place where the shaft has already failed, and its alignment, its fusion and its fatigue performance must all be right. For shafts whose failure would cause serious damage or danger, a new shaft is the usual answer.

## A failure: the heat-straightened spindle

This is an illustration. A neighbouring shop had heat straightened a bent spindle from a hammer mill, heating a spot on the convex side to a bright red with an oxy-acetylene torch and cooling it with a wet rag to speed the job. The spindle ran true when it was fitted. It cracked at the heated spot within a few weeks.

The spindle was a hardened and tempered alloy steel. The bright red heat had taken the spot into its hardening range, and the wet rag had quenched it, forming a hard, brittle patch on the surface, exactly where the bending stress was highest. Press straightening, or a new spindle, would have avoided it, and the shop added heat straightening of hardened shafts to its list of things it does not do.

## Exercise: springback

A 40 mm shaft supported on blocks 500 mm apart has a bow of 0.20 mm. Taking E = 205 GPa and an assumed yield stress of 350 MPa, estimate the central deflection at which the surface begins to yield, and the total press deflection needed to leave it straight, assuming the permanent set equals the extra deflection beyond the yield point.

For the 40 mm shaft, I = π × 0.040⁴ ÷ 64 ≈ 1.26 × 10⁻⁷ m⁴. The bending moment at yield is M = σ × π d³ ÷ 32 ≈ 350 × 10⁶ × π × 0.040³ ÷ 32 ≈ 2,200 N·m, needing a central force F = 4M ÷ L ≈ 4 × 2,200 ÷ 0.5 ≈ **17.6 kN**. The deflection at that force is F L³ ÷ (48 E I) ≈ 17,600 × 0.125 ÷ (48 × 205 × 10⁹ × 1.26 × 10⁻⁷) ≈ **1.78 mm**.

To leave it straight, the press must push it through about 1.78 mm of springback plus the 0.20 mm of permanent set needed, about **2.0 mm** in all, beyond straight. In practice, the press is applied in small steps, released and measured each time, because the yield point and the springback vary from shaft to shaft.
