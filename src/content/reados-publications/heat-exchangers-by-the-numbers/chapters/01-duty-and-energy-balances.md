---
book: heat-exchangers-by-the-numbers
chapterSlug: duty-and-energy-balances
order: 1
title: "The duty and its two energy balances"
description: "Define what a heat exchanger must do: the duty in kilowatts, an energy balance on each stream, heat capacity rates, the temperature diagram, and catch a duty measured with the wrong specific heat."
draft: false
---

Every heat exchanger calculation starts with the **duty**: the rate at which heat must pass from the hot fluid to the cold one, in kilowatts. The duty fixes everything that follows: the flows, the temperatures, the area, the pumps. It can be found from either side of the exchanger, because in steady operation the heat the hot fluid gives up is the heat the cold fluid takes in, less a small loss to the surroundings. That gives the designer a built-in check. Two independent energy balances, one on each stream, must agree. When they do not, something in the data is wrong, and it is much cheaper to find out on paper than after the exchanger is bought.

This chapter sets out the energy balance for a stream, the heat capacity rate that governs how its temperature changes, the temperature diagram that shows the whole duty at a glance, and where a duty comes from on real plant. The running case finds that a duty measured on the press's hydraulic system was first calculated with water's specific heat applied to oil, giving 77 kW instead of 35 kW, and that the water-side balance exposed the error.

## The energy balance on one stream

A fluid flowing steadily through an exchanger, without boiling or condensing, changes temperature in proportion to the heat it gains or loses:

```figure
type: formula
title: Duty from an energy balance on each stream
formula: Q = m_h × c_p,h × (T_h,in − T_h,out) = m_c × c_p,c × (t_c,out − t_c,in)
caption: This is an illustration for OC-35: hydraulic oil with an illustrative specific heat of 1.9 kJ/(kg·K), and tower water at 4.18 kJ/(kg·K). Both balances give the same duty.
- Q | Duty, kW
- m | Mass flow of the stream, kg/s
- c_p | Specific heat of the stream, kJ/(kg·K)
- T, t | Hot and cold stream temperatures, °C
step: Oil: 127 L/min at 870 kg/m³ ≈ 1.842 kg/s; Q ≈ 1.842 × 1.9 × (55 − 45) ≈ 35.0 kW
step: Water: 101 L/min ≈ 1.675 kg/s; Q ≈ 1.675 × 4.18 × (34 − 29) ≈ 35.0 kW
step: The two balances agree, as they must in steady operation
```

The balance works in mass flow, so a volume flow from a flowmeter or a pump's rating must be converted with the fluid's density at its temperature. The specific heat must be the fluid's own, at its temperature: mineral hydraulic oils have specific heats around 1.8 to 2.0 kJ/(kg·K), less than half of water's, and glycol solutions, brines and process fluids each have their own. The supplier's data sheet is the source for the actual fluid.

## Heat capacity rate

The product m × c_p is the stream's **heat capacity rate**, C, in kW/K: the duty that changes its temperature by one kelvin. It is the most useful single number about a stream, because it says how stiff its temperature is. A stream with a large C changes temperature little for a given duty; one with a small C changes a lot.

This is an illustration. OC-35's oil has C_oil ≈ 1.842 × 1.9 ≈ **3.50 kW/K**, and its water C_water ≈ 1.675 × 4.18 ≈ **7.00 kW/K**. The water's heat capacity rate is twice the oil's, so for the same 35 kW the water warms by 5 K while the oil cools by 10 K. Their ratio, C_min ÷ C_max = 0.5, appears again in the rating method of Chapter 7.

```figure
type: compare
title: OC-35's two streams
cols: Flow | Specific heat | Heat capacity rate | In | Out
caption: This is an illustration. The water stream's heat capacity rate is twice the oil's, so its temperature changes half as much for the same duty.
- *Hydraulic oil, shell side | 1.842 kg/s, 127 L/min | 1.9 kJ/(kg·K) | 3.50 kW/K | 55 °C | 45 °C
- Tower water, tube side | 1.675 kg/s, 101 L/min | 4.18 kJ/(kg·K) | 7.00 kW/K | 29 °C | 34 °C
```

## The temperature diagram

