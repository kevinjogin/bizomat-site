---
book: cad-automation-by-the-numbers
chapterSlug: capture-the-design-rules
order: 3
title: "Capture the design rules"
description: "Write the engineering rules behind a product family as owned, versioned data with reasons and a validated range, check them by calculation and test every boundary before automating."
draft: false
---

A configurator is only as good as its rules. It applies them faster and more consistently than any person, which is its value. It also applies them without judgement, which is its risk. A rule that is wrong, ambiguous or applied outside the range anyone checked will be repeated in every variant the tool produces, and the drawings will look exactly as trustworthy as the correct ones.

This chapter captures the trestle range's design rules before any automation is built. It separates the engineering from the code, records each rule with its reason, owner and validated range, checks the key rules by calculation, and tests every boundary. The failure case is a single character in one rule that left six trestles without a brace.

## Rules are engineering, not code

In many offices the rules for a product family live in three places: in the heads of experienced designers, in old drawings that people copy, and in scattered notes. When automation arrives, the rules move into a fourth place, the code, where only the programmer can read them. That is the worst place for them, because the engineer responsible for the product can no longer check them.

The trestle configurator keeps its rules as **data**: a controlled table, owned by the product's responsible engineer, that the rules library reads. The code implements how a rule is applied. The table states what the rule is. An engineer can review, change and approve the table without reading code, and the programmer cannot change a rule without changing a controlled document.

Each rule in the table has:

- a **rule number** that never changes, so drawings and test results can refer to it;
- the **rule itself**, written as a condition and an outcome;
- the **reason**, with a reference to the calculation, test, standard or experience that justifies it;
- the **validated range**, the inputs over which the reason holds;
- the **owner**, the engineer who approves changes;
- the **revision** and date.

## Find the rules people actually use

Writing down rules sounds simple until someone tries it. The experienced designer can state the main rules in an afternoon, but the drawings tell a fuller and sometimes different story. The office used three sources together.

**Interviews.** The responsible engineer sat with the senior designer and the workshop supervisor for two sessions and asked, for each feature of a trestle, how its size was decided and what would make it change. The workshop supervisor added rules the designers had never written down, such as the minimum gap between a bolt hole and a weld that the welders needed for access.

**Old drawings.** The office had about 200 trestle drawings from the previous four years. A designer tabulated the key dimensions and sections of 60 of them, chosen across the range, and compared them with the stated rules. Most agreed. Eleven did not. Seven of the disagreements were customer specials, two were errors that had been fabricated and worked, and two revealed a rule nobody had mentioned: trestles for one customer always had a wider foot plate to suit their anchor pattern. That became a fourth foot style, owned by a customer-specific rule.

**The workshop.** Rules that suit the design office can be awkward to make. The jig the workshop uses to weld the frames adjusts in 50 mm steps, which is the reason for rule R6. Nobody in the design office had known that the step size came from the jig.

## When rules disagree

With enough rules, some will apply at the same time and point in different directions. A customer's foot pattern may conflict with the standard plate size, or a brace position may clash with a cross-member at certain heights. The table must say which rule wins.

The trestle table handles this in two ways. Rules carry a precedence, so that a customer-specific rule overrides a general one where they cover the same feature. And combinations that the engineer has not reviewed are refused, just like single inputs outside a range. When the brace rule and the cross-member rule were first combined, the generated geometry showed the brace's top connection meeting the 100 × 50 cross-member's lower face at the 950 mm height, with no room for the bolt. The engineer added a rule for the brace connection position, with its own boundary tests, rather than leaving the generator to resolve the clash.

## The trestle rules

This is an illustration. Part of the trestle range's rule table:

```figure
type: compare
title: Part of the trestle rule table, revision C
cols: Rule | Reason | Validated range
caption: This is an illustration. Each reason refers to a calculation or record in the product file. Inputs outside the validated range are refused by the tool, not extrapolated.
- R1 Inside width | belt width + 300 mm | idler frame clearance from the idler supplier's drawings | belt 450 to 1,200 mm
- R2 Legs | SHS 50 × 50 × 3 for every height | strength and buckling margin checked by calculation | height 400 to 1,500 mm
- R3 Cross-member | RHS 75 × 50 × 3 for belt ≤ 900 mm; RHS 100 × 50 × 3 above | deflection at the idler mounting under 1.0 mm | belt 450 to 1,200 mm
- *R4 Bracing | diagonal brace on both sides when height > 900 mm | sway reported on site on taller unbraced trestles; brace rule from field experience and a stiffness check | height 400 to 1,500 mm
- R5 Foot plate | 150 × 150 × 10 plate, two M16 holes at 100 mm centres for the bolt-down style | standard anchor pattern used by the office's customers | bolt-down style only
- R6 Heights | 50 mm steps from 400 to 1,500 mm | stock lengths and the jig's adjustment | as stated
```

