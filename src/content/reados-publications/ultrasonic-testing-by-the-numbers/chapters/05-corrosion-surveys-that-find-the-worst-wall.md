---
book: ultrasonic-testing-by-the-numbers
chapterSlug: corrosion-surveys-that-find-the-worst-wall
order: 5
title: "Corrosion surveys that find the worst wall"
description: "Condition monitoring locations, spot readings and scanned bands, general and local wall loss, comparing surveys, corrosion coupons, and how to design a survey that finds the thinnest metal."
draft: false
---

A corrosion survey is not a search for the average wall thickness. It is a search for the thinnest metal, because that is where a pipe or vessel will leak or fail first. A well-calibrated gauge, used at the wrong places, will report a healthy average for a line that is about to fail at an elbow. The design of the survey, where to measure, how many readings to take and how to make sure the same spot is measured next time, decides whether the numbers in Chapter 6's remaining-life calculation mean anything.

This chapter sets out how the mill's juice line survey is designed, works through its two most recent surveys, separates general wall loss from local wall loss, compares the ultrasonic rates with corrosion coupons, and finishes with a lost marker that hid the wear on an elbow.

## Where metal is lost

Wall loss in a process line has two broad forms. General corrosion removes metal fairly evenly over large areas, at a rate set by the fluid's chemistry, temperature and oxygen content. Local wall loss concentrates at particular places: at elbows, tees and reducers where the flow turns and accelerates, at the bottom of a line where solids settle, at weld roots, under deposits and at places where the flow is disturbed, such as downstream of control valves. In a sugar mill's mixed juice line, carrying hot, slightly acidic juice with suspended soil and fine sand from the cane, the dominant local mechanism is erosion–corrosion at fittings, where the moving solids strip the protective film that would otherwise slow the corrosion.

The mechanisms tell the survey designer where to look. A survey that spaces its readings evenly along a pipe will mostly measure general corrosion on the straights. A survey that concentrates readings at fittings, flow disturbances and low points will find the worst wall.

## Condition monitoring locations

A condition monitoring location, or CML, is a defined place on the equipment where thickness is measured at every survey, so that readings can be compared over time. Each CML has a fixed position, marked on the pipe and on an isometric drawing, and a defined extent: a single point, a set of points around the circumference, or a band to be scanned.

```figure
type: decision
title: What each kind of CML is for
caption: This is an illustration of the mill's practice. AS/NZS 3788 and the owner's inspection body set the requirements for real pressure equipment.
- Single point, marked | General corrosion on straight runs | Cheap, repeatable; can miss local loss even a few centimetres away
- Four points at 12, 3, 6 and 9 o'clock | Straights where the bottom or top may differ | Shows stratified corrosion and settling of solids
- Scanned band on a fitting's extrados | Elbows, tees and reducers with erosion–corrosion | Finds the worst spot each time, wherever it has moved
- Grid over an area | Vessel shells and large areas | Maps general and local loss; Chapter 6 uses V-12's grid
- Continuous scan with recorded C-scan | Areas where local loss is known or suspected | Highest cost; gives a map of the whole area
```

The juice line has twelve CMLs, now thirteen with the new reducer from Chapter 3. Eight are on straight pipe, measured at four points around the circumference, and four are at fittings, three elbows and a tee, where the technician scans a band 50 mm wide along the extrados, the outside of the bend where the flow and its solids strike hardest. Each reading recorded is the minimum of the three taken at the spot, probe lifted between them, as Chapter 4 described.

## Scanning a fitting

The extrados of a DN150 long-radius elbow is about 490 mm long along its curve. Scanning a 50 mm band means moving the dual-element probe along five parallel lines 10 mm apart, roughly the probe's footprint, watching the gauge's minimum-hold display and noting the lowest reading and its position. At 10 mm steps that is about 49 positions per line and 245 per band. With a gauge in scanning mode, the technician moves the probe continuously and the gauge holds the minimum, so a band takes about five minutes.

The spacing matters because of the beam. A dual-element probe responds to the thinnest metal within its focal spot, a few millimetres across, so lines further apart than the footprint leave unscanned strips in which a pit can sit unseen. Scanning at the footprint's spacing gives practical coverage of the band; scanning wider gives a quicker but incomplete picture.

