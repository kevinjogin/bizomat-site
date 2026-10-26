---
book: blanking-and-piercing-dies-by-the-numbers
chapterSlug: die-types-and-the-centre-of-load
order: 7
title: "Die types and the centre of load"
description: "Single, compound, progressive and transfer dies compared for MP-40, what the burr requirement does to the choice, finding the progressive die's centre of load, and a die set off centre."
draft: false
---

The same part can be made by several kinds of die, and the choice decides the tool's cost, the press time per part, the part's accuracy and where its burrs fall. For MP-40 the choice was made early, a progressive die, and Chapter 1 showed how a late drawing requirement reopened it. This chapter makes the comparison properly, with the burr requirement included, and then deals with a calculation every multi-station die needs: where the die's load acts, and where the die must sit in the press so that the load is central.

It compares the four main die types for MP-40, costs the compound and progressive options at the quote stage and after the die was built, finds the progressive die's centre of load, and ends with a die mounted on the press's centreline that wore its guides on one side.

## Four kinds of die

**Single-operation dies** do one thing per stroke. MP-40 could be made with two: a piercing die and a blanking die, with the blanks or strips moved by hand or by a simple feeder from one to the other. The tools are cheap, but each part is handled twice and the holes' position relative to the outline depends on how well the second die locates the part.

**Compound dies** cut the outline and the holes in one stroke at one station. The die is built upside down compared with a simple blanking die: the blanking die opening is in the upper die and the blanking punch below, with the piercing punches in the upper die passing through it and their die openings in the blanking punch. Because everything is cut at once, from one set of edges, the holes are very accurately placed relative to the outline, the part comes out flat, and all its burrs are on the same face. The blank is pushed up into the upper die and must be knocked out and removed from between the dies, usually by a knockout bar and an air blast, which limits the stroke rate.

**Progressive dies** cut the part in stages as the strip moves through several stations, as MP-40's die does. They run fast, since the part is carried by the strip and falls away at the end, and they can include forming stations. The holes' position relative to the outline depends on the pilots and the feed, and the burrs of features cut from opposite sides end up on opposite faces.

Ejecting the blank is the compound die's weak point. The knockout must push the blank down out of the upper die at the right moment on the upstroke, and the blank must then leave the tool area before the next stroke, usually blown out by an air jet or dropped onto an inclined press so that it slides away. A blank that stays in the die is struck again on the next stroke, which can break the die. Compound dies are therefore run with sensors that confirm each blank has left before the press is allowed to make another stroke, and they are slower than progressive dies for that reason, not for any limit of the cutting itself.

**Transfer dies** move separate blanks from station to station with mechanical fingers. They suit large parts that cannot be carried on a strip and are rarely worth it for a part MP-40's size.

```figure
type: compare
title: Die types for MP-40
rowhead: Die type
cols: Stations | Hole to outline accuracy | Burr faces | Speed | Tool cost
caption: General characteristics for a small flat part. The best choice depends on volume, accuracy and what the drawing says about burrs.
- Two single-operation dies | 2, separate | depends on the second die's locating | opposite | slow, two handlings | lowest
- Compound die | 1 | best, cut from one set of edges | same face | moderate, part ejected each stroke | moderate
- * Progressive die | 3 | good, set by pilots and feed | opposite | fast, strip-fed | higher
- Transfer die | several | good | depends on layout | moderate to fast | highest
```

## Costing the choice at the quote stage

This is an illustration. When the die was quoted, the toolmaker priced a progressive die at **A$38,000** and a compound die at **A$29,000**, excluding GST. The press shop's rate is A$110 an hour, and it runs dies at 75% efficiency once set up. The progressive die can run at 120 strokes a minute; the compound die, limited by ejecting the blank, at 60.

- Press hours a year, progressive: 60,000 ÷ (120 × 60 × 0.75) = **11.1 hours**, costing A$1,222.
- Press hours a year, compound: 60,000 ÷ (60 × 60 × 0.75) = **22.2 hours**, costing A$2,444.

On those figures alone, the progressive die costs A$9,000 more and saves A$1,222 a year in press time, so it pays back its extra cost in about seven years. That was the comparison the shop made, and the progressive die won on speed.

The burr requirement changes it. Once the drawing calls for a mating face free of raised burr (Chapter 1), the progressive die's plates need deburring, at an illustrative **A$0.030 per plate**, or **A$1,800 a year**. The compound die puts every burr on the face away from the paint and needs no deburring. Now:

- the compound die is A$9,000 cheaper to buy;
- it costs A$2,444 − A$1,222 = A$1,222 a year more in press time;
- it saves A$1,800 a year in deburring;
- net, it is about **A$578 a year cheaper** to run, as well as cheaper to buy.

Had the burr requirement been on the drawing at the quote stage, the compound die would have been the better choice on every count except speed, and MP-40's 60,000 plates a year do not need the speed.

