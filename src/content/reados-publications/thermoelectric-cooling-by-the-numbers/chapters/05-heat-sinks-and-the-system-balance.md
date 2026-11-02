---
book: thermoelectric-cooling-by-the-numbers
chapterSlug: heat-sinks-and-the-system-balance
order: 5
title: "Heat sinks and the system balance"
description: "The thermal circuit from outside air to cabinet air, how the exchangers add to the modules’ temperature difference, solving the balance, and why a dusty heat sink can cost a quarter of the cooling."
draft: false
---

A thermoelectric module never sees the temperatures the job is defined by. The cabinet must be held at 35 °C against 45 °C outside, a difference of 10 K, but the modules' faces are separated from the air on each side by heat exchangers that need a temperature difference of their own to move heat. The hot-side sink must run warmer than the outside air to reject heat to it, and the cold-side exchanger colder than the cabinet air to draw heat from it. Those two differences add to the job's, and the modules must hold all three.

This chapter sets out the thermal circuit of the cabinet cooler, solves the balance between modules and exchangers, shows how much of the modules' temperature difference the exchangers create, and finishes with a hot-side sink clogged with Riverland dust that let the cabinet climb past its limit.

## The thermal circuit

Heat flows in one direction through the cooler. It leaves the cabinet air, crosses the cold-side exchanger's fins and base and a layer of thermal grease to the modules' cold faces, is pumped through the modules, gains the modules' electrical power, and crosses the hot faces, another grease layer and the hot-side sink to the outside air. Each exchanger can be described by one number, its thermal resistance: the temperature difference across it per watt of heat it carries.

```figure
type: formula
title: The cooler's thermal circuit
formula: Hot face: T_h = T_outside + θ_h × Q_h        with Q_h = Q_c + P
formula: Cold face: T_c = T_cabinet − θ_c × Q_c
formula: Modules: Q_c and P from S, R, K, the current and (T_h − T_c)
caption: θ_h and θ_c are the thermal resistances of the hot-side and cold-side exchangers, each including its grease layer, from module faces to air. The three equations depend on each other and are solved together.
- θ_h, θ_c | exchanger thermal resistances, K/W
- Q_h | heat rejected at the hot side, W
- Q_c | heat pumped from the cold side, W
```

The equations are coupled: the face temperatures depend on the heat flows, and the heat flows depend on the face temperatures. They are solved by iteration. Guess the face temperatures, calculate the module's heat flows, recalculate the face temperatures from the exchangers, and repeat. For CC-1 the answer settles within a few rounds, and a spreadsheet or a few lines of code does it in a moment. The thermoelectric cooler check evaluates one round: given face temperatures, it returns the heat flows. Using it with a hand iteration, entering each round's face temperatures, converges to the same answer.

## CC-1's exchangers

CC-1's hot-side sink is an aluminium extrusion with a fin area of about 0.35 m² and a 24 V axial fan blowing outside air across it. With a heat transfer coefficient of about 30 W/(m²·K) on the fins and a fin efficiency of 0.95, its resistance from base to air is 1 ÷ (30 × 0.35 × 0.95) = 0.100 K/W, including a small allowance for the grease layer under the modules. The cold-side exchanger inside the cabinet is smaller, with its own fan circulating the cabinet air, and has a resistance of 0.12 K/W.

With the 24 V supply giving 8.0 V across each of the three series modules, 45 °C outside and the cabinet held at its 35 °C limit, the balance settles at the design point used since Chapter 3.

```figure
type: stats
title: CC-1's balance at 45 °C outside with the cabinet at 35 °C
caption: This is an illustration. Three modules in series at 8.0 V each; θ_h = 0.10 K/W; θ_c = 0.12 K/W. Hot side rises 143.1 × 0.10 = 14.3 K above the outside air; cold side falls 66.4 × 0.12 = 8.0 K below the cabinet air.
- 3.20 A | current through the modules
- 59.3 °C / 27.0 °C | hot and cold faces
- 32.3 K | difference the modules hold
- 66.4 W | heat pumped from the cabinet
- 76.7 W / 143.1 W | power drawn and heat rejected outside
- 0.865 | COP
```

### Where the modules' temperature difference comes from

The modules hold 32.3 K. Only 10 K of it is the job, the difference between outside air and cabinet air. The hot-side sink adds 14.3 K, and the cold-side exchanger adds 8.0 K. More than two-thirds of the difference across the modules is created by the exchangers.

```figure
type: bars
title: What makes up the 32.3 K across CC-1's modules
unit: K
max: 16
caption: This is an illustration. The job's 10 K is fixed by the cabinet's limit and the outside air. The other 22.3 K is set by the two exchangers' resistances and the heat they carry.
- * Hot-side sink: 143.1 W × 0.10 K/W | 14.3
- The job: 45 °C outside to 35 °C inside | 10.0
- Cold-side exchanger: 66.4 W × 0.12 K/W | 8.0
```

