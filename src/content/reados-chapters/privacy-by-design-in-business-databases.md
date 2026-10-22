---
title: "Privacy by design in business databases: collecting, storing and using personal information responsibly"
description: "Privacy is easier to build into a system than to add later. How to design databases that collect less, record purpose and consent, control access, support requests and delete on time."
publishDate: 2026-10-09
category: "Business"
tags:
  - systems
  - customers
  - people
author: "KEVOS®"
featured: false
draft: false
---

Most business databases hold personal information: customers' names, addresses, phone numbers and purchase histories; employees' contact details, pay and leave; contractors' licence numbers; visitors' sign-in records; and sometimes far more sensitive details, such as health information, identity documents or photographs. Each of these records is useful to the business, and each is a liability if it is collected unnecessarily, kept too long, seen by the wrong people or stolen.

**Privacy by design** is the practice of building privacy protections into systems and processes from the start, rather than adding them after a complaint, an audit or a breach. The idea was championed in the 1990s by Ann Cavoukian, then Information and Privacy Commissioner of Ontario in Canada, and is now reflected in privacy guidance around the world, including from the Office of the Australian Information Commissioner. For databases, it means decisions about which fields to collect, how purposes and consents are recorded, who can see what, how long data is kept and how individuals' requests are handled are made deliberately at design time.

This article explains how Australian privacy obligations relate to database design, and sets out practical design principles: inventory and purpose, data minimisation, sensitive information, consent and preferences, access control, retention and deletion, supporting access and correction requests, de-identification, overseas storage and privacy impact assessments. It is general information, not legal advice.

## The Australian framework in brief

The **Privacy Act 1988** and its **Australian Privacy Principles** set out how covered organisations must handle personal information. The Act applies to Australian Government agencies and to private sector organisations with an annual turnover above $3 million, as well as some smaller businesses, such as health service providers, businesses that trade in personal information and contracted service providers to the Commonwealth. Privacy law has been changing, with reforms passed in late 2024 and further changes proposed, so businesses should check current obligations with the Office of the Australian Information Commissioner or a legal adviser.

Several principles bear directly on databases:

| Principle area | What it requires, in general terms | Database implications |
|---|---|---|
| Open and transparent management | Practices, procedures and a privacy policy | Know what data is held and why |
| Collection | Collect only information reasonably necessary, by fair means | Minimise fields; record source |
| Notification | Tell people about collection | Record what notice was given |
| Use and disclosure | Use for the purpose collected, or related purposes people would expect, unless an exception applies | Record purposes; control secondary uses |
| Direct marketing | Conditions on using personal information for marketing, including opt-outs | Store preferences and honour them |
| Cross-border disclosure | Take reasonable steps when disclosing overseas | Know where data and backups are stored |
| Security | Protect information and destroy or de-identify it when no longer needed | Access control, encryption, retention rules |
| Access and correction | Give people access to their information and correct it on request | Be able to find all records about a person |

Even businesses not covered by the Act benefit from following these principles: they reduce breach risk, build customer trust and make future compliance easier as the business grows or laws change. Other laws also apply, such as the Spam Act for electronic marketing messages and state laws in some areas.

## Start with an inventory and purposes

Before designing or reviewing a database, list the personal information it holds or will hold:

- **What information**, field by field.
- **Whose**: customers, prospects, employees, contractors, visitors, children.
- **Why**: the specific purpose for each item.
- **Where it comes from**: the person directly, a third party, a public source or derived by the business.
- **Who uses it** and which other systems receive it.
- **How long it is needed.**

```figure
type: steps
title: An inventory of personal information
caption: Privacy by design starts with knowing what is held and why.
- What information | field by field
- Whose
- Why | the purpose of each item
- Where it comes from
- Who uses it
- *How long it is needed
```

This inventory often reveals fields nobody uses, copies held in forgotten spreadsheets and information collected out of habit.

## Collect less

**Data minimisation** means collecting only what is reasonably necessary for a defined purpose. In database design:

- **Question every field**: what decision or process needs it?
- **Make fields optional** where information is useful but not essential.
- **Collect less precise information** where precision is not needed, such as age range or birth year instead of full date of birth, or suburb instead of street address for marketing analysis.
- **Avoid free-text fields** that invite people to record sensitive or irrelevant details, such as opinions or health information in a general notes field.
- **Do not store identity document numbers** after checking identity, unless there is a genuine requirement.
- **Use payment providers** so card numbers never enter the business's own systems.

