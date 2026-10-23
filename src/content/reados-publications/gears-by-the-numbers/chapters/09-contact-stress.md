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

## What changes the contact stress

The square root in the expression means contact stress responds more gently than bending stress to changes in load and size:

- **Face width.** Increasing b from 30 to 40 mm multiplies the stress by √(30/40) ≈ 0.866, reducing it to about 382 MPa.
- **Gear size.** Larger pitch diameters give larger radii of curvature and lower stress. Doubling both radii at the same tangential force would reduce the stress by a factor of √2.
- **Ratio.** The gear's larger radius contributes little. A pinion meshing with a rack, whose radius of curvature is infinite, would see about 382 MPa in the conveyor case: 1/r₂ disappears, but the pinion's term dominates.
- **Material pair.** Cp depends on the elastic moduli and Poisson's ratios. Softer materials, such as bronze against steel, lower the stress but also have lower allowable contact stress.

## Hardening and materials

Because contact stress is concentrated close to the surface, surface hardness has a strong influence on pitting resistance. Gear teeth are often surface hardened by carburising, nitriding or induction hardening, so the surface resists contact fatigue while the core keeps its toughness for bending. The case depth must be deep enough to carry the subsurface stress, which peaks a short distance below the surface. The READOS chapter on [heat treatment and surface hardening](/reados/collections/machine-elements-and-mechanical-design/heat-treatment-and-surface-hardening-explained/) explains those processes for designers and buyers.

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

## Lubrication carries the load

A lubricant film separates the teeth for much of each contact cycle. Its thickness depends on viscosity, speed and the curvature of the surfaces. Too thin a film lets asperities touch, accelerating pitting and risking scuffing; contamination and water break the film down. Lubricant choice, cleanliness and temperature control are therefore part of a gear's surface strength, not just maintenance details. Follow the gear or gearbox supplier's lubricant specification, and treat a change of lubricant as a design change.

## Exercise: a wider face

Recalculate the conveyor pinion's contact stress for a face width of 40 mm, then explain why increasing face width does not help if the shafts deflect or the gears are misaligned.

The stress scales with **√(30/40) ≈ 0.866**, so it falls from about 441 MPa to about **382 MPa**. If the shafts deflect or the housing bores are misaligned, the load concentrates at one end of the face. The effective face width is then smaller than the drawn one, and the local contact stress can exceed the calculated value for the narrower face. Wider gears need stiffer shafts and better alignment to deliver their theoretical benefit.
