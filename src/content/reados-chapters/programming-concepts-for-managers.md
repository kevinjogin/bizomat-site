---
title: "Programming concepts for managers: variables, logic, functions, data structures and why software behaves as it does"
description: "The core ideas behind every program, explained without code: data and types, conditions, loops, functions, data structures, errors, edge cases, languages and technical debt."
publishDate: 2026-10-16
category: "Technology"
tags:
  - systems
  - automation
  - leadership
author: "KEVOS"
featured: false
draft: false
---

Managers increasingly work alongside software they do not write. They approve automation projects, describe business rules to developers, review the behaviour of systems that calculate prices or schedules, and decide whether a reported problem is a quick fix or a fundamental flaw. Many also find themselves building small automations, in spreadsheet formulas, workflow tools or scripts, without ever having been taught programming.

Programming can seem like a specialist mystery, but the core ideas are few, and most of them are already familiar from spreadsheets, procedures and everyday reasoning. Every program stores data, makes decisions based on conditions, repeats actions, packages steps into reusable units and organises information into structures. Understanding these ideas helps managers explain business rules precisely, understand why software sometimes behaves unexpectedly, judge estimates more realistically and recognise when a "small change" is not small at all.

This article explains the main programming concepts without requiring any code: data and types, variables, conditions, loops, functions, data structures, objects, libraries, errors and edge cases, the differences between programming languages, readability and technical debt. It closes with practical advice for describing business rules to developers. It is part of a series on software and cloud foundations for business leaders.

## A program is a precise procedure

A program is a set of instructions that a computer follows exactly. In that sense, it resembles a written procedure, with one critical difference: a person following a procedure fills gaps with judgement, while a computer does not. If a procedure says "apply the trade discount to trade customers", a person knows what to do with a customer who is trade for some products and retail for others. A program needs to be told.

Much of programming is therefore not typing code but making rules precise: identifying every case, deciding what should happen in each and handling the cases nobody thought about. This is why conversations between managers and developers so often reveal that a business rule is less settled than everyone assumed.

## Data and types

Programs work with data, and every piece of data has a **type** that determines what can be done with it. Common types include:

- **numbers**, which may be whole numbers, called integers, or numbers with fractions;
- **text**, often called strings;
- **true or false values**, called booleans, such as whether an invoice is paid;
- **dates and times**; and
- **empty or missing values**, which programs must handle explicitly.

Types matter because operations behave differently on different types. Adding the numbers 1 and 2 gives 3; joining the text "1" and "2" gives "12". A part number such as 00745 is text, not a number, even though it contains only digits: treated as a number, it loses its leading zeros and becomes 745. Many data problems in business systems, such as lost leading zeros, dates interpreted in the wrong order or prices rounded unexpectedly, come from data being treated as the wrong type. The [how computers store and process data](/reados/collections/software-and-cloud-foundations/how-computers-store-and-process-data/) article in this series explains why.

## Variables

A **variable** is a named place to hold a value, such as "order total" or "customer type". Programs read and change variables as they run. A spreadsheet cell is a close equivalent: it holds a value, has an address and can be referred to in formulas. Good variable names, such as "freight charge" rather than "x2", make programs far easier to understand.

## Conditions: making decisions

Programs make decisions with **conditions**, usually written as "if, then, otherwise" rules: if the order total is above $500, freight is free; otherwise, charge the standard rate. Conditions can be combined with "and", "or" and "not", and they can be nested inside each other.

Conditions are where business rules live, and where they most often go wrong. Common problems include:

- **boundaries**: does "above $500" include exactly $500?
- **overlapping rules**: what happens when a customer qualifies for two discounts?
- **missing cases**: what happens when the customer type is blank?
- **order of checking**: when several rules could apply, which one is checked first?

A decision table, listing every combination of conditions and the required outcome, is often the clearest way to agree complex rules before they are programmed.

## Loops: repeating actions

A **loop** repeats a set of steps, for example for each line on an order, for each customer in a list or until a condition is met. Loops let programs handle any number of items with the same instructions. They are also a common source of problems: a loop that never meets its stopping condition runs forever, and a loop that processes one item too few or too many, known as an **off-by-one error**, is among the most common mistakes in programming.

Loops also explain why some programs slow down dramatically as data grows. A program that, for each of 1,000 orders, searches through all 1,000 orders again performs a million comparisons; with 100,000 orders, it performs ten billion. Code that seemed fast in testing can become unusable with real data volumes, which is why performance testing with realistic data matters.

