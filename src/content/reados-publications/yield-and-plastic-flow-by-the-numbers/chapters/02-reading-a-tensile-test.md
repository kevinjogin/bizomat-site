---
book: yield-and-plastic-flow-by-the-numbers
chapterSlug: reading-a-tensile-test
order: 2
title: "Reading a tensile test"
description: "What a tensile test measures and how to evaluate one: yield by offset or yield point, tensile strength, elongation, reduction of area, modulus and true fracture values, and when a result is invalid."
draft: false
---

The tensile test is the most widely used mechanical test of metals, and most material specifications are written in its terms: a minimum yield strength, a minimum tensile strength, a minimum elongation. It is simple to do and easy to misread. Each number it produces describes a different stage of the specimen's behaviour, and each has rules about when it is valid.

This chapter walks through a tensile test on the bar from which the HC-63's rods are made, shows how each property is defined and calculated, and follows a result that was rejected for a reason that had nothing to do with the steel.

## The test

A specimen of known cross-section is pulled in a testing machine at a controlled rate until it breaks, while the load and the extension of a marked gauge length are recorded. The test method for metals at room temperature is set out in ISO 6892-1, which covers specimen shapes, testing rates, the definitions of the properties and the conditions under which results are valid. Purchase specifications and material standards then set the minimum values a material must meet.

The HC-63 builder buys 36 mm bar of a 0.45% carbon steel in the normalised condition for its rods, and tests one bar from each delivered heat in addition to checking the mill certificate. The specimen is machined from the bar's mid-radius, parallel to its axis: a round bar 10 mm in diameter with a 50 mm gauge length. That length is 5.65 times the square root of the cross-sectional area, the proportional gauge length that most elongation requirements assume; for a round specimen it is five diameters.

### What the record shows

```figure
type: line
title: Engineering stress against strain for the HC-63 rod bar specimen
x: Engineering strain, %
y: Engineering stress, MPa
ymin: 0
ymax: 700
mark: 11 | maximum load: necking begins
caption: This is an illustration. Elastic to about 0.18% strain, a rounded yield at about 360 MPa, work hardening to the maximum of 640 MPa at about 11% strain, then necking and fracture at 19.2% elongation. The fall after the maximum is in engineering stress only; the true stress in the neck keeps rising.
- 0 | 0
- 0.1 | 205
- 0.18 | 345
- 0.4 | 366
- 1 | 395
- 2 | 450
- 4 | 530
- 7 | 600
- 11 | 640
- 15 | 610
- 18 | 540
- 19.2 | 490
```

The record has four parts. A straight elastic line, whose slope is the modulus. A bend into yielding. A long rise as the metal work hardens while the whole gauge length stretches uniformly. And, after the maximum load, a fall as the deformation concentrates in a neck, until the neck breaks.

## The properties

### Yield strength

For a steel that yields gradually, the yield strength is the 0.2% offset, or proof, strength: draw a line parallel to the elastic line, starting at 0.2% strain, and read the stress where it meets the curve. In practice the testing machine's software does this from the extensometer signal. The load at that point divided by the original area is the yield strength.

Some steels, particularly annealed or normalised low-carbon steels, show a yield point instead: the load rises to an upper yield, drops suddenly, and runs at a roughly constant lower yield while bands of deformation, called Lüders bands, spread along the gauge length. Specifications for such steels quote the upper yield strength, ReH, or the lower, ReL, and the report must say which. The HC-63 rod steel, with 0.45% carbon and a pearlitic structure, yields gradually, so its 0.2% proof strength, Rp0.2, is used.

### Tensile strength

The maximum load divided by the original area is the tensile strength, Rm. It is not the stress at which the metal breaks; it is the stress at which the specimen's work hardening can no longer keep up with its shrinking area, and necking begins (Chapter 3).

### Elongation and reduction of area

After fracture, the two halves are fitted together and the gauge length is measured again. The elongation after fracture is the increase as a percentage of the original gauge length. It includes the uniform stretch of the whole gauge length and the local stretch of the neck, so it depends on the gauge length: a shorter gauge length gives a larger percentage, because the neck is a larger share of it. That is why elongation requirements state the gauge length.

The reduction of area is the decrease in cross-section at the fracture, as a percentage of the original area, from the diameter measured across the neck. It describes how far the metal could flow locally before breaking, and it is a better measure than elongation of the ductility available for bending (Chapter 7).

### Modulus

