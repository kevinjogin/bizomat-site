---
book: rooftop-solar-for-factories-by-the-numbers
chapterSlug: sunlight-photons-and-the-bandgap
order: 1
title: "Sunlight, photons and the bandgap"
description: "How a silicon cell absorbs sunlight photon by photon, why its bandgap sets which light it can use and how much is lost as heat, and what limits module efficiency."
draft: false
---

A solar module is sold by its power, but what it really does is count photons. Each photon of sunlight that the silicon absorbs can free one electron to carry current, and the energy that electron delivers is set by the silicon, not by the photon. That one fact explains why a silicon module ignores part of the sun's spectrum, wastes part of the rest as heat, and can never come close to turning all the sunlight on it into electricity.

This chapter explains how light is absorbed in a semiconductor, what the bandgap does, why silicon needs a thick wafer and a textured surface, and where the limits on efficiency come from. It works the numbers for SF-90's modules and ends with a costly misreading of module efficiency in the fabricator's first set of quotes.

## Light as photons

Light carries energy in packets called photons. The energy of one photon depends only on its wavelength: E = hc ÷ λ, where h is Planck's constant and c the speed of light. In the units used for semiconductors, energy in electronvolts (eV) and wavelength in nanometres, the relation is simply E = 1,239.84 ÷ λ. Blue light at 400 nm carries 3.10 eV per photon, red light at 700 nm 1.77 eV, and near-infrared light at 1,100 nm only 1.13 eV.

Sunlight at the ground spans wavelengths from about 300 nm in the ultraviolet to beyond 2,500 nm in the infrared, with its peak in the visible. About half its power is in the infrared, beyond what the eye can see. A clear midday sun on a surface facing it delivers about 1,000 W per square metre, which is why that figure was chosen as the irradiance for standard test conditions, together with a cell temperature of 25 °C and a defined spectrum.

```figure
type: formula
title: Photon energy and the bandgap
formula: E = hc ÷ λ;   E (eV) = 1,239.84 ÷ λ (nm)
formula: A photon is absorbed across the gap only if E ≥ E_g, that is λ ≤ 1,239.84 ÷ E_g
formula: Energy a photon above the gap gives as heat ≈ E − E_g
formula: Absorption length L = 1 ÷ α;   share absorbed in a thickness w = 1 − exp(−α w)
caption: E_g is the bandgap in eV and α the absorption coefficient, the inverse of the depth over which light falls to 1/e, about 37%, of its starting intensity. For silicon E_g = 1.12 eV at 25 °C, so the longest wavelength it absorbs across the gap is about 1,107 nm.
- h | Planck's constant, 6.626 × 10⁻³⁴ J·s
- c | speed of light, 2.998 × 10⁸ m/s
- λ | wavelength, nm in the practical form
- E_g | bandgap, eV
- α | absorption coefficient, per cm
- w | thickness of absorbing material, cm
```

## Bands and the bandgap

In an isolated atom, electrons occupy sharp energy levels. In a crystal, billions of atoms sit close enough that their outer levels merge into bands of allowed energy separated by gaps where no electron state exists. In a semiconductor at low temperature, the lower band, the valence band, is full and the upper band, the conduction band, is empty. A full band cannot carry current, because every state is occupied and there is nowhere for an electron to move to; an empty band has no electrons to move. The energy separating the highest states of the valence band from the lowest states of the conduction band is the bandgap.

When a photon with at least the bandgap energy is absorbed, it lifts an electron from the valence band into the conduction band. That leaves behind a missing electron in the valence band, which behaves like a positive charge and is called a hole. The electron and the hole can both move and carry current. A photon with less energy than the gap cannot make this jump and, in a pure crystal, passes straight through. Silicon's gap is 1.12 eV at room temperature, so light longer than about 1,107 nm passes through a silicon wafer almost untouched. Panels look dark because they absorb most visible light, not because they absorb everything.

