---
book: cad-data-you-can-trust
chapterSlug: backups-you-have-restored
order: 7
title: "Backups you have actually restored"
description: "Set recovery point and recovery time objectives for a CAD vault, back up its database and file archive at one consistent point, and prove recovery with a timed test restore."
draft: false
---

Every business believes it has backups. Fewer have restored one under realistic conditions, and fewer still have restored a product data management vault, which is not one thing to back up but several things that must agree with each other. A vault whose database says a file has 48 versions while its file store holds only 47 is not a vault; it is a puzzle.

This chapter sets recovery objectives for the running case team's vault, explains what must be backed up and why it must be consistent, calculates restore times, and describes a restore test. Its error case is a backup that copied every file faithfully and still could not be restored.

## A vault is several things

A typical PDM vault has at least three parts, though products name and arrange them differently:

- a **database** that records files, versions, states, properties, references, users and history;
- a **file store**, sometimes called an archive, that holds the actual CAD files and every version of them;
- **configuration**, including lifecycle definitions, permissions, templates, scripts and the server settings that hold everything together.

Many systems also maintain a search index, which can usually be rebuilt from the database and file store, at the cost of time.

The database and the file store must describe the same moment. If the database is restored from Saturday and the file store from Sunday, the file store holds versions the database has never heard of. If the database is from Sunday and the file store from Saturday, the database points at versions that do not exist. Either way, files fail to open or open the wrong version. This is why vendors publish specific backup procedures for their vaults, and why those procedures matter more than general advice.

## Set recovery objectives

NIST's contingency planning guide, SP 800-34, defines three terms in its section on business impact analysis that are useful for any system, however small. Paraphrased:

- **Maximum tolerable downtime** is the total time the business can accept the process being unavailable, considering all its impacts.
- **Recovery time objective** is the longest a system can stay unavailable before that becomes unacceptable for the processes it supports. It must fit within the maximum tolerable downtime.
- **Recovery point objective** is the point in time to which data must be recovered after an outage, which in practice means how much recent work the business can afford to lose.

The running case team worked through each for its vault.

**Maximum tolerable downtime.** The team could work for about two working days without the vault by viewing released PDFs and postponing changes. Beyond that, deliveries would slip. The engineering manager set two working days.

**Recovery time objective.** To leave time for problems, the team set four working hours for getting the vault back in use after a server failure.

**Recovery point objective.** This is the costliest decision, and it is worth calculating rather than guessing.

## Price the recovery point

If the vault is backed up once a night, a failure late in the day loses up to a full day's work. Nine CAD users working 7.6 hours each would lose up to **9 × 7.6 = 68.4 hours**, worth about **A$6,498** at the internal rate, plus the disruption of redoing it. If the vault is also captured every two hours during the working day, the most work lost falls to about **9 × 2 = 18 hours**, about **A$1,710**.

```figure
type: compare
title: Recovery point options for the vault
cols: Worst-case work lost | Worst-case cost at A$95 an hour
caption: This is an illustration. The cost is of re-doing lost work only; delay to customers is extra.
- Nightly backup only | up to 68.4 hours, a full day for nine people | about A$6,498
- *Nightly plus two-hourly captures in working hours | up to 18 hours | about A$1,710
```

The two-hourly captures cost little extra, because most modern backup tools can take frequent incremental snapshots and the vault's daily change is small. The team chose them. The KEVOS® [downtime cost](/tools/downtime-cost/) tool can help frame the same calculation for other systems where lost time, rather than lost data, is the main cost.

## Keep copies in more than one place

A backup on the same server as the vault protects against a deleted file, not against a failed server, a fire or ransomware that encrypts everything it can reach. The team keeps three copies of its vault data:

- the live vault on its server;
- a local backup on a separate storage device in the building, used for fast restores;
- an offsite copy, held by a cloud backup service, that ordinary user and administrator accounts cannot modify or delete.

