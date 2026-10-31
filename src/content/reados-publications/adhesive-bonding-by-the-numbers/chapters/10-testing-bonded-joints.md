---
book: adhesive-bonding-by-the-numbers
chapterSlug: testing-bonded-joints
order: 10
title: "Testing bonded joints"
description: "Lap shear coupons that travel with production, reading cohesive and interfacial failures, never discarding low results, capability against a minimum strength, and inspecting parts."
draft: false
---

A bonded joint cannot be inspected into soundness. A weak bond and a strong one look the same from outside, and the non-destructive methods that find voids and disbonds cannot measure adhesion. So bonding is controlled by testing samples made by the same process, at the same time, and by reading those tests for more than a number. The strength says how strong the sample was; the failure surface says why.

This chapter covers lap shear testing with coupons that travel with production, reading failure surfaces, judging capability against a minimum strength, and what inspection of the real parts can add. Its error is the most tempting one in any testing programme: discarding the low result.

## Lap shear coupons

The single lap shear test is the workhorse of bonding control. Two strips of the adherend, prepared and bonded by the production process, overlap by a short length and are pulled apart in a tensile machine. The result is reported as the failure load divided by the overlap area, an average shear stress. ISO 4587 and ASTM D1002 standardise the test for rigid adherends and for metals, including specimen dimensions, preparation and reporting; they are named here for scope only.

Chapter 6 explained why that average is not a material property: it depends on the adherend thickness and stiffness, on the overlap length and on bending. For process control that does not matter, provided the coupon geometry stays the same. The coupon's job is to detect a change in the process, not to measure a design value.

### Coupons that travel with production

A coupon tells you about the process only if it goes through the same process as the parts. Plant K's rules:

1. **Same stock.** Coupons are cut from offcuts of the same sheet as the doors, not from a separate supply.
2. **Same preparation, same time.** Coupons are prepared alongside the doors by the same operator with the same materials, and bonded from the same cartridge within the same window.
3. **Same cure.** Coupons travel through the same fixture time and the same oven cycle as the doors.
4. **Same record.** Each coupon set carries the door numbers, the date, the cartridge batch, the bay temperature and the surface check readings.

The plant makes one set of five coupons per shift and tests them the next day. It keeps the broken coupons, labelled, for a year.

## Reading failure surfaces

When a lap shear coupon breaks, the failure surface tells where the crack ran. ISO 10365 gives a scheme for designating failure patterns, named here for scope only. Four broad kinds matter for process control.

```figure
type: compare
title: What a lap shear failure surface says
rowhead: Failure surface
cols: What it looks like | What it means | Action
caption: Estimate the share of each kind by eye, or by photographing the surfaces against a grid, and record it with the strength. A change in failure mode often appears before a change in strength.
- * Cohesive | adhesive on both faces, crack ran through the adhesive | the interface was stronger than the adhesive: the goal | none
- Interfacial (adhesive failure) | adhesive on one face, bare-looking surface on the other | the bond to that surface was the weak link | check preparation, contamination, moisture, time window
- Thin-layer cohesive | a very thin film of adhesive left on one face | near the interface, often a weak boundary layer | treat as a warning, as for interfacial
- Substrate | the adherend or its coating broke | the joint was stronger than the part or coating | check the coating's own adhesion if coated
```

Interfacial failure on a metal coupon is the clearest warning a bonding process can give. It means the adhesive was not properly bonded to the surface, whatever the strength number. Plant K's first coupons, bonded after an isopropanol wipe alone, failed interfacially on most of their area; after abrasion they were largely cohesive, with an interfacial band at the overlap edges after ageing, as Chapter 9 showed.

## The error: the low coupon

In the plant's second month, one set of five coupons from a morning shift gave 23.1, 22.4, 24.0, 11.8 and 22.9 MPa. The technician noted that the 11.8 MPa coupon "must have been a bad coupon", excluded it, and reported a mean of 23.1 MPa from the other four, comfortably above the plant's minimum of 15 MPa.

The low coupon was the most important result of the month. Against the process's normal mean of about 21.8 MPa and standard deviation of 2.6 MPa, a result of 11.8 is 3.85 standard deviations low, an event that should happen by chance far less than once in a thousand coupons. And when the engineer looked at the kept coupon, its failure surface was entirely interfacial and slightly tacky, with streaks.

