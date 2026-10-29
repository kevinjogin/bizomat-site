# READOS ↔ WORKOS connections: items for review

Generated 2026-10-29 by `npm run knowledge:check -- --report` from `src/data/knowledge-links.json` and `src/data/knowledge-link-suggestions.json`. Do not edit by hand.

Published: 197 relationships (129 from links authors wrote in the books, 68 from editorial review). Rejected: 15. Suggestions awaiting review: 944 (557 flagged as weak or without a clear chapter).

## 1. Approved by editorial review: please confirm

These were approved by reading the chapter text and the tool definition (the reason records what was checked). Change `status` to `rejected` for any you disagree with.

| READOS book | Chapter | WORKOS tool | Type | What was checked |
|---|---|---|---|---|
| Fluids, HVAC and Building Services | Fans and ductwork for ventilation and HVAC: fan curves, duct design, extraction and energy | Extraction Duct Check (Total Airflow, Duct Velocity, Friction Loss, Fan Pressure) | applies | Chapter covers capture and duct velocity, extraction and pressure loss; tool calculates airflow, duct velocity, friction loss and fan pressure. |
| Fluids, HVAC and Building Services | Pipe flow, pressure drop and pump selection: getting fluid where it needs to go efficiently | Darcy Pipe Pressure Drop | applies | Chapter explains friction factor and pressure drop (Darcy named); tool calculates Darcy–Weisbach drop and head loss. |
| Fluids, HVAC and Building Services | Pipe flow, pressure drop and pump selection: getting fluid where it needs to go efficiently | Pump Operating Point on the System Curve | applies | Chapter discusses the operating point 11 times with pump and system curves; tool finds the operating point on the system curve. |
| Fluids, HVAC and Building Services | Pipe flow, pressure drop and pump selection: getting fluid where it needs to go efficiently | Pumping System Design (Head, Power and NPSH) | applies | Chapter covers head, friction, pump and system curves and NPSH; tool designs a simple pumping system with head, power and NPSH. |
| Fluids, HVAC and Building Services | Pipe flow, pressure drop and pump selection: getting fluid where it needs to go efficiently | Pump Suction Line Check (Friction Loss, NPSH Available, Lowest Liquid Level) | applies | Chapter explains NPSH (7 mentions) and cavitation (5); tool checks suction friction loss and NPSH available. |
| Fluids, HVAC and Building Services | Pipe flow, pressure drop and pump selection: getting fluid where it needs to go efficiently | Pump Shaft Power | applies | Chapter covers head, power and pump efficiency (15 mentions each of power and efficiency); tool calculates hydraulic and shaft power. |
| Investment Appraisal and Business Cases | NPV, IRR and payback answer different questions: reading investment measures when they disagree | Equipment Investment Appraisal (NPV, IRR, Payback, B/C, EUAC) | applies | Chapter is about reading NPV, IRR and payback together (each mentioned 34 times); tool reports NPV, IRR and payback. |
| Investment Appraisal and Business Cases | NPV, IRR and payback answer different questions: reading investment measures when they disagree | Internal Rate of Return (Uneven Cash Flows) | applies | Chapter explains IRR, NPV and payback and their conflicts; tool calculates IRR, NPV at a hurdle rate and payback for uneven cash flows. |
| Investment Appraisal and Business Cases | NPV, IRR and payback answer different questions: reading investment measures when they disagree | Return on Investment and NPV | applies | Chapter compares return percentage, payback and NPV; tool calculates ROI, NPV and payback. |
| Investment Appraisal and Business Cases | Sensitivity and scenario analysis: testing a business case before you trust it | Profit What-if Scenario | complements | Chapter covers one-at-a-time sensitivity, tornado charts and scenarios; tool runs a simple profit sensitivity scenario. Simpler than the chapter, so complements. |
| Investment Appraisal and Business Cases | Cost-benefit analysis for business decisions: a practical method with a worked equipment example | Benefit–Cost Ratio | applies | Chapter compares costs and benefits and tests them with NPV and present value; tool calculates present values and the benefit–cost ratio. |
| Lean, Maintenance and Continuous Improvement | Measuring productivity: output per input, labour measures and overall equipment effectiveness | OEE (quick) | applies | Chapter includes an OEE worked example (OEE 12 mentions, availability, performance and quality 10+ each); tool calculates OEE from the three factors. |
| Lean, Maintenance and Continuous Improvement | Measuring productivity: output per input, labour measures and overall equipment effectiveness | OEE and Downtime Analysis | applies | Chapter explains OEE and its losses; tool calculates OEE and its components for a production period. |
| Machine Elements and Mechanical Design | Retaining rings and circlips: choosing types, designing grooves and installing them so they stay put | Retaining Ring Thrust Capacity and Groove Edge Margin | applies | Chapter covers grooves (57 mentions), thrust (9) and load; tool calculates allowable ring thrust and groove edge margin. |
| Machine Elements and Mechanical Design | Pressure vessels and thin-walled cylinders: stresses, design codes, relief valves and inspection | Pressure Cylinder Wall Stress | applies | Chapter explains hoop (14) and longitudinal (11) stress; tool calculates hoop, radial and longitudinal stresses (thin and thick wall). |
| Machine Elements and Mechanical Design | Bolted joints that stay tight: preload, torque, fatigue and locking | Bolted Joint Design Check (Preload, Separation, Proof and Fatigue) | applies | Chapter covers preload (39 mentions), torque and fatigue; tool checks preload, separation, proof and fatigue. |
| Machine Elements and Mechanical Design | Bolted joints that stay tight: preload, torque, fatigue and locking | Bolted Joint Fatigue Check | applies | Chapter explains resisting fatigue (12 mentions) in preloaded joints; tool checks bolt fatigue in a preloaded joint. |
| Machine Elements and Mechanical Design | Power screws and linear motion: leadscrews, ball screws, linear guides and cams | Ball Screw Critical Speed and Buckling | applies | Chapter discusses critical speed (8 mentions), whip and buckling (7) of ball screws; tool calculates critical speed and Euler buckling. |
| Machine Elements and Mechanical Design | Power screws and linear motion: leadscrews, ball screws, linear guides and cams | Ball-Screw Linear Axis Sizing | complements | Chapter sizes leadscrews and ball screws (ball screw 19 mentions, torque 18); tool sizes a ball-screw axis over a move cycle. |
| Machine Elements and Mechanical Design | O-rings and static seals: gland design, materials, gaskets and why seals fail | O-Ring Squeeze, Stretch and Gland Fill | applies | Chapter sizes grooves for squeeze (15 mentions) and fill (9); tool calculates squeeze, stretch and gland fill. |
| Machine Elements and Mechanical Design | Shafts, keys, couplings and alignment: connecting rotating machinery reliably | Flexible Coupling Selection (Torque, Speed, Misalignment, Bore and Key) | applies | Chapter covers choosing couplings (38 mentions) and misalignment (19); tool checks coupling torque, speed, misalignment and bore. |
| Machining and Metal Parts | Press tools and dies: how sheet metal parts are blanked, pierced and formed in volume | Press Tonnage for a Compound or Progressive Die | applies | Chapter covers estimating press force for single, compound and progressive dies (force 28 mentions); tool sums forces for compound or progressive die stages. |
| Machining and Metal Parts | Press tools and dies: how sheet metal parts are blanked, pierced and formed in volume | Punching Operation Plan (Force, Stripping, Punch Stress, Clearance) | applies | Chapter covers punch and die clearance (14 mentions), punching and stripping; tool plans force, stripping, punch stress and clearance. |
| Machining and Metal Parts | Designing parts for casting: walls, draft, cores, shrinkage and working with your foundry | Casting Pattern Plan (Machining Allowance, Shrinkage, Casting and Pour Weight) | applies | Chapter covers machining allowances (5), shrinkage (9) and patterns (8); tool applies machining allowance and shrinkage to a pattern. |
| Machining and Metal Parts | Designing parts for casting: walls, draft, cores, shrinkage and working with your foundry | Pattern Size for Shrinkage and Casting Weight from Pattern | applies | Chapter covers shrinkage and machining allowances; tool calculates pattern size from them. |
| Machining and Metal Parts | Designing parts for casting: walls, draft, cores, shrinkage and working with your foundry | Casting Solidification Time and Riser Check | complements | Chapter explains how solidification shapes design (7 mentions) without Chvorinov’s rule; tool calculates solidification time and riser modulus. Quantifies the chapter, so complements. |
| Machining and Metal Parts | Milling cutters and milling strategies: speeds, feeds, chip thickness and parts that are easy to mill | Milling Cut Planner (Speed, Thinned Feed, Power and Torque) | applies | Chapter explains calculating speed and feed and chip thinning (10 mentions); tool calculates speed, thinned feed, power and torque. |
| Machining and Metal Parts | Milling cutters and milling strategies: speeds, feeds, chip thickness and parts that are easy to mill | Face Milling Power Plan (Teeth, Chip Thickness, kc, Spindle Power) | applies | Chapter covers chip thickness (10 mentions) and feed per tooth (9); tool plans teeth, chip thickness and power for face milling. |
| Machining and Metal Parts | Drilling, reaming and tapping: making holes that are the right size, in the right place | Tapped Hole Design (Drill, Engagement and Depth) | applies | Chapter covers tap drills (8 mentions) and thread engagement (5); tool designs tap drill, engagement and depth for metric threads. |
| Manufacturing Operations and Design for Manufacture | Make or buy: choosing between in-house manufacturing and outsourcing | Make or Buy (quick check) | applies | Chapter frames make-or-buy around volume (15 mentions) and fixed cost; tool compares costs and finds the crossover volume. |
| Manufacturing Operations and Design for Manufacture | Make or buy: choosing between in-house manufacturing and outsourcing | Make or Buy (In-House Cost against a Supplier Price, Break-Even) | applies | Chapter covers volume, utilisation and cost in make-or-buy; tool compares in-house cost with supplier price and break-even. |
| Manufacturing Operations and Design for Manufacture | Demand forecasting for small manufacturers: matching supply with demand without drowning in stock | Reorder Point | applies | Chapter covers reorder points (8 mentions), safety stock (15) and lead time (19); tool calculates the reorder point. |
| Manufacturing Operations and Design for Manufacture | Demand forecasting for small manufacturers: matching supply with demand without drowning in stock | Safety Stock | applies | Chapter covers safety stock (15 mentions) and demand variation; tool estimates safety stock. |
| Manufacturing Operations and Design for Manufacture | Designing sheet metal parts for economical manufacture: bends, holes, flat patterns, fasteners and tolerances | Sheet-Metal Flat Pattern (Up to Four Bends) | applies | Chapter covers flat patterns (10 mentions), bend allowance (12) and K-factor; tool develops flat patterns with bend allowance. |
| Manufacturing Operations and Design for Manufacture | Designing sheet metal parts for economical manufacture: bends, holes, flat patterns, fasteners and tolerances | Bent Bracket Plan (Flat Blank, Bend Force, Springback) | applies | Chapter covers flat patterns and the press brake (bend 86 mentions); tool plans flat blank, bend force and springback. |
| Manufacturing Operations and Design for Manufacture | Designing jigs and fixtures that pay for themselves: locating, clamping, mistake-proofing and the business case | Jig and Fixture Return on Investment | complements | Chapter is about fixtures that pay their way (cost and saving discussed); tool estimates the fixture’s savings and payback. The chapter focuses on design, so complements. |
| Manufacturing Operations and Design for Manufacture | Designing plastic parts for injection moulding: walls, draft, ribs, bosses, gates and tooling | Injection Moulded Part Cost (Clamp, Cycle, Machine, Material, Mould) | complements | Chapter covers cost (17 mentions), cavities (12) and cycle time in moulding design; tool estimates moulded part cost. |
| Manufacturing Quality | Statistical process control on the shop floor: control charts, real signals and when to leave a process alone | X-bar and R Control Chart Limits | applies | Chapter covers setting control limits (9 mentions) and range charts (5); tool calculates X-bar and R limits. |
| Manufacturing Quality | Statistical process control on the shop floor: control charts, real signals and when to leave a process alone | Process Capability Check (σ from R̄, Cp, Cpk, Rejects, Limits) | complements | Chapter discusses capability (18 mentions) and Cpk (6) after control; tool checks capability from an X-bar–R chart. |
| Product Development and Launch | Proving a process is ready for production: measurement, stability, capability and PPAP-style evidence | Process Capability Check (σ from R̄, Cp, Cpk, Rejects, Limits) | applies | Chapter covers control charts and capability indices (capability 28, Cpk 6 mentions); tool calculates Cp, Cpk and rejects. |
| Operational Data, Records and Controls | Timesheet and labour data for job costing: capturing hours accurately so job profits can be trusted | Job Cost Estimate | applies | Chapter covers job costing (10 mentions) with labour and overhead; tool builds a job cost estimate. |
| Operational Data, Records and Controls | Timesheet and labour data for job costing: capturing hours accurately so job profits can be trusted | Labour Quote | applies | Chapter explains calculating loaded labour rates (rate 38, hours 36 mentions); tool applies a loaded rate and margin to a labour quote. |
| Practical Mathematics for Engineering and Manufacturing | Circles, arcs, chords and bolt circles: hole patterns, rolled shells, bends and radius checks | Circular Segment and Arc | applies | Chapter solves chords (21 mentions) and sagitta (11); tool solves segment and radius from chord and height. |
| Practical Mathematics for Engineering and Manufacturing | Circles, arcs, chords and bolt circles: hole patterns, rolled shells, bends and radius checks | Bolt Circle Coordinates | applies | Chapter covers bolt-circle hole coordinates (coordinate 8, pitch circle 4 mentions); tool lists bolt circle coordinates. |
| Practical Mathematics for Engineering and Manufacturing | Areas, volumes and masses for the workshop: estimating material, weight, coatings and lifts | Stock Volume and Mass | applies | Chapter calculates masses (44 mentions) of plates, bars and tubes with densities; tool estimates stock mass from dimensions and density. |
| Practical Mathematics for Engineering and Manufacturing | Simultaneous equations and matrices in practice: blending, product mix, structures and circuits | Simultaneous Equations and 3 × 3 Matrix | applies | Chapter covers simultaneous equations (8 mentions), matrices (7) and determinants (6); tool solves 2 or 3 equations with matrix results. |
| Pricing, Margins and Profitability | Gross margin: the quickest test of pricing power | Margin and Markup | applies | Chapter explains gross margin (34 mentions) and markup (18); tool calculates margin and markup. |
| Pricing, Margins and Profitability | Two breakeven numbers every owner should know: your monthly revenue floor and the rent-or-buy crossover | Break-even and Margin of Safety | applies | Chapter explains fixed costs divided by contribution margin (contribution 14, fixed cost 17 mentions); tool calculates break-even from contribution. |
| Project Delivery, Procurement and Governance | Stage gates that make real decisions: go, hold, recycle or stop | Project Gate Review | applies | Chapter is about gate decisions with clear criteria (gate 98, criteria 15 mentions); tool scores a project at a gate. |
| Reading Financial Statements | Depreciation, capital spending and the weight of heavy assets | Depreciation Schedule | complements | Chapter explains depreciation (28 mentions, straight-line 4) as a sign of capital intensity; tool calculates depreciation schedules. |
| Research and Evidence for Better Decisions | Sampling: who to ask and how many responses you need | Sample Size to Estimate a Mean | applies | Chapter covers margins of error (9), confidence (8) and sample sizes (11); tool calculates sample size for a mean. |
| Risk, Controls and Assurance | What a risk score cannot tell you: averages, rare disasters and different kinds of uncertainty | Risk Rating (5 × 5 matrix) | explains | Chapter examines likelihood × consequence scoring (likelihood 16, consequence 11 mentions) and its limits; tool is a 5 × 5 likelihood × consequence rating. |
| Suppliers, Contractors and Government Work | Not every supplier is a partner: segmenting suppliers for price, reliability or capability | Supplier Comparison | complements | Chapter segments suppliers by price, reliability and capability; tool compares price, lead time, quality and reliability. |
| Valuing Time, Delay and Uncertainty | Putting a dollar value on equipment losses: using OEE to guide capacity and capital decisions | OEE and Downtime Analysis | applies | Chapter values OEE losses (OEE 24 mentions); tool calculates OEE and its losses for a production period. |
| Valuing Time, Delay and Uncertainty | Putting a dollar value on equipment losses: using OEE to guide capacity and capital decisions | Downtime Cost | applies | Chapter values downtime in money using contribution; tool estimates lost contribution, idle labour and restart cost. |
| Valuing Time, Delay and Uncertainty | Models rank options, people decide value: trade-offs, efficient choices and what counts | Two-Option Comparison | complements | Chapter discusses scoring options and seeing trade-offs (option 47, weight 29 mentions); tool compares two options across four criteria. |
| Designing Welded Joints by the Numbers | Butt welds: full and partial penetration | Butt Weld Quantity and Cost Check (Groove Area, Weld Metal, Arc Time, Cost against Quote) | applies | Chapter calculates single-V groove area for 60° and 90° included angles and shows a double-V halving the metal; tool computes the same groove areas plus caps, weld metal and cost. |
| Designing Welded Joints by the Numbers | Weld volume, cost and distortion | Butt Weld Quantity and Cost Check (Groove Area, Weld Metal, Arc Time, Cost against Quote) | complements | Chapter costs fillet weld metal from deposition rate and operator factor; tool uses the same costing for groove (butt) welds, so it extends the chapter rather than repeating it. |
| Pipe Welding by the Numbers | Joint preparation and fit-up | Butt Weld Quantity and Cost Check (Groove Area, Weld Metal, Arc Time, Cost against Quote) | applies | Chapter gives area ≈ (wall − root face)² tan(bevel) + gap × wall + reinforcement for a pipe butt; tool’s single-V formula is identical with included angle = 2 × bevel, plus cost. |
| Power Presses by the Numbers | Hydraulic and servo presses | Hydraulic Press Cycle Check (Regenerative Approach, Pressing Force, Return, Cycle Time, Motor Power) | applies | Chapter sizes a press from F = p A, v = Q ÷ A, power = p Q and works out cycle time with a fast approach; tool performs these steps and checks them against targets. |
| Manufacturing Quality | Measurement system analysis: making sure your gauges can tell good parts from bad | Gauge Repeatability and Bias Check (Type 1 Study: Cg, Cgk, Bias t-Test) | explains | Chapter defines resolution, bias and repeatability and says to check bias by repeatedly measuring a calibrated master; tool evaluates exactly that study (type 1). |
| Machine Elements and Mechanical Design | Selecting bearings and lubrication for reliable machines: types, life, fits, sealing and failure causes | Bearing Fleet Spares Plan (Rating Life, Weibull Failures, Spares for a Service Level) | explains | Chapter explains statistical bearing life and L10 = (C ÷ P)^p; tool uses that L10 with a Weibull slope to estimate failures and spares. |
| Lean, Maintenance and Continuous Improvement | Maintenance that prevents breakdowns: choosing a strategy for each machine in a small factory | Bearing Fleet Spares Plan (Rating Life, Weibull Failures, Spares for a Service Level) | complements | Chapter section “Keep the right spares” discusses balancing spares held; tool calculates the spares needed for a service level from bearing life. |
| Manufacturing Operations and Design for Manufacture | Demand forecasting for small manufacturers: matching supply with demand without drowning in stock | Cutting Insert Consumption and Reorder Plan (Tool Life, Parts per Edge, Monthly Use, Reorder Point) | applies | Chapter gives safety stock = z × standard deviation of daily demand × √lead time and reorder points; tool applies the same formula to insert use derived from Taylor life. |
| Machining and Metal Parts | Cutting tool materials and coatings: choosing carbide grades, inserts and coatings that pay | Cutting Insert Consumption and Reorder Plan (Tool Life, Parts per Edge, Monthly Use, Reorder Point) | complements | Chapter explains Taylor’s tool life equation and choosing tools on cost per part; tool computes insert cost per part and monthly use from Taylor life. |
| Machining and Metal Parts | Workholding and toolholding: vices, chucks, zero-point systems, tapers and holders | Vacuum Table Workholding Check (Holding Force, Milling Force, Sliding Safety Factor) | complements | Chapter lists vacuum fixtures for thin flat parts and says clamping must resist cutting forces; tool checks vacuum hold against milling force. |
| Investment Appraisal and Business Cases | NPV, IRR and payback answer different questions: reading investment measures when they disagree | Machine Economic Life Check (Year-by-Year EUAC, Minimum-Cost Life, Keep or Replace) | complements | Chapter advises converting options of different lives to equivalent annual amounts; tool computes EUAC for each life of a machine and the keep-or-replace test. |
| Investment Appraisal and Business Cases | Before you buy: challenge the need, then judge the whole-life commitment | Machine Economic Life Check (Year-by-Year EUAC, Minimum-Cost Life, Keep or Replace) | complements | Chapter recommends comparing options of different lives by equivalent annual cost with the time value of money; tool computes that cost year by year. |

