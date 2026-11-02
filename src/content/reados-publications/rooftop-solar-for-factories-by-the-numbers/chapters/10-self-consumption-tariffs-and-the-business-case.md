---
book: rooftop-solar-for-factories-by-the-numbers
chapterSlug: self-consumption-tariffs-and-the-business-case
order: 10
title: "Self-consumption, tariffs and the business case"
description: "How to value a factory array's energy by self-consumption and export, build the business case with NPV, IRR and payback, test it at a P90 yield and a shorter stay, and plan the loan."
draft: false
---

A kilowatt-hour from the roof is worth what it saves or earns, and that depends on where it goes. Used in the factory, it replaces a kilowatt-hour that would have been bought from the retailer at the full energy rate. Exported to the grid, it earns a feed-in credit that is usually a fraction of that. Curtailed by an export limit, it earns nothing. The yield estimate of Chapter 4 says how many kilowatt-hours the array makes; the business case depends on how they split between those three uses, on the costs of running the array, and on how long the business will be there to collect.

This chapter values SF-90's energy, builds the business case with the KEVOS® appraisal tools, tests it against a dull year and an early move, and plans the loan that pays for it. It ends with a business case that valued every kilowatt-hour at the retail rate.

## Where the energy goes

The business has half-hourly interval data from its meter for the two years before the array, and the installer overlaid the array's simulated half-hourly output on it. On a weekday, the workshop's load runs at about 60 to 110 kW from 7 am to 5 pm, with welding sets, compressors, extraction fans, lighting and air conditioning, and the array's output, up to about 78 kW of alternating current, is almost all used on site. On weekends and public holidays the load falls to about 15 kW, for refrigeration, servers, security and a compressor kept running for the sprinkler system's air, and most of the array's output is exported, up to the 30 kW export limit in the connection agreement. Above that the inverters curtail.

```figure
type: compare
title: SF-90's first-year energy by use
cols: Share | Energy | Value per kWh | Value
rowhead: Use
- * Used in the factory | 82% | 107.1 MWh | A$0.21 | A$22,480
- Exported, within the export limit | 15% | 19.6 MWh | A$0.05 | A$980
- Curtailed by the export limit | 3% | 3.9 MWh | nothing | A$0
- Total | 100% | 130.6 MWh | A$0.1797 on average | A$23,460
caption: This is an illustration. First-year energy 132.54 MWh less a 1.5% first-year degradation, 130.55 MWh. Shares from the overlay of simulated output on the meter's interval data. Energy rate A$0.21 per kWh and feed-in credit A$0.05 per kWh, both assumed and excluding GST. Values rounded to the nearest A$10; the total is calculated unrounded.
```

The average value, A$0.1797 per kWh, is the number that matters, and it is far closer to the retail rate than to the feed-in credit only because the factory works through the day. A business that worked nights, or was closed for long holidays in summer, would export much more and earn much less from the same array.

Two other parts of a commercial electricity bill are worth naming because proposals sometimes claim savings on them. Network demand charges are set by the site's highest half-hourly demand in a month or a year. Solar output usually reduces demand during the day, but one cloudy half-hour at the factory's peak load sets the charge for the whole period, so the business assumed no demand charge saving at all. And the fixed daily supply charge does not change. Both depend on the tariff, which the business checked with its retailer and network.

## Costs

The installed price of SF-90 was A$98,000 excluding GST. A system of this size can be eligible for small-scale technology certificates under the Clean Energy Regulator's Small-scale Renewable Energy Scheme; the installer claimed them and passed their value on as a lower price, so the A$98,000 is net of the certificates. Eligibility, size thresholds and the number of certificates, which falls each year towards the scheme's end in 2030, are set by the regulator and must be checked for any real project.

The running costs, also excluding GST, are about A$1,900 a year: A$1,200 for monitoring, inspections and the biennial calibration and thermal survey (Chapter 9), A$400 for targeted cleaning and A$300 of extra insurance. The inverters will need replacing at least once (Chapter 8), assumed at A$14,000 in year 12.

## The first appraisal

For a first look, the business used the [equipment investment appraisal tool](/tools/investment-appraisal/), which takes uniform yearly savings and running costs over a life and gives the net present value, the internal rate of return, simple and discounted payback, the benefit–cost ratio and the equivalent annual cost. It used a real discount rate of 7%, a 25-year life, no salvage value and a longest acceptable payback of 6 years.

```figure
type: steps
title: SF-90's business case, from the equipment investment appraisal tool
caption: This is an illustration. Purchase A$98,000; savings A$23,460 a year; running cost A$1,900 a year; 25 years; no salvage; 7% real; prices excluding GST; before tax. The tool assumes uniform flows, so degradation and the inverter replacement are left out here and checked below.
- Net yearly flow | A$21,560
- Net present value at 7% | A$153,251
- Internal rate of return | 21.84%
- Simple and discounted payback | 4.55 and 5.67 years, against 6 years
- * Result | INVESTMENT JUSTIFIED, benefit–cost ratio 2.276
```

