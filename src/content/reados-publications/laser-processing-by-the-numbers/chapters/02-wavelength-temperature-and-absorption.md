---
book: laser-processing-by-the-numbers
chapterSlug: wavelength-temperature-and-absorption
order: 2
title: "Wavelength, temperature and how much a metal absorbs"
description: "Why good conductors reflect laser light, the Hagen–Rubens estimate and its limits, how wavelength and temperature raise absorption, and why copper is hard to pierce at 4 kW."
draft: false
---

The LC-4 cuts 1.5 mm stainless steel at 24 m/min without fuss, yet the first time the shop tried its 3 mm copper busbar links with similar settings, the machine stopped with a back-reflection alarm before a single hole was pierced. The power was the same and the copper was half the thickness of the brackets the machine cuts every day. What differed was how much of the light the metal absorbed and how fast the absorbed heat ran away.

This chapter explains why metals reflect, why the best electrical conductors reflect the most, and how wavelength and temperature change the absorbed share. It uses a long-wavelength estimate that works well for the CO₂ laser, shows where it stops working, and then calculates how hot a spot on each of the cell's metals can get. The mistake is the copper job.

## Why metals reflect

A metal is full of conduction electrons that move freely when an electric field acts on them. The electric field of a light wave pushes them to and fro at the light's frequency. Moving electrons are a current, and an oscillating current radiates. In a good conductor, the electrons respond so readily that the radiation they produce cancels the wave inside the metal and sends it back out: the metal reflects. The only light absorbed is what is lost when the electrons, while being driven, collide with the vibrating atoms, impurities and defects of the crystal and hand their energy over as heat.

Two consequences follow directly. A metal with fewer collisions, which is to say a better electrical conductor, reflects more and absorbs less. And anything that raises the electrical resistivity, such as heating the metal, alloying it or cold working it, raises its absorptivity. Copper and silver, the best conductors, are the best reflectors of infrared light; stainless steel, whose resistivity is about forty times copper's, absorbs far more.

## The long-wavelength estimate

At long infrared wavelengths, the electrons collide many times during each cycle of the light wave, and the metal behaves almost as it does with direct current. In that range, the absorptivity at normal incidence depends only on the frequency of the light and the metal's direct-current conductivity. The relation was first found experimentally by Hagen and Rubens in the early twentieth century and follows from the free-electron model of a metal.

```figure
type: formula
title: The Hagen–Rubens estimate of a metal's absorptivity at normal incidence
formula: A ≈ √(8 ε₀ ω ÷ σ) = √(8 ε₀ ω ρ)
formula: ω = 2πc ÷ λ
caption: Valid when the electrons collide many times per cycle of the wave, which is approached at long infrared wavelengths. Absorptivity rises with the square root of the frequency and of the resistivity.
- A | absorptivity at normal incidence, share of the incident power
- ε₀ | permittivity of free space, 8.854 × 10⁻¹² F/m
- ω | angular frequency of the light, rad/s
- σ, ρ | electrical conductivity, S/m, and resistivity, Ω·m, at the surface temperature
- c, λ | speed of light, m/s, and wavelength in vacuum, m
```

At the CO₂ laser's 10.6 µm, ω = 2π × 2.998 × 10⁸ ÷ 10.6 × 10⁻⁶ = 1.777 × 10¹⁴ rad/s, and 8ε₀ω = 12,590 in SI units. Multiplying by each metal's resistivity and taking the square root gives the estimates below.

```figure
type: bars
title: Hagen–Rubens absorptivity at 10.6 µm by metal, at room temperature unless stated
x: Metal and resistivity
y: Estimated absorptivity, %
caption: This is an illustration. Resistivities: copper 1.68 × 10⁻⁸ Ω·m, pure aluminium 2.65 × 10⁻⁸, aluminium 5052 4.93 × 10⁻⁸, mild steel 1.6 × 10⁻⁷, stainless steel 304 7.2 × 10⁻⁷, steel near 1,000 °C 1.2 × 10⁻⁶ (assumed typical values). Smooth, clean, unoxidised surfaces.
- Copper | 1.45
- Aluminium, pure | 1.83
- Aluminium 5052 | 2.49
- Mild steel | 4.49
- Stainless steel 304 | 9.52
- * Steel near 1,000 °C | 12.3
```

