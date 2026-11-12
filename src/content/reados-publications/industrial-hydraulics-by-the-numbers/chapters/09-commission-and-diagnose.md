---
book: industrial-hydraulics-by-the-numbers
chapterSlug: commission-maintain-and-diagnose-the-press
order: 9
title: "Commission, maintain and diagnose the press"
description: "Commission a hydraulic press against its design numbers, record a baseline of settings, times, pressures and temperatures, maintain it on a schedule, and diagnose faults by comparing measurements."
draft: false
---

A hydraulic system's design is a set of predictions: this force at that pressure, this speed from that flow, this temperature at that duty. Commissioning is where the predictions are tested and the actual figures are written down. Those written figures become the baseline for the rest of the machine's life, because most hydraulic faults show up first as a change from the baseline, long before anything breaks. A workshop that never measured its press when it was new has nothing to compare it with when it starts to misbehave.

This chapter commissions the press against the numbers from Chapters 1 to 8, records its baseline, sets a maintenance schedule, and then uses the baseline to diagnose a slow approach. The diagnosis is the failure case: a valve adjusted by someone chasing a different problem.

## Before the first start

The first minutes of a new hydraulic system are when it is most at risk. The oil may be dirty from assembly, the pumps may be dry, air fills the cylinder and lines, and every valve setting is whatever the factory left.

```figure
type: steps
title: First start of the press
caption: This is an illustration of the press's own procedure, written with the component makers' instructions. A real machine follows its own makers' instructions and the commissioning plan of the people who designed it.
- Flush | circulate oil through a filter cart and temporary hoses until a sample meets 18/16/13, with the cylinder bypassed
- Fill | fill the reservoir through the filter cart; fill the pump inlets as the pump maker directs
- Low settings | back the relief valve right off and set the unloading valve low, so the first start makes little pressure
- Rotation | jog the motor to confirm the pumps turn the right way
- Bleed | cycle the cylinder slowly at low pressure over short strokes, then full strokes, with the bleed points cracked, until no air comes out
- * Set | raise the relief to 175 bar and the unloading valve to 40 bar on calibrated gauges; set the counterbalance at 10 bar and the rod-side relief below the rod components' rating; lock and record each setting
```

The cylinder is bypassed during flushing for a reason. New tube, fittings and valves carry swarf, sealant and scale from their manufacture, and the first oil through a circuit picks them up. Flushing with temporary hoses around the cylinder keeps that debris out of the cylinder's seals and the narrow clearances of the piston, and lets the filter cart catch it. Flushing continues until a sample meets the target code, not for a fixed time, because how long it takes depends on how clean the parts were when they arrived.

Setting pressures against a gauge, rather than by counting turns, matters. Two relief valves of the same model can differ by tens of bar at the same number of turns. Each adjustment is made with the gauge connected at the test point nearest the component being set, the press empty, and nobody between the platen and the bed.

AS 2671:2021 includes a section on verifying safety requirements and acceptance testing for hydraulic systems; the people commissioning a real machine work through it as part of their plan.

## Test against the design numbers

With the settings made, the press is run against each prediction from the earlier chapters. This is an illustration, and the results are the press's commissioning record.

```figure
type: compare
title: Commissioning results against the design numbers
cols: Design | Measured | Comment
caption: This is an illustration. Times are from the controller's log, averaged over 20 cycles with warm oil. The force was measured with a calibrated load cell on the bed.
- Approach time, 270 mm | 4.97 s | 5.1 s | about 39 L/min, a few per cent below the nominal pump flow
- Pressing time, 30 mm | 2.76 s | 2.9 s | consistent with slight leakage in the small pump
- Return time, 300 mm | 3.79 s | 3.9 s | as expected
- *Force at 163 bar on the main gauge | about 201.8 kN including the platen's weight | 197 kN | about 4.8 kN lost to seal friction
- Rod-side pressure during a press stroke | low | 3 bar | no intensification
- Platen drift in 10 min, motor off | under 1 mm | 0.4 mm | about 3.4 mL leakage past the counterbalance and seals
- Tank temperature after 2 hours on the contract cycle, 24 °C day | well under 60 °C | 46 °C | consistent with Chapter 6
- Oil cleanliness after commissioning | 18/16/13 or cleaner | 17/14/11 | after flushing and filtering
```

### Test points and gauges

None of these results can be measured without places to measure them. The press has quick-connect test points, each with a captive cap and a label, at five locations: the pump outlet, the cap-end port, the rod-end port, the unloading valve's pilot line and the inlet of the return filter. A technician can connect a gauge or a pressure transducer to any of them with the press running, without cracking a fitting.

