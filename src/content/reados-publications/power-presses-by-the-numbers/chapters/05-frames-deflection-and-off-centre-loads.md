---
book: power-presses-by-the-numbers
chapterSlug: frames-deflection-and-off-centre-loads
order: 5
title: "Frames, deflection and off-centre loads"
description: "Gap and straight-side frames, how a gap frame tilts under load, what that does to a 0.15 mm clearance, breakthrough shock, off-centre loads, and a die on too flexible a press."
draft: false
---

Every press stretches when it works. The force that pushes the punch through the sheet pushes the frame apart just as hard, and a frame is a spring like any other. A straight-sided frame stretches evenly, and the ram stays parallel to the bolster. A gap frame, the C-shaped frame of most small presses, opens like a jaw: its throat widens, and the ram tilts. For a forming die that tilt hardly matters. For a cutting die with 0.15 mm of clearance, it can use up the clearance, wear the die's guides and spoil the edge, at loads well within the press's rating.

This chapter compares gap and straight-side frames, calculates how much Press 4's candidate deflects and tilts under MP-40's load, looks at the shock of breakthrough and at off-centre loads, and ends with MP-40's die tried on a press that was strong enough but not stiff enough.

## Two kinds of frame

**Gap frames**, also called C-frames, have an open front and open sides, with the ram and bolster joined only at the back. They are cheap, compact and easy to load from three sides, which suits hand-loaded work and small dies. Hodgson's single-acting open-back presses are early examples, and his chapter on press frames shows them being strengthened at the back with stay rods to stop the casting opening under load.

**Straight-side frames** have two columns, one at each side, joined by a crown at the top and a bed at the bottom, usually held together by prestressed **tie rods**. Loads are carried symmetrically, so the frame stretches without tilting the ram. They suit progressive dies, large dies and high-precision work, and they cost more and take more floor space.

Press 4's candidate is a gap-frame press, because AB-75 is hand-loaded from the front and MP-40's die is small. The question is whether its frame is stiff enough for MP-40's cutting clearance.

```figure
type: compare
title: Gap and straight-side frames
rowhead: Frame
cols: Access | Under load | Suits | Relative cost
caption: General characteristics. Makers publish deflections and allowable loads for each press; this chapter's figures are illustrations.
- * Gap frame, C-frame | front and both sides | throat opens; ram tilts | hand loading, small dies, forming | lower
- Gap frame with tie rods | front and sides | less opening; less tilt | as above, at higher loads | moderate
- Straight-side frame | front and back, between columns | stretches evenly; ram stays parallel | progressive dies, precision blanking, large dies | higher
```

## How a gap frame deflects

Under a load F at the ram, a gap frame does three things at once:

- its **columns stretch**, and the ram moves up relative to the bolster;
- its **throat opens**, because the load acts some distance in front of the frame's back, bending the C open;
- the ram and its face **tilt**, front up relative to back, by an angle that grows with the load.

Press makers sometimes publish a frame's vertical deflection and angular deflection at the rated load. This book uses, as an illustration for Press 4's candidate, a **vertical deflection of 0.40 mm** at 400 kN, a stiffness of 1,000 kN per millimetre, and an **angular deflection of 0.0015 radians**, about 0.09 degrees, at 400 kN. Both are taken as proportional to load.

At MP-40's 221.3 kN, 55% of the rating:

- vertical deflection: 0.40 × 221.3 ÷ 400 = **0.22 mm**;
- angular deflection: 0.0015 × 221.3 ÷ 400 = **0.00083 rad**.

The vertical deflection matters little: the punches simply enter the die 0.22 mm less under load than the shut height suggests, which the setter allows for when setting the entry (Chapter 7). The angular deflection matters more. Across the die's 300 mm depth from front to back, an angle of 0.00083 radians puts the front of the ram face **0.25 mm** higher than the back. And the tilt tries to swing the upper die sideways relative to the lower, which the die set's guide pillars resist by bending and by loading their bushes.

```figure
type: svg
title: A gap frame opening under load
alt: A side view of a C-shaped press frame. The back column is on the left, the upper arm reaching right to the ram, and the lower arm reaching right to the bed. A dashed outline shows the upper arm rotated slightly upward at its front under load, so that the ram face tilts with its front edge raised. Labels show the load F acting at the ram, the throat depth from the column to the ram's centre, and the angle of tilt.
caption: Exaggerated for clarity. The load acts in front of the back column, so the frame opens like a jaw and the ram face tilts. Across MP-40's 300 mm deep die, Press 4's illustrative 0.00083 rad tilt at 221.3 kN is 0.25 mm.
viewbox: 0 0 640 330
body:
<path class="bx" d="M60 30H460V100H180V230H460V300H60Z"/>
<path class="la draw dsh" pathLength="1" d="M180 100L460 84V30"/>
<path class="bxa" d="M400 100H480V140H400Z"/>
<text class="tx txs" x="486" y="125">ram and upper die</text>
<path class="bx" d="M400 200H480V230H400Z"/>
<text class="tx txs" x="486" y="220">lower die on bolster</text>
<path class="ln" d="M440 145V195"/>
<path class="ah" d="M434 185L440 197L446 185Z"/>
<text class="txa" x="448" y="175">F</text>
<path class="ln dsh" d="M120 165H440"/>
<text class="tx txs" x="190" y="160">throat depth</text>
<text class="tx txs" x="480" y="70">front lifts under load</text>
<text class="txb" x="80" y="320">back column</text>
```

