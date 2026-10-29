---
book: psychrometrics-by-the-numbers
chapterSlug: measuring-humidity-on-site
order: 3
title: "Measuring humidity on site: wet bulb, dew point and sensors"
description: "How wet-bulb psychrometers, chilled-mirror hygrometers and capacitive humidity sensors work, how to calibrate them with saturated salts, and where to put them so they read the space and not a press."
draft: true
---

Every psychrometric calculation starts from a measurement, and humidity is one of the hardest everyday quantities to measure well. A temperature sensor that is half a kelvin out is a minor nuisance; a humidity sensor that is three percentage points out can send a humidifier chasing a target that does not exist. Worse, a perfectly good sensor can give a misleading reading because of where it is, since relative humidity changes with the local temperature even when the air's water content does not.

This chapter explains the three ways humidity is measured on site: the wet bulb, the dew point and the electronic relative humidity sensor. It shows how errors in each propagate into the numbers an engineer uses, how to check a sensor against saturated salt solutions, and how to survey a space. The running case ends with a hall humidity sensor that was accurate and still wrong, because it was mounted beside a press.

## Three temperatures

Moist air has three temperatures that an engineer measures or calculates.

- **The dry bulb** is the temperature of the air, read by an ordinary thermometer shielded from radiation.
- **The wet bulb** is the temperature of a thermometer whose bulb is covered by a wet wick and ventilated by the air. Water evaporates from the wick, cooling it until the heat flowing in from the air just balances the heat taken by evaporation. The drier the air, the faster the evaporation and the lower the wet bulb.
- **The dew point** is the temperature at which the air's vapour would start to condense if it were cooled at constant pressure and water content.

For any air that is not saturated the three are in a fixed order: the dew point is lowest, the wet bulb in the middle and the dry bulb highest. At saturation all three are equal.

```figure
type: compare
title: Dry bulb, wet bulb and dew point for the press hall's design states
cols: Dry bulb | Wet bulb | Dew point | Depression, dry minus wet
rowhead: State
caption: This is an illustration. Wet bulbs calculated from the adiabatic saturation balance at 101.325 kPa, the method the WORKOS evaporative cooler tool uses. The wet-bulb depression is largest for the hot, dry afternoon.
- * Room, 50% | 22.0 °C | 15.42 °C | 11.11 °C | 6.58 K
- Summer humid, 70% | 29.0 °C | 24.59 °C | 22.97 °C | 4.41 K
- Summer hot-dry, 20% | 38.0 °C | 20.76 °C | 11.15 °C | 17.24 K
- Winter, 80% | 5.0 °C | 3.59 °C | 1.84 °C | 1.41 K
- Mixed air, summer humid day | 24.59 °C | 19.19 °C | 16.45 °C | 5.40 K
```

## The wet bulb and adiabatic saturation

There are two wet bulbs, and the distinction matters for precise work. The **thermodynamic wet bulb** is defined by a thought experiment: air passes over a long pool of water in an insulated duct, water evaporates until the air leaves saturated, and the make-up water is supplied at the leaving temperature. That temperature is the adiabatic saturation temperature, and it follows exactly from an energy balance on the duct.

```figure
type: formula
title: Humidity ratio from the dry bulb and the thermodynamic wet bulb
formula: ω = [1.005 (t_wb − t) + ω_s(t_wb) × (h_g(t_wb) − h_f(t_wb))] ÷ (h_g(t) − h_f(t_wb))
caption: The adiabatic saturation balance, with h_g = 2500.9 + 1.82 t and h_f = 4.18 t in kJ/kg. Worked for an aspirated psychrometer reading in the press hall.
- t, t_wb | dry bulb and wet bulb, °C
- ω_s(t_wb) | humidity ratio of saturated air at the wet bulb
- h_g, h_f | enthalpy of water vapour and of liquid water
step: Reading 22.0 °C dry and 15.42 °C wet: ω = 8.225 g/kg dry air, relative humidity 50%, dew point 11.11 °C
step: A wet bulb 0.5 K higher, 15.92 °C, gives 53.4%; 0.5 K lower gives 46.7%
```