These numbers explain the CO₂ laser's long-standing reputation. Copper absorbs under 1.5% of its light, so the LC-2 cannot cut copper at all and struggles with aluminium. Mild steel absorbs under 5% when cold and bright. Measured values for real surfaces are often higher, because oxide and roughness add absorption, but the ranking is reliable.

### Temperature makes absorption grow

The resistivity of a metal rises as it warms, because the atoms vibrate more and scatter the electrons more often. Steel's resistivity rises about seven and a half times between room temperature and 1,000 °C. Because absorptivity goes with the square root of resistivity, the Hagen–Rubens estimate for steel rises by √(1.2 ÷ 0.16) = 2.74 times, from 4.5% to 12.3%.

That makes laser heating self-reinforcing. Once the surface starts to heat, it absorbs more, so it heats faster still. At the melting point and above, absorption is higher again, and an oxide layer formed in air or in an oxygen assist gas raises it further. The hardest moment in any laser process on a metal is the first: heating a cold, bright, reflective surface enough for absorption to take off. On steel it takes milliseconds; on copper, it may not happen at all.

## Shorter wavelengths, and where the estimate stops working

The Hagen–Rubens relation says absorptivity grows with the square root of frequency. Moving from 10.6 µm to the fibre laser's 1.07 µm multiplies the frequency by 9.9, so the estimate rises by √9.9 = 3.15 times: copper to 4.6%, stainless steel to 30%. This is the direction that matters in practice, and it is the main reason fibre and disc lasers took over metal cutting from CO₂ lasers.

The estimate itself, however, is outside its range at 1.07 µm. In copper, electrons collide about once every 2.5 × 10⁻¹⁴ s, while the light at 1.07 µm completes a cycle about every 3.6 × 10⁻¹⁵ s, so the electrons are driven through about seven cycles, or forty-four radians, between collisions rather than colliding many times in each cycle. In that regime the free-electron model predicts that absorptivity stops depending on frequency. Meanwhile, at visible and near-infrared wavelengths, electrons bound to the atoms begin to absorb light directly. In iron, nickel and chromium, these interband transitions raise absorption across the near infrared. In copper they begin in the visible, around green light, which is why copper looks reddish: it reflects red and absorbs green and blue.

For planning, the simple estimate gives the right trend and the right order of magnitude for steel at 1.07 µm, but real values must come from measurements. The cell uses the assumed values below.

```figure
type: compare
title: Absorptivity at normal incidence assumed for planning, by wavelength
cols: 10.6 µm, CO₂ | 1.07 µm, fibre | 0.515 µm, green
rowhead: Metal, clean surface at room temperature
- Copper | 0.015 | 0.05 | 0.40
- Aluminium alloys | 0.02 | 0.08 | 0.08
- Mild steel | 0.05 | 0.35 | 0.40
- Stainless steel | 0.10 | 0.35 | 0.40
caption: This is an illustration. Assumed values for clean, unoxidised surfaces, chosen to show the trends; they are not measured data. Measured values vary widely with surface finish, oxide, temperature and alloy, and the laser maker's process data take precedence.
```

The table shows the three facts a planner needs. Fibre lasers absorb several times better than CO₂ lasers in every metal. Steels absorb about a third of fibre laser light even when cold. And copper is the outlier: it absorbs only about 5% at 1.07 µm, but around 40% in green light, which is why green and blue lasers are used for welding copper in battery and electronics manufacturing.

### Surface condition outweighs the alloy