## After the die is built

The same figures read differently once the progressive die exists. Switching to a compound die now means spending A$29,000 on a new die to save A$578 a year, a payback of about **50 years**. The shop keeps the progressive die and the deburring step.

That asymmetry is the general lesson. A requirement discovered after the tool is built is paid for every year the part is made, because the cheap fix at the quote stage has become an expensive one. The die-type decision should be made with the finished drawing, including burrs, flatness and the accuracy of features to each other, and with the secondary operations each die type implies costed alongside the tool.

```figure
type: decision
title: Choosing between a compound and a progressive die for a flat part
question: What does the part need most?
caption: A simplification for flat blanked and pierced parts. Forming stations, very high volumes and large parts change the answer.
- *Holes accurately placed to the outline, all burrs on one face, flat | moderate volume | compound die
- Highest output per hour, burr faces unimportant or deburring acceptable | high volume | progressive die
- Lowest tool cost, low volume, handling acceptable | prototypes and short runs | single-operation dies or laser cutting
```

## Why the centre of load matters

In a progressive die, the stations cut at different places along the strip, and their forces are not equal. The combined force acts at a point, the **centre of load** or centre of pressure, that is generally not at the die's middle. If the press's ram pushes through a different point, the die is loaded off centre. The ram tilts, the guide pillars and bushes and the press's own gibs take a side load, the clearance closes on one side of the punches and opens on the other, and the edges wear unevenly.

The fix is simple: find the centre of load, and set the die in the press so that it lies on the ram's centreline. Many die sets have the press's location, a shank or a centre mark, placed there for that reason.

## Finding MP-40's centre of load

The cutting force on each feature acts at the centre of its cut line, which for symmetrical outlines is at the feature's centre. The force is proportional to the cut length, since thickness and shear strength are the same everywhere, so the centre of load can be found from lengths alone:

x_c = Σ (L_i × x_i) ÷ Σ L_i

Taking station 1, the piercing station, as x = 0 along the feed, with the strip's centreline as y = 0:

- **Station 1**: holes and slot, 94.54 mm of cut, centred at x = 0. The two holes, at y = +30 and y = −30, balance each other across the strip, and the slot is on the centreline.
- **Station 2**: pilots only, no cut.
- **Station 3**: outline, 249.70 mm of cut, centred at x = 2 × 52 = 104 mm, y = 0.

So:

x_c = (94.54 × 0 + 249.70 × 104) ÷ 344.24 = **75.44 mm** from station 1.

Across the strip, every feature is balanced about the centreline, so y_c = 0. The die's three stations span x = 0 to x = 104, and its geometric middle is at the pilot station, x = 52. The centre of load is **23.44 mm** downstream of it, towards the blanking station, because the outline does most of the cutting.

```figure
type: formula
title: Centre of load of the MP-40 die along the feed
formula: x_c = Σ (L_i × x_i) ÷ Σ L_i
caption: This is an illustration. Force is proportional to cut length here because every feature is cut in the same sheet. The stripper springs are spread symmetrically about the die's middle and do not move the centre.
- Station 1 | holes and slot, 94.54 mm of cut at x = 0
- Station 3 | outline, 249.70 mm of cut at x = 104 mm
step: x_c = (94.54 × 0 + 249.70 × 104) ÷ 344.24
step: x_c = 75.44 mm from station 1; 23.44 mm past the die's middle
step: Moment if centred at the middle: 192.8 kN × 23.44 mm = 4.52 kN·m
```

## What off-centre costs

If the die were set with its middle, x = 52, on the ram's centreline, the cutting force of 192.8 kN would act 23.44 mm away from the ram's axis, a tilting moment of 192.8 × 0.02344 = **4.52 kN·m** every stroke. That moment is taken by the press's gibs and the die set's guide pillars, which are designed to keep alignment, not to carry continuous side loads. On a press with generous gibs and a stiff ram it may do little harm; on a light press, or with a die whose clearance is only 0.15 mm, it opens the clearance on one side and closes it on the other.

The stripper springs do not change the answer, because they are spread symmetrically about the die's middle and their 28.5 kN acts there. If anything, they slightly reduce the offset of the total load at the bottom of the stroke: (192.8 × 75.44 + 28.5 × 52) ÷ 221.3 = 72.42 mm from station 1, 20.42 mm past the middle. The cutting force alone is the more cautious figure, since the springs' load is spread across the stripper and the cutting load is concentrated at the edges.

Stepping the piercing punches (Chapter 2) changes the centre of load at each instant: while the outline cuts alone, the load is at station 3, and while the piercing punches cut alone, it is at station 1. A stepped die swings its load from one end to the other within each stroke, which is a reason not to step punches in a die that is already long and lightly guided.

## Setting the die on centre

