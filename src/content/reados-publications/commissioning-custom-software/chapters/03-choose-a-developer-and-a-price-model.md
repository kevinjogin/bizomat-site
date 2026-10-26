---
book: commissioning-custom-software
chapterSlug: choose-a-developer-and-a-price-model
order: 3
title: "Choose a developer and a price model"
description: "Evaluate software proposals on understanding, approach, team, price and support, check references, compare fixed, hourly and capped pricing, and consider paid discovery."
draft: false
---

Choosing a developer is choosing a partner for months of close work and, often, years of support. Price matters, but the cheapest proposal is frequently cheap because it assumes the least, includes the least or leaves the most to be argued about later. The way the work is priced matters too. A fixed price, a time-and-materials arrangement and a capped or target-cost arrangement each share the risk of the unknown differently, and the right choice depends on how well the work is understood before it starts.

This chapter chooses the machining business's developer. It sets evaluation criteria before reading the proposals, compares three real-looking proposals on more than price, checks references with questions that get past politeness, compares the price models with numbers, and considers a short paid discovery phase before committing. The failure case is the lowest fixed-price bid, which nearly won until a reference call showed how it would really have cost.

## Decide how you will judge before you read

The owner and operations manager wrote down their criteria and weights before opening any proposal, so that the first impressive document did not set the standard. This is an illustration:

- **Understanding of the problem**, 25%: does the proposal show they understood the shop floor, the awkward cases and the integrations?
- **Approach**, 20%: is the technology sensible, maintainable and not tied to one person's preferences?
- **Team**, 15%: who will actually do the work, and do they have relevant experience?
- **Price and price model**, 20%: total expected cost and how risk is shared.
- **Support after go-live**, 10%: price, response times and continuity.
- **References**, 10%: what similar clients say.

## Three proposals

Three developers responded to the brief from Chapter 2. This is an illustration.

```figure
type: compare
title: Three proposals for the job-tracking app
cols: Developer X | Developer Y | Developer Z
caption: This is an illustration. Prices exclude GST. Each developer priced every must-have story separately, which made the differences traceable.
- Price model | fixed price | time and materials | capped time and materials, with shared savings
- Price | A$98,500 | about A$89,600, 640 hours at A$140 | estimate A$94,000, cap A$108,000
- Questions asked during quoting | none | four | seven, mostly about the awkward cases
- Team | a principal, plus contractors to be engaged | two named developers | two named developers and a part-time tester
- Support after go-live | A$2,000 a month | A$1,200 a month | A$1,200 a month
- *Discovery phase offered | no | no | yes, two weeks, A$8,000, credited against the build
```

Developer X offered the only fixed price, and the lowest certain number. Developer Y quoted time and materials, an hourly rate times estimated hours. Developer Z quoted a capped arrangement: time and materials up to an estimate of A$94,000, with any saving below the estimate shared equally, and a cap of A$108,000 above which the developer absorbs the cost.

## Compare the price models with numbers

The three models share risk differently, and the comparison needs more than the headline numbers.

**Fixed price** puts the risk of underestimating on the developer, who protects themselves with a contingency inside the price and with a narrow reading of the scope. Anything outside that reading becomes a variation, priced separately. Developers' variation rates are often higher than their base rates, and every variation needs its own negotiation, which takes time from both sides and strains the relationship at exactly the point where cooperation matters most. If changes and clarifications added about **12%** to the fixed price, a common experience in software, the business would pay about **A$110,320**.

**Time and materials** puts the risk on the buyer. Developer Y's 640 hours were an estimate. A range of 20% either way, typical at this stage, gives about **A$71,680 to A$107,520**. The business pays for the hours actually worked, which is transparent but open-ended.

**Capped time and materials with shared savings** splits the risk.

