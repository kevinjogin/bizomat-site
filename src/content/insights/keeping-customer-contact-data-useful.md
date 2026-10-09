---
title: "Keeping customer contact data useful: decay, duplicates, consent and upkeep in CRM systems"
description: "Customer contact records go stale, multiply and lose their consent history. How to structure CRM data, prevent duplicates, record consent properly and keep contact data current."
publishDate: 2026-10-09
category: "Business"
tags:
  - customers
  - sales
  - systems
author: "KEVOS"
featured: false
draft: false
---

A customer relationship management system, usually called a CRM, promises a complete view of every customer: who the business deals with, what has been discussed, which opportunities are open and how to reach the right person. A few years after implementation, many CRMs tell a different story. Emails bounce, phone numbers ring people who left years ago, the same company appears four times under slightly different names, nobody knows whether contacts agreed to receive marketing, and sales staff keep their real contact lists in their phones.

Contact data is perishable. People change jobs, roles and email addresses; companies merge, rename and move; and every import, web form and busy salesperson adds new records without checking for old ones. Unless the business actively maintains its contact data, its quality declines steadily, undermining sales, service, marketing and compliance.

This article explains how to structure accounts, contacts and roles in a CRM, why contact data decays, how to prevent and merge duplicates, which standards and required fields help, how to record consent and preferences under Australian rules, how to keep data current, how to govern who changes what and how to measure contact data quality. It is general information for sales, marketing and customer service managers, not legal advice.

## What CRM data includes

| Data | Examples |
|---|---|
| Accounts | Companies and organisations the business deals with |
| Contacts | People at those organisations, with roles and contact details |
| Relationships | Which contacts belong to which accounts, and their roles |
| Interactions | Calls, meetings, emails, visits and support cases |
| Opportunities | Potential sales and their stages |
| Consent and preferences | What each person has agreed to receive and how |
| Classifications | Industry, size, region, customer type |

The CRM should hold account and contact information once, shared by sales, service and marketing, and linked to other systems such as accounting and quoting.

## Why contact data decays

- **People change jobs and roles**, often without telling suppliers.
- **Email addresses change** when organisations rebrand or change systems.
- **Companies merge, change names or close.**
- **Phone numbers change**, especially direct lines and mobiles of departed staff.
- **Duplicates accumulate** from imports, web forms and different staff creating records.
- **Information is entered incompletely** in a hurry.

Decay is continuous, so one-off clean-ups help only temporarily. Lasting quality depends on habits and processes that keep data current.

## Structure accounts, contacts and roles

Good structure prevents many problems:

- **Separate accounts from contacts.** A company is an account; the people there are contacts linked to it.
- **Record roles**, such as decision maker, technical contact, site contact or accounts payable, so the right person is contacted for each purpose.
- **Allow contacts to relate to more than one account** where real life requires it, such as consultants who specify products for many clients.
- **Model account hierarchies**, such as head office and branches, or a group of companies.
- **Keep a contact's history** when they move to a new employer: create a new relationship rather than overwriting the old one, so past interactions remain linked to the right account.

The [master data and the single source of truth](/insights/master-data-and-the-single-source-of-truth/) article explains how core records like customers should be owned and controlled across systems.

## Prevent and manage duplicates

Duplicates split history across records, cause repeated or conflicting communication and distort reports. To manage them:

- **Search before creating**, with the CRM checking for similar names, email addresses, phone numbers and ABNs as records are entered.
- **Standardise formats**, such as phone numbers in a consistent international format and company names without variations like "Pty Ltd" in some records and not others.
- **Match imports** against existing records before loading lists from events or campaigns.
- **Run regular duplicate checks**, using matching rules on email, phone, name and company.
- **Merge carefully**, choosing the surviving record, combining interaction history and checking consent records, because merging can carry a marketing opt-out from one record to another or lose it.

## Standards and required fields

Keep required fields few but meaningful, and use controlled lists for classifications:

- **Required for contacts**: name, account, at least one contact method and role.
- **Required for accounts**: legal or trading name, ABN where relevant, type and region.
- **Picklists** for industry, role, source and status, rather than free text.
- **Naming conventions** for accounts, agreed and documented.
- **A "last verified" date** showing when contact details were last confirmed.

## Classifying accounts consistently

Classifications such as industry, size, region and customer type drive targeting, territory planning and reporting, but only when applied consistently. Use controlled lists rather than free text. For industry, many Australian businesses align with the Australian and New Zealand Standard Industrial Classification published by the Australian Bureau of Statistics, at a level of detail suited to their market, which also makes comparison with official statistics easier. Define size bands by a measure the business can obtain reliably, such as employee numbers or annual spend with the business, and record who classified each account and when.

## Consent and preferences

Marketing communication in Australia is regulated. Under the Spam Act 2003, commercial electronic messages, such as marketing emails and text messages, generally require the recipient's consent, which can be express or, in some circumstances, inferred from an existing relationship. Messages must identify the sender and include a functional unsubscribe facility, and unsubscribe requests must be honoured within five working days. Telemarketing rules, including the Do Not Call Register, may also apply to phone marketing. For organisations covered by the Privacy Act, the Australian Privacy Principles include rules on using personal information for direct marketing.

In the CRM, this means recording for each contact:

- **Consent status** for each channel, such as email, text and phone.
- **How and when consent was obtained**, such as a web form, event registration or existing customer relationship.
- **Opt-outs**, with dates, applied across every system that sends marketing.
- **Preferences**, such as topics of interest or frequency.

Transactional and service messages, such as order confirmations and service notices, are treated differently from marketing, but keep them clearly distinguished in practice. The [privacy by design in business databases](/insights/privacy-by-design-in-business-databases/) article covers wider privacy practices for personal information, and the Australian Communications and Media Authority publishes guidance on spam and telemarketing rules.

### Buying or importing contact lists

Purchased lists and contacts gathered at trade shows or from business cards need particular care. Before importing, check where the data came from and whether the people on it have consented to receive marketing from your business, or whether another lawful basis applies. Match the list against existing records to avoid duplicates, record the source and date on every imported contact, and keep marketing to imported contacts within what the consent and the law allow. Lists of uncertain origin often bring more compliance risk and bounced messages than genuine leads.

## Keeping data current

Build updates into normal work rather than relying on occasional projects:

- **Act on bounces and returned mail**: flag the record and seek updated details.
- **Ask during interactions**: sales and service staff confirm details during calls and visits, updating the "last verified" date.
- **Review key accounts regularly**: confirm contacts and roles for the most important customers at least annually.
- **Capture departures**: when a contact leaves, record it and identify their replacement.
- **Use web forms and portals** that let customers update their own details.
- **Consider data services** that check business details, provided the source of their data is lawful and their use is consistent with privacy obligations.

## Interaction records

Logged interactions give continuity when staff change and help everyone see the state of a relationship. Keep notes factual and professional, record the purpose and outcome, avoid sensitive personal information that the business does not need, and remember that individuals may be entitled to see information held about them.

## Contacts for service and support

CRM data is not only for sales. Service and support teams need site contacts, after-hours numbers, accounts payable contacts and the people responsible for equipment the business has supplied. Linking contacts to sites and installed equipment, and recording their roles, means technicians and support staff reach the right person quickly. Service interactions also reveal outdated details sooner than sales activity does, so give service staff the same easy way to update contacts.

## Introducing or replacing a CRM

A new CRM is a chance to start with clean data, and a risk of importing old problems into an expensive new system. Before migrating, agree the structure of accounts, contacts and roles, define required fields and picklists, remove duplicates and stale records, and establish consent status for each contact. Import in stages, test with real users and records, and set up the processes that keep data current from the first day. A smaller, accurate set of contacts is far more valuable than a large one nobody trusts.

## Governance

- **Define who can create, edit, merge and delete** accounts and contacts.
- **Assign account owners** responsible for keeping key account information current.
- **Appoint a data steward** for the CRM as a whole, responsible for standards, duplicate management and quality reporting.
- **Decide the system of record** for customer data when the CRM connects to accounting, quoting or marketing systems, and synchronise rather than duplicate.

