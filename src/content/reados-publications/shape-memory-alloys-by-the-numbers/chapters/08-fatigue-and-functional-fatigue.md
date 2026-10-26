---
book: shape-memory-alloys-by-the-numbers
chapterSlug: fatigue-and-functional-fatigue
order: 8
title: "Fatigue: breaking and forgetting"
description: "Separate a wire breaking from a wire losing its stroke, design within the limits that set life, plan an endurance test, and catch a soldered termination that failed early."
draft: false
---

A shape memory wire can wear out in two ways. It can break, like any metal under repeated load: that is ordinary, or structural, fatigue. Or it can keep working while gradually losing its ability to do its job: its stroke shrinks, its transformation temperatures drift, and it no longer returns fully to its original length. That second kind is called functional fatigue, and it is the more common reason a wire actuator stops working well.

This chapter sets out what drives each kind, turns the wire maker's guidance into limits for VL-25, plans the endurance test that proves the latch's life, and records a termination method that turned a wire good for tens of thousands of operations into one that broke within a few thousand.

## Structural and functional fatigue

**Structural fatigue** is the growth of a crack from a flaw under repeated stress until the wire breaks. In shape memory wire, cracks usually start at surface defects, inclusions, nicks from handling, or points where the wire is bent sharply or gripped hard. The wire's surface condition and the details of its terminations matter as much as its stress.

**Functional fatigue** is a gradual change in the wire's transformation behaviour with cycling. Each transformation leaves a small amount of permanent change in the microstructure, mostly in the first cycles and more slowly thereafter. The visible effects are a residual strain, so the cool wire does not quite return to its original length; a smaller recoverable strain, so the stroke shrinks; and a drift in the transformation temperatures. Wire supplied for actuators is usually trained by the supplier, cycled under controlled conditions so that most of the change happens before delivery, but some settling always remains, as Chapter 4's endurance test showed.

Both kinds of fatigue are driven by the same few things, and the design limits that control one control the other.

```figure
type: compare
title: What shortens a shape memory wire's life
cols: Main effect | VL-25's design choice
caption: This is an illustration. The actuator wire maker's published guidance, listed in the references, describes 2% to 6% working strain as reasonable for tens of millions of cycles within its stress guidelines, and much shorter lives at higher stress or strain.
- Working strain | larger strain, faster loss of stroke | 2.67%, well inside the range
- Peak stress | higher stress, faster loss and earlier cracks | 148 MPa at the start of the stroke, below 172 MPa
- Peak temperature | overheating degrades the memory | current-limited drive with a hardware time limit
- Blocking at a stop | very high stress, rapid loss | stop beyond the free stroke, over-stroke link
- Terminations and bends | cracks start at sharp grips, bends and heated zones | crimped ends, straight pull, no solder
- Surface damage | cracks start at nicks | wire handled with clean tools, routed clear of edges
```

## The guidance and VL-25's numbers

The wire maker's data, listed in the references, describes repeatable motion of 2% to 6% of the working length as reasonable for tens of millions of cycles when the wire is used within its stress guidelines, and warns that at higher stresses or strains, good motion may last only hundreds or a few thousand cycles. That is not a fatigue curve, but it frames the design: work towards the lower end of the strain range, below the 172 MPa stress guideline, and the wire can last far longer than VL-25 needs.

This is an illustration. VL-25's required life comes from its duty. A weekly self-test for 15 years is 52 × 15 = **780** operations; remote openings for genuine venting, perhaps a few hundred more; production tests and commissioning, a few dozen. The team set the requirement at **20,000 operations**, about twenty times the expected duty, to cover the unexpected: a fault that triggers repeated operations, or a customer who exercises the latch daily. With a working strain of 2.67%, a peak stress of 148 MPa and a protected drive, the design sits comfortably inside the range the maker describes for very long lives.

### What the guidance does not say

The maker's guidance is a range, not a guarantee, and it leaves several things to the designer. It does not say how life varies between the two ends of the 2% to 6% range for a particular stress; it does not cover the effect of terminations, bends or blocked stops, which belong to the mechanism, not the wire; and it describes typical behaviour of a well-made wire, not the spread between wires. A design that relies on the top of the range, or on the guidance alone without a test of the assembled mechanism, is relying on conditions it has not checked.

