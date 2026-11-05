---
book: shaft-alignment-by-the-numbers
chapterSlug: thermal-growth
order: 8
title: "Thermal growth and cold targets"
description: "How machines grow as they warm, how to estimate each machine's vertical growth from its centreline height and support temperature, and how to set a cold target that is true hot."
draft: false
---

The HW-3 is aligned cold, on a still morning, with the pump room at 20 °C. It runs with water at 85 °C passing through the pump. The pump's casing and feet warm, the steel between its feet and its shaft expands, and the shaft rises. The motor warms too, but less. An alignment that is perfect cold is wrong hot, by the difference between the two machines' growth. Since bearings and seals spend their lives hot, it is the hot alignment that matters.

This chapter estimates the HW-3's thermal growth with the BIZOMAT thermal growth tool, turns it into a cold target, and covers how to check the result with the machines running. Its mistake is the easiest one in alignment to make: setting the target the wrong way.

## Why machines grow

Steel expands about 11 to 12 µm per metre for each kelvin of temperature rise. A machine's shaft centreline sits on a column of metal, the casing or frame, standing on its feet. When that column warms, it gets taller, and the shaft rises by its height times the expansion coefficient times its temperature rise.

```figure
type: formula
title: Vertical thermal growth of a machine
formula: growth = α × H × ΔT
formula: cold offset of the movable machine = its growth − stationary machine's growth
caption: H is the height from the feet to the shaft centreline and ΔT the average temperature rise of the supporting metal between them, not of the fluid. A positive cold offset means the movable machine grows more and must be set lower when cold; a negative one means it grows less and must be set higher.
- α | expansion coefficient of the casing or frame: about 11 µm/(m·K) for cast iron and steel
- H | foot to shaft centreline height, mm
- ΔT | temperature rise of the supports from alignment to running, K
```

The formula is simple; the hard part is ΔT. The temperature of the metal between feet and shaft depends on the fluid temperature, the casing design, insulation, the room and the bearing temperatures, and it is rarely uniform. The best values come from measurement on the same machine or a similar one in service.

## The HW-3's growth

For the HW-3, the pump is the stationary machine. Its shaft centreline is 280 mm above its feet, and an infrared thermometer survey of a similar pump on the same pasteuriser loop, taken earlier in the year, found the casing feet and support pedestal running about 45 K above the room. The motor, the movable machine, has a centreline height of 250 mm, and its frame and feet ran about 25 K above the room on the same survey. Both are cast iron or steel with an expansion coefficient of 11 µm/(m·K). This is an illustration.

The [thermal growth for hot alignment tool](/tools/alignment-thermal-growth/) takes the foot-to-centreline height, expansion coefficient and support temperature rise for each machine, and returns each machine's vertical growth and the cold setting of the movable machine that gives true alignment at operating temperature.

```figure
type: steps
title: The HW-3 in the thermal growth for hot alignment tool
caption: This is an illustration. Stationary pump: H = 280 mm, α = 11 µm/(m·K), ΔT = 45 K. Movable motor: H = 250 mm, α = 11 µm/(m·K), ΔT = 25 K.
- Stationary machine growth | 138.6 µm
- Movable machine growth | 68.8 µm
- * Cold setting of the movable machine | 69.9 µm higher than stationary
```

The pump's shaft rises 0.139 mm as it warms and the motor's 0.069 mm. To meet in line when hot, the motor must start 0.070 mm higher than the pump when cold. The tool also reminds the user to verify the alignment at operating temperature where possible; that check comes later in this chapter.

```figure
type: bars
title: HW-3 vertical growth from cold to running
x: Machine
y: Growth, µm
caption: This is an illustration. The difference, 69.9 µm, is larger than the whole 50 µm running offset tolerance. Ignoring it would guarantee a running misalignment out of tolerance even with a perfect cold alignment.
- * Pump, stationary | 138.6
- Motor, movable | 68.8
- Difference | 69.9
```

### Cold targets

The cold target is the alignment the fitter aims for on the day: not zero, but the misalignment that thermal growth will remove. For the HW-3 in the vertical plane, the target is the motor shaft 0.070 mm higher than the pump shaft, parallel to it. Both machines' feet grow by the same amount front and back, under the tool's assumption of uniform support temperature, so the target has no angle.

In the language of the rim and face tool of Chapter 6, the motor should be "low" by −0.070 mm at the coupling: the correction to apply is the correction to bring the shafts into line, plus 0.070 mm more lift at every foot. Chapter 9's alignment plan tool combines the two automatically.

