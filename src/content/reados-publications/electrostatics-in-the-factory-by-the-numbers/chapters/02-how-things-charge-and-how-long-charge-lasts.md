---
book: electrostatics-in-the-factory-by-the-numbers
chapterSlug: how-things-charge-and-how-long-charge-lasts
order: 2
title: "How things charge and how long the charge lasts"
description: "How contact, induction and flow charge materials, how fast charge leaks from conductors, liquids and plastics, and how humidity changes surface leakage, with a winter humidity check."
draft: false
---

Every static problem has two halves: something that separates charge, and something that stops it from leaking away. Separation happens constantly, whenever two surfaces touch and part: a shoe and a floor, a film and its backing, powder and a pipe wall, a liquid and a filter. Most of the time the charge leaks back before it amounts to anything. Static becomes a problem only where charging is fast and leakage slow, and the second half is usually easier to change.

This chapter explains the ways materials charge, then how quickly charge leaks away, which depends on a material's conductivity and permittivity through a single time constant. It shows why humidity helps many materials and not others, and uses the KEVOS® heating with humidification tool to work out what it takes to keep the case factory's assembly area at a sensible humidity through a Melbourne winter. It ends with a humidifier that did its job at the air handler and not where the technicians worked.

## Contact and separation

When two different materials touch, electrons move across the contact from the material that holds them less tightly to the one that holds them more tightly, until the difference is balanced. When the surfaces separate quickly, much of that transferred charge is left behind: one surface positive, the other negative. That is contact charging, often called triboelectric charging, from the Greek for rubbing, because rubbing increases the area of real contact and so the charge.

Lists called triboelectric series rank materials by the sign they tend to take: human skin, nylon and glass tend to charge positive against polyethylene, PTFE and PVC, which tend to charge negative. The lists are useful for a first guess and unreliable for anything more, because surface contamination, moisture, wear and the details of contact all change the result, and two samples of the "same" plastic can charge in opposite directions. Measurement beats prediction, every time.

## Other ways to charge

Induction charges a conductor without touching it. A conductor brought near a charged object has the charges within it rearranged by the field: opposite charge on the near side, like charge on the far side. If the far side is briefly earthed, the like charge drains away, and when the earth is broken and the conductor moved away, it keeps a net charge. An unearthed metal part near a charged film, or an operator standing near a charged web, can be charged this way.

Flow charging happens when liquids or powders move against walls. A liquid flowing through a pipe or filter carries away part of a thin layer of charge that forms at the wall, so the liquid arrives charged and the pipe, if isolated, charges oppositely. It matters for low-conductivity liquids such as many hydrocarbon solvents and fuels, which hold the charge long enough to carry it into a tank. Powder conveyed pneumatically charges strongly against pipe walls in the same way.

Corona charging deliberately sprays ions onto a material, as a powder gun does. Chapter 6 explains it.

Charge can also be shared. When a charged object touches an uncharged one of similar size and both are insulated from earth, the charge divides between them according to their capacitances, and both end at the same voltage. This is how a charged person transfers charge to a tool or a component they pick up, and how a charged powder heap passes charge to a metal scoop held by someone in insulating gloves. Whenever charge is moved around a workplace by hand, the people doing it are part of the circuit, which is why earthing people, through footwear, flooring or wrist straps, appears in nearly every static control scheme.

## How long charge lasts

Charge leaks away through a material and over its surface. For a material with conductivity σ and relative permittivity ε_r, charge within it decays exponentially with a time constant, the relaxation time, equal to ε₀ε_r ÷ σ. After one time constant about 37% of the charge remains; after three, about 5%.

```figure
type: formula
title: Charge relaxation time
formula: τ = ε₀ × ε_r ÷ σ
formula: Q(t) = Q₀ × e^(−t ÷ τ)
caption: τ is the relaxation time (s), ε₀ the permittivity of free space, 8.854 × 10⁻¹² F/m, ε_r the material's relative permittivity, σ its electrical conductivity (S/m), Q₀ the initial charge and Q(t) the charge remaining after a time t. Surface leakage, often dominant for plastics, follows a similar exponential with a time constant set by surface resistance and capacitance.
- τ | relaxation time
- σ | conductivity, S/m
- ε_r | relative permittivity
```

```figure
type: compare
title: Relaxation times of materials in the factory
cols: Relative permittivity | Conductivity | Relaxation time
rowhead: Material
- Polyethylene film | about 2.3 | about 10⁻¹⁶ S/m | about 2 × 10⁵ s, more than two days
- Toluene, a hydrocarbon solvent | about 2.4 | about 10⁻¹² S/m | about 21 s
- * Isopropyl alcohol | about 18 | about 3.5 × 10⁻⁶ S/m | about 46 µs
- Tap water | about 80 | about 0.05 S/m | about 10 ns
caption: This is an illustration. Conductivities of liquids vary widely with purity and temperature, and those of plastics with additives, surface contamination and humidity; use measured values for real decisions. The times show why some materials hold charge for days and others for microseconds.
```

