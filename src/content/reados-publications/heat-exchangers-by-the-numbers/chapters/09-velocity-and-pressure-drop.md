---
book: heat-exchangers-by-the-numbers
chapterSlug: velocity-and-pressure-drop
order: 9
title: "Velocity, pressure drop and pumping"
description: "Weigh velocity against pressure drop: how coefficients and losses scale, a tube side's friction and return losses, the pump that supplies them, and catch eight passes the pump could not feed."
draft: false
---

Every way of raising a film coefficient raises the pressure drop faster. In turbulent tube flow, the coefficient grows with velocity to about the power 0.8, while the friction pressure drop grows to about the power 1.75 to 2. Doubling the velocity therefore improves the film by about 74% and multiplies the pressure drop by about three and a half, and the pumping power, pressure drop times flow, by about seven. Somewhere there is a velocity where the extra heat transfer stops being worth the extra pumping, and, more often in practice, there is a pump that simply cannot supply the pressure drop a high-velocity design demands.

This chapter shows how coefficients and pressure drops scale with velocity, estimates OC-35's tube-side pressure drop from friction and the losses in its pass turns, connects the exchanger to the pump that serves it, and discusses the shell side and the oil circuit. The running case finds that a proposal to raise OC-35's water-side coefficient by doubling its tube passes from four to eight would have raised the tube-side pressure drop about sevenfold, beyond what the shared tower pump could supply, so that the water flow would have halved and the oil would have run hotter than before.

## How the two scale

For turbulent flow in a tube, the film coefficient follows the correlation of Chapter 5, h ∝ v^0.8. The friction pressure drop along a tube follows the Darcy equation, Δp = f × (L ÷ D) × ρv² ÷ 2, and for smooth tubes at moderate Reynolds numbers, the friction factor itself falls slowly with velocity, roughly f ∝ Re^(−0.25), so that Δp ∝ v^1.75.

```figure
type: line
title: Film coefficient and pressure drop relative to their design values, by velocity
x: Velocity relative to design
y: Ratio to the design value
legend: Film coefficient, ∝ v^0.8 | Friction pressure drop, ∝ v^1.75
ymin: 0
ymax: 3.5
caption: These ratios follow from the turbulent correlations above. Halving the velocity loses about 43% of the film coefficient but saves about 70% of the pressure drop; doubling it gains about 74% and costs about 236%.
- 0.5 | 0.57 | 0.30
- 0.75 | 0.79 | 0.60
- 1 | 1.00 | 1.00
- 1.5 | 1.38 | 2.03
- 2 | 1.74 | 3.36
```

The imbalance is the reason exchanger design is a trade-off. Where the film being improved controls the exchanger, the gain in U can justify the pressure drop. Where it does not, as Chapter 4 found for OC-35's water side, the pressure drop buys almost nothing.

## The tube side's pressure drop

A tube-side pressure drop has two parts: friction along the tubes, and the losses where the flow enters and leaves the tubes and turns round in the channels between passes. The return losses are commonly estimated as a number of **velocity heads**, multiples of ρv² ÷ 2, per pass; an allowance of about four per pass is a common first estimate.

```figure
type: formula
title: Tube-side pressure drop for OC-35
formula: Δp ≈ N_p × [ f × (L ÷ D) + 4 ] × ρv² ÷ 2, with f ≈ 0.316 × Re^(−0.25) for smooth tubes
caption: This is an illustration for OC-35's four tube passes of 10.9 mm tubes, 2.34 m long, at 1.2 m/s, with water at about 995.5 kg/m³. Nozzle losses at the channel connections are additional and are taken from the maker's data.
- N_p | Number of tube passes
- f | Darcy friction factor, from the Blasius form for smooth tubes
- ρv² ÷ 2 | One velocity head, Pa
step: Re ≈ 16,770, f ≈ 0.0278; one velocity head ≈ 995.5 × 1.2² ÷ 2 ≈ 717 Pa
step: Friction ≈ 4 × 0.0278 × (2.34 ÷ 0.0109) × 717 ≈ 17.1 kPa; returns ≈ 4 × 4 × 717 ≈ 11.5 kPa
step: Total ≈ 28.6 kPa; hydraulic pumping power ≈ 28.6 kPa × 1.68 L/s ≈ 48 W
```

## The exchanger and its pump

