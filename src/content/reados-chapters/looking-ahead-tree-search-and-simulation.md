---
title: "Looking ahead: tree search, rollouts and planning by simulation"
description: "When problems are too large to solve completely, decision makers plan from the current situation by looking a few steps ahead. How lookahead, rollouts, Monte Carlo tree search and re-planning work."
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

A chess player does not memorise the best move for every possible position on the board; there are far too many. Instead, they look at the position in front of them and think a few moves ahead: if I do this, my opponent might do that, and then I could do this. They focus their thinking on the most promising lines and use judgement to evaluate positions they cannot see to the end.

Many decision problems are like this. There are too many possible situations to work out a complete policy in advance, but it is possible to plan from the current situation, look ahead a limited distance, and choose a good next action. Once the action is taken and the new situation is observed, the process repeats.

This approach is called **online planning**, and it is the subject of an important chapter of *Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray. This article explains its main methods in plain English: receding horizon planning, rollouts, forward search, branch and bound, sparse sampling and Monte Carlo tree search, along with the trade-offs between planning ahead and planning in the moment. It builds on [Sequential decisions](/reados/collections/decision-making-machines/sequential-decisions-planning-ahead/) and is part of GoCore's series on decision making.

## Offline and online planning

There are two broad ways to make sequential decisions.

**Offline planning** works out a complete policy before any decisions are made: what to do in every possible state. Once computed, decisions are fast, because the policy is simply consulted. The methods described in the article on sequential decisions, such as value iteration, are offline methods. They work well when the number of states is manageable.

**Online planning** works out what to do only for the situation actually encountered, at the time it is encountered. It avoids the impossible task of planning for every state, at the cost of doing computation each time a decision is needed.

Online planning focuses effort on what matters now. The states reachable in the next few steps from the current situation are usually a tiny fraction of all possible states.

## Receding horizon planning

The simplest form of online planning is **receding horizon planning**: plan a fixed number of steps ahead from the current state, take the first action of the plan, observe what happens, then plan again from the new state with the horizon moved forward.

In engineering, this approach is widely known as **model predictive control**, and it is used to control industrial processes, vehicles and energy systems. Its strength is that it constantly corrects for surprises: whatever happens after each action, the next plan starts from the actual situation.

Businesses use the same idea in rolling forecasts and rolling plans: a twelve-month plan updated every month, always looking twelve months ahead from the current position, rather than an annual plan that becomes stale.

### Choosing the horizon

The horizon must be long enough to capture the important consequences of actions, but short enough to keep planning manageable. Too short, and the planner neglects long-term effects, such as skipping maintenance because the breakdown it risks lies beyond the horizon. Too long, and computation grows rapidly, while predictions far into the future become unreliable anyway.

## Rollouts

A **rollout** estimates how good a situation is by simulating what would happen if a simple, sensible policy were followed from there. For example, to evaluate a possible action, the planner might simulate taking it and then following a basic rule of thumb for the next several steps, repeating the simulation many times and averaging the results.

Rollouts are a practical way to look beyond the planning horizon without exploring every possibility. Their accuracy depends on the quality of the simple policy used: a sensible rule of thumb gives useful estimates; a poor one can mislead.

## Forward search

**Forward search** builds a tree of possibilities from the current state. At each level, it considers every action and every possible resulting state, out to a chosen depth. At the end of the tree, it estimates the value of each leaf, for example with a rollout or an approximate value function. It then works back up the tree to choose the best first action.

Forward search is thorough but expensive. The number of branches grows exponentially with depth: with five actions and five possible outcomes per action, there are 25 branches per step, about 15,600 after three steps and almost 10 million after five. For most real problems, exhaustive forward search is only feasible for very short horizons.

## Branch and bound

**Branch and bound** reduces the work by avoiding branches that cannot possibly be the best. If the planner has a quick way to calculate an upper limit on how good a branch could be, and that limit is worse than an option already found, the branch can be skipped.

The idea is familiar from everyday decisions: if one supplier's best possible price is already higher than a confirmed quote from another, there is no need to negotiate with the first in detail. The effectiveness of branch and bound depends on having good bounds; loose bounds prune little.

## Sparse sampling

When each action can lead to many possible outcomes, considering every outcome is impractical. **Sparse sampling** considers only a small random sample of outcomes for each action, using them to estimate its value.

Remarkably, the number of samples needed for good decisions does not depend on how many possible outcomes there are. This makes sparse sampling useful for problems with very large or continuous outcome spaces, although the tree still grows exponentially with depth.

## Monte Carlo tree search

**Monte Carlo tree search**, often abbreviated MCTS, is one of the most successful online planning methods. Rather than building the whole tree evenly, it grows the tree selectively, spending more effort on the most promising branches while still occasionally checking others.

Each iteration of MCTS involves four steps:

1. **Selection:** starting from the current state, move down the existing tree by choosing actions that balance how good they have looked so far with how little they have been tried.
2. **Expansion:** when reaching a part of the tree not yet explored, add a new node.
3. **Simulation:** estimate the value of the new node, often with a rollout.
4. **Backpropagation:** update the value estimates of all the nodes along the path with the result.

After many iterations, the planner chooses the action from the current state that has proved best, usually the one most visited.

### Balancing promise and uncertainty

The selection step uses a rule that adds an **exploration bonus** to actions that have been tried less often. This ensures the search does not lock onto an early favourite that only looked good by chance. It is the same balance between exploiting what looks best and exploring what is uncertain that is described in [Explore or exploit?](/reados/collections/competitive-strategy-and-positioning/explore-or-exploit/).

