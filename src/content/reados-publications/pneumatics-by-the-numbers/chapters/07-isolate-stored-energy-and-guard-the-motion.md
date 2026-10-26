---
book: pneumatics-by-the-numbers
chapterSlug: isolate-stored-energy-and-guard-the-motion
order: 7
title: "Isolate stored energy and guard the motion"
description: "Manage pneumatic hazards: injurious forces, stored air that moves machines after power is off, guarding, lockable dump valves, verified isolation, hoses, blow guns and noise."
draft: false
---

Pneumatic machines look gentle. The cylinders are small, the pressures are modest, and nothing glows or sparks. That appearance is the hazard. A small cylinder at ordinary factory pressure pushes with the weight of a child, moves faster than a hand can be withdrawn, and can do so after the power has been switched off, because the energy that drives it is stored in the air, not in the wiring. Most pneumatic injuries happen during maintenance, cleaning and clearing jams, when someone reaches into a machine they believe is stopped.

This chapter makes the reject station safe to run and to work on. It puts numbers on the forces involved, lists the hazards, guards the pusher's travel and interlocks the access door, isolates the air with a lockable dump valve and verifies it, deals with trapped air, restores air safely, and covers hoses, blow guns and exhaust noise. The failure case is a near miss in which a colleague pressed a valve's manual override while a fitter's hand was inside the guard.

This chapter describes the approach the packing business took, as general information. Guarding, safety functions and isolation procedures for real machines must be designed and verified by a competent person under the work health and safety law that applies, which places duties on everyone who designs, supplies, installs, modifies or uses plant.

## Put numbers on the force

The pusher's 25 mm cylinder produces about **295 N** at 6 bar, roughly the weight of a 30 kg mass. Its plate moves 300 mm in about 0.3 s and arrives with more than a joule of kinetic energy. A hand between the plate and the chute's side would be struck and then squeezed with the cylinder's full force.

Larger cylinders are more serious still. A 63 mm bore clamp, common on fixtures and presses, produces about **1,870 N** at 6 bar, roughly the weight of a 190 kg mass, enough to crush fingers. The force does not depend on how fast the cylinder moves; a slow cylinder squeezes just as hard when it arrives. Calculating the force, as Chapter 2 did, is the first step in judging how serious each pinch point is.

```figure
type: bars
title: Theoretical extend force of common cylinder bores at 6 bar
unit: N
max: 2000
caption: This is an illustration using pressure × piston area. Force rises with the square of the bore, so a cylinder that looks only a little larger pushes far harder.
- 16 mm bore | 121
- *25 mm bore, the reject pusher | 295
- 40 mm bore | 754
- 63 mm bore | 1870
```

## List the hazards

The maintenance lead and the external machinery safety adviser listed the station's hazards before designing the guarding, following the approach in Safe Work Australia's model Code of Practice for managing the risks of plant.

```figure
type: checklist
title: Hazards identified at the reject station
caption: This is an illustration of the risk assessment's hazard list. Each was assessed and given controls; the guarding and isolation are described in this chapter.
- Crushing and impact between the pusher plate and the chute or a carton | guarded and interlocked
- Unexpected movement from stored air after electrical power is off | lockable dump valve and verified isolation
- Unexpected movement when air is restored | soft-start valve and a check that people are clear
- Operation by the valve's manual override, bypassing the controller | covered override, used only under the procedure
- Hose whip if a pressurised hose or fitting fails | short, clipped hoses and safety couplings
- Noise from exhausts | silencers, checked against exposure limits
- x Compressed air directed at skin or clothing | prohibited, with safety blow guns only
- ? Interaction with the conveyor and the line's other guards | reviewed with the line as a whole
```

## Guard the travel

The pusher's whole travel, and the gap between the plate and the chute, are enclosed by a fixed guard of welded mesh, with openings small enough and far enough from the hazard that fingers cannot reach the plate. The guard is fixed with fasteners that need a tool to remove, so it cannot be taken off casually. Cartons enter and leave through the conveyor's existing tunnel guards.

