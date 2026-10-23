---
book: machining-by-the-numbers
chapterSlug: machining-economics-and-cutting-speed
order: 9
title: "Machining economics: choosing a cutting speed"
description: "Build a cost-per-part model from machine rate, cutting time, tool changes and tool cost, then find the minimum-cost and maximum-output speeds and see how flat the optimum is."
draft: false
---

Faster cutting shortens the cycle but wears tools quicker. Slower cutting saves tools but costs machine time. Somewhere between the two lies a speed that minimises the total cost of each part, and a somewhat higher speed that maximises output. Knowing where those speeds are, and how much difference they really make, helps a workshop choose cutting data on evidence rather than habit.

This chapter builds a simple cost model for a turning operation, uses the Taylor equation from Chapter 8 to find the optimum speeds, and shows why the answer depends on whether the machine is the bottleneck.

## What a part costs on the machine

For one operation, the cost per part has four main components:

1. **Cutting time**, charged at the machine rate.
2. **Non-cutting time**, such as loading, unloading, rapid moves and tool indexing, also charged at the machine rate. It does not depend on cutting speed.
3. **Tool change time**, charged at the machine rate, shared among the parts made with each edge.
4. **Tool cost**, the cost of each cutting edge, shared among the parts made with it.

The **machine rate** here means the hourly cost of running the machine with its operator, including labour, machine depreciation or lease, power, maintenance, floor space and a share of overheads. It is not the price charged to customers.

If feed and depth of cut stay fixed, cutting time is inversely proportional to cutting speed: double the speed, halve the time. Tool life, from Taylor's equation, falls much faster than speed rises.

## Harbourline's shaft example

Harbourline applies the model to the turned shaft family from Chapter 8, for which it has measured n = 0.218 and C = 446.8. The assumptions are:

| Item | Value |
|---|---|
| Machine rate, machine and operator | A$150 per hour, or A$2.50 per minute |
| Cutting time per part at 200 m/min | 3.0 min |
| Non-cutting time per part | 1.5 min |
| Tool change time, including offset check | 2.0 min |
| Insert price | A$24 for four edges, so A$6 per edge |

Cutting time at any speed V is then 3.0 × 200 ÷ V minutes. Tool life is (446.8 ÷ V)^(1 ÷ 0.218) minutes, and the parts per edge are tool life divided by cutting time per part.

At 200 m/min, for example:

- Tool life: 40.0 min, so 40.0 ÷ 3.0 = 13.3 parts per edge
- Cutting cost: 3.0 × 2.50 = A$7.50
- Non-cutting cost: 1.5 × 2.50 = A$3.75
- Tool change and tool cost per part: (2.0 × 2.50 + 6.00) ÷ 13.3 = A$0.83
- Total: about **A$12.08** per part

## Know what the machine rate contains

The model's machine rate is a cost, and its value changes the answers. It normally includes the operator's wages and on-costs, the machine's depreciation or lease, its maintenance, the power it uses, the floor space it occupies and a share of the business's overheads, divided by the hours the machine is expected to be productively used.

The last part is the most sensitive. A machine that costs the same to own but is used for fewer productive hours has a higher hourly rate. If a shop's rate assumes the machine is busy for most of each shift, and it is actually idle half the time, every cost calculation using that rate is too low. Chapter 11 builds a quotation on the rate; this model assumes it has been calculated honestly.

## Cost and time across a range of speeds

Repeating the calculation for several speeds gives the following. All amounts are A$ per part, excluding GST.

| Speed (m/min) | Cutting time (min) | Tool life (min) | Parts per edge | Cutting cost | Tool cost incl. changes | Total cost | Time per part (min) |
|---|---|---|---|---|---|---|---|
| 180 | 3.33 | 64.9 | 19.5 | 8.33 | 0.57 | 12.65 | 4.94 |
| 200 | 3.00 | 40.0 | 13.3 | 7.50 | 0.83 | 12.08 | 4.65 |
| 245 | 2.45 | 15.8 | 6.5 | 6.12 | 1.71 | 11.58 | 4.26 |
| 260 | 2.31 | 12.0 | 5.2 | 5.77 | 2.12 | 11.63 | 4.19 |
| 291 | 2.06 | 7.2 | 3.5 | 5.16 | 3.16 | 12.07 | 4.14 |
| 300 | 2.00 | 6.2 | 3.1 | 5.00 | 3.54 | 12.29 | 4.14 |

Total cost includes the A$3.75 non-cutting cost in every row. Time per part includes cutting time, non-cutting time and each part's share of tool change time.

