---
book: roof-drainage-by-the-numbers
chapterSlug: rain-and-the-design-storm
order: 1
title: "Rain and the design storm"
description: "Choose the storm a roof drainage system is designed for: intensity, a short duration and an annual exceedance probability, where Australian values come from and what they mean over a building's life."
draft: false
---

Every gutter, downpipe and box gutter is sized for a storm that has not happened yet. Nobody can say how hard it will rain on a particular roof next summer, so drainage is designed for a chosen **design storm**: a rainfall intensity that a storm of a given length is expected to exceed only rarely. Choose too mild a storm and the gutters overflow often. Choose too severe a storm for every part and the system becomes heavy, costly and hard to fit. The choice is not a guess. It rests on decades of rainfall records, a few clear definitions and a decision about what happens when the design is exceeded.

This chapter sets the design storm for the running case. It explains intensity, duration and annual exceedance probability, why roof drainage uses a very short duration, why two probabilities are used for two different jobs, where Australian design rainfall comes from, and what the probabilities mean over the life of a building. The failure case is an older shed whose gutters were sized from an hourly rainfall figure and overflowed in their first summer.

## The warehouse

The running case, W-40, is a light industrial warehouse with a simple gable roof. The numbers below carry through every chapter.

```figure
type: stats
title: The W-40 warehouse roof
caption: This is an illustration. Dimensions are in plan unless stated; the design intensities are round teaching values, not data for any real location.
- *40 m × 24 m | Roof in plan | gable roof pitched at 5°, ridge along the 40 m length
- 480 m² | Each roof slope in plan | 40 m by 12 m
- Rear eaves gutter | Back slope | discharging to downpipes on the rear wall
- Box gutter behind a parapet | Front slope | parapet 1.0 m above the roof, rainheads at each end
- 180 mm/h | 5-minute intensity, 5% annual exceedance probability | for gutter and outlet capacity
- 250 mm/h | 5-minute intensity, 1% annual exceedance probability | for overflow and the box gutter
```

## Intensity, duration and probability

A design rainfall has three parts.

**Intensity** is the rate at which rain falls, in millimetres an hour. An intensity of 180 mm/h does not mean 180 mm falls in an hour. It is a rate, like a speed, and it applies for the storm's duration.

**Duration** is the length of the burst the intensity applies to. Short bursts are more intense than long ones: a storm can rain very hard for five minutes and then ease, so the average intensity over an hour is much lower than the peak over five minutes. A design rainfall table gives a different intensity for each duration.

**Annual exceedance probability**, or AEP, is the chance that the intensity for that duration is exceeded in any one year. A 1% AEP storm has a one-in-a-hundred chance of being exceeded each year. Older documents called this a "100-year storm", a phrase that misleads people into thinking it happens once a century on schedule. It can happen twice in a month, or not at all for two hundred years.

## Why five minutes

A roof is a small, smooth, steep catchment. Rain falling on the far end of W-40's roof slope reaches the gutter within a minute or two, and the gutter carries it to an outlet within another minute or so. The flow in the gutter therefore follows the rain almost immediately. What matters is not the total rain in an hour but the heaviest few minutes, because that is when the gutter is fullest.

For that reason, Australian roof drainage design uses short-duration intensities. The ABCB Housing Provisions, Part 7.4, size eaves gutters for housing from the **5-minute** rainfall intensity. Larger roofs, where water takes longer to reach the outlets, can justify longer durations under the detailed methods of AS/NZS 3500.3, but five minutes is the usual starting point and the one used throughout this book.

```figure
type: bars
title: Rain falling in five minutes at three intensities
unit: mm
max: 25
caption: This is an illustration. Depth equals intensity × duration: 250 mm/h for 5 minutes is 250 × 5 ÷ 60 ≈ 20.8 mm. An hourly average of 60 mm/h gives only 5 mm in the same five minutes, which is why hourly figures undersize gutters.
- 60 mm/h, an hourly average | 5
- 180 mm/h, 5-minute, 5% AEP | 15
- *250 mm/h, 5-minute, 1% AEP | 20.8
```

