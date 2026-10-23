---
title: "Governing AI decisions: what you have let a machine decide, and oversight that actually works"
description: "Automated decisions often slip from advice to action without anyone authorising it. How to record what machines may decide, set limits, make human review real and plan how to switch it off."
publishDate: 2026-10-04
category: "Technology"
tags:
  - ai
  - systems
  - strategy
  - operations
author: "KEVOS®"
featured: false
draft: false
---

Ask a business owner which decisions in their business are now made by software without a person confirming them. The answer is usually two or three: an automatic reorder, a credit approval below a limit, an email that goes out when an invoice is overdue. Then ask for the record showing when the business stopped confirming those decisions, what limits were set, who set them and what would withdraw them. In most businesses, that record does not exist.

That is not because it was lost. The moment it would have recorded never looked like a decision. Someone adjusted a threshold. Someone removed a confirmation step that had become a bottleneck. Someone stopped checking a queue because it was always right. Each change was sensible on its own. Together they moved a class of decisions out of human hands.

As AI tools become more capable, this drift accelerates. This article explains how automated decisions move from advice to action, why consequences rather than technology should set the level of control, how to make human oversight real rather than ceremonial, and how to keep a simple register of what the business has authorised machines to decide.

## The ladder of autonomy

Automation is not a single state. It is a series of steps that sit close together:

1. **Advisory**: the system ranks or suggests options, and a person decides.
2. **Default accepted**: the system's top option is applied unless someone intervenes.
3. **Bounded action**: the system acts within set limits and reports what it did.
4. **Exception reporting**: the system acts and reports only unusual cases.
5. **Unreviewed**: the system acts and nobody reads the exceptions.

```figure
type: layers
title: The ladder of autonomy
caption: Locate a system by override and queue data, not by its design intent.
- Advisory | suggests; a person decides
- Default accepted | applied unless someone intervenes
- Bounded action | acts within limits, reports
- Exception reporting | reports only unusual cases
- *Unreviewed | nobody reads the exceptions
```

Each step is small, cheap and locally sensible, and none presents itself as a transfer of authority. They arrive as a software update, a threshold change, a staffing decision or a backlog that quietly stopped being worked. The ladder is climbed by accretion, and accretion produces no minutes.

## Common misreadings

- **A human in the loop guarantees safety.** A reviewer can become a rubber stamp when workload is high or the system seems confident. Oversight needs time, information and authority to disagree.
- **Bias comes only from training data.** Unfair or poor outcomes can also come from how goals are defined, which cases are included, where thresholds are set and how people use the outputs.
- **One policy fits every use.** Drafting a marketing email and deciding a customer's credit limit carry very different consequences. Controls should be tiered by consequence.
- **Approval at launch is standing permission.** A system that performed well on a test sample on one day has not proved it will perform well as volumes grow, customers change and conditions shift.
- **Governance can attach to the software.** Authority is exercised over classes of decisions, and one system can make several. A scheduling tool that sequences maintenance is also, in effect, deciding which equipment runs to failure.

## Throughput is the real exposure

Businesses usually judge automation by its accuracy. A more important question is what a flawed rule costs before anyone notices. A person who makes a poor judgement affects a handful of cases before a colleague, customer or manager notices, and their errors are scattered because people are inconsistent. Automation removes that inconsistency, which is its benefit. It also means errors become systematic and arrive at the speed the system runs.

Three factors decide the exposure:

- **Rate**: how many decisions the system makes.
- **Recoverability**: how easily a single wrong decision can be reversed.
- **Detection time**: how long a systematic error would run before someone noticed.

The third rarely has an owner.

## Internal decisions are least watched

Decisions affecting customers usually generate complaints when they go wrong. Internal decisions, such as screening job applications, allocating shifts, ranking maintenance jobs or triaging requests, often generate silence. A rejected job applicant may not complain. A maintenance job that was never scheduled does not report its own absence. Silence is easily read as success. Automation therefore tends to advance fastest where the business is least able to notice problems.

A practical safeguard is to have an experienced person periodically re-decide a random sample of cases without seeing what the system chose, then examine any disagreements.

