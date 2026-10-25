---
book: welder-training-by-the-numbers
chapterSlug: qualification-and-its-odds
order: 7
title: "Qualification and its odds"
description: "See what a welder qualification test proves, calculate a trainee's chance of passing from their reject rate, decide when to sit the test, and cost a qualification including retests."
draft: false
---

For structural, pressure and many other kinds of welding, a welder may weld production work only when qualified: when they have welded test pieces under controlled conditions, had them examined and tested, and passed, with the result recorded. Qualification is the formal end of the first stage of training, and the point at which the business can rely on the welder without supervising every weld. It is also a test that can be failed, at a cost, and with a blow to the trainee's confidence. Treating it as a calculated decision, rather than a hurdle to be cleared as soon as possible, protects both.

This chapter explains what a welder qualification proves, calculates a trainee's chance of passing from the reject rate measured in training, uses that to decide when a trainee should sit the test, and costs a qualification including the chance of a retest. It names AS/NZS 2980 and ISO 9606-1, standards for the qualification of welders of steels, by number and scope only; the standard called up by the work and the contract sets the actual requirements.

## What qualification proves

A welder qualification test asks the welder to weld one or more test pieces of a specified joint type, material, thickness and position, using a qualified procedure. The test pieces are examined visually and then by destructive or non-destructive tests, such as bend tests, fracture tests, macro sections or radiography, as the standard requires. If they meet the acceptance criteria, the welder is qualified to weld production joints within a range of variables that the standard relates to the test, such as process, joint type, thickness range and positions.

Qualification proves that the welder could make a sound weld of that kind, on that day, under test conditions. It does not prove that every weld they make will be sound, which is why production welds are still inspected. And it is not permanent: the standards set requirements for keeping a qualification current, such as evidence that the welder has continued to weld within its range, and for renewing it, and the employer must keep the records. Testing Welded Joints by the Numbers sets out how welder qualification fits with procedure qualification and production testing in its chapter on [qualification, records and the cost of testing](/reados/publications/testing-welded-joints-by-the-numbers/qualification-records-and-the-cost-of-testing/).

## Qualification within a range

The range of qualification matters to the training plan. A test in one position may qualify the welder for some other positions but not all, a test on one thickness may cover a range of thicknesses, and a fillet test qualifies for fillets but not for butt welds. The fabricator's manager chose the qualification tests for its trainees from the work they would do: fillet welds in the flat, horizontal and vertical-up positions, in carbon steel within the shop's thickness range, with the shop's flux-cored process. The standard in use, read by someone competent to interpret it, decides which tests give that range. Training aimed at the wrong test, or a test that does not cover the work, wastes both.

## The odds of passing

A qualification test is a small sample of the welder's work, judged strictly. Its outcome depends on the welder's true reject rate, the rate at which their welds would fail the same examination if they made many of them. If a test has n test pieces and each must pass, and the welder's true reject rate per piece is r, then, treating the pieces as independent, the chance of passing is

P(pass) = (1 − r)ⁿ

```figure
type: formula
title: Chance of passing a two-piece qualification test
formula: P(pass) = (1 − r) ^ n
caption: This is an illustration. Real tests have their own number of pieces and examinations, and test conditions often raise a trainee's reject rate above their practice rate, so the true chance may be lower.
- r, the trainee's reject rate per test piece | 8%
- n, test pieces that must all pass | 2
step: P(pass) = 0.92 ^ 2
step: P(pass) ≈ 0.846, about 85%
```

A trainee whose practice reject rate is 8%, a good rate after a year of training, has only about an 85% chance of passing a two-piece test, and about a 78% chance of passing a three-piece test. The test is unforgiving because every piece must pass. The arithmetic also explains a familiar experience: good trainees fail qualification tests more often than their practice results suggest they should, not because the test is unfair but because a test of a few pieces, all of which must pass, is a hard test of a welder who still makes an occasional bad weld.

```figure
type: bars
title: Chance of passing a two-piece qualification test by reject rate
unit: % chance of passing
max: 100
caption: This is an illustration from P = (1 − r)². The trainee's reject rate is measured on practice coupons examined in the same way as the test pieces.
- 2% reject rate | 96.0
- 5% reject rate | 90.3
- *8% reject rate | 84.6
- 12% reject rate | 77.4
- 18% reject rate | 67.2
- 25% reject rate | 56.3
```

## Under test conditions

The calculation assumes the trainee welds the test pieces as they weld in practice. Many do not: the test is formal, witnessed, one-off, and the trainee knows it matters, and nerves raise the reject rate for some people. Unfamiliar conditions, such as a different booth, a different plate batch or a witness standing behind them, add to it. The practical answer is to make the test as unremarkable as possible. The fabricator's module tests (Chapter 4) are run in the same way as the qualification test, with the same coupons, examinations and a witness, so that by the time the real test comes, the trainee has done it many times. Mock tests, with the same conditions and examinations, also measure the trainee's reject rate under test conditions, which is the rate that matters.

## When to sit the test

A test sat too early is likely to be failed, and a failed test costs money, time and confidence. A test sat too late wastes months in which a qualified welder could have been welding production work. The learning curve and the odds together give a rule. The manager sets a target probability of passing, say 90%, and the trainee sits the test when their reject rate under mock test conditions, measured on enough coupons, supports that probability.

For a two-piece test and a 90% target, (1 − r)² ≥ 0.90 means r ≤ about **5.1%**. On Chapter 3's illustrative curves, that comes later than the 8% target the manager first set; the difference is the time between "usually good" and "reliably good". The fabricator compromised on a target of about 85%, a reject rate of about 8%, measured on at least 40 mock-test coupons, accepting that one trainee in six or seven might need a retest, because the months saved for the others were worth more than the occasional retest.

