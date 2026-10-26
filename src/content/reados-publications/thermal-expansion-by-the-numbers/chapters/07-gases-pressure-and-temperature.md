---
book: thermal-expansion-by-the-numbers
chapterSlug: gases-pressure-and-temperature
order: 7
title: "Gases: pressure and temperature"
description: "Use the gas laws with absolute pressure and temperature to predict how sealed vessels, precharges and pressure tests change with temperature, and avoid mistaking a temperature drop for a leak."
draft: false
---

Gases respond to temperature far more than solids or liquids. A gas that is free to expand grows in proportion to its absolute temperature; one sealed in a rigid vessel cannot grow, so its pressure rises instead, in the same proportion. Those two facts govern compressed air receivers, gas cylinders, the gas cushion in an expansion vessel, air pockets in pipes and every pressure test done with air or nitrogen. They are easy to apply and easy to get wrong, because the proportions only work with absolute pressures and absolute temperatures, and gauges show neither.

This chapter applies the gas laws to HW-60. It states the combined gas law and insists on absolute quantities, calculates how the expansion vessel's precharge changes with the plant room's temperature, how a sealed air receiver's pressure rises in the sun and falls after filling, how much a gas expands when free to do so, and why a pressure test's reading drifts with temperature. The failure case is a pressure test on the primary loop that appeared to show a leak overnight and showed only a cooler night.

## The gas laws with absolute values

For a fixed amount of gas, behaving as an ideal gas, which air and nitrogen do closely at the pressures in this book:

**p₁ × V₁ ÷ T₁ = p₂ × V₂ ÷ T₂**

where **p** is the **absolute pressure**, gauge pressure plus atmospheric pressure, about 1.013 bar, and **T** is the **absolute temperature**, in kelvins, the Celsius value plus 273.15. Two special cases cover most practical problems:

- at **constant volume**, in a sealed rigid vessel, pressure is proportional to absolute temperature: p₂ = p₁ × T₂ ÷ T₁;
- at **constant pressure**, volume is proportional to absolute temperature: V₂ = V₁ × T₂ ÷ T₁.

Chapter 6 used a third case, constant temperature, Boyle's law, p₁ × V₁ = p₂ × V₂, for the expansion vessel's gas cushion as water entered it slowly.

## Why absolute values matter

A compressed air receiver at **7.5 bar gauge** at **20 °C** warms in the sun to **50 °C**. Done correctly, with absolute values, its pressure becomes **(7.5 + 1.013) × 323.15 ÷ 293.15 − 1.013 ≈ 8.37 bar gauge**.

```figure
type: compare
title: Three ways to calculate the receiver's pressure at 50 °C
cols: Calculation | Result | Verdict
caption: This is an illustration for a sealed receiver at 7.5 bar gauge and 20 °C, warmed to 50 °C. Only absolute pressure and absolute temperature give the right answer.
- *Absolute pressure, kelvins | 8.513 × 323.15 ÷ 293.15 − 1.013 | about 8.37 bar gauge | correct
- Gauge pressure, kelvins | 7.5 × 323.15 ÷ 293.15 | about 8.27 bar gauge | slightly low
- Gauge pressure, Celsius | 7.5 × 50 ÷ 20 | 18.75 bar gauge | absurd
```

Using gauge pressure gives an answer that is wrong but plausible, which is worse than one that is obviously wrong. Using Celsius gives nonsense, and below 0 °C it gives negative pressures. The habit to build is simple: convert to absolute before multiplying or dividing, and convert back to gauge at the end.

## The expansion vessel's precharge

Chapter 6 set the expansion vessel's gas precharge at **1.5 bar gauge**, matching the loop's cold fill. That is a pressure at a temperature. If the vessel is precharged in a 20 °C workshop and then sits in a plant room at **40 °C**, its gas pressure rises to about **(1.5 + 1.013) × 313.15 ÷ 293.15 − 1.013 ≈ 1.67 bar gauge**. If it were precharged at 30 °C and installed somewhere at 15 °C, it would fall to about **1.38 bar gauge**.

Differences of a tenth or two of a bar matter little for HW-60's loop, but they explain why precharge readings vary from one check to the next and why the check should be made with the vessel at its normal operating environment temperature, and the temperature recorded. For vessels in plant rooms whose temperature swings widely, the precharge is set for the typical condition.

## Filled hot, read cold

