---
title: "Cloud, hosted or on-premise: deciding where business systems and their databases should run"
description: "Where a business system runs affects cost, reliability, security and control. How on-premise servers, hosting, managed databases and software as a service compare, and how to choose."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - strategy
  - finance
author: "KEVOS"
featured: false
draft: false
---

Not long ago, a growing business bought a server, put it in a cupboard and ran its accounting, job management and file sharing on it. Today the same business can rent computing power by the hour, use a database run entirely by a cloud provider, or subscribe to software that runs somewhere it never needs to know about. Many businesses now use a mixture: some systems in the cloud, an ageing server still running an old application, and machines on the factory floor that must keep working whether or not the internet is up.

Deciding where systems and their databases should run is not simply a technical preference. It affects what the business pays and when, who is responsible for backups and security, how the business copes with power cuts and internet outages, where its data is stored and how easily it can change suppliers. A choice that suits accounting software may be wrong for a shop-floor system that controls production.

This article explains the main options, from on-premise servers to software as a service, how responsibilities are shared, how to compare costs fairly, and how to weigh reliability, performance, security, data location and exit risks. It is general information for owners and managers of small and medium businesses, not advice on any particular provider.

## The options

| Option | What it means | Who owns the hardware | Who manages the database |
|---|---|---|---|
| On-premise | The business's own servers on its own premises | The business | The business or its IT provider |
| Colocation | The business's own servers housed in a commercial data centre | The business | The business or its IT provider |
| Hosted virtual servers | Rented virtual machines from a cloud or hosting provider | The provider | The business or its IT provider |
| Managed database service | The provider runs the database software; the business uses it | The provider | Largely the provider |
| Software as a service | The business subscribes to an application; the database is invisible | The provider | The provider |

The options differ less in technology than in **who is responsible for what**. Moving to the cloud does not remove responsibilities; it moves some of them to the provider and leaves others with the business.

## Shared responsibility

Major cloud providers describe a **shared responsibility model**: the provider secures and operates the underlying infrastructure, and the customer remains responsible for how it configures and uses the services. In practice:

| Responsibility | On-premise | Hosted virtual server | Managed database | Software as a service |
|---|---|---|---|---|
| Buildings, power, cooling, hardware | Business | Provider | Provider | Provider |
| Operating system patching | Business | Business | Provider | Provider |
| Database software patching | Business | Business | Provider | Provider |
| Backups | Business | Business, using provider tools | Shared; check settings and retention | Provider; check what is included |
| User accounts and access | Business | Business | Business | Business |
| Security configuration | Business | Business | Shared | Mostly provider; business controls its settings |
| The data itself | Business | Business | Business | Business |

The last two rows never transfer. Whatever the option, the business is responsible for who has access, how passwords and multi-factor authentication are managed, and the accuracy and lawful handling of its data.

## Comparing costs fairly

On-premise and cloud costs arrive differently, which makes naive comparisons misleading.

**On-premise costs** include:

- Server hardware and storage, typically replaced every five years or so.
- Operating system and database licences.
- Backup software, backup storage and off-site copies.
- Uninterruptible power supplies, cooling and physical security.
- IT labour for patching, monitoring, troubleshooting and restores.
- Electricity.
- The cost of downtime when hardware fails outside business hours.

**Cloud and hosted costs** include:

- Compute and storage charges, often monthly.
- Backup storage and retention.
- Data transfer charges, especially for data leaving the provider's network.
- Support plans.
- Licences, which may be included or charged separately.
- Better internet connections, often including a backup link.
- IT labour for configuration, security and cost management.

A fair comparison covers at least five years, includes labour and risk, and compares like with like, for example on-premise backup and disaster recovery against equivalent cloud arrangements. The [buying for the whole life of equipment](/insights/buying-for-the-whole-life-of-equipment/) article explains whole-of-life cost comparison more generally.

### Common cost surprises

