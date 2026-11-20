import type { Workflow } from '../types.ts';

const workflow: Workflow = {
  id: "lead-to-customer",
  title: "Lead to customer",
  status: "live",
  summary:
    "An enquiry is recorded as a lead, worked and scored, then converted into a contact, a company and a deal. When the deal is won the company becomes a customer and, in a registered company that also runs Finance, it is linked to one Finance customer record.",
  stages: [
    {
      guide: "crm",
      label: "Lead",
      detail: "The enquiry is recorded in Sales and CRM with its source and estimated value, worked through New, Contacted and Engaged, and scored from 0 to 100.",
    },
    {
      guide: "crm",
      label: "Qualification and conversion",
      detail: "A qualified lead is converted once: a new or existing contact, a new or existing company (or none) and, if wanted, a deal in the chosen pipeline and stage. Its activities move to the new records.",
    },
    {
      guide: "crm",
      label: "Deal won",
      detail: "The deal moves through the pipeline and is marked Won. Someone sets the company's Relationship to Customer; BIZOMAT does not change it by itself.",
    },
    {
      guide: "finance",
      label: "One customer record in Finance",
      detail: "Connected: in a registered company that runs Finance, Add as a customer in Finance creates the Finance customer from the CRM company's details and links the two, so quotes and invoices go to the same customer.",
    },
  ],
  tutorial: {
    id: "lead-to-customer-walkthrough",
    title: "Turn an enquiry into a customer",
    outcome: "The enquiry is a won deal for a company marked Customer, linked to its Finance customer record where your company runs Finance.",
    needs:
      "A CRM role that can create leads, contacts, companies and deals and edit the lead (Owner, Administrator, Manager, Sales Executive or Member by default). The last step needs a Finance role that can add customers.",
    steps: [
      {
        title: "Record the enquiry",
        body: "In Sales and CRM, open Leads and choose New lead. Enter the person's name and company (for example Harbour Pumps), how to reach them, the Source and an Estimated value. Choose Create.",
        where: "New lead",
      },
      {
        title: "Plan the first contact",
        body: "On the lead, choose Plan an activity: a Call or Meeting, its due date and who it is assigned to. Complete it with Mark as done and write the outcome.",
        where: "Plan an activity",
      },
      {
        title: "Move the status along",
        body: "Choose Edit and set the Status to Contacted, then Engaged. Watch the Lead score panel: it explains the points behind the score.",
        where: "Lead score",
      },
      {
        title: "Qualify or close it",
        body: "When the lead is a real opportunity, set the Status to Qualified. If it is not, set Unqualified and stop here: the lead stays on record.",
        where: "Edit",
      },
      {
        title: "Convert",
        body: "Choose Convert. Create a new contact or use one the CRM suggests, Create a company (or use an existing one), leave Create a deal ticked, check the Title, Value, Expected close, Pipeline and Stage, and choose Convert.",
        where: "Convert",
      },
      {
        title: "Work the deal",
        body: "The new deal opens. Move it through the stages as the sale progresses, add Products and services, and name the Contacts on the deal.",
        where: "Contacts on the deal",
      },
      {
        title: "Win it",
        body: "When the customer says yes, choose Won on the deal.",
        where: "Won",
      },
      {
        title: "Mark the company as a customer",
        body: "Open the company (its link is under the deal's title), choose Edit and set Relationship to Customer. It now appears in the Customers view of Companies.",
        where: "Relationship",
      },
      {
        title: "Link it to Finance",
        body: "If your company runs Finance, the company's In Finance panel shows Add as a customer in Finance. Choose it: Finance gets the company's name, email, phone and address, and its open invoices then show here.",
        where: "Add as a customer in Finance",
      },
    ],
    after: "Quote and invoice the customer from the deal (see the Deal to invoice workflow), or start the project that delivers the work (Deal to project).",
  },
  faqs: [
    {
      q: "Can a lead be converted twice?",
      a: "No. A lead converts once, and then shows Converted with links to its contact, company and deal. To sell to the same person again, create a new deal on the contact or company.",
    },
    {
      q: "The CRM says a contact with this email exists. What should I do?",
      a: "Choose Use with the existing contact the CRM suggests, so the history stays in one place. Only tick the box to create a second contact if it really is a different person.",
    },
    {
      q: "Does winning a deal make the company a customer automatically?",
      a: "No. Set the company's Relationship to Customer yourself with Edit, or use the bulk Status change on Companies. Reports count won deals either way.",
    },
    {
      q: "Why don't I see Add as a customer in Finance?",
      a: "The In Finance panel appears only when the CRM organisation belongs to a registered company that also runs Finance, and the button needs a Finance role that can add customers. If the company is already linked, the panel shows the Finance customer instead. (see /learn/companies/)",
    },
    {
      q: "Can I import leads from a spreadsheet?",
      a: "Yes, if your role may import (Owner, Administrator and Manager by default): on Leads choose Import, pick the CSV file, match the columns and choose how duplicates are handled. (see /learn/crm/)",
    },
  ],
  keywords: ["lead conversion", "qualify a lead", "prospect to customer", "new customer", "sales process", "opportunity", "onboarding a customer"],
  sources: [
    "apps/work/src/client/crm/RecordPage.tsx",
    "apps/work/src/client/crm/RecordList.tsx",
    "apps/work/src/client/crm/CompanyLinks.tsx",
    "apps/work/src/client/crm/Activities.tsx",
    "apps/work/src/shared/crm/fields.ts",
    "apps/work/src/shared/crm/defaults.ts",
    "apps/work/src/shared/crm/score.ts",
    "apps/work/src/worker/crm/routes-records.ts",
    "apps/work/src/worker/company/links.ts",
    "docs/crm/README.md",
  ],
  updated: "2026-11-20",
};

export default workflow;
