---
title: "Acting when you can't see everything: beliefs, filters and partial observability"
description: "Many decisions must be made without knowing the true situation. How beliefs, Bayesian filters, Kalman and particle filters and belief-state planning handle partial observability."
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

A doctor cannot see directly whether a patient has a particular disease; they see symptoms and test results. A maintenance engineer cannot see the inside of a bearing while a machine is running; they see vibration readings and temperatures. A business owner cannot see directly whether a key customer is becoming dissatisfied; they see ordering patterns, response times and the tone of emails.

In all these cases, decisions must be made without knowing the true situation. The decision maker has only indirect, noisy and incomplete observations. This is called **partial observability**, and it is one of the most common and important features of real decisions.

The fourth part of *Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray addresses this **state uncertainty**. This article explains its key ideas in plain English: beliefs, how beliefs are updated with filters, the Kalman and particle filters, and how decisions can be planned in terms of beliefs, including actions taken specifically to gather information. It is part of GoCore's series on decision making.

## From states to beliefs

In the sequential decision problems described in [Sequential decisions](/reados/collections/decision-making-machines/sequential-decisions-planning-ahead/), the decision maker knows the current state, such as whether a machine is good, worn or broken. Under partial observability, the state is hidden. The decision maker receives **observations** that are related to the state but do not reveal it completely.

The framework for such problems is the **partially observable Markov decision process**, or POMDP. It adds two elements to the standard sequential decision problem:

- a set of possible observations
- an **observation model**: the probability of each observation given the true state (and sometimes the action just taken)

Because the true state is unknown, the decision maker maintains a **belief**: a probability distribution over possible states. A belief might be "70% chance the machine is good, 25% worn, 5% broken". Decisions are then based on the belief rather than on the unknown state.

## Updating beliefs: the Bayesian filter

Each time the decision maker acts and receives an observation, the belief should be updated. The general method, called **recursive Bayesian estimation** or a **Bayesian filter**, has two steps:

1. **Predict:** use the transition model to predict how the state may have changed after the action. A machine that was probably good might now be slightly more likely to be worn.
2. **Update:** use the observation and Bayes' rule to adjust the prediction. If vibration readings are high, the probability of wear rises; if they are normal, it falls.

The updated belief then becomes the starting point for the next step. This cycle of predicting and updating lets the decision maker track a hidden, changing situation over time. The mathematics of Bayes' rule is explained in [Thinking in probabilities](/reados/collections/judgement-markets-and-learning/thinking-in-probabilities/).

### A worked example: the crying baby

The book uses a memorable example. A baby may be hungry or not. Its caregiver cannot know directly, but observes whether the baby is crying. Hungry babies usually cry; babies who are not hungry occasionally cry too. The caregiver can feed the baby, sing to it or ignore it.

With illustrative numbers: suppose the caregiver believes there is a 50% chance the baby is hungry. A hungry baby cries 80% of the time; a baby that is not hungry cries 10% of the time. The baby cries.

- Probability of crying = 0.5 × 0.8 + 0.5 × 0.1 = 0.45.
- Updated probability of hunger = (0.5 × 0.8) ÷ 0.45 ≈ **89%**.

If instead the baby is quiet:

- Probability of quiet = 0.5 × 0.2 + 0.5 × 0.9 = 0.55.
- Updated probability of hunger = (0.5 × 0.2) ÷ 0.55 ≈ **18%**.

The decision about feeding can then depend on the updated belief, balancing the cost of feeding unnecessarily against the cost of leaving a hungry baby unfed. The same structure fits many business situations: a signal that is more common when something is wrong, but not a perfect indicator.

## Filters for different kinds of problems

The book describes several practical filters, suited to different kinds of states.

### Discrete state filter

When there are a limited number of possible states, such as good, worn and broken, the belief can be represented as a list of probabilities, one per state, and updated exactly with the predict-and-update steps. This works well for small problems.

### Kalman filter

When the state consists of continuous quantities, such as position, speed, temperature or inventory level, and the relationships are roughly linear with bell-shaped noise, the **Kalman filter** provides an efficient exact solution. The belief is represented by a best estimate and a measure of its uncertainty.

The Kalman filter's update has an intuitive interpretation: it blends the prediction with the new measurement, weighting each by how reliable it is. A precise measurement pulls the estimate strongly towards it; a noisy one moves it only slightly. Since its publication by Rudolf Kálmán in 1960, the Kalman filter has been used widely in navigation, aerospace, tracking, economics and signal processing.

### Extended and unscented Kalman filters

Many real systems are not linear. The **extended Kalman filter** handles mild nonlinearity by approximating the system as linear around the current estimate. The **unscented Kalman filter** passes a carefully chosen set of sample points through the nonlinear system and reconstructs the estimate from where they end up, often giving better accuracy without complex calculations.

### Particle filter

When the system is strongly nonlinear, or beliefs have unusual shapes (for example, a robot that could be in one of two distant corridors), the **particle filter** represents the belief with a large set of sample states called **particles**. Each particle is a hypothesis about the true state.

At each step, the particles are moved according to the transition model, weighted by how well each explains the latest observation, and then resampled so that well-supported hypotheses multiply and poorly supported ones disappear. Particle filters are flexible and widely used in robotics and tracking.

A practical risk is **particle deprivation**: if no particle happens to lie near the true state, the filter can lose track. The book describes **particle injection**, adding fresh random particles occasionally, as a remedy, allowing the filter to recover from surprises.

