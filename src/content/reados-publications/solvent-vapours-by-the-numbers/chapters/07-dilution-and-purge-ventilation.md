---
book: solvent-vapours-by-the-numbers
chapterSlug: dilution-and-purge-ventilation
order: 7
title: "Dilution and purge ventilation"
description: "How much air dilutes a vapour release below a fire limit and below a health limit, mixing factors, build-up and purge times, and why the air at a worker's face can be far above the room average."
draft: false
---

Once solvent has evaporated into a room, the only way to lower its concentration is to replace the air. General or dilution ventilation does that by bringing in clean air and removing contaminated air, so that the vapour released is diluted to an acceptable level. It is the simplest form of ventilation and the easiest to calculate, which makes it tempting to rely on. It works well for diluting vapour below fire limits in a room, and much less well for protecting a person standing beside the source, which is where most solvent exposure happens in a small workshop.

This chapter calculates the airflow needed to dilute a release below a fire limit and below a health limit, introduces mixing factors, works out how long concentrations take to build up and to purge, and shows with a two-zone model why the air at a worker's face matters more than the room average. Its error is a room-average calculation that said the wiping bench was safe.

## Dilution in a well-mixed room

If vapour is released at a steady volume rate G into a room ventilated with a steady airflow Q, and the room is well mixed, the concentration settles where vapour leaves as fast as it arrives: C = G ÷ Q. The vapour's volume rate comes from its mass rate through the molar volume, about 24.45 L per mole at 25 °C and atmospheric pressure.

Real rooms are not perfectly mixed. Air short-circuits between supply and exhaust, corners stagnate and sources sit in local pockets. Designers allow for this with a mixing factor K, typically between about 1.5 for a well-designed system and 10 for a poor one, and size the airflow as Q = K G ÷ C.

```figure
type: formula
title: Dilution ventilation for a steady release
caption: G is the vapour release as a volume rate at room conditions; C is the target concentration as a volume fraction. The mixing factor K allows for imperfect mixing and is a matter of judgement about the room and the source.
- G = (mass rate ÷ M) × 0.02445 | vapour volume rate, m³ per unit time, at 25 °C and 101.325 kPa
- step: C = G ÷ Q | steady concentration in a well-mixed room
- step: Q = K G ÷ C_target | airflow for a target, with mixing factor K
- step: air changes per hour = Q ÷ V | the same airflow relative to the room volume V
```

## Two targets, a hundred times apart

The target concentration depends on the hazard, and Chapter 1 showed that the fire and health targets differ by a factor of about a hundred.

Plant S's wiping bench, in a 2,700 m³ bay 30 by 15 by 6 m, uses about 70 kg of acetone a month on rags, about 3.33 kg a shift. Over 8 hours that is 0.416 kg/h, or 0.416 ÷ 0.05808 × 0.02445 = 0.175 m³/h of pure vapour.

```figure
type: compare
title: Airflow to dilute the wiping bench's acetone in the bay
rowhead: Target
cols: Target concentration | Airflow with K = 1 | Airflow with K = 3 | Air changes per hour, K = 3
caption: This is an illustration. Vapour release 0.175 m³/h from 3.33 kg of acetone a shift. The health target uses NIOSH's recommended exposure limit for acetone as an illustration; Australian workplace exposure limits published by Safe Work Australia govern real assessments.
- 25% of the lower explosive limit | 0.625%, 6,250 ppm | 28 m³/h | 84 m³/h | 0.03
- * Health, NIOSH REL for acetone | 250 ppm | 702 m³/h | 2,105 m³/h | 0.78
```

For fire, the release is trivial: 84 m³/h, a few per cent of an air change an hour, keeps the bay far below a quarter of the lower limit, and any building with open doors exceeds that many times over. For health, about 2,100 m³/h, roughly 0.8 air changes an hour, is needed even in a well-mixed calculation with a modest mixing factor. The health target, not the fire target, sets the ventilation for the workroom. The fire target becomes the governing one only in small, enclosed spaces with large releases, such as ovens, booths and stores, which later chapters take up.

### Several sources and several solvents

A room-average calculation adds every source in the room, because they all share the same air. Before the lids of Chapter 5 were fitted, the bay also held the open acetone bucket, losing about 4.1 kg a day, and the open gun-washing drum, losing about 3.0 kg of thinner a day. Spread over 24 hours, they added about 0.072 m³/h of acetone vapour and 0.037 m³/h of thinner vapour to the wiping bench's 0.175 m³/h, raising the summer room average from about 83 ppm to about 135 ppm. The lids did more for the bay's air than any fan the plant had considered.

