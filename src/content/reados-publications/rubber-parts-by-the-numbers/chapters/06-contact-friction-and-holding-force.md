---
book: rubber-parts-by-the-numbers
chapterSlug: contact-friction-and-holding-force
order: 6
title: "Contact, friction and holding force"
description: "Turn inflation pressure into contact pressure, sealing and friction grip, set a safety factor that survives wet and greasy pipes, and catch a handbook friction value that let a plug slide out."
draft: false
---

An inflated rubber part that presses against something does two jobs with the same pressure. It seals, because fluid cannot pass a joint where the contact pressure exceeds the fluid pressure. And it grips, because friction between rubber and wall resists sliding. Both jobs depend on the contact pressure, which is whatever is left of the inflation pressure after the rubber has taken its share for stretching. The grip also depends on friction, which is the least reliable number in the whole calculation.

This chapter calculates TP-100's contact pressure, its sealing margin and its holding force in two bores, with friction measured for clean, wet and greasy pipes. It sets a safety factor that holds in the worst realistic case and records how a friction value taken from a general table nearly caused a flooded floor.

## Contact pressure

Chapter 4 showed that, in a 100 mm bore, TP-100's sleeve absorbs 33 kPa of the inflation pressure in stretching itself. At 150 kPa inflation, the rest, about **117 kPa**, presses the sleeve against the pipe. In a 110 mm bore, where the sleeve stretches further, it absorbs 48 kPa and leaves about **102 kPa**.

The contact pressure acts over the contact patch. Chapter 4's measurement in a clear test pipe gave a contact length of about 100 mm of the sleeve's 120 mm, so in a 100 mm bore the patch is π × 100 × 100 = 31,416 mm². The total normal force between sleeve and pipe is 0.1168 × 31,416 = **3,669 N**.

```figure
type: formula
title: Holding force of an inflated sleeve
formula: F = μ × (p − pₘ) × π D L
caption: This is an illustration for TP-100 in a 100 mm bore. μ is the friction coefficient between sleeve and pipe, p the inflation pressure, pₘ the pressure absorbed by stretching the sleeve, D the bore and L the contact length.
- p | Inflation pressure, 150 kPa
- pₘ | Pressure taken by the sleeve, 33 kPa in a 100 mm bore
- D, L | Bore 100 mm, contact length about 100 mm
- μ | Friction coefficient, measured for the pipe condition
step: Normal force = 0.1168 MPa × 31,416 mm² = 3,669 N
step: With μ = 0.32, wet PVC: F = 1,174 N
```

## Sealing

The simplest sealing criterion is that the contact pressure must exceed the pressure of the fluid being held back, with a margin. This is an illustration. The drainage test in TP-100's running case holds a water head of 3 m above the plug, a pressure of 1,000 × 9.81 × 3 = **29.4 kPa**. With 117 kPa of contact pressure in a 100 mm bore and 102 kPa in a 110 mm bore, the plug has a contact pressure about four times the water pressure in the standard bore and three and a half times in the larger one.

The margin matters because the contact is not perfect. Pipe walls have scratches, mould lines and slight steps; rubber conforms to them under pressure but not completely, and a lower contact pressure seals a rough wall less reliably than a smooth one. The margin also covers the trapped air's pressure loss on cooling, which Chapter 7 calculates.

## Holding force

The test water also pushes on the plug's end plate. Over a 100 mm bore, a pressure of 29.4 kPa gives an end thrust of 0.0294 × π × 50² = **231 N**; over a 110 mm bore, **280 N**. The plug must resist that thrust by friction, and TP-100's requirement from Chapter 1 is a holding force of at least three times the thrust in the worst realistic condition.

Two effects can reduce the grip below the simple calculation:

1. **Friction.** Rubber's friction on a pipe wall varies widely with the wall's material, its cleanliness and whether it is wet or greasy.
2. **Water seeping under the leading edge.** If the test water works its way between sleeve and wall at the end facing the water, it reduces the contact pressure there. A cautious estimate subtracts the water pressure from the contact pressure over the whole patch.

### Measuring friction