The duty is easiest to see on a **temperature diagram**: each stream's temperature plotted against the heat transferred along the exchanger. For OC-35, the oil's line falls from 55 °C to 45 °C across the 35 kW, and the water's line rises from 29 °C to 34 °C. In a counterflow exchanger, where the streams run in opposite directions, the hot end of the diagram has the oil entering at 55 °C beside the water leaving at 34 °C, a difference of 21 K, and the cold end has the oil leaving at 45 °C beside the water entering at 29 °C, a difference of 16 K. Those two **terminal temperature differences** drive the heat transfer, and Chapter 2 turns them into the mean temperature difference that sizes the exchanger.

The diagram also shows what is impossible. Heat flows only from hot to cold, so the hot stream must be hotter than the cold one everywhere along the exchanger. Any proposed set of temperatures that makes the lines cross is not achievable, however large the exchanger, which Chapter 2 explores.

## Where the duty comes from

On real plant, the duty is set by the process. For a hydraulic power unit, it is the power lost in the system: in the pumps' inefficiency, across relief valves and throttling valves, in the actuators' friction, all of which ends up as heat in the oil. This is an illustration. If the press's pumps draw 110 kW and about 32% of that becomes heat in the oil, the cooler must remove about **35 kW** in continuous operation. A designer estimating a new system makes that estimate from the circuit; an engineer troubleshooting an existing one measures it, from the oil's flow and temperature drop across the cooler, or from the cooling water's.

A duty should also be stated with its operating case. OC-35's 35 kW is the press's continuous production duty; a short peak, a summer afternoon or a future upgrade may need more, and the specification should list each case the exchanger must meet.

## The error: oil treated as water

This is an illustration. Before OC-35 was specified, the plant's engineer measured the existing, undersized cooler's performance to find the true duty. The oil flow through it was 127 L/min, and its temperature fell by 10 K. The engineer's spreadsheet, set up for water systems, used a specific heat of 4.18 kJ/(kg·K), and calculated the duty as 1.842 × 4.18 × 10 ≈ **77.0 kW**.

A cooler specified for 77 kW would have been more than twice the size needed, with a cooling water flow, pump and pipework to match. The error was caught by the second balance. The cooling water flow through the old cooler was measured at 101 L/min, rising by 5 K, a duty of about 1.675 × 4.18 × 5 ≈ **35.0 kW**. The two balances disagreed by a factor of 2.2, far more than any measurement error or heat loss could explain, and the engineer looked for the cause.

```figure
type: bars
title: The press's measured cooling duty, three ways, kW
unit: kW
max: 80
caption: This is an illustration. The oil-side balance with water's specific heat overstated the duty by a factor of 2.2; with the oil's own specific heat it agreed with the water side.
- Oil side, with water's 4.18 kJ/(kg·K) | 77.0
- *Oil side, with the oil's 1.9 kJ/(kg·K) | 35.0
- Water side, 4.18 kJ/(kg·K) | 35.0
```

With the oil's own specific heat from its data sheet, the oil-side balance gave 35.0 kW, matching the water side. The general lesson is that a duty should always be checked by both energy balances, and that a disagreement of more than a few per cent means a wrong property, a wrong flow or a wrong temperature, not a heat loss.

## How well should the balances agree?

On real plant, the two balances seldom agree exactly. Flowmeters have uncertainties of a few per cent, temperature sensors of a fraction of a kelvin, and some heat is lost from a warm exchanger's shell to the room. A mismatch of a few per cent is normal. Temperature measurement matters most when the temperature change is small: OC-35's water rises only 5 K, so an error of 0.25 K in either water temperature is a 5% error in the water-side duty. Accurate, matched sensors, placed in well-mixed flow away from bends and dead legs, and a check that they read the same when no heat is being transferred, make the balance trustworthy.

## Duties with a change of phase

When a stream condenses or boils, its temperature stays nearly constant while it gives up or takes in heat, and the energy balance uses its latent heat instead of its specific heat: Q = m × h_fg, where h_fg is the heat released per kilogram as it condenses or absorbed as it boils, at its pressure. Condensing steam, for example, releases roughly 2,000 to 2,300 kJ/kg depending on its pressure, about five hundred times the heat a kilogram of water releases in cooling by one kelvin. A small mass flow of condensing steam can therefore carry a large duty. On the temperature diagram, a condensing or boiling stream is a horizontal line, which changes how the temperature difference behaves along the exchanger, a point Chapter 10 returns to. Steam tables or the fluid supplier's data give h_fg at the actual pressure; a value carried over from another pressure can be wrong by several per cent.

