import type { Workflow } from '../types.ts';

const workflow: Workflow = {
  id: 'cad-to-product',
  title: 'From a CAD model to a product record',
  status: 'in-development',
  summary: 'Bring a design made in SOLIDWORKS with CAD Automation into a product\'s record in Products and Engineering. Saving exports straight to a product revision, reading a bill of materials from an open assembly and asking for a review task in Projects are built but not switched on yet. Today you export the file through CAD Automation and upload it to the product as an engineering document.',
  stages: [
    {
      guide: 'cad-automation',
      label: 'Design and export',
      detail: 'Your AI assistant builds or changes the part, assembly or drawing in SOLIDWORKS on your computer, and exports it as PDF, DWG, DXF, STEP or another format. The download link works for one hour.',
    },
    {
      guide: 'products',
      label: 'Engineering document',
      detail: 'You upload the exported file to the product (and, if you choose, one of its revisions) as an engineering document, or record a CAD reference to the SOLIDWORKS file on your computer. An engineering approver approves it. Saving an export straight from CAD Automation is in development.',
    },
    {
      guide: 'products',
      label: 'Bill of materials and release',
      detail: 'You add the bill of materials lines on a draft revision, then approve and release the revision through a change order. Reading the lines from the open SOLIDWORKS assembly is in development.',
    },
    {
      guide: 'projects',
      label: 'Review task',
      detail: 'Asking for a review of an engineering document as a task on a Projects and Tasks board is in development. Until it is switched on, add the review task to a board yourself.',
    },
  ],
  tutorial: {
    id: 'cad-to-product-today',
    title: 'Put a CAD export on a product today',
    outcome: 'The product in Products and Engineering has the drawing or model as an approved engineering document, with its versions and history.',
    needs: 'CAD Automation set up on your computer. To add documents: Engineer, Engineering approver or ERP administrator. To approve them: Engineering approver or ERP administrator.',
    steps: [
      {
        title: 'Build or open the design',
        body: 'Ask your AI assistant to make or change the part or assembly in SOLIDWORKS, and to save it (see /learn/cad-automation/).',
      },
      {
        title: 'Make the drawing, if you need one',
        body: 'Ask, for example, "Create an A3 drawing of the open part with the standard views, an isometric and the model dimensions." The drawing is saved next to the model.',
      },
      {
        title: 'Export the file',
        body: 'Ask, for example, "Export the drawing as PDF" or "Export the open part as a STEP file." Download it from the link the assistant gives you within one hour.',
      },
      {
        title: 'Open the product in BIZOMAT ERP',
        body: 'Open Products and Engineering, open the product and choose its Documents tab.',
        where: 'Documents',
      },
      {
        title: 'Add the document',
        body: 'Choose Add a document. Keep Upload a file and choose the exported file: PDF, images and office files are accepted, and DXF and STEP files when their content checks out (up to 25 MB). Type the Title, choose the Kind (for example Drawing, PDF, DXF or STEP), the Product revision, and a Document revision such as A. Choose Add the document.',
        where: 'Add the document',
      },
      {
        title: 'Or record where the SOLIDWORKS file is',
        body: 'Choose Reference a CAD file on my computer instead, and type the Path on your computer, the Configuration and the File name. The SOLIDWORKS file stays on your computer; the record keeps where it is.',
        where: 'Reference a CAD file on my computer',
      },
      {
        title: 'Approve it',
        body: 'An engineering approver opens the document and chooses Approve version 1. When the design changes, export again and choose New version: the document is a draft again until it is approved.',
        where: 'Approve version',
      },
      {
        title: 'Update the bill of materials',
        body: 'On a draft revision, open the Bill of materials tab and choose Add a line for each component. Release the revision through a change order, which an engineering approver who did not draft it approves and releases (see /learn/products/).',
        where: 'Add a line',
      },
    ],
    after: 'Released revisions and approved documents are what Procurement, Manufacturing and Quality use. Ask for a review by adding a task to a Projects and Tasks board yourself until review tasks from documents are switched on.',
  },
  faqs: [
    {
      q: 'Can CAD Automation save an export straight to a product?',
      a: 'Not yet. Saving an export to a product revision as a draft engineering document, with where it came from, is built but switched off for customers. Today, download the export and upload it with Add a document.',
    },
    {
      q: 'Can the bill of materials be read from my SOLIDWORKS assembly?',
      a: 'Not yet. When it is switched on, it will read the top-level components of the open assembly into a proposal for a draft revision, matched to products by number and then by name. Today you add the lines yourself.',
    },
    {
      q: 'Does the ERP keep my SOLIDWORKS files?',
      a: 'Only files you upload. A CAD reference records the path, configuration and file name of a SOLIDWORKS file on your computer; the file itself stays there.',
    },
    {
      q: 'Which files can I upload as engineering documents?',
      a: 'PDF, images and office files as usual, and DXF and STEP files when their content checks out, up to 25 MB each. DXF and STEP files are only ever downloaded, never opened in the browser.',
    },
    {
      q: 'Why can I not add or approve a document?',
      a: 'Adding needs the Engineer, Engineering approver or ERP administrator role; approving needs Engineering approver or ERP administrator. Ask an ERP administrator for the role (see /learn/trouble-access/).',
    },
  ],
  keywords: ['CAD to ERP', 'SOLIDWORKS to ERP', 'drawing upload', 'engineering document', 'STEP', 'DXF', 'PDF drawing', 'bill of materials', 'BOM from CAD', 'product revision', 'PLM'],
  sources: [
    'docs/cad/README.md',
    'apps/work/src/worker/platform/flags.ts',
    'apps/work/src/client/system/erp/Documents.tsx',
    'apps/work/src/client/system/erp/Products.tsx',
    'apps/work/src/client/system/erp/api.ts',
    'apps/work/src/client/system/cad/Cad.tsx',
    'apps/work/src/worker/erp/documents.ts',
    'apps/work/src/worker/erp/access.ts',
    'apps/work/src/worker/routes/files.ts',
    'apps/cad/opensketch/sw_tools.py',
    'apps/cad/opensketch/catalog.py',
  ],
  updated: '2026-11-20',
};

export default workflow;
