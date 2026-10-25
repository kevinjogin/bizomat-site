---
book: welding-automation-by-the-numbers
chapterSlug: levels-of-automation
order: 1
title: "Levels of welding automation"
description: "Place welding on the scale from manual to adaptive robotic, see what each step takes from the welder and what it demands of the parts, and compare arc-on time and output at each level."
draft: false
---

Welding automation is not one decision but a ladder. At the bottom, a welder holds an electrode and does everything: strikes the arc, feeds the metal, sets the travel speed and angle, and decides when the weld is done. At the top, a robot carries the torch along a programmed path, senses where the joint really is, adjusts its path and parameters, and records every weld, while a person loads parts and watches. Between the two lie several rungs, each of which takes one more task from the welder's hands and gives it to a machine. Each rung has its own costs, its own demands on the parts and the people, and its own payback.

This chapter sets out the rungs, shows what each takes over and what it demands, compares their arc-on time and output, and draws the first lesson of welding automation: that each step pays only if the work in front of it is ready for it.

## The ladder

```figure
type: compare
title: Levels of welding automation
cols: What the machine does | What the person does | Typical use
caption: General description for teaching. The names vary between industries and standards; what matters is which tasks the machine takes over.
- Manual | nothing beyond supplying power | everything: feed, travel, angle, judgement | repairs, one-offs, awkward access
- Semi-automatic | feeds the wire at a set rate | guides the torch, sets travel and angle | most production gas metal arc welding
- Mechanised | carries the torch at a set speed, or turns the work | sets up, starts, watches and corrects | long seams, circumferential welds, repeated straight runs
- Automatic | performs the whole weld cycle without adjustment | loads, unloads, monitors | dedicated machines for one part or joint
- *Robotic | moves the torch along a programmed path, any shape | programs, loads, inspects | repeated parts in batches, many joint shapes
- Adaptive | senses the joint and changes path or parameters | programs, oversees | variable parts, tight quality requirements
```

The first rung, semi-automatic welding, was the great change of the twentieth century. Gas metal arc and flux-cored welding feed the wire continuously from a spool, so the welder no longer stops every minute or two to change an electrode, and the feeding is done by a motor at a steady rate. The welder still guides the torch and decides everything else. Most production welding in fabrication shops today still sits on this rung.

Mechanised welding moves the torch, or the work, at a set speed: a tractor carriage running along a seam, a side-beam carrying a head over a long plate, or a positioner turning a pipe or a frame under a fixed torch. The person sets it up and watches, correcting the aim if needed. Automatic welding performs the whole cycle by itself, but for one job only: a dedicated machine that welds one part, as the old rake and hoop machines did. Robotic welding uses a programmable arm that can follow any path within reach, so one cell can weld many different parts. Adaptive systems add sensors that let the robot find the joint and change what it does when the part is not quite where the program expected.

## What each rung takes over

Each rung takes a specific skill from the welder. The wire feeder takes the feeding and the electrode changes. The carriage takes the travel speed and, if it runs on a track, the path. The robot takes the angle, the path and the timing of every movement. The adaptive controls take part of the judgement: the small corrections a welder makes, almost without thinking, when a gap opens or a joint wanders.

What is not taken is just as important. A semi-automatic welder still needs skill to guide the torch; a mechanised carriage still needs a person who knows what a good weld looks like; a robot cell still needs someone who can program it, set up the fixtures, judge the welds and fix problems. Automation moves skill rather than removing it, from the hand to the setting up, programming and checking of the machine, a theme Chapter 10 takes up in detail when it turns to people and skills.

## What each rung demands

As the machine takes more of the work, it needs the work to be more repeatable. A manual welder copes with a gap that varies along the joint, a part that is a few millimetres out of position, or rust on one end; they see it and adjust. A carriage running at a set speed along a track cannot see the gap; if the gap widens, the weld gets thin, and if the joint wanders away from the track, the weld misses it. A robot follows its programmed path exactly, wherever the joint actually is. The higher the rung, the more the parts must be the same every time, and the more the fixtures that hold them matter, as Chapter 4 explains.

