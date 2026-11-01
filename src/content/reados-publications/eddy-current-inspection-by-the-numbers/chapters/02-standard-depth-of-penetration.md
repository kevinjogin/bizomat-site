---
book: eddy-current-inspection-by-the-numbers
chapterSlug: standard-depth-of-penetration-and-frequency
order: 2
title: "Standard depth of penetration and choosing a frequency"
description: "How deep eddy currents reach in aluminium, copper alloys and steel, the three-depth thickness rule for conductivity tests, the stacking test, and choosing a frequency for each job."
draft: false
---

Eddy currents crowd towards the surface nearest the coil. Their density falls exponentially with depth, at a rate set by the frequency, the conductivity and the magnetic permeability of the metal. The depth at which it has fallen to 37% of its surface value, the standard depth of penetration, is the single most useful number in eddy-current testing. It decides how thick a part must be for a conductivity reading to mean anything, how shallow a crack can be found, whether a test can see through a tube wall and why steel behaves so differently from aluminium.

This chapter calculates the standard depth for the pump maker's three metals, sets out the rule that links it to part thickness, and shows a conductivity test that failed a good part because the part was thinner than the test reached.

## How deep the currents go

For a plane conductor in a uniform alternating field, the eddy-current density falls exponentially with depth and lags further behind the surface current in phase the deeper it goes. Both are governed by the standard depth of penetration, δ, the same quantity electrical engineers call the skin depth.

```figure
type: formula
title: Standard depth of penetration, current density and phase lag
formula: δ = 1 ÷ √(π f μ₀ μᵣ σ) = 503.3 √(ρ ÷ (μᵣ f)) metres
formula: J(x) = J₀ e^(−x ÷ δ)
formula: Phase lag at depth x = x ÷ δ radians
caption: ρ is the electrical resistivity in Ω·m (the inverse of the conductivity σ), μᵣ the relative magnetic permeability and f the frequency in hertz. The constant 503.3 is 1 ÷ √(π μ₀). Real probes are smaller than the plane-field idealisation, which makes their currents penetrate somewhat less deeply; δ remains the standard reference figure.
- δ | standard depth of penetration, m
- J(x), J₀ | eddy-current density at depth x and at the surface
- μ₀ | permeability of free space, 4π × 10⁻⁷ H/m
```

At one standard depth, the current density is e⁻¹ = 36.8% of its surface value and lags it by one radian, 57.3°. At two depths it is 13.5% and lags by 114.6°; at three, 5.0% and 171.9°. Practically all the currents flow within three standard depths of the surface, and a part thicker than that looks, to the coil, as if it were infinitely thick.

## The pump maker's metals

The housings are 6061-T6 aluminium, with a conductivity of about 43 %IACS, which Chapter 3 explains: 24.9 MS/m, a resistivity of 4.01 × 10⁻⁸ Ω·m. The cooler tubes are 90/10 copper-nickel, whose resistivity is taken here as 1.9 × 10⁻⁷ Ω·m. The shafts are hardened 42CrMo4 steel, taken as 2.2 × 10⁻⁷ Ω·m with an effective relative permeability of 80 at the low field strengths of an eddy-current probe; both are assumed values for illustration.

```figure
type: compare
title: Standard depth of penetration for the pump maker's metals
cols: 10 kHz | 60 kHz | 100 kHz | 500 kHz
rowhead: Metal
- 6061-T6 aluminium, 43 %IACS | 1.008 mm | 0.411 mm | 0.319 mm | 0.143 mm
- 90/10 copper-nickel, ρ = 1.9 × 10⁻⁷ Ω·m assumed | 2.194 mm | 0.896 mm | 0.694 mm | 0.310 mm
- 42CrMo4 hardened, μᵣ = 80 assumed | 0.264 mm | 0.108 mm | 0.083 mm | 0.037 mm
caption: This is an illustration. δ = 503.3 √(ρ ÷ (μᵣ f)). The permeability of steel varies with its condition and with the field strength, so its depth is only a guide.
```

