---
title: "HVAC controls and commissioning: sequences, set points, fault finding and keeping systems tuned"
description: "How building controls sense, decide and act, which control strategies save energy, how commissioning proves a system works as intended, and how to find and fix the faults that waste energy."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - operations
  - process-improvement
  - systems
author: "KEVOS"
featured: false
draft: false
---

Two buildings with identical air-conditioning equipment can use very different amounts of energy and give very different comfort. The difference usually lies in the controls: the sensors, controllers, programs and settings that decide when equipment runs, how hard it works and how it responds to changing conditions. Well-designed and well-tuned controls deliver comfort efficiently. Poorly configured controls can run plant all night, heat and cool the same space at once, fight one another and hide faults for years.

Controls are also where the gap between design and reality opens. A designer specifies how a system should operate, a contractor installs and programs it, and the building is handed over, often in a hurry. If the system is not properly **commissioned**, tested to prove that it operates as intended in all modes and seasons, faults and compromises are built in from the first day. Over time, overrides, failed sensors and changed settings accumulate. Studies of existing buildings commonly find substantial energy savings simply by finding and fixing control problems, without replacing equipment.

This article explains, in general terms, how HVAC controls work, the control strategies that save energy, how commissioning should be carried out, the faults most often found in existing buildings and how owners can keep systems tuned. It is general information; controls work on building services should be carried out by qualified controls contractors and engineers.

## Sense, decide, act

Every control system has three parts:

- **Sensors** measure conditions: air and water temperatures, humidity, carbon dioxide, pressure, flow, occupancy and the status of equipment.
- **Controllers** compare measurements with set points and decide what to do according to their programs.
- **Actuators** carry out decisions: opening valves and dampers, starting and stopping equipment and changing the speed of fans and pumps through variable-speed drives.

In most commercial buildings, controllers are networked into a **building management system** or building automation system, with a central computer or web interface that lets operators see conditions, change settings, view trends and receive alarms. Open communication protocols such as BACnet and Modbus allow equipment from different manufacturers to exchange data.

## Control loops

Much HVAC control relies on **feedback loops**. A controller measures a variable, such as supply air temperature, compares it with the set point and adjusts an output, such as a chilled-water valve, to reduce the difference. Many loops use **proportional-integral-derivative** logic, combining a response proportional to the current error, a response to accumulated error over time and sometimes a response to the rate of change.

Loops must be tuned. A loop that responds too aggressively **hunts**, swinging the valve back and forth and the temperature above and below set point, wearing out actuators and wasting energy. A loop that responds too slowly leaves conditions off target for long periods. Tuning is usually done during commissioning and should be checked when equipment or loads change.

## Sequences of operation

The **sequence of operation** is the written description of how a system should behave: when equipment starts and stops, how it stages, what set points apply, how it responds to faults and how different systems interact. A good sequence is specific, testable and written in plain language as well as in program code. It is the yardstick against which commissioning and later troubleshooting are measured. Many problems in existing buildings trace back to sequences that were never written, were vague or were changed without documentation.

## Strategies that save energy

### Scheduling and optimum start

Running plant only when spaces are occupied is the simplest saving. **Optimum start** algorithms learn how long the building takes to reach comfort and start plant just early enough, rather than at a fixed early hour.

### Dead bands and set points

A **dead band** between heating and cooling set points, for example heating to 21 °C and cooling to 24 °C, prevents systems switching rapidly between modes and saves energy. Overly tight set points and narrow dead bands increase energy use with little comfort benefit.

### Economy cycle

When outside air is cool and dry enough, an **economy cycle** opens outside air dampers to provide free cooling, reducing or eliminating mechanical cooling. Faulty dampers or sensors often disable this saving without anyone noticing.

### Demand-controlled ventilation

Fresh air must be supplied for occupants, but heating or cooling it costs energy. **Demand-controlled ventilation** uses carbon dioxide or occupancy sensors to supply outside air in proportion to the number of people present.

### Resetting set points

