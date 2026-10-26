---
book: shape-memory-alloys-by-the-numbers
chapterSlug: stress-shifts-the-temperatures
order: 3
title: "Stress shifts the temperatures"
description: "Use the Clausius–Clapeyron relation to see how stress raises every transformation temperature, set heating and reset targets, and catch a pulse shortened on an unloaded test."
draft: false
---

A shape memory wire's certificate states its transformation temperatures without load. In use, it is never without load: a bias spring stretches it when cool, and a latch, a valve or a lever resists it when hot. Load changes the temperatures, and by more than most designers expect. A stress that favours martensite, such as tension in an actuator wire, makes martensite stable to higher temperatures, so every transformation temperature rises, roughly in proportion to the stress.

The rule that describes this is a form of the Clausius–Clapeyron relation, familiar from the way pressure raises the boiling point of water. This chapter states it, applies it to VL-25's wire at the stresses it actually sees, works out how hot the wire must get to complete its stroke and how cool it must fall to reset, and records a power-saving change that was tested without load.

## The Clausius–Clapeyron relation for stress

For a liquid boiling under pressure, the Clausius–Clapeyron relation gives the change in boiling temperature per unit change in pressure from the latent heat and the change in volume. For a solid transforming under stress, the same thermodynamic argument gives the change in transformation temperature per unit change in stress from the latent heat of the transformation and the transformation strain. The thermodynamics text in the references derives the relation for bars and for shear in plates, as an application of the conditions for two phases to coexist in equilibrium.

For engineering use, it reduces to a single number for a given alloy: the slope, in megapascals per degree. Published measurements for binary nickel-titanium typically fall in the range of several megapascals per degree. This book uses **6.5 MPa per °C** as an illustration.

```figure
type: formula
title: Transformation temperatures under stress
formula: T(σ) = T(0) + σ / (dσ/dT)
caption: This is an illustration with a slope of 6.5 MPa per °C. Applies to each of Mf, Ms, As and Af in tension along the wire. The slope for a real wire should come from its supplier or from tests at two or more stresses.
- T(0) | Transformation temperature without load, °C
- σ | Tensile stress in the wire, MPa
- dσ/dT | Stress–temperature slope, MPa per °C
step: Under the cool bias stress of 69 MPa: shift = 69 / 6.5 = 10.6 °C
step: At the start of the stroke, 148 MPa: shift = 148 / 6.5 = 22.8 °C
```

### A check on the slope

The slope is not arbitrary; thermodynamics ties it to the latent heat. In the stress form of the relation, the latent heat per unit volume equals the slope times the absolute temperature times the transformation strain. With a slope of 6.5 MPa per °C, a temperature of about 350 K and a transformation strain of about 4.5%, the latent heat comes to about 6.5 × 350 × 0.045 = 102 MJ per cubic metre, or about 16 J per gram at a density of 6.5 g/cm³. That is the right order of magnitude for the heat peaks seen when nickel-titanium is measured by calorimetry, which is a useful check that a quoted slope is physically sensible.

## The running case: VL-25's wire under load

This is an illustration. VL-25's wire is 0.254 mm in diameter, with a cross-section of 0.0507 mm², and its unloaded temperatures, from the 90 °C grade lot in Chapter 2, are Mf 62, Ms 70, As 82 and Af 90 °C. It sees four stresses that matter:

- **cool, under the bias spring's preload of 3.5 N**: 69 MPa;
- **at the start of the stroke**, when the wire must overcome the bias spring and the latch's 4.0 N of friction together, 7.5 N: 148 MPa;
- **at the end of the stroke**, when the latch has released and only the stretched bias spring remains, 4.3 N: 85 MPa;
- **the maker's guideline maximum** for a long life: 172 MPa.