When several solvents are present, their health effects may add. A common approach in occupational hygiene, for substances with similar effects, is to sum each concentration divided by its own exposure limit and keep the total below one. The thinner's components and acetone all have effects on the nervous system at high exposures, and an occupational hygienist would normally assess them together. This is another reason the solvent register of Chapter 3 lists components, not just product names.

## Build-up and purge times

A room does not jump to its steady concentration. When a release starts, the concentration rises towards G ÷ Q with a time constant equal to the room volume divided by the airflow, V ÷ Q, reaching 63% of the final value after one time constant and 95% after three. When the release stops, it falls with the same time constant.

For the bay with 2,000 m³/h of ventilation, the time constant is 2,700 ÷ 2,000 = 1.35 hours: concentrations build over the morning and reach near-steady levels after about four hours. Purging a space after a release follows the same exponential, C(t) = C₀ e^(−Qt ÷ V), as Chapter 4 used for drums.

### A spill in the mixing room

Plant S's paint mixing room is a separate 300 m³ room with a 1,500 m³/h extraction fan, five air changes an hour. If a 1 L tin of acetone is knocked over and evaporates, it releases 0.79 kg, or 13.6 mol, which is 0.333 m³ of vapour at 25 °C. Mixed evenly through the room, that is 0.333 ÷ 300 = 0.11%, about 1,100 ppm: far below the lower explosive limit, but over four times the illustrative health limit, and much higher near the floor where the vapour first spreads. With the fan running, the concentration falls to a tenth of that, about 125 ppm, in 300 ÷ 1,500 × ln(1,110 ÷ 125) hours, about 26 minutes, once the liquid has gone. While liquid remains, the purge cannot finish, which is why the spill kit comes before the wait.

## The error: the room average

The plant's first ventilation assessment of the wiping bench used the well-mixed formula. The bay's measured ventilation, with its roller doors open and two roof fans running, was about 2,100 m³/h, so the room-average concentration from the bench was about 0.175 ÷ 2,105 = 83 ppm, a third of the illustrative limit. The assessment concluded that the wiping bench needed no further control.

The operator at the bench did not breathe the room average. They leaned over the part, wiping it with a rag that was releasing acetone a few tens of centimetres from their face. The concentration in that small region, the near field, is the room average plus whatever the local source adds before it mixes out.

Occupational hygienists estimate this with a two-zone model. The near field is taken as a hemisphere around the source and the worker's head, here with a radius of 1 m. Air is exchanged between the near field and the rest of the room, the far field, at a rate β, often estimated as half the hemisphere's surface area times the local air speed. With a typical indoor air speed of 0.05 m/s, β = 0.5 × 2π × 1² × 0.05 × 3,600 = 565 m³/h. The near-field concentration is the far-field concentration plus G ÷ β.

```figure
type: compare
title: The wiping bench: room average and breathing zone
rowhead: Quantity
cols: Value | Note
caption: This is an illustration. Two-zone model with a 1 m near-field hemisphere and a local air speed of 0.05 m/s; release 0.175 m³/h; room airflow 2,105 m³/h. The room-average assessment missed most of the operator's exposure. Real exposures are measured by an occupational hygienist with personal sampling.
- Far-field (room average) concentration | about 83 ppm | from G ÷ Q
- Exchange rate between near and far field | about 565 m³/h | half the hemisphere area times 0.05 m/s
- Near-field addition | about 310 ppm | G ÷ β
- * Breathing-zone concentration | about 394 ppm | above the illustrative 250 ppm limit
```

The breathing zone was nearly five times the room average and about 1.6 times the illustrative limit. Doubling the local air speed to 0.1 m/s would halve the near-field addition to about 155 ppm, but the only reliable way to bring the operator well below the limit was to stop the vapour reaching their face: less solvent per rag, the plunger cans of Chapter 5, and local exhaust at the bench, which Chapter 8 sizes. The plant also arranged personal sampling by an occupational hygienist to confirm the exposure before and after the changes, because a model of this kind shows the size of a problem but does not replace measurement of the real one.

## Measuring the airflow

