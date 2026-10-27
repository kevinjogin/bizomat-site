---
book: contact-temperature-sensors-by-the-numbers
chapterSlug: what-a-sensor-reads
order: 1
title: "What a contact sensor actually reads"
description: "A sensor reports its own temperature. The heat balance that sets it, air against metal temperature in CV-180's cure oven, and a cure timed from the wrong reading."
draft: false
---

A contact temperature sensor never measures the temperature of anything else. It measures its own. A thermocouple junction makes a voltage that depends on the temperature of its wires, a platinum resistance thermometer changes resistance with the temperature of its platinum, and a thermistor does the same with its ceramic. If the sensor's tip is at the same temperature as the air, metal or liquid around it, the reading tells you about that air, metal or liquid. If it is not, the reading tells you only about the sensor, however many decimal places the display shows.

This chapter sets out why a sensor settles where it does, using a simple heat balance, and what that means for the four sensors in CV-180's cure oven. It then separates two temperatures that are easy to confuse in any oven, the air temperature and the metal temperature, shows how far apart they are for CV-180's parts, and ends with a cure that was timed from the wrong one.

## Temperature is what is equal at equilibrium

Physics defines temperature through what happens when two things are put in thermal contact. Energy flows from one to the other until a state is reached in which no further net flow occurs, and at that point the two have the same temperature. Statistical physics makes this precise: temperature is set by how quickly the number of ways a system can arrange its energy grows as energy is added, and two systems in contact share energy until that rate is the same for both. For an engineer the practical consequence is simpler. A sensor's reading means something only when the sensor has come to equilibrium with the thing it is meant to measure, and only to the extent that it has not also come partly to equilibrium with something else.

That second condition is the one that causes trouble. A sensor in an oven is in thermal contact with many things at once: the air flowing past it, the walls and heating elements it can see, the cooler mounting it passes through, and, for a resistance sensor, its own measuring current. It settles at the temperature where the heat flowing in from the hotter things equals the heat flowing out to the cooler ones. That temperature is a weighted average of everything it is connected to, and the weights are thermal conductances.

## The sensor's heat balance

Each path by which heat reaches the sensor can be described by a thermal conductance G, in watts per kelvin: the heat that flows along that path for each kelvin of temperature difference. Convection from air has a conductance of h × A, the surface coefficient times the sensor's wetted area. Conduction along the sheath to a cooler mounting has a conductance set by the sheath's material, cross-section and length. Radiation from walls and elements has a conductance that rises steeply with temperature. At steady state, the sensor's temperature is the conductance-weighted average of the temperatures at the other ends of those paths.

```figure
type: formula
title: Steady temperature of a sensor coupled to several surroundings
formula: Ts = (G₁T₁ + G₂T₂ + …) ÷ (G₁ + G₂ + …)
caption: This is an illustration. A sensor settles at the conductance-weighted average of everything it exchanges heat with. A small coupling to a much cooler place can still pull the reading down by several kelvin.
- Ts | sensor temperature, °C
- G | thermal conductance of each path, W/K
- T | temperature at the far end of each path, °C
step: Air at 200 °C, G = 0.050 W/K; mounting at 80 °C, G = 0.001 W/K: Ts = (0.050 × 200 + 0.001 × 80) ÷ 0.051 = 197.65 °C
step: Same, with a poor installation, mounting G = 0.005 W/K: Ts = (10.0 + 0.4) ÷ 0.055 = 189.09 °C
```

The first step in the figure is CV-180's control sensor in an assumed, reasonable installation: its coupling to the air is fifty times its coupling to the cooler mounting where it passes through the oven wall, and it reads about 2.4 K low. In the second, the coupling to the mounting is five times larger, as it would be with a shorter immersion or a heavier fitting, and the sensor reads nearly 11 K low. Nothing has gone wrong with the sensor in either case; it is reporting its own temperature correctly. Chapter 7 turns this into a calculation of how deep a sensor must be immersed, and how radiation from hot elements can push a reading the other way.

The heat balance also explains why a sensor reading changes when nothing in the oven has changed. A fan that slows reduces the air's conductance, so the mounting's share grows and the reading falls. A door opened near the sensor changes what the sensor can see. A measuring current that is too large adds a heat source inside the sensor. Each of these is a change in the weights, and the sensor follows them faithfully.

## What CV-180's sensors are coupled to

CV-180 has four kinds of contact sensor, and each is coupled to a different mixture of things. The table sets out what each is meant to measure and what else it is connected to.

