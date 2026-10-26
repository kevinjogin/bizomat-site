---
book: cooling-towers-by-the-numbers
chapterSlug: evaporation-blowdown-and-cycles
order: 5
title: "Evaporation, drift, blowdown and cycles"
description: "Balance a tower's water: evaporation, drift, blowdown and makeup, cycles of concentration and their cost, blowdown control, and catch a bleed left open that more than doubled the water bill."
draft: false
---

A cooling tower consumes water in three ways. It evaporates water to reject heat, which is unavoidable. It loses a little as **drift**, fine droplets carried out with the exhaust air. And it must deliberately discharge some water, the **blowdown** or bleed, because evaporation leaves the dissolved salts behind and, without blowdown, the circulating water would grow ever more concentrated until salts precipitated as scale. The water added to replace all three is the **makeup**. The balance between them is set by chemistry as much as by heat, and it is one of the largest running costs of a tower.

This chapter balances CT-250's water, introduces the cycles of concentration that link blowdown to evaporation, shows how the choice of cycles drives the water bill, and explains how blowdown is controlled. The running case finds that, after a maintenance visit, CT-250's bleed valve was left open on a timer and ran its cycles down to about 1.5, so that the tower used more than twice the makeup water it needed, costing about A$12,400 a year in this illustration.

## The water balance

In steady operation, the water entering the tower system as makeup equals the water leaving it as evaporation, drift and blowdown: M = E + D + B. The salts entering with the makeup must also leave, and they leave only with the drift and blowdown, because evaporation takes pure water. If the circulating water's dissolved solids are C times those of the makeup, the salt balance gives M = C × (D + B). Together these give the relationships that run every tower.

```figure
type: formula
title: Cycles of concentration, blowdown and makeup
formula: C = concentration in the circulating water ÷ concentration in the makeup;   B ≈ E ÷ (C − 1) − D;   M ≈ E × C ÷ (C − 1)
caption: This is an illustration for CT-250 at full load, with an evaporation of about 0.371 m³/h from the simple estimate of Chapter 1, and drift small enough to neglect in the water balance.
- C | Cycles of concentration
- E | Evaporation, m³/h
- B | Blowdown, m³/h
- D | Drift, m³/h
- M | Makeup, m³/h
step: At 4 cycles: B ≈ 0.371 ÷ 3 ≈ 0.124 m³/h; M ≈ 0.495 m³/h
step: At 2 cycles: B ≈ 0.371 m³/h, equal to the evaporation; M ≈ 0.742 m³/h
step: At 6 cycles: B ≈ 0.074 m³/h; M ≈ 0.445 m³/h
```

Cycles of concentration are usually measured as the ratio of the circulating water's electrical conductivity to the makeup's, because conductivity rises with dissolved solids and is easy to measure continuously.

## Evaporation in practice

Chapter 1 estimated evaporation as the heat load divided by the latent heat, about 0.103 kg/s or 0.371 m³/h at full load, and Chapter 2 showed that on a hot, dry design day the air-side calculation gives more, about 0.12 kg/s, because the hot air also gives up heat to the water. Over a year, cooler and more humid days give less than the simple estimate. For annual water planning, the simple estimate times the plant's **equivalent full-load hours**, the annual heat rejected divided by the peak load, is a reasonable basis. This is an illustration. If CT-250's plant rejects the equivalent of 4,000 full-load hours a year, the tower evaporates about 0.371 × 4,000 ≈ **1,480 m³** a year.

## Drift

Drift is water carried out of the tower as droplets, not vapour. Modern drift eliminators, banks of shaped blades at the air outlet that make the air change direction so that droplets strike and drain, reduce it to a very small fraction of the circulating flow; makers state their eliminators' drift rate as a percentage of the flow. This is an illustration. At 0.005% of CT-250's 12 kg/s, drift would be about 0.0006 kg/s, about 2 litres an hour, negligible in the water balance. But drift matters out of proportion to its volume, because drift droplets can carry bacteria out of the tower, which is why Chapter 7 treats eliminators as a health control and why they are inspected and kept in good repair.

## What cycles cost

The higher the cycles, the less blowdown and makeup, but the more concentrated the circulating water, and the greater its tendency to scale and corrode. The chosen cycles are a balance between water cost and the limits of the water's chemistry with its treatment, which Chapter 6 sets, and they should be written down as a target with an upper and lower limit.

