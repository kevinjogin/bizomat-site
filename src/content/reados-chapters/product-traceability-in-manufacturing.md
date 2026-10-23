---
title: "Product traceability in manufacturing: lots, serial numbers and records that make recalls manageable"
description: "Traceability links finished products to their materials, processes and customers. How to choose the level of detail, record and label it, test it and use it when something goes wrong."
publishDate: 2026-10-09
category: "Manufacturing"
tags:
  - manufacturing
  - quality
  - systems
author: "KEVOS®"
featured: false
draft: false
---

A supplier warns that a batch of raw material may be contaminated. A customer reports a failure in a product built last year. A test reveals that a gauge was out of calibration for three weeks. In each case, the first question is the same: which products are affected, and where are they now? A manufacturer with good traceability can answer within hours and act on a precise list. One without it may have to quarantine all stock, contact every customer who bought the product in a period of months, or accept the risk of leaving faulty products in service.

**Traceability** is the ability to follow a product's history: what it was made from, how and when it was made, what checks it passed and where it was sent. It is required by many customers and regulators and by quality management standards, but its practical value is greater than compliance. It limits the scope and cost of recalls, speeds investigations into failures and gives customers confidence.

This article explains backward and forward traceability, how to choose the level of detail a business needs, what to record at each stage, how to identify materials and products, how to design the records so they can be followed, how to test the system with mock recalls, and what Australian recall obligations mean for manufacturers. It is general information for manufacturers, quality managers and operations managers.

## What traceability covers

Traceability has three directions:

- **Backward traceability** follows a product back to its inputs: which supplier batches of material and components went into it, and which supplier certificates apply.
- **Forward traceability** follows inputs or products forward to their destinations: which products used a particular material batch, and which customers received them.
- **Internal traceability** follows the product through the factory: which processes, machines, settings, operators, inspections and revisions applied.

A common principle in many industries is **one step back and one step forward**: each business should know where its inputs came from and where its outputs went. A manufacturer that also knows its internal genealogy can link the two.

Two terms are central:

- A **lot** or **batch** is a quantity of material or product made or received under the same conditions and treated as one unit for traceability.
- A **serial number** identifies one individual item.

### Product traceability and measurement traceability

The word traceability also has a second meaning in manufacturing. **Measurement traceability** links an instrument's readings, through an unbroken chain of calibrations, to national measurement standards; in Australia, calibration laboratories accredited by NATA provide that link. The two meanings meet when something goes wrong. If a gauge is found out of calibration, product traceability records which products it measured during the suspect period, so only those need to be reassessed. Recording the instrument used for each critical inspection makes that possible.

## Why traceability matters

| Benefit | How traceability helps |
|---|---|
| Smaller recalls | Only products containing the affected lot or made in the affected period are recalled |
| Faster investigations | Failures can be linked to materials, machines, settings or shifts |
| Supplier accountability | Defects can be traced to supplier batches and certificates |
| Warranty management | Claims can be checked against build records and revisions |
| Compliance | Many customer, industry and regulatory requirements depend on it |
| Customer confidence | Customers in regulated industries often require it |

The cost of a recall grows with uncertainty. If a manufacturer cannot tell which products contain a faulty material, it must treat every product that might contain it as suspect.

## Choosing the level of detail

Traceability can be designed at different levels of detail, or **granularity**. Finer granularity narrows recalls but costs more to record.

| Level | Description | Typical uses |
|---|---|---|
| Date or period code | Products identified by date or week of manufacture | Low-risk, high-volume consumer goods |
| Lot or batch | Products and materials tracked by batch | Food, chemicals, plastics, fasteners, many components |
| Serial number | Each finished product identified individually | Machinery, electrical equipment, vehicles, medical devices |
| Serialised components | Critical components in each product tracked individually | Aerospace, safety-critical and high-value equipment |

Choose the level by considering the consequences of failure, customer and regulatory requirements, product value, production volume and the cost of recording. Many manufacturers combine levels, for example serial numbers for finished machines with lot traceability for their critical components and materials.

Quality management standards, such as ISO 9001, require organisations to identify outputs and to control traceability where it is a requirement. Industry standards for automotive, aerospace and medical device manufacturing set more demanding expectations.

## What to record at each stage

