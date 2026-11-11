---
book: yes-and-no-when-sources-disagree
chapterSlug: when-good-sources-disagree
order: 1
title: "When good sources disagree: build a conflict register"
description: "How to turn a pile of conflicting documents into a register of exact claims, convert them to one comparable quantity and classify each disagreement before choosing anything."
draft: false
---

A disagreement between sources usually reaches an engineer as a question that sounds simple. What torque do these bolts get? What is the pressure rating of this hose? Which revision of the drawing do we make the part to? Behind the question sits a pile of documents, each written by someone competent, each giving a different answer.

The tempting response is to pick one. People choose the most official-looking document, the most recent, the one their supervisor trusts, or the number most of the sources agree on. Each of those rules works some of the time, and each fails in a way nobody notices until a joint leaks or a part is rejected. This chapter sets up a slower first step: write every claim down exactly, convert the claims to a quantity that can be compared, and classify the disagreement before deciding anything.

## The planner's question

This is an illustration. A maintenance planner at a process plant is preparing the work pack to replace the discharge spool on a cooling-water pump skid. The spool has three DN100 flanged joints. Joint J1 connects the spool to the pump's grey cast iron discharge flange. Joints J2 and J3 are steel-to-steel joints at a valve and at the downstream pipe. Every joint has eight M16 × 2 bolts of property class 8.8, with a compressed-fibre gasket.

The planner needs a tightening value for the work instruction. In one afternoon she finds five answers:

1. The **site torque card** on the workshop wall lists "M16 8.8: 226 N·m".
2. The **gasket maker's installation sheet** lists "M16: 135 N·m, threads and nut faces lubricated".
3. The **pump general arrangement drawing**, revision B, carries a note: "FLANGE BOLTS TORQUE 23".
4. A **contractor's spreadsheet**, left from an earlier shutdown, gives "M16 flange bolts 312 N·m (per standard)".
5. The **pump installation manual** says that bolts on the pump's own flanges must not be tightened above 110 N·m with clean, dry threads.

Five sources, five numbers, from 23 to 312 N·m. Each looks authoritative to someone. The fitters on the night shift will use whichever one is printed in the work pack.

## Write each claim exactly

The first job is to record what each source actually says, not what people remember it saying. A conflict register is a table with one line per claim and enough detail that someone else could find the same words in the same document.

```figure
type: compare
title: The planner's conflict register, first entries
cols: Exact words | Document and revision | Conditions stated
caption: This is an illustration. Each line records a claim word for word, with where it came from and what it says about conditions. Nothing is corrected at this stage.
- S1 site torque card | M16 8.8: 226 N·m | Workshop card, undated | None stated
- S2 gasket maker | M16: 135 N·m | Installation sheet, issue 4 | Threads and nut faces lubricated
- S3 pump drawing | FLANGE BOLTS TORQUE 23 | General arrangement, rev B | No unit given
- S4 contractor spreadsheet | M16 flange bolts 312 N·m (per standard) | File from an earlier shutdown | Standard not named
- *S5 pump manual | Do not exceed 110 N·m | Installation manual, section on pipe connections | Pump flanges only, clean dry threads
```

Several rules keep the register honest:

- **Copy the words, including their gaps.** If a note has no unit, the register says "no unit given". Writing "23 N·m" because that is what everyone assumes would hide the most important fact about that source.
- **Record the document, not the person.** "Dave says 226" is a lead, not a source. The register line is the card Dave reads from, with a photograph of it.
- **Record the revision and date.** A source without a revision cannot be checked for supersession later.
- **Record the stated conditions separately from the number.** Lubrication, temperature, gasket type, tool type and sequence are part of the claim.
- **Record the scope.** S5 applies to "the pump's own flanges", which covers J1 but not J2 or J3. Scope is easy to lose when a number is copied into a table.

Abelard's *Sic et non* worked in a similar way. It set opposed passages side by side, each attributed, so that a reader could examine exactly what each authority said. John Marenbon, in the *Cambridge Companion to Abelard*, describes Abelard using the collection rather as a modern scholar might use a card index. A conflict register is the engineer's version: a working collection that keeps the claims in front of you while you test them.

## Ask the real question

The planner's question is "what torque?", but torque is not what the joint needs. A gasketed flange needs enough clamping force to seat the gasket and hold the pressure, without overloading the bolts, the gasket or the flanges. Torque is a means of producing that force, and the link between them depends on friction.

