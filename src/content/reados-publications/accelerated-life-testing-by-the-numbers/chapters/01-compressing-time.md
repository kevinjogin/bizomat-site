---
book: accelerated-life-testing-by-the-numbers
chapterSlug: compressing-time
order: 1
title: "Compressing time: what can be accelerated and what cannot"
description: "Wear-out, overstress and early failures, the acceleration factor and its rules, FL-60's use profile and life target, and a whole-floodlight test at 85 °C that proved nothing."
draft: false
---

FL-60's driver must survive ten years of nights. The business has three months of chamber time to show that it will. The gap between those two numbers, a factor of about forty, is what accelerated life testing exists to close. It does so by running the product, or the parts that limit its life, under conditions harsher than service, so that the processes that wear it out run faster and the damage of years accumulates in weeks.

That works only when the harsher conditions speed up the same processes that wear the product out in service, and nothing else. This chapter sets out which failures can be accelerated and which cannot, defines the acceleration factor and the rules that keep it honest, describes FL-60's service conditions and life target in numbers, and ends with a first attempt at a quick life test that broke every rule at once.

## Three kinds of failure

Products fail for different reasons, and the reasons behave differently in time.

- **Early failures** come from defects introduced in manufacture: a cracked component, a poor solder joint, contamination, a damaged seal. They show up early in life and their rate falls as the defective units are weeded out. Screening and process control deal with them; a life test can reveal them but cannot predict their rate in production unless the test units are typical of production.
- **Overstress failures** happen when a single event exceeds what the product can bear: a lightning surge, a dropped unit, a short circuit, a forklift strike. They occur at a roughly random rate set by the environment, and a product's defence is its margin above the stresses it will meet. Overstress cannot be accelerated in time; it can only be probed by finding how much stress the product withstands, which is the subject of Chapter 8.
- **Wear-out failures** come from damage that accumulates slowly through a physical or chemical process: electrolyte loss in a capacitor, corrosion, diffusion, fatigue of a solder joint under repeated thermal cycles, degradation of a polymer. Their rate rises with age. These, and only these, can be accelerated, because the rate of the underlying process depends on stresses that can be raised.

```figure
type: compare
title: Failure kinds in FL-60 and what testing can do about them
cols: Example in FL-60 | How it behaves in time | What testing can do
caption: This is an illustration. Accelerated life testing addresses only the third row; the others need screening and margin testing.
- Early failures | a solder void, a nicked gasket | rate falls as defects are weeded out | screen in production; check process capability
- Overstress | a surge on the supply, a dropped unit | random, set by the environment | find margins with step-stress tests and HALT
- * Wear-out | capacitor electrolyte loss, solder fatigue, corrosion | rate rises with age | accelerate with temperature, humidity and cycling; predict life
```

## The acceleration factor

The **acceleration factor**, AF, is the ratio of life in service to life under the test conditions, for the same failure mechanism: AF = life at use ÷ life at test. An acceleration factor of 20 means that one hour of test does the damage of twenty hours of service, so a 2,000-hour test represents 40,000 hours.

The factor is not a property of the test; it is a property of a **mechanism** under two sets of conditions. A capacitor's electrolyte loss, a corrosion process and a solder joint's fatigue each have their own model and their own factor, and the same test may accelerate them very differently. A test whose conditions accelerate the driver's capacitors by a factor of 20 might accelerate the gasket's ageing by a factor of 5 and the LED board's solder fatigue not at all, because a constant high temperature does not cycle the joints. Each mechanism that matters must be identified, and either tested under conditions that accelerate it or argued to be covered in another way.

### The rules that keep a factor honest

An acceleration factor is only meaningful under three conditions, and almost every misleading accelerated test breaks at least one of them.