Jams happen, so operators need access. A hinged door in the guard gives access to the chute. The door is **interlocked**: opening it signals the safety controller, which removes power from the pusher's valve and, through a separate safety-rated dump valve in the station's supply, exhausts the station's air. With the door open, the pusher cannot be moved by the controller or by air pressure. The interlock is tested every week: with the line running, the door is opened, and the tester confirms that the line stops, the pusher cannot be fired and the station's gauge falls to zero. The result is recorded on the station's check sheet, and a failed test stops the line until the interlock is repaired.

How reliable that interlock must be is decided by a risk assessment, using standards such as the AS/NZS 4024.1 series for machinery safety and ISO 13849-1 for the safety-related parts of control systems. Those standards set out how to decide the required performance of a safety function and how to show a design achieves it. The packing business engaged the machinery safety adviser to do that work; it is a specialist task and this book does not attempt it.

## Isolate before working on the station

Interlocked doors protect operators clearing jams. They are not enough for maintenance, when a fitter may remove the guard, disconnect hoses or replace the cylinder. For that, the station must be **isolated**: separated from every energy source, with each isolation locked so it cannot be undone while someone is working.

```figure
type: steps
title: Isolating the reject station for maintenance
caption: This is an illustration of the station's isolation procedure. Each person working on the station fits their own lock to each isolation point and keeps the key.
- Stop | stop the line using the normal stop and tell the operators
- Isolate electricity | switch off and lock the station's electrical isolator
- Isolate air | close and lock the lockable isolating and dump valve, which also exhausts the station's air
- Verify | check the station's gauge reads zero and press the start button to confirm nothing moves
- Check for trapped energy | confirm no part is held by trapped air, springs or gravity
- *Work | carry out the task with locks in place
- Restore | remove tools, refit guards, check everyone is clear, then remove locks and restore air through the soft-start valve
```

The **lockable isolating and dump valve**, the first component in Chapter 4's circuit, does two things in one movement: it closes the supply and opens the station's side to exhaust, so the air downstream escapes through a silencer. It accepts personal padlocks, so several people can each lock it. A plain ball valve that only closes the supply would leave the station full of air.

**Verification** is the step most often skipped. A gauge on the station's side of the dump valve must read zero. The start button is pressed to confirm the controller cannot move anything. Only then is the station treated as safe.

## Look for trapped air

Exhausting the supply does not always exhaust the cylinder. Air can be trapped where a valve or fitting closes a path to exhaust: in a cylinder controlled by a closed-centre 5/3 valve, behind a pilot-operated check valve fitted to hold a load, or in a section of circuit isolated by a manual valve. Trapped air keeps a cylinder pressurised, and undoing a fitting or operating a valve can release it suddenly.

The reject station's 5/2 spring-return valve connects one side of the cylinder to the exhausted supply and the other to the valve's exhaust port, so both sides fall to zero when the supply is dumped. The isolation procedure still includes a check, because circuits change over time. On machines where air can be trapped by design, the circuit drawing marks each point, and the procedure lists how to release it, through a manual exhaust valve or a gauge port, before work starts.

Gravity and springs are the other stored energies to consider. The pusher moves horizontally and has no springs, so neither applies. A vertical cylinder supporting a weight, or a spring-return cylinder held compressed, needs the load supported or the spring released before work.

## Restore the air safely

Restoring air is a moment of risk, because the machine can move. The soft-start valve described in Chapter 4 lets pressure build over a couple of seconds, so any movement, such as the pusher retracting from wherever it was left, is slow. Before restoring, the person in charge checks that tools and people are clear of every moving part and that the guard and door are back in place.

## Hoses, couplings and blow guns

A pressurised hose that comes off its fitting can whip violently, and the larger the hose and the pressure, the worse it is. The station's hoses are short, clipped along their length and fitted with push-in fittings rated for the pressure. The drop's quick coupling is a **safety coupling**, which vents the downstream air before the plug can be released, so a hose cannot be pulled off under pressure and whip.

Compressed air must never be directed at the body. Air can enter the skin through small wounds or directly at close range, and blowing dust off clothing drives particles into eyes and lungs. The factory's blow guns have safety nozzles designed to limit the pressure if the nozzle is blocked against the skin, and the business's rule prohibits blowing down clothing or skin. As Chapter 5 described, a vacuum cleaner replaced the blow gun for floor cleaning.

