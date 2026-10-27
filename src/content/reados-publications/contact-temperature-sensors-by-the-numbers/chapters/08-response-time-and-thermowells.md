---
book: contact-temperature-sensors-by-the-numbers
chapterSlug: response-time-and-thermowells
order: 8
title: "Response time, lag and thermowells"
description: "A sensor's time constant, step and ramp errors, how lag affects profiling and control, what a thermowell costs in response, and a slower probe that tripped the limit every morning."
draft: false
---

A sensor cannot change temperature instantly. Before it can report a new temperature, heat has to flow into its tip and raise its own mass, and that takes time. When the temperature being measured is steady, the delay does not matter. When it is changing, as it is throughout the heating of every load in CV-180, the sensor always lags behind, and the reading is a temperature from the recent past rather than the present.

This chapter treats a sensor as the lumped body it usually is. It defines the time constant, shows the errors it causes for a sudden step and for a steady ramp, applies them to CV-180's trailing thermocouples and control probe, explains what a thermowell does to response, and ends with a probe change that made the oven overshoot its limit every morning.

## The time constant

A small sensor in moving air or liquid heats almost uniformly, so its temperature can be described by a single value that approaches the surrounding temperature exponentially. The rate is set by the **time constant**, τ: the ratio of the sensor's heat capacity to the conductance by which heat reaches it. For a long cylindrical sheath, τ = ρcd/(4h); for a spherical bead, τ = ρcd/(6h), where ρ and c are the density and specific heat of the sensor's material, d its diameter and h the surface coefficient. This is the same lumped model that Chapter 1 used for CV-180's parts, applied to the sensor instead of the part.

```figure
type: formula
title: First-order response of a sensor
formula: Step: Ts = Tf + (T₀ − Tf)·e^(−t/τ)     Ramp: lag = rate × τ
caption: This is an illustration. After a step, a sensor covers 63.2% of the change in one time constant and 99% in 4.6 time constants. During a steady ramp, it settles to a constant lag behind the true temperature.
- Ts | sensor temperature, °C
- T₀, Tf | starting and final temperatures of the medium, °C
- τ | time constant, s
- rate | rate of change of the medium's temperature, K/s
step: 6 mm stainless sheath in oven air, h = 40 W/m²·K: τ = 7,900 × 500 × 0.006 ÷ (4 × 40) = 148 s
step: Oven air rising at 10 K/min: lag = (10 ÷ 60) × 148 = 24.7 K
step: Time to show 99% of a step: 4.6 × 148 s = 681 s, about 11.3 minutes
```

The time constant is not a property of the sensor alone. It depends on h, so the same probe is several times faster in flowing water than in air, and faster in fast air than in slow. Makers state response times measured under defined conditions, typically as t₀.₅ and t₀.₉, the times to show 50% and 90% of a step, in flowing water or air. For a first-order sensor, t₀.₅ = 0.69τ and t₀.₉ = 2.3τ, so either can be converted to a time constant. The conversion holds only in the conditions of the test; in CV-180's air the time constant must be estimated from the oven's own h or, better, measured.

```figure
type: bars
title: Time constants of CV-180's sensors in oven air
unit: s
max: 450
caption: This is an illustration, from the lumped formulas with h = 40 W/m²·K for sheaths and 60 W/m²·K for a bare bead. The thermowell value assumes the well triples the probe's time constant, a figure to be measured, not assumed.
- 0.5 mm exposed bead | 5.4
- 1.5 mm sheathed trailing probe | 37
- 3 mm insulated limit probe | 74
- 6 mm controller Pt100 | 148
- * 6 mm Pt100 in a thermowell | 444
```

## Measuring a time constant

A time constant is easy to measure, and a measured value is worth more than any calculated one. Hold the sensor at room temperature, plunge it into the medium at a steady temperature, here the oven's supply duct at 200 °C, and log the reading every second or two. Plot ln(Tf − Ts) against time: for a first-order sensor the points fall on a straight line whose slope is −1/τ. A line that bends shows that the sensor is not first-order, usually because its sheath and element heat at different rates, and then the early and late slopes give two time constants.

The same plunge test shows whether the sensor's lag matters for a job. If the process changes slowly compared with the sensor's time constant, the lag is small; if it changes on a similar time scale, the lag is large and must be corrected or the sensor changed.

## Lag in profiling