Every field not collected cannot be lost, misused or requested in a breach notification.

## Treat sensitive information with extra care

The Privacy Act defines **sensitive information**, including health information, racial or ethnic origin, political opinions, religious beliefs, sexual orientation, criminal records and biometric information, and generally requires consent to collect it, along with stricter rules for its use. Databases holding sensitive information should:

- **Separate it** from general records where practical, with tighter access.
- **Record the consent** obtained and its scope.
- **Encrypt it** at rest and restrict exports.
- **Log access** and review the logs.

## Record purposes, consents and preferences

A database should be able to answer: for what purposes may we use this person's information, and what have they agreed to or opted out of? Practical design includes:

- **Consent and preference records** with what was agreed, when, how and which version of the notice applied.
- **Marketing opt-outs** that apply across every system that sends messages, not just one.
- **Source of each record**, such as the website form or event at which it was collected.
- **Checks in processes**, so marketing lists exclude people who have opted out, and new uses of data are reviewed before they begin.

The [what you may infer about customers](/reados/collections/marketing-brands-and-customer-experience/what-you-may-infer-about-customers/) article discusses the risks of drawing conclusions from customer data, which also bear on purpose and fairness.

## Control access

People should see only the personal information their role requires:

- **Role-based access**, so that, for example, warehouse staff see delivery addresses but not purchase histories, and only payroll staff see pay details.
- **Field-level restrictions** for sensitive items.
- **Limits on bulk exports** of personal information.
- **Audit logs** recording access to and changes in sensitive records.
- **Regular access reviews**, removing access when roles change.

## Design retention and deletion in

Privacy principles require reasonable steps to destroy or de-identify personal information that is no longer needed, unless the law requires it to be kept. That is far easier when the database is designed for it:

- **Record dates that drive retention**, such as last purchase, end of employment or date of an unsuccessful application.
- **Set retention rules** for each kind of record, aligned with legal requirements and business needs.
- **Automate review and deletion** where possible, with reports of records due for deletion.
- **Delete or de-identify consistently** across linked systems, backups on their normal cycle, test copies and exports.
- **Keep a record** of what categories were deleted and when, without keeping the deleted information.

## Support access and correction requests

Individuals can ask covered organisations for access to the personal information held about them and for corrections. To respond accurately and on time, the business must be able to **find every record about a person** across its systems. That requires consistent identifiers, knowledge of where copies exist and processes to check identity before releasing information. A database designed with a clear customer or person identifier, linked to related records, makes this straightforward; information scattered across spreadsheets and email does not.

## Use de-identified data where possible

Many uses of data do not need to identify individuals: sales analysis, product development, testing and training. **De-identification** removes or alters information so that individuals are not reasonably identifiable. Practical techniques include:

- **Removing direct identifiers**, such as names, contact details and account numbers.
- **Replacing identifiers with codes** that cannot easily be linked back, sometimes called pseudonymisation, while keeping the linking key separately and securely.
- **Aggregating** data into totals and groups.
- **Generalising** detail, such as age bands or postcodes rather than addresses.

```figure
type: layers
title: Ways to de-identify data
caption: Keep any linking key separate and protected.
- Remove direct identifiers
- Replace identifiers with codes
- Aggregate into totals and groups
- *Generalise detail | age bands, postcodes
```

De-identification is not absolute. Combining several fields, or linking with other data sets, can sometimes re-identify people, so assess the risk for each use. Test and development environments should use masked or synthetic data rather than copies of real personal information.

## Know where data is stored

Cloud services and software providers may store personal information, backups or support access overseas. Where the Privacy Act applies, disclosing personal information to an overseas recipient brings obligations to take reasonable steps to ensure it is handled consistently with the Australian Privacy Principles. Ask providers where data and backups are stored and accessed, and record the answers in the inventory.

## Employee information

Employee records deserve the same care. For private sector employers, the Privacy Act's employee records exemption generally covers acts directly related to a current or former employment relationship and the employee record itself, but the exemption is narrower than many assume, it does not cover job applicants or contractors in the same way, and other laws, such as Fair Work record-keeping requirements, still apply. Regardless of the legal position, staff deserve the same protection as customers: restrict access to pay, performance, health and background-check information to those who need it, keep it separate from general systems, and delete what is no longer required.

