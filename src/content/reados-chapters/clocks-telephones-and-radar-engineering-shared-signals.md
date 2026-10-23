---
title: "Clocks, telephones and radar: what the engineering of shared signals teaches about networks and detection"
description: "Public clocks, telephone exchanges, broadcasting and radar each solved a problem of shared signals. Their history holds lessons on standards, network growth and false alarms."
publishDate: 2026-10-09
category: "Ideas"
tags:
  - systems
  - communication
  - operations
author: "KEVOS®"
featured: false
draft: false
---

A public clock, a telephone exchange, a radio station and a radar set look like very different machines. Yet each solved a version of the same problem: how to create and distribute a signal that many people depend on. A city's clock gave everyone the same time. The telephone network let any subscriber reach any other. Broadcasting sent one signal to millions of receivers. Radar picked a faint echo out of noise and decided whether something was really there.

In each case, the device turned out to be the easier part. The harder engineering lay in the system around it: agreeing on a shared reference, connecting many users without an explosion of links, sharing a limited resource such as radio spectrum, fitting information into the available bandwidth and deciding when a weak signal is real. Those problems appear in every modern business that runs networks, coordinates teams or monitors operations.

This article traces the development of public timekeeping and standard time, the telephone network, broadcasting, television and radar, including Australian milestones, and then draws out lessons for engineers and managers about shared standards, network growth, where to put complexity, shared resources and setting alarm thresholds. It is general information for readers in any industry.

## Keeping a city's time

Public clocks had existed since medieval times, but most were not very accurate. The Great Clock at the Palace of Westminster in London, which began keeping time in 1859 and is widely known by the name of its bell, Big Ben, was built to a demanding specification: it was expected to keep time to within about a second a day.

Every mechanical clock faces a contradiction. Its pendulum must swing as freely as possible, because any disturbance changes its timing, yet it must receive energy to keep swinging. The **escapement** solves this by releasing the gears one step at a time while giving the pendulum a small push. If that push varies, because wind loads the hands or the gears bind, the pendulum's timing varies too.

The Westminster clock used a **gravity escapement**, designed by Edmund Beckett Denison, in which the gears never push the pendulum directly. Instead they lift small weighted arms, which then fall and deliver a push of constant size, however much force the gears or the weather apply to the clock. It is a clear example of **isolating a precision element from upstream disturbances**, the same principle behind voltage regulators and pressure regulators.

Fine adjustment is equally simple. Placing a small coin on a tray on the pendulum changes its effective length slightly and alters the clock's rate by a fraction of a second a day. The adjustment is fine enough to be useful and coarse enough to be practical.

## Standard time: the value is in the agreement

Until the late nineteenth century, most towns kept their own local time based on the sun, so noon in one town differed by minutes from noon in the next. Railways made that untenable, because timetables needed one time across a network. British railways adopted a common time from the 1840s, and in 1883 railways in the United States and Canada introduced standard time zones. In 1884, an international conference chose Greenwich as the prime meridian.

Australia's colonies adopted standard time zones in 1895, establishing the eastern, central and western zones that remain the basis of Australian time today.

Timekeeping itself kept improving. The first quartz clock was built at Bell Laboratories in 1927, using the steady vibration of a quartz crystal. In 1955, Louis Essen and Jack Parry at Britain's National Physical Laboratory built the first accurate caesium atomic clock, and in 1967 the second was redefined in terms of the caesium atom. Atomic clocks now underpin satellite navigation, telecommunications networks and financial trading systems, where computers in different places must agree on the time to within tiny fractions of a second. Each step made clocks more accurate, but the most important engineering lay in distributing the same time to everyone who needed it.

The progression from public clocks to time zones and, much later, to network time protocols that synchronise computers is not mainly a story of more accurate clocks. It is a story of **shared time**. The value lies less in accuracy than in everyone agreeing on the same reference.

## The telephone: an easy device and a hard network

Alexander Graham Bell's telephone patent was granted in 1876. The basic instrument was simple: a microphone that varied an electric current with sound, a receiver that turned the varying current back into sound, a battery and a pair of wires.

The difficulty appeared as soon as more than two people wanted to talk. Connecting every subscriber directly to every other needs **n(n−1)/2 links**: 10 subscribers need 45 lines, and 100 need 4,950. That growth forced the invention of the **telephone exchange**, where each subscriber has one line to a central switchboard, and operators connect calls on request.

Exchanges became automatic. Almon Strowger, an undertaker in Kansas City, patented an automatic switch in 1891, reportedly out of suspicion that operators were diverting calls to a competitor. Electromechanical switching spread through the twentieth century, followed by electronic and then digital switching. Australia's telephone network grew under the Postmaster-General's Department from Federation, and long-distance and international links gradually connected a widely spread population.

