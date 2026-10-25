---
book: brazing-and-soldering-by-the-numbers
chapterSlug: solders-tin-lead-and-lead-free
order: 7
title: "Solders: tin-lead and lead-free"
description: "Read the tin-lead eutectic and pasty range, compare 1910 solders with tin-silver-copper alloys, size the heat in a soldering iron, and answer a customer's question about lead."
draft: false
---

Soldering is the oldest and humblest of the capillary processes, and for most of its history it meant one family of alloys: tin and lead. Hart's 1910 manual described ordinary solder as half tin and half lead, and a harder, cheaper solder with two parts of lead to one of tin. A century later, lead has been removed from the solders of most electronics and drinking-water plumbing, and the tin-silver-copper alloys that replaced it behave differently enough that soldering practice had to change with them.

This chapter explains the tin-lead system and its eutectic, compares the solders of the early manuals with modern alloys, calculates the heat a soldering iron carries, and follows the manufacturer's response to a customer's question about lead.

## Tin and lead

Pure tin melts at about 232 °C and pure lead at about 327 °C. Mixed, they melt at lower temperatures than either, down to a minimum at one composition, the eutectic. The National Institute of Standards and Technology's phase diagram for the lead-tin system gives the eutectic reaction at **182.2 °C**, at a composition of about **62.1% tin and 37.9% lead** by mass. At that composition, the alloy melts and freezes at a single temperature, like a pure metal. Away from it, the alloy melts over a range: it begins to melt at the eutectic temperature and becomes fully liquid only at a higher temperature that depends on how far the composition is from the eutectic.

```figure
type: bars
title: Melting temperatures of solders and their metals
unit: °C
max: 340
caption: The tin-lead and tin-silver-copper eutectics are from NIST's solder phase diagrams; pure tin and lead are standard values; the fusible alloy figure is the one Hart gave in 1910 for Wood's metal.
- Wood's metal, fusible alloy | 70
- *Tin-lead eutectic, about 62% tin | 182
- Tin-silver-copper eutectic | 216
- Pure tin | 232
- Pure lead | 327
```

## The pasty range

The range between first melting and full melting is called the pasty or plastic range, and it made tin-lead solders versatile. Hart's half-and-half solder lies away from the eutectic, on the lead-rich side, so it is partly liquid over a band of some tens of degrees above 182 °C. A plumber wiping a joint in lead pipe used that band: the solder stayed workable long enough to be shaped with a cloth into a smooth, thick joint. The eutectic alloy, with no pasty range, goes straight from solid to liquid, which suits electronics, where the solder must flow quickly into a fine joint and freeze before anything can move.

The pasty range has a cost. If a joint is moved while the solder is in its pasty range, the partly solid metal is disturbed, and the joint freezes with a grainy, cracked structure, the classic "dry" or disturbed joint. Electronics soldering therefore favours eutectic or near-eutectic alloys, and parts are held still until the solder has frozen.

## The solders of 1910

Hart described the additions used to adjust tin-lead solders in his day. Antimony hardened and stiffened the solder. Arsenic was sometimes added to make it flow freely. Bismuth and cadmium lowered the melting point, bismuth making the solder brittle and cadmium making it softer; a small proportion of copper stiffened and strengthened the solder but raised its melting point sharply. His example of a fusible alloy was Wood's metal, two parts each of tin, lead and cadmium to eight of bismuth, melting at about 70 °C. He also warned that the proportions and properties of solders on the market were inexactly known, that many were sold with properties they did not possess, and that practical people had to find out for themselves which were fit for their purposes, a complaint that modern standards and data sheets have largely answered.

Cravens's 1921 manual gave the melting points of most solders as about 200 °C, with softer solders at about 180 °C, consistent with the tin-lead system near its eutectic.

## Why lead came out

Lead is toxic. It accumulates in the body and harms the nervous system, the kidneys and the blood, and children are especially vulnerable. Solder in drinking-water pipes could release lead into the water, and solder in discarded electronics could release lead into landfill and recycling streams. Over the past few decades, regulations in many countries have restricted or removed lead from solders for drinking-water plumbing and for most electrical and electronic equipment. The requirements that apply to a particular product depend on the product, its market and its use, and they change over time, so a manufacturer must check the current regulations and its customers' specifications rather than rely on a general rule.

