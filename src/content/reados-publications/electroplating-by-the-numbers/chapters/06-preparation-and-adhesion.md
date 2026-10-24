---
book: electroplating-by-the-numbers
chapterSlug: surface-preparation-and-adhesion
order: 6
title: "Surface preparation and adhesion"
description: "Understand why a plated coating sticks only to chemically clean metal, what each cleaning step removes, why some metals deposit loosely without current, and how blisters are traced."
draft: false
---

A coating can be the right metal, at the right thickness, in the right places, and still fail completely if it does not stick. Blisters, flaking and peeling are adhesion failures, and they are almost always caused before the part reaches the plating tank. The 1917 treatise reduced the matter to one rule that every plater still learns: before anything else, a surface that is to take a deposit must be clean.

This chapter explains what "clean" means to a plater, what each preparation step is for, why some combinations of metal and solution produce a loose deposit with no current at all, and how blisters on the bracket order were traced to a marker pen and a forming lubricant.

## What clean means

The treatise was precise about the standard. A surface to be plated must be free not only of dirt, grease, rust and paint but also chemically free of oxides and tarnish films, some so thin they cannot be seen. It warned that touching a cleaned article with the hands could contaminate it enough to make the coating non-adherent. When the surface is properly prepared, it noted, the deposit can bond so intimately with the base metal that the two effectively alloy at the interface; when it is not, adhesion is poorer.

The modern explanation is the same in substance. Adhesion comes from metallic bonding between the deposit and the base metal, which requires the two to be in direct contact, atom to atom. A film of oil one molecule thick, or an oxide layer a few nanometres thick, prevents that contact. The deposit may still form over the film, and may even look perfect, but it is held on by much weaker forces and will lift when stressed by bending, heating, impact or corrosion beneath it.

The treatise also noted a cause of poor adhesion that the plater cannot control: if a deposit with a high coefficient of thermal expansion is laid on a base metal with a low one, temperature changes in service tend to make the coating flake. That is a design choice, made when the coating is specified.

## What each preparation step does

Preparation is a sequence, because different soils need different chemistry, and because each step must be rinsed off before the next.

```figure
type: steps
title: Preparing steel for zinc plating
caption: Each step removes a different kind of soil. Rinses between them stop one solution being carried into the next.
- Soak clean | hot alkaline solution lifts oils and loose soils
- Rinse | removes cleaner
- Electroclean | current through the part scrubs off remaining films
- Rinse | removes cleaner
- *Pickle | acid dissolves rust, scale and oxide
- Rinse and activate | a fresh, oxide-free surface goes straight to plating
```

The treatise described the first and fifth steps: hot alkaline solutions for oils and grease, and acid pickles for oxides, each metal having its own preferred pickle. Electrocleaning, in which the part is made an electrode in the cleaner so that gas generated at its surface helps scrub it, was developed later. Whether the part is made anode or cathode in electrocleaning matters for hardened steels, because cathodic cleaning generates hydrogen at the steel surface, a point Chapter 7 returns to.

Some soils resist this sequence and need to be dealt with before parts are sent to the plater.

```figure
type: compare
title: Soils that cause plating trouble
cols: Where it comes from | Why it is a problem
caption: Most of these are added by the parts maker, not the plater, and are cheaper to prevent than to remove.
- Heavy drawing compounds | press forming | may not lift in a standard soak; pools in recesses
- Silicone and some markers | release agents, paint pens, labels | resist alkaline cleaners; leave non-wetting spots
- Heat-treatment scale | hardening, annealing | thick oxide; needs longer pickling or blasting
- Laser-cut edge oxide | oxygen-assisted cutting | adherent oxide on cut faces
- Weld spatter and slag | welding nearby | cannot be cleaned chemically; must be removed mechanically
- Rust in seams and folds | storage | traps acid and solution; bleeds out later
```

## Pickling: enough, but not too much

