---
book: contact-temperature-sensors-by-the-numbers
chapterSlug: platinum-resistance-thermometers
order: 4
title: "Platinum resistance thermometers and the Callendar–Van Dusen equation"
description: "Why platinum, the Pt100's resistance curve, converting resistance to temperature properly, tolerance classes and elements, and a straight-line conversion 3 K wrong at 200 °C."
draft: false
---

A platinum resistance thermometer measures temperature by measuring the resistance of a small piece of platinum. Pure platinum's resistance rises smoothly and almost linearly with temperature, it is chemically stable, and it returns to the same value after being heated and cooled, so a platinum sensor can be accurate to a few hundredths of a kelvin in a laboratory and to a few tenths in a factory. The industrial version, the Pt100, is the usual choice wherever a process needs a better reading than a thermocouple gives at moderate temperatures, as CV-180's controller does.

This chapter explains why platinum's resistance changes with temperature, sets out the standard curve that relates the two, shows how to convert a measured resistance into a temperature properly, describes the tolerance classes and the kinds of element, and compares platinum sensors with thermocouples. It ends with a conversion that passed checks in ice and boiling water and was still 3 K wrong at the oven's working temperature.

## Why resistance rises with temperature

A metal conducts because its electrons move freely through the lattice of atoms. Its resistance comes from the things that scatter those electrons: impurities, defects and, above all, the vibrations of the lattice itself. The vibrations grow with temperature, so the scattering grows, and well above very low temperatures the resistance of a pure metal rises nearly in proportion to absolute temperature. Impurities add a resistance that hardly changes with temperature, which is why a pure, strain-free metal gives the largest and most reproducible change.

Platinum is chosen because it can be made very pure, it does not oxidise at ordinary temperatures, and it is stable through repeated heating. Its reproducibility is good enough that the international temperature scale, ITS-90, uses a special form of it, the standard platinum resistance thermometer, as its defining interpolating instrument from about −259 °C to the freezing point of silver at 961.78 °C. An industrial Pt100 is a cousin of that laboratory instrument, made to a standard curve rather than individually calibrated.

## The Pt100 curve

A Pt100 has a resistance of **100.000 Ω at 0 °C**. Its resistance at other temperatures follows the **Callendar–Van Dusen equation**, with standard coefficients defined for industrial platinum by IEC 60751 and published by every sensor maker.

```figure
type: formula
title: The Callendar–Van Dusen equation for industrial platinum
formula: R(t) = R₀ (1 + A·t + B·t²)   for 0 °C to 850 °C
caption: Standard coefficients for industrial platinum. Below 0 °C a third term, C·t³(t − 100) with C = −4.183 × 10⁻¹², is added. All Pt100 values in this book were computed from this equation.
- R(t) | resistance at temperature t, Ω
- R₀ | resistance at 0 °C: 100 Ω for a Pt100, 1,000 Ω for a Pt1000
- A | 3.9083 × 10⁻³ per °C
- B | −5.775 × 10⁻⁷ per °C²
step: R(180 °C) = 100 × (1 + 0.70349 − 0.01871) = 168.478 Ω
step: R(200 °C) = 100 × (1 + 0.78166 − 0.02310) = 175.856 Ω
step: Sensitivity at 200 °C: dR/dt = R₀(A + 2Bt) = 0.3677 Ω/K
```

The B term is small but not negligible. It makes the curve bend slightly downwards, so the sensitivity falls from 0.3908 Ω/K at 0 °C to 0.3677 Ω/K at 200 °C. The sensor is usually described by its **mean temperature coefficient** between 0 °C and 100 °C, α = (R₁₀₀ − R₀)/(100 × R₀). With the standard coefficients, R₁₀₀ = 138.505 Ω and α = **0.003851 per °C**, which is the "385" curve printed on sensor and instrument data sheets. Some older or regional curves use other values of α, so an instrument must be set to the curve of the sensor fitted to it.

