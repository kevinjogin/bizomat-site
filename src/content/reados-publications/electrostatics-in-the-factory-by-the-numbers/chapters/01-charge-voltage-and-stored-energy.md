---
book: electrostatics-in-the-factory-by-the-numbers
chapterSlug: charge-voltage-and-stored-energy
order: 1
title: "Charge, voltage and stored energy"
description: "What static charge is, how charge, capacitance and voltage relate for people, parts and containers, how much energy a spark can release, and how to measure static voltages."
draft: false
---

A technician walks across the assembly area in rubber-soled shoes, reaches for a metal door handle and feels a sharp snap. Nothing about the technician or the handle has changed except that, for a moment, the technician carried a few millionths of a coulomb more negative charge than the handle. That small charge, at a voltage of several thousand volts, discharged through a spark a few millimetres long. It hurt a little. Near an open container of solvent, the same spark could do much more.

This chapter sets out the handful of quantities needed to reason about static electricity: charge, voltage, electric field, capacitance and stored energy. It works them for the people, parts and containers in the case factory, shows why the voltage of a charged object can rise without any extra charge, and explains how to measure static voltages without fooling yourself. It ends with a field meter held at the wrong distance, which made a charged film look harmless.

## Charge and how little of it there is

All matter is made of positive nuclei and negative electrons in exactly equal numbers. Static electricity is what happens when that balance is upset slightly: a few electrons too many or too few on an object's surface. The unit of charge is the coulomb, and one electron carries 1.6 × 10⁻¹⁹ C, so a coulomb is about 6 × 10¹⁸ electrons.

The charges involved in static are tiny. A person charged to 10 kV carries about 1.5 microcoulombs: roughly 9 × 10¹² extra electrons, in a body containing something like 10²⁸. Static charge sits on surfaces and in thin layers; it does not fill an object. It is the voltage, not the amount of charge, that makes static dramatic, because static charges sit on objects with very small capacitance.

## Voltage, field and capacitance

A charged object raises its voltage relative to its surroundings, usually the earthed floor, walls and machines. How high depends on its capacitance: the charge needed to raise its voltage by one volt. For an isolated object, capacitance depends only on its size and shape and on how close it is to earthed surfaces. A sphere 1 m across, far from everything, has a capacitance of 4πε₀ times its radius, about 56 pF. A person standing on an insulating floor has typically 100 to 200 pF, because the soles of the feet are close to the floor; a steel drum on an insulating pallet, a metal enclosure hanging from an insulated hook and a tool on a plastic bench are similar.

```figure
type: formula
title: Charge, voltage, field and stored energy
formula: Q = C × V
formula: E ≈ V ÷ d  (between parallel surfaces a distance d apart)
formula: W = ½ × C × V² = ½ × Q × V
caption: Q is charge (C), C capacitance (F), V voltage (V), E electric field (V/m), d distance (m) and W stored energy (J). In air at atmospheric pressure, a uniform field of about 3 MV/m, 3 kV per millimetre, is enough to cause breakdown; sharp points break down at much lower voltages (Chapter 3).
- Q | charge, coulombs
- C | capacitance, picofarads for people and parts
- W | energy released by a spark, millijoules
```

Two consequences follow from Q = CV. First, a small charge on a small capacitance makes a high voltage: 1.5 µC on 150 pF is 10,000 V. Second, if an object's capacitance falls while its charge stays the same, its voltage rises. A person standing on an insulating floor who lifts one foot moves part of their body away from the floor, reducing their capacitance; their voltage rises without any new charge. A sheet of film peeled from a roll, or a bag lifted from a table, does the same, and voltages of tens of kilovolts appear from the act of separation.

## The case: energies in the factory

The energy a charged object can release in a spark is ½CV², and it rises with the square of the voltage. That makes a large difference between a charge that is merely noticeable and one that is dangerous.

```figure
type: compare
title: Stored energy of charged objects in the factory
cols: Capacitance | Voltage | Stored energy | Comment
rowhead: Object
- Technician on an insulating floor | 150 pF | 2 kV | 0.3 mJ | About where a shock starts to be felt
- Technician, after walking across the floor | 150 pF | 10 kV | 7.5 mJ | A sharp shock; enough to ignite many vapours
- * Enclosure on a hanger with an insulating build-up, in the powder booth | 50 pF | 30 kV | 22.5 mJ | A spark that can ignite powder clouds of some coatings
- 200 L steel drum on a plastic pallet | 100 pF | 20 kV | 20 mJ | Why drums are bonded when filled
caption: This is an illustration. Capacitances are typical values for objects of these sizes near an earthed floor; voltages are the kind that are measured in practice when such objects are not earthed. The energy that matters for ignition is compared with the material's minimum ignition energy in Chapter 4.
```

