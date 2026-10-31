---
book: adhesive-bonding-by-the-numbers
chapterSlug: adhesives-and-how-they-cure
order: 5
title: "Adhesives and how they cure"
description: "The main families of engineering adhesives, mixing two-part products, working life and handling strength, cure time against temperature by Arrhenius, and cure and heat resistance."
draft: false
---

An adhesive is applied as a liquid and has to become a solid in place. How it does that, and how fast, decides how long parts must be held, how soon they can be handled, how hot the joint can later get and how much the result depends on the weather in the workshop. The chemistry varies widely between families, but the arithmetic of cure is much the same for all of them, because almost every curing reaction speeds up with temperature in the same way.

This chapter surveys the main families, explains mixing and the stages of cure, applies the Arrhenius relation to cure times, and shows the error that let Plant K move doors off their fixtures too soon on cold mornings.

## The main families

Engineering adhesives are usually grouped by chemistry, because the chemistry decides how they cure and what they tolerate.

```figure
type: compare
title: Main families of engineering adhesives
rowhead: Family
cols: How it cures | Typical strengths | Typical limits
caption: A general guide only. Products within a family vary widely, and the supplier's data sheet governs any real choice.
- * Epoxy, two-part or heat-cured one-part | reaction of resin and hardener, faster with heat | high shear strength, good on metals, low shrinkage, toughened grades resist peel | slow at low temperature, brittle unless toughened, needs careful mixing
- Acrylic and methacrylate | free-radical reaction, often with an activator or as two parts | fast, tolerant of slightly oily surfaces, bonds many plastics | odour, flammable monomers, may attack some plastics
- Polyurethane | reaction of isocyanate with polyol or with moisture | tough and flexible, good on plastics and composites | moisture-sensitive during cure, isocyanate handling
- Silane-modified polymer and silicone | moisture cure from the surface inward | very flexible, seals as it bonds, tolerates movement | low strength, slow through-cure of thick beads
- Cyanoacrylate | moisture-catalysed, seconds | instant fixing of small parts | brittle, poor gap filling, poor heat and moisture resistance
- Anaerobic | cures without air in contact with metal | locking and retaining close-fitting metal parts | needs metal and a small gap
- Hot melt | solidifies on cooling | instant handling, no cure time | softens with heat, low strength
```

For Plant K's stiffeners, the choice was a two-part toughened epoxy: high shear strength on aluminium, adequate peel resistance from its toughening, and a thin rigid bondline that makes the stiffener act with the skin. For the polycarbonate window, the plant needed movement more than strength, and Chapter 8 shows why a thick bead of an elastic polyurethane or silane-modified polymer suits it.

## Mixing two-part adhesives

A two-part adhesive cures by a reaction between its parts, and the properties of the cured adhesive depend on getting their ratio right. An epoxy with too little hardener leaves unreacted resin, which is soft and weak and absorbs water; one with too much leaves unreacted hardener, which can also weaken and embrittle it. Suppliers state the ratio by volume, by weight or both, with a tolerance.

Most production work uses cartridges with a fixed ratio and a static mixing nozzle, a tube of helical elements that splits and folds the two streams many times on their way out. Three rules make these reliable:

1. **Purge the first bead.** The first few centimetres from a new nozzle or a new cartridge are often off-ratio, because one side starts flowing before the other. Plant K discards a bead the length of a hand.
2. **Watch the colour.** Many two-part products use different colours for the two parts, so a streaky bead shows incomplete mixing.
3. **Change the nozzle at the working life.** Adhesive left in a nozzle begins to cure, and a partly cured slug pushed out later bonds nothing.

## Working life, handling strength and full cure

The cure of a reactive adhesive passes through stages with different names in different data sheets. The **working life**, also called pot life or open time, is how long the mixed adhesive stays fluid enough to apply and to wet the surfaces. The **handling strength** time is how long until the joint can be moved without disturbing it, often defined as reaching a modest fraction of full strength. The **full cure** time is how long until the adhesive reaches its full properties, often days at room temperature.

The working life quoted for a mixed mass in a cup is shorter than the open time of the same adhesive spread as a bead, because the curing reaction gives out heat. In a cup, the heat stays in, the temperature rises, the reaction speeds up and gives out more heat. A 100 g mass of a fast epoxy can become hot enough to smoke. A thin bondline between two metal sheets loses its heat as fast as it forms and cures at the temperature of the parts. That is why data sheets quote both, and why mixed adhesive should never be left in a large mass.

## Temperature and the Arrhenius relation

