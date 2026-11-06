---
title: "Sharing data with customers and suppliers: agreements, formats, security and control"
description: "Forecasts, stock levels, drawings, quality records and product data increasingly flow between businesses. How to decide what to share, agree terms, choose formats and keep control."
publishDate: 2026-10-09
category: "Business"
tags:
  - systems
  - customers
  - communication
author: "BIZOMAT"
featured: false
draft: false
---

Businesses no longer keep their data entirely to themselves. Manufacturers share forecasts and stock levels with suppliers so they can plan production. Suppliers send material certificates, inspection results and dispatch notices to customers. Retailers expect product data in standard formats. Engineering firms exchange drawings and models with fabricators. Equipment makers receive operating data from machines installed at customer sites. Project partners share schedules, models and documents through common platforms.

Shared data can make supply chains faster, cheaper and more reliable. It also creates risks: confidential designs reaching competitors, personal information disclosed without authority, outdated drawings used for manufacture, partners using data for purposes nobody agreed, and former suppliers retaining access long after a relationship has ended. Most of these risks arise not from bad faith but from informal arrangements: spreadsheets emailed weekly, shared folders nobody reviews and terms never written down.

This article explains what businesses commonly share and why, how to decide what to share, what agreements should cover, which formats and standards help, how to share securely, how to manage drawings and technical data, how to handle data received from others and what to do when a relationship ends. It is general information, not legal advice.

## What businesses share, and why

| Data shared | With | Typical purpose |
|---|---|---|
| Forecasts and production plans | Suppliers | Help suppliers plan capacity and materials |
| Stock levels and consumption | Suppliers | Vendor-managed inventory, where the supplier replenishes stock |
| Purchase orders, invoices and dispatch notices | Suppliers and customers | Transaction processing without re-keying |
| Drawings, models and specifications | Suppliers and fabricators | Quoting and manufacture |
| Quality records and certificates | Customers | Evidence of conformance and traceability |
| Product data | Retailers and distributors | Listing, pricing and selling products |
| Performance scorecards | Suppliers | Delivery and quality improvement |
| Machine and service data | Equipment makers and service providers | Monitoring, maintenance and support |
| Project schedules, models and documents | Project partners | Coordinated delivery |

## Benefits and risks

| Benefits | Risks |
|---|---|
| Better planning and fewer shortages | Confidential information reaching competitors |
| Less re-keying and fewer errors | Personal information disclosed without authority |
| Faster quoting and manufacture | Outdated versions used for decisions or manufacture |
| Stronger relationships and shared improvement | Data used for purposes nobody agreed |
| Evidence for compliance and traceability | Security weaknesses at partners exposing shared data |
| New services, such as remote monitoring | Dependence on a partner's platform or format |

## Decide what to share

Before sharing, answer a few questions:

1. **What is the purpose?** Share data for a defined use, such as replenishing stock or quoting a part.
2. **What is the minimum needed?** A supplier planning capacity may need forecast quantities by month, not customer names or prices.
3. **How sensitive is it?** Classify data as public, internal, confidential or personal, and apply stronger controls to more sensitive data.
4. **Who at the partner needs it?** Share with roles, not whole organisations.
5. **For how long?** Set an end date or review point.

```figure
type: steps
title: Deciding what to share
caption: A supplier planning capacity may need monthly forecast quantities, not customer names or prices.
- What is the purpose?
- What is the minimum needed?
- How sensitive is it?
- Who at the partner needs it?
- *For how long?
```

Sharing less, more precisely, reduces risk without reducing the benefit.

## What agreements should cover

Informal sharing works until something goes wrong. Written terms, whether in a supply contract, a confidentiality agreement or a specific data sharing agreement, should cover:

- **Purpose and permitted use**: what the recipient may and may not do with the data, including whether it may be used to develop products, train artificial intelligence models or be shared with others.
- **Ownership and intellectual property**: who owns the data and any designs, results or improvements derived from it.
- **Confidentiality**: obligations to protect the data and limits on disclosure.
- **Security requirements**: minimum controls, such as access management, encryption and multi-factor authentication.
- **Subcontractors**: whether the recipient may pass data to its own suppliers or service providers, and on what terms.
- **Retention and return**: how long data is kept, and how it is returned or destroyed when no longer needed or when the relationship ends.
- **Incident notification**: how quickly the recipient must report a breach or loss.
- **Accuracy and liability**: responsibility for errors in shared data and limits on reliance.
- **Audit and review**: rights to check compliance.

```figure
type: checklist
title: What a data-sharing agreement should cover
caption: Write the terms before data starts flowing, not after a dispute.
- x Purpose and permitted use
- x Ownership and intellectual property
- x Confidentiality
- x Security requirements
- x Subcontractors
- x Retention and return
- x Incident notification
- x Accuracy and liability
- *x Audit and review
```

