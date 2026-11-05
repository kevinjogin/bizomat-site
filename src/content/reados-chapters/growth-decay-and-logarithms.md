---
title: "Growth, decay and logarithms in engineering and business: compounding, cooling, depreciation and learning curves"
description: "How exponential growth and decay describe compounding, demand growth, cooling, discharge, depreciation and learning curves, how logarithms solve for time, and why straight-line intuition fails."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - finance
  - strategy
  - process-improvement
author: "BIZOMAT"
featured: false
draft: false
---

Some quantities change by a fixed amount each period: a machine that produces 100 parts a day makes 500 in five days. Others change by a fixed **percentage** each period: money growing at 5% a year, demand rising 8% a year, a hot part losing a fixed fraction of its excess temperature each minute, or the time to build each unit falling by a constant percentage every time output doubles. The second kind of change, called **exponential**, behaves very differently from the first. It starts slowly, then accelerates or decays in ways that straight-line intuition consistently underestimates.

Exponential growth and decay appear in finance, operations, engineering and science. Compound interest, inflation and discounting are exponential. So are many cooling and heating processes, the discharge of capacitors, radioactive decay, the decline of an asset's value under diminishing-value depreciation, and learning curves in production. **Logarithms**, the inverse of exponentials, answer the questions that follow naturally: how long until an investment doubles, how many years until demand exceeds capacity, how long a part takes to cool to a safe temperature.

This article explains exponential growth and decay, compounding and the rule of 72, cooling and discharge with time constants, half-lives, diminishing-value depreciation, learning curves and the use of logarithms to solve for time, with worked examples.

## Linear and exponential change

**Linear** change adds a constant amount each period: y = y₀ + k × n. **Exponential** change multiplies by a constant factor each period:

y = y₀ × (1 + r)ⁿ

where r is the growth rate per period as a decimal and n the number of periods. If r is negative, the quantity decays.

The difference compounds quickly. Starting with 10,000 and adding 500 a year gives 15,000 after ten years. Growing at 5% a year, which is 500 in the first year, gives 10,000 × 1.05¹⁰ ≈ 16,290 after ten years, and the gap widens every year after that.

```figure
type: bars
title: Ten years from 10,000: adding 500 or growing 5%
max: 17000
caption: Both start with 500 in year one; compounding pulls ahead every year after.
- Adding 500 a year | 15000
- *Growing 5% a year | 16290
```

## Compounding

Compound interest is the classic example: interest earned is added to the balance and earns interest itself. The same arithmetic applies to inflation in prices, escalation clauses in contracts, growth in demand and reinvested earnings. When rates are quoted per year but compounded more often, the effective annual rate is slightly higher than the nominal rate.

Discounting runs compounding in reverse: a future amount is divided by (1 + r)ⁿ to find its present value. That is the basis of net present value calculations, explained in the [NPV, IRR and payback](/reados/collections/investment-appraisal-and-business-cases/npv-irr-and-payback-answer-different-questions/) article.

## Doubling time and the rule of 72

The time for a quantity growing at r per period to double is:

n = log 2 ÷ log(1 + r)

A quick approximation is the **rule of 72**: divide 72 by the percentage growth rate. At 8% a year, doubling takes about 72 ÷ 8 = 9 years; the exact figure is about 9.0 years. At 3%, doubling takes about 24 years. The rule works well for rates between a few per cent and about 20%.

The rule is a powerful check on forecasts. Demand growing at 12% a year doubles in about six years and quadruples in about twelve. A site that will run out of capacity when demand doubles has only six years to plan an expansion.

## Exponential decay and half-life

Decay reduces a quantity by a constant fraction each period. The **half-life** is the time for a quantity to fall to half its value. After one half-life, 50% remains; after two, 25%; after three, 12.5%. Radioactive materials, some chemical reactions and the concentration of certain substances in the body follow this pattern. The same logic describes the falling share of an old product range or the decay of an unused skill.

## Cooling, heating and time constants

When a hot object cools in still surroundings, its excess temperature above the surroundings often falls approximately exponentially:

T = T_ambient + (T_initial − T_ambient) × e^(−t ÷ τ)

where e is the mathematical constant about 2.718 and τ is the **time constant**, which depends on the object's mass, heat capacity, surface area and the conditions around it. After one time constant, the excess temperature falls to about 37% of its starting value; after three, to about 5%; after five, to under 1%.

