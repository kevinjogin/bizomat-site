---
book: fine-particles-by-the-numbers
chapterSlug: brownian-diffusion
order: 5
title: "Brownian diffusion: Einstein's relation at work"
description: "Calculate the diffusion coefficient and random displacement of LX-3's fume with Einstein's relation and slip, find where diffusion overtakes settling, and see why sample lines lose the smallest fume."
draft: false
---

Look at fine smoke in a beam of sunlight and the particles seem to drift with the air. Look at one under a microscope and it is never still: it jerks about in a random, restless path, even in perfectly still air. That jiggling, Brownian motion, is the particle being knocked about by the air's molecules, and for the finest fume it is a much larger motion than settling. It decides how fume reaches filter fibres, how it is lost in sampling lines and how it spreads in still air near a source.

This chapter uses Einstein's 1905 relation, with the slip correction of Chapter 3, to calculate the diffusion coefficient of LX-3's fume, converts it into a typical random displacement over time, compares diffusion with settling to find where each dominates, and connects the particle's random velocity with its random position through the relaxation time of Chapter 4. The failure case is a long, thin sampling line that quietly lost most of the smallest fume.

## Einstein's relation

Einstein's insight, which the supplied lecture notes discuss in detail, was that a suspended particle in thermal equilibrium must share the energy of the molecules around it, and that the same molecular collisions that make it jiggle also produce the friction that resists its motion. Balancing the two, he showed that the particle's **diffusion coefficient**, D, equals the thermal energy kT divided by its friction coefficient. For a sphere obeying Stokes' law with slip, the friction coefficient is 3π μ d ÷ C_c, so **D = k T C_c ÷ (3π μ d)**.

Here k is Boltzmann's constant, exactly 1.380 649 × 10⁻²³ J/K, and T is the absolute temperature. At 20 °C, kT is about **4.05 × 10⁻²¹ J**. Einstein's form, without slip, is often written D = kT ÷ (6π η r) with the radius r; Sutherland reached the same result independently, and Smoluchowski gave a kinetic treatment the following year.

```figure
type: formula
title: Diffusion coefficients of LX-3's particles
formula: D = k T C_c ÷ (3π μ d)
caption: This is an illustration for air at 20 °C, μ ≈ 1.81 × 10⁻⁵ Pa·s, with Davies's slip correction. The diffusion coefficient does not depend on the particle's density, only on its size, the gas and the temperature.
- 0.01 µm, C_c ≈ 22.09 | about 5.24 × 10⁻⁸ m²/s
- 0.1 µm, C_c ≈ 2.854 | about 6.77 × 10⁻¹⁰ m²/s
- 1 µm, C_c ≈ 1.163 | about 2.76 × 10⁻¹¹ m²/s
- 10 µm, C_c ≈ 1.016 | about 2.41 × 10⁻¹² m²/s
step: From 10 µm down to 0.01 µm, D rises by a factor of over 20,000
```

## From diffusion coefficient to displacement

Einstein's diffusion equation predicts that a particle starting at a point spreads out in a bell-shaped cloud whose width grows with the square root of time. In any one direction, the **root-mean-square displacement** after time t is **x_rms = √(2 D t)**. Double the time and the typical displacement grows only by √2; to travel ten times as far by diffusion takes a hundred times as long.

```figure
type: compare
title: Typical Brownian displacement in one direction
cols: After 1 s | After 10 s | After 60 s
caption: This is an illustration using x_rms = √(2Dt). The smallest fume particles wander by a third of a millimetre in a second; a 1 µm particle by a few micrometres. These distances are tiny compared with a room, but large compared with the gaps between filter fibres.
- *0.01 µm | about 324 µm | about 1.02 mm | about 2.5 mm
- 0.1 µm | about 37 µm | about 116 µm | about 285 µm
- 1 µm | about 7.4 µm | about 23.5 µm | about 58 µm
```

This square-root growth is the signature of a **random walk**, and the mathematics of the random walk, the Wiener process to which the lecture notes devote several sections, is the same mathematics that describes random errors accumulating in a measurement. *Random Error and Drift by the Numbers* takes that thread into instrumentation.

## Diffusion against settling

A particle both settles and diffuses. Settling distance grows in proportion to time, v_s t; diffusion distance grows with its square root, √(2Dt). Which is larger depends on particle size and on the time considered.

