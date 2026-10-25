---
book: performance-solutions-by-the-numbers
chapterSlug: what-a-performance-requirement-asks
order: 1
title: "What a Performance Requirement actually asks"
description: "Read a Performance Requirement clause by clause, separate its outcome from its factors, and turn the words into questions a design can be tested against."
draft: false
---

A Performance Requirement is the only mandatory technical statement in the NCC's compliance structure. Everything else, including the Deemed-to-Satisfy tables that most people think of as "the code", is one way of meeting it. A Performance Solution stands or falls on whether it meets the Performance Requirements, so the first skill is to read them precisely.

That is harder than it sounds. Performance Requirements are written in qualitative language: "safely", "appropriate to", "to the degree necessary". They do not contain numbers. This chapter takes the requirement at the centre of the running case, D1P4 on exits, and shows how to turn its words into questions that a design can be tested against.

## Where Performance Requirements sit

NCC 2022 Volume One is built in layers. Each Section begins with an Objective and Functional Statements, which explain the intent and are guidance only. The Performance Requirements follow and are mandatory. Below them sit the ways of meeting them: Deemed-to-Satisfy Provisions and Performance Solutions, assessed using the Assessment Methods in A2G2 and A2G3.

```figure
type: layers
title: The compliance structure of NCC 2022 Volume One
caption: Summarised from Parts A2 and D1 of NCC 2022 Volume One. Only the Governing and Performance Requirements are mandatory in their own right.
- Objectives and Functional Statements | guidance: what the Section is for, for example D1O1 and D1F2
- *Performance Requirements | mandatory: the level of performance to be met, for example D1P4
- Deemed-to-Satisfy Provisions | deemed to meet the Performance Requirements, for example D2D5
- Performance Solutions | any other way of meeting the Performance Requirements, shown by an Assessment Method
- Governing Requirements | mandatory rules for interpreting and applying everything above, in Section A
```

This structure is older than many people realise. The supplied BCA 2004 shows the same idea as a pyramid: Objectives and Functional Statements at the top marked as "guidance levels", Performance Requirements below them as the "compliance level", and two kinds of Building Solution underneath, Deemed-to-Satisfy Provisions and what BCA 2004 called Alternative Solutions. NCC 2022 keeps the logic, renames Alternative Solutions as Performance Solutions, and adds a required process for developing them, which Chapter 4 covers.

The NCC defines a Performance Requirement as a requirement stating the level of performance that a Performance Solution or a Deemed-to-Satisfy Solution must meet. A Deemed-to-Satisfy Solution meets it by definition. A Performance Solution must show that it does.

## Why the code is written this way

A prescriptive code tells you exactly what to build. It is easy to check and hard to argue with, but it freezes design at the moment it was written. New products, new building types and unusual sites do not fit, and every departure needs a special exemption. The BCA 2004 introduction gives the reason Australia moved away from that model: it describes both volumes as written in a performance format so that novel products, systems and designs could be used more freely.

The price of flexibility is responsibility. When a designer follows the Deemed-to-Satisfy Provisions, the code's authors have already done the safety reasoning, and the designer's job is to apply the provisions correctly. When a designer departs from them, the reasoning passes to the designer, and someone must check it. The Performance Solution process in NCC 2022 exists to make that reasoning visible, repeatable and accountable.

That has a practical consequence for owners. A Performance Solution is not a cheaper version of compliance. It moves cost from construction into analysis, review and, often, ongoing conditions. Sometimes that trade is worth making; often it is not. The running case is a good test because the Deemed-to-Satisfy alternative is cheap and known, so the Performance Solution must earn its place.

## The burden of proof

The NCC's two routes are not symmetrical. A Deemed-to-Satisfy Solution is deemed to meet the Performance Requirements; once the certifier is satisfied the provisions are followed, there is nothing further to prove. A Performance Solution starts with no such presumption. Under A2G2, it must be demonstrated using one or more Assessment Methods, through a defined process, and the appropriate authority must be satisfied by that demonstration.

In practice, that means the proponent of a Performance Solution carries the burden of proof, and the certifier's role is to test the argument, not to complete it. A good Performance Solution report reads like a well-structured engineering argument: here is the requirement, here is how we interpreted it, here is how we tested our design, here are the results, and here are the conditions under which they hold. A poor one reads like a conclusion in search of support.

