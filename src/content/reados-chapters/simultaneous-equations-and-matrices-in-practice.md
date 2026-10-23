---
title: "Simultaneous equations and matrices in practice: blending, product mix, structures and circuits"
description: "How pairs and systems of equations solve blending, product-mix, structural and circuit problems, how matrices and spreadsheets handle larger systems, and how to spot unreliable solutions."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - process-improvement
  - operations
  - design
author: "KEVOS"
featured: false
draft: false
---

Many practical problems involve several unknowns linked by several conditions at once. A blend must reach a target quantity and a target composition, so the amounts of two ingredients must satisfy two requirements together. A factory making two products must fit both within the hours available on two different resources. The forces in a simple truss must balance at every joint. The currents in an electrical circuit must satisfy the laws that govern every junction and loop. Each of these is a set of **simultaneous equations**: equations that must all be true at the same time.

Small systems can be solved by hand in a few lines; larger ones are written as **matrices** and solved by spreadsheets or software. Either way, the ideas are the same, and understanding them helps interpret results, recognise when a problem has no unique answer and notice when an answer is unreliable because small changes in the data would change it dramatically. Linear programming, which finds the best solution among many that satisfy a set of limits, builds directly on the same foundations and is available in common spreadsheet tools.

This article explains how to set up and solve simultaneous equations, what their solutions mean graphically, how they apply to blending, product mix, structures and circuits, how matrices and spreadsheets solve larger systems, and the warning signs of unreliable or impossible solutions.

## Setting up the equations

The first step is to name the unknowns and write one equation for each condition. For a blend of two materials, with x kilograms of the first and y kilograms of the second:

- the total quantity condition: x + y = total required;
- the composition condition: (fraction in first) × x + (fraction in second) × y = amount of the component required.

Two unknowns need two independent conditions; three unknowns need three; and so on. Writing units beside each equation helps ensure each condition is expressed consistently.

## Solving by substitution

Rearrange one equation to express one unknown in terms of the other, then substitute into the second equation. From x + y = 1,000, x = 1,000 − y. Substituting into the second equation leaves a single equation in y, which can be solved directly, and x follows.

## Solving by elimination

Multiply one or both equations by constants so that one unknown has the same coefficient in both, then subtract to eliminate it. Elimination is often quicker when the coefficients are awkward, and it extends naturally to larger systems.

## What the solution means graphically

Each linear equation with two unknowns describes a straight line on a chart of y against x. The solution is the point where the lines cross. This view explains the three possible outcomes:

- **One solution**: the lines cross at a single point.
- **No solution**: the lines are parallel and never meet, meaning the conditions contradict each other.
- **Infinitely many solutions**: the lines coincide, meaning the equations are not independent and do not determine a unique answer.

Recognising these cases prevents wasted effort and points to problems in how the conditions were set up.

## Blending and mixing

Blending problems arise in food production, chemicals, concrete, fuels, animal feed and many other industries. The same method finds how much of each input to use to hit a target quantity and specification, and, with a third condition, can handle a third input. Real blending also involves tolerances, costs and limits on availability, which lead naturally to linear programming.

## Product mix and linear programming

A business making several products with shared, limited resources must decide how much of each to make. Each resource gives an inequality: the hours used must not exceed the hours available. The feasible combinations form a region bounded by these lines, and the most profitable mix lies at a corner of that region, typically where two constraints are both fully used. Finding that corner means solving the two constraint equations simultaneously.

**Linear programming** automates the search for the best corner when there are many products and constraints. Spreadsheet solver tools can maximise contribution or minimise cost subject to limits on hours, materials, demand and other factors. The results show which constraints are binding and how much extra capacity on each would be worth, which links directly to the idea of bottlenecks described in the [lean, six sigma or theory of constraints](/reados/collections/lean-and-continuous-improvement/lean-six-sigma-or-theory-of-constraints/) article.

## Allocating costs between service departments

Businesses with internal service departments, such as maintenance and IT, sometimes need to allocate their costs to production. When the service departments also serve each other, maintenance repairing IT equipment and IT supporting maintenance's systems, a simple one-step allocation ignores part of the work. The **reciprocal method** writes one equation for each service department: its total cost equals its own costs plus its share of the other department's total. Solving the equations simultaneously gives totals that can then be allocated fairly to production departments. The same structure appears whenever activities serve each other, such as utilities supporting several plants that also supply each other.