## Functions: reusable steps

A **function** packages a set of steps under a name so they can be used repeatedly. A function might calculate GST on an amount, check whether an email address is valid or convert a measurement from inches to millimetres. Functions take **inputs**, often called parameters, and return a **result**.

Functions make programs easier to understand, test and change. If GST is calculated in one function used everywhere, a change in the rate or rounding rule is made in one place. If the same calculation has been copied into twenty places, each copy must be found and changed, and one is usually missed. Spreadsheet users meet the same idea in built-in functions such as SUM and in the problems caused by copying formulas that later need to change.

## Data structures: organising information

Programs organise data into **structures** suited to how it will be used:

- A **list** or **array** holds items in order, such as the lines on an invoice.
- A **dictionary**, also called a map, holds pairs of keys and values, allowing fast lookup by key, such as finding a product's price by its code. The [hash tables, collisions and database lookups](/reados/collections/database-performance-concurrency-and-change/hash-tables-collisions-and-database-lookups/) article explains how such lookups work.
- A **record** or **structure** groups related values, such as a customer's name, address and account number.
- A **tree** represents hierarchies, such as a product's bill of materials or an organisation chart.
- A **queue** holds items waiting to be processed in order, such as print jobs or incoming orders.

Choosing the right structure can make the difference between a program that responds instantly and one that takes minutes. Databases are, in effect, sophisticated data structures designed to store large amounts of information safely and find it quickly.

## Objects and modelling the business

Many programming languages organise code around **objects**, which combine data with the functions that act on it. An "invoice" object might hold its lines, customer and dates, together with functions to calculate its total, apply discounts and mark it as paid. Objects let programs model business concepts in a way that resembles how people think about them.

Modelling the business correctly is one of the most important and difficult parts of software design. Is a "customer" an organisation, a site or a person? Can a job have more than one technician? Can an order be partly invoiced? Answers to such questions shape how data and code are structured, and getting them wrong early is expensive to fix later.

## Libraries, frameworks and not reinventing the wheel

Programmers rarely write everything themselves. **Libraries** provide ready-made functions for common tasks, such as handling dates, reading spreadsheets, creating PDFs or connecting to payment services. **Frameworks** provide the overall structure for a type of application, such as a web application, with the programmer filling in the business-specific parts.

Using established libraries saves time and usually improves quality, because popular libraries are widely tested. It also creates dependencies that must be updated, especially when security problems are found, and occasionally a library is abandoned by its maintainers. Teams should keep track of what they depend on.

## Errors, exceptions and edge cases

Things go wrong in every program: a file is missing, a network connection drops, a user enters text where a number is expected or a supplier sends data in a new format. Well-written programs anticipate such situations, handle them sensibly and report problems clearly. Poorly written programs crash, produce wrong results silently or show messages nobody can understand.

**Edge cases** are unusual but valid situations at the boundaries of normal use: an order with no lines, a customer with no email address, a date of 29 February, a price of zero, a name containing an apostrophe, a quantity of one million. Most defects in business software involve edge cases rather than the normal path. Managers can contribute greatly to software quality by listing the unusual cases they know occur in real work.

A **bug** is a defect that makes a program behave differently from what was intended. Bugs can come from misunderstood requirements, mistakes in logic, unhandled edge cases, wrong assumptions about data or changes in other systems. Finding the cause of a bug, called debugging, often takes longer than fixing it.

## Programming languages

There are many programming languages, each with strengths. Some broad distinctions help:

- **General-purpose languages**, such as Python, Java, C# and JavaScript, can build most kinds of software.
- **Specialised languages** serve particular purposes, such as SQL for querying databases, as the [SQL for managers and analysts](/reados/collections/sql-queries-and-data-correctness/sql-for-managers-and-analysts/) article explains, or languages built into CAD and office software for automation.
- **Compiled languages** are translated into machine instructions before they run, which usually makes them faster. **Interpreted languages** are translated as they run, which makes them quicker to change and test.
- **Low-code and no-code tools** let people build applications and workflows with visual designers and configuration, with less traditional programming. The underlying concepts of data, conditions, loops and functions still apply.

The choice of language usually matters less to a business than whether the team knows it well, whether skilled people are available to maintain it and whether it is actively supported.

## Readability and maintainability

