---
title: "AI agents and automated workflows: what they can safely do and how to keep them under control"
description: "AI agents can plan and act across systems, but each step adds risk. When to use a fixed workflow instead, and how to bound agents with permissions, approvals, limits and audit trails."
publishDate: 2026-10-09
category: "Technology"
tags:
  - ai
  - automation
  - systems
author: "KEVOS®"
featured: false
draft: false
---

AI agents are the latest step in business AI. Rather than answering a single question, an agent is given a goal and works towards it: deciding what to do next, using tools such as search, databases and business systems, observing the results and continuing until it judges the task complete. Vendors promise agents that handle customer requests end to end, process invoices, research suppliers, update records and coordinate other agents.

Some of this works well today, especially for gathering information, drafting and triage. Some of it is risky, because each step an agent takes on its own is a step where it can misunderstand, be misled or make an error that compounds. An agent that can send emails, change records or spend money can do real damage quickly. The useful question is not whether agents are impressive, but where a business should let a model decide what happens next, and how to keep that decision bounded.

This article explains the difference between chatbots, workflows and agents, when a fixed workflow is better than an agent, the controls that keep agents safe, patterns for combining agents, and what agents can sensibly do in a business today. It is general information for managers and technical teams. Agent platforms are developing quickly, so check current capabilities and security features for any product.

## Chatbots, workflows and agents

- **A chatbot** answers questions in a conversation. It may retrieve information but does not act in other systems.
- **A workflow with AI steps** follows a fixed sequence designed by people, using a language model for particular steps such as classifying an email, extracting fields from a document or drafting a reply. The software, not the model, decides what happens next.
- **An agent** is given a goal and tools, and the model decides which tool to use, interprets the result and decides the next step, looping until it reaches the goal or a limit.

The difference is who controls the path. In a workflow, people designed the path and the model fills in specific steps. In an agent, the model chooses the path.

## Use a workflow where you can

Many tasks presented as agent problems are really workflow problems. If the steps are known, the branches are few and errors are expensive, design a workflow and use the model only where judgement on unstructured text is needed. A useful test: if the procedure fits on a page with a few decision points, implement it as a workflow.

Agents earn their place where there is genuine **residual ambiguity**: tasks where the steps cannot be specified in advance, such as investigating an unusual exception, researching across varied sources or triaging requests that take many forms. Agency should be what is left after everything predictable has been made deterministic, not the starting point.

Workflows are easier to test, predict, audit and explain. They also cost less, because they make fewer model calls.

## How agents work

An agent typically runs a loop:

1. **Plan**: break the goal into steps or decide the next action.
2. **Act**: call a tool, such as searching documents, querying a database, calling an application interface or drafting a message.
3. **Observe**: read the result.
4. **Decide**: continue, change approach, ask for help or stop.

**Tools**, also called function calling, are defined by the application: each tool has a name, a description and defined inputs. The model chooses a tool and supplies inputs; the application executes it and returns the result. The application, not the model, controls what each tool can actually do.

Open protocols such as the Model Context Protocol aim to standardise how AI applications connect to tools and data sources. They make integration easier but do not remove the need to vet each connection and control its permissions.

## Why errors compound

Each step an agent takes has some chance of error: misreading a result, choosing the wrong tool, misunderstanding the goal. Over many steps, small error rates multiply. If each step is right 95% of the time, a ten-step task with no checks succeeds only about 60% of the time. This is why long autonomous chains are risky and why checks, validation and human approval at key points matter so much.

```figure
type: bars
title: Chance a chain of steps succeeds at 95% each
unit: %
max: 100
caption: Small error rates multiply over unchecked steps.
- 1 step | 95
- 5 steps | 77
- *10 steps | 60 | about 60%
```

Validation between steps changes the arithmetic. If a check catches most errors at each step, for example by confirming that extracted values match a record or that a proposed action fits business rules, the agent can correct course before errors build up. Shorter chains, verified intermediate results and early hand-over to a person when confidence is low all improve reliability.

## Controls that keep agents safe

### Least privilege

Give agents only the access they need for the task: read-only where possible, scoped to particular records, systems and actions, using credentials separate from any person's. An agent that drafts replies does not need permission to send them. An agent that researches suppliers does not need access to payroll.

