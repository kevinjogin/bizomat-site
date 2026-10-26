---
book: engineering-software-you-can-sell
chapterSlug: protect-without-punishing-customers
order: 6
title: "Protect without punishing customers"
description: "Choose a level of licence enforcement by weighing unlicensed use against the friction it puts on paying customers, buy rather than build licensing, and make sure a licence failure never stops work."
draft: false
---

Once software is sold per seat, something has to stop one licence becoming twenty. The instinct of many first-time sellers is to lock the software down as tightly as possible. The cost of that instinct falls on paying customers: activation errors after a hardware repair, a lockout when the licence server is unreachable, a support call because a designer moved to a new desk. Unlicensed users who are determined to avoid paying usually find a way around any protection, while honest customers bear every inconvenience.

This chapter chooses how firmly to enforce the drawing-checking add-in's licences. It compares levels of protection, weighs the revenue lost to unlicensed use against the friction each level adds, explains why the office bought a licensing service rather than writing its own, and sets the rule that a licence problem must never stop a designer's work. The failure case is a nine-hour outage at the licensing service that locked out every customer because the add-in checked its licence at every start.

## Levels of protection

```figure
type: compare
title: Levels of licence protection for an add-in
cols: How it works | Friction for honest customers | What it stops
caption: A general comparison. The right level depends on the product's price, its customers and how easily it could be copied.
- Licence key and honour system | a key is entered; usage terms are in the licence | almost none | casual copying, mostly by reminding people of the terms
- Online activation, occasional check | the key is activated for a machine and rechecked every few weeks, with a grace period offline | low; machine moves need a deactivation | sharing one key across many machines
- Online check at every start | the add-in contacts a server each time it loads | high whenever the server or network is unavailable | as above, slightly sooner
- Hardware-locked or dongle | the licence is tied to hardware or a physical key | high for repairs, virtual machines and hot-desking | most copying, at a large cost in support
```

The source for this book distinguished between writing licensing yourself and using a commercial licensing product, and recommended the latter for anything that needed to be dependable. Two decades on, the advice holds, and the market for licensing services aimed at small software sellers is far larger.

## Weigh unlicensed use against friction

The office estimated both sides of the trade-off for its expected installed base of about **120** seats in year three.

```figure
type: formula
title: Revenue at risk against the cost of strict enforcement
formula: unlicensed loss = seats × unlicensed share × price        friction cost = tickets per seat × seats × hours per ticket × rate + extra churn
caption: This is an illustration with the office's own assumptions. Customers are engineering firms, most of which manage software licences carefully; the unlicensed share is a guess to be checked, not a measured figure.
- Seats | 120 at A$495 a year, excluding GST
- Unlicensed share without enforcement | assumed 10%
- Strict enforcement | assumed 0.3 licence tickets per seat a year, 0.5 h each at A$110, plus 2% extra churn from frustration
step: unlicensed use ≈ 120 × 0.10 × 495 ≈ A$5,940 a year
step: strict enforcement friction ≈ 0.3 × 120 × 0.5 × 110 + 0.02 × 120 × 495 ≈ 1,980 + 1,188 ≈ A$3,168 a year
step: occasional checks with a grace period ≈ 0.05 × 120 × 0.5 × 110 ≈ A$330 a year in tickets
```

If unlicensed use really were 10%, strict enforcement would recover more than it costs. But strict enforcement does not recover all of it: some unlicensed users would simply stop using the add-in rather than pay. If enforcement converts about half of them, it recovers about **A$2,970** a year, less than the friction cost of about **A$3,168**.

Occasional checks with a grace period stop the most common form of overuse, one key shared across a firm, at a small fraction of the friction. That was the office's choice.

## Buy the licensing, do not build it

Writing a licensing system looks simple: generate a key, check it, store the result. Writing one that works reliably across machine repairs, operating system updates, virtual machines, proxies and time-zone changes, and that does not lock out paying customers through its own faults, is a substantial piece of software in its own right. It also has to be maintained, which is work that adds nothing customers value.

