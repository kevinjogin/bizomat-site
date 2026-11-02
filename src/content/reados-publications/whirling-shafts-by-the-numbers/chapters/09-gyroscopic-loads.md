---
book: whirling-shafts-by-the-numbers
chapterSlug: gyroscopic-loads
order: 9
title: "Gyroscopic loads"
description: "Why a spinning rotor pushes back when its axis is turned: angular momentum, the gyroscopic couple and bearing reactions, applied to a truck-mounted mill that lifted a bearing on tight turns."
draft: false
---

A spinning rotor resists having its axis turned. Try to swing a bicycle wheel spinning on its axle, holding the ends of the axle, and the wheel twists in your hands at right angles to the way you are turning it. The effect is gyroscopic, and in a machine it appears as a pair of equal and opposite forces on the rotor's bearings whenever the machine carrying the rotor turns, pitches or rolls while the rotor spins.

For a machine bolted to a floor, gyroscopic loads are usually zero, because its axis never turns. For a machine on a vehicle, a ship, a crane or a swinging boom they can be large. This chapter works out the rotor's angular momentum, applies a KEVOS® tool to the truck-mounted version of the HM-30, and describes how tight turns in a feedlot lifted one of its bearings.

## Angular momentum and the gyroscopic couple

A rotor with moment of inertia J spinning at angular speed ω has angular momentum H = J × ω, a vector along its axis. Changing the direction of that vector takes a couple. If the axis is turned, or precessed, at a steady rate Ω about an axis at right angles to the spin axis, the couple needed is:

```figure
type: formula
title: Gyroscopic couple and bearing reactions
formula: Angular momentum: H = J × ω
formula: Gyroscopic couple: T_g = J × ω × Ω
formula: Bearing reaction: F = T_g ÷ L, equal and opposite at the two bearings
caption: For steady precession with the precession axis at right angles to the spin axis. The couple acts in the plane containing the spin axis and the precession axis; the reactions are in that plane, one pushing each way. For a vehicle on a curve, Ω = vehicle speed ÷ turn radius.
- J | rotor's moment of inertia about its spin axis, kg·m²
- ω | spin speed, rad/s
- Ω | precession rate, rad/s
- L | distance between the bearings, m
```

The couple is supplied by the bearings: one is pushed one way and the other the opposite way, with forces that add to and subtract from whatever the bearings already carry, usually the rotor's weight. Because the couple is proportional to the spin speed, the rotor's inertia and the turning rate, a fast, heavy rotor on a machine that turns briskly can produce bearing reactions comparable with its weight.

### Which way the loads act

The direction of the reactions follows from the vectors. For a rotor with a horizontal spin axis on a vehicle turning about a vertical axis, the couple acts about the third, horizontal axis at right angles to both, and the bearing reactions are vertical: one bearing is pushed down harder and the other is lifted. That is true whether the rotor's axis lies across the vehicle or along it. A rotor with a vertical spin axis feels nothing when the vehicle turns, but does feel a couple when the vehicle pitches or rolls. Pitching and rolling produce horizontal bearing reactions instead, for whichever of them turns the axis.

```figure
type: compare
title: Gyroscopic bearing reactions by rotor axis and vehicle motion
cols: Precession axis | Bearing reactions
rowhead: Rotor axis and motion
- * Horizontal, across the vehicle; vehicle turning | vertical | vertical, one up and one down
- Horizontal, across the vehicle; vehicle pitching | across the vehicle, along the spin axis | none
- Horizontal, across the vehicle; vehicle rolling | along the vehicle | horizontal, fore and aft
- Horizontal, along the vehicle; vehicle turning | vertical | vertical, one up and one down
- Horizontal, along the vehicle; vehicle pitching | across the vehicle | horizontal, side to side
- Horizontal, along the vehicle; vehicle rolling | along the vehicle, along the spin axis | none
- Vertical; vehicle turning | vertical, along the spin axis | none
caption: Only the component of the precession at right angles to the spin axis produces a couple. A rotor whose axis lies along a motion's turning axis is immune to that motion.
```

## The HM-30's rotor inertia

This is an illustration. The rotor's moment of inertia comes almost entirely from its discs and hammers. Treating the seven 520 mm discs, 140 kg in all, as solid discs gives J = ½ × 140 × 0.26² = 4.73 kg·m². Treating the 48 hammers, 36 kg, as a thin ring at their centre-of-gravity radius of 230 mm gives 36 × 0.23² = 1.90 kg·m². The total, ignoring the shaft, bores and pins, is about 6.6 kg·m², and that is the figure the maker uses.

At 2,950 rpm, 308.9 rad/s, the rotor's angular momentum is 6.6 × 308.9 = 2,039 kg·m²/s.

## The truck-mounted mill

