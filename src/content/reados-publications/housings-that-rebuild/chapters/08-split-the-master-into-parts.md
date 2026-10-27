---
book: housings-that-rebuild
chapterSlug: split-the-master-into-parts
order: 8
title: "Split the master into parts"
description: "Divide one master housing into a cover and a base that update together, add lips, bosses and draft to each part, and check the pair before release."
draft: false
---

A housing is designed as one shape and made as several parts. The industrial designer thinks about the whole form; the toolmaker cuts a separate mould for each piece. The modelling method has to serve both. If the cover and base are modelled separately from the start, keeping their outer surfaces continuous across the parting line becomes a constant matching exercise. If they are modelled as one part and split, the outer form stays continuous by construction, and each part can still receive its own features.

This chapter splits the moisture-meter housing's master body into a cover and a base, adds the features that belong to each, and checks the pair as an assembly. It finishes with the checks that should happen before a housing model is released to anyone outside the design team.

## Understand the master model approach

The master model approach keeps all shared geometry in one part file, the master. It contains the skeleton, the main form surfaces, the solid body, the edge treatment and the shell: everything from Chapters 1 to 6. The master is then divided into bodies, and each body becomes the starting point of its own part file.

Most parametric systems provide one or more ways to do this. A **split** feature divides a body into several bodies using planes, surfaces or sketches. The resulting bodies can then be saved to new part files, inserted into new parts as a derived or base body, or kept as separate bodies within the master and referenced from elsewhere. Command names vary; the principle is the same.

```figure
type: steps
title: From one master to two parts
caption: This is an illustration. Each derived part keeps a live link to its body in the master, so a change to the master's form flows into both parts.
- Master | skeleton, form, solid, fillets, shell
- Split | parting plane divides the shelled body into upper and lower bodies
- Derive | each body inserted into its own part file with a live link
- *Detail each part | lip on the base, groove in the cover, bosses, floor, reveal
- Assemble | parts mated on the master's planes; interference and clearance checked
```

The split surface can be as simple as a plane, as it is here at the 14 mm parting height. On housings with a stepped or curved parting line, the split tool is a surface built in the master and extended well past the body on every side, following the overbuild rule from Chapter 5.

## Decide what lives in the master

The master should contain only what is genuinely shared. A feature that belongs to one part only should be added to that part after the split. Chapter 7 showed what happens otherwise: the reveal, cut into the master before the split, ended up on the wrong part when the parting height changed.

```figure
type: tree
title: Where each housing feature lives
caption: This is an illustration. The master holds the shared form; each part holds the features only it needs.
- Master part
  - Shared | skeleton, crown, side walls, nose, knit solid, G2 corners, top fillet, shell, parting plane
- Cover part, derived from the upper body
  - *Cover only | window cut and fillets, lens pocket, groove, grip grooves, cover bosses
- Base part, derived from the lower body
  - Base only | floor and battery bay, lip, reveal, base bosses, ribs
```

Keeping the master lean has a second benefit. The master is the single point of failure for every part derived from it. If a feature in the master fails, every derived part fails with it. In some systems and versions, a derived part whose source has failed or been heavily restructured is also awkward to reconnect to a different body. The fewer features in the master, the fewer things can break everything at once.

## Add the lip and groove

A lip and groove joint locates the two parts, stiffens the parting line and hides the internal gap. The base carries a lip that rises above the parting plane; the cover carries a matching groove.

This is an illustration. Using the named parameters from Chapter 1:

```figure
type: compare
title: Lip and groove dimensions at a 2.0 mm wall
cols: Width | Height or depth | Clearance
caption: This is an illustration. The lip width is driven by the wall parameter; the groove adds a clearance on each side and at the bottom. Values are teaching choices to be confirmed with the moulder.
- Base lip | 1.0 mm (wall ÷ 2) | 1.5 mm above the parting plane | none
- Cover groove | 1.2 mm | 1.7 mm deep | 0.1 mm per side, 0.2 mm at the bottom
- *Check | groove − lip = 0.2 mm | depth − height = 0.2 mm | must stay positive at every flex value
```

The lip is built on the inner half of the base wall, so its inner face continues the inner wall surface and its outer face sits at the wall's mid-thickness. The groove is cut in the matching position in the cover. Both follow the drafted walls, because their sketches are offset from the parting-plane edge loop rather than drawn as separate rectangles. That matters: the walls lean in by about 0.24 mm over the base height and about 0.35 mm over the cover height, as Chapter 4 calculated, so a lip drawn square would meet the groove at a slightly different position along the length and width.

