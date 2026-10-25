---
book: industrial-electric-heating-by-the-numbers
chapterSlug: cables-and-fuses
order: 4
title: "Cables, fuses and protection"
description: "See why a cable's current rating is really a temperature limit, estimate how hot a conductor gets during a short circuit, and understand how fuses and circuit breakers protect the wiring of a heater."
draft: false
---

Every electric heater is fed through cables, and every cable is a resistance that heats up. A heater is designed to get hot; its cable must not, even though the same current flows through both. The cable's current rating is really a temperature limit: the current at which the heat generated in the conductor, lost through its insulation and surroundings, brings the insulation to the highest temperature it can withstand for its life. And because cables can be overloaded or short-circuited, every circuit has a device, a fuse or a circuit breaker, designed to break the current before the cable overheats.

This chapter explains what sets a cable's rating, calculates how quickly a conductor heats during a short circuit, and looks at fuses and circuit breakers from Houston and Kennelly's fuse wires to the protection of the curing oven. It explains principles; the selection of cables and protective devices is the electrician's job under AS/NZS 3000 and AS/NZS 3008.1.1.

## A rating is a temperature

Chapter 3 showed that a conductor's temperature settles where the heat it generates, I²R, equals the heat it loses. For a cable, the limit is not the copper, which could run much hotter, but the insulation around it. Plastic and rubber insulations soften, age and eventually crack if they run above their rated temperature for long. A cable's continuous current rating is the current that keeps the conductor at or below that temperature under stated installation conditions.

The rating therefore depends on everything that affects the heat balance:

- **conductor size**, which sets the resistance and so the heat generated per metre;
- **insulation type**, which sets the maximum allowable temperature;
- **installation method**, in air, on a tray, in conduit, buried or enclosed in thermal insulation, which sets how easily heat escapes;
- **grouping**, because cables run together heat each other;
- **ambient temperature**, because a cable in a hot location starts closer to its limit.

That is why the same conductor size can have very different ratings in different situations, and why AS/NZS 3008.1.1 sets out ratings and derating factors for each. A cable that is adequate in open air may overheat when enclosed in insulation or grouped with others, exactly as Houston and Kennelly's buried wires warmed more than wires in air.

## Voltage drop

A cable must also not drop too much voltage. Chapter 2 calculated a drop of about 0.62% in the oven's 30 m supply cable at full load. The Wiring Rules limit the total voltage drop in an installation, and on long runs it is often voltage drop, not current rating, that decides the cable size. For a heater, voltage drop reduces power by about twice its percentage (Chapter 1), so a long, undersized supply cable means a slower oven as well as wasted energy.

## Short circuits: heat with no time to escape

In a short circuit, the current can be many times the normal load current, limited only by the impedance of the supply and the wiring, and it flows until the protective device breaks it, usually within a fraction of a second. In that time, almost no heat escapes from the conductor: it all goes into raising the conductor's temperature. The heating is then adiabatic, and the temperature rise follows from the energy balance:

**ΔT ≈ I² × t × ρ ÷ (A² × d × c)**

where I is the fault current, t its duration, ρ the conductor's resistivity, A its cross-section, d its density and c its specific heat.

```figure
type: formula
title: Temperature rise of a 35 mm² copper conductor during a short circuit
formula: ΔT ≈ I² × t × ρ ÷ (A² × d × c)
caption: This is an illustration, ignoring the rise of resistivity with temperature and any heat lost during the fault. The protective device's clearing time decides how far the temperature climbs.
- I | fault current, 5,000 A
- t | time to clear the fault, s
- ρ | copper resistivity, 1.72 × 10⁻⁸ Ω·m
- A | 35 × 10⁻⁶ m²
- d, c | copper density 8,960 kg/m³; specific heat 385 J/kg·°C
step: cleared in 0.1 s: ΔT ≈ 5,000² × 0.1 × 1.72 × 10⁻⁸ ÷ ((35 × 10⁻⁶)² × 8,960 × 385) ≈ 10 °C
step: cleared in 0.5 s: ΔT ≈ 51 °C
```