## 2. Rejected

| READOS book | Chapter | WORKOS tool | Reason |
|---|---|---|---|
| Lean, Maintenance and Continuous Improvement | Small, frequent improvement on the shop floor: gemba walks, point kaizen and keeping 5S alive | Improvement Value | Rejected: the chapter is about observing work and local improvement cycles; it barely discusses savings or annual value (saving mentioned once). |
| Machine Elements and Mechanical Design | Bolted joints that stay tight: preload, torque, fatigue and locking | Bolted Joint at Temperature (Preload Change from Differential Expansion) | Rejected: the chapter does not discuss differential thermal expansion (no mentions of thermal or expansion), which is what the tool calculates. |
| Pricing, Margins and Profitability | Overheads, research and the cost of standing still | True Unit Cost | Rejected: the chapter uses overheads and research spending as a sign of a business’s economics, not unit costing; it does not allocate costs to units. |
| Work Habits That Stick | Planning a work week that fits real capacity | Team Workload | Rejected: the chapter plans one person’s week; the tool compares a team’s planned hours with team capacity. |
| Project Delivery, Procurement and Governance | Letters of intent and early works: starting before the contract without losing control | Drill Sizes: Number, Letter, Fraction and Metric | Rejected: a false word match on “letter”; letter drill sizes have nothing to do with letters of intent. |
| Teams, Incentives and Performance | Team bonus or individual bonus: matching rewards to how the work is really done | True Position with Bonus Tolerance | Rejected: a false word match (“bonus tolerance” in geometric tolerancing against staff bonuses). |
| Research and Evidence for Better Decisions | Describing data: centre, spread and shape before drawing conclusions | CNC Axis Positioning Accuracy and Repeatability | Rejected: shares statistical vocabulary only; the tool evaluates machine-tool positioning runs, not general data description. |
| Cutting and Gouging by the Numbers | Air carbon arc gouging | Butt Weld Quantity and Cost Check (Groove Area, Weld Metal, Arc Time, Cost against Quote) | Rejected: chapter is about removing metal by gouging; the tool calculates weld metal deposited in a groove. |
| Resistance Welding by the Numbers | Butt and flash welding | Butt Weld Quantity and Cost Check (Groove Area, Weld Metal, Arc Time, Cost against Quote) | Rejected: resistance butt and flash welds use no groove or filler metal; the tool prices arc-welded groove joints. |
| Welding Distortion by the Numbers | Transverse shrinkage and closing gaps | Butt Weld Quantity and Cost Check (Groove Area, Weld Metal, Arc Time, Cost against Quote) | Rejected: chapter relates groove size to shrinkage; the tool calculates weld metal and cost, not distortion. |
| Investment Appraisal and Business Cases | Buying for the whole life of equipment: spares, support and supplier dependence | Bearing Fleet Spares Plan (Rating Life, Weibull Failures, Spares for a Service Level) | Rejected: chapter covers spares and supplier support at purchase in general terms; it has no failure-rate method for the tool to apply. |
| Connected Products by the Numbers | Verify with a pilot fleet | Bearing Fleet Spares Plan (Rating Life, Weibull Failures, Spares for a Service Level) | Rejected: a pilot fleet of connected products shares the word fleet only; the tool plans bearing spares. |
| Vacuum by the Numbers | Safety and the vacuum specification | Vacuum Table Workholding Check (Holding Force, Milling Force, Sliding Safety Factor) | Rejected: chapter covers vacuum chamber loads, implosion energy and vacuum lifting; the tool checks sliding of a part on a vacuum table during milling. |
| Process Chillers by the Numbers | Running cost and heat recovery | Machine Economic Life Check (Year-by-Year EUAC, Minimum-Cost Life, Keep or Replace) | Rejected: chapter covers chiller running cost and heat recovery; it does not discuss replacement timing or equivalent annual cost. |
| Machine Part Repairs by the Numbers | Repair or replace | Machine Economic Life Check (Year-by-Year EUAC, Minimum-Cost Life, Keep or Replace) | Rejected: chapter decides repair or replacement of a broken part by expected cost; the tool finds a machine’s economic life by EUAC, a different decision. |

