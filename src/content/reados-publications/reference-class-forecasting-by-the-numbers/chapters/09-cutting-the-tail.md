---
book: reference-class-forecasting-by-the-numbers
chapterSlug: cutting-the-tail
order: 9
title: "Cutting the tail before approval"
description: "Where Bay 4's tail comes from, actions that shrink it before approval, staging the software to cut the P90 exposure from A$3.917m to A$3.371m, and an affordability test."
draft: false
---

The earlier chapters measured Bay 4's exposure; this one tries to reduce it. A reference class forecast describes what happens to projects run the way the business has run them. It is not a fixed fate. The tail of the distribution comes from particular kinds of work and particular failures, and many of them can be found, priced or fenced off before the money is committed, when doing so is cheapest. The aim is not to make the forecast look better. It is to change the project so that the forecast honestly gets better, and to check, before approval, that the business can survive the outcomes that remain.

The chapter traces Bay 4's tail to its sources, sets out the actions that address each, works through the effect of staging the software, applies an affordability test, and ends with a "mitigation" that changed the forecast and nothing else.

## Where Bay 4's tail comes from

The four projects in the class with ratios of 1.50 or more, and P14 just below them at 1.45, all overran for reasons that were discoverable in principle before approval. The "main cause" column of the reference class is the place to start, because it lists the specific ways this business's projects have gone wrong.

```figure
type: tree
title: Sources of Bay 4's cost tail, traced to past projects
caption: This is an illustration. Each branch is a kind of discovery that past projects made after approval, when it was most expensive to make.
- Bay 4 tail | approved budget A$2.40m excluding GST
  - * Software and network, A$147.4k share | subclass P90 2.405
    - Network inadequate for new systems | P21: network rebuild, ratio 1.95
    - Integration with the ERP and data migration | P05: ratio 2.60; P21
  - Automation, A$294.7k share | subclass P90 1.588
    - Controls integration with the machine | P14: ratio 1.45
    - Safety assessment and guarding redesign | P18: ratio 1.68
  - Power supply, inside the building line | building P90 1.373
    - Network operator requires new supply works | P08: ratio 1.52; P22: network approval
  - Building approvals and ground | building subclass
    - Council conditions, rock, weather, service clashes | P02, P06, P15, P24
```

The common feature is that the real scope was discovered by doing the work. The network was found to be inadequate when the MES was installed on it. The guarding was found to be inadequate when the safety assessment was done on a built cell. The supply was found to be inadequate when the switchboard was designed. In every case, an investigation costing a small fraction of the eventual overrun could have found the problem before the budget was fixed.

## Actions before approval

This is an illustration. The Bay 4 team listed one action for each branch of the tree. None of them is unusual. What is unusual is doing them before approval, at a time when the team is impatient to order the machines.

```figure
type: steps
title: Tail-cutting actions for Bay 4, before the approval decision
caption: This is an illustration. Each step targets a branch of the tree and a named past project. Most are paid for from the existing base estimate.
- Maximum demand calculation and enquiry to the network operator | finds a P08-type supply problem while it can still be planned (Chapter 7)
- Geotechnical investigation and service locating on the extension footprint | P06 found rock; P24 found a duct route clash
- Integrator demonstrates the pallet interface on the same machine model and controller | P14's overrun came from controls integration
- Safety assessment of the pallet cell layout at concept stage, by a competent person | P18 redesigned its guarding after the cell was built
- * Separate software pilot: network survey, one machine linked, ERP interface tested | P21's network rebuild was found only during installation
- Fixed-scope stages with a decision gate between them | spending beyond the gate waits for the evidence
```

Two of these deserve more detail.

The **software pilot** takes A$35k of the A$140k software and network line, excluding GST. This is an illustration. It surveys the existing network, links one existing machining centre to the monitoring software, and proves a two-way interface with the ERP for job data on a test copy of the ERP database. It has written acceptance criteria: data from the machine reaches the ERP within a stated time, the network carries the traffic without disturbing the office systems, and the interface survives a week of normal production. The rest of the line, A$105k, is not committed until the pilot passes.

The **pre-mortem**, described in [Finding project risks before they find you](/reados/collections/project-planning-and-control/finding-project-risks-before-they-find-you/), asks the team to imagine that it is a year after approval, Bay 4 has failed badly, and to write down why. It helps people voice worries that would otherwise sound disloyal to a plan everyone has worked on. Bay 4's team wrote the following stories, among others, and each one led to an action or a check.

- The machines arrived in week 26 and sat in their crates for four months because the supply upgrade needed a new substation.
- The pallet system worked in the integrator's workshop but not with our machines' controller version, and the integrator and the machine supplier each blamed the other.
- The monitoring software went in, the network could not carry it, and the office lost its ERP connection twice a week until the network was rebuilt.
- The guarding passed the drawings but failed the assessment on site, and the cell ran attended for three months while it was redesigned.
- Nobody had the time to prove the overnight programs, so the pallets ran only on the day shift for the first year.

