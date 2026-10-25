---
book: setting-up-a-welding-shop-by-the-numbers
chapterSlug: fume-and-ventilation
order: 5
title: "Fume extraction and ventilation"
description: "Plan fume control for a new shop, size a capture hood's airflow at each distance from the arc, choose between extraction arms, mobile units and on-gun extraction, and keep it working."
draft: false
---

Welding fume is the hazard a new shop is most likely to underestimate, because it is always there and rarely dramatic. Every arc produces a plume of fine metal oxide particles and gases, and in a closed unit with two welders working all day, that plume spreads through the building unless it is captured at the source. The International Agency for Research on Cancer, in an evaluation made in 2017 and published as Volume 118 of its monographs, classified welding fumes as carcinogenic to humans, and the work health and safety regulators require businesses to control exposure. Fume control is therefore part of setting up the shop, not an extra to add later.

This chapter plans the fume controls for Mara's shop, sizes a capture hood using a standard ventilation formula, compares extraction arms, mobile units and on-gun extraction, and sets out how to keep the system working. Safe Work Australia's model code of practice for welding processes, as adopted in each jurisdiction, sets out the duties and the controls for welding fume.

## The order of controls

The code follows the usual hierarchy of control: eliminate or reduce the hazard first, then isolate it, then engineer it away, then use administrative controls, and finally rely on personal protective equipment for what remains. Arc Welding by the Numbers works through the hierarchy for a welding shop in its chapter on [fume, radiation and electrical safety](/reados/publications/arc-welding-by-the-numbers/fume-radiation-and-electrical-safety/), including the fresh air needed to dilute one welder's fume. For a new shop, the important point is that local exhaust ventilation, capturing the fume at the arc before it reaches the welder's breathing zone or spreads through the building, is the main engineering control, and it must be planned into the layout and the power supply from the start.

## What the fume is

Welding fume is mostly fine particles of metal oxides, formed when metal vapour from the arc condenses and oxidises in the air, together with gases such as ozone, nitrogen oxides and carbon monoxide. Its make-up depends on the process, the consumable and the metal. Flux-cored wire and manual metal arc electrodes generally produce more fume than solid wire, because of their fluxes. Stainless steel fume contains chromium and nickel compounds that are of particular concern. Galvanised and painted steel add zinc oxide and the decomposition products of the coating. The safety data sheet for each consumable lists its hazardous fume components, and a shop that welds stainless steel or coated material needs to plan for them specifically, not just for "fume".

## Planning extraction into the layout

Extraction is far easier to install when the layout is being planned than after the benches and racks are in. A fixed arm needs a wall or column within reach of the work, a route for its duct to outside or a place for its filter unit, and a power outlet for its fan. A mobile unit needs floor space to park and room to move round the trailer bay. Mara marked both on her layout drawing (Chapter 2) and gave their fans to the electrician with the other loads (Chapter 3), so that the outlets were in the right places and the supply could carry them.

## Heat, cold and comfort

Ventilation affects comfort as well as fume. A closed metal unit in summer, with welding arcs and a low roof, becomes very hot, and hot welders work slower, make more mistakes and are more likely to push their helmets up or move the hood away for a breath of air. In winter, extraction that discharges outside pulls in cold air, and welders close doors and switch off fans to stay warm. A plan that considers both, with roof fans and an open door in summer and filtered recirculating extraction for winter, is more likely to be used every day than one that is uncomfortable for half the year.

## Capturing fume at the arc

A capture hood works by drawing air past the arc fast enough to pull the plume in before it rises past the hood. The air speed needed at the arc, called the capture velocity, depends on how much the plume rises and how much the surrounding air moves; for welding fume, hood makers and ventilation guidance commonly use values in the order of 0.5 m/s at the point of welding. The air speed a hood produces falls off very quickly with distance from its face. A standard formula used in industrial ventilation for a plain, unflanged opening relates the airflow Q to the capture velocity V at a distance x in front of the hood and the hood's face area A.

```figure
type: formula
title: Airflow a plain hood needs to capture fume at a distance
formula: Q = V × (10 × x² + A)
caption: This is an illustration using the standard capture formula for a plain opening, with a capture velocity of 0.5 m/s and a hood face of 0.03 m². A flange round the hood reduces the airflow needed by about a quarter. The extractor maker's data govern each product.
- V, capture velocity at the arc | 0.5 m/s
- x, distance from hood face to the arc | 0.3 m
- A, hood face area | 0.03 m²
step: Q = 0.5 × (10 × 0.09 + 0.03)
step: Q = 0.5 × 0.93 ≈ 0.47 m³/s, about 1,670 m³/h
```

The striking feature of the formula is the x² term. Doubling the distance from the hood to the arc roughly quadruples the airflow needed.

```figure
type: bars
title: Airflow needed to capture fume at different hood distances
unit: m³/s of airflow
max: 5.5
caption: This is an illustration from Q = V × (10x² + A) with V = 0.5 m/s and A = 0.03 m². A typical extraction arm might move around 0.3 to 0.5 m³/s; beyond about 0.3 m, it cannot capture fume at this velocity at all.
- 0.15 m from the arc | 0.13
- *0.30 m from the arc | 0.47
- 0.45 m from the arc | 1.03
- 0.60 m from the arc | 1.82
- 1.00 m from the arc | 5.02
```

The practical lesson is the most important in this chapter. An extraction arm that captures fume well when its hood is a hand's width or two from the arc captures almost nothing when it is left a metre away. Positioning the hood, and moving it as the weld progresses, is the welder's job, and it decides most of the welder's exposure.

## Extraction arms

