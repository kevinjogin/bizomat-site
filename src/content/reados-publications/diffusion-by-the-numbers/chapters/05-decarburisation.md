---
book: diffusion-by-the-numbers
chapterSlug: decarburisation
order: 5
title: "Losing carbon: decarburisation during reheating"
description: "Calculate how far carbon is lost from DS-40's case when it is reheated in an atmosphere that is too lean, how quickly the soft layer grows, what grinding can and cannot remove, and how to prevent it."
draft: false
---

Diffusion does not care which way the carbon goes. Hold a carburised surface in an atmosphere whose carbon potential is lower than the steel's, and carbon diffuses out as readily as it went in. The result is **decarburisation**: a surface layer with less carbon than intended, which hardens to a lower hardness, wears faster and has poorer fatigue strength than the case beneath it. It often happens unnoticed, during the reheat for hardening, in a furnace with a leak, or in a forge, and it is invisible until someone measures the surface hardness or sections a part.

This chapter applies the error-function solution in reverse to DS-40's case during the reheat for hardening, calculates how deep the carbon loss reaches for different times, compares the depth with the grinding allowance, shows how a protective atmosphere prevents it, and checks surfaces for it. The failure case is a furnace door seal that let air into the hardening furnace.

## The same equation, the other way

For a surface held at a carbon content C_s lower than the steel's uniform carbon C_i, the error-function solution of Chapter 2 becomes **C(x) = C_s + (C_i − C_s) × erf(x ÷ (2√(Dt)))**. At the surface, the carbon is C_s; deep inside it is unchanged at C_i; in between it rises along the error-function curve. The depth over which carbon is lost again scales with √(Dt).

DS-40 is reheated to about **850 °C** for hardening after carburising, where carbon in austenite has a diffusion coefficient of about **3.0 × 10⁻¹² m²/s**, from the Arrhenius law of Chapter 3. Near the surface, its carburised case holds about **0.80%** carbon. If the reheat atmosphere were lean enough to hold the surface at only **0.10%**, carbon would diffuse out. The calculation treats the first few tenths of a millimetre of the case as uniform at 0.80%, a reasonable approximation because the case's own profile changes slowly near the surface compared with the steep decarburised profile.

## How deep the loss reaches

A useful measure of damage is the depth to which carbon falls below some level that matters for hardness; this book uses **0.70%**, taking the near-surface case's intended 0.80% as the reference. With C_s = 0.10% and C_i = 0.80%, carbon is 0.70% where erf(z) = (0.70 − 0.10) ÷ (0.80 − 0.10) ≈ 0.857, so **z ≈ 1.036**, and the depth is **x ≈ 2.07 √(Dt)**.

```figure
type: compare
title: Decarburisation of DS-40's case in a lean atmosphere at 850 °C
cols: √(Dt) | Depth below 0.70% carbon | Carbon at 0.025 mm | Carbon at 0.05 mm
caption: This is an illustration with the surface held at 0.10% and D ≈ 3.0 × 10⁻¹² m²/s. Even a quarter of an hour strips the outermost layer to about a third of its intended carbon; an hour takes the 0.70% boundary to about 0.22 mm.
- 15 minutes | about 0.052 mm | about 0.11 mm | about 0.29% | about 0.45%
- 30 minutes | about 0.074 mm | about 0.15 mm | about 0.23% | about 0.36%
- *1 hour | about 0.104 mm | about 0.22 mm | about 0.19% | about 0.29%
- 2 hours | about 0.147 mm | about 0.31 mm | about 0.17% | about 0.23%
```

Two features stand out. First, the outermost layer is ruined quickly: within 15 minutes, the carbon a few hundredths of a millimetre deep has fallen to well below half its intended value. Second, the damage grows with √t like every diffusion process: doubling the time deepens it by √2.

### Temperature makes it worse

The Arrhenius law applies here as it did to carburising. After an hour in the same lean atmosphere, the 0.70% boundary would sit at about **0.15 mm** at 800 °C, **0.22 mm** at 850 °C and **0.30 mm** at 900 °C. A hardening reheat run hotter than necessary, or held longer while a late load is prepared, does disproportionate damage if the atmosphere is not right. The lowest hardening temperature that gives the required structure is also the one that limits decarburisation.

### Why a soft skin matters