Programs are read and changed far more often than they are written. Code that is clearly named, consistently organised, appropriately commented and divided into small functions is cheaper to maintain and less likely to break when changed. Code written quickly, without structure, may work today but becomes progressively harder and riskier to change.

## Technical debt

**Technical debt** describes the accumulated cost of shortcuts in software: quick fixes, duplicated code, missing tests, outdated libraries and designs that no longer fit the business. Like financial debt, it can be a reasonable choice, for example to meet an urgent deadline, but it accrues interest: every future change takes longer and carries more risk until the debt is repaid by improving the code.

Signs of heavy technical debt include estimates that grow for apparently simple changes, frequent defects in unrelated areas after each change and developers reluctant to touch certain parts of the system. Managers can help by allowing time for improvement work alongside new features, rather than treating it as optional.

## Describing business rules to developers

Managers make the biggest difference to software quality through how they describe what is needed:

- **Explain the purpose** behind each rule, so developers can handle unforeseen cases sensibly.
- **Give concrete examples**, including real figures and expected results.
- **List exceptions and edge cases** from actual experience.
- **Define terms precisely**, such as what counts as an active customer or a completed job.
- **Use decision tables** for rules with several conditions.
- **Say what should happen when data is missing or wrong.**
- **Provide test cases** that can be used to check the result.

Examples are especially powerful. "Freight is free over $500" is ambiguous; a table showing that orders of $499.99, $500.00 and $500.01 attract freight of $25, $0 and $0 is not.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

An industrial supplies business asks a developer to add volume discounts to its online store: 5% off orders over $1,000 and 10% off orders over $5,000. The change is described as simple, and the developer estimates two days.

During a short meeting, the developer works through examples with the sales manager and uncovers several questions. Do the thresholds apply before or after GST? Do they include freight? Can volume discounts be combined with existing trade discounts, and if so, in which order are they applied? What happens if a customer returns part of a discounted order and the remainder falls below the threshold? Are some products, such as clearance items, excluded?

The sales manager agrees a decision table with twelve example orders and expected totals, covering trade and retail customers, excluded items and orders exactly on the thresholds. The developer writes a single discount function, tested against all twelve examples. The work takes four days rather than two, but the first version released matches what the business intended, and later changes to the thresholds take minutes because the rule exists in one place.

## How this applies to a small Australian business

- **Treat software rules as procedures** that must cover every case.
- **Check that identifiers such as part numbers** are stored as text.
- **Agree complex rules with decision tables** and worked examples.
- **List edge cases** from real experience.
- **Test with realistic data volumes**, not just a few records.
- **Expect business logic in one place**, not copied throughout the system.
- **Allow time to reduce technical debt.**
- **Prefer well-supported languages and libraries** over novelty.

## Common mistakes

- **Describing rules vaguely** and expecting software to apply judgement.
- **Ignoring boundaries and missing values.**
- **Underestimating "small" changes** to rules that touch many parts of a system.
- **Copying the same logic** into many places.
- **Testing only the normal path.**
- **Letting technical debt accumulate** without acknowledgement.

## Frequently asked questions

**Do managers need to learn to code?** Not necessarily. Understanding the concepts in this article is enough to describe requirements well, ask good questions and work effectively with developers. Some managers find that learning a little spreadsheet automation or scripting improves that understanding further.

**Why do simple-sounding changes take so long?** Because a rule that sounds simple may touch many parts of a system, interact with other rules, need edge cases handled and require testing to ensure nothing else breaks.

**Is low-code different from programming?** It changes how logic is expressed, using visual tools rather than written code, but the same concepts and the same need for precise rules, testing and maintenance apply.

**What is the most useful thing a manager can give a developer?** Concrete examples of inputs and expected results, including unusual cases.

## Questions to ask

- Have we defined this business rule precisely, including boundaries and exceptions?
- What happens when data is missing or unusual?
- Is this logic in one place, or copied?
- How will this behave with ten times as much data?
- What technical debt are we carrying, and when will we reduce it?

## Bringing it together

Every program stores typed data in variables, makes decisions with conditions, repeats actions with loops, packages steps into functions and organises information into data structures, using libraries and frameworks to avoid reinventing common tasks. Most problems in business software come not from exotic technology but from imprecise rules, unhandled edge cases, data of the wrong type and accumulated shortcuts. Managers who understand these concepts can describe what they need precisely, provide the examples developers need and judge change requests and estimates more realistically.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
