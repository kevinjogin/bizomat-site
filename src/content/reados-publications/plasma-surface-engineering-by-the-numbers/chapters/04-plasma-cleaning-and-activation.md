---
book: plasma-surface-engineering-by-the-numbers
chapterSlug: plasma-cleaning-and-activation
order: 4
title: "Plasma cleaning and activation"
description: "What plasma can and cannot clean, how sputter etching and hydrogen remove oxides and how fast, how plasma activates plastics, and why wet precleaning still decides the result."
draft: false
---

Every plasma treatment starts with a surface that is not quite clean. Machined and polished steel carries a few nanometres of oxide, a film of oil or cutting fluid residue, fingerprints, polishing compound and adsorbed water. A nitriding vessel or coater cannot treat what it cannot reach: nitrogen will not diffuse through a stubborn oxide, and a coating deposited on a film of oil adheres to the oil. The first minutes of every plasma run are therefore spent cleaning, and plasma is very good at it, within limits that are easy to forget.

This chapter explains the two ways a plasma cleans metal, sputter etching by energetic ions and chemical cleaning by hydrogen and oxygen, and works out how fast sputtering removes material, which shows why plasma cleaning is a final polish rather than a degreaser. It sets up the cleaning gas mixture for PN-1 with the BIZOMAT gas mixture tool, describes plasma activation of plastics before bonding and printing, and ends with polishing compound that turned order 27's first coating trial into a lesson in precleaning.

## What plasma cleaning can remove

Plasma cleaning removes very thin layers: a few nanometres of oxide, a monolayer of adsorbed water, a thin film of residual organic contamination. It does so slowly by the standards of a wash line, at tens of nanometres per minute at best. A fingerprint is perhaps a micrometre of oils and salts; a smear of polishing compound may be ten micrometres of wax and abrasive. At tens of nanometres a minute, removing those would take hours, and in the meantime the contamination would be cracking, outgassing and sputtering onto everything nearby, including the chamber walls and other parts.

That is why plasma cleaning always follows wet cleaning. The shop's precleaning for order 27 is an alkaline ultrasonic wash, rinses in deionised water, a final rinse in a water-displacing solvent and vacuum drying, after which the parts are handled only with clean nitrile gloves. Plasma cleaning then removes the last few nanometres that wet cleaning leaves, which is a job it does better than any wet process.

## Outgassing before the plasma starts

Cleaning really begins with the pump-down. Water adsorbed on the parts, the fixtures and the chamber walls desorbs slowly under vacuum, and any left when the plasma starts is split by the electrons into hydrogen and oxygen, and the oxygen re-oxidises the surfaces the plasma is trying to clean. Porous or contaminated parts, such as castings, parts with deep blind holes or parts stored in a damp place, keep releasing gas for a long time.

The shop therefore treats the pump-down as a measurement, not a wait. PN-1 must reach its base pressure, below 5 Pa for this process, and pass a rate-of-rise test with the pumps isolated, before the heat-up starts; PV-1 must reach a base pressure of a few thousandths of a pascal. A load that takes much longer than usual to reach base pressure, or whose pressure rises quickly when the valve is closed, is carrying water or contamination, and the run sheet records the time taken so that a slow load can be traced. The Library's [Vacuum by the Numbers](/reados/publications/vacuum-by-the-numbers/) explains rate-of-rise testing and the gas loads from water.

Heating helps. Water leaves a surface far faster when it is warm, so both machines heat the load during or soon after pump-down, PN-1 with the glow itself and PV-1 with radiant heaters, before the main cleaning step. The first part of the heat-up therefore cleans by desorption before the ions do any work at all.

## Sputter etching

Ions striking a surface with more than a few tens of electron-volts knock atoms out of it: sputtering. In cleaning, sputtering removes the oxide and adsorbed layers atom by atom. The rate depends on how many ions arrive, how many atoms each removes, the sputter yield, and how densely the atoms are packed.

```figure
type: formula
title: Removal rate by sputter etching
formula: Removal rate = (J_i ÷ e) × Y × (M ÷ N_A) ÷ ρ
caption: J_i is the ion current density (A/m²), e the electron charge, Y the sputter yield (atoms removed per ion), M the molar mass of the surface material (kg/mol), N_A Avogadro's number and ρ the density (kg/m³). The result is in metres per second. Yields depend on the ion, its energy and the target material, and are taken from published measurements or the equipment maker's data.
- J_i ÷ e | ions arriving per m² per second
- Y | atoms removed per ion
- M ÷ N_A ÷ ρ | volume of one atom's share of the solid
```

