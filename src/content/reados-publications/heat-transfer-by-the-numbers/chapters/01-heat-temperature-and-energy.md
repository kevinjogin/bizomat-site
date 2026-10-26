---
book: heat-transfer-by-the-numbers
chapterSlug: heat-temperature-and-energy
order: 1
title: "Heat, temperature and energy"
description: "Separate temperature from heat, convert between energy and power, calculate the heat to warm water with Q = m c ΔT, cost it, and meet the three ways heat moves and the idea of thermal resistance."
draft: false
---

Temperature and heat are often used as if they meant the same thing. They do not. Temperature is how hot something is: a reading on a thermometer. Heat is energy on the move because of a temperature difference: so many joules flowing from a hotter thing to a colder one. A cup of boiling water and a bath of warm water make the point. The cup is hotter, but the bath holds far more heat, and it would take far more energy to warm it. Most heat calculations in a factory go wrong at this first step, by confusing a temperature with an amount of heat, or an amount of energy with a rate.

This chapter sets up the tools the rest of the book uses. It separates temperature from heat and energy from power, calculates the heat needed to warm HW-60's storage tank, turns that into time and money, introduces the three ways heat moves, and defines the thermal resistance that makes conduction, convection and radiation easy to combine. The failure case is a supplier's claim that a heater would warm the tank in two hours.

## The hot water system

```figure
type: stats
title: The HW-60 wash-down hot water system
caption: This is an illustration. The numbers carry through every chapter of the book.
- *85 °C | Supply temperature | from a gas-fired water heater rated at 30 kW
- 3,000 L | Storage tank | stainless steel, 1.5 m diameter, 1.8 m tall
- 60 m | Hot water pipe | stainless steel, 60.3 mm outside diameter, to the hose stations
- 20 °C | Surroundings | plant room and production floor
- 15 °C | Cold mains water | the temperature the heater starts from
- 6,000 h | Hours a year the system is hot | about two shifts, six days a week, all year
```

## Energy and power

**Energy** is measured in joules, J. A kilojoule, kJ, is a thousand joules, and a megajoule, MJ, a million. Electricity and gas bills also use the **kilowatt-hour**, kWh, which is **3.6 MJ**, and gas is often sold by the **gigajoule**, GJ, a thousand megajoules.

**Power** is the rate of energy flow, measured in watts, W, which are joules per second. A kilowatt, kW, is a thousand watts. A heat loss of 1 kW from a pipe means a thousand joules leave every second, whether anyone is using the hot water or not.

Energy is power multiplied by time. A 1 kW loss running for HW-60's **6,000 hours** a year is **6,000 kWh** of heat a year, which at the assumed heat cost of about **A$0.093** per kWh is about **A$560** a year. That single conversion, from a loss in watts to a cost in dollars a year, is the one most worth practising, because it turns a heat transfer calculation into a decision.

## Heat to warm something: Q = m c ΔT

Warming a substance takes heat in proportion to three things: its mass **m**, the temperature rise **ΔT**, and a property of the substance called its **specific heat capacity**, **c**, the heat needed to warm one kilogram by one degree. Water's specific heat is high, between about 4.18 and 4.21 kJ/kg·K across the range from 10 °C to 90 °C. This book uses **4.19 kJ/kg·K**.

```figure
type: formula
title: Heat to warm HW-60's tank from cold mains water
formula: Q = m × c × ΔT
caption: This is an illustration. The tank's 3,000 L of water is taken as 3,000 kg; the density of water changes by a few per cent over this range, which is small next to the other uncertainties here. The heat to warm the steel tank itself is left out.
- Mass of water m | 3,000 kg
- Specific heat c | 4.19 kJ/kg·K
- Temperature rise ΔT | 85 − 15 = 70 K
step: Q = 3,000 × 4.19 × 70 ≈ 879,900 kJ ≈ 880 MJ
step: Q ≈ 880 ÷ 3.6 ≈ 244.4 kWh
step: cost of the heat ≈ 244.4 × A$0.093 ≈ A$22.80
```

A temperature difference in degrees Celsius is the same size as one in kelvins, so ΔT can be written in either. Absolute temperatures in kelvins, the Celsius value plus 273.15, matter only in radiation calculations, Chapter 5's subject.

