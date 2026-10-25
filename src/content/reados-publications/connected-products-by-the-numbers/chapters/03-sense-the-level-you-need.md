---
book: connected-products-by-the-numbers
chapterSlug: sense-the-level-you-need
order: 3
title: "Sense the level you need"
description: "Work out an ultrasonic level sensor's accuracy from the speed of sound, compensate for temperature, handle the dead zone and averaging, and find the error a hot tank roof creates."
draft: false
---

A connected product is only as good as its measurement. A beautifully designed app that shows the wrong water level is worse than no app, because people act on it. The measurement is also where the physics is least forgiving: a sensor can be precise, repeating the same wrong answer to the millimetre, and still be inaccurate by centimetres because one physical assumption is wrong.

This chapter works through the tank monitor's ultrasonic measurement from first principles. It calculates the speed of sound and its dependence on temperature, shows why an uncompensated sensor fails the accuracy requirement, designs the compensation, and deals with the dead zone, the beam, repeatability and averaging. It ends with a failure the pilot fleet found: a daily swing in the readings caused by the tank roof heating the air unevenly.

## Time of flight

An ultrasonic level sensor sends a short burst of sound downwards and listens for the echo from the water surface. It measures the round-trip time t. The distance to the surface is half the distance travelled:

**d = c × t ÷ 2**, where c is the speed of sound in the air above the water.

The water depth is the sensor's height above the tank floor, H, less that distance: **depth = H − d**. Chapter 2's calibration at overflow fixes H for each tank. The remaining question is c.

## The speed of sound depends on temperature

For an ideal gas, the speed of sound is **a = √(γ × R × T)**, as NASA's public aeronautics guide sets out, where γ is the ratio of specific heats, R is the specific gas constant and T is the absolute temperature. For dry air, γ = 1.4 and R = 287 J/(kg·K). Humidity changes the result slightly. It is ignored here, and the pilot fleet's data in Chapter 9 checks whether that matters.

```figure
type: formula
title: Speed of sound in air and the error from assuming 20 °C
formula: c = √(1.4 × 287 × (T + 273.15))        depth error = d × (1 − c₂₀ ÷ c_T)
caption: Dry-air values. The error is for a sensor that assumes 20 °C when the air is at T, with a 2.0 m air gap, positive when the depth reads high.
- At 0 °C | c ≈ 331.3 m/s
- At 20 °C | c ≈ 343.2 m/s
- At 45 °C | c ≈ 357.5 m/s
step: at 45 °C, c₂₀ ÷ c₄₅ ≈ 343.2 ÷ 357.5 ≈ 0.960, so distances read 4.0% short
step: with a 2.0 m air gap: error ≈ 2,000 × 0.040 ≈ 80 mm of depth, about 816 L
```

The speed of sound rises by about **0.17% per kelvin** near room temperature. That sounds small. Over a 2 m air gap, an uncompensated sensor that assumes 20 °C reads the depth about **80 mm** too high on a 45 °C summer afternoon in the tank's headspace, and about **91 mm** too low on a −5 °C winter morning. Requirement R1 allows ±25 mm. Without compensation, the sensor fails by a factor of three or more.

```figure
type: line
title: Depth error of an uncompensated sensor, 2.0 m air gap
x: Air temperature in the tank headspace, °C
y: Depth error, mm
ymin: -100
ymax: 100
mark: 20 | Assumed temperature
caption: Calculated from the dry-air speed of sound for a sensor that assumes 20 °C. The error grows in proportion to the air gap, so it is worst when the tank is nearly empty, exactly when accuracy matters most.
- -5 | -91.2
- 5 | -53.2
- 15 | -17.3
- 20 | 0
- 25 | 16.8
- 35 | 49.3
- 45 | 80.2
```

## Compensate for temperature

The standard fix is to measure the air temperature and calculate c from it for every reading. This is an illustration. The tank monitor carries a thermistor in its housing, accurate to about ±1 K. A temperature error of ΔT changes c by about 0.17% per kelvin, so a **2 K** error, the thermistor's tolerance plus some allowance, gives a distance error of about **0.34%**, or about **6.3 mm** over a 2 m gap. Chapter 2's budget allowed **±8 mm** for compensated speed-of-sound error, so on paper this works.

The words "on paper" matter. The compensation calculates c from the temperature at the thermistor. The sound travels through the whole air column, from the roof to the water. If the air in that column is not at the thermistor's temperature, the compensation corrects for the wrong temperature. The failure case later in this chapter shows how that happened.