General tables of friction coefficients for rubber give values from below 0.2 to above 1, depending on the surfaces and conditions. A value from a table is not good enough for a part whose job is to grip. This is an illustration. TP-100's manufacturer measured friction directly, with a slip test: a plug inflated to 150 kPa in a short length of the pipe material, pulled axially by a hydraulic cylinder through a load cell until it slid. Repeated for clean dry PVC, wet PVC and PVC smeared with kitchen fat, the tests gave average coefficients of about 0.45, 0.32 and 0.18.

```figure
type: compare
title: TP-100's holding force against a 3 m test head
cols: Holding force | With water under the leading edge | Safety factor, cautious case
caption: This is an illustration. Measured friction coefficients from the manufacturer's slip tests; 150 kPa inflation; contact length 100 mm. End thrust 231 N in a 100 mm bore and 280 N in a 110 mm bore. The requirement is a factor of at least 3.
- 100 mm bore, clean dry PVC, μ 0.45 | 1,651 N | 1,235 N | 5.3
- 100 mm bore, wet PVC, μ 0.32 | 1,174 N | 878 N | 3.8
- *100 mm bore, greasy PVC, μ 0.18 | 660 N | 494 N | 2.1
- 110 mm bore, wet, μ 0.32 | 1,126 N | 800 N | 2.9
- 110 mm bore, greasy, μ 0.18 | 633 N | 450 N | 1.6
```

The table shows where TP-100 is comfortable and where it is not. Clean and wet pipes of the standard bore meet the factor of three with margin. Greasy pipes do not, and the larger bore, with less contact pressure and more thrust, falls below three even when wet in the cautious case.

### Rubber friction is not ordinary friction

The friction coefficient of metal on metal is roughly constant over a wide range of loads, which is why a single number serves. Rubber's is not. Its friction comes partly from adhesion, the rubber momentarily sticking to the surface it touches, and partly from hysteresis, the energy lost as the rubber deforms over the surface's roughness. Both depend on contact pressure, sliding speed, temperature and the state of the surface. In general, rubber's friction coefficient falls as contact pressure rises, rises with a rough clean surface and collapses with a lubricating film of water, fat or soap between the surfaces.

For TP-100, this has two practical consequences. A friction coefficient measured at a different contact pressure from the plug's 117 kPa may not apply. And a coefficient that holds for the first minute may not hold after twenty, because a thin film of liquid can be squeezed into the contact over time and because the rubber slowly creeps. Both are reasons to measure friction on the real plug, at its working pressure, for a realistic time.

```figure
type: steps
title: TP-100's slip test
caption: This is an illustration of the manufacturer's test, run for each pipe material and condition the plug is rated for. Results are averaged over five plugs and three pulls each.
- Prepare the pipe | a 400 mm length of the pipe material, cleaned, wetted or greased as the condition requires
- Insert and inflate | plug fully inserted past its mark, inflated to 150 kPa, held five minutes to settle
- Load slowly | pull axially through a load cell at a slow, steady rate
- Record the peak | the force at which the plug first slides
- Hold test | at half the peak force, hold for thirty minutes and record any creep movement
- Calculate | friction coefficient from peak force over normal force; report mean and lowest
```

The hold test in the fifth step is the one that matters most for a drainage test, which may run for an hour or more. A plug that holds a short pull but creeps under a sustained one is not fit to rely on friction alone, and the café incident below was exactly that case.

## The error: a friction value from a table

This is an illustration. TP-100's first instructions, written before the slip tests, said that the plug "holds against test heads up to 3 m without additional restraint". The figure behind that statement came from a design calculation using a friction coefficient of 0.8, taken from a general engineering table for rubber on a rough, dry surface. With μ = 0.8 and the full contact pressure, the holding force came to 0.8 × 3,669 = 2,935 N, a safety factor of 12.7 on the 231 N thrust. The designer considered that ample and saw no need for a restraint.

In the field, a plumber used a plug to test a kitchen drain in a café. After about twenty minutes under test, the plug slid out of the pipe and the 3 m column of water, which had been draining kitchen waste for years, emptied onto the floor below. No one was hurt, but the clean-up and the café's lost trading day were charged to the plumber, who passed the complaint to the manufacturer.

The slip tests that followed, described above, explained it. Kitchen drains carry fat, and fat on PVC gave a friction coefficient of about 0.18, less than a quarter of the table's value. With water seeping under the leading edge as well, the holding force fell to about 494 N, a factor of only 2.1, and the slow creep of rubber over twenty minutes, which Chapter 8 discusses, took the rest.

