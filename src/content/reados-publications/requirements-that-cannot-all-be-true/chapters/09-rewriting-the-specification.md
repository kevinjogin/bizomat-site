---
book: requirements-that-cannot-all-be-true
chapterSlug: rewriting-the-specification
order: 9
title: "Rewriting the specification: keeping every purpose and recording every change"
description: "How to issue a rewritten specification that removes its conflicts without diluting what each requirement was for, screen it again for new conflicts, assess the change and record who approved it."
draft: false
---

The meeting in Chapter 8 ended with agreement. Production gave up 1.0 m/s, purchasing raised the budget, quality accepted a referenced accuracy and a longer acceptance test, and maintenance accepted an annual servicing task. Agreement in a meeting is not yet a specification. Until the changes are written into a controlled revision, checked for new conflicts and approved by the people who own each requirement, the old request is still the document that someone will pick up at acceptance.

This chapter takes the agreement to a finished specification. It checks that the rewrite keeps every purpose, screens it again, assesses the change, and records the decision in a form that will still make sense when the people in the meeting have moved on.

## The test of a good rewrite

Patrick Grim notes that a term defended by endless redefinition can survive while losing everything that made it worth defending. A rewritten specification faces the same risk. It is easy to remove every conflict by weakening every requirement until nothing is left to conflict. That would produce a specification a machine could meet and the customer would not want.

The test of a good rewrite is therefore not that the conflicts are gone. It is that every purpose behind the original requirements is still served. The engineer checks each requirement against the purpose its author gave in Chapter 1.

```figure
type: compare
title: Each purpose, before and after the rewrite
cols: Original requirement | Rewritten requirement | Purpose still served?
caption: This is an illustration. Every purpose survives. What changed is the means, the reference conditions and the method of proof. Chapter numbers show where each change was justified.
- Short cycle time (production) | R2: 1.0 m/s rapid | 0.5 m/s rapid; 59.5 s cycle (Ch. 3) | Yes: under one minute
- Hole tolerance (quality) | R3, R4: ±0.010 mm at 15 to 35 °C | ±0.010 mm referred to 20 °C, scale and compensation (Ch. 5) | Yes, now definite
- Hole tolerance (quality) | R6: sag no more than 0.010 mm | Repeatable within 0.002 mm after mapping (Ch. 6) | Yes
- Probing both ways (quality) | R10: zero backlash | Reversal error no more than 0.003 mm (Ch. 2) | Yes
- Scarce fitter hours (maintenance) | R9: maintenance-free | Annual shutdown tasks only, listed (Ch. 2, 4) | Yes
- Five years of two shifts (engineering) | R8: 20,000 hours | 20,000 machine hours, duty and reliability stated (Ch. 4) | Yes
- Budget (purchasing) | R11: A$9,000 | A$10,400 excluding GST, reason recorded (Ch. 8) | Changed by its owner
- Confidence in capability (quality) | R12: 30 runs, Cpk 1.67 at 95% | At least 450 runs at three positions, stability shown (Ch. 7) | Yes, now achievable
```

Only one purpose changed: purchasing's budget, and that was changed by its owner with the reason in front of them. Every other row keeps its purpose and changes only how it is stated or proved. That is the difference between restating a requirement and diluting it.

## Screen the rewrite again

A rewrite introduces new means, and new means can create new conflicts. The engineer repeats the screen from Chapter 1 on the rewritten specification, looking for quantities that the changes have newly connected.

```figure
type: checklist
title: The second screen
caption: This is an illustration. Two new conflicts appeared and both were resolved before issue. One question stays open with the scale maker.
- Scale and servicing | a linear scale must be kept clean in a fabrication shop; resolved with a sealed scale and an annual inspection, added to the shutdown task list
- Sag map and structure | mapping is valid only while the beam cannot move; resolved by dowelling the beam to the uprights after alignment (Ch. 6)
- Extended probe search and cycle time | the rare extended search adds seconds; accepted, logged, within the one-minute target (Ch. 7)
- Fixed–supported screw and temperature | the free end slides as the screw warms; no conflict with a scale, since the screw no longer sets position
- ? Scale and welding fume | the scale maker to confirm the seal's suitability near welding; open, due before design release
```

The open item is recorded as open. A specification that claims to have no open questions is less trustworthy than one that lists them with owners and dates.

## Assess the change

The rewrite changes the basis on which the station was budgeted. The customer's project manager, who owns the station's overall budget of A$48,000 excluding GST and its schedule of 90 working days remaining, wants the effect stated before signing.

