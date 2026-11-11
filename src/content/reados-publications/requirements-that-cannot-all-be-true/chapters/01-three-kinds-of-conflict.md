---
book: requirements-that-cannot-all-be-true
chapterSlug: three-kinds-of-conflict
order: 1
title: "Three kinds of conflict: contradictory, physically impossible and improbable requirements"
description: "How to register a specification's requirements, screen them in pairs and sets, find the premise that links them, and sort each conflict into contradictory, physically impossible or improbable."
draft: false
---

A specification is a promise made in advance about a thing that does not exist yet. Each requirement narrows the set of machines that could keep the promise. Add enough requirements and the set can become empty. Nobody notices, because each line was written by a different person for a good reason, and none of them is unreasonable on its own.

This chapter sets out a method for noticing. It sorts conflicts between requirements into three kinds, because each kind is detected differently and resolved differently. It then applies the method to the inspection station request that runs through this book, and ends with the conflict that was found too late on an earlier job.

## The request for quote

This is an illustration. The applications engineer at a small machine builder receives a request for quote for an automated inspection station. The customer, a fabricator, wants to check hole positions on welded frames up to 1,500 mm long. The station has one long axis: a ball screw drives a carriage along a fixed beam, and the carriage carries a touch probe above the part. The request lists twelve requirements and attaches the customer's general engineering conditions.

```figure
type: compare
title: The twelve requirements in the request for quote
cols: Requirement | Who asked for it | Why, as stated
caption: This is an illustration. The register records each requirement with its origin and stated purpose. The purpose column is the one most often left blank, and it matters most in Chapters 8 and 9.
- R1 | Travel 1,500 mm | Production | Longest frame made
- R2 | Rapid traverse 1.0 m/s | Production | Short cycle time
- R3 | Positioning accuracy ±0.010 mm over the full travel | Quality | Hole tolerance on the frames
- R4 | Accuracy held from 15 to 35 °C, no air conditioning | Facilities | Workshop is not conditioned
- R5 | Moving mass 60 kg (carriage and probe head) | Supplier of the probe head | Head and cabling as quoted
- R6 | Probe tip sag no more than 0.010 mm anywhere on the travel | Quality | Same as R3
- R7 | Beam no deeper than 120 mm and no heavier than 75 kg | Maintenance | Hoist clearance; rated load of the existing uprights
- R8 | Life 20,000 hours | Engineering manager | Five years of two shifts
- R9 | Maintenance-free | Maintenance | No spare fitter hours
- R10 | Zero backlash | Quality | Probing in both directions
- R11 | Axis cost no more than A$9,000 excluding GST | Purchasing | Budget for the station
- R12 | Acceptance: 30 runs at 1,000 mm, Cpk at least 1.67 at 95% confidence | Quality | Customer's capability rule
```

The general engineering conditions add one more line, G1: every lubrication point must be accessible and serviced to the maker's schedule. The engineer adds it to the register, because a requirement in an attachment is still a requirement.

## Three kinds of conflict

Philosophers of religion distinguish two forms of the argument from evil. Andrea Weisberger, in *The Cambridge Companion to Atheism*, describes the logical form as the claim that a set of statements is inconsistent, and the evidential form as the claim that the evidence makes one of them improbable. She also makes a point that applies directly to specifications. A set of claims rarely contradicts itself on its face. The contradiction appears only when a further premise is added, one that connects the claims. J. L. Mackie's version of the argument supplied such a premise, and the argument stands or falls with it.

Requirements behave the same way. Three kinds of conflict are worth separating.

- **Contradictory requirements** cannot both be true of any machine, whatever the physics. The conflict lies in the words. "Maintenance-free" and "every lubrication point serviced to the maker's schedule" contradict each other once "maintenance-free" is read as "needs no lubrication". The linking premise is a definition.
- **Physically impossible requirements** are consistent as words but break a physical law when taken together. A 1,500 mm travel, a 1.0 m/s traverse and a small, cheap screw are three separate requirements; the critical speed of a rotating shaft connects them. The linking premise is a law of nature or a relation that every design must obey.
- **Improbable requirements** can be met, but only rarely, or can be met but only rarely shown to be met. A machine might truly hold a capability index of 1.67, yet fail a 30-run test of it most of the time. The linking premise is a probability: the conflict is with the evidence, not the machine.

The three kinds need different evidence. A contradiction is shown by reading carefully and agreeing a definition. A physical impossibility is shown by a calculation. An improbable requirement is shown by a probability, often by simulating the acceptance test.

```figure
type: tree
title: Sorting a suspected conflict
caption: The question at each level is what premise turns separate requirements into a conflict. The answer decides what evidence will settle it.
- Suspected conflict between two or more requirements
  - The words cannot both be true | Contradictory: settle by definition
    - Example: maintenance-free against servicing every lubrication point
  - The words are consistent, but a law connects them | Physically impossible: settle by calculation
    - Example: travel, speed and screw size against critical speed
  - The machine can comply, but rarely, or rarely be shown to | Improbable: settle by probability
    - Example: a 30-run test of a capability index
```

