---
book: viscosity-by-the-numbers
chapterSlug: choosing-a-viscosity-grade
order: 4
title: "Choosing a viscosity grade"
description: "Use ISO viscosity grades, a machine maker's viscosity window and the machine's temperature range to choose an oil grade, check it with the WORKOS tool, and avoid a heavier-is-safer choice."
draft: false
---

Most oil-filled machines arrive with a recommended grade, and most of the time it is right. Problems arise when a machine is moved to a hotter or colder place, when its duty changes, when the recommended product is unavailable or when someone decides that a heavier oil will give more protection. Each of these needs the same check: does the chosen grade keep the oil's viscosity inside the machine's limits at every temperature the machine will see?

This chapter explains the ISO viscosity classification and the other grading systems an engineer meets, sets out what a machine maker's viscosity window means, and works the grade choice for HPU-40 across three candidate grades. It uses the WORKOS lubricant viscosity check, which applies Chapter 3's relation to both ends of the window at once, and ends with a summer complaint that nearly led to a heavier oil than the machine needed.

## The ISO viscosity classification

Industrial oils, including hydraulic, turbine, compressor, gear and circulating oils, are classified by ISO 3448 according to their kinematic viscosity at 40 °C. Each ISO viscosity grade, written as ISO VG followed by a number, is named after the midpoint of a band, and an oil belongs to the grade if its viscosity at 40 °C lies within ten per cent either side of that midpoint. The grade numbers step up by roughly half each time, so the bands of neighbouring grades do not overlap and there is a small gap between them.

```figure
type: range
title: ISO viscosity grade bands at 40 °C, the grades used in hydraulics
min: 15
max: 115
unit: mm²/s
ticks: 15 | 40 | 65 | 90 | 115
caption: Each grade's band is its midpoint plus or minus 10%. Confirm limits for a particular grade against the standard or the oil maker's data; data sheets usually give a typical value within the band.
- ISO VG 22 | 19.8 | 24.2
- ISO VG 32 | 28.8 | 35.2
- * ISO VG 46 | 41.4 | 50.6
- ISO VG 68 | 61.2 | 74.8
- ISO VG 100 | 90 | 110
```

The classification says nothing about viscosity at any other temperature, about additives, about the type of base oil or about quality. Two oils of the same grade can behave quite differently when hot or cold, as Chapter 3 showed, and two oils of the same grade and similar viscosity index can differ in anti-wear performance, water separation, filterability and oxidation life. Grade is the first filter in choosing an oil, not the last.

Other grading systems serve other machines. Automotive engine oils use the SAE J300 classification, with winter grades defined by low-temperature tests and summer grades by viscosity at 100 °C and at high shear; automotive gear oils use SAE J306; some industrial gear specifications use AGMA numbers. None of these grades converts exactly to an ISO grade, because each is defined by different measurements at different temperatures. Where a machine maker specifies one system and a supplier offers another, the reliable comparison is the oil's measured viscosity at the machine's working temperatures, calculated as in Chapter 3 from each data sheet.

## The machine's viscosity window

A machine maker's viscosity limits express what each part of the machine needs. A hydraulic pump, for example, has three needs that pull in different directions.

```figure
type: compare
title: What sets each limit in a hydraulic pump's viscosity window
cols: HPU-40's pump maker | What happens beyond it
rowhead: Limit
- Cold-start maximum | 1,000 mm²/s | The pump cannot fill its pumping chambers; it cavitates, is noisy and may be damaged
- Preferred upper limit | 36 mm²/s | Higher friction and pressure losses, more heat and slower response; usually acceptable briefly
- Preferred lower limit | 16 mm²/s | Thinner films on sliding parts, more leakage and lower volumetric efficiency
- Short-term minimum | 10 mm²/s | Films too thin for reliable separation; wear and loss of efficiency accelerate
caption: This is an illustration. Values are of the kind pump makers publish; the press shop's pump data sheet is fictional. Always use the actual maker's data.
```

