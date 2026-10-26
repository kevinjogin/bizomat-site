---
book: fine-particles-by-the-numbers
chapterSlug: ducts-and-deposition
order: 7
title: "Ducts, transport velocity and deposition"
description: "Estimate how much of LX-3's dust settles in its horizontal duct, why transport velocity keeps it moving, where bends collect particles, and what an oversized duct did to a similar system."
draft: false
---

Between the capture point and the filter, particles travel through ductwork, and not all of them arrive. Coarse dust settles in horizontal runs, heavy particles strike the outsides of bends, and the finest fume clings to surfaces near stagnant corners. A little deposition is harmless; a lot narrows the duct, raises its resistance, robs the hood of airflow and, with combustible dust, builds a fuel load inside a pipe that may carry sparks. Duct design for particles is mostly about keeping them moving.

This chapter estimates gravitational deposition in LX-3's horizontal duct for each particle family, explains the role of transport velocity and re-entrainment, adds impaction at bends from Chapter 4, and shows why diffusion to duct walls is negligible. The failure case is a duct upsized "for future capacity" that silted up.

## Settling in a horizontal duct

In a horizontal duct the air moves along and the particles settle across it. In laminar flow, every particle would follow a predictable sloping path, as in the settling-chamber calculation of Chapter 2. In the turbulent flow of a real extraction duct, turbulence keeps re-mixing the particles across the section, so that at any instant they are spread roughly evenly through it, and those that happen to be close to the floor settle onto it.

For a well-mixed turbulent flow, the fraction of particles that gets through a horizontal run, the **penetration**, depends on how many settle onto the projected floor area, the duct diameter times its length, compared with the flow. A widely used estimate is **P = exp(−v_s × d × L ÷ Q)**, where v_s is the settling velocity, d the duct diameter, L the horizontal length and Q the volume flow.

```figure
type: formula
title: Gravitational penetration of LX-3's 6 m horizontal run
formula: P = exp(−v_s d L ÷ Q)
caption: This is an illustration for a well-mixed turbulent flow of 0.60 m³/s in a 200 mm duct with a 6 m horizontal run, using settling velocities from Chapters 2 and 3 (with slip, and with the drag correction for 30 and 100 µm). It ignores re-entrainment, so it overestimates net deposition at high duct velocity.
- 1 µm, v_s ≈ 1.75 × 10⁻⁴ m/s | P ≈ 0.9997; about 0.03% deposits
- 10 µm, v_s ≈ 0.0153 m/s | P ≈ 0.970; about 3% deposits
- 30 µm, v_s ≈ 0.128 m/s | P ≈ 0.774; about 23% deposits
- 100 µm, v_s ≈ 0.98 m/s | P ≈ 0.142; about 86% deposits
```

The well-mixed assumption is an approximation. Real turbulent flows are not perfectly mixed near the floor, settled particles can be lifted again, and particles of different sizes interact. More detailed models exist in the aerosol literature for both laminar and turbulent ducts, and give somewhat different numbers. The simple exponential is used here because it captures the main dependence, on settling velocity, projected floor area and flow, in one line that can be checked by hand, and because it errs towards predicting more deposition rather than less.

The numbers confirm what the earlier chapters suggested. Fume passes the duct essentially untouched. A few per cent of the 10 µm dust settles. A quarter of any 30 µm particles, and most of the 100 µm spatter that escapes the plenum, end up on the floor of the horizontal run, which is one more reason to stop spatter at the table and in the spark trap rather than letting it reach the duct.

### Why the duct velocity does not appear

The formula contains the flow, not the duct velocity, and that is not an oversight. For a given flow, a particle spends a time L ÷ U in the run, and in that time settles a distance v_s L ÷ U; the fraction of the duct's height that represents is proportional to v_s L ÷ (U d), and U d² is proportional to Q, so the velocity cancels against the diameter. What the velocity does control is not how many particles reach the floor, but whether they stay there.

## Transport velocity and re-entrainment

Particles that settle on the floor of a duct are not necessarily lost. A fast enough airflow lifts them again, rolls them along and re-entrains them into the stream. Duct design for dust therefore aims to keep the air velocity at or above a **minimum transport velocity**: the speed needed to keep the material moving along the duct rather than accumulating. Published design guidance, such as the American Conference of Governmental Industrial Hygienists' *Industrial Ventilation* manual, gives recommended minimum velocities for different materials, low for light fume and high for heavy, sticky or coarse dusts; they are named here, not quoted.

