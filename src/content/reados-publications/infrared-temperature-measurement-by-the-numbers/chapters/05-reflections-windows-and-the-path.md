---
book: infrared-temperature-measurement-by-the-numbers
chapterSlug: reflections-windows-and-the-path
order: 5
title: "Reflections, windows and the path"
description: "The measurement equation, reflection from hot surroundings, targets inside furnaces, window losses and correction, steam and dust, and a window that fogged over three weeks and sent IH-40 hot."
draft: false
---

A pyrometer receives whatever radiation arrives at its lens from the direction it is aimed, and only part of that comes from the target's own emission. Some is radiation from the surroundings that the target reflects. Some is lost on the way, in a protective window, in steam, in dust. The instrument cannot sort one from another; it treats everything it receives as if it were the target's emission, divides by the emissivity setting, and reports a temperature.

This chapter writes that down as a measurement equation, uses it to find how much reflected radiation from hot surroundings adds to IH-40's readings, explains why a target inside a furnace looks like a black body, deals with the losses in windows and the sight path and how to correct for them, and ends with a protective window that fogged slowly over three weeks while the heater's control loop drove the billets steadily hotter.

## The measurement equation

For an opaque target at temperature T with emissivity ε, seen through a window of transmission τ, with surroundings at temperature T_s that the target reflects, the radiance arriving at the detector at wavelength λ is:

S = τ × [ε × L(T) + (1 − ε) × L(T_s)]

where L is the black-body radiance from Planck's law. The first term in the bracket is the target's own emission. The second is reflection: an opaque surface reflects 1 − ε of what falls on it (Chapter 2), and what falls on it is the surroundings' radiation. The window takes its share of both. A cold window emits almost nothing at 1 µm, so its own emission is left out here; at long wavelengths, a warm window's emission matters, and thermal cameras account for it.

The instrument reports the temperature T_indicated for which ε_set × τ_set × L(T_indicated) = S. When the settings match the real ε and τ and the surroundings are cold, the reading is the true temperature. Each of the other terms is a way for it not to be.

```figure
type: formula
title: The measurement equation for a single-wavelength pyrometer
formula: S = τ × [ε × L(T) + (1 − ε) × L(T_s)]
caption: The instrument assumes S = ε_set × τ_set × L(T_indicated). Reflected radiation adds to S; window and path losses reduce it.
- S | Radiance arriving at the detector
- τ | Transmission of the window and path
- ε | Target emissivity at the working wavelength
- L(T), L(T_s) | Black-body radiance at the target and surroundings temperatures
```

## Reflection from hot surroundings

At room temperature, the reflected term is negligible at 1 µm: surroundings at 20 °C radiate about 10⁻¹⁷ of what a 1,200 °C billet does at that wavelength (Chapter 1). Around a forge, the surroundings are not all at room temperature. The coil's exit liner, the next billet, a furnace door or a hot die can all be reflected in the billet's surface into the pyrometer.

This is an illustration for IH-40's billet at 1,200 °C seen at 1.0 µm, with the emissivity correctly set:

- reflecting surroundings at **900 °C** over the whole of its reflected view, scaled billet, ε = 0.85: reads **1,202.2 °C**, 2.2 K high;
- the same surroundings over 30% of the reflected view: 1,200.7 °C;
- bright billet, ε = 0.60, reflecting 900 °C over the whole view: **1,208.1 °C**, 8.1 K high;
- the scaled billet reflecting 900 °C surroundings, seen by a 10 µm instrument: **1,313 °C**, 113 K high.

The pattern follows from the equation. The reflected term grows as 1 − ε, so shiny targets suffer more. It grows with the surroundings' radiance relative to the target's, so hot surroundings matter and cold ones do not. And at long wavelengths, where a 900 °C surface radiates 69% as much as a 1,200 °C one, reflection is a large error; at 1.0 µm, where it radiates 8%, it is a small one. Short wavelengths win again.

