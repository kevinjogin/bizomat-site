---
book: water-hammer-by-the-numbers
chapterSlug: column-separation-and-the-profile
order: 7
title: "Column separation and the pipeline profile"
description: "Draw the minimum head envelope after a pump trip against the pipe's profile, find where pressure goes sub-atmospheric or boils, and see why the rejoining columns are so dangerous."
draft: false
---

A maximum pressure is easy to picture and easy to compare with a rating. A minimum pressure is less visible and often more dangerous. When the grade line after a pump trip falls below the pipe, the water inside is under suction. Where it falls far enough, the water boils at ordinary temperature, the column breaks, and a vapour cavity opens inside the pipe. When the cavity collapses, the two columns of water on either side meet, and the impact can produce the highest pressure of the whole event.

This chapter draws the minimum head envelope for the case's main after a pump trip and lays it over the pipeline profile. It shows how the high point near chainage 600 m becomes the critical location, compares a hand screening with the model, and explains what happens physically at a column separation. It ends with an as-built survey that moved the answer by several metres.

## Vapour pressure in metres

Water at 20 °C has a vapour pressure of about 2.34 kPa absolute. Atmospheric pressure at sea level is about 101.3 kPa. In head of water, that puts vapour pressure at about **10.1 m below atmospheric**. Gauge pressure, which this book uses, can therefore fall to about −10 m before the water boils. Warmer water boils sooner: vapour pressure rises steeply with temperature, so a hot-water or process line has less margin, and sites at altitude have lower atmospheric pressure and less margin again.

Three levels matter along a pipeline after a trip:

- **above zero gauge:** the pipe is under positive pressure, as designed;
- **between zero and about −10 m:** the pipe is under suction. Water does not boil, but air can be drawn in through leaking joints, air valves open, gaskets designed for internal pressure can be unseated, and thin or plastic pipes can be loaded towards collapse;
- **at about −10 m:** the water reaches vapour pressure, cavities form and the column separates.

## Drawing the envelope

The minimum head envelope is the lowest grade line reached at each point along the main during the transient. Plotting it on the profile, with the pipe's own level, shows the pressure margin everywhere at a glance: where the envelope is above the pipe, pressure stays positive; where it dips below, the gap is the suction.

This is an illustration from the case's model, for a pump trip in which the flow at the pump falls linearly to zero over 8 s, as might be achieved with the flywheel discussed in Chapter 6.

```figure
type: line
title: Pipe level and minimum grade line after an 8 s pump rundown
x: Chainage, m
y: Reduced level, m
legend: Pipe | Minimum grade line
ymin: 95
ymax: 160
mark: 600 | high point
caption: This is an illustration from the case's model. The envelope dips below the pipe between about chainage 450 m and 750 m, by about 4.7 m at the high point.
- 0 | 100 | 113.3
- 150 | 109 | 118.1
- 300 | 118 | 123
- 450 | 128 | 128.1
- 600 | 138 | 133.3
- 750 | 139.5 | 138.7
- 900 | 141 | 144.1
```

The envelope starts at the pump about 13 m above the pipe and climbs towards the tank. The pipe climbs faster. They cross just after chainage 450 m. At the high point, the envelope is about **4.7 m below the pipe**: a suction of about 46 kPa. It recovers before the tank, which holds its level and therefore the grade line at the far end.

The pressure at the high point does not reach vapour pressure with an 8 s rundown, but it is under suction for a few seconds after every trip. On a potable line that would be unacceptable on contamination grounds alone. On the case's process main it is still a risk to joints and air valves.

## Comparing rundowns

```figure
type: compare
title: Minimum pressure head along the main for three rundowns
rowhead: Location
cols: 1 s rundown | 8 s rundown | 15 s rundown
caption: This is an illustration from the case's model, in metres of gauge pressure head. Entries marked vapour are where the model falls below about −10 m, so a cavity forms and the model's value is not physical.
- Pump, chainage 0 m | vapour | 13.3 m | 29.5 m
- Chainage 300 m | vapour | 5.0 m | 16.2 m
- Chainage 450 m | vapour | 0.1 m | 8.6 m
- * High point, chainage 600 m | vapour | −4.7 m | 1.1 m
- Chainage 750 m | vapour | −0.8 m | 2.1 m
- Inlet valve, chainage 900 m | 3.1 m | 3.1 m | 3.1 m
```

