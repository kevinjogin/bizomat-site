---
book: vehicle-mechanics-by-the-numbers
chapterSlug: turning-and-off-tracking
order: 9
title: "Turning circles, Ackermann steering and trailer off-tracking"
description: "Calculate steering angles and turning circles, follow each trailer as it cuts inside the tractor's path on a corner, and size the swept path that aisle markings must allow for."
draft: false
---

A vehicle turning a corner occupies more floor than its own width. The outer front corner swings wide, the rear wheels run inside the front ones, and every trailer behind runs further inside than the one before it. On a site where aisles are lined with racks, columns and walkways, the floor a train actually sweeps through a corner decides whether it hits something or someone.

This chapter starts with the steering geometry of the tractor itself: why the two front wheels need different angles, and what sets the smallest turning circle. It then follows the trailers through a corner, calculates how far each cuts inside the tractor's path, and builds the swept path that the aisle must allow. The error case is a corner whose walkway markings were drawn from the tractor's turning circle alone, with the third trailer's path running straight across them.

## Ackermann steering

When a vehicle turns slowly without its tyres sliding, every wheel rolls around the same centre. For a tractor with a rigid rear axle, that centre lies on the line of the rear axle, extended. The front wheels must each point at right angles to the line from that centre, which means the inner front wheel turns more sharply than the outer one. That arrangement is called Ackermann steering, after an early patent for the linkage that produces it.

```figure
type: formula
title: Steering angles for a turn about the rear axle line
formula: tan δ_i = L ÷ (R − t ÷ 2) and tan δ_o = L ÷ (R + t ÷ 2)
caption: This is an illustration. Tractor wheelbase 1.4 m, front track 0.9 m, turning radius measured to the centre of the rear axle. Low speed, no tyre slip.
- δ_i, δ_o | steering angles of the inner and outer front wheels
- L | wheelbase, m
- R | radius of the turn at the centre of the rear axle, m
- t | front track, the distance between the front wheel centres, m
step: at R = 4 m, δ_i = atan(1.4 ÷ 3.55) = 21.5°
step: δ_o = atan(1.4 ÷ 4.45) = 17.5°
```

This is an illustration. For a corner with a radius of 4 m at the centre of the tractor's rear axle, the inner front wheel must turn to **21.5°** and the outer to **17.5°**, a difference of 4°. If both turned to 21.5°, the outer wheel would try to roll around a circle of 4.0 m when it needs to follow one of 4.67 m, and it would scrub sideways through the whole turn. A tractor with worn or badly adjusted steering linkage scrubs its front tyres, wears them unevenly and steers heavily. Uneven front tyre wear is often the first sign that the linkage needs attention.

## The smallest turning circle

The tightest turn is set by the maximum angle the inner front wheel can reach, which is limited by the steering stops, the tyre's clearance to the body and the linkage geometry.

This is an illustration. If the tractor's inner front wheel can turn to **55°**, the tightest radius at the centre of the rear axle is **1.4 ÷ tan 55° + 0.45 = 1.43 m**. At that turn, the outer front wheel runs on a circle of **√((1.43 + 0.45)² + 1.4²) = 2.34 m** radius. The body's outer front corner, 0.4 m ahead of the front axle and 0.5 m out from the centre line, runs on a circle of **√((1.43 + 0.5)² + 1.8²) = 2.64 m** radius.

Makers usually quote turning circles as a diameter, and they may measure it at the outer wheel or at the outermost point of the body. The two differ by 0.6 m in this case. For planning aisles, the body figure is the one that matters, because it is the body that strikes a rack or a column.

There is a second, smaller effect at the back. Any part of the body behind the rear axle swings outward when the vehicle turns, because it sits on a radius larger than the rear axle's offset alone. This is an illustration. If the tractor's body extends 0.6 m behind its rear axle, its outer rear corner runs at **√((1.43 + 0.5)² + 0.6²) = 2.02 m** on the tightest turn, 0.09 m outside the line of its side. That tail swing is small on a short tractor, but it surprises people standing beside a vehicle that starts to turn away from them: the rear corner moves toward them. On long vehicles and forklifts with rear-wheel steering it is much larger, and it is one reason pedestrians are kept well clear of a vehicle that is about to move off.

## Trailers cut inside