```figure
type: svg
title: The scanned band on an elbow's extrados
alt: A plan view of a ninety-degree elbow drawn as a curved pipe. A shaded band follows the outer curve, the extrados. Five dotted scan lines run along the band, ten millimetres apart. A small marked spot near the middle of the band shows the thinnest reading, and a label gives the band as 50 mm wide and about 490 mm long.
caption: This is an illustration. Five scan lines 10 mm apart cover a 50 mm band; the gauge's minimum-hold display records the lowest reading and the technician notes its position from the elbow's weld.
viewbox: 0 0 640 330
body:
<path class="ln" d="M80 300 L80 200 A140 140 0 0 1 220 60 L320 60"/>
<path class="ln" d="M170 300 L170 200 A50 50 0 0 1 220 150 L320 150"/>
<path class="bxa" d="M80 200 A140 140 0 0 1 220 60 L220 82 A118 118 0 0 0 102 200 Z"/>
<path class="flow la" d="M84 200 A136 136 0 0 1 220 64"/>
<path class="dsh lf" d="M90 200 A130 130 0 0 1 220 70"/>
<path class="dsh lf" d="M95 200 A125 125 0 0 1 220 75"/>
<path class="dsh lf" d="M100 200 A120 120 0 0 1 220 80"/>
<circle class="fa pulse" cx="113" cy="118" r="6"/>
<text class="txa" x="128" y="128">thinnest: 5.45 mm</text>
<text class="tx txs" x="340" y="70">band 50 mm wide</text>
<text class="tx txs" x="340" y="92">along the extrados, about 490 mm</text>
<text class="tx txs" x="340" y="114">5 lines, 10 mm apart</text>
<text class="tx txs" x="182" y="240">flow</text>
<path class="li" d="M125 290 L125 220"/>
<path class="ah" d="M119 228 L125 216 L131 228 Z"/>
```

## Two surveys of the juice line

The line was installed in 2007 with 7.11 mm nominal wall. Its last two surveys, five slack seasons apart, give the readings in the table. Each figure is the lowest reading at the CML.

```figure
type: compare
title: Juice line JL-4: lowest readings at each CML, 2021 and 2026
cols: 2021 | 2026 | Loss | Rate over 5 years
rowhead: CML
- 1 Pump discharge, straight | 6.98 mm | 6.86 mm | 0.12 mm | 0.024 mm/y
- 2 Straight | 7.02 mm | 6.93 mm | 0.09 mm | 0.018 mm/y
- 3 Elbow 1, scanned band | 6.75 mm | 6.41 mm | 0.34 mm | 0.068 mm/y
- 4 Straight after elbow 1 | 6.94 mm | 6.80 mm | 0.14 mm | 0.028 mm/y
- 5 Tee, branch side, scanned band | 6.70 mm | 6.38 mm | 0.32 mm | 0.064 mm/y
- 6 Straight, bottom | 6.88 mm | 6.69 mm | 0.19 mm | 0.038 mm/y
- * 7 Elbow 2, scanned band | 6.20 mm | 5.45 mm | 0.75 mm | 0.150 mm/y
- 8 Straight after elbow 2 | 6.81 mm | 6.55 mm | 0.26 mm | 0.052 mm/y
- 9 Pipe bridge, bottom | 6.92 mm | 6.78 mm | 0.14 mm | 0.028 mm/y
- 10 Straight, top | 7.05 mm | 6.99 mm | 0.06 mm | 0.012 mm/y
- 11 Elbow 3, scanned band | 6.62 mm | 6.21 mm | 0.41 mm | 0.082 mm/y
- 12 Heater inlet nozzle | 6.85 mm | 6.70 mm | 0.15 mm | 0.030 mm/y
caption: This is an illustration. CML 13, the new reducer, has its first baseline this season. Rates are the loss divided by the five years between surveys.
```

The pattern is the one the mechanisms predict. The eight straight-pipe CMLs lost metal at 0.012 to 0.052 mm a year, an average of 0.029 mm a year. The four fittings lost it at 0.064 to 0.150 mm a year, an average of 0.091 mm a year, about three times faster. Elbow 2, the first bend downstream of the flow control valve and the reducer that failed, is the worst by a wide margin, at 0.150 mm a year.

### Short-term and long-term rates

Two rates can be calculated at each CML. The short-term rate uses the last two surveys: 0.150 mm a year at CML 7. The long-term rate uses the original thickness and the present one. With no baseline survey from 2007, the nominal 7.11 mm stands in for the original, giving (7.11 − 5.45) ÷ 19 = 0.087 mm a year. The short-term rate is higher, which means the wear at elbow 2 has accelerated, consistent with the mill's record of sandier cane in recent seasons and with the reducer's failure upstream. Using the higher of the two rates for remaining life is the cautious choice, and Chapter 6 does so.

