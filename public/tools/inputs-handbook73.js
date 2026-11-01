// KEVOS® WORKOS input guides: handbook73. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook73.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  "earned-value-check": {
    BAC: {
      what: "The total approved budget for all the work in the project, the figure every estimate at completion is compared with.",
      tip: "Use the current approved budget including approved changes, on one GST basis throughout.",
      effect: "Estimates at completion rise in proportion; a larger budget also lowers the TCPI.",
      fig: "money",
      sym: "BAC"
    },
    PV: {
      what: "The budgeted cost of the work the baseline schedule says should be done by the reporting date.",
      tip: "Read it from the baseline schedule, not the current forecast schedule.",
      effect: "A higher planned value lowers the SPI and the schedule variance.",
      fig: "money",
      sym: "PV"
    },
    EV: {
      what: "The budgeted cost of the work actually completed by the reporting date, measured against the same budget as the planned value.",
      tip: "Base it on objective progress such as completed milestones or installed quantities, not hours spent.",
      effect: "Raises both CPI and SPI and lowers the estimate at completion.",
      fig: "money",
      sym: "EV"
    },
    AC: {
      what: "The cost actually incurred for the work done by the reporting date, including accrued costs not yet invoiced.",
      tip: "Accrue costs for work done but not yet billed, or the CPI looks better than it is.",
      effect: "A higher actual cost lowers the CPI and raises the estimate at completion and the TCPI.",
      fig: "money",
      sym: "AC"
    },
    dur: {
      what: "The planned length of the whole project in months, from which the simple forecast duration is scaled by the SPI.",
      tip: "Use the baseline duration; it only affects the forecast duration.",
      effect: "The forecast duration rises in proportion.",
      fig: "time"
    },
    cpiMin: {
      what: "The lowest cost performance index you accept before the project needs corrective action.",
      tip: "Set it from your organisation’s reporting rules; this tool does not set a value.",
      effect: "Only moves the pass or fail line for the CPI.",
      fig: "ratio"
    },
    spiMin: {
      what: "The lowest schedule performance index you accept before the schedule needs corrective action.",
      tip: "Set it from your reporting rules; SPI drifts towards 1 near the end of every project.",
      effect: "Only moves the pass or fail line for the SPI.",
      fig: "ratio"
    },
    tcpiMax: {
      what: "The highest to-complete performance index you believe the remaining work can achieve, used to judge whether finishing on budget is realistic.",
      tip: "Compare it with the CPI the project has actually achieved; a TCPI far above it is wishful.",
      effect: "Only moves the pass or fail line for the TCPI.",
      fig: "ratio"
    }
  },
  "pert-schedule-check": {
    a1: {
      what: "The shortest time activity 1 on the critical path could realistically take if everything goes well, the optimistic end of its three-point estimate.",
      tip: "Ask the people doing activity 1; an optimistic value that could never happen narrows the spread falsely.",
      effect: "Lowers the expected duration slightly and, by widening the range to the pessimistic value, raises the variance.",
      fig: "time",
      sym: "a1"
    },
    m1: {
      what: "The duration of activity 1 that is most likely to happen, the peak of its three-point estimate, weighted four times in the expected value.",
      tip: "It must lie between the optimistic and pessimistic values for activity 1.",
      effect: "Moves the expected duration by two-thirds of any change; it does not change the variance.",
      fig: "time",
      sym: "m1"
    },
    b1: {
      what: "The longest time activity 1 could realistically take if things go badly, short of a disaster, the pessimistic end of its three-point estimate.",
      tip: "Use a credible bad case for activity 1; enter 0 for all three values of activity 5 to leave it out.",
      effect: "Raises the expected duration and, with the square of the range, the variance of the path.",
      fig: "time",
      sym: "b1"
    },
    a2: {
      what: "The shortest time activity 2 on the critical path could realistically take if everything goes well, the optimistic end of its three-point estimate.",
      tip: "Ask the people doing activity 2; an optimistic value that could never happen narrows the spread falsely.",
      effect: "Lowers the expected duration slightly and, by widening the range to the pessimistic value, raises the variance.",
      fig: "time",
      sym: "a2"
    },
    m2: {
      what: "The duration of activity 2 that is most likely to happen, the peak of its three-point estimate, weighted four times in the expected value.",
      tip: "It must lie between the optimistic and pessimistic values for activity 2.",
      effect: "Moves the expected duration by two-thirds of any change; it does not change the variance.",
      fig: "time",
      sym: "m2"
    },
    b2: {
      what: "The longest time activity 2 could realistically take if things go badly, short of a disaster, the pessimistic end of its three-point estimate.",
      tip: "Use a credible bad case for activity 2; enter 0 for all three values of activity 5 to leave it out.",
      effect: "Raises the expected duration and, with the square of the range, the variance of the path.",
      fig: "time",
      sym: "b2"
    },
    a3: {
      what: "The shortest time activity 3 on the critical path could realistically take if everything goes well, the optimistic end of its three-point estimate.",
      tip: "Ask the people doing activity 3; an optimistic value that could never happen narrows the spread falsely.",
      effect: "Lowers the expected duration slightly and, by widening the range to the pessimistic value, raises the variance.",
      fig: "time",
      sym: "a3"
    },
    m3: {
      what: "The duration of activity 3 that is most likely to happen, the peak of its three-point estimate, weighted four times in the expected value.",
      tip: "It must lie between the optimistic and pessimistic values for activity 3.",
      effect: "Moves the expected duration by two-thirds of any change; it does not change the variance.",
      fig: "time",
      sym: "m3"
    },
    b3: {
      what: "The longest time activity 3 could realistically take if things go badly, short of a disaster, the pessimistic end of its three-point estimate.",
      tip: "Use a credible bad case for activity 3; enter 0 for all three values of activity 5 to leave it out.",
      effect: "Raises the expected duration and, with the square of the range, the variance of the path.",
      fig: "time",
      sym: "b3"
    },
    a4: {
      what: "The shortest time activity 4 on the critical path could realistically take if everything goes well, the optimistic end of its three-point estimate.",
      tip: "Ask the people doing activity 4; an optimistic value that could never happen narrows the spread falsely.",
      effect: "Lowers the expected duration slightly and, by widening the range to the pessimistic value, raises the variance.",
      fig: "time",
      sym: "a4"
    },
    m4: {
      what: "The duration of activity 4 that is most likely to happen, the peak of its three-point estimate, weighted four times in the expected value.",
      tip: "It must lie between the optimistic and pessimistic values for activity 4.",
      effect: "Moves the expected duration by two-thirds of any change; it does not change the variance.",
      fig: "time",
      sym: "m4"
    },
    b4: {
      what: "The longest time activity 4 could realistically take if things go badly, short of a disaster, the pessimistic end of its three-point estimate.",
      tip: "Use a credible bad case for activity 4; enter 0 for all three values of activity 5 to leave it out.",
      effect: "Raises the expected duration and, with the square of the range, the variance of the path.",
      fig: "time",
      sym: "b4"
    },
    a5: {
      what: "The shortest time activity 5 on the critical path could realistically take if everything goes well, the optimistic end of its three-point estimate.",
      tip: "Ask the people doing activity 5; an optimistic value that could never happen narrows the spread falsely.",
      effect: "Lowers the expected duration slightly and, by widening the range to the pessimistic value, raises the variance.",
      fig: "time",
      sym: "a5"
    },
    m5: {
      what: "The duration of activity 5 that is most likely to happen, the peak of its three-point estimate, weighted four times in the expected value.",
      tip: "It must lie between the optimistic and pessimistic values for activity 5.",
      effect: "Moves the expected duration by two-thirds of any change; it does not change the variance.",
      fig: "time",
      sym: "m5"
    },
    b5: {
      what: "The longest time activity 5 could realistically take if things go badly, short of a disaster, the pessimistic end of its three-point estimate.",
      tip: "Use a credible bad case for activity 5; enter 0 for all three values of activity 5 to leave it out.",
      effect: "Raises the expected duration and, with the square of the range, the variance of the path.",
      fig: "time",
      sym: "b5"
    },
    dl: {
      what: "The number of working days from the start of the path to the deadline, such as the end of a shutdown or a delivery date.",
      tip: "Count in the same day units as the activity estimates, working days or calendar days.",
      effect: "A later deadline raises the chance of finishing on time.",
      fig: "time"
    },
    conf: {
      what: "The probability of finishing on time that you need before promising a date, used to find the duration to promise.",
      tip: "Higher confidence needs a longer promise; 50 % is simply the expected duration.",
      effect: "Raises the duration to promise and the bar the deadline must clear.",
      fig: "percent"
    }
  },
  "early-payment-discount-check": {
    inv: {
      what: "The amount on the supplier’s invoice to which the early payment discount applies, used to show the saving in dollars.",
      tip: "On a GST-inclusive invoice the discount usually reduces the GST as well; check the supplier’s terms.",
      effect: "The saving rises in proportion; the implied interest rate does not change.",
      fig: "money"
    },
    d: {
      what: "The percentage the supplier takes off the invoice if it is paid within the discount period, such as 2 in “2/10 net 30”.",
      tip: "Enter the discount as a percentage, 2 for 2 %, not 0.02.",
      effect: "A larger discount raises the implied interest rate of paying late steeply.",
      fig: "percent",
      sym: "d"
    },
    nd: {
      what: "The number of days from the invoice date within which payment earns the discount, such as 10 in “2/10 net 30”.",
      tip: "Count from the invoice date unless the terms say from the end of the month.",
      effect: "A longer discount window shortens the days gained by waiting, raising the implied rate.",
      fig: "time",
      sym: "n"
    },
    N: {
      what: "The number of days from the invoice date until the full amount is due, such as 30 in “2/10 net 30”.",
      tip: "For “30 days end of month” terms, convert to an average number of days from the invoice date.",
      effect: "A later due date spreads the discount over more days, lowering the implied rate.",
      fig: "time",
      sym: "N"
    },
    i: {
      what: "The yearly interest rate you pay to borrow, or earn on spare cash, which the cost of giving up the discount is compared with.",
      tip: "Use the rate on the money you would actually use, such as the overdraft rate.",
      effect: "Only moves the take-or-pay-net decision; the implied rate does not change.",
      fig: "percent",
      sym: "i"
    }
  },
  "economic-production-quantity": {
    D: {
      what: "The number of units used or sold each year, which sets how often batches must be made.",
      tip: "Use a forecast for the coming year; seasonal demand may need different batch sizes in different seasons.",
      effect: "The economic batch rises with the square root of demand.",
      fig: "count",
      sym: "D"
    },
    p: {
      what: "The number of units the process makes per working day while it is running this part, which must exceed the daily demand.",
      tip: "Use the real output rate after scrap and minor stops, not the nameplate rate.",
      effect: "A faster rate builds stock faster, lowering the economic batch towards the plain EOQ.",
      fig: "rate",
      sym: "p"
    },
    wd: {
      what: "The number of days a year the plant works, used to turn annual demand into a daily demand rate.",
      tip: "Use working days, matching the production rate, which is per working day.",
      effect: "More working days lower the daily demand, slightly lowering the economic batch.",
      fig: "time"
    },
    S: {
      what: "The cost of one changeover to this part: set-up labour, trial parts, scrap, first-off inspection and lost output if the machine is a bottleneck.",
      tip: "Include lost output only where the machine is the constraint; elsewhere set-up time costs only labour.",
      effect: "The economic batch rises with the square root of the set-up cost.",
      fig: "money",
      sym: "S"
    },
    Hc: {
      what: "The cost of keeping one unit in stock for a year: the capital tied up, storage, handling, insurance and the risk of obsolescence.",
      tip: "Often taken as a share of the unit cost per year; use the rate your finance team uses.",
      effect: "A higher holding cost lowers the economic batch with its square root.",
      fig: "money",
      sym: "H"
    },
    Qnow: {
      what: "The batch size currently made, whose yearly set-up and holding cost is compared with the optimum.",
      tip: "Use the batch actually run, not the order quantity on the system if they differ.",
      effect: "Only changes the current cost and the extra cost over the optimum.",
      fig: "count",
      sym: "Q"
    },
    tol: {
      what: "How far above the lowest possible yearly cost you are prepared to run before changing the batch size.",
      tip: "The cost curve is flat near the optimum, so a modest allowance lets you choose a convenient batch.",
      effect: "Only moves the pass or fail line.",
      fig: "percent"
    }
  },
  "wip-lead-time-check": {
    wip: {
      what: "The number of units or jobs started but not yet finished anywhere in the area being studied, including those waiting between steps.",
      tip: "Count everything inside the boundary at one time, including work queued at each machine.",
      effect: "Lead time rises in proportion to the work in progress.",
      fig: "count",
      sym: "L"
    },
    thr: {
      what: "The average number of units or jobs completed per working day, measured over the same period as the work in progress.",
      tip: "Use a long enough period, several weeks, to smooth out daily swings.",
      effect: "Higher throughput shortens the lead time and raises the WIP limit for the target.",
      fig: "rate",
      sym: "λ"
    },
    va: {
      what: "The total hands-on processing time a unit actually receives on its way through, the part of its lead time that adds value.",
      tip: "Add the machining, assembly and test times only; waiting, moving and storage are not value-added.",
      effect: "Flow efficiency rises in proportion; the lead time does not change.",
      fig: "time"
    },
    hpd: {
      what: "The number of hours the area works each day, used to express lead time in working hours and to find flow efficiency.",
      tip: "For two eight-hour shifts enter 16.",
      effect: "More hours per day raise the lead time in hours and lower the flow efficiency.",
      fig: "time"
    },
    target: {
      what: "The average lead time you want to achieve or quote, compared with the calculated lead time.",
      tip: "Quote customers more than the average, because individual jobs vary around it.",
      effect: "Only moves the pass or fail line and the WIP limit.",
      fig: "time"
    }
  },
  "critical-spares-poisson-plan": {
    Nu: {
      what: "The number of identical parts in service that the spares on the shelf must cover, such as the same drive on several machines.",
      tip: "Count only parts that can take the same spare; different revisions need separate plans.",
      effect: "Expected failures, and the spares needed, rise with the number installed.",
      fig: "count",
      sym: "N"
    },
    mtbf: {
      what: "The average running time between failures of one part, the reciprocal of its constant failure rate.",
      tip: "Work it out from your own failure records where possible; maker MTBF figures are often optimistic.",
      effect: "A longer MTBF lowers the expected failures and the spares needed.",
      fig: "time",
      sym: "MTBF"
    },
    hpd: {
      what: "The number of hours each part runs per day, which turns the lead time into running hours.",
      tip: "Use running hours, not the hours the plant is staffed.",
      effect: "More running hours raise the expected failures during the lead time.",
      fig: "time"
    },
    lead: {
      what: "The calendar days from a failure until a replacement or repaired part is back on the shelf: ordering, transit and repair.",
      tip: "Use the realistic worst lead time, including import delays and repair queues.",
      effect: "Expected failures, and usually the spares needed, rise in proportion.",
      fig: "time"
    },
    tgt: {
      what: "The probability that the spares on hand cover every failure while waiting for resupply, the service level the stock is sized to.",
      tip: "Choose a high level for parts whose failure stops production; each extra few per cent costs more spares.",
      effect: "A higher service level raises the spares needed.",
      fig: "percent"
    },
    held: {
      what: "The number of good spares in stock now, compared with the number needed.",
      tip: "Count only tested, ready-to-fit spares; a unit waiting for repair is not a spare.",
      effect: "Only moves the pass or fail line and the cover reported.",
      fig: "count"
    }
  },
  "capability-confidence-check": {
    n: {
      what: "The number of parts measured in the capability study, which sets how confident the study can be about the true capability.",
      tip: "NIST advises at least 25 parts for these bounds; 100 or more for a full capability study.",
      effect: "More parts tighten the confidence bounds towards the sample values.",
      fig: "count",
      sym: "n"
    },
    xbar: {
      what: "The average of the measurements in the study, which sets how well centred the process is between the specification limits.",
      tip: "Use measurements from a stable process; a mean from a drifting process misleads.",
      effect: "Moving it towards either limit lowers Cpk and its bound.",
      fig: "number",
      sym: "x̄"
    },
    s: {
      what: "The sample standard deviation of the measurements, the spread of the process.",
      tip: "Use the overall sample standard deviation of individual parts, dividing by n − 1.",
      effect: "Cp, Cpk and their bounds fall in proportion as the spread rises.",
      fig: "tolerance",
      sym: "s"
    },
    LSL: {
      what: "The lowest acceptable value of the characteristic, the lower end of the tolerance.",
      tip: "Use the drawing limit, not an internal tightened limit, unless that is what you are judging.",
      effect: "Lowering it widens the tolerance and raises the indices.",
      fig: "tolerance",
      sym: "LSL"
    },
    USL: {
      what: "The highest acceptable value of the characteristic, the upper end of the tolerance.",
      tip: "It must be above the lower limit, in the same unit as the measurements.",
      effect: "Raising it widens the tolerance and raises the indices.",
      fig: "tolerance",
      sym: "USL"
    },
    conf: {
      what: "The confidence you need that the true capability is at least the lower bound, as a one-sided level.",
      tip: "95 % is common; 99 % needs larger samples to prove the same capability.",
      effect: "A higher confidence lowers both bounds.",
      fig: "choice"
    },
    req: {
      what: "The capability index your customer or quality system requires, which the lower confidence bound on Cpk must reach.",
      tip: "Take it from the customer requirement or control plan; this tool does not set a value.",
      effect: "Only moves the pass or fail line and the sample size needed.",
      fig: "ratio"
    }
  },
  "parting-off-plan": {
    D: {
      what: "The outside diameter of the bar or tube being parted, where the cut starts at the largest radius.",
      tip: "Use the actual stock diameter, not the finished turned diameter, if parting is the first cut.",
      effect: "A larger bar takes longer to part and needs more starting torque.",
      fig: "diameter",
      sym: "D"
    },
    di: {
      what: "The bore of a tube, which ends the cut before the centre; a solid bar has no bore.",
      tip: "Enter 0 for solid bar; the cut then runs to the centre, where the cutting speed falls to zero.",
      effect: "A larger bore shortens the cut and keeps the cutting speed above zero.",
      fig: "diameter",
      sym: "d_i"
    },
    w: {
      what: "The width of the parting blade or insert, which is the width of the groove and of the chip.",
      tip: "Use the insert’s cutting width; narrower blades waste less material but are less rigid.",
      effect: "Cutting force and power rise in proportion to the width.",
      fig: "thickness",
      sym: "w"
    },
    f: {
      what: "How far the blade advances radially for each revolution of the spindle while parting.",
      tip: "Use the programmed parting feed; it is usually reduced near the centre, which this tool does not model.",
      effect: "Cutting force rises in proportion; parting time falls in proportion.",
      fig: "feed",
      sym: "f"
    },
    Vc: {
      what: "The constant surface speed programmed for parting, held until the spindle reaches its speed limit.",
      tip: "Use the speed recommended for the insert grade and material by the tool maker.",
      effect: "Raises cutting power and shortens the constant-speed part of the cut.",
      fig: "velocity",
      sym: "V_c"
    },
    nmax: {
      what: "The highest spindle speed allowed, set by the program or the machine, which caps the speed as the diameter shrinks.",
      tip: "Include any limit set for the chuck or workholding, not just the machine maximum.",
      effect: "A higher limit lets constant surface speed continue to a smaller diameter, shortening the end of the cut.",
      fig: "rotation",
      sym: "n_max"
    },
    kc: {
      what: "The cutting force per square millimetre of chip cross-section for the material, used with the blade width and feed to find the cutting force.",
      tip: "Take it from the tool maker for the material and the small chip thickness used in parting.",
      effect: "Cutting force, power and torque rise in proportion.",
      fig: "stress",
      sym: "k_c"
    },
    eta: {
      what: "The efficiency of the spindle drive, turning cutting power into the power the spindle motor must supply.",
      tip: "Use the machine maker’s figure; belts and gearboxes lower it.",
      effect: "A lower efficiency raises the motor power needed.",
      fig: "efficiency",
      sym: "η"
    },
    Pav: {
      what: "The spindle power the machine can deliver at the speeds used for parting, compared with the motor power needed.",
      tip: "Use the power at the starting spindle speed from the machine’s power curve, which can be below the rated power.",
      effect: "Only moves the power check; the power needed does not change.",
      fig: "power"
    },
    tMax: {
      what: "The time the cycle allows for the parting operation, compared with the calculated parting time.",
      tip: "Take it from the cycle-time budget or quote for the part.",
      effect: "Only moves the time check; the parting time does not change.",
      fig: "time"
    }
  }
});
