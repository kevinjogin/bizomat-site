---
book: sheet-metal-joints-by-the-numbers
chapterSlug: what-each-joint-must-do
order: 1
title: "What each joint must do"
description: "List every joint in a sheet metal product with its load, environment, access and service needs, choose a method from them, and catch spot welds that burnt the coating off 97 cm² of seam."
draft: false
---

A sheet metal product is a collection of joints. EN-700, a plain-looking outdoor enclosure, has more than a dozen kinds: corner seams that hold its box square and keep rain out, brackets that carry a 25 kg plate through a truck ride, a hinge that joins aluminium to steel, a stud that earths the door, threads for the equipment, screws for a cable plate. Each joint has a different job, and the method that suits one is often wrong for the next. Choosing by habit, rivets everywhere or welds everywhere, is how products end up with joints that are too weak in one place, too expensive in another and corroding in a third.

This chapter sets out how to describe what each joint must do, in numbers where possible, and how to choose a method from that description. The running case lists EN-700's joints and finds that the first prototype's spot-welded corner seams burnt off the zinc coating at nearly two hundred points, in a product meant to stand outdoors for years.

## Five questions for every joint

Before choosing a method, each joint needs answers to five questions.

- **What load does it carry?** Its size, its direction relative to the joint, whether it is steady, repeated or a shock, and the factor the design applies for uncertainty.
- **What environment does it face?** Indoor or outdoor, wet or dry, coastal air, cleaning chemicals, temperature.
- **What must it seal against?** Rain, dust, insects, or nothing.
- **Can both sides be reached?** Some methods need access to both faces; blind methods need only one.
- **Must it come apart?** For service, replacement or recycling, or never.

The answers narrow the choice quickly. A joint that must come apart cannot be riveted. A joint reached from one side cannot be solid-riveted or clinched. A coated outdoor joint should not be welded unless the coating is restored. A joint carrying a shock load needs a method whose strength is known, tested and reliable.

## The running case: EN-700's joints

This is an illustration. EN-700 is 700 mm high, 500 mm wide and 250 mm deep, with a body of 1.2 mm galvanised steel and a door of 2.0 mm aluminium. Its main joints are:

```figure
type: compare
title: EN-700's joints and what each must do
cols: Load | Environment and sealing | Access and service
caption: This is an illustration. Each row is a kind of joint; several appear many times in the enclosure.
- Body corner seams | Holds the box square; light | Outdoor; must keep rain out | Both sides during assembly; permanent
- *Bracket to back wall | 25 kg plate, road transport shocks | Inside, dry | One side once the box is closed; permanent
- Hinge to door | Door weight and wind on the open door | Outdoor; aluminium to steel | Both sides; permanent
- Earth stud on door | Torque when the earth lug is fitted | Inside | One side; lug removable
- Equipment plate fixings | Shear from the plate | Inside | Must come apart for service
- Cable plate screws | Light | Outdoor seal against the gasket | Must come apart
```

## The bracket's load

The brackets carry the joint that most needs a number. The 25 kg equipment plate weighs 25 × 9.81 = **245 N**. EN-700 travels to site by road, and the design applies a factor of 3 for transport shocks in this illustration, a figure the product's own requirements or a test should set. The design load is therefore about **736 N**, shared between two brackets, about **368 N** each.

How the load reaches each bracket's fasteners, and what each fastener must carry in shear and tension, is the subject of Chapters 2 and 4. The point here is that the bracket joint has a design load, and every method considered for it must be checked against that load. The corner seams, by contrast, carry little load in normal service; their job is to hold the box's shape and keep water out, and their check is a seal test rather than a strength calculation.

## Methods and what they offer

The mechanical methods this book covers each have a distinct profile.

