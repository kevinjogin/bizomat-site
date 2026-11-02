---
book: plasma-surface-engineering-by-the-numbers
chapterSlug: what-plasma-treatments-are-worth
order: 10
title: "What plasma treatments are worth"
description: "How to judge whether nitriding and PVD coatings pay: cost per thousand shots for die tooling, Taylor tool life for coated cutters, and a treater's business case for a coater."
draft: false
---

A plasma treatment is bought by the piece, but its value shows up somewhere else: in fewer die changes, longer tool life, less scrap and fewer stoppages, usually in a different department's budget from the one that pays the treatment invoice. A purchasing officer comparing two quotations for treating die cores sees one price higher than the other. A production manager sees a die-casting cell that stops every few weeks to change soldered cores. The two are looking at the same decision from opposite ends, and only the numbers can bring them together.

This chapter puts numbers on three decisions in order 27's world. It works out the die-caster's cost per thousand shots with nitrided and with duplex-treated cores, uses the KEVOS® Taylor tool life tool to compare coated and uncoated cutters, and appraises the shop's own purchase of its PVD coater with the investment appraisal tool. It ends with a purchasing decision made on treatment price alone.

## What a treatment costs to make

The shop prices a treatment from its machine time, energy, gas, labour and testing. A PN-1 nitriding run for order 27 occupies the vessel for about 18 hours: an hour of heat-up and cleaning, 12 hours at temperature and about 5 hours of cooling and handling. At 24 kW for most of the glow time, it uses about 380 kWh. A PV-1 coating run takes about 6 hours door to door. Each run carries its coupons, metallography and adhesion tests.

```figure
type: compare
title: The shop's prices for order 27, per insert
cols: Price per insert | Main cost drivers
rowhead: Treatment
- Plasma nitriding only | A$60 | Vessel time, energy, coupons and metallography, shared over 24 inserts
- PVD CrN only | A$110 | Coater time, targets, cleaning and adhesion tests, shared over a load
- * Duplex: nitriding then CrN | A$170 | Both, with the duplex release tests
caption: This is an illustration. Prices are the shop's, excluding GST. Loads are priced as wholes, so a small order pays more per part; mixing orders in a load lowers the cost per part when their recipes match.
```

## The die-caster's view: cost per thousand shots

The toolmaker's customer, a die-caster, runs the die in a cell that makes about 300,000 shots a year. The die holds six of the order 27 cores. With nitrided cores, aluminium begins to solder to them after about 40,000 shots, and the six are changed together; with duplex-treated cores, the die-caster's trial ran about 110,000 shots between changes. A core costs about A$650 to machine, plus its treatment. Each change stops the cell for about two hours, which with lost output, labour and scrap castings during the restart costs the die-caster about A$900.

```figure
type: compare
title: Core changes and their cost per year for one die
cols: Shots between changes | Changes per year | Cost per change | Cost per year | Cost per thousand shots
rowhead: Cores
- Nitrided, A$710 each | 40,000 | 7.5 | 6 × A$710 + A$900 = A$5,160 | A$38,700 | A$129
- * Duplex, A$820 each | 110,000 | 2.7 | 6 × A$820 + A$900 = A$5,820 | A$15,873 | A$53
caption: This is an illustration. Core lives are the die-caster's trial results for this die, not general values; the cost per change includes A$900 of stoppage, labour and restart scrap. The duplex cores cost more per change and save A$22,827 a year because they are changed so much less often.
```

The duplex cores cost A$110 more each, A$660 more per set, but the die is stopped less than half as often. The cost per thousand shots falls from A$129 to A$53, and over a year of 300,000 shots the die-caster saves about A$22,800. Most of the saving is the change cost and the cores no longer bought, not the treatment price.

## Coated cutters and Taylor tool life

The toolmaker also sends the shop its carbide end mills for coating with titanium aluminium nitride. Whether coating pays depends on how much longer the tools last and how much faster they can run, which tool life tests at two speeds can show.

The [Taylor tool life tool](/tools/taylor-tool-life/) fits the Taylor equation, VTⁿ = C, through two tool life tests, gives the tool life at a planned speed, and works out the minimum-cost and maximum-production cutting speeds from the machine rate, the cost of a cutting edge and the tool change time. The toolmaker's tests on H13 in its milling centre, with a machine and operator rate of A$120 per hour and a tool change time of 3 minutes, gave these results.

