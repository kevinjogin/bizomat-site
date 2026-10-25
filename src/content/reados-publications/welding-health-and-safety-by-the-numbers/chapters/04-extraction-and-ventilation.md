---
book: welding-health-and-safety-by-the-numbers
chapterSlug: extraction-and-ventilation
order: 4
title: "Extraction and ventilation"
description: "Capture fume at the arc with arms, on-torch extraction, benches and booths, calculate how airflow grows with distance from the hood, test that systems work, and count the heat exhaust air removes."
draft: false
---

Chapter 2 showed that general ventilation cannot dilute welding fume enough near the welder; the plume rises straight into the welder's breathing zone, far more concentrated than the room around it. The answer is to capture the fume at its source, close to the arc, before it reaches the welder's face, and carry it away or filter it. That is local exhaust ventilation, and for welding it is the main engineering control. It works well when it is the right kind for the job, sized correctly, placed close to the arc and maintained. It fails, often silently, when any of those slips, and the commonest failure is simply that the hood is too far away.

This chapter describes the kinds of local exhaust used for welding, calculates how the airflow a hood needs grows with its distance from the arc, explains how systems are tested, deals with general ventilation and make-up air, and counts the cost of the heat that exhaust air carries out of the building in winter.

## Kinds of extraction

```figure
type: compare
title: Local exhaust ventilation for welding
cols: How it works | Suits | Watch for
caption: General description for teaching. Extraction systems should be designed and commissioned by competent people, and their performance measured.
- *Extraction arm with hood | flexible arm positioned near the arc by the welder | bench and jig work; moving work in a bay | must be moved as the work moves; useless if left out of reach
- On-torch extraction | suction through a shroud on the torch itself | gas metal arc and flux-cored welding anywhere | heavier torch; must not disturb the shielding gas
- Downdraft or backdraft bench | air drawn through or behind the bench | small parts welded on a bench | plume must pass over the grille
- Booth or enclosure | the work is inside a partly enclosed space with extraction | repeated small work; robot cells | open face velocity must be maintained
- Mobile extraction unit | portable fan and filter with an arm | maintenance and site work | filter capacity; noise; placement
- Large hoods and roof extraction | captures rising plume above large work | very large weldments | plume passes the welder's face first; not a substitute for capture at the arc
```

No single kind suits every job. Extraction arms are the commonest in fabrication shops, because they serve a variety of work; on-torch extraction travels with the arc and so solves the problem of the hood being in the wrong place, at the cost of a heavier torch; benches and booths suit small repeated work. Large overhead hoods capture fume only after it has risen past the welder, so they help clear the building but do little for the welder's own exposure.

## Distance is everything

A hood's suction falls off very quickly with distance. Air is drawn towards a hood from all directions, so the speed of the air at a point in front of the hood falls roughly with the square of the distance from it. The air speed needed at the arc to pull the fume into the hood, the capture velocity, therefore needs a much larger airflow when the hood is further away.

```figure
type: formula
title: Airflow a freely suspended hood needs to capture fume at a distance
formula: airflow ≈ capture velocity × (10 × distance² + hood face area)
caption: This is an illustration using a widely published approximation for a plain round hood in free space, with an assumed capture velocity of 0.5 m/s at the arc and a hood about 250 mm across, face area about 0.049 m². Flanges, nearby surfaces and draughts change the result; designers use the methods in industrial ventilation references and measure the result.
- Capture velocity at the arc | 0.5 m/s
- Hood face area | about 0.049 m²
step: at 150 mm: 0.5 × (10 × 0.15² + 0.049) ≈ 0.14 m³/s, about 490 m³/h
step: at 350 mm: 0.5 × (10 × 0.35² + 0.049) ≈ 0.64 m³/s, about 2,300 m³/h
step: moving the hood from 150 to 350 mm away needs nearly five times the airflow
```

```figure
type: bars
title: Airflow needed to capture fume at the arc, by hood distance
unit: m³ per hour, for the hood in the formula above
max: 5000
caption: This is an illustration from the formula above. A typical extraction arm might draw around 1,000 to 1,500 m³ per hour, so beyond about 250 to 300 mm it can no longer capture the fume at this capture velocity.
- 150 mm | 490
- 250 mm | 1213
- *350 mm | 2293
- 500 mm | 4588
```

