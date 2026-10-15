---
title: "Designing against fatigue: why parts crack under loads they can easily carry"
description: "How fatigue cracks start and grow, S-N curves and endurance limits, the effects of mean stress, notches, surface finish and welds, and practical design rules that prevent fatigue failures."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - quality
  - product-development
author: "KEVOS"
featured: false
draft: false
---

Many mechanical failures share a puzzling feature: the part broke under a load it could carry easily. A bracket that supported its machine for two years cracks through. A shaft that passed every static calculation snaps at a shoulder. A welded frame on a vibrating screen develops cracks at the weld toes. Nobody overloaded anything. The cause is **fatigue**: the progressive growth of cracks under repeated loading, at stresses well below those needed to break the part in a single application.

Fatigue is responsible for a large share of mechanical failures in service, and it is often missed in design because static strength calculations look reassuring. It depends not only on how big the stresses are but on how they vary, how many times they repeat, where they concentrate and what condition the surface is in. Small details, such as a sharp corner, a rough surface, a weld toe or a keyway, can matter more than the overall size of the part.

This article explains, in general terms, how fatigue cracks start and grow, how fatigue strength is described, the effects of mean stress, notches, surface condition, residual stress and welding, how varying loads accumulate damage and the design and manufacturing practices that prevent fatigue failures. It is general information. Fatigue-critical designs, especially structures, pressure equipment and lifting equipment, require qualified engineers and the applicable standards.

## How fatigue happens

Fatigue failure usually has three stages:

1. **Crack initiation.** Repeated stress causes microscopic slip and damage at a point of high local stress, usually at the surface: a notch, scratch, corner, weld toe, inclusion or corrosion pit. A small crack forms.
2. **Crack growth.** With each cycle, the crack advances a tiny amount. Fracture surfaces often show **beach marks**, curved bands marking changes in loading or pauses, which point back to the origin.
3. **Final fracture.** When the remaining section can no longer carry the load, it breaks suddenly. The final fracture zone often looks rougher than the smoother crack growth region.

Because the crack grows slowly before final fracture, fatigue failures can sometimes be detected by inspection before they become catastrophic. Because initiation depends so heavily on local stress and surface condition, fatigue is controlled more by detail design and manufacturing quality than by bulk material strength.

## Describing fatigue strength

### S-N curves

Fatigue behaviour is commonly described by an **S-N curve**, which plots the stress amplitude or stress range against the number of cycles to failure, usually on logarithmic scales. Higher stresses cause failure in fewer cycles.

Two broad regimes are recognised:

- **Low-cycle fatigue**, at high stresses with some plastic deformation each cycle, leading to failure in relatively few cycles, typically up to the order of tens of thousands.
- **High-cycle fatigue**, at lower, largely elastic stresses, where parts endure millions of cycles or more. Most machine components operate in this regime.

### Endurance limits

Many steels show an apparent **endurance limit** or fatigue limit in laboratory tests: a stress amplitude below which failure does not occur even after very many cycles. Aluminium alloys and many other non-ferrous metals do not show a clear limit; their fatigue strength continues to fall with more cycles, so designs specify a fatigue strength at a stated number of cycles.

For preliminary estimates in steels, textbooks often approximate the laboratory endurance limit of polished specimens as roughly half the ultimate tensile strength for moderate-strength steels. Real components have much lower fatigue strength than polished laboratory specimens, as the following sections explain.

## Factors that reduce fatigue strength

### Notches and stress concentrations

Holes, shoulders, grooves, keyways, threads and sharp corners concentrate stress. The **theoretical stress concentration factor**, Kt, describes how much higher the local stress is than the nominal stress. Fatigue is somewhat less sensitive to notches than the theoretical factor suggests, particularly for softer materials and small notches; this is captured by a **notch sensitivity** factor, giving a **fatigue stress concentration factor**, Kf, between 1 and Kt.

Practical consequences:

- **Generous radii** at shoulders and corners greatly reduce Kt.
- **Smooth transitions** between sections spread stress.
- **Relief grooves** and stress-relieving notches can redistribute stress away from critical points.
- **Holes and keyways** should be placed away from regions of high stress where possible.

The [shafts, keys, couplings and alignment](/insights/shafts-couplings-and-alignment/) article discusses how keyways and shoulders affect shaft fatigue.

### Surface condition

