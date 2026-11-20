import type { Guide } from '../types.ts';

const guide: Guide = {
  id: 'trouble-sign-in',
  section: 'troubleshooting',
  title: 'Sign-in problems',
  status: 'live',
  what: 'What to do when you cannot sign in to BIZOMAT ERP or CAD Automation, cannot accept an invitation, or were signed out unexpectedly. Each answer starts from the message the application shows.',
  purpose: [
    'Understand the message under the sign-in form.',
    'Confirm your email address when BIZOMAT asks for it.',
    'Get back in after a forgotten password or a lockout.',
    'Accept an invitation that does not seem to work.',
  ],
  who: [
    'Anyone who cannot sign in.',
    'People who were invited to a company or a tool.',
    'Company owners and administrators helping their team.',
  ],
  access: {
    path: ['bizomat.ai', 'Sign in', 'Sign in to BIZOMAT'],
    href: 'https://bizomat.ai/erp/',
    label: 'Open BIZOMAT ERP',
    note: 'One BIZOMAT account works for every system. Sign in on bizomat.ai with Sign in, which opens BIZOMAT ERP; in CAD Automation, choose Continue with BIZOMAT.',
  },
  tutorials: [
    {
      id: 'cannot-sign-in',
      title: 'Work out why you cannot sign in',
      outcome: 'You know what the message means and what to do next.',
      steps: [
        { title: 'Use the right page', body: 'On bizomat.ai choose Sign in. It opens Sign in to BIZOMAT, the one sign-in for BIZOMAT ERP and every tool in it.', where: 'Sign in to BIZOMAT' },
        {
          title: 'Use the way you signed up',
          body: 'If you created your account with Google, choose Continue with Google (where it is shown). Otherwise type your email and password.',
        },
        {
          title: 'Read the message under the form',
          body: '"Invalid email or password" means the email or password is not right, or the account cannot sign in. Check the spelling of your email address and that Caps Lock is off.',
          where: 'Invalid email or password',
        },
        {
          title: 'Confirm your email if asked',
          body: '"Confirm your email address first" means your address is not confirmed yet. Open the link in the email BIZOMAT sent, then sign in. No email? Choose Send the link again and check your spam folder.',
          where: 'Send the link again',
        },
        {
          title: 'Wait after a lockout',
          body: '"This account is temporarily locked after repeated failed sign-ins. Try again later." appears after ten wrong passwords in a row. Wait 15 minutes, then try again with the right password.',
        },
        {
          title: 'If you forgot your password',
          body: 'Forgot your password? appears under the form only where BIZOMAT has switched self-service password reset on, and it is off for now. Otherwise contact BIZOMAT support through the contact page. Once they have confirmed who you are, they can set a temporary password, and you choose your own the next time you sign in.',
        },
      ],
      after: 'Once you are in, you can change your password and see where you are signed in under Projects and Tasks, Settings, Security.',
    },
    {
      id: 'accept-invitation',
      title: 'Accept an invitation that does not work',
      outcome: 'You have joined the company or tool you were invited to.',
      steps: [
        { title: 'Open the link in the invitation', body: 'Open the link in the invitation email, or the link the person who invited you shared. Knowing that you were invited is not enough: the link is what lets you join.' },
        {
          title: 'Sign in with the invited address',
          body: 'An invitation works only for the email address it was sent to. If you see "This invitation was sent to" another address, sign out and sign in with that address, or ask for an invitation to the address you use.',
        },
        {
          title: 'Check that it is still valid',
          body: '"This invitation has expired" or "This invitation has already been used" means you need a new one. Ask the person who invited you to send it again.',
        },
        {
          title: 'See your pending invitations',
          body: 'Signed in, the Invitations page lists the invitations sent to your address, who sent them and when they expire. To accept one, you still open its link.',
          where: 'Invitations',
        },
      ],
      after: 'The company or tool then appears in BIZOMAT ERP, in the company menu at the top of the side menu.',
    },
  ],
  faqs: [
    {
      q: 'What does "Invalid email or password" mean?',
      a: 'The email address or the password is not right. The same message is shown when an account has been disabled, so that the page never reveals which accounts exist. Check the address, check Caps Lock, and try again. After ten wrong tries in a row the account is locked for 15 minutes.',
    },
    {
      q: 'It says the account is temporarily locked.',
      a: '"This account is temporarily locked after repeated failed sign-ins. Try again later." Wait 15 minutes. A successful sign-in afterwards clears the count.',
    },
    {
      q: 'It says "Too many attempts. Try again in" a number of seconds.',
      a: 'Too many sign-in attempts came from your connection or for your email address in a short time. Wait for the time shown, then try once, carefully.',
    },
    {
      q: 'It asks me to confirm my email address first.',
      a: 'BIZOMAT has sent a confirmation link to your address. Open it, then sign in. If the email does not arrive within a few minutes, choose Send the link again and check your spam or junk folder.',
    },
    {
      q: 'I forgot my password. Can I reset it myself?',
      a: 'Not yet for most people. The Forgot your password? link appears only where BIZOMAT has switched self-service password reset on, and it is off for now. Contact BIZOMAT support through the contact page: after confirming who you are, they can set a temporary password. Your other sign-ins and API tokens end, and you choose your own password the next time you sign in.',
    },
    {
      q: 'Why does it say "Choose a new password" after I signed in?',
      a: 'Someone else set your password, for example BIZOMAT support after a lost password, or BIZOMAT ended every sign-in for security. Choose a new password: it signs you out everywhere else.',
    },
    {
      q: 'What makes a password acceptable?',
      a: 'At least 10 characters, with letters and at least one number or symbol, and not containing the name part of your email address.',
    },
    {
      q: 'It says "Sign-up is by invitation only".',
      a: 'New accounts are made by invitation on this service. Ask someone in the company or tool you want to join to invite you, then open the link in their invitation.',
    },
    {
      q: 'My invitation says it was sent to another address.',
      a: 'An invitation works only for the address it was sent to. Sign in with that address, or ask the person who invited you to invite the address you use.',
    },
    {
      q: 'My invitation has expired.',
      a: 'Invitations expire after a set time (7 or 14 days, depending on the tool) and work once. Ask the person who invited you for a new one.',
    },
    {
      q: 'Google sign-in says my email is not verified, or cannot be used here.',
      a: '"Your Google email address is not verified" means Google has not confirmed that address: confirm it with Google, or sign in with email and password. "This email address cannot be used here" means the address is not accepted for BIZOMAT accounts: use your work or personal email address.',
    },
    {
      q: 'It says my company account is suspended.',
      a: '"This company account is suspended. Contact BIZOMAT support." BIZOMAT has suspended that company, so its tools are closed to everyone in it. Contact BIZOMAT support through the contact page.',
    },
    {
      q: 'Is there two-factor sign-in?',
      a: "Two-factor sign-in is used by BIZOMAT's own platform administrators for the platform console. There is no two-factor setting for other accounts today.",
    },
    {
      q: 'I was signed out unexpectedly.',
      a: 'Changing your password signs you out everywhere else, and so does choosing Sign out others under Active sessions. Sign in again. To see where you are signed in, open Projects and Tasks, Settings, Security, Active sessions.',
    },
    {
      q: 'How do I sign in to CAD Automation?',
      a: 'Open bizomat.ai/cad and choose Continue with BIZOMAT, then Continue as your name on bizomat.ai. An older CAD Automation account with an email and password signs in on the same page; its own page says "Forgot your password? Ask your administrator.", meaning the administrator of that CAD Automation server.',
    },
    {
      q: 'CAD Automation says my account is suspended.',
      a: 'The administrator of CAD Automation suspended the account: sign-in, AI apps and paired computers stop until they resume it. Ask them.',
    },
  ],
  related: ['account-and-sign-in', 'security', 'trouble-access', 'companies'],
  notYet: [
    { text: 'Resetting a forgotten password yourself, by an email link: built, but switched off for now.', status: 'in-development' },
  ],
  keywords: ['login', 'log in', 'cannot sign in', 'password', 'forgot password', 'reset password', 'locked out', 'invitation', 'invite link', 'confirm email', 'verification email', 'two-factor', '2FA', 'suspended', 'Google sign-in'],
  sources: [
    'apps/work/src/worker/routes/auth.ts',
    'apps/work/src/worker/auth/session.ts',
    'apps/work/src/worker/auth/password.ts',
    'apps/work/src/worker/routes/admin.ts',
    'apps/work/src/worker/services/invitations.ts',
    'apps/work/src/worker/erp/access.ts',
    'apps/work/src/worker/platform/flags.ts',
    'apps/work/src/worker/platform/security.ts',
    'apps/work/src/client/pages/Auth.tsx',
    'apps/work/src/client/pages/ChoosePassword.tsx',
    'apps/work/src/client/pages/MyInvitations.tsx',
    'apps/work/src/client/pages/settings/Security.tsx',
    'apps/work/src/client/company/CompanyApp.tsx',
    'apps/cad/opensketch/auth.py',
    'apps/cad/opensketch/mcpauth.py',
    'docs/platform/compliance.md',
  ],
  updated: '2026-11-20',
};

export default guide;