## The cost of a qualification

This is an illustration. The fabricator's qualification test costs about **A$1,500**, excluding GST, for the plate and its preparation, the welder's and witness's time, and the laboratory examination and tests. If a trainee's chance of passing is P, and a failed test is simply repeated after more practice, the expected number of attempts is 1 ÷ P, and the expected test cost is about A$1,500 ÷ P.

```figure
type: stats
title: Expected cost of qualifying one trainee on a two-piece test
caption: This is an illustration, excluding GST, at A$1,500 an attempt and assuming each attempt has the same chance of passing. Extra practice before a retest, and the delay to production, are not included.
- A$1,560 | At a 2% reject rate | 96% chance of passing
- *A$1,770 | At an 8% reject rate | 85% chance
- A$2,230 | At an 18% reject rate | 67% chance
- A$2,670 | At a 25% reject rate | 56% chance
```

The test cost itself does not change much with the reject rate, but the hidden costs do: each failed attempt adds weeks of practice and delay, discourages the trainee, and, if the failure is in front of a customer's inspector, may cost the business some credibility. The case for waiting until the trainee is ready is stronger than the test fee suggests.

## Retests

The standards set rules for retesting after a failure, and the manager follows the one that applies. Whatever the rule, a failed test is information: the examined test pieces show exactly what went wrong, and a broken face or bend specimen with lack of fusion tells the instructor what to work on before the retest. The fabricator's practice after a failure is to review the failed pieces with the trainee, add focused practice on the fault, run new mock tests until the reject rate is back below the target, and only then book the retest.

## Preparing the trainee

The weeks before a test are about confidence as much as skill. The fabricator's instructor goes through the test with each trainee in advance: what will be welded, in what order, how the pieces will be marked, what the witness will watch for, how the pieces will be examined and what the acceptance criteria are. The trainee welds full mock tests, start to finish, at the same time of day as the test will be, and sees the results examined the same way. On the day, the trainee checks the machine settings against the procedure, has time to run a few practice beads on scrap plate, and is not rushed. A trainee who knows exactly what is coming, and has done it many times, is far more likely to weld the test pieces as well as the practice pieces.

## Witnesses and laboratories

The standards say who must witness a qualification test and who may examine and test the pieces. Depending on the work, the witness may be the fabricator's own qualified welding inspector, a third-party inspector, or a representative of the customer, and the testing may need to be done by a laboratory accredited for the tests. The manager checks the requirements of the work before booking, because a qualification witnessed or tested by the wrong person may not be accepted, and arranges the test with enough notice for the witness and the laboratory. The record of the test, with the witness's signature and the laboratory report, is kept in the welder register.

## What a pass means to the business

A qualified welder is a different asset from a trainee. The business can schedule them on production work without a supervisor beside them, quote jobs that need their range, and show customers and inspectors a register of qualified welders. Each qualification is also evidence that the business's training works. The fabricator's register, with the qualifications of its four trainees added over the year, became part of the information it gives customers when tendering for work that requires qualified welders.

## Keeping qualifications current

Once qualified, the welder's qualification must be kept current under the rules of the standard, which typically require evidence that the welder has continued to weld within the range of qualification, and periodic confirmation or renewal. The fabricator records each welder's qualification, its range, the work they have done within it and the renewal dates in its welder register, reviewed monthly. A qualification that lapses because nobody noticed can stop a welder working on a job, and Chapter 8 explains why a welder who has not welded in a position for some time may need practice before relying on a qualification that is still technically current.

## The running case: four tests

This is an illustration. Chris, whose learning curve was the steepest, sat his qualification test in the seventh month, after his reject rate on mock tests had been below 8% for 50 coupons, and passed. Dee sat hers in the eighth month and passed. Ben, pressed by the manager's early forecast (Chapter 3), was booked in the ninth month with a mock-test reject rate of about 14%, a chance of passing of about 74% on the calculation, and failed one vertical piece with lack of root fusion. After six more weeks of focused vertical practice and a mock-test rate below 8%, he passed the retest. Ana's test was planned for early in her second year.

## A failure: the test that did not cover the work

This is an illustration. Some years earlier, the fabricator had qualified a welder on fillet welds in the flat and horizontal positions, because those were the easier tests, and then sent the welder to a site job that needed vertical fillets. The site inspector checked the welder's qualification record, found that it did not cover the vertical position, and stopped the work until a qualified welder arrived. The day lost on site cost more than the extra test would have.

The manager now matches each welder's qualification range to the work before scheduling them, using a simple table of jobs against the welders qualified for each, and plans training and testing around the gaps the table shows.

## Exercise: three pieces or two?

A trainee has a reject rate under mock test conditions of 6%. Calculate their chance of passing a two-piece test and a three-piece test. If the manager wants at least an 85% chance, which test can the trainee sit now, and what reject rate would they need for the three-piece test?

For two pieces, P = 0.94² ≈ **88.4%**; for three, P = 0.94³ ≈ **83.1%**. The trainee can sit the two-piece test now with the manager's 85% target, but not the three-piece test.

For a three-piece test at 85%, (1 − r)³ ≥ 0.85, so 1 − r ≥ 0.85^(1/3) ≈ 0.947, and r ≤ about **5.3%**. The trainee needs a little more practice, and enough mock-test coupons to show the lower rate, before sitting the three-piece test.
