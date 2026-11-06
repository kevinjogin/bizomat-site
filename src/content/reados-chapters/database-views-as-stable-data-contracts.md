---
title: "Database views as stable data contracts"
description: "Use database views to expose deliberate data contracts, with clear row meaning, types, update rules, access behaviour and compatibility tests as storage changes."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - design
  - projects
author: "BIZOMAT"
featured: false
draft: false
---

An application that reads database tables directly depends on more than column names. It depends on what each row represents, which records are included, how missing values behave and which relationships produce additional rows. Changing storage can break those assumptions even when the application still receives a syntactically valid result.

A database view can provide a deliberate interface between stored data and its consumers. It defines a query that presents a chosen representation of the underlying records. That representation can remain stable while some aspects of storage change behind it.

The value comes from treating the view as a contract. Creating a saved query is easy; preserving its meaning, access behaviour and performance requires explicit design and testing.

## Define what one row means

Consider a service business with an application that reads a job table. This is an illustrative example. The database team wants to separate job identity, current assignment and customer contact information into different structures while preserving the application's job-summary interface.

The first question is the grain of that interface. Does one row represent a job, an assignment or a job-contact combination? A view joining the new tables can return several rows per job if assignments or contacts are not unique at the intended scope.

A consumer that previously assumed one row per job may then duplicate totals or display repeated jobs. The SQL can be valid and every returned field can look reasonable while the contract has changed fundamentally.

Document the identity of a row and the expected uniqueness rule. State which relationship supplies each field and how the view chooses among multiple candidates where the business permits them. An arbitrary first contact is not a stable definition of the primary contact.

Include the population rule. Open jobs, all jobs and the latest version of every job are different interfaces. A view name should help communicate that scope, and its definition should make inclusion and exclusion deliberate.

## Specify columns as information, not just a shape

A stable column list is useful, but compatibility includes the meaning of each value. A field named completion date might change from the date work ended to the date an administrator closed the record. Its type can remain unchanged while its interpretation shifts.

Define units, time basis, code sets and null meaning for important fields. A duration expressed in minutes is not interchangeable with one expressed in hours. A local date is not equivalent to a timestamp representing a particular instant.

Choose output types intentionally when expressions or combined sources are involved. A calculation can change precision, scale or nullability. Consumers may format, compare or store the value according to the old expectations, so apparently harmless type changes can have consequences beyond the query itself.

Prefer explicit column lists in contract definitions. A broad selection of every underlying column couples the interface to storage details and can expose additions that were never reviewed as part of the public representation. The exact behaviour of stored view definitions varies by engine, so inspect the resulting schema rather than relying on intuition about a wildcard.

Column order can matter to poorly designed but existing consumers that read values by position. Identify that dependency before changing it. A contract migration should address real clients, including their inconvenient assumptions, rather than only the clients the team wishes it had.

```figure
type: steps
title: What a view promises its consumers
caption: A view is a contract: change it deliberately, or version it.
- What one row means
- Each column's information | units, nulls, definitions
- Translations from storage | without erasing differences
- *Write behaviour | if writes are allowed at all
```

## A view can translate storage without erasing semantic differences

The new job schema might store first and last names separately while the old interface expects a display name. A view can construct that display value, but the formatting rule still needs a definition. Missing components, punctuation and international naming conventions can make naive concatenation unsuitable.

More substantial changes may not have an exact translation. Splitting one status into separate scheduling and commercial states can create combinations that do not fit the old single status. The compatibility view must either map them according to an agreed rule or expose the limitation.

Do not silently assign a convenient default to every new case. A default that makes the old application continue running can misrepresent the business state. Compatibility includes the correctness of the meaning presented to that application.

Use explicit mappings and preserve evidence of unmapped cases. During a transition, the team should be able to count records that cannot be represented faithfully and decide how those cases will be handled. An apparently successful query is not enough.

If the old contract can no longer describe the business honestly, introduce a new interface version and migrate consumers. A view is a useful boundary for change, but it cannot make an inherently incompatible information model fully compatible by syntax alone.

