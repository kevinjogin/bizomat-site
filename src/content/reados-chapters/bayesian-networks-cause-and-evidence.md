---
title: "Bayesian networks: mapping how causes and evidence connect"
description: "Bayesian networks represent uncertain relationships as a map of influences. How they work, how they support diagnosis and prediction, and what they can and cannot tell you about cause and effect."
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

Real problems rarely involve a single uncertainty. A machine might be failing because of wear, poor maintenance or a faulty part, and each of these might show up in vibration, temperature, noise or output quality. A customer might leave because of price, service, a competitor's offer or a change in their own circumstances, and each of these might be reflected in order frequency, complaints or payment delays.

Reasoning about many connected uncertainties at once quickly becomes overwhelming. With just twenty yes-or-no factors, there are over a million possible combinations. Listing a probability for each is impossible in practice.

**Bayesian networks** solve this problem by representing uncertain relationships as a map: a diagram showing which factors directly influence which others, together with the probabilities that describe each influence. They are one of the core tools for probabilistic reasoning described in *Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray, and they have been widely used in medical diagnosis, fault detection, risk assessment and many other fields. This article explains how they work, how they are used, how they can be learned from data, and what they can and cannot reveal about cause and effect. It is part of GoCore's series on decision making.

## The structure: nodes and arrows

A Bayesian network is drawn as a set of **nodes**, each representing an uncertain variable, connected by **arrows**. An arrow from A to B means that A directly influences B. The diagram has no loops: you cannot follow arrows from a node and arrive back at it.

Each node has a table or formula giving its probabilities depending on the values of the nodes with arrows pointing into it, called its **parents**. Nodes without parents simply have their own probabilities.

### An illustration: diagnosing a machine fault

Consider a simplified network for a production machine (an illustration):

- **Bearing wear** (yes or no), with no parents.
- **Lubrication failure** (yes or no), with no parents.
- **Overheating**, influenced by both bearing wear and lubrication failure.
- **Unusual vibration**, influenced by bearing wear.
- **Temperature alarm**, influenced by overheating.

The arrows run from causes to effects: bearing wear → overheating, lubrication failure → overheating, bearing wear → vibration, overheating → temperature alarm.

To specify the network, we need:

- the probability of bearing wear, and of lubrication failure
- the probability of overheating for each combination of wear and lubrication failure
- the probability of vibration with and without wear
- the probability of a temperature alarm with and without overheating

That is a small number of manageable estimates, each of which an experienced technician could reasonably provide or which could be estimated from maintenance records. Together, they define probabilities for every combination of all five variables.

## Why the structure saves so much effort

The power of a Bayesian network comes from **conditional independence**: the idea that, once a node's parents are known, it is independent of other nodes that are not its descendants. In the machine example, once we know whether overheating is occurring, the temperature alarm tells us nothing more about bearing wear directly; its information about wear flows only through overheating.

This lets a large joint distribution be broken into small, local pieces. A network with twenty yes-or-no variables, each with at most two or three parents, might need only around a hundred numbers instead of over a million. The structure also makes the model easier to understand, check and discuss, because each piece corresponds to a specific, interpretable relationship.

## Inference: reasoning from evidence

Once a network is built, it can answer questions by **inference**: calculating the probabilities of some variables given observed values of others.

Inference can run in several directions.

**Diagnostic reasoning (from effects to causes).** The temperature alarm has sounded and vibration is unusual. How likely is bearing wear? How likely is lubrication failure?

**Predictive reasoning (from causes to effects).** Lubrication has failed. How likely is overheating, and therefore an alarm?

**Explaining away.** Suppose overheating is observed, and then a technician confirms that lubrication has failed. The lubrication failure explains the overheating, which *reduces* the probability of bearing wear. Two possible causes of the same effect compete to explain it. This pattern is common in diagnosis and often surprises people: evidence for one cause can count as evidence against another.

### Methods of inference

For small networks, inference can be calculated exactly, by summing over the relevant combinations in an efficient order. The book describes methods such as variable elimination, which avoid recalculating the same quantities repeatedly.

For large networks, exact inference can become computationally infeasible. Approximate methods based on **sampling** are then used: the computer generates many random scenarios consistent with the network and observes how often different outcomes occur. Techniques such as likelihood weighting and Gibbs sampling, explained in the book, make sampling efficient even when the evidence is unlikely.

## Naive Bayes: a simple special case

A particularly simple and widely used structure is the **naive Bayes** model. It has one central variable, such as a category or class, with arrows to many observed features, and assumes the features are independent of each other once the class is known.

Naive Bayes models have long been used for tasks such as classifying emails as spam or legitimate, based on the words they contain. The independence assumption is usually not strictly true, which is why the model is called naive, but it often works surprisingly well in practice and is fast and easy to build.

## Learning networks from data

Bayesian networks can be specified by experts, learned from data, or a mixture of both.

### Learning the probabilities

If the structure is known, the probabilities can be estimated from data by counting how often each combination occurs. With small amounts of data, Bayesian estimation with priors avoids extreme estimates, as explained in [Learning from small numbers](/reados/collections/marketing-brands-and-customer-experience/learning-from-small-samples/).

### Learning the structure

Learning the structure itself, which arrows to include, is harder. The book describes approaches that score candidate structures by how well they explain the data, balanced against their complexity, and then search through possible structures for a high-scoring one. Because the number of possible structures grows extremely quickly with the number of variables, the search must be guided by heuristics.

### A crucial caution about direction