This is an illustration. The HM-30T variant mounts the mill on a truck that drives along the feed alleys of a feedlot, grinding grain and blowing it into the bunks as it goes. The rotor's axis is horizontal and across the truck, and its bearings are 1,000 mm apart. In the feedlot the truck drives at up to 15 km/h, and turns at the ends of the alleys on a radius of about 12 m.

The KEVOS® [Gyroscopic bearing load on a turning rotor](/tools/gyroscopic-bearing-load/) tool works out these loads. From the rotor, a solid disc, a thin ring or an entered inertia, its mass, spin speed and the precession, given either as a vehicle speed and turn radius or as a turning speed of the axis, it gives the inertia, the angular momentum, the precession rate, the gyroscopic couple and the equal and opposite reaction at each bearing over the span. It adds the rotor's weight shared equally between the bearings, reports the largest and smallest bearing loads, compares the largest with your allowable, and warns if the smaller load reverses, which would lift the rotor in that bearing. Its guide notes that it assumes steady precession at right angles to the spin, and that unbalance and shock loads must be added separately.

```figure
type: compare
title: HM-30T bearing loads on a turn, rotor J = 6.6 kg·m², 2,950 rpm, bearings 1,000 mm apart
cols: Precession rate, rad/s | Gyroscopic couple, N·m | Reaction at each bearing, N | Bearing loads with weight, N
rowhead: Truck speed and turn radius
- 15 km/h on 12 m | 0.347 | 708 | ±708 | 1,591 and 175
- 25 km/h on 12 m | 0.579 | 1,180 | ±1,180 | 2,063 and −297
- * 15 km/h on 6 m | 0.694 | 1,416 | ±1,416 | 2,298 and −533
caption: This is an illustration. Weight per bearing 883 N. A negative load means the gyroscopic couple lifts the rotor in that bearing: the load reverses.
```

At the feedlot's normal 15 km/h on a 12 m turn, the gyroscopic reaction of 708 N is 80% of the weight on each bearing: one bearing carries 1,591 N and the other only 175 N. Faster, or on a tighter turn, the lightly loaded bearing's load reverses: the couple lifts the rotor in that bearing.

## Why a reversed load matters

A rolling bearing in a pillow block is designed to carry load in one main direction, usually downward. Its housing cap, bolts and the bearing's internal clearance all assume that. When the load reverses, the shaft lifts through the bearing's clearance until the rolling elements bear on the other side of the races and the cap takes the load. Each reversal is a small knock. Repeated on every turn, and combined with the rotating unbalance force of Chapters 5 and 7, the knocks loosen housing bolts, fret the outer ring in its housing, and dent the races.

## The error: a bearing lifted on the turns

This is an illustration. The first HM-30T went to a feedlot whose alleys ended in tight turns around water troughs, about 6 m in radius. The drivers, keen to keep the bunks filled, took the turns at 15 km/h or more without slowing the mill. After two months the non-drive-end bearing was noisy, its housing cap bolts had loosened, and the outer ring showed polished bands where it had been moving in its housing.

The maker's engineer worked out the loads with the gyroscopic tool. On a 6 m turn at 15 km/h, the reaction at each bearing was 1,416 N against a weight share of 883 N: on every right-hand turn the non-drive-end bearing's load reversed to −533 N, lifting the shaft in its housing. On left-hand turns the drive end lifted instead. The bearings had been chosen for the weight and the unbalance force, which they would have carried comfortably; nobody had added the gyroscopic loads.

```figure
type: steps
title: Setting a turning limit for the HM-30T
caption: This is an illustration. The limit keeps the lighter bearing's load at no less than half its weight share, so the load never reverses even with the rotating unbalance force added.
- Weight share per bearing | 883 N
- Reaction that would just unload a bearing | 883 N, so a couple of 883 N·m over 1.0 m
- Precession rate for that couple | 883 ÷ 2,039 = 0.433 rad/s
- Speed at which it is reached on a 12 m turn | 0.433 × 12 = 5.2 m/s, 18.7 km/h
- * Limit chosen, half the weight share | 0.216 rad/s: 9.3 km/h on a 12 m turn, about 4.7 km/h on a 6 m turn
- Operating rule | mill only on straight runs or at walking pace on turns; stop the mill for tight turns
```

The maker changed three things. The operating manual now sets the turning limit in the figure, and a speed-linked interlock in the truck's control system slows the mill's feed and sounds a warning above 10 km/h. The pillow blocks were changed to housings rated for load in any direction, with the caps and bolts sized for the reversed load. And the HM-30T's design checklist now includes gyroscopic loads, calculated for the worst turn and pitch the vehicle will make.

## Adding the other loads

The gyroscopic reaction never acts alone. Each bearing also carries its share of the rotor's weight, the rotating force of the remaining unbalance, and on a vehicle the shocks of the road.

