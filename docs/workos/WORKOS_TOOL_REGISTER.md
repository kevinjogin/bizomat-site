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