## Read compatibility does not imply write compatibility

An application may both read and update the object it knows as a table. Replacing that object with a view can preserve reads while changing or removing supported write behaviour. Updatability depends on the database and the structure of the view.

A simple projection from one table may support automatic updates in some engines. A view combining several tables, aggregating rows or calculating values introduces ambiguity about which underlying records should change. The application may need a separate write interface.

For example, changing a displayed customer name through a job-summary view could mean changing the customer's master record, changing a job-specific contact or correcting a historical snapshot. The intended action cannot be inferred safely from the display value alone.

Define supported commands explicitly. A read-only view can be a clear contract when updates occur through controlled procedures or application operations. If writes through the view are supported, specify the affected entities, validation rules and failure behaviour.

Test insertion, update and deletion separately. They need not have identical support. Also check generated identifiers, default values, returned rows and affected-row counts, because existing clients may depend on those behaviours even when their basic statements still execute.

## Filtered views need a rule for writes that leave the population

Suppose a view exposes active jobs only. An update through that view might change a job to an inactive state. Whether that is permitted depends on the intended interface: it could be a legitimate completion action or an operation the view is meant to prohibit.

Some databases provide a check option for supported updatable views that requires written rows to satisfy the view's condition. PostgreSQL documents this behaviour, along with important distinctions for nested views and other update mechanisms.

The feature should be selected from the business rule. A check option that prevents a job leaving the active population would be inappropriate if the interface is specifically intended to close jobs. Conversely, allowing a newly inserted row to disappear immediately from the caller's view can be confusing if the caller expects to manage it there.

Keep visibility rules separate from lifecycle commands where that produces a clearer design. A command to close a job can validate the transition and return its outcome, while the active-job view simply describes the current population.

Do not assume that every write path is constrained by a condition appearing in one view. Direct table access, other views and administrative operations may follow different routes. The integrity argument must cover the actual set of writers that can change the underlying data.

## Access restrictions require verified privilege behaviour

A view can expose selected columns or rows, but using it as an access boundary requires more than hiding fields in its query. The caller's permissions on the view, the underlying objects and any invoked functions all matter.

Privilege behaviour varies across databases and configuration choices. PostgreSQL, for example, distinguishes view-owner and security-invoker behaviour and documents additional considerations for security barriers and row-level policies. A security-sensitive design must use the documented mechanism for its intended guarantee.

Remove unintended alternative access paths. If a user can query the base table directly, a restricted view does not stop them retrieving the broader data. Conversely, changing permissions while introducing a view can break legitimate operations that previously depended on the table.

Test with representative non-administrative identities. A successful query run by an owner or privileged account says little about what an ordinary application user can see or modify. Include joins, filters and exported results in those tests.

Keep the access policy understandable. A deep chain of views and functions with different execution contexts can be difficult to audit. Where complexity is necessary, document which identity governs each relevant operation and verify that the final exposure matches the intended audience.

## Ordinary views do not automatically store or cache their results

A normal view generally represents a query over underlying data rather than a separately stored snapshot. Its convenience does not make an expensive join or calculation disappear. The database still needs an execution strategy for the combined request.

An optimiser may combine the caller's query with the view definition and push suitable conditions towards the underlying tables. The extent and effectiveness of that transformation depend on the engine, query features and statistics. Do not assume that a small-looking query against a view implies a small amount of work.

Nested views can make the complete operation hard to see. A simple report may expand into repeated joins, aggregations or function calls. Inspect the actual plan and underlying row counts when diagnosing performance, rather than stopping at the top-level SQL.

Separate an ordinary view from a materialised result. Materialisation introduces storage, refresh and freshness questions. It may be appropriate for a workload, but it changes the contract from reading through a definition to reading a maintained representation with its own timing.

Performance testing should use representative filters and parameter values from real consumers. A view that performs well for one highly selective lookup may be unsuitable for a broad export. The contract should include reasonable workload expectations, not only column definitions.

