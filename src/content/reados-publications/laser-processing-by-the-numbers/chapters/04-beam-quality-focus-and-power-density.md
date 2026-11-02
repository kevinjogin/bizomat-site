---
book: laser-processing-by-the-numbers
chapterSlug: beam-quality-focus-and-power-density
order: 4
title: "Beam quality, focus and power density"
description: "How beam quality, beam diameter and focal length set the focused spot, depth of focus and power density, how to choose a lens, and how to find and correct a focus offset."
draft: false
---

Power alone does not cut metal; power concentrated into a small spot does. A 4 kW beam spread over a square centimetre is a gentle heater. The same beam focused to a 0.2 mm spot delivers more than ten million watts per square centimetre, enough to melt and blow out steel faster than heat can conduct away. How small the spot can be, and how far it stays small, depends on the quality of the beam and the optics that focus it, and the two pull against each other: a smaller spot comes with a shorter depth of focus.

This chapter sets out the relations for a focused laser beam, works them for the LC-4 with the KEVOS® laser cutting plan tool, compares lenses and the old CO₂ machine, and ends with a focus error that cost the cell a morning.

## How a laser beam focuses

An ideal laser beam has a Gaussian profile: its intensity falls smoothly from the centre outwards, and its diameter is defined where the intensity has fallen to 1 ÷ e², about 13.5%, of the peak. Such a beam has a narrowest point, the waist, and spreads with distance on either side of it. The product of the waist radius and the far-field divergence half-angle is fixed for a given beam and cannot be improved by lenses: a lens that makes the waist smaller makes the divergence larger in proportion.

Real industrial beams are not ideal. Their quality is described by the beam quality factor M², the number of times the real beam's waist-divergence product exceeds that of an ideal Gaussian beam of the same wavelength. Laser makers often quote instead the beam parameter product, BPP, the waist radius times the divergence half-angle, in millimetre-milliradians. The two are related by M² = π BPP ÷ λ.

```figure
type: formula
title: Focusing a laser beam
formula: M² = π BPP ÷ λ
formula: d₀ = 4 M² λ f ÷ (π D)
formula: z_R = π d₀² ÷ (4 M² λ);   d(z) = d₀ √(1 + (z ÷ z_R)²)
formula: Depth of focus for a spot growth g: DOF = 2 z_R √((1 + g)² − 1)
formula: Power density H = 4P ÷ (π d₀²)
caption: D is the raw beam diameter at the focusing lens, f its focal length and d₀ the focused spot diameter, all at the 1/e² points. z_R is the Rayleigh length, over which the spot area doubles. The depth of focus is the length over which the spot grows by no more than the share g.
- BPP | beam parameter product, mm·mrad
- λ | wavelength, mm in these formulas
- f, D | focal length and beam diameter at the lens, mm
- d₀ | focused spot diameter, mm
- z_R | Rayleigh length, mm
- P | power at the work, W
```

The ratio f ÷ D is the f-number of the focusing. For a given beam, the spot diameter is proportional to the f-number and the Rayleigh length to its square. Halving the spot size divides the depth of focus by four.

## The LC-4's beam

The LC-4's source delivers its light through a fibre with a 100 µm core and a beam parameter product of 4 mm·mrad. Its beam quality factor is therefore M² = π × 4 ÷ 1.07 = 11.74: the beam is nearly twelve times worse than an ideal Gaussian beam, which is normal and intended for a multikilowatt cutting laser, because a moderately larger beam parameter product gives a cut with a wider, more forgiving kerf.

The light leaves the fibre with a divergence half-angle of BPP ÷ core radius = 4 ÷ 0.05 = 80 mrad. The 100 mm collimating lens turns it into a parallel beam 2 × 0.080 × 100 = 16 mm in diameter. The 200 mm focusing lens then focuses that beam to d₀ = 4 × 11.74 × 0.00107 × 200 ÷ (π × 16) = 0.200 mm. The same answer comes from treating the optics as an imaging system: the head images the 100 µm fibre core onto the sheet with a magnification of 200 ÷ 100 = 2, giving a 200 µm spot. The two views agree because the fibre core and its divergence define the beam parameter product.

The laser cutting plan tool calculates all of this from the beam and optics inputs. For the cabinet doors in 1.5 mm stainless steel:

```figure
type: steps
title: The cabinet door in the laser cutting plan tool
caption: This is an illustration. Wavelength 1.07 µm, M² 11.74, beam 16 mm at a 200 mm lens, 4,000 W, least power density 1,000,000 W/cm², spot growth allowed 5%, sheet 1.5 mm, surface variation the head does not follow 0.3 mm, chart speed 24 m/min at 4,000 W and 1.5 mm, cut length 3,400 mm, 12 pierces of 0.3 s, machine rate A$180 an hour.
- Focused spot diameter | 0.200 mm
- f-number | 12.5
- Power density at the work | 12,741,663 W/cm², about 12.7 times the least the cut needs
- Depth of focus at 5% spot growth | 1.60 mm, against 0.3 mm of surface variation: BEAM SUITS THE CUT
- Cutting speed | 24 m/min, the chart value
- * Time and cost per door | 8.5 s cutting + 3.6 s piercing = 12.1 s; A$0.61 per door at A$180 an hour
```

