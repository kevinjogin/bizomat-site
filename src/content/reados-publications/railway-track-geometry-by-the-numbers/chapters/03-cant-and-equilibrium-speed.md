---
book: railway-track-geometry-by-the-numbers
chapterSlug: cant-and-equilibrium-speed
order: 3
title: "Cant and equilibrium speed"
description: "Derive the cant that balances a train's turning at a given speed, calculate equilibrium cant for the running case's main line, and see why one cant cannot suit fast passenger and slow freight trains."
draft: false
---

A train going round a curve must be pushed towards the curve's centre to follow it. On level track, that push comes entirely from the rails pressing sideways on the wheel flanges, and the people and loads in the train feel it as a sideways force throwing them outward. Tilting the track, by raising the outer rail above the inner, turns part of the train's weight into the push it needs, so that less comes from the flanges and less is felt inside. The height difference is called cant, or superelevation, and at one particular speed, the equilibrium speed, it balances the turning exactly: the train's weight and its turning acceleration combine to act straight down through the floor, and neither rail is favoured.

This chapter derives the equilibrium cant for a given speed and radius, calculates it for the running case's main line curve, shows why a single cant cannot suit both fast passenger trains and slow freight, and explains what each side of the compromise costs.

## The balance of forces

A train of mass m going round a curve of radius R at speed V needs a force m V² ÷ R towards the curve's centre. On track tilted at a small angle, its weight m g has a component along the tilted plane of about m g times the cant divided by the distance between the rails' centres. When those two are equal, there is no sideways force along the track's plane at all, and the train is in equilibrium.

```figure
type: formula
title: Equilibrium cant for the running case's passenger trains on the main line curve
formula: equilibrium cant = rail centres × speed² ÷ (g × radius), or in practical units, about 11.8 × V² ÷ R
caption: This is an illustration for standard gauge with rail centres of about 1,500 mm, speed V in km/h and radius R in metres, which gives cant in millimetres. The constant 11.8 is 1,500 ÷ (3.6² × 9.81).
- Rail centres | about 1,500 mm
- Passenger speed | 115 km/h
- Radius | 800 m
step: equilibrium cant ≈ 11.8 × 115² ÷ 800
step: equilibrium cant ≈ 11.8 × 13,225 ÷ 800 ≈ 195 mm
step: for freight at 80 km/h on the same curve, about 11.8 × 6,400 ÷ 800 ≈ 94 mm
```

Equilibrium cant rises with the square of the speed and falls with the radius. Doubling the speed needs four times the cant; halving the radius needs twice the cant. A passenger train at 115 km/h on an 800 m curve would need about 195 mm of cant to be in equilibrium; a freight train at 80 km/h on the same curve needs only about 94 mm.

```figure
type: bars
title: Equilibrium cant on an 800 m curve by speed
unit: mm of cant, standard gauge
max: 260
caption: This is an illustration from the formula above. Cant grows with the square of speed, so the fastest trains on a line set the demand for cant, and the slowest set the limit on it.
- 60 km/h | 53
- 80 km/h, freight | 94
- 100 km/h | 148
- *115 km/h, passenger | 195
- 130 km/h | 249
```

## One curve, many speeds

Most lines carry trains of different speeds: passenger trains, fast freight, slow heavy freight, track machines, and trains that stop on the curve at signals. One cant cannot be the equilibrium cant for all of them. The track designer chooses a single applied cant for the curve, and every train running faster than that cant's equilibrium speed has too little cant, a cant deficiency, while every train running slower has too much, a cant excess.

For the running case's curve, an applied cant of 110 mm has an equilibrium speed of about 86 km/h. A passenger train at 115 km/h runs with a cant deficiency of about 195 − 110 ≈ 85 mm; a freight train at 80 km/h runs with a cant excess of about 110 − 94 ≈ 16 mm. Chapter 4 explains how much deficiency and excess are acceptable and what limits them.

## What too little cant does

