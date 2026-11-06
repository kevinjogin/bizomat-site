---
title: "What your methods cannot see: the assumptions inside project tools and shared templates"
description: "Gantt charts, critical paths and risk templates were built for particular kinds of work. How to check what each tool assumes, spot when it misleads and add a review that sees differently."
publishDate: 2026-10-04
category: "Business"
tags:
  - systems
  - operations
  - strategy
author: "BIZOMAT"
featured: false
draft: false
---

Every business that runs projects uses a familiar set of tools: a bar chart showing tasks against time, a list of dependencies, a breakdown of the work into parts, a budget tracked against progress, a risk register and a set of approval points. These tools feel neutral, like rulers or scales. They are not. Each was designed for a particular kind of work, and each carries assumptions about that work. When the assumptions hold, the tools are excellent. When they do not, the tools can keep reporting confidently on something that no longer means what it appears to mean.

Many of the standard project tools were developed in the first half of the twentieth century and in the 1950s, for very large defence, aerospace, pipeline and construction programs: work where the tasks could be listed in advance, where the main challenge was coordinating many known activities across many contractors, and where the finished product looked like the drawing. They were brilliant answers to that problem. Much modern work, such as introducing a new system, changing how people work, launching a service or entering a market, is a different problem.

A related issue affects risk management. When everyone in an industry uses the same templates, training and checklists, everyone tends to notice the same things and miss the same things. This article explains how to check what your tools assume, when to trust them, what to add when their assumptions fail, and how to include a review that looks at the business differently.

## Every tool makes a claim about the work

Four claims sit underneath the standard project tools:

- **The scope is knowable in advance.** A work breakdown, a fixed baseline and reporting against plan all assume the work can be defined before it starts.
- **Dependencies are technical.** A dependency network assumes that one task cannot start until another finishes, for physical or logical reasons.
- **Value arrives at handover.** Approval gates and completion-based success measures assume the benefit appears when the work is delivered.
- **The main constraint is coordination.** The whole apparatus assumes the hard part is sequencing many known activities.

Where all four hold, as on many building, installation and equipment projects, the tools work well. Where one fails, the tool does not just become less useful. It can actively mislead, because it keeps producing precise-looking reports about a quantity that no longer reflects reality.

```figure
type: checklist
title: Four claims beneath the standard project tools
caption: Where all four hold, the tools work well; where one fails, the plan stops representing the work.
- ? The scope is knowable in advance
- ? Dependencies are technical
- ? Value arrives at handover
- ? The main constraint is coordination
```

## When a claim fails

### Dependencies that are really negotiations

A dependency network represents a dependency as a fixed relation: task B starts when task A finishes. That is a faithful model of pouring a slab before building walls on it. It is a poor model of the most common dependency in business change: another team, supplier or customer must agree to something, and their willingness depends on their own priorities, workload and incentives.

On the schedule, such a dependency appears as a task lasting, say, two weeks. In reality, it is a negotiation that might take two weeks or four months, and the elapsed time says little about progress. When it runs late, the schedule reports a delivery failure, when the real issue was never a task at all. The [testing the dependencies in your schedule](/reados/collections/project-estimates-schedules-and-costs/testing-the-dependencies-in-your-schedule/) article looks at how to examine what really holds each dependency in place.

### Value that arrives after the project ends

Completion-based measures assume the benefit appears at handover. For a new building, roughly true. For a new system or process whose value depends on dozens of people working differently, value arrives over the following months, in day-to-day operations, and the tools stop measuring at exactly the point where the important part begins. The [when the project succeeds and the strategy fails](/reados/collections/from-approval-to-benefits/when-the-project-succeeds-and-the-strategy-fails/) article explores this gap between outputs and benefits.

### Scope that is discovered, not defined

When a material part of the work will only become clear as it proceeds, a fixed baseline turns every discovery into a variance. Reports show the project slipping when it is actually learning. Repeated rebaselining is a sign that scope was never knowable in advance.

### Constraints that are not coordination

Sometimes the real constraint is a scarce skill, a regulatory decision, a customer's agreement or a choice the business has not yet made. More scheduling does not relieve these constraints. It consumes attention without moving them.

## Do not throw the tools away

The answer is not to abandon these tools. They remain excellent for the work they were built for, and plenty of business work still is that kind of work: a fit-out, an equipment installation, a relocation, a project with a fixed regulatory date. Discarding a well-built schedule on such a project would be a mistake.

The useful step is to know which assumption each tool rests on and check whether it holds for the work in front of you.

## A four-claim test

At the start of any significant initiative, ask:

