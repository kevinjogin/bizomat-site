---
book: yield-and-plastic-flow-by-the-numbers
chapterSlug: bending-tube
order: 8
title: "Bending tube"
description: "How a tube wall thins on the outside and thickens on the inside of a bend, how to check strain and wall against limits, and why a check with the nominal wall passed tubes that came out too thin."
draft: false
---

Hydraulic tube is bent cold, and every bend is a small forming operation with the same physics as the plate bends of Chapter 7, made harder by the tube's hollow section. The outside of the bend stretches and thins, the inside compresses and thickens, and the round section tends to flatten. For a pressure line, the thinned outer wall is the critical part: it must still hold the pressure with the margin the design requires.

This chapter plans the bends in the HC-63's 16 mm hydraulic lines, explains each check in the plan, and follows a batch of lines that passed the plan on paper and came out of the bender too thin.

## The lines

Each HC-63 has two lines of 16 mm outside diameter cold-drawn seamless steel tube with a 2 mm nominal wall, running from the valve block to the cylinder's ports. Each line has two 90° bends and 600 mm of straight lengths between and beyond them. This is an illustration.

The line must hold 21 MPa with the builder's design factor of 4 on its burst pressure, a common practice for hydraulic tube. With a tensile strength of 450 MPa, the burst estimate for a thin tube is 2 t Rm ÷ D. Solving for the wall that gives four times 21 MPa, 84 MPa, sets a minimum wall of 1.6 mm: at 1.6 mm the burst estimate is 2 × 1.6 × 450 ÷ 16 = 90 MPa, 4.29 times the working pressure. The bent tube's thinnest wall must not fall below 1.6 mm.

## What happens to a tube in a bend

When a tube is bent to a centreline radius R, the fibre at its outer edge, at a distance D ÷ 2 from the centreline, stretches by (D ÷ 2) ÷ R, and the fibre at its inner edge shortens by the same amount. At constant volume, stretching the outer wall thins it, and compressing the inner wall thickens it. A simple estimate takes the wall's thickness to vary inversely with the fibre's length.

```figure
type: formula
title: Strain and wall thickness in a tube bend
formula: outer fibre strain = (D ÷ 2) ÷ R
formula: t_outer = t × R ÷ (R + D ÷ 2),   t_inner = t × R ÷ (R − D ÷ 2)
caption: D is the tube's outside diameter, t its wall and R the centreline bend radius. The thinning estimate assumes the wall's thickness changes in inverse proportion to its length; mandrels, wiper dies and pressure dies change the real wall, usually for the better.
- R | centreline bend radius
- D, t | outside diameter and wall
- t_outer, t_inner | wall at the outside and inside of the bend
```

Three further problems are particular to tube. The section flattens, or ovalises, because the stretched outer wall and compressed inner wall both pull towards the centreline. The inner wall can wrinkle when it is thin and the radius tight, because it is in compression and buckles. And the tube springs back, like the plate, so it must be bent past its final angle. Thin-walled tube at tight radii needs a mandrel inside it and a wiper die behind the bend to control all three; a thick-walled tube like the HC-63's, with a diameter only eight times its wall, bends well on plain tooling.

### The tube bending plan tool

The [tube bending plan](/tools/tube-bending-plan/) tool takes the tube's outside diameter and wall, the centreline radius, the bend angle and number of bends, the total straight length, the least wall allowed, the smallest radius-to-diameter ratio allowed, the tube's elongation and a springback allowance. It returns the arc length per bend and the developed cut length, the outer and inner walls after bending and the thinning share, the outer fibre strain, the radius-to-diameter and diameter-to-wall ratios, and the angle to bend to. It checks the outer wall against the minimum, the radius ratio against its limit and the strain against the elongation, and warns when a thin wall at a tight radius needs a mandrel.

```figure
type: compare
title: The HC-63 line bends in the tube bending plan tool, nominal wall
cols: 40 mm radius (2.5 D) | 48 mm radius (3 D)
rowhead: Result
- Arc length per bend, mm | 62.8 | 75.4
- Developed cut length, mm | 725.7 | 750.8
- * Outer wall after bending, mm | 1.667 | 1.714
- Inner wall after bending, mm | 2.500 | 2.400
- Outer wall thinning | 16.7% | 14.3%
- Outer fibre strain | 20.0% | 16.7%
- Angle to bend to, with 3% springback | 92.7° | 92.7°
- Result against 1.6 mm, 2.0 D and 25% elongation | BEND FEASIBLE | BEND FEASIBLE
caption: This is an illustration. 16 × 2 mm tube, two 90° bends, 600 mm of straights, elongation 25%. Both radii pass with the nominal wall. The builder's existing die had a 40 mm radius.
```

### Strain and elongation

The tool compares the outer fibre strain with the tube's elongation after fracture: 20% against 25% for the 40 mm radius. That is a useful screening check, but the two numbers measure different things. Elongation after fracture includes the local stretch in a tensile specimen's neck, and a tube bend cannot neck in the same way: the outer wall is held by the material around it, and its strain is set by the geometry, not by a load. In practice a bend can safely take a strain close to the elongation; the real limits of a tight bend are usually the wall's thinning and the section's flattening, not fracture.

