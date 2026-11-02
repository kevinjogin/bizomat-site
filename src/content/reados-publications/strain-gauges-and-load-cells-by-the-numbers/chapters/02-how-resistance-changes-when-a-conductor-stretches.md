---
book: strain-gauges-and-load-cells-by-the-numbers
chapterSlug: how-resistance-changes-when-a-conductor-stretches
order: 2
title: "How resistance changes when a conductor stretches"
description: "Why a metal conducts, why its resistance rises when it is stretched, what the gauge factor is made of, how foil and semiconductor gauges differ, and how small the signal from a load cell really is."
draft: false
---

A strain gauge turns strain into a change of electrical resistance. That sounds simple, and the arithmetic is, but the change is astonishingly small. When one of BH-2's load cells takes on another kilogram, the resistance of each of its gauges changes by about a third of a milliohm in 350 Ω, roughly one part in a million. Everything about how gauges are made, wired and protected follows from that number.

This chapter explains why metals conduct and why their resistance depends on the state of the metal, how stretching a conductor changes its resistance through both its shape and its resistivity, and what that means for the gauge factor of metal foil and semiconductor gauges. It then works out the signal from BH-2's cells, shows how a damp gauge can invent seventeen kilograms, and ends with shunt calibration.

## Why a metal conducts

In a metal, each atom gives up one or more of its outer electrons to a pool shared by the whole crystal. These conduction electrons move freely through the lattice at very high speed, but in all directions at once, so there is no net current. Apply a voltage and they acquire a small average drift in one direction, which is the current. What limits the current is how often the electrons are knocked off course. A perfect, motionless crystal would not scatter them at all; real metals scatter them at vibrating atoms, at impurity atoms, at the boundaries between grains and at any other disturbance to the regular array.

The simple free-electron picture gives the resistivity as ρ = m ÷ (n e² τ), where m and e are the electron's mass and charge, n is the number of conduction electrons per cubic metre and τ is the average time between collisions. For copper, with about 8.5 × 10²⁸ conduction electrons per cubic metre and a resistivity of 1.68 × 10⁻⁸ Ω·m at room temperature, τ works out at about 2.5 × 10⁻¹⁴ s. Moving at their characteristic speed of about 1.6 × 10⁶ m/s, the electrons travel about 39 nm between collisions, roughly 150 atomic spacings.

```figure
type: formula
title: Resistivity and resistance
formula: ρ = m ÷ (n × e² × τ)
formula: R = ρ × L ÷ A
caption: ρ is resistivity (Ω·m), m and e the electron's mass and charge, n the density of conduction electrons, τ the mean time between scattering events, R the resistance of a conductor of length L and cross-section area A. Anything that changes how often electrons scatter changes ρ: temperature, alloying and, as this chapter shows, strain.
- ρ | resistivity, Ω·m
- n | conduction electrons per m³
- τ | time between collisions, s
- R | resistance, Ω
```

Two kinds of scattering matter for strain gauges. Scattering by the vibrating lattice grows as the metal warms, which is why the resistance of a pure metal rises with temperature, by about 0.4% per kelvin for copper. Scattering by the disorder of an alloy, where atoms of two kinds are mixed at random on the lattice, hardly depends on temperature at all. Chapter 3 shows why gauge alloys are chosen so that the second kind dominates.

## Stretching a conductor

Stretch a wire and its resistance rises for two reasons. Its shape changes: it gets longer and, because of Poisson's ratio, thinner. And its resistivity changes, because stretching alters the spacing of the atoms and so the way the electrons move and scatter. The gauge factor, the fractional change in resistance per unit strain, collects both effects.

```figure
type: formula
title: The gauge factor
formula: ΔR ÷ R = ΔL ÷ L − ΔA ÷ A + Δρ ÷ ρ
formula: ΔR ÷ R = ε × (1 + 2ν) + Δρ ÷ ρ
formula: GF = (ΔR ÷ R) ÷ ε = 1 + 2ν + (Δρ ÷ ρ) ÷ ε
caption: With ν ≈ 0.3, the change of shape alone gives a gauge factor of 1.6. A copper–nickel gauge alloy measures about 2.0 to 2.1, so its resistivity change adds roughly another 0.4 to 0.5. In semiconductors the resistivity term dominates and can be 50 to 100 times larger.
- GF | gauge factor
- 1 + 2ν | contribution of the change in shape
- (Δρ ÷ ρ) ÷ ε | contribution of the change in resistivity
```

The effect was noticed in stretched iron and copper wires by William Thomson, later Lord Kelvin, in 1856, but it was too small to be useful until bonded wire gauges were developed in the late 1930s. In 1954 C. S. Smith reported that germanium and silicon change their resistivity under stress far more strongly than metals, because strain shifts the energy bands that their charge carriers occupy. That piezoresistance is the basis of semiconductor gauges and of the silicon pressure sensors found in almost every modern pressure transmitter.