```figure
type: line
title: Cost per shaft against cutting speed
x: Cutting speed (m/min)
y: Total cost per part (A$)
ymin: 11
ymax: 13
mark: 245 | minimum cost
mark: 291 | maximum output
caption: The curve is flat near its minimum: 200 m/min costs only about 50 cents more per part than the optimum.
- 180 | 12.65
- 200 | 12.08
- 245 | 11.58
- 260 | 11.63
- 291 | 12.07
- 300 | 12.29
```

Two speeds stand out: total cost is lowest around 245 m/min, and time per part is lowest around 291 m/min.

## The minimum-cost speed

These optimum points can be found directly. A classic result, derived by W. W. Gilbert in 1950 by differentiating the cost per part with respect to tool life, gives the **minimum-cost tool life**:

**T_E = (1 ÷ n − 1) × (t_ch + Ce ÷ R)**

where t_ch is the tool change time, Ce the cost per edge and R the machine rate per minute. The bracket is sometimes called the equivalent tooling-cost time, because it converts the tool's cost into minutes of machine time. Machinery's Handbook presents the same model.

For Harbourline:

- t_ch + Ce ÷ R = 2.0 + 6.00 ÷ 2.50 = 4.4 min
- T_E = (1 ÷ 0.218 − 1) × 4.4 = 3.59 × 4.4 = **15.8 min**
- Minimum-cost speed: V_E = C ÷ T_E^n = 446.8 ÷ 15.8^0.218 = **245 m/min**

```figure
type: formula
title: Minimum-cost and maximum-output tool life
formula: T_E = (1 ÷ n − 1) × (t_ch + Ce ÷ R)
formula: T_P = (1 ÷ n − 1) × t_ch
caption: The equivalent tooling-cost time converts the tool's price into minutes of machine time.
- t_ch | tool change time, 2.0 min
- Ce ÷ R | A$6.00 per edge ÷ A$2.50 per min = 2.4 min
- n | 0.218, so 1 ÷ n − 1 = 3.59
step: T_E = 3.59 × 4.4 = 15.8 min → V_E = 446.8 ÷ 15.8^0.218 = 245 m/min
step: T_P = 3.59 × 2.0 = 7.2 min → V_P = 291 m/min
```

## The maximum-output speed

If the aim is the most parts per hour, tool cost drops out and only tool change time matters:

**T_P = (1 ÷ n − 1) × t_ch**

- T_P = 3.59 × 2.0 = **7.2 min**
- Maximum-output speed: V_P = 446.8 ÷ 7.2^0.218 = **291 m/min**

The maximum-output tool life is always shorter than the minimum-cost tool life, so the maximum-output speed is always higher. Between the two lies a range in which a shop trades a little cost for a little output.

## What moves the optimum

The minimum-cost formula shows which inputs push the best speed up or down. Holding Taylor's constants at n = 0.218 and C = 446.8 and the machine rate at A$2.50 per minute:

```figure
type: compare
title: How the minimum-cost speed responds to tooling choices
cols: Minimum-cost tool life | Minimum-cost speed
caption: Faster tool changes and cheaper edges push the best speed up; dearer edges pull it down.
- Baseline: 2.0 min change, A$6 per edge | 15.8 min | 245 m/min
- Tool change cut to 1.0 min | 12.2 min | 259 m/min
- *Tool change cut to 0.5 min | 10.4 min | 268 m/min
- Edge cost doubled to A$12 | 24.4 min | 223 m/min
```

Cheaper or quicker tool changes make it worthwhile to run faster and use edges up sooner, because each change costs less. Expensive edges make it worthwhile to run slower and make each edge last. The machine rate enters through the term Ce ÷ R: a higher machine rate makes the tool's price smaller relative to machine time, which also pushes the optimum speed up. This is why a shop with expensive machines and cheap inserts tends to run hard, while a shop using costly special tools on inexpensive machines tends to run gently.

## The optimum is flat

The most practical lesson from the table is how flat the cost curve is near its minimum. Running at 260 m/min instead of 245 costs about 5 cents more per part. Even the traditional 200 m/min costs only 50 cents, about 4%, more than the optimum. Most of the benefit comes from avoiding speeds that are far too low or far too high, not from hitting the exact optimum.

```figure
type: stack
title: What a shaft costs at 200 m/min
unit: A$
caption: Cutting time dominates; tools and tool changes are under 7% of the total at this speed.
- Cutting time, 3.0 min | 7.50
- Non-cutting time, 1.5 min | 3.75
- Tools and tool changes | 0.83
```

