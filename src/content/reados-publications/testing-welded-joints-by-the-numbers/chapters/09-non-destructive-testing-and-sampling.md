---
book: testing-welded-joints-by-the-numbers
chapterSlug: non-destructive-testing-and-sampling
order: 9
title: "Non-destructive testing and sampling"
description: "Match radiography, ultrasonics, magnetic particle and penetrant testing to the defects they find, and combine sampling with probability of detection to see how many defects a plan will catch."
draft: false
---

Non-destructive testing looks inside or at the surface of the actual welds that will go into service, without harming them. Each method has its strengths: some see volume defects such as porosity, some see flat defects such as lack of fusion and cracks, some see only the surface. None sees everything, and none finds every defect it could in principle detect, however skilled the operator. A testing plan therefore has two separate questions to answer, and confusing them is the commonest weakness in plans written in a hurry: which method suits the defects that matter, and how much of the welding must be tested to give the required confidence.

This chapter matches the main methods to the defects they find, introduces the probability of detection, combines it with sampling to estimate how many defects a plan will catch, and works through the hopper fabricator's ultrasonic testing.

## The main methods

**Radiographic testing** passes X-rays or gamma rays through the weld onto a film or digital detector. Denser material absorbs more radiation, so voids such as porosity and slag inclusions show as darker spots. It gives a permanent image that can be reviewed by others later, and it is good at volume defects. Flat defects such as lack of fusion and cracks show clearly only if they lie roughly parallel to the beam; turned across it, they may be nearly invisible. Radiography also needs radiation safety controls, with exclusion zones and licensed operators.

**Ultrasonic testing** sends high-frequency sound into the weld from a probe on the surface and listens for echoes from reflectors inside it. Flat defects facing the sound beam reflect strongly, so ultrasonics is good at lack of fusion and cracks, and it locates their depth. It needs a skilled operator, a surface the probe can couple to and careful calibration, and it is harder on thin material and coarse-grained metals. Phased array and time-of-flight diffraction techniques extend it with images and better sizing.

**Magnetic particle testing** magnetises the surface of a ferromagnetic steel and applies fine iron particles; a crack at or just below the surface distorts the magnetic field and gathers the particles into a visible line. It is fast and sensitive for surface cracks in steel, but does not work on austenitic stainless steel or aluminium.

**Penetrant testing** applies a coloured or fluorescent liquid that soaks into surface-breaking defects, wipes off the excess, and applies a developer that draws the penetrant back out to mark the defect. It works on any non-porous material, but only for defects open to the surface.

```figure
type: compare
title: What each non-destructive method is good at
cols: Finds well | Limitations
caption: General characteristics. The choice depends on the defects that matter for the joint, the material and thickness, and the specification.
- Visual | surface imperfections, weld size and profile | surface only
- Radiography | porosity, slag, incomplete penetration | flat defects only if aligned with the beam; radiation safety
- Ultrasonic | lack of fusion, cracks, their depth | operator skill; thin or coarse-grained material
- Magnetic particle | surface and near-surface cracks in steel | ferromagnetic material only
- Penetrant | surface-breaking defects in any non-porous metal | surface-breaking only
```

## Probability of detection

No method finds every defect. A small or badly oriented defect may be missed; a defect in an awkward location may be outside the beam or the inspector's view. The chance that a method, applied by a competent operator, finds a defect of a given type and size is its probability of detection. It rises with defect size: large defects are found almost always, small ones often missed. Published studies estimate detection probabilities for particular methods, defects and conditions; this chapter uses illustrative values to show how they work.

This is an illustration. Suppose that, for a lack-of-fusion defect a few millimetres deep in the hopper's 12 mm butt welds, ultrasonic testing has a probability of detection of about 0.9, and radiography, because lack of fusion along a bevel face is often not aligned with the beam, about 0.6.

## Sampling and detection together

When only part of the welding is tested, a defect is found only if it lies in a tested length and the method detects it. If a fraction f of the weld length is tested at random and the probability of detection is POD, the chance of finding any one defect is f × POD. If there are n independent defects, the chance of finding at least one is:

**P(at least one found) = 1 − (1 − f × POD)ⁿ**

```figure
type: formula
title: Chance a 10% ultrasonic sample finds at least one of five defects
formula: P = 1 − (1 − f × POD)ⁿ
caption: This is an illustration with an assumed probability of detection. Random selection of the tested lengths is assumed; targeted selection changes the result.
- f | fraction of weld length tested, 0.10
- POD | probability of detecting one defect if tested, 0.9
- n | defects in the welding, 5
step: chance of finding any one defect = 0.10 × 0.9 = 0.09
step: P = 1 − (1 − 0.09)⁵ ≈ 0.376
```

So a 10% ultrasonic sample has only about a 38% chance of finding even one of five defects in a hopper's welds, and on average finds 5 × 0.09 ≈ 0.45 of them. Testing 100% of the length with the same method finds at least one with near certainty and finds on average 4.5 of the five, so about half a defect per hopper still goes undetected on average. Radiography at 100%, with its lower detection probability for this defect, would find at least one with probability about 0.99 but miss two of the five on average.

```figure
type: bars
title: Expected number of the five defects found by different plans
unit: defects found, on average
max: 5
caption: This is an illustration with assumed detection probabilities for lack of fusion: ultrasonic 0.9, radiography 0.6. Testing more of the weld, and choosing the method suited to the defect, both matter.
- 10% ultrasonic | 0.45
- 20% ultrasonic | 0.90
- 100% radiography | 3.0
- *100% ultrasonic | 4.5
```

Two lessons follow. Sampling plans are mainly tools for detecting a process that has gone wrong, as Chapter 1 showed, not for finding every defect. And the choice of method should match the defect that matters most: for lack of fusion in a butt weld, ultrasonics is the better tool.

## Escalation

Most sampling plans include escalation: if a tested length contains an unacceptable defect, more of the welding is tested, often the adjacent lengths or more of the same welder's work, and if those reveal more defects, testing extends further, sometimes to the whole of that welder's or that procedure's output. The standards and specifications that call for sampling set the escalation rules. Escalation turns a weak detector into a stronger one: once a problem is found, the testing concentrates where the problem is, which is where the remaining defects are most likely to be.

## Indications, defects and acceptance

NDT reports use careful language. An indication is anything the method shows: an echo, a dark spot, a line of particles. Interpreting it decides whether it is a real imperfection or something harmless, such as the edge of the weld reinforcement, a change of section or a surface mark. An imperfection is then sized and compared with the acceptance criteria; only an imperfection that exceeds them is a defect requiring repair. The criteria come from the application standard or specification, and they are tied to the method: ultrasonic criteria are written in terms of echo amplitude and length, radiographic criteria in terms of the image.

Sizing has its own uncertainty, as every measurement does (Chapter 3). Ultrasonic sizing of a flat defect's height, in particular, is approximate with conventional techniques, which is one reason advanced techniques such as time-of-flight diffraction are used where accurate sizing matters, for example in fitness-for-service assessments of welds in service.

## People and procedures

NDT results depend heavily on the people who obtain them. Operators are trained, examined and certified for each method and level of responsibility, under schemes based on standards such as ISO 9712 for the qualification and certification of NDT personnel. Each test follows a written procedure that states the technique, equipment, calibration, scanning coverage and recording, so that another operator would test the weld the same way. Calibration blocks of similar material and thickness, with known reflectors, check that ultrasonic equipment sees what it should before testing starts. Customers often require NDT to be done by a laboratory accredited for the methods used.

## When to test

The timing of NDT matters. In steels susceptible to hydrogen cracking, cracks can form hours or days after welding (Chapter 6), so specifications may require a delay before the final NDT of such welds, so that delayed cracks have formed before the test that is meant to find them. Welds that are to be post-weld heat treated are usually tested after the heat treatment, which can itself cause cracking. And NDT is done before painting or coating, which would hide surface defects from visual, magnetic particle and penetrant testing and interfere with ultrasonic coupling.

