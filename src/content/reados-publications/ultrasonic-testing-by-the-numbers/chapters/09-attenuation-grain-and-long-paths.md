---
book: ultrasonic-testing-by-the-numbers
chapterSlug: attenuation-grain-and-long-paths
order: 9
title: "Attenuation, grain and long sound paths"
description: "Why sound weakens in steel, scattering by grains and its steep rise with frequency, measuring attenuation from back-wall echoes, and a decibel budget for finding a crack 2.55 m into a mill roll shaft."
draft: false
---

Over the few millimetres of a pipe wall or a 12 mm plate, steel is practically transparent to ultrasound. Over metres, it is not. A pulse sent along a mill roll shaft loses strength to beam spread and to the steel itself, and by the time an echo returns from a crack at the far journal fillet it may be tens of decibels weaker than the same crack would give near the probe. Whether the crack can be found depends on a budget: how much signal is available, how much the path costs, and whether what is left stands clear of the noise.

This chapter explains where attenuation comes from and why it rises so steeply with frequency, measures it in the No. 3 mill top roll shaft from the shaft's own echoes, builds the decibel budget for a fatigue crack at the far fillet, and finishes with a sensitivity setting that was nearly 19 dB too low.

## Where the sound goes

A sound wave in a perfect, uniform elastic solid would travel forever, losing amplitude only by spreading. Real metals take energy out of the wave in two ways.

**Absorption** converts sound energy to heat. In a metal, several mechanisms contribute: internal friction as dislocations move back and forth in the stress cycle; thermoelastic loss, as compressed regions warm slightly and expanded regions cool, with heat flowing between them; and, in pure metals at very low temperatures, the conduction electrons themselves, which are pushed about by the moving lattice and drain energy from it. That electronic damping is a sensitive probe in low-temperature physics, but at room temperature in engineering steels it is small. Absorption in steel at testing frequencies rises roughly in proportion to frequency.

**Scattering** sends sound out of the beam without destroying it. A metal is a mass of crystal grains, each with its stiffness differing slightly in different directions, so the sound speed changes a little at every grain boundary. Each boundary reflects a tiny fraction of the wave in some new direction. Summed over millions of grains, those reflections remove energy from the beam and return a fine, flickering noise to the probe, the grass at the bottom of the screen that rises when the gain is turned up.

```figure
type: compare
title: How grain scattering depends on the ratio of wavelength to grain size
cols: Condition | Scattering attenuation rises as | Practical meaning
rowhead: Regime
- Rayleigh | wavelength much larger than the grain size | grain size³ × frequency⁴ | doubling frequency raises scattering 16-fold; fine-grained steels are quiet at low frequency
- Stochastic | wavelength comparable with the grain size | grain size × frequency² | coarse castings and weld metal at high frequency; testing becomes difficult
- Diffusive | wavelength much smaller than the grain size | inversely with grain size, independent of frequency | very coarse grains; testing impractical
caption: Typical forms of the frequency dependence for polycrystalline metals. Real steels show a combination of absorption and scattering, and the exponents are measured, not assumed, for any long-path test.
```

The Rayleigh regime is the one that matters for the roll shaft. A forged and normalised carbon steel has grains a few tens of micrometres across, far smaller than the 2.9 mm wavelength at 2 MHz, so scattering is weak but climbs steeply with frequency. Doubling the frequency to 4 MHz would raise the scattering component sixteen-fold. That is the physics behind Chapter 3's advice that the 2 MHz probe, not the 4 MHz, is the right first choice for the shaft.

## The attenuation coefficient

Both mechanisms remove a fixed fraction of the remaining amplitude per unit distance, so the amplitude falls exponentially, and on a decibel scale the loss is simply proportional to the distance travelled. The attenuation coefficient α is quoted in decibels per metre or per millimetre of sound travel. Because an echo travels out and back, the attenuation loss on an echo is α multiplied by twice the distance to the reflector.

```figure
type: formula
title: Attenuation and the far-field echo laws together
formula: Attenuation loss on an echo, dB = 2 × α × s
formula: Back wall at distance s: echo ∝ (1 ÷ s) × 10^(−2αs ÷ 20)
formula: Small disc reflector of diameter d at distance s, relative to a back wall at the same distance: ratio = π d² ÷ (2 λ s)
caption: α is the one-way attenuation coefficient in dB per metre of travel, s the distance to the reflector in metres and λ the wavelength. The disc formula is the far-field relation behind the distance–gain–size method, valid beyond about three near field lengths for a reflector much smaller than the beam.
- α | attenuation coefficient, dB/m
- s | distance from probe to reflector, m
- d | equivalent disc diameter of the reflector
```

### Measuring it in the shaft

Attenuation varies with the steel, its forging reduction and its heat treatment, so for a long-path test it must be measured in the part itself, not taken from a table. The roll shaft offers a convenient way. Its far end face, 3,200 mm from the inspection end, is flat and square to the shaft's axis and returns a strong back-wall echo, followed by a second echo after another round trip.

