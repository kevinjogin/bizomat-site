---
title: "Simulating Noisy Systems by the Numbers"
subtitle: "Time-stepped simulation of equipment with random inputs: random numbers, Euler and Heun steps, coloured noise, first passage and rare events"
description: "How to simulate equipment driven by random inputs: generate noise properly, choose time steps and methods, count runs, estimate first-passage times and rare events, and check the results."
category: Engineering
tags: [design, validation, systems, experimentation]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate engineering analysis and simulation"
audience: "Mechanical, process and plant engineers, analysts and technical students who need to predict how equipment behaves when its inputs are random, and who build or check simulations to do it."
outcomes:
  - "Write a stochastic differential equation for a piece of equipment with random inputs and simulate it with the Euler–Maruyama and Heun methods."
  - "Generate uniform, Gaussian and exponentially correlated random inputs, and test that they have the properties the model assumes."
  - "Choose a time step by convergence tests and count the runs needed for a stated precision in a mean or a probability."
  - "Estimate first-passage times and rare-event probabilities without the biases of coarse time steps and too few runs."
  - "Verify a simulation against exact results, validate it against plant data and use it to compare design options."
coverVariant: category
references:
  - title: "Stochastic Processes in Physics, Chemistry, and Biology"
    creator: "J. A. Freund and T. Pöschel (eds), Lecture Notes in Physics 557, Springer, Berlin (ISBN 3 540 41074 0)"
    year: "2000"
    note: "Supplied source, in copyright. Read only as a subject map: its chapter by R. Mannella on integrating stochastic differential equations names the questions this book takes up (which integration scheme, the time-step problem at boundaries, exponentially correlated noise and random number generators), and its chapter by M. I. Dykman and B. Golding on large fluctuations and Kramers escape informs Chapter 9. No text, equations, figures, examples or exercises are reproduced or adapted; the engineering treatment, running case and numbers here are original."
  - title: "An algorithmic introduction to numerical simulation of stochastic differential equations"
    creator: "D. J. Higham, SIAM Review, vol. 43, pp. 525–546"
    year: "2001"
    url: "https://doi.org/10.1137/S0036144500378302"
    note: "Accessible introduction to the Euler–Maruyama method, strong and weak convergence and their testing, used in Chapters 3 and 5."
  - title: "Numerical Solution of Stochastic Differential Equations"
    creator: "P. E. Kloeden and E. Platen, Springer, Berlin"
    year: "1992"
    note: "Standard reference for stochastic integration schemes and their orders of convergence, used as background for Chapters 3 and 5."
  - title: "Exact numerical simulation of the Ornstein-Uhlenbeck process and its integral"
    creator: "D. T. Gillespie, Physical Review E, vol. 54, pp. 2084–2091"
    year: "1996"
    url: "https://doi.org/10.1103/PhysRevE.54.2084"
    note: "Source of the exact update for exponentially correlated noise used in Chapter 4."
  - title: "A note on the generation of random normal deviates"
    creator: "G. E. P. Box and M. E. Muller, Annals of Mathematical Statistics, vol. 29, pp. 610–611"
    year: "1958"
    url: "https://doi.org/10.1214/aoms/1177706645"
    note: "Original paper for the Box–Muller transformation used in Chapter 2."
  - title: "Mersenne twister: a 623-dimensionally equidistributed uniform pseudo-random number generator"
    creator: "M. Matsumoto and T. Nishimura, ACM Transactions on Modeling and Computer Simulation, vol. 8, pp. 3–30"
    year: "1998"
    url: "https://doi.org/10.1145/272991.272995"
    note: "Background for the properties of a good uniform generator in Chapter 2."
  - title: "Absorbing boundaries and optimal stopping in a stochastic differential equation"
    creator: "R. Mannella, Physics Letters A, vol. 254, pp. 257–262"
    year: "1999"
    note: "Background for correcting first-passage times for crossings between time steps in Chapter 7."
  - title: "Brownian motion in a field of force and the diffusion model of chemical reactions"
    creator: "H. A. Kramers, Physica, vol. 7, pp. 284–304"
    year: "1940"
    note: "Original paper on escape rates over a barrier, the background to the exponential extrapolation of rare events in Chapter 9."
  - title: "Rare Event Simulation using Monte Carlo Methods"
    creator: "G. Rubino and B. Tuffin (eds), Wiley, Chichester"
    year: "2009"
    note: "Background for splitting and importance sampling in Chapter 9."
  - title: "If nothing goes wrong, is everything all right? Interpreting zero numerators"
    creator: "J. A. Hanley and A. Lippman-Hand, Journal of the American Medical Association, vol. 249, pp. 1743–1745"
    year: "1983"
    note: "Source of the rule of three for an upper bound when no events are observed, used in Chapter 9."
  - title: "Simulation Modeling and Analysis, fifth edition"
    creator: "A. M. Law, McGraw-Hill, New York"
    year: "2015"
    note: "Background for run counts, batch means, common random numbers, verification and validation in Chapters 6 and 10."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods"
    creator: "National Institute of Standards and Technology"
    year: "2012"
    url: "https://www.itl.nist.gov/div898/handbook/"
    note: "Public reference for confidence intervals, the chi-square test of a standard deviation and two-sample comparisons, used in Chapters 2, 6 and 10."
