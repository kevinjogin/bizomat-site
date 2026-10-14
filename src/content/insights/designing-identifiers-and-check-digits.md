---
title: "Designing identifiers: part numbers, job numbers, serial numbers and check digits that prevent errors"
description: "Numbers that identify parts, jobs, customers and products underpin every system. How to design identifiers that stay unique and stable, avoid confusion and catch typing errors."
publishDate: 2026-10-09
category: "Operations"
tags:
  - systems
  - quality
  - manufacturing
author: "KEVOS®"
featured: false
draft: false
---

Every business system depends on identifiers: part numbers, job numbers, customer and supplier numbers, serial numbers, batch numbers, invoice numbers, asset tags and document numbers. People type them, read them aloud over the phone, write them on job sheets, print them on labels and scan them from barcodes. When identifiers are well designed, records link reliably across systems and years. When they are badly designed, hours are charged to the wrong job, the wrong part is picked, two products share a number, a serial number is reused, and a spreadsheet silently strips a leading zero or turns a code into a date.

Identifier design is rarely given much thought because it seems trivial. Most schemes simply grow: someone starts a numbering pattern, others add exceptions, and years later the business has part numbers that encode outdated categories, job numbers that clash after a system change and serial numbers that cannot be traced. Fixing an identifier scheme after it is embedded in drawings, labels, systems and customers' records is expensive, so it pays to get it right early and to know what good looks like.

This article explains the properties of good identifiers, the debate between meaningful and plain numbers, how to choose formats and characters that people and machines handle reliably, how check digits catch typing errors, how to design serial and batch numbers, how to handle revisions and other organisations' identifiers, and how to manage identifiers over time. It is general information for managers, engineers and anyone specifying business systems.

## Properties of a good identifier

| Property | Why it matters |
|---|---|
| Unique | Two things sharing an identifier will eventually be confused |
| Stable | An identifier that changes breaks links in systems, documents and labels |
| Never reused | Reusing a retired number mixes old and new histories |
| Unambiguous | Characters that look or sound alike cause errors |
| Appropriate length | Long enough for future growth, short enough to read and type |
| Easy to capture | Works with barcodes, labels, forms and phone conversations |
| Assigned by one authority | Prevents duplicates from parallel numbering |

## Meaningful or plain identifiers

**Meaningful**, sometimes called intelligent, identifiers encode information. A part number such as "BR-SS-M12-50" might stand for a bolt, stainless steel, M12 thread, 50 millimetres long. **Plain** identifiers, sometimes called non-significant, carry no meaning: part 104857 is simply the next number in sequence.

| | Meaningful identifiers | Plain identifiers |
|---|---|---|
| Strengths | People can recognise items from the number; similar items sort together | Never need to change; no scheme to break; easy to generate |
| Weaknesses | Break when items do not fit the scheme or attributes change; schemes run out of codes; encourage guessing | Mean nothing without a lookup; similar items may be far apart |

Meaningful schemes look attractive at first but often age badly. A category embedded in a part number becomes wrong when the product moves to another category; a two-digit material code runs out; a new product fits no existing pattern. Many businesses now use **plain identifiers** for identity, and store attributes such as category, material and size as separate searchable fields. Short **prefixes** indicating the type of record, such as "J" for jobs and "Q" for quotes, are a useful middle ground, because record types rarely change.

Whatever the choice, never change an identifier because an attribute changed. If an item's material changes in a way that affects form, fit or function, it usually needs a new identifier altogether, as a different item.

## Formats and characters

Many identifier errors come from characters and formats that people or software misread:

- **Avoid look-alike characters** in schemes that people type or read: the letter O and zero, the letter I and one, lower-case L and one, S and 5, Z and 2, B and 8. Many schemes use digits only, or exclude confusing letters.
- **Avoid case sensitivity**: "ab12" and "AB12" should not be different identifiers.
- **Use a fixed length** where practical, so missing or extra characters are obvious.
- **Beware of leading zeros**: spreadsheets often remove them, turning 001234 into 1234. Either avoid leading zeros or make sure files treat identifiers as text.
- **Beware of codes that look like dates or numbers**: spreadsheets may convert "MAR1" to a date or "1E5" to 100,000. Geneticists experienced this so often that in 2020 the international committee that names human genes renamed several genes to stop spreadsheet software converting their symbols into dates.
- **Group long identifiers** for reading, such as 4821-5937, but store them without separators, or with them consistently.
- **Choose lengths with growth in mind**: a five-digit job number allows 99,999 jobs; check how quickly the business will use them.

