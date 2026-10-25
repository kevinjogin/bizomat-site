---
book: checking-drawings-by-the-numbers
chapterSlug: stacks-across-the-assembly
order: 7
title: "Stacks across the assembly"
description: "Recalculate an assembly gap from the limits on every drawing in its loop, including the bought-out parts, find the surface that really takes the load, and see what tolerances the gap needs."
draft: false
---

Some of the most important numbers in an assembly appear on no drawing. The axial float of an arm on its pin, the gap between a guard and a moving part, the preload on a bearing pair: each is the sum and difference of dimensions spread across several drawings and the data sheets of bought-out parts. The designer usually works the gap out once, at nominal sizes, early in the design. The checker's task is to work it out again from what the drawings now say, at their limits.

This chapter shows how to set up a stack from the drawings, how to make sure each link in the loop is the surface that actually touches, and how to read the result: which links dominate, and what the tolerances must be for the gap to meet its requirement. The running case recalculates the tensioner arm's axial float on its pin and finds that the drawing locates the wrong wall of the retaining ring groove.

## Draw the loop before the numbers

A stack starts with a sketch, not a spreadsheet. Draw the parts along the axis of the gap, mark each contact surface, and trace a loop from one side of the gap, through each part in turn, back to the other side. Each step in the loop is a dimension between two surfaces of one part, or the thickness of a bought-out part, and each must be a surface that touches its neighbour in the assembled condition.

That last condition is where stacks go wrong. A part has two surfaces where one might think there is one: the two walls of a groove, the two faces of a washer, a shoulder and the radius beside it. The loop must pass through the surface that carries the contact when the gap is measured. If the arm is pushed towards the pin's free end, the washer pushes the retaining ring towards the free end, and the ring bears on the groove wall nearer the free end, not the one nearer the head.

## The running case: the arm's axial float

This is an illustration. The design brief requires the arm to have **0.1 to 0.5 mm** of axial float on its pin: enough to turn freely, little enough to keep the pulley aligned. Along the pin's axis, the loop runs from the underside of the pin's head, through a washer, the arm's pivot boss and a second washer, to the retaining ring, and through the ring to the groove wall it bears on.

The drawings and data sheets give:

- pin TA-202: groove inner wall, the one nearer the head, **34.0 to 34.1 mm** from the underside of the head; groove width **1.10 to 1.24 mm**;
- arm TA-201: pivot boss length **30.0 ±0.1 mm**;
- washers, per the supplier's data in this illustration: **1.5 ±0.1 mm** each;
- retaining ring, per its supplier's data in this illustration: thickness **0.94 to 1.00 mm**.

The ring bears on the groove's outer wall, which is at the inner wall's position plus the groove width: 34.0 + 1.10 = 35.10 mm to 34.1 + 1.24 = 35.34 mm from the head. The ring's face towards the head is one ring thickness inside that: 35.10 − 1.00 = **34.10 mm** to 35.34 − 0.94 = **34.40 mm**. The washers and boss stack up to 1.4 + 29.9 + 1.4 = **32.7 mm** to 1.6 + 30.1 + 1.6 = **33.3 mm**.

The float is the space between them: 34.10 − 33.3 = **0.80 mm** to 34.40 − 32.7 = **1.70 mm**. Even the smallest possible float is above the brief's 0.5 mm maximum.

```figure
type: formula
title: Axial float of the arm on its pin
formula: float = (groove inner wall + groove width − ring thickness) − (washer + boss + washer)
caption: This is an illustration. The ring bears on the groove's outer wall, so the groove width is a link in the loop. Smallest float uses the smallest positions and the largest stack.
- Groove inner wall | 34.0 to 34.1 mm from the underside of the head
- Groove width | 1.10 to 1.24 mm
- Ring thickness | 0.94 to 1.00 mm
- Washer, each | 1.5 ±0.1 mm
- Boss | 30.0 ±0.1 mm
step: Ring face from the head: 35.10 − 1.00 = 34.10 to 35.34 − 0.94 = 34.40 mm
step: Washers and boss: 32.7 to 33.3 mm
step: Float: 34.10 − 33.3 = 0.80 to 34.40 − 32.7 = 1.70 mm, against 0.1 to 0.5 required
```

## How it happened