## Lead-free solders

The main replacements are alloys of tin with small amounts of silver and copper. NIST's phase diagram for the silver-copper-tin system gives a ternary eutectic at **215.9 °C**, at a composition of about 3.7% silver, 0.9% copper and the rest tin, and commercial tin-silver-copper solders are close to that composition. Tin-copper alloys, without silver, are cheaper and melt a little higher, and are common in wave soldering and plumbing. Tin-silver alloys and others with bismuth or indium serve particular uses.

```figure
type: compare
title: Tin-lead and lead-free solders compared
cols: Tin-lead eutectic | Tin-silver-copper, near eutectic
caption: General comparison. The NIST eutectic temperatures are cited in this chapter; the solder maker's data and the product's regulations govern the choice.
- Melting | 182.2 °C, single temperature | about 216 °C, near single temperature
- Typical working temperature | lower | about 30 to 40 °C higher
- Wetting and spread | spreads readily | wets well but spreads less
- Joint appearance | bright and smooth | often duller, slightly grainy
- *Lead content | about 38% | none
- Cost | lower | higher, mainly because of silver
```

## What changed in practice

Moving from tin-lead to lead-free solder changed four things on the bench. The working temperature rose by about 34 °C at the eutectic, so irons are set hotter, parts and boards see more heat, and fluxes must stay active at the higher temperature. Lead-free solders wet and spread a little less readily, so the flux matters more and the surfaces must be cleaner. The finished joints often look duller and more grainy, which upset inspectors trained to read a bright tin-lead joint as good and a dull one as bad; inspection criteria had to change. And soldering bits wear faster, because tin-rich solders dissolve the iron plating of bits more quickly.

## The soldering iron

Hart described the soldering bit as a copper-headed tool, made fairly bulky so that it would hold heat, and pointed for working into seams and corners. Its point had to be tinned, coated with solder, so that when hot it would carry a skin of melted metal that drew the solder with it; if the bit was overheated to redness, the tinning was lost and had to be renewed. The bulk mattered because the bit was heated in a stove or flame and then carried to the work, giving up its heat as it soldered.

```figure
type: formula
title: Heat a soldering bit can give to a joint
formula: Q = m × c × ΔT
caption: This is an illustration for a traditional copper bit heated to 350 °C and used until it falls to 250 °C, still well above the solder's melting point.
- m, copper head | 0.2 kg
- c, specific heat of copper | about 385 J/(kg·°C)
- ΔT | 100 °C
step: Q = 0.2 × 385 × 100
step: Q ≈ 7,700 J, about 7.7 kJ before reheating
```

That heat must bring the joint, not just the solder, to temperature. This is an illustration. A joint in copper sheet that must heat 50 g of metal from 20 °C to about 220 °C takes about 0.05 × 385 × 200 ≈ **3.9 kJ**, half of what the bit can give, before any losses. A small bit on a heavy joint runs out of heat before the joint is hot, and the solder freezes on the surface without flowing in, which is why large work needs large bits, a flame, or preheating. Modern electric irons with temperature control replace the stored heat with a steady supply, but the same reasoning applies: the iron's tip and power must match the mass of the joint.

## How a soldered joint is made

The sequence has not changed since the early manuals described it: clean the surfaces mechanically or chemically, apply a flux suited to the metals and the work, heat the joint, not the solder, until the joint itself melts the solder, let the solder flow into the joint by capillary action, and hold the parts still until it has frozen. Cravens summed up the points to watch as temperature and flux: overheating oxidises the work, lets the solder run uncontrolled and strips the coating of solder from the iron; poor fluxing stops the solder wetting the parts, so they do not join. For electrical joints, the wire is held mechanically before soldering wherever practical, so that the solder makes the electrical connection and the mechanical support comes from the termination.

## Strength and creep

