---
title: "From telegraph to grid: how electrification was engineered, and what it teaches about systems and standards"
description: "Electricity became useful through systems, not single inventions. How the telegraph, electric light, the AC and DC contest and the grid developed, and lessons on standards and networks."
publishDate: 2026-10-09
category: "Ideas"
tags:
  - systems
  - strategy
  - product-development
author: "KEVOS®"
featured: false
draft: false
---

Electricity is so ordinary today that it is easy to forget how recently it became useful. In 1800, it was a laboratory curiosity. By 1900, it carried messages across oceans and lit city streets, and within a few more decades it powered factories, homes and railways through interconnected grids. That transformation was not the work of one inventor. It came from scientists whose discoveries had no commercial purpose, engineers who turned those discoveries into systems, entrepreneurs who found markets and businesses that fought fiercely over standards.

The history of electrification is full of lessons that apply far beyond power engineering. Devices often wait for a cheaper input before they succeed. The winning product is frequently the one designed as part of a complete system. Standards contests can be bitter, but networks become valuable only when they converge. Infrastructure follows existing corridors. And some of the hardest engineering involves systems that cannot be inspected once installed.

This article traces the development of electrical engineering from the telegraph through electric lighting, the contest between direct and alternating current, and the growth of interconnected grids, including Australia's own milestones, and then draws out lessons for engineers and businesses about systems, standards, networks and applied science. It is general information for engineers, managers and anyone interested in how technology develops.

## Before electricity: the optical telegraph

People have always wanted to send messages faster than a person can travel. In 1794, France introduced Claude Chappe's optical telegraph: towers several kilometres apart, each with movable arms read by telescope from the next tower. Messages could cross hundreds of kilometres in minutes.

The system had limits that no refinement could remove. Every tower needed staff, so costs rose with distance whether or not messages were sent, and the line stopped in fog, rain and darkness. These limits came from the mechanism itself, not from poor execution. When a limitation is inherent in the mechanism, improvement requires a different mechanism, and electricity provided one.

## The electric telegraph: science becomes industry

The electric telegraph depended on a series of scientific discoveries made with no commercial purpose:

| Discovery | What it provided |
|---|---|
| Volta's battery, 1800 | A continuous electric current |
| Oersted's discovery of electromagnetism, 1820 | Current producing movement at a distance |
| Practical electromagnets, 1820s | Stronger, usable magnetic effects |
| Ohm's law, 1826 | A way to predict behaviour in long circuits |

In Britain, William Cooke and Charles Wheatstone put an electric telegraph into service beside a railway in 1837. In the United States, Samuel Morse developed a simpler system using a single circuit and a code of dots and dashes, which proved cheaper to build and became widely adopted.

Telegraph lines were often built beside railways, for good reasons: the railway provided a continuous corridor under single ownership, and it needed the telegraph to manage its trains. The same logic later placed fibre optic cables along rail lines and pipelines.

In Australia, the Overland Telegraph Line, completed in 1872 from Adelaide to Darwin across the continent, connected to an undersea cable and linked Australia to Britain by telegraph, cutting the time for news to arrive from weeks or months to hours.

### The Atlantic cable: engineering what you cannot inspect

Laying a telegraph cable across the Atlantic proved far harder. A cable laid in 1858 worked briefly and then failed, partly because excessive voltage applied in an attempt to improve signalling damaged its insulation. Scientists, notably William Thomson, later Lord Kelvin, developed theories of how signals travel along long cables and sensitive instruments to detect weak currents. After further failures, a durable cable entered service in 1866, laid by the giant steamship Great Eastern.

The lesson is that systems which cannot be inspected or repaired easily, once installed, demand understanding of the physics, careful testing and conservative operation, rather than trial and error.

## Electric light: the system, not the lamp

Electric arc lights, bright lights produced by a spark between carbon rods, were demonstrated in the early 1800s but stayed impractical for decades because batteries were too expensive. What changed was not the lamp but the cost of electricity, when practical generators, such as those developed by Zénobe Gramme from the 1870s, made electricity far cheaper. Arc lighting then spread rapidly for streets and large spaces.

Arc lights were too bright for homes. Many inventors, including Joseph Swan in England, worked on incandescent lamps, in which a filament glows. Thomas Edison's contribution was to design a lamp suitable for mass production **as part of a complete system**: generators, distribution cables, switches, fuses, meters and lamps, all designed to work together.

Edison's choices flowed from the system:

