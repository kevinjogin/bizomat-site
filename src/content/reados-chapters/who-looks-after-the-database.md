---
title: "Who looks after the database? Database administration responsibilities for small and medium businesses"
description: "Databases need routine care, yet in many businesses nobody clearly owns it. The tasks involved, how to share them between staff, IT providers and vendors, and how to avoid gaps."
publishDate: 2026-10-09
category: "Operations"
tags:
  - systems
  - operations
  - people
author: "BIZOMAT"
featured: false
draft: false
---

Large organisations employ database administrators whose full-time job is to keep databases secure, backed up, patched, fast and available. Small and medium businesses rarely have that role, yet their databases need much of the same care. The work is usually spread across an office manager who checks that backups ran, an external IT provider who maintains the servers, a software vendor who supports the application and perhaps a staff member who once built a reporting database and is the only person who understands it.

Spreading the work is reasonable. The danger is the gaps between the parties. A common discovery after an incident is that the software vendor assumed the IT provider was backing up the database, the IT provider assumed the vendor's application did it, and nobody had tested a restore. Similar gaps appear in patching, monitoring, user access reviews, capacity planning and documentation.

This article explains what database administration involves, the routine tasks that need doing daily, weekly, monthly and annually, the options for resourcing them, how to assign responsibilities clearly between staff, IT providers and vendors, what to include in service agreements, and how to reduce reliance on single individuals. It is general information for owners and managers of small and medium businesses.

## What database administration covers

Database administration is the set of activities that keep databases available, accurate, secure and performing well. It typically includes:

| Area | Activities |
|---|---|
| Availability | Monitoring, responding to failures, planning for high availability where needed |
| Backup and recovery | Configuring backups, checking they succeed, testing restores, documenting recovery steps |
| Security | Managing accounts and permissions, reviewing access, applying security settings, monitoring for misuse |
| Maintenance | Applying patches, updating statistics, maintaining indexes, checking database integrity |
| Performance | Monitoring response times, investigating slow queries, tuning configuration |
| Capacity | Tracking data growth and resource use, planning storage and upgrades |
| Change | Applying application updates and structural changes safely, with testing and rollback plans |
| Documentation | Recording configuration, procedures, credentials locations and contacts |
| Lifecycle | Planning upgrades before versions lose support, retiring old databases |

Not every business needs every activity at the same depth, but each should be consciously covered or consciously accepted as a risk.

## Routine tasks by frequency

A simple schedule makes routine care visible. An illustrative set for a business-critical database:

**Daily**
- Check that backups completed successfully, including transaction log backups.
- Review alerts for failures, errors and unusual activity.
- Confirm the database and key applications are available.

**Weekly**
- Review storage space and growth.
- Check database integrity and maintenance jobs.
- Review any failed logins or security alerts.

**Monthly**
- Apply security patches after testing, according to the patching policy.
- Review performance trends against baselines.
- Check that new databases or systems have been added to backups and monitoring.

**Quarterly**
- Test a restore, timing it against recovery targets.
- Review user and administrator access, removing accounts no longer needed.
- Review vendor and remote access.

**Annually**
- Review recovery targets with business owners.
- Check software versions against vendor support life cycles and plan upgrades.
- Review documentation and contact lists.
- Review licensing against actual deployment.

```figure
type: timeline
title: Routine database care by frequency
caption: A simple schedule makes routine care visible, and shows who does each task.
- Daily | Check backups completed | review alerts; confirm availability
- Weekly | Storage and integrity | maintenance jobs; failed logins
- Monthly | Tested security patches | performance trends; new systems covered
- *Quarterly | Test a restore | review user, vendor and remote access
- Annually | Recovery targets with owners | versions, documentation, licensing
```

## Options for resourcing the work

| Option | Suits | Strengths | Watch for |
|---|---|---|---|
| In-house staff member with some database skills | Businesses with an IT person and simple systems | Knows the business; quick response | Key-person risk; skills may be limited |
| Managed IT service provider | Most small and medium businesses | Broad skills; monitoring tools; cover for absences | Database depth varies; responsibilities must be explicit |
| Software vendor support | Packaged applications | Deep knowledge of the application and its database | Often supports the application, not the server or backups |
| Specialist database consultancy | Complex or critical databases; periodic health checks | Deep expertise | Cost; may not provide day-to-day cover |
| Managed cloud database service | Custom systems hosted in the cloud | Provider handles much infrastructure, patching and backup | Customer still owns access, configuration, data and testing |

