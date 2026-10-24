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