```figure
type: formula
title: What the business pays under Developer Z's capped arrangement
formula: if actual ≤ estimate: pay = actual + ½ × (estimate − actual)        if actual > estimate: pay = the lesser of actual and the cap
caption: This is an illustration with Developer Z's estimate of A$94,000 and cap of A$108,000, excluding GST. The developer earns more by finishing under the estimate, and carries the cost above the cap.
- Estimate | A$94,000
- Cap | A$108,000
step: work takes A$80,000 of time: pay 80,000 + ½ × 14,000 = A$87,000
step: work takes A$104,000: pay A$104,000
step: work takes A$115,000: pay the cap, A$108,000
```

Under the capped arrangement, the developer has a reason to work efficiently, because they share any saving, and to estimate honestly, because they carry overruns above the cap. The business knows its maximum, A$108,000, and probably pays less. Both sides also have a shared interest in raising scope problems early, because a problem found late costs the developer above the cap and costs the business in delay. That shared interest is worth more than any clause.

## Read the proposals for understanding

The scores for understanding separated the proposals more than price did. Developer Z's seven questions during quoting had covered jobs split between machines, reworked parts and the Friday dispatch rush, cases from the supervisor's description of a day. Its proposal described how each would work. Developer Y's proposal handled most of them. Developer X's proposal restated the brief's stories almost word for word and said nothing about the awkward cases. A proposal that does not mention the hard parts usually has not priced them.

## Check references properly

References offered by a developer will be positive. The value is in the details. The owner called two references for each developer and asked the same questions:

```figure
type: checklist
title: Questions for every developer reference
caption: This is an illustration of the owner's reference questions. Specific questions get specific answers; "were you happy?" gets "yes".
- How did the final cost compare with the original quote, and why? | variations and their causes
- How did the delivery date compare with the plan? | and how were delays communicated
- Who actually did the work? | the people proposed, or others
- How were disagreements about scope handled? | the most telling answer
- How has support been since go-live? | response times, continuity of people
- Do you have the source code and could another developer take over? | ownership in practice
- Would you hire them again for a similar project? | and what would you do differently
```

## Meet the people who will do the work

Proposals are often written by someone who will not write the code. The owner asked each developer to send the people who would actually do the work to a one-hour meeting at the factory. Each team was asked to walk through one story, starting an operation in the back bay with no Wi-Fi, and explain how their design would handle it, on a whiteboard, in plain language.

The meetings were revealing. Developer Z's two developers asked to see the back bay first, looked at a tablet in an operator's hands and asked how gloves affected tapping. Developer Y's team explained a sensible design but had not visited a factory before. Developer X sent the principal alone, who said the contractors would be engaged once the contract was signed. An independent adviser, paid for half a day, sat in on all three and gave the owner a short written view of each design's soundness, which a non-technical owner could not judge alone.

## Check the developer can last

A custom system will need its developer, or a successor, for years. The owner checked each developer's viability in proportion to the risk: how long they had traded, how many people they employed, whether the business depended on one person, what professional indemnity and public liability insurance they held, and whether they were willing to place the source code where the business could reach it at any time. A two-person firm can be an excellent choice. It needs the code and documentation arrangements in Chapter 4 to protect the business if one of those two people leaves.

## Score the proposals

With the criteria set in advance, the owner and operations manager each scored every proposal from 1 to 10 on each criterion, then compared and discussed any score that differed by more than two points. This is an illustration. Weighted, the results were about **58** out of 100 for Developer X, about **71** for Developer Y and about **84** for Developer Z. Developer X scored well on price certainty and poorly on understanding, team and references. Developer Y scored well on price and approach and less well on understanding the awkward cases. Developer Z scored highest on understanding and team and close to the others on price.

The scores did not make the decision. They structured the discussion and made it hard to choose on impression alone. The owner recorded the scores and reasons with the decision, for the business's own files.

## Negotiate without breaking the model

Having chosen Developer Z, the owner negotiated three points: the support price, a commitment that the two named developers would stay on the project, and the ownership terms in Chapter 4. The owner deliberately did not try to push the cap down hard. A cap set below a realistic estimate gives the developer every reason to cut corners or argue scope, which costs the business more than the saving. A reasonable cap is part of what makes the shared-savings arrangement work.

## Consider a paid discovery phase

