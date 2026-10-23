---
book: weld-repairs-that-hold
chapterSlug: welding-sequence-back-step-and-balance
order: 4
title: "Welding sequence: back-step and balance"
description: "Use back-step, skip and balanced sequences to spread shrinkage, and plan the order of welds so each one works against the smallest restraint."
draft: false
---

If one instruction defines the 1919 Airco booklet, it is the back-step. Tack the joint for an inch at the start. Move about ten inches along. Weld back to the start. Move another ten inches and weld back to the end of the previous run. Repeat until the seam is complete. The booklet applies the method to seams, patches, door collars and cracks, and states its purpose plainly: it prevents the joint from spreading under unequal expansion.

This chapter explains why a sequence changes the result even when the total amount of weld is the same, and how modern practice extends the idea.

## What a sequence controls

The total shrinkage of a joint depends largely on how much metal is deposited and how much heat goes in. The sequence changes how that shrinkage is distributed in space and time. A long weld made continuously in one direction heats the plate progressively ahead of the arc or flame. The hot plate ahead expands and pushes the joint open; the cooling weld behind pulls it closed. The two halves of the joint can scissor apart or close up unevenly, and the joint may finish out of position or with a gap that has closed too far.

The back-step works by keeping each segment short and finishing every segment against weld that is already solid. Each new segment starts in comparatively cool plate and moves towards a fixed point, so the root opening ahead of it is not being pushed apart by heat from a long run, and the shrinkage of each segment is resisted by the completed weld it joins.

```figure
type: svg
title: A back-step sequence
alt: A seam divided into segments by points 1 to 5. An arrow above shows the overall progress from left to right. Each segment is welded from right to left, back towards the completed weld, in the order a, b, c, d.
caption: Each short segment is welded back towards the finished weld, while the seam as a whole advances.
viewbox: 0 0 600 220
body:
<path class="ln" d="M40 120H560"/>
<path class="lf" d="M60 108V132M180 108V132M300 108V132M420 108V132M540 108V132"/>
<text class="tx txs" x="60" y="100" text-anchor="middle">1</text>
<text class="tx txs" x="180" y="100" text-anchor="middle">2</text>
<text class="tx txs" x="300" y="100" text-anchor="middle">3</text>
<text class="tx txs" x="420" y="100" text-anchor="middle">4</text>
<text class="tx txs" x="540" y="100" text-anchor="middle">5</text>
<path class="la draw" d="M172 150H72"/>
<path class="ah" d="M74 143L60 150L74 157Z"/>
<path class="la draw" d="M292 150H192"/>
<path class="ah" d="M194 143L180 150L194 157Z"/>
<path class="la draw" d="M412 150H312"/>
<path class="ah" d="M314 143L300 150L314 157Z"/>
<path class="la draw" d="M532 150H432"/>
<path class="ah" d="M434 143L420 150L434 157Z"/>
<text class="tx txs" x="120" y="180" text-anchor="middle">a</text>
<text class="tx txs" x="240" y="180" text-anchor="middle">b</text>
<text class="tx txs" x="360" y="180" text-anchor="middle">c</text>
<text class="tx txs" x="480" y="180" text-anchor="middle">d</text>
<path class="ln dsh" d="M60 56H520"/>
<path class="ah" d="M518 49L532 56L518 63Z"/>
<text class="txa" x="300" y="44" text-anchor="middle">Overall progress</text>
```

## Step length scaled with thickness

The booklet scaled the step with plate thickness when welding cracks where expansion "must be carefully considered". It gave jumps of about 6 inches for 1/4 inch plate, 10 inches for 3/8 inch plate and 12 inches for 1/2 inch plate. In metric terms, roughly 152 mm for 6.4 mm plate, 254 mm for 9.5 mm plate and 305 mm for 12.7 mm plate.

The logic is that thicker plate is stiffer and holds more heat, so a longer segment can be welded before the joint starts to move. Treat those figures as historical practice for one process, not as values for an arc repair today. Modern step lengths come from the qualified procedure, trials and experience with the actual joint and restraint.

```figure
type: bars
title: Back-step lengths in the 1919 booklet
unit: mm
max: 320
caption: Converted from the booklet's inches. Historical oxyacetylene practice, not a modern procedure value.
- 1/4 inch (6.4 mm) plate | 152
- *3/8 inch (9.5 mm) plate | 254
- 1/2 inch (12.7 mm) plate | 305
```

## Other sequences with the same purpose

Modern guidance, including TWI's job knowledge articles on distortion control, describes several related techniques:

- **Back-step welding**: the booklet's method, short segments laid against the general direction of progress.
- **Skip or wandering sequences**: segments laid at spaced positions along the joint and then the gaps filled, so heat is distributed rather than concentrated.
- **Balanced welding**: alternating sides of a double-V joint, or welding symmetrically about a member's neutral axis, so that each shrinkage is opposed by an equal one.
- **Order of joints**: welding the most restrained joints first while the structure can still accommodate movement, and leaving joints that close a frame until last.

The booklet used several of these without naming them. It welded firebox flues in groups of three across the tube sheet so expansion was spread. It completed patches in stages, letting the work go cold between them and preheating the plate at the start of each new run. On cylindrical shells it welded the sides of triangular patches one at a time, cooling between each.

## Sequence in a crack repair

A crack repair adds a complication: the excavated groove is surrounded on every side by restrained plate. The weld's shrinkage cannot be accommodated by the structure moving, so it appears as stress, concentrated at the ends of the repair. The booklet responded by preheating one end of a crack before welding and reheating the other end afterwards, so the plate near the ends shared the contraction.

Modern crack repairs rely on several measures together: a groove that tapers gently at its ends, a sequence and segment length set by a qualified procedure, controlled preheat and interpass temperature (Chapter 5), and inspection after welding, because the ends of a repair are where new cracks most often start.

## The tank case: writing down the sequence

This is an illustration. For the 170 mm crack repair, the workshop's welding supervisor writes a short sequence plan to sit beside the welding procedure:

1. Run the root in short back-step segments, starting about 40 mm from one end of the groove and welding back to that end, then continuing in similar segments to the far end.
2. Let the interpass temperature fall within the procedure's limit before each subsequent pass.
3. Make fill and cap passes in the same back-step pattern, staggering the segment ends so they do not line up from pass to pass.
4. Inspect the completed weld, with particular attention to both ends of the repair.

The segment length is a starting point for this joint, to be confirmed by the procedure and adjusted if the trial shows movement or cracking. The plan exists so that the sequence is a deliberate decision rather than a habit of whoever is welding that day.

## Exercise: count the segments

A 1.2 m seam is to be welded by back-step in 250 mm segments, after an initial 25 mm tack at the start. How many full segments are needed, and how long is the last one?

After the 25 mm start, **1,200 − 25 = 1,175 mm** remain. That is **4 full segments of 250 mm (1,000 mm)** and a final segment of **175 mm**. Explain why some supervisors would instead plan five equal segments of 235 mm, and what the booklet's practice of "tack, move ten inches, weld back" implies about where the first segment starts.
