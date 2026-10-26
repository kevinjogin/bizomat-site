---
book: centrifugal-pumps-by-the-numbers
chapterSlug: head-flow-power-and-efficiency
order: 2
title: "Head, flow, power and efficiency"
description: "Hydraulic, shaft and electrical power, pump and motor efficiency, TP-3's power curve and motor, the A$ cost of each megalitre, and a business case built on hydraulic power."
draft: false
---

A pump's job is to give liquid head, and the energy that takes is easy to calculate exactly: so many litres per second lifted through so many metres is so many kilowatts. What a pump actually draws from the switchboard is more, because neither the pump nor its motor is perfect, and the gap between the two is where most of the money in pumping goes. Knowing the three powers, hydraulic, shaft and electrical, and how they relate, is the foundation of every energy decision about pumps.

This chapter sets out hydraulic power, the pump's efficiency and shaft power, the motor's efficiency and electrical power, works out TP-3's power across its range and checks its motor, prices the energy of each megalitre it pumps, and ends with a business case built on the wrong power.

## Hydraulic power

The power the liquid gains from the pump, its **hydraulic power** or water power, is the rate at which the pump adds head to mass:

P_h = ρ × g × Q × H,

with ρ in kg/m³, g in m/s², Q in m³/s and H in m, giving watts. For TP-3 at its operating point of 13.17 L/s and 23.59 m, P_h = 998.21 × 9.807 × 0.01317 × 23.59 = **3.04 kW**.

Hydraulic power is the useful output. It is fixed by what the system needs, the flow and the head, and no choice of pump or motor changes it. Every other power in this chapter is hydraulic power plus losses.

## Useful lift and friction

TP-3's head is not all equally useful. Of its 23.59 m at the operating point, 20.0 m is the lift from the sump's low level to the discharge, which the plant cannot avoid if the water is to reach the header tank. The other 3.59 m, 15% of the head, is friction in the pipes, fittings and foot valve. So of the 3.04 kW of hydraulic power, about 2.58 kW does the lifting and about 0.46 kW is spent overcoming friction.

That split matters for every energy decision later in the book. On a system dominated by lift, like TP-3's, the only ways to save much energy are to pump more efficiently or to lift less; reducing friction or flow can only touch the smaller share. On a system dominated by friction, like a closed cooling loop, the opposite is true. Chapter 6 shows how the split decides whether a variable-speed drive pays.

## Pump efficiency and shaft power

The pump's **efficiency** is the hydraulic power divided by the power the shaft delivers to it:

η_pump = P_h ÷ P_shaft.

It accounts for every loss inside the pump: friction in the passages, leakage past the wear rings, the churning of the impeller's discs, and the bearings and seal. TP-3's illustrative curve gives an efficiency of 74.0% at 13.17 L/s, so the **shaft power** is 3.04 ÷ 0.740 = **4.11 kW**. The other 1.07 kW warms the water slightly as it passes through.

A pump's efficiency is not a single number. It varies with the flow, rising from zero at zero flow, where all the shaft's power is spent churning trapped water, to a maximum at the **best efficiency point**, and falling again beyond it. TP-3's best efficiency point is at about 13 L/s, where its efficiency is 74%; Chapter 3 reads it off the curves.

## Motor efficiency and electrical power

The motor turns electrical power into shaft power, with its own losses in its windings, its iron and its bearings and fan. A motor's efficiency at its rated load is on its nameplate and in its data, and it falls somewhat at light load. This is an illustration: TP-3's 5.5 kW motor is taken as 88% efficient at the 4.11 kW it delivers, so it draws 4.11 ÷ 0.88 = **4.67 kW** from the supply.

The ratio of hydraulic power to electrical power is the **wire-to-water efficiency**, the efficiency of the whole set: 3.04 ÷ 4.67 = **65.1%**. Just under two-thirds of what TP-3 buys from the grid reaches the water as head.

```figure
type: bars
title: TP-3's powers at its operating point
unit: kW
max: 5
caption: This is an illustration at 13.17 L/s and 23.59 m with the sump low. Pump efficiency 74.0%, motor efficiency 88%, wire to water 65.1%.
- Hydraulic power to the water | 3.04
- Shaft power into the pump | 4.11
- * Electrical power from the supply | 4.67
```

