---
book: strain-gauges-and-load-cells-by-the-numbers
chapterSlug: spring-elements-inside-a-load-cell
order: 5
title: "Spring elements: what is inside a load cell"
description: "How column, bending-beam, double-bending and shear-beam load cells turn force into strain, how load position affects them, and how to estimate a spring element's strain and stress."
draft: false
---

Open a load cell and you find a carefully shaped piece of steel or aluminium, a few gauges glued in pockets or on flats, some compensation resistors, a cable and a lot of sealing. The shape is the clever part. It decides how much strain the gauges see, whether the output depends on where on the cell the load is applied, how much the cell deflects, how much overload it survives and how it reacts to side forces. Choosing the right type of cell for a job is mostly a matter of understanding its spring element.

This chapter describes what a spring element must do and then looks at the main families: columns, bending beams, double-bending beams and shear beams, with a short note on S-type and ring cells. It works the strain in a column and a bending beam of BH-2's capacity with BIZOMAT tools, sizes the web of BH-2's shear beam cells from first principles, and ends with a replacement cell that turned a good scale into a poor one.

## What a spring element must do

A good spring element has six jobs.

1. **Make enough strain.** About 1,000 µε at rated load at the gauge sites, which gives about 2 mV/V in a full bridge with a gauge factor of 2.0.
2. **Make it evenly.** The strain should be uniform over each gauge's grid, so that small errors in gauge placement do not matter.
3. **Respond only to the intended force.** The output should not change when the load moves slightly on the cell, or when a small side force or twisting moment is added.
4. **Stay stiff.** Deflection at rated load is typically a fraction of a millimetre, so that the cell does not let the structure move much and responds quickly.
5. **Survive misuse.** Most cells can take half as much again as their rated load without damage, and several times rated load before they break, figures every datasheet states.
6. **Last.** Millions of load cycles without fatigue cracking, and years without moisture reaching the gauges.

The design strain of about 1,000 µε, about 200 MPa in steel, is a compromise among these. More strain gives more signal but less overload margin, more creep and shorter fatigue life; less strain gives better life but a signal more easily swamped by temperature effects.

## Columns

The simplest spring element is a column loaded along its axis. Gauges on its surface see the axial strain directly, and gauges across it see Poisson's ratio times that strain with the opposite sign. With two of each in a full bridge, the output is the gauge factor times the axial strain times (1 + ν) ÷ 2, about 1.3 mV/V at 1,000 µε.

The [axial stress tool](/tools/axial-stress/) shows why columns are used only for large capacities. For 2,000 kg, 19,613 N, to produce 200 MPa and 1,000 µε, the column needs only 98 mm² of steel, a solid bar 11.2 mm in diameter. A bar that thin and short is hard to load truly along its axis, and any tilt bends it, adding strain on one side and removing it on the other. Columns come into their own at tens or hundreds of tonnes, under weighbridges and large silos, usually as hollow cylinders or several columns in one body so that bending cancels out between gauges on opposite sides.

## Bending beams

A cantilever with gauges near its fixed end turns force into bending strain on its top and bottom surfaces. The strain is proportional to the bending moment at the gauges, which is the force times its distance from them. Bending gives a lot of strain for little steel, which suits low capacities.

The [beam stress and deflection tool](/tools/beam-deflection/) works out the maximum bending moment, nominal bending stress and deflection of a prismatic beam for a central point load, a cantilever tip load or a uniform load, from the load, span, modulus, second moment of area and extreme fibre distance. For a solid steel cantilever 30 mm wide, loaded with 2,000 kg at 100 mm from the gauges and designed for 200 MPa at the gauges, the section must be 44.3 mm deep. The tool confirms 200 MPa at the surface and gives a deflection of 0.15 mm at the load point.

The weakness of a simple bending beam is visible in the formula. The moment, and so the output, is proportional to the lever arm. If the load point moves 1 mm along a 100 mm arm, the output changes by 1%. A cantilever load cell therefore has a defined loading point, usually a hole or a ball seat, and is only as accurate as the load is placed.

## Double-bending beams

The double-bending, or binocular, beam removes that weakness. It has two gauge sections a known distance apart along the beam, often formed by a pair of linked holes that leave thin bending zones above and below. The bridge is wired to measure the difference between the bending moments at the two sections. Each moment is the force times its distance from the load, so the difference is the force times the fixed distance between the sections, whatever the position of the load. Move the load along the beam and both moments change by the same amount, which cancels.

