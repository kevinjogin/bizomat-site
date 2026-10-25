---
book: welding-distortion-by-the-numbers
chapterSlug: restraint-and-residual-stress
order: 6
title: "Restraint and residual stress"
description: "See how holding a joint still turns its shrinkage into residual stress near yield, why restrained joints crack, how locked-in stress moves parts when machined, and how stress relief helps."
draft: false
---

Every weld's shrinkage must go somewhere. If the parts are free, it goes into distortion; if they are held, it goes into stress. Clamps, strongbacks, fixtures and the stiffness of the surrounding structure all restrain a joint, and the more firmly it is restrained, the less it distorts and the higher the stress it is left with. That stress, residual stress, is invisible, but it is real: it can crack a joint as it cools, move a part when it is machined or released, shorten its fatigue life and, in some materials and environments, help cracks grow by corrosion.

This chapter shows how restraint turns shrinkage into stress, calculates why a fully restrained weld is left near the yield stress, explains the cracking that restraint invites, follows the shop's machine base whose top moved after machining, and describes the ways residual stress is reduced.

## Shrinkage into stress

A weld that shrinks by a certain amount across a joint, if the joint were free, would pull the parts together by that amount. If the parts cannot move, the shrinkage must be taken up by stretching the weld and the metal around it. The strain needed is the shrinkage divided by the length over which it is spread, and the stress is that strain times the steel's stiffness, up to the point where the metal yields.

```figure
type: formula
title: Stress in a fully restrained butt weld
formula: σ = E × (S ÷ L), limited by the yield stress
caption: This is an illustration for a butt weld in 12 mm plate whose free transverse shrinkage would be about 1.8 mm (Chapter 2), held between stiff supports 500 mm apart.
- S, free transverse shrinkage | about 1.8 mm
- L, restrained length | 500 mm
- E | 205,000 MPa
step: strain = 1.8 ÷ 500 = 0.0036
step: elastic stress would be 205,000 × 0.0036 ≈ 738 MPa
step: far above a yield stress of about 275 to 350 MPa, so the joint yields and is left at about yield
```

The arithmetic shows why restrained welds carry residual stresses close to the yield stress: the shrinkage is so large compared with the strain at yield, about 0.0013 for a typical structural steel, that the metal near the weld yields in tension as it cools, and is left stressed to about its yield point. Only if the restraint is spread over a long, flexible length can the stress stay below yield.

## Restraint is everywhere

Restraint comes from many sources. Clamps and fixtures hold parts deliberately. Tack welds and strongbacks hold gaps. The structure itself restrains a joint when the joint is in the middle of a stiff assembly, such as an insert in a frame or a plate welded into an opening. Thick parts restrain thin welds. Even a single long weld restrains itself, because the cool metal ahead of it and beside it holds back the hot metal. Some restraint is always present; the question is how much, and whether it has been chosen or has simply happened. A joint whose restraint was planned, by the fixture design, the sequence and the preheat, behaves predictably; one restrained by accident, because the last part fitted into a closed frame had nowhere to go, often cracks or distorts in ways nobody expected.

## Restraint and cracking

High restraint makes cracking more likely, because the shrinkage stress acts on the weld while it is weak. Three kinds of cracking are particularly linked to restraint:

```figure
type: compare
title: Cracking linked to restraint
cols: When it happens | Contributing factors
caption: General descriptions. Weldability by the Numbers explains the metallurgy of each; the welding procedure, filler and preheat are chosen to prevent them.
- Solidification (hot) cracking | as the weld metal solidifies | impurities such as sulphur; deep, narrow weld beads; high restraint
- *Hydrogen (cold) cracking | hours or days after welding, at low temperature | hydrogen, hard heat-affected zone, high residual stress
- Lamellar tearing | during welding of thick plate | through-thickness pull on plates with weak through-thickness properties
```

In each case, the stress from restraint is one of the factors, and reducing it, together with the metallurgical causes, prevents the crack. Weldability by the Numbers explains the links in its chapter on [expansion, restraint and cracking](/reados/publications/weldability-by-the-numbers/expansion-restraint-and-cracking/).

## The early welders and castings

The Davis-Bournonville course of 1919 described the effect of restraint vividly for castings. Welding a blowhole in the middle of a casting without preheating, it said, was like driving a tapered drift into the hole with a sledge: the heated metal expanded against the cold metal round it with such force that the iron was strained beyond its limit and cracked. It described the welder who mends a casting in one place and breaks it in another as it cools. Its remedy was to preheat the casting so that it expanded and contracted as a whole, reducing the restraint the cold metal imposed on the hot. Campbell's method for a broken pulley spoke, jacking the rim and hub apart so the weld's contraction would bring them back, did the same by removing the restraint the rim and hub would otherwise have imposed.

## Preheat and restraint

Preheating a restrained joint reduces the residual stress in two ways. It lowers the temperature difference between the weld and the surrounding metal, so that less metal yields during heating and less shrinkage builds up; and, when the whole restraining structure is preheated, it expands that structure too, so that it contracts along with the weld as everything cools, rather than holding the weld stretched. The Davis-Bournonville course's preheating of whole castings in a charcoal fire or brick oven worked on exactly this principle. Preheat is set by the welding procedure mainly to prevent hydrogen cracking, but for highly restrained joints, its effect on stress is an important part of why it works.

## Stress that moves parts later

Residual stress is balanced within a part: tension near the welds, compression elsewhere. If the balance is disturbed, the part moves to find a new balance. That happens when clamps are released, when metal is removed by machining, when the part is cut, and when it is heated. The shop's machine bases showed this clearly.

