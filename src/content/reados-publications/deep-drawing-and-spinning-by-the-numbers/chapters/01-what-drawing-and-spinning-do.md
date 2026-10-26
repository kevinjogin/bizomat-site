---
book: deep-drawing-and-spinning-by-the-numbers
chapterSlug: what-drawing-and-spinning-do
order: 1
title: "What drawing and spinning do to the metal"
description: "See how a flat blank becomes a seamless cup: flange, wall and punch radius, constant volume and area, the family of drawing and spinning processes, and catch a wall thickness the process cannot give."
draft: false
---

A seamless cup can be made from flat sheet in two quite different ways. In **deep drawing**, a punch pushes the centre of a blank through a die, and the blank's outer ring is pulled inwards over the die's edge to form the cup's wall. In **metal spinning**, the blank is clamped against a rotating former, called a mandrel or chuck, and a roller or tool presses it progressively onto the former's shape, a little at a time, as it turns. Both turn a disc into a hollow shape without a seam, and in both the metal's thickness changes far less than its shape does. The difference lies in how much of the blank is worked at once: drawing works the whole circumference in one stroke, spinning works a small spot that travels round and along the part.

This chapter describes what each process does to the metal, sets out the principle of constant volume on which every later calculation rests, maps the family of related processes and introduces the running case. It also finds the first problem with SC-100: its enquiry drawing asked for a wall thinner than the sheet, which drawing alone does not give.

## Three zones of a drawn cup

As a punch draws a blank into a die, the blank divides into zones that are doing quite different things.

```figure
type: steps
title: What each zone of a drawn cup is doing
caption: The flange is compressed around its circumference, the wall carries the force, and the punch radius is where the wall is weakest.
- Flange | Under the blank holder; pulled inwards, its circumference shrinking, so it tends to wrinkle and thicken
- Die radius | Bent over the die's edge and straightened again as it enters the wall
- *Wall | In tension, carrying the whole drawing force from the punch to the flange
- Punch radius | Bent and stretched; usually the thinnest point and the place a cup tears
- Bottom | Held flat against the punch's face; changes little
```

The **flange** is the part of the blank still outside the die. As it is pulled inwards, each ring of metal moves to a smaller radius, so its circumference must shrink. A ring at the edge of SC-100's blank, about 199 mm across, must end at about 100 mm, its circumference halving. That shrinkage is compression around the circumference, and thin sheet under compression buckles into wrinkles unless something holds it flat. The **blank holder**, a ring pressing the flange against the die's face, does that job; Chapter 5 covers it.

The **wall** is the part already drawn. It carries the whole force from the punch to the flange, pulling the flange in, so it is in tension along its length. The force needed rises with the size of the flange still to be drawn, and the wall must carry it without tearing. The weakest point is usually at the **punch radius**, where the wall meets the bottom, because the metal there is stretched and bent at the same time and has had little chance to work-harden. A drawn cup that fails usually tears around the punch radius, often with the bottom pushed out like a lid.

The **bottom**, held flat against the punch's face, changes very little. In SC-100, the flat bottom at the centre of the blank keeps nearly its original thickness throughout.

## Constant volume, nearly constant area

Metal flowing plastically keeps its volume. A blank of a given volume makes a part of the same volume, less only what is trimmed off. This is the principle behind every blank size in Chapter 2 and every redraw height in Chapter 3.

In drawing, the thickness changes a little from place to place, thicker at the rim and thinner at the punch radius, but on average it stays close to the sheet's original thickness. For most drawn parts, therefore, constant volume reduces to a simpler working rule: the blank's **surface area** equals the part's surface area, measured at the mid-thickness of the sheet, plus the trim allowance. Chapter 2 builds on that rule. Where the thickness is changed on purpose, by ironing in Chapter 8 or by shear spinning in Chapter 9, the full volume calculation is used instead.

This is an illustration. SC-100, a cup of 100 mm mean diameter with a 4 mm corner radius, has a surface area at mid-thickness of about **29,300 mm²** at its finished height of 70 mm. Drawn to 76 mm to allow 6 mm for trim, it needs about **31,180 mm²** of blank, a disc about 199.3 mm across. In 0.8 mm 304 stainless steel, with an illustrative density of 7.9 g/cm³, the blank weighs about **197 g** and the trimmed part about **185 g**.