Two features stand out. Depth falls only with the square root of frequency: going from 10 kHz to 500 kHz, fifty times higher, reduces it by a factor of about seven. And permeability dominates in steel. Although hardened steel's resistivity is more than five times that of the aluminium, which on its own would make the currents penetrate deeper, its permeability of 80 cuts the depth by a factor of nine. At 100 kHz the currents in the steel shafts are confined to the top 0.08 mm, which makes surface-breaking cracks easy to find and anything below the surface invisible.

### The depth from the induction hardening plan tool

The [induction hardening plan tool](/tools/induction-hardening-plan/) was built to choose a generator frequency for induction hardening, but its first output, the electromagnetic reference depth, is the same quantity calculated the same way. Entering the 6061-T6's resistivity as 0.0401 µΩ·m, a relative permeability of 1 and a frequency of 60 kHz gives a reference depth of 0.411 mm. The tool's other outputs, the ratio to a case depth, the heating energy and the generator power, belong to hardening and are not used here. The tool is a convenient check of a hand calculation of δ for any metal and frequency, provided only the reference depth is read.

## The three-depth rule

A conductivity meter is calibrated on standards thicker than the depth its currents reach. If a part is thinner, the currents that would have flowed in the missing metal flow instead in a thinner layer, the coil sees less eddy current than it would in a thick piece of the same metal, and the meter reads the conductivity low. The common rule is that the part must be at least three standard depths thick, so that less than 5% of the current density would have flowed beyond it.

```figure
type: formula
title: Least frequency for a conductivity test on a part of thickness t
formula: 3δ ≤ t   ⇒   f ≥ ρ × (3 × 503.3 ÷ t)² ÷ μᵣ
caption: t in metres. For the 6061-T6 housings' metal: a 2.0 mm section needs at least 22.9 kHz and a 1.0 mm section at least 91.4 kHz.
- f | least test frequency, Hz
- t | part thickness at the test point, m
```

The housings themselves have walls of 8 mm or more where the meter is used, far beyond the 1.23 mm that three standard depths reach at 60 kHz. The rule matters for thinner parts.

### The mistake: a cover plate that failed for being thin

The PH-6's end cover plates are machined from 1.0 mm 6061-T6 sheet. When the goods-in inspector began checking their temper with the same 60 kHz conductivity meter used for the housing bar, the first sheet read 40.6 %IACS, below the 42.0 %IACS lower limit of the T6 band. The inspector quarantined the sheet and raised a supplier complaint, suspecting that it had been supplied in the T4 temper.

The quality engineer asked two questions before the complaint went out. What is three standard depths at 60 kHz in this alloy? It is 3 × 0.411 = 1.23 mm, more than the sheet's 1.0 mm. And does the reading change if a second sheet of the same alloy is placed behind the first? It did: stacked on a second sheet, the reading rose to 43.1 %IACS.

```figure
type: steps
title: Clearing the cover plate sheet
caption: This is an illustration. The meter offers several frequencies; the higher setting puts three standard depths inside the sheet.
- Reading at 60 kHz, single sheet | 40.6 %IACS, below the 42.0 %IACS limit
- Three standard depths at 60 kHz | 1.23 mm, more than the 1.0 mm sheet
- * Stacking test | Second sheet behind the first: reading rose to 43.1 %IACS, so the currents were reaching through
- Least frequency for 1.0 mm | 91.4 kHz by the three-depth rule
- Re-test at 480 kHz, where 3δ = 0.44 mm | 43.2 %IACS: inside the T6 band; sheet released, complaint withdrawn
- Procedure | Three-depth check written into the conductivity procedure, with the stacking test as a confirmation
```

The stacking test is a simple, decisive check that needs no calculation. If adding metal behind a part changes the reading, the currents are reaching through the part, and the reading does not represent the material's conductivity. The inspection procedure now requires the thickness at each test point to be compared with three standard depths at the meter's frequency, and the meter's higher frequency to be used for anything under 1.3 mm. Had the complaint gone out, the supplier would have been asked to investigate a heat treatment that was correct, and a sound sheet would have been returned or scrapped. A five-minute stacking test avoided both, and it is now the first response to any low conductivity reading on thin material.

