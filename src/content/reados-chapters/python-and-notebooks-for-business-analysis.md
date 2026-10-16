---
title: "Python and notebooks for business analysis: when to move beyond spreadsheets and how to keep work reproducible"
description: "What Python and notebooks offer business analysts, when they beat spreadsheets, the main libraries, reproducibility, data security and sensible controls for analysis that informs decisions."
publishDate: 2026-10-16
category: "Technology"
tags:
  - systems
  - automation
  - operations
author: "KEVOS"
featured: false
draft: false
---

Spreadsheets remain the most widely used analysis tool in business, and for good reason. They are flexible, visible, familiar and available on almost every computer. But many analysts and managers eventually reach the limits of spreadsheets: monthly reports that take a day of copying, pasting and checking; files that slow to a crawl with a few hundred thousand rows; formulas that nobody else can follow; and analyses that cannot be repeated exactly because nobody recorded each manual step.

**Python**, a general-purpose programming language, has become one of the most popular tools for going further. With a handful of widely used libraries, it can read data from spreadsheets, databases and systems, clean and combine it, calculate summaries, build charts, run statistical models and produce reports, with every step written down so the whole analysis can be repeated at the press of a button. **Notebooks** combine code, results, charts and explanatory text in a single document, which makes them popular for exploring data and sharing analyses.

This article explains what Python and notebooks offer business analysis, when they are worth using instead of spreadsheets, the main libraries and tools, how to keep analysis reproducible and reviewable, how to handle data securely, the risks of notebooks and how a business can introduce these tools sensibly. It is part of a series on software and cloud foundations for business leaders and assumes no programming knowledge.

## Where spreadsheets struggle

Spreadsheets work well for small datasets, one-off calculations, financial models that people need to inspect cell by cell and quick what-if analysis. They struggle when:

- **data is large**: spreadsheet applications have row limits, around a million rows in Excel, and become slow well before that;
- **the same analysis is repeated** with new data each week or month, requiring manual steps that are tedious and error-prone;
- **data comes from several sources** that must be combined, cleaned and matched;
- **logic is complex**, spread across many sheets and nested formulas that are hard to review;
- **the steps are not recorded**, so nobody can tell how a figure was produced; and
- **statistical or modelling methods** are needed beyond the built-in functions.

The [when a business outgrows its spreadsheets](/reados/collections/database-foundations-for-business/outgrowing-spreadsheets-choosing-a-database-approach/) article covers the related question of moving business records into databases. This article focuses on analysis: turning data into figures, charts and findings.

## What Python is

Python is a programming language first released by Guido van Rossum in 1991. It is known for readable code that resembles plain English more than many languages, a very large collection of free libraries and a broad community of users in data analysis, science, engineering, web development and automation. It is free, open-source software that runs on Windows, macOS and Linux and in many cloud services.

For analysis, Python's appeal lies less in the language itself than in its libraries, which provide ready-made tools for almost every common task.

## The main libraries for analysis

A small set of libraries covers most business analysis:

- **pandas** provides tables of data, called data frames, with tools to read files and databases, filter, sort, group, join, reshape and summarise data. It is the workhorse of Python analysis.
- **NumPy** provides fast numerical calculations on which pandas and many other libraries are built.
- **Matplotlib** and libraries built on it produce charts, from simple bar charts to complex multi-panel figures.
- **Statistical and machine learning libraries**, such as statsmodels and scikit-learn, provide regression, hypothesis tests, forecasting and predictive models.
- **Libraries for files and systems** read and write Excel workbooks, CSV files, PDFs and data from databases and web APIs.

These libraries are widely used, well documented and actively maintained, which matters for a business that will depend on analysis built with them.

## What a typical analysis looks like

A Python analysis is a sequence of steps, each written as a few lines of code:

1. **Read** the data, such as last month's sales export, the product list and the customer file.
2. **Clean** it, such as removing test transactions, standardising product codes and handling missing values.
3. **Combine** it, such as matching sales to products and customers.
4. **Calculate** the measures needed, such as sales and margin by product group and region.
5. **Visualise** the results in charts.
6. **Export** tables and charts to a report, spreadsheet or dashboard.

