---
title: "Keeping an assumptions log that tests the plan, not just records it"
description: "Every plan rests on things believed to be true. How to identify the assumptions that matter, rank them, test the critical ones early and set signposts that tell you when the plan needs to change."
publishDate: 2026-10-16
category: "Projects"
tags:
  - projects
  - strategy
  - validation
author: "KEVOS"
featured: false
draft: false
---

Every plan is built on things its authors believe to be true but cannot yet prove. Customers will pay this price. The new machine will run at this rate. The supplier will deliver in twelve weeks. The council will approve the application within the statutory period. Staff will adopt the new system after two days of training. These beliefs are **assumptions**, and they are unavoidable. No business can wait for certainty before acting.

The problem is not that plans contain assumptions. It is that assumptions are usually invisible. They sit inside spreadsheets, schedules and business cases as numbers and dates, presented with the same confidence as facts. Nobody records which ones were guesses, nobody checks them as the work progresses, and when one turns out to be wrong, the plan fails in a way that feels like a surprise but was entirely foreseeable.

An **assumptions log**, sometimes called an assumptions register, makes these beliefs visible and manageable. Done well, it is one of the most useful and least bureaucratic tools in project and business planning. This article explains how to identify the assumptions that matter, how they differ from risks and constraints, how to rank them, how to test the critical ones early and how to set signposts that tell you when the plan needs to change.

## What an assumption is, and is not

Planning documents use several related terms. Keeping them distinct makes each more useful.

| Term | Meaning | Example |
|---|---|---|
| Assumption | Something treated as true for planning purposes, without proof | The new product will sell 2,000 units in year one |
| Constraint | A limit the plan must work within | The budget cannot exceed $250,000 |
| Dependency | Something the plan needs from outside the work itself | Installation depends on the landlord completing roof repairs |
| Risk | An uncertain event that would affect objectives if it occurred | A key supplier may become insolvent |
| Issue | Something that has already happened and needs a response | The supplier has missed its first delivery |

An assumption that proves false often becomes an issue. A doubtful assumption is closely related to a risk: the risk that the assumption is wrong. The difference is one of emphasis. A risk register asks what might go wrong. An assumptions log asks what the plan is relying on and whether that reliance is justified. The [finding project risks before they find you](/reados/collections/project-planning-and-control/finding-project-risks-before-they-find-you/) article covers risk identification; the assumptions log complements it by examining the foundations of the plan itself.

## Why assumptions deserve their own log

Assumptions need explicit management for several reasons:

- **They hide in numbers.** A sales forecast, a cycle time or a duration estimate looks like a fact once it is in a spreadsheet.
- **They are made by different people.** Marketing assumes the price, engineering the performance, operations the staffing. Nobody sees the whole set.
- **They decay.** An assumption reasonable at the start may become untrue as the market, team or technology changes.
- **They compound.** A plan that depends on five independent assumptions, each 80% likely to hold, has only about a one-in-three chance that all five hold (0.8 multiplied by itself five times is about 0.33).
- **They are cheaper to test early.** A pricing assumption can be tested with customer conversations for a few hundred dollars before development, or discovered to be wrong after launch at a cost of hundreds of thousands.

## Finding the assumptions

Assumptions are found by asking, of every important number, date and claim in the plan, "what must be true for this to hold?" Useful prompts include:

- **Customers and market.** Demand, price, timing of adoption, competitor response, channel behaviour.
- **Technical.** Performance, reliability, compatibility, manufacturability, test results.
- **Cost.** Material prices, labour rates, productivity, exchange rates, supplier quotes.
- **Schedule.** Durations, approval times, lead times, availability of key people.
- **People and change.** Skills, adoption, training effectiveness, willingness of others to change.
- **External.** Regulations, approvals, economic conditions, landlord or partner actions.
- **Benefits.** How outputs will translate into savings, revenue or other value.

A short workshop with people from each function, working through the business case and schedule line by line, typically surfaces dozens of assumptions. Many are minor. The aim of the next step is to find the few that matter most.

## Ranking assumptions

Two questions identify the critical assumptions:

1. **How important is it?** If this assumption were wrong, how much would it change the plan's outcome?
2. **How uncertain is it?** How much evidence supports it?

Assumptions that are both important and uncertain are the **critical assumptions**. They deserve testing, owners and close monitoring. Important but well-supported assumptions need monitoring. Uncertain but unimportant ones can usually be left alone.

A simple way to judge importance is a sensitivity check: change the assumption to a plausible pessimistic value and see what happens to the result. If the project's return halves when sales are 25% lower, the sales assumption is critical. The [cost-benefit analysis for business decisions](/reados/collections/investment-appraisal-and-business-cases/cost-benefit-analysis-for-business-decisions/) article explains how to test a case against changing values, which is a natural companion to the log.

## What the log should contain

The log does not need to be elaborate. For each significant assumption, record:

- **The assumption**, stated specifically and measurably ("average order value of $1,200", not "customers will spend enough").
- **The source and evidence**: where the figure came from and how confident the team is.
- **Importance and uncertainty**, using a simple scale.
- **The owner**: the person responsible for testing and monitoring it.
- **The test**: how the assumption will be validated, and by when.
- **Signposts**: observable signals that would show the assumption is failing.
- **The response**: what the plan will do if the assumption proves wrong.
- **Status**: untested, being tested, supported, weakened or invalidated, with the date.

## Testing critical assumptions early

The most valuable use of the log is to drive **testing**. For each critical assumption, ask what the cheapest, fastest way is to find out whether it is true. Common approaches include:

- **Customer conversations and pre-orders** to test demand and price.
- **Prototypes and trials** to test technical performance.
- **Supplier quotations and capacity checks** to test cost and lead time.
- **Pilots** in one site, product line or team to test adoption and productivity.
- **Expert review** to test regulatory or technical assumptions.
- **Historical data** to test durations and rates against actual past performance.

Planning approaches built around this idea have been described in management literature for decades. **Discovery-driven planning**, for example, starts from the result a venture must achieve, works back to the assumptions required to achieve it and then sequences the work so that the most important assumptions are tested before large commitments are made. **Assumption-based planning**, developed for long-range planning, emphasises identifying load-bearing assumptions, defining signposts that would show them failing and preparing actions to shape or hedge against those outcomes.

The same principle applies to staged decisions generally: design each stage of the work to test the assumptions the next commitment depends on. The [notes on prototyping](/reados/collections/product-development-and-launch/notes-on-prototyping/) article explains how to build prototypes that answer specific questions.

## Signposts and triggers

Testing at the start is not enough, because assumptions can fail later. **Signposts** are observable indicators that an assumption is weakening: enquiry rates below a threshold, scrap rates above a level, a supplier's lead times lengthening, approval timeframes slipping on similar applications. Each signpost should have a **trigger**, the point at which the owner raises the issue and the planned response is considered.

Good signposts are specific, measurable and visible early enough to act. "Sales are disappointing" is not a signpost. "Fewer than 40 qualified enquiries by the end of month two" is.

## Reviewing the log

The log should be reviewed at a regular rhythm and at key decision points:

- **Monthly**, briefly, by the project or business lead, focusing on critical assumptions and their signposts.
- **At each stage gate or major commitment**, where the gatekeepers should ask which critical assumptions have been tested and what the results showed.
- **When something unexpected happens**, to identify which assumptions it affects.

When an assumption is invalidated, the response should be deliberate: revise the plan, adjust the business case, change the scope or, if the assumption was fundamental, consider stopping.

## A worked example

This is an illustrative example. The business, figures and events are hypothetical.

A small engineering business plans to launch a range of modular stainless-steel workbenches for food processors. The business case forecasts 300 benches in year one at an average price of $3,400, a material cost of $1,150 per bench and a fabrication time of 9 hours. It requires $180,000 for design, jigs and launch marketing.

The team runs a one-hour assumptions workshop and records 26 assumptions. A quick sensitivity check identifies four as critical:

| Assumption | Why it matters | Evidence | Test |
|---|---|---|---|
| Customers will pay $3,400 | Small price changes move the contribution per bench sharply | Two customer conversations | Quote six target customers using a drawing and a sample bench |
| 300 units in year one | Volume drives payback | Rough market estimate | Pre-orders or letters of intent from early customers |
| 9 hours of fabrication | Labour is the second-largest cost | Estimate from a similar job | Build two benches with the new jigs and time them |
| Stainless sheet at current prices | Material is the largest cost | One supplier quote | Second quote with a price validity period |

The tests cost about $9,000 and take seven weeks. Customers accept $3,400 for the standard bench but want a cheaper basic version. The first two benches take 13 and 11 hours, and the jig is revised to reach 9.5 hours. Pre-orders total 38 benches, suggesting year-one volume closer to 200 than 300.

The plan is revised: a two-model range, a revised cost of 9.5 hours of fabrication and a volume of 200, with a signpost that the business will review the launch if fewer than 60 benches are ordered by the end of month four. The business case still works, but with a longer payback, and the business commits with its eyes open rather than on the original optimistic figures.

## How this applies to a small Australian business

- **Run a short assumptions workshop** for any significant decision: a new product, a major purchase, a new site or a large contract.
- **Write assumptions specifically.** Numbers and dates, not general statements.
- **Find the critical few.** Importance and uncertainty together decide which deserve attention.
- **Test before committing.** Spend small amounts to check the assumptions large commitments depend on.
- **Set signposts.** Decide in advance what evidence would tell you the plan needs to change.
- **Keep it on one page.** A short, live log is far more useful than a long one nobody reads.

## Common mistakes

- **Treating forecasts as facts.** Numbers in a spreadsheet are often assumptions in disguise.
- **Vague statements.** "The market will grow" cannot be tested or monitored.
- **Logging everything equally.** Dozens of minor assumptions bury the few that matter.
- **No owners.** Assumptions without owners are never tested.
- **Recording but not testing.** A log that only documents assumptions adds little value.
- **No signposts.** Without defined warning signals, failing assumptions are noticed too late.
- **Defending assumptions instead of testing them.** The aim is to learn the truth early, not to protect the original plan.

## Frequently asked questions

**How is an assumptions log different from a risk register?** A risk register lists uncertain events that might affect objectives. An assumptions log lists the beliefs the plan relies on, with a focus on testing them. Critical assumptions often generate risks, and the two can be linked.

**How many assumptions should we track closely?** Usually a handful. Most plans rest on a small number of load-bearing assumptions.

**Who should own an assumption?** The person best placed to test and monitor it, often the function that supplied the figure.

**What should happen when an assumption proves wrong?** Record what was learned, update the estimate or plan that depended on it and check whether other assumptions relied on the same evidence. An invalidated assumption is useful information, not a failure, provided it is found early and acted on. If the change is large, it may justify returning to the decision that approved the plan.

**Does a small business need a formal log?** Not necessarily a separate system. A short table in the business case, project plan or monthly review pack is often enough, as long as each critical assumption has a clear statement, an owner, a test and a review date. The discipline matters more than the format.

**Should assumptions ever be removed from the log?** Yes. Once an assumption has been confirmed by evidence, it can be marked as validated and moved out of the active list, which keeps attention on the beliefs that remain uncertain.

## Questions to ask

- What must be true for this plan to succeed?
- Which assumptions would most change the outcome if they were wrong?
- What evidence supports each critical assumption, and how strong is it?
- What is the cheapest way to test each critical assumption before we commit?
- What signposts would tell us an assumption is failing, and what will we do then?
- Who owns each critical assumption, and when will we review them?

## Bringing it together

Plans fail most often not because of unforeseeable events but because they rested on beliefs nobody checked. An assumptions log turns those beliefs into a short list of statements that can be ranked, owned, tested and monitored. Focus on the few assumptions that are both important and uncertain, test them cheaply before making large commitments, define signposts that reveal when they are weakening and treat invalidated assumptions as a prompt to rethink the plan. The result is not a plan without uncertainty, but one whose uncertainties are known, managed and steadily reduced.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