A person cannot usually feel a discharge until they are charged to roughly 2 to 3 kV, so charges below that pass unnoticed, yet 2 kV on a person is already enough to destroy many electronic components (Chapter 8). And the enclosure in the powder booth, if its hanger loses its earth, can be charged by the corona guns to tens of kilovolts and store more energy than a charged person. The hanger's earth is therefore a safety item, not a quality one (Chapter 5).

## Conductors, insulators and where charge goes

Charge on a conductor spreads over its whole surface at once, so a conducting object is at one voltage throughout, and if it touches earth through any conducting path, all its charge flows away in microseconds. That is why conductors are rarely a problem when earthed and often the worst problem when not: an isolated conductor can release all its stored charge in one spark, with the full ½CV².

Charge on an insulator stays where it was put. A charged plastic film or tray can have patches of opposite sign side by side, and touching it with an earthed finger discharges only a small area. Insulators therefore do not usually give a single large spark, but they cannot be made safe by earthing either: their charge must be removed by ions from the air (Chapter 7) or prevented from building up. Chapter 2 explains how quickly charge leaks away from materials between the two extremes.

## How a person becomes charged

People charge themselves mainly by walking. Each step presses a shoe sole against the floor and then separates them, and if the two materials differ, a little charge stays on each (Chapter 2 explains why). If the soles and the floor are good insulators, the charge cannot leak away between steps and builds up step by step, until the leakage through the soles and the air balances the charging. Getting up from a chair, sliding across a vehicle seat and taking off a jacket do the same.

Three things decide how far it goes. The materials of the soles and the floor set how much charge each step separates. The resistance from the body through the shoes and floor to earth sets how fast the charge leaks away. And humidity, through its effect on surface resistance, changes both. A person in rubber-soled shoes on a sealed vinyl or epoxy floor on a dry winter day may reach 10 kV or more; the same person in dissipative shoes on a dissipative floor stays below a hundred volts, because each step's charge drains to earth before the next step adds to it. That is the principle of ESD footwear and flooring in Chapter 8: the charging is not prevented, but it can never accumulate.

## Forces from static

Charged surfaces attract and repel. A charged film clings to the hand, a charged window pulls dust out of the air, and a charged web of plastic wanders on a conveyor. The force has a limit set by the air: a flat surface cannot carry a charge density higher than the one that makes the field at its surface about 3 MV/m, because beyond that the air breaks down and discharges it. That limit is about 27 µC per square metre, and the electrostatic pressure it corresponds to, the force per unit area pulling the charged sheet towards an earthed surface, is about 40 Pa.

Forty pascals is a small pressure, but a thin film weighs very little. A 300 × 300 mm sheet of protective film at the limit is pulled with about 3.6 N, many times its own weight, which is why it wraps round the operator's arm. Dust particles are pulled even more strongly relative to their weight, because the field also polarises them and draws them towards the region where it is strongest, at the charged surface. A charged surface therefore sweeps dust out of the air around it until the charge is removed.

```figure
type: steps
title: The pull on a charged protective film
caption: Calculated from the breakdown field of air and the permittivity of free space; the film is 50 µm polyethylene of density about 950 kg/m³. Real films seldom reach the limit everywhere, but they routinely reach a large fraction of it when peeled quickly.
- Largest surface charge before the air breaks down, ε₀ × 3 MV/m | about 27 µC/m²
- Electrostatic pressure at that charge, σ² ÷ (2ε₀) | about 40 Pa
- Force on a 300 × 300 mm sheet | about 3.6 N
- Weight of that sheet, 50 µm thick | about 0.04 N
- * Pull compared with weight | about 85 times
```

The same arithmetic explains why static matters so much for light things and so little for heavy ones. A steel enclosure is never lifted by static; a sheet of film, a label, a fibre or a fine powder particle is moved easily, because the electrostatic force scales with surface area while weight scales with volume. The smaller and thinner the object, the more static dominates its behaviour, which is why powder coating (Chapter 6) and precipitators (Chapter 9) work at all.

