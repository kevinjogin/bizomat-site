---
title: "When others decide too: game theory for business decisions"
description: "Your best choice often depends on what others do. A plain-English guide to dominant strategies, Nash equilibrium, the prisoner's dilemma and how people really reason about each other."
publishDate: 2026-10-03
category: "Business"
tags:
  - strategy
  - customers
  - ai
author: "GoCore"
featured: false
draft: false
---

Many decisions involve other decision makers. A business setting its prices must consider how competitors will respond. A supplier negotiating a contract must anticipate the buyer's position. A team member deciding how much effort to put into a shared project must consider what colleagues will do. In each case, the best choice depends not only on uncertain events but on the choices of others, who are thinking about you in turn.

This is **interaction uncertainty**, the fourth source of uncertainty described in *Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray. The book's final part covers multiagent systems, drawing on **game theory**, the study of strategic interaction founded by John von Neumann and Oskar Morgenstern in the 1940s.

This article explains the core ideas in plain English: simple games, dominant strategies, Nash equilibrium, mixed strategies, correlated equilibrium, models of how real people reason about each other, and repeated interactions. It uses business examples throughout and is part of GoCore's series on decision making.

## Simple games

In game theory, a **game** is any situation where several **players** choose actions and each player's outcome depends on everyone's choices. A **simple game** is one where players choose once, at the same time, without seeing the others' choices.

Each player has a **utility** for each combination of choices, reflecting how much they value the outcome. Games are often shown as tables, with one player's options as rows, the other's as columns, and the outcomes for both in each cell.

## Dominant strategies

The simplest situation is when a player has a **dominant strategy**: an action that is best regardless of what others do. A rational player with a dominant strategy should play it.

If every player has a dominant strategy, the result is a **dominant strategy equilibrium**. Such equilibria are reassuring because they do not depend on predicting others correctly. They are also uncommon in rich, real-world interactions.

## The prisoner's dilemma

The most famous game in game theory, the **prisoner's dilemma**, shows how individually rational choices can produce a collectively poor result. The book includes it among its standard example problems.

The classic story: two suspects are questioned separately. Each can stay silent (cooperate with the other) or testify (defect). If both stay silent, both receive a light sentence. If one testifies and the other stays silent, the one who testifies goes free and the other receives a heavy sentence. If both testify, both receive a moderately heavy sentence.

For each player, testifying is better whatever the other does: it either lets them go free or reduces their sentence. Testifying is a dominant strategy. So both testify, and both end up worse off than if both had stayed silent.

### A business version

This is an illustration with round numbers. Two cafés on the same street each choose whether to keep prices steady or cut them. Weekly profits:

| | Café B keeps prices | Café B cuts prices |
| --- | --- | --- |
| **Café A keeps prices** | A: $5,000, B: $5,000 | A: $2,500, B: $6,000 |
| **Café A cuts prices** | A: $6,000, B: $2,500 | A: $3,500, B: $3,500 |

Whatever B does, A earns more by cutting prices ($6,000 instead of $5,000 if B keeps prices; $3,500 instead of $2,500 if B cuts). The same applies to B. If both reason this way, both cut prices and earn $3,500 each, less than the $5,000 each they would earn if both kept prices steady.

```figure
type: matrix
title: Two cafés and a price war
x: Café B keeps → cuts prices
y: Café A cuts → keeps prices
hot: 4
caption: Illustrative monthly profits. Cutting is better for each café whatever the other does, so both end up with less.
- Both keep | A $5,000 · B $5,000
- B cuts | A $2,500 · B $6,000
- A cuts | A $6,000 · B $2,500
- *Both cut | A $3,500 · B $3,500
```

Price wars, advertising arms races and over-investment in capacity often have this structure. Recognising it is the first step to avoiding it, for example by competing on quality or service rather than price, or by building relationships that make cooperation more likely over time. Note that agreements between competitors to fix prices are illegal under Australian competition law; the legitimate responses lie in differentiation and in each business making its own independent decisions wisely.

## Nash equilibrium

