---
book: arc-welding-by-the-numbers
chapterSlug: power-sources-and-their-characteristics
order: 2
title: "Power sources and their characteristics"
description: "See why a welding arc needs a drooping or a flat power source, calculate how much power the 1921 resistor sets wasted, and compare them with a modern inverter."
draft: false
---

An arc cannot simply be connected to a constant-voltage supply. Its resistance falls as its current rises, so on a stiff supply the current would run away until something burnt out. Every welding power source therefore shapes the relationship between voltage and current to keep the arc stable, and the shape it chooses decides how the arc behaves when the welder's hand moves. The history of how that shaping was done, from resistors in 1921 to electronic inverters today, is also a history of wasted energy.

This chapter explains the two main characteristics, constant current and constant voltage, works through Wanamaker and Pennington's 1921 calculation of resistor losses, and compares their systems with the inverter the conveyor shop uses.

## Why an arc needs a shaped supply

Wanamaker and Pennington set out the problem in 1921: the arc's resistance decreases as its current increases, and vice versa, so to overcome this inherent instability a welding arc must be connected to a circuit whose voltage falls as current rises, a drooping characteristic. The simplest way, used from the earliest days of arc welding, was to put a resistor in series with the arc on a constant-voltage direct-current supply. The resistor's voltage drop rises with current, so the voltage left for the arc falls, and the combination is stable.

The cost of that stability is the power burnt in the resistor. The steeper the droop, the more stable the arc, and the more power wasted.

## The 1921 resistor calculation

Wanamaker and Pennington compared three systems, each delivering 200 A at 20 V, which is 4 kW, to the arc:

- a 120 V supply with a 0.50 Ω resistor;
- a 60 V supply with a 0.20 Ω resistor;
- a 40 V supply with a 0.10 Ω resistor.

In each case the resistor carries the full 200 A and drops the difference between the supply voltage and the 20 V arc. On the 120 V system, the resistor drops 100 V and dissipates 100 × 200 = 20 kW; on the 60 V system, 40 V and 8 kW; on the 40 V system, 20 V and 4 kW.

```figure
type: formula
title: Circuit efficiency of a resistor-ballast welding system
formula: efficiency = arc power ÷ (arc power + resistor loss) = V_arc ÷ V_supply
caption: Systems described by Wanamaker and Pennington in 1921, each delivering 200 A at 20 V to the arc. The resistor loss is (V_supply − V_arc) × I.
- V_arc | arc voltage, 20 V
- V_supply | supply voltage, 120, 60 or 40 V
- I | welding current, 200 A
step: 120 V: 4 kW ÷ (4 + 20) kW = 16⅔%
step: 60 V: 4 kW ÷ (4 + 8) kW = 33⅓%
step: 40 V: 4 kW ÷ (4 + 4) kW = 50%
```

Those are only the circuit efficiencies. The 60 V and 40 V supplies were themselves produced by motor-generator sets, and the authors estimated that a set suitable for a single 200 A arc would have an average commercial efficiency of about 65%. The overall efficiency of the 60 V single-arc system would then be about 0.333 × 0.65 ≈ **22%**, and of the 40 V system about 0.50 × 0.65 ≈ **32%**. Nearly four-fifths of the energy bought from the electricity supplier in the 60 V system never reached the arc.

That loss explains the 1921 deposition test in Chapter 1's exercise, where only about 54% of the supply energy reached the arc on a better, self-regulating machine of the time.

## Stability against efficiency

The authors also showed why the inefficient systems were used. The lower the supply voltage, the less resistance is needed and the less power is wasted, but the flatter the characteristic becomes, so a change in arc length changes the current more. They calculated the effect of a 5 V rise in arc voltage, from 20 to 25 V, in each system:

- 120 V system: current falls from 200 to (120 − 25) ÷ 0.50 = 190 A, a change of 10 A or 5%;
- 60 V system: current falls to (60 − 25) ÷ 0.20 = 175 A, a change of 25 A or 12.5%;
- 40 V system: current falls to (40 − 25) ÷ 0.10 = 150 A, a change of 50 A or 25%.

A welder's hand varies the arc length all the time, so the 40 V system's efficient but flat characteristic gave large, uncontrolled swings in current and heat. The 120 V system held the current steady but wasted five-sixths of its power. The 60 V system was the usual compromise.

