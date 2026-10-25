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
type: svg
title: The compliance structure of NCC 2022 Volume One
alt: The compliance structure of NCC 2022 Volume One. Objectives and Functional Statements: guidance: what the Section is for, for example D1O1 and D1F2. Performance Requirements: mandatory: the level of performance to be met, for example D1P4. Deemed-to-Satisfy Provisions: deemed to meet the Performance Requirements, for example D2D5. Performance Solutions: any other way of meeting the Performance Requirements, shown by an Assessment Method. Governing Requirements: mandatory rules for interpreting and applying everything above, in Section A
caption: Summarised from Parts A2 and D1 of NCC 2022 Volume One. Only the Governing and Performance Requirements are mandatory in their own right.
viewbox: 0 0 640 324
body:
<g class="kf-a kd1">
<rect class="bx" x="20" y="10" width="600" height="56" rx="6"/>
<text class="txb" x="36" y="33">Objectives and</text>
<text class="txb" x="36" y="52">Functional Statements</text>
<text class="tx" x="250" y="33">guidance: what the Section is for, for example D1O1</text>
<text class="tx" x="250" y="51">and D1F2</text>
</g>
<g class="kf-a kd2">
<rect class="bxa" x="30" y="72" width="580" height="56" rx="6"/>
<text class="txb" x="46" y="95">Performance</text>
<text class="txb" x="46" y="114">Requirements</text>
<text class="tx" x="250" y="95">mandatory: the level of performance to be met, for</text>
<text class="tx" x="250" y="113">example D1P4</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="40" y="134" width="560" height="56" rx="6"/>
<text class="txb" x="56" y="157">Deemed-to-Satisfy</text>
<text class="txb" x="56" y="176">Provisions</text>
<text class="tx" x="250" y="157">deemed to meet the Performance Requirements, for</text>
<text class="tx" x="250" y="175">example D2D5</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="50" y="196" width="540" height="56" rx="6"/>
<text class="txb" x="66" y="219">Performance</text>
<text class="txb" x="66" y="238">Solutions</text>
<text class="tx" x="250" y="219">any other way of meeting the Performance</text>
<text class="tx" x="250" y="237">Requirements, shown by an Assessment Method</text>
</g>
<g class="kf-a kd5">
<rect class="bx" x="60" y="258" width="520" height="56" rx="6"/>
<text class="txb" x="76" y="281">Governing</text>
<text class="txb" x="76" y="300">Requirements</text>
<text class="tx" x="250" y="281">mandatory rules for interpreting and applying</text>
<text class="tx" x="250" y="299">everything above, in Section A</text>
</g>
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
type: svg
title: D1P4 factors translated into the running case
alt: D1P4 factors translated into the running case. Travel distance: Fact to establish distance from the farthest point to the exit, measured as D2D20 describes; Running case answer about 28 m along the aisles to the top riser. Number of occupants: Fact to establish D2D18 count, or a documented lower figure; Running case answer 7 persons at 30 m² per person for storage. Mobility and characteristics: Fact to establish who uses the space and how fit and familiar they are; Running case answer stores staff, trained and familiar with the building. Function or use: Fact to establish what happens on the mezzanine and what it holds; Running case answer storage of tooling and fixtures; combustible packaging. Height: Fact to establish how far above the floor occupants are; Running case answer deck 3.0 m above a workshop with a 6.0 to 7.5 m roof. Above or below ground: Fact to establish direction of travel to safety; Running case answer down one flight to the workshop floor, then out
caption: This is an illustration. The answers become inputs to the design brief in Chapter 4; each needs a source.
viewbox: 0 0 640 395
body:
<g class="kf-a kd1">
<rect class="fs" x="20" y="10" width="600" height="33" rx="4"/>
<text class="txb" x="188.9" y="31">Fact to establish</text>
<text class="txb" x="421.7" y="31">Running case answer</text>
</g>
<g class="kf-a kd2">
<path class="lf" d="M20 111H620"/>
<text class="txb" x="28" y="64">Travel distance</text>
<text class="tx" x="188.9" y="64">distance from the farthest</text>
<text class="tx" x="188.9" y="82">point to the exit, measured as</text>
<text class="tx" x="188.9" y="100">D2D20 describes</text>
<text class="tx" x="421.7" y="64">about 28 m along the aisles</text>
<text class="tx" x="421.7" y="82">to the top riser</text>
</g>
<g class="kf-a kd3">
<path class="lf" d="M20 163H620"/>
<text class="txb" x="28" y="132">Number of</text>
<text class="txb" x="28" y="151">occupants</text>
<text class="tx" x="188.9" y="132">D2D18 count, or a documented</text>
<text class="tx" x="188.9" y="150">lower figure</text>
<text class="tx" x="421.7" y="132">7 persons at 30 m² per</text>
<text class="tx" x="421.7" y="150">person for storage</text>
</g>
<g class="kf-a kd4">
<path class="lf" d="M20 215H620"/>
<text class="txb" x="28" y="184">Mobility and</text>
<text class="txb" x="28" y="203">characteristics</text>
<text class="tx" x="188.9" y="184">who uses the space and how fit</text>
<text class="tx" x="188.9" y="202">and familiar they are</text>
<text class="tx" x="421.7" y="184">stores staff, trained and</text>
<text class="tx" x="421.7" y="202">familiar with the building</text>
</g>
<g class="kf-a kd5">
<rect class="bxa" x="20" y="215" width="600" height="68" rx="4"/>
<path class="lf" d="M20 283H620"/>
<text class="txb" x="28" y="236">Function or use</text>
<text class="tx" x="188.9" y="236">what happens on the mezzanine</text>
<text class="tx" x="188.9" y="254">and what it holds</text>
<text class="tx" x="421.7" y="236">storage of tooling and</text>
<text class="tx" x="421.7" y="254">fixtures; combustible</text>
<text class="tx" x="421.7" y="272">packaging</text>
</g>
<g class="kf-a kd6">
<path class="lf" d="M20 333H620"/>
<text class="txb" x="28" y="304">Height</text>
<text class="tx" x="188.9" y="304">how far above the floor</text>
<text class="tx" x="188.9" y="322">occupants are</text>
<text class="tx" x="421.7" y="304">deck 3.0 m above a workshop</text>
<text class="tx" x="421.7" y="322">with a 6.0 to 7.5 m roof</text>
</g>
<g class="kf-a kd7">
<path class="lf" d="M20 385H620"/>
<text class="txb" x="28" y="354">Above or below</text>
<text class="txb" x="28" y="373">ground</text>
<text class="tx" x="188.9" y="354">direction of travel to safety</text>
<text class="tx" x="421.7" y="354">down one flight to the</text>
<text class="tx" x="421.7" y="372">workshop floor, then out</text>
</g>
<rect class="lf" x="20" y="10" width="600" height="375" rx="4" fill="none"/>
<path class="lf" d="M180.9 10V385"/>
<path class="lf" d="M413.7 10V385"/>
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
type: svg
title: Reading record for D1P4 in the running case
alt: Reading record for D1P4 in the running case. Done: Subject, outcome and factors of D1P4 separated. Done: Functional Statement D1F2 noted as guidance on the meaning of "safely". Done: Each factor translated into a fact with a source. Done: Deemed-to-Satisfy limit identified: D2D5(3), 20 m to an exit or two-way point. Open: Route chosen: direct compliance or equivalence with the DTS Provisions, for the design brief. Open: Other Performance Requirements affected, Chapter 2
caption: This is an illustration. The record is the first page of the Performance Solution file.
viewbox: 0 0 640 395
body:
<g class="kf-a kd1">
<rect class="bx" x="20" y="12" width="600" height="39" rx="6"/>
<circle class="bxa" cx="40" cy="29" r="11"/>
<path class="la draw" pathLength="1" d="M34 29l4 4 8-8"/>
<text class="txb" x="64" y="32">Subject, outcome and factors of D1P4 separated</text>
</g>
<g class="kf-a kd2">
<rect class="bx" x="20" y="59" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="76" r="11"/>
<path class="la draw" pathLength="1" d="M34 76l4 4 8-8"/>
<text class="txb" x="64" y="79">Functional Statement D1F2 noted as guidance on the meaning of</text>
<text class="txb" x="64" y="98">"safely"</text>
</g>
<g class="kf-a kd3">
<rect class="bx" x="20" y="125" width="600" height="39" rx="6"/>
<circle class="bxa" cx="40" cy="142" r="11"/>
<path class="la draw" pathLength="1" d="M34 142l4 4 8-8"/>
<text class="txb" x="64" y="145">Each factor translated into a fact with a source</text>
</g>
<g class="kf-a kd4">
<rect class="bx" x="20" y="172" width="600" height="58" rx="6"/>
<circle class="bxa" cx="40" cy="189" r="11"/>
<path class="la draw" pathLength="1" d="M34 189l4 4 8-8"/>
<text class="txb" x="64" y="192">Deemed-to-Satisfy limit identified: D2D5(3), 20 m to an exit or</text>
<text class="txb" x="64" y="211">two-way point</text>
</g>
<g class="kf-a kd5">
<rect class="bxi" x="20" y="238" width="600" height="78" rx="6"/>
<circle class="bxi" cx="40" cy="255" r="11"/>
<text class="txa" x="40" y="260" text-anchor="middle">?</text>
<text class="txb" x="64" y="258">Route chosen: direct compliance or equivalence with the DTS</text>
<text class="txb" x="64" y="277">Provisions</text>
<text class="tx" x="64" y="298">for the design brief</text>
</g>
<g class="kf-a kd6">
<rect class="bxi" x="20" y="324" width="600" height="59" rx="6"/>
<circle class="bxi" cx="40" cy="341" r="11"/>
<text class="txa" x="40" y="346" text-anchor="middle">?</text>
<text class="txb" x="64" y="344">Other Performance Requirements affected</text>
<text class="tx" x="64" y="365">Chapter 2</text>
</g>
```

## Exercise: read a different requirement

C1P4 requires, in summary, that materials and assemblies resist the spread of fire and limit the generation of smoke, heat and toxic gases, to the degree necessary to maintain tenable conditions during evacuation, appropriate to the evacuation time, the number, mobility and other characteristics of occupants, the function or use of the building and any active fire safety systems. Separate its subject, outcome and factors, and say which factors the mezzanine proposal might affect.

**Worked answer.** The **subject** is materials and assemblies, meaning linings, finishes and other building materials. The **outcome** is tenable conditions during evacuation: resisting fire spread and limiting smoke, heat and toxic gases. The **factors** are evacuation time; the number, mobility and other characteristics of occupants; the function or use of the building; and active fire safety systems.

The mezzanine proposal could affect **evacuation time**, because a longer travel distance means longer exposure, and **active fire safety systems**, if detection is added as part of the solution. It does not change the materials themselves, but it changes the time over which those materials must keep conditions tenable. That is a reason to ask, in Chapter 2, whether C1P4 belongs on the list of relevant requirements. Reading the factors is how you find connections that the Deemed-to-Satisfy clause numbers alone would not reveal.