Next month, the same code runs on the new data and produces the same report in minutes. Each step is visible in the code, so a reviewer can see exactly what was done, including which records were excluded and why.

## What notebooks are

A **notebook** is a document that mixes blocks of code, their outputs, such as tables and charts, and formatted text explaining the reasoning. The most widely used notebook system is Jupyter, which grew out of an earlier interactive Python project and became a separate project in 2014. Notebooks run in a web browser, on a local computer or in cloud services, and similar notebook tools are built into many analytics platforms.

Notebooks suit:

- **exploring data**, trying ideas and seeing results immediately;
- **explaining analysis**, with narrative alongside code and charts; and
- **sharing work** with colleagues who want to see both the results and how they were obtained.

Microsoft has also added the ability to run Python within Excel in some Microsoft 365 editions, with the code running in Microsoft's cloud, which offers a bridge for teams that want to stay in spreadsheets while using Python libraries.

## Reproducibility: the main advantage

**Reproducible** analysis can be repeated, by the same person or someone else, and produce the same results from the same data. This matters for business decisions because:

- figures can be checked and traced back to their sources;
- errors, once found, can be corrected and the whole analysis re-run;
- regular reports can be produced reliably with new data; and
- the analysis survives the departure of the person who built it.

Practices that support reproducibility include:

- **keeping raw data unchanged** and doing all cleaning in code;
- **recording where each data source came from** and when it was extracted;
- **storing code in version control**, so changes are recorded and reviewable;
- **recording library versions**, so the analysis can be run in the same environment later;
- **running notebooks from top to bottom** before sharing results; and
- **writing short explanations** of assumptions, exclusions and decisions alongside the code.

## The hidden-state problem in notebooks

Notebooks allow code blocks to be run in any order and re-run individually. This makes exploration easy, but it also means a notebook can show results produced by code that has since been changed or deleted, or by blocks run in an order that cannot be repeated. A notebook that "works" for its author may fail or give different results for anyone else.

The remedy is simple discipline: before relying on or sharing a notebook, restart it and run every block in order from the beginning. Analyses that will be run regularly are often moved from notebooks into plain scripts, which always run top to bottom and are easier to schedule, test and review.

## Checking analysis

Code makes analysis repeatable, but it does not make it correct. Mistakes in joins, filters and calculations can produce plausible but wrong figures. Good practice includes:

- **reconciling totals** with known figures, such as checking that total sales match the accounting system;
- **counting records** at each step to spot unexpected losses or duplicates, a common result of joining tables incorrectly;
- **checking a few individual cases** by hand;
- **having another person review** important analyses, including the code; and
- **writing simple automated checks**, such as confirming that no product is missing a category.

The same disciplines apply in SQL, which is often used alongside Python to retrieve data, as the [SQL for managers and analysts](/reados/collections/sql-queries-and-data-correctness/sql-for-managers-and-analysts/) article explains.

## Automating regular reports

Once an analysis is reliable, it can be scheduled to run automatically: extracting data overnight, producing charts and tables and emailing a report or updating a dashboard. Automation saves time and reduces errors, but it also needs ownership. Someone must be alerted if the job fails, and someone must update it when source systems or business definitions change.

## Data security and privacy

Analysis often involves customer, staff and financial data. Moving that data into analysis tools introduces risks:

- **copies on laptops** that may be lost, stolen or kept indefinitely;
- **credentials for databases and systems** written into code or notebooks that are then shared;
- **notebooks containing outputs** with personal information, shared more widely than intended;
- **cloud notebook services and AI assistants** that may store data outside the business's control; and
- **libraries downloaded from public repositories**, which occasionally include malicious packages with names similar to popular ones.

Sensible controls include analysing data in secured locations, using only the fields needed, de-identifying data where possible, keeping credentials out of code, clearing outputs before sharing notebooks, installing libraries only from trusted sources with care over names, and applying privacy obligations to analysis just as to any other use of personal information.

## Skills and support