That principle, extended to cancel position errors across the width as well, is what makes single-point load cells possible: one cell under the centre of a platform scale or check-weigher, giving the same reading wherever on the platform the item is placed, within the platform size the maker allows.

## Shear beams

A shear beam measures the shear force in a cantilever instead of the bending moment. In a cantilever with a load at its free end, the shear force is the same at every section between the load and the support, equal to the load itself. So a cell that measures shear gives an output independent of where along the beam the load is applied, without needing two gauge sections.

The cell is a block with a pocket machined into each side at mid-height, leaving a thin web where the shear stress is concentrated. Gauges in the pockets are set at 45° to the beam's axis, because pure shear is the same as equal tension and compression at 45° (Chapter 6). On each side, one gauge sees +ε and the other −ε, and with four gauges the full bridge output is the gauge factor times ε. The web also sits on the beam's neutral axis, where bending strain is zero, so bending hardly affects the gauges, and what little reaches them cancels in the bridge.

BH-2's cells are of this type. Their section at the gauges can be approximated as an I-section 40 mm deep and 30 mm wide, with 10 mm flanges and a web whose thickness the designer chooses to set the strain. The shear stress at the neutral axis of an I-section is the shear force times the first moment of area of the section above the axis, divided by the second moment of area and the web thickness.

```figure
type: formula
title: Shear stress and gauge strain in a shear beam web
formula: τ = V × Q ÷ (I × t_w)
formula: ε₄₅ = τ ÷ (2G) = τ × (1 + ν) ÷ E
formula: V_out ÷ V_ex = GF × ε₄₅
caption: V is the shear force (N), Q the first moment of area above the neutral axis (mm³), I the second moment of area (mm⁴) and t_w the web thickness (mm); ε₄₅ is the strain read by gauges at ±45°. For BH-2's I-section with b = 30 mm, h = 40 mm, flanges 10 mm and a 4 mm web: I = 142,667 mm⁴ and Q = 4,700 mm³.
- τ | shear stress at the neutral axis, MPa
- ε₄₅ | strain along the 45° gauges
- G | shear modulus, 76,900 MPa for steel
```

```figure
type: compare
title: Choosing the web thickness of a 2,000 kg shear beam
cols: Shear stress at rated load | Gauge strain | Bridge output before trimming
rowhead: Web thickness
- 3.5 mm | 184.1 MPa | 1,196 µε | 2.39 mV/V
- * 4.0 mm | 161.5 MPa | 1,050 µε | 2.10 mV/V
- 4.5 mm | 144.0 MPa | 936 µε | 1.87 mV/V
- 5.0 mm | 130.0 MPa | 845 µε | 1.69 mV/V
caption: This is an illustration. V = 19,613 N, E = 200,000 MPa, ν = 0.30, GF = 2.0. A 4.0 mm web gives a little more than 2 mV/V; the maker trims the output to exactly 2.000 mV/V with a resistor in series with the excitation, which also absorbs the slight reduction from the gauges averaging the strain over their grids.
```

The 4.0 mm web gives a shear stress of 161.5 MPa at rated load. Chapter 6 shows that this is equivalent to 280 MPa by the von Mises criterion, comfortably below the yield stress of the alloy steels used for such cells, and Chapter 10 checks its fatigue life.

## Other shapes

S-type cells, shaped like the letter S, take tension or compression through threaded holes at each end and bend a central section; they hang hoppers and suit test rigs. Ring and pancake cells for high-capacity compression and tension use rings or radial spokes in shear. Each has its own way of rejecting the forces it is not meant to measure, and each has a correct way to be loaded, which the maker's mounting instructions describe.

```figure
type: compare
title: Spring element families compared
cols: Measures | Output depends on load position | Typical capacities | Typical use
rowhead: Type
- Column | Axial strain | Sensitive to tilt and off-centre load | Tens to hundreds of tonnes | Weighbridges, large silos
- Simple bending beam | Bending moment | Yes, 1% per 1% change in lever arm | Kilograms to a few tonnes | Simple force sensors
- Double-bending beam | Difference of two moments | No, within the stated area | Kilograms to hundreds of kilograms | Single-point platform scales, check-weighers
- * Shear beam | Shear force | No, along the beam | Hundreds of kilograms to tens of tonnes | Hoppers, tanks, floor scales
- S-type | Bending in tension or compression | Sensitive to misalignment | Tens of kilograms to tens of tonnes | Hanging hoppers, test rigs
caption: General characteristics; the maker's datasheet gives the limits for any real cell.
```

