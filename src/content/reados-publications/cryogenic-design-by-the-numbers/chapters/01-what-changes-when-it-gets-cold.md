---
book: cryogenic-design-by-the-numbers
chapterSlug: what-changes-when-it-gets-cold
order: 1
title: "What changes when it gets cold"
description: "Why heat capacity collapses, why pure metals conduct better and alloys worse, why contraction stops below 40 K, the price of a cold watt, CT-40's layout, and a cold plate made of brass."
draft: false
---

An engineer who designs for room temperature carries a set of constants in their head: copper's conductivity is about 390 W/(m·K), steel's specific heat about 460 J/(kg·K), aluminium's expansion about 23 µm/(m·K). Below about 100 K, none of those numbers holds. Some properties fall by factors of ten or a thousand, some rise, and some stop changing altogether. A cryogenic design that uses room-temperature constants can be wrong by more than the margin of any safety factor, and wrong in either direction.

This chapter explains, in engineering terms, why the properties change: the heat a solid stores, the heat it conducts and the way it contracts all come from the same two populations, the vibrations of its atoms and its conduction electrons, and both behave differently when the solid is cold. It then shows what a watt of heat costs at low temperature, introduces CT-40, the test cryostat that the rest of the book designs, and ends with a cold plate that the workshop made from the wrong copper.

## Phonons and electrons

The atoms in a solid vibrate about their places in the crystal. Those vibrations travel through the lattice as waves, and quantum mechanics allows each wave to hold energy only in whole packets, called phonons. At room temperature, almost every possible wave is excited and the solid stores heat as classical physics predicts. As it cools, the high-frequency waves freeze out first, because a phonon of high frequency needs more energy than the lattice's thermal motion can supply. Debye's model of this gives a heat capacity that falls as the cube of the absolute temperature at low temperatures.

Metals also have conduction electrons, which behave as a degenerate gas, or more precisely, as Landau showed, as a Fermi liquid of quasi-particles. Only the electrons within a thin band of energies near the top of that gas can take up heat, and the width of the band is proportional to temperature, so the electrons' heat capacity falls only in proportion to the temperature. It is negligible at room temperature beside the phonons, but because the phonons fall as T³ and the electrons only as T, the electrons take over near a few kelvins. Abrikosov, Gor'kov and Dzyaloshinskii's text, which this book uses as its map, derives both parts with the methods of quantum field theory, together with the interaction between electrons and phonons that governs conduction and, in some metals, superconductivity.

NIST's data for copper show both effects. Between 20 K and 10 K, copper's specific heat falls from 7.51 to 0.857 J/(kg·K), a factor of 8.8 for a halving of temperature, close to the 2³ = 8 of the cube law. At 4 K it is 0.099 J/(kg·K), more than the cube law would leave, because the electrons' linear term is now a large part of what remains.

## Heat that conducts, and heat that does not

The same two populations carry heat. In a pure metal, electrons carry almost all of it, and what limits them is scattering: by phonons, which die away as the metal cools, and by impurities and lattice defects, which do not. Cooling a pure metal from room temperature therefore removes most of the phonon scattering and its conductivity rises, until impurity scattering takes over. Below that point, conductivity falls in proportion to temperature, because each electron still carries heat in proportion to the temperature but its scattering no longer changes. The purer the metal, the higher and colder the peak.

The measure of purity is the residual resistance ratio (RRR): the electrical resistance at room temperature divided by the resistance at about 4 K, where only impurity scattering remains. Abrikosov and his co-authors treat this residual resistance of normal metals in their chapter on superconducting alloys. NIST publishes conductivity fits for oxygen-free copper with RRR values from 50 to 500, and the value of a particular piece depends on its purity, its cold work and whether it has been annealed, so for critical parts it is measured rather than assumed.

In an alloy, the alloying atoms scatter electrons so strongly at every temperature that conductivity falls steadily as the alloy cools. Stainless steel, brass and titanium alloys are poor conductors when cold, which makes them good supports and bad thermal links. Insulators such as glass-fibre epoxy laminates conduct only by phonons, and very little at any temperature.

```figure
type: compare
title: Properties that change, from NIST's cryogenic fits
cols: 293 K | 77 K | 40 K | 4 K
caption: NIST Cryogenic Technologies Group fits. Copper conductivity is for OFHC copper of RRR 50; G-10 is along the fibres. Contraction is from 293 K. Specific heats in J/(kg·K), conductivities in W/(m·K).
- Copper specific heat | 389 | 196 | 57.8 | 0.099
- * Copper conductivity, RRR 50 | 393 | 515 | 1,160 | 320
- 304 stainless conductivity | 15.1 | 7.9 | 4.7 | 0.27
- 6061 aluminium conductivity | 154 | 84 | 52 | 5.4
- G-10 conductivity, along fibres | 0.85 | 0.39 | 0.27 | below range
- Copper contraction | 0 | 0.304% | 0.323% | 0.326%
- 304 stainless contraction | 0 | 0.280% | 0.298% | 0.300%
```

