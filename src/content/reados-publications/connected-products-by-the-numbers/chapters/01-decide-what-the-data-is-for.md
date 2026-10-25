---
book: connected-products-by-the-numbers
chapterSlug: decide-what-the-data-is-for
order: 1
title: "Decide what the data is for"
description: "Start a connected product from the decisions its data must support, then turn those decisions into numbered requirements for accuracy, timing, battery life and alerts."
draft: false
---

Connecting a product to a network is easy to start and expensive to finish. A sensor, a radio module and a cloud account can be put together in a week. Making the result last five years on a battery, give readings people trust and alert them in time to act is the real work, and it depends on knowing what the data is for. Without that, every requirement becomes a guess: how accurate, how often, how fast, for how long.

This chapter starts the tank monitor from the decisions its data must support. It separates what makes a product smart from what makes it connected, identifies the users and their decisions, and turns those decisions into a short set of numbered requirements. Each later chapter uses them.

## Smart, connected or both

Two ideas are often run together.

A **smart** product senses something and acts on it locally. A thermostat that switches a heater, a pump controller that stops on low level and a gearbox monitor that flags a vibration threshold are smart. Their intelligence lives on the device.

A **connected** product sends data somewhere else, where it is stored, combined and acted on. Its owner may never notice the connection, because its value is in what happens to the data afterwards: an alert on a phone, a service call booked before a failure, a better next product.

Most connected products are a little of both, and the balance is a design decision. Every decision made on the device saves radio time and battery but needs firmware and processing. Every decision made in the cloud is easier to change but needs data sent first. The tank monitor makes one decision locally, whether a reading crosses an alert threshold, and leaves everything else to the platform. Chapter 4 shows why that split matters for the battery.

## Start with the decisions

Ask who will use the data and what they will do differently because of it. If nobody's decision changes, the data is not worth sending.

This is an illustration. The tank monitor's makers interviewed twelve rural households and four small farms before writing a requirement. Three decisions came up repeatedly:

1. **Order water before it runs out.** In dry periods, households buy carted water. A carrier may need several days' notice in a drought. Running dry means no water for days.
2. **Find leaks and burst pipes early.** A split poly pipe or a stuck float valve can drain a tank in hours, often overnight, unnoticed until the morning.
3. **Plan use through the season.** Owners wanted to see how long the water would last at their current rate of use, especially before going away.

The makers had their own decisions too. They wanted to know when a unit's battery would need replacing, so that service could be scheduled. And they wanted to learn how the product was actually used, because their next product's features would otherwise rest on assumptions. Field data replaces assumptions in product planning only if the product is designed to collect it.

```figure
type: tree
title: From decisions to requirements for the tank monitor
caption: This is an illustration. Each requirement can be traced back to a decision someone makes with the data. A requirement with no decision behind it is a candidate for removal.
- Owner orders water before running out
  - Know the volume within a few hundred litres | absolute accuracy
  - Be told when the volume falls below a threshold | low-level alert
- Owner finds a leak or burst pipe early
  - See small falls when nobody is using water | repeatability and frequent sampling
  - Be told within the hour, day or night | alert latency
- Owner plans use through the season
  - See days remaining at the current rate | trend from regular readings
- Maker schedules battery service
  - Know each unit's battery state | battery reporting in every message
```

## Turn the tank into numbers

The tank sets the scale for every accuracy requirement. This is an illustration. The tank is a vertical cylinder **3.60 m** in diameter, so its plan area is **π × 1.80² ≈ 10.18 m²**. Each millimetre of water depth is therefore about **10.18 L**. At its 22,500 L capacity, the water is **22.5 ÷ 10.18 ≈ 2.21 m** deep.

```figure
type: stats
title: The tank monitor's tank in four numbers
caption: This is an illustration. Converting between depth and volume is the first calculation in every later chapter.
- 22,500 L | Capacity | at 2.21 m water depth
- 10.18 L | Per millimetre | 3.60 m diameter tank
- *±25 mm | Accuracy required | about ±254 L, 1.1% of capacity
- 0.25 m | Sensor above overflow | the sensor's minimum range
```