A trailer does not follow the tractor's wheels. Its drawbar is pulled by the hitch, and the trailer's wheels follow a path inside the path of the hitch. On a steady turn, each point that is towed along a fixed length behind a leading point runs on a smaller circle, and the reduction compounds along the train.

The running case uses trailers with a turntable front axle: the drawbar steers the front axle about a central pivot, and the rear axle is fixed. For a steady turn, the radii of the key points follow from right-angled triangles.

- **Hitch on the tractor**, 0.5 m behind the rear axle: **R_h = √(R² + 0.5²)**
- **Trailer turntable pivot**, a drawbar length of 1.0 m behind the hitch: **R_p = √(R_h² − 1.0²)**
- **Trailer rear axle**, a wheelbase of 1.2 m behind the pivot: **R_r = √(R_p² − 1.2²)**
- **Next hitch**, 0.4 m behind the trailer's rear axle: **R_h = √(R_r² + 0.4²)**, and the pattern repeats for the next trailer.

This is an illustration. On a corner with R = 4 m at the tractor's rear axle, the three trailers' rear axles run at radii of **3.72 m, 3.40 m and 3.04 m**. Each runs further inside the tractor's path. The amount by which a trailer's rear axle runs inside the tractor's rear axle is its off-tracking.

```figure
type: bars
title: Off-tracking of each trailer on a 4 m corner
unit: m
max: 1.5
caption: This is an illustration. Steady turn at 4 m radius at the tractor's rear axle; hitch 0.5 m behind it; trailers with 1.0 m drawbar, 1.2 m wheelbase and rear hitch 0.4 m behind the rear axle. Values are the inward offset of each trailer's rear axle from the tractor's.
- First trailer | 0.28
- Second trailer | 0.60
- *Third trailer | 0.96
- A fourth trailer, if added | 1.36
```

The off-tracking grows faster than linearly along the train, because each trailer starts from a point that is already inside. The third trailer runs almost a metre inside the tractor. A fourth would run 1.36 m inside.

The steady-turn values are an upper bound. On a short 90° corner, the train may complete the turn before the rearmost trailers reach their steady path, so the real off-tracking is a little smaller. That makes the steady calculation a safe planning figure, and the simplest one. For tight or unusual layouts, a swept-path simulation or a full-size trial with the real train, marked with chalk, is the better check.

## The swept path

The swept path is the band of floor that the train's bodies pass over through the corner. Its outer edge is set by the tractor's outer front corner; its inner edge by the inner side of the rearmost trailer.

This is an illustration. On the 4 m corner, the tractor's outer front corner runs at **√((4 + 0.5)² + 1.8²) = 4.85 m**. The third trailer, 1.0 m wide, has its inner side at about **3.04 − 0.5 = 2.54 m**. The swept path is **4.85 − 2.54 = 2.31 m** wide.

```figure
type: compare
title: Swept path width on corners of different radius
cols: Tractor alone | Tractor and three trailers | Tractor and four trailers
caption: This is an illustration. Radius measured at the tractor's rear axle; tractor and trailers 1.0 m wide; trailer geometry as above. Widths exclude any clearance margin.
- 3.5 m corner | 1.39 m | 2.54 m | 3.09 m
- *4 m corner | 1.35 m | 2.31 m | 2.71 m
- 5 m corner | 1.29 m | 2.02 m | 2.29 m
```

Three patterns stand out. The tractor alone sweeps little more than its own width. The train sweeps much more, and the difference grows on tighter corners. Adding a trailer widens the swept path more than widening the corner radius narrows it. Each of those is a planning lever: a larger corner radius, a shorter train, or trailers with a different steering arrangement.

Some tugger trailers are designed to track the tractor closely, with both axles steered by linkages from the drawbar. They cost more and need maintenance of the linkages, but on a site with tight aisles they can reduce the swept path dramatically. The trailer maker's swept-path data governs for such designs; the calculation above applies to simple turntable trailers.

## Measuring a swept path on site

Calculations of off-tracking rest on idealised geometry: rigid drawbars, no play in the hitches, tyres that do not slip sideways and a driver who holds a steady radius. Real trains are a little untidier. A full-size trial is quick and catches what the calculation misses.

