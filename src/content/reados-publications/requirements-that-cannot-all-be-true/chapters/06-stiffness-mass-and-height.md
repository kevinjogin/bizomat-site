---
book: requirements-that-cannot-all-be-true
chapterSlug: stiffness-mass-and-height
order: 6
title: "Stiffness, mass and height: proving that no beam can meet the specification"
description: "How a sag limit, a depth limit and a mass limit on one beam conflict through bending theory, how to prove no section of any shape meets all three, and how restating the purpose removes it."
draft: false
---

Some conflicts can be shown for the designs you have tried. A few can be shown for every design you could ever try. The beam that carries the inspection station's carriage is one of the second kind. Quality asked that the probe tip sag no more than 0.010 mm under the moving head. Maintenance asked that the beam be no deeper than 120 mm, to clear the hoist that loads the frames, and no heavier than 75 kg, the rated load of the existing uprights. Bending theory connects the three, and a short calculation shows that no steel or aluminium beam of any cross-section can satisfy them together.

This chapter makes that calculation, explains how to get past a tool whose input range does not reach the requirement, and then asks what the sag limit is for, which removes the conflict.

## The linking premise: beam deflection

This is an illustration. The beam spans 1,600 mm between the two uprights, which support it at its ends. The carriage, probe head and cabling weigh 60 kg, a load of 588.6 N, and the worst position for sag is mid-span. For a simply supported beam with a central point load, the mid-span deflection is PL³ ÷ 48EI.

Everything in that expression is fixed except I, the second moment of area of the beam's cross-section. To keep the sag to 0.010 mm, the beam needs

I = PL³ ÷ (48 E δ) = 588.6 × 1,600³ ÷ (48 × 206,000 × 0.010) ≈ 2.44 × 10⁷ mm⁴.

The second moment of area depends on how much material the section has and how far it lies from the neutral axis. Mass limits the first; depth limits the second. That is the whole conflict, in one line of algebra.

## A tool whose range stops short of the requirement

The [beam sizing tool](/tools/beam-sizing/) in BIZOMAT Tools calculates the section a beam needs for a uniform load and a point load together: the maximum bending moment, the section modulus for an allowable stress, the second moment of area for a deflection limit expressed as the span divided by a number, and the utilisation of a section you choose. Its limitations are stated: it assumes an elastic, laterally restrained beam, and it does not check shear or local bearing at supports and loads.

The deflection limit field accepts values from span ÷ 50 to span ÷ 5,000, the range that covers floors, frames and most machine structures. The inspection station's requirement is 1,600 mm ÷ 0.010 mm, or span ÷ 160,000, thirty-two times stiffer than the tool's tightest setting. That is not a fault in the tool. It is a sign that the requirement lies well outside ordinary structural practice, which is itself worth noticing.

The engineer runs the tool at span ÷ 5,000 and scales the result. Required I is inversely proportional to allowed deflection, so the required I at 0.010 mm is 32 times the required I at 0.32 mm.

```figure
type: formula
title: Required stiffness for 0.010 mm sag, scaled from the tool
formula: I_required(0.010 mm) = I_required(span ÷ 5,000) × (0.32 ÷ 0.010)
caption: This is an illustration. The beam sizing tool's tightest deflection limit is span ÷ 5,000, here 0.32 mm. Scaling its result by 32 gives the stiffness the requirement demands.
- Span | 1,600 mm, simply supported
- Load | 588.6 N at mid-span (60 kg head); self-weight left out for now
- Tool result at span ÷ 5,000 | required I = 761,942 mm⁴, allowed deflection 0.32 mm
step: 761,942 mm⁴ × 32 = 24,382,136 mm⁴, about 2.44 × 10⁷ mm⁴
step: Check by hand: 588.6 × 1,600³ ÷ (48 × 206,000 × 0.010) = 2.44 × 10⁷ mm⁴
```

Scaling a tool's output is legitimate only when the relationship is known to be linear in the scaled quantity, as it is here. The hand check confirms it. A chapter that linked the tool as if it could take span ÷ 160,000 directly would be misdescribing it.

## The proof that no section can do it

The engineer could now try section after section from a steel catalogue. Instead she asks a sharper question: what is the largest I that any section of 120 mm depth and 75 kg could possibly have?

