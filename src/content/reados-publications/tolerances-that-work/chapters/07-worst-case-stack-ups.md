---
book: tolerances-that-work
chapterSlug: worst-case-stack-ups
order: 7
title: "Worst-case tolerance stack-ups"
description: "Draw a dimension loop, add tolerances through a chain of parts, test the guide roller's axial float and compare the design options when the worst case does not fit."
draft: true
---

An assembly condition such as a gap, an overlap or an alignment is rarely set by one part. It is the sum of dimensions on several parts, each with its own tolerance. A tolerance stack-up adds them up to find the range of the assembled condition. The worst-case method assumes every part could sit at the least favourable limit at the same time, and asks whether the assembly still works.

This chapter builds the stack-up for the Northgate guide roller's axial float step by step. It shows a reliable way to draw the chain, convert tolerances, calculate the result and then decide what to change when the answer is unacceptable.

## The requirement

The two bearing outer rings and the spacer sit in the housing bore between the shoulder at the inner end and an internal retaining ring at the outer end. When the parts are pushed towards the shoulder, a gap remains between the outer bearing face and the retaining ring. That gap is the axial float.

From Chapter 1, the float must stay between **0.05 mm and 0.40 mm**. The lower limit makes sure the ring can always be fitted and that the stack is not squeezed when the aluminium housing and steel parts change temperature by different amounts. The upper limit stops the shaft and roller from shuttling enough to disturb belt tracking.

## Drawing the dimension loop

A dimension loop is a closed chain of dimensions that starts on one side of the gap and returns to the other side through the parts. A consistent method prevents most errors:

1. **Fix the gap and its direction.** Name the gap G and decide which way is positive. Here, positive means the float is open.
2. **Pick a starting face.** Start at one face of the gap, the inner face of the retaining ring.
3. **Travel through contacting parts.** Move from part to part across the faces that actually touch, following the load path, until you arrive back at the other face of the gap.
4. **Assign a sign to each step.** A step that makes the gap larger when the dimension grows is positive; one that makes it smaller is negative.
5. **Use one dimension per part where possible.** Each part should contribute the single dimension between its two contact faces in the loop.

For the guide roller, the loop runs from the ring's inner face, through the ring's thickness to the groove's load-bearing outer wall, along the housing from that wall to the bore shoulder, then back through the first bearing outer ring, the spacer and the second bearing outer ring to the outer bearing face that forms the other side of the gap.

Written as an equation:

**G = A − t − B1 − S − B2**

```figure
type: svg
title: The axial float dimension loop in the guide roller
alt: Section through the housing bore showing, from left, the bore shoulder, bearing B1, spacer S, bearing B2, the float gap G, the retaining ring t and the groove wall. Dimension A runs from shoulder to groove wall as a positive link; t, B1, S and B2 are negative links.
caption: The loop starts at the ring, runs through the housing to the shoulder and returns through the parts. The gap is drawn larger than scale.
viewbox: 0 0 640 330
body:
<path class="bx" d="M30 60H70V250H30Z"/>
<path class="bx" d="M560 60H600V250H560Z"/>
<rect class="bxi" x="70" y="90" width="138" height="130" rx="3"/>
<rect class="bx" x="208" y="120" width="184" height="70" rx="2"/>
<rect class="bxi" x="392" y="90" width="138" height="130" rx="3"/>
<rect class="bxa pulse" x="530" y="90" width="12" height="130"/>
<rect class="fi" x="542" y="80" width="18" height="150" rx="2"/>
<text class="txb" x="139" y="160" text-anchor="middle">B1</text>
<text class="txb" x="300" y="160" text-anchor="middle">S</text>
<text class="txb" x="461" y="160" text-anchor="middle">B2</text>
<text class="txa" x="536" y="50" text-anchor="middle">G</text>
<text class="tx" x="551" y="250" text-anchor="middle">t</text>
<text class="tx" x="30" y="275">Shoulder</text>
<text class="tx" x="560" y="275">Groove wall</text>
<path class="la draw" pathLength="1" d="M70 300H560M70 292V308M560 292V308"/>
<text class="txa" x="315" y="292" text-anchor="middle">+A: housing, shoulder to groove wall</text>
<path class="li" d="M70 30H208M208 30H392M392 30H530M542 30H560"/>
<path class="ln" d="M70 24V36M208 24V36M392 24V36M530 24V36M542 24V36M560 24V36"/>
<text class="tx" x="139" y="20" text-anchor="middle">−B1</text>
<text class="tx" x="300" y="20" text-anchor="middle">−S</text>
<text class="tx" x="461" y="20" text-anchor="middle">−B2</text>
<text class="tx" x="600" y="20" text-anchor="middle">−t</text>
```

