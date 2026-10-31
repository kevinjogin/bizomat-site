---
book: magnetic-workholding-by-the-numbers
chapterSlug: choosing-a-magnetic-chuck
order: 7
title: "Choosing a magnetic chuck"
description: "Permanent, electromagnetic and electro-permanent chucks compared: how each makes and switches its flux, heat, energy, power failure, interlocks, pole patterns and the cost of ownership."
draft: false
---

Every magnetic chuck delivers flux to its poles, and every one holds a part exactly as hard as the flux density at the contact allows. What differs between types is how the flux is made, how it is switched on and off, what happens when the power fails, and how much heat the chuck puts into the machine. Those differences matter more than the catalogue's holding force when a shop chooses a chuck, because they decide whether the chuck is safe on a given machine and whether it can hold the accuracy the work needs.

This chapter explains how the three main types work, compares them for the case's machining centre and grinder, and sets out the interlocks a magnetic chuck needs on a machine tool. The error is a second chuck bought on purchase price.

## Three ways to make and switch the flux

### Permanent chucks

A permanent chuck contains permanent magnets and a movable set of pole pieces or magnets, worked by a lever. In one position the magnets' flux is directed up through the pole faces and into the part; in the other it is short-circuited inside the chuck and very little reaches the face. No power is needed at any time. Permanent chucks are common on small surface grinders and on toolroom set-ups, where their simplicity and independence from power are valuable. Their holding force is fixed by their design and cannot be turned down, and large ones need a long lever or a geared mechanism to switch.

### Electromagnetic chucks

An electromagnetic chuck contains coils wound round steel cores. Direct current through the coils produces the magnetomotive force; switching the current off removes it. The force can be varied by varying the current, which is useful for the low-power grinding of Chapter 6. The coils dissipate power for as long as the chuck is on, so the chuck warms, and if the power fails the chuck loses its hold almost at once, apart from whatever residual magnetism remains in the steel. A controller supplies the current and runs a demagnetising cycle, a series of reversing, decreasing pulses, when the chuck is switched off, so that the part can be lifted.

### Electro-permanent chucks

An electro-permanent chuck contains two kinds of permanent magnet. One kind has a very high coercivity, such as neodymium-iron-boron, and keeps its magnetisation permanently. The other kind has a low coercivity, such as aluminium-nickel-cobalt (AlNiCo), and is surrounded by a coil. A short pulse of current through the coil reverses the AlNiCo magnets' magnetisation. With the two sets of magnets aligned, their flux is driven out through the pole faces and into the part; with the AlNiCo reversed, the two sets drive flux round inside the chuck and very little reaches the face. The coil carries current only for the second or so of the switching pulse.

```figure
type: compare
title: Three types of magnetic chuck
cols: Permanent | Electromagnetic | Electro-permanent
rowhead: Property
- Source of flux | permanent magnets | coils carrying direct current | permanent magnets, one set reversible by a coil pulse
- Switching | lever, by hand | controller switches current | controller sends a short pulse
- Power while holding | none | continuous | none
- * If the power fails while holding | keeps holding | loses its hold within moments | keeps holding
- Heat added to the machine | none | continuous, from the coils | only at switching
- Holding force adjustable | no | yes, with the current | in steps, on some controllers
- Typical use | small grinders, toolroom | grinders, where low power and variable force help | machining centres, heavy milling
caption: General characteristics. Details vary between makers and models, and a particular chuck's documentation governs its use.
```

## Heat and energy

An electromagnetic chuck's coil power goes into heat in the chuck. This is an illustration. The case's shop considered an 800 × 500 mm electromagnetic chuck drawing 600 W while on, against an electro-permanent chuck of the same size that uses about 3 Wh per switching pulse, on a machine running two shifts, 16 hours a day, 240 days a year, with about 100 parts loaded a day.

```figure
type: bars
title: Energy used by an 800 × 500 mm chuck in a year
unit: kWh
max: 2400
caption: This is an illustration. Electromagnetic chuck on for 16 hours a day at 600 W; electro-permanent chuck switching 100 times a day at 3 Wh a pulse; 240 days a year. At A$0.30 per kWh including GST, about A$691 a year against about A$22.
- * Electromagnetic | 2304
- Electro-permanent | 72
```