## The other error sources

**Timing resolution.** The processor's timer resolves time to about 1 µs, which corresponds to **343.2 × 10⁻⁶ ÷ 2 ≈ 0.17 mm** of distance. Detecting the echo's exact arrival is less precise. Noise and the shape of the echo make the detected arrival jitter by perhaps 10 µs, about **1.7 mm**. That sits inside the ±2 mm budgeted.

**Dead zone.** After the transducer sends its burst, it rings for a short time and cannot hear an echo. Any surface closer than a certain distance is invisible. This is an illustration. The tank monitor's transducer has a minimum range of 0.25 m, so it is mounted at least **250 mm above the overflow** level. That is why the maximum air gap, with an empty tank, is **2.21 + 0.25 = 2.46 m**, and the longest round trip is **2 × 2.46 ÷ 343.2 ≈ 14.3 ms** at 20 °C. The firmware listens for 20 ms, a margin for colder air and longer tanks.

**The beam.** The burst spreads in a cone. Anything in the cone, such as a ladder, the inlet pipe, the overflow fitting or a wall too close, can return an echo stronger than the water's. The installation instructions specify a clear zone below the sensor, and the firmware rejects echoes at a distance that stays fixed while the water level changes, the signature of a fixed object.

**Surface ripple.** When rain pours in through the inlet, the surface is disturbed and echoes scatter. The firmware takes eight pings about 50 ms apart for each reading and reports their median, which rejects single outliers. If the eight pings vary by more than a set amount, the reading is flagged as disturbed rather than reported as precise.

## Repeatability and averaging

Requirement R2 asks for successive readings within ±5 mm at a stable level, for leak detection. Repeatability is limited by random effects that change from reading to reading, mainly echo timing jitter and small surface movements. Averaging reduces random noise. If each ping has a random spread of, say, 5 mm standard deviation, the mean of eight independent pings has a spread of about **5 ÷ √8 ≈ 1.8 mm**.

Averaging does nothing for systematic errors. A thermistor that reads 3 K high produces the same error in every ping, and averaging eight of them gives the same wrong answer eight times over. This is the practical difference between repeatability and accuracy. R2 is met by averaging and good echo processing. R1 is met only by getting the physics right.

The general principles of sampling a physical signal before it reaches a database, including aliasing and the difference between resolution and accuracy, are covered in [Sampling and quantisation before data reaches a database](/reados/collections/engineering-design-practice/sampling-and-quantisation-before-data-reaches-a-database/).

## Install it where the physics works

Many measurement problems are created at installation and cannot be fixed in firmware. The tank monitor's installation instructions turn the physics above into a few rules an owner can follow.

**Away from the inlet.** Water falling from the inlet strainer disturbs the surface directly below it and, in heavy rain, fills the air with spray that scatters the burst. The sensor is mounted at least 600 mm from the inlet, measured on the roof.

**Clear of the wall and fittings.** The beam's cone widens with distance. Near the bottom of an empty tank it can be several hundred millimetres across. The instructions show a clear zone below the sensor and ask the owner to check, with a torch through the inlet, that no ladder, pipe or float valve lies inside it.

**Vertical.** A tilted sensor measures a slant distance. The error is small for a slight tilt: at 3°, the slant path over a 2.46 m gap is longer than the vertical by about **2,460 × (1 − cos 3°) ≈ 3.4 mm**. At 5° it is about 9.4 mm, a large share of the budget. Corrugated tank roofs slope, so the sensor's mounting collar includes a levelling seat, and the app's installation screen asks for a photo of its built-in bubble level.

**Screened.** Insects and spiders find tank openings quickly. A web across the transducer face can return an echo or absorb the burst. The sensor's face sits behind a fine stainless mesh that is acoustically open but keeps insects off, the same kind of mesh that tank inlets already carry to keep mosquitoes out.

**Protected from condensation.** Warm, humid air in the headspace meets a transducer face that cools at night. Droplets on the face change the burst and the echo. The housing's design follows the packaging principles in the companion book's chapter on sealing and venting: the electronics are sealed, the transducer face is shaped to shed drops, and the firmware flags readings whose echo shape suggests a wet face.

## Check against a known level at installation

