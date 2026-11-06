---
book: inertia-and-flywheels-by-the-numbers
chapterSlug: move-profiles-and-rms-torque
order: 6
title: "Move profiles and RMS torque"
description: "How to turn a repeated move into acceleration, run, deceleration and dwell torques, check RMS torque against a motor's continuous rating and peak torque against its peak, and choose the profile shape."
draft: false
---

A servo motor has two torque ratings. Its peak torque is what it can deliver for a short time; its continuous torque is what it can deliver indefinitely without overheating. A motor that meets the first can still fail the second if it is asked for its peak too often, and the measure of how hard a repeating cycle works a motor thermally is its root-mean-square, or RMS, torque: the square root of the time-average of the torque squared.

This chapter builds the DL-3 pusher's move cycle with the BIZOMAT servo or motor duty cycle check and cross-checks it with the RMS torque tool. It shows why heat goes with torque squared, how the profile's shape changes the RMS, and why short moves can be harder on a motor than long ones. Its mistake is an average used in place of an RMS, which hid an overload.

## Why the square

A motor's heating comes mainly from the current in its windings, and the loss is the current squared times the winding's resistance. For a servo, torque is proportional to current, so the heat is proportional to torque squared. Over a cycle, the average heat is proportional to the time-average of torque squared, and the steady torque that would produce the same heat is the square root of that average: the RMS torque.

Because of the square, a short burst of high torque produces far more heat than its share of the time suggests. Twice the torque for a quarter of the time produces as much heat as the same torque doubled in duration. That is why an acceleration that looks brief can dominate a cycle's heating.

```figure
type: formula
title: RMS torque over a repeating cycle
formula: T rms = √( Σ Ti² ti ÷ Σ ti )
formula: Accelerate: Ta = J ω ÷ ta + Tf
formula: Decelerate: Td = Tf − J ω ÷ td
caption: Ti is the torque in each segment and ti its duration; the sum runs over the whole cycle, including dwells. J is the total inertia at the motor, rotor plus reflected load; ω the top speed; Tf the friction and load torque while moving. A dwell counts at whatever torque the motor holds, zero only if the motor is truly unloaded.
- T rms | compared with the continuous rating
- Peak | the largest torque in any segment, compared with the peak rating
- Dwell | time at the holding torque, often a large share of the cycle
```

## The pusher's cycle

Each board's cycle on the DL-3 takes 2.5 s. The pusher accelerates for 0.3 s to 2.0 m/s, runs for 0.6 s, decelerates for 0.3 s, and so moves 1.8 m. It then dwells for 1.3 s while the saw cuts and the offcut drops, holding the board against the stop with 1.5 N·m at the motor. Chapter 4 gave the inertias at the motor, 0.00728 kg·m² reflected and 0.0029 kg·m² for the rotor, and the friction at the motor, 0.777 N·m. The servo is rated at 4.77 N·m continuous and 14.3 N·m peak, with a top speed of 3,000 rpm.

The [servo or motor duty cycle check](/tools/motor-duty-cycle-check/) takes the load inertia at the motor shaft, the rotor inertia, the top speed, the acceleration, running, deceleration and dwell times, the friction or load torque while moving and the holding torque during the dwell, and the motor's continuous torque, peak torque, top speed and largest inertia ratio. It returns the torque in each segment, the cycle time, the RMS torque, the peak torque, the inertia ratio and the energy returned on each deceleration, with checks on RMS against the continuous rating, peak against the peak rating, speed, and the inertia ratio. It assumes a trapezoidal move with constant acceleration.

```figure
type: steps
title: The pusher's cycle in the duty cycle check
caption: This is an illustration. Load 0.00728 kg·m² at the motor, rotor 0.0029 kg·m², top speed 1,910 rpm; 0.3 s, 0.6 s, 0.3 s, dwell 1.3 s; friction 0.777 N·m, holding 1.5 N·m; motor 4.77 N·m continuous, 14.3 N·m peak, 3,000 rpm, ratio limit 10.
- Accelerate, run, decelerate torque | 7.57, 0.78, −6.01 N·m
- Cycle time | 2.5 s
- * RMS torque | 3.54 N·m: 74% of continuous
- Peak torque | 7.57 N·m: 53% of peak
- Inertia ratio | 2.51
- Energy returned per stop | 180 J: MOTOR SUITABLE
```

The RMS of 3.54 N·m is 74% of the servo's continuous rating. The acceleration and deceleration together last 0.6 s of the 2.5 s cycle and account for most of the heat: their torques squared, times their times, are 17.2 and 10.8, against 0.36 for the run and 2.9 for the hold.

```figure
type: bars
title: Where the pusher's heating comes from
x: Segment
y: Torque² × time, N²·m²·s
caption: This is an illustration. The RMS is the square root of the total, 31.3, divided by the cycle time of 2.5 s. Acceleration and deceleration are 24% of the time and 89% of the heating.
- * Accelerate, 7.57 N·m for 0.3 s | 17.2
- Decelerate, 6.01 N·m for 0.3 s | 10.8
- Hold, 1.5 N·m for 1.3 s | 2.9
- Run, 0.78 N·m for 0.6 s | 0.4
```

