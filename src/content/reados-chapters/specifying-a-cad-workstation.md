---
title: "Specifying a CAD workstation: processors, graphics, memory, storage and when to go virtual"
description: "How CAD workloads use computer hardware, why clock speed often matters more than core count, choosing certified graphics, sizing memory and storage, laptops versus desktops and virtual workstations."
publishDate: 2026-10-16
category: "Technology"
tags:
  - systems
  - design
  - operations
author: "KEVOS"
featured: false
draft: false
---

Engineers and designers spend their days waiting on computers in small increments: a few seconds for a part to rebuild, half a minute for a large assembly to open, minutes for a drawing to update, an hour for a rendering or a simulation. Each wait is minor. Added up across a team, a year and a product range, they become a significant cost, and the interruptions break concentration in ways that cost more than the seconds themselves.

Choosing a CAD workstation is often treated as an IT purchasing exercise: buy a powerful computer from the approved supplier and move on. But CAD software uses hardware in particular ways. A machine with many processor cores can feel slower in everyday modelling than one with fewer, faster cores. A gaming graphics card may display models well but cause crashes or visual errors that disappear with certified drivers. A laptop with impressive specifications can slow down under sustained load as it heats up. Getting the specification right requires understanding the workload.

This article explains, in general terms, how CAD software uses processors, graphics, memory and storage, how to choose each component, the trade-offs between desktops, mobile workstations and virtual workstations, how to test before buying and how to judge the value of better hardware in engineering time. It is vendor-neutral general information. Always check the hardware and operating system requirements and certification lists published by your CAD software vendor.

## How CAD software uses hardware

CAD work is not one workload but several:

- **Interactive modelling**, such as sketching, creating features and editing parts, depends heavily on how quickly the processor can perform a sequence of calculations. Much of the geometric modelling in mainstream CAD systems is performed largely in a single thread, because each feature often depends on the one before it.
- **Assembly work** adds memory demands and graphics load as many parts are displayed, plus processing for mates, constraints and interference checks.
- **Drawings** require generating views, hidden lines and annotations, which can be processor-intensive for large assemblies.
- **Rendering, simulation and some analysis tasks** can use many processor cores in parallel, and some rendering and simulation tools also use the graphics processor for computation.
- **Data management** depends on storage speed and network performance for opening, saving and checking files in and out.

The best workstation for a designer who mainly models parts and assemblies may differ from the best one for an analyst running simulations all day.

## Processor: clock speed versus core count

For everyday modelling, **single-thread performance**, driven mainly by clock speed and processor architecture, usually matters more than the number of cores. A processor with fewer, faster cores often rebuilds models and opens assemblies faster than one with many slower cores.

More cores help with tasks that run in parallel: rendering, simulation, some meshing, multi-tasking with several applications and background tasks such as data management indexing. A balanced choice for most CAD users is a processor with strong single-thread performance and a moderate number of cores. Users who render or simulate heavily benefit from more cores, or from offloading those tasks to dedicated machines or cloud services.

## Graphics: certification matters

The graphics card renders the model on screen. CAD vendors typically publish lists of **certified** graphics cards and **driver versions** that they have tested with their software. Professional workstation graphics cards and their certified drivers are designed for the accuracy and stability CAD needs, and using a certified combination reduces display errors, crashes and support problems.

Key considerations include:

- **Certification** for your CAD software and version.
- **Graphics memory**, which matters for large assemblies, high-resolution displays, multiple displays and rendering.
- **Driver management**, keeping to certified driver versions rather than automatically updating to the newest.
- **Support for GPU-accelerated tasks** in rendering or simulation tools you use.

Consumer gaming cards can be powerful and less expensive, but they may not be certified, and CAD vendor support may be limited if problems arise.

## Memory

Insufficient memory forces the computer to use much slower storage as overflow, causing dramatic slowdowns. Memory needs depend on the size of the assemblies, the number of applications open and whether simulation or rendering is used. As a guide, size memory to comfortably exceed peak usage observed when working on your largest typical assemblies with the usual set of applications open, with headroom for growth. Monitoring memory use on existing machines during real work is the most reliable way to set the requirement.

Error-correcting memory, available on many workstation platforms, reduces the risk of rare memory errors corrupting data or causing crashes during long simulations, which some businesses value for analysis machines.