The network, not the instrument, was where the engineering effort, investment and value accumulated.

## Broadcasting: one transmitter, millions of receivers

Wireless telegraphy was first used to send messages from one point to another, like a cable without wires. Broadcasting reversed that model: one transmitter served an unlimited number of receivers that never replied. In Australia, regular radio broadcasting began in 1923, and the Australian Broadcasting Commission was established in 1932.

Two principles emerged that apply well beyond radio.

**Put complexity where there is one, not where there are millions.** Because a broadcaster has one transmitter and millions of listeners, it made sense to put cost and complexity into the transmitter and keep receivers simple and cheap. That is why radio became a mass medium. The same reasoning applies to content delivery networks, software design and products sold in large numbers.

**Shared resources need governance.** Radio spectrum is finite, and two transmitters on the same frequency in the same area destroy each other's service. No individual operator can fix that alone, because the interference comes from someone else. Spectrum therefore requires allocation, licensing and enforcement. In Australia, spectrum is managed by the Australian Communications and Media Authority. The same structure, a shared resource that one user's behaviour can degrade for others, appears in shared networks, airspace and common facilities.

Engineers also learned that **bandwidth, power and quality can be traded**. Amplitude modulation is simple but picks up noise; frequency modulation uses more bandwidth but rejects most of that noise. The designer chooses the exchange rate.

## Television: bandwidth governs everything

In 1926, John Logie Baird demonstrated televised moving images in London using a **mechanical** scanning disc. Mechanical scanning hit a limit that no refinement could remove: higher resolution required smaller holes in the disc, which let through less light, and faster spinning. **Electronic** systems, developed by several groups including Philo Farnsworth in the United States, Vladimir Zworykin at RCA and the EMI research team in Britain, had no moving parts and no such limit. In 1936, the BBC began a regular high-definition service, and electronic television soon replaced mechanical scanning. Television broadcasting began in Australia in 1956.

The deeper constraint was **bandwidth**. The information needed for a moving picture rises with the number of lines, the detail in each line and the number of frames per second, so doubling resolution in both directions quadruples the data. Engineers worked within that budget by exploiting human perception: interlacing lines to reduce flicker, and transmitting colour at lower resolution than brightness because the eye sees fine detail mainly in brightness. Modern video compression uses the same ideas.

## Radar: deciding whether something is there

In 1935, a team led by Robert Watson-Watt in Britain demonstrated that an aircraft could be detected by the radio energy it reflected. Similar work proceeded independently in several countries at about the same time. Britain built a chain of radar stations along its coast before the Second World War, and radar developed rapidly during the war, including microwave radar using the cavity magnetron.

Radar measures distance by timing an echo, since radio waves travel at the speed of light. Its central difficulty is that the echo is extremely weak. The power returned from a target falls with the **fourth power of distance**, so doubling the range reduces the echo to one-sixteenth. Radar engineering became the science of **detecting signals in noise**.

Any detector must set a **threshold**. Set it low, and it detects faint targets but raises many false alarms. Set it high, and false alarms fall but real targets are missed. There is no setting that eliminates both. Wartime radar work helped develop the mathematics of this trade-off, now called signal detection theory, which is used today in medical testing, fraud detection, quality inspection and machine learning.

Australia built its own radar during the war through the Council for Scientific and Industrial Research's Radiophysics Laboratory in Sydney. After the war, its scientists turned their skills to radio astronomy, and the Parkes radio telescope, opened in 1961, later helped receive television pictures from the Apollo 11 Moon landing in 1969.

```figure
type: timeline
title: Engineering shared signals
caption: Time, telephones, broadcasting and radar all depended on many people agreeing on, or sharing, the same signal.
- 1859 | Westminster's Great Clock | built to a demanding specification
- 1876 | Bell's telephone patent | an easy device, a hard network
- 1884 | Greenwich chosen | the prime meridian
- 1895 | Australian time zones | eastern, central and western
- 1927 | First quartz clock | Bell Laboratories
- 1935 | Radar demonstrated | an aircraft detected by reflection
- *1967 | The second redefined | by the caesium atom
```

## Lessons for engineers and managers

### Agreement can matter more than accuracy

Standard time was valuable because everyone used it. In businesses, shared definitions, units, data formats and reference documents often create more value than more precise measurements used inconsistently.

### Isolate precision from disturbance

The gravity escapement kept the pendulum free from variations in the gears. Protect critical processes, measurements and people from upstream variation with buffers, regulators and clear interfaces.

