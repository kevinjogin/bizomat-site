---
book: distribution-transformers-by-the-numbers
chapterSlug: short-circuits-inrush-and-protection
order: 5
title: "Short circuits, inrush and protection"
description: "How impedance sets the fault current on the LV switchboard, why short circuits stress windings, why switching on draws an inrush, and how protection must allow for both."
draft: false
---

Most of a transformer's life is uneventful: a steady flux in the core and a load current that rises and falls with the working day. Two kinds of event break that pattern. A short circuit downstream drives a current many times the rated current through the windings until a protective device clears it, and the magnetic forces between the windings grow with the square of that current. And every time the transformer is switched on, its core can be driven briefly into saturation, drawing an inrush current that looks to the protection very much like a fault.

This chapter works out the fault current on the plant's LV switchboard from TX-1's impedance and the network's fault level, explains the forces a short circuit puts on the windings, and shows how the choice of impedance for TX-1's replacement is constrained by the switchboard's rating. It then explains inrush, why it happens and how protection rides through it, and ends with an HV fuse that blew the first time the new transformer was switched on.

## Fault current

When the LV terminals are short-circuited, the only things limiting the current are the impedances of the transformer and of the network behind it. Chapter 4 explained that TX-1's 5% impedance means 5% of rated voltage drives rated current through it. At full voltage with a dead short, the current would therefore be 100 ÷ 5 = 20 times rated, if the network behind it were infinitely strong.

The network is not infinitely strong. Its strength at the plant's 11 kV connection is stated by the network operator as a fault level, in MVA, and as an illustration the plant's connection has 250 MVA. On TX-1's 1.5 MVA base, the network's impedance is 1.5 ÷ 250 = 0.6%, in series with TX-1's 5.0%.

```figure
type: formula
title: Fault current at the LV terminals
formula: I_sc = I_rated × 100 ÷ (Z_transformer% + Z_network%)
formula: Z_network% = S_transformer ÷ S_fault level × 100
formula: i_peak ≈ κ × √2 × I_sc,  κ ≈ 1.02 + 0.98 × e^(−3 ÷ (X/R))
caption: I_sc is the symmetrical rms fault current, i_peak the highest instantaneous current in the first half cycle, which depends on the circuit's ratio of reactance to resistance, X/R, because a fault that starts at the wrong moment carries a decaying DC offset. The κ expression is a widely used approximation. Impedances of cables and the fault's own resistance, ignored here, reduce the current further.
- I_rated | transformer's rated LV current
- Z% | impedances on the transformer's own kVA base
- κ | peak factor, between 1 and 2
```

```figure
type: steps
title: Fault current on the plant's LV switchboard with TX-1
caption: This is an illustration. Network fault level of 250 MVA at 11 kV, assumed mostly reactive; TX-1's R = 1.1% and X = 4.88%. The switchboard and its circuit breakers must withstand and, where they interrupt faults, break this current.
- TX-1 rated LV current | 2,000 A
- With an infinitely strong network, 2,000 × 100 ÷ 5.0 | 40.0 kA
- Network impedance on 1.5 MVA, 1.5 ÷ 250 × 100 | 0.6%
- * Symmetrical fault current, 2,000 × 100 ÷ 5.6 | 35.7 kA
- X/R of transformer and network together | about 4.7
- Peak factor κ | 1.54
- Peak current in the first half cycle, 1.54 × √2 × 35.7 | about 77.7 kA
```

## Forces on the windings

Two conductors carrying current side by side attract or repel each other with a force proportional to the product of their currents. Inside a transformer the HV and LV windings carry currents in opposite directions, so they push each other apart: the LV winding is squeezed inwards towards the core and the HV winding is pushed outwards, and both are pressed along their height towards the middle. At rated current these forces are trivial. They grow with the square of the current, so at a fault current of 17.9 times rated, 35.7 kA against 2,000 A, the forces are 17.9² = 319 times their rated value, and they peak with the asymmetrical peak current in the first cycle.

A transformer's windings, their spacers and clamping are designed to withstand such forces for the short time it takes a protective device to clear the fault, and the ability to withstand them is a type test demonstrated on a representative unit (IEC 60076-5 covers the ability to withstand short circuit). The winding clamping relaxes slowly over decades as paper insulation dries and shrinks, so an old transformer can be less able to survive a heavy fault than a new one. That is one of the quieter reasons the plant's engineers are uneasy about TX-1's age.

## Heat in a short circuit

A fault also heats the windings, and it does so too quickly for the oil to carry the heat away: for the second or two before the protection clears it, the copper simply absorbs the energy. That makes the calculation simple. If TX-1's LV conductors carry about 2.5 A/mm² at rated current, a value typical of oil-cooled distribution windings, then at 17.9 times rated they carry about 44.6 A/mm². With copper's resistivity at 75 °C of about 2.1 × 10⁻⁸ Ω·m, specific heat 385 J/(kg·K) and density 8,900 kg/m³, a two-second fault raises the copper's temperature by about J² × ρ × t ÷ (c × d) = 24 K.