Gauges are chosen so the readings of interest fall in the middle of the scale, where a gauge is most accurate. A 0 to 250 bar gauge suits the 175 bar points; a 0 to 16 bar gauge is needed to read the 8 bar approach pressure or the 3 bar rod-side reading with any confidence, and must never be connected to a point that can reach full pressure. The workshop's gauges are calibrated each year, and the calibration date is written on each.

### Reading the results

**Times.** All three strokes are a little slower than the design figures. The approach at 5.1 s means about 270 ÷ 5.1 × 12,271.8 mm², about **39.0 L/min**, against the nominal 40. Pumps rarely deliver exactly their nominal flow, and the efficiencies used in the design were estimates. A difference of a few per cent is normal and becomes part of the baseline.

**Force.** At 163 bar the cylinder's pressure force is 200 kN, and the platen's weight adds 1.77 kN in the same direction on a downward-acting press, so about **201.8 kN** is expected without friction. The load cell read **197 kN**. The difference, about 4.8 kN or 2.4%, is the friction of the piston and rod seals and the platen guides. It is a useful figure to keep: the gauge on this press reads about 2% high as a force indicator, and a force table on the press now converts gauge pressure to measured force.

**Rod-side pressure.** The gauge on the rod-side test point read about 3 bar during a full-force press stroke, which confirms that the meter-out mistake of Chapter 4 is gone and that the counterbalance valve is behaving.

**Drift.** With the platen held at mid-stroke and the motor off, it fell **0.4 mm** in 10 minutes. On the 8,423.4 mm² annulus, that is about 3.37 mL of oil leaking out of the rod end, past the counterbalance valve and the piston seal, in 10 minutes. The workshop set its own limit at 1 mm in 10 minutes for this press. Drift is a rate that tends to rise as seals and valve seats wear, so the test is repeated on a schedule.

**Temperature.** The tank temperatures were recorded together with an infrared survey of the pumps, relief valve, directional valve and cooler, as suggested in Chapter 6.

## Maintain to a schedule

The press's maintenance schedule follows from the chapters before. Each task has a reason and a number to record.

```figure
type: checklist
title: The press's maintenance schedule
caption: This is an illustration. Intervals were set for single-shift use and are reviewed after each oil sample. The open item was added after the failure case below.
- x Daily | oil level, tank temperature, filter indicator, visible leaks, guards and two-hand control working
- x Weekly | inspect hoses for chafing, bulges and weeping at fittings; check hose sleeves and restraints
- x Every three months | oil sample from the return-line sampling valve; trend the ISO 4406 code, water and condition
- x Every six months | drift test; rod-side pressure reading during a press stroke; infrared survey against the baseline
- x Every year | relief, unloading, counterbalance and rod-side relief settings checked on calibrated gauges; load-cell force check; hose replacement review
- ? After any adjustment to a pressure setting | record the new setting and the reason, and re-seal the adjuster
```

### Hoses

Hoses deserve their own line in the schedule because they age even when nothing seems wrong. Rubber hardens with heat and time, reinforcement wires fatigue where a hose flexes at its fitting, and abrasion wears through covers from the outside. [Hydraulic fittings and hose assemblies](/reados/collections/machine-elements-and-mechanical-design/hydraulic-fittings-and-hose-assemblies/) describes what to look for and when to replace. A hose is never checked for leaks by running a hand along it under pressure: a pinhole leak at 175 bar can inject oil through skin. A piece of cardboard held near the suspected leak shows the spray safely.

### Records that make diagnosis possible

A baseline is only useful if it can be found. The press carries a data plate with its rated force, relief setting, unloading setting, counterbalance setting and rod-side relief setting, its oil grade and its return filter element. Beside it, in a sleeve on the guard, is the current circuit drawing, updated whenever a valve is changed, and the force table from the load-cell check. The commissioning record, the maintenance log and the oil sample results are kept together, so the person diagnosing a fault at seven in the morning can compare today's numbers with the ones taken when the press was new.

The controller also helps. It logs the approach, pressing and return times of every cycle and, since the failure case below, raises an alarm when any of them averages more than 10% above its commissioning value over an hour. For the approach, that threshold is 5.1 × 1.1, about 5.6 s.

### Air in the oil

Air is the other common cause of a press that behaves oddly while every setting is correct. Oil with entrained air is spongy: the platen moves in small jerks, the pressure takes longer to build, the pumps are louder, and the oil in the tank looks milky or carries foam. Air gets in at a suction fitting that is slightly loose, because the suction line is below atmospheric pressure and draws air in rather than leaking oil out; through a return line that discharges above the oil surface and splashes; or through a cylinder that was never bled properly. The checks are simple. Look at the oil in the tank after a few minutes' running. Pour a little oil on each suction fitting while the pumps run: if the noise changes, that fitting is drawing air. Confirm that the return line ends well below the lowest oil level, which on this press is the level with the cylinder fully extended and 1.15 L of oil in the rod's place. Air that has been cured leaves the oil within a few hours in a reservoir with a baffle; air that keeps coming back has a source that has not been found.