- Lamps had to be wired in **parallel**, so each could be switched separately.
- That required a **high-resistance filament** so that each lamp drew a modest current at the distribution voltage.
- A **three-wire distribution system** reduced the amount of expensive copper needed.
- **Meters** allowed customers to be charged for what they used.

Edison's Pearl Street Station in New York began supplying customers in 1882. Lamps improved steadily, from carbon to tungsten filaments and later fluorescent lamps, each giving much more light per watt.

## Alternating and direct current

Edison's system used **direct current (DC)**, which flows in one direction. Its weakness was distance. Power lost in cables rises with the square of the current, so delivering the same power at higher voltage and lower current reduces losses dramatically: raising the voltage tenfold cuts the losses to about one-hundredth. But DC voltage could not easily be changed, so it had to be distributed at the low voltage used by lamps, limiting supply to within a short distance of the power station.

**Alternating current (AC)**, which reverses direction many times a second, can be stepped up and down by **transformers**, which work only with changing currents. Power can be generated, stepped up to high voltage for efficient transmission over long distances, then stepped down for safe use.

Through the 1880s, engineers developed practical AC transformer systems in Europe and the United States. George Westinghouse acquired rights to transformer technology and promoted AC, and Nikola Tesla's polyphase AC motors, patented in 1888, gave AC a practical motor for industry. Demonstrations of long-distance AC transmission in Germany in 1891 and the generation of power at Niagara Falls in the mid-1890s showed what AC could do.

The contest between the AC and DC camps, sometimes called the war of the currents, involved public campaigns about the dangers of AC as well as technical arguments. AC won for generation and transmission, but the two were combined rather than one simply replacing the other: rotary converters and later electronic converters fed DC users from AC supplies, and today high-voltage DC links carry bulk power over very long distances and undersea.

## The grid: interconnection and scale

Early power stations served local areas. Over the twentieth century, they were connected into **grids**, networks of power stations, transmission lines and substations that share load and back each other up. Interconnection allowed larger, more efficient power stations, reduced the reserve capacity each area needed and improved reliability, but it also meant that faults could spread, requiring sophisticated protection and control.

Standards became essential. Countries settled on supply frequencies, 50 hertz in Australia, Europe and much of the world and 60 hertz in North America, and on standard voltages. Equipment built for one standard does not always work on another, a reminder that early choices become long-lasting. Standards can still be moved carefully: around 2000, Australia changed its nominal supply voltage from 240 volts to 230 volts to align with international practice, with a tolerance band wide enough that existing equipment kept working while the network shifted gradually.

In Australia, electricity grids developed largely state by state. The National Electricity Market, operating since the late 1990s, interconnects the eastern and southern states, while Western Australia and the Northern Territory have separate systems. Today, the grid is being reshaped again by wind, solar and batteries, distributed across many sites rather than concentrated in a few large stations.

```figure
type: timeline
title: From telegraph to grid
caption: Electricity went from laboratory curiosity in 1800 to an interconnected system within about a century.
- 1794 | Chappe's optical telegraph | towers read by telescope
- 1837 | Cooke and Wheatstone | electric telegraph beside a railway
- 1866 | A durable Atlantic cable | after earlier failures
- 1872 | Overland Telegraph Line | Adelaide to Darwin
- 1882 | Pearl Street Station | supply to customers
- 1891 | Long-distance AC | demonstrated in Germany
- *Late 1990s | National Electricity Market | eastern and southern states
```

## Making electricity safe

As electricity entered homes and workplaces, fires and electric shocks followed. Safety developed alongside the technology: fuses and later circuit breakers to interrupt excessive currents, insulation standards for cables, earthing so that faulty equipment would trip protection rather than become live, and wiring rules setting out how installations must be designed and built. In Australia, electrical installations are governed by state and territory laws that require licensed electricians, and by the national wiring rules in AS/NZS 3000. Residual current devices, which disconnect power in a fraction of a second when current leaks to earth, have greatly reduced deaths from electric shock and are now required on many circuits. The pattern mirrors the history of steam boilers: new hazards emerge with new technology, accidents expose them, and engineering standards, licensing and protective devices follow.

## Lessons for engineering and business today

### Look for the expensive input

Arc lamps worked long before they sold; they waited for cheap electricity. When a product works but does not sell, the problem may be an input that is still too expensive, rather than the product itself.

### Design the system, not just the component

