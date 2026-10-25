---
book: connected-products-by-the-numbers
chapterSlug: secure-it-to-the-australian-standard
order: 8
title: "Secure it to the Australian standard"
description: "Apply Australia's smart-device security standard to a consumer product: unique passwords, a published way to report issues, a defined support period, a statement of compliance and a threat model."
draft: false
---

A connected product is a computer on someone's property, connected to the internet, often for a decade. If it can be taken over, it can be used to attack others, to spy on its owner or simply to stop working. For consumer products sold in Australia, minimum security is now a legal requirement. The *Cyber Security (Security Standards for Smart Devices) Rules 2025*, made under the *Cyber Security Act 2024*, apply to relevant products from 4 March 2026.

This chapter applies those rules to the tank monitor, which is sold to households and is therefore in scope. It explains the three security requirements in plain terms, sets the defined support period and the statement of compliance, builds a short threat model for the controls the rules do not cover, and works through a pre-release finding that would have breached the password requirement. It is an engineering guide, not legal advice. The legislation's current text and the regulator's guidance govern.

## Check whether the product is in scope

The rules set a security standard for relevant connectable products that are intended or likely to be acquired for personal, domestic or household use, where a consumer acquires them in Australia. The instrument excludes some product types, including desktop and laptop computers, tablets, smartphones, therapeutic goods and road vehicles and their components.

The tank monitor connects to the internet through the mobile network, is marketed to households and is bought by consumers. It is in scope. Its companion in this series, the gearbox monitor in *Electronics Packaging by the Numbers*, is an industrial product sold to businesses, and its makers recorded it as out of scope while adopting the same practices voluntarily. The scope decision, and the reasons for it, should be written down either way.

## Requirement 1: passwords

The rules' password requirement applies to passwords for the product's hardware, its pre-installed software and any software required to use it, once the product is out of its factory default state. Each such password must be either **unique to the product** or **defined by the user**.

A unique-per-product password must not be easy to derive. The rules exclude passwords based on incremental counters, passwords based on or derived from publicly available information, and passwords derived from unique identifiers such as serial numbers unless an accepted cryptographic method is used. They also exclude passwords that are otherwise guessable contrary to good industry practice.

This is an illustration. The tank monitor has two password-like secrets:

- **The app account password**, set by the owner when they create an account. It is user-defined, and the app enforces a minimum length and checks against lists of commonly used passwords.
- **The installation PIN**, used to pair a phone with the device by short-range radio during installation, so the phone can confirm the device's identity and settings before it joins the platform. Each unit's PIN is a random six-digit number generated during production test, stored in the device's protected memory and printed on a label inside the housing and on the packaging insert. It is not derived from the serial number or any public information.

## Requirement 2: a published way to report security issues

Manufacturers must publish information on how people can report security issues with the product's hardware and software. The rules require at least one point of contact and information about when the person reporting will receive an acknowledgement and status updates until the issue is resolved. The information must be accessible, clear and transparent, available without request, in English, free of charge and without requiring the reporter to provide personal information.

The tank monitor's makers publish a security page on their website with a dedicated email address and a web form that does not require a name. It states that reports are acknowledged within five business days, with status updates every 30 days until resolution. Those timings are the makers' own commitments, an illustration here, not values from the rules.

Publishing the channel is the easy part. The process behind it needs an owner, a way to assess reports, a way to fix and release updates (the staged rollout of Chapter 6) and a record of each report and its outcome. A small team should decide who reads the security inbox before publishing it.

## Requirement 3: a defined support period

Manufacturers must publish the defined support period for the product: an end-dated period during which security updates will be provided. Once published, the period **cannot be shortened**. It may be extended, and an extension must be published as soon as practicable. The information must be understandable without technical knowledge and, if the product is sold on the manufacturer's website, displayed prominently alongside the product's main characteristics.

Because the period cannot be shortened, choosing it is a business and engineering decision with consequences for a decade. This is an illustration. The tank monitor's makers set the defined support period for units sold from 2027 to **31 December 2033**, after weighing four factors:

