---
book: pneumatics-by-the-numbers
chapterSlug: set-speed-timing-and-cushioning
order: 3
title: "Set speed, timing and cushioning"
description: "Build a timing budget for a fast pneumatic stroke, fire it at the right moment on a moving conveyor, control speed with meter-out flow control and absorb the kinetic energy at the end of travel."
draft: false
---

A pneumatic cylinder that is strong enough can still fail its job by being in the wrong place at the wrong time. On a moving line, the pusher has to fire at the right moment, reach the carton while it is in front of the plate, push it clear and be back before the next one arrives. It also has to stop at each end without slamming, because a fast stroke carries energy that has to go somewhere. Speed, timing and cushioning are where a pneumatic design meets the line it serves, and they are usually settled by turning screws on the machine until it seems to work. This chapter settles them with numbers first, so that the screws are turned to a target.

It builds a timing budget for the reject stroke, works out when to fire the pusher on a moving belt, explains meter-out flow control and why it beats meter-in for a double-acting cylinder, uses position sensors to confirm each stroke, calculates the kinetic energy that must be absorbed at the end of travel and sets the cushioning. The failure case is a pusher made faster by an operator after the line was sped up, which cracked its mounting bracket within six weeks.

## Build a timing budget

A stroke is not one event. Between the checkweigher's reject signal and the plate reaching the end of its travel, several things happen in turn, and each takes time.

```figure
type: timeline
title: The timing budget for one extend stroke
caption: This is an illustration. Valve response and fill time are assumptions; the real figures come from the valve maker's data and from measuring the stroke on the machine. The retract stroke is set slightly slower, at about 0.45 s.
- 0 ms | Signal | the controller sets the valve output, allowing up to 10 ms for its scan
- 10 to 30 ms | Valve shifts | an assumed 20 ms for the solenoid valve to switch
- 30 to 80 ms | Pressure builds | the cylinder fills until the piston force overcomes friction and the piston breaks away
- 80 to 380 ms | Travel | 300 mm at an average of about 1.0 m/s
- *380 to 430 ms | Cushion | the piston decelerates into the end of stroke
```

The extend stroke takes about **0.43 s**. With a short pause at full extension so the carton is clear, about 0.05 s, and a retract stroke of about **0.45 s**, the whole cycle takes about **0.93 s**, inside the 1.0 s budget from Chapter 1 with a small margin. The cartons arrive every 1.5 s, so the remaining half a second absorbs variation in spacing between cartons.

The budget also shows where time can be saved if it is ever needed. Travel is the largest part, and depends on how freely air can enter and leave the cylinder, which Chapter 4's valve and tubing choices control. The fill time before the piston moves depends on the volume of tubing between valve and cylinder, which is one reason to mount the valve close to the cylinder.

## Fire at the right moment

The belt does not stop for the pusher. During the time from the signal to the plate meeting the carton, and while the plate pushes it across the belt, the carton keeps moving downstream at 0.4 m/s. If the pusher fires when the carton is centred on the plate, the carton will have moved past the centre by the time the push is half done, and the plate will catch it near its trailing end, turning it.

The aim is for the carton's centre to line up with the plate's centre halfway through the push.

```figure
type: formula
title: How far ahead of the plate to fire the pusher
formula: lead distance = belt speed × (response time + half the push time)
caption: This is an illustration. Response time is from the signal to the plate meeting the carton; push time is from contact until the carton is clear of the belt. Both are measured on the machine and the setting is recorded.
- Belt speed | 0.4 m/s
- Response time, signal to contact | about 0.11 s
- Push time, contact to clear of the belt | about 0.27 s
step: lead distance = 0.4 × (0.11 + 0.27 ÷ 2) = 0.4 × 0.245 ≈ 0.098 m
step: fire when the carton's centre is about 100 mm before the plate's centre
```

A photo-eye a short distance upstream of the pusher detects the leading edge of each carton. The controller knows from the checkweigher which carton is to be rejected, and fires the valve when that carton's centre is about 100 mm before the plate's centre. Because the carton is 300 mm long, its centre is 150 mm behind its leading edge, so the firing point is set relative to the leading edge detected by the eye.

