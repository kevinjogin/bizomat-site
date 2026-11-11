---
book: practical-wisdom-by-the-numbers
chapterSlug: rate-what-could-go-wrong
order: 3
title: "Look ahead with foresight and caution: rating what could go wrong"
description: "Use foresight and caution to rate the risks of each option on a shared likelihood and consequence scale, then add controls and re-rate before any option is preferred."
draft: true
---

Counsel produced a list of options. Before any of them can be judged, the team needs to know what each could lead to. Aquinas calls this part of prudence foresight, and he ranks it as the principal one: the ability to look ahead to things not yet done and to order present means towards a distant end (*Summa Theologiae* II-II q.49 a.6). He pairs it with caution, the guarding against obstacles and chance events that could defeat a good plan, while admitting that rare and unforeseeable dangers cannot all be anticipated (II-II q.49 a.8).

Foresight is not prophecy. Nobody in the workshop can know whether a particular flange will leak in five years. What foresight asks is narrower and more useful: given what we know, what could happen under each option, how likely is it, how bad would it be, and what can we do now to make it less likely or less harmful? This chapter answers those questions for the flange decision using a shared rating scale, and shows how a risk score can mislead if it is asked to do a job it was never built for.

## Use a scale everyone shares

A risk rating is only useful if two people rating the same risk would give similar answers. That requires written descriptors for each level of likelihood and consequence, agreed before the ratings are made. Without them, one person's "possible" is another's "likely", and the scores measure temperament rather than risk.

This is an illustration. The workshop uses the five-level descriptors below. They are invented for teaching; a real organisation should use its own documented risk criteria.

| Level | Likelihood descriptor | Consequence descriptor |
|---|---|---|
| 1 | Rare: not expected in the life of the item | Minor: no effect on function; cosmetic only |
| 2 | Unlikely: could occur but not expected | Moderate: rework or delay with no effect on the customer's operation |
| 3 | Possible: might occur in the life of the item | Significant: delay to the customer's project or a warranty claim |
| 4 | Likely: will probably occur | Major: in-service leak, outage or significant repair cost |
| 5 | Almost certain: expected to occur | Severe: injury, environmental release or extended outage |

The BIZOMAT [risk rating tool](/tools/risk-score/) multiplies a likelihood rating from 1 to 5 by a consequence rating from 1 to 5 to give a score out of 25. It bands scores of 1 to 6 as low, 7 to 14 as medium and 15 to 25 as high, and it suggests a typical response for each band: accept and monitor, mitigate with an owner, or treat before proceeding. It also flags any consequence rated 5 as needing controls even when the likelihood is low. It does not supply the descriptors. That part of the work stays with the team.

```figure
type: formula
title: How the risk rating is calculated
formula: Risk score = Likelihood × Consequence
caption: The score ranks risks for discussion; the descriptors behind each number do the real work.
- Likelihood | 1 (rare) to 5 (almost certain), from written descriptors
- Consequence | 1 (minor) to 5 (severe), for the realistic worst credible outcome
- Bands | 1 to 6 low, 7 to 14 medium, 15 to 25 high
step: Shipping the 6 in-band flanges: 3 × 4 = 12, medium
step: Shipping the 12 outside the band under concession: 1 × 4 = 4, low
```

## Rate the risks of each option

The team rates five risks in a single session, with the inspector, the production manager and the owner present. Rating them together keeps the scale consistent.

**R1. A flange with an in-band or linear indication leaks in service.** An indication under the gasket contact band can create a leak path. The team rates the likelihood as possible (3) and the consequence as major (4): an in-service leak at a pump station means an outage and repair. Score 12, medium.

**R2. A flange with an indication outside the gasket band leaks in service.** The indications on these 12 flanges are rounded, 1.1 to 1.4 mm, and sit on the part of the raised face the gasket does not touch. The likelihood of a leak path is rated rare (1); the consequence if it did happen would still be major (4). Score 4, low.

**R3. Accepted flanges contain subsurface porosity that the surface inspection cannot show.** The foundry's sand change raises the possibility that porosity extends below the surface in flanges that passed. Likelihood unlikely (2), consequence major (4). Score 8, medium.