Write the groove dimensions as equations too: groove width equals lip width plus 0.2 mm, and groove depth equals lip height plus 0.2 mm. When the wall changes to 2.4 mm, the lip becomes 1.2 mm wide and the groove 1.4 mm, and the clearances hold.

## Add bosses and the floor to the base

The base receives its floor, the battery bay and four screw bosses after the split. Each is positioned from skeleton planes, as the Chapter 7 exercise recommended.

This is an illustration. The screws are thread-forming screws designed for plastics. The screw maker's data sheet for the chosen screw in PC/ABS gives a pilot hole of 2.2 mm and a recommended boss outside diameter of 5.5 mm, values the case adopts as given. The boss wall is therefore **(5.5 − 2.2) ÷ 2 = 1.65 mm**, slightly thinner than the 2.0 mm nominal wall. Many plastic design guides recommend that bosses be no thicker than the surrounding wall, to limit sink marks on the outer face; confirm the specific guidance with the resin supplier and the screw maker.

The bosses join the floor through a small fillet and are tied to the nearest wall by a thin rib, which stiffens them without creating a thick section. Each boss has 0.5° of draft on its outer face and its hole, and the hole has a short lead-in chamfer to start the screw.

The floor is thicker than the walls, 2.5 mm in this case, because it carries the battery bay and takes the reaction of the screws. Its junction with the walls is a gradual taper rather than a step, for the reason discussed in Chapter 6.

## Size the screw from both parts

The screw joins two parts, so its length depends on features in both. This is a small stack-up, and it is easy to get wrong when the cover and base are detailed by different people.

This is an illustration. Each screw passes down through a boss in the cover and threads into a boss in the base. The cover boss has a 2.9 mm clearance hole and a counterbore for the screw head; the material between the bottom of the counterbore and the parting plane, the clamp length, is 4.0 mm. The screw data sheet recommends a thread engagement of 6.0 mm in this resin, a value the case adopts as given. The screw length is therefore **4.0 + 6.0 = 10.0 mm**, a standard length.

The base boss hole must be deeper than the engagement, so the screw does not bottom out and crack the boss. Allowing 1.0 mm beyond the screw tip gives a pilot hole **6.0 + 1.0 = 7.0 mm** deep, measured from the top of the base boss at the parting plane.

```figure
type: formula
title: Screw length and pilot hole depth
formula: L(screw) = clamp length + engagement
caption: This is an illustration. The pilot hole is deeper than the engagement so the screw tip has room and never bottoms in the boss.
- L(screw) | screw length under the head, mm
- clamp length | cover material between the counterbore floor and the parting plane, mm
- engagement | thread engagement in the base boss, from the screw data sheet, mm
step: L = 4.0 + 6.0 = 10.0 mm
step: Pilot hole depth = 6.0 + 1.0 = 7.0 mm
```

Write the clamp length, engagement and allowance as parameters shared between the two parts, ideally held in the master. If the cover counterbore is made deeper during a later change, the clamp length falls, and the engagement rises unless the screw is shortened. With the parameters linked, the check is automatic; without them, the base can end up with a screw that bottoms in its boss while nobody touched the base at all.

## Check draft on every part

Every face that the mould must release from needs draft in the direction of mould opening. The side walls have it from the master. Features added after the split, such as bosses, ribs and the lip, need their own.

A draft analysis colours each face by its draft angle relative to a pull direction. Faces with enough positive draft show one colour; faces with too little, or with negative draft that would lock the part into the mould, show others.

This is an illustration. The first draft analysis of the base, with a 1.0° minimum and the pull direction normal to the parting plane, flagged three groups of faces: the outer walls of the four bosses, which had been extruded straight at 0°; the faces of two ribs, also at 0°; and the inner face of the lip, which was correct at 1.0° but showed as borderline because of rounding in the display. The bosses and ribs were given 0.5° each after a discussion with the moulder, who accepted less draft on short internal features. The analysis was rerun and recorded.

## Assemble and check the pair

Bring both parts into an assembly and mate them using the master's planes: the parting plane, the long centre plane and the nose reference plane. Mating on planes rather than faces means the assembly stays correct when the parts' faces change.

