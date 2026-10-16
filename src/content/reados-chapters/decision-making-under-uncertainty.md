---
title: "Decision making under uncertainty: agents, observations and actions"
description: "A plain-English introduction to how people and machines make decisions when outcomes, models, situations and other actors are uncertain, and the main ways to design decision systems."
publishDate: 2026-10-03
category: "Technology"
tags:
  - ai
  - systems
  - strategy
author: "GoCore"
featured: false
draft: false
---

Almost every important decision is made with incomplete information. A pilot decides how to respond to an approaching aircraft without knowing exactly what the other pilot will do. A doctor recommends a screening schedule without knowing whether a disease is present. A business owner decides whether to hire, invest or launch a product without knowing how customers, competitors or the economy will behave.

Computers increasingly help make these decisions, from collision avoidance systems in aircraft to recommendation engines, inventory systems and automated vehicles. Designing those systems well, and knowing when to trust them, requires a clear way of thinking about decisions under uncertainty.

This article introduces that way of thinking, drawing on the textbook *Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray. It explains the idea of an agent interacting with its environment, the four main sources of uncertainty, some real applications, and the main approaches to designing decision-making systems. It is the first article in GoCore's series on decision making, and it provides the vocabulary used throughout the series.

## Agents and the observe-act loop

In decision science, an **agent** is anything that acts based on observations of its environment. Agents can be physical, such as people, robots and vehicles, or entirely software, such as a decision support system that recommends actions to a human.

The interaction between an agent and its environment follows a loop:

1. The agent receives an **observation** of the environment.
2. The agent chooses an **action** through some decision-making process.
3. The action affects the environment, often in ways that are not entirely predictable.
4. The agent receives a new observation, and the loop repeats.

Observations are often incomplete or noisy. A person may not notice an approaching hazard; a radar may miss a detection because of interference; a sales report may arrive late or contain errors. Actions often have uncertain effects. Sounding an alert does not guarantee that a pilot responds in time; launching a marketing campaign does not guarantee a particular response.

The agent's task is to choose actions that best achieve its objectives over time, given the observations it has received so far and its knowledge of the environment.

### Why the loop matters

Thinking in terms of the loop changes how decisions are framed. Instead of a single, isolated choice, most real decisions are part of a continuing sequence. Today's action affects tomorrow's situation, and tomorrow's observations can be used to correct today's mistakes. A good decision process is therefore not only about choosing well once, but about choosing in a way that keeps future options open and learns from what happens.

## Four sources of uncertainty

The book organises decision problems around four sources of uncertainty. Recognising which ones are present in a particular decision is one of the most useful habits a decision maker can develop.

### Outcome uncertainty

The effects of our actions are uncertain. A machine that is serviced may still fail. A price change may increase or decrease sales. Even when we know exactly where we are, we cannot be sure where an action will take us. Decisions with outcome uncertainty require weighing the probabilities of different results and how much each one matters.

### Model uncertainty

Our understanding of how the world works may be wrong or incomplete. We may not know how customers respond to price, how quickly a disease progresses or how a new process behaves. Model uncertainty is the reason experimentation matters: sometimes the best action is the one that teaches us the most about how the world works, not the one that looks best on current assumptions.

### State uncertainty

We may not know the true current situation. A doctor cannot directly see whether a disease is present; they see test results. A manager cannot directly see a customer's satisfaction; they see repeat orders and complaints. Decisions under state uncertainty require maintaining a **belief** about the situation and updating it as new evidence arrives.

### Interaction uncertainty

Other agents act in the same environment, and their behaviour is uncertain. Competitors respond to our prices; other drivers respond to our vehicle; team members make their own decisions. Interaction uncertainty brings in the ideas of game theory, where each agent's best choice depends on what others do.

| Source | The question it raises | Everyday example |
| --- | --- | --- |
| Outcome uncertainty | What will happen if I do this? | Will this repair fix the fault? |
| Model uncertainty | How does this system actually work? | How do customers really respond to price? |
| State uncertainty | What is the situation right now? | Is this machine starting to wear out? |
| Interaction uncertainty | What will others do? | How will a competitor respond? |

Most important decisions involve several of these at once. GoCore's series covers each in turn.

## Real applications

The book illustrates these ideas with demanding real-world applications.

**Aircraft collision avoidance.** A system must alert pilots to potential threats and direct them how to manoeuvre. There is uncertainty in how quickly pilots will respond, how aggressively they will comply and how other aircraft will behave. Alerting too late is dangerous; alerting too early causes unnecessary manoeuvres. Because the system operates continuously worldwide, it must achieve an exceptional level of safety.

**Automated driving.** A vehicle relies on imperfect sensors, such as lidar and cameras, that can be affected by noise and by objects hidden from view, such as a pedestrian behind a parked truck. It must predict the intentions of other road users from their observable behaviour.

