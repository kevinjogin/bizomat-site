---
title: "From automata to algorithms: a short history of automated decision making"
description: "How economics, psychology, neuroscience, computer science, engineering, mathematics and operations research each contributed to the methods machines use to make decisions."
publishDate: 2026-10-03
category: "Ideas"
tags:
  - ai
  - systems
  - automation
author: "GoCore"
featured: false
draft: false
---

Automated decision making can seem like a recent invention, arriving with powerful computers and artificial intelligence. In fact, the ideas behind it have been developing for centuries. The methods used today in aircraft collision avoidance, robotics, recommendation systems and game-playing programs draw on the work of philosophers, economists, psychologists, neuroscientists, mathematicians, engineers and operations researchers.

Understanding this history is more than an academic exercise. Each field contributed a different piece of the puzzle: how to value outcomes, how to learn from experience, how to represent uncertainty, how to search through possibilities and how to act reliably in the physical world. Knowing where an idea came from helps explain what it is good at and where its limits lie.

This article traces those contributions, following the historical overview in *Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray, supplemented by widely documented history. It is part of GoCore's series on decision making; the core concepts are introduced in [Decision making under uncertainty](/reados/collections/decision-making-machines/decision-making-under-uncertainty/).

## Early dreams of automation

The idea of machines that act on their own is ancient. Greek myths and stories included automatic machines, and the word *automaton* appears in Homer's *Iliad*, which describes self-moving tripods that serve guests. In the seventeenth century, philosophers proposed using logical rules to settle disagreements mechanically, laying early foundations for mechanised reasoning.

From the late eighteenth century, inventors built machines to perform labour. Innovations in the textile industry led to automatic looms, which in turn influenced later factory automation. The word *robot* comes from the Czech writer Karel Čapek's 1920 play *R.U.R.* (*Rossum's Universal Robots*), about manufactured workers. In the mid-twentieth century, the writer and professor Isaac Asimov explored how robots might behave in his famous Robot stories.

Yet automating decisions in the real world proved far harder than imagining it. A central difficulty was uncertainty. Even late in the twentieth century, George Dantzig, famous for developing the simplex method for optimisation, reflected that planning dynamically under uncertainty, the problem that had started his research, remained unsolved.

## Economics: valuing outcomes

Economics needs models of how people make choices. One of its most important contributions is **utility theory**, which provides a way to compare the desirability of different outcomes.

An early insight was that the value of money is not linear. In 1738, the mathematician Daniel Bernoulli argued that an extra amount of money matters less to a wealthy person than to a poor one, an idea now called diminishing marginal utility. The philosopher Jeremy Bentham later summarised a similar view: more wealth brings more happiness, but not in proportion.

In the mid-twentieth century, John von Neumann and Oskar Morgenstern, in *Theory of Games and Economic Behavior* (first published in 1944), combined utility with a precise definition of rational choice. This established the **maximum expected utility principle**: a rational agent should choose the action whose outcomes, weighted by their probabilities, have the highest expected utility. The principle remains central to automated decision making. The same work laid the foundations of **game theory**, the study of decisions when several agents interact.

GoCore's article [Utility: putting a value on outcomes](/reados/collections/valuing-time-delay-and-uncertainty/utility-putting-a-value-on-outcomes/) explains these ideas in practical terms.

## Psychology: learning from rewards

Psychologists studied decision making through behaviour. From the nineteenth century, researchers developed theories of trial-and-error learning, observing that animals tend to repeat actions that led to satisfaction and avoid those that led to discomfort. Edward Thorndike called this the law of effect. Ivan Pavlov's experiments with dogs showed how behaviour could be shaped by associating stimuli with rewards.

In 1948, Alan Turing suggested that machines might learn in a similar way, organised through two kinds of input: one signalling reward and the other punishment. This idea, that an agent can learn good behaviour from rewards and penalties rather than explicit instructions, became the foundation of **reinforcement learning**, explained in [Reinforcement learning explained](/reados/collections/decision-making-machines/reinforcement-learning-explained/).

