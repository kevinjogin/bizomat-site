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

## Machinery’s Handbook topic tools, thirty-fourth pass: integrated design checks, twenty-fifth round (added 26 October 2026)

A twenty-fifth round of 9 integrated design checks in batch handbook50: a shaft alignment plan (rim and face corrections with thermal growth), a helical gear milling set-up (lead, change gears, cutter number, indexing), a machine rate quote check (hour rate, job cost, margin, least price), a crane load swing check (pendulum period, swing, rope tension, speed limit), a nested compression spring check (load share, stresses, solid length, clearance), a shear spun cone plan (blank, reduction, roller force, power, time), an injection moulded part cost (clamp, cycle, machine, plastic, mould), a brake dynamometer test and cooling plan (power, water flow, water use) and an internal gear drive check (proportions, tooth difference, pinion bending). Tests cross-check against the rim and face alignment, thermal growth for hot alignment, helical milling, gear cutter number, simple indexing, machine hour rate, pendulum period, compression spring, springs in series or parallel, shear spinning, injection moulding estimate, prony brake, coolant flow for a heat load, internal gear proportions and Lewis bending tools. WORKOS now holds 684 tools.

### Maintenance

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Shaft Alignment Plan (Rim and Face Corrections with Thermal Growth)** `shaft-alignment-plan` | ALIGNMENT OK WHEN HOT | Running offset; Angularity; Soft foot; Model and application | 2645–2650, 375–376 | Automated + cross-check |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Helical Gear Milling Set-up (Lead, Change Gears, Cutter, Indexing)** `helical-gear-milling-setup` | SET-UP FOUND | Lead error; Indexing; Cutter range; Gear fit and hand; Model and application | 2060–2062, 2205, 2107–2121, 2148–2150 | Automated + cross-check |
| **Internal Gear Drive Check (Proportions, Tooth Difference, Pinion Bending)** `internal-gear-drive-check` | DRIVE ADEQUATE | Tooth-number difference; Pinion bending; Pinion size; Surface durability; Model and application | 2170–2171, 2131–2160 | Automated + cross-check |

### Money

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Machine Rate Quote Check (Hour Rate, Job Cost, Margin)** `machine-rate-quote-check` | QUOTE COVERS COST | Margin; Utilisation; Model and application | 134–146, 1153–1160 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Crane Load Swing Check (Pendulum Period, Swing, Rope Tension)** `crane-load-swing-check` | SWING WITHIN LIMITS | Clearance; Rope load; Tag lines; Model and application | 173–174 | Automated + cross-check |
| **Brake Dynamometer Test and Cooling Plan (Power, Water Flow, Water Use)** `dynamometer-cooling-plan` | TEST SET-UP ADEQUATE | Brake rating; Water supply; Outlet temperature; Model and application | 2998–2999, 371–374 | Automated + cross-check |

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Nested Compression Spring Check (Load Share, Stresses, Solid Length, Clearance)** `nested-spring-check` | SPRING SET ADEQUATE | Outer stress; Inner stress; Load; Radial clearance; Coil hand; Model and application | 304–324 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Shear Spun Cone Plan (Blank, Reduction, Roller Force, Power, Time)** `spun-cone-plan` | SPINNING FEASIBLE | Reduction; Power; Roller and mandrel; Model and application | 1362–1364 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Injection Moulded Part Cost (Clamp, Cycle, Machine, Material, Mould)** `moulded-part-cost` | COST WITHIN TARGET | Clamp force; Shot size; Cost; Model and application | 584–592, 134–146 | Automated + cross-check |

## Machinery’s Handbook topic tools, thirty-fifth pass: integrated design checks, twenty-sixth round (added 26 October 2026)

A twenty-sixth round of 9 integrated design checks in batch handbook51: a C-frame throat check (curved-beam stress, straight-beam comparison, depth needed), a bolt pattern hole plan (layout, clearance holes, position tolerance), an interference fit limits check (IT grades, least and most interference, holding torque, hub stress), a pontoon float check (draft, freeboard, reserve buoyancy), a spade drilling plan (speed, power, thrust, time), a thrust pad bearing check (unit load, PV, friction loss, oil flow), a tube post with eccentric load (section, secant formula, load factor), a hot surface insulation check (bare and insulated loss, touch temperature, payback) and a limit gauge plan (IT tolerance, go and no-go sizes, makeability). Tests cross-check against the curved beam, combined axial and bending stress, bolt circle layout, fastener position tolerance, ISO tolerance grade, press and shrink fit, buoyancy, circular segment, spade drilling power, thrust bearing pad, coolant flow for a heat load, eccentrically loaded column, radiant heat loss, layered wall heat flow and go and no-go gauge tools. WORKOS now holds 693 tools.

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **C-Frame Throat Check (Curved-Beam Stress, Straight-Beam Comparison, Depth Needed)** `c-frame-throat-check` | THROAT ADEQUATE | Inner fibre; Outer fibre; Fatigue and deflection; Model and application | 212–218, 257–260 | Automated + cross-check |
| **Interference Fit Limits Check (IT Grades, Least and Most Interference, Torque, Stress)** `interference-fit-limits-check` | FIT WORKS OVER ITS LIMITS | Interference; Grip at least interference; Hub at most interference; Model and application | 631–634, 635–668 | Automated + cross-check |
| **Tube Post with Eccentric Load (Section, Secant Formula, Load Factor)** `tube-post-eccentric-check` | POST ADEQUATE | Load factor; Slenderness; Base and connection; Model and application | 281–287, 234–246 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Bolt Pattern Hole Plan (Layout, Clearance Holes, Position Tolerance)** `bolt-pattern-hole-plan` | PATTERN WORKS | Ligament; Edge distance; Wrench clearance; Position tolerance; Model and application | 686, 615–627 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Pontoon Float Check (Draft, Freeboard, Reserve Buoyancy)** `pontoon-float-check` | FLOAT ADEQUATE | Freeboard; Reserve buoyancy; Stability; Model and application | 3027, 77–80 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Spade Drilling Plan (Speed, Power, Thrust, Time)** `spade-drilling-plan` | MACHINE CAN DRILL IT | Power; Thrust; Chip removal; Model and application | 1077–1079 | Automated + cross-check |

### Engineering

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Thrust Pad Bearing Check (Unit Load, PV, Friction Loss, Oil Flow)** `thrust-pad-bearing-check` | BEARING ADEQUATE | Unit load; PV; Oil supply; Model and application | 2338–2356, 371–374 | Automated + cross-check |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Hot Surface Insulation Check (Bare Loss, Insulated Loss, Touch Temperature, Payback)** `hot-surface-insulation-check` | INSULATION ADEQUATE | Touch temperature; Payback; Insulation rating; Model and application | 371–378 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Limit Gauge Plan (IT Tolerance, Go and No-Go Sizes, Makeability)** `plug-gauge-plan` | GAUGES MAKEABLE | Gauge tolerance; Gauge form; Model and application | 661–663, 705–708, 635–668 | Automated + cross-check |

## Machinery’s Handbook topic tools, thirty-sixth pass: integrated design checks, twenty-seventh round (added 26 October 2026)

A twenty-seventh round of 9 integrated design checks in batch handbook52: a pusher or transfer move check (motion profile, force, hard-stop impact), a lid counterbalance with torsion springs (balance, handle force, spring stress), a triaxial stress check (principal stresses, von Mises, Tresca, strains), a machine noise acceptance test (background correction, distance, limit), a melt charge blend (two materials to a target content, batch masses, cost), an angle ring cut plan (cut length, bars, joints, waste, mass), a two-span stringer check (continuous beam, deflection, support reactions), an inch spur gear pair check (diametral pitch proportions, pinion bending) and an equipment finance plan (loan payment, depreciation, tax, yearly cash flow). Tests cross-check against the uniformly accelerated motion, impulse and momentum, helical torsion spring, three-dimensional principal stress, elastic constants, machinery noise, mixture value and blending, length of angle bent to a ring, continuous beam over two spans, spur gear dimensions by diametral pitch, Lewis bending, interest and equivalence factors and depreciation schedule tools. WORKOS now holds 702 tools.

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Pusher or Transfer Move Check (Motion Profile, Force, Stop Impact)** `pusher-move-check` | MOVE ACHIEVABLE | Actuator force; Hard-stop load; Cushioning; Model and application | 175–186 | Automated + cross-check |

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Lid Counterbalance with Torsion Springs (Balance, Handle Force, Spring Stress)** `lid-counterbalance-spring` | LID BALANCED | Handle force; Spring stress; Stays open; Stays shut; Model and application | 333–343 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Triaxial Stress Check (Principal Stresses, von Mises, Tresca, Strains)** `triaxial-stress-check` | WITHIN YIELD MARGIN | von Mises; Tresca; Model and application | 212–218, 369–380 | Automated + cross-check |
| **Two-Span Stringer Check (Continuous Beam, Deflection, Support Reactions)** `two-span-stringer-check` | STRINGER ADEQUATE | Bending stress; Deflection; Supports; Model and application | 264–267 | Automated + cross-check |

### Engineering

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Machine Noise Acceptance Test (Background Correction, Distance, Limit)** `machine-noise-acceptance` | MACHINE MEETS LIMIT | Background; Limit; Instrument; Model and application | 3455–3456 | Automated + cross-check |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Melt Charge Blend (Two Materials to a Target Content, Batch Masses, Cost)** `melt-charge-blend` | BLEND WITHIN COST | Cost; Other elements; Model and application | 384 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Angle Ring Cut Plan (Cut Length, Bars, Joints, Waste, Mass)** `angle-ring-cut-plan` | CUT PLAN OK | Waste; Trial ring; Model and application | 2593 | Automated + cross-check |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Inch Spur Gear Pair Check (Diametral Pitch Proportions, Pinion Bending)** `inch-spur-gear-check` | GEAR PAIR ADEQUATE | Pinion bending; Pinion teeth; Surface durability; Model and application | 2131–2160, 2249–2251 | Automated + cross-check |

### Money

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Equipment Finance Plan (Loan Payment, Depreciation, Tax, Yearly Cash Flow)** `equipment-finance-plan` | PAYS ITS WAY EVERY YEAR | Yearly cash flow; Tax rules; Model and application | 134–140 | Automated + cross-check |

## Machinery’s Handbook topic tools, thirty-seventh pass: integrated design checks, twenty-eighth round (added 26 October 2026)

A twenty-eighth round of 9 integrated design checks in batch handbook53: a Porter governor check (heights, sleeve travel, ball radius, centrifugal force), an overhang beam with tip load (uplift, anchor bolts, tip deflection), a beam drop impact check (I-section properties, impact factor, dynamic stress), a silent chain drive check (sprocket diameters, chain length, speed, wrap), a jaw clutch milling set-up (dividing-head angle and indexing), a snatch block and anchor load check (rope angle, resultant, ratings), a crossed flat belt drive check (length, wrap, tensions, speed), a square versus round wire spring comparison (rate, load, stress, solid length) and a crossed helical gear drive check (proportions, sliding velocity, forces). Tests cross-check against the fly-ball governor, centrifugal force, overhanging beam, section properties, impact load on a beam, silent chain sprocket, chain length, clutch teeth dividing-head, simple indexing, resultant of concurrent forces, crossed belt length, belt friction, square-wire spring, compression spring and crossed helical gears tools. WORKOS now holds 711 tools.

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Porter Governor Check (Heights, Sleeve Travel, Ball Radius, Centrifugal Force)** `porter-governor-check` | GOVERNOR SUITABLE | Sleeve travel; Speed variation; Friction; Model and application | 3453–3455, 187–190 | Automated + cross-check |
| **Snatch Block and Anchor Load Check (Rope Angle, Resultant, Ratings)** `snatch-block-load-check` | RIGGING ADEQUATE | Block; Anchor; Rope; Exclusion zone; Model and application | 153–163 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Overhang Beam with Tip Load (Uplift, Anchor Bolts, Tip Deflection)** `overhang-beam-uplift-check` | OVERHANG ADEQUATE | Bending stress; Anchor bolts; Front support; Tip deflection; Model and application | 257–262 | Automated + cross-check |
| **Beam Drop Impact Check (I-Section Properties, Impact Factor, Dynamic Stress)** `beam-drop-impact-check` | BEAM SURVIVES THE DROP | Dynamic stress; Dynamic deflection; Local effects; Model and application | 278, 234–246 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Silent Chain Drive Check (Sprocket Diameters, Chain Length, Speed, Wrap)** `silent-chain-drive-check` | DRIVE LAYOUT OK | Chain speed; Small sprocket teeth; Wrap; Power rating; Model and application | 3457–3460, 2537–2560 | Automated + cross-check |
| **Crossed Flat Belt Drive Check (Length, Wrap, Tensions, Speed)** `crossed-belt-drive-check` | BELT DRIVE ADEQUATE | Belt tension; Belt speed; Belt rubbing; Model and application | 2473–2490, 165–168 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Jaw Clutch Milling Set-up (Dividing-Head Angle and Indexing)** `jaw-clutch-milling-setup` | SET-UP FOUND | Indexing; Mating clutch; Model and application | 2452–2454, 2107–2121 | Automated + cross-check |

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Square versus Round Wire Spring Comparison (Rate, Load, Stress, Solid Length)** `square-round-spring-compare` | SQUARE WIRE MEETS THE NEED | Square wire; Round wire; Keystone effect; Model and application | 304–324 | Automated + cross-check |

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Crossed Helical Gear Drive Check (Proportions, Sliding Velocity, Forces)** `crossed-helical-drive-check` | SLIDING WITHIN LIMIT | Sliding velocity; Hand of helix; Load capacity; Model and application | 2195–2203 | Automated + cross-check |

