---
book: eddy-current-inspection-by-the-numbers
chapterSlug: testing-tubes-and-bars
order: 8
title: "Testing tubes and bars with encircling coils"
description: "Encircling-coil testing of tubes: fill factor, frequency for the wall, differential and absolute coils, line speed, reference tubes and end zones, and auditing a supplier with a sampling plan."
draft: false
---

A tube mill can test every metre of every tube it makes by passing the tube through a coil at production speed. The coil surrounds the tube, so it sees the whole circumference at once, and a pit, a crack or a hole passing through it gives a pulse that marks or diverts the tube. For a buyer of tubes, that test is a reason to trust the supplier's product, but only if the test was set up to find the defects that matter and only if the buyer has some evidence that it was run properly. This chapter explains how an encircling-coil test works, then turns to the pump maker's role as a buyer: auditing the tube supplier's records and sampling its tubes with a plan whose protection has been calculated rather than assumed.

The PH-6 oil cooler is built in-house from 90/10 copper-nickel tubes, 12.7 mm in diameter with a 1.0 mm wall, bought in lots of 2,000 from a tube maker that tests every tube with an encircling coil. A leaking tube puts water into the hydraulic oil, so the tubes matter.

## The encircling coil

An encircling coil is wound around the path of the tube, with the tube passing through it on guides that keep it centred. Its eddy currents circulate around the tube's circumference, so any defect that interrupts them, a hole, a crack along the tube, a pit or a seam, changes the coil's impedance as it passes.

How strongly the coil couples to the tube depends on how much of the coil's area the tube fills. The fill factor is the square of the ratio of the tube's outside diameter to the coil's inside diameter.

```figure
type: formula
title: Fill factor of an encircling coil
formula: η = (d ÷ D)²
caption: d is the tube's outside diameter and D the coil's inside diameter. A fill factor close to one gives strong coupling and high sensitivity; a loose coil loses signal and makes the reading sensitive to the tube's position in the coil.
- η | fill factor, 0 to 1
- d, D | tube and coil diameters, mm
```

For the cooler tubes in a coil with a 14.0 mm bore, η = (12.7 ÷ 14.0)² = 0.823. Coils are made for each tube size so that the fill factor stays high, and the tube's guides keep it central, because a tube running off centre changes the coupling around its circumference and makes the signal noisy.

### Frequency and the two surfaces

Chapter 2 found that at about 50 kHz the standard depth in the copper-nickel is 0.98 mm, close to the 1.0 mm wall. At that frequency, the eddy currents reach the inside surface at about a third of their outside strength and lag the outside currents by about 58°. A defect starting at the outside interrupts currents near the surface the coil sits on; one starting at the inside interrupts currents that are weaker and lag in phase. On the impedance-plane display, the two give signals at different angles, so the instrument can tell an outside defect from an inside one, and a through-wall hole from both. Higher frequencies would concentrate the currents in the outside of the wall and miss inside defects; lower ones would lose resolution and respond more to the tube's dimensions.

### Differential and absolute coils

Tube mills usually test with a differential coil pair, two coils a few millimetres apart along the tube. A short defect passes through one coil and then the other, giving a characteristic double pulse, while slow changes along the tube, such as a gradual variation in wall thickness or conductivity, affect both coils equally and cancel. That makes the differential test sensitive to the pits, holes and cracks that cause leaks, and insensitive to the long, gradual defects it is not designed to find. Gradual wall thinning, for example, needs an absolute coil, compared against a reference tube.

### Line speed and signal frequency

At the tube mill, tubes pass through the coil at 60 m/min, 1 m/s. A defect passing a coil about 3 mm long produces a pulse at about 1,000 ÷ 3 = 333 Hz. The instrument's filters must pass that frequency, and they must be set at the speed the line actually runs. Chapter 6's scanner went blind when its speed rose fourfold with filters unchanged; a tube line is subject to the same rule, which is why reference checks are run at production speed.