Nearly every chemical reaction speeds up with temperature in a way described by the Arrhenius relation. The rate is proportional to exp(−Ea ÷ RT), where Ea is the activation energy of the reaction, R the gas constant and T the absolute temperature. For two temperatures, the ratio of rates, and so the ratio of times to reach the same state of cure, is an acceleration factor that depends only on the activation energy and the two temperatures.

```figure
type: formula
title: The Arrhenius acceleration factor between two temperatures
caption: Activation energy in electronvolts with Boltzmann's constant, or in kJ/mol with the gas constant; 1 eV per molecule is 96.485 kJ/mol. Temperatures must be absolute. Times to reach the same degree of cure scale inversely with the rate.
- AF = exp[(Ea ÷ k)(1 ÷ T_low − 1 ÷ T_high)] | k = 8.617 × 10⁻⁵ eV/K
- step: t_low = AF × t_high | time at the lower temperature to match the cure at the higher
- step: Ea = 0.6 eV = 57.9 kJ/mol | an illustrative value for a curing epoxy
```

The [Arrhenius acceleration check](/tools/arrhenius-acceleration-check/) calculates this factor. It was written for accelerated life testing: from a use temperature, a test temperature and an activation energy, it gives the acceleration factor, the equivalent use-temperature hours of a test of given length, the test hours needed to cover a target, and a table of the factor for activation energies 0.1 and 0.2 eV either side of the value entered, because the result is very sensitive to it. The same factor applies to cure, with the slower temperature entered as the use temperature and the faster one as the test temperature. The tool does not know anything about adhesives; the activation energy has to come from the supplier's cure data.

### Plant K's cure data

Plant K's epoxy data sheet gave a working life of 45 minutes, handling strength in 4 hours and full cure in 7 days, all at 23 °C. It also showed cure times at two higher temperatures, from which the engineer estimated an activation energy of about 0.6 eV over that range. With that value:

- between 23 °C and 33 °C the factor is 2.16, close to the rule of thumb that cure rate doubles for every 10 °C;
- a working life of 45 minutes at 23 °C shrinks to about 26 minutes at 30 °C and about 18 minutes at 35 °C, which matters on a hot afternoon;
- curing at 60 °C for 2 hours matches, by the tool, about 27 hours at 23 °C, which more than covers handling strength and goes a long way towards full cure.

```figure
type: bars
title: Hours at 23 °C matched by 2 hours at 60 °C, for different activation energies
unit: hours
caption: From the Arrhenius acceleration check, use 23 °C, test 60 °C, 2 hours. The result changes more than fivefold across a plausible range of activation energies, which is why the value must come from the adhesive's own cure data and why a heat cure is confirmed by testing.
- 0.4 eV | 11
- 0.5 eV | 18
- * 0.6 eV | 27
- 0.7 eV | 42
- 0.8 eV | 65
```

### Cure temperature and heat resistance

Temperature during cure also sets how heat-resistant the cured adhesive is. As an epoxy cures, its glass transition temperature Tg rises, and once Tg approaches the cure temperature the reaction slows sharply, because the molecules can no longer move freely enough to find each other. A room-temperature cure therefore tends to leave an adhesive whose Tg is not far above the temperature it cured at, and a joint that softens noticeably when it gets hot. A post-cure at a higher temperature lets the reaction continue and raises Tg.

This mattered for Plant K. A dark-coloured kiosk door in summer sun can reach 70 °C or more. The plant's epoxy data sheet showed a much higher Tg after a heat cure than after a room-temperature cure. The plant decided to pass every stiffened door through its powder-coat curing oven on the way to painting, a heat cure it would have had anyway, and checked with the supplier that the oven's temperature and time were within the adhesive's limits.

### Moisture-curing adhesives cure from the outside in

The window adhesive behaves differently. A one-part polyurethane or silane-modified polymer cures by reacting with water vapour from the air, which has to diffuse into the bead through the layer that has already cured. The cured skin thickens roughly with the square root of time, as diffusion-controlled processes do, so doubling the depth takes four times as long. Data sheets usually quote a cure rate such as "3 mm in 24 hours" at a stated temperature and humidity.

Taking that illustrative rate, the cure depth is about 3 ÷ √24 = 0.612 mm per square-root hour. The window bead is 20 mm wide, sandwiched between the door and the polycarbonate, and air reaches it only from its inner and outer edges. Each half of the width, 10 mm, has to cure from its own edge, which takes about (10 ÷ 0.612)² = 267 hours, roughly 11 days at the data sheet's conditions. A 5 mm depth takes only 67 hours, which is why a moisture-curing bead develops useful strength in a few days but reaches full strength much later.