The tool's guide warns that it assumes uniform flows. The real flows fall slowly with degradation and have a large cost in year 12. A spreadsheet of the 25 years with savings falling by 0.4% a year and A$14,000 in year 12 gives a net present value of about A$137,800 and an internal rate of return of about 21.1%: about A$15,400 less than the uniform figure, of which the inverter replacement accounts for A$6,216 in present value and degradation for the rest. The array still pays easily. The lesson is to know which simplifications a tool makes and to check their size.

## A dull year and an early move

Two questions test the case. First, what if the yield is at the P90 of Chapter 4, 124.0 MWh rather than 132.5? The savings fall in proportion to A$21,948 a year, and the appraisal tool gives a net present value of A$135,631 and a simple payback of 4.89 years. The case survives a dull decade.

Second, what if the business moves? Its lease runs for eight more years, with an option to renew. If it moved after eight years, the array would either stay with the building, with its value reflected in the lease negotiation, or be removed and reinstalled elsewhere. The business assumed a net residual value of A$30,000 at the end of year 8. The [internal rate of return tool for uneven cash flows](/tools/irr-uneven/) takes up to eight yearly flows.

```figure
type: compare
title: SF-90 if the business leaves after eight years, from the IRR tool for uneven cash flows
cols: Value
rowhead: Result
- Net cash flows, years 1 to 7 | A$21,560 falling by 0.4% a year to A$21,003
- Net cash flow, year 8 | A$20,911 plus A$30,000 residual, A$50,911
- Internal rate of return | 17.06%
- * Net present value at 7% | A$46,451, MEETS HURDLE RATE
- Simple payback | 4.58 years
caption: This is an illustration. Purchase A$98,000; savings falling by 0.4% a year after the first year; running cost A$1,900 a year; no inverter replacement within eight years. The residual value is an assumption and is the most uncertain number in the case.
```

Even with a move after eight years, the array more than pays for itself. Without any residual value, the eight years of savings alone give a net present value of about A$29,000 at 7%; the residual value improves it but is not needed to justify it.

## Paying for it

The business chose to finance the array with an equipment loan rather than cash, keeping its working capital for stock. The [equipment finance plan tool](/tools/equipment-finance-plan/) works out the level yearly loan payment, the interest and depreciation in each year, a simplified tax and the after-tax cash flow year by year. The business assumed an 8% loan rate, its 25% company tax rate, and straight-line depreciation over 20 years with no salvage, all of which its accountant was asked to confirm, including the effective life the Australian Taxation Office accepts for the assets and any small business concessions that apply.

```figure
type: compare
title: SF-90 financed with a loan, from the equipment finance plan tool
cols: Loan payment a year | After-tax cash flow, year 1 | Worst year | Total after-tax cash flow | Result
rowhead: Loan term
- 7 years | A$18,823 | A$532 | −A$1,080, year 7 | A$224,579 over 20 years | CASH SHORT IN SOME YEARS
- * 10 years | A$14,605 | A$4,750 | A$3,061 | A$213,863 over 20 years | PAYS ITS WAY EVERY YEAR
caption: This is an illustration. Cost A$98,000, no salvage, 20-year straight-line depreciation of A$4,900 a year, 8% interest, yearly saving A$21,560, tax at 25% on the saving less depreciation and interest. Annual payments and simplified tax as the tool states.
```

On the 7-year loan, the cash flow goes negative from year 4, because the interest deduction falls each year while the payment stays the same, so tax rises and the gap between the saving and the payment closes. On a 10-year loan the array pays its way in every year, at the cost of about A$14,300 more interest. The business took the 10-year loan, because it wanted the array to fund its own repayments, and kept the option to pay it off early.

## Owning, leasing or buying the energy

Buying the array, with cash or a loan, is not the only way. Two other arrangements are common for commercial roofs.

- **A lease or rental**, in which a finance provider owns the array and the business pays a fixed amount each month for a term, with the energy savings its own. The payments are an operating cost; the business does not carry the asset or claim its depreciation. The question is the same as for the loan: does the saving exceed the payment every year?
- **A power purchase agreement**, in which a provider installs, owns and maintains the array on the business's roof and sells the energy it produces to the business at an agreed price per kilowatt-hour, usually below the retail energy rate, for a term of 10 to 20 years. The business takes no performance risk but shares the saving with the provider, and is bound to buy the array's output for the term, wherever its tariff goes.

