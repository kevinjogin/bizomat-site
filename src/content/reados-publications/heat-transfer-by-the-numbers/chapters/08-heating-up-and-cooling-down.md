---
book: heat-transfer-by-the-numbers
chapterSlug: heating-up-and-cooling-down
order: 8
title: "Heating up and cooling down"
description: "Estimate how fast tanks, pipes and parts heat and cool with the lumped model and its time constant, check when the model applies, decide whether to switch heat off overnight, and watch dead legs."
draft: false
---

Steady heat flow answers the question of how much heat is lost while everything stays at temperature. Many practical questions are about change instead. How long will the tank take to heat from cold on Monday morning? How hot will it still be after a weekend? How quickly does water sitting in a branch pipe go lukewarm? Should the heater be switched off overnight, or left on? These are transient problems, in which the heat stored in the water or the metal matters as much as the heat flowing out. The simplest model that answers them, the lumped model, needs only two numbers: the heat capacity of the thing and the UA value of its insulation.

This chapter applies the lumped model to HW-60. It sets out the model and its time constant, calculates how the tank cools overnight and over a weekend with and without insulation, estimates the warm-up time with losses included, checks when the model can be trusted, compares leaving the heater on with switching it off, and works out how fast water cools in a dead leg. The failure case is a little-used hose station whose branch held lukewarm water for most of each day.

## The lumped model

If an object's temperature is nearly uniform throughout, as in a well-mixed tank of water, its heat balance is simple: the rate at which its stored heat falls equals the rate at which it loses heat.

**C × dT/dt = −UA × (T − T_ambient)**

Here **C** is its heat capacity, mass times specific heat, in J/K, and **UA** is the overall heat transfer coefficient multiplied by area, in W/K, which is simply the steady loss divided by the temperature difference. The solution is an exponential approach to the surroundings' temperature:

**T(t) = T_ambient + (T₀ − T_ambient) × e^(−t ÷ τ)**, with **τ = C ÷ UA**

The **time constant τ** is the time for the temperature difference to fall to about 37% of its starting value. After one time constant, about 63% of the difference has gone; after three, about 95%.

## HW-60's tank overnight and over a weekend

The tank's water has a heat capacity of about **3,000 × 4,190 ≈ 12.6 MJ/K**. With 50 mm of insulation and a painted jacket, Chapter 5 found a loss of about 577 W at a 65 K difference, so UA is about **8.9 W/K**. Bare and weathered, the loss would be about 9.2 kW, a UA of about **141 W/K**.

```figure
type: formula
title: How HW-60's tank cools with the heater off
formula: τ = C ÷ UA        T(t) = 20 + (85 − 20) × e^(−t ÷ τ)
caption: This is an illustration, starting at 85 °C in a 20 °C room, with the water well mixed. The bare case treats radiation as linear, which is approximate but close enough for comparison.
- Heat capacity C | 3,000 × 4,190 ≈ 12.6 MJ/K
- Insulated UA | about 8.9 W/K, so τ ≈ 12.6 × 10⁶ ÷ 8.9 ≈ 393 hours
- Bare UA | about 141 W/K, so τ ≈ 24.8 hours
step: insulated: about 83.0 °C after 12 hours, about 75.8 °C after 60 hours
step: bare: about 60.0 °C after 12 hours, about 25.8 °C after 60 hours
```

The insulated tank's time constant, about **393 hours**, more than two weeks, means it barely notices a night off: from 85 °C it falls to about **83 °C** by morning and to about **76 °C** after a 60-hour weekend. A bare tank, with a time constant of about a day, would be at about 60 °C by morning and close to room temperature after a weekend.

```figure
type: line
title: Tank temperature with the heater off, insulated and bare
x: Hours after switching off
y: Water temperature, °C
ymin: 0
ymax: 90
legend: Insulated, 50 mm | Bare, weathered
caption: This is an illustration from the lumped model. The insulated tank stays hot for days; the bare tank loses most of its heat within a day or two.
- 0 | 85 | 85
- 12 | 83.0 | 60.0
- 24 | 81.2 | 44.7
- 36 | 79.3 | 35.2
- 48 | 77.5 | 29.4
- 60 | 75.8 | 25.8
```