1. **Same mechanism.** The test must fail the product by the same physical process as service does. If a higher stress introduces a new mechanism, such as melting, boiling, softening above a glass transition, or exceeding a component's rated temperature, the test measures that new mechanism and says nothing about service.
2. **Same shape of failure distribution.** Acceleration should stretch or compress the time scale without changing how failures spread out in time. In Weibull terms, Chapter 6 will show, the shape parameter should be the same at test and in service; a change of shape is a warning that the mechanism has changed.
3. **A model that holds across the range.** The factor is calculated from a model, such as the Arrhenius equation of Chapter 2, whose parameters were measured for the mechanism. The further the test stress is from the use stress, the more the result depends on extrapolating that model, and the more a small error in its parameters is magnified.

## Why wear-out has a rate

Each wear-out mechanism is a physical process that runs at a rate, and the rate depends on the conditions in a way that can, at least approximately, be written down. That is what makes acceleration possible, and the kind of process decides which stress accelerates it.

- **Thermally activated processes**, such as chemical reactions, the diffusion of atoms through a solid and the slow escape of electrolyte through a seal, depend on molecules or atoms gaining enough energy from random thermal motion to get over a barrier. Statistical physics says the fraction that do so follows the Boltzmann factor, exp(−E/kT), and that gives the Arrhenius model of Chapter 2. Raising the temperature raises the rate steeply.
- **Processes that need a reactant**, such as corrosion, which needs water at a surface, depend on how much of the reactant is available as well as on temperature. Humidity is the second accelerating stress, and Chapter 4's Peck model combines it with temperature.
- **Fatigue processes**, such as the cracking of a solder joint whose materials expand at different rates, accumulate damage in each cycle of strain. They are accelerated by making the cycles bigger and more frequent, not by making the product hotter, and Chapter 5's models describe how.

Naming the process behind each life-limiting part is therefore the first technical step in any accelerated test, before any chamber is booked. It decides which stress to raise, which model converts test time into service time, and which limits the test must stay below. A product with three life-limiting mechanisms needs three arguments, though some can share a test, and a part whose mechanism is unknown needs failure analysis of field returns or of a deliberately overstressed sample before its life can be predicted.

## FL-60's service conditions

An acceleration factor needs two sets of conditions, and the use conditions are as important as the test conditions. They must describe how the product is really used, not a single convenient number.

This is an illustration. FL-60 runs 12 hours a night, every night, for 10 years: 4,380 hours a year and **43,800 operating hours** in total. Its driver sits in the housing above the LED board, and its electrolytic capacitors run warmer than the night air by the driver's own losses and the housing's temperature rise. Measurements on a prototype, combined with a range of Australian night-time temperatures, gave the business a profile of capacitor core temperatures over the operating hours.

```figure
type: bars
title: FL-60 driver capacitor core temperature, share of operating hours
unit: %
max: 60
caption: This is an illustration. The profile combines measured temperature rises with assumed night-time air temperatures across the year. The arithmetic mean is 55.5 °C, but Chapter 2 shows that the hot hours count for more.
- 45 °C | 25
- * 55 °C | 50
- 65 °C | 20
- 75 °C | 5
```

The LED board meets a different stress. It warms from the evening air to about 60 °C each time the floodlight switches on and cools again when it switches off, so its solder joints go through about one thermal cycle a day, roughly 20 °C to 60 °C, or **3,650 cycles** in 10 years. The housing and gasket meet sun, rain and humidity, and the driver spends its off hours in whatever humidity the housing lets in. Each of these stresses drives a different mechanism, and the later chapters treat them in turn.

```figure
type: stats
title: FL-60's life requirement in numbers
caption: This is an illustration. Every test in this book is measured against these figures.
- 43,800 h | operating hours in a 10-year design life at 12 h a night
- 90% | drivers that must survive the design life
- 90% | confidence with which that must be shown
- 3,650 | daily thermal cycles on the LED board in 10 years
- about 2,200 h | chamber time available in three months
```

The last line sets the challenge. Demonstrating 43,800 hours in about 2,200 hours of test needs an acceleration factor of about **20**, and Chapter 7 will show that demonstrating it with confidence on a handful of units needs the test to run longer than one design life, which pushes the required factor higher still.

## The target behind the target

