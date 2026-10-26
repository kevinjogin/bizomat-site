---
book: hand-forming-sheet-metal-by-the-numbers
chapterSlug: stretch-shrink-and-bend
order: 1
title: "Stretch, shrink and bend: what hand forming does"
description: "See the three things hand forming does to sheet, count the area change each part needs, decide by break-even when hand work beats tooling, and catch a quote that compared per-part costs only."
draft: false
---

Every shape a sheet metal worker makes by hand comes from three operations. **Bending** changes the sheet's shape without changing its area: a fold, a rolled cylinder, a cone. **Stretching** makes part of the sheet larger in area, and thinner: the middle of a dish hammered into a sandbag, a flange turned outwards on a curve. **Shrinking** makes part of the sheet smaller in area, and thicker: the rim of a bowl raised on a stake, a flange turned inwards on a curve. Everything else, from a mudguard to a domed lid, is a combination of the three.

The distinction matters because bending is easy and predictable, while stretching and shrinking are where the time goes, where the metal thins or wrinkles, and where the skill lies. A worker who can see, before starting, how much of a part must be stretched and how much shrunk can choose the blank, the tools and the order of work, and can estimate the time. This chapter introduces the three operations with the running case's three parts, then asks the commercial question that comes before any forming: should this job be done by hand at all?

## Developable and non-developable shapes

A shape that can be unrolled flat without stretching or shrinking is called **developable**. Cylinders, cones and the transitions in [Sheet Metal Patterns by the Numbers](/reados/publications/sheet-metal-patterns-by-the-numbers/) are developable: their patterns are drawn flat, cut, and bent up. A sphere, a dome, a saddle or a crowned panel is **non-developable**. No flat pattern bends into it, because its surface has a different area from any flat sheet that could cover it without distortion. To make it, the sheet must be stretched somewhere or shrunk somewhere, usually both.

A practical test is to lay a sheet of paper over the shape. Paper bends freely but does not stretch or shrink. On a cylinder it lies flat in one direction and wraps in the other. On a dome it wrinkles at its edges, which is the paper saying that the edge has too much material for the shape, and those wrinkles are exactly what a worker must shrink out, or avoid by stretching the middle instead.

## The running case: what HF-01 needs

This is an illustration. Job HF-01 has three parts per housing, each in 1.6 mm soft aluminium sheet, and each needs a different mix of the three operations.

**The dome** is a spherical cap 320 mm across and 80 mm high. Its sphere radius is R = (160² + 80²) / (2 × 80) = 200 mm, and its surface area is 2π R h = 2π × 200 × 80 = **100,531 mm²**. A flat disc 320 mm across has an area of only 80,425 mm². The dome has 25% more surface than a disc of its own diameter, and that 25% must come from stretching the disc, or from starting with a larger disc and shrinking its edge, or from some of each. Chapter 3 works out the choice.

**The mounting ring** is a band 30 mm high and 320 mm inside diameter, rolled from a strip, with a 20 mm flange turned inwards at the top. Rolling the band is pure bending. The flange is not: its inner edge must end at a radius about 20 mm smaller than the band's, so its length must shrink by about 20 / 160 = **12.5%**. Chapter 5 deals with it.

**The side access panel** is 600 × 300 mm with a gentle crown in both directions. Its centre line along the 600 mm length is an arc of radius 1,200 mm, about 1% longer than its chord. A crowned panel needs only a little stretching, about 1%, spread over its middle, which is what an English wheel does well. Chapter 6 covers it.

```figure
type: compare
title: What each HF-01 part asks of the sheet
cols: Main operation | Size of the change | Usual hand tools
caption: This is an illustration. Area and length changes from the parts' geometry; the tools are the traditional ones for each operation, and many workshops combine them.
- Dome, 320 × 80 mm cap | Stretch the middle, shrink the rim | Surface area 25% more than a 320 mm disc | Sandbag, hollowed block, raising stake, mallets, planishing hammer
- Ring flange, 20 mm on 320 mm | Shrink the flange edge | 12.5% shorter at the edge | Tucking fork, shrinker jaws, mallet
- Crowned panel, 600 × 300 mm | Stretch the middle a little | About 1% along the centre line | English wheel, templates
- Ring band and wired edge | Bend only | No area change | Slip rolls, folder, wiring by hand or machine
```