Chapter 1 showed that light is absorbed in a layer a few tens of nanometres deep. A real surface is rarely the clean metal the table assumes. Mill scale on hot-rolled steel is an oxide several micrometres thick that absorbs strongly, which is one reason hot-rolled plate pierces faster than cold-rolled. Roughness traps light in the same way the kerf does, with each microscopic pit giving the beam several strikes. A brushed or bead-blasted finish therefore absorbs more than a mirror finish of the same alloy. Oil, marking ink and protective film change absorption unpredictably and can burn, leaving residue on the cut edge.

In practice, two sheets of the same grade from different mills, or with different finishes, can differ in absorptivity by more than the difference between two neighbouring alloys. The cell records the supplier and finish of every sheet on its traveller, so that when a cut changes without any change to the machine, the sheet is the first thing compared.

### How absorptivity is measured

Absorptivity is measured in two ways. The direct way is to collect all the reflected light, scattered in every direction, with an integrating sphere and compare it with the incident power; the absorptivity is one minus the measured reflectivity. The indirect way is calorimetric, like the power puck in Chapter 1: a thin sample of known mass and specific heat is exposed to a measured beam, and its temperature rise gives the energy it absorbed. Both need care with the surface, because the act of heating can oxidise it and change the very property being measured. For production planning, the practical measurement is a parameter trial on the actual sheet: the slowest pierce and fastest clean cut the machine achieves are an indirect but reliable record of how the sheet absorbs.

## How hot can a spot get?

Absorptivity on its own does not decide whether a metal can be cut. The absorbed heat must also stay put long enough to melt the metal, and in a good conductor it runs away fast. A simple calculation shows how the two combine. If power P is absorbed with absorptivity A, uniformly over a circular spot of radius a on a thick body of thermal conductivity k, the steady temperature rise at the centre of the spot is ΔT = A P ÷ (π a k).

```figure
type: formula
title: Steady temperature rise at the centre of a uniformly heated circular spot on a thick body
formula: ΔT = q a ÷ k = A P ÷ (π a k)
formula: q = A P ÷ (π a²)
caption: A classical result for a uniform disc source on a semi-infinite solid with no heat loss from the surface. It is the highest temperature the spot could reach if the beam stood still and nothing melted; real temperatures are limited by melting and boiling.
- ΔT | steady temperature rise at the spot centre, K
- q | absorbed power per unit area, W/m²
- a | spot radius, m
- k | thermal conductivity, W/(m·K)
```

For the LC-4's 0.2 mm spot (a = 0.1 mm = 10⁻⁴ m) and 4,000 W, with the assumed absorptivities and room-temperature thermal conductivities:

```figure
type: compare
title: Steady temperature rise the LC-4's stationary 4 kW spot could produce, 0.2 mm diameter
cols: Absorptivity | Thermal conductivity, W/(m·K) | Absorbed, W | Steady rise, K
rowhead: Metal
- Stainless steel | 0.35 | 16 | 1,400 | 278,500
- Mild steel | 0.35 | 50 | 1,400 | 89,100
- Aluminium alloy | 0.10 | 138 | 400 | 9,230
- * Copper, bright | 0.05 | 400 | 200 | 1,590
- Copper, oxidised or hot | 0.15 | 400 | 600 | 4,780
caption: This is an illustration. Assumed absorptivities from the planning table and room-temperature conductivities. Rises of thousands of kelvin are not reached: they mean the metal melts and boils almost at once. Copper must rise about 1,065 K from 20 °C to melt.
```

The steels' numbers are physically meaningless, and that is the point: with tens of thousands of kelvin available, they melt within microseconds. Aluminium still has about fifteen times the rise of roughly 590 K it needs to melt. Bright copper, which needs a rise of 1,085 − 20 = 1,065 K to reach its melting point, has a steady-state ceiling of 1,590 K, only 1.5 times what it needs, and that ceiling is reached only after the heat has spread out to its steady pattern. Working back from the formula, a stationary spot on bright copper would melt it only if at least 1,065 × π × 10⁻⁴ × 400 ÷ 0.05 = 2,680 W were applied, two-thirds of the LC-4's full power. Once the surface oxidises or the metal is hot, with an absorptivity of 0.15, the figure falls to 890 W. Piercing copper is a race to get the surface hot enough for its absorption to rise before the heat conducts away.