The table explains much of practical static control. Polyethylene film holds its charge for days, so charging it once is enough to cause trouble all shift. Toluene, poured from a drum, carries its charge into a container and holds it for tens of seconds, long enough for a spark from the liquid surface or an isolated container. Isopropyl alcohol, which the factory uses to clean circuit boards, is conductive enough that its charge leaks away almost instantly if it is in contact with anything earthed; the hazard with it comes from charged people and isolated containers, not from the liquid itself.

## Humidity and surface leakage

Many plastics, textiles, paper and wood carry a thin film of adsorbed water on their surfaces, and the water, with the traces of salts dissolved in it, conducts. Its thickness rises steeply with relative humidity, so surface resistance can fall by orders of magnitude between a dry winter day and a humid summer one, and charge that lasts minutes in winter may leak away in a fraction of a second in summer. That is why static shocks are a winter complaint.

The effect is not universal. Hydrophobic plastics such as PTFE, polyethylene and polypropylene adsorb little water and stay insulating at high humidity, and a film of oil or silicone on a surface stops water from wetting it. Humidity is therefore a useful background control for paper, textiles, people and many surfaces in an assembly area, and not a cure for charged plastic film, which needs ionisers (Chapter 7).

## Where the factory makes charge

A walk through the case factory with a field meter finds charge being separated in more places than anyone expected.

```figure
type: compare
title: Charge-generating operations found in the factory survey
cols: What separates | What holds the charge | Where it matters
rowhead: Operation
- Walking on the sealed floor | Shoe soles and floor coating | Rubber soles, insulating floor | Shocks; ESD in assembly
- Peeling protective film from windows | Film and polycarbonate | Both are insulators | Dust on windows
- Powder flowing through gun feed hoses | Powder and hose wall | Powder, hose, an isolated hopper | Powder line
- Wiping boards with isopropyl alcohol | Swab, board and person | The person, if not earthed | Assembly area
- Unwinding stretch film on pallets | Film layers | Film, pallet, the operator | Dispatch
- Conveyor belts over rollers | Belt and rollers | Belt, if insulating | Packing line
caption: This is an illustration. It shows the factory's survey. Each line is a combination of a separating process and a slow leakage path; removing either one removes the problem.
```

The survey changes the question from "is there static?", to which the answer in any factory is yes, to "where does charge build up near something it can harm?". The powder line and the assembly area answered yes for different reasons: the first because of ignition risk (Chapter 4) and coating quality (Chapter 6), the second because of electronic components (Chapter 8). The dispatch area did not: charged stretch film there gives the odd shock but there is nothing flammable or sensitive nearby, so it was recorded and left.

## Measuring resistance

Because leakage decides whether charge builds up, much of static control comes down to resistance measurements, made with instruments designed for the purpose.

A surface resistance meter places two electrodes, often a concentric ring and centre disc, on a surface and measures the resistance between them at a test voltage of 10 V or 100 V, chosen by the range. A resistance-to-earth measurement uses one electrode on the surface and the other connected to the earth point, which is how floors, benches and shelving in an assembly area are checked. People are checked standing on the floor in their shoes, holding an electrode, so that the measurement includes body, footwear and floor together.

Readings depend on the humidity, the electrode pressure, the cleanliness of the surface and the test voltage, so procedures state all of them and the humidity at the time is recorded with each result. A floor that passes on a humid summer day may fail in winter, and an assembly area should be qualified in the conditions in which it is most likely to fail. Insulation testers built for electrical installation work, which apply 500 V or 1,000 V, are not suitable: they can damage dissipative materials and electronic assemblies and give readings on a different basis.

## The case: humidifying the assembly area

The factory's assembly area is supplied by an air handler drawing 1.5 m³/s of outside air, heating it and, since last winter, humidifying it with steam. On a cold, damp Melbourne winter morning, as an illustration, the outside air is 8 °C at 85% relative humidity. Heated to 20 °C without adding moisture, its relative humidity falls to about 39%, because warm air can hold more water; on drier, colder days it falls further. The factory's target in the assembly area is 45%.

The [heating with humidification tool](/tools/heating-humidification-check/) works out, for moist air heated and humidified in steady flow, the humidity ratio and enthalpy of the air entering and leaving, the heater load, the water or steam needed and the energy the humidifier brings in, and compares them with the heater and humidifier capacities.

