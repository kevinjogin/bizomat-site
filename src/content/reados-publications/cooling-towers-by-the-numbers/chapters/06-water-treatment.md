---
book: cooling-towers-by-the-numbers
chapterSlug: water-treatment
order: 6
title: "Water treatment: scale, corrosion, fouling and growth"
description: "Keep tower water fit for the tower and its exchangers: scale, corrosion, fouling and growth, the treatment programme, monitoring and records, and catch a fouled probe that doubled the cycles."
draft: false
---

Cooling-tower water is hard on everything it touches. Evaporation concentrates its dissolved salts until they want to precipitate as scale on the warmest surfaces, which are the tubes and plates of the plant's exchangers. Constant aeration and concentrated salts make it corrosive to steel and copper alloys. The tower scrubs dust, pollen and debris from the air and collects them in its basin. And warm, aerated, nutrient-bearing water in sunlight is an excellent medium for bacteria, algae and biofilms, including the Legionella bacteria of Chapter 7. A **water treatment programme** keeps all four problems in check, and its success is measured not in the tower but in the condition of the exchangers it serves and the health of the people near it.

This chapter describes the four problems, the parts of a treatment programme that address them, what should be monitored and how often, and the records that show it is working. The running case finds that CT-250's conductivity probe became coated with scale and read low, so the controller under-bled and the tower ran at about 8 cycles while its log showed 4, until scaling in the press oil coolers' tubes gave it away.

## Four problems

```figure
type: compare
title: The four water problems and their usual controls
cols: Where it shows | Usual controls | What to monitor
caption: General characteristics only. A real programme is designed by a qualified water treatment provider for the specific makeup water, system materials and operating conditions.
- Scale | Hottest surfaces: exchanger tubes, chiller condensers, fill | Cycles limited by blowdown, scale inhibitors, pH control, softened makeup | Conductivity, pH, hardness, alkalinity, inhibitor level
- Corrosion | Steel pipework and basins, copper tubes, heat-affected areas | Corrosion inhibitors, pH control, suitable materials | Corrosion coupons, iron and copper in the water, inhibitor level
- Fouling | Low-velocity zones, fill, strainers, exchanger inlets | Side-stream filtration, dispersants, basin cleaning | Suspended solids, strainer pressure drop, exchanger performance
- *Microbial growth | Fill, basin, dead legs, biofilm everywhere | Biocides, cleaning, avoiding stagnation, shading | Biocide residual, microbial counts, Legionella testing as required
```

The four interact. Biofilm traps particles and protects bacteria from biocides; scale and deposits shelter corrosion beneath them; corrosion products foul surfaces; and a programme that fails on one usually fails on the others. That is why a treatment programme is designed as a whole and its results reviewed together, by someone who looks at all four at once.

## Scale

Scale forms when the concentrated water can no longer hold its dissolved minerals at the temperature and pH it reaches. Calcium carbonate, the commonest, becomes less soluble as temperature rises, so it forms first on the hottest surfaces: the tubes of the plant's exchangers, where the tower water picks up its heat, rather than in the tower itself. Saturation indices, such as the Langelier and Ryznar indices, calculated from the water's calcium, alkalinity, dissolved solids, pH and temperature, indicate whether a water tends to deposit or dissolve calcium carbonate, and treatment providers use them to set the maximum cycles. Scale inhibitors, chemicals that interfere with crystal growth, let the water run somewhat beyond its natural limit, and pH control can extend it further.

## Corrosion

Aerated, warm and concentrated, tower water corrodes carbon steel and attacks copper alloys, and corrosion products then foul the system. Corrosion inhibitors form protective films on metal surfaces, and the programme keeps them at their effective level. **Corrosion coupons**, small weighed strips of the system's metals placed in a bypass and removed after a set period, measure the actual corrosion rate, and a rising rate is an early warning that the programme is falling behind.

## Materials and the programme

The system's metals shape the programme as much as the water does. Carbon steel pipework and basins need corrosion inhibition; galvanised steel, common in packaged towers, can suffer **white rust**, a rapid corrosion of the zinc coating in water of high pH and low hardness, especially when new, and makers specify a passivation period with controlled chemistry at start-up; copper and copper-alloy exchanger tubes need their own inhibitor and are sensitive to some oxidising biocides at high residuals; stainless steels resist general corrosion but can pit and crack where chloride concentrates under deposits. A complete list of the metals in contact with the tower water, from the tower's basin to every exchanger's tubes and plates, is the first input to the programme, and it should be kept up to date as equipment is added.