## Test across real conditions

Average accuracy can hide poor performance for particular groups, seasons, products or unusual cases. Test systems on data that reflects the real range of situations they will face, look at where errors concentrate and pay particular attention to groups who may be affected differently. Not every rare case can be tested, which is why monitoring after launch matters.

## Make human oversight real

Where a person reviews automated decisions, they should know what to check, have enough information to disagree and have authority to override or escalate. One revealing measure is the **override rate**: the share of the system's proposals that the reviewer changes. If it is close to zero, either the system is almost always right, in which case blanket review is ceremony and targeted sampling would be better, or the reviewer has stopped looking. Both can be reasonable, but neither is what a control register usually claims. Track override rates and look at why overrides happen.

## Keep a register of machine decisions

Most businesses have some form of delegation of authority for people: who can approve spending, discounts or hiring, and up to what limit. Put automated decisions on a similar register, with a row for each class of decision:

| Field | What to record | Test that it is real |
|---|---|---|
| Decision | The decision in business language | The responsible manager recognises it as theirs |
| Level | Advisory, default accepted, bounded action, exceptions only or unreviewed | Shown by override and queue data, not design intent |
| Authorising person | One named person | They can state the limits without looking them up |
| Limits | Volume, value, which customers or cases, and what it must never decide | A test case exists that the system refuses |
| Escalation | What the system must hand to a person | It has happened at least once recently |
| Detection | How a systematic error would be found, and how fast | Measured, not guessed |
| Switch-off | Who can withdraw the system, how and what happens to work in progress | Practised, with a recorded time |
| Review | When the authority must be renewed | Last renewal dated and signed |

Three tests check the register: can you produce the authorisation and the name for your three most consequential automated decisions? What share of proposals do reviewers change, and does anyone examine the changes? If you switched one system off for a day, what would it cost and how long would it take?

## Plan the fallback

Every automated decision process should have a fallback that works when the system is unavailable, behaving strangely or switched off deliberately. Document the manual process, keep the skills to run it, and know how work in progress will be handled during a switch. Test it occasionally, even briefly, so the time and cost are known rather than guessed. A business that cannot operate without a particular system has, in effect, given that system authority it cannot withdraw.

## Tell people when decisions are automated

Customers, applicants and staff affected by automated decisions should be able to find out that automation is involved and how to reach a person. Explain in plain language what the system does, what information it uses and how to ask for a review. A clear route to a human reviewer catches errors the business would otherwise miss, and it builds trust. It also helps meet growing expectations, and in some cases legal requirements, for transparency about automated decisions.

## Watch vendor changes

Software updates can move a system up the ladder without anyone in the business deciding. A new release might change default thresholds or turn on automatic actions, documented in release notes that nobody senior reads. Ask suppliers to notify you of changes to automation defaults, and assign someone to review release notes for systems that make significant decisions.

## Responsibility stays with the business

Authority can be delegated to software. Responsibility cannot. Obligations under Australian privacy, consumer and anti-discrimination law, and directors' duties, continue to apply when decisions are made by software. If a business may need to explain why a decision was made on a particular day, it needs to keep the version of the system that made it and the information it used. Privacy law in Australia has also been changing, including transparency requirements for some automated decisions that affect individuals. Check current obligations with the Office of the Australian Information Commissioner or an adviser.

## A worked example

This is an illustration. A building supplies business uses software to approve trade account credit limits automatically for new customers up to $10,000, based on trading history and credit checks. It saves the credit manager hours each week. Nobody remembers formally deciding to let it approve without review. A threshold was raised two years ago when the backlog grew.

The rule works well overall but misjudges customers whose trade is strongly seasonal, such as landscapers. It sets their limits too high going into quiet months. A credit manager would have caught this case by case. The software applies it to every seasonal customer at once. The problem shows up a quarter later as a rise in overdue debts.

The owner puts the decision on a register. The credit manager becomes the authorising person. Automatic approval is limited to $5,000, and customers flagged as seasonal are always referred for review. Each month, the credit manager re-decides a random sample of twenty automatic approvals without seeing the system's decision, and examines any differences. The business tests switching off automatic approval: it takes one day, and a documented manual process covers the gap. The override rate on referred cases is tracked monthly.

