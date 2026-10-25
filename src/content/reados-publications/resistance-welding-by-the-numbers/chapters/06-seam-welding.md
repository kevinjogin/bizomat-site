---
book: resistance-welding-by-the-numbers
chapterSlug: seam-welding
order: 6
title: "Seam welding"
description: "Make a leak-tight seam from overlapping nuggets: wheel speed, pulse timing and overlap, the higher current and duty a seam demands, and how a seam is tested."
draft: false
---

A seam weld is a row of spot welds made so close together that they overlap into a continuous, leak-tight joint. Instead of pointed electrodes, the sheets pass between two copper wheels that roll along the joint, carrying current and force. The current is usually pulsed, so each pulse makes one nugget, and the wheels move on by less than one nugget diameter before the next. It is the process behind fuel tanks, radiators, drums and many other thin-sheet containers that must hold liquid or gas.

This chapter sets up the seam weld around the cabinet's drip tray. It shows how wheel speed, pulse timing and nugget size set the overlap, why seam welding needs more current and more transformer capacity than spot welding, and how the shop proves the seam does not leak.

## From spot to seam

Seam welding is old. Hamilton and Oberg described it in 1918 as widely used in the sheet-metal industry, particularly for utensils that had to be steam- or water-tight, but noted that it had not reached the same development as butt or spot welding and that little practical data were available. They listed pickled mild steel, tin plate, terneplate and sheet brass as easily seam-welded, while zinc, aluminium and copper were more difficult.

TWI's modern description is the same in essence: the spot electrodes are replaced by wheels that turn as the parts are fed between them, giving overlapping nuggets and a continuous seam, used for thin-sheet leak-tight containers such as fuel tanks and generally unsuitable for aluminium. The difficulty with aluminium and copper follows from Chapter 1: both conduct heat and electricity so well that the very high currents needed are hard to deliver through rolling contacts while the wheels themselves survive.

## The drip tray

This is an illustration. The cabinet's drip tray sits under the equipment shelf to catch condensation. It is a flat 1.2 mm base, 600 × 400 mm, with a formed rim lapped onto it around the edge and seam-welded along the full perimeter, with 25 mm radius corners that the wheels can follow. The seam is 2 × (600 + 400) = **2,000 mm** long, ignoring the slight shortening at the corners, and must hold water indefinitely.

The seam welder has two 200 mm diameter copper alloy wheels with 6 mm wide faces. The shop's trials settled on a pulse of three cycles on and two cycles off at 50 Hz, a force of 4.0 kN and a current of 13 kA during each pulse. With those settings, each nugget is about 5.0 mm long in the direction of the seam.

## Overlap, pitch and speed

A seam is leak-tight only if each nugget overlaps the one before it. The pitch between nugget centres is the distance the wheels travel during one pulse period:

**pitch = travel speed ÷ pulses per second**

and the overlap is the fraction of each nugget's length shared with the next:

**overlap = 1 − pitch ÷ nugget length**

The shop's rule for leak-tight seams on this tray is an overlap of at least 30%. This is an illustration. With 5.0 mm nuggets, the pitch must not exceed 5.0 × (1 − 0.30) = 3.5 mm.

```figure
type: formula
title: Maximum wheel speed for a 30% overlap on the drip tray
formula: v = pitch × pulses per second;  pitch = L × (1 − overlap)
caption: This is an illustration. Three cycles on and two off at 50 Hz is a pulse period of 0.10 s, ten nuggets a second.
- L | nugget length along the seam, 5.0 mm
- overlap | required overlap, 30%
- pulses per second | 1 ÷ (5 × 0.020 s) = 10
step: pitch = 5.0 × (1 − 0.30) = 3.5 mm
step: v = 3.5 × 10 = 35 mm/s, or 2.1 m/min
```

At 35 mm/s the 2,000 mm seam takes 2,000 ÷ 35 ≈ **57 s** of welding and contains about 2,000 ÷ 3.5 ≈ **572 nuggets**. The wheels turn at 2.1 ÷ (π × 0.200) ≈ **3.3 revolutions per minute**.

The relationship works both ways. If an operator speeds up to 50 mm/s to save time, the pitch becomes 50 ÷ 10 = 5.0 mm, equal to the nugget length, so the overlap falls to zero: the nuggets just touch and the slightest variation leaves gaps. The seam may look continuous from the outside, because the wheel marks are continuous, but it will leak.