FL-60's reliability target is a business decision, and it is worth being clear about where it comes from. The business offers a 5-year warranty, so failures in the first 21,900 operating hours cost it directly in replacements, freight and reputation. Beyond the warranty, the Australian Consumer Law's consumer guarantees still require goods to be of acceptable quality, including reasonably durable, for what a buyer would expect of that kind of product at that price, whatever the written warranty says, as the ACCC explains in its guidance for consumers and businesses. A floodlight sold for a ten-year life that fails widely at year six invites claims and damages the brand regardless of the warranty period.

So the target of 90% surviving 10 years is a design aim set by the business, not a figure from a standard. It is the number the tests in this book are designed to demonstrate, and the business revisits it if the evidence suggests it is either too lax or unreachable at the product's price.

## The error: a whole floodlight at 85 °C

This is an illustration. Early in development, eager for a quick answer, the team put three complete prototype floodlights into a chamber at **85 °C** air, switched them on, and left them. The reasoning was that 85 °C is far hotter than any Australian night, so a few weeks would represent many years.

Within six days, all three drivers had failed. The team's first reading was alarming: if 85 °C accelerated life by a factor of, say, 50, six days of test meant less than a year of service. A redesign was nearly started.

The failure analysis told a different story. With the chamber at 85 °C and the driver running at full load inside a sealed housing, the capacitors' cores had reached about **125 °C**, well above their rated maximum of 105 °C. Their electrolyte had boiled and their pressure vents had opened, a mechanism that cannot occur in service, where the cores never exceed about 75 °C. The polycarbonate secondary optics had also yellowed and distorted, another mechanism with no counterpart in service. The test had measured how the floodlight fails when cooked, which was not the question.

The team replaced the test with a plan in which each mechanism has its own test: the driver alone, in a chamber set so that its capacitor cores run at no more than their rated 105 °C, for capacitor wear-out; the LED board in a thermal-cycling chamber for solder fatigue; the sealed housing in a humidity test; and the optics in a separate UV and heat exposure agreed with their supplier. The temperatures inside each test item are measured, not assumed, with thermocouples on the parts that matter.

```figure
type: checklist
title: Before trusting an accelerated test
caption: The open item is this chapter's error. Measure the stress on the part, not just the chamber setting.
- x Mechanism identified for each life-limiting part | capacitor, solder joint, seal, optic
- x Test stress accelerates that mechanism | temperature, cycling or humidity as appropriate
- x Model and parameters known for the mechanism | Chapters 2 to 5
- x Use conditions described as a profile | core temperature hours, cycles, humidity hours
- ? Stress on every part stays below its limits | capacitor cores at 125 °C against a 105 °C rating
```

## How this applies to a small Australian business

Small manufacturers often skip accelerated testing because it looks expensive, or run a single "torture test" because it looks thorough. Both waste the opportunity. A few weeks of well-chosen testing on the parts that limit life, with the stresses on those parts measured, answers the question that matters: will the product last as long as the business is promising? The first step costs nothing but thought: list the life-limiting parts and the mechanism that wears each one out, describe the service conditions as a profile rather than a single worst case, and check that every planned test stays below each part's limits. Chamber time can then be hired from a test laboratory, and spent where it answers a real question.

## Exercise: a six-week chamber

The business is offered six weeks of continuous chamber time instead of three months. How large an acceleration factor would be needed to cover FL-60's 43,800-hour design life in that time, and to cover twice the design life, which Chapter 7 shows is useful for a small sample? Would a 40 K rise in capacitor core temperature be enough if the mechanism followed the capacitor makers' rule of doubling life for each 10 K?

**Worked answer.** Six weeks is 6 × 7 × 24 = **1,008 hours**. One design life needs AF = 43,800 ÷ 1,008 = **43.5**; two design lives need **86.9**. Under the doubling rule, a 40 K rise gives a factor of 2⁴ = **16**, well short of either. Even a 50 K rise, taking the cores from about 55 °C to the 105 °C rating, gives only 2⁵ = 32. The six-week chamber cannot demonstrate the life on its own at the rated temperature, and pushing beyond the rating would break the first rule. The business would need more test time, more units, or evidence from the capacitor maker's own life data, all of which later chapters consider.
