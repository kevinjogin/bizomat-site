---
book: heat-transfer-by-the-numbers
chapterSlug: heat-exchangers
order: 7
title: "Heat exchangers"
description: "Recover heat from waste water: an energy balance on both streams, a plate's overall coefficient, the log mean temperature difference, counterflow, area, effectiveness and fouling."
draft: false
---

A heat exchanger moves heat from one fluid to another without mixing them, across a thin wall. Every water heater, radiator, condenser and cooler is one. In a factory, the most valuable exchangers are often the ones that recover heat that would otherwise be thrown away: warm waste water, hot exhaust air, compressor cooling water. Sizing one needs every idea from the earlier chapters together. An energy balance says how much heat each stream gains or loses; convection on both sides and conduction through the wall set the overall coefficient; and because the temperature difference between the two fluids changes along the exchanger, a special average, the log mean temperature difference, links them.

This chapter sizes a heat recovery exchanger for HW-60. It balances the energy of the two streams, builds the overall coefficient of a stainless steel plate, calculates the log mean temperature difference for counterflow, shows why parallel flow cannot do the job, finds the area, checks it with the effectiveness method, allows for fouling, and estimates the saving. The failure case is an exchanger sized with clean coefficients that lost a fifth of its duty within months.

## The opportunity

HW-60's wash-down produces warm waste water. During wash-downs, about **1.0 kg/s** of it leaves the floor drains at about **60 °C**, through a grease trap and filter, to the trade waste sewer. At the same time, the water heater takes in about **0.8 kg/s** of cold mains water at **15 °C** to replace what is drawn. A plate heat exchanger between the two streams could preheat the mains water before it reaches the heater, so the heater has less to do.

The design target is to preheat the mains water to **45 °C**. This is an illustration.

## The energy balance

The heat gained by the cold stream equals the heat lost by the hot stream, ignoring the small loss from the exchanger's casing. Each is mass flow times specific heat times temperature change, as in Chapter 1.

- Cold side: **0.8 × 4.19 × (45 − 15) ≈ 100.6 kW**.
- Hot side: the same 100.6 kW leaves the waste water, so its temperature falls by **100.6 ÷ (1.0 × 4.19) ≈ 24.0 K**, from 60 °C to about **36.0 °C**.

The exchanger's **duty** is about **100.6 kW**. Every kilowatt of it is a kilowatt the water heater does not have to supply while wash-downs are running.

## The overall coefficient

Heat crosses three resistances in series: convection from the hot water to the plate, conduction through the plate, and convection from the plate to the cold water. For one square metre, the overall coefficient U is the reciprocal of their sum.

In a plate heat exchanger, thin corrugated plates create vigorous turbulence in narrow channels, so both convection coefficients are high. This book uses **7,000 W/m²·K** on each side, a teaching value for water in a plate exchanger. A stainless plate **0.5 mm** thick, at 17 W/m·K, adds **0.0005 ÷ 17 ≈ 0.00003 m²·K/W**. The total resistance is about **1 ÷ 7,000 + 1 ÷ 7,000 + 0.00003 ≈ 0.000315 m²·K/W**, giving U of about **3,170 W/m²·K**. The design uses a rounded **3,000 W/m²·K** for clean plates. That is several hundred times the U-value of HW-60's insulated tank wall in Chapter 2, which is exactly the point of an exchanger.

## The log mean temperature difference

The temperature difference between the two fluids is not constant along the exchanger. In **counterflow**, the fluids flow in opposite directions: the hot water enters at the end where the cold water leaves, and leaves where the cold water enters. At one end, 60 °C hot water meets 45 °C cold water, a difference of **15 K**. At the other, 36 °C hot water meets 15 °C cold water, a difference of **21 K**. The correct average for calculating heat flow is the logarithmic mean of the two end differences.

```figure
type: formula
title: Log mean temperature difference and area for HW-60's recovery exchanger
formula: LMTD = (ΔT₁ − ΔT₂) ÷ ln(ΔT₁ ÷ ΔT₂)        A = Q ÷ (U × LMTD)
caption: This is an illustration for counterflow, with a duty of 100.6 kW and a clean overall coefficient of 3,000 W/m²·K. The LMTD lies between the two end differences, a little closer to the smaller.
- End where hot enters and cold leaves | ΔT₁ = 60 − 45 = 15 K
- End where hot leaves and cold enters | ΔT₂ = 36.0 − 15 = 21.0 K
step: LMTD = (21.0 − 15) ÷ ln(21.0 ÷ 15) ≈ 6.0 ÷ 0.336 ≈ 17.8 K
step: A = 100,600 ÷ (3,000 × 17.8) ≈ 1.88 m²
```

