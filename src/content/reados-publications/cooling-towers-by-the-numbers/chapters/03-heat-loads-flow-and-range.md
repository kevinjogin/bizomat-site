---
book: cooling-towers-by-the-numbers
chapterSlug: heat-loads-flow-and-range
order: 3
title: "Heat loads, water flow and range"
description: "Build a tower's duty from its plant: each load's heat, chiller condensers, diversity, flow and range, and catch a list that counted a chiller's cooling, not its heat, and a diversity it never had."
draft: false
---

A cooling tower is selected for a duty: a heat load, a water flow, a hot and cold water temperature and a design wet-bulb. The tower's maker can size a tower for any duty, but only the plant can say what the duty is, and getting it right means listing every piece of equipment that will reject heat to the tower, finding the heat each one actually rejects, deciding how much of it happens at the same time, and working out the water flow each needs. The sum is the tower's heat load; the flow and the load together fix the range. Errors here are made before the tower maker is even contacted, and no amount of care in the selection can correct them.

This chapter builds CT-250's load list, explains why a chiller's condenser rejects more heat than the chiller's cooling capacity, discusses diversity and future growth, and works out the flows and the range. The running case finds that the plant's first load list counted its chiller's cooling capacity instead of its condenser heat and then applied a diversity factor of 0.8 to a plant that runs everything together all summer, so that the tower was nearly selected for 176 kW instead of 250 kW.

## What each load rejects

Each item on the tower's circuit rejects the heat it removes from its own process, plus any heat it adds itself.

- An **oil cooler** on a hydraulic power unit rejects the power lost in the hydraulic system, as *Heat Exchangers by the Numbers* works out for OC-35: about 35 kW for each press here.
- An **air compressor** with a water-cooled aftercooler and oil cooler rejects almost all of its shaft power, because compressing air turns that power into heat: about 30 kW each for the plant's two compressors.
- A **water-cooled chiller** rejects, at its condenser, the heat it removes from the chilled water plus the power its compressor adds.

The last item is the one most often got wrong.

## The chiller's condenser

A chiller pumps heat from its evaporator, where it cools the chilled water, to its condenser, where it rejects that heat to the tower water. Its compressor's power is added to the refrigerant and must also be rejected at the condenser.

```figure
type: formula
title: Heat rejected by a water-cooled chiller's condenser
formula: Q_condenser = Q_cooling + W_compressor = Q_cooling × (1 + 1 ÷ COP)
caption: This is an illustration for the plant's chiller, which delivers 90 kW of cooling to the moulding machines with an illustrative coefficient of performance of 3.0.
- Q_cooling | Cooling capacity delivered to the chilled water, kW
- W_compressor | Compressor power, kW
- COP | Coefficient of performance, Q_cooling ÷ W_compressor
step: W_compressor ≈ 90 ÷ 3.0 = 30 kW
step: Q_condenser ≈ 90 + 30 = 120 kW
step: The tower must reject 120 kW for this chiller, a third more than its cooling capacity
```

A chiller's nameplate and brochure lead with its cooling capacity, because that is what its buyer wants. Its condenser heat, which is what the tower must handle, is in its technical data, and it is always larger, by the compressor's power. [Heat Pumps and Refrigeration by the Numbers](/reados/publications/heat-pumps-and-refrigeration-by-the-numbers/) explains the cycle behind that energy balance.

## CT-250's load list

This is an illustration. With each load's heat rejection and a water temperature rise of 5 K through each, the flows follow from flow = heat ÷ (c_p × ΔT).

```figure
type: compare
title: CT-250's load list at the design condition
cols: Heat to the tower | Water flow at a 5 K rise
caption: This is an illustration. The flows add to the circulating flow and the heats to the tower's load; with every load at 5 K, the mixed return is also 5 K above the supply.
- Press 1 oil cooler, OC-35 | 35 kW | 1.67 kg/s
- Press 2 oil cooler | 35 kW | 1.67 kg/s
- Compressor 1 | 30 kW | 1.44 kg/s
- Compressor 2 | 30 kW | 1.44 kg/s
- Chiller condenser, 90 kW cooling at COP 3.0 | 120 kW | 5.74 kg/s
- *Total | 250 kW | 11.96 kg/s, about 12 L/s
```

