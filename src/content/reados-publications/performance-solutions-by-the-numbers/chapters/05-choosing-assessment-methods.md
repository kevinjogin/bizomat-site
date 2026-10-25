---
book: performance-solutions-by-the-numbers
chapterSlug: choosing-assessment-methods
order: 5
title: "Choosing and combining the Assessment Methods"
description: "Compare the NCC's four Assessment Methods, see what a Verification Method looks like in the code, and choose a proportionate combination for a small egress departure."
draft: false
---

A Performance Solution has to be demonstrated, and the NCC says how. A2G2(2) of NCC 2022 Volume One lists four Assessment Methods, which can be used alone or in combination. Each has strengths and limits, and each carries a defined meaning. Using the wrong one, or using the right one under the wrong name, weakens a solution even when the engineering is sound.

This chapter describes the four methods, shows what a Verification Method in the code looks like, explains why the Fire Safety Verification Method was not used for the running case, and sets out the combination that was.

## The four methods

Under A2G2(2), the Assessment Methods for a Performance Solution are:

1. **Evidence of suitability** under Part A5, showing that a material, product, form of construction or design meets a Performance Requirement or a DTS Provision.
2. **A Verification Method**, either one in the NCC or another that the appropriate authority accepts for determining compliance with the Performance Requirements.
3. **Expert Judgement**, meaning the judgement of an expert with the qualifications and experience to determine whether a solution complies.
4. **Comparison with the Deemed-to-Satisfy Provisions.**

For a Deemed-to-Satisfy Solution, A2G3(2) lists only two: evidence of suitability and Expert Judgement. That difference is informative. A DTS design does not need to be verified or compared; it needs evidence that its products are suitable and, occasionally, an expert's judgement on whether something complies with a provision.