```figure
type: compare
title: CV-180's contact sensors and what they exchange heat with
cols: Meant to measure | Also coupled to | Main error if ignored
caption: This is an illustration. Each sensor reads a weighted average of its surroundings; the right installation makes the intended temperature dominate.
- Pt100 in the supply air duct | supply air temperature | duct wall and the mounting at the oven skin; elements it can see | reads low by conduction or high by radiation
- Type K for the over-temperature limit | hottest air in the working space | the same, plus slower response through its sheath | trips late on a fast rise
- Trailing type K on a part | metal temperature of the part | the air around the junction and its own lead wire | reads between air and metal
- Thermistor on the logger terminals | temperature of the thermocouple terminals | the logger's electronics and its own current | cold-junction error in every channel
```

The trailing thermocouples deserve particular attention because they are what decides whether a load is cured. A thermocouple taped or clipped to a part is coupled to the metal through its contact and to the air through its exposed surface. If the air is hotter than the metal, as it is for most of the cure, the junction reads somewhere between them, and the reading is high. Good attachment keeps the metal's weight large and the air's small, which is why Chapter 7 compares clips, magnets and peened junctions.

### Resolution is not accuracy

CV-180's controller displays the air temperature to a tenth of a degree, and its logger shows each channel to a tenth as well. That resolution says how finely the instrument divides its reading, not how close the reading is to the truth. A class A Pt100 at 200 °C may be up to 0.55 K from the standard resistance curve before anything else is counted, and a class 1 type K thermocouple may be up to 1.5 K from its reference function, as Chapters 3 and 4 explain. The installation errors of this chapter, a few kelvin from a cool mounting or from a junction that sees hot air as well as metal, are larger still. A reading of 200.3 °C therefore means "somewhere near 200 °C, by an amount not yet known", until the sensor, its wiring and its installation have each been examined.

The habit worth forming is to ask, for every displayed temperature, three questions in order: what is the sensor's tip coupled to, how far is the tip from equilibrium with the thing of interest, and how well does the instrument convert the tip's temperature into a number. Most people start with the third, because it is printed on a data sheet. In CV-180, as in most installations, the first two are larger, and Chapter 9 shows how to put all three into one uncertainty budget.

## Air temperature and metal temperature

The controller holds the air at 200 °C. The powder needs the metal at 180 °C for 10 minutes. These are different temperatures, and between them lies the time it takes each part to heat up.

A thin steel part in moving hot air heats almost uniformly through its thickness, so it can be treated as a single lump whose temperature rises towards the air temperature with a time constant τ. For a flat part heated on both faces, τ = ρc(t/2)/h, where ρ is the steel's density, c its specific heat, t its thickness and h the surface coefficient. The time to rise from a starting temperature T₀ to a target T in air at T∞ is then τ × ln((T∞ − T₀)/(T∞ − T)). [The lumped part](/reados/publications/heating-and-cooling-times-by-the-numbers/the-lumped-part/) in *Heating and Cooling Times by the Numbers* sets out the model and its limits; here it is used only to show how far apart the air and the metal can be.

This is an illustration. With ρ = 7,850 kg/m³, c = 490 J/kg·K and an assumed surface coefficient of 25 W/m²·K in CV-180's recirculating air, starting at 25 °C in 200 °C air, the factor ln(175/20) = 2.169, and:

- a **1.2 mm** panel has τ = 92 s and reaches 180 °C in about **200 s**, or 3.3 minutes;
- a **3 mm** bracket has τ = 231 s and reaches 180 °C in about **501 s**, or 8.3 minutes;
- a **10 mm** base plate has τ = 769 s and reaches 180 °C in about **1,669 s**, or 27.8 minutes.

```figure
type: bars
title: Time for CV-180's parts to reach 180 °C in 200 °C air
unit: min
max: 30
caption: This is an illustration, with h = 25 W/m²·K and a 25 °C start. The air sensor reads 200 °C long before the heavy plate reaches its cure temperature.
- 1.2 mm panel | 3.3
- 3 mm bracket | 8.3
- * 10 mm base plate | 27.8
```

The air sensor reaches 200 °C within a few minutes of the door closing, because the air heats quickly and the sensor's own time constant, as Chapter 8 shows, is a couple of minutes at most. So for most of a heavy part's heating, the controller's display shows 200 °C while the part is far below 180 °C. The display is right about the air. It says nothing about the steel.

The surface coefficient matters as much as the thickness. If the plate sits where the airflow is stronger and h is 35 W/m²·K, its time constant falls to 550 s and it reaches 180 °C in about 19.9 minutes instead of 27.8. If it sits in a sheltered corner, it takes longer. That is why a cure is proved by measuring the metal on real parts in real positions, not by calculating from an assumed coefficient, and why Chapter 10 ends with a survey.

### Which temperature each job needs

Each of CV-180's measurement jobs needs a different temperature, and choosing the wrong one is a more common error than any sensor fault.

