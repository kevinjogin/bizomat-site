---
book: connected-products-by-the-numbers
chapterSlug: budget-the-battery
order: 4
title: "Budget the battery"
description: "Build a daily charge budget from sleep, measurement and radio currents, derate the cell honestly, find which requirement drives battery life and see what poor coverage does to it."
draft: false
---

A battery-powered connected product spends nearly all its life asleep and nearly all its energy awake. The few seconds a day its radio transmits can use more charge than the remaining twenty-three hours and fifty-nine minutes together. That is why battery life is decided less by the battery than by the design of the radio's behaviour: how often it wakes, how long it stays awake and what happens when the network is hard to reach.

This chapter builds the tank monitor's charge budget, derates the battery, calculates the life for several reporting schemes and shows which requirement drives the result. It then works through the pilot fleet's most expensive surprise: units at the edge of coverage that drained their batteries in just over a year.

## The battery

This is an illustration based on a real product class. The tank monitor uses one D-size primary lithium-thionyl chloride cell. A representative cell, Saft's LS 33600, is rated by its maker at a nominal 3.6 V and **17 Ah** under stated test conditions, with an operating range of −60 °C to +85 °C. Cells of this chemistry are popular in remote sensors because they hold a high capacity in a small volume and lose little charge in storage.

The same data sheet also shows the chemistry's weakness. Its continuous current is limited, and its pulse capability is modest, typically a few hundred milliamps for a fraction of a second. An LTE-M radio can draw peaks higher than that while transmitting. The tank monitor therefore pairs the cell with a buffer capacitor that supplies the short peaks and is recharged slowly from the cell between them. The cell sees a smoother, lower current, and the budget below is written in terms of the average current the cell supplies.

## Derate before you divide

The 17 Ah on the label is not what the product will get. Capacity depends on the current drawn, the temperature, the cut-off voltage the electronics can accept and years of slow self-discharge, which rises with temperature. The cell's maker publishes curves for these effects, and the honest approach is to apply them to the product's own conditions.

This is an illustration. The team assumed that **70%** of the nominal capacity would be usable over the product's life in a tank roof that reaches 60 °C in summer, giving **17 × 0.7 = 11.9 Ah**. The 70% figure is the team's assumption, informed by the maker's curves for this temperature and load. It is a design choice to be checked against the pilot fleet, not a property of the cell.

## Build the daily budget

The budget lists every state the device spends time in, the average current in that state and the time per day. Charge per day is current multiplied by time.

This is an illustration. The tank monitor's states:

- **Sleep.** Processor in its lowest-power mode with a real-time clock running, radio in its power-saving mode. **8 µA** for essentially 24 hours a day.
- **Measure.** Wake, power the transducer driver, take eight pings and read the thermistors. **25 mA** for **0.2 s**, **48** times a day (R3, every 30 minutes).
- **Transmit.** Wake the radio from its power-saving mode, send a batched message and receive any reply. **120 mA** average for **4.5 s** per message, **24** messages a day (R4, hourly).

```figure
type: formula
title: The tank monitor's daily charge budget, hourly reporting
formula: charge per day (mAh) = current (mA) × time per event (s) × events per day ÷ 3,600
caption: This is an illustration. The currents and times are invented but realistic in proportion. The transmit term dominates: about 93% of the daily charge for about 108 seconds of radio time a day.
- Sleep | 0.008 mA × 24 h ≈ 0.192 mAh
- Measure | 25 mA × 0.2 s × 48 ÷ 3,600 ≈ 0.067 mAh
- Transmit | 120 mA × 4.5 s × 24 ÷ 3,600 = 3.6 mAh
step: total ≈ 0.192 + 0.067 + 3.6 ≈ 3.86 mAh a day
step: per year ≈ 3.86 × 365 ≈ 1.41 Ah
step: life ≈ 11.9 ÷ 1.41 ≈ 8.4 years
```

```figure
type: stack
title: Where a day's charge goes, hourly reporting
unit: mAh
caption: This is an illustration. Halving the sleep current would save about 2.5% of the daily charge; shortening each transmission by one second would save about 21%.
- Transmit | 3.6
- Sleep | 0.192
- Measure | 0.067
```

