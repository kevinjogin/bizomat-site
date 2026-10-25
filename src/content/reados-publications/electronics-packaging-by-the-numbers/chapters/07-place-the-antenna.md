---
book: electronics-packaging-by-the-numbers
chapterSlug: place-the-antenna
order: 7
title: "Place the antenna"
description: "Understand wavelength, ground planes and keep-outs well enough to place an embedded antenna in a metal-and-plastic enclosure, estimate what losses cost in range and prove it on site."
draft: false
---

A radio module can be perfectly designed and certified and still give poor range in a product, because the antenna's performance depends on everything around it. Metal near the antenna detunes it and blocks it. Plastic changes its tuning slightly. The size of the board's copper ground plane can matter as much as the antenna itself. Most of these effects are decided by the mechanical design, which is why the antenna is a packaging problem as much as a radio one.

This chapter gives a mechanical designer enough radio physics to place the gearbox monitor's embedded antenna, set the keep-out zone, estimate what a loss in decibels costs in range and design a field check that proves the result. It does not design antennas. That remains the work of the antenna maker and the electronics designer.

## Wavelength sets the scale

Radio waves have a wavelength **λ = c ÷ f**, where c is the speed of light, about 3 × 10⁸ m/s, and f is the frequency. Antennas and the objects that disturb them interact strongly when their sizes are a sizeable fraction of a wavelength.

The gearbox monitor uses LTE-M, a low-power cellular technology that operates in several mobile bands. In Australia these include low bands around 700 MHz, which travel further and penetrate better, and higher bands around 1,800 MHz. The wavelengths are:

- at **700 MHz**, **λ = 3 × 10⁸ ÷ 700 × 10⁶ ≈ 0.429 m**, and a quarter wavelength is about **107 mm**;
- at **1,800 MHz**, **λ ≈ 0.167 m**, and a quarter wavelength is about **42 mm**.

The quarter wavelength at 700 MHz is longer than the whole enclosure. That is why small products use compact embedded antennas, chip or flexible printed types, which are physically small but rely on the board's copper ground plane to act as the other half of the antenna. The antenna maker's integration guide specifies the ground-plane length the antenna was characterised on, the clearance it needs, and how performance falls if the ground plane is shorter.

The gearbox monitor's board is 80 mm long. That is shorter than the ground length the antenna maker recommends for best performance in the low bands. The electronics designer accepted a lower efficiency at 700 MHz in exchange for the small enclosure and recorded the expected penalty in the design notes. The field check later in this chapter tests whether that was the right call.

## Metal, plastic and the keep-out

**Metal close to an antenna** does two things. It detunes the antenna, moving its best frequency away from the band, and it blocks or reflects radiation in its direction. The die-cast aluminium base is the largest metal part in the product. The steel gearbox under it is far larger. Screws, the radio module's shield can, the M12 connector and even the copper of the board itself also count.

**Plastic** is largely transparent to radio at these frequencies, but it has a dielectric constant greater than that of air. A plastic lid in contact with or very close to the antenna shifts its tuning slightly, usually lower in frequency. Antenna makers often tune their parts assuming a certain thickness of plastic nearby, and their guides state it. Fillers, pigments and coatings matter too: metal-flake paint, metallised labels and some conductive fillers can act like metal.

The integration guide defines a **keep-out volume** around the antenna, free of metal and copper, on the board and above and below it. The gearbox monitor's zone map from Chapter 2 carries it as a three-dimensional keep-out. The mechanical consequences were:

1. **The antenna sits at the end of the board farthest from the stud**, under the polycarbonate lid, so the gearbox's steel is as far away as the enclosure allows.
2. **The aluminium base's wall is cut down at that end** to below the board's level. The lid's skirt is extended downwards to close the gap, so the antenna looks out through polycarbonate on three sides and the top.
3. **The two lid screws nearest the antenna were moved** outward along the lid edge to keep them out of the keep-out volume. Chapter 5's screw spacing was rechecked with the new positions.
4. **The lid label** is printed with non-metallic inks and placed away from the antenna end.