## Shadow prices: what extra capacity is worth

Linear programming results usually include a **shadow price** for each constraint: the increase in contribution if one more unit of that resource were available, within a certain range. A binding machining constraint with a shadow price of $15 per hour says that an extra hour of machining would add about $15 of contribution, which sets a ceiling on what overtime or subcontracting for that resource is worth. Constraints that are not binding have a shadow price of zero: extra capacity there adds nothing until the mix changes. Shadow prices turn the output of a solver into practical guidance on where to invest.

## Whole numbers and scheduling

Some decisions must be whole numbers: machines bought, trucks dispatched, shifts worked or batches run. Ordinary linear programming may return fractional answers, such as 2.6 trucks. **Integer programming** handles these cases, and spreadsheet solvers include integer options, although such problems can take longer to solve. Rounding a fractional answer is sometimes acceptable, but it can break constraints or miss the best solution, so the rounded answer should be checked against every condition.

## Structures: forces at joints

In a simple pin-jointed truss, each joint must be in equilibrium: the horizontal and vertical forces from the members and loads meeting there must balance. Writing these conditions for every joint produces a system of simultaneous equations whose unknowns are the forces in the members. Small trusses can be solved by hand, joint by joint; larger frames are solved by structural analysis software, which builds and solves large matrix systems. Understanding the method helps engineers check software results with simple hand calculations at critical joints.

## Circuits

In electrical circuits, Kirchhoff's laws state that the currents entering any junction sum to the currents leaving it, and that the voltages around any closed loop sum to zero. For a circuit with several loops, these laws give simultaneous equations in the unknown currents. The same structure appears in pipe networks, where flows balance at junctions and pressure drops balance around loops, and in heat flow through layered materials.

## Matrices: compact notation for larger systems

A system of linear equations can be written in matrix form:

A × x = b

where A is a matrix of the coefficients, x a column of unknowns and b a column of right-hand-side values. For two equations, A is a 2 × 2 table of numbers. The solution is x = A⁻¹ × b, where A⁻¹ is the inverse of A, when it exists.

Spreadsheets provide matrix functions, such as MINVERSE and MMULT, to solve modest systems directly, and engineering and analysis software solves very large systems efficiently. Writing the system in matrix form also makes its structure visible: which unknowns appear in which equations.

## The determinant and singular systems

A square matrix has a number called its **determinant**. If the determinant is zero, the matrix has no inverse and the system has either no solution or infinitely many: the "parallel lines" or "same line" cases. In practice, a zero or near-zero determinant often means that two conditions are really the same condition expressed twice, or that a structure or circuit has been modelled with a missing support or connection.

## Ill-conditioned systems

Some systems have a unique solution that is nonetheless unreliable. When the lines cross at a very shallow angle, a tiny change in the data moves the intersection a long way. Such systems are called **ill-conditioned**. For example, the equations x + y = 2 and x + 1.001y = 2.001 have the solution x = 1, y = 1, but changing the second right-hand side from 2.001 to 2.002 changes the solution to x = 0, y = 2. If the input data are measurements or estimates with any uncertainty, the solution of an ill-conditioned system should not be trusted without further investigation.

## More equations than unknowns

When there are more conditions than unknowns, as when fitting a line to many data points, the equations usually cannot all be satisfied exactly. The **least squares** method finds the solution that comes closest, minimising the sum of squared errors. This is how trend lines and calibration curves are fitted, and spreadsheet functions such as LINEST solve these over-determined systems automatically.

## Transformations in CAD and robotics

Matrices also describe geometric transformations: rotating, scaling and moving shapes. CAD systems, CNC controls, robots and computer graphics use transformation matrices constantly to convert between coordinate systems, such as a part's coordinates and a machine's. Errors in transformations show up as rotated, mirrored or offset features, so understanding which coordinate system is in use, and checking a known point after a transformation, catches most mistakes.

## Checking solutions