A train with cant deficiency is pushed outward along the track's plane. Its passengers feel a sideways acceleration, which for a deficiency D is about g × D ÷ 1,500; for 85 mm, about 9.81 × 85 ÷ 1,500 ≈ 0.56 m/s², a noticeable but tolerable lean for seated passengers. The outer rail carries more of the train's weight than the inner, and the wheel flanges press harder on the outer rail, wearing it and the flanges faster. At high deficiency, the inner wheels are unloaded, and in the extreme the train could overturn or a wheel climb the rail, which is why deficiency is limited.

## What too much cant does

A train with cant excess is pushed inward. The inner rail carries more of its weight, and heavy, slow freight trains crush and wear the inner rail's head, a common problem on curves canted for passenger trains that also carry heavy freight. Slow trains on high cant also lean inward on their springs, and a train stopped on a heavily canted curve leans most of all; its passengers feel tilted, its loads shift inward, and in the extreme a high-sided empty wagon in a strong wind could be at risk. Starting a heavy train on a heavily canted curve is harder too, because the wheels on the high rail are unloaded.

## Choosing the applied cant

The applied cant is a compromise among these effects. It is set high enough that the fastest trains' deficiency is within the allowed limit, low enough that the slowest trains' excess is within its limit, and within a maximum cant the standard allows for that kind of line. Where the fastest and slowest speeds are far apart, there may be no cant that satisfies both, and then either the fast trains are slowed on the curve, the slow trains are speeded up where practical, or the curve is eased to a larger radius. The design standards of the infrastructure manager set the limits; this book does not quote them.

```figure
type: compare
title: The cant compromise on a mixed-traffic curve
cols: Too little cant for the train | Too much cant for the train
caption: General description for teaching. The governing standard sets maximum cant and the limits of deficiency and excess for each line.
- Felt by passengers | pushed outward | tilted inward, especially when stopped
- Rail wear | outer rail and flanges | inner rail head crushed by heavy slow trains
- *Safety limit | overturning outward and flange climb at high deficiency | instability of slow or stopped trains at high excess
- Clearance | vehicle rolls outward on its springs | vehicle leans further inward
```

## Cant and the gauge

The formula uses the distance between the rails' centres, about 1,500 mm on standard gauge. On narrow gauge track, the same cant tilts the track more, because the rails are closer, so the equilibrium cant for the same speed and radius is smaller; on broad gauge, it is larger. Designers working on dual gauge track, where vehicles of two gauges share a curve, find that a cant suits the two gauges differently, another reason such track is designed with care.

## Cant on straights and in sidings

Straight track has no cant; its cross level should be zero. Sidings, loops and yards, where trains move slowly, usually have no cant either, because slow trains do not need it and cant would only add excess. ARTC's NSW Track Standards Construction, TCS 01, stated that superelevation is not applied to sidings. The running case's balloon loop, with its slow trains, has no cant, even on its 250 m curve; at 25 km/h, the equilibrium cant there would be only about 11.8 × 25² ÷ 250 ≈ 30 mm, a small deficiency to run without.

## Where the speeds come from

Choosing cant needs the speeds of the trains that will actually use the curve, not just the line's maximum speed. A curve at the bottom of a long descent may see heavy freight running faster than its nominal speed; a curve just beyond a station may see passenger trains still accelerating, well below line speed; a curve approaching a junction or a signal where trains often stop needs to be comfortable for stopped trains. The designer collects the speed profiles of each type of train over the curve, from timetables, train performance calculations and the line's speed limits, and chooses the cant against the real range. For the running case's main line, the infrastructure manager provided the existing speed profile and confirmed that the grain trains would run at no more than 80 km/h on the curve.

## Curve speed limits

Each curve has a maximum speed set by its radius, its applied cant and the allowed cant deficiency: the speed at which the deficiency reaches its limit. That speed is displayed to drivers on speed boards and built into train control systems. Raising a line's speed therefore often means raising cant on its curves, which is limited by the slow trains' excess and by the maximum cant allowed, or easing the curves, which means realigning track and sometimes buying land. Many line upgrades are, at heart, exercises in cant and curve radius.

## Tilting trains