A decarburised skin a tenth of a millimetre deep sounds trivial beside a 0.8 mm case, but it sits exactly where the case does its work. Wear acts at the surface, so a soft skin wears quickly until the harder case beneath is exposed, by which time fits and clearances have changed. Fatigue cracks in bending and torsion usually start at the surface, and a carburised case resists them partly because it is in compression after hardening; a low-carbon skin transforms differently, carries less compressive stress or even tension, and gives cracks an easy start. Contact fatigue on bearing surfaces is driven by stresses just below the surface, within the first few tenths of a millimetre, where a decarburised layer also lowers strength. For DS-40, whose bearing diameters and splines carry rolling and sliding contact, a soft skin defeats much of the purpose of carburising.

## Can grinding remove it?

DS-40's bearing diameters are ground after hardening, with **0.05 mm** of stock per side. That removes only the outermost layer. After a one-hour reheat in the lean atmosphere, carbon at 0.05 mm depth would still be only about **0.29%**, and the newly exposed ground surface would harden to far below the intended case hardness. To grind below the 0.70% boundary would need about **0.22 mm** per side, more than four times the allowance, which would itself remove a quarter of the effective case.

The arithmetic here repeats Chapter 4's point about grinding from the other side. There, grinding removed good case and had to be paid for in furnace time; here, the case has been damaged from the outside and grinding cannot reach deep enough to remove the damage without removing too much case with it. In both directions, the surface layer of a carburised part is too valuable to be treated as an allowance.

Grinding is not a cure for decarburisation; preventing it is. Surfaces that are not ground at all, such as DS-40's spline flanks after finish machining, keep whatever decarburised layer the reheat left, at the surface where the contact stresses are highest.

## Preventing it: atmosphere and time

Decarburisation is prevented by controlling the boundary condition. Neutral salt baths, vacuum furnaces and inert gas were all used for that purpose historically; for an atmosphere furnace, the practical tool is the carbon potential. If the reheat atmosphere's carbon potential is held close to the surface carbon of the case, the surface neither gains nor loses carbon, and the profile stays as carburised. DS-40's heat treater reheats in an endothermic atmosphere controlled to a carbon potential of about **0.80%**, matching the case, and keeps the time at temperature to what the parts need to heat through.

A partly lean atmosphere does partial damage. If the potential drifted to **0.60%**, the 0.70% boundary would sit at about **0.10 mm** after an hour: much less than in the lean case, but still deeper than the 0.05 mm grinding allowance. The calculation shows how closely the potential must be held for a given grinding allowance and time. Working backwards, the heat treater can find the lowest potential, for DS-40's reheat time, that keeps the 0.70% boundary within the 0.05 mm allowance, and set the controller's alarm a margin above it.

```figure
type: checklist
title: DS-40's controls against decarburisation
caption: This is an illustration of the heat treater's controls. Each one addresses either the boundary condition, the carbon potential, or the time at temperature.
- x Reheat atmosphere controlled to match the case carbon | carbon potential set and logged
- x Furnace sealed and purged before parts enter | door seals inspected; purge time recorded
- x Time at temperature limited to heat-through plus a margin | load thermocouple used
- x Bar stock decarburised skin machined off before carburising | turning allowance on the drawing
- ? Surface hardness checked after hardening on every batch | file test and a hardness reading on a coupon
```

## Other sources of decarburisation

Reheating for hardening is one source. Others include:

- **hot rolling and forging**, which leave a decarburised skin on bar and forgings, normally removed by the first machining cut;
- **open-flame heating** for straightening or local hardening, where the flame's oxidising zone strips carbon;
- **long tempering** at higher temperatures in air for some steels, although at typical carburised-case tempering temperatures carbon diffusion is too slow for significant loss.

The mill skin deserves a number. Hot-rolled bar is rolled at well over 1,000 °C in air, with the surface stripped of carbon throughout, and may carry a decarburised layer a few tenths of a millimetre deep. If DS-40's bar arrived with a 0.3 mm skin and the turning allowance left 0.1 mm of it, the carburising cycle would start from a surface whose carbon was below the core's, and the case at that spot would come out shallower than the model predicts, by roughly the thickness of skin left. DS-40's drawing specifies a minimum turning allowance on the bar diameter for exactly that reason, and the bar's certificate is checked for the mill's stated decarburisation limit.

Each follows the same arithmetic: a lower surface potential, a temperature that sets D, and a time that sets √(Dt). The temperature matters most, through the Arrhenius law: at 750 °C, D is several times smaller than at 850 °C, so the same time does far less damage.

## The opposite fault: a surface that gains too much

