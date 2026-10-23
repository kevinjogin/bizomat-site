---
book: gears-by-the-numbers
chapterSlug: tooth-bending-strength
order: 8
title: "Tooth bending strength"
description: "Screen tooth root bending stress with the Lewis equation and a velocity factor, and see why modern rating methods add many more factors."
draft: false
---

A gear tooth is a short, thick cantilever. Every time it carries load, it bends at its root, and if the bending stress is too high the tooth eventually cracks there and breaks off. Bending fatigue is one of the two main ways gear teeth fail; the other, surface fatigue, is the subject of Chapter 9.

In 1892, Wilfred Lewis presented to the Engineers' Club of Philadelphia a way of estimating that root stress. His equation is still taught as the starting point for gear strength, and it remains a useful screening tool. This chapter applies it to the conveyor pair and explains what modern methods add.

## The forces on the tooth

From Chapter 1, the pinion carries 19.90 N·m. The tangential force at the pitch circle is:

**Fₜ = 2 × T / d = 2 × 19.90 / 0.060 ≈ 663.2 N**

With the 20° pressure angle, the radial force is about 663.2 × 0.364 ≈ 241.4 N and the normal force about 705.8 N. The Lewis method uses the tangential component, which does the bending.

## The Lewis equation

Lewis modelled the tooth as a cantilever of uniform strength, loaded at its tip, and found that the bending stress depends on the load, the face width, the tooth size and a factor describing the tooth shape. In module form:

**σ = Fₜ / (b × m × Y)**

where b is the face width, m the module and Y the **Lewis form factor**, which depends on the number of teeth and the tooth system. Values for 20° full-depth teeth are tabulated in standard texts; the reference used here is chapter 14 of *Shigley's Mechanical Engineering Design*, which gives Y ≈ 0.322 for 20 teeth and Y ≈ 0.422 for 60 teeth.

For the conveyor pinion, with b = 30 mm and m = 3 mm:

**σ = 663.2 / (30 × 3 × 0.322) ≈ 663.2 / 28.98 ≈ 22.9 MPa**

## Where the Lewis form factor comes from

Lewis's insight was geometric. A cantilever whose depth varies as a parabola from its loaded tip has the same bending stress at every section. He drew such a parabola inside the tooth profile, with its vertex where the load line crosses the tooth centreline and its sides touching the root fillets. The tooth is stronger than the parabola everywhere except at the two points of tangency, so the stress at those points is the tooth's critical root stress.

For a cantilever of face width b, root thickness t and load height l, the bending stress at the root is 6 × Fₜ × l / (b × t²). The parabola links l and t through a length x, measured along the centreline, so that t² / 4 = x × l. Substituting:

**σ = 3 × Fₜ / (2 × b × x)**

Lewis then expressed x as a fraction of the tooth size. In module form, the form factor is:

**Y = 2 × x / (3 × m)**

For the conveyor pinion, Y ≈ 0.322 at module 3 corresponds to x ≈ 1.5 × 0.322 × 3 ≈ 1.45 mm. The factor depends only on the tooth shape, which is why it can be tabulated against tooth number for a given tooth system. Teeth with more teeth per gear have thicker roots relative to their height, so Y rises with tooth number towards the rack value.

## Allow for speed

Gears running at speed carry extra dynamic load from small errors in tooth spacing and profile. Lewis's method was later combined with velocity factors derived from tests. For cut or milled profiles, Shigley gives, in SI units with pitch-line velocity V in metres per second:

**Kᵥ = (6.1 + V) / 6.1**

The pinion's pitch-line velocity is:

**V = π × d × n / 60,000 = π × 60 × 1,440 / 60,000 ≈ 4.524 m/s**

so

**Kᵥ = (6.1 + 4.524) / 6.1 ≈ 1.742**

and the screened bending stress becomes:

**σ = Kᵥ × Fₜ / (b × m × Y) ≈ 1.742 × 22.9 ≈ 39.9 MPa**

The 60-tooth gear, with Y ≈ 0.422, sees **663.2 / (30 × 3 × 0.422) ≈ 17.5 MPa** before the velocity factor and about **30.4 MPa** after it. The pinion's teeth, narrower at the root, carry the higher bending stress, as is usual.