The window is set by viscosity, not temperature, and that is the key to using it. A pump maker cannot know where the machine will be installed or how hot it will run. The user's job is to find the temperatures the oil will see, convert them into viscosities for each candidate grade, and choose the grade whose viscosities fall inside the window.

Where several components share one oil, as in any hydraulic system, the window is the intersection of their windows. Motors, valves, seals and filters each have their own limits, and the narrowest set wins. Filters deserve a mention: a filter's pressure drop in laminar flow is proportional to viscosity, so a filter sized at the running viscosity can open its bypass valve on a cold start, passing unfiltered oil, which Chapter 7 discusses.

## The temperatures HPU-40 sees

The temperatures to use are the oil's own temperatures where it matters, not the air temperature. For HPU-40 the press shop recorded the reservoir temperature through a year.

```figure
type: stats
title: HPU-40's oil temperatures through the year
caption: This is an illustration. Reservoir temperatures; the oil inside the pump's sliding parts runs somewhat hotter than the reservoir, which leaves a margin to the limits as a matter of good practice.
- 5 °C | Cold start | winter morning after a weekend
- 50 °C | Normal running | most of the year
- * 65 °C | Summer peak | hottest afternoons, before any cooling upgrade
- 83.9 °C | VG 46 reaches 10 mm²/s | must never be approached
```

The reservoir temperature underestimates the temperature in the pump's clearances and bearings, where the oil is sheared and heated as it passes. Pump makers usually express their limits in terms of the oil at the pump's inlet or in its case, and their data sheets say which. The press shop does not have a case drain temperature measurement, so it applies the reservoir temperatures and keeps a few kelvin of margin at the hot end.

## Three grades compared

This is an illustration. The candidates are ISO VG 32, 46 and 68 oils of the same type, whose data sheets give 32.0 and 5.4 mm²/s, 46.0 and 6.8 mm²/s, and 68.0 and 8.6 mm²/s at 40 °C and 100 °C. Fitting Chapter 3's relation to each and evaluating it at HPU-40's temperatures gives the following.

```figure
type: compare
title: Three grades at HPU-40's temperatures
cols: Cold start, 5 °C | Normal, 50 °C | Summer peak, 65 °C | Within the window?
rowhead: Grade
- ISO VG 32 | 229.0 mm²/s | 21.5 mm²/s | 13.0 mm²/s | Summer peak below the preferred 16 mm²/s
- * ISO VG 46 | 382.5 mm²/s | 30.0 mm²/s | 17.4 mm²/s | Yes, at all three temperatures
- ISO VG 68 | 678.2 mm²/s | 42.7 mm²/s | 23.7 mm²/s | Normal running above the preferred 36 mm²/s
caption: This is an illustration. Walther relation through each oil's 40 °C and 100 °C values; window 16 to 36 mm²/s preferred, 10 mm²/s minimum, 1,000 mm²/s at a cold start.
```

The same result can be shown as the band of oil temperatures over which each grade sits within the pump's preferred range.

```figure
type: range
title: Oil temperatures at which each grade is between 16 and 36 mm²/s
min: 30
max: 80
unit: °C
ticks: 30 | 40 | 50 | 60 | 70 | 80
caption: This is an illustration. HPU-40 runs at 50 °C normally and 65 °C at its summer peak; VG 46's band, 45.6 °C to 67.6 °C, covers both.
- ISO VG 32 | 37.3 | 58.4
- * ISO VG 46 | 45.6 | 67.6
- ISO VG 68 | 54.1 | 76.9
```

VG 46 is the right grade, and by a clear margin at the cold end: its cold-start viscosity of 382.5 mm²/s is 2.6 times below the 1,000 mm²/s limit. Its weakness is the summer peak, where it is only 9% above the preferred minimum. VG 32 would start more easily but would fall below the preferred minimum on every hot afternoon. VG 68 would keep a thicker film in summer but would run above the preferred maximum all year, at the cost of extra heat and pressure loss, and would cut the cold-start margin to 1.5 times.