An exchanger does not set its own flow. The pump does, at the point where the pump's pressure rise equals the system's resistance, which includes the exchanger's pressure drop, the pipework, valves, strainers and anything else in the circuit. If the exchanger's pressure drop rises, the operating point moves: the flow falls until the pump's curve and the system's curve meet again. A design that assumes the design flow, with a pressure drop the pump cannot supply, will not get the design flow.

For OC-35, the tower water comes from a pump shared with other plant, and the branch serving OC-35 has about **60 kPa** available across the cooler at its design flow, after the pipework and the other branches' demands. OC-35's design pressure drop of about 28.6 kPa, plus its nozzles, sits comfortably inside that.

## The error: eight passes the pump could not feed

This is an illustration. Before the oil-side fix of Chapter 4 was understood, a proposal suggested re-baffling OC-35's channels from four tube passes to eight, doubling the water velocity to about 2.4 m/s and raising the water-side coefficient by about 74%, without changing the pump or the pipework.

```figure
type: compare
title: OC-35 with four and with eight tube passes, at the design water flow
cols: Water velocity | Overall U | Tube-side pressure drop | Hydraulic pumping power
caption: This is an illustration. Eight passes would gain about 3% in U, because the water side does not control, for about seven times the pressure drop, which the branch's 60 kPa could not supply.
- *Four passes, as built | 1.2 m/s | 349 W/(m²·K) | 28.6 kPa | 48 W
- Eight passes, proposed | 2.4 m/s | 359 W/(m²·K) | 206.7 kPa | 348 W
```

At the design flow, eight passes would have needed about **207 kPa**, about 7.2 times the four-pass figure: twice as many passes, each with about 3.4 times the friction, and twice as many turns at four times the velocity head. With only 60 kPa available, the water flow would have fallen until the pressure drop matched it, to about **51%** of design, a velocity of about 1.23 m/s, no better than before. With half the water flow, the water's heat capacity rate would roughly halve, the water would leave at about 38.7 °C, and by the effectiveness method of Chapter 7 the oil would settle at about **57.6 °C** entering instead of about 55.4 °C. The modification would have made OC-35 worse, at the cost of new channel covers, a shutdown and the engineering time to design them.

The check that caught it was a pressure-drop calculation for the proposed arrangement, compared with the pressure available from the pump. The general lesson is that an exchanger change that raises velocity must be checked against the pump that supplies it, because a pump that cannot deliver the pressure drop will deliver less flow instead, and less flow can undo everything the higher velocity was meant to gain.

## Pump curves and system curves

A centrifugal pump's curve shows the pressure it develops at each flow: highest at zero flow, falling as the flow rises. A system's curve shows the pressure needed to push each flow through the pipework and equipment: zero at zero flow, rising roughly with the square of the flow for turbulent systems. The pump runs where the two curves cross. Adding resistance, a more restrictive exchanger, a partly closed valve or a clogged strainer, steepens the system curve and moves the crossing to a lower flow. Opening a valve or cleaning a strainer flattens it and moves the crossing to a higher flow.

For a branch of a shared system, like OC-35's, the picture is more complicated, because changes in one branch shift the flows in the others. A branch made more restrictive takes less flow and pushes more to the other branches; a branch made less restrictive steals flow from them. That is why changes to one exchanger on a shared circuit should be checked against the whole circuit's balance, ideally with the circuit's design calculation or a simple network model, and why the circuit's balancing valves should be re-set, and their new settings recorded, after any change to any branch.

## Measuring pressure drop in service

A differential pressure gauge or transmitter across each side of an exchanger is cheap and very informative. On the tube side, a pressure drop rising at constant flow means the tubes are narrowing with deposits or debris, often before the thermal performance shows it; on a plate exchanger's narrow channels, it is the earliest warning of plugging, which is what Chapter 8's brazed unit needed. Because pressure drop depends strongly on flow, readings are compared at the same flow, or normalised by dividing by the flow raised to the power of about 1.75 to 2. This is an illustration. If OC-35's tube side reads 28.6 kPa at its design flow when clean, a reading of 34 kPa at the same flow a few months later shows a narrowing of the passages worth investigating, even if the oil temperature is still acceptable. Pressure-drop and conductance trends together distinguish fouling that coats the surface, which mainly lowers the coefficient, from debris that blocks the passages, which mainly raises the pressure drop.

## Exchangers in series and in parallel