Where personal information is involved, privacy obligations also apply. For organisations covered by the Privacy Act, disclosing personal information to another business must be consistent with the Australian Privacy Principles, including those on use and disclosure and on overseas disclosure. The [privacy by design in business databases](/reados/collections/records-business-data-and-learning/privacy-by-design-in-business-databases/) article explains how to limit and protect personal information. Seek legal advice for significant arrangements.

## Formats and standards

Agreeing formats avoids endless reformatting and misinterpretation:

- **Structured files**, such as CSV with an agreed layout and definitions, for simple regular exchanges.
- **Electronic data interchange (EDI)** standards for orders, invoices and dispatch notices with trading partners.
- **Peppol** for electronic invoicing, which Australia has adopted with the Australian Taxation Office as the national authority.
- **Application programming interfaces** for real-time exchange between systems.
- **GS1 standards** for product identification and product data; in Australia, GS1 operates a national product catalogue that many retailers use to receive product information from suppliers.
- **Neutral CAD formats**, such as STEP, alongside PDF drawings, for engineering data.
- **PDF/A** for documents that must remain readable long term.

Formats are only half the agreement. **Definitions** matter as much: whether a forecast is in units or cartons, whether a delivery date means dispatch or arrival, whether prices include GST. Share a short data dictionary with each regular exchange. The [keeping business systems in sync](/reados/collections/business-systems-security-and-it-decisions/keeping-business-systems-in-sync/) article covers integration methods and error handling for automated exchanges.

## Sharing securely

- **Use secure portals, managed file transfer or the partner's supplier platform** for regular sharing, rather than email attachments.
- **Use expiring, access-controlled links** for occasional sharing.
- **Require multi-factor authentication** for portals holding sensitive data.
- **Grant access to named individuals**, not shared accounts.
- **Review access regularly**, and remove it promptly when people leave either organisation.
- **Log downloads and access** to sensitive data.
- **Encrypt sensitive files** sent outside secure platforms.

The [securing business databases](/reados/collections/database-foundations-for-business/securing-business-databases/) article covers the wider controls that protect data inside the business.

### Checking partners' security

Data shared with a partner is only as safe as the partner's own controls. For sensitive data, ask key partners about their security practices before sharing, such as multi-factor authentication, backups, patching and incident response, and include minimum requirements in agreements. Proportion matters: a short questionnaire suits most small suppliers, while partners holding large volumes of personal or highly confidential data may warrant closer review.

## Drawings and technical data

Engineering data needs particular care:

- **Revision control**: make sure partners always work from the current revision, and that superseded drawings are clearly marked or withdrawn.
- **Watermarks and title blocks** showing confidentiality and the recipient.
- **Share only what is needed**: a fabricator may need a part drawing, not the full assembly model.
- **Export controls**: some technical information about military or dual-use goods is regulated, and sending it overseas may require a permit under Australian export control laws. Check before sharing controlled technical data with overseas parties.

## Vendor-managed inventory in practice

In **vendor-managed inventory**, a supplier monitors the customer's stock and consumption and decides when and how much to replenish, within agreed minimum and maximum levels. It can reduce stockouts and paperwork on both sides, but it depends entirely on shared data being accurate and timely. The customer must keep stock records reliable, share consumption and stock positions on an agreed schedule and notify the supplier of changes in demand, such as a new product or a lost contract. The agreement should define the data shared, the replenishment rules, who owns stock until it is used and how disagreements over stock figures are resolved.

## What customers increasingly ask for

Larger customers now ask suppliers for more data than ever: security questionnaires about how the supplier protects information, traceability and test data for delivered products, evidence of certifications and, increasingly, emissions data. In Australia, mandatory climate-related financial reporting began in 2025 for the largest entities and is being phased in for others, and many of those organisations ask their suppliers for information about emissions associated with the goods and services they buy. Suppliers that can provide such data reliably, from well-organised records, are easier to buy from.

## Data from connected products

Equipment that reports its operating data to its maker raises questions for both sides. The maker can offer monitoring, predictive maintenance and better support; the customer may regard the data as revealing its production volumes, efficiency or processes. Agreements should state what data is collected, who owns it, what the maker may use it for, whether it is shared with anyone else, how the customer can access and export it and what happens when the service ends. Being transparent about this builds trust and avoids disputes.

## Shared data and artificial intelligence tools

Staff may be tempted to paste partners' drawings, specifications or forecasts into public artificial intelligence tools to summarise or analyse them. Depending on the tool's terms, that may disclose confidential information to a third party, breaching agreements. Set clear rules on which tools may be used with confidential and partner data, and prefer business versions of tools with appropriate data protection terms.