```figure
type: compare
title: Three 1921 resistor-ballast systems delivering 200 A at 20 V
cols: 120 V system | 60 V system | 40 V system
caption: Values calculated from the systems described by Wanamaker and Pennington in 1921. Overall efficiency includes their estimate of 65% for the motor-generator set that produced the 60 V and 40 V supplies.
- Resistor | 0.50 Ω | 0.20 Ω | 0.10 Ω
- Resistor loss | 20 kW | 8 kW | 4 kW
- Circuit efficiency | 16.7% | 33.3% | 50%
- Overall efficiency with motor-generator | not given | about 22% | about 32%
- Current change for +5 V arc | −10 A (5%) | −25 A (12.5%) | −50 A (25%)
```

The way out of the dilemma, already appearing in 1921, was a generator designed to produce the drooping characteristic itself, through its field windings, with no series resistor. Wanamaker and Pennington described these self-regulating variable-voltage machines, with open-circuit voltages usually between 45 and 75 V and capacities of 150, 200 and 300 A, and noted that 200 A was needed for general work.

## Constant current and constant voltage today

Modern power sources produce their characteristic electronically, and there are two main kinds.

**Constant-current (drooping) sources** hold the current nearly steady as the arc voltage changes. They are used for manual metal arc welding and for gas tungsten arc welding, where the welder controls arc length by hand. A change in arc length changes the voltage and power but not much the current, so the heat and the rate of electrode melting stay steady. This is the modern equivalent of the 120 V resistor system's stability, without its losses.

**Constant-voltage (flat) sources** hold the voltage nearly steady and let the current change. They are used for gas metal arc welding with a continuously fed wire. If the arc gets longer, its voltage would rise, but the source holds the voltage, so the current falls; the wire then burns off more slowly, the wire feed catches up and the arc returns to its original length. If the arc gets shorter, the current rises, the wire burns off faster and the arc lengthens again. This self-regulation keeps the arc length steady without the welder's hand doing it, which is why gas metal arc welding is easier to automate and to learn.

The conveyor shop's machine is a multi-process inverter that can provide either characteristic. For the low-hydrogen electrodes it is set to constant current. If the shop moves to gas metal arc welding (Chapter 6), the same machine, with a wire feeder, will run in constant-voltage mode.

```figure
type: decision
title: Choosing the power source characteristic
question: How is arc length controlled?
caption: The welding process decides the characteristic. Using the wrong one makes the arc behave unpredictably.
- *By the welder's hand | manual metal arc, gas tungsten arc | constant current: steady current as arc length varies
- By wire burn-off | gas metal arc, flux-cored arc | constant voltage: self-regulating arc length
- By a mechanised head with arc-voltage control | some submerged arc and automated systems | either, matched to the control
```

## The modern inverter

An inverter power source rectifies the mains supply, switches it at a high frequency through a small transformer, rectifies the output and controls the result electronically. Because the transformer works at a high frequency, it is much smaller and lighter than a mains-frequency transformer for the same power, and the electronic control can shape the characteristic precisely and respond within milliseconds. There is no ballast resistor and no motor-generator.

This is an illustration. Suppose the shop's inverter has an efficiency of 85% at the conveyor-frame settings, a figure that would come from the maker's data. For the 4.42 kW arc of a 4.0 mm electrode at 170 A and 26 V, the input power is 4.42 ÷ 0.85 ≈ **5.2 kW**. A 1921 60 V resistor system with a motor-generator, at about 22% overall, would have drawn about 4.42 ÷ 0.217 ≈ **20.4 kW** for the same arc, roughly four times as much.

```figure
type: bars
title: Supply power needed for a 4.42 kW arc
unit: kW
max: 22
caption: This is an illustration. The inverter's 85% efficiency is an assumed value of the kind given in makers' data; the 1921 figure uses Wanamaker and Pennington's estimate of about 22% for a 60 V resistor system with a motor-generator.
- 1921 60 V resistor system | 20.4
- *Modern inverter at 85% | 5.2
- Arc power | 4.42
```

Energy remains a small part of welding cost, as Chapter 10 shows, but the difference affects the supply needed (Chapter 3) and the heat dumped into the workshop.

## Arc force, slope and inductance

Electronic control lets a power source do more than hold current or voltage steady. Two adjustments matter for the conveyor shop.

