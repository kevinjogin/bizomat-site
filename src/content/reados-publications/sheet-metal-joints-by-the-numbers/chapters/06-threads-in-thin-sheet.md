---
book: sheet-metal-joints-by-the-numbers
chapterSlug: threads-in-thin-sheet
order: 6
title: "Threads in thin sheet"
description: "See why a thread tapped in thin sheet is weak, compare extruded holes, self-clinching nuts and rivet nuts, set a torque below torque-out, and catch nuts that spun in their holes."
draft: false
---

A screw is the obvious joint for anything that must come apart, and thin sheet is a poor place to put its thread. An M6 screw has a 1 mm thread pitch, so 1.2 mm sheet engages barely more than one turn of thread, and that single turn must carry everything the screw is tightened to. Tapped threads in thin sheet strip at a fraction of the screw's strength, and they strip a little more each time the screw is removed and refitted. The answers are well established: make the sheet thicker where the thread is, by extruding a collar; or put a proper nut into the sheet, by pressing in a self-clinching nut or setting a blind rivet nut.

This chapter estimates the strength of a thread in thin sheet and of the alternatives, then covers self-clinching nuts and studs, rivet nuts, and how to set a tightening torque that clamps the joint without spinning the nut out of the sheet. The running case fixes EN-700's equipment plate with M6 screws into self-clinching nuts, and finds the first nuts spun in the back wall because the assembly torque was set for an ordinary nut.

## A tapped thread in thin sheet

A thread fails by stripping: the internal thread's teeth shear off along a cylinder at about the thread's diameter, over the length of engagement. A simple estimate of the stripping load treats the teeth as occupying about half that cylinder, so that the shear area is about **0.5 × π × d × engaged length**, and the stripping load is that area times the sheet's shear strength. Design references give more exact formulas that account for the thread's form and tolerances; this one is an illustration of the scale.

This is an illustration. An M6 thread tapped in EN-700's 1.2 mm galvanised back wall, with the sheet's shear strength taken as 192 MPa, has a shear area of about 0.5 × π × 6 × 1.2 = 11.3 mm² and a stripping load of about **2,171 N**. An M6 steel screw of a common property class, by contrast, can carry roughly 10 kN or more in tension, in this illustration about 11.7 kN. The thread in the sheet would strip at about a fifth of the screw's strength, and with only 1.2 threads engaged, any slight misalignment or wear removes a large share of what little there is.

```figure
type: bars
title: Estimated stripping load of an M6 thread, by what it is formed in
unit: N
max: 13000
caption: This is an illustration using a simplified shear area of 0.5 × π × d × engaged length. The screw's own tensile capacity, about 11.7 kN here, is the target a good threaded joint approaches.
- Tapped in 1.2 mm steel sheet | 2171
- Tapped in a 3.0 mm extruded collar | 5429
- *Self-clinching steel nut, 4.5 mm of thread | 12723
```

## Extruded holes

A hole can be **extruded**, or flow-drilled, so that the sheet around it is drawn into a collar several times the sheet's thickness, and the collar is then tapped or thread-formed. This is an illustration. If EN-700's 1.2 mm sheet is extruded into a collar giving 3.0 mm of thread, the stripping load rises to about **5,429 N**, two and a half times the plain tapped hole. Extruded holes need no added part, which suits high volumes, but they need tooling and their collar's height and wall thickness depend on the sheet and the process. They remain weaker than a proper nut and wear with repeated assembly.

## Self-clinching nuts

A **self-clinching nut** is a hardened steel or stainless nut with a knurled or splined collar and an undercut. Pressed into a punched hole of the right size, it displaces the sheet's metal into its undercut, locking itself permanently in place, flush or nearly flush with the sheet. It gives a full-strength thread, in steel, several threads long, in sheet that could never hold one, and it needs only one punched hole and a press.

Self-clinching fasteners are rated by their makers for each size, sheet thickness and sheet material, with three key figures:

- **push-out**: the axial force that pushes the nut out of the sheet, from the side it was installed;
- **torque-out**: the torque that spins the nut in its hole;
- **pull-through**: the force that pulls the nut through the sheet from the head side, relevant when a screw is tightened from the far side.

