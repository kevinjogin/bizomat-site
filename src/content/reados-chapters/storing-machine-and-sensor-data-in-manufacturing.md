---
title: "Storing machine and sensor data in manufacturing: historians, time-series databases and data engineers can use"
description: "Machines and sensors produce millions of readings a day. How to collect, timestamp, name, compress, store and secure them, and link them to production context so they answer real questions."
publishDate: 2026-10-09
category: "Manufacturing"
tags:
  - manufacturing
  - automation
  - systems
author: "KEVOS®"
featured: false
draft: false
---

Modern factories are full of data that is rarely kept. Programmable controllers know the speed of every conveyor, the temperature of every oven zone and the state of every machine many times a second. Sensors measure vibration, pressure, flow, current and energy. Inspection systems measure every part. Most of this information appears briefly on an operator screen and is then lost, or is stored in ways that make it hard for engineers to use.

Capturing machine and sensor data well can transform how a manufacturer understands its operations. It can show where production time is really lost, reveal the process conditions behind quality problems, warn of developing equipment failures and identify energy waste. But machine data differs from business data such as orders and invoices. It arrives continuously and in large volumes, depends on accurate timestamps, needs context to mean anything and comes from operational networks that must be protected from cyber threats.

This article explains what machine data is, how it differs from business data, how it is collected and stored in process historians and time-series databases, why timestamps, naming and context matter, how to manage volume and retention, how to keep the data trustworthy and secure, and how to turn it into useful information. It is general information for manufacturing, engineering, maintenance and operations managers.

## What machine data includes

Typical machine and sensor data falls into several kinds:

| Kind | Examples | Typical frequency |
|---|---|---|
| States | Running, stopped, idle, faulted, in changeover | On change |
| Counts | Parts produced, rejects, cycles | On change or every few seconds |
| Process values | Temperatures, pressures, speeds, flows, torques | Every second or faster |
| Alarms and events | Faults, warnings, operator actions | On occurrence |
| Condition data | Vibration, bearing temperature, motor current | Seconds to minutes, or bursts at high speed |
| Energy | Electricity, gas, compressed air, water | Every few seconds to every 15 minutes |
| Quality measurements | Dimensions, weights, vision inspection results | Per part or per sample |

These values come from programmable logic controllers, sensors, CNC machine controls, supervisory control systems, inspection equipment and energy meters.

## How machine data differs from business data

- **Volume.** A modest installation of 200 values sampled once a second produces more than 17 million readings a day.
- **Time is central.** Almost every question is about time: what happened before a fault, how temperature changed during a batch, how long a machine was stopped.
- **Mostly additions.** Readings are rarely changed after they are recorded.
- **Meaning depends on context.** A temperature reading means little unless the system knows which product, batch and step it belongs to.
- **Quality varies.** Sensors drift, fail, get disconnected or report values outside their range.
- **Operational networks.** Data originates on networks that control physical equipment, where availability and safety come first.

Because of these differences, machine data is usually stored separately from the ERP database, in systems designed for time-based data.

## Where machine data fits in the factory's systems

A widely used way of describing manufacturing systems is the level model set out in the ISA-95 standard, published internationally as IEC 62264:

| Level | Systems | Time scale |
|---|---|---|
| Levels 0 to 2 | Sensors, actuators, controllers, supervisory control and operator screens | Milliseconds to minutes |
| Level 3 | Manufacturing operations systems, such as manufacturing execution systems, historians, quality and maintenance systems | Minutes to days |
| Level 4 | Business systems, such as ERP | Days to months |

Historians and time-series databases usually sit at level 3, collecting data from below and providing summaries to systems and people above.

```figure
type: layers
title: Where machine data sits in the factory's systems
caption: After the ISA-95 level model (IEC 62264).
- Level 4 | business systems such as ERP · days to months
- *Level 3 | operations systems and historians · minutes to days
- Levels 0–2 | sensors, controllers, operator screens · milliseconds to minutes
```

## Process historians and time-series databases

**Process historians** have been used for decades in process industries such as chemicals, oil and gas, water and power. They are designed to collect large numbers of tagged values from control systems, compress them efficiently, store them for years and retrieve them quickly for trends and analysis. Commercial historians are often closely integrated with automation and supervisory control products.

**Time-series databases** are a more general class of database designed for timestamped data, used in industrial monitoring and also in IT, finance and the internet of things. Many cloud platforms offer managed time-series and industrial data services.

