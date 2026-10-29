---
book: condensation-control-by-the-numbers
chapterSlug: seal-vent-ventilate-or-heat
order: 4
title: "Seal, vent, ventilate or heat: choosing the strategy"
description: "What an IP rating does and does not say about humidity, and how sealing, venting, fan ventilation and heating each change the dew point and the surfaces inside an enclosure."
draft: false
---

There are only four things a designer can do about condensation in an enclosure. Keep the moist air out by sealing. Let air in and out slowly, through a vent that blocks liquid water and dust. Change the air quickly, with a fan, so the inside follows the outside. Or keep every surface inside warmer than the dew point, with heat. Desiccants are a fifth option for small sealed boxes, and they are the subject of Chapter 6.

Each strategy has a range of conditions where it works and a failure mode when it is used outside that range. This chapter explains what an IP rating actually tests, compares the four strategies by what they do to the dew point and to the surfaces, calculates the ventilation CC-7 needs in daytime, chooses a strategy for PS-7, and describes the fan that made things worse.

## What an IP rating says

The IP code, set out in AS 60529, describes an enclosure's protection against the entry of solid objects and dust (the first digit) and against water (the second digit). CC-7's IP55 means dust-protected, which allows some dust in but not enough to interfere with the equipment, and protected against water jets from any direction. IP66 means dust-tight and protected against powerful jets; IP67 adds protection against temporary immersion.

The tests behind those digits are short. They spray, hose or dip the enclosure and then look for water inside. They do not test what happens over months of temperature cycles, they do not measure the exchange of air or vapour, and they say nothing about condensation. An IP66 enclosure can still breathe through its gaskets as it warms and cools, and it can still draw air up an unsealed conduit. A high IP rating is necessary to keep out rain and hose water, but it is not a humidity specification.

There is also a trap in sealing well. An enclosure that keeps liquid water out also keeps condensed water in. A cabinet with good seals and no drain can slowly fill its bottom with condensate that has nowhere to go, because water vapour gets in more easily than liquid water gets out. Most good outdoor enclosures therefore combine tight seals with a deliberate, controlled opening.

## The four strategies

```figure
type: compare
title: Four strategies against condensation in an enclosure
cols: What it does to the inside dew point | What it does to surfaces | Fails when
rowhead: Strategy
caption: General characteristics. Every strategy except heating leaves the inside dew point at or near the source air's, so it relies on the surfaces staying warm by some other means.
- Seal tightly | holds the dew point of the air sealed in, if truly sealed | nothing | the enclosure is opened, breathes through its seals, or has a path to a wetter space
- Vent through a membrane | follows the outside slowly, by breathing and diffusion | nothing; liquid water and dust are kept out | surfaces fall below the outside dew point, as at night
- Ventilate with a fan | follows the source air within minutes | brings surfaces close to the air temperature | the source air is humid and surfaces are colder than the air
- *Heat | unchanged | keeps surfaces above the dew point | the heater stops, is too small, or a surface is outside its reach
```

### Sealing

Sealing works for small enclosures that can be made genuinely airtight: welded or potted housings, enclosures with O-ring seals and sealed connectors, and boxes filled with dry gas. It fails for large cabinets with doors, because every door seal breathes a little under the pressure swings of Chapter 3, and every opening of the door replaces the dry air with whatever air is around at the time. For a sealed box, the water it holds is the water sealed in plus whatever breathing and permeation bring over its life, which is exactly what a desiccant is sized to absorb.

### Venting through a membrane

A membrane vent is a small plug with a microporous membrane, usually expanded PTFE, that passes air and water vapour but blocks liquid water and dust. It equalises pressure, so the seals are not stressed by the vacuum of Chapter 3, and it lets water vapour out as well as in. Over time the inside dew point follows the outside dew point, but slowly. Vents work well in enclosures whose inside surfaces stay warm, because the enclosure dissipates heat continuously, and in climates where nights are not humid. They do not stop condensation on a surface that falls below the outside dew point.

Where a vent goes matters. Fitted high on the enclosure, away from direct spray and under the canopy, it breathes the enclosure's warmest air out and outside air in. Fitted low, over a wet floor or a pit, it breathes the wettest air available, which is the conduit problem of Chapter 3 in a tidier form. Makers rate their vents by the airflow they pass at a stated pressure difference, and the useful check is whether that flow can equalise the breathing volume, about 21 litres per cooling for CC-7, quickly enough to keep the seals from being loaded. A vent that is too small leaves the seals doing the breathing, and one that is far too large behaves like an open hole.

