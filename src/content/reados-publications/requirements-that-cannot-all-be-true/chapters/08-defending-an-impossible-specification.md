---
book: requirements-that-cannot-all-be-true
chapterSlug: defending-an-impossible-specification
order: 8
title: "Defending an impossible specification: redefinition, vagueness and the greater good"
description: "The usual defences of a specification shown to be impossible, which are legitimate, how to rank requirements by purpose, and how to compare feasible options after excluding the rest."
draft: false
---

By the end of Chapter 7 the applications engineer has proved that the inspection station request, as written, cannot be met. Some requirements contradict each other, some break physical limits together and one is a test that a compliant machine would usually fail. She has proposed bounded and restated versions of each. Now she must present that to the customer, and the customer's people will defend what they wrote.

This chapter looks at the defences, because they are predictable. Patrick Grim's survey of impossibility arguments notes how the defenders of a set of attributes typically respond: by redefining the terms, by retreating into vagueness, or by arguing that the apparent conflict serves some larger purpose. Each has an engineering counterpart, and one of them, properly done, is how good specifications get made. The chapter then compares the feasible options, after removing the infeasible ones.

## The meeting

This is an illustration. The engineer meets the customer's production, quality, maintenance and purchasing leads. She presents her conflict reports, one page each, as described in Chapter 1. Five responses come back, and between them they cover most of what is ever said in defence of an impossible specification.

```figure
type: compare
title: Five defences of the specification, and what each one does
cols: What it does | Legitimate?
caption: This is an illustration. Only the last defence moves the discussion forward, and only when the ranking is written down and agreed by whoever owns each requirement.
- "Another supplier has quoted it." | Treats a price as proof that the requirements are compatible | Only after reading what that supplier assumed or excluded
- "Just do your best." | Turns every requirement into an aspiration with no test | No: it hands the choice of which requirement to miss to the supplier
- "Treat the numbers as targets." | Keeps the words but drops the commitment | No, unless the targets are ranked and the minimums stated
- "We'll accept a little less on each." | Splits every conflict down the middle | Rarely: it ignores which requirements matter more
- * "Accuracy matters more than speed." | Ranks the requirements by purpose | Yes, if written down and agreed by each owner
```

### "Another supplier has quoted it"

This is the most common defence and the easiest to test. A price is not evidence that a set of requirements is compatible. It is evidence that someone was prepared to name a figure. The engineer asks to see, or asks the customer to check, what the other quote assumed. Usually one of three things has happened: the other supplier bounded the unbounded words silently, as in Chapter 2; it excluded a requirement in its terms; or it did not check the conflict and will meet it at commissioning, as the builder once did with the belt-driven gantry in Chapter 1. In this case the purchasing lead finds that the competing quote offers "positioning accuracy ±0.010 mm at 20 ± 1 °C", which quietly drops R4.

### "Just do your best"

This is Grim's retreat into vagueness. A requirement with no test cannot be failed, which feels safe to the person who says it. But someone still has to decide which requirement gives way, and "do your best" hands that decision to the supplier, who knows least about what each requirement is for. The engineer declines it politely: she would rather the customer chose.

### "Treat the numbers as targets"

This is redefinition. The words stay in the specification; their meaning shrinks from a commitment to a wish. Grim observes that a term defended this way survives at the cost of its content. In a contract the cost is worse, because a target with no minimum gives no basis for acceptance. If the customer wants targets, each needs a minimum below which the station is rejected, and those minimums must themselves be compatible.

### "We'll accept a little less on each"

Splitting the difference sounds fair and is rarely right. A compromise halfway between two numbers is only fair if both numbers matter equally, and they seldom do. A little less speed costs almost nothing, as Chapter 3 showed; a little less accuracy may make the station useless for its purpose. Treating them alike ignores the only information that matters, which is what each requirement is for and what a shortfall would cost.

## The greater good, properly done

The last defence, "accuracy matters more than speed", is the engineering version of an argument familiar from Weisberger's chapter: an apparent conflict is justified if it serves a greater good. In theology the argument is contested, and this book takes no view on it. In a specification, it is how conflicts are legitimately resolved, provided it is done openly. A requirement may give way to another that serves a more important purpose, if the ranking is stated, agreed by the owners of both requirements, and recorded.

The engineer asks each lead to rank the requirements in their conflicts by purpose, and to mark any that cannot move at all.