| Filter | Suited to | Representation of belief |
| --- | --- | --- |
| Discrete state filter | Few distinct states | A probability for each state |
| Kalman filter | Continuous, roughly linear systems | Estimate plus uncertainty |
| Extended / unscented Kalman | Mildly nonlinear systems | Estimate plus uncertainty, approximated |
| Particle filter | Nonlinear, complex beliefs | Many weighted sample states |

## Planning with beliefs

Tracking beliefs is half the problem. The other half is deciding what to do. In a POMDP, the decision maker plans in terms of beliefs: a policy maps each possible belief to an action.

This is much harder than planning with known states, because the set of possible beliefs is infinite. The book describes several approaches.

**Exact methods** represent the value of beliefs using a set of linear functions, sometimes called **alpha vectors**, each corresponding to a conditional plan. They are only practical for small problems.

**Offline approximate methods** compute good policies for a representative set of beliefs, such as point-based value iteration, and use bounds to estimate how close to optimal they are.

**Online methods** plan from the current belief when a decision is needed, using lookahead and tree search adapted to beliefs, as described in [Looking ahead: tree search and simulation](/reados/collections/decision-making-machines/looking-ahead-tree-search-and-simulation/).

**Simple approximations** first solve the problem as if the state were fully observable, then use those values with the current belief. This works when uncertainty will soon be resolved anyway, but it undervalues gathering information.

## The value of gathering information

A distinctive feature of planning under partial observability is that some actions are valuable mainly because of what they reveal. A diagnostic test, an inspection, a customer survey or a trial order may produce little direct benefit but reduce uncertainty enough to improve later decisions.

POMDP planning accounts for this automatically. An optimal policy will choose to inspect a machine when its belief is uncertain enough that knowing more would change the decision, and skip the inspection when the belief is already clear. This connects closely to [The value of information](/reados/collections/valuing-time-delay-and-uncertainty/the-value-of-information/).

Simple approaches that ignore uncertainty, assuming the most likely state is the true one, often fail precisely here: they never see a reason to gather information, because they act as if they already know.

## How often to observe

When observations cost money or effort, deciding how often to observe is itself a decision under uncertainty. Observing too rarely lets beliefs drift far from reality, so problems are discovered late. Observing too often wastes resources on confirming what is already clear.

Belief-based thinking suggests a natural rule: observe more often when the belief is uncertain or when the situation is changing quickly, and less often when the belief is confident and stable. A machine recently serviced and running smoothly needs less frequent inspection than one showing intermittent warning signs. A long-standing customer with steady orders needs less frequent check-ins than one whose ordering pattern has recently changed. Matching observation effort to uncertainty puts attention where it is most useful.

## Business applications of belief thinking

**Equipment condition.** Rather than servicing on a fixed schedule or waiting for failures, condition monitoring tracks a belief about each machine's health from sensor readings, triggering inspection or service when the probability of wear rises.

**Customer health.** A business can maintain an informal belief about each key customer's satisfaction, updated by signals such as order frequency, payment timing, support requests and contact frequency, and act when the probability of dissatisfaction rises.

**Project status.** Reported progress is an observation, not the true state. Combining reports with other signals, such as rework, missed milestones and team feedback, gives a better estimate of where a project really stands.

**Inventory accuracy.** Recorded stock levels drift from reality through errors and shrinkage. Treating system figures as observations, and occasionally counting physically, keeps beliefs about true stock accurate.

## A worked illustration

This is an illustration, not a real business.

A food producer relies on a refrigeration unit whose compressor sometimes starts to fail. Failure ruins stock worth $20,000. The unit reports temperature every hour. A failing compressor tends to show small, intermittent temperature rises before a complete failure, but normal door openings cause similar rises.

Previously, the producer reacted only to large, sustained temperature rises, by which time stock was often already at risk. It introduces a simple belief tracker: each hour, a small spreadsheet calculation updates the probability that the compressor is degrading, based on how often and how long temperature rises occur outside normal loading times. When the probability exceeds a set threshold, a technician inspects the unit.

Inspections occasionally find nothing, which is expected. But two developing compressor faults are caught early over the following year, preventing stock losses, at a modest cost in technician visits.

## Common mistakes

**Treating observations as the truth.** Reports, readings and records are evidence, not the state itself.

**Acting on the most likely state alone.** Ignoring uncertainty undervalues information gathering and caution.

**Updating too much or too little.** Strong evidence should move beliefs substantially; weak evidence only slightly.

**Losing track after surprises.** Leave room for unexpected possibilities, like particle injection.

**Ignoring how situations change between observations.** Predict before updating.

## Questions to ask

- What is the true state we care about, and what can we actually observe?
- How reliable are our observations, and how often are they wrong?
- What is our current belief, expressed as probabilities?
- Which actions would reduce uncertainty enough to change our decisions?
- For your own business: which important situation are you judging from a single, possibly misleading signal?

## Bringing it together

Partial observability is the norm in real decisions: the true situation is hidden, and observations are noisy and incomplete. Decision makers handle this by maintaining beliefs, probability distributions over possible states, and updating them with Bayesian filters that predict how the situation changes and correct the prediction with each observation. Discrete filters, Kalman filters, their nonlinear extensions and particle filters suit different kinds of problems.

Planning with beliefs is harder than planning with known states, but it brings an important benefit: it recognises the value of actions that gather information. Treating observations as evidence rather than truth, and acting on beliefs rather than assumptions, makes decisions more accurate and more resilient.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022). Explanations are GoCore's own; numbers in the examples are illustrations. This article is general information, not professional advice.*