A plate exchanger of about **1.9 m²** of plate area, clean, would do the job. That is a small unit, perhaps a few dozen plates, because the coefficient is so high. The supplier confirms the final plate count from their own tested data for the chosen plate pattern.

## Why counterflow

In **parallel flow**, both fluids enter at the same end and flow the same way. The hot water starts at 60 °C beside cold water at 15 °C, and the two approach each other as they travel. The cold water can never become hotter than the hot water leaving beside it. To preheat the mains water to 45 °C, the waste water would have to leave above 45 °C, but the energy balance says it must leave at about 36 °C. Parallel flow cannot achieve this duty at any size.

```figure
type: compare
title: Counterflow and parallel flow for the recovery duty
cols: Counterflow | Parallel flow
caption: This is an illustration. The cold outlet can exceed the hot outlet only in counterflow; that "temperature cross" is what makes counterflow essential for heat recovery between streams of similar temperatures.
- Flow directions | opposite | the same
- Temperature differences at the two ends | 15 K and 21 K | 45 K at the inlet end, shrinking towards zero
- Can cold leave hotter than hot leaves | yes: 45 °C against 36 °C | no: cold outlet stays below hot outlet
- Area for the 100.6 kW duty | about 1.9 m² | impossible at any area
- *Choice | yes | no
```

Plate heat exchangers are normally arranged in counterflow, which suits heat recovery well. Shell-and-tube exchangers, used for dirtier or higher-pressure duties, often have mixed flow patterns, and their LMTD is multiplied by a correction factor from the maker's or a textbook's charts.

## Effectiveness: a cross-check

A second way to describe an exchanger is its **effectiveness**: the heat it actually transfers divided by the most any exchanger could transfer between the same inlet temperatures. The most is set by the stream with the smaller heat capacity rate, mass flow times specific heat. Here that is the mains water, at **0.8 × 4.19 ≈ 3.35 kW/K**, which could at most be heated through the whole 45 K from 15 °C to 60 °C, about **150.8 kW**. The design duty of 100.6 kW is an effectiveness of about **0.667**.

The effectiveness method gives the same answer from the other direction. The exchanger's **number of transfer units**, NTU, is U × A divided by the smaller heat capacity rate: **3,000 × 1.88 ÷ 3,352 ≈ 1.68**. For counterflow with a capacity ratio of 0.8, the standard formula gives an effectiveness of about **0.667**, matching. The effectiveness method is the convenient one when the outlet temperatures are unknown, such as predicting how an existing exchanger will perform at a new flow.

## Fouling

Waste water from a food factory carries fats, proteins and fine solids, even after a grease trap and filter. They deposit on the plates and add a resistance, exactly as scale did in Chapter 4. If fouling lowered U from 3,000 to **2,000 W/m²·K**, the exchanger would need about **2.82 m²** to deliver the same duty. Designers add a **fouling allowance**, extra area for the expected deposits, and plan cleaning. HW-60's exchanger was specified with about **50%** extra area, about **2.8 m²**, and with plates that can be separated for cleaning, because the waste side was certain to foul. Fouling also narrows the channels, so the pressure drop across the waste side rises as deposits build. A pressure gauge either side of the exchanger, read weekly, gives a second warning alongside the outlet temperature, and the two together tell the maintenance team when cleaning is due rather than leaving it to a fixed calendar.

```figure
type: bars
title: Plate area for the 100.6 kW recovery duty
unit: m²
max: 3.2
caption: This is an illustration. Clean plates at 3,000 W/m²·K need about 1.88 m²; plates fouled to 2,000 W/m²·K need about 2.82 m². The specified unit, about 2.8 m², carries a 50% fouling allowance.
- Clean, U = 3,000 | 1.88
- Fouled, U = 2,000 | 2.82
- *Specified with allowance | 2.8
```

## Choosing the type of exchanger

