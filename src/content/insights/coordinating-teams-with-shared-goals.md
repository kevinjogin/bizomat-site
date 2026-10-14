---
title: "Shared goals, separate views: how teams coordinate without full information"
description: "When team members share a goal but each sees only part of the picture, coordination is surprisingly hard. Lessons from collaborative agents research for designing teams, roles and communication."
publishDate: 2026-10-03
category: "Ideas"
tags:
  - systems
  - operations
  - ai
author: "GoCore"
featured: false
draft: false
---

Imagine two parents caring for a baby during the night. Both want the same thing: a fed, settled baby and as much sleep as possible for everyone. But each parent hears and sees slightly different things, depending on where they are and whether they are awake. Should one get up to feed the baby, or assume the other will? If both get up, effort is wasted. If neither does, the baby stays hungry.

Now replace the parents with a team of delivery drivers sharing a region, a group of drones surveying a bushfire, the departments of a business, or the members of a project team. The structure is the same: several decision makers share a goal, but each has only a partial view of the situation and must decide what to do without knowing exactly what the others know or will do.

*Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray closes with a chapter on **collaborative agents**, which studies exactly this situation. The book even uses a multi-caregiver version of a crying-baby problem as an example. This article explains the key ideas in plain English and draws practical lessons for designing teams, roles, communication and processes. It is part of GoCore's series on decision making.

## Shared goals, local information

The book models collaborative decision making as a **decentralised partially observable Markov decision process**, often abbreviated Dec-POMDP. The name is long, but the idea is straightforward:

- **Several agents** act in the same environment.
- They share a **common reward**: they succeed or fail together.
- Each agent receives its **own observations**, which reveal only part of the situation.
- Each agent chooses its **own actions**, based only on what it has observed.

The difference from a single decision maker is crucial. If one central decision maker could see everything all agents see and control all their actions, the problem would be a standard decision under uncertainty. In a decentralised setting, each agent must act on its own local information, while anticipating that the others are doing the same with different information.

## Why coordination is so hard

Researchers have shown that finding optimal policies for Dec-POMDPs is, in general, extraordinarily difficult computationally, far harder than for a single agent with partial observability. The reason is intuitive. Each agent must reason not only about the state of the world, but about what the other agents might have observed, what they might believe, and what they might therefore do. Those agents, in turn, are reasoning about it. The space of possibilities multiplies rapidly.

This formal result echoes everyday experience: coordinating several people who each see part of a situation is genuinely hard, even when everyone shares the same goal and acts in good faith. Coordination failures are not necessarily signs of poor effort or bad intentions; they are a natural consequence of distributed information.

## Ways the problem becomes easier

The book describes several special cases that are much more tractable. Each corresponds to a practical way of designing teams and systems to make coordination easier.

### Shared observations

If all agents observe the full situation, or share everything they observe, the problem reduces to a single decision maker controlling a team, which is much simpler. In practice, full sharing is rarely possible, but **shared situational awareness**, such as a common dashboard, a shared board of tasks or a regular stand-up meeting, moves a team closer to this case.

### Independent parts

If agents' actions affect separate parts of the environment, with little interaction, each can largely plan independently. Clear division of responsibilities, such as separate territories, separate product lines or separate stages of a process, creates this kind of independence.

### Limited interaction

Often agents are mostly independent but interact at specific points, such as a hand-over between teams or a shared resource. Focusing coordination effort on those interaction points, rather than on everything, makes the problem manageable.

## Methods for collaborative planning

The book describes several approaches to finding good joint policies.

### Iterated best response

Fix the policies of all agents but one, and improve that agent's policy as a best response to the others. Then move to the next agent and repeat. Each step improves or maintains team performance, and the process settles at a point where no single agent can improve the team's results by changing alone.

This mirrors a familiar organisational process: each team member or department refines its own approach, given how the others currently work, and the organisation gradually improves. Like any local improvement process, it can settle at a good but not best arrangement, where improvement would require several parties to change at once.

### Heuristic search and dynamic programming

Other methods build joint policies step by step, keeping only the most promising candidates at each stage to control the explosion of possibilities. These methods trade guaranteed optimality for practical solutions to larger problems.

### Finite controllers

Policies can also be represented as compact **controllers**: small sets of internal states, each associated with an action, with rules for moving between states based on observations. Optimising controllers for each agent provides a manageable way to represent coordinated behaviour without tracking every possible history. In organisations, simple shared protocols play a similar role: "if you see X, do Y and switch to mode Z".

## Lessons for designing teams

The research on collaborative agents suggests practical principles for any team that shares a goal but not full information.

### Reduce the need for coordination

Where possible, divide work so that people's actions affect separate parts of the outcome. Clear ownership of areas, customers, processes or decisions reduces the number of situations where people must guess what others will do.

### Focus coordination on interaction points

Identify where work interacts: hand-overs, shared resources, shared customers, dependencies between tasks. Concentrate communication and agreed procedures there.

### Share the information that matters

Full sharing of everything is impractical. But sharing the specific information that others need to make good decisions, such as status updates at hand-overs, changes in customer circumstances or emerging risks, dramatically reduces coordination failures.

### Agree conventions in advance

