---
title: "Be careful what you reward: designing objectives for decisions"
description: "Automated systems and people both optimise what they are measured on. How objectives go wrong, how to balance multiple goals with trade-off analysis, and how to design rewards and KPIs that work."
publishDate: 2026-10-03
category: "Technology"
tags:
  - ai
  - automation
  - systems
  - operations
author: "GoCore"
featured: false
draft: false
---

Every decision system, whether a reinforcement learning algorithm, an optimisation model or a team of people with performance targets, pursues an objective. And every such system has a remarkable ability to find ways of achieving its objective that its designers did not intend.

A call centre measured on average call length may find that calls get shorter because customers are transferred or rushed, not because problems are solved faster. A sales team rewarded for new contracts may sign customers who are unlikely to pay. An automated system rewarded for a game score may discover a loophole that earns points endlessly without ever finishing the game, a widely reported example from reinforcement learning research.

These failures share a cause: the objective did not fully capture what the designers actually wanted. *Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray emphasises that decision-making systems require carefully balancing multiple objectives, and that before deployment it is important to check that a system's behaviour matches what is actually desired. This article explores how objectives go wrong, how to analyse trade-offs between competing goals, and practical principles for designing rewards and performance measures, for algorithms and for organisations alike. It is part of GoCore's series on decision making.

## Why objectives are hard to specify

What people want from a system is usually rich, contextual and partly unstated. A collision avoidance system should prevent collisions, but also avoid unnecessary alerts, not confuse pilots and work with air traffic control. A customer service team should resolve problems, but also treat customers with respect, avoid promising what cannot be delivered and protect the business's reputation.

An objective that a system can optimise must be precise. Turning rich intentions into precise measures inevitably leaves things out. The more capable the optimiser, the more thoroughly it will exploit whatever was left out.

### Goodhart's law

The economist Charles Goodhart observed that statistical regularities tend to break down when they are used as targets for control. The idea is often paraphrased as: when a measure becomes a target, it ceases to be a good measure. A measure that correlated well with success when nobody was optimising it can lose that correlation once people, or algorithms, start pushing on it directly.

### Specification gaming

In artificial intelligence research, cases where a system achieves its specified objective in an unintended way are often called **specification gaming** or reward hacking. Researchers have catalogued many examples: simulated robots that exploit physics glitches, game-playing agents that find scoring loopholes, and systems that learn to satisfy the letter of a goal while defeating its purpose. These examples are not failures of the learning algorithm; the algorithm did exactly what it was told. They are failures of the objective.

## Rewards in sequential decisions

In sequential decision problems, the objective is expressed as a **reward** for each step, accumulated over time. Designing that reward involves several choices.

**What to reward.** Rewarding the true goal directly, such as completing a delivery, is usually safest, but may be **sparse**, making learning slow. Rewarding intermediate progress speeds learning but risks the system pursuing progress signals rather than the goal.

**What to penalise.** Negative rewards for undesirable outcomes, such as collisions, complaints or wasted materials, encode what must be avoided. Leaving out an important penalty is one of the most common causes of unintended behaviour.

**How to weigh the future.** The discount factor determines how much future rewards count. A system that heavily discounts the future may take actions that look good now but harm long-term outcomes, such as skipping maintenance.

### Reward shaping

The book discusses **reward shaping**, adding intermediate rewards to guide learning. Research has shown that shaping based on the difference in a "potential" between successive states, roughly a measure of how promising each state is, speeds learning without changing which policy is ultimately best. Other forms of shaping can change the optimal behaviour, sometimes in undesirable ways. The lesson generalises: intermediate targets are useful guides, but they should be designed so that gaming them does not undermine the real goal.

## Multiple objectives and trade-off analysis

Most real decisions involve several objectives that conflict. Safety versus efficiency. Speed versus accuracy. Cost versus quality. Growth versus risk.

### Weighted objectives

A common approach combines objectives into a single reward by weighting them: for example, the cost of a collision weighted heavily, and the cost of an unnecessary alert weighted lightly. The weights express the trade-off. Changing them changes the system's behaviour.

The difficulty is choosing the weights. They are value judgements, and small changes can produce large differences in behaviour.

### The Pareto frontier

A more informative approach is to explore the trade-off explicitly. A policy is **Pareto optimal** if no other policy is better on one objective without being worse on another. The set of all Pareto optimal policies forms the **Pareto frontier**, named after the economist Vilfredo Pareto.

The book illustrates this with aircraft collision avoidance, plotting the probability of collision against the expected number of changes to pilot advisories for several families of policies. By varying the relative weight on safety and on operational efficiency, the optimised policies trace out a curve that dominates simpler rule-based policies: for any given level of safety, the optimised policy needs fewer advisory changes.

Presenting the frontier to decision makers has a major advantage: instead of choosing abstract weights, they can see the actual options available and choose the trade-off they are willing to accept.

### A business illustration

This is an illustration.

A delivery business considers different routing policies, each with a different balance between on-time delivery and fuel cost:

| Policy | On-time deliveries | Weekly fuel cost |
| --- | --- | --- |
| A | 88% | $4,000 |
| B | 92% | $4,300 |
| C | 95% | $4,900 |
| D | 91% | $4,600 |
| E | 97% | $6,200 |

Policy D is **dominated**: Policy B achieves better on-time performance at lower cost. A, B, C and E form the frontier. Choosing among them is a business judgement: is the improvement from 95% to 97% on-time worth an extra $1,300 a week? Laying out the frontier makes that judgement explicit and informed.

## Designing better objectives