At 8.4 years, the design meets R6's five years with a margin. The proportions say where effort pays. Shortening each transmission by one second, from 4.5 s to 3.5 s, saves **120 × 1 × 24 ÷ 3,600 = 0.8 mAh** a day, about 21% of the total. Halving the sleep current saves less than 0.1 mAh a day. Firmware time spent on the radio's behaviour is worth far more than time spent shaving microamps.

## Size the buffer for the peaks

The budget deals in averages, but the cell must also survive the radio's peaks. The buffer capacitor carries them, and its size follows from a simple charge balance. While the radio draws more than the cell can supply, the capacitor provides the difference, and its voltage falls by **ΔV = I × t ÷ C**, where I is the excess current, t its duration and C the capacitance.

This is an illustration. The radio's data sheet shows peaks of up to about 500 mA lasting up to about 10 ms during transmission. The team chose to let the cell supply no more than about 200 mA, so the capacitor must provide the remaining **300 mA** for **10 ms**. The electronics tolerate a droop of **0.3 V** before the radio's supply falls below its minimum. The capacitance needed is therefore **C = I × t ÷ ΔV = 0.3 × 0.010 ÷ 0.3 = 0.010 F**, or 10 mF.

Ten millifarads at about 4 V is more than ordinary ceramic or electrolytic capacitors provide in a small space. Products in this class commonly use a supercapacitor or a hybrid layer capacitor designed to pair with lithium-thionyl chloride cells. The capacitor has its own leakage current, which is a permanent load on the cell and belongs in the sleep line of the budget. It also has its own temperature limits and ageing. The tank monitor's budget includes a leakage allowance within the 8 µA sleep figure, and the capacitor's rated temperature covers the 60 °C tank roof.

## Shelf time and the first day

The budget starts at installation, but the cell starts ageing when the unit is made. A unit that sits in a warehouse for a year, or in a hot delivery van for a week, has lost some capacity before it measures anything. Lithium-thionyl chloride cells also form a passivation layer on their lithium surface during storage. It protects the cell but can make the voltage dip at the first heavy load after a long rest. The buffer capacitor helps here too, and the firmware's first boot charges the capacitor slowly before attempting the first network registration.

The team's plan treats shelf time as part of the derating: units are shipped within six months of manufacture, stored below the maker's recommended maximum storage temperature, and the charge counter starts from an allowance for the time since manufacture, read from the unit's build record.

## Which requirement drives the battery

The architecture in Chapter 2 traced R6, battery life, to R3 and R4, sampling and reporting. The budget makes that trace numerical. This is an illustration.

```figure
type: bars
title: Battery life by reporting interval and coverage
unit: years
max: 16
caption: This is an illustration using 11.9 Ah of usable capacity and the currents in this chapter. Poor coverage assumes 200 mA for 20 s per message, from repeated attempts and higher transmit power.
- Every 30 min, good coverage | 4.9
- *Hourly, good coverage | 8.4
- Every 2 h, good coverage | 14.4
- Hourly, poor coverage | 1.2
```

Reporting every 30 minutes, with each reading sent as soon as it is taken, would use **48 × 120 × 4 ÷ 3,600 = 6.4 mAh** a day for transmissions and give a life of about **4.9 years**, just short of R6. Batching two readings into an hourly message, which is what R4 allows, gives 8.4 years. Two-hourly reporting would give about 14.4 years, longer than the shelf and service life the team would rely on, so the extra battery life would not be worth the loss in timeliness.

The alerts in R5 add very little. They are sent at once when a reading crosses a threshold. Even at two alerts a week, they add about **2 ÷ 7 × 120 × 4.5 ÷ 3,600 ≈ 0.04 mAh** a day.

## Report the battery's state honestly

R8 asks every message to carry the battery's state, so the makers can schedule replacements. Lithium-thionyl chloride cells make that harder than it sounds. Their voltage stays almost flat for most of their life and falls only near the end, so measuring the voltage says little about the remaining charge until it is nearly gone.

The tank monitor therefore counts charge. The firmware knows how long it spent in each state and multiplies by the calibrated current for that state, keeping a running total of charge used. Each message reports that total, the estimated remaining charge against the 11.9 Ah usable figure and the cell's voltage under load. The voltage serves as a late warning in case the count drifts. Chapter 9 compares the count with cells measured in the laboratory after the pilot.

