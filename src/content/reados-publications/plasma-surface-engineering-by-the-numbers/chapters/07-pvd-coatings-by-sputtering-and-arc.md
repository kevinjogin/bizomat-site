---
book: plasma-surface-engineering-by-the-numbers
chapterSlug: pvd-coatings-by-sputtering-and-arc
order: 7
title: "PVD coatings by sputtering and arc"
description: "How magnetron sputtering and cathodic arc deposit hard nitride coatings, why crossed fields trap electrons, how fast metal is sputtered, and how reactive gas and bias shape the film."
draft: false
---

A PVD coating starts as a solid block of metal, the target, and ends as a layer a few micrometres thick on the parts, deposited atom by atom from the vapour. Physical vapour deposition covers several ways of turning the target into vapour; the two used for hard coatings on tools and dies are magnetron sputtering, in which ions from a plasma knock atoms out of the target, and cathodic arc evaporation, in which a small, intense arc spot boils metal off it. Either way, the metal travels through a low-pressure gas, reacts with nitrogen on the way or at the surface, and condenses on parts bombarded by ions from the bias supply, which pack the growing layer into a dense, hard film.

This chapter explains both processes, starting with the magnetron and the crossed electric and magnetic fields that make sputtering practical at low pressure. It works out how much chromium PV-1's targets sputter and how much ends up on order 27's inserts, explains reactive sputtering and its unstable poisoned mode, and how bias voltage changes the coating. It ends with a run in which fresh targets drifted into poisoned mode and the coating came out a third thinner than specified.

## Why a magnetron

Chapter 2's exercise showed that a plain glow cannot be sustained across PV-1's 100 mm gap at 0.5 Pa: electrons cross the gap without making enough ionising collisions. Raising the pressure would sustain the glow but scatter the sputtered atoms and make the coating porous. The magnetron solves the problem by keeping the electrons near the target for much longer.

Permanent magnets behind the target produce a magnetic field that arches over its surface, parallel to it, in a closed loop, a racetrack. The target is held at a few hundred volts negative, so a strong electric field points into it across the sheath. An electron in crossed electric and magnetic fields does not move along the electric field. It gyrates around a magnetic field line and, at the same time, drifts sideways at right angles to both fields, at a speed equal to the electric field divided by the magnetic field. Over the racetrack that drift carries the electrons round and round the loop, close to the target, where they ionise the gas many times before they escape.

```figure
type: formula
title: Electron motion in a magnetron's crossed fields
formula: v_drift = E ÷ B
formula: r_gyration = m × v ÷ (q × B)
caption: v_drift is the E × B drift speed (m/s), E the electric field (V/m) and B the magnetic flux density (T); r_gyration is the radius of gyration for a particle of mass m, charge q and speed v across the field. Electrons, being light, gyrate in tight circles and are trapped; ions, thousands of times heavier, gyrate in circles far larger than the magnetron and are hardly affected.
- E × B drift | sideways, round the racetrack
- r_e | about 0.25 mm for a 5 eV electron in 0.03 T
- r_i | about 68 mm for a 5 eV argon ion in 0.03 T
```

With a field of 0.03 T over the target, a 5 eV electron gyrates in a circle about 0.25 mm in radius: firmly tied to the field lines. A 5 eV argon ion gyrates in a circle about 68 mm in radius, larger than the magnetic region, so ions are not trapped; they fall straight into the target under the electric field and sputter it. In an electric field of 20 kV/m the drift speed is 20,000 ÷ 0.03, about 670 km/s, so an electron circles a racetrack a few hundred millimetres long millions of times a second.

The price of the magnetron is uneven erosion. Sputtering is concentrated under the racetrack, which wears a groove into the target, and only perhaps a quarter to a third of a flat target's material is used before the groove gets too deep. Rotating cylindrical targets and moving magnet arrays improve on that, at a cost.

## The case: how much chromium PV-1 sputters

PV-1 has four chromium targets, each run at about 5 kW, roughly 500 V and 10 A. Each argon ion striking the target at about 500 eV knocks out, for this illustration, about 1.2 chromium atoms on average, a sputter yield of the order published for chromium at that energy.

```figure
type: steps
title: Chromium sputtered by PV-1's four targets
caption: This is an illustration. The sputter yield and the share reaching the parts are assumptions for the case; the share depends strongly on the chamber's geometry, the load and the fixture, and is found by weighing coupons or targets.
- Ions per second at 10 A, 10 ÷ 1.602 × 10⁻¹⁹ | 6.2 × 10¹⁹ per target
- Atoms sputtered at a yield of 1.2 | 7.5 × 10¹⁹ per second per target
- Mass sputtered, × 52 g/mol ÷ N_A | 23 g per hour per target
- Four targets | about 93 g of chromium per hour
- * Share reaching the parts, about a fifth | about 18 g per hour
- The rest | Shields, walls, fixture, the opposite targets
```