The modulus can be found from the slope of the elastic line, using a load and extension measured within it. It needs a real extensometer on the gauge length: a modulus calculated from the machine's crosshead movement includes the stretch of the grips, the specimen's shoulders and the machine itself, and comes out far too low.

### True fracture values

Dividing the load at fracture by the area of the neck gives the true fracture stress, and the natural logarithm of the area ratio, ln(A₀ ÷ A_f), gives the true fracture strain. These describe the metal in the neck at the moment of fracture, which is far stronger and far more strained than the engineering figures suggest. Chapter 3 explains them.

## The tensile test evaluation tool

The [tensile test evaluation](/tools/tensile-test-evaluation/) tool takes a round specimen's original diameter and gauge length, the load at the 0.2% offset yield, the maximum load, the load at fracture, the gauge length and diameter after fracture, and one load and extension in the elastic range. It returns the yield and tensile strengths, the yield-to-tensile ratio, the elongation, the reduction of area, the modulus, and the true fracture stress and strain, and checks the first three against the specification's minimums. It reminds the user that elongation is valid only if the break is in the middle part of the gauge length.

```figure
type: compare
title: The HC-63 rod bar specimen in the tensile test evaluation tool
cols: Measured | Result | Builder's minimum
rowhead: Property
- Original area | 10.0 mm diameter | 78.54 mm² | not applicable
- * Yield strength, Rp0.2 | 28.3 kN | 360.3 MPa | 340 MPa
- * Tensile strength, Rm | 50.3 kN | 640.4 MPa | 570 MPa
- Yield ÷ tensile | not applicable | 0.563 | not specified
- * Elongation after fracture | 50 to 59.6 mm | 19.2% | 16%
- Reduction of area | 6.8 mm neck | 53.8% | not specified
- Modulus | 10 kN, 0.031 mm over 50 mm | 205.4 GPa | not applicable
- True fracture stress and strain | 38.5 kN at fracture | 1,060 MPa and 0.771 | not applicable
caption: This is an illustration. The minimums are the builder's purchase specification for the rod bar, not values from a standard. Result: MEETS SPECIFICATION.
```

The low yield-to-tensile ratio, 0.56, is typical of a normalised medium-carbon steel: it work hardens a great deal before necking. The reduction of area, 54%, says it can flow locally a long way before it fractures. Both matter for the rolled thread in Chapter 9.

## Things that change the result

A tensile result belongs to the specimen and the way it was tested, not only to the material. Four influences are worth knowing, because each can explain a difference between two results that are both valid.

**Testing rate.** Dislocations need time to move past obstacles, and the faster a metal is strained, the higher the stress needed. A yield strength measured quickly is higher than one measured slowly, by a few per cent over the range of rates that test methods allow for steel, and much more at impact rates. Test methods therefore control the rate of stressing or straining through the yield region, and a laboratory must record which method it used.

**Direction.** Rolled plate and drawn bar are not quite the same in every direction. Inclusions are drawn out into stringers along the rolling direction, and grains may be elongated. A specimen taken across the rolling direction of plate usually shows lower elongation and reduction of area than one taken along it, with similar strength. For the HC-63's 10 mm bracket plate the difference matters, because the bend runs along one direction or the other (Chapter 7).

**Position and size.** In a thick bar or plate, the centre cools more slowly than the surface during manufacture and is often a little weaker. Specifications therefore say where the specimen is to be taken, such as at mid-radius of a bar or a quarter of the thickness of a plate. A smaller specimen, used when the section is too thin for the standard size, may give slightly different results, especially for elongation.

**Temperature.** Strength falls and ductility usually rises as temperature increases; at low temperature, many steels lose ductility sharply and may break in a brittle way. The tensile test at room temperature says little about either extreme; for equipment that runs hot or very cold, tests at the service temperature, or impact tests, are needed.

## Certificates and your own tests

Every delivered heat of the bar comes with a mill inspection certificate, typically issued under EN 10204 as a type 3.1 certificate, which reports the steel maker's own test results for that heat, signed by its authorised inspector independent of production. The builder checks three things on every certificate: that the heat number matches the bar's marking, that the grade and condition are what was ordered, and that the results meet the purchase specification. It then tests one bar per heat itself.

The builder's test results usually differ a little from the certificate's. The certificate may be from a different position in the bar, a different section of the heat or a different specimen size, and strength scatters within a heat. A difference of a few per cent is normal; a difference of 15% in yield or a much lower elongation is a reason to stop and ask.