A fixed delay works only while the belt speed is fixed. The business's line runs at one speed most of the time, but it can be changed. This chapter's failure case shows what happens then. A more robust method takes the belt speed from an encoder on the conveyor and calculates the firing point from distance travelled, not time.

## Control speed with meter-out flow control

A cylinder supplied straight from a valve with no restriction moves as fast as air can enter and leave it, which is usually faster than the job needs and harder on everything it hits. Speed is controlled with **flow control valves**: adjustable restrictions, each with a check valve that lets air pass freely the other way.

There are two ways to fit them on a double-acting cylinder.

```figure
type: compare
title: Meter-in and meter-out flow control on a double-acting cylinder
cols: Meter-in | Meter-out
caption: This is an illustration of the general behaviour. Meter-out is the usual choice for double-acting cylinders; meter-in is used mainly on single-acting cylinders, where there is no exhaust side to restrict.
- What is restricted | air entering the cylinder | air leaving the cylinder
- What holds the piston steady | nothing; the exhaust side is open | back pressure on the exhaust side
- Speed when the load changes | varies a lot with load | varies much less
- Behaviour at low speed | prone to jerky stick-slip motion | smoother
- Behaviour if the load pulls the piston | piston can run away | exhaust restriction resists it
- *Choice for the reject pusher | no | yes, one flow control on each port
```

With **meter-out** control, the air leaving the cylinder is restricted, so the piston pushes against a cushion of air on its exhaust side the whole way. That back pressure holds the speed steadier as the load changes and stops the piston lurching forward when the friction suddenly drops. With **meter-in**, the exhaust side is open, the piston has nothing holding it back, and the combination of seal friction and compressible air can produce a stop-start motion at low speeds.

The pusher has a flow control fitted directly in each cylinder port, set for meter-out. The extend speed was set to bring the travel to about 0.3 s, and the retract speed slightly slower, because the retract stroke has no carton to slow it and spare time in the budget. Once set, each flow control was fitted with a locking cap, and its setting recorded as the number of turns from closed.

## Confirm every stroke with sensors

A controller that fires the valve and assumes the pusher moved will carry on regardless if the pusher sticks, a hose comes off or the air fails. The guided unit carries two magnetic position sensors, which detect a magnet in the piston at each end of travel. The controller checks that the retracted sensor goes off and the extended sensor comes on within **0.6 s** of firing, and that the retracted sensor comes back on within **0.6 s** of the valve returning. If either check fails, the controller stops the line and raises an alarm, because a pusher that did not move means a reject that was not rejected, and a pusher that did not return means the next good carton could be pushed off by mistake or jammed.

The same sensors give the stroke times as data. The controller logs the extend and retract times for every stroke, and a gradual rise in either is an early warning of a falling pressure, a blocked silencer or a wearing seal, long before the pusher actually fails.

## Confirm the carton actually left

Position sensors prove the pusher moved. They do not prove the carton went into the chute. A carton can be turned rather than pushed, catch on the chute's edge, or bounce back onto the belt. Because the reject station is a quality control, the maintenance lead added a second photo-eye across the mouth of the chute. For every carton the checkweigher marks as a reject, the controller expects the chute eye to see a carton within about **0.8 s** of the valve firing. If it does not, the controller stops the line so that an operator can find the carton before it reaches a pallet.

The chute eye also counts rejects. Comparing its count with the checkweigher's count of underweight cartons each shift gives a simple daily check that every reject was removed. In the first month, the two counts matched on every shift except one, when a carton jammed in the chute itself and the eye stayed blocked; that led to a smoother chute lining, not a change to the pusher.

## Absorb the energy at the end of the stroke

At the end of its travel, the moving parts of the pusher must stop. The energy they carry is their kinetic energy, half the mass times the speed squared. The moving parts weigh about **1.5 kg**. The carton has already been pushed clear by the time the plate decelerates, and slides on into the chute under its own momentum, so it does not count.

```figure
type: bars
title: Kinetic energy of the 1.5 kg moving parts at different end speeds
unit: J
max: 3.5
caption: This is an illustration. Energy rises with the square of speed, so doubling the speed quadruples the energy the cushions must absorb. The cylinder maker's data gives the energy the chosen unit's cushions can absorb.
- 1.0 m/s | 0.75
- *1.3 m/s, the pusher's expected peak | 1.27
- 2.0 m/s | 3.0
```