In true strain, the outer fibre of the 40 mm bend reaches ln(1.20) = 0.182 and that of the 48 mm bend ln(1.167) = 0.154. On a flow curve like those of Chapter 3, the outer wall work hardens substantially, so the bend's outer wall ends up stronger, as well as thinner, than the straight tube. The pressure rating is still based on the unhardened strength, which is conservative.

## Tolerances

A tube's wall is not exactly its nominal size. Cold-drawn seamless hydraulic tube is supplied to a wall tolerance, and for the HC-63's tube the supplier's standard tolerance was ±10% of the nominal wall: anything from 1.8 to 2.2 mm is a correct 2 mm tube. This is an illustration. Every check that depends on the wall must use the wall the line could actually have.

## The error: the plan used the nominal wall

The bending plan for the HC-63 lines was done with the nominal 2.0 mm wall and the existing 40 mm die. It passed: 1.667 mm at the outside against the 1.6 mm minimum. The lines went into production.

Three months later, the builder's quality engineer added ultrasonic wall measurement at the bends to the first-article checks for a new tube supplier's material. The outer walls of the bends measured 1.48 to 1.53 mm, below the 1.6 mm minimum. The straight tube from that delivery measured 1.80 to 1.84 mm: within the ±10% tolerance, at its low end.

```figure
type: compare
title: The 40 mm bend with the nominal and the minimum wall, in the tube bending plan tool
cols: Outer wall after bending, mm | Against 1.6 mm | Result
rowhead: Wall used
- Nominal, 2.0 mm | 1.667 | above | BEND FEASIBLE
- * Minimum of the tolerance, 1.8 mm | 1.500 | below | BEND NOT FEASIBLE
caption: This is an illustration. Thinning of 16.7% at a 40 mm radius takes a 1.8 mm wall to 1.50 mm, matching the 1.48 to 1.53 mm measured. The plan was right for the tube on the drawing and wrong for the tube that could be delivered.
```

No line had failed; at 1.5 mm, the burst estimate is still 84 MPa, four times the working pressure. But the design factor the builder had chosen was no longer met, and every line from the delivery was replaced. The tool had given the right answer for the input it was given. The input was the problem.

The lesson reaches beyond tube. Any check that depends on a dimension with a tolerance, such as a wall, a plate thickness or a bar diameter, should use the least favourable value that the tolerance allows, and the drawing or purchase order should state the tolerance the check assumed.

### The fix

Two changes, each checked in the tool, restored the margin.

```figure
type: compare
title: Options for the line bends at the minimum wall
cols: Least wall delivered, mm | Radius, mm | Outer wall after bending, mm | Result
rowhead: Option
- Standard tube, 40 mm die | 1.8 | 40 | 1.500 | NOT FEASIBLE
- Standard tube, 48 mm die | 1.8 | 48 | 1.543 | NOT FEASIBLE
- Standard tube, 64 mm die | 1.8 | 64 | 1.600 | FEASIBLE, at the limit
- * Tube to ±5% wall, 48 mm die | 1.9 | 48 | 1.629 | BEND FEASIBLE
caption: This is an illustration. A larger radius alone needs a 64 mm die, which would not fit the space around the cylinder. A tighter wall tolerance with a modestly larger die passes with some margin.
```

The builder bought a 48 mm die and specified tube with a wall tolerance of ±5%, at a small premium. With the least wall of 1.9 mm, the outer wall after bending is 1.629 mm, above the 1.6 mm minimum. The cut length per line rose from 725.7 to 750.8 mm because of the larger arcs. The bending plan template now has a line for the least wall in the tolerance, not the nominal, and the first-article check measures the bends ultrasonically for each new tube supplier.

## How tube is bent

The method affects how far the real wall departs from the simple estimate, and it is worth knowing which one a supplier or the shop floor uses.

- **Rotary draw bending** clamps the tube to a rotating bend die and draws it round the die's groove, with a pressure die following behind and, for thin walls, a mandrel inside and a wiper die at the start of the bend. It gives the most accurate bends at tight radii and is the usual method on CNC benders for hydraulic lines. The HC-63's lines are bent this way.
- **Compression bending** holds the tube and wraps a roller or shoe round a fixed die. It is simple and quick for larger radii and thicker walls.
- **Ram or press bending** pushes the middle of the tube with a former while it is supported at two points. It is cheap and flattens the section more, so it suits structural tube better than pressure lines.
- **Roll bending** passes the tube through three rolls to form large radii and coils.

In rotary draw bending, a pressure die that pushes the tube forward into the bend, called boost, feeds material into the outer wall and reduces its thinning. A mandrel supports the wall from inside and limits flattening and wrinkling. Both can make the real outer wall noticeably thicker than the simple estimate. The estimate remains a safe first check; credit for the tooling's help has to be earned with trial bends and wall measurements, as the exercise below notes.

### Never bend hydraulic tube hot

Heating a tube to bend it more easily changes everything the calculations rely on. It alters the steel's strength and structure in an uncontrolled way, it leaves scale inside the bore that can break away into the hydraulic system and wreck pumps and valves, and it destroys any coating. Hydraulic lines are bent cold, then cleaned and flushed before fitting. The builder's lines are flushed to a stated cleanliness level and capped until assembly.

