# KEVOS® WORKOS tool register

Completion register for the WORKOS engineering decision tools upgrade. Generated 2026-10-17 from the tool definitions (`public/tools/data-*.js`), guides (`guides-*.js`) and calculations (`calc-*.js`).

## Applied to every tool

- One KEVOS® WORKOS collection: Free/Pro tiers, badges, the "featured" Pro section and tier wording removed. Tool ids and `/tools/?tool=<id>` links unchanged.
- Guide: purpose, typical uses, users, every input with its unit and where to find it, outputs, method and formulas, limitations, interpretation and references (where a reference exists).
- Result: decision, summary, metrics, recommendation, feasibility and verification checks (PASS / REVIEW / FAIL / VERIFY), next actions and verification items; comparison tables, risks and guidance where relevant.
- Sensitivity: every numeric input moved ±10% (within its limits), ranked by influence, with decision-flip detection.
- Reports: self-contained HTML download, print or save as PDF, copy summary, and share link carrying changed inputs.
- Directory cards rendered at build time as links (crawlable), searchable by name, question, keywords, uses and users; category filter.

## Status summary

| Measure | Result |
|---|---|
| Tools | 63 (62 existing + 1 new) |
| Complete guide with a source for every input | 63 / 63 |
| Run cleanly with example inputs (automated) | 63 / 63 |
| Sensitivity analysis with example inputs | 57 / 63 (the rest are rating or select-only tools, or the selector before costs are entered) |
| Hand-calculated or rule tests | 16 tools (see `tests/tools-calculators.test.ts`) |

## Register

### Decide

| Tool | Changes | Checks with example inputs | Analysis | Tested | Status |
|---|---|---|---|---|---|
| **Make or Buy (quick check)** `make-buy` | Renamed from “Make or Buy”; guide, checks, sensitivity, report | Decision robust to volume changes; Internal capacity and capability to make; Supplier quality, lead time and continuity | sensitivity (5) | Automated + hand calc | Complete |
| **Project Gate Review** `project-gate` | Renamed from “ProjectGate”; guide, checks, sensitivity, report | Annual benefit covers initial cost; Resources ready; Risk acceptable; Benefit evidence | sensitivity (2) | Automated + hand calc | Complete |
| **Work Priority Score** `priority` | Renamed from “Priority”; guide, checks, sensitivity, report | Mandatory obligations considered; Effort justified by impact | — | Automated | Complete |
| **Two-Option Comparison** `option-compare` | Renamed from “OptionCompare”; guide, checks, sensitivity, report | Clear preference; Preferred option pays back its cost; Mandatory requirements met by both | table, sensitivity (6) | Automated | Complete |
| **Change Impact Assessment** `change-impact` | Renamed from “ChangeImpact”; guide, checks, sensitivity, report | Benefit exceeds added cost; Schedule impact; Quality and compliance review; Contract and authority to approve | sensitivity (4) | Automated | Complete |
| **Risk Rating (5 × 5 matrix)** `risk-score` | Renamed from “RiskScore”; guide, checks, sensitivity, report | Consequence scale defined; Catastrophic consequence | table | Automated | Complete |
| **Make or Buy (detailed cost comparison)** `make-vs-buy-pro` | Renamed from “Make vs Buy Analyzer”; Pro tier removed; guide, checks, sensitivity, report | Decision robust to volume changes; Fixed costs are avoidable; Landed cost complete; Capacity, quality and supply risk | table, sensitivity (8) | Automated | Complete |

### Money

| Tool | Changes | Checks with example inputs | Analysis | Tested | Status |
|---|---|---|---|---|---|
| **Return on Investment and NPV** `roi` | Renamed from “ROI”; Inputs added: Discount rate (your approved rate); guide, checks, sensitivity, report | Pays back within the evaluation period; Discount rate set; Benefits are cash or capacity you will use | sensitivity (4) | Automated + hand calc | Complete |
| **Break-even and Margin of Safety** `break-even` | Renamed from “BreakEven”; Inputs added: Expected volume / period; guide, checks, sensitivity, report | Positive contribution; Margin of safety; Capacity to reach break-even | sensitivity (4) | Automated + hand calc | Complete |
| **Margin and Markup** `margin` | Renamed from “Margin”; guide, checks, sensitivity, report | Price above cost; Cost is complete | sensitivity (2) | Automated | Complete |
| **True Unit Cost** `true-cost` | Renamed from “TrueCost”; Inputs added: Selling price / unit (optional, 0 = not used); guide, checks, sensitivity, report | Labour rate is fully loaded; Overhead allocation basis | table, sensitivity (5) | Automated | Complete |
| **Investment Hurdle Check** `investment-check` | Renamed from “InvestmentCheck”; guide, checks, sensitivity, report | Payback within limit; Return meets hurdle; Thresholds approved | sensitivity (2) | Automated | Complete |
| **Recurring Savings Check** `savings-check` | Renamed from “SavingsCheck”; guide, checks, sensitivity, report | Pays back within a year; Saving is cash-releasing or capacity used | sensitivity (4) | Automated | Complete |

### Projects

| Tool | Changes | Checks with example inputs | Analysis | Tested | Status |
|---|---|---|---|---|---|
| **Project Health Check** `project-health` | Renamed from “ProjectHealth”; guide, checks, sensitivity, report | Schedule variance; Cost variance; Scope stable; Resources adequate; Variances from controlled data | sensitivity (2) | Automated | Complete |
| **Project Size and Governance** `project-size` | Renamed from “ProjectSize”; guide, checks, sensitivity, report | Scaling thresholds suit your organisation; Complexity drives risk | table, sensitivity (3) | Automated | Complete |
| **Resource Fit** `resource-fit` | Renamed from “ResourceFit”; guide, checks, sensitivity, report | Capacity covers required effort; Available hours are net | sensitivity (3) | Automated | Complete |
| **Schedule Risk Check** `schedule-risk` | Renamed from “ScheduleRisk”; guide, checks, sensitivity, report | Capacity covers remaining work; Planning efficiency realistic; Remaining work estimate current; Task dependencies | sensitivity (5) | Automated | Complete |
| **Contingency Allowance** `contingency` | Renamed from “Contingency”; guide, checks, sensitivity, report | Screening method only; Large or uncertain project; Known risks costed separately | sensitivity (1) | Automated | Complete |
| **Business Case with NPV** `business-case` | Renamed from “BusinessCase”; Inputs added: Discount rate (your approved rate); guide, checks, sensitivity, report | NPV positive at the approved rate; Robust to a 20% benefit shortfall; Delivery risk; Discount rate; Tax, financing and residual value | sensitivity (5) | Automated | Complete |

### Operations

| Tool | Changes | Checks with example inputs | Analysis | Tested | Status |
|---|---|---|---|---|---|
| **Capacity Check** `capacity` | Renamed from “Capacity”; guide, checks, sensitivity, report | Capacity covers demand; Efficiency realistic; Cycle time measured | sensitivity (5) | Automated | Complete |
| **Bottleneck and Line Balance** `bottleneck` | Renamed from “Bottleneck”; guide, checks, sensitivity, report | Constraint meets takt; Line balance; Cycle times include variation | table, sensitivity (3) | Automated | Complete |
| **Takt Time** `takt-time` | Renamed from “TaktTime”; guide, checks, sensitivity, report | Available time is net; Demand matches the same period | sensitivity (2) | Automated + hand calc | Complete |
| **OEE (quick)** `oee` | Renamed from “OEE”; guide, checks, sensitivity, report | Factors measured from production data; Benchmark context | table, sensitivity (3) | Automated + hand calc | Complete |
| **Cycle Time vs Takt** `cycle-time` | Renamed from “CycleTime”; guide, checks, sensitivity, report | Actual cycle within takt; Actual cycle time measured | sensitivity (3) | Automated | Complete |
| **Staffing Need** `staffing-need` | Renamed from “StaffingNeed”; guide, checks, sensitivity, report | Labour minutes are standard times; Coverage for leave and absence; Rounding margin | sensitivity (4) | Automated | Complete |
| **Shift Output** `shift-output` | Renamed from “ShiftOutput”; guide, checks, sensitivity, report | Net time positive; Efficiency realistic | sensitivity (5) | Automated | Complete |
| **OEE and Downtime Analysis** `oee-downtime-pro` | Renamed from “OEE and Downtime Analyser”; Pro tier removed; guide, checks, sensitivity, report | Performance not above 100%; Good units not more than total; Downtime within planned time; Ideal cycle time source | table, sensitivity (4) | Automated + hand calc | Complete |

### Manufacturing

| Tool | Changes | Checks with example inputs | Analysis | Tested | Status |
|---|---|---|---|---|---|
| **Rack and Batch Fit** `batch-fit` | Renamed from “BatchFit”; guide, checks, sensitivity, report | Part fits the rack; Rack load rating; Process access and drainage | table, sensitivity (5) | Automated | Complete |
| **Machine Load** `machine-load` | Renamed from “MachineLoad”; guide, checks, sensitivity, report | Machine time covers demand; Set-up time included | sensitivity (4) | Automated | Complete |
| **Scrap Cost Impact** `scrap-impact` | Renamed from “ScrapImpact”; guide, checks, sensitivity, report | Cost per unit is cost at point of scrap; Scrap rate from records | sensitivity (3) | Automated | Complete |
| **Setup Reduction Value** `setup-worth` | Renamed from “SetupWorth”; guide, checks, sensitivity, report | Payback within a year; Freed time is used; Target set-up time is proven | sensitivity (4) | Automated | Complete |
| **Tooling Payback** `tooling-payback` | Renamed from “ToolingPayback”; guide, checks, sensitivity, report | Unit cost falls; Tool life exceeds payback quantity; Demand will last | sensitivity (3) | Automated | Complete |
| **Downtime Cost** `downtime-cost` | Renamed from “DowntimeCost”; guide, checks, sensitivity, report | Lost output not recovered later; No double counting | table, sensitivity (5) | Automated | Complete |
| **Yield and First-pass Yield** `yield-check` | Renamed from “YieldCheck”; Inputs added: Good first time (no rework); guide, checks, sensitivity, report | Good units not more than started; First-pass count not more than good; Rework burden | sensitivity (3) | Automated | Complete |

### Engineering

| Tool | Changes | Checks with example inputs | Analysis | Tested | Status |
|---|---|---|---|---|---|
| **Retention Method Selector** `retention-selector` | **New tool**; guide, checks, sensitivity, report | 12 checks (5 pass, 1 fail, 6 verify) | table, risks, guidance | Automated + hand calc | Complete |

### Quoting

| Tool | Changes | Checks with example inputs | Analysis | Tested | Status |
|---|---|---|---|---|---|
| **Quote Margin Check** `quote-check` | Renamed from “QuoteCheck”; guide, checks, sensitivity, report | Margin meets target; All costs included; Commercial terms | sensitivity (5) | Automated | Complete |
| **Price from Target Margin** `price-builder` | Renamed from “PriceBuilder”; guide, checks, sensitivity, report | Margin achievable; Price acceptable to the market | sensitivity (2) | Automated + hand calc | Complete |
| **Labour Quote** `labour-quote` | Renamed from “LabourQuote”; guide, checks, sensitivity, report | On-cost covers employment costs; Hours estimate | sensitivity (4) | Automated | Complete |
| **Job Cost Estimate** `job-cost` | Renamed from “JobCost”; guide, checks, sensitivity, report | Contingency proportionate to uncertainty; Quotes for subcontract and equipment | table, sensitivity (6) | Automated | Complete |
| **Supplier Comparison** `supplier-compare` | Renamed from “SupplierCompare”; Inputs added: Weight: price, Weight: lead time, Weight: quality, Weight: delivery reliability; guide, checks, sensitivity, report | Supplier A meets minimum quality and reliability; Supplier B meets minimum quality and reliability; Weights add to 100%; Ratings based on evidence | table, sensitivity (8) | Automated + hand calc | Complete |
| **Minimum Order Quantity Check** `moq-check` | Renamed from “MOQCheck”; Inputs added: Shelf life or obsolescence horizon (0 = not limited); guide, checks, sensitivity, report | Within shelf life or obsolescence horizon; Storage space available | sensitivity (2) | Automated | Complete |
| **Manufacturing Quote Builder** `manufacturing-quote` | Pro tier removed; guide, checks, sensitivity, report | Margin within the tool range; Set-up and tooling included; Machine and labour hours from routing | table, sensitivity (8) | Automated + hand calc | Complete |

### Inventory

| Tool | Changes | Checks with example inputs | Analysis | Tested | Status |
|---|---|---|---|---|---|
| **Reorder Point** `reorder-point` | Renamed from “ReorderPoint”; guide, checks, sensitivity, report | Safety stock set; Lead time is supplier-confirmed | sensitivity (3) | Automated + hand calc | Complete |
| **Safety Stock** `safety-stock` | Renamed from “SafetyStock”; Inputs added: Std deviation of daily demand (0 = not known), Std deviation of lead time (0 = not known), Target cycle service level; guide, checks, sensitivity, report | Maximums not below averages; Variation data supplied; Demand roughly normal and independent | table, sensitivity (4) | Automated + hand calc | Complete |
| **Inventory Carrying Cost** `inventory-cost` | Renamed from “InventoryCost”; guide, checks, sensitivity, report | Carrying rate defined by finance; Average, not peak, stock | sensitivity (3) | Automated | Complete |
| **Days of Stock Cover** `stock-days` | Renamed from “StockDays”; guide, checks, sensitivity, report | Cover compared with lead time; Demand rate current | sensitivity (2) | Automated | Complete |
| **Economic Order Quantity (EOQ)** `order-quantity` | Renamed from “OrderQuantity”; guide, checks, sensitivity, report | Holding cost per unit per year; Supplier pack size and MOQ | table, sensitivity (3) | Automated + hand calc | Complete |

### Improvement

| Tool | Changes | Checks with example inputs | Analysis | Tested | Status |
|---|---|---|---|---|---|
| **Improvement Value** `improvement-value` | Renamed from “ImprovementValue”; guide, checks, sensitivity, report | Time saving measured; Released time is used; Pays back within a year | sensitivity (5) | Automated | Complete |
| **Eight Wastes Check** `waste-check` | Renamed from “WasteCheck”; guide, checks, sensitivity, report | Scores based on observation; Defects and safety first | table | Automated | Complete |
| **Before and After Comparison** `before-after` | Renamed from “BeforeAfter”; guide, checks, sensitivity, report | No measure got worse; Comparable conditions; Enough data | table, sensitivity (2) | Automated | Complete |
| **Automation Business Case** `automation-check` | Renamed from “AutomationCheck”; guide, checks, sensitivity, report | Positive net benefit; Process stable and standardised; Safety risk assessment; Labour reduction is real | sensitivity (5) | Automated | Complete |
| **Process Maturity Score** `process-score` | Renamed from “ProcessScore”; guide, checks, sensitivity, report | No dimension critically weak; Self-assessment bias | — | Automated | Complete |
| **Jig and Fixture Return on Investment** `jig-fixture-roi` | Renamed from “Jig and Fixture ROI Calculator”; Pro tier removed; guide, checks, sensitivity, report | Payback within 12 months (tool default); Fixture design verified; Usage will continue | sensitivity (5) | Automated | Complete |

### Planning

| Tool | Changes | Checks with example inputs | Analysis | Tested | Status |
|---|---|---|---|---|---|
| **Demand vs Capacity** `demand-capacity` | Renamed from “DemandCapacity”; guide, checks, sensitivity, report | Capacity covers demand; Capacity is practical, not theoretical | sensitivity (2) | Automated | Complete |
| **Deadline Feasibility** `deadline-check` | Renamed from “DeadlineCheck”; guide, checks, sensitivity, report | Quantity achievable; Materials and labour available | sensitivity (6) | Automated | Complete |
| **Team Workload** `workload` | Renamed from “Workload”; guide, checks, sensitivity, report | Workload within capacity; Hours net of leave and meetings | sensitivity (3) | Automated | Complete |
| **Profit What-if Scenario** `what-if` | Renamed from “WhatIf”; guide, checks, sensitivity, report | Scenario stays profitable; Fixed costs unchanged by the scenario; Price change effect on volume | table, sensitivity (6) | Automated | Complete |
| **Production Capacity Planner** `capacity-planner-pro` | Pro tier removed; guide, checks, sensitivity, report | Capacity covers demand; Uptime from records; Labour for extra shifts | table, sensitivity (7) | Automated + hand calc | Complete |

### Business

| Tool | Changes | Checks with example inputs | Analysis | Tested | Status |
|---|---|---|---|---|---|
| **Hire or Outsource** `hire-outsource` | Renamed from “HireOrOutsource”; guide, checks, sensitivity, report | Decision robust to workload; One employee can deliver the workload; Employment on-costs complete; Contractor classification | sensitivity (5) | Automated | Complete |
| **Subscription Value** `subscription-value` | Renamed from “SubscriptionValue”; guide, checks, sensitivity, report | Value exceeds cost; Hours saved are measured; Data export and exit terms | sensitivity (3) | Automated | Complete |
| **Buy or Lease** `buy-lease` | Renamed from “BuyOrLease”; Inputs added: Discount rate (your approved rate); guide, checks, sensitivity, report | Residual value evidence; Lease includes maintenance?; Tax and accounting | table, sensitivity (6) | Automated + hand calc | Complete |
| **Process or Software Readiness** `process-or-software` | Renamed from “ProcessOrSoftware”; guide, checks, sensitivity, report | Process documented and consistent; Data ready to migrate | — | Automated | Complete |
| **Build or Buy Software** `build-buy-software` | Renamed from “BuildOrBuySoftware”; guide, checks, sensitivity, report | Custom build risk; Package fit tested; Exit and data ownership | sensitivity (5) | Automated | Complete |

## Limitations

- The two specification files named in the brief (`KEVOS_WORKOS_Master_Engineering_Decision_Tools_Upgrade_Command.md` and `KEVOS_WORKOS_Retention_Method_Selector_Master_Build_Command.md`) were not found on this machine; the work follows the requirements given in the conversation.
- Scores, bands and thresholds marked “tool default” in each guide are screening conventions, not standards; replace them with your organisation’s policy where one exists.
- The Retention Method Selector holds no catalogue dimensions, strength ratings, speed or temperature limits, safety factors or prices. Every rating and cost is entered by the user; missing evidence gives VERIFY, never PASS. Standards are named for reference only and their editions must be confirmed against an approved list.
- Results are pre-tax and in AUD unless a guide states otherwise.

## Machinery’s Handbook topic tools (added 25 October 2026)

122 MAKEOS calculators in five batches (`public/tools/{data,guides,calc}-handbook4…8.js`), built from topics in *Machinery’s Handbook*, 29th edition (Industrial Press, 2012). Each tool uses standard engineering relations; no handbook tables, ratings or recommended settings are reproduced, and every guide cites the printed pages as a topic reference. Material properties, ratings, allowable stresses, factors and limits are always user inputs.

Applied to every tool: units and bounds on every input, a guide with an input source for every field, a worked example computed from the tool’s own defaults, feasibility and verification checks, ±10% sensitivity, HTML/print report and share link. Automated tests run every tool with its defaults, reject empty, non-finite, out-of-range and fractional inputs, check impossible geometry, and compare 31 reference cases with handbook worked examples, ISO/ASME tabulated values or hand calculations (`tests/tools-calculators.test.ts`).

