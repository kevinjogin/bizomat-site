---
book: industrial-electric-heating-by-the-numbers
chapterSlug: the-oven-heat-balance
order: 6
title: "The oven heat balance"
description: "Account for every kilowatt an electric curing oven uses: product, racks, walls, exhaust, doors and warm-up, then work out how long the thickest part takes to reach curing temperature."
draft: false
---

An oven is a box that holds heat around a product for long enough to do something to it: cure a coating, dry a part, temper a spring. The heaters must supply all the heat the product absorbs, plus everything that escapes through the walls, out with the exhaust air and through the doors, plus the heat needed to warm the oven itself from cold. Writing those terms down, with numbers, is the heat balance, and it is the only reliable way to size an oven's heaters, predict its warm-up time and running cost, and see where energy could be saved.

This chapter builds the heat balance of the coating business's curing oven, sizes its heaters, estimates its warm-up time, and shows why the cure time is decided by the thickest part in the load, not by the oven's air temperature.

## The oven and its job

This is an illustration. The curing oven's chamber is 3.0 m long, 2.0 m wide and 2.2 m high, built from insulated panels 100 mm thick with steel skins. It runs at 200 °C. Powder-coated steel frames and brackets are hung on racks, wheeled in, cured and wheeled out, in batches of about 400 kg of steel on 60 kg of racks, with one batch every 30 minutes. The powder maker's data sheet sets the cure schedule as a minimum time at a minimum metal temperature, which for this powder, in this example, is 10 minutes with the metal at 195 °C or above.

The balance has five terms: the product, the racks, the walls, the exhaust air and the doors. A sixth, the warm-up of the oven's own structure, matters at start-up.

## Heat into the product and racks

The heat to raise a load from room temperature to oven temperature is m × c × ΔT (Chapter 1). Using a specific heat for steel of about 0.49 kJ/kg·°C:

- product: 400 × 0.49 × 180 ≈ **35.3 MJ** per batch;
- racks: 60 × 0.49 × 180 ≈ **5.3 MJ** per batch.

That is about 40.6 MJ per batch. Delivered over the 30-minute batch time, it averages 40,600 ÷ 1,800 ≈ **22.5 kW**. The racks take 13% of it while doing nothing useful, which is why rack design, lighter racks that hold more product, is an energy measure as well as a handling one.

## Heat through the walls

Heat leaks through the oven's walls, roof and floor at a rate:

**Q_walls = U × A × (T_inside − T_outside)**

where U is the overall heat transfer coefficient of the wall, which for 100 mm of mineral wool insulation between steel skins, including the air films on each side, is roughly 0.4 W/m²·°C in this illustration. The chamber's surface area is 2 × (3.0 × 2.0 + 3.0 × 2.2 + 2.0 × 2.2) = **34 m²**. So the wall loss is about 0.4 × 34 × 180 ≈ **2.45 kW**, small compared with the product, because the walls are well insulated. Thermal bridges, places where steel framing passes through the insulation, and gaps around doors increase it in practice, often noticeably.

## Heat out with the exhaust

Curing ovens are ventilated to remove the small amounts of volatile material released as the powder cures and to keep the atmosphere safe. The exhaust carries away hot air, which is replaced by cold air from outside. The heat lost is:

**Q_exhaust = V̇ × ρ × c_p × ΔT**

This is an illustration. With an exhaust rate of 0.05 m³/s, measured as cold make-up air at about 1.2 kg/m³, and air's specific heat of about 1.005 kJ/kg·°C, the loss is about 0.05 × 1.2 × 1.005 × 180 ≈ **10.9 kW**. Exhaust is often the second-largest term after the product. Too little exhaust is unsafe; too much wastes energy heating air that is immediately thrown away. The exhaust rate is set by the powder maker's and oven maker's requirements for the volatiles released, and should not be reduced to save energy without that advice.

## Doors and openings