The office used a commercial licensing service aimed at small software sellers. The service issues keys, handles activation and deactivation, provides a customer portal where administrators move licences between people and machines, and records which seats are in use. The add-in calls the service's library. This is an illustration. The service's annual fee, about **A$2,400** excluding GST on the plan the office chose, was less than the cost of the 60 hours of licensing work in Chapter 3's estimate would have been to maintain each year, and the service handled problems the office would never have thought of.

## Never stop the work

The office set one rule above all others for licence enforcement: **a licence problem must never stop a designer's work or damage a file**. The add-in checks drawings. If its licence cannot be confirmed, it may stop checking, with a clear message, but it must not prevent the CAD system from loading, opening or saving a drawing, and it must not interrupt a designer in the middle of a task.

```figure
type: steps
title: How the add-in behaves around licence checks
caption: This is an illustration of the office's design after the failure case. A cached confirmation means a server outage is invisible to customers for up to 30 days.
- At load | read the cached licence confirmation; never contact a server while the CAD system is starting
- Once a day, in the background | try to refresh the confirmation; failure is logged quietly and retried
- After 21 days without confirmation | show the administrator a notice that the licence cannot be confirmed and why
- After 30 days | stop running checks, with a message explaining how to restore the licence; the CAD system is unaffected
- *On any licence error | never block opening or saving drawings; never lose results already shown
```

The grace period also helps sites with unreliable connections, firms behind restrictive proxies and designers working on a laptop on a site visit for a week. Each of these would be a support ticket under a check at every start.

## Be fair at the edges

Edge cases test whether enforcement is fair:

- **A designer's machine is replaced.** The administrator deactivates the old machine in the portal and activates the new one. If the old machine died without being deactivated, the administrator can release it remotely, up to three times a year per licence without contacting the office.
- **A firm grows during the year.** As Chapter 5 described, extra seats are settled at renewal. The add-in warns the administrator when more seats are active than licensed, but does not stop the extra users.
- **A subscription lapses.** The add-in stops checking at the end of the grace period after expiry, with a message. Configuration files and reports remain the customer's, and nothing is deleted.
- **A firm is found using many more seats than it pays for.** The office contacts the firm, assumes a mistake first and offers to regularise the position at the normal price. In two years, this happened twice, and both times it was an administrator who had misunderstood the licence terms.

## Test the licensing like the product

Licensing code runs on every customer machine every day, and its failures land on paying customers. It deserves the same testing as the checking engine. After the failure case below, the office added a set of licensing scenarios to the test matrix from Chapter 3, run for every release:

- the licensing service unreachable at start-up, for one day, 21 days and 31 days, simulated by blocking the connection and moving the test machine's clock;
- the machine's hardware changed, as after a repair, and the licence moved in the portal;
- the subscription expired, then renewed, without reinstalling anything;
- a proxy that requires authentication, as several customers use;
- more seats active than licensed, to confirm the add-in warns the administrator and keeps working;
- the licensing service returning an unexpected error, to confirm the add-in treats it as "unreachable", not as "unlicensed".

The last scenario found a real fault. An early build treated one particular error from the service, returned during the service's maintenance windows, as a revoked licence, and would have stopped checks immediately rather than starting the grace period. It was found in testing, not by customers, which is exactly where such faults belong.

## Say what the licence check collects

A licence check sends information about the customer's machine to a third party, the licensing service, and customers' IT staff will ask what. The office published the answer in its administrator guide and its network statement from Chapter 4:

- the licence key;
- a machine identifier, which the licensing library derives from several hardware and system values and sends only in hashed form, so that the original values cannot be read from it;
- the add-in's version and the CAD release;
- the date and time of the check.

It does not send user names, file names, drawing contents or anything from the customer's network. The licensing service's own privacy and data-location terms were read and summarised for customers, including the country where its servers are located, because some clients of Australian engineering firms ask where data about their projects goes. In this case, nothing about projects goes anywhere, and being able to say that plainly helped several sales.

## Read the licence data as business information