## The hopper fabricator's ultrasonic testing

This is an illustration. The hopper customer's specification calls for ultrasonic testing of 10% of butt weld length, with escalation if unacceptable defects are found. Across the first ten hoppers, with 240 m of butt weld, the fabricator's inspector selected 24 m, chosen to include starts and stops, tie-ins, positional joints and each welder's work, as Chapter 1 recommended.

One tested length showed lack of sidewall fusion beyond the acceptance criteria. Under the escalation rule, two further lengths of the same welder's work on the same hopper, 4.8 m in all, were tested, and one more defect was found. A further check of that welder's work on the next hopper found nothing. Both defects were repaired by an approved procedure and retested.

In total, 28.8 m was tested and two defects found, about 0.069 per metre tested. Because the extra 4.8 m were deliberately targeted after a defect was found, that figure overstates the defect rate in the untested welding, and it cannot be used to estimate how many defects remain. What the result does show is a problem localised to one welder's sidewall technique on one hopper, which retraining addressed, followed by closer testing of that welder's work on the next two hoppers.

## Surface methods on fillet welds

Most of the hopper's welds by length are fillet welds attaching stiffeners, and volumetric NDT is difficult on fillet welds: radiography and conventional ultrasonics struggle with the T-joint geometry. For fillet welds, the usual tools are visual inspection, with gauges for size, and magnetic particle testing, which finds surface and near-surface cracks at the weld toes and in the weld face quickly and reliably on carbon steel. The hopper specification requires magnetic particle testing of a sample of stiffener fillet welds at the hopper's support brackets, where the loads are highest. The inspector's results so far show no cracks, which is the expected result for a sound procedure, and a useful check that hydrogen cracking is not occurring in the thicker bracket joints.

## The cost of testing more

This is an illustration. At about A$45 a metre for ultrasonic testing of the hopper butt welds, excluding GST, testing 10% of 240 m, 24 m, costs about A$1,080 over ten hoppers; testing 100% would cost about A$10,800. Whether the extra A$9,700 is worthwhile depends on what a missed defect would cost: a hopper seam that cracked in service, with the hopper out of use, a repair on site and a customer's lost production, would cost far more than the testing. The specification sets the minimum; a fabricator that has evidence of a problem, such as the lack of fusion found above, may choose to test more than the minimum for its own protection.

## A failure: the radiograph that looked clean

This is an illustration. On an earlier contract, a section of butt weld in a 20 mm plate had been radiographed and passed, but cracked in a pressure test. The crack had started from lack of sidewall fusion along the upper bevel face, about 3 mm deep.

Re-examining the radiograph, the fabricator's inspector could see only a faint line at the edge of the weld image. The lack of fusion lay along the bevel face, at an angle of some 30 degrees to the beam, so it presented almost no thickness of void to the radiation and barely darkened the film. Ultrasonic testing of the remaining welds on the job, with the probe angled to meet the bevel face, found two further lengths with the same defect.

The fabricator's procedure for choosing NDT methods was revised, and it now starts by asking which defect is most likely and most dangerous for the joint: for butt welds where lack of sidewall fusion is the main risk, ultrasonic testing is specified, with radiography used where porosity and slag are the main concern, or where the specification requires a permanent image.

## Exercise: a larger sample

Using the same assumptions, with five defects and a probability of detection of 0.9, calculate the chance that a 20% random ultrasonic sample finds at least one defect, and the expected number found. Then calculate the chance of finding at least one if there are only two defects.

With five defects, the chance of finding any one is 0.20 × 0.9 = 0.18, so P = 1 − 0.82⁵ ≈ **0.629**, and the expected number found is 5 × 0.18 = **0.90**. With two defects, P = 1 − 0.82² ≈ **0.328**.

Doubling the sample from 10% to 20% raises the chance of finding at least one of five defects from about 38% to about 63%, but a 20% sample still misses both of two defects about two-thirds of the time. Low numbers of defects are hard to find by sampling; sampling's real value is in catching the larger numbers that a process out of control produces, which escalation then follows up.
