---
title: "High availability for business systems: what uptime targets mean, what they cost and how failover works"
description: "Availability percentages hide hours of downtime. How to translate targets into time, find single points of failure, choose failover approaches and weigh cost against outages."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - operations
  - finance
author: "KEVOS®"
featured: false
draft: false
---

Some business systems can be unavailable for an afternoon with little harm. Others stop the business: a warehouse management system that controls picking and dispatch, an online shop during a sales campaign, a production scheduling system on a busy line, or a booking platform at peak season. For these, the question is not only whether data can be recovered after a failure, but how to keep the system running through failures in the first place.

**High availability** is the design of systems so that individual failures, such as a failed server, disk, network switch or software process, do not cause long outages. It relies on redundancy, monitoring and failover: the ability to switch automatically or quickly to a standby component. It is valuable, but it costs money and adds complexity, and it is easy to buy availability in one part of a system while a single internet connection or power supply leaves the whole thing exposed.

This article explains how to translate availability percentages into hours of downtime, the difference between high availability, backup and disaster recovery, the common causes of downtime, the main techniques for keeping databases and applications available, how to judge cost against value and how to read service level commitments. It is general information for owners, managers and IT providers.

## What availability percentages mean

Availability is often expressed as the percentage of time a system is working. Converting percentages into time makes them meaningful:

| Availability | Downtime per year | Downtime per month |
|---|---|---|
| 99% | About 87.6 hours | About 7.3 hours |
| 99.5% | About 43.8 hours | About 3.7 hours |
| 99.9% | About 8.8 hours | About 44 minutes |
| 99.95% | About 4.4 hours | About 22 minutes |
| 99.99% | About 53 minutes | About 4 minutes |
| 99.999% | About 5 minutes | About 26 seconds |

Each additional "nine" reduces downtime tenfold and usually increases cost and complexity substantially. For most small and medium businesses, the practical range is between 99.5% and 99.95% for critical systems, achieved within business hours rather than around the clock.

```figure
type: bars
title: Downtime allowed per year
unit: hours
max: 90
caption: Each extra nine cuts downtime tenfold and usually raises cost and complexity substantially.
- 99% | 87.6
- 99.5% | 43.8
- *99.9% | 8.8
- 99.95% | 4.4
- 99.99% | 0.9 | about 53 minutes
```

## Availability, backup and disaster recovery are different

| Concern | Protects against | Typical measures |
|---|---|---|
| High availability | Failures of individual components | Redundant servers, replication, automatic failover |
| Backup and recovery | Loss or corruption of data, mistakes, ransomware | Backups, point-in-time restore, immutable copies |
| Disaster recovery | Loss of a whole site or region | Standby systems in another location, recovery plans |

They complement each other. High availability does not protect against a mistaken deletion, which is instantly copied to standby systems; backups do. Backups do not keep a system running when a server fails; high availability does.

## What causes downtime

- **Hardware failures**: servers, disks, power supplies, network equipment.
- **Software faults**: application bugs, database errors, failed updates.
- **Planned maintenance**: patches and upgrades that require restarts.
- **Human error**: misconfiguration, accidental shutdowns, faulty changes.
- **Power and cooling**: outages, failed uninterruptible power supplies, overheating.
- **Network and internet**: failed links, provider outages, equipment faults.
- **Provider incidents**: outages in cloud services or software-as-a-service platforms.
- **Cyber attacks**: ransomware and denial-of-service attacks.

High availability addresses some of these, mainly component failures and planned maintenance. Others need different controls, such as change management for human error and security measures for attacks.

## Remove single points of failure

A **single point of failure** is any component whose failure stops the whole system. Finding them means tracing every dependency:

- **Servers and databases** running on one machine.
- **Storage** on one array or disk group.
- **Network switches, firewalls and routers.**
- **Internet connections**, often a single link to the premises.
- **Power supply**, including the uninterruptible power supply and any generator.
- **Supporting services**, such as authentication, domain name services and licence servers.
- **People**, such as the only person who knows how to restart a system.

Common design principles include **redundancy**, providing at least one spare beyond what is needed, often described as N+1; **diversity**, so that spares do not share the same weakness, such as two internet links from different providers using different physical routes; and **isolation**, keeping redundant components in separate racks, rooms or data centres.

## Keeping databases available

### Replication

The most common technique is **replication**: keeping a continuously updated copy of the database on another server, ready to take over. There are two broad kinds:

- **Synchronous replication** confirms each transaction only after it is written to both servers. No confirmed data is lost if the primary fails, but each transaction waits for the copy, which can slow systems if the servers are far apart.
- **Asynchronous replication** confirms transactions on the primary and sends them to the copy shortly afterwards. It has less effect on performance, but the most recent transactions, typically seconds' worth, may be lost if the primary fails.

