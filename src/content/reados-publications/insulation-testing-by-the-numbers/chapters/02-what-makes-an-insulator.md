---
book: insulation-testing-by-the-numbers
chapterSlug: what-makes-an-insulator
order: 2
title: "What makes an insulator"
description: "Why insulators barely conduct, where their small leakage current really comes from, volume and surface resistance, the strong effect of temperature, and a low reading blamed on the wrong path."
draft: false
---

An insulation resistance test reports a number in megohms or gigohms, and the number can change by a factor of a hundred between a clean, dry winding and a damp, dirty one. To read that number well, it helps to know why an insulator conducts so little in the first place, and where the small current it does conduct comes from. The answers explain why insulation resistance falls so steeply with temperature, why moisture and dirt dominate the reading, and why the path the current takes, through the material or across its surface, matters as much as the material itself.

This chapter explains why insulators insulate in terms of the energy bands of their electrons, describes the ions and surface films that carry the real leakage current, calculates volume and surface resistance for C-1's winding, shows how strongly resistance depends on temperature, and finishes with a low reading on C-2 that was blamed on wet groundwall insulation when the current was really flowing across a dirty terminal board.

## Conductors, semiconductors and insulators

In a solid, the electrons of the atoms do not keep the separate energy levels they have in isolated atoms. The levels of neighbouring atoms interact and spread into bands of allowed energies, separated by gaps where no electron states exist. This band picture, set out in solid state physics texts such as Kittel's, explains the difference between conductors and insulators.

In a metal such as copper, the highest band containing electrons is only partly filled. An applied field can easily move electrons into nearby empty states, so the electrons accelerate and carry current. Copper's resistivity is about 1.7 × 10⁻⁸ Ω·m at room temperature.

In an insulator, the electrons exactly fill a set of bands, called the valence band, and the next empty band, the conduction band, lies several electronvolts higher. A filled band cannot carry current, because there are no empty states for the electrons to move into. Current can flow only if electrons are lifted across the gap into the conduction band, leaving behind empty states, called holes, in the valence band.

A semiconductor has the same structure with a smaller gap. Silicon's band gap is about 1.1 eV, small enough that at room temperature heat lifts a useful number of electrons across it.

```figure
type: compare
title: Electrons in conductors, semiconductors and insulators
cols: Highest occupied band | Band gap | Carriers at room temperature
rowhead: Material type
- Metal, such as copper | partly filled | none | very many, about one per atom
- Semiconductor, such as silicon | filled | about 1.1 eV | few, set by heat and impurities
- Insulator, such as a polymer or mica | filled | several eV | almost none from the gap itself
caption: The band picture of solids. The carriers that make insulation leak in practice are mostly ions and surface films, not electrons lifted across the gap.
```

## How few carriers the gap allows

The number of electrons lifted across the gap by heat depends on the ratio of the gap to the thermal energy kT, where k is Boltzmann's constant, 8.617 × 10⁻⁵ eV per kelvin, and T is the absolute temperature. At 300 K, kT is about 0.0259 eV. For a pure material the density of carriers varies as exp(−E_g ÷ 2kT).

Compare silicon, with a gap of 1.1 eV, with an insulator whose gap is taken as 5 eV for illustration. The ratio of their intrinsic carrier densities is about exp(−(5 − 1.1) ÷ (2 × 0.0259)) = exp(−75.4), which is about 1.7 × 10⁻³³. Silicon itself is a poor conductor when pure; an insulator with a 5 eV gap would have, in effect, no carriers from the gap at all.

```figure
type: formula
title: Thermal carriers across a band gap
formula: n ∝ exp(−E_g ÷ 2kT)
formula: Ratio for two gaps: n₂ ÷ n₁ = exp(−(E_g2 − E_g1) ÷ 2kT)
caption: The proportionality ignores slowly varying factors, which do not change the conclusion. At 300 K, kT ≈ 0.0259 eV.
- n | density of electrons in the conduction band, per m³
- E_g | band gap, eV
- k | Boltzmann's constant, 8.617 × 10⁻⁵ eV/K
- T | absolute temperature, K
```

## Where the leakage current really comes from

If the band gap were the whole story, the insulation resistance of a winding would be immeasurably high. It is not, because real insulation contains other carriers.

**Ions** are the main ones. Resins, varnishes, papers and films contain traces of salts, residues of catalysts and curing agents, and products of their own ageing, which dissociate into charged ions. Under a steady field, the ions drift slowly through the material. Their mobility rises steeply with temperature because each jump from one site to the next needs a thermal activation energy.

**Water** increases the ionic conduction greatly. Absorbed water dissolves ionic impurities and helps them move, and many insulating materials take up water from humid air. Polymers with polar groups absorb more than non-polar ones; mica absorbs little, which is one reason mica-based systems are used in high-voltage machines.