The designer's layout had put the ring's load-bearing wall at 34.3 mm from the head: a nominal stack of 33.0 mm, plus 0.3 mm of float, plus 1.0 mm of ring. When the drafter dimensioned the pin, the groove was located by its inner wall, the one nearest the head, which is the natural edge to dimension from when drawing a groove from the head outwards, and the value 34.0 to 34.1 mm was entered against it. That moved the load-bearing wall out by the groove's width, about 1.1 mm, and the float with it.

The fault is a mismatch between the surface the drawing locates and the surface the function uses. The count in Chapter 4 found the groove fully dimensioned, and the loop check in Chapter 5 found it consistently dimensioned; neither could see that it was dimensioned from the wrong wall. Only a stack traced through the actual contact found it.

## Which links matter

The width of the float's range, 1.70 − 0.80 = 0.90 mm, is the sum of the widths of the tolerances in the loop. Listing them shows where it comes from.

```figure
type: stack
title: Where the 0.90 mm spread in axial float comes from, as drawn
unit: mm
caption: This is an illustration. Each segment is the full tolerance width of one link. The two washers contribute most, and the groove contributes through both its position and its width.
- Two washers, ±0.1 each | 0.4
- Groove inner wall position and width | 0.24
- Pivot boss, ±0.1 | 0.2
- Retaining ring | 0.06
```

The brief allows a spread of only 0.5 − 0.1 = 0.4 mm. As drawn, the washers alone use it all. Moving the groove fixes the nominal float but not the spread: with these tolerances, no groove position can keep both ends of the range inside 0.1 to 0.5 mm.

## What the gap needs

The checker reported the fault and the spread, and the designer and approver looked at the options.

**Dimension the load wall, and tighten the loop.** Locate the groove's outer wall from the head directly, so that the groove width drops out of the loop, and tighten the other links. With washers of a precision grade at 1.5 ±0.05 mm, the boss at 30.0 ±0.05 mm and the outer wall at **34.25 to 34.29 mm**, the stack is 32.85 to 33.15 mm, the ring face is 34.25 − 1.00 = 33.25 to 34.29 − 0.94 = 33.35 mm, and the float is **0.10 to 0.50 mm**: exactly the brief, with no margin.

**Select a washer at assembly.** Keep the looser tolerances, measure the gap at assembly and fit one of three washer thicknesses to bring the float into range. It is cheaper in machining and costs a measurement and a stock of washers.

**Use a statistical stack.** With capable processes, the chance of every link sitting at its worst limit together is small. The root-sum-square of the revised half-tolerances is about 0.094 mm, against a worst-case half-spread of 0.20 mm. *Fits That Work* explains when that argument is sound; the approver judged it not yet justified for a supplier whose capability was unknown.

```figure
type: range
title: Axial float of the arm, as drawn and revised
min: 0
max: 1.8
unit: mm
caption: This is an illustration. The revised design dimensions the groove's load-bearing wall from the head and tightens the washers and boss.
ticks: 0 | 0.6 | 1.2 | 1.8
- As drawn | 0.8 | 1.7
- *Revised, worst case | 0.1 | 0.5
- Required by the brief | 0.1 | 0.5
```

The approver chose the first option, accepting the precision washers' price, and asked that the pin drawing's note say which wall is located: "GROOVE OUTER WALL (RING LOAD FACE) 34.25/34.29 FROM UNDERSIDE OF HEAD". The groove's width stayed on the drawing for the ring's sake, now with the inner wall's position following from it.

## What selective assembly would have needed

The approver chose tighter tolerances, but it is worth seeing what the second option involves, because it is often the cheaper answer for small batches and the checker should be able to set it out.

This is an illustration. Keep the boss at 30.0 ±0.1 mm and one standard washer at 1.5 ±0.1 mm, dimension the groove's load wall at 34.25 to 34.29 mm, and leave the second washer to be selected at assembly. The assembler fits the arm, the first washer and the ring, pushes the arm against the head side and measures the gap g between the arm's boss and the ring. From the limits, g lies between 33.25 − (30.1 + 1.6) = **1.55 mm** and 33.35 − (29.9 + 1.4) = **2.05 mm**.

Three selective washers of 1.25, 1.50 and 1.75 mm, each ±0.05 mm, cover that range. If g is 1.55 to 1.70 mm, the 1.25 mm washer gives a float of 0.25 to 0.50 mm; from 1.70 to 1.95 mm, the 1.50 mm washer gives 0.15 to 0.50 mm; from 1.95 to 2.05 mm, the 1.75 mm washer gives 0.15 to 0.35 mm. Every arm can be brought into the brief's 0.1 to 0.5 mm.