The die's tool drawing marks the centre of load, and the die shoes carry a scribed line or a locating feature there. When the die is set, that line is placed on the ram's centreline, which is marked on the press's bolster and ram. For MP-40, that means the die is set 23.44 mm upstream of where its middle would put it, towards the feed side; the strip line and the feeder are aligned to suit.

Where a die cannot be moved, because its size or the bolster's T-slots prevent it, the toolmaker can rearrange the stations, adding an idle station or moving a heavy cut, so that the centre of load comes closer to the die's middle. That is easiest at the design stage, which is another reason to calculate the centre before the die is built.

```figure
type: svg
title: MP-40's die stations and its centre of load
alt: A horizontal line representing the die along the feed direction, with three stations marked at 0, 52 and 104 millimetres. Station 1 is labelled pierce, 94.54 millimetres of cut; station 2 pilot, no cut; station 3 blank, 249.70 millimetres of cut. A dashed vertical line at 52 marks the die's middle and a solid accent line at 75.44 marks the centre of load, with the 23.44 millimetre offset between them labelled.
caption: This is an illustration, to scale along the feed. The centre of load sits 23.44 mm past the die's middle, towards the blanking station, which does most of the cutting.
viewbox: 0 0 640 260
body:
<path class="ln" d="M60 150H580"/>
<path class="bx" d="M60 120H120V180H60Z"/>
<path class="bx" d="M290 120H350V180H290Z"/>
<path class="bxa" d="M520 120H580V180H520Z"/>
<text class="txb" x="40" y="105">station 1, x = 0</text>
<text class="tx txs" x="40" y="205">pierce, 94.54 mm</text>
<text class="txb" x="262" y="105">station 2, x = 52</text>
<text class="tx txs" x="270" y="205">pilot, no cut</text>
<text class="txb" x="480" y="105">station 3, x = 104</text>
<text class="tx txs" x="480" y="205">blank, 249.70 mm</text>
<path class="ln dsh" d="M320 40V230"/>
<text class="tx txs" x="250" y="36">die's middle</text>
<path class="la draw" pathLength="1" d="M427 40V230"/>
<text class="txa" x="400" y="30">centre of load, x = 75.44</text>
<text class="tx txs" x="336" y="245">offset 23.44 mm</text>
```

## The error: the die set on its middle

This is an illustration. MP-40's tool drawing showed the centre of load, but the die shoes were not marked. The setter, used to single-station dies, clamped the die with its middle on the ram's centreline. The die ran for about 40,000 strokes before the press shop's weekly burr check found that the plates' burr was uneven around the outline: barely measurable on the feed side, 0.08 mm on the blanking side, against 0.03 mm all round when the die was new.

The toolmaker found the die set's guide bushes worn oval on the blanking side and the outline's clearance closed from 0.15 to about 0.08 mm on that side and opened to about 0.22 mm on the other. The load had been 23.44 mm off the ram's axis for every one of those 40,000 strokes.

The die set's bushes were replaced and the die's edges reground, at an illustrative A$1,350 excluding GST. A centre-of-load line was scribed on both die shoes and stamped "CL", the die-setting sheet was revised to say where the line goes, and the press shop added a step to its setting procedure: check the die's centre-of-load mark against the ram's centreline before clamping.

```figure
type: checklist
title: Die type and centre of load checks
caption: The die type is decided once; the centre of load is checked every time the die is set.
- Die type chosen with the finished drawing, including burr faces | compound would have avoided deburring
- Secondary operations costed with each die type | deburring A$1,800 a year
- Centre of load calculated from each station's cut length | 75.44 mm from station 1
- Centre of load marked on the die shoes and the setting sheet | scribed and stamped CL
- Die set with the mark on the ram's centreline | 23.44 mm from the die's middle
- x Die set on its middle | guide bushes worn oval in 40,000 strokes
```

## Exercise: adding the Ø3 hole

Chapter 4's revision added a Ø3.0 mm hole to MP-40, pierced at station 1, centred 6 mm in from one long edge of the plate and midway between the two Ø8.5 holes. In Layout A the plate's long edges run across the strip, 25 mm either side of station 1's centre, so the new hole sits on the strip's centreline at x = −19 mm, upstream of the station's centre. Find the new centre of load along the feed.

**Worked answer.** The Ø3.0 hole adds π × 3.0 = 9.42 mm of cut at x = −19 mm.

- Total cut: 344.24 + 9.42 = 353.66 mm.
- Moment of the lengths: 94.54 × 0 + 249.70 × 104 + 9.42 × (−19) = 25,968.8 − 179.0 = 25,789.8 mm².
- x_c = 25,789.8 ÷ 353.66 = **72.92 mm** from station 1.

The small hole moves the centre of load 2.52 mm back towards the die's middle, partly because it adds cut length at station 1 and partly because it sits upstream of station 1's centre. The die's mark would be moved to suit, and checked when the die was next set.