## Reading a part before forming it

A worker who has made a hundred domes reads a new part at a glance. Someone who has not can do the same reading deliberately, in a few minutes, with a tape, a flexible rule and a sketch.

```figure
type: steps
title: Reading a part for stretch and shrink
caption: This is an illustration of the workshop's planning routine, done on paper before any metal is cut. Each step uses only measurements of the part or its drawing.
- Mark the bends | lines where the shape is curved in one direction only; these need no stretch or shrink
- Measure lengths along the surface | run a flexible rule over the part and compare with straight distances
- Find where the surface is longer than the blank | those regions must be stretched
- Find where the blank is longer than the surface | those regions, usually edges, must be shrunk
- Estimate each change as a percentage | compare with the metal's capacity and the thickness limit
- Choose the operations and the order | usually stretch first while the metal is soft, shrink after, planish last
```

For a dome, the flexible rule tells the story at once. Laid over the top of HF-01's dome from rim to rim, it measures the meridian, an arc of 2 × 185.5 = 371 mm, against a straight 320 mm across the rim. A flat blank 320 mm across would have to stretch 16% along every diameter to cover the arc; a blank 371 mm across would cover the arc but would have far too much material at its edge, where its circumference of about 1,165 mm must become the rim's 1,005 mm. The worker's choice is where between those two extremes to start, and Chapter 3 calculates the answer.

For a flange on a curve, the reading is even simpler: the flange's edge is either further from the curve's centre than its root, and must stretch, or nearer to it, and must shrink, by the ratio of the two radii. For a crowned panel, the rule across the middle is a little longer than the rule across the edges, and that small difference is the stretch the wheel must put in.

## The tools, briefly

The traditional hand tools sort neatly by operation. For **stretching**: a sandbag or a hollowed hardwood block to hammer into, a round-faced mallet or bossing hammer, and the English wheel. For **shrinking**: a raising hammer and a stake to raise on, a tucking fork to crimp an edge into small folds that are then hammered closed, and the hand-operated shrinker, whose jaws grip the metal and push it together. For **bending**: a folder, slip rolls, stakes of various profiles and a mallet. For **smoothing**: a planishing hammer and a polished stake or dolly, used with light blows to flatten the marks left by everything else.

The aviation maintenance handbook listed in the references describes the same families of tools and operations for aluminium sheet, because aircraft repair is one of the places where hand forming of non-developable shapes is still routine.

## How the sheet's thickness follows its area

Metal deforming plastically keeps its volume almost exactly constant. A piece of sheet whose area grows must therefore get thinner in proportion, and a piece whose area shrinks must get thicker. If a region of 1.6 mm sheet is stretched to 1.25 times its area, its thickness falls to 1.6 / 1.25 = 1.28 mm. If a region is shrunk to 0.894 of its length while keeping its width, it thickens to 1.6 / 0.894 = 1.79 mm.

That one relationship drives most of the decisions in this book. The customer's drawing for HF-01 asks for at least 1.3 mm anywhere, so no region of the dome may be stretched by more than 1.6 / 1.3 = 1.23 times its area. A dome made by stretching a 320 mm disc, which needs 1.25 times the area on average, cannot meet the drawing even before the uneven distribution of stretch is considered. Chapter 2 makes this precise.

## When hand forming pays

Hand forming is slow and needs almost no tooling. Machine forming with tooling is fast per part and needs tooling paid for up front. The choice between them is a break-even calculation on quantity, made before anyone picks up a hammer.

This is an illustration. For HF-01's dome, the workshop's estimate for hand forming is 5.0 hours per dome at its rate of A$95 an hour, A$475 per dome excluding GST. A metal spinner quotes A$1,800 for a spinning chuck, a hardwood or steel former turned to the dome's shape, plus A$65 per dome, excluding GST. The break-even quantity is 1,800 / (475 − 65) = **4.4 domes**. Below five domes, hand forming costs less; from five upwards, spinning does.

```figure
type: bars
title: Total cost of HF-01 domes by quantity, A$ excluding GST
unit: A$
max: 4000
caption: This is an illustration. Hand forming at 5.0 h × A$95 = A$475 per dome; spinning at A$1,800 for the chuck plus A$65 per dome. GST of 10% is added to both on the invoice. The break-even is about 4.4 domes.
- Hand, 2 domes | 950
- *Spinning, 2 domes | 1930
- Hand, 4 domes | 1900
- Spinning, 4 domes | 2060
- Hand, 6 domes | 2850
- Spinning, 6 domes | 2190
```

