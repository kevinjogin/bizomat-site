---
book: shape-memory-alloys-by-the-numbers
chapterSlug: superelastic-parts-and-testing
order: 9
title: "Superelastic parts, and testing it all"
description: "Design a superelastic clip whose force changes with temperature, plan the tests that accept a shape memory product, and catch a clip that stiffened in the summer heat."
draft: false
---

Superelastic nickel-titanium is the same alloy as actuator wire, processed so that it is austenite at its working temperature. Loaded, it transforms to martensite along a long plateau and springs back when unloaded, giving a spring that can be deflected several times further than spring steel without taking a set. It makes clips, retainers, flexible guides and springs that must survive large deflections. Its weakness is the one this book has met in every chapter: its behaviour depends strongly on temperature. A superelastic spring's force, along its plateau, rises with temperature at the same few megapascals per degree that shift an actuator's transformation temperatures.

This chapter designs VL-25's superelastic seal clip, shows how its force changes over the cabinet's temperature range, and records a clip that pressed the flap shut so hard in summer that the flap would not open at its intended pressure. It then brings the book together in the tests that accept a shape memory product.

## The running case: the seal clip

This is an illustration. VL-25's vent flap is held against its gasket by a clip made from superelastic nickel-titanium wire of about 1.0 mm diameter, bent so that closing the flap deflects it well along its plateau. The clip was chosen for its ability to accept large, repeated deflections as the flap opens fully and closes again, without taking a set. The superelastic wire data sheet listed in the references gives typical values for such wire: a loading plateau stress of at least 450 MPa at 3% strain, a permanent set of no more than 0.2% after 6% strain, an Af of 5 to 18 °C, and an ultimate tensile strength of 1,100 to 1,150 MPa, all at room temperature.

At 20 °C, the clip presses the flap with about 12 N, measured on prototypes, which the flap's design converts into the gasket pressure it needs and into the pressure difference across the flap at which it lifts and vents.

## Designing on the plateau

A superelastic part's attraction is its plateau. Once deflected far enough to start transforming, its force barely changes over several per cent of further strain, so a clip working on its plateau holds nearly the same force whether its deflection is a little more or a little less than nominal. That makes it tolerant of manufacturing variation in a way that a steel spring, whose force rises steadily with deflection, is not.

Designing for the plateau means three numbers. The strain at the part's smallest working deflection must be beyond the end of the steep initial region, about 1% for typical wire, so that the part is already on its plateau. The strain at its largest deflection must stay well short of the end of the plateau, usually a few per cent below the 6% at which the data sheet quotes its permanent set, so that every deflection recovers. And the bend radii must be chosen so that these strains are reached: for wire bent around a former, the outer-fibre strain is the wire diameter over the bend diameter, so a 1.0 mm wire bent to 3% needs a bend diameter of about 33 mm at its tightest working point.

### Hysteresis: the force it holds is the lower one

Superelastic wire unloads on a lower plateau than it loads on. A clip pushed open by the flap follows the upper, loading plateau; a clip pressing the flap shut, after being deflected, sits on the lower, unloading plateau. The force that holds the flap closed is therefore the unloading force, which may be well below the loading force at the same deflection. VL-25's 12 N was measured by letting the flap close slowly onto a force gauge, so it is an unloading figure, the one that matters. Measuring a superelastic part's force by pushing it, rather than by letting it push back, overstates the force it will hold in service.

## Force against temperature

Along the plateau, the clip's force is roughly proportional to the plateau stress, and the plateau stress rises with temperature by the stress–temperature slope of Chapter 3, illustrated here as 6.5 MPa per °C. Starting from 450 MPa at 20 °C:

```figure
type: line
title: Illustrative loading plateau stress of the clip's wire against temperature
x: Temperature, °C
y: Plateau stress, MPa
ymin: 300
ymax: 750
caption: This is an illustration: 450 MPa at 20 °C from the data sheet's minimum, shifted at 6.5 MPa per °C. Below Af the wire is not fully superelastic, so the line's lower end is shown only to mark the trend; real wire should be characterised across its range.
- 0 | 320
- 20 | 450
- 40 | 580
- 60 | 710
```

