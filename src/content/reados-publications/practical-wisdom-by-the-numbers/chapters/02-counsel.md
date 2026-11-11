---
book: practical-wisdom-by-the-numbers
chapterSlug: take-counsel-before-choosing
order: 2
title: "Take counsel before choosing: records, purpose and people"
description: "Use memory, understanding, docility and shrewdness to gather the facts, test whether something has changed and build a full set of options before any is chosen."
draft: true
---

Aquinas describes three acts in a prudent decision: taking counsel, judging what counsel has found, and commanding the action that follows (*Summa Theologiae* II-II q.47 a.8). Counsel comes first because a judgement can only choose among the options that inquiry has put in front of it. A team that skips counsel does not save time; it simply chooses from a shorter and usually worse list.

Counsel is not a meeting. It is the work of finding out what the past says, what the requirement is for, what other people know and which options actually exist. Aquinas treats the ability to do this well as a virtue of its own, *euboulia* or deliberating well, subordinate to prudence but distinct from it (II-II q.51 a.1 and a.2). This chapter takes the workshop through that inquiry on day zero, and ends with the option set the rest of the book evaluates.

## The parts that make counsel good

Aquinas lists eight parts that must work together for prudence to act well (II-II q.48 and q.49). Five belong to prudence as knowing: memory of the past, understanding of the present situation, docility or readiness to learn from others, shrewdness in seeing a connection quickly, and reasoning from what is known to what follows. Three belong to prudence as applying knowledge to action: foresight about what serves the end, circumspection about the circumstances, and caution against obstacles.

The list reads like a description of a competent investigation, and that is how this book uses it. The first five organise counsel in this chapter. Foresight and caution organise the risk assessment in Chapter 3, and circumspection runs through the judgement in Chapters 4 to 6.

```figure
type: compare
title: Eight parts of prudence as working questions
cols: Question for the team | Where it is used
caption: Aquinas's eight parts, translated into questions an engineering team can answer and check.
- Memory | What do our records show about past batches? | This chapter
- Understanding | What is the requirement actually for? | This chapter and Chapter 4
- Docility | Who knows something we do not? | This chapter
- Shrewdness | What explains the change, and what else does it affect? | This chapter
- Reasoning | What follows from what we now know? | This chapter
- Foresight | What could happen, and how likely is it? | Chapter 3
- Circumspection | Does this option still fit these circumstances? | Chapters 4 to 6
- *Caution | What could stop a good plan working? | Chapter 3
```

## Memory: what the records say

Aquinas grounds memory in experience: practical judgement deals with things that vary, and only a stock of remembered cases shows what usually happens (II-II q.49 a.1). In a workshop, memory is the inspection records, not what people recall.

The workshop has machined six previous batches of 240 flanges from the same foundry. Their sealing-face rejections were 5, 8, 6, 11, 7 and 9: a total of 46 rejects from 1,440 flanges, or 3.19%. The current batch has 18 rejects from 240, or 7.5%.

```figure
type: bars
title: Sealing-face rejects by batch
unit: %
caption: Six previous batches averaged 3.19%; the current batch is more than double that.
- Batch 1 | 2.08
- Batch 2 | 3.33
- Batch 3 | 2.50
- Batch 4 | 4.58
- Batch 5 | 2.92
- Batch 6 | 3.75
- *Current batch | 7.50 | 18 of 240
```

Is the difference meaningful, or could 18 rejects happen by chance at the usual rate? A quick check uses the binomial distribution. If each flange had a 3.19% chance of rejection, a batch of 240 would average about 7.7 rejects, with a standard deviation of about 2.7. The probability of 18 or more rejects at that rate is about 0.0008, or roughly one batch in 1,240. That is strong evidence that something has changed, either in the castings or in the inspection.

This is an illustration. The arithmetic is simple enough to repeat with your own records, and its value is in what it rules out. The team cannot treat the current batch as ordinary bad luck, and it cannot treat the cause as settled either. It has a question to put to the foundry.

### When memory is distorted

