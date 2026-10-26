---
book: heat-pumps-and-refrigeration-by-the-numbers
chapterSlug: the-second-law-and-its-limits
order: 1
title: "The second law and its limits"
description: "Understand the second law in practical terms: heat flows downhill, entropy and irreversibility, the Carnot limit on turning heat into work, energy quality, and checking claims against the limit."
draft: false
---

The first law of thermodynamics says energy is conserved: it can change form but not appear or vanish. It is the law behind every energy balance in this series of books. On its own, though, it would allow things that never happen: a cup of coffee that gets hotter by drawing heat from a cooler room, or an engine that turns all the heat from its fuel into work and rejects nothing. The second law rules those out. It says which way heat flows by itself, how much of a quantity of heat can ever be turned into work, and how much work it takes to push heat the other way. For anyone choosing or judging heat pumps, refrigeration, engines or heat recovery, it is the most useful law there is, because it puts a hard ceiling on what any machine can do.

This chapter sets out the second law in practical terms. It explains which way heat flows, introduces entropy as the quantity that keeps score, derives the Carnot limit on turning heat into work, explains why a kilowatt-hour of electricity is worth more than a kilowatt-hour of warm water, and shows how to use the limit to test a claim. The failure case is a proposal to generate electricity from the factory's warm waste water at an efficiency the second law forbids.

## Heat flows downhill

Heat flows by itself from hotter to colder, never the other way. That is the oldest statement of the second law, and it is everyday experience: a hot pipe warms the room, a cold room warms towards the air outside. To move heat from colder to hotter, from the inside of a cold room to the warm air outside, or from cool outdoor air into hot water, a machine must do work on it, and that work costs energy. Refrigerators and heat pumps are such machines.

The same law says that an engine taking heat from a hot source cannot turn all of it into work. It must reject some of the heat to something colder. A steam turbine rejects heat to its condenser, a car engine to its radiator and exhaust. No cleverness avoids this; it is built into how heat and work differ.

## Entropy keeps the score

The quantity that expresses the second law is **entropy**. For practical purposes, two facts are enough:

- heat **Q** crossing a boundary at absolute temperature **T** carries entropy **Q ÷ T** with it;
- in any real process, the total entropy of everything involved **increases**; in an ideal, reversible process it stays the same; it never decreases.

Consider HW-60's hot water losing heat through its insulation, the case from *Heat Transfer by the Numbers*. Suppose 10 kW leaves water at 85 °C, **358.15 K**, and arrives in a room at 20 °C, **293.15 K**. The water loses entropy at **10,000 ÷ 358.15 ≈ 27.9 W/K**; the room gains entropy at **10,000 ÷ 293.15 ≈ 34.1 W/K**. The total rises by about **6.2 W/K**. Energy is conserved, 10 kW out and 10 kW in, but entropy has been created. That creation of entropy, called **irreversibility**, is the mark of every real process: friction, mixing, heat flowing across a temperature difference, throttling.

```figure
type: formula
title: Entropy created when 10 kW flows from 85 °C water to a 20 °C room
formula: entropy created = Q ÷ T_cold − Q ÷ T_hot, temperatures in kelvins
caption: This is an illustration. Energy is conserved; entropy is not. The created entropy, multiplied by the surroundings' temperature, is the work that an ideal engine could have produced from the same heat flow, and which is now lost.
- Heat flow Q | 10,000 W
- Hot side | 85 °C = 358.15 K
- Cold side | 20 °C = 293.15 K
step: entropy created = 10,000 ÷ 293.15 − 10,000 ÷ 358.15 ≈ 34.1 − 27.9 ≈ 6.2 W/K
step: lost work potential = 293.15 × 6.2 ≈ 1,815 W
```

Multiplied by the surroundings' temperature, the entropy created gives the **work that was lost**: the most work an ideal engine could have produced from that heat flow, had it been placed between the water and the room. Here it is about 1.8 kW out of the 10 kW of heat. That is the second law's measure of waste.

## The Carnot limit on engines