```figure
type: compare
title: Pt100 resistance and sensitivity across CV-180's range
cols: Resistance | Sensitivity | Class A tolerance
caption: Computed from the Callendar–Van Dusen equation with the standard coefficients. A 0.1 K change at 200 °C is a change of only 0.037 Ω.
- 0 °C | 100.000 Ω | 0.3908 Ω/K | ±0.15 °C
- 25 °C | 109.735 Ω | 0.3879 Ω/K | ±0.20 °C
- 100 °C | 138.505 Ω | 0.3793 Ω/K | ±0.35 °C
- 180 °C | 168.478 Ω | 0.3700 Ω/K | ±0.51 °C
- * 200 °C | 175.856 Ω | 0.3677 Ω/K | ±0.55 °C
- 230 °C | 186.836 Ω | 0.3643 Ω/K | ±0.61 °C
```

## From resistance back to temperature

An instrument measures resistance and must report temperature, so it needs the inverse of the equation. Above 0 °C, the equation is a quadratic in t, and its solution is exact:

t = (−A + √(A² − 4B(1 − R/R₀))) ÷ (2B)

This is an illustration. CV-180's controller measures 175.000 Ω. Substituting gives t = **197.67 °C**. Good instruments use this inverse, or the equivalent table, and below 0 °C, where the C term makes the equation a quartic, they solve it numerically.

A tempting shortcut is to treat the sensor as linear with α: t ≈ (R/R₀ − 1)/α. For 175.000 Ω that gives (0.75)/0.00385 = **194.81 °C**, nearly 3 K below the correct value. The shortcut is exact at 0 °C and at 100 °C, because α is defined from those two points, and wrong everywhere else. The error grows with distance from that interval: about −1.1 K at 150 °C, −3.0 K at 200 °C and −5.6 K at 250 °C. Between 0 °C and 100 °C it is a fraction of a kelvin the other way, peaking at about +0.4 K at 50 °C.

```figure
type: line
title: Error from treating a Pt100 as linear with α = 0.00385
x: True temperature, °C
y: Error of the straight-line conversion, K
ymin: -6
ymax: 1
mark: 200 | CV-180 setpoint
caption: Computed from the Callendar–Van Dusen equation. The straight line agrees exactly at 0 °C and 100 °C, the two points most often used for checks, and is about 3 K low at 200 °C.
- 0 | 0.00
- 50 | 0.38
- 100 | 0.01
- 150 | -1.10
- 180 | -2.13
- 200 | -2.97
- 230 | -4.45
- 250 | -5.59
```

## Tolerance classes

An industrial Pt100 is not individually calibrated; it is made to the standard curve within a tolerance. IEC 60751 defines tolerance classes, which makers summarise as: **class AA**, ±(0.1 + 0.0017|t|) °C; **class A**, ±(0.15 + 0.002|t|) °C; and **class B**, ±(0.3 + 0.005|t|) °C, each over a stated temperature range that depends on whether the element is wire-wound or thin film. Many makers also sell fractions of class B, such as "1/3 DIN", at ±⅓(0.3 + 0.005|t|) °C.

At CV-180's 200 °C setpoint these give ±0.44 °C for class AA, ±0.55 °C for class A and ±1.30 °C for class B. In resistance, the class A band at 200 °C is about ±0.20 Ω, and at 0 °C it is ±0.06 Ω, which is the basis of the ice-point check in Chapter 9: a class A Pt100 in a well-made ice point should read between 99.94 Ω and 100.06 Ω.

```figure
type: range
title: Pt100 tolerance at CV-180's 200 °C setpoint, by class
unit: °C
min: -1.5
max: 1.5
caption: From makers' summaries of the IEC 60751 classes. Even class B is several times tighter than a class 1 type K thermocouple at this temperature, before installation errors are counted.
- Class B | -1.3 | 1.3 | ±1.30 °C
- * Class A, CV-180's controller sensor | -0.55 | 0.55 | ±0.55 °C
- Class AA | -0.44 | 0.44 | ±0.44 °C
```

