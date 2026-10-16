---
title: "Is the AI good enough to rely on? Benchmarks, test scenarios and the decision to deploy, support or shelve"
description: "A strong demo is not evidence. How to compare AI with your current process, test it on unseen and difficult cases, set acceptance rules first and decide to deploy, support or shelve."
publishDate: 2026-10-04
category: "Technology"
tags:
  - ai
  - validation
  - systems
  - experimentation
author: "KEVOS®"
featured: false
draft: false
---

Most AI initiatives have a launch date. Very few have a stated condition under which they would be stopped. Businesses can describe at length what a new system is meant to achieve, but not the evidence that would lead them to say "not this, not yet". As a result, initiatives are extended, re-scoped and quietly re-staffed, but rarely set aside on purpose.

Part of the reason is a missing measurement. Deployment debates are argued as if the standard were obvious: is it accurate enough, is it ready, is it safe? The only standard that means much commercially is comparative: is it better than what we do now, by enough to justify what it costs to run and supervise? Without a measured account of how the current process performs, every result is arguable, and an arguable result rarely loses a funding discussion.

There is also a testing problem. An AI pilot can be impressive for the wrong reasons: unusually clean data, familiar cases, expert users, no difficult examples. When the system moves into everyday operation, conditions change. This article explains how to build a fair benchmark, test AI on cases it has not seen, set acceptance rules in advance, and choose deliberately between three outcomes: rely on it, use it as support, or shelve it for now.

## Better than what?

Every AI evaluation should answer one question: **better than what?** The comparison might be:

- **Current human performance** on the same decisions.
- **The current process**, including its cost and cycle time.
- **An existing rule-based system** or simpler method.
- **A previous version** of the AI.

A headline such as "92% accurate" means little on its own. If the current process gets 98% of the important cases right, the new system may be worse. If it is faster on average but makes more serious mistakes, the improvement may not be acceptable.

## Build the benchmark before you need it

The benchmark is the most important instrument, and it should be built before anyone has an interest in the result. A practical approach:

1. **Take a representative sample** of real past decisions from a defined period.
2. **Have experienced people decide them** under normal conditions, without seeing any system output.
3. **Record the correct outcome** where it is known, or use an agreed panel to judge where it is not, and say so.
4. **Weight errors by their cost**, using weights agreed in advance by the person who bears those costs.
5. **Run the system on the same sample.**

Two things often surprise businesses. First, the benchmark is valuable even if nothing is deployed, because measuring how experienced people decide the same cases usually reveals variation between them that nobody had noticed. Second, the benchmark must be re-measured over time. People learn, processes change and customers change. A system that beat the human standard two years ago may not beat today's.

## What a single accuracy figure hides

- **Averages hide the distribution that matters.** A system that is better overall but worse on rare, expensive cases has moved errors from the common and cheap to the uncommon and costly.
- **Test results describe the past.** Performance is measured on data from conditions that existed when it was collected. The most honest test uses data the system has never seen, ideally from a later period than the data used to build it.
- **Performance is not permission.** Passing a test shows a system performs. It does not grant it authority to act, within what limits and with what way to switch it off. That is a separate governance question.

## Test beyond the familiar

Research on AI for air traffic illustrates why conditions matter. In a 2022 study, researchers at MIT Lincoln Laboratory described a test environment called AAM-Gym for developing and validating AI for advanced air mobility. Algorithms trained on scenarios with 100 aircraft were then tested on an unseen scenario with 678 aircraft. They still improved safety compared with no assistance, but their measured risk was materially higher in the larger, unfamiliar scenario.

The lesson for any business is that **performance evidence changes when operating conditions change**. Before relying on an AI system, test it on a library of scenarios that reflects real variety:

- **Normal operations.**
- **High load**, such as peak periods.
- **Poor or missing inputs.**
- **Unusual combinations**, such as several issues in one request.
- **Known failure modes** from past experience.