An ideal engine, with no friction, no mixing and heat transferred across vanishingly small temperature differences, is called a Carnot engine. Taking heat from a source at **T_hot** and rejecting it at **T_cold**, it turns the largest possible fraction of the heat into work:

**Carnot efficiency = 1 − T_cold ÷ T_hot**, temperatures in kelvins.

The limit depends only on the two temperatures. It is low when they are close and high when they are far apart.

```figure
type: bars
title: The most work that can be extracted from heat at different temperatures, rejecting to 20 °C
unit: % of the heat
max: 40
caption: Carnot efficiency, 1 − 293.15 ÷ T_hot. Real engines achieve only a fraction of these limits; low-temperature heat can never yield much work.
- Warm waste water, 60 °C | 12.0
- Hot water, 85 °C | 18.1
- Steam, 170.4 °C | 33.9
```

Steam from SV-8's boiler, at 170.4 °C, could at most turn about **34%** of its heat into work with a 20 °C surroundings. Hot water at 85 °C, about **18%**. Warm waste water at 60 °C, only about **12%**. Real engines achieve a fraction of their Carnot limit, perhaps around half for good large machines, and much less for small ones working with low temperatures. That is why power stations use the highest temperatures their materials allow, and why converting low-temperature waste heat into electricity is rarely worthwhile.

## Energy quality

The second law shows that energy comes in different qualities. A kilowatt-hour of electricity can be turned entirely into work, or into heat at any temperature. A kilowatt-hour of heat at 85 °C can yield at most about 0.18 kWh of work. A kilowatt-hour of heat at room temperature can yield none. Engineers call the useful part of energy its **exergy**: the work it could ideally produce in given surroundings.

That changes how energy use should be judged. Burning gas at a flame temperature of well over a thousand degrees to make water at 85 °C uses high-quality energy for a low-quality job, even if the boiler is 85% efficient in first-law terms. Using electricity in a resistance heater to warm water does the same. A **heat pump** uses a smaller amount of high-quality electricity to lift a larger amount of low-quality heat from the surroundings to a useful temperature, which is why it can deliver more heat than the electricity it uses. Chapter 2 puts numbers on how much more.

```figure
type: compare
title: Energy forms by quality, with surroundings at 20 °C
cols: Work available from 1 kWh, at most | Good uses
caption: This is an illustration. Electricity and fuel are high quality; low-temperature heat is low quality. Matching quality to need is the second law's practical lesson.
- Electricity | 1 kWh | motors, controls, driving heat pumps
- Fuel burned at a high flame temperature | most of 1 kWh, depending on the temperature reached | high-temperature processes, power generation
- Steam at 170.4 °C | about 0.34 kWh | process heating, cooking, sterilising
- Hot water at 85 °C | about 0.18 kWh | washing, space heating
- *Warm water at 30 °C | about 0.03 kWh | preheating, a heat pump's heat source
```

## Where irreversibility hides in a factory

Every real process creates entropy, but some create far more than others, and they are where the second law's waste is greatest. In a typical food factory:

- **Burning fuel to heat water.** The flame is at well over a thousand degrees, the water at 85 °C. The heat crosses an enormous temperature difference, creating a great deal of entropy, even though the boiler's first-law efficiency looks good.
- **Throttling.** Steam reduced in pressure through a valve, as in *Process Steam by the Numbers*, keeps its energy but loses some of its ability to do work.
- **Mixing.** Hot water mixed with cold to make warm water, or hot and cold streams mixed in a drain, destroys the temperature difference that could have driven a heat exchanger.
- **Electric resistance heating.** A kilowatt-hour of electricity, the highest-quality energy, turned into a kilowatt-hour of low-temperature heat.

None of these is wrong in itself; each is often the practical choice. But each is a place to look for improvement: heat recovery, heat pumps, better-matched temperatures.

## Machines in reverse

A refrigerator or heat pump is an engine run backwards: work goes in, and heat is moved from a cold place to a hot one. The second law sets a limit here too, also depending only on the two temperatures, and that limit is the subject of Chapter 2. The closer together the temperatures, the less work it takes to move each kilowatt of heat. That one principle explains most of what follows: why heat pumps are efficient for warm water and less so for very hot water, why a cold room costs more to run in summer, and why a dirty condenser wastes electricity.

