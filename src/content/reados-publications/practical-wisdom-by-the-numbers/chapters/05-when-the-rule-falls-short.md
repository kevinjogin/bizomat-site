---
book: practical-wisdom-by-the-numbers
chapterSlug: when-the-rule-falls-short
order: 5
title: "When the rule falls short: equity, interpretation and the concession request"
description: "Recognise when applying a requirement's letter would defeat its purpose, refer doubtful cases to the rule's owner, and prepare and score a concession request that leaves the decision with them."
draft: false
---

Every rule is written for the cases its author expected. Sooner or later a case arrives that the author did not foresee, and following the rule's letter would work against the rule's own purpose. Aquinas treats the ability to recognise and handle such cases as a virtue, which he calls *epikeia* and his translators render as equity (*Summa Theologiae* II-II q.120 a.1). His example is a deposit. Returning what was deposited is normally just, but if a man left a sword in your keeping and demands it back while insane, returning it would be harmful. The rule's purpose is served by not following its letter.

Equity is easy to misuse. A team under pressure can describe almost any inconvenient requirement as one whose purpose would be "better served" by ignoring it. Aquinas sets limits that are directly useful to engineers, and this chapter applies them to the 12 flanges identified in Chapter 4. It ends with the workshop's concession request, scored with a BIZOMAT tool, and the customer's answer.

## The limits Aquinas sets

Aquinas makes three distinctions that separate equity from convenience.

First, equity sets aside only what is just by established rule, never what is just in itself (II-II q.120 a.1). A specification's acceptance criterion is a rule set by a party; honesty about the condition of the goods is not. Equity might justify accepting a flange outside the letter of the criterion. It could never justify misdescribing one.

Second, he distinguishes manifest cases from doubtful ones. Where the lawgiver's intention is genuinely doubtful, the person under the rule should either follow its letter or refer the question to those with authority to decide it (I-II q.96 a.6). Interpretation in doubtful cases belongs to the authority, not to the person who would benefit from the answer.

Third, he allows one exception to referral: sudden danger, where there is no time to consult. In that case, he says, quoting a proverb, "necessity knows no law" (I-II q.96 a.6). The exception is narrow. It applies to genuine emergencies, not to deadlines.

He also names the virtue of judgement that works in these cases, *gnome*, which judges exceptional matters by higher principles when the ordinary rules fail (II-II q.51 a.4). Gnome is not the absence of rules; it is judgement by the purpose the rules serve.

```figure
type: decision
title: Handling a case the rule may not fit
question: Would following the letter of the requirement defeat its purpose in this case?
caption: Only a genuine emergency allows acting on the purpose before the rule's owner has decided, and even then the owner is told at once.
- No | Apply the rule | Most cases; this is where Chapter 4 left 6 of the 18 flanges
- *Doubtful | Refer to the owner with evidence | The 12 flanges: the workshop asks, the customer decides
- Manifest, and no time to ask | Act on the purpose, then report immediately | Rare; a schedule is never this kind of emergency
```

## Apply the limits to the flanges

The specification is the customer's rule for this order, and the customer's engineer owns it. The workshop's own view is that the 12 indications, lying wholly beyond the gasket's possible contact area, are unlikely to affect the seal. Is that a manifest case, in which following the letter would plainly defeat the purpose, or a doubtful one?

It is doubtful, for reasons the workshop cannot resolve on its own. The customer may care about the outer ring for reasons not stated: corrosion at the outer edge in a particular water chemistry, the possibility of a wider gasket being fitted in future, or a previous failure. The workshop's sorting rule rests on an assumed gasket offset of 1.5 mm that the customer may know to be wrong. And the workshop has an interest in the answer, which makes it the wrong party to decide.

There is also no emergency. A delivery date is pressure, not peril. Nobody is harmed if the decision takes two days instead of two hours.

The conclusion follows directly from the limits. The workshop may not treat the 12 flanges as acceptable. It may, and should, ask the customer whether they are.

## What a good concession request contains

A concession request is the engineering form of referral to the authority. Its job is to put the case in front of the rule's owner with everything they need to decide, including the information that might lead them to refuse.