Some principles help, whether the objective is for an algorithm or for a team.

### Start from the true goal

Write down what you actually want to achieve, in plain language, before choosing measures. Then check each proposed measure against it: if this number improved, would the true goal necessarily improve?

### Use several measures, not one

A single measure is easy to game. A small set of complementary measures, such as speed and quality, growth and retention, cost and customer satisfaction, makes gaming harder. Pair each efficiency measure with a quality measure.

### Include what must not happen

Explicitly penalise outcomes that are unacceptable, such as safety incidents, legal breaches or serious customer harm. Consider hard constraints rather than penalties for outcomes that must never occur.

### Prefer outcomes over activities

Rewarding activities, such as calls made or features shipped, invites activity for its own sake. Rewarding outcomes, such as problems solved or features used, aligns better with the real goal, though outcomes may be slower and harder to measure.

### Test for loopholes

Before deploying an objective, ask: what is the easiest way to score well on this measure without achieving the real goal? If an obvious answer exists, someone, or something, will eventually find it.

### Watch behaviour, not just scores

Regularly observe how the system or team is achieving its results. Rising scores accompanied by surprising behaviour are a warning sign.

### Revise objectives as you learn

Objectives are hypotheses about what produces the desired outcome. When they produce unintended effects, change them.

## Constraints or penalties?

There are two ways to handle outcomes that should be avoided. A **penalty** subtracts from the reward when the outcome occurs, so the system weighs it against other goals. A **constraint** forbids the outcome outright, or limits its probability to an acceptable level, regardless of what else could be gained.

Penalties are flexible but can be traded away: if the reward for speed is large enough, a system may accept occasional safety incidents. Constraints are firmer but can make problems harder to solve, and may be impossible to satisfy completely. A sensible approach is to use constraints for outcomes that are genuinely unacceptable, such as serious harm, legal breaches or safety violations, and penalties for outcomes that are undesirable but can be balanced against other goals.

## Who sets the objective?

Choosing an objective is a decision with consequences for customers, staff and others. It should be made deliberately, by people with the authority and context to make it, rather than left to whoever happens to configure a system or design a dashboard. Recording the reasons for the chosen measures and weights makes it easier to review them later, explain them to the people affected, and change them when they produce unintended effects.

## Objectives in organisations

These lessons apply with full force to key performance indicators (KPIs), incentive schemes and targets.

- A sales commission based only on revenue can encourage discounting, poor customer fit and promises the business cannot keep.
- A production target based only on output can encourage cutting corners on quality or safety.
- A support target based only on ticket closure speed can encourage closing tickets without solving problems.
- A cost target for a department can shift costs onto other departments rather than reducing them.

The fix is rarely to abandon measurement. It is to measure thoughtfully: several balanced measures, attention to how results are achieved, explicit limits, and regular review.

### A quick check for any new target

Before introducing a new target or reward, it helps to run through a short checklist:

- What true goal does this measure stand in for?
- How could someone hit the target without serving that goal?
- What paired measure would reveal gaming?
- What harms or limits must be protected regardless of the target?
- When will we review whether the target is still working?

Five minutes spent on these questions can prevent months of unintended behaviour.

## Objectives and fairness

Objectives also determine who benefits and who bears costs. An algorithm optimising average outcomes may perform well overall while performing poorly for particular groups. A system optimising engagement may favour content that is attention-grabbing rather than useful. The book's discussion of societal impact notes that data-driven algorithms can inherit biases from the way data is collected, and that optimisation can amplify the intentions of its users, whatever they are. Including measures of fairness and harm in the objective, and checking outcomes for different groups, are part of responsible design.

## A worked illustration

This is an illustration, not a real business.

A small online retailer introduces a target for its customer support team: respond to every enquiry within two hours. Response times improve dramatically. But customer satisfaction falls, and repeat enquiries rise.

Investigation shows that staff are sending quick holding replies to meet the target, then taking longer to actually resolve problems. The measure improved; the goal, helping customers, did not.

The retailer redesigns the objectives: a combination of time to resolution, the share of enquiries resolved in a single interaction, and a short satisfaction rating after each resolved case. Response speed remains a measure, but no longer the only one. Within two months, satisfaction recovers and repeat enquiries fall, while response times remain reasonable.

## Common mistakes

**Optimising a single measure.** It invites gaming and neglect of everything else.

**Rewarding activity instead of outcomes.** Activity can rise while results do not.

**Leaving out what must not happen.** Unpenalised harms will eventually occur.

**Hiding trade-offs in weights.** Show decision makers the actual options available.

**Never revising objectives.** Measures that worked once can stop working.

## Questions to ask

- What is the true goal, in plain language?
- What is the easiest way to score well on this measure without achieving that goal?
- What outcomes must never happen, and are they explicitly prevented?
- What does the trade-off frontier between our competing objectives look like?
- For your own business: which target or KPI might be encouraging behaviour you do not want?

## Bringing it together

Decision systems, human or automated, optimise what they are rewarded for, and they are remarkably good at finding unintended ways to do it. Goodhart's law and specification gaming are two names for the same lesson: measures are imperfect stand-ins for goals, and pressure on a measure exposes its imperfections.

Designing good objectives means starting from the true goal, using several balanced measures, including what must not happen, rewarding outcomes rather than activity, exploring trade-offs explicitly with tools such as the Pareto frontier, watching how results are achieved and revising objectives as experience accumulates.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022), together with widely published research on reward design and performance measurement. Explanations are GoCore's own; the illustrations are hypothetical. This article is general information, not professional advice.*
