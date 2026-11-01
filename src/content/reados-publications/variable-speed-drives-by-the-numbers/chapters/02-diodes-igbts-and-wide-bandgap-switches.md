---
book: variable-speed-drives-by-the-numbers
chapterSlug: diodes-igbts-and-wide-bandgap-switches
order: 2
title: "Diodes, IGBTs and wide-bandgap switches"
description: "How power diodes, MOSFETs and IGBTs block voltage and carry current, why breakdown, leakage and resistance depend on the semiconductor and temperature, and why silicon carbide is replacing silicon."
draft: false
---

The switches in a drive's inverter do something no mechanical switch could: they turn about 50 A on and off against 540 V, four thousand times a second, for fifteen years. In the off state each must hold back the full DC link voltage with almost no leakage; in the on state each must carry the full motor current with a voltage drop of a volt or two. Both jobs are done by the same thin slice of silicon, and both depend on how the silicon is doped, how its carriers move and how it behaves when hot.

This chapter explains how a power semiconductor blocks voltage, why blocking high voltage costs on-state resistance, how the IGBT gets around that cost by injecting extra carriers, what that does to its switching, and why silicon carbide changes the trade. It works the numbers for DP-4's 1,200 V switches and ends with a replacement module of the wrong voltage class.

## Blocking voltage: the drift region

Every power switch blocks voltage across a reverse-biased junction between a heavily doped region and a lightly doped one, the drift region. Under reverse voltage, the free carriers are pushed out of the drift region, leaving the fixed charge of its dopant atoms, and an electric field builds up across it. The field is greatest at the junction. If it reaches a critical value, carriers accelerated by it gain enough energy between collisions to knock electrons out of the crystal's bonds, creating new electron–hole pairs that are accelerated in turn. This is impact ionisation, and when it multiplies without limit it is avalanche breakdown: the current rises steeply and, unless limited, destroys the device.

For a simple drift region designed to just reach the critical field at its rated voltage, the doping and thickness follow from the field. A lower doping lets the field spread further, so a higher voltage needs a thicker, more lightly doped drift region.

```figure
type: formula
title: The ideal drift region of a power device
formula: Doping for breakdown voltage V_B: N = ε E_c² ÷ (2 q V_B)
formula: Thickness W = 2 V_B ÷ E_c
formula: Specific on-resistance of a unipolar device: R_on,sp = W ÷ (q μ N) = 4 V_B² ÷ (ε μ E_c³)
caption: ε is the permittivity of the semiconductor, E_c its critical field, q the electron charge and μ the mobility of the carriers in the drift region. The on-resistance rises with the square of the voltage rating and falls with the cube of the critical field. Real devices are optimised further, but the scaling holds.
- E_c | critical field: about 0.3 MV/cm in silicon, about 2.5 MV/cm in 4H silicon carbide
- ε | 11.7 ε₀ for silicon, 9.7 ε₀ for silicon carbide
- μ | electron mobility, about 1,350 cm²/(V·s) in silicon, about 900 in silicon carbide
- R_on,sp | resistance times area, Ω·cm²
```

For a 1,200 V silicon device, with E_c = 0.3 MV/cm, the drift region needs a doping of about 2.4 × 10¹⁴ atoms per cubic centimetre, one dopant atom in about 200 million silicon atoms, and a thickness of about 80 µm. Its specific on-resistance as a unipolar device, one that conducts only with the carriers its doping provides, is about 0.153 Ω·cm². A switch with 50 mΩ of on-resistance, which would drop 2.5 V at 50 A, would need about 3 cm² of silicon. That is the problem: at 1,200 V, a plain silicon MOSFET is too big or too resistive for a 30 kW drive.

## The IGBT: borrowing carriers

The insulated-gate bipolar transistor solves the problem by flooding the drift region with extra carriers when it is on. It is built like a power MOSFET, with a gate that controls a channel, but with an extra p-type layer at its collector. When the gate turns the channel on, electrons flow through it into the drift region and, at the collector, holes are injected from the p-type layer into the drift region. The drift region fills with electrons and holes far above its tiny doping, its conductivity rises by orders of magnitude, and the on-state voltage falls to a volt or two even in a thick, lightly doped layer. This is conductivity modulation.

The cost is twofold. First, the injecting junction at the collector adds a fixed drop of roughly 0.7 to 1 V, a knee in the on-state characteristic, so an IGBT's on-state voltage is modelled as a threshold voltage plus a resistance. Second, and more important, the extra carriers have to go somewhere when the device turns off. They cannot be pulled out through the gate; they leave by recombining, with a lifetime of the order of a microsecond, and by being swept out by the rising voltage. While they do, current keeps flowing: the IGBT's tail current. Turning off therefore takes time with both voltage and current present, and that is where most of an IGBT's switching loss arises (Chapter 3). Device designers trade on-state voltage against switching speed by adjusting the carrier lifetime: more carriers and a longer lifetime mean lower conduction loss but more switching loss.