The temperature rise is proportional to I² × t, and inversely to the square of the cross-section. That is why protective devices are characterised by their I²t, the energy they let through before they clear, and why a smaller conductor needs faster protection. A 16 mm² conductor carrying 10,000 A for 0.1 s, by the same formula, would rise by about 195 °C, enough to damage most insulation. Standards express this as a limit on the fault current and duration a cable may carry, which the electrician checks against the protective device's characteristics.

## Houston and Kennelly's fuse wires

Houston and Kennelly devoted a chapter to fuse wires, short lengths of thin wire placed in a circuit so that they would melt and break it before the main wiring could overheat. The principle is the heat balance again. The fuse wire is chosen so that, at its rated current, it loses its heat fast enough to stay below its melting point; above that current, it heats faster than it can cool, reaches its melting point and breaks. The larger the overload, the faster it melts, because the excess heat rises with the square of the current while the fuse wire's ability to lose heat stays roughly the same.

That gives every fuse a characteristic shape: an inverse time-current curve, in which a small overload takes a long time to melt the fuse and a large one melts it almost instantly. A fuse's job is to match that curve to the cable it protects, so that it always breaks the current before the cable reaches its temperature limit, whether the excess is a modest overload lasting minutes or a short circuit lasting milliseconds.

## Fuses and circuit breakers today

Modern fuses are enclosed, filled with sand or similar material that quenches the arc as the element melts, and rated to break very large fault currents. High-rupturing-capacity fuses can limit the fault current itself by melting so fast that the current never reaches its full prospective value, greatly reducing the I²t let through.

Circuit breakers do the same job resettably. A typical thermal-magnetic breaker has two mechanisms:

- a **thermal** element, a bimetal strip heated by the load current, which bends and trips the breaker on a sustained overload, mimicking the slow heating of the cable;
- a **magnetic** element, a coil that trips the breaker almost instantly when the current reaches many times its rating, as in a short circuit.

```figure
type: compare
title: How a protective device responds to overload and short circuit
cols: Overload, a little above rating | Short circuit, many times rating
caption: Both kinds of device follow the cable's heat balance: slow response where the cable heats slowly, fast where it heats in milliseconds.
- What happens in the cable | slow temperature rise over minutes | adiabatic heating in fractions of a second
- Fuse | element melts after a time that shortens as overload grows | element melts almost instantly; may limit the current
- Thermal-magnetic breaker | bimetal heats and trips | magnetic coil trips almost instantly
```

Residual current devices protect against a different hazard: they compare the current flowing out and back in a circuit and trip when a small difference shows that current is leaking to earth, possibly through a person. They protect people from electric shock, not cables from overheating, and Safe Work Australia's model code on managing electrical risks in the workplace discusses their role. A heater circuit typically needs both kinds of protection, because an element whose insulation breaks down can make the oven's metal casing live.

## Discrimination

In a building, protective devices are arranged in a hierarchy, from the main switch through distribution boards to individual circuits. Discrimination, or selectivity, means that a fault on one circuit is cleared by the device closest to it, leaving the rest of the installation running. If the main breaker tripped every time one oven element shorted, the whole plant would stop, and finding the faulty circuit would take far longer. Achieving discrimination means choosing devices whose time-current characteristics nest correctly, which is part of the electrician's design.

## The oven's circuit

This is an illustration. The coating business's electrician designed the oven's supply for its 60 kW, 83.5 A balanced load and the 30 m run from the switchboard, taking into account the installation method on a cable tray shared with other cables, the voltage drop, and the fault current available at the switchboard. The design used a 35 mm² copper cable protected by a 100 A circuit breaker, checked for the cable's current rating under its installation conditions, for voltage drop, and for its ability to withstand the prospective fault current for the breaker's clearing time. Within the oven, each heater group has its own smaller protection, so that a fault in one element group is cleared without stopping the fan, the controls or the other groups.