### Watch how links grow

Direct connections grow roughly with the square of the number of participants. Teams, systems and supplier networks that connect everything to everything become unmanageable as they grow. Hubs, clear interfaces and defined channels play the role of the exchange. The [stop emailing, start communicating](/reados/collections/communication-and-professional-presence/stop-emailing-start-communicating/) article covers practical ways to keep communication manageable.

### Put complexity where there is one

When a product or system has one central element and many users, concentrate complexity in the centre and keep the many simple.

### Govern shared resources

Shared equipment, networks, budgets and facilities degrade when one user's behaviour harms others. Allocation rules and coordination are part of the engineering, not bureaucracy.

### Recognise inherent limits

Mechanical television could not be refined past its limits. When a method's limits are built into how it works, replace the method rather than improving it.

### Set thresholds deliberately

Every alarm, inspection and alert trades missed problems against false alarms. Choose thresholds based on the cost of each, and review them as conditions change. The [how quickly would you find out](/reados/collections/risk-controls-and-assurance/how-quickly-would-you-find-out/) article explains how to build monitoring with useful thresholds into decisions.

## A worked example

This is an illustrative example. A processing plant installed vibration sensors on 40 pumps, with alarms that trigger when vibration exceeds a fixed level. In the first months, the system produced about 25 alarms a week. Most were false, caused by start-ups, changes in flow and sensor faults, and operators began ignoring them. A pump bearing then failed without any action being taken, causing about $30,000 in repairs and lost production.

**Apply detection thinking.** The reliability engineer estimates that checking an alarm takes a technician about 30 minutes, costing about $75, while a missed bearing failure costs around $30,000. Missed failures are far more costly, but a system that produces so many false alarms that people ignore it misses failures too.

```figure
type: balance
title: The two costs of a detector
left: Checking a false alarm
right: Missing a real failure
tilt: right
caption: Misses cost far more, but a detector that cries wolf gets ignored and misses failures too.
- About $75 | About $30,000
- 30 minutes of a technician | A failed pump bearing
```

**Change the detector.** Instead of a single fixed threshold, alarms now require vibration to stay above an adjusted level for 30 minutes during steady running, ignore start-up periods and compare each pump with its own baseline. Sensor faults are reported separately as maintenance tasks, not as pump alarms.

**Result.** Alarms fall to about three a week, most of which reveal real developing problems, typically two or more weeks before failure. Operators trust the alarms and act on them. The engineer reviews thresholds quarterly against inspection findings. The [maintenance that prevents breakdowns](/reados/collections/lean-and-continuous-improvement/maintenance-that-prevents-breakdowns/) article explains how condition monitoring fits into a wider maintenance strategy.

```figure
type: compare
title: Vibration alarms on 40 pumps
cols: Fixed threshold | Baseline, steady running, 30 minutes
best: 2
caption: Sensor faults now go to maintenance as tasks, and thresholds are reviewed quarterly against inspections.
- Alarms | About 25 a week, mostly false | About 3 a week, mostly real
- Operators | Ignored them | Trust and act on them
- *Warning | A bearing failed unnoticed | Typically two or more weeks ahead
```

## Applying these lessons in an Australian business

- **Standardise shared references**, such as definitions, units, data formats and time.
- **Protect critical processes** from upstream variation.
- **Use hubs and defined channels** as teams and networks grow.
- **Concentrate complexity** where there is one central element.
- **Agree rules** for shared equipment and resources.
- **Replace methods** whose limits are inherent.
- **Set alarm thresholds** using the costs of misses and false alarms, and review them.

## Questions worth considering

- Which shared definitions or references do our teams use inconsistently?
- How many direct communication links does our team or supplier network now need?
- Where have we put complexity in many places that could sit in one?
- Which shared resources in our business lack clear rules?
- Do people trust our alarms and alerts, and how many are false?

## Bringing it together

Clocks, telephones, broadcasting, television and radar each began with a device and became valuable through the system around it. Standard time showed that agreement matters more than accuracy; the telephone exchange tamed the growth of direct links; broadcasting put complexity where there was one and needed governance of shared spectrum; television worked within the limits of bandwidth; and radar turned detection into a deliberate trade-off between misses and false alarms. For any business, the lessons are to share references, isolate precision, manage network growth, govern shared resources and set thresholds deliberately.

---

*Source: KEVOS® editorial notes, drawing on an earlier KEVOS® engineering history series on public timekeeping, telephony, broadcasting, television and radar, together with established histories of technology and Australian communications. The worked example is illustrative. This article is general information.*
