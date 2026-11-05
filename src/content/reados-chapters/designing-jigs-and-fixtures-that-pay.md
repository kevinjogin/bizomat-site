---
title: "Designing jigs and fixtures that pay for themselves: locating, clamping, mistake-proofing and the business case"
description: "A good fixture makes the right way the easy way. How to locate parts on datums, clamp without distortion, build in mistake-proofing, design for welding and people, and judge the payback."
publishDate: 2026-10-09
category: "Manufacturing"
tags:
  - manufacturing
  - design
  - process-improvement
author: "BIZOMAT"
featured: false
draft: false
---

A fabricator tacks together steel frames by laying out parts on a bench with a tape measure and a square. An experienced welder can do it in about twenty minutes, checking diagonals as they go. A newer welder takes longer and gets more frames out of square. Every few days, a frame is rejected at inspection because its diagonals are outside tolerance, and somebody spends an hour cutting and re-welding it. Nobody thinks of this as a problem to solve. It is just how frames are made.

A **jig** or **fixture** changes that. By locating parts in the right position every time and holding them while they are worked, a well-designed fixture removes measuring and judgement from repetitive tasks, cuts cycle time, reduces variation and rework, lets less experienced people produce consistent work and often makes the task safer. Fixtures are among the highest-return investments in many workshops, yet they are often designed informally, or not at all, because the cost of the current method is spread invisibly across thousands of small delays and occasional rework.

This article explains what jigs and fixtures do, the principles of locating and clamping, how to build in mistake-proofing, special considerations for welding and assembly, ergonomics and safety, how to design, trial and maintain fixtures, and how to judge the business case. It is general information for manufacturing owners, engineers, supervisors and tradespeople.

## Jigs, fixtures and what they do

Traditionally, a **fixture** locates and holds a workpiece, while a **jig** also guides the tool, as a drill jig guides a drill through hardened bushes. In everyday use the terms overlap, and welding and assembly aids are often called jigs. The distinction matters less than what the device achieves:

- **Repeatable location**: every part sits in the same position relative to the process.
- **Secure holding**: the part stays put under cutting, welding or assembly forces.
- **Less measuring and adjusting**: the fixture provides the geometry, so people do not have to.
- **Consistency across people and shifts.**
- **Faster loading and unloading.**
- **Mistake-proofing**: parts cannot be loaded wrongly, or the error is obvious.
- **Better ergonomics and safety**: work at a comfortable height, hands away from hazards.

## Locate on the right features: the 3-2-1 principle

A rigid part in space has six degrees of freedom: it can move along three axes and rotate about three. To locate it completely and without ambiguity, a fixture must remove all six, and no more. The classic approach is the **3-2-1 principle**:

1. **Three locators** on the primary surface, usually the largest and most stable, define a plane and remove three degrees of freedom.
2. **Two locators** on a secondary surface, at right angles to the first, remove two more.
3. **One locator** on a third surface removes the last.

```figure
type: stats
title: Six degrees of freedom to remove
caption: A fixture must remove all six, and no more, to locate a part without ambiguity.
- 3 | Translations | along three axes
- 3 | Rotations | about three axes
- *3-2-1 | Locators | on primary, secondary and tertiary faces
```

Three refinements make the principle work in practice:

- **Locate on the datums.** Engineering drawings often define **datums**, the reference features from which other dimensions and tolerances are measured. Locating on the same features that the drawing uses means the fixture reproduces the design intent, and inspection agrees with production. Locating on convenient but different features can produce parts that look right but measure wrong.
- **Avoid over-constraint.** Extra locators on the same surface make the part rock or force it to distort. If a surface is rough or uneven, use fewer, well-placed locators or adjustable supports.
- **Use pins and holes deliberately.** A round pin in one hole and a diamond or relieved pin in a second hole locates a part precisely without jamming when the hole spacing varies within tolerance.

Locators should be hard, wear-resistant and replaceable, because they wear with every part loaded.

## Clamp without distorting

Clamps hold the part against its locators. Good clamping practice:

- **Clamp towards the locators**, so the clamping force pushes the part into its located position rather than away from it.
- **Direct forces into solid support**, so the part is not bent between supports. A thin part clamped over an unsupported span will distort, then spring back when released.
- **Use enough force, but no more**, sized to the process loads such as cutting forces or weld shrinkage.
- **Make clamping quick and consistent**: toggle clamps, cam clamps and quick-release pins are faster and more repeatable than threaded clamps for most repetitive work.
- **Define a clamping sequence** when it affects the result, such as clamping the primary locators first.
- **Keep clamps clear** of the work area, tool paths, weld joints and the operator's hands during loading.