Between room temperature and 40 K, copper's specific heat falls to 15%, its conductivity rises threefold, and stainless steel's conductivity falls to 31%. Those three changes drive the next eight chapters.

## Contraction stops

Thermal expansion comes from the same lattice vibrations that store heat: as the vibrations grow, the asymmetry of the forces between atoms pushes them slightly further apart on average. When the vibrations freeze out, expansion stops too, and the expansion coefficient follows the heat capacity down. The practical result is that almost all of a material's contraction happens above about 77 K. Copper contracts 0.304% between 293 K and 77 K, and only another 0.022% on the way to 4 K: 93% of its total contraction is complete at liquid nitrogen temperature.

That is useful. A design that works at 77 K will see almost no further dimensional change down to 40 K or 4 K, and a gap measured at 77 K in a test is a good guide to the gap at the operating temperature. Chapter 3 works through the contraction mismatches in CT-40.

```figure
type: line
title: Copper's specific heat as it cools, from NIST's fit
x: Temperature, K
y: Specific heat, J/(kg·K)
ymin: 0
ymax: 400
caption: NIST fit for OFHC copper. The fall is gradual from room temperature to about 100 K, then steep; below 20 K almost nothing is left. Contraction and the heat a cooler must remove follow the same shape.
- 4 | 0.1
- 20 | 7.5
- 40 | 57.8
- 60 | 136
- 77 | 196
- 100 | 255
- 200 | 359
- 293 | 389
```

## Stronger, but not always tougher

Most metals become stronger as they cool: their yield and tensile strengths rise, because the thermal vibrations that help dislocations move through the crystal die away. Their stiffness rises a little too; NIST's fit for 304 stainless steel gives a Young's modulus about 7% higher at 77 K than at room temperature. For the austenitic stainless steels, aluminium alloys, copper and titanium alloys used in cryostats, that extra strength is a bonus, and designers usually take no credit for it, using room-temperature allowable stresses, which are the lower ones.

Toughness is a different matter. Metals with a body-centred cubic crystal structure, which include ordinary carbon and low-alloy steels, lose their toughness below a transition temperature and can then fracture suddenly from a small flaw. Face-centred cubic metals do not. Chapter 4 turns this into a list of what can and cannot be used at the cold end, and why the choice of a fastener matters as much as the choice of a plate.

## Surfaces radiate less

Thermal radiation obeys the Stefan–Boltzmann law: the power a surface radiates grows as the fourth power of its absolute temperature, so a surface at 40 K radiates (40 ÷ 293)⁴ = 0.0003 times as much as one at room temperature, per unit of emissivity. The radiation that matters in a cryostat is therefore the radiation from the warm vessel onto the cold parts, not the other way round. And clean metal surfaces become better reflectors as they cool: Parma's survey of cryostat design for CERN notes that the emissivity of metals at cryogenic temperatures falls almost in proportion to temperature. Chapter 7 uses that, and the multilayer insulation that multiplies it, to bring CT-40's radiation load down from about 15 W to about 1 W.

## Sensors and wires change too

Everything used to measure a cryostat is also affected by the cold. A platinum resistance thermometer, the standard sensor for room-temperature work, becomes much less sensitive as it approaches the lowest temperatures in this book, thermocouples become less sensitive and less accurate as the temperature falls, and specialised cryogenic sensors, such as silicon diodes and various resistance types, are chosen for the range. Contact Temperature Sensors by the Numbers covers thermocouples, platinum resistance thermometers and thermistors for an industrial oven; at the cold end the same principles of wiring, immersion and calibration apply, with the sensor's own heat leak and self-heating added. The wires to each sensor carry heat in like any other conductor, which is why Chapter 8 counts them in the heat budget.

## What a cold watt costs

Heat that reaches the cold end of a cryostat has to be pumped back up to room temperature, and the second law of thermodynamics sets the least work that takes. For a refrigerator removing heat at a cold temperature T_c and rejecting it at T_h, the Carnot limit on the coefficient of performance is T_c ÷ (T_h − T_c). At 40 K, rejecting to cooling water at 25 °C, that is 40 ÷ 258 = 0.155: even an ideal machine needs 6.5 W of work for every watt removed at 40 K. Real cryocoolers achieve a few per cent of the ideal. CT-40's cooler, Chapter 9 shows, uses about 233 W of electricity for each watt it removes at 40 K.

That ratio shapes every design decision in this book. A support that leaks one extra watt costs a quarter of a kilowatt of compressor power, all day, and uses a thirtieth of the cooler's capacity. Cryogenic design is therefore largely the art of not letting heat in.

## CT-40