Three practical consequences follow. A moisture-curing adhesive cures slowly in dry air, so a winter workshop with low humidity slows it, as well as low temperature. A bead enclosed on all sides, for example under a metal plate with no exposed edge, may never cure in the middle. And a joint should not carry its full load until the adhesive has cured right through, so the plant supported each window with locating blocks until its doors left the plant, and the cabinets were not shipped for a week after window fitting. For faster production, two-part versions of the same chemistries cure through the whole bead at once.

## The error: data-sheet times in a cold shop

In the plant's first winter of bonding, several doors were found with stiffeners slightly out of position, and two showed weak bonds in the coupons bonded alongside them. The doors had been taken off the bonding fixture after 4 hours, the handling time on the data sheet, and stacked.

The data sheet's 4 hours applied at 23 °C. On winter mornings the workshop was at about 12 °C, and the parts and adhesive were at the same temperature. Entering a use temperature of 12 °C, a test temperature of 23 °C and a duration of 4 hours, the Arrhenius acceleration check gives a factor of 2.48 and an equivalent of about 10 hours: the adhesive needed about 9.9 hours at 12 °C to reach the state it would reach in 4 hours at 23 °C. At 4 hours, it was well short of handling strength, and stacking moved the stiffeners.

```figure
type: compare
title: Plant K's epoxy cure times at the workshop's temperature
rowhead: Stage
cols: At 23 °C (data sheet) | At 18 °C | At 12 °C
caption: This is an illustration. Times scaled by the Arrhenius factor with Ea = 0.6 eV, from the Arrhenius acceleration check. At 12 °C the factor is 2.48, but with a plausible range of 0.4 to 0.8 eV it lies between 1.83 and 3.35, so the scaled times are estimates to be confirmed by coupons.
- Working life | 45 min | about 67 min | about 111 min
- * Handling strength | 4 h | about 6 h | about 10 h
- Full cure | 7 days | about 10.5 days | about 17 days
```

Below some temperature, which the data sheet states, many epoxies barely cure at all, and the Arrhenius scaling no longer holds. Even above it, a cold cure may leave the adhesive with lower final properties. The plant made three changes. It put a thermometer on the bonding fixture and a table of handling times against temperature beside it. It installed a small heater in the bonding bay to hold the fixtures and parts at 20 °C or above. And it moved bonded doors through the curing oven as soon as they reached handling strength, so that the heat cure did the rest.

### Confirming the cure

A scaled time is an estimate. The plant confirmed its cure schedule in two ways: lap shear coupons bonded and cured alongside production at the actual workshop temperature, tested at the planned handling time and after the oven cure, and an occasional hardness check on a bead of adhesive squeezed out at the edge of a stiffener, compared with a bead cured under known conditions. Neither proves the bond is strong, which needs the tests of Chapter 10, but both catch a cure that has gone wrong. Both are cheap, take minutes, and are recorded with the door number, the bay temperature and the cartridge batch, so that any later problem can be traced to the conditions on the day.

## How this applies to a small Australian business

Choose the adhesive family for the job's main demand: strength and rigidity, movement, speed or sealing. Purge mixing nozzles, watch bead colour and never leave mixed adhesive in a mass. Data-sheet cure times apply at the stated temperature; scale them with the Arrhenius relation for your workshop, using an activation energy from the supplier's data, and confirm with coupons. In hot weather working life shortens; in cold weather handling time lengthens. If the joint will get hot in service, ask the supplier how cure temperature affects the adhesive's heat resistance.

## Exercise: a summer afternoon

On a summer afternoon Plant K's bonding bay reaches 34 °C. (a) Using Ea = 0.6 eV, what is the epoxy's working life, if it is 45 minutes at 23 °C? (b) An operator takes about 25 minutes to dispense and place the stiffeners on two doors from one mixing nozzle. Is that safe? (c) What would you change?

**Worked answer.** (a) The acceleration factor from 23 °C to 34 °C is exp[(0.6 ÷ 8.617 × 10⁻⁵)(1 ÷ 296.15 − 1 ÷ 307.15)] = **2.32**, so the working life is 45 ÷ 2.32 = **about 19 minutes**. (b) **No**: adhesive dispensed after about 19 minutes from one nozzle, and especially adhesive that has sat in the nozzle, will have begun to gel and will wet the surfaces poorly. (c) Work one door per nozzle, or change the nozzle after each door; keep cartridges in a cooler place until use; and if the bay is often this hot, consider a slower-curing grade for summer, or cool the bay. The working life should be checked against the real time the task takes, with a margin.