Most of the chromium coats the chamber's shields and the fixture rather than the parts, which is normal: a planetary fixture spends much of each revolution facing away from any given target. The shields are cleaned or replaced regularly, because the coating that builds up on them eventually flakes and lands on parts as debris, which shows up as pits and nodules in the coating.

On order 27's rotating inserts, the shop's deposition rate for CrN is about 1.5 µm per hour, measured on witness coupons. A 4 µm CrN coating over a 0.3 µm chromium interlayer, which improves adhesion to the nitrided steel, takes about 2 hours 40 minutes for the CrN and 10 minutes for the interlayer at about 2 µm per hour.

## Reactive sputtering and poisoning

CrN is made by sputtering chromium in a mixture of argon and nitrogen: the chromium atoms combine with nitrogen on the growing film's surface. The nitrogen flow must be enough to make the film fully stoichiometric, one nitrogen atom per chromium atom, but nitrogen also reacts with the target itself.

At low nitrogen flows, the target surface stays metallic, sputters fast, and the film may be short of nitrogen. As the nitrogen flow rises, a nitride layer forms on the target faster than sputtering removes it. Nitride sputters much more slowly than metal, so the rate of metal leaving the target drops, less nitrogen is consumed by the film, the nitrogen pressure rises, the target nitrides further, and the process jumps abruptly into the poisoned mode, with a much lower deposition rate. Reducing the nitrogen flow does not bring it straight back: the target stays poisoned until the flow is reduced well below the point at which it poisoned. This hysteresis is the central difficulty of reactive sputtering.

```figure
type: compare
title: Metallic, transition and poisoned modes of a reactive sputtering target
cols: Target surface | Deposition rate | Target voltage at constant power | Film
rowhead: Mode
- Metallic | Clean metal | High | Higher | May be short of nitrogen
- * Transition | Partly nitrided | High, unstable without control | Intermediate | Dense, stoichiometric: the target operating point
- Poisoned | Covered in nitride | Much lower | Lower, for chromium nitride | Stoichiometric, but slow to grow
caption: General behaviour. For many metal–nitride pairs the target voltage falls as the target poisons, because the nitride releases more secondary electrons; the direction differs for some materials, so it is learned for each target material.
```

The best coatings and rates come from the unstable transition region, so PV-1 controls the nitrogen flow in a closed loop, adjusting it many times a second to hold the target voltage, or the intensity of a chromium emission line in the plasma's light, at a set point in the transition region.

## Bias and the structure of the film

Atoms condensing on a cool surface with little energy stick where they land and build a porous structure of narrow columns with voids between them. Ion bombardment during growth, from the bias voltage on the parts (Chapter 3), knocks loosely bound atoms into the voids, densifies the film and makes it harder and more adherent. Too much bombardment builds high compressive stress into the film and re-sputters it, and can make a thick coating flake off under its own stress.

The shop's CrN recipe for order 27 uses −80 V of pulsed bias during deposition, found by trials as the setting that gave dense, hard films with acceptable stress on H13. The etch step before deposition uses −200 V, high enough to sputter the surface clean. The bias current, recorded every run, confirms that the whole load is connected (Chapter 3).

Interlayers and gradients matter as much as the main coating. A thin metallic chromium layer at the start bonds to the freshly etched steel and accommodates the difference in stiffness and thermal expansion between steel and nitride. Many recipes then grade the nitrogen in over the first few tenths of a micrometre rather than switching it on at once, and some build the coating from many thin alternating layers, a multilayer or nanolayer structure, which stops cracks from running straight through the coating. Each such feature appears in the recipe as steps of gas flow, power and bias with their own times, and the run log records every step so that a failed coating can be traced to the step that went wrong.

## Cathodic arc evaporation

In cathodic arc PVD, a low-voltage, high-current arc of about 20 V and 60 to 150 A runs across the target's surface as a tiny spot that moves erratically. The spot is so intensely heated that it boils metal off explosively, and a large fraction of the metal leaves as ions rather than neutral atoms. That makes arc coatings dense and adherent and the deposition fast, which is why arc PVD is widely used for coating cutting tools with titanium aluminium nitride and similar coatings.

The arc also throws off small molten droplets, called macroparticles, a fraction of a micrometre to a few micrometres across, which land in the coating as nodules. They roughen the surface and can leave pinholes when they fall out. For cutting tools that rarely matters; for polished mould surfaces it can, and filtered arc sources, which steer the ions round a bend that the droplets cannot follow, or sputtering, are used instead. The shop chose sputtering for PV-1 because its customers' polished moulds and dies need a smooth finish.

## Common hard coatings and what they do

The coatings deposited this way are mostly nitrides, carbonitrides and carbon-based films, each chosen for a particular kind of wear.