```figure
type: compare
title: VL-25's seal clip across the cabinet's temperature range
cols: Plateau stress | Clip force | Margin to tensile strength
caption: This is an illustration. Force scaled from 12 N at 20 °C in proportion to plateau stress; margin as the data sheet's lower tensile strength of 1,100 MPa over the plateau stress. At 0 °C the wire may be near or below its Af and not fully superelastic.
- 0 °C | 320 MPa | 8.5 N | 3.4
- *20 °C | 450 MPa | 12.0 N | 2.4
- 40 °C | 580 MPa | 15.5 N | 1.9
- 60 °C | 710 MPa | 18.9 N | 1.5
```

Over the cabinet's range, the clip's force more than doubles, from about 8.5 N at 0 °C to about 18.9 N at 60 °C. No steel spring behaves like that; a steel spring's force changes by a fraction of a per cent over the same range. At the cold end there is a second problem: the data sheet's Af of 5 to 18 °C means that at 0 °C the wire may not be fully austenite, so after a large deflection it may not spring back completely until it warms. A superelastic part should be specified with an Af comfortably below its coldest service temperature.

## The error: a clip that stiffened in summer

This is an illustration. VL-25's flap is designed to lift and vent when the pressure inside the cabinet exceeds the outside by a set amount, as a convenience pressure relief in addition to the remote release. The clip's 12 N, measured at 20 °C, set that opening pressure. The first summer's site checks found that flaps on hot cabinets did not lift at the intended pressure; one, tested with a calibrated pressure source at 58 °C, needed about 55% more pressure than its rating.

The table above explains it: at about 58 °C, the clip's plateau stress is about 450 + 38 × 6.5 = 697 MPa, 55% above its value at 20 °C, and the clip's force, and with it the flap's opening pressure, rose in proportion. The clip had been designed and tested only at room temperature, by a team that knew its actuator wire was temperature-sensitive but had not applied the same thinking to the clip. The same physics that the team had carefully allowed for in the wire, a transformation stress rising by several megapascals per degree, was working in the clip, unnoticed, because the clip was thought of as a spring rather than as a shape memory part.

The clip was replaced by a stainless steel spring, whose force is almost independent of temperature, sized for the same 12 N and given a guide that limits its deflection when the flap opens fully, the job the superelastic clip had done by being forgiving. The lesson recorded in the design guide is that a superelastic part's force must be designed for its hottest and coldest service temperatures, not its test-room temperature, and that where a force must stay constant with temperature, superelasticity is the wrong tool. Superelastic parts excel where deflection must be large and recovery complete; they are poor where force must be steady.

### Where superelastic parts belong

The episode does not make superelastic parts a poor choice in general. They are excellent where deflections are large and must recover completely: flexible guides and retainers that must be bent out of the way during assembly, clips that must survive being flexed fully open many times, antennas and probes that must not kink, and parts whose hysteresis usefully absorbs energy, such as some vibration dampers. They are poor where a force or stiffness must be held steady across a temperature range, as VL-25's flap needed, or where the part will spend long periods below its Af. A designer choosing one should list the temperature range and ask how much the part's function can tolerate a force that changes by a percent or so per degree.

## Testing a shape memory product

The book's chapters each ended with a test that confirmed a number. Collected, they form the test programme for VL-25 and a template for other shape memory products.

**Material tests**, from the supplier and spot-checked by the enclosure maker:

- transformation temperatures by thermal analysis, as in ASTM F2004, on each lot of wire, checked against the specification limits of Chapter 2;
- As and Af by bend and free recovery, as in ASTM F2082, as the maker's own quick check on each reel;
- for superelastic wire, plateau stresses, permanent set and strength by tension testing, as in ASTM F2516.

**Design qualification**, on assembled latches:

