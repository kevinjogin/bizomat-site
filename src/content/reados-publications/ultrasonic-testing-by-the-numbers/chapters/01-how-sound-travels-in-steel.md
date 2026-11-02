---
book: ultrasonic-testing-by-the-numbers
chapterSlug: how-sound-travels-in-steel
order: 1
title: "How sound travels in steel"
description: "Why sound speed in a metal follows from its stiffness and density, longitudinal and shear waves, wavelength, time of flight, and the velocity settings every ultrasonic reading depends on."
draft: false
---

Every ultrasonic measurement is a time measurement converted into a distance by a sound speed. The instrument times an echo to a few nanoseconds; the speed it multiplies by is a number someone typed in or calibrated. When that number is right, a thickness gauge reads a 7 mm wall to a few hundredths of a millimetre. When it is wrong, every reading on the survey is wrong by the same proportion, and nothing on the screen looks unusual.

This chapter explains where sound speed comes from, starting from atoms connected by springs, why a solid carries two kinds of wave at two different speeds, how wavelength follows from speed and frequency, and how the mill's technician turns a time of flight into a wall thickness. It finishes with a velocity setting left over from another job, and how it was caught before a whole slack season's survey was spoilt.

## Atoms, springs and a travelling disturbance

A metal crystal is a regular array of atoms, each held near its place by the forces from its neighbours. Push one atom slightly towards the next and the force between them rises; let go and they spring apart. For small movements, the force is very nearly proportional to the change in spacing, exactly as for a spring. A line of atoms is therefore a line of masses joined by springs, and a disturbance at one end does not arrive at the other instantly: each atom must be accelerated by the spring in front of it before it can push the next.

The speed at which the disturbance travels depends on two things. Stiffer springs pass the push on faster, because a given displacement produces a larger force and a larger acceleration. Heavier atoms pass it on more slowly, because the same force produces a smaller acceleration. For long waves, those many atoms long, the speed is proportional to the atomic spacing multiplied by the square root of spring stiffness divided by atomic mass. Scaled up from one chain of atoms to a block of metal, spring stiffness per spacing becomes an elastic modulus, and mass per atom becomes density. The result is the most important relation in ultrasonic testing: the speed of sound is the square root of a modulus divided by the density.

```figure
type: formula
title: Sound speed from stiffness and density
formula: c = √(M ÷ ρ)
formula: Longitudinal: c_L = √( E (1 − ν) ÷ [ρ (1 + ν)(1 − 2ν)] )
formula: Shear: c_T = √( E ÷ [2 ρ (1 + ν)] ) = √(G ÷ ρ)
caption: M is the modulus that resists the particular kind of deformation the wave imposes. E is Young's modulus, ν Poisson's ratio, G the shear modulus and ρ the density, in SI units, giving c in m/s.
- c_L | longitudinal (compression) wave speed, m/s
- c_T | transverse (shear) wave speed, m/s
- E, G | Young's and shear modulus, Pa
- ρ | density, kg/m³
```

### Long waves do not notice the atoms

At very short wavelengths, a few atomic spacings, the chain of atoms behaves differently: speed starts to depend on wavelength, and waves of different wavelength travel at different speeds. This is dispersion, and it matters in the physics of heat in solids. It does not matter in ultrasonic testing. Steel's atoms are about 0.25 nanometres apart; a 5 MHz longitudinal wave in steel is 1.18 mm long, nearly five million atomic spacings. At that scale the metal is a smooth elastic continuum, all frequencies used in testing travel at the same speed, and a pulse keeps its shape as it travels. Dispersion returns in ultrasonic testing only in thin plates and rods, where the part's own dimensions are comparable with the wavelength and guided waves form; those are outside this book.

## Two waves in one solid

A gas or a liquid resists being compressed but not being sheared, so it carries only one kind of sound wave, in which the particles move back and forth along the direction the wave travels. A solid resists both. It carries longitudinal waves, also called compression waves, in which particle motion is along the direction of travel, and transverse waves, or shear waves, in which particle motion is across it. In the chain-of-atoms picture these are the two ways of disturbing a neighbour: pushing it along the line, or pulling it sideways.

The two waves resist different deformations, so they travel at different speeds. A longitudinal wave in a large block compresses the metal without letting it expand sideways, because the surrounding metal holds it in, and the modulus that resists that confined compression is larger than Young's modulus. A shear wave changes the metal's shape without changing its volume, and the modulus that resists that is the shear modulus, smaller than Young's. So in every metal the longitudinal wave is the faster, and for steel it is a little under twice as fast.

