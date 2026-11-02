---
book: cad-standards-that-stick
chapterSlug: modelling-rules-that-survive-change
order: 7
title: "Modelling rules that survive change"
description: "Write a short set of part and assembly modelling rules, then prove them by flexing a configured model through every size it must make, and fix the rule that fails."
draft: false
---

A parametric model is a set of instructions for building geometry, and those instructions are run again every time a dimension changes. A model that rebuilds correctly at the size it was drawn may fail at any other size, and the failure may not appear until someone else changes it months later. Modelling rules exist to make models that survive change, not models that look right on the day.

This chapter sets out a compact set of part and assembly rules for the running case office, explains the reason for each, and then tests them in the most direct way available: by changing the model through its full range and watching what breaks. Its error case is a side member that rebuilt perfectly at four lengths out of seven.

## Rules are about the next person

Every modelling rule answers the same question: what will the next person who opens this model need? The next person may be a colleague revising the part, a checker trying to understand it, or the original designer two years later with no memory of the decisions. Rules that serve the next person tend to be short, testable and justified.

Rules that serve only the author's preferences tend to be long and contested. The written standard in Chapter 8 should contain the first kind and leave the second to individuals. A useful test for any proposed rule is whether a checker could tell, by opening the model, whether it was followed. "Sketches should be clean" fails that test. "Sketches used by released features are fully defined" passes it.

## Part modelling rules

The running case office adopted eight part rules. Each is stated with its reason, because a rule without a reason is the first one dropped under deadline pressure.

```figure
type: checklist
title: Part modelling rules for the running case office
caption: This is an illustration. Each rule can be checked by opening the model; the reasons are in the written standard.
- Anchor the first feature to the origin | so that mates, drawings and configurations have a stable reference
- Use the principal planes for symmetry | mirror about a plane rather than dimensioning both sides
- Fully define sketches used by released features | an under-defined sketch can move when anything changes
- Reference planes, axes and sketches, not model faces and edges | faces and edges are renamed or lost when earlier features change
- Add fillets, chamfers and cosmetic features late | they consume edges that later features might need
- Name the features that matter | a reader should find the hole pattern without opening every feature
- Drive variants from a table or equations | never by editing dimensions in each configuration by hand
- x Save with rebuild errors or warnings | a released model rebuilds cleanly at every configuration
```

The fourth rule deserves a little more explanation. When a feature is built on a face of an earlier feature, the CAD system records an internal reference to that face. If the earlier feature changes so that the face is split, merged or removed, the reference may fail or, worse, silently attach to a different face. Referencing a plane or a sketch that the designer controls avoids the problem. Not every reference can be made this way, but the important ones, those that locate holes, interfaces and mating features, usually can.

## Assembly modelling rules

Assemblies have their own failure modes. The office's six assembly rules are:

1. **Fix one component and mate the rest.** The first component, usually the main frame, is fixed at the assembly origin. Every other component is positioned by mates, so that the assembly can be understood and changed.
2. **Mate to planes and origins where possible.** As with part features, mates to faces and edges break when the part changes. Mating side members to cross-members through their planes keeps the assembly intact when hole positions move.
3. **Structure subassemblies as the product is built.** If the workshop builds the drive end as a unit, the model should have a drive-end subassembly. The bill of materials then matches the build, and changes to one unit do not ripple through the whole.
4. **Limit references between parts in an assembly.** Many CAD systems let a part's geometry be defined from another part within an assembly. These in-context references are powerful but bind the part to that assembly. The office allows them during concept work and requires them to be removed or locked before release.
5. **Use one configuration per product variant.** The seven module lengths are seven configurations of one top-level assembly, each calling the matching configuration of each configured part.
6. **Keep assemblies rebuildable on every seat.** Every referenced file comes from the project folder or the controlled library, never from a personal folder.

Rule 4 often causes debate, because in-context design is fast and natural. The office's compromise reflects the next-person question: a released part that silently changes when someone edits a different part in a different assembly is a hazard to everyone downstream.

## Test rules by flexing the model

A rule set is a hypothesis about what makes models robust. The test is to change a model through every value it must support and see whether it rebuilds correctly. The office calls this a flex test, and makes it part of checking any configured or table-driven model.

A flex test has four steps:

1. List every configuration, or every value of every driving dimension, that the model must support.
2. Rebuild the model at each one.
3. For each, record whether it rebuilds without errors or warnings, and check the critical geometry against the design rule.
4. Fix any failure at its cause, then repeat the whole test, not just the failed case.

The last point matters. A fix for one case can break another, especially where equations interact.

## The running case: the side member

The transfer module's side member is a folded channel, configured in seven lengths from 1,200 mm to 3,000 mm in 300 mm steps. Each side member carries holes for the cross-members that tie the two sides together. The design rule, set by the engineer, is that cross-members must be equally spaced along the length, with one at each end, and no more than 600 mm apart.

The original model used a fixed pitch of 600 mm and calculated the number of cross-member positions as the length divided by 600, plus one. At 1,200 mm that gives 3 positions at 600 mm pitch, which is correct. The designer checked 1,200, 1,800, 2,400 and 3,000 mm, all of which rebuilt cleanly, and released the model.

## The error case: four lengths out of seven

Four months later the drafter detailed the 2,100 mm module and found that the side member would not rebuild. The hole pattern feature reported an error. The 1,500 mm and 2,700 mm lengths, when tried, failed the same way.

The cause is visible in the arithmetic. With a fixed 600 mm pitch, the count is **L ÷ 600 + 1**. At 2,100 mm that is **3.5 + 1 = 4.5** positions. A pattern cannot have half an instance, so the feature failed. The same happens at 1,500 mm, giving 3.5, and at 2,700 mm, giving 5.5. The designer's checks had happened to choose the four lengths that are multiples of 600.

```figure
type: compare
title: Flex test of the original and corrected side member
cols: Original: L ÷ 600 + 1 | Corrected: positions and pitch
caption: This is an illustration. The original rule fails at every length that is not a multiple of 600 mm; the corrected rule gives equal pitch no greater than 600 mm at all seven.
- 1,200 mm | 3, rebuilds | 3 at 600 mm
- *1,500 mm | 3.5, fails | 4 at 500 mm
- 1,800 mm | 4, rebuilds | 4 at 600 mm
- *2,100 mm | 4.5, fails | 5 at 525 mm
- 2,400 mm | 5, rebuilds | 5 at 600 mm
- *2,700 mm | 5.5, fails | 6 at 540 mm
- 3,000 mm | 6, rebuilds | 6 at 600 mm
```

The model encoded a different rule from the one the engineer specified. The engineer's rule fixes the maximum pitch and requires equal spacing; the model fixed the pitch exactly. The correct implementation calculates the number of positions first, as the smallest whole number that keeps the pitch at or below 600 mm, and then divides the length equally:

- **positions = ceiling(L ÷ 600) + 1**, where ceiling rounds up to the next whole number;
- **pitch = L ÷ (positions − 1)**.

At 2,100 mm, ceiling(3.5) is 4, so there are **5** positions at **2,100 ÷ 4 = 525 mm**. At 1,500 mm there are **4** positions at **500 mm**, and at 2,700 mm **6** positions at **540 mm**. At the four lengths that are multiples of 600 mm, the corrected rule gives the same result as the original.

```figure
type: formula
title: Cross-member positions from the design rule
formula: positions = ceiling(L ÷ 600) + 1
formula: pitch = L ÷ (positions − 1)
caption: This is an illustration. The equation states the engineer's rule directly: equal spacing, no more than 600 mm.
- L | side member length, mm
- 600 | maximum allowed pitch, mm
step: L = 2,100: ceiling(3.5) + 1 = 5 positions
step: pitch = 2,100 ÷ 4 = 525 mm, which is not more than 600 mm
```

Correcting the model took about an hour. Finding out what else had been affected took longer. The 1,500 mm and 2,700 mm modules had not yet been ordered, but the 2,100 mm module had been quoted with a bill of materials that showed four cross-members, read from a partly rebuilt model. The quote was revised to five. Had the error reached production, the frame would have been built with cross-members at unequal spacing or one short.

The office drew three conclusions. Spot checks are not flex tests: checking four of seven sizes chosen for convenience proved nothing about the other three. Equations must state the design rule, not an example of it. And a model that fails to rebuild must not feed a bill of materials, a quote or a drawing, which became a checking rule in Chapter 9.

## Watch the drawing as well as the model