The tower's duty is therefore 250 kW at about 12 L/s, with water returning at 34 °C and leaving the tower at 29 °C: a range of 5 K at a design wet-bulb of 24 °C.

## Diversity

Not every plant runs all its heat loads at their peaks at once. An office building's chillers rarely run flat out while every other load does; a factory with batch processes may never have all its machines heating at the same time. A **diversity factor**, the ratio of the actual peak combined load to the sum of the individual peaks, can then reduce the tower's design load. But diversity must be justified by how the plant actually operates, ideally from measured load profiles, and it must allow for the plant's future. A diversity factor applied out of habit to a plant that runs everything together on hot afternoons undersizes the tower on exactly the days it is needed most.

## The running case: the first load list

This is an illustration. The plant's first load list was assembled from equipment brochures. It entered the presses and compressors correctly, but entered the chiller at its headline figure, **90 kW**, its cooling capacity, giving a sum of 220 kW. It then applied a diversity factor of **0.8**, a value the author had used for office buildings, arriving at a design load of **176 kW**.

## The error: the wrong chiller figure and a diversity that did not exist

Both adjustments were wrong. The chiller rejects 120 kW, not 90. And the plant runs two shifts in summer with every press, both compressors and the chiller running continuously, so its diversity on a hot afternoon is close to 1.0. The actual design load is 250 kW, about 42% more than the list's 176 kW.

Using a performance model of the kind Chapter 4 describes, a tower selected for 176 kW at the same 12 L/s and a 5 K approach would, when asked to reject the real 250 kW, deliver cold water at about **30.6 °C** on the design day instead of 29 °C, and about 31.9 °C on a hotter day with a 26 °C wet-bulb. The press oil, which follows the water temperature almost one for one, would run correspondingly hotter, and the chiller, whose efficiency falls as its condenser water warms, would use more power to deliver less cooling.

```figure
type: bars
title: Cold water temperature at the real 250 kW load on the design day, °C, by the load the tower was selected for
unit: °C
max: 32
caption: This is an illustration from the tower model of Chapter 4, with the same 12 L/s and wet-bulb of 24 °C throughout. Each underestimate of the load raises the cold water the tower actually delivers.
- Selected for 176 kW: chiller cooling and 0.8 diversity | 30.6
- Selected for 200 kW | 30.0
- Selected for 220 kW: chiller cooling, no diversity | 29.5
- *Selected for 250 kW, the real load | 29.0
```

The check that caught it was a review of the load list against the equipment's technical data, not its brochures, and a question to production about what runs on a hot afternoon. The fix was the load list above, at 250 kW with no diversity, and the brochure figures were replaced by the technical data sheets in the project file. The general lesson is that a tower's load is the heat each item actually rejects, with chillers counted at their condenser heat, and that diversity is a property of how a particular plant runs, to be shown, not assumed.

## Loads through the day

A tower's design load is a peak; most of the time it carries less. As the plant's load falls with the circulating flow unchanged, the range falls in proportion: at half load, CT-250's range would be about 2.5 K. The tower then has the same water flow and air flow with half the heat to reject, so its cold water falls closer to the wet-bulb. That is good for the equipment, which gets colder water, and it is an opportunity for energy saving, because the fans can slow down while still meeting the cold-water set point, as Chapter 8 shows. A logged load profile, hour by hour over a typical week, is the basis for estimating annual fan energy and annual evaporation, and it is far more useful than the peak alone.

## Temperature limits at each load

Each item on the circuit has its own limits on the water it receives, and the tower's cold-water temperature must suit all of them. The press oil coolers need water cold enough to keep the oil below its maximum working temperature; *Heat Exchangers by the Numbers* shows how OC-35's oil follows the water temperature almost one for one. The compressors' aftercoolers need water cold enough to cool the compressed air and condense its moisture before the air dryers. The chiller's condenser works more efficiently with colder water, but many chillers also have a **minimum** condenser water temperature, below which their refrigerant circuit does not work properly, which matters in winter when the tower can deliver very cold water. The load list should therefore record, for each item, its design flow, its maximum supply temperature and, where it applies, its minimum. The tower's control set point is then chosen to suit them all, and the lowest of the maximums sets the design cold-water temperature.

