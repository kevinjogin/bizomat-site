---
title: "Sequential decisions: planning when today's choice shapes tomorrow"
description: "Many decisions are steps in a sequence. A plain-English guide to Markov decision processes, policies, value functions, discounting and dynamic programming, with business examples."
publishDate: 2026-10-03
category: "Technology"
tags:
  - ai
  - systems
  - operations
author: "GoCore"
featured: false
draft: false
---

Some decisions are made once. Most important ones are not. A maintenance manager decides each week whether to service, run or replace a machine. A retailer decides each month how much stock to order. A business owner decides each year how much to invest and how much to keep in reserve. Each decision changes the situation in which the next one is made.

Treating these as a series of independent choices often leads to poor results. Running a machine without servicing saves money this week but raises the chance of a costly breakdown next month. Ordering little stock saves cash now but risks lost sales later. Good sequential decisions look ahead, weighing immediate results against their effect on future situations.

The standard framework for such problems is the **Markov decision process**, the centrepiece of the second part of *Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray. This article explains it in plain English: states, actions, transitions and rewards; discounting; policies and value functions; and the dynamic programming methods used to find good policies. It uses a machine maintenance example throughout and is part of GoCore's series on decision making.

## The building blocks

A Markov decision process, or **MDP**, describes a sequential decision problem with four elements.

**States.** A state describes the situation at a given time, with enough detail to make good decisions. For a machine, the state might be "good", "worn" or "broken". For inventory, it might be the current stock level.

**Actions.** In each state, the decision maker chooses an action. For the machine: run it as it is, service it, or replace it.

**Transitions.** Actions change the state, but not with certainty. A **transition model** gives the probability of moving to each next state, given the current state and action. A worn machine that is run might stay worn with probability 0.7 and break with probability 0.3. A worn machine that is serviced might return to good with probability 0.9.

**Rewards.** Each action in each state produces an immediate **reward**, positive or negative. Running a good machine earns production revenue; servicing costs money and lost production; a breakdown costs repairs and lost orders.

### The Markov assumption

The word "Markov" refers to an important assumption: the next state depends only on the current state and action, not on the full history of how the current state was reached. Everything relevant about the past must be captured in the current state.

This assumption is less restrictive than it sounds, because the state can be defined to include whatever history matters. If a machine's chance of breaking depends on how many weeks it has run since its last service, that count can be part of the state.

## Objectives over time

The goal in an MDP is to maximise the total reward over time, not just the immediate reward. There are a few ways to define the total.

**Finite horizon.** The problem runs for a fixed number of steps, such as the 52 weeks of a year or the remaining life of a contract.

**Infinite horizon with discounting.** The problem continues indefinitely, and future rewards are multiplied by a **discount factor** between 0 and 1 for each step into the future. With a discount factor of 0.9, a reward one step away counts as 90% of its face value, two steps away 81%, and ten steps away about 35%.

Discounting reflects the fact that near-term rewards are generally worth more than distant ones: they are more certain, and resources available sooner can be used productively. It also keeps total rewards finite over an infinite horizon, which makes the mathematics work. The choice of discount factor matters: a factor close to 1 makes the decision maker patient, valuing the long term; a lower factor makes them focus on the near term.

## Policies

A **policy** is a rule that specifies which action to take in every state. "Run the machine if it is good; service it if it is worn; replace it if it is broken" is a policy.

Policies are the output of sequential decision making. Rather than a single plan fixed in advance, a policy says what to do in whatever situation arises. This makes policies naturally responsive to uncertainty: if the machine breaks unexpectedly, the policy already says what to do.

In an MDP, there is always an **optimal policy**: a policy that achieves the highest expected total reward from every state. Remarkably, for the standard infinite-horizon discounted problem, the optimal policy does not need to change over time or depend on history; it depends only on the current state.

## Value functions

To find good policies, decision makers estimate **value functions**.

The **value of a state** under a policy is the expected total discounted reward from that state onwards, if the policy is followed. A good machine under a sensible maintenance policy has high value, because it is likely to produce revenue for a long time. A broken machine has lower value, because it must first be repaired or replaced.

The **action value** (often called the Q-value) of taking a particular action in a particular state is the expected total reward from taking that action and then following the policy. Comparing action values tells the decision maker which action is best in each state.

### The Bellman equation

The value of a state can be broken into two parts: the immediate reward from the action taken now, plus the discounted expected value of the state that follows. This recursive relationship is known as the **Bellman equation**, after Richard Bellman, who developed dynamic programming in the 1950s.

In plain terms: the value of being somewhere equals what you get now, plus what the place you are likely to end up next is worth, discounted.

The optimal value function satisfies a version of this equation in which each state's value uses the best available action. Once the optimal value function is known, the optimal policy is simply to choose, in each state, the action with the highest action value.

## Finding optimal policies: dynamic programming

The book describes two classic methods for solving MDPs exactly.

### Policy iteration

1. Start with any policy.
2. **Evaluate** it: calculate the value of every state under that policy.
3. **Improve** it: in each state, switch to the action that looks best given those values.
4. Repeat until the policy stops changing.

Each improvement step produces a policy at least as good as the previous one, and the process ends at an optimal policy, often after surprisingly few iterations.

### Value iteration

