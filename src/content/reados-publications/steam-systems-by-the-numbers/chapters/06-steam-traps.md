---
book: steam-systems-by-the-numbers
chapterSlug: steam-traps
order: 6
title: "Steam traps"
description: "Choose, size and test steam traps: what each type does, sizing for start-up loads and real differential pressure, stall in controlled equipment, and the cost of traps that fail open or closed."
draft: false
---

A steam trap is a valve that tells steam from water. It opens to let condensate and air out of a jacket, coil or main, and closes to keep steam in. Without it, steam would blow straight through every heater into the condensate line, or condensate would back up and flood the heating surface. Traps are small, cheap and numerous, which is why they are neglected. A plant may have dozens, and a trap that has failed open, passing live steam, costs money every hour without making a sound anyone notices; one that has failed closed floods its equipment, slows the process and invites water hammer.

This chapter covers SV-8's traps. It describes the main types and what each suits, sizes the kettle traps for the condensate at the start of a batch and the pressure actually available across them, explains stall, the condition in which a temperature-controlled jacket cannot drain, sets out how traps are tested, and puts a cost on failures. The failure case is a trap on the cleaning water heater that had been passing steam for months.

## What a trap must do

A trap has three jobs. It must **discharge condensate** as fast as it forms, including the large flows at start-up. It must **discharge air and other non-condensable gases**, especially when equipment starts cold, as Chapter 3 showed. And it must **hold back steam**, so that the steam stays in the equipment until it has given up its latent heat. Each trap type does these jobs by a different mechanism and suits different duties.

```figure
type: compare
title: Common steam trap types and where SV-8 uses them
cols: How it tells steam from water | Strengths | Used on SV-8 for
caption: This is an illustration of general characteristics. Trap makers' data govern selection for a particular duty and pressure.
- Float and thermostatic | a float rises with condensate level and opens the valve; a thermostatic element vents air | discharges condensate continuously as it forms; handles varying loads; vents air well | kettle jackets and the cleaning water heater
- Inverted bucket | a bucket floats on steam and sinks on condensate | robust; tolerates water hammer and dirt | not used
- Thermodynamic disc | a disc snaps shut on flashing condensate's velocity | compact, robust, cheap | main drain pockets
- Thermostatic, balanced pressure | an element closes when it senses steam temperature | good air venting; holds back condensate until it cools slightly | air vents on mains
```

Each kettle has a **float and thermostatic** trap at the bottom of its jacket, because it discharges condensate as soon as it forms, keeping the whole jacket surface available for condensing steam, and its thermostatic element vents air at start-up. The main's drain pockets use **thermodynamic** traps, which are compact and cope well with the main's dirt and occasional water hammer. Balanced pressure thermostatic traps serve as the automatic air vents at the ends of the main, where they open to cool air at start-up and close as steam reaches them. Using the right type for each job matters more than the brand.

## Sizing a trap

A trap is sized for the condensate it must pass, at the pressure difference actually available across it, with a margin.

The **condensate load** is the steam flow condensing in the equipment. For a kettle at the start of a batch, Chapter 3 found the jacket passing about **148 kW**, which condenses about **148 ÷ 2,133 × 3,600 ≈ 250 kg/h**, against 169 kg/h on average over the heat-up. SV-8's practice applies a safety factor of **2** to the start-up load, a teaching value, giving a design capacity of about **500 kg/h**.

The **differential pressure** is the pressure in the jacket minus the pressure in the condensate line the trap discharges into, not the jacket's pressure alone. SV-8's kettle traps discharge into a condensate collecting line that runs to a vented receiver and pump; with the line's friction and the lift into the receiver, the back pressure at the trap outlet is taken as about **150 kPa absolute**. With the jacket at 400 kPa absolute, the differential is about **250 kPa**. The trap's capacity is read from its maker's chart at that differential.