```figure
type: checklist
title: Assembly checks on the cover and base
caption: This is an illustration. Interference must be zero; clearances must match the equations; masses should be close to the hand estimates.
- x Interference | none between cover and base
- x Lip to groove clearance | 0.1 mm per side, 0.2 mm at the bottom
- x Outer surfaces | continuous across the parting line apart from the reveal
- x Screw axes | cover holes concentric with base bosses
- *x Masses | cover 39.8 g, base 46.1 g in CAD; hand estimates about 41 g and 44 g
- ? Moulder review | draft, boss walls and the 2.7 mm band at the nose
```

The mass check deserves its explanation. A hand estimate for the cover takes its top area, about 10,970 mm² allowing for the crown, plus its side area, the 429 mm perimeter times the 20 mm height, multiplies by the 2.0 mm wall and subtracts the window, giving about 36.1 cm³ or **41 g** at a density of 1.14 g/cm³ taken from the resin data sheet. The base, with its 2.5 mm floor and 14 mm walls, comes to about 38.9 cm³ or **44 g**. The CAD values are within about 4% of each, which is reasonable given that the estimates ignore bosses, ribs, the lip, the groove and the fillets. A large disagreement would point to a missing or duplicated body.

## Test the link from master to parts

The master model approach promises that a change to the master flows into both parts. Test that promise before relying on it.

This is an illustration. Running the six flex-test changes from Chapter 7 on the master, then opening the assembly, showed that both parts updated for every change. The parting height change moved the split and both parts' features with it. The wall change updated the lip to 1.2 mm and the groove to 1.4 mm. One problem appeared: after the length change, one cover boss stayed at its old position, because its sketch had been dimensioned from an edge of the derived body rather than from a plane. Re-referencing it fixed the problem, and the test was repeated.

## Prepare the release

Before the housing leaves the design team, for a quotation, a prototype or tooling, a short release routine protects everyone who will use it.

1. **Run the full flex test** and the brief checks. Record the results.
2. **Run the geometry check** on every part: no invalid faces, no open edges, no short edges below the agreed limit.
3. **Run draft and thickness analyses** on each part and save their results.
4. **Export neutral files** in the format the recipient needs, typically STEP for solid geometry. Reopen each exported file and compare its volume with the native model; the two should agree closely.
5. **Freeze or record the references.** Decide whether derived parts keep their live link to the master for the next stage or are locked at this revision, and write that decision down.
6. **Attach the notes**: the continuity table, the surface quality table, the open questions for the moulder and the flex-test record.

Give the master and both parts the same revision letter at each release, even if one part did not change. The three files form one design, and a cover at revision C paired with a base at revision B invites someone to assume they were checked together when they were not. If the toolmaker later asks for a change to one part, make it in the master where it affects the shared form, rerun the checks on both parts, and release all three files again under the next revision. The extra minutes are small compared with a mould cut to the wrong version of its partner.

The edited READOS chapter on [designing plastic parts for injection moulding](/reados/collections/manufacturing-operations-and-design-for-manufacture/designing-plastic-parts-for-injection-moulding/) covers the moulding constraints that the toolmaker will test this release against, and [Drawings That Make Parts](/reados/publications/drawings-that-make-parts/the-drawing-as-a-contract/) covers the drawing that usually accompanies it.

## Exercise: add a third part

The product manager wants a soft-touch side grip as a separate overmoulded part covering 60 mm of each side wall, 1.2 mm thick, sitting flush with the surrounding cover surface. Where should the grip's geometry be created, and how should the cover be changed to receive it?

**Worked answer.** The grip follows the outer form, so its shape belongs in the **master**: create a split surface or sketch region on the side wall that defines the grip's outline, and use it to split a third body from the master's outer layer, 1.2 mm thick. Deriving that body into its own part file gives the grip a live link to the outer form, so it follows changes to the crown, draft or length.

The cover then needs a matching recess 1.2 mm deep under the grip area, so the grip sits flush. Create the recess in the master as part of the same split, so the cover and the grip are divided by one surface and cannot drift apart. Then check: the cover's wall under the grip falls from 2.0 mm to **2.0 − 1.2 = 0.8 mm**, which may be too thin to mould or to carry loads. Raise it with the moulder before releasing, and consider a thicker local wall on the cover under the grip, with the thickness transition kept gradual.