- **Solid rivets** are strong, reliable and permanent, but need access to both sides and a skilled operator or a riveting machine.
- **Blind rivets** need access from one side only, are fast and need little skill; their strength is lower and depends on the rivet's design.
- **Clinching** forms an interlock from the two sheets themselves, with no added part and no heat; it needs both sides accessible and suitable thicknesses.
- **Self-piercing rivets** pierce the top sheet and flare into the bottom one without a pre-drilled hole; they need both sides and heavy setting equipment.
- **Self-clinching fasteners** press permanently into a punched hole to give a threaded nut or stud in thin sheet.
- **Screws** come apart; in thin sheet they need a nut, an insert or a formed hole to hold well.
- **Folded seams** join sheets by folding them together, with no fastener at all; they seal well and carry modest loads.

```figure
type: decision
title: First choice of method for a joint in thin sheet
question: What does the joint most need?
- Must come apart for service | Screw into a self-clinching nut or a captive insert | Threads in the sheet alone are weak; Chapter 6
- Load-bearing, one-side access | Blind rivet sized and spaced for the load | Check all four failure modes; Chapter 2
- *Load-bearing, both sides, coated sheet | Clinch or solid rivet | No heat, coating kept; Chapters 3 and 5
- Long, sealed, lightly loaded seam | Folded lock seam with sealant | Chapter 7
- Mixed metals outdoors | Any of the above, with isolation and sealing | Chapter 8
```

## The error: spot welds on a coated seam

This is an illustration. The first EN-700 prototype joined its corner seams with resistance spot welds at 30 mm pitch, because the fabricator's spot welder was idle and the welds were quick. The body has about 5.8 m of seams, four vertical edges and the top and bottom perimeters, so the prototype carried about **193** spot welds.

Each spot weld burns off the zinc on both faces around the weld, in this illustration a ring about 8 mm across, roughly 50 mm² per weld face. Over 193 welds that is about **97 cm²** of bare steel on each face, scattered along the seams where water collects. After a short salt-spray test, every weld showed red rust staining.

The fix was to change the seams to clinched joints at 50 mm pitch, about 116 clinches, which form an interlock from the sheet itself without heat and leave the zinc intact, with a bead of sealant in the seam to keep water out. The general lesson is that a method should be chosen from what the joint must do, here survive outdoors with its coating, and not from which machine is free. Spot welding remains a good method for coated steel when the product is painted afterwards or the welds are protected, which the Library’s resistance welding book covers; it was the wrong choice for a seam left bare.

## Joint counts and cost

A product's joints are also a large part of its labour. EN-700 has, in this illustration, about 116 clinches, 4 bracket rivets, 12 hinge rivets, 10 self-clinching nuts, 4 for the equipment plate and 6 for the cable plate, 1 earth stud and 6 cable plate screws: nearly 150 joints in one enclosure. At a few seconds each for a clinch or a blind rivet, and more for drilling, deburring and inspecting, the joints are a measurable share of the enclosure's cost, and Chapter 10 prices them. A design that reduces the number of joints, by folding a corner instead of seaming it or by using one stronger fastener instead of two weak ones, often saves more than any choice between methods.

## Loads that are easy to miss

Three kinds of load are often left out when a joint is described.

- **Handling and transport.** A product lifted by its door, dropped onto a pallet or driven over a rough road sees loads far above its service loads, and its joints must survive them. EN-700's transport factor is one way of allowing for this.
- **Assembly loads.** Tightening a screw into a self-clinching nut applies torque to the nut, and the nut must not spin out of the sheet. Chapter 6 calculates it.
- **Thermal movement.** Aluminium expands about twice as much as steel for the same temperature change. An aluminium door 500 mm wide riveted rigidly to a steel frame in the sun pushes and pulls on its fasteners every day, which Chapter 8 discusses.

## Thermal movement in numbers

This is an illustration, using typical coefficients of expansion of about 23 × 10⁻⁶ per kelvin for aluminium and 12 × 10⁻⁶ for steel. EN-700's 500 mm door, warming 40 K in the sun, grows by about 0.46 mm; the steel frame beside it, if it warms by the same amount, grows by about 0.24 mm. The difference, about **0.22 mm** over the door's width, must be taken up somewhere: by the hinge's clearances, by a little give in the fasteners, or by the fasteners and the sheet around them, every sunny day. Over a few thousand cycles, a rigid mixed-metal joint can loosen or crack where a joint with some freedom would not, which is why Chapter 8 checks the movement at EN-700's hinge before its rivets are finalised.