```figure
type: timeline
title: What set the tank monitor's defined support period
caption: This is an illustration. The end date is the makers' decision. It must be kept even if sales stop, which is why it was set conservatively and can be extended later.
- 2027 | First sales | support period published with the product: to 31 December 2033
- 2027–2033 | Security updates | third-party software monitored, fixes released through staged updates
- *31 Dec 2033 | Support ends as published | extended only if the network, parts and team allow
- About 2035 | Cell end of life | the 8.4-year battery budget of Chapter 4 for 2027 installations
- Beyond | Network horizon | the operator's stated plans for its LTE-M service, recorded in Chapter 5
```

- **The network's horizon.** A device cannot receive updates after its network closes. The operator's stated plans for LTE-M, recorded in Chapter 5, set an upper bound.
- **The battery.** Units installed in 2027 reach their expected battery life in about 2035 in good coverage, but earlier at marginal sites.
- **The software supply chain.** The device's firmware uses third-party components, such as the radio's software stack and a cryptographic library. Their makers' support periods limit how long fixes can be obtained.
- **The team.** Someone must be paid to monitor vulnerabilities and release fixes for every year of the period, whatever happens to sales. Chapter 10 puts this into the cost to serve.

## The statement of compliance

The rules also require a statement of compliance to accompany products supplied in Australia, prepared by or for the manufacturer. Among other things, it identifies the product type and batch, names the manufacturer and its authorised representatives with their addresses, declares that in the manufacturer's opinion the product complies with the standard, states the defined support period at the date of issue, and gives the signatory's name and function and the place and date of issue. The rules also set a retention period for the statement.

The tank monitor's makers produce a statement for each production batch, generated from the same build records that hold the batch's firmware version and test results (Chapter 10). That way the statement, the units and the evidence always refer to the same batch.

```figure
type: checklist
title: The tank monitor against the smart-device security standard
caption: This is an illustration of the makers' compliance review. Each line links to evidence in the product file. The legislation's current text governs.
- Scope decision recorded | consumer product, in scope from 4 March 2026
- Passwords unique per product or user-defined, not derivable | random installation PIN per unit; user-set account password
- Security issue reporting published, with contact and response timing | security page, email and anonymous form
- Defined support period published, end-dated, prominent where sold | 31 December 2033
- Statement of compliance per batch, with support period | generated from build records
- ? Retention of statements for the period the rules require | confirm with the current legislation
- x Shortening the support period later if sales disappoint | not permitted once published
```

## Beyond the minimum: a short threat model

The three requirements are a floor. They do not cover how the device proves its identity, how firmware updates are protected, or how the platform stores data. International baselines such as ETSI EN 303 645, the European standard for consumer IoT security, cover a wider set of practices. A short threat model, listing what could go wrong and the control for each, is the practical way to decide what else to do.

```figure
type: compare
title: Part of the tank monitor's threat model
cols: What could happen | Control in the design
caption: This is an illustration. Each control has a test, and the threat model is reviewed whenever the architecture changes.
- Fake device | someone sends false readings for a tank | each device holds a unique key provisioned at production; the platform accepts only authenticated sessions
- Fake platform | a device is tricked into talking to an impostor | the device checks the platform's certificate before sending anything
- *Tampered firmware | malicious code is installed by update or at the debug port | updates signed and checked before boot (Chapter 6); debug port locked in production
- Account takeover | someone gains access to an owner's app account | user-set passwords with checks, optional two-step sign-in, alerts on new sign-ins
- Data exposure | readings that reveal occupancy leak from the platform | encryption in transit and at rest, role-based access, aggregated planning data (Chapter 7)
- Local radio misuse | someone nearby pairs with the device after installation | pairing only with the unit's PIN and only within 10 minutes of a button press on the unit
```

## Know what is inside the firmware

