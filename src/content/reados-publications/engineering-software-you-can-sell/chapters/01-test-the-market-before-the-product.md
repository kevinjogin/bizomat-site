---
book: engineering-software-you-can-sell
chapterSlug: test-the-market-before-the-product
order: 1
title: "Test the market before the product"
description: "Find out whether other firms will pay for an in-house engineering tool, using interviews, trials and a paid pilot, and compare the likely revenue with productising cost and lost fees."
draft: false
---

When an in-house tool works well, it is natural to assume that other firms would want it too. Sometimes they do. Often they have the same problem but solve it differently, or have it less acutely, or would use the tool but not pay for it, or would pay but not enough to cover the cost of supporting strangers. The only way to know is to ask, then ask for money, and to do both before spending months turning the tool into a product.

This chapter tests the market for the design office's drawing-checking add-in. It sets the tool's value inside the office, interviews other firms with questions that get past politeness, climbs from interest to a paid pilot, and compares the realistic revenue with the cost of productising and the engineering fees forgone. The failure case is an earlier idea that colleagues loved and almost nobody paid for.

## Know what the tool is worth at home

Start with the evidence you have: what the tool does for your own firm. This is an illustration. The design office produces about **2,400** drawings a year. Before the add-in, a designer spent about 20 minutes checking each drawing against the office's drafting standard before it went to the independent checker. The add-in does most of those checks automatically in under a minute, and the designer's remaining check takes about 5 minutes, a saving of about **0.25 hours** per drawing.

At an internal cost of about A$95 an hour, that is **2,400 × 0.25 × 95 = A$57,000** a year. The add-in also catches errors that used to reach the independent checker or, occasionally, the client. Those are real but harder to price.

That number is the office's own value, not a market. It says the tool is worth keeping and improving. It says nothing yet about whether anyone else will pay.

## Ask other firms the right questions

The office interviewed people at **20** firms over six weeks: clients with their own drafting teams, peer firms, and members of the CAD reseller's local user group. The questions were about their problem, not the office's tool:

- How do you check drawings before release? Who does it and how long does it take?
- What goes wrong, and what does it cost you when it does?
- What tools, templates or checklists do you use now?
- Which CAD system and version do you run, and on how many seats?
- Who decides whether to buy software, and how do they decide?
- Have you bought a CAD add-in before? What happened?

Only at the end of each interview did the interviewer describe the tool and ask whether it would help. The order matters. People asked about a solution first tend to be polite about it. People asked about their problem first reveal whether they have it. The method is described more fully in [Running interviews and focus groups](/reados/collections/research-and-evidence-for-better-decisions/running-interviews-and-focus-groups/).

## Find out what they use instead

Every prospect already solves the problem somehow, even if badly. Those existing solutions are the real competition, and they are often not other products. The interviews found four kinds:

- **a printed or on-screen checklist**, worked through by the designer, at most firms;
- **a checking utility included with the CAD system**, available on some licence levels of some CAD products, which two firms used for part of the job;
- **templates and settings** strict enough to prevent many errors at source, at the better-organised firms;
- **a senior person** who checks everything and catches most errors through experience.

Each changes the sale. A firm with a strong template set gains less from the add-in. A firm with the CAD system's own checking utility needs to see what the add-in does that the utility does not. The office's add-in checked the firm's own drafting conventions, which built-in utilities generally do not know about, and that became its clearest point of difference. A firm that relies on one senior checker is buying insurance against that person's absence, which is a different conversation from saving time.

## Climb the ladder of evidence

Interest is cheap. The strength of evidence rises with what people are willing to give: time, data, then money.

```figure
type: funnel
title: From 20 interviews to a paid pilot
caption: This is an illustration. Each step asked for more commitment; the drop at each step is the information.
- Firms interviewed | 20
- Have a checking problem they find costly | 11 | 55% of those interviewed
- Use the same CAD system on a supported version | 7
- Agreed to a free four-week trial | 6
- Paid for a six-month pilot | 4 | 14 seats in total
```

Eleven of 20 firms had a checking problem they considered costly. Only seven used the same CAD system, which immediately limited the market: the add-in works only inside that system. Six agreed to a free trial, and after it, **four** paid for a six-month pilot at **A$250** per seat, excluding GST, covering **14** seats and **A$3,500** in total.

The pilot fee was deliberately modest. Its purpose was not revenue. It was to find out whether the firms would go through their own purchasing process for the tool, and whether, having paid, they would use it. Three of the four renewed at the full price after the pilot. That is the strongest evidence the office could get without launching a product.

```figure
type: compare
title: How much each kind of evidence is worth
cols: What the prospect gives | What it tells you
caption: This is an illustration of the office's own scale. Each step up costs the prospect more, which is exactly why it is better evidence.
- Says it sounds useful | nothing | almost nothing about demand
- Describes the problem in detail, with costs | an hour of their time | the problem is real for them
- Installs and uses a free trial | IT approval and staff time | the tool fits their environment and work
- Pays for a pilot | a purchase decision through their own process | someone with budget authority values it
- *Renews at full price | continuing budget | the product delivers enough to keep paying
```

## Read the pilot, not just the payment

A paid pilot is a test of the product as well as the market. The office agreed with each pilot firm what it would measure: drawings checked per seat per week, problems found per drawing, time spent on the remaining manual check and every support question. The add-in already kept a simple local count of checks run, and the pilot firms agreed to send it monthly.

This is an illustration. Three firms checked between 5 and 9 drawings per seat per week, close to the office's own rate of about 6, and reported similar time savings. The fourth checked fewer than 1 per seat per week. A conversation found the reason: that firm's IT policy blocked add-ins from loading automatically, so designers had to enable the tool by hand each morning, and most did not bother. The fourth firm did not renew.

