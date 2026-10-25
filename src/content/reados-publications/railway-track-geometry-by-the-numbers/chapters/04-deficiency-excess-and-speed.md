---
book: railway-track-geometry-by-the-numbers
chapterSlug: deficiency-excess-and-speed
order: 4
title: "Cant deficiency, excess and speed"
description: "Turn cant and allowed deficiency into a curve's maximum speed, find the slowest speed its cant suits, check the margin against overturning, and fit the running case's grain trains to the curve."
draft: false
---

Chapter 3 showed that no single cant suits every train on a mixed-traffic curve. Fast trains run with too little, a cant deficiency; slow trains with too much, a cant excess. The question that follows is how much of each is acceptable. Railways answer it with limits: a maximum cant deficiency for each type of train, a maximum cant excess, and a maximum applied cant. From those limits and a curve's radius and cant come its maximum speed, the speed boards drivers see, and a minimum speed below which slow trains suffer too much excess. This chapter works through that arithmetic, which links the track designer's choice of cant directly to the timetable, the train control system and the wear of the rails on every curve of the line.

It calculates a curve's maximum speed from its cant and an allowed deficiency, finds the speed below which the excess becomes too large, checks how far a vehicle is from overturning at a given deficiency, and fits the running case's grain trains to the main line curve. The limits used are illustrations; the real limits come from the infrastructure manager's design standards, which this book does not reproduce.

## Maximum speed from cant and deficiency

At a curve's maximum speed, the equilibrium cant for that speed equals the applied cant plus the allowed deficiency. Turning the equilibrium formula around gives the speed.

```figure
type: formula
title: Maximum speed on the running case's main line curve
formula: maximum speed ≈ √((applied cant + allowed deficiency) × radius ÷ 11.8)
caption: This is an illustration with an assumed allowed deficiency of 100 mm for passenger trains, for teaching; real limits come from the governing standard. Speed in km/h, cant in mm, radius in m.
- Applied cant | 110 mm
- Allowed deficiency, assumed | 100 mm
- Radius | 800 m
step: maximum speed ≈ √((110 + 100) × 800 ÷ 11.8)
step: maximum speed ≈ √(14,237) ≈ 119 km/h
step: the passenger trains at 115 km/h, with about 85 mm of deficiency, are within the assumed limit
```

The allowed deficiency has a strong effect on speed, because speed goes with the square root of the total.

```figure
type: bars
title: Maximum speed on an 800 m curve with 110 mm cant, by allowed deficiency
unit: km/h
max: 130
caption: This is an illustration from the formula above. Allowing more deficiency raises speed, but each extra millimetre of deficiency is felt by passengers and carried by the outer rail.
- 50 mm allowed | 104
- 75 mm allowed | 112
- *100 mm allowed | 119
- 125 mm allowed | 126
```

Raising the allowed deficiency from 75 to 100 mm adds about 7 km/h on this curve; raising the applied cant by the same 25 mm adds the same speed, but at the cost of more excess for slow trains. Railways set different deficiency limits for different trains: higher for passenger trains designed for it, lower for freight whose loads and suspensions tolerate less, and much higher for tilting trains, whose bodies tilt to keep the felt acceleration down.

## Minimum speed from excess

The other side of the compromise is always the slow train. A train slower than the equilibrium speed has excess equal to the applied cant minus its own equilibrium cant, and if the excess is limited, there is a speed below which it is exceeded.

With 110 mm of cant and an assumed excess limit of 50 mm, the slowest speed at which the excess stays within the limit is the equilibrium speed of 110 − 50 = 60 mm of cant: √(60 × 800 ÷ 11.8) ≈ 64 km/h. A freight train at 50 km/h on this curve has an equilibrium cant of about 37 mm and an excess of about 73 mm, beyond the assumed limit. A train stopped on the curve has an excess equal to the full 110 mm. Slow and stopped trains are common, so excess limits are often less about passing trains than about trains that must stop or start on curves, and about heavy trains that crawl up grades.

## The window of speeds