## Check digits: catching typing errors

A **check digit** is an extra character calculated from the other characters in an identifier. When someone enters the identifier, the system recalculates the check digit and rejects the entry if it does not match. Check digits catch most common typing errors, such as a single wrong digit or two adjacent digits swapped.

Check digits are everywhere: product barcodes use a check digit defined by GS1, the global standards organisation for product identification; credit card numbers use a formula commonly known as the Luhn algorithm, devised by Hans Peter Luhn at IBM; and Australian Business Numbers and Tax File Numbers include their own check calculations.

### A worked check digit

One simple method, the one used in GS1 product numbers, works like this:

1. Starting from the rightmost digit of the base number, multiply digits alternately by 3 and 1.
2. Add the results.
3. The check digit is the amount needed to bring the total up to the next multiple of 10.

For a base job number 24517:

- From the right: 7 × 3 = 21, 1 × 1 = 1, 5 × 3 = 15, 4 × 1 = 4, 2 × 3 = 6.
- Total: 21 + 1 + 15 + 4 + 6 = 47.
- The next multiple of 10 is 50, so the check digit is 3, and the full job number becomes 245173.

If someone types 245713, swapping the 1 and 7, the base 24571 gives a total of 35, so its check digit should be 5, not 3. The system detects the error. This method catches every single-digit error and most swaps of adjacent digits, missing only swaps of digits that differ by five. More elaborate schemes catch even more errors.

Adding a check digit to internal identifiers, such as job numbers typed on timesheets or asset numbers keyed during maintenance, is cheap and can eliminate a whole class of errors.

## Serial and batch numbers

Serial and batch numbers identify individual items and production lots. Good practice includes:

- **Unique across the business**, not just within a product line, or include a product prefix so combinations are unique.
- **Never reused**, even when products are discontinued.
- **Assigned by the system** at a defined point, such as production order release, rather than by hand.
- **Linked to production records**: date, line, materials, revisions and inspection results.
- **Durable marking** suited to the product's life and environment, with both human-readable text and a machine-readable code.
- **Date information**, where useful, encoded in a documented way, or held in the linked record rather than in the number itself.

## Identifiers on labels and barcodes

Identifiers become far more reliable when they are scanned rather than typed. Common options include one-dimensional barcodes such as Code 128 for internal labels, and two-dimensional codes such as Data Matrix and QR codes, which hold more information in a small space and can be marked directly onto parts. GS1 standards define how product numbers, batch numbers, serial numbers and dates are combined in barcodes using short prefixes called application identifiers, which lets trading partners read each other's labels automatically.

Whatever the format, print the identifier in human-readable text beside the code, test scanning with the actual scanners and lighting used on site, choose label materials that survive the product's environment and check print quality, because a faded or smudged code simply moves errors back to the keyboard.

## Document and drawing numbers

Drawings, specifications, procedures and forms need identifiers too. The same principles apply: plain numbers or simple prefixes, one issuing authority, no reuse, and revisions held separately. Where a drawing describes one part, many businesses link the drawing number to the part number, or use the same number for both, so engineering and production records connect cleanly. The [drawing packages suppliers can quote and make from](/insights/drawing-packages-suppliers-can-quote-and-make-from/) article discusses how clear identification of drawings and revisions helps suppliers.

## Revisions

Documents, drawings and designs have **revisions** as well as identifiers. Keep the revision separate from the identifier, as a separate field, so the item remains the same item across compatible revisions. Common practice uses letters or numbers in sequence; engineering drawing standards such as ASME Y14.35 recommend avoiding letters easily confused with numbers, such as I, O, Q, S, X and Z. Decide clearly when a change is a new revision of the same item and when it requires a new identifier, usually when the change affects interchangeability.

## Other organisations' identifiers

Businesses deal with identifiers they do not control:

- **Customers' part numbers** for the items the business supplies.
- **Suppliers' part numbers** for items the business buys.
- **GS1 barcodes and product numbers** for products sold through retailers, which typically require them.
- **Australian Business Numbers** for customers and suppliers.
- **Government and industry identifiers**, such as licence and registration numbers.

Store these in **cross-reference** fields or tables linked to the business's own identifiers, rather than replacing internal identifiers with them. A customer's part number belongs to the customer's scheme and may change or clash with another customer's. Validate external identifiers where possible, such as checking an ABN's check calculation and status.

## Managing identifiers over time

- **One authority issues each kind of identifier**, usually a system that generates the next number, so duplicates cannot arise from parallel numbering.
- **Record retired identifiers** and block their reuse.
- **Document the scheme**: format, meaning of any prefixes, length, check digit method and rules for new identifiers versus revisions.
- **Plan for system changes**: when moving to a new system, keep existing identifiers where possible, because they appear on drawings, labels, documents and customers' records. Where they must change, keep the old identifiers as cross-references.
- **Handle mergers and acquisitions** by mapping both schemes, rather than renumbering everything immediately.

Identifier schemes are a form of data convention, and like other conventions they work best when agreed early and owned by someone. The [data readiness is a business habit](/insights/data-readiness-is-a-business-habit/) article explains why such conventions matter for usable data.

## Common mistakes

- **Encoding too much meaning** in identifiers that then have to change.
- **Look-alike characters** in typed identifiers.
- **Leading zeros and date-like codes** mangled by spreadsheets.
- **Reusing numbers** from discontinued items or old jobs.
- **Parallel numbering** in different systems or sites, creating duplicates.
- **No check digits** on identifiers that are frequently typed.
- **Replacing internal identifiers** with customers' or suppliers' numbers.
- **Revisions embedded in identifiers**, so each revision looks like a new item.

## A worked example

This is an illustrative example. A fabrication and maintenance contractor with 80 tradespeople records time against five-digit job numbers written on paper timesheets and typed into the payroll and job costing system. Analysis of a month's data shows that about 2% of time entries are charged to job numbers that do not exist or to the wrong job, discovered only when job costs look strange or customers query invoices.

**Changes.** New job numbers receive a sixth digit calculated with the alternating 3 and 1 method, so the system rejects mistyped numbers immediately. Job sheets carry a barcode of the full number, and supervisors' tablets scan it when entering time. Job numbers are issued only by the job system, ending the practice of site offices allocating their own blocks of numbers, which had produced several duplicates.

**Transition.** Existing open jobs keep their five-digit numbers, with check digits added and the old numbers stored as cross-references, so documents already issued remain traceable.

**Result.** Within two months, misallocated time falls to almost nothing. Job cost reports become trustworthy enough to use in quoting, and invoice queries caused by misallocated hours largely disappear. The changes cost a few days of configuration and some barcode printing.

## Applying this in an Australian business

- **List your identifier schemes**: parts, jobs, customers, suppliers, assets, serials, batches, documents.
- **Prefer plain identifiers** with attributes held in separate fields.
- **Remove look-alike characters** and protect leading zeros.
- **Add check digits** to identifiers people type often.
- **Issue identifiers from one authority** and never reuse them.
- **Keep revisions separate** from identifiers.
- **Cross-reference external identifiers**, such as customers' part numbers and ABNs.
- **Document the schemes** and preserve identifiers through system changes.

## Questions worth considering

- How often are job, part or asset numbers mistyped in our systems?
- Have we ever reused a number, or found two items sharing one?
- Which of our identifiers encode meaning that has since become wrong?
- Do our spreadsheets strip leading zeros or convert codes to dates?
- Who issues new identifiers, and could two people issue the same one?

## Bringing it together

Identifiers are the threads that tie records together across systems, documents and years. Good identifiers are unique, stable, never reused, unambiguous and easy to capture. Prefer plain numbers with attributes held separately, avoid look-alike characters and spreadsheet traps, add check digits where people type identifiers, issue them from one authority, keep revisions separate, cross-reference other organisations' numbers and preserve identifiers through system changes. Small design choices here prevent a steady stream of costly errors.

---

*Source: KEVOS® editorial notes, drawing on general information management, manufacturing systems and data quality practice. The worked example is illustrative. This article is general information.*