```figure
type: formula
title: Adiabatic temperature rise of a winding during a fault
formula: Δθ ≈ J² × ρ × t ÷ (c × d)
caption: J is the current density in the conductor (A/m²), ρ its resistivity (Ω·m), t the fault duration (s), c the specific heat (J/(kg·K)) and d the density (kg/m³). The current density at rated load is an assumed typical value for this illustration; the maker's design gives the real one.
- J | 44.6 A/mm² in TX-1's LV winding during the fault
- t | fault duration, 2 s assumed
- Δθ | about 24 K
```

Twenty-four kelvin on top of a winding already at, say, 100 °C is not dangerous by itself, and it shows why the mechanical forces, not the heat, usually decide whether a transformer survives a short circuit. It also shows why the fault duration matters: the rise grows in proportion to time, so protection that clears in one second rather than two halves it, and protection that fails to clear lets it climb without limit. The windings' ability to carry a fault for a stated time is part of the design that the maker guarantees.

## Protection inside the transformer

Faults inside the tank, between turns or from a winding to earth, may draw too little extra current at the terminals for external protection to see quickly, but they make heat and gas. A sealed distribution transformer like TX-1 therefore carries its own protective devices.

**Oil temperature indicator.** A dial thermometer with adjustable contacts, its bulb in a pocket in the tank's top oil, set to alarm and then trip at temperatures chosen from the maker's limits.

**Winding temperature indicator.** A thermometer in the top oil with a small heater fed from a current transformer on the LV leads, calibrated so that it reads the top oil temperature plus a margin proportional to the load, imitating the hot-spot gradient of Chapter 6. It is an estimate, not a measurement, but it responds to load in the way the windings do.

**Pressure relief device.** A spring-loaded valve on the tank lid that opens if an internal arc raises the pressure suddenly, preventing the tank from rupturing, with a contact that trips the HV supply.

Transformers with a conservator tank have a gas-and-oil-actuated relay, often called a Buchholz relay after its inventor, in the pipe to the conservator, which collects gas from slow faults and responds to the oil surge of a fast one. Each device is only useful if its contacts are wired to alarm and trip the HV supply, and if those circuits are tested. In the plant's 2022 maintenance outage, TX-1's oil temperature trip contact was found wired to an alarm lamp only, a change made during a switchboard alteration years before and never noticed; it was rewired and tested.

## The replacement's impedance and the switchboard

The plant's main LV switchboard dates from 1996 too. Its busbars and main circuit breaker are rated, as an illustration, to withstand 42 kA for one second. With TX-1 the prospective fault current is 35.7 kA, inside that rating. A replacement transformer of larger rating raises the fault current, because its rated current is larger, unless its impedance is raised to compensate.

```figure
type: compare
title: Fault current and regulation with a 2,000 kVA replacement
cols: Rated LV current | Symmetrical fault current | Peak fault current | Regulation at 1,520 kVA, pf 0.85 | Against the 42 kA switchboard
rowhead: Option
- TX-1, 1,500 kVA, 5.0% | 2,000 A | 35.7 kA | 77.7 kA | 3.62% | Within
- 2,000 kVA, 5.0% | 2,667 A | 46.0 kA | 103 kA | 2.62% | Exceeds
- * 2,000 kVA, 6.0% | 2,667 A | 39.2 kA | 91 kA | 3.04% | Within
caption: This is an illustration. Network of 250 MVA, which on a 2 MVA base is 0.8%; load loss of the replacement 19.0 kW, so R = 0.95%. A higher impedance protects the switchboard at the cost of some regulation.
```

A 2,000 kVA transformer with the usual 5% impedance would put 46 kA on a switchboard rated for 42 kA, which is not acceptable: a fault could damage the busbars or prevent the main breaker from clearing safely. Replacing the switchboard would cost far more than the transformer. Specifying 6% impedance keeps the fault current at 39.2 kA, within the rating, and the regulation at the tunnel peak, 3.04%, is still better than TX-1's today, because the larger transformer is less heavily loaded. The impedance goes into the specification in Chapter 10, with a tolerance, and the factory test confirms it.

The fault level also matters downstream. Every circuit breaker and fuse on the switchboard must be able to break the prospective fault current at its location, and the arc flash energy that a person working on live equipment could be exposed to depends on it as well. Any change of transformer requires the site's protection and fault level study to be redone by a competent electrical engineer.

## Inrush

When TX-1 is switched on, its core must reach the alternating flux that the supply voltage demands. In steady operation the flux swings between +1.65 T and −1.65 T, a quarter cycle out of step with the voltage. But at the instant of switching, the flux starts from wherever the core was left when it was last switched off, which may be a remanent flux of several tenths of a tesla, and the supply then drives it to change by the full swing implied by the voltage over the following half cycle.

