---
title: "How computers store and process data: bits, numbers, text, dates and why business data goes wrong"
description: "How computers represent numbers, money, text, dates and images in bits and bytes, how processors, memory and storage work together, and the everyday data errors these explain."
publishDate: 2026-10-16
category: "Technology"
tags:
  - systems
  - quality
  - operations
author: "BIZOMAT"
featured: false
draft: false
---

Many everyday data problems in business look mysterious until the underlying mechanics are understood. A Darwin postcode of 0800 turns into 800 in a spreadsheet. A sixteen-digit account number ends in a string of zeros. Two systems calculate the same invoice total and differ by a cent. A customer's name with an accented letter appears as a jumble of symbols in an export. A report run at the end of the month includes some transactions from the next day. A storage drive sold as 1 terabyte shows as 931 gigabytes when installed.

None of these are random faults. They follow from how computers represent and process information: as patterns of binary digits, organised into numbers of fixed size, text encoded with particular conventions and dates stored as counts from a chosen starting point. Every piece of business data, from prices and quantities to names, photographs and drawings, passes through these representations. Understanding them helps managers recognise the causes of common data errors, set sensible rules for how data is entered and exchanged, and ask better questions when systems disagree.

This article explains bits and bytes, how computers store whole numbers, fractions and money, text and character encoding, dates and times, images and files, how processors, memory and storage work together and why speed varies so greatly between them, and how data integrity is protected. It closes the series on software and cloud foundations for business leaders.

## Bits and bytes

Computers store and process everything as **bits**, binary digits that are either 0 or 1. A bit corresponds to a physical state, such as a voltage in a circuit, a magnetic orientation on a disk or a charge in a flash memory cell. One bit can represent two possibilities; combining bits multiplies the possibilities: two bits give four combinations, three give eight and eight give 256.

A group of eight bits is a **byte**, the basic unit for measuring data. Larger quantities use prefixes:

- a **kilobyte** is about a thousand bytes;
- a **megabyte** is about a million;
- a **gigabyte** is about a billion; and
- a **terabyte** is about a trillion.

There is a long-standing ambiguity. Storage manufacturers use decimal units, so a terabyte is exactly 1,000,000,000,000 bytes. Some operating systems, including Windows, measure in binary units, in which each step is 1,024 times the previous one, while still labelling them "GB". The same drive therefore appears as about 931 "GB" on such a system. Strictly, the binary units have their own names, such as gibibyte, but these are seldom used outside technical contexts. No storage has gone missing; the units differ.

Everything a computer handles, whether a number, a letter, a pixel or an instruction, is ultimately a pattern of bits. What those bits mean depends entirely on how the software interprets them, which is why the **type** of data matters so much.

## Whole numbers

Whole numbers, or **integers**, are stored in binary in a fixed number of bits. The size sets the range: 8 bits can hold 256 different values, 16 bits about 65,000, 32 bits about 4.3 billion and 64 bits about 18 billion billion. Signed integers, which allow negative values, split the range: a signed 32-bit integer runs up to 2,147,483,647.

When a calculation exceeds the range, an **overflow** occurs. Depending on the system, the result may cause an error or silently wrap around to a large negative number. Overflows have caused real failures, and a well-known future example is the **year 2038 problem**: many older systems store time as a signed 32-bit count of seconds since 1 January 1970, which runs out in January 2038. Most modern systems use 64-bit values, but embedded devices and older software may not.

For business systems, integer limits most often appear in counters, identifiers and quantities that grow over years, such as invoice numbers or transaction IDs, and in older software designed when smaller sizes seemed ample.

## Fractions and the trouble with money

Numbers with fractional parts are usually stored as **floating-point** numbers, following an international standard. Floating-point represents numbers in binary scientific notation, with a fixed number of significant binary digits. It handles a vast range of values efficiently, which suits engineering and scientific calculations.

Its weakness is that many simple decimal fractions, such as 0.1, cannot be represented exactly in binary, just as one-third cannot be written exactly in decimal. Tiny representation errors arise and can accumulate. In many programming languages, adding 0.1 and 0.2 produces 0.30000000000000004 rather than exactly 0.3. For most measurements, the difference is negligible. For money, it is not acceptable: totals that differ by a cent cause reconciliation failures, and comparisons such as "is the amount paid equal to the amount owed" can fail unexpectedly.

Well-designed financial systems therefore store money as **decimal** types, which represent decimal fractions exactly, or as whole numbers of cents. They also apply explicit **rounding rules**: whether GST is rounded on each line or on the invoice total, and whether halves round up or to the nearest even digit, a method sometimes called banker's rounding. Two systems using different rules will produce different totals, which is the usual cause of one-cent discrepancies between systems.

## Precision in spreadsheets

Spreadsheet applications store numbers as floating-point values. Excel keeps about 15 significant digits, so a sixteen-digit number, such as some account, card or identifier numbers, has its final digits replaced by zeros when entered as a number. Identifiers like these are not quantities and should be stored as text.