1. Start with an initial guess of the value of every state, such as zero.
2. Update each state's value using the Bellman equation, assuming the best action is taken.
3. Repeat until the values stop changing significantly.
4. Read off the optimal policy from the final values.

Value iteration effectively looks one step further into the future with each round. Its values converge to the optimal values, and the policy derived from them is optimal.

### Other approaches

The book also describes asynchronous value iteration, which updates states in a flexible order, and a linear programming formulation. For a special class of problems with linear dynamics and quadratic costs, common in engineering control, the optimal policy can be found in closed form.

## A worked illustration: machine maintenance

This is an illustration with simplified numbers.

A workshop machine can be in one of three states each week: good, worn or broken.

| State | Run | Service | Replace |
| --- | --- | --- | --- |
| Good | Earn $1,000; 80% stay good, 20% become worn | Cost $300; stay good | Cost $5,000; good next week |
| Worn | Earn $700; 60% stay worn, 40% break | Cost $400; 90% good, 10% stay worn | Cost $5,000; good next week |
| Broken | Earn nothing; stay broken | Repair $1,500; 70% worn, 30% stay broken | Cost $5,000; good next week |

A short-sighted manager might always run the machine, because running earns money this week. But running a worn machine carries a 40% chance of breaking, which then means weeks of lost production and expensive repairs.

Solving this MDP with value iteration, using a discount factor of 0.95 to reflect a long-term view, gives this optimal policy:

- **Good:** run.
- **Worn:** service promptly.
- **Broken:** repair rather than replace.

The difference from the short-sighted "always run" policy is large. Under "always run", the machine eventually breaks and is never fixed, so it stops earning altogether. Measured as expected discounted earnings from a machine in good condition, the optimal policy is worth roughly three times as much as "always run" in this example.

The numbers also show how the policy responds to changes. At these prices, replacement is never the best choice, because repairs usually succeed and cost far less. But if the replacement cost fell to around $3,000, replacing a broken machine would become better than repairing it. The MDP shows exactly how the trade-offs between immediate earnings and future risk play out, and how the best policy shifts when costs or probabilities change.

### Sensitivity to the numbers

Every number in the table is an estimate. A useful practice is to vary the uncertain ones, such as the chance that a worn machine breaks or the success rate of repairs, and check whether the policy changes. If it stays the same across plausible values, the decision is robust. If it flips, the estimate deserves more attention, and may be worth improving through better record-keeping, as discussed in [The value of information](/insights/the-value-of-information/).

## When problems become too large

The methods above require listing every state. Many real problems have far too many states for that. An inventory system with dozens of products, each with many possible stock levels, has an astronomical number of combinations. A vehicle's state includes continuous quantities such as position and speed.

The book describes several responses.

**Approximate value functions.** Instead of storing a value for every state, the value function is approximated by a formula with a manageable number of parameters, such as a combination of features, or by methods such as nearest-neighbour averaging, interpolation, linear regression or neural networks.

**Online planning.** Instead of computing a complete policy in advance, the decision maker plans from the current state each time a decision is needed, looking ahead a limited distance. This is explored in [Looking ahead: tree search and simulation](/insights/looking-ahead-tree-search-and-simulation/).

**Learning from experience.** When the transition probabilities and rewards are not known, they can be learned through interaction, the subject of [Reinforcement learning explained](/insights/reinforcement-learning-explained/).

## Sequential thinking without the mathematics

The concepts of MDPs are useful even without solving any equations.

**Define the state.** What information do you need to make each decision well? If the right decision depends on history, record that history.

**Think in policies.** Instead of deciding each situation from scratch, write down rules for recurring situations: what to do when stock falls below a level, when a machine shows wear, when a customer's payments slow.

**Value future states.** Ask not just what an action earns now, but what situation it leaves you in.

**Choose a time horizon deliberately.** Short-term and long-term views lead to different policies. Make the choice explicit.

**Update the model.** As you learn more about transition probabilities, such as how often worn machines break, update your policy.

## Common mistakes

**Optimising each step in isolation.** Immediate gains can create costly future situations.

**Leaving out relevant history.** If it affects outcomes, include it in the state.

**Fixed plans instead of policies.** Plans break when the unexpected happens; policies already say what to do.

**Ignoring the discount factor.** Too short a horizon neglects maintenance, relationships and investment; too long can neglect urgent needs.

**Assuming the model is right.** Transition probabilities and rewards are estimates; test how sensitive the policy is to them.

## Questions to ask

- What are the states, actions, transitions and rewards in this recurring decision?
- Does the current state capture everything relevant about the past?
- What policy are we following now, even if it is unwritten?
- How would the best policy change with a longer or shorter time horizon?
- For your own business: which recurring decision would benefit most from a written policy?

## Bringing it together

Markov decision processes describe sequential decisions in terms of states, actions, uncertain transitions and rewards. The goal is a policy that maximises expected total reward over time, usually with future rewards discounted. Value functions and the Bellman equation break this long-term goal into manageable pieces, and dynamic programming methods such as policy iteration and value iteration find optimal policies when problems are small enough.

For larger problems, approximation, online planning and learning extend the same ideas. Even without formal methods, thinking in states, policies and future value helps businesses make recurring decisions that serve the long term rather than just the next step.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022). Explanations are GoCore's own; the maintenance example uses simplified, illustrative numbers. This article is general information, not professional advice.*