A long-term rate based on nominal thickness has a hidden weakness: new pipe is rarely exactly nominal. If the elbow had been made 0.3 mm over nominal, the true long-term rate would be higher than calculated; if under, lower. That is one reason every new item, like the replacement reducer, gets a baseline survey before it enters service.

```figure
type: bars
title: Wall loss rate by kind of location, 2021 to 2026
unit: mm/y
max: 0.16
caption: This is an illustration. Averages from the table; the worst single location is shown separately because remaining life is governed by it, not by an average.
- Straight runs, average of 8 | 0.029
- Fittings, average of 4 | 0.091
- * Elbow 2, worst location | 0.150
```

## The mistake: an elbow that seemed to stop wearing

CML 11, on elbow 3, had always been a single marked point on its extrados until this season, when the mill changed fittings to scanned bands. During the 2026 survey the technician first measured the old point, because its paint marker was the only one visible after a lagging repair, and recorded 6.52 mm. Against 6.62 mm in 2021, that gave a rate of 0.020 mm a year, the lowest of any fitting and lower than most straights.

The reliability engineer queried it at the survey review. An elbow wearing more slowly than the straight pipe either side of it was implausible, given that the same juice and sand pass through all of them. The technician went back, scanned the 50 mm band along the extrados as the new procedure required, and found a minimum of 6.21 mm about 60 mm from where the old marker had been.

```figure
type: steps
title: Recovering the real wear on elbow 3
caption: This is an illustration. The 2021 reading of 6.62 mm was itself a single point and may not have been the minimum at the time, so the scanned rate of 0.082 mm/y is, if anything, an underestimate.
- Old marked point, 2026 | 6.52 mm: apparent rate (6.62 − 6.52) ÷ 5 = 0.020 mm/y
- Review query | an elbow wearing slower than the straights either side is implausible
- * Scanned 50 mm band along the extrados | minimum 6.21 mm, about 60 mm from the old point
- Rate from the scanned minimum | (6.62 − 6.21) ÷ 5 = 0.082 mm/y, consistent with the other fittings
- Action | positions of minima now recorded as distances from the elbow's upstream weld; markers stencilled on the lagging cover as well as the pipe
```

The single point had missed the wear because erosion on an elbow's extrados does not sit at a fixed spot. It concentrates where the solids strike, which can move with flow rate and with the profile the wear itself creates. Recording the position of each minimum, as a distance along the extrados from the upstream weld and a clock position, lets the next survey start where the last minimum was while still scanning the whole band. The engineer also noted that the 2021 figure was a single-point reading and might not have been the minimum then either, so the rate of 0.082 mm a year may understate the true wear.

## Corrosion coupons

A corrosion coupon is a small, weighed piece of steel exposed in the line for a known time and then cleaned and weighed again. Its mass loss gives the average corrosion rate at the coupon's location over the exposure, and because coupons respond within weeks rather than years, they are the right tool for judging a change in the process, such as the inhibitor of Chapter 4.

The [corrosion rate tool](/tools/corrosion-rate/) applies the standard mass-loss method. Before the inhibitor, a 20 cm² coupon in a straight section near CML 6 lost 40 mg in 720 hours; with a steel density of 7.86 g/cm³ that is 0.031 mm a year. After eight weeks of inhibitor dosing, a fresh coupon lost 24 mg over another 720 hours, 0.019 mm a year. The tool also gives the remaining life of an allowance: entering CML 1's 3.86 mm above the structural minimum gives 125 years at the first rate, a reminder that general corrosion on the straights is not what limits this line.

```figure
type: compare
title: What coupons and ultrasonic readings each measure
cols: Coupon | Ultrasonic survey
rowhead: Question
- Rate at a place where flow erodes the wall | not representative: coupons sit in the flow, not on the extrados | yes, at scanned fittings
- General corrosion rate | yes, within weeks | yes, but only over years
- Effect of a process change | yes, compare coupons before and after | only after several surveys
- Remaining wall in the line | no | yes
- Pitting | shows on the coupon's surface if it occurs | only where the probe passes over it
caption: This is an illustration. The coupon rate of 0.031 mm/y before the inhibitor agrees with the straight-run ultrasonic average of 0.029 mm/y; neither measures erosion at the elbows.
```

The coupon rate before the inhibitor, 0.031 mm a year, agrees well with the ultrasonic average on the straights, 0.029 mm a year, which gives confidence in both. The inhibitor appears to have cut the general rate by about 40%. It is unlikely to have cut erosion at the elbows by as much, because erosion removes the protective film the inhibitor helps to form; the next survey's elbow rates will show whether it has.

## Checking the data before it is used

