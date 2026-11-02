---
book: distribution-transformers-by-the-numbers
chapterSlug: core-losses-hysteresis-eddy-currents-and-laminations
order: 3
title: "Core losses: hysteresis, eddy currents and laminations"
description: "Where no-load loss comes from: hysteresis, eddy currents and excess loss, why cores are laminated, how core building adds loss, and why amorphous metal cores lose far less."
draft: false
---

TX-1 dissipates 2.40 kW in its core every hour it is energised, whether the plant is running flat out or shut for Christmas. Over a year that is 21,000 kWh, spent magnetising steel back and forth fifty times a second. It is called no-load loss, or iron loss, and it is the price of the core's ability to carry a large alternating flux.

This chapter explains where that loss comes from. It looks at hysteresis, the energy lost in turning the core's magnetisation round each cycle; at eddy currents, the currents the changing flux induces in the steel itself; and at the excess loss that the simple theories miss. It then works out why cores are made of sheets a quarter of a millimetre thick, how building a core adds a quarter again to the steel's own loss, and why amorphous metal cores lose two-thirds less. It ends with a fault that turned part of TX-1's core into a heater.

## Hysteresis

Chapter 1 described how a core magnetises by the movement of domain walls, and how the walls catch on impurities, grain boundaries and stresses and then jump free. Because of this the core's flux density does not follow the applied field along one curve: on the way up it lags behind, on the way down it lags behind again, and the curve of flux density against field forms a loop. The area of the loop is the energy dissipated per cubic metre of steel in each cycle, and since the loop is traced fifty times a second, the hysteresis loss per kilogram is proportional to frequency.

The loss also rises with the peak flux density, more than in proportion, because a bigger excursion drives the walls through more obstacles and, near saturation, needs the magnetisation to rotate against the crystal's preferred directions. Steel makers publish curves of loss against peak flux density for each grade, measured on standard test samples, and designers work from those.

## Eddy currents

The alternating flux in the core induces voltages not only in the windings but in the steel itself. Any closed path in the steel around the flux carries a current, and since steel is a conductor those currents can be large. They heat the steel, and they also oppose the flux that causes them, pushing it towards the surface of a solid block. A solid iron core at 50 Hz would be a very effective induction heater.

The cure is to build the core from thin sheets, laminations, each coated with a thin insulating layer, stacked with the sheets parallel to the flux. The eddy currents are then confined to loops within each sheet's thickness, and those loops are small. For a sheet of thickness t, resistivity ρ and density d, the classical theory gives a simple result.

```figure
type: formula
title: Classical eddy current loss in a thin lamination
formula: P_eddy = π² × t² × f² × B_peak² ÷ (6 × ρ × d)
caption: P_eddy in watts per kilogram, t the sheet thickness (m), f the frequency (Hz), B_peak the peak flux density (T), ρ the steel's resistivity (Ω·m) and d its density (kg/m³). The loss rises with the square of thickness, frequency and flux density, and falls with resistivity: hence thin sheets of high-resistivity silicon steel.
- t | lamination thickness, m
- ρ | resistivity, about 0.48 × 10⁻⁶ Ω·m for 3% silicon steel
- d | density, about 7,650 kg/m³
```

For TX-1's steel, 0.27 mm thick, at 50 Hz and 1.65 T, the formula gives 0.22 W/kg. Thicker or thinner sheets change it with the square of the thickness.

```figure
type: compare
title: Classical eddy loss at 50 Hz and 1.65 T for different sheet thicknesses
cols: Classical eddy loss | Compared with 0.27 mm
rowhead: Material and thickness
- Silicon steel, 0.35 mm | 0.374 W/kg | 168%
- Silicon steel, 0.30 mm | 0.274 W/kg | 123%
- * Silicon steel, 0.27 mm | 0.222 W/kg | 100%
- Silicon steel, 0.23 mm | 0.161 W/kg | 73%
- Amorphous ribbon, 0.025 mm, at 1.35 T | 0.0005 W/kg | 0.2%
caption: Calculated from the classical formula with ρ = 0.48 µΩ·m and d = 7,650 kg/m³ for silicon steel, and ρ = 1.3 µΩ·m and d = 7,180 kg/m³ for an iron-based amorphous ribbon. Real losses are higher, as the next section explains.
```

Thinner sheets cost more to roll, are harder to handle and stack less densely, because the insulating coatings take up a larger share of the stack, so there is an economic optimum. For large distribution transformers it has settled at 0.23 to 0.30 mm.