The useful reading of the guidance is as a boundary: designs comfortably inside it can expect long lives and need a test to confirm them; designs at its edge should expect short lives, as Chapter 4's compact concept found; and designs outside it are experiments. VL-25 sits well inside on strain and inside on stress, and the endurance test is there to find what the guidance cannot, the effects of its own latch, crimps and drive.

## Proving the life

A requirement of 20,000 operations is proved by test, not by calculation. The team's endurance test runs assembled latches, with their bias springs and a representative latch load, through repeated operations, recording the stroke, the release and the reset at intervals.

```figure
type: steps
title: VL-25 endurance test
caption: This is an illustration of the fictional test plan. Five latches from the first production batch, each run to twice the required life. Stroke is measured with a dial gauge on the pin.
- Baseline | measure stroke, release current and reset time on each latch at 20 °C
- Run | cycle once a minute at 20 °C with forced air between pulses to speed cooling
- Check | at 100, 1,000, 5,000, 10,000, 20,000 and 40,000 operations, stop and measure stroke and reset
- Hot check | at 20,000 and 40,000, repeat release and reset at 60 °C in the climate chamber
- Inspect | at the end, remove the wires and examine their ends and surfaces under magnification
- Accept | all five above 3.7 mm stroke at 40,000 with no cracks at the terminations
```

Forced air between pulses shortens the test without changing the wire's heated temperature, which is the condition that matters; running faster by heating harder would not be a fair test, because it would change the peak temperature. The hot checks at intervals confirm that the latch still works at the condition where its margins are smallest, which an endurance test at room temperature alone would not show.

Five latches is a small sample, and the test cannot prove that every latch will last; it can show that the design has no early failure mode and that the typical latch lasts at least twice its requirement. The team chose five because a single early failure among them would be strong evidence of a design problem, while five passes give reasonable confidence alongside the maker's guidance. Production continues the check on a smaller scale: one latch from each production batch is run to 5,000 operations, a quarter of the requirement, enough to catch a batch problem such as Chapter 5's misplaced stop.

This is an illustration. All five latches passed: strokes settled from about 4.0 mm to between 3.86 and 3.91 mm in the first few hundred operations and stayed within that band to 40,000, and the wires showed no cracks. The 0.3 mm margin on settled stroke over the 3.6 mm needed to clear the latch held throughout.

### Settling in the first operations

Most of a trained wire's remaining change happens early. The team measured one latch's stroke closely over its first 500 operations to see how quickly it settled, because the answer decides whether new latches should be run in before they leave the factory.

```figure
type: bars
title: Stroke of one VL-25 latch over its first 500 operations
unit: mm
max: 4.2
caption: This is an illustration from the fictional endurance test, one latch at 20 °C. Most of the settling happens in the first hundred operations; the stroke then holds near 3.9 mm, as Chapter 4's longer test showed.
- First operation | 4.00
- 10 operations | 3.97
- 50 operations | 3.94
- 100 operations | 3.93
- *500 operations | 3.90
```

Because the settled stroke still clears the latch with margin, the team decided not to run latches in at the factory. A design with a thinner margin would run each actuator through a few hundred cycles before final adjustment, so that its customer receives the settled stroke rather than the new one.

### Drift in the temperatures

Cycling also shifts the transformation temperatures by a few degrees in many wires, usually lowering Ms and Mf slightly as residual stresses build up in the microstructure. For VL-25, a lower Mf would shrink the reset margin in a hot cabinet, the most temperature-sensitive point in the design. That is why the endurance test repeats its release and reset checks at 60 °C at 20,000 and 40,000 operations: the question is not only whether the wire still moves, but whether it still resets in the hottest cabinet after a lifetime of use. In the team's test, the reset time at 60 °C grew from about 12 s to about 13 s by 40,000 operations, inside the 60 s requirement adopted in Chapter 7.

### Environment and corrosion