A flex test should include the drawing. Dimensions on drawings attach to model edges, and when the number of holes changes from four to five, a dimension attached to the fourth hole may detach or attach to something else. Hole tables and pattern callouts usually update correctly, but individual dimensions to specific instances often do not.

The office's flex test for configured parts with drawings therefore adds a step: for each configuration, update the drawing and check that no dimension has become detached, that hole tables show the right count and that no annotation sits over the wrong feature. For the side member, the corrected drawing used a pattern callout, "5 × Ø11 EQUALLY SPACED", driven by the model rather than individual dimensions to each hole.

## Treat rebuild time as a quality signal

A model can rebuild correctly and still be badly built. Slow rebuilds are often the first sign: a pattern of hundreds of cosmetic thread features, an imported body full of tiny faces, or a chain of in-context references that forces the whole assembly to recalculate whenever one part changes. Chapter 2 timed a reference assembly on every seat. The same measurement, applied to individual models, helps find the ones that need attention.

Many CAD systems can report how long each feature takes to rebuild. The office added a simple step to checking: for any part that takes more than a few seconds to rebuild on its own, open the feature timing report and look at the slowest few features. In the first year this found two common culprits. One was a purchased gearbox model downloaded with full internal detail, which was replaced by a simplified envelope in the library, as Chapter 6 recommends. The other was a fillet applied across hundreds of edges at once early in a part's history, so that every later change recalculated it. Moving the fillet to the end of the history, as the part rules require, cut that part's rebuild time by more than half.

Rebuild time is not a target in itself. A complex casting may legitimately take time. It is a signal that tells the checker where to look, and it costs almost nothing to collect.

## Allow exceptions, and record them

Rules meet reality. A surface-heavy part may be impossible to build without referencing faces. A quick concept model may not deserve fully defined sketches. A legacy part revised under time pressure may not justify rebuilding from scratch to meet every rule.

The office's standard allows exceptions under two conditions: the exception is deliberate, and it is recorded in the model where the next person will see it, usually as a note on the feature concerned. "Face reference used: no stable plane available; check if the boss changes" tells the next person exactly what risk they are inheriting. An unrecorded exception looks the same as a mistake, and the next person has no way to tell the difference.

## Keep the rules few and alive

Fourteen rules for parts and assemblies are enough for a six-seat office. Longer lists are possible, and most of the extra rules would be sensible, but each one added reduces the chance that any one is remembered. The office reviews the list once a year, as part of the change process in Chapter 10. A rule that nobody has broken in a year may be redundant or may be invisible; a rule that is broken often is either unclear or wrong. Either way, the review is the place to decide.

The reasons matter more than the wording. When a designer understands why faces make poor references, they will apply the idea to situations the rule never mentions. When they know only the rule, they will follow it literally and miss its point.

The Library’s chapter on [design intent in parametric CAD and large assemblies](/reados/collections/cad-modelling-and-design-intent/design-intent-in-parametric-cad-and-large-assemblies/) discusses the wider ideas behind these rules.

## Exercise: test a proposed shortcut

A designer suggests a simpler equation: positions = round(L ÷ 600) + 1, using ordinary rounding. They point out that it gives the same answer as the corrected rule for all seven lengths. Should the office accept it? Test it at the seven lengths and at a possible future length of 2,000 mm.

**Answer.** With ordinary half-up rounding, the seven lengths give 3, 4, 4, 5, 5, 6 and 6 positions, identical to the corrected rule, because every length divided by 600 is either a whole number or ends in exactly .5, which rounds up.

At 2,000 mm, however, 2,000 ÷ 600 = 3.33, which rounds to 3, giving **4** positions at **2,000 ÷ 3 ≈ 666.7 mm**. That breaks the 600 mm limit. The ceiling rule gives ceiling(3.33) + 1 = **5** positions at **500 mm**, which complies.

There is a second, quieter problem. Some software rounds exact halves to the nearest even number. Under that convention, 1,500 mm gives round(2.5) = 2 and **3** positions at **750 mm**, and 2,700 mm gives round(4.5) = 4 and **5** positions at **675 mm**, both breaking the limit. The shortcut works only by coincidence of the current lengths and of one rounding convention. Reject it: the equation should express the rule, and the rule is "no more than 600 mm".