Most businesses combine several. What matters is that the combination covers every task without gaps or overlaps.

## Making responsibilities explicit

A simple **responsibility matrix** lists each task and shows who is responsible for doing it, who is accountable for making sure it is done, and who needs to be consulted or informed. For example:

| Task | Business owner | IT provider | Software vendor |
|---|---|---|---|
| Set recovery targets | Accountable | Consulted | Consulted |
| Configure and monitor backups | Informed | Responsible | Consulted |
| Test restores | Accountable | Responsible | Consulted |
| Apply operating system patches | Informed | Responsible | Consulted |
| Apply application and database updates | Approves | Responsible for infrastructure | Responsible for application |
| Manage user access | Accountable, approves | Responsible for accounts | Advises on roles |
| Investigate performance problems | Informed | Responsible for infrastructure | Responsible for application queries |
| Plan version upgrades | Accountable | Responsible | Responsible |

The exercise of filling in the matrix with each party usually reveals assumptions that do not match. Agree it in writing and revisit it when suppliers or systems change.

## Service agreements with providers

Agreements with IT providers and software vendors should state clearly:

- **Which databases and systems are covered.**
- **Which tasks are included**, such as backups, restore testing, patching and monitoring.
- **Response and resolution times** for incidents of different severity, including outside business hours if needed.
- **Reporting**, such as monthly backup and patch status.
- **Access arrangements**, including how provider staff connect and how access is controlled and logged.
- **Security and confidentiality obligations**, including notification of incidents.
- **What happens at the end of the agreement**, including handover of documentation, credentials and data.

Ask for evidence periodically, such as backup reports and restore test results, rather than relying on assurances.

## Handling changes safely

Many database incidents are caused by changes: an application update that alters tables, a patch applied without testing, an index added in a hurry or a bulk correction run directly against live data. A light but consistent change process prevents most of them:

1. **Describe the change** and why it is needed.
2. **Assess the risk** and who will be affected.
3. **Test it** on a copy of the database where practical.
4. **Take a backup immediately beforehand** and confirm it succeeded.
5. **Schedule it** outside busy periods and tell affected users.
6. **Prepare a rollback plan** in case the change fails.
7. **Verify the result** afterwards with agreed checks.
8. **Record what was done.**

Approval should come from the business owner of the system for significant changes, not only from the person making the change.

## When something goes wrong

Incidents are less damaging when the first hour is planned. For each critical database, the business should know who notices a failure, who is called first, who can authorise a restore that may lose some recent data, how staff and customers will be told, and how work continues meanwhile, for example on paper forms. After the incident, a short review of what happened, why and what will change turns a bad day into lasting improvement. Keep the contact list and recovery steps where they can be reached when systems are down.

## What it costs, and what it saves

Routine database care is usually a modest cost: part of an IT provider's monthly fee, some internal time each week and an occasional specialist health check. It should be compared with the cost of what it prevents: days of lost orders or production records, staff idle while systems are rebuilt, emergency consultants at short notice, and in some cases notification and investigation costs after a breach. Asking providers to price routine care separately makes the comparison visible.

## Documentation that outlasts people

Database knowledge often lives in one person's head. Reduce that risk with documentation that someone else could follow:

- **An inventory** of databases, their purpose, location, versions, sizes and owners.
- **Configuration notes**: important settings and why they were chosen.
- **Backup and restore procedures**, step by step.
- **Where credentials and encryption keys are stored**, in a secure password manager or vault with access for more than one trusted person.
- **Contacts and escalation paths** for providers and vendors.
- **Change history** for significant changes.
- **Diagrams** showing how systems connect.

Store documentation securely but accessibly, including a copy reachable if the main systems are down.

## Reducing key-person risk

- **Make sure at least two people** can perform critical tasks, such as restoring a database.
- **Rotate tasks** occasionally, so knowledge spreads.
- **Hold administrator credentials in a shared vault**, not personal notebooks or browsers.
- **Hand over properly** when staff or providers change, with a checklist and a test restore performed by the new party.

## Skills worth having in the business

Even when providers do most of the work, someone in the business benefits from enough understanding to ask good questions:

- What recovery point and time objectives mean, and what the business has chosen.
- How to read a backup report and recognise failures.
- Who has access to which systems and why.
- Which database versions are in use and when their support ends.
- How to raise and track incidents with providers.