These figures are the electrician's design for this particular installation, documented on the circuit schedule, not a rule. A different route, installation method or supply could need a different cable and breaker.

## Heaters are continuous loads

Many electrical loads draw their full current only briefly: a motor starting, a welder striking an arc, a kettle boiling. Heaters are different. An oven warming up draws its full rated current for many minutes, and a furnace holding temperature may cycle its heaters on for most of every hour, all shift. Chapter 3 showed that a cable takes several time constants, often the better part of an hour, to reach its steady temperature, so a continuous load is exactly the case in which a cable reaches its full temperature. Heater circuits are therefore designed on their full continuous current, with no allowance for diversity within the heater itself, and the switchboards that feed several ovens must shed the combined heat of all their busbars, breakers and terminals at the same time.

## Switching and isolation

Heater groups are switched on and off by contactors or solid-state relays under the control of the temperature controller (Chapter 9), separately from the protective devices. Contactors that switch heaters many times an hour wear their contacts, and a worn contact develops resistance and heat like any poor connection. Solid-state relays have no contacts to wear but generate heat themselves, roughly a volt or so dropped across the device at full current, and need heat sinks sized for it.

For maintenance, every heater must be isolated from its supply by a lockable isolator, so that an electrician working on elements or terminals can lock it off and prove it dead before touching anything. Safe Work Australia's model code on managing electrical risks in the workplace sets out the principles of de-energising and isolating electrical equipment before work. The oven's design places its isolator where it can be reached and locked without entering the oven.

## Hot spots that protection cannot see

Overcurrent protection responds to the current in a circuit, not to its temperature at any particular point. A loose terminal that runs hot at normal current, as described in Chapter 2, does not trip anything: the current is normal, so the breaker is satisfied while the terminal slowly cooks. Thermographic inspection of switchboards and terminal boxes, with an infrared camera while the equipment is under load, finds such hot spots, and periodic retightening of terminals that see heating and cooling cycles prevents many of them.

## A failure: the bigger breaker

This is an illustration. Some months after the oven was commissioned, its supply breaker began tripping occasionally during long runs. A contractor, called in by the production supervisor, replaced the 100 A breaker with a 125 A one, and the trips stopped. A few weeks later, the business's own electrician, doing a routine thermographic inspection, found the oven's supply cable running far hotter than expected along the tray, and its insulation discoloured near a bundle of other cables.

The electrician traced the original trips to an unbalanced heater bank: an element group on one phase had been rewired after a repair so that the phase carried several more elements than the others, pushing its current above 100 A while the others stayed below. The breaker had been doing its job: protecting the cable from that phase's overload. The larger breaker removed the protection. The overloaded phase conductor generated (125 ÷ 100)² ≈ 1.56 times the heat at the new breaker's rating, and nothing would trip until it was exceeded.

The heater bank was rebalanced to the wiring diagram, with the phase currents checked by clamp meter, the 100 A breaker reinstated, the damaged length of cable replaced, and the business made it a rule that protective devices are changed only by its licensed electrician, after finding the cause of any trip.

## Exercise: a smaller conductor in a fault

A 10 mm² copper conductor feeding a heater group carries a fault current of 3,000 A for 0.2 s before its breaker clears. Using the adiabatic formula, estimate its temperature rise. Then estimate the rise if the breaker cleared in 0.05 s.

The rise is about 3,000² × 0.2 × 1.72 × 10⁻⁸ ÷ ((10 × 10⁻⁶)² × 8,960 × 385) ≈ **90 °C**. At 0.05 s, a quarter of the time, the rise is a quarter as much, about **22 °C**.

Clearing time is as important as fault current: a device that clears four times faster lets through a quarter of the energy. That is why the protective device for a small conductor must be fast enough at the fault current available, and why the electrician checks the combination rather than the cable or the breaker alone.