## From heat to time

With a heater of known power and no losses, the time to warm the tank is the heat divided by the power. HW-60's heater is rated at **30 kW** of heat into the water, so warming a full tank from 15 °C to 85 °C takes about **244.4 ÷ 30 ≈ 8.1 hours**. Losses from the tank during warm-up lengthen that slightly; Chapter 8 shows by how much.

The same arithmetic works in reverse for the hot water being used. A hose station drawing **20 L/min** of 85 °C water, replaced by 15 °C mains water, takes heat from the system at **(20 ÷ 60) × 4.19 × 70 ≈ 97.8 kW**, more than three times the heater's output. During a wash-down, the tank is being emptied of heat faster than the heater replaces it. That is what the storage is for, and why the tank's size and insulation matter: the tank is a reservoir of heat as much as of water.

## Input and output

A heater's rating can mean the heat it puts into the water or the fuel it burns, and the difference is its efficiency. HW-60's heater delivers **30 kW** of heat to the water at an assumed efficiency of 85%, so it burns gas at about **30 ÷ 0.85 ≈ 35.3 kW**. The other 5.3 kW leaves up the flue and from the heater's casing. The heat cost of about A$0.093 per kWh used throughout this book already includes that efficiency: it is the cost of a kilowatt-hour delivered to the water, not of a kilowatt-hour of gas. When comparing heaters, or electric with gas, always compare delivered heat with delivered heat.

## Numbers worth remembering

A few conversions make quick estimates easy. One kilowatt-hour is 3,600 kJ, enough to warm about **859 kg** of water by one degree, or about **12.3 L** from 15 °C to 85 °C. One kilowatt of continuous loss over HW-60's 6,000 hours costs about **A$560** a year. And water's specific heat, about 4.19 kJ/kg·K, is roughly eight to nine times that of steel by mass, which is why a tank of water stores far more heat than the steel that holds it, and why the steel's share is usually left out of a first estimate of warm-up time.

## Measuring heat flow with a thermometer and a flow meter

The same equation, written as a rate, measures heat flow in a moving fluid. If water flows at a mass flow rate of ṁ kilograms a second and its temperature changes by ΔT along its path, the heat gained or lost is **ṁ × c × ΔT** in kilowatts. That is how a heat meter works, and it is a practical way to check calculated losses.

HW-60 has a small circulating pump that keeps hot water moving round the pipe when no hose is open, so the water at the far end stays hot. With a circulation of **0.1 kg/s** and an insulated pipe losing about **1.08 kW**, a figure Chapter 3 calculates, the water should cool by about **1.08 ÷ (0.1 × 4.19) ≈ 2.6 K** on its way round. Two clamp-on temperature sensors and the pump's known flow can check that on site. A temperature drop several times larger than calculated points to missing or wet insulation somewhere along the run.

## Small differences need good thermometers

Heat calculations often rest on small temperature differences, and small differences magnify measurement errors. On the circulation check above, the expected drop is about 2.6 K. Two sensors that each read within ±0.5 K could show anything from about 1.6 K to 3.6 K, an uncertainty of nearly 40% in the measured heat loss. Matching the two sensors first, by reading them side by side in the same water, removes most of the difference between them, because what matters is the difference, not the absolute value. Clamp-on sensors also need good thermal contact and insulation over them, or they read somewhere between the pipe and the air. The instrument's accuracy, and how it was checked, belong in any record of a measured heat flow, alongside the flow rate and where each sensor was placed.

## Heat without a temperature change

Not all heat shows up as a temperature change. When water evaporates, it absorbs a large amount of heat, called latent heat, without getting any hotter; when steam condenses, it gives that heat back. An open tank of hot water loses heat by evaporation from its surface, often more than through its insulated walls, which is one reason HW-60's tank is closed. Latent heat matters most in steam systems, drying and cooling towers, which are outside this book's scope, but it is worth remembering whenever water is open to the air at a high temperature.

## The three ways heat moves

Heat flows from hot to cold by three mechanisms, and almost every real heat flow involves more than one.

