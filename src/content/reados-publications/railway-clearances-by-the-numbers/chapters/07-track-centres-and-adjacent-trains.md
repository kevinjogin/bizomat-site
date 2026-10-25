---
book: railway-clearances-by-the-numbers
chapterSlug: track-centres-and-adjacent-trains
order: 7
title: "Track centres and adjacent trains"
description: "Find the distance two tracks must be apart for trains to pass with a safety margin, see why curves and differences in cant need wider centres, and manage tracks that are closer than the standard."
draft: false
---

Two trains passing each other on adjacent tracks are, for clearance purposes, two moving structures. Each sways, leans, bounces and swings on curves, and each runs on track that is not exactly where it was designed. The distance between the two tracks' centrelines, the track centres, must be large enough for both kinematic envelopes and a safety margin between them. Too small, and passing trains can strike each other; too large, and every bridge, cutting and platform on the line must be wider than it needs to be. Track centres are therefore one of the most consequential clearance numbers on any multi-track railway, and one of the hardest to change once the line is built, because every structure along the line has been sized around them and widening them means rebuilding much of the corridor.

This chapter calculates the track centres needed for two vehicles on straight track and on a curve, shows how a difference in cant between the tracks adds to them, traces the change from the old NSW standard of 3,660 mm to 4,000 mm, and deals with the passing loop beside the running case's main line.

## Two envelopes and a margin

Between two adjacent tracks, the relevant parts of the two envelopes are the sides facing each other: the right-hand half of one vehicle's envelope and the left-hand half of the other's. The track centres must be at least the sum of those two reaches from their own centrelines, plus the safety margin between them. ARTC's Transit Space Standards, BDS 11, applied the same 200 mm safety margin between adjacent kinematic envelopes as between an envelope and a structure.

```figure
type: formula
title: Track centres needed on straight track for two of the running case's vehicles
formula: track centres = reach of vehicle A towards B + reach of vehicle B towards A + safety margin
caption: This is an illustration using the straight-track envelope of Chapter 5's exercise: a body half-width of 1,500 mm reaching about 1,727 mm at roof height with roll, wear, play, track movement and cant variation, on each track, and a 200 mm margin.
- Reach of each vehicle at roof height | about 1,727 mm
- Safety margin | 200 mm
step: track centres = 1,727 + 1,727 + 200
step: track centres ≈ 3,654 mm at roof height, less lower down where the roll moves the body less
step: a standard of 4,000 mm leaves about 346 mm beyond the requirement for these vehicles on straight track
```

## From 3,660 to 4,000 mm

The commentary to the NSW Transit Space Handbook, BDS 18, explains why NSW moved away from its traditional track centres. The 1957 structure gauge specified 3,660 mm, or 12 feet, which historically gave incident-free passing, but the kinematic tolerances of the vehicles on each track, approximately 240 mm per track by the commentary's reckoning, consumed the whole of the 450 mm clear space between them, leaving no safety margin. The 1987 structure gauge increased track centres to 4,000 mm, which provided for the tolerances on both tracks plus a safety margin, and the commentary stated that all track centres less than 4,000 mm were now non-conforming and had to be managed.

ARTC's Structure Gauge 1994, BDS 12, gave minimum design track centres for new works of 4,000 mm between main lines, and between main lines and loops or sidings, on straight track and on curves of 1,000 m radius and greater, with a formula for wider centres on sharper curves, and 5,200 mm beside examination sidings, where staff work on the ground between the tracks.

```figure
type: compare
title: Track centres in NSW practice, as described in ARTC BDS 12 and BDS 18
cols: Basis | Status in the 2005 standards
caption: Values as given in ARTC BDS 12 and BDS 18 (Issue 1, March 2005), for teaching; check currency with ARTC.
- 3,660 mm | 1957 structure gauge; 450 mm clear between trains with no separate safety margin | non-conforming; to be managed
- *4,000 mm | tolerances of both tracks plus a safety margin; straight and curves of 1,000 m radius or more | minimum for new main line works
- Wider on curves under 1,000 m | throw and differences in cant | by the standard's formula
- 5,200 mm | room for staff beside examination sidings | minimum beside examination sidings
```