Fatigue cracks usually start at the surface, so surface condition has a large effect. Rough machined, hot-rolled or forged surfaces have lower fatigue strength than ground or polished surfaces. Corrosion is particularly damaging: corrosion pits act as notches, and in corrosive environments some materials lose their endurance limit altogether.

### Size

Larger parts tend to have lower fatigue strength than small test specimens, because a larger stressed volume is more likely to contain a critical flaw.

### Residual stress

Residual stresses left by manufacturing can help or harm. **Compressive** residual stress at the surface, introduced by processes such as shot peening, surface rolling and some surface hardening treatments, delays crack initiation and growth. **Tensile** residual stress, such as that from welding, some machining and grinding damage, accelerates fatigue.

### Mean stress

Many components experience a cyclic stress on top of a steady stress, such as a rotating shaft carrying a constant axial load, or a bolt with preload. A tensile **mean stress** reduces the alternating stress a part can withstand. Several empirical relationships describe this interaction; the **Goodman** relationship, which links the alternating stress, the mean stress, the fatigue strength and the ultimate strength, is widely used and generally conservative for ductile materials. The [bolted joints that stay tight](/insights/bolted-joints-that-stay-tight/) article explains why preload reduces the alternating stress seen by bolts.

## Welded joints

Welds deserve special attention. The weld toe forms a geometric notch, welding introduces tensile residual stresses and small defects are common. As a result, the fatigue strength of welded joints depends mainly on the joint detail and the **stress range**, and much less on the strength of the steel. A high-strength steel does not give a welded detail much better fatigue life.

Structural design standards, including the Australian steel structures standard, classify welded details into categories with associated fatigue strengths, based on the stress range and number of cycles. Practical measures to improve weld fatigue include placing welds away from high-stress regions, avoiding intermittent welds and abrupt changes in section in fatigue-loaded areas, using full-penetration welds where needed, achieving smooth weld profiles and, for critical joints, post-weld treatments such as toe grinding or peening.

## Variable loading and cumulative damage

Real loads rarely repeat at a single constant amplitude. A vehicle chassis, a crane, a wind-exposed structure and a vibrating machine all experience a spectrum of stress cycles. Two tools help:

- **Cycle counting**, often using a method called rainflow counting, breaks a complex stress history into individual cycles of different ranges.
- **Cumulative damage rules**, of which the simplest is **Miner's rule**, add up the fraction of life consumed by each group of cycles. Failure is predicted when the sum reaches about one.

Miner's rule is a simplification and can be inaccurate, particularly for sequences of high and low loads, but it is widely used for estimates. Where fatigue matters, measured loads from strain gauges or accelerometers greatly improve predictions compared with assumed loads.

## A worked example

This is an illustrative example. The figures are hypothetical, and the factors used are textbook approximations chosen to show the reasoning. Real designs require appropriate data and standards.

A rotating steel shaft of 30 mm diameter has an ultimate tensile strength of 600 MPa and a machined surface. At a shoulder with a sharp fillet, the theoretical stress concentration factor is about 2.0, and the notch sensitivity is about 0.8. The nominal alternating bending stress is 80 MPa, and a steady axial load creates a nominal mean stress of 100 MPa.

**Estimating fatigue strength.** The polished-specimen endurance limit is approximated as 0.5 × 600 = 300 MPa. Applying typical textbook correction factors for a machined surface (about 0.83) and for a 30 mm diameter (about 0.86) gives an estimated component endurance limit of 300 × 0.83 × 0.86, or about 214 MPa.

**Applying the notch.** The fatigue stress concentration factor is Kf = 1 + 0.8 × (2.0 − 1), which is 1.8. The local alternating stress is 80 × 1.8 = 144 MPa, and the local mean stress is 100 × 1.8 = 180 MPa.

**Checking with Goodman.** The Goodman criterion sums the alternating stress divided by the endurance limit and the mean stress divided by the ultimate strength: 144 ÷ 214 + 180 ÷ 600 = 0.67 + 0.30 = 0.97. The factor of safety is the inverse, about 1.03. That is far too small for a shaft whose failure would stop a production line.

**Improving the detail.** Increasing the fillet radius reduces the theoretical factor to about 1.4, so Kf = 1 + 0.8 × 0.4 = 1.32. The local stresses become 80 × 1.32 ≈ 106 MPa alternating and 100 × 1.32 = 132 MPa mean. The Goodman sum is 106 ÷ 214 + 132 ÷ 600 ≈ 0.49 + 0.22 = 0.71, a factor of safety of about 1.4, with no change in material or diameter. Further improvements could come from a finer surface finish at the fillet or shot peening, which would raise the endurance limit.