A fixed extraction arm, mounted on a wall or column, with a hood on an articulated arm and a fan and filter or a duct to outside, is the usual choice for a fixed welding bay. It suits the welding table, where the work is in a known place and the arm can reach it. Mara planned one arm at the welding bay, reaching the fixture table, with its fan sized by the supplier for the hood and duct length. Where the fan discharges outside, the extracted air must be replaced by fresh air entering somewhere else, which in a closed unit in winter may mean cold draughts; where it recirculates through a filter, the filter must be suited to welding fume and maintained.

## Mobile extractors

A mobile extractor, a filter unit on wheels with its own arm or hose, can be moved to the work. It suits the trailer bay, where the weld moves round a large job, and repair work at different places on the floor. Its arm or hose is shorter than a fixed arm's reach, so it is moved more often, and its filter fills faster when used on heavy flux-cored welding. Mara budgeted for one mobile unit for the trailer bay and the repair bay, moved between them as needed. She chose a unit with a filter suited to welding fume and a gauge that shows when the filter needs changing, because a mobile unit with a clogged filter looks exactly like one that works.

## On-gun extraction

Some wire welding guns have extraction built in, with a shroud round the nozzle connected through a hose to a high-vacuum extractor. Because the extraction point moves with the arc, it is always close, which is its great advantage; the hood distance problem disappears. The disadvantages are a heavier, bulkier gun, the risk of disturbing the shielding gas if the extraction is set too strong, and the cost of the extractor. For a shop welding mostly flux-cored wire on large jobs, where arms are always being moved, on-gun extraction can be the most effective control. Mara planned to trial one before deciding.

## General ventilation

Local exhaust captures most of the fume, but not all, and the rest spreads into the shop. General ventilation, roof fans, wall fans or the open roller door, dilutes it and removes heat. This is an illustration. Mara's unit, 240 m² with an average height of about 6 m, holds about 1,440 m³ of air. A pair of roof fans moving 6 m³/s between them would change the air about 6 × 3,600 ÷ 1,440 = **15 times an hour**. General ventilation does not replace local exhaust, because the fume reaches the welder's breathing zone before it is diluted, but it keeps the background level down and makes the shop more comfortable in summer.

## Plasma cutting and grinding

Welding is not the only source. Plasma cutting produces large volumes of fume and fine dust, especially on thick or coated plate, and a plasma table should have a downdraft or water table with its own extraction; hand plasma cutting needs local extraction like welding. Grinding produces dust that settles on everything and is a hazard in its own right. Mara's plan gave the plasma cutter its own position near the extraction and put the grinding area where its dust could be swept and cleaned easily.

## Respiratory protection

Where local exhaust cannot reduce exposure enough, respiratory protection is the last line of defence, and the risk assessment decides when it is needed. Powered air-purifying respirator welding helmets, which blow filtered air into the helmet, are common in fabrication shops, especially for heavy flux-cored welding and work in confined spaces, and many welders find them more comfortable than the alternative because they cool the face. They need fit, filters and maintenance, and they protect only the wearer, not the people nearby.

## Keeping it working

Fume control equipment loses performance quietly. Filters load up and reduce airflow; ducts collect dust; arms sag and are left out of position; fans wear. The fabricator in Welder Training by the Numbers found its trainees' exposure depended mostly on hood position; a new shop will find the same. Mara's maintenance plan for the extraction includes checking the filter pressure gauge weekly, changing filters as the maker specifies, checking that each arm holds its position, and having the airflow measured at the hood once a year by the supplier, with the result recorded. Workplace air monitoring, if the risk assessment calls for it, checks that the controls are actually achieving acceptable exposure.

## The cost of fume control

This is an illustration. Mara's quotes for fume control were about A$4,500 for the fixed arm with its fan and filter, installed, and about A$5,500 for a mobile extractor, both excluding GST, with filters at a few hundred dollars a year. An on-gun extraction system, if the trial succeeded, would add about A$6,000. Fume control is therefore about A$10,000 to A$16,000 of the equipment budget in Chapter 6, a significant share, and the fans also add to the power demand in Chapter 3. None of it is optional.

## A failure: the arm across the room

This is an illustration. Six weeks after opening, Mara noticed a haze hanging under the roof by mid-afternoon and Sam complained of a sore throat at the end of the day. The fixed arm at the welding bay was running, and the mobile unit was switched on in the trailer bay. But the trailer bay unit's hood had been left on the floor about a metre from where Sam was welding the far side of a chassis, because the hose did not reach and moving the unit round the trailer was a nuisance.

At a metre, the hood needed about ten times its airflow to capture the fume, and was capturing almost none. Mara bought a longer hose for the mobile unit, marked the trailer bay floor with positions for it at each corner of a trailer, and made moving the hood part of starting each weld, as in the welder training set-up check. She also ordered the on-gun extraction trial for the trailer work, where the welds move constantly.

## Exercise: a flanged hood closer in

Using the formula in this chapter with V = 0.5 m/s and A = 0.03 m², calculate the airflow needed for a plain hood at 0.25 m from the arc, and for the same hood with a flange, taking the flange to reduce the airflow by a quarter. If the extraction arm's fan moves 0.35 m³/s, which arrangements will capture the fume?

For the plain hood at 0.25 m, Q = 0.5 × (10 × 0.0625 + 0.03) = 0.5 × 0.655 ≈ **0.33 m³/s**. With a flange, about 0.75 × 0.33 ≈ **0.25 m³/s**.

A fan moving 0.35 m³/s will capture the fume with either hood at 0.25 m, with the flanged hood giving a useful margin for filter loading and draughts. At 0.3 m, the plain hood would need about 0.47 m³/s, more than the fan gives, and the flanged hood about 0.35 m³/s, right at the limit. The answer is to keep the hood within about a quarter of a metre of the arc and to fit the flange.
