---
book: electroplating-by-the-numbers
chapterSlug: how-zinc-protects-and-for-how-long
order: 8
title: "How zinc protects, and for how long"
description: "Understand sacrificial and barrier coatings, estimate the life of a thin zinc coating from atmospheric corrosion rates, and choose thickness and treatments to suit the environment."
draft: false
---

A zinc coating on steel does not protect by being impermeable. It protects by corroding instead of the steel, slowly and sacrificially, until it is used up. That makes its life predictable in a way few coatings are: if the rate at which zinc corrodes in a location is known, the time until the thinnest point is consumed follows from the thickness. It also means that the same coating can last decades indoors and only a few years on a coast.

This chapter explains the electrochemistry of protection, connects it to the 1917 treatise's observation about corroding anodes, estimates the life of the bracket coating with published corrosion rates, and shows how a coastal customer's brackets failed on schedule.

## Sacrificial and barrier coatings

When two different metals touch in the presence of moisture, they form a cell: the more active metal becomes the anode and corrodes, and the less active becomes the cathode and is protected. Zinc is more active than steel. At a scratch, a cut edge or a pore in a zinc coating, the exposed steel is the cathode and the surrounding zinc the anode, so the zinc corrodes and the steel does not. This is **sacrificial** or cathodic protection, and it is why a zinc coating continues to protect steel at small defects.

Nickel and chromium behave differently. They are less active than steel, so they protect only as a **barrier**, by keeping moisture away. At a pore or scratch through a nickel coating, the exposed steel becomes the anode and the large nickel surface the cathode. The steel then corrodes faster than it would if bare, concentrated in a small pit. Decorative nickel and chromium systems on steel are therefore built with enough thickness, and often several layers, to keep pores from reaching the steel.

```figure
type: compare
title: Zinc and nickel on steel at a scratch
cols: Zinc coating | Nickel coating
caption: The same scratch, opposite results. Zinc sacrifices itself; nickel concentrates attack on the exposed steel.
- Relative activity | zinc more active than steel | nickel less active than steel
- At the scratch | zinc corrodes; steel protected | steel corrodes as a small anode
- How it protects | sacrificially, until consumed | as a barrier, if free of pores
- *Life set by | zinc thickness and corrosion rate | pore-free thickness and layer design
```

## Anodes corrode: the 1917 view

The 1917 treatise stated the principle from the electrolytic side: as a general rule, metals corrode when used as anodes. It gave a vivid urban example. Water and gas pipes in city streets were deteriorating where leakage current from electric tramways left the iron pipes and passed into the earth, because at the point where current leaves a metal into an electrolyte, the metal is the anode and dissolves.

Faraday's law puts a number on that. One ampere leaving a steel pipe continuously for a year, about 8,766 hours, dissolves iron as Fe²⁺ at about 55.845 ÷ (2 × 96,485) grams per coulomb, which comes to about **9.1 kg of iron** a year. The same current leaving zinc would consume about 10.7 kg of zinc a year. Stray current corrosion is still a concern near DC traction systems and cathodic protection installations, and the arithmetic explains why a small leakage current can destroy a buried pipe in a few years.

A zinc coating works by exactly this mechanism, at a much smaller scale and on purpose: tiny local currents flow from the zinc to exposed steel, and the zinc is consumed.

## How fast zinc is consumed

Atmospheric corrosivity is classified internationally under ISO 9223 into categories from C1, very low, to CX, extreme. The American Galvanizers Association has published the first-year zinc corrosion rates associated with each category, drawn from ISO 9223:2012.

```figure
type: range
title: First-year zinc corrosion rate by ISO 9223 category
unit: µm per year
min: 0
max: 9
caption: From the American Galvanizers Association's summary of ISO 9223:2012. CX, extreme, runs from 8.4 to 25 µm per year and is off this scale.
- C1, very low | 0 | 0.1
- C2, low | 0.1 | 0.7
- *C3, medium | 0.7 | 2.1
- C4, high | 2.1 | 4.2
- C5, very high | 4.2 | 8.4
```