The [laser cutting plan tool](/tools/laser-cutting-plan/) takes the least power density the process needs as an input, because that number depends on the material and process, not on the optics. The cell uses 1,000,000 W/cm² as its threshold for cutting metals, a round figure of the order quoted for fusion cutting, and checks that the beam exceeds it with a margin. The 0.3 mm surface variation is what remains after the machine's capacitive height sensor has followed the sheet: the sensor keeps the nozzle at a set height above the surface, and only its tracking error and the sheet's local ripples reach the beam.

The tool's power density uses the power at the work you enter and the 1/e² spot diameter, so it is an average over the spot. The peak at the centre of an ideal Gaussian beam is twice the average; a multimode beam like the LC-4's has a flatter top, so its peak is closer to the average.

## Choosing a lens

The LC-4's head can take focusing lenses of 150, 200 and 250 mm. The choice is a trade between a small, intense spot and a long focus.

```figure
type: compare
title: The LC-4 with three focusing lenses, 16 mm beam, 4 kW
cols: Spot diameter, mm | Power density, W/cm² | Rayleigh length, mm | Depth of focus at 5%, mm
rowhead: Focal length
- 150 mm | 0.150 | 22,650,000 | 1.41 | 0.90
- * 200 mm | 0.200 | 12,740,000 | 2.50 | 1.60
- 250 mm | 0.250 | 8,150,000 | 3.90 | 2.50
caption: This is an illustration, calculated with the laser cutting plan tool's relations. The spot scales with focal length, the power density with its inverse square, and the Rayleigh length and depth of focus with its square.
```

A short focal length suits thin sheet. The intense spot and narrow kerf give high speed and fine detail, and in 1 mm sheet a short focus is no handicap because the whole thickness lies within it. For thick plate, the beam must stay narrow through the whole thickness, and the kerf must be wide enough for the assist gas to carry the melt out of the bottom; a longer focal length gives both. The LC-4 runs the 200 mm lens for everything from 1.5 to 6 mm as a compromise, because changing lenses takes time and every change is a chance to contaminate the optics. Many modern heads instead use motorised zoom optics that change the effective focal length and spot size under program control for each thickness.

### Depth of focus against thickness

The 1.60 mm depth of focus is shorter than the 6 mm brackets the LC-4 cuts. That is normal. The depth of focus as defined here is the length over which the spot grows by no more than 5%, a strict criterion. Over 6 mm, the spot is larger at the top and bottom than at the waist: at 3 mm from the waist, d = 0.200 × √(1 + (3 ÷ 2.50)²) = 0.312 mm. The cut tolerates that because the energy is still concentrated enough, and the operator chooses where in the thickness to put the waist.

For fusion cutting with nitrogen, where the melt must be pushed out by gas pressure alone, the waist is usually set low in the sheet, often near the bottom surface, so that the kerf is wide enough at the top for the gas to enter and the beam is narrowest where the melt leaves. For oxygen cutting of mild steel, where the burning iron supplies much of the heat, the waist is usually set at or just above the top surface. The cell's parameter tables record the focus position for every material and thickness, measured from the top surface, negative into the sheet.

## The CO₂ machine for comparison

The LC-2 produces a near-ideal beam, M² about 1.2, but at ten times the wavelength. Its beam parameter product is 1.2 × 10.6 ÷ π = 4.05 mm·mrad, almost the same as the LC-4's 4 mm·mrad. With an 18 mm beam on a 127 mm lens it focuses to 0.114 mm, with a Rayleigh length of 0.81 mm and a depth of focus at 5% growth of 0.52 mm.

The comparison shows something that surprises people who know CO₂ beams as "better" beams. The CO₂ laser's low M² is offset by its long wavelength, so the two machines' beam parameter products, and therefore their focusing ability, are similar. What differs is the optics: the CO₂ machine's shorter focal length and larger beam give it a smaller spot but a much shorter focus. Fibre lasers can be built with very low beam parameter products for fine cutting and welding, and the W-2 welding laser is one.

## Measuring the beam itself

