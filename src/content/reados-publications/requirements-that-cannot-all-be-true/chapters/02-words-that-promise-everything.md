---
book: requirements-that-cannot-all-be-true
chapterSlug: words-that-promise-everything
order: 2
title: "Words that promise everything: unbounded requirements and the paradox of the stone"
description: "Why words such as zero, maintenance-free, rigid and any make requirements that defeat themselves, and how to bound each one with a quantity, a condition and a test before quoting."
draft: false
---

Some requirements fail before they meet any other requirement. They fail because they ask for an attribute without a limit: zero backlash, maintenance-free, rigid, any part, all conditions, unlimited life. Each word sounds like a quality standard. Taken at its word, each is a demand that no machine can meet, and pursuing it pushes the design into conflict with everything else on the list.

This chapter looks at why unbounded words defeat themselves, using an old puzzle about omnipotence, and then shows how to bound each one in the inspection station request so that a design can meet it and a test can confirm it.

## The paradox of the stone

Patrick Grim's chapter on impossibility arguments in *The Cambridge Companion to Atheism* begins with the best-known puzzle about an unlimited power. Could a being able to do anything make a stone too heavy for itself to lift? If it can, there is something it cannot do, namely lift that stone. If it cannot, there is something it cannot do, namely make it. Either way, the unlimited power has a limit.

Grim traces the replies. One, associated with Aquinas, says that a contradictory description, such as a square circle, does not describe a task at all, so failing to perform it is no limit. That reply works for contradictions. Grim argues that it does not rescue unlimited power from the stone, because "make something too heavy for its maker to lift" is not contradictory: an ordinary person can do it. The puzzle survives because it pairs two powers that pull against each other, making and lifting, and asks for both without limit.

Whatever one concludes about the theological question, which this book leaves alone, the structure is familiar to anyone who writes specifications. An attribute demanded without limit eventually collides with another attribute that pulls the other way. The collision is not a failure of effort or ingenuity. It is built into the words.

## Unbounded words in the request

This is an illustration. The applications engineer marks every requirement in the inspection station request that contains an unbounded word, and asks what it would demand if taken literally.

```figure
type: compare
title: What the unbounded words would demand at their limit
cols: Taken literally, it demands | What it collides with
caption: This is an illustration. Each word, pushed to its limit, defeats another requirement on the same list.
- R10 Zero backlash | No clearance anywhere in the drive, under any load, at any temperature | Friction, heat and life: preload to remove clearance adds drag, warms the screw and consumes rated life (R3, R8)
- R9 Maintenance-free | No lubrication, adjustment, cleaning or inspection, ever | Rated life assumes lubrication (R8); the customer's own general condition G1
- R3 Positioning accuracy over the full travel | The same accuracy at every point, every time, at every temperature | Thermal growth of a 1.5 m screw in a 15 to 35 °C shop (R4)
- R8 Life 20,000 hours | Every axis lasts 20,000 hours, whatever the duty | Rated life is a statistical figure for a stated duty; some axes fail earlier
- R6 Probe tip sag no more than 0.010 mm anywhere | A beam that does not bend under a moving 60 kg head | Depth and mass limits on the beam (R7)
```

None of these words is careless. Each was written to protect something real. Zero backlash protects bidirectional probing. Maintenance-free protects scarce fitter hours. But each, unbounded, asks for more than its author wanted, and the excess is what causes the conflict.

## Zero backlash: the requirement that defeats itself

Zero backlash is the clearest case, because the means of approaching it works directly against other requirements.

A ball screw nut has a small clearance between balls and grooves. On reversal, the screw turns through that clearance before the carriage moves, so the carriage lags. A probe that touches a hole wall from the left and then from the right sees the lag as a size error. The usual way to remove it is preload: the nut is built so that two sets of balls are pressed against opposite groove flanks, taking up the clearance.

Preload removes measurable clearance, but it is a load the nut carries all the time, whether the carriage moves or not. It raises the drag torque, so the motor works harder. It generates heat in the nut, which warms the screw, which grows, which shifts the carriage's position. And because rated life falls with the cube of load, preload uses up life even when the external load is tiny. Chapter 4 calculates this for the case. Here the qualitative point is enough. The harder the design chases zero, the more it spends of R3, R8 and R11.

```figure
type: balance
title: What preload buys and what it costs
left: Gains as preload rises
right: Costs as preload rises
caption: Each step towards zero clearance moves weight to the right-hand pan. The useful question is how much clearance the probing can tolerate, not how close to zero the drive can get.
- Clearance taken up on reversal | Drag torque and motor size
- Higher axial stiffness of the nut | Heat in the nut and growth of the screw
- Repeatable bidirectional probing | Rated life, which falls with the cube of load
- | A larger, dearer nut to carry the preload
```