```figure
type: compare
title: VL-25's transformation temperatures at the stresses it sees
cols: Stress | Mf | Ms | As | Af
caption: This is an illustration. Unloaded lot values Mf 62, Ms 70, As 82, Af 90 °C, shifted at 6.5 MPa per °C. The wire must exceed the highest Af it meets during the stroke to complete it, and cool below the Mf under the bias stress to reset.
- Cool, bias spring 3.5 N | 69 MPa | 72.6 °C | 80.6 °C | 92.6 °C | 100.6 °C
- End of stroke, 4.3 N | 85 MPa | 75.1 °C | 83.1 °C | 95.1 °C | 103.1 °C
- *Start of stroke, 7.5 N | 148 MPa | 84.8 °C | 92.8 °C | 104.8 °C | 112.8 °C
- Maker's guideline, 8.72 N | 172 MPa | 88.5 °C | 96.5 °C | 108.5 °C | 116.5 °C
```

Two numbers come out of the table and drive Chapters 6 and 7.

**How hot the wire must get.** At the start of the stroke, the wire carries 148 MPa, and its Af there is about 113 °C. Until the wire passes that temperature, it cannot complete the transformation against the full load. The latch's friction drops away once the pin starts to move, and the stress falls towards 85 MPa, but a wire that only reaches, say, 100 °C would stall partway. The heating current and pulse must take the wire comfortably above 113 °C, and the design aims for about 120 °C.

**How cool it must fall.** To reset, the wire must transform fully back to martensite under the bias spring's 69 MPa, which means cooling below about 73 °C. Chapter 2 used that number to choose the grade; Chapter 7 uses it to estimate how long the reset takes in a 60 °C cabinet.

## Measuring the slope

Because the margins in VL-25's design are a few degrees, the team measured the slope on its own wire rather than relying on a typical value. The method is simple: hang known weights on a length of wire in a temperature-controlled bath or oven, heat it slowly while watching its length, and note the temperature at which it finishes contracting. Repeating with different weights gives Af at several stresses, and the slope is the change in stress divided by the change in temperature.

```figure
type: bars
title: Measured Af of VL-25's wire under three dead loads
unit: °C
max: 120
caption: This is an illustration. Wire from the 90 °C grade lot in a slowly heated oil bath, length watched with a dial gauge. The straight line through the points has a slope of about 6.6 MPa per °C, close to the 6.5 used in this book.
- No load | 90.0
- 70 MPa | 100.5
- *140 MPa | 111.3
```

The three points give a slope of (140 − 0) / (111.3 − 90.0) = 6.6 MPa per °C, within a few per cent of the illustrative 6.5. Had the measured slope been, say, 5 MPa per °C, the loaded Af at the start of the stroke would have been 90 + 148 / 5 = 120 °C rather than 113 °C, and the heating target would have needed to rise by seven degrees. A measurement that takes an afternoon can move a design's margins by more than any calculation refinement.

The test uses hanging weights deliberately. A weight applies the same force whatever the wire's length, a dead load in the language of the thermodynamics text in the references, so the stress during the measurement is known and constant. Measuring with a spring instead would change the stress as the wire contracted, and the reading would mix the effects of temperature and stress. Chapter 5 shows that the same distinction between a constant force and a spring is central to designing the actuator itself. The test also needs a slow heating rate, a degree or two per minute, so that the wire is at the bath's temperature when its length is read; heated quickly, a wire lags the bath and appears to transform late.

## Between As and Af: partial strokes

Between the loaded As and Af, the wire is partly transformed, and its length lies between the long and short extremes roughly in proportion to how much has transformed. For VL-25, which only needs to be fully in or fully out, that intermediate range is something to pass through quickly. For a positioning actuator, it is tempting to use it: control the wire's temperature, and control its length.

In practice, positioning by temperature is difficult. The transformation range is narrow, only about 8 °C wide between As and Af in VL-25's lot, so a small temperature error is a large position error; the hysteresis means the same temperature gives different lengths on heating and cooling; and the range moves with load, as this chapter shows. Wire actuators that position precisely do so by measuring their own length, or their electrical resistance, which changes with transformation, and adjusting the current in a closed loop. For simple two-position devices, the right design is to drive firmly past Af and cool firmly below Mf, with margins of several degrees at both ends, measured under load.

### Cool ends