When two exchangers share a duty, their piping arrangement changes their velocities and pressure drops. In **series**, the whole flow passes through both, so each sees the full velocity and the pressure drops add; the arrangement suits a duty that needs a long thermal length, such as the heat-recovery shells of Chapter 3. In **parallel**, the flow divides, so each exchanger sees about half the flow and about a quarter to a third of the single-unit pressure drop, but the velocity, and so the film coefficient, falls; the arrangement suits a duty limited by pressure drop, or one where a standby unit must be valved in and out. For a cooler like OC-35, adding a second identical unit in parallel would halve the water velocity in each, lowering its water-side coefficient, which matters little because the water side does not control, and halving each unit's oil velocity, which matters a great deal because the oil side does. The arrangement must be chosen with the controlling resistance in view.

## The shell side and the oil circuit

The same trade-off governs the shell side. Chapter 4's fix, closer baffle spacing, raised the oil-side coefficient by about 50%, and the oil-side pressure drop rose with it, roughly with the square of the crossflow velocity. For OC-35, the oil passes through the cooler in the power unit's return line, and the pressure drop there adds to the back-pressure on the system's return, its filters and any components draining into it. The hydraulic system's designer set a limit on the cooler's oil-side pressure drop, and the re-baffled bundle was checked against it. On many power units, the cooler sits in a separate circulating loop with its own small pump, which frees the cooler's pressure drop from the main circuit's constraints and lets the cooler run whether or not the press is working.

## Pressure drop on the data sheet

Each side's allowable pressure drop belongs on the exchanger's data sheet, as Chapter 1 listed, because it is the constraint that keeps the thermal design honest. A maker given a duty and no pressure-drop limit can meet the duty with a small, high-velocity exchanger whose pressure drop the plant cannot supply; given a limit, the maker must find the combination of area, passes and velocity that meets both. For OC-35, the water side's limit came from the branch's 60 kPa, less a margin for strainer fouling and balancing, and the oil side's from the power unit's return-line limit. The maker's rating shows the calculated pressure drop on each side beside the limit, and the comparison is the first thing to check on a quotation, even before the area.

## Velocity limits

Velocity has limits in both directions beyond pressure drop. Too low, and fouling accelerates, as Chapter 6 showed, and laminar flow sets in for viscous fluids. Too high, and erosion attacks tube inlets, especially in copper alloys, and tube vibration can arise on the shell side when crossflow velocities excite the tubes' natural frequencies, a failure mode that exchanger makers check for in every shell-side design. Design velocities for water in tubes are commonly chosen to stay between those limits, scoured enough to resist fouling and slow enough to avoid erosion, with the tube material's guidance setting the upper bound.

## The economic velocity

When pumping power is significant, the best velocity is found by adding the exchanger's capital cost, which falls as velocity rises because less area is needed, to the present value of the pumping energy, which rises steeply. The minimum of the sum is the economic velocity. For OC-35, with about 48 W of hydraulic pumping power on the water side, energy is trivial and the choice is governed by fouling, erosion and the pump's available pressure. For large exchangers on long-running systems, with kilowatts of pumping, the economic calculation decides the design, and it is set up exactly as the economic insulation thickness in *Heat Transfer by the Numbers*.

## Exercise: smaller tubes instead

The proposal is revised: keep four passes but change to tubes of 9.5 mm outside diameter with the same 0.9 mm wall, 77 tubes in total, to raise the water velocity moderately. Inside diameter 7.7 mm, so about 19 tubes per pass. Roughly what velocity results, and would the 60 kPa available be enough for tubes of the same 2.34 m length?

**Worked answer.** Each tube's flow area is π × 0.0077² ÷ 4 ≈ 4.66 × 10⁻⁵ m², so 19 tubes per pass give about 8.85 × 10⁻⁴ m², and 1.68 × 10⁻³ m³/s flows at about **1.9 m/s**. Re ≈ 1.9 × 0.0077 ÷ 0.78 × 10⁻⁶ ≈ 18,800, f ≈ 0.0270, one velocity head ≈ 1,800 Pa, and L ÷ D ≈ 304. The pressure drop is about 4 × (0.0270 × 304 + 4) × 1,800 ≈ **88 kPa**.

That is above the 60 kPa available, so the flow would again fall below design, though less dramatically than with eight passes. Smaller tubes also foul and plug more easily with tower water. The calculation points back to the conclusion of Chapter 4: the water side does not control OC-35, and changes to it cost more in pressure than they return in heat transfer.
