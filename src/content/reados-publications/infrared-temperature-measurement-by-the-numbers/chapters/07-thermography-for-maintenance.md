---
book: infrared-temperature-measurement-by-the-numbers
chapterSlug: thermography-for-maintenance
order: 7
title: "Thermography for maintenance"
description: "Long-wave cameras, emissivity and reflected temperature near room temperature, comparisons and trends, IH-40's cabinet and press motor, and a hot busbar joint that showed as the coolest of three."
draft: false
---

The first six chapters dealt with a pyrometer measuring a hot billet at one spot, many times a minute. A maintenance thermal survey is the opposite case: a camera with tens of thousands of measuring spots, looking at equipment near room temperature, once a month or once a quarter, to find the one connection or bearing that is warmer than it should be. The physics is the same Planck law, but at long wavelengths and low temperatures it behaves very differently, and the errors that a 1 µm pyrometer shrugs off become the main problem.

This chapter sets out how a long-wave camera forms its readings, why emissivity and reflected radiation dominate near room temperature, how comparisons and trends get round much of that, how the forge surveys IH-40's power cabinet and the press motor, and ends with a busbar joint running at 85 °C that the camera showed as the coolest of three.

## What the camera sees

A thermal camera for maintenance is an array of small thermal detectors, typically working across the 8 to 14 µm band, behind a lens that forms an image of the scene. Each pixel is a tiny radiation thermometer with its own spot. The camera applies the same measurement equation as Chapter 5, but at long wavelengths, near room temperature, every term matters:

S = ε × B(T) + (1 − ε) × B(T_refl)

where B is the black-body radiance integrated over the camera's band and T_refl is the **reflected apparent temperature**: the effective temperature of whatever the surface is reflecting into the camera. The user sets the emissivity and the reflected temperature, and the camera solves for T. Over the short distances of a cabinet survey, the air's absorption is small; for longer distances, the camera also takes the air temperature, humidity and distance.

At 20 °C, the 8 to 14 µm band carries about 37% of all the radiation a black body emits (Chapter 1), so the camera has plenty of signal. What it lacks is sensitivity to emissivity errors: a surface at 45 °C radiates only a little more than its surroundings at 25 °C, and a modest error in how much of the signal is emission and how much is reflection becomes a large error in temperature.

```figure
type: formula
title: The thermal camera's measurement equation
formula: S = ε × B(T) + (1 − ε) × B(T_refl)
caption: B is black-body radiance integrated over 8 to 14 µm. Near room temperature, both the emissivity and the reflected apparent temperature must be set for each surface.
- ε | Emissivity of the surface in the camera's band
- T | Surface temperature, the unknown
- T_refl | Reflected apparent temperature, from the surroundings the surface mirrors
```

## Emissivity near room temperature

Emissivity in the long-wave band divides surfaces into two groups. Paints, plastics, rubber, oxidised and corroded metal, and most non-metals are high, around 0.9 and above; Optris's table gives oil paint at 0.94 and eight paint colours and qualities between 0.92 and 0.94 near 70 °C. Bare metals are low and variable: Optris lists oxidised copper at 0.6 to 0.7 near 50 °C and polished copper at 0.02 to 0.03. A clean, freshly made joint on copper busbar may sit anywhere between, depending on its finish.

For high-emissivity surfaces, the camera is forgiving. A painted motor housing at 62 °C, emissivity 0.93, read with the camera left at 0.95, shows **61.3 °C**, under a kelvin out. For low-emissivity surfaces, it is not. An oxidised copper joint at 45 °C with an emissivity of 0.65, read at the default setting of 0.95 with a reflected temperature of 25 °C, shows **39.0 °C**, 6 K low. A bright copper joint at 85 °C with an emissivity of 0.10 shows **32.8 °C**, 52 K low.

The reflected temperature matters just as much on a shiny surface. Set correctly to an emissivity of 0.10, the same bright joint reads 85.0 °C if the reflected temperature is set correctly at 25 °C, but if the cabinet's interior, which it is actually reflecting, is at 40 °C, the camera reads **161 °C**. A shiny surface is mostly a mirror, and a camera reading its temperature is mostly reading the room.