Both store data in a similar shape: a **tag** or series name, a timestamp, a value and often a quality flag. Choosing between them depends on existing automation systems, scale, skills, cost and whether data needs to stay on site.

## Collecting the data

Data is usually collected through a combination of:

- **Industrial protocols** such as OPC UA, an international standard for secure industrial data exchange; Modbus, a simple protocol dating from the late 1970s and still common; and protocols specific to particular controller makers.
- **MQTT**, a lightweight publish-and-subscribe messaging protocol widely used for sensors and internet of things devices.
- **Edge gateways**, small computers near the machines that collect, buffer and forward data.
- **Direct connections** from supervisory control systems to historians.

Collection should **store and forward**: if the network or central system is unavailable, the edge device keeps readings locally and sends them when the connection returns, so gaps do not appear in the record.

## Timestamps and clocks

Because questions about machine data depend on sequence and timing, timestamps must be accurate and consistent:

- **Synchronise clocks** on controllers, gateways and servers using network time services, so events from different machines can be compared.
- **Decide which timestamp to use**: the time the reading was taken at the source is usually more accurate than the time it reached the server.
- **Store times in Coordinated Universal Time** and convert for display, avoiding confusion at daylight saving changes, which in some Australian states shift local time twice a year.
- **Record time zones** for sites in different states.

## Naming tags and adding context

A historian with thousands of tags named after controller memory addresses is almost useless to engineers. Good practice includes:

- **A naming convention** based on the asset hierarchy, such as site, area, line, machine and measurement, so tags are understandable and searchable.
- **Metadata** for each tag: description, engineering units, normal range, sensor type and the asset it belongs to.
- **Context from production systems**: which job, product, batch, recipe, shift and operator applied at each time. Linking machine data to this context, sometimes called **contextualisation**, turns readings into answers, such as average oven temperature for each batch of a particular product.

## Managing volume and retention

Machine data grows quickly, so systems manage it through:

- **Compression.** Historians often store a new value only when it changes by more than a set amount, called a deadband, or use algorithms that keep the points needed to reconstruct a trend within a tolerance. Compression settings must suit each signal; too much compression hides important changes.
- **Downsampling.** Raw readings can be summarised into averages, minimums and maximums per minute or hour for long-term storage.
- **Tiered retention.** For example, raw data might be kept for 90 days, one-minute summaries for three years and hourly summaries for ten years. Periods should reflect investigation, warranty, quality and regulatory needs.

## Keeping the data trustworthy

Common data quality problems include:

- **Stuck values**, where a failed sensor reports the same value indefinitely.
- **Gaps**, from network outages or collection failures.
- **Spikes** from electrical noise.
- **Unit errors**, such as degrees Fahrenheit in a system expecting Celsius.
- **Calibration drift**, where readings slowly become inaccurate.

Record quality flags with readings, monitor for flatlines and gaps, maintain calibration records for critical sensors and make data quality visible to users. The [statistical process control on the shop floor](/reados/collections/manufacturing-quality/statistical-process-control-on-the-shop-floor/) article explains how to distinguish real process changes from normal variation, which depends on trustworthy measurements.

## Security of operational data

Machine data comes from networks that control physical processes. Connecting them carelessly to office networks or the internet can expose equipment to cyber attack. Good practice includes:

- **Separate operational and business networks**, with controlled connections between them.
- **Push data out** from the operational network to collection systems, rather than allowing inbound connections from business networks or the internet.
- **Use secure protocols and authentication**, such as OPC UA's security features.
- **Restrict and monitor remote access** for vendors and integrators.
- **Follow recognised guidance**, such as the IEC 62443 series of standards for industrial automation security and Australian Signals Directorate advice on operational technology.

The [cyber security basics for small businesses](/reados/collections/business-systems-security-and-it-decisions/cyber-security-basics-for-small-businesses/) article covers the wider controls that apply to factories and workshops.

## Turning data into information

Stored data becomes valuable when it answers specific questions:

- **Equipment effectiveness.** Overall equipment effectiveness, commonly calculated as availability multiplied by performance multiplied by quality, shows how much of a machine's potential output is achieved and where the losses are.
- **Downtime analysis.** Machine states show when and how long equipment stopped; operators add reasons, because machines cannot always tell why they stopped.
- **Condition monitoring.** Trends in vibration, temperature and current can show developing faults before failure. The [maintenance that prevents breakdowns](/reados/collections/lean-and-continuous-improvement/maintenance-that-prevents-breakdowns/) article explains how condition monitoring fits into a maintenance strategy.
- **Process and quality investigation.** Comparing process conditions for good and poor batches can reveal causes of defects.
- **Energy management.** Energy use per unit produced, and use during idle periods, reveals waste.