| Stage | Records |
|---|---|
| Receiving | Supplier, supplier lot or heat number, certificates, date, quantity, inspection result, internal lot number assigned |
| Storage | Location, quarantine or release status, shelf life where relevant |
| Material issue | Which material lots were issued to which job or production order, and quantities |
| Processing | Job or batch, machine, program or recipe revision, key settings, operator, date and time |
| Inspection and testing | Results, instruments used and their calibration status, inspector, disposition |
| Assembly | Which component lots or serial numbers went into which assembly |
| Packing and dispatch | Finished lot or serial numbers, customer, delivery or consignment, date |
| Returns and service | Returned items, findings, replacements fitted in service |

The internal links are where traceability most often breaks. Materials may be received with full certificates but issued to the shop floor without recording which lot went to which job, so the chain is broken in the middle.

## Identifying materials and products

Records can only be linked if items are identified reliably at each step:

- **Labels** on materials, containers and finished goods, showing item number, lot or serial number and status.
- **Barcodes** and two-dimensional codes, which speed recording and reduce typing errors. GS1, whose Australian member organisation issues product numbers, provides widely used standards for encoding product identifiers, batch numbers and dates in barcodes.
- **Direct part marking**, such as laser or dot-peen marking, for parts that must carry identification permanently, including through coating or harsh service.
- **Radio-frequency identification (RFID)** tags, which can be read without line of sight, for returnable containers, tools and high-value items.

Good identification is durable enough for its environment, readable by both people and scanners, and applied at the point where the item is created or received.

## Designing the records so they can be followed

Traceability records must link together. In database terms, a business needs to record each lot or serial number and the **movements and transformations** that connect them: material lot A was issued to job 123, which produced finished lot B, which was shipped to customer C. Following those links backward and forward is called tracing **genealogy**.

Several situations need particular care:

- **Lot splitting**, when part of a lot is used in one job and part in another. Each portion must still carry the original lot identity.
- **Lot mixing**, when materials from several lots are combined, for example in a hopper, silo or tank. The business must either keep lots separate or record which lots were combined over which periods, accepting that products made during the transition may contain either.
- **Rework and repair**, which must be recorded against the item's history, including any replacement components.
- **Continuous processes**, where time windows rather than discrete batches define traceability, making accurate time records essential.
- **Revisions**, where products must record which design, program or recipe revision applied.

Business systems such as ERP and manufacturing execution systems often provide lot and serial tracking, but they work only if the shop floor records issues, movements and consumption accurately and promptly. The [choosing an ERP system for a small manufacturer](/reados/collections/business-systems-security-and-it-decisions/choosing-an-erp-system-for-a-small-manufacturer/) article discusses how traceability requirements affect system selection.

## Checking the system with mass balance

A **mass balance** compares the quantity of each lot received or produced with the quantities used, shipped, scrapped and remaining. If 1,000 kilograms of a material lot were received and records show 940 kilograms used and 40 kilograms in stock, 20 kilograms are unaccounted for. Small differences may be normal process loss; large or unexplained differences show where records are incomplete. Regular mass balance checks on critical materials reveal weaknesses before a real recall does.

```figure
type: stack
title: Accounting for a 1,000 kg material lot
unit: kg
caption: Small differences may be process loss; large or unexplained ones show where records are incomplete.
- Used | 940
- In stock | 40
- *Unaccounted for | 20
```

## Testing with mock recalls

A traceability system should be tested regularly with a **mock recall** or trace exercise:

1. **Choose a scenario**, such as a supplier lot of a critical material or a finished lot shipped some months ago.
2. **Trace backward and forward**, identifying all affected products, quantities, locations and customers.
3. **Time the exercise**, from starting the trace to having a complete list.
4. **Check accuracy** with a mass balance: do the quantities account for the whole lot?
5. **Review gaps** and fix the processes or records that caused them.

Many businesses set a target, such as completing a trace within a few hours. Testing at least once a year, and after major system or process changes, keeps the system honest.

## Recalls and obligations in Australia

When a product is unsafe, traceability becomes urgent. Under the Australian Consumer Law, a supplier that voluntarily recalls consumer goods because of safety concerns must notify the responsible Commonwealth minister within two days of taking the action, and suppliers must also report deaths, serious injuries and illnesses associated with consumer goods within two days of becoming aware of them. The ACCC's Product Safety Australia website publishes recalls and guidance on conducting them.

