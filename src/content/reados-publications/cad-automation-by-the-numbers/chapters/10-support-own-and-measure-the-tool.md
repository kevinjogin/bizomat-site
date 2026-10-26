---
book: cad-automation-by-the-numbers
chapterSlug: support-own-and-measure-the-tool
order: 10
title: "Support, own and measure the tool"
description: "Measure a CAD automation tool against its business case, use its log to steer improvements, remove the dependence on one maintainer and decide when to extend, rebuild or retire it."
draft: false
---

The day a tool goes into use is the start of its life, not the end of the project. From then on it needs someone to answer questions, fix faults, keep it working through CAD upgrades and rule changes, and decide whether it is still worth the effort. Many in-house tools die quietly in their second or third year, not because they stopped being useful but because the one person who understood them moved on and nobody else could keep them running.

This chapter closes the trestle configurator's story. It measures the tool against the business case from Chapter 1, uses the generation log to decide what to improve, sets up support, removes the dependence on a single maintainer and sets the conditions for extending, rebuilding or retiring the tool. The failure case is an annual CAD upgrade delayed by three weeks because the only person who could build the installer was on leave.

## Measure against the business case

Chapter 1 estimated the configurator would cut each variant from 2.4 hours to about 0.35 hours, at about 36 variants a month, with upkeep of about 15% of the build cost a year. Six months after go-live, the office measured again, timing ten real variants the same way it had timed the manual process and reading volumes and maintenance hours from the log and timesheets.

```figure
type: compare
title: The configurator against its business case, after six months
cols: Estimated in Chapter 1 | Measured | Comment
caption: This is an illustration. Measured values are annualised from six months of use; money excludes GST.
- Variants per month | 36 | 39 | more quoting work once outputs were fast
- Hours per variant | 0.35 | 0.42 | the independent check took longer than estimated
- Hours saved per variant | 2.05 | 1.98 | slightly less than estimated
- Annual saving | about A$84,100 | about A$88,000 | higher volume outweighed the smaller saving
- *Annual upkeep | A$5,280 | A$7,480 | 68 hours a year, mainly the CAD upgrade and two rule changes
- Payback | 5.4 months | 5.2 months | close to the estimate
```

The annual saving is now **39 × 12 × 1.98 × 95 ≈ A$88,031**. The upkeep, at about **68** hours a year at A$110, is **A$7,480**, about 42% more than the allowance. The net saving is about **A$80,551**, and the payback on the A$35,200 build is about **5.2 months**.

The headline result is close to the estimate, but the detail matters more. The checking time was underestimated because checkers, rightly, compared each drawing with the rule table rather than skimming it. The upkeep was underestimated because the first CAD upgrade took longer than expected. Both lessons went into the office's estimating rules for the next tool, the guard-panel configurator from Chapter 1's exercise: allow 0.15 hours for checking rather than 0.1, and allow 20% upkeep in the first year.

Rework fell too. In the six months after the boundary tests of Chapter 3 were added, one generated variant needed rework, about 6 hours, against an expected **0.04 × 234 × 6 ≈ 56** hours at the manual error rate for the same 234 requests.

## Read the log for what to improve

The generation log records every request, refusal and failure. After six months it held **234** requests: about **60%** reused an existing variant and about **40%** generated a new one. Three patterns in it shaped the next releases.

**Refusals by rule.** Seventeen requests had been refused for heights above 1,500 mm, from three customers with taller conveyors. That was evidence for a rule review rather than an anecdote. The rule owner checked the bracing and leg rules for heights up to 1,800 mm, and a new rule-table revision extended the validated range, with new boundary tests and flex-test combinations.

**Slow steps.** The timing lines showed that updating drawing views took over half of each generation's time. A change to the master drawing, reducing the number of views updated per generation, cut the average generation time from about 41 seconds to about 30.

**Failures by cause.** Most failures were refusals to start because a master file was checked out by someone editing it. A short note in the release process, that masters are edited only in a scheduled window, removed most of them.

```figure
type: stats
title: Six months of the trestle configurator
caption: This is an illustration from the generation log and timesheets, annualised where stated.
- 234 | Requests | about 39 a month
- 60% | Reused | an existing variant under the current rules
- 17 | Refused over 1,500 mm | evidence for a rule review
- *5.2 months | Payback | measured, against 5.4 estimated
- 68 h | Upkeep a year | against 48 h allowed
```

## Support that people actually use

Users need to know whom to ask, and the maintainer needs questions to arrive in a form they can act on. The office set up three simple arrangements:

- a named first contact for the tool, the senior designer, with the maintainer as second;
- a shared request list for faults, questions and ideas, each with the log reference from the tool's message, so that the maintainer can find the run in question without asking the user to remember it;
- a fortnightly fifteen-minute review of the list by the maintainer and the rule owner, deciding what goes into the next release, what becomes a rule-table change and what is declined, with a reason.

The review also catches ideas worth deferring. Several requests in the first six months were for one-off features for a single customer, which the rule owner declined or handled as one-off designs. The specification's list of deferred ideas from Chapter 5 became the tool's long-term wish list.

## Train every new user the same way

A tool used by four people still gets new users: a new designer, a contractor on a busy month, a checker from another team. Each needs to learn not just which buttons to press but what the tool is responsible for and what remains theirs.

The office's induction takes about an hour. The new user generates three variants with an experienced designer watching: one that already exists, one new, and one that is refused, so that they see every path. They read the one-page quick reference, which explains the inputs, what the tool decides and why there is no bracing tick-box, how to read a refusal and where to raise a request. Then they check a generated drawing against the rule table, which teaches them what the independent check is looking for.

