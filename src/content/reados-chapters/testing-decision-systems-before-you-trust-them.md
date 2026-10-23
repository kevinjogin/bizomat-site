---
title: "Testing decision systems before you trust them"
description: "How to validate automated decision systems: performance metrics, rare-event simulation, robustness to model errors, trade-off analysis, adversarial testing and responsible deployment."
publishDate: 2026-10-03
category: "Technology"
tags:
  - ai
  - validation
  - systems
author: "GoCore"
featured: false
draft: false
---

An automated decision system can look excellent in development and still fail in the real world. Its model of the world may be wrong in ways nobody noticed. It may perform well on average while failing badly in rare situations. Its objective may not capture everything that matters. Or someone may deliberately try to make it fail.

For systems that affect safety, money, health or people's opportunities, these failures can be serious. That is why *Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray devotes a chapter to **policy validation**: checking, before deployment, that a decision system's behaviour is consistent with what is actually desired.

This article explains the main validation methods in plain English: evaluating performance metrics, simulating rare events efficiently, testing robustness to modelling errors, analysing trade-offs between objectives, and searching for the most likely failures. It then considers broader questions of responsible deployment, including Australian guidance on the use of artificial intelligence. It is part of GoCore's series on decision making.

## Why validation matters

Decision systems are usually designed or trained using a **model** of the world: a simulator, historical data or assumptions about how things behave. Optimising against that model produces a policy that performs well on the model. Whether it performs well in reality depends on how good the model is, and on whether the objective captured what matters.

Validation asks several distinct questions:

- How well does the system perform on the measures we care about?
- How likely are rare but serious failures?
- What happens if the real world differs from our model?
- Are the trade-offs between competing objectives acceptable?
- What is the most likely way the system could fail?

## Evaluating performance metrics

The first step is to measure performance on the metrics that matter. For a collision avoidance system, the key metric might be the probability of a collision. For an investment policy, it might be expected return and the probability of losses beyond a threshold. For a customer service system, it might be resolution rates and complaint rates.

Metrics are usually estimated by running many simulated episodes and averaging the results. The book also describes cases where metrics can be calculated exactly from a model, when the model is small enough.

### Beyond averages

Averages can hide important risks. A system with an excellent average outcome might occasionally produce catastrophic results. Validation should therefore look at:

- **the distribution of outcomes,** not just the mean
- **tail risks:** how bad the worst outcomes are and how likely they are
- **performance for different situations and groups:** a system that works well overall may work poorly for particular customers, conditions or regions

## Rare event simulation

Many of the most important failures are rare. A well-designed safety system might fail once in millions of encounters. Estimating such a small probability by straightforward simulation would require a huge number of runs, and most of them would show nothing interesting.

The book describes **importance sampling** as a remedy. Instead of simulating situations in proportion to how often they occur, the simulation deliberately over-samples situations that are more likely to lead to failure, then corrects the results mathematically so that the final estimate is still unbiased.

In the book's aircraft collision avoidance example, sampling more heavily from challenging starting conditions produced far more collisions in simulation than direct sampling with the same number of runs, and gave an accurate estimate of collision probability with much less computation. The same principle applies to testing any system for rare failures: focus testing effort where failures are most likely, and account for that focus when estimating overall risk.

### Practical equivalents

Even without formal importance sampling, the idea is useful:

- test systems specifically on difficult, unusual and extreme cases, not just typical ones
- keep a library of known hard cases and past failures, and test every new version against them
- when estimating overall risk, remember that the test set over-represents hard cases, and weight results accordingly

## Robustness analysis

Real environments differ from models. Robustness analysis tests how performance changes when the environment deviates from the assumptions used to design the system.

The book illustrates this by evaluating a collision avoidance policy, designed for one assumption about how quickly aircraft can manoeuvre, in environments with different manoeuvring limits. Performance changed as the assumptions changed, showing which deviations mattered most.

### Planning models and evaluation models

An important distinction is between the **planning model**, used to design or optimise the policy, and the **evaluation model**, used to test it.

