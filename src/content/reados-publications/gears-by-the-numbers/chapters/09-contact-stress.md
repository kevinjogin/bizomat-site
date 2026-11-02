---
book: gears-by-the-numbers
chapterSlug: surface-contact-stress
order: 9
title: "Surface contact stress"
description: "Estimate Hertzian contact stress between gear teeth, see how face width and size change it, and connect it to materials, hardening and lubrication."
draft: false
---

A tooth can be strong enough in bending and still fail. Where two teeth touch, the contact area is a narrow band, and the pressure across it is very high. Repeated millions of times, that pressure can fatigue the surface, starting small pits that grow until the tooth profile is destroyed. Pitting, along with scuffing and wear, is a common way gears actually wear out.

This chapter estimates the contact stress in the conveyor pair with the Hertz relationship for two cylinders, then links the result to the materials and lubrication decisions that control surface life.

## Two curved surfaces pressed together

Near the pitch point, two involute teeth behave like two cylinders in contact, each with a radius equal to the radius of curvature of its involute at that point. For a standard spur gear at the pitch point:

**r = d × sin α / 2**

For the conveyor pair:

- pinion: **r₁ = 60 × 0.34202 / 2 ≈ 10.261 mm**
- gear: **r₂ = 180 × 0.34202 / 2 ≈ 30.782 mm**

## The contact stress

Shigley's chapter 14 gives the gear contact stress, following Hertz, as:

**σc = Cp × √[ Kᵥ × Fₜ / (b × cos α) × (1/r₁ + 1/r₂) ]**

where Cp is the elastic coefficient for the material pair. For steel on steel, Shigley's table gives Cp ≈ 191 √MPa.

Working through the conveyor pair, with Fₜ ≈ 663.2 N, b = 30 mm, Kᵥ ≈ 1.742:

- **Kᵥ × Fₜ / (b × cos α) ≈ 1.742 × 663.2 / (30 × 0.939693) ≈ 40.98 N/mm**
- **1/r₁ + 1/r₂ ≈ 0.09746 + 0.03249 ≈ 0.12995 per mm**
- product ≈ 5.325 N/mm², square root ≈ 2.308

**σc ≈ 191 × 2.308 ≈ 441 MPa**

Without the velocity factor, the stress would be about 334 MPa. The contact stress is far higher than the bending stress found in Chapter 8, around 40 MPa, but the two are not comparable directly. They are resisted by different material properties and compared with different allowable values.

```figure
type: bars
title: Screened stresses in the conveyor pinion
unit: MPa
max: 480
caption: Different failure modes with different allowables; the numbers are not compared with each other.
- Root bending, Lewis with velocity factor | 39.9
- Surface contact, static | 334
- *Surface contact, with velocity factor | 441
```

## How narrow the contact band is

The Hertz relationship also gives the width of the band over which the teeth touch. For two steel cylinders, the half-width of the contact band is:

**a_H = √(4 × w × R / (π × E′))**

where w is the load per unit face width, R the effective radius from 1/R = 1/r₁ + 1/r₂, and E′ the combined elastic modulus, about 113,700 MPa for steel on steel with E ≈ 207 GPa and Poisson's ratio 0.3, the values behind Shigley's elastic coefficient.

For the conveyor pair at the pitch point, w ≈ 40.98 N/mm including the velocity factor, and R ≈ 1 / 0.12995 ≈ 7.695 mm:

**a_H ≈ √(4 × 40.98 × 7.695 / (π × 113,700)) ≈ 0.059 mm**

The teeth touch over a band only about 0.12 mm wide across the 30 mm face. As a check, the peak pressure across a band of that width is 2 × w / (π × a_H) ≈ 439 MPa, which agrees with the 441 MPa found above within rounding. The whole of the tooth's surface strength is tested in that thin strip, millions of times over.

## The stress peaks below the surface

The highest shear stress under two cylinders in contact does not occur at the surface. For line contact, it reaches about 0.30 times the peak pressure at a depth of about 0.78 times the half-width. For the conveyor pinion, that is roughly:

- **Maximum shear stress:** 0.30 × 441 ≈ **132 MPa**
- **Depth:** 0.78 × 0.059 ≈ **0.046 mm** below the surface