A photon with more energy than the gap does lift an electron, but the electron arrives high in the conduction band and within about a picosecond gives up its extra energy to the crystal lattice as heat, relaxing to the bottom of the band. A blue photon at 500 nm carries 2.48 eV, of which 1.36 eV, 54.8%, becomes heat almost at once. This process, called thermalisation, is the largest single loss in a silicon cell. The energy each absorbed photon can deliver to the outside circuit is capped near the bandgap whatever colour it was.

## Direct and indirect gaps: why silicon is thick

Semiconductors differ in how strongly they absorb light just above the gap. In a direct-gap material, such as gallium arsenide or cadmium telluride, the lowest conduction-band state sits directly above the highest valence-band state in momentum as well as energy. A photon, which carries almost no momentum, can lift an electron straight up, and absorption is strong: a few micrometres of material absorb nearly all the light above the gap.

Silicon has an indirect gap. Its lowest conduction-band states sit at a different crystal momentum from its highest valence-band states, so a photon alone cannot make the transition near the gap; a lattice vibration, a phonon, must take part at the same moment to supply the missing momentum. Needing two events at once makes absorption near the gap weak. Silicon absorbs blue light in under a micrometre but needs hundreds of micrometres to absorb near-infrared light just above its gap.

```figure
type: compare
title: Absorption in silicon at room temperature, rounded
cols: Photon energy | Absorption coefficient | Absorption length | Absorbed in one pass of 160 µm
rowhead: Wavelength
- 500 nm | 2.48 eV | about 11,000 per cm | 0.9 µm | 100%
- 600 nm | 2.07 eV | about 4,100 per cm | 2.4 µm | 100%
- 700 nm | 1.77 eV | about 1,900 per cm | 5.3 µm | 100%
- 800 nm | 1.55 eV | about 850 per cm | 12 µm | 100%
- 900 nm | 1.38 eV | about 310 per cm | 33 µm | 99.3%
- * 1,000 nm | 1.24 eV | about 64 per cm | 156 µm | 64.1%
- 1,100 nm | 1.13 eV | about 3.5 per cm | 2.9 mm | 5.4%
caption: Absorption coefficients rounded from published measurements for intrinsic silicon (Green, 2008); absorbed share is 1 − exp(−α w) for one pass through a 160 µm wafer, before any light trapping. Near the gap, one pass is not enough.
```

That table is why crystalline silicon cells are cut from wafers about 150 to 180 µm thick rather than the few micrometres a thin-film cell needs, and why every commercial cell uses light trapping. The front surface is etched into microscopic pyramids, so light enters at an angle and travels further through the wafer. The rear is made reflective, so light that reaches it is sent back for a second pass. Light reflected back at a steep angle from inside is trapped by total internal reflection at the front, because silicon's refractive index, about 3.5, is so high. In the ideal limit worked out by Yablonovitch, a textured wafer with a perfect rear mirror lengthens the path of weakly absorbed light by 4n², about 49 times for silicon. A 160 µm wafer then behaves like one almost 8 mm thick, and in that ideal limit even 1,100 nm light would be 94% absorbed. Real cells get well short of that, but light trapping is still why a thin wafer captures most of the near-infrared it could use.

The same texture lowers reflection at the front. A flat polished silicon surface reflects over 30% of visible light because of its high refractive index. Pyramids give reflected light a second chance to enter, and a thin anti-reflection coating of silicon nitride, the layer that gives cells their dark blue or black colour, cuts reflection further. The module's front glass reflects about 4% of the light at near-normal incidence, and many modules now use an anti-reflection coating on the glass as well.

## What the bandgap costs and buys

The bandgap is a compromise. A small gap absorbs more of the spectrum, giving more current, but every absorbed photon then delivers only a small energy, so the voltage is low and thermalisation wastes a large share of each high-energy photon. A large gap gives a high voltage per electron and little thermalisation, but lets more of the spectrum pass through unused. Somewhere between, the product of current and voltage is greatest.

A rough picture of the trade comes from treating sunlight as the radiation from a black body at the sun's surface temperature, about 5,772 K. The real spectrum at the ground has absorption bands from water vapour and other gases and shifts these shares by a few points, but the trend is the same.

