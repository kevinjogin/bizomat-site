---
book: machining-by-the-numbers
chapterSlug: turning-feed-depth-and-finish
order: 3
title: "Turning: feed, depth of cut, removal rate and surface finish"
description: "Choose feed and depth of cut within the insert's working range, calculate metal removal rate and machining time, and predict the surface finish a feed and nose radius can give."
draft: false
---

Cutting speed sets the pace at which the edge travels; feed and depth of cut set how much material it removes. Together the three determine the metal removal rate, the cutting time, the forces on the tool and the surface finish. In turning they are also the main levers an estimator or programmer has for shortening a cycle.

This chapter covers the turning calculations for the Harbourline flange: choosing depth and feed, calculating removal rate and time, and predicting surface finish from feed and nose radius.

## Depth of cut and feed

In turning, the **depth of cut** ap is the radial depth: half the reduction in diameter for an outside diameter, or half the increase for a bore. Turning Ø110 to Ø105.25 in one pass is a depth of cut of 2.375 mm.

The **feed** fn is the distance the tool advances along the workpiece per revolution, in mm/rev. It largely determines chip thickness, which matters for chip breaking, cutting force and surface finish.

Tool suppliers give each insert and chipbreaker a **working range** of depth and feed, often drawn as a box or zone on a chart. Inside that zone, chips break into manageable pieces and the edge is adequately supported. Outside it, chips may form long, dangerous ribbons at light cuts or overload the edge at heavy ones. Two common rules of thumb, which supplier data refines, are:

- the depth of cut should usually be at least about the size of the nose radius for good chip control, and
- roughing feeds should usually stay below about half the nose radius.

Harbourline uses a general-purpose roughing insert with a 0.8 mm nose radius, a supplier working range of roughly 1 mm to 4 mm depth and 0.15 mm to 0.35 mm/rev feed, and a separate finishing insert, also 0.8 mm nose radius, for final passes.

## Planning the passes

The Harbourline flange's outside diameter must go from the Ø110 bar to Ø100, leaving 0.25 mm per side for finishing. Roughing therefore takes the diameter to Ø100.5, a radial depth of 4.75 mm. That fits two equal roughing passes of 2.375 mm each, comfortably inside the insert's range.

A single pass at 4.75 mm would also be inside the range, but it would nearly double the cutting force and power, which Chapter 6 checks against the machine. For a short length of cut, two passes cost very little extra time. For long cuts on a powerful, rigid machine, fewer and deeper passes generally save time.

## How much to leave for finishing

The finishing allowance, 0.25 mm per side on the flange, is a deliberate choice. Too little, and the finishing insert does not cut cleanly: with a depth well below its nose radius, it rubs and burnishes rather than shearing a chip, which can harden the surface, give a poor finish and wear the edge quickly. Too much, and the finishing insert does roughing work, wearing its sharp edge and generating more force and deflection on the very pass that decides the size.

Suppliers' finishing inserts state a minimum depth for good chip formation, often a fraction of a millimetre. A common starting point is to leave enough for one clean finishing pass inside that range, plus an allowance for the roughing pass's own deflection and variation. On a slender part, where roughing deflects the work more, a larger allowance, or a semi-finishing pass, gives the finishing pass a uniform amount to remove and a more predictable size.

## Metal removal rate

The area of material being cut is the depth of cut times the feed. Multiplying that area by the cutting speed gives the volume removed per minute. With ap and fn in millimetres and vc in metres per minute:

**Q = vc × ap × fn**

gives Q directly in cm³/min, because the factor of 1,000 for metres to millimetres cancels with the 1,000 mm³ in each cm³.

For the Harbourline roughing passes at vc = 220 m/min, ap = 2.375 mm and fn = 0.25 mm/rev:

Q = 220 × 2.375 × 0.25 = **130.6 cm³/min**

```figure
type: svg
title: The cross-section of a turning cut
alt: A turning insert with a round nose advances along a workpiece. The depth of cut ap is measured radially and the feed fn per revolution along the axis; the area ap times fn multiplied by cutting speed gives the removal rate.
caption: Removal rate is the chip cross-section ap × fn moving at the cutting speed: 2.375 × 0.25 × 220 = 130.6 cm³/min.
viewbox: 0 0 640 300
body:
<path class="bx" d="M40 60H600V240H40Z"/>
<path class="fp" d="M40 60H330V100H40Z"/>
<path class="cl" d="M30 270H610"/>
<path class="bxa" d="M330 60V100L372 100L372 60Z"/>
<path class="fi" d="M372 20L430 20L430 92Q430 104 418 104H384Q372 104 372 92Z"/>
<path class="la flow" d="M440 40H560"/>
<path class="ah" d="M560 34L574 40L560 46Z"/>
<text class="txb" x="470" y="30">feed fn per rev</text>
<path class="li" d="M318 60V100M312 60H324M312 100H324"/>
<text class="tx" x="306" y="86" text-anchor="end">ap = 2.375 mm</text>
<path class="li" d="M330 120H372M330 114V126M372 114V126"/>
<text class="tx" x="351" y="142" text-anchor="middle">fn = 0.25 mm</text>
<text class="txa" x="351" y="190" text-anchor="middle">chip area ap × fn</text>
<text class="tx" x="120" y="170">workpiece rotating at vc = 220 m/min</text>
```