## Heat recovered before the tower

Every kilowatt recovered from the circuit before it reaches the tower is a kilowatt the tower need not reject, with its share of evaporation, blowdown and fan energy. *Heat Exchangers by the Numbers* follows a heat-recovery exchanger that takes about 35 kW from one press's oil to preheat a parts washer's water. When that exchanger runs, the oil reaching its cooler is already partly cooled, and the tower's load falls by the recovered heat. The load list should show recovered heat as a separate line, because it is available only when both the press and the washer run, and the tower must still be sized for the times when the washer is idle. Heat recovery reduces the tower's annual water and energy use far more than its peak, which is still set by the hours when nothing is being recovered.

## Future growth

A tower is a long-lived asset, and plants grow. A third press, a larger compressor or a second chiller each adds load. Two common approaches are to select the tower with a stated margin for growth, or to choose a modular tower with space and connections for an added cell. Either way, the load list should show the growth separately from the present load, so that the tower's present performance, and the water and energy it uses now, are not confused with a future that may not come. For CT-250, the plant recorded a possible third press, another 35 kW, as future load, and chose a tower model whose next size up could be accommodated on the same base.

## Flow and range

The range and the flow are tied together by the load: range = load ÷ (flow × c_p). For a given load, a higher flow means a smaller range, and a lower flow a larger range. The equipment on the circuit usually sets the flow, through the flows its exchangers need, and the range follows. A tower is selected for that flow and range; if the pumps later circulate more water than the equipment needs, the range falls, the tower's air sees more water per kilogram, and its approach rises, as Chapter 4 shows. Balancing the circuit so that each item gets its design flow, and the pumps deliver the design total, keeps the tower working at the duty it was selected for.

## Writing the duty for the tower maker

The tower maker needs the duty in a form that leaves nothing to guess: the heat load or, equivalently, the circulating flow with the hot and cold water temperatures; the design wet-bulb and the basis for it; the site's altitude; any limits on the tower's footprint, height, noise or plume; the water quality available for makeup; and the operating pattern, including the minimum load and the winter conditions. For CT-250, the plant's enquiry gave 12 L/s from 34 °C to 29 °C at a 24 °C wet-bulb, the future third press as a separate line, a sea-level site, a noise limit at the boundary, and town water for makeup. A maker who receives "a 250 kW tower" can only guess at the rest, and two makers' guesses will not be comparable.

## Measuring the load

On an existing plant, the tower's load can be measured from the circulating flow and the temperatures of the water returning to and leaving the tower: load = flow × c_p × range. With a range of only 5 K, the temperature sensors must be accurate and matched, as *Heat Exchangers by the Numbers* recommends for small temperature changes. Logged over a hot week, the measured load shows the plant's real peak and its diversity, which is the best evidence for sizing a replacement or an extension, far better than a sum of nameplates or a brochure's headline figure.

## Exercise: the third press

If the third press is added, with another 35 kW oil cooler needing about 1.67 kg/s at a 5 K rise, what are the new load, flow and range? If the existing tower's characteristic is unchanged and it simply receives the extra flow and heat, would you expect its cold water to rise or fall, and why?

**Worked answer.** The load becomes 250 + 35 = **285 kW**, the flow about 11.96 + 1.67 = **13.63 kg/s**, and the range stays 285 ÷ (13.63 × 4.18) ≈ **5.0 K**, because the new load has the same 5 K rise as the others.

The cold water rises. The tower now has more water and more heat for the same air flow, so its liquid-to-air ratio rises and each kilogram of air must carry away more heat, which needs a larger enthalpy difference between water and air: the water runs warmer. Chapter 4's model would put a number on it; the direction alone tells the plant that the third press needs either a larger tower or the added cell its base was designed for.