They also specify the **minimum sheet thickness**, the hole size, the minimum distance from the hole to an edge and the sheet hardness they suit, because the nut must be harder than the sheet to clinch into it. These are the maker's numbers, and they must be used as published.

## The running case: the equipment plate

This is an illustration. EN-700's equipment plate is fixed to its two brackets with four M6 screws into four steel self-clinching nuts pressed into the brackets' horizontal flanges. In this illustration, the nut maker's data for this nut in 2.0 mm steel gives a push-out of about **2,000 N** and a torque-out of about **9 N·m**.

The joint carries the plate's 736 N factored load in shear between plate and brackets. A screwed joint carries shear best by friction: the screws clamp the plate to the brackets, and the friction between them resists sliding, so that the screws themselves are not loaded in shear or bearing. The clamp force from a tightening torque T is often estimated as **F ≈ T ÷ (K × d)**, with K a "nut factor" of about 0.2 for plain, lightly oiled steel threads. K varies widely with surface finish and lubrication, which is why clamp forces from torque are always approximate.

```figure
type: formula
title: Clamp force from tightening torque, and the friction it gives
formula: F ≈ T ÷ (K × d);   friction resistance ≈ number of screws × μ × F
caption: This is an illustration with K = 0.2 and a friction coefficient μ = 0.2 between plate and bracket. Both factors vary widely; real joints are checked by test or by a calculation to a recognised method.
- T | Tightening torque, N·mm
- K | Nut factor, about 0.2 for plain steel threads
- d | Nominal screw diameter, mm
step: At 5 N·m: F ≈ 5,000 ÷ (0.2 × 6) = 4,167 N per screw
step: Friction from 4 screws: 4 × 0.2 × 4,167 = 3,333 N, against a factored load of 736 N
```

## The error: nuts that spun

This is an illustration. The assembly instruction for EN-700's equipment plate specified "M6, 10 N·m", the fabricator's standard torque for M6 screws into ordinary steel nuts. Into self-clinching nuts with a torque-out of about 9 N·m in the bracket flange, 10 N·m was more than the nut's hold in the sheet. On the first enclosures, several nuts spun in their holes before the screws reached torque, and the spun nuts could not then be tightened or removed.

The assembler noticed at once, because a spinning nut gives no resistance, and the batch was stopped. The fix was to reduce the specified torque to **5 N·m**, a margin of almost two below the torque-out, and to check that 5 N·m still clamped the plate adequately. At 5 N·m, the estimated clamp force per screw is about 4,167 N, and the friction from four screws about 3,333 N, more than four times the factored load. The spun nuts were drilled out and the brackets replaced, because a nut that has spun has damaged its hole and cannot be reliably re-pressed.

The general lesson is that a tightening torque belongs to a joint, not to a screw size. A torque table organised by screw size alone will be wrong for every joint whose nut, insert or sheet is weaker than the table assumed.

## Vibration and loosening

A screwed joint loosens under vibration when the clamped parts slip sideways relative to each other, which lets the thread rotate a little at each cycle. Enough clamp force to prevent slip is therefore the first defence, which is why the equipment plate's friction check matters as much as its torque-out check. Thin sheet complicates this, because it is flexible and its clamp force relaxes as coatings and surfaces settle. Prevailing-torque nuts, thread-locking compounds and wider bearing faces under the screw heads all help. EN-700's vibration test checked its equipment plate's screws for loosening after the test, and a torque-stripe across each screw head and nut gave a quick visual check that none had turned.

## Self-clinching studs

A **self-clinching stud** is the same idea with a threaded shank instead of a nut: pressed into a punched hole, it stands up from the sheet with its head flush on the far side. EN-700's earth stud is an M5 self-clinching stud in the aluminium door, rated by its maker for push-out and torque-out in 2.0 mm aluminium. Its nut is tightened, like the plate's screws, to a torque below the stud's torque-out. For an earth connection, the stud's contact with the door and the lug's contact with the stud both matter; an earthing joint's requirements are set by the electrical standards and the product's design, and its continuity is tested, not assumed.

## Blind rivet nuts