The same form describes the charging and discharging of capacitors, the response of many temperature sensors and the way some tanks fill or drain through restrictions. Knowing the time constant allows estimates of how long to wait before handling parts, how quickly a sensor responds or how long a system takes to settle.

## Diminishing-value depreciation

Under the **diminishing-value** method, an asset's value falls by a fixed percentage of its remaining value each year:

value after n years = cost × (1 − rate)ⁿ

In Australia, the tax rules for many depreciating assets set the diminishing-value rate by reference to the asset's effective life, commonly 200% divided by the effective life in years. An asset with a ten-year effective life would then depreciate at 20% a year, so a $60,000 machine would be written down to about 60,000 × 0.8³ = $30,720 after three years. Tax treatment depends on the asset and the rules in force, so accounting advice should be followed. The [depreciation, capital spending and the weight of heavy assets](/reados/collections/reading-financial-statements/depreciation-and-capital-intensity/) article explains how depreciation affects business decisions.

## Learning curves

In production, the time or cost to make each unit often falls by a constant percentage every time the cumulative output doubles. This is a **learning curve**. On an 85% learning curve, the second unit takes 85% of the time of the first, the fourth 85% of the second, the eighth 85% of the fourth, and so on. Mathematically:

time for unit n = time for unit 1 × n^b

where b = log(learning rate) ÷ log 2. For an 85% curve, b ≈ −0.234. If the first unit takes 40 hours, the eighth takes about 40 × 0.85³ ≈ 24.6 hours.

Learning curves matter for quoting first production runs, setting realistic targets and understanding why costs fall as volumes grow. They also explain long-run cost declines in technologies such as solar panels and batteries, discussed in the [learning curves and zero fuel cost](/reados/collections/engineering-history-modern-era/learning-curves-and-zero-fuel-cost-solar-wind-and-batteries/) article.

## Inflation and real values

Inflation compounds like interest. Prices rising at 3% a year increase by about 16% over five years and about 34% over ten. A fixed amount of money therefore buys less each year, and comparisons across years should use **real** values, adjusted for inflation, rather than **nominal** values. A long-term contract with a fixed price loses real value every year unless it includes escalation. When evaluating projects, cash flows and discount rates should both be expressed consistently, either both nominal or both real, to avoid overstating or understating value.

## Reliability and constant failure rates

For components that fail at random rather than by wearing out, the probability of surviving to time t follows an exponential decay:

reliability = e^(−t ÷ MTBF)

where MTBF is the mean time between failures. A component with an MTBF of 5,000 hours has about e^(−0.2) ≈ 82% probability of running 1,000 hours without failure. The same model shows why a stated MTBF does not mean every unit lasts that long: about 63% of such components fail before reaching their MTBF. Wear-out failures, by contrast, cluster later in life and need different models and maintenance strategies.

## Growth in food and biological processes

Bacteria in food can multiply rapidly in favourable temperatures, roughly doubling at regular intervals under good conditions. A few doublings make little difference, but many doublings turn a small population into a dangerous one. This exponential behaviour is the reason food safety rules limit the time food spends in the temperature range where bacteria grow quickly, and why cooling and holding times are specified rather than left to judgement.

## Logarithms: solving for time

A **logarithm** answers the question "to what power must a base be raised to give this number?" The base-10 logarithm of 1,000 is 3, because 10³ = 1,000. The **natural logarithm**, written ln, uses base e. Logarithms turn multiplication into addition and powers into multiplication, which is why they solve exponential equations.

To find how long it takes for a quantity growing at rate r to reach a target, take logarithms of both sides of y = y₀ × (1 + r)ⁿ:

n = log(y ÷ y₀) ÷ log(1 + r)

For example, to find how long until demand growing at 6% a year triples, n = log 3 ÷ log 1.06 ≈ 18.9 years. Spreadsheet functions LOG, LN and EXP perform these calculations, and the NPER function solves for the number of periods in financial problems.

## Logarithmic charts

Exponential growth plotted on an ordinary chart curves upwards steeply, making early values look flat and recent values dramatic. Plotted with a **logarithmic vertical axis**, exponential growth becomes a straight line, and the slope shows the growth rate. Logarithmic charts make it easy to compare growth rates, spot changes in rate and display quantities that span several orders of magnitude.