The business compared all three on the same basis: the present value of the saving to the business, after its payments, over the period it expected to stay. Owning with a 10-year loan gave the largest saving over a stay of eight years or more. A power purchase agreement would have suited a business that wanted no capital on its balance sheet and no responsibility for maintenance, or one unsure of staying long enough to repay a loan. The terms that matter in any agreement are what happens if the business moves, sells or needs roof repairs, who insures and maintains the array, and how the energy is measured.

## Approvals and paperwork

The array needed several approvals before and after installation, and each has a cost and a lead time that belong in the project plan.

- **Landlord consent.** The workshop is leased. The lease required the landlord's written consent for alterations to the roof, and the business negotiated who owns the array at the end of the lease and who pays for removal and reinstatement if the roof must be replaced.
- **Network connection.** The installer applied to the local distribution network service provider for connection approval before installing, which set the export limit and the inverter settings.
- **Electrical compliance.** The installation was designed and installed by appropriately accredited people to AS/NZS 5033, AS/NZS 4777.1 and the wiring rules, AS/NZS 3000, and certified under the state's electrical safety requirements. The certificate claim depends on the accreditation and the paperwork being in order.
- **Structural and building.** The structural engineer's certification of the roof and fixings, and any building permit the council required.
- **Insurance.** The business told its insurer about the array before it was commissioned, and its premium rose by the A$300 a year in the running costs.

## The error: every kilowatt-hour at the retail rate

The first business case, drafted from the installer's proposal, valued the whole first-year yield at the energy rate: 130.55 MWh × A$0.21 = A$27,416 a year. In the appraisal tool, that gives a net present value of A$199,353, an internal rate of return of 25.96% and a payback of 3.84 years.

It assumed that every kilowatt-hour displaced a purchased one. In fact 15% were exported at a quarter of the value and 3% were curtailed, so the true average value was A$0.1797, and the savings were overstated by 0.21 ÷ 0.1797 − 1 = 16.9%. The business's finance manager found it by asking for the energy split by use, which the installer could produce from the half-hourly overlay. The corrected case was still strong, but the payback was 4.55 years, not 3.84, and the net present value A$46,000 lower. Approving an investment on a figure 17% too high damages trust in every later figure, even when the decision would have been the same.

```figure
type: checklist
title: Checks on a solar business case
caption: This is an illustration. The business's standard list for energy investments.
- x Energy split into self-consumed, exported and curtailed, from interval data, not assumed
- x Each share valued at its own rate, excluding GST, with the tariff checked with the retailer
- x No demand charge saving unless the tariff and the load data show one reliably
- x Degradation, the inverter replacement and running costs included
- x Tested at the P90 yield and at the shortest likely stay
- x Financing tested year by year for cash flow, not only for NPV
- ? Tax treatment and any certificates confirmed by the accountant and the regulator's rules
```

## Batteries and the export limit

The curtailed and exported energy invites a battery: store the weekend's surplus and use it on Monday. The business did the simplest upper-bound sum first. If a battery could turn all 23.5 MWh a year of exported and curtailed energy into self-consumed energy, it would raise the value of each kilowatt-hour from at most A$0.05 to A$0.21, worth at most 23,500 × 0.16 = A$3,760 a year. Over a 15-year battery life at 7%, the present value of that is about A$34,000, before round-trip losses of about 10% and before allowing for the fact that much of the weekend surplus comes on long summer weekends that a battery of practical size could not absorb. A battery would need to cost much less than A$34,000 installed to pay; at the prices quoted to the business it did not. The business will look again if the tariff changes, its operating hours change or battery prices fall.

## Exercise: a lower feed-in credit

The business's retailer proposes a new contract in which the energy rate stays at A$0.21 per kWh but the feed-in credit falls to A$0.02 per kWh, both excluding GST.

1. What is the new average value per kilowatt-hour, and the new first-year saving?
2. Using the appraisal tool's method with the same costs and life, roughly how much does the net present value change?
3. What changes to the factory's operation would protect the case best?

### Worked answer

1. Average value = 0.82 × 0.21 + 0.15 × 0.02 = 0.1722 + 0.0030 = A$0.1752 per kWh. First-year saving = 130,550 × 0.1752 = A$22,872, A$588 a year less than before.
2. The net yearly flow falls from A$21,560 to A$20,972. Over 25 years at 7%, the uniform-series present value factor is (1 − 1.07⁻²⁵) ÷ 0.07 = 11.654, so the net present value falls by about 588 × 11.654 = A$6,850, from A$153,251 to about A$146,400. The case barely changes, because only 15% of the energy is exported.
3. Using more of the array's output on site protects the case best: running energy-intensive but flexible work, such as the compressor's receiver top-up, water heating, battery charging for forklifts or a polishing batch, in the middle of the day and on sunny weekends where the work allows. Every kilowatt-hour moved from export to self-consumption is worth A$0.19 more under the new contract.
