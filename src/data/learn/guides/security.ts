import type { Guide } from '../types.ts';

// Account and company security. Facts: the Security tab of the account settings
// (apps/work/src/client/pages/settings/Security.tsx: Change password, Active sessions, Sign-in methods, Personal API
// tokens, Export your data), the token rules on the server (apps/work/src/worker/routes/me.ts: one company, 1 to 365
// days, 90 by default), session length (apps/work/src/worker/auth/session.ts; fly.website.toml sets 72 hours), the
// lockout (apps/work/src/worker/routes/auth.ts), support access (apps/work/src/client/company/Pages.tsx SupportAccess,
// docs/platform/roles.md) and suspension (apps/work/src/worker/erp/access.ts; docs/platform/members.md, flag off).
const guide: Guide = {
  id: 'security',
  section: 'admin',
  title: 'Security: sessions, API tokens and support access',
  short: 'Security',
  status: 'live',
  what: 'Security covers how you keep your BIZOMAT account and your company safe: your password, the devices signed in, personal API tokens for scripts and integrations, and the time-limited access BIZOMAT support can be given to a company.',
  purpose: [
    'See every device signed in to your account and sign out the ones you do not know.',
    'Make API tokens limited to one company, some applications or reading only, with an end date.',
    'Revoke a token or a session at once.',
    'See and end BIZOMAT support’s access to your company.',
    'Understand what happens when an account or a company is suspended.',
  ],
  who: ['Everyone with a BIZOMAT account', 'Company owners and administrators', 'People who connect scripts or other software to BIZOMAT'],
  access: {
    path: ['BIZOMAT ERP', 'Administration', 'Profile and security', 'Security'],
    href: 'https://bizomat.ai/erp/administration',
    label: 'Open Administration',
    note: 'Under You, choose Profile and security, then the Security tab. The profile menu in the top bar has Profile and security too.',
  },
  tutorials: [
    {
      id: 'check-sessions',
      title: 'Check where you are signed in',
      outcome: 'Only your own devices are signed in to your account.',
      steps: [
        { title: 'Open the Security tab', body: 'In the profile menu choose Profile and security, then Security under Account.', where: 'Security' },
        { title: 'Read Active sessions', body: 'Each line shows the browser and system, how you signed in, the IP address, when it was last active and when it expires. This device marks the one you are using.', where: 'Active sessions' },
        { title: 'Revoke one session', body: 'Choose Revoke on a line you do not recognise. That device is signed out at once.', where: 'Revoke' },
        { title: 'Sign out everywhere else', body: 'Choose Sign out all others and confirm with Sign out others. Every other browser and device is signed out.', where: 'Sign out all others' },
        { title: 'Change your password if in doubt', body: 'If a session was not yours, change your password under Change password with Update password: it signs out every other session and ends every API token.', where: 'Update password' },
      ],
    },
    {
      id: 'make-token',
      title: 'Make a personal API token',
      outcome: 'A script or integration can call the BIZOMAT API as you, in one company, until the token expires.',
      steps: [
        { title: 'Open Personal API tokens', body: 'On the Security tab, find Personal API tokens and choose New token.', where: 'New token' },
        { title: 'Name it', body: 'Give it a Name that says what uses it, for example Reporting script.', where: 'Name' },
        { title: 'Choose the company', body: 'Under Company, choose the one company the token may act in.', where: 'Company' },
        { title: 'Limit it', body: 'Under Applications, tick only what it needs: Projects, CRM, Finance, ERP modules or Company administration. None ticked means all of them. Tick Read only if it never needs to change anything.', where: 'Read only' },
        { title: 'Choose when it expires', body: 'Under Expires choose In 30 days, In 90 days or In 1 year.', where: 'Expires' },
        { title: 'Create and copy it', body: 'Choose Create token. Copy the token now with Copy: it will not be shown again. Choose Done.', where: 'Create token' },
        { title: 'Use it', body: 'Send it in the header Authorization: Bearer followed by the token. It acts with your own permissions in that company, never more.' },
      ],
      after: 'The token is listed with its company, applications, last use and expiry. Revoke it as soon as it is no longer needed.',
    },
    {
      id: 'revoke-token',
      title: 'Revoke an API token',
      outcome: 'The token stops working at once.',
      steps: [
        { title: 'Open Personal API tokens', body: 'On the Security tab, find the token by its name and the start of its code.', where: 'Personal API tokens' },
        { title: 'Choose Revoke', body: 'Choose Revoke on its line and confirm. Applications using it stop working immediately.', where: 'Revoke' },
        { title: 'Replace it if still needed', body: 'If a script still needs access, choose New token and make a new one with the same limits, then give the script the new token.', where: 'New token' },
      ],
    },
    {
      id: 'support-access',
      title: 'See and end BIZOMAT support’s access',
      outcome: 'You know whether BIZOMAT support can look at your company, and you have ended it if you want.',
      needs: 'The company’s owner or an administrator.',
      steps: [
        { title: 'Open Company settings', body: 'Choose Administration in the rail, then Company settings.', where: 'Company settings' },
        { title: 'Find BIZOMAT support access', body: 'Each time support opened access is listed: who, the reason, and until when (or when it ended). Support has never opened access shows when there are none.', where: 'BIZOMAT support access' },
        { title: 'End it', body: 'Choose End now on an active grant. You see "Support access ended".', where: 'End now' },
      ],
      after: 'Each opening, each view and each end is also in the company’s Activity.',
    },
  ],
  buttons: [
    { label: 'Update password', does: 'Changes your password.', when: 'If your password may be known to someone else, or a session was not yours.', after: 'Other sessions are signed out and every API token ends.' },
    { label: 'Revoke (session)', does: 'Signs out one device.', when: 'You do not recognise it, or left it signed in somewhere.' },
    { label: 'Sign out all others', does: 'Signs out every browser and device but this one.', when: 'After a lost phone or a shared computer.' },
    { label: 'Link Google', does: 'Adds Google as a way to sign in, where Google sign-in is set up on the service.', when: 'You prefer to sign in with Google; Unlink removes it.' },
    { label: 'New token', does: 'Makes a personal API token for one company.', when: 'A script or another program must call the BIZOMAT API.', after: 'The token is shown once; copy it then.' },
    { label: 'Revoke (token)', does: 'Ends an API token at once.', when: 'It is no longer used, or may have leaked.' },
    { label: 'End now', does: 'Ends BIZOMAT support’s access to the company.', when: 'Support no longer needs to look at the company.' },
  ],
  faqs: [
    { q: 'How long does a sign-in last?', a: 'A fixed time from when you signed in (three days on bizomat.ai); Active sessions shows when each expires. Then you sign in again.' },
    { q: 'What can an API token do?', a: 'Exactly what you can do, in the one company you chose, limited further to the applications you ticked and to reading if you ticked Read only. It ends on its expiry date, when you revoke it, when you change your password, and when you leave or are removed from that company.' },
    { q: 'I have an older token that says "Every company you are in". What is that?', a: 'It was made before tokens were limited to one company. Revoke it and make a new one for the company it is used in.' },
    { q: 'Can BIZOMAT support see our records?', a: 'No. A platform administrator can open access to a registered company for at most 72 hours, with a reason and after signing in again with a second factor. While it lasts they can read the company’s people and roles, tools and registration. They never sign in as anyone and never read records. The owner and administrators see each grant and can end it.' },
    { q: 'What happens when a company is suspended?', a: 'Its ERP modules answer "This company account is suspended. Contact BIZOMAT support." and its Dashboard says the tools stay as they are. Contact BIZOMAT through bizomat.ai/contact/.' },
    { q: 'Why is my account locked?', a: 'After 10 wrong passwords in a row it is locked for 15 minutes. Wait, then sign in with the right password (/learn/trouble-sign-in/).' },
    { q: 'Can I turn on two-factor sign-in?', a: 'Not for customer accounts yet. Two-factor sign-in is used today by BIZOMAT’s platform administrators for the platform console. Keep a strong password and check Active sessions.' },
    { q: 'Who can see which API tokens exist for our company?', a: 'Each person sees and revokes their own tokens on their Security tab. A company-wide list with revocation by administrators is part of the Company Admin console, which is not switched on yet.' },
  ],
  related: ['account-and-sign-in', 'company-administration', 'roles-and-permissions', 'integrations', 'trouble-sign-in', 'data-management'],
  notYet: [
    { text: 'The company’s API tokens in one list, revoked by administrators with a reason (Company Admin console, Security).', status: 'in-development' },
    { text: 'Suspending one member of a company while keeping their account and other companies.', status: 'in-development' },
  ],
  keywords: ['security', 'session', 'sessions', 'devices', 'sign out everywhere', 'API', 'API key', 'API token', 'bearer token', 'personal access token', 'revoke', 'support access', 'suspended', 'locked', 'two-factor', '2FA', 'MFA'],
  sources: [
    'apps/work/src/client/pages/settings/Security.tsx',
    'apps/work/src/client/pages/Settings.tsx',
    'apps/work/src/worker/routes/me.ts',
    'apps/work/src/worker/auth/session.ts',
    'apps/work/src/worker/routes/auth.ts',
    'apps/work/src/worker/company/routes.ts',
    'apps/work/src/client/company/Pages.tsx',
    'apps/work/src/client/system/SystemApp.tsx',
    'apps/work/src/worker/erp/access.ts',
    'apps/work/src/worker/platform/security.ts',
    'apps/work/src/worker/platform/flags.ts',
    'fly.website.toml',
    'docs/platform/roles.md',
    'docs/platform/company-context.md',
    'docs/platform/company-admin.md',
    'docs/platform/members.md',
  ],
  updated: '2026-11-20',
};

export default guide;
