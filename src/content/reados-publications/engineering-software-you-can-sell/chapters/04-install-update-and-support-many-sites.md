---
book: engineering-software-you-can-sell
chapterSlug: install-update-and-support-many-sites
order: 4
title: "Install, update and support many sites"
description: "Package an engineering add-in for customers' IT departments, sign it, version it, release updates customers control, keep old configurations working and limit how many versions you support."
draft: false
---

Inside one office, installing and updating a tool is a matter of walking to each desk or asking the IT provider to push it out. Across dozens of customer firms, each with its own IT arrangements, security policies, CAD versions and appetite for change, installation and updates become a large part of what the product is. A firm's IT department decides whether an add-in may run at all. A badly behaved update can stop every customer's checking on the same morning.

This chapter covers the drawing-checking add-in's life across customers' sites. It sets out what customers' IT staff need, packages and signs the product, numbers its versions, gives customers control over when updates arrive, keeps their configurations working across versions and limits the number of versions the office supports. The failure case is an update that renamed one configuration setting and broke checking at six firms overnight.

## What customers' IT staff need

Chapter 1's fourth pilot firm did not renew because its IT policy stopped the add-in loading automatically. That was not a fault in the firm's policy. It was a product that had not been designed for corporate IT. The office asked the IT staff at the pilot firms what they needed and turned the answers into requirements.

```figure
type: checklist
title: What customers' IT staff asked of the add-in
caption: This is an illustration from conversations with the pilot firms' IT staff and providers. Each item became a requirement for the first product release.
- An installer that runs silently from their management tools, installs per machine and uninstalls cleanly | no prompts, no reboot
- Signed installer and program files from a named publisher | lets them allow it under application-control policies
- Runs as an ordinary user; administrator rights only to install | no elevation at run time
- A written list of network connections and data sent | licence checks only, unless the firm opts in to usage reporting
- Updates they approve and schedule, never pushed automatically | test on one machine first
- ? Behaviour when offline or behind their proxy | answered in Chapter 6's grace period
- x Writing to protected folders or changing CAD settings outside the add-in's own | breaks their standard builds
```

Two items deserve emphasis. **Signing** matters because many firms now use application-control policies that allow only known publishers' software to run. A signed add-in can be allowed with one rule. An unsigned one needs an exception that many IT staff will refuse. **A written list of network connections and data** matters because firms are increasingly asked by their own clients what software can see their drawings. The add-in's answer is short: it sends licence checks containing a licence key and a machine identifier, and, only if the customer opts in, monthly counts of checks run. It never sends drawings or their contents.

## Make the first installation go right

A customer's first week with the product decides whether it becomes part of their routine or an unused licence. The office's onboarding for each new firm is a short, fixed sequence:

1. A 30-minute call with the firm's administrator before installation, walking through the administrator guide and the network statement, and agreeing who will write the firm's configuration.
2. Installation on one machine, by the administrator, with the office available on a call if needed.
3. The firm's configuration written and checked with the configuration checker, using one of the firm's own drawings to map property names, as Chapter 3 described.
4. A 45-minute session with the firm's designers, using their own drawings, showing what the add-in finds and what to do about each finding.
5. A check-in after the first week, reading the opt-in usage counts or simply asking how many drawings have been checked.

This is an illustration. The sequence takes the office about **1.5 hours** per firm, plus configuration time if the firm buys that service. It looks generous for a product priced per seat at a few hundred dollars a year. The office's view was that a firm that checks drawings every day in its first week renews, and a firm that does not, does not. The check-in after the first week is where a quiet failure, like Chapter 3's property names, is caught before the designers give up.

## Number versions so customers can plan

The product uses Semantic Versioning, the public convention of **major.minor.patch** numbers. For customers, the numbers carry a promise:

- a **patch** release fixes faults and changes nothing a customer relies on, so it can be deployed with little testing;
- a **minor** release adds capability but keeps every existing configuration and behaviour working;
- a **major** release may change configuration formats or behaviour, and comes with notice, a migration path and release notes that say exactly what changes.

The office publishes a compatibility table on its support page, showing which product versions work with which CAD releases, and when each product version's support ends.

## Let customers control updates

Consumer software often updates itself. In engineering firms, that is unwelcome: an update in the middle of a deadline week that changes how drawings are checked can cost a firm a day. The add-in therefore never updates itself. It checks, if allowed, whether a newer version exists and tells the user and the administrator. The administrator downloads the new installer, tests it on one machine and deploys it on their own schedule.

```figure
type: compare
title: Ways to deliver updates to customer firms
cols: Who controls timing | Risk to the customer | Effort for the maker
caption: This is an illustration of the options the office considered. Engineering customers strongly preferred to control timing.
- Automatic silent updates | the maker | high: changes arrive mid-project without testing | low
- Notify, user installs | each user | medium: seats drift to different versions | low
- *Notify, administrator deploys | the customer's administrator | low: tested and scheduled by the firm | moderate: must support several versions in the field
- Early-access group first | selected customers volunteer | low for everyone else | moderate: needs willing customers
```

The office combined the last two. Each new minor or major release goes first to an early-access group of five customer firms who volunteered in return for a discount, for two weeks. Only then is it announced to everyone.

## Keep configurations working

Customers invest effort in their configuration files, the rules for their own drafting standards described in Chapter 3. A release that breaks a configuration breaks the customer's checking. The rule the office adopted after the failure case below is that a configuration that worked with one major version works with every minor and patch release of that major version, unchanged. When a major release changes the configuration format, the product includes a migration step that converts old files automatically, shows the administrator what changed, and keeps the original.

The configuration checker from Chapter 3 is part of this. It runs automatically after every update and reports any setting it does not recognise, rather than silently ignoring it.