## Diagnose from the baseline

Hydraulic faults are easier to find when the question is "what has changed?" rather than "what is wrong?". The baseline answers the first question with numbers. Two simple rules from earlier chapters narrow the search quickly.

- **Speed is flow.** A stroke that has slowed means less oil is reaching that side of the cylinder, or more is leaking past the piston. Which stroke slowed points to which pump or valve.
- **Force is pressure.** A press that has lost force has lost pressure, at the relief valve, at a leak, or through a pump that can no longer reach the setting.

```figure
type: decision
title: First step in diagnosing the press from its baseline
question: Which measurement has changed?
caption: This is an illustration for this press's two-pump circuit. Each branch names the first thing to check, not the only possible cause.
- Approach slower, pressing normal | the large pump or the unloading valve | read approach pressure; check the unloading valve's setting
- Pressing slower, approach normal | the small pump or the check valve between the pumps | check the small pump's flow; check the check valve for leakage
- *All strokes slower, oil hot | thin oil and internal leakage | check tank temperature, cooler and oil viscosity
- Force low at the normal gauge reading | seal friction or a gauge fault | load-cell check; compare with the commissioning force table
- Platen drifts faster | counterbalance valve or piston seal | repeat the drift test; isolate the counterbalance by test
```

## A failure case: the slow approach

This is an illustration. Ten months after commissioning, the controller's log showed that the approach had slowed from 5.1 s to **6.4 s** over about two weeks. The pressing and return times were unchanged. The operator had not noticed, because a second and a half spread over a 43 s cycle is easy to miss. At that time the controller logged the times but raised no alarm.

The slow approach cost more than it seemed. An extra 1.3 s on each of about 80 cycles an hour is about 14 minutes a shift, and over two weeks of single shifts about 2.3 hours of press time on the contract.

The baseline made the diagnosis quick.

1. **What changed?** Only the approach, which needs both pumps. Pressing, which uses only the small pump, was normal. That pointed to the large pump or the unloading valve, by the decision table above.
2. **How much flow is missing?** An approach of 270 mm in 6.4 s is 42.2 mm/s, which on the full bore is about **31.1 L/min**, against 39.0 L/min at commissioning. Roughly **8 to 9 L/min** of the large pump's flow was not reaching the cylinder.
3. **Where is it going?** The approach pressure, read at the cap-end test point, was 8 bar, as at commissioning. A gauge on the unloading valve's pilot showed it beginning to open at about **9 bar**, not 40. At 8 bar it was already passing part of the large pump's flow to the tank.

The unloading valve's lock-wire had been cut. The maintenance log had no entry, but a technician remembered turning it down weeks earlier while trying to quieten a whine from the power unit on cold mornings. Lowering the unloading setting had indeed quietened the pumps, by unloading the large pump earlier, and it had also slowed every approach since.

The correction was to reset the unloading valve to 40 bar on a calibrated gauge, re-wire and seal it, and record the change. The approach returned to 5.1 s. The cold-morning whine was then investigated properly: it came from the suction strainer, which was partly blocked and starving the pumps when the oil was thick, and was cured by cleaning it. The new line in the maintenance schedule, the open item above, makes any pressure adjustment a recorded event.

## How this applies to a small Australian business

Commission against the design numbers and write the results down: settings, stroke times, pressures at the test points, force, drift, temperatures and an oil code. Seal and record every pressure setting, because an unrecorded adjustment is the commonest cause of a hydraulic fault that seems to have no cause. Log stroke times if the controller can, because they are free data and they change before anything fails. Diagnose by asking what has changed, using speed for flow and force for pressure. And keep hands away from pressurised leaks.

## Exercise: a drifting platen

At the one-year service, the drift test shows the platen falling **3 mm** in 10 minutes with the motor off, against 0.4 mm at commissioning and a limit of 1 mm. How much oil is leaking from the rod end in that time, and at what rate? The technician then closes a test valve between the counterbalance valve and the directional valve, and the drift stays at 3 mm in 10 minutes. What does that suggest?

**Worked answer.** The leakage is 3 mm × 8,423.4 mm², about **25.3 mL** in 10 minutes, or about **2.5 mL/min**, more than seven times the commissioning figure of about 3.4 mL. Closing the test valve stops any leakage through the counterbalance valve's outlet path. Because the drift did not change, the oil is not escaping through the counterbalance valve; the most likely path is past the piston seal, from the rod end into the cap end. The next step is a piston seal bypass test as the cylinder maker describes, with the platen supported mechanically, and a seal kit if it confirms the leak. The platen must be held on its locking pins, not by the oil, until the cylinder is repaired.