where A is the housing distance from shoulder to the groove's outer wall, t is the ring thickness, B1 and B2 are the bearing widths and S is the spacer length. A larger housing dimension opens the gap; every other part closes it.

## Make the drawings match the loop

The loop shows that the housing should be dimensioned **directly from the shoulder to the groove's outer wall**. If instead the drawing dimensioned both features from the outer end face, for example end face to shoulder and end face to groove each at ±0.05 mm, the housing would contribute two tolerances to the loop instead of one. The worst-case contribution of the housing would double from 0.05 mm to 0.10 mm without any change in manufacturing.

This is one of the most valuable outcomes of stack-up work. The loop tells the designer which dimensions to put on each drawing. Function, not drafting convenience, should decide the dimensioning scheme.

## Convert to mean and equal bilateral

Tolerances on the drawings are written in different ways. For calculation, convert each to a mean value with an equal plus-and-minus tolerance. The table shows the initial Northgate design. Bearing and ring tolerances are illustrative values of the kind given in supplier catalogues; check your own suppliers' data.

| Link | Drawing value | Mean | ± tolerance | Sign |
|---|---|---|---|---|
| A, housing shoulder to groove wall | 41.95 ± 0.05 | 41.95 | 0.05 | + |
| t, ring thickness | 1.75, deviations 0 / −0.06 | 1.72 | 0.03 | − |
| B1, bearing width | 12, deviations 0 / −0.12 | 11.94 | 0.06 | − |
| S, spacer length | 16 ± 0.05 | 16.00 | 0.05 | − |
| B2, bearing width | 12, deviations 0 / −0.12 | 11.94 | 0.06 | − |

## Calculate the worst case

The mean gap is the signed sum of the means:

G mean = 41.95 − 1.72 − 11.94 − 16.00 − 11.94 = **0.35 mm**

In a worst-case analysis, the tolerance of the result is the sum of the individual tolerances, regardless of sign, because each part could be at whichever limit hurts most:

G tolerance = 0.05 + 0.03 + 0.06 + 0.05 + 0.06 = **±0.25 mm**

So the float ranges from 0.35 − 0.25 = **0.10 mm** to 0.35 + 0.25 = **0.60 mm**.

As a check, calculate the extremes directly. The smallest gap occurs with the shortest housing and the longest of everything else: 41.90 − 1.75 − 12.00 − 16.05 − 12.00 = 0.10 mm. The largest occurs with the longest housing and the shortest of everything else: 42.00 − 1.69 − 11.88 − 15.95 − 11.88 = 0.60 mm. Both methods agree.

The minimum, 0.10 mm, satisfies the 0.05 mm limit. The maximum, 0.60 mm, exceeds the 0.40 mm limit. The initial design fails.

```figure
type: range
title: Worst-case axial float for each design against the requirement
min: -0.05
max: 0.65
unit: mm
ticks: −0.05 | 0.10 | 0.25 | 0.40 | 0.55 | 0.65
caption: The initial design's spread (0.50 mm) is wider than the window (0.35 mm), so no change of nominal can fix it.
- *Requirement | 0.05 | 0.40 | allowed float window
- Initial design | 0.10 | 0.60 | fails above 0.40 mm
- Revised: A and S at ±0.03 | -0.01 | 0.41 | fails narrowly at both ends
- Select-fit spacer | 0.10 | 0.30 | passes with margin
```

## Compare the range before moving the mean

The first instinct is often to change a nominal dimension. Making the housing dimension A 0.20 mm shorter would move the whole range to −0.10 mm to 0.40 mm, which now fails at the bottom instead of the top. Moving the mean cannot help when the **range** of the result is wider than the range allowed.

That comparison should always come first:

- Allowed range: 0.40 − 0.05 = 0.35 mm
- Worst-case range of the design: 2 × 0.25 = 0.50 mm

No choice of nominal dimensions can make a 0.50 mm spread fit into a 0.35 mm window. Something about the tolerances, the structure of the chain or the requirement must change.

## Sensitivity: not every link counts equally

In this loop, every dimension contributes with a sensitivity of one: a 0.01 mm change in any part changes the gap by 0.01 mm. That is typical of one-dimensional axial stacks. In other assemblies a link may be multiplied by a lever ratio, a trigonometric factor or a thread pitch. The general rule is that each tolerance contributes its value multiplied by the absolute sensitivity of the result to that dimension. For a gap measured at the end of a lever, for example, a pivot hole error may be magnified by the ratio of lever lengths. Identifying those multipliers is often more useful than any amount of arithmetic, because a link with high sensitivity is where tolerance is most expensive.