### Bounding it

The bounded form asks: how much lost motion can the probing tolerate, measured how? The engineer asks the customer's quality engineer, who explains that holes are measured by touching opposite walls and averaging. A reversal error of up to 0.003 mm at the probe, if repeatable, is corrected by the probing routine's calibration. The bounded requirement becomes:

> R10: Reversal error at the probe no more than 0.003 mm at any position, measured by a bidirectional positioning test at 20 °C.

That requirement can be met with moderate preload, and it can be tested. It also tells the designer that reversal error does not need to be zero, only small and repeatable.

## Maintenance-free: a word that means different things to each reader

Maintenance-free is unbounded in a different way. It has no single literal meaning, so each reader supplies one. To a bearing maker it means sealed and greased for a stated life. To a maintenance manager it may mean no task at all, ever. To a purchasing officer it may mean no maintenance cost in the first year.

Chapter 1 resolved the contradiction with G1 by asking what the customer meant: no task more often than the annual shutdown, and none that needs guards removed in production. That definition is bounded by an interval and a condition. It can be designed for: a lubrication unit sized for a year's travel, with its fill point outside the guard.

The engineer also writes down what the definition does not cover. An annual relubrication is maintenance. So is replacing a worn wiper seal, cleaning a scale, or checking the axis against a reference. The bounded requirement lists these as annual shutdown tasks, with an estimated time for each, so nobody can later claim that "maintenance-free" was broken by them.

## Accuracy, life and rigidity: the hidden quantifiers

Three more words in the request are unbounded in a quieter way. They carry a hidden "all".

- **Accuracy over the full travel** hides "at all temperatures the workshop reaches". In a 15 to 35 °C shop, that one word turns a precision requirement into a thermal requirement. Chapter 5 shows that a 1.5 m steel frame is about 0.26 mm longer at 35 °C than at 20 °C, so the requirement must say at what temperature the dimension is meant.
- **Life of 20,000 hours** hides "for every axis built". Ball screw rated life is the life that a stated share of a large group will reach, at a stated duty and with proper lubrication. It is not a promise about each unit. Chapter 4 bounds it.
- **Sag no more than 0.010 mm anywhere** hides "with no correction". A beam that bends the same way every time can be mapped and corrected in software. Chapter 6 shows that the uncorrected version is physically impossible within the beam limits, and the corrected version is easy.

Each of these words carries an unstated "all": all temperatures, all axes, all positions. A claim about all cases needs evidence about all cases, or it must say which cases it covers.

## Where unbounded words come from

Unbounded words rarely start as anyone's considered requirement. Most arrive by one of three routes, and knowing the route tells you whom to ask.

- **Catalogue language.** "Zero backlash", "maintenance-free" and "rigid" are marketing words before they are engineering words. A customer who has read a supplier's brochure writes the brochure's adjective into a specification, expecting the brochure's product. The person to ask is the author, and the useful question is which product they had in mind and what they liked about it.
- **Copying from the last specification.** A requirement that made sense for a previous machine is carried into the next one without its condition. The last station may have stood in an air-conditioned metrology room, where "accuracy over the full travel" needed no temperature. Copied into a request for an unconditioned workshop, the same words become a different and much harder requirement. The person to ask is whoever owns the template.
- **Fear of leaving something out.** An author who is unsure what is needed writes the strongest word available, on the reasoning that it is safer to ask for too much. It is not safer. It makes the specification impossible, and then the supplier, not the author, decides which part of it to quietly ignore. The person to ask is the author, and the useful question is what would go wrong if the requirement were relaxed.

In every case the bounded form comes from the purpose, and the purpose comes from a person. A supplier who bounds the words itself, without asking, has rewritten the customer's specification without the customer's agreement. That is sometimes necessary to produce a quote at all, but it must be stated in the quote as an assumption, not left for the customer to discover.

## Redefinition and vagueness: two bad escapes

Grim notes two common responses to an impossibility argument. One is redefinition: keep the word, but shrink what it means until the argument no longer applies. The other is retreat into vagueness: keep using the word without saying what it means, so that no argument can get a grip. He observes that both work only by draining the word of content.

Both happen to specifications.

**Redefinition after the fact** is the supplier's version. A machine is sold as maintenance-free; when it needs grease, the supplier explains that maintenance-free always meant "between scheduled services". The word survives; the promise has gone. Bounding the word before the contract, as above, prevents this, because both parties agreed what it meant when nothing was at stake.