Nickel-titanium forms a thin, protective titanium oxide on its surface and resists corrosion well in most environments. The weaker points are its terminations, where a crimp of a different metal in a damp cabinet can form a galvanic couple, and any flux or salt residue left from manufacture. VL-25's cabinet has condensation on cold mornings, so the crimps are of a material the wire supplier recommends for use with nickel-titanium, the wire and crimps are cleaned after assembly, and the actuator sits above the cabinet's drip line.

### Replacement

Even a long-lived actuator is a wearing part, and a product should make its replacement easy. VL-25's wire, crimps and strain reliefs come as a single replaceable assembly that clips into the latch body, with its stroke set by the latch's geometry rather than by adjustment on site. The maintenance manual gives a replacement interval, set well inside the proven life, and the warning on growing release time described below lets a wire be replaced on condition before then if it begins to wear early.

## The error: soldered terminations

This is an illustration. An early set of VL-25 prototypes, built alongside the compact concept of Chapter 4, had their wires soldered to brass terminals, because the workshop had no crimping tool for wire that fine and soldering was quick. The wires were pre-tinned with an aggressive flux designed for nickel alloys, then soldered with a hot iron. The prototypes worked well in the first bench tests.

In their endurance test, two of five wires broke between about 4,000 and 7,000 operations, both within about 2 mm of a soldered terminal, and all five had lost more stroke than expected. Under magnification, the broken ends showed fatigue cracks that had started at the surface just beyond the solder fillet, in a zone that was discoloured by heat.

The explanation was twofold. The soldering iron had heated the wire near its ends far above any temperature it sees in service, changing its microstructure there: those few millimetres had partly lost their memory and their fatigue strength. And the solder fillet ended abruptly, so the wire flexed at one point at the fillet's edge with every operation, concentrating the bending there. The flux residue, not fully cleaned, added corrosion at the same point.

The terminations were changed to crimps of the type and size the wire supplier recommends, made with a calibrated crimping tool, with a short strain-relief sleeve so that the wire does not flex at the crimp's edge. Wires with crimped ends passed the 40,000-operation test above. The workshop's procedure now says, in its first line on shape memory wire, that the working wire must never be soldered, brazed or welded, and that only the supplier's recommended terminations may be used. The lesson is that a shape memory wire's properties come from its processing, and any heat or damage applied to it after delivery can undo that processing locally, where the eye cannot see it.

## Monitoring in service

A wire actuator in the field can be watched for the early signs of functional fatigue, which gives warning before it stops working:

- **Stroke.** If the mechanism has a position switch, as VL-25's latch microswitch is, a slow increase in the time between the pulse and the switch's change suggests a shrinking stroke or a slowing reset.
- **Resistance.** The wire's cold resistance changes slightly as it accumulates residual strain or damage, and a controller that measures it before each pulse can log the trend.
- **Release current or time.** A wire that needs a longer pulse to release than it did when new is either working against more friction or losing its transformation strength.

VL-25's controller logs the time from pulse to switch change at each weekly test and reports a warning if it grows by more than 30% from its commissioning value at a similar cabinet temperature. That gives the maintenance team months of notice before a latch would fail.

## Exercise: a daily duty

A customer wants to exercise VL-25 daily instead of weekly and asks whether the 20,000-operation design life still covers 15 years.

1. How many operations would 15 years of daily exercise add up to?
2. Is the design still adequate, and what would you check?

**Worked answer.**

1. 365 × 15 = **5,475** operations from daily exercise, plus the same few hundred remote openings and tests, so roughly 6,000 in all.
2. Yes on the numbers: 6,000 is well inside the 20,000-operation requirement and less than a sixth of the 40,000 operations the endurance test proved. The things to check are not the count but the conditions: daily tests at 3 am keep the cabinet cool, so the reset margin is not stressed; the controller's hardware time limit protects against a firmware fault repeating the pulse; and the warning on growing release time will flag any wire that begins to wear faster than the test suggested. The customer's request is within the design, and the main change is to the logging, which should track the trend over more frequent data points. Daily exercise also has a benefit: a wire that is worked regularly reveals a developing problem sooner, through the release-time trend, than one that operates only a few times a year.