The arithmetic explains the commonest failure in welding extraction. An arm that captures fume well with its hood 200 mm from the arc does almost nothing at 500 mm, where it would need several times its airflow. Welders move along the work and the arm stays where it was; within a minute the hood is out of range. The control is therefore partly in the equipment and partly in how it is used: arms long enough to reach every part of the work, light enough to move easily, positioned before each weld and moved as the weld moves, and welders trained to see the plume going into the hood. A simple test is to watch the plume: if it rises past the hood rather than bending into it, the hood is too far away.

## On-torch extraction

On-torch extraction draws the fume through a shroud around the gas metal arc or flux-cored torch's nozzle, a few centimetres from the arc, so it captures fume wherever the welder goes, including inside box sections and on large weldments where an arm cannot follow. It needs a high-vacuum, low-volume extraction unit and a heavier, bulkier torch, and its suction must be set so that it does not pull the shielding gas away from the arc, which would cause porosity. Modern designs balance the two well, and welders who have used them for a few weeks often prefer them. The running case's coordinator chose on-torch extraction for the box section work, where no arm could reach.

## General ventilation and make-up air

General ventilation still matters, for the fume that escapes local extraction, for gases such as ozone, and to clear the building. Every cubic metre of air extracted must be replaced by fresh air entering the building, the make-up air. If the building is sealed, extraction systems cannot draw their design airflow, doors become hard to open, and fume from other sources is drawn in. Make-up air is supplied through openings, louvres or a heated supply system, placed so that the fresh air sweeps through the breathing zone without creating draughts that blow the plume away from the extraction hoods.

## Recirculating filtered air

Extraction systems may exhaust fume outside or filter it and return the cleaned air to the building. Returning filtered air saves the heat it would otherwise carry outside, but depends on the filter's efficiency and on its condition; a leaking or overloaded filter returns fume to the workplace. For fume containing carcinogens such as hexavalent chromium, many authorities recommend exhausting outside rather than recirculating. Filters are chosen for the fine particle size of welding fume and changed or cleaned on the maker's schedule, with the dust handled as hazardous waste.

## Testing extraction

Extraction that is not tested may not be working. Fans wear, ducts block with dust, filters load up, dampers are left shut and arms are damaged. Systems are tested at commissioning and at regular intervals: the airflow measured at each hood with an anemometer or a pitot tube in the duct, the capture velocity checked at typical working distances, the plume's behaviour observed with smoke tubes or a direct-reading instrument, and the results compared with the design. The interval is set by the risk and the system; for the running case, every six months for the fixed systems and before each job for mobile units on site.

## Heat carried away

Extracted air that is exhausted outside takes its heat with it, and in winter the make-up air that replaces it must be heated. The cost is easy to estimate.

As an illustration, exhausting 1 m³ of air a second, about 3,600 m³ an hour, when the make-up air must be heated by 15 °C, carries away about 1.2 kg/m³ × 1.0 kJ/(kg·°C) × 15 °C × 1 m³/s ≈ 18 kW of heat. Over 1,000 hours of heating season, that is about 18,000 kWh. Capturing fume close to the arc, with small airflows, keeps this cost down; capturing it far away, with large flows, raises it greatly. That is another argument, beside effectiveness, for getting the hood close.

## Welding in large structures

Large weldments, such as trailer chassis, bridge girders and tanks, are difficult to extract, because the welding moves over a large area and the welder may work inside or underneath the work. A combination is usually needed: on-torch extraction or arms that can be repositioned along the work, portable units for welding inside sections, and good general ventilation for the bay. Where extraction still cannot keep exposures below the standard, respiratory protection is added, as Chapter 5 describes.

## Flanges and enclosure

A hood draws air from behind itself as well as in front, wasting part of its flow. A flange round the hood's face, a flat rim a hood-width or so wide, blocks the air from behind and makes the hood noticeably more effective for the same airflow; a hood resting on or close to a bench or the work, which blocks air from one side, is more effective again. Enclosing the work partly, as a booth or a slotted bench does, is the most effective of all, because the fume has fewer directions to escape in. The general principle is to surround the source as much as the work allows, so that the extraction's air is spent drawing fume rather than room air.