Each time the doors open to change a batch, hot air spills out and cold air flows in. This is an illustration. The chamber holds about 13.2 m³ of air, which at 200 °C weighs about 9.8 kg; replacing all of it with air at 20 °C would take about 13.2 × 0.746 × 1.005 × 180 ≈ 1.8 MJ to reheat. A brisk batch change might exchange a large part of the air; a slow one, with doors left open, much more, and the walls and racks near the door also cool. Air curtains, fast doors and quick changeovers all reduce this term, which is hard to calculate but easy to see on the oven's power trace after every door opening.

## The running balance

Adding the main terms, ignoring the doors:

```figure
type: bars
title: Average heat demand of the curing oven while running
unit: kW
max: 25
caption: This is an illustration for 400 kg of product on 60 kg of racks every 30 minutes at 200 °C. Door losses come on top and vary with how batches are changed.
- *Product, 400 kg per 30 min | 19.6
- Exhaust air, 0.05 m³/s | 10.9
- Racks, 60 kg per 30 min | 2.9
- Walls, 34 m² at U = 0.4 | 2.45
```

The total is about 19.6 + 2.9 + 2.45 + 10.9 ≈ **35.8 kW**, the average demand used in Chapter 1. The product takes a little over half; the exhaust nearly a third; the walls only about 7%. Only the product's share does any useful work, so the oven's process efficiency while running is a little over 50%, before door losses and warm-up are counted.

## Sizing the heaters

The heaters must supply more than the running average, for three reasons. When a cold batch enters, it absorbs heat fastest at first, so the instantaneous demand exceeds the average; the oven must recover its temperature quickly after each door opening; and it must warm up from cold in a reasonable time. Oven makers typically install a margin above the running demand. The coating business's oven has 60 kW, about 1.7 times the running average, which gives it reserve for recovery and warm-up while keeping the supply and its demand charges reasonable.

## Warming up from cold

At the start of each day, the oven's own structure must be heated: the inner steel skins, the frames, the ducts, the fan and the heater box. This is an illustration. If the oven's internal steel weighs about 800 kg, heating it by 180 °C takes about 800 × 0.49 × 180 ≈ **70.6 MJ**, more than a batch of product. With 60 kW of heaters and losses through the walls and exhaust of about 13.3 kW while warming, about 46.7 kW goes into the structure, so the warm-up takes roughly 70,600 ÷ 46.7 ≈ 1,510 s, about **25 minutes**, in practice somewhat longer because the insulation itself also stores heat. That warm-up energy is spent every day whether one batch or twenty are cured, which is why running an oven for a few batches is far less efficient per part than a full day's production.

```figure
type: stats
title: The curing oven's warm-up from cold
caption: This is an illustration. Heat stored in the insulation lengthens the real warm-up beyond this estimate.
- about 800 kg | Internal steel to heat
- *70.6 MJ | Heat to warm the structure by 180 °C
- about 46.7 kW | Heater power left after losses
- about 25 min | Estimated warm-up time
```

## Checking the balance against the meter

A heat balance is a model, and models should be checked. The coating business fitted an energy meter to the oven's supply, logging power every minute. Over a typical day the log showed the warm-up as a long block at full power, then a saw-tooth pattern in which each batch change produced a spike of full power for several minutes, followed by a fall to a lower level as the load approached temperature. The day's total energy, divided by the hours of production after warm-up, came to about 38 kW on average, a little above the 35.8 kW calculated, the difference being largely door losses and thermal bridges the simple model left out. A model that agrees with the meter to within about 10% is good enough to use for decisions; one that disagrees by much more points to a loss that has not been understood, such as a door seal that has failed or an exhaust damper stuck open.

## Where the savings are

The balance shows where effort pays. In order of size for this oven:

1. **Run full, continuous batches.** The warm-up costs about 70 MJ every day regardless of output, and an oven idling at temperature between batches loses its wall and exhaust heat with no product to show for it. Scheduling coating work into full days rather than scattered batches spreads the warm-up over more parts.
2. **Set the exhaust correctly.** Exhaust is nearly a third of the running demand. It should be set to the rate the powder and oven makers require, checked, and not left at a higher setting out of habit; some ovens reduce exhaust automatically when the oven is idling with no curing load.
3. **Lighten the racks.** Every kilogram of rack heated and cooled each cycle costs about 88 kJ at 180 °C; racks designed to carry more product for their weight reduce that.
4. **Speed up batch changes.** Short door openings, and air curtains where they suit, reduce door losses and recovery time.
5. **Insulation and seals.** The walls are a small term when the insulation and door seals are sound, but a failed seal or damaged panel can make them much larger.

