---
title: "What businesses should know about data centres: power, cooling, connectivity, tiers and choosing a facility"
description: "Every business system runs in some kind of data centre, from a comms cupboard to a cloud region. What makes a facility reliable, how tiers work and what to check when choosing one."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - operations
  - strategy
author: "KEVOS®"
featured: false
draft: false
---

Every business system runs somewhere physical. For a small business, that may be a server under a desk or in a cupboard next to the kitchen. For others, it is a rack in a commercial colocation facility, a hosting provider's data centre or a cloud provider's region made up of several large buildings. Most of the time, nobody thinks about the building. Then the air conditioning fails on a 40-degree day, a cleaner unplugs the wrong power lead, the uninterruptible power supply's batteries turn out to be dead, or a burst pipe floods the room below.

Data centres exist to provide what servers need to run reliably: steady power, adequate cooling, secure premises, good network connections and protection from fire, water and interference. Understanding how they do this helps businesses decide whether to keep servers on their own premises, rent space in a colocation facility, use a hosting provider or move to the cloud, and what questions to ask any provider.

This article explains what data centres provide, how power, cooling, connectivity, physical security and fire protection work, how tier classifications describe reliability, what energy efficiency measures mean, how to choose a facility or cloud region and how to improve a small on-premises server room. It is general information for owners, managers and IT providers.

## What a data centre provides

A data centre is a facility designed to house computing and network equipment and keep it running. Its essential services are:

| Service | What it protects against |
|---|---|
| Power supply and backup | Outages, voltage fluctuations, planned electricity network work |
| Cooling | Overheating, which causes failures and shortens equipment life |
| Network connectivity | Loss of connections to users, customers and other systems |
| Physical security | Theft, tampering and unauthorised access |
| Fire detection and suppression | Fire damage and the damage caused by ordinary sprinklers |
| Environmental protection | Water, dust, humidity and pests |
| Monitoring and operations staff | Problems going unnoticed, slow response |

The difference between a cupboard and a commercial data centre is not the servers but how thoroughly these services are provided, duplicated and maintained.

## Power

Servers need continuous, clean power. Data centres provide it in layers:

- **Grid supply**, sometimes from two separate feeds.
- **Uninterruptible power supplies (UPS)**, batteries that take over instantly when grid power fails and smooth out fluctuations.
- **Generators**, usually diesel, that start within seconds or minutes and run for extended periods, with fuel stored on site and supply contracts for longer outages.
- **Power distribution**, often with two separate paths to each rack, so equipment with dual power supplies stays running if one path fails.

Redundancy is often described with simple notation: **N** means just enough capacity, **N+1** means one spare unit beyond what is needed, and **2N** means a complete duplicate system.

In a small office server room, the usual weak points are a UPS with ageing batteries, no generator, and servers with a single power supply plugged into a single power board.

## Cooling

Computing equipment converts almost all the electricity it uses into heat. Without cooling, temperatures rise quickly and equipment fails or shuts down. Data centres manage this with:

- **Precision cooling units** designed to run continuously, with spare capacity.
- **Hot and cold aisle layouts**, in which racks face alternately so that cool air enters equipment from one aisle and hot exhaust is collected from the next, preventing hot and cold air mixing.
- **Containment**, enclosing aisles to improve efficiency.
- **Monitoring** of temperature and humidity throughout the room.

Office air conditioning designed for people often fails servers: it may switch off at night or on weekends, lack spare capacity and be maintained infrequently.

## Connectivity

A data centre's value depends heavily on its network connections:

- **Multiple carriers**: facilities connected to several telecommunications providers, often described as carrier-neutral, let customers choose providers and arrange redundant links.
- **Diverse physical paths**: cables entering the building by different routes, so a single excavation cannot cut every connection.
- **Interconnection**: the ability to connect directly to cloud providers, partners and internet exchanges within the facility, often with lower latency and cost than going across the internet.

Distance matters for performance. Signals take time to travel, so applications whose users are in Perth will respond faster from a facility in Perth than from one on the east coast, and some applications are sensitive to that delay.

## Physical security