```figure
type: bars
title: Settling distance and diffusion distance in 1 s for LX-3's oxide particles
unit: µm
max: 180
caption: This is an illustration at 5,000 kg/m³ and 20 °C, with slip. Over 1 s, the two are equal for particles of about 0.26 µm. Smaller particles move more by diffusion than by settling; larger ones more by settling.
- 0.1 µm, diffusion | 36.8
- 0.1 µm, settling | 4.3
- *0.3 µm, diffusion | 15.7
- *0.3 µm, settling | 21.1
- 1 µm, diffusion | 7.4
- 1 µm, settling | 175
```

Over one second, the crossover is at about **0.26 µm**. Over a minute, settling has had longer to accumulate and the crossover moves down to about **0.11 µm**. LX-3's fume sits right across this boundary: its smallest particles diffuse, its largest settle a little, and all of them, in practice, go wherever the air takes them, because the air's own motion dwarfs both.

## Velocity and position: two pictures of the same motion

The lecture notes make a careful distinction that is useful in practice. In Langevin's picture, the particle has a definite velocity at every instant, which is constantly kicked by molecular impacts and constantly damped by friction with the relaxation time τ. In thermal equilibrium, each component of that velocity has an average energy of ½kT, so its root-mean-square value is **√(kT ÷ m)**. In Einstein's picture, the particle has no meaningful velocity at all, only a position that wanders by √(2Dt).

The two pictures agree whenever the time of interest is much longer than τ. A 0.1 µm oxide particle has a thermal velocity of about **0.039 m/s**, but it keeps that velocity only for about one relaxation time, **4.4 × 10⁻⁷ s**, before friction and fresh impacts randomise it, so it travels only about **1.7 × 10⁻⁸ m**, about two hundredths of a micrometre, in any one direction before "forgetting" it. Over any time a person or an instrument could notice, a millisecond or more, its motion is a random walk, and Einstein's description is exact enough. The Ornstein–Uhlenbeck theory that the notes develop is the bridge between the two; for engineering particles in air, it confirms that the simpler Einstein picture can be used.

## Seeing it: from theory to measurement

Einstein's relation was a prediction, and it was tested within a few years. Jean Perrin and his co-workers, around 1908 to 1909, prepared suspensions of small resin spheres of carefully selected size, watched them under a microscope, recorded their positions at regular intervals and measured both their random displacements and the way they distributed themselves with height under gravity. From those measurements, using Einstein's relation, they calculated Avogadro's number and found it agreed with values obtained by quite different methods. The work was a large part of what convinced the remaining sceptics that atoms and molecules were real, and Perrin received the Nobel Prize in Physics in 1926.

The same measurement is now routine. Instruments that size nanoparticles in liquids track their Brownian motion and use Einstein's relation, in reverse, to infer their size from their diffusion coefficient. Instruments that size particles in air by their mobility rely on the same friction coefficient. A relation proposed to prove that atoms exist has become a standard tool of particle measurement.

## Diffusion in still air near a source

Brownian motion is fast at the scale of a filter fibre and slow at the scale of a room. Over an hour, a 0.1 µm particle in perfectly still air diffuses only about **√(2 × 6.77 × 10⁻¹⁰ × 3,600) ≈ 2.2 mm**. Fume does not spread across a workshop by diffusion; it is carried by air currents, by the rising plume of warm air from the cut and by people and machines moving about. That is why fume concentration falls away so quickly with distance from a well-extracted source, and why a weak cross-draught can carry fume much further than diffusion ever could. Extraction design is about controlling the air's motion; diffusion only matters where the air is nearly still, close to surfaces.

### Deposition onto surfaces

Close to any surface there is a thin layer of slow-moving air, perhaps a millimetre thick in a quiet room. Fume reaches the surface by diffusing across that layer. A rough measure of the rate is the **deposition velocity**, about D divided by the layer thickness. For a 1 mm layer, a 0.01 µm particle has a deposition velocity of about **5.2 × 10⁻⁵ m/s**, about 190 mm per hour of air depth cleared, and it deposits on walls, ceilings and the undersides of shelves as readily as on floors. A 0.1 µm particle has a diffusional deposition velocity of about **6.8 × 10⁻⁷ m/s**, smaller than its slip-corrected settling velocity of about 4.3 × 10⁻⁶ m/s, so it deposits mainly on upward-facing surfaces. Over weeks, both build the grey film found on surfaces near poorly extracted cutting and welding. Its presence is a visible sign that fume is escaping capture.

### Coagulation: why fume particles grow