## Reference tubes and what the test promises

The tube maker sets its test's sensitivity on a reference tube: a length of the same size and alloy containing artificial defects, typically small drilled holes through the wall. The gain is set so that the reference holes give a defined signal, and the reject level is a stated fraction of that signal. Standards for this kind of testing, such as ASTM E243, which covers the electromagnetic examination of copper and copper-alloy tubes, set out how reference tubes are made and used; the tube's purchase specification names the standard and the reference that applies.

What the test promises is therefore exact and limited: every tube was passed through a coil set up on a stated reference, and tubes giving signals above the reject level were removed. It does not promise that no tube has a defect smaller than the reference, or a defect of a kind the test cannot see, such as a long, smooth wall thinning in a differential test.

### End zones

As a tube's end enters or leaves the coil, the coil's coupling changes abruptly and gives a large signal unrelated to any defect. The instrument suppresses the alarm for a short length at each end, and those end zones are untested. Purchase specifications for tested tube state how long the end zones may be and how they are handled, usually by cutting them off or by a separate test. For the cooler tubes, which are cut to length from longer tubes, the cuts fall well inside the tested length, and the pump maker's drawing requires the supplier's end zones to be removed.

## Auditing the supplier

The pump maker cannot repeat the mill's test on every tube, but it can check that the supplier's test is being run as promised, and it can sample tubes itself. Its tube bench has a small encircling coil of the same design and a reference tube with the specification's drilled holes.

The audit of each lot has two parts. The supplier's test records are checked: the reference tube's signals at the start and end of each run and at the specified intervals between, the reject level, the line speed and the number of tubes rejected. Then a sample of tubes from the lot is tested on the bench, and any tube with an indication above the reject level counts as a defective: a tube that should have been removed and was not.

### The mistake: a plan that looked strict

The supplier proposed, and the pump maker initially accepted, a sampling plan of 50 tubes from each lot, with the lot accepted if no more than one defective was found. It sounded strict. Nobody calculated what it actually protected against until a lot that the supplier's own later investigation showed had about 3% escaped rejects had passed the audit.

The [acceptance sampling probability tool](/tools/sampling-oc/) gives the probability that a single sampling plan accepts a lot with a given fraction defective, using the binomial distribution. For 50 tubes and an acceptance number of 1, a lot with 3% defective is accepted 55.5% of the time, and one with 5% defective 27.9% of the time. The plan accepted more than half of the lots it should have caught.

The pump maker then decided what protection it actually wanted. A lot with 1% defectives, the acceptable quality level, should be accepted at least 95% of the time, so that good lots are not rejected unfairly, a producer's risk of 5%. A lot with 5% defectives, the rejectable quality level, should be accepted no more than 10% of the time, a consumer's risk of 10%. The [acceptance sampling plan tool](/tools/acceptance-sampling-plan/) searched for the smallest plan meeting both.

```figure
type: compare
title: The supplier's proposed plan and the designed plan, in the acceptance sampling plan tool
cols: Sample size | Acceptance number | Accepts a 1% lot | Accepts a 5% lot | Average outgoing quality limit | Result
rowhead: Plan
- Supplier's proposal | 50 | 1 | 91.06% | 27.94% | 1.670% | PLAN DOES NOT PROTECT BOTH
- * Designed plan | 132 | 3 | 95.57% | 9.92% | 1.472% | PLAN PROTECTS BOTH
caption: This is an illustration. Acceptable quality level 1%, rejectable quality level 5%, producer's risk 5%, consumer's risk 10%. Binomial model.
```

The designed plan tests 132 tubes and accepts on three or fewer defectives. It accepts 95.57% of 1% lots and only 9.92% of 5% lots. Its average outgoing quality limit, 1.472%, is the worst long-run fraction of defectives that would reach the cooler line if rejected lots were fully sorted and their defectives replaced. The supplier's plan, by comparison, failed both of the pump maker's requirements: it rejected good lots too often, 8.94% of 1% lots, and accepted bad lots far too often.

