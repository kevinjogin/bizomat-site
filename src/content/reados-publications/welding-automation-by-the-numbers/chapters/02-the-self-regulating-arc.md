---
book: welding-automation-by-the-numbers
chapterSlug: the-self-regulating-arc
order: 2
title: "The self-regulating arc and wire feed"
description: "See how wire fed at a constant speed into a constant-voltage arc keeps its own length steady, calculate deposition from wire feed speed, and see why stick-out and torch angle matter to a machine."
draft: false
---

Every automated arc welding process rests on one piece of physics: an arc fed with wire at a steady speed can keep itself the right length. Without it, a machine would need to measure the arc and move the wire in and out continuously to stop it shorting or going out, which early machines found very hard. With it, the wire feeder only has to push wire at a set speed, and the arc does the rest. Harry D. Morton, an early inventor of automatic arc welding machines, described the effect in 1919 in words Hornor quoted the next year: when the arc shortens, its resistance falls and the current rises, so the wire melts faster than it is fed and the arc lengthens again; when the arc lengthens, the opposite happens. Morton also saw its limits, and built controls to extend them.

This chapter explains the self-regulating arc and the power sources that make it work, calculates deposition from wire feed speed, shows how stick-out changes the current, and looks at why the small variations a hand absorbs, in angle and distance, matter so much more when a machine holds the torch.

## Burn-off and feed

In gas metal arc and flux-cored welding, a wire is fed continuously through the torch into the arc, where it melts. Two rates must balance: the rate at which the feeder pushes wire in, and the rate at which the arc melts it off, the burn-off rate. If feed exceeds burn-off, the wire pushes into the pool and shorts the arc; if burn-off exceeds feed, the arc climbs up the wire towards the contact tip and goes out or burns the tip. A steady arc is a balance between the two.

The burn-off rate depends mainly on the current: more current melts more wire. So keeping the arc steady means keeping the current matched to the feed. Morton's insight was that, with the right power source, the arc matches the current to the feed by itself.

## How the arc regulates itself

A constant-voltage power source, the usual source for wire welding, holds its output voltage nearly steady and lets the current vary with whatever the arc demands. The arc's voltage rises with its length. So when the arc shortens, the power source, trying to hold its voltage, drives more current through the shorter, lower-voltage arc; the extra current melts the wire faster, and the arc grows back. When the arc lengthens, the current falls, the wire melts more slowly, and the feed pushes it back down.

```figure
type: steps
title: The self-regulating loop of a constant-voltage wire arc
caption: General description for teaching. The loop acts within fractions of a second and keeps the arc length steady against small disturbances; large disturbances can exceed its range.
- Disturbance | the torch moves closer to the work, or the work surface rises
- Arc shortens | arc voltage falls below the power source's set voltage
- *Current rises | the constant-voltage source drives more current
- Burn-off rises | the wire melts faster than it is fed
- Arc lengthens | until burn-off again equals feed, at nearly the original length
```

Morton described the same loop in terms of the arc's resistance, and noted that it worked only within narrow limits on the early machines, so that variations in the work's contour or in the wire's properties could still make the wire stick to the work or the arc break. Morton's answer was a control that varied the relation between the arc's energy and the feed rate, governed by what Morton called a dominant characteristic of the arc, which widened the range of self-correction. Modern constant-voltage inverters, with fast electronic control of the current's response, make the loop strong and quick enough that the wire feeder can simply run at a set speed, which is why the semi-automatic torch, the mechanised carriage and the robot all use the same arrangement.

## Wire feed speed sets the deposition

Because the arc melts wire as fast as it is fed, the wire feed speed sets the deposition rate directly. The current follows from the feed speed and the wire size; the welder or programmer sets the feed and the voltage, and the current takes care of itself.

```figure
type: formula
title: Deposition rate from wire feed speed
formula: deposition rate = wire feed speed × wire cross-section × density × deposition efficiency
caption: This is an illustration for 1.2 mm solid steel wire at 8 m/min, with a deposition efficiency of about 95% for spatter losses. Flux-cored wires have a lower metal content per unit length and their own efficiencies, from the maker's data.
- Wire | 1.2 mm diameter, cross-section π ÷ 4 × 1.2² ≈ 1.13 mm²
- Feed | 8 m/min, 8,000 mm/min
- Density | 7.85 g/cm³
step: wire melted = 8,000 × 1.13 ≈ 9,050 mm³/min, about 71 g/min
step: about 4.3 kg/h of wire melted
step: at 95% efficiency, about 4.0 kg/h deposited
```