## Arc-on time

The most immediate gain from each rung is in arc-on time, the share of paid time in which the arc is actually burning, called the operator factor in Arc Welding by the Numbers.

```figure
type: bars
title: Illustrative arc-on time by level of automation
unit: % of paid time with the arc burning
max: 80
caption: This is an illustration of typical ranges for teaching. Real figures depend heavily on the parts, the fixtures, the batch sizes and how well the work is organised around the welding.
- Manual covered electrode | 25
- Semi-automatic wire, hand-held | 35
- Mechanised carriage on long seams | 50
- *Robot cell, two stations | 70
```

Manual welding with covered electrodes has a low arc-on time because the welder stops to change electrodes, chip slag, reposition and rest. Semi-automatic welding removes the electrode changes and most of the slag. A mechanised carriage, once set up, keeps the arc burning along the whole of a long seam. A robot cell with two stations, so that a person loads one while the robot welds the other, can keep the arc burning most of the time, because the robot never tires and the loading happens while it works.

Arc-on time is not the same as output, because the parts must also be fitted, loaded, inspected and moved. But it is the first and largest lever, and it explains much of the payback of each rung.

## Speed as well as time

Machines also weld faster when the arc is burning. A carriage or robot can hold a steady travel speed, angle and stick-out that a person cannot sustain, so it can run at a higher current and speed without the weld going wrong. Morton, whose automatic arc machines Hornor described in 1920, reported that the machines did the work of three to ten manual welders, partly through steadier arc conditions that let them weld faster and with shorter arcs than a hand could hold. The combination of more arc-on time and faster welding is what makes the upper rungs so productive on the right work.

## Quality as well as quantity

The second gain from each rung is consistency. A welder's travel speed, angle and stick-out vary from weld to weld and over a shift as fatigue sets in; a machine's do not. Consistent parameters give consistent weld size, penetration and appearance, so fewer welds are oversized to be safe, fewer are undersized by mistake, and fewer need repair. Chapter 3 puts numbers on that gain, which on some work is worth as much as the extra output. A machine also repeats its mistakes perfectly, so a wrong setting produces a whole batch of identical bad welds, which is why the monitoring of Chapter 8 matters.

## Collaborative robots

A newer rung sits between the mechanised carriage and the full robot cell: the collaborative robot, a lighter arm designed to work near people with limited force and speed, often programmed by the welder guiding it by hand through the weld path and recording the points. Collaborative welding robots are cheaper and quicker to set up than conventional cells and suit small batches, but they are slower, carry lighter torches, and still need a risk assessment, because the welding arc, the hot work and the torch itself are hazards whatever the robot's force limits. Chapter 9 discusses their guarding.

## What automation does not fix

Automation does not fix a bad design, a joint the torch cannot reach, a welding procedure that does not work, or parts that are not made consistently. It magnifies them. A part designed for manual welding may have joints that a robot cannot reach without collision, or welds in an order that distorts the part when made quickly. Before automating, the fabricator reviews the part's design for welding by machine: access for the torch, joints that can be reached from one setup, consistent gaps, and a welding sequence that controls distortion, as Welding Distortion by the Numbers describes. Often a small change to the part makes the difference between a cell that runs and one that waits.

## The old dedicated machines

The earliest automatic welding machines were dedicated: each did one job. Hamilton and Oberg's book of 1918 described a semi-automatic resistance machine for garden rakes, which spaced, set and welded each tang to the rake's back automatically once the operator had loaded the parts.