The streaks and the tackiness pointed at mixing. The bay log for that morning showed that a new cartridge had been fitted mid-way through the shift, and the coupon in question was the one bonded from its first bead. The first bead of a new cartridge had not been purged. That bead was off-ratio, and two doors bonded from it were traced by their numbers, checked, and had their stiffeners removed and rebonded.

```figure
type: stats
title: One coupon set, read two ways
caption: This is an illustration. Excluding the low result gave a reassuring mean; keeping it and reading its failure surface found an unpurged cartridge and two doors to rebond.
- 23.1 MPa | mean of the four "good" coupons
- 20.8 MPa | mean of all five, with a standard deviation of 5.1 MPa
- 3.85 | standard deviations below the process mean for the 11.8 MPa coupon
- 2 doors | traced by number from the same cartridge bead and rebonded
```

The rule the plant adopted is simple: no test result is excluded unless a physical cause unconnected with the process, such as a coupon dropped before testing or misaligned in the grips, is recorded before the result is known. A low result with an interfacial or tacky failure surface is investigated as a process fault, and the doors bonded at the same time are traced.

## Capability against a minimum strength

Beyond catching faults, the plant wanted to know whether its process reliably met its minimum. For a quantity with only a lower limit, the relevant capability index is Cpk = (mean − LSL) ÷ 3s. A process with Cpk of 1.33 has its mean four standard deviations above the limit.

A Cpk computed from a sample is itself uncertain. The [capability confidence check](/tools/capability-confidence-check/) calculates Cp and Cpk from the sample mean, standard deviation and specification limits, a one-sided lower confidence bound on Cp from the chi-square distribution and on Cpk from the normal approximation given in the NIST e-Handbook, and the sample size at which the same Cpk would be proven, against the Cpk you require. It asks for both specification limits. For a strength with only a minimum, the plant entered the minimum as the lower limit and an upper limit far above any possible result, 1,000 MPa, so that the lower limit governs Cpk; the Cp the tool reports is then meaningless and was ignored.

```figure
type: compare
title: Capability of the abraded-and-wiped process against a 15 MPa minimum
rowhead: Quantity
cols: Value | Meaning
caption: This is an illustration. Thirty coupons from six shifts, 12.5 mm overlap, fresh. From the capability confidence check with LSL 15 MPa, an upper limit set at 1,000 MPa so the lower limit governs, and 95% confidence. The Cp figures the tool reports are artefacts of the dummy upper limit.
- Mean and standard deviation | 21.8 MPa and 2.6 MPa | the process as measured
- Cpk from the sample | 0.872 | mean only 2.6 standard deviations above the minimum
- * Lower 95% bound on Cpk | 0.659 | the capability that can be claimed with confidence
- Verdict against Cpk 1.33 | not capable | low results will occur in production
```

A Cpk of 0.872 means that, if strengths were normally distributed, about one coupon in 220 would fall below 15 MPa by chance alone, before any process fault. The process was not capable, and with interfacial failure bands after ageing it was not durable either. Chapter 11 tests the preparation that replaced it.

### How many coupons?

Thirty coupons is a useful minimum for a capability claim. With fewer, the lower confidence bound on Cpk falls well below the sample value, and the tool warns when the sample is under 25 that its approximation is not reliable. The tool also reports the sample size at which a given Cpk would be proven, which is the number to plan a qualification run around.

### Charting the coupon results

A capability index summarises a process that is stable; it says nothing about whether the process is stable. Plant K plots the mean of each shift's five coupons on an X-bar and range chart, and the share of interfacial failure on a separate simple run chart. A shift whose mean falls outside the limits, or a run of means drifting down, is investigated before any coupon falls below the minimum. The charts also make a capability claim honest, because a capability computed from an unstable process describes nothing in particular. The companion book on control charts explains the charts in [Shewhart X-bar and R charts](/reados/publications/control-charts-by-the-numbers/shewhart-xbar-and-r-charts/) and the link between stability and capability in [capability from a stable process](/reados/publications/control-charts-by-the-numbers/capability-from-a-stable-process/).

## Tests beyond lap shear

Lap shear coupons are cheap and sensitive to surface faults, but they test only one loading at one temperature. Plant K added three less frequent checks, each aimed at a property the coupons do not measure.

```figure
type: compare
title: Plant K's bonding tests and what each one controls
rowhead: Test
cols: How often | What it detects
caption: This is an illustration. The shift coupons control the everyday process; the less frequent tests catch changes in the adhesive's toughness, its strength when hot and the behaviour of the real joint.
- * Lap shear coupons at room temperature | five per shift | surface preparation, mixing and cure faults
- T-peel strips | two per week | loss of toughness, for example a change of adhesive batch or an incomplete oven cure
- Lap shear at 70 °C | five per month | loss of strength at the hottest service temperature
- Drop test of a production door | one per month | the real joint, including the end details of Chapter 7
```