For PV-1's etch step, Chapter 3's argon plasma gives about 10.5 A/m² at the parts with 200 V of bias. If each argon ion at that energy removes about half an atom of iron on average, an assumed yield for this illustration, the rate is (10.5 ÷ 1.602 × 10⁻¹⁹) × 0.5 × (0.05585 ÷ 6.022 × 10²³) ÷ 7,874 = 3.9 × 10⁻¹⁰ m/s, about 23 nm per minute. A native oxide of a few nanometres goes in well under a minute; a 20 nm film formed during handling in about one minute. The shop etches for fifteen minutes, both to be sure and because the etch also heats the parts towards coating temperature, but it does not expect the etch to remove anything thicker than tens of nanometres.

Sputter etching has side effects. The removed atoms must go somewhere, and some land on neighbouring parts and the fixture. Edges and points etch faster because the field and the ion flux concentrate there. And ions with too much energy roughen a polished surface. A mould maker's mirror-polished cavity can lose its finish if etched too long at too high a voltage, so the shop agrees the etch time with the customer for polished parts.

## Chemical cleaning with hydrogen and oxygen

The second mechanism is chemistry. In a hydrogen-containing plasma, the electrons split hydrogen molecules into atoms and ions that react with oxides to form water, which is pumped away. That works at much lower ion energies than sputtering and does not roughen the surface, so it is the main cleaning step in plasma nitriding, where hydrogen is plentiful. An oxygen plasma does the opposite job on organic films: oxygen atoms and ions oxidise hydrocarbons to carbon dioxide and water. It is excellent for removing thin organic residues from metals that tolerate a little oxidation, and is used widely on electronics and plastics, but it is not used before nitriding or on parts that must stay oxide-free.

## The case: PN-1's cleaning mixture

PN-1 cleans order 27's inserts during heat-up, in a mixture of 70% argon and 30% hydrogen by volume at 100 Pa, holding the load at about 400 °C before the nitriding gas is admitted. Argon provides heavy ions for a gentle sputter component; hydrogen reduces oxides.

The [gas mixture properties tool](/tools/gas-mixture-properties/) works out, for up to three perfect gases, the mixture's molar mass, mass fractions, gas constant, specific heats, density, speed of sound and the partial pressure of each component, and checks one partial pressure against a limit. With argon (39.948 kg/kmol), hydrogen (2.016 kg/kmol) and no third gas, at 0.1 kPa and 400 °C:

```figure
type: steps
title: PN-1's cleaning mixture, 70% argon and 30% hydrogen at 100 Pa and 400 °C
caption: This is an illustration. Results from the gas mixture properties tool with c_p values of 0.520 kJ/(kg·K) for argon and 14.30 kJ/(kg·K) for hydrogen. Mole fractions equal volume fractions for ideal gases, so they are set by the ratio of the two gases' flows.
- Mixture molar mass | 28.57 kg/kmol
- Partial pressure of hydrogen, 0.30 × 100 Pa | 30 Pa
- Partial pressure of argon | 70 Pa
- Mass fraction of hydrogen | about 2%
- * Density of the mixture | about 0.0005 kg/m³
```

Two things in the result surprise people. By mass, the mixture is 98% argon: hydrogen is so light that 30% of the molecules are only 2% of the mass, which matters if gas is bought or metered by mass. And the density, about half a gram per cubic metre, is less than a two-thousandth of air's, which is why such small flows of gas keep the chamber supplied.

The mixture is set by the flow controllers, which meter gas in standard cubic centimetres or standard litres per minute: volumes the gas would occupy at 0 °C and one atmosphere. A ratio of 1.4 standard litres per minute of argon to 0.6 of hydrogen gives the 70:30 mixture. Chapter 5 works out what those standard flows become at the chamber's pressure and temperature, where the same gas occupies hundreds of times the volume.

## Plasma activation of plastics

Plasma also changes surfaces chemically without removing anything, and that is how plastic parts are prepared for bonding, painting and printing. Polyethylene, polypropylene and many other plastics have low surface energies: liquids bead up on them instead of wetting them, and adhesives and inks do not grip. An oxygen-containing plasma, a corona discharge or an atmospheric-pressure plasma jet breaks bonds at the outermost molecular layers and attaches oxygen-containing groups that make the surface more polar and raise its surface energy. Water then spreads rather than beading, and adhesives wet the surface and bond to it.

The effect is measured with a contact angle instrument or, on the shop floor, with test inks of known surface tension: if an ink of a given value wets the surface without drawing back into droplets within a couple of seconds, the surface energy is at least that value. The Library's [Adhesive Bonding by the Numbers](/reados/publications/adhesive-bonding-by-the-numbers/) explains why surface energy decides wetting and adhesion.

