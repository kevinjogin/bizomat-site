---
book: connected-products-by-the-numbers
chapterSlug: choose-the-network-and-data-budget
order: 5
title: "Choose the network and data budget"
description: "Compare cellular, LoRaWAN, satellite and local options for a remote sensor, design a compact message, calculate monthly data and see how message design changes battery life."
draft: false
---

The network is the part of a connected product its makers control least. They do not build the towers, set the coverage, choose the frequencies or decide when an old technology is switched off. Yet the network's choice shapes battery life, running costs, where the product works and how long it will keep working. It deserves a decision with numbers, not a default.

This chapter chooses the tank monitor's network, designs its message, calculates its monthly data and shows how a careless message format nearly halved the battery life in the pilot. The physical side of the radio, antenna placement and signal strength in a real enclosure, is covered in the companion book's chapter on placing the antenna.

## What the product needs from a network

Start from the requirements, not from the technologies. This is an illustration. The tank monitor needs:

- **Coverage at rural tanks**, often a long way from a town and from the house. Tanks are commonly tens of metres from the house and sometimes hundreds.
- **Low energy per message**, because Chapter 4 showed that transmission dominates the battery budget.
- **Small amounts of data**, a few dozen bytes of readings an hour, with occasional larger downloads for software updates.
- **Delivery within minutes** for alerts (R5), not within seconds.
- **Some downlink**, to receive settings and software updates (F7).
- **A long future**, because units installed in the first year should still work ten years later.

## The options

```figure
type: compare
title: Network options for the tank monitor
cols: Coverage and infrastructure | Energy per message | Running cost model | Main risk
caption: This is an illustration of the team's comparison for rural Australia. Coverage, pricing and technology plans vary by operator and change over time; check each at the time of decision.
- *LTE-M (cellular) | operator's mobile network, broad rural coverage where 4G exists | low with power-saving modes | per-device plan | weak signal at fringe sites
- NB-IoT (cellular) | operator's network where it is enabled | very low for tiny messages | per-device plan | fewer operators and slower software updates
- LoRaWAN | public network where it exists, or your own gateway | very low | gateway cost or network subscription | no coverage without a gateway in range
- Satellite IoT | almost anywhere with sky view | higher, varies by service | per-message or per-device plan | newer services and pricing still settling
- Home Wi-Fi | only within range of the house | moderate, with connection overhead | owner's own internet | range to the tank and router changes
```

Each option is a reasonable choice for some product. The tank monitor's makers chose **LTE-M** because it uses the national mobile networks that most rural properties already depend on, it supports software updates at a useful speed, and its power-saving modes let a device stay registered on the network while sleeping. NB-IoT would use even less energy for tiny messages, but the makers wanted the faster updates and broader operator support of LTE-M at the time of the decision. LoRaWAN would have suited a farm willing to install its own gateway, and a satellite variant was recorded as a future option for properties beyond mobile coverage.

The decision was recorded with its assumptions, as Chapter 2 did for the sensing principle, so it can be revisited when coverage or pricing changes.

## Sleeping on the network

Cellular IoT technologies include features that let a device sleep without losing its place on the network. Two matter most.

**Power-saving mode** lets the device tell the network it will be unreachable for an agreed period. The radio switches almost completely off, then wakes, sends and listens briefly before sleeping again. The device does not need to reconnect from scratch each time, which saves energy and time.

**Extended discontinuous reception** lets the device listen for incoming messages at long, agreed intervals rather than constantly.

The consequence for the platform is that it cannot reach the device whenever it likes. A setting changed in the app at 2:10 pm will wait in the platform until the device next wakes and asks, at up to an hour later with hourly reporting. The platform must therefore queue messages for each device and the app must tell the owner that a change takes effect at the next check-in. That is a design decision the network choice forces on the software, and it belongs in the interface register.

## Design the message

The message is the product's main output, and its size affects both network cost and battery life. This is an illustration. The tank monitor's hourly message carries:

- a message sequence number, 2 bytes, so the platform can detect lost or duplicated messages;
- the time of the first reading, 4 bytes, in seconds;
- two readings, each with depth in millimetres (2 bytes), temperature (1 byte) and a quality flag (1 byte), 8 bytes in total;
- the charge used so far, 2 bytes, for R8;
- the signal strength at the last attempt, 1 byte;
- the firmware version and message specification revision, 2 bytes.

The payload is **2 + 4 + 8 + 2 + 1 + 2 = 19 bytes**. The device's identity is established by the network and the secure session, so it is not repeated in each payload.

The bytes on the network are more than the payload. Each message also carries network and transport headers and security overhead, and receives a short acknowledgement. Operators count all of it. The team measured about **200 bytes per message**, including headers, security and the acknowledgement, on their chosen operator's test plan.

```figure
type: formula
title: The tank monitor's monthly data budget
formula: data per month = bytes per message × messages per day × 30
caption: This is an illustration. Bytes per message include headers, security overhead and the acknowledgement, as measured on the operator's test plan. Alerts and software updates are budgeted separately.
- Payload | 19 bytes of readings and status
- On the network | about 200 bytes per message
- Messages | 24 a day, hourly
step: per month ≈ 200 × 24 × 30 = 144,000 bytes, about 144 kB
step: per year ≈ 200 × 24 × 365 ≈ 1.75 MB
step: a software update of 180 kB is larger than a month of readings
```

The software update is the surprise in the budget. A single firmware image of 180 kB is larger than a month of readings. Updates are therefore planned events, sent in batches across the fleet and budgeted in the data plan, as Chapter 6 describes.

## Store and forward when the network is down

Networks fail: a tower loses power in a storm, a unit's signal fades behind a new shed, an operator has an outage. A connected product should not lose its measurements because it could not send them for a while. The tank monitor keeps every reading until the platform has acknowledged it.

This is an illustration. Each reading takes 4 bytes of storage: depth, temperature and quality flag. At 48 readings a day, a week offline needs **48 × 7 × 4 = 1,344 bytes**, and a month needs **48 × 30 × 4 = 5,760 bytes**. The processor's non-volatile memory holds far more than that, so the tank monitor keeps up to **90 days** of readings and discards the oldest only if that fills.

When the connection returns, the backlog is sent in batches, oldest first, each batch with the time of its first reading so the platform can place every reading correctly. The batches are limited in size so that a long outage does not produce one enormous transmission that keeps the radio awake for minutes. The sequence numbers let the platform detect any gap and ask for the missing batch. The platform's charts show backfilled readings normally, but its alert logic treats them differently: a low level that occurred three days ago and has since recovered is history, not an alert.

Two rules follow for the design. Every reading must carry enough time information to be placed correctly, whenever it arrives. And the platform must never assume that readings arrive in order or on time. Both are written into the message specification.

## Survey coverage before you sell

The pilot's coverage failures in Chapter 4 came from installing first and measuring later. The makers then built a simple survey method, used before selling into a new region and repeated whenever a customer reported a problem.

A survey kit is a production unit in a weighted base, with firmware that sends a test message every two minutes and records the signal strength and the time each message takes. The surveyor places it where tanks typically stand, roof height, beside sheds and under trees, for at least an hour at each site, and the platform logs the results. A site is classed as good if test messages complete within the 4.5 s the battery budget assumes, marginal if they take up to twice as long and poor beyond that.

The classification links directly to the battery budget. A good site meets R6 with margin. A marginal site meets it only with the firmware's effort cap working. A poor site needs an external antenna, a different mounting point, or a different product, perhaps the satellite variant. The sales process uses the same classes, so that no customer at a poor site is sold a product the budget says will fail.

## Choose a data plan that fits the pattern

IoT data plans differ from phone plans. Some charge per device per month with a small allowance, some pool data across a fleet, and some charge per message or per kilobyte. The tank monitor's pattern of small, regular messages with occasional larger updates suits a pooled plan, where the fleet's total allowance absorbs the months when updates go out.