This is an illustration. CV-180's trailing thermocouples are 1.5 mm sheathed probes, attached to parts with magnets, with a time constant of about 37 s. The 10 mm base plate heats with a time constant of 769 s, as Chapter 1 found. At any moment the plate is rising at a rate of (200 − Tplate)/769 kelvin per second, and the probe lags by about that rate times its own 37 s.

At the start of heating, with the plate at 25 °C, the plate rises at about 0.23 K/s and the probe lags by about **8.4 K**. As the plate approaches the air temperature its rate falls, and so does the lag: about 4.8 K at 100 °C, 2.4 K at 150 °C and **0.96 K at 180 °C**. Solving the two coupled lumps exactly gives the same picture. When the plate reaches 180 °C at 1,669 s, the probe shows 179.0 °C, and it reaches 180 °C roughly 37 s later.

```figure
type: line
title: The 10 mm plate and its 1.5 mm trailing probe during heating
x: Time in the oven, s
y: Temperature, °C
ymin: 0
ymax: 200
legend: Plate | Probe, τ = 37 s
mark: 1669 | Plate reaches 180 °C
caption: This is an illustration from the two-lump solution. The probe lags by several kelvin early in heating but by only about 1 K when the plate reaches 180 °C, because the plate is then rising slowly.
- 0 | 25.0 | 25.0
- 60 | 38.1 | 31.7
- 300 | 81.5 | 75.5
- 600 | 119.8 | 115.7
- 1200 | 163.2 | 161.4
- 1669 | 180.0 | 179.0
```

For proving a cure, the lag errs on the safe side: the probe reaches 180 °C slightly after the plate does, so a cure timed from the probe is about half a minute longer than necessary. For the thin panels, which heat with a time constant of only 92 s, the lag is a larger share. A panel crossing 180 °C is rising at (200 − 180)/92 = 0.22 K/s, so the probe lags by about **8 K**, and a cure timed from the probe would start well after the panel reached temperature. Again safe, but it shows why fast parts need fast sensors: a bare 0.5 mm junction, with a time constant of about 5 s, would lag the panel by about 1 K at the same point.

The direction of the error reverses during cooling. A probe on a part leaving the oven reads higher than the part for a time, which matters if the profile is used to judge when parts can be handled or packed.

### Correcting a logged trace for lag

When a sensor's time constant is known, its lag can be removed from a logged trace after the event. For a first-order sensor, the true temperature is the reading plus the time constant times the reading's rate of change: T ≈ Ts + τ × dTs/dt. This is an illustration. Near the 180 °C crossing, CV-180's plate probe reads 179.0 °C and is rising at about 0.026 K/s; with τ = 37 s, the correction is 37 × 0.026 = 0.96 K, giving 180.0 °C, which matches the plate.

The correction has a price. It works from the slope of the trace, and differentiating a noisy signal magnifies its noise: a reading that jitters by 0.1 K between one-second samples has a slope that jitters by 0.1 K/s, which a 37 s time constant turns into a 3.7 K jitter in the corrected value. The slope must therefore be taken over a longer window, say 30 or 60 seconds, which is fine for a slowly heating plate and useless for a fast transient. Lag correction is a sound way to tidy a profile of a slow part. It is no substitute for a fast sensor where the temperature changes quickly, and it should never be built into a control or protection loop without the advice of whoever is responsible for that loop.

## Lag in control and protection

A control loop acts on what its sensor reports, so sensor lag becomes control lag. While CV-180 warms up from cold, its air rises at about 10 K/min in the middle of the warm-up. The controller's 6 mm probe lags by about 25 K at that rate, so when the probe reaches 200 °C the air has passed it, and the controller must begin cutting power well before the setpoint if it is not to overshoot. A well-tuned proportional-integral controller does this: it begins reducing power as the reading enters its proportional band, which is set with the sensor's lag in mind.

Protection is affected in the same way. The limit thermocouple, with a time constant of about 74 s, lags by about **12 K** if the air runs away at 10 K/min, so the limit trips when the air is about 12 K above its setting. For an oven whose damage threshold is well above the trip setting, that is acceptable. It is one reason limit sensors are made small and placed in fast air.

## Thermowells

A **thermowell** is a closed tube, welded or screwed into a pipe, duct or vessel, into which a probe is inserted. It protects the probe from pressure, flow forces and corrosion, and it allows the probe to be removed for replacement or calibration without opening the process. Those advantages come at a cost in response time: the heat must pass through the well's wall and then across the gap between the well and the probe, usually an air gap, before reaching the sensor. A probe in a well can be several times slower than the same probe in the open stream, and the factor depends on the well's wall, the fit and whatever fills the gap.