## Repeated loads

A joint that carries a steady load comfortably can still fail under a load that comes and goes. Road transport is one source; fans and compressors mounted inside an enclosure are another; wind on an open door is a third. Repeated loads loosen screws, wear rivet holes oval and start fatigue cracks at the edge of a hole, where the stress is concentrated. Blind rivets with a large, filling shank and clinched joints, which have no hole at all, generally resist this better than loose-fitting rivets or self-tapping screws in thin sheet, but the only reliable measure for a particular joint is a test of the kind Chapter 10 describes. EN-700's brackets are tested on a vibration table before the design is released, because the transport factor is an estimate and the test is the check on it.

## Fewer kinds of fastener

Every different fastener in a product is a part to stock, a hole size to get right, a tool to set up and a chance to fit the wrong one. EN-700 uses, in this illustration, one blind rivet diameter in two grip lengths, one size of self-clinching nut for both the equipment plate and the cable plate, one earth stud and one screw size. A designer tempted to use a slightly smaller rivet in one place to save a few cents, or a different screw because it was in the drawer, should weigh the saving against the cost of one more part to control.

```figure
type: stats
title: EN-700's joints, by count
caption: This is an illustration. Nearly 150 joints in one enclosure, most of them clinches along the seams.
- 116 | Clinches | Corner and edge seams at 50 mm pitch
- * 4 | Bracket rivets | The load-bearing joint, two per bracket
- 12 | Hinge rivets | Aluminium door to steel frame
- 17 | Threaded parts | 10 self-clinching nuts, 1 stud, 6 screws
```

## Writing the joint down

Each joint's requirements should be written on the drawing or in a joint schedule: the method, the fastener's part number, the hole size, the pitch and edge distance, the design load and how it was checked, the sealant, and any test it must pass. EN-700's joint schedule has one line per kind of joint. It takes an hour to write and saves the arguments that start when a rivet is changed to a cheaper one, a pitch is opened up to save time, or a sealant is left out because nobody knew why it was there.

## The prototype as a test of the joints

A first prototype is the cheapest place to find out whether the joints do what the schedule says. EN-700's prototype was built to the joint schedule, then subjected to the checks each joint's requirements implied: a water spray test for the seams, a vibration test for the brackets, an opening and closing cycle test for the hinge, torque tests on the self-clinching nuts and the earth stud, and repeated removal and refitting of the cable plate. Each check was quick, and each was aimed at one joint's job.

The spot-weld problem was found this way, at the cost of one prototype body, rather than in the field at the cost of a recall. A prototype built only to check that the parts fit together, and not to test the joints, finds fit problems and misses the joint problems, which tend to appear months later when the product has been delivered. The joint schedule doubles as the prototype's test plan: each line names a joint, its requirement and the check that proves it, with a column for the result.

## Exercise: the cable plate

EN-700's cable entry plate, a 2.0 mm aluminium plate on a gasket in the bottom of the enclosure, must be removable on site so that new cables can be added, must keep rain and insects out, and carries only the weight of the cable glands and some pull on the cables. Using the five questions, which method suits it, and what should the joint schedule say?

**Worked answer.** It must come apart, so it cannot be riveted, clinched or seamed; it is a screwed joint. Its loads are light, so strength is not the deciding factor, but the screws will be removed and refitted many times over the enclosure's life, and screws driven straight into 1.2 mm steel would strip after a few cycles, as Chapter 6 shows. The joint therefore uses machine screws into self-clinching nuts in the enclosure's bottom panel, which keep their thread however often the plate is removed.

Sealing comes from the gasket, so the screw spacing must be close enough to compress the gasket evenly, which the gasket maker's data sets. The joint schedule should give the screw and nut part numbers, the hole sizes for the nuts, the screw spacing, the gasket and its compression, and a note that the plate is aluminium on galvanised steel with the gasket separating them, which also serves the galvanic isolation of Chapter 8.