Psychology also revealed where human choices depart from the rational ideal. Daniel Kahneman and Amos Tversky's research in the 1970s and 1980s, including prospect theory, showed systematic patterns in how people judge risk and respond to framing. Their work is explored in [Framing, certainty and the limits of rational choice](/reados/collections/judgement-markets-and-learning/framing-certainty-and-the-limits-of-rational-choice/).

## Neuroscience: networks of neurons

While psychologists studied behaviour, neuroscientists studied the biological processes behind it. Late in the nineteenth century, scientists established that the brain consists of interconnected neurons. In 1943, Warren McCulloch and Walter Pitts proposed that neurons could be modelled as simple logic units which, connected in networks, could perform computation.

This work became the basis of **artificial neural networks**. Neural networks went through periods of enthusiasm and neglect over the following decades, before advances in data, computing power and training methods made them central to modern artificial intelligence, from image recognition to language models.

## Computer science: symbols and connections

In the mid-twentieth century, computer scientists began treating intelligent decision making as the manipulation of symbols through formal logic. The Logic Theorist program, developed in the mid-1950s by Allen Newell, Herbert Simon and Cliff Shaw, proved mathematical theorems through automated reasoning. The 1956 Dartmouth workshop is often cited as the founding event of artificial intelligence as a field.

These **symbolic** systems relied heavily on human expertise, encoded as rules. An alternative approach, **connectionism**, inspired by neuroscience, focused on learning intelligent behaviour from data or experience using neural networks. Connectionist methods underpinned AlphaGo, the program developed by DeepMind that defeated professional Go players in 2015 and 2016, including Lee Sedol, one of the strongest players in the world, by combining neural networks with tree search. They also underpin much of the development of automated vehicles.

Combining symbolic and connectionist approaches remains an active area of research.

## Engineering: perception, planning and control

Engineers focused on making physical systems, such as robots, act intelligently in the real world. Such systems must:

- **perceive** the world through sensors, building a representation of the relevant features
- **plan** how to achieve their tasks
- **act** through motors and other actuators, while correcting for disturbances

**State estimation**, the field of building beliefs about the world from noisy sensor readings, produced methods such as the Kalman filter, published by Rudolf Kálmán in 1960 and used in navigation systems ever since. **Control theory** developed feedback methods to keep systems stable, from oven thermostats to aircraft autopilots. Planning was enabled by decades of growth in computing power.

GoCore's article [Acting when you can't see everything](/reados/collections/decision-making-machines/acting-when-you-cant-see-everything/) explains state estimation in plain terms.

## Mathematics: probability and simulation

To decide well under uncertainty, an agent must quantify it. Probability theory, developed from the seventeenth century in correspondence between Blaise Pascal and Pierre de Fermat about games of chance, provides the language.

A paper by Thomas Bayes, published in 1763 after his death, contained what became known as **Bayes' rule**: a method for updating beliefs in light of evidence. Pierre-Simon Laplace developed and applied similar ideas extensively. Bayesian methods fell in and out of favour, but from the mid-twentieth century they proved valuable in many practical settings. During the Second World War, the mathematician Bernard Koopman applied probability to the problem of searching for enemy submarines, helping establish search theory.

**Monte Carlo methods**, which use random sampling to estimate quantities that are hard to calculate directly, were developed in the 1940s for large-scale calculations associated with the Manhattan Project, by mathematicians including Stanislaw Ulam and John von Neumann. Sampling made previously intractable calculations possible, and it underpins many modern decision algorithms.

These foundations led to **Bayesian networks**, which became popular in artificial intelligence in the 1980s and 1990s, thanks in large part to the work of Judea Pearl. They are explained in [Bayesian networks](/reados/collections/decision-making-machines/bayesian-networks-cause-and-evidence/).

## Operations research: optimising organisations

**Operations research** applies mathematical analysis to decisions such as resource allocation, investment and maintenance scheduling. Its roots lie in late-nineteenth and early-twentieth-century efforts to analyse production scientifically. During the Second World War, it was used intensively to allocate military resources, plan convoys and improve the effectiveness of operations.

After the war, businesses adopted the same methods, giving rise to management science. Key tools include:

- **linear programming**, with George Dantzig's simplex method of 1947
- **dynamic programming**, developed by Richard Bellman in the 1950s for problems where decisions unfold over time
- **queuing theory**, for analysing waiting lines in services, telecommunications and manufacturing

Bellman's dynamic programming is the foundation of much of modern sequential decision making, including the methods described in [Sequential decisions](/reados/collections/decision-making-machines/sequential-decisions-planning-ahead/).

## How the fields came together

Modern decision-making algorithms rely on the convergence of these disciplines:

| Field | Key contribution | Where it appears today |
| --- | --- | --- |
| Economics | Utility, expected utility, game theory | Objective design, multi-agent systems |
| Psychology | Learning from rewards; human biases | Reinforcement learning; decision support design |
| Neuroscience | Neural networks | Deep learning, function approximation |
| Computer science | Symbolic reasoning, search, learning | Planning algorithms, AI systems |
| Engineering | State estimation, control | Robotics, vehicles, sensors |
| Mathematics | Probability, Bayes' rule, Monte Carlo | Inference, simulation, uncertainty |
| Operations research | Optimisation, dynamic programming | Scheduling, logistics, planning |

Cross-pollination between fields has driven many recent advances. Reinforcement learning, for example, combines psychology's reward-based learning, operations research's dynamic programming, neuroscience's neural networks and computer science's search algorithms.

## Lessons from the history

**Hard problems take generations.** Planning under uncertainty was recognised as a central challenge decades ago and remains an active research area.

**Different disciplines see different parts of the problem.** Teams that combine perspectives, such as economics, engineering and psychology, often design better decision systems.

**Methods come in and out of fashion.** Bayesian methods and neural networks both went through long periods of neglect before becoming central. Today's unfashionable idea may be tomorrow's breakthrough.

**Human judgement remains part of the system.** Even the most automated systems reflect human choices about objectives, models and acceptable risks.

## What this means for businesses

For a business considering automated decision tools, the history offers practical guidance:

- **Look for the underlying method.** A tool may be based on rules, learning from data, optimisation or simulation. Each has characteristic strengths and weaknesses.
- **Value proven techniques.** Linear programming, queuing models and statistical forecasting have decades of successful business use and are often more appropriate than newer methods.
- **Respect uncertainty.** The history shows how hard uncertainty is to handle well. Tools that ignore it should be treated with caution.
- **Keep people involved.** Objectives, trade-offs and oversight remain human responsibilities.

## A worked illustration

This is an illustration, not a real business.

A regional logistics company is offered an "AI-powered" routing tool. Its operations manager asks what method lies underneath. The answer reveals that the tool combines a well-established vehicle routing optimisation method with a learned model of travel times. Knowing this, the manager tests the travel-time predictions against the company's own historical data, finds them accurate on main roads but poor on rural routes, and agrees to use the tool with manual adjustment for rural deliveries. Understanding the lineage of the method made it possible to evaluate the tool's claims sensibly.

## Common mistakes

**Assuming automated decision making is entirely new.** Many tools rest on decades-old, well-understood methods.

**Assuming newer is always better.** Older methods are often more reliable and transparent for well-structured problems.

**Ignoring the human elements.** Objectives and trade-offs are set by people.

**Forgetting uncertainty.** It has been the central challenge throughout the history of the field.

## Questions to ask

- Which tradition does a particular decision tool draw on: rules, learning, optimisation, probability or control?
- How does it handle uncertainty?
- What human choices are built into its objectives?
- Would an established method, such as linear programming or a simple forecast, solve the problem as well?
- For your own business: which decisions could benefit from methods that already have a long track record?

## Bringing it together

Automated decision making draws on centuries of thought: economics contributed utility and game theory, psychology contributed learning from rewards and an understanding of human biases, neuroscience inspired neural networks, computer science contributed symbolic reasoning and search, engineering contributed state estimation and control, mathematics contributed probability and simulation, and operations research contributed optimisation and dynamic programming.

Today's methods combine all of these. Understanding where they came from helps businesses evaluate decision tools sensibly, choose methods that fit their problems and keep the human responsibilities clearly in view.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022), together with widely documented history of science and computing. Explanations are GoCore's own; the worked illustration is hypothetical. This article is general information, not professional advice.*