The simplest life estimate divides the minimum zinc thickness by the corrosion rate. The rates are for zinc in general and apply to electroplated zinc as well as to hot-dip galvanising, although electroplated coatings are much thinner. Three cautions apply. First-year rates are often higher than long-term rates, because corrosion products build up and slow further attack, so a linear estimate from first-year rates is usually conservative for boldly exposed surfaces. Sheltered surfaces that stay damp, crevices, condensation and contact with other metals can corrode faster than the category suggests. And the estimate gives the time to first exposure of steel at the thinnest point, not the time to structural damage.

## The bracket coating's life

This is an illustration. The brackets carry a minimum of 8 µm of zinc. Dividing by the category rates gives approximate times to first exposure of steel at the thinnest point:

```figure
type: bars
title: Years until an 8 µm zinc minimum is consumed, at the fastest rate of each category
unit: years
max: 12
caption: This is an illustration using the upper first-year rate of each category, a conservative estimate. At the lower rates, the times are C2 80, C3 11.4, C4 3.8 and C5 1.9 years.
- C2, low | 11.4
- *C3, medium | 3.8
- C4, high | 1.9
- C5, very high | 1.0
```

Indoors in a dry, unheated building, which is often category C2, the coating could last for decades. In a sheltered outdoor location classed C3, it might last anywhere from about 3.8 to 11.4 years. On an exposed coastal site in C4 or C5, it might last only one to four years. The workshop's customer wanted a ten-year life in a C3 location, which an 8 µm minimum meets only at the gentler end of the category's range.

## Where the thinnest zinc meets the wettest spot

The category describes the general atmosphere, but corrosion happens in microclimates. A surface that faces downward, sits in a crevice or holds water after rain stays wet far longer than a boldly exposed face and corrodes faster. On the original bracket, the channel recess was both the thinnest zinc, at half the average, and, when the bracket was mounted channel-down, the dampest place. The two effects compounded, which is why the failure in Chapter 5 showed first in the channels.

Design can separate them. Mounting the bracket so the channel drains, adding a drain hole at its lowest point, or opening the channel as Chapter 5's redesign did, all reduce the time the thinnest zinc spends wet. A life estimate should use the category rate for boldly exposed faces and a judgement, preferably informed by experience on similar parts, for sheltered and wet ones.

## Galvanic couples at the joint

A zinc coating is anodic to almost everything it is likely to be fastened to. A stainless steel bolt through a zinc-plated bracket forms a cell in which the zinc around the bolt corrodes faster than the zinc elsewhere, especially where water collects under the head. Copper and brass fittings have the same effect. The cure is to match the fastener coating to the bracket, or to isolate dissimilar metals with non-conducting washers and sleeves, as the READOS corrosion chapter describes. A life estimate for the coating is only valid where the coating is not being consumed faster by a couple nobody noticed.

## Zinc into the environment

A sacrificial coating ends up in the environment. This is an illustration. At the upper C3 rate of 2.1 µm a year, each bracket loses about 2.1 × 2.0 × 0.0714 ≈ 0.30 g of zinc a year, and the order of 4,000 about 1.2 kg a year, carried away in rainwater runoff. For a few brackets that is trivial; for large areas of zinc-coated roofing, cladding or structure near sensitive waterways, runoff can be a consideration in coating choice and drainage design, and environmental regulators may have a view on it.

## Checking coatings in service

Because zinc is consumed at a fairly steady rate, its remaining thickness in service is informative. A magnetic gauge reading on an installed bracket, compared with the thickness when new, gives the actual loss and, divided by the years in service, the actual rate for that location. Two readings a few years apart turn a category estimate into a measured one and allow replacement or maintenance to be planned before red rust appears. White corrosion products alone mean the zinc is working; red rust means steel is exposed and the coating's life at that point is over.

## Passivates, sealers and topcoats

Almost all zinc electroplate is given a **passivate**, a thin conversion coating formed by dipping the plated part in a solution that reacts with the zinc surface. Passivates slow the onset of white corrosion products, give the coating its colour, from clear and blue to yellow, olive or black, and provide a better surface for any sealer or paint that follows.