### Geometry

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Circular Segment and Arc** `circular-segment` | CALCULATED | Sensitivity of radius to height; Model and application | 77–80 | Automated + reference value |
| **Regular Polygon and Hexagon Sizes** `regular-polygon` | CALCULATED | Round stock for full corners; Model and application | 76, 81–82 | Automated + reference value |
| **Triangle Solver** `triangle-solver` | CALCULATED | Angle sum; Model and application | 95–102 | Automated + reference value |
| **Cylindrical Tank Contents** `tank-volume` | CALCULATED | Tank ends; Model and application | 68–69 | Automated + reference value |
| **Hopper and Frustum Volume** `frustum-volume` | CALCULATED | Outlet smaller than top; Model and application | 82–87, 66 | Automated + reference value |
| **Ellipse Area and Perimeter** `ellipse` | CALCULATED | Axes; Model and application | 48–50, 70–75 | Automated + reference value |
| **Compound Angle** `compound-angle` | CALCULATED | Angle definitions; Model and application | 119–121 | Automated |
| **Polar and Rectangular Coordinates** `polar-coordinates` | CALCULATED | Angle convention; Model and application | 43–45, 692–694 | Automated |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Dovetail Measurement over Rods** `dovetail-measurement` | MEASUREMENT CALCULATED | Rod contacts flank below edge; Model and application | 682 | Automated |
| **V-Groove Measurement over a Pin** `v-groove-pin` | MEASUREMENT CALCULATED | Pin contacts the flanks; Model and application | 682–691 | Automated |
| **Gauge Block Stack Builder** `gauge-block-stack` | STACK FOUND | Stack equals target; Model and application | 705–708 | Automated + reference value |
| **Abbe Offset Error** `abbe-error` | CALCULATED | Measurement capability; Model and application | 709–735 | Automated |
| **Statistical (RSS) Tolerance Stack** `rss-tolerance-stack` | MEETS WORST CASE | Worst case within limits; RSS within limits; Statistical assumptions; Model and application | 628–634, 128–130 | Automated + reference value |
| **ISO Tolerance Grade (IT) Value** `it-tolerance-grade` | CALCULATED | Drawing value; Model and application | 635–668 | Automated |
| **Normal Distribution Out-of-Tolerance** `normal-out-of-spec` | CALCULATED | Process stability and normality; Centring; Model and application | 128–133 | Automated + reference value |
| **Sample Size to Estimate a Mean** `sample-size-mean` | CALCULATED | Standard deviation estimate; Model and application | 130–132 | Automated |
| **Two-Sample Comparison (t-test)** `two-sample-t` | SIGNIFICANT DIFFERENCE | Significance; Sampling assumptions; Model and application | 130–133 | Automated + reference value |

### Units

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Length Converter** `length-converter` | CONVERTED | Conversion factors; Model and application | 2661–2662 | Automated |
| **Force Converter** `force-converter` | CONVERTED | Conversion factors; Model and application | 2683–2686 | Automated |
| **Pressure and Stress Converter** `pressure-converter` | CONVERTED | Conversion factors; Model and application | 2686–2694 | Automated |
| **Torque Converter** `torque-converter` | CONVERTED | Conversion factors; Model and application | 2686–2694 | Automated |
| **Power Converter** `power-converter` | CONVERTED | Conversion factors; Model and application | 2695–2697 | Automated |
| **Energy and Work Converter** `energy-converter` | CONVERTED | Conversion factors; Model and application | 2695–2697 | Automated |
| **Volumetric Flow Converter** `flow-converter` | CONVERTED | Conversion factors; Model and application | 2682 | Automated |
| **Mass Converter** `mass-converter` | CONVERTED | Conversion factors; Model and application | 2683–2685 | Automated |
| **Speed and Feed Rate Converter** `velocity-converter` | CONVERTED | Conversion factors; Model and application | 2698 | Automated |
| **Angle Converter** `angle-converter` | CONVERTED | Conversion factors; Model and application | 103–104, 2662 | Automated |
| **Temperature Converter** `temperature-converter` | CONVERTED | Reading or difference; Model and application | 2695–2696 | Automated |
| **Decimal to Fraction** `decimal-fraction` | EXACT FRACTION | Exact at 1/64; Model and application | 3, 11–13 | Automated |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Resultant of Concurrent Forces** `force-resultant` | CALCULATED | Concurrent forces; Model and application | 153–163 | Automated |
| **Inclined Plane and Friction** `inclined-plane` | CALCULATED | Self-locking; Model and application | 165–171 | Automated |
| **Flywheel Energy and Speed Fluctuation** `flywheel-energy` | RIM SPEED WITHIN LIMIT | Rim speed; Model and application | 3000–3010, 179–186 | Automated + reference value |
| **Centrifugal Force on a Rotating Mass** `centrifugal-force` | CALCULATED | Retention capacity; Model and application | 187–190 | Automated |
| **Permissible Residual Unbalance (Balance Grade)** `balance-grade` | CALCULATED | Measured residual unbalance; Model and application | 191–196 | Automated + reference value |
| **Impact Energy and Stopping Force** `impact-load` | CALCULATED | Absorber rating; Model and application | 179–186, 278 | Automated |
| **Point-to-Point Move Time** `move-profile` | CALCULATED | Drive force; Model and application | 175–180 | Automated |
| **Sling Leg Tension** `sling-tension` | WITHIN LEG WLL | Leg tension within WLL; Leg angle; Lift plan; Model and application | 2613–2650 | Automated |
| **Combined Centre of Gravity** `combined-cg` | CALCULATED | Item data; Model and application | 221–227 | Automated + reference value |
| **Mass Moment of Inertia** `mass-moment-inertia` | CALCULATED | Geometry; Model and application | 228–240 | Automated + reference value |
| **Belt, Rope and Band Friction (Capstan)** `belt-friction` | CALCULATED | Friction coefficient; Model and application | 165–168, 2473–2490 | Automated |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Column Buckling (Euler and Johnson)** `column-buckling` | ADEQUATE | Safety factor against buckling; Applied stress below yield; End conditions; Model and application | 281–287 | Automated + reference value |
| **Principal Stresses and von Mises** `principal-stress` | ADEQUATE | von Mises safety factor; Tresca safety factor; Model and application | 212–218 | Automated + reference value |
| **Pressure Cylinder Wall Stress** `pressure-cylinder` | ADEQUATE | Safety factor against yield; Wall ratio; Pressure equipment code; Model and application | 290–294 | Automated + reference value |
| **Fatigue Safety Factor (Goodman)** `goodman-fatigue` | ADEQUATE | Governing safety factor; Corrected endurance limit; Model and application | 200–211, 280 | Automated |
| **Beam Cases: Off-Centre, Fixed and Propped** `beam-cases` | STRESS WITHIN ALLOWABLE | Bending stress; Deflection limit; Model and application | 257–277 | Automated |
| **Shaft Diameter for Bending and Torsion** `shaft-diameter` | DIAMETER ADEQUATE | Checked diameter; Deflection and critical speed; Model and application | 295–303 | Automated |
| **Shaft Critical (Whirling) Speed** `critical-speed` | BELOW CRITICAL | Separation from critical speed; Support stiffness; Model and application | 197, 302 | Automated + reference value |
| **Circular Flat Plate under Pressure** `circular-plate` | STRESS WITHIN ALLOWABLE | Bending stress; Small-deflection validity; Model and application | 288–290 | Automated |
| **Press and Shrink Fit Pressure and Holding Torque** `press-fit` | ADEQUATE | Hub stress safety factor; Heating temperature; Interference range; Model and application | 631–634 | Automated + reference value |
| **Restrained Thermal Stress** `thermal-stress` | CALCULATED | Stress below yield; Buckling in compression; Model and application | 375–376, 578 | Automated |
| **Hertz Contact Stress** `hertz-contact` | WITHIN ALLOWABLE | Contact pressure; Hardened depth; Model and application | 2301–2309 | Automated + reference value |

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Helical Compression Spring Design Check** `compression-spring` | STRESS WITHIN ALLOWABLE | Stress at working length; Stress at solid; Spring index; Buckling; Model and application | 304–324 | Automated + reference value |
| **Helical Extension Spring Check** `extension-spring` | BODY STRESS WITHIN ALLOWABLE | Body stress; Hook stress; Model and application | 325–332 | Automated |
| **Helical Torsion Spring Check** `torsion-spring` | SPRING OK | Bending stress; Arbor clearance; Model and application | 333–343 | Automated |
| **Springs in Series or Parallel** `spring-combination` | CALCULATED | Individual spring limits; Model and application | 304–320 | Automated |
| **Disc (Belleville) Spring Load and Stress** `disc-spring` | CALCULATED | Working deflection; Ratio h₀/t; Fatigue; Model and application | 350–359 | Automated + reference value |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Bolt Tightening Torque and Preload** `bolt-torque-preload` | WITHIN PROOF LOAD | Preload within proof load; Nut factor; Model and application | 1521–1535 | Automated |
| **Thread Length of Engagement** `thread-engagement` | CALCULATED | Thread limits used; Model and application | 1536–1537 | Automated |
| **Bolted Joint Load Sharing and Separation** `bolted-joint` | JOINT HOLDS | No separation; Bolt stress within proof; Member stiffness; Model and application | 1521–1535 | Automated + reference value |
| **Bolt and Pin Shear and Bearing** `bolt-shear-bearing` | ADEQUATE | Shear; Bearing; Edge distance and net section; Model and application | 1535, 1720–1735 | Automated |
| **Riveted Lap Joint Efficiency** `riveted-joint` | CALCULATED | Edge distance; Model and application | 1720–1735 | Automated + reference value |
| **Tap Drill for Percentage of Thread** `tap-drill` | CALCULATED | Minor diameter tolerance; Forming tap suitability; Model and application | 2029–2036 | Automated |

### Threads

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **ISO Metric Thread Basic Dimensions** `metric-thread` | CALCULATED | Tolerance class; Model and application | 1867–1890 | Automated + reference value |
| **Unified Inch Thread Basic Dimensions** `unified-thread` | CALCULATED | Tolerance class; Model and application | 1806–1866 | Automated + reference value |
| **Three-Wire Thread Measurement** `three-wire` | CALCULATED | Wire contacts the flanks; Lead angle; Model and application | 1990–2003 | Automated + reference value |
| **Thread Helix Angle and Screw Efficiency** `screw-efficiency` | CALCULATED | Self-locking; Vibration; Model and application | 1921–1928, 2061–2062 | Automated |
| **Simple Indexing on a Dividing Head** `simple-indexing` | SIMPLE INDEXING POSSIBLE | Exact indexing; Model and application | 2107–2121 | Automated |
| **Change Gears for Thread Cutting** `change-gears` | EXACT TRAIN FOUND | Lead accuracy; Gear train fits the lathe; Model and application | 2043–2049 | Automated + reference value |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Helical Gear Pair Geometry** `helical-gear` | CALCULATED | Overlap ratio; Gear rating; Model and application | 2195–2210 | Automated |
| **Gear Tooth Forces** `gear-forces` | CALCULATED | Dynamic and application factors; Model and application | 2131–2160, 2195–2200 | Automated |
| **Gear Tooth Bending Stress (Lewis)** `lewis-bending` | WITHIN ALLOWABLE | Bending stress; Full gear rating; Model and application | 2131–2160 | Automated |
| **Worm Gear Geometry and Efficiency** `worm-gear` | CALCULATED | Back-driving; Thermal rating; Model and application | 2191–2194 | Automated + reference value |
| **Straight Bevel Gear Geometry** `bevel-gear` | CALCULATED | Face width; Bevel gear rating; Model and application | 2181–2190 | Automated |
| **Gear Chordal Thickness and Addendum** `chordal-tooth` | CALCULATED | Tip diameter; Model and application | 2145, 2238–2240 | Automated + reference value |
| **Gear Span (Base Tangent) Measurement** `span-measurement` | CALCULATED | Anvils fit across the face; Model and application | 2236–2248 | Automated + reference value |
| **Spur Gear Measurement over Pins** `gear-over-pins` | CALCULATED | Pin contact; Model and application | 2236–2248 | Automated |
| **Gear Train Ratio, Speed and Torque** `gear-train` | CALCULATED | Mesh strength; Model and application | 2122–2160 | Automated |
| **Cam Follower Peak Velocity and Acceleration** `cam-motion` | CALCULATED | Acceleration continuity; Follower contact; Model and application | 2284–2309 | Automated |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Belt Drive Tensions and Shaft Load** `belt-drive-tensions` | CALCULATED | Belt speed; Installation tension; Model and application | 2473–2520 | Automated |
| **Roller Chain Length and Centre Distance** `chain-length` | CALCULATED | Wrap on small sprocket; Small sprocket teeth; Model and application | 2537–2560 | Automated |
| **Reflected Inertia and Motor Acceleration Torque** `reflected-inertia` | CALCULATED | Inertia ratio; Motor rating; Model and application | 180–186, 2569–2580 | Automated |
| **Ball Screw Critical Speed and Buckling** `ballscrew-limits` | WITHIN LIMITS | Speed; Buckling; Nut life and DN limit; Model and application | 2561–2568 | Automated |
| **Plate Clutch and Disc Brake Torque** `clutch-torque` | CAPACITY SUFFICIENT | Torque capacity; Lining pressure and heat; Model and application | 2446–2458 | Automated + reference value |
| **Three-Phase Motor Power, Current and Torque** `motor-power` | CALCULATED | Electrical sizing; Model and application | 2569–2580 | Automated |
| **Parallel Key Shear and Crushing** `key-stress` | KEY ADEQUATE | Shear; Crushing; Key length; Model and application | 2460–2486, 301 | Automated |

### Engineering

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Rolling Bearing Adjusted Rating Life** `bearing-life-adjusted` | LIFE SUFFICIENT | Life against requirement; Load factors; Model and application | 2400–2420 | Automated + reference value |
| **Plain Bearing Pressure, Velocity and PV** `journal-bearing-pv` | WITHIN MATERIAL LIMITS | Pressure; Sliding speed; PV; Model and application | 2314–2337 | Automated |
| **O-Ring Squeeze, Stretch and Gland Fill** `o-ring-gland` | WITHIN TYPICAL RANGES | Squeeze; Gland fill; Stretch; Tolerance extremes; Model and application | 2591–2610 | Automated |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Turning Cutting Force and Power** `turning-power` | WITHIN MACHINE POWER | Power available; Power at this speed; Model and application | 1084–1101 | Automated |
| **Milling Power and Spindle Torque** `milling-power` | WITHIN SPINDLE POWER | Power available; Spindle torque at this speed; Model and application | 1084–1101 | Automated |
| **Drilling Power, Torque and Thrust** `drilling-power` | WITHIN MACHINE POWER | Power available; Thrust and workholding; Model and application | 1089–1093 | Automated |
| **Ball-Nose Scallop Height and Stepover** `scallop-height` | CALCULATED | Surface orientation; Model and application | 1039–1058, 1279–1300 | Automated + reference value |
| **Taylor Tool Life and Economic Cutting Speed** `taylor-tool-life` | IN EFFICIENT RANGE | Planned speed in efficient range; Range of test data; Model and application | 1102–1124, 1132–1140 | Automated + reference value |
| **Grinding Wheel Speed and Removal Rate** `grinding-wheel` | WITHIN WHEEL SPEED | Wheel speed within marked maximum; Guarding and mounting; Model and application | 1199–1268, 1246–1250 | Automated |
| **Broach Tooth Pitch** `broach-pitch` | CALCULATED | At least two teeth cutting; Minimum practical pitch; Model and application | 980–990 | Automated + reference value |
| **Boring Bar Deflection** `boring-bar-deflection` | DEFLECTION ACCEPTABLE | Deflection; Overhang ratio; Model and application | 762–790, 1300 | Automated |
| **Electroplating Thickness and Time (Faraday)** `electroplating-thickness` | CALCULATED | Thickness distribution; Model and application | 1467, 1500–1516 | Automated |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Guillotine Shearing Force** `shear-force` | WITHIN SHEAR CAPACITY | Shear capacity; Thickness rating; Model and application | 1336–1339 | Automated |
| **Press Brake Bending Force** `press-brake-force` | WITHIN PRESS CAPACITY | Press capacity; Die opening; Load per length; Model and application | 1346–1353 | Automated |
| **Drawn Shell Blank Diameter and Draws** `shell-blank` | 2 DRAWS | First drawing ratio; Trim allowance; Model and application | 1353–1360 | Automated + reference value |
| **Fillet Weld Strength** `fillet-weld-strength` | WELDS ADEQUATE | Weld capacity; Eccentricity and base metal; Model and application | 1476–1486, 1469–1475 | Automated |
| **Carbon Equivalent and Weldability** `carbon-equivalent` | PREHEAT LIKELY | Weldability band; Pcm applicability; Preheat determination; Model and application | 1431–1449 | Automated |
| **Casting Solidification Time and Riser Check** `casting-solidification` | RISER MODULUS SUFFICIENT | Modulus ratio; Feed volume and distance; Model and application | 1405–1420 | Automated |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Brinell Hardness from Indentation** `brinell-hardness` | VALID TEST | Indentation size; Specimen thickness; Model and application | 1406–1412 | Automated + reference value |
| **Heat Flow Through a Layered Wall** `wall-heat-loss` | CALCULATED | Touch temperature; Model and application | 371–378 | Automated |
| **Heating Energy and Time** `heating-energy` | CALCULATED | Phase change; Model and application | 371–374 | Automated + reference value |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Orifice and Restrictor Flow** `orifice-flow` | CALCULATED | Discharge coefficient; Model and application | 3024–3027, 352–368 | Automated |
| **Hydraulic Accumulator Size** `accumulator-size` | CALCULATED | Precharge ratio; Pressure ratio; Model and application | 352–368 | Automated + reference value |
| **Pipe Friction Factor and Pressure Drop** `pipe-friction` | CALCULATED | Flow regime; Operating viscosity; Model and application | 3024–3027 | Automated |
| **Pump and Fan Affinity Laws** `pump-affinity` | CALCULATED | Impeller trim; Static head; Model and application | 3024–3027 | Automated + reference value |
| **Pump NPSH Available** `npsh-available` | NPSH ADEQUATE | Margin over NPSHr; Model and application | 3024–3027 | Automated + reference value |
| **Hydraulic Motor Torque, Speed and Power** `hydraulic-motor` | CALCULATED | Starting torque; Model and application | 352–368 | Automated |
| **Pipe or Hose Size for a Target Velocity** `pipe-size-velocity` | BORE ADEQUATE | Actual bore; Model and application | 3024–3027 | Automated |
| **Hydrostatic Pressure and Tank Wall Force** `hydrostatic-force` | CALCULATED | Dynamic loads; Model and application | 3024–3027 | Automated + reference value |

### Pneumatics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Air Compressor Power** `compressor-power` | CALCULATED | Maker data; Model and application | 3032–3041 | Automated |
| **Compressed Air Leak Cost** `air-leak-cost` | CALCULATED | Flow basis; Choked flow; Model and application | 3032–3041 | Automated |
| **Air Receiver Size** `air-receiver` | RECEIVER ADEQUATE | Actual receiver; Pressure equipment; Model and application | 3032–3041 | Automated + reference value |
| **Gas Volume at Pressure and Temperature** `gas-law` | CALCULATED | Reference conditions; Model and application | 3032–3041 | Automated + reference value |