## Machinery’s Handbook topic tools, thirty-eighth pass: integrated design checks, twenty-ninth round (added 26 October 2026)

A twenty-ninth round of 9 integrated design checks in batch handbook54: a tank heating or cooling coil plan (area, tube length, turns, pressure drop), a polygon milling set-up (stock size, depth of cut, indexing), a bolt circle inspection from three holes (fitted diameter, centre position), an oval tank capacity and weight (elliptical section, shell plate, full mass), a bent bracket plan (flat blank, bend force, springback), a guard-banded acceptance decision (uncertainty budget; accept, reject or indeterminate), a rotary axis feed plan (inverse-time feed and axis rate limits), a column formula comparison (Rankine, Euler and classic safe load) and a hollow shaft conversion (brittle material, size, weight, twist). Tests cross-check against the helix length, pipe friction, regular polygon, simple indexing, circle through three points, true position, ellipse, sheet-metal flat pattern, press brake force, bending springback, measurement uncertainty budget, inverse time feed, Rankine column, classic column safe stress and brittle and hollow shaft tools. WORKOS now holds 720 tools.

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Tank Heating or Cooling Coil Plan (Area, Tube Length, Turns, Pressure Drop)** `heating-coil-plan` | COIL ADEQUATE | Area; Pressure drop; Coil fits the tank; Model and application | 2060–2062, 3024–3027, 371–378 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Polygon Milling Set-up (Stock Size, Depth of Cut, Indexing)** `polygon-milling-setup` | SET-UP FOUND | Stock size; Indexing; Opposite flats; Model and application | 76, 81–82, 2107–2121 | Automated + cross-check |
| **Rotary Axis Feed Plan (Inverse-Time Feed and Axis Rate Limits)** `rotary-axis-feed-plan` | FEED ACHIEVABLE | Rotary rate; Linear rate; Control mode; Model and application | 1288–1289 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Bolt Circle Inspection from Three Holes (Fitted Diameter, Centre Position)** `bolt-circle-inspection` | CONFORMS | Diameter; Centre position; Point spread; Model and application | 40–48, 615–627 | Automated + cross-check |
| **Guard-Banded Acceptance Decision (Uncertainty Budget, Accept, Reject or Indeterminate)** `guard-band-acceptance` | ACCEPT | Decision; Test uncertainty ratio; Model and application | 709–735 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Oval Tank Capacity and Weight (Elliptical Section, Shell Plate, Full Mass)** `oval-tank-capacity` | TANK ADEQUATE | Capacity; Supports; Stiffening; Model and application | 48–50, 70–75 | Automated + cross-check |
| **Bent Bracket Plan (Flat Blank, Bend Force, Springback)** `bent-bracket-plan` | BRACKET CAN BE MADE | Press capacity; End flanges; Inside radius; Die opening; Model and application | 1346–1353 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Column Formula Comparison (Rankine, Euler and Classic Safe Load)** `column-formula-compare` | COLUMN ADEQUATE | Rankine factor; Classic safe load; Current code; Model and application | 281–287 | Automated + cross-check |
| **Hollow Shaft Conversion (Brittle Material, Size, Weight, Twist)** `hollow-shaft-conversion` | HOLLOW SHAFT WORKS | Fits; Wall; Twist; Model and application | 295–303 | Automated + cross-check |

## Machinery’s Handbook topic tools, thirty-ninth pass: integrated design checks, thirtieth round (added 27 October 2026)

A thirtieth round of 9 integrated design checks in batch handbook55: a ring blank plan (rolled ring or cut from plate, mass and cost), a thread rolling set-up (blank diameter, roll size, starts), a shear legs (A-frame) check (geometry, leg force, foot thrust, buckling), a stock removal plan (bar volume, chips, machining time, power), a pump speed control plan (speed for target flow, power, saving over throttling), lot acceptance from process capability (fraction defective, sampling plan risk), a sump or pit pump-out plan (Simpson section area, volume, time), an outdoor cabinet or machine wind tipping and sliding check, and a segmented flange ring plan (segment size, plate fit, yield, welds). Tests cross-check against the Pappus surface and volume, metric thread, threading roll size, triangle solver, column buckling, solid volume, turning power, pump operating point, pump affinity, parts out of tolerance, sampling plan operating characteristic, Simpson’s rule area, wind pressure, machine tipping stability and plane area tools. WORKOS now holds 729 tools.

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Ring Blank Plan (Rolled Ring or Cut from Plate, Mass and Cost)** `ring-blank-make-plan` | ROLLED RING CHEAPER | Budget; Lead time; Model and application | 66–67 | Automated + cross-check |

### Threads

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Thread Rolling Set-up (Blank Diameter, Roll Size, Starts)** `thread-rolling-setup` | ROLLS FIT THE MACHINE | Roll size; Blank size; Model and application | 2050–2051, 1867–1890 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Shear Legs (A-Frame) Check (Geometry, Leg Force, Foot Thrust, Buckling)** `shear-legs-check` | SHEAR LEGS ADEQUATE | Leg buckling; Foot tie; Back guys; Model and application | 95–102, 281–287 | Automated + cross-check |
| **Outdoor Cabinet or Machine Wind Tipping and Sliding Check** `outdoor-cabinet-wind-tipping` | STABLE IN WIND | Tipping; Sliding; Site wind speed; Model and application | 3028, 167–168 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Stock Removal Plan (Bar Volume, Chips, Machining Time, Power)** `stock-removal-plan` | PLAN WORKABLE | Spindle power; Material yield; Model and application | 82–88, 1084–1101 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Pump Speed Control Plan (Speed for Target Flow, Power, Saving over Throttling)** `pump-speed-control-plan` | SPEED CONTROL SAVES | Target reachable; Least speed; Saving; Model and application | 3021–3027 | Automated + cross-check |
| **Sump or Pit Pump-Out Plan (Simpson Section Area, Volume, Time)** `sump-pumpout-plan` | EMPTIES IN TIME | Time; Pump head; Model and application | 67–68 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Lot Acceptance from Process Capability (Fraction Defective, Sampling Plan Risk)** `lot-acceptance-from-capability` | LOTS WILL PASS | Acceptance; Centring; Model and application | 128–133 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Segmented Flange Ring Plan (Segment Size, Plate Fit, Yield, Welds)** `segmented-flange-plan` | SEGMENT PLAN OK | Plate fit; Yield; Weld procedure; Model and application | 66–81 | Automated + cross-check |

## Machinery’s Handbook topic tools, fortieth pass: integrated design checks, thirty-first round (added 27 October 2026)

A thirty-first round of 9 integrated design checks in batch handbook56: a three-leg sling load share (3D leg geometry, tensions, angles), an instrument calibration check (errors, accuracy class, interpolated correction), an NPT tapped port check (thread length, depth, boss wall), an interference fit at operating temperature for different materials, a compression spring fatigue check (working stroke, Goodman factor), a cam follower return spring check (inertia force, jump speed), an angular cutter or taper reamer fluting set-up (head angle and indexing), a gearbox oil temperature and grade check (heat balance, viscosity hot) and a small tool substitution check (stiffness change, deflection, feed to hold tolerance). Tests cross-check against the cylindrical and spherical coordinates, simultaneous equations, linear interpolation, NPT pipe thread, press and shrink fit, compression spring, Goodman fatigue, cam follower motion, angular cutter fluting, simple indexing, gearbox heat balance, oil viscosity–temperature and small cutter stiffness tools. WORKOS now holds 738 tools.

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Three-Leg Sling Load Share (3D Leg Geometry, Tensions, Angles)** `three-leg-sling-check` | SLING ADEQUATE | All legs loaded; Leg load; Leg angle; Model and application | 43–45, 122–127, 153–163 | Automated + cross-check |
| **Cam Follower Return Spring Check (Inertia Force, Jump Speed)** `cam-return-spring-check` | FOLLOWER STAYS IN CONTACT | Contact margin; Spring rating; Motion law; Model and application | 2284–2309, 304–320 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Instrument Calibration Check (Errors, Accuracy Class, Interpolated Correction)** `instrument-calibration-check` | WITHIN ACCURACY CLASS | Accuracy class; Service reading; Reference uncertainty; Model and application | 121, 709–735 | Automated + cross-check |

### Threads

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **NPT Tapped Port Check (Thread Length, Depth, Boss Wall)** `npt-port-check` | PORT ADEQUATE | Depth; Boss wall; Gauging; Model and application | 1952–1975 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Interference Fit at Operating Temperature (Different Materials)** `fit-at-temperature-check` | FIT HOLDS AT TEMPERATURE | Grip at the weaker condition; Hub at the tighter condition; Interference hot; Model and application | 631–634, 375–376 | Automated + cross-check |

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Compression Spring Fatigue Check (Working Stroke, Goodman Factor)** `spring-fatigue-check` | INFINITE LIFE EXPECTED | Fatigue (Goodman); First-cycle yield; Surge; Model and application | 304–324, 200–211 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Angular Cutter or Taper Reamer Fluting Set-up (Head Angle and Indexing)** `angular-cutter-fluting-setup` | SET-UP FOUND | Indexing; Cutter position; Model and application | 833–834, 2107–2121 | Automated + cross-check |
| **Small Tool Substitution Check (Stiffness Change, Deflection, Feed to Hold Tolerance)** `small-tool-substitution-check` | DEFLECTION WITHIN LIMIT | Deflection; Holder and runout; Model and application | 1093–1094 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Gearbox Oil Temperature and Grade Check (Heat Balance, Viscosity Hot)** `gearbox-oil-temperature-check` | TEMPERATURE AND GRADE OK | Oil temperature; Viscosity; Oil life; Model and application | 3339–3340, 2430–2436, 2329–2337 | Automated + cross-check |

## Machinery’s Handbook topic tools, forty-first pass: integrated design checks, thirty-second round (added 27 October 2026)

A thirty-second round of 9 integrated design checks in batch handbook57, built mainly on single tools not chained before: a trapezoidal lead screw check (thread size, torque, root stress, nut pressure), an overhung gear shaft sizing (gear forces, bending, diameter, stress), a face milling power plan (teeth, chip thickness, kc, spindle power), a ball screw life over a duty cycle, a turn-of-nut preload and bolt fatigue check, Unified thread over-wire limits, a change-gear threading set-up (gear train, pitch error, depth, passes), a panel material substitution (equal stiffness and strength thickness, mass, cost) and a cone clutch engagement check (torque, engaging force, slip time, heat). Tests cross-check against the Acme and trapezoidal thread, power screw torque, gear forces, shaft diameter, combined shaft stress, milling cutter teeth, chip thickness and kc, milling power, bearing duty cycle, ball screw life, turn-of-nut preload, bolted joint fatigue, Unified thread limits, three-wire measurement, change gears, metric thread, equivalent stiffness thickness, cone clutch and torque to accelerate a rotating load tools. WORKOS now holds 747 tools.

### Threads

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Trapezoidal Lead Screw Check (Thread Size, Torque, Root Stress, Nut Pressure)** `acme-lead-screw-check` | LEAD SCREW ADEQUATE | Self-locking; Root stress; Nut pressure; Model and application | 1921–1946 | Automated + cross-check |
| **Unified Thread Over-Wire Limits (Pitch Diameter Limits, Wire Readings, Accept)** `unified-thread-wire-limits` | ACCEPT | Pitch diameter; Wire size; Measuring force; Model and application | 1813–1866, 1990–2003 | Automated + cross-check |
| **Change-Gear Threading Set-up (Gear Train, Pitch Error, Thread Depth, Passes)** `change-gear-threading-setup` | GEAR TRAIN FOUND | Pitch error; Gear fit; Thread chasing; Model and application | 2043–2049, 1867–1890 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Overhung Gear Shaft Sizing (Gear Forces, Bending, Shaft Diameter, Stress)** `gear-shaft-sizing` | SHAFT ADEQUATE | Diameter; Combined stress; Deflection and bearings; Model and application | 2131–2160, 2195–2200, 295–303, 212–218 | Automated + cross-check |
| **Ball Screw Life over a Duty Cycle (Mean Load, Mean Speed, Life)** `ballscrew-duty-life` | LIFE ADEQUATE | Life; Time shares; Static and buckling; Model and application | 2400–2420, 2561–2568 | Automated + cross-check |
| **Cone Clutch Engagement Check (Torque, Engaging Force, Slip Time, Heat)** `cone-clutch-engagement` | CLUTCH ADEQUATE | Torque; Heat per start; Starts per hour; Model and application | 2446–2449, 176–181 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Face Milling Power Plan (Teeth, Chip Thickness, kc, Spindle Power)** `face-milling-power-plan` | WITHIN SPINDLE POWER | Spindle power; Teeth in cut; Spindle torque at low speed; Model and application | 808–809, 1084–1101 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Turn-of-Nut Preload and Bolt Fatigue Check** `turn-of-nut-fatigue-check` | JOINT ADEQUATE | Preload; Fatigue; Snug point; Model and application | 1521–1535 | Automated + cross-check |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Panel Material Substitution (Equal Stiffness and Strength Thickness, Mass, Cost)** `panel-material-substitution` | SUBSTITUTION SAVES WEIGHT | Stock; Weight; Cost; Model and application | 575–580 | Automated + cross-check |

