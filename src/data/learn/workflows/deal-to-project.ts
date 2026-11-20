import type { Workflow } from '../types.ts';

const workflow: Workflow = {
  id: "deal-to-project",
  title: "Deal to project",
  status: "connected",
  summary:
    "A deal in Sales and CRM starts a project board in the company's Projects and Tasks workspace, once per deal. The team plans and delivers the work there, CRM follow-ups can become project tasks, and the project can be tracked in Finance against a budget.",
  stages: [
    {
      guide: "crm",
      label: "Deal",
      detail: "Usually a won deal, in a CRM organisation that belongs to a registered company running Projects and Tasks.",
    },
    {
      guide: "projects",
      label: "Project board",
      detail: "Start a project creates a board named after the deal in the company's workspace, shared with the workspace, with the groups To do, In progress and Completed and no tasks. It is made once per deal.",
    },
    {
      guide: "projects",
      label: "Planning and delivery",
      detail: "The team adds tasks, dates, owners and dependencies, and works through them. A CRM activity can be sent to the project as a task with a link back.",
    },
    {
      guide: "finance",
      label: "Project costs and budget",
      detail: "Connected: in the company area, Track in Finance gives the project a Finance tracking project and a budget; income and costs posted to it in Finance show against the budget.",
    },
  ],
  tutorial: {
    id: "deal-to-project-walkthrough",
    title: "Start and cost a project from a won deal",
    outcome: "The won deal has its own project board, with the work planned and its costs tracked in Finance against a budget.",
    needs:
      "A registered company that runs Sales and CRM and Projects and Tasks. A Projects and Tasks role of Member or above to start the project. Tracking it in Finance needs a Finance role that manages accounting (Owner, Administrator or Accountant by default); seeing the figures needs a Finance role that sees reports.",
    steps: [
      {
        title: "Open the deal",
        body: "In Sales and CRM, open the deal, for example the won Harbour Pumps pump-station upgrade.",
        where: "Deals",
      },
      {
        title: "Start the project",
        body: "In the deal's Across panel, under Project Management, choose Start a project. A board named after the deal is made in the company's Projects and Tasks workspace, and it opens.",
        where: "Start a project",
      },
      {
        title: "Plan the work",
        body: "Add tasks with + Add item in each group, add a Timeline column for dates, assign people and link tasks under each task's Schedule tab with Add predecessor.",
        where: "+ Add item",
      },
      {
        title: "Bring in the team",
        body: "Choose Members on the board to add the people who will work on it. Everyone in the workspace can already see it, because it is shared with the workspace.",
        where: "Members",
      },
      {
        title: "Send CRM follow-ups across",
        body: "In Sales and CRM, open an activity's menu and choose Create a project task, then pick the new project and choose Create task. The task links back to the CRM.",
        where: "Create a project task",
      },
      {
        title: "Track the project in Finance",
        body: "In the ERP choose Administration, then Company overview, and open Projects in the company area. The project shows Started from a CRM deal. Choose Track in Finance, enter the budget and choose Save.",
        where: "Track in Finance",
      },
      {
        title: "Post its costs and income",
        body: "In Finance, choose the project in the Project field on the lines of bills, transactions and invoices for this work. Only posted entries count.",
        where: "Project",
      },
      {
        title: "Follow the figures",
        body: "The company area's Projects page shows the project's Budget, Costs, Remaining and Income from Finance. Remaining turns to a warning when costs pass the budget.",
        where: "Remaining",
      },
    ],
    after: "Carry the project through to the end (see the Project to completion workflow).",
  },
  faqs: [
    {
      q: "Why don't I see Start a project on the deal?",
      a: "The Across panel's Project Management section appears only when the CRM organisation belongs to a registered company that also runs Projects and Tasks. Starting a project needs a Projects and Tasks role of Member or above in that workspace; otherwise the panel says you cannot create projects. (see /learn/companies/)",
    },
    {
      q: "Can one deal have two projects?",
      a: "No. Start a project works once per deal; afterwards the panel shows a link to the project. For more boards, create them in Projects and Tasks directly.",
    },
    {
      q: "Does the project copy the deal's products or value?",
      a: "No. The board is named after the deal and its description says it was started from a deal in the CRM; it starts with no tasks. Money stays in Finance, read when asked.",
    },
    {
      q: "Why does the company's Projects page show a dash instead of costs?",
      a: "A dash means the project is not tracked in Finance yet, or your Finance role does not show reports. Figures come only from posted Finance entries tagged with the project.",
    },
    {
      q: "Can I start a project for a lost deal?",
      a: "The button does not check the deal's status, so it is up to you. Most teams start the project once the deal is won.",
    },
  ],
  keywords: ["won deal to project", "project kickoff", "handover from sales", "job setup", "project budget", "project costing", "CRM to Projects"],
  sources: [
    "apps/work/src/worker/company/links.ts",
    "apps/work/src/client/crm/CompanyLinks.tsx",
    "apps/work/src/client/crm/Activities.tsx",
    "apps/work/src/client/company/Pages.tsx",
    "apps/work/src/client/company/CompanyApp.tsx",
    "apps/work/src/client/system/SystemApp.tsx",
    "apps/work/src/client/fin/ui.tsx",
    "apps/work/src/worker/services/boards.ts",
    "apps/work/src/client/board/controls/TaskSchedule.tsx",
    "docs/company/README.md",
  ],
  updated: "2026-11-20",
};

export default workflow;
