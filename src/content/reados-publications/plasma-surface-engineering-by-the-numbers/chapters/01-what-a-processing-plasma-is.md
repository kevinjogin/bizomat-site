---
book: plasma-surface-engineering-by-the-numbers
chapterSlug: what-a-processing-plasma-is
order: 1
title: "What a processing plasma is"
description: "What a low-pressure processing plasma is: how few of its atoms are ionised, why its electrons are hot while its gas is not, and how density, Debye length and mean free path describe it."
draft: false
---

Open the viewing port of a plasma nitriding vessel during a run and you see the parts wrapped in a soft violet glow, a millimetre or two thick, following every edge and face. Look into a PVD coater and the chromium targets glow blue-white over a dark chamber. Both glows come from the same kind of matter: a gas at low pressure in which a tiny fraction of the atoms have been ionised, so that free electrons and positive ions move among a large crowd of ordinary neutral atoms and molecules. That partly ionised gas is a plasma, and its behaviour at a surface is what cleans, heats, nitrides and coats the parts.

This chapter describes a processing plasma with the half-dozen numbers that matter: pressure, gas density, the fraction ionised, the temperatures of the electrons and the gas, the Debye length and the mean free path. It works them for the shop's two machines, nitriding vessel PN-1 at 300 Pa and PVD coater PV-1 at 0.5 Pa, converting the pressures with the BIZOMAT pressure converter. It ends with a pressure gauge that read twice the true pressure because nobody had told it the gas was mostly hydrogen.

## A gas with a few charged particles in it

Every gas contains a handful of ions, made by cosmic rays and natural radioactivity, but far too few to matter. A processing plasma is made by driving a current through the gas: electrons accelerated by an electric field collide with gas molecules hard enough to knock electrons out of them, and those new electrons are accelerated in turn. The ionisation balances the losses, mainly ions and electrons lost to the walls, at a steady level.

Steady does not mean dense. In PN-1's working space, nitrogen and hydrogen at 300 Pa and a gas temperature of about 520 °C contain about 2.7 × 10²² molecules per cubic metre. A typical glow discharge has about 10¹⁶ electrons and the same number of ions per cubic metre, so roughly one molecule in three million is ionised. In PV-1 at 0.5 Pa the gas is 400 times thinner and the plasma near the magnetrons somewhat denser, so the ionised fraction rises to about one in six thousand. Both are weakly ionised plasmas: almost all the matter in the chamber is still neutral gas.

```figure
type: compare
title: The shop's two plasmas in numbers
cols: PN-1 plasma nitriding | PV-1 magnetron sputtering
rowhead: Quantity
- Working pressure | 300 Pa (3 mbar, 2.25 Torr) | 0.5 Pa (0.005 mbar, 3.75 mTorr)
- Gas temperature | about 520 °C | about 300 °C at the parts
- Gas molecules per m³, n = p ÷ kT | 2.7 × 10²² | 6.3 × 10¹⁹
- Electrons per m³, typical | about 10¹⁶ | about 10¹⁶ in the bulk, more near the targets
- * Fraction ionised | about 4 × 10⁻⁷ | about 1.6 × 10⁻⁴
- Mean free path of a molecule | about 60 µm | about 28 mm
caption: This is an illustration. Gas densities from the ideal gas law with Boltzmann's constant; mean free paths from kinetic theory with molecular diameters of 0.37 nm for nitrogen and 0.36 nm for argon. Electron densities are typical orders of magnitude for these discharges, not measurements of the shop's machines.
```

## Pressure and its units

Plasma machines are full of pressure readings in mixed units: pascals on the controller, millibar on one gauge, torr or millitorr on an imported data sheet. Getting them wrong by a factor of 100 or 133 is easy and makes every later number wrong.