1. **Is the scope knowable in advance?** If mostly yes, baselines and variance reports are appropriate. If a material part will be discovered, track what remains unknown and treat variances as information rather than performance failures.
2. **Are the dependencies technical or behavioural?** For each dependency on another party's agreement, name an owner and agree a decision date, rather than just a duration.
3. **Does value arrive at handover or afterwards?** If afterwards, extend measurement beyond completion and give the benefit to the person who runs the operation.
4. **Is the constraint coordination or something else?** If it is a skill, a decision, an approval or a person's time, manage that constraint directly.

The result is a short statement of which tools will be trusted for this initiative, which will be used with caution and what has been added to cover what they do not see.

## The shadow plan

The most reliable sign that a tool has stopped representing the work is a **shadow plan**: when the people doing the work keep their own list, spreadsheet or whiteboard alongside the official schedule, because the official one no longer reflects what is happening. Shadow plans are usually well known to staff and rarely mentioned to the owner. When you find one, ask what it tracks that the official plan does not.

Other signs include status that stays green and then turns red suddenly, repeated rebaselining and dependencies expressed only as dates with no named person on the other side.

## Shared templates create shared blind spots

A second, related problem affects risk management. When businesses in an industry improve their practices, they usually do it by adopting the same methods: the same risk register template, the same training, the same checklists from the same industry body, consultants or insurers. Each adoption raises that business's standard. But it also narrows the range of questions asked across the whole industry.

Sociologists Paul DiMaggio and Walter Powell described in 1983 how organisations in the same field tend to become more alike, through shared professional training, common expectations and copying what peers do. In risk management, the effect is that a whole industry can share a blind spot. Any exposure the common template has no category for is not judged unlikely. It is simply never raised, by anyone.

Standard risk templates are good at discrete, nameable events: a fire, an injury, a supplier failure, a cyber incident. They are weaker at exposures that are not events, such as:

- a slow shift in who your customers are;
- an assumption inherited from years ago that nobody has rechecked;
- a gradual change in how a common contract term is interpreted;
- several small dependencies that together amount to one large one;
- renewals, deadlines or obligations clustered in the same few weeks.

## Independence of method, not just independence of person

Businesses often ask someone independent to review their plans or risks: a person not involved in the project. That protects against a reviewer who does not want to see a problem. It does not protect against a reviewer who cannot see it, because they were trained in the same way, use the same template and ask the same questions.

For important decisions, it is worth adding a **divergent review**: one that differs in at least two of three ways from the usual approach:

- **A different starting point**: instead of listing events that might happen, imagine the initiative has failed a year from now and work out why. This is often called a **pre-mortem**.
- **Different people**: someone whose background lies outside your industry or profession, such as a customer, an adviser from another field or a business owner in a different sector.
- **A different question**: "what would have to be true for this to fail?" rather than "what could go wrong?"

A useful rule: if a divergent review finds nothing that was not already on the register, treat that as a sign the review was not really different, not as proof the register is complete. Change the method or the people next time.

## Keep a one-page tool register

A simple document helps make all of this discussable. For each tool or template the business relies on, write one line: what it assumes, and when it should not be trusted. For example:

| Tool | What it assumes | Be cautious when |
|---|---|---|
| Gantt chart and dependency list | Tasks are known and dependencies are technical | Progress depends on other people's agreement |
| Fixed budget and baseline | Scope can be defined in advance | Much of the work will be discovered |
| Completion sign-off | Value arrives at handover | Benefits depend on people changing how they work |
| Industry risk template | The main risks are discrete, nameable events | Exposures build slowly or combine |

The register takes an hour or two to write and is more useful than adopting a new method, because it makes the assumptions visible.

```figure
type: compare
title: What each tool assumes
cols: It assumes | Be cautious when
caption: A shadow plan, such as a whiteboard of real unknowns, is the surest sign a tool has stopped representing the work.
- Gantt chart | Known tasks, technical dependencies | Progress depends on people agreeing
- Fixed baseline | Scope definable in advance | Much of the work will be discovered
- Completion sign-off | Value arrives at handover | Benefits depend on changed habits
- Industry risk template | Discrete, nameable events | Exposures build slowly or combine
```

## A worked example

This is an illustration. A building services contractor with 30 staff is replacing its job management system. The project is planned with a detailed Gantt chart and reported weekly to the owner. For two months every report is green. Then go-live slips by six weeks, and nobody can explain why the reports gave no warning.

The general manager applies the four-claim test:

- **Scope**: much of the work, such as cleaning and moving old job data, was only understood once it started. The baseline treated it as fixed.
- **Dependencies**: the critical dependencies were each team leader agreeing to a new way of booking jobs. The schedule showed them as one-week tasks. In practice, each was a negotiation, and two team leaders had not agreed.
- **Value**: the project was measured to go-live. The real benefit, faster invoicing and fewer missed bookings, depends on how staff use the system for months afterwards.
- **Constraint**: the real constraint was the time of two experienced coordinators, who were needed for both data work and daily operations.