## Version the contract when consumers cannot move together

Several applications may depend on the same view and release on different schedules. An incompatible change needs a transition plan that allows the old and new contracts to coexist long enough for consumers to migrate safely.

Versioning can use separate view names, schemas or another established interface convention. The naming mechanism matters less than a clear statement of the differences, ownership and retirement conditions. Avoid indefinite proliferation of nearly identical versions without a plan.

Track known consumers. Reports, scheduled extracts and informal analytical tools can be as dependent on the view as the main application. Database usage evidence can help discover them, but it may not reveal rarely run month-end or recovery processes during a short observation window.

Announce semantic changes in concrete terms. Explain changes to row grain, included populations, code interpretation and write support. A list of renamed columns alone may miss the most important impact on users' calculations and decisions.

Remove an old contract only after the retirement criteria are satisfied. Preserve an appropriate recovery path for unexpected consumers, while avoiding a promise that every old representation will be maintained forever regardless of changing business meaning.

## Test results and behaviour against the contract

Create a compact reference dataset containing the cases that distinguish the interface's rules. Include jobs with no assignment, several historical assignments, a missing contact, an inactive state and values at relevant date boundaries.

Compare the expected and actual row identities, not just totals. Two errors can cancel numerically: one job omitted and another duplicated may leave the same count or sum. Check uniqueness and membership directly.

Verify types, nullability expectations and representative values. Test unmapped codes, unusually long text and calculations at precision boundaries. If a view preserves an old representation, compare it with the previous implementation over a controlled dataset that exercises the changed storage.

For writable contracts, test each supported operation and its effects on underlying records. Include rejected writes and concurrent updates. Confirm that failures do not leave a partial business operation hidden behind a successful-looking interface response.

Check how consumers interpret errors after the change. An application may distinguish a missing record from a permission failure or a rejected state transition. Replacing a table operation with view logic can change which error is raised first. Preserve the meaningful distinction or update the consumer deliberately, rather than returning a generic success-shaped result that makes an unsuccessful write appear complete.

Access and performance tests complete the assessment. Run as actual consumer roles and use realistic query shapes. A contract is preserved only when the intended audience receives the right information through the supported operations within acceptable resource limits.

## Keep ownership close to the information being exposed

A view needs an owner who understands both its business meaning and its consumers. Without that responsibility, storage changes can alter results while each team assumes another team is maintaining compatibility.

Document the row grain, population, identity, field meanings, supported writes and access expectations. Keep the documentation aligned with the definition and reference tests. This gives future maintainers a practical basis for assessing proposed changes.

Review new dependencies deliberately. A view created for one operational screen can become the foundation of several financial or management reports. Its importance and performance expectations may grow beyond the original design without anyone explicitly agreeing to that expansion.

Monitor failures and material changes in usage. Unexpected row-count shifts, slow exports or repeated permission errors can reveal that the contract no longer fits its consumers. Investigate the meaning of the change before simply relaxing filters or adding more columns.

Database views are most useful when they make information boundaries explicit. They can reduce direct coupling to storage, but their reliability comes from the contract maintained around them: stable meaning, supported behaviour and evidence that changes preserve both.

```figure
type: checklist
title: Testing a view against its contract
caption: Ordinary views do not store results; filtered views need a rule for writes that leave the population.
- x Results match the row meaning
- x Writes behave as documented, or are refused
- x Access restrictions verified, not assumed
- x Performance measured on real queries
- *x A version plan for consumers that cannot move together
```

## Source basis and further reading

The Encapsulate Table With View refactoring in the source collection's *Refactoring Databases: Evolutionary Database Design* motivates views as a boundary around changing tables. This article develops an original job-summary example and examines compatibility beyond the historical refactoring's simplified table replacement.

PostgreSQL's [CREATE VIEW documentation](https://www.postgresql.org/docs/current/sql-createview.html) describes its view definitions, automatic updatability, check options and privilege behaviour. Those implementation details should be verified separately for other database engines.
