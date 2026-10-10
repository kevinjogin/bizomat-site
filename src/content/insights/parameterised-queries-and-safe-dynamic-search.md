---
title: "Parameterised queries and safe dynamic search"
description: "How to keep search values separate from SQL instructions, handle optional filters and sort choices, and test database queries without breaking legitimate customer data."
publishDate: 2026-10-11
category: "Technology"
tags:
  - systems
  - validation
  - design
author: "KEVOS"
featured: false
draft: false
---

A customer search fails when a surname contains an apostrophe. Someone removes the punctuation before searching, and the immediate error disappears. Unfortunately, the application now changes legitimate names and may still construct database instructions from untrusted text. Treating the visible symptom as a data-cleaning problem leaves the underlying design unresolved.

Database queries combine instructions with values. The instructions describe which records to read or change; the values identify a customer, date range, quantity or search phrase. Parameterised queries preserve that distinction so a value is not interpreted as part of the instruction language.

The principle is straightforward, but practical search screens introduce optional filters, selectable sorting, lists and wildcard matching. These features need a deliberate query-building approach. A useful design protects the instruction boundary while still letting people search for the actual names and identifiers their business uses.

## Keep instructions and values in separate channels

A **parameterised query** provides the database driver with a statement and its values separately. The statement contains parameter markers in supported value positions. The driver handles the values according to its API rather than asking the application to construct quoted SQL text manually.

OWASP's [SQL injection prevention guidance](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) recommends this separation as a primary defence. It also distinguishes value binding from the allow-listed handling needed for structural choices such as column names. Input validation remains useful, but it is not a replacement for keeping values out of SQL instruction text.

Think of the boundary as an application design rule. A customer name remains data even if it contains punctuation resembling SQL. Removing characters from that name changes the business record without proving the query is safe. Conversely, perfectly ordinary-looking text can still be unsafe if it is placed in an instruction position without control.

Parameter syntax differs between drivers. A question mark, named marker or numbered marker is meaningful only under the API that supports it. Copying the marker style from one language's example into another system can produce errors or a false sense of protection.

## Use a small example with real input behaviour

This is an illustrative example. A workshop keeps a simple customer table. Its application needs to find an exact customer name within the organisation the current user is authorised to access. The following Python example uses the standard SQLite interface and assumes that the connection and authorisation context have already been established.

```python
sql = """
    SELECT customer_id, display_name
    FROM customer
    WHERE organisation_id = ?
      AND display_name = ?
"""
rows = connection.execute(
    sql,
    (authorised_organisation_id, entered_name),
).fetchall()
```

If `entered_name` is `O'Neil Fabrication`, the apostrophe is part of the supplied value. The application does not remove it, double it manually or splice the name between quote characters. The driver receives one name value, distinct from the statement that defines the search.