### Human approval gates

Require a person to approve actions that are irreversible, external, high-value or sensitive: sending messages to customers or suppliers, making payments, changing prices, deleting or altering records, and anything with legal effect. Approval screens should show what the agent proposes, why and on what evidence, so approval is a real decision rather than a click. The [governing AI decisions](/reados/collections/ai-in-business-practice/governing-ai-decisions/) article covers deciding what machines may decide and making human oversight real.

### Explicit states and limits

- **State machines** define the stages a task can be in and the allowed transitions, so an agent cannot skip from "investigating" to "paid".
- **Termination conditions** stop the loop: a maximum number of steps, a time limit, a cost budget, a defined success condition, or repeated failure.
- **Spend and rate limits** prevent runaway costs and floods of actions.

### Retries and recovery

Tools fail and services time out. Design actions so that retrying them does not cause duplicates, such as creating two orders, and define how to undo or compensate for partial work. When recovery is unclear, the agent should stop and hand over to a person.

### Defence against manipulation

Agents read content from emails, documents and web pages, and that content can contain instructions designed to hijack them, known as **prompt injection**. An agent that reads a malicious email might be induced to forward confidential data or take an unintended action. Defences include least privilege, treating retrieved content as data rather than instructions, approval gates for consequential actions, and monitoring for unusual behaviour.

### Audit trails

Log every step: the goal, the plan, each tool call and result, each decision and each approval. Logs make it possible to investigate problems, demonstrate accountability and improve the system.

### Clear accountability

An agent cannot be accountable; people and the business are. Name an owner for each agent who is responsible for its permissions, performance and incidents. Agree with vendors who is responsible when their platform or model behaves unexpectedly, and check that contracts, insurance and privacy arrangements cover the agent's activities. Where agents interact with customers or make decisions affecting them, tell people that automation is involved and give them a way to reach a person. Treat a significant agent error as an incident: contain it, investigate the logs, fix the cause and record the lesson.

## Multi-agent patterns

Complex systems sometimes use several agents:

- **Supervisor and specialists**: a coordinating agent assigns sub-tasks to specialist agents, such as one for research and one for drafting.
- **Routing and hand-offs**: a front agent classifies a request and hands it to the right specialist or to a person.
- **Parallel or sequential execution**: independent sub-tasks run at once; dependent ones in order.
- **Shared or isolated memory**: agents may share a common record of the task or keep separate contexts to avoid confusion and limit data exposure.

More agents mean more interactions, more failure modes and more cost. Start with a single agent or a workflow, and add agents only when evidence shows a clear benefit.

## Memory and data exposure

Agents often keep a working memory of the task: notes, intermediate results and earlier conversation. Some platforms also keep longer-term memory across tasks. Memory improves continuity but creates risks. Information from one customer's task can leak into another's if memory is shared carelessly, and sensitive data can persist longer than intended. Keep memory scoped to the task or user wherever possible, decide what may be stored and for how long, exclude personal and confidential information that is not needed, and make stored memory visible to those responsible for the system.

## Measuring agent performance

Agents need measures beyond whether the final answer looked right:

- **Task success rate** on a realistic test set, judged against defined outcomes.
- **Step efficiency**: how many steps and tool calls a task takes, which drives cost and time.
- **Escalation rate**: how often the agent hands over to a person, and whether it does so appropriately.
- **Error types**: wrong tool, misread result, wrong conclusion, policy breach.
- **Cost per task**, including model and tool costs.
- **Approval outcomes**: how often people reject or change the agent's proposals, and why.

Track these over time and after every change to prompts, tools, models or permissions.

## Introducing agents in stages

A staged approach builds evidence before autonomy:

1. **Shadow mode**: the agent works alongside people on real tasks, but its outputs are compared with human decisions and not used.
2. **Assist mode**: the agent drafts, gathers and recommends; people decide and act.
3. **Supervised action**: the agent takes low-risk, reversible actions within limits, with sampling and review.
4. **Wider autonomy**: only for tasks where evidence shows consistent performance and the consequences of errors are acceptable.