## Curves

On a curve, the vehicle on the outer track swings its middle towards the inner track, and the vehicle on the inner track swings its ends towards the outer track, so the throws of both add between the tracks. If both tracks have the same cant, both vehicles lean the same way, towards the inside of the curve: the outer track's vehicle leans towards the inner track, but the inner track's vehicle leans away from the outer track by about the same amount at the same height, so the cant largely cancels out between them. What remains between them is mainly the two throws, the two sets of tolerances and the two body rolls, which is why a curve with equal cant on both tracks needs only modestly wider centres than straight track.

## Differences in cant

The cancellation works only if both tracks have the same cant. Where they differ, the vehicles lean by different amounts, and the difference closes the gap between them at height. Adjacent tracks often do have different cant: a main line canted for fast trains beside a loop canted less for slow ones, or two tracks that have drifted apart in maintenance. BDS 18 noted that special consideration may be needed for small-radius curves, transitions and larger superelevation variations between adjacent tracks.

```figure
type: bars
title: Track centres needed at roof height for two 1,500 mm half-width vehicles
unit: mm, kinematic envelopes plus a 200 mm margin
max: 4000
caption: This is an illustration, calculated by building both vehicles' facing envelopes point by point as in Chapter 5. Curve cases use a 400 m radius, 35 mm track movement and the freight vehicle's centre and end throws of about 49 and 41 mm.
- Straight track | 3654
- 400 m curve, both tracks 60 mm cant | 3761
- *400 m curve, outer track 60 mm, inner track 20 mm cant | 3868
- Straight, 1,600 mm half-width stock | 3854
```

On the running case's 400 m curve, with both tracks at 60 mm cant, the requirement rises about 107 mm above straight track, mostly from the two throws and the extra track movement on curves. If the inner track had only 20 mm of cant, the outer track's vehicle would lean about 107 mm more towards it at roof height than the inner track's vehicle leaned away, and the requirement would rise to about 3,868 mm, still inside 4,000 mm but with much less to spare. On a sharper curve, or with wider stock, 4,000 mm would no longer be enough, which is why the standard called for wider centres on curves under 1,000 m radius.

## Widening transitions

When track centres must be wider on a curve than on the straight, the tracks are moved apart gradually, along a widening transition, before the curve. BDS 18 explained that the move to 4,000 mm centres in 1987 was made partly to minimise the use of widening transitions. Widening one track sideways on its approach to a curve adds reverse curves to its alignment, which affects ride and maintenance, so generous straight-track centres that suit most curves without widening are simpler to build and maintain.

## Tracks that are closer than the standard

Many old lines have tracks closer than 4,000 mm, laid to earlier standards, and widening them may mean rebuilding bridges, platforms and cuttings. Such tracks are not necessarily unsafe, but they have less margin, and the margin is managed rather than assumed. ARTC's code of practice for SA, WA and Vic stated that permanent infringements where the contingency gap between adjacent kinematic envelopes, or between an envelope and a structure, is less than 150 mm should be subject to ARTC approval and permitted only in special circumstances, such as where track centres are substandard, and that track positions should be monitored where the gap could fall below 250 mm. Monitoring may use datum markers, fixed reference points beside the track from which its position is checked, so that track movement in maintenance does not eat the margin unnoticed.

## Track centres and structures between tracks

Structures between tracks, such as overhead wiring masts, signal posts and bridge piers, need track centres wide enough for the structure and the clearances on both sides. BDS 12 gave a service dimension of 3,500 mm from each track centreline for piers, columns and deflection walls between tracks, which means track centres of at least 7,000 mm plus the structure's own width where such a pier stands. That is one reason bridges over multi-track railways usually span all the tracks rather than placing piers between them, and why BDS 06 did not allow piers between tracks except on platforms without specific approval.

## Trains of different widths

The critical pair of vehicles is not always two of the same kind. A wide passenger train passing a narrow freight wagon needs less space than two wide passenger trains passing, and a line carrying only narrow freight stock on one track and wide stock on the other could in principle use narrower centres. In practice, track centres are set for the widest stock that may use each track, because the traffic on a line changes over its life and a track restricted to narrow stock is an operating constraint nobody remembers until it is broken. The bars above show that wider stock, 1,600 mm instead of 1,500 mm half-width, adds 200 mm to the requirement on straight track, 100 mm from each vehicle.

