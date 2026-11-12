---
book: industrial-hydraulics-by-the-numbers
chapterSlug: hold-the-load-and-control-stored-energy
order: 7
title: "Hold the load and control stored energy"
description: "Find the stored energy in a hydraulic press, hold a vertical platen with a counterbalance valve, test an accumulator for a faster approach against regeneration, and isolate the press safely."
draft: false
---

A hydraulic press that has been switched off is not necessarily safe. Its platen is heavy and hangs above the bed. Its cylinder and lines may hold oil under pressure. If it has an accumulator, a vessel of compressed nitrogen is waiting to push oil out the moment a valve opens. Each of these is stored energy, and each has injured people who assumed a machine with its motor stopped could not move.

This chapter lists the press's stored energy and puts numbers on it, holds the platen against gravity, and answers a request from the owner for a faster approach. The obvious answer, an accumulator, turns out to add heat, cost and a pressure vessel to look after. A different circuit gives most of the speed with none of the stored energy. The chapter ends with how the press is isolated for maintenance, and the failure case is a near miss during a hose change.

## The press's stored energy

```figure
type: bars
title: Stored energy in the press, with the platen at the top and the cylinder pressurised
unit: J
max: 600
caption: This is an illustration. Gravity: 180 kg raised 300 mm. Compressed oil: about 4.7 L of oil in the cap end and its line at 175 bar, with an assumed bulk modulus of 1.5 GPa, typical of mineral oil. Tie rods: four rods each stretched 0.342 mm at 53.7 kN. An accumulator, if fitted, would add tens of kilojoules.
- Platen and tooling, by gravity | 530
- *Oil compressed at 175 bar | 480
- Tie rods, elastic stretch | 37
```

Two numbers stand out. The raised platen stores about **530 J**, which is the energy of a 180 kg mass falling 300 mm; enough to crush a hand. The compressed oil stores about **480 J**: oil is not quite incompressible, and at 175 bar a few litres of it behave like a stiff spring. That energy is released in a fraction of a second when a fitting is cracked open, as a jet capable of penetrating skin. The tie rods' stretch is small by comparison.

Compressed oil is easy to forget because it does nothing visible. A gauge reading of zero at the pump says nothing about oil trapped between a closed valve and the cylinder. That is why the isolation procedure later in this chapter reads pressure at the cylinder ports themselves.

## Holding the platen

The platen and its tooling weigh about 180 kg, which is 1.77 kN. On the rod end's 8,423.4 mm² annulus, that weight holds the rod-end oil at about **2.1 bar**. If anything lets that oil out, the platen falls.

The directional valve's tandem centre blocks both cylinder ports, but a spool valve is not leak-tight; oil passes slowly between the spool and its bore. A platen held only by the spool would creep down. The press therefore has a **counterbalance valve** on the rod-end line: a pressure-controlled valve that stays shut until the pressure in the rod end exceeds its setting, and opens in proportion as pressure rises. It is mounted directly on the cylinder's rod-end port, so that a burst hose upstream of it cannot release the platen.

This is an illustration. The valve is set at **10 bar**, about five times the pressure the platen's weight produces, which leaves room for heavier tooling. To lower the platen, the pump must push on the cap end until the rod end reaches 10 bar. Ignoring the valve's pilot assistance and friction, the cap pressure needed is (1.0 MPa × 8,423.4 mm² − 1,766 N) ÷ 12,271.8 mm², about **5.4 bar**, which is consistent with the approach pressure of about 8 bar assumed in Chapter 4. Because the counterbalance valve holds back pressure on the rod end during the approach, the platen cannot run ahead of the oil supply: it is the same principle as meter-out speed control, used here to hold a load safely, with a setting low enough that intensification is not a concern.

A pilot-operated check valve is an alternative that holds the load without leakage, but it can let the load drop in jerks when lowering. For a press, the counterbalance valve's smoother control was preferred.

## A faster approach

After three months of the contract job, the owner asked whether the approach could be faster. It takes **4.97 s** of each 43.5 s cycle. Cutting it to 2 s would save about 3 s per part, about 3 hours over a 4,000-part batch.

The first idea, from a supplier, was an accumulator: a vessel with nitrogen on one side of a bladder or piston and oil on the other, charged by the pump during the idle time and released to boost flow during the approach.

### Testing the accumulator idea