**Breast cancer screening.** Screening saves lives but carries risks, including false positives that lead to unnecessary follow-up. Systems that recommend personalised screening schedules, based on individual risk and history, aim to balance those benefits and risks better than age-based schedules alone.

**Financial consumption and investment.** A system might recommend how much of a person's wealth to spend and how much to invest each year, balancing uncertain income and investment returns against the desire for steady consumption over a lifetime.

**Wildfire surveillance.** Teams of drones with limited sensing range must decide where to fly to provide the most useful picture of an evolving fire, avoiding areas where the situation is already known.

**Planetary exploration.** Mars rovers face communication delays of up to half an hour and limited communication windows. Greater autonomy, letting rovers choose their own science targets and respond to hazards, has been proposed as a way to make missions considerably more productive.

These examples share a structure: an agent, imperfect observations, uncertain effects and objectives that must be balanced. The same structure appears in business decisions about inventory, maintenance, pricing, hiring and investment.

## Five ways to design a decision-making system

The book describes a range of methods for designing decision-making agents. They differ in how much the designer must specify and how much is left to automation.

### Explicit programming

The most direct approach is to anticipate every situation the agent might face and write rules for each. This works for simple problems and has the advantage of transparency. But it places a heavy burden on the designer, and rules often fail in situations nobody anticipated. Most business software that makes decisions, from approval workflows to pricing rules, uses this approach.

### Supervised learning

Sometimes it is easier to show an agent what to do than to write rules. The designer provides examples of situations and the correct actions, and a learning algorithm generalises from them. When applied to learning actions from examples, this is sometimes called **behavioural cloning**. It works well when experts genuinely know the best action for a representative set of situations. But it generally cannot do better than the experts, and it can struggle in situations unlike the examples.

### Optimisation

The designer specifies a space of possible decision strategies and a measure of performance, and an algorithm searches for the strategy that performs best, usually by running simulations. This works well when the space of strategies is manageable and simulations are realistic.

### Planning

Planning is a form of optimisation that uses a model of how the problem evolves to guide the search for a good strategy. Many planning methods assume the world is predictable, which can scale well to large problems. The book focuses on planning when uncertainty about the future is important and cannot be ignored.

### Reinforcement learning

Reinforcement learning removes the assumption that a model is known in advance. The agent learns a decision strategy by interacting with the environment, guided only by a measure of performance. A distinctive complication is that each action affects not only the immediate result but also what the agent learns, so the agent must balance exploiting what it knows with exploring to learn more.

| Method | What the designer provides | Strengths | Limitations |
| --- | --- | --- | --- |
| Explicit programming | Rules for each situation | Transparent, predictable | Brittle in unanticipated situations |
| Supervised learning | Examples of correct decisions | Captures expert judgement | Limited by the examples and experts |
| Optimisation | Strategy space and performance measure | Can find strategies humans miss | Needs good simulations |
| Planning | Model of the problem | Uses structure to find good strategies | Depends on model accuracy |
| Reinforcement learning | Performance measure and interaction | Learns without a full model | Needs much experience; can learn unintended behaviour |

Real systems often combine several methods: rules for safety limits, learned models for prediction, and planning or optimisation for choosing actions.

## Objectives and trade-offs

Every decision system needs an objective, and most real objectives involve trade-offs. A collision avoidance system balances safety against unnecessary alerts. A screening programme balances early detection against false positives and cost. A business balances growth against risk, cost against quality and speed against accuracy.

Making these trade-offs explicit is one of the most valuable parts of designing a decision system, whether automated or human. When trade-offs are left implicit, they are made inconsistently. The articles [Utility: putting a value on outcomes](/reados/collections/valuing-time-delay-and-uncertainty/utility-putting-a-value-on-outcomes/) and [Be careful what you reward](/reados/collections/decision-making-machines/be-careful-what-you-reward/) explore how to make them explicit.

## Societal impact

Decision-making algorithms already contribute to many areas of life: energy management and smart grids, wildlife protection, medical diagnosis and matching organ donors to patients, infrastructure maintenance, emergency response, traffic management and aviation safety.

The book also notes the challenges. Algorithms can amplify the intentions of their users, good or bad. Data-driven systems can inherit biases from the way data was collected. Algorithms can be vulnerable to deliberate manipulation. And there is a need to extend moral and legal frameworks to prevent unintended consequences and to assign responsibility. These concerns are explored further in [Testing decision systems before you trust them](/reados/collections/decision-making-machines/testing-decision-systems-before-you-trust-them/).

## What this means for business decisions

The agent framework is useful even when no algorithm is involved.

**Identify the uncertainties.** For an important decision, ask which of the four kinds of uncertainty are present. Each calls for a different response: weighing outcomes, experimenting, gathering evidence or anticipating others.

**Think in loops, not single choices.** Most decisions can be revisited. Designing decisions so that early observations can correct later actions reduces risk.

**Make objectives explicit.** Write down what you are trying to achieve and how you would trade off competing goals.

