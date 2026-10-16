---
title: "Rates of change and areas under curves: the practical ideas of calculus without heavy mathematics"
description: "How slopes and areas on charts give speeds, flow rates, energy, distance and accumulated cost, how to calculate them from data, and how optimisation finds the best batch or order size."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - process-improvement
  - operations
  - finance
author: "KEVOS"
featured: false
draft: false
---

Calculus has a fearsome reputation, but its two central ideas are everyday ones. The first is **rate of change**: how fast something is changing at a particular moment. Speed is the rate of change of distance, flow rate is the rate of change of volume, power is the rate of change of energy, and the cost of producing one more unit is the rate of change of total cost. The second is **accumulation**: adding up a quantity that changes over time. Distance accumulates from speed, energy from power, volume from flow and total cost from spending each week.

On a chart, a rate of change is the **slope** of a curve, and an accumulation is the **area under** it. Engineers, operations managers and analysts read slopes and areas from charts and data all the time, often without calling it calculus. Understanding the ideas clearly makes it easier to interpret meter readings, energy bills, production data and project progress, to calculate accumulated quantities from logged data and to find the best value of a decision variable, such as an order quantity or a batch size.

This article explains rates of change and slopes, accumulation and areas, how to estimate both from real data, how units behave, how optimisation finds minimum costs, and the traps of noisy data, with worked examples and no heavy algebra.

## Average rate of change

The **average rate of change** of a quantity over an interval is the change in the quantity divided by the change in time, or in whatever variable is on the horizontal axis:

average rate = (y₂ − y₁) ÷ (x₂ − x₁)

If a tank level rises from 90 cm to 150 cm between 10:00 and 14:00, it has risen at an average of 15 cm per hour. On a chart, this is the slope of the straight line joining the two points.

## Instantaneous rate of change

The rate at a particular moment, the **instantaneous** rate, is the slope of the curve at that point: the slope of the tangent line that just touches the curve there. Mathematically, it is the limit of the average rate as the interval shrinks to nothing, which is what calculus calls the **derivative**. In practice, it can be estimated from data by taking the average rate over a short interval around the moment of interest.

The distinction matters. A delivery truck may average 60 km/h over a trip but travel at 100 km/h on the highway and 20 km/h in town. A machine may average 40 kW over a shift but draw 90 kW when starting a heavy cycle. Electricity demand charges, motor sizing and capacity planning depend on peaks, not averages.

## Common rates in engineering and business

- **Speed** is the rate of change of position; **acceleration** is the rate of change of speed.
- **Flow rate** is the rate of change of volume or mass.
- **Power** is the rate of energy use or delivery: a kilowatt is one kilojoule per second.
- **Heating or cooling rate** is the rate of change of temperature.
- **Production rate** is the rate of change of cumulative output.
- **Marginal cost** is the rate of change of total cost with quantity: the cost of one more unit.
- **Burn rate** is the rate at which cash is spent.

Each rate has units of one quantity per unit of another, such as litres per minute or dollars per unit, and writing those units helps interpret it correctly.

## Accumulation and the area under a curve

If a rate is known over time, the total accumulated is the **area under the curve** of rate against time. Calculus calls this the **integral**. Simple cases are intuitive:

- A pump delivering a steady 20 litres per minute for 30 minutes delivers 20 × 30 = 600 litres, the area of a rectangle.
- A vehicle accelerating steadily from 0 to 20 m/s over 10 seconds covers the area of a triangle: ½ × 10 × 20 = 100 m.

When the rate varies irregularly, the area must be estimated from data.

## Units of slopes and areas

Units follow the arithmetic. A slope divides the units of the vertical axis by those of the horizontal axis: litres ÷ minutes gives litres per minute. An area multiplies them: kilowatts × hours gives kilowatt-hours; metres per second × seconds gives metres; newtons × seconds gives newton-seconds. Checking units confirms that a slope or area has been calculated with the right quantities.

## Estimating areas from data: the trapezoidal rule

