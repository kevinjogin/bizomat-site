import type { Guide } from '../types.ts';

// Manufacturing (ERP Release 3, with Release 5's make to order and job profitability). Labels are the client's own
// words: apps/work/src/client/system/erp/Manufacturing.tsx, ShopFloor.tsx and ErpSettings.tsx; rules from
// apps/work/src/worker/erp/access.ts, manufacturing.ts, production.ts and planning.ts.
const guide: Guide = {
  id: 'manufacturing',
  section: 'modules',
  title: 'Manufacturing',
  status: 'live',
  what:
    'Manufacturing is where the company plans and makes its products: work centres and machines, routings, manufacturing orders from release to close, a shop-floor screen for phones, and planning with the master production schedule, MRP and rough-cut capacity.',
  purpose: [
    'Describe where work is done: work centres, machines, hours and cost rates.',
    'Describe how each product is made: routings with their operations.',
    'Run manufacturing orders: release, issue materials, record the work and receive finished goods.',
    'Record labour, machine time, output, scrap, rework and downtime on the shop floor.',
    'Plan what to make and buy with MRP, and check the load on each work centre.',
    'Compare estimated and actual cost by element when an order closes.',
  ],
  who: [
    'Production managers, who plan, release, complete and close orders and run MRP.',
    'Production operators, who run operations and record their time and output.',
    'Engineers and engineering approvers, who draft and release routings.',
    'Warehouse staff, who issue materials and receive finished goods.',
    'Buyers and procurement managers, who turn MRP’s buy suggestions into requisitions.',
    'Executives and viewers, who read orders, plans and costs.',
  ],
  access: {
    path: ['BIZOMAT ERP', 'Operations', 'Manufacturing'],
    href: 'https://bizomat.ai/erp/manufacturing',
    label: 'Open Manufacturing',
    note: 'On Operations, the Manufacturing card has Open Manufacturing; the company’s side menu lists Manufacturing too. Its tabs are Orders, Shop floor, Planning, Work centres and Routings.',
  },
  tutorials: [
    {
      id: 'set-up-work-centres-and-routings',
      title: 'Set up a work centre and a routing',
      outcome: 'A work centre with its hours and rates, and a released routing that says how a product is made.',
      needs: 'Engineers, engineering approvers, production managers and ERP administrators set up work centres and draft routings. An engineering approver (or ERP administrator) who did not draft the routing releases it.',
      steps: [
        {
          title: 'Choose New work centre',
          body: 'On the Work centres tab choose New work centre. Give the Code, Name, Working days, Hours a day, Efficiency (%), Machines or stations in parallel and Status, then the Labour rate per hour, Machine rate per hour and the Overhead (per labour hour, or a percentage). Choose Save.',
          where: 'New work centre',
        },
        {
          title: 'Add its machines',
          body: 'Open the work centre and choose Add a machine. A machine can have its own rate and be linked to its Maintenance asset; it then shows as down while that asset has an open breakdown or emergency repair work order.',
          where: 'Add a machine',
        },
        {
          title: 'Choose New routing',
          body: 'On the Routings tab choose New routing, choose the product (it needs a released bill of materials), and choose Start the draft.',
          where: 'New routing',
        },
        {
          title: 'Add the operations',
          body: 'Choose Add an operation. Give its Name, Work centre, Machine, Set-up (minutes), Run time per unit (minutes) and Crew (people). Under Waits for operations name the ones before it (empty: the one numbered before it), and tick May overlap them if it can start once they have started. Tick Inspection point and say What to check, or Outsourced to a supplier with the Supplier, Estimated cost per unit and Supplier’s days. Choose Save.',
          where: 'Add an operation',
        },
        {
          title: 'Release the routing',
          body: 'An engineering approver who did not draft it chooses Release. The routing released before it becomes superseded. To change a released routing, choose Copy to a new draft.',
          where: 'Release',
        },
      ],
      after: 'A product with a released bill of materials and a released routing can be made on a manufacturing order.',
    },
    {
      id: 'draft-and-release-an-order',
      title: 'Draft and release a manufacturing order',
      outcome: 'A released order with its materials reserved as far as stock allows and its operations scheduled.',
      needs: 'Production manager or ERP administrator.',
      steps: [
        {
          title: 'Choose New order',
          body: 'On the Orders tab choose New order. Only products with a released bill of materials and a released routing are offered.',
          where: 'New order',
        },
        {
          title: 'Fill in the order',
          body: 'Give the Quantity, Required by and Start (empty: worked out from the lead time), then the Priority, Method, Production type, Customer or job reference, where Finished goods go to, the Assigned people and Notes. Choose Draft the order.',
          where: 'Draft the order',
        },
        {
          title: 'Check the draft',
          body: 'The order lists its Materials (the required quantity includes each line’s scrap allowance), its Operations scheduled from the start date, and its Costs estimated by element. A draft follows the released revisions when it is saved.',
          where: 'Materials',
        },
        {
          title: 'Choose Release',
          body: 'The release window shows any shortage. Tick Reserve the materials now, as far as stock allows, and choose Release. The operations are scheduled again from today.',
          where: 'Release',
        },
        {
          title: 'Amend or cancel if needed',
          body: 'Amend changes a released order’s quantity, dates, priority, reference, notes, location or people, with a reason; the version before is kept. Cancel stops a draft, or a released order with nothing recorded on it.',
          where: 'Amend',
        },
      ],
    },
    {
      id: 'run-the-shop-floor',
      title: 'Issue materials and record the work',
      outcome: 'The materials are issued, and each operation has its time, output, scrap, downtime and inspection result recorded.',
      needs: 'Production and warehouse staff issue materials. Production managers and operators record work.',
      steps: [
        {
          title: 'Choose Issue materials',
          body: 'On the order choose Issue materials, then the Material, where it is taken From, the lot when tracked, and the Quantity. Stock reserved for this order is taken first, and two people cannot both take the last unit. Return unused gives back what was not used, at the cost it was issued at.',
          where: 'Issue materials',
        },
        {
          title: 'Open Shop floor',
          body: 'On a phone or a terminal at the machine, open the Shop floor tab and choose your work centre. It shows In progress and Ready to start jobs, machines that are down, output today, planned against done this week, inspections and material shortages. It refreshes every 30 seconds.',
          where: 'Shop floor',
        },
        {
          title: 'Choose Start',
          body: 'Start begins the operation and your timer. An operation waits for the ones before it, unless it may overlap them. Use Start my timer and Stop my timer when you join or leave a running job.',
          where: 'Start',
        },
        {
          title: 'Report what you make',
          body: 'Choose Good output, Scrap or Downtime and give the quantity or minutes; scrap and downtime need a reason. On the order’s page, Report also records Rework, and Time records your own labour or the machine’s time in minutes, ticked Rework where it was rework.',
          where: 'Good output',
        },
        {
          title: 'Record the inspection',
          body: 'An operation with an inspection point needs Inspection, Pass or Fail (a fail needs a note), before it can complete. A quality inspector can choose Full inspection on the order to inspect it in Quality.',
          where: 'Inspection',
        },
        {
          title: 'Pause or complete the operation',
          body: 'Pause stops the running timers; Resume carries on. Complete finishes the operation once its inspection is recorded.',
          where: 'Complete',
        },
      ],
    },
    {
      id: 'finish-an-order',
      title: 'Receive finished goods, complete and close',
      outcome: 'The finished goods are in stock at actual cost, and the closed order shows its final costs and variances.',
      needs: 'Production or warehouse staff receive finished goods. A production manager or ERP administrator completes and closes the order.',
      steps: [
        {
          title: 'Choose Receive finished goods',
          body: 'Give the Quantity, where it goes Into, and the lot and serial numbers (one per unit) when tracked, then choose Receive. You can receive in parts. The goods are valued at the order’s actual cost, and no more can be received than the last operations reported good.',
          where: 'Receive finished goods',
        },
        {
          title: 'Choose Complete',
          body: 'When every operation is completed and no timer is running, choose Complete. Open reservations for the order are released.',
          where: 'Complete',
        },
        {
          title: 'Choose Close and finalise costs',
          body: 'Confirm with Close the order. The actual cost of each element is written beside its estimate with the variance, and nothing more can be recorded on the order.',
          where: 'Close and finalise costs',
        },
        {
          title: 'Read the costs',
          body: 'The Costs section compares estimated and actual cost for materials, labour, machine, outsourcing, overheads, scrap and rework, with the cost per good unit, and exports CSV. An order made for a sales order line also shows its job profitability: the line’s value before tax against the order’s actual cost.',
          where: 'Costs',
        },
      ],
      after: 'Link to Finance on the order lists the postings it would need, each recorded as planned: production value is not posted to Finance’s ledger.',
    },
    {
      id: 'plan-with-mrp',
      title: 'Plan with the schedule and MRP',
      outcome: 'MRP has suggested what to make, buy and expedite, and the suggestions you accept are draft orders and requisitions.',
      needs: 'A production manager adds demand, runs MRP and makes draft orders. Production managers, buyers and procurement managers raise requisitions from buy suggestions.',
      steps: [
        {
          title: 'Set each product’s planning data',
          body: 'On the Planning tab, under A product’s planning data, choose a product and set whether it is made or bought, its lead times, safety stock, minimum order and order multiple. Choose Save. Reorder points stay in Inventory.',
          where: 'A product’s planning data',
        },
        {
          title: 'Choose Add demand',
          body: 'In Master production schedule choose Add demand: the Product, Quantity, Due (the date), Kind (Confirmed or Forecast) and a Reference. Confirmed sales orders count as demand already, so add only what is not on a sales order.',
          where: 'Add demand',
        },
        {
          title: 'Choose Run MRP',
          body: 'Tick Include forecasts if they should count, then choose Run MRP. It plans level by level through the released bills of materials, from demand, stock less reservations, open orders, lead times, safety stock and reorder points. Each run is kept with its inputs.',
          where: 'Run MRP',
        },
        {
          title: 'Act on the suggestions',
          body: 'Each suggestion shows its quantity, when it is needed, when to order or start, its messages (Late, Overdue or Expedite) and why. Choose Make draft order or Raise requisition, or Dismiss. Show the netting per product explains each figure.',
          where: 'Make draft order',
        },
        {
          title: 'Check capacity',
          body: 'Capacity shows the hours planned on each work centre each week against the hours it has, and flags overloads. Export CSV downloads it.',
          where: 'Capacity',
        },
      ],
      after: 'Draft orders are released as usual; requisitions go through the usual approval in Procurement.',
    },
  ],
  buttons: [
    { label: 'New order', does: 'Drafts a manufacturing order for a product with a released bill of materials and routing.', when: 'To make a product for stock or for a job.' },
    { label: 'Release', does: 'Releases a draft order: shows shortages, reserves materials and schedules the operations from today. On a routing, releases the draft revision.', when: 'When the order is ready to start.' },
    { label: 'Issue materials', does: 'Takes materials out of stock for the order, reserved stock first.', when: 'Before or during the work.', after: 'Return unused gives back what was not used.' },
    { label: 'Start', does: 'Starts an operation (on the shop floor, with your timer).', when: 'When work begins. The operations before it must be completed, or started where overlap is allowed.' },
    { label: 'Good output', does: 'Records good units made at an operation. Scrap, Rework and Downtime record the rest, with a reason.', when: 'As work is done.' },
    { label: 'Complete', does: 'Completes an operation, or the whole order once every operation is completed.', when: 'When the work is finished.' },
    { label: 'Receive finished goods', does: 'Puts finished goods into stock at the order’s actual cost.', when: 'When the last operations have reported good output.' },
    { label: 'Amend', does: 'Changes a released order with a reason, keeping the version before.', when: 'When the quantity, dates or people change.' },
    { label: 'Close and finalise costs', does: 'Makes the costs final and records the variances.', when: 'After the order is completed.', after: 'Nothing more can be recorded on it.' },
    { label: 'Run MRP', does: 'Plans what to make, buy and expedite.', when: 'After demand, stock or orders change.', after: 'A new run dismisses the earlier runs’ open suggestions.' },
    { label: 'Copy to a new draft', does: 'Starts the next routing revision from an existing one.', when: 'To change a released routing.' },
    { label: 'Export CSV', does: 'Downloads orders, costs, MRP results, capacity or work centres.', when: 'To work with the figures in a spreadsheet.' },
  ],
  faqs: [
    {
      q: 'Why is my product not offered on New order?',
      a: 'A product can be made only when it has a released bill of materials (in Products and Engineering, released through a change order) and a released routing (in Manufacturing, Routings). The New order window says so when no product qualifies (see /learn/products/).',
    },
    {
      q: 'Why can I not release my routing?',
      a: 'Routings are released by an engineering approver or ERP administrator who did not draft them (segregation of duties). Production managers can draft routings but not release them. In a company of one person the release is allowed and recorded as an exception.',
    },
    {
      q: 'Why can I not start an operation?',
      a: 'It waits for the operations before it to be completed, or started where it may overlap them. Until then the Start button is greyed out, and its hint reads Waiting for the operations before it.',
    },
    {
      q: 'Why can I not receive more finished goods?',
      a: 'No more can be received than the last operations reported good, and never more than the order’s quantity plus the over-completion tolerance, which is 0% unless an ERP administrator changes it in Purchasing, inventory and manufacturing settings. A new tolerance applies to orders drafted or amended after it is set.',
    },
    {
      q: 'Why can I not complete the operation?',
      a: 'An operation with an inspection point needs its pass or fail recorded first. An order completes only when every operation is completed and no timer is running.',
    },
    {
      q: 'Can I change the bill of materials or routing of a released order?',
      a: 'No. An order keeps the revisions it was released with. Cancel it if nothing has been recorded on it and draft a new one, or finish it.',
    },
    {
      q: 'Does MRP make orders by itself?',
      a: 'No. MRP only suggests. A person turns each suggestion into a draft manufacturing order or a requisition, which then go through their usual release and approval.',
    },
    {
      q: 'Why does a machine show as down?',
      a: 'Its linked Maintenance asset has an open breakdown or emergency repair work order. It shows as available again when that work order is no longer open (see /learn/maintenance/).',
    },
    {
      q: 'Is production cost posted to Finance’s ledger?',
      a: 'No. Work in progress and finished goods are valued in the ERP. Each posting is recorded as planned on the order, and nothing is posted to Finance.',
    },
    {
      q: 'Does the schedule take capacity into account?',
      a: 'Scheduling is forward and does not limit itself to capacity. Capacity on the Planning tab shows each work centre’s load by week, with overloads flagged, so a planner can move work.',
    },
  ],
  related: ['products', 'inventory', 'procurement', 'quality', 'supply-chain', 'maintenance', 'reports'],
  chain: ['products', 'manufacturing', 'inventory', 'supply-chain'],
  workflows: ['bom-to-production', 'make-to-order', 'production-to-quality', 'engineering-change'],
  notYet: [
    { text: 'Posting production value (work in progress, finished goods, variances) to Finance’s ledger (each posting is recorded as planned; nothing is posted).', status: 'planned' },
    { text: 'Finite scheduling and a drag-and-drop planning board.', status: 'planned' },
    { text: 'Work in progress held as stock in work-in-progress locations.', status: 'planned' },
    { text: 'Connections to machines and an OEE measure (machine time is recorded by hand or by timer).', status: 'planned' },
    { text: 'Process (formula and batch) manufacturing and rate-based repetitive schedules.', status: 'planned' },
    { text: 'The approved drawings of the released revision on manufacturing orders and the shop floor (CAD Automation inside the ERP).', status: 'in-development' },
  ],
  keywords: [
    'production', 'MO', 'manufacturing order', 'work order', 'production order', 'job', 'routing', 'operation',
    'work centre', 'work center', 'machine', 'shop floor', 'MES', 'labour', 'timer', 'scrap', 'rework', 'downtime',
    'MRP', 'MPS', 'master production schedule', 'capacity', 'job costing', 'variance', 'finished goods',
  ],
  sources: [
    'apps/work/src/client/system/erp/Manufacturing.tsx',
    'apps/work/src/client/system/erp/ShopFloor.tsx',
    'apps/work/src/client/system/erp/ErpSettings.tsx',
    'apps/work/src/client/system/erp/api.ts',
    'apps/work/src/client/system/SystemApp.tsx',
    'apps/work/src/worker/erp/access.ts',
    'apps/work/src/worker/erp/manufacturing.ts',
    'apps/work/src/worker/erp/production.ts',
    'apps/work/src/worker/erp/planning.ts',
    'apps/work/src/worker/platform/flags.ts',
    'docs/erp/release-3.md',
    'docs/erp/release-5-supply-chain.md',
    'docs/erp/STATUS.md',
    'src/data/erp-capabilities.ts',
  ],
  updated: '2026-11-20',
};

export default guide;