The [change impact assessment](/tools/change-impact/) in BIZOMAT Tools turns a change's additional cost, schedule effect, risk increase, quality impact and expected benefit into an impact rating out of 100, comparing cost and days with the current project value and remaining schedule. It reports the benefit less the added cost, flags schedule effects above 10% of the remaining time and high quality impacts for sign-off, and reminds the user to confirm who has authority to approve the change.

This is an illustration. The engineer enters the A$1,400 added to the axis budget, against the A$48,000 station, and 7 days of design time for the temperature compensation and mapping routine, against 90 remaining. She rates the risk increase 2 of 5 and the quality impact 2 of 5, since the rewrite raises quality assurance rather than lowering it. The benefit is the A$4,400 saved against option A, the only design that would have kept 1.0 m/s.

```figure
type: stats
title: Change impact of adopting the rewritten specification
caption: This is an illustration. From the change impact assessment. The tool rates the change low impact; its checks pass, and its final check, authority to approve, is answered in the decision record below.
- 23 / 100 | Impact score | Low impact
- 2.9% | Cost increase | A$1,400 on A$48,000
- 7.8% | Schedule increase | 7 days of 90 remaining
- * A$3,000 | Benefit less added cost | A$4,400 saved against option A, less A$1,400
```

A low score does not make the change automatic. It tells the project manager that the change is small relative to the project and that its benefit exceeds its direct cost. The remaining question is the tool's last check: who has the authority to approve it?

## Record the decision

Each changed requirement gets a decision record. The records go into the revised specification as an appendix, so that anyone reading the specification later can see what was changed, why and by whom.

```figure
type: steps
title: What each decision record contains
caption: One record per changed requirement. The calculation is attached, not summarised, so a later reader can check it.
- The requirement | its number, original wording and author
- The conflict | the requirements it conflicted with, the linking premise and the kind of conflict
- The evidence | the calculation or test, with inputs, tool and result, attached
- The change | the new wording, with its quantity, condition and test
- The purpose check | the original purpose and how the new wording still serves it
- The approval | the owner of the requirement, and of any requirement it traded against, with date
- The conditions | anything the change depends on, such as dowelled supports or the annual inspection
- The review trigger | what would reopen the decision, such as a heavier probe head or a new frame size
```

The last two lines are the ones most often left out, and they are what make a record useful years later. The sag-mapping decision depends on the beam not moving; the life decision depends on the preload not changing. When either changes, the record says that the decision must be revisited, and points to the calculation that will need rerunning.

## Issue the revision and supersede the original

The rewritten specification is issued as a controlled revision, B, superseding revision A, the request for quote. Both the customer and the builder sign it. The original request is marked superseded on every copy each party holds, not filed beside the new one. A resolved conflict stays resolved only when every document that caused it is corrected or withdrawn; a superseded request left in a project folder is a conflict waiting to return.

## Handing the specification to the design team

Revision B goes to the builder's design team with its decision records, and the records change how the design is reviewed. Without them, a design review checks the drawings against the numbers in the specification. With them, it can also check against the purposes, which matters when a detail decision touches a requirement that was traded.

Two examples from the station show why. During detailed design, a designer proposes a lighter probe bracket that moves the probe tip 40 mm further from the scale, to clear a cable. The specification's numbers say nothing about the probe offset. The decision record for accuracy does: it shows the error budget from Chapter 5, with the Abbe error proportional to the offset, and the worst-afternoon total already just over the allowance. The reviewer reruns the budget with the new offset, finds that it makes the margin worse, and asks for another route for the cable instead.

Later, purchasing proposes a cheaper screw from a second supplier with a lower dynamic rating. The specification's life requirement is still met on paper. The decision record for life shows the preload as a share of the rating, so the reviewer sees at once that the same preload force is now a larger share, reruns the duty-cycle life, and confirms the margin is still comfortable before agreeing. Neither check would have happened if the reviewer had only the numbers.

The general point is that a specification records what was decided, and a decision record records why. Designers need both, because most of the decisions that later undo a specification are made in detail, by people who were not at the meeting, for reasons that seem unrelated to it.

## When the customer will not agree

Not every customer agrees to a rewrite. Some insist on the specification as written, out of contractual habit, because a competitor has quoted it, or because the people who own the requirements will not meet. The builder then has three honest choices, and one dishonest one.

The first honest choice is to quote with exceptions, each with its calculation attached, as Chapter 8 described. The customer can then compare quotes on a fair basis and decide whether the exceptions matter. The second is to quote the rewritten specification as an alternative alongside a refusal to quote the original, explaining why. The third is to decline to quote. None is comfortable; all leave the builder able to stand behind what it has said.

