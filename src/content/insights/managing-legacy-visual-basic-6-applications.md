---
title: "Managing legacy Visual Basic 6 applications: support status, hidden risks and a practical migration path"
description: "Many businesses still rely on Visual Basic 6 tools written decades ago. What is still supported, where the real risks lie and how to contain, replace or migrate them safely."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - operations
  - strategy
author: "KEVOS"
featured: false
draft: false
---

Visual Basic 6, released by Microsoft in 1998, made it possible for engineers, technicians and office staff with modest programming experience to build working Windows applications quickly. Many of those applications are still running. In factories, they drive end-of-line test stations that read instruments through serial ports. In offices, they are quoting tools, job-tracking screens, label printers and reporting utilities built on small Microsoft Access databases. They were often written by one capable employee or contractor, years ago, and they have kept working through several generations of Windows.

That longevity is both a credit to the tools and a quiet risk. The person who wrote the application may have left. The source code may be missing, or it may exist on an old laptop that nobody can find. The development environment needed to change it has been unsupported for well over a decade. Some of the components it relies on were made by companies that no longer exist. Everything works until a computer is replaced, Windows is upgraded or a serial port disappears, and then a critical process stops with nobody able to fix it.

This article explains what a Visual Basic 6 application is made of, what Microsoft still supports, where the real business risks lie, how to assess an application, the options for containing, replacing or migrating it, and how to run a migration without disrupting operations. It is general information for business owners, operations and engineering managers and IT staff. Support arrangements change over time, so check Microsoft's current support statement before making decisions.

## What a Visual Basic 6 application is made of

Understanding the parts of a Visual Basic 6 application, usually shortened to VB6, explains why these applications are fragile in some ways and durable in others.

- **The executable**: the compiled program file, with an `.exe` extension, that users start.
- **The runtime**: a set of Microsoft library files, the most important being `msvbvm60.dll`, that every VB6 program needs to run. Key runtime files are included with current versions of Windows.
- **ActiveX controls**: reusable components, usually files with an `.ocx` extension, that provide features such as grids, charts, tabbed screens, common file dialogs and serial communications. They must be installed and **registered**, recorded in the Windows registry, on each computer that runs the application.
- **COM components**: VB6 is built on Microsoft's Component Object Model, a technology for connecting software components. Applications often use or provide COM libraries, sometimes shared with Microsoft Office macros or other programs.
- **Data access libraries**: VB6 applications typically reach data through Data Access Objects (DAO), mainly used with the Jet database engine behind Microsoft Access `.mdb` files; Remote Data Objects (RDO), used with ODBC data sources; or ActiveX Data Objects (ADO), a more general interface through OLE DB providers.
- **Windows API calls**: many applications call Windows functions directly through `Declare` statements, for tasks such as reading settings, timing or controlling hardware.
- **Source code**: a project file (`.vbp`), forms (`.frm`, with binary resources in `.frx` files), standard modules (`.bas`) and class modules (`.cls`). Without these, the application cannot be changed in any practical way.
- **The installer**: VB6 applications were usually installed with a setup package, often built with the Package and Deployment Wizard, which copied and registered the right component files.

A VB6 application is therefore not one file but a small ecosystem of runtime files, components, registrations, data files, drivers and settings, much of it undocumented.

## What Microsoft still supports

Microsoft publishes a support statement for Visual Basic 6.0, which it updates as Windows versions change. In summary, at the time of writing:

| Component | Support position |
|---|---|
| VB6 development environment (IDE) | Not supported since 8 April 2008; Microsoft states there is no supported way to create or maintain VB6 applications |
| Core runtime files shipped in Windows | Supported for the support lifetime of the listed Windows versions, limited to serious regressions and critical security issues for existing applications |
| Extended runtime files, such as common controls, grids and the serial communications control | Supported on listed Windows versions, but the application must distribute them |
| Some older files and controls from earlier Visual Basic versions | Not supported; some have supported replacements |
| Third-party ActiveX controls | Not supported by Microsoft; support depends on the original vendor |
| 64-bit Windows | VB6 runtime files are 32-bit only and are supported only in the 32-bit compatibility environment of 64-bit Windows |

The listed Windows versions include Windows 11 and Windows Server versions up to Windows Server 2025, as well as older versions that remain supported only where Microsoft's own lifecycle for that edition allows. Most editions of Windows 10 reached the end of their standard support in October 2025, so businesses still running VB6 tools on Windows 10 should check their edition's status.

Two related technologies are separate. **Visual Basic for Applications (VBA)**, the macro language inside Microsoft Office, is governed by Office's support policy. **VBScript**, a scripting language, is unrelated to VB6 and is being deprecated by Microsoft.

The practical meaning is that a well-behaved VB6 application using only supported Microsoft files is likely to keep running on current Windows, but nobody is promising to fix problems beyond serious faults in the runtime, and nobody supports the tools needed to change the application.

## Where the real risks lie

The biggest risks are usually not in Microsoft's runtime. They sit in the people, components, hardware and data around the application.

### Knowledge and source code