```figure
type: compare
title: Heating and humidifying the assembly area's air, 1.5 m³/s from 8 °C and 85%
cols: Heater load | Steam added | Energy brought in by the steam | Leaving dew point
rowhead: Leaving condition
- 20 °C, 39%, heating only | about 22.8 kW | none | about 5.6 °C
- * 20 °C, 45% | 22.52 kW | 5.91 kg/h | 4.39 kW | 7.72 °C
- 20 °C, 50% | 22.33 kW | 10.84 kg/h | 8.06 kW | 9.27 °C
caption: This is an illustration. Results from the heating with humidification tool with a steam enthalpy of 2,675 kJ/kg, against a 30 kW heater and a 15 kg/h steam humidifier. The heating-only line is the starting point; its relative humidity is calculated from the outside air's moisture content.
```

Reaching 45% takes about 5.9 kg of steam an hour, plus the 4.4 kW the steam carries, on top of 22.5 kW of heating; reaching 50% nearly doubles the steam. The factory chose 45% as a compromise between static control and the energy, the humidifier's maintenance and the risk of condensation on cold window frames, which the leaving dew point, 7.7 °C, helps check.

What does the humidity cost? The steam's 4.39 kW is the extra energy, since the heating would be needed anyway. If the humidifier runs for about 1,500 hours over a winter at that load, an assumption for this illustration, it uses about 6,600 kWh and about 8.9 tonnes of water, roughly A$1,650 of electricity at A$0.25/kWh excluding GST, plus water treatment and cylinder maintenance. Against the cost of a single batch of damaged control boards, that is small; against the cost of an ioniser for one problem workstation, it may not be, which is why humidity is used for the general background and ionisers for specific operations.

## Charge in containers of liquid and powder

Liquids and powders bring their own charge into containers. A low-conductivity solvent pumped through a filter into a drum arrives charged, and if the drum is metal and earthed, the charge leaks from the liquid to the drum over a few relaxation times; if the drum is plastic or isolated, it stays. Powder poured from a bag or blown through a hose arrives charged and piles up in a heap whose charge cannot leak away through the powder itself if the powder is insulating. In both cases the hazard is a discharge from the charged contents, or from an isolated conductor charged by them, into a flammable atmosphere above the surface. Chapter 4 deals with when that matters; the leakage times in this chapter tell how long the hazard lasts after filling stops.

## When it goes wrong: humidity where the sensor is, not where the people are

After the humidifier was commissioned, the air handler's controller showed 45% steadily, but technicians still reported shocks at the assembly benches on cold days and the ESD audit (Chapter 8) recorded people charging to over 3 kV walking between benches.

A portable humidity logger left on a bench for a week told the story. Near the benches, the humidity fell to around 30% every afternoon. The assembly area shares a wall with the powder line, and a door between them was usually propped open for forklift traffic. Hot, dry air from around the curing oven flowed through it, mixed into the assembly area and lowered its humidity, while the air handler's sensor, in its return duct near the opposite wall, saw mostly its own supply air.

```figure
type: checklist
title: Making the humidity reach the benches
caption: This is an illustration. It shows the changes the factory made.
- x A self-closing door with a strip curtain between the powder line and the assembly area
- x A humidity sensor at bench height in the assembly area, used for control
- x Weekly check of the logger against a calibrated hygrometer
- x Humidity recorded with every ESD audit result
- ? Review whether the oven's surroundings can be ventilated separately
```

With the door closed and the controller following a sensor at the benches, the afternoon humidity held near 45% and the walking voltages in the next audit were below 1 kV. The lesson is general: control the condition where it matters, and check it there, at the height and in the place where the work is done.

## Exercise: a dissipative tray

The factory considers plastic trays for carrying boards between stations. A sample has a relative permittivity of 3.

1. If its conductivity is 10⁻¹¹ S/m, what is its relaxation time, and how long until only 5% of a charge remains?
2. What if its conductivity is 10⁻¹³ S/m?
3. Which would you accept for carrying boards in the assembly area, and why?

**Answer.**

1. τ = 8.854 × 10⁻¹² × 3 ÷ 10⁻¹¹ = 2.7 s. Three time constants, about 8 s, leave 5%.
2. τ = 8.854 × 10⁻¹² × 3 ÷ 10⁻¹³ = 266 s, about 4.4 minutes, and about 13 minutes to fall to 5%.
3. The first, provided it is placed on earthed surfaces: its charge drains in seconds, and it will not hold a charge from one station to the next. The second behaves as an insulator over the time a board spends in it. In practice ESD-safe materials are specified by surface or volume resistance measured in a standard way, which Chapter 8 discusses; the relaxation time shows why the specification matters.