## Fouling and filtration

Particles enter with the air and the makeup. They settle in the basin and in slow-flowing parts of the system, plug fill and spray nozzles, and lodge in exchangers. **Side-stream filtration**, passing a fraction of the circulating flow continuously through a filter or separator, removes them; dispersants keep fine particles suspended so that blowdown removes them; and periodic basin cleaning removes what settles. *Heat Exchangers by the Numbers* shows what particles do to a plate exchanger's narrow channels, and why a strainer before sensitive exchangers is part of the treatment, not an optional extra.

## Microbial control

Bacteria and algae grow in tower water and on its surfaces, forming biofilms, slimy layers in which microorganisms are protected and multiply. Biofilm fouls fill and exchangers, accelerates corrosion beneath it and shelters Legionella. **Biocides** control it: oxidising biocides, such as chlorine- or bromine-based products, which act quickly and are monitored by their residual in the water; and non-oxidising biocides, used alongside them on a schedule. Biocides cannot work on surfaces they cannot reach, so physical cleaning, avoiding stagnant water, and keeping sunlight off the water, which feeds algae, are as important as the chemicals. Chapter 7 sets out the regulatory framework that applies to microbial control in Australia.

## The treatment programme

A treatment programme is a written plan prepared by a qualified water treatment provider for the specific tower, makeup water, metals and operating pattern. It states the target cycles and their limits, the chemicals and their target residuals, the dosing method, the blowdown control, the filtration, the monitoring tests and their frequencies, the cleaning schedule, and the responses when a result is out of range. Dosing is usually automated, with pumps proportional to makeup or controlled by measurements, and the provider visits regularly to test, adjust and report.

## Monitoring

```figure
type: checklist
title: CT-250's routine water checks
caption: This is an illustration of a plant's own routine checks between the provider's visits; the provider's programme and any legal requirements set the full list and frequencies.
- Daily | Makeup meter reading against expected evaporation
- Weekly | Conductivity, controller reading against a hand meter; bleed meter reading; basin and overflow walk-round
- Weekly | Biocide residual against target; dosing tank levels
- Monthly | Provider's full analysis, inhibitor levels, microbial tests as the programme and the law require
- Quarterly | Corrosion coupons; exchanger conductance trends reviewed with the water results
- x A controller trusted without a cross-check | The probe error below
```

The plant's own checks between visits are what catch a failure in time. The provider's monthly visit sees a snapshot; the plant's daily and weekly readings see the trend. Five minutes a week with a hand-held conductivity meter and the two water meters is the cheapest insurance a tower has, and the plant should own that routine rather than leave it to the provider.

## The running case: a probe that read low

This is an illustration. CT-250's conductivity controller kept the cycles at about 4 by its own reading. Over several months, a thin scale built up on its probe, which made the probe read low: the controller saw conductivity at its set point while the actual water was more concentrated, and it bled less and less.

## The error: cycles doubled behind a correct-looking display

The controller's display and the weekly log both showed about 4 cycles. The water meters, which nobody was comparing, told a different story: the ratio of makeup to bleed had risen to about 8. At 8 cycles, the circulating water was twice as concentrated as the programme allowed, past its scaling limit, and calcium carbonate deposited on the hottest surfaces: the press oil coolers' tubes and the chiller's condenser tubes.

```figure
type: bars
title: CT-250's cycles of concentration, by source of the reading
unit: cycles
max: 9
caption: This is an illustration. The scaled probe read low, so the controller and the log showed the target while the meters and a hand-held conductivity meter showed about twice it.
- Controller display and weekly log | 4
- *Makeup ÷ bleed from the water meters | 8
- Hand-held meter, circulating ÷ makeup conductivity | 8
```

The first sign was in the exchangers. OC-35's monthly conductance, tracked as *Heat Exchangers by the Numbers* describes, began falling much faster than its usual fouling rate, and the press oil ran hotter. The engineer investigating the cooler checked the water and found the cycles with a hand-held meter in five minutes. The probe was cleaned and recalibrated, the cycles were brought back to 4, the scaled coolers were cleaned, and a weekly cross-check, the controller against a hand-held meter and the meters' ratio, was added to the plant's routine. The general lesson is that an automatic controller is only as good as its sensor, and that a tower's water needs at least one independent check of its cycles every week, because the first evidence of a failed controller otherwise appears as damage to the plant it serves.