```figure
type: bars
title: Where sunlight goes, by bandgap, for a 5,772 K black-body spectrum
x: Bandgap, eV
y: Share of incident power that each photon could deliver at the gap energy, %
caption: This is an illustration of the trend, not a cell efficiency. The ultimate share is E_g × (photons above the gap) ÷ (total power). For a 1.12 eV gap, 23.2% of the power is in photons below the gap and 33.0% is lost by thermalisation, leaving 43.8%. Real cells lose much more of that remainder, as the next chapter shows.
- 0.70 | 39.0
- * 1.12, silicon | 43.8
- 1.42 | 41.0
- 1.70 | 35.9
- 2.00 | 29.3
```

For silicon's gap, about 23% of the black-body power arrives in photons that cannot be absorbed and about 33% is thermalised, leaving at most about 44% that could be delivered at the gap energy. The cell then has to give up more. A cell cannot hold its electrons at the full gap energy: to deliver current, the electrons and holes must be collected at a voltage noticeably below the gap, and some recombine before they are collected. Shockley and Queisser worked out in 1961 the limit for a single-junction cell that loses nothing except what physics requires, including the light that every warm body must emit. For a gap like silicon's under sunlight, that detailed-balance limit is about 33%. A real silicon cell also suffers Auger recombination, in which an electron and hole recombine by handing their energy to a third carrier; including it brings the practical limit for silicon to about 29.4% (Richter, Hermle and Glunz, 2013). The best laboratory silicon cells have passed 26%, and commercial modules today convert about 20% to 23% of the sunlight on their whole area.

## The case: SF-90's modules

SF-90's modules are rated at 420 W at standard test conditions and measure 1,722 × 1,134 mm, an area of 1.953 m². At 1,000 W/m², 1,953 W of sunlight falls on each module, so its efficiency is 420 ÷ 1,953 = 21.5%. Across all 216 modules, 421.8 m² of glass collects 421.8 kW of sunlight at that irradiance and delivers 90.72 kW of direct current.

Where does the other 331 kW go? Part falls on the frame and the gaps between cells: each module carries 108 half-cut cells of about 182 × 91 mm, a cell area of 1.789 m², so 8.4% of the module area produces nothing. Part is reflected by the glass and cell surface. Of the light that enters the cells, the near-infrared beyond 1,107 nm passes through unused, and the blue and green photons give up more than half their energy as heat in the first picosecond. The remainder is reduced by the voltage and fill-factor losses described in Chapter 2. About three-quarters of the sunlight on the array ends up as heat in the modules, which is why their temperature matters so much in Chapter 3.

```figure
type: steps
title: From sunlight to direct current on one SF-90 module at standard test conditions
caption: This is an illustration. 1,000 W/m², cells at 25 °C. The first two steps are areas and surfaces; the third and fourth happen inside the silicon; the last is the result.
- Sunlight on the module | 1,953 W on 1.953 m²
- Lost on frame and gaps | 8.4% of the area carries no cell
- Lost at the surfaces | glass and cell reflection, a few per cent
- Lost inside the cells | below-gap light passes through; light above the gap gives up its excess as heat; recombination, voltage and resistance losses
- * Delivered as direct current | 420 W, 21.5% of the sunlight on the module
```

A useful way to see the size of the job: at 1,000 W/m², the array is struck by more than 10²¹ photons per square metre every second. Its modules deliver a current of about 13 A each at about 32 V because each absorbed photon above the gap releases one electron–hole pair and most of those pairs are collected. The current is set by how many photons are absorbed and collected; the voltage by the bandgap and by how fast the carriers recombine. Chapter 2 deals with that second part.

## Other cell materials

Silicon dominates rooftop modules because it is abundant, stable, well understood and cheap to make into wafers, and because its gap is close to the best for a single junction. Other materials appear on industrial roofs and in proposals:

- **Thin-film cadmium telluride** has a direct gap of about 1.45 eV and absorbs strongly in a few micrometres, so it can be deposited as a thin layer on glass. Its modules are less efficient than the best silicon modules and need more area for the same power.
- **Tandem cells** stack a wide-gap cell over a narrow-gap one, so each photon is absorbed by a cell whose gap is closer to its energy and thermalisation loss falls. Perovskite-on-silicon tandems have passed the silicon limit in the laboratory, but long-term outdoor stability is still being proven.
- **Heterojunction and tunnel-oxide passivated contact (TOPCon) silicon cells** are both silicon cells. They raise efficiency by reducing recombination at the contacts, which raises the voltage. They are improvements to how silicon carriers are collected, not changes to the bandgap.