## Machinery’s Handbook topic tools, forty-second pass: integrated design checks, thirty-third round (added 27 October 2026)

A thirty-third round of 9 integrated design checks in batch handbook58, again built mainly on single tools not chained before: an eccentric bracket bolt check (bolt group forces, shear and bearing stress), an overhung pulley shaft bush check (belt pull, bush loads, P, V and PV), a torque tube and end weld check (shear, twist, weld throat stress), a CNC arc segmentation and feed check (chord tolerance, block rate, achievable feed), an involute spline design check (proportions, root and tooth stresses), a single-plane balance correction check (unbalance, correction mass, residual, grade), a sheet and plate bend feasibility check (radius limits, springback, press force), a Whitworth thread wire inspection (pitch diameter, wire readings, lead-angle correction) and a casting pattern plan (machining allowance, shrinkage, casting and pour weight). Tests cross-check against the eccentric bolt group, bolt shear and bearing, plain bearing PV, thin-walled tube torsion, fillet weld strength, CNC chord error, involute spline, spline torque capacity, plane balancing, balance grade, bend radius limits, bending springback, press brake force, Whitworth thread, three-wire measurement, three-wire lead angle and pattern shrinkage tools. WORKOS now holds 756 tools.

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Eccentric Bracket Bolt Check (Bolt Group Forces, Shear and Bearing Stress)** `eccentric-bracket-bolt-check` | BOLTS ADEQUATE | Bolt shear; Plate bearing; Edge distance; Model and application | 1535, 1720–1735 | Automated + cross-check |

### Engineering

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Overhung Pulley Shaft Bush Check (Belt Pull, Bush Loads, P, V and PV)** `pulley-shaft-bush-check` | BUSHES ADEQUATE | Pressure; Sliding speed; PV; Model and application | 2314–2337, 2473–2490 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Torque Tube and End Weld Check (Shear, Twist, Weld Throat Stress)** `torque-tube-end-weld-check` | TUBE AND WELD ADEQUATE | Tube shear; Twist; End weld; Model and application | 295–303, 1476–1486 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **CNC Arc Segmentation and Feed Check (Chord Tolerance, Block Rate, Achievable Feed)** `arc-segmentation-feed-check` | FEED WITHIN BLOCK RATE | Block rate; Arc output; Model and application | 1279–1300, 77–80 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Involute Spline Design Check (Proportions, Root and Tooth Stresses)** `involute-spline-design` | SPLINE ADEQUATE | Shear; Compression; Fit and tolerance; Model and application | 2255–2282 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Single-Plane Balance Correction Check (Unbalance, Correction Mass, Residual, Grade)** `balance-correction-check` | BALANCE GRADE REACHED | Before correction; After correction; Check run; Model and application | 191–196 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Sheet and Plate Bend Feasibility (Radius Limits, Springback, Press Force)** `bend-feasibility-check` | BEND FEASIBLE | Radius; Press capacity; Die opening; Model and application | 1346–1353 | Automated + cross-check |
| **Casting Pattern Plan (Machining Allowance, Shrinkage, Casting and Pour Weight)** `casting-pattern-plan` | POUR WITHIN CAPACITY | Capacity; Draft and fillets; Model and application | 1414, 1419 | Automated + cross-check |

### Threads

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Whitworth Thread Wire Inspection (Pitch Diameter, Wire Readings, Lead-Angle Correction)** `whitworth-wire-inspection` | ACCEPT | Pitch diameter; Lead angle; Model and application | 1980–1989, 1990–2003 | Automated + cross-check |

## Machinery’s Handbook topic tools, forty-third pass: integrated design checks, thirty-fourth round (added 27 October 2026)

A thirty-fourth round of 9 integrated design checks in batch handbook59, again built mainly on single tools not chained before: a buttress thread wire inspection (7°/45° form, wire size, readings, pitch diameter), a Unified tapped hole check (tap drill, thread percentage, length of engagement), a weldment cost estimate (weld metal, arc time, labour, filler and gas by run), a brazed sleeve joint plan (overlap, joint and tube capacity, clearance, filler), a gear train output check (ratio, output speed and torque, output shaft stress), a linear move drive check (move profile, screw torque, RMS torque, cycle time), a plate lift plan (shape area, mass, centre of gravity, two-point lift loads), a tapered pad footing check (prismoidal volume, self-weight, bearing pressure, concrete order) and a bolt circle pin check (pitch circle from plugs, readings at the limits, decision). Tests cross-check against the buttress thread, taper and buttress three-wire, Unified thread, tap drill, thread engagement, weld cost, lap joint length, gear train, move profile, polygon area, prismoidal volume and bolt circle over plugs tools. WORKOS now holds 765 tools.

### Threads

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Buttress Thread Wire Inspection (7°/45° Form, Wire Size, Readings, Pitch Diameter)** `buttress-thread-inspection` | ACCEPT | Pitch diameter; Wire size; Load flank; Model and application | 1945–1952, 2005–2007 | Automated + cross-check |
| **Unified Tapped Hole Check (Tap Drill, Thread Percentage, Length of Engagement)** `unified-tapped-hole-check` | ENGAGEMENT ADEQUATE | Length of engagement; Thread percentage; Hole depth; Model and application | 1806–1866, 2029–2036, 1586–1590 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Weldment Cost Estimate (Weld Metal, Arc Time, Labour, Filler and Gas by Run)** `weldment-cost-estimate` | WITHIN QUOTE | Quote; Leg sizes; Model and application | 1438–1441 | Automated + cross-check |
| **Brazed Sleeve Joint Plan (Overlap, Joint and Tube Capacity, Clearance, Filler)** `brazed-sleeve-joint-plan` | JOINT ADEQUATE | Overlap; Joint capacity; Tube capacity; Clearance; Model and application | 1423–1430 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Gear Train Output Check (Ratio, Output Speed and Torque, Output Shaft Stress)** `gear-train-output-check` | TRAIN MEETS DUTY | Output speed; Output torque; Output shaft; Model and application | 2122–2160, 299–304 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Linear Move Drive Check (Move Profile, Screw Torque, RMS Torque, Cycle Time)** `linear-move-drive-check` | DRIVE ADEQUATE | Motor speed; Peak torque; RMS torque; Cycle time; Model and application | 175–180, 155–162 | Automated + cross-check |
| **Plate Lift Plan (Shape Area, Mass, Centre of Gravity, Two-Point Lift Loads)** `plate-lift-plan` | LIFT POINTS ADEQUATE | CG between the lift points; Lift point A; Lift point B; Hang; Model and application | 40–48, 66–76, 221–227 | Automated + cross-check |

### Engineering

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Tapered Pad Footing Check (Prismoidal Volume, Self-Weight, Bearing Pressure, Concrete Order)** `tapered-pad-footing-check` | BEARING ADEQUATE | Bearing pressure; Structural design; Model and application | 66 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Bolt Circle Pin Check (Pitch Circle from Plugs, Readings at the Limits, Decision)** `bolt-circle-pin-check` | ACCEPT | Pitch circle; Plug fit; Model and application | 686 | Automated + cross-check |

## Machinery’s Handbook topic tools, forty-fourth pass: integrated design checks, thirty-fifth round (added 27 October 2026)

A thirty-fifth round of 9 integrated design checks in batch handbook60, again built mainly on single tools not chained before: a sprocket bore and key plan (sprocket diameters, shaft keyseat readings, wall under the teeth), a pinned hub drive check (cross pin size, pin shear, shaft bearing and torsion), a press flywheel and motor check (stroke energy, rim mass, rim stress, motor power), a drop hammer forging plan (force needed, set per blow, number of blows), a V-belt drive motor load check (belts, driven speed, shaft load on the motor), a conveyor drive train check (belt pull, motor power, reducer ratio, gearbox torque), a pressure vessel shell plan (required thickness, plate chosen, MAWP, test water), a turning cut power check (equivalent chip thickness, cutting forces, power, speed limit) and a pressurised tube under torsion check (hoop, axial and shear stress, principal stresses, yield). Tests cross-check against the sprocket diameters, keyseat depth, taper pin torque, press flywheel sizing, drop hammer blow, V-belt drive design, conveyor drive sizing, pressure vessel thickness, equivalent chip thickness cutting forces, full-power cutting speed and principal stress tools. WORKOS now holds 774 tools.

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Sprocket Bore and Key Plan (Sprocket Diameters, Shaft Keyseat Readings, Wall Under the Teeth)** `sprocket-bore-key-plan` | BLANK FEASIBLE | Wall under the teeth; Key size; Model and application | 2537–2550, 2460–2486 | Automated + cross-check |
| **V-Belt Drive Motor Load Check (Belts, Driven Speed, Shaft Load on the Motor)** `v-belt-motor-load-check` | DRIVE SUITS MOTOR | Grooves; Motor shaft load; Driven speed; Model and application | 2487–2536 | Automated + cross-check |
| **Conveyor Drive Train Check (Belt Pull, Motor Power, Reducer Ratio, Gearbox Torque)** `conveyor-drive-train-check` | DRIVE TRAIN ADEQUATE | Belt speed; Motor power; Gearbox torque; Belt slip; Model and application | 2487–2512, 2122–2160 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Pinned Hub Drive Check (Cross Pin Size, Pin Shear, Shaft Bearing and Torsion)** `pinned-hub-drive-check` | PIN DRIVE ADEQUATE | Pin shear; Bearing on the shaft; Shaft at the cross hole; Pin size; Model and application | 220, 1714–1720 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Press Flywheel and Motor Check (Stroke Energy, Rim Mass, Rim Stress, Motor Power)** `press-flywheel-check` | FLYWHEEL AND MOTOR ADEQUATE | Rim mass; Rim stress; Motor power; Model and application | 3004–3006, 182–186 | Automated + cross-check |
| **Drop Hammer Forging Plan (Force Needed, Set per Blow, Number of Blows)** `drop-hammer-forging-plan` | PLAN FEASIBLE | Blows per heat; Flow stress; Model and application | 183–184 | Automated + cross-check |
| **Turning Cut Power Check (Equivalent Chip Thickness, Cutting Forces, Power, Speed Limit)** `turning-cut-power-check` | CUT WITHIN LATHE | Power; Spindle speed; Tool speed limit; Model and application | 1132–1141, 1084–1101 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Pressure Vessel Shell Plan (Required Thickness, Plate Chosen, MAWP, Test Water)** `vessel-shell-plan` | PLATE ADEQUATE | Shell; Heads; Code rules; Model and application | 290–294 | Automated + cross-check |
| **Pressurised Tube Under Torsion Check (Hoop, Axial and Shear Stress, Principal Stresses, Yield)** `pressure-tube-torsion-check` | TUBE ADEQUATE | Safety factor; Thin-wall theory; Model and application | 212–218, 290–294 | Automated + cross-check |

## Machinery’s Handbook topic tools, forty-fifth pass: integrated design checks, thirty-sixth round (added 27 October 2026)

A thirty-sixth round of 9 integrated design checks in batch handbook61, again built mainly on single tools not chained before: an inch milling setup check (speed, feed, removal rate, spindle power), a rotary index table drive check (table inertia, motor torque and speed, inertia ratio, holding), a hand lever design check (effort, fulcrum reaction, arm bending, fulcrum pin), a plate shear capacity check (shearing force, largest thickness, knife length), a vee groove pin inspection (pin height at nominal and limits, groove width from the reading), a special section beam check (section properties, beam case, stress, deflection limit), a force group support check (resultant, line of action, support reactions, uplift), a grain size acceptance (field readings, average ASTM grain size, spread, specification) and a polar hole position check (nominal X–Y from radius and angle, position error, bonus tolerance). Tests cross-check against the inch speeds and feeds, rotary index table sizing, lever force, shearing force, vee groove pin, more section shapes, more beam cases, force system, grain size, polar coordinates and distance between two points tools. WORKOS now holds 783 tools.

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Inch Milling Setup Check (Speed, Feed, Removal Rate, Spindle Power)** `inch-milling-setup-check` | SETUP WITHIN MACHINE | Spindle power; Spindle speed; Width of cut; Model and application | 1013–1017, 1084–1101 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Rotary Index Table Drive Check (Table Inertia, Motor Torque and Speed, Inertia Ratio, Holding)** `index-table-drive-check` | DRIVE ADEQUATE | Motor torque; Motor speed; Inertia ratio; Holding; Model and application | 171, 2284–2290 | Automated + cross-check |
| **Force Group Support Check (Resultant, Line of Action, Support Reactions, Uplift)** `force-group-support-check` | SUPPORTS ADEQUATE | Uplift; Support A; Support B; Model and application | 153–163 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Hand Lever Design Check (Effort, Fulcrum Reaction, Arm Bending, Fulcrum Pin)** `hand-lever-design-check` | LEVER ADEQUATE | Arm bending; Pin shear; Pin bearing; Effort; Model and application | 167–168, 257–270 | Automated + cross-check |
| **Special Section Beam Check (Section Properties, Beam Case, Stress, Deflection Limit)** `special-section-beam-check` | BEAM ADEQUATE | Bending stress; Deflection; End fixity; Model and application | 234–246, 257–270 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Plate Shear Capacity Check (Shearing Force, Largest Thickness, Knife Length)** `plate-shear-capacity-check` | CUT WITHIN SHEAR | Force; Cut length; Blade clearance; Model and application | 1336–1339 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Vee Groove Pin Inspection (Pin Height at Nominal and Limits, Groove Width from the Reading)** `vee-groove-pin-inspection` | ACCEPT | Groove width; Pin contact; Groove angle; Model and application | 682–691 | Automated + cross-check |
| **Polar Hole Position Check (Nominal X–Y from Radius and Angle, Position Error, Bonus Tolerance)** `polar-hole-position-check` | ACCEPT | Position; Hole size; Datums; Model and application | 40–45, 615–627, 692–694 | Automated + cross-check |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Grain Size Acceptance (Field Readings, Average ASTM Grain Size, Spread, Specification)** `grain-size-acceptance` | ACCEPT | Average grain size; Spread between fields; Model and application | 369–380 | Automated + cross-check |