```figure
type: checklist
title: Antenna integration checks for the gearbox monitor
caption: This is an illustration. The antenna maker's integration guide is the source of the clearance values; the checks confirm the mechanical design respects them.
- Antenna at the board end farthest from the gearbox steel | stud is at the other end
- Keep-out volume clear of screws, shields, bosses and base walls | checked in the 3D model
- Lid material, thickness and gap to the antenna as the guide assumes | polycarbonate, natural pigment
- No metallic paint, labels or inks near the antenna end | label moved and ink specified
- ? Low-band efficiency with the 80 mm ground plane | measure in the final enclosure
- x Testing the radio only on the bench in an open board | test in the closed enclosure on a steel plate
```

## Decibels and range

Radio performance is measured in decibels because the quantities involved span enormous ranges. A ratio in decibels is **10 × log₁₀(ratio)** for power. Two useful anchors are that **3 dB** is a factor of two in power, and **10 dB** is a factor of ten.

The free-space path loss between two antennas, given in Recommendation ITU-R P.525 and commonly written with distance in kilometres and frequency in megahertz, shows how loss grows with distance and frequency.

```figure
type: formula
title: Free-space path loss and what an antenna loss costs
formula: FSPL (dB) = 20 log₁₀(d km) + 20 log₁₀(f MHz) + 32.44
caption: This is an illustration. Real paths over terrain and through structures lose much more than free space; the formula shows the scaling, not the actual range.
- d | distance in kilometres
- f | frequency in megahertz
step: at 3 km and 700 MHz: 9.54 + 56.90 + 32.44 ≈ 98.9 dB
step: at 6 km and 700 MHz: ≈ 104.9 dB, so doubling the distance adds about 6 dB
step: an antenna at 25% efficiency instead of 100%: 10 log₁₀(0.25) ≈ −6.0 dB
```

The scaling is the useful part. In free space, each 6 dB of extra loss halves the range. An antenna that radiates only a quarter of the power it is fed costs about 6 dB, the same as doubling the distance to the tower. Over real terrain, signals fall faster with distance than in free space, so each decibel costs less range than this, but the direction is the same. A few decibels lost to a poorly placed antenna can be the difference between a reliable link and a dropped one at the edge of coverage, which is exactly where quarries tend to be.

## Measure it in the product, in place

The radio module reports measures of received signal. For LTE these include the reference signal received power (RSRP), in dBm. The firmware includes the latest RSRP in every message it sends, so that signal quality is visible for every installed unit.

This is an illustration. The team measured RSRP at the quarry with one prototype in four conditions, averaging readings over ten minutes in each.

```figure
type: compare
title: Signal received by one prototype in four conditions at the quarry
cols: Average RSRP | Change from the open board
caption: This is an illustration. Readings fluctuate by several decibels; averages over ten minutes were compared at one location on one day. The commissioning limit is the team's own choice, not a network figure.
- Open board on a plastic stand | −95 dBm | reference
- Closed enclosure on a plastic stand | −97 dBm | −2 dB
- Closed enclosure on the gearbox, open side | −101 dBm | −6 dB
- *Closed enclosure on the gearbox, under the steel guard | −112 dBm | −17 dB
```

The enclosure itself cost about 2 dB, a reasonable result for a polycarbonate lid. Mounting on the gearbox, with its large steel mass under the base, cost another 4 dB. The steel guard over the drive cost a further 11 dB, the largest single loss.

The team set a commissioning limit of −105 dBm, based on the radio module maker's guidance and their own trial results. Any unit reading weaker than that at installation is either relocated or fitted with the external antenna option described below.

## The external antenna option

Some installations will never have a good signal from inside the enclosure. For those, the gearbox monitor has a variant with a sealed bulkhead connector for an external antenna mounted on a short cable, clear of the steelwork.

The option has costs. The antenna cable loses signal, a few decibels on a short run of thin cable at these frequencies, so the antenna must be placed where the gain outweighs the cable loss. The bulkhead connector is another penetration in the seal, designed like the M12 connector in Chapter 6. And an external antenna changes the product's radio configuration, which has compliance consequences, as Chapter 8 explains. The variant is therefore designed, tested and documented as a separate configuration, not improvised on site.

## A failure case: the unit under the guard

