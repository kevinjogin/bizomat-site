// MAKEOS methods, input sources and limits for the project, business, operations, maintenance, quality and machining tools (batch handbook73).
window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
  "earned-value-check": {
    "purpose": "Earned value status of a project at a reporting date: cost and schedule variances, the cost and schedule performance indices, two estimates at completion (current cost efficiency continuing, and cost and schedule efficiency together), the estimate to complete, the variance at completion, the to-complete performance index needed to finish within budget, the per cent complete and a simple forecast duration, against the lowest indices and highest TCPI you accept.",
    "uses": [
      "Report the status of a capital or plant project each month",
      "Forecast the final cost of a fabrication contract",
      "Decide whether a project needs a recovery plan"
    ],
    "users": [
      "Project managers",
      "Project controllers and cost engineers",
      "Engineering managers"
    ],
    "inputs": {
      "BAC": "Total approved budget for the work, on one GST basis (normally ex GST).",
      "PV": "Budgeted cost of the work scheduled to be done by the reporting date, from the baseline schedule.",
      "EV": "Budgeted cost of the work actually done by the reporting date.",
      "AC": "Actual cost recorded for the work done, from the cost ledger.",
      "dur": "Planned duration of the whole project.",
      "cpiMin": "Lowest cost performance index your organisation accepts before acting.",
      "spiMin": "Lowest schedule performance index accepted.",
      "tcpiMax": "Highest to-complete performance index you consider achievable."
    },
    "outputs": [
      "Cost and schedule variance",
      "CPI and SPI",
      "Estimates at completion and to complete, variance at completion",
      "TCPI and forecast duration"
    ],
    "method": [
      "Cost variance CV = EV − AC; schedule variance SV = EV − PV; CPI = EV ÷ AC; SPI = EV ÷ PV.",
      "EAC (cost efficiency continues) = BAC ÷ CPI; EAC (cost and schedule) = AC + (BAC − EV) ÷ (CPI × SPI); ETC = EAC − AC; VAC = BAC − EAC.",
      "TCPI = (BAC − EV) ÷ (BAC − AC), the cost efficiency the remaining work needs to finish on budget; forecast duration ≈ planned duration ÷ SPI.",
      "Example: CPI 0.975 and SPI 0.975; the project is forecast to cost A$512,820, needing a TCPI of 1.0167."
    ],
    "limitations": [
      "The indices are only as good as the earned value measurement: percent-complete claims without objective milestones overstate progress.",
      "SPI in cost terms drifts back to 1 near the end of every project, so the forecast duration is unreliable late in the job.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A TCPI well above the CPI achieved so far means finishing on budget needs a level of efficiency the project has not shown: re-forecast rather than hope."
    ],
    "refs": [
      "U.S. Government Accountability Office, GAO-20-195G Cost Estimating and Assessment Guide (2020), chapters 17–19 on earned value management — https://www.gao.gov/products/gao-20-195g",
      "AS 4817-2006, Project performance measurement using Earned Value (Standards Australia); named for scope only."
    ]
  },
  "pert-schedule-check": {
    "purpose": "PERT analysis of up to five activities in sequence on a critical path: the expected duration and variance of each activity from its three-point estimate, the expected path duration and standard deviation, the probability of finishing by the deadline from the normal distribution, and the duration to promise at the confidence you require, against that confidence.",
    "uses": [
      "Set a realistic delivery date for a machine build",
      "Check the chance of meeting a shutdown window",
      "Decide how much schedule buffer to hold"
    ],
    "users": [
      "Project managers",
      "Planners and schedulers",
      "Engineering managers"
    ],
    "inputs": {
      "dl": "Working days from the start to the deadline or shutdown end.",
      "conf": "Probability of finishing on time that you need to be able to promise.",
      "a1": "Shortest realistic duration of activity 1 if everything goes well.",
      "m1": "Most likely duration of activity 1.",
      "b1": "Longest realistic duration of activity 1 if things go badly (not a disaster case).",
      "a2": "Shortest realistic duration of activity 2 if everything goes well.",
      "m2": "Most likely duration of activity 2.",
      "b2": "Longest realistic duration of activity 2 if things go badly (not a disaster case).",
      "a3": "Shortest realistic duration of activity 3 if everything goes well.",
      "m3": "Most likely duration of activity 3.",
      "b3": "Longest realistic duration of activity 3 if things go badly (not a disaster case).",
      "a4": "Shortest realistic duration of activity 4 if everything goes well.",
      "m4": "Most likely duration of activity 4.",
      "b4": "Longest realistic duration of activity 4 if things go badly (not a disaster case).",
      "a5": "Shortest realistic duration of activity 5 if everything goes well.",
      "m5": "Most likely duration of activity 5.",
      "b5": "Longest realistic duration of activity 5 if things go badly (not a disaster case)."
    },
    "outputs": [
      "Expected duration and variance of each activity",
      "Expected path duration and standard deviation",
      "Probability of meeting the deadline",
      "Duration to promise at your confidence"
    ],
    "method": [
      "Each activity: expected duration t_e = (a + 4m + b) ÷ 6 and variance σ² = ((b − a) ÷ 6)² (PERT, Malcolm et al. 1959).",
      "Path: T = Σ t_e and σ_T = √(Σ σ²), activities treated as independent.",
      "Probability of finishing by the deadline = Φ((deadline − T) ÷ σ_T); duration at confidence c = T + z_c σ_T, with the normal distribution.",
      "Example: expected 36.333 days (σ 2.8771); a 89.874 % chance of finishing within 40 days."
    ],
    "limitations": [
      "Covers one path: a near-critical parallel path can finish later and makes the real chance of meeting the deadline lower (merge bias); check every path that could become critical.",
      "Assumes independent activities and a normal path total; common causes (weather, one supplier) make delays move together and widen the real spread.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Each activity’s spread adds as variance, so one activity with a long pessimistic tail can dominate the path’s uncertainty: tighten that estimate first."
    ],
    "refs": [
      "Malcolm D. G., Roseboom J. H., Clark C. E. and Fazar W., Application of a Technique for Research and Development Program Evaluation, Operations Research 7 (5), 646–669 (1959).",
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 128–133. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "early-payment-discount-check": {
    "purpose": "Cost of a supplier’s early payment discount (for example 2/10 net 30): the rate earned per period by paying early, the nominal and effective annual rates over the days gained by waiting (nominal and effective interest, as the interest factors tool), the saving on this invoice, and the decision against your cost of funds.",
    "uses": [
      "Decide whether to pay a supplier early for the discount",
      "Price an early payment discount to offer customers",
      "Compare trade credit with an overdraft"
    ],
    "users": [
      "Business owners and finance staff",
      "Purchasing officers",
      "Engineering managers running budgets"
    ],
    "inputs": {
      "inv": "Invoice total the discount applies to (on a GST-inclusive invoice the discount usually reduces the GST too).",
      "d": "Discount offered for early payment.",
      "nd": "Days from the invoice date within which the discount can be taken.",
      "N": "Days from the invoice date until the full amount is due.",
      "i": "Interest rate you pay to borrow, or earn on spare cash, per year."
    },
    "outputs": [
      "Rate per period from paying early",
      "Nominal and effective annual rates",
      "Saving on this invoice",
      "Take the discount or pay net"
    ],
    "method": [
      "Paying early saves d on a payment of (1 − d), a return r = d ÷ (1 − d) for paying (N − n) days sooner.",
      "Periods per year m = 365 ÷ (N − n); nominal annual rate = r m; effective annual rate = (1 + r)^m − 1 (nominal and effective interest).",
      "Take the discount if the effective rate exceeds your cost of funds; saving = invoice × d.",
      "Example: giving up the discount costs 44.585 % a year (effective); the discount saves A$220."
    ],
    "limitations": [
      "Assumes you would otherwise pay exactly on the due date; paying late carries its own costs and harms supply.",
      "A 365-day year and compounding at the payment interval; cash-flow limits, not just rates, may decide.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Short discount windows make even small discounts expensive to forgo: 2 % for paying 20 days early is worth more than 40 % a year."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 134–136. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "economic-production-quantity": {
    "purpose": "Economic production quantity for a part made at a finite rate while demand continues: daily demand, the batch size with the lowest yearly set-up and holding cost (the economic order quantity adjusted for stock building only at the production rate less the demand rate), run length, cycle length, peak stock, runs per year and production days used, and the yearly cost of your current batch size against the optimum, against the extra cost you accept.",
    "uses": [
      "Set the batch size for a part made on a shared machine",
      "Show the cost of over-large batches",
      "Check how much machine time a part takes each year"
    ],
    "users": [
      "Production planners",
      "Operations managers",
      "Business owners of small manufacturers"
    ],
    "inputs": {
      "D": "Units used or sold per year.",
      "p": "Units the process makes per working day while it is running this part.",
      "wd": "Days a year the plant works.",
      "S": "Cost of one changeover: set-up labour, scrap, first-off inspection and lost output where the machine is a bottleneck.",
      "Hc": "Cost of holding one unit for a year: capital, storage, handling, obsolescence (often a share of unit cost).",
      "Qnow": "Batch size you make now.",
      "tol": "How far above the lowest cost you are prepared to run."
    },
    "outputs": [
      "Economic production quantity",
      "Run length, cycle length, peak stock and runs per year",
      "Production days used per year",
      "Yearly cost of the current batch against the optimum"
    ],
    "method": [
      "Daily demand d = D ÷ working days; production must exceed demand (p > d).",
      "Yearly cost C(Q) = D S ÷ Q + H Q (1 − d ÷ p) ÷ 2; minimum at Q* = √[2 D S ÷ (H (1 − d ÷ p))] (finite replenishment rate, Silver, Pyke and Thomas).",
      "Run length Q ÷ p; cycle Q ÷ d; peak stock Q (1 − d ÷ p); runs per year D ÷ Q; production days D ÷ p.",
      "Example: the best batch is 3,394.1 units; batches of 5000 cost 7.5981 % more a year."
    ],
    "limitations": [
      "Steady demand, a fixed production rate and set-up cost; shared capacity, minimum batch sizes and shelf life can override the optimum.",
      "The cost curve is flat near the optimum, so a convenient batch close to Q* costs little more.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the set-up cost cuts the economic batch by about 30 %: set-up reduction is the lever, not batch size alone."
    ],
    "refs": [
      "Silver E. A., Pyke D. F. and Thomas D. J., Inventory and Production Management in Supply Chains (CRC Press): finite replenishment rate (economic production quantity)."
    ]
  },
  "wip-lead-time-check": {
    "purpose": "Lead time through a production area or office process by Little’s law: average lead time from work in progress and throughput, in days and working hours, flow efficiency (value-added time as a share of lead time), and the work-in-progress limit that gives your target lead time at the same throughput, against that target.",
    "uses": [
      "Find why a job shop’s lead times are long",
      "Set a WIP cap to hit a quoted delivery time",
      "Show how much of a lead time is waiting"
    ],
    "users": [
      "Operations and production managers",
      "Lean and continuous improvement staff",
      "Business owners"
    ],
    "inputs": {
      "wip": "Units (or jobs) started but not finished, counted across the whole area.",
      "thr": "Average units finished per working day over the same period.",
      "va": "Total hands-on processing time a unit actually receives.",
      "hpd": "Hours the area works per day.",
      "target": "Lead time you want to quote or achieve."
    },
    "outputs": [
      "Average lead time in days and working hours",
      "Flow efficiency",
      "WIP limit for the target lead time"
    ],
    "method": [
      "Little’s law: average lead time = work in progress ÷ throughput (Little 1961), in working days.",
      "Flow efficiency = value-added time ÷ (lead time × working hours per day).",
      "WIP limit for a target = target lead time × throughput; reduction needed = WIP − limit.",
      "Example: lead time 5 days with 0.9375 % flow efficiency; a WIP of 720 meets 6 days."
    ],
    "limitations": [
      "Long-run averages for a stable system: WIP and throughput must be measured over the same period, and a growing backlog breaks the law’s assumptions.",
      "Average lead time only; individual jobs vary, so quoted lead times need a margin above the average.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "At a fixed throughput, lead time falls in direct proportion to WIP: releasing less work is usually the quickest way to shorten lead times."
    ],
    "refs": [
      "Little J. D. C., A Proof for the Queuing Formula: L = λW, Operations Research 9 (3), 383–387 (1961).",
      "Roser C., How Many Kanbans? – The Kanban Formula, Part 1, AllAboutLean (2014), Little’s law for lead time — https://www.allaboutlean.com/kanban-formula-part1/"
    ]
  },
  "critical-spares-poisson-plan": {
    "purpose": "Spares holding for parts that fail at a constant rate (random failures, such as electronic boards, drives, seals or repairable units): the expected failures across the installed parts during the resupply or repair lead time from the MTBF and running hours, the smallest number of spares whose Poisson probability of covering all failures in that time reaches your service level, and the cover the spares held give, against your service level.",
    "uses": [
      "Set stock levels for critical drives, boards or valves",
      "Decide how many repairable units to keep in the loop",
      "Show the cost of long supplier lead times in spares"
    ],
    "users": [
      "Maintenance planners",
      "Reliability engineers",
      "Stores and purchasing staff"
    ],
    "inputs": {
      "Nu": "Number of identical parts in service that the spares cover.",
      "mtbf": "Mean running time between failures of one part, from your maintenance records or the maker’s data.",
      "hpd": "Hours a day each part runs.",
      "lead": "Calendar days to get a replacement or repair back (order, transit and repair).",
      "tgt": "Probability that the spares cover every failure while waiting for resupply.",
      "held": "Good spares in stock now."
    },
    "outputs": [
      "Failure rate and expected failures in the lead time",
      "Spares needed for the service level",
      "Cover given by the spares held"
    ],
    "method": [
      "Failures in the lead time are taken as Poisson with mean λ = parts × running hours per day × lead time ÷ MTBF (constant failure rate).",
      "P(X ≤ s) = Σ e^(−λ) λ^k ÷ k! for k = 0 … s (NIST Poisson distribution).",
      "Spares needed = smallest s with P(X ≤ s) ≥ the service level; cover of the spares held = P(X ≤ held).",
      "Example: 1.08 failures expected in 45 days; 3 spares give 95 % cover."
    ],
    "limitations": [
      "Constant failure rate: parts that wear out (bearings, belts, tools) fail more as they age; use a Weibull model such as the bearing fleet spares plan for those.",
      "Each failure uses one spare and every spare is good; repair turnaround is treated as fixed.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "Halving the lead time halves the expected failures while waiting, which often cuts the spares needed more than any other change."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 1.3.6.6.19 Poisson Distribution — https://www.itl.nist.gov/div898/handbook/eda/section3/eda366j.htm",
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 128–133. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "capability-confidence-check": {
    "purpose": "Capability indices with lower confidence bounds: Cp and Cpk from the sample mean, standard deviation and specification limits, the one-sided lower confidence bound on Cp from the chi-square distribution and on Cpk from its normal approximation (NIST e-Handbook), the sample size at which the same Cpk would be proven, against the Cpk you require.",
    "uses": [
      "Judge whether a 30-piece capability study really proves Cpk 1.33",
      "Plan how many parts to measure in a capability study",
      "Compare suppliers’ capability claims fairly"
    ],
    "users": [
      "Quality engineers",
      "Supplier quality staff",
      "Process engineers"
    ],
    "inputs": {
      "n": "Number of parts in the capability study (NIST advises at least 25).",
      "xbar": "Mean of the measurements, in the unit of the specification.",
      "s": "Sample standard deviation of the measurements.",
      "LSL": "Lower specification limit.",
      "USL": "Upper specification limit.",
      "conf": "Confidence you need that the true capability is at least the lower bound.",
      "req": "Capability your customer or quality system requires."
    },
    "outputs": [
      "Cp and Cpk from the sample",
      "Lower confidence bounds on Cp and Cpk",
      "Sample size that would prove the same Cpk"
    ],
    "method": [
      "Cp = (USL − LSL) ÷ 6s; Cpk = min(USL − x̄, x̄ − LSL) ÷ 3s.",
      "Lower bound on Cp = Cp √(χ²_{α, n−1} ÷ (n − 1)), with χ²_{α} the lower α quantile; lower bound on Cpk ≈ Cpk − z_{1−α} √[1 ÷ (9n) + Cpk² ÷ (2(n − 1))] (NIST e-Handbook 6.1.6).",
      "Sample size to prove: the smallest n (from 25, the approximation’s lower limit) for which the Cpk lower bound reaches the requirement at the same Cpk.",
      "Example: Cpk 1.9167 with a 1.5889 lower bound at 95 % confidence."
    ],
    "limitations": [
      "Assumes a stable, normally distributed process; check control charts and normality first, or the indices mean little.",
      "The Cpk bound is an approximation that NIST gives for samples of about 25 or more.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "A small study can show a high Cpk by chance: with 30 parts a sample Cpk of about 1.7 is needed to prove 1.33 at 95 % confidence."
    ],
    "refs": [
      "NIST/SEMATECH e-Handbook of Statistical Methods, 6.1.6 What is Process Capability? (confidence bounds for Cp and Cpk) — https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm",
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 128–133. Topic reference; no source tables or recommended settings are reproduced."
    ]
  },
  "parting-off-plan": {
    "purpose": "Plan for parting off a bar or tube on a lathe at constant cutting speed: starting spindle speed, the diameter at which the spindle reaches its maximum speed, the cutting force from the specific cutting force, blade width and feed (as the turning power tool), cutting and motor power and torque at the start, and the parting time, integrated at constant surface speed out to the speed limit and at the limit speed after that, against the available power and your cycle time.",
    "uses": [
      "Check a parting operation before running a new bar job",
      "Find the parting time for a cycle-time quote",
      "See where the cutting speed starts to fall towards the centre"
    ],
    "users": [
      "CNC programmers",
      "Machinists and setters",
      "Production engineers"
    ],
    "inputs": {
      "D": "Outside diameter of the bar or tube.",
      "di": "Bore of a tube; 0 for solid bar.",
      "w": "Width of the parting blade or insert.",
      "f": "Radial feed per revolution while parting.",
      "Vc": "Programmed constant cutting speed.",
      "nmax": "Spindle speed limit set in the program or the machine’s maximum.",
      "kc": "Specific cutting force for the material at this chip thickness, from the tool maker.",
      "eta": "Efficiency of the spindle drive.",
      "Pav": "Spindle power available at the speeds used.",
      "tMax": "Time the cycle allows for parting."
    },
    "outputs": [
      "Starting speed and the diameter where the speed limit is reached",
      "Cutting force, power and torque at the start",
      "Parting time"
    ],
    "method": [
      "n = 1000 V_c ÷ (π d), limited to n_max; the limit is reached at d_lim = 1000 V_c ÷ (π n_max).",
      "Cutting force F = k_c × width × feed; cutting power = F V_c ÷ 60 000 kW at constant speed; motor power = cutting power ÷ η (as the turning power tool).",
      "Time at constant speed from radius R to r₁ = max(d_lim ÷ 2, bore radius): π (R² − r₁²) ÷ (1000 V_c f) min; then at n_max from r₁ to the bore: (r₁ − r₀) ÷ (f n_max) min.",
      "Example: the spindle reaches 3000 rpm at 15.915 mm diameter; 1.5 kW and 15.132 s to part off."
    ],
    "limitations": [
      "Constant specific cutting force; at the small feeds used near the centre the real specific force rises, and the cutting speed falls to zero on solid bar, which wears the insert edge.",
      "Feed reduction near the centre, chip control and pip removal are not modelled.",
      "Example values are illustrations. Replace them with values for your actual task."
    ],
    "interpret": [
      "On solid bar most of the parting time is spent on the outer diameter at constant speed; raising the spindle limit only speeds up the last few millimetres."
    ],
    "refs": [
      "Machinery’s Handbook, 29th edition (Industrial Press, 2012), printed pp. 1084–1101. Topic reference; no source tables or recommended settings are reproduced."
    ]
  }
});