## Design to limit the harm of a breach

No system is perfectly secure, so design to limit the damage if a breach occurs. Minimised data, encryption, separated sensitive records, restricted exports and timely deletion all reduce what an attacker can take. Good records of what data is held, and where, also make it possible to assess quickly who is affected. Under the Notifiable Data Breaches scheme, covered organisations must assess suspected breaches promptly and notify affected individuals and the Office of the Australian Information Commissioner when an eligible breach is likely to cause serious harm; that is far easier when the business knows exactly what was in the affected system.

## Privacy impact assessments

A **privacy impact assessment** is a systematic review of how a new system or project will affect individuals' privacy, and how to reduce the risks. The Office of the Australian Information Commissioner publishes guidance on conducting them. For a small business, a short structured assessment of a new customer system, app or data use is usually enough: what information, for what purpose, who sees it, where it goes, how long it stays and what could go wrong.

## Common mistakes

- **Collecting fields "in case they are useful".**
- **Notes fields** that accumulate sensitive and irrelevant details.
- **Real customer data in test systems.**
- **Marketing opt-outs** recorded in one system but not honoured in others.
- **No retention dates**, so records are kept forever by default.
- **Being unable to find all records** about a person.
- **Assuming the small business exemption applies** without checking.
- **Copies in spreadsheets and email** outside any controls.

## A worked example

This is an illustrative example. A business that sells and services home fitness equipment has about 25,000 customer records in its sales and service database, collected over 12 years. Its turnover has recently exceeded $3 million, bringing it under the Privacy Act.

**Inventory.** A review finds that the database holds full dates of birth for all customers, driver's licence numbers copied during finance applications, notes fields containing comments about customers' injuries and health, marketing consent recorded only in the email platform, and a test copy of the full database used by the developer.

**Changes.** Dates of birth are replaced with birth years where needed for warranty and finance checks, and removed elsewhere. Driver's licence numbers are deleted, and the finance process is changed to verify identity without storing document numbers. Health-related notes are moved to a restricted service record with consent recorded, and staff are trained to record only what service work requires. Marketing preferences are stored in the main database and synchronised to the email platform. The test environment is rebuilt with synthetic data. A retention rule de-identifies customers with no purchase or service activity for seven years, subject to checking any legal requirements.

**Result.** The business holds less sensitive information, can locate all records about a person when asked, honours opt-outs consistently and would have far less to notify in the event of a breach.

```figure
type: compare
title: A 25,000-record customer database, redesigned
cols: Found | Changed
best: 2
caption: Turnover above $3 million had brought the business under the Privacy Act.
- Dates of birth | Full dates for every customer | Birth year only where needed
- Licence numbers | Copied during finance applications | Deleted; identity checked without storing them
- Health notes | In general notes fields | A restricted service record, with consent
- Marketing consent | Only in the email platform | In the main database, synchronised
```

## Applying this in an Australian business

- **Check whether the Privacy Act applies**, and track changes in privacy law.
- **Inventory personal information** and record purposes.
- **Minimise fields** and avoid storing identity document numbers and card data.
- **Protect sensitive information** with consent, separation and access controls.
- **Store consents and preferences** centrally and honour them everywhere.
- **Design retention and deletion** into the data model.
- **Be able to find all records about a person.**
- **Use de-identified or synthetic data** for analysis and testing where possible.

## Questions worth considering

- Which personal information do we hold that we no longer need?
- Could we find every record about a customer within a week if asked?
- Where do our databases, backups and support staff sit geographically?
- Do our test systems contain real personal information?
- When did we last delete personal information we no longer needed?

## Bringing it together

Privacy by design means building respect for personal information into databases and processes from the start. Know what personal information is held and why, collect less, treat sensitive information carefully, record purposes and consents, restrict access, design retention and deletion into the data model, be able to find and correct records on request, use de-identified data where possible, know where data is stored and assess privacy impacts before launching new systems. These practices reduce legal and breach risk and build the trust on which customer relationships depend.

---

*Source: KEVOS® editorial notes, drawing on general privacy and information management practice and publicly available guidance on the Australian Privacy Principles. Privacy obligations are summarised for orientation and are changing; seek legal advice for your circumstances. The worked example is illustrative. This article provides general information and does not constitute legal advice.*
