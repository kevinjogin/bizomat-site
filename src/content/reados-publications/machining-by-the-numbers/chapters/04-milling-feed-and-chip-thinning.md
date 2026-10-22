---
book: machining-by-the-numbers
chapterSlug: milling-feed-and-chip-thinning
order: 4
title: "Milling: feed per tooth, chip thinning and feed rate"
description: "Calculate milling feed rates from feed per tooth, correct for radial chip thinning and lead angle, and estimate removal rate and time for side milling and face milling."
draft: false
---

In turning, one edge cuts continuously. In milling, several teeth take turns, each entering and leaving the work once per revolution and removing a small, comma-shaped chip. The quantity that matters to the tool is the thickness of that chip. The quantity the machine needs is the feed rate in millimetres per minute. Linking the two is straightforward when the cutter is fully engaged and surprisingly easy to get wrong when it is not.

This chapter covers feed per tooth and feed rate, the effect of radial engagement and lead angle on chip thickness, and removal rate and time for side and face milling.

## Feed per tooth and feed rate

Tool suppliers specify milling feeds as **feed per tooth**, fz, in mm per tooth, because each tooth's load is what determines edge life and breakage. The machine table moves at the **feed rate**:

**vf = fz × z × n**

where z is the number of effective teeth and n the spindle speed. A Ø16 end mill with four flutes at 3,581 rev/min and 0.10 mm per tooth feeds at 0.10 × 4 × 3581 = 1,432 mm/min.

The removal rate for milling is the cross-section of the cut times the feed rate:

**Q = ap × ae × vf ÷ 1000**

with ap the axial depth, ae the radial width, vf in mm/min and Q in cm³/min.

## Radial chip thinning

The feed per tooth is the distance the cutter advances between one tooth and the next. The actual chip thickness varies around the tooth's path. It is greatest where the tooth is moving perpendicular to the feed direction, which is at 90° from the feed direction.

When the radial width of cut is at least half the cutter diameter, every tooth passes through that 90° point and the maximum chip thickness equals the feed per tooth. When the width of cut is less than half the diameter, the tooth leaves the work before reaching that point, and the chip is thinner than the feed per tooth. Geometry gives the maximum chip thickness as:

**h_max = fz × 2 × √(ae ÷ D − (ae ÷ D)²)** for ae ≤ D ÷ 2

and h_max = fz when ae ≥ D ÷ 2.

The table shows the factor h_max ÷ fz for a Ø16 cutter.

| Width of cut ae (mm) | ae ÷ D | Chip thickness factor |
|---|---|---|
| 1.6 | 10% | 0.60 |
| 2.0 | 12.5% | 0.66 |
| 4.0 | 25% | 0.87 |
| 8.0 | 50% | 1.00 |

At light radial engagement, a feed per tooth taken straight from a supplier's table for slotting produces a chip far thinner than intended. A chip that is too thin causes the edge to rub rather than cut, which generates heat, work-hardens some materials and wears the tool faster than a heavier, correct chip would. It also wastes time.

```figure
type: line
title: Chip thinning factor against radial engagement
x: Width of cut as a fraction of cutter diameter (ae ÷ D)
y: h_max ÷ fz
ymin: 0
ymax: 1.1
mark: 0.125 | Harbourline: ae 2 mm on Ø16
caption: Below half the diameter, the chip is thinner than the feed per tooth, so the feed must rise to keep the chip load right.
- 0.05 | 0.436
- 0.10 | 0.600
- 0.125 | 0.661
- 0.20 | 0.800
- 0.30 | 0.917
- 0.40 | 0.980
- 0.50 | 1.000
```

## Correcting the feed

The correction is to choose the feed per tooth that produces the intended maximum chip thickness:

```figure
type: svg
title: Why a narrow cut makes a thin chip
alt: A milling cutter seen from above takes a narrow radial cut along a wall. The tooth leaves the work long before reaching the point ninety degrees from the feed direction, where the chip would be thickest.
caption: The tooth exits at the engagement angle φ, where cos φ = 1 − 2ae ÷ D, before reaching the 90° point of full chip thickness.
viewbox: 0 0 640 320
body:
<rect class="fp" x="40" y="214" width="560" height="80"/>
<path class="ln" d="M40 214H600"/>
<rect class="bxa" x="320" y="190.5" width="280" height="23.5"/>
<circle class="bx" cx="320" cy="120" r="94"/>
<circle class="lf dsh" cx="320" cy="120" r="70"/>
<path class="la draw" pathLength="1" d="M320 214A94 94 0 0 0 382.2 190.5"/>
<path class="li" d="M320 120L382.2 190.5M320 120V214"/>
<text class="txa" x="342" y="178">φ</text>
<path class="cl" d="M226 120H414"/>
<text class="tx" x="420" y="124">90° point: full chip thickness</text>
<path class="la flow" d="M120 60H220"/>
<path class="ah" d="M220 54L234 60L220 66Z"/>
<text class="txb" x="110" y="48">feed direction</text>
<text class="tx" x="596" y="184" text-anchor="end">ae = 2 mm still to cut</text>
<path class="spin li" d="M320 40a80 80 0 0 1 56 23"/>
```

**fz = h_max ÷ factor**

This is an illustration. Harbourline profiles a steel bracket on its machining centre with a Ø16 four-flute carbide end mill at an axial depth of 20 mm and a radial width of 2 mm. The supplier's data gives a target chip thickness of 0.08 mm for this tool and material, at a cutting speed of 180 m/min.