### Money

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Depreciation Schedule** `depreciation-schedule` | CALCULATED | Tax treatment; Model and application | 139–140 | Automated + reference value |
| **Equivalent Annual Cost Comparison** `euac-compare` | OPTION B | Margin between options; Equal service; Model and application | 134–146 | Automated + reference value |
| **Internal Rate of Return (Uneven Cash Flows)** `irr-uneven` | MEETS HURDLE RATE | NPV at hurdle rate; Cash flow evidence; Model and application | 140–144 | Automated + reference value |
| **Interest and Equivalence Factors** `interest-factors` | CALCULATED | Rate basis; Model and application | 134–139 | Automated + reference value |

## Machinery’s Handbook topic tools, second pass (added 25 October 2026)

69 further MAKEOS calculators in batches handbook9–13 (`public/tools/{data,guides,calc}-handbook9…13.js`), same rules as the first pass: standard relations only, no handbook tables reproduced, page references as topic references, ratings and limits entered by the user. 41 reference cases cover handbook worked examples (surface finish feed, differential indexing for 67 divisions, helical milling change gears), ASME/ASTM values (½ NPT, ASTM E112 grain size) and hand calculations. WORKOS now holds 306 tools.

### Geometry

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Helix (Coil) Developed Length** `helix-length` | CALCULATED | Material allowance; Model and application | 2060–2062, 304–320 | Automated |
| **Tank and Vessel Volume with Heads** `vessel-head-volume` | CALCULATED | Head proportions; Model and application | 68–69, 82–87 | Automated + reference value |
| **Linear Interpolation** `linear-interpolation` | CALCULATED | Within table range; Model and application | 121 | Automated + reference value |
| **Circle Through Three Points** `circle-three-points` | CALCULATED | Point spread; Model and application | 40–48 | Automated + reference value |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **True Position with Bonus Tolerance** `true-position` | CONFORMS | Position within allowed tolerance; Size within limits; Datum reference frame; Model and application | 615–627 | Automated + reference value |
| **Internal Taper Angle from Two Balls** `taper-balls` | CALCULATED | Ball contact; Model and application | 682–691 | Automated + reference value |
| **Go and No-Go Gauge Sizes** `go-nogo-gauge` | CALCULATED | Production tolerance remaining; Gauge calibration; Model and application | 661–663, 705–708 | Automated + reference value |
| **X-bar and R Control Chart Limits** `xbar-r-limits` | CALCULATED | Process stability; Model and application | 128–133 | Automated + reference value |
| **Acceptance Sampling Probability (OC Curve)** `sampling-oc` | CALCULATED | Lot size; Model and application | 128–133 | Automated + reference value |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Toggle Joint Force** `toggle-joint` | CALCULATED | Small link angle; Model and application | 172–174 | Automated + reference value |
| **Wedge Force with Friction** `wedge-force` | CALCULATED | Self-locking; Vibration; Model and application | 169–171 | Automated |
| **Power Screw Raise and Lower Torque** `power-screw-torque` | CALCULATED | Self-locking; Starting friction; Model and application | 1921–1928, 2561–2568 | Automated |
| **Band Brake Torque and Lever Force** `band-brake` | CALCULATED | Rotation direction; Lining pressure; Model and application | 2455–2457 | Automated |
| **Single Shoe (Block) Brake** `shoe-brake` | CALCULATED | Self-locking; Lining pressure and heat; Model and application | 2455–2459 | Automated |
| **Wire Rope Reeving: Line Pull and Safety Factor** `wire-rope-reeving` | ROPE AND SHEAVE OK | Rope safety factor; Sheave D/d; Lifting code; Model and application | 2613–2650 | Automated + reference value |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Cone Clutch Torque and Engaging Force** `cone-clutch` | CAPACITY SUFFICIENT | Torque capacity; Cone angle; Model and application | 2446–2449 | Automated + reference value |
| **Induction Motor Synchronous Speed, Slip and Load** `motor-slip` | CALCULATED | Load level; Measurement; Model and application | 2569–2580 | Automated + reference value |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Rectangular Bar in Torsion** `rect-bar-torsion` | WITHIN ALLOWABLE | Shear stress; Model and application | 295–303 | Automated + reference value |
| **Curved Beam and Hook Stress** `curved-beam` | WITHIN ALLOWABLE | Maximum fibre stress; Lifting standard; Model and application | 212–218, 257–260 | Automated |
| **Tube Collapse under External Pressure** `tube-collapse` | ADEQUATE | Safety factor; Out-of-roundness and stiffener spacing; Model and application | 293–294 | Automated + reference value |
| **Eccentrically Loaded Column (Secant Formula)** `eccentric-column` | ADEQUATE | Load factor to yield; Stress at applied load; Model and application | 281–287 | Automated + reference value |
| **Impact Load on a Beam** `beam-impact` | WITHIN ALLOWABLE | Dynamic stress; Model and application | 278 | Automated |
| **Section Properties: I, T, Channel and Angle** `section-shapes` | CALCULATED | Rolled sections; Model and application | 234–246 | Automated + reference value |
| **Thin-Walled Closed Tube in Torsion** `thin-tube-torsion` | WITHIN ALLOWABLE | Shear stress; Thin-wall assumption; Model and application | 295–303 | Automated + reference value |
| **Rotating Disc Stress and Burst Margin** `rotating-disc` | ADEQUATE | Safety factor; Stress raisers; Model and application | 187–190, 3000–3010 | Automated + reference value |
| **Combined Axial and Biaxial Bending Stress** `axial-bending-stress` | WITHIN ALLOWABLE | Peak stress; Sign of stress; Model and application | 212–218 | Automated |

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Flat and Leaf Spring** `leaf-spring` | STRESS WITHIN ALLOWABLE | Bending stress; Small deflection; Model and application | 344–345 | Automated |
| **Torsion Bar Spring** `torsion-bar` | STRESS WITHIN ALLOWABLE | Shear stress; End fittings; Model and application | 295–303, 344 | Automated |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **ASTM Grain Size Number** `grain-size` | CALCULATED | Method reporting; Model and application | 369–380 | Automated + reference value |
| **Corrosion Rate from Mass Loss** `corrosion-rate` | CALCULATED | Localised corrosion; Model and application | 1500–1516 | Automated |
| **Radiant Heat Loss** `radiant-heat` | CALCULATED | Convection; Model and application | 371–378 | Automated + reference value |
| **Heat Loss from an Insulated Pipe** `insulated-pipe` | CALCULATED | Surface temperature; Model and application | 371–378 | Automated |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Bolt Stretch and Turn-of-Nut Angle** `bolt-stretch` | CALCULATED | Angle procedure; Model and application | 1521–1535 | Automated |
| **Eccentrically Loaded Bolt Group** `bolt-group-eccentric` | BOLTS ADEQUATE | Critical bolt capacity; Plate and bearing; Model and application | 1535, 1720–1735 | Automated + reference value |

### Threads

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Acme and Trapezoidal Thread Dimensions** `acme-thread` | CALCULATED | Thread class; Model and application | 1921–1946 | Automated + reference value |
| **NPT Pipe Thread Gauge Dimensions** `npt-thread` | CALCULATED | Gauging; Model and application | 1952–1975 | Automated + reference value |
| **Differential Indexing on a Dividing Head** `differential-indexing` | DIFFERENTIAL INDEXING | Exact ratio; Idler arrangement; Model and application | 2107–2121 | Automated + reference value |
| **Helical Milling Lead and Change Gears** `helical-milling` | APPROXIMATE TRAIN | Lead accuracy; Gear fit; Model and application | 2060–2062, 2205 | Automated + reference value |
| **Thread Turning Infeed per Pass** `thread-infeed` | CALCULATED | Last pass infeed; Model and application | 2037–2042, 1289–1300 | Automated |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Planetary Gear Train** `planetary-gear` | ASSEMBLES | Equal planet spacing; Neighbouring planets clear; Model and application | 2211, 2122–2160 | Automated + reference value |
| **Profile Shift and Working Centre Distance** `profile-shift` | CALCULATED | Pinion undercut; Gear undercut; Tooth tip thickness; Model and application | 2141–2160 | Automated + reference value |
| **Spur Gear Contact Ratio** `contact-ratio` | CALCULATED | Contact ratio; Model and application | 2131–2160 | Automated + reference value |
| **Spur Gear Dimensions (Diametral Pitch)** `dp-spur-gear` | CALCULATED | Fine pitch allowance; Model and application | 2131–2140, 2249–2251 | Automated |
| **Roller Chain Sprocket Diameters** `sprocket-diameters` | CALCULATED | Tooth count; Model and application | 2537–2550 | Automated |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Tool Nose Radius Compensation for Tapers** `nose-radius-compensation` | CALCULATED | Tip orientation; Model and application | 782–790, 1289–1300 | Automated + reference value |
| **Turning Feed for Surface Finish (Ra)** `feed-for-finish` | CALCULATED | Feed against nose radius; Model and application | 1125–1131 | Automated + reference value |
| **Speeds and Feeds in Inch Units** `inch-speeds-feeds` | CALCULATED | Machine limits; Model and application | 1013–1017 | Automated |
| **Knurling Blank Diameter for Tracking** `knurl-blank` | TRACKS CLEANLY | Whole number of teeth; Model and application | 991–997 | Automated + reference value |
| **Band Saw Cutting Time** `bandsaw-time` | CALCULATED | Cutting rate source; Model and application | 1182–1192 | Automated |
| **Centerless Grinding Through-Feed Rate** `centerless-feed` | CALCULATED | Actual output; Model and application | 1259–1261 | Automated |

### Maintenance

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Coolant Concentration from Refractometer** `refractometer-concentration` | WITHIN 10% OF TARGET | Concentration; Tramp oil; Model and application | 1176–1181 | Automated + reference value |
| **Rim and Face Shaft Alignment Corrections** `rim-face-alignment` | CALCULATED | Sign convention and sag; Soft foot; Model and application | 2645–2650 | Automated |
| **Weibull Reliability and B10 Life** `weibull-reliability` | CALCULATED | Preventive replacement; Data source; Model and application | 128–133 | Automated + reference value |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Sheet Metal Bending Springback** `bending-springback` | CALCULATED | Trial bend; Model and application | 1351–1352 | Automated + reference value |
| **Tube Bending Wall Thinning** `tube-bend-thinning` | WALL ADEQUATE | Minimum wall; Tooling; Model and application | 1382–1386 | Automated + reference value |
| **Fillet Weld Cost per Metre** `weld-cost` | CALCULATED | Shop data; Model and application | 1439–1441, 1429–1449 | Automated + reference value |
| **Lap Joint Overlap (Brazed, Soldered or Bonded)** `lap-joint-length` | OVERLAP ADEQUATE | Chosen overlap; Service load; Model and application | 1423–1430 | Automated |
| **Paint and Powder Coating Coverage** `coating-coverage` | CALCULATED | Transfer efficiency; Model and application | 1500–1516 | Automated + reference value |

### Engineering

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Rolling Bearing Friction Torque and Heat** `bearing-friction` | CALCULATED | Seal and lubricant drag; Model and application | 2365–2420 | Automated |
| **Oil Viscosity at Temperature** `oil-viscosity-temperature` | CALCULATED | Within data range; Model and application | 2329–2337, 2698 | Automated + reference value |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Water Hammer Pressure Surge** `water-hammer` | CALCULATED | Closing time; Pressure rating; Model and application | 3024–3027 | Automated |
| **Coolant Flow for a Heat Load** `coolant-flow-heat` | CALCULATED | Fluid properties; Model and application | 371–374 | Automated |
| **Valve Flow Coefficient (Kv and Cv)** `valve-flow-coefficient` | CALCULATED | Cavitation and flashing; Model and application | 3024–3027 | Automated + reference value |
| **Heat Exchanger LMTD and Area** `lmtd-exchanger` | CALCULATED | Temperature approach; Heat balance; Model and application | 371–378 | Automated + reference value |

### Pneumatics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Compressed Air Pipe Pressure Drop** `air-pipe-drop` | CALCULATED | Small-drop approximation; Air velocity; Model and application | 3036–3041, 3024–3027 | Automated |
| **Pneumatic Cylinder Force and Bore Selection** `pneumatic-cylinder-force` | BORE ADEQUATE | Load ratio; Model and application | 3032–3041 | Automated + reference value |
| **Vacuum Cup Holding Force** `vacuum-cup` | CUPS HOLD | Holding force; Surface condition; Model and application | 3032–3041 | Automated + reference value |

### Money

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Process Selection Break-Even Quantity** `process-breakeven` | PROCESS A | Distance from break-even; Like-for-like quality; Model and application | 143–146 | Automated + reference value |
| **Learning Curve Unit Time and Cost** `learning-curve` | CALCULATED | Learning rate evidence; Model and application | 146 | Automated + reference value |

## Machinery’s Handbook topic tools, third pass: index of interactive equations (added 25 October 2026)

43 MAKEOS tools in batches handbook14–16 complete the coverage of the handbook’s Index of Interactive Equations: plane and solid geometry, centroids, complex numbers, matrices, equations, trigonometric and involute functions, overhanging and continuous beams, further beam cases, 3D and combined stresses, Rankine columns, further sections and mass properties, non-concurrent forces, square-wire springs, journal and thrust bearings, gas processes, Unified and ISO metric thread limits, Whitworth threads, lead-angle wire measurement, involute splines, gear cutters, crossed helical gears, keyseats, roll, pin and disc inspection, drill sizes, full-power cutting and belt lengths. Reference cases include the handbook’s disc-gauge, bolt-circle and ½-28 UNEF worked examples and ASME B1.1 / ISO 965 table values. Table-only content (fits, hardness conversions, material properties) is not reproduced. WORKOS now holds 349 tools.

### Geometry

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Plane Figure Area and Perimeter** `plane-area` | CALCULATED | Dimensions; Model and application | 66–81 | Automated + reference value |
| **Polygon Area and Centroid from Coordinates** `polygon-area` | CALCULATED | Simple polygon; Model and application | 40–48, 66–76 | Automated + reference value |
| **Volume and Surface of Solids** `solid-volume` | CALCULATED | Dimensions; Model and application | 82–88 | Automated + reference value |
| **Centre of Gravity of Common Shapes** `centroid-shapes` | CALCULATED | Reference point; Model and application | 221–227 | Automated + reference value |
| **Cylindrical and Spherical Coordinates** `coordinates-3d` | CALCULATED | Angle convention; Model and application | 43–45 | Automated |
| **Distance and Angle Between Two Points** `two-point-distance` | CALCULATED | Coordinate frame; Model and application | 40–42 | Automated |
| **Triangle from Two Sides and an Opposite Angle** `triangle-ssa` | CALCULATED | Ambiguity; Model and application | 95–102 | Automated + reference value |
| **Rollers Around a Shaft and Circles in Circles** `circle-packing` | CALCULATED | Running clearance; Model and application | 88–94 | Automated + reference value |

### Mathematics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Complex Number Calculator** `complex-number` | CALCULATED | Angle convention; Model and application | 18–19 | Automated + reference value |
| **Quadratic and Cubic Equation Solver** `equation-solver` | CALCULATED | Roots verified by substitution; Model and application | 32–34 | Automated + reference value |
| **Simultaneous Equations and 3 × 3 Matrix** `linear-system` | CALCULATED | Conditioning; Model and application | 122–127 | Automated + reference value |
| **Factorials, Permutations and Combinations** `combinations` | CALCULATED | Precision; Model and application | 19 | Automated + reference value |
| **Trigonometric and Involute Functions** `trig-functions` | CALCULATED | Domain; Model and application | 95–114 | Automated + reference value |

### Units

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Degrees, Minutes and Seconds Converter** `dms-converter` | CONVERTED | Conversion; Model and application | 103–104 | Automated + reference value |
| **Density and Specific Gravity Converter** `density-converter` | CONVERTED | Conversion factors; Model and application | 369–380, 2683 | Automated + reference value |
| **Wind Chill Temperature** `wind-chill` | CALCULATED | Formula range; Model and application | 2695–2697 | Automated + reference value |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Overhanging Beam** `overhanging-beam` | STRESS WITHIN ALLOWABLE | Bending stress; Uplift at a support; Model and application | 257–262 | Automated + reference value |
| **Continuous Beam over Two Spans** `two-span-beam` | STRESS WITHIN ALLOWABLE | Bending stress; Pattern loading; Model and application | 264–267 | Automated + reference value |
| **Beam Cases: Fixed, Guided, Propped and Partial Loads** `beam-cases-more` | STRESS WITHIN ALLOWABLE | Bending stress; End fixity; Model and application | 257–270 | Automated + reference value |
| **Round Shaft under Axial Load, Bending and Torsion** `shaft-combined-stress` | ADEQUATE | von Mises safety factor; Tresca safety factor; Model and application | 212–218, 295–303 | Automated + reference value |
| **Three-Dimensional Principal Stresses** `principal-stress-3d` | CALCULATED | Yield; Model and application | 212–218 | Automated + reference value |
| **Column Strength by Rankine–Gordon** `rankine-column` | INADEQUATE | Safety factor; Rankine constant; Model and application | 281–287 | Automated |
| **Section Properties: Ellipse, Hexagon, Triangle, Z and Cross** `section-shapes-more` | CALCULATED | Torsion; Model and application | 234–246 | Automated + reference value |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Mass Moment of Inertia: Cone, Torus, Ellipsoid and Shells** `mass-inertia-more` | CALCULATED | Shape idealisation; Model and application | 228–240 | Automated + reference value |
| **Resultant of Non-Concurrent and Parallel Forces** `force-system` | CALCULATED | Sign convention; Model and application | 153–163 | Automated + reference value |

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Square-Wire Compression Spring** `square-wire-spring` | STRESS WITHIN ALLOWABLE | Corrected stress; Solid length; Model and application | 304–324 | Automated + reference value |

### Engineering

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Journal Bearing Friction (Petroff) and Sommerfeld Number** `journal-bearing-petroff` | CALCULATED | Load level; Model and application | 2326–2337 | Automated + reference value |
| **Thrust Bearing Pad Unit Load and PV** `thrust-bearing-pads` | WITHIN LIMITS | Unit load; PV; Model and application | 2338–2356 | Automated + reference value |

### Pneumatics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Gas Compression and Expansion Process** `gas-compression-process` | CALCULATED | Temperature; Model and application | 3032–3041 | Automated + reference value |