The same principle applies to postcodes, phone numbers and part numbers with leading zeros. Darwin's postcode, 0800, becomes 800 when treated as a number. Formatting a column as text before entering or importing data, or using import settings that specify column types, prevents the loss. The [programming concepts for managers](/reados/collections/software-and-cloud-foundations/programming-concepts-for-managers/) article in this series explains why the type of each piece of data matters.

```figure
type: compare
title: When identifiers are stored as numbers
cols: Stored as a number | Stored as text
best: 2
caption: Excel keeps about 15 significant digits; codes that look like numbers are not numbers.
- Darwin postcode | 800 | 0800
- *A 16-digit account number | Last digit lost | All 16 digits kept
- Part number 00745 | 745 | 00745
```

## Text and character encoding

Text is stored as numbers too, with each character assigned a code by an **encoding**. The early, widely used ASCII standard defined 128 characters: unaccented English letters, digits, punctuation and control codes. Many regional encodings later extended it in incompatible ways, each covering different languages.

**Unicode** replaced this patchwork with a single catalogue of characters for virtually all the world's writing systems, together with symbols and emoji, now well over 100,000 characters. **UTF-8**, the dominant way of storing Unicode, uses one byte for ASCII characters and two to four bytes for others, and is the standard on the web.

Encoding problems arise when text written in one encoding is read as another. The classic symptom, sometimes called mojibake, is garbled characters where accented letters, curly quotation marks or dashes should be, for example in names like Zoë or Nguyễn after a file export and import. The cure is to use UTF-8 consistently and to specify the encoding when exporting and importing files. Matching names and addresses across systems raises further issues, such as case, accents and spacing, explored in the [text encoding, collation and reliable record matching](/reados/collections/sql-queries-and-data-correctness/text-encoding-collation-and-record-matching/) article.

## Dates and times

Computers usually store dates and times as numbers counted from a chosen starting point, called an epoch. Excel, in its default Windows setting, counts days from 1 January 1900, so a date is a whole number and a time is a fraction of a day. Many other systems count seconds or milliseconds since 1 January 1970 in Coordinated Universal Time, or UTC.

Common date and time problems include:

- **day and month order**: 03/04 means 3 April in Australia and 4 March in the United States, and imports can silently swap them;
- **time zones**: Australia has several, and Queensland, Western Australia and the Northern Territory do not observe daylight saving time, so the difference between states changes during the year;
- **daylight saving transitions**: one hour each year occurs twice and one does not occur at all in states that observe it;
- **end-of-period boundaries**: a transaction stored in UTC may fall on a different date from the local business day, so month-end reports can include or exclude the wrong transactions; and
- **dates without times or time zones**, which become ambiguous when shared across regions.

Good practice is to store timestamps in UTC with time zone information, convert to local time for display and reporting, and exchange dates in the unambiguous international format of year, month and day, such as 2026-04-03.

## Images, sound and other media

Images are stored as grids of **pixels**, each with numbers representing its colour, commonly as red, green and blue values of one byte each. A photograph of 6,000 by 4,000 pixels contains 24 million pixels, about 72 megabytes before compression. **Compression** reduces file sizes: **lossless** methods, used in formats such as PNG and ZIP, preserve every detail, while **lossy** methods, such as JPEG, discard detail people are unlikely to notice, achieving much smaller files at some cost in quality. Repeatedly editing and saving lossy files degrades them, which is why original masters should be kept, as the [images for print, web and documents](/reados/collections/business-systems-security-and-it-decisions/images-for-print-web-and-documents/) article explains. Sound and video are stored similarly, as sequences of numerical samples or frames, almost always compressed.

## Files and formats

A **file** is simply a named sequence of bytes. Its **format** defines how those bytes are organised and interpreted. A CSV file is plain text with values separated by commas; a modern Excel workbook is a compressed package of structured text files; a PDF has its own complex structure. The same bytes opened with the wrong software, or interpreted with the wrong assumptions about encoding, delimiters or decimal separators, produce nonsense or subtle errors.

Open, documented formats can be read by many programs and are more likely to remain readable in future. Proprietary formats may depend on a single vendor's software, which matters for records that must be kept for many years.

## Processors, memory and storage

A computer's main components divide the work:

- The **processor**, or CPU, executes instructions: arithmetic, comparisons and moving data. Modern processors have several **cores**, each able to work on a separate task at the same time, and run at billions of cycles per second.
- **Memory**, or RAM, holds the programs and data currently in use. It is fast but loses its contents when power is switched off.
- **Storage**, such as solid-state drives and hard disk drives, keeps data permanently. It is much larger and cheaper per byte than memory, but slower.
- **Networks** connect computers and carry data between them, from local office networks to the internet.

Processors also have small amounts of very fast **cache** memory to keep frequently used data close at hand.

## Why speed varies so much

