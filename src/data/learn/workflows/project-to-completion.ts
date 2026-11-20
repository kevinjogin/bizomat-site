import type { Workflow } from '../types.ts';

const workflow: Workflow = {
  id: "project-to-completion",
  title: "Project to completion",
  status: "live",
  summary:
    "A project goes from plan to finished work in Project Management: tasks, dates and dependencies on a board, an approved baseline, progress, time and costs recorded as the work is done, the critical path and earned value watched, a completion report saved and the board archived. In a registered company, its income and costs can also come from Finance.",
  stages: [
    {
      guide: "projects",
      label: "Plan",
      detail: "A board with groups, tasks and subtasks, owners, planned dates, dependencies and a working calendar.",
    },
    {
      guide: "projects",
      label: "Baseline",
      detail: "Someone with manage access approves the original baseline: the dates, budgets and dependencies frozen for comparison. Later changes need a revised baseline with a reason.",
    },
    {
      guide: "projects",
      label: "Delivery",
      detail: "The team works the tasks: updates and @mentions, files, time on each task, percent complete and costs recorded on the Schedule tab.",
    },
    {
      guide: "projects",
      label: "Control and reporting",
      detail: "Project controls shows what needs attention, the critical path and earned value against the baseline; monthly progress reports are saved as versions.",
    },
    {
      guide: "finance",
      label: "Project costs in Finance",
      detail: "Connected, optional: in a registered company, the project's Finance tracking project collects posted income and costs and compares them with a budget.",
    },
    {
      guide: "projects",
      label: "Close",
      detail: "A Project completion report is saved, and the board is archived: read-only, hidden from lists and restorable.",
    },
  ],
  tutorial: {
    id: "project-to-completion-walkthrough",
    title: "Run a project from plan to close",
    outcome: "The project is delivered, measured against its approved baseline, reported and archived with its history.",
    needs:
      "Member or above in the workspace to create the board; manage access to the project to approve baselines; the Generate reports right for reports; board admin rights to archive.",
    steps: [
      {
        title: "Create the board",
        body: "In Project Management, choose New board, name it (for example Harbour Pumps station upgrade), pick the Project plan template or Blank board, and choose Create board.",
        where: "Create board",
      },
      {
        title: "Build the plan",
        body: "Add the tasks and subtasks, a Person and a Timeline column, and set each task's Planned start and Planned finish on its Schedule tab. Link tasks with Add predecessor.",
        where: "Add predecessor",
      },
      {
        title: "Set the working calendar",
        body: "Choose Project controls, then Calendar and settings, and add the holidays, shutdowns and exceptions that affect this project.",
        where: "Calendar and settings",
      },
      {
        title: "Approve the baseline",
        body: "In Project controls, Baselines, enter the Name, Approved by and Approval date and choose Approve and freeze.",
        where: "Approve and freeze",
      },
      {
        title: "Do the work",
        body: "The team posts updates on each task, attaches files and tracks time with Start timer or Log time. On each task's Schedule tab they choose Record progress with the Percent complete, and Add cost for costs.",
        where: "Record progress",
      },
      {
        title: "Watch the controls",
        body: "Open Project controls each week: Overview for what needs attention and the forecast finish, Critical path for the tasks that set the end date, Earned value for cost and schedule performance against the baseline.",
        where: "Project controls",
      },
      {
        title: "Report progress",
        body: "Choose Reports on the board, pick Monthly progress report and the period, add your commentary, choose Preview report and then Save report (PDF, Excel, HTML, CSV).",
        where: "Save report (PDF, Excel, HTML, CSV)",
      },
      {
        title: "Follow the money (optional)",
        body: "In a registered company that runs Finance, open the company area's Projects page and choose Track in Finance with a budget. Costs and income posted to the project in Finance then show there.",
        where: "Track in Finance",
      },
      {
        title: "Close the project",
        body: "When every task is complete, save a Project completion report. Then open the board's settings, choose Archive & delete and Archive. The board becomes read-only and moves to the Archived tab on Boards.",
        where: "Archive",
      },
    ],
    after: "To start the next project the same way, choose Save as template in the board's settings before archiving it.",
  },
  faqs: [
    {
      q: "Do I need a baseline?",
      a: "No, but without one Project controls cannot compare the plan with what happened, and earned value has nothing to measure against. Approve the original baseline once the plan is agreed.",
    },
    {
      q: "The plan changed. Can I edit the baseline?",
      a: "No. An approved baseline never changes. Approve a revised baseline with the reason for the revision; the original (baseline 0) stays for comparison.",
    },
    {
      q: "Why does earned value say it is unavailable?",
      a: "Earned value needs an approved baseline that carries a budget (the project needs a currency and an approved budget or estimated cost column when the baseline is approved), and your access must include View financial data. Then record progress and add costs on the tasks' Schedule tabs, and the figures appear.",
    },
    {
      q: "Can I get an archived project back?",
      a: "Yes. Open Boards, the Archived tab, then the board's settings, Archive & delete, Restore. Delete, by contrast, removes the board and everything on it for good.",
    },
    {
      q: "Where do the Finance figures come from?",
      a: "Only from entries posted in Finance with the project chosen on their lines. Costs entered on the tasks in Project Management stay in the project's own controls. (see /learn/finance/)",
    },
  ],
  keywords: ["project lifecycle", "project closeout", "project close-out", "baseline", "progress report", "completion report", "earned value", "critical path", "project delivery"],
  sources: [
    "apps/work/src/client/board/BoardPage.tsx",
    "apps/work/src/client/board/BoardSettings.tsx",
    "apps/work/src/client/board/ItemPanel.tsx",
    "apps/work/src/client/board/ReportsDialog.tsx",
    "apps/work/src/client/board/controls/ProjectControls.tsx",
    "apps/work/src/client/board/controls/BaselinesTab.tsx",
    "apps/work/src/client/board/controls/TaskSchedule.tsx",
    "apps/work/src/client/board/controls/SettingsTab.tsx",
    "apps/work/src/client/components/layout/CreateDialogs.tsx",
    "apps/work/src/client/pages/Boards.tsx",
    "apps/work/src/client/company/Pages.tsx",
    "apps/work/src/shared/reports.ts",
    "apps/work/src/worker/routes/schedule.ts",
    "apps/work/src/worker/company/links.ts",
  ],
  updated: "2026-11-20",
};

export default workflow;
