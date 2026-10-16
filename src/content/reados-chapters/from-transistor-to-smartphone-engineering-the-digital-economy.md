---
title: "From transistor to smartphone: how the digital economy was engineered, and lessons for product businesses"
description: "Transistors, integrated circuits, microprocessors and networks turned computing into a cheap component. How it happened and what it teaches about cost curves, generality and standards."
publishDate: 2026-10-09
category: "Ideas"
tags:
  - systems
  - product-development
  - strategy
author: "KEVOS®"
featured: false
draft: false
---

Within a single working lifetime, computing went from room-sized machines owned by governments and large corporations to cheap components inside almost every manufactured product. Machines that were once controlled by relays, cams, hydraulics and mechanical timers now run on software. Products that once stood alone are connected to networks and to their makers. For manufacturers and engineering businesses, this shift has changed what products can do, how they are designed and supported, and what risks come with them.

The digital economy was engineered through a sequence of developments: the transistor, the integrated circuit, the microprocessor, solid-state memory, local and global networks, encryption, the web and mobile devices. The most important consequences of each were often economic rather than technical. Once a manufacturing process for chips existed, the cost of adding more transistors fell close to zero, and complexity stopped being expensive. General-purpose processors, standard interfaces and layered protocols spread costs across countless uses.

This article traces those developments in plain terms, explains why they changed the economics of products, and draws out lessons for businesses that design, build and support products with electronics and software, including cost curves, generality, standards, security and the management of component obsolescence. It is general information for engineers, product managers and business leaders.

## The transistor: solid-state switching

Early electronic equipment, such as radios, radar and the first electronic computers, used **vacuum tubes** to amplify and switch signals. Tubes worked, but they used a lot of power, ran hot, were fragile and eventually burned out. A computer with thousands of tubes suffered failures regularly, which limited how large and reliable such machines could be.

In December 1947, John Bardeen, Walter Brattain and William Shockley at Bell Laboratories in the United States demonstrated the **transistor**, which amplifies and switches electric signals in solid material, without a heated filament or vacuum. It used less power, was smaller and far more reliable. The three shared the Nobel Prize in Physics in 1956.

## The integrated circuit: removing the wiring

Early transistors were individual components wired together by hand, and the number of connections became the next limit. In 1958, Jack Kilby at Texas Instruments built a circuit with several components on a single piece of semiconductor. In 1959, Robert Noyce at Fairchild Semiconductor, building on the **planar** process developed by Fairchild colleague Jean Hoerni, devised an integrated circuit in which the connections were deposited on the chip rather than wired by hand.

That changed the economics fundamentally. A vacuum tube is made individually and costs about the same however many are bought. Transistors on an integrated circuit are made together on a wafer, so once the process exists, adding more transistors costs very little. In 1965, Gordon Moore observed that the number of components on a chip was doubling at a regular rate, a trend later described as **Moore's law**, which held, with revisions, for decades as manufacturing processes shrank features ever smaller.

## The microprocessor: computation as a component

In the late 1960s, a Japanese calculator maker asked Intel to design a set of custom chips for its calculators. Intel engineers, including Ted Hoff and Federico Faggin, proposed instead a single general-purpose processor whose behaviour would be set by a stored program. The resulting **Intel 4004**, released in 1971, was the first commercially offered single-chip microprocessor, although other groups developed similar devices at around the same time.

The argument for generality was economic. Custom chips for each product meant each product bore its own design cost. A general processor spread one design across countless products, with differences moving into **software**, which costs almost nothing to copy. Once processors cost a few dollars, control functions that had been mechanical or hard-wired moved into software. Most microprocessors ever made sit inside products nobody calls a computer: appliances, vehicles, machines, instruments and toys.

**Flash memory**, developed in the early 1980s, gave small devices non-volatile storage with no moving parts, so they could keep programs and data without power. Continued improvements in lithography, the process of printing circuit patterns on silicon, including extreme ultraviolet lithography in volume production from 2019, kept increasing the number of transistors on a chip.

### Control moves into software

