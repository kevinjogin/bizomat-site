---
book: welding-automation-by-the-numbers
chapterSlug: travel-speed-and-heat-input
order: 3
title: "Travel speed, heat input and over-welding"
description: "Calculate heat input from voltage, current and travel speed, see how unsteady manual travel spreads weld size and heat, and price the over-welding that a steady machine travel speed removes."
draft: false
---

Of everything a welder controls, travel speed is the hardest to hold steady and the most influential. It sets how much weld metal goes into each millimetre of joint, so it sets the weld's size; it sets how much heat goes into each millimetre, so it sets penetration, distortion and the properties of the heat-affected zone. A welder's hand speeds up and slows down with the joint, the position, the view and the hour of the shift. A carriage or robot moves at exactly the programmed speed. That single difference is behind a large share of what mechanisation gains.

This chapter calculates heat input, shows how variations in travel speed spread the size of fillet welds and the heat they put in, explains why welders over-weld to stay safe, and prices the weld metal and time that a steady travel speed saves.

## Heat input

The heat a weld puts into the work per unit length is its heat input: the arc's power, the product of its voltage and current, multiplied by the share of that power that enters the work, and divided by the travel speed.

```figure
type: formula
title: Heat input of a robotic fillet weld
formula: heat input = efficiency × voltage × current ÷ travel speed
caption: This is an illustration for a gas metal arc fillet at 26 V and 240 A with a travel speed of 700 mm/min, taking a thermal efficiency of about 0.8 for the process. Welding standards set the efficiency factors and the method of calculation for procedure records.
- Arc power | 26 × 240 = 6,240 W
- Travel speed | 700 mm/min = 11.7 mm/s
- Efficiency | about 0.8
step: heat input = 0.8 × 6,240 ÷ 11.7 ≈ 427 J/mm
step: about 0.43 kJ/mm
step: at 600 mm/min the same arc gives about 0.50 kJ/mm, 17% more
```

Heat input matters for the steel's properties, especially toughness and hardness in the heat-affected zone, and for distortion, and welding procedures often set a range for it. With voltage and current held steady by the power source, travel speed is what moves the heat input up and down. The [BIZOMAT welding heat input calculator](/tools/welding-heat-input/) does the arithmetic for any set of parameters.

## Travel speed and weld size

At a given wire feed speed, the weld metal deposited per minute is fixed, as Chapter 2 showed. The weld metal per millimetre of joint is that rate divided by the travel speed. A fillet weld's cross-section grows with the square of its leg length, so its leg length varies with one over the square root of the travel speed. Travel 15% faster than intended and the weld's cross-section falls by 13% and its leg by about 7%; travel 15% slower and the cross-section rises by 18% and the leg by about 8%.

```figure
type: compare
title: Spread of a 5 mm fillet with manual and mechanised travel
cols: Typical travel variation | Leg length range | Heat input range
caption: This is an illustration for teaching, assuming the wire feed and voltage are held steady and only the travel speed varies. Real manual variation differs between welders, joints and positions.
- Hand-held, steady welder | about ±15% | about 4.7 to 5.4 mm | about ±15%
- Hand-held, awkward position or tired | about ±25% | about 4.5 to 5.8 mm | about ±25%
- *Mechanised or robotic | about ±2% | about 4.95 to 5.05 mm | about ±2%
```

The figures show why consistent travel gives consistent welds. A machine's travel varies by a couple of percent at most, so its weld size and heat input barely vary. A good welder's hand varies by much more, and in awkward positions or late in a shift more again.

## Why welders over-weld

A welder who knows the travel varies, and that an undersized weld is a defect while an oversized one usually is not, does the sensible thing: aims for a larger weld than specified, so that even the smallest part of it is big enough. Inspectors and supervisors often encourage it. The result is over-welding: welds that average well above their specified size, using more wire, more time and more heat than the design needs, and distorting the part more.

