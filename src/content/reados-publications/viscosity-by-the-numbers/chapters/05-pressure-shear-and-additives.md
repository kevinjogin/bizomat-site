---
book: viscosity-by-the-numbers
chapterSlug: pressure-shear-and-additives
order: 5
title: "Pressure, shear and additives"
description: "Estimate how pressure raises oil viscosity, see how polymer-thickened oils lose viscosity at high shear, recognise non-Newtonian greases, and judge when each effect matters."
draft: false
---

Temperature is the largest influence on an oil's viscosity, but it is not the only one. Squeeze an oil and it becomes more viscous. Shear a polymer-thickened oil hard enough and it becomes less viscous, sometimes for a moment and sometimes for good. Thicken an oil with soap and it becomes a grease, which does not flow at all until it is pushed hard enough. Each of these effects is small in some places and decisive in others, and an engineer needs a feel for which is which.

This chapter estimates the pressure effect with the exponential relation Barus proposed in 1893 and applies it to the oil in HPU-40's pump. It explains the temporary and permanent viscosity losses of oils containing polymer viscosity modifiers, describes the non-Newtonian behaviour of greases, and ends with a high-index oil that sheared down in service and took a machine below its maker's limit.

## Viscosity rises with pressure

Squeezing a liquid pushes its molecules closer together, makes the gaps they must hop into smaller and raises the energy barrier to flow. Viscosity therefore rises with pressure, and for oils it rises roughly exponentially. The simplest description, due to Barus, uses one coefficient, the pressure–viscosity coefficient α, measured by the oil maker or found in the tribology literature for oils of the same type.

```figure
type: formula
title: The Barus pressure–viscosity relation
formula: μ(p) = μ₀ × exp(α × p)
caption: μ₀ is the viscosity at atmospheric pressure and the same temperature. The relation is a good approximation at hydraulic pressures and progressively overstates the rise at the very high pressures inside rolling contacts.
- μ₀ | dynamic viscosity at atmospheric pressure, Pa·s
- α | pressure–viscosity coefficient, 1/Pa
- p | gauge pressure, Pa
```

This is an illustration. HPU-40's oil maker gives a pressure–viscosity coefficient of 2.0 × 10⁻⁸ per pascal, which is 20 per gigapascal. At the working pressure of 160 bar, which is 16 MPa, the factor is exp(2.0 × 10⁻⁸ × 1.6 × 10⁷) = exp(0.32) = 1.377.

```figure
type: bars
title: HPU-40's oil viscosity relative to atmospheric pressure, same temperature
unit: ×
max: 1.8
caption: This is an illustration. Barus relation with α = 2.0 × 10⁻⁸ 1/Pa. At the relief setting of 175 bar the oil is 42% more viscous than at the reservoir.
- 0 bar, reservoir and return | 1.000
- 50 bar | 1.105
- 100 bar | 1.221
- * 160 bar, working pressure | 1.377
- 175 bar, relief setting | 1.419
- 250 bar | 1.649
```

A 38% rise at working pressure is not negligible. It is as large as the change caused by about 8 K of temperature at 50 °C. Yet it rarely appears in hydraulic calculations, for a good reason: most of the viscous losses in a hydraulic circuit happen in places where pressure is falling from high to low, so the oil experiences a range of viscosities, and the effect partly averages out.

## Where pressure matters in HPU-40

The clearest example is the leakage path between a pump's piston and its bore, where oil flows from the full working pressure on one side to the pump's case pressure on the other. Chapter 8 calculates that leakage with the oil's atmospheric viscosity, as almost every design calculation does. Allowing for the pressure effect is straightforward for a thin gap of uniform thickness: the viscosity at each point depends on the local pressure, and integrating along the gap gives a correction factor that depends only on α times the pressure difference.

```figure
type: formula
title: Leakage through a thin gap with a pressure-dependent viscosity
formula: Q ÷ Q₀ = [1 − exp(−αΔp)] ÷ (αΔp)
caption: Q₀ is the leakage calculated with the viscosity at the gap's outlet pressure. For HPU-40 at 160 bar, αΔp = 0.32 and the ratio is 0.856.
- Q | leakage allowing for the pressure effect
- Q₀ | leakage with constant viscosity μ₀
- αΔp | pressure–viscosity coefficient times pressure difference
```

This is an illustration. At 160 bar the correction is (1 − exp(−0.32)) ÷ 0.32 = 0.856. A leakage calculated with the oil's atmospheric viscosity overstates the real leakage by 1 ÷ 0.856 = 1.17, or 17%. For estimating a pump's volumetric efficiency, where the measurement uncertainty is often larger, the correction is a refinement. For comparing calculated leakage with a careful test, or for designing a seal-less clearance to a target leak, it is worth including.

