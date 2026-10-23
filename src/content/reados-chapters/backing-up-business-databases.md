---
title: "Backing up business databases: recovery targets, restore testing and resilience against ransomware"
description: "A backup is only as good as the restore it allows. How to set recovery point and time targets, choose backup types, protect copies from ransomware and prove that restores work."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - operations
  - quality
author: "KEVOS®"
featured: false
draft: false
---

Most businesses believe their important systems are backed up. Far fewer have checked how much data they would lose, how long recovery would take, or whether a backup can actually be restored. The gap usually becomes visible at the worst moment: a server fails on a Monday morning, a staff member deletes hundreds of records by mistake, or ransomware encrypts both the live systems and the backups stored beside them.

Databases need particular care. They change constantly, they hold the records a business cannot recreate from memory, and copying their files while they are running can produce backups that will not restore. Many businesses also assume that cloud services or software vendors take care of backups, when the responsibility may in fact rest with them.

This article explains how to set recovery targets for business databases, the main kinds of backup and how they work together, how to protect backups from ransomware and other threats, how to test restores, what to check for cloud and subscription software, and how to document and monitor the arrangement. It is general information for owners, managers and IT providers of small and medium businesses.

## Start with recovery targets

Two measures define what a backup arrangement must achieve:

- **Recovery point objective (RPO)**: the maximum amount of data, measured in time, the business can afford to lose. An RPO of one hour means that after an incident, data should be recoverable to within an hour of the failure.
- **Recovery time objective (RTO)**: the maximum time the business can afford to be without the system. An RTO of four hours means the system should be working again within four hours.

Targets should come from the business, not from the technology. Ask what it would cost, financially and in customer goodwill, to lose an hour, a day or a week of orders, jobs, payments or production records, and how long each function can operate without its system. A payroll system needed once a fortnight may tolerate a longer RTO than an order system used all day.

| System | Example RPO | Example RTO | Reasoning |
|---|---|---|---|
| Order and inventory system | 15 minutes | 4 hours | Orders arrive all day and are hard to recreate |
| Accounting system | 24 hours | 1 business day | Transactions can be re-entered from bank records and documents |
| Engineering file store | 24 hours | 2 business days | Daily changes are recoverable from designers' recent work |
| Website content | 1 week | 1 business day | Changes are infrequent |

```figure
type: bars
title: How much data each system can afford to lose
unit: hours
max: 170
caption: Recovery point objectives from the example: set them from the business impact, then design backups to meet them.
- *Order and inventory | 0.25 | 15 minutes
- Accounting | 24
- Engineering file store | 24
- Website content | 168 | 1 week
```

These are illustrations. The [business continuity planning for small businesses](/reados/collections/operational-data-records-and-controls/business-continuity-planning-for-small-businesses/) article explains how to identify critical functions and set recovery targets across the whole business.

## Why databases need specific backup methods

Copying the data files of a running database with ordinary file backup tools can capture them mid-change, producing a backup that is inconsistent or will not open. Databases provide their own backup methods, and specialised backup products integrate with them, to produce consistent copies while the system keeps running.

## Kinds of backup

| Type | What it captures | Strengths | Limitations |
|---|---|---|---|
| Full backup | The entire database | Simple to restore | Large and slow for big databases |
| Differential backup | Changes since the last full backup | Faster than full; restore needs only full plus latest differential | Grows through the week |
| Incremental backup | Changes since the last backup of any kind | Small and fast | Restore needs the full backup plus every incremental |
| Transaction log backup | The database's log of individual changes | Allows restore to a precise point in time | Requires careful management of the backup chain |
| Storage snapshot | A point-in-time image of a disk or virtual machine | Very fast to take and restore | Must be coordinated with the database to be consistent; often stored on the same system |
| Replica | A continuously updated copy on another server | Fast failover | Copies mistakes and corruption instantly; not a backup by itself |

A typical arrangement for an important business database combines a weekly full backup, daily differential backups and transaction log backups every 15 minutes. That allows recovery to almost any point in time, such as one minute before a mistaken deletion.

```figure
type: timeline
title: A typical backup week for an important database
caption: Together they allow recovery to almost any point in time.
- Weekly | Full backup | the whole database
- Daily | Differential | changes since the full backup
- *Every 15 minutes | Transaction log | individual changes
```