Between the maximum speed set by deficiency and the minimum speed set by excess lies the window of speeds the curve's cant suits. A narrow window, as on curves carrying very fast and very slow trains, means the cant cannot please both, and some trains must change speed or the curve must change. A wide window means the cant is comfortable for the whole traffic mix, and the curve is likely to wear evenly and need little attention between scheduled maintenance.

```figure
type: compare
title: The speed window on the running case's main line curve
cols: Speed | Cant deficiency or excess | Status against the assumed limits
caption: This is an illustration with 110 mm applied cant on an 800 m curve and assumed limits of 100 mm deficiency and 50 mm excess, for teaching.
- Passenger train | 115 km/h | about 85 mm deficiency | within the limit
- Equilibrium | about 86 km/h | none | balanced
- *Grain train | 80 km/h | about 16 mm excess | within the limit
- Slow freight | 50 km/h | about 73 mm excess | beyond the limit
- Stopped train | 0 km/h | 110 mm excess | managed by the maximum cant allowed
```

## How far from overturning

At very high deficiency, the outward force on a vehicle could, in principle, tip it over the outer rail. A rigid vehicle overturns when the resultant of its weight and the unbalanced sideways force passes outside the outer rail, which happens when the unbalanced lateral acceleration, as a fraction of g, exceeds half the rail centres divided by the height of the vehicle's centre of gravity. The unbalanced acceleration is g × deficiency ÷ 1,500, so the deficiency at which overturning would begin is about 1,500² ÷ (2 × centre of gravity height).

For a loaded container wagon with its centre of gravity 2,000 mm above rail, that deficiency is about 1,500² ÷ 4,000 ≈ 562 mm. At the assumed limit of 100 mm, the margin against overturning is more than five to one before the springs, wind and track irregularities are considered. Those effects eat into the margin, especially for empty high-sided wagons in strong crosswinds and for vehicles with high centres of gravity, which is part of why deficiency limits are set well below the overturning value. Long before overturning, the unloaded inner wheels make flange climbing and derailment more likely, and the passengers' comfort sets an even lower practical limit for passenger trains.

## Wheel loads on curves

Cant deficiency and excess shift weight between the rails. With deficiency, the outer wheels carry more and the inner less; with excess, the reverse. The shift is roughly proportional to the deficiency or excess and to the height of the centre of gravity. Heavy trains with large excess crush the inner rail; fast trains with large deficiency wear the outer rail's gauge face and the wheel flanges. Rail grinding programmes, rail lubrication on curves and the choice of harder rail on sharp curves all respond to these loads, and a curve whose rails wear unevenly is often telling the engineer that its cant no longer suits its traffic.

## Passenger comfort

For passenger trains, comfort usually sets the deficiency limit before safety does. Seated passengers tolerate a steady sideways acceleration of around half a metre per second squared without much complaint, standing passengers less, and passengers carrying hot drinks or walking through the train less again. The unbalanced acceleration at 85 mm of deficiency, about 0.56 m/s², is near the level at which many railways set their passenger limits for ordinary trains. Comfort also depends on how quickly the acceleration changes, which the transitions of Chapter 5 control: a curve entered abruptly is uncomfortable even at modest deficiency, while one entered gently can be comfortable at more.

## Freight and its loads

Freight loads feel the same accelerations as passengers, but respond differently. Bulk loads such as grain and coal shift little; tall, top-heavy loads such as stacked containers, machinery and timber can shift or overturn on their wagons if poorly secured, and liquid loads in tanks slosh. Freight trains are also long and heavy, so their slow running on grades and through junctions often puts them in excess on canted curves for long periods. Freight deficiency and excess limits reflect these loads, and the load-securing standards that operators follow assume the curves are within them.

## Wind

A strong crosswind pushes on a train's side, adding to or subtracting from the curving forces. An empty, high-sided wagon, such as an empty container wagon or covered hopper, has a large side area and a low weight, and a gale blowing towards the inside of a curve adds to its tendency, on a heavily canted curve at low speed, to tip inwards. Exposed lines with high winds, on embankments, bridges and coastal plains, sometimes have wind restrictions, and the cant on curves there is chosen with high-sided empty wagons in mind.

## Approaching a lower-speed curve

