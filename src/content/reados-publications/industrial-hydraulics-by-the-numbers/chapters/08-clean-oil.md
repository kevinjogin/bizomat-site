---
book: industrial-hydraulics-by-the-numbers
chapterSlug: keep-the-oil-clean-and-at-the-right-viscosity
order: 8
title: "Keep the oil clean and at the right viscosity"
description: "Choose a hydraulic oil grade from viscosity at the running and cold-start temperatures, read ISO 4406 cleanliness codes, size a return filter for the real flow and cold oil, and sample oil properly."
draft: false
---

Hydraulic oil is a component, not a consumable. It carries the power, lubricates the pumps and valves, seals their clearances and carries heat to the reservoir. Two of its properties decide whether it can do those jobs: its viscosity, which changes greatly with temperature, and its cleanliness, which is measured in particles a few micrometres across. A pump running on oil that is too thin leaks and wears; one running on oil that is too thick at start-up starves and cavitates. Valves with clearances of a few micrometres stick and wear when the oil carries particles of the same size.

This chapter chooses the press's oil grade from its running and cold-start temperatures, explains the ISO 4406 cleanliness code, sizes the return filter, and sets up oil sampling. The failure case is a return filter sized for the pump's flow, which spent its cold mornings in bypass.

## Viscosity and temperature

Kinematic viscosity, measured in centistokes (cSt, equal to mm²/s), describes how easily oil flows under its own weight. Industrial oils are sold in viscosity grades. ISO 3448 defines the grades by their kinematic viscosity at 40 °C, so an **ISO VG 46** oil has a viscosity of about 46 cSt at 40 °C. That single number says nothing about how fast viscosity changes with temperature. For that, the oil's data sheet gives a second value, usually at 100 °C, and a viscosity index that summarises the rate of change.

The ASTM D341 relation, often called the Walther equation, links viscosity and temperature for petroleum oils through a double logarithm. Given two known points, it gives the viscosity at any temperature in between, and a little beyond. The [Oil Viscosity at Temperature tool](/tools/oil-viscosity-temperature/) uses it: it takes two known temperatures with their viscosities, and an operating temperature, and returns the kinematic viscosity there.

This is an illustration. The press's oil is an ISO VG 46 mineral hydraulic oil with **46 cSt at 40 °C** and **6.8 cSt at 100 °C**, values typical of a mineral oil with a viscosity index near 100. A real oil's values come from its supplier's data sheet.

```figure
type: bars
title: Viscosity of the press's ISO VG 46 oil across its working range
unit: cSt
max: 200
caption: This is an illustration. Values from the Oil Viscosity at Temperature tool with 46 cSt at 40 °C and 6.8 cSt at 100 °C. Viscosity falls by a factor of about ten between a cold morning and the summer afternoon of Chapter 6.
- 15 °C, a winter morning | 184.7
- 40 °C | 46
- 50 °C | 30.0
- *60 °C, the press's limit | 20.6
- 65 °C, the contract job before the fix | 17.4
```

The tenfold range explains a great deal of hydraulic behaviour. Line and filter pressure drops in laminar flow are proportional to viscosity, so they are about nine times larger on a 15 °C morning than at 60 °C. Internal leakage in pumps and valves rises as viscosity falls, so a hot system is slower and less efficient. A viscosity grade is chosen to keep the oil inside the band the pump can use, at both ends of the temperature range.

### Check the grade against the pump

This is an illustration. The press's gear pumps' data sheet asks for at least **16 cSt** while running and no more than **800 cSt** at start-up. The coldest morning the workshop expects is **8 °C**, and the hottest tank temperature allowed is **60 °C**.

The [Lubricant Viscosity Check tool](/tools/lubricant-viscosity-check/) takes the oil's viscosity at two temperatures and its specific gravity, the operating temperature, the least viscosity the machine needs there, a cold-start temperature and the largest viscosity allowed for a cold start. It returns the viscosity at the operating and cold-start temperatures, the same values as dynamic viscosity and in Saybolt units, and the ratio of the operating viscosity to the minimum needed, with checks against both limits.

```figure
type: compare
title: Three oil grades checked against the pump's limits
cols: At the hot limit | At an 8 °C cold start | Verdict
caption: This is an illustration. Pump limits: at least 16 cSt running, at most 800 cSt at start. The VG 32 and VG 68 values at 100 °C (5.4 and 8.6 cSt) are typical figures for mineral oils, used for comparison only. The VG 32 line is checked at 65.5 °C, the temperature the press reached before the fix in Chapter 6.
- ISO VG 32 | 12.8 cSt at 65.5 °C, below 16 | 185 cSt | too thin when hot
- *ISO VG 46 | 20.6 cSt at 60 °C, ratio 1.29 | 304 cSt | suitable
- ISO VG 46, before the cooler | 17.1 cSt at 65.5 °C, ratio 1.07 | 304 cSt | suitable, with almost no margin
- ISO VG 68 | 28.5 cSt at 60 °C | 528 cSt | suitable, but higher pressure drops when cold
```

