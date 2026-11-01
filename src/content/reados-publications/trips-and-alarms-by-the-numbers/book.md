---
title: "Trips and Alarms by the Numbers"
subtitle: "Setting thresholds on noisy plant signals: false trips, missed trips, filters, hysteresis, on-delays, drift, voting and proof"
description: "How to set trip and alarm thresholds on noisy signals: predict nuisance trips from the noise, then choose filters, deadbands, on-delays and voting, and prove the settings work."
category: Engineering
tags: [automation, systems, design, operations]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate controls, instrumentation and maintenance engineering"
audience: "Controls, instrumentation and maintenance engineers, PLC programmers and plant engineers who set, review or troubleshoot alarm and trip thresholds on pressures, levels, temperatures and flows."
outcomes:
  - "Measure the noise on a plant signal and express any threshold as a margin in standard deviations."
  - "Predict how often a noisy signal will cross a threshold, using Rice's formula and a mean-crossing rate counted from a log."
  - "Choose a filter time constant, deadband and on-delay from the noise, and calculate what each costs in response time."
  - "Recognise when the mean is drifting towards a trip, and detect the drift before nuisance trips begin."
  - "Compare voting arrangements for spurious trips and failures on demand, and prove new settings with a test plan and confidence bounds."
coverVariant: category
references:
  - title: "Stochastic Processes in Physics, Chemistry, and Biology"
    creator: "J. A. Freund and T. Pöschel (eds), Lecture Notes in Physics 557, Springer, Berlin (ISBN 3 540 41074 0)"
    year: "2000"
    note: "Supplied source, in copyright. Read only as a subject map: its chapters on stochastic resonance, noise-driven escape over a barrier and the scaling of noise identify the physics behind threshold detection in noise. No text, equations, figures, examples or exercises are reproduced or adapted; the engineering treatment, running case and numbers here are original."
  - title: "Mathematical analysis of random noise"
    creator: "S. O. Rice, Bell System Technical Journal, vol. 23, pp. 282–332, and vol. 24, pp. 46–156"
    year: "1944–1945"
    note: "Original source of the expected rate at which a Gaussian random signal crosses a level, used in Chapters 3, 4 and 6."
  - title: "Probability, Random Variables and Stochastic Processes, fourth edition"
    creator: "A. Papoulis and S. U. Pillai, McGraw-Hill, New York"
    year: "2002"
    note: "Standard text for Gaussian processes, autocorrelation, filtered noise and level crossings, used as background throughout."
  - title: "Stochastic resonance"
    creator: "L. Gammaitoni, P. Hänggi, P. Jung and F. Marchesoni, Reviews of Modern Physics, vol. 70, pp. 223–287"
    year: "1998"
    url: "https://doi.org/10.1103/RevModPhys.70.223"
    note: "Review of stochastic resonance, including threshold detectors, used for the background of Chapter 8. No figures or data are reproduced."
  - title: "Brownian motion in a field of force and the diffusion model of chemical reactions"
    creator: "H. A. Kramers, Physica, vol. 7, pp. 284–304"
    year: "1940"
    note: "Original paper on the escape rate over a barrier, mentioned in Chapter 3 as the physics counterpart of a signal leaving its normal band."
  - title: "Resolution below the least significant bit in digital systems with dither"
    creator: "J. Vanderkooy and S. P. Lipshitz, Journal of the Audio Engineering Society, vol. 32, pp. 106–113"
    year: "1984"
    note: "Background for dither in quantised measurements in Chapter 8."
  - title: "The Scientist and Engineer's Guide to Digital Signal Processing"
    creator: "S. W. Smith, California Technical Publishing"
    year: "1997"
    url: "https://www.dspguide.com/"
    note: "Public reference for single-pole recursive (first-order) filters and moving averages used in Chapter 4."
  - title: "Safety Instrumented Systems: Design, Analysis, and Justification, second edition"
    creator: "P. Gruhn and H. L. Cheddie, ISA, Research Triangle Park"
    year: "2006"
    note: "Background for the simplified spurious trip rate and average probability of failure on demand of voted arrangements in Chapter 9."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods"
    creator: "National Institute of Standards and Technology"
    year: "2012"
    url: "https://www.itl.nist.gov/div898/handbook/"
    note: "Public reference for the normal distribution, EWMA and CUSUM charts and confidence bounds on rates, used in Chapters 2, 4, 7 and 10."
  - title: "IEC 61508 and IEC 61511 (functional safety; adopted in Australia as AS 61508 and AS IEC 61511), and ANSI/ISA-18.2, IEC 62682 and EEMUA 191 (alarm management)"
    creator: "International Electrotechnical Commission; International Society of Automation; Engineering Equipment and Materials Users Association"
    year: "current editions"
    note: "Named by number and scope only in Chapters 5, 9 and 10. Nothing is quoted from them, and no target values from them are used."
  - title: "Safe Work Australia: guidance on managing risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "current"
    url: "https://www.safeworkaustralia.gov.au/"
    note: "The regulatory context for guarding and control systems on plant in Australia, referred to in the introduction and Chapter 9."