Factories felt the change early. In 1968, the Hydramatic division of General Motors asked for an electronic replacement for the large relay panels that controlled its machines, because every model change meant rewiring them. The response was the **programmable logic controller**, with Modicon's first unit delivered in 1969. It was designed to be programmed in ladder logic, a notation that resembles relay wiring diagrams, so the electricians and technicians who maintained relay panels could understand it. That design choice mattered as much as the electronics: a new technology was adopted faster because it respected the skills of the people who had to use it. Programmable controllers, and later industrial computers and networks, now control most automated machinery.

## Networks: connecting machines

### Local networks and Ethernet

In 1973, at Xerox's research centre in California, Robert Metcalfe and colleagues developed **Ethernet** for connecting computers in a building. Its approach to two computers transmitting at once was simple: each detects the collision, waits a random and increasing time, and tries again. Randomness, rather than central control, made the system robust and cheap.

The experimental network ran at under 3 megabits per second. After Xerox, Digital Equipment Corporation and Intel published a 10 megabit specification in 1980, Ethernet was standardised as IEEE 802.3 in 1983. It outlasted rival local network technologies and has since been extended to gigabit speeds and beyond, over copper and fibre, while keeping a compatible frame format. Its history shows that an open, simple, widely licensed standard can beat technically elegant alternatives, and that keeping compatibility as speeds rise protects everyone's earlier investment.

### Packet switching and the internet

In 1969, the first message passed over the **ARPANET**, a US research network that sent data in small packets routed independently, rather than over a dedicated circuit. In 1983, ARPANET switched to the **TCP/IP** protocols, which let many different networks join into one internet with common addressing and transport. Layering, with separate protocols for physical links, routing, transport and applications, meant each layer could improve independently.

### Public-key cryptography

In 1976, Whitfield Diffie and Martin Hellman published the concept of **public-key cryptography**, in which a key that can be shared openly is paired with a private key that is never shared. It allows two parties who have never met to establish a secure connection over an open network. A practical public-key encryption scheme, RSA, followed in 1977. These ideas underpin secure websites, online banking, software updates and digital signatures.

### The World Wide Web

In 1989, Tim Berners-Lee at CERN in Switzerland proposed the **World Wide Web**, a system of linked documents accessed by browsers, and the first web server ran in 1990 and 1991. Built on top of the internet, it made networked information accessible to everyone.

## Mobile, positioning and the smartphone

Digital mobile telephone networks spread through the 1990s. The US Global Positioning System reached full operation in 1995, making precise positioning available worldwide. Wireless local networks spread through the 2000s, and Australian researchers at CSIRO developed technology that became important to Wi-Fi. Touchscreen smartphones, combining computing, communications, positioning, cameras and sensors in a pocket device, spread rapidly from the late 2000s.

Computing then became infrastructure. **Cloud computing** services, offering computing power and storage on demand over the internet, allowed businesses to rent rather than own computing, and enabled the large-scale data processing behind modern artificial intelligence.

## When software fails

Moving functions into software brought a new kind of failure. Mechanical parts usually wear out gradually and visibly; software faults are present from the day a product ships and appear only when a particular combination of inputs occurs. Testing cannot try every combination in a complex system.

The best-known warning comes from medicine. Between 1985 and 1987, the Therac-25 radiation therapy machine delivered massive overdoses to several patients, some of whom died. Later investigations found that software faults were central causes, and that earlier models in the same family had hardware safety interlocks that would have prevented the overdoses, while the Therac-25 relied on software alone. Its makers had reused software from earlier models, where the hardware interlocks had masked the same faults.

The lessons have shaped engineering practice. Safety functions should not depend on a single layer of protection, reused software must be reassessed in its new context, and fault reports from the field must be investigated rather than dismissed. International standards for functional safety, such as IEC 61508 and machinery standards derived from it, set out how safety-related electronic and software systems should be specified, designed and verified.

## What this means for product businesses

### Cost curves change what is possible

When the marginal cost of complexity falls close to zero, functions that were once too expensive become standard. Product businesses should watch component cost curves: sensors, processors, memory, communications modules and batteries that are expensive today may be cheap enough to include in a few years.

### Generality and software

General-purpose hardware with software differentiation spreads design costs across product ranges and allows features to change after manufacture. A product family can share one controller with different software configurations, rather than separate hardware for each variant.

### Interfaces and layers

Standard instruction sets, communication protocols and layered architectures let components and software evolve independently. Products that use open, widely adopted interfaces are easier to integrate, support and upgrade than those relying on proprietary links.