```figure
type: compare
title: The certificate and the builder's test for the same heat
cols: Mill certificate | Builder's test | Difference
rowhead: Property
- Yield strength | 372 MPa | 360.3 MPa | −3.1%
- Tensile strength | 652 MPa | 640.4 MPa | −1.8%
- Elongation | 21% | 19.2% | −1.8 points
caption: This is an illustration. Small differences like these are normal and both sets meet the specification. The builder files both.
```

## The error: the break near the gauge mark

The second heat delivered that year produced a specimen that broke 3 mm from one of its gauge marks. The technician fitted the halves together and measured 57.6 mm: an elongation of 15.2%, below the 16% minimum. The yield and tensile strengths were well within specification. The production planner, seeing a failed test, quarantined the whole heat, 2.4 tonnes of bar, and the purchasing officer drafted a rejection.

The laboratory supervisor stopped the rejection. A specimen that breaks close to a gauge mark has its neck partly outside the gauge length, so the measured elongation misses part of the local stretch and reads low. Tensile test methods recognise this: when the fracture is outside the middle part of the gauge length and the elongation falls short of the requirement, the result may be treated as invalid and the test repeated, rather than counted as a failure. The tool's check, "Elongation is only valid if the break is within the middle part of the gauge length", says the same.

The repeat test, on a second specimen from the same bar, broke near the middle, with an elongation of 19.0%. The heat was released. Two procedure changes followed: the technician marks the fracture position on every test record, and a failed elongation is never reported until the fracture position has been checked against the method's rules.

```figure
type: decision
title: A tensile result below the minimum: what to check first
question: Is the result valid under the test method?
- Break outside the middle of the gauge length, elongation short | treat as invalid; retest on a fresh specimen
- Specimen flawed (machining mark, inclusion, wrong size) | treat as invalid; retest and record the flaw
- Testing rate or extensometer outside the method | treat as invalid; correct the procedure and retest
- * Valid test, result below the minimum | the material fails; quarantine the heat, inform the supplier and follow the specification's retest rules
caption: An invalid test is no result at all: it neither passes nor fails the material. The rules for what counts as invalid, and how many retests are allowed, come from the test method and the material specification.
```

## What the numbers are for

Each tensile property is used somewhere in the HC-63's design and manufacture, and knowing which helps decide which to specify.

- **Yield strength** is the limit for the barrel and rod under pressure and load (Chapters 5 and 6), and the stress that sets springback (Chapter 7).
- **Tensile strength** sets press forces for bending and drawing, and enters fatigue estimates.
- **Elongation** is the limit for uniform stretching, such as the outer fibre of a tube bend (Chapter 8).
- **Reduction of area** is the limit for local flow, such as the tightest bend radius a plate can take (Chapter 7).
- **Modulus** sets elastic deflections and springback.

A specification that states only the yield and tensile strengths leaves the forming properties to chance. The HC-63 builder's purchase specification for rod bar therefore names all three of yield, tensile strength and elongation, records the reduction of area for information, and names the condition (normalised) and the specimen position. For the bracket plate, whose bends depend on local ductility, it adds a minimum reduction of area across the rolling direction. Each requirement is there because a later process depends on it, and the specification lists which process that is, so that nobody deletes a line without knowing what it protects.

## Exercise: a cold-drawn alternative

A second supplier offers cold-drawn bar of the same steel. An 8.0 mm diameter, 40 mm gauge length specimen gives a 0.2% offset yield load of 26.1 kN, a maximum load of 32.4 kN, a final gauge length of 45.6 mm with the break in the middle, and a neck diameter of 5.6 mm. Evaluate it against the builder's minimums (340 MPa, 570 MPa, 16%). What does the yield-to-tensile ratio suggest?

**Worked answer.** The original area is π ÷ 4 × 8² = 50.27 mm². The yield strength is 26,100 ÷ 50.27 = 519.2 MPa and the tensile strength 32,400 ÷ 50.27 = 644.6 MPa, both well above their minimums. The elongation is (45.6 − 40) ÷ 40 = 14.0%, below 16%: the bar fails the specification, on a valid test. The reduction of area is (50.27 − 24.63) ÷ 50.27 = 51.0%.

The yield-to-tensile ratio is 519.2 ÷ 644.6 = 0.81, against 0.56 for the normalised bar. Cold drawing has used up much of the steel's work hardening (Chapter 3): its yield is close to its tensile strength, and it has less uniform elongation left. That suits a part that must not yield, but it leaves less ductility for forming, such as rolling the rod's thread. The builder would need to decide whether to change the specification for this supplier, not simply accept the bar.