The [pressure converter](/tools/pressure-converter/) converts a pressure or stress between SI, metric and US customary units and lists it in every unit at once. Entered as 300 Pa, PN-1's working pressure is 3 mbar and 2.25 mmHg, the same as 2.25 Torr; PV-1's 0.5 Pa is 0.005 mbar and 0.00375 mmHg, which sputtering data usually quote as 3.75 mTorr. Atmospheric pressure, 101,325 Pa, is 338 times PN-1's pressure and over 200,000 times PV-1's.

The shop's procedures state every pressure in pascals, with millibar in brackets where an older gauge displays it, and the run sheets carry a small conversion table so that nobody converts in their head. Every pressure in a plasma process is absolute, measured from a perfect vacuum, not gauge pressure measured from the atmosphere; a reading of "−1 bar" on a compressed-air style gauge says nothing useful about a plasma chamber, because the whole working range of both machines lies within the last 0.3% of that gauge's scale. The shop's new operators are shown this on their first day, with the two machines' working pressures marked on a printed scale that runs from atmosphere down to 0.1 Pa. The Library's [Vacuum by the Numbers](/reados/publications/vacuum-by-the-numbers/) explains the gauges and pumps behind these readings.

## Hot electrons in a cool gas

The most surprising property of a glow discharge is that its electrons and its gas are at completely different temperatures. Electrons are so light that, when they collide with a molecule, they bounce off having given up only a tiny fraction of their energy, the way a table-tennis ball bounces off a bowling ball. The electric field keeps feeding them energy between collisions, so they settle at an average energy of a few electron-volts. Physicists express this as an electron temperature: 2 eV corresponds to about 23,000 K.

The ions and the neutral gas, being heavy, share energy efficiently with each other and with the chamber walls and stay near the temperature of their surroundings. In PN-1 that is the 520 °C of the load; in PV-1, a few hundred degrees. A plasma whose electrons are at 23,000 K while its gas is at a few hundred degrees is called non-thermal, and it is exactly what surface engineering needs: the hot electrons break molecules apart and ionise them, producing reactive nitrogen and energetic ions, without the gas being hot enough to melt anything.

```figure
type: compare
title: Temperatures in PN-1's glow discharge
cols: Energy | Temperature | Role
rowhead: Particle
- * Electrons | about 2 eV average | about 23,000 K | Ionise and break up molecules
- Ions | a fraction of an eV in the glow | near the gas temperature, until accelerated in the sheath | Carry energy to the surface (Chapter 3)
- Neutral gas | about 0.07 eV | about 520 °C, 793 K | Carries most of the mass; supplies nitrogen
caption: This is an illustration. Electron temperatures of 1 to 5 eV are typical of glow discharges; 1 eV corresponds to 11,600 K. The ions gain most of their energy only in the thin sheath at the part's surface, which Chapter 3 explains.
```

## What the electrons do to the gas

An electron with an average energy of 2 eV cannot, on average, ionise anything: it takes 15.8 eV to remove an electron from an argon atom, 15.6 eV from a nitrogen molecule and 15.4 eV from a hydrogen molecule. The electrons' energies are spread out, though, and the small fraction in the high-energy tail of the distribution does the ionising. That is why the ionised fraction is so small, and why a modest rise in electron temperature raises the ionisation rate steeply.

Electrons with less energy still do useful work. Collisions of a few electron-volts excite molecules into higher energy states, from which they fall back by emitting light: the violet-pink of nitrogen, the pale blue-violet of argon. The glow is therefore a direct picture of where the energetic electrons are, and its colour and brightness change with the gas mixture and the conditions. Many plasma machines carry an optical emission spectrometer that watches particular spectral lines to confirm the gas mixture or detect a leak of air, whose oxygen and water show up as lines of their own.

Collisions of around 10 eV break molecules apart. The nitrogen molecule is held together by one of the strongest bonds in chemistry, which takes about 9.8 eV to break, which is why nitrogen gas on its own hardly reacts with steel at nitriding temperatures. In the plasma, electron collisions split some of it into nitrogen atoms and form excited and ionised species that react readily with the steel's surface. Hydrogen molecules are split as well, and atomic hydrogen helps remove the oxide films that would otherwise block nitrogen from entering the steel. The plasma, in short, turns an inert gas into an active one at a temperature where the steel's core properties are not harmed.