## Machinery’s Handbook topic tools, forty-sixth pass: integrated design checks, thirty-seventh round (added 27 October 2026)

A thirty-seventh round of 9 integrated design checks in batch handbook62, built mainly on the last engineering single tools not chained before: an intermittent fillet weld plan (continuous leg, segment count and pitch, cost saving), an Acme nut bore inspection (minor diameter limits, drill choice, measured bore), a form tool profile plan (step depths and angles on a flat or circular tool), a taper disc gauge check (centre distance for a taper, taper from the measured setting), a composite rotor inertia and energy check (up to three shapes, offsets, stored and released energy), a preferred size selection (Renard series size for each requirement, oversize, distinct sizes), a stacked solid centre of gravity (cylinders, frustums, cones, hemispheres, tipping angle), a three-point support loads check (reaction at each support, uplift, capacity) and a sine bar set-up from degrees, minutes and seconds (gauge stack, set angle, error). Tests cross-check against the fillet weld joint design, Acme tap drill, forming tool depth, taper discs, more mass moments of inertia, preferred numbers, centroid of shapes, 3 × 3 matrix, degrees, minutes and seconds, and sine bar set-up tools. WORKOS now holds 792 tools.

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Intermittent Fillet Weld Plan (Continuous Leg, Segment Count and Pitch, Cost Saving)** `intermittent-fillet-weld-plan` | INTERMITTENT WELD FEASIBLE | Leg against plate; Gap between segments; Service; Model and application | 1433–1486 | Automated + cross-check |

### Threads

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Acme Nut Bore Inspection (Minor Diameter Limits, Drill Choice, Measured Bore)** `acme-nut-bore-inspection` | ACCEPT | Bore; Drill choice; Model and application | 944–947, 1921–1946 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Form Tool Profile Plan (Step Depths and Angles on a Flat or Circular Tool)** `form-tool-profile-plan` | PROFILE FEASIBLE | Profile depth; Model and application | 797–801 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Taper Disc Gauge Check (Centre Distance for a Taper, Taper from the Measured Setting)** `taper-disc-gauge-check` | ACCEPT | Taper; Discs; Model and application | 684–685 | Automated + cross-check |
| **Sine Bar Set-Up from Degrees, Minutes and Seconds (Gauge Stack, Set Angle, Error)** `sine-bar-dms-setup` | SET-UP ADEQUATE | Angle error; Angle range; Stack; Model and application | 103–104, 676–682, 705–708 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Composite Rotor Inertia and Energy (Up to Three Shapes, Offsets, Stored and Released Energy)** `composite-rotor-inertia` | ENERGY ADEQUATE | Energy per cycle; Rim speed; Model and application | 228–240, 182–186 | Automated + cross-check |
| **Stacked Solid Centre of Gravity (Cylinders, Frustums, Cones, Hemispheres, Tipping Angle)** `stacked-solid-cg` | STABLE | Tipping angle; Empty and part-full; Model and application | 221–227, 66–76 | Automated + cross-check |
| **Three-Point Support Loads (Reaction at Each Support, Uplift, Capacity)** `three-point-support-loads` | SUPPORTS ADEQUATE | Uplift; Capacity; Model and application | 122–125, 153–163 | Automated + cross-check |

### Engineering

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Preferred Size Selection (Renard Series Size for Each Requirement, Oversize, Distinct Sizes)** `preferred-size-selection` | SIZES SELECTED | Oversize; Model and application | 672 | Automated + cross-check |

## Machinery’s Handbook topic tools, forty-seventh pass: integrated design checks, thirty-eighth round (added 28 October 2026)

A thirty-eighth round of 9 integrated design checks in batch handbook63, combining single tools already in the set into checks not covered before: a gear tooth top land and undercut check (involute function, pointed radius, profile shift), a relief valve spring check (cracking pressure, full-lift pressure, overpressure, spring stress), a pipe support span check (pipe and contents weight, bending stress, sag, longest span), a cart push force check (rolling resistance, slope, starting force, wheel load), a taper turning set-up (taper per foot, half angle, tailstock offset, compound setting), a wall jib crane check (tie tension, beam bending and axial stress, deflection, wall bolts), a step cone pulley design (geometric speed steps, step diameters, crossed belt length), a hydraulic hand jack check (handle leverage, pump pressure, lifting force, strokes to lift) and a capstan and bollard rope turns check (holding force, turns needed, rope load). Tests cross-check against the trigonometric functions, compression spring, beam cases, rolling resistance, inclined plane, section shapes, progression, crossed belt length, lever force and belt friction tools. WORKOS now holds 801 tools.

### Gears

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Gear Tooth Top Land and Undercut Check (Involute Function, Pointed Radius, Profile Shift)** `gear-tooth-top-land-check` | TOOTH FORM ADEQUATE | Undercut; Top land; Mating gear; Model and application | 95–114, 2141–2160 | Automated + cross-check |

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Relief Valve Spring Check (Cracking Pressure, Full-Lift Pressure, Overpressure, Spring Stress)** `relief-valve-spring-check` | VALVE SPRING ADEQUATE | Set pressure; Overpressure; Spring stress; Solid length; Model and application | 304–324 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Pipe Support Span Check (Pipe and Contents Weight, Bending Stress, Sag, Longest Span)** `pipe-support-span-check` | SPAN ADEQUATE | Bending stress; Sag; Point loads; Model and application | 234–246, 257–277 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Cart Push Force Check (Rolling Resistance, Slope, Starting Force, Wheel Load)** `cart-push-force-check` | PUSH FORCE ACCEPTABLE | Starting push; Keep-moving push; Wheel load; Stopping; Model and application | 165–171 | Automated + cross-check |
| **Wall Jib Crane Check (Tie Tension, Beam Bending and Axial Stress, Deflection, Wall Bolts)** `wall-jib-crane-check` | JIB ADEQUATE | Jib stress; Deflection; Tie rod; Wall bolts; Buckling and flange; Model and application | 234–246, 257–277, 153–163 | Automated + cross-check |
| **Capstan and Bollard Rope Turns Check (Holding Force, Turns Needed, Rope Load)** `capstan-rope-turns-check` | HOLD ADEQUATE | Holding force; Rope; Post; Model and application | 165–168, 2473–2490 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Taper Turning Set-Up (Taper per Foot, Half Angle, Tailstock Offset, Compound Setting)** `taper-turning-setup` | OFFSET METHOD SUITABLE | Tailstock offset; Tool height; Model and application | 95–114, 682–691 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Step Cone Pulley Design (Geometric Speed Steps, Step Diameters, Crossed Belt Length)** `step-cone-pulley-design` | STEPS FEASIBLE | Smallest pulley; Belt; Model and application | 37–39, 2473–2490 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Hydraulic Hand Jack Check (Handle Leverage, Pump Pressure, Lifting Force, Strokes to Lift)** `hydraulic-hand-jack-check` | JACK ADEQUATE | Lifting force; Pressure rating; Strokes; Load safety; Model and application | 167–168, 3024–3027 | Automated + cross-check |

## Machinery’s Handbook topic tools, forty-eighth pass: integrated design checks, thirty-ninth round (added 28 October 2026)

A thirty-ninth round of 9 integrated design checks in batch handbook64, combining single tools already in the set into checks not covered before: a hinged flap cylinder check (force through the swing, stroke, cylinder size), a tank stand leg check (full tank weight, load per leg, leg buckling), a nozzle manifold check (flow per nozzle, total flow, feed pipe loss, supply pressure), a drilling fixture clamp check (drill torque, clamp force to stop rotation, strap clamp screw), a conveyor gravity take-up plan (slack side tension, sag tension, counterweight, travel), a forklift load centre check (load centre of gravity, derated capacity, side offset), a cylinder air consumption check (atmospheric air per cycle, total demand, compressor power), a winch drum brake check (load torque at the brake, stop time, holding factor, brake energy) and a tank drain time check (volume drained, initial outflow, time through an orifice). Tests cross-check against the pneumatic cylinder force, tank volume, column buckling, orifice flow, pipe friction, drilling power, fixture clamp force, conveyor drive sizing, combined centre of gravity, compressor power and holding brake sizing tools. WORKOS now holds 810 tools.

### Pneumatics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Hinged Flap Cylinder Check (Force Through the Swing, Stroke, Cylinder Size)** `hinged-flap-cylinder-check` | CYLINDER ADEQUATE | Load ratio; Stroke; End of swing; Model and application | 3032–3041, 153–163 | Automated + cross-check |
| **Cylinder Air Consumption Check (Atmospheric Air per Cycle, Total Demand, Compressor Power)** `cylinder-air-consumption-check` | SUPPLY ADEQUATE | Compressor capacity; Peak demand; Model and application | 3032–3041 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Tank Stand Leg Check (Full Tank Weight, Load per Leg, Leg Buckling)** `tank-stand-leg-check` | LEGS ADEQUATE | Buckling; Lateral loads; Model and application | 68–69, 281–287 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Nozzle Manifold Check (Flow per Nozzle, Total Flow, Feed Pipe Loss, Supply Pressure)** `nozzle-manifold-check` | SUPPLY ADEQUATE | Supply pressure; Pipe velocity; Pump curve; Model and application | 3024–3027, 352–368 | Automated + cross-check |
| **Tank Drain Time Check (Volume Drained, Initial Outflow, Time Through an Orifice)** `tank-drain-time-check` | DRAINS IN TIME | Drain time; Vent; Model and application | 68–69, 3024–3027 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Drilling Fixture Clamp Check (Drill Torque, Clamp Force to Stop Rotation, Strap Clamp Screw)** `drilling-fixture-clamp-check` | CLAMPING ADEQUATE | Machine power; Clamp screw; Rotation stop; Model and application | 1089–1093, 3131–3134, 1522–1532 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Conveyor Gravity Take-Up Plan (Slack Side Tension, Sag Tension, Counterweight, Travel)** `conveyor-takeup-plan` | TAKE-UP ADEQUATE | Travel; Belt rating; Model and application | 2487–2512, 3024–3027 | Automated + cross-check |
| **Winch Drum Brake Check (Load Torque at the Brake, Stop Time, Holding Factor, Brake Energy)** `winch-drum-brake-check` | BRAKE ADEQUATE | Stop time; Holding; Energy per stop; Energy per hour; Model and application | 2455–2459, 165–168 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Forklift Load Centre Check (Load Centre of Gravity, Derated Capacity, Side Offset)** `forklift-load-centre-check` | WITHIN CAPACITY | Capacity; Sideways offset; Capacity plate; Model and application | 221–227, 153–163 | Automated + cross-check |

## Machinery’s Handbook topic tools, forty-ninth pass: integrated design checks, fortieth round (added 28 October 2026)

A fortieth round of 9 integrated design checks in batch handbook65, combining single tools already in the set into checks not covered before: a sluice gate lift check (water force, seal friction, screw torque, handwheel effort), a ball detent check (spring preload, release force, spring stress at full rise), an expansion vessel sizing (liquid expansion, pre-charge and final pressure, vessel volume), a torque arm reaction check (output torque, arm reaction, anchor pin joint), a traction hoist check (counterweight, rope tension ratio, sheave traction, motor power), a shear pin overload design (pin size for a break torque, break factor, hub bearing), a portable gantry crane check (beam stress and deflection, A-frame leg buckling, castor load), a press tie rod check (cylinder force, rod thread stress, stretch, nut engagement) and a centrifuge bowl check (self hoop stress, liquid ring pressure, total hoop stress, speed limit). Tests cross-check against the hydrostatic force, power screw torque, compression spring, wedge force, gas law, clevis pin joint, belt friction, bolt shear and bearing, section shapes, beam cases, column buckling, metric thread, thread engagement, hydraulic cylinder sizing, centrifugal force and thick cylinder tools. WORKOS now holds 819 tools.

Correction in this pass: the internal (nut) thread shear area in the thread engagement, tapped hole design and Unified tapped hole check tools carried an extra threads-per-length factor, which inflated the strength ratio J by the pitch and overstated the engagement needed. They now use π D_s (½ + 0.57735 n (D_s − E_n)) per unit length, as in the handbook; for example, M10 × 1.5 into 310 MPa material now needs about 10.9 mm of engagement rather than 16.3 mm. A regression test covers the formula.

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Sluice Gate Lift Check (Water Force, Seal Friction, Screw Torque, Handwheel Effort)** `sluice-gate-lift-check` | EFFORT ACCEPTABLE | Handwheel effort; Self-locking; Spindle buckling; Model and application | 3024–3027, 1921–1928 | Automated + cross-check |

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Ball Detent Check (Spring Preload, Release Force, Spring Stress at Full Rise)** `ball-detent-check` | DETENT FORCE IN RANGE | Release force; Spring stress at full rise; Wear; Model and application | 304–324, 169–171 | Automated + cross-check |