**Vagueness** is the customer's version. A requirement such as "the station shall be accurate and reliable" cannot be failed, because there is no test it could fail. That feels safe to the customer. It is not. A requirement that cannot be failed cannot be accepted either, and disputes about it are settled by whoever argues longer. The test of a requirement is whether you can describe the measurement that would show it was not met.

```figure
type: decision
title: Is this requirement bounded?
question: Could you describe a measurement that would show the requirement was not met?
caption: A requirement that passes all three checks can be designed for and accepted. One that fails any of them needs rewriting before quoting.
- No | Unbounded or vague | Add a quantity, a condition and a test method before quoting.
- Yes, but only one way of reading it | Possibly contradictory | Confirm the meaning with its author in writing.
- * Yes, and the quantity, condition and test are stated | Bounded | Check it against the other requirements in the conflict screen.
```

## The failure case: maintenance-free on the last job

This is an illustration. The machine builder had been caught by this word before. A conveyor transfer it supplied was described in its quote as having "maintenance-free bearings". The bearings were sealed units greased for life by their maker, and the builder meant exactly that. Eighteen months later one ran dry in a hot, dusty position and seized. The customer refused to pay for the replacement, arguing that a maintenance-free bearing should not fail. The builder argued that sealed-for-life bearings have a finite grease life that depends on temperature, and that the bearing had reached it.

Both were right about what they had meant. Neither had written it down. The dispute cost more in time than the bearing.

### How it is detected and corrected

The failure is detected by the marking exercise above: every unbounded word in a specification or a quote is flagged before it is sent. The correction is to replace the word with its bounded form, agreed in writing with the reader most likely to rely on it. For the conveyor, that would have been: "Sealed bearings, greased for life by the maker; expected grease life at the stated temperature, and replacement interval, as in the maintenance schedule." Longer, duller and impossible to dispute.

The machine builder now applies the same rule to its own quotes as to its customers' specifications. A quote that promises an unbounded attribute is a specification written by the supplier, and it is held to the same standard.

## Bounded forms for the case

The engineer's rewrite of the unbounded requirements becomes the first page of her response to the customer. It does not yet resolve the physical conflicts; those need the calculations in Chapters 3 to 7. It only makes the requirements definite enough to calculate with.

```figure
type: compare
title: Unbounded requirements rewritten in bounded form
cols: Quantity | Condition | Test
caption: This is an illustration. The purposes behind each requirement, confirmed with their authors, set the numbers. The physical conflicts are tested against these bounded forms.
- R10 Reversal error | No more than 0.003 mm at the probe | Any position, 20 °C | Bidirectional positioning test
- R9 Servicing | No task more often than annually; none needing guards removed in production | Stated duty | Maintenance schedule review at design
- R3 Positioning accuracy | ±0.010 mm | Over the full travel, referred to 20 °C | Positioning test with temperature recorded
- R8 Life | 20,000 machine hours | Stated duty cycle, lubricated to schedule | Rated life calculation with stated reliability
- R6 Probe tip sag | Repeatable within 0.002 mm after correction | Anywhere on the travel | Mapping run, then verification run
```

The R3 and R6 rows already depart from the request: R3 now names a reference temperature, and R6 now allows correction. Both changes are proposals, not decisions. Chapters 5 and 6 supply the calculations that justify them, and Chapter 9 records who agreed.

## Exercise: bound three requirements

Rewrite each of these requirements in bounded form, with a quantity, a condition and a test. Say what each would collide with if left unbounded.

1. "The fixture shall hold the part rigidly."
2. "The guard shall be dust-proof."
3. "The software shall accept any part number."

**Worked answer.**

1. Left unbounded, "rigidly" demands zero deflection, which collides with any limit on fixture mass or cost and with the part's own stiffness. Bounded: "Under the cutting force stated in the process sheet, the part shall move no more than 0.02 mm at the cutting point, measured with a dial indicator under a static test load equal to that force." The number comes from the machining tolerance it protects.
2. Left unbounded, "dust-proof" demands a seal against particles of every size, which collides with ventilation, access and cost. Bounded: "The enclosure shall meet the dust protection level stated in the electrical specification, by reference to the enclosure rating standard the specification names, with the door seals and cable glands as installed." The test is the rating and an inspection of the installed glands. If the specification names no rating, that is the question to ask.
3. Left unbounded, "any part number" demands acceptance of strings of any length and character set, which collides with the database field, the barcode format and the label printer. Bounded: "The software shall accept part numbers of 4 to 20 characters from the set A–Z, 0–9 and hyphen, as used in the customer's ERP system, and reject others with a message." The test is a set of valid and invalid examples, including the longest real part number in use.