## Two storms for two jobs

The Housing Provisions use two probabilities. Eaves gutters are sized to carry the **5% AEP** storm, provided they are not blocked. Overflow measures, which must send water away from the building when the gutter cannot cope, are sized for the **1% AEP** storm. The logic is worth understanding, because it applies to any building, including W-40, which is not a house.

A gutter that overflows outwards, over its front edge and away from the building, causes little harm. It is sensible to accept that happening in a storm that is exceeded about once every twenty years on average, rather than build every gutter for the most extreme storm. What must not happen is water going into the building. The overflow path is therefore designed for a rarer storm, so that even when the gutter is full or its outlet blocked, the water still goes outside.

Box gutters are different. They sit inside the line of the building's walls, behind parapets or between roofs, so any water that overtops them goes straight into the building. The Housing Provisions exclude box gutters and refer their design to AS/NZS 3500.3. This book treats W-40's box gutter conservatively and sizes it for the **1% AEP** intensity, so that it carries the rarer storm itself, not just its overflow.

## Where the numbers come from

In Australia, design rainfalls for any location come from the Bureau of Meteorology's **Design Rainfall Data System**, which publishes intensity-frequency-duration tables, usually called IFD tables. Entering a site's latitude and longitude returns a table of intensities for durations from one minute to several days and for a range of probabilities. The 2016 data set, the current one, replaced earlier tables and was derived from many more years of records and many more rain gauges than the tables it replaced.

For housing, the Housing Provisions list 5-minute intensities for many localities in their own table, which is convenient for small jobs. For anything else, the IFD table for the actual site is the starting point. Design rainfall varies a great deal across Australia, and even between suburbs of one city, so values from a different town, or from memory, have no place in a design.

The national flood guideline, Australian Rainfall and Runoff, discusses how design rainfall may change with a warming climate. For a building expected to last fifty years or more, it is worth asking whether today's design intensity will still be appropriate, and leaving some margin in the overflow paths, which are cheap to enlarge at design time and expensive to add later.

## Reading an IFD table

An IFD table is a grid. Its rows are durations, from a minute or so up to days. Its columns are probabilities, given as AEPs for rarer events and sometimes as exceedances per year for frequent ones. Each cell holds a rainfall depth in millimetres, an intensity in millimetres an hour, or both, depending on the option chosen. Three habits avoid most mistakes:

- **Check the units.** A depth of 20.8 mm in five minutes and an intensity of 250 mm/h describe the same storm. Mixing them up gives an answer twelve times too small or too large for a five-minute duration.
- **Read the right row and column.** The 5-minute row and the 5% and 1% AEP columns are the ones this book uses. The row above or below, or the neighbouring column, can differ by a quarter or more.
- **Use the site's own table.** A table generated for coordinates a few kilometres away may be close, or may not, particularly near coasts and ranges, where rainfall changes quickly over short distances.

The designer of W-40 downloads the table for the site's coordinates, saves it with the project's design documents, and highlights the two cells used.

## Record the design basis

The design storm is a decision, and decisions should be written down. W-40's drainage design note begins with a short design basis: the site's coordinates, the data source and its version, the duration, the two AEPs and their intensities, the date the table was obtained and who chose the values. Anyone checking the design later, or extending the building, can see at once what it was designed for. If the building is later found to flood in a storm smaller than its design storm, the note shows whether the fault lies in the design or the installation. The same note later records each calculation in this book: the catchments, the flows, the gutter and outlet checks, the box gutter, the overflow and the expansion joints. Kept with the building's maintenance records, it lets a future roof plumber replacing a gutter see what the original was meant to carry, instead of simply copying the profile that is there.

## What the design storm does not cover

A design rainfall describes water. It says nothing about three other things that fill gutters. **Hail** can fill a gutter or box gutter with ice faster than rain, and melting hail can block outlets for an hour after the storm has passed. **Debris**, leaves, seed pods and litter, reduces outlet capacity steadily between cleans. And **wind** drives rain against walls and parapets, adding water to roofs below them, which Chapter 2 accounts for. None of these appears in an IFD table. All of them argue for generous overflow paths and regular maintenance, which Chapters 6 and 8 address.

