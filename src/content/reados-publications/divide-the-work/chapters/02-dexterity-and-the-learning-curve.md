---
book: divide-the-work
chapterSlug: dexterity-and-the-learning-curve
order: 2
title: "Dexterity: how repetition shortens the work, and how to measure it"
description: "Smith's first gain from dividing work, measured with a learning curve: how time falls with repetition, why one person's repetitions speed learning, and how to fit the curve from your data."
draft: false
---

The first gain Smith claimed for dividing work is the simplest to see in any workshop. A person who does one operation over and over gets quicker at it. Hands find the right grip, the eye learns where to look first, small decisions become habits, and mistakes that cost minutes stop happening. Smith illustrated it with nail making: a smith who had never made nails might manage a few hundred a day, and badly, while boys who had made nothing else could each make more than two thousand.

Engineers have a quantitative version of the same observation, the learning curve. This chapter uses it to estimate how much faster a dedicated welder would become on the new bench design, compares that with three generalists sharing the welding, and shows how to fit the curve from the business's own data rather than borrowing a rate from somewhere else.

## The learning curve

In 1936 the aircraft engineer T. P. Wright reported a regularity in aircraft production: each time the cumulative number of aircraft built doubled, the labour hours per aircraft fell to a roughly constant fraction of what they had been. If that fraction is 90%, the 2nd unit takes 90% of the 1st, the 4th takes 90% of the 2nd, the 8th takes 90% of the 4th, and so on. The fraction is called the learning rate.

```figure
type: formula
title: Wright's learning curve
formula: Tₙ = T₁ × n^b
formula: b = log₂(learning rate)
caption: Tₙ is the time for the nth unit, T₁ the time for the first, and b the learning exponent. A 90% learning rate gives b = log₂(0.90) = −0.152. Each doubling of cumulative units multiplies the unit time by 0.90.
- Tₙ | time for unit n
- T₁ | time for the first unit
- b | learning exponent, negative
```

The [learning curve tool](/tools/learning-curve/) in BIZOMAT Tools applies this relation. From the first-unit time, the learning rate and a number of units, it gives the time for the last unit, the cumulative time for all of them, the average time per unit and the labour cost of the batch at a stated rate. It assumes the learning rate stays constant, which real processes only approximate.

The curve's key feature is that learning depends on the **cumulative number of repetitions by the same learner**, not on the calendar. That is exactly why dividing work speeds learning: one person who welds every frame accumulates repetitions three times as fast as each of three people who share the welding.

## The welding station on the B-series bench

This is an illustration. The B-series leg frame is new to the business: box-section legs, cross-rails, a mitred perimeter frame and an undershelf bracket, all welded and dressed. The owner times the first B-series frame at about **5.4 hours** to fit up, weld and dress. The learning rate, fitted from the first sixteen frames as described in the failure case below, is about **90%**.

The learning curve tool gives the unit times along the way:

```figure
type: line
title: Weld time per frame for one welder doing every frame
x: Frames welded by this welder
y: Minutes per frame
ymin: 100
ymax: 340
legend: Unit time, 90% learning rate
caption: This is an illustration. Times from the learning curve tool with a first-unit time of 5.4 hours (324 minutes). Most of the reduction comes early; the curve flattens as each further halving of time needs a doubling of repetitions.
- 1 | 324
- 2 | 292
- 4 | 262
- 10 | 228
- 25 | 199
- 50 | 179
- 100 | 161
- 150 | 151
```

At the 50th frame the welder takes about **179 minutes**, which is close to the 180-minute planning figure the owner used for generalists who know the design. At the 150th frame, about ten weeks into full production, the time is about **151 minutes**.

## Concentrated repetitions against shared ones

Now compare the two arrangements over the first 150 frames.

- **One dedicated welder** welds all 150. The tool gives a cumulative time of **443.6 hours**, an average of 2.96 hours per frame, and a labour cost of A$27,506 at A$62 an hour.
- **Three generalists** each weld 50. Each reaches only the 50th repetition, at 179 minutes. The tool gives 173.6 hours each, **520.7 hours** in total, and a labour cost of A$32,283.

