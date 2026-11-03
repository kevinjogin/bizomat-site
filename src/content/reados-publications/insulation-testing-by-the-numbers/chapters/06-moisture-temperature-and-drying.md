---
book: insulation-testing-by-the-numbers
chapterSlug: moisture-temperature-and-drying
order: 6
title: "Moisture, temperature and drying"
description: "How water gets into windings, dew point and condensation in a cold store, the blast freezer investigation, drying a wet winding, trending with a control chart, and drying stopped when it was working."
draft: false
---

Moisture is the commonest reason for a low insulation resistance, and in a cold store it is a constant threat. Motors in freezer rooms run at well below zero, and every time warm, moist air reaches them, during a defrost, a door opening or a stop, water condenses or freezes on them. Motors in the plant room cool down when they stop, and on humid days the air around them may be wetter than their surfaces can tolerate. Water reduces insulation resistance, and wet insulation that is energised can track and fail. But wet insulation that has not been damaged can usually be dried and returned to service, and knowing how to judge the drying is as important as knowing how to detect the water.

This chapter explains how water gets into windings and when condensation occurs, follows the investigation of the blast freezer fan motors that Chapter 1 began, describes how to dry a winding and judge the progress, sets statistical limits for C-1's readings with an individuals control chart, and finishes with a drying run that was stopped because the readings were falling, when the winding was in fact drying well.

## How water gets in

Water reaches insulation in four ways. It is **absorbed** from humid air into the bulk of materials such as polyester, paper and some resins, slowly over days and weeks. It **condenses** on surfaces whose temperature is below the dew point of the surrounding air, in minutes. It arrives as **liquid water** from washdown, roof leaks, drips from cooling coils and condensate drains that overflow. And in freezer rooms it **freezes** on cold surfaces as frost, which melts to water when the surface warms during a defrost or a stop.

Condensation is the fastest and, in a cold store, the most important. The dew point is the temperature at which air, cooled at constant pressure and moisture content, becomes saturated. Any surface colder than the dew point of the air touching it collects water. A good approximation for the dew point is the Magnus formula.

```figure
type: formula
title: Dew point by the Magnus formula
formula: γ = ln(RH ÷ 100) + a × T ÷ (b + T)
formula: T_d = b × γ ÷ (a − γ)        a = 17.62, b = 243.12 °C
caption: Accurate to a few tenths of a degree for air between about −45 °C and 60 °C over water. Over ice, slightly different constants apply.
- T | air temperature, °C
- RH | relative humidity, %
- T_d | dew point, °C
```

The cold store's loading dock and the anterooms of the freezer rooms are typically at about 8 °C and 85 % relative humidity in winter, with a dew point of 5.6 °C. Outdoor air on a summer evening at 18 °C and 70 % has a dew point of 12.4 °C. A fan motor in a −25 °C freezer room is far below either, so any of that air reaching it deposits frost.

```figure
type: stats
title: Dew points around the cold store
caption: This is an illustration. Calculated by the Magnus formula from typical conditions; any surface colder than the dew point collects water or frost.
- 5.6 °C | dock and anterooms, 8 °C and 85 % RH
- 12.4 °C | outdoor air on a summer evening, 18 °C and 70 % RH
- 20.0 °C | plant room on a humid summer afternoon, 30 °C and 55 % RH
- −25 °C | storage freezer rooms, where the fan motors run
```

## The blast freezer investigation

Chapter 1 found that the four evaporator fan motors in the two blast freezers failed about seventeen times as often as the twenty in the storage rooms. The electrical supervisor and the refrigeration technician investigated together.

The blast freezers defrost their coils with hot gas four times a day, against once a day in the storage rooms, because the warm product loaded into them carries a lot of moisture that freezes onto the coils. During each defrost, the fans are stopped and the coil heated to melt its frost. The meltwater is meant to run into a drain pan below the coil and out through a heated drain. In the blast freezers, the fan motors are mounted on the coil casing below the drain pan's edge.

Inspection found two problems. The heated drain lines in both blast freezers were partly blocked with ice, so the drain pans overflowed during defrosts and meltwater ran down the casing onto the motors. And the motors had been fitted with their condensate drain holes on the top rather than the bottom, so water that got into the motor frames could not get out. Each defrost wetted the end windings; each restart energised a wet winding at well below zero; and the water that froze inside the frame between defrosts expanded and opened the varnish further.

```figure
type: steps
title: Fixing the blast freezer fan motors
caption: This is an illustration of the corrective actions. The motors' failure record is reviewed again in Chapter 10.
- Root cause 1 | heated drain lines partly blocked with ice; drain pans overflowed during defrosts
- Root cause 2 | motor drain holes at the top of the frames; water could not escape
- Fix 1 | drain line heaters repaired and checked on the defrost controller's alarm list
- Fix 2 | motors remounted with drain holes at the lowest point; drip shields fitted above them
- Fix 3 | fan restart delayed after each defrost until the coil has drained
- * Check | insulation resistance of each blast freezer motor tested at every planned stop for a year
```