## What the probabilities mean over a building's life

A 1% chance a year sounds remote. Over the life of a building, it is not.

```figure
type: formula
title: The chance of at least one exceedance over a period
formula: chance in n years = 1 − (1 − AEP)ⁿ
caption: This is an illustration, assuming each year is independent. Over 50 years, the 1% storm has about a 40% chance of being exceeded at least once, and the 5% storm is almost certain to be.
- 5% AEP over 10 years | 1 − 0.95¹⁰ ≈ 40%
- 5% AEP over 50 years | 1 − 0.95⁵⁰ ≈ 92%
step: 1% AEP over 50 years = 1 − 0.99⁵⁰ ≈ 39.5%
step: the overflow will very likely be called on in the building's life
```

The numbers explain the two-storm approach. W-40's eaves gutter will almost certainly be overwhelmed at some point in a fifty-year life, so the question is not whether it overflows but where the water goes when it does. The overflow paths in Chapter 6 answer that. They are not a refinement for unlikely events; they are the part of the system most certain to be needed.

## Intensity to depth and flow

Intensity in millimetres an hour converts easily into depth and flow. Over five minutes, 250 mm/h deposits **250 × 5 ÷ 60 ≈ 20.8 mm** of water. On one square metre, a millimetre of rain is one litre, so 20.8 mm on one square metre is 20.8 litres. On W-40's 480 m² rear slope, that is nearly **10,000 litres** in five minutes, all of which must pass through the rear gutter and its outlets. Chapter 2 turns that into a flow rate in litres a second.

## A failure case: the hourly figure

This is an illustration. The owner of W-40 also owns an older shed across the yard. Its gutters were replaced a few years ago, and the person who sized them looked up "rainfall intensity" for the town and found a figure of about **60 mm/h**. It was the 1% AEP intensity for a one-hour duration, correct in itself and wrong for the job.

The gutters and outlets, sized for 60 mm/h, could carry only about a quarter of the flow from a 250 mm/h five-minute burst. In the first summer, a short, violent storm filled them in minutes. The front gutter, whose front edge had been set higher than its back edge to stop it looking crooked, overflowed backwards, into the eaves space and through the office ceiling.

The detection came from the water damage. The review found two errors. The duration was wrong: the intensity for one hour, not five minutes, by a factor of about **250 ÷ 60 ≈ 4.2**. And the overflow went the wrong way, because nobody had thought about where water goes when the gutter is full. The shed's gutters were replaced again, sized for the 5-minute intensity, with outlets checked as Chapter 4 describes and the front edges set lower than the back, as Chapter 6 requires.

## How this applies to a small Australian business

Owners and builders often treat gutter sizing as a matter of picking the usual profile. Start instead with the design rainfall for the actual site, from the Bureau of Meteorology's tables, for a short duration, normally five minutes. Use the more frequent storm, such as 5% AEP, to size gutters, and the rarer storm, such as 1% AEP, to size the overflow paths and any box gutter inside the building line. Never use an hourly intensity to size roof drainage. And think from the start about where water will go when the system is overwhelmed, because over a building's life it almost certainly will be.

## Exercise: a twenty-year lease

A tenant takes a 20-year lease on W-40. What is the chance that the 5% AEP five-minute intensity is exceeded at least once during the lease? And the 1% AEP intensity? How much rain falls on the rear slope in five minutes at the 5% AEP intensity?

**Worked answer.** For the 5% storm, the chance is **1 − 0.95²⁰ ≈ 64%**. For the 1% storm, it is **1 − 0.99²⁰ ≈ 18%**. Both are likely enough that the tenant should expect the gutters to be tested and should care where overflow goes. At 180 mm/h for five minutes, the depth is **180 × 5 ÷ 60 = 15 mm**, so the 480 m² rear slope receives **480 × 15 = 7,200 litres** in five minutes.
