---
title: "Securing business databases: access, encryption, exposure, injection risks and monitoring"
description: "Databases hold the information attackers want most. How to classify data, limit access, encrypt it, keep databases off the internet, guard against injection and detect misuse."
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

When businesses suffer data breaches, the information lost almost always came from a database: customer records, staff details, payment information, pricing, designs or supplier bank details. Attackers reach it in different ways, through stolen passwords, software flaws, misconfigured cloud services, malicious insiders or vendors' remote access, but the destination is usually the same. Protecting the databases behind business systems is therefore central to protecting the business.

General cyber security measures, such as patching, multi-factor authentication and backups, protect databases along with everything else. Databases also have specific risks and controls: who can query or change which data, how applications connect, whether data is encrypted, whether a database is accidentally reachable from the internet, how web applications handle user input and whether anyone would notice someone copying an entire customer table.

This article explains how to secure business databases in practical terms: classifying data, controlling access, managing privileged and service accounts, encrypting data, limiting network exposure, protecting against injection attacks, patching, monitoring, handling test data and third-party access, and responding to incidents. It is general information for owners, managers and IT providers, focused on defence.

## Start by knowing what data you hold

Security effort should match the sensitivity of the data. Start with an inventory:

- **Which databases** the business relies on, including those behind subscription software, websites, spreadsheets used as databases and old systems still running.
- **What each contains**: personal information, financial data, health information, commercially sensitive information, intellectual property.
- **Who owns each** and who uses it.
- **Where each is hosted** and how it is reached.

Classify data into a few levels, such as public, internal, confidential and personal or sensitive, and apply stronger controls to higher levels. Holding less sensitive data is itself a control: information that is not collected or has been securely destroyed cannot be stolen.

### Collect and keep less

Some of the most effective security decisions are about what not to store. Use a payment provider so that card numbers never enter your own systems; businesses that do store, process or transmit card data must meet the Payment Card Industry Data Security Standard. Avoid keeping copies of driver licences, passports or other identity documents unless there is a genuine requirement, and record only the details you need. Delete or de-identify personal information when your retention schedule says it is no longer required. Each record not held is one that cannot be stolen.

## Control who can do what

### Least privilege

Each person and application should have only the access needed for their role. In practice:

- **Use roles** that group permissions by job function, such as sales, finance or warehouse, rather than granting permissions person by person.
- **Separate reading from changing**: many users need to view data but not alter it.
- **Restrict access to sensitive fields**, such as pay rates, bank details and identity documents.
- **Review access regularly**, at least every six or twelve months, and promptly when people change roles or leave.

### No shared accounts

Shared logins make it impossible to know who did what and are rarely changed when staff leave. Each person should have their own account, ideally connected to the business's central identity system with multi-factor authentication.

### Privileged and administrator accounts

Database administrator accounts can read, change or delete everything. Protect them closely:

- **Limit the number** of administrators.
- **Use separate administrator accounts** from everyday accounts.
- **Require multi-factor authentication.**
- **Log and review** administrative activity.
- **Remove or disable default accounts**, and change any default passwords before a system goes live.

### Application and service accounts

Business applications connect to their databases using service accounts. These should have only the permissions the application needs, not full administrator rights. Their passwords or keys should be long, unique, stored securely rather than written into configuration files in plain text where avoidable, and changed when staff with knowledge of them leave.

## Encrypt data

- **In transit**: connections between applications and databases, and between users and web applications, should be encrypted, typically using Transport Layer Security, so data cannot be read if network traffic is intercepted.
- **At rest**: databases, backups and storage should be encrypted, so stolen disks, backup files or snapshots cannot be read.
- **Sensitive fields**: particularly sensitive items, such as identity document numbers, can be encrypted individually so that even users with general database access cannot read them.

Encryption is only as strong as the management of its keys. Keep keys separate from the data they protect, control who can use them and make sure they are backed up, because losing a key can mean losing the data.

## Keep databases off the public internet

A database should almost never be directly reachable from the internet. Internet-wide scanning by researchers and criminals regularly finds databases and cloud storage left exposed through misconfiguration, sometimes without any password.

