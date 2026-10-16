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