On constant-current machines for manual metal arc welding, an **arc force** or dig control raises the current briefly when the arc voltage falls very low, which happens when the electrode tip is about to short-circuit into the weld pool. The extra current burns the short clear and keeps the arc alive. It helps with positional welding and with electrodes whose metal transfer is prone to short-circuits, but too much makes the arc harsh and spattery. The shop's procedure records the setting used during procedure qualification, so that it is repeatable.

On constant-voltage machines for gas metal arc welding, **slope** tilts the flat characteristic slightly, and **inductance** slows the rate at which current rises during each short-circuit. Together they control how violently the wire tip separates from the pool in short-circuit transfer, and therefore spatter, bead shape and penetration. These settings make the 1921 trade-off between stability and response adjustable rather than fixed by the size of a resistor.

## Other power sources

Not every arc is powered by an inverter. Transformer-rectifier machines, with a mains-frequency transformer and a rectifier, are heavy but rugged and still common in workshops. Simple alternating-current transformer welders remain in use for light work. For site work, engine-driven generators supply the welding current directly and often provide auxiliary mains power as well; the conveyor shop uses one for repairs at quarries where no suitable supply is available. An engine drive's fuel use, noise and exhaust become part of the site's risk assessment, and its welding output must be checked against the job, because its characteristic and open-circuit voltage depend on the machine.

Each type delivers the same arc physics; what differs is efficiency, weight, control and how the characteristic is produced. The calculations in this book apply to all of them, provided the arc voltage and current are measured at the arc.

## Open-circuit voltage and shock

When the arc is not burning, the power source's output rises to its open-circuit voltage, which must be high enough to strike the arc easily. In 1921, Wanamaker and Pennington described constant-voltage systems at 60 V for machines up to 600 A and about 75 V for larger machines, and self-regulating machines at 45 to 75 V open circuit.

Open-circuit voltage is also the voltage a welder can touch between electrode and work, and on a damp day, in a confined space or on a steel structure, it can drive a dangerous current. Safe Work Australia's model code of practice on welding processes notes that the risk of electric shock is lower with gas metal arc welding than with manual metal arc welding, because the open-circuit voltages are lower, only direct current is used and the power is switched at the hand piece. The code lists the use of an appropriate hazard reducing device among the controls during welding, and refers to AS 60974.1 for hazard reducing devices on arc welding power sources. Chapter 9 covers electrical safety more fully.

## A failure: the wrong mode

This is an illustration. A new apprentice, welding conveyor brackets with low-hydrogen electrodes on the multi-process inverter, complained that the arc kept surging and stubbing out, that the electrodes overheated, and that the welds were uneven. The supervisor checked the electrodes, which were in good condition, and the current setting, which was correct.

The machine's display showed it was in constant-voltage mode, left there by the previous user who had been testing a wire feeder. On a flat characteristic, every small change in the apprentice's arc length produced a large change in current, the same behaviour as the 40 V resistor system in 1921 but more extreme: when the arc shortened, the current surged and the electrode overheated; when it lengthened, the current collapsed and the arc went out.

The machine was switched to constant-current mode, the apprentice's next welds were sound, and the shop added a mode check to the start-of-job checklist and labelled each machine with the mode for each process. The brackets already welded were inspected; several with uneven, poorly fused welds were rewelded.

## Exercise: a 1921 shop's power bill

A 1921 railway shop runs six welders on a 60 V constant-voltage system with ballast resistors, each at 150 A and 20 V at the arc for an average of three hours of arc time a day. Using the 1921 figures, estimate the resistor loss per welder while welding, the circuit efficiency, and the daily energy drawn from the motor-generator set's motor if the set's efficiency is 65%. Compare it with the energy that reaches the arcs.

Each welder's resistor drops 60 − 20 = 40 V at 150 A, so it dissipates 40 × 150 = **6.0 kW** while the arc is burning, against 20 × 150 = 3.0 kW in the arc. The circuit efficiency is 3.0 ÷ (3.0 + 6.0) = **33⅓%**, as before.

Each welder takes 9.0 kW from the 60 V circuit while welding, so six welders for three hours each take 6 × 9.0 × 3 = 162 kWh from the generator. At 65% efficiency the motor draws 162 ÷ 0.65 ≈ **249 kWh** a day from the supply, while the arcs receive 6 × 3.0 × 3 = **54 kWh**, about 22% of it. A modern inverter shop at 85% efficiency would draw about 54 ÷ 0.85 ≈ 64 kWh for the same arc work.