**Surface films** are often the largest leakage path of all. A clean, dry insulating surface conducts very little, but dust, oil mist, salt and carbon combine with condensed or absorbed moisture to form a conducting layer across the surface. In a motor, the critical surfaces are the end windings, where the coils leave the slots and the insulation surface separates the conductors from the earthed core, and the terminal board, where the line terminals are mounted close to the earthed terminal box.

**Electrons injected** at the electrodes at high fields add a small current in some materials, but at the fields of a DC insulation test in a sound winding this is usually minor.

## Volume and surface resistance

The current through an insulation system follows two kinds of path, which act in parallel. The volume path runs through the bulk of the insulation, from the copper to the core. Its resistance depends on the material's volume resistivity, ρ_v, in ohm-metres, and on the geometry: it is proportional to the thickness and inversely proportional to the area. The surface path runs across the surface of the insulation from a conductor to an earthed part. Its resistance depends on the surface resistivity, ρ_s, in ohms (often called ohms per square), and on the ratio of the creepage length to the width of the path.

```figure
type: formula
title: Volume and surface resistance in parallel
formula: Volume path: R_v = ρ_v × d ÷ A        Surface path: R_s = ρ_s × L ÷ W
formula: Measured: 1 ÷ R = 1 ÷ R_v + 1 ÷ R_s
caption: The two paths share the applied voltage and the instrument sees their parallel combination. A low-resistance surface path hides a sound bulk insulation.
- ρ_v | volume resistivity, Ω·m
- d, A | insulation thickness and area, m and m²
- ρ_s | surface resistivity, Ω
- L, W | creepage length along the surface and width of the path, m
```

For C-1, the site's working model uses a groundwall 2.2 mm thick with an area in contact with the core of about 3.5 m², and a volume resistivity taken as 1 × 10¹⁴ Ω·m at 40 °C for illustration. The volume resistance is then 1 × 10¹⁴ × 0.0022 ÷ 3.5 = 6.29 × 10¹⁰ Ω, or about 62,900 MΩ.

The surface paths at the end windings have a creepage length of about 60 mm from the coil to the core, and their total width around the circumference and along all the coils is taken as about 10 m. On a clean, dry surface with ρ_s of 1 × 10¹⁴ Ω, the surface resistance is 1 × 10¹⁴ × 0.06 ÷ 10 = 6 × 10¹¹ Ω, or 600,000 MΩ, ten times the volume resistance; the winding's total resistance is about 56,900 MΩ, set mostly by the volume path. If the end windings are coated with oily dust and damp, so that ρ_s falls to 1 × 10¹⁰ Ω, the surface resistance falls to 60 MΩ, and the total falls to 59.9 MΩ. The bulk insulation has not changed at all.

```figure
type: stats
title: C-1's resistance paths in the working model
caption: This is an illustration. Material values are assumed for the calculation, not measured on a real winding. All values at 40 °C.
- 62,900 MΩ | volume path through the groundwall
- 600,000 MΩ | end-winding surface, clean and dry
- 56,900 MΩ | total, clean and dry
- 60 MΩ | end-winding surface, oily dust and damp
- 59.9 MΩ | total, dirty and damp: the surface path dominates
```

This simple model explains much of what insulation tests show. A low reading does not necessarily mean the bulk insulation is wet or damaged; it often means a surface is dirty and damp. Cleaning and drying a surface can raise the reading by a factor of a hundred or more. Conversely, a high reading does not prove the bulk insulation is sound, because voids and delamination, which are the main results of thermal ageing, barely change the DC conduction at all.

## Temperature

Because ionic conduction is thermally activated, the resistivity of insulation falls exponentially as temperature rises. A common rule of thumb in motor testing is that insulation resistance roughly halves for each 10 °C rise, and the cold store's procedure corrects all readings to 40 °C on that basis, as Chapter 4 explains.

The rule corresponds to an Arrhenius dependence with a particular activation energy. If resistance halves between 35 °C and 45 °C, the activation energy is k × ln 2 ÷ (1 ÷ 308.15 − 1 ÷ 318.15) = 0.59 eV. Near 40 °C the two descriptions agree closely; far from it they diverge. At 0 °C the halving rule predicts a resistance 16 times that at 40 °C, while the Arrhenius form with 0.59 eV predicts 24 times. Real insulation systems do not follow either exactly, and the best correction for an important machine comes from readings taken on that machine at several temperatures.

```figure
type: line
title: Insulation resistance relative to its value at 40 °C, halving rule
x: Winding temperature, °C
y: Resistance relative to 40 °C
ymin: 0
ymax: 16
caption: The site's correction rule: resistance halves for each 10 °C rise. A reading taken on a cold winding is much higher than the same winding would show at 40 °C, so uncorrected readings cannot be compared.
- 0 | 16
- 10 | 8
- 20 | 4
- 30 | 2
- 40 | 1
- 50 | 0.5
- 60 | 0.25
- 70 | 0.125
- 80 | 0.0625
```