For a customer service tool, that might include ambiguous requests, missing information, policy conflicts, upset customers and cases that need escalation. For a maintenance tool, it might include sensor faults and unusual operating conditions. Keep the scenario library and reuse it every time the system, its settings or the provider's underlying model changes.

## Set acceptance rules before testing

AI evaluation becomes weak when a business tests first and decides afterwards whether the result is good enough. Before testing, write down:

- **Minimum acceptable performance** against the benchmark.
- **Maximum tolerable rates** for serious errors.
- **Scenarios that must be passed.**
- **Situations that require human handling.**
- **Evidence that would block deployment.**

Measurement and acceptance are different tasks. A business can measure something precisely without having agreed what acceptable looks like.

## Measure the whole operation, not just the model

A system can score well while the operation around it struggles. Check outcomes such as the number of alerts people must handle, rework, delays, staff workload, customer outcomes and what happens when the system is unavailable. A maintenance tool that predicts failures well but generates too many false alarms may make the operation worse, not better.

## Classify failures by consequence

Not all errors are equal. For each type of failure, consider who is affected, how severe the consequence is, whether it can be reversed, how quickly it would be noticed, whether a human or technical control can catch it and what risk remains. An infrequent but irreversible error deserves a far stricter threshold than a frequent, easily corrected one.

## Three outcomes, three cost structures

Comparing the system against the benchmark leads to one of three decisions:

| | Rely on it | Use it as support | Shelve it |
|---|---|---|---|
| Condition | Clearly better than the benchmark, including on costly errors | Comparable, or better on average but not on costly cases | Clearly behind, or the benchmark cannot be measured |
| Justified on | Saving effort and improving consistency at volume | Decision quality, because it removes no cost | Keeping the option open against a named constraint |
| Owner | The manager accountable for the decision | The manager whose people make the decision | The owner of the constraint that caused the shelving |
| Must produce | Monitoring, exception handling, a way to switch it off | Override rates and review of disagreements | A written constraint and an observable reopening trigger |
| Reverse when | Performance drifts below a re-measured benchmark | Overrides approach zero or approach half | The trigger occurs, or the option is written off |

**Using AI as support** looks like the cautious middle, but per decision it is often the most expensive, because the business pays for the system and for the person, plus the time spent reconciling disagreements. It should be justified on better decisions, such as consistency or fewer serious errors, not on labour savings.

**Shelving** is not cancelling. Keep the data, the test scenarios, the benchmark and the record of what was tried, and write down what would need to change for the idea to be reconsidered, expressed as an observable event such as a new data source becoming available, never just a date.

## Why nothing gets shelved

- **The only person who can shelve it is the sponsor**, who is being asked to end their own initiative.
- **The constraint is never named**, so nobody can tell when the time to reopen has arrived.
- **Sunk cost feels like commitment.** Money already spent cannot be recovered by any decision. Only future costs matter.
- **The alternative use of people is invisible.** If nobody names what the team would do instead, continuing always looks better than stopping.

The practical fix is to appoint the person who will make the disposition decision at the start, before results exist, and not to make it the sponsor.

## Keep evidence reproducible

Record which version of the system was tested, on which data and scenarios, with which settings and against which benchmark. When the system, its configuration or the provider's model changes, rerun the critical scenarios to check nothing has got worse. Without this record, the reasons a system was approved cannot be checked later.

## A worked example

This is an illustration. A building services company receives about 1,500 maintenance requests a month by email, phone and web form. It is considering an AI tool to classify each request's urgency, as emergency, urgent or routine, and to route it to the right trade.

Before testing, the operations manager sets acceptance rules: the tool must match or beat the current coordinators overall, must not misclassify more emergencies as routine than the coordinators do, and must handle after-hours and multi-issue messages acceptably. Misclassifying an emergency as routine is weighted twenty times as costly as other errors.

A sample of 400 past requests is classified blind by two experienced coordinators. They disagree with each other on about 11% of requests, a finding that leads to clearer urgency guidelines regardless of any technology. Against the agreed correct answers, the coordinators are about 90% accurate on urgency and miss one of 25 emergencies. The AI tool is about 91% accurate overall but classifies four of the 25 emergencies as routine. On the cost-weighted measure, it is worse.