```figure
type: compare
title: Sound speeds in the mill's carbon steel, from its elastic constants
cols: Modulus used | Speed | Wavelength at 2 MHz | Wavelength at 5 MHz
rowhead: Wave
- Longitudinal, in a large block | E(1 − ν) ÷ [(1 + ν)(1 − 2ν)] = 275 GPa | 5,920 m/s | 2.96 mm | 1.18 mm
- Shear | G = E ÷ 2(1 + ν) = 81.4 GPa | 3,220 m/s | 1.61 mm | 0.64 mm
- Extensional, in a thin bar | E = 210 GPa | 5,170 m/s | not used in testing | not used in testing
- Longitudinal, in water at 20 °C | adiabatic bulk modulus 2,205 MPa | 1,486 m/s | 0.74 mm | 0.30 mm
caption: This is an illustration. Steel: E = 210 GPa, ν = 0.29, ρ = 7,850 kg/m³, typical values. Water from the liquid compression tool with ρ = 998.2 kg/m³ and an isothermal bulk modulus of 2,190 MPa. Tabulated speeds for carbon steels range from about 5,890 to 5,960 m/s longitudinal and 3,200 to 3,260 m/s shear.
```

The thin-bar speed in the table is there to show a common source of error. The speed of a compression wave in a bar much thinner than the wavelength, √(E ÷ ρ), is the one met in vibration and water hammer calculations, and it is 13% lower than the longitudinal speed in a block. Ultrasonic pulses in plates, pipe walls and shafts are far shorter than the parts are wide, so they travel at the block speed. Using √(E ÷ ρ) to set a thickness gauge would make every reading 13% thin.

The ratio of shear to longitudinal speed depends only on Poisson's ratio. For ν = 0.29 it is 0.544, and the shear wave carries the angle-beam weld testing of Chapters 7 and 8 precisely because it is slower: a slower wave refracts to a steeper angle and has a shorter wavelength for the same frequency, which means better resolution.

### Speed in the couplant and in water

The [liquid adiabatic compression tool](/tools/liquid-adiabatic-compression/) was built to work out the temperature rise and wave speed when a hydraulic oil is compressed quickly. Its last output, the speed of a pressure wave in the free liquid, is the longitudinal sound speed of the liquid, calculated as √(K_s ÷ ρ) from the adiabatic bulk modulus. Entering water's density of 998.2 kg/m³, specific heat of 4.182 kJ/(kg·K), expansion coefficient of 207 × 10⁻⁶ /K and isothermal bulk modulus of 2,190 MPa at 20 °C gives an adiabatic modulus of 2,205 MPa and a wave speed of 1,486 m/s, within a quarter of a per cent of the tabulated 1,482 m/s. The mill uses water as the couplant for immersion checks of small parts and needs its speed to set the water path. The tool's temperature rise outputs are not used; the adiabatic modulus is the right one because sound compresses the liquid too quickly for heat to flow.

## From time of flight to thickness

A thickness gauge sends a pulse into the wall, waits for the echo from the far surface and measures the round-trip time. The pulse crosses the wall twice, so the thickness is half the product of speed and time.

```figure
type: formula
title: Thickness from time of flight
formula: t = c × Δt ÷ 2
formula: Timing resolution: δt = c × δ(Δt) ÷ 2
caption: Δt is the round-trip time between the start reference and the back-wall echo, or between two successive back-wall echoes. With c = 5,920 m/s, 1 ns of timing corresponds to 0.003 mm of steel.
- t | wall thickness, m
- c | sound speed in the wall, m/s
- Δt | round-trip time of flight, s
```

For the juice line's nominal 7.11 mm wall the round trip takes 2.402 µs. A reading of 5.45 mm, which Chapter 5 meets at the line's worst location, corresponds to 1.841 µs. Modern gauges resolve times to a nanosecond or better, so the time measurement is rarely the limit on accuracy. The limits are the velocity setting, the zero offset of the probe and the shape and quality of the echo, which Chapters 2 to 4 deal with.

### Speed is a proportional error

Because thickness is speed multiplied by time, a velocity error of 1% makes every reading 1% wrong. On a 7 mm wall that is 0.07 mm, about half a slack season's corrosion at the juice line's worst location. A velocity error is invisible in the readings themselves: they are smooth, repeatable and plausible. The only defence is to set the velocity on a reference of known thickness in the same material, or to check it there before and after every survey, which is the core of Chapter 4.

```figure
type: bars
title: Reading on the juice line's 5.45 mm wall with the wrong velocity setting
unit: mm
max: 6.4
caption: This is an illustration. Each bar is 5.45 mm × (velocity set ÷ 5,920 m/s). The thin-bar error and the aluminium setting are the two mistakes this chapter describes.
- Thin-bar speed √(E ÷ ρ), 5,170 m/s | 4.76
- Stainless steel setting, 5,740 m/s | 5.28
- * Carbon steel, 5,920 m/s | 5.45
- Aluminium setting, 6,320 m/s | 5.82
```

