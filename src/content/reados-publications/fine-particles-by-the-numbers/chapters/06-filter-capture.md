---
book: fine-particles-by-the-numbers
chapterSlug: filter-capture
order: 6
title: "Filter capture and the most penetrating size"
description: "See how LX-3's filters catch particles by diffusion, interception and impaction, why a filter has a most penetrating particle size, how stages combine by penetration and what a small leak does."
draft: false
---

A fibrous filter is not a sieve. The gaps between its fibres are many times larger than the fume particles it catches, and if it worked by straining, fume would pour straight through. It works instead because particles carried through the tangle of fibres reach a fibre surface by one of several mechanisms and stick there. Each mechanism favours a different particle size, and in between there is a size that every mechanism handles badly: the **most penetrating particle size**. Designing a filter system for fume means designing for that size.

This chapter describes the capture mechanisms in a fibrous filter using the numbers from earlier chapters, explains why efficiency has a minimum, combines LX-3's filter stages by their penetrations, sizes the cartridges' media area, and shows what a small bypass does to a high-efficiency filter. The failure case is exactly that bypass.

## Four ways to reach a fibre

As air flows through filter media, it threads between fibres a few micrometres to a few tens of micrometres across, at a speed of a few centimetres a second. A particle carried in that air can reach a fibre in four main ways.

```figure
type: compare
title: How LX-3's filters capture particles
cols: Mechanism | Favoured sizes | Governed by
caption: This is an illustration. Each mechanism is strong at one end of the size range and weak at the other, which is why total efficiency has a minimum in between. Charged synthetic media add an electrostatic mechanism that can fade with use.
- Diffusion | Brownian motion carries the particle across streamlines onto a fibre | smallest, below about 0.1 µm | diffusion coefficient (Chapter 5) and time spent near fibres
- Interception | a particle following a streamline passes within one radius of a fibre and touches it | larger, rising with size | particle size relative to fibre size
- Impaction | the particle's inertia carries it off a curving streamline into the fibre | largest, above about 1 µm | Stokes number (Chapter 4)
- Electrostatic attraction | charged fibres or particles attract each other | wide range, if charge is present | charge on fibres and particles
```

The numbers from earlier chapters show which mechanism matters for which family. In a typical media, air spends roughly **0.02 s** passing through a layer about half a millimetre thick. In that time, a 0.01 µm particle diffuses about **49 µm**, far more than the gap between fibres, so it is almost certain to touch one. A 0.1 µm particle diffuses about **5.5 µm**, comparable with the gap, so many are caught. A 1 µm particle diffuses only about **1.1 µm** and barely moves off its streamline, but it is large enough to be caught by interception and, at its Stokes number, sometimes by impaction. Coarse dust of 10 µm is caught overwhelmingly by impaction and interception on the surface of the media.

### Two dimensionless numbers at the fibre

Filter theory describes the competition at a single fibre with two dimensionless numbers alongside the Stokes number. The **Péclet number**, Pe = U d_f ÷ D, compares how fast the air carries a particle past a fibre of diameter d_f with how fast the particle diffuses: small Pe means diffusion wins, large Pe means the particle is swept past. The **interception parameter**, R = d_p ÷ d_f, is simply the particle's size relative to the fibre's.

For a 10 µm fibre with air threading past at about 0.022 m/s, the numbers fall out of the earlier chapters:

- a 0.01 µm particle has **Pe ≈ 4** and R ≈ 0.001: diffusion dominates completely;
- a 0.1 µm particle has **Pe ≈ 325** and R ≈ 0.01: diffusion is weakening and interception is still tiny;
- a 0.3 µm particle has **Pe ≈ 1,800** and R ≈ 0.03: both are weak, near the minimum;
- a 1 µm particle has **Pe ≈ 8,000** and R ≈ 0.1: diffusion is negligible and interception is taking over.

Published single-fibre efficiency correlations, of the kind found in aerosol textbooks, turn those numbers into capture fractions for each fibre, and filter theory adds up the fibres through the depth of the media. Designers rarely need to do that themselves; filter makers test their media. The value of the numbers is in seeing why a finer fibre, which lowers Pe and raises R, catches the fume better, and why it also costs more pressure drop.

## The most penetrating particle size

Diffusion weakens as particles get larger; interception and impaction weaken as they get smaller. Between them is a size at which a particle is too large to diffuse much and too small to be intercepted or impacted readily. That is the **most penetrating particle size**, often abbreviated MPPS. For high-efficiency filters at typical face velocities it usually lies between about **0.1 and 0.3 µm**, depending on the media and the air speed.