## Single attributes and combinations

Patrick Grim's chapter in the same Companion surveys arguments that a being with a given set of attributes cannot exist. He notes that some arguments attack a single attribute, showing that it is incoherent by itself, while others attack a combination, showing that two attributes, each coherent alone, cannot belong to the same thing.

Specifications have both. A single requirement can be incoherent by itself: "zero backlash" in a mechanism that must also move freely is, at the limit, a demand for a joint with no clearance and no friction. Chapter 2 deals with these. Most conflicts, though, are combinations, and combinations are harder to see because no single author wrote them. Production wrote R2. Maintenance wrote R7. Purchasing wrote R11. The conflict among them belongs to nobody, so nobody looks for it.

Grim also cites a puzzle, from J. L. Cowan, that is almost an engineering exercise. A survival course asks each student to build, unaided, a boat that will carry its builder and that its builder can carry overland. Some students manage it. The task is not contradictory, because a strong builder can do both. It is a combination of two powers that pull in opposite directions: more buoyancy means more boat to carry. Engineering requirements of this shape, stiffer but lighter, faster but longer, cheaper but more accurate, are the main business of this book.

## The method: register, screen, link, classify

The method has four steps. It takes an hour or two for a specification of this size and saves weeks later.

```figure
type: steps
title: Screening a specification for conflicts
caption: Done before quoting. The output is a short list of conflicts, each with its linking premise and its kind.
- Register every requirement | Number each one, including those in attachments and general conditions, with who asked for it and why.
- Screen pairs and sets | Mark pairs that touch the same physical quantity: speed, length, mass, stiffness, accuracy, temperature, cost, life.
- Name the linking premise | For each marked set, write the definition, law or probability that connects them.
- Classify and test | Decide whether the conflict is contradictory, physical or improbable, and do the reading, calculation or simulation that settles it.
- Report with the purpose | For each real conflict, record the stated purpose of each requirement involved; that is where the resolution will come from.
```

### Screening by shared quantities

The quickest screen is to list the physical quantities each requirement touches and look for quantities shared by requirements from different authors. The engineer's screen of the request produces this.

```figure
type: compare
title: Quantities shared by the requirements
cols: Requirements touching it | Suspected linking premise | Kind to test
caption: This is an illustration. Each row is a set of requirements that share a quantity. Rows with requirements from several authors are the ones to test first.
- Screw speed | R1, R2, R11 | Critical speed of a long screw | Physical
- Preload and friction | R8, R9, R10, G1 | Rated life depends on load, including preload; life assumes lubrication | Contradictory and physical
- Position error | R3, R4, R12 | Thermal growth of a 1.5 m screw; capability test statistics | Physical and improbable
- Beam section | R5, R6, R7 | Deflection of a beam depends on its second moment of area, which depends on depth and mass | Physical
- Cost | R11 and nearly everything | Price of larger screws, ground screws, scales | Physical in effect
- Probe clearance | R1, R7 and the frame tolerance | Tolerance stack from floor to probe tip | Improbable
```

The screen does not prove anything. It points to where proof is needed. Chapters 3 to 7 do the proving, one row at a time.

## Why the linking premise matters

Naming the premise does two jobs. It tells you what calculation settles the question, and it tells you where the argument can be attacked.

Take the first row. The customer can reasonably say: "Why can't a screw spin fast?" The answer is not "because it can't". It is that a slender shaft has a speed at which it whirls, set by its diameter, its length, the way its ends are held and its material. That relation is the premise. Once it is on the table, the customer and the engineer can argue about its inputs, such as whether the end bearings could be fixed at both ends, but not about whether the conflict exists. A conflict reported without its premise sounds like an opinion. A conflict reported with its premise is a calculation anyone can check. Stating the premise turns a disagreement about opinions into a disagreement about inputs, and inputs can be measured.

Naming the premise also prevents a common mistake: treating a physical impossibility as a contradiction, and so trying to settle it by negotiating words. No amount of rewording will make a 25 mm screw spin safely at 2,400 rpm over 1,850 mm. Equally, treating a contradiction as physical wastes calculation on what is really a disagreement about meaning. Maintenance-free cannot be calculated; it must be defined.

## The failure case: a conflict found at commissioning

The machine builder learned this method the hard way. This is an illustration. Two years earlier it quoted a pick-and-place gantry against a specification that called for 2.0 m/s and ±0.05 mm repeatability on a 2,000 mm axis. The quote was priced on a belt-driven axis, which met the speed comfortably. Nobody checked the two requirements together. At commissioning the axis met its speed and repeated to ±0.12 mm. The belt's stretch under the acceleration needed for 2.0 m/s was the linking premise. Nobody had named it.

The fix was a linear scale and a slower acceleration ramp, at the builder's cost, and a three-week delay. The customer then found that the slower ramp cost almost nothing in cycle time, because the moves were too short for the axis ever to reach 2.0 m/s. The speed requirement had been written from the catalogue figure, not from the work.

### How it is detected and corrected