The last condition is important. Ransomware typically runs with the permissions of whoever it has compromised, and if that account can delete backups, it will. The Australian Signals Directorate's Essential Eight lists regular backups among its baseline strategies, and its guidance expects restores to be tested and backups to be protected from modification or deletion by ordinary accounts. The team's IT provider configured the offsite copy so that deleting it requires a separate account held by the provider, with a retention period during which nothing can be removed.

## The error case: every file, and no vault

Three months after go-live, the CAD administrator ran the team's first full test restore onto a spare server. The local backup reported success every night. The administrator restored the database and file store from the most recent Sunday backup, started the vault software and opened the main skid assembly.

It failed. The vault reported **37** file versions that the database listed but the file store did not contain. Several recent assemblies would not open at all.

Investigation took an afternoon. The database and file store were backed up by two separate jobs. The database job ran at 10 pm on Saturday; the file store job, which took longer, started at 11 pm and had been scheduled, during a busy week, to run on Sunday night instead of Saturday. Two designers had worked on Saturday afternoon and early Sunday, checking in files. The restore combined a database from one point with a file store from another.

The nightly reports had been accurate: each job had copied what it was asked to copy. The backup had been incomplete in the only sense that mattered, which was that it could not be restored into a working vault. Nobody would have known until a real failure.

The correction followed the vendor's procedure for the vault. Both parts are now captured at a single, consistent point, using a snapshot method that briefly pauses writes to the database while the file store and database are captured together. The backup job verifies that the database's record of versions matches the file store after each capture, and alerts the administrator if it does not. And the test restore, which found the problem, became a quarterly routine.

```figure
type: checklist
title: Quarterly test restore of the vault
caption: This is an illustration of the team's routine. A restore that has not been tested is a hope, not a backup.
- Restore database and file store from one backup point | onto a spare server, not the live one
- Time the restore | from start to a working vault, for comparison with the recovery time objective
- Open sample assemblies | the three largest, plus three chosen at random
- Compare mass and bounding box | against values recorded from the live vault, as in the migration
- Check history and states | recent releases appear with the right approver and date
- Restore one file from the offsite copy | proving the offsite route works too
- ? Record and act | log the times, faults and fixes; update the procedure
```

## Decide how far back you can go

The recovery point objective says how recent the newest backup must be. Retention says how old the oldest can be. Both matter, because some problems are discovered late. A file corrupted in a way that does not show until it is next opened, a deletion nobody notices for a month, or ransomware that sits quietly before acting can all mean that the most recent backups contain the damage too.

The team's retention schedule keeps two-hourly captures for two days, nightly backups for 30 days, month-end backups for 12 months and a year-end backup for seven years. The long tail costs little, because most of the vault's data does not change from one month to the next and the backup tool stores only differences. Its value lies in the rare case: a customer query about a skid built six years ago, where the released files should still be in the vault but a backup provides a second, independent record.

Retention also interacts with the vault's own history. A vault keeps every version of every file, so many problems that would need a backup on a shared drive, such as an unwanted change to a part, can be undone inside the vault by retrieving an earlier version. Backups exist for problems with the vault itself: failure, corruption, loss or attack. Keeping the two purposes distinct prevents a common confusion in which people treat the backup as their version history, or the version history as their backup.

## Say who is responsible

Backups fail most often at the boundaries between people. The IT provider assumes the CAD administrator checks restores; the administrator assumes the IT provider does; the engineering manager assumes both. The team wrote the division down:

- the **engineering manager** owns the recovery objectives and approves changes to them;
- the **IT provider** runs and monitors the backup jobs, keeps the offsite copy protected and reports failures;
- the **CAD administrator** owns the vendor's vault backup procedure, runs the quarterly test restore and reports its results;
- the **backup engineer** named in the CAD administrator's charter can carry out a restore using the written record if the administrator is unavailable.

The quarterly report is one page: the date, what was restored, how long it took, what was found and what was changed. Four of those a year are the evidence that the backups work.

## Calculate restore times

