---
title: "Time intervals, overlaps and gaps in databases"
description: "Model database time intervals with clear boundaries, detect overlaps and coverage gaps, and distinguish business-effective periods from recorded history."
publishDate: 2026-10-10
category: "Technology"
tags:
  - systems
  - design
  - validation
author: "KEVOS®"
featured: false
draft: false
---

A system can store a start and end date correctly yet still answer time-based questions incorrectly. Two rates may both appear to apply at a changeover, a booking may be accepted during an existing reservation, or a coverage report may overlook a gap hidden among overlapping records.

The problem is often an undefined boundary convention. Does the end belong to the interval? Does a missing end mean unknown or continuing? Is the period measured in calendar dates, local wall-clock time or actual elapsed time? These choices affect both queries and integrity rules.

Treating a **time interval** as a defined business object makes these questions manageable. This article develops a consistent approach to boundaries, overlap, continuity and historical interpretation, using examples small enough to check manually before implementing them in a production system.

## Distinguish an instant, a duration and a period

An **instant** identifies a point on a timeline. A **duration** expresses an amount of elapsed time. A **period** is an interval anchored to the timeline by boundaries. Ten minutes is a duration; a reservation from 09:00 to 09:10 is an anchored period.

Calendar dates introduce another level of meaning. A rate effective for a calendar day may not need a timestamp at all. Converting every business date into a midnight timestamp can introduce unnecessary time-zone and boundary complexity.

Name fields according to what they represent. An end date described as “last valid day” differs from a timestamp described as “first instant no longer valid”. Both conventions can be legitimate, but mixing them without conversion produces inconsistent results.

Record the unit and precision of the stored representation. If a process works at minute precision, define how second-level input is handled. Rounding is a business and data-conversion decision, not something to leave to an incidental display format.

## Adopt a consistent boundary convention

A useful convention is the **half-open interval**, written `[start, end)`. It includes its start and excludes its end. An interval from 09:00 to 10:00 therefore contains 09:00 but does not contain 10:00.

Two adjacent intervals, `[09:00, 10:00)` and `[10:00, 11:00)`, meet cleanly without sharing an instant. This is particularly useful for consecutive rates, assignments and time buckets, where a boundary should belong to exactly one period.

An inclusive end can also be appropriate for user-facing calendar dates. If a user says an arrangement applies through Friday, a date-based interface may represent Friday as the final included day. Translate that meaning deliberately if the internal representation uses the following day's start as an exclusive end.

Avoid manufacturing an end such as 23:59:59 to approximate an entire day. The stored precision may allow later fractions of a second, and a future precision change can expose the approximation. Represent the boundary itself rather than guessing the last possible timestamp before it.

## State the assumptions behind overlap tests

For two finite, non-empty half-open intervals A and B, they overlap when A starts before B ends and B starts before A ends. In compact form:

```text
A.start < B.end AND B.start < A.end
```

Both comparisons are necessary. Testing only whether one start falls inside the other interval misses cases where one interval completely contains the other. Testing equality of starts misses almost every other overlap shape.

The assumptions matter. The formula is intended here for intervals whose starts precede their ends and whose boundaries are known and comparable. Empty intervals, missing endpoints and unbounded periods need explicit handling rather than being passed through the formula without review.

The formula also treats touching endpoints as adjacency, not overlap. If a resource requires a cleaning or changeover allowance, include that allowance in the reservation model or conflict rule. Do not change the comparison operators casually and expect the result to express every operational requirement.

## Work through a booking example

This is an illustrative example. A test rig is reserved from 09:00 to 10:00. A new request from 09:45 to 10:15 overlaps because each starts before the other ends. A request from 10:00 to 10:30 is adjacent and does not overlap under the half-open convention.

A request from 08:30 to 10:30 contains the original reservation and also overlaps. A query checking only whether the new start lies inside the existing reservation would miss this case because 08:30 occurs before 09:00.

| Existing period | Requested period | Result |
| --- | --- | --- |
| 09:00–10:00 | 09:45–10:15 | Overlap |
| 09:00–10:00 | 10:00–10:30 | Adjacent |
| 09:00–10:00 | 08:30–10:30 | Overlap by containment |
| 09:00–10:00 | 08:00–09:00 | Adjacent |

