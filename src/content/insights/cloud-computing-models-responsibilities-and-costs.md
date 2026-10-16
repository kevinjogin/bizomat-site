---
title: "Cloud computing models, responsibilities and costs: IaaS, PaaS, SaaS and who looks after what"
description: "What cloud computing is, how infrastructure, platform and software services differ, the shared responsibility model, data location, and how cloud costs grow and can be controlled."
publishDate: 2026-10-16
category: "Technology"
tags:
  - systems
  - finance
  - operations
author: "KEVOS"
featured: false
draft: false
---

"The cloud" has become shorthand for almost any software or computing service delivered over the internet. Email, accounting, file storage, customer relationship management, design collaboration, backups and the servers behind websites and custom applications are now commonly bought as cloud services rather than owned. For many small businesses, the cloud has removed the need for a server cupboard, reduced upfront costs and made it possible to work from anywhere.

But the cloud is not a single thing, and moving to it does not hand every responsibility to someone else. Renting a virtual server from a cloud provider is very different from subscribing to an online accounting package, both in what the business controls and in what it must still look after. Cloud costs, too, behave differently from the costs of owned equipment: they start small and flexible but can grow quietly, through forgotten resources, data transfer charges and services nobody is watching.

This article explains what cloud computing is, the three main service models, infrastructure, platform and software as a service, the deployment models, the shared responsibility model, data location and privacy, how cloud pricing works and how to keep costs under control, and how to plan for leaving a provider. It is part of a series on software and cloud foundations for business leaders. The related question of whether a particular system should run in the cloud, with a hosting provider or on the business's own premises is covered in the [cloud, hosted or on-premise business systems](/insights/cloud-hosted-or-on-premise-business-systems/) article.

## What cloud computing is

A widely used definition, published by the United States National Institute of Standards and Technology in 2011, describes cloud computing as on-demand network access to a shared pool of configurable computing resources, such as servers, storage, applications and services, that can be provided and released quickly with minimal management effort. It identifies five essential characteristics:

- **On-demand self-service**: customers can obtain resources without negotiating with the provider's staff.
- **Broad network access**: services are reached over the network from many kinds of device.
- **Resource pooling**: the provider serves many customers from shared infrastructure.
- **Rapid elasticity**: capacity can be increased or reduced quickly, often automatically.
- **Measured service**: usage is metered, and customers pay for what they use.

These characteristics explain both the attraction of the cloud and its risks. Self-service and elasticity make it easy to start and grow; metered usage means costs follow usage, including usage nobody intended.

## Service models

### Infrastructure as a service

**Infrastructure as a service**, or IaaS, provides basic computing resources: virtual machines, storage and networks. The provider runs the physical data centres, hardware and virtualisation; the customer installs and manages operating systems, databases, applications and security settings. IaaS is closest to owning servers, without buying hardware or running a data centre.

IaaS suits businesses or developers who need control over the whole software stack, such as running a specialised application or moving an existing server-based system to the cloud with few changes. It demands the most technical management from the customer.

### Platform as a service

**Platform as a service**, or PaaS, provides a managed environment for running applications. The provider looks after servers, operating systems and often databases; the customer supplies the application code and data and configures how it runs. Managed database services, application hosting platforms and serverless functions, which run code only when triggered and charge per use, are common examples.

PaaS reduces the operating burden on development teams, because patching, scaling and much routine maintenance is handled by the provider. In exchange, the customer accepts the provider's ways of doing things, which can make moving elsewhere harder.

### Software as a service

**Software as a service**, or SaaS, provides complete applications used through a browser or app: accounting software, email, office suites, CRM systems, job management and design collaboration tools. The provider runs and maintains everything; the customer configures the application, manages users and owns its data.

SaaS is the form of cloud computing most small businesses use most. It offers the least control over how the software works and the least technical burden.

## Deployment models

Cloud services are also described by who uses the infrastructure:

- **Public cloud**: services offered to many customers on shared infrastructure, by large providers and many smaller ones.
- **Private cloud**: cloud-style infrastructure dedicated to one organisation, run by the organisation or a provider.
- **Community cloud**: shared by organisations with common requirements, such as government agencies.
- **Hybrid cloud**: a combination, such as some systems in a public cloud and others on premises, connected together.

