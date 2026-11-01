---
book: induction-hardening-by-the-numbers
chapterSlug: reference-depth-and-the-curie-point
order: 2
title: "Reference depth and the Curie point"
description: "How frequency, resistivity and permeability set the depth of induction heating, why steel's heating depth jumps when it passes its Curie point, and how to choose a frequency for a case depth."
draft: false
---

The single most important choice in induction hardening is the frequency. It decides how deep the induced current, and so the heat, goes into the part. Too low a frequency heats too deep, and the case comes out too thick or the part heats through; too high a frequency heats a skin too thin, and the case is too shallow or the surface overheats while the layer beneath stays cold. Frequency is usually fixed by the generator a shop owns, so the choice is often made once, when the equipment is bought, and lives with every part afterwards.

This chapter explains the reference depth and how to calculate it, shows why it changes dramatically as steel heats through its Curie point, applies a WORKOS tool to choose the frequency for the IH-40 journal, and works through a frequency chosen from the steel's properties at the wrong temperature. The arithmetic is a square root; the judgement is in choosing the right properties to put into it.

## The reference depth

The induced current density in a thick conductor falls off roughly exponentially from the surface. The depth at which it has fallen to about 37% of its surface value, 1 ÷ e, is the reference depth, δ, sometimes called the penetration or skin depth. About 86% of the heat is generated within that depth.

```figure
type: formula
title: Electromagnetic reference depth
formula: δ = 503 × √(ρ ÷ (μ_r × f)) metres, with ρ in Ω·m and f in Hz
formula: Frequency for a chosen depth: f = ρ × (503 ÷ δ)² ÷ μ_r
caption: The constant 503 comes from √(1 ÷ (π × μ₀)). Depth falls with the square root of frequency: four times the frequency halves the depth.
- δ | reference depth, m
- ρ | electrical resistivity of the steel at its temperature, Ω·m
- μ_r | relative magnetic permeability at its temperature (1 for non-magnetic material)
- f | frequency, Hz
```

The same physics appears well beyond heat treatment. Engineers meet it as the skin effect, which makes high-frequency currents in a cable flow only near the surface of the conductors, and in eddy current testing, whose probes see only as deep as their frequency allows. In a superconductor, a related but distinct effect keeps magnetic fields out of the interior except for a thin surface layer, the penetration depth, which theoretical physicists treat with the same kind of field theory they use for other phase transitions.

## Steel changes as it heats

The difficulty with steel is that ρ and μ_r change enormously during heating. Cold steel is ferromagnetic, with a relative permeability that may be tens to hundreds depending on the steel and the field strength, and a resistivity of perhaps 0.2 µΩ·m. As it heats, its resistivity rises steadily, to roughly 1 µΩ·m or more by hardening temperature. And at the Curie point, about 770 °C for iron and plain carbon steels, it stops being ferromagnetic altogether: its permeability falls to 1.

The Curie point is a phase transition in the magnetic order of the iron atoms. Below it, the atoms' magnetic moments line up with each other in domains; above it, thermal agitation wins and the alignment disappears. Unlike melting, it has no latent heat: the magnetisation fades away continuously as the temperature approaches the Curie point, which is why physicists call it a continuous transition. For an induction engineer, what matters is its consequence. The reference depth, which depends on √(ρ ÷ μ_r), jumps upwards as the surface layer passes the Curie point.

```figure
type: compare
title: Reference depth of the IH-40's steel, cold and hot
cols: Resistivity, µΩ·m | Relative permeability | Depth at 10 kHz, mm | Depth at 30 kHz, mm
rowhead: State of the surface layer
- Cold, magnetic | 0.2 | 50 | 0.32 | 0.18
- Cold, magnetic, higher permeability | 0.2 | 100 | 0.23 | 0.13
- * Above the Curie point, at hardening temperature | 1.1 | 1 | 5.28 | 3.05
caption: This is an illustration. Resistivity and permeability are representative working values for a medium-carbon steel; real values depend on the steel, temperature and field strength. The hot depth is ten to twenty times the cold depth.
```

The heating of a steel part therefore happens in two stages. While the surface is below its Curie point, the current flows in a very thin skin, and heating is fast and shallow. Once the surface layer passes the Curie point, the current spreads deeper into the now non-magnetic layer and heats it more evenly. The hardening depth is set by the hot, non-magnetic reference depth, because the case must be heated above the Curie point to harden at all. The generator also sees the change: the part's electrical load changes as it passes the Curie point, and the generator's controls must cope with it.