The [Accumulator Circuit Sizing tool](/tools/accumulator-circuit-sizing/) takes the cylinder bore and stroke, the number of cylinders moving together, the stroke time wanted, the pump flow, the time available to recharge, the precharge, minimum and maximum working pressures, a polytropic exponent for how fast the gas is compressed and expanded, and the size of accumulator installed or offered. It returns the stroke volume, the flow needed for the stroke time, what the pump supplies in that time, the deficit the accumulator must deliver, the gas volume needed, and the recharge time at pump flow, with checks of size, recharge and precharge.

A detail of the two-pump unit matters here. The accumulator must work between about 100 and 175 bar to store a useful volume in a reasonable size. At those pressures, the unloading valve, set at 40 bar, unloads the large pump. During an accumulator-assisted approach, the pumps supply only the small pump's **8 L/min**, not 40.

```figure
type: compare
title: Accumulator Circuit Sizing for a 2 s approach of 270 mm
cols: Tool result | What it means
caption: This is an illustration. Inputs: 125 mm bore, 270 mm stroke, one cylinder, 2 s, pump flow 8 L/min (the small pump, because the large one unloads above 40 bar), 30 s to recharge, precharge 90 bar, working pressures 100 and 175 bar, exponent 1.4 for a fast stroke, 10 L accumulator offered.
- Stroke volume | 3.313 L | the cap end's volume over 270 mm
- Flow needed for 2 s | 99.4 L/min | two and a half times the pumps' combined flow
- Pump delivers in 2 s | 0.267 L | the small pump only
- Accumulator must deliver | 3.047 L | the deficit
- *Gas volume needed | 10.02 L | the 10 L offered just fails
- Recharge time at 8 L/min | 22.9 s | inside the 30 s idle, but leaves little margin
```

The tool reports **ACCUMULATOR NOT ADEQUATE**: the 10 L unit falls just short, so a larger one would be needed. The numbers say more than the verdict.

- **Heat.** Each approach takes about 3 L of oil out of the accumulator at an average of roughly 137 bar, about 42 kJ of hydraulic energy, and throttles it down to the approach pressure of about 8 bar. Nearly all of it becomes heat. The small pump then has to put it back, at about 42 ÷ 0.828, roughly **51 kJ** of shaft energy per cycle, more than the whole present cycle's 29.2 kJ. Chapter 6's oil temperature problem would return at once, at about three times the size.
- **Stored energy.** A charged accumulator holds energy whenever the press is stopped, unless it is discharged. AS 2671:2021 has a section on systems with gas-loaded accumulators, including warning labels and maintenance information; a real installation needs an automatic discharge valve, a means of isolating the accumulator, and regular precharge checks. Depending on its size and pressure, a pressure vessel may also bring design or item registration duties under the work health and safety regulations; the regulator in each state can say which apply.
- **Temperature.** The exercise shows how a hot day can make a precharge set in the morning useless by the afternoon.

The accumulator would work, after a fashion, but it would make the press hotter, more expensive and more hazardous.

### Regeneration instead

A regenerative circuit gets speed from the cylinder's own geometry. During the approach, oil leaving the rod end is sent not to the tank but round to the cap end, where it joins the pump flow. The net oil the pumps must supply is only the volume the rod displaces as it extends, so the speed becomes the pump flow divided by the **rod's** area, not the full bore's.

- regenerative speed = 666,700 mm³/s ÷ 3,848.5 mm² = **173.2 mm/s**
- force available = pressure × rod area; at the 40 bar unloading setting, 4 MPa × 3,848.5 mm² = **15.4 kN**, ample to move the platen but not to press.

The press therefore regenerates for the first **250 mm** of the approach, then a position sensor switches the circuit back to the normal full-bore connection for the last 20 mm before contact, so that the platen meets the work at the normal 54.3 mm/s and the full force is available. The approach then takes 250 ÷ 173.2 + 20 ÷ 54.3, about **1.81 s**, saving about **3.16 s** per cycle and cutting the cycle to about 40.3 s. The moving parts at 173 mm/s carry 0.5 × 180 × 0.1732², about **2.7 J**, still small.

There is no stored energy, no added heat beyond a little extra valve loss, and one extra valve. The counterbalance valve still holds the platen, and the circuit designer checks the counterbalance and regeneration valves together so that one does not defeat the other.

The faster platen is a guarding question. A platen moving at 173 mm/s covers the gap to a hand faster, so the stopping performance of the press's guarding and controls must be checked against the new speed. The press's interlocked guard and two-hand control were reassessed by the person who designed them before the change was switched on.

### A larger low-pressure pump