Commercial data centres use layered physical security: perimeter fencing, controlled entry, security staff, closed-circuit television, identity checks, mantraps that admit one person at a time, locked cages or racks and logged access. Customers should know who can access their equipment, how visitors are controlled and how access records can be obtained.

## Fire protection and the environment

Fire protection in data centres aims to detect fire early and suppress it without destroying equipment:

- **Very early smoke detection** systems sample air continuously to find smouldering components before a fire develops.
- **Gas-based suppression** systems flood a room with an inert gas or chemical agent that extinguishes fire without water.
- **Pre-action sprinkler systems**, used in some facilities, fill with water only after detection, reducing the risk of accidental discharge.

Facilities are also sited and built to reduce risks from flooding, bushfire, storms and nearby hazards, and to keep water pipes away from equipment rooms.

## Tier classifications

The Uptime Institute, an organisation focused on data centre reliability, publishes a widely used **tier classification** from Tier I to Tier IV:

| Tier | General description |
|---|---|
| Tier I | Basic capacity, with limited or no redundancy; maintenance requires shutdowns |
| Tier II | Redundant capacity components, such as spare UPS and cooling units |
| Tier III | Concurrently maintainable: any component can be maintained without shutting down equipment |
| Tier IV | Fault tolerant: designed to withstand a single failure anywhere without affecting equipment |

Tier claims should be checked. A facility may be designed to a tier, certified for its design, or certified for how it is actually built and operated. Ask which applies and request evidence.

## Energy efficiency and sustainability

Data centres use large amounts of electricity. A common efficiency measure is **power usage effectiveness (PUE)**, introduced by the industry group The Green Grid: total facility energy divided by the energy used by computing equipment. A PUE of 1.5 means that for every unit of energy used by servers, half a unit more is used for cooling, power conversion and other overheads. Lower is better, and 1.0 is the theoretical ideal.

In Australia, the National Australian Built Environment Rating System (NABERS) includes ratings for data centre energy performance. Businesses with emissions reporting obligations or sustainability goals may also ask providers about renewable energy supply and emissions data. Small server rooms, by contrast, are often very inefficient, cooled by office air conditioners running continuously.

## Cloud regions and availability zones

Cloud providers operate large data centres grouped into **regions**, each with several **availability zones**: separate facilities with independent power, cooling and networking, close enough for fast communication. Spreading a system across zones protects it from the failure of one facility. Major providers operate regions in Australia, including Sydney and Melbourne, and some offer facilities in Canberra suited to government work.

For businesses using the cloud, the provider takes care of the facility, but choosing the region, using more than one zone for critical systems and understanding where backups are stored remain the customer's decisions.

## Choosing a colocation or hosting provider

When renting space or services in a commercial facility, check:

- **Location**: distance from users and staff, flood and bushfire exposure, access in an emergency.
- **Power**: redundancy, generator capacity and fuel arrangements, and how often generators are tested under load.
- **Cooling**: redundancy and temperature commitments.
- **Connectivity**: available carriers, diverse paths and cloud interconnection.
- **Security**: access controls, logging and visitor procedures.
- **Certifications**: tier certification, information security certification such as ISO/IEC 27001, and any government requirements relevant to your customers.
- **Service commitments**: availability, response times and remote hands services, where the facility's staff perform simple tasks on your equipment.
- **Contracts and pricing**: power charges, minimum terms, price reviews and exit arrangements.
- **Sustainability**: efficiency ratings and energy sourcing.

Australian government work may require facilities certified under the Australian Government's Hosting Certification Framework; check customer requirements early.

## Visiting a facility before signing

A site visit reveals a great deal that brochures do not. Look for and ask about:

- **How you are admitted**: identity checks, escorts, logging and how quickly access can be arranged in an emergency.
- **Tidiness**: clean, labelled cabling and clear aisles usually reflect disciplined operations.
- **Temperature in the aisles**, and whether hot and cold air are separated.
- **Generator and UPS test records**, including when generators last ran under real load.
- **Incident history**: recent outages, what caused them and what changed afterwards.
- **Staffing**: whether technical staff are on site around the clock or on call.
- **Loading dock and equipment delivery** arrangements, if you will install hardware.
- **Remote hands**: what the facility's staff will do for you, response times and charges.