```figure
type: bars
title: IH-40 reading with reflected radiation from 900 °C surroundings, true 1,200 °C
unit: K high
max: 120
caption: This is an illustration with emissivity set correctly, surroundings filling the whole reflected view except where stated. Reflection hurts shiny targets and long wavelengths most.
- Scaled billet, 1.0 µm, 30% of view | 0.7
- * Scaled billet, 1.0 µm | 2.2
- Bright billet, 1.0 µm | 8.1
- Scaled billet, 10 µm | 113.4
```

## A target inside a furnace

The extreme case is a target inside a furnace whose walls are at the target's own temperature. Then T_s = T, and the measurement equation becomes S = τ × [ε × L(T) + (1 − ε) × L(T)] = τ × L(T). The emissivity has vanished. What the target fails to emit, it makes up exactly by reflecting the walls, and it looks like a black body. That is the same physics that makes a cavity a black body (Chapter 1).

For IH-40's scaled billet at 1,200 °C, surrounded by walls at 1,200 °C, an instrument set to 0.85 would read **1,224.9 °C**, 25 K high, because it divides a black body's radiance by 0.85. Inside a uniform furnace, the right emissivity setting is 1.0, whatever the surface. In real furnaces, the walls are usually not at the work's temperature, often hotter while the work is heating and cooler while it soaks, and the reflected term is somewhere between the two cases. Pyrometers sighted into furnaces are therefore set up against a reference temperature in the furnace itself, not from an emissivity table.

## Windows

A pyrometer in a forge needs protection from heat, scale and splashes, and the usual protection is a window in front of the lens, often with an air purge to keep it clean. A window, even a perfectly clean one, does not transmit everything.

A clean, uncoated window reflects part of the radiation at each of its two faces. For glass or fused silica with a refractive index of about 1.45, each face reflects about 3.4%, so a clean window transmits about **93.4%** before any absorption or dirt. Coated windows reflect less. The material must also be transparent at the working wavelength: ordinary glasses suit 1 µm instruments, but are opaque in the long-wave band, where thermal cameras use windows of special materials.

The effect on a single-wavelength instrument is the same as an emissivity error. An uncorrected clean window at 93.4% makes IH-40's pyrometer read **10.2 K** low. Most instruments have a transmission setting for exactly this purpose; with it set to 0.934, the clean window's error disappears. Dirt that further reduces the transmission is another matter, because the setting does not know about it: with the setting at 0.934, a window that has fallen to 85% reads **14.1 K** low, and one at 75% reads **32.4 K** low.

## Measuring a window's transmission

A window's transmission can be measured on site with the instrument itself. Aim the pyrometer, with its transmission setting at 1.0, at a steady hot source that fills its spot, such as a reference billet held in a furnace or a portable calibration source, and read it with and without the window in place. The ratio of the two radiances is the transmission:

τ = L(T_with window) ÷ L(T_without window)

This is an illustration. If IH-40's pyrometer reads a steady 1,200.0 °C source as 1,189.8 °C through its clean window, Planck's law at 1.0 µm gives τ = L(1,462.95 K) ÷ L(1,473.15 K) = **0.934**, the clean-window value. The same test on a dirty window, read before it is cleaned, records how much it had lost, which over a few cleaning cycles gives the forge a measured cleaning interval instead of a guessed one.

The window also has a temperature of its own. A window a short distance from a stream of billets at 1,200 °C absorbs some of their radiation and warms, and a warm window can crack, distort or, at long wavelengths, add its own emission to the signal. The air purge that keeps the window clean also keeps it cool, and its supply should be interlocked with the heater so that the window is never left exposed without it.

## Thermal cameras and infrared windows

The same equation governs thermal cameras looking through infrared inspection windows fitted to switchboard doors, which let the maintenance team survey live equipment without opening the enclosure (Chapter 7). Those windows are made of materials transparent in the long-wave band, and their transmission, typically well below 100%, must be entered in the camera or the readings will be low. At long wavelengths a window at room temperature also emits a little, which the camera's own correction handles when the window's temperature is entered. The rule is the same as for IH-40's pyrometer: measure the window's transmission with the camera that will be used through it, and record it on the window.

## Steam, dust and smoke

The air between the window and the target can carry steam from cooling sprays, dust and scale particles, smoke from lubricants and oil mist. Each absorbs or scatters some of the radiation, and steam and water droplets can also cool the very surface being measured. Unlike a window, the path's loss changes from minute to minute, so no fixed setting can correct it.