Rather than holding fixed set points, systems can **reset** them to match demand. Chilled water temperature can rise when cooling loads are low, heating water temperature can fall in mild weather, and duct static pressure can be lowered until the most demanding zone is just satisfied. Reset strategies let chillers, boilers and fans work less hard most of the time.

### Variable speed

Fans and pumps controlled by variable-speed drives can slow down at part load, saving energy roughly in proportion to the cube of speed. The [HVAC for commercial and industrial buildings](/insights/hvac-for-commercial-and-industrial-buildings/) article explains how controls fit into overall system choices.

## Commissioning: proving it works

**Commissioning** is a systematic process of verifying that systems are designed, installed, tested and handed over to operate as intended. It typically includes:

- **Defining requirements**: the owner's needs and the design intent, including comfort conditions, operating hours and energy targets.
- **Design review**: checking that drawings and sequences can deliver the requirements and are testable.
- **Pre-functional checks**: confirming that equipment is installed correctly, wired, labelled, powered and that sensors are calibrated and in the right places.
- **Functional performance testing**: operating systems through every mode, including start-up, shutdown, part load, economy cycle, fault conditions and alarms, and comparing behaviour with the sequence.
- **Seasonal testing**: repeating key tests in summer and winter, because a system handed over in one season has not been tested in the other.
- **Documentation and training**: as-built sequences, set point schedules, trend reports and training for the people who will operate the building.

Commissioning is most effective when an independent commissioning agent is involved from design through to the end of the first year of operation.

## Faults found in existing buildings

Reviews of operating buildings commonly find:

- **Simultaneous heating and cooling**, such as reheat coils fighting cooled supply air or two units serving one space with conflicting set points.
- **Plant running after hours** because of overrides, holiday schedules not updated or a single tenant request that kept a whole floor running.
- **Failed or drifting sensors**, causing systems to respond to false conditions.
- **Stuck or leaking valves and dampers**, especially outside air and economy cycle dampers.
- **Hunting control loops** that wear actuators and waste energy.
- **Overrides left in manual** after maintenance or troubleshooting.
- **Excessive ventilation** relative to occupancy.

Many of these faults are invisible to occupants because comfort is maintained, just at higher cost.

## Documentation that survives handover

Controls knowledge is easily lost. The contractor who programmed the system moves on, the facilities manager changes, and the reasons behind particular settings are forgotten. Good handover documentation includes the sequence of operation, a points list naming every sensor and output, network diagrams, set point and schedule tables, controller backups and the commissioning test results. Keeping these documents current, and recording every significant change with its reason, makes later troubleshooting far faster and protects the owner from dependence on a single contractor.

## Fault detection and analytics

Modern building management systems collect large amounts of trend data. **Fault detection and diagnostics** software analyses that data against rules or models to flag likely faults: valves open while the coil temperature does not change, heating and cooling active together, fans running out of hours or sensors reading implausible values. Analytics turn trend logs from an unused archive into a daily maintenance tool, provided someone is responsible for acting on the findings.

## Alarms people act on

Alarms are only useful if someone responds to them. Many building management systems generate so many nuisance alarms, such as minor temperature excursions, communication glitches and alarms from equipment that is switched off for good reason, that operators stop looking. A useful alarm strategy classifies alarms by priority, suppresses alarms that follow automatically from another fault, routes critical alarms to someone on call and reviews alarm statistics regularly to remove noise. The aim is that every alarm that reaches a person requires a decision.

## Listening to occupants

Occupant complaints are a form of sensor data. Patterns of complaints, such as one corner of a floor always too hot in the afternoon or a meeting room stuffy by mid-morning, often point to specific faults: a sensor near a sunny window, an undersized outlet or ventilation that does not respond to occupancy. Recording complaints by location and time and comparing them with trend data turns frustration into diagnosis. Responding to each complaint by adjusting set points for the whole system, by contrast, tends to create new problems elsewhere.

## Maintaining the controls themselves