HF-01 needs two domes: A$950 by hand against A$1,930 spun, or A$1,045 against A$2,123 including GST. Hand forming wins clearly at this quantity. The ring and panel have no cheap tooled alternative at all: a press tool for a crowned panel or a flanged ring would cost far more than the hours to form two of each by hand.

### Beyond cost

Break-even is not the only consideration. Hand forming's cost is mostly labour, so it depends on a skilled worker being available, and its quality varies with that worker. Spinning's cost is mostly tooling, so it rewards repeat orders and gives consistent parts. A customer who might order more housings next year changes the picture, because the chuck would then be paid for once and used again. And lead time can dominate: a spinner with a full order book may take weeks, while a hand-formed dome can start tomorrow. The estimator's job is to put these beside the numbers, not to let the numbers decide alone.

Scrap is the other consideration. A dome spoiled in the last hour of hand forming costs the blank and every hour before it. This is an illustration. If the workshop's records show that about one hand-formed dome in ten is scrapped or reworked at an average loss of three hours, the expected cost per good dome rises by 0.1 × 3 × 95 = A$28.50, to about A$503.50. That narrows the gap to spinning a little and moves the break-even down from 4.4 to about 4.1 domes. It does not change the answer for two, but it is a reason to keep scrap records, and a reason for the planning in Chapters 2 and 3, whose purpose is to make scrap less likely.

## The error: comparing per-part costs

This is an illustration. The workshop's first internal estimate for HF-01 was prepared by a new estimator, who obtained the spinner's price and compared it per dome: A$65 spun against A$475 by hand. The estimate recommended spinning both domes and would have quoted the customer on that basis, with the domes at a few hundred dollars less than the hand-formed price.

The workshop's manager, reviewing the estimate, asked for the total cost of the quantity actually ordered. At two domes, the A$1,800 chuck dominated: spinning would cost A$1,930 against A$950 by hand, nearly twice as much. The per-part comparison had silently assumed that the chuck was free, which is true only when its cost is spread over a large run.

The estimate was corrected, the job was quoted for hand forming, and the estimating template was changed so that every make-or-buy comparison shows the total cost at the quantity ordered and the break-even quantity, side by side. The estimator's instinct was not wrong in general: for a run of twenty domes, spinning would cost 1,800 + 20 × 65 = A$3,100 against A$9,500 by hand. It was wrong for two.

## Skill, time and the numbers

A skilled worker's estimate of time is itself a number, and it can be checked. The workshop's 5.0 hours per dome comes from its records of similar work, broken into stages: sinking the middle, raising the rim in courses, annealing, planishing, trimming and checking. Chapter 4 sets out that breakdown and Chapter 8 compares it with the hours actually booked. The point of calculating strain and blank size before forming is partly to make those hours predictable: a blank that is too small or a sequence that thins the metal too much costs a scrapped part and the hours already spent on it.

None of this replaces skill. It gives skill a plan to work to and a way to explain, to a customer or an apprentice, why a dome needs a bigger blank than its rim suggests, or why a flange on a curve wrinkles.

## Exercise: six housings

The customer asks for a price for six housings instead of two, with all six delivered at once.

1. What are the totals for six domes by hand and by spinning, excluding and including GST?
2. Which would you recommend, and what else would you ask the customer before deciding?

**Worked answer.**

1. By hand: 6 × 475 = **A$2,850** excluding GST, A$3,135 including. Spun: 1,800 + 6 × 65 = **A$2,190** excluding GST, A$2,409 including. At six, spinning is A$660 cheaper before GST.
2. On cost alone, spinning, since six is above the break-even of about 4.4. Before recommending it, ask whether more housings are likely later, which would strengthen the case for owning a chuck; what the delivery date is, since the spinner's lead time may matter more than A$660; and whether the customer accepts the slightly different surface of a spun dome, which shows fine circumferential lines, alongside hand-formed rings and panels. It is also worth asking the spinner whether the chuck price includes trial spinning and adjustment, since a chuck that needs reworking after the first dome changes the numbers.