The acid pickle has a narrow job: to dissolve oxide and leave bare, active steel. Left too long, or in acid that is too strong or too hot, it goes on to dissolve the steel itself. Over-pickling roughens the surface, which plating then accentuates, as Chapter 1 described. It etches preferentially along some features of the steel's structure and can open up laps and seams. And because acid attacking steel releases hydrogen at the surface, it is one of the main sources of the hydrogen that Chapter 7 shows can embrittle hardened parts.

Platers therefore control pickling by time, concentration and temperature, use inhibitors that slow attack on the steel while leaving the oxide to dissolve, and treat heavily scaled parts, such as those from heat treatment, by abrasive blasting first so that a short pickle suffices. A part that needs a long pickle to come clean is telling the plater, and the purchaser, something about how it was made or stored.

## The minutes between tanks

A freshly pickled steel surface is at its most active, and it starts to re-oxidise in air almost at once. If parts hang in the air between the final rinse and the plating tank, or sit in a rinse while the operator attends to something else, a thin oxide or flash rust can form, and the deposit then grows on that film instead of on the steel. Good lines keep transfers short and consistent, and some use a brief acid dip immediately before plating to reactivate the surface. A rack that waited ten minutes while the hoist was busy can plate with poor adhesion even though every solution was correct, which is why some platers log transfer times on automatic lines.

## Checking a surface is clean

A practical check used by platers is the **water-break test**. A cleaned, rinsed surface held up to drain should carry a continuous, unbroken film of water. Where oil or another water-repellent film remains, the water pulls back and breaks into beads or dry islands. The test does not prove a surface is free of oxide, but it reliably catches oil and silicone, which are the commonest causes of blistering. It takes seconds, and it is worth doing on the first rack of every new part and whenever the cleaning line changes.

## Deposits without current

The treatise described a process that platers try to avoid: **coating by simple immersion**. Dip clean iron into a solution of copper sulphate, it noted, and a copper coating forms at once, with no current at all. Copper dipped into certain silver solutions gains a silver coating in the same way, and cheap jewellery was once gold-coated by dipping brass. The treatise judged such coatings of little practical value, because they are either extremely thin or porous and poorly attached, and said it was practically impossible to obtain an adherent copper coating on iron by this method.

The explanation lies in the order in which metals give up electrons, often called the electrochemical series. Iron gives up electrons more readily than copper. In a copper solution, iron atoms at the surface dissolve and copper ions take their electrons and deposit, a displacement reaction that continues until the surface is covered. The copper grows on a surface that is dissolving beneath it, so it cannot bond well.

That is why the treatise warned that an acid copper bath could not be used to plate directly on iron or steel: the iron would throw out copper by simple immersion before the current could lay down a sound deposit. The steel had first to receive a thin, adherent copper layer from a different solution, in which displacement does not occur, before thick copper could be built up in the acid bath. Modern platers do the same with **strike** layers, thin first deposits from solutions designed to bond well, such as a nickel strike on stainless steel or a copper strike on steel or zinc-alloy castings. When a plater proposes to omit a strike to save a step, the 1917 explanation is still the reason to ask why.

Zinc plating on steel does not have this problem, because zinc gives up electrons more readily than iron and so cannot be displaced onto it from solution. The bracket's adhesion depends entirely on how clean and active the steel is when it enters the zinc tank.

## The load on the cleaner

Cleaners are consumed by the soils they remove, and the soils come from the parts maker. This is an illustration. Each bracket has about 0.02 m² of surface. If it arrives with a light oil film of about 2 g/m², it carries about 0.04 g of oil into the cleaner, and the whole order about 160 g. If it arrives with a heavy drawing compound at about 20 g/m², it carries about 0.4 g, and the order about 1.6 kg.

Suppose the plater's 1,000 L soak cleaner is dumped and remade when it has absorbed about 2 g of oil per litre, 2 kg in total. Lightly oiled brackets would use only a small fraction of its life; one cleaner charge could handle about 50,000 of them. Heavily soiled brackets would exhaust it in about 5,000, so this one order would use most of a charge, and the last racks of the order would be cleaned in a solution near the end of its useful life. Soil on the parts is a cost the plater has to recover, and an adhesion risk that grows as the cleaner ages.

