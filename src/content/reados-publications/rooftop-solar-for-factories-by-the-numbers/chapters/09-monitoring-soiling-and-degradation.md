---
book: rooftop-solar-for-factories-by-the-numbers
chapterSlug: monitoring-soiling-and-degradation
order: 9
title: "Monitoring, soiling and degradation"
description: "How to monitor an array's performance ratio, check the irradiance sensor's calibration, measure soiling with a cleaning trial and a t-test, and separate soiling from module degradation."
draft: false
---

An array that is producing less than it should rarely announces it. The inverters keep running, the factory keeps drawing power and the electricity bill is a little higher than planned, for reasons nobody connects with the roof. Monitoring is how a small loss is found before it becomes a large one, and how a real loss is told apart from a dull month. It depends on one measurement more than any other, the irradiance on the modules, and that measurement is easy to get wrong.

This chapter sets out how SF-90 is monitored, how the irradiance sensor's calibration is checked, how a cleaning trial measures soiling, and how degradation is separated from both. It ends with a maintenance proposal that blamed the whole fall in performance on dirt.

## What to monitor

The inverters record their DC and AC power, voltages and currents for every tracker, and the energy each day. A meter at the main switchboard records the factory's import and export. On the workshop roof, a silicon reference cell mounted in the plane of the modules measures irradiance, and a module temperature sensor bonded to the back of a module measures cell temperature near enough for the purpose. A small weather sensor on the annex records air temperature and wind. IEC 61724-1, the standard for photovoltaic performance monitoring, sets out classes of monitoring system and the sensors, accuracy and data checks for each.

Three measures do most of the work.

```figure
type: formula
title: The monitoring measures SF-90 uses
formula: Performance ratio, a month or a year: PR = E_AC ÷ (P_STC × H_POA ÷ 1 kW/m²)
formula: Temperature-corrected PR: PR_T = PR ÷ [1 + β_P (T_cell,weighted − 25)]
formula: String comparison: r_i = E_i ÷ mean(E_j) for strings on the same roof and inverter
caption: H_POA is the month's irradiation measured by the plane-of-array sensor; β_P the module's power coefficient, −0.0032 per kelvin; T_cell,weighted the irradiance-weighted cell temperature. The temperature-corrected ratio takes out the season, so trends show through.
- E_AC | AC energy in the period, kWh
- P_STC | array rating, 90.72 kW
- H_POA | plane-of-array irradiation, kWh/m²
- r_i | each string's energy relative to the mean of its neighbours
```

The performance ratio compares the array with itself under the light it actually received; it takes out the weather. The temperature-corrected ratio takes out the season as well, because an uncorrected ratio is always lower in summer, when the modules are hot. The string comparison needs no irradiance sensor at all: strings on the same roof, at the same tilt and orientation, see the same light, so a string that falls behind its neighbours has a problem of its own. That is how the stack's shadow in Chapter 6 was found.

## The sensor is the reference

Every performance ratio is divided by the measured irradiation. If the sensor reads 3% high, the ratio reads 3% low, and the array looks worse than it is. If the sensor is dirty and reads low, the array looks better than it is, which is worse, because it hides real losses. The sensor must be clean, level with the module plane and calibrated.

Every two years, the business's monitoring contractor brings a recently calibrated travelling reference cell, mounts it beside the site sensor in the same plane and records both through a day with a range of irradiance. Pairs of readings at five irradiance levels are then fitted with a straight line using the [linear calibration check tool](/tools/linear-calibration-check/), which gives the intercept and slope with their tests, and the calibrated value for a new reading by inverting the line.

```figure
type: compare
title: SF-90 irradiance sensor against the travelling reference, from the linear calibration check tool
cols: Value | What it means
rowhead: Result
- Fitted line | reading = 0.218 + 1.0234 × reference | The sensor reads about 2.3% high across the range
- Intercept test | t = 1.17 against 3.182 | No significant offset
- * Slope test | t = 84.26 against 3.182 | Gain error: apply the correction
- Residual standard deviation | 0.18 W/m², 3 degrees of freedom | The line fits the pairs well
- Calibrated value of a reading of 800 W/m² | 781.5 W/m², 95% interval ±0.62 W/m² | CALIBRATION INTERVAL WITHIN TOLERANCE against ±10 W/m²
caption: This is an illustration. Reference readings 205, 410, 598, 805 and 1,012 W/m²; site sensor readings 210, 420, 612, 824 and 1,036 W/m². The interval reflects only the scatter of these pairs; the travelling reference's own calibration uncertainty, typically about 1% to 2%, must be added to it.
```

The sensor's gain had drifted about 2.3% high since commissioning. Silicon reference cells drift slowly, but their front glass weathers and their mounting can move. The correction, dividing each reading by 1.0234 after subtracting the small intercept, was entered in the monitoring software, and all performance ratios since the previous check were recalculated.

## Soiling

