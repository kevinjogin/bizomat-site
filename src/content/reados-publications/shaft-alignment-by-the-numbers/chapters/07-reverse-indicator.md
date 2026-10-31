---
book: shaft-alignment-by-the-numbers
chapterSlug: reverse-indicator
order: 7
title: "The reverse indicator method"
description: "How two rim readings, one from each shaft, locate the movable shaft at two planes, how to turn them into foot corrections by calculation or plotting, and why the method suits spacers."
draft: false
---

The rim and face method measures offset at one plane and angle from the face. The reverse indicator method measures offset at two planes, one on each coupling hub, and gets the angle from the difference between them. It needs two brackets, one on each shaft reaching across to the other's hub, and two rim readings. In exchange it ignores axial float completely, resolves the angle well whenever the two planes are far apart, and suits couplings with spacers, where a face reading would be impractical.

This chapter works the method on the HW-3, cross-checks it against Chapter 6's rim and face result, and expresses the angle between the shafts with the WORKOS shaft angular offset tool. Its mistake is the classic one of the method: forgetting that one of the two readings changes sign.

## Two rims, two planes

Indicator A is clamped to the stationary pump shaft and reads the rim of the motor's hub, at plane M. Indicator B is clamped to the motor shaft and reads the rim of the pump's hub, at plane S. For the HW-3 the two planes are 180 mm apart, with plane M nearer the motor. Both indicators are zeroed at 12 o'clock and both shafts are turned together to 6 o'clock. Each reading is corrected for its bracket's sag, measured on the bench as in Chapter 5.

Indicator A measures the motor shaft relative to the pump shaft at plane M, just as the rim indicator of Chapter 6 did: half its reading is the motor's offset there. Indicator B measures the pump shaft relative to the motor shaft at plane S. Half its reading is the pump's offset from the motor, which is the motor's offset from the pump with the sign reversed. That reversal is the heart of the method and of its most common mistake.

```figure
type: formula
title: Reverse indicator calculation, movable shaft position
formula: offset at M = A ÷ 2,  offset at S = −B ÷ 2
formula: slope = (offset at M − offset at S) ÷ span from S to M
formula: correction at a foot = offset at M + slope × distance from M to the foot
caption: A and B are sag-corrected rim readings at 6 o'clock, zeroed at 12 (or at 9, zeroed at 3, for the horizontal plane). Distances are measured from plane M towards the movable machine's feet. Offsets are positive when the movable shaft is low, or displaced towards the reading side, matching the rim and face convention.
- A | indicator on the stationary shaft, reading the movable hub at plane M
- B | indicator on the movable shaft, reading the stationary hub at plane S
```

### Taking the readings

The practical sequence on the HW-3 was: both brackets clamped and their indicators set to mid-travel at 12 o'clock; both zeroed; the shafts turned together by hand at the coupling, slowly and in one direction, stopping at 3, 6 and 9 o'clock; both indicators read at each stop and written down at once; then the shafts turned back to 12 o'clock to confirm that both indicators returned to zero within 0.01 mm. A return to zero is a second closure check, alongside the validity rule: a bracket that has slipped does not return. The whole set was then repeated, and the two sets agreed within 0.01 mm at every position.

The method's name comes from this arrangement: each indicator is the reverse of the other, mounted on one shaft and reading the other. Some fitters call it the double-dial or indicator-reverse method; the geometry is the same under every name.

## The HW-3 by reverse indicator

The HW-3's readings at 6 o'clock were A = +0.42 mm and B = −0.724 mm as read. Both brackets were of the same design and set to the same span, and both measured −0.08 mm of sag on the bench. The corrected readings are A = 0.42 − (−0.08) = +0.50 mm and B = −0.724 − (−0.08) = −0.644 mm. This is an illustration.

```figure
type: steps
title: Working the HW-3 vertical reverse indicator readings
caption: This is an illustration. Planes 180 mm apart; front feet 320 mm and back feet 669 mm from plane M.
- Offset at M | +0.50 ÷ 2 = +0.250 mm: motor low
- Offset at S | −(−0.644) ÷ 2 = +0.322 mm: motor lower still, nearer the pump
- Slope | (0.250 − 0.322) ÷ 180 = −0.0004, or −0.040 mm per 100 mm
- * Front feet | 0.250 − 0.0004 × 320 = add 0.122 mm
- Back feet | 0.250 − 0.0004 × 669 = remove 0.018 mm
```

The result agrees exactly with Chapter 6's rim and face corrections: add 0.122 mm at the front feet and remove 0.018 mm at the back. Two methods, different indicators, different brackets, one answer. That agreement is the strongest check an alignment can have before anything is moved.