The energy cost is modest either way. The heat is not. Six hundred watts flowing into the chuck and the machine table raises their temperature by a few degrees over the first hours of running, and a chuck that warms by 5 °C grows by 800 × 11.5 × 10⁻⁶ × 5 = 0.046 mm along its 800 mm length, 0.023 mm from its centre to each end. On a machining centre that drills BP-600's mounting holes to a positional tolerance of 0.05 mm, that growth uses about half the tolerance before any other error is counted. On a grinder, where the chuck is ground in place and coolant flows over it, steady running brings the chuck to a stable temperature and the growth is largely absorbed by grinding the chuck face at that temperature.

## When the power fails

A permanent or electro-permanent chuck holds through a power failure, because its flux comes from permanent magnets. An electromagnetic chuck does not. On a surface grinder the consequence of a power failure is usually that the spindle also stops, and the grinding forces are small, so the part simply sits on the chuck. On a machining centre milling a heavy plate with a 125 mm face mill, a chuck that releases while the spindle is still running down is a serious hazard: the cutter can throw the part.

That is why electromagnetic chucks are rarely used for heavy milling, and why any magnetic chuck on a machine tool must be integrated with the machine's controls. Under the model WHS laws, a person conducting a business or undertaking must manage the risks of plant, and Safe Work Australia's model Code of Practice on managing the risks of plant in the workplace sets out how; a chuck that can release a part while a cutter is turning is a risk that the machine's controls should eliminate or control.

```figure
type: checklist
title: Interlocks for a magnetic chuck on a machine tool
caption: The open item is the one this chapter's error missed. The detailed design of the interlocks belongs to the machine's integrator and the chuck's maker; the list states what they must achieve.
- x The spindle cannot start until the chuck is magnetised | confirmed by the controller, not assumed from a command
- x The chuck cannot be demagnetised while the spindle is turning | or while the axes are moving under a program
- ? Loss of chuck power stops the spindle and feed | electromagnetic chucks especially
- x Flux or magnetisation is monitored where the maker provides it | a sensing coil or Hall sensor in the chuck
- x The holding level in use is shown to the operator | full or reduced power
- x Pulse and demagnetise cycles run from the machine's program | so they cannot be skipped by hand
```

## Pole patterns

The type of chuck decides how the flux is made; the pole pattern decides how it reaches the part. Square poles in a chequerboard deliver flux in two directions and suit plates and blocks milled from any side. Parallel or transverse strip poles suit grinding and long parts laid across them. Radial poles suit round chucks on lathes and rotary grinders. Fine poles, as Chapter 4 showed, suit thin parts at the cost of reach and gap tolerance.

Pole pitch interacts with the work in ways set out in the earlier chapters: coarse poles for thick and rough parts, fine poles for thin and small ones. A shop with a mix of work often has one of each, or uses pole extensions on a coarse chuck for the occasional small part.

## Switching time and automation

A chuck's switching time adds to every load and unload. A permanent chuck switches as fast as the operator moves the lever. An electro-permanent chuck's magnetising pulse lasts around a second, and its demagnetising cycle, a few reversing pulses of falling strength, a few seconds. An electromagnetic chuck switches on almost at once, but its demagnetising cycle on switching off can take several seconds more, because the controller must ramp the current down through reversals to leave little residual magnetism in the part.

For a part like BP-600, loaded by hand with a crane, a few seconds do not matter. For small parts loaded by a robot every minute, they do, and so does the interface: a chuck whose magnetisation is confirmed by a sensor and reported to the machine's controller can be switched by the program, checked before the spindle starts, and logged. Electro-permanent chucks used in automated cells usually have that sensing built in. Whichever type is chosen, the cell's design should treat the chuck's state as a safety signal, not as a command the program assumes has worked.

## Maintaining a chuck

A chuck's face is a precision surface and a magnetic contact at once, and it wears as both. Parts slid across it, swarf ground into it and the occasional dropped part leave scores and burrs that become gaps under the next part. Shops stone chuck faces lightly as a routine, and regrind them in place on grinders when they lose flatness. Each regrind removes steel from the pole faces, and the maker states how much may be removed in the chuck's life; a chuck ground below that limit loses holding force, because the pole pieces become thinner and saturate sooner.

The electrical parts need attention too. Coolant that gets into an electromagnetic chuck's coils, or into an electro-permanent chuck's connections, causes insulation failures, and the chuck's cable runs through a hostile area beside the machine table. The case's shop includes the chuck in its machine's planned maintenance: a monthly visual check of the face, cable and seals, a six-monthly insulation resistance test of the coils by an electrician, and a pull test with the shop's reference block whenever the face has been reground or the chuck repaired. The pull test result, compared with the chuck's figure when new, is the simplest evidence that the chuck still does what its set-up sheets assume.