## Choosing a frequency for each job

The same depth that limits conductivity testing is the tool for every other choice of frequency.

```figure
type: decision
title: Choosing a frequency from the standard depth
caption: This is an illustration. Starting points that each procedure then confirms on reference standards.
- Conductivity of a part | Frequency high enough that 3δ is less than the thickness at the test point, low enough to stay well above the meter's lift-off limits | Housing bar: 60 kHz; 1.0 mm sheet: 480 kHz
- Surface-breaking cracks | High frequency, so the currents crowd into the surface the crack breaks | Aluminium: several hundred kilohertz; steel journals: 100 kHz to 1 MHz
- Flaws below the surface | Low frequency, so the currents reach the flaw's depth with useful strength | Not needed on the PH-6 parts
- Thin coatings on a conductor | Frequency at which the substrate looks thick and the lift-off signal is clean | Anodising gauge: maker's fixed frequency
- Tube walls | Frequency at which δ is close to the wall thickness, so the currents reach both surfaces | Copper-nickel tubes, 1.0 mm wall: about 50 kHz
```

For the cooler tubes, a frequency near 48 kHz puts one standard depth at the 1.0 mm wall thickness. At 50 kHz, δ = 0.98 mm, and the current density at the inside surface is e^(−1.0 ÷ 0.98) = 36% of its value at the outside, enough for the test to respond to flaws starting at either surface. The phase lag of the currents at the inside surface, 58°, is what lets an instrument distinguish an inside flaw from an outside one by the direction of its signal, a feature Chapter 8 uses.

### Steel and permeability

Permeability makes steel the hardest metal to test. It is not a fixed property: it depends on the steel's composition, its heat treatment, its residual stresses and the strength of the applied field, and it can vary from point to point on one part. Because it enters the standard depth and the coil's reactance, local variations in permeability produce signals that can look like flaws. Two strategies deal with it. One accepts the variation and uses it, as Chapter 7 does in sorting hardened from unhardened shafts. The other removes it: a strong steady magnetic field from a saturation coil drives the steel into magnetic saturation, where its incremental permeability falls towards one, and the eddy-current test then behaves as on a non-magnetic metal. Tube mills use saturation to test steel tubes. With μᵣ = 1, the depth in the shafts' steel at 100 kHz would be 0.75 mm instead of 0.08 mm.

## Depth and crack signals

A surface-breaking crack interrupts the eddy currents that would otherwise flow across it, forcing them down and around its ends. Since the currents are concentrated within the top few standard depths, the part of a crack within that layer interrupts most of them. At the high frequencies used for cracks in steel, where the currents are within about 0.2 mm of the surface, the signal depends strongly on a crack's length along the surface and on its presence in that thin layer, and the way it grows with the crack's depth depends on the probe, the frequency and the steel. That relation cannot be calculated reliably from δ; it is measured on reference notches of known depth, which is how Chapter 6 sets up the journal scanner. A lower frequency spreads the currents deeper and makes the signal more responsive to depth, at the cost of more noise from variations in permeability, which also reach deeper.

### Depth under a coating

A non-conductive coating, such as anodising or paint, carries no eddy currents. To the coil it is simply a gap between the probe and the metal, which is what lets a coating gauge measure it as lift-off. The metal beneath must still be thick enough for its eddy currents to be fully developed, or the gauge will read the thin substrate as extra lift-off. The coating gauge's maker states a least substrate thickness for its probe; on the pump maker's thin nameplates the gauge is checked with a stacking test, as for the cover plate, before any coating reading is accepted.

## What the formula leaves out

The standard depth assumes a field that is uniform across a flat, wide conductor. A real probe is small, and its field spreads out and weakens with distance from the coil even in air. Two consequences follow, and both make real tests reach less deeply than δ suggests.

