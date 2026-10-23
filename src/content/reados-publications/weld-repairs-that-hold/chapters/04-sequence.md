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

## Sequencing an insert

An insert is a closed loop of weld, and closed loops are unforgiving. The last segment of the perimeter closes the loop against weld that has already cooled and shrunk, so it is welded under the highest restraint of all. Sequence planning for inserts therefore aims to spread the shrinkage evenly around the perimeter and to make the closing segments as short and as early as practical.

Common principles include:

- **Do not start or stop at a corner.** Corners concentrate stress, and a start or stop there combines the worst geometry with the most likely place for a defect. Start partway along a straight side.
- **Balance opposite sides.** Weld a segment on one side, then a segment on the opposite side, so that each shrinkage is partly opposed by its mirror image rather than pulling the insert towards one edge.
- **Use short segments in back-step order** on each side, as described above, so each segment finishes against solid weld.
- **Weld the root around the whole perimeter before filling**, where the procedure allows, so the insert is held evenly before heavier passes add more heat.

The booklet's instructions for door collars, holes and patches follow the same pattern: tack at more than one point, back-weld in short segments from each tack, and complete the loop in a planned order rather than continuously.

## Sequence through the thickness

Most repair welds in plate over a few millimetres thick need several passes. Sequence matters through the thickness as well as along the length:

- **Stagger the stops and starts.** If every pass starts and stops at the same place, the weak points line up through the joint. Offsetting each pass's segment ends by a short distance avoids that.
- **Alternate the direction of travel** between passes where the procedure permits, so the heat distribution does not always favour one end.
- **Control interpass temperature.** Waiting for the joint to cool to within the procedure's limit before the next pass prevents heat from accumulating, which would widen the hot zone and increase shrinkage.
- **Balance through the thickness** with double-sided joints, alternating sides so that angular distortion from one side is corrected by the next.

For thick sections, welders sometimes build the joint in blocks or cascades, filling short lengths to full depth in a planned order rather than laying each pass along the whole length. These are procedure decisions, set and qualified for the joint.

## Order of joints in a structure

When a repair involves several welds, the order between them matters as much as the order within each. General guidance, consistent with the distortion control principles TWI describes, includes:

1. **Weld the joints with the most shrinkage first** while the structure is still free enough to accommodate them, then the joints that tie the structure together.
2. **Weld from the centre of a structure outwards**, so shrinkage can move towards free edges rather than being trapped between completed welds.
3. **Complete butt joints in plates before the fillet welds** that attach stiffeners across them, so the butt weld can shrink without fighting the stiffeners.
4. **Leave closing joints until last**, and keep them short.

None of these rules is absolute. They are starting points to be checked against the actual geometry and restraint, and confirmed by trial where distortion matters.

```figure
type: steps
title: Planning the order of welds in a repair
caption: Free the shrinkage where you can, and keep the most restrained welds short.
- Identify every weld in the repair
- Rank them by shrinkage and restraint
- Weld the high-shrinkage joints first
- Work from the centre towards free edges
- Butt welds before crossing fillets
- *Close the loop last, in short segments
```

## The tank case: sequencing the base insert

This is an illustration. The 400 mm by 300 mm insert from Chapter 6 has a perimeter of about 1,314 mm. The supervisor divides it into nine segments of roughly 146 mm, numbered around the loop with no segment boundary at a corner. The root is welded in the order 1, 5, 3, 7, 2, 6, 4, 8 and then 9, alternating between opposite sides of the insert, with each segment welded back towards the end of a previous one. Fill and cap passes follow the same pattern with segment ends offset by about 25 mm.

Punch marks across the long sides and a straightedge across the insert are measured before welding, after the root and after cooling. The plan sits in the repair record with the measurements, so that if the insert dishes or a crack appears, the sequence can be reviewed rather than guessed.

## Recording the sequence

A sequence that exists only in the supervisor's head is not a control. A useful sequence record is a simple sketch of the joint with segments numbered in welding order, the direction of each segment marked with an arrow, and space for the welder to initial each segment as it is completed. It takes minutes to prepare, and it lets an inspector confirm afterwards that the planned sequence was followed.

The booklet's drawings, with their numbered points and instructions to weld from point 2 back to point 1, then 3 to 2, were exactly such sequence sketches. They are one of the most transferable ideas in the whole document.

## Tacking is the first sequence decision

Every sequence begins with tack welds, and tacks deserve more respect than they usually get. They hold the joint at its intended gap while the first segments go in, which means they resist the shrinkage of every pass that follows. A tack that is too small can crack as the joint closes; a tack that is too large becomes a lump of weld that the root pass must fuse into without defects.

Good practice treats tacks as part of the weld:

- **Make them to the same procedure** as the root pass, including preheat and low-hydrogen consumables, because they become part of the finished joint.
- **Space them evenly and close enough** to hold the gap, closer in thin plate and in tightly curved joints.
- **Inspect them before welding over them.** A cracked tack must be ground out, not buried, because the crack will propagate into the weld.
- **Feather their ends** by grinding, so the root pass can blend in without a lack of fusion at each tack.
- **Place them with the sequence in mind.** The booklet tacked an inch at the starting point and then back-welded towards it. A modern sequence sketch shows where the tacks are, because each one is a point the segments work towards.

In repair work, tacks also hold inserts in position against any distortion already present in the surrounding plate. If the insert does not fit without force, stop and find out why: forcing it into place with tacks locks in stress before welding has even begun.

## When sequence is not enough

Sequence reduces and redistributes shrinkage; it does not eliminate it. If a trial or the first segments show unacceptable movement or cracking, the response may include reducing heat input, adding temporary restraint, increasing preheat, changing the joint preparation or reconsidering the repair itself. Record what was observed and what was changed, because the next repair of a similar part will benefit from the evidence.

## Exercise: count the segments

A 1.2 m seam is to be welded by back-step in 250 mm segments, after an initial 25 mm tack at the start. How many full segments are needed, and how long is the last one?

After the 25 mm start, **1,200 − 25 = 1,175 mm** remain. That is **4 full segments of 250 mm (1,000 mm)** and a final segment of **175 mm**. Explain why some supervisors would instead plan five equal segments of 235 mm, and what the booklet's practice of "tack, move ten inches, weld back" implies about where the first segment starts.