Removal rate is the most useful single measure of roughing productivity. It allows a quick estimate of roughing time from the volume to remove. The back of the Harbourline flange, where the Ø110 bar is turned down to the Ø60 spigot over 10 mm, removes:

π ÷ 4 × (110² − 60²) × 10 = 66,759 mm³, about 66.8 cm³

At a similar removal rate of about 136 cm³/min, that takes roughly half a minute of cutting, before allowing for approach, retract and the passes needed.

## Feed buys removal more cheaply than speed

Removal rate rises in direct proportion to cutting speed, feed and depth. Tool life does not respond equally to all three. Chapter 8 shows that tool life is usually most sensitive to cutting speed, less sensitive to feed and least sensitive to depth of cut. So, within the insert's working range and the machine's power, increasing depth and feed is generally a cheaper way to raise removal rate than increasing speed.

That is why roughing strategies often use the deepest practical cut and a high feed at a moderate speed, while finishing uses a lower feed for surface finish and a higher speed for a clean cut. For the flange's roughing, raising the feed from 0.25 to 0.30 mm/rev would increase the removal rate by a fifth, from 130.6 to about 156.8 cm³/min, with a smaller effect on tool life than the same increase in cutting speed. Whether the insert, the part and the machine accept the higher feed is the check that limits it.

## Machining time

For a turning pass of length L at feed fn and spindle speed n:

**tc = L ÷ (fn × n)**

The denominator, fn × n, is the feed rate in mm/min. Under constant surface speed, n depends on the diameter, so each pass has its own spindle speed.

This is an illustration. The two roughing passes on the flange's outside diameter are each 24 mm long, including a short approach. Using the mean diameter of each pass:

| Pass | Diameters | Mean diameter | n at 220 m/min | Feed rate | Time |
|---|---|---|---|---|---|
| 1 | Ø110 to Ø105.25 | 107.6 | 651 rev/min | 162.7 mm/min | 0.148 min |
| 2 | Ø105.25 to Ø100.5 | 102.9 | 681 rev/min | 170.2 mm/min | 0.141 min |
| Total | | | | | 0.289 min |

The finishing pass at 250 m/min and 0.15 mm/rev on Ø100 runs at 796 rev/min, a feed rate of 119 mm/min, and takes about 0.201 min. The finish bore, at 200 m/min and 0.12 mm/rev over 36 mm, takes about 0.188 min.

```figure
type: bars
title: Cutting time for each turning pass on operation 10
unit: min
caption: The light finishing pass takes longer than either roughing pass because its feed is lower.
- Rough pass 1, Ø110 to Ø105.25 | 0.148 | 651 rev/min, 162.7 mm/min
- Rough pass 2, Ø105.25 to Ø100.5 | 0.141 | 681 rev/min, 170.2 mm/min
- *Finish Ø100 at 0.15 mm/rev | 0.201 | 796 rev/min, 119 mm/min
- Finish bore Ø40 at 0.12 mm/rev | 0.188 | 36 mm long
```

Finishing passes are often slower than roughing passes despite removing very little material, because the feed is lower. That is a direct consequence of the surface finish requirement.

## Control the chips

A turning operation that produces long, continuous chips is a problem even if the dimensions are correct. Long chips wrap around the part and the tool, scratch the finished surface, block coolant, jam chip conveyors and are a hazard to anyone clearing them. Chip control depends mainly on the chipbreaker geometry of the insert and on staying inside its depth and feed range; feeds below the range, typical of over-cautious finishing, are a common cause of stringy chips.

When chips will not break, the first checks are whether the depth and feed are inside the chipbreaker's range and whether a different chipbreaker suits the light cut better. Coolant delivered accurately to the cutting zone, particularly at higher pressure, can also help break chips. The machine's guarding and chip handling must be adequate for the chips the process actually produces, and the safe method for clearing them belongs in the operating procedure, not in improvisation at the machine.

## Predicting surface finish

When a round-nosed tool advances by fn each revolution, it leaves a series of shallow cusps on the surface. Simple geometry gives the theoretical peak-to-valley height:

**Rt ≈ fn² ÷ (8 × rε)**

and the theoretical arithmetic mean roughness:

**Ra ≈ 0.0316 × fn² ÷ rε**

where rε is the nose radius. With fn and rε in millimetres, multiplying by 1,000 gives micrometres, so a convenient working form is **Ra (µm) ≈ 31.6 × fn² ÷ rε**. Machinery's Handbook gives the same relationship, with a coefficient of about 0.0316, for cases where the feed is small compared with the nose radius.