### Expressing the angle

The angle between the shafts comes from the change of offset across the span between the planes: the motor shaft is 0.322 mm low at S and 0.250 mm low at M, a change of 0.072 mm across 180 mm. The [shaft angular offset tool](/tools/shaft-angular-offset/) converts that into the units of Chapter 1.

```figure
type: steps
title: The HW-3 reverse indicator angle in the shaft angular offset tool
caption: This is an illustration. Offset change 0.072 mm across an axial span of 180 mm. The tool's note applies: enter the actual offset change, half the rim readings, not the raw readings.
- Angular misalignment | 0.0229°
- Angular misalignment | 0.400 mrad
- * Slope | 0.040 mm per 100 mm
```

The tool reports magnitude: its input is the offset change, and the direction comes from which plane is lower. The sign of the slope for the corrections comes from the formula above.

## The horizontal plane

For the horizontal plane, both indicators are zeroed at 3 o'clock and read at 9 o'clock, viewed from behind the motor. Sag cancels sideways. The HW-3 read A = +0.30 mm and B = −0.084 mm. The offset at M is 0.150 mm, at S it is 0.042 mm, and the slope is (0.150 − 0.042) ÷ 180 = +0.0006. The corrections are 0.150 + 0.0006 × 320 = 0.342 mm at the front feet and 0.150 + 0.0006 × 669 = 0.551 mm at the back, towards the 3 o'clock side: again the same as the rim and face result. This is an illustration.

## The mistake: B without its sign change

When the HW-3's reverse indicator readings were first worked by hand, the offset at S was written as B ÷ 2 = −0.322 mm, without the sign change. The slope became (0.250 + 0.322) ÷ 180 = +0.00318, and the corrections came out as add 1.267 mm at the front and add 2.376 mm at the back.

```figure
type: compare
title: The HW-3 vertical corrections with and without B's sign change
cols: Offset at S, mm | Slope | Front feet, mm | Back feet, mm
rowhead: Working
- * Correct: offset at S = −B ÷ 2 | +0.322 | −0.0004 | add 0.122 | remove 0.018
- Error: offset at S = +B ÷ 2 | −0.322 | +0.00318 | add 1.267 | add 2.376
caption: This is an illustration. The error makes the shafts look as if they cross between the hubs, at a steep angle, and the corrections grow ten to a hundred times.
```

Three things flagged the error before any shim was cut. The corrections were ten times larger than anything the rough alignment had suggested. The implied angle, 0.318 mm per 100 mm, would have shown as a face gap difference of about 0.48 mm across the hub, which the feeler record did not show. And the rim and face result from Chapter 6 disagreed completely. Any one of them was enough.

The sign change is easy to see in a sketch. Indicator B rides on the motor shaft and looks at the pump hub. If the motor shaft is low, the pump hub is high relative to it, so B reads the opposite way to A for the same misalignment. A plot, described next, makes it automatic.

## Plotting the reverse indicator result

The reverse indicator method lends itself to a scale plot, and many fitters plot before calculating.

1. Draw a horizontal line for the stationary shaft's centreline, with the horizontal scale in millimetres along the machines.
2. Mark plane S, plane M, the front feet and the back feet along it.
3. At plane M, plot the movable shaft's offset A ÷ 2 below the line if it is positive. At plane S, plot −B ÷ 2 the same way.
4. Draw a straight line through the two points and extend it to the feet.
5. Read the corrections at each pair of feet as the distance from the movable line to the stationary line.

With an exaggerated vertical scale, say 1 mm on paper for each 0.01 mm, the HW-3 plot shows the motor line 25 mm below the stationary line at M, 32.2 mm below at S, and crossing to 1.8 mm above at the back feet. It takes a few minutes, shows at once whether the moves are reasonable, and can be done on the back of the alignment sheet. Plotting also makes it easy to see the effect of a thermal target line, which Chapter 8 adds.

## Two brackets, two sags

The reverse indicator method uses two brackets, and their sags need not be equal. On the HW-3 they were the same design and span, and both measured −0.08 mm. Suppose instead that bracket B had been a longer one, sagging −0.12 mm. With the same shaft positions, it would have read −0.644 + (−0.12) = −0.764 mm. If the fitter had assumed it matched bracket A and corrected with −0.08 mm, B would have been taken as −0.764 − (−0.08) = −0.684 mm instead of the true −0.644 mm.