The table is not a design manual. It is the smallest set of statements from which every variant can be produced, with enough reasoning that a reviewer can judge each one.

## Check the rules by calculation

A rule that has been "always done that way" may be right for reasons nobody remembers, or wrong in a way nobody has tested. Before automating, the responsible engineer checked the rules that carry load.

This is an illustration. The design load for one trestle comes from the conveyor's material, belt and idler set over a 1.5 m trestle spacing: a material load of 120 kg/m and a belt of 25 kg/m together give 145 kg/m, and the idler set is 35 kg. The load per trestle is about **(145 × 1.5 + 35) × 9.81 ≈ 2,477 N**, or about **1,239 N** per leg.

**Rule R2, the legs.** The leg is SHS 50 × 50 × 3. Computed from its geometry with square corners, its cross-section is about **50² − 44² = 564 mm²** and its second moment of area about **(50⁴ − 44⁴) ÷ 12 ≈ 208,492 mm⁴**. Catalogue values, which allow for rounded corners, are slightly lower, and the real calculation file uses them. As a conservative sanity check, a 1,500 mm leg treated as a free-standing cantilever, with an effective length factor of 2, has an Euler critical load of about **π² × 200,000 × 208,492 ÷ 3,000² ≈ 45,700 N**. That is about 37 times the leg load. Buckling does not govern. The leg size is set by fabrication and bolting convenience, and the rule's reason says so.

**Rule R3, the cross-member.** The cross-member carries the idler frame across the inside width. The team's criterion was a deflection under 1.0 mm at the idler mounting, to keep the idlers aligned.

```figure
type: formula
title: Checking the cross-member rule at its boundary
formula: δ = P L³ ÷ (48 E I)        σ = (P L ÷ 4) ÷ Z
caption: This is an illustration. A central point load is a simple, conservative model of the idler frame's two mounting points. Section properties are computed with square corners. E = 200 GPa.
- P | 2,477 N per trestle
- 75 × 50 × 3 RHS | I ≈ 553,280 mm⁴, Z ≈ 14,754 mm³
- 100 × 50 × 3 RHS | I ≈ 1,121,192 mm⁴, Z ≈ 22,424 mm³
step: belt 900, span 1,200 mm, 75 × 50: δ ≈ 0.81 mm, σ ≈ 50 MPa, within the 1.0 mm criterion
step: belt 1,050, span 1,350 mm, 75 × 50: δ ≈ 1.15 mm, over the criterion
step: belt 1,200, span 1,500 mm, 100 × 50: δ ≈ 0.78 mm, σ ≈ 41 MPa
```

The calculation confirms the rule's boundary. The smaller cross-member meets the deflection criterion up to the 900 mm belt and fails it at 1,050 mm. Stresses are low throughout, well below the yield strength of the structural tube the office buys. The rule's reason now records the criterion and this calculation, and the calculation is filed where the next reviewer can find it.

**Rule R4, bracing.** The brace rule came from experience: trestles taller than about 900 mm had been reported to sway when the conveyor started. The engineer added a simple stiffness check to the reason, and the validated range was kept to the heights the office had built and seen in service. The tool will not produce a trestle taller than 1,500 mm, even though nothing in the geometry would stop it. Outside the validated range, the reason no longer applies.

## Refuse, do not extrapolate

A configurator's most important behaviour is what it does with inputs outside the range its rules were checked for. People will ask for a 1,600 mm trestle or a 1,400 mm belt, and the tool must not quietly build one because the geometry allows it.

The trestle configurator refuses any input outside the validated range, with a message that names the rule and its range and tells the designer to raise a design request with the responsible engineer. That request may lead to a checked one-off design, or to a new rule revision with a wider range. Either way, a person with engineering responsibility makes the decision, not the tool.

## Test every boundary

Rules fail most often at their boundaries: where a ≤ should have been a <, where a range ends, where two rules meet. The rules library has an automated test for every rule at every boundary and one step either side.

This is an illustration. For rule R4, the tests are: height 850 mm, no brace; 900 mm, no brace; 950 mm, brace; 1,500 mm, brace; 1,550 mm, refused. For rule R3: belt 900 mm, 75 × 50; belt 1,050 mm, 100 × 50. For the combination of rules: belt 1,200 mm at 1,500 mm high, the largest variant, with every output checked. The tests run every time the rule table or the library changes, and Chapter 7 adds tests of the generated models and drawings.