## 3. Published READOS books with no approved connection

Their pages show a WORKOS topic to browse where the category maps to one, and nothing otherwise. Suggestions for them, where any were found, are in section 4.

| READOS book | Kind | Category | Shown instead |
|---|---|---|---|
| 3D CAD Modelling and Design Intent | collection | technology | nothing |
| Accelerated Life Testing by the Numbers | publication | Products | nothing |
| Acquisitions, Groups and Investment Accounting | collection | business | Business & Commercial |
| AI in Business Practice | collection | technology | nothing |
| Architectural Sheet Metal by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Bills of Materials by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Booms, Bubbles and Business Cycles | collection | business | Business & Commercial |
| Branched Fittings by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Brazing and Soldering by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Building Approval for Factory Projects | publication | Projects | Projects & Improvement |
| Business Systems and Operating Rhythm | collection | business | Business & Commercial |
| Business Systems, Security and IT Decisions | collection | technology | nothing |
| Buying Well: Procurement and Tendering | collection | business | Business & Commercial |
| CAD Automation by the Numbers | publication | Engineering | Engineering & Design |
| CAD Automation That Pays | publication | Engineering | Engineering & Design |
| CAD Drafting and Drawing Standards | collection | technology | nothing |
| Careers, Confidence and Personal Effectiveness | collection | business | Business & Commercial |
| Centrifugal Pumps by the Numbers | publication | Engineering | Engineering & Design |
| Checking Drawings by the Numbers | publication | Engineering | Engineering & Design |
| Commercial Law, Contracts and Disputes | collection | business | Business & Commercial |
| Commissioning Custom Software | publication | Projects | Projects & Improvement |
| Communication and Professional Presence | collection | business | Business & Commercial |
| Competitive Strategy and Positioning | collection | business | Business & Commercial |
| Configure, Price, Quote by the Numbers | publication | Products | nothing |
| Contact Temperature Sensors by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Cooling Towers by the Numbers | publication | Operations | Manufacturing & Production |
| Cutting and Gouging by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Database Foundations for Business | collection | technology | nothing |
| Database Performance, Concurrency and Safe Change | collection | technology | nothing |
| Decision-Making Machines | collection | technology | nothing |
| Deep Drawing and Spinning by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Diffusion by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Drawings That Make Parts | publication | Engineering | Engineering & Design |
| Ductwork by the Numbers | publication | Engineering | Engineering & Design |
| Electroplating by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Engineering Design Practice | collection | engineering | Engineering & Design |
| Engineering Tools People Use | publication | Technology | nothing |
| Entropy by the Numbers | publication | Engineering | Engineering & Design |
| Fine Particles by the Numbers | publication | Engineering | Engineering & Design |
| Fins and Heat Sinks by the Numbers | publication | Engineering | Engineering & Design |
| Fits That Work | publication | Engineering | Engineering & Design |
| Fixtures That Repeat | publication | Manufacturing | Manufacturing & Production |
| Forge Welding by the Numbers | publication | Manufacturing | Manufacturing & Production |
| From Approval to Benefits | collection | business | Business & Commercial |
| Gears by the Numbers | publication | Engineering | Engineering & Design |
| Growth, Business Models and New Markets | collection | business | Business & Commercial |
| Hardfacing and Surfacing by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Heat Exchangers by the Numbers | publication | Engineering | Engineering & Design |
| Heat Pumps and Refrigeration by the Numbers | publication | Engineering | Engineering & Design |
| Heating and Cooling Times by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Housings That Rebuild | publication | Engineering | Engineering & Design |
| How Engineering Shaped Industry: From Aqueducts to the Grid | collection | ideas | nothing |
| How Engineering Shaped Industry: Power, Networks and the Modern Era | collection | ideas | nothing |
| Industrial Electric Heating by the Numbers | publication | Engineering | Engineering & Design |
| Industrial Gases by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Infrared Temperature Measurement by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Inspecting to the Drawing | publication | Manufacturing | Manufacturing & Production |
| Judgement, Markets and Learning | collection | ideas | nothing |
| Layouts That Plot to Scale | publication | Engineering | Engineering & Design |
| Leading People and Change | collection | business | Business & Commercial |
| Louvres and Ventilators by the Numbers | publication | Engineering | Engineering & Design |
| Machine Part Repairs by the Numbers | publication | Engineering | Engineering & Design |
| Machining by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Marketing, Brands and Customer Experience | collection | business | Business & Commercial |
| Oval Sheet Metal Work by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Performance Solutions by the Numbers | publication | Engineering | Engineering & Design |
| Pipe Flow by the Numbers | publication | Engineering | Engineering & Design |
| Process Steam by the Numbers | publication | Engineering | Engineering & Design |
| Product Acoustics by the Numbers | publication | Products | nothing |
| Project Estimates, Schedules and Costs | collection | business | Business & Commercial |
| Project Planning and Control | collection | projects | Projects & Improvement |
| Project Sponsors, Governance and Decisions | collection | business | Business & Commercial |
| Quoting Sheet Metal Work by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Railway Clearances by the Numbers | publication | Engineering | Engineering & Design |
| Railway Track Geometry by the Numbers | publication | Engineering | Engineering & Design |
| Random Error and Drift by the Numbers | publication | Engineering | Engineering & Design |
| Real Gases by the Numbers | publication | Engineering | Engineering & Design |
| Records, Business Data and Learning from Results | collection | business | Business & Commercial |
| Rectangular Duct Fittings by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Reporting, History and Analytical Data | collection | technology | nothing |
| Resistance Welding by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Roof Drainage by the Numbers | publication | Engineering | Engineering & Design |
| Roof Lights by the Numbers | publication | Engineering | Engineering & Design |
| Rubber Parts by the Numbers | publication | Engineering | Engineering & Design |
| Selling and Business Development | collection | business | Business & Commercial |
| Setting Up a Welding Shop by the Numbers | publication | Business | Business & Commercial |
| Shape Memory Alloys by the Numbers | publication | Engineering | Engineering & Design |
| Sheet Metal Joints by the Numbers | publication | Engineering | Engineering & Design |
| Software and Cloud Foundations for Business Leaders | collection | technology | nothing |
| Specifications, Product Quality and Sustainability | collection | products | nothing |
| SQL, Queries and Data Correctness | collection | technology | nothing |
| Starting, Funding and Structuring a Business | collection | business | Business & Commercial |
| Sustainability and Environmental Management | collection | business | Business & Commercial |
| Tanks and Hoppers by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Teams, Incentives and Performance | collection | business | Business & Commercial |
| Testing Welded Joints by the Numbers | publication | Manufacturing | Manufacturing & Production |
| The Small Business Operating Handbook | publication | Business | Business & Commercial |
| Thermit Welding by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Transitional Elbows by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Vehicle Mechanics by the Numbers | publication | Engineering | Engineering & Design |
| Weld Repairs That Hold | publication | Manufacturing | Manufacturing & Production |
| Weldability by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Welder Training by the Numbers | publication | Manufacturing | Manufacturing & Production |
| Welding Health and Safety by the Numbers | publication | Operations | Manufacturing & Production |
| Win Work You Can Deliver | publication | Business | Business & Commercial |
| Work Habits That Stick | collection | business | Business & Commercial |

