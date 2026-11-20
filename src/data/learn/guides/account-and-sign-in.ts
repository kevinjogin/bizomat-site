import type { Guide } from '../types.ts';

// One BIZOMAT account and one sign-in for every module. Facts: the sign-in pages (apps/work/src/client/pages/Auth.tsx,
// served at /erp/login by apps/work/src/client/App.tsx), the ERP's top bar (apps/work/src/client/system/SystemApp.tsx:
// ThemeButton, Profile), the account settings (apps/work/src/client/pages/settings/Profile.tsx and Security.tsx), the
// server rules (apps/work/src/worker/routes/auth.ts: email confirmation, 10 failed sign-ins lock the account for 15
// minutes) and the flag self_service_password_reset (apps/work/src/worker/platform/flags.ts, off).
const guide: Guide = {
  id: 'account-and-sign-in',
  section: 'getting-started',
  title: 'Your account and signing in',
  short: 'Account and sign-in',
  status: 'live',
  what: 'You have one BIZOMAT account, an email address and a password, for every module of BIZOMAT ERP and for CAD Automation. You sign in once at bizomat.ai/erp/login and move between the modules without signing in again.',
  purpose: [
    'Create your account and confirm your email address.',
    'Sign in and sign out of BIZOMAT ERP.',
    'Change your password, name, time zone and photo.',
    'Choose a light or dark screen on each computer.',
    'Use the same account in CAD Automation.',
  ],
  who: ['Everyone who uses BIZOMAT', 'People invited by a company', 'Owners setting up their first company'],
  access: {
    path: ['BIZOMAT ERP', 'Sign in'],
    href: 'https://bizomat.ai/erp/',
    label: 'Open BIZOMAT ERP',
    note: 'Signed out, this opens the sign-in page, bizomat.ai/erp/login. Sign in on the website also leads there.',
  },
  tutorials: [
    {
      id: 'create-account',
      title: 'Create your BIZOMAT account',
      outcome: 'You have a BIZOMAT account and can sign in to BIZOMAT ERP.',
      steps: [
        { title: 'Open the sign-in page', body: 'Go to bizomat.ai/erp. You see Sign in to BIZOMAT.', where: 'Sign in to BIZOMAT' },
        { title: 'Choose Create an account', body: 'Under the form, next to New here?, choose Create an account. If the page says "Accounts are created by invitation." instead, ask the company that wants you for an invitation.', where: 'Create an account' },
        { title: 'Fill in your details', body: 'Enter your Full name, your Work email and a Password of at least 10 characters, with letters and a number or symbol.', where: 'Work email' },
        { title: 'Create the account', body: 'Choose Create account.', where: 'Create account' },
        { title: 'Confirm your email address', body: 'If you see Check your inbox, open the link in the email BIZOMAT sent you. The link works for 24 hours. No email? Choose Send the link again and look in the spam folder too.', where: 'Send the link again' },
        { title: 'Sign in', body: 'The link opens Email address confirmed. Choose Sign in and enter your email and password.', where: 'Sign in' },
      ],
      after: 'BIZOMAT ERP opens on your own company and prepares your example company, Acme Studio (example), to learn with. Then set up your company (/learn/companies/).',
    },
    {
      id: 'sign-in-out',
      title: 'Sign in and sign out',
      outcome: 'You can start and end a session in BIZOMAT ERP.',
      steps: [
        { title: 'Open the sign-in page', body: 'Go to bizomat.ai/erp/login, or choose Sign in at the top of any bizomat.ai page.', where: 'Sign in to BIZOMAT' },
        { title: 'Enter your email and password', body: 'Type the email and password of your BIZOMAT account. Continue with Google appears above the form only where Google sign-in is set up on the service.', where: 'Email' },
        { title: 'Choose Sign in', body: 'The Dashboard of the company you used last opens. If a page sent you to sign in, you go back to that page instead.', where: 'Sign in' },
        { title: 'Open the profile menu', body: 'To finish, choose your picture or initials at the right of the top bar.', where: 'Profile menu' },
        { title: 'Choose Sign out', body: 'You are signed out on this browser and the sign-in page opens. Other computers stay signed in until you sign them out.', where: 'Sign out' },
      ],
    },
    {
      id: 'change-password',
      title: 'Change your password',
      outcome: 'Your password is changed and every other sign-in has ended.',
      steps: [
        { title: 'Open Profile and security', body: 'In the top bar, open the profile menu and choose Profile and security. The Settings page of your account opens.', where: 'Profile and security' },
        { title: 'Open the Security tab', body: 'Under Account, choose Security.', where: 'Security' },
        { title: 'Fill in Change password', body: 'Enter your Current password, then the New password (at least 10 characters with letters and a number or symbol) and Confirm new password.', where: 'Change password' },
        { title: 'Choose Update password', body: 'You see "Password updated. Other sessions were signed out." Every other browser and device must sign in again, and every personal API token you made stops working.', where: 'Update password' },
      ],
      after: 'Make new API tokens if a script or integration used one (/learn/security/).',
    },
    {
      id: 'theme-and-profile',
      title: 'Set your name, photo and theme',
      outcome: 'Your profile shows your name and photo, and the screen is light or dark as you like on this computer.',
      steps: [
        { title: 'Choose a theme in the top bar', body: 'On a computer, choose the sun or moon button in the top bar and pick Light, Dark or Match this computer.', where: 'Theme' },
        { title: 'Open Profile and security', body: 'In the profile menu choose Profile and security. The Profile tab opens.', where: 'Profile and security' },
        { title: 'Change your details', body: 'Change your Full name and Time zone (it decides due dates in My Work). Upload photo adds a picture (PNG, JPEG, GIF or WebP, up to 5 MB). Your sign-in email cannot be changed here.', where: 'Upload photo' },
        { title: 'Choose the theme on a phone', body: 'The top bar’s theme button is not shown on a phone. Use Theme on this computer on the Profile tab: Match system, Light or Dark.', where: 'Theme on this computer' },
        { title: 'Save', body: 'Choose Save changes. The theme is kept on this computer only; another computer follows its own system theme until you choose there.', where: 'Save changes' },
      ],
    },
    {
      id: 'cad-same-account',
      title: 'Use the same account in CAD Automation',
      outcome: 'You are signed in to CAD Automation with your BIZOMAT account.',
      steps: [
        { title: 'Find CAD Automation in the ERP', body: 'Choose Products and Engineering in the rail, then the CAD Automation tab. It lists the set-up steps and your computers.', where: 'CAD Automation' },
        { title: 'Open CAD Automation', body: 'Choose Open CAD Automation, or go to bizomat.ai/cad.', where: 'Open CAD Automation' },
        { title: 'Choose Continue with BIZOMAT', body: 'On CAD Automation’s sign-in page, choose Continue with BIZOMAT. You sign in on bizomat.ai with your BIZOMAT account; there is no second account to make.', where: 'Continue with BIZOMAT' },
      ],
      after: 'Set up the add-in and your AI assistant (/learn/cad-automation/).',
    },
  ],
  buttons: [
    { label: 'Sign in', does: 'Starts a session with your email and password.', when: 'Each time your session has ended.', after: 'The Dashboard, or the page that asked you to sign in, opens.' },
    { label: 'Create an account', does: 'Opens the form for a new BIZOMAT account.', when: 'The first time you use BIZOMAT, if sign-up is open.', after: 'You may be asked to confirm your email address before you can sign in.' },
    { label: 'Send the link again', does: 'Sends a new email confirmation link.', when: 'The first link did not arrive or has expired.', after: 'The new link works for 24 hours.' },
    { label: 'Continue with Google', does: 'Signs you in with a Google account that has the same email address.', when: 'Only where Google sign-in is set up on the service.' },
    { label: 'Profile and security', does: 'Opens your account settings: Profile, Notifications and Security.', when: 'To change your name, photo, time zone, theme, password, sessions or API tokens.' },
    { label: 'Sign out', does: 'Ends your session on this browser.', when: 'On a shared computer, or when you finish.', after: 'The sign-in page opens.' },
    { label: 'Update password', does: 'Saves a new password.', when: 'To change a password you know.', after: 'Other sessions are signed out and your API tokens stop working.' },
    { label: 'Theme', does: 'Switches between Light, Dark and Match this computer.', when: 'When the screen is too bright or too dark.', after: 'The choice is kept on this computer only.' },
    { label: 'Continue with BIZOMAT', does: 'Signs you in to CAD Automation with your BIZOMAT account.', when: 'When CAD Automation asks you to sign in.' },
  ],
  faqs: [
    { q: 'I forgot my password. What do I do?', a: 'A Forgot your password? link appears on the sign-in page only once self-service password reset is switched on, and it is not yet. Until then, contact BIZOMAT through bizomat.ai/contact/. After confirming who is asking, BIZOMAT can set a temporary password; when you sign in with it, you must choose your own on the Choose a new password page before anything else.' },
    { q: 'Why does it say "Confirm your email address first"?', a: 'Your address has not been confirmed yet. Open the link in the email BIZOMAT sent, then sign in. Choose Send the link again for a new one; it works for 24 hours. Signing up from an invitation link counts as confirming the address.' },
    { q: 'Why is my account locked?', a: 'After 10 wrong passwords in a row the account is locked for 15 minutes, and the page says "This account is temporarily locked after repeated failed sign-ins. Try again later." Wait, then sign in with the right password (/learn/trouble-sign-in/).' },
    { q: 'Do I need separate accounts for the CRM, Finance, Projects or CAD Automation?', a: 'No. One BIZOMAT account opens every module of BIZOMAT ERP. CAD Automation takes the same account: choose Continue with BIZOMAT on its sign-in page.' },
    { q: 'Why was I signed out?', a: 'A sign-in lasts a fixed time (three days on bizomat.ai) and then ends. You are also signed out everywhere else when you change your password, and a single session ends when you revoke it under Active sessions (/learn/security/).' },
    { q: 'Can I change the email address I sign in with?', a: 'Not in your profile: the Profile tab says "Your sign-in email cannot be changed here." Contact BIZOMAT through bizomat.ai/contact/ if it must change.' },
    { q: 'Is there two-factor sign-in?', a: 'Not for customer accounts. Two-factor sign-in with an authenticator app is used today only by BIZOMAT’s own platform administrators for the platform console. You sign in with your email and password, or with Google where it is set up.' },
    { q: 'Why does the screen look different on my other computer?', a: 'The theme belongs to the computer, not the account. Each computer opens in its own system theme until you choose Light or Dark on it.' },
  ],
  related: ['what-is-bizomat', 'navigation', 'security', 'trouble-sign-in', 'cad-automation'],
  notYet: [
    { text: 'A Forgot your password? link on the sign-in page that sends a one-hour reset link to your confirmed address.', status: 'in-development' },
  ],
  keywords: ['login', 'log in', 'log out', 'logout', 'sign up', 'register account', 'password', 'reset password', 'forgot password', 'email confirmation', 'verify email', 'dark mode', 'light mode', 'theme', 'profile', 'single sign-on', 'SSO', 'Google'],
  sources: [
    'apps/work/src/client/pages/Auth.tsx',
    'apps/work/src/client/App.tsx',
    'apps/work/src/client/pages/ChoosePassword.tsx',
    'apps/work/src/client/pages/Settings.tsx',
    'apps/work/src/client/pages/settings/Profile.tsx',
    'apps/work/src/client/pages/settings/Security.tsx',
    'apps/work/src/client/system/SystemApp.tsx',
    'apps/work/src/client/admin/pages/UserDetail.tsx',
    'apps/work/src/worker/routes/auth.ts',
    'apps/work/src/worker/auth/session.ts',
    'apps/work/src/worker/platform/flags.ts',
    'apps/work/src/worker/platform/security.ts',
    'apps/cad/opensketch/auth.py',
    'fly.website.toml',
    'docs/platform/compliance.md',
  ],
  updated: '2026-11-20',
};

export default guide;