```figure
type: compare
title: Selecting the second washer at assembly
cols: Measured gap g | Washer to fit | Resulting float
caption: This is an illustration. g is measured between the boss and the ring with one standard washer fitted. Each selective washer is ±0.05 mm.
- Band 1 | 1.55 to 1.70 mm | 1.25 mm | 0.25 to 0.50 mm
- Band 2 | 1.70 to 1.95 mm | 1.50 mm | 0.15 to 0.50 mm
- Band 3 | 1.95 to 2.05 mm | 1.75 mm | 0.15 to 0.35 mm
```

The drawing set would then need an assembly note giving the measurement, the bands and the washer part numbers, and the parts list would show the selective washer as "1 OFF, SELECT AT ASSEMBLY". A checker reviewing a set that uses selective assembly checks that the bands cover the full range of g without gaps and that each band's float meets the requirement, exactly as above.

## Bought-out parts are links too

Two of the four links in this loop come from supplier data sheets, not drawings. They are as much part of the stack as any machined dimension, and three things can go wrong with them.

- **The data sheet is not the one ordered.** A parts list that names a washer by type but not by part number lets the buyer choose any washer of that type, with whatever thickness tolerance it has. The parts list must name the exact part, and the checker uses that part's data.
- **The data sheet gives a nominal only.** Some catalogues list a thickness without a tolerance. The checker should ask for the tolerance or assume a conservative one and say so.
- **The part changes.** A supplier may change a product's tolerance or a buyer may substitute an equivalent. The check record should name the data sheet and its date, so that a later substitution can be checked against the stack it affects.

## Recording the stack

A stack that lives only in a spreadsheet on the checker's computer helps nobody at the next revision. The office keeps each stack on the check record as a short table: the loop sketch, each link with its drawing or data sheet and its revision, the limits used, and the result against the requirement. When the pin drawing is later revised for any reason, the drafter can see that the groove position is a link in the float stack and that the stack must be redone. Without the record, the next revision could move the groove back to the inner wall and nobody would know that it mattered.

## Stacks the checker should always do

Not every gap needs a full stack, but some always do. For any assembly, the checker should look for:

- axial float or preload on any rotating part;
- clearance between moving parts and anything fixed, at both ends of their travel;
- engagement of retaining features, such as how much of a ring is supported in its groove;
- fastener lengths, from the thread engagement needed to the depth available;
- any gap the design brief or the designer's calculations name.

Each of those gaps can also change with temperature, load and wear: a float that is right at 20 °C may close when the arm runs hot, and a bolt clearance that is right when new may close as a bush wears and the arm drops. The checker does not usually calculate those effects, which belong to the designer, but should ask whether the design brief names the conditions at which each gap must hold, and note on the record which condition the stack assumed.

For the tensioner, that list produced four stacks: the axial float, the pulley's alignment, which Chapter 4 secured, the pulley guard's clearance at both ends of the arm's travel, and the pulley bolt's thread engagement in the M12 spindle hole. The last three passed.

## Exercise: the pulley bolt's engagement

The pulley is held on the arm's spindle boss by an M12 bolt through its centre into the spindle hole, which is tapped through the 20 mm spindle boss. The bolt is 45 mm long under the head, per its supplier. Under the head, the bolt passes through a 2.5 ±0.2 mm washer and the pulley's hub, 18.0 ±0.2 mm long, before entering the thread. The design brief asks for at least 15 mm of thread engagement in the cast iron. Does the bolt engage enough, and does it protrude beyond the boss?

**Worked answer.** The length of bolt available beyond the pulley hub is the bolt's length less the washer and hub: from 45 − 2.7 − 18.2 = **24.1 mm** to 45 − 2.3 − 17.8 = **24.9 mm**, taking the bolt's own length tolerance as negligible for this check.

The tapped boss is 20 mm long, so the engagement is limited to the boss: **20 mm**, more than the required 15 mm, in every case.

The bolt protrudes beyond the boss's rear face by 24.1 − 20 = **4.1 mm** to 24.9 − 20 = **4.9 mm**. That is acceptable if nothing behind the boss can touch it. The arm sweeps past the conveyor frame's cross member, and the guard clearance stack must include the protruding bolt end, about 5 mm, which the drafter's layout had not shown. The checker added it to the guard stack, which still passed with 6 mm to spare.