```figure
type: compare
title: Energies that matter in PN-1's gas
cols: Energy needed | What it gives the process
rowhead: Process
- Excitation of nitrogen and argon | a few to about 12 eV | The glow's light; monitoring by its spectrum
- Dissociation of N₂ into atoms | about 9.8 eV | Active nitrogen for nitriding
- Ionisation of H₂ | about 15.4 eV | Ions; atomic hydrogen helps reduce oxides
- * Ionisation of N₂ | about 15.6 eV | Ions that carry energy to the parts
- Ionisation of Ar | about 15.8 eV | Ions for sputter cleaning and sputtering
caption: Approximate energies from published atomic and molecular data. With an average electron energy of about 2 eV, only the high-energy tail of the electrons ionises and dissociates, so the rates depend steeply on the electron temperature.
```

## Debye shielding and quasi-neutrality

A plasma conducts electricity well, because its free electrons move easily. Put a charged object into it and the electrons and ions rearrange themselves around it so as to cancel its field within a short distance: a cloud of opposite charge gathers around the object and shields it from the rest of the plasma. The distance over which this shielding happens is the Debye length.

```figure
type: formula
title: Debye length and plasma frequency
formula: λ_D = √(ε₀ × T_e ÷ (n_e × e))
formula: f_pe = (1 ÷ 2π) × √(n_e × e² ÷ (ε₀ × m_e))
caption: λ_D is the Debye length (m), ε₀ the permittivity of free space, T_e the electron temperature in volts (numerically equal to its value in eV), n_e the electron density (per m³), e the electron charge and m_e its mass. f_pe is the electron plasma frequency, the natural frequency at which the electrons oscillate if disturbed.
- λ_D | about 0.1 mm for 2 eV and 10¹⁶ m⁻³
- f_pe | about 900 MHz for 10¹⁶ m⁻³
```

For PN-1's plasma, with an electron temperature of 2 eV and 10¹⁶ electrons per cubic metre, the Debye length is about 0.105 mm. A plasma ten times less dense has a Debye length about three times longer, 0.33 mm; one ten times denser and hotter, at 3 eV and 10¹⁷ m⁻³, has 0.04 mm.

Two consequences follow. First, over any distance much larger than the Debye length the plasma is very nearly neutral, with equal numbers of positive and negative charges: physicists call this quasi-neutrality. The chamber, hundreds of millimetres across, is thousands of Debye lengths wide, so the glow region behaves as a neutral, conducting body. Second, the regions where the plasma meets a surface, which are only a few Debye lengths thick, are not neutral at all. They carry strong electric fields, and almost all of the voltage applied to the parts appears across them. Those regions are the sheaths of Chapter 3, and they are where the work is done.

The electron plasma frequency, about 900 MHz at 10¹⁶ m⁻³, sets how quickly the electrons can respond to a change of field. It explains why plasmas can be driven by radio-frequency supplies at 13.56 MHz, well below it, and why pulsed DC supplies switching at tens of kilohertz look like steady DC to the electrons.

## Collisions and the mean free path

The other length that matters is the mean free path: the average distance a molecule or ion travels before hitting a neutral molecule. It falls in inverse proportion to pressure. In PN-1 at 300 Pa it is about 60 µm, so ions crossing the 5 mm sheath of Chapter 3 collide many times on the way and arrive at the part with only part of the energy the sheath voltage could give them. In PV-1 at 0.5 Pa it is about 28 mm, so sputtered chromium atoms travel from target to part, about 100 mm, with only a few collisions, mostly in straight lines.

That single difference, a mean free path shorter or longer than the distances in the machine, explains most of the practical differences between the two processes. Nitriding works at a pressure high enough that the glow wraps closely around the parts and treats holes and recesses that are wide enough for the glow to enter. PVD works at a pressure low enough that the coating flux travels in lines of sight, which is why parts must rotate and why deep holes coat poorly (Chapter 8).