The licensing service records which seats are active, on which versions and when they last checked in. Used carefully, that is useful business information, not just enforcement data.

This is an illustration. Each month, the office looks at three numbers from the portal. The first is **active seats against licensed seats** per customer: a firm using far fewer seats than it pays for may be about to reduce its licence at renewal, and a call to find out why is worth making. The second is **trial activations that were never used**: a trial installed but never run usually means the onboarding call did not happen or the install failed. The third is **seats on unsupported versions**, which feeds the upgrade conversations in Chapter 4. None of these needs any data beyond what the licence check already collects. The office uses the figures to decide whom to call, never to penalise a customer automatically.

## The code itself

Some sellers worry that a competitor or customer could take the add-in apart and copy it. Tools exist to make compiled code harder to read, and the licensing service offered one. The office used it lightly, mainly to protect the licence-checking code from being trivially disabled.

It did not rely on it. The add-in's real protection is not secrecy. It is that the product is kept compatible with each new CAD release, supported by people who answer within a day, configured for each customer's standard and improved from customers' requests. A copy of last year's code, without updates or support, would stop working at the next CAD release and could not be configured for anyone's new standard. That service is what customers pay for, and it cannot be copied. Copyright law also protects the code whether or not it is obscured, which is one more reason the ownership audit in Chapter 2 matters.

## A failure case: nine hours locked out

This is an illustration. The add-in's first product release, written to get the product out quickly, contacted the licensing service every time it loaded, and refused to run checks if it could not get an answer within ten seconds. In testing, the service always answered.

Four months after launch, the licensing service suffered an outage lasting about nine hours on a weekday. Every customer designer who started their CAD system that day saw the add-in fail to load its checks. The office had **9** customer firms at the time with about **40** seats between them. Its support inbox received 14 messages before noon, nearly one from every firm, and the office could do nothing but explain and apologise.

The detection was immediate and public, which is the worst way to learn about a design fault. The corrections were the behaviour shown in the steps above: a cached licence confirmation valid for 30 days, refreshed in the background and never checked during start-up. In addition, the office now monitors the licensing service's status page, and has a prepared message to customers for any outage. The release containing the fix went to every customer as a priority patch. The office also offered every affected firm a month's credit on its next renewal. That cost about **40 × 495 ÷ 12 ≈ A$1,650**, a twelfth of a year's revenue from those 40 seats, and it did more for goodwill than any amount of explanation. At the 120 seats expected by year three, the same outage under the old design would have reached three times as many people.

## How this applies to a small Australian business

Australian engineering firms are generally careful about software licensing, partly because CAD vendors audit their customers. Most will pay for what they use if the terms are clear and the process is easy. For a small product sold to such firms, light enforcement with a generous grace period is usually the best trade-off. Spend the effort instead on clear licence terms, a simple portal for administrators and a friendly true-up at renewal. The firms most likely to use the product without paying are often the ones least likely to pay under any enforcement, and chasing them costs more than they are worth. Your reputation in a small professional community is worth far more than a few unlicensed seats. Engineers talk to each other, and a product known for locking out paying customers will lose more sales than any protection saves.

## Exercise: a dongle option

A large prospective customer asks for licences on hardware keys, because its security policy forbids software that contacts outside servers. Supplying and supporting hardware keys would cost about **A$60** per key in hardware and handling, plus an estimated **2 hours** of support per key per year at A$110 an hour. The firm wants **15** seats. At A$495 per seat per year excluding GST, what is the margin per seat in the first year compared with an ordinary seat, and what alternative might satisfy the firm's policy?

**Worked answer.** For each key-based seat, first-year cost is about **60 + 2 × 110 = A$280**, leaving a margin before other costs of about **495 − 280 = A$215** per seat, against nearly the full A$495 for an ordinary seat. Across 15 seats, that is about **A$4,200** less margin in year one. An alternative is an **offline licence file**: a signed file issued for the firm's machines, valid for the subscription term and renewed annually by the administrator, which needs no outside connection and no hardware. Most licensing services support this, and it would meet the policy at almost no extra cost.