```figure
type: compare
title: The first 150 B-series frames, two ways of sharing the welding
cols: Repetitions per person | Time at the last frame | Total welding hours | Labour at A$62 an hour
caption: This is an illustration. Results from the learning curve tool, excluding GST. Concentrating the welding saves about 77 hours over the first 150 frames, and leaves the welder about 28 minutes a frame faster.
- Three generalists, 50 frames each | 50 | 179 min | 520.7 h | A$32,283
- *One welder, all 150 frames | 150 | 151 min | 443.6 h | A$27,506
```

Over the first 150 frames, concentrating the welding saves about **77 hours**, worth about **A$4,780** at the loaded labour rate. The welder also finishes about 28 minutes a frame faster than any of the generalists, and the gap persists: over a full year of 750 frames, the welder would reach about 118 minutes at the 750th frame, while each generalist doing 250 would reach about 140.

The saving is real and grows with volume, but it is not enormous, and it comes in a particular shape. Most of the reduction happens in the first few dozen units. That has two consequences. A dedicated welder is most valuable early in a new design's life, when the learning is steepest. And the benefit is lost each time the learning is lost, which is the subject of the failure case below.

## Learning at the other stations

The welding station gets most of the attention because the B-series frame is new and the learning is steep. The other stations learn too, but less, for a simple reason: the generalists already cut, folded and polished similar parts every day, so they were already well down those curves. A fabricator who has folded a few thousand bench tops does not get much quicker by folding a few hundred more.

That is why Chapter 1's estimate shows only a few minutes' gain at the cutting and folding station. It is also a useful general rule. **Dividing work speeds learning most on operations that are new, complex or rarely repeated under the old arrangement.** On familiar, simple operations, a generalist is often nearly as fast as a specialist. Before reorganising, it is worth asking which operations are still on the steep part of their curves, because that is where the dexterity gain lies.

## Paying for the learning

The early frames cost more than the later ones, and someone pays for the difference. Over the first 150 frames, the average weld time is 2.96 hours, but by the 150th frame the unit time is 2.52 hours. A price set on the steady-state time loses money during the ramp; a price set on the early times is uncompetitive later.

The owner handles this in the distributor contract in two ways. The ramp plan from Chapter 1 limits volume while the times are high, so the overtime and contract welding needed during learning are smaller. And the unit price is set from the expected average over the first year rather than the first-unit time or the long-run time, with the learning cost recorded as part of the cost of taking on the contract. Learning is an investment the business makes in the first months and recovers later, and it should be planned and costed like one.

## Where dexterity comes from in welding

The learning curve is a summary; it does not say what is being learned. Asking the welder what has changed between the 1st and the 50th frame gives a list that is useful in its own right, because some of it can be written down and taught.

- **Fit-up order.** Which joints to tack first so the frame stays square without being pulled back.
- **Weld sequence.** Which side to weld first to balance distortion, so less straightening is needed afterwards.
- **Settings.** The current and travel speed that give a clean bead on this wall thickness, set once and left alone.
- **Dressing.** How much grinding each joint actually needs, rather than dressing everything to the same standard.
- **Handling.** Where to stand, how to rotate the frame, where to put the tacked frame while the next one is cut.

Some of these are skills in the hands and cannot be transferred quickly. Others are knowledge that can be written into a short method sheet. The method sheet does two things: it protects the business if the welder leaves, and it gives a second person a head start, so their own curve begins lower than the first welder's did. Chapter 9 returns to this in the context of cover and cross-training.

### Learning belongs to people, not stations

A station does not learn; the person at it does. When the welder leaves, the station returns to the top of the curve with the next person, minus whatever the method sheet and the fixture preserve. That makes a dedicated specialist both an asset and a concentration of risk. The business gains the steep early learning by putting all the repetitions in one pair of hands, and it loses that learning all at once if those hands move on. The gain and the exposure come together, which is why the later chapters on balance, cover and buying in matter as much as this one.

## The failure case: a borrowed learning rate

When the owner first prepared the contract estimate, he used a learning rate of **80%**, taken from a general article on learning curves in manufacturing. At 80%, the tool gives a 50th-frame time of about 92 minutes and a 150th-frame time of about **65 minutes**, less than half the figure at 90%. The estimate for the welding station looked comfortable, and it encouraged the commitment to fifteen benches a week from the first week described in Chapter 1.