## Forces the cell is not meant to measure

A load cell in service rarely sees a pure, perfectly aligned force. A hopper that warms and expands pushes its lugs outwards; a vibrator on the cone shakes it sideways; a conveyor belt pulls on a weigh frame; the hopper's own weight acts slightly off the cell's axis if the lugs are not level. Every spring element responds a little to these extraneous forces and moments, and datasheets state how much: as a side-load rating, an allowable eccentricity, or an error per unit of side force.

The shear beam's geometry helps, because a side force mainly bends the beam about its other axis, which puts the web's gauges near that axis's neutral plane as well. But its rejection is not perfect, and twisting the beam about its own length shears the web in a way the gauges do see. That is why shear beams are installed with mounting hardware, rocker pins, ball-and-cup seats or elastomer pads, that lets the vessel move sideways and tilt slightly without dragging the cell with it, and why the cell's fixing bolts must be tightened to the maker's torque on a flat, level, rigid base. Chapter 7 deals with the installation side of these forces; here the point is that the spring element's design and its mounting are one system.

Column cells are the most sensitive to tilt and need self-aligning top and bottom pieces; double-bending cells tolerate eccentric loads within their stated platform size but not torsion beyond it; S-type cells must hang with their axes truly aligned, which is why they are fitted with rod ends.

## Deflection and stiffness

Every load cell deflects under load. BH-2's cells deflect 0.30 mm at their rated 2,000 kg, a figure from the maker's datasheet, so a full batch moves the hopper down by about 0.18 mm, of which 0.125 mm is from the batch itself. That is small, but it is not zero, and Chapter 7 shows that anything rigidly connected to the hopper resists that movement and carries part of the load past the cells.

Stiffness also sets how quickly a weighing system responds. A hopper on stiff cells settles quickly after the ingredient gate shuts; on softer cells it bounces for longer, and the indicator must filter the reading longer before it is stable, which slows every batch.

## When it goes wrong: the wrong replacement

Some years ago one of the cells under BH-2's predecessor failed after a lightning storm. The stores had a spare cell of the same capacity and rated output, so the fitter installed it. It was a simple bending beam, not a shear beam, with a ball seat marked on top as its loading point. The hopper's lug sat on a rocker pin that, as the hopper filled and its shell flexed, rolled 1 to 2 mm along the beam, and rolled back by a different amount depending on how the hopper settled after each discharge.

The calibration with test weights passed, because the weights were placed with the hopper empty and the lug barely moved. In production, batches varied by up to about 17 kg more than before: a 2 mm movement on a 100 mm lever arm is a 2% change in that cell's output, and that cell carried a third of each 2,500 kg batch, 833 kg, so the error reached 2% of 833 kg, 17 kg.

```figure
type: checklist
title: Replacing a load cell
caption: This is an illustration. The mill now holds a spare of the exact type, and the junction box was re-trimmed after the correct cell was fitted.
- x Same spring element type and mounting hardware as the original
- x Same capacity, accuracy class and rated output, within the trimming range of the junction box
- x Same cable length and number of cores, or a recorded correction
- x Junction box trimmed with a corner test after fitting (Chapter 8)
- x Full calibration with test weights before production resumes
- ? Cause of the original failure found and removed
```

## Exercise: a double-bending beam

The mill's bagging line check-weigher uses a 50 kg single-point aluminium cell. Model it as a beam 25 mm wide and 12 mm deep at its two gauge sections (section modulus Z = 25 × 12² ÷ 6 = 600 mm³), with E = 70,000 MPa. With the load at the centre of the platform, the gauge sections are 80 mm and 40 mm from the load.

1. What bending strains do the two sections see at 50 kg?
2. With the bridge measuring the difference and a gauge factor of 2.0, what is the output?
3. What happens if the load moves 10 mm further from the gauges?

**Answer.** The force is 50 × 9.80665 = 490.3 N.

1. At 80 mm: 490.3 × 80 ÷ (600 × 70,000) = 934 µε. At 40 mm: 467 µε.
2. With +ε and −ε at each section the bridge gives GF ÷ 2 × (934 − 467) µε = 1.0 × 467 µε = 0.467 mV/V. Real single-point cells have thinner bending zones and reach about 2 mV/V.
3. The strains become 1,051 and 584 µε; the difference is still 467 µε, so the output is unchanged. The peak stress at the far section rises to 73.5 MPa, which the cell's overload rating must allow for.