## Checking a grade with the tool

The [lubricant viscosity check](/tools/lubricant-viscosity-check/) performs the whole check in one step. It takes the oil's two data sheet viscosities and specific gravity, the operating temperature with the least viscosity the machine needs there, and the cold-start temperature with the largest viscosity it can accept. It returns both viscosities, the dynamic viscosity and Saybolt equivalent, the ratio of operating viscosity to the minimum, and a verdict.

This is an illustration. For HPU-40's summer peak, the inputs are 40 °C and 46 cSt, 100 °C and 6.8 cSt, a specific gravity of 0.8396, an operating temperature of 65 °C with a least viscosity of 16 cSt, and a cold start at 5 °C with a largest viscosity of 1,000 cSt.

```figure
type: steps
title: Lubricant viscosity check for HPU-40 on VG 46 at its summer peak
caption: This is an illustration. The tool applies one specific gravity to both temperatures; the dynamic viscosity at the cold start is therefore slightly low and only the kinematic values should be compared with the limits.
- Viscosity at 65 °C | 17.41 cSt (14.62 cP, about 81 SUS)
- Ratio to the least needed | 17.41 ÷ 16 = 1.09
- Viscosity at the 5 °C start | 382 cSt, against a limit of 1,000 cSt
- Extrapolation check | Both temperatures are within the tool's range of the data points
- * Verdict | GRADE SUITABLE
```

Using 16 mm²/s, the preferred lower limit, as the "least viscosity needed" is a deliberate choice. The pump maker's absolute minimum is 10 mm²/s, and against that the ratio would be 1.74. Checking against the preferred limit gives an early warning, and the press shop's rule is that the summer peak should not drop below it. The ratio of 1.09 says that HPU-40 is close to that line: a few kelvin more and it crosses.

## Using the margins

A grade check produces two margins, one hot and one cold, and they are not of equal value. The cold-start margin protects against a rare event, a cold morning, and has an easy remedy: run the pump unloaded for a few minutes, or fit a small reservoir heater, until the oil warms. The hot margin protects against a daily condition and has no remedy short of cooling the oil or changing the grade. For HPU-40 the cold margin of 2.6 is generous and the hot margin of 1.09 is thin, which suggests that the long-term answer to the summer peak is to reduce the oil temperature, not to thicken the oil.

## The error: a heavier oil for summer

This is an illustration. During a hot February the press operators complained that HPU-40 became slower and noisier on the hottest afternoons, and a lubricant supplier's representative suggested changing to VG 68 "for better protection in the heat". The production manager was ready to agree, reasoning that a thicker oil could only help.

The reliability engineer ran the lubricant viscosity check for VG 68, with 68.0 and 8.6 cSt, before the change. At the summer peak it passed comfortably, with 23.7 cSt and a ratio of 1.48 to the preferred minimum. But a second check at the normal running temperature of 50 °C, with the preferred maximum of 36 cSt as the limit to stay below, showed 42.7 cSt, above the preferred band, on every ordinary day of the year. At the cold start the viscosity would be 678 cSt, still within the limit but with the margin cut from 2.6 to 1.5. And Chapter 7's calculation for the lines showed that the extra viscosity would add to the pressure drops and therefore to the heat the oil had to shed, raising its temperature.

The check turned a vague "more protection" into numbers. VG 68 would have fixed a problem that occurs on a dozen afternoons a year by moving the machine outside its preferred range on the other three hundred days. The engineer instead traced the summer peak to an undersized cooler, which Chapter 9 sizes, and kept VG 46. The slowness and noise on hot afternoons were the pump's internal leakage rising as the oil thinned, which Chapter 8 calculates, and both disappeared when the cooler held the oil at 55 °C. The lesson the press shop recorded is that a grade change must be checked at every temperature the machine sees, not only at the one that prompted it.

## Changing grade or product in service