LX-3's duct runs at about **19.1 m/s**, chosen to keep its coarse dust moving. At that speed, a 10 µm particle takes about **0.2 ÷ 0.0153 ≈ 13 s** to settle the duct's full height in still air, during which the air would carry it about **250 m**; it reaches the floor only because turbulence brings it close, and when it does, the shear at the floor tends to lift it again. The deposition estimates above are therefore an upper bound for LX-3's running duct. Their real value is in comparing designs, and in warning what happens when the velocity drops.

```figure
type: compare
title: LX-3's horizontal run in a 200 mm and a 250 mm duct at the same flow
cols: Duct velocity | 30 µm settling deposition | 10 µm settling deposition | Re-entrainment
caption: This is an illustration. Upsizing the duct at the same flow increases the floor area for settling and, more importantly, drops the velocity, so particles that settle are less likely to be lifted again.
- *200 mm, as built | about 19.1 m/s | about 23% | about 3.0% | good at this velocity
- 250 mm | about 12.2 m/s | about 27% | about 3.8% | much weaker; deposits accumulate
```

## Bends and branches

Chapter 4 showed that at LX-3's bends the Stokes number is about 0.15 for 10 µm particles and about 1.3 for 30 µm particles, so coarse particles strike the outer wall of each bend. In a smooth, long-radius bend that mainly causes wear; in a short-radius bend, a rough joint or a branch entry, particles can lodge and build up. LX-3's bends are long-radius, with their joints lapped in the direction of flow so that no edge faces into the airstream, and each has an inspection door at its outer wall where build-up would start.

Branches deserve particular care. Where a branch joins a main at a right angle, its air must turn abruptly, and coarse particles impact the far wall of the main; where it joins at a shallow angle, the turn is gentler and impaction less. A branch that carries little air relative to its size runs at a low velocity, and its particles settle in it. *Ductwork by the Numbers* covers branch design for airflow; for particles, the rule is to keep every branch at or above the transport velocity and to join it at a shallow angle.

## Vertical runs

In a vertical duct carrying air upwards, settling works against the flow instead of across it. A particle rises at the air velocity less its settling velocity, so as long as the air is much faster than the particle settles, it is carried up with only a small delay. In LX-3's short vertical riser to the filter unit, at 19.1 m/s, even a 100 µm spark settling at about 1 m/s rises at about 18 m/s. The danger in vertical runs comes when the flow stops: at shutdown, everything in the riser falls back to the bottom, where it collects at the first bend or damper. LX-3's riser has a drop-out leg with an inspection cap at its foot for that reason. In a downward run, settling adds to the air velocity and particles are carried down slightly faster than the air, which does no harm.

## Leaks into a duct under suction

LX-3's ductwork runs under suction, below the pressure of the room, all the way from the table to the fan. Any leak, at a poorly sealed joint, an open inspection door or a split seam, lets room air in rather than letting fume out. That sounds safe, and as far as fume escape is concerned it is. But every litre per second that leaks in at a joint is a litre per second the fan no longer draws through the table, because the fan moves a fixed flow at its operating point and the leak offers an easier path than the table and the plenum. A few loose joints near the fan can take a noticeable share of the flow, and the table's capture suffers while the fan and filter appear to be working normally. LX-3's joints are sealed and clamped, inspection doors close on gaskets, and commissioning measures the flow at the table, not only at the fan.

## Diffusion to the walls

Chapter 5 showed that a 0.1 µm particle diffuses only about 24 µm during its 0.42 s in LX-3's duct. Turbulent eddies carry particles towards the walls far faster than Brownian motion, but within the thin, slow layer of air at the wall surface, the last fraction of a millimetre must still be crossed by diffusion or inertia. For fume in a duct of LX-3's size, the resulting losses to the walls are small, a fraction of a per cent over the whole run, and they show up as a thin, dark film on the duct's inner surface over months. They matter for long sampling lines (Chapter 5) and for small, slow ducts; in LX-3's main, they can be ignored for design and noticed only at inspection.

