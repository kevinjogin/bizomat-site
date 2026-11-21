import type { Guide } from '../types.ts';

// Product Management, with Engineering's Design (engineering changes and documents) (ERP Release 1, with Release 2's stock in the bill of materials), and its
// sales and margin analysis and stock against sales (20 Nov 2026). Labels are the client's own words:
// apps/work/src/client/system/erp/Products.tsx, Analysis.tsx, Changes.tsx, Documents.tsx; rules from
// apps/work/src/worker/erp/access.ts, analysis.ts, changes.ts, engineering.ts and documents.ts.
const guide: Guide = {
  id: 'products',
  section: 'modules',
  title: 'Product Management',
  short: 'Products',
  status: 'live',
  what:
    'Product Management is the company’s product master: every product, part and material, with its variants, revisions and bills of materials; their engineering changes and documents are in Engineering, under Design. A released revision is locked, so a change always goes through a change order. Its Analysis section shows what was sold, what it cost and the margin, by product, customer and more, and stock against sales.',
  purpose: [
    'Keep one numbered record for each product, part, material and service.',
    'Build multi-level bills of materials and see the material cost of one.',
    'Control changes with change requests, change orders and locked released revisions.',
    'Keep drawings, models and specifications with every version.',
    'See where a component is used, and compare two revisions.',
    'Record who supplies each product, at what price and lead time.',
    'Analyse sales, cost and margin by product, category, family, customer, salesperson, warehouse and month, against last year or the period before, and drill into any row.',
    'See stock against sales: days of cover, what is at its reorder point and what is not moving.',
  ],
  who: [
    'Engineers, who add products and draft bills of materials and changes.',
    'Engineering approvers, who review change requests and approve and release change orders.',
    'Buyers and procurement managers, who record a product’s suppliers.',
    'Production and warehouse staff, who read the released bill of materials.',
    'Executives and viewers, who read everything without changing it.',
    'Sales managers, executives and anyone who reads reports, who use the sales and margin analysis.',
  ],
  access: {
    path: ['BIZOMAT ERP', 'Product Management'],
    href: 'https://bizomat.ai/erp/products',
    label: 'Open Product Management',
    note: 'The module rail opens it in the company you used last; its side menu lists Products and, under Analysis, Sales and margin analysis and Stock against sales. Engineering changes, documents and CAD Automation are in Engineering, under Design and CAD Automation.',
  },
  tutorials: [
    {
      id: 'add-a-product',
      title: 'Add a product and its bill of materials',
      outcome: 'You have a numbered product with revision A as a draft and the parts and materials that go into it.',
      needs: 'Engineer, engineering approver or ERP administrator.',
      steps: [
        {
          title: 'Open Product Management',
          body: 'Choose Product Management in the module rail. Products lists the company’s products with search, filters and a CSV export, and counts above the list show products without a released revision and change orders waiting.',
          where: 'Products',
        },
        {
          title: 'Choose New product',
          body: 'Type the name. Leave Product number blank to get the next number. Choose the Type (raw material, component, manufactured part, assembly, subassembly, finished product, purchased item, consumable or service), then the category, unit of measure, costs, price, material, weight and dimensions, lifecycle and effective dates as you have them.',
          where: 'New product',
        },
        {
          title: 'Choose Add the product',
          body: 'The product opens on its Overview. A message confirms it was added with revision A as a draft. Components must exist as products before you can put them in a bill of materials, so add those first.',
          where: 'Add the product',
        },
        {
          title: 'Open the Bill of materials tab',
          body: 'The Structure view shows the draft revision. It can be changed while the revision is a draft.',
          where: 'Bill of materials',
        },
        {
          title: 'Choose Add a line',
          body: 'Pick the component, then the quantity per one, unit, scrap allowance (%), reference designator, position, alternative group, effective dates and notes. Tick Optional if the line is left out of the cost roll-up. Choose Save the line. A line that would make a loop (a component that contains this product, at any depth) is refused.',
          where: 'Add a line',
        },
        {
          title: 'Check All levels and Cost roll-up',
          body: 'All levels explodes every level with extended quantities, scrap included. Give a Build quantity to see what is required, what is available in stock and any shortage, and export it as CSV. Cost roll-up shows the material cost of one and lists components with no cost or in another currency: they are left out, never guessed or converted.',
          where: 'All levels',
        },
        {
          title: 'Add images and attachments',
          body: 'On the Overview tab, choose Add images or documents. Files are checked as every upload is.',
          where: 'Add images or documents',
        },
      ],
      after:
        'Revision A stays a draft until a change order releases it. Routings and manufacturing orders use only a released bill of materials.',
    },
    {
      id: 'release-a-revision',
      title: 'Release a revision through a change order',
      outcome: 'The product has a released, locked revision that routings, manufacturing orders and reports can use.',
      needs: 'An engineer or engineering approver drafts and submits the change order. An engineering approver who did not draft it approves and releases it.',
      steps: [
        {
          title: 'Choose Change order on the product',
          body: 'The button shows when the product has an open draft revision that is not yet in a change order.',
          where: 'Change order',
        },
        {
          title: 'Draft the change order',
          body: 'Give a Title (required), a reason and a description. The product is listed under Products it changes; add more products if the change covers them. Choose Draft the change order.',
          where: 'Draft the change order',
        },
        {
          title: 'Check the revisions',
          body: 'The change order lists each product’s revision under Revisions in this change order. While the order is a draft you can still change those revisions’ lines from each product’s Bill of materials tab, and compare a revision with the one it replaces.',
          where: 'Revisions in this change order',
        },
        {
          title: 'Choose Submit for approval',
          body: 'The revisions lock. An engineering approver can return the order to draft with a reason, which unlocks them.',
          where: 'Submit for approval',
        },
        {
          title: 'Approve the change order',
          body: 'An engineering approver who did not draft it opens it from Engineering changes (Engineering, under Design) and chooses Approve, with an optional note.',
          where: 'Approve',
        },
        {
          title: 'Choose Release',
          body: 'The confirmation lists the revisions that become released and locked. Each product’s earlier released revision becomes superseded. A release cannot be undone; a later change needs a new change order.',
          where: 'Release',
        },
      ],
      after:
        'The product now shows Released revision A. Its released bill of materials is what manufacturing orders, MRP and the where-used lists read.',
    },
    {
      id: 'add-a-variant',
      title: 'Make a variant of a product',
      outcome: 'A variant exists as a product of its own, linked to the product it varies.',
      needs: 'Engineer, engineering approver or ERP administrator.',
      steps: [
        {
          title: 'Open the product',
          body: 'Open the product the variant is based on. A variant cannot have variants of its own, so the button shows only on a product that is not itself a variant.',
        },
        {
          title: 'Choose New variant',
          body: 'Fill in what sets it apart: Size, Model, Configuration, Material, Finish or Options (at least one). Give it a Name and SKU if you want.',
          where: 'New variant',
        },
        {
          title: 'Choose Add the variant',
          body: 'The variant gets its own number, revisions and bill of materials. It shows under Variants on the base product’s Overview, and its own page says what it is a variant of.',
          where: 'Add the variant',
        },
      ],
    },
    {
      id: 'add-a-document',
      title: 'Add an engineering document',
      outcome: 'The product has a numbered document with its versions, approved by an engineering approver.',
      needs: 'Engineer, engineering approver or ERP administrator to add; engineering approver or ERP administrator to approve.',
      steps: [
        {
          title: 'Choose New document',
          body: 'In Engineering, open Documents under Design and choose New document, or choose Add a document on a product’s Documents tab.',
          where: 'New document',
        },
        {
          title: 'Describe the document',
          body: 'Choose the product, then give a Title (required), the Kind (Drawing, 3D model, PDF, DXF, STEP, Specification, Image or Other), the Product revision it belongs to (or Any revision), a Document revision and a Note.',
        },
        {
          title: 'Upload a file or reference a CAD file',
          body: 'Choose Upload a file, or Reference a CAD file on my computer and give the Path on your computer, the Configuration and the File name. A reference records where the SOLIDWORKS file is; the file itself stays on your computer and is not stored by BIZOMAT.',
          where: 'Reference a CAD file on my computer',
        },
        {
          title: 'Choose Add the document',
          body: 'The document gets a number and starts as a draft. DXF and STEP files are accepted only when their content is really in that format, and they are always downloaded, never opened in the browser.',
          where: 'Add the document',
        },
        {
          title: 'Approve the version',
          body: 'An engineering approver chooses Approve version and its number. Adding a New version sends it back to draft. Mark obsolete keeps it on record with every version, but it takes no new versions.',
          where: 'Approve version',
        },
      ],
    },
    {
      id: 'add-product-suppliers',
      title: 'Record who supplies a product',
      outcome: 'The product lists its suppliers with their part numbers, prices, lead times and one preferred supplier.',
      needs: 'Buyer, procurement manager, engineer, engineering approver or ERP administrator.',
      steps: [
        {
          title: 'Open the Suppliers tab of the product',
          body: 'Open the product and choose its Suppliers tab.',
          where: 'Suppliers',
        },
        {
          title: 'Choose Add a supplier',
          body: 'Choose the supplier (a blocked supplier cannot be added), then Their part number, Price, Currency, Lead time (days) and Minimum order quantity. Tick Preferred supplier for this product if it is the one you usually buy from. Choose Add.',
          where: 'Add a supplier',
        },
        {
          title: 'See how it is used',
          body: 'For bought items, MRP takes the product supplier’s lead time (the preferred supplier’s, else the shortest), its minimum order when the product’s planning data gives none, and its price for the requisition it raises. The supplier’s own page lists the products it supplies.',
        },
      ],
    },
    {
      id: 'analyse-sales',
      title: 'Analyse sales and margin',
      outcome: 'You see what was sold, what it cost and the margin, against the same period last year, and the rows behind any figure.',
      needs: 'Anyone in the company who can see reports: every ERP role, viewers included.',
      steps: [
        {
          title: 'Open Sales and margin analysis',
          body: 'In Product Management, choose Sales and margin analysis under Analysis in the side menu. It opens on the last 12 months, compared with the same period last year, by product.',
          where: 'Sales and margin analysis',
        },
        {
          title: 'Choose the Period and Compare with',
          body: 'Period offers Last 12 months, this or last month, quarter, financial year (from 1 July) and calendar year, or Dates of my choice. Compare with offers Same period last year, Previous period (as long, just before) or No comparison. The dates used are shown under the bar.',
          where: 'Period',
        },
        {
          title: 'Read the four figures',
          body: 'Sales before tax, Cost of goods dispatched, Margin and Margin % head the page, each with its change against the comparison period. Sales are the goods dispatched to customers, at each sales order line’s value before tax; the cost is what the dispatch took out of stock.',
          where: 'Sales before tax',
        },
        {
          title: 'Look at By month',
          body: 'The columns are this period’s sales by month and the line is the comparison period’s. Point at a month, or move to it with the Tab key, to see its sales, margin and the month it is compared with. Show as a table lists the same figures.',
          where: 'By month',
        },
        {
          title: 'Choose what to analyse by',
          body: 'Under the chart, choose Product, Category, Family, Customer, Salesperson, Warehouse or Month. Sort by puts the rows in order of sales, margin, margin %, cost or quantity. Each row shows its share of the largest row, and the comparison period’s sales and the change when there is a comparison.',
          where: 'Customer',
        },
        {
          title: 'Click a row to drill down',
          body: 'Click a row’s name to see it by the next dimension: a product by its customers, a customer by its products, a month by its products. The trail above the figures, starting at All sales, shows each step; click a step to go back, or its cross to remove it.',
          where: 'All sales',
        },
        {
          title: 'Save the view or export it',
          body: 'Save view keeps the period, the comparison, the dimension, the drill-down and the sort under a name; tick Share it with everyone in the company who can see reports to share it. Saved view brings it back. Export CSV downloads the rows you see, with the total.',
          where: 'Save view',
        },
      ],
      after: 'Nothing in the analysis changes a record. A named period moves with the date, so a saved view of Last month always shows last month.',
    },
    {
      id: 'stock-against-sales',
      title: 'See stock against sales',
      outcome: 'You know which products to reorder, which are slow and which are not moving.',
      needs: 'Anyone in the company who can see reports.',
      steps: [
        {
          title: 'Open Stock against sales',
          body: 'In Product Management, choose Stock against sales under Analysis. Each product in stock, or dispatched in the time chosen, shows its on hand, reserved and available quantities, its stock value and its reorder point.',
          where: 'Stock against sales',
        },
        {
          title: 'Choose Sales over',
          body: 'Choose the last 30, 90, 180 or 365 days. Dispatched is what left for customers in that time, and Days of cover is the stock available now over the average dispatched per day.',
          where: 'Sales over',
        },
        {
          title: 'Show one group',
          body: 'Choose To reorder (at or below the reorder point), Slow (more than 180 days of cover), Not moving (in stock with nothing dispatched) or Moving. Export CSV downloads every product with its status.',
          where: 'To reorder',
        },
      ],
      after: 'Stock in quarantine is left out of available. Reorder points are set on each product’s stock settings in Warehouse.',
    },
  ],
  buttons: [
    { label: 'New product', does: 'Opens the form for a new product.', when: 'For every new product, part, material or service.', after: 'The product is numbered and starts with revision A as a draft.' },
    { label: 'Edit', does: 'Changes the product’s master fields.', when: 'When a description, cost, price or physical detail changes.', after: 'The change is in the product’s History, with the values before and after.' },
    { label: 'New variant', does: 'Makes a variant: a product of its own with the attributes that set it apart.', when: 'For a size, model, configuration, material, finish or option of an existing product.' },
    { label: 'New revision', does: 'Starts the next revision as a draft, with the lines of the released revision.', when: 'When the product has no open revision and you want to prepare a change.', after: 'Release it through a change order.' },
    { label: 'Request a change', does: 'Raises a change request for this product: what should change and why.', when: 'When you want a change reviewed before anyone drafts it.', after: 'An engineering approver reviews it.' },
    { label: 'Change order', does: 'Drafts a change order carrying the product’s open draft revision.', when: 'When a draft revision is ready to go through approval and release.' },
    { label: 'Add a line', does: 'Adds a component to the draft revision’s bill of materials.', when: 'While the revision is a draft, or in a change order that is still a draft.' },
    { label: 'Submit for approval', does: 'Sends a change order to an engineering approver and locks its revisions.', when: 'When every revision in it is ready.' },
    { label: 'Approve', does: 'Approves a submitted change order, or decides a change request.', when: 'Engineering approvers only, never on a change order they drafted.' },
    { label: 'Release', does: 'Releases every revision in an approved change order and supersedes the ones they replace, in one step.', when: 'After approval.', after: 'The revisions are locked. This cannot be undone.' },
    { label: 'Archive', does: 'Takes a product out of the list and the pickers; its revisions, documents and history stay. Restore brings it back.', when: 'When a product is no longer used. Refused while it is in a bill of materials in use.' },
    { label: 'Export CSV', does: 'Downloads the list or view you are looking at, with its filters.', when: 'To work with the data in a spreadsheet.' },
    { label: 'Compare with', does: 'Sets the period the analysis is compared with: the same dates last year, the period just before, or none.', when: 'To see growth or decline against last year or last period.' },
    { label: 'Save view', does: 'Keeps the analysis as it is (period, comparison, dimension, drill-down, sort) under a name, for you or shared in the company.', when: 'For an analysis you come back to, such as margin by customer this financial year.', after: 'It is listed under Saved view. Only the person who saved it can change it; an ERP administrator can delete a shared one.' },
    { label: 'Show as a table', does: 'Lists the months of the chart with their sales, margin and the comparison period’s sales.', when: 'To read exact figures, or with a screen reader.' },
  ],
  faqs: [
    {
      q: 'Why can I not see New product or Add a line?',
      a: 'Changing products needs the Engineer or Engineering approver ERP role (or ERP administrator). Other members of a registered company are viewers until an ERP administrator gives them roles in Administration, ERP roles (see /learn/roles-and-permissions/).',
    },
    {
      q: 'Why can I not change the bill of materials?',
      a: 'A bill of materials belongs to a revision. It can change only while the revision is a draft, or in a change order that is still a draft. Released and superseded revisions are locked, and so is a revision whose change order has been submitted. Start a new revision through a change order to change a released product.',
    },
    {
      q: 'Why can I not approve or release my own change order?',
      a: 'Nobody approves or releases a change order they drafted (segregation of duties): another engineering approver must. In a company of one person (your own company, the example company or a registered company with one member) you may, and the exception is recorded on the change order and in its history.',
    },
    {
      q: 'Why is the cost roll-up incomplete?',
      a: 'It counts each line at its component’s rolled-up cost, else its standard cost. Components with no cost recorded, and costs in another currency, are listed and left out: nothing is guessed or converted. Optional lines, and alternatives after the first of their group, are not counted.',
    },
    {
      q: 'Is my SOLIDWORKS file stored on BIZOMAT?',
      a: 'No. A CAD reference records the path, configuration and file name of a file on your own computer. Uploaded files (drawings, PDFs, DXF, STEP and others) are stored; referenced CAD files are not. CAD Automation works with the file on your computer (see /learn/cad-automation/).',
    },
    {
      q: 'Why can I not archive a product?',
      a: 'A product used in a bill of materials that is in use cannot be archived. Remove it from those bills of materials through a change order first.',
    },
    {
      q: 'It says I do not have access to products and engineering. Why?',
      a: 'People who only share a tool with a company do not see its ERP modules; only its members do. If the message says products and design are switched off for this company, a platform administrator has turned the module off, and BIZOMAT support can help (see /learn/trouble-access/).',
    },
    {
      q: 'How do I export products or a bill of materials?',
      a: 'Lists and the All levels and Where used views have Export CSV. The Reports page in the module rail has the product catalogue, product lifecycle, bill of materials cost, where used, revisions and changes, and supplier list reports, each with a CSV (see /learn/reports/).',
    },
    {
      q: 'Where do the sales analysis figures come from?',
      a: 'From goods dispatched to customers in Warehouse (Orders and dispatch): each shipment line’s quantity at its sales order line’s value before tax, and the cost that left stock for it in the stock ledger. Returns are not deducted (the returns report has them), and freight and invoices made in Finance without a sales order are not included. The figures match the sales report in Reports for the same dates.',
    },
    {
      q: 'Why does margin leave out some sales?',
      a: 'A dispatch that took nothing out of stock, such as a service or a product not kept in stock, has no cost. Margin and margin % are worked out on the sales that have a cost, and the page says how much had none. A row marked with an asterisk has some sales without a cost.',
    },
    {
      q: 'Why can I not see Sales and margin analysis?',
      a: 'It needs a role that can see reports (every ERP role, viewers included) in a company you are a member of. If it says the analysis or Products is switched off for this company, a platform administrator has turned it off, and BIZOMAT support can help (see /learn/trouble-access/).',
    },
  ],
  related: ['manufacturing', 'procurement', 'inventory', 'quality', 'cad-automation', 'reports', 'roles-and-permissions'],
  chain: ['products', 'manufacturing', 'inventory', 'supply-chain'],
  workflows: ['engineering-change', 'bom-to-production', 'make-to-order', 'cad-to-product'],
  notYet: [
    { text: 'Reading an assembly open in SOLIDWORKS into a proposed bill of materials for a draft revision (CAD Automation inside the ERP).', status: 'in-development' },
    { text: 'Saving CAD Automation exports as engineering documents on a product revision.', status: 'in-development' },
    { text: 'Drawings generated from an ERP product.', status: 'planned' },
    { text: 'Labour and machine cost from routings in a product’s cost roll-up (the roll-up is material cost today).', status: 'planned' },
    { text: 'One product catalogue shared by the CRM and the product master (the CRM keeps its own products for deals).', status: 'planned' },
    { text: 'Budgets and forecasts beside actual sales in the analysis.', status: 'planned' },
    { text: 'Saved views sent by email on a schedule, and alerts when a figure crosses a limit.', status: 'planned' },
  ],
  keywords: [
    'product master', 'item master', 'part number', 'SKU', 'BOM', 'bill of materials', 'multi-level BOM', 'BOM explosion',
    'where used', 'ECR', 'ECO', 'engineering change request', 'engineering change order', 'revision control', 'PLM',
    'variant', 'drawing', 'STEP', 'DXF', 'CAD reference', 'cost roll-up', 'lifecycle',
    'sales analysis', 'margin analysis', 'gross margin', 'drill down', 'business intelligence', 'sales by customer',
    'year on year', 'days of cover', 'slow moving stock', 'saved view',
  ],
  sources: [
    'apps/work/src/client/system/erp/Products.tsx',
    'apps/work/src/client/system/erp/Analysis.tsx',
    'apps/work/src/client/system/erp/Changes.tsx',
    'apps/work/src/client/system/erp/Documents.tsx',
    'apps/work/src/client/system/erp/api.ts',
    'apps/work/src/client/system/SystemApp.tsx',
    'apps/work/src/client/components/layout/SuiteRail.tsx',
    'apps/work/src/worker/erp/access.ts',
    'apps/work/src/worker/erp/analysis.ts',
    'apps/work/src/worker/erp/changes.ts',
    'apps/work/src/worker/erp/engineering.ts',
    'apps/work/src/worker/erp/documents.ts',
    'apps/work/src/worker/platform/flags.ts',
    'apps/work/src/worker/platform/module-gate.ts',
    'docs/erp/release-1.md',
    'docs/erp/STATUS.md',
    'src/data/erp-capabilities.ts',
  ],
  updated: '2026-11-20',
};

export default guide;