## The power curve

Because both head and efficiency change with flow, so does the shaft power. For TP-3, from its illustrative curves:

```figure
type: compare
title: TP-3's head, efficiency and power across its range
rowhead: Flow
cols: Head, m | Pump efficiency | Hydraulic power, kW | Shaft power, kW
caption: This is an illustration from the curves H = 34 − 0.060 × Q² and an efficiency peaking at 74% near 13 L/s. Shaft power at zero flow, by extrapolation, is about 2.9 kW.
- 4 L/s | 33.04 | 38.5% | 1.29 | 3.36
- 8 L/s | 30.16 | 63.1% | 2.36 | 3.75
- 12 L/s | 25.36 | 73.6% | 2.98 | 4.05
- * 13.17 L/s | 23.59 | 74.0% | 3.04 | 4.11
- 16 L/s | 18.64 | 70.1% | 2.92 | 4.17
- 17 L/s | 16.66 | 67.0% | 2.77 | 4.14
```

The shaft power rises gently from about 2.9 kW at zero flow to a peak of about 4.17 kW near 16 L/s, then falls slightly. A curve that peaks within the pump's range and then falls is called **non-overloading**: a motor sized for the peak cannot be overloaded at any flow the pump can reach on water. Many radial pumps have curves that keep rising to the end of the published range, and their motors must be sized for the largest flow the system could ever allow.

## Where the lost power goes

The 1.07 kW that TP-3's pump loses at its operating point does not vanish; it warms the water. At 13.17 L/s, that warming is tiny: 1.07 kW spread over about 13.15 kg/s of water with a specific heat of 4.18 kJ/kg·K raises it by about 0.02 K. Nobody would notice.

At very low flow, it is a different matter. At zero flow, TP-3 still takes about 2.9 kW at its shaft, and all of it goes into the water trapped in the casing. With only, say, 0.2 L/s trickling through, the water would warm by about 2.9 ÷ (0.2 × 4.18) = 3.5 K on each pass, and with no flow at all, the casing's few litres would heat steadily until they boiled. Chapter 9 turns that into the minimum flow every pump needs.

## Measuring power on site

A pump's electrical power can be measured directly with a clamp-on power meter on the motor's supply, which reads the true power in kilowatts. Current alone is not enough: a motor's current includes a component that does no work, and at light load that component is a large share of the total, so a current reading overstates the power at light load and cannot be turned into kilowatts without the power factor. A proper power reading, taken at the same time as the flow and the gauges, gives the wire-to-water efficiency directly: hydraulic power from the flow and head, divided by the measured electrical power.

On TP-3, the plant fitted an energy sub-meter on the pump's circuit when the variable-speed drive was being considered. Its record, compared with the volume pumped from the flow meter's totaliser, gives the energy per megalitre week by week, and a rise in that figure is the earliest sign of a worn pump, a clogging strainer or a valve left partly closed.

## Sizing the motor

The motor must deliver the largest shaft power the pump will need, with some margin, on the densest liquid it will pump. For TP-3, the largest is about 4.17 kW, at a flow it would reach only if the discharge pipe broke near the pump and the system's resistance disappeared. This is an illustration. The plant's practice is a margin of 10 to 15% over the largest shaft power in the pump's range, which gives about 4.6 to 4.8 kW, and the next standard motor size above that is 5.5 kW.

A motor much larger than needed is not free, and oversizing by habit is common. It costs more, its efficiency at light load is lower, and its starting current is higher. A motor too small trips on overload, or worse, runs hot and fails early. The pump's whole power curve, not just its design point, decides the motor.

## The energy of a megalitre

What matters for the plant's bill is the energy per volume pumped. At 4.67 kW and 13.17 L/s, which is 47.4 m³/h, TP-3 uses 4.67 ÷ 47.4 = **0.0985 kWh per m³**, about 98.5 kWh per megalitre.