For routing to the right trade, the tool is about 97% accurate against the coordinators' 94%, and routing errors are cheap to correct. Scenario testing shows the tool struggles with messages describing several problems at once.

The decisions are:

- **Routing: rely on it**, with coordinators handling flagged exceptions and a monthly check of a sample.
- **Urgency: use it as support.** The tool suggests an urgency level, and a coordinator confirms it. The justification is more consistent classification, not labour savings. Override rates are tracked.
- **An AI tool to estimate repair costs: shelved.** The constraint is that the business has no structured history of job costs. The reopening trigger is twelve months of costed job data captured in its new job management system.

## How this applies to a small Australian business

Small businesses can apply these ideas without specialist infrastructure:

- **Measure the current process** before testing any AI tool.
- **Agree which errors are expensive**, and weight them.
- **Test on unseen and difficult cases**, not just the supplier's examples.
- **Write acceptance rules before testing.**
- **Choose deliberately** between relying, supporting and shelving.
- **Appoint the decision owner early.**
- **Keep a scenario library** and rerun it after updates.
- **Check obligations** where AI decisions affect customers, staff or safety, including privacy and consumer law.

The articles on [testing decision systems before you trust them](/reados/collections/decision-making-machines/testing-decision-systems-before-you-trust-them/), [governing AI decisions](/reados/collections/ai-in-business-practice/governing-ai-decisions/) and [proving a new technology is ready to depend on](/reados/collections/business-systems-security-and-it-decisions/proving-a-new-technology-is-ready-to-depend-on/) cover related topics.

## Signals worth watching

- AI initiatives with no stated stopping condition.
- Benchmarks measured by the team building the system, or older than the process they describe.
- Override rates near zero or near half in decision-support uses.
- Exception volumes growing faster than the people handling them.
- Shelved work with no named constraint.
- Business cases claiming labour savings from decision-support tools.
- Evaluation only on supplier-selected examples.

## Common mistakes

- **Comparing against an imagined benchmark** rather than a measured one.
- **Reporting one average figure.**
- **Testing only on familiar cases.**
- **Deciding acceptance after seeing results.**
- **Funding decision support** while promising labour savings.
- **Never shelving anything.**

## Frequently asked questions

**How large should the benchmark sample be?** Large enough to include a reasonable number of the important, costly cases. If those cases are rare, deliberately include more of them, and say so.

**What if we cannot measure the correct answer?** Use an agreed panel of experienced people to judge, record that you have done so and treat results with appropriate caution.

**How often should we re-test?** Whenever the system, its settings or the provider's model changes, and periodically even if nothing seems to have changed, because customers and conditions do.

**Is this too much effort for simple tools?** Scale the effort to the consequence. A drafting assistant needs a quick check. A system that affects safety, money or customers' outcomes needs the full approach.

## Questions to ask

- For our largest AI initiative, what would stop it, who decides and when were they appointed?
- What is the measured performance of the process it would replace, and who measured it?
- Which errors are expensive, and does our testing reflect that?
- Where we use AI as support, what improvement in decisions have we gained for the cost of running both?
- What is on the shelf, why, and what would bring it back?
- Can we reproduce the evidence that justified each system we rely on?

## Bringing it together

AI should earn reliance through evidence. Measure the current process first, weight errors by cost, test on unseen and difficult cases, set acceptance rules before testing, judge the whole operation and classify failures by consequence. Then decide deliberately: rely on it, use it as support, or shelve it with a named constraint and a reopening trigger. A business that can conclude, on evidence, that something should stop for now is allocating its resources. One that cannot is simply spending them.

---

*Source: KEVOS® notes, drawing on M. Brittain, L. Alvarez, K. Breeden and I. Jessen, "AAM-Gym: Artificial Intelligence Testbed for Advanced Air Mobility" (2022). Examples and figures in this article are illustrations. This article is general information, not legal advice.*