```figure
type: stats
title: Inside the conveyor pinion's contact at the pitch point
caption: Hertz line contact, steel on steel, including the velocity factor. The surface strength is decided in a very thin layer.
- 0.12 mm | Contact band width | across the 30 mm face
- 441 MPa | Peak contact pressure | at the centre of the band
- 132 MPa | Maximum shear stress | about 0.30 × peak pressure
- *0.046 mm | Depth of maximum shear | about 0.78 × half-width
```

This is why pits often start just below the surface and break out as small, shell-like craters. It is also why a surface-hardened case must be deep enough: the hardened layer must extend well beyond the depth of maximum shear, with margin for the gradual fall in hardness towards the core. Rating methods and heat treaters set case depth from the module, the load and the process, typically far deeper than this small number alone suggests, because the stresses under real, rough, sliding surfaces and the hardness gradient both need allowance.

## The worst point is not always the pitch point

The calculation above uses the radii of curvature at the pitch point, which is convenient and is what Shigley's simple expression assumes. The pinion's flank is more sharply curved lower down, nearer its base circle, and if a single pair of teeth carries the full load there, the contact stress is higher.

Chapter 4 showed that the conveyor pair's single-contact zone runs from about 8.30 mm to about 11.21 mm along the line of action, measured from the pinion's tangent point on its base circle. The pitch point, at 10.26 mm, lies inside it. At the lower end of the zone, the **lowest point of single tooth contact** on the pinion, the radii of curvature are about 8.298 mm on the pinion and 32.744 mm on the gear:

**1/r₁ + 1/r₂ ≈ 0.12051 + 0.03054 ≈ 0.15106 per mm**

The contact stress scales with the square root of that sum, so it rises by a factor of √(0.15106 / 0.12995) ≈ 1.078, to about **475 MPa**. Rating methods such as ISO 6336 include a factor for exactly this case when the lowest point of single contact is more severe than the pitch point, as it often is for pinions with few teeth.

## What changes the contact stress

The square root in the expression means contact stress responds more gently than bending stress to changes in load and size:

- **Face width.** Increasing b from 30 to 40 mm multiplies the stress by √(30/40) ≈ 0.866, reducing it to about 382 MPa.
- **Gear size.** Larger pitch diameters give larger radii of curvature and lower stress. Doubling both radii at the same tangential force would reduce the stress by a factor of √2.
- **Ratio.** The gear's larger radius contributes little. A pinion meshing with a rack, whose radius of curvature is infinite, would see about 382 MPa in the conveyor case: 1/r₂ disappears, but the pinion's term dominates.
- **Material pair.** Cp depends on the elastic moduli and Poisson's ratios. Softer materials, such as bronze against steel, lower the stress but also have lower allowable contact stress.

## Hardening and materials

Because contact stress is concentrated close to the surface, surface hardness has a strong influence on pitting resistance. Gear teeth are often surface hardened by carburising, nitriding or induction hardening, so the surface resists contact fatigue while the core keeps its toughness for bending. The case depth must be deep enough to carry the subsurface stress, which peaks a short distance below the surface. The Library chapter on [heat treatment and surface hardening](/reados/collections/machine-elements-and-mechanical-design/heat-treatment-and-surface-hardening-explained/) explains those processes for designers and buyers.

Allowable contact stresses come from tested material data at a stated number of cycles and reliability, published in rating standards and by suppliers. This book does not give allowable values; take them from the method and material you will actually use.

```figure
type: decision
title: Matching the remedy to the surface failure
question: What does the tooth surface show?
caption: Inspect worn gears before redesigning; the pattern points to the cause.
- Small pits near the pitch line | Contact fatigue | harder surface, wider face, lower load
- Scored, welded streaks | Scuffing | lubricant, viscosity, cooling, surface finish
- Polished, thinned profiles | Wear | contamination, lubricant, hardness
- *Contact at one end of the face | Misalignment | shafts, bearings, housing
```

## Pairing the hardnesses of pinion and gear

In through-hardened gear pairs, the pinion is commonly made harder than the gear. It sees more contact cycles, as Chapter 8 showed for bending, and its smaller radius of curvature gives it the higher stress at most points. A harder pinion running against a softer gear can also gently work-harden and polish the gear's surface during running in. The difference in hardness between pinion and gear is a design choice, made with the rating method's guidance and the supplier's experience.

Where both members are surface hardened, as in many compact industrial gearboxes, they are often of similar hardness, and the case depth, surface finish and lubrication become the main controls.

