---
book: plastic-parts-by-the-numbers
chapterSlug: gates-runners-and-filling
order: 7
title: "Gates, runners and how the part fills"
description: "Choose a gate position from flow length, weld lines, venting and appearance, compare cold and hot runners and use a mould flow analysis to check the choice."
draft: false
---

The gate is the small opening through which melt enters the cavity, and its position decides how the part fills. It sets the longest distance the melt must travel, where flow fronts meet and leave weld lines, where air is trapped, which regions pack well and shrink least, and where the gate's vestige will be left on the finished part. Moving a gate after the mould is built is possible but costly. Choosing it is a joint decision for the designer and the toolmaker, and it often exposes a conflict between what is best for filling and what is acceptable for appearance.

This chapter compares gate positions for the cover, resolves exactly that conflict by revising the brief, chooses between a cold and a hot runner and shows what a mould flow analysis adds.

## What the gate position controls

Melt enters at the gate and spreads outwards, freezing against the mould steel as it goes. Several consequences follow from where it starts.

- **Flow length.** The farthest point from the gate must fill before the flow front freezes. Chapter 2 introduced the ratio of flow length to wall thickness as a measure of difficulty.
- **Balance.** A gate near the middle of a part fills it evenly, with fronts arriving at the edges at about the same time. A gate at one end fills unevenly, packing the near end hard and the far end lightly, which causes uneven shrinkage and warpage.
- **Weld lines.** Where the melt splits around a core, such as a boss bore or a window, and meets again behind it, the two fronts weld together, often imperfectly. The weld line is usually weaker than the surrounding material and may be visible.
- **Air traps.** Air in the cavity must escape through vents ahead of the flow. Where two fronts converge on a pocket of air, it can be trapped, compressed and heated until it burns the plastic.
- **Packing.** Pressure falls with distance from the gate, so regions near the gate pack best and regions far away pack least, and thick regions far from the gate are the most prone to sink.
- **Appearance.** The gate leaves a vestige, and the region around it can show flow marks or stress.

## Compare three gate positions

This is an illustration. The toolmaker proposes three positions for the cover's single gate.

```figure
type: compare
title: Gate positions for the cover
cols: Longest flow | Flow-length ratio at 2.5 mm | Weld lines | Gate vestige
caption: Flow lengths run up the skirt, across the top to the farthest corner and down the skirt. A central gate halves the flow length of an end gate.
- Edge gate, centre of a short end | About 203 mm | About 81 | Behind both bosses and through the far hooks | Skirt edge, hidden
- Edge gate, centre of a long side | About 163 mm | About 65 | Behind bosses and near one hook | Skirt edge, hidden
- *Centre of the top, on the outer face | About 112 mm | About 45 | Short, at the skirt corners | Top centre, visible unless hidden
```

The flow lengths follow from the geometry. From an edge gate at the centre of a short end, the melt runs 17.5 mm up the skirt, then diagonally across the top to the far corner, **√(160² + 50²) ≈ 167.6 mm**, then 17.5 mm down the far skirt, about 203 mm in all. From a gate at the centre of the top, the diagonal to a corner is **√(80² + 50²) ≈ 94.3 mm**, plus 17.5 mm down the skirt, about 112 mm.

The central gate is better on every filling measure. It halves the flow length, fills the cover symmetrically and moves the meeting of the flow fronts to the skirt corners, away from the hooks and bosses. Its only drawback is the gate's position on the cosmetic outer face, which the brief in Chapter 1 did not allow.

## Resolve the conflict by revising the brief

A gate on the underside would be ideal, but the cover's outer face is formed by the fixed half of the mould and the underside by the moving half, and conventional gating enters from the fixed side or along the parting line. A gate on the underside's centre would need an unusual mould arrangement. The choice is therefore between an edge gate, accepting the longer flow and its weld lines, and a central gate on the outer face, accepting a vestige on the cosmetic surface.

The team finds a third way. The cover will carry a product label, about 40 × 25 mm, at the centre of its top. If the label sits in a shallow recess, 0.3 mm deep, the gate can be placed in the middle of the recess, where its vestige will be covered by the label. The brief is revised to allow a gate vestige within the label recess only, with a maximum vestige height of 0.1 mm so the label lies flat, and the revision is recorded with the reason.

The revision matters as much as the decision. Chapter 10's approval checks the part against the brief, and a brief that still forbade any gate on the outer face would make every correctly moulded part a reject.

## Avoid weld lines through the hooks

The edge-gated options are not just worse for flow length. With a gate at one end, the melt reaches the far end's hooks last, after flowing around the bosses and the press-tab recesses, and the flow fronts are likely to meet at or near a hook root. A weld line through the root of a snap hook places the weakest material exactly where Chapter 5 put the highest strain.

With the central gate, the flow travels outwards from the middle and arrives at each hook as a single front moving along the hook's length. The hook fills from its root to its catch, the natural direction, with no weld line across it. That alone would justify the central gate for this part.

## Choose a cold or a hot runner

The runner carries melt from the machine's nozzle to the gate. In a cold runner, the runner is a channel in the mould that fills and freezes with each shot and is ejected with the part as scrap or regrind. In a hot runner, the channel is heated, so the melt stays molten between shots and only the part is ejected.

```figure
type: compare
title: Cold and hot runners for the single-cavity cover mould
cols: Cold runner with a pin gate | Hot runner with a single heated tip
caption: Teaching values excluding GST. The hot tip costs more but suits a gate inside the label recess and wastes no runner.
- Mould arrangement | Three-plate mould to bring the runner to the top centre | Heated nozzle to the top centre
- Added tooling cost | About A$2,000 | About A$7,500 with controller
- Runner waste per shot | About 6 g, reground or scrapped | None
- Gate vestige | Small break-off point | Small, controlled by the tip
- *Cycle effect | Runner must cool too | Often shorter, as no runner to cool
```