```figure
type: compare
title: Wheel speed and overlap with 5.0 mm nuggets at ten pulses a second
cols: Pitch | Overlap | Seam time for 2,000 mm
caption: This is an illustration. Speed must be controlled, not left to the operator, because overlap disappears quickly as speed rises.
- 25 mm/s | 2.5 mm | 50% | 80 s
- *35 mm/s | 3.5 mm | 30% | 57 s
- 40 mm/s | 4.0 mm | 20% | 50 s
- 50 mm/s | 5.0 mm | 0% | 40 s
```

## Why seams need more current

Chapter 5 showed that a spot welded 30 mm from its neighbour loses about 12% of its current through the neighbour. In a seam, the neighbour is not 30 mm away; it overlaps the new nugget. The previous nugget is still hot and solid right next to the new one, so a large share of the current takes that path instead of forming the new nugget. Seam welds therefore need considerably more current than spot welds in the same sheet. The drip tray's 13 kA compares with 9.0 kA for the cabinet's spots in the same 1.2 mm steel.

The off time between pulses matters for the same reason. It lets the previous nugget cool and freeze a little before the next pulse, raising its resistance relative to the new weld zone and reducing the shunt. It also lets the wheel surfaces cool. Continuous current, without off time, tends to overheat the sheet and wheels and produces a wide, burnt seam; very short off times give the same effect. The pulse timing is therefore as much a part of the schedule as current and force.

Because the shunt through the previous nugget is so large, the first few nuggets at the start of a seam, where there is no previous nugget, receive more of the current than those that follow. Seams often show a slightly larger, hotter nugget at the start, and some controls ramp the current up over the first few pulses to even this out. Where a seam closes on itself, as around the tray, the last nuggets overlap the first ones, so the shunt there is higher still and the closing overlap is one of the places the weekly section examines.

## The transformer's harder life

A spot welder making 20 welds a minute conducts for about 7% of the time (Chapter 3). A seam welder conducts for three cycles in every five while it is welding, a duty of 60% for the whole 57 s of the seam. The equivalent continuous current during the seam is 13 × √0.60 ≈ **10.1 kA**.

Over the whole day, with 40 trays made one at a time, the welder sits idle most of the time. If one tray is welded every 12 minutes, the long-term duty is 57 × 0.60 ÷ 720 ≈ 4.8%. But the transformer, the secondary conductors and the wheels heat up during each 57 s seam, and they must survive a minute at 60% duty without overheating. Seam welders are built and rated for that heavier short-time duty, with continuous water cooling of the transformer, the wheel bearings and often the wheels themselves through the shaft, or by flooding the seam with water.

## Wheels, force and tracking

Wheel electrodes wear like spot electrodes, but the wear is spread around the circumference. Their face width and profile set the nugget width, so they are dressed on the machine by knurled rollers or cutting tools that run against them. A face that widens with wear spreads the current and reduces the heat per unit area, exactly as Chapter 4 showed for spot tips, so the dressing interval is set by measuring the seam width on test pieces.

The force must be applied continuously as the wheels roll, so seam welders use a pneumatic or servo force system that follows the wheels as the sheets vary slightly in thickness. The drive must keep a constant speed. On many machines one or both wheels are driven, and if the drive and the force do not act together, the wheels can skid, tear the sheet surface or produce a seam that wanders off the flange.

Tracking matters as much as speed. The seam must stay on the lap, with enough sheet either side to contain each nugget, the same edge-distance reasoning as Chapter 5. Around the tray corners, the radius must be large enough for the operator, or a fixture, to steer the tray smoothly without slowing down, because a slowdown overheats and a hesitation leaves a gap.

## Lap width, distortion and variants

The lap for a seam weld must be wide enough for the wheel face plus enough sheet on each side to contain the nuggets, the same reasoning as the flange rule in Chapter 5. With a 6 mm wheel face, the tray's rim lap is 16 mm, so the seam runs down its centre with about 5 mm of sheet beyond the wheel face on each side. A narrower lap invites the seam to run off the edge on a slight misalignment, and an edge seam both leaks and tears.