Most of a connected device's code is not written by its makers. The tank monitor's firmware includes the radio maker's network stack, a real-time operating system, a cryptographic library and the processor maker's drivers. When a vulnerability is published in one of those components, the makers must know within days whether their product contains the affected version. Meeting the support-period commitment depends on it.

The tool for this is a software bill of materials: a list of every third-party component in each firmware release, with its version and source. The tank monitor's automated build from Chapter 6 produces it with every release and stores it with the release record. A team member checks published vulnerability notices against the list each week, and the security page's reporting channel catches anything reported directly.

When a component is affected, the makers assess whether the vulnerability can be reached in their product. A flaw in a feature the firmware never uses may need no urgent fix, but the assessment is recorded either way. If a fix is needed, it goes through the normal release process and the staged rollout, with the urgency set by the risk. Component makers' own support periods also go into the list, because a component that its maker stops supporting before 2033 is a risk to the tank monitor's published commitment. That risk is better found at design time than in year five.

## A failure case: the PIN that was the same everywhere

This is an illustration. Before the pilot, the makers paid an independent security tester to examine two production-intent units and the app for a week. The tester's report included one finding the makers rated critical.

During production test, the factory's test fixture paired with each unit over short-range radio using a fixed PIN, the same on every unit, to load settings and check the radio. The test firmware was meant to replace that PIN with each unit's random installation PIN at the last test step. On the units examined, it had not: a configuration flag in the test script had been left in a development setting. Every unit built that week still accepted the factory PIN, and the short-range pairing service stayed available indefinitely, not just during installation.

Under the rules, that factory PIN would be a password common to many products, neither unique per product nor user-defined. Anyone who learned it, for example from a former factory worker or by examining one unit, could pair with any unit within radio range and change its settings.

The corrections were:

1. **Production test verifies the outcome, not the step.** The final test now attempts to pair using the factory PIN and fails the unit if it succeeds. It also checks that the unit's installation PIN matches the printed label.
2. **Pairing is time-limited.** The short-range service is available only for ten minutes after the installer presses a button on the unit, and only with the unit's own PIN.
3. **The debug port is locked** as the last step of production test, with the same check-the-outcome approach.
4. **The affected batch was reworked** before shipment, with each unit's test record updated.

The finding was caught because the makers paid for an outside review before release. The general lesson is that a security control applied by a production step must be checked by a later step that tries to defeat it. Basic security practice for small businesses more generally is covered in [Cyber security basics for small businesses](/reados/collections/business-systems-security-and-it-decisions/cyber-security-basics-for-small-businesses/).

## How this applies to a small Australian business

The smart-device rules are short, and the three requirements are achievable for a small maker. The harder commitments are the ones that last: answering security reports for years and releasing fixes until the published end date, even if the product sells poorly. Set the support period with the network, the parts and the team in mind, and budget for it in the service model. Pay for an independent security review before release. It is far cheaper than a recall, and it checks the things a team that built the product cannot see. Keep the scope decision, the statement of compliance and the evidence together in the product file, because the regulator may ask for them. If you sell through retailers, give them the support period and the security page's address in writing, so that what they tell customers matches what you have published. And when you buy a radio module or other software-bearing component, ask its maker for their own support period and vulnerability process before you choose it, because your published commitment can only be as long as theirs allows.

## Exercise: setting a different support period

A competitor proposes a support period of two years from the date of sale, arguing that it is cheap to keep. Using this chapter, list three problems with that choice for a battery-powered tank monitor with an expected battery life of about eight years, and say what a defined support period must state to meet the rules.

**Worked answer.** First, units would keep running on the network for about six years after their security updates stopped, exposed to any vulnerability found in that time. That is the risk the rules aim to reduce. Second, a support period that runs from each date of sale is not a single published end date. The rules require an end-dated period that consumers can understand without technical knowledge, so the maker would need a clear date for each product or batch. Third, customers buying a product with an eight-year battery and a subscription would reasonably expect support for longer, and since the period can be extended but not shortened, starting short gains little. A compliant support period states its end date plainly, is published where the product is sold, and is not shortened once published.