## Reading D1P4

D1P4 is the Performance Requirement for exits. In summary, it requires exits that allow occupants to evacuate safely, with their number, location and dimensions appropriate to:

1. the travel distance;
2. the number, mobility and other characteristics of occupants;
3. the function or use of the building;
4. the height of the building;
5. whether the exit is from above or below ground level.

Read slowly, the clause has three parts. There is a **subject**: exits. There is an **outcome**: occupants can evacuate safely. And there is a list of **factors** that the number, location and dimensions of exits must be appropriate to. The factors are not a checklist to tick; they are the things a designer must account for when arguing that the outcome is achieved.

The Functional Statement for egress, D1F2, helps with the meaning of "safely". It says that a building's means of evacuation should give occupants time to evacuate safely without being overcome by the effects of an emergency. That is the idea that fire engineers turn into the comparison of available and required escape time in Chapter 7. Functional Statements are guidance, not requirements, but they are the best evidence of what a Performance Requirement is for.

## Translating the factors into the running case

This is an illustration. The running case's question is whether a single stair at the east end of a 190 m² storage mezzanine, with a farthest point about 28 m from the top riser, gives exits that allow safe evacuation. Each D1P4 factor becomes a fact to establish:

```figure
type: compare
title: D1P4 factors translated into the running case
cols: Fact to establish | Running case answer
caption: This is an illustration. The answers become inputs to the design brief in Chapter 4; each needs a source.
- Travel distance | distance from the farthest point to the exit, measured as D2D20 describes | about 28 m along the aisles to the top riser
- Number of occupants | D2D18 count, or a documented lower figure | 7 persons at 30 m² per person for storage
- Mobility and characteristics | who uses the space and how fit and familiar they are | stores staff, trained and familiar with the building
- *Function or use | what happens on the mezzanine and what it holds | storage of tooling and fixtures; combustible packaging
- Height | how far above the floor occupants are | deck 3.0 m above a workshop with a 6.0 to 7.5 m roof
- Above or below ground | direction of travel to safety | down one flight to the workshop floor, then out
```

Two of the answers deserve attention. **Height** looks trivial for a 3.0 m deck, but it matters in a fire: occupants on the mezzanine are above the workshop floor, closer to the hot smoke layer that collects under the roof. **Function or use** sets the fire load on and under the mezzanine. A storage mezzanine full of cardboard-packed tooling is different from one holding steel bar.

## What the requirement does not say

D1P4 does not say "20 m". The number comes from D2D5(3), a Deemed-to-Satisfy Provision. A Performance Solution is not required to meet 20 m; it is required to meet D1P4. That is the whole point of the performance route, and also its main risk: without a number, someone has to decide what "safely" means for this building and how it will be demonstrated.

The NCC gives that decision a structure. Under A2G2(1), a Performance Solution is achieved by demonstrating either compliance with all relevant Performance Requirements, or that the solution is at least equivalent to the Deemed-to-Satisfy Provisions. The second route gives the qualitative words an anchor: if the DTS design is deemed safe, a design shown to be at least as safe meets the requirement. Chapter 3 develops that comparison.

## Two routes for the running case

The running case can take either route in A2G2(1).

**Direct compliance with D1P4.** The engineer would set an absolute measure of safety, typically that occupants on the mezzanine reach a place of relative safety before conditions there become untenable, and show by analysis that the east-end stair achieves it with margin. This route needs fire modelling of smoke conditions on the mezzanine, which is substantial work for a seven-person store.

**Equivalence with the Deemed-to-Satisfy Provisions.** The engineer would compare the proposed layout with a DTS-compliant reference layout and show that occupants are at least as safe in the proposal. If the fire and the mezzanine are the same in both, much of the analysis cancels out, and the comparison can focus on what actually differs: the travel route and anything added to compensate for it.

The second route is usually the right one for a small, local departure like this. It does not need to prove that the DTS layout itself is safe; the code has already deemed it so. Chapter 3 sets up the reference layout, and Chapters 6 and 7 do the comparison.

## Words that carry weight

A few words in Performance Requirements repay attention:

- **"Occupants"** includes everyone who may reasonably be in the space, not only the regular staff. Visitors, contractors and new starters are occupants too, and they do not know the building.
- **"Safely"** is not "without any risk". It is the level of safety the code accepts, which is why comparison with the DTS Provisions is such a useful anchor.
- **"Appropriate to"** links the outcome to the factors. A design that is appropriate for seven trained stores staff may not be appropriate for twenty visitors on a training day.

Each of those words will reappear as a condition or limitation in the final report in Chapter 10. That is a sign that the reading was done properly: the solution's limits trace back to the requirement's words.

## The error: an opinion presented as a demonstration

The owner's first approach to a fire safety engineer was an email:

> The mezzanine is open, people can see the whole workshop from it, and only a few stores staff ever go up there. 28 m is fine.

Each statement may be true, and each could become part of an argument. But the email contains no measure of safety, no comparison, no assessment method and no evidence. It is an opinion. Opinions can be Expert Judgement, which A2G2(2) accepts as an Assessment Method, but only when they come from a person with the qualifications and experience to make that judgement, and only when the reasoning is set out so that others can examine it (Chapter 9).

The engineer replied with three questions that turned the opinion into a project:

1. Safe compared with what? Against D1P4 directly, or by comparison with a DTS-compliant layout?
2. Measured how? What scenarios, what inputs and what acceptance criteria?
3. Agreed by whom? Who needs to accept the brief before analysis starts?

The questions also protect the owner. A Performance Solution built on an unexamined opinion can be rejected late, after the mezzanine has been ordered, or approved and then found inadequate if something goes wrong. Either outcome costs more than the analysis would have.

That reply is the right instinct for anyone reading a Performance Solution proposal. If the answer to "compared with what, measured how, agreed by whom" is missing, there is not yet a Performance Solution.

## Reading other Performance Requirements the same way

The method in this chapter works for any Performance Requirement. A few patterns recur across Volume One:

- **"To the degree necessary".** Many requirements, such as C1P1 on structural stability in fire and C1P4 on safe conditions for evacuation, require something to the degree necessary, followed by factors. The phrase does not mean "as little as possible". It means the provision must be proportionate to the factors listed.
- **Factor lists.** The factors tell you what the regulators thought mattered. If your argument ignores a listed factor, expect the certifier to ask about it.
- **Limitations and exclusions.** Some requirements state where they do not apply, for example to parts of certain classes. Read those first; they can remove a requirement from your list entirely.
- **Defined terms.** Words in italics in the NCC are defined in Schedule 1. "Exit", "path of travel" and "fire compartment" all have precise meanings that change what a requirement covers.

```figure
type: checklist
title: Reading record for D1P4 in the running case
caption: This is an illustration. The record is the first page of the Performance Solution file.
- x Subject, outcome and factors of D1P4 separated
- x Functional Statement D1F2 noted as guidance on the meaning of "safely"
- x Each factor translated into a fact with a source
- x Deemed-to-Satisfy limit identified: D2D5(3), 20 m to an exit or two-way point
- ? Route chosen: direct compliance or equivalence with the DTS Provisions | for the design brief
- ? Other Performance Requirements affected | Chapter 2
```

## Exercise: read a different requirement

C1P4 requires, in summary, that materials and assemblies resist the spread of fire and limit the generation of smoke, heat and toxic gases, to the degree necessary to maintain tenable conditions during evacuation, appropriate to the evacuation time, the number, mobility and other characteristics of occupants, the function or use of the building and any active fire safety systems. Separate its subject, outcome and factors, and say which factors the mezzanine proposal might affect.

**Worked answer.** The **subject** is materials and assemblies, meaning linings, finishes and other building materials. The **outcome** is tenable conditions during evacuation: resisting fire spread and limiting smoke, heat and toxic gases. The **factors** are evacuation time; the number, mobility and other characteristics of occupants; the function or use of the building; and active fire safety systems.

The mezzanine proposal could affect **evacuation time**, because a longer travel distance means longer exposure, and **active fire safety systems**, if detection is added as part of the solution. It does not change the materials themselves, but it changes the time over which those materials must keep conditions tenable. That is a reason to ask, in Chapter 2, whether C1P4 belongs on the list of relevant requirements. Reading the factors is how you find connections that the Deemed-to-Satisfy clause numbers alone would not reveal.
