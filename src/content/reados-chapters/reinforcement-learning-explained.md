---
title: "Reinforcement learning explained: learning good decisions from experience"
description: "Reinforcement learning lets systems learn decision strategies by trial and error, guided by rewards. A plain-English guide to how it works, its main methods, its risks and where it fits in business."
publishDate: 2026-10-03
category: "Technology"
tags:
  - ai
  - automation
  - systems
author: "GoCore"
featured: false
draft: false
---

People learn many skills not from instructions but from experience. A child learns to ride a bicycle by trying, wobbling, falling and gradually discovering what works. A new employee learns which approaches satisfy customers by watching what happens. Nobody hands them a complete model of the world; they learn from the consequences of their actions.

**Reinforcement learning** brings this kind of learning to machines. An agent interacts with an environment, takes actions, receives rewards or penalties, and gradually learns a strategy that earns as much reward as possible over time. Reinforcement learning has produced striking achievements, from programs that play Go, chess and video games at superhuman levels to systems that control robots and optimise industrial processes.

This article explains reinforcement learning in plain English, drawing on the third part of *Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray. It covers the core problem, the difference between model-based and model-free methods, key ideas such as Q-learning, credit assignment, reward shaping and experience replay, policy search methods, and the practical risks and opportunities for businesses. It builds on [Sequential decisions](/reados/collections/decision-making-machines/sequential-decisions-planning-ahead/) and is part of GoCore's series on decision making.

## The problem reinforcement learning solves

The article on sequential decisions describes how to find good policies when the transition probabilities and rewards of a problem are known. In many real problems they are not. A business may not know exactly how customers will respond to different offers, how a machine will behave under different settings, or how a new process will perform.

Reinforcement learning addresses this **model uncertainty**: the agent must learn good behaviour while interacting with an environment whose workings it does not fully know. The designer provides a measure of performance, the **reward**, and the learning algorithm works out how to achieve it.

This creates three intertwined challenges:

- **Exploration and exploitation.** The agent must balance trying actions to learn about them with using actions it already believes are good. This is the dilemma described in [Explore or exploit?](/reados/collections/competitive-strategy-and-positioning/explore-or-exploit/), now extended to sequences of decisions.
- **Credit assignment.** Rewards often arrive long after the actions that caused them. The agent must work out which earlier actions deserve credit or blame.
- **Generalisation.** The agent must apply what it learns in some situations to new situations it has not seen exactly before.

## Model-based methods

One approach is to learn a **model** of the environment from experience, and then plan with that model. The agent records what happens after each action in each state, estimates the transition probabilities and rewards, and uses planning methods such as value iteration to choose actions.

Model-based methods tend to make efficient use of experience, because each observation improves the model, which can then be used to evaluate many possible strategies. They also allow the agent to plan for situations it has not yet encountered, as long as the model generalises well.

The book describes several ways to encourage exploration in model-based learning, including giving a bonus to rarely visited states and actions, and Bayesian methods that maintain uncertainty about the model itself. One elegant approach, **posterior sampling**, samples a plausible model from the agent's current beliefs, plans as if that model were true, acts for a while, then samples again. Like Thompson sampling for bandits, it explores in proportion to genuine uncertainty.

The weakness of model-based methods is that errors in the learned model lead to poor plans, and building accurate models of complex environments can be hard.

## Model-free methods

**Model-free** methods skip building a model and learn directly how good actions are. The most famous is **Q-learning**.

### Q-learning in plain English

Q-learning maintains an estimate, called the Q-value, of how good each action is in each state: the expected total future reward from taking that action and then acting well afterwards.

Each time the agent takes an action, it observes the immediate reward and the new state. It then updates its estimate for the action it just took, nudging it towards:

> the reward just received, plus the discounted value of the best action available in the new state.

The size of each nudge is controlled by a **learning rate**. Over many experiences, these small updates propagate information about rewards backwards through sequences of actions, and the Q-values converge towards the true values, given enough exploration and appropriate learning rates.

Once the Q-values are good, the agent's policy is simple: in each state, choose the action with the highest Q-value.

### Sarsa

A close relative, **Sarsa**, updates its estimates using the action the agent actually takes next, rather than the best available action. This makes it learn the value of the policy it is actually following, including its exploration. The difference matters in risky settings: an agent that sometimes explores randomly near a cliff edge learns, under Sarsa, to keep a safer distance, because it accounts for its own occasional random moves.

### Eligibility traces

Q-learning and Sarsa update only the most recent action at each step, so information about a delayed reward travels back slowly. **Eligibility traces** speed this up by keeping a fading record of recently visited states and actions, and updating all of them when a reward arrives, with more recent ones receiving more credit. This helps with the credit assignment problem.

## Reward shaping

In many problems, rewards are **sparse**: the agent receives a reward only when it finally achieves a goal, such as completing a task. Learning from sparse rewards can be extremely slow, because the agent rarely stumbles on the goal by chance.

**Reward shaping** adds intermediate rewards that guide the agent towards the goal, such as small rewards for progress. Shaping can dramatically speed learning, but it is risky: poorly designed shaping rewards can lead the agent to pursue the shaping rewards instead of the real goal. Research has shown that a particular form of shaping, based on the difference in a "potential" between states, speeds learning without changing which policy is optimal. The broader challenge of designing rewards is the subject of [Be careful what you reward](/reados/collections/decision-making-machines/be-careful-what-you-reward/).

## Generalising to large problems

Storing a separate Q-value for every state and action is impossible when there are vast numbers of states, as in most real problems. Instead, Q-values are approximated by a function with a manageable number of parameters, such as a linear combination of features or a neural network.