The beam quality factor and spot size in this chapter are the maker's figures, and a planner normally takes them on trust. They can be measured. ISO 11146 sets out test methods for laser beam widths, divergence angles and beam propagation ratios: a beam profiling instrument records the beam's width at a series of positions through the focus, the caustic, and a fitted curve gives the waist diameter, the Rayleigh length and M². High-power beams need instruments built to take or sample several kilowatts, so a cell like this one does not own one. The laser maker's service engineer measures the caustic at the annual service, and the cell keeps the results with its focus tests. A beam parameter product that has grown since installation points to a damaged fibre end or contaminated optics, and it explains a slow loss of cut quality that power and focus checks cannot.

## The mistake: a focus offset after a crash

On a Tuesday night shift, a tipped-up part on a 6 mm bracket nest caught the LC-4's nozzle. The crash protection released the head as designed, the operator re-seated it, ran the nozzle centring check and carried on. The next morning, the stainless door job showed heavier dross than usual and a slightly wider kerf, and the day operator, remembering Chapter 1's dirty window, measured the power: 3,860 W, unchanged.

The fitter suspected focus and ran the cell's focus test: a series of short line burns on a scrap sheet at programmed focus positions from −2.0 to +2.0 mm in 0.5 mm steps, read with a magnifier. The narrowest burn should appear at the 0 setting. It appeared between +1.0 and +1.5 mm, and a finer series put it at +1.2 mm: the re-seated head was sitting with its true focus 1.2 mm away from where the control believed it to be.

```figure
type: bars
title: Spot growth and loss of power density with a focus offset, LC-4 with the 200 mm lens
x: Focus offset, mm
y: Power density as a share of the value at focus, %
caption: This is an illustration. d(z) = 0.200 × √(1 + (z ÷ 2.50)²). At 1.2 mm the spot is 0.222 mm and the power density 81.3% of the value at focus; at 2.0 mm, 61.0%.
- 0 | 100.0
- 0.5 | 96.2
- 1.0 | 86.2
- * 1.2 | 81.3
- 2.0 | 61.0
```

A focus 1.2 mm off moved the waist out of the position the parameter table had chosen for the doors, enlarged the spot at the planned position by 11%, and cut the power density there by 18.7%. For a nitrogen cut with its focus deliberately placed low in the sheet, the offset also changed the shape of the kerf, which is why the dross grew. The fix was a focus recalibration to the test result, a second test to confirm, and a note in the machine's log.

```figure
type: checklist
title: After any head crash or optics change
caption: The cell's rule since the crash. This is an illustration.
- x Nozzle centring check
- x Focus test: line burns from −2.0 to +2.0 mm in 0.5 mm steps, then 0.1 mm steps around the narrowest
- x Power at the work with the power puck
- x Test cut on the most demanding regular job, here the 1.5 mm stainless door
- x Results and any corrections written in the machine log before production restarts
```

The power check had been right but irrelevant. Power and focus are separate checks: the power puck says how many watts arrive; only a focus test says where they are concentrated.

### Thermal focus shift

A smaller, slower version of the same error happens with contaminated optics. A protective window or lens that absorbs a few per cent of a multikilowatt beam heats unevenly, hottest in the middle, and becomes a weak lens itself. The focus then moves during the first minutes of cutting, often towards the head, and moves back when the beam is off. The symptom is a cut that is good at the start of a sheet and worse after a few minutes of continuous cutting. It is one more reason the cell inspects the protective window at every shift start, and why its power puck and focus tests are run after the head has been cutting for several minutes rather than from cold.

## Exercise: the welding head

The W-2 welding cell's 2 kW fibre laser has a beam parameter product of 2 mm·mrad, delivered through a 50 µm fibre. Its 150 mm collimator gives a 24 mm beam, and its focusing lens has a 300 mm focal length. Find the beam quality factor, the focused spot diameter, the power density at the work for 2,000 W, and the depth of focus for 5% spot growth. The robot's seam-tracking holds the focus within ±0.2 mm of the programmed height, a total variation of 0.4 mm. Is the depth of focus enough? Check the result with the laser cutting plan tool.

### Answer

M² = π × 2 ÷ 1.07 = 5.87. The spot diameter is d₀ = 4 × 5.87 × 0.00107 × 300 ÷ (π × 24) = 0.100 mm, which is also the 50 µm fibre core imaged at a magnification of 300 ÷ 150 = 2.

The power density is H = 4 × 2,000 ÷ (π × 0.0100² cm²) = 25,500,000 W/cm² (the tool gives 25,483,325 W/cm²), twice the LC-4's at half the power, because the spot area is a quarter.

The Rayleigh length is z_R = π × 0.100² ÷ (4 × 5.87 × 0.00107) = 1.25 mm, and the depth of focus for 5% spot growth is 2 × 1.25 × √(1.05² − 1) = 0.80 mm. That exceeds the 0.4 mm total height variation, so the tool reports BEAM SUITS THE CUT. The margin is a factor of two, smaller than the LC-4's: the welding head's smaller spot buys power density at the cost of depth of focus, and the robot's seam tracking must be maintained to keep it.