If the switch closes at the worst moment, when the voltage passes through zero and the remanent flux has the same sign as the flux about to be built up, the flux tries to reach twice its normal peak plus the remanence: as an illustration, 2 × 1.65 + 0.8 = 4.1 T. Silicon steel saturates at about 2.0 T. Once the core saturates, its permeability collapses towards that of air, and the winding draws whatever current is needed to push the rest of the flux through air paths. That current, the inrush, can reach several times and in some cases more than ten times the rated current at its first peak, for a transformer of this size.

```figure
type: steps
title: Why switching on can saturate TX-1's core
caption: This is an illustration. The remanent flux is an assumed value; it depends on how and when the transformer was last switched off. Switching at a voltage peak, when the steady flux is passing through zero, gives no inrush at all.
- Normal peak flux density | 1.65 T
- Remanent flux left from the last switch-off | up to about 0.8 T
- Worst case at switch-on, 2 × 1.65 + 0.8 | 4.1 T demanded
- Saturation of silicon steel | about 2.0 T
- * Result | Core saturates for part of each cycle; large, one-sided current peaks
- Decay | Over a fraction of a second to a few seconds, as the winding's resistance damps the offset
```

Inrush current flows in one winding only, the one being energised, so it looks to the protection like a fault inside the transformer. It is lopsided, peaking in one half of each cycle, and rich in the second harmonic, twice the supply frequency. Differential relays on larger transformers use that second harmonic to recognise inrush and hold off tripping. Fuses cannot do that, so they are chosen with a time–current characteristic that lets the inrush pass while still clearing a real fault quickly.

Inrush has side effects beyond the protection. While it lasts it draws a large, distorted current from the network, which can cause a brief voltage dip for other customers on the same feeder, and the dip can upset sensitive equipment in the plant itself if another transformer is already running. When two transformers are connected in parallel and the second is switched on, its inrush can also drive the first, already energised transformer partly into saturation through the shared voltage dip, a so-called sympathetic inrush, which lasts longer and can trip protection that ignored the first event. Large installations reduce inrush with controlled switching, which closes each phase at the moment that matches the core's remanent flux, or with resistors briefly inserted at switch-on. For a 2,000 kVA unit fed by fuses, the usual approach is simpler: choose the fuses correctly and switch on the transformer with little or no load connected.

## When it goes wrong: the fuse that blew on switch-on

Before the plant's decision on TX-1's replacement, the engineers borrowed a 2,000 kVA unit from a hire fleet to test the changeover arrangements during a planned shutdown. It was connected in TX-1's place, and the HV fuses in the ring main unit were left as they were, because the contractor's job sheet said only "replace transformer". The first attempt to energise it blew one HV fuse.

The fuses had been chosen years earlier to suit TX-1: a rated current able to carry TX-1's 78.7 A full-load HV current continuously and a characteristic that would let TX-1's inrush through. The hired unit's full-load HV current is 2,000,000 ÷ (√3 × 11,000) = 105 A, a third higher, and its inrush is correspondingly larger. The old fuses were too small for both.

```figure
type: checklist
title: What a transformer change must include on the protection side
caption: This is an illustration of the plant's revised checklist; the protection study and settings are the responsibility of a competent electrical engineer, and fuse selection follows the fuse and transformer makers' tables and the network's requirements.
- x HV fuses or relay settings selected for the new transformer's rating and inrush
- x LV main circuit breaker rated for the new full-load current, with settings revised
- x Prospective fault current checked against every switchboard and breaker rating
- x Discrimination between the HV protection and the largest LV outgoing devices checked
- x Transformer temperature and pressure devices wired to alarm and trip as designed
- ? Arc flash assessment updated for the new fault level
```

The fuses were replaced with ones selected from the fuse maker's table for a 2,000 kVA, 11 kV transformer, and the energisation succeeded. The incident led to a rule in the plant's procedures: a transformer change is a protection change, and the job is not complete until the protection has been reviewed. Had the hire unit stayed in service, its LV main breaker, rated 2,500 A, would also have been undersized for its 2,667 A rated current.

## Exercise: the replacement's fault current

For the 2,000 kVA, 6.0% replacement, with R = 0.95%, on the plant's 250 MVA network:

1. What is the network's impedance on the transformer's 2 MVA base, and the symmetrical fault current?
2. With a combined X/R of about 6.5, what is the peak current?
3. By what factor do the short-circuit forces on its windings exceed those at its rated current?

**Answer.**

1. Z_network = 2 ÷ 250 × 100 = 0.8%. The rated LV current is 2,000,000 ÷ (√3 × 433) = 2,667 A, so I_sc = 2,667 × 100 ÷ (6.0 + 0.8) = 39.2 kA.
2. κ = 1.02 + 0.98 × e^(−3 ÷ 6.5) ≈ 1.64, so i_peak = 1.64 × √2 × 39.2 ≈ 91 kA.
3. The fault current is 100 ÷ 6.8 = 14.7 times rated, so the forces are about 14.7² = 216 times those at rated current, less than TX-1's 319 times, because the higher impedance limits the current more.