Brownian motion also makes fume particles collide with each other, and when they collide they usually stick. Smoluchowski worked out the rate in 1917: for particles of equal size, large enough that slip can be ignored, the coagulation coefficient is about **8kT ÷ (3μ)**, about **6.0 × 10⁻¹⁶ m³/s** in LX-3's air, and the time for the number of particles to halve is about 2 divided by that coefficient times the number concentration.

At **10¹³ particles per cubic metre**, ten million per cubic centimetre, a concentration found close to a cutting or welding source, the number halves in about **2 ÷ (6.0 × 10⁻¹⁶ × 10¹³) ≈ 335 s**, about five and a half minutes. At **10¹⁵ per cubic metre**, in the dense cloud right at the kerf, it halves in about **3.4 s**. That is why freshly formed fume, born as huge numbers of tiny primary particles, quickly builds the chain agglomerates described in Chapter 3, and why the size distribution measured a metre from the source differs from the one at the source. Once fume is diluted into the extraction air, coagulation slows to near nothing over the seconds it spends in the duct. The slip correction increases the rate for the smallest particles; the simple coefficient here is a lower estimate.

### Temperature

The diffusion coefficient is proportional to the absolute temperature and to the slip correction, and inversely proportional to the gas's viscosity, which itself rises with temperature. Near the cut, where the gas is hot, diffusion is faster; in the duct and filter, after mixing with room air, the 20 °C values in this chapter apply. For extraction calculations, the conditions at the filter are the ones that matter.

## Where diffusion matters in LX-3

Diffusion is too slow to matter across a room or a duct. In LX-3's 8 m duct, at 19.1 m/s, a particle spends about **0.42 s**, in which a 0.1 µm particle diffuses only about **24 µm**: nothing, beside the duct's 100 mm radius. The duct's turbulence moves fume about far more effectively than Brownian motion does.

Diffusion matters wherever the distances are small:

- **inside filter media**, where gaps between fibres are a few to a few tens of micrometres and air moves slowly, so fume diffuses onto fibres before it can pass (Chapter 6);
- **in sampling lines and instruments**, where narrow tubes and slow flows give the smallest particles time to reach the walls (this chapter's failure case);
- **near surfaces in still air**, where fine fume slowly deposits on everything, which is the grey film that builds up on surfaces near poorly extracted processes.

## A failure case: the long sample line

This is an illustration. To compare fume concentrations at several points around LX-3 with one instrument, a technician ran **10 m** of **4 mm** bore tubing from the machine to a particle counter on a bench, drawing **1 L/min**. The counter's readings near the machine were lower than expected, especially in its smallest size channels.

The air in the tube moved at about **1.33 m/s**, so each sample spent about **7.5 s** in the tube. In that time, a 0.01 µm particle diffuses about **0.89 mm**, nearly half the tube's 2 mm radius, so a large fraction of the smallest particles reached the wall and stuck. A 0.1 µm particle diffuses only about 0.10 mm in the same time and was much less affected. The detection came from comparing the long-line readings with a reading taken with the counter's inlet held directly at the sampling point, which showed many more particles in the smallest channels.

The correction was to move the instrument to each sampling point with a short, straight inlet, and, where a line was unavoidable, to keep it short, wide enough to keep the flow laminar but fast enough to cut the residence time, and to correct readings with published penetration calculations for diffusion in tubes. The lesson is that diffusion, negligible in a duct, can dominate in a sampling line.

## How this applies to a small Australian business

Use Einstein's relation with slip to calculate the diffusion coefficient of fine particles, and convert it into a displacement with √(2Dt) to judge whether diffusion matters over the distances and times in question. Expect diffusion to dominate settling below a few tenths of a micrometre. Treat Brownian motion as negligible across rooms and ducts, important inside filters and decisive in narrow sampling lines. Keep sampling lines short, or correct for their losses, when measuring fume.

## Exercise: a 0.03 µm particle

For a 0.03 µm fume particle in LX-3's air, with a slip correction of about 7.8, what is its diffusion coefficient? How far does it diffuse in one direction in 7.5 s, the residence time of the long sample line? Compare that with the 2 mm tube radius.

**Worked answer.** The diffusion coefficient is **4.05 × 10⁻²¹ × 7.8 ÷ (3π × 1.81 × 10⁻⁵ × 0.03 × 10⁻⁶) ≈ 6.2 × 10⁻⁹ m²/s**. In 7.5 s it diffuses about **√(2 × 6.2 × 10⁻⁹ × 7.5) ≈ 3.0 × 10⁻⁴ m**, about **0.30 mm**, about 15% of the 2 mm radius. A substantial fraction of such particles near the wall will be lost, though fewer than for 0.01 µm particles.