The rate was wrong for this work. Learning rates vary widely with the kind of task. Long assembly sequences with many decisions can show steep learning, while work that is mostly machine-paced or limited by physical process time, such as weld deposition, shows much less. A rate taken from aircraft assembly, or from a general article, says little about welding box-section frames.

### How it is detected

The owner detects the problem by recording the actual weld time of each frame from the welder's job card and plotting it against the frame number on logarithmic scales, where a learning curve becomes a straight line. After 16 frames the times are:

- frame 1: 330 minutes;
- frame 2: 288 minutes;
- frame 4: 268 minutes;
- frame 8: 232 minutes;
- frame 16: 214 minutes.

A straight-line fit through those points on log-log scales gives a slope of about −0.156, a learning rate of about **89.7%**, and a fitted first-unit time of about 327 minutes. The 80% assumption is clearly wrong; 90% fits the data well.

### How it is corrected

The estimate is redone with the fitted rate, and the ramp plan from Chapter 1 is set using the 90% curve. The owner also changes his rule: **learning rates come from the business's own data**, from a pilot run if necessary, and are updated as the data arrive. A borrowed rate can be used for a first rough estimate, labelled as such, and replaced as soon as a dozen units have been timed.

## Forgetting

The learning curve has a quiet assumption: the repetitions are continuous. When a learner stops for a while, some of the learning is lost, and the time per unit rises again when they return. The welder's three-week holiday in the fourth month shows this. On return, the first frames take noticeably longer than before the break, and it takes a dozen or so frames to get back to the previous pace.

Forgetting matters for two decisions. First, it affects whether to rotate people between stations: frequent rotation spreads skill but slows each person's learning. A common compromise is to keep one primary person at each station and give a second person regular, planned time there, enough to stay competent without losing the primary person's pace. Second, it affects how much to expect from a temporary cover arrangement: a contract welder starting cold will work near the top of the curve, not at the station's current pace.

```figure
type: checklist
title: Using a learning curve in a staffing decision
caption: This is an illustration. The owner's checklist after the borrowed-rate error. The open item is the forgetting effect, which the business had not yet measured.
- x First-unit time measured on the actual design
- x Learning rate fitted from the business's own unit times
- x Repetitions counted per person, not per station
- x Curve used for planning only within the range of data plus a modest extrapolation
- x Method sheet written so a second person starts lower on the curve
- ? Loss of pace after breaks measured and allowed for in cover plans
```

## What the learning curve does not show

Three limits deserve stating plainly. The curve describes average behaviour; individual frames vary, sometimes widely. It says nothing about quality, which can improve or decline with speed. And a constant learning rate cannot continue forever: at some point the process time of welding itself sets a floor, and further repetitions do little. For the B-series frame, the welder's estimate is that the weld deposition time is around 70 minutes; the remainder is fit-up, handling and dressing, which is where most of the learning happens and where the fixture in Chapter 4 helps.

## Exercise: a second design

A year later, the distributor asks for a narrower C-series bench with a similar leg frame. The welder's first C-series frame takes **4.2 hours**. Assume a 90% learning rate, as fitted for the B-series. Using the learning curve tool's relation, estimate the time for the 50th C-series frame, and say what the comparison with the B-series suggests about how to plan the C-series ramp.

**Worked answer.** With T₁ = 4.2 hours and b = −0.152, the 50th frame takes 4.2 × 50^(−0.152) hours. 50^(−0.152) is about 0.552, so the 50th frame takes about **2.32 hours**, about 139 minutes.

The C-series starts lower than the B-series did, at 4.2 hours rather than 5.4, because much of what the welder learned on the B-series transfers: fit-up order, weld settings, handling. That is the learning curve's practical lesson for planning: a new design for an experienced specialist begins partway down a related curve, not at the top of a new one. The ramp plan for the C-series can be shorter and steeper than the B-series ramp. But the rate itself should still be checked against the first dozen C-series frames, rather than assumed, because the narrower frame may change which parts of the job dominate.