The planning model is often deliberately simple, for two reasons: simpler models are easier to optimise, and they are less likely to cause **overfitting** to modelling assumptions that may be wrong. The evaluation model can be as detailed and realistic as can be justified. A policy might be designed with a simple, discrete model and then tested in a high-fidelity simulation.

The book notes that policies designed with simpler planning models are often more robust when the real world differs from expectations. That is a useful lesson for any planning: plans built on simple, sound assumptions often hold up better than plans finely tuned to a complex model that may be wrong.

## Trade analysis

Most decision systems balance several objectives: safety and efficiency, accuracy and speed, cost and quality. **Trade analysis** examines how different policies perform across these objectives.

The key tool is the **Pareto frontier**: the set of policies for which no other policy is better on one objective without being worse on another. Plotting the frontier shows decision makers the real options available. In the book's collision avoidance example, optimised policies dominated simpler rule-based policies: for any given level of safety, they required fewer changes to pilot advisories.

Trade analysis turns abstract debates about priorities into concrete choices: this much more safety costs this much more inconvenience. The article [Be careful what you reward](/reados/collections/decision-making-machines/be-careful-what-you-reward/) discusses designing objectives in more detail.

## Adversarial analysis

The final validation method looks for failures actively. In **adversarial analysis**, an imagined adversary controls the environment and tries to make the system fail, while keeping the sequence of events plausible according to the model.

The adversary balances two goals: causing poor outcomes for the system, and choosing events that are reasonably likely. The result is the **most likely failure**: the most plausible sequence of events that leads the system to fail. Knowing it helps designers understand the system's weaknesses and decide whether additional safeguards are needed.

For businesses, the equivalent is structured "how could this go wrong?" thinking, such as pre-mortems (imagining that a project has failed and asking why) and red-team exercises, where someone is tasked with finding ways to defeat a system or plan.

## Validation methods at a glance

| Method | Question it answers | Practical equivalent |
| --- | --- | --- |
| Performance metric evaluation | How well does it perform? | Measure outcomes across many cases |
| Rare event simulation | How likely are rare failures? | Test deliberately on hard cases |
| Robustness analysis | What if the world differs from our model? | Vary assumptions; test in realistic conditions |
| Trade analysis | Are the trade-offs acceptable? | Lay out the options on competing goals |
| Adversarial analysis | What is the most likely way it fails? | Pre-mortems and red teams |

```figure
type: layers
title: Five ways to validate a decision system
caption: Each asks a different question; together they show where trust is and is not justified.
- Performance metrics | how well does it perform?
- Rare event simulation | how likely are rare failures?
- Robustness analysis | what if the world differs?
- Trade analysis | are the trade-offs acceptable?
- *Adversarial analysis | how will it most likely fail?
```

## Responsible deployment

Validation is part of a broader responsibility. The book's discussion of societal impact highlights several concerns: data-driven systems can inherit biases from how data was collected; algorithms can be vulnerable to manipulation; optimisation can amplify the intentions of whoever uses it; and legal and moral frameworks must address unintended consequences and responsibility.

### Australian guidance

In Australia, the federal government published **AI Ethics Principles** in 2019, covering themes such as human, societal and environmental wellbeing; human-centred values; fairness; privacy protection and security; reliability and safety; transparency and explainability; contestability; and accountability. In 2024, it released a **Voluntary AI Safety Standard** setting out guardrails for organisations developing and deploying AI, including testing, human oversight, transparency and record-keeping. Existing laws, such as privacy, consumer and anti-discrimination law, also apply to automated decisions. Organisations should check the current status of guidance and regulation, which continues to evolve.

### Practical safeguards

- **Human oversight:** keep people able to review, override and stop automated decisions, especially consequential ones.
- **Transparency:** tell people when automated systems affect them, and explain decisions in understandable terms.
- **Contestability:** provide a way for people to challenge decisions that affect them.
- **Monitoring:** keep measuring performance after deployment; real conditions change.
- **Records:** document the system's purpose, data, testing and known limitations.
- **Staged rollout:** deploy gradually, starting with limited use and expanding as evidence accumulates.