```figure
type: formula
title: Sizing a kettle's trap
formula: design capacity = start-up condensate load × safety factor, at the differential pressure available
caption: This is an illustration. The safety factor and back pressure are teaching values; the trap's capacity at the differential comes from its maker's chart.
- Start-up jacket duty | about 148 kW
- Condensate at start-up | 148 ÷ 2,133 × 3,600 ≈ 250 kg/h
- Safety factor | 2
step: design capacity ≈ 500 kg/h
step: differential ≈ 400 − 150 = 250 kPa, read on the maker's chart for the chosen trap
```

## Stall: when the jacket cannot drain

A kettle's temperature is controlled by a valve on its steam supply, as Chapter 3 explained. As the product approaches its set temperature, the valve throttles and the jacket's pressure falls. If it falls below the back pressure at the trap's outlet, here about 150 kPa absolute, there is no differential to push condensate through the trap. Condensate backs up and floods the jacket, even though the trap is perfectly healthy. This is **stall**.

The published table shows the size of the effect: at 190 kPa absolute steam condenses at 118.6 °C, and at atmospheric pressure at 100 °C. A jacket throttled to about 150 kPa absolute, while holding product at 90 °C, is entirely plausible near the end of a batch. Stall causes erratic temperature control, as the flooded jacket loses capacity and the valve opens further to compensate, and water hammer, as steam meets the pooled condensate. It also accelerates corrosion, because the trapped condensate absorbs carbon dioxide.

The remedies all restore a way for condensate to leave when the jacket's pressure is low: let the condensate drain by gravity to a vented receiver below the jacket, so no lift is needed; or fit a **pump-trap**, a trap combined with a small steam-driven pump that pushes condensate out when the differential is not enough. SV-8's kettle jackets drain by gravity to a vented receiver set below their outlets, with its pump lifting the condensate onward to the boiler house, so the jackets can drain whatever their pressure.

## Installing a trap well

A good trap badly installed works badly. Each of SV-8's kettle traps is installed with an isolating valve either side, so it can be removed without draining the system; a strainer before it, because dirt is the commonest cause of traps failing open; a test point after it, for the survey; and a check valve after it where the condensate line lifts, so condensate cannot run back into the jacket when the kettle stops. The trap sits below the jacket's outlet, as close as practical, with the pipe falling to it, so condensate reaches it by gravity rather than having to lift. And each trap is accessible from the floor, because a trap that can only be reached with a ladder is a trap that will not be tested.

## One trap for each piece of equipment

It is tempting to save money by connecting several jackets or coils to a single trap. It does not work. The equipment will not all be at the same pressure: one kettle may be throttled near its set point while its neighbour heats a fresh batch at full pressure. The one at higher pressure pushes its condensate through the shared trap and holds back the other's, which floods. This is called short-circuiting, and the cure is simple: every piece of equipment, and every separately controlled section of it, has its own trap. SV-8's four kettles have four traps, and its steam-to-water heat exchanger a fifth.

## The trap register

Every trap on SV-8 carries a numbered tag, and the trap register lists, for each number, its location, its type and size, the equipment it drains, its normal pressure and condensate load, and the result of each survey with the date and the action taken. The register turns trap maintenance from occasional firefighting into a routine. It shows which traps fail repeatedly, often a sign of the wrong type, dirt or water hammer upstream; it gives the cost of failures found each year, which justifies the survey; and when a trap is replaced, it records exactly what was fitted, so the next replacement matches it.

## Testing traps

A trap's condition is not visible from outside. Three methods, used together, give a reliable verdict.

- **Listening.** An ultrasonic tester picks up the sound of the trap's valve: the cycling of a healthy intermittent trap, the steady flow of a continuous one, or the hiss of steam blowing through one that has failed open.
- **Temperature.** A surface thermometer or thermal camera upstream and downstream shows whether the trap is hot, as a working trap on hot equipment should be, or cold, as a trap that has failed closed with its equipment flooded will be.
- **Sight.** A sight glass after the trap, or a test valve discharging to atmosphere where that can be done safely, shows condensate, flash steam or live steam.

Telling flash steam from live steam takes practice. Hot condensate discharged to atmosphere always produces some flash steam, Chapter 7's subject, as a lazy, billowing plume; live steam blowing through a failed trap leaves as a sharp, transparent jet near the outlet before it condenses into a visible cloud.