## The family of processes

Drawing and spinning are two members of a family, and choosing well starts with knowing the others.

```figure
type: compare
title: Drawing, spinning and their relatives, in general terms
cols: How the metal is formed | Thickness | Typical fit
caption: General characteristics only; the right process for a part comes from its shape, quantity and material, and from the toolmaker's or spinner's experience.
- *Deep drawing | Punch draws the blank through a die in one stroke | Close to the sheet's, thicker at the rim | Larger quantities of cups, shells and boxes
- Redrawing | A drawn cup drawn again to a smaller diameter | Close to the sheet's | Deep parts beyond one draw's limit
- Ironing | The wall squeezed through a gap smaller than its thickness | Deliberately reduced | Thin, uniform walls; cans and shells
- Conventional spinning | A roller presses the blank onto a rotating former, pass by pass | Close to the sheet's | Small to moderate quantities; large or round shapes
- Shear spinning | A roller forms the blank in one pass, thinning it by the sine law | Deliberately reduced | Cones and conical shells
- Rubber-pad and fluid forming | A flexible pad or fluid replaces one half of the tooling | Close to the sheet's | Low quantities; shallow or complex shapes
```

Drawing and spinning overlap for round parts. A cup like SC-100 can be drawn in a press or spun on a lathe, and Chapter 10 shows that the choice between them turns largely on quantity, because drawing's tooling costs more and its cycle is far shorter. Non-round shapes, such as rectangular boxes, are drawn but not spun; very large or very low-quantity round shapes are usually spun.

## The running case: SC-100

This is an illustration. SC-100 covers an instrument mounted on outdoor equipment. Its customer specifies:

- a flat-bottomed cylindrical cup, **100 mm** mean diameter and **70 mm** high after trimming;
- a bottom corner radius of **4 mm**, which is five times the sheet's thickness;
- **0.8 mm** 304 stainless steel, chosen for corrosion resistance outdoors;
- a **seamless** wall, because the cover's open end seals against a gasket on its base;
- a trimmed open end, square and free of burrs, to seat on the gasket.

The quantity is not yet settled. The customer's first estimate was a few hundred a year, rising to tens of thousands if a larger contract is won. That uncertainty is why Chapter 10 compares drawing and spinning for the same part.

## The error: a wall thinner than the sheet

This is an illustration. SC-100's first enquiry drawing gave the sheet as 0.8 mm and the wall thickness as **0.6 mm**, with the bottom at 0.8 mm. The customer's designer had reduced the wall to save weight, reasoning that the wall carried no load. The drawing gave no note about how the thinner wall should be made.

Drawing alone does not do it. A drawn cup's wall stays close to the sheet's thickness, thinner near the punch radius and thicker towards the rim, but not uniformly 25% thinner. A uniform 0.6 mm wall from 0.8 mm sheet means **ironing**: squeezing the drawn wall through a die whose gap is smaller than the wall's thickness, a separate operation with its own tooling, its own force and its own risk of tearing, as Chapter 8 explains.

The quoting engineer caught it while preparing the blank calculation, because the volume of a part with a 0.6 mm wall gives a different blank from one with a 0.8 mm wall. By constant volume, the ironed part would need a blank of only about 180 mm, against 199 mm, and if the full 199 mm blank were ironed to 0.6 mm, its wall would grow from 72 mm to about 96 mm long. Neither matches a simple draw. The engineer then worked out what the thinner wall saved.

```figure
type: bars
title: SC-100's material, in grams of 0.8 mm 304 stainless steel
unit: g
max: 260
caption: This is an illustration at a density of 7.9 g/cm³. Ironing the wall to 0.6 mm would save about 33 g, at the cost of an extra operation.
- Square of sheet, 200 × 200 mm | 253
- Blank, 199.3 mm diameter | 197
- *Trimmed part, 0.8 mm wall | 185
- Trimmed part, wall ironed to 0.6 mm | 152
```

The wall at 0.8 mm weighs about 33 g more than at 0.6 mm. Against an extra ironing operation, its tooling and its risk, the customer judged the saving not worth having, and the drawing was changed to show the wall as **0.8 mm nominal**, with a note limiting thinning at the punch radius to a stated percentage and allowing thickening towards the rim. The general lesson is that a drawn part's thicknesses should be specified as the process gives them, and that a wall thickness different from the sheet's is a process decision, not a drafting one.