In loaded rolling contacts the effect is enormous. Inside the contact between a ball and its race, or between two gear teeth, pressures reach the order of a gigapascal for a fraction of a millisecond, and the oil's viscosity rises by many orders of magnitude, so that it behaves almost like a solid while it is in the contact. This is what allows a film less than a micrometre thick to separate surfaces carrying such loads, and it is the basis of elastohydrodynamic lubrication. At those pressures the simple Barus exponential overstates the rise and more elaborate models are used; this book stays with hydraulic pressures, and the companion book on plain bearings, whose film pressures are a few megapascals, can safely ignore the effect.

## Temperature and pressure together

Inside a working pump the oil is hot and under pressure at the same time, and the two effects pull in opposite directions. Combining them is simple: find the atmospheric viscosity at the oil's temperature with Chapter 3's relation, then multiply by the Barus factor for the local pressure.

This is an illustration. On HPU-40's hottest afternoon the oil is at 65 °C, where its atmospheric dynamic viscosity is 14.62 mPa·s. On the high-pressure side of the pump's pistons, at 160 bar, it is 14.62 × 1.377 = 20.1 mPa·s, the same as the oil at about 56 °C at atmospheric pressure. The pressure has bought back about nine kelvin of the summer's thinning, but only where the pressure is high. Where the film is fed from the low-pressure side, as at the pump's shaft bearing and its case, it has not.

Two practical rules follow. First, a machine maker's viscosity limits are always stated for the oil at atmospheric pressure, measured in the usual way, so the pressure factor must never be applied to make an oil appear to meet a limit it does not meet. Second, the pressure effect is real and always in the safe direction for film thickness, so a design calculation that ignores it is conservative for films and slightly pessimistic for leakage. That is why it can usually be left out of hydraulic calculations and should be put in when a calculated leakage is compared with a measurement.

## Shear: when an oil stops being Newtonian

Chapter 1 noted that plain mineral oils are Newtonian: their viscosity does not depend on how fast they are sheared. Many modern oils are not plain. Multigrade engine oils, high viscosity index hydraulic oils and some gear oils contain a few per cent of long-chain polymer, called a viscosity modifier or viscosity index improver, which raises viscosity more at high temperature than at low and so flattens the viscosity–temperature curve.

The polymer molecules are long coils, thousands of times larger than the oil's own molecules. At rest, or at the gentle shear rates of a laboratory viscometer, they tumble freely and add their full share to the viscosity. At high shear rates, such as those in a pump's clearances or a bearing film, the coils stretch out and align with the flow, and they resist it less. The oil's viscosity falls while it is being sheared hard and recovers when the shear stops. That is temporary shear loss.

At still higher shear, or over many passes through a pump, the longest polymer chains are broken. Broken chains contribute less to viscosity, and they do not reassemble. The oil's viscosity, even measured gently in a laboratory, is permanently lower. That is permanent shear loss, and it is the more serious of the two because it accumulates with service.

```figure
type: compare
title: Two kinds of viscosity loss in polymer-thickened oils
cols: Temporary shear loss | Permanent shear loss
rowhead: Feature
- Cause | Polymer coils align with the flow | Polymer chains break
- When it happens | Only while the oil is sheared hard | Accumulates over service
- Recovers at rest? | Yes, immediately | No
- Seen in a laboratory viscosity test? | No, the test shears gently | Yes, the oil tests lower
- How to measure | High-shear viscosity, at shear rates of the order of a million per second | Shear stability test, then a normal viscosity test
- Plain mineral oil | Not affected | Not affected
caption: Oil makers report shear stability using standard tests that pass the oil through an injector nozzle or a loaded roller bearing and measure the viscosity before and after.
```

This is why Chapter 1 asked for a high-shear viscosity when a polymer-thickened oil is used in a machine with fine clearances, and why the data sheets of high viscosity index hydraulic oils often report a viscosity after a shear stability test as well as the fresh oil's values. An oil whose data sheet shows only fresh values is telling the reader half the story.

## Greases and other non-Newtonian lubricants

A grease is an oil held in a sponge-like network of thickener, usually a metal soap or a clay. At rest the network gives the grease a yield stress: below a certain shear stress it does not flow at all, which is why grease stays in a bearing and oil does not. Above the yield stress the network breaks down and the grease flows, with an apparent viscosity that falls steeply as the shear rate rises. A grease's consistency is classified by how far a standard cone sinks into it, the NLGI grade, which is a measure of stiffness and not of viscosity.

For lubrication, the property that matters most in a grease is usually the viscosity of its base oil, because it is the oil, bled from the network into the contact, that forms the film. Grease data sheets give the base oil viscosity at 40 °C and 100 °C, and Chapter 3's relation applies to it in exactly the same way as to a liquid oil. A grease for HPU-40's motor bearings would be chosen first by its base oil viscosity at the bearings' running temperature and second by its consistency, thickener and temperature range.