With the pump's own 1 s rundown, the whole line from the pump to beyond the high point reaches vapour pressure: a series of cavities, or a long cavity, forms. With 8 s the line stays above vapour pressure but goes sub-atmospheric around the high point. With 15 s it stays positive everywhere, though only by about 1 m at the high point, which is a thin margin for an estimate.

## Screening against the model

A hand screening can approximate the envelope. Take the slow-closure downsurge at the pump from Chapter 6, about 36.9 m for 8 s, assume it falls linearly to zero at the tank, and subtract it from the steady grade line. That gives a minimum grade line at the high point of about RL 135 m, 3 m below the pipe.

The model gives 4.7 m below. The screening was optimistic by nearly 2 m at the critical point, because it underestimated the downsurge at the pump and because the downsurge does not fall off linearly along the line. On a profile with a 1 m or 2 m margin, that difference decides whether a line has a problem. Screening is useful for deciding that a closer look is needed. It cannot clear a line with a high point near the grade line.

## Temperature and altitude shrink the margin

The 10.1 m of suction available before boiling applies to water at 20 °C at sea level. Both conditions change it. Vapour pressure rises steeply with temperature: at 40 °C it is about 7.4 kPa, which leaves about 9.6 m of suction. Atmospheric pressure falls with altitude: at about 1,000 m it is roughly 90 kPa, leaving about 8.9 m at 20 °C, and about 8.4 m for 40 °C water. A process line carrying warm water at an inland site can have a couple of metres less margin than the textbook figure, which on a profile like the case's is the difference between suction and boiling.

The same applies to dissolved gas. Water saturated with air begins to release it as bubbles at pressures well above vapour pressure, so gas pockets can form at a high point before the water boils. The minimum head envelope should therefore be compared with a limit chosen with some margin above vapour pressure, not with the vapour pressure itself. Many owners set their own limit for minimum pressure; where none is set, the surge study should state the one it used and why.

## An envelope for every event

The envelope in this chapter is for one event, an 8 s rundown. A complete check draws maximum and minimum envelopes for every event that can occur: each valve closure scheme, a single pump trip, a double trip on power failure, a pump start, and any emergency closure. At each chainage, the worst maximum and the worst minimum across all events form the design envelope, and the event that governed each point is recorded beside it.

For the case's main, the governing events would differ along the line. The inlet valve closure governs the maximum near the tank. The pump trip governs the minimum from the pump to beyond the high point. The pump start may govern the maximum near the pump if the discharge valve opens quickly. Recording which event governs where makes it obvious which protection measure protects which part of the line, and what happens if one is removed.

## Why the profile matters so much

The case's main has the profile that causes most column-separation problems: a steep rise from the pump followed by a long, flat run to the delivery point near the top. After a trip, the downsurge drags the grade line down by roughly the same amount near the pump, where the pipe is low and the margin large, and along the flat top, where the pipe is high and the margin small. The knee, where the steep section meets the flat section, is where the steady grade line sits closest to the pipe and where the downsurge bites.

Profiles that rise steadily to the delivery point, or that place the flat section low and the steep section near the end, tolerate trips better. Where the route allows a choice, a designer can sometimes remove a column-separation problem by lowering a high point a few metres or by moving the knee, which costs far less than protection equipment.

## What happens when the column separates

When the pressure at a high point reaches vapour pressure, the water there boils and a cavity opens. The column downstream, between the high point and the tank, is now held back by the tank's head and decelerates, stops and starts to run back. The column upstream, between the pump and the high point, is decelerating too after the trip, with the pump's check valve shut behind it. The cavity grows while the two columns move apart, then shrinks as they move back together.

When the cavity closes, the two columns meet with whatever relative velocity they have. The impact is a sudden velocity change, and it launches a Joukowsky wave in each direction. Rejoin surges are hard to predict by hand and can reach or exceed the Joukowsky value of the original event, because the closing velocity can be large and the collision is abrupt. Bergant, Simpson and Tijsseling's review in the references gives the history of this problem and of the models used for it. Many of the worst pipeline failures attributed to water hammer are column-separation events.