```figure
type: bars
title: Illustrative deposition of solid steel wire by size and feed speed
unit: kg per hour of arc time, at 95% deposition efficiency
max: 6
caption: This is an illustration calculated from the formula above. The current needed at each feed speed depends on the wire, the gas and the stick-out, and comes from the maker's data or trials.
- 0.9 mm at 6 m/min | 1.7
- 1.2 mm at 6 m/min | 3.0
- *1.2 mm at 8 m/min | 4.0
- 1.2 mm at 10 m/min | 5.1
- 1.6 mm at 6 m/min | 5.4
```

The calculation turns a weld's metal into an arc time. A 6 mm fillet weld holds roughly 150 to 160 g of weld metal per metre including a little reinforcement; at 4 kg/h, a metre takes about 2.3 minutes of arc time. A machine programmed with the feed speed and the travel speed lays the same weld metal per metre every time, which is where automation's consistency begins. The [BIZOMAT fillet weld quantity calculator](/tools/fillet-weld-quantity/) works out weld metal for fillet welds.

## Constant current and voltage sensing

Some processes and older machines use a constant-current power source, which holds the current steady and lets the voltage vary with arc length. With a constant-current source, the arc does not regulate itself through current; instead, the wire feeder must speed up or slow down as the arc voltage changes, feeding faster when the arc lengthens and slower when it shortens. This voltage-sensing feed is used for some submerged arc welding with large wires and for some field equipment. Morton's controls were an early form of it. The choice matters for automation, because a voltage-sensing system is only as good as its feeder's response, while a constant-voltage system corrects itself.

## Stick-out and current

The distance from the contact tip, where the current enters the wire, to the arc is the stick-out or electrode extension. The current flows through that length of wire before it reaches the arc, and the wire's resistance heats it, so a longer stick-out preheats the wire more. Preheated wire melts with less arc current, so at a given feed speed, a longer stick-out lowers the current, and a shorter one raises it. The change can be large: a few millimetres more stick-out can drop the current by tens of amps, reducing penetration noticeably even though the deposition stays the same.

A welder's hand varies the stick-out constantly and the welder compensates without thinking, moving in when the puddle looks cold. A machine holds whatever stick-out it was given. If the part is not where the program expects, so that the torch is a few millimetres further from the joint, the current falls and the weld penetrates less, with no visible sign at the cap. That is why automated welding needs parts in the right place, as Chapter 4 explains, or sensors that measure the distance and correct it, as Chapter 7 describes.

## Angle and aim

Morton noticed that the angle of the electrode to the work mattered greatly, reporting that a change of five degrees could sometimes decide between success and failure, that about fifteen degrees from the perpendicular worked well in many cases, and that for some materials the electrode should drag, pointing back towards the completed weld. Modern welding engineers would recognise every point. The torch's travel angle, push or drag, changes the penetration and bead shape; its work angle, between the plates of a fillet, decides how the weld is shared between them; and its aim, the point on the joint where the wire is directed, decides whether both plates are fused. A machine holds all three exactly, which is a strength when they are right and a weakness when the part moves.

## Shorter arcs

Morton also reported that the machines could hold continuous, good welds with arcs much shorter than a manual welder could maintain. A short arc concentrates the heat, gives a narrower, deeper weld and less spatter, and allows higher speeds. A hand cannot hold a very short arc steadily, because every tremor would short it out; a machine, with the arc regulating itself, can. Modern controlled short-circuit and pulsed processes take the idea further, with power sources that shape the current through each drop of metal transferred.

## Pulsed and shaped currents

Modern inverter power sources do not just hold a voltage; many shape the current through every fraction of a second. In pulsed welding, the current switches between a low background and a high peak many times a second, each peak detaching one drop of metal from the wire, so that the average current can be lower than a steady spray arc would need while still transferring metal smoothly. In controlled short-circuit processes, the power source senses each short circuit as a drop touches the pool and cuts the current at exactly the right moment, so that the drop transfers without spatter. Both rely on fast electronic control, and both suit automation, because the machine sets the waveform and repeats it exactly. Their settings are usually chosen as a programme from the power source's library, matched to the wire and gas, with the feed speed as the main adjustment, which the power source turns into a matching set of pulse or current values.

