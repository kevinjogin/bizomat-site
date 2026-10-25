---
book: cad-data-you-can-trust
chapterSlug: part-numbers-and-file-names
order: 2
title: "Part numbers and file names that last"
description: "Choose between intelligent, sequential and hybrid part numbers, check a scheme's capacity, tie file names to numbers and keep meaning in properties where it can change safely."
draft: false
---

A part number is a promise that one identifier will always mean one thing. Drawings, bills of materials, purchase orders, stock locations, inspection records and spare-parts lists all rely on it. Once a number has been used outside the engineering office, changing what it means is expensive and sometimes impossible. That is why numbering deserves careful thought before a vault is configured, and why the decision is better made once than corrected later.

This chapter compares the main numbering approaches, tests the running case team's old and new schemes for capacity, decides how file names relate to part numbers and shows where descriptive information belongs. Its error case is an intelligent number whose built-in meaning stopped being true.

## Three approaches

Part numbering schemes fall into three broad families.

**Intelligent numbers** encode information in the number itself. A number such as SK-BF-07 might mean "skid, baseframe, seventh design". People like intelligent numbers because they can read them: a glance tells them roughly what the part is.

**Sequential numbers** carry no meaning. Each new item receives the next number from a register: 210417, 210418, 210419. Nobody can tell what 210418 is without looking it up.

**Hybrid numbers** combine a small amount of stable meaning with a sequence. A common pattern is a short prefix for the kind of document or item, followed by a sequential number. The prefix is limited to something that will never change, such as whether the item is a drawing, a purchased part or a made part.

```figure
type: compare
title: Intelligent, sequential and hybrid numbers
cols: Strength | Weakness
caption: This is an illustration. The weaknesses of intelligent numbers appear over years, as products and categories change.
- Intelligent | readable at a glance; groups similar items | meaning goes stale; categories overflow; reused parts carry the wrong meaning
- *Sequential | never goes stale; never overflows in practice; simple to issue | unreadable without a lookup; needs good descriptions and search
- Hybrid | small, stable meaning plus a sequence | the prefix can still be misused if it encodes anything that changes
```

The case for intelligent numbers was stronger when lookups were slow, because a readable number saved a trip to the drawing register. With searchable properties in a vault or a business system, the lookup takes seconds, and the weaknesses of intelligent numbers matter more than their convenience.

## Test the old scheme's capacity

The running case team's old scheme was intelligent. Numbers took the form SK-category-sequence, with a two-letter category such as BF for baseframes, PW for pipework and GD for guards, and a two-digit sequence within each category. Each category could therefore hold **99** items, numbered 01 to 99.

The team designed about **25** new baseframes a year, counting variants for different pumps and motors. At that rate, the baseframe category filled in about **99 ÷ 25 ≈ 4 years**. When it filled, someone invented a second category, BG, for "more baseframes", and the meaning of the category letters began to blur. By the time of the scan in Chapter 1, the team had BF, BG and BH, and nobody could say reliably what distinguished them.

Capacity failure is a common fate of intelligent schemes. A field sized for the expected number of items fills faster than expected, because products grow and variants multiply. The fix is always a workaround that weakens the meaning the scheme was designed to carry.

## Test the new scheme's capacity

The team chose a sequential scheme of six digits, starting at 100000. That gives numbers from 100000 to 999999, a capacity of **900,000** numbers. The team issues about **2,300** new numbers a year, counting parts, assemblies and drawings that carry their own numbers. At that rate the scheme lasts **900,000 ÷ 2,300 ≈ 391 years**.

```figure
type: bars
title: Years until each scheme runs out
unit: years
max: 400
caption: This is an illustration. The old figure is for one category at 25 new items a year; the new figure is for the whole scheme at 2,300 numbers a year.
- Old intelligent scheme, baseframe category | 4
- *New six-digit sequential scheme | 391
```

A capacity of nearly four centuries is far more than needed. The point of the calculation is not the exact figure but confidence that the scheme will not need to be changed during the working life of anyone now employed, even if the issue rate doubles or trebles. At three times the current rate the scheme still lasts about 130 years.

The team considered starting at 000001 instead and rejected it. Leading zeros are dropped by spreadsheets and some business systems, turning 000417 into 417 and creating a different string. Starting at 100000 gives every number the same length without depending on leading zeros.

## Consider a check digit

A check digit is an extra digit calculated from the others, so that most typing errors produce an invalid number. If someone types 210471 instead of 210417, a scheme with a check digit can usually reject it rather than finding a different, valid part.

The team discussed check digits and decided against them for now. Most of its numbers are copied electronically, from the vault into the business system, rather than typed. Where numbers are typed, in the stores and on the workshop floor, the business system shows the description beside the number, which catches most errors. The decision was recorded with its reasons so it can be revisited if typed entry increases. READOS's chapter on [designing identifiers and check digits](/reados/collections/operational-data-records-and-controls/designing-identifiers-and-check-digits/) explains how check digits work and when they are worth adding.

## Put meaning in properties

A sequential number does not remove the need for descriptive information. It moves that information to where it can change safely: the item's properties. Category, product family, material, finish and description all become properties that can be searched, filtered and, if necessary, corrected without changing the number.

```figure
type: layers
title: What the number carries and what properties carry
caption: This is an illustration. The number identifies; properties describe. Only the identifier must never change.
- *Part number | 210417 | issued once from the register, never reused, never changed
- Description | PLATE PUMP MTG 316 12MM | can be corrected if wrong
- Category | baseframe component | can change if the part is reused elsewhere
- Material and finish | 316 stainless, pickled and passivated | changes create a new revision or a new number, by rule
- Where used | 14 assemblies in 6 projects | calculated by the vault, never typed
```