Edison's system succeeded because its lamp, cables, meters and generators were designed together. Many modern products succeed or fail on how well they fit into a wider system of supply, installation, service and data. The [right choice depends on the system around it](/reados/collections/business-systems-security-and-it-decisions/the-right-choice-depends-on-the-system-around-it/) article explores this principle in business decisions.

### Standards contests are costly, and networks reward convergence

The AC and DC contest, competing frequencies and later battles over communication standards all show that networks become valuable when equipment works together. Businesses choosing equipment, software or communication protocols should weigh interoperability and the likely direction of standards, not just features.

### Inherent limits need new mechanisms

The optical telegraph could not be improved past fog and staffing costs. Recognising when a limit is inherent in a mechanism, rather than a matter of execution, saves effort spent on improvements that cannot succeed.

### Follow existing corridors

Telegraphs followed railways, and fibre follows rail and pipelines. New infrastructure often succeeds by sharing existing rights of way and customers.

### Respect what cannot be inspected

Undersea cables, buried services and sealed systems need sound theory, testing and conservative operation, because failures are expensive to find and fix.

### Anticipate new hazards

Electricity, like steam, brought hazards that were understood only after accidents. When introducing new technology, such as batteries, high-voltage equipment or automated machinery, assess the new hazards deliberately and build protection in from the start, rather than waiting for incidents to reveal them.

### Science pays off unpredictably

The telegraph depended on discoveries made with no commercial aim. Businesses benefit from staying close to research and applied science in their fields, even when the payoff is uncertain.

## A worked example

This is an illustrative example. It applies the transmission principle at the scale of a single business site. A rural manufacturer plans to supply a new workshop building about 300 metres from the main switchboard, with a maximum load of about 20 kW. The electrician compares a single-phase supply at 230 volts with a three-phase supply at 400 volts.

**Current.** At 230 volts single phase, 20 kW draws about 87 amps. At 400 volts three phase, assuming a power factor close to one, the line current is about 20,000 ÷ (1.732 × 400), or roughly 29 amps.

**Losses.** Cable losses are proportional to the square of the current in each conductor. For the same conductor size, the single-phase supply has two current-carrying conductors at 87 amps, and the three-phase supply has three at about 29 amps. Comparing current squared times the number of conductors, about 15,100 against about 2,500, the three-phase supply loses roughly one-sixth as much energy in the cable and has a much smaller voltage drop, or it allows smaller cables for the same loss.

```figure
type: bars
title: Supplying 20 kW to a workshop 300 m away
max: 16000
caption: Comparing current squared times conductors: three phase loses roughly one-sixth as much in the cable.
- Single phase, 230 V: 87 A on 2 conductors | 15100
- *Three phase, 400 V: about 29 A on 3 conductors | 2500
```

**Decision.** The business installs a three-phase supply, sized by its electrician to the relevant wiring and cable sizing standards, which also suits the workshop's three-phase machinery. The same reasoning that led engineers to high-voltage AC transmission in the 1890s guides the choice, at a much smaller scale. All electrical work must be designed and carried out by licensed electricians.

## Applying these lessons in an Australian business

- **Ask which input limits adoption** when a good product does not sell.
- **Design products as parts of systems**, including installation, service and data.
- **Choose standards with interoperability in mind.**
- **Recognise inherent limits** and look for different mechanisms.
- **Use existing corridors and relationships** for new infrastructure and services.
- **Engineer conservatively** where systems cannot be inspected.
- **Stay close to applied science** in your field.

## Questions worth considering

- Is a product of ours waiting on a cheaper input, rather than a better design?
- Which parts of the system around our product do we control, and which do we depend on?
- Which standards are emerging in our industry, and are we on the converging side?
- Are we trying to improve a mechanism whose limits are inherent?
- Which of our systems would be expensive to inspect or repair after installation?

## Bringing it together

Electrification turned laboratory discoveries into the infrastructure of modern life through a series of systems: the telegraph, electric lighting, alternating current transmission and interconnected grids. Its history shows the importance of cheap inputs, whole-system design, converging standards, existing corridors, conservative engineering for hidden systems and the long-term value of applied science. For engineers and businesses today, those lessons apply whenever new technology must fit into the systems around it.

---

*Source: KEVOS® editorial notes, drawing on an earlier KEVOS® engineering history series on telegraphy, electric lighting, alternating current and electricity grids, together with established histories of technology. The worked example is illustrative. This article is general information; electrical work must be carried out by licensed electricians.*