The hot lap shear test matters because a joint's strength at its hottest service temperature, not at room temperature, sets its margin on a summer afternoon. Plant K's coupons kept about 70% of their room-temperature strength at 70 °C, 17.4 MPa against 24.9 MPa for the improved preparation, and the plant watches that ratio as an early warning of an incomplete heat cure: an under-cured adhesive with a lower glass transition temperature loses far more strength when hot than a fully cured one.

## Qualification and production testing

Two kinds of testing do different jobs, and it helps to keep them apart. **Qualification** proves, once, that a process can make joints that meet the requirements: enough coupons for a capability claim, ageing and hot tests for durability, peel and drop tests for the real loading, and an examination of a real part. **Production testing** then shows, shift by shift, that the process is still the qualified one. Qualification is repeated when anything significant changes: the adhesive, its supplier, the preparation, the adherend material or the cure.

Plant K's qualification of a bonding process includes one test that production never repeats: the destructive teardown of a sacrificial door. A complete door is bonded by the production operators in the normal way, cured and then cut up. Each stiffener is peeled off the skin with a wedge and a pry bar, and the engineer records the adhesive coverage on each flange, the bondline thickness at several points with a micrometer, the size of the fillets at the ends, the position of the end rivets and the failure surface along the whole length. The teardown of the first qualification door found a 40 mm gap in the bead on one flange where the operator had restarted the cartridge, and a bondline at the ends of the flanges thinner than in the middle, where the fixture clamps pressed hardest. Both were corrected in the procedure, and a second door was torn down to confirm the changes.

A teardown is expensive, a whole door, but it is the only test that looks at the joint actually made in production, rather than at coupons made beside it.

## Inspecting the real parts

Coupons control the process. Inspection of the parts themselves can add some assurance, within limits.

- **Visual checks.** A continuous fillet at every edge, adhesive of the right colour, no gaps at corners, no squeeze-out where it should not be. These catch missing or misplaced adhesive.
- **Tap testing.** Tapping along a bonded stiffener with a small hammer or coin and listening for a change in sound finds large unbonded areas in thin skins. It is quick and surprisingly sensitive to disbonds a few centimetres across.
- **Ultrasonic and other instrumented methods.** These find voids, disbonds and porosity, and are used on high-value structures. They do not measure adhesion: a joint in which the adhesive touches the surface but is not bonded to it, sometimes called a kissing bond, can pass them.
- **Proof loading.** Loading a finished part to a set level and checking it holds is possible for some joints, such as a bonded hanger. It proves the part against that load but may damage marginal joints.

For Plant K, a visual check of fillets and corners on every door and a tap test of every stiffener became part of final inspection. Neither replaces the coupons; both catch gross faults that coupons, made beside the doors, would not. A door that fails either check is set aside, its number is recorded against the shift's coupons, and the cause is found before it is repaired.

## How this applies to a small Australian business

Make lap shear coupons alongside production from the same stock, preparation, cartridge and cure, and keep them after testing. Record the failure surface with every strength: interfacial failure is a process fault even when the number passes. Never discard a low result without a recorded physical cause; trace the parts bonded with it. Judge capability with a confidence bound, from at least about thirty coupons, and remember that the coupons control the process while inspection of the parts only catches gross faults.

## Exercise: a capable process?

After a change of preparation, thirty coupons give a mean of 24.9 MPa and a standard deviation of 1.9 MPa against the 15 MPa minimum. (a) What is the sample Cpk? (b) Using the capability confidence check at 95% confidence, is a Cpk of 1.33 proven? (c) What would sixty coupons with the same mean and standard deviation show?

**Worked answer.** (a) Cpk = (24.9 − 15) ÷ (3 × 1.9) = **1.737**. (b) The tool gives a lower 95% bound on Cpk of **1.349**, just above 1.33, so **capability is proven**, narrowly. It also reports that about 28 coupons would prove 1.33 at this Cpk. (c) With sixty coupons the lower bound rises to **1.464**, a more comfortable margin. The sample Cpk is unchanged; the extra coupons only reduce the uncertainty about it. In both cases the failure surfaces must also be cohesive and the durability tests passed before the process is approved.
