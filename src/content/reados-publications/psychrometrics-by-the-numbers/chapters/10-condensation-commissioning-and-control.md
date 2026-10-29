---
book: psychrometrics-by-the-numbers
chapterSlug: condensation-commissioning-and-control
order: 10
title: "Condensation, commissioning and seasonal checks"
description: "Check pipes, ducts and cold reels against the dew point, insulate ducts in humid spaces, commission an air-handling unit by measurement, and keep it right with trend logs, calibration and seasonal checks."
draft: true
---

A plant that holds a room at 22 °C and 50% has created a dew point of 11.11 °C, and every surface in the room colder than that will collect water. The coldest surfaces in the print hall are the ones the plant itself brings in: chilled-water pipes, supply ducts and, in winter, paper reels delivered from a cold truck. The same plant also sends cold air through spaces it does not control, where the dew point may be far higher. Condensation is therefore the first thing to check when an air-handling design is finished, and the first thing to look for when it is commissioned.

This chapter checks the hall's cold surfaces against the dew point, sizes the insulation for a duct that passes through a humid ceiling space, then turns to commissioning: the measurements that prove the plant does what the calculations of the earlier chapters say, the trend log that keeps proving it, and the seasonal checks that catch drift before the product does. It ends with a mixed-air sensor that misreported the outdoor air.

## Cold surfaces against the room dew point

This is an illustration. The hall at 22 °C and 50% has a dew point of 11.11 °C, as Chapter 1 found. The [moist air dew point and surface condensation check](/tools/surface-dew-point-check/) calculates the dew point from the air's temperature, relative humidity and pressure, compares a surface temperature with it, and reports the margin and the relative humidity the air would have at the surface. A margin of 3 K is used here as the minimum, to allow for sensor error, local humidity from people and processes, and surfaces that are colder than their measured average.

```figure
type: compare
title: Cold surfaces in the print hall against its 11.11 °C dew point
cols: Surface temperature | Margin | Tool verdict, 3 K required
rowhead: Surface
caption: This is an illustration from the surface condensation check at 22 °C and 50%. A margin below zero means the surface is wetter than saturation would allow and water forms on it.
- Bare chilled-water pipe | 7.0 °C | −4.11 K | SURFACE WILL SWEAT
- Paper reel straight off a winter truck | 8.0 °C | −3.11 K | SURFACE WILL SWEAT
- Supply duct carrying 13.6 °C air, uninsulated | 13.6 °C | +2.49 K | MARGIN TOO SMALL
- Paper reel after acclimatising in its wrap | 14.2 °C | +3.09 K | SURFACE STAYS DRY
```

The chilled-water pipes are the plain case: they must be insulated with a closed-cell material and a continuous vapour seal, including valves, flanges and supports. [Cold pipes, sweating and insulation](/reados/publications/condensation-control-by-the-numbers/cold-pipes-sweating-and-insulation/) in *Condensation Control by the Numbers* works through the thickness calculation and the details that fail.

The paper reels are an operational problem. Chapter 1 showed why a reel at 8 °C sweats in the hall. The fix is a rule, not a plant change: reels arriving in cold weather stay in their wrap until their surface is above the room dew point plus the margin, here 11.11 + 3 = **14.1 °C**, measured with a surface thermometer. The wrap keeps the room's moisture off the reel while it warms; unwrapped too early, the outer turns take up water that shows up later as cockling and register problems.

The supply duct in the hall is borderline. At a 2.49 K margin it will stay dry most of the time, but local humidity near people and the inaccuracy of the room sensor are enough to wet it on a bad day. Thin insulation removes the doubt.

### Monday morning

The margins above assume the hall is at its design state. After a humid summer weekend with the plant off, it is not. This is an illustration. If the closed hall has drifted to 27 °C and 65%, its dew point is 19.86 °C, and the surface check gives a margin of −6.26 K for the 13.6 °C supply duct and its diffusers. When the plant starts, the cold supply air chills the diffusers and the uninsulated duct well before the coil has dried the hall, and they drip onto whatever is beneath them.

Two measures avoid it. The plant can start with the cooling coil dehumidifying and the supply temperature held higher for the first hour or so, so that the hall's dew point falls before the supply air reaches its design temperature; and diffusers and ducts over presses and paper stacks can be insulated or placed so that a drip lands on the floor. Starting earlier on a Monday costs less energy than it seems, because the moisture has to be removed either way.

## A duct in a humid ceiling space

The worse duct is the one that leaves the hall. This is an illustration. A branch duct carrying 13.6 °C supply air runs through a ceiling space above the offices that is ventilated to outdoors. On the humid design day that space is at about 29 °C and 70%, with a dew point of **22.97 °C**. The surface check gives a margin of −9.37 K for the bare duct: it will run with water and drip through the ceiling.

The insulation must hold the outer surface at or above 22.97 + 3 = about 26 °C.