## What changes the sound speed

Sound speed is a material property, but it is not fixed for a given grade of steel. Four things change it enough to matter.

**Composition and alloy.** Carbon and low-alloy steels fall within about 1% of each other. Austenitic stainless steels are about 3 to 5% slower, cast irons much slower and more variable, and aluminium alloys faster. A gauge set for one material reads another wrongly by the ratio of their speeds.

**Temperature.** Elastic moduli fall as a metal warms, so sound slows. For carbon steel the fall is about 1% for every 55 K, a figure Chapter 4 uses to correct readings taken on the flash vessel while it is hot. The density also falls slightly, but the modulus effect dominates.

**Microstructure and texture.** Rolling and forging can align the crystals in a plate or forging, and since the stiffness of an iron crystal differs with direction, the speed can differ by a per cent or more between directions in a heavily textured product. Heat treatment changes speed a little through its effect on the modulus.

**Stress.** Sound speed changes slightly with stress, the acoustoelastic effect. It is small, a small fraction of a per cent even at the stress in a tightened bolt, too small to matter in thickness gauging, but it must be allowed for when ultrasonic time of flight is used to measure the stretch of a tightened bolt, because the stress and the elongation both lengthen the time.

### The square-root rule

Because speed goes as the square root of modulus over density, a change in modulus changes the speed by half as much. A 2% fall in modulus with temperature slows sound by 1%. This square-root relation reappears throughout the book: a probe's near field, beam spread and the frequency at which a part becomes difficult to test all depend on speed through the wavelength.

## Wavelength and frequency

The wavelength is the distance the wave travels in one cycle: speed divided by frequency. It sets the scale of everything a probe can do. A reflector much smaller than the wavelength scatters little sound and is hard to find. Two reflectors closer together along the beam than about one or two wavelengths merge into one echo. A probe's beam spreads at an angle set by the ratio of wavelength to probe diameter. And the scattering of sound by the grains of a metal rises steeply as the wavelength approaches the grain size, which Chapter 9 uses to choose the frequency for the long shaft path.

```figure
type: compare
title: Wavelengths in the mill's steel at the frequencies it uses
cols: Longitudinal wavelength | Shear wavelength | Used for
rowhead: Frequency
- 1 MHz | 5.92 mm | 3.22 mm | coarse-grained castings, not used at the mill
- 2 MHz | 2.96 mm | 1.61 mm | long-path shaft inspection, Chapter 9
- 4 MHz | 1.48 mm | 0.81 mm | angle-beam weld testing, Chapters 7 and 8
- 5 MHz | 1.18 mm | 0.64 mm | thickness gauging, Chapter 4
- 10 MHz | 0.59 mm | 0.32 mm | thin sections and fine resolution
caption: This is an illustration. λ = c ÷ f with c_L = 5,920 m/s and c_T = 3,220 m/s.
```

A useful rule of thumb follows from the table: the smallest reflector a test can be expected to find reliably is of the order of half a wavelength, and a test intended to find small flaws needs a high frequency. The opposite pressure comes from attenuation, which rises with frequency, so long paths and coarse-grained metals need low frequencies. Choosing a frequency is choosing where to stand between those two pressures, and the mill's four jobs stand in four different places.

## The mistake: a velocity carried over from another job

At the start of the slack season, the inspection contractor's technician arrived at the mill with a thickness gauge last used on an aluminium boat hull at a Mackay marina. The gauge's velocity was still set to 6,320 m/s, aluminium's longitudinal speed. The technician checked the probe zero on the gauge's built-in disc, which confirms only that the probe and cable are working, and began the juice line survey.

The first three condition monitoring locations read 7.42, 7.31 and 7.56 mm on a pipe whose nominal wall is 7.11 mm. New pipe can be thicker than nominal, since the standard tolerance on wall thickness allows some overthickness, so the readings were not obviously wrong. The reliability engineer noticed something else: the same three locations had read 6.97, 6.85 and 7.08 mm in the previous survey, and the line had not been replaced. Walls do not grow.

```figure
type: steps
title: Finding the carried-over velocity
caption: This is an illustration. The ratio 6,320 ÷ 5,920 = 1.068 explains all three discrepancies to within reading scatter.
- Readings 7.42, 7.31 and 7.56 mm | 0.46 mm thicker on average than last season at the same locations
- Ratio of new to old readings | 1.065, 1.067 and 1.068
- Velocity in the gauge | 6,320 m/s, aluminium, from the previous job
- Gauge checked on the mill's carbon steel step block | 10.00 mm step read 10.68 mm
- Velocity reset to 5,920 m/s and verified | 10.00 mm step read 10.00 mm; locations re-measured
- Procedure changed | velocity verified on a carbon steel step before every survey, recorded on the survey sheet
```