```figure
type: compare
title: Uncoated and TiAlN-coated end mills in H13
cols: Two tests | Taylor n and C | Cost per edge | Minimum-cost speed and life | Maximum-production speed
rowhead: End mill
- Uncoated | 120 m/min, 30 min; 160 m/min, 8 min | 0.218 and 252 m/min | A$18 | 111 m/min, 43 min | 150 m/min
- * TiAlN coated | 160 m/min, 35 min; 220 m/min, 9 min | 0.235 and 368 m/min | A$30 | 142 m/min, 59 min | 216 m/min
caption: This is an illustration. Results from the Taylor tool life tool. The cost per edge includes regrinding, and coating for the coated tool. The models hold only near the tested speeds, feeds and depths.
```

The coated tool's efficient speed range, between its minimum-cost and maximum-production speeds, runs from 142 to 216 m/min, against 111 to 150 m/min uncoated. At the toolmaker's chosen 180 m/min, a coated tool lasts about 21 minutes; an uncoated tool run at the faster end of its own range, 140 m/min, lasts about 15 minutes. The coated tool removes metal about 29% faster and lasts longer while doing it, for A$12 more per edge. For a toolmaker whose milling centres are the bottleneck, the faster cutting is worth far more than the edge cost. Tool life tests in the customer's own machine and material are the only reliable basis; published comparisons for other materials and machines are a guide to what to test, not a result.

## The treater's view: buying a coater

The shop itself made an investment decision when it bought PV-1. The coater, with installation, cost about A$680,000. The shop's business plan expected it to bring about A$260,000 a year in coating income from customers like the toolmaker, against about A$95,000 a year of running costs: targets, gases, power, maintenance and an operator's share. It allowed a salvage value of A$60,000 after ten years and used a 9% hurdle rate.

The [equipment investment appraisal tool](/tools/investment-appraisal/) works out the net present value, internal rate of return, simple and discounted payback and benefit–cost ratio of an equipment purchase with uniform yearly savings or income and running costs. With these figures it gives a net yearly flow of A$165,000, a net present value of A$404,258, an internal rate of return of 20.9%, a simple payback of 4.1 years and a discounted payback of 5.4 years.

```figure
type: steps
title: PV-1's business case, as planned
caption: This is an illustration. Results from the equipment investment appraisal tool, before tax. The income depends on keeping the coater loaded; at 60% of the planned income the net flow would fall to A$61,000 a year and the case would no longer pay at 9%.
- Purchase and installation | A$680,000
- Coating income per year | A$260,000
- Running costs per year | A$95,000
- Net yearly flow | A$165,000
- * Net present value at 9% over 10 years | A$404,258
- Internal rate of return | 20.9%
- Simple / discounted payback | 4.1 / 5.4 years
```

The weak point in any such case is utilisation. A coater earns only when it is full, and a treater's income depends on winning and keeping enough work to fill it. The shop tracks the coater's loading each month against the plan, because that number, not the coater's technical performance, decides whether the investment pays. In its second year PV-1 ran at about 85% of the planned income, enough for a positive net present value but with a payback a year longer than planned, which the shop answered by offering toolmakers in the Hunter region a regular weekly pickup and delivery.

## Costs that do not appear on the quotation

Several costs sit outside both the treatment price and the cost-per-shot comparison, and a fair decision counts them.

**Lead time.** Cores sent to Newcastle for duplex treatment are out of the toolmaker's hands for about a week, including transport, nitriding, testing, coating and testing again. A die-caster who changes cores often must hold a larger stock of spare treated cores to cover that week; one who changes rarely needs fewer. Longer-lived cores therefore reduce inventory as well as stoppages.

**Failed batches.** Chapters 8 and 9 each ended with a batch that had to be stripped and recoated. The shop bore those costs, but the toolmaker lost time, and a die-caster waiting for cores could have lost production. A treater's record of first-time release, which the shop reports to its regular customers each quarter, is worth asking about.

**Testing.** The coupons, sections and adhesion tests that make the certificates meaningful are a real share of the price, roughly a tenth of it on order 27. A cheaper quotation that omits them is not quoting the same thing.

**Design and preparation.** Plugs, masks, coating allowances on fits, edge preparation on cutters and the agreement of which surfaces matter all take engineering time on both sides, mostly on the first order. Repeat orders are cheaper to manage than the first, which favours staying with a treater whose process is proven on the part.

## Energy and gas