```figure
type: compare
title: The three ways heat moves, in HW-60
cols: How it works | Where it happens in HW-60 | Chapter
caption: This is an illustration. Most real heat flows combine two or three of these in series, which is why thermal resistance is so useful.
- Conduction | heat passing through a solid, or a still fluid, from molecule to molecule | through the tank wall and the pipe insulation | 2 and 3
- Convection | heat carried by a moving fluid to or from a surface | from the water to the pipe wall; from the insulation surface to the room air | 4
- Radiation | heat carried by infrared light between surfaces at different temperatures | from the warm outer surface of the insulation to the room's walls | 5
```

On HW-60's insulated pipe, heat goes by convection from the water to the inside of the pipe, by conduction through the steel and then the insulation, and finally by convection and radiation, side by side, from the insulation's outer surface to the room. The slowest step controls the total, as the next section shows.

## Thermal resistance

The most useful idea in practical heat transfer is **thermal resistance**. Just as an electric current is driven by a voltage through a resistance, a heat flow is driven by a temperature difference through a thermal resistance:

- **heat flow = temperature difference ÷ thermal resistance**, with heat flow in watts, temperature difference in kelvins and resistance in kelvins per watt;
- resistances **in series**, one after another along the heat's path, **add**;
- resistances **in parallel**, side-by-side paths such as convection and radiation from the same surface, combine like parallel electrical resistances, which is easiest done by adding their conductances, the reciprocals.

The power of the idea is that each mechanism has its own simple formula for its resistance, and the resistances then combine by addition. The largest resistance in a series path controls the heat flow. On an insulated pipe, the insulation's resistance is many times larger than all the others, so the insulation sets the loss; the rest are small corrections. On a bare pipe, the outside surface's resistance controls, and convection and radiation decide everything.

## Steady and changing

Most of this book deals with **steady** heat flow: conditions that have settled, so the temperatures are not changing and heat flows in at the same rate it flows out. A pipe carrying 85 °C water all shift is close to steady. Warming up a tank, or cooling it overnight, is **transient**: temperatures change with time, and heat goes into or comes out of storage in the material. Chapter 8 handles transient problems with the simplest useful model, and shows when it is good enough.

## A failure case: two hours to temperature

This is an illustration. When HW-60's original heater was due for replacement, one supplier's quotation described its 30 kW unit as able to bring a full tank "to temperature in about two hours". Another supplier's quotation for a similar unit said "about eight hours". The difference looked like a reason to choose the first.

The maintenance engineer checked it with Q = m c ΔT. Warming 3,000 kg of water by 70 K needs about **244 kWh**. Delivering that in two hours would need about **122 kW** of heat, four times the unit's rating. No 30 kW heater could do it. On enquiry, the first supplier's figure turned out to assume the tank was already at 60 °C, a top-up after a short wash-down rather than a cold start.

The detection came from a five-line calculation before the order was placed. The correction was to ask both suppliers for the warm-up time from 15 °C with the tank's actual volume, which they then gave consistently. The lesson recorded in the engineering file was to check any claimed time or power against Q = m c ΔT, and to state the starting temperature in every request.

## How this applies to a small Australian business

Keep temperature, heat, energy and power distinct. Use Q = m c ΔT to work out the heat needed to warm water, metal or air, and divide by the heater's power for a first estimate of time. Convert every continuous heat loss in watts into kilowatt-hours a year and dollars a year, using your own tariff and the hours the system is hot. Think of heat flows as temperature differences pushing through resistances in series and parallel, and look first for the largest resistance in the path. And check suppliers' claims of power and time with arithmetic before buying.

## Exercise: a half-hour wash-down

A wash-down draws **20 L/min** of 85 °C water for **30 minutes**, replaced by 15 °C mains water. How much heat leaves the system, in kWh, and what does it cost? How long would the 30 kW heater take to replace it?

**Worked answer.** The draw is **20 × 30 = 600 L**, about 600 kg. The heat is **600 × 4.19 × 70 ≈ 176,000 kJ**, or about **48.9 kWh**, costing about **48.9 × A$0.093 ≈ A$4.55**. At 30 kW, the heater needs about **48.9 ÷ 30 ≈ 1.6 hours** to replace it, ignoring losses, which is why the 3,000 L tank, holding about 244 kWh above mains temperature, can support several wash-downs a shift with recovery time between them.