## Cross-checking with the RMS torque tool

The [RMS torque tool](/tools/rms-torque/) takes up to five segments of torque and duration and a motor's continuous and peak ratings, and returns the RMS torque, the peak torque, the cycle time and the share of each rating used. Entering the four segments from the duty cycle check, 7.567 N·m for 0.3 s, 0.777 for 0.6 s, −6.012 for 0.3 s and 1.5 for 1.3 s, gives the same 3.539 N·m.

Its value is in cycles the trapezoid cannot describe. The DL-3's cutting lists mix long and short moves. A list that alternates the 1.8 m move with a 0.6 m move, which uses the same acceleration and deceleration but no running time, makes a two-board cycle of 4.4 s: 0.6 s accelerating, 0.6 s running, 0.6 s decelerating and 2.6 s holding. Its RMS is 3.76 N·m, 79% of the continuous rating, higher than the long-move cycle alone.

### Short moves are harder on the motor

A list of nothing but 0.6 m moves, one every 1.6 s, has an RMS of 4.35 N·m, 91% of the continuous rating. Each short move needs the same acceleration and deceleration as a long one, but spends no time running gently at speed, and there are more of them each hour. The motor's heating is set by the number of accelerations per minute, not by the distance travelled.

```figure
type: compare
title: RMS torque for three cutting lists
cols: Cycle | RMS torque | Share of 4.77 N·m
rowhead: Cutting list
- Long moves only, 1.8 m | 2.5 s per board | 3.54 N·m | 74%
- Alternating 1.8 m and 0.6 m | 4.4 s per two boards | 3.76 N·m | 79%
- * Short moves only, 0.6 m | 1.6 s per board | 4.35 N·m | 91%
caption: This is an illustration. Same acceleration and deceleration torques; holding 1.5 N·m during each 1.3 s cut. A short-board list is the pusher's worst thermal case.
```

The remedy is not a bigger motor but a gentler short move. A 0.6 m move does not need to reach 2 m/s. Done as a triangle in 0.8 s, peaking at 1.5 m/s, it needs 4.60 N·m to accelerate and −3.04 N·m to stop; with the same 1.3 s cut, the cycle is 2.1 s per board and the RMS falls to 2.68 N·m, 56% of the continuous rating. The board takes half a second longer, which the saw's cutting time, not the pusher, usually governs. The mill's motion program now chooses each move's profile from its length.

## The shape of the profile

For a fixed distance and move time, the profile's shape changes both the peak and the RMS. A short acceleration needs a high torque for a short time; a long one needs a lower torque for longer but leaves less time to cover the distance and so needs a higher top speed. For a trapezoid with equal acceleration and deceleration, the RMS over the move is least when each of the three parts takes a third of the move time.

For the pusher's 1.8 m in 1.2 s, the as-built profile spends a quarter of the move accelerating and a quarter decelerating. The one-third profile would lower the RMS from 3.54 to 3.46 N·m and the peak from 7.57 to 6.51 N·m, at the cost of a top speed of 2.25 m/s and 2,149 rpm. A triangular profile, all acceleration and deceleration, would need 3 m/s and 2,865 rpm and give an RMS of 3.73 N·m: the worst of the three.

```figure
type: compare
title: Profiles for the same 1.8 m move in 1.2 s
cols: Top speed | Motor speed | Peak torque | RMS over the cycle
rowhead: Acceleration share of the move
- 20% each | 1.88 m/s | 1,790 rpm | 8.73 N·m | 3.69 N·m
- * 25% each, as built | 2.00 m/s | 1,910 rpm | 7.57 N·m | 3.54 N·m
- 33% each | 2.25 m/s | 2,149 rpm | 6.51 N·m | 3.46 N·m
- 50% each, triangular | 3.00 m/s | 2,865 rpm | 5.87 N·m | 3.73 N·m
caption: This is an illustration. Cycle 2.5 s including a 1.3 s dwell at 1.5 N·m. The one-third trapezoid minimises the RMS, but the curve is shallow; the as-built profile keeps the motor speed lower for little thermal cost.
```

The mill kept the quarter profile because its lower top speed leaves more speed margin, as Chapter 5 preferred, and the thermal saving of the one-third profile is only 2%. Servo drives also offer S-curve profiles, which round the corners of the trapezoid to limit jerk; they raise the peak and RMS slightly but reduce the shock on the belt and the board.

## Over what time is the RMS taken?

The RMS over one cycle is the right measure when the cycle is short compared with the time the motor takes to heat up. A servo's windings and frame have a thermal time constant, given by its maker, that is typically measured in minutes or tens of minutes; over a cycle of a few seconds, the motor's temperature hardly moves and responds only to the average heat. When the duty changes over longer periods, the RMS must be taken over the worst stretch of time comparable with that time constant, not over the whole shift.