```figure
type: compare
title: Gauge materials compared
cols: Gauge factor | Temperature behaviour | Typical use
rowhead: Material
- * Copper–nickel alloy (constantan type) | about 2.0–2.1 | Very small change of resistance with temperature; can be matched to steel or aluminium | Load cells and general stress analysis
- Nickel–chromium alloy | about 2.1 | Small change; good at higher temperature and over long periods | Transducers needing long-term stability, wider temperature ranges
- Platinum–tungsten alloy | about 4 | Larger change with temperature | High-temperature and fatigue-resistant gauges
- p-type silicon | about +100 or more | Large and non-linear change with temperature | Small, high-output sensors, pressure transmitters
- n-type silicon | about −100 or more | Large and non-linear change with temperature | Paired with p-type in some bridges
caption: Indicative values from gauge makers' published data; the exact gauge factor of each gauge lot is printed on its packet and must be used. Semiconductor gauges give far more signal but need careful temperature compensation and are rarely used in weighing.
```

Why, then, does almost every weighing load cell use metal foil with a gauge factor of about 2 rather than silicon with 50 times the signal? Because in weighing the problem is not too little signal but too much error. Modern indicators resolve a fraction of a microvolt, so the 2 mV/V of a metal-gauged cell is ample. What limits accuracy is how much the output changes with temperature, time and load history, and there the metal alloy wins easily: its resistance hardly changes with temperature, its gauge factor is nearly constant over the working range, and its response is linear. A silicon gauge's large output comes with a resistance and gauge factor that change strongly and non-linearly with temperature, which must be corrected electronically. Silicon earns its place where size, signal or cost matter more than the last few hundredths of a per cent, as in pressure transmitters.

## The foil gauge

Modern gauges are not wire but a grid photo-etched from metal foil a few micrometres thick, bonded to a thin plastic carrier, usually polyimide. The grid runs back and forth so that a long conductor fits in a few millimetres; its end loops are made wide so that strain across the grid changes their resistance very little. Common resistances are 120 Ω for general stress analysis and 350 Ω or 1,000 Ω for transducers. The higher values draw less current for a given excitation voltage, so the gauges heat less and the resistance of connecting wires matters less.

The gauge is glued to the carefully prepared metal with an adhesive that is cured, often under pressure and heat, so that it transmits the strain of the surface to the grid without slipping. Every adhesive creeps a little under sustained strain, which would make the reading drift down while a load stays on. Load cell makers counter this by adjusting the length of the grid's end loops so that the gauge's own creep cancels the spring element's creep, which is one of the reasons a cell's performance depends so much on the maker's process.

Finally, the gauge and its connections are sealed against moisture. The section after next explains why that matters so much.

## Choosing a gauge

Most people who buy load cells never choose a gauge, because the cell maker has done it. But anyone who instruments a structure, a test rig or a machine part does, and the choice follows from the physics above.

**Resistance.** A 120 Ω gauge is cheap and common, and suits short leads and low excitation. A 350 Ω gauge draws about a third of the current at the same voltage, so it heats a third as much and can be run at a higher voltage for more signal; it is also less affected by the resistance of its leads, which is in series with it. Thin or poorly conducting materials, such as plastics and composites, need a 350 Ω or 1,000 Ω gauge and low excitation because they cannot carry the heat away.

**Grid length.** A short grid, 1 to 3 mm, finds the peak strain in a steep gradient, near a fillet or hole. A longer grid, 6 mm or more, averages over the grain of coarse materials such as cast iron, timber or concrete, and dissipates heat better. On a smooth, uniformly strained surface the length matters little.

**Temperature match.** Gauges are sold matched to the expansion coefficient of a particular material, typically steel, stainless steel or aluminium. Chapter 3 explains what that buys and why a gauge matched to steel must not be glued to aluminium.

**Gauge factor and its tolerance.** Each lot is measured and the packet states its gauge factor with a tolerance, usually around 1%. The value goes into the amplifier or the strain calculation; leaving the instrument at a default of 2.000 when the packet says 2.08 makes every reading 4% high.

**Strain range and fatigue.** Foil gauges are linear to strains of a few per cent in the foil, far beyond what a steel structure reaches, but they fatigue under large repeated strain. Makers publish fatigue lives against strain amplitude; a load cell running at about 1,000 µε is well inside them, but a gauge on a vibrating part near its own fatigue limit may fail before the part does.

**Protection.** Indoors and dry, a light coating is enough. Outdoors, in wash-down areas or where condensation forms, the gauge needs a layered coating and a sealed cable entry, because, as the next section shows, a few drops of water defeat everything else.

```figure
type: checklist
title: Choosing a gauge for a structure or test rig
caption: General guidance; the gauge maker's selection and installation instructions govern a real installation.
- x Resistance: 350 Ω or more for transducers, thin parts and long leads
- x Grid length: short for peaks, long for coarse materials
- x Temperature match to the material the gauge is bonded to
- x Gauge factor from the packet entered in the instrument
- x Fatigue life adequate for the strain amplitude and number of cycles
- x Adhesive, cure and coating suited to the temperature, moisture and chemicals
- ? Insulation resistance to the part checked after bonding and again after coating
```

## The case: how big is the signal?