The same boundary condition can fail the other way. If the reheat atmosphere's potential is set well above the case's surface carbon, carbon diffuses in during the reheat, raising the surface carbon beyond the intended value and, at edges, towards the carbide-forming limit of Chapter 4. On hardening, an over-rich surface can retain soft austenite, lowering surface hardness in a way that a file test cannot distinguish from decarburisation. A microhardness traverse shows the difference, and a carbon analysis of a coupon settles it. The atmosphere set point for the reheat is therefore matched to the case, not simply set "rich to be safe".

## Detecting it

A decarburised surface looks normal. It is found by measuring:

- a **file test** on a hardened surface: a hard case resists a file; a decarburised one lets the file bite;
- a **surface hardness reading** on a test coupon or a sacrificial part, compared with the hardness specified for the case surface;
- a **microhardness traverse** on a section, starting very close to the surface, which shows hardness rising from a soft skin to the case value;
- a **metallographic section**, etched to show the lighter, lower-carbon structure at the surface.

The traverse used for case depth will show decarburisation only if it starts close enough to the surface; one whose first reading is 0.1 mm deep can miss a skin thinner than that. DS-40's traverse procedure starts at 0.03 mm.

## A failure case: a leaking furnace door

This is an illustration. In a hardening furnace used for shafts like DS-40, the door seal had worn, and air leaked into the working zone, lowering the carbon potential near the door. The controller's probe, positioned at the back of the furnace, read normally.

After grinding, a batch of shafts from the front of the load showed surface hardness several points below the specification on the routine check of every batch, while shafts from the back of the load were correct. The detection came from that routine check and from the pattern by load position. A microhardness traverse on a front shaft found a soft layer about 0.15 mm deep, consistent with about half an hour at 850 °C in a lean atmosphere, according to the calculation in this chapter.

The batch was quarantined. Because the decarburised layer was deeper than the grinding allowance, the shafts could not be saved by grinding; the heat treater proposed a carbon restoration cycle, a re-heat at a controlled potential to put the carbon back, followed by re-hardening, calculated with the same diffusion model and confirmed on coupons placed at the front of the load.

```figure
type: compare
title: Restoring carbon after 30 minutes of decarburisation at 850 °C
cols: Carbon at 0.025 mm | at 0.05 mm | at 0.10 mm | at 0.15 mm
caption: This is an illustration from a numerical solution of Fick's second law: 30 minutes at 850 °C with the surface at 0.10%, then a restoration hold at 850 °C with the surface at 0.80%. Restoring the layer the grinding will expose takes longer than the damage took, because carbon must diffuse back in against the depleted profile.
- After decarburising | 0.23% | 0.36% | 0.56% | 0.70%
- After 42 minutes of restoration | 0.77% | 0.75% | 0.72% | 0.71%
- *After 83 minutes of restoration | 0.79% | 0.78% | 0.76% | 0.75%
```

Thirty minutes of damage needed about 40 minutes of restoration to bring the carbon at the ground surface, 0.05 mm deep, back to 0.75%, and over 80 minutes to restore the whole depleted layer to that level. The restoration is a diffusion problem with a non-uniform starting profile, so the error-function formula cannot be used directly; the step-by-step model of Chapter 4 handles it, starting from the decarburised profile. The door seal was replaced, and a second probe or regular shim checks near the door were added to the furnace's routine.

## How this applies to a small Australian business

Treat decarburisation as diffusion in reverse, and calculate its depth with the error function and √(Dt). Control the reheat atmosphere to match the surface carbon, keep time at temperature short, and maintain furnace seals. Remove mill and forge decarburisation by machining before carburising. Do not rely on grinding to remove decarburised layers deeper than the grinding allowance. Check surface hardness on every batch, start traverses close to the surface, and look for patterns by load position when results vary.

## Exercise: a shorter reheat

If DS-40's reheat at 850 °C in the lean 0.10% atmosphere had lasted only **20 minutes**, how deep would the 0.70% boundary be? Would the 0.05 mm grinding allowance remove it?

**Worked answer.** In 20 minutes, √(Dt) is about **√(3.0 × 10⁻¹² × 1,200) ≈ 0.060 mm**, so the 0.70% boundary is at about **2 × 1.036 × 0.060 ≈ 0.12 mm**. That is more than twice the 0.05 mm grinding allowance, so grinding would not remove it. Even a short exposure to a lean atmosphere at hardening temperature leaves a soft layer deeper than a typical finishing allowance.