Developer Z offered a two-week discovery phase for **A$8,000**, credited against the build if the business went ahead. In it, the developer would work with the supervisor and operators to refine the stories, prototype the operator screens on a real tablet, confirm the integration files with the existing system and produce a firmer estimate.

Discovery reduces the biggest uncertainty in a software project, misunderstanding, before the large spending starts. It also lets the business see how the developer works before committing, and gives either side a clean exit if the fit is poor. The cost is small relative to the build and is not wasted if the business proceeds.

## What discovery produced

This is an illustration. The two weeks of discovery produced four things. First, a refined set of stories: two must-haves were split into smaller stories, and one, the customer-format inspection records, turned out to be larger than anyone had thought, because one customer's form had conditional sections. Second, a clickable prototype of the operator screens, tried on a tablet by four operators in the back bay. They asked for larger buttons, usable with gloves, and for the job number to be readable from a metre away. Third, confirmed sample files for both integration flows, tested against the existing system by the business's own staff. Fourth, a revised estimate of **A$96,000**, with the cap moved to **A$110,000** to reflect the larger inspection story, both excluding GST.

The owner accepted the revision. The A$2,000 rise in the estimate was explained story by story, and it came from a discovery the business would otherwise have made halfway through the build, at a much worse time. The A$8,000 discovery fee was credited against the build, so the net estimate for the project, including discovery, stayed at A$96,000.

Discovery also tested the relationship. The developers had worked on the floor with operators, raised the inspection problem early rather than hiding it, and explained their estimate change openly. That was the best evidence the owner had that the next five months would go the same way.

## A failure case: the lowest fixed price

This is an illustration. On price alone, Developer X's fixed A$98,500 looked attractive: a certain number, close to the middle of the budget range. The owner was inclined to accept it.

The reference calls changed that. Both of Developer X's references described projects delivered two to three months late. One said the final cost had been about **30%** above the fixed price because of variations: "everything we hadn't written down exactly was extra". The other said the principal had been responsive at first but that the work had been done by contractors who changed during the project, and that they did not have the source code because the contract had not mentioned it.

Combined with the proposal's silence on the awkward cases and the absence of questions during quoting, the picture was clear. The fixed price was low because it rested on a narrow reading of the brief, and the business would have paid for the gaps later as variations. At 30% above, it would have paid about **A$128,000**, more than either alternative's realistic cost.

The detection came from reference calls with specific questions, the cheapest due diligence available. The business chose Developer Z, starting with the paid discovery phase, under a contract described in Chapter 4.

## How this applies to a small Australian business

Small businesses tend to choose software developers on price and personal impression, then discover the real cost later. Set your criteria before reading proposals, read for understanding of the hard parts, call references with specific questions, and work out what each price model would cost if the usual 10% to 30% of change happened. A capped arrangement with shared savings often balances risk better than either extreme. A paid discovery phase is cheap insurance against misunderstanding. Finally, tell the developers who were not chosen, promptly and courteously, with a short reason. Australian software communities are small, you may need one of them later, and a business known for fair dealing with suppliers gets better proposals next time. The general trade-offs of fixed and variable pricing are discussed in [Fixed price or not: choosing how work is priced](/reados/collections/procurement-and-tendering/fixed-price-or-not-choosing-how-work-is-priced/).

## Exercise: the capped arrangement at the edges

Under Developer Z's arrangement, with an estimate of A$94,000 and a cap of A$108,000, what does the business pay if the work takes **A$70,000** of time? And if it takes **A$130,000**? What does the developer earn or lose in each case compared with being paid for their time?

**Worked answer.** At **A$70,000**, the business pays **70,000 + ½ × (94,000 − 70,000) = A$82,000**. The developer receives A$12,000 more than their time, a reward for efficiency, and the business saves A$12,000 against the estimate. At **A$130,000**, the business pays the cap, **A$108,000**, and the developer absorbs **A$22,000** of their own time. That loss is the developer's incentive to estimate honestly and to raise scope problems early, which the change process in Chapter 5 is designed to catch.