### Replication is not backup

Replicas and mirrored disks protect against hardware failure, but they faithfully copy deletions, corruption and encryption by ransomware. They complement backups; they do not replace them.

## Where backups are kept

A widely used guideline, often called the **3-2-1 rule**, recommends at least three copies of data, on at least two different kinds of storage, with at least one copy off site. Many practitioners now extend it:

- **At least one copy offline or immutable**, meaning it cannot be changed or deleted for a set period, even by an administrator account.
- **Backups verified** to restore without errors.

Off-site copies protect against fire, flood and theft at the premises. Offline or immutable copies protect against ransomware and malicious insiders, who increasingly target backups before encrypting live systems.

## Protecting backups from attack

Ransomware attackers often spend time inside a network before acting, looking for backups to delete or encrypt. Protective measures include:

- **Separate credentials** for backup systems, not the same administrator accounts used for everyday IT.
- **Multi-factor authentication** for backup consoles and cloud backup accounts.
- **Immutable storage**, where backups cannot be altered or deleted until a retention period ends.
- **Offline copies**, such as disconnected drives or tapes rotated off site.
- **Encryption of backups**, with encryption keys stored securely and separately, so backup media are useless if stolen, and so the business can still decrypt them when needed.
- **Monitoring and alerts** for unusual backup deletions or changes to retention settings.

The Australian Signals Directorate's Essential Eight includes regular backups, with restoration tested and backups protected from unauthorised changes, as one of its core mitigation strategies. The [cyber security basics for small businesses](/reados/collections/business-systems-security-and-it-decisions/cyber-security-basics-for-small-businesses/) article explains the Essential Eight in more detail.

## How long to keep backups

Backup retention balances recovery needs, cost and obligations:

- **Short-term**: frequent backups kept for days or weeks for recovering recent mistakes and failures.
- **Medium-term**: weekly or monthly backups kept for months, because some problems, such as gradual data corruption or a slowly discovered error, are found late.
- **Long-term**: end-of-month or end-of-year copies, if needed, though long-term record keeping is often better served by archives designed for retrieval rather than by old backups.

Keeping backups longer than necessary increases cost and can conflict with obligations to destroy personal information that is no longer needed.

## Testing restores

A backup that has never been restored is a hope rather than a plan. Restore testing should:

- **Happen on a schedule**, such as quarterly for critical systems and after major changes.
- **Restore to a separate environment**, never over the live system.
- **Check the result**: the database opens, record counts and key totals match expectations, and the application works with the restored data.
- **Time the process**, to confirm the recovery time objective is achievable.
- **Test point-in-time recovery**, not only full restores.
- **Include the less obvious pieces**: application configuration, encryption keys, licence files and connection settings.
- **Be recorded**, with results, problems and fixes.

Restore tests often reveal problems such as missing encryption keys, incomplete backup chains, backups of the wrong database or restore times far longer than expected.

## Different incidents need different restores

Recovery plans should cover the kinds of incident a business is likely to face, because each calls for a different approach:

- **Hardware failure**: restore the latest backup and transaction logs to replacement hardware or a cloud server, aiming for the full recovery point objective.
- **Accidental deletion or a faulty bulk update**: restore a copy of the database to a separate location as at a point just before the mistake, then copy the affected records back, so that later valid work is not lost.
- **Corruption discovered late**: work back through older backups to find the last good copy, which is why medium-term retention matters.
- **Ransomware**: rebuild systems in a clean environment, confirm the backups chosen predate the attacker's access, check them for malicious changes and restore only after the cause has been contained. Restoring onto infected systems simply repeats the incident.
- **Loss of the premises**: recover from off-site copies onto cloud or alternative hardware, following the business continuity plan.

Practising at least the first two in restore tests builds the confidence and familiarity needed for the harder ones.

## Cloud services and subscription software

Moving to the cloud changes backup responsibilities rather than removing them:

- **Managed database services** usually provide automated backups and point-in-time restore, but default retention periods may be short, and deleting a database can delete its backups. Check settings and consider additional copies.
- **Virtual servers** in the cloud typically need backups configured by the customer.
- **Subscription software** providers back up their platforms for their own recovery, but may not restore an individual customer's deleted data, or only within a limited period. Office and email suites in particular are often covered by shared-responsibility terms that leave protection against accidental deletion and long-term retention to the customer.
- **Exports** of critical data from subscription software, taken regularly, provide a fallback if the provider fails or the relationship ends.