1. **Identify the items.** Serial numbers of the 12 flanges, and a statement that the other 6 nonconforming flanges are being replaced and are not part of the request.
2. **State the nonconformance exactly.** Rounded indications of 1.1 to 1.4 mm on the raised face, exceeding the 1.0 mm criterion.
3. **Give the evidence.** The indication map, the sorting rule with its assumptions (nominal gasket band, 1.5 mm offset, inner-edge test), the smallest margin (serial number 023, 0.4 mm radially beyond the limit), and photographs of the section showing near-surface porosity to 0.6 mm.
4. **State the risk as assessed, and its basis.** Leak risk rated rare by major, a score of 4, on the workshop's descriptors, which are attached.
5. **Propose a disposition and its conditions.** Use as is, with the 12 flanges marked and recorded, and subject to the customer's normal pressure test before service.
6. **State the alternatives and their consequences.** If refused, all 12 will be replaced with the other 6, ready on working day 12, a date the workshop confirms against its machine capacity before sending (Chapter 7).
7. **Name what the request does not claim.** It does not claim the flanges conform, or that the workshop's reading of the gasket band is the customer's.

The seventh item matters more than it looks. A request that overstates its case invites the reader to discount all of it.

## Score the change

The BIZOMAT [change impact assessment](/tools/change-impact/) turns five inputs into an impact score out of 100: the added cost as a percentage of the current job value, the schedule effect as a percentage of the remaining schedule, and ratings from 1 to 5 for the increase in risk and the effect on quality. It weights each of the four at 25%, so its formula is: cost percentage × 0.25 + schedule percentage × 0.25 + risk ÷ 5 × 25 + quality ÷ 5 × 25. It also compares the expected benefit with the added cost, and it raises a check calling for quality or engineering sign-off whenever the quality impact is rated 4 or more.

This is an illustration. The workshop enters the concession request as a change to the job.

| Input | Value | Basis |
|---|---|---|
| Additional cost | A$600 | 3 hours of engineering at A$140, 1.5 hours of mapping and photographs at A$120 |
| Current job value | A$42,720 | The workshop's cost for the batch |
| Schedule impact | 0 days | The customer reviews within the six days before delivery |
| Remaining schedule | 6 days | Working days to delivery |
| Risk increase | 3 | The concession may be refused, and the 12 used flanges carry a residual risk |
| Quality impact | 4 | The 12 flanges do not conform to the specification as written |
| Expected benefit | A$2,658 | Avoided replacement of 12 flanges at A$221.50 each |

```figure
type: formula
title: Change impact score for the concession request
formula: Impact = cost % × 0.25 + schedule % × 0.25 + risk ÷ 5 × 25 + quality ÷ 5 × 25
caption: Almost all of the score comes from the risk and quality ratings, which is where the judgement in the request actually lies.
- Cost % | 600 ÷ 42,720 × 100 = 1.40%
- Schedule % | 0 ÷ 6 × 100 = 0%
step: 1.40 × 0.25 + 0 × 0.25 + 3 ÷ 5 × 25 + 4 ÷ 5 × 25
step: 0.35 + 0 + 15 + 20 = 35.35
step: Moderate impact (30 to 59); benefit less added cost = A$2,658 − A$600 = A$2,058
```

The tool rates the change as moderate impact, 35 out of 100. It reports that the benefit exceeds the direct added cost, and, because quality is rated 4, it asks for quality or engineering sign-off before approval. It also carries a standing check: confirm who can approve the change and whether it alters the contract.

The score is useful mainly for what it reveals about the inputs. The cost and schedule terms together contribute 0.35 points. The other 35 points come from two ratings, risk and quality, that the workshop chose. A different team could rate quality at 2 and produce a low-impact score for the same request. The tool is honest about that: it is a structured way of recording judgements, not a source of them. Its sign-off check is the important output, because it points at the same conclusion as Aquinas's limits. The workshop has assessed the change; the customer must approve it.

## A failure: equity used to avoid asking

While the request is being written, a machinist suggests a quicker route. Skim 0.3 mm off the raised face of the 12 flanges, re-inspect, and the indications in the outer ring may disappear. Nobody would need to ask the customer anything.