- **Idle resources** left running, such as test servers nobody turned off.
- **Data egress charges** when large amounts of data are moved out of the cloud.
- **Licensing rules** that cost more in cloud environments than on premises.
- **Growth in storage** for backups and logs.
- **Price changes** over multi-year subscriptions.

### Database licensing deserves a separate check

Commercial database licences are often priced per processor core, per user or by edition, and the rules for counting cores and users can differ between physical servers, virtual servers and cloud services. Some managed database services include the licence in their hourly price; others allow existing licences to be reused under specific conditions. Because database licences can be one of the largest costs in a business system, confirm the licensing position in writing for each option before comparing prices.

## Reliability and continuity

Each option fails differently:

- **On-premise systems** depend on the building's power, cooling, fire safety and security, and on someone being available to fix failures. They keep working when the internet fails.
- **Cloud systems** are usually built on resilient infrastructure, but the business's access depends on its internet connection. An office with one internet link has a single point of failure.
- **Software as a service** depends on the provider's reliability and support, which the business cannot control directly.

Providers often state availability targets as percentages. It helps to translate them into time: 99.9% availability allows about 8.8 hours of downtime a year, while 99.99% allows under an hour. Check what an availability commitment covers, what compensation applies and whether planned maintenance is excluded.

The [business continuity planning for small businesses](/insights/business-continuity-planning-for-small-businesses/) article explains how to set recovery targets for critical functions, which should guide where and how systems are hosted.

## Performance and location

Applications work best when they are close to their databases. Problems arise when an application running on office computers connects across the internet to a database in the cloud: every request travels back and forth, and screens that were instant on the local network become slow. Older desktop applications are especially sensitive to this.

Options include moving the application to the cloud alongside the database, using remote desktop or virtual desktop services, or keeping the system on premises. Test performance with realistic use before committing.

## Security

The cloud is not automatically more or less secure than an office server. Major providers invest heavily in physical and infrastructure security that few small businesses could match. Many cloud security incidents, however, result from customer misconfiguration, such as storage left open to the internet, weak passwords or missing multi-factor authentication.

Wherever systems run, the essentials are similar: strong authentication, least-privilege access, prompt patching, tested backups, monitoring and secure configuration. Australian Signals Directorate guidance, including its Essential Eight mitigation strategies, provides a widely used baseline.

## Where data is stored

Data location matters for privacy, contracts and some regulated industries. Major cloud providers offer data centres in Australia, and many software providers let customers choose where data is stored. Points to consider include:

- **Privacy obligations.** Where the Privacy Act applies, the Australian Privacy Principles include requirements about disclosing personal information to overseas recipients.
- **Customer and contract requirements.** Government agencies and some large customers require data to be held in Australia or in certified facilities.
- **Industry rules.** Some sectors have specific requirements for data handling and outsourcing.
- **Access by foreign authorities.** Some businesses consider the laws that apply to providers headquartered overseas.

Ask providers where data, backups and support access are located, and get the answers in writing.

## Exit and lock-in

Every option creates some dependence. Before committing, check:

- **Can all data be exported** in a usable, documented format, including attachments and history?
- **How long is data kept** after a subscription ends, and how is it deleted?
- **Which proprietary features** would have to be rebuilt elsewhere?
- **What notice periods and price review terms** apply?

The [owning your website and digital presence](/insights/owning-your-website-and-digital-presence/) article discusses similar questions of control for websites and domains.

## Shop-floor and operational systems

Systems that control or record production, such as machine controllers, manufacturing execution systems, process historians and building management systems, often need to keep working during internet outages and respond in fractions of a second. They are usually best run on the site, on separated operational networks, with data copied to cloud systems for reporting and analysis. This arrangement, sometimes called **edge computing**, keeps production running while still allowing central visibility.

## A decision guide

| Situation | Often suitable |
|---|---|
| Standard business processes such as accounting and payroll | Software as a service |
| A custom application with a database and little IT staff | Managed database service and hosted application |
| An older desktop application that is slow over the internet | On-premise, or hosted with remote desktop access |
| Shop-floor control and data collection | On-site systems, with data copied to the cloud |
| Strict data location or customer requirements | Providers with certified local hosting, or on-premise |
| Highly variable workloads | Cloud services that scale with demand |