## Warm-up with losses

Chapter 1 estimated the time to heat a full tank from 15 °C to 85 °C at 30 kW as about 8.1 hours, ignoring losses. Including them, the heater's 30 kW is reduced by the loss at each moment, which rises as the tank warms. Stepping the heat balance forward minute by minute gives about **8.2 hours** for the insulated tank, only a few minutes longer, because its losses are tiny next to the heater's power. For a bare tank, losing several kilowatts by the end of warm-up, the difference would be much larger, and on a big, poorly insulated vessel with a small heater, losses can stop it reaching temperature at all: the heater's power is all used replacing the loss.

The same balance sizes a heater. Its power must exceed the vessel's loss at full temperature, or it can never get there; HW-60's insulated tank needs only about 0.6 kW just to hold 85 °C. Beyond that, the heater's size is set by how quickly the tank must recover: after a wash-down, after a weekend or from cold. Each requirement is a heat quantity, Q = m c ΔT, divided by the time allowed, plus the loss. Writing those requirements down, with the recovery times the production team actually needs, turns heater sizing from a guess into a short calculation.

## When the lumped model applies

The model assumes the temperature inside the object is uniform, so that one temperature describes it. That is reasonable when heat moves around inside the object much more easily than it escapes from the surface. The test is the **Biot number**, Bi = h × L ÷ k, where L is a characteristic length, the volume divided by the surface area, and k the object's conductivity. If Bi is below about **0.1**, the lumped model is good.

For HW-60's tank, the water is stirred by inflows, the heater and natural convection, and its loss is controlled by the insulation, so a single temperature is a fair description, apart from the stratification described in Chapter 4. For a steel part in an oven, the Biot number is usually small, and the lumped model gives good heating times; [Industrial Electric Heating by the Numbers](/reados/publications/industrial-electric-heating-by-the-numbers/) uses it for parts in a curing oven. For a large block of a poor conductor, such as a thick concrete slab or a big plastic moulding, Bi is large, the surface heats long before the middle, and the lumped model is wrong; those problems need a conduction solution through the thickness.

## Switching off, or leaving on

Whether to switch heating off when it is not needed depends on how fast the system loses heat. If the heater is left on over HW-60's 60-hour weekend, it replaces the insulated tank's loss of about 0.577 kW the whole time, about **34.6 kWh**. If it is switched off, the tank cools to about 75.8 °C, and on Monday the heater must put back about **3,000 × 4.19 × 9.2 ÷ 3,600 ≈ 32.1 kWh**, taking about **1.1 hours**. The two are almost the same. With good insulation, switching off saves almost nothing, because the tank loses so little while it is off.

For a bare tank, the picture is different. Left on, it would lose about **550 kWh** over the weekend; switched off, it would need about **207 kWh** to reheat from about 26 °C. Switching off would save more than half. The rule is general: **the better the insulation, the less there is to gain from switching off**, and the more the decision should rest on other grounds, such as having hot water ready, and keeping stored water hot enough for health reasons.

```figure
type: compare
title: Heater on or off over a 60-hour weekend
cols: Heat used if left on | Heat to reheat on Monday | Saving from switching off
caption: This is an illustration at about A$0.093 per kWh. With good insulation, switching off saves almost nothing; with none, it saves more than half.
- *Insulated tank, 50 mm | about 34.6 kWh | about 32.1 kWh, about 1.1 h | about 2.5 kWh, about A$0.23
- Bare tank, weathered | about 550 kWh | about 207 kWh, about 6.9 h | about 343 kWh, about A$32
```

## Heating a solid part

The same model handles solid parts, provided the Biot number is small. A steel part loaded into a hot oven heats with a time constant set by its mass, the steel's specific heat and the oven's combined surface coefficient on its area. Thin parts, with little mass for their surface area, heat quickly; thick ones slowly. The time constant tells a production engineer how long a batch must stay in an oven before it is at temperature, and how long it must cool before it can be handled. It also shows why a mixed load of thin and thick parts is awkward: by the time the thickest part is hot, the thinnest have been at temperature for a long while. Grouping parts of similar thickness, or setting the oven time by the thickest part and checking it with a thermocouple attached to that part, avoids both under-heated thick parts and over-cooked thin ones.