The induction includes one point that matters more than any button: the tool does not remove the designer's or checker's responsibility. It applies rules that people wrote and approved. If something on a generated drawing looks wrong, the designer stops and asks, exactly as they would with a hand-made drawing. That message is repeated because confident-looking output invites people to stop questioning.

## Keep the rules in step with the product

The product changes over time: a new idler supplier, a customer's new anchor pattern, a workshop jig that adjusts in different steps. If the rule table does not change with it, the tool will drift away from what the office actually builds, and designers will start working around it.

The rule owner reviews the table once a year with the workshop supervisor and a senior designer, walking through each rule and asking whether its reason still holds. The review uses the log's refusal counts, the request list and any rework records. In the first annual review, two rules were tightened, one range was extended (the heights above 1,500 mm described earlier) and one rule was retired because a foot style had not been ordered in two years. Each change went through the process in Chapter 3, with boundary tests updated first.

## Calibrate the next estimate

The measured results were used for more than judging this tool. They became the office's own estimating data for the next one. The office now estimates checking time on generated drawings at 0.15 hours rather than 0.1, first-year upkeep at 20% of build cost rather than 15%, and testing at about a sixth of the build hours. The guard-panel configurator's business case, rewritten with those figures, still paid back, in about 17 months rather than 16. The office approved it knowing the estimate rested on its own experience rather than a guess.

## Remove the dependence on one person

The largest risk to an in-house tool is that one person understands it. The office measured its exposure plainly. At go-live, one designer could change the rules library, build the installer, run the tests and release a version. If that person was away, nobody could.

```figure
type: checklist
title: Can someone else keep the tool alive?
caption: This is an illustration of the office's handover test, rehearsed once a year by the second maintainer without help from the first.
- Source code, rule table, master models and tests in the office's version control | no files on personal drives
- Written build instructions that work on a clean machine | tested by building from scratch
- Second maintainer able to run the tests, change a rule and release a patch | rehearsed annually
- Specification, rule table with reasons and release notes kept with the code | the tool's documentation
- Support arrangement with the original contract developer for the add-in interface | hours agreed in advance
- x Build tools, certificates or licences held in one person's name | move to the office's accounts
```

The second maintainer was a junior designer with an interest in programming, given about two hours a fortnight for six months to learn the tool alongside the first maintainer. The annual rehearsal asks them to take a small real change, a reworded message or a rule boundary, through the whole process alone: change, test, build, sign, release and roll out.

## A failure case: the upgrade that waited three weeks

This is an illustration. Before the second maintainer existed, the office's annual CAD upgrade fell during the first maintainer's four weeks of leave. The pre-release testing in Chapter 7 had been done, and a new tool version was needed for the new release, with the bounding-box fix described there.

Nobody else could build it. The build instructions referred to a folder on the maintainer's own computer, the code-signing certificate was installed only on that computer, and the developer tools' licence was in the maintainer's personal account. The office delayed its upgrade by three weeks, which meant two designers who had already been upgraded for a customer project had to be rolled back and work on the old release.

The detection was immediate, at the moment someone tried, which is the worst time to find it. The corrections were those in the checklist above. Build instructions were rewritten and tested on a clean machine, the certificate moved to the office's managed store on the build machine, the developer tools moved to an office licence, and the second maintainer was appointed. The next upgrade was run by the second maintainer while the first watched and said nothing, which was the real test.

## Extend, rebuild or retire

Every tool reaches decisions about its future. The office set three triggers to review the configurator's future, rather than letting it drift:

- **Extend** when the log shows repeated demand outside the current rules, as the heights above 1,500 mm did, and the rule owner can validate the extension.
- **Rebuild** when the upkeep consistently exceeds about a third of the annual saving, or when a CAD platform change means the generator would need rewriting anyway. At that point, the rule table, tests and specification carry over, and only the generator is replaced.
- **Retire** when the product range is discontinued or the volume falls so far that a well-built master model, the level below on Chapter 2's ladder, would serve. Retiring means recording the final versions, archiving the code and tests with the product records and removing the tool from the seats cleanly.

Separating the rules, tests and specification from the code is what makes a rebuild affordable. The engineering knowledge survives the software. A rebuilt generator can be judged by running the existing reference set against it: when it reproduces the approved outputs for every combination, it is ready, whatever language or CAD interface it is written in.

## How this applies to a small Australian business

The business case for automation in a small office is usually strong, and the support case is usually weak. Measure the tool after six months against its estimate, publish the result to the people who use it and use the log to decide what to improve. Name a second maintainer from the start, even if they only spend an hour a week on it, and keep every account, certificate and build tool in the business's name rather than an individual's. If the business is sold or restructured, the tool, its rules and its tests are business assets with real value, and a buyer's due diligence will ask who can maintain them. The broader view of when automation pays and how to keep it maintainable is in [Automating CAD with macros and APIs](/reados/collections/cad-modelling-and-design-intent/automating-cad-with-macros-and-apis/). This book has shown how one office took that decision all the way through, and what it took to keep the tool alive.

## Exercise: the tool in its third year

In its third year, the trestle volume falls to **20** variants a month because a large customer builds its own trestles. Time per variant stays at 0.42 hours against 2.4 by hand, and upkeep rises to **90** hours a year at A$110 because of a major CAD release. Using A$95 an hour, what is the net annual saving, and how does upkeep compare with the rebuild trigger of a third of the annual saving? What would you recommend?

**Worked answer.** Annual saving: **20 × 12 × 1.98 × 95 ≈ A$45,144**. Upkeep: **90 × 110 = A$9,900**, so the net saving is about **A$35,244**. A third of the annual saving is about **A$15,048**, and upkeep at A$9,900 is well below it. The tool is still clearly worth keeping. The recommendation is to keep it, look at the log for whether the lower volume changes which variants are requested, and review the upkeep after the major release settles. A volume drop alone does not justify retirement while the net saving remains this large.