Horizontal growth is usually small for foot-mounted machines whose feet are symmetric about the shaft, because the two sides grow equally. The tool's limitations note that it covers vertical growth only and that horizontal growth "is usually small but not always". Machines with one side hotter than the other, such as a pump with its discharge on one side near a hot wall, can grow sideways and need their own estimate.

Laser systems accept the same targets, usually as offsets and angles entered before the measurement, and then display the remaining correction relative to the target rather than to zero. Whichever instrument is used, the sheet should show the target, the as-left readings and the difference between them, so that a reviewer can see that the target was applied and in which direction.

## The mistake: a target set the wrong way

The HW-3's first alignment plan, drafted by a contractor, set the motor 0.070 mm low when cold, not high. The reasoning was "the pump grows, so leave room for it": the pump would rise to meet the motor. That reasoning is right about the pump and wrong about the conclusion. If the pump rises 0.139 mm and the motor 0.069 mm, a motor set 0.070 mm low ends up 0.070 + 0.070 = 0.140 mm low when hot, nearly three times the tolerance.

```figure
type: compare
title: HW-3 running offset for three cold settings
cols: Cold offset of the motor, mm | Hot offset of the motor, mm | Against 0.05 mm
rowhead: Cold setting
- Zero, no allowance | 0 | 0.070 low | fail
- * 0.070 mm high, as calculated | 0.070 high | 0 | pass
- 0.070 mm low, the contractor's draft | 0.070 low | 0.140 low | fail
caption: This is an illustration. Hot offset = cold offset plus the growth difference: the pump rises 0.070 mm more than the motor.
```

A one-line sketch catches this error every time: draw the two shafts hot and in line, then lower each by its own growth to find where it sits cold. The pump drops 0.139 mm and the motor 0.069 mm, so cold, the motor is the higher of the two. The site's alignment sheet now has a box for that sketch beside the thermal targets.

## Where ΔT comes from

The tool's answer is only as good as the temperature rises fed into it. Several sources are available, roughly in order of preference.

1. **Measurement on the machine itself in service**, at the feet, at mid-height of the casing or pedestal and near the bearings, with a contact thermometer or an infrared thermometer, once the machine has reached steady temperature. Infrared readings on bare, painted cast iron are usually adequate; on bright metal they need care with emissivity.
2. **Measurement on a similar machine** in a similar service, as for the HW-3.
3. **The machine maker's recommendation**, which many pump and compressor makers give as cold offsets for their machines in typical services.
4. **An estimate**, for example a fraction of the difference between fluid and room temperature for a pump's casing, used only when nothing better exists and confirmed later.

Taking the average of the temperature at the feet and near the shaft, rather than the hottest reading, gives a better estimate of the average growth of the supporting metal.

### The HW-3 survey

The survey on the similar pump set took three readings on each machine with an infrared thermometer after two hours at steady load, with the room at 20 °C.

```figure
type: compare
title: Infrared survey of a similar pump set at steady temperature
cols: Feet, °C | Mid-height of casing or frame, °C | Near the bearings, °C | Average, °C | Rise above the 20 °C room, K
rowhead: Machine
- * Pump | 62 | 66 | 67 | 65 | 45
- Motor | 42 | 46 | 47 | 45 | 25
caption: This is an illustration. Readings on painted cast iron, emissivity set for painted metal. The averages are the ΔT values entered in the tool.
```

The pump's readings rise from its feet to its bearings because heat flows from the hot water in the casing down through the pedestal to the base. The motor's come from its own losses, which warm its frame fairly evenly. Averaging the three readings is a reasonable estimate of the mean temperature of the metal that sets the growth; a more careful survey would take readings at several heights and weight them by the height each represents.

## The temperature on the day of alignment

The growth that matters is from the temperature at which the alignment is done to the running temperature, not from some standard temperature. The HW-3 was aligned with the room at 20 °C, the same as the survey. Had it been aligned on a summer afternoon with the room at 32 °C and the idle machines at that temperature, the rises to the same running temperatures would have been 33 K for the pump and 13 K for the motor, giving growths of 0.102 mm and 0.036 mm and a cold offset of 0.066 mm instead of 0.070 mm. The difference is small here, because both machines' rises fall by the same amount, but for machines with very different heights it can matter. The alignment sheet therefore records the room and machine temperatures at the time of alignment, and the targets are worked from them.

## Uneven growth and angle