Data from loggers, meters and sensors usually arrives as readings at intervals. The **trapezoidal rule** estimates the area under the curve by joining successive readings with straight lines and adding the areas of the resulting trapezoids:

area ≈ Σ (yᵢ + yᵢ₊₁) ÷ 2 × (xᵢ₊₁ − xᵢ)

The method is easy in a spreadsheet: for each interval, average the two readings, multiply by the interval length and sum. Shorter intervals give better estimates. Where the rate changes abruptly between readings, the estimate may be poor, and more frequent logging is needed.

## Energy from power data

Electricity bills charge for energy in kilowatt-hours, and often for peak demand in kilowatts. A power logger records kilowatts at intervals; integrating the readings gives energy. The [cutting energy use in business premises](/reados/collections/lean-and-continuous-improvement/cutting-energy-use-in-business-premises/) article explains how such data helps target savings. Comparing the average power with the peak shows whether a load is steady or spiky, which affects both demand charges and the potential of measures such as load shifting.

## Cumulative curves and S-curves

Plotting accumulated quantities over time produces **cumulative curves**. Project spending typically follows an **S-curve**: slow at first, rapid in the middle and slowing towards completion. The slope of the S-curve at any point is the spending rate. Comparing planned and actual cumulative curves, as in earned value management, shows whether work is ahead or behind and whether spending is running fast or slow. The [earned value](/reados/collections/project-estimates-schedules-and-costs/earned-value-what-it-shows-and-what-it-cannot/) article explains how these curves are used and their limitations.

## Filling and draining tanks

The level in a tank changes at a rate equal to the inflow minus the outflow, divided by the tank's cross-sectional area. If 60 litres per minute flow in and 45 flow out of a tank with a cross-section of 1.5 m², the net 15 litres per minute raises the level by 10 mm per minute. Reading this rate from level data gives the net flow without a flow meter, and integrating flow data over time gives volumes transferred. When outflow depends on the level, as with gravity drainage through an orifice, the tank drains quickly at first and more slowly as it empties, so the time to empty is longer than a simple average suggests.

## Condition trends in maintenance

Many maintenance decisions depend on rates rather than readings. A bearing temperature of 70 °C may be acceptable if it is stable, but worrying if it was 55 °C a month ago. Vibration levels, motor currents, filter pressure drops and tool wear all tell more through their rate of change than their current value. Plotting condition readings over time and watching the slope gives early warning of failure, and extrapolating the trend to an alarm limit estimates how long remains before action is needed.

## Cash as a rate

Cash flow is literally a rate: dollars per week or per month. The cash balance is the accumulation of that rate over time. A business with a healthy annual profit can still run out of cash if outflows run ahead of inflows for a period, as when stock is built up before a busy season or customers pay slowly. Projecting weekly net cash flow and accumulating it shows the lowest point the balance will reach, which is the figure that matters for overdraft limits and supplier payments.

## Finding the best value: optimisation

Many decisions involve a trade-off: increasing one quantity reduces one cost and increases another. The total cost is lowest where its rate of change is zero, the bottom of the curve, where increasing the decision variable slightly neither raises nor lowers the total.

A classic example is the **economic order quantity**. Ordering more units at a time reduces the number of orders, and therefore ordering costs, but increases the average stock held, and therefore holding costs. With annual demand D, cost per order S and holding cost per unit per year H, the total annual cost is:

total = (D ÷ Q) × S + (Q ÷ 2) × H

and its minimum, found where the slope is zero, is at:

Q = √(2 × D × S ÷ H)

The same reasoning applies to batch sizes, maintenance intervals, insulation thickness, pipe sizes and many other trade-offs. The [lean warehousing and material flow](/reados/collections/lean-and-continuous-improvement/lean-warehousing-and-material-flow/) article explains why lean practice often pushes order and batch sizes below the economic order quantity by reducing ordering and set-up costs.

## Noisy data and derivatives