## 4. Suggestions awaiting review (strongest first, top 150)

Metadata matches only; none is published. To approve one, add it to `knowledge-links.json` with `status: "approved"`, `evidence: "review"`, a `note` and a `reason`; to reject, add it with `status: "rejected"`.

| Score | READOS book | Best chapter | WORKOS tool | Matched terms | Flags |
|---|---|---|---|---|---|
| 0.62 | Gears by the Numbers | Tooth bending strength | Gear Tooth Bending Stress (Lewis) | tooth, lewi, bend, velocity, equation |  |
| 0.616 | Machining by the Numbers | Cutting force, power and torque | Turning Cutting Force and Power | cutt, torque, power, force, spindle |  |
| 0.606 | Gears by the Numbers | Helical gears and axial thrust | Helical Gear Pair Geometry | helical, transverse, axial, overlap, gear |  |
| 0.578 | Gears by the Numbers | Ratios, speeds and gear trains | Gear Train Ratio, Speed and Torque | train, gear, ratio, compound, output |  |
| 0.572 | Tanks and Hoppers by the Numbers | Cones, pyramids and frustums | Hopper and Frustum Volume | frustum, pyramid, hopper, cone, estimate |  |
| 0.568 | Gears by the Numbers | Helical gears and axial thrust | Helical Gear Set Design (Geometry, Forces and Bending) | helical, thrust, transverse, axial, gear |  |
| 0.561 | Electroplating by the Numbers | The cell and Faraday's laws | Electroplating Thickness and Time (Faraday) | faraday, plat, current, law, thickness |  |
| 0.56 | Machining by the Numbers | Tool life and the Taylor equation | Taylor Tool Life and Economic Cutting Speed | taylor, life, equation, spe, predict |  |
| 0.558 | Centrifugal Pumps by the Numbers | Head, flow, power and efficiency | Pump Shaft Power | head, efficiency, hydraulic, power, pump |  |
| 0.557 | Gears by the Numbers | Undercut and profile shift | Profile Shift and Working Centre Distance | undercut, shift, profile, distance, centre |  |
| 0.545 | Deep Drawing and Spinning by the Numbers | Metal spinning and shear spinning | Shear Spinning Blank Thickness and Force | spinn, shear, blank, sine, cone |  |
| 0.542 | Deep Drawing and Spinning by the Numbers | Metal spinning and shear spinning | Shear Spun Cone Plan (Blank, Reduction, Roller Force, Power, Time) | spinn, shear, blank, cone, sine |  |
| 0.535 | Fits That Work | Calculate the dimensional bounds | Signed Three-Term Tolerance Stack | asymmetric, bound, sign, tolerance, stack |  |
| 0.535 | Heat Transfer by the Numbers | Heat exchangers | Heat Exchanger Sizing (Duty, Outlet Temperature and Area) | exchanger, stream, counterflow, heat, overall |  |
| 0.532 | Pipe Flow by the Numbers | Friction in straight pipe | Darcy Pipe Pressure Drop | darcy, weisbach, friction, pipe, straight |  |
| 0.527 | Machining by the Numbers | Cutting force, power and torque | Face Milling Power Plan (Teeth, Chip Thickness, kc, Spindle Power) | chip, cutt, spindle, power, torque |  |
| 0.525 | Machining by the Numbers | Cutting force, power and torque | Milling Power and Spindle Torque | torque, spindle, cutt, power, specific |  |
| 0.516 | Designing Welded Joints by the Numbers | Fillet welds: throat, length and capacity | Fillet Weld Joint Design and Cost | throat, fillet, weld, leg, joint |  |
| 0.513 | Plastic Parts by the Numbers | Clamp force, shot size and cycle time | Injection Moulding Clamp, Shot, Cooling and Cycle Estimate | shot, clamp, ejection, cycle, cool |  |
| 0.51 | Heat Transfer by the Numbers | Conduction through walls and layers | Heat Flow Through a Layered Wall | conduction, layer, wall, insulation, through |  |
| 0.501 | Compressed Air Plant by the Numbers | Free air, pressure and mass flow | Gas Volume at Pressure and Temperature | free, air, compress, absolute, pressure |  |
| 0.5 | Arc Welding by the Numbers | Weld metal in fillet welds | Fillet Weld Joint Design and Cost | fillet, weld, throat, metal, leg |  |
| 0.497 | Gears by the Numbers | Module, pitch and gear sizes | Spur Gear Contact Ratio | module, gear, pitch, tooth |  |
| 0.497 | Machining by the Numbers | Milling: feed per tooth, chip thinning and feed rate | Radial Chip-Thinning Feed | thinn, chip, tooth, radial, calculate |  |
| 0.491 | Sheet Metal Parts by the Numbers | Flat patterns and bend deductions | Sheet-Metal Flat Pattern (Up to Four Bends) | deduction, bend, flat, pattern, dimension |  |
| 0.483 | Printed Mechanisms That Run | Index with a Geneva drive | Geneva Drive Design (Acceleration, Pin Force and Drive Torque) | geneva, index, dwell, slot, mechanism |  |
| 0.478 | Machining by the Numbers | Milling: feed per tooth, chip thinning and feed rate | Milling Cut Planner (Speed, Thinned Feed, Power and Torque) | mill, thinn, chip, tooth, removal |  |
| 0.475 | Thermal Expansion by the Numbers | Pipe expansion: anchors, guides and loops | Pipe Run Thermal Expansion Check (Growth, Loop Leg, Anchor Force) | anchor, loop, expansion, pipe, growth |  |
| 0.473 | Thermal Expansion by the Numbers | Shrink and expansion fits | Interference Fit Limits Check (IT Grades, Least and Most Interference, Torque, Stress) | interference, shrink, fit, hub, shaft |  |
| 0.471 | Heat Exchangers by the Numbers | The mean temperature difference | Heat Exchanger LMTD and Area | exchanger, difference, log, mean, temperature |  |
| 0.465 | Designing Welded Joints by the Numbers | Weld groups under eccentric load | Eccentric Bracket Bolt Check (Bolt Group Forces, Shear and Bearing Stress) | eccentric, group, bracket, centroid, moment |  |
| 0.462 | Heat Exchangers by the Numbers | The mean temperature difference | Heat Exchanger Sizing (Duty, Outlet Temperature and Area) | exchanger, counterflow, difference, temperature, approach |  |
| 0.46 | Plastic Parts by the Numbers | Snap fits that assemble and release | Snap-Fit Joint Design (Deflection, Assembly and Retention Forces) | snap, undercut, permissible, strain, fit |  |
| 0.456 | Sheet Metal Joints by the Numbers | How a riveted joint fails | Riveted Lap Joint Efficiency | rivet, tear, joint, shear, fail |  |
| 0.454 | Pipe Flow by the Numbers | Laminar and turbulent flow | Pipe Friction Factor and Pressure Drop | turbulent, laminar, reynold, flow, friction |  |
| 0.452 | Sheet Metal Parts by the Numbers | Flat patterns and bend deductions | Bent Bracket Plan (Flat Blank, Bend Force, Springback) | deduction, bend, flat, pattern, dimension |  |
| 0.449 | Ductwork by the Numbers | Friction in straight duct | Darcy Pipe Pressure Drop | darcy, weisbach, friction, straight, loss |  |
| 0.448 | Compressed Air Plant by the Numbers | The work of compression and specific power | Air Compressor Power | isothermal, compressor, air, compression, compress |  |
| 0.445 | Centrifugal Pumps by the Numbers | Affinity laws and speed control | Pump and Fan Affinity Laws | affinity, law, pump, spe, head |  |
| 0.445 | Vehicle Mechanics by the Numbers | Traction, adhesion and the wet ramp | Ramp Traction Check (Axle Loads on a Slope, Tractive Force Needed, Grip, Tipping) | traction, axle, ramp, grip, slope |  |
| 0.444 | Blanking and Piercing Dies by the Numbers | How a punch and die cut sheet metal | Punching Operation Plan (Force, Stripping, Punch Stress, Clearance) | punch, die, pierc, blank, cut |  |
| 0.442 | Thermal Expansion by the Numbers | Shrink and expansion fits | Interference Fit at Operating Temperature (Different Materials) | interference, shrink, hub, fit, expansion |  |
| 0.442 | Water Hammer by the Numbers | Wave speed in a pipe: water, wall and air | Valve Closure Surge (Water Hammer against Pipe Rating) | wave, pipe, water, modulu, bulk |  |
| 0.441 | Thermal Expansion by the Numbers | Shrink and expansion fits | Press and Shrink Fit Pressure and Holding Torque | interference, shrink, hub, fit, shaft |  |
| 0.44 | Electroplating by the Numbers | The cell and Faraday's laws | Electroplating Plan (Time, Current, Loads and Cost per Part) | faraday, plat, current, law, rack |  |
| 0.431 | Arc Welding by the Numbers | Weld metal in fillet welds | Fillet Weld Cost per Metre | fillet, weld, metal, leg, mass |  |
| 0.431 | Plastic Parts by the Numbers | Snap fits that assemble and release | Cantilever Snap-Fit Design (Plastics) | snap, cantilever, strain, fit, assembly |  |
| 0.43 | Power Presses by the Numbers | Flywheel energy and slowdown | Press Flywheel and Motor Check (Stroke Energy, Rim Mass, Rim Stress, Motor Power) | flywheel, slowdown, energy, press, stroke |  |
| 0.429 | Heat Transfer by the Numbers | Conduction through walls and layers | Furnace Wall Design (Layers, Convection and Radiation from the Surface) | layer, conduction, wall, insulation, through |  |
| 0.428 | Modular Projects by the Numbers | Learning curves: unit and cumulative-average models | Learning-Curve Quote (Batch Hours, Cost and Price per Unit) | cumulative, curve, learn, unit, average |  |
| 0.421 | Heating and Cooling Times by the Numbers | Planning the cycle: time, energy and throughput | Heat-Treatment Furnace Load Plan (Time, Energy, Cost) | furnace, energy, throughput, cycle, heat |  |
| 0.42 | Plate Work by the Numbers | Conical shells in plate | Hopper and Bin Design (Capacity, Wall Angle, Plate Mass) | conical, bin, hopper, plate, shell |  |
| 0.418 | Centrifugal Pumps by the Numbers | NPSH and cavitation | Pump NPSH Available | npsh, cavitation, available, pump, requir |  |
| 0.418 | Designing Welded Joints by the Numbers | Weld groups under eccentric load | Eccentrically Loaded Bolt Group | group, centroid, eccentric, away, bracket |  |
| 0.418 | Thermal Expansion by the Numbers | Liquids in closed systems | Expansion Vessel Sizing (Liquid Expansion, Pre-Charge and Final Pressure, Vessel Volume) | vessel, diaphragm, liquid, clos, expansion |  |
| 0.417 | Pipe Flow by the Numbers | Friction in straight pipe | Compressed Air Pipe Pressure Drop | darcy, colebrook, weisbach, pipe, friction |  |
| 0.417 | Plastic Parts by the Numbers | Clamp force, shot size and cycle time | Injection Moulded Part Cost (Clamp, Cycle, Machine, Material, Mould) | shot, clamp, cycle, force, cool |  |
| 0.416 | Testing Welded Joints by the Numbers | Hardness and the heat-affected zone | Vickers and Knoop Hardness from Indentation | hardness, vicker, indentation, traverse, calculate |  |
| 0.412 | Sheet Metal Parts by the Numbers | Flat patterns and bend deductions | Sheet-Metal Bracket: Flat Blank, Nesting, Bending Force and Cost | deduction, bend, flat, dimension, outside |  |
| 0.411 | Practical Mathematics for Engineering and Manufacturing | Circles, arcs, chords and bolt circles: hole patterns, rolled shells, bends and radius checks | Circle Through Three Points | circle, radiu, arc, bolt, coordinate |  |
| 0.411 | Setting Up a Welding Shop by the Numbers | Equipment: what to buy first | Buy or Lease | lease, equipment, buy, cost, compare |  |
| 0.409 | The Small Business Operating Handbook | Calculate break-even and choose sustainable prices | Break-even and Margin of Safety | even, break, contribution, calculate, cover |  |
| 0.404 | Plate Work by the Numbers | Rolling plate: flat ends, springback and templates | Rolled Plate Plan (Roll-To Radius for Springback, Blank Length, Radius Inspection) | springback, roll, radiu, plate, spr |  |
| 0.4 | Compressed Air Plant by the Numbers | Receivers and compressor control | Air Receiver Size | receiver, compressor, air, peak, size |  |
| 0.4 | Deep Drawing and Spinning by the Numbers | Drawing force and press capacity | Deep Drawing Plan (Blank, Draws, Forces and Press) | holder, press, draw, force, blank |  |
| 0.4 | Sheet Metal Joints by the Numbers | How a riveted joint fails | Riveted Joint Design (Balanced Pitch and Rivet Count) | rivet, joint, tear, shear |  |
| 0.399 | Centrifugal Pumps by the Numbers | Head, flow, power and efficiency | Hydraulic Motor Torque, Speed and Power | hydraulic, motor, efficiency, power, flow |  |
| 0.397 | Brazing and Soldering by the Numbers | What brazing and soldering are | Brazed Sleeve Joint Plan (Overlap, Joint and Tube Capacity, Clearance, Filler) | braz, solder, filler, joint, fill |  |
| 0.396 | Configure, Price, Quote by the Numbers | Price from cost and rules | Price from Target Margin | markup, margin, price, target, cost |  |
| 0.395 | Brazing and Soldering by the Numbers | What brazing and soldering are | Lap Joint Overlap (Brazed, Soldered or Bonded) | braz, solder, bond, joint |  |
| 0.394 | Centrifugal Pumps by the Numbers | NPSH and cavitation | Pump Suction Line Check (Friction Loss, NPSH Available, Lowest Liquid Level) | npsh, cavitation, available, foot, pump |  |
| 0.394 | Stiffening Sheet Metal by the Numbers | Deflection and stress of a flat panel | Tank Wall Panel under Liquid Pressure (Force, Plate Stress, Deflection) | panel, deflection, rectangular, stress, flat |  |
| 0.393 | Heat Transfer by the Numbers | Radiation from hot surfaces | Hot Surface Insulation Check (Bare Loss, Insulated Loss, Touch Temperature, Payback) | radiation, radiant, surface, hot, convection |  |
| 0.391 | Blanking and Piercing Dies by the Numbers | Die types and the centre of load | Press Tonnage for a Compound or Progressive Die | progressive, die, compound, load |  |
| 0.391 | Fits That Work | Make measurement and acceptance agree | Guard-Banded Acceptance Decision (Uncertainty Budget, Accept, Reject or Indeterminate) | acceptance, uncertainty, guard, band, measurement |  |
| 0.389 | Brazing and Soldering by the Numbers | Joint design and strength | Riveted Lap Joint Efficiency | lap, joint, butt, strength, shear |  |
| 0.389 | Tanks and Hoppers by the Numbers | Cones, pyramids and frustums | Prismoidal Formula Volume | pyramid, frustum, hopper, cone, end |  |
| 0.388 | Deep Drawing and Spinning by the Numbers | Draw ratios, reductions and redraws | Deep Drawing Reduction Sequence | redraw, reduction, draw, ratio, plan |  |
| 0.388 | Vehicle Mechanics by the Numbers | Mass, centre of gravity and axle loads | Forklift Load Centre Check (Load Centre of Gravity, Derated Capacity, Side Offset) | axle, gravity, centre, mass, load |  |
| 0.387 | Pneumatics by the Numbers | Understand air, pressure and the job | Gas Volume at Pressure and Temperature | air, compress, absolute, pressure, free |  |
| 0.385 | Centrifugal Pumps by the Numbers | Head, flow, power and efficiency | Hydraulic Power and Pump Input | hydraulic, efficiency, power, pump, flow |  |
| 0.381 | Entropy by the Numbers | Compression and expansion | Air Compressor Power | isothermal, intercool, compression, air, compress |  |
| 0.381 | Pipe Flow by the Numbers | The system curve | Pump Operating Point on the System Curve | curve, system, pump, head, operat |  |
| 0.381 | Stiffening Sheet Metal by the Numbers | Deflection and stress of a flat panel | Circular Cover Plate Design (Thickness for Stress and Deflection) | deflection, flat, stress, clamp, govern |  |
| 0.381 | Welding Health and Safety by the Numbers | Extraction and ventilation | Extraction Duct Check (Total Airflow, Duct Velocity, Friction Loss, Fan Pressure) | extraction, ventilation, airflow, hood, exhaust |  |
| 0.378 | Process Chillers by the Numbers | Compressor work and discharge temperature | Air Compressor Staging Check (Power and Discharge Temperature) | discharge, compressor, temperature, compression, ideal |  |
| 0.376 | Brazing and Soldering by the Numbers | Clearance and thermal expansion | Differential Thermal Expansion | clearance, expansion, thermal, temperature, fit |  |
| 0.375 | Deep Drawing and Spinning by the Numbers | Drawing force and press capacity | Deep Drawing and Ironing Punch Force | press, punch, draw, force, capacity |  |
| 0.375 | Entropy by the Numbers | Compression and expansion | Gas Compression and Expansion Process | compression, isothermal, expansion, compress, air |  |
| 0.375 | Fine Particles by the Numbers | Ducts, transport velocity and deposition | Extraction Duct Check (Total Airflow, Duct Velocity, Friction Loss, Fan Pressure) | duct, transport, velocity, dust, settle |  |
| 0.375 | Thermal Expansion by the Numbers | Shrink and expansion fits | Differential Thermal Expansion | expansion, fit, shrink, clearance, loosen |  |
| 0.373 | Vibrating Machine Elements by the Numbers | Twist: torsional modes of the fan drive | Drive Shaft Torsional Check (Natural Frequency, Resonance Margins, Stress, Twist) | torsional, twist, drive, inertia, shaft |  |
| 0.371 | Heat Exchangers by the Numbers | Velocity, pressure drop and pumping | Nozzle Manifold Check (Flow per Nozzle, Total Flow, Feed Pipe Loss, Supply Pressure) | pump, velocity, drop, pressure, loss |  |
| 0.369 | Quoting Sheet Metal Work by the Numbers | Rates, margin and GST | Margin and Markup | markup, margin, price, cost |  |
| 0.368 | Configure, Price, Quote by the Numbers | Price from cost and rules | Margin and Markup | markup, margin, price, cost, product |  |
| 0.368 | Weld Repairs That Hold | Heat, expansion and shrinkage | Restrained Thermal Stress | expansion, restrain, thermal, stress, heat |  |
| 0.366 | Demand and Benefit Forecasts by the Numbers | Scenarios, sensitivity and switching values | Profit What-if Scenario | scenario, sensitivity, volume, run, against |  |
| 0.366 | Designing Welded Joints by the Numbers | Fillet welds: throat, length and capacity | Intermittent Fillet Weld Plan (Continuous Leg, Segment Count and Pitch, Cost Saving) | fillet, throat, weld, leg, length |  |
| 0.362 | Stiffening Sheet Metal by the Numbers | Deflection and stress of a flat panel | Circular Flat Plate under Pressure | deflection, flat, clamp, stress, edge |  |
| 0.361 | Brazing and Soldering by the Numbers | Joint design and strength | Riveted Joint Design (Balanced Pitch and Rivet Count) | lap, joint, butt, strength, shear |  |
| 0.36 | Testing Welded Joints by the Numbers | Hardness and the heat-affected zone | Vickers Hardness Test Check (Hardness, Validity, Specification) | hardness, vicker, indentation, result, heat |  |
| 0.359 | Drafting Geometry by the Numbers | Polygons, ellipses and inclined views | Polygon Milling Set-up (Stock Size, Depth of Cut, Indexing) | polygon, regular, across, corner, flat |  |
| 0.359 | Heat Exchangers by the Numbers | Velocity, pressure drop and pumping | Darcy Pipe Pressure Drop | drop, loss, velocity, pressure, friction |  |
| 0.359 | Vibrating Machine Elements by the Numbers | Keep running belt spans out of resonance | Belt Drive Tensions and Shaft Load | belt, slack, tight, side, drive |  |
| 0.358 | Ductwork by the Numbers | Friction in straight duct | Extraction Duct Check (Total Airflow, Duct Velocity, Friction Loss, Fan Pressure) | duct, friction, reynold, loss, factor |  |
| 0.356 | Industrial Electric Heating by the Numbers | Joule heating, power and energy | Heating Energy and Time | heater, energy, oven, heat, power |  |
| 0.354 | Arc Welding by the Numbers | Weld metal in fillet welds | Intermittent Fillet Weld Plan (Continuous Leg, Segment Count and Pitch, Cost Saving) | fillet, weld, leg, throat, gap |  |
| 0.352 | Fits That Work | Carry the stack through temperature | Differential Thermal Expansion | differential, temperature, expansion, uniform, thermal |  |
| 0.351 | Real Gases by the Numbers | Real gas in pipes and nozzles | Nozzle Manifold Check (Flow per Nozzle, Total Flow, Feed Pipe Loss, Supply Pressure) | nozzle, pipe, flow, velocity, drop |  |
| 0.35 | Real Gases by the Numbers | Real gas in pipes and nozzles | Compressed-Air Blow-Off Consumption (Nozzles, Air, Power and Cost) | nozzle, chok, pipe, flow, velocity |  |
| 0.35 | Tanks and Hoppers by the Numbers | Hopper walls and transitions by triangulation | Hopper and Bin Design (Capacity, Wall Angle, Plate Mass) | hopper, wall, slant, round |  |
| 0.348 | Plate Work by the Numbers | The plate list, mass and lifting | Plate Lift Plan (Shape Area, Mass, Centre of Gravity, Two-Point Lift Loads) | lift, plate, gravity, mass, evenly |  |
| 0.347 | Machine Elements and Mechanical Design | Power screws and linear motion: leadscrews, ball screws, linear guides and cams | Lead Screw Travel Speed | screw, linear, ball, power, choose |  |
| 0.347 | Designing Welded Joints by the Numbers | Fillet welds: throat, length and capacity | Torque Tube and End Weld Check (Shear, Twist, Weld Throat Stress) | throat, fillet, weld, leg, carry |  |
| 0.347 | Heat Transfer by the Numbers | Heat, temperature and energy | Heating Energy and Time | energy, heat, temperature, warm, power |  |
| 0.347 | Pipe Flow by the Numbers | The system curve | Two-Pump Arrangement Check (Parallel or Series Operating Point, Flow Gain, Each Pump’s Duty) | curve, pump, operat, head, system |  |
| 0.346 | Weld Repairs That Hold | Preheat, hydrogen and cooling | Carbon Equivalent and Weldability | weldability, preheat, carbon, hydrogen, equivalent |  |
| 0.345 | Deep Drawing and Spinning by the Numbers | Blank size from surface area | Drawn Shell Blank Diameter and Draws | blank, drawn, flange, size |  |
| 0.344 | Sheet Metal Production Runs by the Numbers | Nesting the blanks and material yield | Sheet-Metal Bracket: Flat Blank, Nesting, Bending Force and Cost | nest, blank, sheet, yield, material |  |
| 0.343 | Pneumatics by the Numbers | Set speed, timing and cushioning | Cylinder Cushion Check (Kinetic Energy, Deceleration, Cushion Pressure, Largest Speed) | cushion, kinetic, mov, spe, energy |  |
| 0.342 | Arc Welding by the Numbers | Weld metal in fillet welds | Torque Tube and End Weld Check (Shear, Twist, Weld Throat Stress) | fillet, weld, throat, leg, frame |  |
| 0.341 | Fits That Work | Carry the stack through temperature | Differential Thermal Fit | differential, temperature, uniform, thermal, expansion |  |
| 0.341 | Heat Exchangers by the Numbers | Velocity, pressure drop and pumping | Hydraulic Line Sizing (Velocity, Pressure Drop and Tube Rating) | velocity, drop, tube, pressure, return |  |
| 0.341 | Pneumatics by the Numbers | Size the cylinder for force and side load | Pneumatic Cylinder Sizing, Air Use and Running Cost | cylinder, retract, pneumatic, load, force |  |
| 0.34 | Pipe Flow by the Numbers | Fittings, valves and equipment | Valve Flow Coefficient (Kv and Cv) | valve, drop, coefficient, flow |  |
| 0.339 | Vibrating Machine Elements by the Numbers | Keep running belt spans out of resonance | Flat Belt Drive Design (Wrap, Tensions and Belt Width) | belt, tight, slack, side, drive |  |
| 0.338 | Configure, Price, Quote by the Numbers | Price from cost and rules | Manufacturing Quote Builder | overhead, margin, labour, target, price |  |
| 0.338 | Vibrating Machine Elements by the Numbers | Keep running belt spans out of resonance | Crossed Flat Belt Drive Check (Length, Wrap, Tensions, Speed) | belt, slack, tight, side, cross |  |
| 0.337 | Machine Elements and Mechanical Design | Bolted joints that stay tight: preload, torque, fatigue and locking | Turn-of-Nut Preload and Bolt Fatigue Check | preload, fatigue, bolt, joint |  |
| 0.337 | Setting Up a Welding Shop by the Numbers | Fume extraction and ventilation | Extraction Duct Check (Total Airflow, Duct Velocity, Friction Loss, Fan Pressure) | extraction, ventilation, airflow, hood, fume |  |
| 0.336 | Ductwork by the Numbers | Fans, system curves and the fan laws | Fan Duty, Fan Laws and Belt Drive | fan, law, motor, system, drive |  |
| 0.336 | Heat Pumps and Refrigeration by the Numbers | Compressors and recovered heat | Air Compressor Power | compressor, intercool, compress, air, power |  |
| 0.335 | Weld Repairs That Hold | Preheat, hydrogen and cooling | Weld Preheat and Cooling Time Check (CE, Heat Input, t8/5) | preheat, cool, carbon, hydrogen, equivalent |  |
| 0.334 | Sheet Metal Parts by the Numbers | Press brake force and punching force | Punching Operation Plan (Force, Stripping, Punch Stress, Clearance) | punch, force, punche, press, perimeter |  |
| 0.33 | Quoting Sheet Metal Work by the Numbers | Material, blanks and nesting | Sheet-Metal Bracket: Flat Blank, Nesting, Bending Force and Cost | nest, blank, sheet, batch, yield |  |
| 0.329 | Machine Elements and Mechanical Design | Bolted joints that stay tight: preload, torque, fatigue and locking | Bolt Tightening Torque and Preload | preload, bolt, torque, joint, clamp |  |
| 0.329 | Prototypes and Simulation by the Numbers | Measured performance: sample sizes for means and comparisons | Two-Sample Comparison (t-test) | sample, comparison, mean, supplier, test |  |
| 0.328 | Arc Welding by the Numbers | Weld metal in fillet welds | Weldment Cost Estimate (Weld Metal, Arc Time, Labour, Filler and Gas by Run) | fillet, weld, metal, leg, frame |  |
| 0.328 | Sheet Metal Parts by the Numbers | Springback and overbending | Tube Bending Plan (Length, Wall Thinning, Strain and Overbend) | overbend, springback, radiu, thickness, angle |  |
| 0.326 | Machine Part Repairs by the Numbers | Keyways, threads and splines | Parallel Key Shear and Crushing | key, crush, keyway, shear, stress |  |
| 0.326 | Vehicle Mechanics by the Numbers | Tipping stability, load height and the rules that come from the numbers | Machine Tipping Stability (Overturning, Safety Factor, Anchors) | tipp, stability, acceleration, height, tip |  |
| 0.324 | Heat Pumps and Refrigeration by the Numbers | Compressors and recovered heat | Air Compressor Staging Check (Power and Discharge Temperature) | compressor, intercool, stag, ideal, air |  |
| 0.324 | Oval Sheet Metal Work by the Numbers | Area and capacity of oval vessels | Oval Tank Capacity and Weight (Elliptical Section, Shell Plate, Full Mass) | oval, capacity, area, fill, level |  |
| 0.323 | Valuing Time, Delay and Uncertainty | Putting a dollar value on equipment losses: using OEE to guide capacity and capital decisions | OEE (quick) | oee, equipment, loss, quality |  |
| 0.323 | Vehicle Mechanics by the Numbers | Gearing, wheel torque and the motor curve | Gear Ratio for Inertia Matching (Optimum Ratio and Motor Torque) | motor, torque, gear, ratio, top |  |
| 0.321 | Water Hammer by the Numbers | The Joukowsky surge: velocity change into head | Water Supply Line Check (Velocity, Friction Loss, Outlet Pressure, Valve Surge) | surge, velocity, closure, fitt, pressure |  |
| 0.32 | Pricing, Margins and Profitability | Gross margin: the quickest test of pricing power | Price from Target Margin | gross, margin, pric |  |
| 0.32 | Design Simulation by the Numbers | Read stress results without fooling yourself | Triaxial Stress Check (Principal Stresses, von Mises, Tresca, Strains) | tresca, principal, von, mise, stress |  |
| 0.32 | Electroplating by the Numbers | Current density, burning and the rectifier | Anodizing Plan (Time, Current, Tank Heat, Loads and Cost per Part) | rectifier, bath, current, tank, part |  |
| 0.32 | Vibrating Machine Elements by the Numbers | Keep running belt spans out of resonance | V-Belt Drive Motor Load Check (Belts, Driven Speed, Shaft Load on the Motor) | belt, slack, tight, side, drive |  |