Where only one side can be reached, a **blind rivet nut** gives a thread in a drilled hole: like a blind rivet, it is set from one side by a tool that pulls on its thread, collapsing its body behind the sheet. It suits enclosures closed before a fixing is needed, and thin or brittle materials that will not take a self-clinching nut. Rivet nuts are weaker in torque-out than self-clinching nuts in the same sheet, because they grip only by their collapsed body and flange; types with knurled, hexagonal or splined bodies resist spinning better. They need their own maker's hole size and grip range, exactly as blind rivets do in Chapter 3.

## Thread-forming and self-tapping screws

Screws that cut or form their own thread in the sheet avoid tapping, and some types are designed for thin sheet, with fine pitches, extruded pilot holes or special thread forms. Their holding in thin sheet is limited by the same engaged length as a tapped hole, and repeated removal wears the formed thread. They suit light, rarely removed fixings, such as EN-700's internal cable clips, and not the cable plate of Chapter 1, which is removed often and therefore uses machine screws into self-clinching nuts.

## Choosing a thread for thin sheet

```figure
type: compare
title: Ways to put a thread in EN-700's thin sheet
cols: Access | Strength | Repeated assembly
caption: This is an illustration of the trade-offs. Ratings for any particular fastener come from its maker for the actual sheet.
- Tapped hole in the sheet | Either side | Low; about one thread engaged | Poor; wears quickly
- Extruded or flow-drilled hole | Either side | Moderate | Fair
- *Self-clinching nut | Both sides at pressing | High; full steel thread | Good
- Blind rivet nut | One side | Moderate; limited by torque-out | Good if it does not spin
- Thread-forming screw | Either side | Low to moderate | Poor
```

## Repeated assembly

A thread that is assembled once and never touched needs less than one that is opened every service visit. Each removal and refit of a screw in a tapped or formed thread in thin sheet wears the few teeth it has, and after a handful of cycles the screw will not tighten. A self-clinching nut's hardened steel thread survives hundreds of cycles, because it is a real nut. EN-700's cable plate, removed whenever cables are added, and its equipment plate, removed for service, both use self-clinching nuts for that reason; its internal cable clips, fitted once at assembly, use thread-forming screws.

## Mixed metals at threaded fasteners

Self-clinching fasteners for aluminium sheet are usually stainless steel or aluminium, and those for steel sheet are hardened steel, often zinc-plated. A stainless nut or stud in an aluminium door is a dissimilar-metal joint, galvanically like a stainless rivet in aluminium, and in a wet environment it can corrode the aluminium around it. EN-700's earth stud is inside the door, dry, which limits the risk; Chapter 8 sets out when such a joint needs isolation or sealing, and the earth connection's need for metal-to-metal contact makes it one of the harder cases.

## Edge distance and sheet thickness for inserts

Every self-clinching fastener and rivet nut has a minimum distance from its hole to the sheet's edge, and a minimum sheet thickness, both set by its maker. Too close to an edge and the displaced metal bulges the edge instead of filling the fastener's undercut, so the fastener holds less than its rating. Too thin a sheet and there is not enough metal to fill the undercut at all. These limits, like a rivet's edge distance, belong on the drawing beside the fastener's part number, and they should be checked when a sheet's thickness changes, as the clinching error of Chapter 5 showed.

## Exercise: torque for the earth stud

EN-700's M5 earth stud, in this illustration, has a maker's torque-out of 4.5 N·m in 2.0 mm aluminium. The earth lug needs to be clamped firmly. Using K = 0.2, what clamp force would 2.5 N·m give, what margin does that leave against torque-out, and what would a torque table entry of "M5, 6 N·m" do?

**Worked answer.** At 2.5 N·m, the clamp force is about 2,500 ÷ (0.2 × 5) = **2,500 N**, a firm clamp for an earth lug. The margin against torque-out is 4.5 ÷ 2.5 = **1.8**.

A table entry of 6 N·m, a reasonable figure for an M5 screw into a steel nut, exceeds the stud's 4.5 N·m torque-out by a third. The stud would spin in the door before the nut reached torque, losing both the clamp on the lug and, possibly, the electrical contact with the door. The assembly instruction for the earth stud should give its own torque, with the reason, and the earth connection's continuity should be tested after tightening.