```figure
type: layers
title: The requirements ranked by purpose
caption: This is an illustration. Agreed in the meeting by the leads who own each requirement. Safety requirements sit above the ranking: they are settled under work health and safety law, not traded here.
- Above the ranking | Guarding, emergency stop, structural safety of the beam and uprights: governed by work health and safety law
- 1. Must be met | Hole positions referred to 20 °C within ±0.010 mm (R3, R4 restated); acceptance with proven confidence (R12 restated)
- 2. Must be met, method open | Probe repeatability after sag correction (R6 restated); reversal error 0.003 mm (R10 bounded); servicing only at the annual shutdown (R9 bounded)
- 3. Fixed by the site | Travel 1,500 mm (R1); beam depth 120 mm and mass 75 kg (R7); moving mass 60 kg (R5)
- 4. Tradeable against cost | Rapid speed (R2); axis budget (R11); life margin above 20,000 machine hours (R8)
```

The ranking makes the decision mechanical in one respect: requirements in layers 1 to 3 are constraints, and only layer 4 is traded. Nothing that protects people is in the ranking at all. Work health and safety law requires risks to be eliminated, or minimised so far as is reasonably practicable, and Safe Work Australia's model code on managing risks sets out how control measures are chosen. That duty, not a ranking of commercial requirements, decides guarding and safe design. The station's safety design is a separate exercise, done by competent people under the law of the customer's jurisdiction.

## Exclude, then compare

With the ranking agreed, the engineer has three candidates.

- **The specification as written.** Excluded. It fails the physical tests in Chapters 3, 5 and 6 and cannot be built.
- **Option A: keep 1.0 m/s.** A 40 mm ground screw with a 40 mm lead, both ends fixed, a linear scale with beam and frame temperature compensation, and a mapped 200 × 120 × 8 mm beam. Axis price A$14,800 excluding GST, 70 days to delivery, risk rated 3 of 5, mainly for the fixed–fixed screw's thermal behaviour in a warm shop.
- **Option B: 0.5 m/s.** A 32 mm ground screw with a 32 mm lead, fixed–supported, with the same scale, compensation and beam. Axis price A$10,400 excluding GST, 49 days, risk rated 2 of 5.

Both options meet every requirement in layers 1 to 3. Both deliver the same value to the customer, which the customer's operations lead puts at A$60,000 a year in inspection labour and scrap avoided; the 2.21 s difference in cycle time from Chapter 3, about 3.7 hours of station time a year, does not change that figure.

The [two-option comparison](/tools/option-compare/) in BIZOMAT Tools compares two alternatives on annual benefit, cost, delivery time and risk rated from 1 to 5. It combines them into a score using fixed weights, flags results within 10% of each other as too close to call, and shows each option's benefit-to-cost ratio. It also carries a check that matters here: exclude any option that fails a safety, legal or technical requirement before scoring. The score is meant to structure the discussion, not to replace it.

```figure
type: compare
title: Option A against option B
cols: Option A: 1.0 m/s | Option B: 0.5 m/s
best: 2
caption: This is an illustration. From the two-option comparison. The specification as written is not in the table, because it fails technical requirements and the tool's own check excludes it before scoring.
- Annual benefit | A$60,000 | A$60,000
- Axis price, excluding GST | A$14,800 | A$10,400
- Benefit to cost | 4.05× | 5.77×
- Delivery | 70 days | 49 days
- Risk, 1 to 5 | 3 | 2
- Score | 243 | 344
```

Option B scores 344 against option A's 243, a gap well beyond the tool's 10% threshold. The reasons are visible in the table: the same benefit for less money, sooner and with less risk. The score adds no information the leads could not see for themselves, but it gives them a common basis for agreeing.

### What the speed requirement cost

The comparison also puts a price on the speed requirement. Keeping 1.0 m/s would cost A$4,400 more on the axis, three weeks of delivery and a higher risk, in exchange for about 3.7 hours of station time a year. Production, which wrote R2, withdraws it.

Purchasing's budget, R11, is the other casualty. Option B's axis costs A$10,400, A$1,400 above the A$9,000 cap. The cap was written before anyone knew that the accuracy requirement needed a linear scale and temperature compensation. Purchasing agrees to raise it, on the condition that the reason is recorded. Chapter 9 records it.

