---
book: welding-automation-by-the-numbers
chapterSlug: sensing-and-adaptive-control
order: 7
title: "Sensing and adaptive control"
description: "Compare touch sensing, through-arc and laser seam tracking and vision, price the cycle time each adds, see when sensing beats better parts, and how adaptive control widens a robot's tolerance."
draft: false
---

Chapter 4 showed that a robot without sensors needs the joint within about a millimetre of where its program expects. Some parts cannot be made and fixtured that accurately at a sensible cost: long seams on large weldments that distort as they are welded, heavy plate with flame-cut edges, parts from suppliers whose tolerances the fabricator does not control. For those, the robot needs to find the joint for itself. Sensors let it do so, and adaptive controls let it change its path and parameters to suit what it finds. They are the modern form of what Morton described in 1919: a control governed by a dominant characteristic of the arc, which corrected the machine's behaviour when conditions departed from normal.

This chapter compares the main kinds of sensing used in welding automation, prices the cycle time they add, weighs sensing against making better parts, and explains adaptive control of path and fill.

## The kinds of sensing

```figure
type: compare
title: Sensing methods in robotic arc welding
cols: How it works | Corrects | Costs and limits
caption: General description for teaching. Sensor makers and integrators specify what each system can do on a given joint and material.
- Touch sensing | wire or nozzle touches the plates with a small voltage; contact recorded | part position before welding | adds seconds per search; needs clean plate surfaces
- Through-arc tracking | robot weaves; current changes as the torch nears each side | path along the joint during welding | needs a weave; suits fillets and grooves of some depth
- *Laser seam tracking | laser line and camera ahead of the torch measure the joint | path, gap and joint shape in real time | costly; head adds bulk near the torch
- Vision for part location | camera views the part or fixture before welding | part position and orientation | lighting and calibration; not joint detail
- Arc monitoring | current, voltage and wire feed recorded | detects faults after the event | finds problems, does not prevent them (Chapter 8)
```

Touch sensing is the simplest and commonest. Before welding, the robot moves the wire or the gas nozzle towards each plate of the joint with a small sensing voltage applied; when it touches, the circuit closes, and the robot records where the plate is. A few searches locate the joint in two or three directions, and the program is shifted to suit. Through-arc tracking uses the arc itself as the sensor: the robot weaves across the joint, and as the torch approaches each side wall the stick-out shortens and the current rises, so the controller can tell whether the weave is centred and correct the path as it goes, exactly the self-regulating behaviour of Chapter 2 turned into a measurement. Laser seam trackers project a line of laser light across the joint just ahead of the torch and view it with a camera, measuring the joint's position, gap and shape many times a second, which lets the robot follow the joint and adapt the weld in real time.

## The cost of a search

Touch sensing takes time. Each search is a slow approach to the plate, a touch and a retreat, typically taking a few seconds, and a joint may need two or three searches, a part several joints.

```figure
type: formula
title: Cycle time added by touch sensing on a bracket
formula: added time = searches per part × time per search
caption: This is an illustration for a bracket with about 33 seconds of arc time (Chapter 1) and two joints, each located by three searches of about 3 seconds. Search times vary with the robot, the distances and the settings.
- Searches | 2 joints × 3 searches = 6
- Time per search | about 3 seconds
- Arc time per bracket | about 33 seconds
step: added time = 6 × 3 = 18 seconds per bracket
step: cycle time rises from about 33 seconds of arc plus moves to about 51 seconds plus moves
step: on short welds, touch sensing can cut the cell's output by a third or more
```

On short welds, then, touch sensing is costly. On a long weld of several minutes, a few seconds of searching is trivial. The fabricator's rule became: use touch sensing on large parts with long welds and loose tolerances, and get small parts with short welds right through parts and fixtures instead.

## Sensing or better parts