VG 46 passes at both ends. At the 60 °C limit it gives 20.6 cSt, a ratio of **1.29** to the pump's minimum, and at an 8 °C start it is **304 cSt**, well under 800. Before the dwell change and cooler of Chapter 6, the oil at 65.5 °C was down to about 17.1 cSt, a ratio of only 1.07: legal, but with no room for a pump that was wearing. VG 32 would be too thin on a hot afternoon. VG 68 would give more margin when hot, at the cost of higher line and filter losses on cold mornings, and would be the better choice if the press moved to a hotter building without a cooler.

## Cleanliness and the ISO 4406 code

Particles in hydraulic oil come from three places: those already in new oil and new components, those made inside the system by wear, and those that get in from outside through breathers, seals and careless top-ups. The particles that do most damage are about the size of the clearances in pumps and valves, a few micrometres to a few tens of micrometres, far too small to see.

ISO 4406 reports cleanliness as three numbers, separated by slashes, for the number of particles per millilitre at or above **4, 6 and 14 µm**. Each number is a range code on a scale where one step up roughly doubles the particle count. A code of 18/16/13 means the counts fall in the ranges coded 18 at 4 µm, 16 at 6 µm and 13 at 14 µm. Component makers state the cleanliness their parts need, often as a code like this, and it is commonly a condition of warranty.

The [ISO 4406 Oil Cleanliness Code tool](/tools/iso-cleanliness-code/) takes particle counts at 4, 6 and 14 µm, either per millilitre or per sample volume, and a target code, and returns the three range numbers and the code, with a check against the target at each size.

This is an illustration. The press's directional valve maker asks for **18/16/13** or cleaner. A sample of new oil taken from the drum before filling counted **9,800, 2,100 and 280** particles per mL at 4, 6 and 14 µm. The tool gives a code of **20/18/15**, two steps dirtier than the target at every size. New oil is not clean oil. It has been pumped, stored and drummed, and the press's oil is therefore always put in through a filter cart, never poured in from the drum.

## Filtration

A filter's performance is described by its beta ratio at each particle size: the number of particles at or above that size upstream divided by the number downstream. A beta ratio of 200 at 14 µm means one particle in 200 of that size passes; its capture efficiency is 1 − 1 ÷ 200, which is 99.5%.

The press has a **full-flow return filter** between the directional valve and the tank, so all oil returning from the cylinder passes through it, plus a desiccant breather on the reservoir to stop dust and moist air coming in as the oil level rises and falls by the rod's 1.15 L each stroke. The suction has only a coarse strainer, so as not to starve the pumps, as Chapter 5 explained.

### How much air the reservoir breathes

The breather is easy to overlook, so it is worth putting a number on it. Each time the press extends, the tank level falls by the rod's volume and the reservoir draws in about 1.15 L of air; each time it retracts, it pushes that air out again. On the contract job, at about 80 cycles an hour for an 8 hour shift, that is 640 strokes and about **736 L** of workshop air drawn through the breather every shift, before counting the air moved as the oil warms and cools. In a workshop where parts are ground and blasted, that air carries dust. An open filler cap, or a cheap breather with a coarse element, lets it straight into the oil. The desiccant breather also removes moisture from that air, which matters on humid nights when a cooling reservoir would otherwise condense water on its walls.

The [Hydraulic Filter Selection tool](/tools/hydraulic-filter-selection/) takes upstream counts at 4, 6 and 14 µm, the filter's beta ratios at those sizes, a target code, and the element's pressure drop at its rated flow and viscosity, with the actual flow and the coldest running viscosity and an allowable clean-element drop. It returns the downstream counts and codes, the capture efficiencies, and the element's pressure drop scaled to the actual flow and viscosity, with checks of cleanliness and pressure drop.

The flow through the return filter is not the pump's 40 L/min. On the return stroke, the cap end empties **58.3 L/min** through it, as Chapters 1 and 5 showed. And the filter's worst case is a cold morning, at about **184.7 cSt**.