```figure
type: svg
title: Filter efficiency against particle size, showing the most penetrating size
alt: A chart with particle size on a horizontal logarithmic axis from 0.01 to 10 micrometres and filter efficiency on the vertical axis. A curve labelled diffusion falls from high efficiency at small sizes; a curve labelled interception and impaction rises at large sizes. Their combined total forms a U-shaped curve with its lowest point between 0.1 and 0.3 micrometres, marked as the most penetrating particle size.
caption: This is an illustration of the shape, not of any particular filter. Total efficiency is high for the smallest fume, high for coarse dust, and lowest in a band around 0.1 to 0.3 µm. Increasing the air velocity lowers the diffusion curve and moves the minimum to smaller sizes.
viewbox: 0 0 600 320
body:
<path class="ln" d="M60 270H570M60 270V30"/>
<path class="lf dsh" d="M60 270L60 40M180 270V40M300 270V40M420 270V40M540 270V40"/>
<path class="li dsh" d="M70 50C130 55 190 110 240 200C270 250 300 262 340 266"/>
<path class="li dsh" d="M210 266C260 262 300 245 340 200C390 120 450 60 560 50"/>
<path class="la draw" pathLength="1" d="M70 52C140 58 200 92 245 128C268 145 280 150 290 150C302 150 315 143 340 124C390 86 450 58 560 51"/>
<circle class="fa" cx="290" cy="150" r="5"/>
<text class="txa" x="250" y="180">MPPS</text>
<text class="txs" x="40" y="292">0.01</text>
<text class="txs" x="166" y="292">0.1</text>
<text class="txs" x="292" y="292">0.3</text>
<text class="txs" x="414" y="292">1</text>
<text class="txs" x="534" y="292">10</text>
<text class="txs" x="250" y="312">particle size, µm, logarithmic</text>
<text class="txs" x="80" y="80">diffusion</text>
<text class="txs" x="420" y="110">interception and impaction</text>
<text class="tx" x="12" y="40">high</text>
<text class="tx" x="12" y="262">low</text>
```

This is why high-efficiency filters are rated at a particle size near the minimum. A common definition of a HEPA filter is one that removes at least **99.97%** of particles of **0.3 µm**, a test size chosen because it lies close to where filters are weakest. Classes of high-efficiency filter are now defined by efficiency at the most penetrating size in standards such as EN 1822 and ISO 29463, which are named here by number only.

### Air velocity moves the minimum

Diffusion capture depends on time: the longer a particle spends among the fibres, the further it diffuses. Doubling the air velocity through the media halves the time, so a 0.1 µm particle's diffusion distance falls from about 5.5 µm to about **3.9 µm**, by a factor of √2. Diffusion capture weakens, the minimum in the efficiency curve deepens and moves to smaller sizes, and more fume passes. That is why filter makers specify a maximum **media velocity**, and why a filter that performs well at its rated flow can underperform if the fan is run faster. Interception and impaction behave the other way: impaction strengthens with velocity, because the Stokes number rises, so the large-particle side of the curve improves slightly while the fume side worsens. The net effect for a fume filter is almost always worse, because the fume is where the efficiency was lowest to begin with.

## Penetration and stages

For filters in series, it is easier to work with **penetration**, the fraction that gets through, than with efficiency. Penetration is one minus efficiency, and the penetration of stages in series is the product of their individual penetrations, provided each stage sees particles of the size it was rated for.

```figure
type: stats
title: LX-3's filter stages at the most penetrating size
caption: This is an illustration with teaching efficiencies: 99.0% for the fume-rated cartridges at their most penetrating size and 99.97% for the after-filter at 0.3 µm. Real efficiencies come from the makers' test data for the media and flow.
- 1% | Penetration of the cartridges | efficiency 99.0%
- 0.03% | Penetration of the after-filter | efficiency 99.97%
- *0.0003% | Combined penetration | 0.01 × 0.0003 = 3 × 10⁻⁶; efficiency about 99.9997%
- 0.000015 mg/m³ | Outlet from a 5 mg/m³ inlet at that size | 5 × 3 × 10⁻⁶
```

Multiplying penetrations assumes the particles reaching the second stage are as hard to catch as they were at the first, which is reasonable at the most penetrating size, where both stages are weakest. For other sizes, the first stage removes the easy particles and leaves a population concentrated around its own weakest size, so the real combined penetration over a broad fume distribution is calculated size band by size band, with each band's penetrations multiplied, and the bands then added. The figure above is the worst band, which is the one that matters for design.

The stages do different jobs. The cartridges take almost the entire load of coarse dust and most of the fume, and are pulse-cleaned to keep their pressure drop down. The after-filter, protected by the cartridges, sees only the small fraction that passes them, and polishes the air before it returns to the workshop. Its life is long because its load is light.

## Sizing the media

A filter's capacity is set by its media area, not its overall size. LX-3's cartridges are pleated so that a lot of media fits in a small housing. With a teaching media velocity of **0.02 m/s** for fume service, the 0.60 m³/s flow needs **0.60 ÷ 0.02 = 30 m²** of media, for example three cartridges of **10 m²** each.