```figure
type: formula
title: Output of the 1918 rake welding machine, as Hamilton and Oberg reported it
formula: welds per hour = welds in the day ÷ hours worked
caption: Historical figures from Hamilton and Oberg's account: 375 rakes, or 5,250 welds, in a nine-hour day by one operator. The comparison with hand forge or riveted work is not given here.
- Day's output | 375 rakes; 5,250 welds
- Working day | 9 hours
step: welds per rake = 5,250 ÷ 375 = 14
step: welds per hour = 5,250 ÷ 9 ≈ 583, about one every 6 seconds
step: rakes per hour ≈ 42, about one every 86 seconds including loading
```

A weld every six seconds, all day, from one operator, is a rate no manual process of the time could approach. It was possible because the machine did one thing, to one part, over and over, and the parts were made to be welded by it. Dedicated automatic machines are still the cheapest way to weld very large quantities of one part, and they still depend on the same condition.

## Flexibility and quantity

The trade between the dedicated machine and the robot is a trade between quantity and flexibility. A dedicated machine for one part is cheapest per weld when the quantity is enormous, but useless for any other part. A robot costs more to set up for each part, through programming and fixtures, but can be changed from one part to another. Manual welding needs almost no set-up, so it is cheapest for one-offs and small batches. The right rung for a given part depends on how many of it there are, how often it repeats, and how many different parts must share the equipment.

## Partial automation

Many of the best automation projects are partial. A positioner that turns a heavy frame so that every weld is made in the flat position, with the welder still holding the torch, can raise both speed and quality greatly at a fraction of the cost of a robot. A carriage for the long seams of a tank, with the short, awkward welds still done by hand, takes the most tiring and repetitive part of the job off the welder. A fixture that holds parts in the same place every time makes manual welding faster and is the first step towards a robot later. Climbing one rung at a time, where the work is ready, is usually wiser than leaping straight to the top, and each rung climbed makes the next one easier to reach.

## The running case: a survey of the shop

This is an illustration. The fabricator's owner began with a survey. For a month, a supervisor recorded, for each product, the number made, the welding hours, the arc-on time sampled with a stopwatch, and the kinds of joint. Trailer chassis, about 300 a year, had long straight seams on the main rails and many short welds on crossmembers. Implement frames, about 150 a year in a dozen variants, were large and heavy, with welds in every position. Brackets, about 40,000 a year in some sixty part numbers in batches of 200 to 2,000, were small, simple and repeated. The arc-on time averaged about 30% across the shop. The survey pointed to mechanised carriages for the chassis rails, positioners for the frames, and a robot cell for the brackets, the plan the following chapters test.

## A failure: the robot that waited

This is an illustration. Another fabricator in the region had bought a robot cell to weld a family of frames, without first checking how consistent its cut and bent parts were. In the first months, the robot spent much of its time stopped while operators re-fitted parts that did not match the program, or welding joints that missed where gaps had opened. Its arc-on time was lower than that of the manual welders it was meant to replace.

The problem was not the robot but the parts, which had been made for welders who could adjust. The fabricator spent a year improving its cutting, bending and fixtures before the cell reached the arc-on time it had been bought for. The owner of the running case's fabricator visited that shop before deciding anything.

## Exercise: arc-on time and output

A welder spends 7.5 paid hours a day welding brackets semi-automatically at an arc-on time of 35%. Each bracket needs about 40 seconds of arc time. How many brackets does the welder make in a day? If a robot cell runs the same welds 20% faster at an arc-on time of 70% over the same 7.5 hours, how many does it make, and how many welders' output is that?

The welder has about 7.5 × 0.35 = 2.6 hours, about **9,450 seconds**, of arc time, enough for about 9,450 ÷ 40 ≈ **236 brackets** a day.

The robot cell has 7.5 × 0.70 = 5.25 hours, about 18,900 seconds, of arc time, and needs about 40 ÷ 1.2 ≈ 33 seconds per bracket, so it makes about 18,900 ÷ 33 ≈ **570 brackets**, about **2.4 welders'** output. The arc-on time doubled the output and the faster welding added the rest, provided the parts and fixtures let the robot run without stopping.