Start with a small number of questions that matter, rather than collecting everything and hoping insight follows.

## Who owns and looks after machine data

Machine data sits between engineering, maintenance, production and IT, and it can fall between them. Agree who is responsible for the collection equipment, tag configuration, data quality, storage, access and security, and who decides which new signals to collect.

Ownership also matters with suppliers. Many equipment makers now offer remote monitoring platforms that collect data from their machines. Before agreeing, check who owns the data, whether the business can export it in full, how it is protected, where it is stored and what happens to it if the service ends. Data from several suppliers' platforms is hard to combine unless the business can bring it into its own systems.

## Choosing a platform: questions to ask

- **Which controllers and protocols does it support** in our factory, including older equipment?
- **Does it buffer data** at the edge during network outages?
- **How does it handle compression, summaries and retention**, and can we change them?
- **Can it link readings to production context** such as jobs and batches?
- **Can engineers build trends and reports** without specialist help?
- **How is it secured**, and does it require inbound connections to the control network?
- **Can we export all data** in standard formats?
- **What does it cost** as tags, sites and users grow?

## Common mistakes

- **Collecting everything** without questions, creating large stores nobody uses.
- **Cryptic tag names** with no metadata.
- **Unsynchronised clocks**, making sequences of events impossible to reconstruct.
- **No production context**, so readings cannot be linked to products or batches.
- **Over-compression** that hides short events.
- **Exposing control networks** in the rush to connect machines.
- **Ignoring operator input**, such as downtime reasons, that machines cannot provide.

## A worked example

This is an illustrative example. A food manufacturer runs three packaging lines. Managers believe the lines run at about 80% of their potential, based on shift reports, but output is below plan.

**Collection.** The business installs an edge gateway on each line that reads machine states, counts and about 50 process values from the controllers once a second, buffers them locally and sends them to a time-series database. Clocks are synchronised and times stored in Coordinated Universal Time. Tags follow a naming convention by line, machine and signal, with descriptions and units.

**Volume.** About 150 values a second produce close to 13 million readings a day before compression. With deadband compression on slow-changing values and one-minute summaries kept for three years, storage costs remain modest.

**Context.** The production schedule system sends the product and batch running on each line, and operators select a reason for any stop longer than two minutes on a touch screen.

**Findings.** Overall equipment effectiveness is calculated at about 58%, not 80%. Many short stoppages of under two minutes, which never appeared in shift reports, are traced to film splicing on one wrapper and a sensor misaligned on a labeller.

**Result.** After the splicing method is changed and the sensor bracket redesigned, effectiveness on the affected lines rises to about 66% within three months, adding output without new equipment. The figures are illustrative, but the pattern of hidden short stoppages is common.

```figure
type: bars
title: Packaging line effectiveness
unit: %
max: 85
caption: Short stoppages under two minutes never appeared in shift reports; the historian found them.
- Believed from shift reports | 80
- Measured | 58
- *Three months after the fixes | 66
```

## Applying this in an Australian business

- **Start with questions**, such as where production time is lost.
- **Collect through edge devices** that buffer data during outages.
- **Synchronise clocks** and store times consistently.
- **Name tags clearly** and record metadata.
- **Link data to production context** and operator input.
- **Plan compression and retention** deliberately.
- **Protect operational networks** following recognised guidance.
- **Check data quality** and calibration for critical sensors.

## Questions worth considering

- Which questions about our production could machine data answer that our reports cannot?
- Are our controller, gateway and server clocks synchronised?
- Could an engineer understand our tag names without asking someone?
- Can we link a reading to the batch or job being produced at the time?
- How are our control networks separated from office networks and the internet?

## Bringing it together

Machine and sensor data can reveal how a factory really performs, but only if it is collected reliably, timestamped accurately, named clearly, linked to production context, stored efficiently and protected properly. Process historians and time-series databases are designed for this kind of data. Start with specific questions, add operator input where machines cannot explain themselves, and use the results to improve equipment effectiveness, quality, maintenance and energy use.

---

*Source: KEVOS® editorial notes, drawing on general industrial automation, manufacturing systems and data management practice. The worked example is illustrative. This article is general information.*