## Wire feeding as a machine problem

The self-regulating arc works only if the wire is fed at a steady speed, so the wire feeder and the path from spool to tip become critical parts of the machine. Kinks in the liner, worn drive rolls, a tight spool brake or a long, coiled cable all make the feed jerky, and every jerk upsets the arc. Robot cells keep the wire path short and smooth, often feeding from a large drum through a conduit with gentle bends, and replace contact tips and liners on a schedule rather than waiting for problems. Morton remarked that the machines welded well even with rusty, dirty or seamed wire, which was remarkable at the time; modern automated welding usually expects clean, consistent wire, because the machine is set up to run for hours without a person watching each weld.

## Arc starts and ends

The self-regulating loop governs the arc once it is burning; starting and stopping it are separate problems that automation must handle. A wire arc starts when the wire touches the work and the current melts it through, and a poor start, with the wire stubbing into the plate or a burst of spatter, leaves a cold, lumpy beginning to the weld. Automated systems control the start with a slow run-in of the wire, a brief higher current to establish the arc, and sometimes a short pause before travel begins. At the end, a crater-fill routine reduces the feed and current gradually while the torch dwells, so that the weld does not end in a cracked crater, and a burn-back routine leaves the wire clear of the pool. These start and end settings are part of the program and are trialled as carefully as the main parameters.

## Parameters as numbers

Because the arc settles to a predictable current for each wire size, feed speed, voltage and stick-out, an automated weld can be specified entirely by numbers: wire, gas, feed speed, voltage, stick-out, travel speed, torch angles and aim. The welding procedure records them, and the machine repeats them. That is a profound change from manual welding, where the procedure gives ranges and the welder's hand decides within them. It also means that the numbers must be right: a robot program with the wrong feed speed makes every weld wrong.

## The running case: setting the bracket welds

This is an illustration. The fabricator's welding engineer trialled the bracket welds on a borrowed robot before buying one. Most brackets needed 5 mm fillets. With 1.2 mm wire, the trials settled on a feed speed of about 9 m/min at a stick-out of 15 mm and a travel speed of about 700 mm per minute, giving a consistent 5 mm fillet with good root penetration on macro sections. Shortening the stick-out to 12 mm raised the current noticeably and deepened the penetration; lengthening it to 20 mm made the welds shallower. The engineer recorded the parameters and the macro results, and specified a contact tip to work distance tolerance for the fixtures as a result.

## A failure: the worn liner

This is an illustration. A mechanised carriage welding long seams on trailer rails began producing irregular welds, with patches of spatter and cold lap every half metre or so. The parameters had not changed. The cause was a worn liner in the torch cable, which made the wire feed jerk; each jerk shortened or lengthened the arc beyond the range the arc could correct, and the weld suffered.

A new liner cured it. The shop now changes liners and drive rolls on its mechanised and robotic equipment on a fixed schedule based on wire used, and checks wire feed speed with a tachometer at each change.

## Exercise: feed speed for a fillet

A robot is to weld 5 mm fillets holding about 110 g of weld metal per metre, using 1.2 mm solid wire at 95% deposition efficiency. At a travel speed of 0.45 m/min, what deposition rate is needed, and what wire feed speed gives it? How long does a 600 mm weld take?

At 0.45 m/min, the weld needs 110 × 0.45 ≈ 49.5 g of weld metal per minute, about **3.0 kg/h**.

The wire melted must be 49.5 ÷ 0.95 ≈ 52.1 g/min, which is 52.1 ÷ (7.85 × 10⁻³) ≈ 6,640 mm³/min, or 6,640 ÷ 1.13 ≈ 5,900 mm/min, a wire feed speed of about **5.9 m/min**. A 600 mm weld takes 0.6 ÷ 0.45 ≈ **1.33 minutes**, about 80 seconds of arc time. The trial's higher feed speed of 9 m/min would need a faster travel, about 0.69 m/min, to lay the same fillet, and the procedure trials decide which combination gives the right penetration.