Working through with the wrong value gives an offset at S of 0.342 mm, a slope of (0.250 − 0.342) ÷ 180 = −0.000511, and corrections of add 0.086 mm at the front and remove 0.092 mm at the back, against the true add 0.122 and remove 0.018. The back feet would have ended 0.074 mm wrong, outside the tolerance from a sag error of only 0.04 mm. This is an illustration. The lesson is the same as in Chapter 5, doubled: each bracket's sag is measured for itself, at its own span, and recorded against its reading.

## When the two methods disagree

The HW-3's rim and face and reverse indicator results agreed to the third decimal, because the illustration was built that way. On a real machine they usually agree within a few hundredths of a millimetre at the feet, and a larger disagreement means one set is wrong.

- **Face readings affected by axial float.** The reverse indicator result is immune; the rim and face result is not. Pushing the shafts to one end and repeating the face readings usually settles it.
- **Sag applied wrongly to one bracket.** As above. Re-measuring each bracket's sag on the bench is quick.
- **Shafts not turned together.** If only one shaft turned, the reading includes the runout of the hub it rode on.
- **Different distances.** The two methods measure from different planes; a distance taken from the wrong plane shifts every correction.

When two methods disagree, the right response is to find the cause, not to average the answers.

## Machine trains

Many drives have more than two machines in line: a motor, a gearbox and a pump, or a turbine, a gearbox and a generator. Each coupling is measured separately, but the corrections are planned for the whole train together, because moving a middle machine changes two couplings at once. One machine, usually the one with the most pipework or the heaviest foundation, is chosen as the reference, and the others are aligned to it in turn.

Plotting is the natural tool for a train. All the shafts are drawn on one sheet, each coupling's readings placing the next shaft relative to the last, and the plot shows at a glance which machine should move and by how much to bring all of them into line with the least total movement. A reverse indicator plot of each coupling slots straight into such a drawing. Laser systems with train programs do the same arithmetic and show the same picture on screen.

## Lasers and the reverse geometry

Most two-head laser alignment systems use the reverse indicator geometry: a laser and detector on each shaft, each measuring the other shaft's position at its own plane. The calculation inside them is the one in this chapter, and the results they display can be checked against a quick plot of two rim positions. The same physical cautions apply: both heads rigidly mounted, both shafts turned together, and enough rotation for the system to fit its measurement.

## When to choose reverse indicator

```figure
type: compare
title: Rim and face against reverse indicator
cols: Rim and face | Reverse indicator
rowhead: Feature
- Brackets | one, on the stationary shaft | two, one on each shaft
- Angle measured from | the face reading across the hub diameter | the difference between two rim readings across the span between hubs
- * Axial float | affects the face reading | does not affect either reading
- Best for | large hubs, short couplings | small hubs, spacer couplings, machines with float
- Sag | one bracket, usually short | two brackets, often longer, so sag matters more
caption: Both methods measure the same geometry and give the same corrections when done correctly, as the HW-3 shows. The choice depends on the coupling and the machines.
```

The angle's resolution depends on the span. On the HW-3, a 0.01 mm error in one reading changes the slope by 0.005 ÷ 180, and the back correction by about 0.019 mm. With a spacer coupling 500 mm long, the same error would change the back correction by about 0.007 mm. Longer spans give better angle resolution, which is why the method suits spacer couplings, provided the longer brackets' sag is measured carefully.

### Validity for two indicators

Each indicator's readings obey the validity rule of Chapter 5 on their own: top plus bottom equals left plus right. Both should be checked. In addition, the two indicators must be read at the same rotation positions, because they describe the same moment of the shafts' relative position from two ends. Reading A at 6 o'clock and B a few degrees off it mixes a little of the horizontal offset into the vertical answer.

## Exercise: a spacer coupling

A fan drive has a spacer coupling with planes S and M 200 mm apart. The movable motor's front feet are 300 mm and its back feet 650 mm from plane M. The sag-corrected vertical readings at 6 o'clock, zeroed at 12, are A = +0.30 mm and B = −0.10 mm. Find the offsets at both planes, the slope and the corrections, and use the shaft angular offset tool's units to state the angle.

**Worked answer.** The offset at M is 0.30 ÷ 2 = 0.150 mm and at S it is −(−0.10) ÷ 2 = 0.050 mm. The slope is (0.150 − 0.050) ÷ 200 = +0.0005, so the motor slopes down away from the coupling. The front correction is 0.150 + 0.0005 × 300 = 0.300 mm and the back correction 0.150 + 0.0005 × 650 = 0.475 mm: add shims at both.

The offset change is 0.100 mm across 200 mm, which the shaft angular offset tool gives as 0.0286°, 0.500 mrad and 0.050 mm per 100 mm. This is an illustration.