The bolt torque and preload relation, written T = K × F × d, ties tightening torque T to bolt preload F through the nominal diameter d and a nut factor K. K lumps together thread friction, nut-face friction and geometry. For plain dry steel it is often around 0.2. With a suitable lubricant it can be much lower. The [Bolted Joints by the Numbers chapter on the nut factor](/reados/publications/bolted-joints-by-the-numbers/torque-and-the-nut-factor/) explains where K comes from and why it scatters.

So the question becomes: **what preload does each joint need, and what tightening method will produce it reliably?** That restatement does two useful things. It gives the sources a common quantity to be compared in, and it shows that a torque value without its friction condition is half a claim.

## Convert every claim to the same quantity

The [bolt torque and preload tool](/tools/bolt-torque-preload/) in BIZOMAT Tools calculates the tensile stress area of a metric bolt, its proof load from the proof stress you enter, and either the torque for a target preload or the preload produced by a given torque, using T = K F d. It reports the bolt stress and the share of proof load. It does not know your actual friction; you supply K.

For an M16 × 2 bolt the tool gives a tensile stress area of 156.67 mm². With the bolt supplier's certificate showing a proof stress of 600 MPa (this is an illustration), the proof load is **94.0 kN**.

To compare the five claims, the planner makes one provisional assumption for each and writes it beside the result: K = 0.20 where the source says nothing about lubrication, and K = 0.12 where it calls for a lubricant, using the figure the lubricant supplier gives for steel bolts. Those assumptions are part of the register too. They will be tested in later chapters.

```figure
type: bars
title: Preload each source would produce in an M16 8.8 bolt
unit: kN
max: 100
caption: This is an illustration. Results from the bolt torque and preload tool. S3 is read as N·m for now. S4 exceeds the proof load of 94.0 kN; S5 is a ceiling for J1 only, not a target.
- S1, 226 N·m at K = 0.20 | 70.6
- S2, 135 N·m at K = 0.12 | 70.3
- S3, 23 read as N·m, K = 0.20 | 7.2
- *S4, 312 N·m at K = 0.20 | 97.5
- S5, 110 N·m at K = 0.20, maximum | 34.4
```

The chart changes the conversation. S1 and S2, which looked 91 N·m apart, produce almost the same preload: 70.6 kN and 70.3 kN, about 75% of proof load in both cases. Their disagreement in torque may be no disagreement at all about the joint. S3, read literally, would leave the bolts nearly loose at 7.6% of proof load, which is implausible for a pump flange and suggests that the note has been misread. S4 would load the bolts to 103.7% of proof load even with dry threads, and much further with lubricated ones. S5 is a different kind of claim altogether: a maximum for one joint, not a target for all three.

## Classify the disagreement

Logicians distinguish between kinds of opposition, and the distinction matters in practice because each kind calls for a different response.

- **Contradictory claims** cannot both be true and cannot both be false. "The nut faces must be lubricated" and "the nut faces must not be lubricated" are contradictories for a given joint: exactly one is right, and the work cannot proceed until you know which.
- **Contrary claims** cannot both be true, but both can be false. "The torque for J2 is 226 N·m" and "the torque for J2 is 312 N·m" are contraries if each is offered as the single correct value. Both could be wrong; the right answer might be neither.
- **Compatible claims** only look opposed. A maximum and a target, a value for one joint and a value for another, or a dry torque and a lubricated torque for the same preload can all be true together.

In the register, S1 and S2 are compatible once their friction conditions are written down; they are two routes to the same preload. S5 is compatible with both for J2 and J3, because it does not apply to them, but it conflicts with S1 and S2 for J1, where 70 kN is twice the preload that S5's ceiling allows. S4 is contrary to S1 and S2: all three cannot be the right target. S3 cannot be classified until its unit is known.

That classification takes ten minutes and reduces five competing answers to three open questions. What is S3's unit? Where did S4's number come from? And how should J1 be treated, given S5?

## The failure case: choosing by rule of thumb

Suppose the planner had skipped the register and applied one of the usual rules.