## Diodes

Each IGBT in DP-4's inverter has a diode across it, the freewheeling diode, which carries the motor current when the IGBT is off and the current has to keep flowing through the motor's inductance. The rectifier's six diodes are similar devices, switching only at mains frequency. A power diode is also a bipolar device, with a lightly doped drift region flooded by injected carriers when it conducts, so it too has a forward drop of about a volt and stored charge when it turns off. When the opposite IGBT turns on and reverses the voltage across a conducting diode, that charge must be removed before the diode can block, and for a short time the diode conducts backwards: reverse recovery. The reverse-recovery current adds to the turn-on current of the IGBT and adds losses to both devices.

## Temperature: leakage, mobility and breakdown

Temperature changes all three properties that matter.

**Leakage.** In the off state, a small current flows through the reverse-biased junction, generated by electron–hole pairs created thermally in the depletion region. That generation follows the intrinsic carrier density, the number of carriers the silicon would hold with no doping at all, which grows very steeply with temperature: in proportion to T^1.5 exp(−E_g ÷ 2kT). For silicon it is close to 10¹⁰ per cubic centimetre at room temperature; it rises about 560 times between 25 °C and 125 °C, doubling about every 15 K near 125 °C. Leakage current rises with it, and so does the leakage power at 540 V. If the leakage heats the device faster than it can be cooled, the device runs away thermally. Somewhere above 200 °C the intrinsic carrier density in silicon approaches the drift region's own doping, and the device stops blocking altogether. Long before that, leakage, packaging materials and reliability limit silicon devices to junction temperatures of about 150 °C to 175 °C.

```figure
type: compare
title: Intrinsic carrier density in silicon, and so junction leakage, relative to 25 °C
cols: Ratio to 25 °C | What it means
rowhead: Junction temperature
- 25 °C | 1 | Close to 10¹⁰ carriers per cm³; negligible leakage
- 75 °C | 36.5 | A warm drive at part load
- 125 °C | 563 | Typical full-load junction temperature in a well-cooled drive
- 150 °C | 1,760 | Common maximum continuous rating for silicon IGBTs
- * 175 °C | 4,870 | Highest rating of modern silicon modules
caption: This is an illustration from the standard expression, with silicon's bandgap narrowing with temperature. The ratio doubles about every 15 K near 125 °C.
```

**Mobility.** Carriers moving through a crystal are scattered by its vibrating atoms, the phonons. The hotter the crystal, the more it vibrates, and the lower the carriers' mobility. In lightly doped silicon, electron mobility falls roughly as T^−2.4, so the resistance of a MOSFET's drift region at 125 °C is about (398 ÷ 298)^2.4 = 2.0 times its value at 25 °C. A MOSFET's on-resistance therefore rises with temperature, which makes MOSFETs share current well in parallel: a hotter one carries less. An IGBT's behaviour is more mixed, because its injected carriers also live longer when hot, but modern IGBTs are designed so that their on-state voltage rises with temperature at full current, for the same reason.

**Breakdown.** Higher lattice vibration also makes it harder for carriers to gain enough energy for impact ionisation, so a device's breakdown voltage rises slightly with temperature. The converse matters in Australian winters: at −20 °C a 1,200 V device breaks down at a lower voltage than its rating at 25 °C, which is one reason drives keep a wide margin between the DC link voltage and the device rating.

## The gate and its driver

An IGBT or MOSFET is controlled by its gate, which is insulated from the silicon by a thin layer of oxide. The gate and the silicon beneath form a capacitor. Charging it to about +15 V forms the conducting channel; discharging it, usually to a few volts negative, closes the channel firmly and holds it closed against the voltage swings around it. No current flows into the gate in the steady state, but each switching event must move the gate's charge in and out, so the gate driver supplies short pulses of an ampere or more.

The driver does three more jobs that matter for reliability. It isolates the low-voltage control electronics from switches sitting at hundreds of volts, through optical or magnetic isolation. Its gate resistors set how fast the switch turns on and off, which trades switching loss against voltage overshoot and electrical noise. And it protects the switch against short circuits: an IGBT in a short circuit carries several times its rated current while its collector voltage rises out of saturation, and it can survive that for only about 10 µs. The driver watches for the voltage rising and turns the IGBT off within that time. A failed gate driver, or one replaced with the wrong gate resistors, is a common hidden cause of repeated module failures.

## Silicon carbide

Silicon carbide has a bandgap of about 3.26 eV, nearly three times silicon's, and a critical field about eight times higher. The drift region formulas show what that buys. A 1,200 V silicon carbide device needs a drift region about 9.6 µm thick, doped at about 1.4 × 10¹⁶, with a specific on-resistance of about 0.48 mΩ·cm², about 320 times less than silicon's unipolar figure. A 50 mΩ switch needs about 1 mm² of drift region, not 3 cm². Silicon carbide can therefore make 1,200 V MOSFETs, unipolar devices with no stored minority carriers and no tail current, with lower conduction loss than a silicon IGBT at moderate currents and a small fraction of its switching loss.