```figure
type: checklist
title: A rule is ready to automate when
caption: This is an illustration of the office's checklist. Each rule in the table is signed off against it before the configurator uses it.
- It is written as a condition and an outcome, with no unstated exceptions | reviewed by a second engineer
- Its reason refers to a calculation, test, standard or recorded experience | filed in the product file
- Its validated range is stated, and the tool refuses inputs outside it | refusal message names the rule
- It has automated tests at each boundary and one step either side | run on every change
- Its owner and revision are recorded | changes need the owner's approval
- x Rules that live only in the code or in someone's memory | move them into the table first
```

## A failure case: one character, six trestles

This is an illustration. Rule R4 was entered into the first version of the rule table as "brace when height > 950 mm". The intended rule was "> 900 mm". The typing error came from a draft that had considered 950 mm as the boundary before the engineer settled on 900 mm.

The first version of the rules library had tests for each rule, but only at values well inside each range: 600 mm and 1,200 mm for the brace rule. Both passed, because 600 mm needs no brace under either version and 1,200 mm needs one under both. The boundary was never tested.

Over the following month, the configurator produced six trestle variants at **950 mm** without braces. They passed the independent check, because the drawings were tidy and the checker trusted the tool. Two months later, a customer's site reported noticeable sway on the 950 mm trestles at start-up. The office supplied bolt-on braces and fitted them at its own cost. There were no injuries, and the conveyor's alignment was restored.

The detection came from the field, which is the most expensive place to find a fault. The investigation found the rule-table entry within an hour, because the drawings carried the rule table's revision number and the table's history showed the change. The corrections were:

1. The rule was corrected and the table's revision raised.
2. Tests were added for every rule at every boundary and one step either side, as described above. Writing them found a second, harmless error in rule R6's upper limit.
3. Every variant generated under the faulty revision was found from the generation log and checked, which confirmed the six.
4. The independent check was changed to compare each generated drawing's key features against the rule table, rather than reviewing the drawing alone.

The office's view afterwards was that the configurator had not made the error more likely, since a person could make the same typing error. It had made it more widespread and more trusted. Boundary tests and traceable rule revisions are the price of that consistency.

## Change a rule without losing track

Rules will change: a new idler supplier changes the clearance in rule R1, a customer asks for a new foot style, a field report tightens the bracing rule. Each change must be traceable to the variants it affects.

The office's process is short. The proposed change is written against the rule's number, with its reason and the evidence. The owner approves it, and the boundary tests are updated first, so that they fail on the old rule and pass on the new one. The rule table's revision is raised, and the generator stamps that revision on every drawing it produces. The generation log, which records every variant produced with its inputs and the table revision, then answers the question that always follows a rule change: which existing drawings were made under the old rule, and do any of them need to be revised or recalled?

That last step is what turned the failure case's six faulty trestles from an open-ended worry into a closed list of six.

## How this applies to a small Australian business

In small fabrication businesses, the product rules often live with one experienced designer or the workshop supervisor. Capturing them as a table with reasons is valuable even if no automation is ever built, because it protects the business when that person retires. If the product has any structural, lifting or safety function, the rules need the same engineering review as any design calculation, by someone qualified to give it. Australian structural design standards and the steel supplier's published section properties are the right basis for the real calculation file, not the simplified checks in a teaching example.

## Exercise: the boundary of R3

A customer asks for a trestle for a 1,050 mm belt but with the lighter 75 × 50 × 3 cross-member to save weight. Using the same load and model, what is the deflection, and does it meet the 1.0 mm criterion? What should the tool do with the request, and what tests would protect rule R3?

**Worked answer.** The span is **1,050 + 300 = 1,350 mm**, so **δ = 2,477 × 1,350³ ÷ (48 × 200,000 × 553,280) ≈ 1.15 mm**, over the 1.0 mm criterion by about 15%. The configurator offers no choice of cross-member: rule R3 selects the 100 × 50 section for belts over 900 mm. The request becomes a design request to the responsible engineer, who might accept it with a different criterion for a lightly loaded conveyor, recorded as a one-off, or decline it. The rule's tests are: belt 900 mm gives 75 × 50, belt 1,050 mm gives 100 × 50, belt 1,200 mm gives 100 × 50, and any request to override the section at 1,050 mm is refused with a message naming rule R3.