The overflow calibration in Chapter 2 only happens when the tank fills, which may be months away in a dry season. Until then, the installed height H is the owner's tape measurement. The app's installation steps therefore ask for one independent check: the owner lowers a marked dipstick or a weighted tape through the inlet to the water and enters the reading. The platform compares that depth with the sensor's and, if they differ by more than the budget allows, prompts the owner to remeasure the sensor's height before the low-level alert is enabled.

That one check catches the commonest installation errors: a height measured to the wrong point on the roof, an obstruction in the beam and a sensor mounted on a sloping section. It costs the owner two minutes and saves the support calls that a wrong alert would generate.

## A failure case: the tank that breathed every day

This is an illustration. Two months into the pilot fleet of Chapter 9, the platform's leak-detection function flagged six tanks with a repeating pattern. Every afternoon the depth appeared to fall by about 20 mm, and every night it recovered. The owners reported no leaks, and the water could not be both leaving and returning.

The team plotted depth against the thermistor reading for one tank on a dry week with little water use. The apparent fall tracked the thermistor's afternoon peak closely. The thermistor sat in the sensor housing, just under the tank's dark roof. On a hot afternoon, the air near the roof reached about **50 °C** while the air near the water, cooled by the water's mass, stayed much cooler. The team estimated an average of about **42.5 °C** over the column.

The firmware compensated using 50 °C, so it used a speed of sound that was too high. It calculated the distance as too long and the depth as too low. With a 2 m air gap, the error was about **2,000 × (c₅₀ ÷ c₄₂.₅ − 1) ≈ 23.6 mm**, close to the observed 20 mm swing. The thermistor was accurate. It measured the wrong air.

The team considered three corrections.

```figure
type: compare
title: Ways to correct for a temperature gradient in the headspace
cols: How it works | Residual error at 2 m | Cost and risk
caption: This is an illustration. The reference target's residual assumes 10 µs of timing jitter over a 200 mm path, averaged over eight pings.
- Thermistor in the housing | measures air at the roof only | about 24 mm on hot afternoons | no added cost; fails R1
- Reference target in the beam | times a fixed reflector at a known distance to measure c directly | about 17 mm per ping, about 6 mm averaged over eight | extra moulded part; sees only the top of the column
- *Second thermistor on a short stem | averages air temperature at the roof and 300 mm lower | within the 8 mm allocation in pilot testing | small part and wire; installer must fit the stem
- Readings at night for leak trends | uses the quietest, most uniform hours | not a fix for R1 | software only; daytime accuracy still poor
```

The reference target is elegant: a small reflector at a known distance from the transducer gives a direct measurement of c along part of the path. Its weakness here was that it measured only the hottest part of the column, the same problem in another form. The team chose a second thermistor on a short perforated stem reaching about 300 mm into the tank, averaging it with the housing thermistor. In a second pilot batch, the daily swing fell to within the budget. As a further safeguard, the leak-detection function was changed to compare readings taken at the same time of night. That makes it insensitive to any remaining daily cycle.

The detection is the useful lesson. A false leak signal, appearing at the same time every day and correlating with a temperature, was the clue. The platform's data showed the problem across six tanks within weeks, something no bench test would have revealed.

## How this applies to a small Australian business

Australian rainwater tanks sit in strong sun, often with dark roofs, and headspace temperatures can be well above the shade temperature. Overseas sensor modules are often characterised under milder, more uniform conditions. Before trusting a sensor's stated accuracy, work out which physical assumption the accuracy depends on, then test that assumption in the place the product will live, over a full hot day. A sensor that is accurate on the bench and wrong on the tank is a product that will generate support calls and lose trust.

## Exercise: a cold morning

On a −5 °C winter morning, the headspace air is uniform at −5 °C, and the thermistors are working correctly. The tank is low, with a 2.2 m air gap. What is the depth error of an uncompensated sensor assuming 20 °C, and roughly how many litres does it represent? What is the error of the compensated sensor if both thermistors read 1 K high?

**Worked answer.** At −5 °C, **c ≈ √(1.4 × 287 × 268.15) ≈ 328.2 m/s**. The uncompensated sensor reads distances in the ratio **343.2 ÷ 328.2 ≈ 1.0457**, about 4.6% long, so the depth reads low by about **2,200 × 0.0457 ≈ 100 mm**, about **100 × 10.18 ≈ 1,020 L**. That is enough to trigger a false low-level alert. With compensation and both thermistors reading 1 K high, the speed-of-sound error is about **0.19%** at this lower temperature, so the distance reads about **2,200 × 0.0019 ≈ 4.1 mm** long, well within the ±8 mm allocation.