Some other fluids met in machines are non-Newtonian too: water–glycol and emulsion hydraulic fluids, cutting fluids, many paints, adhesives and food products. For each, a single viscosity figure is meaningful only with the shear rate and temperature at which it was measured.

## Air, water and the apparent viscosity of a working oil

Two contaminants change how an oil behaves in a working machine, even though neither appears on its data sheet. Fine air bubbles dispersed through the oil, as happens when a return line discharges above the oil surface, make the oil spongy and compressible and give it an apparent viscosity different from the oil's own; they also collapse violently under pressure and heat the oil locally. Water dispersed as an emulsion, as happens when a cooler leaks or condensation accumulates, generally raises the apparent viscosity and attacks additives and surfaces. Both are signs of a fault rather than properties to calculate with, and Chapter 10 shows how viscosity results, read alongside water and appearance, help find them.

## The error: a high-index oil that sheared down

This is an illustration. The press shop's second, smaller power unit runs a flatter-curved, high viscosity index VG 46 oil, the 46.0 and 8.0 mm²/s oil compared with HPU-40's in Chapter 3, because it sits in an unheated annex where cold starts are harsher. When new, that oil gave 19.15 mm²/s at 65 °C, comfortably above the pump maker's preferred minimum of 16 mm²/s.

After eighteen months the unit began to whine on hot afternoons. Its oil report showed 41.4 mm²/s at 40 °C and 6.8 mm²/s at 100 °C. The laboratory flagged the 40 °C result as 10% low, at the bottom of the VG 46 band, but no one acted, because the oil was still within its grade. The fall at 100 °C was larger, 15%, the signature of polymer breakdown: the polymer had been contributing most of its effect at high temperature, and that is where its loss showed.

```figure
type: compare
title: The annex unit's high-index oil, new and after eighteen months
cols: At 40 °C | At 100 °C | At 50 °C | At 65 °C
rowhead: Oil
- New | 46.0 mm²/s | 8.0 mm²/s | 31.4 mm²/s | 19.2 mm²/s
- * After eighteen months | 41.4 mm²/s | 6.8 mm²/s | 27.7 mm²/s | 16.6 mm²/s
caption: This is an illustration. Walther relation through each pair of values. The sheared oil reaches the preferred minimum of 16 mm²/s at 66.2 °C instead of 71.2 °C.
```

A reliability engineer recalculated the oil's curve with the lubricant viscosity check from the two measured values. At 65 °C it now gave 16.6 mm²/s, a ratio of 1.04 to the preferred minimum, and it would reach 16 mm²/s at 66.2 °C instead of the 71.2 °C it had reached when new. The annex unit's hot afternoons took it past that point. The whine was the pump's leakage and cavitation rising as the film thinned.

The oil was changed, and the press shop changed its analysis rules: for a polymer-thickened oil, a fall in the 100 °C viscosity of more than 10% from the new oil's value now triggers a review even if the 40 °C value is still within its grade. The shop also asked its supplier for the oil's viscosity after the standard shear stability test, and now compares service results with that figure as well as with the fresh oil. Chapter 10 builds those rules into the shop's oil-condition limits.

## Bringing it together

Viscosity rises with pressure, by about 38% at HPU-40's 160 bar on the Barus relation, which reduces clearance leakage by about 15% below a constant-viscosity estimate and becomes enormous in loaded rolling contacts. Polymer-thickened oils lose viscosity at high shear, temporarily in the contact and permanently as their polymer breaks, and the permanent loss shows first at high temperature. Greases have a yield stress and a shear-dependent viscosity, and their base oil's viscosity governs lubrication. With these effects understood, the next chapter turns to how viscosity is measured and how to read the numbers a laboratory sends back.

## Exercise: pressure in the relief valve

HPU-40's relief valve passes oil from 175 bar to the tank line. Find the oil's viscosity at the valve's inlet relative to its outlet, using α = 2.0 × 10⁻⁸ 1/Pa, and the factor by which a laminar leakage estimate through the valve's poppet clearance, made with the outlet viscosity, overstates the real leakage.

**Worked answer.** This is an illustration. With Δp = 17.5 MPa, αΔp = 0.35. The inlet viscosity is exp(0.35) = **1.419** times the outlet viscosity, 42% higher. The leakage correction is (1 − exp(−0.35)) ÷ 0.35 = (1 − 0.7047) ÷ 0.35 = 0.844, so a constant-viscosity estimate overstates the leakage by 1 ÷ 0.844 = **1.185**, about 18%. At 50 °C, where the oil's atmospheric viscosity is 25.4 mPa·s, the inlet oil in the clearance is at about 36 mPa·s, close to its viscosity at about 42 °C at atmospheric pressure.