## Build in mistake-proofing

Fixtures are an ideal place to apply **mistake-proofing**, sometimes called poka-yoke: designing the process so that errors are impossible, or immediately obvious, rather than relying on people being careful. Common mechanisms include:

- **Orientation control**: asymmetric nests, offset pins and keyed features that accept a part only the right way round.
- **Presence detection**: a sensor, switch or simple feeler that confirms a component is in place before the process can start.
- **Count control**: nests for an exact number of components, so a missing or extra part is obvious.
- **Sequence control**: interlocks that prevent a later step until an earlier one is complete.
- **Setting control**: hard stops that fix a position or depth.

When designing a mistake-proofing feature, ask whether an operator could easily bypass it, whether it prevents the defect or only detects it later, whether normal variation will cause false trips, how it will be checked and what happens when it triggers. The [zero-defect manufacturing in a small factory](/reados/collections/manufacturing-quality/zero-defect-manufacturing-in-a-small-factory/) article covers mistake-proofing more broadly.

## Welding fixtures need extra thought

Welding fixtures face particular demands:

- **Distortion**: welding heat makes parts move as they cool. Fixtures may need to hold parts against shrinkage, or pre-set them slightly so they finish in the right position. A clamping and welding sequence matters as much as the fixture.
- **Access**: the welder or robot must reach every joint at a suitable angle.
- **Unloading**: a part that distorts during welding can lock itself into the fixture. Design locators and clamps so the finished part can still be removed.
- **Spatter and heat**: protect locating surfaces from spatter and heat damage, and use materials that withstand it.
- **Electrical return path**: provide a reliable earth connection that does not depend on clamps.

Welded fabrications often have tolerances on overall dimensions and diagonals that are hard to achieve without a fixture. Locating on the features that define the final geometry, and checking the first parts against the drawing, is essential.

## Assembly aids and light fixtures

Not every fixture needs to be machined steel. For light assembly, nests and holding aids can be made from aluminium, engineering plastics or 3D-printed parts, often within days. Modular fixturing systems, with standard plates, locators and clamps, allow fixtures to be built, changed and reused quickly. Choose the construction to suit the forces, accuracy, volumes and life required.

## Design for people and safety

Fixtures are used thousands of times, so small ergonomic choices matter:

- **Working height** that avoids bending and reaching.
- **Loading paths** that do not require lifting heavy parts over obstacles.
- **Weight**: fixtures that must be moved should be light enough or have handling aids.
- **Visibility** of locators and clamps.
- **Pinch points**: powered clamps and moving fixtures can trap fingers and hands. Powered or automated fixtures are plant and need a risk assessment and appropriate guarding under work health and safety law.

Involve the people who will use the fixture in its design. They know where parts catch, where hands go and what slows them down.

## A practical design process

1. **Define the requirement**: the part, operations, volumes, tolerances, datums, cycle time target and the problems with the current method.
2. **Measure the baseline**: current cycle time, rework, variation and safety issues.
3. **Develop concepts**, and review them with operators.
4. **Prototype quickly**, using printed or roughly made parts where possible, and trial with real parts.
5. **Build and prove**: make the fixture, then check the first parts thoroughly against the drawing.
6. **Write standard work** showing how to load, clamp, process and unload.
7. **Update system records**, such as routings and standard times.
8. **Re-measure** to confirm the improvement.
9. **Register and maintain** the fixture.

The [small, frequent improvement on the shop floor](/reados/collections/lean-and-continuous-improvement/small-frequent-improvement-on-the-shop-floor/) article describes the measure, design, standardise, update and re-measure routine that locks in improvements like this.

## Fixtures need control too

A worn locator or a bent pin quietly turns a good fixture into a source of bad parts. Give every fixture an identification number, record it in a register with its drawing and the parts it serves, check it periodically against its drawing or with known parts, replace wear parts on a schedule and store it where it will not be damaged. Checking fixtures used for inspection need the same care as gauges, including evidence that they measure reliably.

## Judge the business case

The value of a fixture usually comes from several sources:

- **Labour time saved** per part, multiplied by annual volume and the cost of an hour.
- **Rework and scrap avoided.**
- **Capacity released**, which is worth most when the operation is a bottleneck.
- **Skill flexibility**: more people can do the job well.
- **Safety and ergonomic improvement.**
- **Quality and customer benefits**, such as fewer complaints.

Compare these with the full cost of design, materials, manufacture, trial and maintenance. Use measured baselines rather than optimistic estimates, and confirm the benefits after implementation. Remember that saved labour time is only a cash saving if it is used productively or reduces paid hours; otherwise it is released capacity, which is still valuable but different.

## A worked example

This is an illustrative example. A 30-person fabrication business makes about 1,800 steel equipment frames a year. Tack-up is done on a flat bench using a tape measure and squares. A time study shows tack-up averages about 22 minutes per frame, and about 6% of frames are rejected at inspection for diagonal errors, each costing about $120 in rework.

**Requirement.** The engineer defines the datums from the frame drawing, the target tack-up time and the need for welders to reach all joints from one side.

**Design.** The fixture uses a fabricated base with hardened locators on the frame's datum faces, following the 3-2-1 principle for each member, a round pin and a diamond pin for the mounting plate holes and toggle clamps that push members against the locators. Offset pins make it impossible to load the mounting plate the wrong way round. The weld sequence is planned to balance distortion, and locators are positioned so the welded frame lifts out cleanly.

**Trial.** A quick prototype made from offcuts reveals that one clamp blocks a weld joint. It is moved before the fixture is built properly. The first ten frames are measured fully and are all within tolerance.

**Result.** Tack-up time falls to about 9 minutes and diagonal rejects to about 1%. The time saving of 13 minutes on 1,800 frames is about 390 hours a year, worth about $29,000 at an illustrative $75 an hour including overheads. Avoiding rework on about 90 frames saves about $10,800. Against a total cost of about $4,500 for design, materials and manufacture, the fixture pays for itself in about six weeks. The time released is used to take on additional work rather than overtime.

```figure
type: compare
title: A tack-up fixture for 1,800 frames a year
cols: Bench with tape and squares | Fixture
best: 2
caption: About $29,000 of time and $10,800 of rework saved a year against about $4,500: paid back in about six weeks.
- Tack-up time | About 22 minutes | About 9 minutes
- *Diagonal rejects | About 6% | About 1%
```

**Keeping it.** The fixture is registered, a one-page standard work sheet with photographs hangs beside it and its locators are checked against a master frame every month.

## Applying this in an Australian workshop

- **Look for repetitive tasks** where people measure, mark or adjust every time.
- **Measure the current cost**: time, rework, variation and safety.
- **Locate on drawing datums** using the 3-2-1 principle, and avoid over-constraint.
- **Clamp towards locators** and into solid support.
- **Build in mistake-proofing** at the fixture.
- **Plan for distortion, access and unloading** on welding fixtures.
- **Prototype quickly** and involve the users.
- **Assess powered fixtures** as plant under WHS law.
- **Register, check and maintain** fixtures.
- **Confirm the business case** with measured results.

## Where fixtures go wrong

- **Locating on convenient features** rather than datums.
- **Too many locators**, causing rocking or distortion.
- **Clamps that push parts off locators.**
- **No allowance for weld distortion**, trapping finished parts.
- **Blocked access** for tools or welders.
- **No maintenance**, so wear quietly degrades accuracy.
- **Business cases based on guesses** rather than measurements.

## Questions to ask about your repetitive work

- Where do people measure, mark or adjust the same way every time?
- How much time and rework does that cost each year?
- Which features does the drawing use as datums?
- What could be loaded wrongly, and how could the fixture prevent it?
- How will we know when the fixture has worn?
- Who will use it, and have they shaped the design?

## Bringing it together

A well-designed jig or fixture makes the right way the easy way. Locate parts on their drawing datums using the 3-2-1 principle, clamp them towards the locators without distortion and build mistake-proofing into the fixture itself. Allow for distortion, access and unloading in welding fixtures, design for the people who will use them and treat powered fixtures as plant. Prototype quickly, prove the first parts, write standard work and keep fixtures registered and maintained. Measured honestly, the business case for fixtures on repetitive work is often among the strongest in the workshop.

---

*Source: BIZOMAT editorial notes, drawing on earlier BIZOMAT manufacturing handbooks on reducing assembly time with simple jigs, poka-yoke mistake-proofing and the DMAIC improve phase, together with established fixture design practice. The worked example is illustrative. This article is general information.*