This is an illustration. The plant uses about 300 m³ of washwater a day. TP-3 runs about 300 ÷ 47.4 = 6.33 hours a day to supply it, using 29.6 kWh a day. At an electricity price of A$0.30 per kWh including GST, that is A$8.87 a day, about **A$3,240 a year**, or about A$29.6 for each megalitre pumped.

That figure is the yardstick for every improvement in later chapters, and it is worth recalculating whenever the electricity tariff changes, because every saving scales with it. It also gives a quick check on a meter reading: a sub-meter showing much more than about 30 kWh on a normal day means TP-3 is running longer or harder than it should. A change that lowers the energy per megalitre by 10% saves about A$324 a year on TP-3; a change that wastes 10% costs the same.

## Efficiency where it counts

Two simple rules follow from the arithmetic.

1. **Run near the best efficiency point.** TP-3's efficiency is 74% at 13 L/s and only 63% at 8 L/s. Pumping the same volume at 8 L/s through a throttled valve costs more energy per megalitre, not less, as Chapter 7 shows.
2. **Look at the whole set.** A pump at 74% driven by a motor at 88% delivers 65% wire to water. Gaining a few points on the motor, by choosing a higher-efficiency class, is often as valuable as gaining them on the pump, and Australia's minimum energy performance standards for motors set a floor that new motors must meet.

## Efficiency and size

Large pumps are generally more efficient than small ones, because their internal leakage and friction are a smaller share of what they move. A pump the size of TP-3 reaching the mid-seventies at its best point is reasonable for its size and duty; much smaller pumps commonly reach only the fifties or sixties, and very large ones the high eighties. The figures here are illustrations of the trend, not targets; the maker's tested curve is what counts for a particular pump.

Efficiency also falls with wear. As wear rings open and impeller vanes erode, internal leakage rises, and the efficiency at a given flow falls a few points over years of service. A pump that was 74% efficient when new and is now 68% uses about 9% more energy for the same work. Refurbishing the wear rings is often one of the cheapest energy savings a plant can make.

## The error: a business case built on hydraulic power

This is an illustration. When the plant considered fitting TP-3 with a variable-speed drive, an engineer estimated its present annual energy from its hydraulic power, 3.04 kW, multiplied by its running hours and the electricity price, and arrived at about **A$2,110 a year**. The drive's projected savings, a fraction of that, did not justify its cost, and the proposal was shelved.

The engineer had left out both efficiencies. The power TP-3 actually draws is 4.67 kW, not 3.04, and its true annual energy cost is about **A$3,240**, 54% more. Any saving calculated as a fraction of the bill was understated by the same proportion. The error was found a year later when the plant's sub-meter on TP-3's circuit showed the real consumption, and the case was redone.

Redone on electrical power, the drive's case changed from marginal to worth a closer look, though, as Chapter 6 shows, TP-3's large static lift still limits what speed control can save. The lesson is simple and often forgotten: the plant pays for electrical power, so energy cases must be built on it, measured where possible and calculated with both the pump's and the motor's efficiency where not.

```figure
type: bars
title: TP-3's annual energy cost, two ways
unit: A$ a year
max: 3500
caption: This is an illustration at A$0.30 per kWh including GST and 6.33 hours a day. Hydraulic power leaves out the pump's and motor's losses.
- From hydraulic power, 3.04 kW | 2107
- * From electrical power, 4.67 kW | 3237
```

## Exercise: TP-3 at its best efficiency point

At 13 L/s, TP-3's curves give a head of 23.86 m and an efficiency of 74.0%. Find its hydraulic power, shaft power and, with the motor at 88%, its electrical power and energy per cubic metre.

**Worked answer.**

- Hydraulic power: 998.21 × 9.807 × 0.013 × 23.86 = **3.04 kW**.
- Shaft power: 3.04 ÷ 0.740 = **4.10 kW**.
- Electrical power: 4.10 ÷ 0.88 = **4.66 kW**.
- 13 L/s is 46.8 m³/h, so the energy is 4.66 ÷ 46.8 = **0.0996 kWh per m³**.

The best efficiency point and TP-3's operating point at 13.17 L/s are so close that their numbers are almost the same; TP-3 is well matched to its system with the sump low. Chapter 4 shows how that changes as the sump fills.
