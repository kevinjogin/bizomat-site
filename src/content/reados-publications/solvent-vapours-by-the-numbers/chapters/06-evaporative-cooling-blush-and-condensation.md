---
book: solvent-vapours-by-the-numbers
chapterSlug: evaporative-cooling-blush-and-condensation
order: 6
title: "Evaporative cooling, blush and condensation"
description: "How evaporating solvent cools a surface, the limiting temperature of a wet film, how much a real part cools, and why humid air condenses on fresh coatings and makes them blush."
draft: false
---

Evaporation takes heat. Every kilogram of solvent that leaves a surface carries its latent heat of vaporisation with it, and that heat comes from the surface, the liquid and the air around them. On a hot day this feels pleasant on the skin; on a freshly painted part it can cool the wet film below the dew point of the air, and water condenses into the coating. The result is blush: a milky, hazy or dull finish where the coating should be glossy.

This chapter calculates how cold an evaporating surface can get, how much a real wetted part cools, and when that cooling takes the surface below the dew point. Its error is Plant S's milky gloss finish, first blamed on the paint.

## The limiting temperature of an evaporating surface

A surface wetted with solvent and exposed to moving air settles at a temperature where the heat arriving from the air balances the heat carried away by evaporation. The heat arriving is h(T_air − T_s), with h the heat transfer coefficient. The heat leaving is the evaporation rate times the latent heat, k Cₛ(T_s) L, using the mass transfer coefficient and the saturated vapour concentration of Chapter 5, evaluated at the surface temperature.

Heat and mass are carried across the same thin layer of air by the same air movement, so h and k are closely related. For a rough estimate, taking the ratio h ÷ k as the volumetric heat capacity of air, ρc_p, about 1,187 J/m³K at room conditions, gives a simple balance.

```figure
type: formula
title: The temperature of a surface kept wet by an evaporating solvent
caption: A heat balance between convection from the air and evaporation, with no heat supplied from below. The ratio h ÷ k ≈ ρc_p is an approximation that neglects the difference between heat and vapour diffusivities; it is good enough to show the scale of the effect. The surface temperature appears on both sides and is found by trial.
- h (T_air − T_s) = k Cₛ(T_s) L | heat in by convection equals heat out by evaporation
- step: h ÷ k ≈ ρ c_p ≈ 1,187 J/m³K | air's volumetric heat capacity
- step: T_air − T_s ≈ L Cₛ(T_s) ÷ (ρ c_p) | the temperature depression
- step: Cₛ(T_s) = P(T_s) M ÷ (R T_s) | vapour pressure at the surface temperature, by Clausius–Clapeyron
```

This is the same physics as a wet-bulb thermometer, and the result is the solvent's equivalent of the wet-bulb temperature: the lowest temperature an evaporating surface can reach with no heat from below.

```figure
type: compare
title: Limiting temperature of a solvent-wetted surface
rowhead: Solvent
cols: In air at 28 °C | In air at 22 °C
caption: This is an illustration. From the heat balance above, with the vapour pressures and enthalpies of Chapter 2 and vapour-free air. These are limits for a surface with no heat supplied from beneath; real parts stay much warmer, as the next section shows.
- * Acetone | about −18 °C | about −20 °C
- 2-Butanone | about −6 °C | about −8 °C
- Isopropanol | about 4 °C | about 1 °C
- Toluene | about 8 °C | about 5 °C
```

The limits are startling. A surface kept wet with acetone in moving air could in principle fall below −17 °C on a warm day. Acetone's high vapour pressure makes it evaporate so fast that the air cannot resupply the heat. Even toluene, much slower, could cool a wetted surface by about 20 K.

## How much a real part cools

A real part is not a surface with no heat beneath it. The solvent sits on metal, and the metal supplies heat to the evaporating film, cooling as it does so. How far the part cools depends on how much solvent there is compared with how much heat the part can give up.

The comparison is between the latent heat of the solvent film, per square metre, and the heat capacity of the part beneath it, per square metre.