The last story is not a cost risk at all. It is the benefit risk found in Chapter 7, and the pre-mortem found it again from a different direction.

## What the investigations cost in time

Investigations before approval are cheap in money and not free in time. This is an illustration. If the work above delayed the approval decision by four weeks and nothing else changed, Bay 4's first production shift would move four weeks later, and at the planned contribution of A$45k a week, excluding GST, that is A$180k, more than the whole A$120k contingency. A team that has just been shown the outside view's numbers can find that argument persuasive.

Two things answer it. First, most of the investigations remove work from the critical path after approval rather than adding to it: the network enquiry that Chapter 7 moved to week 2 is the same work done earlier, and the integrator's demonstration replaces commissioning trouble that would otherwise surface in weeks 30 to 34. The team ran them alongside the preparation of the decision paper and lost about one week, not four. Second, the comparison that matters is with the tail they address. The P80 delay in Chapter 7 is 18.7 weeks, worth about A$839k, and the single missing power path would on its own have cost about A$810k. A week spent finding that kind of problem is cheap insurance.

## Staging the software

The largest single change available is to separate the software and network work from the rest of Bay 4. Stage 1 is the building, the machines and the automation, with approved shares of 905.3 + 1,052.6 + 294.7 = **A$2,252.6k**, 93.9% of the approved budget. The software stage is the pilot now, with the rollout decided at a gate once the pilot has reported.

Staging changes the reference class legitimately. Chapter 3 argued that excluding projects from the class is wrong unless the new project truly lacks the component that made them go wrong. Stage 1 truly contains no software or network work: the pallet system's own controller is part of the automation package and stays in Stage 1, but the monitoring, scheduling and ERP integration do not. Stage 1's class is therefore the 20 projects that were not software projects. This is an illustration. Their ratios give a P50 of 1.105, a P80 of 1.278 and a P90 of 1.457, against the whole class's 1.140, 1.408 and 1.632.

```figure
type: compare
title: Bay 4's committed exposure, whole project against staged
cols: Basis | P80 | P90
caption: This is an illustration, excluding GST. Staged totals add Stage 1 and the pilot at the same percentile, which treats them as fully correlated: the cautious assumption from Chapter 8.
- Whole project, approved A$2,400k | whole class, 24 projects | A$3,379k | A$3,917k
- Stage 1 alone, approved A$2,252.6k | 20 non-software projects | A$2,879k | A$3,282k
- Software pilot, share A$36.8k | software subclass | A$81k | A$89k
- * Stage 1 plus pilot, committed at approval | added at the same percentile | A$2,960k | A$3,371k
- Stage 1 alone, component bootstrap | independent, 10,000 runs | A$2,666k | A$2,787k
```

The commitment at approval now has a P90 of about A$3.37m instead of A$3.92m. Most of the difference does not come from the software line itself, which is only A$147.4k. It comes from the fact that the whole-class distribution carries the software projects' tail into every dollar of Bay 4's budget, as if the machines and the slab could blow out like an ERP system. Once software is a separate decision, Stage 1 can be forecast from a class that matches it better, and the component bootstrap, which never let software affect the machines, agrees that Stage 1 alone is well inside that figure.

Staging also changes what happens if things go badly. If the pilot finds a P21-type network problem, the business learns it after spending A$35k, not A$140k, and can choose between rebuilding the network as a priced project, choosing a proven package that needs less integration, or running Bay 4 for a while with simpler scheduling. The business's own record hints that package replacements with limited integration, P11 at 1.38 and P17 at 1.21, fared better than the custom and integration-heavy projects, P05 at 2.60 and P21 at 1.95; with two projects on each side, that is a reason to ask the question, not an answer to it.

The cost is time and some benefit: the overnight scheduling and monitoring that the software would provide arrive later. Chapter 7's benefit forecast already assumes the overnight hours will build up slowly, so the team judged that a later software rollout costs less contribution than its flat weekly figure suggests.

## Testing whether the business can carry the P90

A forecast says how likely an outcome is. An affordability test asks a different question: if the bad outcome happens, does the business survive it in good order? This is an illustration. The business's finance manager and its bank agree that it can fund a total of **A$3.5m** for Bay 4 from cash and its existing facility without breaching its loan covenants or starving working capital.

On the whole-project forecast, the P90 of A$3.917m exceeds that limit by about A$417k. Chapter 5 asked whether the business could find the A$538k margin between the P80 funding of A$3.379m and the P90; the answer is that it can find only 3,500 − 3,379 = A$121k of it. The limit corresponds to a ratio of 3,500 ÷ 2,400 = 1.458 on the approved budget, and 4 of the 24 past projects finished above that ratio: on the business's own history, about one Bay 4 in six would push it past what it can fund. On the staged basis, the committed P90 of A$3.371m is within the limit with about A$129k to spare. Staging therefore answers the P90 question that the whole-project forecast fails, and Chapter 10 sets out how the decision paper uses that answer to settle the funding figure.