```figure
type: formula
title: Insulation to keep a cold duct's outer surface above the dew point
formula: R_total = R_out × (t_air,out − t_duct) ÷ (t_air,out − t_surface)
formula: thickness = (R_total − R_out) × k
caption: This is an illustration for a flat duct wall, ignoring the small resistance of the inside air film and the sheet metal, which makes the answer slightly conservative. The outside film coefficient and the insulation conductivity come from the insulation maker's data.
- R_out | outside surface resistance, 1 ÷ 6 W/m²·K = 0.167 m²·K/W
- k | insulation conductivity, taken as 0.035 W/m·K
- t_air,out | ceiling space, 29 °C
- t_duct | supply air, 13.6 °C
- t_surface | outer surface needed, 26 °C
step: R_total = 0.167 × 15.4 ÷ 3.0 = 0.856 m²·K/W
step: thickness = (0.856 − 0.167) × 0.035 = 0.0241 m, about 24 mm; with 25 mm the surface reaches 26.09 °C
```

The surface check, with the ceiling space at 29 °C and 70% and the surface at 26 °C, gives a margin of 3.03 K and **SURFACE STAYS DRY**. The thickness is only half the answer. Moisture that reaches the cold metal through a gap in the vapour barrier condenses inside the insulation, where nobody sees it until the ceiling stains. Joints must be taped and sealed, hangers must not compress or pierce the insulation, and the barrier must be continuous at every flexible connection and access panel.

## Commissioning by measurement

Commissioning proves that the plant does what the calculations say. For an air-handling unit that controls humidity, that means measuring air flows and air states, not just watching the room sensor settle.

```figure
type: steps
title: Commissioning measurements for the print hall's air-handling unit
caption: This is an illustration of a measurement plan. Each reading is compared with the design figure from the earlier chapters, and every difference larger than the instrument's uncertainty is explained before the plant is accepted.
- Air flows | Outdoor, return and supply by duct traverse; design 3.0, 5.0 and 8.0 m³/s
- Mixed air | Temperature and humidity by traverse across the plenum, not one sensor; compare the outdoor-air fraction found from temperature and from humidity ratio
- Coil leaving | Temperature and humidity across the coil face on a humid day; design 11.0 °C and 95%
- Supply | Temperature after the fan; check the fan heat, about 1.6 K at design flow
- Room | Temperature, humidity and dew point at several points with a calibrated reference instrument
- Sequences | Force each control mode in turn and confirm the valves, humidifier and dampers respond as Chapter 8 describes
```

The outdoor-air fraction is the measurement that most often disagrees with the design, and it can be checked two ways. The mixed air's humidity ratio and enthalpy are dry-air-weighted averages of the two streams, and its temperature very nearly so. The fraction of outdoor air by dry-air mass is therefore:

x = (t_return − t_mixed) ÷ (t_return − t_outdoor), or x = (ω_return − ω_mixed) ÷ (ω_return − ω_outdoor)

This is an illustration. On the winter design day, return 22 °C and 8.225 g/kg, outdoor 5 °C and 4.314 g/kg, mixed 15.39 °C and 6.698 g/kg, the temperature gives (22 − 15.39) ÷ (22 − 5) = 0.389 and the humidity ratio gives (8.225 − 6.698) ÷ (8.225 − 4.314) = 0.390. Both agree with the 39.0% that Chapter 5 calculated with the [mixing of two air streams](/tools/air-stream-mixing-check/). When the two methods disagree, one of the readings is wrong, usually because the mixed air is not mixed where the sensor is.

## The error: a sensor in a stratified plenum

This is an illustration. During commissioning on a cold morning near the winter design day, the building management system showed a mixed-air temperature of 17.5 °C. From the temperature method, that implied (22 − 17.5) ÷ (22 − 5) = 0.265, an outdoor-air fraction of only 26.5% by mass instead of 39%. The controls contractor began adjusting the outdoor-air damper open.

The commissioning engineer stopped the adjustment and checked first. The single mixed-air sensor sat near the top of the mixing plenum, where the warm return air entered above the outdoor-air louvre, and cold outdoor air ran along the plenum floor without mixing. A nine-point traverse across the plenum outlet averaged 15.4 °C, which gives (22 − 15.4) ÷ (22 − 5) = 0.388, and a pitot traverse of the outdoor-air duct measured 3.0 m³/s, the design flow. The damper had been right; the sensor was wrong.

Had the damper been opened to correct a sensor error, the hall would have received far more cold, dry outdoor air than designed, the humidifier of Chapter 6 would have been overloaded and, on a frosty morning, the coil could have been exposed to freezing air. The single sensor was replaced with an averaging element strung across the plenum outlet, and the commissioning record now notes that the mixed-air reading must agree with a traverse within 0.5 K.

## The fan as a flow meter

The supply fan's heat gives a quick check on the air flow that needs no traverse. All the power the fan motor absorbs ends up as heat in the air when the motor sits in the air stream, so the temperature rise across the fan section is the absorbed power divided by the air's heat capacity flow.