```figure
type: bars
title: Weld metal in a fillet by average leg length, relative to the specified 5 mm
unit: % of the weld metal in an exact 5 mm fillet
max: 200
caption: This is an illustration. Weld metal in a fillet grows with the square of its leg length; reinforcement and penetration are ignored here.
- Exact 5 mm | 100
- 5.3 mm average, a machine's margin | 112
- 5.6 mm average | 125
- *6.2 mm average, typical manual over-welding | 154
- 7 mm average | 196
```

A welder aiming for a 6.2 mm average so that the thinnest part of the weld never falls below 5 mm puts in about half as much weld metal again as the design needs. A machine, whose welds vary so little, can be set to a much smaller margin, say a 5.3 mm average, and still never produce an undersized weld. The difference is weld metal, arc time and heat that the machine does not spend.

## Pricing the over-welding

The arithmetic for a product line can be large. The running case's brackets are welded with about 600 mm of 5 mm fillet each, holding about 110 g of weld metal per metre at exactly 5 mm.

At 40,000 brackets a year, the exact welds would need about 40,000 × 0.6 × 0.110 ≈ 2,640 kg of weld metal. Welded by hand with typical over-welding to a 6.2 mm average, they need about 1.54 times that, about 4,070 kg. Welded by a robot to a 5.3 mm average, they need about 1.12 times, about 2,960 kg. The robot saves about 1,110 kg of weld metal a year, and at about 3 kg/h of deposition, about 370 hours of arc time. That saving comes on top of the arc-on time gain of Chapter 1, and it is frequently overlooked in automation business cases, which count the faster welding but not the smaller welds.

## Heat, distortion and the part

Over-welding also over-heats. A weld 54% larger than needed, laid at the same wire feed speed, has been made at about two-thirds of the intended travel speed, with about half as much heat input again. The extra heat distorts the part more, as Welding Distortion by the Numbers explains, which may mean straightening afterwards, and on steels sensitive to heat input it can harm the heat-affected zone's toughness. A machine welding at the intended speed puts in the intended heat, so distortion is smaller and, crucially, the same on every part, which makes it possible to compensate for it in the fixture.

## Speed limits

Faster is not always better, however tempting it is to push a machine. Above a certain travel speed, the weld pool cannot keep up: the weld becomes narrow and peaked, the toes undercut, and the root may not fuse, because the arc moves on before it has melted enough of the plates. The maximum good travel speed depends on the process, the current, the joint and the position; robots and carriages are often run near it, which is one reason their parameters must be trialled carefully. Pulsed and twin-wire processes and higher currents raise the limit, and are part of how automated welding reaches high speeds.

## Weaving

Manual welders often weave, moving the torch from side to side to widen the weld or fill a gap. Robots can weave too, with programmed patterns of width, frequency and dwell at each side, which help bridge gaps and fuse the sides of a wide joint. Weaving slows the effective travel along the joint and raises the heat input, so a woven weld is counted at its actual forward speed. On automated welds, a weave is used where it is needed for gap tolerance or fusion, not by habit.

## Measuring travel speed

Travel speed is easy to measure on a machine and surprisingly hard to measure for a manual welder. On mechanised and robotic equipment, the programmed speed is known, and the actual speed can be checked at any time by timing the torch over a known, marked length. For manual welding, the supervisor can time welds of known length with a stopwatch, or use weld monitoring that records the arc time per weld and so the average speed. When the running case's fabricator timed its welders on the bracket welds, the speeds varied from about 300 to 550 mm/min between welders, and by about 20% for the same welder between morning and late afternoon, which explained much of the variation in weld size its inspectors had been finding.

## Procedures with numbers

Because machines hold travel speed exactly, a procedure for an automated weld can specify it as a number with a narrow tolerance, together with the feed speed, voltage and stick-out, and the heat input then follows. The procedure qualification test made with those numbers is a much closer guide to production welds than a manual qualification, because production will repeat it closely. That is one of the quieter benefits of automation: the qualified procedure and the production weld are much more alike.