### Engineering

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Expansion Vessel Sizing (Liquid Expansion, Pre-Charge and Final Pressure, Vessel Volume)** `expansion-vessel-sizing` | VESSEL ADEQUATE | Vessel volume; Relief valve; Model and application | 3032–3041 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Torque Arm Reaction Check (Output Torque, Arm Reaction, Anchor Pin Joint)** `torque-arm-reaction-check` | TORQUE ARM ADEQUATE | Pin bending; Pin shear; Eye bearing; Fork bearing; Eye net tension; Eye tear-out; Anchor bracket; Model and application | 1535, 1720–1735, 2122–2160 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Traction Hoist Check (Counterweight, Rope Tension Ratio, Sheave Traction, Motor Power)** `traction-hoist-check` | TRACTION AND POWER ADEQUATE | Traction, car full; Traction, car empty; Motor power; Lift regulations; Model and application | 165–168, 2473–2490 | Automated + cross-check |
| **Portable Gantry Crane Check (Beam Stress and Deflection, A-Frame Leg Buckling, Wheel Load)** `portable-gantry-check` | GANTRY ADEQUATE | Beam stress; Beam deflection; Leg buckling; Castors; Moving loaded; Model and application | 234–246, 257–277, 281–287 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Shear Pin Overload Design (Pin Size for a Break Torque, Break Factor, Hub Bearing)** `shear-pin-overload-design` | SHEAR PIN SUITABLE | Break factor; Hub bearing; Spares; Model and application | 1535, 1720–1735 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Press Tie Rod Check (Cylinder Force, Rod Thread Stress, Stretch, Nut Engagement)** `press-tie-rod-check` | TIE RODS ADEQUATE | Thread stress; Stretch; Nut engagement; Fatigue; Model and application | 281–286, 1867–1890, 1586–1590 | Automated + cross-check |
| **Centrifuge Bowl Check (Self Hoop Stress, Liquid Ring Pressure, Total Hoop Stress, Speed Limit)** `centrifuge-bowl-check` | BOWL ADEQUATE | Hoop stress; Overspeed protection; Model and application | 187–190, 290–294 | Automated + cross-check |

## Machinery’s Handbook topic tools, fiftieth pass: integrated design checks, forty-first round (added 28 October 2026)

A forty-first round of 9 integrated design checks in batch handbook66, combining single tools already in the set into checks not covered before: a screw clamp force check (handle torque, clamping force, screw stress), a scissor lift screw drive check (actuator force through the lift, screw torque, lift time, power), a rope drum and fleet angle check (fleet angle, rope capacity by layer, D/d ratio, drum torque), an enclosure cooling airflow check (heat load, wall losses, fan airflow needed), a ramp traction check (axle loads on a slope, tractive force needed, grip, tipping), a two-pump arrangement check (parallel or series operating point, flow gain, each pump’s duty), a cantilever rack arm check (arm section, bending stress, tip deflection, column bolts), a centrifugal clutch check (engagement speed, torque at running speed, idle clearance) and an expansion gap plan (movement over the temperature range, gap at installation, restrained stress). Tests cross-check against the power screw torque, rope winch drum, heating energy, rolling resistance, inclined plane, pump operating point, section shapes, beam cases, centrifugal force and thermal stress tools. WORKOS now holds 828 tools.

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Screw Clamp Force Check (Handle Torque, Clamping Force, Screw Stress)** `screw-clamp-force-check` | CLAMP FORCE ADEQUATE | Clamping force; Screw stress; Self-locking; Model and application | 1921–1928, 2561–2568 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Scissor Lift Screw Drive Check (Actuator Force Through the Lift, Screw Torque, Lift Time, Power)** `scissor-lift-screw-check` | DRIVE ADEQUATE | Screw torque; Lift time; Lowering; Model and application | 153–163, 1921–1928 | Automated + cross-check |
| **Rope Drum and Fleet Angle Check (Fleet Angle, Rope Capacity by Layer, D/d Ratio, Drum Torque)** `rope-drum-fleet-angle-check` | DRUM ARRANGEMENT ADEQUATE | Fleet angle; D/d ratio; Layers; Model and application | 165–168, 2455–2459 | Automated + cross-check |
| **Ramp Traction Check (Axle Loads on a Slope, Tractive Force Needed, Grip, Tipping)** `ramp-traction-check` | TRACTION ADEQUATE | Grip; Uphill axle load; Braking downhill; Model and application | 165–171 | Automated + cross-check |

### Engineering

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Enclosure Cooling Airflow (Heat Load, Wall Losses, Fan Airflow Needed)** `enclosure-cooling-airflow` | FAN ADEQUATE | Fan airflow; Filters; Model and application | 371–374, 2683 | Automated + cross-check |
| **Expansion Gap Plan (Movement over the Temperature Range, Gap at Installation, Restrained Stress)** `expansion-gap-plan` | GAP PLAN WORKS | Gap range; If the gap closes; Model and application | 375–376, 578 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Two-Pump Arrangement Check (Parallel or Series Operating Point, Flow Gain, Each Pump’s Duty)** `two-pump-arrangement-check` | FLOW MET | Flow; Pump duty point; One pump running; Model and application | 3021–3026 | Automated + cross-check |

### Strength

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Cantilever Rack Arm Check (Arm Section, Bending Stress, Tip Deflection, Column Bolts)** `cantilever-rack-arm-check` | ARM ADEQUATE | Bending stress; Tip deflection; Column bolts; Column; Model and application | 234–246, 257–277, 1535 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Centrifugal Clutch Check (Engagement Speed, Torque at Running Speed, Idle Clearance)** `centrifugal-clutch-check` | CLUTCH ADEQUATE | Idle clearance; Torque; Lining heat; Model and application | 187–190, 2433–2446 | Automated + cross-check |

## Machinery’s Handbook topic tools, fifty-first pass: integrated design checks, forty-second round (added 28 October 2026)

A forty-second round of 9 integrated design checks in batch handbook67, combining single tools already in the set into checks not covered before: a cylinder cushion check (kinetic energy, deceleration, cushion pressure, largest speed), a pipe bend thrust check (pressure and momentum force, resultant, thrust block bearing), a jet impact force check (nozzle flow and velocity, reaction, force on a plate), a spring clamp hydraulic release check (clamp force, release pressure, spring stress), an extraction duct check (total airflow, duct velocity, friction loss, fan pressure), a gravity chute check (sliding acceleration, exit speed, impact energy, least angle), a torque wrench adapter check (extension correction, actual torque, bolt preload), a friction wheel drive check (tangential force, normal force needed, contact stress, speed ratio) and a taper bush grip check (screw preload, wedge normal force, torque capacity). Tests cross-check against the uniform acceleration, pipe friction, orifice flow, compression spring, inclined plane, bolt torque and preload, and Hertz contact stress tools. WORKOS now holds 837 tools.

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Cylinder Cushion Check (Kinetic Energy, Deceleration, Cushion Pressure, Largest Speed)** `cylinder-cushion-check` | CUSHION ADEQUATE | Cushion pressure; Speed reduction; Model and application | 175–181, 281–286 | Automated + cross-check |
| **Pipe Bend Thrust Check (Pressure and Momentum Force, Resultant, Thrust Block Bearing)** `pipe-bend-thrust-check` | THRUST BLOCK ADEQUATE | Ground bearing; Undisturbed ground; Model and application | 3024–3027 | Automated + cross-check |
| **Jet Impact Force Check (Nozzle Flow and Velocity, Reaction, Force on a Plate)** `jet-impact-force-check` | REACTION ACCEPTABLE | Nozzle reaction; Injury risk; Model and application | 3024–3027, 352–368 | Automated + cross-check |

### Springs

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Spring Clamp Hydraulic Release Check (Clamp Force, Release Pressure, Spring Stress)** `spring-clamp-hydraulic-release` | CLAMP ADEQUATE | Clamping force; Release pressure; Spring stress at release; Wear; Model and application | 304–324, 281–286 | Automated + cross-check |

### Engineering

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Extraction Duct Check (Total Airflow, Duct Velocity, Friction Loss, Fan Pressure)** `extraction-duct-check` | EXTRACTION ADEQUATE | Transport velocity; Fan pressure; Capture; Model and application | 3024–3027 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Gravity Chute Check (Sliding Acceleration, Exit Speed, Impact Energy, Least Angle)** `gravity-chute-check` | CHUTE WORKS | Sliding; Exit speed; Model and application | 165–171, 175–181 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Torque Wrench Adapter Check (Extension Correction, Actual Torque, Bolt Preload)** `torque-wrench-adapter-check` | CORRECT SETTING | Preload; Nut factor; Model and application | 1521–1535 | Automated + cross-check |
| **Taper Bush Grip Check (Screw Preload, Wedge Normal Force, Torque Capacity)** `taper-bush-grip-check` | GRIP ADEQUATE | Grip; Screw preload; Key; Model and application | 1521–1535, 169–171 | Automated + cross-check |

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Friction Wheel Drive Check (Tangential Force, Normal Force Needed, Contact Stress, Speed Ratio)** `friction-wheel-drive-check` | DRIVE ADEQUATE | Contact pressure; Bearings; Model and application | 2301–2309, 165–168 | Automated + cross-check |

## Machinery’s Handbook topic tools, fifty-second pass: integrated design checks, forty-third round (added 29 October 2026)

A forty-third round of 7 integrated design checks in batch handbook68, aimed at engineering business, fabrication, machining, maintenance, fluid power and quality: a machine economic life check (year-by-year EUAC, minimum-cost life, keep or replace), a butt weld quantity and cost check (groove area, weld metal, arc time, cost against quote), a cutting insert consumption and reorder plan (tool life, parts per edge, monthly use, reorder point), a bearing fleet spares plan (rating life, Weibull failures, spares for a service level), a hydraulic press cycle check (regenerative approach, pressing force, return, cycle time, motor power), a vacuum table workholding check (holding force, milling force, sliding safety factor) and a gauge repeatability and bias check (type 1 study: Cg, Cgk, bias t-test). Tests cross-check against the interest factors, EUAC comparison, weld cost, Taylor tool life, bearing life, Weibull reliability, hydraulic cylinder, hydraulic power, milling power and vacuum cup tools. WORKOS now holds 844 tools.

### Money

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Machine Economic Life Check (Year-by-Year EUAC, Minimum-Cost Life, Keep or Replace)** `machine-economic-life` | KEEP FOR ANOTHER YEAR | Existing machine against the new one; Range examined; Model and application | 134–143 | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Butt Weld Quantity and Cost Check (Groove Area, Weld Metal, Arc Time, Cost against Quote)** `groove-weld-cost-check` | QUOTE COVERS THE WELDING | Cost against quote; Preparation; Model and application | 1438–1441, 1476–1484 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Cutting Insert Consumption and Reorder Plan (Tool Life, Parts per Edge, Monthly Use, Reorder Point)** `insert-consumption-reorder-plan` | STOCK ABOVE REORDER POINT | Stock on hand; Parts per edge; Model and application | 1102–1106, 1132–1140 | Automated + cross-check |
| **Vacuum Table Workholding Check (Holding Force, Milling Force, Sliding Safety Factor)** `vacuum-table-workholding-check` | PART HELD | Sliding; Lift-off and seal; Model and application | 1084–1101, 3032–3041 | Automated + cross-check |

### Maintenance

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Bearing Fleet Spares Plan (Rating Life, Weibull Failures, Spares for a Service Level)** `bearing-fleet-spares-plan` | SPARES ENOUGH | Spares held; Chance of failure per bearing; Model and application | 2403–2415, 128–133 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Hydraulic Press Cycle Check (Regenerative Approach, Pressing Force, Return, Cycle Time, Motor Power)** `hydraulic-press-cycle-check` | PRESS CYCLE ADEQUATE | Pressing force; Approach pressure; Cycle time; Motor power; Stall at relief; Model and application | 365–368 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Gauge Repeatability and Bias Check (Type 1 Study: Cg, Cgk, Bias t-Test)** `gauge-repeatability-bias-check` | GAUGE CAPABLE | Repeatability (Cg); Repeatability with bias (Cgk); Resolution; Bias significance; Master value; Model and application | 128–129 | Automated + cross-check |

## Thermodynamics tools from Fermi’s Thermodynamics, batch handbook69 (added 29 October 2026)

Six tools in batch handbook69 that apply the laws set out in Enrico Fermi’s Thermodynamics (Dover, 1956; first published 1937) to plant problems, with every property, rating and limit entered by the user: a vapour pressure and boiling check (Clausius–Clapeyron, boiling point at pressure, margin), a real gas cylinder contents check (van der Waals, compressibility, ideal-gas error), a reverse osmosis pressure check (osmotic pressure, net driving pressure, permeate flow), a battery pack heat check (irreversible and reversible heat, temperature rise, cooling), a heat pump and chiller COP check (Carnot limit, second-law efficiency, running cost) and a waste heat recovery limit check (heat released, exergy, claimed power against the second-law limit). The page column below gives pages in Fermi, not Machinery’s Handbook. WORKOS now holds 850 tools.

### Hydraulics