An important lesson from structure learning is that data alone often cannot determine the direction of every arrow. Different structures can represent exactly the same set of probabilistic relationships. For example, a chain from A to B to C, and the reverse chain from C to B to A, make the same predictions about which variables are independent of which. Such structures are called **Markov equivalent**, and observational data cannot distinguish between them.

The practical implication is significant: **a network learned from observational data shows associations and independencies, not necessarily causes.** Establishing cause and effect usually requires additional knowledge, such as which events happen first, an understanding of the underlying mechanisms, or deliberate experiments that change one variable and observe the effects.

## Continuous quantities

Not every variable is a simple yes-or-no. Temperatures, delivery times, prices and demand levels take values across a range. Bayesian networks can include these too. A common approach models a continuous variable as following a Gaussian (bell-shaped) distribution whose average depends on its parents, for example average delivery time increasing with order size. Networks built entirely from such relationships have convenient mathematical properties that make exact inference efficient, which is one reason they are widely used in engineering and finance.

Where relationships are more complicated, continuous variables can be grouped into ranges (such as low, medium and high), at some cost in precision, or handled with sampling methods.

## Building a network with experts

When data is limited, Bayesian networks are often built with people who know the domain. A practical process:

1. **Agree the question.** What decision or diagnosis should the network support?
2. **List the variables.** Include causes, symptoms, test results and any factors that influence them. Keep the list as short as the question allows.
3. **Draw the direct influences.** For each pair of variables, ask whether one directly affects the other, or only through something else already on the map.
4. **Estimate the probabilities.** Ask experts for probabilities in concrete terms, such as "out of 100 machines with worn bearings, how many would show unusual vibration?" Frequencies are usually easier to estimate than abstract percentages.
5. **Test the network.** Enter scenarios where the answer is known and check whether the network's conclusions match experience. Where they do not, revisit the structure or the numbers.
6. **Update with data.** As records accumulate, refine the probabilities.

A side benefit is that the process itself creates shared understanding. Experts often discover that they hold different views about how the system works, and resolving those differences is valuable in its own right.

## Where Bayesian networks are used

Bayesian networks and related models have been applied in many fields:

- **Medical diagnosis:** one of their earliest applications, combining symptoms, test results and risk factors.
- **Fault diagnosis:** identifying the likely causes of failures in machinery, vehicles, networks and software systems.
- **Risk assessment:** combining multiple risk factors in areas such as safety, finance and environmental management.
- **Decision support:** combined with decisions and outcomes in **decision networks**, which help choose actions as well as assess probabilities. These are discussed in [Utility: putting a value on outcomes](/reados/collections/valuing-time-delay-and-uncertainty/utility-putting-a-value-on-outcomes/).

## Using the idea without software

Even without specialised software, the thinking behind Bayesian networks is valuable.

**Draw the influence map.** For a complex problem, sketch which factors directly influence which others. The act of drawing often reveals hidden assumptions and missing factors.

**Distinguish causes from symptoms.** Many business metrics are symptoms. Falling repeat orders might be caused by price, quality, service or competition. Mapping the possible causes before acting avoids treating the wrong one.

**Look for shared causes.** Two problems that move together may share a common cause. Fixing one in isolation may not help.

**Remember explaining away.** When one cause is confirmed, reconsider how likely the other possible causes still are.

**Treat learned relationships as associations.** Patterns in data are a starting point for understanding causes, not proof of them.

## A worked illustration

This is an illustration, not a real business.

A café notices that weekday lunch sales have fallen. The owner sketches an influence map:

- Possible causes: a new competitor nearby, a recent price rise, slower service since a staff change, and fewer office workers in the area.
- Observable effects: total sales, average spend per customer, number of customers, customer complaints and wait times.

The map clarifies what to check. A price rise would mainly reduce spend or customer numbers among price-sensitive regulars. Slower service would show in wait times and complaints. Fewer office workers would reduce customer numbers but not spend per customer, and would affect nearby businesses too. A competitor would reduce customer numbers, perhaps mainly among particular groups.

The data shows customer numbers down, spend per customer unchanged, wait times unchanged and complaints steady. Nearby businesses report similar declines. The evidence points to fewer office workers in the area, which explains away the competitor and price hypotheses to a large extent. Rather than cutting prices, the café shifts effort towards catering for local businesses and weekend trade.

## Common mistakes

**Building a structure with too many arrows.** Every arrow adds probabilities to estimate; include only direct influences.

**Treating arrows as proven causes.** Especially when learned from data, arrows may only reflect associations.

**Ignoring explaining away.** Confirming one cause changes the probability of others.

**Using overconfident probabilities.** Expert estimates should reflect genuine uncertainty.

**Forgetting to validate.** Check the network's predictions against outcomes it has not seen.

## Questions to ask

- Which factors directly influence which others?
- Which observed signals are symptoms, and which are causes?
- Could two related problems share a common cause?
- If one cause has been confirmed, how does that change the likelihood of the others?
- For your own business: what influence map would explain your most important performance measure?

## Bringing it together

Bayesian networks represent many connected uncertainties as a map of direct influences, with local probabilities attached to each. Conditional independence makes them compact and understandable, and inference allows them to reason from symptoms to causes, from causes to effects and between competing explanations.

They can be specified by experts or learned from data, but learned structures reveal associations rather than proven causes. Even without software, drawing an influence map is one of the most practical ways to think clearly about complex problems with several possible causes.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022). Explanations are GoCore's own; the worked illustrations are hypothetical. This article is general information, not professional advice.*