## Multi-pass welds

Larger welds are made in several passes, and automation changes how they are planned. A machine can lay each pass at exactly the intended size and position, so a multi-pass weld can be planned bead by bead, with the number of passes, their sequence and their placement in the joint all written into the program. That makes the weld metal and heat of each pass predictable, but it also means the interpass temperature must be watched, because a robot moving straight from one pass to the next can heat a joint far faster than a welder who stops to clean and inspect. Programs for multi-pass welds on heat-sensitive steels include pauses, or move to other joints between passes, so that the interpass temperature stays within the procedure. Some cells measure the part's temperature before each pass and wait when it is too hot.

## Position and speed

The position of the joint limits the travel speed that gives a good weld. Flat and horizontal fillets can be welded fast, because gravity helps hold the pool in place; vertical-up welds must be made slowly, with a weave, at a much lower deposition rate; overhead welds are slower still. Robots weld in whatever position the part presents, but they weld fastest when the part is turned so that every joint is flat or horizontal, which is why robot cells so often include positioners that turn the part during the program. Chapter 4 deals with positioners. For the running case's implement frames, turning each frame so that its welds were flat roughly doubled the travel speed the welders could use on many joints.

## Checking weld size

Over-welding persists partly because weld size is checked loosely. A welder told that a 5 mm fillet is required, and checked only now and then with a gauge, has every reason to make it bigger. Automation gives the chance to tighten the target, but only if weld size is measured and the measurements are used. The fabricator's inspectors gauge a sample of welds on each batch at marked points, record the results, and report the average and the range, not just whether any weld was undersized. With that record, the margin above the specified size can be set from evidence: large enough that no weld is undersized, small enough not to waste metal. Over time the record also shows whether a machine's welds are drifting, an early warning of a worn liner, a moved fixture or a changed wire.

## The running case: trial welds on the chassis rails

This is an illustration. The fabricator trialled a tractor carriage on the long fillet welds joining the flanges and webs of its trailer chassis rails, each about 6 m long. Manual welds on those rails, measured with a fillet gauge every 200 mm on a sample of rails, had legs from about 5.6 to 7.4 mm for a specified 6 mm, averaging about 6.6 mm. The carriage's welds measured 6.1 to 6.3 mm. The weld metal per rail fell by about 12%, the arc time by a similar share, and the rails bowed less and more consistently, so that the straightening that had followed most manual welds became occasional.

## A failure: the fast robot

This is an illustration. A fabricator elsewhere, keen to show its new robot's speed, programmed the bracket welds at a travel speed about 40% higher than the trials had used, with the feed speed raised to match. The welds looked neat and were the right size. A macro section from a routine audit showed that the root of the fillets was not fused on many welds: the arc had been moving too fast to melt the corner of the joint.

The welds had to be sampled back through two weeks of production and many brackets scrapped. The fabricator went back to the trialled speed, and now cuts a macro section from the first part of every new program and at intervals in production, as Chapter 8 describes.

## Exercise: over-welding on the implement frames

An implement frame has 18 m of 8 mm fillet welds. An exact 8 mm fillet holds about 250 g of weld metal per metre. Manual welds average about 9.5 mm. If positioners and a mechanised torch bring the average to about 8.4 mm, how much weld metal is saved per frame, and over 150 frames a year? At 4 kg/h of deposition, how much arc time is that?

The exact welds hold 18 × 0.25 = 4.5 kg per frame. At 9.5 mm, they hold about 4.5 × (9.5 ÷ 8)² ≈ 4.5 × 1.41 ≈ **6.35 kg**; at 8.4 mm, about 4.5 × (8.4 ÷ 8)² ≈ 4.5 × 1.10 ≈ **4.96 kg**. The saving is about **1.4 kg** per frame.

Over 150 frames, that is about **210 kg** of weld metal a year, and at 4 kg/h about **52 hours** of arc time, before the arc-on time gains of the positioners. The heat input falls in proportion, and the frames distort less.