## Lubrication carries the load

A lubricant film separates the teeth for much of each contact cycle. Its thickness depends on viscosity, speed and the curvature of the surfaces. Too thin a film lets asperities touch, accelerating pitting and risking scuffing; contamination and water break the film down. Lubricant choice, cleanliness and temperature control are therefore part of a gear's surface strength, not just maintenance details. Follow the gear or gearbox supplier's lubricant specification, and treat a change of lubricant as a design change.

## Scuffing: when the film fails suddenly

Pitting develops slowly over millions of cycles. **Scuffing** can happen in minutes. When the oil film between sliding teeth breaks down, the surfaces weld together at points and tear apart, leaving rough, streaked bands running in the direction of sliding, usually near the tips and roots where sliding is greatest.

Chapter 2 showed that the conveyor pair slides at up to about 1.6 m/s at the ends of contact, against zero at the pitch point. The heat generated by sliding under high contact pressure raises the temperature of the surfaces briefly as they pass through contact, a rise often called the flash temperature. If the surface temperature exceeds what the lubricant can withstand, the film fails. Higher loads, higher sliding speeds, rougher surfaces and hotter oil all increase the risk.

The defences are a lubricant of suitable viscosity, with extreme-pressure additives where the duty demands them; smooth surfaces; tip relief to soften the heavily sliding entry into contact; and adequate cooling. Rating methods include separate scuffing checks, which become important in fast, heavily loaded or hot-running drives. For the conveyor pair, at moderate speed and load, a suitable gear oil and a clean, cool gearbox should keep scuffing remote.

## Choosing the oil viscosity

Gear oils are graded by viscosity, commonly to the ISO viscosity grade system, which classifies oils by their viscosity at 40 °C. Slow, heavily loaded gears need more viscous oil to build an adequate film; fast, lightly loaded gears can use thinner oil, which also churns less and runs cooler. Gear and lubricant suppliers publish charts that relate the recommended grade to pitch-line speed, load and operating temperature, and the gearbox maker's specification takes priority for a packaged unit.

Temperature matters as much as the grade. Viscosity falls steeply as oil warms, so an oil that is correct at 50 °C may be too thin at 90 °C. A gearbox that runs hotter than expected, perhaps because of a blocked breather, a dirty housing that cannot shed heat or a higher duty than designed, effectively loses film thickness. Checking the running temperature is therefore one of the cheapest checks of surface health a maintainer can make.

## Running in

New gears have surface roughness and small geometric errors that concentrate load on the high spots. A period of **running in**, at reduced load or with a controlled increase in load, lets those high spots wear or deform slightly so that the contact spreads more evenly. The surfaces become smoother and the oil film more effective.

Running in releases fine wear particles. Many gearbox suppliers therefore recommend draining and replacing the oil, or changing the filter, after the first period of operation. The running-in procedure, if the supplier specifies one, belongs in the commissioning record alongside the backlash and contact pattern checks of earlier chapters.

## Reading pitting in service

Not all pitting is a reason for alarm. Small, scattered pits that appear early in life on high spots and then stop growing, sometimes called **initial pitting**, can be the surface adjusting itself as the contact spreads. Pits that keep growing in number and size, merging into larger craters and spreading across the working profile, are **progressive pitting**, and they lead to rising noise, vibration and eventually loss of tooth profile.

The practical response is to record and compare. Photographs of the same teeth at each inspection, taken with consistent lighting and a scale, show whether the pitting has stabilised or is growing. A borescope through an inspection port can do this without dismantling the gearbox. Oil analysis that tracks wear metal content adds evidence. A gear whose pitting is spreading needs its load, alignment and lubrication reviewed before it is simply replaced with an identical part, because an identical part in the same conditions will follow the same path.

## Exercise: a wider face

Recalculate the conveyor pinion's contact stress for a face width of 40 mm, then explain why increasing face width does not help if the shafts deflect or the gears are misaligned.

The stress scales with **√(30/40) ≈ 0.866**, so it falls from about 441 MPa to about **382 MPa**. If the shafts deflect or the housing bores are misaligned, the load concentrates at one end of the face. The effective face width is then smaller than the drawn one, and the local contact stress can exceed the calculated value for the narrower face. Wider gears need stiffer shafts and better alignment to deliver their theoretical benefit.