- **Place databases on private networks**, reachable only by the applications and administrators that need them.
- **Use firewalls and network rules** to restrict which systems can connect.
- **Require secure remote access**, such as a virtual private network or a managed access service with multi-factor authentication, for administrators working off site.
- **Check cloud configurations** carefully, because a single setting can make storage or a database public.
- **Scan your own internet-facing addresses**, or have your IT provider do so, to confirm nothing is exposed unexpectedly.

## Guard against injection attacks

**Injection** attacks occur when an application includes user-supplied input in a database query without handling it safely, allowing an attacker to change the query. SQL injection, in which input such as text typed into a website's search box or login form alters a database query, has for many years featured prominently in lists of the most serious web application security risks, including the OWASP Top 10 published by the Open Worldwide Application Security Project.

Defences are well established:

- **Parameterised queries**, sometimes called prepared statements, which keep user input separate from the query's structure.
- **Input validation**, checking that input matches what is expected.
- **Least-privilege service accounts**, so that even a successful injection can do limited damage.
- **Secure development practices and testing**, including security testing of web applications before launch and after significant changes.

Businesses commissioning websites, portals or custom applications should ask developers how they prevent injection and other common vulnerabilities, and whether the application has been security tested.

## Keep software patched and supported

Database software, operating systems and applications receive security updates for newly discovered vulnerabilities. Apply them promptly, prioritising internet-facing systems, and plan upgrades before products reach the end of vendor support. Unsupported database versions no longer receive fixes, leaving known weaknesses open permanently.

## Monitor and audit

Many breaches go unnoticed for months. Monitoring improves the chance of detecting misuse early:

- **Log access and changes** to sensitive data, administrative activity and failed logins.
- **Alert on unusual activity**, such as large exports, access outside normal hours, new administrator accounts or many failed logins.
- **Protect logs** from alteration and keep them long enough to investigate incidents.
- **Review alerts** promptly; logs nobody reads provide little protection.

## Handle test and development copies carefully

Developers and testers often work with copies of production databases. Those copies are frequently less protected than the original and can leak real customer and staff information. Use **masked or synthetic data** for testing where possible, replacing names, contact details and financial information with realistic but fictitious values, and apply the same protection to any real data copied into test environments.

## Control third-party access

Software vendors, IT providers and integrators often need access to business databases for support. Manage it deliberately:

- **Give named, individual accounts** with only the access needed.
- **Enable access only when needed**, rather than leaving permanent connections open.
- **Require multi-factor authentication** and log vendor activity.
- **Include security obligations** in contracts, including breach notification.
- **Remove access** when the relationship ends.

## Protect backups

Backups contain the same sensitive data as live databases. Encrypt them, control who can access and restore them, and protect them from deletion and tampering, including by ransomware.

## Subscription software still needs securing

When a business uses subscription software, the provider secures the underlying database, but the business still controls much of the risk. It decides who has accounts and what they can see, whether multi-factor authentication is required, which integrations and connected apps can read data through programming interfaces, who can export data in bulk and how long former staff keep access. Review these settings, restrict data exports to the people who need them, remove unused integrations and their access tokens, and use the audit logs most providers offer.

## Spreadsheets and desktop databases count too

Some of a business's most sensitive data never reaches a proper database. Customer lists, pay details and pricing often sit in spreadsheets and desktop database files on shared drives, laptops, email attachments and USB drives. Treat them as databases: keep them in controlled locations with appropriate access, encrypt laptops and portable drives, avoid emailing sensitive files where secure sharing links are available, and delete copies that are no longer needed.

## Where a small business should start

With limited time and budget, a sensible order of priorities is:

1. **Multi-factor authentication** for all administrator, remote and vendor access.
2. **Confirm no database or storage is exposed** to the internet.
3. **Tested, protected backups.**
4. **Patch internet-facing systems** promptly and replace unsupported software.
5. **Remove shared, default and unused accounts**, including former staff and old vendor accounts.
6. **Restrict application accounts** to the permissions they need.
7. **Alerts for unusual activity** on the most sensitive data.

