import type { Workflow } from '../types.ts';

// Bill of materials to production: Products and Engineering (released bill of materials), Manufacturing (routing,
// planning, order, shop floor, close), Procurement (requisitions from MRP) and Inventory (materials and finished
// goods). Labels from apps/work/src/client/system/erp/Products.tsx, Changes.tsx, Manufacturing.tsx and ShopFloor.tsx.
const workflow: Workflow = {
  id: 'bom-to-production',
  title: 'Bill of materials to production',
  status: 'live',
  summary:
    'From a product’s design to finished goods in stock: the bill of materials and routing are released, MRP plans what to make and buy, a manufacturing order is released, materials are issued, the work is recorded on the shop floor, and finished goods are received at actual cost.',
  stages: [
    { guide: 'products', label: 'Bill of materials', detail: 'The product’s revision with its components is released through a change order and locked.' },
    { guide: 'manufacturing', label: 'Work centres and routing', detail: 'Work centres carry hours and rates; the routing’s operations are released by an engineering approver who did not draft them.' },
    { guide: 'manufacturing', label: 'Planning', detail: 'Demand in the master production schedule and confirmed sales orders feed MRP, which suggests what to make, buy and expedite.' },
    { guide: 'procurement', label: 'Bought components', detail: 'Buy suggestions become requisitions, approved and bought as usual.' },
    { guide: 'manufacturing', label: 'Manufacturing order', detail: 'The order is drafted, released with its materials reserved, and run operation by operation on the shop floor.' },
    { guide: 'inventory', label: 'Materials and finished goods', detail: 'Materials leave stock when issued; finished goods enter stock at the order’s actual cost.' },
  ],
  tutorial: {
    id: 'bom-to-production-walkthrough',
    title: 'Take a product from its bill of materials to finished goods',
    outcome: 'Finished goods are in stock at actual cost, and the closed order shows its estimated and actual cost by element.',
    needs: 'Engineers and engineering approvers release the bill of materials and routing; a production manager plans and runs the order; production operators record work; warehouse staff issue materials and receive finished goods.',
    steps: [
      {
        title: 'Release the bill of materials',
        body: 'In Products and Engineering, build the product’s draft revision on its Bill of materials tab with Add a line. Choose Change order, then Submit for approval; an engineering approver who did not draft it chooses Approve and Release.',
        where: 'Bill of materials',
      },
      {
        title: 'Set up work centres',
        body: 'In Manufacturing, Work centres, choose New work centre with its working days, hours, efficiency and rates, and add its machines.',
        where: 'New work centre',
      },
      {
        title: 'Release the routing',
        body: 'In Routings choose New routing for the product, Start the draft, and Add an operation for each step with its work centre, times and crew. An engineering approver who did not draft it chooses Release.',
        where: 'New routing',
      },
      {
        title: 'Plan with MRP',
        body: 'On the Planning tab set the product’s planning data, choose Add demand for anything not on a sales order, then Run MRP. Choose Make draft order for make suggestions and Raise requisition for buy suggestions.',
        where: 'Run MRP',
      },
      {
        title: 'Buy what is short',
        body: 'Requisitions from MRP arrive in Procurement as submitted. A procurement manager approves them and a buyer orders the components; the warehouse receives them into stock.',
        where: 'Requisitions',
      },
      {
        title: 'Release the manufacturing order',
        body: 'Open the draft order (or choose New order), check its materials and operations, then choose Release with Reserve the materials now, as far as stock allows. Shortages are shown.',
        where: 'Release',
      },
      {
        title: 'Issue the materials',
        body: 'Choose Issue materials for each material, from where it is held. Reserved stock is taken first.',
        where: 'Issue materials',
      },
      {
        title: 'Run the operations on the shop floor',
        body: 'On the Shop floor tab, operators choose their work centre, Start each job, record Good output, Scrap or Downtime, record the Inspection where there is one, and choose Complete.',
        where: 'Shop floor',
      },
      {
        title: 'Receive the finished goods',
        body: 'Choose Receive finished goods with the quantity, location, lots and serial numbers. They enter stock at the order’s actual cost.',
        where: 'Receive finished goods',
      },
      {
        title: 'Complete and close the order',
        body: 'Choose Complete once every operation is completed, then Close and finalise costs. The Costs section shows estimated against actual cost by element, with the variances.',
        where: 'Close and finalise costs',
      },
    ],
    after: 'The production output, material consumption, labour utilisation and production variance reports on the Reports page include the order.',
  },
  faqs: [
    {
      q: 'Why can I not draft a manufacturing order for my product?',
      a: 'The product needs both a released bill of materials and a released routing. A draft revision, or a draft routing, is not enough (see /learn/manufacturing/).',
    },
    {
      q: 'Which bill of materials does an order use?',
      a: 'The released revisions when the order is drafted; a draft order follows the released revisions each time it is saved. Once released, the order keeps them: a later engineering change does not change it.',
    },
    {
      q: 'What if materials are short when I release?',
      a: 'The order is released anyway, with what stock allows reserved and the shortages shown. Buy or make what is short, then issue it as it arrives.',
    },
    {
      q: 'Is the cost of production posted to Finance?',
      a: 'No. Materials, work in progress and finished goods are valued in the ERP. Each posting is recorded as planned on the order, and nothing is posted to Finance’s ledger.',
    },
  ],
  keywords: ['BOM to production', 'make to stock', 'production order', 'work order', 'manufacturing process', 'MRP run', 'shop floor', 'finished goods'],
  sources: [
    'apps/work/src/client/system/erp/Products.tsx',
    'apps/work/src/client/system/erp/Changes.tsx',
    'apps/work/src/client/system/erp/Manufacturing.tsx',
    'apps/work/src/client/system/erp/ShopFloor.tsx',
    'apps/work/src/worker/erp/access.ts',
    'apps/work/src/worker/erp/production.ts',
    'apps/work/src/worker/erp/planning.ts',
    'docs/erp/release-1.md',
    'docs/erp/release-3.md',
  ],
  updated: '2026-11-20',
};

export default workflow;