## The low-level alert

The first decision needs an alert early enough for water to arrive before the tank runs dry. This is an illustration. A household of four uses about **600 L** a day. In a drought, the local carrier needs up to **4 days'** notice. The owner wants a reserve of **1,000 L** left when the carted water arrives, for firefighting pumps and peace of mind.

```figure
type: formula
title: Setting the low-level alert threshold
formula: threshold volume = daily use × lead time + reserve        threshold depth = volume ÷ litres per mm
caption: This is an illustration. The app recalculates the threshold from the owner's recent daily use, so it rises in summer and falls in winter.
- Daily use | 600 L
- Carrier lead time | 4 days
- Reserve | 1,000 L
step: threshold volume = 600 × 4 + 1,000 = 3,400 L, about 15% of capacity
step: threshold depth = 3,400 ÷ 10.18 ≈ 334 mm of water
```

At ±25 mm of accuracy, the true volume at the moment of the alert is within about **±254 L** of 3,400 L. That uncertainty is smaller than half a day's use, so it does not change the owner's decision. That is the test for whether an accuracy requirement is tight enough: whether a reading at the edge of the tolerance would lead to a different decision.

## The leak alert

The second decision is harder. A burst pipe is dramatic: at, say, **1,500 L** an hour, the tank loses about **147 mm** of depth an hour. A slow leak is subtle: a dripping float valve might lose **300 L** overnight, about **29.5 mm** over several hours.

Detecting the slow leak does not need absolute accuracy. It needs **repeatability**: two readings of the same water level, taken an hour apart, must agree closely, so that a steady fall of a few millimetres an hour stands out from noise. The tank monitor's requirement is a repeatability of **±5 mm** between successive readings under stable conditions, separate from the ±25 mm absolute accuracy. Chapter 3 shows that the two are limited by different physics.

The leak alert also needs **frequent readings**. A fall over the hours when the household is normally asleep is the signature of a leak, so the platform needs readings through the night, not one a day. And it needs **timely delivery**. A burst pipe draining 1,500 L an hour empties a full tank in about 15 hours, so an alert must reach the owner within the hour.

## The requirements

The decisions above produce a short list of numbered requirements, each with a reason and a verification method.

- **R1 Accuracy.** Water depth within ±25 mm over the full range, across the operating temperature range. Verified by test against a measured reference in a test tank (Chapter 9).
- **R2 Repeatability.** Successive readings at a stable level within ±5 mm. Verified by a stable-level soak test.
- **R3 Sampling.** One level reading every 30 minutes, day and night.
- **R4 Reporting.** Readings delivered to the platform at least hourly.
- **R5 Alert latency.** A low-level or rapid-fall condition detected on the device reaches the platform within 35 minutes of occurring. That is one 30-minute sampling interval plus five minutes for transmission.
- **R6 Battery life.** At least 5 years at the reporting rate in R4, at sites where installation confirms adequate signal (Chapter 5).
- **R7 Environment.** Works from −5 °C to +60 °C at the tank roof, sealed to IP67.
- **R8 Battery reporting.** Every message carries the battery state.

There is no requirement for water quality, rainfall measurement or pump control. Each was suggested in the interviews and deliberately left out of the first product, because each would add sensors, power and cost for decisions only a few users made. Saying what the product will not do is part of the requirements.

## A failure case: the daily report

This is an illustration. The makers' first concept, sketched before the interviews, sent one reading a day. The reasoning was battery life: one transmission a day would make a small battery last for many years.

The interviews showed the flaw. Two of the sixteen properties had lost a tankful to a burst pipe in the previous five years, and in both cases it happened overnight. A once-daily reading, taken at a fixed time, could report a full tank at 6 am and an empty one at 6 am the next day. The owner would learn about the leak a day after the water was gone.