At the day-zero meeting the shift lead says, with confidence, that porosity "has always run at about eight per cent". The figure is wrong, but it is not dishonest. People remember vivid batches better than ordinary ones, and the worst batch in recent memory was batch 4 at 4.58%, which may have felt like more.

The error is detected by asking for the source of any number used in a decision. A remembered rate that cannot be traced to records is a hypothesis. The correction is to replace it with the recorded rate and keep the remembered one only as a prompt: if people remember porosity as common, there may be unrecorded rework that the inspection log does not show. In the case, the team checks the rework tags for the previous six batches and finds none, so the recorded rate stands.

The distortion matters because it would change the decision. If 7.5% were normal, nothing would need investigating and the next batch would be expected to look the same. If 3.19% is normal, the next batch from the foundry, already cast and in transit, may carry the same problem.

## Understanding: what the requirement is for

Aquinas describes understanding as a right grasp of the starting points of practical reasoning, including the particular end at stake (II-II q.49 a.2). For an engineering team, that means knowing why the requirement exists, not just what it says.

The specification rejects any rounded indication larger than 1.0 mm on the raised face. Its purpose is to prevent leak paths and crack initiation where the gasket seals against the flange. A pore under the gasket's contact band can let fluid track across the seal; a pore outside the band, on the part of the raised face the gasket does not touch, does not create the same leak path, although it may still matter for corrosion or for the customer's confidence.

Understanding the purpose does not license the workshop to apply its own reading of the specification. It does tell the team what information the customer's engineer will need: where each indication sits relative to the gasket contact band. The indication map from Chapter 1 now becomes essential evidence, and Chapter 4 uses it.

## Docility: who knows something we do not

Aquinas's word for this part is docility, meaning teachability: a readiness to learn from people with experience, because no one can personally survey the range of practical situations (II-II q.49 a.3). In modern terms, it is the habit of asking before deciding.

Three conversations on day zero change the picture:

1. **The foundry** confirms that it changed its moulding-sand supplier six weeks ago and has had porosity complaints from another customer. The next batch of castings for this workshop was poured after the change.
2. **The customer's engineer** explains the installation schedule. The crew will install 120 flanges in stage 1, starting on working day 8, and the remaining 120 in stage 2, starting on working day 18. The engineer also confirms that the specification allows the supplier to request a concession for a nonconforming item, with supporting evidence.
3. **The inspector** confirms that 12 of the 18 indications are rounded, between 1.1 and 1.4 mm, and sit on the outer part of the raised face. The other 6 are either inside the gasket contact band or linear.

None of these facts was in the inspection report. Each of them changes the options. The installation schedule means a partial delivery of conforming flanges on time would let stage 1 start as planned. The concession route means the workshop can ask, with evidence, rather than guess. The foundry change means the problem may continue.

## Shrewdness and reasoning: what follows

Shrewdness, in Aquinas's account, is the quick grasp of a connecting link (II-II q.49 a.4). Reasoning works from what is known to what follows from it (a.5). Together they turn facts into consequences.

The sharpest connection in the case is the one nobody asked about: if the foundry's sand change caused the porosity, the next batch is likely to be affected too, and it is already in transit. The team reasons that it should inspect a sample of the incoming castings on arrival, before machining, rather than discovering the problem at final inspection again. That is not part of today's decision about 18 flanges, but it belongs in today's record, because it is the moment the information became available.

A second connection concerns timing. Replacement castings take ten working days, and machining and inspection take about two more. Replacements ordered today would be ready on working day 12. That is six working days after the due date, but six days before stage 2 begins on day 18. The customer's real need and the purchase order's deadline are not the same thing, and the gap between them is where a good option may lie.

## Build the option set

Counsel ends with a list of options, each described well enough to be judged. One possible action is excluded at once: shipping all 240 without disclosing the indications. It would be concealment of a defect the buyer cannot see, which Aquinas treats as unjust in sale (II-II q.77 a.3), and in modern terms it would expose the workshop to claims for misleading conduct and to the consequences of a leak. An option that requires deception is not a means to the end; it abandons the end.