## The two laws together

The first and second laws answer different questions, and both are needed. The first law is an accounting rule: every kilowatt in equals every kilowatt out, plus any change in what is stored. It gives the energy balance of a boiler, a heat exchanger or a cold room. The second law is a feasibility rule: it says which of the balanced outcomes can actually happen, and how close to ideal any real machine can come. A design that balances under the first law can still be impossible under the second. A refrigerator that moved 10 kW of heat out of a cold room using 1 kW of electricity, and rejected 11 kW outside, would balance perfectly; whether it is possible depends on the temperatures, as Chapter 2 shows. Engineers check both.

## Real machines fall short

The Carnot limits assume ideal machines: no friction, no pressure drops, and heat crossing infinitesimally small temperature differences, which would need infinitely large heat exchangers. Real machines have friction in their compressors and turbines, pressure losses in their pipes and valves, and finite heat exchangers that need real temperature differences to move heat at a useful rate. They therefore achieve only a fraction of the Carnot limit. For refrigeration and heat pumps, this book uses a fraction of **0.5** as a teaching value. The real fraction for a particular machine at particular conditions comes from its maker's tested data, and it varies with the machine's size, type, design and load. The Carnot calculation tells you the ceiling; the maker's data tell you how far below it a real machine sits.

## Using the limit to check claims

The Carnot limits are a powerful screening tool. Any claim of an engine, heat recovery device or refrigeration system that beats them is wrong, without needing to know how the device works. Claims that come close to them deserve scrutiny, because real machines fall well short. A quick calculation with the two temperatures, in kelvins, settles many questions before any money is spent. The same check works in reverse for refrigeration and heat pumps, using the limits in Chapter 2: a claimed performance above the Carnot figure for the stated temperatures is impossible, and one close to it is unlikely.

## A failure case: electricity from warm water

This is an illustration. A supplier approached the food factory with a system to generate electricity from its warm waste water. The brochure stated that the unit would convert **30%** of the heat in the factory's 60 °C waste water into electricity, rejecting heat to the 20 °C air.

The maintenance engineer checked it against the second law. Between 60 °C and 20 °C, the Carnot efficiency is **1 − 293.15 ÷ 333.15 ≈ 12.0%**. No device of any kind can convert more than 12% of that heat into work, and a real one would achieve perhaps half of that or less. The claimed 30% was more than double the absolute limit.

The detection came from a two-line Carnot calculation. The supplier, asked to explain, said the figure referred to a different application with much hotter heat. The business did not proceed, and asked for the supplier's figures at its own temperatures in writing, which never arrived. It used the waste water instead to preheat incoming water through the heat recovery exchanger described in *Heat Transfer by the Numbers*, which uses the heat as heat, at its own temperature, and needs no second-law miracle.

## How this applies to a small Australian business

Use the second law as a quick check. Heat flows downhill by itself; moving it uphill costs work. No engine can convert more than 1 − T_cold ÷ T_hot of its heat into work, with temperatures in kelvins, and real ones achieve much less. Low-temperature heat is best used as heat, directly, not converted to electricity. Value energy by its quality, and prefer machines, such as heat pumps, that use high-quality energy to move low-quality heat. And test any claim that sounds too good against the Carnot limit before reading further.

## Exercise: a hotter waste stream

A process exhausts **100 kW** of heat in hot air at **150 °C**. With surroundings at 20 °C, what is the most work that could ideally be extracted? If a real system achieved half of the Carnot limit, how much electricity would it produce? How does that compare with using the heat directly to preheat water at 100 kW?

**Worked answer.** The Carnot efficiency is **1 − 293.15 ÷ 423.15 ≈ 30.7%**, so at most about **30.7 kW** of work could be extracted. At half the limit, a real system would produce about **15.4 kW** of electricity. Used directly, the same exhaust could deliver close to its full 100 kW as useful heat, if there is a matching need for heat. Converting to electricity makes sense only where electricity is the scarce, valuable output and there is no use for the heat itself.
