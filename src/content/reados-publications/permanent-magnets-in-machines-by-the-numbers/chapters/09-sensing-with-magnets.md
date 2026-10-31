---
book: permanent-magnets-in-machines-by-the-numbers
chapterSlug: sensing-with-magnets
order: 9
title: "Sensing with magnets"
description: "Reed, Hall-effect and magnetoresistive sensors, the dipole field and its fall with distance, switching bands from datasheet thresholds, temperature, stray fields, and interlocks that resist defeat."
draft: false
---

A magnet and a sensor together make a contactless switch: no wear, no exposed contacts, and tolerance of washdown, dust and vibration. That is why magnetic sensors are everywhere on a packaging line, detecting cylinder positions, door positions, shaft rotation and the arrival of moving parts. Their reliability rests on one number, the flux density at the sensor, and on how that number changes with distance, temperature, tolerance and stray fields. A sensor that switches reliably on the bench can fail to switch, or switch when it should not, in the machine.

This chapter describes the main sensor types, gives the field of a small magnet as a function of distance, turns datasheet thresholds into a band of switching distances, and deals with temperature and stray fields. It ends with guard interlocks, where a magnetic sensor must not only work but must also resist being defeated. The error is a guard switch defeated with a magnet.

## Sensor types

**Reed switches** are two ferromagnetic contact blades sealed in a glass tube. A field along the tube magnetises the blades so that they attract and close; when the field falls, they spring apart. They need no power, switch AC or DC directly, and are cheap, but they are mechanical and fragile, and their contacts wear with switched current. Reed switches are common on pneumatic cylinders, sensing a magnet ring on the piston through the cylinder's aluminium wall.

**Hall-effect sensors** are semiconductor devices that produce a voltage proportional to the component of field passing through them. A Hall switch adds a comparator: it turns on above an operate point, Bop, and off below a release point, Brp, a little lower, so that it does not chatter at the threshold. Linear Hall sensors give an output proportional to the field, for measuring position.

**Magnetoresistive sensors** change resistance with the direction or strength of the field. They are more sensitive than Hall sensors and are used in encoders and in sensors that must work across larger gaps.

All three respond to the flux density at the sensor, along a particular direction. Their datasheets give thresholds as ranges, because devices vary: a Hall switch might be specified with an operate point anywhere from 3 to 8 mT across production and temperature, and a release point somewhat lower.

## The field of a small magnet

Far from a small magnet, compared with its size, its field is the field of a magnetic dipole. Its magnetic moment is its remanence times its volume divided by μ₀, and on its axis the flux density falls as the inverse cube of distance.

```figure
type: formula
title: Field on the axis of a small magnet, far from it
formula: Magnetic moment m = Br × V ÷ μ₀
formula: On the axis: B = μ₀ × m ÷ (2π × r³)
formula: Distance for a given field: r = ∛(μ₀ × m ÷ (2π × B))
caption: The dipole approximation is good when the distance is several times the magnet's size, and only approximate closer in. For design close to the magnet, use the maker's field data or a field calculation for the real shape.
- Br, V | magnet remanence and volume
- r | distance from the magnet's centre along its axis
- B | flux density at the sensor
```

The inverse cube is the key to everything that follows. Doubling the distance divides the field by eight, and a 10% change in distance changes the field by about 30%. Magnetic sensing is therefore very sensitive to the gap, and tolerances on the gap matter far more than tolerances on the magnet.

This is an illustration. The hopper lid on Line 4 carries a sensor magnet, an NdFeB disc 10 mm in diameter and 5 mm thick, magnetised through its thickness, with Br = 1.28 T. Its moment is 1.28 × (π × 0.005² × 0.005) ÷ (4π × 10⁻⁷) = 0.40 A·m². A Hall switch on the hopper's frame faces it along its axis when the lid is closed.

```figure
type: compare
title: Field on the sensor magnet's axis, dipole approximation
cols: Flux density, mT | Compared with 20 mm
rowhead: Distance from magnet centre
- 15 mm | 23.7 | 2.4 ×
- * 20 mm | 10.0 | 1 ×
- 25 mm | 5.12 | 0.51 ×
- 30 mm | 2.96 | 0.30 ×
- 35 mm | 1.87 | 0.19 ×
caption: This is an illustration. Moment 0.40 A·m². At 15 mm, 1.5 times the magnet's diameter, the dipole approximation is only roughly right.
```