- **An acetone wipe on 3 mm steel.** A wiped film of about 20 µm of acetone holds 20 × 10⁻⁶ × 790 = 0.0158 kg/m², needing 0.0158 × 539 kJ/kg = 8.5 kJ/m² to evaporate. The steel beneath has a heat capacity of 0.003 × 7,850 × 460 = 10.8 kJ/m²K. If all the heat came from the steel, it would cool by about 0.8 K.
- **Wet paint on 1.2 mm sheet.** Plant S's wet paint film is about 80 µm thick and about half solvent by volume, so about 40 µm of solvent with a latent heat, weighted by its vapour composition, of about 437 kJ/kg: 40 × 10⁻⁶ × 861 × 437 = 15.0 kJ/m². A 1.2 mm guard panel has 4.3 kJ/m²K, so it could cool by about 3.5 K.
- **Wet paint on 6 mm plate.** The same film on a 6 mm frame member, with 21.7 kJ/m²K, cools it by only about 0.7 K.

```figure
type: bars
title: Cooling of the part if the solvent's latent heat came entirely from it
unit: kelvin
caption: This is an illustration. Latent heat of the film per square metre divided by the heat capacity of the steel per square metre. Thin sheet cools several times as much as plate under the same film, and the film's own surface is colder still while evaporation is fastest.
- Acetone wipe on 3 mm steel | 0.8
- Paint film on 6 mm plate | 0.7
- * Paint film on 1.2 mm sheet | 3.5
```

These are bulk figures. The film's outer surface, where evaporation happens, runs colder than the metal beneath it while the fast solvents are leaving, because heat has to flow up through the wet film. In the first minute or two after spraying, the surface of a film on thin sheet can be several kelvin below the air.

## Condensation and blush

If the surface of a wet film falls below the dew point of the air above it, water vapour condenses on it. In a film that is still wet and partly mixed with solvent, the condensed water gets trapped in the coating as fine droplets, or precipitates some of the resin, and when the film dries it scatters light: the finish is milky, dull or hazy. Coaters call this blush. Some resins are more sensitive than others, and moisture-sensitive two-pack polyurethanes can also react with the water, producing fine bubbles.

The [surface dew point check](/tools/surface-dew-point-check/) calculates the dew point of moist air from its temperature, relative humidity and pressure, and checks a surface temperature against it with a required margin. It also gives the relative humidity the air would have at the surface temperature, which shows how close to condensing the air at the film is.

## The error: blaming the paint

In late summer, a run of guards came out of the oven with a milky haze instead of a gloss. The frames painted the same day, with the same paint from the same mix, were fine. The plant returned the paint batch to the supplier as faulty.

The supplier tested the batch and found nothing wrong. The engineer looked at the weather records and the work records together. The hazy guards had all been sprayed on humid afternoons, with the booth air at about 28 °C and 75% relative humidity. On those days the painters, finding the paint thick in the heat, had added extra thinner, which is fast. And the guards were 1.2 mm sheet, while the frames were 6 mm plate.

```figure
type: compare
title: A freshly sprayed guard on two afternoons
rowhead: Condition
cols: Humid afternoon | Dry afternoon
caption: This is an illustration. Air at 28 °C; the guard's surface measured with an infrared thermometer about a minute after spraying at about 24 °C. From the surface dew point check with a 3 K margin. On the humid day, air at the film was at 95% relative humidity, and the film's own surface, colder than the steel, went below the dew point.
- Relative humidity of booth air | 75% | 50%
- Dew point | 23.15 °C | 16.61 °C
- Guard surface a minute after spraying | about 24 °C | about 24 °C
- * Margin above the dew point | 0.85 K, below the 3 K required | 7.39 K, passes
- Relative humidity of air at the surface | 95% | 63%
- Finish | milky haze | gloss
```

On humid afternoons, the guard's measured surface, at about 24 °C, was only 0.85 K above the dew point, and the wet film's outer surface, colder than the steel during the first minute of rapid evaporation, went below it. Water condensed into the film. On dry afternoons the same cooling left a margin of over 7 K and nothing condensed. The frames, on 6 mm plate, cooled less than 1 K and stayed well clear on either kind of day. The extra thinner made things worse, by putting more fast solvent into the film and so more cooling into the first minute.

The paint was not at fault, and the plant apologised to its supplier and asked for its advice on thinners for humid weather.

### What the plant changed

Four changes, each acting on one part of the balance, removed the blush.

1. **A dew point rule for spraying.** A hygrometer in the booth and the surface dew point check at the start of each afternoon. When the booth air's dew point is within 6 K of its temperature, allowing 3 K for evaporative cooling of thin sheet and a 3 K margin, the painters switch to the next step.
2. **A slower thinner on humid days.** The paint supplier's slow thinner leaves the film more gradually, so the cooling in the first minute is less.
3. **Warm parts.** Thin guards are moved into the booth an hour before painting, so they start at the booth's temperature, not the cooler temperature of the store.
4. **Less thinner.** Paint that is thick in the heat is brought to spraying viscosity with the slow thinner and with the paint warmed less, rather than with extra fast thinner.