```figure
type: compare
title: Two return filter elements at the real flow and the coldest running viscosity
cols: Element rated 40 L/min | Element rated 60 L/min
caption: This is an illustration. Both elements: beta ratios of 10, 75 and 200 at 4, 6 and 14 µm; 0.25 bar drop at rated flow and 32 cSt; allowable clean-element drop 1.5 bar. Actual flow 58.3 L/min at 184.7 cSt. Upstream 20/18/15. The tool scales the drop in proportion to flow and viscosity, the laminar model.
- Downstream code in one pass | 17/12/8 | 17/12/8
- Capture efficiency at 4 / 6 / 14 µm | 90 / 98.7 / 99.5 % | 90 / 98.7 / 99.5 %
- *Cold element pressure drop | 2.10 bar, fails | 1.40 bar, passes
- What happens on a cold morning | bypass may open during each return stroke | element stays in circuit
```

Both elements clean the oil equally well, from 20/18/15 to **17/12/8** in a single pass, inside the 18/16/13 target. The difference is pressure drop. Scaled to 58.3 L/min and 184.7 cSt, the 40 L/min element drops **2.10 bar**, above the 1.5 bar allowed for a clean element. The 60 L/min element drops **1.40 bar**, just inside. As the element loads with dirt, its drop rises further, so the clean figure needs margin.

## A failure case: the filter that bypassed

This is an illustration. The press's first return filter was chosen from the power unit maker's standard list for a 40 L/min pump: a 40 L/min element in a housing with a bypass valve set at **2 bar**. A bypass valve protects the element from bursting by opening when the drop across it is too high; while it is open, oil goes to the tank unfiltered.

On warm afternoons the element dropped well under a bar, and nothing seemed wrong. On cold mornings, every return stroke pushed 58.3 L/min of thick oil through it at a drop above 2 bar, and the bypass opened for part of every stroke. The clogging indicator on the housing, which pops up when the drop is high, was found showing red on several mornings and reset each time by an operator who assumed it was a fault in the indicator.

The detection was the first scheduled oil sample at three months. The laboratory counted **15,000, 3,600 and 450** particles per mL, a code of **21/19/16**, three steps dirtier than the target at every size, and dirtier than the new oil. The directional valve had begun to stick occasionally in its centre position.

The correction followed the chain back. The element was replaced with one rated **60 L/min**, checked at the real flow and cold viscosity as above. The oil was cleaned with a filter cart run on the reservoir for a shift, then re-sampled. The indicator was explained to the operators and added to the daily check. And the filter selection now starts from the line flow table of Chapter 5, not from the pump's flow.

## Taking a sample that means something

A particle count is only as good as the sample. The press's procedure, written with the oil laboratory's instructions, takes samples:

- from a sampling valve on the return line upstream of the filter, with the press running and warm, so the sample represents what is circulating;
- after flushing the valve and the sample line with at least several times their own volume of oil into a waste container;
- into a clean, certified bottle from the laboratory, capped immediately;
- at the same point and the same stage of the cycle every time, so that results can be compared.

A sample taken from the bottom of the tank with a dirty tube measures the tube and the sludge, not the system. Water content and the oil's condition, such as oxidation, are worth asking the laboratory to test at the same time, especially in coastal and humid parts of Australia, where condensation in a reservoir that warms and cools each day adds water steadily.

## How this applies to a small Australian business

Choose an oil grade by checking its viscosity at the hottest running temperature and the coldest start against the pump maker's limits, not by habit. Put new oil in through a filter. Size return filters for the largest flow through them, which on a cylinder with a rod is the cap-end outflow, and at the coldest running viscosity. Treat a clogging indicator as a measurement. Sample oil regularly, from a live point, in a clean bottle, and trend the results, because a rising code is the earliest warning a hydraulic system gives.

## Exercise: the six-month sample

At six months, after the new filter and the clean-up, the laboratory counts **2,400, 610 and 70** particles per mL. What is the ISO 4406 code, and does it meet 18/16/13? The workshop considers adding a small offline filter loop with beta ratios of **4, 20 and 75**. What code would one pass through it give?

**Worked answer.** The [ISO 4406 tool](/tools/iso-cleanliness-code/) gives **18/16/13**, which meets the target exactly, with no margin at any size. One pass through the offline filter, in the [Hydraulic Filter Selection tool](/tools/hydraulic-filter-selection/), divides the counts by the beta ratios: 2,400 ÷ 4 = 600, 610 ÷ 20 = 30.5 and 70 ÷ 75 = 0.9 per mL, giving a downstream code of **16/12/7**. Running a loop continuously would hold the reservoir well below the target, which is worth more than its cost on a press whose valve has already shown signs of sticking.