For a central gate on the outer face, both options work. A three-plate cold-runner mould uses an extra plate to separate the runner from the part and break the pin gate automatically. A hot runner with a single heated tip feeds the gate directly. At 8,000 covers a year, a 6 g runner per shot amounts to about **8,000 × 6 = 48,000 g**, or 48 kg, of polycarbonate a year, which can often be reground and blended back, within limits the moulder and the brief should agree. The hot tip avoids that and usually shortens the cycle slightly, at a higher tooling cost and with a heated system to maintain. Chapter 9 weighs the costs; for now the team carries both options forward.

## Vent the last places to fill

The air in the cavity, about 66 cm³ for the cover, must escape in the fraction of a second it takes to fill. Vents are shallow channels, usually ground into the parting line, deep enough to let air out but too shallow for the melt to follow; the right depth depends on the material's viscosity and is set by the toolmaker from the supplier's processing guidance.

The vents must be where the air ends up, which is where the flow fronts arrive last. With the central gate, that is the bottom edges of the skirt corners and the ends of the ribs, which are blind pockets in the core. Rib ends are a common place for burn marks, because air is pushed into the closed end of the slot with nowhere to go. Venting them, usually through the ejector pins at the rib ends or with small inserts, is part of the mould design.

## Size the gate for packing, not only for filling

The gate is the narrowest point in the flow path, and it freezes first. Once it freezes, no more melt can enter the cavity, so packing pressure can no longer compensate for shrinkage. A gate that is too small freezes early, leaving thick or distant regions under-packed, with more shrinkage and sink. The Covestro design guide notes that large gate thickness and high mould temperature delay gate freeze-off and promote higher levels of packing, and that packing typically decreases, and shrinkage increases, further from the gate.

For the cover, the thickest regions are the boss walls and the rib junctions, and the central gate puts them all within about 60 mm of the gate. A gate sized by the toolmaker to stay open through the packing phase, typically a meaningful fraction of the 2.5 mm wall it feeds, will pack the whole part well. A pin gate made very small for a neat vestige would leave the bosses short of packing and risk sink rings on the top. The vestige limit in the revised brief, 0.1 mm high under the label, gives the toolmaker room to size the gate properly.

```figure
type: bars
title: Flow-length ratio for each gate option at a 2.5 mm wall
unit: ×
max: 90
caption: Longest flow divided by wall thickness. Lower is easier to fill and pack evenly. The two side gates fill well but leave a weld line along the whole top.
- Edge gate, short end | 81
- Edge gate, long side | 65
- Two edge gates, long sides | 46
- *Central gate in the label recess | 45
```

A supplier's flow-length data for the actual grade, often given as a chart of achievable flow length against wall thickness at a stated pressure, turns these ratios into a yes or no for filling. Without it, the comparison still shows that the central gate is the easiest to fill, and the mould flow analysis supplies the absolute check.

## Check the choice with a mould flow analysis

A mould flow analysis simulates the filling, packing and cooling of the part in software, using the material supplier's viscosity, thermal and shrinkage data. It cannot replace the toolmaker's experience, but it can compare gate positions, predict weld lines and air traps, estimate the injection pressure and clamp force and predict shrinkage and warpage before steel is cut.

This is an illustration. A filling analysis of the cover, with the central gate and a 1.2 s fill time, predicts a maximum injection pressure at the gate of about 60 MPa, weld lines only at the skirt corners, air traps at the rib ends and skirt corners and a flow front temperature that stays well above the freezing range everywhere. The same analysis with an end gate predicts about 95 MPa, a weld line across the far hooks and a cold flow front reaching the far corners. These results confirm the hand comparison and give the toolmaker positions for vents.

Read a mould flow analysis with the same habits as any other simulation. Check that the part's volume and mass in the analysis match the CAD and Chapter 1's estimate, that the material is the actual grade and that the process settings are realistic for the moulder's machine. Treat absolute pressures and warpage values as estimates; trust the comparisons between options more than the individual numbers.

## A failure case: the edge gate that cracked the hooks

This is an illustration. A similar cover in an earlier project was edge-gated at one end to keep the cosmetic face clean, without a flow analysis. Trial parts looked good, but in assembly testing about one hook in twenty cracked across its root on the first engagement, always on the hooks farthest from the gate.

A section through a cracked hook, examined under a microscope, showed a faint line across the root where two flow fronts had met. The weld line had placed weak material at the point of highest strain, and the hooks farthest from the gate also saw the lowest packing pressure. The strain calculation had been correct for sound material and wrong for welded material.

The failure was detectable before the mould was cut. A quick flow analysis, or simply sketching the flow fronts from the gate around the bosses and recesses, would have shown where they met. The fix was a new gate position, which meant modifying the mould and repeating the trials.

## Exercise: two gates on the long sides

To keep the outer face completely clear, someone proposes two edge gates, one at the centre of each long side. Estimate the longest flow distance, and say where the fronts from the two gates would meet.

**Worked answer.** From the centre of a long side, the melt runs 17.5 mm up the skirt, then to the farthest point it must fill before meeting the other front. The two fronts meet roughly along the cover's long centreline, 50 mm from each side. Each gate must fill its own half. Its farthest points are the end corners of that half: about **17.5 + 80 + 17.5 = 115 mm** to the bottom of the near end corner, or about **17.5 + √(80² + 50²) ≈ 112 mm** to the end of the centreline. The longest flow is therefore about 115 mm, similar to the central gate. The drawback is a weld line running along the whole length of the top, close to the centreline rib and across the regions near both hook ends, which would show on the cosmetic face and weaken the top along its length. Two gates also need a balanced runner and leave two vestiges. The single central gate under the label remains the better choice.