## From thresholds to a switching band

The Hall switch's datasheet gives an operate point between 3 and 8 mT over its temperature range. Setting the field equal to each limit gives the distances at which a switch at that limit turns on:

r = ∛(4π × 10⁻⁷ × 0.40 ÷ (2π × 0.008)) = 21.5 mm for the least sensitive switch, and
r = ∛(4π × 10⁻⁷ × 0.40 ÷ (2π × 0.003)) = 29.9 mm for the most sensitive.

```figure
type: range
title: Where the hopper lid sensor switches on, as the lid closes
unit: mm
min: 10
max: 45
ticks: 15 | 21.5 | 29.9 | 40
caption: This is an illustration. Dipole approximation, moment 0.40 A·m², operate point 3 to 8 mT. A switch at the least sensitive limit turns on only when the magnet is within 21.5 mm; one at the most sensitive limit, at 29.9 mm.
- * Guaranteed on | 10 | 21.5 | every switch has turned on at this distance or closer
- Uncertain | 21.5 | 29.9 | some switches on, some off, depending on the individual device
- Off for every switch on approach | 29.9 | 45 | beyond the most sensitive switch's operate distance
```

The design rule follows. The closed position must put the magnet comfortably inside the guaranteed band, so that every switch turns on with margin for gap tolerances, magnet tolerance and temperature; and the open position must put it well beyond the point where the least sensitive switch releases, with its release point considered. For the hopper lid, the plant set the closed gap at 15 mm, where the field is 23.7 mT, three times the highest operate point, and the lid's first opening movement takes the magnet beyond 45 mm.

### Release and hysteresis

The release point matters as much as the operate point. A Hall switch turns off when the field falls below its release point, which is lower than its operate point by its hysteresis. As the lid opens, a switch at the low end of the release range stays on until the magnet is further away than it was when the switch turned on. The open position must take the magnet beyond the release distance of the most sensitive switch, not merely beyond the operate distance of the least sensitive one. Datasheets give both points as ranges, and the release distance is found from the lowest release point in the same way as the operate distances above. For the hopper lid's switch, whose release point may be as low as 1 mT, that distance is ∛(4π × 10⁻⁷ × 0.40 ÷ (2π × 0.001)) = 43.1 mm, which is why the lid's first opening movement must take the magnet beyond 45 mm.

### Temperature

Both the magnet and the switch change with temperature. The magnet's moment falls with its remanence: at 60 °C, an NdFeB magnet's moment is about 1 − 0.0011 × 40 = 95.6% of its 20 °C value, which moves the operate distances inwards by only about 1.5%, because distance goes as the cube root of the moment. Hall switch thresholds drift with temperature too, and datasheets include that in their ranges. The cube root works in the designer's favour here: modest changes in the field produce small changes in distance. The margin at the closed position should still be checked at the hottest and coldest conditions.

### Stray fields

A sensor cannot tell its own magnet's field from any other. Other magnets nearby, magnetised steel parts, and current-carrying cables all produce fields. A long straight cable carrying current I produces B = μ₀I ÷ (2πr) at distance r: a 100 A cable 50 mm away produces 0.4 mT, and a 300 A welding cable at the same distance 1.2 mT. Neither would switch the hopper lid's sensor on its own, but either adds to or subtracts from the magnet's field, and a sensor designed with little margin can be pushed over its threshold. Sensors should be kept away from large conductors and other magnets, and their margins checked with the machine running.

## Cylinder position sensors

Pneumatic cylinders with a magnet ring on the piston, and reed or Hall sensors clamped in a slot on the barrel, are the commonest magnetic sensors on Line 4. *Pneumatics by the Numbers* covers the cylinders themselves; three points about their sensors follow from this chapter.

First, the sensor sees the piston magnet's field through the barrel wall, which must be non-magnetic, usually aluminium. A steel barrel, or a steel mounting bracket close to the sensor, diverts the field and can stop the sensor switching. Second, the sensor is on when the piston magnet is within a zone of the stroke, not at a point. The zone's length depends on the magnet, the barrel and the sensor's threshold, and is typically several millimetres to a centimetre or so. Third, a sensor in the middle of a stroke is passed at speed, and its on-time is the zone length divided by the piston speed.