Compressing a gas quickly heats it, which is why a compressor's discharge pipe is hot. A receiver filled quickly to **7.5 bar gauge** may hold air at **60 °C** when the compressor stops. As the air cools to the room's **20 °C**, its pressure falls, with nothing escaping, to about **(7.5 + 1.013) × 293.15 ÷ 333.15 − 1.013 ≈ 6.48 bar gauge**. A drop of about a bar, with no leak. Air compressors' controls account for this by cutting in again when the pressure falls; a person watching the gauge on a receiver that has just been filled might reasonably, and wrongly, suspect a leak.

```figure
type: formula
title: A receiver's pressure after filling hot and cooling
formula: p₂ = p₁ × T₂ ÷ T₁, with absolute pressures and kelvins
caption: This is an illustration for a receiver filled quickly to 7.5 bar gauge with air at 60 °C, then left to cool to a 20 °C room with nothing escaping.
- Pressure when filled, absolute | 7.5 + 1.013 = 8.513 bar
- Temperature when filled | 60 °C = 333.15 K
- Temperature after cooling | 20 °C = 293.15 K
step: p₂ = 8.513 × 293.15 ÷ 333.15 ≈ 7.49 bar absolute
step: about 6.48 bar gauge: a fall of about 1 bar with no leak
```

## Gas that is free to expand

At constant pressure, a gas's volume follows its absolute temperature. Air in a pocket in HW-60's pipe, at the system's pressure, warmed from 20 °C to 85 °C, grows by **358.15 ÷ 293.15 ≈ 1.22**, about 22%. That is one reason air pockets in hot water systems grow, gather at high points and need venting. It is also why hot air rises: warm air at the same pressure is less dense than cool air, by the same ratio.

## Gas cylinders and sealed containers

Every sealed container of gas is a constant-volume vessel. A gas cylinder left in the sun, a sealed drum on a hot dock, a pressurised aerosol can near a heater: each rises in pressure with its absolute temperature. Cylinder and container makers design for a stated maximum temperature, and storage rules keep cylinders out of direct sun and away from heat for this reason. A cylinder involved in a fire can reach pressures well beyond its design. None of this needs more than the constant-volume law, but its consequences are serious enough that storage of gas cylinders is governed by work health and safety rules and the makers' instructions.

```figure
type: bars
title: Pressure of a sealed receiver filled to 7.5 bar gauge at 20 °C, by its temperature
unit: bar gauge
max: 9
caption: This is an illustration, calculated with absolute pressure and temperature. A receiver in a hot spot or the sun gains nearly a bar; one filled hot loses about a bar as it cools.
- At 10 °C | 7.21
- *At 20 °C, as filled | 7.5
- At 35 °C | 7.94
- At 50 °C, in the sun | 8.37
```

## Pressure tests and temperature

Pressure tests on pipework and vessels are of two kinds. **Hydrostatic** tests use water, which stores little energy when compressed and is the preferred method, as the [Pressure vessels and thin-walled cylinders](/reados/collections/machine-elements-and-mechanical-design/pressure-vessels-and-thin-walled-cylinders/) chapter explains. **Pneumatic** tests use air or nitrogen and are used where water cannot be, with strict precautions because compressed gas stores far more energy. Both are affected by temperature, in different ways: a water-filled test section's pressure changes sharply with small temperature changes, because water expands and the steel barely does; a gas-filled section's pressure changes in proportion to its absolute temperature. A test that runs across a temperature change must be corrected for it, or the readings will suggest a leak that is not there, or hide one that is.

## Water-filled tests are even more sensitive

A hydrostatic test section is completely full of water, with no gas cushion. When its temperature rises, the water tries to expand by about ten times as much as the steel around it, as Chapter 1 showed, and with nowhere to go its pressure rises steeply, much more steeply than a gas-filled section's would for the same temperature change. A water-filled section left in the morning sun can climb past its test pressure without anyone touching it; one that cools overnight can fall enough to look like a serious leak. Hydrostatic tests are therefore held with the section shaded and at a steady temperature, with the water allowed to reach the surrounding temperature before the test period starts, and with the temperature recorded alongside every reading. A small relief valve or a supervised vent on the test rig stops a sun-warmed section from exceeding its test pressure.

## Atmospheric pressure moves too