- n = 1000 × 180 ÷ (π × 16) = 3,581 rev/min
- Chip thickness factor at ae = 2 mm: 2 × √(0.125 − 0.0156) = 0.661
- Corrected feed per tooth: 0.08 ÷ 0.661 = 0.121 mm per tooth
- Feed rate: 0.121 × 4 × 3581 = 1,733 mm/min
- Removal rate: 20 × 2 × 1733 ÷ 1000 = 69.3 cm³/min

If the programmer had used 0.08 mm per tooth directly, the feed rate would have been 1,146 mm/min and the removal rate 45.8 cm³/min. The corrected program removes metal about 50% faster and usually gives better tool life, because the edge is cutting a proper chip.

```figure
type: compare
title: The bracket profile with and without the chip-thinning correction
cols: Uncorrected | Corrected
best: 2
caption: Same cutter, depth and width; only the feed per tooth changes, and the tool now cuts a proper chip instead of rubbing.
- Feed per tooth fz | 0.08 mm | 0.121 mm
- Maximum chip thickness | 0.053 mm, too thin | 0.08 mm, as intended
- Feed rate | 1,146 mm/min | 1,733 mm/min
- Removal rate | 45.8 cm³/min | 69.3 cm³/min
```

Corrections must stay within limits. A strongly increased feed per tooth increases the force on each tooth, and at very light engagement the correction can call for feeds high enough to overload the cutter's corners or exceed the machine's feed limits. Suppliers often give maximum corrected feeds for that reason. Modern CAM strategies that keep radial engagement low and constant, sometimes called trochoidal, adaptive or dynamic milling, rely on chip thinning calculations to set feeds that would look alarming to an operator used to slotting values.

## Lead angle and face mills

Face mills introduce a second kind of chip thinning. If the cutting edge is inclined to the feed direction, at an entering angle κr measured from the feed direction, the chip spreads along a longer edge and becomes thinner:

**h_max = fz × sin κr**

when the cutter's centre path lies within the width being milled. A cutter with a 90° entering angle has no thinning from this cause. A 45° cutter has h_max = fz × 0.707, so to achieve the same chip thickness the feed per tooth can be about 1.41 times higher. That is one reason 45° face mills are productive on large flat faces. Round inserts thin the chip progressively with depth of cut, and suppliers give their own corrections.

## Face milling the flange's flat

On operation 30, Harbourline face mills a flat 30 mm long and 20 mm wide on the outside diameter of the flange, about 2.3 mm deep at its centre. It uses a Ø63 face mill with five inserts and a 45° entering angle, at 200 m/min and 0.15 mm per tooth.

- n = 1000 × 200 ÷ (π × 63) = 1,011 rev/min
- vf = 0.15 × 5 × 1011 = 758 mm/min
- Maximum chip thickness: 0.15 × sin 45° = 0.106 mm, because the cutter's centre passes over the 20 mm width

For time, the cutter must travel the length of the flat plus enough to enter and fully clear it. A conservative path is the length plus the cutter diameter plus a small clearance at each end: 30 + 63 + 2 × 2 = 97 mm. The cutting time is 97 ÷ 758 = **0.128 min**. On a part this small, the approach and exit take far longer than the cut itself. Shorter approach distances, or a smaller cutter, could reduce the time, but the difference is a few seconds per part and the larger cutter gives a single clean pass.

## Number of teeth engaged

The number of teeth in contact at once affects the smoothness of the cut. With a narrow width of cut and few teeth, there may be moments when no tooth is cutting, then a sudden load as the next tooth enters. That intermittent loading can excite vibration. Wider cuts or cutters with more teeth keep at least one tooth engaged, which tends to be smoother, but too many teeth in a deep slot can crowd chips and leave no room for them to escape. Coarse-pitch cutters suit long-chipping materials and less rigid set-ups; fine-pitch cutters suit short-chipping materials and stable conditions.

## Climb and conventional milling

In **climb milling**, also called down milling, the tooth enters the material at maximum chip thickness and exits thin. In **conventional milling**, or up milling, it enters thin and exits thick. On modern CNC machines with backlash-free drives, climb milling is usually preferred: the tooth bites cleanly instead of rubbing as it enters, giving better tool life and finish. Conventional milling can still be useful on hard scale, on some castings or on older manual machines where backlash would let a climb cut pull the table forward.

## Common mistakes

- **Using slotting feeds at light radial engagement.** Correct for chip thinning.
- **Correcting without limits.** Very high corrected feeds can overload corners and exceed machine feed limits.
- **Ignoring lead angle** when comparing face mills.
- **Underestimating approach and exit** on short cuts.
- **Chip evacuation in deep slots.** A correct chip thickness is no help if chips cannot leave the cut.

## Questions to ask

- Is the radial width of cut less than half the cutter diameter, and has the feed been corrected?
- What entering angle does the cutter have, and has the supplier's feed recommendation allowed for it?
- How many teeth are engaged at once, and is that suitable for the rigidity of the set-up?
- How much of the cutting time is approach and exit rather than metal removal?

## Exercise: recalculate a profile program

Take a milling program that uses light radial engagement. Calculate the chip thickness factor and the actual maximum chip thickness at the programmed feed. Compare it with the supplier's recommended chip thickness and calculate the corrected feed rate and removal rate. Trial the change carefully, starting part-way between the old and new feeds.

The next chapter covers holes: drilling, reaming and tapping, where feed is per revolution again and the geometry of the drill point adds length to every hole.