The choice between sensing and better parts is an economic one. Better parts, through improved cutting, bending and fixtures, cost money once and benefit every part, every weld and every downstream process; they also make manual welding and assembly easier. Sensing costs equipment money and, for touch sensing, cycle time on every part, but it copes with variations that cannot be removed economically, such as the distortion of a large weldment as it is welded. The two are not exclusive: most cells use good fixtures and some sensing.

For the running case, the bracket stack-up of Chapter 4, at about 0.6 mm after the press brake upgrade, was inside the robot's tolerance without sensing, and the brackets ran without it. The implement frame sub-assemblies, larger and made from flame-cut plate, varied by two to three millimetres, more than better fixtures could economically remove, and the cell used touch sensing on them, at a cost of a few seconds on welds lasting a minute or more.

## Tracking during the weld

Touch sensing finds the joint before welding but cannot see it move during welding. On long welds, the heat of welding moves the parts, so a joint found accurately at the start may have shifted by the end. Through-arc tracking and laser tracking follow the joint as the weld is made. Through-arc tracking needs a weave and a joint with side walls the arc can sense, such as a fillet or a groove of some depth, and it responds to changes over a few weave cycles; it works poorly on thin sheet and lap joints with little wall. Laser tracking works on most joint shapes and responds quickly, at a higher cost and with a sensor head that adds bulk near the torch, which can limit access.

## Adaptive fill

Finding the joint is one thing; dealing with a gap that varies is another. A laser tracker that measures the gap as it goes can let the robot adapt the weld: slowing the travel, widening the weave or raising the wire feed where the gap opens, so that the same weld size and fusion are kept across a varying joint. That is what a skilled welder does by eye, and it lets a robot weld joints whose gaps vary more than a fixed program could bridge. The adaptive rules, how much to change each parameter for each change in gap, are developed and qualified in trials, because they change the weld's heat input and size and must stay within the procedure.

## Morton's control

Morton's description of the automatic machines in 1919 is a reminder that adaptive control is not new. Morton wrote that variations in the work's contour and in the wire or the work often exceeded the arc's natural self-correction, so Morton devised means that automatically and progressively varied the relation between the arc's energy and the feed rate, governed by what the arc itself was doing. That is adaptive control: a measurement taken from the process, used to change the process's settings. The sensors are now cameras and lasers and the controls are computers, but the principle is Morton's.

## Vision for loading

Cameras are also used before welding to find where a part is on a table or in a fixture, so that parts can be welded without precise locating, or to check that the right part is loaded the right way round. In cells that weld a variety of parts in small batches, a vision system can identify the part, call up its program and locate it in a few seconds, which can replace part of the changeover of Chapter 6. Vision for locating parts is improving fast; its cost and reliability on shiny, spattered steel under welding light must be proved on the actual parts.

## Sensing and safety of the program

Sensors widen the robot's tolerance, but they also introduce new ways to fail. A touch search that touches spatter instead of the plate records the wrong position; a laser tracker that loses the joint on a reflective surface or a tack may steer the torch off the joint. Good systems detect such failures, for example by rejecting a search result outside expected limits or stopping when the tracker loses the seam, and stop the cell or flag the part. The program must say what the robot does when the sensor gives an unexpected answer, and the operator must know how to recover.

## Finding the ends of a weld

Locating a joint across its width is only part of the problem; a robot also needs to know where the weld should start and stop. A bracket whose plate is a millimetre or two short moves the end of the joint, and a program that welds to a fixed point either runs off the end of the plate, leaving a lump of weld metal in the air, or stops short, leaving an unwelded end. Touch sensing can find the end of a plate as well as its face, at the cost of another search. Laser trackers detect the end of the joint as they reach it. On parts whose lengths vary, programs are written to start and stop a little inside the ends, with the ends finished by a short, separately located weld, or by hand.

## Multi-pass offsets