Some passenger trains tilt their bodies inward on curves, on top of the track's cant, so that passengers feel less sideways force at a given speed. They can run with much greater cant deficiency than ordinary trains for the same comfort, and so run faster on the same curves. Tilting does not change the forces on the track or the wheels, though, so their speed is still limited by the rails' and wheels' ability to carry the deficiency safely, and their tilt changes the space they occupy, which the clearances must allow for.

## Measuring cant

Cant is measured as the cross level, the height difference between the rails, at intervals along the curve, with a track gauge fitted with a level, a trolley, or a recording vehicle. On the circular part of the curve, the cross level should equal the design cant everywhere; along the transitions, it should rise or fall steadily. The variation of the cross level from the design, and how quickly it changes along the track, are both checked against tolerances, as Chapter 9 explains, because an uneven cant gives a rough ride and can twist a vehicle's frame.

## Cant on bridges and slab track

On ballasted track, cant is set by tamping and can be adjusted. On bridges with the rails fixed directly to the deck, and on slab track, the cant is built into the structure, so it must be right when built and cannot easily be changed later for new speeds. A designer setting the cant on a new bridge or slab section thinks about the line's possible future speeds as well as today's, because the structure will outlast several timetables.

## Cant and the vehicle's springs

The equilibrium calculation treats the train as rigid. Real vehicles sit on springs, and when a train runs with deficiency, the body rolls outward on its suspension, so the passengers feel a little more sideways acceleration than the track's cant alone would suggest, and the body's position shifts outward. With excess, it rolls inward. The amount depends on the suspension's stiffness, and it matters for comfort and for clearances, as Railway Clearances by the Numbers explains, which is one reason vehicle and track designers agree on the deficiency limits together.

## The running case: the main line curve and the junction

This is an illustration. The cooperative's junction turnout leaves the main line just beyond the end of the 800 m curve. The infrastructure manager told the engineers that the curve's existing applied cant was 110 mm and that the turnout must be on straight, level track, so the cant would be run off on the transition before the turnout, as Chapter 5 describes. The engineers checked that the new grain trains, running at up to 80 km/h on the main line, would have a cant excess of about 16 mm on the curve, small and within the range the existing traffic already used, so the curve's cant would not need changing for them.

## A failure: the curve canted for the wrong train

This is an illustration. A curve on a line that had once carried mostly passenger trains had been given a high cant for their speed. Years later, the passenger service was reduced and the line carried mainly slow, heavy mineral trains. Their large cant excess concentrated their weight on the inner rail, which wore and crushed rapidly; the inner rail on that curve needed replacing every few years, while the outer rail barely wore.

The cant had been right for the old traffic and wrong for the new. A review of the curve's cant against the current traffic mix, and a reduction in cant to suit the heavy trains while keeping the remaining passenger trains within their deficiency limit, reduced the inner rail's wear sharply. Cant is chosen for a traffic mix, and when the mix changes, the cant should be reviewed. The same is true in the other direction: a line converted from slow freight to faster passenger running may find its curves canted too low, so that the new trains must be slowed on them until the cant is raised and the curves rechecked for clearances and for the slow trains that still use them.

## Exercise: cant for a mixed curve

A 600 m curve carries passenger trains at 100 km/h and freight at 60 km/h. Calculate each one's equilibrium cant. If the applied cant is 120 mm, what is each train's cant deficiency or excess, and what is the curve's equilibrium speed?

The passenger train's equilibrium cant is about 11.8 × 100² ÷ 600 ≈ **197 mm**; the freight train's is about 11.8 × 60² ÷ 600 ≈ **71 mm**.

With 120 mm applied, the passenger train has a deficiency of about 197 − 120 ≈ **77 mm**, and the freight train an excess of about 120 − 71 ≈ **49 mm**. The curve's equilibrium speed is about √(120 × 600 ÷ 11.8) ≈ **78 km/h**. This is an illustration; whether 77 mm of deficiency and 49 mm of excess are acceptable is decided by the governing standard's limits, which Chapter 4 discusses.