| Tool | Result with example inputs | Checks | Fermi pages | Tested |
|---|---|---|---|---|
| **Vapour Pressure and Boiling Check (Clausius–Clapeyron, Boiling Point at Pressure, Margin)** `vapour-pressure-boiling-check` | LIQUID STAYS BELOW BOILING | Margin to boiling; Distance from the reference point; Model and application | 63–68 | Automated + cross-check |
| **Reverse Osmosis Pressure Check (Osmotic Pressure, Net Driving Pressure, Permeate Flow)** `ro-pressure-check` | PRESSURE ADEQUATE | Concentrate-end driving pressure; Permeate flow; Scaling and membrane limits; Model and application | 118–122 | Automated + cross-check |

### Pneumatics

| Tool | Result with example inputs | Checks | Fermi pages | Tested |
|---|---|---|---|---|
| **Real Gas Cylinder Contents Check (Van der Waals, Compressibility, Ideal-Gas Error)** `real-gas-cylinder-contents` | CONTENTS SUFFICIENT | Mass held; Critical temperature; Pressure equipment; Model and application | 69–76 | Automated + cross-check |

### Engineering

| Tool | Result with example inputs | Checks | Fermi pages | Tested |
|---|---|---|---|---|
| **Battery Pack Heat Check (Irreversible and Reversible Heat, Temperature Rise, Cooling)** `battery-heat-check` | TEMPERATURE RISE ACCEPTABLE | Temperature rise; Hot spots and limits; Model and application | 94–97 | Automated + cross-check |
| **Heat Pump and Chiller COP Check (Carnot Limit, Second-Law Efficiency, Running Cost)** `heat-pump-cop-check` | COP PLAUSIBLE | Second law; Efficiency against your benchmark; Rating condition; Model and application | 31–45 | Automated + cross-check |
| **Waste Heat Recovery Limit Check (Heat Released, Exergy, Claimed Power against the Second-Law Limit)** `waste-heat-recovery-limit` | CLAIM PLAUSIBLE | Second law; Realistic share; Net power; Model and application | 44, 48–58 | Automated + cross-check |

## Polymer thermodynamics tools from Klenin, batch polymers (added 29 October 2026)

Six tools in batch polymers that apply the methods set out in V. J. Klenin’s Thermodynamics of Systems Containing Flexible-Chain Polymers (Elsevier, 1999) and the original papers it cites, with every property, interaction parameter, constant and limit entered by the user: a Flory–Huggins phase check for polymer solutions and blends, a Hansen solvent attack and swelling screen, a Flory–Rehner rubber swelling test, a single-point intrinsic viscosity check with Mark–Houwink molar mass, a Flory melting-point depression check and a dynamic light scattering size check. The section column gives Klenin’s sections, not Machinery’s Handbook pages. WORKOS now holds 856 tools.

### Materials

| Tool | Result with example inputs | Checks | Klenin sections | Tested |
|---|---|---|---|---|
| **Polymer Solution and Blend Phase Check (Flory–Huggins χ, Spinodal, Critical Point, Cloud Temperature)** `polymer-solution-phase-check` | ONE PHASE | Against the binodal (cloud point); Against the spinodal; Temperature margin; Polydispersity; Interaction parameter; Model and application | 3.1, 3.2.1 | Automated + cross-check |
| **Solvent Attack and Swelling Screen for Plastics and Elastomers (Hansen Distance Ra and RED)** `hansen-solvent-compatibility` | LIKELY TO RESIST | Position against the solubility sphere; Blend of A and B; Immersion test; Stress cracking and crystallinity; Model and application | 3.1.1 | Automated + cross-check |
| **Polymer Melting or Dissolution Temperature with a Diluent (Flory Melting-Point Depression)** `polymer-melting-point-depression` | CRYSTALS MELT AT THIS TEMPERATURE | Process temperature against the melting temperature; Liquid–liquid separation; Equilibrium melting point; Model and application | 6.1, 6.3 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Klenin sections | Tested |
|---|---|---|---|---|
| **Rubber Swelling Test: Crosslink Density, Chain Molar Mass and Network Modulus (Flory–Rehner)** `rubber-swelling-crosslink-density` | CROSSLINK DENSITY IN RANGE | Crosslink density against the range; Filler; Sensitivity to χ; Swelling equilibrium; Model and application | 3.5.1–3.5.2 | Automated + cross-check |
| **Polymer Intrinsic Viscosity and Molar Mass from One Viscometer Reading (Single-Point [η], Mark–Houwink)** `polymer-intrinsic-viscosity` | IV WITHIN SPECIFICATION | Intrinsic viscosity against the specification; Agreement of the single-point relations; Mark–Houwink constants; Viscometer practice; Model and application | 5.3, chapter 4 | Automated + cross-check |
| **Particle and Polymer Coil Size from Dynamic Light Scattering (Decay Rate, Diffusion Coefficient, Stokes–Einstein)** `dls-particle-size` | SIZE IN RANGE | Diameter against the specification; Internal motion (qRh); Viscosity and temperature; Polydispersity and concentration; Model and application | 3.3.2 | Automated + cross-check |

## Thermodynamics first principles after Bryan (added 29 October 2026)

Three tools in batch bryanthermo that apply results from G. H. Bryan’s Thermodynamics (Teubner, 1907; public domain) to plant problems, with every property, rating and limit entered by the user: a liquid adiabatic compression check (temperature rise, c_p − c_v, adiabatic bulk modulus, wave speed), a gas mixture property calculator (Dalton’s law, mixture R, c_p, γ, density, partial pressures, mixing entropy) and a thermoelectric cooler check (module constants from the datasheet, heat pumped, power, COP, hot-side heat). Tests cross-check against Bryan’s own forms of the results. WORKOS then held 859 tools. Two more were added later the same day, taking WORKOS to 925 tools: a heat engine Carnot limit check (ideal efficiency, second-law efficiency, most work, least heat rejected, entropy generated) and a least-work-to-chill check (second-law minimum power to cool a product below ambient, ideal COP, chiller claim check).

### Hydraulics

| Tool | Result with example inputs | Checks | Bryan sections | Tested |
|---|---|---|---|---|
| **Liquid Adiabatic Compression (Temperature Rise, cp − cv, Adiabatic Bulk Modulus, Wave Speed)** `liquid-adiabatic-compression` | TEMPERATURE RISE WITHIN LIMIT | Final temperature; Bulk modulus basis; Model and application | §33, §§113–116, §121 | Automated + cross-check |

### Pneumatics

| Tool | Result with example inputs | Checks | Bryan sections | Tested |
|---|---|---|---|---|
| **Gas Mixture Properties (Dalton: Molar Mass, Gas Constant, Specific Heats, Density, Partial Pressures, Mixing Entropy)** `gas-mixture-properties` | PARTIAL PRESSURE WITHIN LIMIT | Partial pressure of the checked gas; Perfect-gas behaviour; Model and application | §§121, 124–128 | Automated + cross-check |

### Engineering

| Tool | Result with example inputs | Checks | Bryan sections | Tested |
|---|---|---|---|---|
| **Thermoelectric Cooler Check (TEC Module Constants from the Datasheet, Heat Pumped, Power, COP, Hot-Side Heat)** `thermoelectric-cooler-check` | MODULES PUMP THE HEAT LOAD | Heat pumped against the load; Current rating; Voltage rating; Hot-side heat sink; Model and application | §§164–166 | Automated + cross-check |
| **Heat Engine Carnot Limit Check (Ideal Efficiency, Second-Law Efficiency, Most Work, Least Heat Rejected)** `heat-engine-carnot-limit` | INSIDE THE CARNOT LIMIT | Stated efficiency against the Carnot limit; Second-law efficiency; Reservoir temperatures; Model and application | §§61–65, 74, 77 | Automated + cross-check |
| **Least Work to Chill a Product Below Ambient (Second-Law Minimum Power, Ideal COP, Chiller Claim Check)** `chilling-least-work-check` | INSIDE THE SECOND-LAW LIMIT | Stated power against the least work; Second-law efficiency; Phase change; Model and application | §§90, 93 | Automated + cross-check |

## Thermodynamics tools from Çengel and Boles, batch handbook72 (added 29 October 2026)

Seven tools in batch handbook72 that apply the methods of Çengel and Boles, Thermodynamics: An Engineering Approach (5th edition, McGraw-Hill, 2006), with every gas property, refrigerant enthalpy, rating and limit entered by the user: an air-standard Otto and Diesel cycle check, a gas turbine (Brayton) cycle check with regenerator, a vapour-compression refrigeration or heat pump cycle check from state enthalpies, a moist air dew point and surface condensation check, a cooling coil load with dehumidification, a hydrocarbon combustion air and flue gas check, and a gas compressor or turbine isentropic efficiency check from measured temperatures. Saturation pressure of water uses the Hyland–Wexler equations (ASHRAE Handbook—Fundamentals, chapter 1). The section column below gives sections in Çengel and Boles, not Machinery’s Handbook. WORKOS now holds 866 tools.

### Engineering

| Tool | Result with example inputs | Checks | Çengel and Boles sections | Tested |
|---|---|---|---|---|
| **Air-Standard Otto and Diesel Cycle Check (Efficiency, Net Work, Mean Effective Pressure, Peak Pressure)** `otto-diesel-cycle-check` | PEAK PRESSURE WITHIN LIMIT | Peak cylinder pressure; Efficiency below the Carnot limit; Peak temperature; Model and application | 9-3 to 9-6 | Automated + cross-check |
| **Gas Turbine (Brayton) Cycle Check with Regenerator (Net Power, Back-Work Ratio, Efficiency)** `brayton-regenerator-check` | NET POWER MEETS DEMAND | Net work; Power against demand; Regenerator; Model and application | 7-12, 9-8, 9-9 | Automated + cross-check |
| **Vapour-Compression Refrigeration or Heat Pump Cycle Check (COP from State Enthalpies, Carnot Limit)** `vapour-compression-cycle-check` | COP MEETS TARGET | Second law; COP against target; Model and application | 6-12, 11-1 to 11-4 | Automated + cross-check |
| **Moist Air Dew Point and Surface Condensation Check (Humidity Ratio, Enthalpy, Dew-Point Margin)** `surface-dew-point-check` | SURFACE STAYS DRY | Surface against the dew point; Model and application | 14-1 to 14-3 | Automated + cross-check |
| **Cooling Coil Load with Dehumidification (Psychrometric Balance, Condensate, Sensible Heat Ratio)** `cooling-coil-dehumidification-check` | COIL CAN MEET THE LOAD | Coil capacity; Condensation; Coil surface; Model and application | 14-2, 14-7 | Automated + cross-check |
| **Hydrocarbon Combustion Air and Flue Gas Check (Air–Fuel Ratio, Flue Analysis, Water Dew Point)** `combustion-air-flue-gas-check` | FLUE ABOVE DEW POINT | Lowest surface against the dew point; Excess air; Acid dew point; Model and application | 15-1, 15-2 | Automated + cross-check |
| **Gas Compressor or Turbine Isentropic Efficiency from Measured Temperatures (Power, Entropy Generation)** `compressor-turbine-efficiency-check` | EFFICIENCY ACCEPTABLE | Physical limit; Efficiency against minimum; Model and application | 7-9, 7-12 | Automated + cross-check |

## Thermodynamics tool from Callen’s Thermodynamics, batch callen (added 29 October 2026)

One tool in batch callen applying the Joule–Thomson relation from Herbert B. Callen’s *Thermodynamics and an Introduction to Thermostatistics* (2nd edition, Wiley, 1985) to liquids: the temperature rise of oil, water or another liquid throttled across a relief valve, flow control, orifice or partly closed valve, with every property and limit entered by the user. Seven other tools built from the same source were withdrawn before release as duplicates of tools that are live or in progress elsewhere.

### Hydraulics

| Tool | Result with example inputs | Checks | Callen sections | Tested |
|---|---|---|---|---|
| **Liquid Throttling Temperature Rise (Valve and Orifice Heating, Joule–Thomson for Liquids)** `liquid-throttling-temperature-rise` | VALVE HEATING ABOVE LIMIT | Throttling heating; Expansion term; Vapour pressure; Model and application | 3.9, 6.3 (pp. 84–86, 160–165) | Automated + cross-check |

## Thermodynamics tools from Guggenheim’s Thermodynamics, batch handbook71 (added 29 October 2026)

Seven tools in batch handbook71 that apply the methods of E. A. Guggenheim, *Thermodynamics: An Advanced Treatment for Chemists and Physicists* (5th revised edition, North-Holland, 1967), cited by section only, with every property, rating and limit entered by the user. Two of them sit beside tools from batch handbook69 with a similar subject: `clausius-boiling-margin-check` (beside `vapour-pressure-boiling-check`) and `ro-concentrate-pressure-check` (beside `ro-pressure-check`); the owner approved both under their own ids.

### Hydraulics

| Tool | Result with example inputs | Checks | Guggenheim sections | Tested |
|---|---|---|---|---|
| **Trapped Liquid Thermal Pressure Check (Blocked-In Line Heating, Pipe Stretch, Relief Need)** `trapped-liquid-pressure-check` | PRESSURE WITHIN DESIGN | Final pressure; Wall model; Gas pockets; Model and application | 1.46 | Automated + cross-check |

### Engineering