Cooling towers depend on the same temperature, and [Moist air and the wet-bulb temperature](/reados/publications/cooling-towers-by-the-numbers/moist-air-and-the-wet-bulb/) shows how it governs a tower's performance. The **psychrometric wet bulb** is what a real wet-bulb thermometer reads. Its temperature is set by a balance between heat transfer to the wick and mass transfer from it, not by adiabatic saturation. For water evaporating into air near room conditions the ratio of the two transfer rates happens to make the two wet bulbs almost equal, which is why the simple instrument works. The agreement holds only if the wick is properly wetted, clean and ventilated at the airspeed the instrument's maker specifies. An unventilated wick, as on a wet-and-dry thermometer hanging on a wall, reads too high, because heat conducted and radiated to it is not carried away fast enough. A wet bulb 1 K too high in the press hall would make 50% air read 56.8%.

### Aspirated psychrometers

An aspirated psychrometer carries two shielded thermometers, one with a wick, and a small fan that draws air across both at a steady speed. Its strength is that it measures two temperatures, which are easy to measure and easy to check, and turns them into humidity with an equation. Its weaknesses are practical. The wick must be clean and wet with distilled water; dirt or minerals slow evaporation and raise the reading. The instrument must run long enough for the wet bulb to settle to its lowest value. Below about 0 °C the wick freezes and a different equation applies. And the user's body and breath must be kept clear of the intake.

## The chilled-mirror dew-point hygrometer

A chilled-mirror hygrometer measures the dew point directly. A small polished mirror in the sample air is cooled until a film of dew forms on it, detected optically by the change in reflected light, and a control loop then holds the mirror at the temperature where the film neither grows nor shrinks. That temperature, read by a precise thermometer embedded in the mirror, is the dew point, or the frost point if the film is ice.

Because it measures a temperature and relies on a physical definition rather than a material's response, the chilled mirror is the usual reference instrument against which other humidity sensors are calibrated. It is also slower, more expensive and more delicate than a sensor. Contaminants that dissolve in the dew film lower its vapour pressure and shift the reading, so the mirror must be cleaned and checked to the maker's procedure. A dew-point reading is converted to relative humidity using the dry bulb, and the conversion is forgiving: in the press hall a dew-point error of 0.2 K changes the calculated relative humidity by less than 0.7 percentage points.

## Capacitive relative humidity sensors

Most building and process sensors are capacitive. A thin polymer film sits between two electrodes; the polymer absorbs water from the air in proportion to the relative humidity at its own temperature, and the absorbed water changes its dielectric constant and so the capacitance. Electronics turn the capacitance into a relative humidity, usually with a temperature measurement alongside so that the instrument can also report a dew point.

Capacitive sensors are small, cheap and respond in seconds to minutes. Their limitations are those of any material that absorbs water. They drift with time, and faster in contaminated or very humid air; they show some hysteresis, reading differently on a rising and a falling humidity; and their accuracy is specified over a stated range and temperature, often wider near the ends of the range. The accuracy that matters is the one on the sensor's data sheet at the conditions it will see, together with the maker's guidance on recalibration. A sensor installed and never checked should be assumed to have drifted.

## Calibrating with saturated salts

A saturated solution of a salt in water, in a small sealed chamber, holds the air above it at a fixed relative humidity that depends on the salt and, slightly, on temperature. The values were measured carefully and published by Greenspan in 1977; at 25 °C, for example, saturated magnesium chloride holds about 33% and saturated sodium chloride about 75%. ASTM E104 sets out the practice for maintaining constant relative humidity with such solutions. Two salts that bracket the working range give a two-point check of a sensor's offset and slope.