```figure
type: compare
title: Common PVD hard coatings
cols: Character | Typical uses
rowhead: Coating
- Titanium nitride, TiN | Gold colour, hard, the original general-purpose coating | Drills, taps, punches, decorative wear surfaces
- * Chromium nitride, CrN | Silver-grey, tough, resists corrosion and the sticking of aluminium and plastics | Die-casting and moulding tools, forming dies, machine parts
- Titanium aluminium nitride, TiAlN or AlTiN | Dark violet to black, keeps its hardness and resists oxidation at high cutting temperatures | Carbide end mills and drills for dry and hard machining
- Aluminium chromium nitride, AlCrN | Grey, oxidation resistant | Hobs, milling and forming tools
- Diamond-like carbon, DLC | Black, low friction, hard | Sliding parts, aluminium machining, engine and pump components
caption: General characteristics; the coating supplier's data and trials on the actual tool and work material decide a real choice. The Library's chapter on cutting tool materials and coatings discusses coatings from the machinist's side.
```

For order 27, CrN was chosen because molten aluminium wets and sticks to steel, a failure called soldering, and chromium nitride resists that far better than bare or nitrided steel, while being tough enough not to crack under the thermal cycling of each casting shot. On the toolmaker's carbide cutters the shop deposits a titanium aluminium nitride by sputtering from composite targets, a separate recipe on the same machine. The Library's [cutting tool materials and coatings](/reados/collections/machining-and-metal-parts/cutting-tool-materials-and-coatings/) chapter explains why such coatings suit cutting edges.

## Temperature limits for the parts

Parts in PV-1 typically reach 300 to 450 °C during heating, etching and deposition, and higher temperatures generally give denser, better-adhering coatings. The limit is the part. H13 tempered at well above 500 °C to reach 46 HRC is unaffected by a 450 °C coating cycle; high-speed steels, tempered even higher, are also safe. But a plastic mould steel tempered at a lower temperature, a part with soldered or brazed joints, or a precision part whose dimensions depend on stress relief at low temperature may be damaged. The shop asks for each part's tempering temperature before quoting, and for sensitive parts runs a low-temperature recipe, below about 250 °C, with longer cycle times and a somewhat less dense coating. Duplex treatments like order 27's also need the coating temperature kept below the nitriding temperature, so that nitrogen does not diffuse out of the case or the compound layer start to form during coating.

## When it goes wrong: fresh targets, thin coating

After PV-1's four chromium targets were replaced, the first production run, a load including order 27's second batch, produced CrN that measured only about 2.7 µm thick on the witness coupons instead of 4 µm, with a darker, more golden colour than usual. The run log showed the target voltages steady but about 90 V lower than the old targets had run, and the nitrogen flow controller steady at its usual setting.

The closed-loop nitrogen control had been left in fixed-flow mode after the target change, with the flow set from the worn targets' recipe. Fresh, flat targets sit further from the magnets than eroded ones, so the magnetic field at their surface is weaker and they sputter less metal for the same power; the same nitrogen flow was now too much, and the targets ran poisoned. The low voltage, which for chromium means poisoned, had been visible in the log all along, but nobody was watching for it.

```figure
type: checklist
title: After every target change on PV-1
caption: This is an illustration. It shows the shop's revised procedure.
- x Burn in the new targets on shutters before any parts are loaded
- x Re-run the reactive gas sweep to find the transition region for the new targets
- x Return the nitrogen control to closed loop on target voltage, with the new set point
- x Run witness coupons and measure thickness before releasing production loads
- x Alarm on target voltage outside its band during a run
- ? Record target life in kilowatt-hours to predict the next change
```

The thin batch was stripped and recoated after the closed-loop control was restored and re-tuned. The run sheet now carries an alarm band on each target's voltage, and a target change is treated as a process change that needs a qualification run before any customer's parts go in.

## Exercise: a titanium target

A coater runs a titanium target at 6 kW and 600 V in argon. Assume a sputter yield of 0.9 titanium atoms per argon ion at that energy, and a molar mass of 47.87 g/mol.

1. What is the target current, and how many titanium atoms are sputtered per second?
2. How many grams of titanium are sputtered per hour?
3. If a fifth reaches the parts, and the parts have 1.0 m² of surface, roughly what thickness of titanium is deposited per hour (density 4,510 kg/m³)?

**Answer.**

1. I = 6,000 ÷ 600 = 10 A, so 10 ÷ 1.602 × 10⁻¹⁹ × 0.9 = 5.6 × 10¹⁹ atoms per second.
2. 5.6 × 10¹⁹ × 47.87 ÷ 6.022 × 10²³ × 3,600 = 16.1 g per hour.
3. A fifth is 3.2 g per hour. Spread over 1.0 m², that is 3.2 × 10⁻³ ÷ 4,510 = 7.1 × 10⁻⁷ m, about 0.7 µm per hour. A nitride deposits somewhat thicker per gram of metal, because the nitrogen adds volume, which is one reason rates are always measured on witness coupons rather than calculated.
