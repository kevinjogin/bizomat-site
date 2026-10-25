---
book: welding-health-and-safety-by-the-numbers
chapterSlug: measuring-exposure
order: 3
title: "Measuring exposure to fume"
description: "Sample fume in the welder's breathing zone, calculate an eight-hour time-weighted average, compare it with the exposure standard as a ratio, and see why one sample proves little when exposures vary."
draft: false
---

A welder's exposure to fume cannot be judged by looking at the plume. Two welders doing the same job side by side can have exposures that differ several times over, because of how each holds their head, where they stand relative to the draught, how well the extraction is placed, and how long they actually weld. The only way to know is to measure: to draw air through a filter from inside the welder's helmet for a working shift, weigh and analyse what is collected, and compare the result with the exposure standard. Measurement turns the fume from a vague impression into a number, shows which tasks and people need controls first, and later shows whether the controls worked.

This chapter explains how fume exposure is sampled, calculates a time-weighted average over a shift, expresses it as a ratio to the exposure standard, and shows why exposures vary so much that one sample says little and several are needed.

## Sampling in the breathing zone

Exposure is measured where the welder breathes. A small battery-powered pump, worn on the welder's belt, draws air at a steady, calibrated rate through a filter in a holder clipped close to the welder's mouth and nose, inside the welding helmet if one is worn, because the helmet changes what reaches the face. The sample normally runs for most or all of the shift. Afterwards, the filter is weighed in a laboratory to find the mass of particulate collected, and analysed for specific metals such as manganese, chromium, hexavalent chromium, nickel and zinc where the work involves them. Dividing the mass collected by the volume of air drawn through the filter gives the average concentration over the sampling period.

Sampling is done by competent people, usually occupational hygienists, following recognised methods for welding fume and for each metal, because small errors in placement, flow rate or analysis make large differences to the result.

## The time-weighted average

Exposure standards for most airborne contaminants are set as eight-hour time-weighted averages: the average concentration over an eight-hour working day. A welder does not weld all day at one concentration, so the average combines the different parts of the shift, weighted by their duration.

```figure
type: formula
title: Eight-hour time-weighted average exposure, as a multiple of the exposure standard
formula: TWA = Σ (concentration in each period × duration of that period) ÷ 8 hours
caption: This is an illustration for a welder whose breathing-zone concentration was about four times the exposure standard during 6 hours of welding and about 0.2 times during 2 hours of other work, expressed as multiples of the standard so that no particular standard's value is assumed. Shifts longer than eight hours need adjusted standards, which the regulator's guidance explains.
- Welding | 6 hours at about 4 × the standard
- Other work | 2 hours at about 0.2 × the standard
step: TWA = (6 × 4 + 2 × 0.2) ÷ 8
step: TWA ≈ (24 + 0.4) ÷ 8 ≈ 3.05 × the standard
step: the welder's exposure is about three times the exposure standard
```

The ratio of the time-weighted average to the exposure standard is the clearest way to report a result. A ratio above one means the exposure exceeds the standard; well below one, it is comfortably within it; close to one, it is uncertain, because of the variation discussed below. The exposure standards themselves are published by Safe Work Australia and adopted under the laws of each jurisdiction, and they change from time to time as evidence accumulates, so the current values are always taken from the regulator's latest publication, never from older documents or memory.

## Exposure standards are not safe lines

An exposure standard is a limit that must not be exceeded, not a level below which there is no harm. For carcinogens, including welding fume as a whole, hexavalent chromium and nickel compounds, no level is known to be free of risk, and the duty is to reduce exposure as low as is reasonably practicable, not merely below the standard. The running case's coordinator treated any result above about half the standard as needing further controls, and any above the standard as needing immediate action.

## Exposures vary

Repeat a measurement on the same welder doing the same job on different days, and the results will differ, often by a factor of two or more between the lowest and highest. The welder's position, the parts, the draught from an open door, the extraction's placement and the hours of arcing all change from day to day. Exposures in a group of similar workers are usually spread in a skewed way, with most results clustered at the low end and a tail of high ones, which statisticians describe as lognormal.