Testing 132 tubes takes about an hour and a half on the bench, against 35 minutes for 50. The pump maker judged that a fair price for a plan that does what it claims, and it asked the supplier to tighten its own process control so that lots run well below the 1% level.

```figure
type: bars
title: Probability of accepting a lot, by fraction defective, for the two plans
x: Fraction of tubes defective in the lot
y: Probability of acceptance, %
caption: This is an illustration. Values from the acceptance sampling probability tool. The designed plan accepts good lots slightly more often and bad lots far less often.
- 2%, plan 50/1 | 73.58
- 2%, plan 132/3 | 72.81
- 3%, plan 50/1 | 55.53
- 5%, plan 50/1 | 27.94
- * 5%, plan 132/3 | 9.92
```

### What counts as a defective

A sampling plan is only as clear as its definition of a defective. On the bench, a tube counts as defective if it gives an indication above the reject level set on the reference tube, the indication repeats when the tube is passed through the coil again, and it is not in an end zone that the specification allows the supplier to leave. A repeating indication is then located and the tube is cut and examined, or pressure tested, so that the supplier receives evidence, not just a number. Indications that do not repeat are recorded as bench noise and do not count, and a rising count of them prompts a check of the bench's guides and coil.

### The model behind the numbers

The sampling tools use the binomial distribution, which treats each sampled tube as an independent draw from a lot so large that sampling does not change its fraction defective. A lot of 2,000 tubes with a sample of 132 is about fifteen times the sample, comfortably within the tool's guidance that lots should be at least about ten times the sample for the binomial model to hold; for smaller lots the hypergeometric distribution gives slightly better protection for the same plan. The sample must also be random across the lot: tubes taken only from the top of one bundle test one part of a run, and a lot made on two shifts or two coils of feedstock should be sampled from all of them.

### Switching rules

Published sampling schemes, such as ISO 2859-1 for sampling by attributes, add switching rules to a plan: normal inspection becomes tightened after a run of rejected lots and may become reduced after a long run of accepted ones. The pump maker uses its designed plan as its normal inspection and has written its own simple rules: two rejected lots in five move the supplier to 100% bench testing until five consecutive lots pass, and ten consecutive accepted lots with no defectives at all allow the sample to be cut back to the supplier's records audit plus 50 tubes, a plan whose weaker protection the pump maker now knows and accepts only for a supplier with that record.

## Bars and wire

The same coil principle tests bars and wire. A bar mill's encircling coil finds surface seams and laps, and bar for critical parts is often bought with such a test specified. For the pump maker's shafts, the 42CrMo4 bar is bought with a test for surface defects at the mill, which the induction hardening and grinding would otherwise expose only after much value had been added. The encircling coil also measures the bar's response as a whole, so the same equipment can sort bar by grade or condition, the subject of Chapter 7.

## Exercise: the designed plan at 2%

Using the acceptance sampling probability tool, how often does the designed plan of 132 tubes with an acceptance number of 3 accept a lot with 2% defective tubes? What is the average outgoing quality at that level? Explain why a plan that accepts a 2% lot nearly three times in four still protects the cooler line.

### Answer

The tool gives a probability of acceptance of 72.81% and an average outgoing quality of 1.456% for a 2% lot.

A 2% lot sits between the acceptable level of 1% and the rejectable level of 5%, where any plan of practical size accepts some lots and rejects others. The protection comes from the whole curve: lots at 5% or worse are accepted less than 10% of the time, and in the long run, with rejected lots sorted, the fraction of defective tubes reaching the cooler line cannot exceed the average outgoing quality limit of 1.472%. Lots that the supplier keeps well below 1% are accepted almost always. The cooler's own pressure test after brazing is the final check on the tubes that pass. A sampling plan controls the long-run quality of what is accepted; it was never meant to guarantee that every single lot is perfect, and its curve should be read with that in mind.