```figure
type: steps
title: Why the two machines run at such different pressures
caption: This is an illustration. It shows the reasoning, using the numbers in the comparison above.
- PN-1 at 300 Pa: mean free path 60 µm, much shorter than the 5 mm sheath | Ions collide on the way in; the glow hugs every surface
- Nitrogen supplied by the dense gas, activated by the plasma | Nitriding needs plenty of active nitrogen at the surface
- PV-1 at 0.5 Pa: mean free path 28 mm, comparable to target-to-part distances | Sputtered atoms fly almost straight to the parts
- * Lower pressure gives denser, harder coatings | Atoms arrive with more energy and fewer gas collisions
```

## When it goes wrong: the gauge that did not know about hydrogen

Soon after PN-1 was installed, its first runs nitrided more shallowly than the trial parts at the supplier's works had, under what looked like identical settings. The controller held the pressure at 300 Pa by its Pirani gauge, which measures pressure through the heat a hot wire loses to the gas.

A Pirani gauge is calibrated for one gas, usually nitrogen or air. The heat a gas carries away depends strongly on what the gas is, and hydrogen, whose light molecules move fast, carries heat away far better than nitrogen. In PN-1's mixture of 25% nitrogen and 75% hydrogen, the gauge saw much more heat loss than nitrogen at 300 Pa would cause, and reported a pressure well above the true one. The controller, believing the pressure was high, held it lower than intended.

```figure
type: compare
title: PN-1's pressure by two gauges during the same run
cols: Pirani gauge, nitrogen calibration | Capacitance manometer | Comment
rowhead: Condition
- Pumping down in air | 300 Pa | 300 Pa | Gas the Pirani was calibrated for
- * Running in 25% N₂ and 75% H₂ | 300 Pa displayed | about 140 Pa | Pirani reads high in hydrogen-rich gas
- After the controller was moved to the manometer | 650 Pa | 300 Pa | Glow and case depth as at the supplier
caption: This is an illustration. The size of a Pirani gauge's error depends on the gas mixture and the gauge; the gauge maker's correction curves give it. A capacitance manometer measures pressure as force on a diaphragm and reads the same whatever the gas.
```

The fault was found by fitting a capacitance manometer, which senses pressure mechanically through the deflection of a thin diaphragm and does not depend on the gas, and comparing the two gauges during a run. The controller now regulates on the capacitance manometer, the Pirani gauge is used only during pump-down, and the run sheet states which gauge every recorded pressure came from, so that a run can be compared fairly with any other.

## Exercise: a sputtering pressure from a data sheet

A coating supplier's data sheet recommends sputtering chromium nitride at 4 mTorr total pressure.

1. What is that in pascals and millibar?
2. What is the gas density at 300 °C, and the mean free path of argon?
3. Is the target-to-part distance of 100 mm in PV-1 long or short compared with the mean free path?

**Answer.**

1. 4 mTorr is 0.004 Torr. The [pressure converter](/tools/pressure-converter/), entered as 0.004 mmHg, gives 0.533 Pa and 0.00533 mbar, close to PV-1's 0.5 Pa.
2. n = p ÷ kT = 0.533 ÷ (1.381 × 10⁻²³ × 573) = 6.7 × 10¹⁹ molecules per m³. The mean free path is kT ÷ (√2 π d² p) = 1.381 × 10⁻²³ × 573 ÷ (1.414 × 3.14 × (0.36 × 10⁻⁹)² × 0.533) = about 26 mm.
3. The 100 mm path is about four mean free paths, so a sputtered atom typically makes a few collisions on the way: enough to scatter some atoms and slow others, not enough to stop them reaching the parts in roughly straight lines. Halving the pressure doubles the mean free path and makes the flux more directional, while doubling it scatters more of the flux and lowers the energy with which atoms arrive, which tends to give a less dense coating.