Real data contains noise: random fluctuations from measurement and process variation. Calculating rates of change from noisy data amplifies the noise, because small random differences between successive readings are divided by short time intervals. Smoothing the data first, for example with a moving average, or calculating rates over longer intervals, gives more meaningful results. Areas, by contrast, tend to average out noise, which is one reason accumulated totals are often more stable than instantaneous rates.

## Rates that change: acceleration and trends

The rate of change of a rate is also useful. Acceleration is the rate of change of speed; a rising rate of defects or a slowing rate of sales growth signals a change in trend. Spotting when a rate itself is changing helps detect problems early, such as a bearing whose temperature is rising faster each week or a cash position falling at an increasing pace.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A manufacturer installs a power logger on its compressor and records hourly readings across an eight-hour shift: 0, 42, 45, 44, 30, 46, 47, 43 and 0 kW at the start of each hour and the end of the shift. Using the trapezoidal rule with one-hour intervals, the energy used is approximately:

(0 + 42) ÷ 2 + (42 + 45) ÷ 2 + (45 + 44) ÷ 2 + (44 + 30) ÷ 2 + (30 + 46) ÷ 2 + (46 + 47) ÷ 2 + (47 + 43) ÷ 2 + (43 + 0) ÷ 2 ≈ 297 kWh

The average power is about 37 kW, but the peak is 47 kW, and the dip at lunchtime shows that the compressor still draws 30 kW with most machines idle, a sign of leaks. Fixing leaks will reduce both the area under the curve and the idle load.

The same business reviews purchasing for a consumable used at 12,000 units a year, with an ordering cost of about $80 per order and a holding cost of about $2 per unit per year. The economic order quantity is √(2 × 12,000 × 80 ÷ 2) ≈ 980 units. The total annual cost is about $1,960 at that quantity, compared with about $2,420 when ordering 500 at a time and about $2,140 when ordering 1,500. The curve is flat near the minimum, so the business chooses 1,000 units to suit packaging, at almost no cost penalty.

## How this applies to a small Australian business

- **Distinguish averages from peaks** when sizing equipment and reading bills.
- **Integrate logged data** with the trapezoidal rule to find totals.
- **Check units** of every slope and area.
- **Use cumulative curves** to track project and production progress.
- **Look for the minimum of trade-off curves**, and remember they are often flat near the bottom.
- **Smooth noisy data** before calculating rates.

## Common mistakes

- **Sizing equipment on average rates** instead of peaks.
- **Calculating rates from raw, noisy readings.**
- **Using long logging intervals** for spiky loads.
- **Treating the economic order quantity as exact** rather than a flat optimum.
- **Mixing units** such as kilowatts and kilowatt-hours.
- **Ignoring changes in rates** that signal emerging problems.

## Frequently asked questions

**What is the difference between kW and kWh?** Kilowatts measure power, a rate; kilowatt-hours measure energy, the accumulation of power over time. A 10 kW load running for 3 hours uses 30 kWh.

**Is formal calculus needed to use these ideas?** No. Slopes and areas from data, the trapezoidal rule and simple optimisation formulas cover most practical needs. Calculus provides the theory and exact formulas behind them.

**Why is the cost curve flat near the economic order quantity?** At the minimum, the rate of change of total cost is zero, so small changes in quantity change the cost very little. That gives freedom to round order quantities to convenient sizes.

## Questions to ask

- Which of our decisions depend on peaks rather than averages?
- Do we log and integrate energy, flow or production data to find totals?
- Are our order and batch sizes near the bottom of their cost curves?
- Which rates in our business are changing in ways that deserve attention?
- How do we smooth noisy data before drawing conclusions?

## Bringing it together

The practical core of calculus is reading slopes and areas. Slopes give rates of change: speed, flow, power, marginal cost and trends. Areas give accumulations: distance, volume, energy and total cost. The trapezoidal rule estimates areas from logged data, units confirm that calculations make sense, and optimisation finds the bottom of trade-off curves such as the economic order quantity. Distinguishing averages from peaks, smoothing noisy data and watching for changing rates turn these ideas into better decisions.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