```figure
type: checklist
title: Checking a capacitive humidity sensor against saturated salts
caption: A field check, not an accredited calibration. Use the salt values for the actual chamber temperature from the published tables, and keep a record of the readings before and after any adjustment.
- Use reagent-grade salt and distilled water, with undissolved salt visible in the solution | without undissolved salt the solution is not saturated
- Hold the chamber at a steady temperature, away from sun and drafts | the fixed point shifts with temperature, and the air must be at one temperature throughout
- Allow the sensor and chamber to reach equilibrium, often several hours | a reading taken too soon reflects the room, not the salt
- Record the reading at a low and a high fixed point | two points give the offset and the slope
- x Do not adjust a sensor against a single point near its working value only | an error in slope will reappear when the humidity changes
- ? Ask whether the sensor's own temperature compensation was active and correct during the check | a sensor that reports dew point also needs its temperature checked
```

Recording the as-found readings, before any adjustment, is the useful part of the exercise: it measures how far the sensor drifted in service, and so how often it needs checking.

## How errors propagate

A humidity reading is only as good as the temperature that goes with it. With the water content fixed, relative humidity in the press hall changes by about 3 percentage points for each kelvin of temperature, because the saturation pressure rises by roughly 6% per kelvin. The table shows the consequences of small errors in each kind of reading.

```figure
type: bars
title: Relative humidity reported for the hall's true 22 °C and 50% after a small error
unit: %
max: 60
caption: This is an illustration. Each bar is one error alone. A psychrometer whose dry bulb reads high gives too low a humidity, because the larger depression is read as drier air; a capacitive sensor at a warmer spot reads low because the air there really is at a lower relative humidity.
- Wet bulb 0.5 K high | 53.4
- Wet bulb 0.5 K low | 46.7
- Psychrometer dry bulb 0.5 K high | 47.3
- Sensor in air 0.5 K warmer than the room | 48.5
- * Sensor in air 3 K warmer, beside a press | 41.7
- Dew point 0.2 K high | 50.7
```

The lesson is that the place matters as much as the instrument. The last two bars are not instrument errors at all: a perfect sensor in warmer air reports that air's relative humidity correctly. It is simply not the air the engineer wanted to measure.

## Where to put the sensors

This is an illustration. In the press hall, sensors were needed for control and for the printer's quality records. The engineer set out the following rules for placement.

- **Read the occupied zone, away from heat sources.** Presses, drying units, lights and sunlit walls all create local warm air. A room sensor belongs in free-moving air at working height, away from the presses' exhausts and out of direct sun.
- **Shield it from radiation.** A sensor in sunlight or in view of a hot surface warms above the air temperature and reads low.
- **In a duct, read mixed air.** Downstream of a mixing box, two streams can flow side by side for several duct diameters, and downstream of a steam humidifier the steam needs a distance, which the humidifier's maker states, to be absorbed. A sensor inside that distance reads too high or sees droplets.
- **Pair humidity with temperature at the same point.** A relative humidity without its own temperature cannot be converted to a dew point or humidity ratio.
- **Prefer dew point for comparisons.** Dew point does not change when air is heated or cooled, so it can be compared between the room, the duct and outdoors.

## Surveying a space

A single sensor reports one point. Before trusting it for control, or when a complaint arrives, the space should be surveyed: the same quantity measured at many points over a short time with one portable instrument, so that differences between points are real and not differences between instruments.

This is an illustration. The engineer's survey of the press hall followed a simple routine. A plan of the hall was divided into a grid of twelve points at working height, with extra points at the control sensor, at the supply diffusers, in the return grille and beside each press. At each point the psychrometer ran until the wet bulb stopped falling, and the dry bulb, wet bulb and time were written down together with a note of anything nearby: an open dock door, a press running or idle, sun on a wall. The readings were converted to humidity ratio and dew point before anything was compared.