A beam of 75 kg over 1,600 mm, in steel at 7,850 kg/m³, has a cross-sectional area of at most 75 ÷ (1.6 × 0.00785) ≈ 5,971 mm². The second moment of area is the sum of each bit of area times the square of its distance from the neutral axis. With a depth of 120 mm, no material can be more than 60 mm from the axis. So the largest possible I, putting every square millimetre at the very top and bottom, is

I_max = 5,971 × 60² ≈ 2.15 × 10⁷ mm⁴.

That is less than the 2.44 × 10⁷ mm⁴ required. No real section reaches the ideal, because flanges have thickness and webs carry material near the axis. So no steel beam of any cross-section, of 120 mm depth and 75 kg, can keep the sag to 0.010 mm. The proof covers every shape at once, including ones nobody has thought of.

```figure
type: bars
title: Stiffness available against stiffness required
unit: × 10⁶ mm⁴
caption: This is an illustration. Even an ideal section with all its material at the top and bottom faces falls short. Real sections within both limits fall further short; a solid 120 mm square bar is stiffer than any of them but weighs about 181 kg.
- Required for 0.010 mm sag | 24.38
- Ideal 120 mm deep, 75 kg section (upper bound) | 21.50
- Solid steel bar 120 × 120 mm, 181 kg | 17.28
- RHS 200 wide × 120 deep × 10 mm, 75.4 kg | 13.80
- * RHS 200 wide × 120 deep × 8 mm, 61.1 kg | 11.55
- RHS 120 × 120 × 10 mm, 55.3 kg | 8.95
```

### Would a different material help?

The obvious escape is a lighter, stiffer material. Aluminium is lighter, but less stiff in proportion: its modulus is about a third of steel's, and so is its density. A 75 kg aluminium beam can have about 17,361 mm² of area, so its ideal I at 120 mm depth is about 6.25 × 10⁷ mm⁴. But with a modulus of 69 GPa it needs 206 ÷ 69 times the steel figure, about 7.28 × 10⁷ mm⁴. It falls short by a similar proportion.

This is a general result. For a beam limited by mass and depth, what matters is the ratio of modulus to density, the specific stiffness, and steel and aluminium have nearly the same ratio. Granite, often used for measuring machines, has a lower one. Only materials with a much higher specific stiffness, such as carbon-fibre composites, change the answer, and they bring their own costs, lead times and thermal behaviour. For the builder's purposes, the impossibility is general.

## Bounds as a method

The upper bound is worth using whenever a conflict involves a quantity that geometry or physics caps. The method has three steps: find the limit that no design can exceed, compute it from the constraints alone, and compare it with what the requirement needs. If the requirement lies beyond the bound, the conflict is proved for every design in the class at once. If it lies inside, the bound proves nothing, and real designs must be tried.

The bound used here is crude, and that is its strength. It ignores flange thickness, webs, corner radii and the rail bolted to the top of the beam, all of which make real sections worse. Because every simplification favours the requirement, a requirement that fails the crude bound fails every refinement of it. The engineer does not need to argue about which catalogue section is best. She needs only to show that the best imaginable section is not good enough.

The same reasoning applies elsewhere in this book. Critical speed rises with root diameter, so for a given length and speed there is a smallest diameter that can work, whatever the maker; Chapter 3 found it was larger than the budget allowed. Thermal growth over a length is fixed by the expansion coefficient and the temperature difference, whatever the mechanism; Chapter 5 found that only a design measuring position directly could escape it. In each case the bound came from a law that no design can avoid, applied to constraints that no design can change.

A bound works in the other direction too. When the bound is close to the requirement, as in this chapter's exercise, it warns that real designs will be marginal and that small details will decide the result. That is the point at which an engineer should ask whether the requirement can be restated before spending time on the details.

## The boat that carries its builder

Chapter 1 mentioned the puzzle that Patrick Grim borrows from J. L. Cowan: a boat that must carry its builder and be carried by its builder. This beam is the same problem in steel. Stiffness wants material, and material far from the axis. The uprights' rating forbids the material; the hoist forbids the distance. Each requirement is reasonable. Together, they ask for a section that geometry does not allow.

What makes the beam a useful example is that the proof does not depend on the designer's skill or catalogue. It is a bound. When a conflict can be shown with a bound, the conversation with the customer changes: there is no point asking the builder to try harder.

## Ask what the sag limit is for