Most small businesses use public cloud services, often a mixture of several SaaS products and perhaps some IaaS or PaaS for custom applications or websites.

## The shared responsibility model

The most important concept in cloud security is the **shared responsibility model**. The provider is responsible for the security *of* the cloud: physical data centres, hardware, networks and the underlying platform. The customer is responsible for security *in* the cloud: how services are configured, who has access, what data is stored and how it is protected.

The division shifts with the service model:

- With **IaaS**, the customer is responsible for operating systems, patches, firewalls, applications, data and access.
- With **PaaS**, the provider takes on operating systems and platform maintenance; the customer remains responsible for application code, configuration, data and access.
- With **SaaS**, the provider runs almost everything; the customer remains responsible for user accounts, permissions, configuration settings and the data entered.

In every model, the customer is responsible for **who can access the service** and for **its data**. Many cloud security incidents involve weak or reused passwords without multi-factor authentication, former staff who still have access, storage left publicly accessible by mistake or settings that share more than intended, all of which are customer responsibilities.

## Backups are still the customer's concern

A common misunderstanding is that data in the cloud is automatically backed up in a way that protects the business. Providers build resilience against hardware failure, but they may not protect against a user deleting records, a ransomware attack that encrypts synchronised files, a malicious insider, a configuration mistake or the closure of an account. Retention of deleted items is often limited.

Businesses should check what each service actually provides and, for important data, keep independent backups or exports. The [backing up business databases](/insights/backing-up-business-databases/) article explains recovery targets and restore testing, which apply equally to cloud data.

## Data location, privacy and sovereignty

Cloud services may store data in data centres in Australia, overseas or both. Location matters for several reasons:

- **Privacy obligations**: under the Australian Privacy Principles, organisations covered by the Privacy Act that disclose personal information to overseas recipients must take reasonable steps to ensure it is handled consistently with the principles, and may remain accountable for how it is handled.
- **Contractual and sector requirements**: some customers, particularly government agencies and regulated industries, require data to be held in Australia or in services certified to particular standards.
- **Foreign laws**: data held overseas, or by providers subject to foreign laws, may be accessible under those laws.
- **Performance**: services hosted closer to users usually respond faster.

Many large providers offer Australian regions, and businesses can often choose where data is stored. Provider terms, data processing agreements and security certifications should be reviewed for services that hold sensitive or regulated information.

## How cloud pricing works

Cloud pricing takes several forms:

- **Subscriptions**, typical of SaaS, are charged per user or per feature tier, monthly or annually.
- **Pay-as-you-go** pricing, typical of IaaS and PaaS, charges for usage: hours of computing, gigabytes stored, requests made, data transferred.
- **Commitment discounts** reduce rates in exchange for committing to a level of usage or spending for one to three years.
- **Spare capacity pricing**, offered by some providers, sells unused capacity at a steep discount, with the risk that it can be withdrawn at short notice; it suits work that can be interrupted.

Charges that often surprise customers include:

- **data transfer out**, sometimes called egress, charged when data leaves a provider's network;
- **storage that accumulates**, such as old backups, snapshots and logs;
- **resources left running** after a project or test ends;
- **premium support plans**; and
- **per-user licences** for people who no longer need them.

## Keeping cloud costs under control

Cloud costs are easier to grow than to see. Practices that keep them under control, sometimes grouped under the name **FinOps**, include:

- **Assigning an owner** to each service and account who reviews its costs.
- **Tagging resources** by project, customer or purpose, so costs can be attributed.
- **Setting budgets and alerts** that notify someone when spending rises unexpectedly.
- **Right-sizing**: matching virtual machine and database sizes to actual use.
- **Switching off non-production resources** outside working hours.
- **Cleaning up** old snapshots, backups, test systems and unused storage.
- **Reviewing SaaS licences** regularly and removing those no longer needed.
- **Using commitment discounts** for steady, predictable workloads.

A monthly review of cloud bills, comparing them with the previous month and asking what changed, catches most problems before they become expensive.

## Comparing cloud and owned costs