## Excess loss and the measured total

If the classical eddy loss were the whole story, TX-1's steel would lose 0.22 W/kg plus its hysteresis loss. Measured on standard samples, the grade loses about 1.04 W/kg at 1.65 T and 50 Hz, according to the maker's curve, and the classical theory accounts for only a fifth of it. The rest is hysteresis plus an excess, or anomalous, eddy loss.

The excess arises because the flux does not change smoothly and uniformly through the sheet as the classical theory assumes. It changes by the movement of a few domain walls, so at any moment the change is concentrated near the moving walls, and the local eddy currents there are much stronger than the average suggests. Grain-oriented steel's large grains and wide domains make this worse. Steel makers reduce it by domain refining: scratching the sheet surface with a laser or mechanically at regular intervals across the rolling direction, which splits the wide domains into narrower ones whose walls move shorter distances. Domain-refined grades lose noticeably less, at a higher price.

```figure
type: bars
title: How TX-1's core loss builds up, per kilogram of steel
x: Component
y: Loss, W/kg
caption: This is an illustration. Classical eddy loss from the formula; the steel's total from an assumed maker's curve at 1.65 T and 50 Hz; the building factor of 1.25 is a typical value for a well-built stacked core with step-lap joints.
- Classical eddy loss | 0.22
- Hysteresis and excess loss | 0.82
- Steel on its own, from the maker's curve | 1.04
- * In the built core, × 1.25 | 1.30
```

## Building the core

A finished core loses more than its steel did on the test bench. Cutting the sheets leaves burrs that can bridge the insulation between neighbouring sheets and create eddy paths across the stack. Cutting and handling strain the steel and pin its domain walls. At the corners and joints, where the sheets meet or overlap, the flux has to cross small air gaps or turn away from the rolling direction, and it crowds into some sheets more than others. Clamping the core too hard stresses it. All of these add loss, and their combined effect is expressed as a building factor: the built core's loss divided by the steel's test loss at the same flux density.

TX-1's 1,850 kg core, at the steel's 1.04 W/kg and a building factor of 1.25, loses 1,850 × 1.04 × 1.25 = 2,405 W, which is the 2.40 kW in its test report. The building factor alone costs 481 W, about a fifth of the total. Good core builders use step-lap joints, in which the joints of successive layers are staggered in small steps so that the flux crosses each gap gradually, and they control burrs and clamping carefully. The building factor is one reason two transformers with the same steel grade can have quite different guaranteed losses.

## No-load loss and the supply voltage

Because the flux density follows the voltage, so does the no-load loss. As a rough rule for this illustration, the core loss is taken to rise with the square of the peak flux density over the working range. With the plant's supply at 11.3 kV and TX-1 on its principal tap, the flux density is 1.695 T and the no-load loss rises to about 2.40 × (1.695 ÷ 1.65)² = 2.54 kW. On the +2.5% tap, with the flux density back at 1.655 T, it is 2.42 kW. Moving to the correct tap in Chapter 2 saved about 1,040 kWh a year, A$176 at A$0.17/kWh, as well as reducing the noise and the voltage stress on the plant's equipment.

## The no-load current

The current TX-1 draws with no load connected has two parts. One is in phase with the voltage and supplies the 2.40 kW of core loss. The other lags the voltage by a quarter of a cycle and sets up the flux; it carries no energy on average, but it must flow through the supply. Together they make the no-load current, which for a transformer of this size is typically well under 1% of rated current. As an illustration, if TX-1's no-load current is 0.6% of rated, its no-load apparent power is 0.006 × 1,500 = 9 kVA, of which 2.4 kW is loss and, by Pythagoras, about 8.7 kvar is the reactive power that magnetises the core.

The magnetising part is not sinusoidal. Because the steel's flux density does not rise in proportion to the field near the top of each half cycle, a sinusoidal flux needs a peaky current rich in the third harmonic. In TX-1 those third-harmonic currents circulate in the delta HV winding and do not reach the 11 kV network, one of the reasons for the delta connection in Chapter 2.

Two practical consequences follow. At night, when the plant's load is small, TX-1's magnetising reactive power is a noticeable part of what the site draws, and a power factor correction bank sized for the daytime load can overcorrect, pushing the site's power factor leading. Modern automatic correction banks switch steps in and out to avoid that. And because the magnetising current rises steeply with flux density, it is a sensitive indicator of over-voltage: a transformer on the wrong tap for a high supply draws noticeably more no-load current and hums louder before its losses change much.