### Why MCTS is so useful

MCTS has several practical strengths:

- **It is anytime:** it can be stopped whenever a decision is needed, returning the best action found so far, and more time generally produces better decisions.
- **It focuses effort:** promising lines receive most of the computation.
- **It needs only a simulator:** it does not require explicit probability tables, only the ability to simulate what happens after actions.

MCTS became famous through game-playing programs. DeepMind's AlphaGo, which defeated professional Go players in 2015 and 2016, combined Monte Carlo tree search with neural networks that guided the search towards promising moves and evaluated positions. The book discusses related methods that combine tree search with learned value estimates.

## Heuristic search

When a problem has a clear goal, such as reaching a destination or completing a task, **heuristic search** uses an estimate of the remaining cost or value to guide the search towards the goal. A good heuristic dramatically reduces the amount of searching required. Route-finding in navigation apps relies on heuristic search methods. The book also describes labelled variants that track which parts of the problem have already been solved, avoiding repeated work.

## Open-loop and closed-loop planning

An important distinction is between two kinds of plans.

**Closed-loop plans** (policies) specify actions that depend on what is observed along the way. "If the machine is worn next week, service it; if it is still good, run it."

**Open-loop plans** specify a fixed sequence of actions in advance, without allowing for future observations. "Run the machine for three weeks, then service it."

Open-loop plans are simpler to compute and can work well when uncertainty is low, especially when combined with frequent re-planning. But they ignore the value of being able to react. In uncertain situations, a closed-loop policy, or an open-loop plan that is regularly revised, usually performs better.

Many business plans are open-loop: fixed sequences of activities and dates. Turning them into closed-loop plans, by adding decision points ("if pre-orders exceed 200 by March, proceed to production; otherwise, revise the design"), makes them more robust.

## Choosing a method

| Method | Best suited to | Main limitation |
| --- | --- | --- |
| Receding horizon | Problems where re-planning is frequent and cheap | Horizon too short can miss long-term effects |
| Rollouts | Estimating the value of situations quickly | Only as good as the simple policy used |
| Forward search | Small problems with short horizons | Grows exponentially with depth |
| Branch and bound | Problems with good bounds | Needs tight bounds to help much |
| Sparse sampling | Problems with many possible outcomes | Still exponential in depth |
| Monte Carlo tree search | Large problems with a good simulator | Needs many simulations for hard problems |
| Heuristic search | Goal-directed problems with good estimates | Depends on heuristic quality |

In practice, methods are often combined, for example MCTS with rollouts and a learned value function.

## Lessons for business planning

The ideas behind online planning translate directly into practical planning habits.

**Plan from where you are.** Detailed long-range plans quickly become outdated. Focus detailed planning on the near term, and revise regularly as the situation develops.

**Look a few steps ahead.** Before acting, consider the likely responses and situations that will follow, not just the immediate result.

**Focus on promising options, but check the others.** Spend most effort on the strongest options, while occasionally testing less obvious ones in case early impressions were wrong.

**Use simple rules to estimate the future.** Rough estimates of what happens beyond the planning horizon, based on sensible rules of thumb, are better than ignoring it.

**Build decision points into plans.** Replace fixed sequences with plans that say what to do depending on what is observed.

**Stop when good enough.** Like MCTS, planning can be stopped when time runs out, provided the best option found so far is always available.

## A worked illustration

This is an illustration, not a real business.

A small events company plans its marketing for a festival six months away. Its previous approach was a fixed schedule set at the start: specific campaigns in specific weeks.

It switches to a receding horizon approach. Each fortnight, it reviews ticket sales and enquiries, plans the next six weeks in detail and the remaining period in outline, and commits only the next fortnight's spending. Each plan includes decision points: if early-bird sales are slow, shift budget to partner promotions; if a particular channel performs well, extend it.

When an unexpected competing event is announced, the company adjusts within two weeks rather than continuing with a plan written months earlier. Ticket sales end close to target, and marketing spend is lower than under the fixed schedule, because poorly performing activities were cut early.

## Common mistakes

**Planning everything in advance.** Long, fixed plans break when the unexpected happens.

**Choosing too short a horizon.** Important consequences can lie just beyond it.

**Searching exhaustively.** Effort is better focused on promising options.

**Locking onto early favourites.** Some exploration of alternatives guards against early luck.

**Treating plans as open-loop.** Plans should say what to do as new information arrives.

## Questions to ask

- Are we planning a complete policy in advance, or planning from the current situation?
- How far ahead do the important consequences of this decision reach?
- Which options deserve most of our analysis, and have we checked the others enough?
- What decision points should our plan include?
- For your own business: which fixed plan would work better as a rolling, regularly revised plan?

## Bringing it together

Online planning makes large sequential problems manageable by planning from the current situation and looking a limited distance ahead. Receding horizon planning re-plans after each step; rollouts estimate the future with simple policies; forward search, branch and bound and sparse sampling explore possibilities systematically; and Monte Carlo tree search grows its search selectively, balancing promising options with uncertain ones.

The same principles make business planning more robust: plan in detail for the near term, look ahead to likely consequences, focus effort while checking alternatives, build decision points into plans and revise regularly as the situation unfolds.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022). Explanations are GoCore's own; the worked illustration is hypothetical. This article is general information, not professional advice.*
