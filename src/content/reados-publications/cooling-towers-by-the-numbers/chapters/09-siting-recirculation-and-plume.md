---
book: cooling-towers-by-the-numbers
chapterSlug: siting-recirculation-and-plume
order: 9
title: "Siting, recirculation and plume"
description: "Place a tower where it breathes fresh air: recirculation, interference from other plant, clearances, plume and neighbours, and catch a courtyard site that raised the inlet wet-bulb by 1.5 K."
draft: false
---

A cooling tower's performance is calculated from the wet-bulb of the air entering it, and that is only the site's wet-bulb if the tower is breathing fresh air. A tower placed where its own warm, saturated exhaust can drift back into its inlets, or where another machine's warm exhaust is drawn in, works with warmer, wetter air than its design assumed, and its cold water rises. The same placement decisions affect where the tower's plume and drift go, who hears its fan, and whether its exhaust reaches a building's air intakes, which Chapter 7 showed is a health matter. Siting is the cheapest performance decision a plant ever makes about a tower, because it costs nothing extra if made early and a great deal to correct later.

This chapter explains recirculation and interference, estimates their effect on the inlet wet-bulb and the cold water with the model of Chapter 4, sets out the clearances and layouts that avoid them, and covers plume, noise and the neighbours. The running case finds that CT-250's first proposed site, a courtyard between the factory and its offices, would have drawn back about 15% of its own exhaust and 20% of its inlet air from the compressor room's ventilation, raising the effective inlet wet-bulb by about 1.5 K on the design day.

## Recirculation

A tower's exhaust leaves nearly saturated, at an enthalpy well above the incoming air's: for CT-250 at its design point, about 97 kJ/kg against about 72 kJ/kg. If some of that exhaust is drawn back into the tower's inlets, the air entering is a mixture, and its enthalpy, and so its effective wet-bulb, is raised.

```figure
type: formula
title: Effective inlet enthalpy with recirculation and interference
formula: h_in = (1 − r − i) × h_ambient + r × h_exhaust + i × h_other
caption: This is an illustration for CT-250 on the design day, with ambient air at about 71.4 kJ/kg, exhaust at about 97 kJ/kg and the compressor room's ventilation air at about 81.7 kJ/kg (45 °C with the ambient moisture). The effective inlet wet-bulb is the saturation temperature at h_in; the tower model then gives the cold water.
- r | Fraction of the inlet air that is recirculated exhaust
- i | Fraction drawn from another source, such as a ventilation exhaust
- h | Enthalpy of each stream, kJ/kg
step: Recirculation alone at 10%: inlet wet-bulb about 24.7 °C; cold water about 29.5 °C
step: Recirculation alone at 15%: inlet wet-bulb about 25.1 °C; cold water about 29.8 °C
step: 15% recirculation plus 20% compressor-room air: inlet wet-bulb about 25.5 °C; cold water about 30.1 °C
```

Because the recirculated exhaust also raises the tower's own exhaust temperature, the effect builds on itself, and the calculation above iterates until the inlet and exhaust are consistent with each other.

## What causes recirculation

Recirculation is caused by the tower's surroundings and the wind. Walls, buildings and screens close to the tower's inlets trap air and let the exhaust plume, pushed down by the wind on its lee side, drift back to the inlets. Inlets facing a nearby wall draw air from a confined space that the exhaust can reach. Towers placed side by side, or in a row across the prevailing wind, can draw each other's exhaust, called **interference**. And towers in a pit, a courtyard or under a roof overhang are prone to all of these. Induced-draught towers, which discharge their exhaust upwards at speed, are less prone than forced-draught towers, whose exhaust leaves slowly from the top; extending the fan stack raises the discharge further.

## The running case: the courtyard site

This is an illustration. The first plant layout placed CT-250 in a courtyard between the factory wall and the office wing, enclosed on three sides, to keep it out of sight from the street. The compressor room's ventilation fans discharged warm air into the same courtyard. On the design day, an analysis by the tower maker's siting guidance and a simple wind study suggested that about 15% of the tower's inlet air would be its own exhaust and about 20% would be the compressor room's warm discharge.

## The error: a sheltered site that cooked its own air

