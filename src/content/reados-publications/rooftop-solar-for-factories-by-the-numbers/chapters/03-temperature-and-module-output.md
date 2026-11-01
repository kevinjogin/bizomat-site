---
book: rooftop-solar-for-factories-by-the-numbers
chapterSlug: temperature-and-module-output
order: 3
title: "Temperature and module output"
description: "Why a silicon module loses power as it heats, how to estimate cell temperature from irradiance, air temperature and mounting, and how temperature changes yield and string voltage."
draft: false
---

A solar module on a summer roof is hot to the touch, often above 70 °C, and at that temperature it delivers about a sixth less power than its rating. The rating is measured with the cells held at 25 °C, a temperature they rarely see in full sun. Temperature is the largest steady loss on most Australian arrays after the sun itself, and it affects the voltage the inverter sees on a cold morning as much as the power on a hot afternoon.

This chapter explains why a silicon cell's voltage falls as it warms, how to estimate cell temperature from irradiance, air temperature and the way the module is mounted, and how to use the datasheet's temperature coefficients. It works SF-90's modules on a hot day and over a year, and ends with a yield estimate that treated a flush-mounted roof as if it were an open rack.

## Why the voltage falls

Chapter 2 showed that the open-circuit voltage is set by the balance between generation and recombination, through the saturation current I₀ in V_oc = n N_s V_t ln(I_L ÷ I₀). I₀ is very sensitive to temperature, because it depends on how many carriers the silicon holds without any light at all, its intrinsic carrier density. That density comes from electrons thermally excited across the gap, and it grows steeply with temperature: the intrinsic carrier density squared, which is what I₀ follows, grows roughly as T³ exp(−E_g ÷ kT). Between 25 °C and 35 °C that factor rises about 4.5 times, and between 65 °C and 75 °C about 3.3 times.

More recombination means a lower open-circuit voltage. The thermal voltage V_t in front of the logarithm grows slowly with temperature as well, which partly offsets the loss, and the bandgap itself narrows a little as the crystal warms. Putting those together gives a simple estimate of the change in a cell's open-circuit voltage with temperature: dV_oc ÷ dT ≈ −(E_g0 ÷ q − V_oc + 3kT ÷ q) ÷ T, where E_g0, about 1.205 eV for silicon, is the gap extrapolated to absolute zero.

```figure
type: formula
title: Temperature and a silicon module
formula: dV_oc ÷ dT per cell ≈ −(E_g0 ÷ q − V_oc + 3kT ÷ q) ÷ T
formula: Linear datasheet form: X(T) = X_STC × [1 + β (T_cell − 25)]
formula: Cell temperature: T_cell ≈ T_air + α (1 − η) G ÷ U
formula: NMOT form for an open rack: T_cell ≈ T_air + (NMOT − 20) ÷ 800 × G
caption: β is the datasheet temperature coefficient of the quantity X in per cent per kelvin, divided by 100. α is the share of sunlight the module absorbs, about 0.9; η its efficiency; G the irradiance on the module in W/m²; U the heat loss coefficient from the module to the air, in W/(m²·K), which depends on mounting and wind. NMOT is the nominal module operating temperature from the datasheet.
- E_g0 | silicon bandgap extrapolated to 0 K, about 1.205 eV
- V_oc | open-circuit voltage per cell, V
- T | absolute temperature, K
- β | temperature coefficient, per kelvin
- U | heat loss coefficient, W/(m²·K)
```

For SF-90's cells at 25 °C, with V_oc = 0.707 V per cell and 3kT ÷ q = 0.077 V: dV_oc ÷ dT ≈ −(1.205 − 0.707 + 0.077) ÷ 298.15 = −1.93 mV per kelvin per cell. Over 54 cells that is −0.104 V per kelvin, or −0.27% of 38.2 V per kelvin. The datasheet gives −0.27% per kelvin for the open-circuit voltage, so the physics and the measurement agree.

The equation also shows why better cells lose less. A cell with a higher open-circuit voltage, because it recombines less, has a smaller bracket and a smaller coefficient. That is why heterojunction and TOPCon modules, with their passivated contacts and higher voltages, have smaller temperature coefficients than older cells, and why a wider-gap material such as cadmium telluride loses less still.

## The datasheet coefficients

The short-circuit current rises slightly with temperature, because the narrowing gap lets the silicon absorb a little more of the near-infrared. The fill factor falls, because the diode curve softens as I₀ grows. The net effect on power is a loss a little larger than the voltage loss. SF-90's datasheet gives:

```figure
type: compare
title: SF-90 module temperature coefficients and what they mean at 73 °C
cols: Coefficient | Value at 25 °C | Value at 73 °C | Change
rowhead: Quantity
- Short-circuit current | +0.046% per K | 14.00 A | 14.31 A | +2.2%
- Open-circuit voltage | −0.27% per K | 38.2 V | 33.3 V | −13.0%
- * Maximum power | −0.32% per K | 420 W | 355 W | −15.4%
- Nominal module operating temperature | 42 °C | — | — | 800 W/m², 20 °C air, 1 m/s wind, open rack
caption: This is an illustration. Values at 73 °C use the linear form X(T) = X_STC × [1 + β (T − 25)] at 1,000 W/m². The linear coefficients are measured over a range around 25 °C to about 75 °C and are adequate across normal operating temperatures.
```

