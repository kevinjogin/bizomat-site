---
book: connected-products-by-the-numbers
chapterSlug: platform-data-and-privacy
order: 7
title: "Platform, data and privacy"
description: "Design the platform's data model, timestamps and leak detection with numbers, combine readings with outside data, and apply Australian privacy principles to data about people's homes."
draft: false
---

The device measures; the platform turns measurements into decisions. It receives every message, checks it, stores it, analyses it and tells the owner what matters. Much of a connected product's value, and many of its risks, live there. A platform that stores times in the wrong zone, raises false alerts or treats data about people's homes carelessly can undo a well-engineered device.

This chapter designs the tank monitor's platform from the data up. It covers the data model and timestamps, the volume of data, the leak-detection analysis with its statistics, the combination of readings with outside data such as weather, and the Australian privacy principles that apply when data about water use is linked to a household. The failure case is a leak alert that went wrong on the first Sunday in October.

## What the platform does

This is an illustration. The tank monitor's platform has six jobs, each traced to function F10 from Chapter 2:

```figure
type: steps
title: From message to decision on the tank monitor's platform
caption: This is an illustration. Each step has its own tests, and a message rejected at the validation step is stored with its reason so the fault can be investigated.
- Ingest | receive messages over the secure session and acknowledge them
- Validate | check the specification revision, ranges, sequence numbers and timestamps; reject or flag
- Store | write each reading with its device, tank, time in UTC and quality flag
- *Analyse | convert depth to volume, estimate days remaining, look for leaks and battery burn
- Notify | send alerts by the owner's chosen channels, with repeat and escalation rules
- Present | show levels, trends and device health in the app, and let the owner export their data
```

## Model the data around the tank, not the device

A natural first data model ties readings to devices, because devices send them. That breaks the first time a device is replaced. The new unit has a new identity, and the tank's history appears to stop. The tank monitor's model puts the tank at the centre:

- a **tank** has an owner, an address, dimensions, a time zone and a history of the devices fitted to it;
- a **device** has an identity, hardware and firmware revisions, a battery history and the period it was fitted to each tank;
- a **reading** belongs to the device that took it and, through the fitting history, to a tank;
- an **event**, such as an alert, a calibration at overflow or a setting change, belongs to a tank or a device.

The calibration offset from Chapter 2 belongs to the fitting of a particular device on a particular tank, not to either alone, because it depends on where that device sits on that roof.

## Times in UTC, displayed locally

Every reading carries a time. The device's real-time clock drifts. A typical low-power crystal might be accurate to about **20 parts per million**, which is about **20 × 10⁻⁶ × 86,400 ≈ 1.7 s** a day, or about **52 s** a month. The device corrects its clock from the network's time at each check-in, so the drift never accumulates beyond about an hour's worth, a fraction of a second.

The platform stores every time in UTC, which has no daylight saving and no zones. It converts to local time only for display and for any analysis that depends on the owner's day, such as overnight leak detection. Australia makes this important. It has three main time zones, and daylight saving applies in some states and territories but not others: New South Wales, Victoria, Tasmania, South Australia and the ACT observe it, while Queensland, Western Australia and the Northern Territory do not. Each tank therefore stores a named time zone derived from its address, not a fixed offset, so that daylight saving changes are handled by the time-zone rules rather than by hand.

## How much data

The volume of data from a fleet of simple sensors is small by modern standards. This is an illustration. With **2,000** units, **48** readings a day each and about **30 bytes** per stored reading including database overhead, a year's readings take about **2,000 × 48 × 365 × 30 ≈ 1.05 GB**. That fits on any modern database without special effort.

Volume is therefore not the design problem. The design problems are correctness and context: every reading attached to the right tank, at the right time, with a quality flag that says whether to trust it. The general principles of storing machine and sensor data, including naming, context and retention, are set out in [Storing machine and sensor data in manufacturing](/reados/collections/manufacturing-operations-and-design-for-manufacture/storing-machine-and-sensor-data-in-manufacturing/), and they apply just as well to tanks as to factory machines.