Notice what the ranking did to the budget. Before the meeting, R11 was a fixed ceiling, and every other requirement had to fit under it. After the meeting, it was a tradeable quantity in layer 4, and its owner could see what each dollar above the ceiling bought: a scale and compensation that made the accuracy requirement achievable at all. A budget written before the requirements are known to be compatible is a guess about their cost. Treating it as a constraint equal to a physical limit is a category error, and it is one of the most common reasons that impossible specifications survive into contracts.

## Defences from inside the supplier

The customer is not the only party that defends an impossible specification. The supplier's own people often do too, for commercial reasons, and their defences are harder to resist because they come from colleagues.

- **"Quote it and sort it out later."** The sales lead knows that a quote with exceptions loses to a quote without them. Quoting the specification as written wins the order and moves the conflict to commissioning, where it costs more and the supplier has less leverage. The builder's gantry in Chapter 1 is what "sort it out later" looks like.
- **"Our engineers will find a way."** This is a compliment to the design team and a refusal to look at the calculation. Ingenuity can move a conflict to a different design class, as the alternatives in Chapter 3 showed, but it cannot beat a bound. Chapter 6's beam is impossible for every steel section, whoever designs it.
- **"The customer won't test that."** Sometimes true, and never a basis for a quote. A requirement the supplier cannot meet and hopes will not be tested is a liability waiting for the first dispute. Misleading claims in trade are also a legal matter, not only a commercial one.
- **"Everyone in this market quotes that way."** Perhaps. But the builder that bounds its words and shows its calculations is the one whose quotes a customer can compare honestly. That is a commercial advantage, not a handicap, with any customer who has been through a commissioning dispute.

The machine builder deals with these by a simple internal rule: no quote leaves the office with an unresolved conflict report. The conflict is either resolved with the customer before the price is fixed, or listed in the quote as an exception, with its calculation attached. The sales lead's concern about losing on exceptions is addressed by the form of the exception. An exception that says "R2 not met" reads as a weakness. One that says "R2 restated as 0.5 m/s, which meets your cycle time target of under a minute and saves A$4,400; calculation attached" reads as competence.

There is also a cost argument that persuades sales leads quickly. On the belt-driven gantry, the conflict found at commissioning cost a linear scale, three weeks of delay and a goodwill discount, together more than the margin on the job. The same conflict found at quotation would have cost an hour of calculation and one page in the quote.

## The failure case: best endeavours

This is an illustration. The builder had accepted "do your best" once, on a fixture for a robot welding cell whose specification asked for a 30-second changeover and positional repeatability of 0.05 mm. The two conflicted through the clamping method, and the customer said to do what was possible. The builder delivered 45 s and 0.04 mm, judging accuracy to matter more. The customer's production manager, who had written the changeover requirement, judged the opposite and withheld the final payment. Nobody had asked him.

### How it is detected and corrected

The failure is detected when a customer answers a conflict report with an instruction that does not rank the requirements. "Do your best", "use your judgement" and "treat them as targets" all mean that the supplier is about to choose for the customer. The correction is to decline the choice and ask for a ranking, in writing, from the owners of the requirements in conflict. It takes longer than accepting the instruction and far less time than a payment dispute.

## Exercise: a third option

A competitor proposes option C: a belt-driven axis at 1.0 m/s with the same linear scale, compensation and beam, at A$9,800 excluding GST, 42 days to delivery, risk rated 4 of 5 because belt stretch under acceleration affects settling and reversal.

1. Compare options B and C with the two-option comparison, using the same A$60,000 annual benefit for both.
2. What should be checked before the score is used?

**Worked answer.**

1. The tool scores option B at 344 and option C at 348, within 10% of each other, and reports the result as too close to call. Option C's lower price and shorter delivery offset its higher risk rating.
2. The tool's check applies first: exclude any option that fails a technical requirement before scoring. A scale removes most of the belt's positioning error, but the reversal requirement of 0.003 mm (R10) and the probing repeatability depend on the drive's stiffness and settling, which a belt affects. Option C must show, by test data from the competitor or a trial, that it meets R10 and R6 before it is scored at all. If it cannot, it is excluded, and option B is the choice. If it can, the decision turns on factors outside the score: the competitor's support, the builder's experience with each design, and how the risk rating of 4 was arrived at.