The failure is detected by a screen like the one above, done before the price is set. Any two requirements that share a quantity and come from different authors are tested against their linking premise. The correction has two parts. The conflict is reported to the customer with its premise and its calculation. Then each requirement in the conflict is traced back to its stated purpose, because the purpose, not the number, is what has to be met. In the gantry's case, the purpose of 2.0 m/s was a cycle time, and the cycle time could be met at a lower speed.

## Contradictions are cheap to fix and easy to miss

Of the three kinds, contradictions cost least to resolve, because they need only a decision about meaning. They are also the easiest to miss, because they often sit in different documents. G1 sits in an attachment that the engineering manager who wrote R9 had never read.

The engineer resolves the R9 and G1 contradiction with one question to the customer: what does maintenance-free mean to you? The answer comes back the next day. Maintenance wants no task more often than the annual shutdown, and no task that needs a fitter to remove guards during production. That is a definition a design can meet. Chapter 2 deals with words like this, which promise more than anyone meant.

## Improbable requirements are the ones most often mis-sorted

The third kind deserves a warning, because it is the one most often treated as one of the other two. When an acceptance test is failed, the usual conclusion is that the machine failed. Sometimes it did. Sometimes the machine was fine and the test was the kind that a fine machine usually fails.

The difference shows up only when you ask what the test would do to a machine that met the requirement exactly. If a compliant machine would pass nine times in ten, a failure is real evidence against the machine. If a compliant machine would pass only one time in ten, a failure says almost nothing, and the requirement has quietly become a demand for a much better machine than the one specified. The customer thinks it has asked for a capability of 1.67. In effect it has asked for a capability above 2.1, because that is what it takes to pass its own test reliably. Chapter 7 does that calculation for R12.

Improbable requirements also arise without any test. A requirement that every assembly must fit, when the parts are made by processes with normal variation, is a requirement that the worst combination of parts must fit. That may be physically possible but so expensive that nobody would pay for it, and a design that meets it nearly always would be accepted by anyone who understood the numbers. The honest statement is a probability: the share of assemblies that may fall outside the limit, and what happens to them.

## Reporting a conflict so it can be resolved

A conflict report that says "R2 cannot be met" invites an argument. One that names every requirement in the conflict, the premise that links them, the calculation and its inputs, and the stated purpose of each requirement invites a decision. The machine builder now writes every conflict up in the same short form.

```figure
type: checklist
title: What a conflict report contains
caption: One page per conflict. The report goes to the customer with the quote, before any price is fixed.
- The requirements in conflict | by number, with their wording and author
- The kind of conflict | contradictory, physically impossible or improbable
- The linking premise | the definition, law or probability that connects them
- The evidence | the reading, calculation or simulation, with its inputs and their sources
- The purpose of each requirement | what each one is for, as stated or as confirmed with its author
- The options | which requirement could move, by how much, and what each option costs
- ? Who decides | the person with authority to change each requirement
```

The last line is often the hardest. A requirement written by purchasing can usually be changed only by purchasing, and one written by the customer's quality department only by quality. A conflict among requirements from three departments needs a decision from someone who can speak for all three. The report should name that person, or ask the customer to.

The report also states what is not in conflict. In the inspection station request, R1 and R5 conflict with nothing by themselves; they are inputs to the calculations that test other requirements. Saying so keeps the conversation on the conflicts that matter and stops the customer from suspecting that the whole specification is being rejected.

## Exercise: classify four conflicts

Classify each of the following as contradictory, physically impossible or improbable, name the linking premise, and say what evidence would settle it.

1. A fixture must clamp a casting "rigidly" and allow the casting to "float" to find its own datum.
2. A lifting beam must be no deeper than 150 mm, carry 2 t at mid-span over 3 m, and deflect less than 1 mm.
3. A supplier must show, from a 20-part first article, that its process has a Cpk of at least 2.0 at 95% confidence.
4. A drive must be "fail-safe" and "never stop the conveyor unexpectedly".

**Worked answer.**

1. **Contradictory**, at first reading. "Rigidly" and "float" cannot both describe the same degree of freedom at the same moment. The linking premise is a definition: which directions, and when. Most fixtures resolve this by sequence: float while locating against the datums, then clamp. A rewritten requirement states the sequence.
2. **Physically impossible or not, depending on a calculation.** The words are consistent; the premise is beam bending theory, which relates load, span, depth and stiffness. A beam sizing calculation settles it. Chapter 6 works a case of exactly this shape.
3. **Improbable.** A process may truly have a Cpk of 2.0, but a 20-part study gives a wide confidence bound, so a capable process would usually fail to show it. The premise is the sampling distribution of Cpk; a capability confidence calculation or a simulation settles it. Chapter 7 covers this.
4. **Contradictory as written**, because a fail-safe drive stops the conveyor when it detects a fault, which is by definition unexpected. The premise is the definition of fail-safe. The resolution is to separate the two purposes: stop safely on a fault, and reduce nuisance faults so that unexpected stops are rare. If "fail-safe" protects people, it is decided under work health and safety law, not traded against availability in a specification review.
