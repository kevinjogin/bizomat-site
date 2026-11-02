---
book: distribution-transformers-by-the-numbers
chapterSlug: turns-flux-and-the-voltage-equation
order: 2
title: "Turns, flux and the voltage equation"
description: "How the number of turns, the core area, the frequency and the flux density set a transformer's voltages, how taps and vector groups work, and how a tap moved the wrong way raised a factory's voltage."
draft: false
---

A transformer has no moving parts and, in principle, a very simple job: two windings share one magnetic core, and the voltage on each is proportional to its number of turns. Behind that simplicity sits a single equation that ties together the voltage, the frequency, the turns, the area of the core and the flux density in its steel. Every transformer designer starts with it, and anyone who sets taps, connects transformers in parallel or imports a transformer built for another country needs to understand it.

This chapter derives the voltage equation from Faraday's law and works it for TX-1, which explains why its core runs at 1.65 T. It then explains the off-circuit tap changer and the plant's supply voltage, the Dyn11 vector group and why it suits a factory, and ends with a tap moved in the wrong direction on a Monday morning.

## Faraday's law and the voltage equation

A changing magnetic flux through a loop of wire induces a voltage around the loop equal to the rate of change of the flux. With N turns all linking the same flux, the voltages add, so the winding's voltage is N times the rate of change of the flux. In a transformer the arrangement works in reverse as well: apply an alternating voltage to the primary winding and a flux must build up in the core whose rate of change matches it. The primary draws exactly the small magnetising current needed to create that flux, and the same flux, linking the secondary winding, induces in it a voltage proportional to its turns.

For a sinusoidal supply the flux is sinusoidal too, and working through the calculus gives a compact result for the root-mean-square voltage of a winding.

```figure
type: formula
title: The transformer voltage equation
formula: E = 4.44 × f × N × A × B_peak
formula: E ÷ N = 4.44 × f × A × B_peak   (volts per turn)
formula: E₁ ÷ E₂ = N₁ ÷ N₂
caption: E is the rms voltage of a winding (V), f the frequency (Hz), N its number of turns, A the net cross-section area of the core's steel (m²) and B_peak the peak flux density (T). The factor 4.44 is 2π ÷ √2. Both windings on a limb share the same volts per turn, which is why the voltage ratio equals the turns ratio.
- f | supply frequency, Hz
- A | net steel area of the core limb, m²
- B_peak | peak flux density, T
```

The equation shows the designer's freedom and its limits. For a given voltage and frequency, the product of turns and core area is fixed by the chosen flux density. Fewer turns need a bigger core, more steel and more no-load loss; more turns need more copper and more load loss. The flux density is set as high as the steel's losses, noise and saturation allow, typically 1.5 to 1.7 T for grain-oriented steel.

## The case: TX-1's turns and flux

TX-1's low-voltage winding is star-connected, so each phase winding sees the line voltage divided by √3: 433 ÷ √3 = 250 V at no load. It has 15 turns per phase, so the volts per turn are 250 ÷ 15 = 16.67 V. The core's limbs have a net steel area of 0.0455 m², roughly a circle 244 mm in diameter after allowing for the stepped shape and the insulating coating on each lamination.

```figure
type: steps
title: TX-1's windings and flux density at the principal tap
caption: This is an illustration. The figures are typical of a 1,500 kVA, 11 kV distribution transformer; the real values are in the maker's design records, not on the nameplate. The HV winding is delta-connected, so each phase winding carries the full 11,000 V.
- LV phase voltage, 433 ÷ √3 | 250 V
- LV turns per phase | 15
- * Volts per turn, 250 ÷ 15 | 16.67 V
- Peak flux density, 16.67 ÷ (4.44 × 50 × 0.0455) | 1.65 T
- HV turns per phase, 11,000 ÷ 16.67 | 660
- Phase turns ratio, 660 ÷ 15 | 44.0
- Line voltage ratio, 11,000 ÷ 433 | 25.40
```

Two numbers deserve a comment. The line voltage ratio, 25.4, differs from the turns ratio, 44, by √3, because the HV phase winding sees the full line voltage while the LV phase winding sees line voltage divided by √3. And the flux density depends only on volts per turn, frequency and core area, not on load. A transformer's core flux, and so its no-load loss, is the same whether it supplies nothing or its full rating, which is why no-load loss is paid every hour the transformer is energised (Chapter 8).