Dust, pollen, bird droppings and, near this factory, fine dust from grinding and polishing settle on the modules and block light. On a 5° roof, rain washes much of it off, but a flat module drains slowly and dirt collects along the lower edge of each module where water pools against the frame. In a dry summer, soiling builds up for weeks between rains.

The loss chain in Chapter 4 assumed 2% for soiling over a year. The only way to know the real figure is to measure it, and the simplest way is a cleaning trial: clean some strings and not others, and compare them over the following clear days.

At the end of the second dry summer, the business had four workshop strings on inverter A cleaned with deionised water and soft brushes, leaving four comparable strings on inverter B uncleaned. Over the next ten clear days, it worked out each group's daily performance ratio with the corrected irradiance. The [two-sample t-test tool](/tools/two-sample-t/) compares the two groups' means with Welch's test.

```figure
type: compare
title: SF-90 cleaning trial, ten clear days, from the two-sample t-test tool
cols: Mean daily PR | Standard deviation | Days
rowhead: Group
- Four cleaned strings | 0.8306 | 0.0062 | 10
- Four uncleaned strings | 0.8085 | 0.0071 | 10
- * Difference | 0.0221, 95% interval 0.0158 to 0.0284 | t = 7.41, 17.7 degrees of freedom | p < 0.000001: SIGNIFICANT DIFFERENCE
caption: This is an illustration. Soiling loss = 1 − 0.8085 ÷ 0.8306 = 2.66%, with a 95% interval from about 1.9% to 3.4% of the clean figure. Because both groups were measured on the same days, a paired comparison of the daily differences would be even more sensitive; Welch's test is a conservative choice.
```

The trial showed a soiling loss of 2.66% at the end of a dry summer, somewhat more than the yearly 2% assumed, which is to be expected at the worst point of the year. Was cleaning the whole array worth it? The four summer months from December to March deliver about 61.2 MWh. If cleaning recovered 2.66% of that for the whole period, it would be worth about 0.0266 × 61,200 × A$0.18 = A$293 at the average value per kilowatt-hour from Chapter 10. A full clean of the array costs the business about A$1,800 excluding GST, including roof access and safety equipment. Routine cleaning of the whole array did not pay; autumn rain did the job for free.

The trial did justify targeted cleaning. Bird droppings, which block whole cells and can cause hot spots, and the band of grinding dust downwind of the polishing booth's extraction, were cleaned at each six-monthly inspection.

## Degradation

Modules lose output slowly as they age. Most crystalline silicon modules lose about 1% to 2% in their first year, from light-induced degradation as defects in the silicon are activated by the first months of sunlight, and then a few tenths of a per cent a year from slow changes in the cells, contacts, encapsulant and glass. SF-90's module warranty guarantees at least 98% of rated power after the first year and a loss of no more than 0.45 percentage points a year after that, so at least 98 − 0.45 × 24 = 87.2% after 25 years. The business plans on a first-year loss of 1.5% and 0.4% a year after that, which Chapter 10 uses.

A few faults degrade modules much faster and are worth knowing:

- **Potential-induced degradation.** Modules at the negative end of a long string sit hundreds of volts below earth, and in heat and humidity ions can migrate through the glass and encapsulant to the cells, shunting them. It shows as falling shunt resistance (Chapter 2), poor low-light output and modules near one end of the string performing worse. Modern modules are tested for resistance to it.
- **Cracked cells**, from rough handling, foot traffic on modules or hail, which grow with thermal cycling and can create hot spots.
- **Encapsulant browning and delamination**, and backsheet cracking, which let in moisture and corrode contacts.
- **Failed bypass diodes**, which remove a third of a module's voltage.

Degradation is measured by the trend in the temperature-corrected performance ratio over years, with soiling taken out by cleaning trials or by comparing periods just after heavy rain. A single year's figure says little; three or more years are needed to separate a trend of a few tenths of a per cent from the year-to-year noise.

## Measuring the trend

By its fifth year the business had four full years of temperature-corrected performance ratios, each worked out with the corrected sensor and with the soiling at its measured seasonal level taken out: 0.833, 0.830, 0.826 and 0.823 for years 1 to 4. A straight line fitted by least squares through those four points has a slope of −0.0034 a year. Divided by their mean of 0.828, that is a fall of about 0.41% a year, in line with the 0.4% planned and inside the warranty's 0.45 percentage points.

Four points carry little statistical weight, and one unusual year can swing the slope. The business therefore treats the figure as a check, not a finding: it would act if the trend were clearly faster than the warranty allows over several years, or if a single string or module group fell behind the others. Under the warranty, a claim needs the maker's specified test of the module's power, usually a flash test at standard conditions by an accredited laboratory, not a monitoring trend, so the trend's job is to say when such a test is worth paying for.

## Data quality