Fume builds a cake on the media surface. The cake itself filters well, often improving efficiency, but its pressure drop grows as it thickens. LX-3's unit pulse-cleans each cartridge with a short reverse blast of compressed air when its pressure drop reaches a set point, and the fan is selected to deliver the design flow against the filters' pressure drop just before cleaning, not when they are new. *Ductwork by the Numbers* covers the fan and system curves; for the filter, the point is that the dirty pressure drop, not the clean one, sets the fan.

### Charged media that fade

Some synthetic filter media carry a permanent electric charge on their fibres, which attracts particles and adds an electrostatic capture mechanism on top of the mechanical ones. Such media can show high efficiency at low pressure drop when new. The charge can, however, be neutralised over time by certain aerosols, oil mists among them, and by heat and humidity, and the efficiency then falls back to the mechanical value. For a fume extractor that will run for years, the efficiency that matters is the one after the charge has gone. LX-3's designer asked the cartridge maker for efficiency figures on discharged media, which are the ones used in this chapter.

### Changing filters safely

A loaded fume cartridge holds, concentrated, everything the system has removed from the air. Changing it is the moment when workers are most exposed to the fume the system was built to control. LX-3's unit is fitted with bag-in, bag-out housings for the cartridges and the after-filter, so that a used filter is sealed into a bag before it is removed, and the change procedure specifies respiratory protection and disposal of the used filters as the hygienist advised. The change interval is set by the pressure drop and the cleaning frequency, recorded in the maintenance log, not by the calendar alone.

## What filters are not for

Fibrous filters capture particles, not gases. Laser cutting with oxygen or nitrogen assist, and cutting coated or painted sheet, can release gases and vapours that pass straight through particulate media. Where they are present in significant amounts, an activated carbon stage or discharge to outdoors may be needed, and the decision is for a ventilation engineer and occupational hygienist. Filters also do not make combustible dust safe: aluminium and some other metal dusts can burn or explode in a filter unit, and their collection needs a specific risk assessment and equipment designed for it.

## A failure case: a small bypass

This is an illustration. When LX-3's after-filter was first installed, one corner of its gasket was pinched in the housing clamp, leaving a narrow gap. Nobody noticed, because the filter looked correctly seated and the pressure gauge read normally.

Suppose the gap let only **0.1%** of the air bypass the filter media. That air carries its fume straight through, so the after-filter stage now passes the 0.1% that bypasses it plus 0.03% of the 99.9% that goes through the media. Combined with the cartridges, the system's penetration rises from about **3 × 10⁻⁶** to about **0.01 × (0.001 + 0.999 × 0.0003) ≈ 1.3 × 10⁻⁵**, more than four times worse than designed; and if the cartridges had also been bypassed by the same leak path, the penetration would rise to about **0.001**, over **330** times the design figure. A tiny leak defeats a high-efficiency filter, because the filter's own penetration is so small that any bypass dominates it.

The detection came at commissioning, when the installer scanned the downstream face and edges of the after-filter with a particle counter probe while a test aerosol was released upstream. The counts spiked at one corner. The correction was to reseat the filter with a new gasket, rescan and record a pass. The shop's commissioning sheet now includes a leak scan of every high-efficiency filter after installation and after every change, following the filter maker's procedure.

## How this applies to a small Australian business

Choose filter media for the particle sizes the process makes, and rate it at its most penetrating size, not at a size where it looks good. Respect the maker's maximum media velocity, and size media area from it. Combine stages by multiplying penetrations, and let a robust first stage protect a high-efficiency final stage. Select the fan for the dirty filter. Remember that particulate filters do not remove gases and that combustible dusts need their own assessment. Leak test high-efficiency filters after installation and after every change, because a small bypass can multiply the penetration many times over.

## Exercise: running the fan faster

To clear fume faster, an operator proposes running LX-3's fan 25% faster, raising the flow to 0.75 m³/s. What media velocity would the 30 m² of cartridge media then see? By what factor would the time a particle spends in the media change, and by what factor the diffusion distance of a 0.1 µm particle? What would happen to the efficiency at the most penetrating size?

**Worked answer.** The media velocity would rise to **0.75 ÷ 30 = 0.025 m/s**, 25% above the 0.02 m/s design value. The time in the media falls to **1 ÷ 1.25 = 0.8** of its design value, and the diffusion distance, which goes with the square root of time, to **√0.8 ≈ 0.89** of its design value, about **4.9 µm** instead of 5.5 µm for a 0.1 µm particle. Diffusion capture weakens, the most penetrating size moves smaller and the efficiency at it falls; the pressure drop also rises. Better capture at the table should come from improving the airflow where the fume is made, not from pushing more air through the filters than they are rated for.