## Measuring a time constant

A time constant can be measured as easily as it can be calculated. HW-60's engineer logged the tank's top temperature with the heater off over one long weekend. Plotting the logarithm of the difference between the tank and the room against time gave a nearly straight line, whose slope gave a time constant of a little under 400 hours, close to the calculated 393. The measured value now sits in the design file as the tank's true cooling rate, and a future fall in it, a shorter time constant, would be the first sign of insulation damage or a leaking valve letting heat out.

## Dead legs

Hot water standing still in a branch pipe behaves like a small tank with a short time constant. A metre of HW-60's pipe holds about **2.5 kg** of water, with a heat capacity of about 10.4 kJ/K. With 40 mm of insulation, its UA per metre is about **0.28 W/K**, so its time constant is about **10.5 hours**: after one hour it is still about **79 °C**, and after eight hours about **50 °C**. Bare, its UA per metre is about 2.2 W/K and its time constant about **1.3 hours**: after one hour it has fallen to about **50 °C**, and after three hours to about **27 °C**.

Water that sits warm, rather than hot or cold, for long periods is a health concern, because some bacteria, notably Legionella, grow in it. Plumbing standards and health guidance in Australia set requirements for the temperatures at which hot water is stored and distributed, and for avoiding dead legs, and those requirements govern real systems. The engineering response is the same in each case: keep branches short, circulate hot water close to each outlet, insulate, and flush little-used outlets regularly.

## A failure case: the lukewarm branch

This is an illustration. One of HW-60's hose stations, at the far end of the floor, was used only once or twice a shift. It hung from an insulated branch about **8 m** long, off the circulating main, with no circulation of its own.

During a routine monthly temperature check at each outlet, the maintenance technician found that this station took several minutes of running before its water reached 80 °C, and that the first water out was lukewarm. With the branch's time constant of about 10.5 hours, the lumped model showed why: after the 3 to 4 hours between uses, the 20 kg or so of water in the branch had cooled to the 60s, and the bare hose connection at its end had cooled much further.

The detection came from the routine outlet temperature check, recorded each month. The correction was to extend the circulating main past the station, so hot water moves through the branch continuously, and to add the station to the weekly flushing list until that work was done. The design rule recorded for future changes is that every hose station is on the circulating main, with no branch longer than a short connection.

## How this applies to a small Australian business

For heating and cooling times, use the lumped model: find the heat capacity of the water or metal and the UA value of its insulation, and the time constant τ = C ÷ UA tells you how quickly it changes. Check the Biot number before trusting it on solid objects. Include losses when estimating warm-up, especially for poorly insulated equipment. Decide whether to switch heating off by comparing the energy lost while on with the energy needed to reheat; with good insulation, there is little to gain. And watch dead legs, where water sits warm for hours, for health as well as energy reasons.

## Exercise: a long weekend

Over a four-day long weekend, **96 hours**, HW-60's insulated tank is left with the heater off. Using τ ≈ 393 hours, what temperature does it reach? How much heat is needed to reheat it to 85 °C, and how long does the 30 kW heater take? How much heat would the heater have used to keep it at 85 °C instead?

**Worked answer.** The tank cools to **20 + 65 × e^(−96 ÷ 393) ≈ 20 + 65 × 0.783 ≈ 70.9 °C**. Reheating needs **3,000 × 4.19 × (85 − 70.9) ÷ 3,600 ≈ 49.2 kWh**, which takes the heater about **49.2 ÷ 30 ≈ 1.6 hours**. Keeping it hot would have used about **0.577 × 96 ≈ 55.4 kWh**. Switching off saves only about **6 kWh**, around **A$0.60**, so the choice depends on having hot water ready on the first morning, which requires the heater to start about 1.6 hours before the first wash-down, and on keeping stored water hot enough.