Specific regimes apply in some industries. Food manufacturers, wholesalers and importers must have a written system for recalling unsafe food under the Food Standards Code, and Food Standards Australia New Zealand coordinates food recalls. Therapeutic goods, road vehicles and electrical equipment have their own regulators and requirements. Check the obligations that apply to your products with the relevant regulator or adviser.

A recall plan should set out who decides, who is contacted, how affected products are identified and retrieved, how customers and regulators are informed and how the recall is closed. Traceability records are the foundation of that plan. The [responding to a customer quality complaint with 8D](/reados/collections/manufacturing-quality/responding-to-a-quality-complaint-with-8d/) article explains how containment and root cause analysis fit alongside a recall.

## Common mistakes

- **Recording supplier lots at receipt but not at issue**, breaking the chain inside the factory.
- **Mixing lots in bins or hoppers** without recording which lots were combined.
- **Handwritten records** that are illegible, incomplete or impossible to search quickly.
- **Labels that fall off**, fade or are removed during processing.
- **Rework not recorded**, so repaired items carry the wrong history.
- **Never testing the system** until a real recall exposes its gaps.
- **Over-engineering**, recording more detail than risk or requirements justify, so people stop recording accurately.

## A worked example

This is an illustrative example. A manufacturer moulds and assembles plastic housings for electrical products, about 6,000 units a month. Resin is received in bulk bags, each with a supplier lot number, but bags are emptied into dryers and hoppers without recording which lot was used when.

**The incident.** The resin supplier notifies that one lot may contain contamination that weakens the material. The manufacturer knows the lot was received three months earlier but cannot tell when it was used. To be safe, it must treat all housings made since the delivery, about 18,000 units, as suspect. At an assumed $40 a unit for retrieval, inspection and replacement, the potential cost is about $720,000, plus damage to customer relationships.

**Investigation.** By reconstructing dryer loading from shift notes and production records, the team narrows the likely window to about two weeks, but the evidence is uncertain and the customer insists on a wider recall of about 9,000 units.

**Changes.** The manufacturer introduces barcode scanning of each resin bag when loaded into a dryer, records the time each hopper changes lot, labels each production lot of housings with its date, shift and resin lots, and records which housing lots were shipped to which customer. Equipment and system configuration cost about $25,000 in this illustration.

**Result.** In a mock recall six months later, the team traces a resin lot to 1,200 housings and three customer deliveries in under two hours. Had the original incident occurred under the new system, the recall would have covered about 1,200 units, an assumed cost of about $48,000 rather than hundreds of thousands of dollars.

```figure
type: bars
title: Housings caught up in one suspect resin lot
unit: units
max: 19000
caption: At an assumed $40 a unit, the potential cost fell from about $720,000 to about $48,000 with dryer-level traceability.
- No lot-to-production link | 18000
- Reconstructed from shift notes | 9000 | the customer insisted
- *With barcode scanning at the dryer | 1200 | traced in under two hours
```

## Applying this in an Australian business

- **Decide the level of traceability** each product needs, based on risk and requirements.
- **Record lots at receipt, issue, processing and dispatch**, not only at the ends.
- **Use barcodes or other machine-readable identification** where volumes justify it.
- **Control lot mixing** and record rework.
- **Check records with mass balance** for critical materials.
- **Run mock recalls** at least yearly and fix the gaps found.
- **Prepare a recall plan** that reflects Australian Consumer Law and industry requirements.

## Questions worth considering

- If a supplier lot were found faulty today, how long would it take us to list every affected product and customer?
- Where in our process is the traceability chain broken?
- Is our level of traceability matched to the risk of our products?
- When did we last test our traceability with a mock recall?
- Who would decide and lead a recall, and do they know the reporting obligations?

## Bringing it together

Traceability connects products to their materials, processes, checks and customers. It turns a recall from a broad, expensive and uncertain exercise into a targeted one, and it speeds the investigation of failures. Choose the level of detail by risk and requirements, record lots and serial numbers at every stage including inside the factory, identify items reliably, manage splitting, mixing and rework, check records with mass balance and test the system with mock recalls. When a real problem arrives, the work done beforehand determines how quickly and precisely the business can respond.

---

*Source: KEVOS® editorial notes, drawing on general quality management, manufacturing systems and product recall practice. Recall obligations are summarised for orientation; confirm current requirements with the relevant regulator. The worked example is illustrative. This article is general information.*