Plasma treatments are frugal with materials. Order 27's nitriding run uses about 2 standard litres of gas per minute for most of its 18 hours, roughly 2.2 cubic metres of gas at standard conditions in all, most of it hydrogen, and about 380 kWh of electricity, almost all of it as heat in the load. There is no ammonia to store and handle, as in gas nitriding, and no molten salt to maintain and dispose of, as in salt-bath processes. A PVD run uses a few kilograms of target material a month across all runs, argon and nitrogen in small quantities and the energy for the targets, heaters and pumps. The shop includes its electricity in the run cost and reports the energy per run to customers who account for the emissions of their supply chain; the main lever on it is keeping loads full, since an empty corner of PN-1 costs as much to heat as a full one.

## Choosing what to treat

Not every tool or part repays a plasma treatment. The die-caster's comparison shows the pattern in which they do: a part that fails by a mechanism the treatment addresses, in this case soldering and wear, and whose failure is expensive because it stops a production cell. Where the life of a part is set by something else, such as thermal fatigue cracking of a die-casting die's cavity surface or the fracture of a slender core pin under load, a surface treatment may add little, and money is better spent on the steel, the heat treatment or the design.

The economics also depend on volume. A die that makes a few thousand castings a year changes its cores so rarely that the treatment's extra cost may never be recovered; a die running around the clock pays for it within weeks. For cutting tools, coating pays most where the machine is the bottleneck and its hourly rate is high, because the faster cutting the coating allows is worth more than the tool's life. The shop's advice to customers is to start where the record of changes or tool consumption is longest and the cost of each change is highest, measure the result, and extend the treatment only where the numbers show it pays.

## Proving the result

The die-caster's figure of 110,000 shots for duplex cores came from a trial, and a trial can mislead. Core lives scatter: one set may solder at 90,000 shots and the next run to 130,000, depending on alloy temperature, spray practice and how the die is warmed up. A single set is one data point. The die-caster now records, for every core set, the treatment, the dates fitted and removed, the shot count at removal and the reason, and compares treatments on the average of several sets, with the scatter shown, rather than on the best result.

Two practical rules come with it. The comparison must be like for like: the same die, alloy and cell, over periods in which nothing else changed, such as the die spray, the cycle time or the alloy supplier. And the reason for each change must be recorded honestly, because a set removed early for an unrelated repair is not a soldering failure and should not count against the treatment. With a year of such records, the cost-per-thousand-shots comparison above stops being an estimate and becomes a measurement, and the next purchasing decision can be made from it in a few minutes.

## When it goes wrong: buying on treatment price

When the die-caster's purchasing officer reordered cores a year later, the toolmaker quoted both options. The purchasing officer compared the quotations, saw the duplex cores at A$110 more each, and ordered nitrided cores, saving A$660 on the set.

Three months later the production manager asked why the die was back to stopping every few weeks. The cores were doing exactly what nitrided cores do: soldering after about 40,000 shots. At the cost rates in the comparison above, the A$660 saving on the set had cost about A$5,700 in extra changes over those three months.

```figure
type: decision
title: How the die-caster now buys treated tooling
caption: This is an illustration. The comparison rests on the die-caster's own recorded core lives, which it now keeps for every die.
- Compare treatment prices only | Simple, but ignores what the treatment is for | Not adopted
- * Compare cost per thousand shots, using recorded core lives and change costs | Puts treatment, cores and stoppages on one basis | Adopted
- Specify the treatment on the die drawing | Stops a reorder silently changing it | Adopted
```

The die-caster now specifies the duplex treatment on the die drawing, so that a reorder cannot change it without an engineering decision, and keeps a record of shots between changes for every core set, which turns the next comparison into arithmetic.

## Exercise: a cheaper duplex quotation

Another treater offers duplex cores for A$140 each instead of A$170, but has no record with this die; its trial cores ran 80,000 shots between changes.

1. What would a core cost with that treatment, and what are the changes per year and the cost per year?
2. How does it compare with the existing duplex cores?
3. What should the die-caster ask before deciding?

**Answer.**

1. A$650 + A$140 = A$790 per core. 300,000 ÷ 80,000 = 3.75 changes a year, each costing 6 × A$790 + A$900 = A$5,640, so A$21,150 a year, A$70.50 per thousand shots.
2. It is A$5,277 a year dearer than the existing duplex cores at A$15,873, despite the lower price, because the cores are changed more often.
3. Whether 80,000 shots was a fair trial: the same die, alloy, cycle time and die temperatures, and enough cores to be confident. If the cheaper treater's cores truly last as long as the current ones, the price advantage is real; the decision rests on the evidence for core life, not on the price.