If the rig needs fifteen minutes of preparation after a booking, represent the protected occupancy through 10:15 or include an explicit preparation rule. The booking end and the next usable time then have different meanings and should be named accordingly.

## Include the identity whose intervals can conflict

An overlap is usually prohibited only within a defined scope. Two bookings can overlap if they use different rigs. Two rates can overlap if they belong to different products or customers. The entity or composite identity is part of the rule.

A conflict query must therefore match the relevant identity as well as compare boundaries. For bookings, that might be resource identifier. For a contractual rate, it might be customer, product, currency and rate type, depending on the actual business definition.

When editing an existing interval, exclude that record from the search for conflicting peers. Otherwise it will normally overlap itself and every edit will appear invalid. Exclusion should use a stable identifier rather than relying on matching all current field values.

Do not deduce the scope from the most convenient available column. Establish which arrangements are mutually exclusive in business terms, then make the schema and query express that scope.

## Separate no overlap from complete coverage

A rule prohibiting overlaps does not guarantee continuity. Periods from 09:00 to 10:00 and from 11:00 to 12:00 satisfy a no-overlap rule but leave an hour uncovered. Conversely, complete coverage can contain overlaps if several records cover the same time.

Decide which property the business needs. An asset may legitimately be unassigned between jobs. A published rate schedule might require exactly one applicable rate throughout a defined planning horizon. The latter combines non-overlap with coverage.

Define the horizon for a coverage question. “No gaps” has no useful meaning without an interval that should be covered. Coverage from the first recorded start to the last recorded end can conceal missing periods before or after those records.

Also distinguish the absence of a record from an explicit unavailable period. A maintenance block and an unexplained gap can have different operational meanings even though neither permits booking. Preserve that distinction in the data and reporting labels.

## Detect gaps with the accumulated coverage

When intervals may overlap or nest, comparing each start with only the immediately preceding row's end can report false gaps. The preceding row may end earlier than another interval already encountered.

This is an illustrative example. The intervals are 09:00–12:00, 09:30–10:00 and 11:00–11:30. Sorted by start, the third interval follows the short second interval. Comparing 11:00 with 10:00 suggests a gap, but the first interval already covers the whole period through 12:00.

A robust method tracks the furthest end reached by all earlier intervals in the same scope. A gap begins only when the next start is later than that accumulated end. After each row, extend the accumulated end if the new interval reaches further.

The method requires consistent boundary semantics and deliberate handling of unbounded ends. It also requires grouping by the correct entity before ordering. Mixing intervals from different resources can make coverage appear complete even when each individual resource has gaps.

SQL window functions can express this running-maximum approach in suitable products, but the algorithm should be understood and tested before selecting syntax.

## Merge coverage without erasing meaning

Combining overlapping or adjacent intervals into larger coverage periods is often called coalescing. It can simplify availability reports and make gap detection easier. However, merging intervals can discard distinctions that matter to other questions.

Two adjacent rates should not become one interval if their values differ. Two assignments may cover a continuous period but involve different responsible teams. Merge only records whose non-temporal meaning is compatible with the intended result.

Keep source identifiers or a derivation path when the merged result is used for decisions that may need explanation. A coverage interval derived from several records should be traceable back to them.

Do not replace the original operational records merely because a merged reporting view is simpler. The merged representation answers a particular question about coverage; the original records may answer questions about responsibility, approval and change history.

## Define open-ended and unknown periods separately

An absent end can mean the arrangement continues indefinitely, or that the end has not been recorded. Those meanings are different. Treating both as “forever” can make incomplete records block all future activity.

Choose an explicit convention. A model might allow an unbounded end only for a current assignment and use a separate status for incomplete historical records. Alternatively, it might require an end for bookings while permitting unbounded validity for reference information.

Avoid arbitrary far-future dates unless the application has a documented reason and handles the sentinel consistently. Such dates can be mistaken for genuine commitments, distort duration calculations and fail when data is transferred to a system with different date limits.

PostgreSQL's [range-type documentation](https://www.postgresql.org/docs/current/rangetypes.html) provides an example of native range values, inclusive and exclusive bounds, unbounded ranges and exclusion constraints. These features illustrate available mechanisms; verify the equivalent capabilities and semantics in the database being used.

The representation should communicate what is known. An unknown endpoint is uncertainty, while an intentionally unbounded interval is a defined modelling choice.

## Keep local schedules and elapsed time distinct