Learning enough Python to automate common analysis takes most motivated analysts weeks rather than years, especially with structured courses and the help of AI coding assistants. AI assistants can draft code quickly, but their output must be checked as carefully as any other analysis, because plausible code can contain subtle errors. Businesses should avoid relying on a single person who understands every script; pairing, code review and documentation spread knowledge.

## When spreadsheets remain the better tool

Python does not replace spreadsheets entirely. Spreadsheets remain better for small, one-off analyses, financial models that stakeholders want to inspect and adjust directly, data entry and quick calculations. Many teams use both: Python to extract, clean, combine and summarise data, and spreadsheets to present results and let others explore them. The aim is the right tool for each task, not a wholesale change. The [turning business data into decisions](/reados/collections/reporting-history-and-analytical-data/turning-business-data-into-decisions/) article explains how analysis of any kind should connect to practical decisions.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A distributor of electrical components produces a monthly margin report for the management meeting. The finance analyst exports sales from the ERP system, product costs from a separate costing spreadsheet and rebate data from supplier statements, then combines them in a large workbook. The process takes about two days each month, and figures occasionally change after the meeting when errors are found.

The analyst rewrites the process in Python over several weeks, with help from a contractor who reviews the code. The script reads the three sources, standardises product codes, excludes internal transfers, matches costs and rebates and calculates margin by product group, customer segment and sales representative. It checks that total sales match the general ledger, reports any products without costs and produces charts and a summary workbook for the meeting. The code is stored in version control, with notes explaining each business rule.

The monthly report now takes about an hour, mostly spent reviewing exceptions. In the first run, the checks reveal 140 products with outdated costs that had been silently treated as zero-cost in the old workbook, overstating margin in one product group by several percentage points. Management decisions about pricing in that group are revised.

## How this applies to a small Australian business

- **Consider Python for repeated, large or multi-source analyses.**
- **Keep raw data unchanged** and clean it in code.
- **Store analysis code in version control.**
- **Run notebooks top to bottom** before sharing results.
- **Reconcile totals and count records** at each step.
- **Have important analyses reviewed** by another person.
- **Protect personal and financial data** in analysis work.
- **Keep spreadsheets** for what they do best.

## Common mistakes

- **Trusting results because they came from code.**
- **Sharing notebooks** that only work when run in a particular order.
- **Embedding passwords** in scripts and notebooks.
- **Leaving copies of sensitive data** on personal devices.
- **Automating reports** without anyone owning failures.
- **Depending on one person** who understands every script.

## Frequently asked questions

**Is Python hard to learn for spreadsheet users?** Analysts comfortable with spreadsheet formulas usually find basic data analysis in Python achievable within weeks. Understanding data, business rules and checking results remains the harder skill, whatever the tool.

**Do we need special computers or servers?** No. Python runs on ordinary computers, and cloud notebook services are available. Very large datasets may need more memory or a database, but most business analysis fits on a standard laptop.

**Is Python free to use commercially?** Python and its main analysis libraries are free, open-source software. Some distributions and tools built around them have licence conditions, particularly for larger organisations, which should be checked.

**Should notebooks be used for production reports?** Notebooks suit exploration and explanation. Regular automated reports are usually more reliable as scripts, with tests and scheduling.

**Can AI assistants write the analysis?** They can draft code quickly and help analysts learn, but the code must be understood, reviewed and checked against known figures before results are relied on.

## Questions to ask

- Which of our analyses are repeated every month by hand?
- Could someone else reproduce our key figures from the raw data?
- How do we check that our analysis results are correct?
- Where does sensitive data go when it is analysed?
- Who else understands the scripts we depend on?

## Bringing it together

Python and notebooks extend business analysis beyond the limits of spreadsheets, handling larger data, combining sources and recording every step so analyses can be repeated, reviewed and automated. Libraries such as pandas, plotting tools and statistical packages cover most needs. The benefits depend on discipline: unchanged raw data, version control, notebooks run in order, reconciliations and reviews, careful handling of sensitive data and shared knowledge. Used alongside spreadsheets rather than in place of them, these tools make analysis faster and more trustworthy.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