## Design and manufacturing practices that prevent fatigue

- **Identify cyclic loads early.** Rotation, vibration, start-stop cycles, thermal cycles, pressure cycles and traffic all create fatigue loading.
- **Find the hot spots.** Fatigue cracks start at local peaks: shoulders, holes, weld toes, keyways, threads and sudden section changes.
- **Use generous radii and smooth transitions.**
- **Keep welds out of high-stress areas** and specify weld quality and profile where fatigue matters.
- **Control surface condition** on fatigue-critical surfaces: finish, protection from corrosion and avoidance of damage.
- **Use beneficial residual stress** through shot peening or rolling where justified.
- **Preload bolted joints** properly to reduce alternating stress in bolts.
- **Avoid fretting**, where small relative movement between clamped surfaces initiates cracks, by improving clamping or fit.
- **Measure real loads** for important designs rather than relying on guesses.
- **Plan inspection** for critical parts, so cracks are found while still small. Methods such as visual inspection, dye penetrant, magnetic particle and ultrasonic testing each suit different materials and locations.

## Reading a fatigue failure

When a part fails, the fracture surface tells a story. Look for:

- **the origin**, often at a surface feature, where beach marks converge;
- **beach marks**, showing progressive growth;
- **ratchet marks**, small steps that indicate multiple origins, often associated with higher stresses or a sharp stress concentration; and
- **the final fracture zone**, whose size relative to the crack growth area gives a clue to the stress level: a large final zone suggests high stress, a small one suggests lower stress acting over many cycles.

Preserve fracture surfaces carefully, as cleaning or fitting broken pieces together can destroy evidence. The [what engineering failures teach any business](/insights/what-engineering-failures-teach-a-business/) article shows how investigations turn failures into lasting lessons.

## How this applies to a small Australian business

- **Treat repeated loads as a design case**, not an afterthought.
- **Review details, not just sizes.** Radii, welds, holes and finishes decide fatigue life.
- **Investigate cracks properly.** A repaired crack without a root cause often returns.
- **Specify fatigue-critical features on drawings**, including radii, finishes and weld quality.
- **Use qualified engineering support** for fatigue-critical structures and equipment, and apply the relevant standards.
- **Inspect equipment exposed to vibration**, such as screens, conveyors and mobile plant, for early cracks.

## Common mistakes

- **Relying on static strength calculations alone.**
- **Sharp internal corners and small fillets** at shoulders.
- **Assuming high-strength steel fixes welded fatigue problems.**
- **Welding attachments onto highly stressed members** without considering fatigue.
- **Repairing cracks by welding without addressing the cause.**
- **Ignoring corrosion** in fatigue-loaded parts.
- **Using polished-specimen data** for rough or corroded components.

## Frequently asked questions

**Why did the part fail after years of service?** Fatigue damage accumulates with each cycle. A part can operate for a long time before a crack reaches critical size, especially if loads increased, corrosion developed or a new stress raiser was introduced.

**Can a fatigue crack be repaired?** Sometimes, but repairs must remove the crack completely and address its cause. Weld repairs introduce new residual stresses and defects and can make fatigue worse if done poorly.

**Does finite element analysis solve fatigue design?** It helps locate stress concentrations and estimate local stresses, but fatigue predictions still depend on accurate loads, appropriate fatigue data, surface and weld condition and sound engineering judgement. Analysis results at sharp corners and weld toes need careful interpretation.

## Questions to ask

- Which of our components experience repeated or vibrating loads?
- Where are the stress concentrations in those components?
- Are weld details and locations suitable for fatigue loading?
- Do our drawings specify radii, finishes and treatments that matter for fatigue?
- When parts crack, do we examine the fracture to find the origin and cause?

## Bringing it together

Fatigue causes parts to crack under loads they can easily carry once, because repeated stress grows cracks from local stress raisers over many cycles. Fatigue strength is reduced by notches, rough or corroded surfaces, size, tensile residual stress, mean stress and welding, and damage accumulates under varying loads. The most effective defences are in the details: generous radii, smooth transitions, careful weld placement and quality, good surface condition, beneficial residual stress, proper bolt preload and inspection of critical parts. As the worked example shows, a better fillet radius can transform fatigue life without changing material or size.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. Fatigue-critical designs require qualified engineers and applicable standards.*