Traditionally many passivates used hexavalent chromium. Because hexavalent chromium compounds are toxic and carcinogenic, as Chapter 9 explains, most modern zinc plating uses trivalent chromium passivates and other alternatives. The standards have followed. AS/NZS 1789:2023, adopting ISO 2081:2018, covers zinc with supplementary treatments generally, while ISO 2081:2025 was narrowed to supplementary treatments containing hexavalent chromium, which is a reason to check which edition a specification cites. A passivate and sealer can add substantially to the time before white corrosion products appear, but once the zinc itself is corroding, the life estimate above governs.

Passivate performance is often quoted in hours of neutral salt spray, an accelerated laboratory test described in ISO 9227, measured as the time until white corrosion products or red rust appear on test panels. Those hours are useful for comparing coatings and for checking that a plater's process is consistent from batch to batch. They are not years of service. Salt spray does not reproduce the wetting and drying cycles, pollutants or corrosion products of a real atmosphere, and the ranking of coatings in the cabinet does not always match their ranking outdoors. A specification can sensibly require a salt spray performance as a process check, but the service life estimate should still come from the environment and the zinc thickness.

Wet storage stain is a related problem worth knowing. Freshly plated parts stacked tightly while damp, or stored where condensation forms, can develop bulky white corrosion products between them within days. It is a storage failure, not a coating failure, and it is avoided by drying and ventilating stored parts.

## A failure: the coastal brackets

This is an illustration. A batch of the same brackets, at the same 8 µm minimum, was sold to a second customer for a structure a few hundred metres from the sea. The workshop had not asked where the brackets would be installed. Within a year the brackets showed heavy white corrosion products, and after about two years red rust appeared at edges and in the channels.

Nothing was wrong with the plating. A coastal location of this kind can fall into category C4 or C5, where an 8 µm minimum lasts roughly one to four years on the conservative estimate, and the failure arrived on schedule. The investigation needed only the environment and the life estimate.

The correction was to put the environment into the specification process. The workshop now asks every customer for the installation environment and required life, assigns an ISO 9223 category with the customer, and chooses the coating to suit. For C3 with a ten-year requirement, that means either a thicker electroplate or a different system. For coastal sites it means hot-dip galvanising, a duplex system of galvanising and paint, or another system altogether, as discussed in the READOS chapter on [protecting metals from corrosion and wear](/reados/collections/machine-elements-and-mechanical-design/protecting-metals-from-corrosion-and-wear/). Electroplated zinc is an excellent coating for the right environment, and a poor one for the wrong one. The brackets already installed on the coastal structure were scheduled for replacement with galvanised brackets, and the cost of that replacement, far larger than the original plating, became the argument the workshop now uses when a customer resists being asked where the parts will go.

## Thicker electroplate or another system

Thickness can be raised, but the plating numbers of earlier chapters show the cost. This is an illustration. A 25 µm minimum on the revised bracket, whose recess receives 70% of the average current, needs an average of about 25 ÷ 0.7 ≈ 35.7 µm, which takes about **78 minutes** at 2.0 A/dm² and 80% efficiency, more than three times the 25.1 minutes for 8 µm. It would last roughly 11.9 to 35.7 years in C3 on the same simple model. Hot-dip galvanising typically gives much thicker coatings for a different cost structure, and for steel structures outdoors it is usually the first option to compare.

## Exercise: thickness for fifteen years

The workshop's customer asks for brackets with an expected fifteen-year life to first steel exposure in a C3 location. Using the C3 first-year rate range, calculate the minimum zinc thickness needed at the upper and lower ends of the range, and comment on what the result means for electroplating.

At the upper C3 rate of 2.1 µm a year, fifteen years needs about 15 × 2.1 = **31.5 µm**. At the lower rate of 0.7 µm a year, about 15 × 0.7 = **10.5 µm**. Designing to the upper rate is the conservative choice unless site measurements or experience support a lower one. A 31.5 µm minimum on the revised bracket needs an average of about 45 µm, which is a long and costly electroplating cycle; a thicker coating system such as hot-dip galvanising, or electroplate with a sealer and topcoat whose performance is supported by evidence for that environment, is likely to be the better answer.
