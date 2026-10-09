---
title: "Finding and designing AI use cases that pay: from business problem to a scored, specified opportunity"
description: "Long lists of AI ideas rarely become value. A disciplined discovery method: frame the problem, map the work, set requirements, check data readiness and score value, feasibility and risk."
publishDate: 2026-10-09
category: "Technology"
tags:
  - ai
  - strategy
  - process-improvement
author: "KEVOS"
featured: false
draft: false
---

Most organisations now have a list of AI ideas. Some come from vendors, some from enthusiastic staff, some from executives who have read about competitors. A typical list mixes small conveniences, ambitious transformations and solutions looking for problems, with no consistent way to tell which are worth doing. Projects get chosen by enthusiasm or seniority, pilots impress in demonstrations and then stall, and the business concludes that AI is overhyped, when the real problem was how the opportunities were found and defined.

A disciplined discovery process changes the odds. It starts from business problems rather than technology, understands the current work in detail, designs the future work including what people will do, specifies requirements beyond accuracy, checks whether the data and organisation are ready, and scores opportunities consistently on value, feasibility and risk. The output is a small number of well-defined opportunities with baselines, success measures and owners, ready for a decision.

This article sets out that discovery method step by step. It complements the broader principle of starting with the work and treating use cases as bets, and is general information for managers, improvement teams and anyone responsible for choosing where AI should be applied.

## Step 1: start with the business problem

Write a **problem statement** before discussing solutions. A useful format:

- **Who** experiences the problem, such as customers, staff or managers.
- **What** happens now, described as observable facts.
- **The impact**, in time, cost, errors, risk, revenue or customer experience, quantified where possible.
- **The desired outcome**, stated without naming a technology.

For example: "Service coordinators spend about six minutes reading and categorising each incoming work order, about 400 hours a month, and around one in ten is assigned to the wrong trade, causing repeat visits. We want work orders correctly categorised and assigned within minutes of arrival." This statement can be tested, measured and solved in several ways, only some involving AI.

Ideas that cannot be written as a problem statement with a measurable impact are not ready for investment. That does not mean they are worthless; it means more work is needed to understand the problem, or that the idea is really a request to explore a technology, which can be funded separately as learning rather than presented as a business case.

## Step 2: talk to the people who do the work

**Stakeholder interviews and workshops** uncover how work really happens, which is often different from the procedure manual. Speak with the people who do the work, their managers, the people who receive the output and those responsible for risk, IT and data. Ask:

- What takes the most time, and why?
- Where do errors and rework come from?
- What information do you look for, and where?
- Which decisions need judgement, and which follow rules?
- What would good look like for you?

Workshops can then group problems, test early ideas and build shared ownership. Record assumptions and disagreements rather than smoothing them over.

A practical half-day workshop might run as follows: a short briefing on what current AI can and cannot do, with examples relevant to the business; a review of the problems gathered in interviews, grouped by process; small-group work to describe the biggest problems in the problem statement format; a quick first pass at value and feasibility for each; and agreement on which problems to investigate further and who will own each. Keep technology demonstrations brief, so the discussion stays on problems rather than tools.

## Step 3: map the current and future state

Map the **current state** of the process: steps, people, systems, handoffs, volumes, times and error rates. Process maps reveal where effort and delay really sit. Often the biggest gains come from fixing the process itself, such as removing duplicate data entry or clarifying rules, with or without AI.

Then design the **future state**: what changes, which steps AI supports or performs, what people do instead, how exceptions are handled and how quality is checked. Designing the human role explicitly, including reviewing, approving, handling exceptions and improving the system, prevents the common failure of a tool that fits nobody's workflow.

## Step 4: specify requirements, including non-functional ones

**Functional requirements** describe what the solution must do: read work orders, assign one of 12 trade categories, flag urgent safety issues, draft a response.

**Non-functional requirements** describe how well and under what conditions, and they often decide whether an AI solution is viable:

- **Accuracy and error tolerance**, especially for critical cases.
- **Speed**, such as categorisation within two minutes of arrival.
- **Availability** and what happens when the AI is unavailable.
- **Privacy and security**, including what data may be sent where.
- **Auditability**: what must be recorded and for how long.
- **Explainability**: whether users or customers need to know why an output was produced.
- **Volume and cost limits.**
- **Accessibility and usability** for the people who will use it.

## Step 5: record constraints, assumptions and dependencies

**Constraints** are fixed limits: budgets, regulations, contracts, system boundaries, data that cannot leave the country. **Assumptions** are things believed true but not yet confirmed, such as "historical work orders are labelled consistently". **Dependencies** are things the opportunity relies on, such as an upgrade to the work order system or access to a supplier's data. Each assumption should have an owner and a way to test it early, because untested assumptions are a common reason pilots fail.

## Step 6: check data and organisational readiness

**Data readiness** asks whether the information the solution needs exists, is accessible, is of sufficient quality and may lawfully be used for this purpose. For many generative AI uses, the key data is documents and examples rather than large databases; for prediction and classification, it is historical records with reliable outcomes. The [data readiness is a business habit](/insights/data-readiness-is-a-business-habit/) article covers building these foundations.

**Organisational readiness** asks whether there is a business owner willing to be accountable, people with time to test and adopt the solution, technical capacity to build or integrate it and a governance path for approval.

## Step 7: score value, feasibility and risk

Score each candidate consistently, using defined scales and evidence rather than enthusiasm:

- **Value**: size of the problem, benefit if solved, strategic importance and how quickly value arrives.
- **Feasibility**: data readiness, technical complexity, integration effort, skills and dependencies.
- **Risk**: consequences of errors, privacy and security exposure, regulatory and reputational risk, and change management difficulty, scored so that lower risk earns a higher score.

A simple weighted score helps compare options, for example 50% value, 30% feasibility and 20% risk on scales of 1 to 5. Scores are an aid to discussion, not a substitute for judgement. Look for high-value, feasible, lower-risk opportunities to start, and for valuable but currently infeasible ones that justify foundation work, such as improving data.

### Quantifying value honestly

Value estimates are where AI cases most often go wrong. Some practical rules:

- **Time saved is only value if it is used.** Reducing categorisation from six minutes to two on 4,000 work orders a month frees about 267 hours. At a loaded cost of $55 an hour, that is about $14,700 a month of capacity, but it becomes financial value only if the time absorbs growth, replaces overtime or contractors, or moves to more valuable work. State which.
- **Count error reduction separately.** Fewer misassigned jobs mean fewer repeat visits, which can be costed from current data.
- **Include running costs and human review time** in the future state, not just the build cost.
- **Use ranges, not single figures**, and show the assumptions behind them.
- **Include risk reduction and customer effects** where they can be estimated, and describe them where they cannot.

### Feasibility signals

Some signs suggest an opportunity will be feasible: the task is repetitive and high-volume; good examples of correct outputs already exist; errors can be detected and corrected cheaply; the information needed is available in digital form; and the people who do the work are keen to test it. Warning signs include tasks that depend on information nobody records, outcomes that take years to observe, a lack of agreement on what a correct output is, and heavy integration with systems that are being replaced.

## Step 8: define the opportunity on one page

For each shortlisted opportunity, prepare a one-page definition:

- Problem statement and baseline measures.
- Future-state process and the human role.
- Functional and key non-functional requirements.
- Data needed and readiness findings.
- Main risks and controls.
- Success measures and how they will be measured.
- Options considered, including improving the process without AI, buying a product feature and building a solution.
- Estimated costs, including running costs, and expected benefits.
- Business owner, sponsor and next decision.

## Step 9: present options and a recommendation

Executives need a clear decision paper, not a technology briefing. Present the problem, the options, including doing nothing and non-AI fixes, the recommended option with costs, benefits, risks and uncertainty, and the decision required. Speak to each audience's concerns: finance about costs, benefits and their timing; technology leaders about architecture, security and support; operational leaders about workload and adoption. The [cost-benefit analysis for business decisions](/insights/cost-benefit-analysis-for-business-decisions/) article covers structuring the financial case.