With those fractions, the effective inlet wet-bulb on the design day rises from 24 °C to about **25.5 °C**, and the tower's cold water from 29 °C to about **30.1 °C**. On a hotter, more humid afternoon at a 26 °C wet-bulb, the courtyard tower would deliver about 31.6 °C, against about 30.5 °C in the open. Every load on the circuit, the press oil, the compressors and the chiller's condenser, would run about a kelvin warmer than designed, all summer.

```figure
type: bars
title: CT-250's cold water on the design day, by site, °C
unit: °C
max: 31
caption: This is an illustration from the tower model. The courtyard's recirculation and the compressor room's discharge together cost about 1.1 K of cold water, which would have needed a tower with about a third more transfer capability to recover.
- Open site, fresh air | 29.0
- Open site with 10% recirculation | 29.5
- *Courtyard: 15% recirculation and 20% compressor-room air | 30.1
```

The courtyard had a second problem: the office wing's outside air intake was on the courtyard side, about 15 m from the proposed tower and downwind in the prevailing summer wind, where the tower's exhaust and drift would reach it. The check that caught both was a siting review against the tower maker's clearance guidance and the risk assessment of Chapter 7. The tower was moved to an open area on the factory's roof, away from walls and from any air intake, with the compressor room's discharge redirected away from it. The general lesson is that a tower must breathe fresh air and discharge where its exhaust cannot return or reach people, and that a site chosen to hide the tower usually does neither, however tidy it looks on the plan.

## Clearances and layout

Tower makers publish siting guidance for their products: minimum distances from walls to the air inlets, recommended orientations to the prevailing wind, spacing between multiple towers, and the height of surrounding walls or screens that their units tolerate. As a general pattern:

- inlets should face open space, with clearances to walls at least as the maker specifies, often related to the tower's height;
- multiple towers should be arranged so that one's exhaust is not drawn into another's inlet, usually in a line parallel to the prevailing wind rather than across it;
- the discharge should be at least as high as nearby walls or parapets, with an extended stack if needed;
- screens for appearance or noise should be open enough not to restrict the inlet air, and set back from the inlets;
- other heat sources, such as air-cooled condensers, kitchen or process exhausts and ventilation discharges, should be kept away from the inlets.

## Wind on the design day

Recirculation depends on the wind, so the wind on the hours that matter is worth knowing. The site's climate data give the wind's direction and speed by season and time of day, often summarised as a **wind rose**, and the hot, humid afternoons that set a tower's design are often dominated by one direction, such as an afternoon sea breeze on the coast. A tower whose inlets face that wind, with nothing upwind to trap air, breathes fresh air on the days it works hardest. A tower whose exhaust is blown onto a building or a wall in that wind recirculates on exactly those days. The same wind data show where the plume and drift will go, which locates the tower relative to air intakes and public places, and where the fan's noise will carry.

## Access, structure and services

A tower's site must also suit its practical needs. Its operating weight, full of water, must be carried by the structure, which on a roof means a structural engineer's check of the slab or steel. Every part that must be inspected and cleaned, fill, eliminators, nozzles, basin, fan and gearbox, needs safe access, with platforms, ladders and isolations, because maintenance that is hard to do is maintenance that is not done, as Chapter 7 warned. The site needs a makeup water supply with backflow prevention, a drain for blowdown and basin cleaning, power and controls for the fan and the dosing equipment, and space for the chemical storage of Chapter 6, bunded and away from the air inlets. A site that suits the airflow but not these needs will be compromised later, usually by improvisation.

## A siting checklist

```figure
type: checklist
title: Checks before fixing a tower's position
caption: This is an illustration of a siting review; the tower maker's guidance and the jurisdiction's requirements add their own items.
- Inlets | Clear of walls and screens by at least the maker's clearances
- Discharge | Above nearby walls and parapets; stack extended if needed
- Other heat sources | No ventilation, condenser or process exhaust near the inlets
- Air intakes and people | No building intake, window or public area downwind in the prevailing winds
- Noise | Checked at the nearest neighbour at the speeds the tower will run
- Structure and access | Operating weight checked; safe access to every maintained part
- Services | Makeup with backflow prevention, drainage, power, chemical storage
- x Hidden in a courtyard for appearance | The site this chapter's error rejected
```

## When the site changes

