// The Company Admin console (owner's request of 20 Nov 2026; docs/platform/company-admin.md), at
// /erp/c/<company>/company-admin: the owner and administrators of a registered company manage their own team in one
// place, as the platform's super admins do in the ERP console. Tabs: Overview (the team at a glance and what needs
// attention), Members (invitations, roles, module access, suspension, removal, ownership transfer), Departments, Roles
// and access (presets, the tools' teams, the access review), ERP roles, Security (the company's API tokens, BIZOMAT
// support access), Activity and Settings. Members, Departments, Activity and Settings are the company area's own pages
// (src/client/company), the same screens with the same server checks; the server (src/worker/company/admin-console.ts)
// decides who may open the console.
import {
  lazy,
  Suspense,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, errorMessage, get, post } from "../../lib/api";
import { appUrl, toolUrl } from "../../lib/base";
import { usePageTitle } from "../../lib/hooks";
import { timeAgo } from "../../lib/format";
import { Icon } from "../../components/ui/Icon";
import {
  EmptyState,
  ErrorBox,
  Loading,
  PageHeader,
} from "../../components/ui/ui";
import { Modal, useToast } from "../../components/ui/overlays";
import {
  COMPANY_ROLE_LABELS,
  ROLE_PRESETS,
  TOOL_NAMES,
  co,
  toolRoleLabel,
  useCompany,
  type ToolApp,
} from "../../company/lib";
import "../../styles/company.css";
import "../../styles/erp.css";

const Members = lazy(() =>
  import("../../company/Members").then((m) => ({ default: m.Members })),
);
const People = lazy(() =>
  import("../../company/Pages").then((m) => ({ default: m.People })),
);
const Departments = lazy(() =>
  import("../../company/Pages").then((m) => ({ default: m.Departments })),
);
const Activity = lazy(() =>
  import("../../company/Pages").then((m) => ({ default: m.Activity })),
);
const Settings = lazy(() =>
  import("../../company/Pages").then((m) => ({ default: m.Settings })),
);
const SupportAccess = lazy(() =>
  import("../../company/Pages").then((m) => ({ default: m.SupportAccess })),
);
const ErpRolesPage = lazy(() =>
  import("../erp/Roles").then((m) => ({ default: m.ErpRolesPage })),
);

export const adminPage = (companyId: string, path = "") =>
  `/c/${encodeURIComponent(companyId)}/company-admin${path}`;

type Tab =
  "members" | "departments" | "roles" | "security" | "activity" | "settings";
interface Attention {
  key: string;
  level: "high" | "medium" | "info";
  title: string;
  detail: string;
  tab: Tab;
  count?: number;
}
interface Overview {
  company: {
    id: string;
    name: string;
    registration: { status: string; label: string };
    emailConfirmed: boolean;
    createdAt: number;
  };
  me: { role: string; roleLabel: string };
  membersV2: boolean;
  people: {
    active: number;
    suspended: number;
    roles: Record<string, number>;
    invitations: { pending: number; expiring: number };
    joinRequests: number;
    departments: number;
    noDepartment: number;
    inactive: number;
  };
  security: {
    supportAccess: { until: number | null } | null;
    transfer: { to: string | null; expiresAt: number } | null;
    tokens: { active: number; stale: number; expiring: number };
    unscopedTokenHolders: number;
  };
  modulesOff: string[];
  attention: Attention[];
  recent: { id: string; action: string; actor: string | null; at: number }[];
}

const TABS: [string, string, string][] = [
  ["", "Overview", "home"],
  ["/members", "Members", "users"],
  ["/departments", "Departments", "layers"],
  ["/roles", "Roles and access", "key"],
  ["/erp-roles", "ERP roles", "checkSquare"],
  ["/security", "Security", "shield"],
  ["/activity", "Activity", "list"],
  ["/settings", "Settings", "settings"],
];