Providers that answer these questions openly, with records, are generally easier to work with when something goes wrong.

## Systems that belong on site

Not everything should move to a commercial facility or the cloud. Factories, warehouses, retail stores and remote sites often need some computing on site: controllers and supervisory systems for production, local servers that keep working during internet outages, and equipment that must respond within fractions of a second. This on-site computing, sometimes called the edge, needs the same basic protections on a small scale: stable power, adequate cooling, physical security, monitoring and a plan for replacement when hardware fails.

## Improving a small on-premises server room

Many businesses keep some equipment on site, such as network equipment, a small server or systems that must run during internet outages. Practical improvements include:

- **Dedicated cooling** that runs continuously, with temperature monitoring and alerts.
- **A properly sized UPS** with batteries tested and replaced on schedule, and automatic shutdown of servers before batteries run out.
- **Locked access**, limited to those who need it.
- **No water pipes** above equipment, and equipment raised off the floor where flooding is possible.
- **Tidy, labelled cabling** and power, so nothing is unplugged by mistake.
- **Fire detection** linked to the building system, and an appropriate extinguisher.
- **Documentation** of what is in the room and how it connects.
- **Off-site backups**, because no small room is protected against every hazard.

The [business continuity planning for small businesses](/reados/collections/operational-data-records-and-controls/business-continuity-planning-for-small-businesses/) article explains how to plan for the loss of premises, including server rooms.

## Common mistakes

- **Relying on office air conditioning** for servers.
- **Never testing UPS batteries** or generators.
- **Servers with single power supplies** in facilities designed for dual power.
- **Accepting tier claims** without evidence.
- **Choosing a distant facility** for latency-sensitive applications.
- **Single carrier connections** to a well-connected facility.
- **Ignoring power and cooling costs** in hosting comparisons.

## A worked example

This is an illustrative example. A professional services and engineering firm with 50 staff keeps three servers, network equipment and a storage system in a converted storeroom cooled by a split-system air conditioner. Over two summers, the air conditioner has failed twice, causing servers to shut down from overheating, and the UPS batteries were found to be dead during a power cut.

**Options.** The IT provider presents three options: upgrade the room with dedicated cooling, a new UPS, monitoring and access control for about $35,000; move the servers to a rack in a colocation facility with Tier III design, dual power and multiple carriers, at about $1,400 a month including power and remote hands; or move the remaining server workloads to cloud services, retiring the hardware over two years.

**Decision.** The firm moves its servers to colocation for the next two years, because the equipment still has useful life, the facility is 20 minutes away and has a direct connection to the firm's cloud provider. It plans to move remaining workloads to the cloud as the servers reach end of life. The storeroom keeps only network equipment, with a small UPS, a temperature alarm and a lock.

**Result.** The firm removes the overheating and power risks immediately, avoids a large investment in a room it will soon not need, and has a clear path to retire the hardware.

## Applying this in an Australian business

- **Know where every system physically runs.**
- **Check power, cooling and security** of on-premises rooms.
- **Test UPS batteries** and replace them on schedule.
- **Compare colocation, hosting and cloud** on whole-of-life cost and risk.
- **Verify tier and certification claims.**
- **Choose locations** that suit users, latency and hazards.
- **Use more than one availability zone** for critical cloud systems.
- **Consider energy efficiency** and sustainability reporting needs.

## Questions worth considering

- Where are our servers and network equipment, and what would happen if the air conditioning failed tonight?
- When were our UPS batteries last tested?
- Who has physical access to our equipment?
- Do our providers' facilities meet our customers' requirements?
- Which systems must stay on our premises, and why?

## Bringing it together

Data centres provide the power, cooling, connectivity, security and protection that systems need to run reliably. Tier classifications describe their resilience, efficiency measures describe their energy use, and cloud regions with availability zones extend the same principles at scale. Whether a business keeps a small server room, rents colocation space, uses hosting or relies on the cloud, it should know where its systems run, check the facility's protections, verify claims and plan for the loss of any single site.

---

*Source: KEVOS® editorial notes, drawing on general data centre, IT infrastructure and facilities practice. Costs in the worked example are illustrative assumptions. This article is general information.*