The error was detected by asking users what had gone wrong with their water, not what features they wanted. It was corrected by writing R3, R4 and R5 from the leak decision and then designing the battery and radio to meet them, not the other way round. Chapter 4 shows that the battery can still last over five years with hourly reporting if the transmissions are designed carefully.

## Who pays shapes what you build

A connected product has running costs that a disconnected one does not: network access for every unit, a platform to receive and store the data, an app to maintain and people to answer questions. Someone must pay for those for as long as the product is supported. How they pay changes the requirements.

The tank monitor's makers chose a hardware price plus a monthly subscription, covered in Chapter 10. That choice pushed several requirements in a particular direction. Because the makers carry the network cost for every unit every month, the amount of data each unit sends matters to their margin, which favours batching readings and keeping messages small (Chapter 5). Because a failed unit means a support call and a cancelled subscription, reliability and remote diagnosis matter more than they would for a one-off sale (R8 exists partly for this). And because the subscription is a promise of ongoing service, the support period becomes a commitment the makers must be able to keep, which Chapter 8 shows is also a legal obligation for consumer products in Australia.

A one-off sale with no subscription would have pushed the other way: no recurring income to pay for the network, so perhaps a cheaper network with less coverage, or a product that only connects when the owner opens the app nearby. Neither model is right in general. The point is that the business model is a design input, and it should be decided before the requirements are frozen, not after.

## List the assumptions you will test

Every requirement above rests on assumptions, and some of them will be wrong. Listing them openly turns them into things to test rather than things to defend.

This is an illustration. The tank monitor's assumption list after the interviews included:

- Household use of about 600 L a day, falling close to zero between midnight and 5 am. If many households run irrigation or stock troughs at night, the overnight leak signature will be weaker.
- A carrier lead time of up to four days in a drought.
- Adequate LTE-M signal at the tank in most installations. Rural tanks often sit behind sheds or in gullies, so this is the assumption most likely to fail.
- Headspace air temperatures up to about 45 °C in summer, which affect the ultrasonic measurement (Chapter 3).
- Owners will act on an alert within a few hours.

Each assumption has a way to test it: from the pilot fleet's own data, from installation records or from follow-up interviews. Chapter 9 shows how the pilot fleet's data replaced several of them with measurements and changed one requirement as a result.

## Keep the requirements traceable

Each requirement should trace back to the decision that justified it and forward to the design parts and tests that satisfy it. This is how the team can answer, months later, why the battery is the size it is, or whether a proposed cost saving would break a promise to users. The general method for writing testable, traceable requirements is set out in [Requirements that can be traced and tested](/reados/collections/project-planning-and-control/requirements-that-can-be-traced-and-tested/). Chapter 2 extends it to the functions, logical blocks and physical parts of a connected product.

## How this applies to a small Australian business

Small companies building connected products are often tempted to add every sensor the hardware could support, because the incremental part cost looks small. The real cost is in power, firmware, testing, data handling and support, and it grows with every feature. A dozen conversations with real users, asking what went wrong rather than what they want, usually yield three or four decisions worth supporting. Write the requirements from those, and keep a list of ideas deliberately deferred so they are not quietly added later.

## Exercise: a bigger household

A farm household of six uses about **1,100 L** a day in summer, the carrier needs **5 days'** notice, and the owners want a **2,000 L** reserve. Using the same 22,500 L tank, calculate the alert threshold in litres and in millimetres of water depth. What fraction of the tank's capacity is it, and what does that suggest about the tank size for this household in a drought?

**Worked answer.** The threshold volume is **1,100 × 5 + 2,000 = 7,500 L**, which is **7,500 ÷ 22,500 ≈ 33%** of capacity. In depth it is **7,500 ÷ 10.18 ≈ 737 mm**. The alert fires when the tank is still a third full, and a full tank lasts only about **22,500 ÷ 1,100 ≈ 20 days**. The household will order water often in a drought, and the alert will be frequent. The data suggests a second tank or water-saving measures. That is the kind of conversation good data enables, and the app's days-remaining estimate supports it directly.