Controls have components that wear and drift like any other equipment. Actuators fail, valve seats leak, damper linkages loosen, sensors drift and batteries in controllers and wireless sensors run flat. Controller software needs updates and backups, and network equipment ages. Maintenance contracts should include controls explicitly, with periodic calibration checks of key sensors, stroke tests of valves and dampers, a backup of every controller program and a log of changes made to set points and sequences.

## Ratings and disclosure in Australia

The National Australian Built Environment Rating System, known as **NABERS**, rates the measured energy and water performance of buildings such as offices, hotels and shopping centres. Under the Commercial Building Disclosure program, many larger office spaces must have a current NABERS Energy rating disclosed when they are offered for sale or lease. Ratings give owners a practical reason to keep controls tuned, because control faults show up directly in measured energy use.

## Security of building controls

Building management systems are networked computers, and many have been installed with default passwords or connected to the internet without adequate protection. Compromised controls can disrupt comfort and operations and provide an entry point to other systems. Changing default credentials, segmenting control networks from business networks, controlling remote access and keeping software updated are basic protections. The [cyber security basics for small businesses](/insights/cyber-security-basics-for-small-businesses/) article covers the wider principles.

## A worked example

This is an illustrative example. The building and figures are hypothetical.

A mid-sized office building uses about 400,000 kWh of electricity a year for heating, ventilation and air conditioning. The owner engages a controls contractor to tune the system after the building's NABERS rating slipped.

Two weeks of trend analysis reveal several problems: two air-handling units running until 11 pm because of a forgotten override, reheat coils on one floor heating air that the central plant had just cooled, an economy cycle disabled by a failed outside air temperature sensor and duct static pressure held higher than any zone needed.

The contractor removes the override, corrects the reheat sequence, replaces the sensor, introduces a static pressure reset and documents the changes in the sequence of operation. Over the following year, HVAC energy falls by about 18%, or roughly 72,000 kWh, worth about $18,000 at $0.25 per kWh. The tuning work costs a fraction of that, and the building's rating improves at its next assessment. The owner sets up a monthly fault report so that problems are caught before they persist for years.

## How this applies to a small Australian business

- **Ask for the sequence of operation** for your HVAC system and keep it up to date.
- **Check schedules, holidays and overrides** regularly.
- **Review trend data** or ask your contractor for monthly fault reports.
- **Calibrate or replace key sensors**, especially outside air and supply air sensors.
- **Commission new systems properly**, including seasonal testing.
- **Secure building controls** like any other networked system.

## Common mistakes

- **Handing over without functional testing**, so faults are built in.
- **Leaving overrides in place** after a single request.
- **Fighting set points** between adjacent units.
- **Trusting a sensor nobody has checked** in years.
- **Collecting trend data nobody reads.**
- **Changing set points without recording why**, so the next person cannot tell what is intentional.

## Frequently asked questions

**What is the difference between commissioning and maintenance?** Commissioning proves that a system works as intended, usually at handover or after major changes. Maintenance keeps components in good condition. Both are needed, and periodic re-commissioning or tuning restores performance that drifts over time.

**Do small buildings need a building management system?** Not always. Smaller sites may manage well with good programmable controllers, but they still benefit from documented set points, schedules and periodic checks.

## Questions to ask

- Do we have a current, written sequence of operation for our HVAC systems?
- Which equipment runs outside occupied hours, and why?
- When were our key sensors last checked against a reference?
- Who reviews our control system's trends and alarms, and how often?
- Is our building management system protected from unauthorised access?

## Bringing it together

HVAC controls sense, decide and act, and their configuration often matters more than the equipment itself. Tuned loops, clear sequences, sensible set points, scheduling, economy cycles, demand-controlled ventilation, resets and variable speed save energy without sacrificing comfort. Commissioning proves that systems work as intended in every mode and season, and ongoing fault detection keeps them tuned as overrides, failed sensors and changes accumulate. The [cutting energy use in business premises](/insights/cutting-energy-use-in-business-premises/) article places controls among other practical energy savings. For any building owner, a documented sequence, regular review of trends and a habit of fixing faults promptly are among the cheapest improvements available.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. This article is general information and does not replace advice from a qualified controls contractor or building services engineer.*