Each step is achievable with modest effort and removes a common path to a breach.

## Be ready to respond

Prepare before an incident:

- **Know who to call**: IT provider, cyber insurer, legal adviser and, where relevant, the Australian Cyber Security Centre's reporting service.
- **Understand notification obligations.** Under the Notifiable Data Breaches scheme, which began in 2018, organisations covered by the Privacy Act must notify affected individuals and the Office of the Australian Information Commissioner of eligible data breaches likely to result in serious harm.
- **Preserve evidence**, such as logs, before systems are rebuilt.
- **Practise** with a simple scenario, such as a stolen administrator password.

The [cyber security basics for small businesses](/insights/cyber-security-basics-for-small-businesses/) article covers the wider controls and response planning, and the [privacy policies for small business websites](/insights/privacy-policies-for-small-business-websites/) article explains when the Privacy Act applies to small businesses.

## Common mistakes

- **Leaving default accounts and passwords** active.
- **Applications connecting as database administrators.**
- **Shared logins** for staff or vendors.
- **Databases or cloud storage reachable from the internet.**
- **Real customer data in test systems** without protection.
- **Unencrypted backups** stored off site.
- **Permanent vendor remote access** with weak authentication.
- **Logs collected but never reviewed.**
- **Keeping personal information** long after it is needed.

## A worked example

This is an illustrative example. A business supplying workwear online and to corporate accounts runs its website, customer portal and order system on a hosted server, with a database holding about 40,000 customer records, order histories and staff details.

**Review.** An IT security review finds that the website connects to the database with an administrator account, the database's management port is reachable from the internet with a password but no multi-factor authentication, a developer's test environment contains a full copy of real customer data, the software vendor has a permanent remote access account shared by its support staff, and nobody receives alerts about unusual database activity.

**Changes.** The website is given its own service account limited to the tables and actions it needs. The management port is closed to the internet, and administrators connect through a secure access service with multi-factor authentication. The test environment is rebuilt with masked data. The vendor receives named accounts enabled on request. Alerts are configured for large exports, new administrator accounts and repeated failed logins. Customer records inactive for more than seven years are reviewed for deletion in line with the business's retention schedule.

**Testing.** A security tester checks the website for injection and other common vulnerabilities and finds one search field that builds its query unsafely, which the developer fixes using parameterised queries.

**Effort.** In this illustration, the changes take about 30 hours of the IT provider's time over a month, plus a modest monthly subscription for the secure access service, far less than the likely cost of investigating and notifying a breach of 40,000 customer records.

**Result.** The business has reduced both the likelihood of a breach and the amount of data that could be exposed, and would now be alerted to many common signs of misuse.

## Applying this in an Australian business

- **Inventory and classify** the data in your databases.
- **Apply least privilege** for people, applications and vendors.
- **Remove shared and default accounts**, and protect administrators with multi-factor authentication.
- **Encrypt data** in transit, at rest and in backups, and manage keys carefully.
- **Keep databases off the internet** and check cloud settings.
- **Require secure development** practices for web applications.
- **Patch promptly** and plan upgrades before support ends.
- **Monitor, alert and prepare** for incidents and notification obligations.

## Questions worth considering

- Which of our databases hold personal or sensitive information?
- Does any application connect to our databases with administrator rights?
- Could any of our databases or storage be reached from the internet?
- Do our test systems contain real customer data?
- Would we know if someone copied our entire customer list tonight?

## Bringing it together

Databases hold the information attackers want, so securing them is central to protecting a business. Know what data you hold and classify it, give people and applications only the access they need, protect privileged and vendor accounts, encrypt data and manage keys, keep databases off the internet, require defences against injection, patch promptly, monitor for misuse, protect test data and backups, and prepare for incidents and notification obligations. Holding less sensitive data, for less time, reduces risk further.

---

*Source: KEVOS® editorial notes, drawing on general information security and database administration practice. Legal obligations are summarised for orientation; seek advice for your circumstances. The worked example is illustrative. This article is general information.*