This is an illustration. The base frame's top plate was welded to its frame, then machined flat and to thickness. After machining, the top plate was found to be about 0.4 mm out of flat over its 1.5 m length. Machining had removed a layer of the top plate that was in compression from the welds round its edges, and the plate had bowed as the remaining stresses rebalanced. The machining had been right when it was done; the part moved afterwards.

## Staged machining

The shop's fix for the base was staged machining: the top plate was rough machined, leaving a little extra material, then left for a day, or stress relieved, so that it moved to its new balance, then finish machined. Removing most of the stressed material in the roughing cut let the plate move before the final cut, which then had only a small amount to correct. The finished tops stayed within 0.05 mm of flat.

## Stress relief by heat

Heating a welded part uniformly to a temperature at which its yield stress is much lower, holding it there, and cooling it slowly, relieves most of its residual stress: the metal near the welds yields at the lower stress, the stresses fall, and on slow cooling they stay low. For carbon steels, stress-relief heat treatment is typically carried out at several hundred degrees, with the temperature, holding time and heating and cooling rates set by the applicable standard or procedure. Stress relief is required by some codes for thick or critical welds, and it improves dimensional stability for machining, fatigue resistance for some details, and resistance to some forms of stress corrosion. It also adds cost, needs a furnace large enough for the part or local heating equipment, and can change the properties of some steels, so it is specified deliberately, not by habit.

## Other ways to reduce residual stress

Several other methods reduce or redistribute residual stress:

- **peening**, hammering the weld surface to stretch it and introduce compressive stress at the surface, used mainly at weld toes for fatigue (Designing Welded Joints by the Numbers explains this in its fatigue chapter);
- **vibratory stress relief**, vibrating the part at or near its resonant frequencies, which some fabricators use for dimensional stability, though its effectiveness on residual stress is debated;
- **mechanical stretching**, loading the part slightly beyond yield once, which reduces peak residual stresses and is used on some pressure equipment;
- **lower heat input and fewer passes**, which reduce the shrinkage in the first place.

## Restraint, distortion and the balance

Restraint is a tool to be used deliberately. For angular distortion of plates, where the plate's own stiffness is low, clamping or strongbacks are effective and the residual stress they add is usually acceptable. For joints in thick, hardenable or crack-sensitive steels, high restraint is dangerous, and the welding procedure may deliberately allow the parts some freedom, or preheat them, to reduce the stress. For parts that will be machined, stress relief or staged machining may be needed whatever restraint was used. The shop's welding engineer considers, for each product, how much distortion can be tolerated, how much stress is acceptable, and chooses the restraint to suit.

## The pattern of residual stress

Across a typical butt weld in a plate that was free to move, the residual stress along the weld's length is tensile and close to yield in the weld and a band either side, falling through zero a short distance away and becoming compressive further out, so that the tension and compression balance across the plate. Across the weld's width, the pattern depends more on the restraint. In a fillet welded tee, the weld and the parts near it carry tension along the weld, balanced by compression in the flange and web away from it. Knowing the pattern, even roughly, helps predict how a part will move when it is cut or machined: removing material in tension lets the part contract there, and removing material in compression lets it expand.

## Residual stress and service

Residual stresses add to the stresses from service loads, so a joint already near yield from welding can yield locally under a modest load. For ductile steels at ordinary temperatures, that local yielding is usually harmless: the residual stress is shaken down by the first loads, and the joint carries its design load. Residual stress matters most where the steel or the weld has low toughness, where cracks or defects are present, at low temperatures where brittle fracture becomes possible, in fatigue, and where an environment can attack a stressed metal, such as chlorides on austenitic stainless steel. In those cases, codes may require stress relief, and the designer and welding engineer decide together.

## Measuring residual stress

Residual stress cannot be seen, but it can be measured, or at least revealed. The simplest method in a workshop is to cut a strip from a welded part and watch it move: a strip that curls or opens when cut was stressed. Laboratories use hole drilling, in which a small hole is drilled near strain gauges that record how the surface relaxes, X-ray diffraction, and other methods. For production, the shop relies mainly on the dimensional effect it cares about: measuring a part before and after machining, or before and after release from its fixture, tells it how much the residual stress matters for that product.

## Restraint in fixtures

Fixtures are one of the main sources of deliberate restraint, and their design affects both distortion and stress. A fixture that holds every part rigidly prevents distortion during welding but locks in stress that is released when the part comes out. A fixture that holds the parts in position but allows them to move in the directions shrinkage wants, while controlling the directions that matter, can give a part that is both in tolerance and less stressed. Chapter 8 discusses fixtures and presetting together.

## A failure: the cracked insert

This is an illustration. A repair crew fitting a new plate insert into an opening in a thick, stiff machine frame welded it all round in a single sequence, with no preheat, on a cold morning. The insert's welds cracked along their centrelines before the day was out.

The insert had been completely restrained by the stiff frame, so its welds' shrinkage became tension near the yield stress at once, and the welds, made in a hardenable steel without preheat, cracked. The insert was cut out and refitted with its edges slightly dished, so it could flex as the welds shrank, with preheat and a balanced back-step sequence, as Weld Repairs That Hold describes for inserts. The new welds held.

## Exercise: restraint over a longer length

The same butt weld, with a free shrinkage of 1.8 mm, is restrained over a length of 5 m rather than 500 mm, because the joint lies in a long, flexible member. Estimate the elastic stress. Would the joint yield?

The strain is 1.8 ÷ 5,000 = 0.00036, and the elastic stress about 205,000 × 0.00036 ≈ **74 MPa**, well below the yield stress. The joint would not yield; the long member would stretch elastically to take up the shrinkage, and the weld would be left with a moderate residual stress of about 74 MPa, plus the local stresses near the weld itself.

The comparison with the 500 mm case shows why the same weld can be harmless in a long, flexible member and dangerous in a short, stiff one: restraint, not the weld alone, decides the stress.