## Combustible deposits

Some deposits are a hazard, not just a nuisance. Fine metal dusts, particularly aluminium and magnesium, and oily or resinous residues can burn, and a duct that carries sparks from a cutting or grinding process is a source of ignition right next to them. LX-3 cuts steel, whose fine oxide fume does not burn, but if the same system were used for aluminium, its deposits would need a specific combustible dust assessment, a different spark protection strategy and a cleaning regime, designed with a specialist. The particle mechanics in this chapter tell where deposits will form; the hazard assessment tells what they mean.

## Cleaning and inspection

```figure
type: checklist
title: LX-3's monthly duct inspection in its first year
caption: This is an illustration of the shop's record. Each measured value is compared with the last inspection; a change is investigated before the duct is cleaned.
- x Deposit depth at each bend door | measured with a rule, mm
- x Deposit depth at the end of the horizontal run | measured with a rule, mm
- x Riser drop-out leg | emptied and the contents weighed
- x Airflow at the active table zone | anemometer traverse, m/s and m³/s
- x Filter pressure drop and cleaning frequency | from the unit's controller log
- ? Cause of any increase | damper, filter, leak, material or flow change
```

LX-3's maintenance schedule opens the inspection doors at the two bends and the far end of the horizontal run monthly in the first year. The fitter measures the depth of any deposit with a rule and records it, along with the fan's operating point and the hood's capture velocity measured at the table. If deposits grow from one inspection to the next, the duct velocity has dropped, a filter has loaded, a damper has moved or the material has changed, and the cause is found before the duct is simply cleaned.

## A failure case: the duct upsized for the future

This is an illustration. On an earlier cutting table with the same flow, the installer fitted 250 mm duct instead of the 200 mm specified, reasoning that a second machine might be added later and the larger duct would then be "ready". The fan was unchanged, so the flow was unchanged, and the duct velocity fell from about 19 m/s to about **12.2 m/s**.

Over the following year, the horizontal run silted up with coarse dust and spatter, which settled at roughly the rate the penetration estimate predicts and was no longer reliably re-entrained at the lower velocity. The deposit narrowed the duct, raised its resistance, reduced the flow at the table and let more fume escape. The detection came from the operators, who noticed fume escaping the table at the start of cuts, and from an airflow measurement at the table, which found the flow about 20% below design. Opening an inspection door found the horizontal run nearly a third full.

The correction was to replace the horizontal run with 200 mm duct and to design the future second machine's connection separately, with its own branch sized for its own flow, when it was actually bought. The shop's rule now is that ducts are sized for the flow they carry today, at the transport velocity, and that "future capacity" is provided by space and connection points, not by oversized pipe.

## How this applies to a small Australian business

Estimate gravitational deposition in horizontal runs with the well-mixed penetration formula to see which particle sizes will settle. Keep duct velocities at or above published minimum transport velocities for the material, and size ducts for the flow they actually carry. Use long-radius bends, shallow branch entries and inspection doors where impaction and deposits will start. Treat diffusion to duct walls as negligible in large ducts. Assess combustible dust separately. Inspect, measure and record deposits, and find out why they grow before simply cleaning them out.

## Exercise: a longer horizontal run

A second machine's extraction runs **12 m** horizontally in **160 mm** duct at **0.40 m³/s**. What is the duct velocity? Using the well-mixed formula and the settling velocities of this chapter, what fraction of 10 µm and 30 µm particles would settle in the run if nothing were re-entrained?

**Worked answer.** The duct's area is **π × 0.08² ≈ 0.0201 m²**, so the velocity is **0.40 ÷ 0.0201 ≈ 19.9 m/s**, adequate for transport. For 10 µm particles, **P = exp(−0.0153 × 0.16 × 12 ÷ 0.40) ≈ exp(−0.0734) ≈ 0.929**, so about **7%** would settle. For 30 µm particles, **P = exp(−0.128 × 0.16 × 12 ÷ 0.40) ≈ exp(−0.614) ≈ 0.541**, so about **46%** would settle. The longer run doubles the losses compared with LX-3's, and at nearly 20 m/s most of what settles should be re-entrained, but the inspection doors at the end of the run will show whether it is.