The tool assumes each machine's supports warm uniformly, so its growth is the same at the front and back feet and adds no angle. Real machines are rarely that even. A motor's drive-end bearing often runs warmer than its fan end, and a pump's casing end warmer than its bearing frame. If, for illustration, the HW-3 motor's front feet ran 30 K above the room and its back feet 20 K, its front would rise 0.0825 mm and its back 0.0550 mm, tilting its shaft by (0.0550 − 0.0825) ÷ 349 × 100 = −0.008 mm per 100 mm. That is a sixth of the angularity tolerance: small enough to ignore for the HW-3, but worth calculating for long machines or large temperature differences, where it can be the largest term. This is an illustration.

## Checking the running alignment

A calculated cold target is a prediction, and the best practice is to check it. Several methods exist.

- **Hot check after shutdown.** The machines run until they reach steady temperature, are stopped and isolated, and readings are taken within a few minutes, before they cool much. It is quick, but the machines start cooling at once, and running forces such as pipe loads at pressure disappear when the pump stops.
- **Continuous measurement while running.** Laser or proximity probe systems mounted on brackets fixed to the bearing housings and to a stable reference measure the machines' movement from cold to hot. They show the real growth, including pipe and running forces.
- **Indirect evidence.** Vibration at running speed and twice running speed, and bearing temperatures, before and after the alignment, show whether the running alignment improved, though not by how much.

The HW-3 site used the first method at commissioning. After two hours at temperature, the set was stopped and isolated and readings were taken within five minutes. They showed a vertical running offset of 0.02 mm, within the 0.05 mm tolerance, confirming the 0.070 mm cold target to within about 0.02 mm. This is an illustration.

```figure
type: checklist
title: Thermal growth on the HW-3 alignment sheet
caption: The site's record for each alignment. This is an illustration.
- x Stationary and movable machine identified
- x Foot to centreline heights, measured, not taken from a catalogue
- x Support temperature rises, with their source: measured, similar machine, maker or estimate
- x Each machine's growth and the cold offset, with a sketch showing which machine sits higher cold
- x Cold target used for the moves, vertical and, where needed, horizontal
- ? Hot check at commissioning: method, time after shutdown and result
```

## Machines that shrink

Not every machine grows. A pump handling chilled water, brine or a refrigerant runs colder than its room, and its supports shrink: its shaft drops when it starts. The same formula applies with a negative temperature rise. A chilled-water pump with a 280 mm centreline height whose supports run 10 K below the room would drop 11 × 10⁻⁶ × 280 × 10 = 0.031 mm, while its motor, warming 25 K, would rise 0.069 mm. The motor grows more by 0.100 mm, so it would be set 0.100 mm lower than the pump cold. This is an illustration. The thermal growth tool accepts a negative temperature rise for that case, and the sketch rule still works: draw the shafts in line at running temperature and move each by its own growth, up or down, to find the cold positions.

Large differences of this kind are one reason makers of refrigeration compressors and cryogenic pumps publish alignment offsets for their machines, and why their installation instructions should always be read before a generic calculation is used.

## Other things that move when hot

Thermal growth of the casings is the main effect, but not the only one. The baseplate under both machines warms, but because it is common to both, its growth mostly cancels unless one end is much hotter. Pipes grow and push (Chapter 4), and their effect appears only when hot. Oil-lubricated bearings lift their shafts on an oil film when running, by a few hundredths of a millimetre in large sleeve bearings. Sun on one side of an outdoor machine makes that side grow. For the HW-3, indoors and on rolling bearings, the casing growth dominates; for large turbomachinery, all of these are measured.

The physics of expansion and restraint, and how to measure at the right temperature, are covered more fully in [Thermal Expansion by the Numbers](/reados/publications/thermal-expansion-by-the-numbers/designing-machines-for-movement/).

## Exercise: a hotter pump

On a second loop, the same model of pump handles water at 95 °C, and the survey found its supports running 55 K above the room, while its motor still ran 25 K above. With the same heights and coefficients, find each machine's growth and the cold setting. If the fitter used the HW-3's 0.070 mm target by mistake, what would the running offset be?

**Worked answer.** The pump grows 11 × 10⁻⁶ × 280 × 55 = 0.1694 mm and the motor, as before, 0.0688 mm. The motor grows less by 0.1007 mm, so the cold setting is the motor 0.101 mm higher than the pump.

With the HW-3's target, the motor would be set 0.070 mm high cold. When hot, the pump rises 0.1007 mm more than the motor, so the motor ends 0.1007 − 0.070 = 0.031 mm low: inside the 0.05 mm tolerance, but using more than half of it for no reason. Each loop needs its own temperatures. This is an illustration.
