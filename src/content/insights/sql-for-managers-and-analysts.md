---
title: "SQL for managers and analysts: reading and writing simple queries to answer business questions"
description: "A little SQL lets managers and analysts answer questions directly from business data. The core of the language, how to avoid common traps and how to check results before trusting them."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - operations
author: "KEVOS"
featured: false
draft: false
---

Most business questions are answered from data held in databases: which customers bought less this year, which products are late most often, how much overtime each team worked, which jobs ran over their estimates. Often the answer exists in the business's systems, but getting it means waiting for a standard report to be modified, exporting large files into spreadsheets or asking an IT provider to write a query.

**SQL**, short for Structured Query Language, is the standard language for asking questions of relational databases. Managers and analysts do not need to become developers to benefit from it. A modest understanding lets them read queries written by others, check how a report is calculated, answer simple questions directly and talk precisely with the people who build their systems. It also helps them recognise when a number is wrong.

This article introduces the core of SQL for business users: how queries are structured, how to filter, join and summarise data, how to handle dates and missing values, the common mistakes that produce wrong answers, and how to check results before relying on them. It also covers how to get safe access to data. It is general information; specific database products differ in details, so check the documentation for the system you use.

## What SQL is

SQL was developed at IBM in the 1970s to work with the relational model of data, which organises information into tables of rows and columns linked by shared values. It became an American national standard in 1986 and an international standard soon after, and it is used, with variations, by almost every relational database, including Microsoft SQL Server, Oracle Database, PostgreSQL, MySQL and SQLite.

SQL is **declarative**: a query states what result is wanted, and the database decides how to produce it. That makes it readable. A well-written query is close to a precise English description of the question.

## Get safe access first

Before writing any query, arrange appropriate access:

- **Use a read-only account.** Business users exploring data should not be able to change it. A read-only login removes the risk of accidental updates or deletions.
- **Prefer a reporting copy.** Many systems can provide a copy of the database, refreshed regularly, for reporting. Heavy queries on the live system can slow it for everyone.
- **Respect privacy and confidentiality.** Databases often hold personal information, pay rates and commercially sensitive data. Access should match the user's role, and results should be handled carefully.
- **Ask what the tables mean.** Table and column names are often cryptic. A data dictionary or a conversation with the system's owner prevents misinterpretation.

## The shape of a query

The most common statement is `SELECT`, which retrieves data. Its basic structure is:

```sql
SELECT customer_number, name, state
FROM customers
WHERE state = 'QLD'
ORDER BY name;
```

Read aloud, this says: show the customer number, name and state from the customers table, only for customers in Queensland, sorted by name. The parts are:

- **SELECT** lists the columns to show.
- **FROM** names the table.
- **WHERE** filters the rows.
- **ORDER BY** sorts the results.

Keywords are traditionally written in capitals for readability, although most databases accept lower case. Text values are enclosed in single quotes.

## Filtering rows

The `WHERE` clause can combine conditions:

| Condition | Meaning |
|---|---|
| `status = 'Open'` | Equals a value |
| `quantity > 100` | Greater than |
| `state IN ('NSW', 'VIC')` | Any value in a list |
| `order_date BETWEEN '2026-01-01' AND '2026-03-31'` | Within a range, including both ends |
| `name LIKE 'Smith%'` | Text starting with "Smith" |
| `email IS NULL` | No value recorded |
| `status = 'Open' AND total > 5000` | Both conditions true |
| `state = 'NSW' OR state = 'ACT'` | Either condition true |

When mixing `AND` and `OR`, use brackets to make the meaning explicit, because `AND` is applied before `OR` and the result may otherwise differ from what was intended.

### The trap of missing values

Databases represent missing information as **NULL**, which means "unknown", not zero or blank text. NULL behaves in ways that surprise people:

- A condition such as `discount = 0` does not match rows where the discount is NULL.
- `discount <> 10` also excludes NULL rows, because an unknown value cannot be confirmed as different from 10.
- Totals and averages ignore NULLs, which may or may not be what is wanted.

To include or find missing values, test explicitly with `IS NULL` or `IS NOT NULL`, or replace them with a default using functions such as `COALESCE`.

## Joining tables

Business data is spread across related tables, so most useful questions require **joins**. This query lists orders with the customer's name:

```sql
SELECT o.order_number, o.order_date, c.name, o.total
FROM orders AS o
JOIN customers AS c ON c.customer_id = o.customer_id
WHERE o.order_date >= '2026-07-01';
```

The `JOIN ... ON` clause states how rows match: each order's customer identifier equals the customer's identifier. The short names `o` and `c` are aliases that make queries easier to read.

Two kinds of join cover most needs:

- An **inner join**, written `JOIN`, returns only rows with a match in both tables.
- A **left join**, written `LEFT JOIN`, returns every row from the first table, with matching data from the second where it exists and NULLs where it does not.

Left joins are useful for finding things that are missing. This query finds customers with no orders since July:

```sql
SELECT c.customer_number, c.name
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.customer_id
 AND o.order_date >= '2026-07-01'
WHERE o.order_number IS NULL;
```

## Summarising data

Aggregate functions summarise groups of rows: `COUNT`, `SUM`, `AVG`, `MIN` and `MAX`. Combined with `GROUP BY`, they produce totals by category:

```sql
SELECT c.state, COUNT(*) AS orders, SUM(o.total) AS sales
FROM orders AS o
JOIN customers AS c ON c.customer_id = o.customer_id
WHERE o.order_date >= '2026-07-01'
  AND o.order_date <  '2026-10-01'
  AND o.status <> 'Cancelled'
GROUP BY c.state
ORDER BY sales DESC;
```

This gives the number of orders and total sales by state for the quarter, excluding cancelled orders, with the largest first. To filter on a summarised value, use `HAVING` rather than `WHERE`, for example `HAVING SUM(o.total) > 100000` to show only states with sales above $100,000.

## Working with dates

Dates cause many reporting errors:

- **Use half-open ranges.** To capture a full quarter, use `>= '2026-07-01'` and `< '2026-10-01'`. `BETWEEN` with an end date can miss records timestamped during the last day, because a date and time of 30 September at 2 pm is later than 30 September at midnight.
- **Know which date is which.** Orders may have an entry date, a requested date, a promised date and a dispatch date. Choose the one that matches the question.
- **Be aware of time zones.** Systems may store times in Coordinated Universal Time or in local time, and businesses operating across Australian states face different time zones and daylight saving rules.
- **Align with financial periods.** The Australian financial year runs from 1 July to 30 June, so year-on-year comparisons must use the right boundaries.

## Common mistakes that produce wrong answers

| Mistake | Effect | Prevention |
|---|---|---|
| Joining to a table with several matching rows | Totals multiply, for example order totals counted once per order line | Summarise before joining, or sum at the right level |
| Forgetting cancelled, deleted or test records | Totals too high | Learn the status values and filter deliberately |
| Ignoring NULLs | Rows silently excluded | Test with `IS NULL` and decide how to treat them |
| Wrong date field or boundary | Records in the wrong period | Use the right date and half-open ranges |
| Comparing text with numbers | Unexpected sorting and matching, such as "10" before "9" | Check data types |
| Mixing currencies or units | Meaningless totals | Convert first, or group by currency or unit |
| Using the live system for heavy queries | Slows the system for everyone | Use a reporting copy or run at quiet times |

The first mistake, sometimes called **fan-out**, is the most common. If an order has five lines and a query joins orders to order lines and then sums the order total, each order is counted five times. Results look plausible but are badly wrong.

## Checking results before trusting them

Every new query should be checked:

1. **Reconcile with a known figure**, such as total sales for a month from the finance system.
2. **Check counts**: does the number of rows make sense?
3. **Inspect samples**: look at individual records behind a total, especially the largest and the unusual.
4. **Test edge cases**: records with missing values, cancelled status or dates on period boundaries.
5. **Ask a colleague** who knows the data to read the query.

Write down what each query does and the assumptions behind it, so others can reuse and check it. The [reports that change decisions](/insights/reports-that-change-decisions/) article discusses how to turn checked numbers into reports people act on.

## Making queries readable and reusable

Queries are read far more often than they are written, by colleagues, auditors and the author months later. A few habits make them much easier to understand:

- **Put each clause on its own line** and indent conditions, as in the examples above.
- **Name the columns you need** rather than using `SELECT *`, which returns every column and breaks saved reports when tables change.
- **Use meaningful aliases**, such as `c` for customers and `o` for orders, consistently.
- **Add comments** explaining business rules, written after two hyphens, such as `-- exclude internal transfer customers`.
- **Keep definitions in one place**, for example as a view, so that "active customer" or "on-time delivery" means the same thing in every report.
- **Store queries in a shared, version-controlled location** rather than personal folders.

## Changing data is a different matter

SQL can also add, change and delete data, using statements such as `INSERT`, `UPDATE` and `DELETE`. Business users should generally leave these alone. Changes made directly in the database bypass the application's business rules, approvals and audit trails, and a single mistake can be severe: an `UPDATE` statement without a `WHERE` clause changes every row in the table, not just the intended one. Corrections to business data should normally be made through the application, or by administrators following a controlled change process with a backup taken first and the change tested on a copy.

### Be considerate of shared systems

Even read-only queries consume resources. A query that scans millions of rows or joins large tables without suitable conditions can slow the system for everyone using it. Test new queries on small date ranges first, run heavy analysis on a reporting copy or outside busy hours, and ask the system's administrator for help when queries are slow rather than running them repeatedly.

## Beyond the basics

Once the core is comfortable, a few further features are worth learning:

- **Views**: saved queries that behave like tables, useful for standard definitions such as "active customers".
- **Common table expressions**: named steps within a query, written with `WITH`, that break complex questions into readable parts.
- **Window functions**: calculations across related rows, such as running totals, rankings and comparisons with the previous period, without collapsing rows.
- **CASE expressions**: conditional logic, such as grouping order values into size bands.

## Where SQL fits with spreadsheets and reporting tools

SQL, spreadsheets and business intelligence tools work well together. SQL is best for selecting, joining and summarising data at the source; spreadsheets suit modelling and ad hoc analysis of the results; reporting tools present regular measures attractively and consistently. Many reporting tools generate SQL behind the scenes, and understanding it helps users see how their dashboards are calculated. The [turning business data into decisions](/insights/turning-business-data-into-decisions/) article covers how these tools fit into a wider approach to business data.

## A worked example

This is an illustrative example. A sales manager at an industrial supplier wants to know which established customers have reduced their purchases significantly this financial year compared with last, so the sales team can follow up.

**Defining the question.** With the finance manager, the sales manager defines it precisely: customers who bought at least $20,000 in the last financial year and whose purchases in the first quarter of this year are more than 30% below the same quarter last year, excluding cancelled orders and credit notes handled separately.

**Writing the query.** An analyst writes a query in steps using common table expressions: first, sales by customer for each quarter; second, last year's total by customer; third, a comparison filtering for the defined conditions. Half-open date ranges follow the financial year.

**Checking.** The total of all customers' sales for each quarter is reconciled with the finance system's figures and agrees. A first version produces totals about four times too high for some customers, traced to joining order lines before summing order totals; the query is corrected to sum at the line level.

**Result.** Of about 420 customers meeting the size threshold, the query identifies 37 with a fall of more than 30%. The sales team contacts each, finding that several had changed suppliers because of delivery problems, which leads to a separate review of dispatch performance. The query is saved as a view and rerun each quarter.

## Applying this in an Australian business

- **Arrange read-only access** to a reporting copy of key data.
- **Learn the core**: select, filter, join, group and sort.
- **Handle NULLs and dates deliberately.**
- **Watch for fan-out** when joining and summing.
- **Reconcile new queries** with known figures before use.
- **Document queries and definitions** so they can be reused and checked.
- **Protect personal and sensitive data** in results.

## Questions worth considering

- Which questions do we regularly wait days to answer that a simple query could answer?
- Who in the business understands how our key reports are calculated?
- Do we have a safe, read-only way to query our data?
- Have we reconciled our regular reports against the source systems recently?
- Where are our standard definitions, such as active customer or on-time delivery, written down?

## Bringing it together

SQL is the standard language for asking questions of business databases, and a modest command of it lets managers and analysts answer questions directly, understand how reports are calculated and communicate precisely with system builders. Start with safe, read-only access, learn to select, filter, join and summarise, handle missing values and dates carefully, watch for double counting when joining tables and always check results against known figures before acting on them.

---

*Source: KEVOS editorial notes, drawing on general relational database and SQL practice. Syntax varies between database products; check the documentation for your system. The worked example is illustrative. This article is general information.*