- release under load at 0, 20, 40 and 60 °C, with the firmware's pulse table, from Chapter 6;
- reset time at the same temperatures, from Chapter 7;
- stroke settling and endurance to 40,000 operations, with hot checks, from Chapter 8;
- blocked-stop behaviour with the over-stroke link, from Chapter 5;
- the self-test routine run in the hot chamber, from Chapter 7's error.

**Production tests**, on every latch:

```figure
type: checklist
title: VL-25 end-of-line test
caption: This is an illustration of the fictional production test, about two minutes per latch, recorded against each latch's serial number with the wire lot and spring lot.
- x Wire resistance | 2.64 to 2.91 Ω, within 5% of 2.775 Ω
- x Stroke at 20 °C | pin travel at least 3.85 mm on a dial gauge
- x Stop position | go/no-go gauge confirms stop at 4.2 mm
- x Release | full release with the 20 °C pulse; microswitch confirms
- x Reset | microswitch confirms return within 10 s at 20 °C
- x Drive check | controller current and hardware time limit on dummy load, from Chapter 6
```

The production test is deliberately short and runs at room temperature. It does not prove the design; qualification did that. It catches the assembly and supply errors that would make a latch differ from the qualified design: a wrong wire, a bad crimp, a misplaced stop, a faulty driver. Each check traces to a failure the team met during development.

### Records and traceability

Every latch's test record carries the lot numbers of its wire and its spring, the wire certificate's transformation temperatures, and the results above. When a field problem appears, the record answers the first questions at once: which wire lot, which spring lot, what did this latch measure when new. A shape memory product without that traceability leaves its maker guessing, because the material's behaviour depends so much on its lot that two latches built the same way from different reels can behave differently.

### When to call in specialists

Everything in this book can be done by a capable designer with a wire maker's data and a well-equipped workshop. Some situations justify specialist help: a design that must use the top of the strain or stress range; an actuator that must position precisely or cycle rapidly; a superelastic part in a structural, safety or medical role; and any product whose transformation temperatures must be held tightly, which may need custom processing by the wire supplier. Suppliers of nickel-titanium often provide application engineering for exactly these cases, and it is usually cheaper than learning by endurance test.

## Bringing the book together

VL-25 is a small part, a wire, a spring and a pin, and it needed every chapter. Its wire grade came from the hottest temperature at the actuator, measured on site. Its heating target came from the stress at the start of the stroke, shifted by the Clausius–Clapeyron slope. Its length came from a working strain chosen for life, its diameter from a stress guideline, and its spring from the cool wire's deformation force and the wish to keep stress low at the end of the stroke. Its drive was a current-limited source with a hardware time limit; its reset time, its self-test timing and its requirements were set for the hottest cabinet; its terminations were crimped, never soldered; and its superelastic clip was replaced where a constant force was needed.

None of that needed advanced theory. It needed a clear picture of what the alloy does, two curves and a load line, the maker's published data, a slope relating stress to temperature, and a habit of testing every number under the load and at the temperature where it matters.

## Exercise: specifying a superelastic clip for a cold cabinet

A different product needs a superelastic retaining clip that must work fully from −10 °C to 40 °C.

1. What should the specification say about Af, and why?
2. If the clip's force is 10 N at 20 °C on a 450 MPa plateau, what range of force should the design allow for, with a slope of 6.5 MPa per °C?

**Worked answer.**

1. Af should be specified well below the coldest service temperature, for example no higher than about −20 °C, so that the wire is fully austenite and fully superelastic at −10 °C with margin for lot variation and for the shift under load. A wire with the data sheet's Af of 5 to 18 °C would not be fully superelastic at −10 °C.
2. At −10 °C, the plateau is 450 − 30 × 6.5 = 255 MPa, and the force about 10 × 255 / 450 = **5.7 N**. At 40 °C, the plateau is 450 + 20 × 6.5 = 580 MPa, and the force about **12.9 N**. The design must work with any force from about 5.7 to 12.9 N, a ratio of about 2.3, and the clip's strength must be checked at the hot end, where its stress is highest. If the product cannot tolerate that range, a steel spring is the better choice.