## The mistake: the wrong path

After a two-week shutdown for plant room work in winter, C-2 was tested before restart. At 2,500 V DC its one-minute insulation resistance was 58 MΩ at a winding temperature of 12 °C. Its previous reading, a year earlier at a similar temperature, had been about 4,000 MΩ. The technician concluded that the groundwall had absorbed water during the shutdown and booked a contractor to dry the winding with a low-voltage heating current over two days.

The electrical supervisor asked for one more test first. The terminal box had been open during the plant room work, and the terminal board inside was visibly coated with oily dust from the compressor area. The supervisor repeated the test with a guard electrode, a bare wire wrapped around the surface of each terminal insulator and connected to the instrument's guard terminal, so that current flowing across the terminal surfaces would bypass the measuring circuit. The guarded reading was 3,900 MΩ.

The terminal surfaces had therefore been carrying most of the current. From the two readings, their resistance was about 1 ÷ (1 ÷ 58 − 1 ÷ 3,900) = 59 MΩ in parallel with the winding. After the terminal board was cleaned with an approved solvent and dried, the unguarded reading was 3,850 MΩ, and the winding drying was cancelled.

```figure
type: steps
title: Finding the surface path on C-2
caption: This is an illustration. Readings at 2,500 V DC and one minute, at a winding temperature of 12 °C.
- First test, unguarded | 58 MΩ, against about 4,000 MΩ a year earlier
- First conclusion | groundwall wet; two-day drying booked
- Inspection | terminal board coated with oily dust after the terminal box was left open
- Guarded test | 3,900 MΩ with the terminal surfaces guarded
- * Surface path | about 59 MΩ across the terminal board
- Fix | terminal board cleaned and dried; unguarded reading 3,850 MΩ; drying cancelled
```

The site's procedure now says that any low reading is followed by a visual inspection of the terminal box and end windings, and by a guarded test where a surface path is suspected, before any conclusion is drawn about the winding itself. Terminal boxes are kept closed and their gaskets checked.

## Resistance is not strength

A high insulation resistance and a high dielectric strength are different properties, and it is easy to confuse them. Resistance measures how little current the insulation conducts at a modest DC voltage. Dielectric strength measures the field the insulation can withstand before it breaks down. A winding can have a very high resistance and still contain a crack, a void or a thin spot that will break down at a surge or at a proof test, because a dry crack filled with air conducts almost nothing at the test voltage. Equally, a winding can have a modest resistance because of a damp surface and still be strong enough to run safely once the surface has dried.

This is why the insulation resistance test is described as a test of cleanliness and dryness rather than of strength. It finds the problems that create conducting paths, mainly moisture and contamination, and is much less sensitive to the problems that weaken insulation without creating such paths, mainly thermal ageing, voids and mechanical damage. Chapters 7 and 8 describe the tests that find those.

## Ageing and resistance

As organic insulation ages thermally, it often becomes more resistive rather than less, at least for a time, because volatile components and absorbed moisture are driven off and the resin cures further. An old, brittle winding can therefore read better than it did when new. The resistance trend falls only later, when cracks open and admit moisture and dirt. A rising or steady reading on an old machine is not, by itself, evidence of good health.

## Exercise: an evaporator fan motor's paths

An evaporator fan motor's slot liner has an area of about 0.115 m² and a thickness of 0.3 mm, with a volume resistivity taken as 1 × 10¹³ Ω·m. Its terminal block has a creepage path 10 mm long and 20 mm wide, which after condensation has a surface resistivity of about 1 × 10⁹ Ω. Calculate the volume and surface resistances and the total, and say which dominates.

### Answer

**Given:** A = 0.115 m², d = 0.0003 m, ρ_v = 1 × 10¹³ Ω·m; L = 0.010 m, W = 0.020 m, ρ_s = 1 × 10⁹ Ω.

**Assumptions:** uniform material and surface; the two paths act in parallel; the values are illustrative.

**Method:** R_v = ρ_v d ÷ A; R_s = ρ_s L ÷ W; 1 ÷ R = 1 ÷ R_v + 1 ÷ R_s.

**Volume:** 1 × 10¹³ × 0.0003 ÷ 0.115 = 2.61 × 10¹⁰ Ω, or 26,087 MΩ.

**Surface:** 1 × 10⁹ × 0.010 ÷ 0.020 = 5 × 10⁸ Ω, or 500 MΩ.

**Total:** 1 ÷ (1 ÷ 26,087 + 1 ÷ 500) = 490.6 MΩ.

**Conclusion:** the damp terminal block dominates. The reading of about 490 MΩ says little about the slot liner, which is fifty times better. Drying the terminal block, or guarding it during the test, would show the winding's own resistance.

**Verification:** the parallel combination is less than the smaller of the two resistances, as it must be, and close to it because the other is so much larger.