The ratio of the new readings to the old was the same at every location, about 1.067. A real change in the wall would not do that; a proportional error does. Dividing 6,320 by 5,920 gives 1.068, and the gauge, checked on the mill's carbon steel step block, read the 10.00 mm step as 10.68 mm. With the velocity reset and verified on the block, the three locations read 6.95, 6.85 and 7.08 mm, within 0.02 mm of the previous season's figures.

Had the survey been completed with the wrong setting, the line would have appeared to have gained 0.4 to 0.5 mm of wall at every location, the calculated corrosion rates would have been negative and meaningless, and the next survey, done correctly, would have shown an apparent loss of half a millimetre in one season, enough to trigger an unnecessary replacement. The mill's survey procedure now requires the velocity to be verified on a reference block of the same material before each survey and after any change of probe or gauge, with the block reading written on the survey sheet.

## The velocity question in every chapter

Every later chapter depends on sound speed in a different way. Chapter 2 needs the speeds of steel and couplant to work out how much sound crosses an interface. Chapter 3 needs the wavelength to work out the probe's near field and beam spread. Chapter 4 calibrates the velocity and zero together and corrects them for temperature. Chapter 7 uses the ratio of wedge speed to shear speed to set the refracted angle of an angle-beam probe. Chapter 9 uses the speed to convert a sound path of 2,550 mm into an echo arriving 861.5 µs after the pulse. In each case the question is the same: which speed, in which material, at what temperature, and how was it verified?

```figure
type: checklist
title: Before trusting a velocity setting
caption: The open item is this chapter's mistake. A zero check on a gauge's built-in disc does not check velocity.
- x Wave mode known | longitudinal for thickness and straight beam, shear for angle beam
- x Material known | carbon steel, stainless, cast iron or aluminium differ by up to 25%
- x Block speed, not thin-bar speed | √(E ÷ ρ) is 13% low for ultrasonic pulses
- x Temperature known | about 1% slower for every 55 K above the calibration temperature
- ? Velocity verified on a reference of the same material | the step left undone at the start of the season
```

## Exercise: sound speed in the roll shaft

The No. 3 mill top roll shaft is forged from a carbon–manganese steel with a Young's modulus of 205 GPa, a Poisson's ratio of 0.29 and a density of 7,850 kg/m³. Calculate the longitudinal and shear wave speeds, the longitudinal wavelength at 2 MHz, and the round-trip times of flight from the end face to the two journal fillets, 650 mm and 2,550 mm away. Then decide: if the technician had used the mill's default 5,920 m/s for the shaft, how far from the true position would an echo from the far fillet be plotted?

### Answer

**Given:** E = 205 GPa, ν = 0.29, ρ = 7,850 kg/m³, f = 2 MHz, paths 650 mm and 2,550 mm.

**Assumptions:** the shaft is large compared with the wavelength, so the block speed applies; properties are uniform along the shaft; room temperature.

**Method:** use the longitudinal and shear formulas, then λ = c ÷ f and Δt = 2L ÷ c.

**Longitudinal speed:** the confined modulus is 205 × (1 − 0.29) ÷ [(1.29)(0.42)] = 205 × 0.71 ÷ 0.5418 = 268.6 GPa. c_L = √(268.6 × 10⁹ ÷ 7,850) = 5,850 m/s.

**Shear speed:** G = 205 ÷ (2 × 1.29) = 79.5 GPa. c_T = √(79.5 × 10⁹ ÷ 7,850) = 3,182 m/s, so the ratio c_T ÷ c_L is 0.544, as for any material with ν = 0.29.

**Wavelength at 2 MHz:** λ = 5,850 ÷ 2 × 10⁶ = 2.93 mm.

**Times of flight:** to the near fillet, 2 × 0.650 ÷ 5,850 = 222.2 µs; to the far fillet, 2 × 2.550 ÷ 5,850 = 871.8 µs.

**Effect of the default velocity:** the instrument converts time to distance with the speed it is given. An echo at 871.8 µs would be plotted at 5,920 × 871.8 × 10⁻⁶ ÷ 2 = 2.580 m, 30 mm beyond the fillet. On a shaft where the near fillet, the roll shell's shrink-fit edge and the far fillet are all possible crack sites, 30 mm is enough to attribute an echo to the wrong feature.

**Interpretation and verification:** the 1.2% difference between the shaft's speed and the default is within the range of carbon steels, and it is the reason Chapter 9 calibrates the shaft's speed on the shaft itself, using the echo from its known far end. As a check on the arithmetic, the speeds scale as √E: √(205 ÷ 210) = 0.988, and 5,920 × 0.988 = 5,850 m/s.