### Measuring the surface

The plant's surface temperatures came from an infrared thermometer, which is quick and does not touch the wet film. Two precautions made the readings useful. The thermometer's emissivity setting was checked against a contact probe on a dry painted panel, since paint films have high emissivities, around 0.9, while bare steel has a low and variable one and reads falsely cold. And the readings were taken within about a minute of spraying, at a fixed distance, because the coldest moment passes quickly as the fast solvents leave and the steel warms the film back up. A single reading a few minutes later would have missed the cooling entirely.

### Telling blush from other defects

A hazy finish has several possible causes, and blush is only one. Blush is a milky or white haze that appears during or soon after flash-off on humid days and is worst on thin or cold parts; it often clears partly if the part is warmed before the film sets. A bloom that appears days later, as a greasy or white deposit, is more often a component of the coating migrating to the surface. Fine pinholes or blisters after the oven are usually solvent trapped under a skin that formed too early, solvent pop, which is a different balance problem: too much slow solvent, or too high an oven temperature too soon. Matching the defect to the day's weather, the thinner used and the part thickness, as Plant S did, usually separates them.

## Water in the solvents themselves

Condensation is not the only way water gets into a finish. Acetone and isopropanol mix with water in any proportion, and an open container of either absorbs water vapour from humid air, slowly at first but steadily over days. Plant S's open acetone bucket, before it was replaced in Chapter 5, had been collecting water through the summer as well as losing acetone. Wiping with wet acetone leaves water on the part as the acetone evaporates first, because acetone is the more volatile of the two, and the last of the film on the surface is mostly water. Toluene and the plant's other thinner components dissolve very little water, so the thinner was less affected, though the drum's lid had let in rain on one occasion.

Closed dispensers keep water out as well as solvent in. Where water contamination is suspected, a simple check is to wipe a clean, warm test panel and watch whether the last of the film to dry beads up or leaves water marks.

## Wiping before bonding or painting

The same effect appears, on a smaller scale, when parts are wiped with solvent just before painting or bonding. The acetone wipe on 3 mm steel cools the part by less than a degree on average, but the wiped surface is momentarily much colder while the film evaporates, especially on thin sheet and in a draught. On a humid day, a film of water can form behind the wipe and be painted or bonded over. The companion book on adhesive bonding meets this problem in [preparing surfaces for bonding](/reados/publications/adhesive-bonding-by-the-numbers/preparing-surfaces-for-bonding/), where cold stock and a solvent wipe together put condensation under a bond. The remedies are the same: parts at or above the room temperature, a margin above the dew point, a two-wipe method that removes most of the solvent mechanically, and a short pause before painting or bonding.

## How this applies to a small Australian business

Remember that evaporating solvent cools surfaces, sometimes dramatically. Thin parts and fast solvents cool most. Before spraying or bonding on humid days, check the air's dew point against the part's temperature with a margin that allows for evaporative cooling, and use slower thinners, warm parts or drier air when the margin is small. When a coating blushes, look at the weather, the thinner and the part thickness before blaming the paint. Keep a hygrometer in the booth and write the dew point on the job card: a month of records shows quickly which days and which parts are at risk.

## Exercise: a cool, damp morning

On a winter morning the booth air is at 16 °C and 85% relative humidity, and the guards are at 15 °C. (a) Using the surface dew point check at 101.325 kPa, what is the dew point, and what margin do the guards have before spraying? (b) If spraying cools the guard's surface by 3 K, what happens? (c) What would you do?

**Worked answer.** (a) The tool gives a dew point of **13.5 °C**, so the guards at 15 °C have a margin of **1.5 K**, already below a 3 K margin before any spraying. (b) Cooling by 3 K takes the surface to about 12 °C, **below the dew point**: condensation, and blush, are likely. (c) Warm the booth air, which lowers its relative humidity; bring the guards into the warmed booth well before spraying so they reach its temperature; and use the slow thinner. Warming the air and parts to 22 °C with the same moisture content leaves the dew point at 13.5 °C and gives a margin of about 8.5 K, enough to absorb the evaporative cooling.