A tower sited well can be compromised later by changes around it: an extension built beside it, a new screen added for appearance, a neighbour's building, or a new air intake or opening window installed downwind of it. Each can create recirculation or exposure that the original siting avoided. The tower's risk management plan, reviewed as Chapter 7 describes, should consider changes to its surroundings as well as to the tower itself, and the plant's process for approving building works should include a check against the tower's siting. A tower that slowly loses performance year after year, while its own condition is good, may be telling the plant that its surroundings have changed.

## Measuring recirculation on site

Recirculation can be measured rather than estimated. The simplest test compares the wet-bulb temperature of the air actually entering the tower's inlets with the wet-bulb of fresh air measured well upwind, at the same time. With an aspirated psychrometer or a calibrated humidity sensor, readings taken at several points around each inlet face, and repeated in different wind directions, show where the inlet air is warmer and wetter than ambient and by how much. This is an illustration. If CT-250's inlets averaged a wet-bulb of 24.7 °C while fresh air upwind read 24.0 °C, the model of this chapter would put the recirculation at roughly 10%. A difference that appears only in one wind direction points to a particular wall or neighbouring source; a difference in every direction points to the tower's own discharge being too low.

The test also matters for performance testing. Chapter 10's capability test is based on the inlet wet-bulb, and a test that measures only the ambient wet-bulb, upwind, would charge the tower with a loss that is really the site's. Acceptance test codes for towers specify where the inlet wet-bulb is measured for exactly this reason.

## Retrofitting a poor site

Where a tower is already badly sited and cannot be moved, several measures reduce recirculation: an extended fan stack, which raises the discharge above the surrounding walls; removing or opening up screens and walls near the inlets; relocating nearby exhausts, as the compressor room's discharge was relocated for CT-250; and, for multiple towers, adding a solid partition between their inlets so that one cannot draw the other's exhaust. Each measure's effect can be checked with the inlet wet-bulb test above, before and after the change is made. The cost of such retrofits is usually far less than the cost of the larger tower that would otherwise be needed to make up the lost performance, which for the courtyard site in this chapter's error was about a third more transfer capability.

## Plume

A tower's exhaust is nearly saturated, and when it meets cooler air it forms a visible plume of condensed water droplets. Plumes are most visible on cool, humid days, early mornings and at night, and can be alarming to neighbours who mistake them for smoke or steam. They can also reduce visibility on nearby roads, wet nearby surfaces and, in cold climates, cause icing. Where plume visibility matters, towers can be fitted with plume abatement, which warms or dries the exhaust before it leaves, at a cost in equipment and energy. For most Australian industrial sites, careful placement and a high discharge are enough, together with a word to the neighbours before the tower starts, explaining that the white plume they will see on cool mornings is water vapour.

## Neighbours: noise and drift

The tower's fan and its falling water make noise, and the noise reaches neighbours. *Machine Noise Control by the Numbers* sets out how a source's sound power, distance and barriers combine at a receiver; a tower's sound power at its operating speeds comes from its maker, and the environmental noise limits that apply come from the jurisdiction's environment protection authority and local council. Siting the tower away from boundaries and with its quieter sides towards neighbours, and controlling the fan speed at night as Chapter 8 discussed, keep noise within limits. Drift, discussed in Chapter 7, settles downwind, carrying treatment chemicals and, if controls fail, bacteria: a tower should not be sited upwind of car parks, outdoor eating areas or public walkways where drift can settle on people and vehicles.

## Exercise: a taller stack

At the open roof site, a residual recirculation of about 5% remains in some wind directions. Using the model's results above, what would the inlet wet-bulb and cold water be on the design day? If a taller fan stack reduced the recirculation to near zero, what would it recover?

**Worked answer.** At 5% recirculation, the model gives an inlet wet-bulb of about **24.3 °C** and cold water of about **29.2 °C**, about 0.2 K above the design 29 °C.

A taller stack that removed the recirculation would recover that 0.2 K. Whether it is worth its cost depends on the margin the plant needs: 0.2 K is small compared with the effect of fouled fill or a poor water treatment programme, which can cost a kelvin or more. The calculation lets the plant spend on the improvement that recovers the most performance, which in this case is good maintenance rather than more steel, a conclusion that holds for most towers on reasonably open sites.