### Where the heat goes within the reference depth

The induced current density falls as e to the power of minus x ÷ δ with depth x, and the heat generated, which goes with the square of the current density, falls twice as fast, as e to the power of minus 2x ÷ δ. Two numbers follow. About 86% of all the heat is generated within the first reference depth, which is why δ is a good measure of where the heating happens. And about 63% is generated within the first half of it. The heating is strongly weighted towards the surface even within the reference depth, so the surface runs hotter than the layer beneath, and conduction, during the seconds of heating, carries heat inwards and evens the profile out.

For the IH-40 at 30 kHz, that means about 86% of the heat is generated in the outer 3.05 mm and about 63% in the outer 1.5 mm. The 2.0 mm case lies comfortably within the strongly heated band, and the layer between 2 and 3 mm, which must reach a lower temperature for a gradual transition to the core, gets its heat from both the tail of the current and conduction.

### Frequency and efficiency

Frequency also affects how efficiently the coil transfers power to the part. When the reference depth is small compared with the part's diameter, the induced current flows in a thin, well-defined layer and the coil couples to it efficiently. As the reference depth approaches a quarter of the diameter, currents from opposite sides of the bar begin to overlap and partly cancel, and the efficiency falls sharply; that is the reason for the tool's smallest ratio of diameter to reference depth. Very high frequencies, meanwhile, give very small depths with high resistance in the coil itself and its leads, and generators at those frequencies cost more per kilowatt. A frequency in the middle of the useful range for the parts a shop makes is the economical choice.

## Choosing the frequency for a case

A common rule of practice relates the hot reference depth to the case depth wanted: the reference depth should be somewhat larger than the case, so that the heat is generated in roughly the layer that must harden, but not so much larger that the part heats too deep. Practitioners often work with a hot reference depth between about one and two times the case depth. A second rule guards against heating a small bar through: the bar's diameter should be at least about four times the reference depth, or the currents from opposite sides overlap and cancel and the bar heats poorly and too deeply.

The WORKOS [Induction hardening plan](/tools/induction-hardening-plan/) tool applies these rules with the limits you set. From the bar diameter, heated length, case depth, the heated depth as a multiple of the case, the generator frequency, the steel's resistivity and relative permeability at the hardening temperature, your lowest and highest ratio of reference depth to case depth and your smallest ratio of diameter to reference depth, it gives the reference depth at the generator frequency, its ratio to the case depth, the frequency that would put the reference depth in the middle of your range, and the diameter as a multiple of the reference depth. It then works out the heating energy and power, which Chapter 3 uses. Its check asks for a process trial to prove the case on sectioned parts.

```figure
type: compare
title: The IH-40 journal at four generator frequencies
cols: Hot reference depth, mm | Ratio to the 2.0 mm case | Diameter ÷ reference depth | Tool's verdict
rowhead: Frequency
- 3 kHz | 9.64 | 4.82 | 4.2 | frequency too low for the case
- 10 kHz | 5.28 | 2.64 | 7.6 | frequency too low for the case
- * 30 kHz | 3.05 | 1.52 | 13.1 | frequency suits the case
- 100 kHz | 1.67 | 0.83 | 24.0 | frequency too high for the case
caption: This is an illustration. 40 mm bar, 2.0 mm case, ρ = 1.1 µΩ·m and μ_r = 1 at 900 °C, ratio range 1 to 2, smallest diameter ratio 4. The tool's frequency for the middle of the range, a reference depth of 3.0 mm, is 31.0 kHz.
```

At 30 kHz the hot reference depth, 3.05 mm, is 1.52 times the 2.0 mm case, close to the middle of the range, and the 40 mm journal is 13 reference depths across, far from heating through. That is why the manufacturer bought a 30 kHz generator. The tool's ideal for this case is 31.0 kHz, and a generator within a few kilohertz of it is as good as exact, because the depth varies only with the square root of frequency.

### Smaller bars and other cases

The same generator suits some parts better than others. This is an illustration. A 25 mm shaft with the same 2.0 mm case also suits 30 kHz: the ratio is again 1.52, and the diameter is 8.2 reference depths. A 15 mm pin with a 1.5 mm case is less comfortable: the reference depth is 2.03 times the case, just outside the range, and the tool suggests about 55 kHz. At 30 kHz the pin could still be hardened, but its case would tend to come out deeper and its heating would need care. A shop with one generator must decide which parts it suits and which it should send elsewhere.