```figure
type: compare
title: Camera readings on IH-40's cabinet at the default setting of 0.95, reflected 25 °C
rowhead: Surface
cols: True temperature | Emissivity, 8 to 14 µm | Camera reads
caption: This is an illustration from the band-integrated Planck law. Painted and insulated surfaces read close to the truth; bare metal reads low, and bright metal reads very low.
- Painted motor housing | 62 °C | 0.93 | 61.3 °C
- Cable insulation | 70 °C | 0.93 | 69.2 °C
- Oxidised copper joint | 45 °C | 0.65 | 39.0 °C
- * Bright copper joint | 85 °C | 0.10 | 32.8 °C
```

## Making the measurement reliable

Four practices turn a camera from a picture maker into a measuring instrument.

1. **Measure high-emissivity surfaces.** Where a surface can be prepared during a shutdown, a patch of high-emissivity paint or tape of known emissivity on each joint or housing to be watched gives a reliable reading for years. Where it cannot, the cable insulation or a painted surface right beside a bare joint, heated by it, is usually a better indicator than the joint itself.
2. **Set the reflected temperature.** Measure it by aiming the camera, set to an emissivity of 1.0, at a crumpled piece of aluminium foil placed where the target is, which mirrors the surroundings the target sees. Enter the reading as T_refl.
3. **Compare like with like.** Three phases of the same busbar, made the same way and carrying similar current, should read alike. A difference is informative even when the absolute values are uncertain, provided the surfaces really are alike.
4. **Trend over time.** The same housing at the same load and ambient, surveyed every month, gives a trend that a single reading cannot. A rise of a few kelvin over two months is a better early warning than any single reading against a threshold.

ISO 18434-1 sets out general procedures for thermographic condition monitoring of machines, and electrical survey practice has its own guides and criteria. The forge sets its own action levels from its baseline readings, on surfaces it has prepared, and treats published severity criteria as a starting point.

## Load, timing and what a rise means

An electrical joint heats in proportion to the square of the current through it, because the power lost in its contact resistance is I² × R. A survey at half load therefore shows only about a quarter of the joint's full-load temperature rise above its surroundings. This is an illustration: a joint that runs 60 K above the cabinet air at full load would show only about 15 K at half load, a rise that could pass for normal. Surveys are made at or near full working load, and the load at the time is recorded with each reading so that trends compare like with like.

The same relation shows what a rise means. If a joint's contact resistance doubles, as it might when a bolt loosens or the surfaces oxidise, its heat doubles at the same current, and its rise above its surroundings roughly doubles too. A joint carrying 600 A with a contact resistance of 50 µΩ dissipates 600² × 50 × 10⁻⁶ = **18 W**; at 100 µΩ, 36 W. That is why a joint that runs a few kelvin warmer each month is worth attention: its resistance is climbing, and resistance that is climbing tends to keep climbing.

## The smallest target a camera can read

Each pixel in a thermal camera is a small radiation thermometer with its own spot, and Chapter 6's rules apply to it. The pixel's spot is set by the camera's **instantaneous field of view**, usually given in milliradians: a camera with an instantaneous field of view of 2.7 mrad sees a patch 2.7 mm across from each pixel at 1 m. A target the size of one pixel is never reliably filled, because it rarely lines up with a single pixel; a common rule of thumb is to measure only targets that cover at least three pixels by three.

For IH-40's cabinet, surveyed from about 1 m through the door's window, that rule says the camera can measure targets about 8 mm across and larger: a busbar joint or a cable is easy, a small fuse clip or a terminal screw is not. Small, hot targets read low on a thermal camera for exactly the reason that the 25 mm billets read low in Chapter 6, and the cure is the same: get closer, or use a lens with a narrower field of view.

## Surveying live equipment safely

A thermal survey of electrical equipment is only useful while it is energised and loaded, which is exactly when opening it is hazardous. That is the reason for IH-40's infrared window: the camera looks through the closed door, and nobody is exposed to live parts or to an arc flash for the sake of a picture. Where equipment must be opened, the work is planned and done by competent people under the electrical safety rules that apply, with AS/NZS 4836, the Australian and New Zealand standard for safe working on or near low-voltage electrical installations, as one reference, and under the site's own permits. The thermographer's training covers the camera; the electrical controls cover the person holding it.