The technician measures the gains needed to bring the first and second back-wall echoes to the same screen height. The difference is 31.6 dB. Part of that is beam spread: the second echo has travelled twice as far, and a back-wall echo falls as 1 ÷ s, so spreading accounts for 20 log₁₀ 2 = 6.0 dB. The rest is attenuation over the extra 6.4 m of round-trip travel: (31.6 − 6.0) ÷ 6.4 = 4.0 dB per metre. That figure, measured at 2 MHz in this shaft, is used in the budget below. The same echoes also calibrate the velocity: the first back-wall echo arrives at 1,094 µs, which over 3,200 mm gives 5,850 m/s, the speed Chapter 1's exercise calculated from the shaft steel's elastic constants.

## The decibel budget for the far fillet

Fatigue cracks in roll shafts start at stress concentrations, the journal fillets and the edges of the shrink fit, and grow inward roughly perpendicular to the shaft's axis. Seen from the end face, such a crack is a flat reflector square to the beam, the best orientation for detection. The question is how small a crack can be found at 2,550 mm.

The mill's inspection specification, written with the shaft's original equipment maker, asks for a crack at either fillet to be detected when its reflecting area is equivalent to a 6 mm diameter disc. The budget works out how far below the shaft's own back-wall echo such a reflector's echo will be.

```figure
type: stats
title: Signal budget at 2 MHz for a 6 mm equivalent reflector at the far fillet
caption: This is an illustration. Relative to the first back-wall echo from the far end at 3,200 mm. α = 4.0 dB/m measured; λ = 2.925 mm at 5,850 m/s.
- −42.4 dB | 6 mm disc against a back wall at the same 2,550 mm: π × 6² ÷ (2 × 2.925 × 2,550)
- +2.0 dB | the fillet is nearer than the far end: back wall 20 log₁₀(3,200 ÷ 2,550)
- +5.2 dB | less steel to cross: 2 × 0.65 m × 4.0 dB/m
- −35.2 dB | the crack's echo against the far-end back-wall echo
- 20.4 dB | total two-way attenuation to the far fillet
```

So the procedure sets the back-wall echo from the far end to 80% of full screen, adds 35.2 dB, and at that gain a 6 mm equivalent reflector at the far fillet will reach 80% of full screen. The recording level is set at half that height, 6 dB below, to allow for a crack less favourably oriented or less reflective than the ideal disc.

The same calculation at the near fillet, 650 mm from the end, gives −30.5 dB for the disc against a back wall at 650 mm, +13.8 dB because the fillet is much nearer than the far end, and +20.4 dB for the steel not crossed: a net +3.7 dB. A 6 mm reflector at the near fillet returns an echo slightly stronger than the far end's back wall. The near fillet is easy; the far fillet is the test.

### Why not 4 MHz?

At 4 MHz the wavelength halves, and the disc's echo relative to a back wall rises by 6 dB, from −42.4 to −36.4 dB, which would seem to help. But the attenuation rises too. With scattering dominating, the coefficient measured in a trial at 4 MHz on the same shaft was about 12 dB per metre, three times the 2 MHz figure. The two-way loss to the far fillet rises from 20.4 dB to 61.2 dB, and the far end's back-wall echo, the reference for the whole budget, falls by a further 51 dB.

```figure
type: bars
title: Two-way attenuation to the far fillet and to the far end, by frequency
unit: dB
max: 80
caption: This is an illustration. α = 4.0 dB/m at 2 MHz and about 12 dB/m at 4 MHz, both measured on the shaft. At 4 MHz the far end's back-wall echo was barely distinguishable from grain noise at the instrument's highest gain.
- * 2 MHz, far fillet at 2.55 m | 20.4
- 2 MHz, far end at 3.20 m | 25.6
- 4 MHz, far fillet at 2.55 m | 61.2
- 4 MHz, far end at 3.20 m | 76.8
```

Against the 6 dB gained in the disc ratio, the 4 MHz probe loses 40.8 dB more to attenuation at the far fillet, a net loss of about 35 dB, a factor of fifty in amplitude. Grain noise, which rises with frequency, makes it worse. The 4 MHz probe stays in the kit as a follow-up tool for the near fillet, where the path is short and its narrower beam helps to locate an indication.

## Coupling on the end face

Every figure in the budget assumes the same coupling at every probe position. The shaft's end face carries a centre hole from its original turning and, on this shaft, a drive dog recess, and the face itself is often scarred by years of handling. The technician cleans the face back to bright metal, avoids the centre hole and recess, uses a thick couplant on the machined surface, and checks at each of the four probe positions of Chapter 3 that the far end's back-wall echo reaches the same height within 2 dB. A position whose back-wall echo is low has poor coupling or sits partly over a feature; it is corrected before any scanning there, because a 6 dB coupling loss would quietly turn an 18 dB noise margin into 12 dB.

## Noise, not gain, is the limit

