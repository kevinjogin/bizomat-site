---
title: "Modelling bills of materials and other hierarchies: structures, where-used questions and revisions in business systems"
description: "Bills of materials, asset registers, locations and cost centres are hierarchies. How systems store them, explode and trace them, handle revisions and avoid the common errors."
publishDate: 2026-10-09
category: "Manufacturing"
tags:
  - manufacturing
  - systems
  - design
author: "KEVOS®"
featured: false
draft: false
---

A manufactured product is a hierarchy. A trailer contains a chassis, axles, a body and wiring; an axle contains a beam, hubs, bearings and brakes; a hub contains a casting, studs and seals. The list of what goes into what, and how many, is the **bill of materials**, usually shortened to BOM. It drives purchasing, production planning, costing, assembly instructions, spare parts and recalls. When it is wrong, the business orders the wrong quantities, builds the wrong revision or cannot tell which products contain a faulty component.

Businesses manage many other hierarchies too: sites, buildings and rooms; plants, production lines, machines and components in a maintenance system; divisions, departments and cost centres; product families and categories; and charts of accounts. Each raises the same design questions: how to store the structure, how to add up quantities or costs through its levels, how to find everything above or below a given point, and how to handle changes over time.

This article explains how bills of materials are structured, the different kinds of BOM used through a product's life, how business systems store and calculate hierarchies, how revisions and effectivity work, how the same ideas apply to other hierarchies and which errors cause the most trouble. It is general information for manufacturing, engineering and operations managers and for anyone specifying systems that hold structured product data.

## What a bill of materials contains

At its simplest, a BOM lists the components needed to make one unit of a parent item. Each **BOM line** typically records:

- **Parent item**: the assembly being made.
- **Component item**: the part, material or sub-assembly used.
- **Quantity per parent**: how many of the component one parent needs.
- **Unit of measure**: each, metres, kilograms, litres and so on.
- **Scrap or yield allowance**: extra quantity to allow for losses.
- **Position or reference**: where the component goes, such as a reference designator on a circuit board or a find number on a drawing.
- **Effectivity**: when or for which units the line applies.

A **single-level BOM** shows only the direct components of one parent. A **multi-level** or **indented BOM** shows the whole structure, with each sub-assembly expanded into its own components, level by level.

## Different kinds of BOM

A product often has several related BOMs, each serving a different purpose:

| Kind | Purpose | Typical owner |
|---|---|---|
| Engineering BOM | Describes the product as designed, usually reflecting the CAD assembly structure | Engineering |
| Manufacturing BOM | Describes how the product is built, including consumables, packaging and process-related groupings | Manufacturing or production engineering |
| Service BOM | Describes replaceable parts and kits for maintenance and repair | Service or aftermarket |
| Sales or configurable BOM | Describes options customers can choose and the rules that combine them | Sales and product management |
| Costed BOM | Adds costs to each line for product costing | Finance |

The engineering and manufacturing BOMs often differ for good reasons. Engineering may group parts by function, while manufacturing groups them by assembly station, adds adhesives and labels that appear only as notes on drawings, and introduces intermediate assemblies that exist only on the shop floor. Problems arise when the differences are uncontrolled and the two drift apart. The [from approved design to first production](/insights/from-approved-design-to-first-production/) article discusses how designs are released into production.

## How systems store a BOM

In a database, a BOM is usually stored in two tables:

- An **item table** holding every part, material and assembly, each with its own item number, description and unit of measure.
- A **BOM line table** holding the relationships, each row linking one parent item to one component item with a quantity and other details.

Because the same component can be used in many parents, and each parent has many components, the structure is a network rather than a simple tree. A standard fastener might appear in hundreds of assemblies. Storing each relationship once, rather than copying sub-assemblies into every product, means a change to a sub-assembly applies everywhere it is used.

Storing a BOM as an indented list in a spreadsheet, where structure is shown by indentation or level numbers, works for viewing but is fragile for managing: copies of sub-assemblies drift apart and changes must be repeated in every copy.

## Exploding and imploding

Two operations are fundamental:

- **Explosion** works downward from a product to find all its components at every level, multiplying quantities through the levels. It drives material requirements planning, costing and picking lists.
- **Implosion**, usually called a **where-used** query, works upward from a component to find every assembly and product that contains it. It drives engineering change impact analysis, supplier problem investigations and recalls.

### Multiplying quantities through levels

Quantities multiply down the structure. Consider a bicycle:

| Level | Item | Quantity per parent | Quantity per bicycle |
|---|---|---|---|
| 0 | Bicycle | 1 | 1 |
| 1 | Wheel assembly | 2 | 2 |
| 2 | Spoke | 32 per wheel | 64 |
| 2 | Rim | 1 per wheel | 2 |
| 1 | Frame | 1 | 1 |

To build 50 bicycles, the business needs 100 wheel assemblies and 3,200 spokes. Scrap allowances multiply too: a 5% allowance on spokes increases the requirement to 3,360.

### Recursive queries

Because BOMs have an unknown number of levels, systems use **recursive** processing: find the components of the product, then the components of those components, and so on until no more are found. Relational databases support this through recursive queries, part of the SQL standard since 1999. Graph databases are another option for very large or complex structures.

Systems must also prevent **cycles**, where an item directly or indirectly contains itself. A cycle, usually created by a data entry error, can make explosions run endlessly or produce nonsense.

### Rolling up costs

Costs flow upward through the same structure. A **cost roll-up** starts with the purchase cost of bought components and materials, adds the labour and overhead of each assembly operation, and accumulates the totals level by level until it reaches the finished product. If a wheel assembly's components cost $38 and assembling it adds $12 of labour and overhead, each wheel costs $50, and two wheels contribute $100 to the bicycle before frame, finishing and final assembly are added.

Because costs accumulate through the structure, an error at a low level, such as a wrong quantity or unit of measure on a common component, distorts the cost of every product above it. When a supplier raises a price, a where-used query combined with a cost roll-up shows the effect on each product's margin, which helps decide where prices need review.

## Revisions and effectivity

Products change. A component is replaced, a quantity changes or a sub-assembly is redesigned. Systems manage this through **revisions** and **effectivity**:

- **Revision control** identifies each version of an item or BOM, such as revision B or C, and keeps earlier revisions for reference.
- **Date effectivity** states that a BOM line applies from or until a particular date. Production orders started on or after the date use the new structure.
- **Serial or lot effectivity** states that a change applies from a particular serial number or batch onward, which suits products where exact build configuration matters.

Effectivity allows planned changes, such as using up old stock before a new part takes over, and preserves the ability to answer which configuration was built when. Production records should capture the revision and structure actually used. The [issue, change and configuration control](/insights/issue-change-and-configuration-control/) article explains the wider discipline of controlling changes to a baseline.

## Phantoms, kits and options

Several special structures are common:

- **Phantom assemblies** group components for engineering or planning convenience but are never stocked as separate items; when exploded, their components are passed straight to the parent.
- **Kits** group parts that are picked and issued together, such as a fastener kit for a sub-assembly.
- **Configurable products** use option rules, such as "if the customer chooses the long chassis, use axle set A", to generate a specific BOM for each order.
- **Alternates** allow approved substitute components when the preferred one is unavailable.

Each needs clear rules in the system, or planners and storepersons will work around it.

## Other hierarchies in business systems

The same structural questions arise elsewhere:

| Hierarchy | Example levels | Common uses |
|---|---|---|
| Locations | Site, building, area, room, rack | Asset tracking, maintenance, stock location |
| Assets | Plant, line, machine, sub-system, component | Maintenance planning, failure analysis, spare parts |
| Organisation | Company, division, department, team | Reporting, approvals, access control |
| Cost centres and accounts | Groups and sub-groups of accounts | Financial reporting and budgeting |
| Product categories | Family, range, model, variant | Sales reporting, websites, pricing |

### Ways to store a hierarchy

Developers use several standard designs, each with trade-offs:

- **Parent reference**: each record stores its parent, the simplest design and easy to change, with recursive queries for multi-level questions.
- **Path**: each record stores its full path, such as "Site 1 / Building B / Room 4", which makes subtree queries easy but makes moving branches harder.
- **Closure table**: a separate table lists every ancestor and descendant pair, which makes multi-level queries fast at the cost of more storage and maintenance.

For BOMs, where components can have many parents, a linking table of parent and component pairs is the norm.

### Hierarchies change over time

Organisations restructure, product categories are reorganised and assets move. If reports must compare periods, the system needs to record which hierarchy applied when, or historical reports will change every time the structure does.

## Integration with CAD and product data systems

In many businesses, the engineering BOM originates in CAD assemblies managed in a product data management system. Transferring it to the business system automatically, rather than retyping it, reduces errors, but the transfer must respect differences between design and manufacturing structures. Part numbers, units of measure and revisions must match on both sides. The [design intent in parametric CAD and large assemblies](/insights/design-intent-in-parametric-cad-and-large-assemblies/) article discusses how assembly structures are organised in CAD.

## Common errors and their effects

| Error | Effect |
|---|---|
| Wrong unit of measure on a BOM line | Orders and issues out by large factors, such as boxes instead of single items |
| Duplicate sub-assemblies under different numbers | Changes applied to one copy but not the other |
| Missing consumables and packaging | Shortages on the line and understated costs |
| Engineering and manufacturing BOMs out of step | Wrong parts built into products |
| No effectivity on changes | Old stock scrapped unnecessarily, or new parts used too early |
| Cycles | Planning runs fail or produce nonsense |
| BOMs held in spreadsheets | Uncontrolled copies and no where-used capability |

## A worked example

This is an illustrative example. A manufacturer of agricultural trailers builds about 400 trailers a year across 12 models. Its BOMs, with about 600 distinct items and up to four levels, are held partly in the business system and partly in spreadsheets.

**Problem one: where-used.** A bearing supplier warns of a possible defect in one batch. The business needs to know which trailer models and sub-assemblies use that bearing. With BOMs partly in spreadsheets, the search takes two engineers most of a day and misses one model where the bearing appears inside a hub sub-assembly copied into a spreadsheet under a different number.

**Problem two: units of measure.** Planners notice that a bolt is being ordered in quantities 100 times too large. The BOM line records the quantity in individual bolts, but the item is stocked and purchased in boxes of 100, and no conversion has been defined.

**Changes.** All BOMs are moved into the business system with one record for each sub-assembly, used wherever it appears. Units of measure and conversions are checked for every item. Engineering changes now carry effectivity dates, and a where-used report is added to the change process.

**Result.** The next where-used query takes seconds and finds every use. Material requirements become reliable, and the purchasing error with bolts disappears. When the hub sub-assembly is later redesigned, the change applies automatically to all 12 models from the effective date.

## Applying this in an Australian business

- **Hold BOMs in a controlled system**, not spreadsheets, with each sub-assembly stored once.
- **Check units of measure and conversions** for every item.
- **Distinguish engineering and manufacturing BOMs**, and control how they differ.
- **Use effectivity** for changes and record what was actually built.
- **Make where-used queries routine** in engineering change and supplier quality processes.
- **Prevent cycles** and validate BOMs before release.
- **Record hierarchy changes over time** where reports compare periods.

## Questions worth considering

- How long would it take us to find every product containing a particular component?
- Are any of our BOMs or sub-assemblies held in spreadsheets?
- Do our engineering and manufacturing BOMs agree, and who checks?
- How do we control when a design change takes effect?
- Which other hierarchies, such as assets or cost centres, cause reporting problems when they change?

## Bringing it together

Bills of materials and other hierarchies are central to manufacturing and operations systems. Store each relationship once, using item and BOM line tables; explode structures for planning and costing; use where-used queries for change and supplier problems; control revisions with effectivity; and manage phantoms, kits, options and alternates with clear rules. The same principles apply to locations, assets, organisations and categories. Reliable hierarchies make planning, costing, maintenance and recalls faster and more accurate.

---

*Source: KEVOS® editorial notes, drawing on general manufacturing systems, product data management and database design practice. The worked example is illustrative. This article is general information.*