## Writing the duty on a data sheet

A heat exchanger is specified on a **data sheet**, and the duty is its first section. A complete duty states, for each stream:

- the fluid and its properties, or the source of them;
- the mass flow, with the operating case it applies to;
- the inlet and outlet temperatures, or the inlet temperature and the duty;
- the allowable pressure drop through the exchanger;
- the fouling allowance, which Chapter 6 discusses;
- the design pressure and temperature, which set the mechanical design.

For OC-35, the oil side lists hydraulic oil to a named grade, 127 L/min, 55 °C in and 45 °C out, an allowable pressure drop that the power unit's return line can tolerate, and a fouling allowance for clean filtered oil. The water side lists tower water, 101 L/min, 29 °C in, a maximum outlet of 34 °C, an allowable pressure drop set by the tower pump, and a fouling allowance for open cooling-tower water, which is dirtier. Both sides list the duty, 35 kW, and the operating cases: continuous production, and a summer case with warmer water that *Cooling Towers by the Numbers* describes for the same plant. A maker quoting from that sheet can size the exchanger; a maker quoting from "an oil cooler for a 110 kW power unit" is guessing.

## Heat lost to the surroundings

A warm exchanger loses some heat from its shell. For OC-35, with oil at about 50 °C in a room at 25 °C, the loss from an uninsulated shell of a few square metres is of the order of a few hundred watts, about 1% of the duty, and it makes the oil side's heat release slightly larger than the water side's gain. For exchangers working far from room temperature, a steam heater or a chilled-water cooler, the loss or gain can be larger and is included in the balance, or the shell is insulated. *Heat Transfer by the Numbers* works through the losses from hot surfaces and their insulation.

## Regenerative and non-regenerative exchangers

Exchangers are sometimes classed by where their two streams come from. In a **non-regenerative** exchanger, the two fluids belong to different systems: OC-35's oil gives its heat to tower water, which carries it away to be rejected. In a **regenerative** exchanger, the same fluid passes through both sides at different points in its process: a hot stream leaving a process preheats the cold stream entering it, so the heat is recovered rather than thrown away. A regenerative exchanger's duty therefore appears twice in the plant's energy balance, as heat saved upstream and heat removed downstream, and its value is measured in the energy it saves. The energy balance method is the same for both.

## Units and consistency

Most mistakes in exchanger calculations are unit mistakes. A few habits avoid them: work in kilowatts, kilograms per second and kJ/(kg·K) together, so that their product is directly in kW/K; convert litres per minute to kilograms per second explicitly, with the density at the fluid's temperature; and write every temperature with its unit and its stream. A temperature difference is in kelvin, and a kelvin of difference is the same size as a degree Celsius of difference, so mixing the two in differences is harmless, but mixing them in absolute temperatures, as radiation calculations need, is not.

## Exercise: half the water

The tower water pump serving OC-35 is shared with other plant, and at times only about half the design water flow, about 0.84 kg/s, reaches the cooler. If the duty is still 35 kW and the water still enters at 29 °C, what is the water's outlet temperature, and what are the new terminal temperature differences in counterflow? What does the change suggest?

**Worked answer.** The water's heat capacity rate halves to about 0.84 × 4.18 ≈ 3.50 kW/K, the same as the oil's, so it now warms by 35 ÷ 3.50 = **10 K**, leaving at **39 °C**. In counterflow, the hot end's difference is 55 − 39 = **16 K** and the cold end's is 45 − 29 = **16 K**: equal, so the mean temperature difference is simply 16 K, against about 18.4 K at design.

The exchanger must now do the same duty with about 13% less temperature difference, so, as Chapter 2 shows, it needs about 15% more area or a higher coefficient to keep the oil at 45 °C. If it has no such margin, the oil will run hotter. The calculation turns a vague complaint, "the oil runs hot when the other machines are running", into a specific question for the plant's water system: is the cooler getting its design water flow?