- The original author has often left, and nobody understands the code.
- The source code may be missing, incomplete or not matching the version in use.
- Installing the unsupported development environment on modern computers is awkward, and it has never been supported on 64-bit Windows.
- Business rules, such as test limits, pricing formulas or calculation methods, may exist only in the code.

### Components and dependencies

- Third-party controls may come from vendors that no longer exist, with licences and installers lost.
- Some older Microsoft controls are no longer supported.
- Installation often depends on registering components in the right order with administrator rights, a process nobody has done for years.

### Hardware and interfaces

- Applications that talk to instruments, scales, printers or machines through **serial ports** depend on hardware that modern computers often lack. USB-to-serial adapters usually work but can change port numbers, timing and behaviour, and some older controls only accept low port numbers.
- Instrument drivers and interface cards may be 32-bit only or unavailable for current Windows.

### Data

- Microsoft Access `.mdb` databases have a file size limit of about 2 GB and can be corrupted when shared over unreliable network connections.
- Data may sit on a shared drive with no backups, access controls or audit trail.

### Security

- Old applications may store passwords in plain text, require users to run as administrators, or use unpatched third-party components.
- They rarely support modern authentication or logging.

### Quality and compliance

- Where an application controls a test, records inspection results or calculates values used in product acceptance, its correct operation is part of the quality system. Unrecorded changes, or an inability to change it when requirements change, are quality risks.

Old software is a kind of **technical debt**: a past shortcut or deferral that carries ongoing costs and risks until it is dealt with. The [assets the balance sheet cannot see](/insights/the-assets-the-balance-sheet-cannot-see/) article explains why such liabilities are easy to overlook.

## Assessing your VB6 applications

Start with an inventory. For each application, record:

- **What it does** and which business process depends on it.
- **Who uses it**, how often and where.
- **Who owns it** in the business, and who, if anyone, can support it.
- **Where the source code is**, and whether it can actually be built into the version in use.
- **Dependencies**: runtime files, controls, databases, drivers, hardware, network shares, Office automation and other systems.
- **Where it runs**: which computers, which Windows versions, and whether spare hardware exists.
- **What happens if it stops** for a day, a week or permanently.

Then rate each application on two dimensions:

| Rating | Business criticality | Fragility |
|---|---|---|
| High | Stops production, shipping, invoicing or compliance if it fails | No source code, unsupported components, special hardware, single computer |
| Medium | Causes significant manual work or delay | Source exists but is poorly understood; some unsupported components |
| Low | Minor inconvenience | Simple, documented, supported components only |

Applications that are both highly critical and highly fragile need attention first. Test each important application on the Windows version the business plans to use next, before the old computers are replaced, not afterwards.

## The options

There is no single right answer. The main options are:

| Option | What it involves | Suits | Main drawbacks |
|---|---|---|---|
| Contain | Keep the application but reduce risk: document it, back it up, image the computer, keep spare hardware, isolate it on the network, test on new Windows versions | Stable, low-change applications, or as a bridge to replacement | Risk reduced, not removed; still no supported way to change it |
| Replace | Adopt commercial software or a feature in an existing system | Common needs such as label printing, inventory, quoting or data collection | Process changes, licence costs, possible loss of tailored features |
| Rebuild | Write a new application in a current language and platform, using the old one as a reference | Distinctive processes, test rigs and specialised tools | Development cost and time; requirements must be recovered carefully |
| Convert | Use automated tools or specialist partners to translate VB6 code to a modern language | Large applications with sound structure and valuable logic | Converted code still needs significant review, testing and tidying |
| Migrate in stages | Replace parts over time, for example moving data first or wrapping components so new code can use them | Large, critical applications that cannot stop | Running old and new together adds complexity for a period |
| Retire | Stop using the application because the process has changed or another system covers it | Applications nobody really needs any more | Requires confirming that nothing still depends on it |

Microsoft's support statement points readers to migration guidance and partners who specialise in upgrading VB6 applications. Whichever route is chosen, the old application remains the best available description of what the business actually does, including its quirks.

## Special care for test rigs and machine interfaces

Applications that drive test stations, read instruments or control machines need particular care, because their outputs decide whether products pass or fail.

- **Document the interface** before changing anything: port settings, message formats, commands, timing, units and error handling. Capture real exchanges between the computer and the instrument if the protocol is not documented.
- **Extract the business rules**: test sequences, limits, calculations, rounding, retest rules and label contents.
- **Run old and new in parallel** on the same products, comparing readings, calculated results and pass or fail decisions, and investigate every difference.
- **Repeat measurement system checks** where software changes how measurements are taken or calculated. The [measurement system analysis](/insights/measurement-system-analysis-for-manufacturers/) article explains how to confirm that a measuring system can tell good parts from bad.
- **Keep validation records** so that customers and auditors can see the new system was proven before it replaced the old one.

## Migrating the data

Data often outlives the application. Plan to:

- **Move data** from Access files or older databases to a supported database or the new application's store.
- **Clean it**: remove duplicates, fix obvious errors and agree how to treat incomplete records.
- **Reconcile**: compare record counts, totals and sample records between old and new.
- **Archive** the old data in a read-only form, with a way to retrieve historical records if customers, auditors or warranty claims require them.