Each of BH-2's load cells contains four 350 Ω gauges and is designed so that its rated 2,000 kg produces about 1,000 µε at the gauges. With a gauge factor of 2.0, a gauge at rated load changes by 350 × 2.0 × 0.001 = 0.70 Ω, or 0.2%. At the end of a full batch, 1,216.7 kg per cell, the strain is about 608 µε and the change 0.43 Ω.

```figure
type: steps
title: From one kilogram to a change of resistance in BH-2
caption: This is an illustration. Gauge factor 2.0; 1,000 µε at the rated 2,000 kg of each cell; the batch is shared equally by three cells. One display division, 1 kg on the whole hopper, is a third of a part per million of a gauge's resistance.
- One cell, rated load: 350 × 2.0 × 1,000 µε | 0.70 Ω
- One cell, full batch: 350 × 2.0 × 608 µε | 0.43 Ω
- One kilogram on one cell: 0.5 µε | 0.35 mΩ
- * One kilogram on the hopper, a third on each cell: 0.167 µε | 0.12 mΩ, 0.33 ppm
```

No ohmmeter can follow a change of 0.12 mΩ in 350 Ω reliably while the room warms and the leads move. The Wheatstone bridge in Chapter 4 solves the problem by comparing gauges with each other, so that only differences between them produce a signal. But it does not solve every problem, as the mill found.

## When it goes wrong: a damp gauge invents seventeen kilograms

During a wet summer, one of the cells under BH-2's predecessor began to read high in the mornings and drift back during the day. The zero moved by up to about 17 kg. The cell's cable gland had cracked, and water had crept along the cable into the gauge pocket.

The physics is a parallel path. A gauge grid sits a few tens of micrometres from the steel of the spring element, separated only by its carrier and adhesive. When moisture gets in, current leaks from the grid through the damp insulation to the steel, and that leakage path acts as a resistor in parallel with the gauge. A resistance R_leak in parallel with a gauge of resistance R lowers it by about R² ÷ R_leak, which the bridge reads as a strain of R ÷ (GF × R_leak).

```figure
type: compare
title: Apparent strain from insulation leakage across one 350 Ω gauge
cols: Apparent strain | Apparent change on that cell | Condition
rowhead: Leakage resistance
- 5,000 MΩ | 0.035 µε | 0.07 kg | Dry, healthy cell
- 1,000 MΩ | 0.175 µε | 0.35 kg | Marginal: investigate
- * 20 MΩ | 8.75 µε | 17.5 kg | Wet: replace the cell
caption: This is an illustration. Apparent strain = R ÷ (GF × R_leak) with R = 350 Ω and GF = 2.0; on these cells 1 µε is 2 kg. A shunt lowers the resistance, so on a gauge in tension it reads as less load; which way the zero moves depends on which bridge arm the leak affects. The value changes as the moisture moves, which is what makes the fault look like drift.
```

Finding the fault took longer than fixing it. The first suspicion was the indicator, so a technician connected a load cell simulator in place of the cells: a precision resistor network that produces a fixed, known output. The indicator read it correctly morning and afternoon, which put the indicator in the clear. The second suspicion was the junction box, which was opened, dried and found clean. Only then were the cells disconnected one at a time, and the morning drift followed one cell. Working from the indicator back to the sensor, and changing one thing at a time, is slow but it finds the real cause instead of the most likely one.

The fault was found by measuring the insulation resistance between the cell's conductors and its body with a low-voltage insulation tester, as the cell maker's instructions describe. The healthy cells read thousands of megohms; the damp one read about 20 MΩ. Chapter 10 returns to insulation testing as routine maintenance and to the precautions that stop it damaging the cell. The new cells are hermetically sealed, and their cable entries are now inspected each quarter.

## Shunt calibration

The parallel-resistor effect is also a useful tool. Connecting a known, high-value precision resistor across one gauge simulates a known strain, which lets an instrument technician check an amplifier or indicator's span without loading the structure. The simulated strain is R ÷ (GF × (R + R_shunt)), negative because the resistance falls. To simulate 1,000 µε on a 350 Ω gauge with a gauge factor of 2.0, the shunt must be 350 ÷ (2.0 × 0.001) − 350 = 174,650 Ω.

Shunt calibration checks the electronics, not the spring element or the gauges' bond, so it complements calibration with weights (Chapter 8) rather than replacing it. Many indicators and data loggers have built-in shunt resistors switched across one bridge arm for exactly this check.

## Exercise: simulating a strain

A technician wants to check a strain amplifier connected to a 350 Ω gauge with a gauge factor of 2.0.

1. What shunt resistor simulates −500 µε?
2. The only precision resistor available is 100 kΩ. What strain does it simulate?
3. The amplifier displays −1,738 µε with the 100 kΩ shunt. Is its span within 0.5%?

**Answer.**

1. R_shunt = 350 ÷ (2.0 × 0.0005) − 350 = 349,650 Ω, about 350 kΩ.
2. ε = 350 ÷ (2.0 × (350 + 100,000)) = 0.001744, so the shunt simulates −1,744 µε. A smaller shunt gives a larger simulated strain.
3. The error is (1,738 − 1,744) ÷ 1,744 = −0.34%, within 0.5%. The check is only as good as the shunt resistor's tolerance and the gauge factor entered in the amplifier, so both should be recorded with the result.