## Validating everyday decision tools

Validation is not only for sophisticated AI. Many businesses rely on automated decisions embedded in everyday software: reorder points in inventory systems, fraud filters in payment platforms, lead-scoring rules in sales tools, scheduling rules and automatic credit limits. These are decision systems too, often configured once and never checked again.

A light-touch version of the methods above suits them well. Compare the tool's decisions with actual outcomes for a sample of cases. Look at the cases it gets wrong. Check how it behaves in unusual periods, such as peak seasons or supply disruptions. Ask what would happen if a key assumption, such as supplier lead time, changed. Even an afternoon of review can reveal settings that quietly cost money.

## Understanding why a system decides as it does

Validation is easier and more convincing when people can understand why a system makes its decisions. For simple rules, the reasons are visible. For learned models, explanation methods can show which factors most influenced a particular decision, or how decisions would change if inputs changed. Explanations help reviewers spot decisions based on irrelevant or inappropriate factors, help users trust correct decisions, and help affected people challenge incorrect ones.

## Validation after deployment

Validation does not end at launch. Conditions change: customer behaviour shifts, equipment ages, competitors adapt and data patterns drift. A system validated last year may not perform the same way today.

Ongoing monitoring should track the key metrics, compare outcomes with expectations, watch for unusual patterns and trigger review when performance changes. Incidents and near misses should be recorded and added to the library of test cases.

## A worked illustration

This is an illustration, not a real business.

A small lender considers using an automated tool to recommend approval or decline for small business loans. Before adopting it, the lender's manager plans a validation process:

- **Performance metrics:** compare the tool's recommendations with past applications whose outcomes are known, measuring both defaults and good customers wrongly declined.
- **Rare events:** examine how the tool handles unusual applications, such as new businesses, seasonal businesses and applicants with limited records.
- **Robustness:** test performance on applications from a period of economic stress, not only from good years.
- **Trade analysis:** plot default rate against approval rate for different approval thresholds, and choose a threshold deliberately.
- **Adversarial analysis:** ask how an applicant might game the tool, and what checks would detect it.
- **Fairness:** check whether outcomes differ for groups of applicants in ways that cannot be justified.

```figure
type: checklist
title: Validating a loan recommendation tool
caption: Measure both defaults and good customers wrongly declined.
- x Compared with past applications of known outcome
- x Unusual applications: new, seasonal, thin records
- x A period of economic stress, not only good years
- *x A threshold chosen deliberately from the trade-off
```

The analysis shows that the tool performs well for established businesses but poorly for new ones. The lender adopts it for established businesses only, with human review for all declines, and continues to assess new businesses manually.

## Common mistakes

**Testing only typical cases.** Rare failures are often the most important.

**Testing on the same model used for design.** Evaluate in more realistic conditions.

**Reporting only averages.** Look at distributions, tails and different groups.

**Hiding trade-offs.** Show the actual options to decision makers.

**Stopping validation at launch.** Monitor continuously.

## Questions to ask

- What metrics define success, and what outcomes must be avoided?
- How have rare and difficult cases been tested?
- How does performance change if our assumptions are wrong?
- What is the most likely way this system could fail?
- For your own business: which automated decision, in software you already use, has never been validated against your own outcomes?

## Bringing it together

Validation checks that a decision system behaves as intended before it is trusted. Performance metrics measure outcomes; rare event simulation estimates the probability of uncommon failures efficiently; robustness analysis tests what happens when the world differs from the model; trade analysis reveals the options across competing objectives; and adversarial analysis finds the most likely ways the system could fail.

Responsible deployment adds human oversight, transparency, contestability, monitoring and records, guided in Australia by the AI Ethics Principles and the Voluntary AI Safety Standard alongside existing law. Validation is not a one-off event but a continuing practice for as long as the system is in use.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022), together with Australian Government guidance on AI ethics and safety. Explanations are GoCore's own; the worked illustration is hypothetical. Guidance and regulation change; check current requirements. This article is general information, not legal or professional advice.*