Converting before comparing is the step that makes a survey useful. Relative humidities taken at different temperatures cannot be compared, but humidity ratios can. A hall with one source of moisture and good mixing shows nearly the same humidity ratio everywhere, with temperatures that vary from point to point; the relative humidity then varies only because the temperature does. A point whose humidity ratio differs from the rest has a moisture source or sink nearby: a leaking steam valve, a wet floor, a door to a humid store, or a cold surface collecting condensate. A point whose temperature alone differs has a heat source, and a sensor there will read a misleading relative humidity even though the air carries the same water as everywhere else.

### Response time and averaging

Humidity changes slowly in a large space and quickly in a duct. A capacitive sensor in a duct after a humidifier sees the humidifier's on-off cycling within a minute or two, while the hall's humidity, buffered by its volume and by the paper stacked in it, changes over tens of minutes. A control loop that acts on every flicker of the duct sensor will hunt. The usual arrangement is to control the humidifier from the space or return air, with a duct sensor acting only as a high limit that stops the humidifier before the duct air reaches saturation. Logged data should record the averaging interval, because a fifteen-minute average and a one-second sample of the same sensor can differ by several percentage points during a door opening or a humidifier start.

## The error: an accurate sensor beside a press

This is an illustration. In the first winter of operation the printer reported wavy edges on stacked board, a sign of uneven moisture uptake. The hall's control display showed 50%, the setpoint, and had done so all week. The humidifier was running close to its full output.

The engineer surveyed the hall with an aspirated psychrometer, taking readings at working height at twelve points. They agreed closely: dry bulb 22 °C, wet bulb about 16.9 °C, which the adiabatic saturation balance turns into about 9.9 g/kg and nearly 60% relative humidity. The hall was far wetter than its display claimed. The control sensor itself was then checked against two saturated salts and found well within its specification.

The cause was its position. It had been mounted on a column 2 m from a press's drying unit, where the air was about 3 K warmer than the hall. In air at 25 °C, the hall's correct 8.225 g/kg reads only 41.7%. The controller had kept adding steam until the warm air beside the press read 50%, which needs 9.882 g/kg; in the 22 °C hall that water content is **59.9%**, with a dew point of 13.86 °C, above the 13.58 °C supply duct of Chapter 1. On the design winter day, sustaining that extra water would take about 58 kg/h of steam on top of the 47 kg/h the hall properly needs, more than the humidifier could deliver, which is why it was running flat out and the humidity was still climbing.

The sensor was moved to a free-standing post in the middle of the hall, shielded and away from the presses, and a second sensor was fitted in the return duct, where the air is well mixed, as a cross-check. The control display now shows dew point beside relative humidity, and a difference of more than 1 K between the two sensors' dew points raises an alarm.

## How this applies to a small Australian business

Most humidity complaints in small facilities start with a reading on a cheap display. Before acting on it, check two things: whether the reading has been compared with anything else recently, and whether the sensor is in air that represents the space. A hired or borrowed aspirated psychrometer, or a good handheld dew-point meter, and an hour walking the space with it, is the most cost-effective humidity measurement there is. For records that matter to a customer, such as stored product, printed goods or timber, keep a log of sensor checks with the as-found and as-left readings, and replace sensors that drift more than their data sheet allows.

## Exercise: one psychrometer reading

During commissioning, an aspirated psychrometer in the press hall reads 22.0 °C dry bulb and 15.6 °C wet bulb at 101.325 kPa. Find the humidity ratio, the relative humidity and the dew point, and say whether the hall is within the printer's 50 ± 5% band.

**Worked answer.** This is an illustration. The saturated humidity ratio at 15.6 °C is found from its saturation pressure, and the adiabatic saturation balance in the formula figure then gives ω = **8.424 g/kg dry air**. At 22 °C that is a relative humidity of **51.2%**, with a dew point of **11.47 °C**. The hall is within the band, 0.18 K of wet bulb above its design state. A wet-bulb reading taken from an unventilated or dirty wick could easily be 1 K high, which would have reported about 58% and suggested a fault that did not exist.