### The mistake: copper with stainless settings

The busbar links are 3 mm copper, 40 mm wide and 120 mm long, with two 10.5 mm holes, ordered for a switchboard. A planner, seeing that the LC-4 cut 3 mm stainless at 10 m/min, copied the 3 mm stainless parameters with nitrogen assist and a continuous-wave pierce, and lowered the speed a little because copper "is softer". The machine stopped on the first pierce with a back-reflection alarm.

The alarm was doing its job. Light reflected from a flat, bright copper surface returns up the beam path, and a large enough share can damage the laser source. Fibre laser sources monitor returning light and shut down when it exceeds a limit. With bright copper reflecting 95% of the beam at normal incidence during a slow continuous pierce, the monitor tripped within a fraction of a second.

```figure
type: steps
title: How the copper job was put right
caption: This is an illustration. The changes follow the laser maker's guidance for reflective metals; the speed is about a third of that for the same thickness of stainless steel.
- Symptom | Back-reflection alarm on the first pierce; no hole formed
- Cause | Bright copper absorbs about 5% at 1.07 µm and conducts heat away 25 times faster than stainless steel
- Pierce | Pulsed pierce at high peak power, so each pulse heats the surface before the heat spreads
- Gas | Oxygen assist, so the hot surface oxidises and its absorptivity rises
- Surface | Links cut from clean, dry sheet with the protective film removed
- * Result | Pierce in 0.8 s, cutting at 3 m/min, no alarms; edges cleaned before plating
```

The deeper lesson is that parameters do not transfer between metals by thickness alone. The cell's rule now is that any new metal, or a known metal with an unusual surface such as polished, plated or painted, starts from the laser maker's parameters for that metal and is proved on an offcut before a production sheet is loaded. Reflective metals also go on the cell's register of jobs that may raise back-reflection alarms, so that a stop is treated as information rather than a fault to be reset and tried again.

## The other side of the coin: non-metals

The same physics explains why the cell keeps its old CO₂ machine. Most polymers, wood and glass have no free electrons; they absorb light through vibrations of their molecules, which are strong in the mid-infrared around 10 µm and weak in the near infrared. Clear acrylic absorbs the CO₂ laser's 10.6 µm almost completely in the first fraction of a millimetre, which gives the polished, flame-finished edge the shop's signage customers want. At the fibre laser's 1.07 µm, clear acrylic is largely transparent, and the beam would pass through it and damage the cutting table below. For non-metals, the longer wavelength is the right tool.

## Exercise: brass on the CO₂ machine

A customer asks whether the LC-2 can cut thin brass nameplates. The brass has a resistivity of 6.4 × 10⁻⁸ Ω·m. Using the Hagen–Rubens estimate at 10.6 µm, what is its absorptivity, how does that compare with copper, and how many watts would a bright brass surface absorb from the 1.9 kW the LC-2 delivers at the work?

### Answer

With 8ε₀ω = 12,590 at 10.6 µm, A = √(12,590 × 6.4 × 10⁻⁸) = √(8.06 × 10⁻⁴) = 0.0284, or 2.84%. For copper, A = √(12,590 × 1.68 × 10⁻⁸) = 0.0145. Brass therefore absorbs √(6.4 ÷ 1.68) = 1.95 times as much as copper, because absorptivity goes with the square root of resistivity.

From 1.9 kW at the work, bright brass would absorb 1,900 × 0.0284 = 54 W, against 28 W for copper. That is a very small amount of heat for a 0.11 mm spot on a metal with a thermal conductivity above 100 W/(m·K), and the back-reflected power, over 1.8 kW, is a hazard to the optics of a CO₂ machine that has no back-reflection protection. The answer to the customer is that the nameplates should be cut on the fibre laser with the maker's brass parameters, or marked and cut by another process.