export function CompanyAdminArea({ companyId }: { companyId: string }) {
  const overview = useQuery({
    queryKey: ["company", companyId, "admin-overview"],
    queryFn: () => get<Overview>(co(companyId, "/admin/overview")),
    retry: false,
  });
  const company = useCompany(companyId);
  if (overview.error) {
    const code =
      overview.error instanceof ApiError
        ? (overview.error.details as { code?: string } | undefined)?.code
        : null;
    const status =
      overview.error instanceof ApiError ? overview.error.status : 0;
    return (
      <div className="page crm-page">
        <PageHeader title="Company Admin" />
        <section className="co-prompt">
          <p>
            {code === "COMPANY_ADMIN_OFF"
              ? "The Company Admin console is not switched on for this company yet. Manage the company from Administration meanwhile."
              : status === 403
                ? "Only the owner and administrators of this company can open the Company Admin console."
                : status === 404
                  ? "Company Admin is for registered companies. Register your business to add people and give them roles."
                  : errorMessage(overview.error)}
          </p>
          <Link className="btn" to="/administration">
            Open Administration
          </Link>
        </section>
      </div>
    );
  }
  if (!overview.data || !company.data)
    return <Loading label="Opening Company Admin…" />;
  const v = overview.data;
  const wrap = (node: ReactNode) => (
    <Suspense fallback={<Loading />}>{node}</Suspense>
  );
  return (
    <>
      <div className="page crm-page co-admin-head">
        <div className="row wrap">
          <span className="eyebrow grow">Company Admin · {v.company.name}</span>
          <span className="muted small">
            You are {v.me.role === "owner" ? "the owner" : "an administrator"}
          </span>
        </div>
        <nav className="tabs sys-tabs" aria-label="Company Admin sections">
          {TABS.map(([to, label, icon]) => (
            <NavLink
              key={label}
              end={to === ""}
              to={adminPage(companyId, to)}
              className={({ isActive }) => `tab${isActive ? " active" : ""}`}
            >
              <Icon name={icon} size={14} /> {label}
              {to === "" && v.attention.some((a) => a.level === "high") ? (
                <span className="badge danger co-admin-dot">
                  {v.attention.filter((a) => a.level === "high").length}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>
      </div>
      <Routes>
        <Route
          index
          element={<OverviewTab v={v} refresh={() => overview.refetch()} />}
        />
        <Route
          path="members"
          element={wrap(
            v.membersV2 ? (
              <Members companyId={companyId} companyName={v.company.name} />
            ) : (
              <People />
            ),
          )}
        />
        <Route path="departments" element={wrap(<Departments />)} />
        <Route path="roles" element={<RolesTab v={v} />} />
        <Route
          path="erp-roles"
          element={wrap(
            <ErpRolesPage companyId={companyId} companyName={v.company.name} />,
          )}
        />
        <Route path="security" element={<SecurityTab v={v} />} />
        <Route path="activity" element={wrap(<Activity />)} />
        <Route path="settings" element={wrap(<Settings />)} />
        <Route
          path="*"
          element={<Navigate to={adminPage(companyId)} replace />}
        />
      </Routes>
    </>
  );
}

// ------------------------------------------------------------------ overview

const ACTIONS: Record<string, string> = {
  "company.token_revoked": "revoked an API token",
  "company.access_review": "downloaded the access review",
};

function OverviewTab({ v, refresh }: { v: Overview; refresh: () => void }) {
  usePageTitle("Company Admin");
  const id = v.company.id;
  const p = v.people;
  const tiles: [string, string, string, Tab | ""][] = [
    [
      "Active members",
      String(p.active),
      p.suspended ? `${p.suspended} suspended` : "Nobody suspended",
      "members",
    ],
    [
      "Pending invitations",
      String(p.invitations.pending),
      p.invitations.expiring
        ? `${p.invitations.expiring} expire within two days`
        : "None expiring soon",
      "members",
    ],
    [
      "Requests to join",
      String(p.joinRequests),
      p.joinRequests ? "Waiting for your answer" : "None waiting",
      "members",
    ],
    [
      "Departments",
      String(p.departments),
      p.noDepartment
        ? `${p.noDepartment} members in none`
        : "Everyone is in one",
      "departments",
    ],
    [
      "API tokens for this company",
      String(v.security.tokens.active),
      v.security.tokens.stale
        ? `${v.security.tokens.stale} unused for 90 days`
        : "All in use",
      "security",
    ],
  ];
  return (
    <div className="page crm-page">
      <PageHeader
        title="Company Admin"
        subtitle={`Manage ${v.company.name}'s team: who is in it, what each person can open and do, and what needs your attention. Registration check: ${v.company.registration.label.toLowerCase()}.`}
        actions={
          <button className="btn ghost sm" onClick={refresh}>
            <Icon name="refresh" size={14} /> Refresh
          </button>
        }
      />
      <div className="stack">
        <div className="erp-stats">
          {tiles.map(([label, value, hint, tab]) => (
            <Link
              key={label}
              to={adminPage(id, tab ? `/${tab}` : "")}
              className="card card-pad erp-stat"
            >
              <span className="muted small">{label}</span>
              <strong className="erp-stat-value">{value}</strong>
              <span className="muted small">{hint}</span>
            </Link>
          ))}
        </div>
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Needs attention</h2>
          {!v.attention.length ? (
            <p className="muted">Nothing needs your attention right now.</p>
          ) : (
            <ul className="co-admin-list">
              {v.attention.map((a) => (
                <li key={a.key} className={`co-admin-item co-admin-${a.level}`}>
                  <div className="grow">
                    <strong>{a.title}</strong>
                    <div className="muted small">{a.detail}</div>
                  </div>
                  <Link className="btn sm" to={adminPage(id, `/${a.tab}`)}>
                    Open
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <div className="co-admin-grid">
          <section className="card card-pad stack">
            <h2 className="crm-subhead">People by role</h2>
            <dl className="crm-props">
              {(
                ["owner", "admin", "manager", "employee", "read_only"] as const
              ).map((r) => (
                <div key={r} className="crm-prop">
                  <dt>{COMPANY_ROLE_LABELS[r]}</dt>
                  <dd>{p.roles[r] ?? 0}</dd>
                </div>
              ))}
            </dl>
            <div className="row wrap">
              <Link className="btn primary sm" to={adminPage(id, "/members")}>
                <Icon name="plus" size={14} /> Invite people
              </Link>
              <a
                className="btn ghost sm"
                href={appUrl(
                  `/api${co(id, "/admin/access-review?format=csv")}`,
                )}
              >
                <Icon name="download" size={14} /> Access review (CSV)
              </a>
            </div>
          </section>
          <section className="card card-pad stack">
            <h2 className="crm-subhead">Recent activity</h2>
            {!v.recent.length ? (
              <p className="muted">Nothing yet.</p>
            ) : (
              <ul className="crm-mini-list">
                {v.recent.map((r) => (
                  <li key={r.id}>
                    <strong>{r.actor ?? "BIZOMAT"}</strong>{" "}
                    {ACTIONS[r.action] ??
                      r.action
                        .replace(/^company\./, "")
                        .replace(/[._]/g, " ")}{" "}
                    <span className="muted small">{timeAgo(r.at)}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link className="btn ghost sm" to={adminPage(id, "/activity")}>
              All activity
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ roles and access

interface ReviewRow {
  name: string;
  email: string;
  role: string;
  status: string;
  title: string;
  departments: string;
  tasks: string;
  crm: string;
  finance: string;
  modules: string;
  tokens: number;
  joined: string;
  lastActive: string;
}

function RolesTab({ v }: { v: Overview }) {
  usePageTitle("Roles and access");
  const id = v.company.id;
  const company = useCompany(id).data;
  const [review, setReview] = useState(false);
  const q = useQuery({
    queryKey: ["company", id, "access-review"],
    queryFn: () =>
      get<{ membersV2: boolean; rows: ReviewRow[] }>(
        co(id, "/admin/access-review"),
      ),
    enabled: review,
  });
  const tools = company?.tools;
  const toolPages: {
    app: ToolApp;
    label: string;
    href: (toolId: string) => string;
  }[] = [
    {
      app: "crm",
      label: "Sales and CRM: team and roles",
      href: (t) => toolUrl(`/crm/o/${encodeURIComponent(t)}/team`),
    },
    {
      app: "finance",
      label: "Finance: team and roles",
      href: (t) => toolUrl(`/finance/o/${encodeURIComponent(t)}/team`),
    },
    {
      app: "tasks",
      label: "Projects and Tasks: workspace members",
      href: (t) => toolUrl(`/tasks/w/${encodeURIComponent(t)}/settings`),
    },
  ];
  return (
    <div className="page crm-page">
      <PageHeader
        title="Roles and access"
        subtitle="Each person has one company role, which sets their role in each tool; you can change a tool's role for one person. Every tool also checks its own roles on the server."
      />
      <div className="stack">
        <section className="card card-pad stack">
          <h2 className="crm-subhead">What each company role gives</h2>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead>
                <tr>
                  <th>Company role</th>
                  {(Object.keys(TOOL_NAMES) as ToolApp[]).map((t) => (
                    <th key={t}>{TOOL_NAMES[t]}</th>
                  ))}
                  <th>Company administration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label="Company role">
                    <strong>Owner</strong>
                  </td>
                  {(Object.keys(TOOL_NAMES) as ToolApp[]).map((t) => (
                    <td key={t} data-label={TOOL_NAMES[t]}>
                      Owner
                    </td>
                  ))}
                  <td data-label="Administration">
                    Everything, and transfers ownership
                  </td>
                </tr>
                {(
                  Object.keys(ROLE_PRESETS) as (keyof typeof ROLE_PRESETS)[]
                ).map((r) => (
                  <tr key={r}>
                    <td data-label="Company role">
                      <strong>{COMPANY_ROLE_LABELS[r]}</strong>
                    </td>
                    {(Object.keys(TOOL_NAMES) as ToolApp[]).map((t) => (
                      <td key={t} data-label={TOOL_NAMES[t]}>
                        {toolRoleLabel(t, ROLE_PRESETS[r][t])}
                      </td>
                    ))}
                    <td data-label="Administration">
                      {r === "admin"
                        ? "People (except the owner), departments, invitations, settings"
                        : "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted small">
            {v.membersV2
              ? "Module access and record scope (all, team or own) can also be set for each person in Members."
              : "Change a person’s company role or a tool’s role in Members."}{" "}
            Only the owner makes administrators.
          </p>
        </section>
        {tools && toolPages.some((l) => tools[l.app]) ? (
          <section className="card card-pad stack">
            <h2 className="crm-subhead">Each tool's own team</h2>
            <div className="stack">
              {toolPages.map((l) => {
                const t = tools[l.app];
                return t ? (
                  <a key={l.app} className="nav-item" href={l.href(t.id)}>
                    <Icon name="link" /> {l.label}{" "}
                    <span className="muted small">({t.name})</span>
                  </a>
                ) : null;
              })}
            </div>
          </section>
        ) : null}
        {v.modulesOff.length ? (
          <section className="card card-pad stack">
            <h2 className="crm-subhead">Modules switched off</h2>
            <p className="small">
              {v.modulesOff.join(", ")}. BIZOMAT support switches modules on and
              off for a company.
            </p>
          </section>
        ) : null}
        <section className="card card-pad stack">
          <div className="row wrap">
            <h2 className="crm-subhead grow">Access review</h2>
            <a
              className="btn ghost sm"
              href={appUrl(`/api${co(id, "/admin/access-review?format=csv")}`)}
            >
              <Icon name="download" size={14} /> Download CSV
            </a>
            {!review ? (
              <button className="btn sm" onClick={() => setReview(true)}>
                Review here
              </button>
            ) : null}
          </div>
          <p className="muted small">
            Everyone in the company with their role, departments, each tool's
            role{v.membersV2 ? ", module access" : ""}, API tokens and when they
            were last active, for a periodic review. Each review is recorded in
            the company's activity.
          </p>
          {review ? (
            q.error ? (
              <ErrorBox error={q.error} />
            ) : !q.data ? (
              <Loading />
            ) : (
              <div className="crm-table-scroll">
                <table className="data-table responsive">
                  <thead>
                    <tr>
                      <th>Person</th>
                      <th>Role</th>
                      <th>Departments</th>
                      <th>Tools</th>
                      {q.data.membersV2 ? <th>Module access</th> : null}
                      <th>Tokens</th>
                      <th>Last active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {q.data.rows.map((r) => (
                      <tr key={r.email}>
                        <td data-label="Person">
                          <strong>{r.name}</strong>
                          <div className="muted small">
                            {r.email}
                            {r.title ? ` · ${r.title}` : ""}
                          </div>
                        </td>
                        <td data-label="Role">
                          {r.role}
                          {r.status === "Suspended" ? (
                            <div>
                              <span className="badge warning">Suspended</span>
                            </div>
                          ) : null}
                        </td>
                        <td data-label="Departments">
                          {r.departments || <span className="muted">None</span>}
                        </td>
                        <td data-label="Tools" className="small">
                          {[
                            r.tasks &&
                              `Projects: ${toolRoleLabel("tasks", r.tasks)}`,
                            r.crm && `CRM: ${toolRoleLabel("crm", r.crm)}`,
                            r.finance &&
                              `Finance: ${toolRoleLabel("finance", r.finance)}`,
                          ]
                            .filter(Boolean)
                            .join(" · ") || <span className="muted">None</span>}
                        </td>
                        {q.data!.membersV2 ? (
                          <td data-label="Module access" className="small">
                            {r.modules}
                          </td>
                        ) : null}
                        <td data-label="Tokens">{r.tokens}</td>
                        <td data-label="Last active" className="small">
                          {r.lastActive || "Never"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : null}
        </section>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ security

interface TokenRow {
  id: string;
  name: string;
  prefix: string;
  person: { id: string; name: string; email: string; role: string | null };
  createdAt: number;
  lastUsedAt: number | null;
  expiresAt: number | null;
  apps: string[] | null;
  readOnly: boolean;
  stale: boolean;
  canRevoke: boolean;
}

function SecurityTab({ v }: { v: Overview }) {
  usePageTitle("Security");
  const id = v.company.id;
  const q = useQuery({
    queryKey: ["company", id, "admin-tokens"],
    queryFn: () =>
      get<{ tokens: TokenRow[]; staleDays: number }>(co(id, "/admin/tokens")),
  });
  const [revoking, setRevoking] = useState<TokenRow | null>(null);
  return (
    <div className="page crm-page">
      <PageHeader
        title="Security"
        subtitle="The API tokens people made for this company, and BIZOMAT support's access. A token acts as its person, limited to this company."
      />
      <div className="stack">
        <section className="card card-pad stack">
          <h2 className="crm-subhead">API tokens for {v.company.name}</h2>
          {q.error ? (
            <ErrorBox error={q.error} retry={() => q.refetch()} />
          ) : !q.data ? (
            <Loading />
          ) : !q.data.tokens.length ? (
            <EmptyState icon="key" title="No API tokens">
              Nobody has made an API token for this company. People make their
              own in their account settings.
            </EmptyState>
          ) : (
            <div className="crm-table-scroll">
              <table className="data-table responsive">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Person</th>
                    <th>Can reach</th>
                    <th>Last used</th>
                    <th>Expires</th>
                    <th>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {q.data.tokens.map((t) => (
                    <tr key={t.id}>
                      <td data-label="Token">
                        <strong>{t.name}</strong>
                        <div className="muted small mono">{t.prefix}…</div>
                      </td>
                      <td data-label="Person">
                        {t.person.name}
                        <div className="muted small">
                          {t.person.role
                            ? COMPANY_ROLE_LABELS[
                                t.person
                                  .role as keyof typeof COMPANY_ROLE_LABELS
                              ]
                            : "No longer in the company"}
                        </div>
                      </td>
                      <td data-label="Can reach" className="small">
                        {t.apps?.length
                          ? t.apps.join(", ")
                          : "Every tool of the company"}
                        {t.readOnly ? " · read only" : ""}
                      </td>
                      <td data-label="Last used" className="small">
                        {t.lastUsedAt ? timeAgo(t.lastUsedAt) : "Never"}
                        {t.stale ? (
                          <div>
                            <span className="badge warning">
                              Unused for {q.data!.staleDays} days
                            </span>
                          </div>
                        ) : null}
                      </td>
                      <td data-label="Expires" className="small">
                        {t.expiresAt
                          ? new Date(t.expiresAt).toLocaleDateString("en-AU")
                          : "Never"}
                      </td>
                      <td className="erp-actions">
                        {t.canRevoke ? (
                          <button
                            className="btn ghost sm"
                            onClick={() => setRevoking(t)}
                          >
                            Revoke
                          </button>
                        ) : (
                          <span className="muted small">The owner's</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {v.security.unscopedTokenHolders ? (
            <p className="muted small">
              {v.security.unscopedTokenHolders}{" "}
              {v.security.unscopedTokenHolders === 1
                ? "member also has"
                : "members also have"}{" "}
              older tokens that are not limited to one company. Only their
              owners see and revoke those; ask them to replace them with tokens
              for this company.
            </p>
          ) : null}
        </section>
        <Suspense fallback={<Loading />}>
          <SupportAccess companyId={id} />
        </Suspense>
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Ownership</h2>
          <p className="small">
            {v.security.transfer
              ? `A transfer of ownership to ${v.security.transfer.to ?? "another member"} is waiting for their answer.`
              : "The owner can transfer ownership to another member in Members; the new owner accepts it."}
          </p>
          <Link className="btn ghost sm" to={adminPage(id, "/members")}>
            Open Members
          </Link>
        </section>
      </div>
      {revoking ? (
        <RevokeDialog
          companyId={id}
          token={revoking}
          onClose={() => setRevoking(null)}
        />
      ) : null}
    </div>
  );
}

function RevokeDialog({
  companyId,
  token,
  onClose,
}: {
  companyId: string;
  token: TokenRow;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const qc = useQueryClient();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await post(
        co(companyId, `/admin/tokens/${encodeURIComponent(token.id)}/revoke`),
        { reason: reason.trim() },
      );
      toast(`${token.name} revoked`);
      await qc.invalidateQueries({ queryKey: ["company", companyId] });
      onClose();
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title={`Revoke ${token.name}?`}
      onClose={onClose}
      footer={
        <div className="row">
          <button className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn danger"
            form="co-revoke"
            type="submit"
            disabled={busy || reason.trim().length < 3}
          >
            Revoke
          </button>
        </div>
      }
    >
      <form id="co-revoke" className="stack" onSubmit={submit}>
        <p>
          It stops working at once for every program that uses it.{" "}
          {token.person.name} is told, with your reason, and can make a new one.
        </p>
        <div className="field">
          <label htmlFor="co-revoke-why">Reason</label>
          <input
            id="co-revoke-why"
            className="input"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            minLength={3}
            maxLength={300}
            required
            placeholder="For example: the script is retired"
          />
        </div>
      </form>
    </Modal>
  );
}
