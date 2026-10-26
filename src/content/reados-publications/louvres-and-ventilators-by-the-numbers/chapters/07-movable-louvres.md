---
book: louvres-and-ventilators-by-the-numbers
chapterSlug: movable-louvres
order: 7
title: "Movable louvres: blades, linkages and actuators"
description: "Compare gravity and motorised exhaust louvres for PR-30, lay out the blade linkage and its travel, size the actuator, and set the blades up so that every one closes."
draft: false
---

A fixed louvre is always open. Many openings need to close: an exhaust louvre that should not let rain, cold air or birds in when its fans are off, a smoke vent that opens in a fire, or a natural ventilation opening that is closed in winter. The 1922 trade course showed movable louvres whose slats turned on wire pivots, worked by quadrants riveted to the slats and a band-iron bar pulled up and down by cords from below. The mechanism has changed in its materials and motors, not in its geometry: blades on pivots, cranks on the blades, a bar linking the cranks, and something to move the bar.

This chapter compares a gravity louvre with a motorised one for PR-30's exhaust, lays out the motorised louvre's blades and linkage and works out the link bar's travel, sizes the actuator, and sets out the commissioning that proves every blade closes. The failure case is a louvre with one crank clamped at the wrong angle.

## Gravity or motorised

The simplest closing louvre is a **gravity louvre**, sometimes called a backdraught shutter. Its blades hang from pivots along their top edges and are pushed open by the air blowing out; when the fans stop, they fall shut under their own weight. It needs no power and no control. Its price is pressure: the fans must hold the blades open against their weight the whole time they run.

```figure
type: formula
title: Pressure needed to hold a gravity louvre's blades open
formula: p ≈ (blade mass per unit area) × g × sin φ
caption: This is an illustration for flat blades hinged at their top edge, with the air's pressure difference acting square to the blade and φ the angle the blade has swung from hanging vertical. Real gravity louvres have curved blades, counterbalances and tested data; the estimate shows the order of the pressure.
- Blade, 0.9 mm aluminium | 2,700 kg/m³ × 0.0009 m ≈ 2.43 kg/m²
- Swung 30° open | 2.43 × 9.81 × sin 30° ≈ 11.9 Pa
- Swung 60° open | 2.43 × 9.81 × sin 60° ≈ 20.6 Pa
- Swung nearly horizontal | about 23.8 Pa
step: Holding the blades well open costs about 20 Pa, nearly as much as PR-30's whole pressure budget of 23.9 Pa
```

For PR-30, an extra 20.6 Pa at the exhaust, constant with flow because it is set by the blades' weight, would move the fans' operating point. Re-solving Chapter 3's system with the teaching fan curve, the pair would deliver about **3.49 m³/s** against about **40 Pa**, and the room would run about **8.9 K** above outdoor temperature instead of 7.95 K: the same shortfall as the undersized intake louvre. Lighter or counterbalanced blades reduce the penalty, and gravity louvres suit small fans with spare pressure. For PR-30's propeller fans, which lose flow quickly with pressure, a motorised louvre that opens fully before the fans start costs much less airflow.

```figure
type: compare
title: Three closing louvres for PR-30's exhaust
cols: How it opens and closes | Pressure while open | Suits
caption: This is an illustration. PR-30 uses a motorised parallel-blade louvre, because it must also open for natural ventilation with the fans off (Chapter 6), which a gravity louvre cannot do.
- Gravity louvre | air pushes blades open; weight closes them | about 20 Pa from blade weight, plus its flow loss | small fans with spare pressure; no power or control needed
- *Motorised, parallel blades | actuator drives all blades together | flow loss only, about 8.9 Pa at design | open-close duty; directs discharge upwards; opens for natural ventilation
- Motorised, opposed blades | adjacent blades turn in opposite directions | flow loss only | modulating control of flow; even discharge
```

## The motorised louvre's blades

PR-30's exhaust louvre is **2,000 mm wide by 1,500 mm high**. Inside a 50 mm frame and a 50 mm central mullion, it has two bays, each **925 mm** clear, and a core **1,400 mm** high. Each bay has **10** flat aerofoil-section blades at a **140 mm** pitch, each with a **150 mm** chord, so that when closed each blade overlaps the next by **10 mm**, and the overlaps carry a soft edge seal. Each blade turns on a spindle at its centre-line, carried in a nylon bush in the jamb and the mullion.

The two bays' blades are driven together: the link bar on the mullion side of each bay is joined across the mullion by a short jackshaft, so that one actuator moves all twenty blades and the two bays cannot end up in different positions. The blades are aluminium, about 0.45 kg each, and well balanced about their centre spindles, so the actuator does not have to lift them as it would a gravity blade; it has only to overcome friction in the bushes and seals, compress the edge seals when closing, and hold the blades against wind.

## The linkage