The engineer asks the customer's quality engineer why the tip must not sag more than 0.010 mm. The answer is that the probe measures hole positions in the plane of the frame, and the quality engineer assumed that sag would tilt the probe and shift its reading. That is true, but it matters only if the sag is unknown. A beam sags by the same amount every time the head reaches the same position, if the beam, its supports and the head do not change. A sag that repeats can be measured once and corrected in the control.

The purpose is therefore not "no sag" but "no unknown sag". That changes the requirement from a stiffness to a repeatability. The rewritten R6 becomes: "Probe tip position, after correction for the mapped sag of the beam, repeatable within 0.002 mm anywhere on the travel, verified by a mapping run and a verification run."

With that requirement, the conflict disappears. The engineer chooses a 200 × 120 × 8 mm rectangular hollow section. It weighs 61.1 kg, inside the 75 kg limit, and is 120 mm deep. Under the moving head it sags 21.1 µm at mid-span, and under its own weight another 13.4 µm, both of which are mapped. The beam sizing tool, run at its tightest limit with the section entered, reports the section adequate, at 3% utilisation in strength and 11% in deflection, including self-weight.

```figure
type: compare
title: The sag requirement as written and as restated
cols: As written | Restated from its purpose
caption: This is an illustration. Restating the purpose removes the conflict and makes the requirement testable.
- What is limited | Deflection under the moving head | Unknown deflection after correction
- Value | 0.010 mm | 0.002 mm repeatability
- Can a 120 mm, 75 kg beam meet it? | No section can | Yes: 200 × 120 × 8 mm RHS, 61.1 kg
- How it is tested | Not stated | Mapping run, then verification run
- What it now depends on | Stiffness alone | Stable supports, a stable head and a periodic check
```

### What the restated requirement now depends on

Correction works only while the sag is the same as when it was mapped. That makes new things important. The beam's supports must not slip, settle or loosen. The head's mass must not change, for instance when a heavier probe is fitted. And the map must be checked periodically, so that a change is caught. The rewritten requirement lists these as conditions, and the maintenance schedule includes an annual verification run.

## The failure case: a map that went stale

This is an illustration. The builder used sag mapping on an earlier gantry and learned what it depends on. The beam was bolted to its uprights through slotted holes, to allow alignment during installation. The map was made at commissioning and verified. Six months later the customer reported drift at one end of the travel. A support bolt had loosened during a hoist collision, the beam had slipped by a fraction of a millimetre in its slots, and the sag profile had changed. The map no longer described the beam.

### How it is detected and corrected

The failure is detected by a verification run against a reference artefact, scheduled and also triggered by any knock to the structure. The correction on that job was to dowel the beam to its uprights after alignment, so that it could not slip, and to add the verification run to the annual shutdown. The general rule: a requirement that relies on correction must also require the stability that makes the correction valid, and a check that shows when it is not.

## Exercise: a shorter beam

A smaller station has a 1,200 mm span, a 40 kg head (392.4 N), and the same 0.010 mm sag limit, uncorrected. The beam must be no deeper than 100 mm and no heavier than 40 kg.

1. What I does the sag limit require? Use the beam sizing tool at its tightest setting and scale the result.
2. Is the set of requirements impossible for every steel section, as the main case was?
3. Find a rectangular hollow section that meets all three.

**Worked answer.**

1. At span ÷ 5,000 (0.24 mm), the tool gives a required I of 285,728 mm⁴. Scaling by 0.24 ÷ 0.010 = 24 gives about 6.86 × 10⁶ mm⁴, which the hand formula PL³ ÷ 48Eδ confirms.
2. No. A 40 kg steel beam over 1.2 m can have about 4,246 mm² of area. At 100 mm depth, its ideal I is 4,246 × 50² ≈ 1.06 × 10⁷ mm⁴, above the requirement. The bound does not prove impossibility, so the question must be settled by trying real sections.
3. A 150 × 100 × 8 mm section has an I of about 5.88 × 10⁶ mm⁴: too flexible, with a sag of 11.7 µm. A 200 × 100 × 8 mm section is stiff enough at 7.58 × 10⁶ mm⁴ but weighs 42.8 kg. A 180 × 100 × 8 mm section, if available, has an I of about 6.90 × 10⁶ mm⁴, a sag of 9.9 µm and a mass of 39.8 kg, meeting all three with almost no margin. That narrow margin is a warning. Before committing, check self-weight sag, the rail's mass and the real section's corner radii, any of which could tip it over, and ask whether the sag could be mapped instead.