```figure
type: bars
title: Six measurements of one welding task on different days
unit: time-weighted average as a multiple of the exposure standard
max: 2.5
caption: This is an illustration of the running case's flux-cored chassis welding before controls were improved. The geometric mean of the six is about 1.05 times the standard, and the spread suggests that more than half of all working days exceed it.
- Day 1 | 0.6
- Day 2 | 1.4
- Day 3 | 0.9
- *Day 4 | 2.3
- Day 5 | 1.1
- Day 6 | 0.7
```

A single measurement from this task could have been anything from 0.6 to 2.3 times the standard. Taken on day 1, it would have suggested the task was well within the standard; on day 4, more than twice over. Neither result on its own was the truth about the task, and either could have misled the shop badly. Together, the six results have a geometric mean of about 1.05 times the standard and a spread that, if exposures follow the usual pattern, puts more than half of working days above the standard and about one day in twenty above about 2.3 times. The task clearly needed better controls, which no single sample could have shown reliably, whichever day it happened to be taken.

## How many samples

There is no single right number, but one or two samples are rarely enough to show that a task is within the standard unless the results are far below it. Guidance from occupational hygiene bodies commonly recommends several samples for each group of workers doing similar work, with statistical tests that estimate the probability of exceeding the standard. The running case's hygienist took six samples for each of the shop's main welding tasks over several weeks, chosen to cover different days, welders and parts, and analysed them as groups.

## Grouping workers

Sampling every worker every day is impractical and expensive, so workers are grouped by similar exposure: welders on the same process, material and type of work, in the same area. A group is sampled, and its results applied to all its members. Grouping works only if the members really are similar; a welder who spends more time in an enclosed space, or who welds galvanised parts when others do not, belongs in a different group. The coordinator's groups were drawn up with the welders, who knew which jobs were dirtier than they looked.

## Metals as well as total fume

Total fume is only part of the picture. For stainless welding, the important measurement is hexavalent chromium, whose exposure standard is far lower than that for total fume, so a welder can be well within the standard for total fume and well above it for hexavalent chromium. For manganese-rich work, manganese is measured; for galvanised work, zinc. The samples are analysed for the metals that the consumables' safety data sheets and the base metals suggest, and each is compared with its own standard.

## Measuring after controls

Measurements are repeated after controls are installed, to see whether they work. In the running case, the flux-cored chassis welding was resampled after the extraction improvements of Chapter 4: six new samples had a geometric mean of about 0.3 times the standard and none above 0.6, a large and clear improvement. The comparison of before and after, both measured the same way, was the strongest evidence the coordinator had for the value of the extraction, and was used to justify extending it to other bays.

## Direct-reading instruments

Filter sampling gives an average over a shift, after a laboratory's delay. Direct-reading instruments, which measure airborne particles continuously by light scattering, show how concentrations rise and fall during the work, minute by minute. They do not measure the same thing as a filter sample and cannot replace it for comparison with exposure standards, but they are very useful for showing which parts of a task produce the most fume, whether an extraction arm is placed well, and how quickly a bay clears after welding stops. The hygienist used one alongside the filter samples to show the welders the effect of moving the extraction arm a few hundred millimetres.

## Planning a survey

```figure
type: checklist
title: The coordinator's plan for the fume exposure survey
caption: This is an illustration of the running case's survey plan, agreed with the occupational hygienist. The hygienist's methods and the regulator's guidance govern the detail.
- x Tasks and groups | every welding and cutting task listed; workers grouped by similar exposure
- x Contaminants | total fume plus the metals each task's consumables and base metals suggest
- x Number and timing | several samples per group, on typical and heavy days, across different welders
- x Conditions recorded | process, settings, parts, location, extraction use, hours of arcing, weather and doors
- x Placement | sampler inside the helmet, at the breathing zone, for the full shift where possible
- x Results | reported as time-weighted averages and ratios to each standard, with the group statistics
- *? Feedback | results explained to the welders sampled and to the committee, with the actions planned
```