**Choose the right method.** Simple, stable decisions suit clear rules. Decisions with good historical examples suit learning from data. Decisions with an understood structure suit planning. Decisions in unfamiliar territory suit careful experimentation.

## A worked illustration

This is an illustration, not a real business.

A small manufacturer must decide each week how much stock of a key component to order. Applying the framework:

- **Outcome uncertainty:** deliveries sometimes arrive late.
- **Model uncertainty:** the relationship between orders and demand is not well understood.
- **State uncertainty:** stock counts in the system are sometimes wrong.
- **Interaction uncertainty:** a major customer occasionally places large orders without warning.

The owner had been using a fixed reorder rule, which works most weeks but fails badly when several uncertainties coincide. Recognising them separately leads to targeted improvements: a regular physical stock count to reduce state uncertainty, a simple record of demand to reduce model uncertainty, a safety buffer sized to delivery delays, and a standing conversation with the major customer to reduce interaction uncertainty. No sophisticated algorithm is needed; the framework itself clarifies what to fix.

## Common mistakes

**Treating uncertain decisions as certain.** Ignoring uncertainty leads to fragile plans.

**Lumping all uncertainty together.** Different kinds call for different responses.

**Leaving objectives implicit.** Unstated trade-offs are made inconsistently.

**Using one method for everything.** Rules, learning, planning and experimentation each have their place.

**Forgetting the loop.** Decisions that cannot be revised are riskier than they need to be.

## Questions to ask

- Who or what is the agent, and what can it observe?
- Which of the four kinds of uncertainty are present?
- What is the objective, and what trade-offs does it involve?
- Which design approach suits this decision: rules, examples, optimisation, planning or learning?
- For your own business: which recurring decision would benefit most from being framed this way?

## The series

This article opens GoCore's series on decision making, based on *Algorithms for Decision Making*. The other articles, in a suggested reading order:

1. [From automata to algorithms: a short history of automated decision making](/reados/collections/judgement-markets-and-learning/a-short-history-of-automated-decision-making/)
2. [Thinking in probabilities: degrees of belief for better decisions](/reados/collections/judgement-markets-and-learning/thinking-in-probabilities/)
3. [Learning from small numbers: estimating rates with Bayesian thinking](/reados/collections/marketing-brands-and-customer-experience/learning-from-small-samples/)
4. [Bayesian networks: mapping how causes and evidence connect](/reados/collections/decision-making-machines/bayesian-networks-cause-and-evidence/)
5. [Utility: putting a value on outcomes when choices are uncertain](/reados/collections/valuing-time-delay-and-uncertainty/utility-putting-a-value-on-outcomes/)
6. [The value of information: when is it worth finding out more?](/reados/collections/valuing-time-delay-and-uncertainty/the-value-of-information/)
7. [Framing, certainty and the limits of rational choice](/reados/collections/judgement-markets-and-learning/framing-certainty-and-the-limits-of-rational-choice/)
8. [Sequential decisions: planning when today's choice shapes tomorrow](/reados/collections/decision-making-machines/sequential-decisions-planning-ahead/)
9. [Looking ahead: tree search, rollouts and planning by simulation](/reados/collections/decision-making-machines/looking-ahead-tree-search-and-simulation/)
10. [Explore or exploit? The multi-armed bandit problem](/reados/collections/competitive-strategy-and-positioning/explore-or-exploit/)
11. [Reinforcement learning explained: learning good decisions from experience](/reados/collections/decision-making-machines/reinforcement-learning-explained/)
12. [Be careful what you reward: designing objectives for decisions](/reados/collections/decision-making-machines/be-careful-what-you-reward/)
13. [Learning from experts: imitation learning and its limits](/reados/collections/decision-making-machines/learning-from-experts-imitation-learning/)
14. [Acting when you can't see everything: beliefs, filters and partial observability](/reados/collections/decision-making-machines/acting-when-you-cant-see-everything/)
15. [Testing decision systems before you trust them](/reados/collections/decision-making-machines/testing-decision-systems-before-you-trust-them/)
16. [When others decide too: game theory for business decisions](/reados/collections/competitive-strategy-and-positioning/game-theory-when-others-decide-too/)
17. [Shared goals, separate views: how teams coordinate without full information](/reados/collections/judgement-markets-and-learning/coordinating-teams-with-shared-goals/)

## Bringing it together

Decision making under uncertainty can be understood as an agent in a loop: observing an environment, choosing actions and seeing the results. Uncertainty enters through outcomes, models, the current state and the behaviour of others. Systems that make or support decisions can be designed through explicit rules, learning from examples, optimisation, planning or reinforcement learning, and the best systems often combine them.

The framework is valuable well beyond algorithms. It helps anyone facing an important decision to name the uncertainties, make the objectives explicit and choose a sensible way to decide.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022). Explanations are GoCore's own; the worked illustration is hypothetical. This article is general information, not professional advice.*