## A failure: blisters at the label

This is an illustration. Two racks of brackets came out of the passivate and drier with small blisters, a few millimetres across, on the outer faces, and a scatter of larger blisters along the bottom of the channel. A blister cut open with a knife lifted a thin skin of zinc with bare steel beneath. The plater stopped the line and examined the remaining unplated brackets.

Two causes emerged. The blisters on the outer faces lined up with batch numbers that the workshop's staff had written on each bracket with a paint marker, which resisted the alkaline cleaner. The blisters in the channel came from forming lubricant that had pooled in the bend when the brackets were stacked after the press brake and that a standard soak did not fully remove. A water-break test on cleaned but unplated brackets showed both: water beaded on the marker lines and pulled back from the bottom of the channel.

The correction involved both businesses.

1. **Contain.** The blistered brackets were stripped and replated; brackets from the same press batch were checked by water break before plating.
2. **At the workshop.** Paint markers were banned on parts going to plating; batch identification moved to tags on the stillages. The forming lubricant was changed to one the plater's cleaner removes readily, and brackets were stored channel-down to drain.
3. **At the plater.** A water-break check was added to the first rack of every new part and every shift, and soak time was increased for formed parts with recesses.

The failure illustrates the treatise's point about invisible films in a modern form. Neither the marker nor the lubricant was visible after cleaning, and both were introduced by the parts maker, who did not think of them as part of the plating process.

## What the parts maker owes the plater

Most of the soils in the table above are put on by the parts maker, and most adhesion failures can be prevented by agreeing the condition in which parts are delivered. A short list on the purchase order or the drawing removes the guesswork.

```figure
type: checklist
title: Condition of brackets delivered for plating
caption: This is an illustration of the list the workshop added to its plating orders after the blistering failure.
- x No paint markers, labels or tape on parts
- x Forming lubricant of the agreed type only
- x Parts deburred; no spatter or slag
- x Heat-treatment or laser oxide declared in advance
- x Parts stored dry, recesses draining
- ? Plater to confirm cleaning route for new lubricant
```

## Testing adhesion

Adhesion is checked by stressing the coating and seeing whether it lifts. Common shop methods include bending a sample part or panel and looking for flaking at the bend, filing an edge at an angle to see whether the coating peels from the base metal, scribing a grid and pulling tape from it, and heating a part and quenching it to stress the interface. Each suits some coatings and thicknesses better than others, and coating standards specify which apply. What matters for the purchaser is that the method is agreed in advance, done on first articles and repeated at intervals, because a poorly adherent coating passes every thickness check.

Adhesion results also belong in the plating record beside thickness. When the bracket blisters appeared, the plater could show that adhesion bend tests on earlier racks of the same part had passed, which pointed the investigation straight at something that had changed in the incoming parts rather than in the line. Without that record, both businesses would have started by suspecting each other.

## Exercise: a cheaper copper route

A supplier quoting a decorative copper, nickel and chromium finish on steel brackets proposes to plate the copper layer directly from an acid copper bath, omitting the usual strike, to save a tank and about two minutes per load. Using the electrochemical explanation in this chapter, explain the risk, how it would show itself and what evidence to ask for.

Iron gives up electrons more readily than copper, so in an acid copper solution the steel surface dissolves and copper deposits by displacement before and during plating. The 1917 treatise described exactly this: a loose, poorly adherent copper layer on iron. The coating could look acceptable when new but would blister or flake when bent, heated or exposed to corrosion, and the failure would take the nickel and chromium layers with it. The evidence to ask for is adhesion test results on the proposed route, using an agreed bend or heat-quench method on first articles, compared with the strike route. Unless the supplier can show a bath chemistry that prevents displacement, the two minutes saved are not worth the risk.
