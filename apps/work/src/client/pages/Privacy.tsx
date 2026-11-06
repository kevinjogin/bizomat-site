import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductLockup } from '../components/ui/Icon';
import { BRAND, PLATFORM_URLS, pageTitle, platformLinkProps } from '../lib/brand';

const RETENTION: [string, string][] = [
  ['Your account (name, email, settings)', 'Until you ask us to delete your account'],
  ['Content you create (boards, tasks, documents, files)', 'Until you or your workspace delete it'],
  ['Usage events (e.g. "created a project", "completed a task" — never the content)', 'Kept as product history'],
  ['Daily activity (which days you used the app)', 'Kept as product history'],
  ['Sign-in sessions (sign-in time, last activity, device type, browser, operating system)', '365 days after the session ends'],
  ['IP address of a sign-in session (security and abuse prevention)', '30 days'],
  ['Anonymous page-view counts for signed-out visitors (totals only)', 'Kept as product history'],
  ['Technical error records (no personal content)', '90 days'],
];

export default function Privacy() {
  useEffect(() => {
    document.title = pageTitle('Privacy');
  }, []);
  return (
    <div className="auth-wrap" style={{ alignItems: 'flex-start' }}>
      <article className="card" style={{ maxWidth: 820, width: '100%', padding: '28px 32px', lineHeight: 1.6 }}>
        <div className="auth-brand">
          <ProductLockup height={20} />
        </div>
        <h1>Privacy notice</h1>
        <p className="muted">{BRAND.full} · Last updated {BRAND.privacyUpdated}</p>

        <h2 style={{ marginTop: 20 }}>Who we are</h2>
        <p>
          {BRAND.full} is a work management service on the {BRAND.platform} platform. This notice explains what personal information we collect
          when you use it, why, how long we keep it and your choices. We handle personal information in line with the Australian Privacy Principles in the <em>Privacy Act 1988</em> (Cth).
        </p>

        <h2 style={{ marginTop: 20 }}>What we collect and why</h2>
        <ul>
          <li><strong>Account details</strong> — your name, email address and a one-way hash of your password, so you can sign in. We never store your password itself.</li>
          <li><strong>Your content</strong> — boards, tasks, documents, comments and files you or your teammates create, so the service can work.</li>
          <li>
            <strong>Usage and session information</strong> — when you sign in and out, when your signed-in session was last active, and the general type of device, browser and operating
            system (for example “desktop · Chrome · Windows”). While the app is open and you are using it, your browser sends a small “still active” signal about once a minute; it
            contains no content. We also record product events such as “created a project” or “completed a task” — <em>not</em> what the project or task says. We use this to understand
            whether the product is useful, to fix problems and to keep accounts secure.
          </li>
          <li><strong>Security information</strong> — the IP address used to sign in, and failed sign-in attempts, to protect your account. IP addresses are deleted after 30 days.</li>
          <li><strong>Signed-out visitors</strong> — we only count page views as daily totals. We do not set tracking cookies, identify you, or build a profile of signed-out visitors.</li>
        </ul>

        <h2 style={{ marginTop: 20 }}>Cookies</h2>
        <p>We use one essential cookie to keep you signed in (and a short-lived one during Google sign-in, if enabled). We do not use advertising or third-party analytics cookies.</p>

        <h2 style={{ marginTop: 20 }}>Who can see it</h2>
        <p>
          People in your workspaces see the content shared with them. A small number of authorised {BRAND.platform} administrators can see account and usage information (for example your
          email, sign-in times and how many projects you have created) to operate and improve the service. Administrators cannot see passwords or sign-in tokens, and their access is
          logged. We do not sell personal information or share it for advertising.
        </p>

        <h2 style={{ marginTop: 20 }}>Where it is stored</h2>
        <p>
          The service runs on Cloudflare’s global infrastructure (Workers, D1, R2), so information may be processed or stored outside Australia. We rely on Cloudflare’s security
          and contractual commitments to protect it.
        </p>

        <h2 style={{ marginTop: 20 }}>How long we keep it</h2>
        <table className="data-table">
          <thead><tr><th>Information</th><th>Kept for</th></tr></thead>
          <tbody>
            {RETENTION.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}
          </tbody>
        </table>

        <h2 style={{ marginTop: 20 }}>Your choices and rights</h2>
        <p>
          You can view and update your profile at any time, sign out of sessions from <em>Settings → Security</em>, and ask us for access to, correction of or deletion of your personal
          information. Contact <a href={`mailto:${BRAND.privacyContact}`}>{BRAND.privacyContact}</a>. If you are not satisfied with our response you may complain to the Office of the
          Australian Information Commissioner (oaic.gov.au).
        </p>

        <h2 style={{ marginTop: 20 }}>Platform policies</h2>
        <p>
          This notice covers {BRAND.full}. See also the {BRAND.platform} platform's <a {...platformLinkProps(PLATFORM_URLS.privacy)}>privacy policy</a>,{' '}
          <a {...platformLinkProps(PLATFORM_URLS.terms)}>terms</a> and <a {...platformLinkProps(PLATFORM_URLS.disclaimer)}>disclaimer</a>.
        </p>

        <p style={{ marginTop: 28 }}>
          <Link to="/">Back to {BRAND.full}</Link>
        </p>
      </article>
    </div>
  );
}