## Storage

Fast solid-state storage has transformed file opening and saving times. Practical points include:

- **Use fast solid-state drives** for the operating system, applications and local working files or PDM cache.
- **Allow enough capacity** for local caches, temporary files and simulation results, which can be very large.
- **Do not rely on local drives for data safety.** Engineering data should live in a managed, backed-up vault or server, with local copies treated as working caches. The [governing a CAD environment](/reados/collections/engineering-design-practice/governing-a-cad-environment/) article explains how to manage shared libraries, settings and data locations.

## Network and data management performance

A fast workstation can still feel slow if it waits on the network. Opening a large assembly from a data management vault or server involves transferring and checking many files. Performance depends on network speed, server performance, the location of the vault relative to users and how the data management client caches files locally. Wired connections are generally more consistent than wireless for heavy CAD use. For remote staff, replicated vault servers, cloud-based data management or virtual workstations may perform better than opening large files across a slow link. When users complain about slow opens and saves, measure where the time goes before replacing workstations.

## Software settings that matter

Some performance problems are configuration rather than hardware. Useful checks include:

- **Power settings**: high-performance power plans prevent processors and graphics from throttling during modelling.
- **Graphics settings**: the CAD software's graphics options, such as level of detail, transparency and anti-aliasing, affect performance with large assemblies.
- **Large assembly modes** and lightweight loading options provided by many CAD systems.
- **Add-ins and background tasks** that consume resources unnecessarily.
- **Antivirus exclusions**, where approved by IT, for local cache and temporary folders, since scanning every CAD file operation can slow work considerably.

Recording a standard configuration, alongside the certified driver version, helps keep every workstation performing consistently.

## Security

Engineering workstations hold valuable intellectual property. Standard protections apply: supported operating systems, timely security updates applied in a way that does not break certified configurations, endpoint protection, encrypted drives on laptops, secure remote access and prompt removal of access when people leave. Coordinating CAD and security updates through a tested process avoids the trade-off between staying secure and staying stable.

## Displays and peripherals

Productivity depends on more than the computer box:

- **Displays** with sufficient resolution and size, often two, allow model, drawing and reference material to be viewed together.
- **3D navigation devices** let users rotate and pan models with one hand while selecting with the other.
- **Comfortable keyboards, mice and chairs** matter for people who spend most of the day at the workstation.
- **Uninterruptible power supplies** protect against data loss from power interruptions during saves.

## Desktop, mobile or virtual

### Desktop workstations

Desktops generally offer the most performance for the money, better cooling and easier upgrades. They suit designers who work mainly at one location.

### Mobile workstations

Laptops designed as mobile workstations allow designers to work on site, at customer premises or at home. They involve trade-offs: thermal limits can reduce performance under sustained load, upgrade options are limited and costs are higher for similar performance. When choosing a mobile workstation, check certification, cooling, display quality and real performance on your own models, and consider docking stations with external displays for office use.

### Virtual and cloud workstations

Virtual workstations run CAD on servers, on premises or in the cloud, with graphics processing provided remotely and the display streamed to the user's device. They can centralise data, simplify administration, support remote and distributed teams and keep sensitive data off local devices. They also depend heavily on network latency and bandwidth, can be more expensive over time for steady workloads and must be supported by the CAD vendor's licensing and certification. A trial with real users, real models and real network conditions is essential. The [cloud, hosted or on-premise](/reados/collections/database-foundations-for-business/cloud-hosted-or-on-premise-business-systems/) article discusses the broader trade-offs of where business systems should run.

## Test before you buy

Specifications only predict performance roughly. Testing with your own work is more reliable:

1. **Choose representative files**: a complex part, a large assembly and a large drawing.
2. **Time key operations**: opening, rebuilding, creating drawing views, saving and any rendering or simulation tasks.
3. **Watch resource use**: processor, memory, graphics and storage, to see what limits performance.
4. **Compare configurations**, including the current machines, on the same tests.

```figure
type: steps
title: Testing a workstation before buying
caption: Measure with the firm's own files; specifications alone do not predict CAD performance.
- Choose representative files
- Time key operations
- Watch resource use
- *Compare configurations on the same tests
```

Many CAD vendors and user communities also provide standard benchmark files and results, which help compare hardware.

## Lifecycle and standardisation