This is an illustration. In the site trial, one unit went silent within a day of installation. Its last messages showed RSRP falling from about −104 dBm to −115 dBm, then nothing. The installer had mounted it under the hinged steel guard that covers the coupling, because that was the most protected position. The guard was open during installation, giving a good reading, and closed afterwards.

The problem was detected because the firmware sent signal strength with every message. That turned a mystery outage into a clear trend. It was corrected in three ways. The unit was moved to the open side of the gearbox. The installation instructions now say that the commissioning signal check must be made with all guards closed and the plant in its running condition. And the commissioning checklist records the RSRP reading at sign-off, so that a later decline can be compared with the starting point.

## Keep the product's own noise away from the antenna

An antenna that receives a weak signal from a distant tower also receives every bit of electrical noise produced inside the product. Switching regulators, processor clocks and digital data lines all produce harmonics that can land in the radio's receive bands. That noise raises the floor against which the tower's signal must be detected, a loss known as desensitisation. It does not show up as a fault. The product simply has less range than the module's data sheet suggests.

Most of the cure is in the board layout, which is the electronics designer's job: placing the switching regulator far from the antenna, keeping noisy circuits over solid ground and filtering lines that run near the antenna. The mechanical design helps by giving the layout room to separate them. On the gearbox monitor, the zone map puts the regulator and the M12 connector at the stud end and the antenna at the opposite end, about 60 mm away, with the radio module and the quiet sensor circuits between them. The internal flying leads, which carry the supply and its noise, run along the base wall at the stud end and stop well short of the antenna's keep-out.

A simple check compares the signal strength the module reports with the product's own electronics running normally and with them in a quiet test state. A difference of several decibels points to self-generated noise, and that is far easier to fix at the prototype stage than after release.

## Plan for the networks of the product's life

An installed sensor may stay on a gearbox for ten years or more, and mobile networks change over that time. Australia's 3G networks were closed by the major operators in 2024. Devices that relied on them stopped working unless their radios were replaced. The gearbox monitor's choice of LTE-M, and of a module that supports the bands Australian operators use for it, is a packaging decision as well as a radio one. If a future network change forced a module change, the zone map, keep-outs and antenna would all be affected. The team recorded the module's supported bands and the operator's published plans in the design file, and kept the antenna zone large enough to accept a module of a similar size from another maker.

## Design for the regulator's view of the antenna

A cellular module is usually certified by its maker with specific antennas or antenna types. Integrating it into a product with a different antenna, or a higher-gain one, can change what the end product must prove. The antenna choice, its cable and any external-antenna variant are therefore listed in the compliance plan from the start. A late change to the antenna, even a cheaper part of the same type, goes through the change process of Chapter 10, not a quiet substitution.

## How this applies to a small Australian business

Australian industrial sites are often at the edge of mobile coverage, and mobile coverage maps are predictions, not measurements. A small business can do useful field work with a single prototype and a laptop: measure signal at the actual mounting positions, with guards closed, before committing to an internal antenna. Reporting signal strength in every message costs a few bytes and pays for itself the first time a unit goes quiet. The companion book [Connected Products by the Numbers](/reados/publications/connected-products-by-the-numbers/) covers the choice of network and the data and power budgets that sit behind it.

## Exercise: the cost of a steel guard

At another site, the open-board reference reading is −99 dBm. Using the losses measured in this chapter (2 dB for the enclosure, 4 dB for the gearbox and 11 dB for a closed steel guard), estimate the expected reading in each mounting condition, and say which pass the −105 dBm commissioning limit. How much range, in free-space terms, does the guard's loss represent?

**Worked answer.** Closed enclosure on a stand: **−99 − 2 = −101 dBm**, pass. On the gearbox, open side: **−101 − 4 = −105 dBm**, exactly at the limit, so a marginal pass that should be confirmed by measurement. Under the guard: **−105 − 11 = −116 dBm**, fail. The guard's 11 dB is almost two 6 dB steps. In free space each 6 dB halves the range, so 11 dB corresponds to a range factor of about **10^(−11 ÷ 20) ≈ 0.28**, roughly a quarter of the distance. On real terrain the effect on range is smaller but still large. The practical answer is to mount on the open side and measure before signing off.