## A section through the bend

```figure
type: svg
title: Wall thickness around a bent tube's section
alt: A cross-section of a bent tube drawn as a slightly flattened ring. The outer side of the bend, on the right, has a thinner wall labelled thinned to 1.629 millimetres. The inner side, on the left, has a thicker wall labelled thickened to 2.28 millimetres. A dashed circle shows the original round section for comparison, and arrows mark the bend centre to the left.
caption: This is an illustration for the 48 mm bend in tube with a 1.9 mm least wall. The outer wall thins and the inner wall thickens; the section flattens slightly towards the bend's centreline. The outer wall is the one the pressure check depends on.
viewbox: 0 0 640 320
body:
<ellipse class="bx" cx="340" cy="160" rx="118" ry="128"/>
<ellipse class="bxi" cx="346" cy="160" rx="96" ry="108"/>
<circle class="ln dsh" cx="340" cy="160" r="123"/>
<path class="la" d="M120 160H60"/><path class="ah" d="M66 154L54 160L66 166Z"/>
<text class="tx txs" x="40" y="190">bend centre</text>
<text class="txb" x="470" y="150">outer wall</text>
<text class="tx txs" x="470" y="170">thinned to 1.629 mm</text>
<text class="txb" x="140" y="70">inner wall</text>
<text class="tx txs" x="140" y="90">thickened to 2.28 mm</text>
<text class="tx txs" x="270" y="310">original round section, dashed</text>
```

## Springback and ovality

The tube springs back after each bend, as the plate does, by an amount that depends on its yield strength, wall and radius. The builder's 3% allowance, bending to 92.7° for a 90° bend, came from trial bends with the first tube supplier; it is re-checked with a protractor on the first bends from every new delivery, because a stronger tube springs back more. The tool's allowance is a percentage entered by the user, not a calculation, for exactly this reason.

Ovality is not calculated by the tool. The HC-63's drawing limits the flattening at the bends to 5% of the diameter, measured with calipers across the bend's largest and smallest diameters. A thick-walled tube at three diameters' radius is comfortably inside that; a thinner tube at a tighter radius would need a mandrel to stay inside it.

```figure
type: checklist
title: Tube bend checks for a hydraulic line
caption: The builder's checklist for bent lines. This is an illustration.
- x Least wall in the tolerance used for thinning, not the nominal
- x Outer wall after bending against the pressure-based minimum
- x Radius ÷ diameter against the bender's and the tube maker's limits
- x Outer fibre strain against the tube's elongation
- x Springback confirmed by trial bends for each new supplier
- x Ovality and inner-wall wrinkling inspected on first articles
- x Ultrasonic wall check at the bend on first articles from each new supplier
```

### The bent line's pressure rating

With the fix in place, the thinnest wall at a bend is 1.629 mm, and the burst estimate there is 2 × 1.629 × 450 ÷ 16 = 91.6 MPa, 4.36 times the working pressure. That figure uses the tube's original tensile strength. The bend's outer wall has work hardened and is stronger than that, so the real margin is higher; but the builder does not take credit for work hardening, because it varies with the tube and the tooling, and because the bend also carries residual stresses from forming that the estimate does not include.

Bends are also where hydraulic lines fail in fatigue, when the pressure pulses on every stroke of the cylinder and the line vibrates against its clamps. The HC-63's lines are clamped within a short distance of each bend, so that the bends do not carry the line's vibration, and no line is fitted under strain to make it reach a port. A line that has to be sprung into place carries a bending stress at its fittings for its whole life.

### Bend data for the bender

The plan's results go to the CNC bender as a table of moves: the length to feed before each bend, the rotation of the tube between bends, and the angle of each bend including springback. The builder keeps that table under the same revision control as the drawing, so that a change of die, such as the move from 40 to 48 mm, changes the feed lengths and the cut length together. The first line from any new table is checked against a full-size template before the batch is bent.

## Exercise: a tighter space

A compact version of the HC-63 needs one bend at a centreline radius of 32 mm (2 D). Using the ±5% tube (least wall 1.9 mm) and the same limits (1.6 mm minimum wall, 2.0 D minimum radius ratio, 25% elongation), find the outer wall, the outer fibre strain and the result. What could be done if it fails?

**Worked answer.** The outer wall is 1.9 × 32 ÷ (32 + 8) = 1.520 mm, below the 1.6 mm minimum. The outer fibre strain is 8 ÷ 32 = 25%, exactly at the elongation limit, and the radius ratio is 2.0, exactly at its limit. The bend is not feasible on the wall, and it is at the edge on the other two checks.

The options are a heavier wall, such as 16 × 2.5 mm tube, whose least wall at ±5% is 2.375 mm and whose outer wall after bending would be 1.900 mm; a fitting, such as a forged elbow, in place of a bend; or a different route for the line that allows a larger radius. Bending with a mandrel and a pressure die would thin the wall less than the simple estimate, but the builder would need trial bends and wall measurements to rely on that.