### Threads

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Unified Thread Limits of Size (Classes 1A–3B)** `unified-thread-limits` | CALCULATED | Internal minor maximum; Model and application | 1813–1866 | Automated + reference value |
| **ISO Metric Thread Limits of Size (6g, 6H and Others)** `metric-thread-limits` | CALCULATED | Table values; Model and application | 1867–1912 | Automated + reference value |
| **Whitworth Thread Basic Dimensions** `whitworth-thread` | CALCULATED | Thread form; Model and application | 1980–1989, 1995–1998 | Automated + reference value |
| **Three-Wire Measurement with Lead Angle (Buckingham)** `three-wire-lead-angle` | CALCULATED | Lead angle range; Model and application | 1990–2003 | Automated + reference value |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Involute Spline Basic Dimensions (ANSI B92.1)** `involute-spline` | CALCULATED | Fit class tolerances; Model and application | 2255–2282 | Automated + reference value |
| **Involute Gear Cutter Number** `gear-cutter-number` | CALCULATED | Cutter pitch; Model and application | 2148–2150, 820–829 | Automated + reference value |
| **Crossed Helical Gears (Shafts at Right Angles)** `crossed-helical-gears` | CALCULATED | Hand of helix; Model and application | 2195–2203 | Automated + reference value |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Keyseat Depth and Measurement over Key** `keyseat-depth` | CALCULATED | Key standard; Model and application | 2460–2486 | Automated + reference value |
| **Crossed Belt and Three-Pulley Belt Length** `belt-length-crossed-three` | CALCULATED | Minimum wrap; Model and application | 2473–2490 | Automated + reference value |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Arc Radius from Measurement over Rolls** `arc-radius-rolls` | CALCULATED | Sensitivity; Model and application | 687–688 | Automated + reference value |
| **Bolt Circle Measurement over Pins** `bolt-circle-pins` | CALCULATED | Plug fit; Model and application | 686 | Automated + reference value |
| **Taper and Angle Gauges with Discs** `taper-discs` | CALCULATED | Set-up accuracy; Model and application | 684–685 | Automated + reference value |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Drill Sizes: Number, Letter, Fraction and Metric** `drill-size-lookup` | CALCULATED | Hole tolerance; Model and application | 2695, 1015–1016 | Automated |
| **Cutting Speed or Feed for Full Machine Power** `full-power-cutting-speed` | CALCULATED | Tool speed limit; Model and application | 1084–1101 | Automated + reference value |

## Machinery’s Handbook topic tools, fourth pass (added 25 October 2026)

33 MAKEOS tools in batches handbook17–18 add flat plates and spherical shells, brittle hollow shafts, coupling bolts and taper pins, universal-joint speed variation, notch sensitivity and S-N fatigue life, Vickers and Knoop hardness, elastic constants, melting energy, snap fits, gear contact stress, cam pressure angle, bearing duty cycles, RMS motor torque, ball-screw life, timing belts, thermal growth in alignment, bend radius limits, anodizing time, gating choke area, CNC chord error, chip thickness and specific cutting force, grinding geometry, thread-milling paths, angular indexing, bolted-joint fatigue, machine-hour rate, benefit-cost ratio, geometric speed series, factors and GCD, and rack-and-pinion drives. Reference cases include the handbook’s universal-joint example. Ratings and allowables stay user inputs. WORKOS now holds 382 tools.

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Square and Rectangular Flat Plates** `rectangular-plate` | STRESS WITHIN ALLOWABLE | Plate stress; Small-deflection validity; Model and application | 288–290 | Automated |
| **Spherical Shell under Internal Pressure** `spherical-shell` | ADEQUATE | Safety factor; Pressure equipment code; Model and application | 290–294 | Automated + reference value |
| **Shaft Diameter for Brittle Materials and Hollow Shafts** `shaft-brittle-hollow` | CALCULATED | Material is brittle; Model and application | 295–303 | Automated |
| **Fatigue Notch Factor from Stress Concentration** `fatigue-notch-factor` | CALCULATED | Source of Kt; Model and application | 200–211 | Automated + reference value |
| **Fatigue Life from the S-N Curve (Steel)** `sn-fatigue-life` | LIFE SUFFICIENT | Life against requirement; Scatter; Model and application | 200–211, 358 | Automated + reference value |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Flange Coupling Bolt Capacity** `flange-coupling-bolts` | BOLTS ADEQUATE | Bolt shear; Friction capacity; Model and application | 2441–2450, 302 | Automated |
| **Universal (Cardan) Joint Speed Variation** `universal-joint` | CALCULATED | Joint angle; Model and application | 2445–2446 | Automated + reference value |
| **RMS Torque for a Motor Duty Cycle** `rms-torque` | MOTOR ADEQUATE | Continuous torque; Peak torque; Model and application | 2569–2580, 180–186 | Automated + reference value |
| **Ball Screw Rating Life** `ball-screw-life` | LIFE SUFFICIENT | Life against requirement; Speed and buckling; Model and application | 2561–2568 | Automated + reference value |
| **Timing (Synchronous) Belt Length and Teeth** `timing-belt` | CALCULATED | Teeth in mesh; Model and application | 2473–2535 | Automated + reference value |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Taper Pin for Torque Transmission** `taper-pin-torque` | PIN ADEQUATE | Checked pin; Shaft weakening; Model and application | 220, 1714–1720 | Automated |
| **Bolted Joint Fatigue Check** `bolted-joint-fatigue` | FATIGUE SAFE | Fatigue safety factor; Joint separation; Model and application | 1521–1535 | Automated + reference value |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Vickers and Knoop Hardness from Indentation** `vickers-knoop-hardness` | CALCULATED | Specimen thickness; Model and application | 1406–1412 | Automated + reference value |
| **Elastic Constants: E, G, ν and Bulk Modulus** `elastic-constants` | CALCULATED | Physical range; Model and application | 369–380, 2695 | Automated + reference value |
| **Energy and Time to Melt Metal** `melting-energy` | CALCULATED | Material data; Model and application | 371–374, 1404–1420 | Automated + reference value |
| **Cantilever Snap-Fit Design (Plastics)** `snap-fit` | STRAIN ACCEPTABLE | Assembly strain; Root radius; Model and application | 593–605 | Automated + reference value |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Spur and Helical Gear Contact (Pitting) Stress** `gear-contact-stress` | WITHIN ALLOWABLE | Contact stress; Full rating; Model and application | 2131–2160, 2301–2309 | Automated + reference value |
| **Cam Pressure Angle** `cam-pressure-angle` | WITHIN LIMIT | Pressure angle; Undercutting; Model and application | 2284–2309 | Automated |
| **Rack and Pinion Speed, Force and Travel** `rack-pinion` | CALCULATED | Guide friction and acceleration; Model and application | 2131–2160 | Automated + reference value |

### Engineering

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Bearing Life for a Load and Speed Duty Cycle** `bearing-duty-cycle` | CALCULATED | Life adjustment; Model and application | 2400–2420 | Automated + reference value |

### Maintenance

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Thermal Growth for Hot Shaft Alignment** `alignment-thermal-growth` | CALCULATED | Hot check; Model and application | 2645–2650, 375–376 | Automated + reference value |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Minimum and Maximum Bend Radius** `bend-radius-limits` | RADIUS ACCEPTABLE | Cracking; Permanent bend; Grain direction; Model and application | 1346–1347 | Automated + reference value |
| **Casting Gating System Choke Area** `gating-choke-area` | CALCULATED | Gate velocity; Model and application | 1404–1420 | Automated |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Anodizing Time and Coating Thickness** `anodizing-time` | CALCULATED | Thickness measurement; Model and application | 1500–1516 | Automated + reference value |
| **CNC Arc Linearisation Chord Error** `cnc-chord-error` | CALCULATED | Program size; Model and application | 1279–1300, 77–80 | Automated + reference value |
| **Chip Thickness and Specific Cutting Force** `chip-thickness-kc` | CALCULATED | Material data; Model and application | 1084–1101 | Automated |
| **Grinding Equivalent Diameter and G-Ratio** `grinding-geometry` | CALCULATED | Wheel wear data; Model and application | 1199–1268 | Automated + reference value |
| **Thread Milling Tool Path and Feed** `thread-milling-path` | CALCULATED | Cutter size; Model and application | 2063–2070, 1292–1300 | Automated + reference value |

### Threads

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Angular Indexing on a Dividing Head** `angular-indexing` | APPROXIMATE | Angular error; Model and application | 2107–2121 | Automated + reference value |

### Money

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Machine Hour Rate** `machine-hour-rate` | CALCULATED | Productive hours; Model and application | 134–146, 1153–1160 | Automated |
| **Benefit–Cost Ratio** `benefit-cost-ratio` | BENEFITS EXCEED COSTS | B/C above 1; Benefit evidence; Model and application | 140–144 | Automated + reference value |

### Mathematics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Geometric Speed and Size Series** `speed-series` | CALCULATED | Step size; Model and application | 37–39 | Automated + reference value |
| **Prime Factors, Greatest Common Divisor and Least Common Multiple** `factors-gcd` | CALCULATED | Hunting tooth; Model and application | 20–29 | Automated + reference value |

## Machinery’s Handbook topic tools, fifth pass: mechanisms, machine elements and shop calculations (added 25 October 2026)

33 MAKEOS tools in batches handbook19–20 add uniformly accelerated motion and falling bodies, run-up torque, impulse and collisions, simple, compound, conical and torsional pendulums, fly-ball (Porter) governors, Geneva wheels, gyroscopic couples, Prony brakes, catenary cables, rolling resistance, single- and two-plane balancing, torsional resonance of drives, buoyancy, wind pressure, escaping compressed air, ratchet wheels, levers and lifting machines, AGMA bending stress, involute spline stresses, internal gear proportions, lubricant film thickness ratio, turn-of-nut tightening, drawing and ironing forces, threading rolls, hobbing time, rolled angle rings, perforated sheet, machinery noise, equivalent stiffness thickness, 3 × 3 matrices and wood moisture and density. Reference cases include the handbook’s internal gear, threading roll, Porter governor, windlass, rope block, stand-pipe angle ring and machinery noise examples. Ratings, factors and allowables stay user inputs. WORKOS now holds 415 tools.

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Uniformly Accelerated Motion and Falling Bodies** `uniform-acceleration` | CALCULATED | Direction; Model and application | 175–181 | Automated + reference value |
| **Torque to Accelerate a Rotating Load** `angular-acceleration-torque` | CALCULATED | Braking; Model and application | 176–181 | Automated + reference value |
| **Impulse, Momentum and Collisions** `impulse-momentum` | CALCULATED | Model and application | 184–186 | Automated + reference value |
| **Pendulum Period: Simple, Compound, Conical and Torsional** `pendulum-period` | CALCULATED | Amplitude; Model and application | 173–174 | Automated + reference value |
| **Fly-ball (Porter) Governor Height and Sensitivity** `flyball-governor` | CALCULATED | Model and application | 3453–3455 | Automated + reference value |
| **Geneva Wheel Indexing Mechanism** `geneva-mechanism` | CALCULATED | Slot width; Entry shock; Model and application | 171 | Automated + reference value |
| **Gyroscopic Couple and Bearing Reactions** `gyroscope-precession` | CALCULATED | Model and application | 2998 | Automated + reference value |
| **Prony Brake and Absorption Dynamometer Power** `prony-brake` | CALCULATED | Model and application | 2998–2999 | Automated + reference value |
| **Catenary Cable Sag, Tension and Length** `catenary-cable` | CALCULATED | Model and application | 2999 | Automated + reference value |
| **Rolling Resistance of Wheels and Rollers** `rolling-resistance` | CALCULATED | Model and application | 165–167 | Automated + reference value |
| **Counterbalancing Masses in One Plane** `rotating-balance-plane` | CALCULATED | Model and application | 191–195 | Automated + reference value |
| **Two-Plane (Dynamic) Balance Corrections** `two-plane-balance` | CALCULATED | Model and application | 191–195 | Automated + reference value |
| **Torsional Natural Frequency of a Drive** `torsional-vibration` | ABOVE BANDWIDTH | Resonance against bandwidth; Model and application | 3412–3413 | Automated + reference value |
| **Wind Pressure and Force on a Surface** `wind-pressure` | CALCULATED | Model and application | 3028 | Automated + reference value |
| **Lever Force with Several Loads** `lever-force` | CALCULATED | Arrangement; Model and application | 167–168 | Automated + reference value |
| **Windlass, Gear Hoist and Differential Pulley Effort** `hoist-advantage` | CALCULATED | Self-sustaining; Model and application | 170–171 | Automated + reference value |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Buoyancy and Submerged Weight** `buoyancy` | SINKS | Flotation; Model and application | 3027 | Automated + reference value |

### Pneumatics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Velocity and Flow of Escaping Compressed Air** `escaping-air-velocity` | CALCULATED | Choked flow; Model and application | 3037–3038 | Automated + reference value |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Ratchet Wheel Tooth Pitch** `ratchet-wheel-pitch` | CALCULATED | Model and application | 2215–2217 | Automated + reference value |
| **Involute Spline Stresses and Torque Capacity** `spline-torque-capacity` | SPLINE ADEQUATE | Shear; Compression; Model and application | 2266–2270 | Automated + reference value |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Gear Tooth Bending Stress (AGMA Form)** `agma-bending-stress` | BENDING ADEQUATE | Bending safety factor; Pitting; Model and application | 3304–3320 | Automated + reference value |
| **Internal Gear and Pinion Proportions** `internal-gear` | NUMBERS COMPATIBLE | Tooth-number difference; Pinion size; Model and application | 2170–2171 | Automated + reference value |
| **Gear Hobbing Cycle Time** `hobbing-time` | CALCULATED | Model and application | 3347–3349 | Automated + reference value |

### Maintenance

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Lubricant Film Thickness Ratio (Lambda)** `film-thickness-ratio` | FULL FILM | Separation; Model and application | 2420–2422 | Automated + reference value |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Turn-of-Nut Angle for Bolt Preload** `turn-of-nut-preload` | CALCULATED | Joint compliance; Model and application | 1522–1528 | Automated + reference value |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Deep Drawing and Ironing Punch Force** `deep-draw-force` | WITHIN PRESS CAPACITY | Press capacity; Blank holder; Model and application | 1353–1361 | Automated + reference value |
| **Length of Angle or Bar Bent to a Ring** `angle-ring-length` | CALCULATED | Model and application | 2593 | Automated + reference value |
| **Perforated Sheet Open Area and Hole Count** `perforated-open-area` | CALCULATED | Ligament; Model and application | 2607–2608 | Automated + reference value |

### Threads

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Threading Roll Pitch Diameter** `thread-roll-diameter` | CALCULATED | Model and application | 2050–2051 | Automated + reference value |

### Engineering

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Machinery Noise: Machine Level, Combined Sources and Distance** `sound-level` | CALCULATED | Background margin; Model and application | 3455–3456 | Automated + reference value |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Equivalent Thickness for Equal Stiffness or Strength** `equivalent-stiffness-thickness` | CALCULATED | Model and application | 575–580 | Automated + reference value |
| **Wood Moisture Content and Density** `wood-moisture-density` | CALCULATED | Fibre saturation; Model and application | 386–387, 3019 | Automated + reference value |

### Mathematics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **3 × 3 Matrix Determinant, Adjoint and Inverse** `matrix-3x3` | CALCULATED | Model and application | 122–125 | Automated + reference value |

## Machinery’s Handbook topic tools, sixth pass: geometry, series, maintenance and shop calculations (added 25 October 2026)

19 MAKEOS tools in batches handbook21–22 add prismoidal volumes, Pappus–Guldinus surfaces and volumes of revolution, Simpson’s rule areas, spherical triangles and great-circle distances, arithmetical and geometrical progressions, Renard preferred numbers, straight-line intersections, the average force of a blow, mixture cost and blending (alligation), the classic AISC column formulas, retaining ring thrust capacity, ISO 4406 cleanliness codes, filter beta ratios, inverse-time feed, screw machine bar stock, shearing blade force, the AGMA pitting resistance power rating, grinding cycle time and pattern shrinkage. Reference cases include the handbook’s torus, spherical-triangle, alloy-cost, cleanliness-code and screw-stock examples. WORKOS now holds 434 tools.

### Geometry

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Prismoidal Formula Volume** `prismoidal-volume` | CALCULATED | Model and application | 66 | Automated + reference value |
| **Surface and Volume of Revolution (Pappus–Guldinus)** `pappus-revolution` | CALCULATED | Model and application | 66–67 | Automated + reference value |
| **Area of an Irregular Outline by Simpson’s Rule** `simpson-area` | CALCULATED | Model and application | 67–68 | Automated + reference value |
| **Spherical Triangle and Great-Circle Distance** `spherical-triangle` | CALCULATED | Model and application | 115–118 | Automated + reference value |
| **Straight Lines: Intersection, Angle and Distance** `line-intersection` | CALCULATED | Model and application | 40–46 | Automated + reference value |

### Mathematics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Arithmetical and Geometrical Progressions** `progression` | CALCULATED | Model and application | 37–39 | Automated + reference value |
| **Preferred Number (Renard) Series** `preferred-numbers` | CALCULATED | Model and application | 672 | Automated + reference value |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Average Force of a Blow (Drop Hammer or Pile Driver)** `drop-hammer-blow` | CALCULATED | Model and application | 183–184 | Automated + reference value |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Mixture Cost and Blending (Alligation)** `mixture-cost` | CALCULATED | Model and application | 384 | Automated + reference value |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Steel Column Safe Stress (Classic AISC Formulas)** `column-safe-stress-classic` | WITHIN SAFE LOAD | Safe load; Current code; Model and application | 281–285 | Automated + reference value |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Retaining Ring Thrust Capacity and Groove Edge Margin** `retaining-ring-thrust` | THRUST WITHIN CAPACITY | Thrust; Groove position; Model and application | 1763–1789 | Automated + reference value |

### Maintenance

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **ISO 4406 Oil Cleanliness Code from Particle Counts** `iso-cleanliness-code` | DIRTIER THAN TARGET | 4 µm; 6 µm; 14 µm; Model and application | 2439–2441 | Automated + reference value |
| **Filter Beta Ratio and Capture Efficiency** `filter-beta-ratio` | CALCULATED | Model and application | 2441–2442 | Automated + reference value |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Inverse Time Feed Rate (G93)** `inverse-time-feed` | CALCULATED | Model and application | 1288–1289 | Automated + reference value |
| **Bar Stock for Screw Machine Parts** `screw-machine-stock` | CALCULATED | Model and application | 1175–1176 | Automated + reference value |
| **Surface and Cylindrical Grinding Cycle Time** `grinding-cycle-time` | CALCULATED | Model and application | 1246–1265 | Automated + reference value |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Shearing Force for Parallel and Inclined Blades** `shearing-blade-force` | WITHIN CAPACITY | Machine capacity; Model and application | 1336–1338 | Automated + reference value |
| **Pattern Size for Shrinkage and Casting Weight from Pattern** `pattern-shrinkage` | CALCULATED | Model and application | 1414, 1419 | Automated + reference value |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Spur Gear Pitting Resistance Power Rating (AGMA)** `agma-pitting-power` | PITTING RATING ADEQUATE | Pitting power; Bending; Model and application | 3304–3313 | Automated + reference value |

## Machinery’s Handbook topic tools, seventh pass: remaining edge topics (added 25 October 2026)