The suggestion is well meant, and it might even work. It still fails the test. Skimming changes the raised-face height and the surface finish, both of which are controlled dimensions on the customer's drawing. It replaces one nonconformance the customer could judge with a possible second one the customer does not know about. And it would erase the evidence of the original condition, which the customer is entitled to see. This is precisely the move Aquinas warns against: adhering to one's own reading of the purpose in order to avoid the authority's judgement.

The error is detected by a simple question asked of any proposed rework: does it change a controlled feature, or remove evidence of the original condition, without the owner's approval? If yes, it is a change and belongs in the request, not around it. The correction here is to include skimming in the request as an alternative disposition for the customer to accept or refuse, with its effect on raised-face height stated against the drawing tolerance.

## Equity works in both directions

Equity is usually discussed as a reason to relax a rule. It applies equally when the letter of a rule is more lenient than its purpose. A part can pass a criterion as written and still give an engineer good reason to doubt it.

During the re-inspection, the inspector notes one accepted flange, serial number 140, with a cluster of five rounded indications, each 0.8 to 0.9 mm, within an area about 6 mm across under the gasket band. Each indication passes the 1.0 mm criterion. The specification says nothing about clusters. By the letter, the flange conforms.

The purpose of the criterion is an intact seal, and five small pores close together under the gasket may serve that purpose less well than one larger pore in the outer ring. The workshop has no authority to reject a conforming flange on its own reading of the purpose, any more than it can accept a nonconforming one. What it can do, and what equity requires, is to put the observation in front of the owner. The concession request therefore includes a short note: flange 140 conforms to the criterion as written, it carries a cluster of indications described here, and the workshop offers to replace it at no charge, from the castings already on order, if the customer prefers.

The note costs nothing and protects everyone. If the customer accepts flange 140, the decision is theirs and recorded. If the customer declines it, the workshop has turned a possible future leak into a known replacement.

```figure
type: compare
title: Equity or convenience?
cols: Equity | Convenience dressed as equity
caption: The same appeal to a rule's purpose can be honest or self-serving; these tests tell them apart.
- Who decides | The rule's owner, given the evidence | The party who benefits from the answer
- Direction | Raises doubts that favour either side | Raises only doubts that help the team
- Evidence | Shown in full, including what argues against | Selected to support the preferred answer
- Timing | Asks before acting, except in genuine danger | Acts first because the deadline is close
- *In the case | Request for the 12; note on flange 140 | Skimming the faces without asking
```

## The customer's answer

This is an illustration. On working day 2 the customer's engineer replies. The concession is accepted for the 12 flanges, on three conditions: each of the 12 is marked and its serial number recorded on the delivery documents; the indication map and section photographs are included in the quality records; and the customer's pressure test before service is witnessed by the workshop if the customer requests it. The skimming option is refused, because the customer prefers to keep the raised-face height as machined. Flange 140 is accepted as conforming, with the cluster noted in the records. The 6 remaining flanges are to be replaced as planned.

Because the castings were ordered on day zero as a cautionary control (Chapter 3), the refusal of skimming costs nothing, and the acceptance releases every casting not needed for the 6 replacements into stock for the next batch.

## Exercise: score the skimming option

Suppose the customer had asked the workshop to score the skimming option on the same basis. Skimming and re-inspecting each of the 12 flanges takes 0.4 hours of machining and 0.25 hours of inspection at A$110 an hour, and adds one working day. Rate the risk increase at 2 and the quality impact at 3. Calculate the impact score and say what it does and does not tell you.

**Worked answer.** The added cost is 12 × (0.4 + 0.25) × A$110 = A$858, which is 2.01% of the A$42,720 job value. One day is 16.67% of the six-day remaining schedule. The score is 2.01 × 0.25 + 16.67 × 0.25 + 2 ÷ 5 × 25 + 3 ÷ 5 × 25 = 0.50 + 4.17 + 10 + 15 = 29.67, which the tool bands as low impact because it is under 30. The benefit, A$2,658 of avoided replacement, exceeds the added cost by A$1,800. The score tells you that, on these ratings, skimming looks less disruptive than the concession. It does not tell you that skimming is permitted. It changes a controlled dimension, so it still needs the customer's approval, and the customer has a reason the score cannot see for preferring the original face. A lower impact score never converts a change that needs approval into one that does not.
