---
title: "Engineering the system: what containerisation and the critical path method teach about interfaces and dependencies"
description: "A steel box and a scheduling algorithm changed the economy without new physics. How containerisation and the critical path method developed, and their lessons on interfaces and bottlenecks."
publishDate: 2026-10-09
category: "Ideas"
tags:
  - systems
  - operations
  - projects
author: "BIZOMAT"
featured: false
draft: false
---

Some of the most valuable innovations of the twentieth century involved no new scientific discovery at all. In 1956, a trucking businessman shipped cargo in standard steel boxes on the deck of a converted tanker. Within a year or two, engineers at a chemical company and managers in a naval missile program developed methods for calculating which project activities determine completion and how long a project is likely to take. A steel box and a scheduling algorithm went on to reshape world trade and the way large projects are managed.

What these innovations changed was the structure of systems: how the parts connect, where work is handed over and how dependencies are understood. Containerisation standardised the interface between ships, trucks, trains and cranes. The critical path method made dependencies between activities visible and calculable. Their histories offer practical lessons for any business that moves goods, manages projects or tries to improve a system made of many connected parts.

This article explains how containerisation and the critical path method developed, what made them work, the consequences they brought, including for workers, and the lessons they offer about interfaces, standards, bottlenecks, dependencies and the limits of tools. It is general information for operations managers, project managers, engineers and business leaders.

## Cargo before containers

Before containerisation, general cargo was handled piece by piece. Sacks, crates, barrels and bundles were carried into warehouses, sorted, carried to the ship and stowed individually by gangs of waterside workers. A ship might spend as long in port as at sea. Handling was the largest cost of shipping, the main source of damage and theft, and a major source of injury.

## The container: standardising the boundary

**Malcom McLean**, an American trucking operator, saw that if the body of a truck trailer could be lifted off its wheels and placed directly on a ship, the goods inside would not need to be handled between the shipper and the receiver. In 1956, the converted tanker Ideal X carried containers on its deck from New Jersey to Texas. The cargo did not change; the number of times it was touched did.

The harder part was not the box but the **standard**. A container is only useful if ships, cranes, trucks, rail wagons and terminals everywhere can handle it. That required agreement on dimensions, the corner fittings that lifting equipment grips and stacking and load ratings. International standards, such as ISO 668 for container dimensions and ratings, emerged through the 1960s after contested negotiations between companies and countries with different preferences. The value of the system grew as adoption converged on common sizes, the 20-foot and 40-foot containers, now measured in twenty-foot equivalent units.

## The whole chain had to change

Containerisation demanded new equipment and infrastructure throughout the logistics chain:

- **Purpose-built container ships** with cell guides holding stacks of containers.
- **Gantry cranes** at terminals.
- **Large paved yards** for storing and sorting containers.
- **Road and rail connections** designed for containers.
- **New documentation and inspection systems**, because sealed boxes could not be easily opened at every stage.

Ports that invested in container terminals gained traffic; ports that could not adapt lost it. In Australia, containerisation reached the waterfront in the 1960s and transformed port operations and employment over the following decades.

## Consequences: bottlenecks, opacity and people

### The bottleneck moved

Containers dramatically shortened the time ships spent in port. The constraint then moved to terminal yards, then to the roads and railways serving ports. Removing one bottleneck does not remove constraints; it moves them, often to parts of the system that someone else controls.

### Contents became harder to see

Sealed containers are efficient precisely because they are not opened. Customs, biosecurity and security regimes had to shift from physical inspection of cargo to documentation, risk profiling and scanning. In Australia, biosecurity and border agencies rely heavily on documentation and risk targeting for container imports.

### Work changed sharply

The number of waterside workers needed fell dramatically, and the remaining work changed character. The transition was contested and difficult for workers and communities, and any honest account of containerisation includes that cost.

### Trade became cheaper

Lower handling costs and faster, more reliable shipping helped make global supply chains practical, changing where goods were made and how businesses sourced materials and components. The [importing goods for small businesses](/reados/collections/operational-data-records-and-controls/importing-goods-for-small-businesses/) article covers how businesses use these supply chains today.

## The container principle elsewhere

The idea of a standard unit that moves through a system untouched appears in many industries:

- **Pallets**: standard pallet sizes allow goods to move between suppliers, trucks, warehouses and racks without repacking. Australia's standard pallet, about 1,165 millimetres square, was sized to suit local rail wagons and differs from European and American pallets, which matters for importers and exporters.
- **Modular construction**: building elements made in factories to standard dimensions and connections are transported and assembled on site.
- **Electronic data interchange**: standard formats for orders, invoices and shipping notices let business systems exchange information without re-keying, the data equivalent of a container.
- **Software containers**: the term used for packaged software that runs consistently on different computers deliberately echoes the shipping container.

In each case, the value lies in agreeing the interface so that the contents can travel without being handled.

## The critical path method: making dependencies calculable

Before the late 1950s, project scheduling relied mainly on bar charts, introduced by Henry Gantt in the 1910s. A bar chart shows when each activity is planned, but it does not record why activities happen in that order. If one slips, the chart cannot show what else moves, because the dependencies exist only in the planner's head.

In 1957, engineers at the chemical company DuPont, working with the computer company Remington Rand, developed the **critical path method** to plan plant maintenance shutdowns more effectively. A project is represented as a network of activities with durations and explicit dependencies. From that network, a planner can calculate:

- The **earliest** each activity can start.
- The **latest** it can start without delaying the project.
- The **float**, or spare time, between them.
- The **critical path**: the sequence of activities with no float, which determines the project's duration.

```figure
type: steps
title: What a critical path network calculates
caption: Unlike a bar chart, the network records why activities happen in that order, so a slip shows what else moves.
- Earliest start | for each activity
- Latest start | without delaying the project
- Float | the spare time between them
- *Critical path | the activities with no float
```

At about the same time, the United States Navy developed the **Program Evaluation and Review Technique (PERT)** for its Polaris missile program, which involved thousands of contractors. PERT used three estimates for each activity, optimistic, most likely and pessimistic, recognising that durations are uncertain. Its classic calculation tends to understate overall duration when several paths are nearly critical, because the project finishes only when the latest path finishes; modern tools use simulation across the whole network to address this. The [critical path scheduling explained](/reados/collections/project-planning-and-control/critical-path-scheduling-explained/) article covers how to build and use a critical path schedule today.

These methods spread through construction, engineering and defence, and helped establish project management as a discipline, with professional bodies and standards following in the decades after.

## What the method cannot do

A critical path calculation is only as good as the network and estimates it is given. It cannot tell whether a duration is optimistic, whether a dependency is missing, or whether two activities shown in parallel actually compete for the same crew or crane. A schedule that calculates correctly from untested assumptions produces confident, precise and wrong answers. The method's value lies in forcing people to state dependencies and estimates explicitly, so they can be examined and improved.

## Project management becomes a profession

The tools of the 1950s helped turn project management into a recognised discipline. Earlier milestones included Gantt's bar charts in the 1910s, project offices used to monitor aircraft production and the use of the title "project manager" on large engineering projects such as pipelines in the 1950s. After the critical path method and PERT, the discipline grew quickly:

- **Professional bodies** formed, including the Project Management Institute in the United States in 1969 and, in Australia, the organisation that became the Australian Institute of Project Management in the 1970s.
- **Bodies of knowledge and methods** followed, such as the Project Management Body of Knowledge first published as a full guide in 1996 and the PRINCE2 method released in the same year in the United Kingdom.
- **International standards**, such as ISO 21500 on project management guidance, were published from the 2010s.

The history explains why so many project tools exist: each was developed when a coordination problem became severe enough that existing methods broke down. Knowing the problem a tool was designed for helps in using it sensibly rather than ritually.

## Motorways: consistency from a single parameter

The 1950s also saw the first motorways in many countries, including Britain's first, a short bypass around Preston opened in 1958. A motorway is not simply a wide road. Its geometry, including sight distances, curve radii, lengths of merging lanes and clearances, is derived from one chosen value, the **design speed**, and conflict points are removed by separating crossing traffic onto bridges and interchanges.

```figure
type: timeline
title: Standardising boundaries and dependencies
caption: The container standardised the interface between organisations; the critical path made dependencies calculable.
- 1910s | Gantt's bar charts | when, but not why
- *1956 | Ideal X | containers from New Jersey to Texas
- 1957 | Critical path method | DuPont and Remington Rand
- 1958 | Preston bypass | Britain's first motorway
- 1960s | ISO container standards | after contested negotiations
- 1969 | Project Management Institute | a profession forms
```