On a multi-pass weld, the first pass is laid along the joint the sensor found, and the later passes are laid at programmed offsets from it, up and across the joint, to build the weld bead by bead. If the root pass's path was corrected by sensing, the later passes must follow the same corrected path, or they will be offset from the joint by the amount of the correction. Robot controllers store the corrected path of the root and apply the offsets of each later pass to it, so that a joint that wanders is filled evenly. On heavy, wandering joints, some cells also re-measure the joint shape before each pass with a laser tracker, adapting the offsets to the actual groove left by the passes already laid.

## Sensing on carriages

Mechanised carriages benefit from sensing as much as robots do. A carriage running along a long seam on a plate that has distorted, or along a joint that is not quite straight, can be steered by a mechanical finger running in the joint, by through-arc tracking with a small weave, or by a laser tracker on the carriage, which moves the torch across the joint as the carriage travels. For the running case's chassis rails, the long jig held the joint straight enough that the carriage ran without sensing; on the longer rails of a heavy trailer range the fabricator later took on, a simple mechanical seam follower on the carriage kept the weld on the joint for the whole length.

## Sensing and records

The sensors' measurements are information as well as corrections. A record of how far each joint was from its nominal position, part by part, shows how consistent the upstream cutting, bending and fitting are, and a trend in the corrections warns of a press brake drifting or a fixture wearing before any weld goes wrong. The fabricator logs the touch-sensing offsets for each part and reviews them weekly with the fabrication supervisor, so that the sensor's corrections become a measure of the shop's accuracy, not just a hidden fix.

## What sensors cost

Touch sensing is often included with the welding package or costs a modest amount extra. Through-arc tracking is usually a software option. Laser seam tracking systems cost a substantial share of the robot itself, and need integration, calibration and skilled set-up. Vision systems vary widely. The fabricator priced each against the work it would be used on, and against the cost of making the parts more accurately, before deciding.

## The running case: the frame sub-assemblies

This is an illustration. The implement frame sub-assemblies, hitch brackets and gussets in 10 to 16 mm flame-cut plate, varied by up to about 3 mm in the position of their joints. The fabricator's trials showed that without sensing, about one weld in six missed its joint enough to be rejected. With touch sensing of each joint before welding, rejections fell to about one in two hundred, and the added cycle time was about 12% on welds of a minute or more. Laser tracking was trialled and gave similar results on these parts, at a much higher cost, so the fabricator chose touch sensing and kept laser tracking in mind for longer seams later.

## A failure: the searched spatter

This is an illustration. A cell's touch sensing began to record joint positions a millimetre or two off on some parts, and the welds moved with them. The cause was spatter stuck to the plates near the joints from an earlier tacking operation: the wire touched the spatter, not the plate, and the robot believed the plate was closer than it was.

The fabricator cleaned the tacking area's parts before welding and set the program to reject any search result that differed from the expected position by more than a set amount, stopping the cell for the operator to check. The false readings stopped, and the next time spatter caused a bad search, the cell stopped instead of welding wrongly.

## Exercise: to sense or not

A part has three joints, each needing two touch searches of about 3.5 seconds. Its arc time is 45 seconds and its moves and other times about 15 seconds. How much does touch sensing add to the cycle, as a percentage? If better fixtures costing A$9,000 would remove the need for sensing on this part, and the cell's time is worth about A$104 an hour, how many parts would it take for the fixtures to pay for themselves?

Touch sensing adds 3 × 2 × 3.5 = **21 seconds** to a cycle of 45 + 15 = 60 seconds, raising it to 81 seconds, an increase of **35%**.

Each part's 21 seconds of searching is worth about 21 ÷ 3,600 × 104 ≈ **A$0.61** of cell time. The fixtures would pay for themselves after about 9,000 ÷ 0.61 ≈ **14,800 parts**. If the part runs only a few thousand a year, sensing is cheaper; if it runs tens of thousands, the better fixtures win, provided the parts themselves are accurate enough for the fixtures to locate them within the robot's tolerance.