Monitoring is only useful if its data are complete and right. Communications drop out, loggers lose their clocks, sensors fail and inverters are replaced with new serial numbers that the software does not recognise. The business's monitoring contractor checks each month that every day has data from every inverter and the sensor, that the inverter energy and the switchboard meter agree within about 1%, and that the irradiance and the AC power rise and fall together through each clear day. Days that fail a check are flagged rather than filled with estimates.

Availability is worked out separately from performance, as the share of daylight hours in which each inverter was ready to run. An inverter out for three days in a year costs the array 3 ÷ (2 × 365) = 0.41% of its inverter-days, close to the 0.5% allowed in the loss chain. Keeping the two separate means a long outage cannot be hidden inside a lower performance ratio, or a performance problem inside an outage.

## Inspection

Monitoring finds that something is wrong; an inspection finds what. SF-90's routine has three levels:

- **Every six months:** a visual inspection of the modules, rails, clamps and ballast from the roof walkways, targeted cleaning, a check of the cables and connectors that can be seen and of the isolators, labels and the inverter room.
- **Every year:** a thermal imaging survey of the array in full sun, looking for hot cells, hot connectors and bypass diodes conducting, and a check of the surge protective devices.
- **Every few years, or after an event:** current–voltage curve tests of every string, translated to standard conditions and compared with the commissioning curves (Chapter 2).

Roof work is work at height. Every visit follows the business's procedure under Safe Work Australia's model Code of Practice for managing the risk of falls at workplaces, with roof walkways, edge protection and anchor points installed with the array. Nobody walks on modules.

## The error: blaming the dirt

At the end of the second summer, the operations and maintenance contractor reported that the array's performance ratio had fallen from 0.846 in its first full month to 0.79, a drop of 6.6%, and proposed quarterly cleaning at A$1,800 a visit, citing "soiling losses of up to 8%".

The business's engineer broke the 6.6% into its parts before accepting any of it. The calibration check showed the irradiance sensor reading 2.3% high, so the true performance ratio was 0.79 × 1.0234 = 0.809, not 0.79. The cleaning trial showed soiling of 2.66%, so a clean array would have shown 0.809 ÷ (1 − 0.0266) = 0.831. And the planned degradation after a first year of 1.5% and a second-year 0.4% predicts 0.846 × 0.985 × 0.996 = 0.830. The array was performing exactly as a healthy, slightly dusty, two-year-old array should.

```figure
type: bars
title: SF-90's apparent fall in performance ratio, taken apart
x: Step
y: Performance ratio
caption: This is an illustration. Measured 0.790 with the drifted sensor; 0.809 with the sensor corrected; 0.831 after removing soiling; planned 0.830 after first-year and second-year degradation from the commissioning figure of 0.846.
- Commissioning month | 0.846
- Reported, sensor 2.3% high | 0.790
- Sensor corrected | 0.809
- Soiling removed, cleaning trial | 0.831
- * Planned, after degradation | 0.830
```

Quarterly cleaning would have cost A$7,200 a year to recover at most a few hundred dollars of energy. The business declined it and kept the six-monthly inspection with targeted cleaning, the biennial calibration check and the string comparison. It also asked that future reports show the performance ratio temperature-corrected and with the sensor's calibration date.

```figure
type: checklist
title: Before acting on a fall in performance ratio
caption: This is an illustration. The business's order of checks.
- x Is the irradiance sensor clean, in the plane of the modules and within its calibration?
- x Is the ratio temperature-corrected, and is the comparison with the same season?
- x Do the strings agree with each other? A single string falling behind is a local fault
- x Do the inverter logs show derating, grid voltage events or insulation faults (Chapter 8)?
- x What does a cleaning trial show the soiling to be?
- ? Is the remaining fall consistent with the planned degradation, or faster?
```

## Exercise: a dirtier sensor

At a later check, the site sensor's glass is found coated with dust. Before cleaning, it reads 760 W/m² while the travelling reference beside it reads 800 W/m²; after cleaning, the sensor reads 818 W/m² against the reference's 800 W/m².

1. By how much did the dirty sensor read low, and how much did the clean sensor read high?
2. A monthly performance ratio of 0.86 had been calculated with the dirty sensor. Roughly what would it have been with a clean, correctly calibrated sensor?
3. What does this say about how the business should respond to a performance ratio that looks unusually good?

### Worked answer

1. Dirty: 760 ÷ 800 = 0.950, 5.0% low. Clean: 818 ÷ 800 = 1.0225, 2.25% high, close to the gain error found at the previous check.
2. A dirty sensor understates irradiation, so it overstates the performance ratio. The correct irradiation is 800 ÷ 760 = 1.053 times what the dirty sensor read, so the ratio would have been about 0.86 ÷ 1.053 = 0.817.
3. A ratio that looks unusually good is as much a warning as one that looks bad. Here the dirty sensor hid a ratio of about 0.82, below the planned 0.83, which might itself have been a sign of soiling or a fault. The business now cleans the sensor at every inspection and treats any sudden improvement in the ratio as a reason to check the sensor first.