## Growth does not continue forever

Real growth is limited by markets, capacity, resources and competition. Many quantities follow an **S-curve**: slow early growth, a period of rapid, nearly exponential growth and then a slowdown as limits are approached. New product adoption, the spread of technologies and the filling of a market commonly behave this way. Forecasts that extend a period of exponential growth indefinitely are a frequent source of over-investment.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A powder-coating business is planning capacity. Demand has grown at about 8% a year for several years, and the current oven runs at about 55% of its capacity. By the rule of 72, demand doubles in about nine years, which would exceed the oven's capacity. More precisely, demand reaches capacity when 1.08ⁿ = 1 ÷ 0.55, so n = log(1.818) ÷ log(1.08) ≈ 7.8 years. Allowing for peaks above average demand, the owner plans a decision point in about five years.

In the same review, the owner checks cooling time. Parts leave the oven at about 180 °C in a 25 °C workshop. Trials show a time constant of about 20 minutes for the typical part. After 30 minutes, their temperature is about 25 + 155 × e^(−1.5) ≈ 60 °C, still too hot to handle without gloves, so the packing station is moved further down the conveyor to allow more cooling time.

```figure
type: stats
title: Planning an oven and a packing station with exponentials
caption: Demand grows about 8% a year and the oven runs at about 55% of capacity.
- About 7.8 years | Until demand reaches oven capacity | decision point planned at about five years
- *About 60 °C | Parts 30 minutes after leaving the oven | from 180 °C, time constant 20 minutes
```

Finally, the business is quoting a new product. The first unit is expected to take 40 hours, and an 85% learning curve is assumed from similar past work, so the eighth unit should take about 24.6 hours. The quote for the first batch of eight uses the cumulative hours, not the steady-state figure.

## How this applies to a small Australian business

- **Use the rule of 72** to sense-check growth forecasts and capacity plans.
- **Model compounding explicitly** for escalation, inflation and growth.
- **Estimate time constants** for cooling and settling processes from trials.
- **Account for learning curves** when quoting first production runs.
- **Use logarithms or NPER** to solve for time in growth problems.
- **Compare years in real terms**, adjusting for inflation.
- **Expect growth to slow**, and test forecasts against market limits.

## Common mistakes

- **Treating percentage growth as linear.**
- **Extending exponential growth indefinitely.**
- **Quoting new products at steady-state times.**
- **Handling parts after a fixed time** without checking cooling.
- **Mixing nominal and effective rates.**
- **Mixing real and nominal values** in project evaluations.
- **Reading exponential charts on linear axes** and misjudging change.

## Frequently asked questions

**Why does the rule of 72 work?** Because the natural logarithm of 2 is about 0.693, and for small rates, log(1 + r) is close to r. Using 72 rather than 69.3 improves accuracy for typical rates and divides evenly by many numbers.

**What is a time constant?** The time for an exponentially changing quantity to complete about 63% of its total change. After five time constants, the change is more than 99% complete.

**Do learning curves apply to services?** Often, yes. Repeated tasks such as installations, inspections and reports usually become faster with experience, though the rate varies.

**Does an MTBF of 5,000 hours mean a component lasts 5,000 hours?** No. For random failures, about 63% of components fail before reaching their MTBF, and some fail very early. MTBF describes an average rate of failure across many components, not the life of any one.

## Questions to ask

- Which of our forecasts assume compounding growth, and for how long?
- When does projected demand reach our capacity?
- Are our first-batch quotes adjusted for learning?
- How long do our parts or products take to cool or settle, and do we know the time constant?
- Are our project cash flows and discount rates both nominal or both real?
- Do our charts make growth rates easy to compare?

## Bringing it together

Exponential growth and decay change by a constant percentage each period, which makes them behave very differently from linear change. Compounding, discounting, demand growth, cooling, discharge, half-lives, diminishing-value depreciation and learning curves all follow this pattern. The rule of 72, time constants and logarithms turn these relationships into practical estimates of doubling times, cooling times and capacity limits. Recognising exponential behaviour, and remembering that growth eventually slows, leads to better forecasts and fewer surprises.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations. This article is general information and does not constitute tax or accounting advice.*