```figure
type: svg
title: CT-40 test cryostat, schematic section
alt: A tall rectangle represents the stainless steel vacuum vessel. A cryocooler cold head enters through the top flange and ends in a cold stage near the middle. A copper strap joins the cold stage to a round copper cold plate below it. Three thin supports hang the plate from the top flange. A test coil on an aluminium former sits on the plate. A dashed outline around the plate and coil marks the multilayer insulation. Two current leads and a bundle of instrument wires run from feedthroughs in the top flange down to the plate. Labels give the vessel at 293 K and the plate at about 40 K.
caption: This is an illustration, not to scale. Heat reaches the cold plate by conduction through the supports, the current leads and the wiring, and by radiation from the vessel through the insulation; the strap carries it to the cold head.
viewbox: 0 0 640 400
body:
<rect class="bx" x="140" y="40" width="360" height="330" rx="6"/>
<text class="tx txs" x="150" y="390">304 stainless vacuum vessel, 293 K</text>
<rect class="bxi" x="140" y="40" width="360" height="22"/>
<rect class="bxa" x="290" y="10" width="60" height="120" rx="4"/>
<text class="txb" x="360" y="30">cryocooler</text>
<rect class="bxa" x="280" y="130" width="80" height="22" rx="3"/>
<text class="tx txs" x="370" y="146">cold stage</text>
<path class="la" d="M320 152V200"/>
<text class="txa" x="330" y="182">copper strap</text>
<rect class="bxa" x="200" y="200" width="240" height="18" rx="2"/>
<text class="tx txs" x="450" y="214">copper cold plate, about 40 K</text>
<rect class="bx" x="250" y="218" width="140" height="70" rx="4"/>
<text class="txb" x="282" y="258">test coil</text>
<path class="li dsh" d="M188 190H452V300H188Z"/>
<text class="tx txs" x="380" y="320">10-layer insulation</text>
<path class="ln" d="M210 62V200M430 62V200"/>
<text class="tx txs" x="40" y="120">G-10 supports</text>
<path class="ln dsh" d="M120 116H206"/>
<path class="lf" d="M250 62V200M262 62V200"/>
<text class="tx txs" x="40" y="160">current leads</text>
<path class="ln dsh" d="M120 156H248"/>
<path class="ln dsh" d="M388 62V200"/>
<text class="tx txs" x="510" y="100">instrument wires</text>
<path class="ln dsh" d="M392 96H506"/>
```

This is an illustration. CT-40 is built to test small high-temperature superconducting coils at 40 K with currents up to 100 A. Its cold plate is cooled through a copper strap by a single-stage cryocooler, inside a stainless steel vacuum vessel, with no liquid cryogens. The book's chapters follow its design in order: the heat that must come out of its 18.6 kg cold mass (Chapter 2), its contraction (Chapter 3) and materials (Chapter 4), the heat leaks through its supports, strap, radiation shield and wiring (Chapters 5 to 8), its heat budget against the cooler (Chapter 9) and the coils it tests (Chapter 10).

## The error: a cold plate made of brass

This is an illustration. CT-40's first cold plate was machined in the workshop from stock described on the drawing simply as "copper". The workshop had no copper plate of the right thickness and used a brass plate, reasoning that brass is a copper alloy and conducts well. At room temperature the difference looked small enough: brass conducts about a third as well as copper.

At 40 K the difference is enormous. NIST's fit gives brass a conductivity of about 21 W/(m·K) at 35 K, against 1,325 W/(m·K) for copper of RRR 50: sixty times less. A rough check on the plate makes the consequence clear. Carrying 10 W across 150 mm of a plate 300 mm wide and 20 mm thick, copper needs a temperature difference of 10 × 0.15 ÷ (1,325 × 0.006) = **0.19 K**; brass needs **11.4 K**. During the first cooldown, the coil end of the plate settled about 11 K warmer than the sensor near the strap, and the laboratory spent two days suspecting its thermometers.

The engineer found the cause by checking the plate's material certificate, then comparing NIST's conductivities for the two materials at the operating temperature. The drawing now specifies oxygen-free copper by its standard designation, with a minimum RRR, and the laboratory checks each batch of plate on a sample by comparing its electrical resistance at room temperature with its resistance at 40 K in the cryostat itself, which gives a lower bound on the RRR. The lesson is the chapter's: at low temperature, an alloy is a different material from its parent metal.

## Exercise: heat above and below 77 K

A 1 kg copper block is cooled from 293 K to 40 K. Using NIST's integrated specific heat (293 K to 77 K: 72.30 kJ; 77 K to 40 K: 4.77 kJ; 40 K to 4 K: 0.61 kJ), find the share of the heat removed below 77 K, and compare the heat from 40 K to 4 K with the heat from 293 K to 77 K. What does this mean for using liquid nitrogen to precool apparatus?

**Worked answer.** This is an illustration. Cooling from 293 K to 40 K removes 72.30 + 4.77 = **77.07 kJ**, of which only 4.77 ÷ 77.07 = **6.2%** comes out below 77 K. Cooling on from 40 K to 4 K removes 0.61 kJ, less than **1%** of the 293 K to 77 K figure. Almost all the heat comes out at the warm end, where a watt is cheap to remove. That is why large cryogenic plants precool with liquid nitrogen, removing 94% of the heat at 77 K where the Carnot cost is 2.9 W of work per watt instead of 6.5 at 40 K, and why CT-40's cooldown, in Chapter 2, is fastest at the start, when the cooler's capacity is largest and most of the heat is still in the plate.