## Elements and probes

The platinum element inside a probe comes in two main forms.

- **Wire-wound elements** carry a fine coil of platinum wire, either supported loosely in a ceramic former or wound on a ceramic core. They are the most stable and reach the widest temperature range, and the best of them are used as laboratory references. Loosely supported coils are sensitive to shock and vibration.
- **Thin-film elements** carry a platinum film laid on a small ceramic chip and trimmed to 100 Ω. They are cheaper, smaller, faster and more robust against vibration, and they now make up most industrial sensors. Their range and long-term stability are usually a little narrower than those of good wire-wound elements, and the film's stress on the chip can make them drift if they are cycled outside their rated range.

The element is mounted in the tip of a metal sheath, usually stainless steel, with internal wires running back to a terminal head or a cable. Its length matters for the immersion errors of Chapter 7: a 30 mm element measures an average over 30 mm, and the tip has to be immersed far enough that the whole element is at the temperature being measured.

A **Pt1000** has the same curve with R₀ = 1,000 Ω, so its sensitivity at 200 °C is 3.677 Ω/K. The tenfold larger signal makes lead resistance ten times less important, which suits two-wire connections and battery instruments, as Chapter 5 shows. The penalty is a smaller measuring current for the same self-heating, and so more sensitivity to electrical noise.

## Fault-finding with a multimeter

A Pt100's great practical advantage over a thermocouple is that it can be checked with an ordinary multimeter, because its temperature is encoded in a resistance that the meter can read directly. Disconnected from its instrument, a healthy sensor at a known temperature reads close to the curve, and most faults show up as values far from it.

This is an illustration for CV-180's three-wire controller sensor, with the oven cold at about 25 °C, where the curve gives 109.735 Ω.

1. **Measure between the two wires of the same colour.** In a three-wire sensor, two wires join one end of the element. Between them the meter reads only the resistance of those two lead wires, typically a fraction of an ohm for a short probe. A reading of several ohms points to a corroded terminal or a damaged lead.
2. **Measure from either of those wires to the single wire.** This reads the element plus the leads, about 110 Ω for CV-180's sensor at 25 °C. Subtracting half the result of step 1 gives a fair estimate of the element on its own.
3. **Interpret the result.** A reading near 110 Ω means the element is intact and roughly on its curve. An open circuit means a broken element or wire, which the controller would show as a very high reading or a sensor-break alarm. A reading of a few ohms means a short, usually where the internal wires leave the sheath, and the controller would show a very low temperature. A reading that wanders as the cable is flexed points to a cracked conductor.
4. **Measure insulation resistance between the wires and the sheath** with a suitable low-voltage tester. Moisture in the mineral insulation of a sheathed probe lowers it, and a low insulation resistance appears to the instrument as a resistor in parallel with the element, making the sensor read low. It is a common fault in probes that cool down and draw in humid air.

A multimeter's ohms range is not accurate enough to calibrate a Pt100, since 0.1 Ω is about 0.3 K, but it finds almost every gross fault in a few minutes, and the results are worth recording against the sensor's tag so that a later change stands out.

## Platinum or thermocouple

CV-180 uses both kinds of sensor, each where it fits.

```figure
type: compare
title: Pt100 or type K thermocouple for CV-180's jobs
cols: Pt100 | Type K thermocouple
caption: General characteristics. The choice for each job in CV-180 follows the job, not a preference for one technology.
- Tolerance at 200 °C | ±0.55 °C, class A | ±1.5 °C, class 1
- Stability in service at 200 °C | very good | good below about 250 °C
- Upper temperature for a common industrial probe | a few hundred °C | about 1,200 °C
- Size and response | element several mm long; slower | junction can be a fraction of a mm; faster
- Needs | an excitation current and a resistance measurement | cold-junction compensation and correct cable
- *CV-180's use | the controller, where accuracy and stability matter | the limit, trailing profile probes and anything fast or very hot
```