Most games lack dominant strategies. The central concept for analysing them is the **Nash equilibrium**, named after the mathematician John Nash. A Nash equilibrium is a combination of strategies in which no player can do better by changing their own strategy alone, given what the others are doing.

In other words, at a Nash equilibrium, every player is making a best response to everyone else. Nobody has a reason to change unilaterally.

Nash proved in 1950 that every game with a finite number of players and actions has at least one Nash equilibrium, provided players are allowed to randomise their choices. This result, which contributed to his Nobel memorial prize in economics in 1994, made the concept universally applicable.

### Mixed strategies

Sometimes no equilibrium exists in which each player chooses a single action with certainty. Consider rock-paper-scissors, another of the book's standard examples. Any predictable choice can be exploited: if you always play rock, your opponent plays paper.

The equilibrium is a **mixed strategy**: each player randomises, choosing rock, paper and scissors with equal probability. Neither player can gain by deviating, because the opponent's choices are unpredictable.

Business situations with this structure include audits and inspections, where predictable timing invites evasion, and promotional timing, where predictable sales patterns let customers and competitors plan around them. Some unpredictability can be strategically valuable.

### Limitations of Nash equilibrium

Nash equilibrium is powerful, but it has limitations:

- **Multiple equilibria.** Many games have several, and the theory does not say which will occur.
- **Computational difficulty.** Finding equilibria in large games can be very hard.
- **Assumed rationality.** It assumes every player reasons perfectly and expects others to do the same.

## Correlated equilibrium

A **correlated equilibrium** allows players' choices to be coordinated by a shared signal. The classic illustration is a traffic light at an intersection. Without coordination, two drivers might both go (and crash) or both wait. A traffic light tells each driver what to do; each driver has no reason to disobey, given that the other is following the same signal. Everyone does better than without coordination.

Correlated equilibria can achieve better outcomes than Nash equilibria, and they are often easier to compute. In business, industry standards, published schedules, market conventions and shared protocols play a similar coordinating role.

## How people actually reason about each other

Real people do not always behave as Nash equilibrium predicts. The book describes several models of how decision makers respond to each other, with more realistic assumptions.

### Iterated best response

Each player repeatedly adjusts to the others' latest choices. Sometimes this converges to an equilibrium; sometimes it cycles. Markets in which competitors repeatedly react to each other's prices can show both patterns.

### Fictitious play

Each player keeps track of how often others have chosen each action in the past and responds as if others will continue to choose with those frequencies. Over time, in many games, the observed frequencies settle towards an equilibrium. This is a simple model of learning from experience in repeated interactions.

### Levels of reasoning

The book describes a **hierarchical** model of reasoning, related to what economists often call level-k thinking. A level-0 player chooses without much strategic thought. A level-1 player best-responds to level-0 players. A level-2 player best-responds to level-1 players, and so on. Real people typically reason only one or two levels deep, and the book's version also allows for imperfect, somewhat random choices.

### The traveller's dilemma

The **traveller's dilemma**, proposed by the economist Kaushik Basu and included among the book's examples, shows why this matters. Two travellers each claim compensation for identical lost items, choosing an amount between $2 and $100. If they claim the same, both receive it. If they differ, both receive the lower amount, with a $2 bonus for the lower claimant and a $2 penalty for the higher one.

Logic leads step by step downward: undercutting the other by $1 always seems to pay, until the only Nash equilibrium is for both to claim $2. Yet when people play this game, many claim amounts near $100, and often earn far more than equilibrium players would. Models with limited levels of reasoning predict this much better than Nash equilibrium does.

```figure
type: compare
title: The traveller's dilemma: theory and people
cols: Claim | Result
caption: Predicting rivals and customers as perfect reasoners can mislead; most reason only one or two levels deep.
- Nash equilibrium | $2 each | Undercutting by $1 always seems to pay
- What many people do | Near $100 | Often earn far more than equilibrium players
```

The lesson for business is important: predicting competitors and customers as perfectly rational calculators can be wrong. Thinking about how many steps of reasoning others are actually likely to apply often gives better predictions.

## Repeated and sequential interactions