A grade decision is only half done when the new oil is chosen; it also has to reach the machine without creating a mixture nobody intended. Draining a hydraulic system never removes all of the old oil. Pipes, cylinders, accumulators, coolers and the pump's case hold a share of the volume, often a tenth or more in a system with long lines, and the first fill of new oil mixes with it.

This is an illustration. If HPU-40 had been changed from VG 46 to VG 68 and 15 L of the old oil had stayed in its lines, cylinders and cooler, the 120 L reservoir fill would have become a mixture of about 11% VG 46 and 89% VG 68. Chapter 10 shows how to estimate a blend's viscosity; for this mixture it would be about 65 mm²/s at 40 °C instead of 68, still within the VG 68 band. A mixture is rarely a problem of viscosity when the grades are close. It is more often a problem of additives: anti-wear chemistries, detergents and demulsifiers from different makers are not always compatible, and an incompatible mixture can form deposits or foam.

The press shop's practice for any change of product is to ask the new supplier to confirm compatibility with the old oil in writing, to drain the reservoir and as much of the system as is practical, to flush if the supplier recommends it, to label the reservoir with the new product and the date, and to take a sample after a week of running for the baseline that Chapter 10 relies on. A change of grade also means updating the machine's lubrication chart, the stores' stock and the top-up containers kept near the machine, because a top-up from the wrong drum is the commonest way a machine ends up on a grade nobody chose.

## A grade selection record

Each grade decision at the press shop now leaves a short record, which takes ten minutes to complete and saves the argument being repeated with every new supplier.

```figure
type: checklist
title: Grade selection record for an oil-filled machine
caption: Keep it with the machine's lubrication schedule and repeat it whenever the duty, location or oil changes.
- Machine maker's viscosity window | Each limit with its source, and which temperature it refers to
- Oil temperatures | Cold start, normal running and peak, measured where possible
- Candidate grades | Each with its data sheet values at two temperatures
- Viscosity at each temperature | From the Walther relation or the lubricant viscosity check
- Margins | Hot margin to the preferred minimum, cold margin to the start limit
- Other requirements | Anti-wear, seal compatibility, water separation, filterability and any approvals the machine maker requires
- ? Decision and reason | Recorded with the date and the name of the approver
```

## Bringing it together

ISO viscosity grades classify industrial oils by their viscosity at 40 °C in bands ten per cent either side of each grade number. A machine maker's viscosity window, set by what its parts need, is the standard to compare against, and the comparison must be made at the oil's real temperatures. For HPU-40, VG 46 keeps the oil inside its pump's preferred range from 45.6 °C to 67.6 °C, which covers its normal and peak running, with a generous cold-start margin and a thin hot margin. Heavier is not safer: it moves the problem rather than solving it. The next chapter looks at what else changes viscosity in a machine: pressure, shear and the additives that some oils rely on.

## Exercise: VG 32 for a cooled machine

After the cooler upgrade in Chapter 9, HPU-40's oil will run at about 43 °C normally and no hotter than 55 °C. Check whether a VG 32 oil (32.0 cSt at 40 °C, 5.4 cSt at 100 °C) would then be suitable, using the lubricant viscosity check with the preferred minimum of 16 cSt at 55 °C and the cold-start limit of 1,000 cSt at 5 °C. Would it be the better choice?

**Worked answer.** This is an illustration. The tool gives 18.0 cSt at 55 °C, a ratio of 1.12 to the 16 cSt minimum, and 229 cSt at the 5 °C start, well below 1,000 cSt: **grade suitable**. At the normal 43 °C, VG 32 runs at 28.2 cSt, inside the preferred band, while VG 46 would run at 40.2 cSt, above it. With the cooler fitted, VG 32 fits the window slightly better at normal running, starts more easily and wastes less energy in the lines. But its hot margin, 1.12, depends on the cooler always working. The press shop decides to stay on VG 46 until the cooler has run through a summer, then review, which is the kind of decision the grade selection record exists to capture.