| Tool | Result with example inputs | Checks | Guggenheim sections | Tested |
|---|---|---|---|---|
| **Reverse Osmosis Concentrate-End Check (Osmotic Coefficient, Concentrate Osmotic Pressure, Least Feed Pressure)** `ro-concentrate-pressure-check` | FEED PRESSURE ADEQUATE | Concentrate end; Concentration polarisation; Scaling; Model and application | 5.10, 5.16, 5.28, 7.06–7.08 | Automated + cross-check |
| **Boiling Margin Check (Clausius–Clapeyron Vapour Pressure, Keep Liquid or Make It Boil)** `clausius-boiling-margin-check` | NO BOILING EXPECTED | Margin to boiling; Temperature range; Local pressure; Model and application | 3.37–3.39 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Guggenheim sections | Tested |
|---|---|---|---|---|
| **pH Electrode Two-Buffer Calibration Check (Nernst Slope, Offset, Sample pH)** `ph-electrode-calibration-check` | ELECTRODE IN LIMITS | Slope; Offset; Sample within the buffers; Buffer values; Model and application | ch. 8 (8.03, 8.11, 8.12) | Automated + cross-check |
| **Filter Membrane Bubble Point Check (Integrity Test, Largest Pore, Other Wetting Liquid)** `filter-bubble-point-check` | INTEGRITY TEST PASSED | Bubble point; Wetting; Surface tension; Model and application | 1.60, 1.61 | Automated + cross-check |

### Pneumatics

| Tool | Result with example inputs | Checks | Guggenheim sections | Tested |
|---|---|---|---|---|
| **Gas Throttling Temperature Check (Joule–Thomson Cooling, Regulator Outlet, Preheat)** `gas-throttling-temperature-check` | PREHEAT NEEDED | Outlet temperature; Gas model; Moisture and hydrates; Model and application | 3.11, 3.20–3.22 | Automated + cross-check |
| **Gas Separation Energy Check (Ideal Mixing, Least Work, Nitrogen Generator Efficiency)** `gas-separation-energy-check` | WITHIN TARGET ENERGY | Specific energy; Purity set point; Energy boundary; Model and application | 4.18–4.20 | Automated + cross-check |

## Project, business, operations, maintenance, quality and machining tools, batch handbook73 (added 29 October 2026)

Eight tools in batch handbook73 from public, checkable sources and Machinery’s Handbook topics, with every rate, limit and benchmark entered by the user: an earned value check (cost and schedule variance, CPI, SPI, estimate at completion, TCPI; GAO-20-195G), a PERT schedule check (three-point estimates, expected duration, chance of meeting the deadline; Malcolm et al. 1959), an early payment discount check (implied and effective annual rate; handbook pp. 134–136), an economic production quantity check (batch size with a finite production rate; Silver, Pyke and Thomas), a WIP and lead time check (Little’s law, flow efficiency, WIP limit), a critical spares plan (Poisson failures over the lead time; NIST e-Handbook), a capability confidence check (lower confidence bounds on Cp and Cpk; NIST e-Handbook 6.1.6) and a parting-off plan (spindle speed limit, cutting force and power, parting time; handbook pp. 1084–1101). The page column gives Machinery’s Handbook pages where a tool cites them. WORKOS now holds 882 tools.

### Projects

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **Earned Value Check (Cost and Schedule Variance, CPI, SPI, Estimate at Completion, TCPI)** `earned-value-check` | PROJECT ON TRACK | Cost performance; Schedule performance; Efficiency needed to finish on budget; Earned value measurement; Model and application |  | Automated + cross-check |
| **PERT Schedule Check (Three-Point Estimates, Expected Duration, Chance of Meeting the Deadline)** `pert-schedule-check` | DEADLINE ACHIEVABLE | Chance of meeting the deadline; Other paths; Model and application | 128–133 | Automated + cross-check |

### Money

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **Early Payment Discount Check (Implied Interest Rate, Effective Annual Rate, Take or Pay Net)** `early-payment-discount-check` | TAKE THE DISCOUNT | Discount against your cost of funds; Cash available; Model and application | 134–136 | Automated + cross-check |

### Inventory

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **Economic Production Quantity Check (Batch Size, Run Length, Peak Stock, Cost against Current Batch)** `economic-production-quantity` | BATCH SIZE CLOSE TO OPTIMAL | Current batch size; Capacity; Model and application |  | Automated + cross-check |

### Operations

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **WIP and Lead Time Check (Little’s Law, Flow Efficiency, WIP Limit for a Target Lead Time)** `wip-lead-time-check` | LEAD TIME WITHIN TARGET | Lead time; Stable system; Model and application |  | Automated + cross-check |

### Maintenance

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **Critical Spares Plan (Poisson Failures over the Lead Time, Spares for a Service Level)** `critical-spares-poisson-plan` | SPARES ENOUGH | Spares held; Failure pattern; Model and application | 128–133 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **Capability Confidence Check (Cp, Cpk and Their Lower Confidence Bounds, Sample Size)** `capability-confidence-check` | CAPABILITY PROVEN | Cpk lower bound; Sample size; Stability and normality; Model and application | 128–133 | Automated + cross-check |

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **Parting-Off Plan (Spindle Speed Limit, Cutting Force and Power, Parting Time)** `parting-off-plan` | PARTING PLAN WORKS | Spindle power; Parting time; Centre of a solid bar; Model and application | 1084–1101 | Automated + cross-check |

## Forty-fourth round of design checks, batch handbook74 (added 29 October 2026)

Five integrated design checks in batch handbook74, built from Machinery’s Handbook topics and chaining existing tools, with every material property, allowable and limit entered by the user: a boring bar overhang check (deflection, diameter error, natural frequency, longest overhang, steel against carbide), a slender work turning check (work deflection between centres or in a chuck, steady rests needed), a reaming plan (pilot drill from the allowance, stock window, speeds, cycle time, holes per reamer), a dowel pin joint check (pin shear, bearing, fit from the limits, engagement) and a taper shank holding check (drilling torque against taper friction torque, self-holding condition). WORKOS now holds 887 tools.

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Boring Bar Overhang Check (Deflection, Diameter Error, Natural Frequency, Longest Overhang)** `boring-bar-overhang-check` | OVERHANG ACCEPTABLE | Diameter error; Overhang ratio; Chatter; Model and application | 197, 302, 762–790 | Automated + cross-check |
| **Slender Work Turning Check (Work Deflection, Diameter Error, Steady Rest Spacing)** `slender-work-turning-check` | SUPPORT OR LIGHTER CUT NEEDED | Diameter error; Shape of the error; Chatter and heat; Model and application | 232–244, 762, 1093–1094 | Automated + cross-check |
| **Reaming Plan (Drilled Size, Stock, Speeds, Cycle Time, Holes per Reamer)** `reaming-plan` | REAMING PLAN FEASIBLE | Stock for the reamer; Spindle speed; Pilot drill; Model and application | 853, 1059, 1084–1092 | Automated + cross-check |
| **Taper Shank Holding Check (Drilling Torque, Thrust, Taper Friction Torque, Self-Holding)** `taper-shank-holding-check` | TANG OR DRAWBAR NEEDED | Holding torque; Self-holding; Condition of the taper; Model and application | 948–959, 1084–1092 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Dowel Pin Joint Check (Pin Shear, Bearing, Fit Interference, Engagement)** `dowel-pin-joint-check` | DOWELS ADEQUATE | Pin shear; Bearing in the softer part; Engagement; Fit; Model and application | 631–668, 1720–1735, 1747–1748 | Automated + cross-check |

## Thermodynamics tools from Çengel and Boles, second batch cengel2 (added 29 October 2026)

Six more tools applying the methods of Çengel and Boles, Thermodynamics: An Engineering Approach (5th edition, McGraw-Hill, 2006), with every steam-table value, efficiency, capacity and target entered by the user: a steam Rankine cycle check, wet steam dryness by throttling calorimeter, a cogeneration (CHP) utilisation and primary energy saving check, adiabatic mixing of two air streams, a direct evaporative cooler check, and heating with humidification. Moist-air saturation pressure uses the Hyland–Wexler equations (ASHRAE Handbook—Fundamentals, chapter 1); the primary energy saving follows the method of Directive 2012/27/EU, Annex II, with user-entered reference efficiencies. The section column gives sections in Çengel and Boles. WORKOS now holds 893 tools.

### Engineering

| Tool | Result with example inputs | Checks | Çengel and Boles sections | Tested |
|---|---|---|---|---|
| **Steam Rankine Cycle Check (Efficiency, Steam Flow, Heat Rate, Turbine Exhaust Dryness)** `rankine-cycle-check` | EXHAUST DRY ENOUGH | Turbine exhaust dryness; Energy balance; Model and application | 10-2 to 10-4 | Automated + cross-check |
| **Wet Steam Dryness by Throttling Calorimeter (Dryness Fraction, Calorimeter Validity)** `steam-dryness-throttling-check` | STEAM DRY ENOUGH | Calorimeter superheat; Dryness against requirement; Model and application | 3-5, 5-4 | Automated + cross-check |
| **Cogeneration (CHP) Utilisation and Primary Energy Saving Check** `cogeneration-saving-check` | CHP SAVES PRIMARY ENERGY | Primary energy saving; Energy balance; Useful heat; Model and application | 10-8 | Automated + cross-check |
| **Adiabatic Mixing of Two Air Streams (Mixed Temperature, Humidity, Dew Point, Fog Risk)** `air-stream-mixing-check` | MIXED AIR CLEAR | Mixed relative humidity; Mixing calculation; Model and application | 14-2, 14-7 | Automated + cross-check |
| **Direct Evaporative Cooler Check (Wet-Bulb, Supply Temperature, Water Use, Cooling Capacity)** `evaporative-cooler-check` | COOLER REACHES TARGET | Supply temperature; Target against the wet-bulb; Water and hygiene; Model and application | 14-4, 14-7 | Automated + cross-check |
| **Heating with Humidification (Heater Load, Water or Steam Needed, Equipment Check)** `heating-humidification-check` | EQUIPMENT MEETS THE DUTY | Heater capacity; Humidifier capacity; Humidifier enthalpy; Model and application | 14-7 | Automated + cross-check |

## Forty-fifth round of design checks, batch handbook75 (added 29 October 2026)

Five integrated design checks in batch handbook75, built from Machinery’s Handbook topics and chaining existing tools, with every material property, allowable, rating and limit entered by the user: a trepanning plan (ring cut power, torque and time, core recovered, against a solid drill), a grinding wheel cost plan (wear from the grinding ratio, dressing loss, parts per wheel, cost per part), a drill bushing position check (clearance, drill tilt, hole position error, chip gap), a Woodruff key check (key shear, hub and shaft bearing, shaft torsion at the keyseat) and an eyebolt lift check (unequal leg tensions, capacity at the angle, thread engagement). WORKOS now holds 898 tools.

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Trepanning Plan (Ring Cut Power, Torque, Time and Core against Solid Drilling)** `trepanning-plan` | TREPANNING FEASIBLE | Spindle power, trepanning; Spindle power, solid drill; Starting and chips; Model and application | 1077–1081, 1084–1092 | Automated + cross-check |
| **Grinding Wheel Cost Plan (Wear from G-Ratio, Dressing, Parts per Wheel, Cost per Part)** `grinding-wheel-cost-plan` | WITHIN TARGET COST | Cost per part; Dressing share; Grinding ratio; Model and application | 1196–1199, 1199–1268 | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Drill Bushing Position Check (Clearance, Drill Tilt, Hole Position Error, Chip Gap)** `drill-bushing-position-check` | BUSHING HOLDS POSITION | Hole position; Chip gap; Jig accuracy; Model and application | 3121–3125, 3131–3134 | Automated + cross-check |

### Fasteners

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Woodruff Key Check (Key Shear, Hub and Shaft Bearing, Weakened Shaft Torsion)** `woodruff-key-check` | KEY AND SHAFT ADEQUATE | Key shear; Bearing; Shaft at the keyseat; Model and application | 2460–2486, 301 | Automated + cross-check |

### Mechanics

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Eyebolt Lift Check (Unequal Leg Tensions, Angled Capacity, Thread Engagement)** `eyebolt-lift-check` | EYEBOLTS ADEQUATE | Eyebolt 1; Eyebolt 2; Thread engagement; Seating and alignment; Model and application | 2613–2650, 3450 | Automated + cross-check |

## Forty-sixth round of design checks, batch handbook77 (added 29 October 2026)

Three integrated design checks in batch handbook77, built from Machinery’s Handbook topics and chaining existing tools, with every rating, factor, property and limit entered by the user: a countershaft bearing check (spur gear forces by mesh angle, bearing loads in two planes, L10 life, static factor, shaft stress), a carburizing case depth plan (total case for a ground effective case, time at temperature, cost, case against the section) and an induction hardening plan (reference depth at the generator frequency, frequency for the case, heating energy and power). WORKOS now holds 908 tools.

### Power Transmission

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Countershaft Bearing Check (Gear Forces, Bearing Loads in Two Planes, L10 Life, Shaft Stress)** `countershaft-bearing-check` | SHAFT AND BEARINGS ADEQUATE | Bearing life; Static safety; Shaft stress; Fatigue and stress raisers; Model and application | 2131–2160, 2404–2412, 257–277 | Automated + cross-check |