Every dilution calculation depends on the airflow, and the airflow of a workshop is rarely known. Plant S's 2,100 m³/h came from measurements, not from fan ratings. The engineer measured the air speed across each roller door and roof fan opening with a vane anemometer, at a grid of points over each opening, averaged the readings and multiplied by the opening's area. Smoke from a smoke tube showed which openings were bringing air in and which were letting it out, which is not obvious in a building with open doors and a breeze. The roof fans' measured flow was about 60% of their nameplate rating, because they were working against the suction of a building with too little planned make-up air.

## Winter, with the doors shut

The measured airflow was a summer figure. In winter the roller doors stay mostly closed to keep the bay warm, and the bay's airflow falls to whatever the roof fans can draw through gaps and a few louvres.

```figure
type: bars
title: Room-average acetone from the wiping bench as the bay's airflow falls
unit: ppm
caption: This is an illustration. Release 0.175 m³/h, well-mixed room average only; the breathing zone adds the near-field contribution on top. With the doors closed in winter, the room average alone reaches the illustrative 250 ppm limit, and concentrations take two hours or more to build up and to clear.
- Summer, doors open, 2,105 m³/h | 83
- Spring, doors half open, 1,400 m³/h | 125
- * Winter, doors closed, 700 m³/h | 250
```

At 700 m³/h, the room average from the wiping bench alone is about 250 ppm, before the near field adds anything, and the time constant is nearly four hours, so the bay never clears between morning and afternoon. Ventilation that relies on open doors is ventilation that disappears in winter. The plant installed a dedicated extraction fan with planned louvres for make-up air, so that the bay's ventilation no longer depended on the weather.

### Recirculating air

Heating or cooling a workshop is expensive, and recirculating its air is tempting. Air from areas where solvents are used must not be recirculated through ordinary filters, which remove particles, such as paint overspray, but not vapour. Recirculated air carries its vapour back into the room, and the effective ventilation for vapour is only the fresh-air part. Activated carbon can adsorb solvent vapour, and is used for odour control, but it saturates, and its life has to be calculated from the vapour load and checked by measurement. For spray booths in particular, recirculation needs a specific design; it is not something to add to an existing extraction system.

## Where dilution air goes

Dilution ventilation works only if the air actually sweeps the places where vapour is. Three rules of placement follow from the earlier chapters.

1. **Extract low as well as high.** Solvent vapours are denser than air, and concentrated vapour from a spill or an open drum spreads along the floor before it mixes. Low-level extraction near stores, mixing rooms and pits removes it where it gathers.
2. **Move air from clean to dirty.** Supply air should enter where people work and leave past the sources, so that people are upwind of the vapour and not downwind of it.
3. **Provide make-up air.** An extraction fan removes only as much air as can get back in. A room with no planned supply openings runs under suction, draws air through cracks and doorways unpredictably, and extracts far less than the fan's rating.

## How this applies to a small Australian business

Use dilution ventilation to keep whole rooms well below fire limits, which it does easily except in small enclosed spaces. For health, size it against the workplace exposure limits published by Safe Work Australia, with a realistic mixing factor, and remember that a person beside a source breathes far more than the room average. Reduce releases at the source first and use local exhaust where people work close to solvent. Place extraction low near heavy vapours and give fans a path for make-up air. Have exposures measured by an occupational hygienist when there is doubt. Measure the airflow you really have, in summer and in winter, rather than reading it off a fan's nameplate, and design the ventilation so that it does not depend on doors being left open.

## Exercise: a bigger wiping job

A new product needs 6 kg of isopropanol a shift wiped on at one bench. (a) What is the vapour release rate in m³/h over an 8-hour shift? (b) What airflow dilutes it below 25% of its 2.0% lower explosive limit with K = 3? (c) Using the two-zone model with β = 565 m³/h, what does the near field add, and what does that suggest?

**Worked answer.** (a) 6 ÷ 8 = 0.75 kg/h; 0.75 ÷ 0.06010 × 0.02445 = **0.305 m³/h** of vapour. (b) A quarter of the limit is 0.5%, so Q = 3 × 0.305 ÷ 0.005 = **183 m³/h**, easily met by any workshop ventilation. (c) The near field adds 0.305 ÷ 565 = 5.4 × 10⁻⁴, about **540 ppm**, on top of the room average. Whatever the applicable exposure limit for isopropanol, a near-field contribution of that size calls for source reduction and local exhaust at the bench rather than more general ventilation, and for exposure monitoring to confirm the result.