This is an illustration. A cylinder on the bagger's carton erector has a mid-stroke sensor with an on-zone of about 8 mm, and its piston passes at about 1 m/s. The sensor is on for about 8 ms. The controller's input has a filter of 10 ms to reject electrical noise, so the input never registers the pulse, and the sequence waits for a signal that has already gone. Shortening the input filter for that channel, or using the sensor to start a timer only at the end of stroke, solves it. The calculation takes seconds once the zone and speed are known, and the symptom, an intermittent sequence fault, can take days to diagnose without it.

## Speed and rotation

Magnets also count. A ring magnet with alternating poles round its edge, or a steel gear passing a sensor that contains its own small magnet, produces pulses as the shaft turns, which the controller turns into speed and position. The same rules apply: the gap between ring or gear and sensor sets the field, the field falls steeply with gap, and too large a gap causes missing pulses at some positions or temperatures. A useful check on any rotating magnetic sensor is to log its pulses over many revolutions and confirm that none are missing or extra, because a sensor at the edge of its margin fails intermittently, not completely.

## Guard interlocks

Many guards on Line 4 are interlocked: opening the guard stops the hazardous motion behind it. A magnetic switch is attractive for this, because it is sealed, tolerant of misalignment and easy to clean. A simple magnetic switch has a serious weakness: any magnet of suitable strength held near it makes it believe the guard is closed. Operators who find a guard's interlock inconvenient, for example because they must clear frequent jams, can defeat it with a magnet from a whiteboard or a sensor from stores.

ISO 14119:2024 sets out principles for the design and selection of interlocking devices associated with guards, including measures to reduce the likelihood of foreseeable defeat. Coded magnetic switches use an actuator with several magnets in a particular arrangement, or combine magnets with other coding, so that a single magnet cannot operate them; RFID-coded non-contact switches go further, recognising a specific actuator. Under the model WHS laws, Safe Work Australia's model Code of Practice on managing the risks of plant explains the duty to provide and maintain guarding and interlocks, and the selection of the interlock and the safety-related control system around it is work for competent people.

The deeper control is the reason for defeat. An interlock that is regularly defeated is telling the plant that the task behind the guard is frequent enough to need a safe way of doing it, such as a jam-clearing procedure, a reduced-speed mode or a redesigned infeed.

## The error: a defeated guard switch

This is an illustration. During a safety walk, a supervisor found a small block magnet taped to the frame beside the bagger's film-change guard, next to the guard's non-coded magnetic interlock switch. With the magnet there, the switch read "closed" whether the guard was open or not, and the bagger's jaws could run with the guard open.

The investigation found that operators had been clearing film jams several times a shift, and that restarting the bagger after each guard opening took several minutes of re-threading and resetting. Someone had found that the magnet saved that time. No one had been injured.

The magnet was removed and the bagger stopped until the guard's switch was replaced with an RFID-coded non-contact interlock, assessed as part of the guard's safety function. Maintenance traced the jams to a worn film guide and replaced it; jams fell to fewer than one a week. The plant also wrote a jam-clearing procedure for the bagger, and its safety walks now include a check of every interlock for defeat.

## Exercise: a smaller magnet

This is an illustration. A redesign of the lid uses a 6 × 3 mm NdFeB disc, Br 1.28 T, with the same Hall switch, operate point 3 to 8 mT.

1. What is the smaller magnet's moment?
2. Between what distances does the switching band now lie?
3. What closed gap would give three times the highest operate point, as before?

**Worked answer.**

1. m = 1.28 × (π × 0.003² × 0.003) ÷ (4π × 10⁻⁷) = **0.0864 A·m²**.
2. At 8 mT, r = ∛(4π × 10⁻⁷ × 0.0864 ÷ (2π × 0.008)) = **12.9 mm**; at 3 mT, **17.9 mm**.
3. Three times 8 mT is 24 mT: r = ∛(4π × 10⁻⁷ × 0.0864 ÷ (2π × 0.024)) = **9.0 mm**. At that distance, three times the magnet's diameter, the dipole approximation is still reasonable, but the tighter gap makes tolerances matter more: the lid's hinge and seal must hold the closed gap within about a millimetre.