SV-8 has **14 traps**. They are surveyed every six months by the maintenance technician, each trap tagged with a number, and the results recorded in a trap register: location, type, condition, action taken.

## Testing safely

Trap testing is done on live equipment, and steam and hot condensate burn instantly. SV-8's technician tests from a safe position, with face protection and gloves, and never opens a test valve unless its discharge is directed away from people and the area is clear. Thermal cameras and ultrasonic testers are used first precisely because they need nothing opened. A trap that must be changed is isolated on both sides, its pressure released through its test point and allowed to cool, and the isolation locked and tagged under the site's isolation procedure, before any fitting is undone. A trap body still full of hot condensate can spray boiling water when its cap is loosened, even with the steam isolated, because the trapped water flashes as its pressure falls.

## The cost of failed traps

A trap that has **failed open** passes live steam continuously into the condensate system. How much depends on the trap's size, its failure and the pressure; an illustration is about **10 kg/h** through a failed kettle trap at 400 kPa. Over 4,000 hours that is **40 tonnes** of steam a year, at about **A$63** a tonne, about **A$2,500** a year, from one small trap. Some of its heat reaches the condensate return, but much is vented as flash steam at the receiver.

A trap that has **failed closed** wastes no steam, but floods its equipment, slowing it or stopping it, and invites water hammer and corrosion. Its cost is in production and damage rather than gas.

```figure
type: bars
title: SV-8's trap survey results, two surveys a year apart
unit: traps
max: 14
caption: This is an illustration. The first survey was the first ever; the second, a year later, followed six-monthly testing. Each failed-open trap was costing about A$2,500 a year.
- Working, first survey | 9
- Failed open, first survey | 3
- Failed closed, first survey | 2
- *Working, second survey | 13
- Failed open, second survey | 1
```

## A failure case: the trap that passed steam for months

This is an illustration. SV-8's first trap survey found the trap on the steam-to-water heat exchanger for the cleaning system blowing live steam continuously. Its float valve's seat was eroded, and steam had been passing straight through into the condensate line, probably for months. The symptoms had been there: the condensate receiver's vent had been plumed more heavily than usual for some time, and the condensate arriving at the boiler house feed tank had been hotter than normal. Nobody had connected them.

The ultrasonic tester and the thermal camera together confirmed the failure. The correction was to replace the trap's internals and add a strainer before it, because dirt from the exchanger's steam side had eroded the seat. Using the survey's estimate of the loss, about 10 kg/h, the repair paid for itself within weeks. The business added a line to the boiler log for the condensate receiver's vent: a plume heavier than usual is now a prompt to check the traps feeding it. The same record also tracks the condensate's temperature at the feed tank, which rises when live steam is reaching it, so two independent signs now point to a passing trap long before the next scheduled survey would find it.

## How this applies to a small Australian business

Choose trap types for their duties: float and thermostatic traps for process equipment with varying loads, robust thermodynamic or bucket traps for mains, thermostatic traps for air venting. Size traps for the start-up condensate load with a margin, at the real differential between the equipment and the condensate line. Watch for stall on temperature-controlled equipment and drain it by gravity or with a pump-trap. Number every trap, test them all at least yearly with ultrasound and temperature, keep a register, and repair failures promptly. A single failed-open trap can waste thousands of dollars a year.

## Exercise: three failed traps

A survey finds three traps failed open, each estimated to pass about **8 kg/h** of steam. Over SV-8's 4,000 hours a year, at about A$63 a tonne, what do they cost? If replacing each trap's internals costs about A$400, what is the payback?

**Worked answer.** Together they pass about **3 × 8 = 24 kg/h**, or **24 × 4,000 = 96,000 kg**, 96 tonnes a year, costing about **96 × 63 ≈ A$6,050** a year. Repairs cost about **3 × 400 = A$1,200**, so the payback is about **1,200 ÷ 6,050 × 12 ≈ 2.4 months**. Trap repairs are among the quickest paybacks in any steam system, which is why a regular survey is worth far more than it costs.