```figure
type: steps
title: A chalk trial for a corner
caption: A practical method for the running case. Run it with the longest and widest train that will use the corner, at the speed drivers actually use, in a closed-off area.
- Prepare | clear the corner, close it to pedestrians and fix a chalk holder or marker to the outer front corner of the tractor and the inner rear corner of the last trailer
- Drive | run the train through the corner as drivers normally do, at normal speed, in both directions if the corner is used both ways
- Measure | measure the distance between the two chalk lines at their widest, and their distance from racks, columns and walkway edges
- Compare | check the result against the calculated swept path; a difference of more than about 0.2 m means the geometry or the driving differs from what was assumed
- Record | mark the agreed lane on the route drawing with the train length and trailer type it was measured for
```

This is an illustration. When the site ran the trial on the 4 m corner, the chalk lines were 2.25 m apart at their widest, slightly less than the calculated 2.31 m, because the 90° corner was too short for the third trailer to settle fully onto its steady path. The calculated value was kept for marking, as the safer of the two. The trial also showed that drivers began their turn about half a metre later than the drawing assumed, which moved the swept path slightly outward, toward the racks on the outside of the corner. The outer clearance was checked again and found adequate.

## The error: walkway lines from the tractor's turning circle

The corner between the main aisle and the assembly hall was marked with a vehicle lane and a pedestrian walkway on its inside. The lane width was set from a test drive of the tractor alone: its swept path, 1.35 m, plus a clearance of 0.45 m, gave a marked lane **1.8 m** wide. The lane's outer line was 0.2 m outside the tractor's outer corner path, at 5.05 m, so its inner line, the edge of the walkway, was at **3.25 m**.

The third trailer's inner side runs at 2.54 m. On every trip, it crossed **0.71 m** into the walkway. Drivers could not see it happen, because they were looking ahead through the corner, and the trailers were behind them. Pedestrians had learned to step back when a train came, but a person walking with their back to the corner would have been inside the trailer's path.

The error was found when a new supervisor stood at the corner during a busy hour and watched the third trailer's wheels run over the walkway line. The correction was to re-mark the corner from the train's swept path: a lane of **2.7 m**, which is the 2.31 m swept path plus 0.2 m clearance on each side, with the walkway moved inward and a barrier added along its edge at the corner. The site also added the swept path to its route drawings, so that any future change to the train length or the corner would show up on paper first.

The general lesson is the one this book keeps returning to: test or calculate the configuration you actually run. A tractor alone is not a train.

## Speed in the corner

Turning also produces a sideways acceleration, v² ÷ R, which Chapter 10 uses to check whether a vehicle or a load can tip. This is an illustration. On the 4 m corner, at the 10 km/h aisle limit, it is **2.778² ÷ 4 = 1.93 m/s²**; at 5 km/h, it is **0.48 m/s²**. Halving the speed quarters it. The swept path does not depend on speed at the low speeds of a site, but the risk of a load shifting or a trailer tipping does, and the site sets 5 km/h for all corners.

## Reversing a train

A tractor with one trailer can be reversed with care. With two or more, the trailers fold under any small steering input, because each hitch is unstable when pushed. Most sites forbid reversing trains with more than one trailer, and lay out their routes as loops or with turning areas, so that no reversing is needed. The swept path of a train turning in a loop must be checked in the same way as any corner, including the tightest point of the loop. A loop that is generous for the tractor can still be tight for the last trailer, so the check uses the whole train.

## Exercise: a fourth trailer

Chapter 2's exercise considered adding a fourth trailer. On the re-marked 4 m corner, with its 2.7 m lane whose inner edge is at 2.35 m, would a fourth trailer fit? If not, what corner radius would give a four-trailer swept path no wider than the three-trailer path on the 4 m corner?

**Worked answer.** On the 4 m corner, the fourth trailer's rear axle runs at **2.64 m**, so its inner side is at **2.14 m**. The lane's inner edge is at **4.85 + 0.2 − 2.7 = 2.35 m**, so the fourth trailer would cross the line by **0.21 m**. It does not fit.

From the comparison figure, a four-trailer train on a 5 m corner sweeps **2.29 m**, slightly less than the 2.31 m of the three-trailer train on the 4 m corner. So the corner would need a radius of about 5 m at the tractor's rear axle, with the lane re-marked to match its new position. If the building does not allow that, the fourth trailer cannot run through this corner, whatever its effect on energy and traction elsewhere. The swept path, like the ramp's grip, can veto a change on its own.