```figure
type: compare
title: Plasma activation of a polypropylene part
cols: Before treatment | Straight after treatment | After two weeks in store
rowhead: Measure
- Water contact angle | about 95° | about 45° | about 65°
- Highest test ink that wets | about 30 mN/m | above 50 mN/m | about 40 mN/m
- * Suitable for the adhesive in use | No | Yes | Marginal
caption: This is an illustration. It shows typical behaviour. Activation partly fades with time as the polymer surface rearranges, so treated parts are bonded, painted or printed within the time the process has been qualified for.
```

Activation fades. Over days to weeks, polymer chains at the surface rearrange and bury some of the polar groups, so the surface energy drifts back down. Production lines that activate plastics therefore bond or print soon after treatment, and qualify the longest allowed delay by test.

## Atmospheric plasma on a production line

Not every plasma treatment needs a vacuum chamber. Corona treaters, in which a high-frequency high voltage between an electrode and a roller makes a thin, filamentary discharge in air, treat plastic film at line speeds of hundreds of metres a minute before printing or laminating. Atmospheric-pressure plasma jets blow an activated gas stream from a nozzle onto a part and are mounted on robots to treat the bonding line of a moulded housing just before the adhesive bead is applied.

Their physics is the same in principle as the glow in PN-1, but at atmospheric pressure the mean free path is a fraction of a micrometre, so the discharge must be kept in thin filaments or very short gaps and driven at high frequency to avoid turning into an arc. They make ozone and ultraviolet light, which must be extracted and shielded, and their effect depends strongly on the distance and speed of the nozzle over the part, which a production cell controls and records. For the shop's work on steel tools they are not used; they belong to the plastics and assembly lines of its customers.

## When it goes wrong: polishing compound on order 27

The toolmaker sent four sample inserts for a duplex trial before the full order. Their working faces had been polished to a mirror finish, and they arrived wrapped in paper. The shop's goods-in inspection recorded them as clean. In PV-1, during the etch step, the arc counter recorded about 15 arcs a minute against the usual fewer than one, and after coating, two of the four inserts showed flaking at the edges of the polished faces in the Rockwell indentation test (Chapter 9).

The cause was polishing compound: a wax-based paste with fine abrasive, pressed into the micro-scratches at the edges of the polished faces and in the corners between faces. A thin, transparent residue had survived the standard wash because the paste's wax needed a hotter and longer alkaline wash to soften it. In the chamber it outgassed, charged up and arced, and the coating grown over it had nothing sound to hold on to.

```figure
type: decision
title: Changing the precleaning for polished parts
caption: This is an illustration. The water-break test is quick and sensitive to oily films; it does not detect every contaminant, so it supplements rather than replaces process control.
- Etch longer at higher voltage to burn the residue off | Slow, roughens the polish, spreads contamination | Not adopted
- Ask the toolmaker to clean the parts | Shifts responsibility without proving the result | Not adopted alone
- * Hotter, longer alkaline ultrasonic wash for polished parts, plus a water-break test before loading | Removes the wax; the test catches oily films | Adopted
```

The water-break test is simple: after the final rinse, a clean surface holds an unbroken film of water for some seconds, while an oily one breaks the film into islands and droplets. The shop now applies it to every polished part before loading, and asks toolmakers to state the polishing compound used, so that the wash can suit it.

## Exercise: etching a carbide cutter

Before coating, a batch of carbide cutters is etched in argon at the same current density, 10.5 A/m². Assume, for this illustration, a sputter yield of 0.3 atoms per ion for the tungsten carbide surface, an average molar mass per atom of 0.098 kg/mol and a density of 15,600 kg/m³.

1. What is the removal rate in nanometres per minute?
2. How long does it take to remove a 10 nm oxide and contamination layer?
3. Why would the shop still etch for longer?

**Answer.**

1. (10.5 ÷ 1.602 × 10⁻¹⁹) × 0.3 × (0.098 ÷ 6.022 × 10²³) ÷ 15,600 = 2.05 × 10⁻¹⁰ m/s, about 12 nm per minute.
2. 10 ÷ 12.3 ≈ 0.8 minutes.
3. Because the yield is an assumption and the current density varies over the load, because the etch also brings the cutters to coating temperature, and because the cutting edges, where adhesion matters most, are where contamination collects. The etch time is set by trials that measure adhesion, not by this calculation alone; the calculation shows only that the etch cannot be expected to remove anything thicker than a few tens of nanometres.