```figure
type: bars
title: Screened tooth bending stress, conveyor pair
unit: MPa
max: 45
caption: Lewis equation with a cut-profile velocity factor of 1.742. A screening estimate, not a rating.
- Pinion, static | 22.9
- *Pinion, with velocity factor | 39.9
- Gear, static | 17.5
- Gear, with velocity factor | 30.4
```

## Counting the load cycles

Bending fatigue depends on the number of times each tooth is loaded, not only on the stress. Each tooth on the pinion is loaded once per revolution, so a pinion turning at 1,440 rpm loads each tooth 86,400 times an hour.

This is an illustration. If the conveyor runs 8 hours a day, 250 days a year, for 10 years, that is 20,000 hours:

- **Pinion:** 1,440 × 60 × 20,000 ≈ **1.73 × 10⁹** cycles per tooth
- **Gear:** 480 × 60 × 20,000 ≈ **5.76 × 10⁸** cycles per tooth

```figure
type: bars
title: Load cycles per tooth over 20,000 hours
unit: millions of cycles
max: 1800
caption: The pinion's teeth are loaded three times as often as the gear's, one more reason the pinion usually governs.
- *Pinion, 1,440 rpm | 1728
- Gear, 480 rpm | 576
```

The pinion's teeth see three times as many cycles as the gear's at a higher stress, so the pinion governs bending life in almost every reduction pair. Modern rating methods use the cycle count to adjust the allowable stress through a life factor, taken from material test data. In very long lives, such as this one, the allowable stress is lower than for a short-life application, and the full rating should be done for the cycles the drive will actually see.

## Overloads from the motor and the machine

The torque used so far is the steady running value. Real drives see more. An induction motor started direct on line can produce a starting torque well above its rated torque, and its data sheet states the figure. A conveyor started under full load, or jammed by an obstruction, can drive the torque up to whatever the motor or a protective device allows.

This is an illustration. If the motor's starting torque were twice its rated value, the pinion's static bending stress at start would be about 2 × 22.9 ≈ 45.8 MPa. The velocity factor at start is close to one, because the speed is near zero, so the screened stress at start is similar to the running value of 39.9 MPa. Those are occasional peaks, not the steady cycling of every revolution, but repeated daily starts over ten years add thousands of high-load cycles.

Modern methods handle this with an **application factor**, chosen according to the character of the driving and driven machines, from uniform to heavy shock, and by checking the gears separately against peak loads. A conveyor carrying lumpy material, a crusher or a reciprocating compressor needs a larger factor than a fan. Where peak torques are severe, a torque limiter or a soft starter protects the gears more cheaply than larger teeth would.

## What the Lewis method leaves out

Lewis's equation assumes the full load acts at the tip of a single tooth, ignores the stress concentration at the root fillet, ignores the compressive effect of the radial force and treats the tooth as perfectly made and aligned. Shigley notes that, with adequate contact ratio and accuracy, the tip-load case is not actually the worst, and that the highest stress usually occurs when one pair of teeth carries the whole load near the middle of the tooth.

Modern rating methods, such as those published by AGMA and in ISO 6336, retain Lewis's cantilever idea but add factors for root geometry and stress concentration, load sharing, dynamic effects tied to gear accuracy, misalignment and load distribution across the face, overloads from the driven machine, size effects, material quality, reliability and life. Their allowable stresses come from tested material data at a stated number of cycles.

The practical consequence is clear. A low Lewis stress is encouraging; it shows the teeth are not grossly undersized. It is not a rating. A drive that matters needs a calculation to a recognised method, with the supplier's material data, or a supplier's own rating for the gears.

```figure
type: tree
title: What a modern rating adds to Lewis
caption: The cantilever idea survives; each factor corrects one of its simplifications.
- Bending rating
  - Root stress concentration | fillet geometry
  - Load sharing | contact ratio and accuracy
  - *Dynamic factor | tied to accuracy grade and speed
  - Load distribution | alignment across the face
  - Application factor | shocks from the driven machine
  - Material and life | tested allowable stress
```