Absolute pressure is gauge pressure plus atmospheric pressure, and atmospheric pressure is not fixed at 1.013 bar. It varies with the weather by a few hundredths of a bar from day to day, and falls with altitude, by roughly one hundredth of a bar for every 100 m or so near sea level. For the calculations in this book, those changes are small next to the gauge pressures involved. They matter for precise low-pressure work, such as checking a vessel's precharge to a hundredth of a bar or comparing tests taken weeks apart at sites of different heights. A barometer reading, or the local weather service's station pressure, closes the gap when it matters.

## Nitrogen or air

Expansion vessels and many pneumatic tests use nitrogen rather than air. At the pressures and temperatures here, nitrogen obeys the same gas laws as air, so every calculation in this chapter applies unchanged. It is chosen for other reasons: it is dry, so it brings no moisture to condense inside a vessel or test section; it contains no oxygen, so it does not support corrosion or combustion; and in rubber diaphragm vessels, it is generally reported to permeate more slowly than air, so a precharge holds longer between checks. Its one hazard is that it displaces oxygen, so venting large volumes of it into an enclosed plant room needs the same care as any asphyxiant gas.

## The gas's temperature, not the room's

The temperature in every gas calculation is the gas's own. A receiver in a cool room can still hold warm air from its compressor; a vessel beside a boiler is warmer than the room around it; a test section in the sun is warmer than the shaded gauge reading it. Where it matters, the temperature is measured on the vessel or pipe itself, with a contact thermometer, rather than read from the room thermostat.

## Air in hot water systems

Water holds dissolved air, and it holds less as it warms. When HW-60's primary loop heats up after filling with cold water, air comes out of solution and collects in pockets at high points, where it grows further with temperature, as above. Air pockets block flow, make pumps noisy and bring oxygen that corrodes steel. The loop has automatic air vents at its high points and an air separator near the boiler outlet, where the water is hottest and releases air most readily. After filling, the loop is run hot and vented repeatedly until no more air appears. The gas laws explain both why the air appears and why it is easiest to remove when the water is hot.

## A failure case: the overnight "leak"

This is an illustration. After modifications to HW-60's primary loop, a contractor carried out a low-pressure tightness check with nitrogen before refilling with water, as their procedure allowed for that section: pressurising to **6.0 bar gauge** in the afternoon and reading the gauge again the next morning. The plant room had been about **30 °C** in the afternoon; overnight, with the boiler off and a cool change outside, it fell to about **18 °C**. The morning reading was about **5.72 bar gauge**, a drop of about 0.28 bar. The contractor's report recorded a leak, and the team spent the morning searching joints with leak detection fluid, finding nothing.

The maintenance engineer recalculated. A sealed volume of gas at 6.0 bar gauge and 30 °C, cooled to 18 °C, should read **(6.0 + 1.013) × 291.15 ÷ 303.15 − 1.013 ≈ 5.72 bar gauge**. The whole drop was temperature. There was no leak.

The detection came from correcting the reading for temperature. The correction to the procedure was to record the temperature of the test section, not just the room, at the start and end of every test, to correct readings using absolute values, and to hold tests at a stable temperature, starting and ending at similar times of day. The contractor's report was amended to record a passed test.

## How this applies to a small Australian business

For any calculation involving gas pressure and temperature, convert to absolute pressure and absolute temperature first. Expect sealed vessels to rise in pressure in heat and fall in cold, receivers to lose pressure as they cool after filling, and air pockets to grow as they warm. Set and check expansion vessel precharges with the temperature noted. Store gas cylinders away from sun and heat. And record and correct for temperature in every pressure test, so a cool night is not mistaken for a leak or a warm afternoon used to hide one.

## Exercise: a cold morning precharge check

The expansion vessel's precharge is checked early on a winter morning, with the plant room at **10 °C**, and reads **1.45 bar gauge**. What would it read at the 20 °C at which the 1.5 bar gauge precharge was specified? Does it need adjusting?

**Worked answer.** At 20 °C, the reading would be **(1.45 + 1.013) × 293.15 ÷ 283.15 − 1.013 ≈ 2.463 × 1.0353 − 1.013 ≈ 1.54 bar gauge**. That is slightly above the specified 1.5 bar, so the precharge is correct. Pumping it up to 1.5 bar at 10 °C would leave it at about **1.59 bar gauge** at 20 °C, nearly 0.1 bar high. The cold reading was simply the temperature. The check sheet should record both the reading and the temperature.