That finding mattered more than the payment. It showed that a product sold to other firms must work within their IT policies, not the office's, a theme Chapter 4 takes up. It also showed that usage, not purchase, predicts renewal. The office decided that the product would report usage to its owner firm's administrator, and to the office only with the customer's consent, so that both could see whether the tool was actually being used.

## Decide in advance what would make you stop

The hardest decision in a venture like this is to stop, because by then effort has been spent and people are attached to the idea. The office wrote its stopping rules before productising began:

- fewer than **40** paid seats 18 months after launch;
- renewal below **70%** of seats at the first annual renewal;
- support time above **2 hours** per seat per year after the first six months, which would mean the product cost more to support than the price allows (Chapter 10 uses this figure).

If any rule triggered, the office would stop selling to new customers, honour existing licences to the end of their terms and keep the tool for its own use. Writing the rules down in advance made them a plan rather than a defeat.

## Size the reachable market honestly

Market-size figures from industry reports describe whole sectors, not the firms a small office can actually reach and sell to. The office built its estimate from the bottom up instead.

This is an illustration. From its own contacts, the reseller's user events and the professional associations it belongs to, the office estimated about **300** firms in Australia it could realistically reach in three years that use the same CAD system. The interviews suggested about a third had the problem acutely and an average of about **4** seats each. The office assumed that, with effort, **10%** of the seats at those 300 firms would be using the tool after three years. That is **300 × 4 × 0.10 = 120** seats. At the planned price of A$495 per seat a year excluding GST, set in Chapter 7, that is about **A$59,400** a year.

```figure
type: formula
title: Year-three revenue against the cost of getting there
formula: revenue = firms × seats per firm × adoption × price        forgone fees = productising hours × charge-out rate
caption: This is an illustration. The productising estimate comes from Chapter 3; the charge-out rate is the office's own fee rate for engineering work, excluding GST.
- Reachable firms | 300
- Seats per firm | 4
- Adoption by year three | 10%
- Price | A$495 per seat per year, excluding GST
step: revenue ≈ 300 × 4 × 0.10 × 495 ≈ A$59,400 a year by year three
step: productising ≈ 600 h × A$110 internal cost ≈ A$66,000
step: if those hours were otherwise billable at A$150, fees forgone ≈ A$90,000
```

The numbers are sobering. Productising the tool, Chapter 3 estimates, would take about **600** hours. At the internal cost rate that is about A$66,000. If those hours would otherwise be billed to clients at the office's charge-out rate of A$150 an hour, the opportunity cost is about **A$90,000**. Revenue of around A$59,400 a year by year three, before support and sales costs, makes the venture a slow and uncertain return on that investment.

## What the evidence said

Several things were now clear that had not been at the start:

- The problem is real for about half the firms asked.
- The market is limited by the CAD platform, to about a third of the firms with the problem.
- Firms will pay, but adoption takes months per firm, through purchasing and IT approvals.
- The revenue is modest relative to the effort and the fees forgone.

The office did not abandon the idea. It changed it. Rather than building a full product at once, it chose a smaller first version for the four pilot firms and others like them, sold directly, with a narrower set of supported CAD versions. And it opened a conversation with the CAD reseller about distributing the tool, which Chapter 9 follows. The decision to proceed was made with eyes open and with a clear point at which to stop: if fewer than 40 paid seats existed after 18 months, the office would keep the tool for itself and its existing clients.

## A failure case: everyone said yes

This is an illustration. Some years earlier, the office's principal had built a spreadsheet calculator for sizing base plates and shown it to colleagues at an industry dinner. Nine engineers at other firms said they would buy it. The principal spent about 120 hours tidying it, writing instructions and setting up a simple payment page.

Two firms paid. The other seven, when contacted, said they were "very interested" but had not got around to it, needed to check with a manager, or had built something similar themselves in the meantime. Revenue covered about a sixth of the time spent.

The failure was not the calculator. It was treating friendly enthusiasm as demand. People at a dinner are generous with interest, and saying "I'd buy that" costs nothing. The detection came only when money was requested, after the investment had been made. The office's rule since then is the ladder used above: interest, then a trial that costs the prospect some effort, then a payment, however small, before any significant spending on the product.

## How this applies to a small Australian business

The Australian market for most specialised engineering tools is small, which can be an advantage. You can reach most of your potential customers through a few associations, reseller events and your existing clients, and you can talk to them directly. It also means a product that only suits Australian firms may not support a business on its own. Ask early whether the tool would work for firms overseas, under different drafting standards, and what it would cost to adapt. A tool that fits only your own standards is a consulting asset, which can be valuable in its own right, rather than a product. Many firms find that offering the tool as part of their engineering services, configured for each client, earns more than selling it as a product and needs far less support.

## Exercise: a calculator with a wider market

The office's structural team has a connection-design add-in. Interviews with 20 firms find 9 with a costly problem, 8 of whom use the same CAD system, and 5 who pay for a pilot. The team estimates **400** reachable firms with **3** seats each, **8%** adoption by year three and a price of **A$600** per seat per year excluding GST. Productising would take about **500** hours. Calculate the year-three revenue and the productising cost at A$110 an hour, and compare the two ventures.

**Worked answer.** Year-three revenue is **400 × 3 × 0.08 × 600 = A$57,600** a year. Productising costs about **500 × 110 = A$55,000**. The checker add-in had revenue of about A$59,400 against about A$66,000. The connection add-in has slightly lower revenue but lower cost, and more of the interviewed firms both had the problem and used the same CAD system (8 of 9 against 7 of 11), which suggests a less platform-limited market. Neither is clearly superior on these figures. The evidence that decides is the pilot: five paying firms for the connection tool against four for the checker. The office should treat both cautiously and build the one whose pilot customers renew.