The last row matters. In the old intelligent scheme, the number claimed to say where a part belonged. In the new scheme, the vault calculates where it is actually used, which is always current.

The team adopted a rule for when a change needs a new number rather than a new revision. The rule is borrowed from the idea of interchangeability: if the changed part can replace the old one in every existing use without any other change, it keeps its number and receives a new revision. If it cannot, it receives a new number. Chapter 4 applies this rule.

## Tie file names to part numbers

On a shared drive, file names carried most of the identity of a file, which is why duplicate names caused so much trouble. In a vault, the team made the file name equal to the part number, followed by the file type that the CAD system adds. The plate became 210417 plus its extension; its drawing became 210417 plus the drawing extension.

Using the number as the file name has three effects. It makes duplicate names impossible within the vault, because numbers are unique. It removes the temptation to put descriptions in file names, where they go stale. And it makes every reference in every assembly a reference to a number rather than to a description, which is both shorter and permanent.

The cost is that file names are no longer readable. Designers accustomed to browsing folders of named files found this uncomfortable at first. The vault's search and its display of description alongside the number made up for it within a few weeks. The team also found that browsing folders became less necessary once the where-used and search tools were available.

## Drawings, documents and assemblies

A numbering scheme must also decide how drawings and other documents are identified. The team considered giving drawings their own numbers, separate from part numbers, and rejected it. A drawing that describes one part takes the part's number, so that drawing 210417 always describes part 210417. That one-to-one link removes a lookup and a class of errors, such as a purchase order quoting the right part number and the wrong drawing number.

Assemblies take their own numbers from the same sequence, like any other item, because an assembly is an item that can be built, stocked and sold. Multi-sheet drawings keep one number and add sheet numbers; they do not take a number per sheet.

Some documents do not describe a single item: a general arrangement drawing for a whole skid, a calculation, a test report or an installation manual. The team numbers these from the same sequence, with a property recording the document type. Using one sequence for everything keeps the register simple and means that any number found anywhere in the business can be looked up in one place. A document type property, rather than a prefix, records what kind of document it is, which keeps the number free of meaning that might change.

There is one exception the team allows. A drawing that defines several closely related items, such as a tabulated drawing for the seven lengths of a pipe spool, carries its own number and lists the item numbers it defines. Each item still has its own number for purchasing and stock. The tabulated drawing saves drafting effort, and the property links let the vault show which drawing defines which item.

## Issue numbers from one register

Numbers must be issued from one place, so that two people cannot issue the same number. Most vaults can generate the next number automatically when a file is created, which is the simplest approach. Where numbers are also needed outside the vault, for example for a bought item that has no CAD model, the vault's number generator or a single shared register must be the only source.

The team's rule is that a number, once issued, is never reused, even if the item is abandoned before release. Reusing numbers saves nothing worth having, given a capacity of 900,000, and creates exactly the kind of ambiguity the scheme exists to prevent.

## The error case: when built-in meaning stops being true

Under the old scheme, a pump mounting plate designed for the baseframe of one skid was numbered SK-BF-31, meaning "baseframe component". Two years later, the same plate was reused as a mounting plate inside a guard assembly on a different product, because it happened to have the right size and holes. Its number still said BF.

A purchasing officer reviewing spending on baseframe components used the BF category to total costs and included the plate. A production planner looking for guard components searched for GD and did not find it, so the guard's kit list was short one plate when it reached the workshop. The plate was eventually found and fitted, after an hour lost on the floor and a day's delay to dispatch.

The number had not been wrong when it was issued. It became wrong when the part was reused, and nothing in the scheme could correct it, because changing a number used in drawings, purchase records and stock would have created a bigger problem than it solved. The error was detected by the short kit and traced to the category assumption.

Under the new scheme, the plate carries a sequential number and a category property. When it is used in a guard, the vault's where-used list shows both uses, and any report that needs to know where the plate is used calculates it from the assemblies rather than reading it from the number. The planner's kit list is generated from the assembly's bill of materials, not from a category search, so it includes the plate regardless of which family it was designed for.

## Migrate old numbers carefully

The team could not renumber its old parts. Thousands of old numbers appear on drawings in customers' hands, in maintenance manuals and in stock records. The new scheme therefore applies to new items, and old items keep their old numbers, stored in the vault's part number property.

To keep both kinds of number searchable, the team added a property, "Legacy number", and recorded the old intelligent number there for every migrated item. For old items, the file name became the old number with its punctuation normalised, so that SK-BF-31 became SKBF31. This kept file names unique and searchable without pretending that old numbers were part of the new sequence. Chapter 6 explains how this mapping was applied during migration.

## Exercise: size a hybrid scheme

The team's purchasing officer suggests a hybrid scheme instead: a one-letter prefix, M for made items and B for bought items, followed by a five-digit sequence starting at 10000. Made items account for about 1,600 of the 2,300 numbers issued each year and bought items for about 700. How long would each sequence last? Is the prefix safe?

**Answer.** A five-digit sequence from 10000 to 99999 gives **90,000** numbers. The made sequence lasts **90,000 ÷ 1,600 ≈ 56 years**; the bought sequence lasts **90,000 ÷ 700 ≈ 129 years**. Both are long enough for practical purposes, though the made sequence would fall to about 28 years if the issue rate doubled.

The prefix is safer than a category code, because whether an item is made or bought changes less often than its category. It can still change: a part made in-house today may be bought from a supplier next year. If that happens, the prefix becomes wrong, exactly like the BF plate. The safer design is to keep make-or-buy as a property and use a single sequence for both, as the team chose. If the team prefers the hybrid for other reasons, it should adopt a rule that a change from made to bought keeps the existing number and updates the property, and accept that the prefix records the original decision rather than the current one.