## What the tilt does to the die

MP-40's die has a clearance of 0.15 mm per side and enters the die by 1.0 mm. Two effects of the tilt reach it.

- **Uneven entry.** With the front of the ram 0.25 mm higher than the back at full load, the punches at the front of the die enter about 0.25 mm less than those at the back. Set for 1.0 mm at the back, the front punches enter 0.75 mm. That is still enough to push slugs and blanks clear, but there is less margin.
- **Side load on the guides.** The tilt would move the punches towards the front of their die openings. MP-40's ball-bearing die set holds them central, so its pillars and bushes take the load instead, and wear faster than they would on a stiffer press. If they cannot hold the punches central, the clearance closes at one side, the cut becomes uneven, and the burr grows on the open side.

Both effects scale with load. That is why many shops do not run cutting dies near the full rating of a gap-frame press, even though the press is strong enough: the frame is not stiff enough at that load for a small clearance. This book's running case uses, as an illustrative shop rule, a limit of **60%** of a gap press's rating for progressive cutting dies. MP-40 on Press 4's candidate is at 55%.

```figure
type: bars
title: Tilt across MP-40's 300 mm deep die, by load on Press 4's candidate
unit: mm
max: 0.5
caption: This is an illustration with an angular deflection of 0.0015 rad at 400 kN, proportional to load. MP-40 runs at 221.3 kN. The shop's illustrative 60% limit is 240 kN.
- 100 kN | 0.11
- * 221.3 kN, MP-40 | 0.25
- 240 kN, the 60% limit | 0.27
- 400 kN, full rating | 0.45
```

## The shock of breakthrough

At MP-40's breakthrough, the load drops from about 221 kN to almost nothing in a few milliseconds. The frame, stretched by 0.22 mm, springs back, and the ram, its connecting rod and the upper die are thrown downward against the remaining slack in their bearings. This reverse load, or **snap-through**, is why blanking is noisy and hard on presses: it hammers the connecting rod's bearings and the ram's adjustment screw, and it can loosen bolts and dies.

Press makers state a reverse load capacity, usually a fraction of the press's rating. The die's force should be checked against it as well as against the forward rating. The remedies are those of the companion book: stepping punches so that not everything breaks through at once, grinding shear on the cutting edges so that the cut is spread out, and keeping the load well below the rating so that the frame stores less energy to release. Some presses, and some dies, carry hydraulic shock dampers that take up the reverse load.

Hydraulic presses suffer from snap-through too, often worse, because the oil column is compressed under load and releases its energy as well; Chapter 6 returns to it.

## Off-centre loads

A die's load should act on the ram's centreline. Off centre, it tilts the ram in its gibs and loads them sideways, whatever the frame's type. The companion book found MP-40's centre of load 23.44 mm from the die's middle; set on its middle, the die would apply a moment of 192.8 kN × 23.44 mm = **4.52 kN·m** to the ram on every stroke. Set with its centre-of-load mark on the ram's centreline, it applies none.

Press makers publish the eccentric load a press can take, often as a reduced force at a stated distance from the centre, and gap frames are more sensitive to front-to-back offsets than to side-to-side ones, because front-to-back offsets add to the frame's opening. A die that must work off centre, such as a hand-loaded die placed near the front of the bolster for the loader's reach, should be checked against those figures.

## Forming dies are more forgiving

The same tilt that troubles a cutting die barely affects most forming dies. AB-75's wiping die has a clearance between its punch and die of roughly the sheet's thickness, 3.0 mm, twenty times MP-40's cutting clearance, and its form is set by the punch's radius and the die's bottom, not by a sharp edge meeting another. At AB-75's 180 kN, Press 4's candidate tilts by 0.0015 × 180 ÷ 400 = 0.00068 radians, about 0.14 mm across a 200 mm deep die: small against a 3.0 mm clearance, though it does make the bend's angle very slightly different from front to back, which the bracket's tolerance easily covers.

That is why a gap press that would be marginal for a progressive cutting die can run forming work near its full rating, and why shops often keep their stiffest presses for cutting dies and their most open, accessible ones for hand-loaded forming. Press 4 has to do both, which is why its tie rods matter.

## Gibs and the ram's guidance