The [Python SQLite documentation](https://docs.python.org/3/library/sqlite3.html) describes its supported placeholders and parameter passing. This example demonstrates that API's value binding; it is not a complete production customer-search service. Connection management, permissions, error handling and indexing still need their own design.

The organisation parameter is deliberately obtained from an authorised application context. Binding an organisation number entered by the caller would preserve SQL syntax while still allowing an access-control defect. Correct parameterisation prevents a value becoming SQL; it does not prove the caller is entitled to the rows that value selects.

## Build optional filters from controlled fragments

A search form may allow a customer name, status and minimum order date. Developers sometimes respond by assembling one long string from whatever text is present. A safer structure assembles only developer-controlled SQL fragments and collects the corresponding values separately.

For example, the application can begin with a fixed organisation condition. If the user provides a status, it adds a fixed `status = ?` fragment and appends the validated status value to the parameter list. If no status is supplied, it omits that fragment. The number and order of markers must match the collected values.

This approach makes the search semantics visible. A missing filter means “do not constrain this field”, while a selected blank value might mean “find records whose field is empty”. Those are different requests. Decide how the interface represents them instead of using the same empty string for every case.

Avoid generating so many combinations that the query builder becomes impossible to review. A small collection of clear query shapes can be easier to maintain than a universal search language. Where a framework already provides a well-supported expression builder, use its documented binding behaviour and inspect how it handles raw SQL escape hatches.

## Treat sort choices as a small vocabulary

A parameter usually represents a value, not an SQL identifier or keyword. Binding the text `display_name` does not generally mean “sort by the column named display_name”. It may be interpreted as a constant value or rejected, depending on the statement and database.

Offer users a controlled set of sort choices and map each choice to a fixed expression selected by the application. For example, a public option called `name` can select the application's known `display_name` column, while `account` selects its known account-number column. An unknown option should receive a defined default or a validation error.

Direction needs the same treatment. Convert a small accepted vocabulary to a fixed ascending or descending keyword. Do not append arbitrary request text after an order-by expression. A user interface with only two buttons does not guarantee that every request reaching the server came from those buttons.

Add a stable tie-breaker when results are paged. Two customers can have the same display name, so ordering only by that name does not identify a unique sequence. A permitted primary key or other suitable stable identifier can complete the order. This is a correctness requirement alongside the query's security boundary.

## Handle lists without hiding SQL inside a parameter

A user may select several statuses or product identifiers. Passing the single string `open,held,closed` into one marker does not ordinarily create three SQL values. It supplies one string unless the chosen database API explicitly provides collection binding or an equivalent typed feature.

With a simple positional API, the application can generate a controlled number of markers from the list length and bind each element separately. The generated marker text comes from an integer count, not from the contents of the list. Database-specific array or table-valued parameters may offer a better option where supported.

Define the empty-list case before constructing the query. It might mean “select nothing”, “no filter” or “the user has not chosen a value yet”. These interpretations produce very different business results. An empty permission list should certainly not become unrestricted access merely because the query builder drops its condition.

Very large lists deserve limits and a measured design. Thousands of selected identifiers can exceed driver limits, make requests difficult to inspect or produce inefficient plans. A bounded selection, temporary staging structure or server-side saved selection may be more appropriate. Parameterisation addresses instruction separation, not unlimited workload size.

## Decide whether search punctuation is literal

Pattern matching introduces another language inside the value. In SQL `LIKE`, characters such as percent and underscore commonly have wildcard meanings. Binding the pattern safely stops it becoming SQL syntax, but does not automatically turn those wildcard characters into literal characters.

Suppose a product code is `A_10`. A user asking for that exact code may be surprised when a pattern search also finds codes with other characters in the underscore position. The SQL can be perfectly parameterised while the search behaviour is wrong for the business request.

Separate exact, prefix and wildcard search modes. If an exact identifier is required, equality may be the right operation. If users are allowed to write patterns, explain that behaviour. If the application builds a literal prefix pattern, implement escaping according to the selected database's documented rules and test the escape character itself.

Whitespace deserves a similarly explicit choice. Automatically trimming a person's display name may be acceptable in one workflow, while trimming a supplier's fixed-width external identifier can break a match. Input normalisation should follow the field's meaning, not a generic helper that changes every string before it reaches the database.

## Preserve types and missing-value semantics

Binding values with appropriate types reduces ambiguity. A date range should be interpreted using a defined date format before query execution. A quantity should become a validated numeric value, with a deliberate choice about decimal precision and units. Letting a database guess from arbitrary text makes errors harder to explain.

Null also has a specific meaning. An equality comparison with a null parameter does not generally mean “find null rows”. If a search option means “no assigned contact”, construct the appropriate fixed null-check expression. Do not confuse an absent filter, an empty string and a missing database value.

For ranges, define whether each boundary is inclusive or exclusive. A date-time search ending at midnight can unintentionally exclude almost an entire intended day. Derive the boundaries from a stated business timezone and pass the resulting values. Binding makes their transmission safe, but it cannot repair an incorrectly calculated interval.

The related article on [writing a data dictionary](/insights/writing-a-data-dictionary/) explains why field definitions belong in the design. A query builder needs those definitions to know whether it is dealing with a local date, an instant, an identifier or descriptive text.

## Review stored procedures and reporting tools too

A stored procedure does not automatically protect every query it executes. It can receive parameters correctly and then concatenate their contents into another SQL statement internally. The instruction boundary must hold wherever a statement is assembled, including database-side code.

Likewise, a reporting tool may provide a parameter box while also allowing an author to place text directly into a custom query. Inspect the actual execution mechanism. A label saying “parameter” is less informative than evidence that values travel through the driver's binding API or a documented equivalent.

Background imports, scheduled exports and administrator screens should follow the same rule as public forms. Data that originally came from a user can be stored safely and later reintroduced into unsafe query construction. Trust should come from the current handling path, not simply from the fact that a value was retrieved from a database.

Keep direct SQL construction concentrated in a small, reviewable part of the application. This does not require hiding every query behind several abstract layers. It requires making unsafe string assembly easy to recognise and making the normal, parameterised path straightforward to use.

## Keep access control and resource limits explicit

A correctly bound query can still expose too many records if its conditions are incomplete. The system must enforce organisation scope, record permissions and permitted operations independently of the search text. A customer lookup and an unrestricted customer export should not become interchangeable because they share a query helper.

Use a database account suited to the application's work. A read-only report usually does not need the same privileges as a migration process. This is another layer of protection and operational clarity, rather than a reason to tolerate unsafe query construction.

Set reasonable limits on result size and execution effort. An allowed broad search can still be expensive, especially with leading wildcards or several unindexed conditions. Measure representative searches and decide how the interface handles timeouts or excessive results. Avoid promising that prepared or parameterised statements are always faster; performance depends on the database, statement and workload.

Diagnostic logs need care. Logging a statement template and a non-sensitive request identifier can help diagnose failures without recording names, account details or confidential search values. If values are necessary for a specific investigation, use the organisation's controlled diagnostic process rather than permanently dumping every parameter.

## Test legitimate data and boundary choices

Begin with names containing apostrophes, hyphens, accented letters and non-Latin characters. Verify that the application stores and searches them without destructive changes. A query that passes only simple alphabetic examples has not been tested against ordinary business data.

Then test structural choices: unknown sort options, both permitted sort directions, empty lists, repeated list elements, missing filters and null-search modes. The expected outcome should be documented for each case. A validation error is acceptable when intentional; silently changing the request into a broader search is usually much harder to defend.

Use small controlled data sets with multiple organisations to test that a parameter cannot widen access. Confirm that every returned record belongs to the authorised scope, including when other filters are omitted. Also exercise the reporting and import paths that reuse the same query-building components.

Where a query contains pattern matching, include literal percent signs and underscores in the fixture. Where it contains a date range, include records exactly on each boundary. These tests verify what the user is asking, not just whether the database accepts the syntax.

## Make safe querying the ordinary development path

For a small Australian business, the practical requirement is straightforward: people should be able to enter genuine names and identifiers, searches should have clear meanings, and access should remain limited to the records each person is allowed to use. Achieving that requires more than removing suspicious punctuation.

Ask software maintainers to show how one representative search sends its statement and values to the database, how it selects sort expressions and how it enforces organisation scope. These concrete examples reveal more than a broad assurance that the system “sanitises inputs”.

The lasting design principle is to assign each kind of input a role. Values are bound as values, structural choices come from controlled application definitions, and business validation decides whether the requested operation makes sense. That separation produces queries that are both safer and more faithful to the data the business actually needs.

---

*Source basis: original KEVOS editorial explanation informed by the Selection Factory discussion in the supplied Data Access Patterns (2003). Current defensive guidance and the Python database API are linked where used. Examples are illustrative and do not describe a deployed KEVOS system.*