Read the service terms and ask providers directly what they back up, for how long, how restores are requested and how long they take.

## Documenting the arrangement

A short backup and recovery document for each critical system should record:

- **The recovery point and time objectives.**
- **What is backed up**, how often and where copies are stored.
- **Retention periods.**
- **Who is responsible** for monitoring and restores.
- **Step-by-step restore instructions**, including where credentials and encryption keys are held.
- **The date and result of the last restore test.**

Store this document where it can be reached during an incident, including when the main systems are unavailable.

## Monitoring

Backups fail silently more often than people expect: storage fills, credentials expire, a new database is added but not included, or a job stops after a software update. Monitoring should:

- **Alert on failed or missed backups**, sent to someone who will act.
- **Report regularly** on backup status for each system.
- **Check that new systems and databases** are added to the backup schedule.
- **Track storage capacity** and costs.

## Common mistakes

- **Relying on replication or mirrored disks** as the only protection.
- **Copying live database files** instead of using proper database backups.
- **Storing all backups on the same network** as the systems they protect.
- **Using everyday administrator accounts** for backup systems.
- **Never testing restores**, or testing only that backup jobs report success.
- **Assuming cloud and subscription providers** cover everything.
- **Losing encryption keys**, making backups unusable.
- **Ignoring backup alerts** until an incident.

## A worked example

This is an illustrative example. A wholesale distributor's order and inventory system runs on a server database in its office. Backups were set up years ago: a nightly full backup to a storage device in the same server room, and a weekly copy taken home on a portable drive by the office manager.

**Targets.** The owner and managers decide that losing more than 15 minutes of orders would cause serious disruption, and that the system must be working within four hours during trading hours.

**Gaps.** Against those targets, the IT provider finds several problems: the nightly backup alone could lose up to 24 hours of data; the storage device is on the same network and uses the same administrator account as the server, so ransomware could encrypt it; the portable drive copy is often weeks old; and no restore has ever been tested.

**Changes.** The provider adds transaction log backups every 15 minutes, copies backups to immutable cloud storage with a 30-day lock, uses separate credentials with multi-factor authentication for the backup system, and sets alerts for failures. A quarterly restore test is scheduled. The additional cost is about $150 a month in this illustration.

**First test.** The first restore test takes six hours, exceeding the four-hour target, because restoring from cloud storage is slower than expected. The provider adds a local immutable copy for fast restores, keeping the cloud copy for disasters. The next test completes in under two hours, including checks of order counts and stock totals.

**Result.** The business now knows how much data it could lose, how long recovery would take and that its backups would survive a ransomware attack on the office network.

```figure
type: bars
title: Restore test time against a four-hour target
unit: hours
max: 7
caption: A local immutable copy was added for fast restores, keeping the cloud copy for disasters; about $150 a month extra.
- First test, from cloud storage | 6
- *Second test, local immutable copy | 2 | under two hours, with checks
```

## Applying this in an Australian business

- **Set recovery point and time objectives** for each critical system.
- **Use database-aware backups**, including transaction logs where needed.
- **Keep copies off site and at least one offline or immutable.**
- **Separate backup credentials** and use multi-factor authentication.
- **Test restores regularly** and time them.
- **Check cloud and subscription services** for what they really cover.
- **Document restore steps** and keep them reachable during an incident.
- **Monitor backups** and act on alerts.

## Questions worth considering

- How much data would we lose if our main database failed right now?
- How long would it take to restore, and when did we last test it?
- Could ransomware on our network also reach our backups?
- What exactly do our cloud and subscription providers back up, and for how long?
- Who would receive and act on an alert that last night's backup failed?

## Bringing it together

Backups exist to make restores possible within targets the business has chosen. Set recovery point and recovery time objectives for each critical system, use database-aware backup methods, keep copies off site and protected from ransomware, check what cloud services really provide, document and monitor the arrangement, and test restores regularly. A tested restore is the only real evidence that a backup will work when it is needed.

---

*Source: KEVOS® editorial notes, drawing on general information technology, database administration and cyber security practice. Costs and timings in the worked example are illustrative. This article is general information.*