10 MAKEOS tools in batch handbook23 cover the remaining formula-based edge topics: spur gear contact diameters, contact ratio, lowest point of single tooth contact and maximum hob tip radius, dividing-head angles for milling clutch teeth, silent chain sprocket diameters, small cutter stiffness and deflection, stockpile volume and weight, lumber board feet, packed-joint bolt working strength, punch and shear flywheel sizing, equivalent chip thickness cutting forces and deep drawing reduction sequences. Reference cases include the handbook’s clutch-head table, 1-in. bolt, hot-slab shear flywheel, microtool and ECT examples. What remains in the handbook is predominantly tables and descriptive text, which are not reproduced. WORKOS now holds 444 tools.

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Spur Gear Contact Diameters, Contact Ratio and LPSTC** `spur-contact-diameters` | CALCULATED | Contact ratio; Model and application | 2155–2157 | Automated + reference value |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Dividing-Head Angle for Milling Clutch Teeth** `clutch-teeth-dividing-head` | CALCULATED | Model and application | 2452–2454 | Automated + reference value |
| **Small Cutter and Drill Stiffness and Deflection** `microtool-stiffness` | CALCULATED | Model and application | 1093–1094 | Automated + reference value |
| **Equivalent Chip Thickness (ECT) and Cutting Forces** `ect-cutting-forces` | CALCULATED | ECT against feed; Model and application | 1132–1141 | Automated + reference value |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Silent (Inverted-Tooth) Chain Sprocket Diameters** `silent-chain-sprocket` | CALCULATED | Model and application | 3457–3460 | Automated + reference value |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Stockpile Volume and Weight from Angle of Repose** `stockpile-weight` | CALCULATED | Model and application | 382–383 | Automated + reference value |
| **Lumber Board Feet and Volume** `lumber-board-feet` | CALCULATED | Model and application | 3018–3019 | Automated + reference value |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Working Strength of Bolts in Packed (Gasketed) Joints** `bolt-working-strength-packed` | CALCULATED | Bolt size; Model and application | 1535–1536 | Automated + reference value |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Punch and Shear Flywheel Sizing** `press-flywheel-sizing` | CALCULATED | Model and application | 3004–3006 | Automated + reference value |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Deep Drawing Reduction Sequence** `draw-reductions` | CALCULATED | Model and application | 1353–1359 | Automated + reference value |

## Machinery’s Handbook topic tools, eighth pass: plastics and set screws (added 25 October 2026)

3 MAKEOS tools in batch handbook24 add the plastics gear power rating (spur, helical and straight bevel), thermal stress and relative movement in plastic–metal assemblies with an apparent creep modulus option, and set-screw holding power and torque. Reference cases include the handbook’s set-screw examples and agreement of the metric and US plastics gear formulas. WORKOS now holds 447 tools.

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Plastics Gear Power Rating** `plastic-gear-power` | CALCULATED | Wear and heat; Model and application | 604–606 | Automated + reference value |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Thermal Stress and Movement in Plastic–Metal Assemblies** `plastic-thermal-mismatch` | STRESS ACCEPTABLE | Stress; Fixings; Model and application | 578–580 | Automated + reference value |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Set-Screw Holding Power and Torque** `set-screw-holding` | CALCULATED | Number of screws; Model and application | 1699–1700 | Automated + reference value |

## Machinery’s Handbook topic tools, ninth pass: uncited formula pages (added 25 October 2026)

12 MAKEOS tools in batch handbook25 came from a page-by-page map of formula density in the handbook against the pages existing tools already cite. They add forming tool step depths (flat, raked and circular tools), spade drilling power and thrust, true stress–strain and the flow curve, oil viscosity unit conversion, ANSI 7°/45° buttress thread dimensions, three-wire measurement of taper and buttress threads, multi-start threading set-up, shear spinning, CNC axis positioning accuracy and repeatability, Acme tap drill limits, milling cutter tooth count and dividing-head settings for fluting angular cutters and taper reamers. Reference cases include the handbook’s 3-in. pipe gauge (3.495 in.), forming-tool, Acme tap drill, positioning accuracy and 21° 52′ fluting examples. WORKOS now holds 459 tools.

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Forming Tool Step Depths and Angles** `forming-tool-depth` | CALCULATED | Model and application | 797–801 | Automated + reference value |
| **Spade Drilling Power and Thrust** `spade-drill-power` | WITHIN MACHINE POWER | Machine power; Model and application | 1077–1079 | Automated + reference value |
| **Multi-Start Thread Turning Set-up** `multi-start-threading` | SPEED WITHIN AXIS LIMIT | Axis feed; Model and application | 1304–1305 | Automated + reference value |
| **Number of Teeth for a Milling Cutter** `milling-cutter-teeth` | CALCULATED | Model and application | 808–809 | Automated + reference value |
| **Dividing-Head Setting for Fluting Angular Cutters and Taper Reamers** `angular-cutter-setting` | CALCULATED | Model and application | 833–834 | Automated + reference value |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **True Stress, True Strain and Flow Curve** `true-stress-strain` | CALCULATED | Model and application | 1331–1334 | Automated + reference value |

### Units

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Oil Viscosity Unit Conversion (cSt, cP, SUS, Reyn)** `viscosity-units` | CALCULATED | Model and application | 2425–2426 | Automated + reference value |

### Threads

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **ANSI Buttress Thread Basic Dimensions (7°/45°)** `buttress-thread` | CALCULATED | Model and application | 1945–1952 | Automated + reference value |
| **Three-Wire Measurement of Taper and Buttress Threads** `three-wire-taper-buttress` | CALCULATED | Model and application | 2005–2007 | Automated + reference value |
| **Acme Thread Tap Drill Size** `acme-tap-drill` | CALCULATED | Model and application | 944–947 | Automated + reference value |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Shear Spinning Blank Thickness and Force** `shear-spinning` | CALCULATED | Model and application | 1362–1364 | Automated + reference value |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **CNC Axis Positioning Accuracy and Repeatability** `machine-positioning-accuracy` | MEETS REQUIRED ACCURACY | Accuracy; Model and application | 1319–1322 | Automated + reference value |

## Machinery’s Handbook topic tools, tenth pass: integrated design checks (added 25 October 2026)

9 MAKEOS tools in batch handbook26 chain several handbook methods into one design decision: a spur gear set check (geometry, contact ratio, undercut, bending and pitting with the face width each needs), a compression spring designer from two working points, a shrink or press fit designed from the torque and thrust it must carry, a bolted joint check with preload scatter, separation, proof and fatigue, turning cost per part with minimum-cost and maximum-production speeds, compound or progressive die tonnage, hydraulic cylinder sizing with rod buckling, flows, power and pipe bores, shaft sizing for strength, twist and critical speed, and a milling cut planner with chip thinning, power and torque. Each is cross-checked in the tests against the single-purpose tools it chains. WORKOS now holds 468 tools.

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Spur Gear Set Design Check** `spur-gear-set-design` | GEAR SET ADEQUATE | Bending; Pitting; Undercut; Contact ratio; Face width ratio; Model and application | 2131–2156, 3304–3320 | Automated + cross-check |

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Compression Spring Designer (Two Working Points)** `compression-spring-designer` | SPRING FEASIBLE | Clash allowance; Spring index; Stress at solid; Buckling; Model and application | 304–324 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Shrink or Press Fit Design from Required Torque** `shrink-fit-design` | FIT FEASIBLE | Hub stress; Heating temperature; Model and application | 631–633, 2442–2444 | Automated + cross-check |
| **Shaft Design: Strength, Twist and Critical Speed** `shaft-design-check` | CALCULATED | Governing criterion; Model and application | 295–303 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Bolted Joint Design Check (Preload, Separation, Proof and Fatigue)** `bolted-joint-design-check` | JOINT DESIGN ADEQUATE | Separation; Proof load; Fatigue; Preload scatter; Model and application | 1521–1536 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Turning Cycle Time and Cost per Part with Tool Life** `turning-cost-per-part` | CALCULATED | Speed choice; Model and application | 1102–1152 | Automated + cross-check |
| **Milling Cut Planner (Speed, Thinned Feed, Power and Torque)** `milling-cut-planner` | WITHIN SPINDLE POWER | Spindle power; Spindle speed; Chip thinning; Model and application | 1084–1101, 1162–1167 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Press Tonnage for a Compound or Progressive Die** `press-die-tonnage` | PRESS ADEQUATE | Press capacity; Off-centre load; Model and application | 1336–1359, 1386–1392 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Hydraulic Cylinder Sizing (Bore, Rod Buckling, Flow, Power, Pipes)** `hydraulic-cylinder-sizing` | CYLINDER FEASIBLE | Rod fits the bore; Standard sizes; Model and application | 281–286, 3421–3425 | Automated + cross-check |

## Machinery’s Handbook topic tools, eleventh pass: integrated design checks, second round (added 25 October 2026)

9 more integrated design checks in batch handbook27: ball-screw linear axis sizing (phase torques with inertia, RMS torque, critical speed, buckling and life), V-belt or flat belt drive design (length, wrap, tensions, number of belts and shaft load), roller chain drive design (rating, breaking-load factor, links, exact centres and chordal action), rolling bearing selection (required rating, life at a chosen reliability on the ISO 281:2007 or the handbook’s ANSI/ABMA basis, static safety and speed), fillet weld size and cost, cam and spring-loaded follower contact and preload, friction clutch engagement with slip energy and heat, screw jack design (torques, self-locking, nut pressure, root stress, buckling) and pumping system design (head, power, motor and NPSH). Tests cross-check each against the single-purpose tools it chains; the bearing check exposes the difference between the handbook’s reliability factors and the current ISO values and offers both. WORKOS now holds 477 tools.

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Ball-Screw Linear Axis Sizing** `ballscrew-axis-sizing` | AXIS FEASIBLE | Critical speed; Buckling; Life; Motor; Model and application | 2561–2563 | Automated + cross-check |
| **Cam and Spring-Loaded Follower Design** `cam-follower-design` | CAM DESIGN ADEQUATE | Follower contact; Pressure angle; Model and application | 2284–2310 | Automated + cross-check |
| **Screw Jack and Power Screw Design** `screw-jack-design` | SCREW DESIGN ADEQUATE | Self-locking; Nut pressure; Screw stress; Buckling; Lever effort; Model and application | 171, 2561 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **V-Belt or Flat Belt Drive Design** `v-belt-drive-design` | CALCULATED | Wrap angle; Belt speed; Belt catalogue; Model and application | 2487–2536 | Automated + cross-check |
| **Roller Chain Drive Design** `roller-chain-drive-design` | CHAIN ADEQUATE | Power rating; Breaking load; Small sprocket; Ratio; Model and application | 2537–2556 | Automated + cross-check |
| **Rolling Bearing Selection Check** `bearing-selection-check` | BEARING SUITABLE | Life; Static safety; Speed; Model and application | 2365–2422 | Automated + cross-check |
| **Friction Clutch Engagement Design** `clutch-engagement-design` | CLUTCH ADEQUATE | Lining pressure; Temperature rise; Model and application | 2446–2458 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Fillet Weld Joint Design and Cost** `fillet-weld-joint-design` | CALCULATED | Leg against plate; Over-welding; Welding code; Model and application | 1433–1486 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Pumping System Design (Head, Power and NPSH)** `pump-system-design` | SUCTION ADEQUATE | NPSH margin; Velocity; Model and application | 3021–3026, 3036 | Automated + cross-check |

## Machinery’s Handbook topic tools, twelfth pass: integrated design checks, third round (added 25 October 2026)

A third round of 9 integrated design checks in batch handbook28: keyed shaft and hub design (key length for shear and crushing, two-key option, hub length and the handbook’s 75% keyed-shaft rule), band brake stopping design (torque for resisting or overhauling loads, band tensions, lever force against what is available, lining pressure, stopping time and heat), belt conveyor drive sizing (effective tension, power, slip-free take-up), fixture clamping force and clamp screw torque, lifting beam and spreader beam checks, beam sizing for strength and deflection, compressed-air system sizing (compressor, power, receiver, main bore and leak cost), vibration isolator selection and motor-and-gearbox selection. Tests cross-check each against the key-stress, band-brake, air-receiver, compressor-power, air-pipe-drop and reflected-inertia tools. WORKOS now holds 486 tools.

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Keyed Shaft and Hub Design** `keyed-hub-design` | KEYED JOINT ADEQUATE | Hub length; Keyed shaft stress; Key proportions; Model and application | 2460–2486, 301 | Automated |
| **Band Brake Stopping Design** `band-brake-stop-design` | BRAKE ADEQUATE | Lever force; Lining pressure; Stopping time; Temperature rise; Rotation; Model and application | 2455–2458 | Automated + cross-check |
| **Belt Conveyor Drive Sizing** `conveyor-drive-sizing` | CALCULATED | Take-up; Belt rating; Model and application | 2487–2512 | Automated + cross-check |
| **Motor and Gearbox Selection** `motor-gearbox-selection` | MOTOR CAN START THE LOAD | Starting torque; Gearbox rating; Model and application | 2569–2580, 3408–3412 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Fixture Clamping Force and Clamp Screw Torque** `fixture-clamp-force` | CLAMPS ADEQUATE | Screw stress; Positive stop; Model and application | 3131–3134, 1522–1532 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Lifting Beam and Spreader Beam Check** `lifting-beam-design` | BEAM ADEQUATE | Bending stress; Certification; Model and application | 2613–2625, 281–285 | Automated + cross-check |
| **Vibration Isolator Selection** `vibration-isolator-selection` | CALCULATED | Resonance; Start-up; Model and application | 197–198, 304–316 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Beam Sizing for Strength and Deflection** `beam-sizing` | CALCULATED | Lateral stability; Model and application | 258–275 | Automated + cross-check |

### Pneumatics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Compressed-Air System Sizing** `compressed-air-system-sizing` | CALCULATED | Pressure band; Leakage; Model and application | 3030–3037, 3421–3425 | Automated + cross-check |

## Machinery’s Handbook topic tools, thirteenth pass: integrated design checks, fourth round (added 25 October 2026)

A fourth round of 9 integrated design checks in batch handbook29: a gear train tooth number planner (one or two stages, hunting-tooth preference, five best trains), gearbox or hydraulic unit heat balance with cooler duty, cutting tool deflection with the depth of cut that holds tolerance, a sheet-metal bracket cost build-up (flat blank, nesting yield, bending force, labour), tapped hole design (drill, engagement against stripping, thread and drill depths), pneumatic cylinder sizing with air use, cushioning and running cost, disc spring stack design (series and parallel counts, heights, stress), a drilling cycle planner (power, torque, thrust, pecking and total time) and hydraulic motor drive sizing. Tests cross-check each against the boring-bar, bend-allowance, press-brake, tap-drill, thread-engagement, pneumatic, disc-spring, drilling and hydraulic motor tools. WORKOS now holds 495 tools.

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Gear Train Tooth Number Planner** `gear-train-ratio-planner` | CALCULATED | Model and application | 2131–2160, 2043–2047 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Gearbox or Hydraulic Unit Heat Balance and Cooling** `gearbox-heat-balance` | NO COOLER NEEDED | Oil temperature; Maker rating; Model and application | 3339–3340, 2430–2436 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Cutting Tool Deflection and Depth-of-Cut Limit** `tool-deflection-cut-limit` | DEFLECTION TOO LARGE | Deflection; Overhang; Model and application | 1093–1094, 1162–1167 | Automated + cross-check |
| **Drilling Cycle Planner (Speed, Feed, Thrust, Power and Time)** `drilling-cycle-planner` | DRILLING PLAN FEASIBLE | Spindle power; Thrust; Hole depth; Model and application | 1084–1092, 1089 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Sheet-Metal Bracket: Flat Blank, Nesting, Bending Force and Cost** `sheet-metal-part-cost` | CALCULATED | Material utilisation; Die opening; Model and application | 1346–1353 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Tapped Hole Design (Drill, Engagement and Depth)** `tapped-hole-design` | CALCULATED | Engagement length; Blind hole; Model and application | 1536, 2029–2031 | Automated + cross-check |

### Pneumatics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Pneumatic Cylinder Sizing, Air Use and Running Cost** `pneumatic-cylinder-sizing` | CALCULATED | Cushioning; Valve and tubing; Model and application | 3421–3425, 3030–3037 | Automated + cross-check |

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Disc Spring Stack Design** `disc-spring-stack-design` | STACK FEASIBLE | Stress; Guiding; Model and application | 350–353 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Hydraulic Motor Drive Sizing** `hydraulic-motor-drive` | MOTOR ADEQUATE | Pressure; Starting torque; Model and application | 3418–3425 | Automated + cross-check |

## Machinery’s Handbook topic tools, fourteenth pass: integrated design checks, fifth round (added 26 October 2026)

A fifth round of 9 integrated design checks in batch handbook30: lathe chuck grip force with centrifugal loss and the safe speed, machine coolant system sizing, rotary index table drive (inertia, profile, motor torque, holding torque), rack-and-pinion axis sizing with a Lewis tooth check, hoist drive sizing (line pull, rope factor, drum, gearbox, motor rating, brake), a heat-treatment furnace load plan (heat-up time, energy, cost per kg), crank press capacity above bottom from the slider-crank geometry, pipe thermal expansion with anchor force and loop leg length, and gear backlash at operating temperature. Tests cross-check each against the coolant, pump, rack-and-pinion, Lewis, wire-rope, heating-energy and thermal-stress tools. WORKOS now holds 504 tools.

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Lathe Chuck Grip Force and Speed Limit** `chuck-grip-force` | GRIP ADEQUATE | Chuck rating; Speed; Model and application | 1084–1101, 3131–3134 | Automated + cross-check |
| **Machine Coolant System Sizing** `coolant-system-sizing` | CALCULATED | Chip handling; Model and application | 1112–1121, 1183–1190 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Rotary Index Table Drive Sizing** `rotary-index-table-sizing` | CALCULATED | Inertia ratio; Holding; Model and application | 171, 2284–2290 | Automated + cross-check |
| **Rack and Pinion Axis Sizing** `rack-pinion-axis-sizing` | TEETH ADEQUATE | Tooth bending; Vertical axis; Model and application | 2131–2140, 2219 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Hoist Drive Sizing (Rope, Drum, Gearbox, Motor and Brake)** `hoist-drive-sizing` | ROPE AND DRUM ADEQUATE | Rope safety factor; Drum D/d; Certification; Model and application | 2613–2625, 3444–3450 | Automated + cross-check |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Heat-Treatment Furnace Load Plan (Time, Energy, Cost)** `furnace-heat-treat-plan` | CALCULATED | Model and application | 472–480, 372–376 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Mechanical (Crank) Press Capacity Above Bottom** `crank-press-capacity` | PRESS UNDERSIZED AT THIS HEIGHT | Force at height; Energy; Model and application | 1386–1392, 1342 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Pipe Thermal Expansion, Anchor Force and Expansion Loop** `pipe-expansion-loop` | CALCULATED | Restraint; Piping code; Model and application | 375–378, 3401–3402 | Automated + cross-check |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Gear Backlash at Operating Temperature** `gear-backlash-temperature` | BACKLASH REMAINS | Running backlash; Model and application | 2163–2167, 375–378 | Automated + cross-check |

## Machinery’s Handbook topic tools, fifteenth pass: integrated design checks, sixth round (added 26 October 2026)