## Cost of ownership

This is an illustration. When the shop added a second machining centre, it compared two 800 × 500 mm chucks over five years. Prices exclude GST; energy includes it.

```figure
type: compare
title: Five-year cost of two chucks for the second machining centre
cols: Electromagnetic | Electro-permanent
rowhead: Cost item, A$
- Chuck | 9,000 | 16,000
- Controller and installation | 2,500 | 3,500
- Energy for five years | 3,456 | 108
- * Total for five years | 14,956 | 19,608
- Holds through a power failure | no | yes
- Heat added while holding | 600 W | none
caption: This is an illustration. Invented prices for the case. The totals favour the electromagnetic chuck by about A$4,650 over five years; the last two rows are not costs, but they decide whether that saving is real.
```

## What to ask a chuck maker

A catalogue gives a holding force per unit area and a size. The questions that decide whether a chuck suits a shop's work are different, and a maker should be able to answer each with data for the specific model:

- **Test conditions of the rating.** The test block's material, thickness and finish, and whether the figure is per unit of pole area or of chuck area.
- **Force against gap.** A curve or table of holding force against air gap, from which the equivalent gap of Chapter 3 can be read.
- **Force against thickness.** The thickness at which the force reaches its full value, which tests the pole width against the work.
- **Material derating table.** Factors for the materials the shop actually runs.
- **Behaviour on power failure.** Whether it holds, for how long, and what the controller signals.
- **Heat while holding.** Power dissipated and the expected temperature rise in service.
- **Interfaces.** Signals for magnetised and demagnetised states, flux monitoring, and how the controller connects to the machine.
- **Face regrinding limit.** How much may be ground off the pole faces in the chuck's life.

The case's shop now sends this list with every enquiry. Comparing chucks on the answers, rather than on the catalogue's headline force, would have pointed to the electro-permanent chuck at once.

## The error: the cheaper chuck

This is an illustration. The shop's first decision was made on the total in the table: the electromagnetic chuck was A$4,650 cheaper over five years, and its purchase order was raised. Before it was placed, the shop's machine safety review, required by its procedure for any change to a machine tool, asked two questions the cost comparison had not.

The first was what happens if the power fails during a face-milling cut. The second machining centre would mill BP-600 plates with the same 125 mm face mill as the first, and the review found that the proposed controller had no means of stopping the spindle on loss of chuck power. A release at full cutting load could throw a 47 kg plate. A battery backup and an interlock would have added about A$3,000 to the electromagnetic option.

The second was what the chuck's heat would do to the holes drilled in BP-600, which are positioned relative to the rail seats. The 0.046 mm growth estimated above would have used about half the positional tolerance during warm-up, and the shop would have needed either a warm-up routine before each shift or a probing cycle to measure the plate's position on the chuck.

With the interlock added, the electromagnetic option's five-year cost rose to about A$17,956, A$1,650 less than the electro-permanent chuck, and it still added heat. The shop bought the electro-permanent chuck. The lesson recorded was that the comparison of chucks starts with what happens when the power fails, then heat, then cost.

## Exercise: a grinder's chuck

This is an illustration. For a second surface grinder, the shop compares a 600 × 300 mm electromagnetic chuck drawing 300 W, running 8 hours a day for 240 days a year, with an electro-permanent chuck of the same size switching 150 times a day at 2 Wh a pulse. Electricity costs A$0.30 per kWh including GST.

1. What is each chuck's annual energy use and cost?
2. Which properties of the electromagnetic chuck might favour it on a grinder, where they would not on a machining centre?

**Worked answer.**

1. Electromagnetic: 0.3 kW × 8 h × 240 = **576 kWh**, about **A$173** a year. Electro-permanent: 0.002 kWh × 150 × 240 = **72 kWh**, about **A$22** a year.
2. **Adjustable force and the grinder's conditions.** Variable current lets the operator hold a shimmed or thin part at low power to avoid pulling it flat (Chapter 6); grinding forces are small, so a power failure is less hazardous; and coolant flowing over the chuck, with the chuck face ground in place at its running temperature, reduces the effect of its heat. The power-failure interlock is still needed, but the balance between the types is different from the machining centre's.