The makers keep raw 30-minute readings for three years, then hourly averages for the life of the account. Owners can export their full history at any time, and deleting an account deletes its readings after a stated period.

## Detect a leak with statistics

The leak alert from Chapter 1 looks for water falling when nobody is using it. A single pair of readings is not enough, because R2 allows each reading to differ from the true level by up to ±5 mm, so the difference between two readings could be off by up to 10 mm. The platform instead fits a straight line through all the readings in the overnight window and looks at its slope.

```figure
type: formula
title: How well an overnight slope can be estimated
formula: standard error of slope = σ ÷ √Σ(tᵢ − t̄)²
caption: This is an illustration. σ = 2.5 mm is the assumed reading-to-reading standard deviation, consistent with R2's ±5 mm. Readings every 30 minutes from midnight to 5 am give 11 points.
- Readings | 11, at 0, 0.5, 1 … 5 hours
- σ | 2.5 mm, assumed
step: Σ(tᵢ − t̄)² = 0.25 × (5² + 4² + … + 4² + 5²) = 0.25 × 110 = 27.5 h²
step: standard error ≈ 2.5 ÷ √27.5 ≈ 0.48 mm/h
step: a 300 L overnight leak falls 29.5 mm in 5 h, about 5.9 mm/h, about 12 standard errors
```

A slope of about 0.48 mm an hour is the noise level of the estimate. The platform flags a possible leak when the overnight slope exceeds **2 mm/h**, about **20 L/h**, which is about four standard errors. That threshold rarely triggers by chance, yet it catches a leak of 300 L overnight easily, at about twelve standard errors. The threshold is a setting the makers can tune from the pilot fleet's data, as Chapter 9 shows.

The overnight window matters as much as the statistics. It must be a period when this household normally uses no water, in this household's local time.

## A failure case: the first Sunday in October

This is an illustration. During the pilot, the overnight window was coded as midnight to 5 am in Australian Eastern Standard Time for every tank. All pilot tanks were in New South Wales and Queensland, and through winter the alerts behaved well.

On the first Sunday in October, daylight saving began in New South Wales. From that night, the AEST window of midnight to 5 am fell at 1 am to 6 am local time for New South Wales owners. Several households started their morning showers and kettles before 6 am, and the platform saw the level fall in the window. False leak alerts rose sharply among New South Wales tanks. Queensland tanks, which do not observe daylight saving, were unaffected.

The detection was quick because the pattern was so clear. The alerts started on one date and affected one state but not its neighbour. The cause was a fixed offset where a named time zone was needed. The correction was to compute each tank's window from its own time zone. A further review found the same assumption in the days-remaining calculation's definition of a day, and in the time shown in alert messages. A later expansion to Western Australia would otherwise have put the window at 10 pm to 3 am local time, in the middle of the evening's use.

The lesson generalises: anything the platform calculates about a person's day must be calculated in that person's local time, and the test suite must include tanks in every Australian time zone across both daylight-saving transitions.

## Alerts people will act on

An alert is only useful if someone acts on it, and people stop acting on alerts that are often wrong or arrive too often. False alerts therefore cost more than the support calls they generate: each one trains the owner to ignore the next. The tank monitor's notification rules were written with that in mind.

This is an illustration. A low-level alert is sent once when the threshold is crossed and repeated only if the level keeps falling by a further 10% of capacity, not every hour. A possible leak is reported as a question, "Water fell 180 L between midnight and 5 am. Is anything running?", with buttons to confirm a known use, such as irrigation, which the platform then learns to expect. A rapid fall, the burst-pipe pattern, is sent immediately and repeated after 30 minutes if the fall continues, because that is the case where minutes matter. Device-health messages, such as a weak battery or an obstructed beam, go to the makers' service team first, and to the owner only when the owner needs to do something.

Each rule is a setting with a default, tested like the device settings in Chapter 6. The platform records every alert sent and the owner's response, if any. Those records feed Chapter 9's pilot review: an alert type that owners dismiss most of the time is a candidate for a different threshold or a different message.