The [hidden costs of outsourcing a function](/reados/collections/suppliers-contractors-and-government-work/hidden-costs-of-outsourcing-a-function/) article discusses how to keep enough capability in-house to manage outsourced work well.

## Custom and in-house databases

Databases built in-house, such as reporting databases, desktop database applications or tools developed by a staff member, are the most likely to be missed. They may not be on the IT provider's list, may not be backed up, and may depend on one person. Add them to the inventory, assign an owner and decide whether to support them properly, move them to a supported platform or retire them.

## Signs that database care is being neglected

- Nobody can say when a restore was last tested.
- Backup failure alerts go to a mailbox nobody reads.
- The database version is several years old and approaching or past the end of support.
- Former staff and old vendor accounts still exist.
- Storage warnings appear regularly and are cleared by deleting files in a hurry.
- Performance has slowly worsened and everyone has accepted it.
- Questions about the database are answered with "ask the person who set it up".

Any one of these is a prompt to review responsibilities before an incident forces the issue.

## Common mistakes

- **Assuming someone else does it**, especially backups and restores.
- **No written responsibility matrix** between staff, providers and vendors.
- **Credentials known only to one person.**
- **In-house databases** missing from backups and monitoring.
- **Never asking for evidence** of backups, restores and patching.
- **No handover** when an IT provider or staff member changes.
- **Ignoring support life cycles** until software is unsupported.

## A worked example

This is an illustrative example. A manufacturer with 70 staff uses a production planning system whose database runs on a server at its factory, supported by the software vendor and a managed IT provider. A staff member in finance also maintains a desktop database used for costing.

**Trigger.** After a near miss in which a disk failure almost corrupted the planning database, the owner asks both suppliers to describe their responsibilities.

**Findings.** The vendor believed the IT provider backed up the database; the IT provider was backing up the server's files nightly but not using database-aware backups, and had never tested a restore. Neither knew about the costing database, which lived on the finance officer's laptop and was copied to a USB drive occasionally. The database's version would leave vendor support within 14 months.

**Changes.** The parties agree a responsibility matrix. The IT provider implements database-aware backups with transaction logs, monthly reporting and quarterly restore tests witnessed by the operations manager. The vendor schedules an upgrade within the support window. The costing database moves to a server location covered by backups, with documentation written by the finance officer and a second person trained. Credentials move into a shared password vault.

**Result.** The first restore test succeeds in three hours. The business now has written responsibilities, evidence that backups work, an upgrade plan and no databases hidden on laptops. The additional cost is a modest increase in the IT provider's monthly fee in this illustration.

```figure
type: compare
title: A 70-person manufacturer after a near miss
cols: Found | Changed to
best: 2
caption: Written responsibilities and evidence that backups work, for a modest increase in the monthly IT fee.
- Backups | Server files nightly, not database-aware | Database-aware, with transaction logs
- Restore test | Never tested | Quarterly; the first succeeds in three hours
- Costing database | On a laptop, copied to USB occasionally | On a backed-up server, a second person trained
- *Support | Ending within 14 months | Upgrade scheduled within the support window
```

## Applying this in an Australian business

- **List every database**, including desktop and in-house ones.
- **Agree a responsibility matrix** with staff, IT providers and vendors.
- **Set a routine schedule** of daily to annual tasks.
- **Ask for evidence**, such as backup reports and restore tests.
- **Write service agreements** that state included tasks and response times.
- **Document configurations, procedures and credentials locations.**
- **Train at least two people** for critical tasks.
- **Plan upgrades** within support life cycles.

## Questions worth considering

- Who is responsible for backing up each of our databases, and have they confirmed it in writing?
- When did someone last restore one of our databases successfully?
- Which databases depend on one person's knowledge?
- When do our database versions lose vendor support?
- What evidence do our providers give us that routine tasks are done?

## Bringing it together

Databases need routine care, even in businesses without a database administrator. The work covers availability, backups and restores, security, maintenance, performance, capacity, change, documentation and life cycle planning. It can be shared between staff, IT providers, vendors and cloud services, provided responsibilities are written down, evidence is checked, documentation exists and at least two people can perform critical tasks. Gaps between parties, not lack of technology, cause most failures.

---

*Source: BIZOMAT editorial notes, drawing on general database administration and IT service management practice. The worked example is illustrative. This article is general information.*