Each blade spindle carries a **crank arm** outside the airstream, at the jamb end. The cranks are all the same length, **40 mm**, and all set at the same angle on their spindles. A single vertical **link bar** joins the crank ends with pivot pins. Moving the bar up or down turns every crank, and so every blade, through the same angle at the same time. This is **parallel-blade** action: all the blades stay parallel to each other as they turn.

```figure
type: svg
title: The parallel-blade linkage on one jamb of PR-30's exhaust louvre
alt: Four short blades are drawn one above another, each pivoted at its centre on a vertical line. From each pivot a short crank arm runs to the right, and the ends of the four cranks are joined by a single vertical link bar. An actuator at the bottom drives the link bar up and down. Arrows show the bar's travel.
caption: This is an illustration, not to scale. With 40 mm cranks swinging 37.5° either side of square to the bar, the bar travels about 48.7 mm and swings sideways about 8.3 mm between the closed and open positions.
viewbox: 0 0 520 300
body:
<path class="la" d="M168 58L232 42M168 118L232 102M168 178L232 162M168 238L232 222"/>
<circle class="fa" cx="200" cy="50" r="4"/>
<circle class="fa" cx="200" cy="110" r="4"/>
<circle class="fa" cx="200" cy="170" r="4"/>
<circle class="fa" cx="200" cy="230" r="4"/>
<path class="li" d="M200 50L270 50M200 110L270 110M200 170L270 170M200 230L270 230"/>
<path class="ln draw" pathLength="1" d="M270 30V262"/>
<rect class="bxa" x="250" y="262" width="40" height="28"/>
<path class="lf" d="M320 60V130"/>
<path class="ah" d="M315 60l5 -12l5 12z"/>
<path class="ah" d="M315 130l5 12l5 -12z"/>
<text class="txs" x="40" y="54">blade on spindle</text>
<text class="txs" x="212" y="88">crank 40</text>
<text class="txa" x="334" y="100">bar travel 48.7</text>
<text class="txs" x="300" y="282">actuator</text>
<text class="txs" x="282" y="24">link bar</text>
```

### Travel and swing

The bar's travel depends on the crank length and the angle each blade turns through. PR-30's blades turn **75°** from closed to fully open. The cranks are set so that, halfway through that movement, they stand square to the link bar, swinging **37.5°** either side of square. The bar's travel is then the crank length times twice the sine of 37.5°: **2 × 40 × sin 37.5° ≈ 48.7 mm**.

As the cranks swing, their ends also move sideways, towards the spindles and back, by the crank length times one minus the cosine of 37.5°: **40 × (1 − cos 37.5°) ≈ 8.3 mm**. The link bar must be free to move sideways that much, so its guides are slotted, not tight. Setting the cranks symmetrically about square to the bar keeps the sideways swing small; setting them square to the bar at the closed position would double it to 40 × (1 − cos 75°) ≈ 29.6 mm and make the blades' motion uneven, fast at first and slow at the end.

## The actuator

The actuator is a rotary damper actuator driving one blade spindle, which drives the link bar and so all the others, or a linear actuator driving the bar directly. Louvre and actuator makers publish torque requirements per square metre of louvre for their blade and seal types; this book uses a teaching value of **4 N·m per m²**. PR-30's exhaust louvre is **3.0 m²**, so it needs about **12 N·m**, and a **15 N·m** spring-return actuator is chosen, giving some margin for seals that stiffen with age and for wind on the closed blades.

The spring-return position matters as much as the torque. Chapter 6 set PR-30's exhaust to spring **open** on power failure, so that a power cut leaves the room ventilated. A louvre in a fire-rated or smoke-control application might be required to fail in the opposite position, by different rules; the failure position is decided deliberately and written into the control schedule, never left to whichever actuator model was in stock.

Stroke time matters too. A typical spring-return damper actuator takes tens of seconds to drive fully open and a similar time to spring back, from the maker's data. PR-30's controller therefore opens the louvre before it starts the fans and waits for confirmation, and it does not try to cycle the louvre rapidly in response to small temperature changes; a deadband of a few degrees between opening and closing temperatures stops the louvre hunting open and shut, which wears both the actuator and the seals.

The actuator has end switches that tell the fan controller when the blades are fully open. PR-30's fans start only when the open switch has made, so the fans never start against closed blades, which would stall them and strain the linkage.

## Parallel or opposed blades

PR-30's exhaust louvre is an open-close device: fully open when the fans run or the room needs natural ventilation, fully closed otherwise. For that duty, parallel blades are simple and have a useful side effect: in the open position all the blades point the same way, so they can be set to throw the exhaust air slightly upwards, away from people walking past and from the intake around the corner.