The speed of these components differs enormously. Roughly, reading data from processor cache takes around a nanosecond; from main memory, around a hundred nanoseconds; from a solid-state drive, tens to hundreds of microseconds; from a hard disk, several milliseconds; and from a server on another continent, a hundred milliseconds or more. From cache to an overseas server is a difference of about a hundred million times.

These differences explain much about system performance. Software that keeps working data in memory is fast; software that repeatedly reads from disk or calls distant servers is slow. Adding memory often speeds up databases and analysis more than a faster processor does, and hosting systems close to their users reduces delays. The same thinking applies when choosing hardware for demanding work such as CAD, simulation and analysis of large datasets.

## Protecting data integrity

Bits can be corrupted by hardware faults, transmission errors, software defects and, rarely, cosmic radiation. Computers protect data in several ways:

- **checksums and hashes**, short values calculated from data that change if any bit changes, used to verify downloads, backups and transfers;
- **error-correcting memory**, used in servers, which detects and fixes single-bit errors in memory;
- **redundant storage**, such as mirrored drives, which keeps working if one drive fails; and
- **transactions** in databases, which ensure that related changes are saved completely or not at all.

None of these replace backups, which protect against deletion, corruption that is copied faithfully to every replica and ransomware.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A national plumbing supplies business merges customer and pricing data from a newly acquired branch network into its main system. After the import, several problems appear. Customers in the Northern Territory have postcodes of three digits. Trade account numbers from the acquired system, which are sixteen digits long, end in zeros and no longer match their invoices. Names with accented characters appear as strings of symbols. Price totals on some converted quotes differ by a cent from the original system. Orders entered before 8 am in Perth on the first day of each month appear in the previous month's report.

The data team traces each problem to its cause. The import spreadsheet treated postcodes and account numbers as numbers, dropping leading zeros and losing digits beyond fifteen. The export from the acquired system used an older regional encoding, while the import assumed UTF-8. The acquired system rounded GST on each line, while the main system rounded on the total. Order timestamps were stored in UTC, and the monthly report grouped them by UTC date rather than by local business date.

The team re-runs the import with postcodes and account numbers defined as text, the correct encoding specified and quotes recalculated using an agreed rounding rule. The monthly report is changed to group transactions by local business date. Checks are added to future imports: record counts, totals, the longest identifier length and a sample of names with special characters are compared between source and destination.

```figure
type: checklist
title: Four causes behind one messy import
caption: Checks now run on every import: record counts, totals and sample comparisons.
- ? Postcodes and account numbers treated as numbers
- ? An older regional encoding read as UTF-8
- ? GST rounded per line in one system, on the total in the other
- *? UTC timestamps grouped by UTC date, not local business date
```

## How this applies to a small Australian business

- **Store identifiers as text**, including postcodes, phone numbers, account and part numbers.
- **Use decimal types and agreed rounding rules** for money.
- **Use UTF-8** for all text exports and imports, and specify it.
- **Exchange dates as year-month-day** and record time zones.
- **Report by local business date**, taking account of Australian time zones.
- **Keep original masters** of images and documents.
- **Prefer open, documented file formats** for long-term records.
- **Check imports** with counts, totals and samples.

## Common mistakes

- **Letting spreadsheets convert identifiers** into numbers.
- **Storing money as floating-point numbers.**
- **Assuming all systems round the same way.**
- **Ignoring encoding** when moving text between systems.
- **Mixing day-month and month-day dates.**
- **Treating replicas as backups.**

## Frequently asked questions

**Why does a new drive show less space than advertised?** Manufacturers use decimal units, while some operating systems count in binary units with similar names. A 1 terabyte drive shows as about 931 "gigabytes" in such systems.

**Why do two systems disagree by a cent?** Usually because they round at different points, such as per line or per invoice, or use different rounding methods. Less often, because one stores money as floating-point numbers.

**What does UTF-8 mean on an export screen?** It is the standard way of encoding text that supports virtually all languages and symbols. Choosing it for exports and imports avoids most garbled-character problems.

**Should timestamps be stored in UTC?** For systems used across time zones or that exchange data, yes, with conversion to local time for display and reporting.

**Does more memory make a computer faster?** When the computer is short of memory for its work, yes, often dramatically, because data no longer has to be fetched from much slower storage. Beyond what the work needs, extra memory adds little.

## Questions to ask

- Which of our identifiers are at risk of being treated as numbers?
- Do our systems use the same rounding rules?
- Which encoding do our exports and imports use?
- How do our reports define the business day across time zones?
- How do we check that imported data matches its source?

## Bringing it together

Computers represent all data as bits, interpreted as integers of fixed size, floating-point or decimal numbers, encoded text, counts of time from an epoch, pixels and structured files. Processors, memory, storage and networks differ in speed by many orders of magnitude, which shapes how systems perform. Most everyday data errors, such as lost leading zeros, truncated identifiers, cent differences, garbled names and misplaced transactions, follow directly from these representations. Knowing why they happen makes them straightforward to prevent with sensible types, encodings, date formats, rounding rules and import checks.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations.*