## The rim under the teeth

The Lewis equation assumes the tooth sits on a solid body. A gear with a thin rim, between the tooth roots and a bore or web, can flex as a whole, and the crack may then run through the rim rather than across a tooth. AGMA's method addresses this with a rim thickness factor, applied when the rim beneath the roots is less than about 1.2 times the whole depth of the tooth.

For the conveyor pair, the whole depth is 6.75 mm, so a rim of at least about 8.1 mm below the root circle avoids that correction. The 172.5 mm root diameter of the gear therefore suits a web or bore that leaves at least that thickness. For the pinion, whose root diameter is 52.5 mm, the same rule sets the largest bore that can be used without reducing bending strength, before allowing for keyways, which cut into the rim locally and need their own check.

## How a bending failure looks

A tooth that fails in bending fatigue usually breaks off at the root, often taking the whole tooth with it. The fracture surface tells the story. A fatigue crack starts at the root fillet on the side where the tooth is loaded in tension, then grows across the tooth with each cycle, leaving curved **beach marks** on the surface centred on the origin. The last part to break, when the remaining section can no longer carry the load, shows a rougher, fibrous texture.

That pattern distinguishes fatigue from overload. A tooth broken by a single overload, such as a jam or a foreign object passing through the mesh, has a rough fracture across its whole section and no beach marks. A fatigue break points to a design, material or alignment problem; an overload break points to the event that caused it. Mapping the origin also helps: a crack starting at one end of the face suggests misalignment concentrating load there, as described in Chapter 4.

## Root fillet and surface condition

Because bending fatigue cracks start at the root fillet, the condition of that fillet matters greatly. A larger fillet radius lowers the stress concentration, which is why some tooth systems and cutting tools specify a full root radius. Scratches, grinding notches, decarburised surfaces and pits from corrosion in the fillet all shorten fatigue life. Processes that put the surface into compression, such as shot peening after heat treatment, lengthen it. These effects appear in modern ratings as factors for notch sensitivity and surface condition, and on the drawing as requirements for the root form, the surface finish and any peening.

## Using the screen to compare options

Where the Lewis method shines is in comparing alternatives quickly. Chapter 3 proposed a module 2.5 pair with 24 and 72 teeth on the same centre distance. The tangential force is unchanged, because the pitch diameters are the same. With Y ≈ 0.337 for 24 teeth:

**σ = 663.2 / (30 × 2.5 × 0.337) ≈ 26.2 MPa**, or about **45.7 MPa** with the same velocity factor.

The finer pitch gives about 15% more bending stress in the pinion than module 3. It runs with a slightly higher contact ratio, as Chapter 4 showed, so it may be quieter. Whether the trade is acceptable depends on the margin the full rating shows.

## Face width as a lever, with a catch

The Lewis stress is inversely proportional to the face width, so widening the face looks like the easiest way to lower it. Increasing the conveyor pinion's face from 30 mm to 36 mm would reduce the screened stress in proportion, from 39.9 MPa to about 33.3 MPa, without changing the module, tooth numbers or centre distance.

The catch is alignment. The equation assumes the load spreads evenly across the whole face. A wider face is more sensitive to shaft deflection, bearing clearance and housing errors, so the load tends to concentrate at one end. Beyond a face width of roughly 8 to 12 modules for spur gears, the gain on paper can disappear in service unless the shafts are stiff, the housing accurate and the teeth crowned or helix-corrected. Modern methods reflect this in the face load factor, which rises with face width for a given alignment quality. Widening the face is a good choice when the mounting supports it, and a poor one when it does not.

## Exercise: double the speed

Suppose the same pair transmitted the same torque at twice the speed, 2,880 rpm. Calculate the pitch-line velocity, the velocity factor and the screened pinion bending stress.

The pitch-line velocity doubles to about **9.048 m/s**. The velocity factor becomes **(6.1 + 9.048) / 6.1 ≈ 2.483**. With the same tangential force, the screened stress is **2.483 × 22.9 ≈ 56.8 MPa**. The power has also doubled, to 6 kW. Explain why higher speeds push designers towards more accurate gears, which modern methods reward with lower dynamic factors.