The list has not changed in substance for two decades. The supplied BCA 2004, in clause A0.9, listed documentary evidence, Verification Methods (the code's own or those the appropriate authority accepts), comparison with the DTS Provisions and Expert Judgement. What has changed is the framework around them: the brief, the evaluation against agreed criteria and the final report in A2G2(4).

```figure
type: compare
title: The four Assessment Methods in NCC 2022 A2G2(2)
cols: Good at | Limits
caption: Summarised from NCC 2022 Volume One. Most real Performance Solutions combine two or more methods, each used where it is strongest.
- Evidence of suitability, Part A5 | showing that a product or system performs as tested or certified | covers only the configuration tested or certified
- Verification Method | a defined test or calculation with stated criteria | only where a suitable method exists and its conditions are met
- Expert Judgement | qualitative questions where no method or data exists | only as good as the expert's competence and stated reasoning
- *Comparison with the DTS Provisions | local departures where the DTS design is a fair benchmark | needs a fair reference and consistent measurement
```

## What a Verification Method looks like

The NCC defines a Verification Method as a test, inspection, calculation or other method that determines whether a Performance Solution complies with the relevant Performance Requirements. The code's own Verification Methods are worth reading even when you do not use them, because they show the level of definition the code expects.

C1V1 is a compact example. It verifies part of C1P2, the requirement to avoid fire spreading between buildings on adjoining allotments. It does so by setting out the radiant heat flux a building may emit at various distances from the boundary, and the heat flux a building must be able to withstand without ignition. C1V2 does the same for buildings on the same allotment, with different distances.

```figure
type: compare
title: Heat flux limits in two NCC 2022 Verification Methods
cols: C1V1, adjoining allotments | C1V2, same allotment
caption: Values from Tables C1V1 and C1V2 of NCC 2022 Volume One, as summarised on NCC Online. Shown here only to illustrate how a Verification Method states its criteria numerically.
- 80 kW/m² | at the boundary | at 0 m
- 40 kW/m² | at 1 m | at 2 m
- 20 kW/m² | at 3 m | at 6 m
- 10 kW/m² | at 6 m | at 12 m
```

Notice what the method provides: a quantity to calculate, the points at which to calculate it and the limits it must meet. A designer who follows it does not need to argue about what "avoid the spread of fire" means; the method has already turned the words into numbers.

Other Verification Methods in Volume One take different forms. D1V1 is a physical test of wire barriers. D1V2 verifies access requirements by comparison with a reference building modelled on the DTS Provisions. D1V3 sets measurable criteria for wheelchair ramps.

## The Fire Safety Verification Method

C1V4 is the Fire Safety Verification Method. It verifies C1P1 to C1P9 and requires a performance-based design brief prepared with stakeholders, a fire strategy, a required level of safety at least equivalent to the DTS Provisions, and a final report, all in accordance with the ABCB's Fire Safety Verification Method Standard. D1V4 then verifies the egress requirements D1P4 to D1P7 where the building is designed in accordance with C1V4.

The Fire Safety Verification Method is a whole-building approach. It is designed for buildings where the fire safety strategy as a whole is being engineered, not for a single local departure. Using it for the running case would mean engineering the fire safety of the whole workshop to verify a travel distance on a seven-person mezzanine. The engineer judged that disproportionate, and the brief records that judgement and the reason. The Standard itself is not quoted in this book, because its full text was not read for it. For a new building whose whole fire strategy is being engineered, or for a large building with several interacting departures, the Fire Safety Verification Method may well be the right choice, and the brief should consider it before setting it aside.

## Choosing a combination for the running case

This is an illustration. The brief for the mezzanine stair uses three methods, each for the part of the argument it handles best:

```figure
type: decision
title: Assessment Methods for each part of the running case argument
question: Which method demonstrates this part of the solution?
caption: This is an illustration. The combination and the reasons are written into the brief and repeated in the final report.
- *Escape time compared with the DTS reference | comparison with the DTS Provisions, supported by a stated time-line calculation | Chapters 3, 6 and 7
- Detection, alarm and direction signs perform as specified | evidence of suitability under Part A5 | Chapter 8
- Stair foot clear zone reduces the chance of the route being blocked | Expert Judgement, with reasons | Chapter 9
- Whole-building fire safety | not engineered; remains Deemed-to-Satisfy | outside the solution
```

The time-line calculation in Chapter 6 is part of the comparison, not a separate Verification Method. It is a tool for comparing two designs on agreed inputs. It does not verify compliance with D1P4 in absolute terms, and it would not be presented as doing so.

## The error: calling a calculation a Verification Method

The first draft of the final report described the time-line calculation as "the Verification Method adopted". The certifier asked which Verification Method was meant. It was not one of the NCC's, and it had not been put to the appropriate authority for acceptance as another Verification Method under A2G2(2)(b).

The fix was to describe the method accurately: comparison with the DTS Provisions under A2G2(2)(d), supported by a time-line calculation whose inputs and method were agreed in the brief. Nothing in the engineering changed. But the label matters, for two reasons. A Verification Method carries an implication that its criteria are already accepted, so a reader might assume the comparison was more authoritative than it was. And a certifier who accepts a misdescribed method is accepting something other than what the report claims. The error was caught because the certifier read the method's name as a defined term, which is how the NCC uses it.

The same trap exists with other defined words. "Verified", "certified", "tested" and "deemed to satisfy" all have meanings in the NCC or in the evidence schemes it refers to. A report that uses them loosely, for example describing a supplier's calculation as "certified" or a product as "tested" when only a similar product was tested, invites the reader to rely on something that is not there. The running case's engineer adopted a simple rule for the final report: any NCC defined term is used only in its defined sense, and everything else is described in plain words.

## Strengths and weaknesses of each method in practice

**Evidence of suitability** is the most concrete method and the least flexible. A test report shows how a product performed in a test, in a configuration. It says nothing about a different configuration. Chapter 8 returns to this.

**Verification Methods** are the most authoritative when they fit. Their weakness is coverage: there is no Verification Method for most local departures, and forcing a design into a method that does not fit, or claiming one that does not exist, is worse than using another method honestly.

**Expert Judgement** fills gaps that no data or method covers, and almost every Performance Solution needs some. Its weakness is that it can disguise opinion as analysis. The NCC defines it as the judgement of an expert with the qualifications and experience to determine compliance, and a credible judgement states the expert's basis, reasoning and limits. Chapter 9 covers it in detail.

**Comparison with the DTS Provisions** is usually the most practical method for a local departure, because it uses the code's own benchmark. Its weakness, covered in Chapter 3, is that it depends on a fair reference and consistent measurement.

## Who decides whether a method is acceptable

The NCC does not leave the choice of method entirely to the designer. A Verification Method other than those in the code must be one the appropriate authority accepts, and the appropriate authority is the person or body with the statutory power to approve the building, which for most projects means the certifier acting under state law. In practice, the certifier's acceptance of the overall approach is sought at the brief stage, because a method that the certifier will not accept is wasted work.

That makes the brief meeting in Chapter 4 the natural place to settle methods. The running case's brief stated the methods, the reasons for each and the reason for not using the Fire Safety Verification Method, and the certifier confirmed them in writing. If the certifier had preferred a different method, for example requiring smoke modelling of the mezzanine rather than a comparative time-line, the brief would have changed before any analysis was done, not after.

## Methods are used for DTS Solutions too

It is easy to think of Assessment Methods as something only Performance Solutions need. A2G3(2) shows otherwise: a DTS Solution is also assessed, using evidence of suitability and Expert Judgement. Every fire door, penetration seal and barrier in a DTS building needs evidence that it is suitable, and many DTS questions need judgement about how a provision applies.

The running case had several examples outside the Performance Solution. Whether the owner's floor-fixed shelving counts as a built obstruction for measuring travel distance was a judgement, agreed with the certifier. Whether the storage mezzanine is an area normally used by occupants for the access provisions was a judgement with stated reasons. Recognising these as Expert Judgement, and recording who made them and why, brings the same discipline to the DTS parts of the building as to the Performance Solution.

## Writing the method section of the final report

The final report must state the Assessment Methods used, under A2G2(4)(d). A method section that will survive review does four things:

1. Names each method by its NCC term and clause: "comparison with the Deemed-to-Satisfy Provisions under A2G2(2)(d)", not "engineering analysis".
2. Pairs each method with the requirement or part of the argument it addresses, as in the method register below.
3. Says what each method cannot show, so that the reader does not over-read the result.
4. Explains why methods that might have been expected, such as the Fire Safety Verification Method, were not used.

The third point is the one most often missing. A comparison shows that the proposal is no worse than the reference on the measures compared; it does not show that either is safe in absolute terms, and it says nothing about measures that were not compared. Stating that plainly is not a weakness of the report. It is what makes the report trustworthy.

## Proportion and combination

The right combination is the lightest one that demonstrates every relevant requirement with confidence. In the running case:

- D1P4 and C1P4 are addressed by the comparison of escape time, with sensitivity analysis.
- C1P1 and C1P2 are addressed by the same comparison: if escape is no slower than in the DTS reference, the structure and separation are not asked to perform for longer.
- E4P2 is addressed by direction signs, evidenced as compliant products and positioned by the designer, with the wayfinding reasoning recorded as Expert Judgement.
- E4P3 and Part E2, if the added detection and alarm bring them in, are addressed by specifying the system to the relevant standard and evidencing it.

Every requirement in the register from Chapter 2 now has a method beside it. That is the test of a complete method section: no requirement without a method, and no method without a requirement. A method listed with nothing to demonstrate is usually a sign of padding; a requirement with no method is a gap that a reviewer will find.

```figure
type: checklist
title: Method register for the running case
caption: This is an illustration. Each line pairs a relevant Performance Requirement with the method that demonstrates it.
- x D1P4 exits | comparison with the DTS Provisions, with sensitivity
- x C1P4 safe conditions; C1P1 and C1P2 | the same comparison; escape no slower than the reference
- x E4P2 exit identification | evidence of suitability for signs; Expert Judgement on positions
- x Detection and alarm, E4P3 and Part E2 if affected | evidence of suitability; system to the relevant standard
- x Fire Safety Verification Method | considered; not used, as disproportionate to the departure
- ? Peer review of the Expert Judgement elements | Chapter 9
```

## Exercise: match a method to a claim

A designer proposes a different solution: replacing the mezzanine's DTS barrier with a cable barrier made by a supplier who says it "meets the code". Which Assessment Method fits, and what would you ask for?

**Worked answer.** The claim is about a product, so **evidence of suitability** under Part A5 is the main method. NCC 2022 also has a specific Verification Method for wire barriers, **D1V1**, which verifies parts of D1P3 through a prescribed test of a prototype or installed barrier, with a test report. That makes D1V1 the natural route if the barrier departs from the DTS Provisions for barriers.

Ask for: a test report to D1V1 from an Accredited Testing Laboratory, for the same wire type, spacing, tension and post spacing as proposed; or another form of evidence under A5G3 that covers the exact configuration. "Meets the code" in a brochure is not evidence. If the installed barrier differs from the tested one, for example with wider post spacing, the evidence does not cover it, and either a new test or a different method is needed.