### Security was added later, and it shows

Early networks assumed users trusted each other. Security was added after the fact, which is why so many systems remain vulnerable. Connected products and industrial systems need security designed in from the start: secure updates, authentication, encryption and a plan for vulnerabilities over the product's life. The [cyber security basics for small businesses](/reados/collections/business-systems-security-and-it-decisions/cyber-security-basics-for-small-businesses/) article covers the core controls.

### Connection creates data and services

A connected product can report how it is used, when it needs maintenance and when it is about to fail. That opens service models, such as remote monitoring, condition-based maintenance and contracts priced on performance, that were impractical when products were silent after delivery. The [selling performance, not products](/reados/collections/growth-business-models-and-new-markets/selling-performance-not-products/) article covers how such models work. Data also brings obligations: customers need to know what is collected, who can see it and how it is protected.

### Safety cannot rest on software alone

Where software controls a hazard, keep independent protection, such as hardware interlocks and safety-rated devices, and treat every software change to a safety function as a design change that needs review.

### Electronics become obsolete faster than machines

Machines last decades; electronic components and software platforms can become unavailable within a few years. Product businesses need **obsolescence management**: tracking component life cycles, designing with alternative parts, making last-time purchases when components are discontinued, and planning software maintenance. Old software platforms that nobody can change become a business risk; the [managing legacy Visual Basic 6 applications](/reados/collections/business-systems-security-and-it-decisions/managing-legacy-visual-basic-6-applications/) article shows how such risks accumulate.

## A worked example

This is an illustrative example. A machine builder makes packaging machines in 12 variants, each with its own relay and timer control panel. Panels take about six hours to wire and test, the company builds about 300 machines a year, and changing a sequence for a customer means rewiring.

**Change.** The engineering team redesigns the control system around a single programmable controller with standard input and output modules, used across all variants. Variant differences are set in software parameters. Machine status is available over a standard industrial network protocol for customers' monitoring systems.

**Result.** Panel wiring and testing falls to about two hours per machine, saving about four hours on each of 300 machines, or roughly 1,200 hours a year. At an assumed internal labour cost of $60 an hour, that is worth about $72,000 a year. Sequence changes become software changes, tested and version-controlled, and customer modifications that once took days of rewiring take hours.

**Safety.** Guard interlocks and emergency stops remain on safety-rated devices, independent of the main program, so a software fault cannot defeat them.

**New responsibilities.** The business also takes on new obligations, as the digital history predicts: it creates a software version control and release process, a cyber security baseline for networked machines including password management and remote access controls, and an obsolescence plan that tracks the controller's life cycle, with an approved alternative and a last-time-buy policy when the manufacturer announces end of production. In this illustration, those new activities take about 300 hours a year, so the net gain remains substantial, but only because the business planned for the responsibilities rather than discovering them later.

## Applying these lessons in an Australian business

- **Watch component cost curves** for functions that could become affordable.
- **Use general-purpose platforms** with software configuration across product ranges.
- **Prefer open, widely adopted interfaces** and protocols.
- **Design security in** for connected products and systems.
- **Keep independent safety protection** where software controls hazards.
- **Manage electronic obsolescence** with life cycle tracking and alternatives.
- **Version-control software** and plan for its maintenance.
- **Plan for the long life** of products whose electronics will age faster than their mechanics.

## Questions worth considering

- Which of our product functions could move from hardware into software?
- Which components in our products are approaching end of production?
- Do our connected products have a security and update plan for their whole life?
- Are we using interfaces that customers' systems can easily connect to?
- Who maintains the software in our products, and how is it controlled?

## Bringing it together

The transistor, integrated circuit, microprocessor, flash memory, networks, cryptography, the web and mobile devices turned computing into a cheap, connected component of almost everything. Their history shows how falling marginal costs, general-purpose designs, layered standards and network effects reshape industries, and how security and obsolescence become lasting responsibilities. For product businesses, the lessons are to watch cost curves, use general platforms and open interfaces, design security in and manage the life cycle of electronics and software as carefully as the machines they control.

---

*Source: KEVOS® editorial notes, drawing on an earlier KEVOS® engineering history series on solid-state electronics, microprocessors, networks and protocols, mobile communications and computing infrastructure, together with established histories of technology. The worked example is illustrative. This article is general information.*