A continuous seam puts a long line of heat into thin sheet, so distortion is more noticeable than with spaced spot welds. The weld metal shrinks along the seam as it cools, and a long straight seam on thin sheet can bow the part or ripple the sheet beside it. Clamping the tray in a fixture that supports the base, keeping the heat input no higher than needed and welding at a steady speed all help. On the drip tray, the 25 mm corner radii and the stiffness of the formed rim keep distortion acceptable; on a large flat panel the shop would expect to need more fixture support.

Several variants of seam welding exist for particular jobs:

- **Roll spot welding**, with the same wheels but a larger pitch, makes a row of separate spots quickly where a continuous seam is not needed;
- **Mash seam welding** uses a very narrow overlap, about one to two sheet thicknesses, and a high force that squashes the joint almost flat, giving a smooth seam on drums and tubes;
- **Foil butt seam welding** places a thin strip over a square butt joint and welds through it, giving a near-flush joint.

Each has its own geometry, schedule and equipment. The calculation of pitch, overlap and speed, though, is the same for any pulsed seam.

## Testing a seam

A seam's purpose is to hold liquid or gas, so it is tested for leaks as well as for strength. The shop uses three checks.

1. **Leak test of every tray.** Each tray is filled with water containing a fluorescent dye, stood on absorbent paper for a set period and inspected under ultraviolet light for any trace of dye on the underside.
2. **Peel test of a seam coupon.** At the start of each shift and after wheel dressing, a short seam is made on two strips of the tray sheet and peeled apart. The torn surfaces show the individual nuggets, so the overlap can be measured directly.
3. **Section at the corners.** Weekly, one tray corner is cut, polished and etched to confirm that the nuggets remain overlapped through the radius.

```figure
type: steps
title: Seam weld checks for the drip tray
caption: This is an illustration of the shop's routine. The peel coupon measures overlap directly; the leak test proves the result on every tray.
- Set-up coupon | short seam on two strips at the start of each shift
- *Peel and measure | nugget length and pitch; overlap at least 30%
- Weld trays | speed fixed by the drive, not the operator
- Leak test | dyed water fill on every tray, inspected under UV light
- Weekly section | corner cut, polished and etched to check overlap
```

## A failure: the leaking corners

This is an illustration. In the first week of tray production, about one tray in eight leaked, always at a corner. The straight runs were sound, and the start-of-shift peel coupons, made on straight strips, showed 35% overlap.

Sectioning a leaking corner showed the cause. Around the 25 mm corner radius, operators had been rotating the tray by hand and, to stay on the rim, had slowed down and then sped up again. In the slow part the nuggets were wide and burnt, with heavy indentation; at the exit from the corner, where the operator hurried to catch up, the nuggets had separated, and the dye found the gaps. The speed in the straight runs was set by the drive, but the rotation was not.

The correction was a turntable fixture that held the tray and rotated it about each corner's centre at a speed matched to the wheel drive, so that the travel speed along the seam stayed at 35 mm/s through the corner. The peel coupon routine was extended to include a coupon with a curved seam, and the weekly corner section was added. The leaking trays were repaired by a separate procedure and retested.

## Exercise: a different pulse

To reduce heating of the wheels, the shop tries a schedule of two cycles on and two cycles off at 50 Hz. Trials show the nuggets shrink to 4.5 mm long. For a 40% overlap, which the shop now prefers for a safety margin, calculate the pulses per second, the maximum pitch, the maximum speed in mm/s and m/min, the time for the 2,000 mm seam, and the duty while welding.

The pulse period is 4 × 0.020 = 0.080 s, so there are 1 ÷ 0.080 = **12.5 pulses per second**. The maximum pitch is 4.5 × (1 − 0.40) = **2.7 mm**, so the maximum speed is 2.7 × 12.5 = **33.75 mm/s**, about **2.0 m/min**. The seam takes 2,000 ÷ 33.75 ≈ **59 s**, and the duty while welding is 2 ÷ 4 = **50%**.

The new schedule takes about two seconds longer per tray than the original but heats the wheels and transformer less, and its 40% overlap gives more margin against leaks. Whether the smaller nugget is acceptable for strength would be checked by peel tests, and whether 13 kA is still right for the shorter pulses would be checked by a short series of trials before the change is adopted.