The equation also shows what an overvoltage does. Flux density is proportional to voltage divided by frequency. If the 11 kV supply rises to 11.3 kV, TX-1's flux density at the principal tap rises in proportion, from 1.65 to 1.695 T. The core is that much closer to saturation, its magnetising current and no-load loss rise faster than in proportion, and it hums louder.

## Taps

A network's high-voltage supply varies with the load on the network and the transformer's position along the feeder, so distribution transformers have taps: extra connections on the HV winding that add or remove a few per cent of its turns. TX-1 has an off-circuit tap changer with five positions in 2.5% steps, which can be moved only with the transformer de-energised and isolated.

The tap positions are labelled by the HV voltage they suit. The +2.5% tap uses 2.5% more HV turns, so it is meant for a supply 2.5% above nominal: on that tap, 11,275 V at the HV terminals gives the nominal 433 V at the LV terminals at no load. The consequence confuses people every year: moving to a higher-numbered tap lowers the LV voltage for a given supply.

```figure
type: compare
title: TX-1's taps and the LV voltage at no load
cols: HV turns | LV at 11.0 kV supply | LV at 11.3 kV supply
rowhead: Tap
- +5% | 693 | 412.4 V | 423.6 V
- * +2.5% | 676 | 422.8 V | 434.3 V
- Principal, 0% | 660 | 433.0 V | 444.8 V
- −2.5% | 644 | 443.8 V | 455.9 V
- −5% | 627 | 455.8 V | 468.2 V
caption: This is an illustration. LV line voltage at no load = supply ÷ HV turns × 15 × √3, with turns rounded to whole numbers. Under load the LV voltage falls further by the regulation worked in Chapter 4.
```

The plant's measured HV supply runs at about 11.3 kV for most of the day. On the principal tap that gives 444.8 V at no load, about 3% above the nominal 433 V. On the +2.5% tap it gives 434.3 V, very close to nominal, and the flux density falls back to 1.655 T. The tap is chosen so that the voltage at the far end of the plant, after the transformer's own regulation and the voltage drop in the cables, stays within the range the equipment and the supply rules allow at both light and heavy load.

## The vector group

TX-1's vector group, Dyn11, describes how its windings are connected: D for a delta-connected HV winding, y for a star-connected LV winding, n for a brought-out LV neutral, and 11 for the phase shift between them, read like a clock face: the LV voltages lead the HV voltages by 30°, the position of the hour hand at 11 o'clock when the HV is at 12.

Each part of the arrangement has a reason in a factory.

1. **The LV neutral** gives 230 V between each phase and neutral for lighting, sockets and single-phase equipment, alongside 400 V between phases for motors.
2. **The delta HV winding** carries the circulating currents that balance unequal loads on the three LV phases, so the HV network sees a more balanced load. It also provides a closed path for the third-harmonic magnetising currents and for triplen harmonic currents from single-phase electronic loads, which therefore do not flow back into the 11 kV network.
3. **The 30° shift** must be the same for transformers that are paralleled or that feed a common switchboard through a bus tie. Two transformers of different vector groups paralleled on their LV sides would drive a large circulating current between them.

Paralleling also needs the same voltage ratio on the selected taps and similar impedances, so that the load divides between the transformers in proportion to their ratings. These conditions matter to the plant because the replacement for TX-1 will run in parallel with the old unit for a short time during the changeover, if the network and the switchboard allow it.

## Measuring the ratio and the magnetising current

Two simple tests confirm that a transformer's windings and core are as they should be, and both are worth doing at commissioning and after any work on the windings or taps.

**Turns ratio.** A portable ratio tester applies a low voltage, typically tens of volts, to one winding and measures the voltage induced in the matching winding on the same limb, phase by phase. For a Dyn transformer it compares each HV delta winding with the LV star winding on the same limb, so on TX-1's principal tap it should read 660 ÷ 15 = 44.0 on all three phases, and on the +2.5% tap 676 ÷ 15 = 45.1. The readings are compared with the values in the maker's test report. Equal ratios on all three phases within a small fraction of a per cent show that no turns are shorted and the taps are where the indicator says; a ratio that differs on one phase points to shorted turns or a wrongly set tap link on that phase.