The manufacturer changed the instructions and the product:

1. The instructions now require every plug under test to be **restrained by a brace or tether** to a fixed point, whatever the pipe condition, as is common practice with pipe test plugs. Friction is treated as the means of sealing and positioning, not as the only means of holding.
2. They require greasy pipes to be **cleaned** at the plug's position before it is inserted.
3. The plug's rating is stated with its basis: a maximum test head for clean, wet pipe of the marked bore range, with restraint always required.

The lesson recorded was that friction for a gripping part must be measured on the surfaces and conditions it will meet, at the worst of them, and that a part which holds back stored energy should not rely on friction alone.

## Choosing a safety factor

The factor of three in TP-100's requirement is a judgement, not a rule from a standard, and it is worth seeing what it covers. The friction coefficient varies between plugs and pulls by perhaps ±20% even in one condition; the contact pressure depends on the compound's stiffness, which Chapter 2 showed can vary by ±20% within its hardness tolerance, though contact pressure varies much less; the inflation pressure may be set low or drop as the air cools, which Chapter 7 quantifies; and the test head may be miscalculated or exceeded. A factor of three on the cautious case leaves room for several of these at once.

What a safety factor cannot cover is a condition outside the one it was calculated for. A factor of 5.3 on clean, dry pipe means nothing in a greasy one, and no factor on friction makes a plug safe against a mechanism, such as slow creep, that the calculation does not model. That is why the manufacturer's answer to the café incident was restraint, not a bigger factor: restraint changes the mechanism from one with an uncertain capacity to one with a tested capacity.

## Restraint and load paths

A tether or brace changes the plug from a friction device into a restrained one. The thrust now passes through the plug body and the tether to a fixed point, and the friction only has to locate the plug and seal. The plug body and its tether point must then carry the full thrust, with their own margin; for TP-100, the body's central tube and end plate are designed for several times the thrust, and the tether eye is tested to a proof load.

Restraint also helps against the less obvious failure: slow creep. A rubber sleeve under a constant axial load does not hold perfectly still. The rubber shears slightly, the contact patch rolls a little, and over minutes or hours a plug at a modest safety factor can migrate along the pipe. A restrained plug cannot migrate further than its tether allows.

## Pressure in the plug and pressure in the pipe

One more interaction matters for the seal. The test water pushes on the sleeve's exposed end as well as on the end plate, and in doing so it pushes the sleeve's leading edge towards the plug's centre, slightly reducing the contact pressure there. That is part of why the cautious case subtracts the water pressure. It also means that the inflation pressure must always be well above the test pressure; a plug inflated to 50 kPa holding back a 40 kPa test head would have almost no contact pressure at its leading edge and would leak or slide. The manufacturer's instructions state the minimum inflation pressure for each test head, with the 150 kPa standard inflation covering heads up to the plug's rating. They also say to check the inflation gauge at the start and end of every test and to record both readings, because a falling inflation pressure during a test is the earliest warning of a leaking valve, a cooling plug or a sleeve beginning to fail, and it shows up on the gauge well before the plug moves.

## Exercise: a larger head

A plumber asks whether TP-100, restrained by a tether, can hold a 5 m test head in a clean, wet 100 mm PVC pipe.

1. What are the water pressure and the end thrust?
2. What is the contact pressure margin for sealing, and the friction safety factor in the cautious case?
3. Does the tether change the answer?

**Worked answer.**

1. Water pressure 1,000 × 9.81 × 5 = **49.1 kPa**; end thrust 0.0491 × π × 50² = **385 N**.
2. Contact pressure 117 kPa, about 2.4 times the water pressure, a narrower sealing margin than at 3 m but still above it. In the cautious case, with the water pressure subtracted, the normal force is (0.1168 − 0.0491) × 31,416 = 2,128 N, and with μ = 0.32 the grip is 681 N, a factor of **1.8** on the thrust.
3. Yes. On friction alone, 1.8 is well below the required 3, and the plug should not be used at 5 m unrestrained. With a tether, the thrust is carried by the tether and the plug body, and friction only has to position and seal. The answer then depends on the plug's rated test head, the tether's proof load and the sealing margin, and on what the plumbing standard and the authority require for the test. A 2.4 margin on sealing is lower than at 3 m, and the manufacturer would need to test the plug at 5 m before rating it for that head.