## Keeping an opportunity pipeline

Discovery is not a one-off exercise. Keep a register of AI opportunities with their problem statements, scores, status and owners. Accept new ideas through a simple intake form that asks for the problem and its impact, not the tool. Review the register regularly, for example each quarter, rescoring as data improves, technology changes and earlier projects deliver lessons. Record why opportunities were rejected or deferred, so the same ideas are not reargued without new evidence, and revisit deferred ones when their blocking conditions change.

## Common traps

- **Starting with a tool** and searching for a problem.
- **Counting time saved** without deciding what the time will be used for.
- **Ignoring the human role** in the future process.
- **Assuming data is ready** without checking.
- **Scoring by enthusiasm** or seniority.
- **Skipping non-AI options**, which are sometimes better and cheaper.
- **No baseline**, so benefits cannot be shown later.
- **Too many pilots at once**, spreading scarce people across work that never finishes.

## A worked example

This is an illustrative example. A facilities maintenance company with about 200 staff has collected 40 AI ideas from staff and vendors. The operations manager runs a structured discovery over six weeks.

**Problems and process.** Interviews and process mapping show that service coordinators spend about 400 hours a month reading and categorising incoming work orders, that about one in ten is misassigned, and that technicians spend significant time typing job reports at the end of the day. Several ideas, such as a public chatbot, turn out to address minor problems.

**Scoring.** Using weights of 50% value, 30% feasibility and 20% risk, with each scored from 1 to 5:

| Opportunity | Value | Feasibility | Risk (higher is safer) | Weighted score |
|---|---|---|---|---|
| Work order categorisation and routing | 4 | 4 | 4 | 4.0 |
| Voice-to-text technician job reports | 4 | 3 | 4 | 3.7 |
| Automated scheduling optimisation | 5 | 1 | 3 | 3.4 |
| Public customer chatbot | 3 | 4 | 2 | 3.1 |

**Decisions.** Work order categorisation proceeds first, with a baseline of six minutes per work order and a 10% misassignment rate, and targets of two minutes including review and under 3% misassignment. Voice-to-text reports follow. Scheduling optimisation is deferred until job duration data improves, with a data improvement project started instead. The chatbot is not pursued.

**Result.** Six months later, categorisation takes about two minutes per work order including coordinator review, misassignment has fallen below the target, and the business can show the benefit against its baseline. The structured list of remaining opportunities guides the next round.

## Applying this in an Australian business

- **Write problem statements** with measurable impacts before discussing tools.
- **Interview and observe** the people who do the work.
- **Map current and future processes**, including the human role.
- **Specify non-functional requirements** such as accuracy, privacy and auditability.
- **Test assumptions** early and record dependencies.
- **Check data and organisational readiness.**
- **Score opportunities consistently** on value, feasibility and risk.
- **Set baselines and success measures** before building.

## Questions to ask about an AI idea

- What business problem does this solve, and how big is it?
- How is the work done today, and where do time and errors go?
- What will people do differently, and who owns the change?
- What accuracy, speed, privacy and audit requirements apply?
- Is the data ready, and may we use it this way?
- Would a non-AI fix achieve most of the benefit?

## Bringing it together

AI use cases pay when they are found and defined with discipline. Start from business problems with measurable impacts, learn how the work is really done, design the future process including the human role, and specify requirements beyond accuracy. Record constraints and test assumptions, check data and organisational readiness, score opportunities consistently on value, feasibility and risk, and define each one on a page with baselines, measures and an owner. Present clear options, including non-AI ones. The result is a short list of opportunities that can be delivered and shown to pay, rather than a long list of ideas. The [adopting AI: start with the work](/insights/adopting-ai-start-with-the-work/) article explains how to run the resulting pilots as deliberate bets.

---

*Source: KEVOS editorial notes, drawing on earlier KEVOS AI academy lessons on starting with the business problem, stakeholder interviews and workshops, current and future state design, functional and non-functional requirements, constraints and assumptions, data and AI readiness, use case scoring, and options analysis and decision papers, together with established practice. The worked example is illustrative. This article is general information.*