## Static shocks and safety

The energy in a static shock is small, millijoules against the hundreds of joules involved in a mains shock, and static discharges from people do not in themselves cause electrical injury. They cause other injuries: a technician on a ladder who flinches from a shock can fall, and an operator startled at a machine can put a hand where it should not go. Persistent shocks at a workstation are a hazard to be controlled under work health and safety duties, and they are also the clearest sign that charge is building up in a place where it might, near a flammable material, do much worse.

## Measuring static voltages

An ordinary multimeter cannot measure static voltage. Its input resistance, typically 10 MΩ, discharges a 150 pF object in about 1.5 milliseconds, long before the meter shows a reading, and the meter's own small capacitance changes the very thing it is measuring. Static is measured without contact.

**Field meters** measure the electric field at their sensing head and display it as the surface voltage of a large flat charged surface at a stated distance, typically 25 mm or 50 mm. They are quick and simple, and they are only accurate at their calibrated distance and for surfaces large compared with that distance.

**Electrostatic voltmeters** use a sensor that is driven to the same voltage as the surface so that no field exists between them; they read the surface voltage accurately over a range of distances and suit small objects.

**Charge measurement** with a Faraday pail, an insulated metal can connected to a charge meter, measures the total charge on a small object or a sample of powder dropped into it, and gives the charge-to-mass ratio of powders, which matters in Chapter 6. Each instrument needs regular checks against a known voltage or charge source, and its batteries and earth lead must be in order, since a meter that is not itself earthed reads relative to whatever it happens to be at.

## When it goes wrong: the field meter held too far away

The factory's polycarbonate windows arrive with a protective film. After complaints that dust kept settling on the windows just before they were fitted, a supervisor checked the static with the factory's field meter, held at a comfortable distance from a freshly peeled window, about 100 mm away, and read about 2 kV. Concluding that 2 kV was modest, the supervisor looked for other causes of the dust.

The meter's instructions gave its calibration distance as 25 mm. A field meter measures field, not voltage, and the field from a charged area falls with distance; the display assumes the calibrated spacing. Held four times further away from a window only about 300 mm across, the meter saw a much weaker field and under-read badly.

```figure
type: compare
title: The same freshly peeled window measured at two distances
cols: Meter distance | Displayed reading | Valid
rowhead: Measurement
- As first measured | about 100 mm | about 2 kV | No: four times the calibration distance
- * Repeated as instructed | 25 mm | about 9 kV | Yes, for a surface this large
caption: This is an illustration. The size of the error depends on the shape and size of the charged area and on nearby earthed objects; for small charged items an electrostatic voltmeter or a meter with a distance indicator is more reliable.
```

At 9 kV, the window's surface field was strong enough to pull airborne dust onto it from several centimetres away, which explained the complaints. The fix, an ioniser at the peeling station, is worked in Chapter 7. The factory's meter now has a 25 mm spacer clipped to its head, and the measurement procedure states the distance. The supervisor's first conclusion was a reasonable one from the number on the display; the mistake was trusting a number without knowing the conditions it assumed, which is the commonest error in static measurement. Every static reading in the factory's records now carries the instrument, its distance and the time since the surface was last handled.

## Exercise: a drum on a plastic pallet

A 200 L steel drum standing on a plastic pallet has a capacitance of about 100 pF. Pouring powder into it through a plastic chute gives it 1.5 µC of charge.

1. What is its voltage?
2. How much energy would a spark from the drum to an earthed scoop release?
3. If the drum is lifted on a forklift so that its capacitance falls to 60 pF while keeping its charge, what happens to its voltage and stored energy?

**Answer.**

1. V = Q ÷ C = 1.5 × 10⁻⁶ ÷ 100 × 10⁻¹² = 15,000 V.
2. W = ½ × 100 × 10⁻¹² × 15,000² = 0.01125 J, about 11 mJ.
3. V = 1.5 × 10⁻⁶ ÷ 60 × 10⁻¹² = 25,000 V, and W = ½ × 60 × 10⁻¹² × 25,000² = 18.75 mJ. With no extra charge, lifting the drum raises both its voltage and its stored energy, because the work done separating it from the floor goes into the field. The answer is to bond the drum to earth before filling, so that it never charges at all.