Two measures reduce the penalty. A close fit between probe and well, with the probe spring-loaded against the bottom of the bore, puts the tip in metal contact where it matters. A heat-transfer compound in the gap, chosen for the temperature, improves the coupling further. A thermowell also adds to the stem conduction of Chapter 7, because its own wall conducts heat from the tip to the mounting, so a probe in a well needs more immersion, not less.

In liquids under pressure, thermowells are essential and their mechanical design, including resistance to vibration excited by flow, is a specialist matter governed by recognised standards and the vessel or piping design. In CV-180's air duct at atmospheric pressure, none of those needs exists, and a well's only benefit would be convenience.

## The error: a probe in a well

This is an illustration. After the duct modification of Chapter 7, the fitter mounted the controller's new probe in a 10 mm stainless thermowell so that it could be removed for calibration without stopping the oven. The probe's time constant rose from about 148 s to about 444 s. Nobody retuned the controller.

From the first morning, CV-180's warm-up changed. With the controller tuned for the faster probe, a proportional band of 20 K and an integral time of 600 s, a simple simulation of the oven's warm-up from cold gives a peak air temperature of about **208 °C** with the 148 s probe, but about **243 °C** with the 444 s probe. The over-temperature limit at 230 °C tripped during most morning warm-ups, and the operators began resetting it as a routine, which defeats its purpose.

The pattern of the trips gave the cause away. They happened only during warm-up, never during steady running, and the logger, run through one warm-up with an exposed thermocouple in the supply air, showed the air rising through 230 °C while the controller still displayed about 185 °C. A plunge test of the controller probe in its well gave a time constant of about 450 s. The thermowell was removed and the probe mounted directly in the airstream, with a compression fitting that still allowed it to be withdrawn for calibration. The warm-up peak returned to about 208 °C, below the limit with a comfortable margin, and the operators were told that a limit trip is a fault to be reported, never a routine to be reset.

```figure
type: checklist
title: Response checks for CV-180's sensors
caption: The open item is this chapter's error. Any change that slows a control sensor needs the controller to be retuned, or the change to be reversed.
- x Time constant of each sensor measured by a plunge test | recorded on the sensor's record
- x Trailing probes fast enough for the parts they profile | 37 s on a 769 s plate; bare junction on panels
- x Limit sensor small and in fast air | 74 s; about 12 K late at a 10 K/min runaway
- x Controller tuned for its sensor's lag | proportional band and integral time recorded
- ? Controller retuned after a probe change | thermowell: τ 444 s, warm-up peak about 243 °C
```

## How this applies to a small Australian business

Response time is rarely written on anything a small business buys, and it changes whenever a probe is replaced, moved or put in a well. A plunge test with any logger or controller that can record a reading every second takes ten minutes and gives a number that explains overshoot, slow alarms and profiles that disagree with each other. For ovens, kilns, kettles and furnaces, record each control and limit sensor's time constant alongside its type and class, and ask whoever tunes the controller to note the tuning against it. When a cure or heat-treatment time is proved with trailing probes, choose probes whose time constant is short compared with the part's, or correct for the lag.

## Exercise: a faster limit

The business considers replacing the 3 mm limit probe with an exposed 0.5 mm junction in a slotted guard tube, with a time constant of about **8 s** in the supply air. If the oven air runs away at **15 K/min** after a contactor welds shut, by how much does each limit sensor lag the air when the trip setting of 230 °C is reached? What does the faster sensor cost?

**Worked answer.** At 15 K/min the air rises at 0.25 K/s. The 3 mm probe with τ = 74 s lags by 0.25 × 74 = **18.5 K**, so the limit trips when the air is at about 248.5 °C. The 0.5 mm junction with τ = 8 s lags by 0.25 × 8 = **2 K**, tripping at about 232 °C. The faster sensor protects the oven and load much better in a runaway. Its costs are fragility, since a bare 0.5 mm junction is easily bent or broken during cleaning, which is why it sits in a slotted guard; greater sensitivity to radiation from the elements, because it is not shielded by a sheath; and a greater chance of nuisance trips from brief, harmless spikes, which a limit controller with a short confirmation delay can filter. The decision should weigh the oven maker's advice and the hazard assessment, not only the lag.