The ram slides in **gibs**, adjustable guides on each side of the frame, which hold it square to the bolster and resist the side loads of off-centre dies and the frame's tilt. Gibs are set with a small running clearance, enough for oil and for the ram to move freely, and they wear. As they wear, the clearance grows and the ram can float sideways and tilt within it, adding to the frame's own tilt and moving the punches relative to the die by the amount of the float.

This is an illustration. If Press 4's gibs had worn to a total clearance of 0.10 mm, the ram could shift 0.05 mm either way under a side load, a third of MP-40's 0.15 mm clearance. The die set's pillars would take most of it, as they take the frame's tilt, but a die set fighting both a tilting frame and a floating ram wears quickly. Gib clearance is measured with feeler gauges or a dial indicator pushing the ram sideways at the bottom of the stroke, checked at intervals the maker recommends, and taken up by adjusting the gibs or re-lining them.

## Measuring a frame

A maker's deflection figures are measured on a new press under controlled loading. For an existing press, or to check a new one on delivery (Chapter 10), the frame's behaviour can be measured directly:

- **vertical deflection**: a dial indicator mounted on the bolster, reading the ram's underside, while a known load is applied through a calibrated load cell or a die with a tonnage monitor;
- **angular deflection**: two dial indicators, at the front and back of the bolster, reading the ram face under the same load; the difference in their readings divided by their spacing is the tilt;
- **parallelism**: the same indicators with the ram at the bottom and no load, at several points across the bolster.

The readings are recorded with the press's records, so that a later measurement shows whether the frame, the gibs or the connecting rod's bearings have changed.

## The bolster and bed

The frame is not the only thing that bends. The bolster plate and the bed under it carry the die's load to the frame's sides, and they deflect between their supports like a beam. A heavy die load concentrated in a small area in the middle of a wide bolster bends the bolster most, and a thin die shoe follows it. Die shoes are made thick enough to spread the load, and parallels or sub-plates under a short die (Chapter 7) must be solid and flat, not a pair of thin strips that let the die sag between them.

## The error: strong enough but not stiff enough

This is an illustration. Before Press 4 was bought, MP-40's die was tried on the shop's older **250 kN** gap-frame press. The die's 221.3 kN was within its rating, at 88%. Its maker's data gave an angular deflection of 0.0020 radians at its rated 250 kN, so at 221.3 kN the tilt was about 0.0018 radians, **0.53 mm** across the die's 300 mm depth: more than three times the clearance.

The die ran, but within about 2,000 strokes the toolmaker found the ball-bearing bushes running hot, the pillars marked on their front faces, and the plates' burr growing unevenly, small at the back and up to 0.09 mm at the front. The die set had been fighting the press's frame on every stroke.

The press was strong enough. It was not stiff enough. The die was taken off before the pillars were damaged beyond repair, and the requirement for Press 4 gained a line it had not had: angular deflection under MP-40's load small enough that the tilt across the die stays below about twice the clearance, together with the shop's rule of no more than 60% of a gap press's rating for progressive cutting dies. On the candidate, MP-40's tilt is 0.25 mm, inside that limit.

```figure
type: checklist
title: Frame checks before a cutting die is run on a gap press
caption: Force checks find presses that are too weak; these checks find presses that are too flexible.
- Load as a share of the rating | 55% on the candidate, under a 60% shop rule
- Angular deflection at the job's load, from the maker's data | 0.00083 rad at 221.3 kN
- Tilt across the die compared with its clearance | 0.25 mm against 0.15 mm per side
- Reverse load at breakthrough within the maker's capacity | stepped punches if needed
- Die on its centre of load, within the eccentric load allowed | no moment when set on the mark
- x Within rating but too flexible | 0.53 mm tilt on the 250 kN press; pillars marked in 2,000 strokes
```

## Exercise: tie rods

The press maker offers the candidate with tie rods fitted across the throat, which it states reduce the angular deflection to 0.0006 radians at 400 kN. Find MP-40's tilt across the die with tie rods, and the highest load at which a progressive cutting die of the same depth would stay within a tilt of 0.30 mm, twice its clearance.

**Worked answer.**

- At 221.3 kN: 0.0006 × 221.3 ÷ 400 = 0.00033 rad, a tilt of 0.00033 × 300 = **0.10 mm** across the die, less than the clearance.
- For a tilt of 0.30 mm across 300 mm, the angle is 0.001 rad, reached at 400 × 0.001 ÷ 0.0006 = **667 kN**, beyond the press's rating. With tie rods, the frame's stiffness no longer limits the die; the rating does.

Without tie rods, the same 0.30 mm tilt is reached at 400 × 0.001 ÷ 0.0015 = **267 kN**, 67% of the rating, which is the reasoning behind the shop's 60% rule. Tie rods restrict access from the sides of the throat, which matters for some hand-loaded work, but not for MP-40.