```figure
type: tree
title: Options after counsel on day zero
caption: Four legitimate options remain; the first branch is excluded before any scoring because it depends on concealment.
- Decision on 18 flanges with indications
  - Ship all 240 without disclosure | excluded: conceals a hidden defect
  - A. Hold the whole batch | deliver all 240 on day 12
  - B. Ship 222 now, replace 18 | second delivery on day 12
  - *C. Request a concession for 12, replace 6 | second delivery on day 12; falls back to B if refused
```

Each remaining option still needs work. The team does not yet know how likely the risks are, whether the concession is reasonable to request, what each option costs both parties, or whether the shop can actually machine the replacements in time. Those are the subjects of the next five chapters.

## Know when counsel is finished

Counsel can fail by being too short, but it can also fail by never ending. A team that keeps gathering information because the decision is uncomfortable is not being careful; it is postponing the judgement and letting the deadline make it instead.

Aquinas gives two useful limits. First, counsel is not needed for everything (I-II q.14 a.4). It is skipped for small matters that barely affect the end, and for actions whose method is already fixed by an art. In the case, there is no need to deliberate about how to clean a flange face or how to pack a crate; those are settled by procedure. Counsel is for the matters that are both uncertain and consequential: what to offer the customer, what to replace and what to promise.

Second, the inquiry is bounded at both ends (I-II q.14 a.6). It starts from the end, which is taken as given, and it stops at the first step that can be carried out now. For the workshop, the end is the reliable seal delivered to suit installation. Counsel stops when the team can name the first action of each option: order castings, prepare a concession request, book the freight. If the team cannot name a first action, counsel is not yet complete. If it can name them all and new information is no longer changing the list, counsel is finished.

A practical stopping rule follows from this:

1. Set a deadline for counsel that leaves time to act. Here, the end of day zero, because castings ordered on day 1 arrive a day later than castings ordered today.
2. List the questions that would change the option set, and the person who can answer each.
3. Stop when every question is answered, or when the remaining ones would not change which options are on the list.
4. Record the questions that remain open, so that judgement knows what it is assuming.

On day zero the only question left open is whether the customer will accept a concession, and that question cannot be answered by more internal inquiry. It can only be answered by asking. Counsel is therefore finished, and one of its outputs is the request itself.

## Record what counsel found

The decision record from Chapter 1 now gains its first substantive entries. The point of writing them down is not bureaucracy. It is that a later reviewer, perhaps the customer's engineer or the workshop's own owner, can see what was known when the options were drawn up.

| Source | Finding | Effect on the options |
|---|---|---|
| Inspection records | Usual reject rate 3.19%; current 7.5%; chance of this by luck about 0.0008 | Treat the batch as abnormal; investigate the cause |
| Re-inspection | All 18 rejections confirmed; none found among accepted faces | The finding is sound; decide on 18, not more |
| Indication map | 12 rounded, 1.1 to 1.4 mm, outside the gasket band; 6 inside or linear | Makes a concession for 12 reasonable to ask |
| Foundry | Sand supplier changed six weeks ago; next batch poured after the change | Inspect incoming castings; raise with the foundry |
| Customer's engineer | Stage 1 needs 120 from day 8; stage 2 needs 120 from day 18; concessions allowed with evidence | Partial delivery is useful; a request is legitimate |

Every row has a named source. That habit is the practical meaning of memory and docility: the decision rests on records and people, each of whom can be asked again.

## Exercise: read a different history

A second workshop has machined four batches of 200 brackets with 9, 7, 11 and 8 rejects. Its new batch of 200 has 13 rejects. Calculate the historical rate, the expected number of rejects in a batch of 200 at that rate, and decide whether the new batch is strong evidence of a change.

**Worked answer.** The four batches give 35 rejects from 800 parts, a rate of 4.375%. A batch of 200 would average 8.75 rejects, with a standard deviation of about 2.9. Thirteen rejects is about 1.5 standard deviations above the mean, and the probability of 13 or more at the historical rate is about 0.10, or one batch in ten. That is not strong evidence of a change. The prudent response is to record the result, ask the supplier whether anything has changed, and watch the next batch, but not to treat the cause as found. Compare this with the flange case, where 18 rejects had a probability of about 0.0008 at the usual rate: there, the records made the question to the foundry urgent rather than routine.