Solders are weak by comparison with the metals they join, and Hart noted that soldered joints are therefore not often intended to be specially strong. They are also close to their melting point at room temperature, measured on the absolute scale: tin-lead eutectic solder at 20 °C is at about 293 ÷ 455 ≈ 64% of its absolute melting temperature, a level at which metals creep, stretching slowly under steady load. Soldered joints that carry sustained loads, such as a heavy cable hanging from a soldered lug, creep and eventually fail. Soldered joints carry electricity and seal pipes; mechanical loads are carried by something else.

## Soldering in production

Hand soldering with an iron suits repair, prototypes and small batches, but most soldered joints in the world are made by machine. In wave soldering, circuit boards with their components in place pass over a standing wave of molten solder that wets the exposed leads and pads from below, making hundreds of joints in a few seconds. In reflow soldering, a paste of solder powder and flux is printed onto the pads of a board, components are placed on the paste, and the board passes through an oven that melts the paste, which wets and joins everything at once. Plumbing joints in factories are soldered with preformed solder rings inside the fittings, heated by torch or induction. Each method controls the same variables the hand solderer controls by eye: clean surfaces, the right flux, enough heat for the joint to melt the solder, enough time for it to flow, and no movement while it freezes. The move to lead-free solder made those controls tighter, because the higher melting point leaves a narrower margin between soldering the joint and overheating the parts.

## Fusible alloys

Alloys like Wood's metal, melting below the boiling point of water, are not used to make joints but have specialised uses that exploit their low melting points: fusible plugs and links that melt to release a sprinkler or relieve pressure in a fire, temporary fillers for bending thin tube without kinking it, and holding fixtures for delicate parts during machining. Many contain lead and cadmium, as Wood's metal does, and need the same care as any material containing those metals; bismuth-based alloys without them are available for many uses.

## The running case: the lead question

This is an illustration. A large customer asked the manufacturer to confirm that its control boxes contained no lead. The boxes' electrical connections were hand-soldered with a tin-lead eutectic solder, and the production manager had to answer that they did.

The manager checked the regulations and the customer's specification, which required lead-free solder in all electrical assemblies. The change to a tin-silver-copper solder needed new soldering iron tips rated for lead-free work, iron temperatures raised by about 30 to 40 °C according to the solder maker's guidance, a rosin-type flux rated for the higher temperature, and retraining of the two technicians on what a good lead-free joint looks like. The solder cost more, at an illustrative A$140 a kilogram against A$70 for the tin-lead solder, excluding GST, but the boxes use only about 4 kg a year, so the extra cost was about A$280 a year, small beside the value of keeping the customer.

## A failure: the dull joints

This is an illustration. In the first week after the change, the inspector rejected a large number of control box joints as "dull and grainy", which under the old tin-lead criteria meant disturbed or cold joints. Sectioning a sample showed that most were sound: good wetting, full fillets and no voids. Lead-free solder simply looks different.

The inspection criteria were rewritten with photographs of acceptable and unacceptable lead-free joints, focusing on wetting angle, fillet shape and coverage rather than brightness, and the rejected boxes were re-inspected against them. A few joints were genuinely poor, made with an iron set too cool, and were reworked. The case is a reminder that when a material changes, the inspection that judges it must change too.

## Exercise: tin in the eutectic

A soldering line uses 25 kg of tin-lead eutectic solder a year. How much tin and how much lead does it contain? If the line changes to a near-eutectic tin-silver-copper solder with 3.0% silver and 0.5% copper, how much silver will it use in a year?

At about 62.1% tin, 25 kg of eutectic solder contains about 0.621 × 25 ≈ **15.5 kg of tin** and 25 − 15.5 ≈ **9.5 kg of lead**. The lead-free solder at 3.0% silver contains about 0.030 × 25 = **0.75 kg of silver** a year, along with about 0.125 kg of copper and the rest, about 24.1 kg, tin. The silver, a small fraction by mass, is the main reason the lead-free solder costs more, and the reason tin-copper alloys without silver are used wherever their slightly higher melting point and different behaviour are acceptable.
