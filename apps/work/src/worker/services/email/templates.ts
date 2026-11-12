// Transactional email templates. Every message has a responsive HTML part (tables and inline styles, which is what
// mail clients render reliably; no images, so nothing is blocked) and a plain-text part with the same content.
// Everything that comes from people (names, task titles, descriptions) is escaped.

import { PRODUCT } from '../../../shared/brand';

export const EMAIL_TEMPLATES = [
  'invitation',
  'invitation_accepted',
  'project_assignment',
  'task_assignment',
  'task_reassignment',
  'due_reminder',
  'overdue',
  'status_update',
  'comment_mention',
  'project_membership',
  'permission_change',
  'report_generated',
  'test',
  'notification',
  'verify_email',
] as const;
export type EmailTemplate = (typeof EMAIL_TEMPLATES)[number];

/** Invitations and security messages are sent first and may use the reserve above the daily limit. */
export const CRITICAL_TEMPLATES: EmailTemplate[] = ['invitation', 'test', 'verify_email'];

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const NAVY = '#0a1f33';
const TEAL = '#0f766e';
const MARK = '#14b8a6';
const SLOGAN = 'Connecting Intelligence. Empowering Progress.';
const SUPPORT_URL = 'https://bizomat.ai/contact/';

export function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);
}

/** One line of text for a subject: no line breaks, at most 150 characters. */
function oneLine(s: string, max = 150): string {
  const t = s.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

function clip(s: string | null | undefined, max: number): string {
  const t = (s ?? '').trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

interface Block {
  subject: string;
  preheader: string;
  heading: string;
  intro: string[];
  rows?: [string, string | null | undefined][];
  quote?: string | null;
  button?: { label: string; url: string };
  after?: string[];
  /** Why the person received this message. */
  reason: string;
  preferencesUrl?: string;
}

function layout(b: Block): RenderedEmail {
  const year = new Date().getUTCFullYear();
  const rows = (b.rows ?? []).filter(([, v]) => v != null && String(v).trim() !== '');
  const rowsHtml = rows.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0;border:1px solid #e2e8f0;border-radius:8px">${rows
        .map(
          ([k, v], i) =>
            `<tr><td style="padding:10px 14px;font-size:13px;color:#475569;width:38%;vertical-align:top;${i ? 'border-top:1px solid #e2e8f0;' : ''}">${esc(k)}</td><td style="padding:10px 14px;font-size:14px;color:${NAVY};vertical-align:top;${i ? 'border-top:1px solid #e2e8f0;' : ''}">${esc(v)}</td></tr>`,
        )
        .join('')}</table>`
    : '';
  const quoteHtml = b.quote ? `<div style="margin:16px 0;padding:12px 16px;border-left:3px solid ${MARK};background:#f8fafc;color:#334155;font-size:14px;line-height:1.55;white-space:pre-wrap">${esc(b.quote)}</div>` : '';
  const buttonHtml = b.button
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0"><tr><td style="border-radius:8px;background:${TEAL}"><a href="${esc(b.button.url)}" style="display:inline-block;padding:12px 22px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px">${esc(b.button.label)}</a></td></tr></table><p style="margin:0 0 16px;font-size:12px;color:#64748b;line-height:1.5">If the button does not work, copy this address into your browser:<br><a href="${esc(b.button.url)}" style="color:${TEAL};word-break:break-all">${esc(b.button.url)}</a></p>`
    : '';
  const para = (t: string) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#1e293b">${esc(t)}</p>`;
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(b.subject)}</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Inter Tight',Inter,Segoe UI,Helvetica,Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(b.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
<tr><td style="background:${NAVY};padding:18px 24px"><span style="font-size:20px;font-weight:700;letter-spacing:.06em;color:#ffffff">BIZOMAT</span><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${MARK};margin-left:6px"></span><div style="font-size:12px;color:#cbd5e1;margin-top:2px">${esc(PRODUCT.name)}</div></td></tr>
<tr><td style="padding:28px 24px 8px">
<h1 style="margin:0 0 16px;font-size:21px;line-height:1.3;color:${NAVY}">${esc(b.heading)}</h1>
${b.intro.map(para).join('')}${rowsHtml}${quoteHtml}${buttonHtml}${(b.after ?? []).map(para).join('')}
</td></tr>
<tr><td style="padding:16px 24px 24px;border-top:1px solid #e2e8f0;font-size:12px;line-height:1.6;color:#64748b">
${esc(b.reason)}${b.preferencesUrl ? ` <a href="${esc(b.preferencesUrl)}" style="color:${TEAL}">Choose which emails you receive</a>.` : ''}<br>
Need help? <a href="${SUPPORT_URL}" style="color:${TEAL}">Contact BIZOMAT</a>.<br><br>
<strong style="color:${NAVY}">${SLOGAN}</strong><br>&copy; ${year} BIZOMAT. All rights reserved.
</td></tr></table></td></tr></table></body></html>`;
  const textRows = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  const text = [
    b.heading,
    '',
    ...b.intro,
    textRows ? `\n${textRows}` : '',
    b.quote ? `\n"${b.quote}"` : '',
    b.button ? `\n${b.button.label}: ${b.button.url}` : '',
    ...(b.after?.length ? ['', ...b.after] : []),
    '',
    '--',
    b.reason + (b.preferencesUrl ? ` Choose which emails you receive: ${b.preferencesUrl}` : ''),
    `Need help? ${SUPPORT_URL}`,
    `${SLOGAN}`,
    `© ${year} BIZOMAT. All rights reserved.`,
  ]
    .filter((l) => l !== '')
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
  return { subject: oneLine(b.subject), html, text };
}

export interface TaskEmailData {
  organisation: string;
  project: string;
  board: string;
  task: string;
  description?: string | null;
  priority?: string | null;
  dueDate?: string | null;
  status?: string | null;
  assignedBy?: string | null;
  url: string;
  actions?: string[];
  preferencesUrl?: string;
}

export type TemplateData =
  | { template: 'invitation'; organisation: string; inviter: string; role: string; expires: string; url: string; message?: string | null; existingUser: boolean; access?: string | null }
  | { template: 'invitation_accepted'; organisation: string; person: string; email: string; role: string; url: string; preferencesUrl?: string }
  | { template: 'project_assignment'; organisation: string; project: string; level: string; by: string; url: string; preferencesUrl?: string }
  | ({ template: 'task_assignment' } & TaskEmailData)
  | ({ template: 'task_reassignment'; previous?: string | null } & TaskEmailData)
  | ({ template: 'due_reminder' } & TaskEmailData)
  | ({ template: 'overdue' } & TaskEmailData)
  | ({ template: 'status_update'; from?: string | null } & TaskEmailData)
  | ({ template: 'comment_mention'; author: string; mention: boolean; excerpt: string } & TaskEmailData)
  | { template: 'project_membership'; organisation: string; project?: string | null; change: string; by: string; url: string; preferencesUrl?: string }
  | { template: 'permission_change'; organisation: string; project?: string | null; change: string; by: string; url: string; preferencesUrl?: string }
  | { template: 'report_generated'; organisation: string; project: string; report: string; period: string; by: string; url: string; preferencesUrl?: string }
  | { template: 'test'; organisation: string; sentBy: string; provider: string; at: string; url?: string }
  | { template: 'verify_email'; name: string; email: string; url: string; expires: string }
  | { template: 'notification'; organisation: string; title: string; body?: string | null; url?: string | null; preferencesUrl?: string };

function taskRows(d: TaskEmailData): [string, string | null | undefined][] {
  return [
    ['Organisation', d.organisation],
    ['Project', d.project],
    ...(d.board && d.board !== d.project ? ([['Board', d.board]] as [string, string][]) : []),
    ['Task', d.task],
    ['Priority', d.priority],
    ['Due date', d.dueDate],
    ['Status', d.status],
    ['Assigned by', d.assignedBy],
  ];
}

function actionsLine(d: TaskEmailData): string[] {
  return d.actions?.length ? [`You can: ${d.actions.join(', ')}.`] : [];
}

const NOTIFY_REASON = 'You received this email because of your notification settings in BIZOMAT Project Management.';

export function renderEmail(d: TemplateData): RenderedEmail {
  switch (d.template) {
    case 'invitation':
      return layout({
        subject: "You've been invited to join an organisation on BIZOMAT",
        preheader: `${d.inviter} invited you to ${d.organisation} as ${d.role}.`,
        heading: `Join ${d.organisation} on BIZOMAT`,
        intro: [`${d.inviter} has invited you to join ${d.organisation} in BIZOMAT Project Management.`],
        rows: [
          ['Organisation', d.organisation],
          ['Invited by', d.inviter],
          ['Your role', d.role],
          ['Access', d.access ?? null],
          ['Invitation expires', d.expires],
        ],
        quote: d.message ? clip(d.message, 600) : null,
        button: { label: 'Accept invitation', url: d.url },
        after: [
          d.existingUser
            ? 'You already have a BIZOMAT account with this email address: open the link, sign in, then accept the invitation.'
            : 'New to BIZOMAT? Open the link and create your account with this email address, then accept the invitation.',
          'The link works once and only for this email address. If you were not expecting this invitation, you can ignore this email.',
        ],
        reason: `You received this email because ${d.inviter} invited this address to ${d.organisation}.`,
      });
    case 'invitation_accepted':
      return layout({
        subject: `${d.person} joined ${d.organisation}`,
        preheader: `${d.person} accepted your invitation.`,
        heading: `${d.person} accepted your invitation`,
        intro: [`${d.person} (${d.email}) is now a member of ${d.organisation} with the role ${d.role}.`],
        button: { label: 'View members', url: d.url },
        reason: NOTIFY_REASON,
        preferencesUrl: d.preferencesUrl,
      });
    case 'project_assignment':
      return layout({
        subject: `You have been added to the project ${d.project}`,
        preheader: `${d.by} gave you ${d.level} access to ${d.project}.`,
        heading: `You now have access to ${d.project}`,
        intro: [`${d.by} gave you ${d.level} access to the project ${d.project} in ${d.organisation}.`],
        rows: [
          ['Organisation', d.organisation],
          ['Project', d.project],
          ['Access', d.level],
        ],
        button: { label: 'Open project', url: d.url },
        reason: NOTIFY_REASON,
        preferencesUrl: d.preferencesUrl,
      });
    case 'task_assignment':
      return layout({
        subject: `New task assigned to you – ${d.task}`,
        preheader: `${d.assignedBy ?? 'Someone'} assigned you "${d.task}" in ${d.project}.`,
        heading: 'A task has been assigned to you',
        intro: [`${d.assignedBy ?? 'A colleague'} assigned you a task in ${d.project}.`],
        rows: taskRows(d),
        quote: d.description ? clip(d.description, 1200) : null,
        button: { label: 'Open task', url: d.url },
        after: actionsLine(d),
        reason: NOTIFY_REASON,
        preferencesUrl: d.preferencesUrl,
      });
    case 'task_reassignment':
      return layout({
        subject: `Task reassigned to you – ${d.task}`,
        preheader: `${d.assignedBy ?? 'Someone'} reassigned "${d.task}" to you.`,
        heading: 'A task has been reassigned to you',
        intro: [`${d.assignedBy ?? 'A colleague'} reassigned this task to you${d.previous ? ` (previously ${d.previous})` : ''}.`],
        rows: taskRows(d),
        quote: d.description ? clip(d.description, 1200) : null,
        button: { label: 'Open task', url: d.url },
        after: actionsLine(d),
        reason: NOTIFY_REASON,
        preferencesUrl: d.preferencesUrl,
      });
    case 'due_reminder':
      return layout({
        subject: `Due soon – ${d.task}`,
        preheader: `"${d.task}" is due ${d.dueDate ?? 'soon'}.`,
        heading: 'A task assigned to you is due soon',
        intro: [`"${d.task}" in ${d.project} is due ${d.dueDate ?? 'soon'}.`],
        rows: taskRows(d),
        button: { label: 'Open task', url: d.url },
        reason: NOTIFY_REASON,
        preferencesUrl: d.preferencesUrl,
      });
    case 'overdue':
      return layout({
        subject: `Overdue – ${d.task}`,
        preheader: `"${d.task}" was due ${d.dueDate ?? 'earlier'}.`,
        heading: 'A task assigned to you is overdue',
        intro: [`"${d.task}" in ${d.project} was due ${d.dueDate ?? 'earlier'} and is not complete.`],
        rows: taskRows(d),
        button: { label: 'Open task', url: d.url },
        reason: NOTIFY_REASON,
        preferencesUrl: d.preferencesUrl,
      });
    case 'status_update':
      return layout({
        subject: `Status changed – ${d.task}: ${d.status ?? 'cleared'}`,
        preheader: `"${d.task}" is now ${d.status ?? 'without a status'}.`,
        heading: `"${d.task}" is now ${d.status ?? 'without a status'}`,
        intro: [`The status of a task you are assigned to changed${d.from ? ` from ${d.from}` : ''}${d.status ? ` to ${d.status}` : ''}.`],
        rows: taskRows(d),
        button: { label: 'Open task', url: d.url },
        reason: NOTIFY_REASON,
        preferencesUrl: d.preferencesUrl,
      });
    case 'comment_mention':
      return layout({
        subject: d.mention ? `${d.author} mentioned you on ${d.task}` : `${d.author} commented on ${d.task}`,
        preheader: clip(d.excerpt, 120),
        heading: d.mention ? `${d.author} mentioned you` : `${d.author} commented`,
        intro: [`On "${d.task}" in ${d.project}:`],
        quote: clip(d.excerpt, 1200),
        rows: [
          ['Organisation', d.organisation],
          ['Project', d.project],
        ],
        button: { label: 'Reply in BIZOMAT', url: d.url },
        reason: NOTIFY_REASON,
        preferencesUrl: d.preferencesUrl,
      });
    case 'project_membership':
      return layout({
        subject: d.project ? `Your access to ${d.project} changed` : `Your membership of ${d.organisation} changed`,
        preheader: d.change,
        heading: d.project ? `Your access to ${d.project} changed` : `Your membership of ${d.organisation} changed`,
        intro: [d.change, `Changed by ${d.by}.`],
        button: { label: 'Open BIZOMAT', url: d.url },
        reason: NOTIFY_REASON,
        preferencesUrl: d.preferencesUrl,
      });
    case 'permission_change':
      return layout({
        subject: d.project ? `Your permissions on ${d.project} changed` : `Your permissions in ${d.organisation} changed`,
        preheader: d.change,
        heading: 'Your permissions changed',
        intro: [d.change, `Changed by ${d.by}.`],
        rows: [
          ['Organisation', d.organisation],
          ['Project', d.project ?? null],
        ],
        button: { label: 'Open BIZOMAT', url: d.url },
        reason: NOTIFY_REASON,
        preferencesUrl: d.preferencesUrl,
      });
    case 'report_generated':
      return layout({
        subject: `Report ready – ${d.project}: ${d.report}`,
        preheader: `${d.by} generated ${d.report} for ${d.period}.`,
        heading: 'A project report is ready',
        intro: [`${d.by} generated a report for ${d.project}.`],
        rows: [
          ['Organisation', d.organisation],
          ['Project', d.project],
          ['Report', d.report],
          ['Period', d.period],
        ],
        button: { label: 'View report', url: d.url },
        reason: NOTIFY_REASON,
        preferencesUrl: d.preferencesUrl,
      });
    case 'test':
      return layout({
        subject: 'BIZOMAT test email',
        preheader: 'Email delivery from BIZOMAT Project Management works.',
        heading: 'Email delivery works',
        intro: [`${d.sentBy} sent this test from ${d.organisation} at ${d.at}.`, `Provider: ${d.provider}.`],
        button: d.url ? { label: 'Check an email link', url: d.url } : undefined,
        after: d.url
          ? ['The button should open the BIZOMAT page "Email links work" at bizomat.ai/tasks/invite/link-check. If it shows an error or another address, the email service’s link tracking needs attention (see Email in the founder console).']
          : undefined,
        reason: 'You received this email because you asked for a test message.',
      });
    case 'verify_email':
      return layout({
        subject: 'Confirm your email address for BIZOMAT',
        preheader: 'One step left: confirm your email address to start using BIZOMAT Project Management.',
        heading: 'Confirm your email address',
        intro: [`Hello ${d.name}, confirm that ${d.email} is your email address to finish creating your BIZOMAT account.`],
        button: { label: 'Confirm email address', url: d.url },
        after: [`The link works once, until ${d.expires}. After confirming, sign in with your email address and password.`, 'If you did not create a BIZOMAT account, ignore this email: nothing happens without the link.'],
        reason: 'You received this email because this address was used to create a BIZOMAT account.',
      });
    case 'notification':
    default: {
      const n = d as Extract<TemplateData, { template: 'notification' }>;
      return layout({
        subject: n.title,
        preheader: clip(n.body, 120),
        heading: n.title,
        intro: n.body ? [clip(n.body, 1000)] : [],
        button: n.url ? { label: 'Open in BIZOMAT', url: n.url } : undefined,
        reason: NOTIFY_REASON,
        preferencesUrl: n.preferencesUrl,
      });
    }
  }
}