## Measuring track centres

Track centres are measured between the two tracks' centrelines, square to the tracks, usually by measuring from the inner running edge of one track's near rail to the inner running edge of the other track's near rail and adding the appropriate half-gauges, or by survey from fixed marks. On curves, the measurement is taken radially. Measurements are taken at regular intervals and at every structure, and recorded with the cant of each track at the same points, because, as this chapter shows, the cant difference matters as much as the distance.

## Islands and structures in the six-foot

The space between two tracks, sometimes called the six-foot from its old imperial size, is where staff walk when they must cross between tracks, where signal equipment sometimes stands, and where island platforms are built at stations. Any of these needs wider centres than plain track. An island platform needs its own width plus the platform clearances on both sides, which is why stations on multi-track lines are often where tracks are spread apart, with widening transitions on each approach. Staff walking between tracks while trains pass on both sides are exposed to the hazard of Chapter 8, and walkways between tracks need centres wide enough to provide a safe place.

## Dual gauge and mixed traffic

On dual gauge track, where a third rail lets trains of two gauges use the same track, the centrelines of the two gauges are offset from each other, so a train of one gauge runs off-centre relative to the other. Track centres to an adjacent track must allow for whichever gauge's train comes closer, which is usually the one whose centreline is offset towards the adjacent track. Australia has dual gauge sections on its interstate network, and clearance checks there use each gauge's centreline in turn.

## The running case: the passing loop

This is an illustration. The passing loop near the overbridge runs beside the main line at 4,000 mm centres, starting about 150 m from the bridge, on the same 400 m curve. The main line carries 60 mm of cant; the loop, designed for slow trains entering and leaving, carries 20 mm. The consultancy checked whether the bridge works would alter either track; they would not, but the council's road realignment would bring a new drainage pit within 2,600 mm of the loop. The consultancy calculated the loop's envelope at the pit's height, added the margin and the service dimension the infrastructure manager specified, and moved the pit. It also confirmed that the 4,000 mm centres, with the 40 mm cant difference, left the required margin between passing trains, as the bars above show at about 3,868 mm.

## Changing a track's position

Track centres can be eroded by maintenance. Each time a track is tamped and lined, it may move a few millimetres; over years, the movements accumulate, and two tracks laid at 4,000 mm may drift to 3,950 mm or less. On lines with tight centres, the track's position is checked against fixed markers after maintenance, and lining is constrained to keep the centres. Railway Track Geometry by the Numbers, the companion book, covers the measurement of track position.

## A failure: the drifting loop

This is an illustration. On another line, a crossing loop laid at 3,800 mm centres beside a main line, under a historical standard, had been lined repeatedly over many years without reference markers, and had drifted to about 3,700 mm at one point on a curve, where the loop also had more cant than the main line. A train in the loop and a wide passenger train on the main line passed with a gap that a later analysis showed was well below the safety margin.

No contact occurred, but the analysis prompted datum markers along the loop, a lining constraint in the maintenance plan, and a speed restriction for wide stock through the section until the loop was realigned to 4,000 mm.

## Exercise: centres on a sharper curve

Two vehicles on adjacent tracks on a curve each reach 1,880 mm towards each other at roof height when both tracks have equal cant. The safety margin is 200 mm. What track centres are needed? If the outer track's cant is 30 mm greater than the inner track's, how much does that add at a roof height of 4,000 mm, and what centres are needed then?

With equal cant, the centres needed are 1,880 + 1,880 + 200 = **3,960 mm**, just inside 4,000 mm.

A 30 mm difference in cant leans the outer track's vehicle about 4,000 × 30 ÷ 1,500 = **80 mm** further towards the inner track at roof height, so the centres needed rise to about **4,040 mm**, more than 4,000 mm. This is an illustration: on that curve, the tracks would need widening, the cants would need to be matched, or wide stock restricted, which is why differences in cant between adjacent tracks are controlled wherever track centres are tight.