## The error: a straight line through two good checks

This is an illustration. CV-180's original controller was replaced by a small programmable controller that the business already used on another machine. Its analogue input measured resistance, and the integrator wrote the conversion to temperature as a straight line: temperature equals resistance divided by 100, minus 1, divided by 0.00385. Commissioning checked the new controller in two ways that the business trusted: the Pt100 in a vacuum flask of crushed ice and water, where it read 0.0 °C, and in boiling water, where it read 100.0 °C after correcting for atmospheric pressure. Both checks passed.

At the working setpoint, the straight line was about **3 K low**. With the controller holding its display at 200 °C, the sensor's resistance was 177.000 Ω, which the correct inverse equation gives as **203.1 °C**. The oven had been running about 3 K hotter than set ever since the change. That was well within the powder's tolerance, so no coating problem appeared, but it was the cause of a puzzle: the profile surveys, which used the separately calibrated logger, consistently showed the oven air about 3 K above the controller's display, and the difference had been blamed on the thermocouples.

The error was found when the business had the controller's input checked at three points with a precision resistance decade, a set of calibrated resistors that simulates a Pt100. At the resistances for 0 °C and 100 °C the readings were exact; at 175.856 Ω, the resistance for 200 °C, the controller read 197.0 °C. The integrator replaced the straight line with the quadratic inverse, and the logger and controller then agreed within their uncertainties.

```figure
type: checklist
title: Checks on a Pt100 measuring chain
caption: The open item is this chapter's error. Two check points that define the straight line cannot test whether the line is the right shape.
- x Instrument set to the sensor's curve | α = 0.00385, standard coefficients
- x Conversion uses the Callendar–Van Dusen inverse | not a straight line
- x Sensor class recorded | class A, ±0.55 °C at 200 °C
- x Ice-point resistance within class | 99.94 to 100.06 Ω for class A
- ? Chain checked at the working temperature | straight line: 3 K low at 200 °C
```

The lesson reaches beyond platinum. A check is only useful at a point where an error could show. The ice point and boiling water are excellent checks of a sensor's offset and of gross faults, but a conversion fitted through those two points will always pass them. The working temperature, or a simulated resistance for it, must be one of the check points.

## How this applies to a small Australian business

Small businesses often inherit Pt100 installations from equipment makers and integrators, and change controllers, PLCs or sensors over the years without anyone revisiting the measurement chain as a whole. Three habits cover most of the risk. Record, for every Pt100, its class, its curve and the instrument it feeds. Ask whoever programs a controller or PLC how resistance is converted to temperature, and expect the answer to name the Callendar–Van Dusen equation or the maker's built-in Pt100 setting. And when a controller or sensor is replaced, check the chain at the working temperature with a simulated resistance or a reference probe, not only at the convenient points. A decade box or a calibrated simulator can be hired, or the check can be bought from a calibration laboratory accredited by NATA, as Chapter 9 describes.

## Exercise: setting the limit with a Pt100

The business considers using a second Pt100, class A, for the over-temperature limit instead of the thermocouple. The limit controller is to trip at 230 °C. What resistance should a decade box be set to for checking the trip point, what is the class A tolerance there in kelvin and in ohms, and what would a straight-line conversion report at that resistance?

**Worked answer.** From the Callendar–Van Dusen equation, R(230 °C) = 100 × (1 + 3.9083 × 10⁻³ × 230 − 5.775 × 10⁻⁷ × 230²) = **186.836 Ω**. The class A tolerance is ±(0.15 + 0.002 × 230) = **±0.61 °C**, which at a sensitivity of 0.3643 Ω/K is about **±0.22 Ω**. A straight-line conversion would report (1.86836 − 1)/0.00385 = **225.6 °C**, so a limit set to trip at a displayed 230 °C would not trip until about 234.7 °C, roughly 4.5 K late. The decade check at 186.836 Ω would find that error at once, which a check in boiling water never could.