The DL-3's cutting lists change through a shift. Suppose a list runs short boards only for 20 minutes and then long boards for 40 minutes. Averaged over the hour, the RMS is √((4.35² × 20 + 3.54² × 40) ÷ 60) = 3.83 N·m, a comfortable 80% of the continuous rating. But for those 20 minutes the motor runs at 4.35 N·m, 91%, and if 20 minutes is long compared with its thermal time constant, it will reach nearly the temperature that 4.35 N·m produces. The mill's check therefore uses the worst list run on its own, not the shift's average.

## Torque against speed

A servo's peak torque is not available at every speed. Its torque-speed curve shows the peak torque falling at high speed, where the drive's voltage limits the current it can push through the windings. The acceleration's highest torque occurs at the end of the acceleration, at the highest speed, so it must be checked against the curve at that speed, not against the headline peak rating.

For the pusher, 7.57 N·m is needed at 1,910 rpm, well within the servo's curve, which stays near its 14.3 N·m peak to above 2,000 rpm. A profile that pushed the top speed towards 3,000 rpm, such as the triangular one, would need its 5.87 N·m peak at 2,865 rpm, where the curve has started to fall; that is a second reason the mill avoided it.

## Duty types and drive monitoring

Motor standards recognise that machines work in different patterns. IEC 60034-1 defines a set of duty types, from continuous running at constant load to periodic duties that include starting, electrical braking and rest, and motor makers rate their motors against them. A servo's continuous rating corresponds to steady running; a cycle like the pusher's is a periodic duty, and the RMS method is the usual way of relating one to the other.

Servo drives also monitor heating directly. Most estimate the motor's temperature from its current history, and some read a sensor in the windings, and they warn or trip before the motor overheats. During commissioning, the mill ran the worst cutting list for an hour and recorded the drive's thermal load figure alongside the predicted 91%. The drive's estimate is not a substitute for the calculation, which is needed before the motor is bought, but it is a useful check that the calculation's inertias, friction and holding torque were right.

## Energy returned

At the end of each move the motor brakes the load and becomes a generator. The duty cycle check reports the energy returned, the kinetic energy at top speed less the friction's share during deceleration: 180 J per move. At one move every 2.5 s that averages 72 W, which the servo drive must absorb in its DC bus capacitors, dissipate in a braking resistor or return to the supply. For a single small axis it is easily absorbed; on a machine with many axes stopping together it is a design item for the drive system.

## The mistake: an average instead of an RMS

The first thermal check of a faster cutting list used the time-average of the absolute torque. The fast list cut each board in 2.0 s: 0.2 s accelerating, 0.7 s running, 0.2 s decelerating and 0.9 s holding, giving torques of 10.96, 0.78, −9.41 and 1.5 N·m. Their time-average is 2.98 N·m, 62% of the continuous rating, which looked comfortable.

The duty cycle check gives an RMS of 4.70 N·m, 98.5% of the continuous rating. The motor would run at the edge of its thermal limit all shift, with no margin for a hot day, a worn rail or a heavier board. The average understates heating because it ignores the square: the 0.4 s of high torque contributes most of the heat. The mill rejected the fast list until a larger servo or a lighter carriage could be justified, and added the rule that thermal checks use RMS, never the average.

```figure
type: checklist
title: Before trusting a servo duty-cycle check
caption: The DL-3 review's checks. This is an illustration.
- x RMS torque, not the average, compared with the continuous rating
- x Worst cutting list checked: the shortest, most frequent moves
- x Holding torque during dwells included, not taken as zero
- x Peak torque compared with the peak rating at the motor's speed
- x Energy returned per stop given somewhere to go
- ? Ambient temperature against the motor's rating conditions, as in IEC 60034-1
```

## Exercise: a faster pusher cycle

**Problem.** For the fast cutting list above, with the same inertias and friction, find (a) the acceleration and deceleration torques for 0.2 s each to 1,910 rpm, (b) the RMS with a 0.7 s run and a 0.9 s hold at 1.5 N·m, and (c) the RMS if the holding torque could be reduced to zero.

**Answer.** Total inertia = 0.00728 + 0.0029 = 0.01018 kg·m²; ω = 200 rad/s.

(a) Ta = 0.01018 × 200 ÷ 0.2 + 0.777 = 10.96 N·m. Td = 0.777 − 10.18 = −9.41 N·m.

(b) Σ T² t = 10.96² × 0.2 + 0.777² × 0.7 + 9.41² × 0.2 + 1.5² × 0.9 = 24.03 + 0.42 + 17.70 + 2.03 = 44.18. RMS = √(44.18 ÷ 2.0) = 4.70 N·m: 98.5% of 4.77 N·m.

(c) Without the hold: √((44.18 − 2.03) ÷ 2.0) = 4.59 N·m, 96%. Removing the hold barely helps: the accelerations dominate.

**The check.** The fast list's peak, 10.96 N·m, is within the 14.3 N·m peak rating. It fails on heat, not on torque, which only the RMS shows.

A lighter carriage would help more than a lighter hold. Taking 10 kg out of the 40 kg carriage lowers the reflected inertia by 0.0011 kg·m², about 10% of the total, and the acceleration torques and the RMS fall by nearly the same share.