## How hot does a module get?

A module in sunlight absorbs about 90% of the light that falls on it and turns about a fifth of that into electricity; the rest is heat. The module warms until it sheds that heat to the air and the sky as fast as it gains it. Its temperature rise above the air is roughly the heat absorbed divided by a heat loss coefficient U: ΔT ≈ α (1 − η) G ÷ U. For SF-90's modules, α (1 − η) = 0.9 × (1 − 0.215) = 0.7065, so at 1,000 W/m² each square metre of module turns about 707 W into heat. On one module that is about 1.4 kW of heat at full sun, more than three times its electrical output.

The heat loss coefficient depends on how freely air moves over both faces of the module, and on the wind. An open rack, with air on both sides, loses heat easily. A module flush-mounted on rails a short distance above a metal roof has only a narrow, partly enclosed air gap behind it and runs hotter. A module built into a roof with nothing behind it runs hotter still.

The datasheet's NMOT gives a check on open-rack mounting. It is measured with the module on an open rack, at 800 W/m², 20 °C air and 1 m/s wind; for SF-90's modules it is 42 °C, a rise of 22 K. That implies U = 0.7065 × 800 ÷ 22 = 25.7 W/(m²·K), which the business uses for the annex frames. For the flush-mounted workshop modules, with a rail height of about 100 mm over a hot steel deck, it uses U = 20 W/(m²·K), a lower value of the order commonly assumed for roof-mounted modules with a restricted air gap. Both are assumed values; the monitoring in Chapter 9 checks them.

```figure
type: bars
title: SF-90 cell temperature at 1,000 W/m² and 38 °C air, by mounting
x: Mounting
y: Cell temperature, °C
caption: This is an illustration. ΔT = 0.7065 × 1,000 ÷ U. Open rack on the annex U = 26 W/(m²·K), 27.2 K rise; flush on the workshop deck U = 20 W/(m²·K), 35.3 K rise; a hypothetical module with no air gap U = 15 W/(m²·K), 47.1 K rise.
- Air | 38.0
- Annex frames, open rack | 65.2
- * Workshop roof, flush on rails | 73.3
- Built in, no air gap | 85.1
```

## The case on a hot afternoon

On a clear January afternoon at Shepparton the air is 38 °C and the irradiance on the modules is close to 1,000 W/m². The workshop modules reach about 73 °C and deliver 420 × [1 − 0.0032 × (73.3 − 25)] = 355 W each, 15.5% below their rating. The annex modules, on their open frames, reach about 65 °C and deliver 366 W, 12.9% below. The whole array, rated 90.72 kW, delivers about 77.1 kW of direct current, before any other loss.

That afternoon matters for the factory, because it is when the workshop's air conditioning and extraction fans draw most. Solar output is not lowest then, but it is well below the rated figure the proposal quoted.

On a sunny winter morning the story reverses. With 10 °C air and 800 W/m², the workshop modules run at about 38 °C, only 4.2% below their rating once scaled for irradiance, and they deliver 322 W each. Cold, clear days are when modules come closest to their datasheet efficiency.

## Temperature over a year

A yield estimate needs the average temperature loss over a year, weighted by energy, because a hot hour at full sun matters more than a cool hour at dawn. A rough estimate takes the air temperature during productive sunshine and the irradiance at which most energy is produced. For Shepparton, the business assumed an energy-weighted daytime air temperature of 22 °C and an energy-weighted irradiance of 650 W/m². Both are assumptions for illustration; simulation software does the same calculation hour by hour from a weather file.

- Workshop roof: 22 + 0.7065 × 650 ÷ 20 = 45.0 °C, a power loss of 0.32 × (45.0 − 25) = 6.4%.
- Annex frames: 22 + 0.7065 × 650 ÷ 26 = 39.7 °C, a loss of 4.7%.

The loss chain in Chapter 4 uses 6.4% and 4.7%.

```figure
type: steps
title: Estimating the yearly temperature loss for a roof array
caption: This is an illustration of the method with SF-90's assumed figures. An hourly simulation is better; this gives a check on its answer.
- Choose U for each mounting | 26 for open frames from NMOT; 20 for flush on a metal roof
- Assume an energy-weighted air temperature and irradiance | 22 °C and 650 W/m² for the site
- Energy-weighted cell temperature | 45.0 °C on the workshop; 39.7 °C on the annex
- * Apply the power coefficient | 6.4% and 4.7% loss against 25 °C
- Compare with the supplier's simulation | ask which mounting and U values it used
```

## Keeping modules cooler

Every kelvin saved on the cells is worth about 0.32% of output, so it is worth knowing what helps and what does not. On a roof, the practical levers are few but real.