This is an illustration. At design, 15 kW into 9.311 kg/s of dry air with a moist specific heat of 1.020 kJ/kg·K gives a rise of 15 ÷ (9.311 × 1.020) = 1.58 K. Suppose commissioning measures the fan's absorbed power at 15 kW, from the drive's display or a power meter, but a temperature rise of 2.0 K across the fan section with steady coil-leaving conditions. The air flow is then about 15 ÷ (1.020 × 2.0) = 7.35 kg/s, some 21% below design. The rise is small and the thermometers must be good, with readings averaged across the section, but a difference of this size is well outside their uncertainty. It points to a closed damper, a blocked filter, a fan running backwards or a duct system with more resistance than designed, and it is worth finding before the coil and humidifier calculations of Chapters 6 and 7 are judged against a flow the plant is not delivering.

## Where the room sensor sits

Every calculation in this book ends at the room sensor, and the sensor reads only the air around it. In a print hall that air can differ from the hall's average by more than the printer's whole tolerance. A sensor near a press's heat exhaust reads warm and dry; one in a supply jet reads cool and moist; one on an outside wall in winter reads the wall's chill; one in sunlight reads the sun.

A good location is at working height, in air that represents the area where the paper is handled, away from supply outlets, press exhausts, doors, outside walls and direct sun. In a hall of 1,800 m² one sensor is rarely enough. Two or three sensors, averaged by the controls, with each also logged separately, show whether the hall is uniform and whether one sensor has started to drift away from the others. The commissioning record should note each sensor's position and the reference reading it was checked against, so that a later drift can be distinguished from a change in the hall.

## Trend logs and calibration

A plant that was right at commissioning drifts. Sensors age, dampers stick, coils foul and setpoints are changed for good reasons and forgotten. A trend log, kept by the building management system at intervals of a few minutes, is the cheapest way to see drift before the product does.

The useful points to log for this plant are the outdoor, mixed, coil-leaving, supply and room temperatures and humidities; the room dew point calculated from temperature and humidity; the cooling, reheat and heating valve positions; the humidifier output; and the damper positions. Three comparisons on that log find most faults:

- **Room humidity ratio against supply humidity ratio.** At full load the room should be about 0.4 g/kg wetter than the supply in summer, as Chapters 4 and 8 showed. A larger or smaller difference means a sensor is wrong or the latent load has changed.
- **Cooling and reheat at the same time.** Expected in dehumidification at part load, but its hours and size should match Chapter 8's pattern. Reheat on a dry day, or with the room humidity below setpoint, is a control fault.
- **Humidifier and cooling coil at the same time.** Should never happen. If it does, the deadband has been closed or a sensor has failed.

Humidity sensors need regular checks against a reference instrument, as Chapter 3 described, at least once a year and before each summer. Chapter 8's sensor read five points high for a year before anyone looked; a ten-minute check would have found it.

```figure
type: checklist
title: Seasonal checks for the hall and warehouse
caption: This is an illustration of a plant's own routine. The open item is the one that failed in Chapter 8.
- Before summer: coil cleaned, drain pan clean and trap primed | the coil makes about 132 L/h on a humid day
- Before summer: chilled-water supply temperature confirmed | the coil cannot reach 11.0 °C with water that is too warm
- Before summer: evaporative coolers cleaned, pads checked, bleed and float working | effectiveness measured as in Chapter 9
- Before winter: humidifier serviced, high-limit sensor and airflow interlock tested | humidifier off when the fan stops
- Before winter: coil frost protection and mixed-air averaging sensor checked | stratified cold air reaches the coil first
- ? Room and duct humidity sensors checked against a calibrated reference | drift shows up as wasted energy before it shows up in the product
- x Setpoints changed without recording why | the next person cannot tell a fault from a decision
```

## How this applies to a small Australian business

Condensation damage is usually a design detail and a commissioning shortcut: a branch duct left bare in a ceiling, a valve left uninsulated, a sensor installed where it was convenient. Each is cheap to prevent and expensive to repair after water has stained ceilings, rusted ducts or spoiled stock. A small business commissioning a humidity-controlled space, whether a print room, a food store, a laboratory or a server room, can ask for three things: the dew-point margin on every cold surface, a measured outdoor-air flow, and a calibration record for every humidity sensor. With those, and a trend log looked at once a month, the calculations in this book stay true in service.

## Exercise: checking the outdoor air on a mild morning

On a morning at 8 °C and 70% outdoors, with the return air at 22 °C and 50%, a nine-point traverse of the mixing plenum averages 16.6 °C. The total dry-air flow through the unit is about 9.65 kg/s. Find the outdoor-air fraction by mass, the outdoor-air dry-air flow, and its volume flow at the outdoor state, whose specific volume is 0.8023 m³/kg dry air. Compare it with the design 3.0 m³/s.

**Worked answer.** The fraction is (22 − 16.6) ÷ (22 − 8) = 5.4 ÷ 14 = **0.386**, or 38.6% by mass. The outdoor dry-air flow is 0.386 × 9.65 = **3.72 kg/s**, and its volume flow is 3.72 × 0.8023 = **2.99 m³/s**, within measurement uncertainty of the design 3.0 m³/s. The damper is set correctly. If the mixed-air humidity were also measured by traverse, the humidity-ratio method would give a second estimate; agreement between the two, as on the winter design day, confirms that the traverse represents the mixed air.