## Options when the worst case fails

Northgate's engineers considered four ways forward.

**1. Tighten the tolerances.** To pass on a worst-case basis, the total tolerance must be no more than ±0.175 mm, half of the 0.35 mm window. The two bearings alone take ±0.12 mm and are set by the bearing manufacturer. The ring takes ±0.03 mm, also fixed by the supplier. That leaves ±0.025 mm to share between the housing and the spacer, around ±0.0125 mm each. Holding a groove position to that accuracy on an aluminium housing is possible but costly and slow to inspect.

**2. Revise the tolerances that are cheap to control.** A modest tightening of A and S to ±0.03 mm each, with A reduced to 41.80 mm to centre the result, gives a mean float of 0.20 mm and a worst-case tolerance of ±0.21 mm. The worst-case range is **−0.01 mm to 0.41 mm**. It is much closer, but still fails narrowly at both ends.

**3. Select-fit the spacer.** Instead of a single spacer, make spacers in a small number of length grades. At assembly, measure the combined width of each bearing pair, or sort bearings by width, and choose the spacer grade that brings the bearing pair plus spacer to within ±0.04 mm of its target. The loop then has three effective contributors: the housing at ±0.03 mm, the ring at ±0.03 mm and the matched bearing-and-spacer set at ±0.04 mm. The worst case becomes 0.20 ± 0.10 mm, or **0.10 mm to 0.30 mm**, comfortably inside the requirement. The cost is measurement at assembly, spacer stock in several grades and a procedure that must be followed every time.

**4. Change the design.** A wave spring or spring washer in the stack could take up variation and maintain a light axial load on the outer rings. The requirement then changes from a float window to a spring load range, which is set by spring deflection rather than a gap. For some applications that is the best engineering answer; for this guide roller, Northgate wanted to keep the simple, spring-free arrangement.

```figure
type: compare
title: Four ways forward when the worst case fails
cols: Worst-case result | Main cost or risk
caption: Northgate kept the spring-free design and compared the revised tolerances statistically in Chapter 8.
- Tighten tolerances | Passes only with A and S near ±0.0125 mm | Slow, costly machining and inspection
- Revise cheap tolerances | −0.01 to 0.41 mm, narrow fail | Relies on statistics to accept the risk
- Select-fit the spacer | 0.10 to 0.30 mm, passes | Assembly measurement and graded spacer stock
- Change the design | Requirement becomes a spring load range | Adds a part and changes the bearing loading
```

The next chapter tests option 2 statistically. Many real assemblies are designed that way, because the chance of every part sitting at its worst limit at the same time is very small. Whether that risk is acceptable is a decision, not an arithmetic result.

## When worst case is the right method

Worst-case analysis guarantees that every combination of conforming parts assembles and works. It is the appropriate method when:

- the number of parts in the chain is small, so the chance of extreme combinations is not negligible;
- production volumes are low, so statistical averaging has little to work with;
- a failure would be dangerous or very costly, such as safety-critical clearances;
- the distributions of the part dimensions are unknown or poorly controlled; or
- parts come from many suppliers or production lots, so their means may differ.

Its weakness is cost. For long chains, it demands tolerances that are much tighter than needed for nearly all real assemblies.

## Common mistakes

- **Chaining dimensions through features outside the loop.** Each extra dimension adds its tolerance to the result.
- **Forgetting bought-in parts.** Bearings, rings, washers and gaskets belong in the loop.
- **Mixing nominal and mean values.** Statistical methods in particular need true means; a 12 mm bearing with deviations 0 and −0.12 mm has a mean of 11.94 mm.
- **Adjusting the mean when the range is the problem.**
- **Ignoring form and orientation.** If the spacer's end faces are not square, its effective length in the stack is not its measured length at one point. Chapter 9 adds such effects.

## Questions to ask

- Does the loop follow the actual load path through contacting faces?
- Does each part contribute one dimension, and do the drawings dimension that relationship directly?
- Is the worst-case range narrower than the allowed range?
- Which links are fixed by suppliers and which can the design control?
- Could select fitting, adjustment or a design change remove the need for very tight tolerances?

## Exercise: build a loop

Choose an assembly with a functional gap. Sketch the parts, mark the gap and draw the loop through contacting faces. Write the gap equation, convert each tolerance to mean and equal bilateral form, and calculate the worst-case range. Check your result by calculating the two extreme assemblies directly.

The revised Northgate design narrowly fails the worst-case test. The next chapter asks how likely those failing combinations really are.