**Magnetising current.** With a low voltage applied, the tester or a separate excitation test also measures the current drawn by each phase. On a three-limb core the two outer phases draw similar currents and the centre phase a little less, because its flux path is shorter. A large rise compared with earlier tests, or with the factory values, suggests a core fault, such as shorted laminations or a second core earth (Chapter 3), or residual magnetism left after a DC winding resistance test, which a demagnetising routine in most modern testers removes.

## What the voltage does to the plant

The tap setting matters because the plant's equipment is sensitive to voltage in different ways. Induction motors' starting and breakdown torques vary roughly with the square of the voltage: at 417 V, TX-1's LV voltage at a 1,520 kVA load on the principal tap with a nominal 11 kV supply (Chapter 4), they fall to about 93% of their values at 433 V, which matters for the freezing tunnel's compressors starting against a loaded refrigeration circuit. At 456 V they would rise to about 111%, but the motors' magnetising current and iron losses would rise too, running them warmer at light load. Drives see the higher voltage directly on their DC bus, which is why two of them tripped. Lamps and electronic power supplies run hotter and age faster at high voltage.

Low-voltage installations in Australia are designed for a nominal 230/400 V supply with a tolerance band set by the supply rules, and a factory's own transformer should be tapped to keep the voltage at the equipment inside that band at both light and heavy load. That is a calculation of the transformer's regulation (Chapter 4) plus the voltage drop in the cables to the furthest large load, done with measured supply voltages rather than nominal ones.

## When it goes wrong: the tap moved the wrong way

Last year, after complaints that lamps on the processing floor were failing early and that a variable-speed drive was reporting high DC bus voltage at night, an electrician measured 446 V at the main switchboard with the plant lightly loaded. The plan was to lower the voltage by one tap step during the next shutdown. With TX-1 isolated and earthed, the electrician moved the tap from the principal position to the one labelled −2.5%, reasoning that minus would lower the voltage.

When TX-1 was re-energised the switchboard read 456 V at light load. The −2.5% tap uses fewer HV turns, so for the same 11.3 kV supply it raises the LV voltage, from 444.8 to 455.9 V at no load. Two drives tripped on DC overvoltage within the hour, and the transformer was shut down again so that the tap could be moved to +2.5%, which gave 434 V.

```figure
type: checklist
title: Changing an off-circuit tap safely and correctly
caption: This is an illustration of the plant's procedure; the transformer maker's instructions and the site's high-voltage switching rules govern the work.
- x Work out the target tap from measured HV supply and LV voltages before the shutdown
- x Remember: a higher HV tap means more HV turns and a lower LV voltage
- x Isolate, prove dead and earth the transformer under the site's switching procedure
- x Move all three phases' tap links or the ganged switch, and confirm the position on the indicator
- x Measure the turns ratio on the new tap with a ratio tester before re-energising
- x Record the new tap position on the transformer and in the site register
- ? Check LV voltage at light and heavy load after re-energising
```

The check that would have caught the error before re-energising is a turns ratio test, which takes a few minutes with a portable ratio tester: on −2.5% it reads 42.9 instead of the expected 45.1 for +2.5%. The plant now does the test after every tap change, and the procedure carries a small table of the plant's five tap positions with their expected ratios and the LV voltage each gives at the measured supply, so that nobody has to reason it out under time pressure during a shutdown.

## Exercise: an imported transformer

A supplier offers a used 1,000 kVA transformer imported from a country with a 60 Hz supply. Its nameplate gives the same voltages as TX-1, and its designer worked its core at 1.60 T at 60 Hz.

1. What would its peak flux density be on the plant's 50 Hz supply at the same voltage?
2. Why does that matter?
3. What else would you check before buying it?

**Answer.**

1. Flux density is proportional to voltage divided by frequency, so at 50 Hz it rises by 60 ÷ 50 = 1.2: from 1.60 T to 1.92 T.
2. 1.92 T is very close to the saturation of silicon steel, about 2.0 T. The core would draw a large, distorted magnetising current, its no-load loss and noise would rise sharply, and any rise in supply voltage, or the transient when switching on, would saturate it heavily. It is not suitable for 50 Hz at that voltage.
3. Its impedance, losses, vector group, tap range and temperature rise against the plant's needs, its compliance with Australian minimum energy performance requirements (Chapter 8), its test records and oil condition, and whether the network will accept its connection. A transformer designed for 60 Hz can sometimes be used at 50 Hz at a voltage reduced by the same ratio, but that rarely suits a plant's existing supply.