A wire's temperature is not uniform along its length. Near its terminations, the crimps and the metal they attach to conduct heat away, and the last few millimetres at each end run cooler than the middle. Those ends may not reach the loaded Af and do not contract fully, which shortens the effective working length. For VL-25's 150 mm wire, the team found the stroke about 3% shorter than calculated from the full length, consistent with roughly 2 mm at each end not transforming fully. The design's 4.0 mm stroke allowed for it by setting the latch's travel from measured, not calculated, wire behaviour.

## Limits of the rule

The linear rule is a good description over a moderate range of stress and temperature. It has limits that matter for some designs:

- **It applies to stress that favours the transformation.** Tension along an actuator wire favours martensite and raises the temperatures. Other stress states, such as compression or shear in a complex part, need their own slopes.
- **There is an upper limit.** Above a temperature usually called Md, stress no longer produces martensite at all; the austenite yields plastically instead, and the shape is lost. For actuators heated well above Af, and for superelastic parts in hot service, that limit must be kept clear of.
- **Each lot is different.** The slope varies with composition and processing, and a design with small temperature margins should measure it, by finding a transformation temperature at two or more loads.

## The error: a pulse shortened on an unloaded test

This is an illustration. To save energy from the cabinet's backup battery, VL-25's firmware engineer looked for the shortest heating pulse that would operate the latch. On the bench, with the wire mounted in a test fixture but not connected to the latch or the bias spring, a pulse of 1.05 A for 0.5 s contracted the wire fully; a thermocouple taped beside the wire showed it reaching about 95 °C, comfortably above the certificate's Af of 90 °C. The firmware was changed from 1.0 s to 0.5 s pulses.

In the next field trial, about a third of the latches released only partway: the pin moved a millimetre or two and stopped, and the flap stayed shut. The investigation found the cause in the table above. The bench test had been run with no load, where Af is 90 °C, and 95 °C was enough. In the latch, the wire starts its stroke at 148 MPa, where Af is about 113 °C, and 95 °C was not enough to complete the transformation against that load. The wires that did release fully were those whose latch friction happened to be low.

The pulse was restored to a duration chosen from tests under load, on assembled latches with their bias springs, and checked at the coldest cabinet temperature, where the wire starts furthest below Af. The lesson the team recorded: every temperature on a shape memory wire's certificate rises under load, and every test of an actuator's heating or cooling must be done under the actuator's real load, because an unloaded test measures a different wire.

## Using the shift deliberately

The stress shift is not only a hazard. Designers use it in several ways:

- **Raising the reset temperature with bias stress**, so that a wire resets in a hotter environment; the cost is a higher stress during the stroke and a shorter life.
- **Lowering the operating stress to lower the heating temperature**, saving energy and keeping the wire further from overheating.
- **Making a temperature-sensitive switch** whose operating temperature is adjusted by its preload: a wire that releases at a temperature set by its spring.
- **Setting superelastic behaviour**: in Chapter 9, the same slope sets how a superelastic part's plateau stress changes with temperature, which is its main design difficulty.

Each use trades one margin for another, and each depends on knowing the slope for the wire actually fitted. The general advice is to treat the bias stress as a design variable alongside the wire grade: between them they set the operating temperature, the reset temperature, the force available and the life, and none of those can be chosen independently of the others. VL-25's final bias preload of 3.5 N was chosen after trying 3.0, 3.5 and 4.0 N on prototypes in the hot room, as the best balance of reset temperature, reset force and stress during the stroke.

## Exercise: a softer latch

A redesign reduces the latch's static friction from 4.0 N to 2.5 N, keeping the 3.5 N bias preload.

1. What are the stress and the loaded Af at the start of the stroke?
2. How does that change the heating target?

**Worked answer.**

1. The start-of-stroke force is 3.5 + 2.5 = 6.0 N, a stress of 6.0 / 0.0507 = **118 MPa**. The shift is 118 / 6.5 = 18.2 °C, so the loaded Af is 90 + 18.2 = **108.2 °C**.
2. The heating target falls by about 4.6 °C, from about 113 °C to about 108 °C. With the same margin as before, the wire could aim for about 115 °C instead of 120 °C, slightly shortening the pulse or reducing the current, and its stress falls further below the 172 MPa guideline, which Chapter 8 shows lengthens its life. Reducing the latch's friction is worth more than any change to the wire, because friction sets the peak stress.