A sixth round of 9 integrated design checks in batch handbook31: the pump operating point on the system curve (with efficiency, power, position against best efficiency and the speed for a target flow), fan duty with the fan laws and belt drive, machine foundation block sizing (bearing pressure and resonance), measurement error from part and gauge temperature, pressure vessel shell and head thickness comparison, fixture locating error from round and diamond pin clearances, gasketed flange bolt load, chain conveyor pull and drive, and rail travel drive sizing with a wheel-slip check. Tests cross-check against the pump-affinity, thermal-growth and rolling-resistance tools and confirm the operating point lies on both curves. WORKOS now holds 513 tools.

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Pump Operating Point on the System Curve** `pump-operating-point` | NEAR BEST EFFICIENCY | Operating region; Speed change; Model and application | 3021–3026 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Fan Duty, Fan Laws and Belt Drive** `fan-drive-sizing` | CALCULATED | Fan speed limit; Belt and bearings; Model and application | 2487–2536 | Automated + cross-check |
| **Chain Conveyor Pull and Drive Sizing** `chain-conveyor-sizing` | CHAIN ADEQUATE | Chain working load; Sprocket teeth; Model and application | 2537–2556 | Automated + cross-check |
| **Rail Travel Drive Sizing (Crane, Trolley or Transfer Car)** `travel-drive-sizing` | NO WHEEL SLIP | Adhesion; Model and application | 165–167, 2569–2580 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Machine Foundation Block Sizing** `machine-foundation-block` | FOUNDATION ACCEPTABLE | Soil bearing; Resonance; Engineering; Model and application | 3237–3238, 197–198 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Measurement Error from Part and Gauge Temperature** `measurement-temperature-error` | CORRECT OR WAIT FOR TEMPERATURE | Tolerance share; Model and application | 375–378, 2660 | Automated + cross-check |
| **Fixture Locating Error from Pin and Hole Clearances** `fixture-locating-error` | LOCATING ADEQUATE | Position tolerance; Model and application | 3131–3134, 620–623 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Pressure Vessel Shell and Head Thickness Comparison** `pressure-vessel-thickness` | CALCULATED | Thin-wall range; Code; Model and application | 290–294 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Gasketed Flange Bolt Load Check** `flange-bolt-load-check` | BOLTING ADEQUATE | Bolt area; Flange design; Model and application | 1521–1536, 3392–3404 | Automated + cross-check |

## Machinery’s Handbook topic tools, sixteenth pass: integrated design checks, seventh round (added 26 October 2026)

A seventh round of 9 integrated design checks in batch handbook32: bearing fit and operating internal clearance with a preload check, overhung load on gearbox and motor shafts corrected for hub position, an injection moulding estimate (clamp force, shot size, cooling time, cycle and output), bearing friction with circulating oil flow, press brake set-up (die opening, inside radius, minimum flange, tonnage), gearbox selection with service factor, thermal and torque checks, riveted joint design with the balanced pitch, vertical storage tank shell thickness by course, and milling cost per part with tool life. Tests cross-check against the bearing-friction, coolant, press-brake and riveted-joint tools. WORKOS now holds 522 tools.

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Bearing Fit and Operating Internal Clearance** `bearing-fit-clearance` | CLEARANCE ADEQUATE | Minimum operating clearance; Model and application | 2365–2416 | Automated + cross-check |
| **Overhung (Radial) Load on a Gearbox or Motor Shaft** `overhung-load-check` | OVERHUNG LOAD ACCEPTABLE | Allowable; Fix; Model and application | 2487–2556, 2365–2416 | Automated + cross-check |
| **Bearing and Gear Losses with Circulating Oil Flow** `bearing-friction-oil-flow` | CALCULATED | Model and application | 2365–2440 | Automated |
| **Gearbox Selection Check (Service Factor, Thermal and Torque)** `gearbox-selection-check` | GEARBOX SUITABLE | Mechanical rating; Thermal rating; Output torque; Model and application | 3339–3340, 3304–3313 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Injection Moulding Clamp, Shot, Cooling and Cycle Estimate** `injection-moulding-estimate` | MACHINE SUITABLE | Clamp force; Shot size; Model and application | 584–592 | Automated + cross-check |
| **Milling Time and Cost per Part with Tool Life** `milling-cost-per-part` | CALCULATED | Model and application | 1084–1101, 1146–1152 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Press Brake Set-up: Die, Radius, Flange and Tonnage** `press-brake-setup` | SET-UP FEASIBLE | Press capacity; Die rating; Radius; Model and application | 1346–1353, 1383–1386 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Riveted Joint Design (Balanced Pitch and Rivet Count)** `riveted-joint-design` | JOINT ADEQUATE | Capacity; Minimum pitch; Model and application | 1735–1745 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Vertical Storage Tank Shell Thickness by Course** `storage-tank-shell` | CALCULATED | Standard; Model and application | 290–294, 3021–3026 | Automated + cross-check |

## Machinery’s Handbook topic tools, seventeenth pass: integrated design checks, eighth round (added 26 October 2026)

An eighth round of 9 integrated design checks in batch handbook33: spline joint design (engagement length, root, tooth-shear and compressive stresses), ball-screw axis stiffness with preload, drag torque and axial frequency, electric tank heater sizing with heat-up time and watt density, hydraulic line sizing (velocity, pressure drop and Barlow tube rating), spring-applied holding brake sizing (stop time, energy per stop and per hour, holding factor), weld preheat and t8/5 cooling time screening, snap-fit joint design with retention force, worm gear drive design with forces, oil temperature and self-locking, and lifting lug design. Tests cross-check against the spline torque capacity, heating energy, pipe friction, pipe size by velocity, carbon equivalent, welding heat input, snap-fit, worm gear and bolt and pin shear tools. WORKOS now holds 531 tools.

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Spline Joint Design (Engagement Length and Stresses)** `spline-joint-design` | SPLINE ADEQUATE | Root shear; Engagement length; Practical length; Model and application | 2255–2282 | Automated + cross-check |
| **Worm Gear Drive Design (Efficiency, Forces and Heat)** `worm-gear-drive-design` | DRIVE SUITABLE | Oil temperature; Self-locking; Rating; Model and application | 2191–2194 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Ball-Screw Axis Stiffness, Preload and Axial Frequency** `ballscrew-axis-stiffness` | AXIS STIFF ENOUGH | Deflection; Axial frequency; Preload holds; Preload level; Model and application | 2561–2568 | Automated + cross-check |
| **Spring-Applied Holding Brake Sizing (Stop Time, Energy and Holding)** `holding-brake-sizing` | BRAKE SUITABLE | Stop time; Holding; Energy per stop; Energy per hour; Model and application | 2455–2459 | Automated + cross-check |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Electric Tank Heater Sizing (Heat-up, Losses and Watt Density)** `tank-heater-sizing` | HEATER ADEQUATE | Heat-up time; Watt density; Control; Model and application | 371–378 | Automated + cross-check |
| **Snap-Fit Joint Design (Deflection, Assembly and Retention Forces)** `snap-fit-joint-design` | SNAP-FIT WORKS | Strain; Retention; Root radius; Model and application | 593–605 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Hydraulic Line Sizing (Velocity, Pressure Drop and Tube Rating)** `hydraulic-line-sizing` | LINE ADEQUATE | Velocity; Pressure rating; Pressure drop; Fittings and hose; Model and application | 3024–3027, 281–286 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Weld Preheat and Cooling Time Check (CE, Heat Input, t8/5)** `weld-preheat-check` | PROCEDURE PLAUSIBLE | Preheat against the estimate; Cooling time; Code preheat; Procedure; Model and application | 1431–1449 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Lifting Lug Design (Plate, Pin and Bearing Checks)** `lifting-lug-design` | LUG ADEQUATE | Net tension; Tear-out; Bearing; Pin shear; Hole clearance; Lifting code; Model and application | 1535, 1720–1735 | Automated + cross-check |

## Machinery’s Handbook topic tools, eighteenth pass: integrated design checks, ninth round (added 26 October 2026)

A ninth round of 9 integrated design checks in batch handbook34: helical gear set design (geometry, tangential, axial and separating forces, Lewis bending in the normal plane), straight bevel gear set design (cone angles, forces at the mean diameter, bevel Lewis bending, face width), hydrodynamic journal bearing design (unit load, L/D, Sommerfeld number, Petroff friction and oil flow), an extension spring designer with hook bending and torsion stresses, initial-tension range and natural frequency, a motor duty cycle check for a trapezoidal move (segment torques, RMS and peak, inertia ratio, energy returned), timing belt drive design (belt length, centre distance, teeth in mesh, belt width), heat exchanger sizing (duty, cold outlet, LMTD, area and approach), a surface grinding planner (wheel speed, removal rate, power, passes and time) and compression strut sizing in bar or tube (Euler or Johnson, least diameter by search). Tests cross-check against the helical gear, Lewis bending, bevel gear, Petroff, coolant flow, extension spring, RMS torque, timing belt, LMTD, grinding geometry and column buckling tools. WORKOS now holds 540 tools.

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Helical Gear Set Design (Geometry, Forces and Bending)** `helical-gear-set-design` | GEAR SET ADEQUATE | Bending stress; Overlap ratio; Thrust bearings; Model and application | 2195–2210, 2131–2160 | Automated + cross-check |
| **Straight Bevel Gear Set Design (Geometry, Forces and Bending)** `bevel-gear-set-design` | GEAR SET ADEQUATE | Bending stress; Face width; Mounting; Model and application | 2181–2190, 2131–2160 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Hydrodynamic Journal Bearing Design (Load, Friction, Heat and Oil)** `journal-bearing-design` | BEARING ADEQUATE | Unit load; L/D; Film; Starting; Model and application | 2326–2345 | Automated + cross-check |
| **Servo or Motor Duty Cycle Check (Move Profile, RMS and Peak)** `motor-duty-cycle-check` | MOTOR SUITABLE | Continuous (RMS) torque; Peak torque; Speed; Inertia ratio; Model and application | 2569–2580, 180–186 | Automated + cross-check |
| **Timing Belt Drive Design (Length, Mesh and Belt Width)** `timing-belt-drive-design` | DRIVE ADEQUATE | Belt width; Teeth in mesh; Belt speed; Model and application | 2473–2535 | Automated + cross-check |

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Extension Spring Designer (Body, Hooks, Initial Tension, Frequency)** `extension-spring-designer` | SPRING ADEQUATE | Body stress; Hook bending; Hook torsion; Initial tension; Model and application | 325–340 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Heat Exchanger Sizing (Duty, Outlet Temperature and Area)** `heat-exchanger-sizing` | EXCHANGER ADEQUATE | Area; Approach temperature; Fouling; Model and application | 371–378 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Surface Grinding Planner (Speeds, Removal Rate, Power and Time)** `surface-grinding-planner` | PLAN FEASIBLE | Wheel speed; Spindle power; Burn; Model and application | 1199–1268 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Compression Strut Sizing (Euler or Johnson, Round Bar or Tube)** `compression-strut-sizing` | STRUT ADEQUATE | Buckling; Local buckling; End fixity; Model and application | 281–287 | Automated + cross-check |

## Machinery’s Handbook topic tools, nineteenth pass: integrated design checks, tenth round (added 26 October 2026)

A tenth round of 9 integrated design checks in batch handbook35: a torsion spring designer (straight-leg deflection, curvature-corrected bending stress, largest safe angle, wound diameter and arbor clearance), planetary gear set design (ratio, equal-spacing and adjacency checks, sun torque, force per planet with load sharing, pin load, sun bending), a turning cut planner (speed held to the machine maximum, passes, power, torque, theoretical finish and time), flat belt drive design (wrap, length, tensions with centrifugal tension, belt width from the allowable stress), caliper disc brake design (clamp force, pad pressure, energy and disc temperature rise), circular cover plate design (thickness for stress and for deflection), hydraulic power unit sizing (pump displacement, shaft power, reservoir, heat and cooler), linear guide selection (four-carriage loads with offset and acceleration, life and static safety) and a hydraulic cylinder structural check (Lamé barrel with least wall and bore growth, end cap, rod buckling). Tests cross-check against the torsion spring, planetary gear, Lewis bending, turning power, turning cusp, turning time, belt drive tensions, circular plate, hydraulic power, pressure cylinder and column buckling tools. WORKOS now holds 549 tools.

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Torsion Spring Designer (Angle, Stress, Legs and Arbor)** `torsion-spring-designer` | SPRING ADEQUATE | Bending stress; Arbor clearance; Body length; Model and application | 333–343 | Automated + cross-check |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Planetary Gear Set Design (Ratio, Assembly, Forces and Bending)** `planetary-gear-set-design` | GEAR SET ADEQUATE | Equal spacing; Planet adjacency; Sun bending; Model and application | 2211, 2122–2160 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Turning Cut Planner (Speed, Power, Torque, Finish and Time)** `turning-cut-planner` | CUT FEASIBLE | Spindle power; Spindle torque; Surface finish; Chip control; Model and application | 1084–1101, 1023–1030 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Flat Belt Drive Design (Wrap, Tensions and Belt Width)** `flat-belt-drive-design` | BELT ADEQUATE | Belt width; Belt speed; Wrap; Model and application | 2473–2520 | Automated + cross-check |
| **Caliper Disc Brake Design (Clamp Force, Pad Pressure, Heat)** `disc-brake-design` | BRAKE ADEQUATE | Clamp force; Pad pressure; Disc heating; Model and application | 2455–2459 | Automated + cross-check |
| **Linear Guide Selection (Carriage Loads, Life and Static Safety)** `linear-guide-selection` | GUIDE ADEQUATE | Life; Static safety; Lift-off; Model and application | 2365–2416 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Circular Cover Plate Design (Thickness for Stress and Deflection)** `cover-plate-design` | COVER ADEQUATE | Stress; Deflection; Thin-plate range; Bolting; Model and application | 288–290 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Hydraulic Power Unit Sizing (Pump, Motor, Reservoir, Cooling)** `hydraulic-power-unit-sizing` | MOTOR ADEQUATE | Motor power; Cooling; Pump selection; Model and application | 3421–3425, 371–378 | Automated + cross-check |
| **Hydraulic Cylinder Structure (Barrel, End Cap and Rod Buckling)** `hydraulic-cylinder-structure` | CYLINDER ADEQUATE | Barrel; End cap; Rod buckling; Seals; Model and application | 290–294, 281–288, 3421–3425 | Automated + cross-check |

## Machinery’s Handbook topic tools, twentieth pass: integrated design checks, eleventh round (added 26 October 2026)

An eleventh round of 9 integrated design checks in batch handbook36: a deep drawing plan (blank, draw-by-draw diameters, drawing and blank-holder forces, press check), a broaching plan (pitch, teeth engaged, force, broach length, stroke and time), shaft critical speed with up to three masses (Dunkerley and Rayleigh), Geneva drive dynamics (peak acceleration, roller force and driver torque), a friction-grip bolted joint (preload, torque, slip resistance and bearing backup), flexible coupling selection (service and peak torque, speed, combined misalignment, bore and hub key), a punching operation plan (force with stripping, punch stress, smallest punch, clearance and energy), toggle clamp design (cylinder force, clamping force, angle for the required force, travels and link stress) and a cylindrical traverse grinding planner. Tests cross-check against the shell blank, draw reductions, broach pitch, critical speed, Geneva mechanism, bolt torque–preload, bolt and pin shear, key stress, punching force, pneumatic cylinder force, toggle joint, grinding geometry and grinding cycle time tools. WORKOS now holds 558 tools.

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Deep Drawing Plan (Blank, Draws, Forces and Press)** `deep-drawing-plan` | PRESS ADEQUATE | Press capacity; Annealing; Model and application | 1353–1361 | Automated + cross-check |
| **Punching Operation Plan (Force, Stripping, Punch Stress, Clearance)** `punching-operation-plan` | PUNCHING FEASIBLE | Press capacity; Punch stress; Off-centre load; Model and application | 1338–1346 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Broaching Plan (Pitch, Teeth, Force, Broach Length and Time)** `broaching-plan` | BROACHING FEASIBLE | Machine pull; Stroke; Teeth in the cut; Model and application | 980–990 | Automated + cross-check |
| **Cylindrical Grinding Planner (Traverse: Speeds, Power and Time)** `cylindrical-grinding-planner` | PLAN FEASIBLE | Wheel speed; Spindle power; Burn; Model and application | 1199–1268 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Shaft Critical Speed with Several Masses (Dunkerley and Rayleigh)** `shaft-critical-speed-check` | BELOW CRITICAL | Separation; Passing through; Model and application | 197, 302 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Geneva Drive Design (Acceleration, Pin Force and Drive Torque)** `geneva-drive-design` | DRIVE ADEQUATE | Roller force; Driver torque; Entry; Model and application | 171 | Automated + cross-check |
| **Toggle Clamp Design (Cylinder, Toggle Angle and Clamping Force)** `toggle-clamp-design` | CLAMP ADEQUATE | Clamping force; Link stress; Small angle; Model and application | 172–174 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Friction-Grip (Slip-Resistant) Bolted Joint** `friction-grip-joint` | NO SLIP | Slip; Bearing-type backup; Tightening method; Model and application | 1521–1535, 1720–1735 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Flexible Coupling Selection (Torque, Speed, Misalignment, Bore and Key)** `flexible-coupling-selection` | COUPLING SUITABLE | Nominal torque; Peak torque; Speed; Misalignment; Hub key; Model and application | 302–304, 2460–2486 | Automated + cross-check |

## Machinery’s Handbook topic tools, twenty-first pass: integrated design checks, twelfth round (added 26 October 2026)

A twelfth round of 9 integrated design checks in batch handbook37: a fatigue design check (corrected endurance limit, fatigue notch factor, Goodman, Soderberg and Gerber factors, yield, finite life from the S-N line), crane hook design (curved-beam stresses at working and proof load, shank thread), a single or double Cardan drive (speed fluctuation, phasing for constant velocity, inertia torques, peak joint torque), tolerance stack design (worst case, RSS, predicted rejects from process capability), semi-elliptic leaf spring design (leaves for stress and deflection), a lathe threading plan (infeed per pass, spindle speed limit, time), a clevis pin joint (pin bending, shear, bearing, eye tension and tear-out), O-ring groove design (depth and width for target squeeze and fill, mating diameter, extrusion gap) and flywheel rim design (inertia for the speed fluctuation, bore, mass, rim speed, rotating stress). Tests cross-check against the fatigue notch factor, Goodman fatigue, S-N fatigue life, curved beam, universal joint, RSS tolerance stack, leaf spring, thread infeed, bolt and pin shear, O-ring gland, flywheel energy and rotating disc tools. WORKOS now holds 567 tools.

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Fatigue Design Check (Corrected Endurance, Notch, Mean Stress, Life)** `fatigue-design-check` | INFINITE LIFE | Goodman and yield; Life; Data; Model and application | 200–211, 280, 358 | Automated + cross-check |
| **Crane Hook Design (Curved-Beam Stress, Proof Load and Shank)** `crane-hook-design` | HOOK ADEQUATE | Working load; Proof load; Shank; Standard; Model and application | 274–276, 1521–1535 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Universal-Joint Drive (Single or Double Cardan: Speed, Torque, Inertia)** `universal-joint-drive` | DRIVE ADEQUATE | Joint angles; Constant velocity; Joint torque; Model and application | 2445–2446 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Tolerance Stack Design (Worst Case, RSS and Predicted Rejects)** `tolerance-stack-design` | STACK MEETS WORST CASE | Worst case; RSS; Predicted rejects; Model and application | 628–634, 128–130 | Automated + cross-check |

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Semi-Elliptic Leaf Spring Design (Leaves for Stress and Deflection)** `leaf-spring-design` | SPRING ADEQUATE | Stress; Deflection; Leaf count; Model and application | 344–345 | Automated + cross-check |