Conventions resolve situations that would otherwise require real-time negotiation. "Whoever is on call responds first." "The account owner speaks to the customer." "If a delivery is late, the driver contacts the customer before the office does." Conventions act like the coordinating signals described in [When others decide too](/insights/game-theory-when-others-decide-too/), allowing everyone to know what others will do.

### Design roles, not just tasks

Roles define what each person is responsible for observing and acting on. When roles are clear, people can act confidently on their own information, knowing others are covering their own areas.

### Use simple, robust protocols

Protocols that work reasonably well across many situations are often more valuable than optimal plans that work only when everyone's information is accurate. Simple rules tolerate misunderstandings and surprises better.

### Improve one part at a time, but check the whole

Iterated best response shows that improving each part given the others is useful, but it can get stuck. Occasionally reviewing the whole system, and considering changes that require several parts to shift together, can reveal improvements that changes within one team would miss.

## When to communicate

Communication is the most direct way to reduce the difficulty of decentralised decisions, because it turns private information into shared information. But communication has costs: time, attention, interruption and sometimes delay. Teams that communicate everything drown in messages; teams that communicate too little make avoidable mistakes.

A useful principle, closely related to [The value of information](/insights/the-value-of-information/), is to communicate when the information would change what someone else does. A plumber who finishes early should tell the office, because it changes which jobs can be assigned. A plumber whose job is running exactly to schedule need not, because nothing changes. Asking "would this change their decision?" filters out noise while keeping the messages that matter.

It also helps to agree in advance which events always trigger communication, such as delays beyond a threshold, safety issues or customer complaints, so that important information is never left to individual judgement under pressure.

## Reliability and trust

Decentralised coordination depends on each member being able to predict what the others will do. That prediction is only possible if people behave consistently: following agreed conventions, updating shared information promptly and doing what they say they will do. When one member becomes unpredictable, others must start hedging, duplicating work or checking constantly, and the efficiency of the whole team falls.

Reliability is therefore not only a personal virtue but a structural requirement for coordination. Teams that make commitments visible, follow through on them and repair lapses quickly can coordinate with much less communication.

## What changes as teams grow

As teams grow, the number of possible interactions between members grows much faster than the number of members. Three people have three pairs of relationships; ten people have forty-five. Informal coordination that works well in a small team becomes unmanageable in a larger one.

Growing organisations typically respond by introducing structure: smaller sub-teams with clear responsibilities, defined interfaces between them, shared systems of record and regular coordination points. These are the organisational equivalents of the tractable special cases in decentralised decision research, deliberately reducing the number of situations in which everyone must reason about everyone else.

## Collaborative agents in technology

These ideas are increasingly relevant to technology. Teams of robots in warehouses, fleets of drones, networks of sensors and distributed software systems all involve agents with local information and shared goals. The book mentions distributed wildfire surveillance by drones as one application: each drone sees only part of the fire, and the team must decide where to fly to provide the best overall picture.

Systems built from several artificial intelligence agents working together face the same challenges. Clear roles, defined interfaces, shared information at the right points and agreed protocols are as important for teams of software agents as they are for teams of people.

## A worked illustration

This is an illustration, not a real business.

A small plumbing business has three plumbers who each take jobs directly from customers by phone, plus an office manager who also takes bookings. Double-bookings, missed urgent calls and two plumbers driving to the same suburb are common. Everyone shares the same goal, serving customers well and efficiently, but each sees only their own calls and schedule.

The owner applies the lessons:

- **Reduce coordination needs:** each plumber takes primary responsibility for a set of suburbs.
- **Share key information:** all bookings go into one shared calendar visible on everyone's phone.
- **Focus on interaction points:** urgent calls outside a plumber's area go to the office manager, who assigns them using the shared calendar.
- **Agree conventions:** the plumber who receives a call confirms the booking in the calendar before ending the call; if a job overruns, the plumber updates the calendar immediately.

Within a month, double-bookings stop, urgent calls are answered faster and travel time falls. No one is working harder; the team is simply coordinating with better shared information and clearer conventions.

## Common mistakes

**Assuming shared goals guarantee coordination.** Distributed information makes coordination hard even among willing people.

**Trying to share everything.** Focus on the information others need to decide well.

**Leaving interaction points undefined.** Hand-overs and shared resources need explicit procedures.

**Relying on real-time negotiation.** Conventions agreed in advance resolve recurring situations faster.

**Only improving parts in isolation.** Some improvements require several parts to change together.

## Questions to ask

- Where does our team share goals but not information?
- Where do people's actions interact, and how is that handled?
- What information does each person need from others to decide well?
- Which recurring coordination situations could be settled with a simple convention?
- For your own business: where do coordination failures happen most often, and what shared information or rule would prevent them?

## Bringing it together

Teams that share a goal but have different views of the situation face a genuinely hard coordination problem, as research on decentralised decision making confirms. Each member must act on local information while anticipating what others, with different information, will do.

Coordination becomes manageable when work is divided to reduce interactions, when coordination effort focuses on the points where work connects, when the right information is shared, and when conventions and simple protocols settle recurring situations in advance. These principles apply equally to teams of people, teams of machines and the departments of a growing business.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022). Explanations are GoCore's own; the worked illustration is hypothetical. This article is general information, not professional advice.*