Heat recovery, using the hot exhaust to preheat make-up air, is possible on larger ovens, but for an oven of this size the equipment cost is usually hard to justify against the savings above.

## How long the parts take to heat

The cure schedule depends on metal temperature, not air temperature, so the question is how long each part takes to reach 195 °C. A thin steel part in moving air heats approximately exponentially, with a time constant τ = ρ × c × t ÷ (2 × h), where t is its thickness, the factor of 2 reflecting heat entering both faces, and h the heat transfer coefficient from the circulating air.

This is an illustration. With a heat transfer coefficient of about 30 W/m²·°C from the oven's fan-driven air, a 4 mm steel bracket has a time constant of about 7,850 × 490 × 0.004 ÷ (2 × 30) ≈ 256 s, about 4.3 minutes. The time for it to rise from 20 °C to within 5 °C of the 200 °C air, that is to 195 °C, is τ × ln(180 ÷ 5) ≈ 3.58 τ, about **15.3 minutes**.

```figure
type: compare
title: Time for steel parts to reach 195 °C in 200 °C air
cols: Time constant | Time to reach 195 °C | Time at 195 °C or above in a 30 min cycle
caption: This is an illustration with a heat transfer coefficient of about 30 W/m²·°C. The cure schedule in this example needs 10 minutes at 195 °C or above; the thickest part sets the cycle.
- 3 mm sheet | about 3.2 min | about 11.5 min | about 18.5 min
- *4 mm bracket | about 4.3 min | about 15.3 min | about 14.7 min
- 6 mm plate | about 6.4 min | about 23.0 min | about 7.0 min
```

The thicker the part, the longer it takes, in proportion to its thickness. Within the 30-minute cycle, a 4 mm bracket spends about 14.7 minutes at 195 °C or above, comfortably meeting the 10-minute schedule. A 6 mm plate reaches 195 °C only after about 23 minutes, leaving 7 minutes, short of the schedule.

## A failure: the under-cured base plates

This is an illustration. A customer order included 6 mm steel base plates, which were hung on the racks with the usual brackets and run on the standard 30-minute cycle. The brackets passed the business's routine solvent-rub cure test; the base plates failed it, their coating softening under the solvent.

The calculation above explains the result. The plates reached 195 °C only near the end of the cycle and spent about 7 minutes above it, against the 10 minutes the powder needed. The oven's air temperature had been correct throughout, and the controller's chart showed nothing wrong. The problem was the thickness of the parts, not the oven.

The plates were stripped and recoated at the business's cost. The business added a rule to its oven procedure: the cycle time is set by the thickest part in the batch, with a data-logging probe attached to a sample of the thickest part on any new job to confirm that it meets the powder maker's cure schedule. Thick parts are now run as separate batches on a longer cycle.

## Exercise: thicker insulation

The business considers replacing the oven's 100 mm wall panels with 150 mm panels, reducing U from about 0.4 to about 0.27 W/m²·°C. Calculate the new wall loss and the saving, and the energy saved over 2,000 hours a year of running. Compare it with increasing the exhaust from 0.05 to 0.08 m³/s.

The new wall loss is 0.27 × 34 × 180 ≈ **1.65 kW**, a saving of about **0.8 kW**. Over 2,000 hours, that is about **1,600 kWh** a year, about A$480 at 30 cents per kilowatt-hour, excluding GST.

Increasing the exhaust to 0.08 m³/s would raise its loss to about 0.08 × 1.2 × 1.005 × 180 ≈ **17.4 kW**, an extra 6.5 kW, eight times the insulation saving. The exhaust rate deserves at least as much attention as the insulation, within the limits that safety sets.