- **Rail height and air paths.** A taller air gap behind the modules lets more air move and raises U. On the workshop, the rails sit on brackets that hold the module about 100 mm above the crests of the deck profile. Raising them further would add little and would increase the wind load in Chapter 7. More important is not blocking the gap: rows run up the slope with clear gaps at their lower and upper ends so that warm air can rise out under the ridge.
- **The roof beneath.** A dark roof heats the air in the gap. The workshop deck is a light-coloured coated steel, which reflects much of the light reaching it between rows and keeps the gap cooler than a dark deck would.
- **Row spacing on frames.** On the annex, the frames are spaced for shading (Chapter 6), which also leaves room for air to move behind each row.
- **Not cooling with water.** Spraying water on hot modules does cool them for a while, but it uses water and pumping energy, leaves mineral deposits that soil the glass, and risks thermal shock to hot glass. No module maker the business consulted recommended it for routine use.

Temperature also affects how fast modules age. Encapsulant discolouration, backsheet cracking and the corrosion of cell contacts all run faster at high temperature and humidity, which is why module qualification testing to IEC 61215 includes long exposure at 85 °C and 85% relative humidity and repeated cycling between −40 °C and +85 °C. A module that runs 5 to 8 K hotter for its whole life on a flush roof may age measurably faster than the same module on an open rack. Chapter 9 shows how the business tracks the degradation rate that results.

## Temperature and voltage limits

Temperature also sets the string's voltage range, which Chapter 5 checks against the inverter. The highest voltage comes on the coldest bright morning, when the cells are coldest and the open-circuit voltage highest; Shepparton's design minimum was taken as −4 °C, at which each module's open-circuit voltage is 38.2 × [1 − 0.0027 × (−4 − 25)] = 41.19 V. The lowest voltage comes on the hottest afternoon at maximum power. Using the datasheet's coefficients for voltage at temperature is standard; using the 25 °C figure for either is a common and serious error.

## The error: an open rack on a flush roof

The supplier's first yield report used a simulation in which every module had the open-rack heat loss coefficient implied by the NMOT. That suited the annex frames, but 180 of the 216 modules were to be flush-mounted on the workshop deck. The business's engineer noticed it in the report's loss table: the temperature loss was the same 4.7% for both parts of the array, although the mounting was not.

With the flush roof's lower coefficient, the workshop modules' yearly temperature loss rises from 4.7% to 6.4%, and their output falls by (1 − 0.064) ÷ (1 − 0.047) − 1 = −1.8%. Across the whole array, with the workshop carrying 180 of the 216 modules, the yield was overstated by about 1.5%, about 2 MWh a year. That is not large, but it was a systematic error in the supplier's favour, and over 25 years it adds up to about 50 MWh that would never have been produced.

To confirm which value was closer, the engineer fixed thin-film temperature sensors to the backs of four workshop modules away from their frames and logged them for a fortnight of mixed weather against the inverter's irradiance sensor and a shaded air sensor. Fitting ΔT against G for the clear middays gave an apparent U of about 19 to 21 W/(m²·K), in line with the assumed 20. The supplier reran the simulation with separate mountings.

```figure
type: checklist
title: Checks on the temperature in a yield report
caption: This is an illustration. Applied to every supplier simulation since.
- x Each mounting type has its own heat loss coefficient; flush roofs are not open racks
- x The temperature loss in the report's loss table differs between mountings
- x The power coefficient used matches the datasheet of the module offered
- x String voltage limits use the coldest design temperature, not 25 °C
- ? Back-of-module temperatures logged in the first summer confirm the coefficient (Chapter 9)
```

Back-of-module sensors read a degree or two below the cells, and a sensor taped near the frame reads lower still because the aluminium frame conducts heat away. The sensors were bonded near the centre of a cell, between the junction box and the frame, and shaded from direct sun. An infrared camera can map module temperatures from above, but its reading depends on the emissivity of the glass and the angle of view; READOS's [Infrared Temperature Measurement by the Numbers](/reados/publications/infrared-temperature-measurement-by-the-numbers/) explains the corrections.

## Exercise: a warm, bright spring day

On a spring day the air is 30 °C and the irradiance on the workshop roof is 900 W/m².

1. Estimate the cell temperature of a flush-mounted workshop module.
2. Estimate its maximum power and its open-circuit voltage at that temperature.
3. What would the power be if the module were on the annex frames instead?

### Worked answer

1. ΔT = 0.7065 × 900 ÷ 20 = 31.8 K, so T_cell ≈ 30 + 31.8 = 61.8 °C.
2. At 25 °C and 900 W/m² the module would make about 420 × 0.9 = 378 W. The temperature factor is 1 − 0.0032 × (61.8 − 25) = 0.882, so P ≈ 378 × 0.882 = 333.5 W. The open-circuit voltage is 38.2 × [1 − 0.0027 × 36.8] = 34.4 V, ignoring the small fall with irradiance.
3. On the annex, ΔT = 0.7065 × 900 ÷ 26 = 24.5 K, so T_cell ≈ 54.5 °C and P ≈ 378 × [1 − 0.0032 × 29.5] = 342.4 W, about 2.7% more than on the workshop roof. The difference is the price of flush mounting; it is usually worth paying, because flush rails are cheaper, carry less wind load and need no ballast.