This is an illustration, with the 4,000 equivalent full-load hours above, an illustrative makeup water charge of A$3.00 per kilolitre and a trade waste charge for the blowdown of A$2.00 per kilolitre. Water and sewerage charges are generally GST-free in Australia, but the plant's own bills are the authority on what applies.

```figure
type: compare
title: CT-250's annual water by cycles of concentration
cols: Blowdown | Makeup | Illustrative annual water cost
caption: This is an illustration with 1,484 m³ of evaporation a year, A$3.00 per kilolitre of makeup and A$2.00 per kilolitre of blowdown. Gains flatten above about 4 to 6 cycles; below about 3, costs climb steeply.
- 1.5 cycles, bleed left open | 2,968 m³ | 4,452 m³ | A$19,290
- 2 cycles | 1,484 m³ | 2,968 m³ | A$11,870
- 3 cycles | 742 m³ | 2,226 m³ | A$8,160
- *4 cycles, CT-250's target | 495 m³ | 1,979 m³ | A$6,930
- 6 cycles | 297 m³ | 1,781 m³ | A$5,940
```

The table shows the shape of the trade-off. Going from 2 to 4 cycles saves about a third of the makeup; going from 4 to 6 saves only about a tenth more, while the water becomes 50% more concentrated. Most of the saving is in avoiding low cycles. A tower running at 2 cycles instead of 4 uses about half as much makeup again, and nobody notices unless someone reads the meters, because the tower itself works perfectly well while it wastes water.

## Controlling blowdown

Blowdown is controlled in one of three ways.

- A **conductivity controller** measures the circulating water's conductivity and opens a bleed valve when it rises above a set point, holding the cycles close to the target. It is the usual method, and it adjusts automatically to changes in load and evaporation.
- A **timer** opens the bleed for set periods, which cannot respond to the load and so either wastes water at light load or under-bleeds at full load.
- A **fixed bleed**, a valve cracked open, wastes the most, because it bleeds the same amount whatever the evaporation.

The conductivity probe itself needs care: a probe coated with scale or biofilm reads low, so the controller bleeds too little and the cycles drift up, which Chapter 6's error follows.

## The running case: the open bleed

This is an illustration. CT-250's conductivity controller held the tower at about 4 cycles. During a maintenance visit, the controller was bypassed so its probe could be cleaned, and the bleed valve was put on a timer as a temporary measure, set generously to be safe. The visit ended, and the timer stayed in control.

## The error: a bleed left on a generous timer

With the bleed open far longer than needed, the circulating water's conductivity fell to about 1.5 times the makeup's. The tower was now discharging about twice its evaporation as blowdown. At full load, the makeup rose from about 0.495 to about 1.11 m³/h, and over a year it would have been about **4,450 m³** instead of 1,980.

```figure
type: bars
title: CT-250's illustrative annual water cost, A$
unit: A$
max: 20000
caption: This is an illustration with water at A$3.00 and trade waste at A$2.00 per kilolitre. The open bleed costs about A$12,400 a year more than conductivity control at 4 cycles.
- Bleed on a generous timer, about 1.5 cycles | 19290
- *Conductivity control at 4 cycles | 6930
```

The extra cost, about **A$12,400 a year** in this illustration, went unnoticed for two months, until the water bill arrived. The check that should have caught it sooner is a daily or weekly look at the makeup water meter, compared with the evaporation expected for the load: a makeup more than about one and a half times the evaporation means cycles below about 3, and a reason to look at the bleed. The fix was to restore the conductivity controller with its cleaned probe and to add the makeup meter reading, and the conductivity, to the tower's weekly log, with a note in the maintenance procedure that any temporary bleed setting must be reversed before the visit is signed off. The general lesson is that a tower's water use is set by its blowdown control, and that a meter reading compared with expected evaporation detects a fault within days instead of a billing cycle.

## Measuring the balance