related:
  - title: "Random Error and Drift by the Numbers"
    href: "/reados/publications/random-error-and-drift-by-the-numbers/"
  - title: "Control Charts by the Numbers"
    href: "/reados/publications/control-charts-by-the-numbers/"
  - title: "Random Vibration by the Numbers"
    href: "/reados/publications/random-vibration-by-the-numbers/"
  - title: "Accept or Reject by the Numbers"
    href: "/reados/publications/accept-or-reject-by-the-numbers/"
  - title: "Simulating Noisy Systems by the Numbers"
    href: "/reados/publications/simulating-noisy-systems-by-the-numbers/"
---

## About this book

Every plant has thresholds on its signals. A low-pressure switch stops a machine when its cooling fails, a high-level alarm calls an operator before a tank overflows, a high-temperature trip cuts a heater before it damages the product. Each threshold is a small decision rule, and each one sits on a signal that is never perfectly steady. Pumps pulse, flows surge, sensors add their own noise. Set the threshold too close to the normal operating band and the noise will cross it, stopping production for nothing and teaching operators to ignore the alarm. Set it too far away, or bury it under heavy filtering and long delays, and it will respond too late to the fault it exists to catch.

This book shows how to set thresholds by calculation rather than by trial and error. It starts by measuring the noise on a signal and expressing any threshold as a margin in standard deviations. It then predicts how often a noisy signal will cross a level, using a formula that needs only two measured numbers. With that prediction in hand, it works through the usual remedies: filtering, hysteresis, on-delays, early warning of drift, and voting between redundant sensors. For each one it shows what it buys in fewer false trips and what it costs in slower response. The last chapter turns the chosen settings into a test plan and a record that can be audited.

It is written for controls, instrumentation and maintenance engineers, PLC programmers and plant engineers. It assumes algebra, logarithms, the normal distribution and the idea of a first-order lag. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional plant. This is an illustration. Plant C runs an aluminium high-pressure die-casting cell, DC-2, on two eight-hour shifts. The die is cooled by water from pump P-3, and the pump's discharge pressure is measured by transmitter PT-3 and scanned by the cell's PLC every 10 ms. A low-pressure alarm, PAL-3, is set at 3.6 bar. A low-low trip, PSLL-3, is set at 3.2 bar and stops the cell before the next shot. With a clean strainer the pressure averages 4.20 bar. If the pump stops, the pressure falls to about 0.6 bar within a second or two, and the die engineer requires the cell to be stopped within 3 s of the pump stopping.

After a finer strainer mesh was fitted to protect the die's cooling channels, the cell began to trip two or three times a shift for no apparent reason. Each nuisance trip scraps a casting and costs about 12 minutes of production. The plant's controls engineer is asked to stop the nuisance trips without weakening the protection.

The plant, its equipment and every pressure, rate, time and cost are invented. None describes KEVOS® work, a real company or a real supplier's product.

## How to use the book

Read Chapters 1 to 3 first: they set up the measurements and the crossing-rate formula that everything else uses. Chapters 4 to 6 deal with the three classic remedies, filters, hysteresis and on-delays, one at a time. Chapter 7 deals with a mean that drifts towards the threshold, and Chapter 8 with the cases where noise helps a threshold rather than hinders it. Chapter 9 covers voting between redundant sensors, and Chapter 10 the testing and records that prove the settings.

WORKOS tools are linked where they perform a step of the method, with a note of exactly what each one calculates and where its model stops. Where a tool solves a related problem rather than the chapter's own, the text says so.

## Source limits and professional responsibility

The methods here are the standard ones of random signal theory and reliability engineering: Gaussian noise, Rice's level-crossing formula, first-order filters and simplified voting equations. Each chapter states its assumptions, chiefly that the noise is roughly Gaussian and stationary over the period studied. Real signals often have heavier tails, and the book shows how to check.

This book is educational. Trips that protect people or plant from harm are safety functions, and in Australia their design, verification and changes are governed by work health and safety law, the plant risk management guidance of Safe Work Australia and the functional safety standards named in the references. Settings on a real safety function must be set, reviewed and approved by competent people under the plant's own management of change. Nothing in this book replaces that process.