A recovery time objective is a promise, and restore time is the largest part of keeping it. The team's active vault held about **92 GB** after migration. The read-only archive share held about **94 GB** and changes rarely.

From the local backup device, the team measured restore throughput at about 160 MB a second. The active vault's files restore in about **92,000 ÷ 160 = 575 seconds**, under ten minutes. From the offsite copy over the building's 100 megabit internet link, throughput is at best about 12.5 MB a second, so the same data takes about **92,000 ÷ 12.5 = 7,360 seconds**, about **2.0 hours**.

```figure
type: formula
title: Restore time from data size and throughput
formula: Restore time = data size ÷ throughput
caption: This is an illustration using decimal units (1 GB = 1,000 MB) and best-case throughput; real restores also need time to start the server, restore the database and check the result.
- Active vault | 92 GB = 92,000 MB
- Local throughput | 160 MB a second
- Offsite throughput | 100 megabits a second ≈ 12.5 MB a second
step: Local: 92,000 ÷ 160 = 575 s ≈ 9.6 minutes
step: Offsite: 92,000 ÷ 12.5 = 7,360 s ≈ 2.04 hours
```

The file transfer is not the whole restore. The team's first successful test restore took about **1.5 hours** beyond the file transfer, for preparing the server, restoring and checking the database and starting the vault. From local backup the total was about 1.7 hours; from offsite, about 3.5 hours. Both met the four-hour objective, the offsite route only just.

## Restore what matters first

In a real failure, the team does not need all 92 GB at once. It needs the projects being worked on this week. Many vaults and backup tools allow a staged restore, bringing back the database and the most recently used files first and the rest afterwards.

The team documented a staged plan: restore the database and configuration, then the files for active projects and the library, then the rest. The first stage is a small fraction of the data and can be in use well within the objective even from offsite. The plan was tested once, in the second quarterly test, and recorded with its timings.

```figure
type: bars
title: Time to a working vault, by restore route
unit: h
max: 4
caption: This is an illustration from the team's test restores. The four-hour recovery time objective is the right-hand end of the scale.
- Full restore from local backup | 1.7
- *Staged restore from offsite, active projects first | 2.1
- Full restore from offsite | 3.5
```

The staged offsite restore took about 2.1 hours to a usable vault, against 3.5 hours for the full offsite restore, because the active projects and library were a fraction of the total. The remaining files continued to restore in the background while people worked. The test also showed something no calculation had: two designers needed files from a project that was not on the active list, which led the team to keep that list current each month rather than compiling it during an emergency.

## Back up configuration and know how to rebuild

A restored database and file store are useless without a server configured to run them. The team keeps a written record of the vault server's configuration, the software version and service pack, licence details and the steps to install it on new hardware, stored outside the vault where it can be reached when the vault is down. The record is checked during each test restore, because a test restore onto a spare server is also a test of whether the instructions are complete.

## Exercise: when does the offsite restore miss the objective?

The active vault grows by about **22 GB a year**. The offsite link stays at an effective 12.5 MB a second, and the non-transfer part of the restore stays at 1.5 hours. The recovery time objective is four hours. How large can the active vault grow before a full offsite restore misses the objective, and roughly when will that happen? What would you do about it?

**Answer.** Four hours minus 1.5 hours leaves **2.5 hours** for transfer, which at 12.5 MB a second moves **2.5 × 3,600 × 12.5 = 112,500 MB**, about **112.5 GB**. The vault starts at 92 GB and grows 22 GB a year, so it reaches 112.5 GB after about **(112.5 − 92) ÷ 22 × 12 ≈ 11 months**.

In other words, a full offsite restore will miss the objective within the first year. The options are to rely on the staged restore, which brings back active work well within four hours; to rely on the local backup for most failures and accept a longer time only in a disaster that destroys the building; to buy a faster link; or to revisit whether four hours is the right objective for a disaster scenario. The team chose the first two, recorded the reasoning and set the quarterly test to time a staged offsite restore as well as a full local one.