```figure
type: steps
title: Introducing an agent in stages
caption: Move up only when evidence shows consistent performance and acceptable consequences.
- Shadow mode | compared, not used
- Assist mode | drafts and recommends
- Supervised action | low-risk, reversible, sampled
- *Wider autonomy | only where evidence supports it
```

Each stage should have exit criteria agreed in advance, and the business should be able to step back a stage quickly if problems appear.

## What agents can sensibly do today

| Lower risk, good candidates | Higher risk, need strong controls or a workflow |
|---|---|
| Gathering information from several internal sources | Sending external communications without review |
| Summarising and drafting for human review | Making or approving payments |
| Triaging and routing requests | Changing prices, contracts or master data |
| Investigating exceptions in read-only mode | Deleting or overwriting records |
| Preparing documents and checklists | Decisions with legal or safety consequences |
| Monitoring and flagging unusual items | Actions across many systems with broad access |

Before deploying, test agents on realistic and difficult cases, including attempts to mislead them. The [is the AI good enough to rely on](/reados/collections/ai-in-business-practice/is-the-ai-good-enough-to-rely-on/) article covers setting acceptance rules and testing beyond the familiar.

## A worked example

This is an illustrative example. A wholesaler processes about 1,500 supplier invoices a month. About one in five does not match its purchase order or goods receipt, and each exception takes a clerk about 25 minutes to investigate. A vendor proposes an agent that would handle invoices end to end, including approving and paying them.

**Design choice.** The finance manager and IT team decide that most of the process is predictable. They build a workflow: a language model extracts invoice fields into a validated structure, rules match invoices to orders and receipts, and matched invoices follow the existing approval process. An agent is used only for exceptions.

**The exception agent.** For each mismatched invoice, the agent has read-only access to the order, receipt, supplier history, contract prices and correspondence. It investigates likely causes, such as partial deliveries, price changes or duplicate invoices, and drafts a summary with evidence and a recommended resolution. It cannot approve, pay, email suppliers or change records. It stops after a set number of steps or when it cannot find an explanation, and every step is logged.

**Result.** Clerks review the agent's summaries and decide. Average exception handling time falls from about 25 to about 10 minutes, and the evidence trail improves audit readiness. Payments remain under human approval, and a monthly review of a sample of agent investigations checks for errors and missed issues.

```figure
type: bars
title: Minutes to handle an invoice exception
unit: minutes
max: 30
caption: About one in five of 1,500 monthly invoices is an exception; payments stay under human approval.
- Before | 25
- *Agent gathers evidence, clerk decides | 10
```

## Applying this in an Australian business

- **Prefer workflows** where steps are known, and use agents for residual ambiguity.
- **Grant least privilege**, starting read-only.
- **Require human approval** for irreversible, external and high-value actions.
- **Define states, limits and stopping rules.**
- **Design for retries and recovery.**
- **Defend against prompt injection.**
- **Log every step** and review samples.
- **Test on difficult and adversarial cases** before deployment.

## Where agent projects go wrong

- **Agents for problems a workflow would solve.**
- **Broad access** granted for convenience.
- **Approval screens** that invite rubber-stamping.
- **No limits** on steps, time or spend.
- **Trusting content** from emails and web pages as instructions.
- **Multi-agent designs** before a single agent works.
- **No audit trail.**

## Questions to ask about an AI agent

- Could this be a workflow instead?
- What exactly can the agent read and change?
- Which actions need human approval, and what will the approver see?
- When does the agent stop?
- How would we know if it had been manipulated?
- Can we reconstruct everything it did?

## Bringing it together

AI agents let models decide what to do next, which makes them powerful for ambiguous tasks and risky for consequential ones. Use deterministic workflows wherever steps are known, and reserve agents for residual ambiguity. Bound agents with least privilege, human approval for consequential actions, explicit states and stopping rules, recovery design, defences against manipulation and complete audit trails. Start with read-only and drafting tasks, test hard and expand autonomy only as evidence supports it. The result is automation that saves real time without handing control to a system nobody can explain.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® AI academy lessons on chatbots, workflows and agents, tools and function calling, planning, state machines, retries and recovery, human approval gates, orchestration patterns, memory, termination conditions, tool connection protocols and when not to use an agent, together with established AI practice. The worked example is illustrative. This article is general information.*