## Drying a wet winding

A winding that has absorbed water but has not tracked or burnt can usually be dried. The methods heat the winding gently and for long enough to drive the water out.

**Oven drying**, for motors small enough to remove, places the stator in a ventilated oven at a controlled temperature. **Hot air** can be blown through a large machine in place with its covers partly removed. **Current heating** passes a controlled low-voltage current, DC or AC, through the winding itself so that its own resistance heats it. **Space heaters**, already fitted to many large motors, dry slowly but are useful for keeping a dried winding dry.

Whatever the method, the winding temperature must be measured and held below a limit that does not damage the insulation: well below its thermal class and within the maker's or rewinder's guidance. The cold store's procedure holds windings at no more than 80 °C during drying. Heating too fast can turn water to steam inside the insulation and damage it.

## Judging the drying

The progress of drying is judged by insulation resistance measured at intervals. The difficulty is that two effects act at once. As the winding warms, its resistance falls steeply, about halving for each 10 °C, as Chapter 2 showed. As the water leaves, its resistance rises. Early in a drying run, the temperature effect wins, and the raw readings fall. Later, with the winding at a steady temperature, the readings rise as the water leaves, and finally level off when it is dry.

The way to see the true progress is to correct each reading to 40 °C. The corrected curve rises steadily from the start, and drying is complete when it has levelled off for several hours at the drying temperature. A final test after the winding has cooled to room temperature confirms the result, and the polarisation index, for a winding where it is meaningful, should have recovered too.

```figure
type: line
title: EF-03 drying in the rewinder's oven, IR₁ corrected to 40 °C
x: Hours in the oven
y: IR₁ corrected to 40 °C, MΩ
ymin: 0
ymax: 1300
caption: This is an illustration. Raw readings at 500 V DC: 40 MΩ at 15 °C at the start, falling to 6 MΩ at 78 °C after four hours, then rising to 72 MΩ at 80 °C after forty hours. Corrected, the curve rises from the start and levels off near 1,150 MΩ.
- 0 | 7.1
- 2 | 36
- 4 | 83.6
- 8 | 160
- 16 | 480
- 24 | 992
- 32 | 1120
- 40 | 1152
```

## The mistake: stopping when it was working

The first time EF-03 was dried, the site did the drying itself, in a small oven in the workshop, and a technician took readings every hour. The motor started at 40 MΩ at 15 °C. After two hours it read 9 MΩ, and after four hours 6 MΩ. Concluding that the oven was making the motor worse, perhaps by drawing water deeper into the winding, the technician switched off the oven and reported that the motor could not be dried and should be rewound.

The electrical supervisor corrected the readings to 40 °C. At the start, 40 MΩ at 15 °C corrects to 40 × 0.5^2.5 = 7.1 MΩ. After two hours at 60 °C, 9 MΩ corrects to 9 × 0.5^(−2) = 36 MΩ. After four hours at 78 °C, 6 MΩ corrects to 6 × 0.5^(−3.8) = 83.6 MΩ. The winding's corrected resistance had risen almost twelvefold in four hours: the drying was working well.

The motor was sent to the rewinder for a full drying run, with the readings shown in the figure above. After forty hours it had levelled off at about 1,150 MΩ corrected, and after cooling to 22 °C it read about 4,000 MΩ, comparable with the storage-room motors. The rewind was not needed. The site's drying record sheet now has a column for the corrected value next to every raw reading, and the instruction to judge drying only by the corrected column.

```figure
type: compare
title: EF-03's first four hours, raw and corrected
cols: Winding temperature | Raw IR₁ | IR₁ at 40 °C
rowhead: Time
- Start | 15 °C | 40 MΩ | 7.1 MΩ
- 2 hours | 60 °C | 9 MΩ | 36 MΩ
- 4 hours | 78 °C | 6 MΩ | 83.6 MΩ
caption: This is an illustration. The raw readings fell by 85 % while the corrected readings rose almost twelvefold.
```

## Trending with a control chart

Between annual tests, C-1's corrected one-minute readings vary from test to test because of small differences in temperature, humidity, surface condition and the instrument. To tell a real change from this normal variation, the site plots the readings on an individuals control chart.

Insulation resistance varies multiplicatively rather than additively: a change from 2,000 to 1,000 MΩ is as significant as one from 200 to 100 MΩ. The site therefore charts the logarithm of the corrected readings. C-1's ten quarterly readings over its first two and a half years, corrected to 40 °C, were 2,000, 2,240, 1,890, 2,120, 1,960, 2,310, 2,050, 1,920, 2,180 and 2,010 MΩ, with base-ten logarithms 3.3010, 3.3502, 3.2765, 3.3263, 3.2923, 3.3636, 3.3118, 3.2833, 3.3385 and 3.3032.