## Ducts and fans

The hood is only the visible end of the system. Ducts must be sized so that the air moves fast enough to keep fume and dust from settling, but not so fast that the resistance and noise become excessive; bends and branches must be gentle; and the fan must be chosen to deliver the design airflow against the system's resistance, including the filter as it loads up. Adding hoods to an existing system without checking the fan often leaves every hood short of air. The coordinator had the chassis bay's new arms designed by a ventilation engineer, who added a variable-speed fan and dampers so that each arm drew its design flow whether one or four were in use.

## Noise and comfort

Extraction that is noisy, draughty or awkward to move will not be used. Arms should move easily and stay where they are put; hoods should not block the welder's view; fans should be placed or silenced so that the extraction does not add much to the shop's noise. On-torch extraction should be light and balanced. The welders' committee tried several arm designs before the shop chose one, on the reasoning that the best arm is the one welders actually move to the work.

## Work outside the shop

Maintenance and site welding, on plant, structures and equipment in place, rarely has fixed extraction. Mobile extraction units with arms, on-torch extraction with a portable unit, and ventilation fans for enclosed areas are taken to the job, and their use is planned in the job's risk assessment. Where none of these can bring exposures down enough, as is common inside vessels and in cramped plant, respiratory protection is used in addition, and confined space controls apply, as Chapters 5 and 8 describe.

## Who looks after the system

Every extraction system needs an owner who knows its design airflows, keeps its maintenance and test records, changes its filters, fixes damaged arms and ducts, and makes sure new work does not overload it. In many shops nobody owns it, and it slowly decays. The coordinator made the maintenance supervisor the owner of all the shop's extraction, with the test schedule in the maintenance system and the results reported to the health and safety committee. Setting Up a Welding Shop by the Numbers covers planning extraction into a new shop's layout, where it is far cheaper than retrofitting.

## Training welders to use it

Extraction works only if it is used well, and using it well is a skill. Welders are shown how the system works, why the hood must be close, how to position it before striking the arc, how to read the plume, and what to do when a system seems weak. The coordinator added a short practical session on extraction to every new welder's induction, and the supervisor's daily rounds include a glance at each hood's position.

## The running case: the chassis bay

This is an illustration. The chassis bay's existing extraction was two fixed hoods on short arms at one end of a 12 m jig, where the welders seldom worked. The coordinator replaced them with four longer arms on a rail along the jig, so that an arm could always be brought within about 250 mm of the arc, and added on-torch extraction for the box sections. The welders were trained to position the arms and watch the plume, and the supervisor checked placement during rounds. Resampling, as Chapter 3 reported, brought the bay's exposures from a geometric mean of about 1.05 times the standard to about 0.3 times.

## A failure: the blocked filter

This is an illustration. At another shop, an extraction system that had worked well at commissioning was never tested again. Over two years its filter loaded up with fume, and its airflow fell to less than half its design. The welders noticed the plume escaping but assumed the system was simply weak.

A fume survey found exposures above the standard at every station the system served. The filter was replaced and the airflow restored, and the shop added the system to its maintenance schedule, with a pressure gauge across the filter that shows when it needs changing and a six-monthly airflow test.

## Exercise: hood distance and airflow

An extraction arm draws about 1,200 m³ an hour through a round hood with a face area of about 0.05 m². Using the formula above, at what distance can it still provide a capture velocity of 0.5 m/s? If a welder habitually leaves the hood about 450 mm from the arc, what capture velocity does it give there?

The arm's flow is 1,200 ÷ 3,600 ≈ 0.333 m³/s. Setting 0.333 = 0.5 × (10x² + 0.05) gives 10x² + 0.05 ≈ 0.667, so 10x² ≈ 0.617 and x ≈ **0.25 m**, about 250 mm.

At 450 mm, the capture velocity is about 0.333 ÷ (10 × 0.45² + 0.05) ≈ 0.333 ÷ 2.08 ≈ **0.16 m/s**, about a third of what is needed. The plume will rise past the hood in any draught. The arm is adequate only if it is kept within about 250 mm of the arc, which means moving it with the work.