That is why the heat sinks matter so much. Chapter 3 showed that each kelvin across a module costs about 0.53 W of heat pumped by conduction. The hot-side sink's 14.3 K costs each module about 7.5 W, and across three modules more than 22 W, a third of the cooler's capacity. A better sink is often a cheaper way to more cooling than another module.

## How much the sinks are worth

The value of each exchanger shows most clearly in where the cabinet settles on a 45 °C day, with the heat load rising as the cabinet cools: 48 W from the electronics and fans plus 1.129 W per kelvin through the insulated walls, from Chapter 6.

```figure
type: compare
title: Where TC-1 settles at 45 °C outside, for different exchangers
cols: Cabinet air | Hot face | Heat pumped | Power | COP
rowhead: Exchangers
- Hot 0.05 K/W, cold 0.12 K/W | 29.0 °C | 52.2 °C | 66.1 W | 77.4 W | 0.85
- * Hot 0.10 K/W, cold 0.12 K/W: CC-1 as built | 32.5 °C | 58.8 °C | 62.1 W | 75.8 W | 0.82
- Hot 0.15 K/W, cold 0.12 K/W | 35.8 °C | 64.9 °C | 58.4 W | 74.3 W | 0.79
- Hot 0.20 K/W, cold 0.12 K/W | 38.9 °C | 70.6 °C | 55.0 W | 72.9 W | 0.75
- Hot 0.10 K/W, cold 0.06 K/W | 30.2 °C | 59.1 °C | 64.7 W | 76.4 W | 0.85
- Hot 0.10 K/W, cold 0.24 K/W | 36.7 °C | 58.2 °C | 57.4 W | 74.8 W | 0.77
caption: This is an illustration. Three modules at 8.0 V each; the current settles at about 3.0 to 3.2 A. As built, the cabinet settles at 32.5 °C, within 0.2 K of Chapter 4's constant-current figure.
```

Halving the hot-side resistance to 0.05 K/W, with a larger sink or a stronger fan, cools the cabinet by a further 3.5 K for essentially the same power. Doubling it to 0.20 K/W takes the cabinet to 38.9 °C, beyond its limit, and the hot faces to 70.6 °C. The cold side matters too: doubling its resistance takes the cabinet to 36.7 °C. Neither exchanger's resistance changes the power much, because the supply voltage fixes it; what changes is how much of that power turns into useful cooling.

### The hot side's temperature limit

The hot face's temperature is also the modules' life. Chapter 3 noted that standard modules are soldered with alloys that limit the faces to about 80 °C, and Chapter 9 shows that the rate of wear in the modules rises with their hot-side temperature. At 58.8 °C, CC-1's modules are comfortable. At 70.6 °C, with a hot-side resistance of 0.20 K/W, they are within 10 K of their limit on every hot afternoon.

## The thermal interface

Between each module's ceramic faces and the exchangers sits a thin layer of thermal grease or a compliant pad. It is there because two flat metal surfaces pressed together touch at only a small fraction of their area, and the gaps between them are filled with air, a poor conductor. Grease fills the gaps. It is still a resistance in the circuit, and with three modules on a sink it is not small.

A grease layer 0.05 mm thick with a conductivity of 0.8 W/(m·K) has a resistance of 0.05 × 10⁻³ ÷ 0.8 = 6.3 × 10⁻⁵ m²·K/W. Over one module's 40 mm square face, 0.0016 m², that is 0.039 K/W; for three modules side by side, carrying the hot side's heat in parallel, 0.013 K/W. At 143 W, the hot-side grease alone accounts for about 1.9 K of the 14.3 K rise. That is why CC-1's hot-side resistance of 0.10 K/W includes an allowance for it, and why the grease must be thin. A layer applied twice as thick doubles the loss; a dry spot or an air bubble under a module can add several kelvin at that module alone, so that it runs hotter and wears faster than its neighbours.

The layer's thickness is set by the clamping pressure, which must be even across every module. CC-1's modules sit between the two plates, which are drawn together by insulated screws tightened in a set sequence to a set torque, with an insulating spacer that limits how far the plates can close. Uneven tightening tilts a plate, leaves one module poorly contacted and risks cracking another.

### Spreading the heat

The modules occupy only part of each exchanger's base. Heat leaving a 40 mm square must spread through the base plate before it reaches the fins at the edges of the extrusion, and the spreading adds its own resistance. A thicker base spreads heat better, at the cost of weight. CC-1's hot-side extrusion has an 8 mm base for that reason, and its fan blows across the centre of the fins, where the modules are, so that the fins carrying most heat get most air.

## Fans

Both exchangers depend on their fans. The hot-side fan moves outside air through the fins; without it, the sink's resistance would rise several-fold to that of natural convection, and the cooler would collapse within minutes on a hot day. Fans are also the parts most likely to fail, as Chapter 9 shows, and the controller therefore monitors the hot-side fan's speed signal and the hot-side temperature, and cuts the module current if either is wrong.

The fans' power counts in two places. The internal fan's 3 W is heat released inside the cabinet, part of the 48 W load. The external fan's power is drawn from the supply but released outside, so it adds to the running cost but not to the load. CC-1's two fans draw 5 W together, bringing the cooler's total demand to about 82 W at the design point.