The dishonest choice is to quote the original specification without exception, knowing that it cannot be met. Apart from the commercial risk of a dispute at commissioning, a supplier that represents that its equipment will meet requirements it knows it cannot meet risks misleading the customer. The Australian Consumer Law prohibits misleading or deceptive conduct in trade, and that prohibition applies between businesses as well as to consumers. A quote is a representation. The ACCC's guidance for small business notes that a verbal claim can be misleading even if it is contradicted or clarified in writing, for example in a contract, so what a sales lead says about performance matters as much as the quote's terms. This book is not legal advice; a business unsure of its position should seek it. The builder's internal rule from Chapter 8, that no quote leaves the office with an unresolved conflict report, protects the customer and the builder alike.

## What finding conflicts early is worth

The failure cases in this book share a pattern. The gantry in Chapter 1, the whirling screw in Chapter 3, the preload change in Chapter 4, the winter acceptance test in Chapter 5, the stale sag map in Chapter 6, the first article study in Chapter 7, the best-endeavours fixture in Chapter 8 and the unrecorded meeting above were each caused by a conflict, or a condition, that existed on paper before any metal was cut. Each could have been found with a calculation that takes an hour or less. Each was found instead at commissioning or in service, where it cost a scale, a nut, a payment dispute, a repeated test or a delay of weeks.

That is the argument for the method, and it is a commercial argument as much as an engineering one. Screening a specification takes a few hours of an applications engineer's time. It can be done before the price is fixed, when changes cost nothing but a conversation. And it produces quotes that a customer can trust, because they say plainly which requirements will be met, how, and on what evidence.

## The failure case: the meeting that nobody wrote down

This is an illustration. On an earlier job, the builder and a customer agreed in a meeting to change an acceptance test, much as in Chapter 7. The engineer who attended wrote it in her notebook. The customer's quality engineer who ran the acceptance test months later had not been at the meeting and worked from the original specification. The machine failed the original test, as the calculation had predicted it would. The builder produced the notebook. The customer produced the specification, which was the only signed document. The machine was accepted after a second, longer test, at the builder's cost.

### How it is detected and corrected

The failure is detected by a simple question before any work starts: is every agreed change in a signed revision of the specification? If the answer is no, the original still governs. The correction is to issue the revision before design, with decision records and signatures, and to mark the superseded document on both sides. Anything less leaves the agreement depending on the memories of the people who were in the room.

## What the book has done

The inspection station request began with twelve requirements and one attached condition, written by five people, each reasonable on its own. Taken together, they could not be met. Some contradicted each other once their words were read carefully. Some broke physical limits together, which calculation proved. One was an acceptance test that a compliant machine would usually fail. The method that found them was the same each time: register the requirements, look for shared quantities, name the premise that links them, and classify the conflict so that the right kind of evidence can settle it.

The resolutions came, every time, from the purposes. Once a conflict was proved, the question of what each requirement was for became easy to ask and quick to answer. The rewritten specification meets every purpose but one, and that one was changed by its owner with the evidence in front of them.

## Exercise: a decision record for the speed requirement

Write the decision record for R2, the rapid traverse speed, using the structure above and the results from Chapters 3 and 8.

**Worked answer.**

- **Requirement:** R2, "Rapid traverse 1.0 m/s", written by production.
- **Conflict:** with R1 (travel 1,500 mm) and R11 (axis budget A$9,000), through the critical speed of the screw over an 1,850 mm span. Physically impossible for a screw-driven axis within the builder's catalogue and budget.
- **Evidence:** ball screw critical speed and buckling tool: at 1.0 m/s only a 40 mm screw with fixed ends runs within 80% of critical. Cycle model: 1.0 m/s saves 2.21 s on a 59.50 s cycle, about 3.7 station hours a year. Two-option comparison: option B scores 344 against option A's 243. Calculations attached.
- **Change:** "Rapid traverse 0.5 m/s; cycle time for the reference 24-hole frame no more than 60 s."
- **Purpose check:** production's purpose was a cycle under one minute; the rewritten requirement states that purpose directly, and option B meets it at 59.50 s.
- **Approval:** production lead, as owner of R2; purchasing lead, as owner of R11, which the change affects; date of revision B.
- **Conditions:** the reference frame and its 24 holes; acceleration of 5 m/s².
- **Review trigger:** a new frame with many more holes or longer moves, or a production target below 60 s, reopens the decision; rerun the cycle model and the critical speed check.