## The error: buying efficiency for yield

The fabricator's first round of quotes included two options on the same roof layout: 216 modules of 420 W at 21.5% efficiency and 216 modules of 440 W, the same size, at 22.5%. The operations manager prepared the comparison. The supplier of the 420 W modules had estimated a specific yield of 1,483 kWh per kW per year (Chapter 4 checks that figure). The manager reasoned that the more efficient modules must also produce more energy per kilowatt and scaled the specific yield by the ratio of efficiencies, 1,483 × 22.53 ÷ 21.51 = 1,553 kWh per kW, then multiplied by the larger array's 95.04 kW. That gave 147.6 MWh a year for the 440 W option.

An engineer at the business's electricity retailer, asked to sense-check the comparison, pointed out that the efficiency had been counted twice. A module's power rating already includes its efficiency: a more efficient module of the same size has a higher rating, and that is the whole of the gain at standard conditions. A kilowatt of rated power produces close to the same energy a year whichever cell made it, because yield per kilowatt depends on the sun, the orientation, the temperature and the losses, not on how many square metres the kilowatt occupies. The 440 W option would produce about 95.04 × 1,483 = 140.9 MWh a year, 4.8% more than the 420 W option because it has 4.8% more kilowatts on the same roof, not 10%.

Real differences in yield per kilowatt between modules do exist, but they come from the temperature coefficient, the low-light behaviour, the response to light from low angles and the degradation rate, which datasheets give separately. Chapters 3 and 9 show how to use them. The corrected comparison then turned on the price per installed kilowatt and on whether the roof could take more modules, not on efficiency for its own sake.

```figure
type: checklist
title: Reading module efficiency correctly
caption: The checks the business now applies to every module comparison. This is an illustration.
- x Efficiency sets how much power fits on a given area; it is already in the power rating
- x Compare energy per kilowatt using temperature coefficient, low-light performance and degradation, not efficiency
- x Compare cost per installed kilowatt and per kilowatt-hour over the life, not cost per module
- x Use efficiency when roof area is the limit; otherwise the cheapest reliable kilowatt wins
- ? Ask for the independent test reports behind the datasheet's temperature and low-light figures
```

## Exercise: a thin-film alternative

A supplier offers thin-film cadmium telluride modules for the workshop roof. Each module measures 1,200 × 600 mm and is rated at 117 W at standard test conditions. Take the bandgap as 1.45 eV.

1. What is the longest wavelength these cells can absorb across the gap?
2. What is the module efficiency?
3. How many modules, and how much module area, give at least SF-90's 90.72 kW, and how does that area compare with SF-90's 421.8 m²?
4. Would the thin-film array produce noticeably more or less energy per kilowatt simply because its efficiency is lower?

### Worked answer

1. λ = 1,239.84 ÷ 1.45 = 855 nm. Light between 855 nm and silicon's 1,107 nm, which a silicon cell can use, passes through these cells.
2. The module area is 1.2 × 0.6 = 0.72 m², so at 1,000 W/m² it receives 720 W. Efficiency = 117 ÷ 720 = 16.25%.
3. 90,720 ÷ 117 = 775.4, so 776 modules are needed, with 776 × 0.72 = 558.7 m² of module area. That is 1.32 times SF-90's 421.8 m², about 137 m² more, before allowing extra space for rails and access paths. On the workshop's 1,296 m² north face that would fit, but on a crowded roof it might not.
4. No. Lower efficiency means more area per kilowatt, not less energy per kilowatt. Energy per kilowatt would differ only through the temperature coefficient, the low-light response, the spectral response to the real sunlight at Shepparton and the degradation rate. Cadmium telluride typically has a smaller temperature coefficient than silicon, which helps on a hot roof, but that must be checked on the datasheet and independent test reports, not inferred from efficiency.