```figure
type: compare
title: Automatic credit approval, put on a register
cols: Before | After
best: 2
caption: Nobody remembered deciding to let it approve without review; switching it off was tested and took one day.
- Limit | Up to $10,000, raised for a backlog | Up to $5,000
- Owner | Nobody named | The credit manager
- Exceptions | None | Seasonal customers always referred
- *Checking | None | 20 approvals re-decided blind each month
```

## How this applies to a small Australian business

Small businesses increasingly rely on automated decisions in accounting, ordering, scheduling, marketing and customer service software. Practical steps:

- **List decisions now made without a person confirming them**, starting from what actually happens, not what the software is supposed to do.
- **Assign an authorising person** for each.
- **Set limits** by volume, value and type of case.
- **Make review real**: targeted sampling, tracked override rates and time to disagree.
- **Know how to switch each system off** and what the manual fallback is.
- **Read release notes** for systems that make significant decisions.
- **Check privacy and consumer obligations** for decisions affecting customers or staff.

The articles on [adopting AI by starting with the work](/reados/collections/ai-in-business-practice/adopting-ai-start-with-the-work/) and [testing decision systems before you trust them](/reados/collections/decision-making-machines/testing-decision-systems-before-you-trust-them/) cover related topics.

## Signals worth watching

- Override rates close to zero where review is claimed as a control.
- Exception queues growing older, or exception reports going to people who no longer read them.
- Decision volumes growing faster than review capacity.
- Software updates changing defaults or thresholds.
- No recent test of switching a system off.
- Very few complaints from a large affected group, which may mean there is no channel to complain rather than no problem.

## Common mistakes

- **Letting automation advance** through threshold changes and staffing decisions without a decision.
- **Treating a reviewer's name as a control** without checking what they actually change.
- **Applying the same controls to every use.**
- **Judging systems on average accuracy** without checking where errors concentrate.
- **Not knowing how to switch a system off.**
- **Assuming responsibility moves with the decision.**

## Frequently asked questions

**Is this only relevant to AI?** No. It applies to any software that makes decisions, including rule-based systems in accounting, inventory and marketing tools. AI simply makes more decisions automatable.

**How many automated decisions need a register entry?** Start with those affecting money, customers, staff, safety or legal obligations. Routine, low-consequence automation, such as formatting documents, does not need the same treatment.

**What is a good override rate?** There is no universal figure. What matters is understanding why it is what it is and checking that reviewers have the time and information to disagree.

**Who should be the authorising person?** The manager responsible for the outcome of that type of decision, such as the credit manager for credit approvals or the operations manager for scheduling. It should be one named person, not a committee.

**How often should we review automated decisions?** At least annually for each register entry, and whenever volumes, customers, products or the software change significantly.

**What should we do when an automated decision goes wrong?** Treat it like any other operational incident. Fix the immediate effect for the people affected, record what happened, find out whether the cause was the data, the rules, the model or the way people used it, and decide whether the decision should be paused or its limits tightened. Then update the register entry so the next review starts from what was learned.

## Questions to ask

- Which decisions in our business now happen without a person confirming them, and who authorised each?
- How long would a systematic error run before we noticed?
- Where a person reviews automated decisions, how often do they disagree, and who looks at why?
- If we had to switch a system off this week, who would do it and what would happen?
- Which automated decisions affect people who cannot easily object?

## Bringing it together

Machines already make decisions in most businesses. The question is whether those decisions were authorised deliberately, with limits and a name attached, or arrived by accretion and will be discovered after something goes wrong. Recognise the ladder of autonomy, tier controls by consequence, measure exposure by rate, recoverability and detection time, make human review real and keep a register of what machines may decide, who authorised it and how to switch it off. A business that can name what it has delegated can defend it, adjust it or reverse it.

---

*Source: KEVOS® notes. Examples and figures in this article are illustrations. This article is general information, not legal or privacy advice.*