This is an illustration. Chapter 5 showed that the HM-30's rotor at its balance tolerance, amplified by running at 72% of its critical speed, puts about 730 N of rotating force on its bearings, roughly 365 N on each. That force sweeps round once a revolution, so at some instant in every revolution it points straight up, against the weight. A bearing whose steady load, weight less gyroscopic lift, is below about 365 N will see its load reverse briefly once a revolution even if the steady load is positive. That is the reason for the maker's limit of half the weight share, 441 N: it leaves room for the unbalance force on top of the turn.

Rough ground adds more. On the HM-30T, with its rotor axis across the truck, a wheel dropping into a pothole rolls the truck briefly about its long axis. A roll rate of 0.5 rad/s, which a sharp pothole can produce for a fraction of a second, precesses the rotor at right angles to its spin and gives a couple of 2,039 × 0.5 = 1,019 N·m, now acting about a vertical axis: horizontal reactions of about 1,020 N at each bearing, fore and aft, for as long as the roll lasts. The same pothole gives the truck a vertical acceleration that can briefly double the weight on the bearings. Bearing housings on vehicles must therefore be designed for load in every direction, and for shock, not just for the steady loads of a fixed machine.

### How well is J known?

The gyroscopic couple is directly proportional to the rotor's moment of inertia, so the calculation is only as good as J. Treating the discs as solid ignores their bores and pin holes, which slightly overstates J; ignoring the pins and shaft understates it. For the HM-30 the two roughly cancel, and the 6.6 kg·m² figure was later confirmed within a few per cent by the rotor's CAD model and by its measured run-up time (Chapter 10). For a new rotor, the CAD model's mass properties are the usual source; for an existing one, a run-up or coast-down test with a known torque gives J directly.

## Gyroscopic effects inside the rotor

Gyroscopic moments also act within a spinning rotor whenever its own shaft bends, because a disc on a bending shaft tilts as it whirls. A tilting, spinning disc resists the tilt, which stiffens the shaft in forward whirl (whirling in the same direction as the spin) and softens it in backward whirl. The rotor's critical speeds split into forward and backward pairs that move apart as the speed rises. For a disc at mid-span, like the HM-30's rotor pack, the disc barely tilts in the first mode and the effect is small; that is one reason the simple critical speed tools can ignore it. For an overhung disc, such as a pump impeller or a fan on the end of a shaft, the disc tilts strongly and gyroscopic stiffening can raise the forward critical speed considerably. Rotordynamic models include these effects as a matter of course.

### Stopping the rotor is not instant

The simplest control, "stop the mill before a tight turn", has a catch: the rotor takes time to stop. With 6.6 kg·m² of inertia at 2,950 rpm and only bearing friction and windage to slow it once the grain feed is off, the HM-30's rotor coasts for minutes, not seconds, and its angular momentum falls only in proportion to its speed. A driver who switches the mill off at the end of an alley and turns at once is turning a rotor that still has most of its angular momentum. The operating rule therefore says to slow the truck for the turn, not merely to switch the mill off, and the HM-30T's control system shows the rotor speed on the driver's display so that the driver can see when it is safe. A brake on the rotor would shorten the coast-down, but it would also add a large braking torque to the shaft and coupling, which Chapter 10 treats in the same way as a start.

## Other machines with gyroscopic loads

The same check applies to any rotor whose axis moves: a fan or pump on a ship that rolls and pitches, a grinder on a robot arm, a generator on a truck, a cutter head on a slewing excavator, a gyroscopic stabiliser by design. The data needed are always the same: the rotor's inertia and speed, the worst rate at which its axis can be turned, and the bearing span. Where the rate is unknown, an accelerometer or rate gyro on the machine during a typical day's work will find it.

## Exercise: a smaller feedlot

This is an illustration. Another feedlot's alleys end in 8 m turns, which drivers take at 10 km/h.

1. What precession rate does that give?
2. What are the gyroscopic couple and the reaction at each bearing?
3. What are the bearing loads with the weight added, and does either reverse?
4. Does the maker's limit of half the weight share allow it?

**Worked answer.**

1. Ω = (10 ÷ 3.6) ÷ 8 = 2.78 ÷ 8 = **0.347 rad/s**, the same as 15 km/h on 12 m.
2. T_g = 2,039 × 0.347 = **708 N·m**; reaction 708 ÷ 1.0 = **708 N** at each bearing.
3. 883 + 708 = **1,591 N** and 883 − 708 = **175 N**. Neither reverses.
4. **No.** The lighter bearing's load of 175 N is well under half its 883 N weight share (441 N). At 8 m the limit of 0.216 rad/s is reached at 0.216 × 8 = 1.73 m/s, **6.2 km/h**; the drivers would need to slow to that, or stop the mill on the turns.