This is an illustration. The makers budgeted **A$1.20** a month per device, excluding GST, for connectivity, based on a quote for their expected fleet size. That figure feeds the cost-to-serve calculation in Chapter 10. It is the makers' illustrative figure, not a market price.

## A failure case: the message that grew tenfold

This is an illustration. The first pilot firmware was written quickly to get the units into the field. It sent each message as a text-based structure with descriptive field names, such as "depth_mm", "temperature_c" and "firmware_version", and it set up a fresh secure session for every message instead of resuming the previous one.

At the end of the first month, the operator's portal showed the pilot fleet had used about **ten times** its data budget. Each message was about **2,100 bytes** on the network instead of 200, so each unit used about **2,100 × 24 × 30 ≈ 1.5 MB** a month instead of 144 kB. The battery burn rate reported by the charge counters told the same story from the other side: each transmission was taking about **9 s** instead of 4.5 s, because the extra bytes and the handshake kept the radio awake.

The battery consequence was serious. At 120 mA for 9 s, 24 times a day, transmission used **7.2 mAh** a day. With sleep and measurement, the total was about **7.46 mAh**, giving a life of about **11.9 ÷ (7.46 × 0.365) ≈ 4.4 years**, below R6.

Two changes fixed it. The message became the compact binary format described above, defined in the controlled message specification of Chapter 2. And the firmware resumes its secure session when the network and security settings allow, rather than negotiating a new one each time. The next month's data fell to within the budget, and the transmission time fell to about 4.5 s.

```figure
type: bars
title: Data per device per month by message design
unit: kB
max: 1600
caption: This is an illustration. The verbose design was measured on the pilot's first month; the compact design on the second.
- Text fields, new secure session each message | 1512
- *Binary payload, resumed session | 144
```

The detection came from two independent signals, the operator's data report and the devices' own charge counters, and either alone would have been enough. Building both into the product from the start is cheap insurance.

## Plan for the network's future

Mobile technologies have lifetimes. Australia's 3G networks were closed by the major operators in 2024, and the government's business guidance warned that devices such as payment terminals, security systems and asset trackers would be affected. Products built on 3G a decade earlier stopped connecting unless their radios were replaced.

The tank monitor's makers asked their operator about the expected life of its LTE-M service, recorded the answer, and set the product's support period in Chapter 8 with that in mind. They also kept the radio module on a footprint shared by several makers' modules, so a future change of network technology would mean a new board revision rather than a new product. A connected product's support period cannot be longer than the life of the network it depends on, unless the product can be changed to use another one.

## How this applies to a small Australian business

Coverage maps for rural Australia are predictions, and they are most optimistic exactly where rural products are installed. Before committing to a network, take a prototype to a dozen representative sites and measure. Ask operators about their IoT plans' pricing structure, minimum terms and the expected life of the technology. Design the message as a controlled specification from the first prototype, because a quick text format in the pilot has a way of surviving into production. Finally, read the operator's terms for IoT plans as carefully as a supply contract: minimum terms, charges for inactive devices, what happens to devices when a plan is withdrawn and how much notice the operator gives before retiring a technology. Those terms decide part of the product's running cost and part of its lifespan, and they are much easier to negotiate before the fleet is installed than after.

## Exercise: alerts and a second sensor

The makers plan a second product that also reports rainfall from a tipping-bucket gauge, adding **3 bytes** to the payload. Assume each byte of payload adds one byte on the network. They also expect an average of **three alerts a week**, each a separate message of about 200 bytes. What is the new monthly data per device, using 30 days and four and a third weeks per month?

**Worked answer.** Hourly messages grow to about **203 bytes**, so they use **203 × 24 × 30 ≈ 146,160 bytes**. Alerts add **3 × 4.33 × 200 ≈ 2,600 bytes**. The total is about **148,760 bytes**, roughly **149 kB** a month, an increase of about 3% over the original 144 kB. The extra sensor and the alerts barely change the data budget. The bigger questions for the second product are the sensor's own energy use and whether the hourly message is still the right interval for rainfall, which can change much faster than tank level.