### Failover

**Failover** is switching from the failed primary to the standby. It can be:

- **Automatic**, with monitoring that detects failure and promotes the standby within seconds or minutes.
- **Manual**, with an administrator deciding to switch, which avoids unnecessary failovers but takes longer, especially out of hours.

Applications must be able to reconnect to the new primary, usually through a shared network name or address that moves with it.

### Clusters and managed services

Database products offer clustering features that combine replication, monitoring and failover. Major cloud providers offer managed database services that keep standby copies in separate **availability zones**, physically separate data centres within a region, and fail over automatically. These make high availability far more accessible to small businesses than it once was.

### Read replicas

Some designs also add **read replicas**, copies used for reporting and analysis, which reduce load on the primary. They improve performance but do not by themselves provide failover unless configured to do so.

### Keeping the application layer available

A highly available database is of little use if the application in front of it runs on one server. Business applications and websites can run on two or more servers behind a **load balancer**, which spreads users between them and stops sending traffic to any server that fails. This works best when application servers do not hold important information locally, keeping it in the database or shared storage instead, so any server can handle any user.

## Failover is not free of risk

- **Split brain**: if two servers each believe they are the primary, they may accept conflicting changes. Clustering products use voting or witness mechanisms to prevent this.
- **Unnecessary failovers**: brief network glitches can trigger failover, causing short outages of their own.
- **Untested failover**: a standby that has never taken over may fail when needed because of configuration drift, missing settings or expired credentials.
- **Licensing**: some commercial database licences charge for standby servers.

Test failover regularly, during planned windows, and confirm that applications reconnect and users can work.

## Planned maintenance without outages

Redundancy also allows maintenance without long outages. Patches can be applied to the standby first, the system failed over, and the former primary patched, a technique known as a rolling update. Where this is not possible, scheduled maintenance windows outside business hours, communicated in advance, keep planned downtime from disrupting work.

## Disaster recovery for the whole site

High availability within one building or data centre does not help if the building floods or the cloud region suffers a major outage. **Disaster recovery** arrangements keep a copy of systems in another location:

- **Cold standby**: backups and documented procedures to rebuild elsewhere, the cheapest and slowest option.
- **Warm standby**: systems partly built in another location, with data replicated, ready to start within hours.
- **Hot standby**: fully running systems in another location, able to take over quickly, the most expensive option.

The [business continuity planning for small businesses](/reados/collections/operational-data-records-and-controls/business-continuity-planning-for-small-businesses/) article explains how to set recovery targets that guide these choices.

## Supporting infrastructure

Redundant servers achieve little if supporting infrastructure fails:

- **Power**: uninterruptible power supplies sized for a controlled shutdown or to bridge until a generator starts; regular battery testing.
- **Internet**: two links from different providers, ideally using different technologies or physical paths.
- **Network equipment**: redundant switches and firewalls for critical systems.
- **Cooling**: adequate and monitored cooling for server rooms.

## Monitoring and alerting

Redundancy hides failures as well as surviving them. If a standby server has silently failed, or replication stopped weeks ago, the system appears healthy until the primary fails and there is nothing to take over. Monitoring should therefore check not only that the system is up, but that its protection is intact:

- **Replication status and lag** between primary and standby.
- **Health of standby servers** and redundant components.
- **Failover events**, which should always be investigated even when automatic.
- **User-facing checks**, such as automated tests that log in and perform a simple transaction, which detect problems that component checks miss.

Alerts must reach someone able to act, including outside business hours if the system matters then.

## Subscription software

For software-as-a-service products, availability is largely in the provider's hands. The business can still choose providers with suitable commitments and track records, check their published status history, make its own internet access resilient, keep a plan and paper forms for working through outages, and export critical data regularly so that essential information remains available if the service is down for an extended period.

## Combining availability across components

When a system depends on several components in series, its overall availability is roughly the product of their individual availabilities. A cloud application at 99.95%, depending on an office internet link at 99.5% and an authentication service at 99.9%, is available to office users only about 99.35% of the time, around 57 hours a year. The weakest link often dominates. Improving the internet connection may achieve more than upgrading the application.