## Combine readings with outside data

Data from the device becomes more useful when combined with data from elsewhere. The tank monitor's app shows the owner the rain forecast for their area beside the days-remaining estimate. If significant rain is forecast, the low-level alert says so, and the owner may choose to wait a day before ordering water. A fall in level after heavy rain is also suspicious: it points to a blocked gutter or inlet rather than high use, and the app can suggest checking.

Outside data has its own terms. Weather data, maps and address data come from providers with licences that specify how the data may be used, displayed and attributed, and whether commercial use is permitted or charged. The Bureau of Meteorology, for example, publishes conditions for the use of its data. The makers checked each provider's terms before building the feature and recorded them in the design file. A feature built on data the business is not licensed to use is a feature that may have to be switched off.

## Data about homes is data about people

Water use reveals how people live: when they wake, when they shower, when they go away. A record that links a tank's readings to a named owner at an address can be personal information, meaning information about an identified individual or one who is reasonably identifiable. The Australian Privacy Principles, administered by the Office of the Australian Information Commissioner, govern how covered organisations handle it. The Privacy Act generally applies to businesses with annual turnover above A$3 million and to some smaller businesses in particular circumstances. A small maker should check whether it is covered, with advice if needed.

The tank monitor's makers chose to design to the principles regardless of whether they were strictly covered. Their customers expected it, and the cost of building it in from the start was small.

```figure
type: compare
title: Privacy principles and the tank monitor's design
cols: What the principle is about | How the design responds
caption: This is an illustration of the makers' design choices, not legal advice. The Office of the Australian Information Commissioner publishes the full principles and guidance.
- APP 1 | open and transparent management | a plain-language privacy policy covering readings, location and how long they are kept
- APP 5 | notifying people when information is collected | the app explains, at sign-up, what the device collects and why
- APP 6 | use and disclosure | readings used for the owner's service; product planning uses only aggregated data with no address or name
- *APP 11 | security of personal information | encryption in transit and at rest, access limited by role, logs of staff access
- APP 12 and 13 | access and correction | owners can see and export their readings and correct tank details
```

The most important design choice is separation. The product-planning analysis that the makers want, how tanks are used across regions and seasons, does not need names or street addresses. The platform produces an aggregated dataset with tanks grouped by region and size, and that dataset is what the product team uses. The field data still replaces assumptions in planning the next product, without the planning team ever seeing who lives where.

## How this applies to a small Australian business

Small teams often build the platform last and fastest, but it is where most of the product's day-to-day behaviour is decided. Store times in UTC with a named zone for each site, design the data model around the thing being measured rather than the device, and test every calculation that depends on the time of day across every Australian time zone and both daylight-saving changes. Read the licence terms of every outside data source before building on it. Treat data about homes as personal information unless you are certain it is not, and keep product-planning data aggregated from the start, because adding privacy to an existing platform is much harder than designing it in.

## Exercise: a slower leak and fewer readings

The makers consider reducing overnight sampling to once an hour to save battery, giving 6 readings between midnight and 5 am. With σ = 2.5 mm, what is the new standard error of the slope? Would a dripping tap losing **100 L** over the 5 hours still exceed the 2 mm/h threshold, and by how many standard errors?

**Worked answer.** With readings at 0, 1, 2, 3, 4 and 5 hours, the mean time is 2.5 h, and **Σ(tᵢ − t̄)² = 2.5² + 1.5² + 0.5² + 0.5² + 1.5² + 2.5² = 17.5 h²**. The standard error is **2.5 ÷ √17.5 ≈ 0.60 mm/h**. A 100 L leak over 5 h is **100 ÷ 10.18 ÷ 5 ≈ 1.96 mm/h**. That is just under the 2 mm/h threshold, so it would not be flagged, although it is about **1.96 ÷ 0.60 ≈ 3.3** standard errors from zero. Even with half-hourly readings it would sit just under the threshold. To catch leaks this small, the platform could lower the threshold while requiring the slope to persist over two or three nights, which reduces false alerts without needing more readings.