The conditions recorded during sampling matter as much as the results, because they explain them. A high result on a day the extraction arm was out of reach, or the roller door was open in a gale, says something different from a high result on an ordinary day with everything in place. Without the conditions, a result is just a number; with them, it points to a cause.

## Telling the welders

The welders who wore the samplers are entitled to see their own results, and the shop's whole workforce to the survey's findings. The coordinator met each welder sampled to explain their results, what they meant and what would change, and presented the group findings to a shop meeting, with the hygienist present to answer questions. Welders who saw that their chassis bay was over the standard, and later that the extraction had brought it well below, became the extraction's strongest supporters, and complained when an arm was left out of position, which no notice on the wall had achieved.

## Keeping the records

Exposure records are kept for long periods, because the diseases they relate to may appear decades later, and the regulations set minimum retention times for records of exposure to some hazardous substances. The coordinator kept the hygienist's reports, the sampling conditions and the group statistics in the safety system, linked to each worker's record, so that a former welder's exposure history could be provided if they developed a related illness years later.

## When to measure again

Measurements are repeated when processes, consumables, locations or controls change; when the results were close to the standard; after an incident or complaint; and at intervals set by the risk, often every year or two for tasks near the standard. The coordinator's register set a resampling date for each task, with an earlier date for any task whose last results exceeded half the standard.

## Biological monitoring

For some metals, the amount absorbed into the body can be measured as well as the amount in the air, through blood or urine tests: chromium in urine for stainless welders, for example, or lead in blood where lead-painted work is cut or welded. Biological monitoring shows the dose actually absorbed, including any swallowed from dirty hands or breathed past a poorly fitting respirator, and so checks the whole system of controls. It is done under medical supervision, with the worker's consent and with results kept confidential, as Chapter 10 describes for health monitoring generally.

## The running case: the survey results

This is an illustration. The hygienist's survey found three tasks above the exposure standard for total fume: self-shielded flux-cored chassis welding in the enclosed bay, at a geometric mean of about 1.05 times the standard with the spread shown above; manual metal arc welding on galvanised fittings, with zinc exposures above its standard on two of six days; and gas metal arc welding inside large box sections, where the welder's head was close to the work and the extraction could not reach. Stainless welding was within the standard for total fume, but hexavalent chromium was above half its standard on several samples. The results set the order of the extraction work in Chapter 4 and the respiratory protection in Chapter 5.

## A failure: the one good sample

This is an illustration. At another shop, a single fume sample was taken on a quiet day when the welder had spent much of the shift on set-up, and it came back at about a third of the exposure standard. The shop's manager took it as proof that no controls were needed and filed it. A later survey, with several samples on normal working days, found the same task at about twice the standard on average.

One sample on an unrepresentative day had given false reassurance for two years. The lesson is that a sampling plan must cover typical and worst-case days, and several of them, before it can show that a task is within the standard.

## Exercise: a welder's time-weighted average

A welder's shift is 8 hours: 3 hours of welding inside a tank at about 6 times the exposure standard, 3 hours of welding in the open shop at about 1.2 times, and 2 hours of fitting and paperwork at about 0.1 times. What is the time-weighted average, as a multiple of the standard? Which part of the shift contributes most, and where should controls start?

The time-weighted average is (3 × 6 + 3 × 1.2 + 2 × 0.1) ÷ 8 = (18 + 3.6 + 0.2) ÷ 8 ≈ **2.7 times** the standard.

The welding inside the tank contributes 18 of the 21.8 parts, about **83%** of the day's exposure, although it is only three hours of the shift. Controls should start there: extraction or ventilation inside the tank, and, because the space is enclosed, supplied-air or powered respiratory protection as well, with the confined space controls of Chapter 8. Reducing only the open-shop exposure would barely change the average.