A modern flaw detector has more than 100 dB of gain, so it can always amplify a weak echo to full screen. The limit is what else is amplified with it. Electrical noise from the instrument and cable sets a floor that matters only at very high gain. Grain noise, the sum of scattering from the shaft's grains within the beam at the same distance, rises with gain in step with the echo and does not improve with more amplification. A crack is detectable when its echo stands clear of that noise, conventionally at least 6 dB and preferably 12 dB above it.

On the roll shaft at 2 MHz, with the gain set 35.2 dB above the back-wall echo, the grain noise at 2,550 mm sat at about 10% of full screen, so the 80% echo of the 6 mm reflector would stand 18 dB above it, and the recording level at 40% would stand 12 dB above it. The test has enough margin at 2 MHz, and that margin, measured on the shaft itself, is recorded in the report as evidence that the specified reflector could have been found.

## The mistake: a sensitivity set without attenuation

The first time the shaft was inspected by a new technician, the sensitivity was set on a 200 mm reference block with a 6 mm flat-bottomed hole, which the technician then corrected to 2,550 mm using the far-field law for a small reflector, 40 log₁₀(2,550 ÷ 200) = 44.2 dB, to allow for the greater distance. No indications were found at either fillet, and the report described the shaft as clear.

The reliability engineer, preparing the following season's inspection, worked the budget in this chapter and found that the report's sensitivity at the far fillet did not include attenuation. Over the extra 2.35 m between the reference block's hole and the far fillet, out and back, the steel costs 2 × 2.35 × 4.0 = 18.8 dB.

```figure
type: steps
title: Finding the missing 18.8 dB
caption: This is an illustration. The reference block's own attenuation over 200 mm is small and is ignored here; the correction is the difference in path.
- Reference set on a 200 mm block's 6 mm hole | corrected for distance only, 44.2 dB
- Budget worked from the shaft's own back wall | gain for the far fillet should be 18.8 dB higher
- Missing term | attenuation: 2 × (2.55 − 0.20) m × 4.0 dB/m = 18.8 dB
- Effect | the far fillet was tested at a sensitivity about nine times too low in amplitude
- * Re-inspection at the next slack season | sensitivity set from the shaft's far-end back wall plus 35.2 dB; fillets clear, noise margin 18 dB recorded
- Procedure changed | attenuation measured on every long-path part; DGS budget recorded on the report
```

At the far fillet, the first inspection had been about 18.8 dB, nearly a factor of nine in amplitude, less sensitive than intended. A crack that would have given an 80% echo at the correct gain would have reached only 9% of full screen, lost in the grain noise. The shaft was re-inspected at the next slack season with the sensitivity set from its own back wall, the far fillet was clear, and the noise margin was recorded. Setting sensitivity from the part's own back wall has the advantage of including everything the path costs, the coupling, the attenuation and the probe's actual output, in a single measured reference.

## Exercise: the shrink-fit edge

The roll shell's shrink fit ends 1,850 mm from the inspection end face, another site where fatigue cracks can start. Using this chapter's figures, α = 4.0 dB/m at 2 MHz, λ = 2.925 mm and the far end at 3,200 mm, calculate how far below the far-end back-wall echo a 6 mm equivalent reflector at the shrink-fit edge will appear, and the gain to add to the back-wall setting. Then say whether a 3 mm equivalent reflector at the far fillet could be detected with the measured noise at 10% of full screen.

### Answer

**Given:** s = 1.85 m and 2.55 m; far end 3.20 m; α = 4.0 dB/m; λ = 2.925 mm; d = 6 mm and 3 mm; noise at 10% of full screen when the 6 mm far-fillet reflector is set to 80%.

**Assumptions:** far-field laws apply; the reflector is a flat disc square to the beam; attenuation is uniform along the shaft.

**Method:** disc against a back wall at the same distance, plus the distance correction to the far end, plus the attenuation saved.

**Disc ratio at 1,850 mm:** π × 36 ÷ (2 × 2.925 × 1,850) = 113.1 ÷ 10,822 = 0.01045, or −39.6 dB.

**Distance correction:** 20 log₁₀(3,200 ÷ 1,850) = +4.8 dB.

**Attenuation saved:** 2 × (3.20 − 1.85) × 4.0 = +10.8 dB.

**Result:** −39.6 + 4.8 + 10.8 = −24.0 dB. Add 24.0 dB to the gain that sets the far end's back-wall echo to 80% of full screen.

**A 3 mm reflector at the far fillet:** its disc ratio is 12.0 dB lower than the 6 mm disc's, because the ratio goes as d² and halving d quarters it. At the gain where the 6 mm reflector reaches 80%, the 3 mm reflector reaches 80% ÷ 10^(12 ÷ 20) = 20% of full screen, only 6 dB above the 10% noise. It would be detectable on a careful scan, but at the margin; the procedure's recording level of 40% would not record it. Finding 3 mm reliably at the far fillet would need a quieter, lower-noise test, such as a larger probe, or inspection from the far end, which turns the far fillet into a 650 mm path.

**Verification:** the 1,850 mm result, −24.0 dB, lies between the near fillet's +3.7 dB and the far fillet's −35.2 dB, as it should for an intermediate distance.