Where a louvre or damper must **modulate**, holding part-open positions to control a flow, opposed blades behave better. With adjacent blades turning in opposite directions, pairs of blades form converging passages as they close, and the flow falls away more evenly over the actuator's stroke. Parallel blades tend to pass most of the flow in the first part of their opening, so a small movement near the closed position makes a large change in flow and the rest of the stroke does little. Opposed-blade linkages need the cranks on alternate blades to point in opposite directions, or a second link bar, and their set-up is correspondingly more careful.

## Wind on closed blades and leakage

Closed, the blades form a wall that the wind pushes on. Because each blade turns about its centre, wind pressure on one half of the blade tries to turn it one way and pressure on the other half the other way, and the turning effects nearly balance. In gusts they do not quite balance, and blades held only by a slack linkage chatter. The actuator holds the linkage firmly in its closed position, and the link bar's guides keep it from flexing, so that gust loads go into the frame rather than shaking the blades.

A closed louvre is not airtight. Air leaks past the blade edge seals and the jamb seals, and louvre makers publish leakage rates at a stated pressure difference. For PR-30, a small leakage in winter, when the louvre is closed and the room is cool, is harmless; for a louvre that closes off a heated or air-conditioned space, leakage is a heat loss all winter and is checked against the maker's data before the louvre is chosen.

## Bushes, pins and corrosion

Movable louvres fail most often at their pivots. Steel spindles in aluminium blades and frames, outside in the weather, corrode where the metals meet, the blades stiffen and the actuator stalls. PR-30's spindles are stainless, running in nylon bushes, with the crank arms clamped to the spindles by stainless set screws on flats. The link-bar pins are stainless shoulder bolts with locking nuts, so they turn freely without loosening; a plain bolt tightened onto the link would either clamp it or work loose. The 1922 course warned its apprentices against bolts that loosen in time at a louvre's pivots; the modern answer is the right fastener, not the absence of one.

## Commissioning: every blade closes

A movable louvre is only as good as its worst blade. PR-30's commissioning follows a set sequence:

```figure
type: steps
title: Commissioning PR-30's motorised exhaust louvre
caption: This is an illustration of the shop's procedure. Each step is signed off on the commissioning sheet, with the actuator's measured stroke time and the room temperatures at which the controller opened and closed the louvre.
- Close every blade by hand | check each blade's seal touches along its full length
- Set every crank on its spindle with a setting jig | all cranks at the same angle, then clamp
- Fit the link bar and the actuator with the blades closed | actuator at its closed end stop
- Drive open and closed three times | watch every blade; listen for binding
- Check the end switches | fans start only when the open switch makes
- *Test the failure position | cut the actuator's power; the louvre springs open
```

The setting jig, a plate that fits over each spindle's flat and holds the crank at the correct angle while its set screw is tightened, is the key step. Setting cranks by eye produces blades that close at slightly different moments; the first to close stops the bar, and the others stay a few degrees open with their seals not touching.

## A failure case: one crank reversed

This is an illustration. On an earlier exhaust louvre, a fitter replacing a damaged blade refitted its crank on the spindle's flat the wrong way round, 180° from the others. The flat allowed it; nothing else did. When the actuator drove the louvre closed, the link bar tried to turn that blade the opposite way to the rest, the linkage jammed part-way, and the actuator stalled with all the blades about a third open.

The fans, waiting for the open switch, never started, and the louvre stood a third open through a wet, windy night, letting rain in onto the floor. The detection came the next morning from the wet floor and the fan controller's fault log, which showed the open switch had never made.

The correction was simple: the crank was turned round and clamped with the setting jig, and the louvre cycled three times. The shop now marks every crank and spindle with a paint line that must align, and its blade-replacement instruction includes the setting jig and the three-cycle test.

## How this applies to a small Australian business

Choose between gravity and motorised louvres with the fan's pressure margin in view: a gravity blade's weight is a constant pressure the fans must overcome. For motorised louvres, choose parallel or opposed blades for the duty, set the cranks symmetrically about square to the link bar, calculate the bar's travel and sideways swing, and size the actuator from the maker's torque data with margin. Decide and record the failure position. Use stainless pivots in non-metallic bushes and locking fasteners. Set every crank with a jig and prove every blade closes at commissioning.

## Exercise: a longer stroke

A different louvre has 50 mm cranks and blades that turn 90° from closed to open. If the cranks are set symmetrically about square to the link bar, what are the bar's travel and sideways swing? What would the swing be if the cranks were instead square to the bar when the blades were closed?

**Worked answer.** The cranks swing **45°** either side of square. The travel is **2 × 50 × sin 45° ≈ 70.7 mm**, and the sideways swing **50 × (1 − cos 45°) ≈ 14.6 mm**. With the cranks square to the bar at the closed position, they would swing the full 90° to one side, and the swing would be **50 × (1 − cos 90°) = 50 mm**, more than three times as much, with the travel only **50 × sin 90° = 50 mm** and very uneven blade motion near the open end.