## Keep pace with the CAD vendor

The add-in lives inside a CAD system whose vendor releases a new major version on its own schedule. Customers deciding when to upgrade their CAD system will ask one question: does the add-in work with it yet? If the answer is "not yet" for months, the add-in becomes a reason for a firm to delay its upgrade, or a reason to drop the add-in.

The office joined the vendor's developer programme partly for early access to pre-release versions. Its commitment, published on the support page, is to state compatibility with a new major CAD release within **six weeks** of that release becoming generally available. In practice the office tests on the pre-release, so the statement is usually ready on release day. When a CAD change requires a new add-in version, that version goes to the early-access group first, like any other release.

## Know who has what

A product sold to many firms needs records that a one-office tool never did: which firms hold how many licences, on which product version, on which CAD release, with which configuration, and who to contact there for technical matters and for security notices. The office keeps this in a simple customer register alongside the licence records, updated at each sale, renewal, upgrade and support ticket.

The register holds people's names, email addresses and phone numbers, which is personal information. Whether or not the Privacy Act applies to the firm, which depends on its turnover and activities, the office handles the register as if it does: it collects only what support needs, keeps it access-controlled, states in its privacy notice what is held and why, and removes contacts when a customer leaves. Customers' IT staff increasingly ask about this, and a clear answer helps the sale.

The register is what turns a fault into a targeted notice rather than a general alarm. When a fault is found that affects only one CAD release with one configuration setting, the office can tell exactly the firms affected, with the patch and the steps to take, and leave everyone else in peace.

## Limit the versions you support

Customers who control their own updates will run several versions at once. After two years, the add-in's installed base was spread across four versions.

```figure
type: bars
title: Installed seats by product version, two years after launch
unit: seats
max: 60
caption: This is an illustration from opt-in usage reports and licence checks. The office supports the current minor version and the one before it; the 18 seats on older versions were contacted individually.
- 2.3, current | 52
- 2.2, previous | 34
- 2.1 | 11
- 1.4 | 7
```

Supporting every version forever is impossible for a small firm. The office's policy, published on its support page, is to provide fixes for the **current and previous minor versions** of the current major version, and to answer questions on older versions on a best-effort basis while encouraging upgrades. Of the **104** seats in the chart, **86** were on supported versions. The office contacted the firms with the remaining 18, offered help with upgrading and recorded the outcome. Support tickets from older versions took about twice as long to resolve, because the fix was often already in a later version and the conversation became an upgrade.

## A failure case: one renamed setting

This is an illustration. Release 2.1.0 of the add-in, a minor release, tidied the configuration format. Among other changes, it renamed the setting that listed dimensions exempt from tolerancing, from "ExemptDims" to "ToleranceExemptions", which was clearer. The developer added support for the new name and, as an oversight, removed support for the old one.

The release went to all customers at once, before the early-access group existed. The next morning, six firms reported that the add-in was flagging dozens of untoleranced dimensions on drawings that had passed the day before. Their configurations still used the old name, which the new version ignored. With no exemptions, every reference dimension and overall dimension was reported as untoleranced.

The detection came from customers, in the worst possible way, through a flood of support calls on one morning. The office issued a patch, 2.1.1, within the day, restoring the old name as an alias for the new one. Then it made four lasting changes:

1. The compatibility rule above: configurations work unchanged across a major version.
2. The configuration checker now runs after every update and reports unknown settings instead of ignoring them.
3. The test set includes every pilot and early customer's configuration, with permission and with drawings replaced by the office's sample drawings, so that compatibility is tested on real configurations before release.
4. The early-access group, which would have found the fault at five firms who had agreed to test, not at every customer.

## Keep the support channel simple

Customers need one way to ask for help, and the office needs requests that arrive with enough information to act on. The product's support bundle from Chapter 3 provides the information. The support page gives one email address and a web form, both of which create a ticket. Each ticket is acknowledged with an expected response time. The office committed to responding within one business day and publishes that commitment. Chapter 10 measures whether it is kept and what it costs.

## How this applies to a small Australian business

Engineering firms in Australia range from sole practitioners whose IT is themselves to large consultancies with formal application-control policies and change boards. Design the product for the strictest of them, because it then works easily for the rest. A code-signing certificate, a silent installer and a clear statement of what the product sends over the network remove most objections before they are raised. Publish the support policy, which versions are supported and for how long, before the first sale, so that customers choose with full information. Many Australian engineering firms rely on a small outside IT provider rather than their own staff. Make the administrator guide clear enough for that provider to follow without calling you, because they will charge the customer for every hour spent working out your product.

## Exercise: when to drop a version

Two years later, the office plans release 3.0.0, a major version with a new configuration format. At that point, 70 seats are on 2.3, 25 on 2.2 and 15 on older 2.x versions. The office estimates that supporting 2.x alongside 3.0 for twelve months would cost about **60 hours**, at A$110 an hour, and that about 15% of seats not upgraded within a year might cancel if support ends abruptly. At A$495 per seat per year excluding GST, which is more expensive: twelve months of parallel support, or the expected cancellations if 2.x support ends when 3.0 is released?

**Worked answer.** Parallel support costs about **60 × 110 = A$6,600**. If support for 2.x ended immediately, the seats at risk are all 110 seats on 2.x, since none will have upgraded on day one. With 15% cancelling, that is about **110 × 0.15 = 16.5** seats, about **16.5 × 495 ≈ A$8,168** a year in lost revenue, recurring every year those customers would have stayed. Twelve months of parallel support is cheaper, and it fits the published promise that customers control their own upgrades. The office should announce the end date for 2.x support with the 3.0 release and help firms migrate during the year.
