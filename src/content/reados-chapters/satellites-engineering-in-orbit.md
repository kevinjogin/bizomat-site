---
title: "Satellites: engineering for a place where nothing can be repaired"
description: "How satellites developed from Sputnik to navigation, communications and Earth observation, the engineering of reliability without repair, and what space systems teach about dependence."
publishDate: 2026-10-16
category: "Ideas"
tags:
  - systems
  - strategy
  - quality
author: "KEVOS"
featured: false
draft: false
---

Most people use satellites dozens of times a day without noticing. A phone finds its location, a weather forecast predicts tomorrow's rain, a bank timestamps a transaction, a farmer's tractor steers itself along a paddock, a truck's route is optimised, a ship is tracked across the ocean and a remote community connects to the internet. Behind each of these sits a system of spacecraft orbiting hundreds or tens of thousands of kilometres overhead, and ground systems that control them and use their signals.

Satellites are also a distinctive engineering problem. Once launched, almost none can be repaired. They must survive violent launch loads, then operate for years in vacuum, extreme temperature swings and radiation, powered by sunlight and controlled remotely. Every design decision must assume that a fault cannot be fixed by sending a technician. That constraint has driven some of the most rigorous approaches to reliability, testing and systems engineering ever developed, and those approaches have influenced engineering far beyond space.

This article traces, in general terms, how satellites developed, from the first artificial satellite to global navigation, communications and Earth observation, the engineering principles that make them work, Australia's part in the story, and the lessons satellites offer for reliability, infrastructure and dependence. It is a general historical overview.

## From idea to orbit

The idea of an artificial satellite follows from basic mechanics: an object moving fast enough horizontally falls around the Earth rather than into it. Turning that idea into reality required rockets powerful and accurate enough to reach orbital speed.

In 1945, the writer and engineer Arthur C. Clarke described how three satellites in **geostationary orbit**, about 36,000 km above the equator, where an orbit takes exactly one day, could relay communications around the world. Such satellites would appear stationary from the ground, so fixed antennas could point at them.

On 4 October 1957, the Soviet Union launched **Sputnik 1**, the first artificial satellite. It carried a simple radio transmitter, but its significance was enormous: it proved orbit was achievable and triggered intense competition in space technology. The United States launched **Explorer 1** in early 1958, which detected the radiation belts surrounding the Earth.

## Satellites find their uses

Within a few years of Sputnik, satellites began serving practical purposes:

| Use | Early milestones | What it enabled |
|---|---|---|
| Weather observation | First weather satellite launched in 1960 | Images of cloud systems, better forecasting and storm tracking |
| Communications | Active relay satellites from 1962; geostationary relay from 1964 | Live intercontinental television, telephone and later data links |
| Earth observation | Dedicated land-imaging satellites from 1972 | Mapping, agriculture, forestry, mining and environmental monitoring |
| Navigation | Early naval navigation systems in the 1960s; the Global Positioning System fully operational in 1995 | Precise positioning and timing worldwide |
| Science | Telescopes and probes from the 1960s onwards | Astronomy, planetary exploration and Earth science |

**Communications satellites** carried live television across oceans for the first time in the early 1960s, and geostationary satellites soon provided international telephone circuits. **Weather satellites** transformed forecasting by observing weather systems over oceans and remote regions. **Earth observation** satellites created a continuous record of the planet's surface. **Navigation satellites** eventually provided free positioning and timing signals that became one of the world's most important pieces of infrastructure. Today several global navigation systems operate, and many regions, including Australia and New Zealand, are developing augmentation services to improve accuracy for local users.

## Australia's part in the story

Australia has contributed to space activity from its early days. In 1967, **WRESAT**, Australia's first satellite, was launched from Woomera in South Australia, making Australia one of the first countries to launch its own satellite from its own territory. In 1969, Australian tracking stations, including the Parkes radio telescope and the Honeysuckle Creek tracking station near Canberra, received and relayed television pictures of the Apollo 11 moonwalk to the world. Australia's national communications satellite system, AUSSAT, began operating in the mid-1980s, improving television and communications to remote areas. The Australian Space Agency was established in 2018 to support the growth of the national space industry.

## Choosing an orbit

The orbit chosen for a satellite shapes what it can do:

- **Low Earth orbit**, a few hundred to around two thousand kilometres up, offers short signal delays and detailed views of the surface, but each satellite passes over a location only briefly, so continuous coverage requires many satellites.
- **Medium Earth orbit**, typically many thousands of kilometres up, is used by navigation systems, balancing coverage and the number of satellites needed.
- **Geostationary orbit**, about 36,000 km above the equator, keeps a satellite over one point, so a few satellites can cover most of the world, but signals must travel a long way. A signal going up to a geostationary satellite and back down covers more than 70,000 km, which at the speed of light takes about a quarter of a second, a delay noticeable in conversations and some applications.
- **Polar and sun-synchronous orbits** pass over every part of the Earth over time, often at the same local time of day, which suits consistent Earth imaging.

Each orbit involves trade-offs in coverage, delay, cost, launch and the number of spacecraft required. Choosing the right one starts with the service the system must deliver.

## The ground segment

Satellites are only half of a space system. The **ground segment**, comprising control centres, tracking stations, antennas, data processing systems and user equipment, is just as important. Ground stations command spacecraft, receive their data and monitor their health. Processing systems turn raw signals into weather forecasts, maps, positions and communications services. User equipment, from navigation receivers to satellite phones and broadband terminals, determines what customers actually experience. Many space projects underestimate the ground segment, and the most successful treat space and ground as one system.

## Space weather

The Sun's activity affects satellites and the services they provide. Solar flares and geomagnetic storms can disturb radio signals, degrade navigation accuracy, increase drag on low orbit satellites and damage electronics. Space weather services monitor and forecast these conditions, and operators plan around them. For businesses that depend on precise positioning or high-frequency radio, space weather is one more reason to understand and plan for occasional disruption.

## Engineering for no repairs

The defining constraint of satellite engineering is that most failures cannot be fixed. That shapes every stage of design and manufacture.

### Surviving launch

A launch subjects a satellite to intense vibration, acoustic noise, acceleration and shock. Structures, mountings, connectors and components must survive loads far more severe than anything they will see in orbit.

### Surviving space

In orbit, satellites face:

- **Vacuum**, which affects lubrication, heat transfer and materials that release gases;
- **Thermal extremes**, as surfaces swing between direct sunlight and the cold of shadow;
- **Radiation**, which degrades electronics and solar cells and can cause random upsets in digital circuits; and
- **Micrometeoroids and debris.**

### Power, control and communication

Satellites generate power from solar panels and store it in batteries for periods in shadow. They control their orientation with reaction wheels, magnetic torquers or thrusters, keep their orbit with small propulsion systems and communicate with ground stations through antennas and radio systems. Each subsystem must work reliably with the others for years.

### Reliability practices

Space engineering developed rigorous reliability practices:

- **Redundancy**: duplicating critical components so that a single failure does not end the mission.
- **Derating**: operating components well below their rated limits to extend life.
- **Parts selection and screening**: using components with known quality and testing them before use.
- **Failure mode analysis**: systematically asking how each part could fail and what the effect would be.
- **Testing as it will fly**: subjecting complete spacecraft to vibration, acoustic, thermal vacuum and electromagnetic tests that represent launch and orbit.
- **Configuration control**: tracking exactly what was built, so that test results and analyses apply to the actual hardware.

These practices are expensive, which is why traditional satellites were costly and took years to build. They also show what reliability requires when failure is unrecoverable.

## Systems engineering

Satellites are systems of systems: structure, power, thermal control, attitude control, propulsion, communications, payload and software, together with launch vehicles and ground stations. Interfaces between them must be defined precisely, requirements traced from mission goals to component specifications, and verification planned to prove each requirement is met. The discipline of **systems engineering**, which developed strongly in aerospace and defence programs, provides methods for doing this. The [systems integration](/reados/collections/business-systems-and-operating-rhythm/systems-integration-making-the-parts-work-together/) article explains how integration challenges appear in ordinary business and engineering projects too.

## Smaller, cheaper, more numerous

In recent decades, satellite engineering has changed dramatically. Standardised small satellites, such as **CubeSats** built from standard units about ten centimetres on each side, allowed universities and small companies to build spacecraft using standard interfaces and commercial components, at a fraction of traditional cost. Reusable launch vehicles and rideshare launches reduced the cost of reaching orbit. Large **constellations** of low Earth orbit satellites now provide broadband internet, Earth imaging and other services.