## Running the migration

A migration is a project with real operational risk. Good practice includes:

1. **Recover the requirements** from users, documents and the code itself. The existing application is the specification, but it also contains workarounds and errors that should not be copied blindly.
2. **Build a set of characterisation tests**: real inputs with the outputs the old application produces, so the new one can be checked against them.
3. **Deliver in stages** where possible, starting with lower-risk functions.
4. **Run in parallel** for critical functions until results match or differences are explained.
5. **Plan the cut-over and a rollback**, including what happens if the new system fails on its first day.
6. **Train users** and update procedures.
7. **Decommission properly**: archive code, data and documentation, and remove the old application so it is not used by mistake.

Security deserves attention on both sides of the change. Old applications that must remain for a while should be isolated and run with the least privileges possible; new ones should use current authentication, logging and patching. The [cyber security basics for small businesses](/insights/cyber-security-basics-for-small-businesses/) article covers the controls that apply.

## A worked example

This is an illustrative example. A manufacturer of small pumps runs an end-of-line test station built around a VB6 application written in the early 2000s by an employee who has since left. The application reads pressure and flow transducers through a serial port, applies pass and fail limits, stores results in an Access database on a shared drive and prints a test label for each pump. About 12,000 pumps a year pass through it.

**The trigger.** The test station's computer is due for replacement, and the new computer runs Windows 11 with no built-in serial port. When the IT contractor tries to install the application, a charting control from a long-defunct vendor fails to register, and the source code found on a backup drive does not match the version in use.

**Assessment.** The application is rated high for criticality, because no pump can ship without a test record, and high for fragility, because of the unsupported control, the uncertain source code, the special hardware and the single computer.

**Short-term containment.**

- The old computer is imaged, and a second identical computer is sourced as a spare.
- The database is backed up nightly and moved to a location with access controls.
- An engineer documents the instrument protocol by recording exchanges with the transducers, and lists the test limits and calculations from the screens and test records.
- The test station is placed on a restricted network segment.

**Rebuild.** The business commissions a new application using a current development platform and a supported database. The developer uses the documented protocol, the recovered test limits and a set of 300 historical test records with known results as characterisation tests.

**Parallel run.** For two weeks, 200 pumps are tested on both systems. The pass or fail decisions match on 198. The two differences are traced to the old application rounding flow readings before comparing them with the limit, a behaviour nobody knew about. Engineering decides which rule is correct, documents the decision and updates the new application. A short measurement system study confirms that the new system's repeatability is acceptable.

**Result.** The new test station goes live with a validated record of equivalence, historical results are migrated and archived read-only, and the old application is removed. The business now has source code it owns, documented test rules and a supported platform.

## Applying this in an Australian business

- **Make an inventory** of VB6 and other legacy tools, with owners and dependencies.
- **Find and secure the source code**, and confirm it matches what is running.
- **Rate criticality and fragility**, and act on the riskiest first.
- **Test on the next Windows version** before replacing computers.
- **Contain what must stay**, with backups, spares, images and network isolation.
- **Choose replace, rebuild, convert, stage or retire** for each application on its merits.
- **Document interfaces and rules** before changing test or machine software.
- **Run in parallel and keep validation records** for quality-critical functions.

## Where legacy application management goes wrong

- **Discovering dependencies** only when a computer fails.
- **Assuming source code exists** without checking it builds.
- **Replacing hardware first** and testing the software afterwards.
- **Converting code automatically** and skipping thorough testing.
- **Copying old bugs** into new systems without noticing, or losing important rules nobody documented.
- **Cutting over without a rollback plan.**
- **Leaving old applications running** alongside new ones indefinitely.

## Questions to ask about your legacy applications

- Which processes would stop if this application failed tomorrow?
- Do we have the source code, and can we prove it builds the version we use?
- Which components, drivers and hardware does it depend on, and who supports them?
- Has it been tested on the Windows version we plan to use next?
- What rules and calculations does it contain that are not written down anywhere else?
- Which option, contain, replace, rebuild, convert, stage or retire, best fits its value and risk?

## Bringing it together

Visual Basic 6 applications have served many businesses well for decades, and Microsoft still supports the core runtime on current Windows versions for serious faults. But the development tools are long unsupported, third-party components and special hardware add fragility, and the knowledge needed to change these applications is often gone. Make an inventory, rate criticality and fragility, contain what must stay and plan replacement, rebuilding or migration for the rest. For test rigs and other quality-critical tools, document interfaces and rules, run old and new in parallel and keep validation records. The result is that a quiet technical risk becomes a planned improvement rather than an emergency.

---

*Source: KEVOS editorial notes, drawing on a Visual Basic 6 programming reference and Microsoft's published [Support Statement for Visual Basic 6.0](https://learn.microsoft.com/en-us/previous-versions/visualstudio/visual-basic-6/visual-basic-6-support-policy), together with established software maintenance practice. The worked example is illustrative. Support arrangements change, so check the current statement. This article is general information, not professional IT or engineering advice.*