A third option was simply a bigger large pump. Replacing the 32 L/min pump with a 60 L/min one gives 68 L/min on the approach, a speed of about 92.4 mm/s and an approach of about **2.92 s**. It looks straightforward, but every flow in the system grows with it. The motor's highest power point becomes 68 L/min at 40 bar, about 4.53 kW hydraulic and **5.48 kW** at the shaft, beyond the 4 kW motor. The return stroke speeds up to about 134.5 mm/s, and the cap end empties at about **99.1 L/min**, overwhelming the cap line, return line and return filter sized in Chapters 5 and 8. A bigger pump would have meant a new motor, new lines and a new filter for a smaller saving than regeneration gives. It was rejected for the same reason the 90 mm rod was in Chapter 2: a change to one flow is a change to the whole circuit.

## Isolating the press

The press's maintenance procedure follows the steps in the plant code of practice: identify every energy source, including gravity and stored pressure; isolate; de-energise or control stored energy; lock out; and verify that the machine cannot move.

```figure
type: steps
title: Isolating the press for work on its hydraulics
caption: This is an illustration of the press's own procedure. It is not a substitute for a procedure written for a real machine by competent people.
- Lower | lower the platen onto two steel blocks on the bed, or fit the locking pins at the top position
- Stop and isolate | stop the motor and lock the main electrical isolator; tag it
- Relieve | open the bleed valves at the cap-end and rod-end test points into a container
- * Verify | read zero on gauges fitted at both cylinder ports, not just the pump gauge
- Test | try the controls; nothing must move
- Work | crack fittings slowly with a rag over them, face away, wear eye and hand protection
```

## A failure case: the hose that held the platen

This is an illustration. Six months in, a technician was asked to replace a chafed hose between the power unit and the press. The platen was at the top of its stroke, because that gave the best access. The technician stopped the motor and locked the isolator, then began to loosen the rod-end line at the cylinder, below the counterbalance valve, because the hose fitting there was hard to reach from above.

As the fitting loosened, oil wept out and the platen began to move. It dropped about 40 mm before the technician retightened the fitting. Nobody was under it. The near miss was reported the same day.

The technician had isolated the electrical energy and had assumed that, with the pump stopped, the hydraulic energy was gone. The platen's weight was still stored, held only by the oil in the rod end. Loosening a fitting on the cylinder side of the counterbalance valve bypassed it.

The detection was the near-miss report and an honest account of what happened. The correction had three parts: mechanical locking pins at the top of the stroke, which take the platen's weight on steel rather than oil; the procedure above, with the lowering and verification steps first; and labelled bleed points with gauges at both cylinder ports, so that "zero pressure" is read where it matters.

If oil ever does break the skin, treat it as a medical emergency. Queensland's mine safety regulator notes that the severity of high-pressure fluid injection injuries is often underestimated and advises planning on hospital admission as the minimum outcome of a suspected injection. The injury can look like a small puncture while the oil spreads under the skin.

## How this applies to a small Australian business

List every form of stored energy on a hydraulic machine and put a number on each, including gravity and compressed oil. Hold vertical loads with a counterbalance or load-holding valve mounted on the cylinder, not with the directional valve. Before adding an accumulator for speed, test the idea for heat, cost and the duties it brings, and look at regeneration or a larger low-pressure pump first. Write an isolation procedure that lowers or blocks loads before anything is loosened, and verify zero pressure at the cylinder itself.

## Exercise: a precharge on a hot afternoon

Suppose the accumulator had been fitted after all. It was precharged to **90 bar** gauge at **20 °C** one morning, and by mid-afternoon the oil and the accumulator body are at **60 °C**. Using absolute pressures and temperatures, with atmospheric pressure at 1.013 bar, what is the precharge at 60 °C? What does that mean for an accumulator meant to work down to a minimum of **100 bar**?

**Worked answer.** At constant gas volume, absolute pressure is proportional to absolute temperature. The precharge is 90 + 1.013 = 91.013 bar absolute at 293.15 K. At 333.15 K it becomes 91.013 × 333.15 ÷ 293.15, about **103.4 bar absolute**, or about **102.4 bar** gauge. The precharge is now above the 100 bar minimum working pressure, so as the system pressure falls towards 100 bar during the stroke the bladder closes on the outlet before the oil has been delivered. The [Accumulator Circuit Sizing tool](/tools/accumulator-circuit-sizing/) refuses such inputs, because it requires the precharge to be below the minimum working pressure. Accumulator makers' guides deal with this by setting the precharge for the operating temperature, which on a press that heats up during the day is another reason to avoid an accumulator where a simpler circuit will do.