Simple models, including this book's, do not represent cavities. Where the model predicts pressures below vapour pressure, its later results are not physical, and a model with a cavity treatment, such as a discrete vapour cavity model, is needed.

## Consequences of sub-atmospheric pressure

Even without boiling, suction has consequences:

```figure
type: checklist
title: What sub-atmospheric pressure can do to a main
caption: Each item depends on the line's materials, joints and fittings. The pipe makers' and fitting makers' data state the external pressure or vacuum they tolerate.
- Air drawn in through leaking joints | air pockets form at high points and cause later surges
- Air valves open and admit air | intended, but the air must be expelled gently afterwards
- x Contamination in potable lines | groundwater or soil water drawn in through joints
- Gaskets unseated | some joint designs seal against internal pressure only
- Thin-walled or plastic pipe loaded externally | check against the pipe's collapse resistance
- ? Has the pipe been checked for full vacuum | a conservative check for any line that can separate
```

Steel pipe of the case's proportions is strong enough to resist full vacuum. Thin-walled steel, large-diameter ductile pipe and plastic pipe may not be, especially combined with soil loads on a buried line. The [tube collapse tool](/tools/tube-collapse/) gives a first check for a plain tube under external pressure; buried flexible pipes are designed to AS/NZS 2566.1, which accounts for the soil.

## Reading a profile for trouble

Before any calculation, a long section of a proposed main can be scanned for the features that make column separation likely. Each one marks a place to check closely on the minimum envelope:

- a **knee,** where a steep rise from the pump meets a flatter section;
- a **long flat top** close to the delivery level, as on the case's main;
- **local summits** along an otherwise rising line, such as a crossing over a road, a creek bank or a rock outcrop;
- any point where the steady grade line sits within about the size of a plausible downsurge of the pipe, which on a steel main can be well over 100 m;
- a **downhill section after a summit,** where the column beyond the summit can run away from the column behind it after a trip.

The case's main has the first two. Drawing the steady grade line on the long section and marking where it is closest to the pipe takes a few minutes and points straight at the places that need protection.

## A failure case: the design profile

This is an illustration. The surge screening for the case's main was done on the design profile, which placed the high point at RL 132 m, 6 m lower than it is. On that profile, an 8 s rundown kept the high point about 1.3 m above atmospheric, and the design note recorded "no sub-atmospheric pressure with flywheel". During construction, a rock outcrop near chainage 600 m made excavation to design level expensive, and the pipe was laid over it, 6 m higher. The as-built drawings recorded the change. Nobody re-ran the surge check.

The first sign was an air valve at the high point that hissed after every pump stop, admitting air. A few months later, the main began to bang on pump starts, as air collected at the high point was compressed and then expelled. The design profile had shown no suction at the high point; the as-built profile shows nearly 5 m.

The error was detected by matching the air valve's behaviour with the as-built levels. The correction was to re-run the surge analysis on the as-built profile and choose protection, described in Chapter 8. The procedure was changed so that any change of pipe level of more than about a metre at a high point, during design or construction, triggers a recheck of the minimum head envelope.

## Exercise: lowering the high point

Suppose the pipe at the high point could be lowered to RL 130 m, with the line between chainages 450 m and 750 m regraded to suit, and assume the minimum grade line from the 8 s model is unchanged. What is the new minimum pressure head at chainage 600 m? What about at chainage 750 m, where the pipe stays at RL 139.5 m?

**Answer.** At chainage 600 m the minimum grade line is RL 133.3 m, so the pressure head becomes 133.3 − 130 = **+3.3 m**, positive with a modest margin.

At chainage 750 m the pipe is unchanged at RL 139.5 m and the envelope is at RL 138.7 m, so the pressure head is still about **−0.8 m**. Lowering one point moves the problem along the flat section rather than removing it. Regrading would need to lower the whole flat run, or a longer rundown or other protection would be needed. This is a typical result on profiles with a long flat top.