Two water meters, one on the makeup and one on the bleed, turn the water balance from an estimate into a measurement. Their difference is the evaporation plus drift, which can be compared with the heat load to check that the tower is behaving; their ratio is the cycles of concentration, which can be compared with the conductivity ratio as a check on the conductivity controller. This is an illustration. Over a week at full load in mild weather, CT-250's meters might read about 80 m³ of makeup and 20 m³ of bleed: about 60 m³ evaporated, in line with the load, and cycles of about 80 ÷ 20 = 4, matching the controller. If the meters say 4 and the conductivity ratio says 6, one of them is wrong, and the probe is the usual suspect.

Many water authorities offer, or require, separate metering of evaporation, because water that evaporates does not reach the sewer, and some sewerage charges are based on the water discharged. A plant that can show its evaporated volume by metering the makeup and bleed separately may be charged only for the bleed it actually discharges. The meters usually pay for themselves.

## Through the seasons

Evaporation follows the heat load and the weather, so it is highest on hot summer days at full production and lowest in winter or at light load. With conductivity control, the cycles stay constant, and the blowdown falls and rises in proportion to the evaporation, which is exactly what is wanted. With a timer, the blowdown stays the same while the evaporation falls, so the cycles fall in winter, wasting water, or the timer is set for winter and under-bleeds in summer, letting the cycles climb towards scaling. That seasonal mismatch is the strongest argument for conductivity control, whatever the size of the tower.

## The makeup water sets the limits

How high the cycles can go depends on what is in the makeup water. Its **hardness**, mainly calcium, and its **alkalinity** decide when calcium carbonate scale will form as the water concentrates and warms in the tower and the exchangers. **Silica** forms a hard, glassy scale that is very difficult to remove and sets its own limit. **Chloride** and **sulphate** raise corrosivity, especially to stainless steels and copper alloys, as they concentrate. A full analysis of the makeup water, repeated at least seasonally because town water varies, is the starting point for the treatment programme of Chapter 6, which states the maximum cycles the water can sustain with that programme. Soft makeup water, or makeup blended with rainwater captured from the plant's roofs, which is very low in dissolved salts, can allow higher cycles, although rainwater brings its own issues of debris and biological quality that its storage and filtration must address.

## Losses that look like evaporation

Not every litre of makeup goes to evaporation, drift or controlled blowdown. A float valve that sticks open overfills the basin and runs makeup straight to the overflow; wind blows water out of the tower's air inlets as **splash-out** on gusty days; pump seals, strainer drains and leaking valves lose water around the circuit; and a basin that drains back to the tower each time the pumps stop can overflow on every start. Each of these uncontrolled losses wastes water, and the ones that discharge to drains also lower the cycles, diluting the treatment chemicals and upsetting the balance the treatment programme assumes. The meter comparison catches them: if the makeup minus the metered bleed is well above the evaporation expected for the load, water is leaving by a route nobody is metering. A walk round the tower at the start of each week, looking at the overflow, the basin level and the ground around the inlets, finds most of them in minutes.

## Using blowdown wisely

Blowdown water is warm, clean of solids and only moderately concentrated, and some plants reuse it, for example for toilet flushing or wash-down, where the water authority and the plant's own risk assessment allow. Others improve their makeup water to allow higher cycles: softening, or blending in captured rainwater, which is low in dissolved salts. Both reduce the tower's net water use. Any reuse must account for the treatment chemicals in the blowdown and, given Chapter 7's concerns, for its biological quality. Blowdown discharged to sewer usually needs the sewerage authority's trade waste approval, which may set limits on its temperature and its chemicals.

## Exercise: raising the cycles

The water treatment provider proposes raising CT-250's cycles from 4 to 6 with a changed inhibitor programme, at an extra chemical cost of A$700 a year, GST-exclusive. Using the illustrative figures above, what are the annual water saving and the net saving? What else should be weighed?

**Worked answer.** At 4 cycles the annual water cost is about A$6,930; at 6 cycles about A$5,940, a saving of about **A$990**. With A$700 of extra chemicals, plus A$70 of GST that a registered business would normally claim back, the net saving is about **A$290 a year**.

The saving is modest, and it must be weighed against the higher scaling and corrosion risk of more concentrated water, which falls on the tower and on every exchanger it serves, as *Heat Exchangers by the Numbers* shows for OC-35's fouling. Unless the plant's water is expensive or scarce, 4 cycles with a robust treatment programme is often the better balance, and the decision can be revisited if water prices rise or restrictions are imposed.