Standardising on a small number of workstation configurations simplifies support, driver management and troubleshooting. Planning replacement every few years, based on performance needs and support lifecycles of CAD software and operating systems, avoids running critical work on unsupported or failing hardware. Before upgrading CAD software to a new major version, check that existing hardware and operating systems remain supported.

## The value of faster hardware

Hardware cost should be compared with the value of engineering time. As an illustration, suppose a designer costs the business about $90 an hour, and a faster workstation saves 20 minutes a day of waiting, through quicker rebuilds, opens and drawing updates. Over about 220 working days, that is 20 × 220 = 4,400 minutes, or about 73 hours a year, worth roughly $6,600. A workstation that costs a few thousand dollars more can pay for itself within months, before considering the less measurable benefit of fewer interruptions to concentration.

```figure
type: stats
title: The value of 20 minutes a day
caption: A workstation costing a few thousand dollars more can pay for itself within months.
- 4,400 min | Waiting saved a year | 20 × 220 days
- About 73 h | Each year
- *$6,600 | Value at $90 an hour
```

The saving is only real if the waiting time is genuinely reduced, which is why testing with real files matters.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A small engineering firm with five designers is replacing ageing workstations. The IT supplier proposes machines with many processor cores and a consumer graphics card, chosen from a general business catalogue.

The lead designer tests the proposal against an alternative with fewer, faster cores and a certified professional graphics card, using the firm's largest machine assembly. The alternative opens the assembly about 25% faster and rebuilds a complex part noticeably quicker. The consumer card shows occasional display errors in the CAD software that disappear with the certified card and driver. Memory monitoring shows the largest assemblies use about two thirds of the proposed memory, leaving reasonable headroom.

The firm buys the alternative configuration, standardises the certified driver version, adds second displays and 3D navigation devices and keeps one higher-core-count machine for rendering and simulation jobs, shared by the team. Designers report fewer interruptions, and support calls about display problems stop.

## How this applies to a small Australian business

- **Understand your workload** before choosing hardware.
- **Prioritise single-thread performance** for modelling.
- **Use certified graphics and drivers.**
- **Size memory from observed use** on your largest work.
- **Keep data in managed storage**, not only on local drives.
- **Test with your own files.**
- **Compare hardware cost with engineering time saved.**
- **Standardise configurations** and driver versions so that every designer's machine behaves the same way.
- **Check the network and settings** before blaming hardware for slow performance.

## Common mistakes

- **Buying on core count alone.**
- **Uncertified consumer graphics** causing instability.
- **Automatic driver updates** that break certified configurations.
- **Too little memory** for large assemblies, forcing constant swapping to disk.
- **Thin laptops** that throttle under sustained load.
- **Moving to virtual workstations** without testing real network conditions.
- **Treating designers' waiting time as free**, when it is often the largest hidden cost of underpowered hardware.

## Frequently asked questions

**Do we need a professional graphics card?** For stable, supported CAD work, a certified professional card and driver is the safest choice, especially with large assemblies or where vendor support matters.

**How often should CAD workstations be replaced?** Many businesses plan replacement every three to five years, depending on how demanding the work is, whether performance is limiting productivity and whether the hardware and operating system remain supported by the CAD vendor.

**Can one powerful machine serve rendering and simulation for the team?** Often yes. Sharing a high-core-count machine, or using cloud services for occasional heavy jobs, can be more economical than giving every designer maximum specifications.

## Questions to ask

- What tasks dominate our designers' time, and what hardware limits them?
- Are our graphics cards and drivers certified for our CAD version?
- How much memory do our largest assemblies actually use?
- Where is our engineering data stored, and is it backed up?
- Have we tested proposed hardware with our own files?
- How much engineering time is spent waiting on computers?

## Bringing it together

CAD workloads use hardware in specific ways. Interactive modelling depends mainly on single-thread processor performance, assemblies demand memory and graphics, and rendering and simulation benefit from many cores and GPU acceleration. Certified graphics and drivers provide stability, solid-state storage speeds file handling, and data belongs in managed, backed-up storage. Desktop, mobile and virtual workstations each have their place. Testing with real files and valuing engineering time honestly usually shows that well-chosen hardware pays for itself quickly.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. Always check your CAD vendor's hardware requirements and certification lists.*