When a curve's maximum speed is lower than the line's speed, trains must brake before it, and a curve that requires a large reduction costs running time and energy every time a train passes. The braking distance for a heavy freight train can be several kilometres, so the speed board is placed well before the curve, and drivers must judge their braking to arrive at the curve at its speed. Easing a single sharp curve on an otherwise fast line can save more time than any other improvement, which is why line upgrade studies begin by listing each curve's speed limit and its effect on the journey.

## Curves on grades

Curves on grades compound the slow-train problem. A heavy freight train climbing a long grade may be crawling at a fraction of line speed, giving it a large excess on any canted curve on the climb, while the same train descending runs near line speed. Cant chosen for passenger trains on such a curve punishes the climbing freight. Designers often set lower cant on curves where heavy trains climb, accepting a lower passenger speed there, and check the climbing train's excess as a separate case.

## Deficiency and the track's maintenance

The forces from deficiency and excess act on the track as well as on the trains. Outward forces from fast trains push the track's alignment outward on curves, and inward forces from slow heavy trains push it inward; both work the ballast and gradually shift the curve. Curves where trains regularly run at large deficiency or excess need their alignment maintained more often. A cant that keeps the traffic near balance is kinder to the track as well as to the rails and passengers, which is another reason to review cant when traffic changes.

## A note on limits

The limits used in this chapter, 100 mm of deficiency and 50 mm of excess, were chosen for teaching only. Real limits vary between railways, between types of train and between kinds of line, and are set out with their conditions in the infrastructure manager's design standards. The method is what transfers: from radius, cant and limits to the speed window, and from the speed window to the timetable, the speed boards and the rail wear on each curve.

## Speed boards and train control

The maximum speed for each curve, calculated from its radius, cant and the allowed deficiency for each train type, becomes the speed shown on lineside boards and programmed into train protection systems. Because the limit depends on the train type, a line may have different speeds for passenger trains, freight trains and special vehicles on the same curve. Changing a curve's cant or radius changes its speed limit, and the boards, the train control data and the timetable must change with it.

## The running case: the grain trains on the main line

This is an illustration. The cooperative's grain trains would join the main line at the junction and run over the 800 m curve at up to 80 km/h loaded. With 110 mm of applied cant, their excess at 80 km/h is about 16 mm, comfortably within the assumed 50 mm limit. Empty trains returning would run the same speed. The engineers checked one more case: a loaded grain train held at a signal on the curve, waiting for a passenger train to pass, would stand with 110 mm of excess. The infrastructure manager confirmed that its standard allowed the curve's cant for stopped trains of that type, and that the signal's position meant trains would rarely stop on the curve itself.

## A failure: the raised speed

This is an illustration. On another line, a passenger timetable improvement raised the speed on a 600 m curve from 90 to 105 km/h without changing its 100 mm cant. The new deficiency, about 11.8 × 105² ÷ 600 − 100 ≈ 117 mm, exceeded the line's passenger deficiency limit, and passengers complained of being thrown sideways; the outer rail's wear rate doubled.

The speed boards had been changed but the curve had not. The curve's cant was raised within the limit set by the slow freight that also used it, the remaining deficiency brought within the limit, and the timetable change reviewed curve by curve.

## Exercise: a curve's speed window

A 500 m curve has 90 mm of applied cant. Using assumed limits of 100 mm deficiency and 50 mm excess, calculate its maximum speed and the slowest speed at which the excess stays within the limit. Would a freight train at 45 km/h be within the excess limit?

The maximum speed is about √((90 + 100) × 500 ÷ 11.8) ≈ √8,051 ≈ **90 km/h**. The slowest speed within the excess limit is the equilibrium speed of 90 − 50 = 40 mm of cant: about √(40 × 500 ÷ 11.8) ≈ **41 km/h**.

A freight train at 45 km/h has an equilibrium cant of about 11.8 × 45² ÷ 500 ≈ 48 mm and an excess of about 90 − 48 = **42 mm**, within the assumed 50 mm limit. This is an illustration; the window from about 41 to 90 km/h suits that traffic, and the governing standard's real limits decide the actual speeds.