```figure
type: decision
title: Which temperature does the job need?
question: What is the measurement for?
caption: The controller and the limit work on air; the cure works on metal. One reading cannot serve both.
- Holding the oven steady | air temperature at the supply, where it responds quickly to the heaters | Pt100 in the supply duct, to the controller
- Protecting the oven and load from overheating | hottest air, independent of the controller | type K to a separate limit controller
- *Proving the powder is cured | metal temperature of the slowest part, for the stated time | trailing thermocouples attached to parts
- Correcting the thermocouples' cold junction | temperature of the logger's terminals | thermistor at the terminals
```

The control sensor is put in the air for good reasons. The air responds quickly to the elements, so the control loop can be tuned tightly; a sensor in a heavy part would lag so much that the controller would overshoot. The limit sensor is in the air because it protects the oven, and it is independent of the controller so that a failure of one does not disable the other. The cure measurement is in the metal because the powder cares about nothing else.

## The error: a cure timed from the air sensor

This is an illustration. When CV-180 was first commissioned, its operators were told that the powder needed 10 minutes at 180 °C. The oven's controller showed the air temperature, which was the only temperature on display, so the operators set the oven to 200 °C, loaded the parts, and started a 10-minute timer when the display came back to 200 °C after the door closed, which took about 2 minutes. Every load spent about 12 minutes in the oven.

The light panels were well cured: at 720 seconds a 1.2 mm panel is within a tenth of a kelvin of 200 °C. The 3 mm brackets reached about 192 °C, so they had about 3.7 minutes above 180 °C instead of 10. The frames with 10 mm base plates reached only about **131 °C** by the time they were unloaded. Their coating looked the same as the panels' coating when it came out, but it was soft.

The problem was found three weeks later, when a customer reported that the coating on a batch of frames marked easily and came away at the bolt holes. A solvent rub test on retained frames failed, while panels from the same loads passed. The business borrowed a data logger, attached trailing thermocouples to a panel, a bracket and the middle of a base plate, and ran a normal cycle. The traces showed the plate still climbing through 130 °C when the timer sounded, and reaching 180 °C after about 28 minutes, in close agreement with the lumped estimate.

The correction had three parts. The cure was redefined as 10 minutes **after the slowest part reaches 180 °C**, measured on the slowest part. Heavy frames were given their own cycle of about 38 minutes, while panel loads kept a short cycle, rather than every load running the heavy-part time. And a profile with trailing thermocouples became part of setting up any new part family, which is the routine Chapter 10 describes. The air sensor was not changed; it had never been wrong.

```figure
type: checklist
title: Checks before trusting any contact reading
caption: Each line asks whether the sensor's own temperature is the one the job needs. The open line is this chapter's error.
- x The quantity the job needs is named | air, metal, liquid or surface
- x The sensor is coupled mainly to that quantity | by immersion, contact or position
- x The sensor has had time to settle | its time constant against the process's changes
- x Other couplings are known and small | mounting, radiation, self-heating
- ? The reading is used for the job it measures | cure timed from air temperature: frames 49 K short
```

## How this applies to a small Australian business

Many small coating, heat-treating, food and plastics businesses run on a single displayed temperature that comes from an air sensor in the equipment, and on times set by someone years ago. The first useful step costs little: for each product family, write down which temperature the process actually needs, and ask whether anything in the business measures it. Where the answer is no, a borrowed or hired data logger with a few trailing thermocouples, run once on the slowest part, turns an inherited time into a measured one. Coating makers' data sheets state their cure schedules in terms of metal temperature, and customers who test adhesion or solvent resistance will test the heaviest part they bought.

## Exercise: a 6 mm frame

CV-180 is asked to coat frames with 6 mm base plates. Using the same assumptions (ρ = 7,850 kg/m³, c = 490 J/kg·K, h = 25 W/m²·K, 25 °C start, 200 °C air), how long will the plate take to reach 180 °C, and what total oven time does a 10-minute cure need? What would the original timer method have given the plate?

**Worked answer.** The half-thickness is 3 mm, so τ = 7,850 × 490 × 0.003 ÷ 25 = **462 s**. The time to reach 180 °C is 462 × ln(175/20) = 462 × 2.169 = **1,001 s**, about **16.7 minutes**. With a 10-minute cure after that, the plate needs about **26.7 minutes** in the oven, plus a margin for loading position and for the time the oven air takes to recover after the door closes, which Chapter 10's survey measures.

The original method gave every load about 12 minutes. At 720 s the 6 mm plate would have reached 200 − 175 × e^(−720/462) = about **163 °C**, below the cure temperature for the whole cycle. The answer to the exercise is the same as the lesson of the chapter: the air sensor was right, and the cure was timed from a temperature the powder never sees.