```figure
type: svg
title: Availability in series
alt: Three components in series: a cloud application at 99.95%, an office internet link at 99.5% and an authentication service at 99.9%. Together office users see about 99.35%, around 57 hours of downtime a year. The internet link is the weakest component.
caption: Availabilities multiply; the weakest link, here the office internet, often dominates.
viewbox: 0 0 640 170
body:
<rect class="bx" x="20" y="40" width="160" height="56" rx="8"/>
<text class="tx" x="100" y="64" text-anchor="middle">Cloud app</text>
<text class="txb" x="100" y="84" text-anchor="middle">99.95%</text>
<rect class="bxa pulse" x="230" y="40" width="160" height="56" rx="8"/>
<text class="tx" x="310" y="64" text-anchor="middle">Office internet</text>
<text class="txb" x="310" y="84" text-anchor="middle">99.5%</text>
<rect class="bx" x="440" y="40" width="160" height="56" rx="8"/>
<text class="tx" x="520" y="64" text-anchor="middle">Sign-in service</text>
<text class="txb" x="520" y="84" text-anchor="middle">99.9%</text>
<path class="ln flow" d="M180 68H230M390 68H440"/>
<text class="txb" x="320" y="140" text-anchor="middle">Together ≈ 99.35%, about 57 hours a year</text>
```

## Reading service level commitments

Providers' service level agreements state availability commitments, but read them carefully:

- **What is measured**: the whole service or only parts of it.
- **Exclusions**: planned maintenance, problems caused by the customer and events outside the provider's control.
- **Remedies**: usually service credits, a small percentage of the monthly fee, which rarely compensate for business losses.
- **Measurement period**: monthly or annual.

A service level agreement is a commitment and a remedy, not a guarantee. Design for the business's own needs rather than relying on credits.

## Weighing cost against value

To decide how much availability to buy:

1. **Estimate the cost of downtime per hour** for the system, including lost sales, idle staff, overtime to catch up, penalties and damage to customer relationships.
2. **Estimate current expected downtime** from experience and the system's design.
3. **Estimate the downtime after improvements.**
4. **Compare the annual cost of the improvements** with the expected reduction in downtime costs.

## Common mistakes

- **Treating replication as backup.**
- **Buying redundancy for servers** while relying on a single internet link or power supply.
- **Never testing failover.**
- **Misreading availability percentages**, which hide hours of downtime.
- **Relying on service credits** as compensation.
- **Ignoring planned maintenance** in availability calculations.
- **Adding complexity** that the business cannot operate or troubleshoot.

## A worked example

This is an illustrative example. A distribution centre's warehouse management system runs on a single cloud server with its database on the same machine. Over the past two years, it has suffered about three outages a year averaging six hours, from a failed update, a server fault and an internet outage at the warehouse. Each hour of downtime stops picking and dispatch, costing an estimated $3,000 in idle labour, overtime and late-delivery penalties, about $54,000 a year.

**Options.** The IT provider proposes moving the database to a managed service with a standby in a second availability zone, running two application servers behind a load balancer, and adding a second internet link from a different provider using a different technology. The additional cost is about $1,500 a month for the cloud changes and $200 a month for the second link, about $20,400 a year.

**Expected benefit.** The provider estimates that server and database failures would then cause outages of minutes rather than hours, and that the second link would cover most internet outages. Expected downtime falls to perhaps three hours a year, saving about $45,000 a year in expected downtime costs against the $20,400 spent.

```figure
type: bars
title: Is redundancy worth it for a warehouse system?
unit: $'000 a year
max: 60
caption: About three six-hour outages a year at $3,000 an hour; expected downtime after the changes is about three hours.
- Expected downtime cost now | 54
- *Expected saving | 45
- Annual cost of the changes | 20.4
```

**Testing.** A failover test in a planned window takes under two minutes, and the warehouse scanners reconnect automatically after a configuration change. A test of the internet failover reveals that the warehouse's main switch has a single power supply, which is replaced with a redundant model.

**Result.** The business invests where the outages actually came from, verifies that failover works and records the remaining risks, such as a regional cloud outage, in its continuity plan.

## Applying this in an Australian business

- **Identify which systems stop the business** when unavailable.
- **Translate availability targets** into hours of downtime.
- **Estimate the cost of downtime** per hour for each critical system.
- **Find single points of failure**, including internet, power and people.
- **Use managed high-availability services** where they suit the system.
- **Test failover** regularly.
- **Keep backups and disaster recovery** alongside high availability.
- **Read service level agreements** for exclusions and remedies.

## Questions worth considering

- Which of our systems would stop work if they failed for four hours?
- What does an hour of downtime cost us for each critical system?
- What single points of failure lie between our staff and those systems?
- When did we last test a failover?
- Do our providers' availability commitments match what we actually need?

## Bringing it together

High availability keeps critical systems running through component failures, using redundancy, replication and failover. Translate percentages into hours, identify single points of failure across servers, networks, power and people, choose synchronous or asynchronous replication with their trade-offs in mind, test failover and keep backups and disaster recovery as separate protections. Spend where outages actually come from, and judge each improvement by comparing its cost with the expected cost of the downtime it prevents.

---

*Source: KEVOS® editorial notes, drawing on general IT infrastructure and service management practice. Figures in the worked example are illustrative. This article is general information.*