A schedule expressed in local civil time and an elapsed duration are not always interchangeable. Time-zone changes can make a local clock time ambiguous or absent. A calendar-day commitment may therefore need different handling from a duration measured in seconds.

For events that occurred at definite instants, store a representation that can identify those instants unambiguously, with the relevant context retained where needed. For future recurring local schedules, retain the intended locality and scheduling rule rather than assuming one fixed offset will remain suitable.

In an Australian operation working across states or with overseas partners, clarify which location's business date controls an effective date. A report grouped by the server's local date can assign events to a different day from the site's operational calendar.

Avoid embedding current offset assumptions in enduring article examples or database rules. Use the platform's supported time-zone facilities and verify behaviour around the actual transitions relevant to the deployment. Tests should include boundaries where the local calendar differs from a simple sequence of equal-length days.

## Distinguish effective time from recording time

An interval can describe when a fact applies in the business, while another timestamp describes when the database learned about it. These are often called valid time and transaction time, although terminology and product implementations vary.

A rate may become effective on Monday but be entered on Wednesday. A query asking which rate applied on Tuesday differs from a query asking what the system believed on Tuesday. Both questions can be important, and a single pair of start and end fields cannot necessarily answer both.

The [guide to keeping history in business data](/reados/collections/reporting-history-and-analytical-data/keeping-history-in-business-data/) introduces that broader distinction. For interval design, the key is to attach each boundary to a clearly named timeline and avoid mixing them in joins.

Corrections require deliberate treatment. Editing the effective interval can improve the current understanding of history while losing evidence of what was previously recorded. If the latter matters, preserve a separate recording history with appropriate authority and retention rules.

## Protect the rule under simultaneous writes

A form that searches for overlapping bookings before inserting a new one can still admit a conflict when two requests run together. Both may observe an empty period before either inserts its reservation.

Use a database mechanism appropriate to the rule and product. A supported exclusion constraint may express non-overlap directly. Other designs require serializable execution with retries or a locking protocol that coordinates all writers for the relevant resource.

The enforcement mechanism must use the same boundaries and scope as the reporting query. If the screen treats touching intervals as adjacent while the database treats them as conflicting, users will encounter confusing rejections. If the database is weaker than the screen, imports may introduce states the interface would reject.

Test simultaneous requests deliberately. The expected outcome should leave a valid schedule, with one request refused, delayed or retried as appropriate. A sequence of manual single-user tests cannot establish concurrent correctness.

## Build a boundary-focused acceptance set

Create examples for equal intervals, partial overlap, containment in both directions, adjacency on both sides and a clear gap. Include different resource identifiers to confirm that unrelated schedules do not conflict.

Add invalid inputs: end before start, equal start and end where empty periods are prohibited, missing start and unknown end. State the intended outcome for each before implementing validation.

For coverage, include nested intervals and a horizon that begins before the first record or ends after the last. These cases expose algorithms that only compare neighbouring rows or ignore the requested coverage boundary.

For effective-time joins, place an event exactly at the transition between two versions. Under the half-open convention, it should match the new version only. Also test events outside every period and ensure the absence of a match is handled explicitly.

These small cases provide more confidence about temporal correctness than a large dataset containing only comfortably separated intervals.

## Make the convention visible in the interface

Users should not need to infer whether an end is inclusive. Labels such as “valid through” and “ends at” communicate different ideas, but they still need supporting behaviour and documentation consistent with the stored representation.

If the interface accepts an inclusive final date and stores an exclusive next-day boundary, make the conversion consistent in entry, display, import and export. Otherwise users may see an apparent extra day when examining records in another tool.

Explain conflicts with the relevant interval and resource where the user is authorised to see them. A generic “invalid date” message is unhelpful when the dates are individually valid but overlap another reservation.

Time intervals become reliable when their meaning is explicit from entry through storage to reporting. Define the timeline, boundaries, scope and coverage requirements, then test the difficult edges. That discipline prevents small comparison choices from becoming persistent errors in schedules, rates and historical decisions.

---

*Source: Richard T. Snodgrass, Developing Time-Oriented Database Applications in SQL (2000), particularly chapter 4 on periods and chapter 5 on state tables; current PostgreSQL range-type documentation linked above. Booking, rate and coverage examples are original illustrations. Historical statements about SQL product support in the book are not presented as current capabilities.*