The manager also finds a shadow plan: the coordinators have been tracking data problems on a whiteboard that never appeared in the official reports.

Changes follow. Each team-leader agreement gets a named owner and a decision date. The whiteboard's list of unknowns becomes part of the weekly report. The coordinators are released from some daily work for four weeks. Benefit measures for invoicing time and missed bookings will be tracked for six months after go-live.

The owner then looks at the business's risk register, which was built from an industry association template. Of its 22 entries, 19 match the template almost word for word. A short pre-mortem with two outsiders, the business's accountant and a long-standing customer, asks what would cause the business serious trouble within two years. It surfaces two exposures absent from the register: most after-hours call-outs depend on one subcontractor, and several large maintenance contracts come up for renewal in the same month. Both are added, with owners and actions.

```figure
type: bars
title: A risk register built from an industry template
unit: entries
caption: A pre-mortem with the accountant and a long-standing customer found two exposures the template had no category for.
- Entries in the register | 22
- *Matching the template almost word for word | 19
- Missing exposures found by a divergent review | 2 | one after-hours subcontractor; renewals in the same month
```

## How this applies to a small Australian business

Small businesses usually adopt project tools and risk templates from software, industry bodies, insurers or advisers, rarely asking what they assume. Practical steps:

- **Apply the four-claim test** at the start of significant initiatives.
- **Give behavioural dependencies** an owner and a decision date.
- **Track unknowns**, not just progress against plan, when scope is uncertain.
- **Measure benefits after handover** when value depends on changed behaviour.
- **Look for shadow plans** and ask what they track.
- **Run a pre-mortem** with someone from outside your industry for important decisions.
- **Keep a one-page tool register** listing what each tool assumes.

The [plans that detect rather than predict](/reados/collections/project-estimates-schedules-and-costs/plans-that-detect-rather-than-predict/) article covers how to plan uncertain work around assumptions rather than forecasts.

## Signals worth watching

- Teams keeping their own tracking alongside the official plan.
- Repeated rebaselining.
- Status that is green until it is suddenly red.
- Dependencies with durations but no named person on the other side.
- Nobody able to say what happened to benefits a year after completion.
- A risk register that a competitor could have written.
- Reviews that always agree with the existing register.

## Common mistakes

- **Treating tools as neutral** measuring instruments.
- **Using the same tools for every kind of work.**
- **Abandoning tools** that suit the work.
- **Modelling negotiations as tasks.**
- **Stopping measurement at handover.**
- **Relying on reviewers** trained in exactly the same way.
- **Treating a review that finds nothing new** as proof of completeness.

## Frequently asked questions

**Does this mean Gantt charts are bad?** No. They are excellent for work with known tasks and technical dependencies. The point is to know when those conditions hold and to add other measures when they do not.

**What should replace a fixed baseline for uncertain work?** Keep a plan, but track what remains unknown alongside progress, review assumptions regularly and treat changes as information. Staged commitments help.

**Who makes a good outside reviewer?** Someone with relevant judgement but a different background: an adviser from another industry, a customer, a supplier or a business owner from a different sector. They do not need to be experts in your field.

**How long does a pre-mortem take?** An hour is often enough. Ask participants to imagine the initiative has failed, write down reasons individually, then discuss and turn the most plausible into actions.

**Should we stop using industry templates?** No. They capture shared experience and help with consistency. Just supplement them occasionally with a review that does not start from the template.

## Questions to ask

- For our largest initiative, which of the four claims actually hold?
- Where are people keeping a shadow plan, and what does it track?
- Which dependencies are really negotiations?
- Does our measurement continue after handover?
- How many entries in our risk register would appear on any business's template in our industry?
- When did someone from outside our industry last review an important decision?

## Bringing it together

Project tools and risk templates carry assumptions about the work they were designed for. Check those assumptions: is the scope knowable, are dependencies technical, does value arrive at handover and is coordination the real constraint? Where they fail, add what the tools cannot see: owners for negotiations, tracking of unknowns, benefit measures after completion. Recognise that shared templates create shared blind spots, and occasionally invite a review that starts from a different place, uses different people and asks a different question. A tool reporting confidently on a failed assumption is worse than no tool, because it looks like visibility.

---

*Source: BIZOMAT notes, drawing on teaching material on the history and assumptions of project management tools and on P. J. DiMaggio and W. W. Powell's 1983 work on institutional isomorphism. Examples and figures in this article are illustrations.*