## Amorphous metal cores

An amorphous metal is an alloy, typically of iron with boron and silicon, cooled from the liquid so fast, about a million kelvin per second, that its atoms have no time to arrange themselves into crystals. It is cast as a ribbon about 0.025 mm thick. The disorder that the physics of Chapter 1 might suggest would be a handicap turns out to be an advantage: with no crystals there are no crystal directions for the magnetisation to prefer, no grain boundaries to pin domain walls, and the random arrangement of atoms scatters conduction electrons so strongly that the resistivity is about 1.3 µΩ·m, nearly three times that of silicon steel.

The result is a very narrow hysteresis loop and, with a ribbon a tenth the thickness of a lamination, negligible classical eddy loss. An amorphous core typically loses 60 to 70% less than a silicon steel core of the same rating. That is why the low-loss option in Chapter 8 has a no-load loss of 0.85 kW against 2.30 kW for a conventional 2,000 kVA unit.

The disadvantages come from the same physics. The saturation flux density of iron-based amorphous metal is only about 1.56 T, so the core works at about 1.35 T and needs about 1.65 ÷ 1.35 = 1.22 times the steel area for the same volts per turn, making the core larger and heavier. The ribbon is brittle and thin, so cores are wound rather than stacked and must be supported carefully. And amorphous alloys have a larger magnetostriction than grain-oriented steel, so amorphous transformers tend to be noisier, which Chapter 9 checks against the plant's noise limit.

## When it goes wrong: a second core earth

A transformer core is earthed at exactly one point, through a removable link, so that it cannot float to a high voltage by capacitive coupling to the windings. If the core is accidentally earthed at a second point, the two earths and the tank form a closed loop that links part of the core's flux, and a circulating current flows around it. That current can be tens of amperes, and where it passes through the core or a clamping structure it causes local overheating.

In TX-1's 2019 annual oil test, the dissolved gas analysis showed the gases typical of oil overheated by hot metal, such as methane and ethylene, at several times their level a year earlier, while carbon monoxide and carbon dioxide, which come from overheated paper, had hardly changed. The laboratory's report suggested a hot spot in the core or structure rather than in the windings. A follow-up sample three months later showed the gases still rising.

```figure
type: steps
title: Finding TX-1's second core earth
caption: This is an illustration. Gas trends from the annual oil tests; the laboratory interpreted them with the methods it uses for dissolved gas analysis, of which IEC 60599 is one.
- Annual oil test: hot-metal gases several times last year's levels | Suspect a thermal fault in core or structure
- Repeat sample after three months: still rising | Fault active; plan an outage
- Outage: remove the core earth link, test core-to-tank insulation | About 1 kΩ instead of hundreds of megohms
- * Lift the cover: a loose clamping bolt bridging core and frame | Second earth found
- Refit bolt with its insulating sleeve, retest, refill and process oil | Insulation restored
- Oil tests at three and twelve months | Gases stable
```

The fault had raised the no-load loss only slightly, too little to notice on the electricity bill, but over years a hot spot in a core can char the insulation between laminations and spread. The oil test found it long before that, for the price of a sample bottle and a laboratory fee, and the repair was planned for a weekend rather than forced by a failure. Chapter 10 returns to oil testing as routine maintenance, and to why one sample a year is worth little unless it is compared with the samples before it.

## Exercise: thicker laminations

A low-cost supplier offers a 2,000 kVA transformer with a core of 0.30 mm silicon steel at 1.65 T, against the 0.27 mm steel of the other offers.

1. What is the classical eddy loss of the 0.30 mm steel at 50 Hz and 1.65 T?
2. By how much does that exceed the 0.27 mm steel's, per kilogram?
3. Why is the classical difference not the whole story, and what figure should the comparison use?

**Answer.**

1. π² × (0.30 × 10⁻³)² × 50² × 1.65² ÷ (6 × 0.48 × 10⁻⁶ × 7,650) = 0.274 W/kg.
2. 0.274 − 0.222 = 0.052 W/kg, 23% more classical eddy loss.
3. The classical loss is only about a fifth of the steel's total loss, and the grade, domain refining and the core's building factor all differ between offers. The comparison should use each supplier's guaranteed no-load loss for the complete transformer, measured in the factory test (Chapter 10) and valued over the transformer's life (Chapter 8), not the sheet thickness.