## IH-40's survey

This is an illustration. The forge surveys IH-40's power cabinet and the press motor monthly, at full production load, through an infrared window fitted to the cabinet door (Chapter 5), with the window's measured transmission entered in the camera.

- **The press motor.** The motor's housing is painted. At its last survey, its drive-end bearing housing read **61.3 °C** with the camera at 0.95, against 47.6 °C at the same load and a similar ambient three months earlier. A rise of about 14 K at the bearing, with the non-drive end unchanged, was reported for a vibration check and lubrication review, which found a bearing short of grease.
- **The cable insulation.** Each phase's cable, where it lands on the busbar, is PVC insulated, a high-emissivity surface; a check against a paint patch on a cold cable gave about 0.93. The insulation reads within a kelvin of its true temperature at the default setting and is the forge's primary indicator for the joints.
- **The joints themselves.** Bare copper, read for information only, never alone.

## The error: the coolest joint was the hot one

This is an illustration. During a rebuild, IH-40's L2 busbar joint was remade by an electrical contractor, who cleaned the copper back to bright metal before reassembling it. At the next thermal survey, a new member of the maintenance team photographed the three joints with the camera at its default emissivity of 0.95 and compared them. L1 read 39.0 °C, L3 read 39.8 °C, and L2, the remade joint, read **32.8 °C**: the coolest of the three. The report noted the new joint as running cool, a sign of a good connection, and recorded the cabinet as clear.

Three weeks later, a technician noticed that the PVC insulation on L2's cable, just behind the lug, had discoloured. A survey of the cable insulation, at emissivity 0.93, found L2's cable at about **70 °C** against 41 °C on L1 and L3. The joint, examined during a shutdown, had been assembled with the wrong washers and was not clamped to its proper torque. Its contact resistance was high and it had been running at about **85 °C** since the rebuild.

The arithmetic explained the survey. Bright copper with an emissivity of about 0.10 is almost a mirror; at 85 °C, seen at a setting of 0.95, it reads 32.8 °C, because the camera sees mainly the reflection of the 25 °C room. The two older joints, oxidised to an emissivity of about 0.65, read 6 K low but at least in proportion. A comparison between phases is only valid between like surfaces, and a newly cleaned joint is not like an old one.

The forge changed its procedure. Joints are judged by the cable insulation or a high-emissivity patch applied at each shutdown, never by bare copper; any joint remade since the last survey is flagged on the survey sheet; and the camera's settings for each measurement point are written on the route card, so that a new surveyor uses the same ones.

```figure
type: checklist
title: IH-40's thermal survey route card
caption: The settings and surfaces are fixed for each point, so readings can be compared from month to month. The last line is this chapter's error.
- Press motor bearing housings, painted | emissivity 0.95; trend at the same load
- Cable insulation behind each busbar lug | emissivity 0.93; compare phases
- Infrared window transmission entered | measured with this camera
- Reflected apparent temperature measured | crumpled foil at each panel
- Joints remade since the last survey flagged | read only via insulation or a patch
- x Bare copper joints compared at default settings | an 85 °C joint read coolest at 32.8 °C
```

## Exercise: setting the camera for a bare joint

A bare, oxidised copper joint in IH-40's cabinet has an emissivity of about 0.65 in the camera's band, and the reflected apparent temperature, measured with foil, is 25 °C. With the camera set to 0.95, it reads 39.0 °C. What is its true temperature, and how sensitive is the answer to an emissivity uncertainty of ±0.05?

**Worked answer.** Solving the measurement equation with the band-integrated Planck law, a joint reading 39.0 °C at a setting of 0.95 and 25 °C reflected has a true temperature of **45.0 °C** if its emissivity is 0.65. Each 0.01 of emissivity is worth about 0.28 K at this temperature, so ±0.05 gives about **±1.4 K**. That looks precise, but it holds only if 0.65 is right: the joint's emissivity could be anywhere from about 0.6 to 0.7 by Optris's indicative range for oxidised copper, and much lower if any of it has been cleaned. The answer is good to a few kelvin for trending this joint against itself, and not good enough to judge it against a different joint whose surface is unknown.