### Materials

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **Carburizing Case Depth Plan (Total Case for a Ground Effective Case, Time at Temperature, Furnace Cost)** `carburizing-case-depth-plan` | CASE PLAN SUITS THE SECTION | Case against the section; Case depth factor; Drawing callout; Model and application | 467–470, 484–487 | Automated + cross-check |
| **Induction Hardening Plan (Reference Depth, Frequency for the Case, Heating Energy and Power)** `induction-hardening-plan` | FREQUENCY TOO LOW FOR THE CASE | Depth for the case; Bar size; Process trial; Model and application | 487–489, 467–470 | Automated + cross-check |

## Thermodynamics tools after Linder, batch handbook70 (added 29 October 2026)

Six tools in batch handbook70 that apply methods from Bruno Linder’s Thermodynamics and Introductory Statistical Mechanics (Wiley-Interscience, 2004), cited by section and printed page, with every property, rating and limit entered by the user: a heat engine and heat pump second-law check (Carnot limit, entropy generated, lost work), a gas pressure reduction cooling check (Joule–Thomson, van der Waals estimate, preheat), a boiling point under vacuum (Clausius–Clapeyron), a solvent vapour headspace check against the LEL (Raoult’s law), a reverse osmosis pressure check (van ’t Hoff with an osmotic coefficient and salt passage) and a hot and cold water blending check (mixing entropy, lost work). The owner approved all six knowing that four overlap tools already published (vapour-pressure-boiling-check, clausius-boiling-margin-check, ro-pressure-check, ro-concentrate-pressure-check, gas-throttling-temperature-check, heat-pump-cop-check, waste-heat-recovery-limit).

### Engineering

| Tool | Result with example inputs | Checks | Linder pages | Tested |
|---|---|---|---|---|
| **Heat Engine and Heat Pump Second-Law Check (Carnot Limit, Entropy Generated, Lost Work)** `heat-engine-second-law-check` | CLAIM WITHIN THE LIMIT | Second law; Credibility; Temperatures; Model and application | 32–41, 48 | Automated + cross-check |
| **Boiling Point Under Vacuum (Clausius–Clapeyron Boiling Temperature, Pressure for a Temperature Limit)** `vacuum-boiling-point` | BOILS BELOW THE LIMIT | Temperature limit; Extrapolation; Liquid depth and solutes; Model and application | 96–97 | Automated + cross-check |
| **Solvent Vapour Headspace Check (Raoult’s Law Partial Pressure, Saturated Concentration, Share of LEL)** `solvent-headspace-lel-check` | FLAMMABLE HEADSPACE POSSIBLE | Share of LEL; Screening only; Model and application | 97, 104–105 | Automated + cross-check |

### Pneumatics

| Tool | Result with example inputs | Checks | Linder pages | Tested |
|---|---|---|---|---|
| **Gas Pressure Reduction Cooling Check (Joule–Thomson Temperature Drop, Outlet Temperature, Preheat)** `gas-throttling-cooling-check` | PREHEAT NEEDED | Outlet temperature; Condensation and hydrates; Model range; Model and application | 29–31 | Automated + cross-check |

### Hydraulics

| Tool | Result with example inputs | Checks | Linder pages | Tested |
|---|---|---|---|---|
| **Reverse Osmosis Pressure Check (van ’t Hoff Osmotic Pressure, Concentrate End, Net Driving Pressure)** `ro-osmotic-pressure-check` | FEED PRESSURE ENOUGH | Concentrate end; Scaling and fouling; Model and application | 112–113 | Automated + cross-check |
| **Hot and Cold Water Blending Check (Flow Split, Hot Supply, Entropy Generated, Lost Work)** `hot-cold-water-blend-check` | HOT SUPPLY ENOUGH | Hot supply; Outlet temperature rules; Model and application | 48–51, 91–93 | Automated + cross-check |

## Quality, reliability, maintenance, operations and fabrication tools, batch handbook76 (added 30 October 2026)

Six tools in batch handbook76 from public, checkable sources, with every limit, target and price entered by the user: a bearing defect frequency check (BPFO, BPFI, ball spin and cage frequencies and their harmonics matched to a measured peak; MathWorks, Randall and Antoni 2011), an individuals control chart check (limits from the average moving range; NIST e-Handbook 6.3.2.2), a p-chart check (fraction defective limits for equal samples; NIST e-Handbook 6.3.3.2), a reliability demonstration test plan (chi-square test length for an MTBF objective; NIST e-Handbook 8.3.1.1), a queue wait check (M/M/c Erlang C and Little’s law; Kleinrock 1975, Little 1961) and a sheet nesting yield check (straight and two-block layouts, utilisation, sheets and cost per blank; Machinery’s Handbook pp. 1338–1339). The page column gives Machinery’s Handbook pages where a tool cites them. WORKOS now holds 920 tools.

### Maintenance

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **Bearing Defect Frequency Check (BPFO, BPFI, Ball Spin, Cage, Match to a Measured Peak)** `bearing-defect-frequency-check` | PEAK MATCHES OUTER RACE DEFECT | Measured peak; Confirmation; Model and application |  | Automated + cross-check |
| **Reliability Demonstration Test Plan (MTBF Objective, Confidence, Allowed Failures, Test Length)** `reliability-demonstration-test` | TEST FITS THE TIME AVAILABLE | Calendar time; Failure model; Model and application |  | Automated + cross-check |

### Quality

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **Individuals Control Chart Check (Moving Range, Control Limits, Points Out of Control)** `individuals-chart-check` | PROCESS IN CONTROL | Points beyond the limits; Number of readings; Model and application |  | Automated + cross-check |
| **p-Chart Check (Fraction Defective, Control Limits, Samples Out of Control)** `p-chart-check` | PROCESS IN CONTROL | Samples beyond the limits; Lower limit; Model and application |  | Automated + cross-check |

### Operations

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **Queue Wait Check (Utilisation, Chance of Waiting, Average Wait and Queue, Servers Needed)** `queue-wait-check` | WAIT WITHIN TARGET | Average wait; Utilisation; Arrival pattern; Model and application |  | Automated + cross-check |

### Fabrication

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **Sheet Nesting Yield Check (Parts per Sheet, Material Utilisation, Sheets and Cost per Part)** `sheet-nesting-yield` | LAYOUT ACCEPTABLE | Material utilisation; Shape and process; Model and application | 1338–1339 | Automated + cross-check |

## Forty-seventh round of design checks, batch handbook78 (added 30 October 2026)

Three integrated design checks in batch handbook78, built from the electrical discharge machining and laser sections of Machinery’s Handbook, with every removal rate, gap, wear figure, beam property and limit entered by the user: an EDM sinker plan (roughing current, duty cycle, roughing and finishing time, electrode wear and count, electrode undersize, cost), a wire EDM cut plan (kerf, smallest inside corner, cutting and skim time, wire use, tension, cost) and a laser cutting plan (focused spot, power density, depth of focus, speed scaled by power and thickness, time and cost). WORKOS now holds 923 tools.

### Manufacturing

| Tool | Result with example inputs | Checks | Handbook pages | Tested |
|---|---|---|---|---|
| **EDM Sinker Plan (Current for the Electrode, Duty Cycle, Roughing and Finishing Time, Electrode Wear and Sizes)** `edm-sinker-plan` | EDM PLAN WORKABLE | Machine current; Finishing stock; Settings; Model and application | 1394–1399 | Automated + cross-check |
| **Wire EDM Cut Plan (Kerf, Wire Offset and Corner Radius, Cutting and Skim Time, Wire Use, Tension, Cost)** `wire-edm-cut-plan` | WIRE AND SETTINGS SUIT THE CUT | Inside corners; Wire tension; Settings; Model and application | 1394–1403 | Automated + cross-check |
| **Laser Cutting Plan (Focused Spot, Power Density, Depth of Focus, Cutting Speed by Power and Thickness, Time and Cost)** `laser-cutting-plan` | BEAM SUITS THE CUT | Power density; Depth of focus; Cutting speed; Model and application | 1487–1494 | Automated + cross-check |

## Quality statistics and forecasting tools, batch handbook80 (added 30 October 2026)

Six tools in batch handbook80 from the NIST/SEMATECH e-Handbook of Statistical Methods, with every target, limit and tolerance entered by the user: an EWMA control chart check (weighted moving average and steady-state limits; 6.3.2.4), a CUSUM control chart check (tabular upper and lower sums against a decision interval; 6.3.2.3), a c-chart check (Poisson limits for defects per unit; 6.3.3.1), a Grubbs outlier check (G statistic and t-based critical value; 1.3.5.17), a linear calibration check (least-squares line, offset and gain tests, inverse prediction and calibration limits; 2.3.6.6, 4.5.2.1, 4.5.1.2) and an exponential smoothing forecast (next-period forecast, MSE and best smoothing constant; 6.4.3.1–6.4.3.2). Each tool reproduces the NIST worked example where one is printed. No tool cites Machinery’s Handbook. WORKOS now holds 931 tools.

### Quality

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **EWMA Control Chart Check (Weighted Moving Average, Control Limits, Small Shifts)** `ewma-chart-check` | PROCESS IN CONTROL | EWMA beyond the limits; Historical data; Model and application |  | Automated + cross-check |
| **CUSUM Control Chart Check (Tabular Upper and Lower Sums, Decision Interval, First Signal)** `cusum-chart-check` | UPWARD SHIFT SIGNALLED | Sums against the decision interval; Chart design; Model and application |  | Automated + cross-check |
| **c-Chart Check (Defects per Unit, Poisson Control Limits, Counts Out of Control)** `c-chart-check` | PROCESS IN CONTROL | Units beyond the limits; Lower limit; Model and application |  | Automated + cross-check |
| **Grubbs Outlier Check (Suspect Value, G Statistic, Critical Value, Significance)** `grubbs-outlier-check` | OUTLIER DETECTED | Suspect value; Normality; Model and application |  | Automated + cross-check |
| **Linear Calibration Check (Straight-Line Fit, Calibrated Value, Calibration Interval)** `linear-calibration-check` | CALIBRATION INTERVAL WITHIN TOLERANCE | Calibration interval; Offset and gain; Straight line; Model and application |  | Automated + cross-check |

### Planning

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **Exponential Smoothing Forecast (Next-Period Demand, Forecast Error, Best Smoothing Constant)** `exponential-smoothing-forecast` | FORECAST ERROR WITHIN TARGET | Forecast error; Smoothing constant; Trend and season; Model and application |  | Automated + cross-check |

## Statistics, forecasting and reliability tools, batch handbook81 (added 30 October 2026)

Eight tools in batch handbook81 from the NIST/SEMATECH e-Handbook of Statistical Methods, with every specification, target, activation energy and requirement entered by the user: a normal tolerance interval check (Howe two-sided factor, exact non-central t one-sided factor, Natrella approximation; 7.2.6.3), a one-way ANOVA check (F test of group means; 7.4.3.3–7.4.3.4), a two-variance F test (1.3.5.9), a standard deviation chi-square check with a confidence interval for sigma (1.3.5.8), a Holt trend forecast (double exponential smoothing; 6.4.3.3–6.4.3.4), an Arrhenius acceleration check (8.1.5.1), MTBF confidence bounds for a constant failure rate (8.4.5.1) and a reliability growth check with the power-law (Duane) model (8.4.5.2). Each tool reproduces the NIST worked example. No tool cites Machinery’s Handbook. WORKOS now holds 939 tools.

### Quality

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **Normal Tolerance Interval Check (Coverage, Confidence, Tolerance Factor, Against Specification)** `normal-tolerance-interval-check` | TOLERANCE INTERVAL WITHIN SPEC | Interval against specification; Normal distribution; Model and application |  | Automated + cross-check |
| **One-Way ANOVA Check (Group Means, F Test, Machines, Suppliers or Settings)** `one-way-anova-check` | GROUP MEANS DIFFER | Difference between group means; Equal spread and normality; Model and application |  | Automated + cross-check |
| **Two-Variance F Test (Compare the Spread of Two Machines, Batches or Methods)** `two-variance-f-test` | NO EVIDENCE SPREADS DIFFER | Variance ratio; Normal data; Model and application |  | Automated + cross-check |
| **Standard Deviation Chi-Square Check (Process Spread Against a Target Sigma, Confidence Interval)** `standard-deviation-chi-square-check` | SPREAD DIFFERS FROM TARGET | Spread against target; Normal data; Model and application |  | Automated + cross-check |

### Planning

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **Holt Trend Forecast (Double Exponential Smoothing, Level and Trend, Forecast Error)** `holt-trend-forecast` | FORECAST ERROR WITHIN TARGET | Forecast error; Smoothing constants; Trend and season; Model and application |  | Automated + cross-check |

### Maintenance

| Tool | Result with example inputs | Checks | Handbook pages (where cited) | Tested |
|---|---|---|---|---|
| **Arrhenius Acceleration Check (Temperature Acceleration Factor, Equivalent Hours, Test Length)** `arrhenius-acceleration-check` | TEST COVERS TARGET LIFE | Test length; Activation energy; Same failure mechanism; Model and application |  | Automated + cross-check |
| **MTBF Confidence Bounds (Field or Test Failures, Chi-Square Limits, Requirement Check)** `mtbf-confidence-bounds` | MTBF REQUIREMENT DEMONSTRATED | Lower bound against requirement; Constant failure rate; Model and application |  | Automated + cross-check |
| **Reliability Growth Check (Duane Power-Law Model, Growth Slope, MTBF at End of Test)** `reliability-growth-check` | MTBF GOAL DEMONSTRATED | Lower limit against goal; Reliability growth; Model fit; Model and application |  | Automated + cross-check |