## Departing staff and personal contact lists

Sales relationships often live in individuals' phones and inboxes. Encourage staff to record contacts and key interactions in the CRM as part of normal work, rather than at the end of a relationship, and include a CRM review in handover when people leave, so relationships are not lost with them.

## Measuring contact data quality

| Measure | What it shows |
|---|---|
| Email bounce rate on campaigns | Validity of email addresses |
| Percentage of contacts verified in the past 12 months | Currency |
| Suspected duplicates found per month | Whether creation controls work |
| Contacts with missing roles or accounts | Completeness |
| Contacts with unknown consent status | Compliance risk |
| Key accounts with confirmed decision makers | Coverage where it matters most |

Review the measures regularly with sales and marketing leaders, and fix the processes that produce poor data. The [customer lifetime value, acquisition cost and retention](/insights/customer-lifetime-value-acquisition-cost-and-retention/) article explains why retaining customers, which depends on staying in touch with the right people, is so valuable.

## Common mistakes

- **One-off clean-ups** without changing the processes that create bad data.
- **Overwriting contacts** when people change employers, losing history.
- **Importing lists** without matching or recording consent.
- **Merging duplicates carelessly**, losing opt-outs or history.
- **Free-text classifications** that cannot be reported on.
- **Unknown consent status** for large parts of the database.
- **Contacts kept in personal phones** instead of the CRM.

## A worked example

This is an illustrative example. An industrial supplier's CRM holds about 12,000 contacts and 3,500 accounts accumulated over eight years. A marketing email campaign records an 18% bounce rate, sales staff complain that contacts are out of date, and a review finds that consent status is unknown for about 40% of contacts.

**Clean-up.** Duplicate checks find about 9% of contacts and 6% of accounts duplicated. These are merged carefully, preserving interaction history and the most restrictive consent status. Bounced addresses are flagged, and contacts with no activity and unknown consent for more than three years are reviewed; those without a current business relationship or a lawful basis for marketing are excluded from marketing and, where no longer needed, removed in line with the business's retention rules.

**Process changes.** The CRM checks for duplicates at entry, phone numbers and company names follow standards, roles are required, and consent source and date are recorded for every new contact. Sales staff confirm details during visits, and account owners review contacts for the top 200 accounts annually. Opt-outs synchronise automatically with the email platform.

**Result.** The next campaign's bounce rate falls to about 3%, sales staff find the right contacts more often, and the business can show how it obtained consent for the people it markets to. Quarterly quality reports now go to the sales and marketing managers, and the share of contacts verified within the past year rises steadily as confirmation becomes part of every customer visit and service call.

## Applying this in an Australian business

- **Separate accounts, contacts and roles**, and keep history when people move.
- **Check for duplicates** at entry and regularly, and merge carefully.
- **Standardise formats** and use picklists.
- **Record consent and opt-outs** for each channel, following Spam Act and privacy requirements.
- **Build updates into daily work**, with a "last verified" date.
- **Assign account owners** and a CRM data steward.
- **Measure quality** and fix the processes behind poor data.

## Questions worth considering

- What share of our contacts bounced or were out of date in our last campaign?
- How many duplicate accounts and contacts does our CRM hold?
- Could we show how and when each contact agreed to receive marketing?
- What happens to a contact's record when they change employers?
- Where do our salespeople really keep their contact details?
- Who is responsible for the overall quality of our CRM data?

## Bringing it together

Customer contact data decays constantly, so its quality depends on structure, standards and habits rather than occasional clean-ups. Separate accounts, contacts and roles; prevent and carefully merge duplicates; standardise formats; record consent and opt-outs in line with Australian rules; build verification into everyday interactions; assign ownership; and measure quality. A CRM maintained this way gives sales, service and marketing a reliable shared view of the people the business depends on.

---

*Source: KEVOS editorial notes, drawing on general customer relationship management, marketing operations and data management practice. Legal requirements are summarised for orientation; check current guidance from the relevant regulators and seek advice where needed. The worked example is illustrative. This article is general information.*