```figure
type: decision
title: The affordability test for Bay 4
question: If the P90 outcome happens, can the business fund it without breaching its limits?
caption: This is an illustration. The test is applied to the commitment being made now, not to everything the business might later choose to add.
- Yes | proceed at the chosen P-level | fund to P80, hold the gap to P90 in view
- * Only if staged | approve Stage 1 and the pilot | the rollout waits for its gate and its own test
- No, even staged | reduce the scope, defer or decline | a good project can still be the wrong one now
```

Declining is a legitimate outcome. [Saying no to good projects](/reados/collections/project-sponsors-governance-and-decisions/saying-no-to-good-projects/) explains why a proposal that is worthwhile on its own can still be the wrong use of the money and people the business has. The affordability test adds a simpler reason: a project that would break the business in one case in ten is not justified by being profitable in the other nine.

The team also wrote its **walk-away conditions** before approval, while nobody had yet spent money they would be reluctant to write off. Bay 4 stops for review if the network operator requires supply works above an amount stated in advance, if the integrator cannot demonstrate the pallet interface on the business's machine model, or if the Stage 1 forecast at any gate rises above the funding limit. Conditions written after the money is spent tend to be written to fit what has already happened.

## Gates that decide something

Staging only works if the gate between stages is a real decision, with the option to stop, change or continue, and the information to choose. The [Project Gate Review tool](/tools/project-gate/) balances financial value, strategic fit, urgency, risk and resource readiness into a transparent gate score, and is one way to make the gate's reasoning visible. For Bay 4, the software gate asks four questions: did the pilot meet its written acceptance criteria; what did it find that the estimate did not include; what is the rollout's forecast, from the software subclass or a better-matched class if the pilot has changed the risk; and does the total commitment still pass the affordability test with Stage 1 re-forecast from its actual progress?

The gate is chaired by the owner, who holds the reserve, not by the project manager, who holds the project's contingency and has every reason to want the work to continue. The project manager presents the evidence; the owner decides. Writing down in advance what result from the pilot would lead to each choice, continue, change or stop, keeps the gate from becoming a formality that approves whatever has been prepared.

## The error: the contingency was cut, not the risk

This is an illustration. When the whole-class P80 of A$3.379m was first shown to the owner, the team's first response was to look for savings. The draft risk register listed, as a mitigation, "contingency removed: risk now covered by outside-view uplift". With the A$120k contingency gone, the approved budget became the base of A$2,280k, and the P80 became 2,280 × 1.408 = **A$3,210k**, about **A$169k** lower. The paper looked more affordable. Nothing about the project had changed.

The finance manager found the problem with one question: what had changed in the work to make it A$169k cheaper? The answer was nothing. The class ratios were measured against past approved budgets that already included their own contingencies, as Chapter 1 found for P22 to P24, which carried the same 5% line. Applying them to a budget without contingency is not like with like, and the uplift is just being applied to a smaller number. The likely final cost of the building, machines, automation and software was what it had been the day before.

```figure
type: checklist
title: Mitigations that change the project, and one that changes only the paper
caption: This is an illustration. A real mitigation changes the work, the scope, the timing of a commitment or the information available. Removing contingency changes none of them.
- Investigate the supply, the ground and the integration before approval | finds the discovery while it is cheap
- Stage the software behind a pilot and a gate | committed P90 down from A$3.917m to A$3.371m
- Write walk-away conditions before spending | makes stopping a decision, not a failure
- x Remove the contingency and re-apply the uplift | P80 falls by A$169k on paper; the cost does not
- ? Ask what changed in the work for every reduction in the forecast | the question that found the error
```

The contingency was restored, the register entry was deleted, and the team adopted a rule: a reduction in the forecast must name the change in the project that justifies it.

## Exercise: the software gate

This is an illustration. At the software gate, Stage 1 is 60% complete and its re-forecast P90 is A$2,950k. The pilot passed its acceptance criteria and cost A$52k, a ratio of 1.41 on its A$36.8k share. The rollout's share of the approved budget is the remaining A$110.5k. Using the software subclass P90 of 2.405 for the rollout, what is the total commitment at P90 if the rollout is approved, and does it pass the A$3.5m affordability test?

**Worked answer.** The rollout's P90 is 110.5 × 2.405 = **A$265.8k**. The total commitment at P90 is the Stage 1 re-forecast plus the pilot's actual cost plus the rollout: 2,950 + 52 + 265.8 = **A$3,267.8k**, which passes the test with about **A$232k** to spare. Two things make this better than the approval-day figure. Stage 1 is now more than half built, so its forecast rests on real costs as well as the class; and the pilot's cost is a fact rather than a forecast. Using the full software subclass P90 for the rollout is cautious, because the pilot was designed to retire exactly the network and interface problems that drove P05 and P21. The gate can approve the rollout knowing that even the cautious figure fits.