**"Follow the standard."** S4 is the only source that mentions a standard. Printed in the work pack, 312 N·m on dry 8.8 bolts gives 97.5 kN, over the 94.0 kN proof load. If the fitters lubricate the threads, as some do by habit, the tool gives 162.5 kN at K = 0.12, about 173% of proof load. Some bolts would yield during tightening, some would break, and the survivors would be stretched past the point where their preload can be trusted. The failure would be found when a bolt snapped on the wrench, or later as a leak.

**"Follow the most recent document."** The gasket sheet is issue 4 and the newest. Used on its own, 135 N·m with lubricant gives the right preload for J2 and J3, but on J1 it would still be about twice the pump maker's limit, risking a cracked cast iron flange.

**"Follow the majority."** No two sources give the same number, so a majority rule produces no answer at all, or an average with no physical meaning. The mean of the five numbers, about 161 N·m, describes no tightening condition anyone has specified.

Each rule fails for the same reason. It treats the sources as votes rather than as claims with meanings, origins and conditions. The register is how you detect that failure before the work pack is issued: if a rule picks a value whose converted preload is over proof load, under any plausible clamping need or outside a manufacturer's limit, the rule has failed.

## The method in eight steps

The rest of this book works through the planner's three open questions, using a sequence that follows Abelard's list of explanations and adds the ones engineers need.

```figure
type: steps
title: Working a conflict from register to closure
caption: Each step tests one explanation for the disagreement. Only claims that survive steps 2 to 6 are real conflicts to decide in step 7.
- Register | record every claim exactly, with its document, revision, scope and conditions (this chapter)
- Meaning | check whether the sources use the same words for different things (Chapter 2)
- Copying | look for transcription errors, lost units and superseded revisions (Chapter 3)
- Origin | trace each number to where it was first stated (Chapter 4)
- Conditions | test whether each claim is right under different circumstances (Chapter 5)
- Measurement | when the evidence itself disagrees, check what each method measures (Chapter 6)
- Decide | settle surviving conflicts by authority, consequence and evidence (Chapter 7)
- *Close | record the decision and correct every source that caused the conflict (Chapter 8)
```

The order matters. Meaning and copying errors are cheap to find and common, so they come first. Tracing origins takes longer. Testing conditions may need calculation, and measurement needs time on the job. Only conflicts that survive all of those deserve a formal decision between authorities.

The method also has a stopping rule. If a step resolves the conflict, record the resolution and move on; there is no need to run every step on every claim. If a step cannot be completed, for example because a document's origin cannot be traced, say so in the register and carry the uncertainty forward.

## Who runs the register

A register is most useful when one person owns it and others can add to it. In the case, the planner owns it. The fitters are asked to report any other source they use, the reliability engineer reviews the conversions, and the pump maker's local representative is asked about S3 and S5. Nobody is asked which number they prefer.

The register should stay with the job record. When the next shutdown comes, the question "why did we use this value?" has an answer that does not depend on anyone's memory.

Abelard's own collection was meant to provoke questions rather than settle them. He thought that persistent questioning was the main route to understanding, and that doubt honestly pursued led to inquiry and then to the truth. The register has the same purpose. Its first output is not an answer but a short list of precise questions that can be answered.

## Exercise: two more claims arrive

While the register is being reviewed, two more claims arrive. A fitter says the crew has "always done these up to about 200 with the rattle gun". The valve maker's data sheet for the valve at J2 says "flange bolt torque 180 N·m, lubricated threads".

Add both to the register, convert each to preload where you can, and classify them against S1 and S2.

**Worked answer.** The fitter's claim is not a document, so it is recorded as a lead: "Crew practice, verbal, impact wrench, setting described as about 200." An impact wrench does not apply a controlled torque, so no preload conversion is valid. The register line should say exactly that, and the follow-up is to ask whether any controlled tightening has ever been used on these joints.

The valve maker's claim is a document with stated conditions. With the bolt torque and preload tool at d = 16 mm, P = 2 mm, proof stress 600 MPa and K = 0.12, 180 N·m gives F = 180,000 ÷ (0.12 × 16) = **93.75 kN**, which is **99.7% of the 94.0 kN proof load**. The claim is contrary to S1 and S2 as a target for J2: it would put the bolts at their proof load. That makes it a priority question for Chapter 4. Possible explanations include a value written for a higher bolt grade, a different nut factor assumed by the valve maker, or a value intended for a different bolt size. Until it is traced, it must not go into the work pack.