Solutions should always be checked by substituting them back into every original equation. Other useful checks include confirming that quantities that must be positive, such as amounts of ingredients, are positive; that results have sensible magnitudes; and that small changes to the inputs produce small changes in the answer.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A food manufacturer needs 1,000 kg of a mixture containing 45% solids, blended from two available inputs: one with 30% solids costing $2 per kg and one with 60% solids costing $3 per kg. With x kg of the first and y kg of the second:

x + y = 1,000
0.30x + 0.60y = 450

Substituting x = 1,000 − y gives 300 − 0.30y + 0.60y = 450, so y = 500 and x = 500. The blend costs 500 × $2 + 500 × $3 = $2,500.

```figure
type: steps
title: Blending to 45% solids
caption: 1,000 kg from inputs at 30% ($2 a kg) and 60% ($3 a kg): the blend costs $2,500.
- x + y = 1,000 | total mass
- 0.30x + 0.60y = 450 | solids
- Substitute x = 1,000 − y | 300 + 0.30y = 450
- *y = 500, x = 500
```

In the same week, the manufacturer's sister workshop plans its product mix. Product A contributes $40 a unit and needs 2 hours of machining and 1 hour of assembly. Product B contributes $30 and needs 1 hour of machining and 2 hours of assembly. The workshop has 100 machining hours and 80 assembly hours. Checking the corners of the feasible region: making only A (50 units) contributes $2,000; making only B (40 units) contributes $1,200; and making the mix where both constraints are fully used, found by solving 2A + B = 100 and A + 2B = 80, gives A = 40 and B = 20, contributing $2,200. The spreadsheet solver confirms the result and shows that both resources are binding, so extra hours on either would increase contribution.

```figure
type: bars
title: Contribution at each corner of the feasible region
unit: $
max: 2400
caption: 100 machining and 80 assembly hours; the best mix uses both constraints fully: 2A + B = 100 and A + 2B = 80.
- Only A: 50 units | 2000
- Only B: 40 units | 1200
- *40 A and 20 B | 2200
```

## How this applies to a small Australian business

- **Name unknowns and write one equation per condition**, with units.
- **Check solutions by substitution** into every equation.
- **Use solver tools** for product mix and blending with many constraints.
- **Watch for zero determinants**, which signal duplicate or missing conditions.
- **Test sensitivity** when inputs are uncertain.
- **Read shadow prices** to judge what extra capacity is worth.
- **Check rounded answers** against every constraint.
- **Check software results** against simple hand calculations where possible.

## Common mistakes

- **Writing two equations that express the same condition.**
- **Accepting negative quantities** in blends or product mixes.
- **Trusting ill-conditioned results** built on uncertain data.
- **Mixing units** between equations.
- **Choosing a product mix by contribution per unit alone**, ignoring the constraints.
- **Not checking which coordinate system** a transformation uses.

## Frequently asked questions

**Why is the best product mix at a corner?** Because contribution changes steadily as the mix moves across the feasible region, so it is highest at one of the region's corners, where constraints meet.

**What does it mean when a solver reports no feasible solution?** The constraints contradict each other, such as demand commitments that exceed available capacity. Review the constraints for errors or conflicting requirements.

**Do spreadsheets solve large systems reliably?** For moderate sizes, yes. For very large or ill-conditioned systems, specialised software and careful checking are needed.

## Questions to ask

- Which of our decisions involve several conditions that must be met at once?
- Do we use solver tools for product mix, blending or scheduling problems?
- How sensitive are our solutions to errors in the input data?
- Do we check software results with simple hand calculations?
- What would an extra hour on our bottleneck resource be worth?
- Which of our resources are binding constraints on output?

## Bringing it together

Simultaneous equations describe problems where several conditions must hold together: blends, product mixes, structures, circuits and networks. Substitution and elimination solve small systems; matrices and spreadsheet tools solve larger ones; linear programming finds the best corner among many feasible options. Graphical thinking explains why systems can have one, none or infinitely many solutions, determinants flag singular systems and ill-conditioning warns when answers cannot be trusted. Checking every solution by substitution, and testing its sensitivity, keeps the results useful. The [throughput is not wealth](/reados/collections/pricing-margins-and-profitability/throughput-is-not-wealth/) article explores how constraints shape profitable production decisions.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