**R4. Replacement flanges arrive after stage 2 begins on day 18.** Replacements ordered today should be ready on day 12, six days before they are needed. A foundry slip of more than six working days would be unusual. Likelihood unlikely (2), consequence significant (3). Score 6, low.

**R5. The customer refuses the concession.** If the request is refused, the workshop falls back to replacing all 18. Likelihood possible (3), consequence moderate (2). Score 6, low.

```figure
type: bars
title: Risk scores before controls
unit: /25
max: 25
caption: Two risks are medium; none is high. The next sections show why a medium score does not settle anything on its own.
- *R1 in-band flanges shipped | 12 | possible × major
- R3 subsurface porosity | 8 | unlikely × major
- R4 replacements late for stage 2 | 6 | unlikely × significant
- R5 concession refused | 6 | possible × moderate
- R2 outside-band flanges shipped | 4 | rare × major
```

## A failure: the score that seems to approve the unacceptable

At this point the production manager makes an argument that sounds reasonable. R1 scores 12, which is medium. The tool's typical response for medium is to mitigate and assign an owner, not to stop. So why not ship the six in-band flanges with a note asking the customer to monitor them?

The argument fails, and it is worth seeing exactly why. The six flanges do not meet the specification. Whether they may be used is not a question of risk tolerance for the workshop to settle; it is a question for the customer, and in this case the customer's engineer has already said that concessions require supporting evidence. No evidence could support a concession for a linear indication under the gasket. A risk score is a way of ranking risks among options that are permitted. It is not a permission.

The error is detected by asking, before any score is used, whether the option behind it meets every mandatory requirement: legal, contractual, safety and technical. If it does not, the option is removed from the comparison, whatever it scores. The BIZOMAT two-option comparison tool makes the same point in one of its checks, asking the user to exclude any option that fails a safety, legal or technical requirement before scoring. The correction here is to strike "ship the six in-band flanges" from consideration, leaving R1 as a description of what the replacements prevent rather than a risk to be accepted.

There is a second, quieter lesson. Medium scores invite compromise because they sit in the middle of the scale. A team that wants a particular answer can often produce a medium rating for it. Writing the descriptors down in advance, and rating in one session, makes that harder.

## Caution: guard against the obstacles

Caution, for Aquinas, attends to the external obstacles that could defeat a good action (II-II q.49 a.8). For the workshop, two obstacles stand out: the possibility that the porosity is worse than it looks (R3) and the possibility that the concession is refused late enough to cause delay (R5 combined with R4).

**Section a rejected flange.** The workshop cuts one of the six in-band rejects through its worst indication and examines the section. The flange is already scrap, so the only cost is about half an hour of work. This is an illustration: the section shows isolated pores to a maximum depth of 0.6 mm, with no interconnection and no porosity in the body of the casting below the face. That result supports the view that the problem is near-surface and confined to the face, which lowers the likelihood in R3 from unlikely to rare. It also gives the customer's engineer evidence for the concession request.

**Order 18 castings today, not 6.** If the workshop waits for the customer's answer before ordering castings, a refusal on day 2 would push the castings, and therefore the replacements, two days later. Ordering all 18 today means the castings arrive on day 10 whatever the answer, leaving machine capacity as the only remaining question about the day-12 date. If the concession is accepted, 12 castings worth A$744 go into stock for the next batch, which uses the same casting. The cost of the hedge is the money tied up for a few weeks, not the castings themselves.

**Inspect the incoming batch.** The next batch from the foundry was poured after the sand change. The team arranges a sample inspection of incoming castings on arrival, before any machining is spent on them. That is a control for a future risk rather than this one, but it comes from the same foresight.

```figure
type: steps
title: Cautionary controls added on day zero
caption: Each control targets a named risk and has a cost the team can state.
- Section one rejected flange | lowers R3; about 0.5 hours on a part already scrap
- Order all 18 castings today | removes the delay in R5; A$744 of castings may go to stock
- Send the indication map and section photos with the request | supports the concession; about 1.5 hours
- *Sample-inspect the next incoming batch | prevents a repeat; agreed with the foundry
```