The first is that the probe's own size limits penetration. A coil a few millimetres across cannot drive currents much deeper than a distance of the order of its own radius, however low the frequency, because its field has faded by then. At low frequencies on thin, poorly conducting parts, the coil's geometry rather than δ sets the depth, which is why tests for deep flaws use large coils as well as low frequencies.

The second is that the currents need room sideways as well as downwards. Eddy currents flow in loops under the coil, spreading out to a diameter somewhat larger than the coil's. Near an edge, part of each loop is cut off, the coil sees less eddy current and the reading changes, just as it does over a thin part. This edge effect produces a large signal as a probe approaches an edge, and it makes conductivity and coating readings near edges unreliable. Each procedure therefore states a least distance from an edge, found by moving the probe towards the edge of a reference piece and noting where the reading begins to change. Chapter 4 meets the edge effect on the housing bar's end face.

## Temperature and depth

Resistivity rises with temperature, about 0.28% per kelvin for 6061-T6 as Chapter 3 shows, so a warm part has a slightly greater standard depth and a slightly lower conductivity than a cold one. The change in depth is small: 10 K raises δ by about 1.4%, half the change in resistivity, because depth goes with the square root. The change in conductivity is what matters for the reading, and it is large enough that every conductivity measurement must be corrected to the 20 °C reference temperature at which conductivity is specified. Chapter 3 shows how, and why a meter's automatic temperature compensation is only as good as the coefficient it assumes.

## The pump maker's frequencies

```figure
type: compare
title: Frequencies in the pump maker's eddy-current procedures
cols: Frequency | Standard depth | Check
rowhead: Test
- Housing bar conductivity, sections 8 mm and over | 60 kHz | 0.41 mm in 6061-T6 | 3δ = 1.23 mm, well inside the section
- Cover plate conductivity, 1.0 mm sheet | 480 kHz | 0.15 mm in 6061-T6 | 3δ = 0.44 mm; stacking test on the first sheet
- Anodising thickness | Gauge maker's fixed frequency | Not used directly | Calibrated on the same alloy (Chapter 5)
- Shaft journal cracks | 200 kHz | About 0.06 mm in hardened steel | Set on notched reference journal (Chapter 6)
- Shaft hardness sort | 1 kHz | About 0.8 mm in hardened steel | Set on reference shafts (Chapter 7)
- Cooler tubes, supplier's test | About 50 kHz | 0.98 mm in 90/10 copper-nickel | Supplier's reference tube (Chapter 8)
caption: This is an illustration. Steel depths use the assumed permeability of 80 and are only a guide.
```

## Exercise: the cooler tube wall

The cooler tubes have a 1.0 mm wall of 90/10 copper-nickel, with a resistivity of 1.9 × 10⁻⁷ Ω·m. Calculate the standard depth at 50 kHz, the share of the surface current density that reaches the inside surface and the phase lag there. Confirm the depth with the induction hardening plan tool's reference depth output. Then decide: could the 6061-T6 housing bar's conductivity be measured through a 1.0 mm wall at 120 kHz?

### Answer

δ = 503.3 × √(1.9 × 10⁻⁷ ÷ 50,000) = 503.3 × 1.949 × 10⁻⁶ = 0.981 mm. At the inside surface, x = 1.0 mm, the current density is e^(−1.0 ÷ 0.981) = 0.361, or 36.1% of the outside surface value, and it lags by 1.0 ÷ 0.981 = 1.02 radians, 58.4°. In the induction hardening plan tool, a resistivity of 0.19 µΩ·m, a relative permeability of 1 and a frequency of 50 kHz give the same reference depth, 0.981 mm.

For the 6061-T6, δ at 120 kHz = 503.3 × √(4.01 × 10⁻⁸ ÷ 120,000) = 0.291 mm, so three standard depths are 0.873 mm, less than the 1.0 mm wall. The three-depth rule is met, and the measurement is valid, with a small margin. A stacking test on the first part would confirm it, and the reading should be taken well away from the part's edges, at the least edge distance the procedure states for that probe.