### Shapes that are not round bars

The reference depth rules assume a round bar much larger than the depth. Real parts have edges, holes, steps and teeth, and the current follows the surface into each of them. At an outside edge the current from two faces crowds together and the edge overheats; in a narrow slot or between gear teeth the current struggles to reach the root and the root underheats. Gear teeth are the classic difficulty: a frequency low enough to heat the tooth root heats the tip through, and one high enough to harden only the tooth's skin leaves the root soft. Some machines solve it with two frequencies, a lower one to preheat the whole tooth and a higher one to harden its contour, applied together or in quick succession. For the IH-40's plain journal none of this arises, but it is the reason a frequency that suits a shaft may not suit the same shop's gears.

### What a generator's frequency really is

A solid-state generator does not run at one fixed frequency. It works with the coil and the part as a resonant circuit, and its frequency shifts as the part's electrical properties change during heating, rising or falling by a few per cent as the surface passes the Curie point. The nameplate frequency is a nominal value. The shift is small enough that it changes the reference depth by only a percent or two, but the generator's power and tuning must follow it, and the machine's process monitor records the frequency along with the power so that a change in the coil or the part shows up in the record.

## The error: a frequency chosen from cold properties

This is an illustration. Before the 30 kHz generator was bought, a quotation for a second-hand 3 kHz machine was considered. An engineer checked it by calculating the reference depth from the steel's handbook resistivity and permeability, room-temperature values of 0.2 µΩ·m and a permeability of 50. At 3 kHz that gives 503 × √(0.2 × 10⁻⁶ ÷ (50 × 3,000)) = 0.58 mm, a third of the 2.0 mm case, and the engineer concluded that 3 kHz would be, if anything, too shallow, and that the cheaper machine would do.

A trial at a contract heat treater's 3 kHz machine told a different story. Sections of the trial journals showed a case about 6 mm deep, three times the specification, and the journals had distorted by 0.3 mm, well beyond the grinding allowance.

The cold properties were the wrong ones. Hardening happens only after the layer has passed the Curie point, and above it the steel is non-magnetic with a resistivity about five times higher. The hot reference depth at 3 kHz is 503 × √(1.1 × 10⁻⁶ ÷ 3,000) = 9.6 mm, nearly five times the case. The heat had been generated in a layer far deeper than needed, and conduction had spread it deeper still.

```figure
type: compare
title: Reference depth at 3 kHz calculated two ways
cols: Resistivity, µΩ·m | Permeability | Reference depth, mm | Ratio to the 2.0 mm case
rowhead: Properties used
- Cold, room temperature (the engineer's) | 0.2 | 50 | 0.58 | 0.29
- * Hot, above the Curie point (correct for hardening) | 1.1 | 1 | 9.64 | 4.82
caption: This is an illustration. The cold calculation is wrong by a factor of more than sixteen. Frequency for hardening is always chosen on the hot, non-magnetic properties.
```

The manufacturer bought the 30 kHz machine and wrote into its process notes that reference depths for hardening are calculated with hot, non-magnetic properties, and that a frequency is not accepted until a sectioned trial part confirms it.

## Exercise: a deeper case

This is an illustration. A heavier-duty version of the shaft, IH-50, has a 50 mm journal and needs a case of 3.5 mm.

1. With ρ = 1.1 µΩ·m and μ_r = 1, what frequency puts the reference depth at 1.5 times the case?
2. What is the reference depth at the shop's 30 kHz, and its ratio to the case?
3. Would 30 kHz be acceptable with the 1 to 2 ratio range?

**Worked answer.**

1. Target δ = 1.5 × 3.5 = 5.25 mm. f = 1.1 × 10⁻⁶ × (503.3 ÷ 0.00525)² ÷ 1 = **10.1 kHz**.
2. δ = **3.05 mm** at 30 kHz (the depth does not depend on diameter); ratio 3.05 ÷ 3.5 = **0.87**.
3. **No**: 0.87 is below 1, so 30 kHz is too high for a 3.5 mm case by the shop's rule. The deeper case could still be achieved at 30 kHz by heating longer and letting conduction carry the heat in (Chapter 3), but with a hotter surface and a less controlled profile. A lower frequency, around 10 kHz, suits the deeper case better.