| Feed fn (mm/rev) | Nose radius rε (mm) | Theoretical Ra (µm) | Theoretical Rt (µm) |
|---|---|---|---|
| 0.25 | 0.8 | 2.47 | 9.77 |
| 0.15 | 0.8 | 0.89 | 3.52 |
| 0.10 | 0.4 | 0.79 | 3.13 |
| 0.15 | 1.2 | 0.59 | 2.34 |

Two patterns stand out. Roughness grows with the square of feed: halving the feed cuts theoretical roughness to a quarter. And a larger nose radius improves finish in direct proportion. A larger radius also increases the radial cutting force, which can cause vibration on slender parts, so it is not free.

```figure
type: line
title: Theoretical roughness against feed for two nose radii
x: Feed fn (mm/rev)
y: Theoretical Ra (µm)
legend: Nose radius 0.8 mm | Nose radius 1.2 mm
ymin: 0
ymax: 4
mark: 0.2 | Ra 1.6 at r 0.8
caption: Ra ≈ 31.6 × fn² ÷ rε. Roughness rises with the square of feed and falls in proportion to nose radius. Real surfaces are rougher.
- 0.05 | 0.099 | 0.066
- 0.10 | 0.395 | 0.263
- 0.15 | 0.889 | 0.593
- 0.20 | 1.580 | 1.053
- 0.25 | 2.469 | 1.646
- 0.30 | 3.555 | 2.370
```

The formula can be inverted to find the largest feed for a required finish:

**fn ≈ √(Ra × rε ÷ 31.6)**

For a drawing requirement of Ra 1.6 µm with a 0.8 mm nose radius: fn ≈ √(1.6 × 0.8 ÷ 31.6) = 0.201 mm/rev.

## Theory versus the real surface

The theoretical value is a lower bound. Real surfaces are usually rougher because of:

- **built-up edge**, where material welds to the edge at low cutting speeds, especially in soft, ductile materials;
- **vibration**, from tool overhang, slender parts or worn machine slides;
- **tool wear**, which changes the nose shape;
- **material side flow and tearing**, particularly at very small feeds, where the edge rubs rather than cuts; and
- **machine errors**, such as spindle runout.

Harbourline's practice, based on its own measurements, is to plan for a measured Ra of about one and a half to two times the theoretical value on steel with sharp finishing inserts. That is why it finishes the flange at 0.15 mm/rev, theoretically Ra 0.89 µm, against a drawing requirement of Ra 1.6 µm on the outside diameter, rather than at the 0.20 mm/rev the formula alone would allow.

**Wiper inserts**, with a specially shaped section of the nose, are designed to flatten the cusps. Suppliers state that they can give a similar finish at substantially higher feeds than a conventional insert, or a better finish at the same feed. Test them on your own machine and material before relying on the claimed gain.

## Measure the finish the way the drawing means it

A surface finish requirement such as Ra 1.6 µm is a measured parameter, and the measurement method matters. Ra is the arithmetic average of the profile's departures from its mean line over a sampling length; other parameters, such as Rz, describe the height of peaks and valleys and are often several times larger than Ra on the same surface. A drawing that specifies Ra cannot be checked with an Rz reading, and the reverse.

Portable stylus roughness testers are common in workshops. For a meaningful result, the stylus should travel across the lay of the turning marks, that is, along the part's axis, and the instrument's sampling length should suit the surface, following the relevant standard and the instrument maker's guidance. Comparison specimens, felt with a fingernail or viewed under light, are useful for a quick check but not for a borderline decision. Harbourline's practice of planning for one and a half to two times the theoretical Ra is only reliable because it is based on measurements taken this way, consistently.

## Common mistakes

- **Diameter for depth of cut.** Depth of cut in turning is radial: half the diameter change.
- **Feeds below the chipbreaker's range** in finishing, which produce long chips and poor finish.
- **Expecting theoretical finish.** Allow for the real process.
- **Large nose radius on slender parts,** which increases radial force and vibration.
- **Too many light roughing passes.** Each pass adds approach, retract and non-cutting time.

## Questions to ask

- Are the planned depth and feed inside the insert's working range?
- How many passes are really needed, given machine power and part rigidity?
- What surface finish does the drawing require, and what does our process actually achieve relative to theory?
- Would a different nose radius or a wiper insert allow a higher finishing feed?

## Exercise: plan a turned diameter

For a turned diameter on one of your parts, record the stock and finished sizes, the finish requirement and the inserts used. Plan the roughing passes, calculate the removal rate and the time for each pass, and calculate the theoretical finish of your finishing pass. Compare the theoretical finish with a measured value.

The next chapter turns to milling, where the feed is shared between several teeth and the width of cut changes the chip thickness in a way that catches many programmers out.