Plate exchangers suit clean or moderately dirty water at modest pressures, and they are compact, cheap and easy to enlarge by adding plates. For very dirty streams with fibres or large solids, wide-gap plates or tubular designs clog less. Shell-and-tube exchangers suit higher pressures and temperatures and streams that must not leak at gaskets. Coil-in-tank designs, where a coil carries the cold water through a tank of warm waste, are simple and tolerant of dirt but large and slow. HW-60's waste water, after a grease trap and filter, suited a gasketed plate unit with wide-gap plates on the waste side, chosen with the supplier from their data for the expected solids.

## Controlling the recovered temperature

Heat recovery only happens while both streams flow. When the wash-down stops, waste water stops, and the mains water passes through the exchanger unheated, which is fine. The opposite case needs care: waste water flowing while no mains water is being drawn would simply pass through, warming nothing, unless the recovered heat is stored. HW-60's design sends the preheated mains water straight to the heater's inlet, where it is needed at the same time as the waste flows, so no extra storage is needed. Where the two streams do not coincide, a small preheat buffer tank can store recovered heat for later, at the cost of more equipment and its own heat losses.

## The saving

Wash-downs run about **4 hours** a day, **250 days** a year, so the exchanger recovers about **100.6 × 4 × 250 ≈ 100,600 kWh** a year. At about A$0.093 per kWh of delivered heat, that is about **A$9,370** a year. With an installed cost of about **A$18,000**, an illustration that includes the exchanger, filter, pumps, pipework and controls, the simple payback is about **1.9 years**. During wash-downs, the heater's load for heating the mains water falls from about **235 kW** worth of demand, the 0.8 kg/s heated from 15 °C to 85 °C, to about **134 kW**, from 45 °C, which also means the tank recovers between wash-downs faster.

## Food safety and separation

A recovery exchanger between waste water and the water used in a food factory needs more than heat transfer. If a plate cracked or a gasket failed, waste water could leak into the clean side. The design therefore keeps the clean water at a higher pressure than the waste water, so any leak runs from clean to waste, and the business's food safety plan and water authority requirements set the rest: separation, testing and backflow protection. Those requirements belong to the design from the start and are decided with people competent in them.

## A failure case: sized on clean coefficients

This is an illustration. At a sister plant, a similar recovery exchanger had been sized with clean coefficients and no fouling allowance, and with fixed plates that could not be opened. For the first few weeks it met its duty.

Within months, the plant's records showed the mains water leaving the exchanger at about **40 °C** instead of 45 °C. Using the effectiveness method, that fall matched a coefficient of about 2,000 W/m²·K: fouling had reduced the overall coefficient by about a third, and the recovered heat by about a sixth, from about 100.6 kW to about 84 kW.

The detection came from trending the exchanger's outlet temperature, which the plant logged. The correction was a cleaning-in-place procedure for the waste side, run weekly, and, at the next replacement, a larger, openable unit with a fouling allowance. The design standard for both plants now requires a fouling allowance on any exchanger handling waste or process water, and an outlet temperature trend to show when cleaning is due.

## How this applies to a small Australian business

Look for warm streams going to waste at the same time as cold streams need heating. Balance the energy first, to find the duty and the outlet temperatures. Build the overall coefficient from both sides' convection and the wall. Use counterflow, and the log mean temperature difference, to find the area, and check it with the effectiveness method. Add a fouling allowance and plan cleaning for any dirty stream. Estimate the saving from the hours the two streams actually coincide. And settle separation and contamination risks with competent people before anything is built.

## Exercise: a smaller target

The business considers a smaller exchanger that preheats the mains water only to **35 °C**, with the same flows and the same clean U of 3,000 W/m²·K. What is the duty, the waste water outlet temperature, the LMTD and the area? What is the annual saving?

**Worked answer.** The duty is **0.8 × 4.19 × (35 − 15) ≈ 67.0 kW**. The waste water falls by **67.0 ÷ 4.19 ≈ 16.0 K**, to about **44.0 °C**. The end differences are **60 − 35 = 25 K** and **44.0 − 15 = 29.0 K**, so the LMTD is **(29.0 − 25) ÷ ln(29.0 ÷ 25) ≈ 26.9 K**. The area is **67,000 ÷ (3,000 × 26.9) ≈ 0.83 m²**, less than half the 1.88 m² for the 45 °C target, because the temperature differences are larger. The annual saving is about **67.0 × 1,000 h × A$0.093 ≈ A$6,250**. The smaller unit costs less but recovers about two thirds as much heat.