## Re-rate after the controls

Controls change ratings, and the new ratings should be recorded beside the old ones so a reviewer can see what the controls were worth.

After the section, R3 becomes rare (1) by major (4), a score of 4. Ordering all 18 castings today means a refusal no longer delays the castings, so R5's consequence falls from moderate to minor: possible (3) by minor (1), a score of 3. R4 is unchanged at 6, because the hedge does not speed the foundry. R2 stays at 4. R1 is no longer a risk to be rated, because the six flanges will not be shipped.

| Risk | Before controls | Control | After controls |
|---|---|---|---|
| R1 in-band shipped | 12 | Option removed: six flanges replaced | Not applicable |
| R2 outside-band shipped | 4 | Concession with evidence; customer decides | 4 |
| R3 subsurface porosity | 8 | Section of a reject: near-surface only | 4 |
| R4 replacements late for stage 2 | 6 | None available | 6 |
| R5 concession refused | 6 | All 18 castings ordered today | 3 |

The remaining risks are all low. That does not make the decision for the team, but it tells them the options still on the table can be compared without any of them carrying a risk the workshop could not justify. The Library's chapter on [making a risk register change decisions](/reados/collections/risk-controls-and-assurance/making-a-risk-register-change-decisions/) covers how to keep ratings like these useful after the decision.

## Rate consequences for everyone they fall on

A workshop rating its own risks naturally thinks first about consequences to itself: rework hours, deductions, a strained relationship. Foresight that serves the end must also look at the consequences for the people the decision affects, because the end in this case is the customer's working pump station, not the workshop's quarterly result.

The same event can carry very different consequences for each party. Take R4, replacements arriving late for stage 2. For the workshop, the consequence is mainly financial: the purchase order deducts A$200 for each working day any part of the order is late, so a slip from day 12 to day 20 would add eight more days of deductions. For the customer, the consequence is a crew standing idle at a pump station, with labour and hire costs the workshop never sees. The workshop's descriptor scale already reflects this, because level 3 is defined as a delay to the customer's project. A scale defined only in the workshop's own dollars would have rated it lower.

The opposite mistake is also possible. R2 has a major consequence for the customer if it happens, but the customer is also the party best placed to judge it, because the customer owns the specification and will pressure-test the system. Rating R2 is not the workshop deciding the customer's risk appetite; it is the workshop preparing honest evidence for the person who will.

A simple check catches both mistakes. For every risk on the register, write down who bears the consequence. If the answer is always "us", the register is measuring the business, not the decision.

## What foresight cannot do

Aquinas's admission that not every danger can be foreseen is worth keeping in mind. The ratings above rest on assumptions: that the indication map is correct, that the section is representative, that the gasket will be installed centrally. A rating is a judgement made with the information available, not a guarantee.

Two habits keep that honest. The first is to write the key assumption beside each rating, so that if it later proves wrong, the rating can be revisited rather than defended. The second is to name the person who will notice if the assumption fails. For R2, that is the customer's commissioning engineer, who will pressure-test the station before it enters service. The workshop's request should say so, because a pressure test is part of what makes the concession reasonable.

## Exercise: rate a risk for the next batch

The foundry's next batch of 240 castings arrives in two weeks. The team believes it is likely (4) to carry the same porosity, because it was poured after the sand change. If the porosity is discovered only at final inspection, the consequence is significant (3): rework and another late delivery. Rate the risk, propose a control and re-rate it.

**Worked answer.** Before controls the score is 4 × 3 = 12, medium. The control is the sample inspection of incoming castings agreed on day zero, followed by full inspection of the raised-face area if the sample finds porosity, before any machining is done. The control does not change the likelihood, because it does nothing to the castings, but it moves discovery to the start of the process. Rejects would then cost a casting and some inspection time, not a casting plus machining, and there would be time to arrange replacements before the due date. The consequence falls to moderate (2), and the score to 4 × 2 = 8, still medium. The remaining medium score is a signal that the real fix lies upstream with the foundry, which is where Chapter 8 takes the case.