Given these ten logarithms, the [individuals control chart tool](/tools/individuals-chart-check/) gives a mean of 3.3147, an average moving range of 0.0499, an estimated standard deviation of 0.0442 and control limits from 3.1820 to 3.4473, with all ten readings in control. Converted back, the mean is about 2,064 MΩ and the limits are about 1,521 and 2,801 MΩ.

The eleventh reading, taken after a three-week maintenance stop in a humid February, was 1,480 MΩ corrected, with a logarithm of 3.170. It lies below the lower limit, so it is a signal that something has changed. Investigation found that the fuse supplying C-1's anti-condensation heater had blown some months earlier, so the stopped motor had cooled below the plant room's dew point on humid days. With the heater restored and the motor run for a week, the next reading was back near 2,000 MΩ.

```figure
type: line
title: C-1's quarterly IR₁ corrected to 40 °C
x: Test number
y: IR₁ at 40 °C, MΩ
ymin: 1000
ymax: 3000
caption: This is an illustration. Limits from the first ten readings by the individuals chart on their logarithms: about 1,521 to 2,801 MΩ. Test 11, at 1,480 MΩ after a stop with the heater failed, falls below the lower limit.
- 1 | 2000
- 2 | 2240
- 3 | 1890
- 4 | 2120
- 5 | 1960
- 6 | 2310
- 7 | 2050
- 8 | 1920
- 9 | 2180
- 10 | 2010
- 11 | 1480
```

## Keeping windings dry

Prevention costs much less than drying. The site's measures are simple: anti-condensation heaters on C-1 and C-2, wired so that they switch on whenever the motor stops and checked monthly for current; heated drains and drip shields in the freezer rooms; terminal box gaskets and cable glands inspected at every test; and a rule that any motor that has stood for more than a week, or been exposed to water, is tested before it is started.

## Sizing an anti-condensation heater

An anti-condensation heater must keep a stopped motor's frame and winding warm enough to stay above the dew point. A first estimate treats the motor as a warm body losing heat to the surrounding air by natural convection and radiation, with a combined heat transfer coefficient of about 8 W/m²·K for a frame a few degrees above the air. For C-2, with an outside surface area taken as about 6 m², holding the frame 5 K above the air needs about 8 × 6 × 5 = 240 W. The motor's own heaters are rated 300 W, so they can do this with a margin, provided they are working. The estimate is illustrative; the heater rating for a real motor comes from its maker.

Heaters are also a useful check on themselves: the site measures each heater current monthly with a clamp meter, because a heater that has failed gives no sign of it until the motor it was meant to protect reads low after a stop, as the trend above showed.

## Testing after a flood or washdown

Any motor that has been wetted, whether by a roof leak, a burst pipe or a washdown, is treated as wet until tested. The site's rule is that it is not started until it has been inspected, tested and, if needed, dried, and that the test is repeated after drying with the winding at room temperature. Water that has reached a motor through a flood may be dirty or salty, so the end windings may need cleaning as well as drying, and the rewinder's advice is sought for any motor that has been submerged.

## Exercise: a humid afternoon in the plant room

On a summer afternoon the plant room air is at 30 °C and 55 % relative humidity. C-2 has been stopped since the morning, with its anti-condensation heater isolated for maintenance, and its frame is at 18 °C. Calculate the dew point, say whether water will condense on the motor, and say how far the heater must raise the frame temperature to prevent it.

### Answer

**Given:** air at 30 °C and 55 % RH; frame at 18 °C.

**Assumptions:** the Magnus formula with a = 17.62 and b = 243.12 °C; the winding is at about the frame temperature.

**Method:** γ = ln(RH ÷ 100) + aT ÷ (b + T); T_d = bγ ÷ (a − γ).

**γ:** ln(0.55) + 17.62 × 30 ÷ 273.12 = −0.5978 + 1.9354 = 1.3376.

**Dew point:** 243.12 × 1.3376 ÷ (17.62 − 1.3376) = 325.2 ÷ 16.28 = 20.0 °C.

**Condensation:** the frame at 18 °C is 2 °C below the dew point, so water condenses on the motor and in its terminal box.

**Heater:** the frame must be kept above 20 °C, so the heater must raise it by more than 2 °C; with a margin, the site aims for a frame at least 5 °C above the dew point, about 25 °C.

**Verification:** at the dew point the air is saturated; the saturation vapour pressure at 20.0 °C, about 2.33 kPa, is 55 % of that at 30 °C, about 4.23 kPa, which agrees.