The remedies are practical. Keep sprays and the measuring point apart. Sight across the shortest path the installation allows. Use an air purge on the window, and where the path is badly obscured, a sighting tube purged with clean air out to near the target. Where obscuration cannot be avoided, a ratio pyrometer (Chapter 4) tolerates grey losses that a single-wavelength instrument cannot, provided its minimum signal level is set.

## Checks on the sight path

Most path problems can be found with a few routine checks, each cheap compared with a shift of overheated billets.

- Look along the sight line from behind the instrument, with the heater stopped, for anything hot that the target could reflect: coil liners, heaters, furnace openings, the sun through a roof light. Move the aiming point or add a cold shield where one is found.
- Check the reading on a steady target with the purge air on and off. A change means the purge is either blowing dust into the path or keeping it out, and either way it is worth knowing.
- Compare readings with the window in and out on a reference source at each cleaning, and record the transmission found.
- Watch for steam and sprays near the measuring point after any change to the press or its coolant.
- Where two instruments measure the same target, alarm on their disagreement, because the two respond differently to path losses.

None of these needs a new instrument. Each turns an invisible error into a number on a log sheet.

## The error: a window that fogged over three weeks

This is an illustration. IH-40's protective window had been cleaned at each planned stop, every second week. After a coolant change on the press, the forge began to see a fine oil mist in the area, and over the next three weeks the window acquired a thin film that, combined with scale dust, reduced its transmission from **93.4% to about 75%**. Nobody noticed: the window looked only slightly dull from the outside.

The heater's control loop held the pyrometer's reading at 1,200 °C throughout. As the window's transmission fell, the reading for a given billet temperature fell with it, and the controller raised the coil's power to compensate. At 75%, holding a reading of 1,200 °C meant billets at about **1,234 °C**, 34 K hot and outside the band, with the diverter passing them all because it was sorting on the same faulty reading. The press operators again reported soft, overheated billets.

Two things found it. The ratio pyrometer, by then installed beside the single-wavelength instrument (Chapter 4), read about 1,234 °C and was unaffected by the grey film, so the disagreement alarm between the two instruments tripped once the difference passed 15 K. And the ratio instrument's signal strength had fallen to about 80% of its normal value over the three weeks, a slow trend that, looked at afterwards, gave plenty of warning.

The forge cleaned the window, found the transmission back at its clean value, and changed its practice: the window is now cleaned whenever the ratio instrument's signal strength falls below 90% of its clean value, and the oil mist was dealt with at its source on the press.

```figure
type: line
title: IH-40's true billet temperature while the controller holds a reading of 1,200 °C
x: Window transmission, % (transmission setting 93.4%)
y: True billet temperature, °C
legend: Single-wavelength 1.0 µm, closed loop
ymin: 1195
ymax: 1240
caption: This is an illustration from the measurement equation. A dirty window looks to the instrument like a cooler billet, so the control loop heats the billets more.
- 93.4 | 1200.0
- 85 | 1214.4
- 80 | 1223.7
- 75 | 1233.9
```

## Exercise: correcting for a hot background

At a second measuring point, near the press, IH-40's scaled billet (ε = 0.85, setting 0.85, no window) is seen against reflected radiation from a die heater at about 1,000 °C that fills its whole reflected view. The pyrometer reads 1,215 °C. What is the billet's true temperature?

**Worked answer.** The measured radiance is S = 0.85 × L(T) + 0.15 × L(1,273.15 K), and the instrument reports T_indicated from S = 0.85 × L(T_indicated) with T_indicated = 1,488.15 K. So:

L(T) = [0.85 × L(1,488.15 K) − 0.15 × L(1,273.15 K)] ÷ 0.85

At 1.0 µm, L(1,273.15 K) is about 19.5% of L(1,488.15 K), so the reflected part is about 0.15 × 0.195 ÷ 0.85 ≈ 3.4% of the signal. Solving with the full Planck law gives T = **1,209.6 °C**: the reflection added about 5.4 K. Moving the measuring point so that the billet reflects a cold guard instead of the die heater removes the correction altogether, and is the better fix.