```figure
type: compare
title: Ideal 1,200 V drift regions in silicon and silicon carbide
cols: Bandgap | Critical field | Drift doping | Drift thickness | Specific on-resistance, unipolar
rowhead: Material
- Silicon | 1.12 eV | about 0.3 MV/cm | 2.4 × 10¹⁴ per cm³ | 80 µm | 153 mΩ·cm²
- * 4H silicon carbide | 3.26 eV | about 2.5 MV/cm | 1.4 × 10¹⁶ per cm³ | 9.6 µm | 0.48 mΩ·cm²
caption: This is an illustration from the ideal drift region formulas with the round values shown. The ratio of on-resistances, about 320, is the ratio of ε μ E_c³ for the two materials. Real devices add channel, substrate and contact resistance.
```

Its wide gap also keeps its intrinsic carrier density negligible to temperatures far beyond any package's limit, so leakage is low even when hot. The drawbacks are price, less mature gate oxides and the much faster switching itself, which raises the rate of change of voltage on the motor cable (Chapter 9). Many new drives in the tens of kilowatts still use silicon IGBTs; silicon carbide is taking over where efficiency, high switching frequency or compactness pays, and gallium nitride, another wide-gap material, in lower-voltage converters.

## Ratings and margins

DP-4's drives use IGBT modules rated at 1,200 V and 100 A, with their diodes, all six switches on one baseplate. For a 400 V supply, the DC link runs at about 540 to 566 V and can rise to 700 V or more when a load drives the motor as a generator during deceleration, before the drive's overvoltage trip, typically around 800 V. Each switching transition adds an overshoot: the module's internal and busbar inductance, perhaps 60 nH, times a turn-off rate of current change of about 100 A in 100 ns gives 60 × 10⁻⁹ × 10⁹ = 60 V. A 1,200 V rating gives a margin of about 40% at the trip level, which also keeps the rate of failures from cosmic-ray strikes, which rises steeply with the voltage applied as a share of the rating, very low.

## The error: a 600 V module in a 400 V drive

When one of the conveyor drive's modules failed, a maintenance contractor sourced a replacement from a parts broker, a module of the same outline and pin layout described as "equivalent". It was rated 600 V, intended for drives on 230 V single-phase supplies, whose DC link sits at about 325 V.

The drive ran for two days. It failed when the conveyor was stopped quickly with a full load of bales, the motor regenerated and the DC link rose towards 720 V. Even at idle, the link's 566 V plus a 60 V switching overshoot would have exceeded the module's 600 V rating on every turn-off; at 720 V plus overshoot, the IGBT went into avalanche and failed short-circuit, taking the DC link fuse and the rectifier with it.

```figure
type: checklist
title: Before fitting a replacement power module
caption: This is an illustration. The plant's rule since the failure.
- x Voltage class matches the original: 1,200 V for 400 V drives, 1,700 V for 690 V drives
- x Current rating, internal circuit and thermal resistance match the original part number
- x Supplied by the drive maker or an authorised distributor, with traceable origin
- x Failure investigated first: a failed module is often a symptom of another fault
- x Gate driver, DC link capacitors and fuses checked before the drive is powered up
- ? Repair or replace the whole drive: for drives of this size, a new drive is often cheaper and faster
```

The plant replaced the conveyor drive with a new one. A module that fits physically says nothing about its voltage class; the class is in the part number, and the arithmetic of DC link voltage plus overshoot against rating is quick to do.

## Exercise: a drive on a 690 V supply

A larger plant runs its drives from a 690 V supply.

1. Estimate the DC link voltage on load and at no load.
2. With a regenerating load lifting the link by 25% above its no-load value and a 60 V turn-off overshoot, what peak voltage does each switch see?
3. Which standard voltage class of module would you expect, and what is the margin?
4. Using the drift region formulas, by what factor does a silicon unipolar device's specific on-resistance rise from a 1,200 V to a 1,700 V rating?

### Worked answer

1. On load, about 1.35 × 690 = 932 V; at no load, about √2 × 690 = 976 V.
2. 976 × 1.25 + 60 = 1,280 V.
3. 1,700 V modules are used for 690 V drives. The margin at 1,280 V is 1,700 ÷ 1,280 = 1.33, about 25% headroom below the rating.
4. R_on,sp ∝ V_B², so the factor is (1,700 ÷ 1,200)² = 2.01. Doubling the resistance for a 42% higher voltage is why high-voltage silicon switches rely on conductivity modulation, and why silicon carbide's advantage grows with the voltage rating.