Many interactions are not one-off. The book extends game theory to **Markov games**, where players interact repeatedly in a changing environment, and to situations where players cannot fully observe the state.

Repetition changes incentives. In a one-off prisoner's dilemma, defection dominates. In a repeated relationship, cooperation can be sustained, because defecting today invites retaliation tomorrow. In computer tournaments run by the political scientist Robert Axelrod around 1980, a simple strategy called **tit-for-tat**, which cooperates first and then copies the other player's previous move, performed remarkably well against a wide range of strategies.

The general insights for business:

- **Long-term relationships favour cooperation.** Suppliers, customers and partners who expect to deal with each other repeatedly have strong reasons to behave well.
- **Reputation matters.** Behaviour in one interaction affects how others treat you in future ones.
- **Clear, consistent responses help.** Being predictable in rewarding cooperation and responding to bad behaviour encourages good conduct from others.
- **Forgiveness has value.** Strategies that return to cooperation after a dispute avoid endless cycles of retaliation.

## Using game theory in practice

Game theory is most useful as a way of structuring thinking:

1. **Identify the players.** Who else's decisions affect your outcome, and whose outcomes do yours affect?
2. **List their options.** What can each realistically do?
3. **Consider their goals.** What do they value? Their goals may not be what you assume.
4. **Look for dominant strategies.** Does anyone have an option that is best regardless?
5. **Find stable outcomes.** Which combinations of choices would nobody want to change unilaterally?
6. **Consider realistic reasoning.** How many steps ahead are others likely to think?
7. **Think about repetition.** Is this a one-off, or part of a continuing relationship?

## A worked illustration

This is an illustration, not a real business.

A regional equipment supplier learns that a competitor is opening a branch in its town. The owner's first instinct is to cut prices pre-emptively.

Working through the game: the competitor is a larger company that can sustain a price war longer. Both businesses would lose if prices fell sharply, a prisoner's dilemma. The local customer base values fast service and local expertise. The interaction is repeated, and both will be in the market for years.

The supplier chooses not to start a price war. Instead, it strengthens what the competitor cannot easily match: same-day service, local knowledge and long-standing relationships. It keeps prices competitive but not aggressively low, and responds firmly but proportionately if the competitor undercuts on specific lines. Over the following year, both businesses settle into a stable pattern, with the supplier retaining most of its loyal customers at healthy margins.

```figure
type: steps
title: Working through the game before reacting
caption: A repeated interaction with a larger rival favoured service over a price war.
- Identify the players
- List their options
- Consider their goals
- Look for dominant strategies
- Find stable outcomes
- Consider realistic reasoning
- *Think about repetition
```

## Common mistakes

**Ignoring others' responses.** Decisions that would work in isolation can fail once others react.

**Assuming perfect rationality.** Real competitors and customers reason in limited steps.

**Treating repeated interactions as one-offs.** The future shadow changes what is sensible today.

**Starting price wars.** Many competitive situations are prisoner's dilemmas in which everyone loses.

**Being entirely predictable when unpredictability matters.** Inspections and audits work better when timing cannot be anticipated.

## Questions to ask

- Who are the other players, and what do they want?
- Does anyone have a dominant strategy?
- What outcomes would be stable, and are they good for us?
- How many steps of reasoning are others likely to apply?
- For your own business: which competitive or negotiating situation would look different if treated as a repeated game?

## Bringing it together

When others decide too, the best choice depends on their choices. Game theory provides tools for these situations: dominant strategies, Nash equilibrium, mixed strategies and correlated equilibrium describe stable patterns of play; the prisoner's dilemma shows how individually rational choices can harm everyone; and models of limited reasoning, such as levels of thinking and fictitious play, explain how real people behave.

Repeated interactions change incentives, making cooperation, reputation and consistent responses valuable. Used as a way of structuring thinking, game theory helps businesses anticipate competitors, negotiate with partners and avoid destructive contests that leave everyone worse off.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022), together with widely published game theory. Explanations are GoCore's own; the illustrations are hypothetical. Competition law is summarised generally; seek legal advice for specific situations. This article is general information, not legal or professional advice.*