The average travel speed is about 1.0 m/s, and the speed just before the cushion is somewhat higher, estimated at **1.3 m/s**, giving about **1.27 J** to absorb. The guided unit has adjustable air cushions at both ends: near the end of travel, a spigot on the piston closes the main exhaust path, so the last part of the air must leave through a small adjustable needle, building back pressure that slows the piston. The maker's data for the chosen unit lists the energy its cushions can absorb with the mass and speed used, and 1.27 J was comfortably within it. Had it not been, the options were a lower speed, a lighter plate or external hydraulic shock absorbers.

The cushions were adjusted on the machine by listening and watching: opened until the piston hit the end cap audibly, then closed gradually until it arrived firmly without a knock and without bouncing back. That setting was also recorded as turns from closed.

## Check the timing on the machine

Once everything was set, the maintenance lead ran a timing check: fifty forced rejects at the line's normal speed, during the busiest hour so the pressure was near its lowest. The controller's log gave every stroke's extend and retract time, and a camera recorded where each carton met the plate. All fifty were pushed clear, the extend times averaged 0.43 s, and the longest cycle was 0.97 s, still inside the budget.

## A failure case: faster to keep up

This is an illustration. Eight months after the pusher was installed, the business raised line 2's belt speed from 0.4 to 0.45 m/s to meet a seasonal order. Nobody thought about the reject station, whose firing point was a fixed time delay after the photo-eye.

At the higher belt speed, cartons travelled further during the fixed delay, and the pusher met them nearer their trailing end. Some were turned rather than pushed, and a few stayed on the belt. An operator, seeing the pusher "too slow to catch them", opened both flow controls fully, removing the locking caps to do it. The pusher became much faster, rejects improved, and the shift carried on.

Without the flow controls holding it back, the pusher reached about **2 m/s** before the cushions, carrying about **3.0 J**, more than double the 1.27 J it was set for and beyond what the cushions were chosen to absorb. It hit the end of every stroke hard. Six weeks later, the weekly check found a crack in the weld of the mounting bracket.

The detection came from the weekly inspection, and the controller's stroke-time log confirmed when the change had happened. The real cause was the fixed time delay, which could not follow a change in belt speed. The correction was an encoder on the conveyor, so the firing point is calculated from distance, and a line-speed change procedure that includes checking the reject timing. The flow controls were reset to their recorded settings, the bracket was replaced, and the locking caps were replaced with tamper-evident ones.

## How this applies to a small Australian business

Small factories often tune pneumatic motion by feel, then retune it by feel whenever something changes. Build a timing budget so you know where the time goes. Fire the actuator from distance rather than time on any conveyor whose speed may change. Use meter-out flow control on double-acting cylinders, set the speed to a target, lock it and record the setting. Calculate the kinetic energy at the end of the stroke and compare it with the maker's figure for the cushions. And log stroke times: they are free data, and they show a problem developing long before it stops the line.

## Exercise: a faster line, done properly

The business decides to run line 2 permanently at **0.5 m/s**, with the same 0.6 m spacing between carton fronts. How often do cartons now arrive? Does the pusher's 0.93 s cycle still fit? With the same response and push times, what is the new lead distance? If someone suggests speeding the pusher up so its end speed is 2.0 m/s, what happens to the energy the cushions must absorb?

**Worked answer.** Cartons arrive every **0.6 ÷ 0.5 = 1.2 s**, 50 a minute. The 0.93 s cycle fits, leaving about **0.27 s** for variation in spacing, less than before but workable; a check of the spacing variation on the real line is needed. The new lead distance is **0.5 × (0.11 + 0.135) ≈ 0.12 m**, about **123 mm**. With an encoder, the controller makes that change automatically. Raising the end speed from 1.3 to 2.0 m/s increases the kinetic energy from about **1.27 J** to **3.0 J**, a factor of about **2.4**, because energy rises with the square of speed. Since the timing still fits at the present speed, there is no reason to speed the pusher up.