Using neural networks in this way, combined with the techniques below, enabled **deep reinforcement learning**, which in the 2010s produced programs that learned to play many video games directly from screen images.

### Experience replay

When learning with function approximation, consecutive experiences are highly similar, which can make learning unstable. **Experience replay** stores past experiences in a memory and trains on random batches drawn from it. This breaks up the correlations, reuses valuable experiences many times and makes learning more stable and efficient.

## Learning the policy directly

Another family of methods, covered in several chapters of the book, learns the policy itself rather than value estimates.

**Policy search** methods define a policy with adjustable parameters and search for parameters that perform well, evaluated by running the policy in simulation. Methods range from simple local search to evolutionary approaches such as genetic algorithms, the cross-entropy method and evolution strategies, which maintain a population of candidate policies and improve it over generations.

**Policy gradient** methods estimate how performance would change if the parameters were adjusted slightly, and move the parameters in the direction of improvement. The book explains several refinements that make these updates more stable, including restricting the size of each update. One such method, proximal policy optimisation (PPO), uses a clipped objective to keep updates from changing the policy too much at once, and has become widely used.

**Actor-critic** methods combine both ideas: an "actor" represents the policy, and a "critic" estimates values to guide the actor's improvement. Some of the most successful game-playing systems combine actor-critic learning with tree search, using the search to improve decisions and the learned networks to guide the search.

## Where reinforcement learning has succeeded

Reinforcement learning has achieved notable results in:

- **games**, including Go, chess and many video games
- **robotics**, learning control skills such as walking and grasping, often in simulation first
- **industrial control**, optimising processes such as cooling systems and manufacturing settings
- **recommendation and advertising**, choosing content and offers sequentially
- **language models**, where reinforcement learning from human feedback has been widely used to make model responses more helpful and better aligned with human preferences

## Risks and limitations

Reinforcement learning is powerful but demanding.

**It needs a great deal of experience.** Many methods require millions of trials. That is feasible in simulation or in games, but often impossible or dangerous in real business operations.

**It optimises exactly what it is rewarded for.** If the reward does not capture everything that matters, the agent may find ways to earn reward that the designer did not intend.

**Exploration can be costly or unsafe.** Trying random actions on real customers, machines or vehicles can cause harm.

**Learned policies can be hard to explain.** Policies represented by neural networks may be difficult to inspect or justify.

**Performance may not transfer.** A policy learned in simulation may perform poorly if the real world differs from the simulator.

For these reasons, real deployments typically combine reinforcement learning with simulation, safety constraints, human oversight and careful testing, as described in [Testing decision systems before you trust them](/reados/collections/decision-making-machines/testing-decision-systems-before-you-trust-them/).

## When to consider reinforcement learning in business

Reinforcement learning is worth considering when:

- decisions are **sequential**, with actions affecting future situations
- a **reliable simulator** exists or can be built, or the cost of real-world experimentation is low
- the **objective can be measured** clearly and completely
- simpler methods, such as rules, forecasting or optimisation, have been tried and fall short

For many small and medium businesses, simpler approaches will be more practical: clear rules, good forecasts, bandit-style testing and careful planning. But the ideas behind reinforcement learning are useful even without the algorithms: learning from consequences, assigning credit carefully, balancing exploration and exploitation, and designing rewards that capture what really matters.

## A worked illustration

This is an illustration, not a real system.

A warehouse wants to improve how it assigns incoming orders to picking teams. A consultant suggests reinforcement learning. Before proceeding, the operations manager asks the key questions:

- Is the decision sequential? Yes: assignments now affect workloads and delays later.
- Is there a simulator? The warehouse management system has enough historical data to build one.
- Is the objective clear? Mostly: on-time dispatch, balanced workloads and minimal overtime.
- Have simpler methods been tried? Only a basic first-come, first-served rule.

The team first tries a simple improvement: a rule that assigns orders by due time and current team workload. It captures most of the available benefit. A reinforcement learning system is then trained in simulation and tested against the rule. It improves on-time dispatch slightly more, but sometimes makes assignments that staff find hard to understand. The warehouse adopts the simple rule, keeping the learned system as a reference for future refinements.

## Common mistakes

**Using reinforcement learning where rules would do.** Simpler methods are often sufficient.

**Rewarding the wrong thing.** Agents optimise exactly what they are rewarded for.

**Exploring unsafely.** Real-world trial and error can harm customers, staff or equipment.

**Trusting simulation without checking reality.** Simulators are approximations.

**Ignoring explainability.** People need to understand and trust decisions that affect them.

## Questions to ask

- Is this decision genuinely sequential, with actions shaping future situations?
- Can we simulate the environment realistically?
- Does our reward capture everything that matters, including what must not happen?
- How will exploration be kept safe?
- For your own business: where could learning from the consequences of decisions be made more systematic?

## Bringing it together

Reinforcement learning enables agents to learn good decision strategies from experience, guided by rewards, without a complete model of their environment. Model-based methods learn a model and plan with it; model-free methods such as Q-learning and Sarsa learn the value of actions directly; policy search and policy gradient methods learn policies themselves; and actor-critic methods combine the approaches.

Techniques such as eligibility traces, reward shaping, function approximation and experience replay make learning faster and more scalable. But reinforcement learning demands extensive experience, careful reward design, safe exploration and thorough testing. For businesses, its ideas are valuable even where its algorithms are not yet practical.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022), together with widely published developments in reinforcement learning. Explanations are GoCore's own; the worked illustration is hypothetical. This article is general information, not professional advice.*