## Silence the exhausts

Each stroke releases a short burst of air through the valve's exhaust, a sharp crack if unsilenced. Across a factory full of valves, exhaust noise adds significantly to the noise people are exposed to. The model work health and safety regulations set an exposure standard for noise of an eight-hour equivalent level of **85 dB(A)** and a peak of **140 dB(C)**. The packing business measured noise at the operators' positions on line 2 before and after the station was installed, as part of its noise assessment. The station's silenced exhausts made no measurable difference to the operators' exposure; the line's existing noise came mainly from the sealer and the conveyor.

## Train people in what the air can do

Procedures work only when people understand why they exist. Every operator on line 2 was shown, with the guard closed, how fast the pusher moves and how hard it pushes, by letting it strike a carton filled with packing foam that it visibly crushed. Maintenance staff were trained on the isolation procedure at the station itself, each one carrying it out while a supervisor watched, before working on the station alone. The training record lists who has done it, and new starters do it in their first week. A short laminated version of the isolation steps is fixed beside the dump valve, where it is read at the moment it matters.

## A failure case: the override and the hand

This is an illustration. Five months after commissioning, a fitter was replacing a worn bolt on the pusher plate. The fitter switched off and locked the station's electrical isolator, and removed the fixed guard. With the power off, the pusher was retracted and still, and the fitter assumed it could not move. The air was still on.

A colleague, fault-finding a separate problem with the chute's photo-eye, arrived at the station, saw the pusher and wanted to check whether the chute eye responded to the plate. The colleague lifted the valve's cover and pressed the manual override. The plate extended its full 300 mm with about 295 N of force, past where the fitter's hand had been a moment before.

Nobody was hurt. The fitter reported it as a near miss, and the investigation found three gaps. Electrical isolation alone had been treated as making the station safe, although the pusher's energy was in the air. The manual override bypassed every electrical isolation and interlock, by design. And two people were working on the same machine without knowing what the other was doing.

The detection came from the near-miss report, which the business had encouraged since the project began. The correction was a revised procedure, set out above, which isolates both electricity and air, each with personal locks, and verifies both. The dump valve now carries a tag explaining that the station holds air after electrical isolation. Every maintenance task on the line starts with a short conversation between everyone working on it. And a warning label on the valve cover states that the override moves the pusher regardless of the electrical isolation.

## How this applies to a small Australian business

Small factories often treat pneumatic machines as low-risk because the components are small. Calculate the forces at each pinch point; they are larger than they look. Guard the motion and interlock the access needed for jams. For maintenance, isolate the air as well as the electricity, with a lockable dump valve that exhausts the machine, and verify that the gauge reads zero before anyone reaches in. Look for air trapped by valves and check valves, and for gravity and springs. Restore air through a soft-start valve after checking everyone is clear. Use safety couplings and safety blow guns, never blow air at people, and silence exhausts. Encourage near-miss reports: they are the cheapest warnings a business will ever get. And bring in a competent person for guarding and safety functions, because those are specialist judgements with legal duties attached.

## Exercise: the forces behind the guard

The workshop has a fixture with two **63 mm** bore clamp cylinders, supplied at 6 bar. What force does each produce, and roughly what mass would weigh the same? If the fixture's regulator were turned down to **4 bar**, what force would each produce, and would that remove the need for guarding?

**Worked answer.** The piston area is about **π × 63² ÷ 4 ≈ 3,117 mm²**. At 6 bar, or 0.6 MPa, each clamp produces about **3,117 × 0.6 ≈ 1,870 N**, the weight of about **190 kg**. At 4 bar, each produces about **3,117 × 0.4 ≈ 1,250 N**, the weight of about 127 kg. That is still far more than enough to crush a finger, so reducing the pressure does not remove the need for guarding or for safe access. Lowering pressure can reduce severity in some designs, but the choice of controls belongs in the risk assessment, made by a competent person, not in a regulator adjustment.