That flatness matters because the inputs are uncertain. Tool life scatters, the machine rate is an estimate and the Taylor constants come from limited tests. A speed somewhat below the calculated optimum is often chosen deliberately: it gives longer, more predictable tool life, fewer interventions and less risk of an edge failing near the end of an unattended run, at almost no cost.

## Tool change time is worth attacking

The tool change term appears in both optimum formulas, and in the cost per part directly. Reducing it helps twice: it lowers the cost of each change and allows a faster optimum speed. On a lathe, indexing an insert in a well-designed holder and confirming the offset may take under a minute; on a machine where the operator must measure, adjust and test-cut after each change, it may take several.

Practical reductions include quick-change toolholders that return to a repeatable position, tools preset to length and diameter away from the machine, sister tools that the control switches to automatically when one edge reaches its planned life, and offset-setting probes. For long-running jobs, the savings repeat on every edge, which is why tooling systems that look expensive per holder often pay back quickly.

## When the machine is the bottleneck

The model above values machine time at its cost rate. If the machine is a bottleneck, and every extra part it produces can be sold, an hour of its time is worth more than its cost: it is worth the contribution of the extra parts it could make. In that case the effective rate R is higher, the equivalent tooling-cost time falls, and the optimum speed moves towards the maximum-output speed.

Conversely, if the machine has spare capacity, speeding up saves no real money beyond the variable costs of running it, and a lower speed with longer tool life is economically sensible. The right speed therefore depends on the state of the shop, not only on the tool and material. The READOS chapter on [measuring productivity and equipment effectiveness](/reados/collections/lean-and-continuous-improvement/measuring-productivity-and-equipment-effectiveness/) discusses identifying bottlenecks.

```figure
type: balance
title: Where to set the speed depends on the shop
left: Machine is the bottleneck
right: Machine has spare capacity
caption: Valuing machine time at the contribution of the extra parts moves the optimum towards the maximum-output speed.
- Value time above the cost rate | Value time at its variable cost
- Move towards V_P, 291 m/min | Stay near or below V_E, 245 m/min
- Accept more tool changes | Prefer long, predictable tool life
```

## The biggest lever may not be speed

In the shaft example, non-cutting time costs A$3.75 per part at every speed, about a third of the total, and it does not change at all as cutting speed varies. Even at the minimum-cost speed, the cutting and tooling costs together are only about A$7.83 of the A$11.58 total.

That puts the speed optimisation in perspective. Moving from 200 to 245 m/min saves about 50 cents a part. Cutting the non-cutting time from 1.5 to 1.0 minutes, by faster loading, fewer tool changes or shorter rapid moves, would save A$1.25 a part at any speed. Chapter 10 shows how to break down where that non-cutting time goes. Speed optimisation is worth doing for long-running jobs, but it should come after, not instead of, a look at everything else that happens in the cycle.

## Applying the model to small jobs

On the Harbourline flange, each tool cuts for less than a minute and a half per part, and tooling is a small share of the cost, as Chapter 11 shows. The cost difference between reasonable speeds is a few cents per part. For short jobs like this, the most valuable use of the economic model is to avoid gross errors and to check that tool changes will not interrupt a batch at an awkward point. For long-running parts with significant cutting time, like the shaft family, the model can justify measurable savings.

## Assumptions behind the model

The model assumes:

- feed and depth of cut are fixed while speed changes;
- Taylor's equation describes tool life over the range considered;
- the machine rate is a fair measure of the value of machine time;
- tool changes happen at the end of tool life, not earlier for convenience; and
- quality is unaffected by speed within the range.

Each assumption can be relaxed in a more detailed model, but the simple version captures the main trade-off.

## Common mistakes

- **Optimising speed before feed and depth.** Chapter 8 showed those are cheaper levers.
- **Ignoring tool change time.** It is often a larger cost than the insert itself.
- **Using the customer price as the machine rate.**
- **Chasing the exact optimum** when the curve is flat and the inputs are uncertain.
- **Using the same optimum for bottleneck and non-bottleneck machines.**

## Questions to ask

- What does an hour on this machine really cost, and is the machine a bottleneck?
- What are the tool change time and the cost per edge, including holder and offset checking?
- How reliable are the tool-life data, and over what range of speeds?
- Would a slightly lower speed give more predictable tool life at negligible extra cost?

## Exercise: find your optimum

Using the Taylor constants from the previous chapter's exercise, your machine rate, tool change time and cost per edge, calculate the minimum-cost and maximum-output tool lives and speeds. Build a table like the one in this chapter for five speeds and see how flat the cost curve is for your job.

The next chapter assembles cutting times, non-cutting times and allowances into a full cycle-time estimate for the Harbourline flange.