## Spinning in outline

In conventional spinning, the blank is clamped between the former and a tailstock pad, and the assembly rotates, typically at hundreds of revolutions a minute. The spinner, or a CNC spinning machine, presses a roller against the blank and moves it in a series of passes from the centre outwards, each pass laying a little more of the blank onto the former. The blank's diameter shrinks as it is formed, as in drawing, and its thickness stays close to the original if the passes are well chosen.

Because only a small area is worked at a time, spinning needs far less force than drawing, and its former can be made of wood, resin or mild steel rather than hardened tool steel. The cost is time: each part takes minutes rather than seconds, and its quality depends on the spinner's skill or the CNC program's passes. Chapter 9 covers spinning and its relative, shear spinning, in which the roller forms the blank in a single pass and deliberately thins it.

## Material matters

The metals that draw and spin well are ductile and work-harden at a moderate rate: low-carbon steels made for drawing, aluminium alloys in soft tempers, copper and brass, and austenitic stainless steels such as 304. Each has its own limits. Austenitic stainless steel is drawn widely, but it work-hardens rapidly, needs more force than mild steel for the same part, and can crack some time after drawing if its strain is too high, which Chapter 8 discusses. Aluminium is soft and light to draw but galls on tools without good lubrication. The material's supplier and the toolmaker should agree on the grade, temper and surface for a drawn part, because a sheet that bends well does not necessarily draw well.

## What the defects say

A drawn part that goes wrong usually tells you why, because each zone fails in its own way. **Wrinkles** in the flange, or in the wall just below the rim, say the flange was not held firmly enough against its circumferential compression: too little blank holder force, or a holder that lifted as the flange thickened. A **tear** around the punch radius says the wall could not carry the force needed to pull the flange in: too large a blank for the punch, too much blank holder force, too tight a clearance, too small a radius or too little lubricant. **Ears**, a wavy rim with high and low points round its edge, say the sheet's properties differ with direction, which Chapter 7 covers. **Scoring**, lines drawn along the wall, says the tool and the sheet have galled, usually from a lubricant breaking down or a tool surface that needs polishing. A **split** that appears hours or days after drawing, in a work-hardening stainless steel, says the cup was drawn too hard without an anneal, the subject of Chapter 8.

Reading the defect before changing anything saves trial time. A tear treated by increasing blank holder force, or a wrinkle treated by reducing it, makes the part worse, and a toolmaker who changes several settings at once learns nothing about which one mattered. Each later chapter ties its calculation to the defect it prevents, so that a trial failure points back to the number that needs checking.

## What the numbers are for

The chapters that follow give a calculation for each decision in making a drawn or spun part: the blank's size, the number of draws, the press force, the blank holder pressure, the tool clearance and radii, the trim allowance, the ironing reduction, the spinning thickness and the cost by route. None of them replaces trial. Drawing in particular is sensitive to the material's batch, the lubricant and the tools' finish, and toolmakers prove each new tool with trial parts before production. The numbers make the trial a confirmation rather than a search, and they let a designer see early whether a part is easy, difficult or impractical to draw.

## Exercise: where does the circumference go?

The edge of SC-100's blank starts at a diameter of about 199.3 mm and ends at the cup's rim at 100 mm. By how much does its circumference shrink? If the whole of that shrinkage went into thickening the metal, with no change in its length along the wall, what would the rim's thickness become? What actually happens?

**Worked answer.** The circumference shrinks in the ratio 100 ÷ 199.3, to about **50%** of its original length, a true strain of ln(0.502) ≈ −0.69. If the metal kept its length along the wall and its volume, all of that would go into thickness, and 0.8 mm would become about 0.8 × 199.3 ÷ 100 = **1.59 mm**, nearly double.

In practice the shrinkage is shared. Some goes into thickening and much into lengthening the metal along the wall, which is drawn out by the tension that pulls the flange in. The rim of a drawn cup is therefore noticeably thicker than the sheet, though far from double, and the wall near the punch radius thinner. That variation is why the drawing note specifies the wall as nominal with limits, and why the blank holder in Chapter 5 must allow for a flange that thickens as it is drawn.