A related device is a simple **drain** at the lowest point. It does nothing to stop condensation but lets the water that forms run out, rather than collecting on the gland plate.

### Ventilating with a fan

A fan forces air through the enclosure, typically through a filter at the bottom and out through a grille at the top. Its purpose is usually to remove heat, not water. Ventilation makes the inside air almost identical to the outside air in both temperature and dew point, which is excellent during a hot day, when the enclosure's contents are warmer than the air. It is a problem at night, when the enclosure's surfaces cool below the air by radiation: the fan then supplies an endless stream of moist air to the cold surfaces.

The [enclosure cooling airflow tool](/tools/enclosure-cooling-airflow/) sizes a ventilation fan from the heat given off inside, the highest outside and allowed inside temperatures, the enclosure's surface area and a wall heat-transfer coefficient. It calculates the heat lost through the walls, the heat left for the fan to remove, and the airflow needed to carry it at the allowed temperature rise.

### Heating

A heater does not change the inside dew point; Chapter 1 explained why. It works by keeping the inside surfaces above the dew point and the relative humidity at the components low. It is the only strategy that copes with humid nights and cold surfaces at the same time, and it is the main subject of Chapter 5. Its weaknesses are that it uses energy, that it can only warm surfaces the warm air reaches, and that it depends on a control that switches it on when it is needed.

## CC-7 in daytime: it needs ventilation

This is an illustration. CC-7's drive and controls dissipate 310 W while the pump runs. Its surface exposed to air is 3.20 m², taken as both sides, the front, the back and the top, and its wall heat-transfer coefficient is the maker's figure for painted steel of 5.5 W/m²·K, so the walls pass 17.6 W for every kelvin of difference. Without a fan, the inside settles about 310 ÷ 17.6 = **17.6 K** above the outside air: 46.6 °C on a 29 °C afternoon and **52.6 °C** on a 35 °C day. The drive's maker allows 45 °C ambient for full output, in this illustration, so CC-7 needs ventilation in daytime whatever is done about condensation.

```figure
type: formula
title: Ventilation airflow for CC-7 on a 35 °C day
formula: Q = (P − A k ΔT) ÷ (ρ c_p ΔT)
caption: This is an illustration. The calculation follows the enclosure cooling airflow tool. Air density 1.16 kg/m³ and specific heat 1.005 kJ/kg·K.
- P | heat given off inside, 310 W
- A k | surface area times wall coefficient, 3.20 × 5.5 = 17.6 W/K
- ΔT | allowed rise, 45 − 35 = 10 K
step: wall loss = 17.6 × 10 = 176 W; heat for the fan = 310 − 176 = 134 W
step: Q = 134 ÷ (1.16 × 1,005 × 10) = 0.0115 m³/s = 41.4 m³/h
```

A filter fan delivering at least 41 m³/h at its working pressure, with its filters and grille fitted, holds CC-7 at or below 45 °C on a 35 °C day. A fan's rated free-air flow is usually well above its flow once filters are fitted, so the selection is made from the maker's curve at the actual system pressure, not from the headline figure.

### The sun adds to the load

The calculation above ignores the sun, and outdoors that is optimistic. On a clear summer day the sunshine falling on a horizontal surface can approach 1,000 W/m², the reference irradiance used to rate solar panels. A painted surface absorbs a share of it that depends on its colour, and that share is its **solar absorptance**, which unlike its infrared emissivity does depend on colour: dark finishes absorb most of the sun, light ones much less. Assume, for the illustration, that CC-7's light grey powder coat absorbs half. Its 0.32 m² roof would then take in up to about 1,000 × 0.32 × 0.5 = **160 W** at midday, half as much again as the drive's own losses, and the sunlit side adds more in the afternoon.

That is why the canopy chosen in Chapter 2 for its night-time effect earns its place in daytime too. A canopy with an air gap above the roof intercepts the sunshine and sheds most of the heat it absorbs to the moving air, so the cabinet roof sees a warm-ish sheet rather than the sun. The same canopy that keeps the roof from seeing the cold night sky keeps it from seeing the hot day sky. Side sun shields on the west face do the same for the afternoon sun. Fitting them is usually cheaper than fitting a larger fan, and they reduce the time the fan runs and therefore the time the cabinet is breathing outside air at a high rate.

## The strategy for PS-7

Putting Chapters 2, 3 and this chapter together gives CC-7's strategy:

- **Seal the paths that lead somewhere wetter.** The conduits to the pit are sealed at both ends, and every cable gland is checked for grip on its cable.
- **Shade the roof.** A canopy keeps the roof from radiating to a clear sky, so heat can keep it above the dew point.
- **Ventilate by day, on a thermostat.** A filter fan at the bottom and an exhaust grille near the top run only when the inside air is above about 35 °C, which happens only while the drive is running.
- **Heat by night, on a hygrostat.** A fan heater keeps the inside air well above the outside air whenever the inside relative humidity rises, as Chapter 5 sizes.
- **Drain the bottom.** A small drain at the lowest point lets any water that does form leave the cabinet.

```figure
type: decision
title: Which strategy suits an enclosure?
question: What are the enclosure's size, heat and surroundings?
caption: General guidance only. Many outdoor enclosures, like CC-7, need two strategies at different times of day, with controls that keep them from working against each other.
- Small, can be made airtight, little heat | instrument boxes, sensors, battery boxes | seal it, and size a desiccant for its life (Chapter 6)
- Moderate heat, mild nights, no cold surfaces | indoor panels, shaded enclosures | vent through a membrane and fit a drain
- *Large, outdoors, humid nights, heat by day | pump station and roadside cabinets | ventilate by day on a thermostat, heat by night on a hygrostat, shade the roof
- Cold surfaces that cannot be warmed | cold pipes, chilled equipment | insulate with a vapour barrier, and drain (Chapter 7)
```

## Controls that work together

Two strategies in one enclosure need controls that agree with each other. CC-7 ends up with four control devices, and their settings are chosen together rather than one at a time.

```figure
type: steps
title: CC-7's climate controls, in order of priority
caption: This is an illustration. The settings are chosen so that the fan and heater never fight, and so that each fails safe in the direction that protects the drive.
- Over-temperature alarm | inside air above 50 °C raises an alarm to telemetry; the drive's own protection acts at its limit
- Ventilation fan thermostat | fan on above 35 °C, off below 30 °C; runs only while the drive's heat requires it
- * Heater hygrostat | heater on above 65% RH inside, off below 55%; blocked while the fan runs
- Heater safety thermostat | heater off above 40 °C inside air, whatever the hygrostat asks
- Logging | inside temperature, RH and dew point, outside dew point, fan and heater run hours
```

The differential between switch-on and switch-off points stops the devices cycling every few minutes. The interlock between the fan and the heater matters most, because without it the heater warms air that the fan is busy replacing with cool, humid outside air. Logging the run hours of each device turns the controls into a check on themselves: a fan that runs at night, or a heater that never runs on a humid night, shows up in a week of data, as the next section describes.

## The error: a fan that ran all night

This is an illustration. When CC-7's ventilation fan was installed, it was wired to run whenever the drive's supply was on, which at PS-7 meant all the time. The contractor reasoned that more ventilation could only help. The first summer, the water on the drive came back, and on some mornings it was worse than before the fan was fitted.

The telemetry gave the clue: the inside dew point now matched the outside dew point to within a few tenths of a kelvin at all hours, and the inside air temperature at night was the same as the outside air, not 1.7 K above it. The fan was replacing CC-7's air a couple of hundred times an hour. With the inside air now at outside temperature and the fan stirring it, the roof's inner face settled at about 14.5 °C on clear nights, 4.7 K below the dew point, and the fan delivered an unlimited supply of moist air to it. The heat-and-mass-transfer estimate of Chapter 2 gives about 100 g per square metre per hour at that roof temperature, which is potentially a few hundred grams on CC-7's roof in a night, against the few grams the closed cabinet had produced.

The fan was rewired through a thermostat set at 35 °C, so it ran only when the drive made it necessary. An interlock was added so that the fan and the anti-condensation heater can never run together; otherwise the heater would warm air that the fan immediately replaced. The business added a line to its design checklist: every fan and every heater needs a control that says when it must not run, as well as when it must.

## Exercise: a hotter design day

The utility's engineer asks what fan CC-7 would need if the design day were 38 °C rather than 35 °C, with the same 45 °C inside limit. Use the same heat load, area, wall coefficient and air properties.

**Worked answer.** The allowed rise is now 45 − 38 = 7 K. The walls pass 17.6 × 7 = **123.2 W**, leaving 310 − 123.2 = **186.8 W** for the fan. The airflow needed is 186.8 ÷ (1.16 × 1,005 × 7) = 0.0229 m³/s, or **82.4 m³/h**, about twice the airflow needed for a 35 °C day. A 3 K change in the design day doubles the fan, because it both cuts the heat the walls can shed and narrows the temperature rise the air is allowed. In hot regions, a sun shield or canopy that cuts the solar load can matter as much as the fan itself, and CC-7's canopy does double duty for that reason.