Most businesses end up with a mixture, chosen system by system.

## Moving a system: practical steps

Moving an existing system to hosted or cloud services is a small project. A sensible sequence is:

1. **Inventory the system**: the application, database, file shares, scheduled tasks, printers, interfaces and the people who use it.
2. **Map dependencies**: other systems that read from or write to it, such as banking files, label printers, machine interfaces or reporting tools.
3. **Choose the target** for each component and confirm licensing in the new environment.
4. **Run a pilot** with a copy of the system and real users, testing performance from each location.
5. **Plan the data transfer** and a short cutover, with a tested fallback to the old server.
6. **Set up backups, monitoring and access controls** before go-live, not afterwards.
7. **Decommission the old server** once the new arrangement is proven, securely erasing its disks.

## Common mistakes

- **Assuming the provider backs everything up** without checking settings and retention.
- **Moving a chatty desktop application** without testing it over the internet.
- **Relying on a single internet connection** for systems the business cannot work without.
- **Leaving administrator accounts without multi-factor authentication.**
- **Comparing a cloud quote with only the purchase price of a server**, ignoring labour, backups and replacement.
- **Forgetting interfaces**, such as scanners, label printers and machine connections, until go-live.
- **Not watching the monthly bill**, so unused resources and growing storage go unnoticed.

## A worked example

This is an illustrative example. A manufacturer with 35 staff runs its job management system and its database on a six-year-old server in the office, along with file shares. Accounting has already moved to a software-as-a-service product. The server's warranty has expired, and the business must decide what to do.

**Option A: replace the server.** A new server, storage and backup system costs about $25,000, with about $8,000 a year for support, licences and off-site backup, or about $65,000 over five years, plus the risk of a failure outside business hours.

**Option B: move to hosted services.** The job application runs on a hosted virtual server with a managed database service and file storage in an Australian region, at about $1,200 a month including backups and a recovery copy in a second location, or about $72,000 over five years. A second internet link costs about $1,200 a year.

**Option C: replace the job system.** A software-as-a-service job management product would cost about $90,000 over five years including implementation, but would change processes significantly.

**Decision.** The business chooses Option B. It costs a little more than Option A but removes the hardware refresh, includes tested off-site recovery and lets staff work from site offices. Performance tests confirm the job application is responsive using remote access. Machine data collection stays on a small on-site server that uploads summaries to the cloud. The business revisits Option C in three years, when the job system's support ends.

## Applying this in an Australian business

- **Decide system by system**, not with a single policy for everything.
- **Clarify responsibilities** for backups, patching and security in each option.
- **Compare costs over five years**, including labour, backups and risk.
- **Translate availability targets** into hours of downtime.
- **Test performance** before moving older applications.
- **Check where data is stored** and what privacy and contract obligations apply.
- **Confirm exit arrangements** before signing.
- **Keep shop-floor systems resilient** to internet outages.

## Questions worth considering

- Which of our systems would stop us operating if the internet failed for a day?
- Who is responsible for backups of each system, and when were they last tested?
- What would it cost to replace our servers, and when will that be needed?
- Where is our data stored, including backups?
- Could we move each of our key systems to another provider if we had to?

## Bringing it together

On-premise servers, hosted servers, managed databases and software as a service each shift responsibilities, costs and risks differently. None is right for every system. Compare whole-of-life costs fairly, be clear about shared responsibilities, plan for internet and power failures, test performance, check where data is stored and confirm how to exit. For many small and medium businesses, the answer is a deliberate mixture: subscription software for standard processes, managed services for custom systems and on-site systems where production must keep running regardless of the internet.

---

*Source: KEVOS editorial notes, drawing on general information technology and hosting practice. Costs in the worked example are illustrative assumptions. This article is general information, not advice on any particular provider.*