## Other ways to reject the heat

A finned sink with a fan is the usual hot side for a cabinet cooler, but not the only one. Where a cooling-water supply is available, a liquid-cooled cold plate on the hot side can reach a resistance of a few hundredths of a kelvin per watt in a much smaller package, and the hot face then runs only a few kelvin above the water. At the pump station, the irrigation water itself would be an attractive heat sink, but it carries silt and its temperature in late summer can approach the air's, so the trust kept the air-cooled sink. Heat pipes can carry heat from the modules to a larger, remote fin bank, which helps where the cabinet's outside face is small or shaded. Each option lowers the hot-side resistance, and each adds parts that must be maintained.

## The mistake: a sink full of dust

Two summers after commissioning, the router's temperature log showed the cabinet at 38 °C on a 44 °C afternoon. Nothing in the cabinet had changed. The maintenance technician found the cooler running, both fans turning and the supply delivering 24 V, and almost closed the job as a faulty temperature sensor.

```figure
type: steps
title: Tracing the cabinet's rise to the hot-side sink
caption: This is an illustration. The fins' passages had filled with fine dust and chaff from the irrigation area, cutting the airflow and roughly doubling the sink's resistance.
- Symptom | cabinet at 38 °C on a 44 °C afternoon; cooler running, fans turning, supply correct
- Hot face temperature checked with a contact probe | about 70 °C against about 59 °C at commissioning
- Model with the observed hot face | hot-side resistance about 0.20 K/W instead of 0.10 K/W
- * Sink inspected | fin passages packed with fine dust and chaff; airflow a fraction of design
- Fins cleaned with compressed air from the fan side outwards | hot face back to about 58 °C, cabinet to 32 °C
- Maintenance plan changed | fins inspected and cleaned before each summer; a hot-face temperature alarm at 66 °C added
```

A contact thermometer on the hot-side sink's base, beside the modules, read about 70 °C, eleven kelvin above its commissioning reading in similar weather. The model gave the answer: a hot face at 70 °C with the cabinet near 38 °C is the balance for a hot-side resistance of about 0.20 K/W, twice the design value. The fins' passages were packed with fine dust and chaff blown from the irrigated paddocks, and the fan, though turning, was moving a fraction of its design airflow. Cleaned with compressed air blown from the fan side outward, the sink returned to its commissioning performance and the cabinet to 32 °C. The trust now cleans the fins each spring and has added an alarm on the hot face at 66 °C, a temperature reached only when the sink's resistance has risen by about half.

At the cabinet's 35 °C limit, the fouled sink had cut the heat pumped from 66.4 W to 49.3 W, a quarter of the cooler's capacity and all of its margin, without any part failing. That is typical of thermoelectric coolers in the field: they rarely fail suddenly, but they lose capacity steadily as their heat sinks foul.

## Exercise: SC-1's hot-side sink

SC-1's single module runs at 3.0 A in a pump shed that reaches 40 °C, holding the sample box at 4 °C. Its hot-side sink has a resistance of 0.14 K/W and its cold side 0.30 K/W. Solving the balance gives faces of 44.9 °C and 1.0 °C, 10.2 W pumped and 34.8 W rejected. The sink's fan is a small one, and a cheaper sink offered for the replacement has twice the resistance, 0.29 K/W. Solving the balance with it gives faces of 49.7 °C and 1.6 °C. Using the module constants from Chapter 3, calculate the heat pumped and the COP with the cheaper sink, and decide whether it can carry the box's 9 W load.

### Answer

**Given:** I = 3.0 A; faces 49.7 °C (322.85 K) and 1.6 °C (274.75 K); S = 0.05131 V/K; R = 1.985 Ω; K = 0.5255 W/K; load 9 W.

**Assumptions:** the ideal module model; the balance has converged to the stated faces.

**Method:** heat pumped, power and COP from the model at the converged faces; check against the load.

**Temperature difference:** 322.85 − 274.75 = 48.1 K.

**Heat pumped:** 0.05131 × 3.0 × 274.75 − ½ × 9 × 1.985 − 0.5255 × 48.1 = 42.29 − 8.93 − 25.28 = 8.08 W.

**Power:** 0.05131 × 3.0 × 48.1 + 9 × 1.985 = 7.40 + 17.87 = 25.27 W. COP = 8.08 ÷ 25.27 = 0.32.

**Check:** 8.08 W is less than the 9 W load. The box would warm until its own heat leak fell enough to balance, above its 4 °C setting.

**Decision:** keep the 0.14 K/W sink. The cheaper sink adds about 4.8 K at the hot face, costs 2.1 W of cooling and almost a quarter of the COP, and leaves the box short of its load. A sample box that cannot hold 4 °C fails its purpose, however cheap its sink.

**Verification:** the heat rejected with the cheaper sink is 8.08 + 25.27 = 33.35 W, and 40 °C + 33.35 × 0.29 = 49.7 °C, matching the hot face used; the cold face, 4 − 8.08 × 0.30 = 1.6 °C, matches too.