Survey data has its own failure modes, and a few simple checks catch most of them before a remaining-life calculation is built on a bad number.

**Negative rates.** A reading thicker than the previous one at the same CML is a warning, not good news. Walls do not grow. A gain smaller than about 0.05 mm, the combined uncertainty of two readings from Chapter 4, is noise and is recorded as no measurable loss. A larger gain points to a wrong velocity (Chapter 1), a coating measured in the wrong mode (Chapter 2), a hot wall left uncorrected (Chapter 4) or a reading at a different spot, as at elbow 3.

**Rates out of family.** A fitting wearing more slowly than the straights beside it, or one straight wearing three times faster than the others, deserves a second look before it is accepted. The rate may be real, from a local flow disturbance or a deposit, but it should be confirmed by scanning around the CML.

**Readings below the calibration range.** Any reading below the thinnest step used in calibration is re-taken after calibrating on a thinner step and confirmed on the A-scan, because of the V-path error and the doubling error of Chapters 3 and 4.

**Missing CMLs.** A CML that could not be reached, for lagging, access or process reasons, is recorded as missed with the reason, not silently dropped. A line whose worst location has not been measured does not have a current remaining life.

The mill's survey sheet carries the gauge, probe, calibration steps and check readings, the mode used on coated items, the surface temperature where it was not ambient, and, for each CML, the three readings, the minimum, the position of the minimum on scanned bands and any remark. Every one of those fields exists because a reading somewhere was once wrong without it.

## Designing a survey that finds the worst wall

The juice line's experience gives a set of rules for any line in similar service.

```figure
type: checklist
title: A survey design for a line with erosion–corrosion
caption: The open item is this chapter's mistake. A single marked point on a fitting measures one spot, not the fitting.
- x Mechanisms identified | general corrosion on straights, erosion–corrosion at fittings and downstream of valves
- x CMLs at every fitting and flow disturbance | elbows, tees, reducers, valve outlets, low points
- x Straights at four clock positions | bottom readings show settling solids
- x Minimum of three readings at each spot | probe lifted between readings; minimum recorded
- ? Fittings scanned as bands, positions of minima recorded | the step that recovered elbow 3's real wear
- x Baseline survey of new items before service | the replacement reducer, CML 13
- x Coupons for process changes | general rate within weeks
```

The number of CMLs on a line is a judgement, not a calculation. A line with mostly general corrosion and good records can be followed with a few CMLs per straight; a line with erosion at fittings needs every fitting covered. When in doubt, scanning a few extra fittings costs minutes; missing the worst one can cost a leak of hot juice in the middle of the crushing season.

## Exercise: rates at the tee

At CML 5, the tee's branch side, the scanned minimum was 6.70 mm in 2021 and 6.38 mm in 2026. Calculate the short-term and long-term rates, taking the nominal 7.11 mm in 2007 as the original wall. Say which to use, and estimate how many years it would take the tee to reach the 3.0 mm structural minimum at that rate. Then say what would change the answer most.

### Answer

**Given:** 6.70 mm in 2021; 6.38 mm in 2026; 7.11 mm nominal in 2007; structural minimum 3.0 mm.

**Assumptions:** the wear continues at a constant rate; the scanned minimum is the true minimum each time; the original wall was nominal.

**Method:** short-term rate = (6.70 − 6.38) ÷ 5; long-term rate = (7.11 − 6.38) ÷ 19; remaining life = (6.38 − 3.0) ÷ the larger rate.

**Short-term rate:** 0.32 ÷ 5 = 0.064 mm a year.

**Long-term rate:** 0.73 ÷ 19 = 0.038 mm a year.

**Rate to use:** the short-term rate, 0.064 mm a year, because it is the higher and the wear appears to be accelerating, as at elbow 2.

**Remaining life:** (6.38 − 3.0) ÷ 0.064 = 3.38 ÷ 0.064 = 52.8 years.

**Interpretation:** the tee is not life-limiting; elbow 2 is, as Chapter 6 shows. The answer would change most if the tee's wear accelerated further, as it would if the reducer upstream had shed its wear onto the tee, or if the scanned minimum missed a deeper spot. A rate based on two readings five years apart, each uncertain by about ±0.04 mm as Chapter 4 found, is itself uncertain by about ±0.011 mm a year, which moves the remaining life to between about 45 and 64 years, not enough to change the conclusion.

**Verification:** the remaining life at the long-term rate would be 3.38 ÷ 0.0384 = 88 years, longer, confirming that the short-term rate is the cautious choice. The rate's uncertainty is √2 × 0.04 ÷ 5 = 0.011 mm a year.