Comparing cloud with owned equipment requires looking at total costs over several years. Owned equipment involves purchase, installation, power, cooling, space, maintenance, replacement, backups and the staff time to manage it all; cloud services involve ongoing fees but fewer of those other costs. For steady, predictable workloads, owned or long-term committed resources can be cheaper. For variable workloads, new projects and services that benefit from the provider's maintenance and security, the cloud often wins. The comparison should include risks and staff time, not just invoices.

## Lock-in and planning an exit

Moving into a cloud service is usually easier than moving out. **Lock-in** arises when data is held in formats that are hard to export, applications depend on a provider's unique services or staff and processes have been shaped around one product. Some lock-in is an acceptable price for convenience, but it should be a conscious choice.

Sensible precautions include:

- confirming that data can be exported in a usable, documented format;
- testing an export before it is needed;
- understanding contract terms for termination, data retention and deletion;
- keeping records of how services are configured; and
- for custom applications, favouring widely used technologies that more than one provider supports.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

An architectural practice with 20 staff moved to cloud services three years ago: SaaS for email, office documents and accounting, cloud file storage for project files, and a set of cloud virtual machines running a rendering application and a project database. Cloud costs have risen from about $2,000 to about $5,500 a month, and nobody is sure why.

A review finds several causes. Rendering virtual machines created for a large competition entry were never switched off. Daily snapshots of every virtual machine have been kept indefinitely. Eleven SaaS licences belong to former staff or contractors. Large project files are downloaded repeatedly from cloud storage to the office, incurring transfer charges. The review also finds that two former contractors could still sign in to the file storage service, and that the practice has no backup of its SaaS data beyond what the providers retain.

The practice assigns its office manager as cost owner, sets monthly budget alerts and tags resources by project. Rendering machines are scheduled to run only when needed, snapshots are kept for 30 days, unused licences are removed and a local cache reduces repeated downloads. Former contractors' access is removed, multi-factor authentication is enforced and an independent backup service is added for email and files. Monthly costs fall to about $3,200, including the new backup service, and the practice now knows what it pays for and why.

## How this applies to a small Australian business

- **List every cloud service** the business uses, with an owner for each.
- **Understand the shared responsibility** for each service model.
- **Enforce multi-factor authentication** and remove access promptly.
- **Check backup arrangements** and keep independent copies of important data.
- **Know where data is stored**, especially personal and regulated information.
- **Set budgets and alerts** and review bills monthly.
- **Switch off and clean up** resources that are not needed.
- **Confirm data can be exported** before committing to a service.

## Common mistakes

- **Assuming the provider handles security** and backups entirely.
- **Leaving test and project resources running.**
- **Paying for licences** for people who have left.
- **Ignoring data transfer charges.**
- **Choosing services without checking data location** and export options.
- **Nobody owning the cloud bill.**

## Frequently asked questions

**Is the cloud more secure than an office server?** Large providers invest far more in physical and platform security than a small business can. But most incidents arise from customer-side configuration and access problems, which remain the business's responsibility wherever systems run.

**Is the cloud always cheaper?** No. It often reduces upfront costs and staff effort, but steady workloads can cost more over several years than owned or committed resources. Unmanaged usage can make the cloud very expensive.

**Does data have to stay in Australia?** Not always, but privacy obligations, customer contracts and sector rules may require it or make it preferable. Many providers offer Australian data centres.

**What is serverless computing?** A form of platform service in which code runs only when triggered, such as by a web request or a new file, and is charged per execution. Servers still exist, but the provider manages them entirely.

**How often should cloud costs be reviewed?** Monthly, with alerts for unexpected increases, and a broader review of services and licences at least annually.

## Questions to ask

- What cloud services do we use, and who owns each one?
- For each service, what security and backup tasks are ours?
- Where is our data stored, and can we export it?
- What did our cloud bill include last month, and what changed?
- Who still has access who should not?

## Bringing it together

Cloud computing delivers computing resources as metered, on-demand services. Infrastructure, platform and software services shift different amounts of work to the provider, but the shared responsibility model always leaves access, configuration and data with the customer. Data location affects privacy and contractual obligations, and backups remain the customer's concern. Cloud costs follow usage, so they need owners, budgets, alerts and regular clean-ups. Businesses that understand these responsibilities and costs can enjoy the flexibility of the cloud without its surprises.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. This article is general information; seek advice on privacy and contractual obligations for specific situations.*