related:
  - title: "Prototypes and Simulation by the Numbers"
    href: "/reados/publications/prototypes-and-simulation-by-the-numbers/"
  - title: "Random Error and Drift by the Numbers"
    href: "/reados/publications/random-error-and-drift-by-the-numbers/"
  - title: "Design Simulation by the Numbers"
    href: "/reados/publications/design-simulation-by-the-numbers/"
  - title: "Breakdowns and Buffers by the Numbers"
    href: "/reados/publications/breakdowns-and-buffers-by-the-numbers/"
  - title: "Trips and Alarms by the Numbers"
    href: "/reados/publications/trips-and-alarms-by-the-numbers/"
---

## About this book

Many engineering questions are about equipment whose inputs are random. How often will a tank fed by an irregular inflow overflow? How far will a vehicle's suspension travel on a rough road? How long will a buffer last when the machine feeding it stops at random? Steady-state calculations with average inputs give the wrong answer to all of these, often confidently: the average inflow never overflows the tank. The answer lies in the variation, and when the equipment is nonlinear, has limits, switches on and off or responds to events, the only practical way to find it is to simulate many realisations of the random inputs and count what happens.

This book teaches how to do that properly. It starts with random numbers and how to test them, then builds the two basic time-stepping methods for stochastic differential equations, the Euler–Maruyama and Heun steps, and shows how to generate the correlated noise that real inputs have. It then deals with the questions every simulation must answer before its results mean anything: is the time step small enough, are there enough runs, are crossings of a limit being missed between steps, and how can events that happen once in years be estimated from runs that take minutes. The last chapter verifies the model against exact results, validates it against plant data and uses it to choose between design options.

It is written for mechanical, process and plant engineers, analysts and technical students. It assumes algebra, calculus to the level of first-order differential equations, basic probability and some familiarity with a spreadsheet or a scripting language. No particular software is assumed; each method is short enough to write in a few lines of any language. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional plant. This is an illustration. Plant D is a food factory that runs two production shifts a day, about 240 days a year. Its process and washdown wastewater flows to a balance tank, BT-1, a vertical cylinder 2.0 m in diameter, and leaves through a 32 mm orifice plate to the sewer connection. The plant's trade waste agreement with its water utility limits the instantaneous discharge to 3.0 L/s, which the orifice reaches when the level in the tank is about 1.85 m. The tank overflows into a bunded area at 2.50 m, an event that must be reported.

The inflow is the sum of two random parts. Process wastewater averages 2.0 L/s and fluctuates around that by about 0.8 L/s, with changes that persist for a couple of minutes. On top of it, washdowns of filling and packing equipment arrive at random, about four in a production day, each adding 3.0 L/s for 8 minutes. The plant's engineer is asked how often the discharge limit is exceeded, how likely an overflow is, and what would reduce both.

The plant, its tank and every flow, level, rate and cost are invented. None describes KEVOS® work, a real company, a real water utility's requirements or a real supplier's product.

## How to use the book

Read Chapters 1 to 3 first: they set up the model, the random numbers and the basic step. Chapters 4 and 5 make the model realistic and accurate, with correlated noise and a better integration method. Chapters 6 and 7 deal with how many runs are needed and with first-passage times, where coarse time steps cause the largest errors. Chapter 8 adds random events and switching, Chapter 9 rare events, and Chapter 10 brings verification, validation and the design decision together.

WORKOS tools are linked where they perform a step of the method or check a result, with a note of exactly what each one calculates and where its model stops. Where a tool solves a related problem rather than the chapter's own, the text says so.

## Source limits and professional responsibility

The methods here are standard ones from the numerical analysis of stochastic differential equations and from simulation practice: pseudo-random generators, the Box–Muller transformation, the Euler–Maruyama and Heun schemes, the exact update for exponentially correlated noise, confidence intervals and the rule of three. The running case's model is deliberately simple, a single tank with an orifice outlet, and every chapter states its assumptions.

A simulation is only as good as its model and its inputs. This book is educational. Real decisions about trade waste discharges, overflow risks or any other regulated matter should rest on measured data, the regulator's or utility's own requirements, and review by people competent in the process and in the method. Nothing here describes any utility's actual requirements.
