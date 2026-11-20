// Incident to action (BIZOMAT WHS Release 1): an incident reported from a phone, responded to, classified,
// investigated, given a person's notification decision and submission record, and closed once its actions are verified.
// BIZOMAT never decides whether an incident must be notified and sends nothing to a regulator; the legal packs are Not
// verified until a platform administrator verifies them (tests/whs-claims.test.ts).
import type { Workflow } from '../types.ts';

const workflow: Workflow = {
  id: 'incident-to-action',
  title: 'Incident to action',
  status: 'live',
  summary:
    'An incident reported from a phone is responded to, classified and investigated. A WHS manager records the decision about notifying the regulator and any submission they made, and the incident is closed once its corrective actions are completed with evidence and verified by someone else.',
  stages: [
    { guide: 'whs', label: 'Report', detail: 'Anyone in the company reports the incident with Report an incident. A serious one alerts the WHS managers in the app and by email.' },
    { guide: 'whs', label: 'Response and classification', detail: 'A WHS officer records the immediate response and classifies the incident: kind, severity, outcome, body part and nature of injury. Every later change is kept.' },
    { guide: 'whs', label: 'Investigation', detail: 'A lead investigator and team record the timeline, witness statements, evidence and root cause; a WHS manager who did not lead or submit it approves it.' },
    { guide: 'whs', label: 'Regulator notification record', detail: 'The incident is checked against its site\'s jurisdiction rules. A WHS manager decides, with reasons, and records the submission made to the regulator outside BIZOMAT.' },
    { guide: 'whs', label: 'Actions', detail: 'Corrective and preventive actions with a responsible person, due date and, where asked, evidence; verified by someone other than the person who completed them.' },
    { guide: 'whs', label: 'Verification and closure', detail: 'A WHS manager closes the incident once every action is verified and the notification decision or submission is recorded.' },
    { guide: 'reports', label: 'Registers and dashboard', detail: 'The incident and actions registers, the WHS dashboard and its injury frequency rates, and each person\'s Health and safety items in My Work.' },
  ],
  tutorial: {
    id: 'incident-to-action-walkthrough',
    title: 'Take an incident from report to close',
    outcome: 'The incident is investigated, its notification decision is on record, its actions are verified, and it is closed.',
    needs: 'Anyone to report; a WHS officer to respond and classify; an investigator to investigate; a WHS manager (or ERP administrator) to approve, decide notification and close.',
    steps: [
      { title: 'Report it', body: 'Choose Report an incident in Health and Safety. Choose what happened, fill in In a few words, When (date), Which site?, Where exactly?, Was anyone hurt? and What was done straight away?, then Send the report.', where: 'Report an incident' },
      { title: 'Record the response', body: 'A WHS officer opens the incident in Incidents and chooses Record the immediate response.', where: 'Record the immediate response' },
      { title: 'Classify it', body: 'Choose Classify: Kind, Severity, Outcome, Body part and Nature of injury or illness. Tick To be investigated if it needs an investigation, and choose Save the classification.', where: 'Classify' },
      { title: 'Investigate', body: 'Choose Start the investigation with the Lead investigator and team, then Start. In the Investigation tab, use Add to the timeline, Record a statement, Add evidence and Root cause analysis (five whys, fishbone, contributing factors, failed controls).', where: 'Start the investigation' },
      { title: 'Approve the investigation', body: 'The team chooses Submit for approval once the root cause is recorded. A WHS manager who did not lead or submit it chooses Approve, or Return for changes.', where: 'Approve' },
      { title: 'Record the notification decision', body: 'In the Regulator notification tab, read the rules of the site\'s jurisdictions. A rule that is Not verified shows "Deadline not verified: check with the regulator." A WHS manager chooses Record the decision, gives the reasons and, if notifiable, who notifies the regulator.', where: 'Record the decision' },
      { title: 'Record the submission', body: 'After notifying the regulator yourself, tick the checklist items, choose Record the submission and give how it was made, the date and time, who made it and The regulator\'s reference. Attach the regulator\'s confirmation with Attach. The record cannot be changed afterwards.', where: 'Record the submission' },
      { title: 'Raise the actions', body: 'Under Corrective and preventive actions, choose New action: What is to be done, its place in the Hierarchy of controls, the responsible person, Due, Priority and Evidence needed to complete it. Choose Raise the action. Approving the investigation moves the incident to Corrective action by itself; an incident that was not investigated is moved with To corrective action.', where: 'New action' },
      { title: 'Do and verify each action', body: 'The responsible person chooses Start, adds evidence with Add evidence and chooses Complete. Someone else chooses Verify (Verified effective) or Not effective, which sends it back, and then Close.', where: 'Verify' },
      { title: 'Close the incident', body: 'Once no action is open or in progress, choose Ready for verification. When every action is verified, a WHS manager chooses Verify and close and says how the corrective actions were verified.', where: 'Verify and close' },
    ],
    after: 'The incident stays in the Incident register for good. Its figures count in the WHS dashboard and, where hours worked are entered, in LTIFR and TRIFR.',
  },
  faqs: [
    { q: 'Who is alerted about a serious incident?', a: 'The WHS managers, in the app and by email, as soon as the report is sent. The example company sends no email. A serious incident is one of severity serious or critical, an outcome of death or hospital in-patient treatment, or a dangerous occurrence.' },
    { q: 'Does BIZOMAT decide whether to notify the regulator, or notify it?', a: 'Neither. A WHS manager decides and records the reasons, and a person notifies the regulator outside BIZOMAT, then records the submission. A due time is shown only from a rule that a platform administrator has verified and that is in effect on the incident\'s date (see /learn/whs/).' },
    { q: 'Why can I not move the incident to corrective action?', a: 'An incident marked To be investigated moves on only when its investigation is approved, and approving it moves the incident to Corrective action by itself. To corrective action is for an incident that is not being investigated.' },
    { q: 'Why can I not close the incident?', a: 'Every action must be verified, and the notification decision (and any submission) recorded, before a WHS manager can close it.' },
    { q: 'Where do overdue actions show?', a: 'On the Health and Safety overview, in the Actions register with the overdue filter, and in My Work under Health and safety. Each overdue action is also escalated once in the app to the responsible person and the WHS managers.' },
  ],
  keywords: ['incident management', 'injury', 'near miss', 'dangerous occurrence', 'incident investigation', 'root cause analysis', 'notifiable incident', 'regulator notification', 'corrective action', 'CAPA', 'WHS', 'OHS', 'HSE'],
  sources: [
    'docs/whs/README.md',
    'apps/work/src/client/system/whs/Report.tsx',
    'apps/work/src/client/system/whs/Incidents.tsx',
    'apps/work/src/client/system/whs/Actions.tsx',
    'apps/work/src/client/pages/MyWork.tsx',
    'apps/work/src/worker/whs/access.ts',
    'apps/work/src/worker/whs/util.ts',
    'tests/whs-claims.test.ts',
  ],
  updated: '2026-11-20',
};

export default workflow;