### Threads

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Lathe Threading Plan (Infeed per Pass, Spindle Speed and Time)** `lathe-threading-plan` | PLAN FEASIBLE | First pass; Last pass; Run-in; Model and application | 2037–2042, 1289–1300 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Clevis Pin Joint Design (Pin Bending, Shear, Bearing and Eye)** `clevis-pin-joint` | PIN JOINT ADEQUATE | Pin bending; Pin shear; Eye bearing; Fork bearing; Eye net tension; Eye tear-out; Model and application | 1535, 1720–1735 | Automated + cross-check |

### Engineering

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **O-Ring Groove Design (Depth, Width, Bore and Extrusion Gap)** `o-ring-groove-design` | GROOVE ADEQUATE | Squeeze; Fill; Stretch; Extrusion gap; Model and application | 2591–2610 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Flywheel Rim Design (Inertia for Speed Fluctuation, Size and Stress)** `flywheel-rim-design` | FLYWHEEL ADEQUATE | Rotating stress; Rim speed; Guarding; Model and application | 3000–3010, 179–190 | Automated + cross-check |

## Machinery’s Handbook topic tools, twenty-second pass: integrated design checks, thirteenth round (added 26 October 2026)

A thirteenth round of 9 integrated design checks in batch handbook38: a rotor balancing check (permissible unbalance from the grade, plane unbalance, correction masses and bearing force), gear tooth measurement for backlash (span and over-pins limits), thread pitch diameter by three wires with accept or reject, torsion bar design (diameter for stress and twist, rate, tip travel), a tube bending plan (developed length, wall thinning, strain, bend radius ratio, overbend), shaft deflection and bearing slope under up to three loads, an electroplating plan (time, current, loads, energy and cost per part), bracket bolts in tension and shear with the combined check, and a spur gear pair designed to a given centre distance (profile shifts, tip shortening, contact ratio, undercut). Tests cross-check against the balance grade, two-plane balance, span measurement, gear over pins, three-wire, metric thread limits, torsion bar, tube bend length, tube bend thinning, beam cases, electroplating thickness, bolt and pin shear, profile shift and contact ratio tools. WORKOS now holds 576 tools.

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Rotor Balancing Check (Grade, Plane Unbalance and Corrections)** `rotor-balancing-check` | CORRECT AND RE-CHECK | Plane A; Plane B; Correction size; Model and application | 191–195 | Automated + cross-check |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Gear Tooth Measurement for Backlash (Span and Over Pins)** `gear-tooth-measurement` | MEASUREMENT SET | Anvils fit across the face; Backlash share; Model and application | 2236–2248 | Automated + cross-check |
| **Gear Pair for a Given Centre Distance (Profile Shift, Tips, Contact Ratio)** `gear-centre-distance-design` | GEAR PAIR FEASIBLE | Pinion undercut; Gear undercut; Contact ratio; Tip thickness; Model and application | 2141–2160 | Automated + cross-check |

### Threads

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Thread Pitch Diameter by Three Wires (Accept or Reject)** `thread-wire-inspection` | ACCEPT | Pitch diameter; Wire size; Model and application | 1990–2003, 1867–1912 | Automated + cross-check |

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Torsion Bar Spring Design (Diameter for Stress and Twist)** `torsion-bar-design` | BAR ADEQUATE | Shear stress; Twist; Ends; Model and application | 295–303, 344 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Tube Bending Plan (Length, Wall Thinning, Strain and Overbend)** `tube-bending-plan` | BEND FEASIBLE | Outer wall; Bend radius; Strain; Mandrel; Model and application | 1382–1386 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Shaft Deflection and Bearing Slope (Up to Three Loads)** `shaft-deflection-check` | SHAFT STIFF ENOUGH | Deflection at the loads; Bearing slope; Bending stress; Model and application | 257–277, 295–303 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Electroplating Plan (Time, Current, Loads and Cost per Part)** `electroplating-plan` | PLAN FEASIBLE | Rectifier; Current density; Thickness distribution; Model and application | 1467, 1500–1516 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Bracket Bolts in Tension and Shear (Moment on a Bolted Flange)** `bracket-bolt-tension` | BOLTS ADEQUATE | Tension; Shear; Combined; Prying; Model and application | 1521–1535, 1720–1735 | Automated + cross-check |

## Machinery’s Handbook topic tools, twenty-third pass: integrated design checks, fourteenth round (added 26 October 2026)

A fourteenth round of 9 integrated design checks in batch handbook39: a sine-bar set-up (stack height, rounding and total angle error against the tolerance), internal taper inspection with two balls (angle and top diameter, accept or reject), a thread milling plan (speed, programmed centre feed, radial passes, batch time), a gear hobbing plan (time, sharpening and hob cost per gear, batch cost), accumulator circuit sizing (pump deficit, gas volume, recharge time), meter-out cylinder speed control (rod-side pressure, orifice diameter, heat), pipe insulation design (thickness for surface temperature and loss, saving and payback), a sheet-metal flat pattern for up to four bends, and a ball-nose finishing plan (stepover for the scallop, effective diameter, speed, feed and time). Tests cross-check against the sine bar, gauge block stack, taper balls, thread milling path, hobbing time, accumulator size, orifice flow, insulated pipe, bend allowance, scallop height and ball nose diameter tools. WORKOS now holds 585 tools.

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Sine-Bar Set-up (Stack Height, Rounding and Angle Error)** `sine-bar-setup` | SET-UP ADEQUATE | Angle error; Angle range; Stack; Model and application | 676–682, 705–708 | Automated + cross-check |
| **Internal Taper Inspection with Two Balls (Accept or Reject)** `internal-taper-inspection` | ACCEPT | Angle; Top diameter; Model and application | 682–691 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Thread Milling Plan (Speed, Feeds, Radial Passes and Batch Time)** `thread-milling-plan` | PLAN FEASIBLE | Cutter size; Spindle speed; Model and application | 2058–2070, 1292–1300 | Automated + cross-check |
| **Ball-Nose Finishing Plan (Stepover, Speed, Feed and Time)** `ball-nose-finishing-plan` | FINISH MEETS TARGET | Scallop; Spindle speed; Model and application | 1039–1058, 1279–1300 | Automated + cross-check |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Gear Hobbing Plan (Time, Hob Life and Cost per Gear)** `gear-hobbing-plan` | PLAN FEASIBLE | Hob speed; Hob life; Model and application | 3347–3349 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Accumulator Circuit Sizing (Pump Deficit, Gas Volume, Recharge)** `accumulator-circuit-sizing` | ACCUMULATOR ADEQUATE | Size; Recharge; Precharge; Model and application | 352–368 | Automated + cross-check |
| **Cylinder Meter-Out Speed Control (Orifice, Intensification, Heat)** `cylinder-speed-control` | CONTROL ADEQUATE | Pump flow; Rod-side pressure; Heat; Model and application | 3024–3027, 352–368 | Automated + cross-check |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Pipe Insulation Design (Thickness for Surface Temperature and Loss, Payback)** `pipe-insulation-design` | INSULATION ADEQUATE | Surface temperature; Heat loss; Jacketing; Model and application | 371–378 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Sheet-Metal Flat Pattern (Up to Four Bends)** `sheet-metal-flat-pattern` | PATTERN FEASIBLE | Flanges; Inside radius; Model and application | 1346–1353 | Automated + cross-check |

## Machinery’s Handbook topic tools, twenty-fourth pass: integrated design checks, fifteenth round (added 26 October 2026)

A fifteenth round of 9 integrated design checks in batch handbook40: drop impact on a beam (impact factor, dynamic stress and deflection, energy, safe drop height), a through-feed centerless grinding plan (feed, passes, parts per hour, inclination for a target), a bandsaw cutting plan (time, bars, blades, cost per cut), an induction motor load assessment (current, slip, estimated load, torque, energy cost), a bolted joint at temperature (preload change from differential expansion), a bolt circle layout (coordinates, ligament, edge distance, wrench clearance), a tapping plan (tap drill, thread percentage, speed, batch time), machine tipping stability with anchor uplift, and a rope winch drum (tension ratio, turns, torque, power, rope factor). Tests cross-check against the beam impact, impact load, centerless feed, bandsaw time, motor power, motor slip, bolted joint design check, bolt circle, tap drill, tapping feed and belt friction tools. WORKOS now holds 594 tools.

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Drop Impact on a Beam (Impact Factor, Stress and Safe Drop Height)** `drop-impact-design` | BEAM SURVIVES THE DROP | Dynamic stress; Dynamic deflection; Contact; Model and application | 278, 179–186 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Through-Feed Centerless Grinding Plan (Feed, Passes, Output, Angle)** `centerless-grinding-plan` | OUTPUT REACHED | Output; Inclination for the target; Model and application | 1259–1261 | Automated + cross-check |
| **Bandsaw Cutting Plan (Time, Bars, Blades and Cost per Cut)** `sawing-plan` | BATCH FITS THE TIME | Time; Material; Model and application | 1182–1192 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Induction Motor Load Assessment (Current, Slip, Load, Energy)** `motor-load-assessment` | MOTOR LOAD NORMAL | Overload; Light load; Measurement; Model and application | 2569–2580 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Bolted Joint at Temperature (Preload Change from Differential Expansion)** `bolted-joint-temperature` | PRELOAD HOLDS | Clamp; Proof load; Other extreme; Model and application | 1521–1536, 371–378 | Automated + cross-check |

### Geometry

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Bolt Circle Layout (Coordinates, Ligament, Edge and Wrench Clearance)** `bolt-circle-layout` | LAYOUT ADEQUATE | Ligament; Edge distance; Wrench clearance; Model and application | 686 | Automated + cross-check |

### Threads

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Tapping Plan (Tap Drill, Thread Percentage, Speed and Cycle Time)** `tapping-plan` | DRILL ACCEPTABLE | Thread percentage; Tap type; Model and application | 2029–2036 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Machine Tipping Stability (Overturning, Safety Factor, Anchors)** `machine-tipping-stability` | ANCHORS NEEDED | Tipping; Anchors; Sliding; Model and application | 167–168, 221–227 | Automated + cross-check |
| **Rope Winch Drum and Capstan (Wraps, Holding Pull, Torque, Power)** `rope-winch-drum` | WINCH ADEQUATE | Holding; Rope; Wet rope; Model and application | 165–168 | Automated + cross-check |

## Machinery’s Handbook topic tools, twenty-fifth pass: integrated design checks, sixteenth round (added 26 October 2026)

A sixteenth round of 9 integrated design checks in batch handbook41: a casting pour plan (moduli, riser feed volume, metal poured, yield, choke area, ladle), a coating job estimate (coats, thinner, wet film, labour, cost per square metre), valve closure surge against the pipe rating with the closing time needed, control valve sizing (Kv, opening, authority, full-open flow), vacuum gripper sizing (cup size and count, evacuation time), wind load on a sign post (force, base stress, deflection), noise exposure (combined sources, distance, dose), process capability from X-bar R data (sigma, limits, Cp, Cpk, ppm) and corrosion remaining life with the next inspection. Tests cross-check against the casting solidification, gating choke area, coating coverage, water hammer, valve flow coefficient, vacuum cup, wind pressure, sound level, X-bar R limits, normal out-of-spec and corrosion rate tools. WORKOS now holds 603 tools.

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Casting Pour Plan (Riser, Feed Volume, Gating and Ladle)** `casting-pour-plan` | POUR PLAN ADEQUATE | Riser modulus; Feed volume; Ladle; Model and application | 1404–1420 | Automated + cross-check |
| **Coating Job Estimate (Coats, Material, Thinner, Labour, Film)** `coating-job-estimate` | ESTIMATE READY | Wet film; Transfer efficiency; Model and application | 1500–1516 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Valve Closure Surge (Water Hammer against Pipe Rating)** `valve-closure-surge` | SURGE WITHIN RATING | Rating; Closing time; Analysis; Model and application | 3024–3027 | Automated + cross-check |
| **Control Valve Sizing (Kv, Opening, Authority, Full-Open Flow)** `control-valve-sizing` | VALVE SUITABLE | Opening at design; Authority; Cavitation; Model and application | 3024–3027 | Automated + cross-check |

### Pneumatics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Vacuum Gripper Sizing (Cups, Diameter, Holding and Evacuation Time)** `vacuum-gripper-sizing` | GRIPPER ADEQUATE | Holding; Evacuation time; Leakage; Model and application | 3032–3041 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Wind Load on a Sign or Panel Post (Force, Base Moment, Stress, Deflection)** `wind-load-on-post` | POST ADEQUATE | Stress; Deflection; Base; Model and application | 3028, 257–277 | Automated + cross-check |

### Engineering

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Noise Exposure Check (Combined Sources, Distance, Dose)** `noise-exposure-check` | EXPOSURE WITHIN LIMIT | Dose; Measurement; Model and application | 3455–3456 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Process Capability Check (σ from R̄, Cp, Cpk, Rejects, Limits)** `process-capability-check` | PROCESS CAPABLE | Cpk; Centring; Stability; Model and application | 128–133 | Automated + cross-check |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Corrosion Remaining Life and Inspection Interval** `corrosion-remaining-life` | LIFE ADEQUATE | Thickness; Life; Localised corrosion; Model and application | 1500–1516, 290–294 | Automated + cross-check |

## Machinery’s Handbook topic tools, twenty-sixth pass: integrated design checks, seventeenth round (added 26 October 2026)

A seventeenth round of 9 integrated design checks in batch handbook42: hydraulic filter selection (beta ratios to the ISO 4406 code, element pressure drop), submerged tank flotation with the concrete ballast needed, cable span design (catenary tension, reactions, clearance, stretch), system reliability from Weibull blocks with redundancy and MTTF, a learning-curve quote (hours, unit cost, price, offered margin), acceptance sampling plan design (n and c for producer and consumer risk, AOQL), a measurement uncertainty budget (combined and expanded uncertainty, test ratio, guard band), furnace wall design with surface convection and radiation, and fastener position tolerance (floating or fixed) with a part check. Tests cross-check against the ISO cleanliness code, filter beta ratio, buoyancy, catenary cable, Weibull reliability, learning curve, sampling OC, Abbe error, wall heat loss, radiant heat and true position tools. WORKOS now holds 612 tools.

### Maintenance

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Hydraulic Filter Selection (Beta Ratios, Cleanliness Code, Pressure Drop)** `hydraulic-filter-selection` | FILTER SUITABLE | Cleanliness; Pressure drop; Ingression; Model and application | 2439–2442 | Automated + cross-check |
| **System Reliability from Weibull Components (Series and Redundancy)** `system-reliability` | TARGET MET | Reliability; Common cause; Model and application | 128–133 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Buried or Submerged Tank Flotation Check (Uplift and Ballast)** `submerged-tank-flotation` | TANK HELD DOWN | Flotation; Hold-down straps; Model and application | 3027 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Cable Span Design (Catenary Sag, Tension, Clearance and Stretch)** `cable-span-design` | SPAN ADEQUATE | Cable strength; Clearance; Temperature and creep; Model and application | 2999 | Automated + cross-check |

### Money

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Learning-Curve Quote (Batch Hours, Cost and Price per Unit)** `learning-curve-quote` | OFFER ACCEPTABLE | Margin; Learning rate; Model and application | 146, 134–146 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Acceptance Sampling Plan (n and c for Producer and Consumer Risk)** `acceptance-sampling-plan` | PLAN PROTECTS BOTH | Producer’s risk; Consumer’s risk; Model and application | 128–133 | Automated + cross-check |
| **Measurement Uncertainty Budget (Combined, Expanded, Test Ratio)** `measurement-uncertainty-budget` | MEASUREMENT CAPABLE | Test uncertainty ratio; Guard band; Model and application | 709–735 | Automated + cross-check |
| **Fastener Position Tolerance (Floating or Fixed) and Part Check** `fastener-position-tolerance` | ACCEPT | Position; Size; Projected zone; Model and application | 615–627 | Automated + cross-check |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Furnace Wall Design (Layers, Convection and Radiation from the Surface)** `furnace-wall-design` | WALL ADEQUATE | Surface temperature; Insulation service limit; Conductivity data; Model and application | 371–378 | Automated + cross-check |

## Machinery’s Handbook topic tools, twenty-seventh pass: integrated design checks, eighteenth round (added 26 October 2026)

An eighteenth round of 9 integrated design checks in batch handbook43: equipment investment appraisal (NPV, IRR, simple and discounted payback, benefit–cost ratio, EUAC), a compressed-air leak audit (leak flow by size, share of capacity, cost, repair payback), a two-point lift with an off-centre load (centre of gravity, point loads, leg angles and tensions), rotor run-up time with start energy, tensile test evaluation (yield, tensile, elongation, reduction of area, modulus, true fracture), a Brinell test validity check, a compressor staging check (one or two stages, power and discharge temperature), spherical vessel design and a motor efficiency test with a Prony brake. Tests cross-check against the IRR, benefit–cost ratio, interest factors, air leak cost, combined centre of gravity, sling tension, mass moment of inertia, angular acceleration torque, true stress–strain, Brinell hardness, compressor power, gas compression process, spherical shell, Prony brake and motor power tools. WORKOS now holds 621 tools.

### Money

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Equipment Investment Appraisal (NPV, IRR, Payback, B/C, EUAC)** `investment-appraisal` | INVESTMENT JUSTIFIED | NPV at the hurdle rate; Payback; Sensitivity; Model and application | 139–146 | Automated + cross-check |

### Pneumatics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Compressed-Air Leak Audit (Leak Flow, Power, Cost and Repair Payback)** `air-leak-audit` | LEAKAGE ACCEPTABLE | Leakage share; Measurement; Model and application | 3032–3041 | Automated + cross-check |
| **Air Compressor Staging Check (Power and Discharge Temperature)** `compressor-staging-check` | DISCHARGE TEMPERATURE OK | Discharge temperature; Intercooler; Model and application | 3032–3041 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Two-Point Lift with an Off-Centre Load (Centre of Gravity, Leg Loads, Angles)** `two-point-lift-plan` | LIFT RIGGING ADEQUATE | Leg loads; Leg angles; Lift plan; Model and application | 2613–2650, 221–227 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Rotor Run-Up Time (Inertia, Acceleration Time, Start Energy)** `rotor-run-up-time` | START ACCEPTABLE | Start time; Starts per hour; Supply; Model and application | 228–240, 2569–2580 | Automated + cross-check |
| **Motor Efficiency Test with a Prony Brake (Torque, Output, Efficiency)** `motor-efficiency-test` | EFFICIENCY AS RATED | Efficiency; Load; Model and application | 2998–2999, 2569–2580 | Automated + cross-check |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Tensile Test Evaluation (Yield, UTS, Elongation, Reduction of Area, True Fracture)** `tensile-test-evaluation` | MEETS SPECIFICATION | Yield; Tensile; Elongation; Fracture position; Model and application | 1331–1334 | Automated + cross-check |
| **Brinell Hardness Test Check (Hardness, Validity Rules, Specification)** `brinell-test-check` | WITHIN SPECIFICATION | Indentation ratio; Specimen thickness; Edge distance; Spacing; Specification; Model and application | 1406–1412 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Spherical Pressure Vessel Design (Thickness, Stress, Capacity, Hydrotest)** `spherical-vessel-design` | SPHERE ADEQUATE | Safety factor; Hydrotest; Code; Model and application | 290–294 | Automated + cross-check |