These changes involve a different reliability philosophy. Instead of making each satellite as reliable as possible, some systems accept that individual satellites may fail and design the constellation so that losing some spacecraft does not interrupt the service. The growth in numbers has also made **space debris** and the long-term sustainability of orbits pressing concerns.

## Dependence on space infrastructure

As satellite services became woven into daily life, societies became dependent on them. Navigation and timing signals underpin transport, logistics, agriculture, mining, construction, telecommunications, electricity networks and finance. Weather and Earth observation data inform decisions in agriculture, emergency management and insurance. Disruption to these services, whether from technical faults, space weather, interference or deliberate action, could have widespread effects.

Infrastructure that is free and reliable tends to be taken for granted. Businesses that depend on it benefit from understanding that dependence and preparing for its temporary loss.

## Lessons for engineers and businesses

### Design for the cost of failure

Where failure cannot be repaired or would be very costly, invest heavily in reliability: redundancy, derating, analysis and realistic testing. Where failures are cheap to fix, simpler approaches may be better. Matching reliability investment to the consequences of failure is a principle that applies to any product or system.

### Test as you operate

Space engineering's insistence on testing complete systems under representative conditions applies widely. Tests that do not represent real conditions give false confidence.

### Standard interfaces lower barriers

CubeSat standards allowed many new participants into space. Standard interfaces in any industry, from shipping containers to software platforms, enable ecosystems of suppliers and users.

### Infrastructure becomes a platform

Navigation signals were developed for specific purposes but became a platform for countless applications nobody planned. Infrastructure that is open and reliable can create far more value than its builders imagined.

### Know your dependencies

Many businesses rely on satellite positioning, timing and data without realising it. Identifying those dependencies and planning for disruptions is part of resilience. The [business continuity planning](/reados/collections/operational-data-records-and-controls/business-continuity-planning-for-small-businesses/) article explains how to plan for loss of critical services.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A regional earthmoving contractor installs satellite-based machine guidance on its graders and excavators. Operators now cut and fill to design levels without constant survey checks, and rework falls substantially: on a typical subdivision job, the business estimates it saves around 15% of machine hours previously spent correcting levels.

The owner then asks what would happen if the positioning signal were degraded or lost for a day. The answer is that machines would continue only with traditional survey support, which the business no longer keeps on standby. It responds by maintaining relationships with a local surveyor, keeping physical survey control marks on each site, training a supervisor in traditional level checks and including positioning outages in its project risk register. The investment in satellite guidance continues to pay off, and the business is no longer entirely dependent on it.

## How this applies to a small Australian business

- **Identify satellite-dependent services** you rely on: positioning, timing, communications and data.
- **Plan for outages** of those services.
- **Match reliability effort to the cost of failure** in your own products and systems.
- **Test under realistic conditions**, not ideal ones.
- **Use standard interfaces** to widen your supplier and customer options.
- **Look for platform opportunities** in freely available infrastructure and data.
- **Think about the whole system**, including the "ground segment" of your own products: the software, support and user equipment that customers actually experience.

## Questions worth considering

- Which of our operations depend on satellite positioning, timing or data?
- What would we do if those services were unavailable for a day or a week?
- Where in our products would a failure be unrecoverable, and are we designing accordingly?
- Do our tests represent real operating conditions?
- Which open data or infrastructure could create new opportunities for us?
- Are we designing our products and services as complete systems, including what happens on the customer's side?

## Bringing it together

Satellites grew from a radio beacon in 1957 into infrastructure for communications, weather, Earth observation and navigation that underpins modern economies. Because satellites cannot be repaired, their engineering developed rigorous approaches to reliability, testing, configuration control and systems engineering. Recent changes, smaller satellites, cheaper launch and large constellations, have shifted some of those trade-offs and raised new concerns about debris. For businesses on the ground, satellites teach the value of matching reliability to the cost of failure, testing realistically, using standard interfaces, recognising infrastructure as a platform and understanding the dependencies that free and reliable services quietly create.

---

*Source: KEVOS editorial notes. This article is a general historical overview.*