Two lessons stand out. The first is **consistency**: drivers form expectations from the road, and hazards arise where a road suddenly breaks them, such as a sharp curve after a long straight. Designing every element to one consistent parameter keeps expectations valid. The second is **induced demand**: adding capacity to a congested corridor makes travel cheaper and attracts new trips, so congestion often returns. That is not an engineering failure but a predictable response to a change in price, and it means capacity should be judged against whole-network outcomes. Australian road design guidance is published by Austroads.

Both lessons apply beyond roads. Systems designed around a few consistent parameters are easier to use safely, and adding capacity to one part of a system changes behaviour across the whole of it.

## Lessons for operations and project leaders

### Standardise the interfaces

The container's power came from standardising the boundary between transport modes rather than the cargo inside. In businesses, many delays and errors happen at hand-offs between departments, suppliers and customers. Standard containers, labels, data formats, drawings and hand-over checklists can remove much of that friction.

### Value comes from adoption

An interface standard is valuable only when widely adopted. Competing variants reduce value for everyone. When choosing standards for packaging, data exchange or equipment, consider which are converging across your industry.

### Change the whole chain

Containers required ships, cranes, yards, trucks and paperwork to change together. Improvements that change only one link often move the problem rather than solve it.

### Expect the bottleneck to move

When a constraint is relieved, find the next one before it surprises you. The [lean warehousing and material flow](/reados/collections/lean-and-continuous-improvement/lean-warehousing-and-material-flow/) article covers managing flow through warehouses and handling systems.

### Make dependencies explicit

The critical path method's main contribution is making dependencies visible and calculable. Whether in projects or operations, writing down what depends on what is the first step to managing it.

### Respect the limits of tools

Schedules, simulations and dashboards are only as good as their inputs. Test assumptions, especially durations, dependencies and shared resources.

### Account for people

Systemic change can greatly reduce the work required in some roles. Planning for retraining, redeployment and fair transitions is part of implementing change responsibly.

## A worked example

This is an illustrative example. A manufacturer receives about 2,000 cartons of components a week from a major supplier. Each carton is opened, checked and repacked into the manufacturer's own plastic totes for its production line, taking about two minutes per carton, roughly 67 hours of work a week.

**Change.** Applying the container principle, the manufacturer agrees with the supplier to ship components directly in the manufacturer's standard returnable totes, labelled with an agreed barcode format. Empty totes return on the supplier's delivery truck. The supplier checks quantities before shipping, and the manufacturer moves to sample checks with supplier quality records.

**Result.** Repacking is eliminated. Managing tote returns and sample checks takes about 10 hours a week, so the net saving is about 57 hours a week. Damage from repeated handling falls, and the production line receives components ready to use. As with shipping containers, the gain came from standardising the interface between two organisations, and it required both to change their processes together.

```figure
type: bars
title: Receiving 2,000 cartons of components a week
unit: hours a week
max: 70
caption: A net saving of about 57 hours a week, from standardising the interface between two organisations.
- Opening, checking and repacking | 67
- *Returnable totes: returns and sample checks | 10
```

## Applying these lessons in an Australian business

- **Map the hand-offs** in your processes and supply chains.
- **Standardise interfaces**: packaging, labels, data and documents.
- **Change connected links together**, not one at a time.
- **Look for the next bottleneck** after each improvement.
- **Make project dependencies explicit** in a network schedule.
- **Test estimates and shared resources** behind schedules.
- **Plan for the effects on people** of systemic change.

## Questions worth considering

- Where do goods, information or work change hands, and how much effort is spent at each hand-off?
- Which interfaces could be standardised with suppliers or customers?
- If we relieve our current bottleneck, where will the constraint move?
- Are the dependencies in our projects written down, or only in people's heads?
- Which of our schedule assumptions have never been tested?

## Bringing it together

Containerisation and the critical path method changed the world economy and project delivery without new science. The container standardised the interface between transport modes, requiring the whole logistics chain to change and moving bottlenecks inland, while transforming waterfront work. The critical path method made project dependencies explicit and calculable, while remaining only as good as its inputs. Their lessons apply widely: standardise interfaces, value convergence, change connected parts together, anticipate moving bottlenecks, make dependencies visible, respect the limits of tools and account for the people affected.

---

*Source: BIZOMAT editorial notes, drawing on an earlier BIZOMAT engineering history series on containerisation, motorway networks and critical path scheduling, and on the history of project management, together with established histories of technology and logistics. The worked example is illustrative. This article is general information.*