## Machinery’s Handbook topic tools, twenty-eighth pass: integrated design checks, nineteenth round (added 26 October 2026)

A nineteenth round of 9 integrated design checks in batch handbook44: gyroscopic bearing load on a turning rotor, centrifugal load on a bolted attachment (overspeed stress and limiting speed), ratchet and pawl design (pitch, tooth force, face bearing, pawl pin), torsion member comparison (solid bar, tube, rectangle), gear ratio for inertia matching (optimum and usable ratio, motor torque), bolt preload verification from measured stretch (preload, deviation, nut factor, turn angle), spindle speed range design (step ratio, preferred series, speed loss), a tube or shell under external pressure (collapse factor and wall needed) and a journal bearing oil check (viscosity at temperature, Sommerfeld number, friction). Tests cross-check against the gyroscope precession, centrifugal force, ratchet wheel pitch, shaft torsion, rectangular bar torsion, reflected inertia, bolt stretch, bolt torque–preload, speed series, tube collapse, oil viscosity–temperature and Petroff tools. WORKOS now holds 630 tools.

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Gyroscopic Bearing Load on a Turning Rotor** `gyroscopic-bearing-load` | BEARINGS ADEQUATE | Bearing load; Load reversal; Model and application | 2998 | Automated + cross-check |
| **Centrifugal Load on a Bolted Attachment (Overspeed and Bolt Stress)** `centrifugal-attachment-check` | ATTACHMENT ADEQUATE | Overspeed stress; Trip setting; Locking; Model and application | 187–190, 1521–1535 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Ratchet and Pawl Design (Pitch, Tooth Force, Bearing and Pin)** `ratchet-pawl-design` | RATCHET ADEQUATE | Tooth face bearing; Pawl pin; Engagement; Model and application | 2215–2217, 1535 | Automated + cross-check |
| **Gear Ratio for Inertia Matching (Optimum Ratio and Motor Torque)** `inertia-matching-ratio` | RATIO SUITABLE | Motor speed; Peak torque; Inertia ratio; Model and application | 180–186, 2569–2580 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Torsion Member Comparison (Solid Bar, Tube or Rectangle)** `torsion-member-comparison` | SECTION ADEQUATE | Stress; Twist; Model and application | 295–303 | Automated + cross-check |
| **Tube or Shell under External Pressure (Collapse Thickness and Factor)** `vacuum-tube-design` | WALL ADEQUATE | Collapse factor; Roundness; Model and application | 293–294 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Bolt Preload Verification from Measured Stretch (and Nut Factor)** `bolt-preload-verification` | PRELOAD VERIFIED | Preload; Proof load; Nut factor; Model and application | 1521–1535 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Machine Spindle Speed Range Design (Geometric Series and Speed Loss)** `spindle-speed-range-design` | SPEED RANGE ADEQUATE | Speed loss; Low-speed torque; Model and application | 37–39 | Automated + cross-check |

### Maintenance

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Journal Bearing Oil Check (Viscosity at Temperature, Film and Friction)** `journal-bearing-oil-check` | OIL SUITABLE | Viscosity; Film; Extrapolation; Model and application | 2326–2345 | Automated + cross-check |

## Machinery’s Handbook topic tools, twenty-ninth pass: integrated design checks, twentieth round (added 26 October 2026)

A twentieth round of 9 integrated design checks in batch handbook45: compressed-air main sizing (pressure drop, velocity, smallest standard bore, receiver), an anodizing plan (720 rule time, rectifier, bath heat, cost per part), repair or replace (defender EUAC with a cost gradient against the challenger), make or buy (break-even quantity and saving), a block and tackle check (reeving efficiency, pull, rope factor, hand pull), restrained bar heating (thermal stress, yield and buckling temperatures), buffer stop design (energy, peak force, deceleration, stroke needed), a closed gas vessel temperature check (pressure rise and fill limit) and blow-off nozzle consumption and cost. Tests cross-check against the compressed-air pipe drop, air receiver, anodizing time, EUAC comparison, interest factors, process break-even, hoist mechanical advantage, thermal stress, column buckling, impact load, gas law and escaping air velocity tools. WORKOS now holds 639 tools.

### Pneumatics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Compressed-Air Main Sizing (Bore, Pressure Drop, Velocity, Receiver)** `air-main-sizing` | MAIN ADEQUATE | Pressure drop; Velocity; Drainage; Model and application | 3036–3041, 3024–3027 | Automated + cross-check |
| **Closed Gas Vessel Temperature Check (Pressure Rise, Contents, Fill Limit)** `gas-vessel-temperature-check` | WITHIN RATING | Hot pressure; Relief; Model and application | 3032–3041 | Automated + cross-check |
| **Compressed-Air Blow-Off Consumption (Nozzles, Air, Power and Cost)** `blow-off-nozzle-cost` | WITHIN COMPRESSOR CAPACITY | Capacity; Safety; Model and application | 3037–3038, 3032–3041 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Anodizing Plan (Time, Current, Tank Heat, Loads and Cost per Part)** `anodizing-plan` | PLAN FEASIBLE | Rectifier; Bath cooling; Thickness; Model and application | 1500–1516 | Automated + cross-check |

### Money

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Repair or Replace (Defender and Challenger Equivalent Annual Cost)** `repair-or-replace` | REPLACE THE MACHINE | Decision; Non-cost factors; Model and application | 134–146 | Automated + cross-check |
| **Make or Buy (In-House Cost against a Supplier Price, Break-Even)** `make-or-buy` | MAKE IN-HOUSE | Margin over break-even; Capacity; Model and application | 143–146, 1153–1160 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Block and Tackle Check (Pull with Sheave Friction, Rope and Operator)** `block-and-tackle-check` | TACKLE ADEQUATE | Rope; Hand pull; Model and application | 170–171, 2613–2650 | Automated + cross-check |
| **Buffer Stop Design (Impact Energy, Stroke, Force and Deceleration)** `buffer-stop-design` | BUFFER ADEQUATE | End stop force; Deceleration; Rebound; Model and application | 179–186 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Restrained Bar Heating (Thermal Stress, Yield and Buckling)** `restrained-bar-thermal-check` | BAR ADEQUATE | Yield; Buckling; Model and application | 375–376, 281–287 | Automated + cross-check |

## Machinery’s Handbook topic tools, thirtieth pass: integrated design checks, twenty-first round (added 26 October 2026)

A twenty-first round of 9 integrated design checks in batch handbook46: a horizontal tank calibration chart with dished heads, a guillotine shear check (force, energy, power, thickest sheet), a machine axis error budget (positioning, repeatability, Abbe, thermal, fixture; worst case and RSS), a plastic gear drive check (power rating and backlash at temperature and moisture), set-screw hub retention, a tank wall panel under liquid pressure, a crane wheel on rail (Hertz contact, mean wheel pressure, travel force), a bar stock plan (bars, yield, material cost, machine time) and a stockpile haulage plan (mass, truck loads, loader passes, ground pressure). Tests cross-check against the tank volume, vessel head volume, shearing blade force, Abbe error, thermal growth, plastic gear power, plastic thermal mismatch, set-screw holding, hydrostatic force, rectangular plate, Hertz contact, rolling resistance, screw machine stock and stockpile weight tools. WORKOS now holds 648 tools.

### Geometry

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Horizontal Tank Calibration Chart (Shell and Heads, Volume by Depth)** `tank-calibration-chart` | CALCULATED | Tank level; Model and application | 68–69, 82–87 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Guillotine Shear Check (Cutting Force, Energy, Power, Thickest Sheet)** `guillotine-shear-check` | SHEAR CAN CUT IT | Force; Power; Width; Blade clearance; Model and application | 1336–1338 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Machine Axis Error Budget (Positioning, Abbe, Thermal, Fixture)** `machine-axis-error-budget` | CAPABLE WORST CASE | RSS; Worst case; Model and application | 709–735, 375–376 | Automated + cross-check |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Plastic Gear Drive Check (Power Rating and Backlash at Temperature)** `plastic-gear-drive-check` | DRIVE ADEQUATE | Power rating; Backlash; Model and application | 604–606, 578–580 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Set-Screw Hub Retention (Torque, Axial Hold, Screws Needed)** `set-screw-hub-check` | SET SCREWS HOLD | Torque; Axial; Retention method; Model and application | 1699–1700 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Tank Wall Panel under Liquid Pressure (Force, Plate Stress, Deflection)** `tank-wall-panel-check` | PANEL ADEQUATE | Stress; Deflection; Large deflection; Model and application | 3024–3027, 288–290 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Crane or Trolley Wheel on Rail (Contact Stress, Wheel Pressure, Travel Force)** `crane-wheel-rail-check` | WHEEL ADEQUATE | Contact pressure; Mean wheel pressure; Hardened depth; Model and application | 2301–2309, 165–167 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Bar Stock Plan for Bar-Fed Parts (Bars, Yield, Material Cost, Machine Time)** `bar-stock-plan` | PLAN READY | Material yield; Set-up parts; Model and application | 1175–1176 | Automated + cross-check |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Stockpile Haulage Plan (Pile Mass, Truck Loads, Loading Time, Ground Pressure)** `stockpile-haulage-plan` | GROUND ADEQUATE | Ground pressure; Survey; Model and application | 382–383 | Automated + cross-check |

## Machinery’s Handbook topic tools, thirty-first pass: integrated design checks, twenty-second round (added 26 October 2026)

A twenty-second round of 9 integrated design checks in batch handbook47: a melting furnace batch plan (energy, melt time, melts and metal per shift, cost per kilogram), a Vickers hardness test check (hardness, thickness, spacing, edge distance and diagonal validity, specification), a spur gear mesh interference check (contact start diameters against the true involute form diameters, contact ratio), a finish turning set-up (feed for finish, nose-radius compensation, finishing time), coolant tank maintenance (concentration, correction, make-up mix, monthly use), a compound-angle sine plate set-up (true angle, plate angles, stacks), dovetail inspection over rods (reading limits, accept or reject), gear tooth caliper settings for backlash (chordal thickness limits, depth setting) and a perforated plate design (hole for open area, punching force, ligament). Tests cross-check against the melting energy, Vickers–Knoop hardness, spur contact diameters, contact ratio, feed for finish, nose radius compensation, turning time, refractometer concentration, compound angle, sine bar, dovetail measurement, chordal tooth, perforated open area and punching force tools. WORKOS now holds 657 tools.

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Melting Furnace Batch Plan (Energy, Melt Time, Melts per Shift, Cost)** `melt-furnace-batch-plan` | DEMAND MET | Output; Material data; Model and application | 371–374, 1404–1420 | Automated + cross-check |
| **Vickers Hardness Test Check (Hardness, Validity, Specification)** `vickers-test-check` | WITHIN SPECIFICATION | Thickness; Edge distance; Spacing; Diagonals; Specification; Model and application | 1406–1412 | Automated + cross-check |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Spur Gear Mesh Interference Check (Contact Start Diameters and Contact Ratio)** `gear-mesh-interference-check` | NO INTERFERENCE | Pinion; Gear; Contact ratio; Model and application | 2155–2157, 2131–2160 | Automated + cross-check |
| **Gear Tooth Caliper Setting for Backlash (Chordal Thickness Limits)** `gear-tooth-caliper-setting` | ACCEPT | Chordal thickness; Tip diameter; Model and application | 2145, 2238–2240 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Finish Turning Set-up (Feed for Finish, Nose-Radius Compensation, Time)** `finish-turning-setup` | FINISH ACHIEVABLE | Surface finish; Nose-radius compensation; Model and application | 1125–1131, 782–790 | Automated + cross-check |

### Maintenance

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Coolant Tank Maintenance (Concentration, Correction, Make-Up Mix, Usage)** `coolant-tank-maintenance` | CONCENTRATION OK | Concentration; Tramp oil; Model and application | 1176–1181 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Compound-Angle Sine Plate Set-up (True Angle and Stack Heights)** `compound-angle-sine-setup` | SET-UP POSSIBLE | Lower plate; Upper plate; Plate order; Model and application | 119–121, 676–682 | Automated + cross-check |
| **Dovetail Inspection over Rods (Reading Limits, Accept or Reject)** `dovetail-inspection` | ACCEPT | Width; Rod contact; Model and application | 682 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Perforated Plate Design (Hole Size for Open Area, Punching Force, Ligament)** `perforated-plate-design` | DESIGN FEASIBLE | Press; Ligament; Hole size; Open area; Model and application | 2607–2608, 1338–1346 | Automated + cross-check |

## Machinery’s Handbook topic tools, thirty-second pass: integrated design checks, twenty-third round (added 26 October 2026)

A twenty-third round of 9 integrated design checks in batch handbook48: a water supply line check (velocity, friction loss, outlet pressure, valve closure surge), a pipe run thermal expansion check (growth, loop leg, anchor force), a pivot pin and retaining ring check (clevis stresses and axial retention), a preventive replacement interval plan (Weibull reliability and cost per hour), a process change trial (sample size, Welch t-test, improvement decision), a timber order plan (board feet, cost, moisture, weight, deliveries), a hydraulic orifice restrictor design (drill size, flow, heat), a machine levelling wedge check (drive force, self-locking, travel) and a ramp winch pull check (pull, holding force, power). Tests cross-check against the pipe friction, valve closure surge, pipe size for velocity, pipe expansion loop, thermal stress, clevis pin joint, retaining ring thrust, Weibull reliability, two-sample t-test, sample size for a mean, lumber board feet, wood moisture and density, orifice flow, wedge force, inclined plane and rolling resistance tools. WORKOS now holds 666 tools.

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Water Supply Line Check (Velocity, Friction Loss, Outlet Pressure, Valve Surge)** `water-line-design-check` | LINE ADEQUATE | Velocity; Outlet pressure; Surge; Flow regime; Model and application | 3024–3027 | Automated + cross-check |
| **Pipe Run Thermal Expansion Check (Growth, Loop Leg, Anchor Force)** `pipe-run-expansion-check` | LOOP ADEQUATE | Leg stress; Anchor force; Piping code; Model and application | 375–378, 3401–3402 | Automated + cross-check |
| **Hydraulic Orifice Restrictor Design (Drill Size, Flow, Heat)** `orifice-restrictor-design` | RESTRICTOR SUITABLE | Flow; Clogging; Temperature rise; Discharge coefficient; Model and application | 3024–3027, 352–368 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Pivot Pin and Retaining Ring Check (Clevis Stresses and Axial Retention)** `pivot-pin-retention-check` | PIN ASSEMBLY ADEQUATE | Clevis; Retaining ring; Pin projection; Model and application | 1535, 1720–1735, 1763–1789 | Automated + cross-check |

### Maintenance

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Preventive Replacement Interval Plan (Weibull Reliability and Cost per Hour)** `maintenance-interval-plan` | PLANNED REPLACEMENT PAYS | Cost; Reliability; Failure pattern; Model and application | 128–133 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Process Change Trial (Sample Size, Welch t-Test, Improvement Decision)** `process-change-trial` | IMPROVEMENT CONFIRMED | Significance; Sample size; Practical size; Model and application | 130–133 | Automated + cross-check |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Timber Order Plan (Board Feet, Cost, Moisture, Weight, Deliveries)** `timber-order-plan` | TIMBER READY TO USE | Moisture content; Fibre saturation; Sampling; Model and application | 386–387, 3018–3019 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Machine Levelling Wedge Check (Drive Force, Self-Locking, Travel)** `machine-levelling-wedge-check` | WEDGES ADEQUATE | Drive force; Self-locking; Travel; Model and application | 169–171 | Automated + cross-check |
| **Ramp Winch Pull Check (Pull, Holding Force, Power)** `ramp-winch-pull-check` | WINCH ADEQUATE | Rated pull; Motor power; Holding; Breakaway; Model and application | 165–171 | Automated + cross-check |

## Machinery’s Handbook topic tools, thirty-third pass: integrated design checks, twenty-fourth round (added 26 October 2026)

A twenty-fourth round of 9 integrated design checks in batch handbook49: a pump suction line check (friction loss, NPSH available, lowest liquid level), a shoe brake stop check (stopping torque, lever force, lining pressure, drum heat), a drive shaft torsional check (natural frequency, resonance margins by order, stress, twist), a flange coupling design (design torque, bolts, friction drive, key), a spur gear milling set-up (simple indexing, cutter number, blank and depth, chordal tooth check), a lubricant viscosity check (operating and cold-start viscosity), a rolled plate plan (roll-to radius for springback, blank length, radius inspection over rolls), a hopper and bin design (capacity, wall angle, plate mass) and a knurling set-up (tracking blank diameter, speed, time). Tests cross-check against the pipe friction, NPSH available, shoe brake, torque to accelerate a rotating load, torsional vibration, flange coupling bolts, key stress, simple indexing, gear cutter number, chordal tooth, oil viscosity–temperature, viscosity units, bending springback, arc radius from rolls, frustum volume and knurling blank diameter tools. WORKOS now holds 675 tools.

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Pump Suction Line Check (Friction Loss, NPSH Available, Lowest Liquid Level)** `pump-suction-check` | SUCTION ADEQUATE | NPSH margin; Suction velocity; Submergence; Model and application | 3024–3027 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Shoe Brake Stop Check (Stopping Torque, Lever Force, Lining Pressure, Heat)** `shoe-brake-stop-check` | BRAKE ADEQUATE | Self-locking; Lever force; Lining pressure; Drum heating; Model and application | 2455–2459, 176–181 | Automated + cross-check |
| **Drive Shaft Torsional Check (Natural Frequency, Resonance Margins, Stress, Twist)** `drive-torsional-check` | NO TORSIONAL PROBLEM | Resonance; Shaft stress; Other flexibilities; Model and application | 3412–3413, 296–302 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Flange Coupling Design (Design Torque, Bolts, Friction Drive, Key)** `flange-coupling-design` | COUPLING ADEQUATE | Bolt shear; Friction drive; Key shear; Key crushing; Key length; Model and application | 2441–2450, 2460–2486, 301–302 | Automated + cross-check |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Spur Gear Milling Set-up (Indexing, Cutter Number, Depth, Tooth Check)** `gear-milling-setup` | SET-UP FOUND | Indexing; Sector arms; Backlash; Model and application | 2107–2121, 2148–2150, 2145, 2238–2240 | Automated + cross-check |

### Maintenance

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Lubricant Viscosity Check (Operating and Cold-Start Viscosity)** `lubricant-viscosity-check` | GRADE SUITABLE | Operating viscosity; Cold start; Extrapolation; Model and application | 2329–2337, 2425–2426 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Rolled Plate Plan (Roll-To Radius for Springback, Blank Length, Radius Inspection)** `rolled-plate-plan` | RADIUS WITHIN TOLERANCE | Radius; Gauge geometry; Material data; Model and application | 1351–1352, 687–688 | Automated + cross-check |
| **Hopper and Bin Design (Capacity, Wall Angle, Plate Mass)** `hopper-bin-design` | HOPPER ADEQUATE | Capacity; Wall angle; Structure; Model and application | 82–87, 66 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Knurling Set-up (Tracking Blank Diameter, Speed, Time)** `knurling-setup` | BLANK TRACKS | Tracking; Knurl condition; Model and application | 991–997 | Automated + cross-check |