## Working with a treatment provider

Most plants buy water treatment as a service, and the contract decides what they get. A good contract states the programme's targets, the tests the provider will perform and how often, the response times when a result is out of range, the reports to be provided and to whom, and what the provider is responsible for and what the plant is. It should require results to be reported against their target ranges, not only as numbers, and actions to be recorded with each excursion. The plant should own the data: test results, dosing records and reports belong in the plant's records, where they survive a change of provider. And the plant should review them, ideally monthly, with the exchangers' performance and the makeup meter readings beside them, because the provider sees the tower and the plant sees the consequences.

## Chemical safety

Treatment chemicals include acids, alkalis, oxidisers and biocides, several of them hazardous to people and incompatible with each other. Mixing an acid with a hypochlorite biocide, for example, releases chlorine gas. The chemicals must be stored, labelled and handled under the work health and safety requirements for hazardous chemicals, with their safety data sheets available, bunding for spills, segregation of incompatible products, ventilation where vapours can collect, and the personal protective equipment the data sheets specify. Dosing pumps and their lines are part of the hazard: a pump left running into a closed line, or two products dosed into the same point, can cause a release. The provider's programme should include a chemical register and the site's procedures should cover deliveries, decanting and spills.

## When the plant changes

The treatment programme was designed for a particular set of metals, temperatures and operating patterns, and changes to the plant can invalidate it. Adding a stainless steel plate exchanger, as *Heat Exchangers by the Numbers* considers, introduces narrow channels sensitive to fouling and a metal whose corrosion depends on chloride; adding a hotter load raises the surface temperatures at which scale forms; and a change to the operating pattern, such as a plant that now stops for the summer break, introduces stagnation, which Chapter 7 shows is a microbial hazard. Any such change should be notified to the provider and the programme reviewed before it happens, not after the next set of results.

## Calcium cycles and conductivity cycles

A useful diagnostic compares two measures of the cycles. The conductivity ratio measures all dissolved salts together; the calcium ratio, the circulating water's calcium divided by the makeup's, measures calcium alone. If both agree, the calcium is staying in solution. If the calcium ratio is well below the conductivity ratio, calcium is leaving the water somewhere other than the blowdown, almost always as scale. Providers use this comparison routinely, and it would have shown CT-250's problem in the first month: the conductivity ratio climbing towards 8 while the calcium ratio lagged behind it.

## Records

A treatment programme's records show that it is working and, under the law in many jurisdictions, that the tower is being managed as required. They include the programme itself, every test result with its date and who took it, every dosing and blowdown adjustment, every cleaning, the provider's reports and the actions taken on out-of-range results. Reviewed together with the exchangers' performance trends and the makeup meter, they let the plant see whether a problem is beginning before it becomes damage, and they are what an auditor or health officer will ask to see first, before looking at the tower itself.

## Exercise: what 8 cycles cost in scale

At 4 cycles, CT-250's circulating water carries four times the makeup's calcium; at 8 cycles, eight times. If the makeup water's calcium hardness were 60 mg/L as calcium carbonate, what would the circulating water's calcium be at each, and how much calcium, as calcium carbonate, would enter the system each day at full load with a makeup of about 0.495 m³/h at 4 cycles and 0.424 m³/h at 8?

**Worked answer.** At 4 cycles the circulating water carries about 4 × 60 = **240 mg/L**; at 8 cycles, about **480 mg/L**. The daily input of calcium, as calcium carbonate, is the makeup volume times its concentration: at 4 cycles about 0.495 × 24 × 60 ≈ 713 g a day; at 8 cycles about 0.424 × 24 × 60 ≈ **611 g** a day.

Less calcium enters at 8 cycles, because less makeup is used. If it all stayed in solution, the smaller blowdown at 8 cycles, about 0.053 m³/h at 480 mg/L, would carry the same 611 g a day back out. But 480 mg/L is beyond the water's scaling limit in this illustration, so the water cannot hold it: part of the calcium entering each day precipitates as scale instead of leaving with the blowdown, and it precipitates first on the hottest surfaces. Even a fraction of 611 g a day, deposited on exchanger tubes, explains how quickly OC-35's conductance fell.