## A failure case: the units at the edge of coverage

This is an illustration. Fourteen months after the pilot fleet was installed, three units stopped reporting within a few weeks of each other. Their last messages showed estimated charge used of more than 11 Ah, eight times the expected rate.

All three were at properties at the fringe of the mobile network. Their logged signal strength was weak, and their transmission records told the story. Instead of one short attempt, each message often needed several attempts, each at high transmit power, and the radio stayed awake for 20 seconds or more waiting for the network. The average current while transmitting was about **200 mA** for about **20 s** per message.

At 24 messages a day, that is **200 × 20 × 24 ÷ 3,600 ≈ 26.7 mAh** a day. Adding sleep and measurement gives about 26.9 mAh a day, or about **9.8 Ah** a year. The usable 11.9 Ah lasted about **1.2 years**, around 14.5 months, almost exactly what happened.

The budget had assumed good coverage, and requirement R6 was written "at sites where installation confirms adequate signal". But the installation check did not exist yet. The pilot units were installed wherever owners wanted them. The corrections were:

1. **Measure signal at installation.** The app's installation steps now record the signal strength and the time a test message takes. Sites below a threshold are offered an external antenna or a different mounting position before the installation is accepted.
2. **Cap the radio's effort.** The firmware now limits how long the radio may try to send a message. If it fails, the readings are kept and sent with the next hourly message, and after repeated failures the unit backs off to a longer interval until conditions improve, then sends a catch-up batch. Alerts are always attempted.
3. **Watch the burn rate.** Each message's charge count lets the platform calculate each unit's daily consumption. A unit using more than twice the expected rate generates a service flag months before its battery would fail.

The third correction is the general lesson. A connected product can measure its own battery budget in the field and report deviations. Doing so turned an invisible failure into a predictable service visit.

## Primary cell or solar

A small solar panel with a rechargeable cell is the obvious alternative, and many tank sensors use one. The team compared the two:

- **Primary cell.** No panel to mount, aim, clean or shade. Predictable life in good coverage, finite in all cases, with a battery replacement visit or a sealed-unit replacement at end of life.
- **Solar and rechargeable.** Indefinite life if the panel gets enough sun. Rechargeable cells age with heat and cycling, so they also need replacing eventually. The panel adds a part, a cable and an exposure to hail and birds, and it fails in shade or under dust.

For a sensor in a tank roof, often under trees, the team chose the primary cell. The poor-coverage case shows that a primary design must still plan for its worst sites. Those sites are exactly where a solar option, offered as an accessory, earns its cost.

## How this applies to a small Australian business

Australian rural sites combine heat, which shortens battery life, with patchy coverage, which multiplies radio energy. A battery budget calculated for a city test bench will be optimistic. Build the budget as a short table of states, currents and times, derate the cell for the hottest place the product will sit, and design the firmware to report its own consumption. The cell maker's application engineers will usually review a budget for a commercial product, and their curves for temperature and pulse loads are worth reading before choosing a cell.

## Exercise: shorter, smaller messages

The firmware team believes they can cut the average transmission to **3.0 s** at **110 mA** by using the radio's power-saving features more aggressively and sending smaller messages (Chapter 5). With hourly reporting and good coverage, what is the new daily charge and battery life? If a cheaper cell offers only 13 Ah nominal, does R6 still hold with the same 70% derating?

**Worked answer.** Transmit charge per day is **110 × 3.0 × 24 ÷ 3,600 = 2.2 mAh**. Adding sleep and measurement, **0.192 + 0.067 + 2.2 ≈ 2.46 mAh** a day, or about **0.898 Ah** a year. With 11.9 Ah usable, the life is about **11.9 ÷ 0.898 ≈ 13.3 years**. With the cheaper cell, usable capacity is **13 × 0.7 = 9.1 Ah**, and the life is about **9.1 ÷ 0.898 ≈ 10.1 years**, comfortably above five years in good coverage. Before switching cells, check the cheaper cell's pulse capability, temperature derating and maker's support. And remember that the poor-coverage case, not the good-coverage case, sets the real margin.