## Data received from others

Data coming into the business deserves scrutiny too:

- **Check its quality** before relying on it, such as supplier forecasts, certificates and measurements.
- **Record where it came from** and when.
- **Respect the terms** under which it was provided, including confidentiality and permitted use.
- **Protect it** to the same standard as the business's own confidential data.

## Resolving disagreements about shared figures

Shared data often becomes the basis of performance measures, such as a customer's on-time delivery scorecard for a supplier or a supplier's forecast accuracy report for a customer. Disputes are common when each side calculates differently. Agree in advance how each measure is calculated, which party's data is the reference, how exclusions such as customer-requested changes are treated and how disputed results are reviewed. A short joint review each quarter, working from the same data, resolves most disagreements before they damage the relationship.

## When a relationship ends

At the end of a supply or project relationship:

- **Revoke all access** to portals, shared folders and systems.
- **Request return or destruction** of shared data, in line with the agreement, and obtain confirmation.
- **Retain what you must**, such as quality records needed for traceability or legal retention.
- **Update the register** of sharing arrangements.

## Keep a register of sharing arrangements

A simple register listing each regular data sharing arrangement, with the partner, data shared, purpose, method, agreement, owner, sensitivity and review date, makes arrangements visible and reviewable. It is often the first thing a customer's security questionnaire or an auditor asks for.

## Common mistakes

- **Sharing more than needed**, such as whole databases when a summary would do.
- **No written terms** on purpose, use and return.
- **Emailing sensitive files** repeatedly.
- **Shared accounts** on partner portals.
- **Former partners and staff keeping access.**
- **Outdated drawings** circulating after revisions.
- **Undefined fields**, causing misinterpretation.
- **Overlooking privacy obligations** when personal information is included.

## A worked example

This is an illustrative example. A manufacturer of agricultural equipment buys fabricated steel components from five key suppliers. It emails a forecast spreadsheet to each supplier monthly, sends drawings by email when quoting, and receives material certificates as email attachments.

**Problems.** Suppliers sometimes plan from outdated forecasts or the wrong drawing revision. Certificates are hard to find during customer audits. A review finds that a supplier the business stopped using two years earlier still has access to a shared drawing folder.

**Changes.** The manufacturer sets up a supplier portal. Each supplier sees only its own parts: current drawings with revision status, a rolling 12-month forecast in an agreed format with definitions, and a place to upload certificates and inspection results linked to purchase orders. Access is by named user with multi-factor authentication. Supply agreements are updated with data terms covering permitted use, confidentiality, security and return of data. The former supplier's access is removed, and the business requests confirmation that its drawings have been deleted.

**Result.** Shortages caused by outdated forecasts fall, drawing revision errors stop, and certificates for any batch can be found in minutes during audits. The business keeps a register of all supplier data sharing and reviews access every six months.

```figure
type: compare
title: From email attachments to a supplier portal
cols: Before | After
best: 2
caption: The business now keeps a register of all supplier data sharing and reviews access every six months.
- Forecasts | Emailed spreadsheets, sometimes outdated | A rolling 12-month forecast with definitions
- Drawings | Wrong revisions used | Current revisions only, each supplier's own parts
- Certificates | Hard to find in audits | Linked to purchase orders, found in minutes
- Access | A former supplier still in a shared folder | Named users with multi-factor authentication
```

## Applying this in an Australian business

- **List what you share**, with whom and why.
- **Share the minimum** needed for each purpose.
- **Put terms in writing**, including permitted use and return of data.
- **Agree formats and definitions** for regular exchanges.
- **Use secure platforms**, named access and multi-factor authentication.
- **Control drawing revisions** and check export control requirements for technical data.
- **Check privacy obligations** before sharing personal information.
- **Revoke access and recover data** when relationships end.

## Questions worth considering

- Which partners hold our confidential data, and under what terms?
- Could any former supplier or customer still access our systems or folders?
- Do our partners always work from current drawings and forecasts?
- Do we know what our suppliers may do with the data we send them?
- Where would we find the agreement covering each regular data exchange?

## Bringing it together

Sharing data with customers and suppliers can make supply chains more efficient and relationships stronger, but only with deliberate control. Decide what to share and why, share the minimum, put terms in writing, agree formats and definitions, use secure platforms and named access, manage drawings and controlled technical data carefully, treat incoming data with appropriate scrutiny, keep a register and close arrangements properly when relationships end.

---

*Source: BIZOMAT editorial notes, drawing on general supply chain, information security and data management practice. Legal points are summarised for orientation; seek legal advice for specific arrangements. The worked example is illustrative. This article provides general information and does not constitute legal advice.*
